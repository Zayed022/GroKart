import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Subcategorycards() {
    const [categories, setCategories] = useState([]);

    useEffect(()=>{
        const fetchCategories = async()=>{
            try {
                const response = await fetch("https://grokart-2.onrender.com/api/v1/products/get-categories-with-subcategories");
                const data = await response.json();
                if(data.success){
                    setCategories(data.data);
                }
            } catch (error) {
                console.log("Error fetching categories", error)
            }
        };
        fetchCategories();
    },[])
  return (
    <div className="p-8">

            <h2 className="text-2xl font-semibold text-center">Shop by Category</h2>
            <div className="mt-6">
                {categories.length > 0 ? (
                    categories.map((categoryItem, index) => (
                        <div key={index} className="mb-6">
                            {/* Category Heading */}
                            <h3 className="text-xl font-bold">{categoryItem.category}</h3>

                            {/* Subcategories Grid */}
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {categoryItem.subcategories.map((subcategory, subIndex) => (
                                    <Link to={`/subCategory/${encodeURIComponent(subcategory)}`} key={subIndex}>
                                        <div className="bg-white shadow-md p-4 rounded-lg text-center cursor-pointer hover:bg-gray-200 transition">
                                            <p className="font-semibold">{subcategory}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">Loading categories...</p>
                )}
            </div>
        </div>
  );
}

export default Subcategorycards;
