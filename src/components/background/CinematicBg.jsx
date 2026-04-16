/*
  Cinematic Pro Background — ported from prototype FullPageBg.jsx
  Stars + floating cells with split-axis CSS-only drift + film grain
*/
import { useIsDesktop } from '../../hooks/useMediaQuery'

const DRIFT_X = ['driftX1', 'driftX2', 'driftX3', 'driftX4', 'driftX5']
const DRIFT_Y = ['driftY1', 'driftY2', 'driftY3', 'driftY4', 'driftY5']
const CELL_ROT = ['cellRot1', 'cellRot2', 'cellRot3', 'cellRot4']

function getCellAnims(i) {
  return {
    xAnim: DRIFT_X[i % 5],
    yAnim: DRIFT_Y[(i * 3 + 1) % 5],
    rotAnim: CELL_ROT[(i * 2 + 1) % 4],
  }
}

// [cellIndex, x%, y%, widthPx, opacity, xDur, yDur, rotDur, glowRadius, glowOpacity, imgBlur]
const CINE_CELLS = [
  // Massive deep cells
  [0,  15, 20, 280, 0.1,  70, 85, 120, 80, 0.08, 25],
  [1,  65, 55, 240, 0.08, 80, 65, 110, 70, 0.06, 30],
  [2,  40, 80, 220, 0.09, 75, 90, 130, 60, 0.07, 28],
  // Far field
  [14, 45, 8,   20, 0.4,  55, 65, 90,  8,  0.15, 4],
  [15, 18, 15,  16, 0.35, 60, 50, 85,  6,  0.12, 4],
  [11,  6, 28,  24, 0.4,  50, 62, 95,  10, 0.15, 4],
  [16, 62, 45,  14, 0.35, 58, 48, 80,  6,  0.1,  5],
  [13, 38, 50,  18, 0.38, 52, 68, 88,  8,  0.12, 4],
  [15, 12, 75,  16, 0.35, 56, 45, 92,  6,  0.1,  5],
  [14, 50, 78,  14, 0.35, 62, 55, 100, 6,  0.1,  4],
  // Mid field
  [9,  22, 42,  50, 0.7,  38, 48, 70, 22, 0.25, 1.5],
  [3,  90, 60,  60, 0.65, 42, 35, 65, 25, 0.22, 1.5],
  [8,  72, 70,  55, 0.7,  35, 45, 75, 22, 0.25, 1.5],
  [10,  6, 88,  50, 0.65, 40, 52, 68, 20, 0.2,  2],
  [7,  32, 92,  48, 0.6,  44, 36, 72, 20, 0.2,  1.5],
  [2,  55, 22,  65, 0.65, 40, 50, 60, 26, 0.22, 1.5],
  [6,  85, 42,  45, 0.6,  42, 38, 78, 18, 0.2,  2],
  // Near field
  [4,  90, 80, 110, 0.95, 30, 40, 52, 40, 0.3,  0],
  [12, 82, 95,  40, 0.8,  34, 28, 48, 18, 0.25, 0],
]

// Stars
const CINE_STARS = (() => {
  const stars = []
  for (let i = 0; i < 70; i++) {
    const isBright = i % 12 === 0
    stars.push({
      x: `${3 + ((i * 17 + 7) % 94)}%`,
      y: `${2 + ((i * 23 + 11) % 96)}%`,
      size: isBright ? 3 : (1 + (i % 3) * 0.5),
      opacity: isBright ? 0.7 : (0.3 + (i % 5) * 0.08),
      glow: isBright ? 6 : 0,
    })
  }
  return stars
})()

function CinematicProCell({ cellIdx, x, y, width, opacity, xAnim, xDur, yAnim, yDur, rotAnim, rotDur, glowRadius, glowOpacity, imgBlur, skipGlow = false }) {
  return (
    <div style={{
      position: 'absolute', left: `${x}%`, top: `${y}%`,
      animation: `${xAnim} ${xDur}s ease-in-out infinite`,
      pointerEvents: 'none',
    }}>
      <div style={{ animation: `${yAnim} ${yDur}s ease-in-out infinite` }}>
        <div style={{ width, animation: `${rotAnim} ${rotDur}s ease-in-out infinite` }}>
          {/* Glow — hidden on mobile via skipGlow prop to avoid filter: blur() cost */}
          {!skipGlow && (
            <div style={{
              position: 'absolute', inset: `-${glowRadius * 0.4}px`, borderRadius: '50%',
              background: `radial-gradient(ellipse at center, rgba(45, 100, 220, ${glowOpacity}) 0%, transparent 70%)`,
              filter: `blur(${glowRadius}px)`, pointerEvents: 'none',
            }} />
          )}
          <img
            src={`/assets/cells/cell-${cellIdx}.png`}
            alt=""
            style={{
              position: 'relative', width: '100%', height: 'auto', opacity,
              filter: imgBlur > 0 ? `blur(${imgBlur}px)` : 'none',
            }}
          />
        </div>
      </div>
    </div>
  )
}

function FilmGrain({ opacity = 0.035 }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity }}>
      <filter id="fpgrain"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" /></filter>
      <rect width="100%" height="100%" filter="url(#fpgrain)" />
    </svg>
  )
}

export default function CinematicBg() {
  const isDesktop = useIsDesktop()

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0" style={{ background: '#020B0F' }}>
      {/* Stars */}
      {CINE_STARS.map((s, i) => (
        <div
          key={`star-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: s.x, top: s.y, width: s.size, height: s.size,
            background: '#FFFFFF', opacity: s.opacity,
            boxShadow: s.glow > 0 ? `0 0 ${s.glow}px rgba(180, 210, 255, 0.6)` : 'none',
          }}
        />
      ))}

      {/* Floating cells — fewer on mobile, no glow blur on mobile */}
      {CINE_CELLS.map(([cellIdx, x, y, width, opacity, xDur, yDur, rotDur, glowRadius, glowOpacity, imgBlur], i) => {
        const anims = getCellAnims(i)
        const tier = i < 3 ? 'deep' : i < 10 ? 'far' : 'near'
        // On mobile, skip deep+far tier cells entirely (don't render at all)
        if (!isDesktop && tier !== 'near') return null
        return (
          <CinematicProCell
            key={`cell-${i}`}
            cellIdx={cellIdx} x={x} y={y} width={width} opacity={opacity}
            xAnim={anims.xAnim} xDur={xDur}
            yAnim={anims.yAnim} yDur={yDur}
            rotAnim={anims.rotAnim} rotDur={rotDur}
            glowRadius={glowRadius} glowOpacity={glowOpacity} imgBlur={imgBlur}
            skipGlow={!isDesktop}
          />
        )
      })}

      {isDesktop && <FilmGrain opacity={0.035} />}
    </div>
  )
}
