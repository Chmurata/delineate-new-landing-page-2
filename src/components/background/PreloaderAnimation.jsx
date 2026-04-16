import { useEffect, useRef, useMemo } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

const ACCENT = '#7C9ED9'
const BASE = '#020B0F'
const CX = 25.4714
const CY = 25.4714

const DOT_CENTERS = {
  small: '26.54px 16.78px',
  large: '32.4px 24.58px',
  medium: '18.93px 24.1px',
}

/* ─── Logo SVG ─── */
function LogoSVG({ circleCtrl, glowCtrl, dot1Ctrl, dot2Ctrl, dot3Ctrl, className = '' }) {
  return (
    <svg viewBox="-4 -4 59 59" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'relative', zIndex: 1 }}>
      <defs>
        <filter id="pl_glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
        <mask id="pl_mask" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="9" y="8" width="33" height="34">
          <path d="M41.9429 25.471C41.9429 28.3815 41.1881 31.1147 39.8631 33.4877C39.6803 33.8153 39.4848 34.1375 39.2803 34.4506C38.2631 36.0145 36.987 37.3937 35.5136 38.5287C35.1262 38.8273 34.7262 39.1079 34.3135 39.3703C31.7577 40.9994 28.7259 41.9424 25.4714 41.9424C16.3741 41.9424 9 34.5683 9 25.471C9 16.3737 16.3741 8.99951 25.4714 8.99951C34.5688 8.99951 41.9429 16.3737 41.9429 25.471Z" fill={ACCENT} />
        </mask>
      </defs>
      <motion.circle cx={CX} cy={CY} r={18} fill={ACCENT} filter="url(#pl_glow)" initial={{ opacity: 0, scale: 0.9 }} animate={glowCtrl} style={{ transformOrigin: `${CX}px ${CY}px` }} />
      <motion.rect x={9} y={9} width={32.9429} height={32.9429} rx={16.4714} fill={ACCENT} shapeRendering="crispEdges" initial={{ scale: 0, opacity: 0 }} animate={circleCtrl} style={{ transformOrigin: `${CX}px ${CY}px` }} />
      <g mask="url(#pl_mask)">
        <motion.path d="M22.7384 32.6336C21.8203 31.4667 21.7344 31.3674 21.5295 31.1037C21.0011 30.4238 20.3351 29.8663 19.61 29.402C19.5891 29.3887 19.5684 29.3753 19.5477 29.362C18.1408 28.4538 16.3539 29.2801 17.8047 30.1164C19.2041 30.9236 21.8226 32.7691 23.2758 33.5618C23.3176 33.5846 23.3779 33.5978 23.3918 33.6432C23.4033 33.6806 23.4144 33.6412 23.3926 33.6087L22.7384 32.6336Z" fill="#1F2F50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }} />
        <motion.path d="M41.1566 36.7752C39.9129 38.1833 38.4386 39.3692 36.804 40.2826C36.3742 40.523 35.9344 40.7435 35.4847 40.9441C34.8137 40.6125 34.0706 40.3937 33.2281 40.2744C30.0147 39.8206 26.2163 38.8624 23.0282 38.2262C22.7474 38.1698 22.4246 38.098 22.2209 37.9186C19.3892 35.448 17.2041 33.1664 14.3892 30.6816C15.7681 29.9388 17.9317 31.4045 19.188 32.1722C20.9328 33.1493 21.2818 33.4285 23.2327 34.498C25.5544 34.7534 27.8844 34.953 30.2109 35.176C30.8772 35.2415 31.4379 35.0628 31.5601 34.3493C31.7626 33.1859 30.0402 32.8417 28.9517 32.3838C28.1812 32.0598 27.5728 31.8524 26.6645 31.5127C24.9974 30.8893 23.4802 30.0623 24.023 29.2386L25.2832 29.4181C29.0052 29.9695 31.9199 30.304 35.635 30.8893C36.0364 30.9524 36.4966 31.203 36.7584 31.5127C38.239 33.2561 39.5694 35.1303 41.1566 36.7752Z" fill="#1F2F50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.15 }} />
        <motion.path d="M16.2406 16.4915C16.2361 18.3944 17.7102 20.0034 19.6067 20.1655C20.1485 20.2111 20.6682 20.1404 21.1436 19.9719C21.574 19.8206 22.0504 19.9514 22.3412 20.2981L23.1534 21.2717C23.4343 21.6106 23.4782 22.0821 23.2799 22.4752C23.0997 22.8344 22.9953 23.2399 22.9911 23.6704C22.9755 25.0953 24.0912 26.3058 25.5111 26.4045C27.056 26.5116 28.3669 25.3167 28.4177 23.7836C28.4264 23.5236 28.3996 23.2682 28.3366 23.0289C28.2175 22.5673 28.3493 22.0794 28.6958 21.7523L29.6702 20.8404C29.9828 20.5471 30.4198 20.4287 30.84 20.5084C30.983 20.5346 31.1312 20.5488 31.2815 20.5448C32.2793 20.5146 33.1151 19.7312 33.2098 18.7372C33.3225 17.5382 32.3644 16.5163 31.1601 16.5512C30.1579 16.582 29.3207 17.3722 29.2336 18.372C29.2198 18.5247 29.2238 18.675 29.2449 18.8185C29.3038 19.2498 29.16 19.6807 28.841 19.9772L27.9209 20.8391C27.5578 21.1774 27.0421 21.2791 26.5711 21.1206C26.3239 21.0384 26.0631 20.9894 25.7918 20.9802C25.5905 20.9729 25.3946 20.9898 25.2054 21.0237C24.8252 21.0941 24.4367 20.9472 24.1882 20.649L23.2584 19.5333C22.965 19.1848 22.9113 18.6898 23.1336 18.2913C23.4293 17.766 23.5978 17.163 23.6051 16.5159C23.6194 14.5328 22.0334 12.8778 20.0501 12.8083C17.9739 12.7352 16.2423 14.3953 16.2381 16.4896L16.2406 16.4915Z" fill="white" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} style={{ transformOrigin: '24px 19px' }} />
        <motion.path d="M25.5247 15.9982C25.9536 15.4394 26.7558 15.3321 27.316 15.7621C27.8762 16.192 27.9813 16.9929 27.5511 17.5534C27.121 18.1139 26.3201 18.2195 25.7599 17.7895C25.1997 17.3596 25.0946 16.5587 25.5247 15.9982Z" fill="white" initial={{ scale: 0, opacity: 0 }} animate={dot1Ctrl} style={{ transformOrigin: DOT_CENTERS.small }} />
        <motion.path d="M30.3306 22.9968C31.2062 21.856 32.8439 21.637 33.9876 22.5148C35.1314 23.3926 35.346 25.0278 34.4678 26.1721C33.5895 27.3164 31.9545 27.5319 30.8108 26.6541C29.667 25.7763 29.4524 24.1411 30.3306 22.9968Z" fill="white" initial={{ scale: 0, opacity: 0 }} animate={dot2Ctrl} style={{ transformOrigin: DOT_CENTERS.large }} />
        <motion.path d="M17.46 22.4953C18.0809 21.6863 19.2423 21.5309 20.0534 22.1534C20.8645 22.776 21.0168 23.9356 20.3939 24.7471C19.7711 25.5586 18.6116 25.7115 17.8005 25.0889C16.9894 24.4664 16.8371 23.3068 17.46 22.4953Z" fill="white" initial={{ scale: 0, opacity: 0 }} animate={dot3Ctrl} style={{ transformOrigin: DOT_CENTERS.medium }} />
      </g>
    </svg>
  )
}

