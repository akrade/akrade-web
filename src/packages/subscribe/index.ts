/**
 * Newsletter Subscription Package
 *
 * Export the newsletter form component for use across sites
 */

export { default as NewsletterForm } from './NewsletterForm';
export { default as NewsletterSlidePanel } from './NewsletterSlidePanel.astro';
export { POST as subscribeHandler } from './api/subscribe';