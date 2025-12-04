/**
 * Grainy Film Effect Package
 *
 * Supports multiple effect types via data-grainy-film attribute value
 * Optimized grain effect with reduced frame rate for better performance
 */

// Effect configurations
const EFFECT_CONFIGS = {
  'classic': {
    fps: 1,
    density: 0.001,
    brightnessMin: 220,
    brightnessMax: 255
  },
  'heavy': {
    fps: 2,
    density: 0.005,
    brightnessMin: 200,
    brightnessMax: 255
  },
  'subtle': {
    fps: 1,
    density: 0.0005,
    brightnessMin: 230,
    brightnessMax: 255
  },
  'vintage': {
    fps: 1,
    density: 0.002,
    brightnessMin: 180,
    brightnessMax: 220
  }
};

// Global state
let currentAnimation = null;
let currentType = null;

/**
 * Initialize or reinitialize the grain effect
 */
export function initGrainEffect() {
  const htmlElement = document.documentElement;
  const effectType = htmlElement.getAttribute('data-grainy-film');

  // Exit if no attribute or set to 'none'
  if (!effectType || effectType === 'none') {
    cleanupGrainEffect();
    return;
  }

  // Get configuration (default to 'classic' if unknown type)
  const config = EFFECT_CONFIGS[effectType] || EFFECT_CONFIGS['classic'];
  currentType = effectType;

  // Get canvas
  const canvas = document.getElementById('grainCanvas');
  if (!canvas) return;

  // Cleanup any existing animation
  if (currentAnimation) {
    cancelAnimationFrame(currentAnimation);
    currentAnimation = null;
  }

  const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: false });
  let lastFrame = 0;
  const frameInterval = 1000 / config.fps;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function drawGrain(timestamp) {
    if (timestamp - lastFrame < frameInterval) {
      currentAnimation = requestAnimationFrame(drawGrain);
      return;
    }

    lastFrame = timestamp;

    // Clear canvas with transparency
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const buffer = new Uint32Array(imageData.data.buffer);
    const len = buffer.length;

    // Generate grain using config
    const brightnessRange = config.brightnessMax - config.brightnessMin;
    for (let i = 0; i < len; i++) {
      if (Math.random() < config.density) {
        const gray = (config.brightnessMin + Math.random() * brightnessRange) | 0;
        buffer[i] = (255 << 24) | (gray << 16) | (gray << 8) | gray;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    currentAnimation = requestAnimationFrame(drawGrain);
  }

  resizeCanvas();

  // Debounce resize for performance
  let resizeTimeout;
  const resizeHandler = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 250);
  };
  window.addEventListener('resize', resizeHandler);

  // Start animation
  currentAnimation = requestAnimationFrame(drawGrain);

  // Pause animation when tab is hidden to save resources
  const visibilityHandler = () => {
    if (document.hidden) {
      if (currentAnimation) {
        cancelAnimationFrame(currentAnimation);
      }
    } else {
      currentAnimation = requestAnimationFrame(drawGrain);
    }
  };
  document.addEventListener('visibilitychange', visibilityHandler);
}

/**
 * Cleanup and disable the grain effect
 */
export function cleanupGrainEffect() {
  if (currentAnimation) {
    cancelAnimationFrame(currentAnimation);
    currentAnimation = null;
  }

  const canvas = document.getElementById('grainCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  currentType = null;
}

/**
 * Public API for controlling grain effects
 */
if (typeof window !== 'undefined') {
  window.grainEffect = {
    /**
     * Enable grain effect with specified type
     */
    enable: (type = 'classic') => {
      if (!EFFECT_CONFIGS[type]) {
        console.warn(`Unknown grain effect type: ${type}. Using 'classic'.`);
        type = 'classic';
      }
      document.documentElement.setAttribute('data-grainy-film', type);
      initGrainEffect();
    },

    /**
     * Disable grain effect
     */
    disable: () => {
      document.documentElement.setAttribute('data-grainy-film', 'none');
      cleanupGrainEffect();
    },

    /**
     * Toggle grain effect on/off
     */
    toggle: (type = 'classic') => {
      const current = document.documentElement.getAttribute('data-grainy-film');
      if (!current || current === 'none') {
        window.grainEffect.enable(type);
      } else {
        window.grainEffect.disable();
      }
    },

    /**
     * Change effect type
     */
    setType: (type) => {
      if (!EFFECT_CONFIGS[type]) {
        console.warn(`Unknown grain effect type: ${type}`);
        return;
      }
      document.documentElement.setAttribute('data-grainy-film', type);
      initGrainEffect();
    },

    /**
     * Get current effect type
     */
    getType: () => currentType,

    /**
     * Check if effect is enabled
     */
    isEnabled: () => currentType !== null && currentType !== 'none',

    /**
     * Get available effect types
     */
    getAvailableTypes: () => Object.keys(EFFECT_CONFIGS)
  };
}

// Initialize grain effect - works with both initial load and View Transitions
(function() {
  function init() {
    initGrainEffect();
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-initialize after View Transitions navigation
  document.addEventListener('astro:page-load', init);
})();
