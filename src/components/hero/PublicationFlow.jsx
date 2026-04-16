/*
  PublicationFlow — ported from prototype.
  Paper cards float down, scan line processes them, data table appears below.
  Animation fills the full hero area, positioned on the right side (left: 54%, right: 7%).
*/
import { useEffect, useRef, useMemo } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'

const NEON_BLUE = '#00BFFF'
const PERI  = '#7EB8FF'
const CORAL = '#FF9B7A'
const GOLD  = '#FFC75A'
const GREEN = '#6BFFAA'

const SOURCE_TYPES = [
  { label: 'Research Paper', color: CORAL, visual: 'lines' },
  { label: 'Chart / Graph', color: PERI, visual: 'chart' },
  { label: 'Data Table', color: GREEN, visual: 'grid' },
  { label: 'Conference Paper', color: GOLD, visual: 'poster' },
  { label: 'EMA Document', color: PERI, visual: 'ema' },
  { label: 'PowerPoint', color: CORAL, visual: 'slides' },
  { label: 'Clinical Trial', color: GREEN, visual: 'grid' },
  { label: 'FDA Guidance', color: GOLD, visual: 'ema' },
  { label: 'KM Curve', color: PERI, visual: 'chart' },
]

function SourceVisual({ type, color, w, h }) {
  const pad = 5
  const iw = w - pad * 2
  const ih = h * 0.5

  if (type === 'chart') {
    return (
      <svg width={iw} height={ih} viewBox={`0 0 ${iw} ${ih}`} style={{ margin: `0 ${pad}px` }}>
        {[0.2, 0.4, 0.6, 0.8].map((x, i) => (
          <rect key={i} x={x * iw - 3} y={ih - [0.5, 0.8, 0.6, 0.9][i] * ih} width={6} height={[0.5, 0.8, 0.6, 0.9][i] * ih} rx={1} fill={color} opacity={0.6} />
        ))}
        <path d={`M${iw * 0.1},${ih * 0.7} Q${iw * 0.35},${ih * 0.15} ${iw * 0.55},${ih * 0.35} T${iw * 0.9},${ih * 0.12}`} stroke={color} strokeWidth="2.5" fill="none" opacity="0.9" />
      </svg>
    )
  }
  if (type === 'grid') {
    return (
      <svg width={iw} height={ih} viewBox={`0 0 ${iw} ${ih}`} style={{ margin: `0 ${pad}px` }}>
        {[0.25, 0.5, 0.75].map((y, i) => (<line key={`h${i}`} x1={2} y1={y * ih} x2={iw - 2} y2={y * ih} stroke={color} strokeWidth="1" opacity="0.4" />))}
        {[0.33, 0.66].map((x, i) => (<line key={`v${i}`} x1={x * iw} y1={2} x2={x * iw} y2={ih - 2} stroke={color} strokeWidth="1" opacity="0.4" />))}
        {[0.17, 0.5, 0.83].map((x, xi) => [0.12, 0.37, 0.62, 0.87].map((y, yi) => (
          <rect key={`c${xi}${yi}`} x={x * iw - 4} y={y * ih - 1.5} width={8} height={3} rx={1} fill={color} opacity={0.35 + Math.random() * 0.2} />
        )))}
      </svg>
    )
  }
  if (type === 'poster') {
    return (
      <svg width={iw} height={ih} viewBox={`0 0 ${iw} ${ih}`} style={{ margin: `0 ${pad}px` }}>
        <rect x={2} y={2} width={iw - 4} height={ih * 0.2} rx={1} fill={color} opacity="0.45" />
        <rect x={2} y={ih * 0.3} width={iw * 0.45} height={ih * 0.6} rx={1} fill={color} opacity="0.22" />
        <rect x={iw * 0.52} y={ih * 0.3} width={iw * 0.45} height={ih * 0.6} rx={1} fill={color} opacity="0.22" />
      </svg>
    )
  }
  if (type === 'ema') {
    return (
      <svg width={iw} height={ih} viewBox={`0 0 ${iw} ${ih}`} style={{ margin: `0 ${pad}px` }}>
        {[0.2, 0.35, 0.5, 0.65].map((y, i) => (<rect key={i} x={3} y={y * ih} width={iw * (i === 0 ? 0.5 : 0.8)} height={3} rx={1} fill={color} opacity="0.35" />))}
        <circle cx={iw * 0.75} cy={ih * 0.3} r={ih * 0.18} fill="none" stroke={color} strokeWidth="1.5" opacity="0.4" />
      </svg>
    )
  }
  if (type === 'slides') {
    return (
      <svg width={iw} height={ih} viewBox={`0 0 ${iw} ${ih}`} style={{ margin: `0 ${pad}px` }}>
        <rect x={2} y={2} width={iw - 4} height={ih - 4} rx={2} fill={color} opacity="0.12" stroke={color} strokeWidth="1" />
        <rect x={5} y={ih * 0.15} width={iw * 0.6} height={3} rx={1} fill={color} opacity="0.45" />
        <rect x={5} y={ih * 0.4} width={iw * 0.7} height={ih * 0.45} rx={1} fill={color} opacity="0.2" />
      </svg>
    )
  }
  return (
    <svg width={iw} height={ih} viewBox={`0 0 ${iw} ${ih}`} style={{ margin: `0 ${pad}px` }}>
      {[0.15, 0.32, 0.49, 0.66, 0.83].map((y, i) => (
        <rect key={i} x={3} y={y * ih} width={iw * (i === 0 ? 0.55 : i === 4 ? 0.4 : 0.85)} height={3} rx={1} fill={color} opacity={i === 0 ? 0.5 : 0.3} />
      ))}
    </svg>
  )
}

