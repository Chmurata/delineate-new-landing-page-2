import { motion } from 'framer-motion'
import PublicationFlow from './PublicationFlow'
import SplitText from '../text/SplitText'
import CTAButton from '../ui/CTAButton'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import { hero } from '../../content'

const ACCENT = '#7C9ED9'

export default function HeroSection() {
  const isDesktop = useIsDesktop()

  return (
    <section className="relative min-h-[80svh]" style={{ zIndex: 2 }}>
      {/* Frosted glass overlay */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 'clamp(80px, 10vw, 116px)',
          left: 'clamp(12px, 2vw, 24px)',
          right: 'clamp(12px, 2vw, 24px)',
          bottom: 0,
          borderRadius: 20,
          background: 'rgba(11, 16, 28, 0.35)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          WebkitTransform: 'translateZ(0)',
          willChange: 'transform',
          zIndex: 0,
        }}
      />

      {/* Animation — absolute on desktop, confined to right side (left:54% right:7%) */}
      {isDesktop && (
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          <PublicationFlow overlay />
        </div>
      )}

      {/* Content */}
      <div
        className="relative flex flex-col xl:items-start items-center min-h-[80svh] justify-center"
        style={{
          zIndex: 10,
          padding: 'clamp(130px, 16vw, 160px) clamp(1.5rem, 8vw, 112px) clamp(2rem, 4vw, 48px)',
          pointerEvents: 'none',
        }}
      >
        <div
          className="flex flex-col gap-6 text-center xl:text-left"
          style={{
            maxWidth: 648,
            width: '100%',
            pointerEvents: 'auto',
          }}
        >
          {/* Headline — 3 separate h1s on desktop (for SplitText), single flowing h1 on mobile */}
          {isDesktop ? (
            <div>
              <h1 className="font-heading font-bold text-text-heading" style={{ fontSize: 40, lineHeight: '60px', margin: 0 }}>
                <SplitText staggerDelay={0.02} duration={0.35}>{hero.headline.line1}</SplitText>
              </h1>
              <h1 className="font-heading font-bold text-text-heading" style={{ fontSize: 40, lineHeight: '60px', margin: 0 }}>
                <SplitText delay={0.4} staggerDelay={0.02} duration={0.35}>{hero.headline.line2}</SplitText>
              </h1>
              <h1 className="font-heading font-bold" style={{ fontSize: 40, lineHeight: '60px', margin: 0, color: ACCENT }}>
                <SplitText delay={0.8} staggerDelay={0.02} duration={0.35}>{hero.headline.line3}</SplitText>
              </h1>
            </div>
          ) : (
            <h1
              className="font-heading font-bold text-text-heading"
              style={{ fontSize: 'clamp(1.5rem, 6vw, 2.25rem)', lineHeight: 1.3, margin: 0 }}
            >
              {hero.headline.line1} {hero.headline.line2}{' '}
              <span style={{ color: ACCENT }}>{hero.headline.line3}</span>
            </h1>
          )}

          {/* Subtitle */}
          <motion.p
            className="font-heading"
            style={{ fontSize: 'clamp(0.8rem, 1.5vw, 16px)', lineHeight: '22px', color: '#B4B7B2', margin: 0 }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: isDesktop ? 1.2 : 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {hero.headline.sub.replace(/\n/g, ' ')}
          </motion.p>

          {/* CTA buttons — single line, smaller on mobile */}
          <motion.div
            className="flex flex-row items-center justify-center xl:justify-start"
            style={{ gap: 'clamp(8px, 2vw, 14px)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: isDesktop ? 1.5 : 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <CTAButton variant="primary">Book a Discovery Call</CTAButton>
            <CTAButton variant="secondary">How It Works</CTAButton>
          </motion.div>
        </div>

        {/* Animation — mobile only, flows below text (single instance) */}
        {!isDesktop && (
          <div className="relative w-full mt-8" style={{ height: 'clamp(420px, 55vh, 540px)' }}>
            <PublicationFlow />
          </div>
        )}
      </div>
    </section>
  )
}
