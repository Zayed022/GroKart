import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/Cart";
import { FaArrowLeft } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Link, useNavigate } from "react-router-dom";

const CartDisplay = ({ onClose }) => {
  const { cartItems, updateCartItemQuantity, removeFromCart, getCartTotal } = useContext(CartContext);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [confirmedLocation, setConfirmedLocation] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setTotalPrice(getCartTotal());
  }, [cartItems, getCartTotal]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setShowMap(true);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to fetch location. Please allow location access.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const getAddressFromLatLng = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_API_KEY}`
      );
      const data = await response.json();
      if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return "Address not found";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Address not found";
    }
  };

  const handleConfirmLocation = async () => {
    if (userLocation) {
      const address = await getAddressFromLatLng(userLocation.lat, userLocation.lng);
      setConfirmedLocation(address);
      alert(`Location Confirmed: ${address}`);
      setShowMap(false);
      navigate("/address", {
        state: {
          address,
          location: userLocation,
          cartItems,
          totalPrice: getCartTotal(),
        },
      });
    } else {
      alert("Please select a valid location first.");
    }
  };

  return (
    <div className="fixed right-0 top-0 w-96 h-full bg-white shadow-lg z-50 p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <Link to="/">
          <FaArrowLeft className="cursor-pointer text-xl text-gray-600 hover:text-black" onClick={onClose} />
        </Link>
        <h2 className="text-lg font-semibold">Your Cart</h2>
        <IoMdClose className="cursor-pointer text-xl text-gray-600 hover:text-black" onClick={onClose} />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Shopping Cart</h2>
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item._id} className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <img className="h-14 w-14 object-cover rounded-md" src={item.image} alt={item.name} />
                <div>
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-gray-600">₹{item.price} per unit</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="bg-gray-300 px-2 py-1 rounded text-black hover:bg-gray-400"
                  onClick={() => removeFromCart(item)}
                >
                  -
                </button>
                <span className="text-lg font-semibold">{item.quantity}</span>
                <button
                  className="bg-gray-300 px-2 py-1 rounded text-black hover:bg-gray-400"
                  onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">Cart is empty</p>
        )}
      </div>

      <h3 className="text-lg font-semibold text-right mt-4">Total: ₹{totalPrice}</h3>

      <button
        className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition duration-200 mt-4"
        onClick={getUserLocation}
      >
        Add Address to Proceed
      </button>

      {showMap && isLoaded && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-2">Confirm Your Location</h3>
            <div className="w-full h-64">
              <GoogleMap center={userLocation} zoom={15} mapContainerStyle={{ width: "100%", height: "100%" }}>
                <Marker position={userLocation} draggable={true} />
              </GoogleMap>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setShowMap(false)}>
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleConfirmLocation}
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartDisplay;
