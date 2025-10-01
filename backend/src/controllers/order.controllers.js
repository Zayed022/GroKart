import { Order } from "../models/order.models.js";
import { Product } from "../models/product.models.js";
import Razorpay from "razorpay";
//import razorpay from "../config/razorpay.js"
import crypto from "crypto";
import dotenv from "dotenv";
import { ServiceArea } from "../models/serviceArea.model.js";
import { toASCII } from "punycode";
import { User } from "../models/user.models.js";
import { Offer } from "../models/offer.model.js";
import axios from "axios";
//import {io} from "../utils/loaction.js"


dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/*
const createOrder = async (req, res) => {
    try {
      const {
        userId,
        cartItems,
        totalAmount,
        paymentMethod,
        address,
        email,
      } = req.body;
  
      // Enhanced Validation
      console.log("Received")
      const requiredFields = ["userId", "cartItems", "totalAmount", "address", "email"];
      const missingFields = requiredFields.filter((field) => !req.body[field]);
      if (missingFields.length > 0) {
        return res.status(400).json({
          error: `Missing required fields: ${missingFields.join(", ")}`,
          received: Object.keys(req.body),
        });
      }
      console.log("Received")
  
      // Validate cart items structure
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({
          error: "Invalid cart items format",
          receivedType: typeof cartItems,
          receivedLength: cartItems?.length,
        });
      }
  
      // Ensure productId is present in cartItems
      const invalidItems = cartItems.filter((item) => !item.productId || !item.quantity || !item.price);
      if (invalidItems.length > 0) {
        return res.status(400).json({
          error: "Invalid cart item structure",
          invalidItems,
        });
      }
  
      if (mongoose.connection.readyState !== 1) {
        return res.status(500).json({ error: "Database connection unavailable" });
      }
  
      let finalAmount = totalAmount;
      let discount = 0;
      let offerDetails = null;
      console.log("Received")
  
      // COD Order Handling
      if (paymentMethod === "COD") {
        const newOrder = new Order({
          user: userId,
          cartItems: cartItems.map((item) => ({
            product: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount: finalAmount,
          discountAmount: discount,
          offerApplied: offerDetails,
          address: {
            street: address.street,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            coordinates: address.coordinates,
          },
          paymentStatus: "Pending",
          status: "Placed",
          email,
        });
  
        const validationError = newOrder.validateSync();
        if (validationError) {
          return res.status(400).json({
            error: "Validation failed",
            details: validationError.errors,
          });
        }
  
        await newOrder.save();
        await sendOrderNotification(email, "Order Placed!", `Your COD order for ₹${finalAmount} has been placed`);
  
        return res.status(201).json({
          success: true,
          message: "COD order placed successfully",
          order: newOrder,
        });
      }
    } catch (error) {
      console.error("Order Creation Error:", {
        error: error.message,
        stack: error.stack,
        body: req.body,
      });
      res.status(500).json({
        message: "Error creating order",
        error: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  };
  */

  const COD_CHARGE = 0;
  /*
  const createOrder = async (req, res) => {
    try {
      const { items, address, paymentMethod, couponCode } = req.body;
      const userId = req.user?._id;
  
      if (!items || !items.length || !address || !paymentMethod) {
        return res.status(400).json({ success: false, message: "Missing fields" });
      }
  
      // Calculate total from items
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const codCharge = paymentMethod === "cod" ? COD_CHARGE : 0;
      const totalAmount = subtotal + codCharge;
  
      // Generate custom order ID and receipt
      const orderId = `ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      let razorpayOrder = null;
  
      if (paymentMethod === "razorpay") {
        // Create Razorpay order
        razorpayOrder = await razorpay.orders.create({
          amount: totalAmount * 100, // paise
          currency: "INR",
          receipt: orderId,
          notes: {
            userId: userId.toString(),
            couponCode: couponCode || "none",
          },
        });
      }
  
      const order = await Order.create({
        orderId,
        customerId: userId,
        items,
        totalAmount,
        currency: "INR",
        razorpayOrderId: razorpayOrder?.id || null,
        receipt: orderId,
        paymentMethod: paymentMethod.toLowerCase(),
        codCharge,
        paymentStatus: "pending",
        status: paymentMethod === "cod" ? "Processing" : "Pending",
        address: typeof address === "string" ? address : JSON.stringify(address),
        notes: { couponCode: couponCode || null },
      });
  
      res.status(201).json({
        success: true,
        order,
        razorpayOrder,
      });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({
        success: false,
        message: "Order creation failed",
      });
    }
  };
  */
