// ─── Glass morphism — global standard ────────────────────────────────
// Matches the Hero section's frosted overlay (see HeroSection.jsx).
// Borderless, soft frosted, single source of truth for every card on
// the page. Background, blur depth, and translucency are LOCKED.
//
// If a component wants depth (e.g. stacked deck shadow, hover lift),
// layer those effects ON TOP via inline style — do NOT add borders or
// alternate background tints inside this helper.
// ─────────────────────────────────────────────────────────────────────

const DEFAULT_ACCENT = '#7C9ED9'

const HERO_GLASS_BG = 'rgba(11, 16, 28, 0.35)'
const HERO_GLASS_BG_HOVER = 'rgba(15, 22, 38, 0.5)'

// Static reference for components that prefer a constant.
export const glass = {
  card: {
    background: HERO_GLASS_BG,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
  },
}

// Primary helper — returns the hero-standard frosted glass style.
// `accent` param is preserved for API compatibility but no longer affects
// background or border (borders are removed globally).
// eslint-disable-next-line no-unused-vars
export function glassCardStyle(accent = DEFAULT_ACCENT) {
  return {
    background: HERO_GLASS_BG,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    WebkitTransform: 'translateZ(0)',
    willChange: 'transform, opacity',
    transition: 'background 0.3s ease',
  }
}

// Hover lift — subtle background brightening, no border ring.
// eslint-disable-next-line no-unused-vars
export function glassHoverStyle(accent = DEFAULT_ACCENT) {
  return {
    background: HERO_GLASS_BG_HOVER,
  }
}

// Rest state — pairs with glassHoverStyle for transitions.
// eslint-disable-next-line no-unused-vars
export function glassRestStyle(accent = DEFAULT_ACCENT) {
  return {
    background: HERO_GLASS_BG,
  }
}
