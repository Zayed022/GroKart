import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  // Handle quantity decrease (minimum 1)
  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/v1/products/${productId}`);
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
      {/* Bigger Container */}
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg">
        {/* Product Content */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          {/* Left: Bigger Product Image */}
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={product.image || "/placeholder.jpg"}
              alt={product.name}
              className="w-80 h-auto rounded-lg shadow-md"
            />
          </div>

          {/* Right: Bigger Product Details */}
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-3xl font-bold">{product.name}</h2>
            <p className="text-green-600 text-xl font-bold">₹{product.price}</p>

            {/* Quantity Selector - Bigger Buttons */}
            <div className="flex items-center justify-center md:justify-start gap-6 my-5">
              <button
                onClick={decreaseQuantity}
                className="bg-gray-300 px-3 py-2 text-lg rounded hover:bg-gray-400"
              >
                -
              </button>
              <span className="text-xl">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="bg-gray-300 px-3 py-2 text-lg rounded hover:bg-gray-400"
              >
                +
              </button>
            </div>

            {/* Bigger Add to Cart Button */}
            <button className="bg-green-500 text-white px-8 py-3 text-lg rounded-lg">
              Add to Cart
            </button>

            {/* Bigger Coupons & Offers Section */}
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
