import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/v1/users/login",
        { email, password },
        { withCredentials: true }
      );
      if (data.success) {
        localStorage.setItem("token", data.token);
        navigate("/");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      alert("Invalid Credentials");
    }
  };
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4 flex justify-center items-center">
            Login
          </h2>
          {error && <p className="text-red-500">{error}</p>}
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
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </form>
          <p className=" flex justify-center items-center mt-3">
            Not registered?{" "}
            <Link to="/register" className="text-blue-700">
              {" "}
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
