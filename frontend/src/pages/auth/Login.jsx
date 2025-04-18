import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login button clicked!"); // Debugging
  
    setError("");
    setLoading(true);
  
    try {
      const { data } = await axios.post(
        "https://grokart-2.onrender.com/api/v1/users/login",  // Ensure correct API URL
        { email, password },
        { withCredentials: true }
      );
  
      console.log("API Full Response:", data); // Debugging
  
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user._id); 
        localStorage.setItem("email", data.user.email); 
        localStorage.setItem("user", JSON.stringify(data.user));  // ✅ Store full user

        console.log("Token Stored Successfully:", localStorage.getItem("token"));
        navigate("/");  // Redirect to home page
      } else {
        setError("Login failed: Token not received.");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data || error); 
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  
  
  
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            className="w-full p-2 border rounded mb-2"
            placeholder="Email"
            value={email}
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full p-2 border rounded mb-2"
            placeholder="Password"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center mt-3">
          Not registered?{" "}
          <Link to="/register" className="text-blue-700">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
