import { DeliveryPartner } from "../models/deliveryPartner.model.js";
import { Order } from "../models/order.models.js";
import { User } from "../models/user.models.js";
import { Product } from "../models/product.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import moment from "moment"

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const deliveryPartner = await DeliveryPartner.findById(userId);
    const accessToken = deliveryPartner.generateAccessToken();
    const refreshToken = deliveryPartner.generateRefreshToken();
    deliveryPartner.refreshToken = refreshToken;
    await deliveryPartner.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token"
    );
  }
};


//DP
const registerDeliveryPartner = async (req, res) => {
  try {
    const {
      email,
      name,
      password,
      phone,
      vehicleNumber,
      licenseNumber,
      isApproved,
      isAvailable,
    } = req.body;
    if (
  !email ||
  !name ||
  !password ||
  !phone ||
  !vehicleNumber ||
  !licenseNumber
) {
  return res.status(400).json({ message: "All fields are required" });
}

    const existingDeliveryPartner = await DeliveryPartner.findOne({ email });
    if (existingDeliveryPartner) {
      return res
        .status(400)
        .json({ message: "Delivery Partner already exists" });
    }

    const aadhaarProofLocalPath = req.files?.aadhaarProof[0]?.path;
    console.log(aadhaarProofLocalPath);
    if (!aadhaarProofLocalPath) {
      return res.status(400).json({ message: "Aadhar Proof is required" });
    }
    const aadhaarProof = await uploadOnCloudinary(aadhaarProofLocalPath);
    if (!aadhaarProof) {
      return res.status(400).json({ message: "Aadhaar Proof is required" });
    }

    const panCardProofLocalPath = req.files?.panCardProof[0]?.path;
    console.log(panCardProofLocalPath);
    if (!panCardProofLocalPath) {
      return res.status(400).json({ message: "Pan Card is required" });
    }
    const panCardProof = await uploadOnCloudinary(panCardProofLocalPath);
    if (!panCardProof) {
      return res.status(400).json({ message: "Pan Card Proof is required" });
    }

    const pucProofLocalPath = req.files?.pucProof[0]?.path;
    console.log(pucProofLocalPath);
    if (!pucProofLocalPath) {
      return res.status(400).json({ message: "Puc Proof is required" });
    }
    const pucProof = await uploadOnCloudinary(pucProofLocalPath);
    if (!pucProof) {
      return res.status(400).json({ message: "Puc Proof is required" });
    }

    const licenseProofLocalPath = req.files?.licenseProof[0]?.path;
    console.log(licenseProofLocalPath);
    if (!licenseProofLocalPath) {
      return res.status(400).json({ message: "License Proof is required" });
    }
    const licenseProof = await uploadOnCloudinary(licenseProofLocalPath);
    if (!licenseProof) {
      return res.status(400).json({ message: "License Proof is required" });
    }
    //const hashedPassword = await bcrypt.hash(password,10);
    const newDeliveryPartner = new DeliveryPartner({
      name,
      email,
      phone,
      password,
      vehicleNumber,
      licenseNumber,
      isApproved,
      isAvailable,
      pucProof: pucProof.url,
      licenseProof: licenseProof.url,
      aadhaarProof: aadhaarProof.url,
      panCardProof: panCardProof.url,
    });
    await newDeliveryPartner.save();
    return res
      .status(201)
      .json({ message: "Delivery Partner registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering delivery partner" });
  }
};

