import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { createTimeline, stagger } from 'animejs'

// Continuous loops (skeleton shimmer + slow seal rotation) are intentionally
// disabled. The illustration plays its entrance timeline once and then
// settles. Flip to `true` to re-enable.
const CONTINUOUS_LOOPS_ENABLED = true

const ACCENT = '#7C9ED9'
const NEON_BLUE = '#00BFFF'
const PERI = '#7EB8FF'
const CORAL = '#FF9B7A'
const GOLD = '#FFC75A'
const GREEN = '#6BFFAA'

// Card geometry — 4 cards stacked vertically with slight horizontal offset (fanned-hand feel)
const CARD_W = 340
const CARD_H = 52
const CARD_BASE_X = 70
const CARD_BASE_Y = 66
const CARD_GAP = 8
const CARD_OFFSETS = [-8, -2, 4, 10]

const BLOCKS = [
  { color: PERI, label: 'MODEL DIAGNOSTICS', visual: 'scatter', step: '01' },
  { color: NEON_BLUE, label: 'E-R PLOTS', visual: 'curve', step: '02' },
  { color: GOLD, label: 'INDIRECT COMPARISON', visual: 'grid', step: '03' },
  { color: CORAL, label: 'BRIEFING MEMO', visual: 'lines', step: '04' },
]

const SEAL_CX = 442
const SEAL_CY = 274
const SEAL_R = 20

// 5-pointed star path centered at (0,0), outer r=8, inner r=3.4
function starPath(cx, cy, rOuter = 8, rInner = 3.4) {
  const pts = []
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? rOuter : rInner
    const ang = (Math.PI / 5) * i - Math.PI / 2
    pts.push(`${cx + r * Math.cos(ang)},${cy + r * Math.sin(ang)}`)
  }
  return `M${pts[0]} L${pts.slice(1).join(' L')} Z`
}

// Scatter dots on a hairline x-axis
function ScatterVisual({ x, y, w, h, color, idCls }) {
  const dots = [0.08, 0.18, 0.3, 0.42, 0.55, 0.68, 0.82, 0.93]
  const baseY = y + h - 6
  return (
    <g className={idCls}>
      <line
        x1={x + 4}
        y1={baseY}
        x2={x + w - 4}
        y2={baseY}
        stroke={color}
        strokeWidth={0.8}
        opacity={0.5}
      />
      {dots.map((p, i) => {
        const cy = baseY - (4 + ((i * 7) % 14))
        return <circle key={i} cx={x + 4 + p * (w - 8)} cy={cy} r={1.6} fill={color} opacity={0.9} />
      })}
    </g>
  )
}

function CurveVisual({ x, y, w, h, color, idCls }) {
  const x0 = x + 4
  const x1 = x + w - 4
  const yBase = y + h - 4
  const yTop = y + 4
  const d = `M${x0},${yBase - 2} C${x0 + (x1 - x0) * 0.3},${yBase} ${x0 + (x1 - x0) * 0.55},${yTop + 2} ${x1},${yTop + 4}`
  const dots = [
    { cx: x0 + (x1 - x0) * 0.15, cy: yBase - 4 },
    { cx: x0 + (x1 - x0) * 0.4, cy: yBase - 10 },
    { cx: x0 + (x1 - x0) * 0.65, cy: yTop + 6 },
    { cx: x0 + (x1 - x0) * 0.88, cy: yTop + 5 },
  ]
  return (
    <g className={idCls}>
      <path d={d} fill="none" stroke={color} strokeWidth={1.2} opacity={0.95} />
      {dots.map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={1.6} fill={color} />
      ))}
    </g>
  )
}

