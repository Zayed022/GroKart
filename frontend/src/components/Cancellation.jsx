// src/pages/CancellationRefundPolicy.jsx
export default function CancellationRefundPolicy() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-xl border border-gray-200 p-8 sm:p-12">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">Cancellation & Refund Policy</h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated on <time dateTime="2025-04-29T22:46:17">29-Apr-2025 at 10:46 PM</time>
          </p>
        </header>

        <section className="prose prose-gray max-w-none leading-relaxed text-justify">
          <p>
            At <strong>Grokart</strong>, we strive to provide the best customer experience. If you’re not fully satisfied with your order or need to cancel it, please review our policy below.
          </p>

          <ul className="list-disc list-inside space-y-4">
            <li>
              <strong>Order Cancellation:</strong> You may cancel your order immediately after placing it. Once the order is confirmed and processing begins, cancellation requests may not be accepted.
            </li>

            <li>
              <strong>Perishable Goods:</strong> Orders for perishable items (e.g., groceries or eatables) cannot be canceled after confirmation. If the product is spoiled or of poor quality, you may request a refund or replacement upon verification.
            </li>

            <li>
              <strong>Damaged or Defective Items:</strong> If any product arrives damaged or defective, please contact our customer support team on the <strong>same day</strong> of delivery for prompt resolution.
            </li>

            <li>
              <strong>Incorrect or Unsatisfactory Products:</strong> If the delivered item doesn't match its description or doesn’t meet your expectations, report it to our team on the <strong>same day</strong>. We'll investigate and take appropriate action.
            </li>

            <li>
              <strong>Manufacturer Warranty:</strong> Products covered under manufacturer warranties should be addressed directly with the manufacturer as per their policy.
            </li>

            <li>
              <strong>Refund Timeline:</strong> Approved refunds will be processed within <strong>1–2 business days</strong> and credited to your original payment method.
            </li>
            <p className="text-sm text-gray-400 mt-6">
  GroKart reserves the right to update or modify this policy at any time without prior notice. For any questions or concerns, please contact us at <a href="mailto:support@grokart.in" className="text-blue-500 underline">grokart.co@gmail.com</a>.
</p>

          </ul>
        </section>
      </div>
    </main>
  );
}
