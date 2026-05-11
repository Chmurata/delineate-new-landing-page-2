import { useMemo, useRef, memo } from 'react'

import Container from '../../../ui/Container'
import SectionHeading from '../../../ui/SectionHeading'
import { glassCardStyle } from '../../../../lib/glass'
import { capabilities } from '../../../../content'
import { Ill01, Ill02, Ill03, Ill04, Ill05 } from '../illustrations'

const ACCENT = '#7C9ED9'
const ILLUSTRATIONS = [Ill01, Ill02, Ill03, Ill04, Ill05]

const NUMERAL_GRADIENT = 'linear-gradient(90deg, #5B7FBF, #7C9ED9, #A8C4E8, #B8D4F0, #7C9ED9, #5B7FBF, #7C9ED9)'

// Thread geometry — vertical SVG drawn down the spine column.
// Stage rhythm is fixed by SVG height per stage so the path math is stable.
const STAGE_H = 480 // px per stage in the desktop layout
const STAGE_COUNT = 5
const NODE_SIZE = 64
const THREAD_W = 80
const THREAD_TOTAL_H = STAGE_H * STAGE_COUNT

function buildThreadPath() {
  // Simple straight vertical line through the center of the column.
  // Soft sinusoidal sway adds organic feel without breaking node alignment.
  const cx = THREAD_W / 2
  const segs = []
  segs.push(`M ${cx} 0`)
  const swayAmp = 6
  const segPerStage = 8
  for (let s = 0; s < STAGE_COUNT; s++) {
    for (let i = 1; i <= segPerStage; i++) {
      const y = s * STAGE_H + (i / segPerStage) * STAGE_H
      const phase = ((s * segPerStage + i) / segPerStage) * Math.PI
      const x = cx + Math.sin(phase) * swayAmp
      segs.push(`L ${x.toFixed(2)} ${y.toFixed(2)}`)
    }
  }
  return segs.join(' ')
}

function NumeralNode({ number, lit }) {
  return (
    <div
      className="relative flex items-center justify-center font-heading font-extrabold leading-none"
      style={{
        width: NODE_SIZE,
        height: NODE_SIZE,
        borderRadius: 14,
        ...glassCardStyle(ACCENT),
        border: `1px solid ${lit ? `${ACCENT}AA` : `${ACCENT}33`}`,
        boxShadow: lit
          ? `0 0 24px -2px ${ACCENT}66, inset 0 1px 0 rgba(255,255,255,0.08)`
          : `inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 16px -4px ${ACCENT}14`,
        transition: 'border 0.4s ease, box-shadow 0.4s ease',
      }}
    >
      <span
        style={{
          fontSize: 26,
          background: NUMERAL_GRADIENT,
          backgroundSize: '300% 100%',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {number}
      </span>
    </div>
  )
}

const Stage = memo(function Stage({ item, index, Illustration, active }) {
  return (
    <div
      data-stage={index}
      className="relative grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start"
      style={{ minHeight: STAGE_H }}
    >
      {/* Numeral column (desktop) — placed inside the spine column visually,
          but rendered here so its vertical position is content-driven */}
      <div className="hidden md:flex md:col-span-2 justify-center pt-6">
        <NumeralNode number={item.number} lit={active} />
      </div>

      {/* Mobile numeral inline */}
      <div className="flex md:hidden items-center gap-4">
        <NumeralNode number={item.number} lit={active} />
        <h3
          className="font-heading font-semibold text-text-heading"
          style={{ fontSize: 'clamp(16px, 4.2vw, 18px)', lineHeight: '24px' }}
        >
          {item.title}
        </h3>
      </div>

      {/* Content + illustration panel */}
      <div className="md:col-span-10 flex flex-col gap-4">
        <div className="hidden md:block">
          <h3
            className="font-heading font-semibold text-text-heading mb-2"
            style={{ fontSize: 'clamp(18px, 2vw, 22px)', lineHeight: '28px' }}
          >
            {item.title}
          </h3>
          <p
            className="font-heading text-text-body max-w-[60ch]"
            style={{ fontSize: 'clamp(13px, 1.5vw, 14px)', lineHeight: '22px' }}
          >
            {item.description}
          </p>
        </div>

        <div
          className="rounded-2xl p-4 md:p-6"
          style={{ ...glassCardStyle(ACCENT), aspectRatio: '3 / 2', maxHeight: 360 }}
        >
          <Illustration active={active} id={`wt-ill-${index + 1}`} className="w-full h-full" />
        </div>

        {/* Mobile description below illustration */}
        <p
          className="md:hidden font-heading text-text-body"
          style={{ fontSize: 'clamp(13px, 3.6vw, 14px)', lineHeight: '22px' }}
        >
          {item.description}
        </p>
      </div>
    </div>
  )
})

export default function WorkflowTheater() {
  const items = capabilities.items
  const sectionRef = useRef(null)
  const spineRef = useRef(null)

  const threadPath = useMemo(() => buildThreadPath(), [])

  return (
    <Container>
      <SectionHeading className="text-center !mb-2">{capabilities.header}</SectionHeading>
      <p
        className="font-heading text-text-body text-center mx-auto mb-12"
        style={{ fontSize: 'clamp(14px, 1.8vw, 16px)', maxWidth: 640 }}
      >
        {capabilities.subheader}
      </p>

      <div ref={sectionRef} className="relative max-w-[min(1080px,92vw)] mx-auto">
        {/* Thread — desktop only, absolutely positioned in the left spine column */}
        <div
          ref={spineRef}
          aria-hidden="true"
          className="hidden md:block pointer-events-none absolute top-0 bottom-0"
          style={{
            // Align with the col-span-2 numeral column. md grid is 12-col with gap-8 (32px).
            // Spine column starts at col 1, span 2 — center it within that.
            left: 'calc((100% - 11 * 2rem) / 12 + 1rem - 40px)',
            width: THREAD_W,
          }}
        >
          <svg
            viewBox={`0 0 ${THREAD_W} ${THREAD_TOTAL_H}`}
            preserveAspectRatio="none"
            width={THREAD_W}
            height="100%"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="wt-thread-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ACCENT} stopOpacity="1" />
                <stop offset="100%" stopColor={ACCENT} stopOpacity="0.6" />
              </linearGradient>
              <filter id="wt-thread-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Underlay — faint full thread for unscrolled state */}
            <path
              d={threadPath}
              stroke={`${ACCENT}1F`}
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="flex flex-col">
          {items.map((item, i) => (
            <Stage
              key={item.number}
              item={item}
              index={i}
              Illustration={ILLUSTRATIONS[i]}
              active={true}
            />
          ))}
        </div>
      </div>
    </Container>
  )
}
