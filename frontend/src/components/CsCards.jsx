import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

function CsCards() {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/v1/category/get-all-categories')

        const data = await response.json();

        // Group subcategories under their category
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

  if (loading) return <p className="text-center text-gray-500">Loading categories...</p>;

  return (
    <>
    <h2 className="text-2xl font-semibold text-center">Shop by Category</h2>
    <div className="p-6">
      {Object.entries(categories).map(([categoryName, subcategories]) => (
        <div key={categoryName} className="mb-8">
          {/* Category Heading */}
          <h2 className="text-3xl font-bold mb-4">{categoryName}</h2>

          {/* Subcategory Cards */}
          <div className="flex gap-8 overflow-x-auto scrollbar-hide">
            {subcategories.map((subcategory) => (
              <Link
                key={subcategory._id}
                to={`/subCategory/${encodeURIComponent(subcategory.subcategory)}`} // Encode URL properly
                className="w-44 flex-shrink-0 text-center"
              >
                <img
                  src={subcategory.image || "https://via.placeholder.com/200"}
                  alt={subcategory.subcategory}
                  className="w-44 h-44 object-contain rounded-2xl shadow-lg bg-white transition-transform transform hover:scale-105"
                />
                <p className="mt-3 text-lg font-semibold">{subcategory.subcategory}</p>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
    </>
  );
}

export default CsCards;
