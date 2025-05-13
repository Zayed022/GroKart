import { DeliveryPartner } from "../models/deliveryPartner.model.js";
import { Order } from "../models/order.models.js";
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
      !(
        email ||
        name ||
        password ||
        phone ||
        vehicleNumber ||
        licenseNumber ||
        isApproved ||
        isAvailable
      )
    ) {
      console.log("All files arre required");
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
    const aadhaarProof = await uploadOnCloudinary(pucProofLocalPath);
    if (!aadhaarProof) {
      return res.status(400).json({ message: "Aadhaar Proof is required" });
    }

    const panCardProofLocalPath = req.files?.panCardProof[0]?.path;
    console.log(panCardProofLocalPath);
    if (!panCardProofLocalPath) {
      return res.status(400).json({ message: "Pan Card Proof is required" });
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
    res
      .status(201)
      .json({ message: "Delivery Partner registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error registering delivery partner" });
  }
};

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
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "Delivery Partner logged in successfully",
        data: {
          deliveryPartner: loggedInDeliveryPartner,

          tokens: {
            accessToken,
            refreshToken,
          },
        },
      });
  } catch (error) {
    console.error("Error logging in delivery partner:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

    if (order.assignedTo) {
      return res.status(400).json({ message: "Order already assigned" });
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
    deliveryPartner.isAvailable = false;
    await deliveryPartner.save();

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

const getAssignedOrdersForDeliveryPartner = async (req, res) => {
  try {
    const deliveryPartnerId = req.delivery._id; // set by verifyJWTDelivery middleware

    const orders = await Order.find({ assignedTo: deliveryPartnerId })
      .sort({ createdAt: -1 })
      .populate("userId", "name address") // optional: include customer info
      .populate("assignedTo", "name phoneNumber") // optional: include delivery partner info
      .lean();

    res.status(200).json({
      message: "Assigned orders fetched successfully",
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching assigned orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateOrderStatusByDeliveryPartner = async (req, res) => {
  try {
    const deliveryPartnerId = req.delivery._id;
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Picked Up", "Out for Delivery", "Delivered"];

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
    let totalEarnings = 0;

    deliveredOrders.forEach((order) => {
      const deliveredDate = new Date(order.deliveredAt);
      const dateKey = deliveredDate.toISOString().split("T")[0]; // YYYY-MM-DD format

      if (!dailyStats[dateKey]) {
        dailyStats[dateKey] = {
          orders: [],
          incentive: 0,
        };
      }

      dailyStats[dateKey].orders.push(order);
    });

    // Calculate incentives and earnings per day
    Object.keys(dailyStats).forEach((date) => {
      const orders = dailyStats[date].orders;
      const numOrders = orders.length;

      const baseEarnings = orders.reduce(
        (sum, order) => sum + (order.deliveryCommission || 0),
        0
      );

      // ₹30 incentive for every 6 deliveries
      const incentive = Math.floor(numOrders / 6) * 30;

      dailyStats[date].incentive = incentive;

      const totalForDay = baseEarnings + incentive;
      totalEarnings += totalForDay;
    });

    // Format the response
    const history = Object.entries(dailyStats).map(([date, data]) => ({
      date,
      numberOfDeliveries: data.orders.length,
      incentive: data.incentive,
      dailyEarnings: data.orders.reduce(
        (sum, order) => sum + (order.deliveryCommission || 0),
        0
      ),
      totalEarningsForDay:
        data.orders.reduce(
          (sum, order) => sum + (order.deliveryCommission || 0),
          0
        ) + data.incentive,
      orders: data.orders.map((order) => ({
        _id: order._id,
        deliveredAt: order.deliveredAt,
        amount: order.totalAmount,
        commission: order.deliveryCommission,
        address: order.deliveryAddress,
      })),
    }));

    res.status(200).json({
      totalDeliveries: deliveredOrders.length,
      totalEarnings,
      dailyHistory: history,
    });
  } catch (error) {
    console.error("Error fetching delivery history and earnings:", error);
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

  const incentive = Math.floor(todayDeliveries.length / 6) * 30;

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

    const incentive = Math.floor(totalDeliveries / 6) * 30;

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

export {
  registerDeliveryPartner,
  deliveryPartnerLogin,
  logoutDeliveryPartner,
  getAllDeliveryPartner,
  getAvailableDeliveryPartners,
  assignOrderToDeliveryPartner,
  getAssignedOrdersForDeliveryPartner,
  updateOrderStatusByDeliveryPartner,
  getEarningsAndDeliveryHistory,
  getDashboardStats,
  getDeliveryReports,
};
