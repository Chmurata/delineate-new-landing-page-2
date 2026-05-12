import { useEffect, useRef, useMemo } from 'react'
import { stagger, createTimeline } from 'animejs'

const PERI = '#7EB8FF'
const STEEL = '#94A6BE'
const ACCENT = '#7C9ED9'

// Sigmoid response — y decreases as response rises (lower y = upper viewBox = higher response)
function efficacyY(x) {
  return 78 - 56 / (1 + Math.exp(-(x - 270) * 0.020))
}
function toxicityY(x) {
  return 78 - 56 / (1 + Math.exp(-(x - 440) * 0.026))
}

const EFFICACY_PATH = (() => {
  const pts = []
  for (let x = 30; x <= 700; x += 6) pts.push(`${x},${efficacyY(x).toFixed(2)}`)
  return 'M' + pts.join(' L')
})()
const TOXICITY_PATH = (() => {
  const pts = []
  for (let x = 30; x <= 700; x += 6) pts.push(`${x},${toxicityY(x).toFixed(2)}`)
  return 'M' + pts.join(' L')
})()

// Therapeutic-window band: between efficacy (upper edge) and toxicity (lower edge), where toxicity > efficacy in y
const WINDOW_PATH = (() => {
  const top = []
  const bottom = []
  for (let x = 30; x <= 700; x += 6) {
    top.push(`${x},${efficacyY(x).toFixed(2)}`)
    bottom.push(`${x},${toxicityY(x).toFixed(2)}`)
  }
  return 'M' + top.join(' L') + ' L' + bottom.reverse().join(' L') + ' Z'
})()

// Optimal dose — pick the x where (toxicity - efficacy) gap is largest
const OPTIMAL_X = (() => {
  let bestX = 30
  let bestGap = 0
  for (let x = 30; x <= 700; x += 4) {
    const gap = toxicityY(x) - efficacyY(x)
    if (gap > bestGap) {
      bestGap = gap
      bestX = x
    }
  }
  return bestX
})()

