import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { FaMoon, FaSun } from 'react-icons/fa';

const Register = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        'https://grokart-2.onrender.com/api/v1/users/register',
        form,
        { withCredentials: true }
      );
      if (data.success) {
        toast.success('Registration successful');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition duration-300">
        <Toaster />

        {/* Left Section */}
        <div className="w-1/2 bg-green-50 dark:bg-gray-800 hidden md:flex flex-col justify-center items-center">
          <h1 className="text-2xl font-semibold text-green-700 mb-4">
            ⚡ 15-Min Delivery on All Orders
          </h1>
          <img
            src="/Delivery.svg" // replace with your image path
            alt="Illustration"
            className="w-2/3 h-30"
          />
        </div>

        {/* Right Section */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute top-5 right-6 p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-xl shadow"
            title="Toggle Theme"
          >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
              Create Your Account 👋
            </h2>

            <form onSubmit={handleRegister} className="space-y-5">
              {['name', 'email', 'phone', 'password'].map((field, idx) => (
                <div key={idx}>
                  <label className="block mb-1 text-gray-700 font-medium capitalize">
                    {field}
                  </label>
                  <input
                    type={field === 'password' ? 'password' : field === 'email' ? 'email' : 'text'}
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    required
                    placeholder={
                      field === 'email'
                        ? 'you@example.com'
                        : field === 'password'
                        ? 'Enter password'
                        : `Enter ${field}`
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                    autoComplete="off"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
              >
                Register
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
