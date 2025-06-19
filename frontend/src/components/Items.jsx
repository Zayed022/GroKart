import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/Cart.jsx";
import Cart from "./Cart.jsx";
import Search from "./Search.jsx";

function Items() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const toggle = () => setShowModal(!showModal);

  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);

  const increaseQuantity = (product) => {
    const currentQty = cartItems[product._id] || 0;
    addToCart(product, currentQty + 1);
  };

  const decreaseQuantity = (product) => {
    const currentQty = cartItems[product._id] || 0;
    if (currentQty > 1) {
      addToCart(product, currentQty - 1);
    } else {
      removeFromCart(product._id);
    }
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    const term = query.toLowerCase();
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://grokart-2.onrender.com/api/v1/products/get-product");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
        }
      } catch (err) {
        console.error("Error fetching products:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="px-4 py-6 sm:px-8">
      <Search onSearch={handleSearch} />
      <h2 className="text-3xl font-bold text-center mt-4 mb-6 text-gray-800">
        Shop by Category
      </h2>

      {loading ? (
        <p className="text-center text-gray-500 animate-pulse">Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-red-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const quantity = cartItems[product._id] || 0;

            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute m-2 px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full shadow-md">
                    {product.discount}% OFF
                  </div>
                )}

                {/* Product Image */}
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.image || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-t-2xl"
                  />
                </Link>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.description || "500g"}</p>

                  {/* Price Section */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-green-600 font-bold text-lg">₹{product.discountedPrice || product.price}</span>
                    {product.discount > 0 && (
                      <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                    )}
                  </div>

                  {/* Cart Controls */}
                  <div className="mt-4">
                    {quantity > 0 ? (
                      <div className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-full border border-pink-500">
                        <button
                          onClick={() => decreaseQuantity(product)}
                          className="text-pink-500 font-bold text-xl"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="font-medium text-gray-800">{quantity}</span>
                        <button
                          onClick={() => increaseQuantity(product)}
                          className="text-pink-500 font-bold text-xl"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        className="w-full bg-pink-500 text-white font-semibold py-2 rounded-full hover:bg-pink-600 transition"
                        onClick={() => addToCart(product, 1)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Cart showModal={showModal} toggle={toggle} />
    </div>
  );
}

export default Items;
