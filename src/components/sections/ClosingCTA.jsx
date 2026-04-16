import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { ArrowRightIcon, CheckIcon } from '@heroicons/react/20/solid'
import Container from '../ui/Container'
import { closingCTA } from '../../content'
import { glassCardStyle } from '../../lib/glass'

const ACCENT = '#7C9ED9'
const ACCENT_BRIGHT = '#8FB3E8'

/* ─── Input/textarea with gradient border on focus ─── */
function FormField({ type = 'text', placeholder, value, onChange, multiline = false }) {
  const [focused, setFocused] = useState(false)
  const hasValue = value.length > 0
  const Tag = multiline ? 'textarea' : 'input'

  return (
    <div className="relative">
      <div
        className="absolute rounded-[9px] pointer-events-none transition-opacity duration-250"
        style={{
          inset: -1,
          background: focused
            ? `linear-gradient(135deg, ${ACCENT}, ${ACCENT}60, ${ACCENT}30)`
            : 'transparent',
          opacity: focused ? 1 : 0,
        }}
      />
      <Tag
        type={multiline ? undefined : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        rows={multiline ? 3 : undefined}
        className="relative w-full font-body text-sm text-text-heading outline-none resize-none"
        style={{
          padding: '12px 16px',
          background: focused ? 'rgba(8, 12, 24, 0.8)' : 'rgba(8, 12, 24, 0.6)',
          border: focused
            ? '1px solid transparent'
            : hasValue
              ? `1px solid ${ACCENT}30`
              : '1px solid rgba(124, 158, 217, 0.15)',
          borderRadius: 8,
          transition: 'all 0.25s',
          boxShadow: focused ? `0 0 16px -4px ${ACCENT}25` : 'none',
        }}
      />
    </div>
  )
}

/* ─── Cross-fade looping video ─── */
const CROSSFADE_AT = 5.5
const FADE_DUR = 2

function CrossFadeVideo() {
  const vidARef = useRef(null)
  const vidBRef = useRef(null)
  const [aVisible, setAVisible] = useState(true)

  useEffect(() => {
    const vidA = vidARef.current
    const vidB = vidBRef.current
    if (!vidA || !vidB) return

    let active = 'A'

    const onTimeUpdate = () => {
      const fg = active === 'A' ? vidA : vidB
      const bg = active === 'A' ? vidB : vidA

      if (fg.duration && fg.currentTime >= fg.duration - CROSSFADE_AT) {
        bg.currentTime = 0
        bg.play().catch(() => {})

        if (active === 'A') {
          setAVisible(false)
          active = 'B'
        } else {
          setAVisible(true)
          active = 'A'
        }

        fg.removeEventListener('timeupdate', onTimeUpdate)
        bg.addEventListener('timeupdate', onTimeUpdate)
      }
    }

    vidA.addEventListener('timeupdate', onTimeUpdate)
    return () => {
      vidA.removeEventListener('timeupdate', onTimeUpdate)
      vidB.removeEventListener('timeupdate', onTimeUpdate)
    }
  }, [])

  const baseStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    pointerEvents: 'none',
    zIndex: 0,
    transition: `opacity ${FADE_DUR}s ease-in-out`,
  }

  return (
    <>
      <video
        ref={vidARef}
        data-cta-video=""
        autoPlay
        muted
        playsInline
        style={{ ...baseStyle, opacity: aVisible ? 0.12 : 0 }}
      >
        <source src="/assets/cells-bg-video.mp4" type="video/mp4" />
      </video>
      <video
        ref={vidBRef}
        data-cta-video=""
        muted
        playsInline
        style={{ ...baseStyle, opacity: aVisible ? 0 : 0.12 }}
      >
        <source src="/assets/cells-bg-video.mp4" type="video/mp4" />
      </video>
      {/* Hide video on small screens for performance */}
      <style>{`
        @media (max-width: 1024px) {
          video[data-cta-video] { display: none !important; }
        }
      `}</style>
    </>
  )
}

/* ─── Liquid Fill Submit Button ─── */
const liquidStyles = `
@keyframes waveOscillate {
  0%, 100% { d: path("M0,6 C30,2 70,10 100,6 L100,100 L0,100 Z"); }
  50% { d: path("M0,6 C30,10 70,2 100,6 L100,100 L0,100 Z"); }
}
@keyframes bubbleUp {
  0% { transform: translateY(0) scale(1); opacity: 0.7; }
  100% { transform: translateY(-28px) scale(0.3); opacity: 0; }
}
`

