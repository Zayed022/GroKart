import React from 'react';

export default function PrivacyPolicy() {
  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6 sm:px-12 md:px-20 flex justify-center">
      <article className="max-w-4xl w-full bg-white rounded-3xl shadow-lg p-12 sm:p-16 text-gray-800">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-indigo-900 mb-2 tracking-tight">
            Privacy Policy
          </h1>
          <time
            className="text-sm text-gray-500"
            dateTime="2025-04-29T22:50:00"
            aria-label="Last updated on April 29, 2025 at 22:50"
          >
            Last updated on 29-04-2025 22:50:00
          </time>
        </header>

        <section className="space-y-8 leading-relaxed text-lg">
          <p>
            This Privacy Policy outlines how <strong>GROKART</strong> ("we", "us", or "our") collects, uses, discloses, and protects your personal information when you use our website and services.
          </p>

          <PolicySection
            number="1"
            title="Information We Collect"
            items={[
              'Personal details (name, email, phone number, address) provided during registration or checkout.',
              'Payment information processed via secure payment gateways like Razorpay.',
              'Usage data such as IP address, browser type, access time, and device identifiers.',
            ]}
          />

          <PolicySection
            number="2"
            title="How We Use Your Information"
            items={[
              'To process orders and transactions.',
              'To deliver products and provide customer support.',
              'To enhance user experience and website functionality.',
              'To comply with legal obligations.',
            ]}
          />

          <div>
            <h2 className="text-2xl font-semibold text-indigo-800 mb-3">3. Data Sharing</h2>
            <p className="mb-4">
              We do not sell your personal data. However, we may share your information with:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Payment processors (e.g., Razorpay) for transaction processing.</li>
              <li>Delivery partners for order fulfillment.</li>
              <li>Law enforcement or regulatory authorities as required by law.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-800 mb-3">4. Data Security</h2>
            <p>
              We implement standard security measures to protect your information. However, no online platform can guarantee complete security.
            </p>
          </div>

          <PolicySection
            number="5"
            title="Your Rights"
            items={[
              'You can request to access, update, or delete your personal data by contacting us.',
              'You may opt out of marketing communications at any time.',
            ]}
          />

          <div>
            <h2 className="text-2xl font-semibold text-indigo-800 mb-3">6. Cookies</h2>
            <p>
              We use cookies to improve website performance and personalize your experience. You can manage cookie preferences in your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-800 mb-3">7. Third-party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for their privacy practices.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-800 mb-3">8. Updates to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. Please review it regularly to stay informed.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-indigo-800 mb-3">9. Contact Us</h2>
            <address className="not-italic space-y-2 text-gray-700 text-lg">
              <p>
                For any questions or concerns, contact us at:
              </p>
              <p>
                <strong>Phone:</strong>{' '}
                <a href="tel:+917498881947" className="text-indigo-600 underline hover:text-indigo-800 transition-colors">
                  +91 74988 81947
                </a>
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:zayedans022@gmail.com" className="text-indigo-600 underline hover:text-indigo-800 transition-colors">
                  zayedans022@gmail.com
                </a>
              </p>
              <p>
                <strong>Address:</strong><br />
                1396, Naigaon Road, Behind Rafey Medical,<br />
                Bhiwandi, Maharashtra, PIN: 421302
              </p>
            </address>
          </div>
        </section>
      </article>
    </section>
  );
}

function PolicySection({ number, title, items }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-indigo-800 mb-3">{number}. {title}</h2>
      <ul className="list-disc list-inside space-y-1 text-gray-700 text-lg">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
