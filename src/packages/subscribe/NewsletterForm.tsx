import React, { useState } from 'react';

interface NewsletterFormProps {
  variant?: 'inline' | 'cta';
  source?: string;
  title?: string;
  description?: string;
  ctaText?: string;
}

export default function NewsletterForm({
  variant = 'inline',
  source = 'website',
  title = 'Subscribe to the Newsletter',
  description = 'Latest news, musings, announcements and updates direct to your inbox.',
  ctaText = 'Subscribe'
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source })
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
            source
          });
        }

        // Close modal after 2 seconds if in CTA mode
        if (variant === 'cta') {
          setTimeout(() => {
            setIsModalOpen(false);
          }, 2000);
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

  // Inline variant - original footer style
  if (variant === 'inline') {
    return (
      <form className="newsletter-form newsletter-form--inline" onSubmit={handleSubmit}>
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
    );
  }

  // CTA variant - button that opens modal
  return (
    <>
      <p className="newsletter-cta-description">{description}</p>
      <button
        type="button"
        className="newsletter-cta"
        onClick={() => setIsModalOpen(true)}
        aria-label="Open newsletter subscription"
      >
        {ctaText}
        <span className="newsletter-cta-arrow">→</span>
      </button>

      {isModalOpen && (
        <div
          className="newsletter-modal-overlay"
          onClick={() => setIsModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="newsletter-modal-title"
        >
          <div
            className="newsletter-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="newsletter-modal-close"
              onClick={() => setIsModalOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="newsletter-modal-content">
              <h2 id="newsletter-modal-title" className="newsletter-modal-title">{title}</h2>
              <p className="newsletter-modal-description">{description}</p>

              <form className="newsletter-form newsletter-form--modal" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Email Address"
                  className={`newsletter-input ${status}`}
                  aria-label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading' || status === 'success' || status === 'error'}
                  required
                  autoFocus
                />
                <button
                  type="submit"
                  className={`newsletter-submit newsletter-submit--modal ${status}`}
                  disabled={status === 'loading' || status === 'success' || status === 'error'}
                >
                  {status === 'loading' ? (
                    <span className="spinner">◌</span>
                  ) : status === 'success' ? (
                    '✓ Subscribed'
                  ) : status === 'error' ? (
                    '✕ Error'
                  ) : (
                    ctaText
                  )}
                </button>
              </form>

              {message && (
                <p className={`newsletter-message newsletter-message--${status}`}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}