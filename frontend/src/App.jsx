import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Home from './pages/Home'
import CategoryPage from './pages/categoryPage'
import Subcategorypage from './pages/Subcategory/Subcategorypage'
import Items from "./components/Items"
import ProductDetails from './components/ProductDetails'
import { CartProvider } from './context/CartContext'


function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path ="/register" element={<Register/>}/>
        <Route path ="/login" element={<Login/>}/>
        <Route path="/" element={<Home/>} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path = "/subCategory/:subCategory" element = {<Subcategorypage/>}/>
        <Route path = "/all-products" element={<Items/>}/>
        <Route path = "/products/:productId" element = {<ProductDetails/>}/>
        <Route path="/" element={<ProductList />} />
                <Route path="/cart" element={<CartPage userId="yourUserIdHere" />} />
        
      </Routes>
      </CartProvider>
    
  )
}

export default App
