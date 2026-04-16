/*
  ScrollCells — 3 near-field cells with scroll-linked choreography
  Desktop only (lg:+). Ported from prototype.
*/
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'

const SCROLL_STOPS = [0, 0.10, 0.22, 0.38, 0.55, 0.70, 0.85, 1.0]
const springConfig = { stiffness: 30, damping: 22, mass: 2.5 }

function ScrollCell({ cellIdx, width, opacity, glowRadius, glowOpacity, xPath, yPath, scrollProgress }) {
  const rawX = useTransform(scrollProgress, SCROLL_STOPS, xPath)
  const rawY = useTransform(scrollProgress, SCROLL_STOPS, yPath)
  const x = useSpring(rawX, springConfig)
  const y = useSpring(rawY, springConfig)

  return (
    <motion.div
      style={{
        position: 'absolute', left: 0, top: 0, x, y,
        width, pointerEvents: 'none',
      }}
    >
      <div style={{
        position: 'absolute', inset: `-${glowRadius * 0.4}px`, borderRadius: '50%',
        background: `radial-gradient(ellipse at center, rgba(45, 100, 220, ${glowOpacity}) 0%, transparent 70%)`,
        filter: `blur(${glowRadius}px)`, pointerEvents: 'none',
      }} />
      <img
        src={`/assets/cells/cell-${cellIdx}.png`}
        alt=""
        style={{ position: 'relative', width: '100%', height: 'auto', opacity }}
      />
    </motion.div>
  )
}

export default function ScrollCells() {
  const { scrollYProgress } = useScroll()

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden hidden lg:block" style={{ zIndex: 1 }}>
      <ScrollCell
        cellIdx={1} width={140} opacity={1.0} glowRadius={45} glowOpacity={0.35}
        scrollProgress={scrollYProgress}
        xPath={[1220, 1180, 780, 1100, 350, 1000, 850, 1220]}
        yPath={[70, 140, 260, 220, 300, 360, 300, 70]}
      />
      <ScrollCell
        cellIdx={0} width={160} opacity={1.0} glowRadius={50} glowOpacity={0.35}
        scrollProgress={scrollYProgress}
        xPath={[-70, -50, 280, -30, 700, -40, 350, -70]}
        yPath={[240, 280, 250, 320, 280, 250, 340, 240]}
      />
      <ScrollCell
        cellIdx={5} width={120} opacity={1.0} glowRadius={40} glowOpacity={0.3}
        scrollProgress={scrollYProgress}
        xPath={[30, 60, 550, 900, 100, 600, 650, 30]}
        yPath={[400, 380, 300, 280, 350, 300, 280, 400]}
      />
    </div>
  )
}
