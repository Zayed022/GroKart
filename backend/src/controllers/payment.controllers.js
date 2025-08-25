import { createOrder,
    getOrderById,
    updateOrderStatus,
    markCodOrderDelivered

 } from "../utils/order.utils.js";

 const createNewOrder = async (req, res) => {
    try {
      const { paymentMethod, items, currency, address, notes } = req.body;
      
      if (!['razorpay', 'cod'].includes(paymentMethod)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment method. Supported methods: razorpay, cod'
        });
      }
      
      const orderData = {
        customerId: req.user.id, // Assuming you have authentication middleware
        paymentMethod,
        items,
        currency: currency || 'INR',
        address,
        notes: notes || {}
      };
      
      const result = await createOrder(orderData);
      const order = result.order;
      
      // Calculate price breakdown
      const priceDetails = orderService.calculateOrderTotal(items, paymentMethod);
      
      // Different response based on payment method
      if (paymentMethod === 'razorpay') {
        res.status(200).json({
          success: true,
          order: {
            id: result.razorpayOrder.id,
            amount: result.razorpayOrder.amount,
            currency: result.razorpayOrder.currency,
            receipt: result.razorpayOrder.receipt
          },
          orderId: order.orderId,
          priceDetails
        });
      } else {
        // COD response
        res.status(200).json({
          success: true,
          order: {
            orderId: order.orderId,
            amount: order.amount,
            codCharge: order.codCharge,
            totalAmount: order.amount + order.codCharge,
            currency: order.currency,
            status: order.status
          },
          priceDetails
        });
      }
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({
        success: false,
        message: 'Order creation failed',
        error: error.message
      });
    }
  };

  const markCodOrder = async (req, res) => {
    try {
      const { orderId, collectedBy, deliveryId, notes } = req.body;
      
      if (!orderId || !collectedBy || !deliveryId) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }
      
      const result = await markCodOrderDelivered(orderId, {
        collectedBy,
        deliveryId,
        notes
      });
      
      res.status(200).json({
        success: true,
        message: 'Order marked as delivered and payment collected',
        order: {
          orderId: result.order.orderId,
          status: result.order.status,
          paymentStatus: result.order.paymentStatus
        }
      });
    } catch (error) {
      console.error('Error marking COD order as delivered:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to mark order as delivered',
        error: error.message
      });
    }
  };

  const verifyPayment = async (req, res) => {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      } = req.body;
      
      // Verify signature
      const isValid = paymentService.verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );
      
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment signature'
        });
      }
      
      // Save payment details
      const payment = await paymentService.savePayment({
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id
      });
      
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        payment: {
          id: payment.razorpayPaymentId,
          status: payment.status,
          amount: payment.amount,
          currency: payment.currency
        }
      });
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({
        success: false,
        message: 'Payment verification failed',
        error: error.message
      });
    }
  };

export{
    createNewOrder,
    markCodOrder,
    verifyPayment

}