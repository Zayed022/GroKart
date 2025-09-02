import { useContext, useState, useEffect } from "react";
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
  const { address, addressDetails } = location.state || { address: "No address provided" };
  const { addOrder } = useContext(OrderContext);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  // dynamic fees & flags
  const [fees, setFees] = useState({
    deliveryCharge: 0,
    handlingFee: 0,
    codCharge: 0,
    gstPercentage: 0,
    lateNightFee: 0,
    isLateNightActive: false,
    surgeFee: 0,
    isSurgeActive: false,
  });

  const totalItemPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // fetch fee config
  useEffect(() => {
    const fetchFeeConfig = async () => {
      try {
        const { data } = await axios.get("https://grokart-2.onrender.com/api/v1/fee/");
        // ensure numeric conversion
        setFees({
          deliveryCharge: Number(data?.deliveryCharge ?? 0),
          handlingFee: Number(data?.handlingFee ?? 0),
          codCharge: Number(data?.codCharge ?? 0),
          gstPercentage: Number(data?.gstPercentage ?? 0), // backend uses gstPercentage
          lateNightFee: Number(data?.lateNightFee ?? 0),
          isLateNightActive: Boolean(data?.isLateNightActive ?? false),
          surgeFee: Number(data?.surgeFee ?? 0),
          isSurgeActive: Boolean(data?.isSurgeActive ?? false),
        });
      } catch (error) {
        console.error("❌ Failed to fetch fee config:", error);
        toast.error("Unable to fetch fee configuration.");
      }
    };
    fetchFeeConfig();
  }, []);

  // compute active extra fees
  const activeLateNight = fees.isLateNightActive ? fees.lateNightFee : 0;
  const activeSurge = fees.isSurgeActive ? fees.surgeFee : 0;

  // subtotal (items + applicable fees)
  const subTotal = totalItemPrice + fees.deliveryCharge + fees.handlingFee + activeLateNight + activeSurge;

  // gst computed from percentage on subtotal (adjust if you prefer GST only on items)


  // final total including COD charge if any
  const grandTotalNumber = subTotal + gstAmount + (fees.codCharge || 0);

  // formatted display
  const displayTotal = grandTotalNumber.toFixed(2);
  const displayGst = gstAmount.toFixed(2);

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
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    if (!storedUser || !storedUser._id || !storedToken) {
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
      const response = await axios.post(
        "https://grokart-2.onrender.com/api/v1/order/create-order",
        {
          customerId: storedUser._id,
          items: cartItems.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
            name: item.name,
            price: item.price,
          })),
          totalAmount: grandTotalNumber, // send numeric
          address,
          addressDetails,
          notes: { deliveryInstruction: "Call before arriving" },
          feesBreakdown: {
            deliveryCharge: fees.deliveryCharge,
            handlingFee: fees.handlingFee,
            lateNightFee: activeLateNight,
            surgeFee: activeSurge,
            gstAmount,
            codCharge: fees.codCharge
          },
          paymentMethod: "razorpay",
        },
        { headers: { Authorization: `Bearer ${storedToken}` } }
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
        handler: async (razorResponse) => {
          try {
            await axios.post(
              "https://grokart-2.onrender.com/api/v1/order/verify",
              {
                razorpay_order_id: razorResponse.razorpay_order_id,
                razorpay_payment_id: razorResponse.razorpay_payment_id,
                razorpay_signature: razorResponse.razorpay_signature,
                orderId: order._id,
              },
              { headers: { Authorization: `Bearer ${storedToken}` } }
            );

            clearCart();
            navigate("/payment-success-online", { state: { order, address, addressDetails } });
          } catch (error) {
            toast.error("❌ Payment verification failed.");
          }
        },
        prefill: {
          name: storedUser.name,
          email: storedUser.email,
          contact: storedUser.phone,
        },
        theme: { color: "#6366f1" },
        redirect: false,
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Online payment failed:", error);
      toast.error("❌ Online payment failed. Try again.");
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
          totalAmount: grandTotalNumber,
          address,
          addressDetails,
          notes: {},
          feesBreakdown: {
            deliveryCharge: fees.deliveryCharge,
            handlingFee: fees.handlingFee,
            lateNightFee: activeLateNight,
            surgeFee: activeSurge,
            gstAmount,
            codCharge: fees.codCharge
          },
          paymentMethod: "cod",
        },
        { headers: { Authorization: `Bearer ${token}` } }
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
      navigate("/payment-success", { state: { paymentDetails, address, addressDetails } });
    } catch (error) {
      console.error("COD order failed:", error);
      toast.error("❌ COD order failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-6 mt-8 space-y-8">
      <h2 className="text-3xl font-bold text-center text-gray-800">Review & Confirm</h2>

      <section className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">Deliver To</h3>
        <p className="text-sm text-gray-600">{address}</p>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm text-gray-700">
          {cartItems.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span>{item.name} × {item.quantity}</span>
              <span>₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}

          <hr className="my-2 border-gray-200" />

          <div className="flex justify-between font-medium">
            <span>Items Total</span>
            <span>₹{totalItemPrice.toFixed(2)}</span>
          </div>

          <div>
            <div className="flex justify-between">
              <span>Delivery Charge</span>
              <span>₹{fees.deliveryCharge.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-1">100% of this amount goes to the delivery partner.</p>
          </div>

          <div className="flex justify-between">
            <span>Handling Fee</span>
            <span>₹{fees.handlingFee.toFixed(2)}</span>
          </div>

          {fees.isLateNightActive && fees.lateNightFee > 0 && (
            <div className="flex justify-between">
              <span>Late Night Fee</span>
              <span>₹{fees.lateNightFee.toFixed(2)}</span>
            </div>
          )}

          {fees.isSurgeActive && fees.surgeFee > 0 && (
            <div className="flex justify-between">
              <span>Surge Fee</span>
              <span>₹{fees.surgeFee.toFixed(2)}</span>
            </div>
          )}

          {fees.gstPercentage > 0 && (
            <div className="flex justify-between">
              <span>GST ({fees.gstPercentage}%)</span>
              <span>₹{displayGst}</span>
            </div>
          )}

          <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-semibold text-xl text-green-700">
            <span>Total Payable</span>
            <span>₹{displayTotal}</span>
          </div>
        </div>
      </section>

      <button
        onClick={handleCODPayment}
        disabled={loading}
        className={`w-full py-3 text-white rounded-xl text-lg font-semibold transition duration-200 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
      >
        {loading ? "Placing Order..." : "Confirm Order Using COD"}
      </button>
    </div>
  );
};

export default Payment;
