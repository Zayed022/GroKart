import React from "react";
import { Gift } from "lucide-react";
import Navbar from "./Navbar";

const EGiftCard = () => {
  return (
    <>
    <Navbar/>
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <Gift className="w-12 h-12 text-gray-500 mb-4" />
      <h2 className="text-xl font-semibold text-gray-800 mb-2">No Gift Card to show here!</h2>
      <p className="text-sm text-gray-600 max-w-sm">
        It looks like you haven’t received or added any gift cards yet. Gift cards you receive will be listed here.
      </p>
    </div>
    </>
  );
};

export default EGiftCard;
