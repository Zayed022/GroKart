import React from "react";

const AboutUs = () => {
  return (
    <section className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-50 py-20 px-6 sm:px-12 lg:px-24 flex items-center">
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-lg p-12 sm:p-16 text-gray-900 motion-safe:animate-fadeIn">
        <h1 className="text-5xl font-extrabold mb-10 text-center tracking-tight leading-tight text-indigo-900">
          About Us
        </h1>

        <p className="mb-8 text-lg leading-relaxed tracking-wide">
          Welcome to <strong className="text-indigo-700">GroKart</strong> — Bhiwandi’s very own quick commerce platform. We're a proudly homegrown startup dedicated to making daily essentials accessible, fast, and affordable for every household in the city.
        </p>

        <p className="mb-8 text-lg leading-relaxed tracking-wide">
          Our mission is simple:{" "}
          <strong className="text-indigo-600 underline decoration-indigo-300 decoration-2 underline-offset-4">
            serve our people better, faster, and smarter.
          </strong>{" "}
          In a market where big players haven’t stepped in yet, we’re filling that gap with passion and purpose.
        </p>

        <p className="mb-8 text-lg leading-relaxed tracking-wide">
          We don’t operate with a warehouse. Instead, we’ve built a hyperlocal model that assigns delivery partners to nearby stores they know well — ensuring ultra-fast delivery and cost-efficiency.
        </p>

        <p className="mb-8 text-lg leading-relaxed tracking-wide">
          We are 100% bootstrapped and focused on building a sustainable, value-driven business. Every order you place helps us grow and serve Bhiwandi better.
        </p>

        <div className="mb-10">
          <h2 className="text-3xl font-semibold mb-5 text-indigo-900 tracking-wide">
            Why choose us?
          </h2>
          <ul className="list-disc list-inside space-y-3 text-lg text-gray-700">
            <li className="hover:text-indigo-600 transition-colors duration-300 cursor-default">
              Fast delivery from nearby stores
            </li>
            <li className="hover:text-indigo-600 transition-colors duration-300 cursor-default">
              Handpicked product listings tailored for Bhiwandi
            </li>
            <li className="hover:text-indigo-600 transition-colors duration-300 cursor-default">
              Simple, user-friendly interface on both web and mobile
            </li>
            <li className="hover:text-indigo-600 transition-colors duration-300 cursor-default">
              Reliable support via email and mobile call
            </li>
          </ul>
        </div>

        <p className="text-lg leading-relaxed mb-12 tracking-wide">
          Thank you for supporting local innovation. We’re here to serve you, one delivery at a time.
        </p>

        <p className="text-lg font-semibold text-indigo-700 text-right tracking-wide">
          — Team GroKart
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
