import { useLocation } from "react-router-dom";

const PaymentSuccessOnline = () => {
  const location = useLocation();
  const { order, address, addressDetails } = location.state || {};

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">✅ Payment Successful!</h1>
        <p className="text-gray-700 mb-2">Thank you for your order.</p>
        {order && (
          <>
            <p className="text-gray-600">
              <span className="font-semibold">Order ID:</span> {order.id}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Amount:</span> ₹{order.amount / 100}
            </p>
          </>
        )}
        {address && (
          <div className="text-left mt-4">
            <h2 className="text-lg font-semibold">Delivery Address</h2>
            <p className="text-gray-700">{address}</p>
            
            
          </div>
        )}
        {addressDetails && (
          <div className="text-left mt-4">
            <h2 className="text-lg font-semibold">Delivery Address</h2>
            <p className="text-gray-700">{addressDetails.houseNumber}</p>
            
            
          </div>
        )}
        <button
          onClick={() => window.location.href = "/"}
          className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessOnline;
