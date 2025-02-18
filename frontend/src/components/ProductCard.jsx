// src/components/ProductCard.jsx
import { useCart } from '../context/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart, loading } = useCart();

  return (
    <div className="card bg-white shadow-md rounded-lg p-4">
      <img 
        src={product.image} 
        alt={product.name}
        className="w-full h-48 object-cover mb-4"
      />
      <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-2">₹{product.price}</p>
      <button
        onClick={() => addToCart(product._id)}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
};