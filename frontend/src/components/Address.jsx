import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/Cart";

const AddressDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { address } = location.state || { address: "No address provided" };
  const { cartItems, getCartTotal } = useContext(CartContext);

  // Load saved address from localStorage
  const savedAddress = JSON.parse(localStorage.getItem("savedAddressDetails")) || {
    houseNumber: "",
    floor: "",
    building: "",
    landmark: "",
    recipientPhoneNumber: "",
  };

  const [addressDetails, setAddressDetails] = useState(savedAddress);

  const handleChange = (e) => {
    setAddressDetails({
      ...addressDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cartItems = location.state?.cartItems || [];

    const fullAddressDetails = {
      ...addressDetails,
      city: "Bhiwandi",
      state: "Maharashtra",
      pincode: "421302",
    };

    // Save to localStorage for future visits
    localStorage.setItem("savedAddressDetails", JSON.stringify(addressDetails));

    navigate("/checkout", {
      state: {
        cartItems,
        address,
        addressDetails: fullAddressDetails,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-8">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-2xl space-y-6">
        <div className="bg-gray-100 p-4 rounded-xl shadow-inner text-sm text-gray-700 space-y-1 border">
          <h3 className="text-base font-semibold text-gray-800 mb-1">Current Address:</h3>
          <p>{address}</p>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center">Add Address Details</h2>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded-lg">
          <p className="text-sm md:text-base">
            <strong>A detailed address will help our Delivery Partner reach your doorstep easily.</strong>
           
          </p>
           <div>In case you dont know house number, enter NA.</div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["houseNumber", "floor", "building", "landmark", "recipientPhoneNumber"].map((field, index) => (
            <div key={field} className={field === "building" || field === "landmark" || field === "recipientPhoneNumber" ? "md:col-span-2" : ""}>
              <label className="block text-sm font-medium mb-1">
                {field === "houseNumber" && "House Number"}
                {field === "floor" && "Floor"}
                {field === "building" && "Building Name"}
                {field === "landmark" && "Landmark"}
                {field === "recipientPhoneNumber" && "Recipient Phone Number"}
              </label>
              <input
                type={field === "recipientPhoneNumber" ? "tel" : "text"}
                name={field}
                value={addressDetails[field]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
              />
            </div>
          ))}

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
