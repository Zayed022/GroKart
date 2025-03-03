import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import CategoryPage from "./pages/categoryPage";
import Subcategorypage from "./pages/Subcategory/Subcategorypage";
import Items from "./components/Items";
import ProductDetails from "./components/ProductDetails";
import CartDisplay from "./components/CartDisplay";
import Checkout from "./components/Checkout";
import Payment from "./components/Payment";
import OrderSuccess from "./components/OrderSuccess";
import { Sidebar } from "lucide-react";


function App() {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/category/:categoryName" element={<CategoryPage />} />
      <Route path="/subCategory/:subCategory" element={<Subcategorypage />} />
      <Route path="/all-products" element={<Items />} />
      <Route path="/products/:productId" element={<ProductDetails />} />
      <Route path="/cart" element={<CartDisplay />} />
      <Route path = "/checkout" element = {<Checkout/>}/>
      <Route path = "/payment" element = {<Payment/>}/>
      <Route path = "/order-success" element = {<OrderSuccess/>}/>
      <Route path = "/mini" element = {<Sidebar/>}/>
      
      
      
      
      

      
    </Routes>
  );
}

export default App;
