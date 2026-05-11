import { motion } from 'framer-motion'
import { ChartLineUp, ListDashes, Triangle, FileText } from '@phosphor-icons/react'
import Container from '../../../ui/Container'
import SectionHeading from '../../../ui/SectionHeading'
import { audiences } from '../../../../content'

const PERI = '#7EB8FF'

const ICONS = [ChartLineUp, ListDashes, Triangle, FileText]

function MinimalistColumn({ item, index, Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="flex flex-col items-center text-center"
      style={{ padding: 'clamp(24px, 3vw, 36px) clamp(16px, 2vw, 24px)' }}
    >
      <Icon size={40} color={PERI} weight="thin" />

      <h3
        className="font-heading font-semibold text-text-heading"
        style={{
          fontSize: 18,
          lineHeight: '26px',
          marginTop: 20,
        }}
      >
        {item.title}
      </h3>

      <p
        className="font-heading text-text-body"
        style={{
          fontSize: 16,
          lineHeight: '24px',
          opacity: 0.85,
          marginTop: 12,
        }}
      >
        {item.description}
      </p>
    </motion.div>
  )
}

export default function Minimalist() {
  return (
    <Container>
      <div className="relative">
        {/* Feathered glass backdrop — blurs the blobs behind without a hard edge. */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: '-40px -4%',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            background: 'rgba(11, 16, 28, 0.10)',
            maskImage:
              'radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 100%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div className="relative" style={{ zIndex: 1 }}>
          <SectionHeading className="text-center !mb-12">
            {audiences.header}
          </SectionHeading>

          <div className="max-w-[min(1100px,92vw)] mx-auto grid grid-cols-1 md:grid-cols-4">
            {audiences.items.map((item, i) => (
              <div
                key={item.title}
                className={
                  i > 0
                    ? 'border-t md:border-t-0 md:border-l border-[rgba(124,158,217,0.18)]'
                    : ''
                }
              >
                <MinimalistColumn item={item} index={i} Icon={ICONS[i]} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
