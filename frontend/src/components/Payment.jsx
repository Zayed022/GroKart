{/*}
import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/Cart";
import axios from "axios";

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems, clearCart } = useContext(CartContext);
    
    // Get user data from localStorage
    const storedUserId = localStorage.getItem("userId");
    const storedEmail = localStorage.getItem("email");
    const storedToken = localStorage.getItem("token");
    const storedName = localStorage.getItem("name");
    const storedPhone = localStorage.getItem("phone");

    // Get order data from location state
    const { address, totalAmount, couponCode } = location.state || {};
    const [paymentMethod, setPaymentMethod] = useState("UPI");
    const [finalAmount, setFinalAmount] = useState(totalAmount || 0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Validate data on component mount
    useEffect(() => {
        if (!storedEmail) {
            setError("User email not found. Please login again.");
            return;
        }

        if (!cartItems?.length) {
            setError("Your cart is empty");
            return;
        }

        if (!address) {
            setError("Shipping address not found");
            return;
        }

        // Calculate final amount (add COD charges if applicable)
        setFinalAmount(paymentMethod === "COD" ? (totalAmount || 0) + 25 : totalAmount || 0);
    }, [paymentMethod, totalAmount, cartItems, address, storedEmail]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const initiateRazorpayPayment = async (orderData) => {
        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) {
            throw new Error("Razorpay SDK failed to load");
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: orderData.razorpayOrder.amount,
            currency: "INR",
            name: "Grokart",
            description: `Order #${orderData.order._id}`,
            order_id: orderData.razorpayOrder.id,
            handler: async function (response) {
                try {
                    const verifyRes = await axios.post(
                        "https://grokart-2.onrender.com/api/v1/payment/verify",
                        {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: orderData.order._id
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${storedToken}`
                            }
                        }
                    );

                    if (verifyRes.data.success) {
                        clearCart();
                        navigate("/order-success", {
                            state: {
                                order: verifyRes.data.order,
                                paymentId: response.razorpay_payment_id,
                                paymentMethod: "RAZORPAY"
                            }
                        });
                    } else {
                        throw new Error("Payment verification failed");
                    }
                } catch (error) {
                    console.error("Payment verification error:", error);
                    alert(`Payment verification failed: ${error.message}`);
                }
            },
            prefill: {
                name: storedName || address.name,
                email: storedEmail,
                contact: storedPhone || address.phone || ""
            },
            theme: {
                color: "#3399cc"
            },
            modal: {
                ondismiss: function() {
                    console.log("Payment modal closed by user");
                }
            }
        };

        return new Promise((resolve) => {
            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", (response) => {
                console.error("Payment failed:", response.error);
                alert(`Payment failed: ${response.error.description}`);
                resolve(false);
            });
            rzp.open();
            resolve(true);
        });
    };

    const handlePayment = async () => {
        if (error) {
            alert(error);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Prepare order payload
            const orderPayload = {
                userId: storedUserId,
                cartItems: cartItems.map(item => ({
                    productId: item.productId|| item._id,
                    quantity: item.quantity,
                    
                })),
                totalAmount: finalAmount,
                paymentMethod,
                address:address,
                email: storedEmail,
                couponCode: couponCode || null
            };

            // Create order in backend
            const response = await axios.post(
                "https://grokart-2.onrender.com/api/v1/order/create-order",
                orderPayload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${storedToken}`
                    }
                }
            );

            if (response.data.success) {
                if (paymentMethod === "COD") {
                    clearCart();
                    navigate("/order-success", {
                        state: {
                            order: response.data.order,
                            paymentMethod: "COD"
                        }
                    });
                } else {
                    await initiateRazorpayPayment(response.data);
                }
            } else {
                throw new Error(response.data.error || "Failed to create order");
            }
        } catch (error) {
            console.error("Order error:", {
                message: error.message,
                response: error.response?.data,
                stack: error.stack
            });
            setError(error.response?.data?.error || error.message || "Failed to process order");
            alert(error.response?.data?.error || error.message || "Failed to process order");
        } finally {
            setIsLoading(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <div className="text-red-500 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p className="mb-6">{error}</p>
                    <button
                        onClick={() => navigate("/cart")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
                    >
                        Back to Cart
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
            <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Payment Summary
                </h2>

                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Order Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        {cartItems.map((item, index) => (
                            <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                                <span className="truncate max-w-[180px]">
                                    {item.name} × {item.quantity}
                                </span>
                                <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Payment Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span>₹{totalAmount?.toFixed(2) || "0.00"}</span>
                        </div>
                        {couponCode && (
                            <div className="flex justify-between text-green-600">
                                <span>Discount ({couponCode}):</span>
                                <span>-₹{(totalAmount - finalAmount + (paymentMethod === "COD" ? 25 : 0)).toFixed(2)}</span>
                            </div>
                        )}
                        {paymentMethod === "COD" && (
                            <div className="flex justify-between">
                                <span>COD Charges:</span>
                                <span>₹25.00</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                            <span>Total:</span>
                            <span>₹{finalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Select Payment Method</h3>
                    <div className="space-y-3">
                        <label className="flex items-center space-x-3 p-3 border rounded-lg hover:border-blue-500 cursor-pointer">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="RAZORPAY"
                                checked={paymentMethod === "RAZORPAY"}
                                onChange={() => setPaymentMethod("RAZORPAY")}
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex flex-col">
                                <span className="font-medium">Online Payment</span>
                                <span className="text-sm text-gray-500">Credit/Debit Card, UPI, Net Banking</span>
                            </div>
                        </label>

                        <label className="flex items-center space-x-3 p-3 border rounded-lg hover:border-blue-500 cursor-pointer">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="COD"
                                checked={paymentMethod === "COD"}
                                onChange={() => setPaymentMethod("COD")}
                                className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex flex-col">
                                <span className="font-medium">Cash on Delivery</span>
                                <span className="text-sm text-gray-500">Pay ₹25 extra when you receive your order</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={handlePayment}
                        disabled={isLoading}
                        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all flex justify-center items-center ${
                            isLoading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : paymentMethod === "COD" ? (
                            "Place COD Order"
                        ) : (
                            `Pay ₹${finalAmount.toFixed(2)}`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Payment;
*/}

