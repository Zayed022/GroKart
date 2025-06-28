import React from "react";
import CategoryHeroBanner from "./CategoryHeroBanner";
import fruits from "../../public/fruits.png";
import munchies from "../../public/munchies.png";
import dairy from "../../public/dairy.png";

const BannersRow = () => {
  return (
    <div className="flex flex-col md:flex-row gap-6 px-4 py-6">
      <CategoryHeroBanner
        title="Fresh Fruits & Veggies"
        subtitle="Farm-fresh produce delivered in minutes"
        ctaText="Order Now"
        ctaLink="/subCategory/Fruits%20&%20Vegetables"
        image={fruits}
        bgColor="bg-green-100"
      />

      <CategoryHeroBanner
        title="Tasty Munchies"
        subtitle="Snacks to satisfy your cravings"
        ctaText="Order Now"
        ctaLink="/subCategory/Munchies"
        image={munchies}
        bgColor="bg-yellow-100"
      />

      <CategoryHeroBanner
        title="Dairy, Breads & Eggs"
        subtitle="Snacks to satisfy your cravings"
        ctaText="Order Now"
        ctaLink="/subCategory/Dairy, Bread & Eggs"
        image={dairy}
        bgColor="bg-blue-100"
      />
    </div>
  );
};

export default BannersRow;
