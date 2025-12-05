/**
 * Slide Panel - Reusable right slide-out panel component
 *
 * This module provides a reusable slide-in panel that can be used
 * for various purposes across the site (forms, content, etc.)
 */

/**
 * Initialize a slide panel with the given ID and optional callbacks
 *
 * @param {Object} options - Configuration options
 * @param {string} options.panelId - The ID of the panel element
 * @param {string} options.backdropId - The ID of the backdrop element
 * @param {string} options.closeButtonId - The ID of the close button element
 * @param {Function} [options.onOpen] - Callback function called when panel opens
 * @param {Function} [options.onClose] - Callback function called when panel closes
 * @param {boolean} [options.closeOnEscape] - Whether to close panel on ESC key (default: true)
 * @param {boolean} [options.closeOnBackdropClick] - Whether to close panel on backdrop click (default: true)
 * @returns {Object} Object with open, close, and cleanup functions
 */
export function initSlidePanel(options) {
  const {
    panelId,
    backdropId,
    closeButtonId,
    onOpen = null,
    onClose = null,
    closeOnEscape = true,
    closeOnBackdropClick = true,
  } = options;

  // Get elements
  const panel = document.getElementById(panelId);
  const backdrop = document.getElementById(backdropId);
  const closeButton = document.getElementById(closeButtonId);

  // Return early if elements don't exist
  if (!panel || !backdrop) {
    console.warn(`Slide panel elements not found: panelId=${panelId}, backdropId=${backdropId}`);
    return { open: () => {}, close: () => {}, cleanup: () => {} };
  }

  // Open panel function
  function openPanel() {
    if (panel && backdrop) {
      panel.classList.add('open');
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (closeButton) closeButton.focus();

      // Call onOpen callback if provided
      if (onOpen && typeof onOpen === 'function') {
        onOpen();
      }
    }
  }

  // Close panel function
  function closePanel() {
    if (panel && backdrop) {
      panel.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.overflow = '';

      // Call onClose callback if provided
      if (onClose && typeof onClose === 'function') {
        onClose();
      }
    }
  }

  // ESC key handler
  const escHandler = (e) => {
    if (closeOnEscape && e.key === 'Escape' && panel && panel.classList.contains('open')) {
      closePanel();
    }
  };

  // Setup event listeners
  if (closeButton) {
    closeButton.addEventListener('click', closePanel);
  }

  if (closeOnBackdropClick && backdrop) {
    backdrop.addEventListener('click', closePanel);
  }

  if (closeOnEscape) {
    document.addEventListener('keydown', escHandler);
  }

  // Cleanup function to remove event listeners
  function cleanup() {
    if (closeButton) {
      closeButton.removeEventListener('click', closePanel);
    }
    if (backdrop) {
      backdrop.removeEventListener('click', closePanel);
    }
    document.removeEventListener('keydown', escHandler);
  }

  // Return API
  return {
    open: openPanel,
    close: closePanel,
    cleanup: cleanup,
  };
}
