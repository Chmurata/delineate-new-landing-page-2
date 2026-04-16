import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Container from '../ui/Container'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import { clientBar } from '../../content'

const ACCENT = '#7C9ED9'

const LOGOS = [
  { src: '/assets/logos/yc.svg', alt: 'Y Combinator', label: 'Y Combinator' },
  { src: '/assets/logos/mit-sandbox.svg', alt: 'MIT Sandbox', label: 'MIT Sandbox' },
  { src: '/assets/logos/nih.png', alt: 'NIH', label: 'NIH Seed' },
]

export default function SocialProof() {
  const isDesktop = useIsDesktop()
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Border rotation — scroll-driven, reverses on scroll up
  const borderAngle = useTransform(scrollYProgress, [0, 1], [0, 720])
  const smoothBorder = useSpring(borderAngle, { stiffness: 40, damping: 25 })

  return (
    <Container>
      {/* ─── Trust card with scroll-driven rotating border + big number ─── */}
      <div ref={sectionRef} className="flex justify-center" style={{ padding: '8px 0 24px' }}>
        <div
          className="relative"
          style={{ borderRadius: 22, padding: 2, overflow: 'hidden', width: 'min(534px, 90vw)' }}
        >
          {/* Scroll-driven conic gradient border */}
          <motion.div
            style={{
              position: 'absolute', inset: '-80%',
              background: 'conic-gradient(from 0deg, transparent 0%, #7C9ED915 10%, #7C9ED9 22%, #5B7FBF 28%, #7C9ED915 40%, transparent 50%, transparent 100%)',
              rotate: smoothBorder,
            }}
          />

          {/* Inner card — big emphasized number (original design) */}
          <motion.div
            className="relative text-center"
            style={{
              borderRadius: 20,
              background: 'rgba(8, 12, 24, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              padding: 'clamp(20px, 3vw, 28px) clamp(28px, 5vw, 48px)',
            }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
          >
            {/* Label */}
            <div className="flex items-center justify-center gap-3 mb-2.5">
              <div style={{ width: 28, height: 1, background: `linear-gradient(90deg, transparent, ${ACCENT}70)` }} />
              <span
                className="font-heading font-semibold"
                style={{ fontSize: 13, letterSpacing: 2.5, textTransform: 'uppercase', color: ACCENT }}
              >
                Trusted by
              </span>
              <div style={{ width: 28, height: 1, background: `linear-gradient(90deg, ${ACCENT}70, transparent)` }} />
            </div>

            {/* Big number with animated gradient */}
            <motion.div
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="font-heading leading-none mb-1.5"
              style={{
                fontSize: 'clamp(40px, 8vw, 60px)',
                fontWeight: 800,
                background: 'linear-gradient(90deg, #5B7FBF, #7C9ED9, #A8C4E8, #B8D4F0, #7C9ED9, #5B7FBF, #7C9ED9)',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {clientBar.trust.number}
            </motion.div>

            {/* Subtext */}
            <div
              className="font-heading font-medium text-text-heading"
              style={{ fontSize: 'clamp(14px, 1.8vw, 16px)', lineHeight: 1.4 }}
            >
              {clientBar.trust.line1}
            </div>
            <div
              className="font-heading font-medium"
              style={{ fontSize: 'clamp(12px, 1.5vw, 14px)', color: '#9BA3A0', opacity: 0.7 }}
            >
              {clientBar.trust.line2}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── Logo slider — clean clip with gap before pill ─── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes logoSlide {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
      `}} />
      <div
        className="flex items-center mx-auto"
        style={{ maxWidth: 'min(960px, 100%)', height: 78 }}
      >
        {/* "Backed by" pill */}
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-2xl"
          style={{
            width: 'clamp(120px, 14vw, 160px)',
            height: 60,
            background: 'rgba(8, 12, 24, 0.55)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <span
            className="font-body whitespace-nowrap"
            style={{ fontSize: 'clamp(13px, 1.4vw, 15px)', fontWeight: 400, color: ACCENT }}
          >
            {clientBar.backedBy}
          </span>
        </div>

        {/* Gap */}
        <div style={{ width: 32, flexShrink: 0 }} />

        {/* Track container — logos fade at both edges */}
        <div
          className="flex-1 overflow-hidden"
          style={{
            height: 44,
            display: 'flex',
            alignItems: 'center',
            maskImage: 'linear-gradient(to right, transparent 0px, black 40px, black calc(100% - 40px), transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0px, black 40px, black calc(100% - 40px), transparent 100%)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'clamp(32px, 5vw, 56px)',
              whiteSpace: 'nowrap',
              animation: 'logoSlide 20s linear infinite',
              willChange: 'transform',
            }}
          >
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <div key={i} className="flex items-center flex-shrink-0" style={{ gap: 10 }}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  style={{ height: 20, width: 'auto', opacity: 0.7, filter: 'brightness(1.3) grayscale(0.3)' }}
                />
                <span
                  className="font-body"
                  style={{ fontSize: 13, fontWeight: 600, letterSpacing: 0.5, color: '#9BA3A0', opacity: 0.7 }}
                >
                  {logo.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
