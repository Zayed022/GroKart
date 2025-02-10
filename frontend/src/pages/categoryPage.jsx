import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function CategoryPage() {
  const { categoryName } = useParams(); // Get category name from URL
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products from backend based on categoryName
    fetch(`/api/v1/products/category/${encodeURIComponent(categoryName)}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.product))
      .catch((err) => console.error("Error fetching products:", err));
  }, [categoryName]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-center">{categoryName}</h2>
      <div className="grid grid-cols-3 gap-6 mt-6">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md p-4 rounded-lg w-40"
            >
                
              <p className="font-bold">{product.name}</p>
              <p>₹{product.price}</p>
              <button type="submit" className="w-full bg-green-500 text-white p-2 outline-pink-200 text-pink-200  rounded-lg hover:bg-green-600">Add to Cart</button>
            </div>
          ))
        ) : (
          <p>No products found in this category</p>
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
