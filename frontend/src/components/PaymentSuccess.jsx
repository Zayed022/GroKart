import React from "react";
import { useLocation } from "react-router-dom";
import { CheckCircle2, MapPin, StickyNote, CreditCard } from "lucide-react";

const PaymentSuccess = () => {
  const location = useLocation();
  const { paymentDetails, address, addressDetails } = location.state || {};

  if (!paymentDetails) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-gray-500 text-lg">No payment data found.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="text-green-600 w-14 h-14 mb-3" />
          <h2 className="text-3xl font-bold text-green-700">Order Confirmed!</h2>
          <p className="text-gray-600 mt-2">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
        </div>

        <div className="space-y-4 text-gray-700">
          <DetailRow label="Payment Method" value={paymentDetails.order.paymentMethod} icon={<CreditCard />} />
          <DetailRow label="Base Amount" value={`₹${paymentDetails.order.baseAmount}`} />
          <DetailRow label="COD Charge" value={`₹${paymentDetails.order.codCharge}`} />
          <DetailRow label="Total Amount" value={`₹${paymentDetails.order.totalAmount - 20}`} />
          <DetailRow label="Payment Status" value={paymentDetails.status} />
          <DetailRow label="Delivery Address" value={address || "N/A"} icon={<MapPin />} />
          <DetailRow label="House Number" value={addressDetails.houseNumber || "N/A"} />
          <DetailRow label="Floor " value={addressDetails.floor || "N/A"} />
          <DetailRow label="Building" value={addressDetails.building || "N/A"} />
          <DetailRow label="Landmark" value={addressDetails.landmark || "N/A"} />
          <DetailRow label="Recepient Phone Number" value={addressDetails.recepientPhoneNumber || "N/A"} />
          <DetailRow label="Note" value={paymentDetails.order.notes || "N/A"} icon={<StickyNote />} />
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => window.location.href = "/"}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, icon }) => (
  <div className="flex items-start justify-between border-b pb-3">
    <div className="flex items-center gap-2">
      {icon && <span className="text-gray-500">{icon}</span>}
      <span className="font-medium">{label}</span>
    </div>
    <span className="text-right">{value}</span>
  </div>
);

export default PaymentSuccess;
