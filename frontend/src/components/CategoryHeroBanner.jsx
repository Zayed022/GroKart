import React from "react";
import { Link } from "react-router-dom";

const CategoryHeroBanner = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  bgColor = "bg-teal-100",
  image,
}) => {
  return (
   <div
  className={`w-full md:w-1/2 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between ${bgColor} shadow-md min-h-[300px]`}
>

      {/* Text Content */}
      <div className="flex-1 text-left">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm md:text-base text-gray-700">{subtitle}</p>
        <Link to={ctaLink}>
         <button className="mt-4 px-4 py-2 bg-white text-gray-800 font-semibold rounded-lg shadow hover:bg-gray-100 hover:scale-105 transition-transform duration-300">
  {ctaText}
</button>

        </Link>
      </div>

      {/* Image */}
      <div className="flex-shrink-0 mt-4 md:mt-0 md:ml-6">
  <img
  src={image}
  alt={title}
  className="h-[220px] w-[220px] md:h-[240px] md:w-[240px] rounded-xl object-contain transition-transform duration-700 hover:scale-105"
/>


</div>


    </div>
  );
};

export default CategoryHeroBanner;
