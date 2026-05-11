import { useEffect, useRef } from 'react'
import { stagger, createTimeline } from 'animejs'

const ACCENT = '#7C9ED9'
const NEON_BLUE = '#00BFFF'
const PERI = '#7EB8FF'
const CORAL = '#FF9B7A'
const GOLD = '#FFC75A'
const GREEN = '#6BFFAA'

// 6 docs on the left with mixed accent colors + content visuals.
// Each doc has a label color matching one of the hero source types.
const DOC_TYPES = [
  { color: CORAL, label: 'PAPER', visual: 'lines' },
  { color: PERI, label: 'CHART', visual: 'chart' },
  { color: GREEN, label: 'TRIAL', visual: 'grid' },
  { color: GOLD, label: 'FDA', visual: 'ema' },
  { color: PERI, label: 'EMA', visual: 'ema' },
  { color: CORAL, label: 'CONFERENCE POSTER', visual: 'poster' },
]

const DOCS = DOC_TYPES.map((t, i) => ({
  ...t,
  x: 24,
  y: 60 + i * 38,
  w: 92,
  h: 32,
}))

const GRID_COLS = 4
const GRID_ROWS = 6
const CELL = 32
const CELL_GAP = 6
const GRID_X = 330
const GRID_Y = 60
const CELLS = Array.from({ length: GRID_COLS * GRID_ROWS }, (_, i) => {
  const c = i % GRID_COLS
  const r = Math.floor(i / GRID_COLS)
  return {
    x: GRID_X + c * (CELL + CELL_GAP),
    y: GRID_Y + r * (CELL + CELL_GAP),
  }
})

function bezierPath(doc, target) {
  const x1 = doc.x + doc.w
  const y1 = doc.y + doc.h / 2
  const x2 = target.x
  const y2 = target.y + CELL / 2
  const cx1 = x1 + (x2 - x1) * 0.45
  const cx2 = x1 + (x2 - x1) * 0.6
  return `M${x1},${y1} C${cx1},${y1} ${cx2},${y2} ${x2},${y2}`
}

const LINK_TARGETS = DOCS.map((_, i) => CELLS[i * 4]) // leftmost cell of each row block

