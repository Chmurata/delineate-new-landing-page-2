/* ───────────────────────────────────────────────────────────
 * Capability Illustrations — interface contract
 *
 * Each illustration renders inside a 480×320 logical viewBox.
 * Uses periwinkle (#7C9ED9) only — locked palette.
 *
 * Props for ALL illustrations:
 *   - active (boolean) — when true, plays the entrance timeline. Layouts
 *                        decide when to flip this (intersection observer,
 *                        scroll trigger, hover, etc.).
 *   - className (string) — wrapper class for sizing.
 *   - id (string) — optional unique id for scroll-trigger keys.
 *
 * Each illustration is responsible for its own continuous ambient loops
 * (halos, pings, candidate-curve morphs). It pauses when off-screen via
 * its own IntersectionObserver. Respects prefers-reduced-motion.
 * ─────────────────────────────────────────────────────────── */

export { default as Ill01 } from './Ill01.jsx'
export { default as Ill02 } from './Ill02.jsx'
export { default as Ill03 } from './Ill03.jsx'
export { default as Ill04 } from './Ill04.jsx'
export { default as Ill05 } from './Ill05.jsx'

export const ILLUSTRATIONS = [
  { id: 'ill01', component: 'Ill01' },
  { id: 'ill02', component: 'Ill02' },
  { id: 'ill03', component: 'Ill03' },
  { id: 'ill04', component: 'Ill04' },
  { id: 'ill05', component: 'Ill05' },
]

export const ACCENT = '#7C9ED9'
