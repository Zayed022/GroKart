import React, { useEffect, useState } from 'react'
import axios from "axios"


function Categorycards() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://grokart-2.onrender.com/api/v1/products/get-all-categories");
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h3>Shop by Category</h3>
      <ul>
        {categories.map((category, index) => (
        <li key={index}>{category}</li>
        ))}
        
      </ul>
      
      
    </div>
  )
}

export default Categorycards
