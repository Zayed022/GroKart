import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import Navbar from "../components/Navbar";
import PaanCornerBanner from "../components/PaanCorner";
import FruitsBanner from "../components/Fruits&VegetablesBanner";
import MunchiesBanner from "../components/MunchiesBanner";
import BannersRow from "../components/Fruits&VegetablesBanner";
import BannerSecond from "../components/MunchiesBanner";

const Home = () => {
  const { getTotalQuantity } = useContext(CartContext);
  const totalQuantity = getTotalQuantity();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      {/* Responsive Navbar */}
      <Navbar/>
      
      

      {/* Content */}
      <Hero />

      <CsCards />
      
      <Footer />

    </>
  );
};

export default Home;
