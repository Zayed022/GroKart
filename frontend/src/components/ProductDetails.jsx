import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/Cart";
import Navbar from "./Navbar";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { cartItems, addToCart, removeFromCart } = useContext(CartContext);
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || {};
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const userId = localStorage.getItem("userId"); // Ensure userId is retrieved correctly

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
      updatedCart[product._id] -= 1; // Decrease quantity
      removeFromCart(product, updatedCart[product._id]); // Sync with global cart only if still in cart
    } else {
      delete updatedCart[product._id];
      removeFromCart(product, updatedCart[product._id]); // Remove from cart if quantity reaches 0
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://grokart-2.onrender.com/api/v1/products/${productId}`
        );
        const data = await response.json();
        if (data.product) {
          setProduct(data.product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex w-96 flex-col gap-6 justify-center p-6 shadow-lg rounded-2xl bg-white">
          {/* Image shimmer */}
          <div className="relative overflow-hidden bg-gray-200 rounded-lg h-48 w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-[length:200%_100%] animate-shimmer" />
          </div>

          {/* Title shimmer */}
          <div className="relative overflow-hidden bg-gray-200 rounded h-6 w-40">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-[length:200%_100%] animate-shimmer" />
          </div>

          {/* Text shimmer */}
          <div className="relative overflow-hidden bg-gray-200 rounded h-4 w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-[length:200%_100%] animate-shimmer" />
          </div>

          {/* Text shimmer */}
          <div className="relative overflow-hidden bg-gray-200 rounded h-4 w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-white to-gray-200 bg-[length:200%_100%] animate-shimmer" />
          </div>
        </div>
      </div>
    );

  if (!product) return <p>Product not found.</p>;

  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="breadcrumbs text-sm text-10  ">
          <ul>
            <li>
              <a>{product.category}</a>
            </li>
            <li>
              <a>{product.subCategory}</a>
            </li>
            <li className="font-bold">{product.miniCategory}</li>
          </ul>
        </div>
        <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl duration-300">
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
            <div className="w-full md:w-1/2 flex justify-center">
              <img
                src={product.image || "/placeholder.jpg"}
                alt={product.name}
                className="w-80 h-auto rounded-lg shadow-md transform transition-transform duration-300 hover:scale-110"
              />
            </div>

            <div className="w-full md:w-1/2 text-center md:text-left">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <h3 className="text-md text-gray-700 mt-5">
                Net Qty:{product.description}
              </h3>

              <p className="text-black text-4xl font-bold mt-5">
                ₹{product.price}
              </p>

              <div className="mt-4">
                {product.stock === 0 ? (
                  <button
                    disabled
                    className="px-6 py-2 w-full bg-gray-400 text-white font-semibold rounded-lg cursor-not-allowed"
                  >
                    Out of Stock
                  </button>
                ) : cart[product._id] ? (
                  <div className="flex flex-col gap-1 items-center justify-center">
                    <div className="flex items-center justify-center border border-green-500 rounded-lg w-full">
                      <button
                        onClick={() => decreaseQuantity(product)}
                        className="px-3 py-2 text-green-500 font-bold"
                      >
                        −
                      </button>
                      <span className="px-4">{cart[product._id]}</span>
                      <button
                        onClick={() => increaseQuantity(product)}
                        className="px-3 py-2 text-green-500 font-bold"
                      >
                        +
                      </button>
                    </div>
                    {product.stock < 5 && product.stock > 0 && (
                      <p className="text-sm text-red-500 mt-1 font-medium">
                        Only {product.stock} left!
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1">
                    <button
                      className="px-6 py-2 text-white bg-green-500 rounded-lg w-full"
                      onClick={() => {
                        addToCart(product, 1);
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
                      <p className="text-sm text-red-500 mt-1 font-medium">
                        Only {product.stock} left!
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Coupons & Offers Section */}
              <div className="mt-6 p-5 bg-gray-100 rounded-lg text-lg">
                <h3 className="text-xl font-semibold">Coupons & Offers</h3>
                <ul className="text-gray-700">
                  <li>• Up to ₹200 off on orders above ₹1499</li>
                  <li>
                    • Flat 12% discount with Select Kotak Bank Credit Card
                  </li>
                  <li>• Get assured rewards with CRED</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
