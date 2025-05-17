import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.models.js";
import { Order } from "../models/order.models.js";
import { DeliveryPartner } from "../models/deliveryPartner.model.js";
import {Parser} from "json2csv"
import ExcelJs from "exceljs"
import PDFDocument from "pdfkit"
import moment from "moment";

const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const admin = await Admin.findById(userId);
        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();
        admin.refreshToken = refreshToken
        await admin.save({validateBeforeSafe:false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh token");
        
    }
}

const registerAdmin = async(req,res)=>{
    try{
        const {email,name, password,phone,isApproved} = req.body;
        if(!(email || name || password || phone)){
            return res.status(401).json({message:"All fields are required"})
        };
        const existingAdmin = await Admin.findOne({email});
        if(existingAdmin){
            return res.status(400).json({message:"Admin already exists"})
        }

        //const hashedPassword = await bcrypt.hash(password,10);
        const newAdmin = new Admin({
            name,
            email,
            phone,
            password,
            isApproved
        });
        await newAdmin.save();
        return res.status(201).json({message:"Admin registered successfully"});
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:"Error registering admin"});
    }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (!admin.isApproved) {
      return res.status(403).json({ message: "Access Denied: Not approved" });
    }

    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      admin._id
    );

    
    await admin.save();

    const loggedInAdmin = await Admin.findById(
      admin._id
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
        message: "Admin logged in successfully",
        
          admin: loggedInAdmin,

          token: accessToken,
           
        
      });
  } catch (error) {
    console.error("Error logging in Admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const adminId = req.admin._id; // Assuming protected route with auth

    // Mark as unavailable
    

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    return res
      .status(201)
      .json({ message: "Admin logged out successfully" });
  } catch (error) {
    console.error("Error logging out admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const admin = await Admin.find({});
    return res.status(200).json({
      success: true,
      count: admin.length,
      data: admin,
    });
  } catch (error) {
    console.error("Error fetching admin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const searchOrders = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchRegex = new RegExp(query, "i");

    // Match users by name, email, or phone
    const matchingUsers = await User.find({
      $or: [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { phone: { $regex: searchRegex } },
      ],
    }).select("_id");

    const userIds = matchingUsers.map((user) => user._id);

    // Search orders by _id or matching customerId
    const orders = await Order.find({
      $or: [
        { _id: mongoose.Types.ObjectId.isValid(query) ? query : undefined },
        { customerId: { $in: userIds } },
      ],
    })
      .sort({ createdAt: -1 })
      .populate("customerId", "name email phone");

    if (!orders.length) {
      return res.status(404).json({ message: "No matching orders found" });
    }

    res.status(200).json({
      message: "Matching orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error searching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const filterOrders = async (req, res) => {
  try {
    const {
      paymentStatus,
      status,
      startDate,
      endDate,
      city,
      state,
      minAmount,
      maxAmount,
    } = req.body;

    const filters = {};

    if (paymentStatus) filters.paymentStatus = paymentStatus;
    if (status) filters.status = status;
    if (city) filters["addressDetails.city"] = city;
    if (state) filters["addressDetails.state"] = state;

    if (startDate || endDate) {
      filters.createdAt = {};
      if (startDate) filters.createdAt.$gte = new Date(startDate);
      if (endDate) filters.createdAt.$lte = new Date(endDate);
    }

    if (minAmount || maxAmount) {
      filters.totalAmount = {};
      if (minAmount) filters.totalAmount.$gte = Number(minAmount);
      if (maxAmount) filters.totalAmount.$lte = Number(maxAmount);
    }

    const orders = await Order.find(filters)
      .sort({ createdAt: -1 })
      .populate("customerId", "name email phone");

    if (!orders.length) {
      return res.status(404).json({ message: "No matching orders found" });
    }

    res.status(200).json({ message: "Filtered orders fetched", orders });
  } catch (error) {
    console.error("Error filtering orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const exportOrders = async (req, res) => {
  try {
    // Optionally accept filters & format in query or body
    const {
      paymentStatus,
      status,
      city,
      state,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      format = "csv",
    } = req.body;

    // Build filter object
    let filter = {};

    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (status) filter.status = status;
    if (city) filter["addressDetails.city"] = city;
    if (state) filter["addressDetails.state"] = state;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    if (minAmount || maxAmount) {
      filter.totalAmount = {};
      if (minAmount) filter.totalAmount.$gte = Number(minAmount);
      if (maxAmount) filter.totalAmount.$lte = Number(maxAmount);
    }

    const orders = await Order.find(filter).lean();

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found for export." });
    }

    // Normalize & simplify data for export
    const exportData = orders.map((order) => ({
      OrderID: order._id.toString(),
      CustomerID: order.customerId?.toString() || "",
      TotalAmount: order.totalAmount,
      Currency: order.currency,
      PaymentStatus: order.paymentStatus,
      PaymentMethod: order.paymentMethod,
      OrderStatus: order.status,
      City: order.addressDetails?.city || "",
      State: order.addressDetails?.state || "",
      CreatedAt: moment(order.createdAt).format("YYYY-MM-DD HH:mm:ss"),
      Items: order.items
        .map((item) => `${item.name} (x${item.quantity})`)
        .join("; "),
    }));

    if (format === "csv") {
      const parser = new Parser();
      const csv = parser.parse(exportData);

      res.header("Content-Type", "text/csv");
      res.attachment(`orders_${moment().format("YYYYMMDD_HHmmss")}.csv`);
      return res.send(csv);
    }

    if (format === "excel") {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Orders");

      worksheet.columns = Object.keys(exportData[0]).map((key) => ({
        header: key,
        key,
        width: 25,
      }));

      worksheet.addRows(exportData);

      res.header(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.attachment(`orders_${moment().format("YYYYMMDD_HHmmss")}.xlsx`);

      await workbook.xlsx.write(res);
      res.end();
      return;
    }

    if (format === "pdf") {
      const doc = new PDFDocument({ margin: 30, size: "A4" });
      res.header("Content-Type", "application/pdf");
      res.attachment(`orders_${moment().format("YYYYMMDD_HHmmss")}.pdf`);

      doc.fontSize(18).text("Orders Report", { align: "center" });
      doc.moveDown();

      exportData.forEach((order, i) => {
        doc.fontSize(12).text(`Order #${i + 1}`, { underline: true });
        for (const [key, val] of Object.entries(order)) {
          doc.fontSize(10).text(`${key}: ${val}`);
        }
        doc.moveDown();
      });

      doc.pipe(res);
      doc.end();
      return;
    }

    return res.status(400).json({ message: "Invalid export format." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error during export." });
  }
};

const getDailyCollectionByDeliveryPartners = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const collections = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
          updatedAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: "$deliveryPartnerId",
          totalAmountCollected: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "deliverypartners",
          localField: "_id",
          foreignField: "_id",
          as: "deliveryPartner",
        },
      },
      {
        $unwind: "$deliveryPartner",
      },
      {
        $project: {
          _id: 0,
          partnerId: "$deliveryPartner._id",
          name: "$deliveryPartner.name",
          email: "$deliveryPartner.email",
          phone: "$deliveryPartner.phone",
          totalAmountCollected: 1,
          orderCount: 1,
        },
      },
      { $sort: { totalAmountCollected: -1 } },
    ]);

    res.status(200).json({
      success: true,
      count: collections.length,
      data: collections,
    });
  } catch (error) {
    console.error("Error fetching daily collections:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getDailyEarningsByDeliveryPartners = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const earnings = await Order.aggregate([
      {
        $match: {
          status: "Delivered",
          updatedAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $group: {
          _id: "$deliveryPartnerId",
          orderCount: { $sum: 1 },
        },
      },
      {
        $addFields: {
          baseEarnings: { $multiply: ["$orderCount", 15] },
          incentives: {
            $multiply: [{ $floor: { $divide: ["$orderCount", 6] } }, 30],
          },
        },
      },
      {
        $addFields: {
          totalEarnings: { $add: ["$baseEarnings", "$incentives"] },
        },
      },
      {
        $lookup: {
          from: "deliverypartners",
          localField: "_id",
          foreignField: "_id",
          as: "deliveryPartner",
        },
      },
      { $unwind: "$deliveryPartner" },
      {
        $project: {
          _id: 0,
          partnerId: "$deliveryPartner._id",
          name: "$deliveryPartner.name",
          email: "$deliveryPartner.email",
          phone: "$deliveryPartner.phone",
          orderCount: 1,
          baseEarnings: 1,
          incentives: 1,
          totalEarnings: 1,
        },
      },
      { $sort: { totalEarnings: -1 } },
    ]);

    res.status(200).json({
      success: true,
      count: earnings.length,
      data: earnings,
    });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAllTimeEarningsByDeliveryPartners = async (req, res) => {
  try {
    const earnings = await Order.aggregate([
      {
        $match: { status: "Delivered" },
      },
      {
        $group: {
          _id: "$deliveryPartnerId",
          orderCount: { $sum: 1 },
        },
      },
      {
        $addFields: {
          baseEarnings: { $multiply: ["$orderCount", 15] },
          incentives: {
            $multiply: [{ $floor: { $divide: ["$orderCount", 6] } }, 30],
          },
        },
      },
      {
        $addFields: {
          totalEarnings: { $add: ["$baseEarnings", "$incentives"] },
        },
      },
      {
        $lookup: {
          from: "deliverypartners",
          localField: "_id",
          foreignField: "_id",
          as: "deliveryPartner",
        },
      },
      { $unwind: "$deliveryPartner" },
      {
        $project: {
          _id: 0,
          partnerId: "$deliveryPartner._id",
          name: "$deliveryPartner.name",
          email: "$deliveryPartner.email",
          phone: "$deliveryPartner.phone",
          orderCount: 1,
          baseEarnings: 1,
          incentives: 1,
          totalEarnings: 1,
        },
      },
      { $sort: { totalEarnings: -1 } },
    ]);

    res.status(200).json({
      success: true,
      count: earnings.length,
      data: earnings,
    });
  } catch (error) {
    console.error("Error fetching all-time earnings:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getAllDeliveredOrdersWithTimestamps = async (req, res) => {
  try {
    const orders = await Order.find({ status: "Delivered" })
      .sort({ updatedAt: -1 }) // Most recent first
      .populate("userId", "name email")
      .populate("deliveryPartnerId", "name email phone");

    const formattedOrders = orders.map((order) => ({
      orderId: order._id,
      userName: order.userId?.name || "N/A",
      userEmail: order.userId?.email || "N/A",
      deliveryPartner: {
        name: order.deliveryPartnerId?.name || "N/A",
        email: order.deliveryPartnerId?.email || "N/A",
        phone: order.deliveryPartnerId?.phone || "N/A",
      },
      placedAt: order.createdAt,
      deliveredAt: order.updatedAt,
      totalAmount: order.totalAmount,
      items: order.items || [],
    }));

    res.status(200).json({
      success: true,
      count: formattedOrders.length,
      data: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching delivered orders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getDeliveryReports = async (req, res) => {
  try {
    const { startDate, endDate, deliveryPartnerId } = req.query;

    const matchConditions = {
      status: "Delivered",
    };
    if (startDate && endDate) {
      matchConditions.deliveredAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }
    if (deliveryPartnerId) {
      matchConditions.deliveryPartner = deliveryPartnerId;
    }

    const orders = await Order.find(matchConditions);

    // Aggregate metrics
    const totalOrders = orders.length;
    const totalEarnings = totalOrders * 15 + Math.floor(totalOrders / 6) * 30;

    const avgDeliveryTime =
      orders.reduce((acc, order) => {
        const placed = new Date(order.placedAt);
        const delivered = new Date(order.deliveredAt);
        return acc + (delivered - placed);
      }, 0) / totalOrders;

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        totalEarnings,
        avgDeliveryTime: Math.round(avgDeliveryTime / 60000), // in minutes
        orders,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};



export {
    registerAdmin,
    adminLogin,
    logoutAdmin,
    getAllAdmin,
    searchOrders,
    filterOrders,
    exportOrders,
    getDailyCollectionByDeliveryPartners,
    getDailyEarningsByDeliveryPartners,
    getAllTimeEarningsByDeliveryPartners,
    getAllDeliveredOrdersWithTimestamps,
    getDeliveryReports,

}