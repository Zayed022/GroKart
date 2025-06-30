import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import clsx from "clsx";
import { useAuth } from "../context/AuthContext"; // 👈
import { useNavigate } from "react-router-dom";


import {
  ChevronDown,
  FileText,
  CheckCircle2,
  CircleDot,
} from "lucide-react";
import Navbar from "./Navbar";

const statusOrder = [
  "Placed", "Pending", "Assigned", "Out for Delivery", "Delivered", "Cancelled",
];
const statusColors = {
  Placed: "bg-blue-500",
  Pending: "bg-orange-500",
  Assigned: "bg-purple-500",
  "Out for Delivery": "bg-amber-500",
  Delivered: "bg-green-500",
  Cancelled: "bg-red-500",
};

export default function MyOrders() {
  const { token, loading: authLoading } = useAuth(); // 👈
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    if (!token || authLoading) return;

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          "https://grokart-2.onrender.com/api/v1/order/my-orders",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setOrders(data?.data ?? []);
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Couldn’t load your orders 🫤");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, authLoading]);

    if (authLoading) {
    return (
     
      <p className="py-20 text-center text-lg font-medium animate-pulse">
        Checking authentication…
      </p>
    );
  }

  if (!token) {
    return (
      <p className="py-20 text-center text-lg font-medium text-red-500">
        Please login to view your orders.
      </p>
    );
  }

  if (loading) {
    return (
      <p className="py-20 text-center text-lg font-medium animate-pulse">
        Loading your orders…
      </p>
    );
  }


  if (!orders.length)
    return (
      <p className="py-20 text-center text-lg font-medium">
        You haven’t placed any orders yet.
      </p>
    );

  return (
    <>
    <Navbar/>
    <section className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/60 py-12">
      <h1 className="mb-12 text-center text-4xl font-extrabold text-slate-800">
        My Orders
      </h1>
      <div className="relative mx-auto max-w-4xl before:absolute before:left-4 before:top-0 before:h-full before:w-px before:bg-slate-300/60 sm:before:left-[77px]">
        {orders.map((order) => {
          const isOpen = open === order._id;
          const dotColor = statusColors[order.status] || "bg-slate-400";
          return (
            <div key={order._id} className="relative pl-14 sm:pl-[110px]">
              <article className="mb-10 rounded-2xl border border-slate-200/70 bg-white/60 backdrop-blur-md shadow-sm transition hover:shadow-md">
                <div className="flex flex-wrap items-start justify-between gap-3 px-6 pt-5">
                  <div className="space-y-0.5">
                    <h3 className="font-semibold tracking-wide text-slate-700">
                      Order #{order._id}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Placed {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className={clsx("whitespace-nowrap rounded-full px-3 py-0.5 text-xs font-semibold capitalize text-white", dotColor)}>
                    {order.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 px-6 py-5 text-sm text-slate-600 sm:grid-cols-3">
                  <p><span className="font-medium">Total:</span> ₹{order.totalAmount.toLocaleString()}</p>
                  <p><span className="font-medium">Payment:</span> {order.paymentMethod?.toUpperCase() ?? "N/A"}</p>
                  <p><span className="font-medium">Items:</span> {order.items?.length ?? 0}</p>
                </div>
                <div className={clsx("overflow-hidden transition-[max-height] duration-300", isOpen ? "max-h-96" : "max-h-0")}>
                  <ul className="divide-y divide-slate-200 px-6 pb-4">
                    {order.items.map((it, i) => (
                      <li key={i} className="py-3 text-sm text-slate-700">
                        <div className="flex justify-between">
                          <span className="font-medium">{it.name}</span>
                          <span>₹{(it.price * it.quantity).toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Qty {it.quantity} · {it.description ?? ""}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 text-sm">
                  <button onClick={() => setOpen(isOpen ? null : order._id)} className="flex items-center gap-1 text-slate-600 hover:text-slate-800">
                    {isOpen ? <CheckCircle2 size={16} /> : <CircleDot size={16} />}
                    {isOpen ? "Hide items" : "View items"}
                    <ChevronDown size={18} className={clsx("transition-transform", isOpen && "rotate-180")} />
                  </button>
                 
                </div>
              </article>
            </div>
          );
        })}
      </div>
    </section>
    </>
  );
}
