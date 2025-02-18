// src/components/CartPage.jsx
import { useCart } from '../context/CartContext';

export const CartPage = () => {
  const { cart, loading, error, removeFromCart } = useCart();

  if (loading) return <div className="text-center p-8">Loading cart...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;
  if (!cart?.items?.length) return <div className="text-center p-8">Your cart is empty</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cart.items.map(item => (
          <div key={item.product._id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={item.product.image} 
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">
                  {item.quantity} × ₹{item.product.price}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <p className="font-semibold">₹{item.quantity * item.product.price}</p>
              <button
                onClick={() => removeFromCart(item.product._id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Total Amount:</h2>
          <p className="text-xl font-semibold">₹{cart.totalPrice}</p>
        </div>
        <button className="w-full mt-4 bg-blue-500 text-white py-3 rounded hover:bg-blue-600">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};