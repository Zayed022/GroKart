import { useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";

const CartPage = ({ userId }) => {
    const { cart, loading, fetchCart, removeFromCart } = useContext(CartContext);

    useEffect(() => {
        fetchCart(userId);
    }, [userId]);

    if (loading) return <p>Loading cart...</p>;
    if (!cart || cart.items.length === 0) return <p>Your cart is empty.</p>;

    return (
        <div className="cart-page">
            <h2>Your Cart</h2>
            {cart.items.map((item) => (
                <div key={item.product._id} className="cart-item">
                    <img src={item.product.image} alt={item.product.name} />
                    <div>
                        <h3>{item.product.name}</h3>
                        <p>₹{item.product.price} x {item.quantity}</p>
                        <button onClick={() => removeFromCart(userId, item.product._id)}>Remove</button>
                    </div>
                </div>
            ))}
            <h3>Total: ₹{cart.totalPrice}</h3>
        </div>
    );
};

export default CartPage;
