import { useState } from "react";
import { Link } from "react-router-dom";
import CustomizedInputBase from "../components/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Hero from "../components/Hero";
import Items from "../components/Items";
import CsCards from "../components/CsCards";
import CartSidebar from "../components/CartSidebar"; // Import Cart Sidebar

const Home = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);

    return (
        <>
            {/* Navbar */}
            <nav className="bg-blue-300 text-white p-2 flex justify-between">
                <h1 className="text-xl font-bold align-item-center justify-center mt-0.5 md:mr-5">
                    GroKart
                </h1>
                <CustomizedInputBase className="md: width-200 ml-5" />
                <div className="flex justify-center items-center mr-12 mt-0.5">
                    {/* Clicking Cart Icon Toggles Sidebar */}
                    <ShoppingCartIcon
                        className="mr-10 ml-10 mt-0.5 cursor-pointer"
                        onClick={() => setIsCartOpen(true)}
                    />
                    <Link to="/login">
                        <AccountCircleIcon className="mr-5" />
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <Hero />
            <Items />
            <CsCards />

            {/* Floating Cart Sidebar */}
            <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};

export default Home;
