import { motion } from 'framer-motion'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import GlassCard from '../ui/GlassCard'
import { process as processContent } from '../../content'

const ACCENT = '#7C9ED9'

export default function Process() {
  return (
    <Container>
      <SectionHeading className="text-center">{processContent.header}</SectionHeading>

      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[min(1000px,90vw)] mx-auto">
        {/* Connecting line — desktop only */}
        <div
          className="hidden lg:block absolute h-[1px] z-0"
          style={{
            top: 32, left: '8%', right: '8%',
            background: `linear-gradient(90deg, transparent, ${ACCENT}25, ${ACCENT}25, transparent)`,
          }}
        />

        {processContent.steps.map((step, i) => (
          <GlassCard
            key={i}
            as={motion.div}
            className="relative z-[1]"
            style={{ padding: 'clamp(18px, 2.5vw, 24px) clamp(16px, 2vw, 20px)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
          >
            {/* Step number */}
            <div
              className="flex items-center justify-center rounded-full font-body font-semibold mb-4"
              style={{
                width: 32, height: 32,
                background: `${ACCENT}18`, border: `1.5px solid ${ACCENT}40`,
                fontSize: 13, color: ACCENT,
              }}
            >
              {step.number}
            </div>

            <h3 className="font-heading font-semibold text-text-heading mb-2" style={{ fontSize: 'clamp(14px, 1.6vw, 15px)', lineHeight: '21px' }}>
              {step.title}
            </h3>
            <p className="font-heading text-text-body" style={{ fontSize: 'clamp(12px, 1.4vw, 13px)', lineHeight: '20px' }}>
              {step.description}
            </p>
          </GlassCard>
        ))}
      </div>
    </Container>
  )
}
