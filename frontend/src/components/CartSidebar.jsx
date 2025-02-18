import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { X } from "lucide-react"; // Icon for close button

const CartSidebar = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

    return (
        <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-lg transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"} z-50`}>
            <div className="p-4 flex justify-between border-b">
                <h2 className="text-lg font-bold">Your Cart</h2>
                <button onClick={onClose}><X /></button>
            </div>

            {/* Cart Items */}
            <div className="p-4 space-y-4">
                {cart.length === 0 ? (
                    <p className="text-center text-gray-500">Your cart is empty.</p>
                ) : (
                    cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b pb-2">
                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md" />
                            <div className="flex-1 ml-4">
                                <h3 className="text-sm font-medium">{item.name}</h3>
                                <p className="text-sm text-gray-500">₹{item.price}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="border px-2">-</button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="border px-2">+</button>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-500">✕</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer - Total & Checkout */}
            <div className="p-4 border-t">
                <button className="w-full bg-red-500 text-white py-2 rounded-md">Add Address to Proceed</button>
            </div>
        </div>
    );
};

export default CartSidebar;
