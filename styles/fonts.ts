export const fontConfig = {
  display: {
    family: 'Canela',
    fallback: '"Cormorant Garamond", "Playfair Display", Georgia, serif',
    weights: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  body: {
    family: 'Neue Haas Grotesk',
    fallback: '"Inter", "Helvetica Neue", system-ui, sans-serif',
    weights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  mono: {
    family: 'JetBrains Mono',
    fallback: 'ui-monospace, monospace',
    weights: {
      regular: 400,
    },
  },
} as const;

export const fontStacks = {
  display: `${fontConfig.display.family}, ${fontConfig.display.fallback}`,
  body: `${fontConfig.body.family}, ${fontConfig.body.fallback}`,
  mono: `${fontConfig.mono.family}, ${fontConfig.mono.fallback}`,
} as const;
