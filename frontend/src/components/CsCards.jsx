import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CsCards() {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [storeOpen, setStoreOpen] = useState(true);

  // Check store open hours: 8:00 AM to 1:30 AM (next day)
  const checkStoreOpen = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // Store open from 8:00 (480 mins) to 1:30 AM (next day, 90 mins)
    const isOpen = (totalMinutes >= 480 || totalMinutes <= 90);
    setStoreOpen(isOpen);
  };

  useEffect(() => {
    checkStoreOpen(); // Initial check
    const interval = setInterval(checkStoreOpen, 60 * 1000); // Re-check every 1 min
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://grokart-2.onrender.com/api/v1/category/get-all-categories');
        const data = await response.json();

        const groupedCategories = data.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = [];
          }
          acc[item.category].push(item);
          return acc;
        }, {});

        setCategories(groupedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1>Loading Categories ...</h1>
        {/* shimmer */}
        <div className="flex w-96 flex-col gap-6 justify-center p-6 shadow-lg rounded-2xl bg-white">
          <div className="relative overflow-hidden bg-gray-200 rounded-lg h-48 w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-[length:200%_100%] animate-shimmer" />
          </div>
          <div className="relative overflow-hidden bg-gray-200 rounded h-6 w-40">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-[length:200%_100%] animate-shimmer" />
          </div>
          <div className="relative overflow-hidden bg-gray-200 rounded h-4 w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-[length:200%_100%] animate-shimmer" />
          </div>
          <div className="relative overflow-hidden bg-gray-200 rounded h-4 w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-[length:200%_100%] animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-semibold text-center">Shop by Category</h2>
      <div className="p-6">
        {Object.entries(categories).map(([categoryName, subcategories]) => (
          <div key={categoryName} className="mb-8">
            <h2 className="text-3xl font-bold mb-4">{categoryName}</h2>
            <div className="flex gap-8 overflow-x-auto scrollbar-hide">
              {subcategories.map((subcategory) => {
                const CardContent = (
                  <div className="relative w-44 flex-shrink-0 text-center cursor-pointer">
                    <img
                      src={subcategory.image || "https://via.placeholder.com/200"}
                      alt={subcategory.subcategory}
                      className={`w-44 h-44 object-contain rounded-2xl shadow-lg bg-white transition-transform transform hover:scale-105 ${
                        !storeOpen && "opacity-50 pointer-events-none"
                      }`}
                    />
                    {!storeOpen && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-2xl">
                        <p className="text-white font-bold text-lg">Not Available</p>
                      </div>
                    )}
                    <p className="mt-3 text-lg font-semibold">{subcategory.subcategory}</p>
                  </div>
                );

                return storeOpen ? (
                  <Link
                    key={subcategory._id}
                    to={`/subCategory/${encodeURIComponent(subcategory.subcategory)}`}
                  >
                    {CardContent}
                  </Link>
                ) : (
                  <div key={subcategory._id}>{CardContent}</div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default CsCards;
