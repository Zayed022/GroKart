import { useState } from "react";
import { Link } from "react-router-dom";
import CustomizedInputBase from "../components/Search";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Hero from "../components/Hero";
import Items from "../components/Items";
import CsCards from "../components/CsCards";

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
                    <Link to="/cart">
                        <ShoppingCartIcon className="mr-5 ml-4"/>
                    </Link>
                    
                    <Link to="/login">
                        <AccountCircleIcon className="mr-4" />
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <Hero />
            <Items />
            <CsCards />

            {/* Floating Cart Sidebar */}
            
        </>
    );
};

export default Home;
