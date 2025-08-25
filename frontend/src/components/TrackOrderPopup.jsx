// components/TrackOrderPopup.jsx
import React from "react";

const TrackOrderPopup = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="fixed bottom-20 right-5 z-50 bg-white border border-gray-300 rounded-xl shadow-lg p-4 w-[320px]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-gray-800">🛒 Order Tracking</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-sm">✖</button>
      </div>

      <div className="text-sm text-gray-700 space-y-1">
        <p><strong>ID:</strong> {order._id}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total:</strong> ₹{order.totalAmount}</p>
        <p><strong>Items:</strong> {order.items.map(i => `${i.name}×${i.quantity}`).join(", ")}</p>
        <p><strong>Payment:</strong> {order.paymentMethod.toUpperCase()}</p>
      </div>
    </div>
  );
};

export default TrackOrderPopup;
