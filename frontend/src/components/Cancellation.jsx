// src/pages/CancellationRefundPolicy.jsx
export default function CancellationRefundPolicy() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg border border-gray-200 p-8 sm:p-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Cancellation & Refund Policy
          </h1>
          <p className="text-sm text-gray-500 font-mono">Last updated on 29-04-2025 22:46:17</p>
        </header>

        <section className="prose prose-gray max-w-none leading-relaxed text-justify">
          <p>
            <strong>GROKART</strong> believes in helping its customers as far as possible and has therefore adopted a liberal cancellation policy. Please review the points below for details.
          </p>

          <ul className="list-disc list-inside space-y-3">
            <li>
              Cancellations will be considered only if the request is made immediately after placing the order. If the order has already been communicated to the vendors/merchants and the shipping process has begun, cancellation requests may not be accepted.
            </li>
            <li>
              Cancellation requests for perishable items such as flowers or eatables are not accepted. However, if the delivered product is of poor quality, a refund or replacement can be initiated after verification.
            </li>
            <li>
              If you receive damaged or defective items, please report the issue to our Customer Service team on the <strong>same day</strong> of receipt. The complaint will be entertained after internal verification by the merchant.
            </li>
            <li>
              If the product received is not as described or does not meet your expectations, you must inform our Customer Service on the <strong>same day</strong> of delivery. Our team will investigate and make a suitable decision.
            </li>
            <li>
              For products that come with a manufacturer's warranty, any issues should be directed to the manufacturer as per their policy.
            </li>
            <li>
              In case of any approved refunds by <strong>GROKART</strong>, the refund process will be completed within <strong>1-2 days</strong> and credited to the original payment method.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
