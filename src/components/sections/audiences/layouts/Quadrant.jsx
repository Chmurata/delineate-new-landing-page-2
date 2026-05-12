import { motion } from 'framer-motion'
import Container from '../../../ui/Container'
import SectionHeading from '../../../ui/SectionHeading'
import { glassCardStyle } from '../../../../lib/glass'
import { audiences } from '../../../../content'
import { GLYPHS } from '../audienceGlyphs'

const ACCENT = '#7C9ED9'

function AudienceCard({ item, index }) {
  const Glyph = GLYPHS[index] ?? null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="rounded-2xl flex flex-col gap-4 h-full"
      style={{
        ...glassCardStyle(ACCENT),
        padding: 'clamp(20px, 2vw, 26px)',
        border: '1px solid rgba(126, 184, 255, 0.10)',
      }}
    >
      <div style={{ width: 'clamp(64px, 6vw, 80px)', height: 'clamp(64px, 6vw, 80px)' }}>
        {Glyph ? <Glyph /> : null}
      </div>

      <div className="flex flex-col gap-2">
        <h3
          className="font-heading font-semibold text-text-heading"
          style={{ fontSize: 'clamp(15px, 1.4vw, 17px)', lineHeight: 1.3 }}
        >
          {item.title}
        </h3>
        <p
          className="font-heading text-text-body"
          style={{ fontSize: 'clamp(12px, 1vw, 13px)', lineHeight: '20px', opacity: 0.85 }}
        >
          {item.description}
        </p>
      </div>
    </motion.div>
  )
}

export default function Quadrant() {
  return (
    <Container>
      <SectionHeading className="text-center !mb-10">
        {audiences.header}
      </SectionHeading>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[min(1240px,94vw)] mx-auto">
        {audiences.items.map((item, i) => (
          <AudienceCard key={item.title} item={item} index={i} />
        ))}
      </div>
    </Container>
  )
}
