import React, { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/Cart";
import { FaArrowLeft } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Link, useNavigate } from "react-router-dom";

const CartDisplay = ({ onClose }) => {
  const { cartItems, updateCartItemQuantity, removeFromCart, getCartTotal } =
    useContext(CartContext);
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
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
          import.meta.env.VITE_GOOGLE_API_KEY
        }`
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
      const address = await getAddressFromLatLng(
        userLocation.lat,
        userLocation.lng
      );
      if (!address.toLowerCase().includes("bhiwandi")) {
        alert("Sorry, we are currently not available in your area.");
        setShowMap(false);
        return;
      }
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
    <>
      <div className="fixed right-0 top-0 w-96 h-full bg-[#f2f2f2] shadow-2xl z-50 p-6 overflow-y-auto rounded-l-3xl">
        <div className="flex items-center justify-between mb-6">
          <Link to="/">
            <FaArrowLeft
              className="cursor-pointer text-xl text-gray-500 hover:text-gray-800"
              onClick={onClose}
            />
          </Link>
          <h2 className="text-xl font-semibold text-gray-800">Your Cart</h2>
          <IoMdClose
            className="cursor-pointer text-xl text-gray-500 hover:text-gray-800"
            onClick={onClose}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Shopping Cart</h2>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4">
                  <img
                    className="h-14 w-14 object-cover rounded-lg border"
                    src={item.image}
                    alt={item.name}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      ₹{item.price} per unit
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-lg font-bold"
                    onClick={() => removeFromCart(item)}
                  >
                    -
                  </button>
                  <span className="text-base font-medium">{item.quantity}</span>
                  <button
                    className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full text-lg font-bold"
                    onClick={() =>
                      updateCartItemQuantity(item._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 text-sm">Cart is empty</p>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-gray-600 mb-1">
            Missed Something?
          </p>
          <Link
            to="/category"
            className="inline-block text-orange-500 font-semibold hover:underline"
            onClick={onClose}
          >
            Add more items
          </Link>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold text-yellow-800 bg-yellow-100 border border-yellow-200 px-4 py-3 rounded-xl shadow-inner">
            Review your order to avoid cancellation.
          </p>
          <div className="bg-white border border-gray-200 text-sm text-gray-700 mt-3 p-4 rounded-xl shadow">
            <p className="mb-2 font-medium">
              NOTE: Orders cannot be cancelled and are non-refundable once
              packed for delivery.
            </p>
            <Link
              to="/cancellation"
              className="text-blue-600 hover:underline text-sm"
            >
              Read Cancellation Policy
            </Link>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-right mt-6 text-gray-800">
          Total: ₹{totalPrice}
        </h3>

        <button
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 mt-6 shadow-md"
          onClick={() => {
            if (cartItems.length === 0) {
              alert("Your cart is empty. Add items to proceed.");
              return;
            }
            getUserLocation();
          }}
        >
          Add Address to Proceed
        </button>

        {showMap && isLoaded && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-11/12 max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Confirm Your Location
              </h3>
              <div className="w-full h-64 rounded-lg overflow-hidden border">
                <GoogleMap
                  center={userLocation}
                  zoom={15}
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                >
                  <Marker position={userLocation} draggable={true} />
                </GoogleMap>
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-sm font-medium"
                  onClick={() => setShowMap(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  onClick={handleConfirmLocation}
                >
                  Confirm Location
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDisplay;
