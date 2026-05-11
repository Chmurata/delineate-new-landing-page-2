import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { createTimeline, stagger } from 'animejs'

// Continuous halo breath is intentionally disabled. The illustration plays
// its entrance timeline once and then settles. Flip to `true` to re-enable.
const CONTINUOUS_LOOPS_ENABLED = true

const ACCENT = '#7C9ED9'
const PERI = '#7EB8FF'
const GREEN = '#6BFFAA'
const CORAL = '#FF9B7A'
const GOLD = '#FFC75A'

// Card frame (inset ~6px inside the 480x320 viewBox)
const FRAME_X = 6
const FRAME_Y = 6
const FRAME_W = 468
const FRAME_H = 308

// Header band
const HEADER_TOP = 14
const HEADER_BOTTOM = 44

// Plot area
const PLOT_X0 = 56
const PLOT_X1 = 444
const PLOT_Y0 = 240 // baseline
const PLOT_Y1 = 70 // top

// Sigmoid-shaped path approximated with cubic bezier.
// Efficacy: rises earlier and plateaus high.
const efficacyPath = `M${PLOT_X0},${PLOT_Y0 - 4} C${PLOT_X0 + 110},${PLOT_Y0 - 4} ${PLOT_X0 + 170},${PLOT_Y1 + 14} ${PLOT_X1},${PLOT_Y1 + 14}`
// Toxicity: shifted right, steeper later rise, plateau lower than efficacy top.
const toxicityPath = `M${PLOT_X0},${PLOT_Y0 - 2} C${PLOT_X0 + 200},${PLOT_Y0 - 2} ${PLOT_X0 + 260},${PLOT_Y1 + 60} ${PLOT_X1},${PLOT_Y1 + 50}`

// Optimum at sweet spot — efficacy high, toxicity still moderate.
const OPT_X = PLOT_X0 + (PLOT_X1 - PLOT_X0) * 0.55
const OPT_Y = PLOT_Y1 + 28 // sits on the upper plateau of efficacy

// X-axis chip positions
const TICK_L = PLOT_X0 + (PLOT_X1 - PLOT_X0) * 0.2
const TICK_M = PLOT_X0 + (PLOT_X1 - PLOT_X0) * 0.5
const TICK_H = PLOT_X0 + (PLOT_X1 - PLOT_X0) * 0.8

// Legend chips at bottom
const LEGEND_Y = 290

