// app/refund/page.tsx
export const metadata = {
  title: 'Refund Policy – Bright Minds Lab',
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-background text-light py-12 px-4">
      <div className="max-w-2xl mx-auto bg-dark rounded-2xl shadow-card p-8 space-y-6">
        <h1 className="text-3xl font-heading text-primary">Refund Policy</h1>
        <p>
          At Bright Minds Lab, we want you to be completely satisfied with your learning experience. If for any reason you’re not happy with your purchase, you may request a refund under the following terms:
        </p>

        <h2 className="text-2xl font-heading text-secondary">1. Eligibility</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>You must request a refund within <strong>7 days</strong> of purchase.</li>
          <li>You must not have completed more than <strong>20%</strong> of the course or challenge content.</li>
          <li>Refunds are limited to one per user per course/challenge.</li>
        </ul>

        <h2 className="text-2xl font-heading text-secondary">2. How to Request</h2>
        <p>
          To request a refund, please email our support team at{' '}
          <a href="mailto:support@brightminds.com" className="text-primary underline">
            support@brightminds.com
          </a>{' '}
          with your order details and reason for refund. We aim to process all refund requests within <strong>5 business days</strong>.
        </p>

        <h2 className="text-2xl font-heading text-secondary">3. Exceptions</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>No refunds will be issued after the 7-day window or once more than 20% of content is completed.</li>
          <li>Any promotional or discounted purchases are final sale and not eligible for a refund.</li>
        </ul>

        <h2 className="text-2xl font-heading text-secondary">4. Contact Us</h2>
        <p>
          If you have any questions about this policy, feel free to reach out at{' '}
          <a href="mailto:help@brightminds.com" className="text-primary underline">
            help@brightminds.com
          </a>.
        </p>
      </div>
    </div>
  );
}
