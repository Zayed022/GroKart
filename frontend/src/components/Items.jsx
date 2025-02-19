import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Items() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage when component mounts
    return JSON.parse(localStorage.getItem("cart")) || {};
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add to Cart Function
  const addToCart = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: 1, // Set quantity to 1 when first added
    }));
  };

  // Increase Quantity
  const increaseQuantity = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1, // Increment quantity
    }));
  };

  // Decrease Quantity or Remove Item
  const decreaseQuantity = (id) => {
    setCart((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[id] > 1) {
        updatedCart[id] -= 1; // Reduce quantity
      } else {
        delete updatedCart[id]; // Remove from cart if quantity is 0
      }
      return updatedCart;
    });
  };

  // Fetch Products from Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/v1/products/get-product");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-center">Shop by Category</h2>
      {loading ? (
        <p className="text-center text-gray-600">Loading products...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="relative bg-white shadow-lg rounded-lg overflow-hidden border"
              >
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {product.discount}% Off
                  </span>
                )}

                {/* Product Image */}
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.image || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="w-full h-40 object-cover"
                  />
                </Link>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {product.weight || "500g"}
                  </p>

                  {/* Price Section */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-green-600">
                      ₹{product.discountedPrice || product.price}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.price}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <div className="mt-4">
                    {cart[product._id] ? (
                      <div className="flex items-center justify-center border border-pink-500 rounded-lg w-full">
                        <button
                          onClick={() => decreaseQuantity(product._id)}
                          className="px-3 py-2 text-pink-500 font-bold"
                        >
                          −
                        </button>
                        <span className="px-4">{cart[product._id]}</span>
                        <button
                          onClick={() => increaseQuantity(product._id)}
                          className="px-3 py-2 text-pink-500 font-bold"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <Link to ="/cart">
                      <button
                        onClick={() => addToCart(userId, price, product._id,quantity)}
                        className="px-6 py-2 text-white bg-pink-500 rounded-lg w-full"
                      >
                        Add to Cart
                      </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Items;
