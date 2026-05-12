import { useEffect, useMemo, useRef } from 'react'
import { createTimeline, stagger } from 'animejs'

// Continuous loops are intentionally disabled. The illustration plays its
// entrance timeline once and then settles. Set to `true` later to re-enable
// the candidate-curve morph + data-rain glyph fall.
const CONTINUOUS_LOOPS_ENABLED = true

/* ── Locked color tokens ─────────────────────────────────────────── */
const ACCENT = '#7C9ED9'      // periwinkle, brand chrome
const NEON_BLUE = '#00BFFF'   // central confidence band + prediction
const PERI = '#7EB8FF'        // bottom stage label, candidate family 3
const CORAL = '#FF9B7A'       // candidate family 1
const GOLD = '#FFC75A'        // top stage label "MONTE CARLO", candidate family 2
const GREEN = '#6BFFAA'       // candidate family 4

const FAMILIES = [CORAL, GOLD, PERI, GREEN]

/* ── Plot geometry (frame inset ~6px from 480x320 viewBox) ───────── */
const FRAME = { x: 8, y: 8, w: 464, h: 304, r: 14 }
const PLOT = { x0: 28, x1: 456, y0: 280, y1: 36 }
const N_CANDIDATES = 24

/* ── Deterministic PRNG so render is stable across re-mounts ─────── */
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* Smooth cubic-bezier through plot area at varying heights.
   `lane` (0..1) sets vertical band; jitter shifts control points. */
function makeCurve(rand, lane) {
  const { x0, x1, y0, y1 } = PLOT
  const span = y0 - y1
  const startY = y0 - 6 - rand() * 14
  const endY = y1 + span * (0.85 - lane * 0.7) + (rand() - 0.5) * 30
  const cp1x = x0 + (x1 - x0) * (0.28 + (rand() - 0.5) * 0.12)
  const cp1y = y0 - span * (0.25 + lane * 0.4 + (rand() - 0.5) * 0.18)
  const cp2x = x0 + (x1 - x0) * (0.62 + (rand() - 0.5) * 0.12)
  const cp2y = y1 + span * (0.45 - lane * 0.35 + (rand() - 0.5) * 0.18)
  return `M${x0.toFixed(1)},${startY.toFixed(1)} C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${x1.toFixed(1)},${endY.toFixed(1)}`
}

/* Confidence band: closed shape between an upper and lower curve. */
function makeBand() {
  const { x0, x1, y0, y1 } = PLOT
  const span = y0 - y1
  const upperEnd = y1 + span * 0.18
  const lowerEnd = y1 + span * 0.42
  const upper = `M${x0},${y0 - 22} C${x0 + 130},${y1 + span * 0.35} ${x0 + 280},${y1 + span * 0.10} ${x1},${upperEnd}`
  const lower = ` L${x1},${lowerEnd} C${x0 + 280},${y1 + span * 0.40} ${x0 + 130},${y0 - 6} ${x0},${y0 + 4} Z`
  return upper + lower
}

/* Central predicted curve — runs through the middle of the band. */
function makeCentral() {
  const { x0, x1, y0, y1 } = PLOT
  const span = y0 - y1
  return `M${x0},${y0 - 14} C${x0 + 130},${y1 + span * 0.5} ${x0 + 280},${y1 + span * 0.22} ${x1},${y1 + span * 0.3}`
}

/* Pre-generated candidate paths — deterministic seed per index. */
const CANDIDATES = Array.from({ length: N_CANDIDATES }, (_, i) => {
  const rand = mulberry32(101 + i * 17)
  // Lane spread: 0..1, family color set by index mod 4
  const lane = (i / (N_CANDIDATES - 1)) * 0.85 + (rand() - 0.5) * 0.08
  return {
    d: makeCurve(rand, Math.max(0.05, Math.min(0.98, lane))),
    color: FAMILIES[i % 4],
    opacity: 0.18 + (i % 3) * 0.05, // 0.18..0.28
  }
})

const BAND_PATH = makeBand()
const CENTRAL_PATH = makeCentral()

/* ── Data-rain glyphs — 10 pre-positioned items ──────────────────── */
const RAIN_GLYPHS = ['Cmax', 'AUC', 'PK', 'GLP', 'IC50', 'EC50', 't½', 'nM', 'mg', 'Tmax']
const DATA_GLYPHS = RAIN_GLYPHS.map((g, i) => {
  const rand = mulberry32(2003 + i * 41)
  return {
    glyph: g,
    x: PLOT.x0 + 18 + rand() * (PLOT.x1 - PLOT.x0 - 36),
    yStart: PLOT.y1 + 8 + rand() * 30,
    fall: 140 + rand() * 80,           // distance px
    size: 7 + rand() * 2,              // 7..9px
    opacity: 0.35 + rand() * 0.20,     // 0.35..0.55
    dur: 2.4 + rand() * 1.8,           // 2.4..4.2s
    delay: rand() * 4,                 // stagger
  }
})

