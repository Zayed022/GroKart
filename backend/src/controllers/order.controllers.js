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
import { sendOrderNotification } from "../utils/emailService.js";
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

  const COD_CHARGE = 20;
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

  const createOrder = async(req,res)=>{
    const {amount, currency} = req.body;
    if(!(amount || currency)){
      return res.status(401).json({error:"Missing amount and currency"})
    };
    try {
      const options = {
        amount : amount *100,
        currency: currency || 'INR',
      };
      const order = await razorpayInstance.orders.create(options);
      res.status(200).json(order);
    } catch (error) {
      console.log(error);
      res.status(500).json({error:"Error creating Razorpay order"})
    }
  }

  export const handleCODPayment = async(req,res) =>{
    const {amount, currency} = req.body;

    const paymentDetails = {
    paymentMode: "Cash on Delivery",
    baseAmount: orderAmount,
    codCharge: COD_CHARGE,
    totalAmount: finalAmount,
    status: "Pending Payment",
    message: `COD selected. Please collect ₹${amount} upon delivery.`,
    };

    return res.status(200).json(paymentDetails)


  }









        
  

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature,orderId } =
      req.body;

      if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !orderId) {
        return res.status(400).json({ error: "Missing required fields for verification" });
      }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: "payment verification failed" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus:"Paid",
        status:"Placed",
        razorpayPaymentId : razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      },
      {new:true}
    );
    if(!updatedOrder){
      return res.status(404).json({error:"Order not found"})
    }
    
    res
      .status(200)
      .json({ success: true, message: "Payment verified successfully" });
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

export {
  createOrder,
  verifyPayment,
  placeOrder,
  getOrderStatus,
  updateOrderStatus,
  assignDeliveryPartner,
  getDeliveryRoute,
  applyDiscount,
  getAssignedOrders,
};
