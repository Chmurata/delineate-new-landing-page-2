import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

const PERI = '#7EB8FF'
const CORAL = '#FF9B7A'
const DIM = 'rgba(126, 184, 255, 0.25)'

// 6 source documents along the top
const SOURCES = [
  { x: 40, label: 'FDA' },
  { x: 120, label: 'EMA' },
  { x: 200, label: 'PAPER' },
  { x: 280, label: 'TRIAL' },
  { x: 360, label: 'ADCOM' },
  { x: 440, label: 'PMC' },
]
const SOURCE_Y = 14

// 24 leaf nodes — 6 cols × 4 rows. Each maps to a source by column.
const LEAVES = (() => {
  const arr = []
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 6; c++) {
      arr.push({
        x: SOURCES[c].x,
        y: 42 + r * 18,
        sourceIdx: c,
        isOutlier: (r === 1 && c === 4) || (r === 3 && c === 1),
      })
    }
  }
  return arr
})()

const CYCLE_MS = 1400

export default function ProvenanceConstellation() {
  const prefersReduce = useReducedMotion()
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    if (prefersReduce) return
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % LEAVES.length)
    }, CYCLE_MS)
    return () => clearInterval(id)
  }, [prefersReduce])

  return (
    <div className="mt-6 w-full">
      <svg
        viewBox="0 0 480 130"
        width="100%"
        height="auto"
        role="img"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Provenance constellation — every data value is connected upward to its source document and downward to two independent extractors"
      >
        {/* Tiny labels left/right */}
        <text x={18} y={124} fontFamily="Inter, sans-serif" fontSize={7} fontWeight={600} letterSpacing={0.8} fill={PERI} opacity={0.6}>
          SOURCES → VALUES → DUAL EXTRACTORS
        </text>
        <text x={462} y={124} fontFamily="Inter, sans-serif" fontSize={7} fontWeight={600} letterSpacing={0.8} fill={PERI} opacity={0.6} textAnchor="end">
          AUDIT TRAIL
        </text>

        {/* Source → leaf edges */}
        {LEAVES.map((leaf, i) => {
          const src = SOURCES[leaf.sourceIdx]
          const active = i === activeIdx
          return (
            <path
              key={`edge-${i}`}
              d={`M${src.x},${SOURCE_Y + 4} C${src.x},${(SOURCE_Y + leaf.y) / 2} ${leaf.x},${(SOURCE_Y + leaf.y) / 2} ${leaf.x},${leaf.y - 3}`}
              fill="none"
              stroke={PERI}
              strokeWidth={active ? 0.9 : 0.45}
              strokeOpacity={active ? 0.85 : 0.18}
              style={{ transition: 'stroke-opacity 0.4s ease, stroke-width 0.4s ease' }}
            />
          )
        })}

        {/* Source documents (top row) */}
        {SOURCES.map((s, i) => (
          <g key={`src-${i}`}>
            <circle cx={s.x} cy={SOURCE_Y} r={3.5} fill="none" stroke={PERI} strokeWidth={0.8} strokeOpacity={0.85} />
            <circle cx={s.x} cy={SOURCE_Y} r={1.4} fill={PERI} opacity={0.95} />
            <text
              x={s.x}
              y={SOURCE_Y - 9}
              fontFamily="Inter, sans-serif"
              fontSize={6.5}
              fontWeight={700}
              letterSpacing={0.7}
              fill={PERI}
              textAnchor="middle"
              opacity={0.75}
            >
              {s.label}
            </text>
          </g>
        ))}

        {/* Leaf nodes + dual extractor V-fans below each */}
        {LEAVES.map((leaf, i) => {
          const active = i === activeIdx
          const color = leaf.isOutlier ? CORAL : PERI
          return (
            <g key={`leaf-${i}`}>
              {/* Dual-extractor V-fan below the node */}
              <line
                x1={leaf.x}
                y1={leaf.y + 2.5}
                x2={leaf.x - 4}
                y2={leaf.y + 8}
                stroke={color}
                strokeWidth={0.4}
                strokeOpacity={active ? 0.7 : 0.22}
                style={{ transition: 'stroke-opacity 0.4s ease' }}
              />
              <line
                x1={leaf.x}
                y1={leaf.y + 2.5}
                x2={leaf.x + 4}
                y2={leaf.y + 8}
                stroke={color}
                strokeWidth={0.4}
                strokeOpacity={active ? 0.7 : 0.22}
                style={{ transition: 'stroke-opacity 0.4s ease' }}
              />
              {/* The data value node */}
              <circle
                cx={leaf.x}
                cy={leaf.y}
                r={active ? 2.6 : 1.7}
                fill={color}
                opacity={active ? 1 : leaf.isOutlier ? 0.85 : 0.7}
                style={{ transition: 'r 0.35s ease, opacity 0.35s ease' }}
              />
              {/* Active halo */}
              {active && (
                <circle
                  cx={leaf.x}
                  cy={leaf.y}
                  r={5.5}
                  fill="none"
                  stroke={color}
                  strokeWidth={0.5}
                  strokeOpacity={0.55}
                />
              )}
              {/* Outlier flag tick */}
              {leaf.isOutlier && !active && (
                <line
                  x1={leaf.x + 3.5}
                  y1={leaf.y - 4}
                  x2={leaf.x + 3.5}
                  y2={leaf.y - 1.5}
                  stroke={CORAL}
                  strokeWidth={0.7}
                />
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
