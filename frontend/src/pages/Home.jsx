import { useContext } from "react";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Search } from "lucide-react";
import Hero from "../components/Hero";
import Items from "../components/Items";
import CsCards from "../components/CsCards";
import { CartContext } from "../context/Cart";
import MinicategoryPage from "../components/MiniCategory";
import MiniCards from "../components/MiniCards";
import Footer from "../components/Footer";


const Home = () => {
  const { getTotalQuantity } = useContext(CartContext);
  const totalQuantity = getTotalQuantity();

  return (
    <>
      {/* Responsive Navbar */}
      <nav className="bg-violet-100 text-gray-800 shadow-sm px-6 py-3 sticky top-0 z-50">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">

    {/* Logo */}
    <Link to="/" className="text-2xl font-extrabold tracking-tight text-red-500">
      GroKart
    </Link>

    {/* Search Button */}
    <Link to="/all-products" className="w-full md:w-auto">
      <button className="w-full md:w-auto px-5 py-2 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition duration-200 shadow-sm">
        🔍 Search Product here
      </button>
    </Link>

    {/* Icons */}
    <div className="flex items-center gap-6">
      <Link to="/cart" className="relative">
        <ShoppingCartIcon className="w-7 h-7 text-gray-800" />
        {totalQuantity > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {totalQuantity}
          </span>
        )}
      </Link>

      <Link to="/login">
        <AccountCircleIcon className="w-7 h-7 text-gray-800" />
      </Link>
    </div>
  </div>
</nav>




      {/* Content */}
      <Hero />
      
      <CsCards />
      <Footer/>
      
    </>
  );
};

export default Home;
