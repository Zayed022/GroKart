import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ListAltIcon from "@mui/icons-material/ListAlt";

import { CartContext } from "../context/Cart";
import DynamicSearchButton from "./DynamicSearchButton";

function Navbar() {
  const { getTotalQuantity } = useContext(CartContext);
  const totalQuantity = getTotalQuantity();

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

        {/* Search Styled Button */}
        <DynamicSearchButton/>

        {/* Cart + Login */}
        <div className="flex items-center gap-6">
          <Link
            to="/cart"
            aria-label="Go to cart"
            className="relative hover:scale-105 transition-transform duration-200"
          >
            <ShoppingCartIcon className="w-7 h-7 text-gray-800" />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
                {totalQuantity}
              </span>
            )}
          </Link>

          <Link
            to="/order-history"
            className="hover:scale-105 transition-transform duration-200"
            aria-label="View past orders"
          >
            <ListAltIcon className="w-7 h-7 text-gray-800" />
          </Link>

          <Link
            to="/login"
            className="hover:scale-105 transition-transform duration-200"
          >
            <AccountCircleIcon className="w-7 h-7 text-gray-800" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