/* ── Keyframes (injected once via <style>) ───────────────────────── */
const KEYFRAMES = `
@keyframes ill02_dataFall {
  0%   { transform: translateY(0) scale(0.7); opacity: 0; }
  10%  { transform: translateY(6px) scale(1); opacity: var(--ill02-o); }
  80%  { opacity: var(--ill02-o); }
  100% { transform: translateY(var(--ill02-d)) scale(0.6); opacity: 0; }
}
`

export default function Ill02({ active = false, className = '', id = 'ill02' }) {
  const svgRef = useRef(null)
  const tlRef = useRef(null)

  // Filter / gradient ids scoped to instance.
  const ids = useMemo(() => ({
    glow: `${id}-glow`,
    softGlow: `${id}-softGlow`,
    bandGrad: `${id}-bandGrad`,
  }), [id])

  useEffect(() => {
    const root = svgRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const frame = root.querySelector(`.${id}-frame`)
    const labelTop = root.querySelector(`.${id}-label-top`)
    const labelBot = root.querySelector(`.${id}-label-bot`)
    const candidates = root.querySelectorAll(`.${id}-cand`)
    const band = root.querySelector(`.${id}-band`)
    const central = root.querySelector(`.${id}-central`)
    const glyphs = root.querySelectorAll(`.${id}-glyph`)

    // Initialize stroke-dash for trace-in elements.
    if (frame) {
      const len = frame.getTotalLength?.() || 1500
      frame.style.strokeDasharray = String(len)
      frame.style.strokeDashoffset = String(len)
    }
    candidates.forEach((el) => {
      const len = el.getTotalLength?.() || 500
      el.style.strokeDasharray = String(len)
      el.style.strokeDashoffset = String(len)
    })
    if (central) {
      const len = central.getTotalLength?.() || 500
      central.style.strokeDasharray = String(len)
      central.style.strokeDashoffset = String(len)
    }

    if (reduce) {
      // Snap to final state.
      if (frame) frame.style.strokeDashoffset = '0'
      if (labelTop) labelTop.style.opacity = '1'
      if (labelBot) labelBot.style.opacity = '1'
      candidates.forEach((el, i) => {
        el.style.strokeDashoffset = '0'
        el.style.opacity = String(CANDIDATES[i]?.opacity ?? 0.22)
      })
      if (band) band.style.opacity = '1'
      if (central) {
        central.style.strokeDashoffset = '0'
        central.style.opacity = '0.95'
      }
      glyphs.forEach((g) => { g.style.animation = 'none' })
      // Soft fade-in to final state — no movement, just opacity.
      root.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: 'ease-out', fill: 'backwards' })
      return
    }

    if (!active) {
      tlRef.current?.pause?.()
      glyphs.forEach((g) => { g.style.animationPlayState = 'paused' })
      return
    }

    // Entrance timeline.
    const tl = createTimeline({ defaults: { ease: 'outQuad' } })
    tl.add(`.${id}-frame`, {
      strokeDashoffset: [(_, i) => frame?.getTotalLength?.() || 1500, 0],
      duration: 800,
    })
      .add(`.${id}-label-top`, { opacity: [0, 1], duration: 400 }, '-=400')
      .add(`.${id}-cand`, {
        strokeDashoffset: [(_, i) => candidates[i]?.getTotalLength?.() || 500, 0],
        opacity: [0, (_, i) => CANDIDATES[i]?.opacity ?? 0.22],
        duration: 1200,
        delay: stagger(28),
      }, '-=200')
      .add(`.${id}-band`, { opacity: [0, 1], duration: 600 }, '-=600')
      .add(`.${id}-central`, {
        strokeDashoffset: [(_, i) => central?.getTotalLength?.() || 500, 0],
        opacity: [0, 0.95],
        duration: 900,
      }, '-=400')
      .add(`.${id}-label-bot`, { opacity: [0, 1], duration: 400 }, '-=300')

    tlRef.current = tl

    // Continuous loops (data-rain + candidate-curve morph) are gated behind
    // CONTINUOUS_LOOPS_ENABLED. When false, the illustration finishes its
    // entrance timeline and stays in its final state — no per-frame work.
    if (CONTINUOUS_LOOPS_ENABLED) {
      glyphs.forEach((g) => { g.style.animationPlayState = 'running' })
    }

    return () => {
      tl?.pause?.()
    }
  }, [active, id])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />
      <svg
        ref={svgRef}
        id={`${id}-svg`}
        viewBox="0 0 480 320"
        width="100%"
        height="100%"
        role="img"
        className={className}
        preserveAspectRatio="xMidYMid meet"
      >
        <title>AI Monte Carlo simulation: candidate curves converge into a confidence band and predicted response</title>

        <defs>
          {/* Soft glow filter for prediction curve + glyphs */}
          <filter id={ids.glow} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Subtler glow for frame */}
          <filter id={ids.softGlow} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Confidence band gradient */}
          <linearGradient id={ids.bandGrad} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={NEON_BLUE} stopOpacity={0.10} />
            <stop offset="100%" stopColor={NEON_BLUE} stopOpacity={0.04} />
          </linearGradient>
        </defs>

        {/* 1. Glassmorphic frame */}
        <rect
          x={FRAME.x}
          y={FRAME.y}
          width={FRAME.w}
          height={FRAME.h}
          rx={FRAME.r}
          fill="rgba(8,12,24,0.35)"
        />

        {/* 2. Header — Ill03 chrome standard */}
        <g className={`${id}-label-top`} style={{ opacity: 0 }}>
          <text
            x={FRAME.x + 14}
            y={FRAME.y + 22}
            fontFamily="Inter, system-ui, sans-serif"
            fontSize={10}
            fontWeight={600}
            fill={PERI}
            letterSpacing={1.2}
          >
            MONTE CARLO
          </text>
          <rect
            x={FRAME.x + FRAME.w - 102}
            y={FRAME.y + 10}
            width={94}
            height={18}
            rx={9}
            ry={9}
            fill={`${PERI}14`}
            stroke={PERI}
            strokeWidth={0.8}
            strokeOpacity={0.55}
          />
          <text
            x={FRAME.x + FRAME.w - 55}
            y={FRAME.y + 22}
            fill={PERI}
            fontFamily="Inter, system-ui, sans-serif"
            fontSize={8}
            fontWeight={700}
            letterSpacing={0.8}
            textAnchor="middle"
            opacity={0.85}
          >
            n=24 CANDIDATES
          </text>
          <line
            x1={FRAME.x + 12}
            y1={FRAME.y + 42}
            x2={FRAME.x + FRAME.w - 12}
            y2={FRAME.y + 42}
            stroke="#2A3A5A"
            strokeWidth={0.6}
            strokeOpacity={0.5}
          />
        </g>

        {/* 3. Coordinate axis hairlines */}
        <g stroke="#1A2744" strokeWidth={0.5}>
          <line x1={PLOT.x0} y1={PLOT.y0} x2={PLOT.x1} y2={PLOT.y0} />
          <line x1={PLOT.x0} y1={PLOT.y0} x2={PLOT.x0} y2={PLOT.y1} />
        </g>

        {/* 4. 24 candidate curves — 4 color families, family by i % 4 */}
        <g fill="none" strokeWidth={0.8} strokeLinecap="round">
          {CANDIDATES.map((c, i) => (
            <path
              key={i}
              className={`${id}-cand`}
              d={c.d}
              stroke={c.color}
              opacity={0}
            />
          ))}
        </g>

        {/* 5. Confidence band */}
        <path
          className={`${id}-band`}
          d={BAND_PATH}
          fill={`url(#${ids.bandGrad})`}
          opacity={0}
        />

        {/* 6. Central predicted curve — bold, glowing */}
        <path
          className={`${id}-central`}
          d={CENTRAL_PATH}
          fill="none"
          stroke={NEON_BLUE}
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0}
          filter={`url(#${ids.glow})`}
        />

        {/* 7. Data-rain glyphs — CSS keyframe fall, paused until active+inView */}
        <g fontFamily="Inter, system-ui, sans-serif" fontWeight={600}>
          {DATA_GLYPHS.map((g, i) => (
            <text
              key={i}
              className={`${id}-glyph`}
              x={g.x}
              y={g.yStart}
              fontSize={g.size}
              fill={NEON_BLUE}
              style={{
                ['--ill02-d']: `${g.fall}px`,
                ['--ill02-o']: g.opacity,
                animation: `ill02_dataFall ${g.dur}s ease-in ${g.delay}s infinite`,
                animationPlayState: 'paused',
                filter: `drop-shadow(0 0 4px ${NEON_BLUE}80)`,
                willChange: 'transform, opacity',
              }}
            >
              {g.glyph}
            </text>
          ))}
        </g>

        {/* 8. Bottom stage label "PREDICTED RESPONSE" */}
        <g className={`${id}-label-bot`} style={{ opacity: 0 }}>
          <text
            x={FRAME.x + FRAME.w - 14}
            y={FRAME.y + FRAME.h - 12}
            textAnchor="end"
            fontFamily="Inter, sans-serif"
            fontSize={9}
            fontWeight={600}
            fill={PERI}
            opacity={0.35}
            letterSpacing={1.2}
            filter={`url(#${ids.glow})`}
          >
            PREDICTED RESPONSE
          </text>
          <text
            x={FRAME.x + FRAME.w - 14}
            y={FRAME.y + FRAME.h - 12}
            textAnchor="end"
            fontFamily="Inter, sans-serif"
            fontSize={9}
            fontWeight={600}
            fill={PERI}
            letterSpacing={1.2}
          >
            PREDICTED RESPONSE
          </text>
        </g>
      </svg>
    </>
  )
}
