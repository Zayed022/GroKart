import React from "react";

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
    <input
      type="text"
      placeholder="Search products..."
      onChange={handleChange}
      className="border p-2 rounded w-full"
    />
  );
}

export default Search;