// 15 ADC ticks at the bottom — deterministic but varied x positions
function makeRng(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// Asset placed at index 11 — well to the right of the class-optimal dose at x≈354.
// Visual story: this asset is currently dosed above the class optimum, leaving room
// for Project Optimus dose-optimization downward.
const ASSET_INDEX = 11

export default function Cs02({ active = false, id = 'cs02', className = '' }) {
  const svgRef = useRef(null)

  const ticks = useMemo(() => {
    const rng = makeRng(11)
    // Even base spacing with small per-tick jitter so they look like real distinct doses
    return Array.from({ length: 15 }, (_, i) => {
      const baseX = 60 + i * 41
      const jitter = (rng() - 0.5) * 22
      return { x: baseX + jitter, isAsset: i === ASSET_INDEX }
    })
  }, [])

  useEffect(() => {
    const root = svgRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const effEl = root.querySelector(`.${id}-eff`)
    const toxEl = root.querySelector(`.${id}-tox`)
    const winEl = root.querySelector(`.${id}-win`)
    const doseEl = root.querySelector(`.${id}-dose`)
    const tickEls = root.querySelectorAll(`.${id}-tick`)
    const assetEl = root.querySelector(`.${id}-asset-tick`)
    const badgeEl = root.querySelector(`.${id}-badge`)
    const labelEl = root.querySelector(`.${id}-dose-label`)

    if (reduce) {
      ;[effEl, toxEl].forEach((el) => {
        if (!el) return
        el.style.strokeDashoffset = '0'
        el.style.opacity = '1'
      })
      if (winEl) winEl.style.opacity = '0.22'
      if (doseEl) { doseEl.style.strokeDashoffset = '0'; doseEl.style.opacity = '0.7' }
      if (labelEl) labelEl.style.opacity = '0.85'
      tickEls.forEach((el) => { el.style.opacity = '0.4' })
      if (assetEl) assetEl.style.opacity = '1'
      if (badgeEl) badgeEl.style.opacity = '1'
      return
    }

    if (!active) return

    ;[effEl, toxEl].forEach((el) => {
      if (!el) return
      const len = el.getTotalLength?.() || 700
      el.style.strokeDasharray = String(len)
      el.style.strokeDashoffset = String(len)
      el.style.opacity = '1'
    })
    if (doseEl) {
      doseEl.style.strokeDasharray = '92'
      doseEl.style.strokeDashoffset = '92'
      doseEl.style.opacity = '0.7'
    }

    const tl = createTimeline({ defaults: { ease: 'outQuad' } })
    tl.add(`.${id}-eff`, {
      strokeDashoffset: [(el) => el.getTotalLength?.() || 700, 0],
      duration: 900,
    })
    tl.add(
      `.${id}-tox`,
      {
        strokeDashoffset: [(el) => el.getTotalLength?.() || 700, 0],
        duration: 900,
      },
      '-=700',
    )
    tl.add(`.${id}-win`, { opacity: [0, 0.22], duration: 380 }, '-=200')
    tl.add(`.${id}-dose`, { strokeDashoffset: [92, 0], duration: 280 }, '-=120')
    tl.add(`.${id}-dose-label`, { opacity: [0, 0.85], duration: 240 }, '-=120')
    tl.add(
      `.${id}-tick`,
      { opacity: [0, (el) => (el.classList.contains(`${id}-asset-tick`) ? 1 : 0.4)], duration: 280, delay: stagger(22) },
      '-=240',
    )
    tl.add(`.${id}-badge`, { opacity: [0, 1], duration: 320 }, '-=180')

    return () => tl?.pause?.()
  }, [active, id])

  const efficacyAtOptimal = efficacyY(OPTIMAL_X)
  const toxicityAtOptimal = toxicityY(OPTIMAL_X)

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
      <title>Therapeutic-window dose map — efficacy vs toxicity curves with the optimal-dose marker, 15 approved ADCs ticked along the x-axis</title>

      {/* Therapeutic-window band (between the two curves) */}
      <path
        className={`${id}-win`}
        d={WINDOW_PATH}
        fill={PERI}
        opacity={0}
      />

      {/* Efficacy curve (bright periwinkle) */}
      <path
        className={`${id}-eff`}
        d={EFFICACY_PATH}
        stroke={PERI}
        strokeWidth={1.3}
        fill="none"
        style={{ opacity: 0 }}
      />

      {/* Toxicity curve (dimmer steel-blue) */}
      <path
        className={`${id}-tox`}
        d={TOXICITY_PATH}
        stroke={STEEL}
        strokeWidth={1.1}
        fill="none"
        style={{ opacity: 0 }}
      />

      {/* Curve termini labels */}
      <text
        x={706}
        y={efficacyY(700) - 4}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={7}
        fontWeight={600}
        fill={PERI}
        opacity={0.7}
        textAnchor="end"
      >
        efficacy
      </text>
      <text
        x={706}
        y={toxicityY(700) + 11}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={7}
        fontWeight={600}
        fill={STEEL}
        opacity={0.7}
        textAnchor="end"
      >
        toxicity
      </text>

      {/* Optimal-dose vertical marker */}
      <line
        className={`${id}-dose`}
        x1={OPTIMAL_X}
        y1={14}
        x2={OPTIMAL_X}
        y2={94}
        stroke={PERI}
        strokeWidth={0.8}
        strokeDasharray="3 3"
        opacity={0}
      />
      <text
        className={`${id}-dose-label`}
        x={OPTIMAL_X}
        y={11}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={7.5}
        fontWeight={600}
        letterSpacing={0.3}
        fill={PERI}
        opacity={0}
        textAnchor="middle"
      >
        Optimal dose
      </text>
      <circle
        cx={OPTIMAL_X}
        cy={(efficacyAtOptimal + toxicityAtOptimal) / 2}
        r={2.2}
        fill={PERI}
        className={`${id}-dose-label`}
        style={{ opacity: 0 }}
      />

      {/* 15 ADC tick row at the bottom */}
      <line x1={28} y1={101} x2={702} y2={101} stroke={PERI} strokeWidth={0.4} opacity={0.18} />
      {ticks.map((t, i) => (
        <line
          key={i}
          className={`${id}-tick${t.isAsset ? ` ${id}-asset-tick` : ''}`}
          x1={t.x}
          y1={97}
          x2={t.x}
          y2={105}
          stroke={PERI}
          strokeWidth={t.isAsset ? 1.4 : 0.7}
          opacity={0}
        />
      ))}
      {/* Asset marker dot above its tick */}
      <circle
        cx={ticks[ASSET_INDEX].x}
        cy={93}
        r={1.7}
        fill={PERI}
        className={`${id}-tick ${id}-asset-tick`}
        style={{ opacity: 0 }}
      />
      <text
        x={32}
        y={115}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={6.5}
        fontWeight={500}
        fill={ACCENT}
        opacity={0.5}
      >
        n=15 ADCs · class benchmark
      </text>

      {/* Project Optimus badge — top left (moved from top-right to avoid overlap
          with the efficacy / toxicity curve-terminus labels) */}
      <g className={`${id}-badge`} style={{ opacity: 0 }}>
        <rect
          x={24}
          y={9}
          width={130}
          height={22}
          rx={11}
          ry={11}
          fill={`${PERI}14`}
          stroke={PERI}
          strokeWidth={0.7}
          opacity={0.75}
        />
        <text
          x={89}
          y={23.5}
          fontFamily="Inter, system-ui, sans-serif"
          fontSize={9.5}
          fontWeight={600}
          letterSpacing={0.1}
          fill={PERI}
          opacity={0.95}
          textAnchor="middle"
        >
          Project Optimus
        </text>
      </g>
    </svg>
  )
}
