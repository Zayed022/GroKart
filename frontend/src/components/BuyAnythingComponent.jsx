import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";

function BuyAnythingComponent() {
  return (
    <Link to="/buy-anything">
      <div className="relative group cursor-pointer">
        <div className="bg-white/70 backdrop-blur-md border border-pink-300/50 shadow-lg rounded-2xl p-6 text-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:border-pink-400">
          {/* Icon */}
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-400 to-pink-600 text-white shadow-md mb-3 group-hover:scale-110 transition">
            <ShoppingBag size={24} />
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-pink-600 group-hover:text-pink-700">
            ✨ Buy Anything from us
          </h3>

          {/* Subtitle */}
          <p className="text-sm text-gray-500 mt-1">
            Order items not listed in our store
          </p>

          {/* Glow on hover */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-200 to-pink-300 opacity-0 group-hover:opacity-20 blur-xl transition"></div>
        </div>
      </div>
    </Link>
  );
}

export default BuyAnythingComponent;
