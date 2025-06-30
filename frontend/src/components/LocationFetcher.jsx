import React, { useState, useEffect } from "react";
import { useLocation as useGlobalLocation } from "../context/LocationContext";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const LocationFetcher = () => {
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const { setConfirmedLocation } = useGlobalLocation();
  const navigate = useNavigate();
  const [savedAddresses, setSavedAddresses] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  });

  useEffect(() => {
    const stored = localStorage.getItem("savedAddresses");
    if (stored) {
      setSavedAddresses(JSON.parse(stored));
    }
  }, []);

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
      const address = await getAddressFromLatLng(userLocation.lat, userLocation.lng);
      if (!address.toLowerCase().includes("bhiwandi")) {
        alert("Sorry, we are currently not available in your area.");
        setShowMap(false);
        return;
      }

      // Save to context
      const newAddress = {
        address,
        lat: userLocation.lat,
        lng: userLocation.lng,
      };

      setConfirmedLocation(newAddress);
      alert(`Location Confirmed: ${address}`);
      setShowMap(false);

      // Save to localStorage
      const existing = JSON.parse(localStorage.getItem("savedAddresses")) || [];
      const updated = [newAddress, ...existing.filter(a => a.address !== newAddress.address)];
      localStorage.setItem("savedAddresses", JSON.stringify(updated));
      setSavedAddresses(updated);

      navigate("/");
    } else {
      alert("Please select a valid location first.");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="flex flex-col items-center justify-center min-h-screen px-4 space-y-8">
      {/* Main Card */}
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 w-full max-w-2xl text-center space-y-6">
        <div className="flex justify-center items-center gap-2 text-violet-600 font-semibold text-xl">
          <MapPin className="w-6 h-6" />
          <span>Confirm Your Delivery Location</span>
        </div>

        <p className="text-gray-600 text-xl">
          Click below to detect your current location. We’ll use this to conveniently deliver your order.
        </p>

        <button
          className="w-full bg-green-500 hover:bg-red-600 text-white py-4 rounded-xl font-semibold text-base transition-all duration-200 shadow-md"
          onClick={getUserLocation}
        >
          Detect My Location
        </button>
      </div>

      {/* Saved Addresses Section */}
      {savedAddresses.length > 0 && (
        <div className="w-full max-w-2xl space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Saved Addresses</h3>
          {savedAddresses.map((addr, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center border"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{addr.address}</p>
              </div>
              <button
                className="bg-green-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-600"
                onClick={() => {
                  setConfirmedLocation(addr);
                  alert(`Location Confirmed: ${addr.address}`);
                  navigate("/");
                }}
              >
                Deliver Here
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Map Modal */}
      {showMap && isLoaded && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-11/12 max-w-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-5 text-center">
              Pin Your Location
            </h2>

            <div className="w-full h-80 rounded-lg overflow-hidden border border-gray-200 mb-6">
              <GoogleMap
                center={userLocation}
                zoom={15}
                mapContainerStyle={{ width: "100%", height: "100%" }}
              >
                <Marker position={userLocation} draggable={true} />
              </GoogleMap>
            </div>

            <div className="flex justify-between">
              <button
                className="px-5 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold"
                onClick={() => setShowMap(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold"
                onClick={handleConfirmLocation}
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default LocationFetcher;
