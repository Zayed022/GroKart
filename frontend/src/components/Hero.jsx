import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold">Welcome to Grokart</h1>
          <p className="py-6">
            Get your groceries delivered in minutes!
          </p>
          <button className="btn btn-primary">Shop now</button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
