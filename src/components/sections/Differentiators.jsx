import { motion } from 'framer-motion'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import CountUp from '../text/CountUp'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import { glassCardStyle } from '../../lib/glass'

const ACCENT = '#7C9ED9'

const cards = [
  {
    number: 97, suffix: '%',
    label: 'Digitization Accuracy',
    title: 'Automated Graph & Chart Digitization',
    desc: 'Extract numerical data from marker plots, KM curves, dose-response figures — with full traceability. No other solution can do this.',
  },
  {
    number: 1, prefix: '<', suffix: 'mo',
    label: 'Database Delivery',
    title: 'Analysis-Ready, Fit-for-Purpose Databases',
    desc: 'Built for your exact regulatory question in weeks — not pulled from a pre-packaged catalog. NONMEM-formatted, auditable.',
  },
  {
    number: 100, suffix: '%',
    label: 'Source Auditability',
    title: 'Full Auditability',
    desc: 'Every data point traces to its source figure and publication. Three-layer QC: automated validation, expert review, source-level audit.',
  },
]

export default function Differentiators() {
  const isDesktop = useIsDesktop()

  return (
    <Container>
      <SectionHeading className="text-center !mb-2">
        What Sets Delineate Apart
      </SectionHeading>
      <p className="font-heading text-text-body text-center mx-auto mb-12 max-w-[520px]" style={{ fontSize: 'clamp(14px, 1.8vw, 16px)' }}>
        Speed, accuracy, and auditability — built for pharmacometrics.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[min(960px,90vw)] mx-auto">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="rounded-2xl flex flex-col gap-2"
            style={{ ...glassCardStyle(ACCENT), padding: 'clamp(24px, 3vw, 32px) clamp(20px, 2.5vw, 28px)' }}
          >
            {/* Big number */}
            {isDesktop ? (
              <motion.div
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="font-heading font-extrabold leading-none mb-1"
                style={{
                  fontSize: 'clamp(32px, 5vw, 44px)',
                  background: 'linear-gradient(90deg, #5B7FBF, #7C9ED9, #A8C4E8, #B8D4F0, #7C9ED9, #5B7FBF, #7C9ED9)',
                  backgroundSize: '300% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {card.prefix || ''}<CountUp end={card.number} duration={2} />{card.suffix}
              </motion.div>
            ) : (
              <div
                className="font-heading font-extrabold leading-none mb-1"
                style={{
                  fontSize: 'clamp(32px, 5vw, 44px)',
                  background: 'linear-gradient(90deg, #5B7FBF, #7C9ED9, #A8C4E8, #7C9ED9, #5B7FBF)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradientShift 8s linear infinite',
                }}
              >
                {card.prefix || ''}{card.number}{card.suffix}
              </div>
            )}

            {/* Label */}
            <div className="font-body text-accent opacity-50 mb-3" style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              {card.label}
            </div>

            {/* Title */}
            <h3 className="font-heading font-semibold text-text-heading mb-2" style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', lineHeight: '24px' }}>
              {card.title}
            </h3>

            {/* Description */}
            <p className="font-heading text-text-body" style={{ fontSize: 'clamp(12px, 1.5vw, 13px)', lineHeight: '21px' }}>
              {card.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </Container>
  )
}
