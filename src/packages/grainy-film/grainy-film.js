/**
 * Grainy Film Effect Package
 *
 * Initializes the grainy film effect on pages with data-grainy-film attribute
 * Optimized grain effect with reduced frame rate for better performance
 */

export function initGrainEffect() {
  // Check if the effect should be applied
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('data-grainy-film')) {
    return;
  }

  const canvas = document.getElementById('grainCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: false, willReadFrequently: false });
  let animationId;
  let lastFrame = 0;
  const fps = 1; // Reduced from 60fps to 1fps for performance
  const frameInterval = 1000 / fps;

  function resizeCanvas() {
    // Reduce canvas resolution for better performance
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function drawGrain(timestamp) {
    if (timestamp - lastFrame < frameInterval) {
      animationId = requestAnimationFrame(drawGrain);
      return;
    }

    lastFrame = timestamp;

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const buffer = new Uint32Array(imageData.data.buffer);
    const len = buffer.length;

    // Optimize: reduce grain density and use bitwise operations
    for (let i = 0; i < len; i++) {
      if (Math.random() < 0.001) { // Reduced from 0.05 to 0.001
        // Generate very bright grain specs (220-255 range for much whiter appearance)
        const gray = (220 + Math.random() * 35) | 0;
        buffer[i] = (255 << 24) | (gray << 16) | (gray << 8) | gray;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    animationId = requestAnimationFrame(drawGrain);
  }

  resizeCanvas();

  // Debounce resize for performance
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 250);
  });

  // Start animation
  animationId = requestAnimationFrame(drawGrain);

  // Pause animation when tab is hidden to save resources
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animationId = requestAnimationFrame(drawGrain);
    }
  });
}

// Initialize grain effect - works with both initial load and View Transitions
(function() {
  // Initialize immediately on first load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGrainEffect);
  } else {
    initGrainEffect();
  }

  // Re-initialize after View Transitions navigation
  document.addEventListener('astro:page-load', initGrainEffect);
})();
