import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchCart = async (userId) => {
        try {
            const response = await axios.get(`/api/cart/${userId}`);
            setCart(response.data);
        } catch (error) {
            console.error("Error fetching cart:", error);
            setCart(null);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (userId, productId, quantity = 1) => {
        try {
            const response = await axios.post("/api/cart/add", { userId, productId, quantity });
            setCart(response.data.cart);
        } catch (error) {
            console.error("Error adding item to cart:", error);
        }
    };

    const removeFromCart = async (userId, productId) => {
        try {
            const response = await axios.post("/api/cart/remove", { userId, productId });
            setCart(response.data.cart || null);
        } catch (error) {
            console.error("Error removing item from cart:", error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, removeFromCart }}>
            {children}
        </CartContext.Provider>
    );
};
