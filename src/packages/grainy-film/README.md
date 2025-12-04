# Grainy Film Effect Package

A reusable package that adds configurable vintage film grain effects to any page. Features multiple effect types with different intensities and characteristics.

## Features

- **Multiple Effect Types**: Classic, Heavy, Subtle, and Vintage grain styles
- **Canvas-based Animation**: High-performance grain rendering with configurable frame rates
- **Value-based Configuration**: Control effect type via `data-grainy-film` attribute value
- **JavaScript API**: Programmatic control for dynamic effect changes
- **Performance Optimized**: Low frame rates (1-2fps), visibility-aware pausing
- **View Transitions Compatible**: Works seamlessly with Astro View Transitions

## Effect Types

| Type | Density | FPS | Brightness | Opacity | Description |
|------|---------|-----|------------|---------|-------------|
| `classic` | 0.001 | 1 | 220-255 | 0.5 | Standard grain effect |
| `heavy` | 0.005 | 2 | 200-255 | 0.7 | Intense grain with faster animation |
| `subtle` | 0.0005 | 1 | 230-255 | 0.3 | Light, barely-there grain |
| `vintage` | 0.002 | 1 | 180-220 | 0.6 | Sepia-toned with multiply blend |
| `none` | - | - | - | - | Disable effect completely |

## Installation

The package is already included in your project at `src/packages/grainy-film/`.

## Usage

### 1. With BaseLayout (Recommended)

Pass the effect type to your BaseLayout component:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
---

<BaseLayout data-grainy-film="classic">
  <!-- your content -->
</BaseLayout>
```

The GrainyFilm component is automatically included in BaseLayout and will render when the attribute is present.

### 2. Direct HTML Usage

For custom layouts, add the attribute to your HTML tag and include the component:

```astro
---
import GrainyFilm from '@/packages/grainy-film/GrainyFilm.astro';
---

<html data-grainy-film="classic">
  <body>
    <GrainyFilm />
    <!-- your content -->
  </body>
</html>
```

### 3. Changing Effect Types

Simply change the attribute value:

```html
<!-- Classic grain -->
<html data-grainy-film="classic">

<!-- Heavy grain -->
<html data-grainy-film="heavy">

<!-- Subtle grain -->
<html data-grainy-film="subtle">

<!-- Vintage film -->
<html data-grainy-film="vintage">

<!-- Disabled -->
<html data-grainy-film="none">
<!-- or omit the attribute entirely -->
<html>
```

## JavaScript API

The package exposes a global `window.grainEffect` API for programmatic control:

### Methods

```javascript
// Enable effect with specified type
window.grainEffect.enable('heavy');

// Disable effect
window.grainEffect.disable();

// Toggle effect on/off (uses 'classic' when enabling)
window.grainEffect.toggle();
window.grainEffect.toggle('vintage'); // Use specific type when enabling

// Change effect type while active
window.grainEffect.setType('subtle');

// Get current effect type
const currentType = window.grainEffect.getType();
// Returns: 'classic' | 'heavy' | 'subtle' | 'vintage' | null

// Check if effect is enabled
const isActive = window.grainEffect.isEnabled();
// Returns: boolean

// Get list of available types
const types = window.grainEffect.getAvailableTypes();
// Returns: ['classic', 'heavy', 'subtle', 'vintage']
```

### Example: Dynamic Control

```javascript
// Switch to heavy grain on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 1000) {
    window.grainEffect.setType('heavy');
  }
});

// Toggle on button click
document.querySelector('#toggle-grain').addEventListener('click', () => {
  window.grainEffect.toggle('classic');
});
```

## Integration with Homepage

The homepage includes scroll-based theme transitions that also control grain visibility:

```javascript
// Grain appears in dark sections, hidden in light sections
function applyTheme(section) {
  if (section === heroSection || section === servicesSection) {
    html.setAttribute('data-theme', 'dark');
    setGrainVisibility(true);  // Show grain
  } else if (section === aboutSection) {
    html.setAttribute('data-theme', 'light');
    setGrainVisibility(false); // Hide grain
  }
}
```

The grain container opacity is smoothly transitioned (0.6s ease) to match theme changes.

## Files

- `GrainyFilm.astro` - Main component with canvas element and initialization
- `grainy-film.css` - Type-specific styles and animations
- `grainy-film.js` - Canvas rendering logic, configs, and public API
- `README.md` - This file

## Architecture

### Configuration System

Effect configurations are defined in `grainy-film.js`:

```javascript
const EFFECT_CONFIGS = {
  'classic': {
    fps: 1,                    // Frame rate
    density: 0.001,            // Grain density (0-1)
    brightnessMin: 220,        // Min pixel brightness (0-255)
    brightnessMax: 255         // Max pixel brightness (0-255)
  },
  // ... other types
};
```

### Initialization Flow

1. Page loads, `initGrainEffect()` runs on `DOMContentLoaded` and `astro:page-load`
2. Reads `data-grainy-film` attribute value from `<html>` element
3. Loads corresponding config from `EFFECT_CONFIGS`
4. Sets up canvas, resize handlers, and visibility listeners
5. Starts animation loop with `requestAnimationFrame`

### Canvas Rendering

- Uses `Uint32Array` buffer for efficient pixel manipulation
- Applies grain with configurable density and brightness
- Frame rate throttling prevents unnecessary redraws
- Clears with transparency to avoid overlay darkening

## Performance

### Optimization Features

- **Low Frame Rates**: 1-2fps reduces CPU usage while maintaining visual quality
- **Configurable Density**: Sparse grain patterns (0.0005-0.005) minimize pixel operations
- **Visibility Pausing**: Animation stops when tab is hidden
- **Debounced Resize**: 250ms debounce on window resize events
- **Efficient Rendering**: Direct buffer manipulation with `Uint32Array`

### Performance by Type

- **Subtle**: Lowest overhead (0.0005 density, 1fps)
- **Classic**: Balanced performance (0.001 density, 1fps)
- **Vintage**: Moderate overhead (0.002 density, multiply blend)
- **Heavy**: Highest overhead (0.005 density, 2fps)

## Browser Support

Works in all modern browsers that support:
- Canvas API with 2D context
- requestAnimationFrame
- CSS animations and blend modes
- IntersectionObserver (for homepage integration)

## Troubleshooting

### Effect not appearing

1. Verify the attribute is on the `<html>` element: `document.documentElement.getAttribute('data-grainy-film')`
2. Check canvas exists: `document.getElementById('grainCanvas')`
3. Verify JS loaded: `typeof window.grainEffect`
4. Check for console errors

### Effect too subtle or intense

Use the JavaScript API to try different types:
```javascript
window.grainEffect.setType('heavy');  // More visible
window.grainEffect.setType('subtle'); // Less visible
```

Or create a custom config by modifying `EFFECT_CONFIGS` in `grainy-film.js`.

### Performance issues

Switch to a lighter effect type:
```javascript
window.grainEffect.setType('subtle'); // Lightest option
```

Or disable in sections where not needed using the homepage scroll integration pattern.
