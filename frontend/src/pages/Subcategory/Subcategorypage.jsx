import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function SubcategoryPage() {
  const { subCategory } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/v1/products/subCategory/${subCategory}`);
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

  const addToCart = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: 1,
    }));
  };

  const increaseQuantity = (id) => {
    setCart((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const decreaseQuantity = (id) => {
    setCart((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[id] > 1) {
        updatedCart[id] -= 1;
      } else {
        delete updatedCart[id];
      }
      return updatedCart;
    });
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-center">Products in {subCategory}</h2>

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
                <div className="mt-2">
                  {cart[product._id] ? (
                    <div className="flex items-center justify-center border border-pink-500 rounded-lg">
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
                    <button
                      onClick={() => addToCart(product._id)}
                      className="w-full bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600"
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

export default SubcategoryPage;
