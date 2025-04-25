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
    buildingName: "",
    landmark: "",
    recepientPhoneNumber: "",
  });

  const handleChange = (e) => {
    setAddressDetails({
      ...addressDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Retrieve cart data from location.state or fallback to an empty array
    const cartItems = location.state?.cartItems || [];

    navigate("/checkout", {
      state: {
        cartItems,
        address,
        
         // Pass existing cart items
        addressDetails: {
          houseNumber: addressDetails.houseNumber,
          floor: addressDetails.floor,
          building: addressDetails.building,
          landmark: addressDetails.landmark,
          recepientPhoneNumber: addressDetails.recepientPhoneNumber,
          city: "Bhiwandi",
          state: "Maharashtra",
          pincode: "421302",
        },
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Add Address Details</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["houseNumber", "floor", "building", "landmark", "recepient Phone Number"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-semibold mb-1">
                {field === "houseNumber"
                  ? "House Number"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type="text"
                name={field}
                value={addressDetails[field]}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          ))}

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
