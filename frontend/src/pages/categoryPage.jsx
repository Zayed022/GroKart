import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function CategoryPage() {
  const { categoryName } = useParams(); // Get category name from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({});

  useEffect(() => {
    fetch(`https://grokart-2.onrender.com/api/v1/products/category/${encodeURIComponent(categoryName)}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.product);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, [categoryName]);

  const addToCart = (id) => {
    setCart((prev) => ({ ...prev, [id]: 1 }));
  };

  const increaseQuantity = (id) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
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
    <div className="p-6">
      <h2 className="text-xl font-semibold text-center capitalize">{categoryName}</h2>
      {loading ? (
        <p className="text-center text-gray-600">Loading products...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product._id}
                className="relative bg-white shadow-lg rounded-lg overflow-hidden border w-36"
              >
                {product.discount > 0 && (
                  <span className="absolute top-1 left-1 bg-purple-600 text-white text-xs font-bold px-1 py-0.5 rounded">
                    {product.discount}% Off
                  </span>
                )}

                <img
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="w-full h-24 object-cover"
                />

                <div className="p-2">
                  <h3 className="text-sm font-semibold truncate">{product.name}</h3>
                  <p className="text-gray-600 text-xs">{product.weight || "500g"}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-sm font-bold text-green-600">
                      ₹{product.discountedPrice || product.price}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{product.price}
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    {cart[product._id] ? (
                      <div className="flex items-center justify-center border border-pink-500 rounded-md w-full">
                        <button
                          onClick={() => decreaseQuantity(product._id)}
                          className="px-2 py-1 text-pink-500 font-bold"
                        >
                          −
                        </button>
                        <span className="px-3 text-sm">{cart[product._id]}</span>
                        <button
                          onClick={() => increaseQuantity(product._id)}
                          className="px-2 py-1 text-pink-500 font-bold"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product._id)}
                        className="px-3 py-1 text-white text-sm bg-pink-500 rounded-md w-full"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No products found in this category</p>
          )}
        </div>
      )}
    </div>
  );
}

export default CategoryPage;
