// src/components/Invoice.jsx
import React, { forwardRef } from "react";
import moment from "moment";

/*
  Usage:
  <Invoice ref={printRef} order={orderObj} />
  
  The parent can use react-to-print or any other print handler.
*/

const Invoice = forwardRef(({ order }, ref) => {
  if (!order) return null; // graceful fallback

  const {
    _id,
    customerId = {},
    items = [],
    totalAmount = 0,
    paymentStatus = "Unpaid",
    updatedAt,
  } = order;

  const formatDate = (d) => (d ? moment(d).format("DD MMM YYYY") : "");

  const grandTotal = totalAmount.toLocaleString("en-IN");

  return (
    <div
      ref={ref}
      style={{ width: 800 }}
      className="mx-auto bg-white px-10 py-8 text-sm leading-6 text-gray-800"
    >
      {/* Header */}
      <header className="flex justify-between items-start">
        {/* Company Info */}
        <div className="text-right w-1/2">
          <h1 className="text-2xl font-extrabold tracking-wide text-gray-900">
            INVOICE
          </h1>
          <p className="text-xs text-gray-600">GroKart Corp.</p>
          <p className="text-xs text-gray-600">123 Market Street</p>
          <p className="text-xs text-gray-600">Mumbai, MH 400001</p>
          <p className="text-xs text-gray-600">support@grokart.com</p>
        </div>

        {/* Invoice Meta & Customer Info */}
        <div className="w-1/2 text-left">
          <p className="font-semibold">Bill To:</p>
          <p>{customerId.name || "—"}</p>
          {customerId.email && (
            <p className="text-xs text-gray-500">{customerId.email}</p>
          )}
          {customerId.phone && (
            <p className="text-xs text-gray-500">📞 {customerId.phone}</p>
          )}

          <div className="mt-6 text-right">
            <p className="text-xs text-gray-600">Invoice #: {_id}</p>
            <p className="text-xs text-gray-600">
              Invoice Date: {formatDate(updatedAt)}
            </p>
            <p className="text-xs text-gray-600">
              Payment Status:{" "}
              <span
                className={
                  paymentStatus === "Paid" ? "text-green-600" : "text-red-600"
                }
              >
                {paymentStatus}
              </span>
            </p>
          </div>
        </div>
      </header>

      <hr className="my-6 border-gray-300" />

      {/* Items Table */}
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-y bg-gray-50">
            <th className="px-2 py-2 font-medium">Item</th>
            <th className="w-16 px-2 py-2 text-right font-medium">Qty</th>
            <th className="w-24 px-2 py-2 text-right font-medium">Price</th>
            <th className="w-28 px-2 py-2 text-right font-medium">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id || item.name} className="border-b">
              <td className="px-2 py-2">{item.name}</td>
              <td className="px-2 py-2 text-right">{item.quantity}</td>
              <td className="px-2 py-2 text-right">₹{item.price}</td>
              <td className="px-2 py-2 text-right">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Section */}
      <section className="mt-6 flex justify-end">
        <div className="w-60 text-sm">
          <div className="flex justify-between font-semibold">
            <span>Grand Total:</span>
            <span>₹{grandTotal}</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-10 text-center text-xs text-gray-500">
        Thank you for shopping with GroKart!
      </footer>
    </div>
  );
});

export default Invoice;
