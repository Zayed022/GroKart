import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CartContext } from "../context/Cart";

function MinicategoryPage() {
  const { miniCategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setshowModal] = useState(false)
  const {cartItems, addToCart} = useContext(CartContext)
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://grokart-2.onrender.com/api/v1/products/minicategory/${miniCategory}`);
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
  }, [miniCategory]);

  

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
      <h2 className="text-2xl font-semibold text-center">Products in {miniCategory}</h2>

      {loading ? (
        <p className="text-center text-gray-600 mt-4">Loading products...</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} className="bg-white shadow-md p-4 rounded-lg text-center">
                {product.image && (
                  <Link to = {`/products/${product._id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  </Link>
                )}
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-600">₹{product.price}</p>

                {/* Add to Cart Button / Quantity Meter */}
                <div className="mt-4">
                    {cart[product._id] ? (
                      <div className="flex items-center justify-center border border-pink-500 rounded-lg w-full">
                        <button
                          onClick={() => decreaseQuantity(product)}
                          className="px-3 py-2 text-pink-500 font-bold"
                        >
                          −
                        </button>
                        <span className="px-4">{cart[product._id]}</span>
                        <button
                          onClick={() => increaseQuantity(product)}
                          className="px-3 py-2 text-pink-500 font-bold"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      
                      <button
                      className="px-6 py-2 text-white bg-pink-500 rounded-lg w-full"
                      onClick={() => {
                        addToCart(product); // Add item to context/cart
                        setCart((prev) => ({
                          ...prev,
                          [product._id]: 1, // Set quantity to 1
                        })); // Force state update
                      }}
                    >
                      Add to Cart
                    </button>
                    
                      
                    )}
                  </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No products found in this subcategory.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default MinicategoryPage;
