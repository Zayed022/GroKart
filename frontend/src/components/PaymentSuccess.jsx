import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  CheckCircle2,
  MapPin,
  StickyNote,
  CreditCard,
  ShoppingBagIcon,
  Phone,
  Mail,
  FileText,
} from "lucide-react";

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

  const orderId = paymentDetails.order._id;

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="text-green-600 w-14 h-14 mb-3" />
          <h2 className="text-3xl font-bold text-green-700">Order Confirmed!</h2>
          <p className="text-gray-600 mt-2">
            Thank you for your purchase. Your order has been placed successfully and will arrive in few minutes!
          </p>
        </div>

        <div className="space-y-4 text-gray-700">
          <DetailRow label="Order ID" value={orderId || "N/A"} />
          <DetailRow label="Payment Method" value={paymentDetails.order.paymentMethod.toUpperCase()} icon={<CreditCard />} />
          <DetailRow label="Base Amount" value={`₹${paymentDetails.order.totalAmount - 24}`} />
          <DetailRow label="Total Amount" value={<span className="text-green-700 font-bold text-lg">₹{paymentDetails.order.totalAmount}</span>} />
          <DetailRow
            label="Payment Status"
            value={
              <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                paymentDetails.order.paymentStatus === "Success" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}>
                {paymentDetails.order.paymentStatus || "Pending"}
              </span>
            }
          />
          <DetailRow label="Delivery Address" value={address || "N/A"} icon={<MapPin />} />
          <DetailRow label="House Number" value={addressDetails.houseNumber || "N/A"} />
          <DetailRow label="Floor" value={addressDetails.floor || "N/A"} />
          <DetailRow label="Building" value={addressDetails.building || "N/A"} />
          <DetailRow label="Landmark" value={addressDetails.landmark || "N/A"} />
          <DetailRow label="Recipient Phone Number" value={addressDetails.recipientPhoneNumber || "N/A"} />
          <p className="text-sm text-gray-500 mt-2">Expected delivery: <span className="font-medium text-indigo-600">within 15 minutes</span></p>
          <div className="text-l text-red-500 font-bold">
            <DetailRow label="Note" value={paymentDetails.order.notes || `Please pay ₹${paymentDetails.order.totalAmount} to Delivery Partner upon arrival of order`} icon={<StickyNote />} />
          </div>
        </div>

        {/* ✅ Action Buttons Section */}
        {/* ✅ Action Buttons Section */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {/* Invoice Button */}
          <Link
            to={`/invoice/${orderId}`}
            state={{ paymentDetails, address, addressDetails }}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-200 shadow-sm"
          >
            <FileText size={18} /> Invoice
          </Link>

          {/* Track Order Button */}
          

          {/* Support Phone */}
          <a
            href="tel:+917498881947"
            className="flex items-center gap-2 px-5 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition duration-200 shadow-sm"
          >
            <Phone size={18} /> Call Support
          </a>

          {/* Email Support */}
          <a
            href="mailto:zayedans022@gmail.com"
            className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200 shadow-sm"
          >
            <Mail size={18} /> Email Us
          </a>
        </div>

        {/* ✅ Continue Shopping */}
        <div className="text-center mt-6">
          <Link to="/" className="inline-block">
            <button className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition duration-300 shadow-sm">
              <ShoppingBagIcon className="w-5 h-5" />
              Continue Shopping
            </button>
          </Link>
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
