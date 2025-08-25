import React from "react";

const AboutUs = () => {
  return (
    <section className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-50 py-20 px-6 sm:px-12 lg:px-24 flex items-center">
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-12 sm:p-16 text-gray-900 motion-safe:animate-fadeIn">
        <h1 className="text-5xl font-extrabold mb-10 text-center tracking-tight leading-tight text-indigo-900">
          About GroKart
        </h1>

        {/* Mission */}
        <p className="mb-6 text-lg leading-relaxed tracking-wide">
          <strong className="text-indigo-700">GroKart</strong> is Bhiwandi’s very own <strong>15-minute grocery delivery</strong> app. Born from a desire to make essentials faster and easier to get, our mission is to{" "}
          <strong className="text-indigo-600 underline decoration-indigo-300 decoration-2 underline-offset-4">
            empower local communities with the convenience they deserve.
          </strong>
        </p>

        {/* What makes GroKart different */}
        <p className="mb-6 text-lg leading-relaxed tracking-wide">
          We don’t operate from warehouses — instead, we’ve partnered with local stores in your neighborhood. Every time you order, you're supporting multiple small businesses across Bhiwandi while enjoying doorstep delivery in minutes.
        </p>

        {/* Founders & story */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-indigo-900">Our Story</h2>
          <p className="text-lg text-gray-800 leading-relaxed mb-4">
            GroKart started as a passion project by <strong>Mohd Zayed Ansari</strong>, a local computer engineer and entrepreneur, who saw the need for a faster, hyperlocal delivery solution during the pandemic. With no outside funding and just a small team of tech and delivery enthusiasts, GroKart was launched to serve Bhiwandi — and only Bhiwandi — with care and precision.
          </p>
        </div>

        {/* Unique Features */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-indigo-900">What Sets Us Apart</h2>
          <ul className="list-disc list-inside space-y-3 text-lg text-gray-700">
            <li>🚀 15-minute delivery from trusted neighborhood stores</li>
            <li>📱 Seamless experience on both web and mobile</li>
            <li>🛵 Delivery partners familiar with your area</li>
            <li>🔒 Secure payments & responsive customer support</li>
            <li>🌱 100% bootstrapped and sustainable</li>
          </ul>
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6 text-indigo-900">What Our Users Say</h2>
          <div className="space-y-6">
            <blockquote className="border-l-4 pl-4 italic text-gray-700 text-lg">
              “Grokart is a blessing! No more waiting or calling stores. I order in 2 taps and it arrives in 10–15 minutes.”
              <br />
              <span className="block text-sm mt-2 font-semibold text-indigo-600">— Ayesha S., Fatima Nagar</span>
            </blockquote>
            <blockquote className="border-l-4 pl-4 italic text-gray-700 text-lg">
              “Never imagined local deliveries could be this fast. This is what Bhiwandi needed!”
              <br />
              <span className="block text-sm mt-2 font-semibold text-indigo-600">— Rahul D., Kalyan Road</span>
            </blockquote>
          </div>
        </div>

        {/* Press mentions (optional future section) */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-indigo-900">In The Press</h2>
          <p className="text-gray-600 text-lg">Coming soon — we’re catching eyes across Maharashtra 🚀</p>
        </div>

        {/* Final note */}
        <p className="text-lg leading-relaxed mb-8 tracking-wide">
          Thank you for supporting local innovation. Every order you place helps us grow and deliver better — not just groceries, but real change in how Bhiwandi shops.
        </p>

        <p className="text-lg font-semibold text-indigo-700 text-right tracking-wide">
          — Team GroKart
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
