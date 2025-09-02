import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/Cart";
import axios from "axios";

const Checkout = () => {
  const location = useLocation();
  const { address, addressDetails } = location.state || {
    address: "No address provided",
  };
  const { cartItems, getCartTotal } = useContext(CartContext);

  const navigate = useNavigate();

  // 🔹 state for fees
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [handlingFee, setHandlingFee] = useState(0);
  const [gstPercentage, setGstPercentage] = useState(0);
  const [lateNightFee, setLateNightFee] = useState(0);
  const [surgeFee, setSurgeFee] = useState(0);
  const [isLateNightActive, setIsLateNightActive] = useState(false);
  const [isSurgeActive, setIsSurgeActive] = useState(false);
  const [loadingFees, setLoadingFees] = useState(true);

  // 🔹 fetch active fee config
  useEffect(() => {
  const fetchFees = async () => {
    try {
      const res = await axios.get("https://grokart-2.onrender.com/api/v1/fee/");
      console.log("Fee API response:", res.data);
      if (res.data && res.data._id) {
  const config = res.data;
  setDeliveryCharge(config.deliveryCharge || 0);
  setHandlingFee(config.handlingFee || 0);
  setGstPercentage(config.gstPercentage || 0);
  setLateNightFee(config.lateNightFee || 0);
  setSurgeFee(config.surgeFee || 0);
  setIsLateNightActive(config.isLateNightActive || false);
  setIsSurgeActive(config.isSurgeActive || false);
}
      console.log("LateNight state ->", {
        lateNightFee: res.data.lateNightFee,
        isLateNightActive: res.data.isLateNightActive,
      });
    } catch (error) {
      console.error("Failed to fetch fee config:", error);
    } finally {
      setLoadingFees(false);
    }
  };
  fetchFees();
}, []);


  const itemTotal = getCartTotal();

  // 🔹 calculate gst & grand total
  const subTotal =
    itemTotal +
    deliveryCharge +
    handlingFee +
    (isLateNightActive ? lateNightFee : 0) +
    (isSurgeActive ? surgeFee : 0);

  const gstAndCharges = (subTotal * gstPercentage) / 100;
  const grandTotal = (subTotal + gstAndCharges).toFixed(2);

  const handleProceedToPayment = () => {
    navigate("/payment", {
      state: {
        cartItems,
        totalAmount: grandTotal,
        address,
        location,
        addressDetails,
      },
    });
  };

  if (loadingFees) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-600">Loading checkout summary...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 border-b pb-4 mb-6">
          Checkout Summary
        </h2>

        {/* Address */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-1">
            Shipping Address
          </h3>
          <p className="text-gray-600">{address}</p>
        </div>

        {/* Cart Items */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Order Items
          </h3>
          {cartItems.length > 0 ? (
            <ul className="space-y-3">
              {cartItems.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900 text-lg">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No items in cart</p>
          )}
        </div>

        {/* Bill Breakdown */}
        <div className="space-y-3 border-t pt-6">
          <div className="flex justify-between text-gray-700">
            <span className="text-base">Item Total</span>
            <span className="font-medium">₹{itemTotal.toFixed(2)}</span>
          </div>

          <div>
            <div className="flex justify-between text-gray-700">
              <span className="text-base">Delivery Charge</span>
              <span className="font-medium">₹{deliveryCharge}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1 ml-1">
              100% of this fee goes directly to the delivery partner
            </p>
          </div>

          <div className="flex justify-between text-gray-700">
            <span className="text-base">Handling Fee</span>
            <span className="font-medium">₹{handlingFee}</span>
          </div>

         {isLateNightActive && lateNightFee > 0 && (
  <div className="flex justify-between text-gray-700">
    <span className="text-base">Late Night Fee</span>
    <span className="font-medium">₹{lateNightFee}</span>
  </div>
)}




          {isSurgeActive && surgeFee > 0 && (
            <div className="flex justify-between text-gray-700">
              <span className="text-base">Surge Fee</span>
              <span className="font-medium">₹{surgeFee}</span>
            </div>
          )}

          {gstPercentage > 0 && (
            <div className="flex justify-between text-gray-700">
              <span className="text-base">GST ({gstPercentage}%)</span>
              <span className="font-medium">₹{gstAndCharges.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between items-center border-t pt-5 mt-4">
            <span className="text-xl font-bold text-gray-800">
              Total Payable
            </span>
            <span className="text-2xl font-extrabold text-green-600">
              ₹{grandTotal}
            </span>
          </div>
        </div>

        {/* Notice */}
        <div className="mt-8">
          <p className="text-sm flex items-center justify-center font-bold text-yellow-800 bg-yellow-100 border border-yellow-200 px-4 py-3 rounded-xl shadow-inner">
            Review your order to avoid cancellation.
          </p>
          <div className="bg-white border border-gray-200 text-sm text-gray-700 mt-3 p-4 rounded-xl shadow">
            <p className="mb-2 font-medium">
              NOTE: Orders cannot be cancelled and are non-refundable once
              packed for delivery.
            </p>
            <Link
              to="/cancellation"
              className="text-blue-600 hover:underline text-sm"
            >
              Read Cancellation Policy
            </Link>
          </div>
        </div>

        {/* Proceed Button */}
        <button
          onClick={handleProceedToPayment}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium rounded-lg shadow-lg transition"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Checkout;
