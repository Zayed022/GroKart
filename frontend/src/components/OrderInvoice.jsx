import React from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";

const OrderInvoice = () => {
  const location = useLocation();
  const { paymentDetails, address, addressDetails } = location.state || {};

  if (!paymentDetails || !paymentDetails.order) {
    return <div className="p-10 text-center text-gray-500">No invoice data available.</div>;
  }

  const order = paymentDetails.order;
  const items = order.items || [];
  const deliveryFee = 15;
  const handlingFee = 7;
  const gst = 0;
  const codCharge = order.paymentMethod === "COD" ? 25 : 0;
  const subtotal = order.totalAmount - codCharge;
  const itemsTotal = subtotal - (deliveryFee + handlingFee + gst);

const generatePdf = () => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // ==== HEADER ====
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text("Grokart", pageWidth / 2, y, { align: "center" });

  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text("15-minute grocery delivery in Bhiwandi", pageWidth / 2, y, { align: "center" });

  y += 10;
  doc.setDrawColor(180);
  doc.setLineWidth(0.5);
  doc.line(15, y, pageWidth - 15, y);

  // ==== INVOICE TITLE ====
  y += 12;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(40);
  doc.text("Order Invoice", pageWidth / 2, y, { align: "center" });

  // ==== ORDER INFO ====
  y += 10;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(50);
  doc.text(`Order ID: ${order._id}`, 15, y); y += 6;
  doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 15, y); y += 6;
  doc.text(`Payment Method: ${order.paymentMethod.toUpperCase()}`, 15, y); y += 6;
  doc.text(`Payment Status: ${order.paymentStatus}`, 15, y);

  // ==== ITEMS TABLE HEADER ====
  y += 12;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30);
  doc.text("Items Ordered", 15, y);

  y += 6;

// Header Styling
doc.setFillColor(245); // Light gray background
doc.setDrawColor(200); // Border color
doc.rect(15, y, pageWidth - 30, 10, "FD"); // Table header background

doc.setFont("helvetica", "bold");
doc.setFontSize(11);
doc.setTextColor(60);

// Column headers with proper spacing
doc.text("Item", 17, y + 7);
doc.text("Qty", 85, y + 7);
doc.text("Desc", 105, y + 7);
doc.text("Price", 145, y + 7);
doc.text("Total", pageWidth - 35, y + 7);

// Start listing items
y += 14;

doc.setFont("helvetica", "normal");
doc.setFontSize(10);
doc.setTextColor(20);

// Helper for truncating long text
const truncate = (text, maxLength = 25) =>
  text.length > maxLength ? text.slice(0, maxLength - 3) + "..." : text;

items.forEach((item) => {
  doc.text(truncate(item.name), 17, y);
  doc.text(`${item.quantity}`, 85, y);
  doc.text(truncate(item.description || "-"), 105, y);
  doc.text(`₹${item.price}`, 145, y);
  doc.text(`₹${item.price * item.quantity}`, pageWidth - 35, y);
  y += 6;
});


  // ==== CHARGES ====
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30);
  doc.text("Charges Summary", 15, y);

  const charges = [
    ["Items Total", itemsTotal],
    ["Delivery Fee", deliveryFee],
    ["Handling Fee", handlingFee],
    
    ["Subtotal", subtotal],
    ...(codCharge > 0 ? [["COD Charges", codCharge]] : []),
    ["Total Amount", order.totalAmount],
  ];

  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  charges.forEach(([label, value], idx) => {
    if (idx === charges.length - 1) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
    }

    doc.setTextColor(60);
    doc.text(`${label}:`, 17, y);
    doc.text(`₹${value}`, pageWidth - 35, y, { align: "right" });
    y += 7;
  });

  // ==== DELIVERY DETAILS ====
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(30);
  doc.text("Delivery Details", 15, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(50);
  y += 7;
  doc.text(`${address}`, 17, y); y += 6;
  doc.text(`House: ${addressDetails.houseNumber}`, 17, y); y += 6;
  doc.text(`Building: ${addressDetails.building}`, 17, y); y += 6;
  doc.text(`Floor: ${addressDetails.floor}`, 17, y); y += 6;
  doc.text(`Landmark: ${addressDetails.landmark}`, 17, y); y += 6;
  doc.text(`Phone: ${addressDetails.recipientPhoneNumber}`, 17, y);

  // ==== FOOTER ====
  y += 15;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Thank you for shopping with Grokart!", pageWidth / 2, y, { align: "center" });

  // Save
  doc.save(`Invoice-${order._id}.pdf`);
};



  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Order Invoice</h1>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Payment Status:</strong> {order.paymentStatus}</p>

        <h2 className="text-lg font-semibold mt-6 mb-2">Items Ordered</h2>
        <ul className="text-sm space-y-1">
          {items.map((item, idx) => (
            <li key={idx}>
              {item.name}- {item.description} (x{item.quantity}) - ₹{item.price * item.quantity}
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-1 text-sm">
          <p><strong>Items Total:</strong> ₹{itemsTotal}</p>
          <p><strong>Delivery Fee:</strong> ₹{deliveryFee}</p>
          <p><strong>Handling Fee:</strong> ₹{handlingFee}</p>
          
          <p><strong>Subtotal:</strong> ₹{subtotal}</p>
          {codCharge > 0 && <p><strong>COD Charges:</strong> ₹{codCharge}</p>}
          <p className="font-bold"><strong>Total:</strong> ₹{order.totalAmount}</p>
        </div>

        <h2 className="text-lg font-semibold mt-6 mb-2">Delivery Details</h2>
        <div className="text-sm space-y-1">
          <p>{address}</p>
          <p>House: {addressDetails.houseNumber}</p>
          <p>Building: {addressDetails.building}</p>
          <p>Floor: {addressDetails.floor}</p>
          <p>Landmark: {addressDetails.landmark}</p>
          <p>Phone: {addressDetails.recipientPhoneNumber}</p>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={generatePdf}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Download Invoice PDF
        </button>
      </div>
    </div>
  );
};

export default OrderInvoice;
