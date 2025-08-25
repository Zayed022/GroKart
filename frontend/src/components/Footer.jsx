import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaPhoneAlt,
    FaEnvelope
  } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import GBR from "../../public/GBR.png"
  
  const Footer = () => {
    return (
      <footer className="bg-[#0e1015] text-white pt-12 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">
          
          {/* Brand & Tagline */}
          <div className="col-span-1 md:col-span-2">
            <Link to = "/">
              <img className="h-10 w-30 mb-2" src={GBR} alt="" />
            </Link>
           
            <p className="text-sm text-gray-400 mb-4">
              Delivering groceries to Bhiwandi in 15 minutes.
            </p>
            {/* Store Links */}
            <div className="flex items-center gap-3 mt-3">
              <a href="https://play.google.com/store/apps/details?id=com.grokart.app&pcampaignid=web_share">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="w-32" />
              </a>
             
            </div>
          </div>
  
          {/* Navigation */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Navigation</h2>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/offers" className="hover:text-white">Offers</a></li>
              <Link to = 'about'><p className="hover:text-white">About Us</p></Link>
            </ul>
          </div>
  
          {/* Help */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Help</h2>
            <div className="space-y-2 text-sm text-gray-300">
              <Link to = 'contact-us'><p  className="hover:text-white">Help Center</p></Link>
              <Link to = 'policy'><p  className="hover:text-white">Privacy Policy</p></Link>
              <Link to = '/terms-conditions'> <p className="hover:text-white">Terms & Conditions</p></Link>
              <Link to = 'cancellation'><p  className="hover:text-white">Cancellation & Refund Policy</p></Link>
            </div>
          </div>
  
          {/* Contact */}
          <div>
            <Link to = 'contact-us'> <h2 className="text-lg font-semibold mb-3">Contact Us</h2></Link>
           
            <div className="text-sm text-gray-300 space-y-2">
              <Link to = 'contact-us'><p>Contact Us</p></Link>
              
              <p className="flex items-center gap-2">
                <FaEnvelope className="text-red-500" /> grokart.co@gmail.com
              </p>
              <p className="flex items-center gap-2">
                <FaPhoneAlt className="text-red-500" /> +91 7498881947
              </p>
              <div className="flex items-center gap-4 mt-4">
                <a href="#" className="hover:text-white"><FaFacebookF /></a>
                <a href="#" className="hover:text-white"><FaInstagram /></a>
                <a href="#" className="hover:text-white"><FaTwitter /></a>
              </div>
            </div>
          </div>
        </div>
  
        {/* Bottom Copy */}
        <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-700 pt-5">
          © {new Date().getFullYear()} GroKart. All rights reserved.
        </div>
      </footer>
    );
  };
  
  export default Footer;
  