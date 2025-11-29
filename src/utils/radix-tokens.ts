import { cyanDark, goldDark, slateDark, bronzeDark, slateDarkA } from '@radix-ui/colors';

/**
 * Color tokens mapping Radix UI Colors to semantic CSS variables
 * Maintains compatibility with existing variable names while leveraging Radix's accessibility-focused scales
 */
export const colorTokens = {
  // Primitive colors (maintain naming compatibility)
  '--color-bronze': bronzeDark.bronze9,
  '--color-sage': goldDark.gold10,
  '--color-charcoal': slateDark.slate3,
  '--color-teal': cyanDark.cyan10,
  '--color-silver': slateDark.slate6,
  '--color-white': slateDark.slate12,

  // Semantic tokens
  '--color-text': slateDark.slate12,
  '--color-muted': slateDark.slate11,
  '--color-accent': cyanDark.cyan10,
  '--color-accent-secondary': goldDark.gold10,
  '--color-bg-primary': slateDark.slate1,
  '--color-bg-elevated': slateDark.slate3,
  '--color-bg-hover': slateDark.slate5,
  '--color-text-primary': slateDark.slate12,
  '--color-text-muted': slateDark.slate11,
  '--color-border': slateDarkA.slateA6,
};

/**
 * Generates CSS custom property declarations from color tokens
 * @returns CSS string ready for injection into :root selector
 */
export function generateColorCSS(): string {
  const entries = Object.entries(colorTokens);
  return entries.map(([key, value]) => `  ${key}: ${value};`).join('\n');
}
