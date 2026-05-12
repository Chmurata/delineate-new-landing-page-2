import { useEffect, useRef } from 'react'
import { stagger, createTimeline } from 'animejs'

const PERI = '#7EB8FF'
const ACCENT = '#7C9ED9'

// Two parallel trajectories: upper biomarker (y 18-44), lower clinical outcome (y 70-100)
// Both descend over time. Outcome lags biomarker slightly.
function biomarkerY(x) {
  // descending sigmoid from y=20 to y=42 across x=30..690
  return 20 + 22 / (1 + Math.exp(-(x - 330) * 0.011))
}
function outcomeY(x) {
  return 74 + 24 / (1 + Math.exp(-(x - 420) * 0.011))
}

const BIO_PATH = (() => {
  const pts = []
  for (let x = 30; x <= 690; x += 6) pts.push(`${x},${biomarkerY(x).toFixed(2)}`)
  return 'M' + pts.join(' L')
})()
const OUT_PATH = (() => {
  const pts = []
  for (let x = 30; x <= 690; x += 6) pts.push(`${x},${outcomeY(x).toFixed(2)}`)
  return 'M' + pts.join(' L')
})()

// 10 correlation strand x-positions
const STRAND_XS = Array.from({ length: 10 }, (_, i) => 60 + i * 66)

// Year ticks at the bottom
const YEAR_TICKS = Array.from({ length: 7 }, (_, i) => 80 + i * 95)

const QUAL_X = 668
const QUAL_Y = 26

export default function Cs05({ active = false, id = 'cs05', className = '' }) {
  const svgRef = useRef(null)

  useEffect(() => {
    const root = svgRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const bioEl = root.querySelector(`.${id}-bio`)
    const outEl = root.querySelector(`.${id}-out`)
    const strands = root.querySelectorAll(`.${id}-strand`)
    const qualEl = root.querySelector(`.${id}-qual`)
    const labels = root.querySelectorAll(`.${id}-label`)

    if (reduce) {
      if (bioEl) { bioEl.style.strokeDashoffset = '0'; bioEl.style.opacity = '1' }
      if (outEl) { outEl.style.strokeDashoffset = '0'; outEl.style.opacity = '1' }
      strands.forEach((el) => { el.style.opacity = '0.45' })
      if (qualEl) qualEl.style.opacity = '1'
      labels.forEach((el) => { el.style.opacity = '0.7' })
      return
    }

    if (!active) return

    ;[bioEl, outEl].forEach((el) => {
      if (!el) return
      const len = el.getTotalLength?.() || 700
      el.style.strokeDasharray = String(len)
      el.style.strokeDashoffset = String(len)
      el.style.opacity = '1'
    })

    const tl = createTimeline({ defaults: { ease: 'outQuad' } })
    tl.add(
      [`.${id}-bio`, `.${id}-out`],
      {
        strokeDashoffset: [(el) => el.getTotalLength?.() || 700, 0],
        duration: 900,
        delay: stagger(120),
      },
    )
    tl.add(`.${id}-strand`, { opacity: [0, 0.55], duration: 360, delay: stagger(55) }, '-=420')
    tl.add(`.${id}-qual`, { opacity: [0, 1], scale: [0.6, 1], duration: 320 }, '-=120')
    tl.add(`.${id}-label`, { opacity: [0, 0.7], duration: 280, delay: stagger(60) }, '-=240')

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
      <title>Parallel biomarker and clinical-outcome trajectories with vertical correlation strands</title>

      {/* Correlation strands — connect matched time points between curves */}
      {STRAND_XS.map((x, i) => (
        <line
          key={i}
          className={`${id}-strand`}
          x1={x}
          y1={biomarkerY(x)}
          x2={x}
          y2={outcomeY(x)}
          stroke={PERI}
          strokeWidth={0.55}
          style={{ opacity: 0 }}
        />
      ))}

      {/* Biomarker trajectory (upper) */}
      <path
        className={`${id}-bio`}
        d={BIO_PATH}
        stroke={PERI}
        strokeWidth={1.3}
        fill="none"
        style={{ opacity: 0 }}
      />
      {/* Clinical outcome trajectory (lower) */}
      <path
        className={`${id}-out`}
        d={OUT_PATH}
        stroke="#A8C4E8"
        strokeWidth={1.1}
        fill="none"
        style={{ opacity: 0 }}
      />

      {/* Year-tick markers along the bottom */}
      {YEAR_TICKS.map((x, i) => (
        <line key={i} x1={x} y1={113} x2={x} y2={117} stroke={ACCENT} strokeWidth={0.5} opacity={0.35} />
      ))}

      {/* Curve labels at right termini */}
      <text
        className={`${id}-label`}
        x={696}
        y={biomarkerY(690) - 4}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={7}
        fontWeight={600}
        fill={PERI}
        opacity={0}
        textAnchor="end"
      >
        biomarker
      </text>
      <text
        className={`${id}-label`}
        x={696}
        y={outcomeY(690) + 11}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={7}
        fontWeight={600}
        fill="#A8C4E8"
        opacity={0}
        textAnchor="end"
      >
        clinical outcome
      </text>

      {/* Qualification mark — abstract concentric */}
      <g
        className={`${id}-qual`}
        style={{ opacity: 0, transformOrigin: `${QUAL_X}px ${QUAL_Y}px` }}
      >
        <circle cx={QUAL_X} cy={QUAL_Y} r={8.5} fill="none" stroke="#94A6BE" strokeWidth={0.7} opacity={0.5} />
        <circle cx={QUAL_X} cy={QUAL_Y} r={5} fill="none" stroke="#94A6BE" strokeWidth={0.7} opacity={0.7} />
        <circle cx={QUAL_X} cy={QUAL_Y} r={1.8} fill="#94A6BE" opacity={0.9} />
      </g>

      {/* Corner label */}
      <text
        x={30}
        y={114}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={6.5}
        fontWeight={500}
        fill={ACCENT}
        opacity={0.45}
      >
        decades of trial data · regulatory-grade
      </text>
    </svg>
  )
}
