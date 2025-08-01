import { Shop } from "../models/shop.model.js";
import { Order } from "../models/order.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const shop = await Shop.findById(userId);
    const accessToken = shop.generateAccessToken();
    const refreshToken = shop.generateRefreshToken();
    shop.refreshToken = refreshToken;
    await shop.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerShop = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check for existing shop with same email or phone
    const existingShop = await Shop.findOne({ $or: [{ email }, { phone }] });

    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: "Shop already registered with this email or phone",
      });
    }

    // Create new shop (password hash handled in schema)
    const shop = await Shop.create({
      name,
      email,
      password,
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      message: "Shop registered successfully. Awaiting admin approval.",
      shop: {
        id: shop._id,
        name: shop.name,
        email: shop.email,
        isApproved: shop.isApproved,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginShop = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const shop = await Shop.findOne({ email });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (!shop.isApproved) {
      return res.status(403).json({ message: "Access Denied: Not approved" });
    }

    const isPasswordValid = await shop.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      shop._id
    );

    
    await shop.save();

    const loggedInShop = await Shop.findById(
      shop._id
    ).select("-password -refreshToken");

    const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
        };
        

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Shop logged in successfully",
        
          shop: loggedInShop,

          token: accessToken,
           
        
      });
  } catch (error) {
    console.error("Error logging in Shop:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutShop = async(req,res)=>{
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json({message:"Logged out successfully"});
}

const getMyDetails = async (req, res) => {
  try {
    const shopId = req.shop._id; // Assuming you attach this in your auth middleware

    const shop = await Shop.findById(shopId).select('-password');
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    return res.status(200).json({
      message: "Shop details fetched successfully",
      data: shop,
    });
  } catch (error) {
    console.error("Error fetching shop details:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find({});
    return res.status(200).json({
      success: true,
      count: shops.length,
      data: shops,
    });
  } catch (error) {
    console.error("Error fetching shop:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const assignOrderToShop = async (req, res) => {
  const { orderId, shopId } = req.body;

  if (!orderId || !shopId) {
    return res
      .status(400)
      .json({ message: "Order ID and Shop ID are required" });
  }

  try {
    // Check if the order exists and is not already assigned
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.assignedTo) {
      return res.status(400).json({ message: "Order already assigned" });
    }

    // Check if delivery partner exists and is available + approved
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    if (!shop.isApproved) {
      return res
        .status(403)
        .json({ message: "Shop is not approved" });
    }

    

    // Assign the order
    order.assignedTo = shopId;
    order.status = "Assigned"; // Optional: update status
    await order.save();

    // Optionally mark delivery partner as not available
    
    

   

    res.status(200).json({
      message: "Order assigned successfully",
      data: {
        orderId: order._id,
        assignedTo: shop.name,
      },
    });
  } catch (error) {
    console.error("Error assigning order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAssignedOrdersForShops = async (req, res) => {
  try {
    const shopId = req.shop._id; // set by verifyJWTDelivery middleware

    const orders = await Order.find({ assignedTo: shopId })
      .sort({ createdAt: -1 })
      .populate("customerId", "name address") // optional: include customer info
      .populate("assignedTo", "name phoneNumber") // optional: include delivery partner info
      .lean();

    return res.status(200).json({
      message: "Assigned orders fetched successfully",
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching assigned orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateOrderStatusByShop = async (req, res) => {
  try {
    const shopId = req.shop._id;
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Confirmed","Ready to Collect"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findOne({
      _id: orderId,
      assignedTo: shopId,
    });

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or not assigned to you" });
    }

    // Update current status and deliveredAt if needed
    order.status = status;
    

    // Add to statusHistory
    order.statusHistory.push({
      status,
      updatedAt: new Date(),
    });

    await order.save();

    res.status(200).json({
      message: "Order status updated and logged successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCompletedOrdersByShops = async (req, res) => {
  try {
    const shopId = req.shop._id;

    const completedOrders = await Order.find({
      shopAssigned: shopId,
      status: "Delivered",
    })
    // .populate("items.product", "name price") // optional
    // .populate("user", "name phoneNumber")    // optional
    .sort({ deliveredAt: -1 });

    const formattedOrders = completedOrders.map((order) => ({
      _id: order._id,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      address: order.address || "N/A",
      addressDetails: order.addressDetails || {},
      deliveredAt: new Date(order.deliveredAt || order.updatedAt).toLocaleString(),
      status: order.status,
      // Optional:
      // user: order.user ? { name: order.user.name, phone: order.user.phoneNumber } : null,
      // items: order.items.map(i => ({
      //   name: i.product.name,
      //   quantity: i.quantity,
      //   price: i.product.price
      // }))
    }));

    res.status(200).json({
      count: completedOrders.length,
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const updateProductAvailability = asyncHandler(async (req, res) => {
  const shopId = req.shop._id; // Assuming shop is attached in auth middleware
  const { orderId } = req.params;
  const { productId, available } = req.body;

  if (!productId || typeof available !== "boolean") {
    return res.status(400).json({ message: "Invalid product data" });
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const product = order.items.find(
    (item) => item.productId.toString() === productId
  );
  if (!product) {
    return res.status(404).json({ message: "Product not found in this order" });
  }

  product.isAvailable = available;
  await order.save();

  // ✅ Emit real-time event to clients (admin)
  io.emit("product-availability-updated", {
    orderId: order._id.toString(),
    productId: product.productId.toString(),
    productName: product.name,
    isAvailable: product.isAvailable,
  });

  res
    .status(200)
    .json({ message: "Product availability updated successfully" });
});

const getRegisteredShops = async (req, res) => {
  try {
    const registeredShops = await Shop.find({
      isApproved: false,
    }).select("-password ");
    res.status(200).json({
      success: true,
      count: registeredShops.length,
      data: registeredShops,
    });
  } catch (error) {
    console.error("Error fetching registered Shops:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

const approveShop = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const shop = await Shop.findOne({ email });

    if (!shop) {
      return res.status(404).json({ success: false, message: "Shop not found" });
    }

    if (shop.isApproved) {
      return res.status(200).json({ success: true, message: "Already approved" });
    }

    shop.isApproved = true;
    await shop.save();

    return res.status(200).json({ success: true, message: "Shop approved successfully" });
  } catch (error) {
    console.error("Error approving shop:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getAllShop = async (req, res) => {
  try {
    const shops = await Shop.find({});
    return res.status(200).json({
      success: true,
      count: shops.length,
      data: shops,
    });
  } catch (error) {
    console.error("Error fetching shops:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const searchShop = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ success: false, message: "Query is required" });
    }

    const searchRegex = new RegExp(query, "i");

    const result = await Shop.find({
      $or: [
        { _id: query.match(/^[0-9a-fA-F]{24}$/) ? query : undefined }, // only match _id if valid ObjectId
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
      ],
    }).select("-password ");

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "No shop found" });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error searching shop:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export {
    registerShop,
    loginShop,
    logoutShop,
    getMyDetails,
    getAllShops,
    assignOrderToShop,
    getAssignedOrdersForShops,
    updateOrderStatusByShop,
    getCompletedOrdersByShops,
    updateProductAvailability,
    getRegisteredShops,
    approveShop,
    getAllShop,
    searchShop
}