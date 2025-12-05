import React, { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');

        // Optional: Track with analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'newsletter_signup', {
            email_domain: email.split('@')[1],
            source: 'footer'
          });
        }
      } else {
        setStatus('error');
        setMessage(data.error);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 5000);
  };

  return (
    <>
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder={status === 'success' ? 'Thank you' : status === 'error' ? message : 'Email Address'}
          className={`newsletter-input ${status}`}
          aria-label="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading' || status === 'success' || status === 'error'}
          required
        />
        <button
          type="submit"
          className={`newsletter-submit ${status}`}
          aria-label="Subscribe"
          disabled={status === 'loading' || status === 'success' || status === 'error'}
        >
          {status === 'loading' ? <span className="spinner">◌</span> : status === 'success' ? '✓' : status === 'error' ? '✕' : '→'}
        </button>
      </form>
    </>
  );
}