import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import Home from './pages/Home'
import CategoryPage from './pages/categoryPage'
import Categories from './pages/categories/Categories'


function App() {
  return (
    
      <Routes>
        <Route path ="/register" element={<Register/>}/>
        <Route path ="/login" element={<Login/>}/>
        <Route path="/" element={<Home/>} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path = "/category" element={<Categories/>}/>
      </Routes>
    
  )
}

export default App
