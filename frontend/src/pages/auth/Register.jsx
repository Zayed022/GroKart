import React from 'react'
import { useState } from 'react'
import {useNavigate} from "react-router-dom"
import axios from "axios"
const Register = ()=>{
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword]= useState("");
    const [phone,setPhone] = useState("");
    const [error,setError] = useState("");
    const navigate = useNavigate();
    const handleRegister = async(e)=>{
        e.preventDefault();
        try {
            const {data} = await axios.post("/api/v1/users/register",{name,email,phone,password}, {withCredentials:true});
            if (data.success){
                navigate("/login");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed")
            
        }
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleRegister}>
              <input type="text" className="w-full p-2 border rounded mb-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="email" className="w-full p-2 border rounded mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="phone" className="w-full p-2 border rounded mb-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              <input type="password" className="w-full p-2 border rounded mb-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Register</button>
            </form>
          </div>
        </div>
      );
    
}

export default Register
