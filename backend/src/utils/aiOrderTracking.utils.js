// utils/aiOrderTracking.utils.js
import { Order } from "../models/order.models.js";

// Simple extractor: looks for "#<id>" or just 24-char ObjectId
export function extractOrderId(message) {
  const regex = /#?([a-f\d]{24})/i; // matches ObjectId with or without #
  const match = message.match(regex);
  return match ? match[1] : null;
}

export async function handleOrderTracking(message) {
  const orderId = extractOrderId(message);
  if (!orderId) {
    return "I couldn’t find an order ID in your message. Please provide a valid order ID (e.g., #68a230752fdaabaa94a7bf31).";
  }

  const order = await Order.findById(orderId)
    .populate("customerId", "name email")
    .populate("assignedTo", "name phone");

  if (!order) {
    return `No order found with ID ${orderId}.`;
  }

  // Build human-friendly response
  let response = `📦 Order #${order._id}`;
  response += `Status: ${order.status}`;
  response += `Payment: ${order.paymentStatus}`;
  response += `Total: ${order.totalAmount} ${order.currency}`;

  if (order.assignedTo) {
    response += `Assigned to: ${order.assignedTo.name} (${order.assignedTo.phone})\n`;
  }

  return response;
}
