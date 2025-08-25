// src/pages/ContactUs.jsx
import {
  Mail,
  MapPin,
  Phone,
  Building2,
  BadgeInfo,
} from "lucide-react";

export default function ContactUs() {
  return (
    <section className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-indigo-50 py-16 px-4 sm:px-8 md:px-20 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl p-8 sm:p-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">Contact Us</h1>
          <p className="text-sm text-gray-500 mb-8">
            Last updated on <time dateTime="2025-04-29T22:37:13">29-Apr-2025 at 10:37 PM</time>
          </p>
        </div>

        <div className="space-y-6 text-gray-800">
          <ContactItem
            icon={<BadgeInfo className="text-indigo-600 w-5 h-5" />}
            label="Merchant Legal Entity Name"
            value="MOHD ZAYED MOHD SALIM ANSARI"
          />
          <ContactItem
            icon={<Building2 className="text-indigo-600 w-5 h-5" />}
            label="Registered Address"
            value="1396, Naigaon Road, Behind Rafey Medical, Bhiwandi, Maharashtra, 421302"
          />
          <ContactItem
            icon={<MapPin className="text-indigo-600 w-5 h-5" />}
            label="Operational Address"
            value="1396, Naigaon Road, Behind Rafey Medical, Bhiwandi, Maharashtra, 421302"
          />
          <ContactItem
            icon={<Phone className="text-indigo-600 w-5 h-5" />}
            label="Phone"
            value="+91 74988 81947"
          />
          <ContactItem
            icon={<Mail className="text-indigo-600 w-5 h-5" />}
            label="Email"
            value={
              <a
                href="mailto:zayedans022@gmail.com"
                className="text-indigo-600 underline hover:text-indigo-800 transition"
              >
                grocart.co@gmail.com
              </a>
            }
          />
        </div>
      </div>
    </section>
  );
}

function ContactItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1">{icon}</div>
      <div>
        <h2 className="text-sm font-medium text-gray-500">{label}</h2>
        <p className="text-base font-medium text-gray-800">{value}</p>
      </div>
    </div>
  );
}
