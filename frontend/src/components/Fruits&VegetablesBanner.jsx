import React, { useEffect, useRef, useState } from "react";
import CategoryHeroBanner from "./CategoryHeroBanner";
import fruits from "../../public/fruits.png";
import munchies from "../../public/munchies.png";
import dairy from "../../public/dairy.png";
import paan from "../../public/paan.png";

const allBanners = [
  {
    title: "Fresh Fruits & Veggies",
    subtitle: "Farm-fresh produce delivered in minutes",
    ctaText: "Order Now",
    ctaLink: "/subCategory/Fruits%20&%20Vegetables",
    image: fruits,
    bgColor: "bg-green-100",
  },
  {
    title: "Tasty Munchies",
    subtitle: "Snacks to satisfy your cravings",
    ctaText: "Order Now",
    ctaLink: "/subCategory/Munchies",
    image: munchies,
    bgColor: "bg-yellow-100",
  },
  {
    title: "Dairy, Breads & Eggs",
    subtitle: "Essential breakfast staples & dairy",
    ctaText: "Order Now",
    ctaLink: "/subCategory/Dairy, Bread & Eggs",
    image: dairy,
    bgColor: "bg-blue-100",
  },
  {
    title: "Quick Snacks",
    subtitle: "Grab-and-go treats, ready anytime",
    ctaText: "Shop Now",
    ctaLink: "/subCategory/Snacks",
    image: dairy,
    bgColor: "bg-pink-100",
  },
  {
    title: "Paan Corner",
    subtitle: "Have your favourite post-meal accessories",
    ctaText: "Shop Now",
    ctaLink: "/subCategory/Pan & More",
    image: paan,
    bgColor: "bg-violet-100",
  },
];

const BannersRow = () => {
  const [index, setIndex] = useState(0);
  const carouselRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        carouselRef.current.style.transition = "transform 0.8s ease-in-out";
        carouselRef.current.style.transform = "translateX(-33.3333%)";
      }

      setTimeout(() => {
        setIndex((prev) => (prev + 1) % allBanners.length);
        if (carouselRef.current) {
          carouselRef.current.style.transition = "none";
          carouselRef.current.style.transform = "translateX(0)";
        }
      }, 800);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const getSlidingBanners = () => {
    const banners = [];
    for (let i = 0; i < 4; i++) {
      banners.push(allBanners[(index + i) % allBanners.length]);
    }
    return banners;
  };

  return (
    <div className="relative w-full overflow-hidden px-4 py-6">
  <div className="w-full overflow-hidden">
    <div
      ref={carouselRef}
      className="flex w-[133.3333%] gap-1 transition-transform"
      style={{ transform: "translateX(0)" }}
    >
      {getSlidingBanners().map((banner, i) => (
        <div key={i} className="w-1/3 flex-shrink-0">
          <CategoryHeroBanner
            title={banner.title}
            subtitle={banner.subtitle}
            ctaText={banner.ctaText}
            ctaLink={banner.ctaLink}
            image={banner.image}
            bgColor={banner.bgColor}
          />
        </div>
      ))}
    </div>
  </div>
</div>

  );
};

export default BannersRow;
