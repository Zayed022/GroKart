import React from "react";
import { useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const { paymentDetails, address } = location.state || {};

  if (!paymentDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">No payment data found.</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-10 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-green-600 mb-6 text-center">
          🎉 Order Placed Successfully!
        </h2>

        <div className="space-y-4 text-base text-gray-700">
          <DetailRow label="Payment Mode" value={paymentDetails.paymentMode} />
          <DetailRow label="Base Amount" value={`₹${paymentDetails.baseAmount}`} />
          <DetailRow label="COD Charge" value={`₹${paymentDetails.codCharge}`} />
          <DetailRow label="Total Amount" value={`₹${paymentDetails.totalAmount}`} />
          <DetailRow label="Status" value={paymentDetails.status} />
          <DetailRow label="Address" value={address || "N/A"} />
          <DetailRow label="Note" value={paymentDetails.message} />
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="font-medium">{label}:</span>
    <span>{value}</span>
  </div>
);

export default PaymentSuccess;
