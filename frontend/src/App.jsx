import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'


function App() {
  return (
    
      <Routes>
        <Route path ="/register" element={<Register/>}/>
        <Route path ="/login" element={<Login/>}/>
        <Route path="/" element={<h1 className="text-center mt-10">Home Page</h1>} />
      </Routes>
    
  )
}

export default App
