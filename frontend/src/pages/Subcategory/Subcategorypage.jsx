import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CartContext } from "../../context/Cart";
import toast from "react-hot-toast";

function SubcategoryPage() {
  const { subCategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setshowModal] = useState(false);
  const { cartItems, addToCart } = useContext(CartContext);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `https://grokart-2.onrender.com/api/v1/products/subCategory/${subCategory}`
        );
        const data = await response.json();

        if (data.message === "Products fetched") {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [subCategory]);

  const [cart, setCart] = useState(() => {
    // Load cart from localStorage when component mounts
    return JSON.parse(localStorage.getItem("cart")) || {};
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Add to Cart Function
  const userId = localStorage.getItem("userId"); // Ensure userId is retrieved correctly

  const increaseQuantity = (product) => {
    const updatedCart = { ...cart };
    updatedCart[product._id] = (updatedCart[product._id] || 0) + 1;

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Call context function to sync with global cart
    addToCart(product, updatedCart[product._id]);
  };

  // Decrease Quantity or Remove Item
  const decreaseQuantity = (product) => {
    const updatedCart = { ...cart };

    if (updatedCart[product._id] > 1) {
      updatedCart[product._id] -= 1; // Decrease quantity
    } else {
      delete updatedCart[product._id]; // Remove from cart if quantity reaches 0
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Sync with global cart
    addToCart(product, updatedCart[product._id] || 0);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-center">
        Products in {subCategory}
      </h2>

      {loading ? (
        <p className="text-center text-gray-600 mt-4">Loading products...</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-gray-200 p-4 w-full max-w-[240px] shadow hover:shadow-md transition-all duration-200 relative"
              >
                {/* Discount badge 
  <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs font-semibold px-2 py-0.5 rounded z-10">
    {product.discountPercent || 10}% Off
  </div>

    */}
                {/* Product Image */}
                {product.image && (
                <Link to = {`/products/${product._id}`}>
                <img
                  loading="lazy"
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-contain mb-3"
                />
                </Link>
            )}

                {/* Product Name */}
                <p className="text-base font-medium leading-tight h-[2.75rem] overflow-hidden text-ellipsis line-clamp-2">
                  {product.name}
                </p>

                {/* Quantity */}
                <p className="text-xs text-gray-500 mb-1">
                  {product.description || "50 g"}
                </p>

                {/* Price section */}
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-base font-semibold text-gray-900">
                    ₹{product.price}
                  </p>
                </div>

                {/* Add to Cart Button */}
                {cart[product._id] ? (
                  <div className="flex items-center justify-between border border-pink-500 rounded-full px-3 py-1">
                    <button
                      onClick={() => decreaseQuantity(product)}
                      className="text-xl font-bold text-pink-600"
                    >
                      −
                    </button>
                    <span className="text-sm">{cart[product._id]}</span>
                    <button
                      onClick={() => increaseQuantity(product)}
                      className="text-xl font-bold text-pink-600"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    className="w-full border border-pink-500 text-pink-500 hover:bg-pink-50 text-sm py-2 font-semibold rounded-lg transition"
                    onClick={() => {
                      addToCart(product);
                      setCart((prev) => ({
                        ...prev,
                        [product._id]: 1,
                      }));
                      toast.success(`${product.name} added to cart`);
                    }}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No products found in this subcategory.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default SubcategoryPage;
