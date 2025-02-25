import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/Cart"; // Import Cart Context
import { FaArrowLeft } from "react-icons/fa"; // Back arrow icon
import { IoMdClose } from "react-icons/io"; // Close button icon
import { Link } from "react-router-dom";

const CartDisplay = ({ onClose }) => {
  const { cartItems, updateCartItemQuantity, removeFromCart } = useContext(CartContext);
  const [totalPrice, setTotalPrice] = useState(0);

  // Function to calculate total price dynamically
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cartItems]);

  return (
    <div className="fixed right-0 top-0 w-96 h-full bg-white shadow-lg z-50 p-6 overflow-y-auto">
      {/* Header with Back and Close Buttons */}
      <div className="flex items-center justify-between mb-4">
        <FaArrowLeft className="cursor-pointer text-xl text-gray-600 hover:text-black" onClick={onClose} />
        <h2 className="text-lg font-semibold">Your Cart</h2>
        <IoMdClose className="cursor-pointer text-xl text-gray-600 hover:text-black" onClick={onClose} />
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Shopping Cart</h2>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item._id} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <img className="h-14 w-14 object-cover rounded-md" src={item.image} alt={item.name} />
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-gray-600">₹{item.price} per unit</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="bg-gray-300 px-2 py-1 rounded text-black hover:bg-gray-400"
                  onClick={() => removeFromCart(item)}

                >
                  -
                </button>
                <span className="text-lg font-semibold">{item.quantity}</span>
                <button
                  className="bg-gray-300 px-2 py-1 rounded text-black hover:bg-gray-400"
                  onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">Cart is empty</p>
        )}
      </div>

      {/* Total Price */}
      <h3 className="text-lg font-semibold text-right mt-4">Total: ₹{totalPrice}</h3>

      {/* "Add More Items" Button */}
      <Link to ="/all-products">
      <button className="w-full bg-gray-100 py-2 my-4 rounded-lg text-gray-700 font-medium hover:bg-gray-200">
        + Add More Items
      </button>
      </Link>

      {/* Membership Pass Section */}
      <div className="bg-purple-100 p-4 rounded-lg my-3">
        <p className="font-semibold">Save more with <span className="text-purple-600">Pass</span></p>
        <p className="text-sm text-gray-600">✔ Free delivery above ₹99</p>
        <button className="bg-purple-500 text-white w-full py-2 mt-2 rounded-lg hover:bg-purple-600">
          Added for 1 Month at ₹1
        </button>
      </div>

      {/* Apply Free Cash Checkbox */}
      <div className="flex items-center my-3">
        <input type="checkbox" className="mr-2 cursor-pointer" />
        <p className="text-gray-700">Apply ₹50 Free Cash</p>
      </div>

      {/* Proceed Button */}
      <button className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition duration-200">
        Add Address to Proceed
      </button>
    </div>
  );
};

export default CartDisplay;
