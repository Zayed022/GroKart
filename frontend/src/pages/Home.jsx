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
import Navbar from "../components/Navbar";

const Home = () => {
  const { getTotalQuantity } = useContext(CartContext);
  const totalQuantity = getTotalQuantity();

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
