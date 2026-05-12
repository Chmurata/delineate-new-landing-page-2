import { useEffect, useRef } from 'react'
import { stagger, createTimeline } from 'animejs'

const PERI = '#7EB8FF'
const ACCENT = '#7C9ED9'

// 3 narrowing pipeline capsules + final Go badge — edge-to-edge with 24px outer padding,
// each element vertically centered on y=60
const CAPSULES = [
  { x: 24, y: 46, w: 220, h: 28, label: '300 Trials', sub: 'extracted' },
  { x: 268, y: 48, w: 170, h: 24, label: 'Harmonized', sub: 'arm-level' },
  { x: 462, y: 50, w: 150, h: 20, label: 'NONMEM-ready', sub: '' },
]

const BADGE = { cx: 666, cy: 60, r: 30 }

// Connector lines bridging the 24px gaps between elements
const CONNECTORS = [
  { x1: 244, x2: 268, y: 60 },
  { x1: 438, x2: 462, y: 60 },
  { x1: 612, x2: 636, y: 60 },
]

// Keyframe injection (once) — slow pulse on the GO badge
if (typeof document !== 'undefined' && !document.getElementById('cs01-badge-pulse')) {
  const style = document.createElement('style')
  style.id = 'cs01-badge-pulse'
  style.textContent = `
    @keyframes cs01BadgePulse {
      0%, 100% { opacity: 0.95; }
      50%      { opacity: 0.55; }
    }
  `
  document.head.appendChild(style)
}

export default function Cs01({ active = false, id = 'cs01', className = '' }) {
  const svgRef = useRef(null)
  const badgePulseRef = useRef(null)

  useEffect(() => {
    const root = svgRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const capsules = root.querySelectorAll(`.${id}-cap`)
    const connectors = root.querySelectorAll(`.${id}-conn`)
    const badge = root.querySelector(`.${id}-badge`)
    const badgeRing = badgePulseRef.current

    if (reduce) {
      capsules.forEach((el) => { el.style.opacity = '1' })
      connectors.forEach((el) => { el.style.opacity = '1'; el.style.strokeDashoffset = '0' })
      if (badge) badge.style.opacity = '1'
      return
    }

    if (!active) return

    // Pre-set connector dash
    connectors.forEach((el) => {
      const len = el.getTotalLength?.() || 24
      el.style.strokeDasharray = String(len)
      el.style.strokeDashoffset = String(len)
      el.style.opacity = '1'
    })

    // Reset badge pulse animation
    if (badgeRing) {
      badgeRing.style.animation = 'none'
      void badgeRing.offsetWidth
    }

    const tl = createTimeline({ defaults: { ease: 'outQuad' } })
    tl.add(`.${id}-cap`, {
      opacity: [0, 1],
      translateX: [-8, 0],
      duration: 320,
      delay: stagger(160),
    })
    tl.add(
      `.${id}-conn`,
      {
        strokeDashoffset: [(_, i) => connectors[i]?.getTotalLength?.() || 24, 0],
        duration: 220,
        delay: stagger(160, { start: -380 }),
      },
      '-=0',
    )
    tl.add(
      `.${id}-badge`,
      {
        opacity: [0, 1],
        scale: [0.5, 1],
        duration: 380,
      },
      '-=120',
    )

    // Start the pulse loop after entry settles
    const startPulse = setTimeout(() => {
      if (badgeRing) {
        badgeRing.style.animation = 'cs01BadgePulse 2.4s ease-in-out infinite'
      }
    }, 1200)

    return () => {
      clearTimeout(startPulse)
      tl?.pause?.()
    }
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
      <title>Horizontal trial funnel — 300 trials harmonized into a NONMEM-ready database supporting a Go decision</title>

      {/* Connector lines (drawn first so capsules sit on top) */}
      {CONNECTORS.map((c, i) => (
        <line
          key={i}
          className={`${id}-conn`}
          x1={c.x1}
          y1={c.y}
          x2={c.x2}
          y2={c.y}
          stroke={PERI}
          strokeWidth={0.8}
          opacity={0.55}
          style={{ opacity: 0 }}
        />
      ))}

      {/* Capsules */}
      {CAPSULES.map((cap, i) => (
        <g key={i} className={`${id}-cap`} style={{ opacity: 0 }}>
          <rect
            x={cap.x}
            y={cap.y}
            width={cap.w}
            height={cap.h}
            rx={cap.h / 2}
            ry={cap.h / 2}
            fill="none"
            stroke={PERI}
            strokeWidth={0.8}
            opacity={0.85}
          />
          <text
            x={cap.x + cap.w / 2}
            y={cap.y + cap.h / 2 + (cap.sub ? -1 : 3)}
            fontFamily="Inter, system-ui, sans-serif"
            fontSize={cap.h >= 26 ? 10 : cap.h >= 22 ? 9 : 8}
            fontWeight={700}
            letterSpacing={0.8}
            fill={PERI}
            opacity={0.95}
            textAnchor="middle"
          >
            {cap.label}
          </text>
          {cap.sub && (
            <text
              x={cap.x + cap.w / 2}
              y={cap.y + cap.h / 2 + 9}
              fontFamily="Inter, system-ui, sans-serif"
              fontSize={6.5}
              fontWeight={500}
              letterSpacing={0.4}
              fill={PERI}
              opacity={0.55}
              textAnchor="middle"
            >
              {cap.sub}
            </text>
          )}
        </g>
      ))}

      {/* GO badge */}
      <g
        className={`${id}-badge`}
        style={{ opacity: 0, transformOrigin: `${BADGE.cx}px ${BADGE.cy}px` }}
      >
        <circle
          cx={BADGE.cx}
          cy={BADGE.cy}
          r={BADGE.r + 5}
          fill="none"
          stroke={PERI}
          strokeWidth={0.5}
          opacity={0.25}
        />
        <circle
          ref={badgePulseRef}
          cx={BADGE.cx}
          cy={BADGE.cy}
          r={BADGE.r}
          fill={`${PERI}1A`}
          stroke={PERI}
          strokeWidth={1}
          opacity={0.95}
        />
        <text
          x={BADGE.cx}
          y={BADGE.cy + 6}
          fontFamily="Inter, system-ui, sans-serif"
          fontSize={18}
          fontWeight={800}
          letterSpacing={-0.2}
          fill={PERI}
          textAnchor="middle"
        >
          Go
        </text>
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
        Decision pipeline · go / no-go supported
      </text>
    </svg>
  )
}