//DP
const deliveryPartnerLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const deliveryPartner = await DeliveryPartner.findOne({ email });

    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery Partner not found" });
    }

    if (!deliveryPartner.isApproved) {
      return res.status(403).json({ message: "Access Denied: Not approved" });
    }

    const isPasswordValid = await deliveryPartner.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      deliveryPartner._id
    );

    deliveryPartner.isAvailable = true;
    await deliveryPartner.save();

    const loggedInDeliveryPartner = await DeliveryPartner.findById(
      deliveryPartner._id
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
        message: "Delivery Partner logged in successfully",
        
          deliveryPartner: loggedInDeliveryPartner,

          token: accessToken,
           
        
      });
  } catch (error) {
    console.error("Error logging in delivery partner:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//DP
const logoutDeliveryPartner = async (req, res) => {
  try {
    const deliveryPartnerId = req.delivery._id; // Assuming protected route with auth

    // Mark as unavailable
    await DeliveryPartner.findByIdAndUpdate(deliveryPartnerId, {
      isAvailable: false,
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    return res
      .status(201)
      .json({ message: "Delivery Partner logged out successfully" });
  } catch (error) {
    console.error("Error logging out delivery partner:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//DP
const getMyDetails = async (req, res) => {
  try {
    const deliveryPartnerId = req.delivery._id; // Assuming you attach this in your auth middleware

    const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId).select('-password');
    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    return res.status(200).json({
      message: "Delivery partner details fetched successfully",
      data: deliveryPartner,
    });
  } catch (error) {
    console.error("Error fetching delivery partner details:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


//DP
const updateMyDetails = async (req, res) => {
  try {
    const deliveryPartnerId = req.delivery._id;

    const {
      name,
      phone,
      vehicleNumber,
      licenseNumber,
      password, // optional
    } = req.body;

    const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId);

    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    // Update fields if they are provided
    if (name) deliveryPartner.name = name;
    if (phone) deliveryPartner.phone = phone;
    if (vehicleNumber) deliveryPartner.vehicleNumber = vehicleNumber;
    if (licenseNumber) deliveryPartner.licenseNumber = licenseNumber;
    if (password) deliveryPartner.password = password; // make sure to hash if not hashed via middleware

    // Save updated details
    await deliveryPartner.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      data: {
        name: deliveryPartner.name,
        phone: deliveryPartner.phone,
        vehicleNumber: deliveryPartner.vehicleNumber,
        licenseNumber: deliveryPartner.licenseNumber,
        email: deliveryPartner.email,
      },
    });

  } catch (error) {
    console.error("Error updating delivery partner:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


//Admin
const getAllDeliveryPartner = async (req, res) => {
  try {
    const deliveryPartners = await DeliveryPartner.find({});
    return res.status(200).json({
      success: true,
      count: deliveryPartners.length,
      data: deliveryPartners,
    });
  } catch (error) {
    console.error("Error fetching delivery partners:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


//Admin
const getAvailableDeliveryPartners = async (req, res) => {
  try {
    const availablePartners = await DeliveryPartner.find({
      isAvailable: true,
    }).select("-password -refreshToken");
    res.status(200).json({
      success: true,
      count: availablePartners.length,
      data: availablePartners,
    });
  } catch (error) {
    console.error("Error fetching available delivery partners:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


//Admin
const assignOrderToDeliveryPartner = async (req, res) => {
  const { orderId, deliveryPartnerId } = req.body;

  if (!orderId || !deliveryPartnerId) {
    return res
      .status(400)
      .json({ message: "Order ID and Delivery Partner ID are required" });
  }

  try {
    // Check if the order exists and is not already assigned
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    

    // Check if delivery partner exists and is available + approved
    const deliveryPartner = await DeliveryPartner.findById(deliveryPartnerId);
    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    if (!deliveryPartner.isApproved) {
      return res
        .status(403)
        .json({ message: "Delivery partner is not approved" });
    }

    if (!deliveryPartner.isAvailable) {
      return res
        .status(400)
        .json({ message: "Delivery partner is not available" });
    }

    // Assign the order
    order.assignedTo = deliveryPartnerId;
    order.status = "Assigned"; // Optional: update status
    await order.save();

    // Optionally mark delivery partner as not available
    

    const io = req.app.get("io");
    io.to(deliveryPartnerId.toString()).emit("newOrderAssigned", {
      orderId: order._id,
      message: "A new order has been assigned to you",
    });

    res.status(200).json({
      message: "Order assigned successfully",
      data: {
        orderId: order._id,
        assignedTo: deliveryPartner.name,
      },
    });
  } catch (error) {
    console.error("Error assigning order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//Admin
const getAssignedOrdersForDeliveryPartner = async (req, res) => {
  try {
    const deliveryPartnerId = req.delivery._id; // set by verifyJWTDelivery middleware

    const orders = await Order.find({ assignedTo: deliveryPartnerId })
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


//DP
const updateOrderStatusByDeliveryPartner = async (req, res) => {
  try {
    const deliveryPartnerId = req.delivery._id;
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Picked Up", "Out for Delivery", "Delivered", "Cancelled By Customer",];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findOne({
      _id: orderId,
      assignedTo: deliveryPartnerId,
    });

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or not assigned to you" });
    }

    // Update current status and deliveredAt if needed
    order.status = status;
    if (status === "Delivered") {
      order.deliveredAt = new Date();
      await DeliveryPartner.findByIdAndUpdate(deliveryPartnerId, { isAvailable: true });

    }

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


//DP
const updatePaymentStatusByDeliveryPartner = async (req, res) => {
  try {
    const deliveryPartnerId = req.delivery._id;
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    const validStatuses = ["pending", "paid"];

    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    const order = await Order.findOne({
      _id: orderId,
      assignedTo: deliveryPartnerId,
    });

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found or not assigned to you" });
    }

    // Update current status and deliveredAt if needed
    order.paymentStatus = paymentStatus;
    if (paymentStatus === "Paid") {
      order.deliveredAt = new Date();
    }

    // Add to statusHistory
    order.paymentStatusHistory.push({
      paymentStatus,
      updatedAt: new Date(),
    });

    await order.save();

    res.status(200).json({
      message: "Payment status updated and logged successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//DP
const getEarningsAndDeliveryHistory = async (req, res) => {
  try {
    const deliveryPartnerId = req.delivery._id;

    // Fetch all delivered orders assigned to this partner
    const deliveredOrders = await Order.find({
      assignedTo: deliveryPartnerId,
      status: "Delivered",
    }).sort({ deliveredAt: -1 });

    // Group orders by date
    const dailyStats = {};
    let totalDeliveries = 0;
    let totalEarnings = 0;

   deliveredOrders.forEach((order) => {
  const deliveredDate = new Date(order.deliveredAt || order.updatedAt);
  if (isNaN(deliveredDate)) return;

  const dateKey = deliveredDate.toISOString().split("T")[0];

  if (!dailyStats[dateKey]) {
    dailyStats[dateKey] = { orders: [] };
  }

  dailyStats[dateKey].orders.push(order);
});


    // Calculate earnings and incentives per day
    const history = Object.entries(dailyStats).map(([date, data]) => {
      const numOrders = data.orders.length;
      const baseEarnings = numOrders * 20;
      const incentive = 0;
      const totalForDay = baseEarnings + incentive;

      totalDeliveries += numOrders;
      totalEarnings += totalForDay;

      return {
        date,
        numberOfDeliveries: numOrders,
        incentive,
        dailyEarnings: baseEarnings,
        totalEarningsForDay: totalForDay,
        orders: data.orders.map((order) => ({
          _id: order._id,
          deliveredAt: order.deliveredAt,
          amount: order.totalAmount,
          commission: 20, // fixed per delivery
          address: order.deliveryAddress,
        })),
      };
    });

    res.status(200).json({
      totalDeliveries,
      totalEarnings,
      dailyHistory: history,
    });
  } catch (error) {
    console.error("Error fetching delivery history and earnings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//Admin
const getCompletedOrdersByDeliveryPartner = async (req, res) => {
  try {
    const deliveryPartnerId = req.delivery._id;

    const completedOrders = await Order.find({
      assignedTo: deliveryPartnerId,
      status: "Delivered",
    }).sort({ deliveredAt: -1 });

    const formattedOrders = completedOrders.map((order) => ({
      _id: order._id,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      address: order.address || "N/A",
      addressDetails: order.addressDetails || {},
      deliveredAt: order.deliveredAt || order.updatedAt,
      status: order.status,
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

const getDashboardStats = async (req, res) => {
  const deliveryPartnerId = req.delivery._id;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todayDeliveries = await Order.find({
    assignedTo: deliveryPartnerId,
    status: "Delivered",
    deliveredAt: { $gte: startOfDay },
  });

  //const incentive = Math.floor(todayDeliveries.length / 6) * 30;
  const incentive = 0;

  const totalEarnings = todayDeliveries.reduce(
    (sum, order) => sum + order.deliveryCharge,
    0
  );

  const pendingOrders = await Order.find({
    assignedTo: deliveryPartnerId,
    status: { $ne: "Delivered" },
  });

  res.status(200).json({
    todayDeliveries: todayDeliveries.length,
    earningsToday: totalEarnings,
    incentiveEarned: incentive,
    pendingOrders: pendingOrders.length,
  });
};

const getDeliveryReports = async (req, res) => {
  try {
    const deliveryPartnerId = req.delivery._id;
    const { range = "daily" } = req.query;

    let startDate, endDate = new Date();

    if (range === "weekly") {
      startDate = moment().startOf("week").toDate();
    } else {
      // daily
      startDate = moment().startOf("day").toDate();
    }

    const deliveredOrders = await Order.find({
      deliveryPartner: deliveryPartnerId,
      status: "Delivered",
      deliveredAt: { $gte: startDate, $lte: endDate },
    });

    const totalDeliveries = deliveredOrders.length;
    const totalEarnings = deliveredOrders.reduce(
      (sum, order) => sum + (order.deliveryCharge || 0),
      0
    );

    //const incentive = Math.floor(totalDeliveries / 6) * 30;
    const incentive = 0;
    res.status(200).json({
      success: true,
      range,
      totalDeliveries,
      totalEarnings,
      incentive,
      netPayable: totalEarnings + incentive,
      deliveredOrders,
    });
  } catch (error) {
    console.error("Error generating delivery report:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateAvailability = async (req, res) => {
  try {
    const deliveryPartnerId = req.delivery._id;
    const { isAvailable } = req.body;

    const updatedPartner = await DeliveryPartner.findByIdAndUpdate(
      deliveryPartnerId,
      { isAvailable },
      { new: true }
    );

    return res.status(200).json({
      message: "Availability updated successfully",
      data: updatedPartner,
    });
  } catch (error) {
    console.error("Error updating availability:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getDailyCollectionStatus = async (req, res) => {
  try {
    const deliveryPartnerId = req.delivery._id;

    // Get today's date range (start to end of day in UTC)
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Fetch today's delivered orders
    const todaysOrders = await Order.find({
      assignedTo: deliveryPartnerId,
      status: "Delivered",
      deliveredAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // Calculate total amount collected
    const totalCollected = todaysOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Check if all orders are marked as payment done
    const allPaid = todaysOrders.every((order) => order.paymentToAdmin === true);

    const paymentStatus = allPaid ? "Payment Done Successfully" : "Payment Pending";

    return res.status(200).json({
      date: startOfDay.toISOString().split("T")[0], // YYYY-MM-DD
      totalOrdersDelivered: todaysOrders.length,
      totalAmountCollected: totalCollected,
      paymentStatus,
    });
  } catch (error) {
    console.error("Error fetching daily collection status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOrderStats = async (req, res) => {
  try {
    // Time ranges
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();
    const startOfWeek = moment().startOf('isoWeek').toDate();
    const startOfMonth = moment().startOf('month').toDate();

    // Order Status Counts
    const deliveredCount = await Order.countDocuments({ status: 'Delivered' });
    const outForDeliveryCount = await Order.countDocuments({ status: 'Out for Delivery' });
    const pickedCount = await Order.countDocuments({ status: 'Picked' });
    const assignedCount = await Order.countDocuments({ status: 'Assigned' });
    const placedCount = await Order.countDocuments({ status: 'Placed' });
    const paymentStatusCount = await Order.countDocuments({paymentStatus: 'Paid'})

    const todayOrders = await Order.find({ createdAt: { $gte: startOfDay, $lte: endOfDay } });
    const todayOrdersCount = todayOrders.length;

    // Average Order Value (subtracting ₹20 per order)
    const deliveredOrders = await Order.find(
  { status: "Delivered" },               // <-- filter
  "totalAmount"
);

const deliveredRevenue = deliveredOrders.reduce(
  (sum, o) => sum + (o.totalAmount - 20), // subtract fee only if it applies
  0
);

const averageOrderValue =
  deliveredOrders.length > 0
    ? +(deliveredRevenue / deliveredOrders.length).toFixed(2)
    : 0;

    // Fulfillment Rate
    const allOrders = await Order.find({}, 'totalAmount customerId');
    const totalOrders = allOrders.length;
    const fulfillmentRate = totalOrders > 0 ? Number(((deliveredCount / totalOrders) * 100).toFixed(2)) : 0;

    // General Counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalDeliveryPartners = await DeliveryPartner.countDocuments();
    const availableDeliveryPartners = await DeliveryPartner.countDocuments({ isAvailable: true });

    // Total Sales
   

const totalSales = deliveredOrders.reduce(
  (sum, o) => sum + (o.totalAmount - 20), // deduct ₹20 COD fee if that applies
  0
);

    // Today's Revenue
    const todaysRevenue = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // 🔥 NEW METRIC 1: New Users Today
    const newUsersToday = await User.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    // 🔥 NEW METRIC 2: New Users This Week
    const newUsersThisWeek = await User.countDocuments({
      createdAt: { $gte: startOfWeek }
    });

    // 🔥 NEW METRIC 3: New Users This Month
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });

    // 🔥 NEW METRIC 4: Retention Rate (Users with more than 1 order)
    const customerOrderMap = new Map();

allOrders.forEach((order) => {
  if (!order.customerId) {
    //console.warn("Skipping order without customerId:", order._id);
    return;
  }

  const customerId = order.customerId.toString();
  customerOrderMap.set(customerId, (customerOrderMap.get(customerId) || 0) + 1);
});

const repeatUsersCount = Array.from(customerOrderMap.values()).filter(count => count > 1).length;
const retentionRate = totalUsers > 0 ? Number(((repeatUsersCount / totalUsers) * 100).toFixed(2)) : 0;

    // Final Response
    res.status(200).json({
      deliveredCount,
      outForDeliveryCount,
      pickedCount,
      assignedCount,
      placedCount,
      paymentStatusCount,
      todayOrdersCount,
      averageOrderValue,
      fulfillmentRate,
      totalUsers,
      totalProducts,
      totalDeliveryPartners,
      availableDeliveryPartners,
      totalSales,
      todaysRevenue,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      retentionRate
    });

  } catch (error) {
    console.error("Error fetching order stats:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRegisteredDeliveryPartners = async (req, res) => {
  try {
    const registeredPartners = await DeliveryPartner.find({
      isApproved: false,
    }).select("-password -refreshToken");
    res.status(200).json({
      success: true,
      count: registeredPartners.length,
      data: registeredPartners,
    });
  } catch (error) {
    console.error("Error fetching registered delivery partners:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const approveDeliveryPartner = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const partner = await DeliveryPartner.findOne({ email });

    if (!partner) {
      return res.status(404).json({ success: false, message: "Delivery Partner not found" });
    }

    if (partner.isApproved) {
      return res.status(200).json({ success: true, message: "Already approved" });
    }

    partner.isApproved = true;
    await partner.save();

    return res.status(200).json({ success: true, message: "Delivery Partner approved successfully" });
  } catch (error) {
    console.error("Error approving delivery partner:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const searchDeliveryPartner = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ success: false, message: "Query is required" });
    }

    const searchRegex = new RegExp(query, "i");

    const result = await DeliveryPartner.find({
      $or: [
        { _id: query.match(/^[0-9a-fA-F]{24}$/) ? query : undefined }, // only match _id if valid ObjectId
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
      ],
    }).select("-password -refreshToken");

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "No delivery partner found" });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error searching delivery partner:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getCompletedOrdersByDP = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ success: false, message: "Query is required" });
    }

    const searchRegex = new RegExp(query, "i");
    const isObjectId = query.match(/^[0-9a-fA-F]{24}$/);

    // Find matching delivery partners
    const deliveryPartners = await DeliveryPartner.find({
      $or: [
        ...(isObjectId ? [{ _id: query }] : []),
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
      ],
    });

    if (deliveryPartners.length === 0) {
      return res.status(404).json({ success: false, message: "No matching delivery partner found." });
    }

    const partnerIds = deliveryPartners.map((dp) => dp._id);

    const orders = await Order.find({
      assignedTo: { $in: partnerIds },
      status: "Delivered",
    })
      .populate("customerId", "name email phone")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: "No completed orders found for the given delivery partner." });
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};





export {
  registerDeliveryPartner,
  deliveryPartnerLogin,
  logoutDeliveryPartner,
  getMyDetails,
  updateMyDetails,
  getAllDeliveryPartner,
  getAvailableDeliveryPartners,
  assignOrderToDeliveryPartner,
  getAssignedOrdersForDeliveryPartner,
  updateOrderStatusByDeliveryPartner,
  updatePaymentStatusByDeliveryPartner,
  getEarningsAndDeliveryHistory,
  getCompletedOrdersByDeliveryPartner,
  getDashboardStats,
  getDeliveryReports,
  updateAvailability,
  getDailyCollectionStatus,
  getOrderStats,
  getRegisteredDeliveryPartners,
  approveDeliveryPartner,
  searchDeliveryPartner,
  getCompletedOrdersByDP,
};
