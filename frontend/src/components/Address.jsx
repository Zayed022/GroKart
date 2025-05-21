// src/pages/AddressDetails.jsx

import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/Cart";

const AddressDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { address } = location.state || { address: "No address provided" };
  const { cartItems, getCartTotal } = useContext(CartContext);

  const [addressDetails, setAddressDetails] = useState({
    houseNumber: "",
    floor: "",
    building: "",
    landmark: "",
    recipientPhoneNumber: "",
  });

  const handleChange = (e) => {
    setAddressDetails({
      ...addressDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cartItems = location.state?.cartItems || [];

    navigate("/checkout", {
      state: {
        cartItems,
        address,
        addressDetails: {
          ...addressDetails,
          city: "Bhiwandi",
          state: "Maharashtra",
          pincode: "421302",
        },
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-8">
      
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-2xl space-y-6">
        {/* Displaying current address */}
        <div className="bg-gray-100 p-4 rounded-xl shadow-inner text-sm text-gray-700 space-y-1 border">
          <h3 className="text-base font-semibold text-gray-800 mb-1">Current Address:</h3>
          <p>{address}</p>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">Add Address Details</h2>

        {/* Info Card */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded-lg">
          <p className="text-sm md:text-base">
            <strong>A detailed address will help our Delivery Partner reach your doorstep easily.</strong> 
          </p>
        </div>

        

        {/* Address Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">House Number</label>
            <input
              type="text"
              name="houseNumber"
              value={addressDetails.houseNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Floor</label>
            <input
              type="text"
              name="floor"
              value={addressDetails.floor}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Building Name</label>
            <input
              type="text"
              name="building"
              value={addressDetails.building}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Landmark</label>
            <input
              type="text"
              name="landmark"
              value={addressDetails.landmark}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Recipient Phone Number</label>
            <input
              type="tel"
              name="recipientPhoneNumber"
              value={addressDetails.recipientPhoneNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-red-500 text-white font-medium py-3 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Proceed to Checkout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressDetails;
