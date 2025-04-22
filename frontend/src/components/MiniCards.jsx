import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MiniCards() {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await fetch('https://grokart-2.onrender.com/api/v1/category/subcategories');
        const result = await response.json();

        setSubCategories(result.data || []); // Safely access data
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading mini categories...</p>;

  return (
    <>
      <h2 className="text-2xl font-semibold text-center">Shop by Mini Category</h2>
      <div className="p-6">
        {subCategories?.map((categoryBlock) => (
          <div key={categoryBlock._id}>
            {categoryBlock?.subcategories?.map((sub) => (
              <div key={sub.name} className="mb-8">
                <h2 className="text-3xl font-bold mb-4">{sub.name}</h2>
                <div className="flex gap-8 overflow-x-auto scrollbar-hide">
                  {sub?.minicategories?.map((mini, idx) => (
                    <Link
                      key={`${sub.name}-${idx}`}
                      to={`/minicategory/${encodeURIComponent(mini.name)}`}
                      className="w-44 flex-shrink-0 text-center"
                    >
                      <img
                        src={mini.image}
                        alt={mini.name}
                        className="w-full h-28 object-cover rounded-md"
                      />
                      <p className="mt-3 text-lg font-semibold">{mini.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
  
}

export default MiniCards;
