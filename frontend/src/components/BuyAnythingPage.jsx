import React, { useState, useContext } from "react";
import { CartContext } from "../context/Cart";
import toast from "react-hot-toast";
import Navbar from "./Navbar";
import axios from "axios";

function BuyAnythingPage() {
  const { addToCart } = useContext(CartContext);
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async () => {
    if (!itemName.trim()) {
      toast.error("Please enter an item name");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    try {
      setLoading(true);

      // Build request body
      const body = {
        customerId: user._id,
        itemName,
        description,
        image: "", // Handle file uploads later
        notes: "",
        price: 0,
        phone,
      };

      const { data } = await axios.post(
        "https://grokart-2.onrender.com/api/v1/wishlist/create-wishList-order",
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Add temporary product to cart
      const customProduct = {
        _id: data.data._id,
        name: data.data.itemName,
        description: data.data.description,
        price: data.data.price,
        image: data.data.image || "/placeholder.png",
        stock: 1,
        isCustom: true,
      };

      addToCart(customProduct, 1);

      toast.success("Custom request submitted!");
      setSubmitted(true);

      // Reset form
      setItemName("");
      setDescription("");
      setPhone("");
      setImage(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-2xl mt-6 border border-gray-200">
        {!submitted ? (
          <>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              ✨ Buy Anything from Grokart
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Can’t find what you’re looking for? Enter the details below and we’ll get it for you.
            </p>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Item name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-400 outline-none"
              />

              <textarea
                placeholder="Description (brand, size, etc.)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-400 outline-none"
              />

              <input
                type="text"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-pink-400 outline-none"
              />

              <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                className="w-full text-gray-600"
              />

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg text-lg font-medium shadow-md hover:from-pink-600 hover:to-red-600 transition disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Add to Cart"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <svg
                className="w-16 h-16 text-green-500"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2l4 -4m6 2a9 9 0 11-18 0a9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Request Submitted Successfully 🎉
            </h3>
            <p className="text-gray-600">
              We'll will try our best to arrange your requested product and will soon contact you to confirm your order.
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default BuyAnythingPage;