export default function Ill03({ active = false, className = '', id = 'ill03' }) {
  const svgRef = useRef(null)
  const prefersReduce = useReducedMotion()

  useEffect(() => {
    const root = svgRef.current
    if (!root) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const frame = root.querySelector(`.${id}-frame`)
    const divider = root.querySelector(`.${id}-divider`)
    const xAxis = root.querySelector(`.${id}-xaxis`)
    const yAxis = root.querySelector(`.${id}-yaxis`)
    const efficacy = root.querySelector(`.${id}-efficacy`)
    const toxicity = root.querySelector(`.${id}-toxicity`)
    const drop = root.querySelector(`.${id}-drop`)

    const setDash = (el, full = false) => {
      if (!el) return 500
      const len = el.getTotalLength?.() || 500
      el.style.strokeDasharray = full ? `${len} ${len}` : String(len)
      el.style.strokeDashoffset = String(len)
      el.dataset.len = String(len)
      return len
    }

    setDash(frame)
    setDash(divider)
    setDash(xAxis)
    setDash(yAxis)
    setDash(efficacy)
    setDash(toxicity, true)
    setDash(drop, true)

    const headerEls = root.querySelectorAll(`.${id}-header`)
    const gridEls = root.querySelectorAll(`.${id}-grid`)
    const tickEls = root.querySelectorAll(`.${id}-tick`)
    const legendEls = root.querySelectorAll(`.${id}-legend-item`)
    const optChip = root.querySelector(`.${id}-opt-chip`)
    const dot = root.querySelector(`.${id}-dot`)

    if (reduce) {
      ;[frame, divider, xAxis, yAxis, efficacy].forEach((el) => {
        if (el) el.style.strokeDashoffset = '0'
      })
      if (toxicity) {
        toxicity.style.strokeDasharray = '5 3'
        toxicity.style.strokeDashoffset = '0'
      }
      if (drop) {
        drop.style.strokeDasharray = '4 4'
        drop.style.strokeDashoffset = '0'
      }
      headerEls.forEach((el) => (el.style.opacity = '1'))
      gridEls.forEach((el) => (el.style.opacity = '0.12'))
      tickEls.forEach((el) => (el.style.opacity = '0.6'))
      legendEls.forEach((el) => (el.style.opacity = '1'))
      if (optChip) optChip.style.opacity = '1'
      if (dot) {
        dot.style.opacity = '1'
        dot.style.transform = 'scale(1)'
      }
      // Soft fade-in to final state — no movement, just opacity.
      root.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: 'ease-out', fill: 'backwards' })
      return
    }

    if (!active) return

    const tl = createTimeline({ defaults: { ease: 'outQuad' } })

    tl.add(`.${id}-frame`, {
      strokeDashoffset: [Number(frame?.dataset?.len) || 500, 0],
      duration: 700,
    })
      .add(`.${id}-header`, { opacity: [0, 1], duration: 500, delay: stagger(80) }, '-=300')
      .add(
        `.${id}-divider`,
        { strokeDashoffset: [Number(divider?.dataset?.len) || 400, 0], duration: 500 },
        '-=400',
      )
      .add(
        [`.${id}-xaxis`, `.${id}-yaxis`],
        {
          strokeDashoffset: [(_, i) => Number([xAxis, yAxis][i]?.dataset?.len) || 300, 0],
          duration: 500,
        },
        '-=200',
      )
      .add(`.${id}-grid`, { opacity: [0, 0.12], duration: 400, delay: stagger(40) }, '-=300')
      .add(
        `.${id}-efficacy`,
        { strokeDashoffset: [Number(efficacy?.dataset?.len) || 500, 0], duration: 900 },
      )
      .add(
        `.${id}-toxicity`,
        {
          strokeDashoffset: [Number(toxicity?.dataset?.len) || 500, 0],
          duration: 900,
          onComplete: () => {
            if (toxicity) toxicity.style.strokeDasharray = '5 3'
          },
        },
        '-=600',
      )
      .add(
        `.${id}-drop`,
        {
          strokeDashoffset: [Number(drop?.dataset?.len) || 200, 0],
          duration: 500,
          onComplete: () => {
            if (drop) drop.style.strokeDasharray = '4 4'
          },
        },
        '-=300',
      )
      .add(
        `.${id}-dot`,
        { opacity: [0, 1], scale: [0.4, 1], duration: 500, ease: 'outElastic(1, .6)' },
        '-=300',
      )
      .add(`.${id}-opt-chip`, { opacity: [0, 1], duration: 400 }, '-=200')
      .add(`.${id}-tick`, { opacity: [0, 0.6], duration: 400, delay: stagger(60) }, '-=300')
      .add(`.${id}-legend-item`, { opacity: [0, 1], duration: 400, delay: stagger(80) }, '-=200')

    return () => tl?.pause?.()
  }, [active, id])

  const loopOn = CONTINUOUS_LOOPS_ENABLED && active && !prefersReduce

  return (
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
      <title>Optimize dose against the benefit-risk curve: efficacy and toxicity with marked optimum</title>

      <defs>
        <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`${id}-glow-soft`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Card frame */}
      <rect
        className={`${id}-frame`}
        x={FRAME_X}
        y={FRAME_Y}
        width={FRAME_W}
        height={FRAME_H}
        rx={14}
        ry={14}
        fill="rgba(8,12,24,0.35)"
      />

      {/* Header */}
      <text
        className={`${id}-header`}
        x={FRAME_X + 16}
        y={HEADER_TOP + 16}
        fill={PERI}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={10}
        fontWeight={600}
        letterSpacing={1.2}
        style={{ opacity: 0 }}
      >
        DOSE OPTIMIZATION
      </text>

      <g className={`${id}-header`} style={{ opacity: 0 }}>
        <rect
          x={FRAME_W - 88 - 8}
          y={HEADER_TOP + 4}
          width={88}
          height={18}
          rx={9}
          ry={9}
          fill={`${PERI}14`}
          stroke={PERI}
          strokeWidth={0.8}
          strokeOpacity={0.55}
        />
        <text
          x={FRAME_W - 88 - 8 + 44}
          y={HEADER_TOP + 16}
          fill={PERI}
          fontFamily="Inter, system-ui, sans-serif"
          fontSize={8}
          fontWeight={700}
          letterSpacing={0.8}
          textAnchor="middle"
          opacity={0.85}
        >
          BENEFIT/RISK
        </text>
      </g>

      {/* Hairline divider */}
      <line
        className={`${id}-divider`}
        x1={FRAME_X + 12}
        y1={HEADER_BOTTOM + 6}
        x2={FRAME_X + FRAME_W - 12}
        y2={HEADER_BOTTOM + 6}
        stroke="#2A3A5A"
        strokeWidth={0.6}
        strokeOpacity={0.5}
      />

      {/* Axis labels */}
      <text
        x={PLOT_X0 - 4}
        y={PLOT_Y1 - 4}
        fill={ACCENT}
        opacity={0.4}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={7}
        fontWeight={600}
        letterSpacing={0.6}
      >
        EFFECT
      </text>
      <text
        x={PLOT_X1}
        y={PLOT_Y0 + 14}
        fill={ACCENT}
        opacity={0.4}
        fontFamily="Inter, system-ui, sans-serif"
        fontSize={7}
        fontWeight={600}
        letterSpacing={0.6}
        textAnchor="end"
      >
        DOSE
      </text>

      {/* Grid */}
      <g stroke={ACCENT} strokeWidth={0.5}>
        {[0.25, 0.5, 0.75].map((t, i) => (
          <line
            key={`gh-${i}`}
            className={`${id}-grid`}
            x1={PLOT_X0}
            y1={PLOT_Y0 - (PLOT_Y0 - PLOT_Y1) * t}
            x2={PLOT_X1}
            y2={PLOT_Y0 - (PLOT_Y0 - PLOT_Y1) * t}
            opacity={0}
          />
        ))}
        {[0.25, 0.5, 0.75].map((t, i) => (
          <line
            key={`gv-${i}`}
            className={`${id}-grid`}
            x1={PLOT_X0 + (PLOT_X1 - PLOT_X0) * t}
            y1={PLOT_Y1}
            x2={PLOT_X0 + (PLOT_X1 - PLOT_X0) * t}
            y2={PLOT_Y0}
            opacity={0}
          />
        ))}
      </g>

      {/* Axes */}
      <line
        className={`${id}-xaxis`}
        x1={PLOT_X0}
        y1={PLOT_Y0}
        x2={PLOT_X1}
        y2={PLOT_Y0}
        stroke={ACCENT}
        strokeWidth={1}
        strokeOpacity={0.45}
      />
      <line
        className={`${id}-yaxis`}
        x1={PLOT_X0}
        y1={PLOT_Y0}
        x2={PLOT_X0}
        y2={PLOT_Y1}
        stroke={ACCENT}
        strokeWidth={1}
        strokeOpacity={0.45}
      />

      {/* Efficacy curve (green solid) */}
      <path
        className={`${id}-efficacy`}
        d={efficacyPath}
        fill="none"
        stroke={GREEN}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeOpacity={0.9}
        filter={`url(#${id}-glow-soft)`}
      />

      {/* Toxicity curve (coral dashed, slightly subordinate to efficacy) */}
      <path
        className={`${id}-toxicity`}
        d={toxicityPath}
        fill="none"
        stroke={CORAL}
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeOpacity={0.7}
        filter={`url(#${id}-glow-soft)`}
      />

      {/* Drop line from optimum */}
      <line
        className={`${id}-drop`}
        x1={OPT_X}
        y1={OPT_Y}
        x2={OPT_X}
        y2={PLOT_Y0}
        stroke={GOLD}
        strokeWidth={1}
        strokeOpacity={0.4}
      />

      {/* Optimum halo (breathing — subtle, gold reserved for the optimum concept) */}
      <g>
        <motion.circle
          cx={OPT_X}
          cy={OPT_Y}
          r={9}
          fill="none"
          stroke={GOLD}
          strokeWidth={0.9}
          initial={{ r: 9, opacity: 0.28 }}
          animate={loopOn ? { r: [9, 14, 9], opacity: [0.28, 0.08, 0.28] } : { r: 9, opacity: 0.28 }}
          transition={loopOn ? { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
        />
        <motion.circle
          cx={OPT_X}
          cy={OPT_Y}
          r={13}
          fill="none"
          stroke={GOLD}
          strokeWidth={0.7}
          initial={{ r: 13, opacity: 0.1 }}
          animate={loopOn ? { r: [13, 20, 13], opacity: [0.1, 0.02, 0.1] } : { r: 13, opacity: 0.1 }}
          transition={loopOn ? { duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 } : { duration: 0 }}
        />
      </g>

      {/* Optimum marker (filled diamond/star — using star path) */}
      <g
        className={`${id}-dot`}
        style={{ opacity: 0, transformOrigin: `${OPT_X}px ${OPT_Y}px` }}
        filter={`url(#${id}-glow)`}
      >
        <circle cx={OPT_X} cy={OPT_Y} r={5.5} fill={GOLD} />
        <path
          d={`M${OPT_X},${OPT_Y - 3.2} L${OPT_X + 0.9},${OPT_Y - 1} L${OPT_X + 3.2},${OPT_Y - 0.8} L${OPT_X + 1.4},${OPT_Y + 0.8} L${OPT_X + 1.9},${OPT_Y + 3} L${OPT_X},${OPT_Y + 1.7} L${OPT_X - 1.9},${OPT_Y + 3} L${OPT_X - 1.4},${OPT_Y + 0.8} L${OPT_X - 3.2},${OPT_Y - 0.8} L${OPT_X - 0.9},${OPT_Y - 1} Z`}
          fill="#1A1408"
          opacity={0.55}
        />
      </g>

      {/* OPT chip below drop line on x-axis */}
      <g className={`${id}-opt-chip`} style={{ opacity: 0 }}>
        <rect
          x={OPT_X - 14}
          y={PLOT_Y0 + 4}
          width={28}
          height={12}
          rx={6}
          ry={6}
          fill="#FFC75A20"
          stroke={GOLD}
          strokeWidth={0.8}
          strokeOpacity={0.8}
        />
        <text
          x={OPT_X}
          y={PLOT_Y0 + 12}
          fill={GOLD}
          fontFamily="Inter, system-ui, sans-serif"
          fontSize={7}
          fontWeight={700}
          letterSpacing={0.6}
          textAnchor="middle"
        >
          OPT
        </text>
      </g>

      {/* X-axis tick chips: L / M / H */}
      <g fontFamily="Inter, system-ui, sans-serif" fontSize={7} fontWeight={600}>
        {[
          { x: TICK_L, label: 'L' },
          { x: TICK_M, label: 'M' },
          { x: TICK_H, label: 'H' },
        ].map((t, i) => (
          <text
            key={i}
            className={`${id}-tick`}
            x={t.x}
            y={PLOT_Y0 + 14}
            fill={ACCENT}
            opacity={0}
            textAnchor="middle"
          >
            {t.label}
          </text>
        ))}
      </g>

      {/* Legend chips */}
      <g>
        {[
          { label: 'efficacy', color: GREEN, kind: 'dot' },
          { label: 'toxicity', color: CORAL, kind: 'dot' },
          { label: 'optimum', color: GOLD, kind: 'star' },
        ].map((item, i) => {
          const chipW = 70
          const gap = 8
          const totalW = chipW * 3 + gap * 2
          const startX = (480 - totalW) / 2
          const x = startX + i * (chipW + gap)
          return (
            <g
              key={item.label}
              className={`${id}-legend-item`}
              style={{ opacity: 0 }}
            >
              <rect
                x={x}
                y={LEGEND_Y}
                width={chipW}
                height={16}
                rx={8}
                ry={8}
                fill="rgba(255,255,255,0.03)"
                stroke={ACCENT}
                strokeWidth={0.5}
                strokeOpacity={0.14}
              />
              {item.kind === 'star' ? (
                <path
                  d={`M${x + 12},${LEGEND_Y + 4.5} L${x + 13.1},${LEGEND_Y + 7.2} L${x + 16},${LEGEND_Y + 7.5} L${x + 13.7},${LEGEND_Y + 9.5} L${x + 14.4},${LEGEND_Y + 12.5} L${x + 12},${LEGEND_Y + 10.8} L${x + 9.6},${LEGEND_Y + 12.5} L${x + 10.3},${LEGEND_Y + 9.5} L${x + 8},${LEGEND_Y + 7.5} L${x + 10.9},${LEGEND_Y + 7.2} Z`}
                  fill={item.color}
                />
              ) : (
                <circle cx={x + 12} cy={LEGEND_Y + 8} r={2.6} fill={item.color} />
              )}
              <text
                x={x + 22}
                y={LEGEND_Y + 11}
                fill={PERI}
                fontFamily="Inter, system-ui, sans-serif"
                fontSize={7.5}
                fontWeight={500}
                opacity={0.85}
              >
                {item.label}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}
