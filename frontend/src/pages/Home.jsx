import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SearchIcon from "@mui/icons-material/Search";
import Hero from "../components/Hero";
import Items from "../components/Items";
import CsCards from "../components/CsCards";
import { Search } from "lucide-react";
import { CartContext } from "../context/Cart";

const Home = () => {
  const { getTotalQuantity } = useContext(CartContext); // Get total quantity from context
  const totalQuantity = getTotalQuantity();
  return (
    <>
      {/* Responsive Navbar */}
      <nav className="bg-blue-300 text-white p-2 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-2 md:mb-0">
          <h1 className="text-xl font-bold md:mr-5">GroKart</h1>
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="relative mr-3 md:mr-10 ml-10">
              <ShoppingCartIcon className="w-8 h-8 text-black" />

              {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Link>
            <Link to="/login">
              <AccountCircleIcon className="mr-5 ml-5" />
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <Link to="/all-products">
          <div className="relative w-full md:w-1/3 flex items-center bg-white rounded-full border border-gray-300 shadow-sm">
            <Search className="absolute left-3 text-gray-500" size={20} />
            <input
              className="pl-10 pr-4 py-2 w-full md:w-96 lg:w-[400px] xl:w-[500px] 
             rounded-full text-gray-900 focus:outline-none 
             border border-gray-300 shadow-sm"
              type="text"
              placeholder="Search for products..."
            />
            <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all">
              Search
            </button>
          </div>
        </Link>

        <div className="hidden md:flex items-center">
          <Link to="/cart" className="mr-10 ">
            <ShoppingCartIcon />
          </Link>
          <Link to="/login" className="mr-10">
            <AccountCircleIcon />
          </Link>
        </div>
      </nav>

      <>
        <Hero />
        <Items />
        <CsCards />
      </>
    </>
  );
};

// Sample products for testing (Replace with API data)

export default Home;
