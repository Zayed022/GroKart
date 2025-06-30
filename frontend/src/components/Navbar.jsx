import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  UserCircle,
  ReceiptText,
} from "lucide-react";

import { CartContext } from "../context/Cart";
import { useAuth } from "../context/AuthContext"; 
import DynamicSearchButton from "./DynamicSearchButton";

import { MapPin } from "lucide-react";
import { useLocation as useGlobalLocation } from "../context/LocationContext";

function Navbar() {
  const { location } = useGlobalLocation();
  const { getTotalQuantity } = useContext(CartContext);
  const totalQuantity = getTotalQuantity();


  const { user, token } = useAuth(); //  Assume these are available in your AuthContext

  return (
    <nav className="bg-white/30 backdrop-blur-md shadow-md px-6 py-3 sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center hover:scale-105 transition-transform duration-200"
        >
          <img
            src="/Grokart.png"
            alt="GroKart Logo"
            className="h-10 w-auto object-contain"
          />
        </Link>

        <div>
<Link to="/location-fetch">
  <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-800 shadow-sm transition-all">
    <MapPin className="w-4 h-4 text-red-500" />
    {location?.address ? (
      <span className="truncate max-w-[150px]">{location.address}</span>
    ) : (
      <span>Select Location</span>
    )}
  </button>
</Link>



        </div>

        {/* Search */}
        <DynamicSearchButton />

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Cart */}
          <Link
            to="/cart"
            aria-label="Go to cart"
            className="relative group p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ShoppingCart className="w-6 h-6 text-gray-800 group-hover:text-black" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {totalQuantity}
              </span>
            )}
          </Link>

          {/* Orders */}
          <Link
            to="/order-history"
            aria-label="View order history"
            className="p-2 rounded-full hover:bg-gray-100 transition group"
          >
            <ReceiptText className="w-6 h-6 text-gray-800 group-hover:text-black" />
          </Link>

          {/* Profile / Login */}
          {token ? (
            <Link
              to="/login"
              aria-label="Profile"
              className="p-2 rounded-full hover:bg-gray-100 transition group"
            >
              <UserCircle className="w-6 h-6 text-gray-800 group-hover:text-black" />
            </Link>
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
    </nav>
  );
}

export default Navbar;
