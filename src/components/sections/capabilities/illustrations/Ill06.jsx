import { useEffect, useRef } from 'react'
import { stagger, createTimeline } from 'animejs'

const ACCENT = '#7C9ED9'
const PERI = '#7EB8FF'

// Published-figure points (figure-coord 0–1, y inverted: small y = top)
const POINTS = [
  { x: 0.08, y: 0.82 },
  { x: 0.22, y: 0.66 },
  { x: 0.36, y: 0.52 },
  { x: 0.50, y: 0.40 },
  { x: 0.64, y: 0.30 },
  { x: 0.78, y: 0.22 },
]

// Figure region in SVG coords
const FIG_X = 28
const FIG_Y = 64
const FIG_W = 280
const FIG_H = 226
const PAD_L = 22
const PAD_B = 22

// Data column on the right
const COL_X = 330
const COL_Y = 64
const COL_W = 124
const ROW_H = 26

const pointXY = (p) => ({
  x: FIG_X + PAD_L + p.x * (FIG_W - PAD_L - 8),
  y: FIG_Y + 10 + p.y * (FIG_H - PAD_B - 10),
})

export default function Ill06({ active = false, className = '', id = 'ill06' }) {
  const svgRef = useRef(null)
  const timelineRef = useRef(null)

  useEffect(() => {
    const root = svgRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const marks = root.querySelectorAll(`.${id}-mark`)
    const rows = root.querySelectorAll(`.${id}-row`)
    const curve = root.querySelector(`.${id}-curve`)

    if (reduce) {
      marks.forEach((el) => { el.style.opacity = '1' })
      rows.forEach((el) => { el.style.opacity = '1' })
      if (curve) curve.style.opacity = '0.5'
      root.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: 'ease-out', fill: 'backwards' })
      return
    }

    if (!active) return

    const tl = createTimeline({ defaults: { ease: 'outQuad' } })
    tl.add(`.${id}-curve`, { opacity: [0, 0.45], duration: 500 })
      .add(
        `.${id}-mark`,
        {
          opacity: [0, 1],
          scale: [0.5, 1],
          duration: 420,
          delay: stagger(140),
        },
        '-=200',
      )
      .add(
        `.${id}-row`,
        {
          opacity: [0, 1],
          translateX: [10, 0],
          duration: 360,
          delay: stagger(140, { start: 120 }),
        },
        '-=1200',
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
      <title>Detection markers digitize data points from a published figure into a structured (x, y) extract</title>

      {/* Card frame — matches the others */}
      <rect x={6} y={6} width={468} height={308} rx={14} ry={14} fill="rgba(8,12,24,0.35)" />

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
        DIGITIZATION
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
          n=420 POINTS
        </text>
      </g>

      {/* Hairline divider */}
      <line x1={18} y1={50} x2={462} y2={50} stroke="#2A3A5A" strokeWidth={0.6} strokeOpacity={0.5} />

      {/* Figure panel — faded paper feel */}
      <rect x={FIG_X} y={FIG_Y} width={FIG_W} height={FIG_H} rx={4} fill="none" stroke={ACCENT} strokeWidth={0.5} strokeOpacity={0.32} />

      {/* Axes */}
      <line
        x1={FIG_X + PAD_L}
        y1={FIG_Y + 10}
        x2={FIG_X + PAD_L}
        y2={FIG_Y + FIG_H - PAD_B}
        stroke={ACCENT}
        strokeWidth={0.6}
        strokeOpacity={0.45}
      />
      <line
        x1={FIG_X + PAD_L}
        y1={FIG_Y + FIG_H - PAD_B}
        x2={FIG_X + FIG_W - 8}
        y2={FIG_Y + FIG_H - PAD_B}
        stroke={ACCENT}
        strokeWidth={0.6}
        strokeOpacity={0.45}
      />

      {/* Axis tick labels (faint) */}
      {[0.25, 0.5, 0.75].map((t, i) => (
        <text
          key={`yt${i}`}
          x={FIG_X + PAD_L - 4}
          y={FIG_Y + 10 + t * (FIG_H - PAD_B - 10) + 2}
          fontFamily="Inter, sans-serif"
          fontSize={6}
          fill={ACCENT}
          opacity={0.45}
          textAnchor="end"
        >
          {Math.round((1 - t) * 100)}
        </text>
      ))}
      {[0.25, 0.5, 0.75].map((t, i) => (
        <text
          key={`xt${i}`}
          x={FIG_X + PAD_L + t * (FIG_W - PAD_L - 8)}
          y={FIG_Y + FIG_H - PAD_B + 10}
          fontFamily="Inter, sans-serif"
          fontSize={6}
          fill={ACCENT}
          opacity={0.45}
          textAnchor="middle"
        >
          {(t * 10).toFixed(0)}
        </text>
      ))}

      {/* Faded fitted curve through the points (the published figure) */}
      <path
        className={`${id}-curve`}
        d={POINTS.map((p, i) => {
          const c = pointXY(p)
          return i === 0 ? `M${c.x},${c.y}` : `L${c.x},${c.y}`
        }).join(' ')}
        stroke={ACCENT}
        strokeWidth={1}
        fill="none"
        style={{ opacity: 0 }}
      />

      {/* Detection markers — crosshair + dot on each point (animated stagger) */}
      {POINTS.map((p, i) => {
        const c = pointXY(p)
        return (
          <g
            key={i}
            className={`${id}-mark`}
            style={{ opacity: 0, transformOrigin: `${c.x}px ${c.y}px` }}
          >
            <circle cx={c.x} cy={c.y} r={5} fill="none" stroke={PERI} strokeWidth={0.7} strokeOpacity={0.55} />
            <circle cx={c.x} cy={c.y} r={1.6} fill={PERI} opacity={0.95} />
            <line x1={c.x - 7.5} y1={c.y} x2={c.x - 4} y2={c.y} stroke={PERI} strokeWidth={0.8} />
            <line x1={c.x + 4} y1={c.y} x2={c.x + 7.5} y2={c.y} stroke={PERI} strokeWidth={0.8} />
            <line x1={c.x} y1={c.y - 7.5} x2={c.x} y2={c.y - 4} stroke={PERI} strokeWidth={0.8} />
            <line x1={c.x} y1={c.y + 4} x2={c.x} y2={c.y + 7.5} stroke={PERI} strokeWidth={0.8} />
          </g>
        )
      })}

      {/* Extracted-data column on the right */}
      <text
        x={COL_X}
        y={COL_Y - 6}
        fontFamily="Inter, sans-serif"
        fontSize={7}
        fontWeight={700}
        fill={PERI}
        letterSpacing={0.9}
        opacity={0.8}
      >
        EXTRACTED  (x, y)
      </text>
      {POINTS.map((p, i) => {
        const ry = COL_Y + i * ROW_H
        return (
          <g key={`row-${i}`} className={`${id}-row`} style={{ opacity: 0 }}>
            <rect
              x={COL_X}
              y={ry}
              width={COL_W}
              height={ROW_H - 6}
              rx={3}
              fill={`${PERI}10`}
              stroke={PERI}
              strokeWidth={0.5}
              strokeOpacity={0.35}
            />
            <circle cx={COL_X + 8} cy={ry + (ROW_H - 6) / 2} r={2} fill={PERI} opacity={0.9} />
            <text
              x={COL_X + 18}
              y={ry + (ROW_H - 6) / 2 + 2.5}
              fontFamily="Inter, sans-serif"
              fontSize={8}
              fill={PERI}
              opacity={0.9}
            >
              ({(p.x * 10).toFixed(2)}, {((1 - p.y) * 100).toFixed(1)})
            </text>
          </g>
        )
      })}
    </svg>
  )
}
