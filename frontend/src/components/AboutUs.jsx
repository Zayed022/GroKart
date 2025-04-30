import React from 'react';

const AboutUs = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>

      <p className="mb-4 text-lg">
        Welcome to <strong>GroKart</strong> — Bhiwandi’s very own quick commerce platform. We're a proudly homegrown startup dedicated to making daily essentials accessible, fast, and affordable for every household in the city.
      </p>

      <p className="mb-4 text-lg">
        Our mission is simple: <strong>serve our people better, faster, and smarter.</strong> In a market where big players like Zepto and Blinkit haven’t stepped in yet, we’re filling that gap with passion and purpose.
      </p>

      <p className="mb-4 text-lg">
        We don’t operate with a warehouse. Instead, we’ve built a hyperlocal model that assigns delivery partners to nearby stores they know well—ensuring ultra-fast delivery and cost-efficiency.
      </p>

      <p className="mb-4 text-lg">
        We are 100% bootstrapped and focused on building a sustainable, value-driven business. Every order you place helps us grow and serve Bhiwandi better.
      </p>

      <p className="mb-4 text-lg">
        <strong>Why choose us?</strong>
        <ul className="list-disc pl-6 mt-2">
          <li>Fast delivery from nearby stores</li>
          <li>Handpicked product listings based on Bhiwandi's needs</li>
          <li>Simple interface on web & mobile</li>
          <li>Support via email and mobile call</li>
        </ul>
      </p>

      <p className="mt-6 text-lg">
        Thank you for supporting local innovation. We’re here to serve you, one delivery at a time.
      </p>

      <p className="mt-4 font-semibold">— Team GroKart</p>
    </div>
  );
};

export default AboutUs;
