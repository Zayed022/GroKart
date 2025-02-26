import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const LocationModal = ({ userLocation, setShowMap, onConfirm }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-bold mb-2">Confirm Your Location</h3>
        <p className="text-sm text-gray-600 mb-4">Move the marker if needed and confirm.</p>

        <div className="w-full h-64">
          <GoogleMap
            center={userLocation}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
          >
            <Marker position={userLocation} draggable={true} />
          </GoogleMap>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setShowMap(false)}>
            Cancel
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={onConfirm}>
            Confirm Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
