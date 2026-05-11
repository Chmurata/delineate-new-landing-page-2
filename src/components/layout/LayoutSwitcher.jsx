import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Squares2X2Icon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { glassCardStyle } from '../../lib/glass'
import { useCapabilityLayout, LAYOUTS as CAP_LAYOUTS } from '../../hooks/useCapabilityLayout'
import { useAudienceLayout, AUDIENCE_LAYOUTS } from '../../hooks/useAudienceLayout'
import { useDatabaseLayout, DATABASE_LAYOUTS } from '../../hooks/useDatabaseLayout'

const ACCENT = '#7C9ED9'

function LayoutGroup({ title, layouts, active, onSelect }) {
  return (
    <div>
      <div
        className="font-body text-accent mb-2 px-2 pt-1"
        style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', opacity: 0.55 }}
      >
        {title}
      </div>
      <div className="flex flex-col gap-1">
        {layouts.map(option => {
          const isActive = option.id === active
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className="text-left rounded-lg cursor-pointer transition-colors duration-150"
              style={{
                padding: '10px 12px',
                background: isActive ? `${ACCENT}1F` : 'transparent',
                border: isActive ? `1px solid ${ACCENT}55` : '1px solid transparent',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = `${ACCENT}0A` }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <div className="font-heading font-semibold text-text-heading text-sm leading-tight">
                {option.label}
              </div>
              <div className="font-heading text-text-body text-xs mt-0.5 opacity-70">
                {option.short}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function LayoutSwitcher() {
  const [capLayout, setCapLayout] = useCapabilityLayout()
  const [audLayout, setAudLayout] = useAudienceLayout()
  const [dbLayout, setDbLayout] = useDatabaseLayout()
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl overflow-hidden"
            style={{
              ...glassCardStyle(ACCENT),
              background: 'rgba(8, 12, 24, 0.85)',
              padding: 8,
              minWidth: 240,
            }}
          >
            <div className="flex flex-col gap-4">
              <LayoutGroup
                title="Capabilities layout"
                layouts={CAP_LAYOUTS}
                active={capLayout}
                onSelect={(id) => setCapLayout(id)}
              />
              <div style={{ height: 1, background: `${ACCENT}22`, margin: '0 8px' }} />
              <LayoutGroup
                title="Audiences layout"
                layouts={AUDIENCE_LAYOUTS}
                active={audLayout}
                onSelect={(id) => setAudLayout(id)}
              />
              <div style={{ height: 1, background: `${ACCENT}22`, margin: '0 8px' }} />
              <LayoutGroup
                title="Databases layout"
                layouts={DATABASE_LAYOUTS}
                active={dbLayout}
                onSelect={(id) => setDbLayout(id)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setExpanded(v => !v)}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="rounded-full cursor-pointer flex items-center gap-2 outline-none"
        style={{
          ...glassCardStyle(ACCENT),
          background: 'rgba(8, 12, 24, 0.85)',
          padding: '12px 18px',
          color: ACCENT,
          minHeight: 44,
        }}
        aria-label="Switch section layouts"
        aria-expanded={expanded}
      >
        <Squares2X2Icon className="w-5 h-5" />
        <span className="font-body text-text-heading" style={{ fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>
          Layouts
        </span>
        {expanded ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronUpIcon className="w-4 h-4" />}
      </motion.button>
    </div>
  )
}
