import React, { createContext, useState, useEffect, useContext } from "react";

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null); // Optional: if you store user info
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      // Optional: fetch user details from backend
    }
    setLoading(false); // Done checking localStorage
  }, []);

  const login = (tokenValue, userInfo = null) => {
    localStorage.setItem("token", tokenValue);
    setToken(tokenValue);
    if (userInfo) setUser(userInfo);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