function SubmitButton({ onSubmit, disabled }) {
  const [phase, setPhase] = useState('idle') // idle | shake | filling | done
  const [fillPct, setFillPct] = useState(100)
  const btnAnim = useAnimation()
  const fillRef = useRef(null)
  const rafRef = useRef(null)

  const handleClick = useCallback(() => {
    if (phase !== 'idle' || disabled) return

    // Validation — check if onSubmit returns false
    const valid = onSubmit?.()
    if (!valid) {
      setPhase('shake')
      btnAnim.start({
        x: [0, -8, 8, -6, 6, -3, 3, 0],
        transition: { duration: 0.4 },
      }).then(() => setPhase('idle'))
      return
    }

    // Start liquid fill
    setPhase('filling')
    setFillPct(100)

    const startTime = performance.now()
    const fillDuration = 1600

    const tick = (now) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / fillDuration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const pct = 100 - eased * 100
      setFillPct(pct)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setFillPct(0)
        setPhase('done')
        // Hold for 2s, then reset
        setTimeout(() => {
          // Drain — animate fill back down
          const drainStart = performance.now()
          const drainDuration = 500
          const drainTick = (now2) => {
            const elapsed2 = now2 - drainStart
            const p = Math.min(elapsed2 / drainDuration, 1)
            setFillPct(p * 100)
            if (p < 1) {
              rafRef.current = requestAnimationFrame(drainTick)
            } else {
              setFillPct(100)
              setPhase('idle')
            }
          }
          rafRef.current = requestAnimationFrame(drainTick)
        }, 2000)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [phase, disabled, onSubmit, btnAnim])

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  const isBusy = phase === 'filling' || phase === 'done'
  const showCheck = phase === 'done'

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: liquidStyles }} />
      <motion.button
        onClick={handleClick}
        animate={btnAnim}
        disabled={isBusy}
        className="relative w-full flex items-center justify-center gap-2 cursor-pointer outline-none font-body font-semibold overflow-hidden"
        style={{
          fontSize: 'clamp(12px, 1.4vw, 14px)',
          letterSpacing: '0.4px',
          padding: 'clamp(8px, 1vw, 12px) clamp(16px, 2vw, 28px)',
          minHeight: 'clamp(38px, 4vw, 44px)',
          borderRadius: 10,
          background: ACCENT,
          color: '#041812',
          border: `1px solid ${ACCENT}90`,
          boxShadow: `0 0 12px -4px ${ACCENT}30, 0 4px 8px -4px rgba(0,0,0,0.25)`,
          cursor: isBusy ? 'default' : 'pointer',
        }}
      >
        {/* Liquid fill layer */}
        <div
          style={{
            position: 'absolute', inset: 0, zIndex: 0,
            clipPath: `inset(${fillPct}% 0 0 0)`,
            transition: phase === 'idle' ? 'none' : undefined,
          }}
        >
          {/* Bright fill */}
          <div style={{ position: 'absolute', inset: 0, background: ACCENT_BRIGHT }} />

          {/* Wave SVG on top edge */}
          {phase === 'filling' && (
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              style={{
                position: 'absolute', top: -8, left: 0, width: '100%', height: 12,
                overflow: 'visible',
              }}
            >
              <path
                d="M0,6 C30,2 70,10 100,6 L100,100 L0,100 Z"
                fill={ACCENT_BRIGHT}
                style={{ animation: 'waveOscillate 0.8s ease-in-out infinite' }}
              />
            </svg>
          )}

          {/* Bubbles */}
          {phase === 'filling' && [0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${25 + i * 25}%`,
                bottom: 4,
                width: 4 - i * 0.5,
                height: 4 - i * 0.5,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.5)',
                animation: `bubbleUp ${0.8 + i * 0.3}s ease-out ${i * 0.4}s infinite`,
              }}
            />
          ))}
        </div>

        {/* White flash on completion */}
        {showCheck && (
          <motion.div
            style={{ position: 'absolute', inset: 0, background: 'white', zIndex: 1, borderRadius: 10 }}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Text content */}
        <motion.span
          className="relative flex items-center gap-2"
          style={{ zIndex: 2 }}
          animate={{ opacity: showCheck ? 0 : 1, scale: showCheck ? 0.8 : 1 }}
          transition={{ duration: 0.15 }}
        >
          Book a Free Discovery Call
          <ArrowRightIcon style={{ width: 14, height: 14, flexShrink: 0 }} />
        </motion.span>

        {/* Confirmation text */}
        {showCheck && (
          <motion.span
            className="absolute inset-0 flex items-center justify-center gap-2 font-semibold"
            style={{ zIndex: 2, color: '#041812' }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
          >
            <CheckIcon style={{ width: 16, height: 16 }} />
            Message Sent
          </motion.span>
        )}
      </motion.button>
    </>
  )
}

/* ─── Two-Column CTA — testimonial left, form right ─── */
export default function ClosingCTA() {
  const [form, setForm] = useState({ email: '', description: '' })

  return (
    <Container>
      <div
        className="rounded-3xl relative overflow-hidden max-w-[min(960px,90vw)] mx-auto"
        style={{
          ...glassCardStyle(ACCENT),
          padding: 'clamp(32px, 5vw, 56px) clamp(24px, 4vw, 48px)',
        }}
      >
        {/* Video background */}
        <CrossFadeVideo />

        <div className="flex flex-col lg:flex-row gap-[clamp(24px,4vw,48px)] relative">
          {/* Left: headline + testimonial */}
          <div className="flex-1 flex flex-col justify-center">
            <h2
              className="font-heading font-bold text-text-heading mb-6"
              style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', lineHeight: 1.25 }}
            >
              {closingCTA.headline}
            </h2>
            <p
              className="font-heading font-medium text-text-heading mb-5 italic opacity-85"
              style={{ fontSize: 'clamp(0.875rem, 1.8vw, 1rem)', lineHeight: '26px' }}
            >
              "We went from 6 months of manual literature review to a complete, auditable MBMA database in under 5 weeks."
            </p>
            <div>
              <div className="font-heading font-semibold text-text-heading text-[13px] mb-0.5">
                Senior Director, Pharmacometrics
              </div>
              <div className="font-heading text-text-caption text-xs">
                Top 10 Pharma
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div className="flex-1 flex flex-col gap-3 justify-center">
            <FormField
              type="email"
              placeholder="Work email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
            <FormField
              placeholder="Tell us about your project"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              multiline
            />
            <SubmitButton
              onSubmit={() => {
                if (!form.email.trim()) return false
                // Clear form after successful submit
                setTimeout(() => setForm({ email: '', description: '' }), 4200)
                return true
              }}
            />
            <p className="font-heading text-text-caption text-xs text-center mt-1">
              We'll respond within 24 hours
            </p>
          </div>
        </div>
      </div>
    </Container>
  )
}
