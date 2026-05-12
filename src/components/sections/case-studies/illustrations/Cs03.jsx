import { useEffect, useRef, useMemo } from 'react'
import { useReducedMotion } from 'framer-motion'

const PERI = '#7EB8FF'
const ACCENT = '#7C9ED9'

// Underlying concentration-time profile — log-normal-ish bell
function profileY(x) {
  const t = (x - 30) / 670
  if (t <= 0) return 90
  const peak = 0.22
  const sigma = 0.6
  const k = Math.log((t + 0.04) / peak) / sigma
  const a = 60 * Math.exp(-k * k * 2)
  return 95 - a
}

function makeRng(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function generateDots(count, seed) {
  const rng = makeRng(seed)
  const dots = []
  for (let i = 0; i < count; i++) {
    // Bias toward left (more data points near the peak)
    const xRand = Math.pow(rng(), 1.3)
    const x = 30 + xRand * 660
    const baseY = profileY(x)
    // Gaussian-ish noise (two uniforms)
    const noise = ((rng() + rng() + rng()) / 3 - 0.5) * 22
    const y = baseY + noise
    const delay = (x - 30) / 660 * 700 // entry wave 0–700ms
    const opacity = 0.18 + rng() * 0.55
    dots.push({ x: x.toFixed(1), y: y.toFixed(1), delay, opacity })
  }
  return dots
}

// Trend line path through the underlying profile
const TREND_PATH = (() => {
  const pts = []
  for (let x = 30; x <= 700; x += 6) pts.push(`${x},${profileY(x).toFixed(2)}`)
  return 'M' + pts.join(' L')
})()

// Keyframe injection (once)
if (typeof document !== 'undefined' && !document.getElementById('cs03-dot-keyframes')) {
  const style = document.createElement('style')
  style.id = 'cs03-dot-keyframes'
  style.textContent = `
    @keyframes cs03DotIn {
      from { opacity: 0; transform: scale(0); }
      to   { opacity: var(--cs03-o, 0.5); transform: scale(1); }
    }
  `
  document.head.appendChild(style)
}

export default function Cs03({ active = false, id = 'cs03', className = '' }) {
  const svgRef = useRef(null)
  const counterRef = useRef(null)
  const prefersReduce = useReducedMotion()
  const dots = useMemo(() => generateDots(280, 7), [])

  useEffect(() => {
    const root = svgRef.current
    const counter = counterRef.current
    if (!root || !counter) return

    if (prefersReduce) {
      root.querySelectorAll(`.${id}-dot`).forEach((el) => {
        el.style.opacity = el.style.getPropertyValue('--cs03-o') || '0.5'
        el.style.transform = 'scale(1)'
      })
      const trend = root.querySelector(`.${id}-trend`)
      if (trend) { trend.style.strokeDashoffset = '0'; trend.style.opacity = '1' }
      counter.textContent = '23,142'
      return
    }

    if (!active) return

    // Re-trigger entry wave on each activation
    const dotEls = root.querySelectorAll(`.${id}-dot`)
    dotEls.forEach((el) => {
      const delay = el.dataset.delay || '0'
      el.style.animation = 'none'
      // force reflow
      void el.offsetWidth
      el.style.animation = `cs03DotIn 0.5s ease-out ${delay}ms forwards`
    })

    // Trend line draw-on
    const trend = root.querySelector(`.${id}-trend`)
    if (trend) {
      const len = trend.getTotalLength?.() || 700
      trend.style.strokeDasharray = String(len)
      trend.style.strokeDashoffset = String(len)
      trend.style.opacity = '1'
      requestAnimationFrame(() => {
        trend.style.transition = 'stroke-dashoffset 700ms ease-out 700ms'
        trend.style.strokeDashoffset = '0'
      })
    }

    // Number counter
    let raf
    const start = performance.now()
    const target = 23142
    const tick = (now) => {
      const t = Math.min((now - start) / 1100, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      counter.textContent = Math.round(eased * target).toLocaleString()
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => raf && cancelAnimationFrame(raf)
  }, [active, id, prefersReduce])

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
      <title>Hundreds of digitized data points forming the shape of a fitted concentration-time profile</title>

      {/* Dots */}
      <g>
        {dots.map((d, i) => (
          <circle
            key={i}
            className={`${id}-dot`}
            cx={d.x}
            cy={d.y}
            r={1.2}
            fill={PERI}
            data-delay={d.delay.toFixed(0)}
            style={{
              opacity: 0,
              transform: 'scale(0)',
              transformOrigin: `${d.x}px ${d.y}px`,
              '--cs03-o': d.opacity.toFixed(2),
            }}
          />
        ))}
      </g>

      {/* Trend line */}
      <path
        className={`${id}-trend`}
        d={TREND_PATH}
        stroke="#A8C4E8"
        strokeWidth={1}
        fill="none"
        opacity={0.85}
        style={{ opacity: 0 }}
      />

      {/* Number counter — lifted off the trend line so it reads clearly */}
      <text
        ref={counterRef}
        x={702}
        y={70}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={14}
        fontWeight={700}
        letterSpacing={-0.3}
        fill={PERI}
        opacity={0.95}
        textAnchor="end"
      >
        23,142
      </text>
      <text
        x={702}
        y={84}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={7}
        fontWeight={500}
        letterSpacing={0.1}
        fill={PERI}
        opacity={0.65}
        textAnchor="end"
      >
        data points
      </text>

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
        4,000+ plots · 900 publications
      </text>
    </svg>
  )
}
