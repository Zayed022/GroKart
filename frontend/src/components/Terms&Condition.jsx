// src/pages/TermsAndConditions.jsx
export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg border border-gray-200 p-8 sm:p-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-500 font-mono">Last updated on 29-04-2025 22:42:10</p>
        </header>

        <section className="prose prose-gray max-w-none leading-relaxed text-justify">
          <p>
            These Terms and Conditions, along with our privacy policy and other applicable terms (“Terms”), constitute a binding agreement between{' '}
            <strong>GROKART</strong> ( “we”, “us”, or “our”) and you (“you” or “your”), regarding your use of our website, products, or services (collectively, “Services”).
          </p>

          <p>
            By accessing our website or using the Services, you confirm that you have read and agree to these Terms. We may update these Terms at any time without prior notice. It is your responsibility to review them periodically.
          </p>

          <ul className="list-disc list-inside space-y-3">
            <li>
              You agree to provide accurate, complete, and up-to-date information during registration and use of our Services. You are responsible for all actions under your account.
            </li>
            <li>
              We do not guarantee the accuracy, timeliness, or completeness of the content provided. Use of the Services and website is at your own risk.
            </li>
            <li>
              All website and Services content is proprietary. You may not claim ownership or intellectual property rights.
            </li>
            <li>
              Unauthorized use of the Services or website may lead to legal action under these Terms or applicable laws.
            </li>
            <li>
              You agree to pay the applicable charges associated with the Services you avail.
            </li>
            <li>
              You must not use the Services for any unlawful or unauthorized purposes under Indian or local laws.
            </li>
            <li>
              External links on our website may direct you to third-party websites governed by their own terms and privacy policies.
            </li>
            <li>
              By initiating a transaction, you agree to form a legally binding agreement with us for the Services.
            </li>
            <li>
              You are entitled to a refund if we are unable to deliver the promised Service. Refund timelines depend on the service-specific policy or our general refund policy. Claims not made within the specified time will be invalid.
            </li>
            <li>
              We are not liable for any delays or failures in performance caused by events beyond our control (force majeure).
            </li>
            <li>
              These Terms are governed by Indian law. All disputes shall be resolved in the courts of Bhiwandi, Maharashtra.
            </li>
            <li>
              For any concerns or communications regarding these Terms, please contact us using the details provided on this website.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
