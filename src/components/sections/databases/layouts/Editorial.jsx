import { motion } from 'framer-motion'
import Container from '../../../ui/Container'
import { glassCardStyle } from '../../../../lib/glass'
import { databases } from '../../../../content'

const ACCENT = '#7C9ED9'

export default function Editorial() {
  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl max-w-[min(960px,90vw)] mx-auto"
        style={{
          ...glassCardStyle(ACCENT),
          padding: 'clamp(32px, 5vw, 56px) clamp(24px, 4vw, 56px)',
        }}
      >
        <div
          className="font-body text-accent mb-4"
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            opacity: 0.6,
          }}
        >
          {databases.header}
        </div>

        <h2
          className="font-heading font-bold text-text-heading mb-6"
          style={{
            fontSize: 'clamp(1.375rem, 3vw, 1.875rem)',
            lineHeight: 1.2,
            maxWidth: 720,
          }}
        >
          {databases.title}
        </h2>

        <p
          className="font-heading text-text-body mb-8"
          style={{
            fontSize: 'clamp(13px, 1.6vw, 15px)',
            lineHeight: '26px',
            maxWidth: 720,
          }}
        >
          {databases.body}
        </p>

        <div
          className="relative"
          style={{
            paddingLeft: 'clamp(16px, 2vw, 24px)',
            paddingRight: 'clamp(16px, 2vw, 24px)',
            paddingTop: 'clamp(16px, 2vw, 20px)',
            paddingBottom: 'clamp(16px, 2vw, 20px)',
            borderTop: `1px solid ${ACCENT}25`,
            borderBottom: `1px solid ${ACCENT}25`,
          }}
        >
          <p
            className="font-heading italic text-text-heading"
            style={{
              fontSize: 'clamp(14px, 1.8vw, 17px)',
              lineHeight: '28px',
              fontWeight: 500,
              opacity: 0.92,
              maxWidth: 760,
            }}
          >
            {databases.pullquote}
          </p>
        </div>
      </motion.div>
    </Container>
  )
}
