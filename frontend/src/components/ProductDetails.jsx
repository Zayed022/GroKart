import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../context/Cart";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { cartItems, addToCart } = useContext(CartContext);
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
      updatedCart[product._id] -= 1;
    } else {
      delete updatedCart[product._id];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    addToCart(product, updatedCart[product._id] || 0);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://grokart-2.onrender.com/api/v1/products/${productId}`);
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

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={product.image || "/placeholder.jpg"}
              alt={product.name}
              className="w-80 h-auto rounded-lg shadow-md"
            />
          </div>

          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold">{product.name}</h2>
            <p className="text-green-600 text-xl font-bold">₹{product.price}</p>

            <div className="mt-4">
              {cart[product._id] ? (
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
              ) : (
                <button
                  className="px-6 py-2 text-white bg-green-500 rounded-lg w-full"
                  onClick={() => {
                    addToCart(product, 1);
                    setCart((prev) => ({
                      ...prev,
                      [product._id]: 1,
                    }));
                  }}
                >
                  Add to Cart
                </button>
              )}
            </div>

            {/* Coupons & Offers Section */}
            <div className="mt-6 p-5 bg-gray-100 rounded-lg text-lg">
              <h3 className="text-xl font-semibold">Coupons & Offers</h3>
              <ul className="text-gray-700">
                <li>• Up to ₹200 off on orders above ₹1499</li>
                <li>• Flat 12% discount with Select Kotak Bank Credit Card</li>
                <li>• Get assured rewards with CRED</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
