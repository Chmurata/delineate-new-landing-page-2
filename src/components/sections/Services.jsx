import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '../ui/Container'
import SectionHeading from '../ui/SectionHeading'
import { serviceOfferings } from '../../content'
import { glassCardStyle } from '../../lib/glass'

const ACCENT = '#7C9ED9'

function DataStreamBackground() {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.08 }}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="stream-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor={ACCENT} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      {[10, 30, 50, 70, 90].map((x, i) => (
        <motion.line
          key={i}
          x1={`${x}%`} y1="-50%" x2={`${x}%`} y2="150%"
          stroke="url(#stream-fade)" strokeWidth="1.5" strokeDasharray="100 200"
          animate={{ strokeDashoffset: [0, -300] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'linear' }}
        />
      ))}
      {[20, 40, 60, 80].map((x, i) => (
        <motion.rect
          key={`node-${i}`}
          x={`${x}%`} y="100%" width="3" height="3" rx="1.5" fill={ACCENT}
          animate={{ y: ['100%', '-10%'], opacity: [0, 1, 0] }}
          transition={{ duration: 6 + (i * 1.5), repeat: Infinity, ease: 'linear', delay: i }}
        />
      ))}
    </motion.svg>
  )
}

export default function Services() {
  const [openIdx, setOpenIdx] = useState(0)

  return (
    <Container>
      <SectionHeading className="text-center">{serviceOfferings.header}</SectionHeading>

      <div className="max-w-[min(860px,90vw)] mx-auto flex flex-col gap-4">
        {serviceOfferings.items.map((item, i) => {
          const isOpen = openIdx === i
          return (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                opacity: { duration: 0.3 }
              }}
              className="relative rounded-2xl overflow-hidden cursor-pointer"
              style={{
                ...glassCardStyle(ACCENT),
                background: isOpen ? 'rgba(8, 12, 24, 0.7)' : 'rgba(8, 12, 24, 0.55)',
                border: isOpen ? `1px solid ${ACCENT}40` : '1px solid rgba(100, 160, 230, 0.05)',
                boxShadow: isOpen ? `0 10px 40px -10px ${ACCENT}20` : undefined,
                transition: 'none', // Critical: Disable CSS transition during layout animation to prevent stutter
              }}
              onClick={() => setOpenIdx(isOpen ? -1 : i)}
            >
              <AnimatePresence mode="wait">
                {isOpen && <DataStreamBackground />}
              </AnimatePresence>

              <div className="relative z-[1] flex flex-col" style={{ padding: 'clamp(18px, 3vw, 24px) clamp(24px, 4vw, 32px)' }}>
                <div className="flex justify-between items-center">
                  <h3
                    className="font-heading transition-all duration-300"
                    style={{
                      fontSize: 'clamp(16px, 2vw, 20px)',
                      fontWeight: isOpen ? 600 : 500,
                      color: isOpen ? '#FFFFFF' : '#9BA3A0',
                    }}
                  >
                    {item.title}
                  </h3>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isOpen ? ACCENT : '#4F5D59'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </motion.div>
                </div>

                <div 
                  className="overflow-hidden"
                  style={{ 
                    maxHeight: isOpen ? '500px' : '0px',
                    opacity: isOpen ? 1 : 0,
                    marginTop: isOpen ? 16 : 0,
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <p className="font-heading text-text-body max-w-[700px]" style={{ fontSize: 'clamp(13px, 1.5vw, 15px)', lineHeight: '26px' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </Container>
  )
}