/* ─── Particles ─── */
function Particles() {
  const particles = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2
      const distance = 70 + Math.random() * 50
      return {
        key: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: 2 + Math.random() * 3,
        delay: 0.25 + i * 0.02,
      }
    })
  }, [])

  return particles.map(p => (
    <motion.div
      key={p.key}
      className="absolute rounded-full"
      style={{
        width: p.size, height: p.size, background: ACCENT,
        left: '50%', top: '50%', marginLeft: -p.size / 2, marginTop: -p.size / 2,
        boxShadow: `0 0 6px ${ACCENT}80`, zIndex: 0,
      }}
      initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
      animate={{ x: p.x, y: p.y, opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
      transition={{ duration: 0.6, delay: p.delay, ease: [0.16, 1, 0.3, 1] }}
    />
  ))
}

/* ─── Aurora Background ─── */
function AuroraBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.7 }}>
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: '80vw', height: '60vh', borderRadius: '40%',
          background: `linear-gradient(135deg, ${ACCENT}40 0%, ${ACCENT}18 40%, transparent 70%)`,
          filter: 'blur(100px)', top: '-20%', right: '-20%',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: '60vw', height: '50vh', borderRadius: '50%',
          background: 'radial-gradient(ellipse at 30% 70%, #E8A08A30 0%, #E8A08A10 40%, transparent 70%)',
          filter: 'blur(120px)', bottom: '-25%', left: '-15%',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
      />
    </div>
  )
}

/* ─── Main Export: Particle Burst — exactly 1s ─── */
export default function PreloaderAnimation({ onComplete }) {
  const circleCtrl = useAnimationControls()
  const glowCtrl = useAnimationControls()
  const dot1Ctrl = useAnimationControls()
  const dot2Ctrl = useAnimationControls()
  const dot3Ctrl = useAnimationControls()
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    let cancelled = false
    async function run() {
      // 0ms — logo slams in with overshoot
      circleCtrl.start({
        scale: [0, 1.15, 0.97, 1],
        opacity: 1,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      })
      // 0ms — glow surges behind logo
      glowCtrl.start({
        opacity: [0, 0.6, 0.35],
        scale: [0.6, 1.2, 1],
        transition: { duration: 0.6, ease: 'easeOut' },
      })
      // 150ms — dots pop in with bounce (staggered 50ms apart)
      dot1Ctrl.start({ scale: [0, 1.3, 1], opacity: 1, transition: { duration: 0.35, delay: 0.15, ease: [0.22, 1, 0.36, 1] } })
      dot2Ctrl.start({ scale: [0, 1.25, 1], opacity: 1, transition: { duration: 0.35, delay: 0.2, ease: [0.22, 1, 0.36, 1] } })
      dot3Ctrl.start({ scale: [0, 1.28, 1], opacity: 1, transition: { duration: 0.35, delay: 0.25, ease: [0.22, 1, 0.36, 1] } })
      // Particles fire at 250ms (handled by Particles component delay)
      // Everything settles by ~800ms, hold for 200ms breathing room
      await new Promise(r => setTimeout(r, 1000))
      if (cancelled) return
      onCompleteRef.current?.()
    }
    run()
    return () => { cancelled = true }
  }, [circleCtrl, glowCtrl, dot1Ctrl, dot2Ctrl, dot3Ctrl])

  return (
    <div className="w-full h-svh flex items-center justify-center relative overflow-hidden" style={{ background: BASE }}>
      <AuroraBackground />
      <div className="relative flex items-center justify-center">
        <Particles />
        <LogoSVG
          circleCtrl={circleCtrl} glowCtrl={glowCtrl}
          dot1Ctrl={dot1Ctrl} dot2Ctrl={dot2Ctrl} dot3Ctrl={dot3Ctrl}
          className="w-[clamp(120px,25vw,200px)] h-[clamp(120px,25vw,200px)]"
        />
      </div>
    </div>
  )
}
