import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import gsap from 'gsap'
import {
  CheckCircle,
  MagnifyingGlass,
  LinkSimple,
  Flag,
  ShieldCheck,
  Quotes,
} from '@phosphor-icons/react'
import Container from '../../../ui/Container'
import { glassCardStyle } from '../../../../lib/glass'
import { databases } from '../../../../content'

const ACCENT = '#7C9ED9'
const PERI = '#7EB8FF'
const LABEL_DIM = 'rgba(220,230,245,0.55)'

const IO_FORMATS = ['NONMEM', 'Monolix', 'Phoenix NLME', 'R / Python', 'Excel']

const INTEGRITY = [
  { label: 'Double-blind QC', Icon: CheckCircle },
  { label: 'Source-verified', Icon: MagnifyingGlass },
  { label: 'Cross-checked', Icon: LinkSimple },
  { label: 'Outlier-flagged', Icon: Flag },
  { label: 'Audit-ready', Icon: ShieldCheck },
]

const PIPELINE = [
  'Extract',
  'Arbitrate',
  'Verify',
  'Consistency',
  'Outlier flag',
  'Audit trail',
  'Deliver',
]

function RailLabel({ children, align = 'left' }) {
  return (
    <div
      className="flex flex-col gap-1"
      style={{ alignItems: align === 'right' ? 'flex-end' : 'flex-start' }}
    >
      <span
        className="font-body"
        style={{
          fontSize: 11,
          color: PERI,
          letterSpacing: '0.04em',
          fontWeight: 600,
          opacity: 0.85,
        }}
      >
        {children}
      </span>
      <div style={{ height: 1, width: 28, background: `${PERI}66` }} />
    </div>
  )
}

function FormatChip({ label }) {
  return (
    <div
      className="rounded-lg"
      style={{ ...glassCardStyle(ACCENT), padding: '10px 12px' }}
    >
      <span
        className="font-body text-text-heading"
        style={{
          fontSize: 12,
          letterSpacing: '0.02em',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  )
}

function IntegrityChip({ Icon, label, align = 'left' }) {
  return (
    <div
      className="rounded-lg flex items-center gap-2"
      style={{
        ...glassCardStyle(ACCENT),
        padding: '10px 12px',
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      }}
    >
      {align === 'left' && <Icon size={14} color={PERI} weight="thin" />}
      <span
        className="font-body text-text-heading"
        style={{
          fontSize: 12,
          letterSpacing: '0.02em',
          fontWeight: 500,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      {align === 'right' && <Icon size={14} color={PERI} weight="thin" />}
    </div>
  )
}

function PipelineStrip() {
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
        const t = CYCLE * (barCentrePct - -7) / 124

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

function PullQuote({ children }) {
  return (
    <div className="mt-12 flex justify-center">
      <div className="relative max-w-[min(820px,90vw)] text-center">
        <Quotes
          size={64}
          color={PERI}
          weight="fill"
          style={{
            position: 'absolute',
            top: -28,
            left: -8,
            opacity: 0.18,
            pointerEvents: 'none',
          }}
        />
        <p
          className="font-heading italic text-text-heading"
          style={{
            fontSize: 'clamp(16px, 2vw, 22px)',
            lineHeight: 1.4,
            fontWeight: 500,
            opacity: 0.95,
          }}
        >
          {children}
        </p>
        <div
          className="mx-auto mt-5"
          style={{ width: 48, height: 2, background: PERI, opacity: 0.7 }}
        />
      </div>
    </div>
  )
}

export default function Terminal() {
  return (
    <Container>
      <div className="max-w-[min(1240px,94vw)] mx-auto">
        {/* Mobile-only formats strip */}
        <div className="lg:hidden flex flex-wrap gap-2 mb-4">
          {IO_FORMATS.map((f) => (
            <FormatChip key={f} label={f} />
          ))}
        </div>

        <div className="grid grid-cols-12 gap-5 relative items-stretch">
          <aside className="hidden lg:flex col-span-2 flex-col gap-4 justify-center">
            <RailLabel>I/O Formats</RailLabel>
            <div className="flex flex-col gap-2">
              {IO_FORMATS.map((f) => (
                <FormatChip key={f} label={f} />
              ))}
            </div>
          </aside>

          <div className="col-span-12 lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl relative overflow-hidden"
              style={{
                ...glassCardStyle(ACCENT),
                padding: 'clamp(32px, 4vw, 56px)',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
                  backgroundSize: '22px 22px',
                  pointerEvents: 'none',
                  opacity: 0.5,
                }}
              />

              <div className="relative" style={{ zIndex: 1 }}>
                <h2
                  className="font-heading font-bold text-text-heading mb-6"
                  style={{
                    fontSize: 'clamp(1.5rem, 3.2vw, 2.125rem)',
                    lineHeight: 1.18,
                    maxWidth: 720,
                  }}
                >
                  {databases.title}
                </h2>

                <p
                  className="font-heading text-text-body"
                  style={{
                    fontSize: 'clamp(13px, 1.5vw, 15px)',
                    lineHeight: '26px',
                    maxWidth: 760,
                  }}
                >
                  {databases.body}
                </p>

                <PipelineStrip />
              </div>
            </motion.div>
          </div>

          <aside className="hidden lg:flex col-span-2 flex-col gap-4 justify-center">
            <RailLabel align="right">Integrity Check</RailLabel>
            <div className="flex flex-col gap-2">
              {INTEGRITY.map(({ label, Icon }) => (
                <IntegrityChip key={label} label={label} Icon={Icon} align="right" />
              ))}
            </div>
          </aside>
        </div>

        <div className="lg:hidden flex flex-wrap gap-2 mt-4">
          {INTEGRITY.map(({ label, Icon }) => (
            <IntegrityChip key={label} label={label} Icon={Icon} />
          ))}
        </div>

        <PullQuote>{databases.pullquote}</PullQuote>
      </div>
    </Container>
  )
}
