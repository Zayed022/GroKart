import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/Cart";
import { toast } from "react-hot-toast";
import { OrderContext } from "../context/OrderContext";

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const { cartItems, clearCart } = useContext(CartContext);
  const { address, addressDetails } = location.state || {
    address: "No address provided",
  };
  const { addOrder } = useContext(OrderContext);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const totalItemPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const deliveryCharge = 15;
  const handlingFee = 7;
  const codCharge = 0;
  const GSTCharges = 0;
  const totalPrice =
    totalItemPrice + deliveryCharge + handlingFee + codCharge + GSTCharges;

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

            clearCart();

            navigate("/payment-success-online", {
              state: { order, address, addressDetails },
            });
          } catch (error) {
            console.log("Payment verification failed:", error);
            toast.error(
              "❌ Payment verification failed. Please contact support."
            );
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

  const handleCashfreePayment = async () => {
    if (!user || !user._id || !token) {
      toast.error("User not found. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "https://grokart-2.onrender.com/api/v1/order/create-order-cashfree",
        {
          customerId: user._id,
          customerEmail: user.email || "user@example.com",
          customerPhone: user.phone || "9999999999",
          customerName: user.name || "User",
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
            deliveryInstruction: "Call before arriving",
          },
          codCharge: 0,
          paymentMethod: "cashfree",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { paymentSessionId, orderId } = response.data;

      if (!paymentSessionId || !orderId) {
        toast.error("Failed to initiate payment session.");
        return;
      }

      const cashfree = await load({ mode: "production" }); // Use "sandbox" in dev
      cashfree.checkout({
        paymentSessionId,
        redirectTarget: "_self",
      });

      console.log("✅ Cashfree session started for Order:", orderId);
    } catch (error) {
      console.error(
        "❌ Cashfree payment error:",
        error.response?.data || error
      );
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCODPayment = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://grokart-2.onrender.com/api/v1/order/create-cod-order",
        {
          customerId: user._id,
          items: cartItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
            name: item.name,
            price: item.price,
            description: item.description,
          })),
          totalAmount: totalPrice,
          address,
          addressDetails,
          notes: {},
          paymentMethod: "cod",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      clearCart();
      const paymentDetails = response.data;
      toast.success("✅ COD Order Placed!");
      addOrder({
        ...response.data.order,
        address,
        addressDetails,
        placedAt: new Date().toISOString(),
      });
      navigate("/payment-success", {
        state: { paymentDetails, address, addressDetails },
      });
    } catch (error) {
      console.error("COD order failed:", error);
      toast.error("❌ COD order failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 mt-8 space-y-8">
      <h2 className="text-3xl font-bold text-center text-gray-800">
        Review & Confirm
      </h2>

      {/* Delivery Address */}
      <section className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Deliver To</h3>
        <p className="text-sm text-gray-600">{address}</p>
      </section>

      {/* Order Summary */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Order Summary
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <hr className="my-2 border-gray-200" />

          <div className="flex justify-between font-medium">
            <span>Items Total</span>
            <span>₹{totalItemPrice}</span>
          </div>

          <div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span>₹{deliveryCharge}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-1">
              100% of this amount goes to the delivery partner.
            </p>
          </div>

          <div className="flex justify-between">
            <span>Handling Fee</span>
            <span>₹{handlingFee}</span>
          </div>

          

          <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-semibold text-lg text-green-700">
            <span>Total Payable</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>
      </section>

      {/* Payment Method (Future Scope) */}
      {/* <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Select Payment Method</h3>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              paymentMethod === "upi" ? "bg-indigo-100 border-indigo-600" : "bg-white border-gray-300"
            }`}
            onClick={() => setPaymentMethod("upi")}
          >
            UPI
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium border ${
              paymentMethod === "cod" ? "bg-indigo-100 border-indigo-600" : "bg-white border-gray-300"
            }`}
            onClick={() => setPaymentMethod("cod")}
          >
            COD
          </button>
        </div>
      </section> */}

      {/* Confirm Button */}
      <button
        onClick={handleCODPayment}
        disabled={loading}
        className={`w-full py-3 text-white rounded-xl text-lg font-semibold transition duration-200 ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
        }`}
      >
        {loading ? "Placing Order..." : "Confirm Order Using COD"}
      </button>
    </div>
  );
};

export default Payment;
