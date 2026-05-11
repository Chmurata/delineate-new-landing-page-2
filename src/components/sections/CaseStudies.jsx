import { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import Container from '../ui/Container'
import CTAButton from '../ui/CTAButton'
import SectionHeading from '../ui/SectionHeading'
import { caseStudies, hero } from '../../content'
import { glassCardStyle } from '../../lib/glass'

const ACCENT = '#7C9ED9'
const PERI = '#7EB8FF'
const AUTO_ADVANCE_MS = 3000

// Keyframe injection (once, module-scope) — scoped pulse for the active tab indicator
if (typeof document !== 'undefined' && !document.getElementById('cs-tab-indicator-keyframes')) {
  const style = document.createElement('style')
  style.id = 'cs-tab-indicator-keyframes'
  style.textContent = `
    @keyframes csTabPulse {
      0%   { opacity: 0.95; }
      50%  { opacity: 0.45; }
      100% { opacity: 0.95; }
    }
  `
  document.head.appendChild(style)
}

function ImagePlaceholder({ tag }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ background: 'linear-gradient(135deg, rgba(8, 12, 24, 0.9) 0%, rgba(20, 35, 70, 0.7) 100%)' }}>
      <svg width="120" height="60" viewBox="0 0 120 60" fill="none" style={{ opacity: 0.3 }}>
        <path d="M5 50 Q20 45, 35 30 T65 20 T95 10 T115 5" stroke={ACCENT} strokeWidth="1.5" fill="none" />
        <path d="M5 55 Q25 48, 40 40 T70 30 T100 22 T115 18" stroke={ACCENT} strokeWidth="1" fill="none" opacity="0.5" />
        {[15, 35, 55, 75, 95].map((x, i) => (
          <circle key={i} cx={x} cy={50 - i * 8 - 2} r="2.5" fill={ACCENT} opacity="0.5" />
        ))}
      </svg>
      <span className="font-body text-accent opacity-40" style={{ fontSize: 10, fontWeight: 600, letterSpacing: 2 }}>
        {tag || 'DATA'}
      </span>
    </div>
  )
}

