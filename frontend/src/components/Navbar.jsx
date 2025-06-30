import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  UserCircle,
  ReceiptText,
  ChevronDown,
} from "lucide-react";

import { CartContext } from "../context/Cart";
import { useAuth } from "../context/AuthContext"; 
import DynamicSearchButton from "./DynamicSearchButton";

import { MapPin } from "lucide-react";
import { useLocation as useGlobalLocation } from "../context/LocationContext";

function Navbar() {
  const { location } = useGlobalLocation();
  const { getTotalQuantity, getCartTotal } = useContext(CartContext);
  const totalQuantity = getTotalQuantity();
   const totalPrice = getCartTotal();
   const [showDropdown, setShowDropdown] = useState(false);



  const { user, token } = useAuth(); //  Assume these are available in your AuthContext

  return (
    <nav className="bg-white/30 backdrop-blur-md shadow-md px-6 py-5 sticky top-0 z-50 border-b border-gray-200">
  <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
    
    {/* LEFT: Logo + Location */}
    <div className="flex items-center gap-4 flex-shrink-0">
      <Link to="/" className="hover:scale-105 transition-transform duration-200">
        <img
          src="/Grokart.png"
          alt="GroKart Logo"
          className="h-10 w-auto object-contain"
        />
      </Link>

      <Link to="/location-fetch">
        <button className="flex items-center ml-4 gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-800 shadow-sm transition-all">
          <MapPin className="w-4 h-4 text-red-500" />
          {location?.address ? (
            <span className="truncate max-w-[150px]">{location.address}</span>
          ) : (
            <span>Select Location</span>
          )}
        </button>
      </Link>
    </div>

    {/* CENTER: Search */}
    <div className="flex-1 flex justify-center px-4">
      <div className="max-w-md w-full">
        <DynamicSearchButton />
      </div>
    </div>

    {/* RIGHT: Cart, Orders, Profile */}
    <div className="flex items-center gap-4 md:gap-6 flex-shrink-0 ">
      {/* Green Cart Button */}
     {totalQuantity > 0 ? (
  <Link
    to="/cart"
    className="bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow hover:bg-green-700 transition"
  >
    <ShoppingCart className="w-5 h-5 text-white" />
    <div className="text-sm font-semibold text-left leading-tight">
      {totalQuantity} {totalQuantity === 1 ? "item" : "items"}
      <br />
      ₹{totalPrice}
    </div>
  </Link>
) : (
  <Link
    to="/cart"
    className="bg-gray-200 text-gray-500 px-4 py-3 rounded-xl flex items-center gap-2 shadow-inner hover:bg-gray-300 transition"
  >
    <ShoppingCart className="w-5 h-5 text-gray-500" />
    <span className="text-sm font-semibold">My Cart</span>
  </Link>
)}


      

      {/* Profile / Login */}
      <div className="relative">
  {token ? (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-1 text-gray-800 font-medium hover:text-black"
      >
        Account <ChevronDown className="w-4 h-4" />
      </button>

      {showDropdown && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
          onMouseLeave={() => setShowDropdown(false)}
        >
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-semibold text-gray-800">My Account</p>
            <p className="text-xs text-gray-500">{user?.phone || "Your Phone"}</p>
          </div>
          <ul className="text-sm text-gray-700">
            <li>
              <Link to="/order-history" className="block px-4 py-2 hover:bg-gray-100">
                My Orders
              </Link>
            </li>
            <li>
              <Link to="/location-fetch" className="block px-4 py-2 hover:bg-gray-100">
                Saved Addresses
              </Link>
            </li>
            <li>
              <Link to="/gifts" className="block px-4 py-2 hover:bg-gray-100">
                E-Gift Cards
              </Link>
            </li>
            <li>
              <Link to="/faqs" className="block px-4 py-2 hover:bg-gray-100">
                FAQ's
              </Link>
            </li>
            <li>
              <Link to="/account-privacy" className="block px-4 py-2 hover:bg-gray-100">
                Account Privacy
              </Link>
            </li>
            <li>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                onClick={() => {
                  // Your logout logic
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
              >
                Log Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  ) : (
    <Link
      to="/login"
      className="px-3 py-1.5 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
    >
      Please Login
    </Link>
  )}
</div>
    </div>
  </div>
</nav>


  );
}

export default Navbar;
