import { useEffect, useRef, useMemo } from 'react'
import { stagger, createTimeline } from 'animejs'

const PERI = '#7EB8FF'
const ACCENT = '#7C9ED9'

// Phase rows (y-coordinates within viewBox 0 0 720 120)
const PHASES = [
  { key: 'PH1', y: 100 },
  { key: 'PH2', y: 75 },
  { key: 'PH3', y: 50 },
  { key: 'APPR', y: 25 },
]

// 16 assets — bottom-up filled to a varying max phase, target highlighted
// Hand-tuned for visual rhythm rather than randomness
const ASSETS = [
  { maxPhase: 1, highlighted: false },
  { maxPhase: 2, highlighted: false },
  { maxPhase: 1, highlighted: false },
  { maxPhase: 3, highlighted: false },
  { maxPhase: 2, highlighted: false },
  { maxPhase: 4, highlighted: false },
  { maxPhase: 1, highlighted: false },
  { maxPhase: 2, highlighted: false },
  { maxPhase: 4, highlighted: true },  // <- target asset, fully approved
  { maxPhase: 3, highlighted: false },
  { maxPhase: 2, highlighted: false },
  { maxPhase: 1, highlighted: false },
  { maxPhase: 3, highlighted: false },
  { maxPhase: 4, highlighted: false },
  { maxPhase: 2, highlighted: false },
  { maxPhase: 1, highlighted: false },
]

const COL_X_START = 92
const COL_X_END = 700
const COL_STEP = (COL_X_END - COL_X_START) / (ASSETS.length - 1)

export default function Cs04({ active = false, id = 'cs04', className = '' }) {
  const svgRef = useRef(null)

  const nodes = useMemo(() => {
    const arr = []
    ASSETS.forEach((asset, colIdx) => {
      const x = COL_X_START + colIdx * COL_STEP
      PHASES.forEach((p, phaseIdx) => {
        const filled = phaseIdx + 1 <= asset.maxPhase
        if (!filled) return
        arr.push({ x, y: p.y, highlighted: asset.highlighted, key: `${colIdx}-${phaseIdx}` })
      })
    })
    return arr
  }, [])

  useEffect(() => {
    const root = svgRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const dotEls = root.querySelectorAll(`.${id}-dot`)
    const highlightedEls = root.querySelectorAll(`.${id}-highlighted`)

    if (reduce) {
      dotEls.forEach((el) => { el.style.opacity = el.classList.contains(`${id}-highlighted`) ? '1' : '0.32' })
      return
    }

    if (!active) return

    const tl = createTimeline({ defaults: { ease: 'outQuad' } })
    tl.add(`.${id}-dot`, {
      opacity: [
        0,
        (el) => (el.classList.contains(`${id}-highlighted`) ? 1 : 0.32),
      ],
      scale: [0.4, 1],
      duration: 320,
      delay: stagger(22),
    })

    return () => tl?.pause?.()
  }, [active, id])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 720 120"
      width="100%"
      height="100%"
      role="img"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <title>Competitive pipeline landscape — 16 assets across four trial phases, target asset highlighted</title>

      {/* Phase track grid lines */}
      {PHASES.map((p) => (
        <line
          key={p.key}
          x1={84}
          y1={p.y}
          x2={710}
          y2={p.y}
          stroke={PERI}
          strokeWidth={0.4}
          opacity={0.1}
        />
      ))}

      {/* Phase row labels */}
      {PHASES.map((p) => (
        <text
          key={p.key}
          x={76}
          y={p.y + 2.5}
          fontFamily="Inter, system-ui, sans-serif"
          fontSize={6.5}
          fontWeight={600}
          letterSpacing={1}
          fill={PERI}
          opacity={0.5}
          textAnchor="end"
        >
          {p.key}
        </text>
      ))}

      {/* Phase dots */}
      {nodes.map((n) => (
        <circle
          key={n.key}
          className={n.highlighted ? `${id}-dot ${id}-highlighted` : `${id}-dot`}
          cx={n.x}
          cy={n.y}
          r={n.highlighted ? 3.2 : 2.2}
          fill={PERI}
          style={{
            opacity: 0,
            transformOrigin: `${n.x}px ${n.y}px`,
            filter: n.highlighted ? `drop-shadow(0 0 4px ${PERI})` : 'none',
          }}
        />
      ))}

      {/* Corner label */}
      <text
        x={92}
        y={117}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={6.5}
        fontWeight={500}
        fill={ACCENT}
        opacity={0.45}
      >
        16 assets · multi-year congress mining
      </text>
    </svg>
  )
}
