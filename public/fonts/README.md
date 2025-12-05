# Local Fonts

Self-hosted web fonts for better performance, privacy, and reliability.

## Fonts Included

### Noto Sans
- **License**: SIL Open Font License 1.1
- **Source**: [Google Fonts](https://fonts.google.com/specimen/Noto+Sans)
- **Files**:
  - `noto-sans-variable.woff2` - Variable font (weights 100-900, normal style)
  - `noto-sans-400-italic.woff2` - Italic style (weight 400)
- **Total Size**: ~49KB

### Alegreya
- **License**: SIL Open Font License 1.1
- **Source**: [Google Fonts](https://fonts.google.com/specimen/Alegreya)
- **Files**:
  - `alegreya-400.woff2` - Regular style (weight 400)
  - `alegreya-400-italic.woff2` - Italic style (weight 400)
- **Total Size**: ~45KB

## Total Package Size

~94KB (compressed WOFF2 format)

## Benefits of Self-Hosting

1. **Performance**: No external DNS lookup or connection required
2. **Privacy**: No requests to Google Fonts servers
3. **Reliability**: Fonts always available, no CDN dependencies
4. **Control**: Version pinning, no unexpected font updates
5. **Compliance**: Better GDPR compliance (no third-party data sharing)

## Format & Browser Support

All fonts are in WOFF2 format, which provides:
- Best compression (~30% smaller than WOFF)
- Broad browser support (all modern browsers)
- Optimized for web delivery

### Variable Font Fallbacks

Noto Sans uses a variable font file that supports all weights (100-900) in a single file. For older browser compatibility, the same file is declared multiple times with specific weight values:

- **Modern browsers** (Chrome 88+, Firefox 62+, Safari 11.1+): Use the variable font with weight range `100 900`
- **Older browsers**: Fall back to specific weight declarations (400, 600, 700) using the same file
- **Format support**:
  - `woff2-variations` for variable font support
  - `woff2` fallback for browsers without variable font support

### Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 88+ | Variable fonts ✓ |
| Chrome | 62+ | WOFF2 static ✓ |
| Firefox | 62+ | Variable fonts ✓ |
| Firefox | 39+ | WOFF2 static ✓ |
| Safari | 11.1+ | Variable fonts ✓ |
| Safari | 10+ | WOFF2 static ✓ |
| Edge | 79+ | Variable fonts ✓ |
| Edge | 14+ | WOFF2 static ✓ |

Browsers without WOFF2 support (IE 11 and older) will fall back to system fonts defined in the font stack.

## Unicode Range

Fonts include Latin character set (unicode-range):
- Basic Latin (U+0000-00FF)
- Latin-1 Supplement
- Latin Extended A
- Common punctuation and symbols
- Currency symbols (€, £, etc.)

## Updates

To update fonts:
1. Download latest versions from Google Fonts
2. Use WOFF2 format with modern browser user-agent
3. Replace files in this directory
4. Update version reference in this README

Last updated: December 2024
