import React, { createContext, useState, useEffect } from "react";

export const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const stored = localStorage.getItem("user_orders");
    return stored ? JSON.parse(stored) : [];
  });

  // Save orders in localStorage to persist on refresh
  useEffect(() => {
    localStorage.setItem("user_orders", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]); // latest first
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
