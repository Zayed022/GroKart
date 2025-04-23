import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOrderEmail = async (order) => {
  const mailOptions = {
    from: `"GroKart Orders" <${process.env.EMAIL}>`,
    to: process.env.EMAIL,
    subject: `New Order Received - ${order._id}`,
    html: `
      <h2>🛒 New Order Placed</h2>
      <p><strong>Customer ID:</strong> ${order.customerId}</p>
      <p><strong>Items:</strong><br/>${order.items.map(item => `${item.name} x ${item.quantity}`).join("<br/>")}</p>
      <p><strong>Total:</strong> ₹${order.totalAmount}</p>
      <p><strong>Payment Mode:</strong> ${order.paymentMethod}</p>
      <p><strong>Address:</strong><br/>${order.address}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