/*
  const createOrder = async(req,res)=>{

    try{
    const {customerId,
       items,
       totalAmount,
       address,
       addressDetails,
       notes,
       codCharge,
       paymentMethod,

      
      } = req.body;
      if (
        !customerId ||
        !items?.length ||
        !totalAmount ||
        !address ||
        !paymentMethod
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }


    let razorpayOrder = null;

    if (paymentMethod === "razorpay") {
      const options = {
        amount: (totalAmount + (codCharge || 0)) * 100, // amount in paise
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      };
      razorpayOrder = await razorpayInstance.orders.create(options);
    }

    // Save order in DB
    const newOrder = new Order({
      customerId,
      items,
      totalAmount,
      address,
      addressDetails,
      notes,
      codCharge,
      paymentMethod,
      receipt: razorpayOrder?.receipt || `receipt_cod_${Date.now()}`,
      razorpayOrderId: razorpayOrder?.id || null,
      currency: "INR",
      status: "Placed",
    });

    const savedOrder = await newOrder.save();
    //await sendOrderEmail(savedOrder)

    res.status(201).json({
      message: "Order created",
      order: savedOrder,
      razorpayOrder,
    });
  } catch (error) {
    console.log("Error in createOrder:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};
*/

  

import Cashfree from "cashfree-pg";




const cashfree = new Cashfree.Cashfree({
  env: process.env.CASHFREE_ENV,
  clientId: process.env.CASHFREE_CLIENT_ID,
  clientSecret: process.env.CASHFREE_CLIENT_SECRET,
});

