import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '../ui/Container'
import CTAButton from '../ui/CTAButton'
import SectionHeading from '../ui/SectionHeading'
import { caseStudies } from '../../content'
import { glassCardStyle } from '../../lib/glass'

const ACCENT = '#7C9ED9'
const AUTO_ADVANCE_MS = 3000

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
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)
  const startRef = useRef(Date.now())
  const item = caseStudies.items[activeIdx]

  const startTimer = useCallback(() => {
    startRef.current = Date.now()
    setProgress(0)
    if (timerRef.current) cancelAnimationFrame(timerRef.current)
    const tick = () => {
      const elapsed = Date.now() - startRef.current
      const pct = Math.min(elapsed / AUTO_ADVANCE_MS, 1)
      setProgress(pct)
      if (pct >= 1) {
        setActiveIdx(prev => (prev + 1) % caseStudies.items.length)
      } else {
        timerRef.current = requestAnimationFrame(tick)
      }
    }
    timerRef.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    startTimer()
    return () => { if (timerRef.current) cancelAnimationFrame(timerRef.current) }
  }, [activeIdx, startTimer])

  return (
    <Container>
      <SectionHeading>{caseStudies.header}</SectionHeading>

      <div className="flex flex-col lg:flex-row gap-6 max-w-[min(960px,90vw)] mx-auto">
        {/* Tabs — horizontal scroll on mobile, vertical sidebar on desktop */}
        <div className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible lg:w-[280px] flex-shrink-0 pb-2 lg:pb-0 scrollbar-hide">
          {caseStudies.items.map((it, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveIdx(i)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="relative overflow-hidden cursor-pointer outline-none text-left flex-shrink-0 rounded-[10px]"
              style={{
                ...glassCardStyle(ACCENT),
                padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2vw, 18px)',
                border: activeIdx === i ? `0.5px solid ${ACCENT}30` : '0.5px solid rgba(100, 160, 230, 0.06)',
                borderLeft: activeIdx === i ? `3px solid ${ACCENT}` : '3px solid transparent',
                background: activeIdx === i ? 'rgba(8, 12, 24, 0.8)' : 'rgba(8, 12, 24, 0.55)',
                minWidth: 200,
              }}
            >
              <div className="font-body text-accent mb-1" style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', opacity: activeIdx === i ? 1 : 0.5 }}>
                {it.tag}
              </div>
              <div className="font-heading text-sm leading-tight truncate max-w-[240px]" style={{ fontWeight: activeIdx === i ? 600 : 500, color: activeIdx === i ? '#FFFFFF' : '#9BA3A0' }}>
                {it.title}
              </div>
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-[10px] overflow-hidden" style={{ background: `${ACCENT}15` }}>
                <div style={{
                  height: '100%', width: activeIdx === i ? `${progress * 100}%` : '0%',
                  background: ACCENT, borderRadius: 1,
                  opacity: activeIdx === i ? 1 : 0,
                  transition: activeIdx === i ? 'opacity 0.15s' : 'opacity 0.25s, width 0s 0.25s',
                }} />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Detail panel */}
        <div className="flex-1 relative" style={{ minHeight: 'clamp(300px, 40vw, 360px)' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIdx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.25 }}
              className="rounded-3xl h-full flex flex-col overflow-hidden"
              style={{ ...glassCardStyle(ACCENT), background: 'rgba(8, 12, 24, 0.35)' }}
            >
              {/* Image */}
              <div className="overflow-hidden" style={{ height: 'clamp(140px, 20vw, 180px)', background: 'linear-gradient(135deg, rgba(8, 12, 24, 0.9) 0%, rgba(20, 35, 70, 0.5) 100%)' }}>
                {item.image ? (
                  <img src={item.image} alt={item.imageAlt || item.title} className="w-full h-full object-cover" />
                ) : (
                  <ImagePlaceholder tag={item.tag} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col gap-3" style={{ padding: 'clamp(16px, 3vw, 24px) clamp(20px, 3vw, 28px)' }}>
                <h3 className="font-heading font-semibold text-text-heading" style={{ fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: 1.3 }}>
                  {item.title}
                </h3>
                <p className="font-body text-accent opacity-60" style={{ fontSize: 'clamp(11px, 1.3vw, 13px)' }}>
                  {item.metrics}
                </p>
                <p className="font-heading text-text-body" style={{ fontSize: 'clamp(13px, 1.5vw, 15px)', lineHeight: '24px' }}>
                  {item.description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* CTA #2 — same Neon Glow style as hero */}
      <div className="flex justify-center mt-12">
        <CTAButton variant="primary">Book a Free Discovery Call</CTAButton>
      </div>
    </Container>
  )
}
