import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CartContext } from "../../context/Cart";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";

function SubcategoryPage() {
  const { subCategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const [cart, setCart] = useState(
    () => JSON.parse(localStorage.getItem("cart")) || {}
  );

  // Time check for store hours (8:00 AM to 1:30 AM next day)
  const isStoreOpen = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const openTime = 8 * 60; // 8:00 AM in minutes
    const closeTime = (24 + 1) * 60 + 30; // 1:30 AM next day => 25:30 in minutes => 1530

    return currentMinutes >= openTime || currentMinutes <= 90;
  };

  const storeOpen = isStoreOpen();

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

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const increaseQuantity = (product) => {
    const updatedCart = { ...cart };
    updatedCart[product._id] = (updatedCart[product._id] || 0) + 1;

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    addToCart(product, updatedCart[product._id]);
  };

  const decreaseQuantity = (product) => {
    const updatedCart = { ...cart };

    if (updatedCart[product._id] > 1) {
      updatedCart[product._id] -= 1;
      removeFromCart(product, updatedCart[product._id]);
    } else {
      delete updatedCart[product._id];
      removeFromCart(product, updatedCart[product._id]);
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h2 className="text-2xl font-semibold text-center">
          Products in {subCategory}
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1>Loading Products ... </h1>
            <div className="flex w-96 flex-col gap-6 justify-center p-6 shadow-lg rounded-2xl bg-white">
              <div className="relative overflow-hidden bg-gray-200 rounded-lg h-48 w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-[length:200%_100%] animate-shimmer" />
              </div>
              <div className="relative overflow-hidden bg-gray-200 rounded h-6 w-40">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-[length:200%_100%] animate-shimmer" />
              </div>
              <div className="relative overflow-hidden bg-gray-200 rounded h-4 w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-[length:200%_100%] animate-shimmer" />
              </div>
              <div className="relative overflow-hidden bg-gray-200 rounded h-4 w-full">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-[length:200%_100%] animate-shimmer" />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {products.length > 0 ? (
               [...products] // create a copy so original order isn't mutated
      .sort((a, b) => {
        if (a.stock === 6 && b.stock !== 6) return -1; // a first
        if (b.stock === 6 && a.stock !== 6) return 1;  // b first
        return 0; // leave others as is
      })
              .map((product) => (
                <div
                  key={product._id}
                  className={`bg-white rounded-2xl border border-gray-200 p-4 w-full max-w-[240px] shadow hover:shadow-md transition-all duration-200 relative ${
                    !storeOpen ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  <div className="relative">
                    {storeOpen ? (
                      <Link to={`/products/${product._id}`}>
                        <img
                          loading="lazy"
                          src={product.image}
                          alt={product.name}
                          className="w-full h-40 object-contain mb-3 "

                        />
                      </Link>
                    ) : (
                      <>
                        <img
                          loading="lazy"
                          src={product.image}
                          alt={product.name}
                          className="w-full h-40 object-contain mb-3 rounded-lg"
                        />
                        <div className="absolute top-0 left-0 w-full h-40 bg-black bg-opacity-60 flex items-center justify-center rounded-md">
                          <span className="text-white font-bold text-sm">
                            Not Available
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <p className="text-base font-medium leading-tight h-[2.75rem] overflow-hidden text-ellipsis line-clamp-2">
                    {product.name}
                  </p>

                  <p className="text-xs text-gray-500 mb-1">
                    {product.description || "50 g"}
                  </p>

                  <div className="flex items-center gap-2 mb-3">
                    <p className="text-base font-semibold text-gray-900">
                      ₹{product.price}
                    </p>
                  </div>

                  {storeOpen ? (
                    <div className="flex flex-col gap-1">
                      {product.stock === 0 ? (
                        <button
                          disabled
                          className="w-full border border-gray-300 text-gray-400 text-sm py-2 font-semibold rounded-lg cursor-not-allowed bg-gray-100"
                        >
                          Out of Stock
                        </button>
                      ) : cart[product._id] ? (
                        <>
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
                          {product.stock < 5 && product.stock > 0 && (
                            <p className="text-xs text-red-500 font-medium mt-1">
                              Only {product.stock} left!
                            </p>
                          )}
                        </>
                      ) : (
                        <>
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
                          {product.stock < 5 && product.stock > 0 && (
                            <p className="text-xs text-red-500 font-medium mt-1">
                              Only {product.stock} left!
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  ) : (
                    <button
                      disabled
                      className="w-full border border-gray-400 text-gray-400 text-sm py-2 font-semibold rounded-lg cursor-not-allowed"
                    >
                      Not Available
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
    </>
  );
}

export default SubcategoryPage;
