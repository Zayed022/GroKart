import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, MapPin, Clock4, Package, XCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; // 🔒 Custom auth hook
import { Link } from "react-router-dom";

const statusColorMap = {
  Pending: "text-orange-500",
  Placed: "text-blue-500",
  Assigned: "text-purple-500",
  "Out for Delivery": "text-yellow-600",
  Delivered: "text-green-600",
  Cancelled: "text-red-600",
};

const TrackOrder = () => {
  const { token, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || authLoading) return;

    const fetchRecentOrders = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:2020/api/v1/order/recent-orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(data.data);
      } catch (error) {
        console.error("❌ Failed to fetch recent orders:", error);
        toast.error("Failed to fetch recent orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentOrders();
  }, [token, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        <Loader2 className="animate-spin mr-2" />
        Fetching your orders...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-2">
        <XCircle className="text-red-400 w-10 h-10" />
        <p className="text-slate-500 font-medium">
          No recent orders placed in the last 30 minutes.
        </p>
        <Link to="/" className="text-indigo-600 hover:underline mt-2">
          Go back to shopping →
        </Link>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Track Your Order
      </h2>

      <div className="max-w-3xl mx-auto space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-md rounded-xl p-6 space-y-4 border border-slate-100"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-lg text-gray-700">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h3>
                <p className="text-sm text-gray-500">
                  Placed at{" "}
                  {new Date(order.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusColorMap[order.status] || "text-slate-500"}`}
              >
                {order.status}
              </span>
            </div>

            <div className="text-sm text-gray-700 space-y-1">
              <p className="flex items-center gap-2">
                <Package className="w-4 h-4 text-slate-500" />
                {order.items?.length} item(s) · ₹{order.totalAmount}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                {order.address}
              </p>
              <p className="flex items-center gap-2">
                <Clock4 className="w-4 h-4 text-slate-500" />
                Expected delivery within 15 minutes
              </p>
            </div>

            <Link
              to={`/invoice/${order._id}`}
              className="inline-block mt-4 text-indigo-600 hover:underline text-sm"
            >
              View Invoice →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrackOrder;