function GridVisual({ x, y, w, h, color, idCls }) {
  const cols = 4
  const rows = 3
  const padX = 6
  const padY = 4
  const cellW = (w - padX * 2) / cols
  const cellH = (h - padY * 2) / rows
  const widths = [0.9, 0.6, 0.75, 0.5, 0.85, 0.55, 0.7, 0.9, 0.6, 0.5, 0.8, 0.65]
  return (
    <g className={idCls}>
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((__, c) => {
          const i = r * cols + c
          const cx = x + padX + c * cellW
          const cy = y + padY + r * cellH + cellH / 2 - 1
          return (
            <rect
              key={i}
              x={cx + 2}
              y={cy}
              width={Math.max(8, (cellW - 6) * widths[i])}
              height={2}
              rx={1}
              fill={color}
              opacity={0.85}
            />
          )
        }),
      )}
      {Array.from({ length: rows - 1 }).map((_, r) => (
        <line
          key={`h${r}`}
          x1={x + padX}
          y1={y + padY + (r + 1) * cellH}
          x2={x + w - padX}
          y2={y + padY + (r + 1) * cellH}
          stroke={color}
          strokeWidth={0.4}
          opacity={0.3}
        />
      ))}
    </g>
  )
}

function LinesVisual({ x, y, w, h, color, idCls }) {
  const widths = [0.95, 0.75, 0.88, 0.6, 0.7]
  const padX = 6
  const padY = 3
  const lineH = 2.4
  const gap = (h - padY * 2 - lineH * widths.length) / (widths.length - 1)
  return (
    <g className={idCls}>
      {widths.map((wp, i) => (
        <rect
          key={i}
          x={x + padX}
          y={y + padY + i * (lineH + gap)}
          width={(w - padX * 2) * wp}
          height={lineH}
          rx={1}
          fill={color}
          opacity={0.8}
        />
      ))}
    </g>
  )
}

const VISUAL_MAP = {
  scatter: ScatterVisual,
  curve: CurveVisual,
  grid: GridVisual,
  lines: LinesVisual,
}

