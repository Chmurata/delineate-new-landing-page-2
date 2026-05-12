import { motion } from 'framer-motion'
import { CheckCircle, Quotes } from '@phosphor-icons/react'
import Container from '../../../ui/Container'
import { glassCardStyle } from '../../../../lib/glass'
import { databases } from '../../../../content'
import ProvenanceConstellation from './ProvenanceConstellation'

// Render a string with **bold** markdown segments as JSX
function renderBold(text) {
  return text.split(/(\*\*[^*]+\*\*)/).map((seg, i) => {
    if (seg.startsWith('**') && seg.endsWith('**')) {
      return (
        <strong key={i} className="text-text-heading" style={{ fontWeight: 600 }}>
          {seg.slice(2, -2)}
        </strong>
      )
    }
    return <span key={i}>{seg}</span>
  })
}

const ACCENT = '#7C9ED9'
const PERI = '#7EB8FF'

const NONMEM_ROWS = [
  ['1001', '168', '7.21', '2'],
  ['1001', '336', '6.84', '2'],
  ['1002', '168', '7.83', '2'],
  ['1002', '336', '7.45', '2'],
  ['1003', '168', '8.12', '2'],
  ['1003', '336', '7.93', '2'],
]

const QC_CHECKS = [
  'Source match',
  'Dual extract',
  'Outlier scan',
  'Consistency',
  'Schema spec',
  'Audit trail',
]

function RailLabel({ children, align = 'left' }) {
  return (
    <div
      className="flex flex-col gap-1"
      style={{ alignItems: align === 'right' ? 'flex-end' : 'flex-start' }}
    >
      <span
        className="font-body"
        style={{
          fontSize: 11,
          color: PERI,
          letterSpacing: '0.04em',
          fontWeight: 600,
          opacity: 0.85,
        }}
      >
        {children}
      </span>
      <div style={{ height: 1, width: 28, background: `${PERI}66` }} />
    </div>
  )
}

function NonmemPreview() {
  const headers = ['ID', 'TIME', 'DV', 'DVID']
  return (
    <div
      className="rounded-lg"
      style={{
        ...glassCardStyle(ACCENT),
        padding: '12px 12px 10px',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
        <span
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 9,
            color: PERI,
            opacity: 0.85,
            letterSpacing: '0.06em',
            fontWeight: 600,
          }}
        >
          NONMEM.CSV
        </span>
        <span
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 8,
            color: PERI,
            opacity: 0.45,
          }}
        >
          n=23,142
        </span>
      </div>
      <div style={{ height: 1, background: `${PERI}22`, marginBottom: 6 }} />
      <div
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 9,
          lineHeight: '14px',
        }}
      >
        <div className="grid" style={{ gridTemplateColumns: '1.1fr 1fr 1fr 0.6fr', columnGap: 6, color: PERI, opacity: 0.7, fontWeight: 600 }}>
          {headers.map((h) => <span key={h}>{h}</span>)}
        </div>
        <div style={{ height: 1, background: `${PERI}14`, margin: '4px 0' }} />
        {NONMEM_ROWS.map((row, i) => (
          <div
            key={i}
            className="grid"
            style={{
              gridTemplateColumns: '1.1fr 1fr 1fr 0.6fr',
              columnGap: 6,
              color: 'rgba(220,230,245,0.78)',
              opacity: 1 - i * 0.06,
            }}
          >
            {row.map((cell, j) => <span key={j}>{cell}</span>)}
          </div>
        ))}
        <div style={{ color: `${PERI}`, opacity: 0.35, marginTop: 2 }}>…</div>
      </div>
    </div>
  )
}

function QcReportPreview() {
  return (
    <div
      className="rounded-lg"
      style={{
        ...glassCardStyle(ACCENT),
        padding: '12px 12px 10px',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
        <span
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 9,
            color: PERI,
            opacity: 0.85,
            letterSpacing: '0.06em',
            fontWeight: 600,
          }}
        >
          QC_REPORT
        </span>
        <span
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 8,
            color: PERI,
            opacity: 0.45,
          }}
        >
          47/47
        </span>
      </div>
      <div style={{ height: 1, background: `${PERI}22`, marginBottom: 6 }} />
      <div
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 9.5,
          lineHeight: '16px',
        }}
      >
        {QC_CHECKS.map((label, i) => (
          <div
            key={label}
            className="flex items-center justify-between"
            style={{ color: 'rgba(220,230,245,0.82)' }}
          >
            <span>{label}</span>
            <CheckCircle size={11} color={PERI} weight="thin" style={{ opacity: 0.85 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function PullQuote({ children }) {
  return (
    <div className="mt-12 grid grid-cols-12 gap-5">
      {/* Sits in the same center 8-of-12 columns as the terminal card, so its width visually aligns */}
      <div className="col-span-12 lg:col-span-8 lg:col-start-3 relative text-center">
        <Quotes
          size={52}
          color={PERI}
          weight="fill"
          style={{
            position: 'absolute',
            top: -22,
            left: -4,
            opacity: 0.18,
            pointerEvents: 'none',
          }}
        />
        <p
          className="font-heading italic text-text-heading"
          style={{
            fontSize: 'clamp(11px, 1.3vw, 14.5px)',
            lineHeight: 1.55,
            fontWeight: 400,
            opacity: 0.92,
            whiteSpace: 'pre-line',
          }}
        >
          {children}
        </p>
        <div
          className="mx-auto mt-5"
          style={{ width: 42, height: 2, background: PERI, opacity: 0.7 }}
        />
      </div>
    </div>
  )
}

export default function Terminal() {
  return (
    <Container>
      <div className="max-w-[min(1240px,94vw)] mx-auto">
        {/* Section title — pulled outside the card per Jawad's feedback */}
        <div className="text-center mb-10">
          <h2
            className="font-heading font-bold text-text-heading mx-auto"
            style={{
              fontSize: 'clamp(1.5rem, 3.2vw, 2.125rem)',
              lineHeight: 1.2,
              maxWidth: 820,
              whiteSpace: 'pre-line',
            }}
          >
            {databases.title}
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-5 relative items-stretch">
          <aside className="hidden lg:flex col-span-2 flex-col gap-3 justify-center">
            <RailLabel>Delivered file</RailLabel>
            <NonmemPreview />
          </aside>

          <div className="col-span-12 lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl relative overflow-hidden"
              style={{
                ...glassCardStyle(ACCENT),
                padding: 'clamp(20px, 2.4vw, 34px)',
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
                  backgroundSize: '22px 22px',
                  pointerEvents: 'none',
                  opacity: 0.5,
                }}
              />

              <div className="relative" style={{ zIndex: 1 }}>
                {databases.body.split('\n\n').map((para, i, arr) => (
                  <p
                    key={i}
                    className="font-heading text-text-body"
                    style={{
                      fontSize: 'clamp(13px, 1.5vw, 15px)',
                      lineHeight: '26px',
                      maxWidth: 760,
                      marginBottom: i === arr.length - 1 ? 0 : 18,
                    }}
                  >
                    {renderBold(para)}
                  </p>
                ))}

                <ProvenanceConstellation />
              </div>
            </motion.div>
          </div>

          <aside className="hidden lg:flex col-span-2 flex-col gap-3 justify-center">
            <RailLabel align="right">QC report</RailLabel>
            <QcReportPreview />
          </aside>
        </div>

        <PullQuote>{databases.pullquote}</PullQuote>
      </div>
    </Container>
  )
}
