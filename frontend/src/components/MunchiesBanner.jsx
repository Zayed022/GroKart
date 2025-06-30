import React from "react";
import CategoryHeroBanner from "./CategoryHeroBanner";
import paancorner from "../../public/paancorner.png";

const BannerSecond = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 px-4 py-6">
      <CategoryHeroBanner
        title="Paan & More"
        subtitle="Paan Corner & accessories"
        ctaText="Order Now"
        ctaLink="/subCategory/Fruits%20&%20Vegetables"
        image={paancorner}
        bgColor="bg-green-100"
      />

      
    </div>
  );
};

export default BannerSecond;