function seededRand(seed) {
  let s = seed * 9301 + 49297
  s = ((s * s) >>> 0) % 233280
  return s / 233280
}

const SPAWN_TOP = 6
const SCAN_LINE = 44
const CONTAINER_H = 580

function PaperThumbnail({ index, total }) {
  const config = useMemo(() => {
    const source = SOURCE_TYPES[index % SOURCE_TYPES.length]
    const r1 = seededRand(index + 1)
    const r4 = seededRand(index + 19)
    const w = (56 + (index % 3) * 6) * 1.44
    const h = (70 + (index % 3) * 5) * 1.44
    const hPct = (h / CONTAINER_H) * 100
    const endTop = SCAN_LINE - hPct
    const ANIM_DUR = 5
    const REPEAT_WAIT = 5
    const wave = Math.floor(index / 3)
    const posInWave = index % 3
    const del = wave * (ANIM_DUR * 0.75) + posInWave * 0.35
    const zoneStart = [5, 30, 55]
    const xPos = zoneStart[posInWave] + r1 * 18
    const rot = -8 + r4 * 16

    return { x: xPos, rotation: rot, width: w, height: h, endTop, duration: ANIM_DUR, delay: del, repeatWait: REPEAT_WAIT, accent: source.color, label: source.label, visual: source.visual }
  }, [index, total])

  const yEnd = ((config.endTop - SPAWN_TOP) / 100) * CONTAINER_H
  const yStep1 = (2 / 100) * CONTAINER_H
  // Card travels its full height past clip boundary — creates disintegration effect
  const yStep2 = config.height

  // Compute times so card moves at constant speed (no speed bump at exit)
  const totalTravel = yEnd + yStep2
  const scanTime = 0.06 + 0.94 * (yEnd / totalTravel)

  return (
    <motion.div
      style={{
        position: 'absolute', top: `${SPAWN_TOP}%`, left: `${config.x}%`, width: config.width, height: config.height,
        borderRadius: 5, background: '#0F172AFF', border: `2px solid ${config.accent}90`,
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        WebkitTransform: 'translateZ(0)', willChange: 'transform, opacity',
        display: 'flex', flexDirection: 'column', pointerEvents: 'none', overflow: 'hidden',
        boxShadow: `0 0 12px ${config.accent}60, 0 4px 16px ${config.accent}20`,
      }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: [0, yStep1, yEnd, yEnd + yStep2],
        opacity: [0, 1, 1, 1],
        rotate: [config.rotation, config.rotation * 0.6, config.rotation * 0.1, 0],
        scale: [0.85, 1, 1, 1],
      }}
      transition={{
        duration: config.duration, delay: config.delay,
        repeat: Infinity, repeatDelay: config.repeatWait,
        times: [0, 0.06, scanTime, 1], ease: 'linear',
      }}
    >
      <div style={{ fontSize: 5.5, fontWeight: 700, fontFamily: "'Inter', sans-serif", color: config.accent, letterSpacing: 0.8, textTransform: 'uppercase', padding: '4px 6px 2px', opacity: 0.9 }}>
        {config.label}
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: `drop-shadow(0 0 4px ${config.accent}50)` }}>
        <SourceVisual type={config.visual} color={config.accent} w={config.width} h={config.height} />
      </div>
    </motion.div>
  )
}

