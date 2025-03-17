// src/pages/AddressDetails.jsx

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AddressDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [addressDetails, setAddressDetails] = useState({
    houseNumber: "",
    floor: "",
    buildingName: "",
    landmark: "",
  });

  const handleChange = (e) => {
    setAddressDetails({
      ...addressDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/checkout", {
      state: {
        ...location.state,
        addressDetails,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Add Address Details</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              House Number
            </label>
            <input
              type="text"
              name="houseNumber"
              value={addressDetails.houseNumber}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Floor</label>
            <input
              type="text"
              name="floor"
              value={addressDetails.floor}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Building Name
            </label>
            <input
              type="text"
              name="buildingName"
              value={addressDetails.buildingName}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Landmark</label>
            <input
              type="text"
              name="landmark"
              value={addressDetails.landmark}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
          >
            Proceed to Checkout
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressDetails;