export default function CaseStudies() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const rowRef = useRef(null)
  const tabRefs = useRef([])
  const indicatorRef = useRef(null)
  const prefersReduce = useReducedMotion()

  // Auto-advance: simple setTimeout that resets on activeIdx change
  useEffect(() => {
    if (prefersReduce) return
    const id = setTimeout(() => {
      setActiveIdx((i) => (i + 1) % caseStudies.items.length)
    }, AUTO_ADVANCE_MS)
    return () => clearTimeout(id)
  }, [activeIdx, prefersReduce])

  // Measure the active tab's left/width — re-run on activeIdx change AND on resize
  useLayoutEffect(() => {
    const measure = () => {
      const row = rowRef.current
      const el = tabRefs.current[activeIdx]
      if (!row || !el) return
      const rowRect = row.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      setIndicator({ left: elRect.left - rowRect.left, width: elRect.width })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [activeIdx])

  // Restart the indicator's pulse keyframe on every tab change so the
  // brightness oscillation stays in sync with the auto-advance cycle.
  useEffect(() => {
    const el = indicatorRef.current
    if (!el || prefersReduce) return
    el.style.animation = 'none'
    // Force reflow so the browser restarts the animation
    void el.offsetHeight
    el.style.animation = `csTabPulse ${AUTO_ADVANCE_MS}ms ease-in-out infinite`
  }, [activeIdx, prefersReduce])

  return (
    <Container>
      <SectionHeading className="text-center">{caseStudies.header}</SectionHeading>

      <div className="flex flex-col gap-6 max-w-[min(960px,90vw)] mx-auto">
        {/* Tabs — concept B: tag-only labels, single sliding hairline indicator below */}
        <div
          ref={rowRef}
          className="relative flex justify-center flex-wrap gap-x-7 gap-y-3 lg:gap-x-9 px-2"
          style={{ paddingBottom: 10 }}
        >
          {caseStudies.items.map((it, i) => {
            const isActive = i === activeIdx
            return (
              <button
                key={i}
                ref={(el) => (tabRefs.current[i] = el)}
                onClick={() => setActiveIdx(i)}
                className="cursor-pointer outline-none"
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: 13,
                  letterSpacing: '0.02em',
                  textTransform: 'none',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? PERI : `${PERI}80`,
                  padding: '4px 2px',
                  background: 'none',
                  border: 'none',
                  transition: 'color 220ms ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = `${PERI}CC` }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = `${PERI}80` }}
              >
                {it.tag}
              </button>
            )
          })}

          {/* Full-width hairline rail */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 pointer-events-none"
            style={{ bottom: 0, height: 1, background: `${PERI}22` }}
          />

          {/* Active sliding indicator — slides via CSS transition; pulse restarts via effect */}
          <div
            ref={indicatorRef}
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              bottom: 0,
              left: indicator.left,
              width: indicator.width,
              height: 2,
              background: PERI,
              transition: 'left 380ms cubic-bezier(0.16, 1, 0.3, 1), width 380ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        {/* Detail panel — ONE shared card chrome on the outside; the 5 content variants
            crossfade inside a CSS grid so their glass backgrounds don't stack on top of
            each other during the transition (which was making the area brighter mid-fade). */}
        <div className="rounded-3xl overflow-hidden" style={glassCardStyle(ACCENT)}>
          <div style={{ display: 'grid' }}>
            {caseStudies.items.map((it, i) => {
              const isActive = i === activeIdx
              return (
                <motion.div
                  key={i}
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="flex flex-col"
                  style={{
                    gridColumn: 1,
                    gridRow: 1,
                    pointerEvents: isActive ? 'auto' : 'none',
                  }}
                  aria-hidden={!isActive}
                >
                  {/* Image */}
                  <div className="overflow-hidden" style={{ height: 'clamp(140px, 20vw, 180px)', background: 'linear-gradient(135deg, rgba(8, 12, 24, 0.9) 0%, rgba(20, 35, 70, 0.5) 100%)' }}>
                    {it.image ? (
                      <img src={it.image} alt={it.imageAlt || it.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImagePlaceholder tag={it.tag} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col gap-3" style={{ padding: 'clamp(16px, 3vw, 24px) clamp(20px, 3vw, 28px)' }}>
                    <h3 className="font-heading font-semibold text-text-heading" style={{ fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: 1.3 }}>
                      {it.title}
                    </h3>
                    <p className="font-body text-accent opacity-60" style={{ fontSize: 'clamp(11px, 1.3vw, 13px)' }}>
                      {it.metrics}
                    </p>
                    {(it.paragraphs || [it.description]).filter(Boolean).map((para, pi) => (
                      <p key={pi} className="font-heading text-text-body" style={{ fontSize: 'clamp(13px, 1.5vw, 15px)', lineHeight: '24px' }}>
                        {para}
                      </p>
                    ))}

                    {it.readMoreHref && (
                      <a
                        href={it.readMoreHref}
                        aria-disabled={it.readMoreHref === '#'}
                        onClick={e => { if (it.readMoreHref === '#') e.preventDefault() }}
                        tabIndex={isActive ? 0 : -1}
                        className="inline-flex items-center gap-1.5 mt-2 font-body font-semibold transition-opacity duration-200"
                        style={{
                          color: ACCENT,
                          fontSize: 'clamp(12px, 1.4vw, 13px)',
                          letterSpacing: '0.3px',
                          opacity: it.readMoreHref === '#' ? 0.55 : 1,
                          cursor: it.readMoreHref === '#' ? 'not-allowed' : 'pointer',
                          textDecoration: 'none',
                          width: 'fit-content',
                        }}
                      >
                        {caseStudies.readMoreLabel || 'Read more'}
                        <ArrowRightIcon style={{ width: 12, height: 12, flexShrink: 0 }} />
                      </a>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CTA #2 — same Neon Glow style as hero */}
      <div className="flex justify-center mt-12">
        <CTAButton variant="primary">{hero.cta.primary}</CTAButton>
      </div>
    </Container>
  )
}
