import { motion } from 'framer-motion'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import { glassCardStyle } from '../../lib/glass'
import { audiences } from '../../content'

const ACCENT = '#7C9ED9'

function AudienceCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="rounded-2xl flex flex-col gap-2"
      style={{ ...glassCardStyle(ACCENT), padding: 'clamp(20px, 2.5vw, 28px) clamp(20px, 2.5vw, 28px)' }}
    >
      <h3
        className="font-heading font-semibold text-text-heading"
        style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', lineHeight: '24px' }}
      >
        {item.title}
      </h3>

      <p
        className="font-heading text-text-body"
        style={{ fontSize: 'clamp(12px, 1.5vw, 13px)', lineHeight: '21px' }}
      >
        {item.description}
      </p>
    </motion.div>
  )
}

export default function Audiences() {
  return (
    <Container>
      <SectionHeading className="text-center !mb-10">
        {audiences.header}
      </SectionHeading>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[min(800px,90vw)] mx-auto">
        {audiences.items.map((item, i) => (
          <AudienceCard key={item.title} item={item} index={i} />
        ))}
      </div>
    </Container>
  )
}
