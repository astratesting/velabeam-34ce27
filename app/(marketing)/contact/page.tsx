'use client';

import { useState } from 'react';
import BeamButton from '@/components/ui/BeamButton';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // In dev, just show success
    await new Promise((r) => setTimeout(r, 500));
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-charcoal mb-4">Message sent</h1>
        <p className="text-fog">We&apos;ll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-20">
      <h1 className="font-display text-4xl font-bold text-charcoal mb-4">Get in touch</h1>
      <p className="text-fog mb-10">
        Have a question about VelaBeam? Send us a message.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm text-fog mb-1">Name</label>
          <input
            id="name"
            type="text"
            required
            className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal placeholder:text-fog/50 focus:border-gold focus:outline-none transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-fog mb-1">Email</label>
          <input
            id="email"
            type="email"
            required
            className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal placeholder:text-fog/50 focus:border-gold focus:outline-none transition-colors"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm text-fog mb-1">Message</label>
          <textarea
            id="message"
            required
            rows={5}
            className="w-full py-2.5 border-b border-mist bg-transparent text-charcoal placeholder:text-fog/50 focus:border-gold focus:outline-none transition-colors resize-none"
            placeholder="How can we help?"
          />
        </div>
        <BeamButton type="submit" loading={loading}>Send message</BeamButton>
      </form>
    </div>
  );
}
