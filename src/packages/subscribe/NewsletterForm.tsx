import React, { useState } from 'react';

interface NewsletterFormProps {
  variant?: 'inline' | 'cta' | 'panel';
  displayMode?: 'modal' | 'panel'; // For CTA variant: choose between modal or slide panel
  panelId?: string; // For displayMode="panel": which slide panel to open
  source?: string;
  title?: string;
  description?: string;
  ctaText?: string;
}

export default function NewsletterForm({
  variant = 'inline',
  displayMode = 'modal',
  panelId = 'newsletter-subscribe',
  source = 'website',
  title = 'Subscribe to the Newsletter',
  description = 'Latest news, musings, announcements and updates direct to your inbox.',
  ctaText = 'Subscribe'
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [consent, setConsent] = useState(false);

  const consentCopy =
    'I agree to receive the newsletter and occasional updates.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(email.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent || !isEmailValid) {
      setMessage('Please provide a valid email and consent.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    const formUrl = typeof window !== 'undefined' ? window.location.href : undefined;

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source,
          consent: true,
          consent_copy: consentCopy,
          form_url: formUrl
        })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Almost done! Check your inbox to confirm.');
        setEmail('');
        setConsent(false);

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
          disabled={status === 'loading' || status === 'success' || status === 'error' || !consent || !isEmailValid}
        >
          {status === 'loading' ? <span className="spinner">◌</span> : status === 'success' ? '✓' : status === 'error' ? '✕' : '→'}
        </button>
        <label className="newsletter-consent">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            required
          />
          <span>
            I agree to receive the newsletter and occasional updates, and I have read the{' '}
            <a href="/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
          </span>
        </label>
      </form>
    );
  }

  // Panel variant - form inside slide panel
  if (variant === 'panel') {
    return (
      <div className="newsletter-panel-form">
        <form className="newsletter-form newsletter-form--panel" onSubmit={handleSubmit}>
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
          <label className="newsletter-consent">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              required
            />
            <span>
              {consentCopy}{' '}
              <a href="/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
            </span>
          </label>
          <button
            type="submit"
            className={`newsletter-submit newsletter-submit--panel ${status}`}
            disabled={status === 'loading' || status === 'success' || status === 'error' || !consent || !isEmailValid}
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
    );
  }

  // CTA variant - button that opens modal or slide panel
  const handleCtaClick = () => {
    if (displayMode === 'panel') {
      const helperName = (() => {
        const camel = panelId.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        return `open${camel.charAt(0).toUpperCase() + camel.slice(1)}Panel`;
      })();

      const tryOpen = () => {
        if (typeof window === 'undefined') return false;
        const fn = (window as any)[helperName];
        if (typeof fn === 'function') {
          fn();
          return true;
        }
        return false;
      };

      if (!tryOpen()) {
        // Poll briefly in case slide-panel helper registers late
        let attempts = 0;
        const timer = setInterval(() => {
          attempts += 1;
          if (tryOpen() || attempts >= 15) {
            clearInterval(timer);
            if (attempts >= 15) {
              console.error(`${helperName} function not found. Ensure the slide panel with id="${panelId}" is rendered.`);
            }
          }
        }, 100);
      }
    } else {
      // Open modal (default behavior)
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <p className="newsletter-cta-description">{description}</p>
      <button
        type="button"
        className="newsletter-cta"
        onClick={handleCtaClick}
        aria-label="Open newsletter subscription"
      >
        <span className="newsletter-cta-text">{ctaText}</span>
      </button>

      {displayMode === 'modal' && isModalOpen && (
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
            <label className="newsletter-consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                required
              />
              <span>
                {consentCopy}{' '}
                <a href="/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
              </span>
            </label>
            <button
              type="submit"
              className={`newsletter-submit newsletter-submit--modal ${status}`}
              disabled={status === 'loading' || status === 'success' || status === 'error' || !consent || !isEmailValid}
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
