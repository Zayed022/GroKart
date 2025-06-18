import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { CartProvider } from "./context/Cart";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <AuthProvider>
    <CartProvider>
      <GoogleOAuthProvider clientId = "1028167167572-05lrslogsm0gpjpab9sv79c5td1j9hp8.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </CartProvider>
    </AuthProvider>
  </BrowserRouter>
);
