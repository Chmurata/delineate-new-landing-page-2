import { motion } from 'framer-motion'
import {
  CheckCircle,
  MagnifyingGlass,
  LinkSimple,
  Flag,
  ShieldCheck,
} from '@phosphor-icons/react'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import { caseStudies } from '../../content'
import { glassCardStyle } from '../../lib/glass'

const ACCENT = '#7C9ED9'
const PERI = '#7EB8FF'

const GUARANTEE_ICONS = [CheckCircle, MagnifyingGlass, LinkSimple, Flag, ShieldCheck]

function GuaranteeCell({ text, Icon, index, isLast }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: 0.05 * index, duration: 0.4 }}
      className={`flex items-center gap-3 flex-1 min-w-0 ${
        isLast ? '' : 'border-b lg:border-b-0 lg:border-r'
      }`}
      style={{
        padding: '14px 18px',
        borderColor: 'rgba(126, 184, 255, 0.10)',
      }}
    >
      <Icon size={18} color={PERI} weight="thin" style={{ flexShrink: 0 }} />
      <p
        className="font-heading text-text-heading"
        style={{ fontSize: 12.5, lineHeight: '17px', fontWeight: 500, textWrap: 'balance' }}
      >
        {text}
      </p>
    </motion.div>
  )
}

export default function HowWeDoIt() {
  return (
    <Container>
      <SectionHeading className="text-center !mb-6">How we do it</SectionHeading>

      <p
        className="font-heading text-text-body mx-auto text-center"
        style={{
          fontSize: 'clamp(14px, 1.4vw, 16px)',
          lineHeight: 1.55,
          maxWidth: 720,
          marginBottom: 28,
          opacity: 0.9,
        }}
      >
        {caseStudies.intro}
      </p>

      <div className="mx-auto" style={{ maxWidth: 'min(1320px, 94vw)' }}>
        <div
          className="rounded-xl flex flex-col lg:flex-row"
          style={{
            ...glassCardStyle(ACCENT),
            border: '1px solid rgba(126, 184, 255, 0.12)',
            overflow: 'hidden',
          }}
        >
          {caseStudies.guarantees.map((text, i) => (
            <GuaranteeCell
              key={i}
              text={text}
              Icon={GUARANTEE_ICONS[i]}
              index={i}
              isLast={i === caseStudies.guarantees.length - 1}
            />
          ))}
        </div>
      </div>
    </Container>
  )
}
