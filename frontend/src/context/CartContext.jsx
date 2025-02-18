// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get current user ID from your authentication system
  const userId = '679a73e09d6da0cf0e515f5b'; 
  // Replace with actual user ID from your auth context
  const productId = '6798fd77de009350912cbaa4'

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/cart/${userId}`);
      setCart(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      await axios.post(`/api/v1/cart/add/${userId}/${productId}/${quantity}`);
      await fetchCart(); // Refresh cart after adding item
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add to cart');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.post(`/api/v1/cart/remove/${userId}/${productId}`);
      await fetchCart(); // Refresh cart after removal
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove from cart');
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCart();
    }
  }, [userId]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        removeFromCart,
        itemCount: cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
      throw new Error('useCart must be used within a CartProvider');
    }
    return context;
  };
