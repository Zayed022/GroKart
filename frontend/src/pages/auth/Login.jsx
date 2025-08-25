import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FaMoon, FaSun } from "react-icons/fa";

const USPs = [
  "⚡ 15-Min Delivery on All Orders",
  "💸 No Delivery Charges on Orders Above ₹149",
  "🛒 Fresh Stock Daily",
  "📦 Live Order Tracking",
  "🔒 Safe & Secure Payments"
];

const Login = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        "https://grokart-2.onrender.com/api/v1/users/login",
        { email, password },
        { withCredentials: true }
      );

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        setError("Login failed: Token not received.");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      console.log("Google Login Success:", credentialResponse);

      const response = await axios.post(
        "https://grokart-2.onrender.com/api/v1/users/google-login",
        { token: credentialResponse.credential },
        { withCredentials: true }
      );

      console.log("Server response:", response.data);

      // Store user info if needed
      if (response.data.token) {
  localStorage.setItem("user", JSON.stringify(response.data.user));
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("userId", response.data.user._id);
  localStorage.setItem("email", response.data.user.email);
  navigate("/");
} else {
  setError("Login failed: No token received.");
}

    } catch (error) {
      console.error("Google login failed:", error);
      setError("Google login failed. Please try again.");
    }
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-gray-900 transition duration-300">
        {/* Left Side: USP Carousel */}
        <div className="hidden md:flex flex-col items-center justify-center bg-green-50 dark:bg-gray-800">
          <Swiper autoplay={{ delay: 2000 }} loop className="w-4/5 max-w-md">
            {USPs.map((usp, i) => (
              <SwiperSlide key={i}>
                <div className="text-center text-xl font-semibold text-green-700 dark:text-white p-6">
                  {usp}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <img
            src="/Groceries.svg"
            alt="Delivery Illustration"
            className="w-2/3 h-1/2 mt-6 drop-shadow-lg"
          />
        </div>

        {/* Right Side: Login Form */}
        <div className="flex flex-col items-center justify-center px-6 py-10 md:px-16 relative">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute top-5 right-6 p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-xl shadow"
            title="Toggle Theme"
          >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
          </button>

          <div className="w-full max-w-md bg-white/30 dark:bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              Welcome Back 👋
            </h1>

            {error && (
              <p className="text-sm text-red-500 text-center mb-4">{error}</p>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition font-semibold disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google login failed")}
              />
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-400 mt-5 text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-green-600 dark:text-green-400 hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
