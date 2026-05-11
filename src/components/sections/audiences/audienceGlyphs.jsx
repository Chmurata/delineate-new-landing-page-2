import { useReducedMotion } from 'framer-motion'

const PERI = '#7EB8FF'
const NEON_BLUE = '#00BFFF'
const GREEN = '#6BFFAA'
const GOLD = '#FFC75A'
const CORAL = '#FF9B7A'

const SVG_PROPS = {
  viewBox: '0 0 96 96',
  width: '100%',
  height: '100%',
  preserveAspectRatio: 'xMidYMid meet',
  role: 'img',
  'aria-hidden': 'true',
}

// 1. Clinical Pharmacology — dose-response sigmoid with optimum dot + halo breath.
export function ClinPharmGlyph() {
  const prefersReduce = useReducedMotion()
  return (
    <svg {...SVG_PROPS}>
      <line x1={8} y1={80} x2={88} y2={80} stroke={PERI} strokeWidth={0.6} opacity={prefersReduce ? 0.3 : 0}>
        {!prefersReduce && <animate attributeName="opacity" from="0" to="0.3" dur="0.5s" begin="0s" fill="freeze" />}
      </line>
      <line x1={8} y1={80} x2={8} y2={16} stroke={PERI} strokeWidth={0.6} opacity={prefersReduce ? 0.3 : 0}>
        {!prefersReduce && <animate attributeName="opacity" from="0" to="0.3" dur="0.5s" begin="0.08s" fill="freeze" />}
      </line>
      <path
        d="M12,78 C40,78 56,32 88,22"
        stroke={NEON_BLUE}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
        pathLength="100"
        strokeDasharray={prefersReduce ? undefined : '100'}
        strokeDashoffset={prefersReduce ? undefined : '100'}
      >
        {!prefersReduce && (
          <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.9s" begin="0.2s" fill="freeze" />
        )}
      </path>
      <g opacity={prefersReduce ? 1 : 0}>
        {!prefersReduce && <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.0s" fill="freeze" />}
        {!prefersReduce && (
          <circle cx={60} cy={32} r={5} fill={NEON_BLUE} opacity={0.4}>
            <animate attributeName="r" values="5;10;5" dur="2.6s" repeatCount="indefinite" begin="1.3s" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2.6s" repeatCount="indefinite" begin="1.3s" />
          </circle>
        )}
        <circle cx={60} cy={32} r={3} fill={NEON_BLUE} />
      </g>
    </svg>
  )
}

// 2. Clinical Development — 3 cohort lanes with patient dots; one dot per lane pulses.
export function ClinDevGlyph() {
  const prefersReduce = useReducedMotion()
  const LANES = [24, 48, 72]
  const DOTS = [14, 28, 42, 56, 70, 84]
  return (
    <svg {...SVG_PROPS}>
      {LANES.map((y, i) => (
        <line
          key={`lane-${i}`}
          x1={8}
          y1={y}
          x2={88}
          y2={y}
          stroke={PERI}
          strokeWidth={0.6}
          opacity={prefersReduce ? 0.22 : 0}
        >
          {!prefersReduce && (
            <animate attributeName="opacity" from="0" to="0.22" dur="0.5s" begin={`${0.05 + i * 0.1}s`} fill="freeze" />
          )}
        </line>
      ))}
      {LANES.flatMap((y, i) =>
        DOTS.map((x, j) => {
          const isPulse = j === 2
          return (
            <circle
              key={`dot-${i}-${j}`}
              cx={x}
              cy={y}
              r={2.4}
              fill={GREEN}
              opacity={prefersReduce ? 0.75 : 0}
            >
              {!prefersReduce && (
                <animate
                  attributeName="opacity"
                  from="0"
                  to="0.75"
                  dur="0.3s"
                  begin={`${0.4 + i * 0.12 + j * 0.06}s`}
                  fill="freeze"
                />
              )}
              {!prefersReduce && isPulse && (
                <animate
                  attributeName="opacity"
                  values="0.75;1;0.75"
                  dur="2.6s"
                  repeatCount="indefinite"
                  begin={`${1.8 + i * 0.7}s`}
                />
              )}
            </circle>
          )
        })
      )}
    </svg>
  )
}

// 3. Commercial / BD / LCM — 3-axis radar with envelope + asset polygon (one axis extending).
export function CommercialGlyph() {
  const prefersReduce = useReducedMotion()
  const AXES = [
    [48, 16],
    [20, 64],
    [76, 64],
  ]
  const ENV_PATH = 'M48,34 L35.88,55 L60.12,55 Z'
  const ASSET_PATH = 'M48,20 L36,55 L60,55 Z'
  return (
    <svg {...SVG_PROPS}>
      {AXES.map(([x, y], i) => (
        <line
          key={`axis-${i}`}
          x1={48}
          y1={48}
          x2={x}
          y2={y}
          stroke={PERI}
          strokeWidth={0.6}
          opacity={prefersReduce ? 0.25 : 0}
        >
          {!prefersReduce && (
            <animate attributeName="opacity" from="0" to="0.25" dur="0.5s" begin={`${0.05 + i * 0.1}s`} fill="freeze" />
          )}
        </line>
      ))}
      <path
        d={ENV_PATH}
        fill={PERI}
        fillOpacity={prefersReduce ? 0.12 : 0}
        stroke={PERI}
        strokeWidth={0.8}
        strokeOpacity={prefersReduce ? 0.45 : 0}
        strokeDasharray="3 3"
      >
        {!prefersReduce && <animate attributeName="fill-opacity" from="0" to="0.12" dur="0.5s" begin="0.4s" fill="freeze" />}
        {!prefersReduce && <animate attributeName="stroke-opacity" from="0" to="0.45" dur="0.5s" begin="0.4s" fill="freeze" />}
      </path>
      <path
        d={ASSET_PATH}
        fill={GOLD}
        fillOpacity={prefersReduce ? 0.18 : 0}
        stroke={GOLD}
        strokeWidth={1.6}
        strokeOpacity={prefersReduce ? 0.95 : 0}
        strokeLinejoin="round"
        pathLength="100"
        strokeDasharray={prefersReduce ? undefined : '100'}
        strokeDashoffset={prefersReduce ? undefined : '100'}
      >
        {!prefersReduce && (
          <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.9s" begin="0.7s" fill="freeze" />
        )}
        {!prefersReduce && (
          <animate attributeName="stroke-opacity" from="0" to="0.95" dur="0.4s" begin="0.7s" fill="freeze" />
        )}
        {!prefersReduce && (
          <animate attributeName="fill-opacity" from="0" to="0.18" dur="0.5s" begin="1.1s" fill="freeze" />
        )}
      </path>
      <g opacity={prefersReduce ? 1 : 0}>
        {!prefersReduce && <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin="1.3s" fill="freeze" />}
        {!prefersReduce && (
          <circle cx={48} cy={20} r={4} fill={GOLD} opacity={0.4}>
            <animate attributeName="r" values="4;9;4" dur="2.8s" repeatCount="indefinite" begin="1.6s" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2.8s" repeatCount="indefinite" begin="1.6s" />
          </circle>
        )}
        <circle cx={48} cy={20} r={2.5} fill={GOLD} />
      </g>
    </svg>
  )
}

// 4. Regulatory & Market Access — document + stamped seal that slow-rotates.
export function RegulatoryGlyph() {
  const prefersReduce = useReducedMotion()
  const LINES = [
    { y: 22, w: 36 },
    { y: 32, w: 32 },
    { y: 42, w: 38 },
    { y: 52, w: 26 },
    { y: 62, w: 34 },
  ]
  const starPath = (cx, cy, ro, ri) => {
    const pts = []
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? ro : ri
      const ang = (Math.PI / 5) * i - Math.PI / 2
      pts.push(`${cx + r * Math.cos(ang)},${cy + r * Math.sin(ang)}`)
    }
    return `M${pts[0]} L${pts.slice(1).join(' L')} Z`
  }
  return (
    <svg {...SVG_PROPS}>
      <rect
        x={14}
        y={12}
        width={42}
        height={72}
        rx={2}
        fill="rgba(8,12,24,0.4)"
        stroke={PERI}
        strokeWidth={0.7}
        strokeOpacity={prefersReduce ? 0.4 : 0}
      >
        {!prefersReduce && <animate attributeName="stroke-opacity" from="0" to="0.4" dur="0.5s" begin="0s" fill="freeze" />}
      </rect>
      {LINES.map((ln, i) => (
        <line
          key={`line-${i}`}
          x1={18}
          y1={ln.y}
          x2={18 + ln.w}
          y2={ln.y}
          stroke={PERI}
          strokeWidth={0.8}
          strokeLinecap="round"
          opacity={prefersReduce ? 0.32 : 0}
        >
          {!prefersReduce && (
            <animate attributeName="opacity" from="0" to="0.32" dur="0.4s" begin={`${0.3 + i * 0.08}s`} fill="freeze" />
          )}
        </line>
      ))}
      <g
        opacity={prefersReduce ? 1 : 0}
        style={{ transformOrigin: '74px 70px' }}
      >
        {!prefersReduce && <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="1.1s" fill="freeze" />}
        <circle
          cx={74}
          cy={70}
          r={14}
          fill="rgba(255,155,122,0.14)"
          stroke={CORAL}
          strokeWidth={1.2}
          strokeOpacity={0.65}
        />
        <path d={starPath(74, 70, 6, 2.6)} fill={CORAL} opacity={0.95} />
        {!prefersReduce && (
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 74 70"
            to="360 74 70"
            dur="14s"
            repeatCount="indefinite"
            begin="1.6s"
          />
        )}
      </g>
    </svg>
  )
}

export const GLYPHS = [ClinPharmGlyph, ClinDevGlyph, CommercialGlyph, RegulatoryGlyph]
