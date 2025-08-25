import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DynamicSearchButton = () => {
  const searchTerms = ["Grapes", "Kurkure", "Apple Juice", "Milk", "Bread", "Paneer"];
  const [currentTermIndex, setCurrentTermIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTermIndex((prevIndex) => (prevIndex + 1) % searchTerms.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Link to="/all-products" className="w-full md:w-auto">
      <div className="relative group">
        <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
          <span className="text-sm">🔍</span>
          <span className="text-sm font-medium">
            Search for "{searchTerms[currentTermIndex]}"
          </span>
        </div>
      </div>
    </Link>
  );
};

export default DynamicSearchButton;
