// src/pages/TermsAndConditions.jsx
export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl border border-gray-200 p-8 sm:p-12">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated on <time dateTime="2025-04-29T22:42:10">29-Apr-2025 at 10:42 PM</time>
          </p>
        </header>

        <section className="prose prose-gray max-w-none leading-relaxed text-justify text-gray-700">
          <p>
            These Terms and Conditions, along with our Privacy Policy and any other applicable terms ("Terms"), form a legally binding agreement between <strong>Grokart</strong> ("we", "us", or "our") and you ("you" or "your") regarding your use of our website and services.
          </p>

          <p>
            By accessing our website or using any of our services, you acknowledge that you have read, understood, and agree to be bound by these Terms. If you do not agree, please do not access or use our services.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6">Key Terms of Use</h3>
          <ul className="list-disc list-inside space-y-3">
            <li>
              You agree to provide accurate, complete, and updated information when registering or transacting with us.
            </li>
            <li>
              You are responsible for maintaining the confidentiality of your account information and for all activities under your account.
            </li>
            <li>
              We make no guarantees regarding the accuracy or reliability of information provided on the site. Use of the Services is at your own risk.
            </li>
            <li>
              All content, branding, and services are protected by copyright and intellectual property laws. You may not copy, reproduce, or misuse any content.
            </li>
            <li>
              Unauthorized or fraudulent use of our website or services may result in legal action.
            </li>
            <li>
              You agree to pay for all products and services purchased through our platform.
            </li>
            <li>
              You agree not to use our services for illegal or unauthorized purposes.
            </li>
            <li>
              External links on our website are for convenience and we are not responsible for the content or policies of third-party sites.
            </li>
            <li>
              Any order or service initiated by you constitutes a binding agreement to purchase under applicable terms.
            </li>
            <li>
              Refunds will be processed in accordance with our refund policy, and claims made after the allowed period may not be honored.
            </li>
            <li>
              We are not liable for delays or failures caused by events beyond our control (force majeure).
            </li>
            <li>
              These Terms are governed by Indian law. All disputes will be subject to the jurisdiction of courts in Bhiwandi, Maharashtra.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mt-6">Changes to These Terms</h3>
          <p>
            We reserve the right to modify or update these Terms at any time. Updates will be posted on this page, and continued use of our services implies your acceptance of the revised terms.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mt-6">Contact Us</h3>
          <p>
            If you have any questions or concerns regarding these Terms, you can contact us via email at{" "}
            <a
              href="mailto:support@grokart.in"
              className="text-indigo-600 underline hover:text-indigo-800"
            >
              grokart.co@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
