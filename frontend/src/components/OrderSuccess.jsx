import { useContext, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { CartContext } from "../context/Cart";

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useContext(CartContext);
  const order = state?.order;

  // Safely extract values from order
  const cartItems = order?.cartItems || [];
  const totalAmount = Number(order?.totalAmount) || 0;
  const discountAmount = Number(order?.discountAmount) || 0;

  useEffect(() => {
    if (!order) {
      navigate("/");
    } else {
      clearCart();
    }
  }, [order, navigate, clearCart]);

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircleIcon className="h-16 w-16 text-green-600 mx-auto" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Order Placed Successfully!
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Your order ID: {order._id}
          </p>
          <p className="mt-2 text-gray-600">
            A confirmation email has been sent to {order.email}
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          {/* Order Items */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2"
              >
                <div className="flex items-center">
                  <img
                    src={item.product?.image || "/placeholder-product.jpg"}
                    alt={item.product?.name || "Product image"}
                    className="h-16 w-16 object-cover rounded"
                  />
                  <div className="ml-4">
                    <h3 className="font-medium">
                      {item.product?.name || "Unnamed Product"}
                    </h3>
                    <p className="text-gray-600">
                      Quantity: {item.quantity || 1}
                    </p>
                  </div>
                </div>
                <p className="font-medium">₹{(item.price || 0).toFixed(2)}</p>
              </div>
            ))}
          </div>

          {/* Order Totals */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-₹{discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total:</span>
              <span>₹{(totalAmount - discountAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-900">Shipping Address</h3>
              <p className="text-gray-600">
                {order.address?.street}
                <br />
                {order.address?.city}, {order.address?.state}
                <br />
                {order.address?.pincode}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Estimated Delivery</h3>
              <p className="text-gray-600">
                {new Date(
                  Date.now() + 3 * 24 * 60 * 60 * 1000
                ).toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/orders"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            View Order History
          </Link>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;