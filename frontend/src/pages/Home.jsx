import { useContext } from "react";
import { Link } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Search } from "lucide-react";
import Hero from "../components/Hero";
import Items from "../components/Items";
import CsCards from "../components/CsCards";
import { CartContext } from "../context/Cart";


const Home = () => {
  const { getTotalQuantity } = useContext(CartContext);
  const totalQuantity = getTotalQuantity();

  return (
    <>
      {/* Responsive Navbar */}
      <nav className="bg-blue-300 text-white p-3 flex flex-col md:flex-row justify-between items-center shadow-md">
        <div className="flex justify-center items-center w-full md:w-auto items-center justify-center">
          <h1 className="text-xl font-bold">GroKart</h1>
        </div>

        {/* Search Bar */}
        <Link to = "/all-products">
        
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all ml-2">
            Search Product here
          </button>
        
        </Link>
        
        
        
        

        {/* Icons */}
        <div className="flex items-center gap-6 mt-2 md:mt-0">
          <Link to="/cart" className="relative">
            <ShoppingCartIcon className="w-8 h-8 text-black" />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </Link>
          <Link to="/login">
            <AccountCircleIcon className="w-8 h-8 text-black" />
          </Link>
        </div>
      </nav>

      {/* Content */}
      <Hero />
      
      <CsCards />
    </>
  );
};

export default Home;
