import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { glassCardStyle } from '../../lib/glass'
import CTAButton from '../ui/CTAButton'
import { hero } from '../../content'

const ACCENT = '#7C9ED9'

function NavLink({ children, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href="#"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative inline-block font-heading text-sm tracking-wide transition-colors duration-250"
      style={{ color: hovered ? '#FFFFFF' : '#9BA3A0', textDecoration: 'none', padding: '4px 0' }}
    >
      {children}
      <motion.span
        className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
        style={{ background: ACCENT, transformOrigin: 'center' }}
        initial={false}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      />
    </a>
  )
}

export default function Navbar({ scrollToSection }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const progressRef = useRef(null)

  // Lightweight scroll progress — avoids Framer Motion's useScroll which
  // creates motion values that trigger React re-renders on every frame.
  // Instead we update the DOM directly via ref, zero re-renders.
  useEffect(() => {
    let ticking = false
    const update = () => {
      const el = document.documentElement
      const progress = el.scrollTop / (el.scrollHeight - el.clientHeight || 1)
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${Math.min(progress, 1)})`
      }
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update)
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* Desktop nav */}
      <nav
        className="fixed top-3 left-3 right-3 lg:top-[clamp(12px,2vw,24px)] lg:left-[clamp(12px,2vw,24px)] lg:right-[clamp(12px,2vw,24px)] h-[71px] z-40 flex items-center justify-between rounded-[26px]"
        style={{
          ...glassCardStyle(ACCENT),
          background: 'rgba(8, 12, 24, 0.55)',
          padding: 'clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px)',
          boxShadow: `0 4px 24px -8px rgba(0,0,0,0.3), inset 0 -1px 0 ${ACCENT}08`,
        }}
      >
        {/* Progress bar bridge */}
        <div className="absolute bottom-0 left-[8%] right-[8%] h-[1px] overflow-hidden pointer-events-none" style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 1 }}>
          <div
            ref={progressRef}
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, ${ACCENT}20 0%, ${ACCENT} 100%)`,
              transform: 'scaleX(0)',
              transformOrigin: 'left',
              boxShadow: `0 0 10px ${ACCENT}80`,
              willChange: 'transform',
            }}
          />
        </div>

        {/* Logo */}
        <img src="/assets/logo.svg" alt="Delineate" className="h-[clamp(36px,5vw,52px)] w-auto" />

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-9">
          {hero.nav.map(link => (
            <NavLink key={link}>{link}</NavLink>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <CTAButton variant="ghost">{hero.cta.primary}</CTAButton>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex items-center justify-center w-11 h-11 rounded-xl cursor-pointer"
          style={{ background: `${ACCENT}0A`, border: `1px solid ${ACCENT}20`, color: ACCENT }}
          onClick={() => setMobileOpen(true)}
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(2, 11, 15, 0.7)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-50 w-[min(320px,85vw)] flex flex-col"
              style={{
                ...glassCardStyle(ACCENT),
                background: 'rgba(8, 12, 24, 0.92)',
                borderRadius: '20px 0 0 20px',
                padding: '24px',
              }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <button
                className="self-end w-11 h-11 flex items-center justify-center rounded-xl cursor-pointer mb-8"
                style={{ background: `${ACCENT}0A`, border: `1px solid ${ACCENT}20`, color: ACCENT }}
                onClick={() => setMobileOpen(false)}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              <div className="flex flex-col gap-1">
                {hero.nav.map(link => (
                  <a
                    key={link}
                    href="#"
                    className="font-heading text-lg py-3 px-4 rounded-xl transition-colors"
                    style={{ color: '#9BA3A0', textDecoration: 'none' }}
                    onClick={() => setMobileOpen(false)}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = `${ACCENT}0A` }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = '#9BA3A0'; e.currentTarget.style.background = 'transparent' }}
                  >
                    {link}
                  </a>
                ))}
              </div>

              <div className="mt-auto pt-8">
                <CTAButton variant="primary" fullWidth>{hero.cta.primary}</CTAButton>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
