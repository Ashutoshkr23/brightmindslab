// app/terms/page.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Terms & Conditions – Bright Minds Lab',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-light py-12 px-4">
      <div className="max-w-3xl mx-auto bg-dark rounded-2xl shadow-card p-8 space-y-6">
        <h1 className="text-3xl font-heading text-primary">Terms &amp; Conditions</h1>

        <p>
          Welcome to Bright Minds Lab! These Terms &amp; Conditions govern your use of our website and services. By accessing or using Bright Minds Lab, you agree to be bound by these terms.
        </p>

        <h2 className="text-2xl font-heading text-secondary">1. Definitions</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>“Service”</strong> refers to Bright Minds Lab’s web and mobile applications.</li>
          <li><strong>“User”</strong> means anyone who registers for or uses the Service.</li>
          <li><strong>“Content”</strong> means any text, images, videos, or other materials provided through the Service.</li>
        </ul>

        <h2 className="text-2xl font-heading text-secondary">2. Acceptance of Terms</h2>
        <p>
          By creating an account or using the Service, you confirm that you have read, understood, and agree to these Terms &amp; Conditions and our Privacy Policy.
        </p>

        <h2 className="text-2xl font-heading text-secondary">3. User Accounts</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>You must provide a valid email address and basic profile information.</li>
          <li>You are responsible for keeping your password and account secure.</li>
          <li>You must be at least 13 years old to register.</li>
        </ul>

        <h2 className="text-2xl font-heading text-secondary">4. License &amp; Restrictions</h2>
        <p>
          Bright Minds Lab grants you a limited, non-exclusive, non-transferable license to access and use the Service for personal, educational purposes. You may not:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Copy, modify, or distribute any part of the Service without permission.</li>
          <li>Use the Service for any unlawful purpose.</li>
          <li>Reverse engineer, decompile, or attempt to extract source code.</li>
        </ul>

        <h2 className="text-2xl font-heading text-secondary">5. Payments &amp; Refunds</h2>
        <p>
          All paid courses and content are billed as described at the time of purchase. Refund requests are subject to our <Link href="/refund" className="text-primary underline">Refund Policy</Link>.
        </p>

        <h2 className="text-2xl font-heading text-secondary">6. Intellectual Property</h2>
        <p>
          All content, trademarks, and logos are the property of Bright Minds Lab or its licensors. You may not use our trademarks without prior written consent.
        </p>

        <h2 className="text-2xl font-heading text-secondary">7. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your access for any violation of these terms or misuse of the Service.
        </p>

        <h2 className="text-2xl font-heading text-secondary">8. Changes to Terms</h2>
        <p>
          We may update these Terms &amp; Conditions from time to time. Significant changes will be communicated via email or in-app notification.
        </p>

        <h2 className="text-2xl font-heading text-secondary">9. Contact Us</h2>
        <p>
          If you have any questions about these terms, please reach out to{' '}
          <a href="mailto:support@brightminds.com" className="text-primary underline">
            support@brightminds.com
          </a>.
        </p>
      </div>
    </div>
  );
}
