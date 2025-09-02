import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import axios from "axios";

const OrderInvoice = () => {
  const location = useLocation();
  const { paymentDetails, address, addressDetails } = location.state || {};

  const [deliveryFeeCfg, setDeliveryFeeCfg] = useState(0);
  const [handlingFeeCfg, setHandlingFeeCfg] = useState(0);
  const [lateNightFeeCfg, setLateNightFeeCfg] = useState(0);
  const [isLateNightActiveCfg, setIsLateNightActiveCfg] = useState(false);
  const [surgeFeeCfg, setSurgeFeeCfg] = useState(0);
  const [isSurgeActiveCfg, setIsSurgeActiveCfg] = useState(false);
  const [loadingFees, setLoadingFees] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await axios.get("https://grokart-2.onrender.com/api/v1/fee/");
        const data = res.data || {};
        setDeliveryFeeCfg(Number(data.deliveryCharge ?? 0));
        setHandlingFeeCfg(Number(data.handlingFee ?? 0));
        setLateNightFeeCfg(Number(data.lateNightFee ?? 0));
        setIsLateNightActiveCfg(Boolean(data.isLateNightActive ?? false));
        setSurgeFeeCfg(Number(data.surgeFee ?? 0));
        setIsSurgeActiveCfg(Boolean(data.isSurgeActive ?? false));
      } catch (error) {
        console.error("Failed to fetch fee config:", error);
      } finally {
        setLoadingFees(false);
      }
    };
    fetchFees();
  }, []);

  if (!paymentDetails || !paymentDetails.order) {
    return (
      <div className="p-10 text-center text-gray-500">
        No invoice data available.
      </div>
    );
  }

  const order = paymentDetails.order;
  const items = order.items || [];

  const recorded = order.feesBreakdown || null;

  const itemsTotalNum = items.reduce(
    (acc, it) => acc + Number(it.price ?? 0) * Number(it.quantity ?? 0),
    0
  );

  const deliveryFee = recorded?.deliveryCharge ?? deliveryFeeCfg;
  const handlingFee = recorded?.handlingFee ?? handlingFeeCfg;
  const lateNightFee =
    recorded?.lateNightFee ?? (isLateNightActiveCfg ? lateNightFeeCfg : 0);
  const surgeFee =
    recorded?.surgeFee ?? (isSurgeActiveCfg ? surgeFeeCfg : 0);

  // ✅ Final total (no GST, no COD)
  const totalCalculated =
    itemsTotalNum + deliveryFee + handlingFee + lateNightFee + surgeFee;

  const fmt = (n) => Number(n || 0).toFixed(2);

  const generatePdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Grokart", pageWidth / 2, y, { align: "center" });

    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("15-minute grocery delivery in Bhiwandi", pageWidth / 2, y, {
      align: "center",
    });

    y += 10;
    doc.setDrawColor(180);
    doc.setLineWidth(0.5);
    doc.line(15, y, pageWidth - 15, y);

    y += 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Order Invoice", pageWidth / 2, y, { align: "center" });

    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Order ID: ${order._id}`, 15, y);
    y += 6;
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 15, y);
    y += 6;
    doc.text(`Payment Method: ${order.paymentMethod}`, 15, y);
    y += 6;
    doc.text(`Payment Status: ${order.paymentStatus}`, 15, y);

    y += 12;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Items Ordered", 15, y);

    y += 6;
    doc.setFillColor(245);
    doc.setDrawColor(200);
    doc.rect(15, y, pageWidth - 30, 10, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Item", 17, y + 7);
    doc.text("Qty", 85, y + 7);
    doc.text("Desc", 105, y + 7);
    doc.text("Price", 145, y + 7);
    doc.text("Total", pageWidth - 35, y + 7);

    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    const truncate = (text, max = 25) =>
      text
        ? text.length > max
          ? text.slice(0, max - 3) + "..."
          : text
        : "-";

    items.forEach((it) => {
      doc.text(truncate(it.name), 17, y);
      doc.text(`${it.quantity}`, 85, y);
      doc.text(truncate(it.description || "-"), 105, y);
      doc.text(`₹${fmt(it.price)}`, 145, y);
      doc.text(`₹${fmt(it.price * it.quantity)}`, pageWidth - 35, y);
      y += 6;
      if (y > doc.internal.pageSize.getHeight() - 60) {
        doc.addPage();
        y = 20;
      }
    });

    // ✅ Charges (no GST, no COD)
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Charges Summary", 15, y);

    const charges = [
      ["Items Total", fmt(itemsTotalNum)],
      ["Delivery Fee", fmt(deliveryFee)],
      ["Handling Fee", fmt(handlingFee)],
      ...(lateNightFee > 0 ? [["Late Night Fee", fmt(lateNightFee)]] : []),
      ...(surgeFee > 0 ? [["Surge Fee", fmt(surgeFee)]] : []),
      ["Total Amount", fmt(totalCalculated)],
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
      doc.text(label + ":", 17, y);
      doc.text(`₹${value}`, pageWidth - 35, y, { align: "right" });
      y += 7;
    });

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Delivery Details", 15, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    y += 7;
    doc.text(`${address}`, 17, y);
    y += 6;
    doc.text(`House: ${addressDetails.houseNumber || "-"}`, 17, y);
    y += 6;
    doc.text(`Building: ${addressDetails.building || "-"}`, 17, y);
    y += 6;
    doc.text(`Floor: ${addressDetails.floor || "-"}`, 17, y);
    y += 6;
    doc.text(`Landmark: ${addressDetails.landmark || "-"}`, 17, y);
    y += 6;
    doc.text(`Phone: ${addressDetails.recipientPhoneNumber || "-"}`, 17, y);

    y += 15;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.text("Thank you for shopping with Grokart!", pageWidth / 2, y, {
      align: "center",
    });

    doc.save(`Invoice-${order._id}.pdf`);
  };

  if (loadingFees) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading invoice details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Order Invoice</h1>
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Payment Method:</strong> {order.paymentMethod}
        </p>
        <p>
          <strong>Payment Status:</strong> {order.paymentStatus}
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-2">Items Ordered</h2>
        <ul className="text-sm space-y-1">
          {items.map((item, idx) => (
            <li key={idx}>
              {item.name} (x{item.quantity}) - ₹
              {Number(item.price * item.quantity).toFixed(2)}
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-1 text-sm">
          <p>
            <strong>Items Total:</strong> ₹{Number(itemsTotalNum).toFixed(2)}
          </p>
          <p>
            <strong>Delivery Fee:</strong> ₹{Number(deliveryFee).toFixed(2)}
          </p>
          <p>
            <strong>Handling Fee:</strong> ₹{Number(handlingFee).toFixed(2)}
          </p>
          {lateNightFee > 0 && (
            <p>
              <strong>Late Night Fee:</strong> ₹{Number(lateNightFee).toFixed(2)}
            </p>
          )}
          {surgeFee > 0 && (
            <p>
              <strong>Surge Fee:</strong> ₹{Number(surgeFee).toFixed(2)}
            </p>
          )}
          <p className="font-bold">
            <strong>Total:</strong> ₹{Number(totalCalculated).toFixed(2)}
          </p>
        </div>

        <h2 className="text-lg font-semibold mt-6 mb-2">Delivery Details</h2>
        <div className="text-sm space-y-1">
          <p>{address}</p>
          <p>House: {addressDetails?.houseNumber || "-"}</p>
          <p>Building: {addressDetails?.building || "-"}</p>
          <p>Floor: {addressDetails?.floor || "-"}</p>
          <p>Landmark: {addressDetails?.landmark || "-"}</p>
          <p>Phone: {addressDetails?.recipientPhoneNumber || "-"}</p>
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
