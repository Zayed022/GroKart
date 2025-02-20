import { useState, useEffect } from "react";
import { Minus, Plus, Trash } from "lucide-react";

export default function CartComp() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token"); // Ensure token is retrieved

    if (!userId || userId === "null") {
      console.error("User ID is missing! Cannot fetch cart.");
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      console.log(`Fetching cart for user ID: ${userId}`);
      try {
        const response = await fetch(`/api/v1/cart/get-cart/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add token
          },
          credentials: "include", // Ensure cookies are sent if needed
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch cart: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Cart Data:", data);
        setCart(data.items || []);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const updateQuantity = (id, delta) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalSavings = cart.reduce((acc, item) => acc + ((item.originalPrice || 0) - (item.price || 0)) * (item.quantity || 1), 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
  

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="w-80 bg-white shadow-lg p-4 rounded-lg">
      <h2 className="text-lg font-bold mb-4">Your Cart</h2>
      <p className="text-green-600 text-sm">Saved ₹{totalSavings.toFixed(2)} including free delivery!</p>
      <div className="mt-4 space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="p-2 flex justify-between items-center">
            <div className="flex justify-between items-center w-full">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">₹{item.price}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => updateQuantity(item.id, -1)}>
                  <Minus size={16} />
                </button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)}>
                  <Plus size={16} />
                </button>
                <button onClick={() => removeItem(item.id)}>
                  <Trash size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 border-t pt-4">
      <p className="text-sm">Total: <span className="font-bold">₹{(totalPrice || 0).toFixed(2)}</span></p>
        <button className="w-full mt-2 bg-red-500 text-white">Add Address to Proceed</button>
      </div>
    </div>
  );
}
