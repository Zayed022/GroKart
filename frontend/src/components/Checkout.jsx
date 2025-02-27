import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { CartContext } from "../context/Cart";

const Checkout = () => {
  const location = useLocation();
  const { address } = location.state || { address: "No address provided" };
  const { cartItems, getCartTotal } = useContext(CartContext);

  useEffect(() => {
    console.log("Checkout Page State:", location.state);
  }, [location.state]);

  const navigate = useNavigate();

  const handleProceedToPayment = () => {
    navigate("/payment", {
      state: { cartItems, totalAmount: getCartTotal(), address },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Checkout
        </h2>

        {/* Address Section */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700">
            Shipping Address
          </h3>
          <p className="text-gray-600 mt-1">
            {address || "No address provided"}
          </p>
        </div>

        {/* Order Summary */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700">Order Summary</h3>
          {cartItems.length > 0 ? (
            <ul className="mt-2 space-y-4">
              {cartItems.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
                >
                  <div>
                    <p className="text-gray-800 font-medium">{item.name}</p>
                    <p className="text-gray-500">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-gray-900 font-semibold">
                    ₹{item.price * item.quantity}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mt-2">No items in cart</p>
          )}
        </div>

        {/* Total Price */}
        <div className="flex justify-between items-center border-t pt-4">
          <span className="text-lg font-semibold text-gray-700">
            Total Price:
          </span>
          <span className="text-xl font-bold text-green-600">
            ₹{getCartTotal()}
          </span>
        </div>

        {/* Checkout Button */}
        
          <button  onClick={handleProceedToPayment} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg mt-6 shadow-md transition-all">
            Proceed to Payment
          </button>
        
      </div>
    </div>
  );
};

export default Checkout;
