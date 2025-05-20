// src/pages/ContactUs.jsx
export default function ContactUs() {
  return (
    <section className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-50 py-16 px-6 sm:px-12 md:px-20 flex items-center">
      <div className="max-w-3xl w-full mx-auto bg-white rounded-3xl shadow-lg p-10 sm:p-16">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-4 text-center tracking-tight">
          Contact Us
        </h1>
        <p className="text-sm text-gray-500 mb-10 text-center">
          Last updated on <time dateTime="2025-04-29T22:37:13">29-04-2025 22:37:13</time>
        </p>

        <div className="space-y-8 text-gray-700">
          <ContactItem label="Merchant Legal Entity Name" value="MOHD ZAYED MOHD SALIM ANSARI" />
          <ContactItem
            label="Registered Address"
            value="1396, Naigaon Road, Behind Rafey Medical, Bhiwandi, Maharashtra, PIN: 421302"
          />
          <ContactItem
            label="Operational Address"
            value="1396, Naigaon Road, Behind Rafey Medical, Bhiwandi, Maharashtra, PIN: 421302"
          />
          <ContactItem label="Telephone No" value="+91 74988 81947" />
          <ContactItem
            label="Email"
            value={
              <a
                href="mailto:zayedans022@gmail.com"
                className="text-indigo-600 underline hover:text-indigo-800 transition-colors duration-300"
                aria-label="Send email to zayedans022@gmail.com"
              >
                zayedans022@gmail.com
              </a>
            }
          />
        </div>
      </div>
    </section>
  );
}

function ContactItem({ label, value }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-indigo-800 mb-1">{label}:</h2>
      <p className="text-lg leading-relaxed">{value}</p>
    </div>
  );
}
