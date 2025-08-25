import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Hero() {
  return (
    <section className="bg-gradient-to-br from-green-50 to-white min-h-[85vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Groceries delivered <span className="text-green-600">in minutes</span>
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Fresh groceries from your local stores delivered fast and fresh to your doorstep. Skip the lines and shop smart with Grokart!
        </p>
        <Link to="/category">
          <button className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl text-lg transition duration-200 shadow-lg">
            Start Shopping
          </button>
        </Link>
      </motion.div>
    </section>
  );
}

export default Hero;
