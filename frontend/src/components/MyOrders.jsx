import React, { useContext, useRef } from "react";
import { OrderContext } from "../context/OrderContext";
import { CartContext } from "../context/Cart";
import { Link } from "react-router-dom";
import { FileText, ShoppingCart, RotateCcw, MapPin } from "lucide-react";
import Navbar from "./Navbar";
import { toast } from "react-hot-toast";
import AIChatbot from "./AIChatbot";   // ✅ Import chatbot

const MyOrders = () => {
  const { orders } = useContext(OrderContext);
  const { addMultipleToCart } = useContext(CartContext);
  const chatbotRef = useRef(); // ✅ ref for chatbot

  const handleReorder = (items) => {
    if (!items || items.length === 0) {
      toast.error("This order has no items to reorder.");
      return;
    }
    addMultipleToCart(items);
    toast.success("Items added to cart!");
  };

  const handleTrackOrder = (orderId) => {
    const message = `Where is my order #${orderId}?`;
    chatbotRef.current?.openWithMessage("123", message); // pass userId dynamically if available
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">📦 My Orders</h2>

        {orders.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg text-sm">
            You haven’t placed any orders yet.
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition bg-white"
              >
                <div className="p-5 space-y-5">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <p className="text-gray-700 font-semibold">
                        Order ID:{" "}
                        <span className="text-gray-900">{order._id}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Placed on:{" "}
                        {new Date(order.placedAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {order.paymentMethod.toUpperCase()}
                      </span>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          order.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.paymentStatus || "Pending"}
                      </span>
                      <Link
                        to={`/invoice/${order._id}`}
                        state={{
                          paymentDetails: { order },
                          address: order.address,
                          addressDetails: order.addressDetails,
                        }}
                        className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                      >
                        <FileText size={16} /> Invoice
                      </Link>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="text-sm text-gray-600">
                    <strong>Delivery Address:</strong> {order.address}
                  </div>

                  {/* Items List */}
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <p className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                      <ShoppingCart size={16} /> Items Ordered:
                    </p>
                    <ul className="space-y-2">
                      {order.items.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between items-start text-sm text-gray-700"
                        >
                          <div className="flex-1 pr-2">
                            <span className="font-medium text-gray-800">
                              {item.name}
                            </span>{" "}
                            × {item.quantity}
                            <p className="text-xs text-gray-500">
                              {item.description || "No description available"}
                            </p>
                          </div>
                          <div className="text-right text-gray-700 font-medium">
                            ₹{item.price * item.quantity}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t gap-3">
                    <div className="text-sm font-medium text-gray-600">
                      Total Paid:{" "}
                      <span className="text-green-700 font-bold text-lg">
                        ₹{order.totalAmount}
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReorder(order.items)}
                        className="flex items-center gap-1 px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-full hover:bg-orange-600 transition"
                      >
                        <RotateCcw size={16} />
                        Reorder
                      </button>
                      <button
                        onClick={() => handleTrackOrder(order._id)}
                        className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-full hover:bg-green-700 transition"
                      >
                        <MapPin size={16} />
                        Track Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Chatbot attached here */}
      <AIChatbot ref={chatbotRef} />
    </>
  );
};

export default MyOrders;
