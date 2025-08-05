import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    // Simulate logout process
    setTimeout(() => {
      localStorage.clear(); // Or remove tokens if used
      setIsLoggingOut(false);
      navigate("/login"); // Redirect after logout
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-md text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Are you sure you want to log out?</h2>

            {isLoggingOut ? (
              <div className="flex justify-center items-center space-x-2 mt-6">
                <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-red-600"></div>
                <span className="text-red-600 font-medium">Logging out...</span>
              </div>
            ) : (
              <div className="flex justify-center gap-4 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Log Out
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Logout;