// Tiny content visuals inside doc cards — borrowed from hero PublicationFlow vocabulary
function DocVisual({ doc }) {
  const innerX = doc.x + 6
  const innerY = doc.y + 14
  const innerW = doc.w - 12
  const innerH = doc.h - 16

  if (doc.visual === 'chart') {
    return (
      <g opacity={0.75}>
        {[0.2, 0.45, 0.7].map((bx, i) => {
          const bh = [0.5, 0.85, 0.6][i] * innerH
          return (
            <rect
              key={i}
              x={innerX + bx * innerW - 2}
              y={innerY + innerH - bh}
              width={4}
              height={bh}
              rx={1}
              fill={doc.color}
              opacity={0.65}
            />
          )
        })}
        <path
          d={`M${innerX + 2},${innerY + innerH * 0.7} Q${innerX + innerW * 0.4},${innerY + innerH * 0.2} ${innerX + innerW - 2},${innerY + innerH * 0.3}`}
          stroke={doc.color}
          strokeWidth={1.4}
          fill="none"
          opacity={0.95}
        />
      </g>
    )
  }
  if (doc.visual === 'grid') {
    return (
      <g opacity={0.7}>
        {[0.33, 0.66].map((y, i) => (
          <line key={`h${i}`} x1={innerX} y1={innerY + y * innerH} x2={innerX + innerW} y2={innerY + y * innerH} stroke={doc.color} strokeWidth={0.8} opacity={0.45} />
        ))}
        {[0.33, 0.66].map((x, i) => (
          <line key={`v${i}`} x1={innerX + x * innerW} y1={innerY} x2={innerX + x * innerW} y2={innerY + innerH} stroke={doc.color} strokeWidth={0.8} opacity={0.45} />
        ))}
        {[0.17, 0.5, 0.83].map((cx, ci) => [0.17, 0.5, 0.83].map((cy, cyi) => (
          <rect key={`c${ci}${cyi}`} x={innerX + cx * innerW - 3} y={innerY + cy * innerH - 1} width={6} height={2} rx={0.5} fill={doc.color} opacity={0.45} />
        )))}
      </g>
    )
  }
  if (doc.visual === 'ema') {
    return (
      <g opacity={0.7}>
        {[0.2, 0.45, 0.7].map((y, i) => (
          <rect key={i} x={innerX} y={innerY + y * innerH} width={innerW * (i === 0 ? 0.55 : 0.85)} height={1.6} rx={0.8} fill={doc.color} opacity={0.45} />
        ))}
        <circle cx={innerX + innerW - 6} cy={innerY + innerH * 0.4} r={3.5} fill="none" stroke={doc.color} strokeWidth={1} opacity={0.55} />
      </g>
    )
  }
  if (doc.visual === 'poster') {
    return (
      <g opacity={0.7}>
        <rect x={innerX} y={innerY} width={innerW} height={innerH * 0.25} rx={0.8} fill={doc.color} opacity={0.5} />
        <rect x={innerX} y={innerY + innerH * 0.35} width={innerW * 0.45} height={innerH * 0.55} rx={0.8} fill={doc.color} opacity={0.25} />
        <rect x={innerX + innerW * 0.5} y={innerY + innerH * 0.35} width={innerW * 0.45} height={innerH * 0.55} rx={0.8} fill={doc.color} opacity={0.25} />
      </g>
    )
  }
  // 'lines' — default lined doc
  return (
    <g opacity={0.7}>
      {[0.15, 0.4, 0.65, 0.9].map((y, i) => (
        <rect
          key={i}
          x={innerX}
          y={innerY + y * innerH}
          width={innerW * (i === 0 ? 0.55 : i === 3 ? 0.4 : 0.85)}
          height={1.6}
          rx={0.8}
          fill={doc.color}
          opacity={i === 0 ? 0.65 : 0.42}
        />
      ))}
    </g>
  )
}

