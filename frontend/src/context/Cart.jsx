import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem('cartItems')) || [];
  });

  const addToCart = (item) => {
    console.log('Adding to cart:', item);

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((cartItem) => cartItem._id === item._id);
      
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };
  const updateCartItemQuantity = (itemId, newQuantity) => {
    setCartItems((prevCart) =>
      prevCart.map((item) =>
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (item) => {
    setCartItems((prevItems) =>
      prevItems.reduce((acc, cartItem) => {
        if (cartItem._id === item._id) {
          if (cartItem.quantity > 1) {
            acc.push({ ...cartItem, quantity: cartItem.quantity - 1 });
          }
        } else {
          acc.push(cartItem);
        }
        return acc;
      }, [])
    );
  };

  const addMultipleToCart = (items) => {
  const updatedCart = [...cartItems];

  items.forEach((newItem) => {
    const existingItem = updatedCart.find((item) => item._id === newItem.productId);
    if (existingItem) {
      existingItem.quantity += newItem.quantity;
    } else {
      updatedCart.push({
        _id: newItem.productId,
        name: newItem.name,
        image: newItem.image || "", // Optional
        price: newItem.price,
        quantity: newItem.quantity,
        description: newItem.description || "",
      });
    }
  });

  setCartItems(updatedCart);
  localStorage.setItem("cartItems", JSON.stringify(updatedCart));
};

  
  

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalQuantity = () => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  };

  // Store cart items in localStorage when cart updates
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        updateCartItemQuantity,
        getTotalQuantity,
        addMultipleToCart,
        
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