export const createOrderUsingCashfree = async (req, res) => {
  try {
    const {
      customerId,
      items,
      totalAmount,
      address,
      addressDetails,
      paymentMethod,
      codCharge,
    } = req.body;

    // Basic validations
    if (!customerId || !items || !totalAmount || !address || !paymentMethod) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const orderId = "order_" + Date.now(); // custom order ID
    const returnUrl = `https://yourdomain.com/payment-success?order_id=${orderId}`;

    // Step 1: Create order in DB
    const order = await Order.create({
      customerId,
      items,
      totalAmount,
      address,
      addressDetails,
      paymentMethod,
      codCharge,
      receipt: orderId,
      status: "Placed",
    });

    // If method is COD, skip Cashfree
    if (paymentMethod === "cod") {
      return res.status(200).json({
        success: true,
        message: "Order placed with COD",
        order,
      });
    }

    // Step 2: Create Cashfree Order
    const response = await cashfree.PG.orders.createOrder({
      order_id: orderId,
      order_amount: totalAmount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerId.toString(),
        customer_email: "test@example.com", // Replace with actual
        customer_phone: "9999999999", // Replace with actual
        customer_name: "Test User", // Replace with actual
      },
      order_meta: {
        return_url: returnUrl,
      },
    });

    const paymentSessionId = response.payment_session_id;

    // Step 3: Update Order with CashfreeOrderId
    order.CashfreeOrderId = response.order_id;
    await order.save();

    // Step 4: Return session ID to frontend
    return res.status(200).json({
      success: true,
      message: "Cashfree order created",
      paymentSessionId,
      orderId: order._id,
    });
  } catch (err) {
    console.error("Cashfree Order Error:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};






 // Constants
 // You can adjust this as needed

 export const handleCODPayment = async (req, res) => {
  try {
    const { 
      customerId,
      items,
      totalAmount,
      address,
      addressDetails,
      notes,
      paymentMethod,
    } = req.body;

    // Validate required fields
    if (
      !customerId ||
      !items?.length ||
      !totalAmount ||
      !address ||
      !paymentMethod
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Calculate final amount
    const finalAmount = totalAmount;

    // Create and save order
    const order = await Order.create({
      customerId,
      items,
      totalAmount: finalAmount,
      address,
      addressDetails,
      notes,
      codCharge: COD_CHARGE,
      paymentMethod: "cod",
      paymentStatus: "Pending",
      isPaid: false,
      status: "Placed", // Can be updated to "Processing" later
    });
    const io = req.app.get("io"); // get io instance
    if (global.io) {
      global.io.emit("new-order", {
        type: "cod",
        orderId: order._id,
        customerId,
        amount: finalAmount,
        status: order.status,
        createdAt: order.createdAt,
      });
    }
   
    
    // Send success response
    return res.status(201).json({
      success: true,
      message: `Order placed successfully. Please collect ₹${finalAmount} upon delivery.`,
      order,
      
    });

  } catch (error) {
    console.error("Error in COD payment:", error);
    return res.status(500).json({ message: "Something went wrong while processing COD." });
  }
};


const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !orderId) {
      return res.status(400).json({ error: "Missing required fields for verification" });
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: "Payment verification failed" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus: "Paid",
        status: "Placed",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error verifying payment" });
  }
};

const placeOrder = async (req, res) => {
  try {
    const { userId, items, totalAmount, paymentId, deliveryAddress } = req.body;
    if (!(userId || items || totalAmount || paymentId || deliveryAddress)) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newOrder = new Order({
      user: userId,
      items,
      totalAmount,
      paymentId,
      deliveryAddress,
      paymentMethod: "UPI",
      paymentStatus: "Paid",
      status: "Placed",
    });
    await newOrder.save();
    res
      .status(201)
      .json({
        success: true,
        message: "Order placed successfully",
        order: newOrder,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error placing order" });
  }
};

const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json({ success: true, status: order.status });
  } catch (error) {
    res.status(500).json({ error: "Error fetching order status" });
  }
};

/*
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!orderId) {
            return res.status(400).json({ error: "Order ID is required" });
        }
        if (!status) {
            return res.status(400).json({ error: "New status is required" });
        }

        const validStatuses = ["Placed", "Processing", "Out for Delivery", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid order status" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ success: true, message: "Order status updated successfully", order });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

*/

const assignDeliveryPartner = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    const deliveryPartner = await User.findOne({
      isDeliveryPartner: true,
    });
    if (!deliveryPartner) {
      return res.status(404).json({ message: "No delivery partner available" });
    }
    order.deliveryPerson = deliveryPartner._id;
    await order.save();
    return res
      .status(200)
      .json({ success: true, message: "Delivery partner assigned", order });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error assigning delivery partner" });
  }
};

const getDeliveryRoute = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate("deliveryPerson");
    if (!order || !order.deliveryPerson) {
      return res
        .status(404)
        .json({ message: "Order or delivery partner not found" });
    }
    const origin = `${order.deliveryPerson.location.lat},${order.deliveryPerson.location.lng}`;
    const destination = `${order.deliveryAddress.coordinates.lat},${order.deliveryAddress.coordinates.lng}`;
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    res.status(200).json({ route: response.data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching route" });
  }
};

const applyDiscount = async (cart, couponCode) => {
  let discount = 0;
  let offerDetails = null;
  if (couponCode) {
    const offer = await Offer.findOne({ code: couponCode, isActive: true });
    if (!offer) {
      throw new Error("Invalid or expired coupon code");
    }
    if (cart.discountType === "percentage") {
      discount = (cart.totalAmount * offer.discountValue) / 100;
      if (offer.maxDiscount && discount > offer.maxDiscount) {
        discount = offer.maxDiscount;
      }
    } else {
      discount = offer.discountValue;
    }
    offerDetails = offer;
  }
  return { discount, offerDetails };
};

