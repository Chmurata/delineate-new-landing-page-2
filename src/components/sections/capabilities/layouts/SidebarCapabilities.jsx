import { useState, useRef, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'
import Container from '../../../ui/Container'
import { capabilities } from '../../../../content'
import { glassCardStyle } from '../../../../lib/glass'
import { Ill01, Ill02, Ill03, Ill04, Ill05, Ill06 } from '../illustrations'

const ILLUSTRATIONS = [Ill01, Ill02, Ill03, Ill04, Ill05, Ill06]
const ACCENT = '#7C9ED9'
const PERI = '#7EB8FF'

export default function SidebarCapabilities() {
  const items = capabilities.items
  const [activeIdx, setActiveIdx] = useState(0)
  const [indicator, setIndicator] = useState({ top: 0, height: 0 })
  const navRef = useRef(null)
  const itemRefs = useRef([])

  useLayoutEffect(() => {
    const measure = () => {
      const nav = navRef.current
      const el = itemRefs.current[activeIdx]
      if (!nav || !el) return
      const navRect = nav.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      setIndicator({
        top: elRect.top - navRect.top,
        height: elRect.height,
      })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [activeIdx])

  return (
    <Container>
      <div className="max-w-[min(1240px,94vw)] mx-auto">
        {/* Section header */}
        <div className="text-center" style={{ paddingBottom: 12 }}>
          <h2
            className="font-heading font-bold text-text-heading"
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              lineHeight: 1.2,
              marginBottom: 8,
            }}
          >
            {capabilities.header}
          </h2>
          <p
            className="font-heading text-text-body mx-auto"
            style={{ fontSize: 'clamp(14px, 1.6vw, 16px)', maxWidth: 920, textWrap: 'balance' }}
          >
            {capabilities.subheader}
          </p>
        </div>

        <div
          className="grid grid-cols-12 gap-6 mt-8 rounded-3xl overflow-hidden"
          style={{
            ...glassCardStyle(ACCENT),
            border: '1px solid rgba(126, 184, 255, 0.10)',
            padding: 'clamp(20px, 2vw, 28px)',
          }}
        >
          {/* Sidebar nav */}
          <aside
            ref={navRef}
            className="col-span-12 lg:col-span-4 xl:col-span-3 relative flex flex-col"
            style={{ gap: 4 }}
          >
            {/* Sliding vertical hairline indicator on the left edge of the nav */}
            <div
              aria-hidden="true"
              className="absolute pointer-events-none"
              style={{
                left: 0,
                top: indicator.top,
                height: indicator.height,
                width: 2,
                background: PERI,
                transition:
                  'top 360ms cubic-bezier(0.16, 1, 0.3, 1), height 360ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            />

            {items.map((item, i) => {
              const isActive = i === activeIdx
              return (
                <button
                  key={item.number}
                  ref={(el) => (itemRefs.current[i] = el)}
                  onClick={() => setActiveIdx(i)}
                  className="text-left cursor-pointer outline-none transition-colors flex items-center"
                  style={{
                    flex: 1,
                    minHeight: 64,
                    padding: '14px 18px',
                    paddingLeft: 22,
                    background: isActive ? 'rgba(126, 184, 255, 0.08)' : 'transparent',
                    border: 'none',
                    borderRadius: 10,
                    color: isActive ? PERI : 'rgba(220, 230, 245, 0.65)',
                    fontFamily: 'inherit',
                    fontSize: 15.5,
                    fontWeight: isActive ? 600 : 500,
                    letterSpacing: '-0.005em',
                    transition: 'background 220ms ease, color 220ms ease, font-weight 220ms ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'rgba(220, 230, 245, 0.9)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'rgba(220, 230, 245, 0.65)'
                  }}
                >
                  {item.shortLabel}
                </button>
              )
            })}
          </aside>

          {/* Detail panel — all 6 stacked in one grid cell, crossfade */}
          <div className="col-span-12 lg:col-span-8 xl:col-span-9">
            <div style={{ display: 'grid' }}>
              {items.map((item, i) => {
                const Illustration = ILLUSTRATIONS[i] ?? null
                const isActive = i === activeIdx
                return (
                  <motion.div
                    key={item.number}
                    initial={false}
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                      gridColumn: 1,
                      gridRow: 1,
                      pointerEvents: isActive ? 'auto' : 'none',
                    }}
                    aria-hidden={!isActive}
                    className="flex flex-col gap-5"
                  >
                    {/* Illustration */}
                    <div
                      className="relative overflow-hidden w-full"
                      style={{
                        aspectRatio: '3 / 2',
                        borderRadius: 16,
                        border: '1px solid rgba(126, 184, 255, 0.07)',
                        maxHeight: 340,
                      }}
                    >
                      {Illustration ? (
                        <Illustration
                          active={isActive}
                          id={`sidebar-ill${item.number}`}
                          className="absolute inset-0 w-full h-full"
                        />
                      ) : null}
                    </div>

                    {/* Full title + description */}
                    <div className="flex flex-col gap-3" style={{ paddingTop: 4 }}>
                      <h3
                        className="font-heading font-semibold text-text-heading"
                        style={{
                          fontSize: 'clamp(18px, 1.8vw, 22px)',
                          lineHeight: 1.3,
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        className="font-heading text-text-body"
                        style={{
                          fontSize: 'clamp(13px, 1.2vw, 14.5px)',
                          lineHeight: '22px',
                          opacity: 0.88,
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
