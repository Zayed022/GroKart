import React from "react";
import { Search as SearchIcon } from "lucide-react";

function Search({ onSearch }) {
  console.log("onSearch prop received:", onSearch); // Debugging

  const handleChange = (event) => {
    if (typeof onSearch === "function") {
      onSearch(event.target.value);
    } else {
      console.error("onSearch is not a function. Received:", onSearch);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <input
        type="text"
        placeholder="Search for products..."
        onChange={handleChange}
        className="w-full pl-12 pr-4 py-2 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 shadow-md transition-all duration-300"
      />
      <SearchIcon className="absolute left-4 top-2.5 text-gray-500 w-6 h-6" />
    </div>
  );
}

export default Search;
