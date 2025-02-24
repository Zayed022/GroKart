import { useContext } from 'react';
import { CartContext } from '../context/Cart';

const CartDisplay = () => {
  const { cartItems, getCartTotal } = useContext(CartContext);

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <div key={item._id}>
            <p>{item.name} - Quantity: {item.quantity}</p>
          </div>
        ))
      ) : (
        <p>Cart is empty</p>
      )}
      <h3>Total: ₹{getCartTotal()}</h3>
    </div>
  );
};

export default CartDisplay;
