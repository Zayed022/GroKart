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
import Address from "./components/Address";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentSuccessOnline from "./components/PaymentOnlineSuccess";
import MinicategoryPage from "./components/MiniCategory";
import { Toaster } from "react-hot-toast";
import MyOrders from "./components/MyOrders";
import CsCards from "./components/CsCards";
import ContactUs from "./components/ContactUs";
import TermsAndConditions from "./components/Terms&Condition";
import CancellationRefundPolicy from "./components/Cancellation";
import PrivacyPolicy from "./components/PrivacyPolicy";


function App() {
  return (
    <>
    <Toaster position="top-right mt-10" 
    toastOptions={{
      ariaProps: {
        role: 'status',
        'aria-live': 'polite'
      }
    }}
    reverseOrder={false} />
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />
      <Route path="/category/:categoryName" element={<CategoryPage />} />
      <Route path="/subCategory/:subCategory" element={<Subcategorypage />} />
      <Route path="/minicategory/:miniCategory" element={<MinicategoryPage />} />
      <Route path="/all-products" element={<Items />} />
      <Route path="/products/:productId" element={<ProductDetails />} />
      <Route path="/cart" element={<CartDisplay />} />
      <Route path="/address" element={<Address />} />
      <Route path = "/checkout" element = {<Checkout/>}/>
      <Route path = "/payment" element = {<Payment/>}/>
      <Route path = "/order-success" element = {<OrderSuccess/>}/>
      <Route path = "/payment-success" element = {<PaymentSuccess/>}/>
      <Route path = "/payment-success-online" element = {<PaymentSuccessOnline/>}/>
      <Route path = "/order-history" element = {<MyOrders/>}/>
      <Route path = "/mini" element = {<Sidebar/>}/>
      <Route path = "/category" element = {<CsCards/>}/>
      <Route path = "/contact-us" element = {<ContactUs/>}/>
      <Route path = "/terms-conditions" element = {<TermsAndConditions/>}/>
      <Route path = "/cancellation" element = {<CancellationRefundPolicy/>}/>\
      <Route path = "/policy" element = {<PrivacyPolicy/>}/>

      
      
      
      
      

      
    </Routes>
    </>
  );
}

export default App;