export default function Ill01({ active = false, className = '', id = 'ill01' }) {
  const svgRef = useRef(null)
  const timelineRef = useRef(null)

  useEffect(() => {
    const root = svgRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const docs = root.querySelectorAll(`.${id}-doc`)
    const lines = root.querySelectorAll(`.${id}-line`)
    const cells = root.querySelectorAll(`.${id}-cell`)

    lines.forEach((el) => {
      const len = el.getTotalLength?.() || 220
      el.style.strokeDasharray = String(len)
      el.style.strokeDashoffset = String(len)
    })

    if (reduce) {
      docs.forEach((d) => { d.style.opacity = '1'; d.style.transform = 'translateX(0)' })
      lines.forEach((l) => { l.style.strokeDashoffset = '0'; l.style.opacity = '0.7' })
      cells.forEach((c) => { c.style.opacity = '1' })
      // Soft fade-in to final state — no movement, just opacity.
      root.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: 'ease-out', fill: 'backwards' })
      return
    }

    if (!active) return

    const tl = createTimeline({ defaults: { ease: 'outQuad' } })
    tl.add(`.${id}-doc`, {
      opacity: [0, 1],
      translateX: [-24, 0],
      duration: 600,
      delay: stagger(80),
    })
      .add(
        `.${id}-line`,
        {
          strokeDashoffset: [(_, i) => lines[i]?.getTotalLength?.() || 220, 0],
          opacity: [0, 0.7],
          duration: 700,
          delay: stagger(90),
        },
        '-=400',
      )
      .add(
        `.${id}-cell`,
        {
          opacity: [0.15, 1],
          scale: [0.7, 1],
          duration: 400,
          delay: stagger(40, { grid: [GRID_COLS, GRID_ROWS], from: 'first' }),
        },
        '-=500',
      )

    timelineRef.current = tl
    return () => tl?.pause?.()
  }, [active, id])

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
      <title>Documents from heterogeneous sources extracted into a unified structured database grid</title>

      <defs>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Card frame — Ill03-style chrome */}
      <rect
        x={6}
        y={6}
        width={468}
        height={308}
        rx={14}
        ry={14}
        fill="rgba(8,12,24,0.35)"
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
        EXTRACTION
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
          n=6 SOURCES
        </text>
      </g>

      {/* Hairline divider */}
      <line x1={18} y1={50} x2={462} y2={50} stroke="#2A3A5A" strokeWidth={0.6} strokeOpacity={0.5} />

      {/* Per-line gradient defs — line color fades from source-doc color at start to periwinkle at end */}
      <defs>
        {DOCS.map((d, i) => {
          const target = LINK_TARGETS[i]
          const x1 = d.x + d.w
          const x2 = target.x
          return (
            <linearGradient key={i} id={`${id}-grad-${i}`} gradientUnits="userSpaceOnUse" x1={x1} y1={0} x2={x2} y2={0}>
              <stop offset="0%" stopColor={d.color} stopOpacity={0.85} />
              <stop offset="100%" stopColor={ACCENT} stopOpacity={0.6} />
            </linearGradient>
          )
        })}
      </defs>

      {/* 6 documents on the left, each with mixed accent color + content visual */}
      <g>
        {DOCS.map((d, i) => (
          <g key={i} className={`${id}-doc`} style={{ opacity: 0, transformOrigin: `${d.x + d.w / 2}px ${d.y + d.h / 2}px` }}>
            <rect
              x={d.x}
              y={d.y}
              width={d.w}
              height={d.h}
              rx={4}
              fill="none"
              stroke={d.color}
              strokeWidth={1}
              opacity={0.85}
              style={{ filter: `drop-shadow(0 0 4px ${d.color}55)` }}
            />
            {/* Tiny label chip at top */}
            <text
              x={d.x + 6}
              y={d.y + 9}
              fontFamily="Inter, sans-serif"
              fontSize={5.5}
              fontWeight={700}
              fill={d.color}
              opacity={0.95}
              letterSpacing={0.4}
            >
              {d.label}
            </text>
            {/* Content visual */}
            <DocVisual doc={d} />
          </g>
        ))}
      </g>

      {/* Extraction lines — thin gradient strokes, no filter, no float */}
      <g fill="none" strokeWidth={0.5}>
        {DOCS.map((d, i) => (
          <path
            key={i}
            className={`${id}-line`}
            d={bezierPath(d, LINK_TARGETS[i])}
            stroke={`url(#${id}-grad-${i})`}
            opacity={0}
          />
        ))}
      </g>

      {/* Grid lattice — hairline empty cells + glowing destination cells */}
      <g>
        {/* Empty cells: faint stroked outlines, no fill */}
        {CELLS.map((c, i) => {
          const isDestination = i % GRID_COLS === 0
          if (isDestination) return null
          return (
            <rect
              key={i}
              x={c.x}
              y={c.y}
              width={CELL}
              height={CELL}
              rx={3}
              fill="none"
              stroke={PERI}
              strokeWidth={0.5}
              strokeOpacity={0.18}
            />
          )
        })}
        {/* Destination cells (leftmost of each row): soft fill + center dot */}
        {CELLS.map((c, i) => {
          if (i % GRID_COLS !== 0) return null
          return (
            <g
              key={`dst-${i}`}
              className={`${id}-cell`}
              style={{ transformOrigin: `${c.x + CELL / 2}px ${c.y + CELL / 2}px` }}
            >
              <rect
                x={c.x}
                y={c.y}
                width={CELL}
                height={CELL}
                rx={3}
                fill={PERI}
                fillOpacity={0.13}
                stroke={PERI}
                strokeWidth={0.6}
                strokeOpacity={0.55}
              />
              <circle
                cx={c.x + CELL / 2}
                cy={c.y + CELL / 2}
                r={1.6}
                fill={PERI}
                opacity={0.9}
              />
            </g>
          )
        })}
      </g>
    </svg>
  )
}
