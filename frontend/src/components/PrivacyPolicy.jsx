import React from 'react';

export default function PrivacyPolicy() {
  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6 sm:px-12 md:px-20 flex justify-center">
      <article className="max-w-4xl w-full bg-white rounded-3xl shadow-lg p-12 sm:p-16 text-gray-800">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-indigo-900 mb-2 tracking-tight">Privacy Policy</h1>
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
            This Privacy Policy outlines how <strong>GROKART</strong> ("we", "us", or "our") collects, uses,
            discloses, and protects your personal information when you use our mobile application, website, and services.
          </p>
          <p>
  By using our services, you agree to the collection and use of your information in accordance with this Privacy Policy.
</p>

          <PolicySection
            number="1"
            title="Information We Collect"
            items={[
              'Personal details (name, email, phone number, password) during account registration, order checkout, or inquiries.',
              'Device and usage information: IP address, browser type, language settings, device identifiers, and crash logs.',
              'Precise or approximate location data (with your permission) for delivery tracking.',
              'Information from cookies and similar tracking technologies.',
            ]}
          />

          <PolicySection
            number="2"
            title="How We Use Your Information"
            items={[
              'To process and deliver your orders and manage payments.',
              'To personalize user experience, product recommendations, and content.',
              'To communicate with you about your account, transactions, or customer support.',
              'To send marketing communications (you can opt-out anytime).',
              'To detect, prevent, and address fraud or technical issues.',
              'To comply with legal and regulatory obligations.',
            ]}
          />

          <PolicySection
            number="3"
            title="Legal Basis for Processing"
            items={[
              'Consent – when you opt in to marketing or share optional info.',
              'Contract – to fulfill orders and provide requested services.',
              'Legal obligation – when required to comply with applicable laws.',
              'Legitimate interest – such as improving app performance or protecting against misuse.',
            ]}
          />

          <PolicySection
            number="4"
            title="When and with Whom Do We Share Your Personal Information?"
            items={[
              'Vendors, Consultants, and Other Third-Party Service Providers. We may share your data with third-party vendors, service providers, contractors, or agents ("third-parties") who perform services for us or on behalf and require access to such information to do that work.',
              'The  categories of third parties we may share personal information with are as follows: Data Analytics Services, Website Hosting Service Providers, User Account Registration & Authentication Services, Google Maps.',
              
            ]}
          />

          <PolicySection
            number="5"
            title="Data Sharing"
            items={[
              'Delivery and logistics partners to ensure successful delivery.',
              'Analytics partners (e.g., Google Analytics) for app performance insights.',
              'Cloud hosting providers like Firebase.',
              'Authorities or regulators if required by law or legal request.',
            ]}
          />

          <PolicySection
            number="6"
            title="Cookies & Tracking Technologies"
            items={[
              'We use cookies and similar technologies to store preferences, track user behavior, and improve performance.',
              'You may disable cookies in your browser settings, but some features may not function properly.',
            ]}
          />

          <PolicySection
            number="7"
            title="How Long We Retain Your Data"
            items={[
              'We retain personal information only as long as necessary to fulfill the purposes outlined in this policy.',
              'Transaction data is stored for at least 6 years to meet legal and financial obligations.',
              'You can request deletion of your account and associated data anytime.',
            ]}
          />

          <PolicySection
            number="8"
            title="Your Privacy Rights"
            items={[
              'Access: Request a copy of your personal information.',
              'Correction: Request updates to incomplete or incorrect data.',
              'Deletion: Request deletion of your personal information.',
              'Objection: Withdraw consent or object to certain types of processing.',
              'Portability: Request your data in a structured, machine-readable format.',
            ]}
          />

          <PolicySection
            number="9"
            title="Children’s Privacy"
            items={[
              'Our services are not intended for users under the age of 13.',
              'We do not knowingly collect or store personal data of children under 13. If we become aware, we will delete such data immediately.',
            ]}
          />

          <PolicySection
            number="10"
            title="User Controls & Consent"
            items={[
              'You can update your communication and notification preferences in your account settings.',
              'You may manage or revoke app permissions from your mobile device’s settings.',
              'You can opt out of tracking technologies through your browser or device settings.',
            ]}
          />

          <PolicySection
            number="11"
            title="International Data Transfers"
            items={[
              'Your data may be processed outside your country of residence, including in jurisdictions with different data protection laws.',
              'We take appropriate steps to ensure your data remains protected under applicable privacy standards.',
            ]}
          />

          <PolicySection
            number="12"
            title="Do Not Track (DNT) Signals"
            items={[
              'Our systems do not respond to Do Not Track signals from browsers.',
              'You may use built-in privacy features of your device or browser to limit tracking.',
            ]}
          />

          <PolicySection
            number="13"
            title="Updates to This Policy"
            items={[
              'We may update this policy from time to time based on legal, technical, or business developments.',
              'Material changes will be notified via app update or email.',
              'We recommend reviewing this policy periodically.',
            ]}
          />

          <PolicySection
  number="14"
  title="Google Play User Data Policy Compliance"
  items={[
    'Grokart complies with Google Play’s data safety and user data policies.',
    'We do not collect or share data in ways that are not disclosed in this Privacy Policy.',
    'All permissions requested within the app are used solely to enable core functionality.',
    'Data is never sold to third parties.',
  ]}
/>


          <div>
            <h2 className="text-2xl font-semibold text-indigo-800 mb-3">15. Contact Us</h2>
            <address className="not-italic space-y-2 text-gray-700 text-lg">
              <p>
                If you have any questions, concerns, or requests regarding your privacy:
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
