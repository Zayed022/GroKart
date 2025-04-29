import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react"; // modern success icon

const PaymentSuccessOnline = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order, address, addressDetails } = location.state || {};

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50 px-4 py-8">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg text-center animate-fade-in">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="text-green-600" size={48} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-green-700 mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">Thank you for your order. Your payment has been processed successfully.</p>

        {order && (
          <div className="text-left bg-green-100 p-4 rounded-lg mb-4 text-sm sm:text-base">
            <p><span className="font-semibold">Order ID:</span> {order._id}</p>
            <p><span className="font-semibold">Amount:</span> ₹{order.totalAmount}</p>
          </div>
        )}

        {address && (
          <div className="text-left mb-2">
            <h2 className="text-lg font-semibold mb-1">Delivery Address</h2>
            <p className="text-gray-700">{address}</p>
          </div>
        )}

        {addressDetails && (
          <div className="text-left mb-4">
            <h2 className="text-lg font-semibold mb-1">Additional Details</h2>
            <ul className="text-gray-700 space-y-1 text-sm sm:text-base">
              <li>🏠 House No: {addressDetails.houseNumber}</li>
              <li>🏢 Floor: {addressDetails.floor}</li>
              <li>🏘️ Building: {addressDetails.building}</li>
              <li>📍 Landmark: {addressDetails.landmark}</li>
              <li>📍 Recepient Phone Number: {addressDetails.recipientPhoneNumber}</li>
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Go to Home
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
          >
            View My Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessOnline;
