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

## Format

All fonts are in WOFF2 format, which provides:
- Best compression (~30% smaller than WOFF)
- Broad browser support (all modern browsers)
- Optimized for web delivery

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
