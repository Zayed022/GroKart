import React from "react";
import { useNavigate } from "react-router-dom";
import paan from "../../public/paan.png"; // Replace with actual path or use a public URL


const PaanCornerBanner = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/subCategory/Pan%20Corner");
  };

  return (
    <div
      onClick={handleClick}
      className="mx-4 mt-4 cursor-pointer rounded-3xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]"
    >
      <img
        src={paan}
        alt="Paan Corner Banner"
        className="w-full h-auto object-cover"
      />
    </div>
  );
};

export default PaanCornerBanner;
