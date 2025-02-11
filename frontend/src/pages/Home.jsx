import { Link } from "react-router-dom";
import CustomizedInputBase from "../components/Search";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Hero from "../components/Hero";
import Categories from "../components/Category";


import Categorycards from "../components/categoryCards";
import Homecategory from "../components/Homecategory";

const Home = () => {
  return (
    <>
    <div>
      {/* Navbar */}
      <nav className="bg-blue-300 text-white p-2 flex justify-between">
        <h1 className="text-xl font-bold align-item-center justify-center mt-0.5 md: mr-5">GroKart</h1>
       <CustomizedInputBase className="md: width-200 ml-5"/>
        <div className="flex justify-center item-center mr-12 mt-0.5 md: flex ">
          <ShoppingCartIcon className="mr-10 ml-10 mt-0.5 "/>
          <Link to="/login"><AccountCircleIcon className="mr-5"/></Link>
        </div>
      </nav>
    </div>
      
      {/* Hero Section */}
      <Hero/>
      
      {/* Product Categories */}
      {/*
      <section className="p-8 text-center">
        <h3 className="text-2xl font-semibold">Shop by Category</h3>
        <div className="flex justify-center gap-6 mt-6">
          <div className="bg-white shadow-md p-4 rounded-lg w-40">
            <p className="font-bold">Vegetables</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg w-40">
            <p className="font-bold">Fruits</p>
          </div>
          <div className="bg-white shadow-md p-4 rounded-lg w-40">
            <p className="font-bold">Dairy</p>
          </div>
        </div>
      </section>
      */}
      <Homecategory/>
      <Categories/>
      <Categorycards/>
      <subCategory/>
    
    </>
  );
};

export default Home;
