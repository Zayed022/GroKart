import { Order } from "../models/order.models.js";
import { Payment } from "../models/payment.models.js";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const COD_CHARGE = 20;

const createOrder = async (orderData) => {
    try {
      // Generate unique order ID for your system
      const orderId = `ORD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Calculate total amount from items
      const totalAmount = orderData.items.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0);
      
      // Add COD charge if payment method is COD
      const codCharge = orderData.paymentMethod === 'cod' ? COD_CHARGE : 0;
      const finalAmount = totalAmount + codCharge;
      
      let razorpayOrder = null;
      
      // Only create Razorpay order if payment method is razorpay
      if (orderData.paymentMethod === 'razorpay') {
        razorpayOrder = await razorpay.orders.create({
          amount: finalAmount * 100, // in paise
          currency: orderData.currency || 'INR',
          receipt: orderId,
          notes: orderData.notes || {}
        });
      }
      
      // Create order in database
      const order = new Order({
        orderId,
        razorpayOrderId: razorpayOrder ? razorpayOrder.id : undefined,
        amount: totalAmount,
        codCharge,
        currency: orderData.currency || 'INR',
        paymentMethod: orderData.paymentMethod,
        customerId: orderData.customerId,
        items: orderData.items,
        address: orderData.address,
        receipt: orderId,
        notes: orderData.notes || {},
        status: orderData.paymentMethod === 'cod' ? 'processing' : 'created',
        paymentStatus: 'pending'
      });
      
      await order.save();
      
      return {
        order,
        razorpayOrder
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };
  

  const getOrderById = async (orderId) => {
    try {
      const order = await Order.findOne({ orderId }).populate('customerId', 'name email phone');
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      let razorpayOrder = null;
      
      // Get updated order details from Razorpay if applicable
      if (order.paymentMethod === 'razorpay' && order.razorpayOrderId) {
        razorpayOrder = await razorpay.orders.fetch(order.razorpayOrderId);
      }
      
      return {
        order,
        razorpayOrder
      };
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  };
  
  /**
   * Update order status
   */
  const updateOrderStatus = async (orderId, status, paymentStatus) => {
    try {
      const updateData = { status };
      
      if (paymentStatus) {
        updateData.paymentStatus = paymentStatus;
      }
      
      const order = await Order.findOneAndUpdate(
        { orderId },
        updateData,
        { new: true }
      );
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      return order;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };
  
  /**
   * Mark COD order as delivered and paid
   */
  const markCodOrderDelivered = async (orderId, collectionDetails) => {
    try {
      const order = await Order.findOne({ orderId });
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      if (order.paymentMethod !== 'cod') {
        throw new Error('Order is not a COD order');
      }
      
      // Update order status
      order.status = 'delivered';
      order.paymentStatus = 'paid';
      await order.save();
      
      // Create payment record for COD
      
      const payment = new Payment({
        orderId: order._id,
        amount: order.amount + order.codCharge,
        currency: order.currency,
        paymentMethod: 'cod',
        status: 'collected',
        codCharge: order.codCharge,
        paymentMethodDetails: {
          collectedBy: collectionDetails.collectedBy,
          collectionTime: new Date(),
          collectionNotes: collectionDetails.notes
        },
        notes: {
          deliveryId: collectionDetails.deliveryId
        }
      });
      
      await payment.save();
      
      return {
        order,
        payment
      };
    } catch (error) {
      console.error('Error marking COD order as delivered:', error);
      throw error;
    }
  };
  
  /**
   * Get total price including COD charge if applicable
   */
  const calculateOrderTotal = (items, paymentMethod) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const codCharge = paymentMethod === 'cod' ? COD_CHARGE : 0;
    return {
      subtotal,
      codCharge,
      total: subtotal + codCharge
    };
  };

  export{
    createOrder,
    getOrderById,
    updateOrderStatus,
    markCodOrderDelivered,
    calculateOrderTotal,
    COD_CHARGE
  }