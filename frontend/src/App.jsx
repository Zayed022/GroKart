import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Home from './pages/Home'
import CategoryPage from './pages/categoryPage'
import Subcategorypage from './pages/Subcategory/Subcategorypage'



function App() {
  return (
    
      <Routes>
        <Route path ="/register" element={<Register/>}/>
        <Route path ="/login" element={<Login/>}/>
        <Route path="/" element={<Home/>} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path = "/subCategory/:subCategory" element = {<Subcategorypage/>}/>
      </Routes>
    
  )
}

export default App
