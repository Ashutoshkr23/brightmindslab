'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [message, setMessage] = useState('');
  const [status,  setStatus]  = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      if (res.ok) {
        setStatus('success');
        setName(''); setEmail(''); setMessage('');
      } else {
        throw new Error('Network error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background text-light py-12 px-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Static Contact Details */}
        <div className="bg-dark rounded-2xl shadow-card p-6 space-y-4">
          <h1 className="text-3xl font-heading text-primary">Contact Us</h1>
          <p className="text-secondary text-sm">
            Last updated on <strong>25-06-2025 00:21:52</strong>
          </p>
          <p>You may contact us using the information below:</p>
          <ul className="list-inside list-disc space-y-1 text-light text-sm">
            <li><strong>Merchant Legal entity name:</strong> Ashutosh</li>
            <li>
              <strong>Registered Address:</strong><br/>
              Lakhisarai, Bihar, 811106, Lakhisarai, Lakhisarai, PIN: 811106
            </li>
            <li>
              <strong>Operational Address:</strong><br/>
              Lakhisarai, Bihar, 811106, Lakhisarai, Lakhisarai, PIN: 811106
            </li>
            <li><strong>Telephone No:</strong> 8209127958</li>
            <li><strong>E-Mail ID:</strong> ashutoshkumar.ash205@gmail.com</li>
          </ul>
        </div>

        {/* Contact Form */}
        <div className="bg-dark rounded-2xl shadow-card p-8 space-y-6">
          <p className="text-secondary">
            Have questions or feedback? Fill out the form below and we’ll get back to you within 24 hours.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-xl bg-background text-light placeholder:text-secondary"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 rounded-xl bg-background text-light placeholder:text-secondary"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block mb-1">Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={5}
                className="w-full px-4 py-2 rounded-xl bg-background text-light placeholder:text-secondary resize-none"
                placeholder="How can we help you?"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className={`w-full py-2 rounded-xl ${
                status === 'sending'
                  ? 'bg-secondary text-light cursor-not-allowed'
                  : 'bg-primary text-dark hover:bg-primary/90'
              } transition`}
            >
              {status === 'sending' ? 'Sending…' : 'Send Message'}
            </button>
          </form>

          {status === 'success' && (
            <p className="text-success mt-4">✅ Your message has been sent!</p>
          )}
          {status === 'error' && (
            <p className="text-danger mt-4">❌ Something went wrong. Please try again.</p>
          )}
        </div>
      </div>
    </div>
  );
}
