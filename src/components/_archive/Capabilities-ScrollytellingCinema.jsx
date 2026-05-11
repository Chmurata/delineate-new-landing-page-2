/* ───────────────────────────────────────────────────────────
 * ScrollytellingCinema — Capabilities layout
 *
 * Sticky split: each capability claims ~80vh. The right column holds an
 * SVG illustration that pins while the left-column copy scrolls past.
 * Five mini-films stitched into one continuous scroll narrative.
 *
 * Desktop: GSAP ScrollTrigger pins the right column, scrubs progress to
 *   drive title/copy fades and toggles `active` on the illustration.
 * Mobile (<768px): single column, IntersectionObserver flips active.
 * Reduced motion: no pinning, no scrub — all illustrations show active.
 * ─────────────────────────────────────────────────────────── */

import { useMemo } from 'react'
import Container from '../../../ui/Container'
import SectionHeading from '../../../ui/SectionHeading'
import { glassCardStyle } from '../../../../lib/glass'
import { capabilities } from '../../../../content'
import { Ill01, Ill02, Ill03, Ill04, Ill05 } from '../illustrations'
import { useIsDesktop } from '../../../../hooks/useMediaQuery'

const ACCENT = '#7C9ED9'
const ILLUSTRATIONS = [Ill01, Ill02, Ill03, Ill04, Ill05]

const NUMERAL_GRADIENT_DESKTOP =
  'linear-gradient(90deg, #5B7FBF, #7C9ED9, #A8C4E8, #B8D4F0, #7C9ED9, #5B7FBF, #7C9ED9)'
const NUMERAL_GRADIENT_MOBILE =
  'linear-gradient(90deg, #5B7FBF, #7C9ED9, #A8C4E8, #7C9ED9, #5B7FBF)'

function CinemaStage({ item, index, isDesktop }) {
  const Illustration = ILLUSTRATIONS[index] ?? ILLUSTRATIONS[0]

  const numeralStyle = useMemo(
    () => ({
      fontSize: 'clamp(56px, 8vw, 96px)',
      background: isDesktop ? NUMERAL_GRADIENT_DESKTOP : NUMERAL_GRADIENT_MOBILE,
      backgroundSize: isDesktop ? '300% 100%' : '200% 100%',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    }),
    [isDesktop],
  )

  return (
    <div
      className="cinema-stage relative grid md:grid-cols-2 gap-10 md:gap-16 items-start py-8 md:py-16"
      data-capability={item.number}
    >
      {/* LEFT — copy scrolls normally */}
      <div className="left-col flex flex-col justify-center">
        {isDesktop ? (
          <div
            className="font-heading font-extrabold leading-none mb-4 numeral"
            style={{ ...numeralStyle, animation: 'gradientShift 14s linear infinite' }}
          >
            {item.number}
          </div>
        ) : (
          <div
            className="font-heading font-extrabold leading-none mb-4 numeral"
            style={{ ...numeralStyle, animation: 'gradientShift 8s linear infinite' }}
          >
            {item.number}
          </div>
        )}

        <h3
          className="font-heading font-semibold text-text-heading mb-4"
          style={{ fontSize: 'clamp(20px, 2.6vw, 30px)', lineHeight: 1.2 }}
        >
          {item.title}
        </h3>

        <p
          className="font-heading text-text-body max-w-[60ch]"
          style={{ fontSize: 'clamp(14px, 1.6vw, 16px)', lineHeight: 1.65 }}
        >
          {item.description}
        </p>
      </div>

      {/* RIGHT — inline illustration */}
      <div
        className="right-col w-full flex items-center justify-center"
        style={{ alignSelf: 'start' }}
      >
        <div
          className="rounded-2xl w-full overflow-hidden"
          style={{
            ...glassCardStyle(ACCENT),
            aspectRatio: '3 / 2',
            maxWidth: 560,
            padding: 'clamp(16px, 2.5vw, 28px)',
          }}
        >
          <Illustration active={true} id={`cinema-ill-${item.number}`} className="w-full h-full" />
        </div>
      </div>
    </div>
  )
}

export default function ScrollytellingCinema() {
  const isDesktop = useIsDesktop()

  return (
    <Container>
      <SectionHeading className="text-center !mb-2">
        {capabilities.header}
      </SectionHeading>
      <p
        className="font-heading text-text-body text-center mx-auto mb-16 md:mb-24"
        style={{ fontSize: 'clamp(14px, 1.8vw, 16px)', maxWidth: 640 }}
      >
        {capabilities.subheader}
      </p>

      <div className="flex flex-col gap-16 md:gap-0">
        {capabilities.items.map((item, i) => (
          <CinemaStage
            key={item.number}
            item={item}
            index={i}
            isDesktop={isDesktop}
          />
        ))}
      </div>
    </Container>
  )
}
