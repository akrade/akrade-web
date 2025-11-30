import React, { useState } from 'react';

export default function NewsletterSignup() {
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
        body: JSON.stringify({ email, source: 'homepage' })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');

        // Optional: Track with analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'newsletter_signup', {
            email_domain: email.split('@')[1]
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
      if (status !== 'idle') setStatus('idle');
    }, 5000);
  };

  return (
    <div className="newsletter-signup">
      <h2>Sign Up For Our Newsletter</h2>

      <form onSubmit={handleSubmit} className="signup-form">
        <div className="input-wrapper">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            required
            aria-label="Email address"
            className="email-input"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            aria-label="Subscribe"
            className="submit-button"
          >
            {status === 'loading' ? (
              <span className="spinner">⏳</span>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>

        {status === 'success' && (
          <p className="message success" role="status">
            ✓ {message}
          </p>
        )}

        {status === 'error' && (
          <p className="message error" role="alert">
            ✗ {message}
          </p>
        )}
      </form>
    </div>
  );
}
