import { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart, FaPlus, FaMinus, FaTimes } from "react-icons/fa";

const CartSidebar = ({ userId }) => {
    const [cart, setCart] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    // Fetch cart data
    useEffect(() => {
        fetchCart();
    }, []);

    const addToCart = async(userId,productId,quantity=1)=>{
        try {
            const response = await axios.post(`/api/v1/cart/add/${userId}/${productId}/${quantity}`)
            setCart(response.data);
        } catch (error) {
            console.error("Error adding items to cart", error);
        }
    }

    const fetchCart = async () => {
        try {
            const response = await axios.get(`/api/v1/cart/${userId}/${productId}/1`);
            setCart(response.data);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    const updateQuantity = async (productId, change) => {
        try {
            await axios.post(`/api/v1/cart/add/${userId}/${productId}/1`);
            fetchCart(); // Refresh cart
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const removeItem = async (productId) => {
        try {
            await axios.post("/api/v1/cart/remove", { userId, productId });
            fetchCart(); // Refresh cart
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    return (
        <>
            {/* Floating Cart Button */}
            <button
                className="fixed bottom-6 right-6 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700"
                onClick={() => setIsOpen(!isOpen)}
            >
                <FaShoppingCart size={24} />
            </button>

            {/* Cart Sidebar */}
            <div className={`fixed top-0 right-0 w-80 h-full bg-white shadow-xl p-4 transition-transform transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
                <button className="absolute top-4 right-4 text-gray-500" onClick={() => setIsOpen(false)}>
                    <FaTimes size={20} />
                </button>
                <h2 className="text-xl font-semibold mb-4">Your Cart</h2>

                {cart && cart.items.length > 0 ? (
                    cart.items.map((item) => (
                        <div key={item.product._id} className="flex items-center justify-between border-b py-3">
                            <div>
                                <p className="font-semibold">{item.product.name}</p>
                                <p className="text-sm text-gray-600">₹{item.product.price}</p>
                            </div>
                            <div className="flex items-center">
                                <button className="p-1 bg-gray-200 rounded-full" onClick={() => updateQuantity(item.product._id, -1)}>
                                    <FaMinus />
                                </button>
                                <span className="mx-2">{item.quantity}</span>
                                <button className="p-1 bg-gray-200 rounded-full" onClick={() => updateQuantity(item.product._id, 1)}>
                                    <FaPlus />
                                </button>
                                <button className="ml-3 text-red-600" onClick={() => removeItem(item.product._id)}>
                                    <FaTimes />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">Your cart is empty</p>
                )}

                {cart && cart.items.length > 0 && (
                    <div className="mt-4">
                        <p className="font-semibold">Total: ₹{cart.totalPrice}</p>
                        <button className="w-full bg-green-600 text-white py-2 mt-2 rounded hover:bg-green-700">
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
