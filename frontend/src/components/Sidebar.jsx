import { useEffect, useState } from "react";
import axios from "axios";

const Sidebar = () => {
  const [miniCategories, setMiniCategories] = useState([]);

  // Fetch MiniCategories
  useEffect(() => {
    const fetchMiniCategories = async () => {
      try {
        const { data } = await axios.get("https://grokart-2.onrender.com/api/v1/products/get-all-mini-categories");
        setMiniCategories(data.miniCategories);
      } catch (error) {
        console.error("Error fetching miniCategories:", error);
      }
    };

    fetchMiniCategories();
  }, []);

  return (
    <div className="w-64 min-h-screen bg-gray-200 p-4 fixed left-0 top-0">
      <h2 className="text-xl font-bold mb-3">Mini Categories</h2>

      {/* Display MiniCategories */}
      <ul className="space-y-2">
        {miniCategories.length > 0 ? (
          miniCategories.map((category, index) => (
            <li key={index}>
              <a
                href={`/products?miniCategory=${category}`}
                className="block p-2 rounded bg-white hover:bg-gray-300"
              >
                {category}
              </a>
            </li>
          ))
        ) : (
          <li className="text-gray-500">No categories found</li>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