function ScanLine() {
  return (
    <div style={{ position: 'absolute', left: '4%', right: '4%', top: '44%', height: 1, zIndex: 3, pointerEvents: 'none' }}>
      <motion.div
        style={{
          width: '100%', height: 2,
          background: `linear-gradient(90deg, transparent, ${CORAL}CC, ${GOLD}EE, ${PERI}EE, ${GREEN}CC, transparent)`,
          borderRadius: 99, boxShadow: `0 0 6px ${PERI}60, 0 0 16px ${PERI}30`,
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute', left: 0, right: 0, top: -12, bottom: -12,
          background: `linear-gradient(90deg, transparent, ${GOLD}35, ${PERI}50, ${GOLD}35, transparent)`,
          borderRadius: 99, filter: 'blur(10px)',
        }}
        animate={{ opacity: [0.4, 0.85, 0.4] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        style={{
          position: 'absolute', top: -10, width: 100, height: 21, borderRadius: 99,
          background: `radial-gradient(ellipse at center, ${PERI}80 0%, ${PERI}40 35%, transparent 100%)`,
          filter: 'blur(4px)', boxShadow: `0 0 20px ${PERI}40`,
        }}
        animate={{ left: ['0%', '90%', '0%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

function StageLabel({ children, x, y, delay = 0, color, z = 1 }) {
  return (
    <motion.div
      style={{
        position: 'absolute', left: x, top: y, zIndex: z,
        fontSize: 10, fontWeight: 600, fontFamily: "'Inter', sans-serif",
        color, letterSpacing: 1.2, textTransform: 'uppercase',
        pointerEvents: 'none', whiteSpace: 'nowrap',
        textShadow: `0 0 12px ${color}`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 1 }}
    >
      {children}
    </motion.div>
  )
}

const TABLE_COLUMNS = ['Drug', 'Dose', 'Endpoint', 'Time', 'DV']
const TABLE_ROWS = [[52, 30, 58, 20, 28], [46, 36, 50, 22, 32], [58, 28, 44, 18, 24], [42, 34, 62, 24, 30], [50, 30, 54, 20, 26]]

function SkeletonCell({ width, delay, color }) {
  return (
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <div style={{ width: `${width}%`, height: 6, borderRadius: 99, background: `${color}44`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, transparent 0%, ${color}80 50%, transparent 100%)`, animation: `shimmer 3s ease-in-out ${delay}s infinite` }} />
      </div>
    </div>
  )
}

function DataTable() {
  return (
    <motion.div
      style={{
        position: 'absolute', left: '4%', right: '4%', top: '60%', borderRadius: 16,
        background: '#0F172ADD', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        WebkitTransform: 'translateZ(0)', willChange: 'transform, opacity',
        border: `2px solid ${NEON_BLUE}90`, padding: '14px 18px',
        display: 'flex', flexDirection: 'column',
        boxShadow: `0 0 4px ${NEON_BLUE}80, 0 0 16px ${NEON_BLUE}50, 0 0 36px ${NEON_BLUE}25, 0 8px 32px -8px #020B0F80`,
      }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.8 }}
    >
      <div style={{ display: 'flex', gap: 10, paddingBottom: 10, borderBottom: `1px solid ${NEON_BLUE}30` }}>
        {TABLE_COLUMNS.map((col, i) => (
          <motion.div key={col} style={{ flex: 1, fontSize: 9, fontWeight: 600, fontFamily: "'Inter', sans-serif", color: `${NEON_BLUE}CC`, letterSpacing: 0.5, textTransform: 'uppercase' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 + i * 0.08 }}>
            {col}
          </motion.div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 10 }}>
        {TABLE_ROWS.map((widths, rowIdx) => (
          <motion.div key={rowIdx} style={{ display: 'flex', gap: 10 }} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.2 + rowIdx * 0.4, duration: 0.4 }}>
            {widths.map((w, colIdx) => (<SkeletonCell key={colIdx} width={w} delay={rowIdx * 0.15} color={NEON_BLUE} />))}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Disintegration fragments — rectangular shards that shatter from the scan line ─── */
const FRAG_COLORS = [CORAL, GOLD, PERI, GREEN, NEON_BLUE]
const fragStyles = `
@keyframes shardDown {
  0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: var(--f-o); }
  40% { opacity: var(--f-o); }
  100% { transform: translate(var(--f-dx), var(--f-dy)) rotate(var(--f-rot)) scale(0.1); opacity: 0; }
}
@keyframes shardUp {
  0% { transform: translate(0, 0) rotate(0deg) scale(1); opacity: var(--f-o); }
  30% { opacity: var(--f-o); }
  100% { transform: translate(var(--f-dx), var(--f-dy)) rotate(var(--f-rot)) scale(0); opacity: 0; }
}
`

function DisintegrationParticles() {
  const fragments = useMemo(() =>
    Array.from({ length: 40 }).map((_, i) => {
      const r1 = seededRand(i + 100)
      const r2 = seededRand(i + 200)
      const r3 = seededRand(i + 300)
      const r4 = seededRand(i + 400)
      const r5 = seededRand(i + 500)
      const goesUp = i % 5 === 0 // 20% fly upward (debris)
      const w = 1.5 + r1 * 3    // 1.5–4.5px wide
      const h = 1 + r2 * 2.5    // 1–3.5px tall — rectangular shards
      const dx = -40 + r3 * 80  // scatter sideways -40 to +40px
      const dy = goesUp ? -(5 + r4 * 20) : (6 + r4 * 40) // up: -5 to -25, down: 6 to 46
      const rot = -180 + r5 * 360
      return {
        x: 4 + r1 * 92,
        w, h, dx, dy, rot,
        dur: 0.8 + r3 * 1.4,    // 0.8–2.2s
        delay: r4 * 4,          // staggered over 4s
        color: FRAG_COLORS[i % FRAG_COLORS.length],
        opacity: 0.6 + r2 * 0.35,
        anim: goesUp ? 'shardUp' : 'shardDown',
      }
    }), [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fragStyles }} />
      <div style={{ position: 'absolute', left: '4%', right: '4%', top: '44%', height: 0, zIndex: 4, pointerEvents: 'none' }}>
        {fragments.map((f, i) => (
          <div
            key={i}
            style={{
              position: 'absolute', left: `${f.x}%`, top: -1,
              width: f.w, height: f.h, borderRadius: 1,
              background: f.color, boxShadow: `0 0 4px ${f.color}70`,
              '--f-dx': `${f.dx}px`, '--f-dy': `${f.dy}px`,
              '--f-rot': `${f.rot}deg`, '--f-o': f.opacity,
              animation: `${f.anim} ${f.dur}s ease-out ${f.delay}s infinite`,
              willChange: 'transform, opacity',
            }}
          />
        ))}
      </div>
    </>
  )
}

/* ─── Data rain — characters fall from scan line into the data table ─── */
const DATA_GLYPHS = ['0','1','3','7','9','A','D','K','PK','DV','mg','nM','GLP','μg','IC50','AUC','t½','EC50','Cmax','Tmax']
const dataRainStyle = `
@keyframes dataFall {
  0% { transform: translateY(0) scale(0.6); opacity: 0; }
  8% { transform: translateY(4px) scale(1); opacity: var(--d-o); }
  75% { opacity: var(--d-o); }
  100% { transform: translateY(var(--d-dist)) scale(0.5); opacity: 0; }
}
`

function DataRain() {
  const drops = useMemo(() =>
    Array.from({ length: 18 }).map((_, i) => {
      const r1 = seededRand(i + 600)
      const r2 = seededRand(i + 700)
      const r3 = seededRand(i + 800)
      const r4 = seededRand(i + 900)
      return {
        x: 6 + r1 * 88,
        glyph: DATA_GLYPHS[i % DATA_GLYPHS.length],
        size: 7 + r2 * 3,           // 7–10px font
        dur: 1.5 + r3 * 2,          // 1.5–3.5s fall
        delay: r4 * 5,              // stagger over 5s
        dist: 40 + r2 * 50,         // 40–90px fall distance
        opacity: 0.25 + r1 * 0.35,  // subtle
      }
    }), [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: dataRainStyle }} />
      <div style={{ position: 'absolute', left: '4%', right: '4%', top: '46%', height: '14%', zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }}>
        {drops.map((d, i) => (
          <span
            key={i}
            style={{
              position: 'absolute', left: `${d.x}%`, top: 0,
              fontSize: d.size, fontFamily: "'Roboto Mono', 'SF Mono', monospace",
              fontWeight: 600, color: NEON_BLUE, letterSpacing: 0.5,
              textShadow: `0 0 8px ${NEON_BLUE}60, 0 0 16px ${NEON_BLUE}30`,
              '--d-dist': `${d.dist}px`, '--d-o': d.opacity,
              animation: `dataFall ${d.dur}s ease-in ${d.delay}s infinite`,
              willChange: 'transform, opacity',
            }}
          >
            {d.glyph}
          </span>
        ))}
      </div>
    </>
  )
}

export default function PublicationFlow({ overlay = false }) {
  const containerRef = useRef(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 })
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 })
  const parallaxX = useTransform(springX, [-500, 500], [-8, 8])
  const parallaxY = useTransform(springY, [-500, 500], [-6, 6])

  useEffect(() => {
    const handleMouse = (e) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      mouseX.set(e.clientX - rect.width / 2)
      mouseY.set(e.clientY - rect.height / 2)
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  // Desktop overlay: absolute, confined to right side (matching prototype left:54% right:7% top:24% bottom:4%)
  // Mobile standalone: relative container with fixed height, animation fills it
  if (overlay) {
    return (
      <div ref={containerRef} style={{ position: 'absolute', inset: 0 }}>
        <motion.div
          style={{
            position: 'absolute',
            left: '54%',
            right: '7%',
            top: '24%',
            bottom: '4%',
            x: parallaxX,
            y: parallaxY,
          }}
        >
          {/* Cards clipped at scan line — creates disintegration illusion */}
          <div style={{ position: 'absolute', inset: 0, clipPath: 'inset(0 0 56% 0)' }}>
            {Array.from({ length: 9 }).map((_, i) => (<PaperThumbnail key={i} index={i} total={9} />))}
          </div>
          <StageLabel x="4%" y="41%" delay={0.8} color={`${CORAL}BB`} z={5}>AI Extraction</StageLabel>
          <StageLabel x="4%" y="55%" delay={1.2} color={`${GOLD}BB`} z={5}>Structured Dataset</StageLabel>
          <ScanLine />
          <DisintegrationParticles />
          <DataRain />
          <DataTable />
        </motion.div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: 'clamp(350px, 60vh, 580px)' }}>
      <motion.div style={{ position: 'absolute', inset: 0, x: parallaxX, y: parallaxY }}>
        {/* Cards clipped at scan line — creates disintegration illusion */}
        <div style={{ position: 'absolute', inset: 0, clipPath: 'inset(0 0 56% 0)' }}>
          {Array.from({ length: 9 }).map((_, i) => (<PaperThumbnail key={i} index={i} total={9} />))}
        </div>
        <StageLabel x="4%" y="41%" delay={0.8} color={`${CORAL}BB`} z={5}>AI Extraction</StageLabel>
        <StageLabel x="4%" y="55%" delay={1.2} color={`${GOLD}BB`} z={5}>Structured Dataset</StageLabel>
        <ScanLine />
        <DisintegrationParticles />
        <DataRain />
        <DataTable />
      </motion.div>
    </div>
  )
}
