// Glass morphism utilities — ported from prototype tokens.js
// Default accent: periwinkle #7C9ED9

const DEFAULT_ACCENT = '#7C9ED9'

// Unified glass card base style
export const glass = {
  card: {
    background: 'rgba(8, 12, 24, 0.55)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '0.5px solid rgba(100, 160, 230, 0.12)',
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 2px 16px -4px rgba(100, 160, 230, 0.08)',
    transition: 'border 0.3s ease, box-shadow 0.3s ease',
  },
}

// Accent-aware glass card style
export function glassCardStyle(accent = DEFAULT_ACCENT) {
  return {
    background: 'rgba(8, 12, 24, 0.35)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    WebkitTransform: 'translateZ(0)',
    willChange: 'transform, opacity, box-shadow',
    border: `0.5px solid ${accent}1F`,
    boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 2px 16px -4px ${accent}14`,
    transition: 'border 0.3s ease, box-shadow 0.3s ease',
  }
}

// Hover style — apply on mouseEnter
export function glassHoverStyle(accent = DEFAULT_ACCENT) {
  return {
    border: `0.5px solid ${accent}35`,
    boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 28px -6px ${accent}28`,
  }
}

// Rest style — apply on mouseLeave
export function glassRestStyle(accent = DEFAULT_ACCENT) {
  return {
    border: `0.5px solid ${accent}1F`,
    boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 2px 16px -4px ${accent}14`,
  }
}