export default function Ill05({ active = false, className = '', id = 'ill05' }) {
  const svgRef = useRef(null)
  const prefersReduce = useReducedMotion()

  useEffect(() => {
    const root = svgRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const cards = root.querySelectorAll(`.${id}-card`)
    const dividers = root.querySelectorAll(`.${id}-divider`)
    const visuals = root.querySelectorAll(`.${id}-visual`)
    const connectors = root.querySelectorAll(`.${id}-connector`)
    const seal = root.querySelector(`.${id}-seal`)
    const shimmers = root.querySelectorAll(`.${id}-shimmer`)

    dividers.forEach((d) => {
      const len = d.getTotalLength?.() || CARD_W
      d.style.strokeDasharray = String(len)
      d.style.strokeDashoffset = String(len)
    })
    connectors.forEach((c) => {
      const len = c.getTotalLength?.() || 30
      c.style.strokeDasharray = String(len)
      c.style.strokeDashoffset = String(len)
    })

    if (reduce) {
      cards.forEach((c) => {
        c.style.opacity = '1'
        c.style.transform = 'translateY(0)'
      })
      dividers.forEach((d) => {
        d.style.strokeDashoffset = '0'
      })
      visuals.forEach((v) => {
        v.style.opacity = '1'
      })
      connectors.forEach((c) => {
        c.style.strokeDashoffset = '0'
      })
      if (seal) {
        seal.style.opacity = '1'
        seal.style.transform = 'scale(1) rotate(0deg)'
      }
      shimmers.forEach((s) => {
        s.style.animationPlayState = 'paused'
      })
      // Soft fade-in to final state — no movement, just opacity.
      root.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: 'ease-out', fill: 'backwards' })
      return
    }

    if (!active) return

    const tl = createTimeline({ defaults: { ease: 'outQuad' } })
    tl.add(`.${id}-card`, {
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 600,
      delay: stagger(180),
    })
      .add(
        `.${id}-divider`,
        { strokeDashoffset: [(_, i) => dividers[i].getTotalLength?.() || CARD_W, 0], duration: 500, delay: stagger(180) },
        '-=900',
      )
      .add(
        `.${id}-visual`,
        { opacity: [0, 1], duration: 500, delay: stagger(180) },
        '-=800',
      )
      .add(
        `.${id}-connector`,
        { strokeDashoffset: [(_, i) => connectors[i].getTotalLength?.() || 30, 0], duration: 400, delay: stagger(80) },
        '-=300',
      )
      .add(
        `.${id}-seal`,
        {
          opacity: [0, 1],
          scale: [0, 1.15, 1],
          rotate: [-30, 0],
          duration: 800,
          ease: 'outBack',
        },
        '-=200',
      )

    return () => tl?.pause?.()
  }, [active, id])

  const loopOn = CONTINUOUS_LOOPS_ENABLED && active && !prefersReduce
  const shimmerStyle =
    CONTINUOUS_LOOPS_ENABLED && !prefersReduce
      ? { animation: `${id}-shimmer 1.8s linear infinite` }
      : { animation: 'none' }

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 480 320"
      width="100%"
      height="100%"
      role="img"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <title>Submission-ready output documents fanned with a green approval seal</title>
      <defs>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`${id}-seal-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {BLOCKS.map((b, i) => (
          <filter key={i} id={`${id}-card-glow-${i}`} x="-20%" y="-50%" width="140%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor={b.color} floodOpacity="0.18" />
            <feComposite in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
        <linearGradient id={`${id}-shimmer-grad`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={ACCENT} stopOpacity="0.15" />
          <stop offset="50%" stopColor={ACCENT} stopOpacity="0.55" />
          <stop offset="100%" stopColor={ACCENT} stopOpacity="0.15" />
        </linearGradient>
        <style>{`
          @keyframes ${id}-shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(220%); }
          }
        `}</style>
      </defs>

      {/* Card frame — Ill03 chrome standard */}
      <rect
        x={6}
        y={6}
        width={468}
        height={308}
        rx={14}
        ry={14}
        fill="rgba(8,12,24,0.35)"
        filter={`url(#${id}-soft)`}
      />

      {/* Header */}
      <text
        x={22}
        y={30}
        fill={PERI}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={10}
        fontWeight={600}
        letterSpacing={1.2}
      >
        SUBMISSION-READY
      </text>

      <g>
        <rect x={372} y={18} width={88} height={18} rx={9} ry={9} fill={`${PERI}14`} stroke={PERI} strokeWidth={0.8} strokeOpacity={0.55} />
        <text
          x={416}
          y={30}
          fill={PERI}
          fontFamily="Inter, system-ui, sans-serif"
          fontSize={8}
          fontWeight={700}
          letterSpacing={0.8}
          textAnchor="middle"
          opacity={0.85}
        >
          FDA · EMA · HTA
        </text>
      </g>

      {/* Hairline divider */}
      <line x1={18} y1={50} x2={462} y2={50} stroke="#2A3A5A" strokeWidth={0.6} strokeOpacity={0.5} />

      {/* Connector hairlines between card right edges */}
      <g>
        {BLOCKS.slice(0, -1).map((_, i) => {
          const x1 = CARD_BASE_X + CARD_OFFSETS[i] + CARD_W - 14
          const y1 = CARD_BASE_Y + i * (CARD_H + CARD_GAP) + CARD_H
          const x2 = CARD_BASE_X + CARD_OFFSETS[i + 1] + CARD_W - 14
          const y2 = CARD_BASE_Y + (i + 1) * (CARD_H + CARD_GAP)
          return (
            <line
              key={`conn-${i}`}
              className={`${id}-connector`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={PERI}
              strokeWidth={0.8}
              opacity={0.2}
            />
          )
        })}
      </g>

      {/* Cards */}
      <g>
        {BLOCKS.map((b, i) => {
          const x = CARD_BASE_X + CARD_OFFSETS[i]
          const y = CARD_BASE_Y + i * (CARD_H + CARD_GAP)
          const Visual = VISUAL_MAP[b.visual]
          const visualX = x + 12
          const visualY = y + 18
          const visualW = CARD_W - 90
          const visualH = CARD_H - 22
          const shimmerX = x + CARD_W - 64
          const shimmerY = y + 22
          return (
            <g
              key={i}
              className={`${id}-card`}
              style={{
                opacity: 0,
                transformOrigin: `${x + CARD_W / 2}px ${y + CARD_H / 2}px`,
              }}
              filter={`url(#${id}-card-glow-${i})`}
            >
              {/* Card background */}
              <rect
                x={x}
                y={y}
                width={CARD_W}
                height={CARD_H}
                rx={6}
                fill="rgba(8,12,24,0.55)"
                stroke={b.color}
                strokeWidth={1.2}
                opacity={0.95}
              />
              {/* Header label */}
              <text
                x={x + 12}
                y={y + 11}
                fill={b.color}
                fontSize={7}
                fontWeight={700}
                letterSpacing={0.8}
                style={{ textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif' }}
              >
                {b.label}
              </text>
              {/* Step chip */}
              <text
                x={x + CARD_W - 12}
                y={y + 11}
                fill={b.color}
                fontSize={6}
                fontWeight={600}
                textAnchor="end"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {b.step}
              </text>
              {/* Hairline divider */}
              <line
                className={`${id}-divider`}
                x1={x + 8}
                y1={y + 15}
                x2={x + CARD_W - 8}
                y2={y + 15}
                stroke={b.color}
                strokeWidth={0.6}
                opacity={0.3}
              />
              {/* Content visual */}
              <g
                className={`${id}-visual`}
                style={{ opacity: 0 }}
              >
                <Visual
                  x={visualX}
                  y={visualY}
                  w={visualW}
                  h={visualH}
                  color={b.color}
                  idCls={`${id}-visual-inner`}
                />
              </g>
              {/* Skeleton shimmer cells */}
              <g>
                {[0, 1].map((s) => (
                  <g key={s}>
                    <rect
                      x={shimmerX}
                      y={shimmerY + s * 10}
                      width={50}
                      height={4}
                      rx={2}
                      fill={b.color}
                      opacity={0.18}
                    />
                    <clipPath id={`${id}-clip-${i}-${s}`}>
                      <rect
                        x={shimmerX}
                        y={shimmerY + s * 10}
                        width={50}
                        height={4}
                        rx={2}
                      />
                    </clipPath>
                    <g clipPath={`url(#${id}-clip-${i}-${s})`}>
                      <rect
                        className={`${id}-shimmer`}
                        x={shimmerX}
                        y={shimmerY + s * 10}
                        width={30}
                        height={4}
                        fill={`url(#${id}-shimmer-grad)`}
                        style={{
                          ...shimmerStyle,
                          animationDelay: `${s * 0.4 + i * 0.15}s`,
                          transformOrigin: `${shimmerX}px ${shimmerY + s * 10}px`,
                          transformBox: 'fill-box',
                        }}
                      />
                    </g>
                  </g>
                ))}
              </g>
            </g>
          )
        })}
      </g>

      {/* GREEN approval seal — top-right corner */}
      <motion.g
        className={`${id}-seal`}
        style={{ opacity: 0, transformOrigin: `${SEAL_CX}px ${SEAL_CY}px` }}
        animate={loopOn ? { rotate: 360 } : { rotate: 0 }}
        transition={loopOn ? { duration: 30, repeat: Infinity, ease: 'linear' } : { duration: 0 }}
        filter={`url(#${id}-seal-glow)`}
      >
        <circle
          cx={SEAL_CX}
          cy={SEAL_CY}
          r={SEAL_R}
          fill="rgba(107,255,170,0.15)"
          stroke={GREEN}
          strokeWidth={1.5}
          opacity={0.85}
        />
        <circle
          cx={SEAL_CX}
          cy={SEAL_CY}
          r={SEAL_R - 4}
          fill="none"
          stroke={GREEN}
          strokeWidth={0.6}
          opacity={0.4}
        />
        <path
          d={starPath(SEAL_CX, SEAL_CY - 2, 8, 3.4)}
          fill={GREEN}
          opacity={0.95}
        />
        <text
          x={SEAL_CX}
          y={SEAL_CY + 14}
          textAnchor="middle"
          fill={GREEN}
          fontSize={5}
          fontWeight={700}
          letterSpacing={0.6}
          style={{ textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif' }}
        >
          APPROVED
        </text>
      </motion.g>
    </svg>
  )
}
