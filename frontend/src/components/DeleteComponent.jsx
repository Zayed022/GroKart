import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext"; // adjust path
import { useNavigate } from "react-router-dom";

const DeleteComponent = () => {
  const { token, logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      setLoading(true);

      const res = await axios.delete("https://grokart-2.onrender.com/api/v1/users/profile", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResponse({
        type: "success",
        message: res.data.message || "Account deleted successfully.",
       
      });

      setTimeout(() => {
        logout();
        navigate("/login"); // use context logout
      }, 2000);
    } catch (err) {
      setResponse({
        type: "error",
        message:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Something went wrong while deleting your account.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-xl rounded-xl p-6 mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Delete Account</h2>
      <p className="text-gray-600 mb-4">
        Once your account is deleted, all your data will be permanently removed. This action cannot be undone.
      </p>

      {response.message && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            response.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {response.message}
        </div>
      )}

      <button
        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-200"
        onClick={() => setShowConfirm(true)}
        disabled={loading}
      >
        {loading ? "Processing..." : "Delete My Account"}
      </button>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Are you sure?</h3>
              <p className="text-sm text-gray-600 mb-6">
                This action is irreversible. Do you really want to delete your account?
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DeleteComponent;
