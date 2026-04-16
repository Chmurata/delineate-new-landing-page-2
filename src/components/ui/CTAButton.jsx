import { useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/20/solid'

const ACCENT = '#7C9ED9'
const spring = { type: 'spring', stiffness: 500, damping: 20 }

const BASE = {
  primary: {
    background: ACCENT, color: '#041812',
    border: `1px solid ${ACCENT}90`,
    boxShadow: `0 0 12px -4px ${ACCENT}30, 0 4px 8px -4px rgba(0,0,0,0.25)`,
  },
  secondary: {
    background: `${ACCENT}08`, color: ACCENT,
    border: `1px solid ${ACCENT}22`,
    boxShadow: 'none',
  },
  ghost: {
    background: 'transparent', color: `${ACCENT}CC`,
    border: `1px solid ${ACCENT}30`, boxShadow: 'none',
  },
}

const HOVER = {
  primary: {
    boxShadow: `0 0 12px -4px ${ACCENT}50, 0 4px 12px -4px rgba(0,0,0,0.3)`,
    border: `1px solid ${ACCENT}`,
  },
  secondary: {
    background: `${ACCENT}10`, border: `1px solid ${ACCENT}35`,
    boxShadow: `0 0 10px -4px ${ACCENT}18`,
  },
  ghost: {
    background: `${ACCENT}08`, border: `1px solid ${ACCENT}45`, color: ACCENT,
  },
}

const PRESS = {
  primary: {
    boxShadow: `0 0 16px -4px ${ACCENT}70, 0 2px 8px -4px rgba(0,0,0,0.4)`,
  },
  secondary: {
    boxShadow: 'none', background: `${ACCENT}06`,
  },
  ghost: {
    background: `${ACCENT}12`,
  },
}

export default function CTAButton({ children, variant = 'primary', onClick, className = '', fullWidth = false }) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)
  const arrowAnim = useAnimation()

  const showArrow = variant !== 'secondary'
  const circleBg = variant === 'primary' ? 'rgba(4, 24, 18, 0.22)' : `${ACCENT}18`

  const handleDown = () => {
    setPressed(true)
    if (showArrow) {
      arrowAnim.start({
        x: [0, 4, -1, 0],
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      })
    }
  }

  const base = BASE[variant] || BASE.primary
  const hover = HOVER[variant] || HOVER.primary
  const press = PRESS[variant] || PRESS.primary

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false) }}
      onMouseDown={handleDown}
      onMouseUp={() => setPressed(false)}
      className={`flex items-center cursor-pointer outline-none font-body font-semibold ${fullWidth ? 'w-full justify-center' : ''} ${className}`}
      style={{
        fontSize: 'clamp(12px, 1.4vw, 14px)',
        letterSpacing: '0.4px',
        padding: 'clamp(8px, 1vw, 12px) clamp(16px, 2vw, 28px)',
        minHeight: 'clamp(38px, 4vw, 44px)',
        borderRadius: 10,
        ...base,
        ...(hovered && !pressed ? hover : {}),
        ...(pressed ? { ...hover, ...press } : {}),
        transition: 'box-shadow 0.2s ease, border 0.15s ease, background 0.15s ease, color 0.15s ease',
      }}
      animate={{
        scale: pressed ? 1 : hovered ? 1.03 : 1,
        scaleX: pressed ? 1.04 : 1,
        scaleY: pressed ? 0.96 : 1,
      }}
      transition={spring}
    >
      {/* Text — shifts left on hover to make room for orb */}
      <motion.span
        animate={{ x: showArrow && hovered ? -3 : 0 }}
        transition={spring}
      >
        {children}
      </motion.span>

      {/* Arrow orb — 22px to match text line height, no height stretch */}
      {showArrow && (
        <motion.span
          className="flex items-center justify-center"
          style={{ width: 22, height: 22, marginLeft: 6, marginRight: -6, borderRadius: '50%' }}
          animate={{
            scale: hovered ? 1 : 0.85,
            backgroundColor: hovered ? circleBg : 'rgba(0,0,0,0)',
          }}
          transition={{ type: 'spring', stiffness: 500, damping: 14 }}
        >
          <motion.span className="flex" animate={arrowAnim}>
            <ArrowRightIcon style={{ width: 13, height: 13, flexShrink: 0 }} />
          </motion.span>
        </motion.span>
      )}
    </motion.button>
  )
}