import { getIO } from "../utils/loaction.js";
import mongoose from "mongoose";
//import Order from "../models/order.model.js";  // Ensure the correct model is imported

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, deliveryPartner } = req.body; // Extract data from request body

    if (!orderId || !status) {
      return res
        .status(400)
        .json({ message: "Order ID and status are required" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, deliveryPartner },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Emit WebSocket event for real-time updates
    const io = getIO();
    io.to(orderId).emit("orderUpdate", { orderId, status, deliveryPartner });

    return res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateOrderStatusByAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, deliveryPartner } = req.body;

    const validStatuses = [
      "Pending",
      "Placed",
      "Confirmed",
      "Ready to Collect",
      "Assigned",
      "Picked Up",
      "Out for Delivery",
      "Delivered",
      "Cancelled"
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    if (status === "Delivered") {
      order.deliveredAt = new Date();
    }

    // optional: auto-free partner when delivered
    if (status === "Delivered" && order.assignedTo) {
      await DeliveryPartner.findByIdAndUpdate(order.assignedTo, {
        isAvailable: true,
      });
    }

    order.statusHistory.push({
      status,
      updatedAt: new Date(),
    });

    await order.save();

    // Emit real-time socket event
    const io = getIO();
    io.to(orderId).emit("orderUpdate", { orderId, status, deliveryPartner });

    res.status(200).json({
      message: "✅ Order status updated by Admin",
      order,
    });
  } catch (error) {
    console.error("Admin status update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAssignedOrders = async (req, res) => {
  try {
    const { deliveryPartnerId } = req.body;
    const deliveryPartner = await User.findById({ deliveryPartnerId });
    if (!deliveryPartner) {
      return res.status(401).json({ message: "Delivery Person not found" });
    }
    const deliveryPerson = await Order.findById({ deliveryPartnerId });
    if (!deliveryPerson) {
      return res.status(402).json({ message: "No orders assigned" });
    }

    return res
      .status(200)
      .json({ message: "Orders fetched successfully", deliveryPerson });
  } catch (error) {
    console.log("Error fetching assigned orders:", error);
    res.status(500).json({ message: "Error fetching assigned orders" });
  }
};

const getMyOrders = async (req, res) => {
  // 1. Guard: user must be authenticated
  if (!req.user?.id) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const userId = req.user.id;

    // 2. Query
    const orders = await Order.find({ customerId: userId })
      .sort({ createdAt: -1 })
      // .select("-__v")                        // optional: trim payload
      // .populate("items.productId", "name")   // optional: richer data
      // .populate("assignedTo", "name phone"); // optional: delivery info

    // 3. Response
    res.status(200).json({
      success: true,
      count:   orders.length,
      message: "Fetched user orders successfully",
      data:    orders,
    });
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .select(
        "_id customerId items totalAmount currency isPaid paymentMethod paymentStatus codCharge status address addressDetails paymentToAdmin statusHistory createdAt updatedAt"
      )
      .sort({ createdAt: -1 }); // latest orders first

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;            // <-- pull from params
    if (!orderId) {
      return res.status(400).json({ error: "orderId is required" });
    }

    const order = await Order.findById(orderId)
      .populate("customerId",  "name email phone")
      .populate("assignedTo",  "name email phone")
      .populate("shopAssigned",  "name email phone");

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json({ message: "Order fetched successfully", order });
  } catch (err) {
    console.error("getOrderById error →", err);
    res.status(500).json({ error: "An error occurred while fetching the order." });
  }
};

const generateInvoice = async (req, res) => {
  try {
    const { id } = req.params; // orderId
    const order = await Order.findById(id)
      .populate("customerId", "name email phone")
      .lean();

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "Delivered")
      return res.status(400).json({ message: "Invoice is only available after delivery" });

    const formatCurrency = (amount) =>
      new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=invoice_${order._id}.pdf`
    );

    doc.pipe(res);

    // Header
    doc.fontSize(20).text("INVOICE", { align: "right" }).moveDown(0.5);

    // Company
    doc.fontSize(10)
      .text("GroKart Corp.", { align: "right" })
      .text("123 Market Street")
      .text("Mumbai, MH 400001")
      .text("support@grokart.com")
      .moveDown(1.5);

    // Customer + meta
    doc.fontSize(12)
      .text(`Bill To: ${order.customerId?.name || 'N/A'}`)
      .text(`E-Mail : ${order.customerId?.email || 'N/A'}`)
      .text(`Phone  : ${order.customerId?.phone || 'N/A'}`)
      .moveUp(3)
      .text(`Invoice #: ${order._id}`, { align: "right" })
      .text(`Invoice Date: ${new Date(order.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, { align: "right" })
      .text(`Payment Status: ${order.paymentStatus}`, { align: "right" })
      .moveDown(1.5);

    // Table header
    doc.fontSize(11)
      .text("Item", 40)
      .text("Qty", 250)
      .text("Price", 300)
      .text("Subtotal", 400)
      .moveDown(0.5);

    // Divider line
    doc.moveTo(40, doc.y)
      .lineTo(550, doc.y)
      .strokeColor("#CCCCCC")
      .stroke();

    // Items
    (order.items || []).forEach((it) => {
      doc.moveDown(0.6)
        .fontSize(10)
        .text(it.name, 40)
        .text(it.quantity, 250)
        .text(formatCurrency(it.price), 300)
        .text(formatCurrency(it.price * it.quantity), 400);
    });

    // Total
    doc.moveDown(1)
      .fontSize(12)
      .text("Grand Total:", 300, undefined, { continued: true })
      .text(formatCurrency(order.totalAmount), 400);

    doc.end();
  } catch (err) {
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate invoice" });
    }
  }
};

const cancelOrderByAdmin = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({ message: "Delivered orders cannot be cancelled." });
    }

    order.status = "Cancelled";
    order.statusHistory.push({
      status: "Cancelled",
      updatedAt: new Date(),
    });

    await order.save();

    return res.status(200).json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Admin cancel error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getRecentOrdersByCustomer = async (req, res) => {
  try {
    // 1. Guard: Ensure user is authenticated
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
    }

    const customerId = req.user.id;

    // 2. Calculate timestamp for 30 minutes ago
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

    // 3. Fetch orders created in the last 30 minutes
    const recentOrders = await Order.find({
      customerId,
      createdAt: { $gte: thirtyMinutesAgo },
    })
      .sort({ createdAt: -1 })
      .limit(5); // Optional: only latest few

    // 4. Return response
    res.status(200).json({
      success: true,
      message: "Fetched recent orders placed in the past 30 minutes.",
      data: recentOrders,
    });
  } catch (error) {
    console.error("❌ Error in getRecentOrdersByCustomer:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching recent orders",
    });
  }
};

const getOrdersByStatus = async (req, res) => {
  try {
    let { status } = req.query;
    status = status?.trim();

    let filter = {};
    if (status && status !== "All") {
      filter.status = new RegExp("^" + status + "$", "i"); // case-insensitive
    }

    const orders = await Order.find(filter)
      .select(
        "_id customerId items totalAmount currency isPaid paymentMethod paymentStatus codCharge status address addressDetails assignedTo shopAssigned createdAt updatedAt"
      )
      .populate("customerId", "name email phone") // populate customer basic details
      .populate("assignedTo", "name phone vehicleNumber") // populate delivery partner
      .populate("shopAssigned", "name address phone") // populate shop
      .sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPlacedOrders = async (req, res) => {
  try {
    const placedOrders = await Order.find({ status: "Placed" })
      .populate("customerId", "name email phone") // fetch customer details
      .populate("items.productId", "name price image") // fetch product details
      .populate("assignedTo", "name phone isAvailable") // fetch delivery partner if assigned
      .populate("shopAssigned", "name address phone") // fetch shop details if assigned
      .sort({ createdAt: -1 }) // latest first
      .lean(); // lean to get plain JSON objects

    res.status(200).json({
      success: true,
      count: placedOrders.length,
      orders: placedOrders.map(order => ({
        _id: order._id,
        customer: order.customerId,
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        address: order.address, // ✅ include address
        addressDetails: order.addressDetails, // ✅ include full details object
        assignedTo: order.assignedTo,
        shopAssigned: order.shopAssigned,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        notes: order.notes
      })),
    });
  } catch (error) {
    console.error("Error fetching placed orders:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};







export {
  //createOrder,
  verifyPayment,
  placeOrder,
  getOrderStatus,
  updateOrderStatus,
  updateOrderStatusByAdmin,
  assignDeliveryPartner,
  getDeliveryRoute,
  applyDiscount,
  getAssignedOrders,
  getMyOrders,
  getAllOrders,
  getOrderById,
  generateInvoice,
  cancelOrderByAdmin,
  getRecentOrdersByCustomer,
  getOrdersByStatus,
  getPlacedOrders,
};
