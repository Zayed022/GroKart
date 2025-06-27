import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function CsCards() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storeOpen, setStoreOpen] = useState(true);

  // Check store open hours: 8:00 AM to 1:30 AM
  const checkStoreOpen = () => {
    const now = new Date();
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    setStoreOpen(totalMinutes >= 480 || totalMinutes <= 90);
  };

  useEffect(() => {
    checkStoreOpen();
    const interval = setInterval(checkStoreOpen, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://grokart-2.onrender.com/api/v1/category/get-all-categories');
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Memoize grouped categories
  const groupedCategories = useMemo(() => {
    return data.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  }, [data]);

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
        {Object.entries(groupedCategories).map(([categoryName, subcategories]) => (
          <div key={categoryName} className="mb-8">
            <h2 className="text-3xl font-bold mb-4">{categoryName}</h2>
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {subcategories.map((subcategory) => {
                const imageComponent = (
                  <div className="relative w-44 flex-shrink-0 text-center cursor-pointer">
                    <img
                      loading="lazy"
                      src={subcategory.image || "https://via.placeholder.com/200"}
                      alt={subcategory.subcategory}
                      className={`w-44 h-44 object-contain rounded-2xl shadow-md bg-white transition-transform transform hover:scale-105 ${
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
                    {imageComponent}
                  </Link>
                ) : (
                  <div key={subcategory._id}>{imageComponent}</div>
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