// File: PaymentComponent.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
//import './PaymentComponent.css';

const Payment = ({ 
  amount, 
  productName, 
  customerEmail, 
  customerPhone,
  address,
  items
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [priceDetails, setPriceDetails] = useState(null);
  const [orderId, setOrderId] = useState(null);
  
  const COD_CHARGE = 20; // This should match the backend value
  
  // Calculate price details based on selected payment method
  useEffect(() => {
    const subtotal = amount;
    const codCharge = paymentMethod === 'cod' ? COD_CHARGE : 0;
    const total = subtotal + codCharge;
    
    setPriceDetails({
      subtotal,
      codCharge,
      total
    });
  }, [amount, paymentMethod]);
  
  const createOrder = async () => {
    try {
      setLoading(true);
      setPaymentError(null);
      
      const orderResponse = await axios.post('https://grokart-2.onrender.com/api/v1/payment/create-order', {
        paymentMethod,
        items,
        currency: 'INR',
        address,
        notes: {
          productName,
          customerEmail
        }
      });
      
      const { data } = orderResponse;
      
      if (data.success) {
        if (paymentMethod === 'razorpay') {
          return {
            orderId: data.orderId,
            razorpayOrderId: data.order.id,
            amount: data.order.amount
          };
        } else {
          // For COD, just store the order ID and return
          setOrderId(data.order.orderId);
          return { codOrder: true, orderId: data.order.orderId };
        }
      } else {
        throw new Error('Order creation failed');
      }
    } catch (error) {
      console.error('Order creation failed:', error);
      setPaymentError('Failed to create order. Please try again.');
      return null;
    }
  };

  const handlePayment = async () => {
    try {
      const orderData = await createOrder();
      
      if (!orderData) return;
      
      // If COD, just show success message
      if (orderData.codOrder) {
        setPaymentSuccess(true);
        setLoading(false);
        return;
      }
      
      // For Razorpay, open the payment modal
      const options = {
        key: 'rzp_test_0dlBqxH635NvB4', // Replace with your key ID
        amount: orderData.amount,
        currency: 'INR',
        name: 'Quick Commerce',
        description: `Payment for ${productName}`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          email: customerEmail,
          contact: customerPhone
        },
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await axios.post('https://grokart-2.onrender.com/api/v1/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            
            setPaymentSuccess(true);
          } catch (error) {
            console.error('Payment verification failed:', error);
            setPaymentError('Payment verification failed. Please try again.');
          } finally {
            setLoading(false);
          }
        },
        theme: {
          color: '#3399cc'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      setPaymentError('Payment initiation failed. Please try again.');
      setLoading(false);
    }
  };

  const renderPaymentMethodSelection = () => (
    <div className="payment-method-container">
      <h3>Select Payment Method</h3>
      <div className="payment-methods">
        <div className="payment-method-option">
          <input
            type="radio"
            id="razorpay"
            name="paymentMethod"
            value="razorpay"
            checked={paymentMethod === 'razorpay'}
            onChange={() => setPaymentMethod('razorpay')}
          />
          <label htmlFor="razorpay">
            <span className="payment-method-name">UPI / Cards / Netbanking</span>
            <span className="payment-method-info">Pay online using Razorpay</span>
          </label>
        </div>
        
        <div className="payment-method-option">
          <input
            type="radio"
            id="cod"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === 'cod'}
            onChange={() => setPaymentMethod('cod')}
          />
          <label htmlFor="cod">
            <span className="payment-method-name">Cash on Delivery</span>
            <span className="payment-method-info">
              Pay when you receive your order (Additional ₹{COD_CHARGE} charge)
            </span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderPriceDetails = () => {
    if (!priceDetails) return null;
    
    return (
      <div className="price-details">
        <h3>Price Details</h3>
        <div className="price-row">
          <span>Subtotal</span>
          <span>₹{priceDetails.subtotal}</span>
        </div>
        {paymentMethod === 'cod' && (
          <div className="price-row cod-charge">
            <span>Cash on Delivery Charge</span>
            <span>₹{priceDetails.codCharge}</span>
          </div>
        )}
        <div className="price-row total">
          <span>Total</span>
          <span>₹{priceDetails.total}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="payment-container">
      <h2>Order Summary</h2>
      <div className="order-details">
        <p>Product: {productName}</p>
        <p>Amount: ₹{amount}</p>
      </div>
      
      {paymentSuccess ? (
        <div className="payment-success">
          <h3>Order Placed Successfully!</h3>
          {paymentMethod === 'razorpay' ? (
            <p>Thank you for your purchase. Payment has been received.</p>
          ) : (
            <p>Thank you for your order. Please keep ₹{priceDetails?.total || amount + COD_CHARGE} ready for delivery.</p>
          )}
          <p>Order ID: {orderId}</p>
        </div>
      ) : (
        <>
          {renderPaymentMethodSelection()}
          {renderPriceDetails()}
          
          <button 
            className="pay-button"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
          </button>
        </>
      )}
      
      {paymentError && (
        <div className="payment-error">
          <p>{paymentError}</p>
        </div>
      )}
    </div>
  );
};

export default Payment;