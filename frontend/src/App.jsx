import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Home from './pages/Home'
import CategoryPage from './pages/categoryPage'
import Subcategorypage from './pages/Subcategory/Subcategorypage'
import Items from "./components/Items"


function App() {
  return (
    
      <Routes>
        <Route path ="/register" element={<Register/>}/>
        <Route path ="/login" element={<Login/>}/>
        <Route path="/" element={<Home/>} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path = "/subCategory/:subCategory" element = {<Subcategorypage/>}/>
        <Route path = "/all-products" element={<Items/>}/>
        
      </Routes>
    
  )
}

export default App
