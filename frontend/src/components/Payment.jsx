import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/Cart";
import { toast } from "react-hot-toast";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token"); // ✅ Correct key

  const user = JSON.parse(localStorage.getItem("user")); // or wherever you're storing user info

  const { cartItems } = useContext(CartContext);
  const { address, addressDetails } = location.state || { address: "No address provided" };

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [loading, setLoading] = useState(false);

  const totalItemPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryCharge = 15;
  const handlingFee = 9;
  const codCharge = paymentMethod === "cod" ? 20 : 0;

  const totalPrice =
    totalItemPrice + deliveryCharge + handlingFee + codCharge;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUPIPayment = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

  if (!user || !user._id || !token) {
    toast.error("User not found. Please log in again.");
    navigate("/login");
    return;
  }
    const res = await loadRazorpayScript();
  
    if (!res) {
      alert("Failed to load Razorpay SDK. Check your connection.");
      return;
    }
  
    try {
      console.log("Token being sent:", token);
      console.log("Cart Items being sent:", cartItems);


      const response = await axios.post(
        "https://grokart-2.onrender.com/api/v1/order/create-order",
        {
          customerId: user._id, // assuming user info is available
          items: cartItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
            name: item.name,
            price: item.price,
          })),
          totalAmount: totalPrice,
          address,
          addressDetails,
          notes: {
            deliveryInstruction: "Call before arriving", // or make dynamic
          },
          codCharge: 0,
          paymentMethod: "razorpay",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const { razorpayOrder, order } = response.data;
      const { id: order_id, amount, currency } = razorpayOrder;
  
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "Grokart",
        description: "15-minute delivery payment",
        order_id,
        handler: async (response) => {
          console.log("Razorpay response:", response);
          try {
            await axios.post(
              "https://grokart-2.onrender.com/api/v1/order/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id, // 👈 pass order._id to identify which order to update
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
        
            navigate("/payment-success-online", {
              state: { order, address, addressDetails },
            });
          } catch (error) {
            console.log("Payment verification failed:", error);
            toast.error("❌ Payment verification failed. Please contact support.");
          }
        },
        
        
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#6366f1",
        },
        redirect: false,
      };
  
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.log("Online payment failed:", error);
      toast.error("❌ Online payment failed. Try again.");
    }
  };
  

  const handleCODPayment = async () => {
    try {
      const token = localStorage.getItem("token"); // or from context/store
      
  
      const response = await axios.post(
        "https://grokart-2.onrender.com/api/v1/order/create-cod-order",
        {
          customerId: user._id, // assuming user info is available
          items: cartItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
            name: item.name,
            price: item.price,
          })),      // should be an array of productId, name, quantity, price
          totalAmount: totalPrice,
          address,
          addressDetails,
          notes: {},              // if you're using any notes
          paymentMethod: "cod",  // required in backend
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const paymentDetails = response.data;
  
      toast.success("✅ COD Order Placed!");
      navigate("/payment-success", {
        state: { paymentDetails, address, addressDetails },
      });
  
    } catch (error) {
      console.error("COD order failed:", error);
      toast.error("❌ COD order failed. Try again.");
    }
  };

  const handlePayment = () => {
    if (paymentMethod === "upi") {
      handleUPIPayment();
    } else {
      handleCODPayment();
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-2xl p-6 mt-6 space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800">Checkout</h2>

      <div className="bg-gray-100 p-4 rounded-md">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Delivery Address</h3>
        <p className="text-sm text-gray-600">{address}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Select Payment Method</h3>
        <div className="flex gap-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="upi"
              checked={paymentMethod === "upi"}
              onChange={() => setPaymentMethod("upi")}
              className="accent-indigo-600"
            />
            <span>Pay Online (UPI / Card)</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
              className="accent-indigo-600"
            />
            <span>Cash on Delivery</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Order Summary</h3>
        <div className="space-y-1 text-sm text-gray-600">
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="flex justify-between mt-2">
            <span>Items Total</span>
            <span>₹{totalItemPrice}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery Charges</span>
            <span>₹{deliveryCharge}</span>
          </div>
          <div className="flex justify-between">
            <span>Handling Fee</span>
            <span>₹{handlingFee}</span>
          </div>
          {paymentMethod === "cod" && (
            <div className="flex justify-between text-red-500 font-medium">
              <span>COD Charges</span>
              <span>₹{codCharge}</span>
            </div>
          )}
          <div className="border-t border-gray-200 mt-3 pt-2 flex justify-between font-semibold text-green-700 text-base">
            <span>Total Payable</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full py-3 text-white rounded-md text-lg font-medium transition duration-200 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {paymentMethod === "upi" ? "Pay Now using UPI" : "Pay Now using COD"}
      </button>
    </div>
  );
};

export default Payment;
