import { useRef, useState, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/20/solid'
import {
  CheckCircle,
  MagnifyingGlass,
  LinkSimple,
  Flag,
  ShieldCheck,
} from '@phosphor-icons/react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import { caseStudies } from '../../content'
import { glassCardStyle } from '../../lib/glass'
import { Cs01, Cs02, Cs03, Cs04, Cs05 } from './case-studies/illustrations'

const CASE_STUDY_ILLUSTRATIONS = [Cs01, Cs02, Cs03, Cs04, Cs05]

const ACCENT = '#7C9ED9'
const PERI = '#7EB8FF'

const GUARANTEE_ICONS = [CheckCircle, MagnifyingGlass, LinkSimple, Flag, ShieldCheck]

function GuaranteeCell({ text, Icon, index, isLast }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: 0.05 * index, duration: 0.4 }}
      className={`flex items-center gap-3 flex-1 min-w-0 ${
        isLast ? '' : 'border-b lg:border-b-0 lg:border-r'
      }`}
      style={{
        padding: '14px 18px',
        borderColor: 'rgba(126, 184, 255, 0.10)',
      }}
    >
      <Icon size={18} color={PERI} weight="thin" style={{ flexShrink: 0 }} />
      <p
        className="font-heading text-text-heading"
        style={{ fontSize: 12.5, lineHeight: '17px', fontWeight: 500, textWrap: 'balance' }}
      >
        {text}
      </p>
    </motion.div>
  )
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
  const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0 })
  const rowRef = useRef(null)
  const tabRefs = useRef([])

  // Measure the active tab's left/top/width — handles wrapped rows
  useLayoutEffect(() => {
    const measure = () => {
      const row = rowRef.current
      const el = tabRefs.current[activeIdx]
      if (!row || !el) return
      const rowRect = row.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      setIndicator({
        left: elRect.left - rowRect.left,
        top: elRect.bottom - rowRect.top + 4,
        width: elRect.width,
      })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [activeIdx])

  return (
    <Container>
      <SectionHeading className="text-center !mb-6">{caseStudies.header}</SectionHeading>

      {/* Intro blurb — relocated from the removed Databases section */}
      <p
        className="font-heading text-text-body mx-auto text-center"
        style={{
          fontSize: 'clamp(14px, 1.4vw, 16px)',
          lineHeight: 1.55,
          maxWidth: 720,
          marginBottom: 28,
          opacity: 0.9,
        }}
      >
        {caseStudies.intro}
      </p>

      {/* Consolidated guarantee table strip */}
      <div className="mx-auto" style={{ maxWidth: 'min(1320px, 94vw)', marginBottom: 56 }}>
        <div
          className="rounded-xl flex flex-col lg:flex-row"
          style={{
            ...glassCardStyle(ACCENT),
            border: '1px solid rgba(126, 184, 255, 0.12)',
            overflow: 'hidden',
          }}
        >
          {caseStudies.guarantees.map((text, i) => (
            <GuaranteeCell
              key={i}
              text={text}
              Icon={GUARANTEE_ICONS[i]}
              index={i}
              isLast={i === caseStudies.guarantees.length - 1}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 max-w-[min(960px,90vw)] mx-auto">
        {/* Tabs — concept B: tag-only labels, single sliding hairline indicator below */}
        <div
          ref={rowRef}
          className="relative flex justify-center flex-wrap gap-x-6 gap-y-4 lg:gap-x-8 px-2"
          style={{ paddingBottom: 14 }}
        >
          {caseStudies.items.map((it, i) => {
            const isActive = i === activeIdx
            return (
              <button
                key={i}
                ref={(el) => (tabRefs.current[i] = el)}
                onClick={() => setActiveIdx(i)}
                className="cursor-pointer outline-none"
                className="font-heading"
                style={{
                  fontSize: 14,
                  letterSpacing: '-0.005em',
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

          {/* Active sliding indicator — tracks the active tab even when the row wraps */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              top: indicator.top,
              left: indicator.left,
              width: indicator.width,
              height: 2,
              background: PERI,
              transition:
                'left 380ms cubic-bezier(0.16, 1, 0.3, 1), top 380ms cubic-bezier(0.16, 1, 0.3, 1), width 380ms cubic-bezier(0.16, 1, 0.3, 1)',
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
                  {/* Banner illustration — top of card */}
                  <div className="overflow-hidden relative" style={{ height: 'clamp(140px, 20vw, 180px)', background: 'linear-gradient(135deg, rgba(8, 12, 24, 0.92) 0%, rgba(16, 28, 56, 0.65) 100%)' }}>
                    {it.image ? (
                      <img src={it.image} alt={it.imageAlt || it.title} className="w-full h-full object-cover" />
                    ) : CASE_STUDY_ILLUSTRATIONS[i] ? (
                      (() => {
                        const Illust = CASE_STUDY_ILLUSTRATIONS[i]
                        return (
                          <Illust
                            active={isActive}
                            id={`cs-banner-${i + 1}`}
                            className="absolute inset-0 w-full h-full"
                          />
                        )
                      })()
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

    </Container>
  )
}
