import React, { useState } from "react";
import axios from "axios";

const ProductCard = ({ product, userId }) => {
    const [quantity, setQuantity] = useState(0);

    const handleAddToCart = async () => {
        try {
            const response = await axios.post(
                `https://grokart-2.onrender.com/api/v1/cart/add/${userId}/${product._id}/1`
            );
            console.log(response.data);
            setQuantity(1); // Change button to quantity selector
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const handleIncrease = async () => {
        try {
            const newQuantity = quantity + 1;
            await axios.post(`/api/v1/cart/add/${userId}/${product._id}/1`);
            setQuantity(newQuantity);
        } catch (error) {
            console.error("Error increasing quantity:", error);
        }
    };

    const handleDecrease = async () => {
        if (quantity === 1) {
            // Remove from cart if quantity is 1
            try {
                await axios.post(`/api/v1/cart/remove/${userId}/${product._id}`);
                setQuantity(0);
            } catch (error) {
                console.error("Error removing from cart:", error);
            }
        } else {
            try {
                await axios.post(`/api/v1/cart/add/${userId}/${product._id}/-1`);
                setQuantity(quantity - 1);
            } catch (error) {
                console.error("Error decreasing quantity:", error);
            }
        }
    };

    return (
        <div className="product-card">
            <h3>{product.name}</h3>
            <p>₹{product.price}</p>
            {quantity === 0 ? (
                <button onClick={handleAddToCart} className="add-to-cart">
                    Add to Cart
                </button>
            ) : (
                <div className="quantity-controls">
                    <button onClick={handleDecrease}>-</button>
                    <span>{quantity}</span>
                    <button onClick={handleIncrease}>+</button>
                </div>
            )}
        </div>
    );
};

export default ProductCard;
