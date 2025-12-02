# Grainy Film Effect Package

A reusable package that adds a vintage film grain effect with vignette and scanlines to any page.

## Features

- Animated canvas-based grain effect
- Vignette overlay
- Scanline overlay
- Performance optimized (1fps, low grain density)
- Toggle on/off via data attribute
- Pauses when tab is hidden to save resources

## Installation

The package is already included in your project at `src/packages/grainy-film/`.

## Usage

### 1. Basic Usage

Import the component and add the data attribute to your HTML tag:

```astro
---
import GrainyFilm from '@/packages/grainy-film/GrainyFilm.astro';
---

<html data-grainy-film>
  <body>
    <GrainyFilm />
    <!-- your content -->
  </body>
</html>
```

### 2. Toggle Effect

Simply add or remove the `data-grainy-film` attribute from the `<html>` tag:

```html
<!-- Effect enabled -->
<html data-grainy-film>

<!-- Effect disabled -->
<html>
```

## Files

- `GrainyFilm.astro` - Main component with HTML structure
- `grainy-film.css` - Scoped CSS styles (only applies when data attribute is present)
- `grainy-film.js` - Canvas grain effect logic
- `README.md` - This file

## Performance

The effect is optimized for performance:
- Reduced frame rate (1fps)
- Low grain density (0.001)
- Debounced resize handler
- Pauses animation when tab is hidden
- Uses `requestAnimationFrame` for smooth rendering

## Browser Support

Works in all modern browsers that support:
- Canvas API
- requestAnimationFrame
- CSS animations
