/* eslint-disable */
/**
 * ARCHIVED — Databases Terminal pipeline strip
 *
 * The 7-step horizontal pipeline strip (Extract → Arbitrate → Verify →
 * Consistency → Outlier flag → Audit trail → Deliver) with a GSAP-driven
 * traveling light beam that brightens each bar and label as it passes.
 *
 * Replaced 2026-05-12 by ProvenanceConstellation per Jawad's feedback
 * asking for a network-graph visual. Kept here in case we want to bring
 * it back as another Databases layout variant.
 *
 * Original location: src/components/sections/databases/layouts/Terminal.jsx
 *
 * Usage notes if you ever re-import this:
 *   - Depends on `gsap` and `framer-motion`'s `useReducedMotion`.
 *   - Requires the parent stacking context to be relative so the
 *     `pipeline-beam` div can position absolutely against it.
 *   - The beam uses `mix-blend-mode: screen` — looks correct only on a
 *     dark backdrop.
 */
import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import gsap from 'gsap'

const PERI = '#7EB8FF'
const LABEL_DIM = 'rgba(220,230,245,0.55)'

const PIPELINE = [
  'Extract',
  'Arbitrate',
  'Verify',
  'Consistency',
  'Outlier flag',
  'Audit trail',
  'Deliver',
]

export default function PipelineStrip() {
  const prefersReduce = useReducedMotion()
  const scopeRef = useRef(null)

  useEffect(() => {
    if (prefersReduce) return
    const ctx = gsap.context(() => {
      // Beam travels left -10% → 110% (centre offset 5% → 105%). Total centre travel = 100% over CYCLE.
      const CYCLE = 16 // seconds — slow, meditative pass
      const tl = gsap.timeline({ repeat: -1 })

      // Beam motion — linear, full cycle
      tl.fromTo(
        '.pipeline-beam',
        { left: '-12%' },
        { left: '112%', duration: CYCLE, ease: 'none' },
        0,
      )

      // Sympathetic glow on each bar + label as beam centre passes
      PIPELINE.forEach((_, i) => {
        // Beam centre starts at -7%, ends at 117%. Total centre travel = 124%.
        // Bar i centre sits at (i + 0.5) × (100/7)% = (i + 0.5) × 14.286%.
        const barCentrePct = (i + 0.5) * (100 / PIPELINE.length)
        const t = (CYCLE * (barCentrePct - -7)) / 124

        // Bar fades in/out (no scale — full width all along, just opacity)
        tl.to(`.pipeline-bar-${i}`, { opacity: 1, duration: 0.9, ease: 'sine.in' }, t - 0.9)
        tl.to(`.pipeline-bar-${i}`, { opacity: 0, duration: 1.1, ease: 'sine.out' }, t + 0.2)

        // Label glows subtly — softer brightness than full PERI, eased
        tl.to(`.pipeline-label-${i}`, { color: PERI, duration: 0.8, ease: 'sine.in' }, t - 0.7)
        tl.to(`.pipeline-label-${i}`, { color: LABEL_DIM, duration: 1.0, ease: 'sine.out' }, t + 0.3)
      })
    }, scopeRef)
    return () => ctx.revert()
  }, [prefersReduce])

  return (
    <div ref={scopeRef} className="mt-10 relative">
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${PIPELINE.length}, minmax(0, 1fr))` }}
      >
        {PIPELINE.map((step, i) => (
          <div key={step} className="flex flex-col items-stretch">
            <div
              style={{
                height: 3,
                background: 'rgba(126, 184, 255, 0.15)',
                borderRadius: 2,
                overflow: 'hidden',
                marginBottom: 8,
              }}
            >
              <div
                className={`pipeline-bar-${i}`}
                style={{
                  height: '100%',
                  width: '100%',
                  background: PERI,
                  opacity: 0,
                }}
              />
            </div>
            <span
              className={`pipeline-label-${i} font-body text-center`}
              style={{
                fontSize: 11,
                color: LABEL_DIM,
                letterSpacing: '0.02em',
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
              }}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      {/* Traveling beam — soft glowing light passing over the strip */}
      {!prefersReduce && (
        <div
          className="pipeline-beam"
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: -16,
            left: '-12%',
            width: '14%',
            height: 60,
            background:
              'radial-gradient(ellipse at center, rgba(126,184,255,0.45) 0%, rgba(126,184,255,0.12) 40%, transparent 75%)',
            filter: 'blur(6px)',
            pointerEvents: 'none',
            mixBlendMode: 'screen',
          }}
        />
      )}
    </div>
  )
}
