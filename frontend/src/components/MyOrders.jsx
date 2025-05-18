import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          "https://grokart-2.onrender.com/api/v1/order/my-orders",
          { withCredentials: true }
        );
        setOrders(data?.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error(
          err.response?.data?.message || "Failed to load your orders 🫤"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-6 text-lg font-medium">
        Loading your orders…
      </p>
    );

  if (!orders.length)
    return (
      <p className="text-center mt-6 text-lg font-medium">
        You have no past orders yet.
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">My Orders</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-300 rounded-lg p-6 shadow-sm"
          >
            <p className="text-sm text-gray-500 mb-2">
              Order ID: {order._id}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Payment&nbsp;Method:</strong>{" "}
                {order.paymentMethod?.toUpperCase() || "N/A"}
              </p>
              <p>
                <strong>Payment&nbsp;Status:</strong> {order.paymentStatus}
              </p>
              <p>
                <strong>COD&nbsp;Charge:</strong> ₹{order.codCharge ?? 0}
              </p>
              <p>
                <strong>Total&nbsp;Amount:</strong> ₹{order.totalAmount}
              </p>
              <p>
                <strong>Items:</strong> {order.items?.length ?? 0}
              </p>
              <p>
                <strong>Address:</strong> {order.address}
              </p>
              <p>
                <strong>Placed&nbsp;On:</strong>{" "}
                {order.createdAt &&
                  new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
