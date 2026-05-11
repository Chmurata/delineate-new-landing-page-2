import { useReducedMotion } from 'framer-motion'
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ReferenceArea,
  CartesianGrid,
} from 'recharts'

const NEON_BLUE = '#00BFFF'
const PERI = '#7EB8FF'
const CORAL = '#FF9B7A'
const GOLD = '#FFC75A'
const GREEN = '#6BFFAA'

const TICK = 'rgba(220, 230, 245, 0.45)'
const AXIS = 'rgba(124, 158, 217, 0.22)'
const GRID = 'rgba(124, 158, 217, 0.07)'
const ENV_FILL = PERI
const ENV_STROKE = PERI

// Class cluster — ~12 competitor Phase 2 readouts bunched in the
// "noise zone". x = exposure (AUC), y = response (Δ from baseline).
const COMPETITORS = [
  { x: 38, y: 28, c: PERI },
  { x: 42, y: 33, c: GOLD },
  { x: 45, y: 30, c: PERI },
  { x: 48, y: 35, c: CORAL },
  { x: 50, y: 33, c: GREEN },
  { x: 52, y: 38, c: PERI },
  { x: 54, y: 30, c: GOLD },
  { x: 56, y: 36, c: CORAL },
  { x: 58, y: 34, c: GREEN },
  { x: 60, y: 39, c: PERI },
  { x: 47, y: 40, c: GOLD },
  { x: 53, y: 27, c: PERI },
]

const ASSET_X = [{ x: 80, y: 64 }]

const ENVELOPE = { x1: 33, x2: 64, y1: 23, y2: 44 }

function CompetitorDot({ cx, cy, payload }) {
  if (cx == null || cy == null) return null
  return <circle cx={cx} cy={cy} r={4.5} fill={payload.c} fillOpacity={0.55} />
}

function AssetXDot({ cx, cy, prefersReduce }) {
  if (cx == null || cy == null) return null
  return (
    <g>
      {!prefersReduce && (
        <>
          <circle cx={cx} cy={cy} r={6} fill={NEON_BLUE} opacity={0.4}>
            <animate attributeName="r" values="6;16;6" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.4;0;0.4" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx} cy={cy} r={9} fill={NEON_BLUE} opacity={0.18}>
            <animate
              attributeName="r"
              values="9;22;9"
              dur="2.4s"
              begin="0.4s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.18;0;0.18"
              dur="2.4s"
              begin="0.4s"
              repeatCount="indefinite"
            />
          </circle>
        </>
      )}
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={NEON_BLUE}
        stroke="#ffffff"
        strokeOpacity={0.35}
        strokeWidth={1}
      />
    </g>
  )
}

const headerLabelStyle = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.12em',
  color: PERI,
  pointerEvents: 'none',
}

const headerPillStyle = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 8,
  fontWeight: 700,
  letterSpacing: '0.08em',
  color: PERI,
  background: `${PERI}14`,
  border: `1px solid ${PERI}`,
  borderColor: `rgba(126, 184, 255, 0.55)`,
  borderRadius: 9,
  padding: '3px 10px',
  opacity: 0.95,
  pointerEvents: 'none',
}

const tagStyle = {
  fontFamily: 'inherit',
  fontSize: 10,
  color: NEON_BLUE,
  background: 'rgba(0, 191, 255, 0.10)',
  border: '1px solid rgba(0, 191, 255, 0.45)',
  borderRadius: 6,
  padding: '3px 8px',
  fontWeight: 600,
  pointerEvents: 'none',
  whiteSpace: 'nowrap',
}

const legendStyle = {
  fontFamily: 'inherit',
  fontSize: 9,
  color: 'rgba(220, 230, 245, 0.55)',
  display: 'flex',
  gap: 12,
  alignItems: 'center',
  pointerEvents: 'none',
}

// eslint-disable-next-line no-unused-vars
export default function Ill04({ active = true, className = '', id = 'ill04' }) {
  const prefersReduce = useReducedMotion()

  return (
    <div
      className={className}
      role="img"
      aria-label="Benchmark your asset against the class: scatter of competitor Phase 2 readouts inside a class noise envelope, with ASSET-X plotted as a differentiated outlier above and to the right."
      style={{ position: 'relative' }}
    >
      {/* Card frame — Ill03 chrome standard */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 14,
          background: 'rgba(8,12,24,0.35)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <div style={{ position: 'absolute', top: 12, left: 14, zIndex: 2, ...headerLabelStyle }}>
        EXPOSURE-RESPONSE
      </div>
      <div style={{ position: 'absolute', top: 10, right: 12, zIndex: 2, ...headerPillStyle }}>
        n=12 CLASS
      </div>

      {/* Hairline divider */}
      <div
        style={{
          position: 'absolute',
          top: 36,
          left: 12,
          right: 12,
          height: 1,
          background: '#2A3A5A',
          opacity: 0.5,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* In-chart ASSET-X data callout */}
      <div style={{ position: 'absolute', top: 46, right: 14, zIndex: 2, ...tagStyle }}>
        ASSET-X · +ΔE
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 6,
          left: 12,
          zIndex: 2,
          ...legendStyle,
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: PERI,
              opacity: 0.55,
            }}
          />
          Class assets
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: NEON_BLUE,
              boxShadow: `0 0 6px ${NEON_BLUE}`,
            }}
          />
          ASSET-X
        </span>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 50, right: 24, bottom: 32, left: 18 }}>
          <CartesianGrid stroke={GRID} strokeDasharray="2 4" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[20, 95]}
            tick={{ fontSize: 9, fill: TICK }}
            tickLine={false}
            axisLine={{ stroke: AXIS }}
            label={{
              value: 'Exposure (AUC)',
              position: 'insideBottom',
              offset: -6,
              fill: TICK,
              fontSize: 9,
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[15, 75]}
            tick={{ fontSize: 9, fill: TICK }}
            tickLine={false}
            axisLine={{ stroke: AXIS }}
            label={{
              value: 'Response',
              angle: -90,
              position: 'insideLeft',
              fill: TICK,
              fontSize: 9,
              offset: 16,
            }}
          />
          <ReferenceArea
            x1={ENVELOPE.x1}
            x2={ENVELOPE.x2}
            y1={ENVELOPE.y1}
            y2={ENVELOPE.y2}
            fill={ENV_FILL}
            fillOpacity={0.10}
            stroke={ENV_STROKE}
            strokeOpacity={0.45}
            strokeDasharray="3 3"
          />
          <Scatter
            data={COMPETITORS}
            shape={<CompetitorDot />}
            isAnimationActive={!prefersReduce}
            animationDuration={900}
            animationBegin={200}
          />
          <Scatter
            data={ASSET_X}
            shape={(props) => <AssetXDot {...props} prefersReduce={prefersReduce} />}
            isAnimationActive={!prefersReduce}
            animationDuration={700}
            animationBegin={1100}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
