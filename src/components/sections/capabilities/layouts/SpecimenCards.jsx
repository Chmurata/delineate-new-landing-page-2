import { useRef } from 'react'
import Container from '../../../ui/Container'
import { useIsDesktop } from '../../../../hooks/useMediaQuery'
import { capabilities } from '../../../../content'
import { glassCardStyle } from '../../../../lib/glass'
import { Ill01, Ill02, Ill03, Ill04, Ill05 } from '../illustrations'

const ILLUSTRATIONS = [Ill01, Ill02, Ill03, Ill04, Ill05]

const NUMERAL_GRADIENT =
  'linear-gradient(90deg, #5B7FBF, #7C9ED9, #A8C4E8, #B8D4F0, #7C9ED9, #5B7FBF, #7C9ED9)'

// Layout knobs — keep these centralized so the title's bottom edge and
// the card pin position stay in sync.
const TITLE_TOP_OFFSET = 96 // px below viewport top, just below navbar
const CARD_STACK_TOP = 260 // px from viewport top — first card pins here
const CARD_STACK_PEEK = 80 // px peek of each previous card above the next (~22% of card height)
const CARD_HEIGHT_DESKTOP = 360 // fixed card height for stable measurements
const CARD_DISTANCE = 80 // gap between cards in flow before they pin

function SpecimenCard({ item, index }) {
  const isDesktop = useIsDesktop()
  const cardContentRef = useRef(null)

  const Illustration = ILLUSTRATIONS[index] ?? null
  const illId = `ill${item.number}`

  return (
    <div
      ref={cardContentRef}
      className="rounded-3xl overflow-hidden w-full"
      style={{
        height: isDesktop ? CARD_HEIGHT_DESKTOP : 'auto',
        minHeight: isDesktop ? undefined : 460,
        ...glassCardStyle(),
      }}
    >
      <div
        className="flex flex-col md:flex-row md:items-start gap-8 md:gap-10 h-full"
        style={{ padding: 'clamp(24px, 3vw, 36px) clamp(24px, 3vw, 48px) clamp(28px, 3.5vw, 48px)' }}
      >
        {/* Numeral */}
        <div
          className="flex-shrink-0 flex items-start justify-center md:justify-start"
          style={{ minWidth: isDesktop ? 132 : undefined }}
        >
          <div
            className="font-heading font-extrabold leading-none"
            style={{
              fontSize: 'clamp(64px, 9vw, 112px)',
              background: NUMERAL_GRADIENT,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {item.number}
          </div>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <h3
            className="font-heading font-semibold text-text-heading"
            style={{
              fontSize: 'clamp(20px, 2.6vw, 28px)',
              lineHeight: 1.25,
            }}
          >
            {item.title}
          </h3>
          <p
            className="font-heading text-text-body"
            style={{
              fontSize: 'clamp(13px, 1.6vw, 15px)',
              lineHeight: '24px',
            }}
          >
            {item.description}
          </p>
        </div>

        {/* Illustration */}
        <div
          className="flex-shrink-0 relative overflow-hidden"
          style={{
            width: '100%',
            maxWidth: isDesktop ? 380 : undefined,
            height: isDesktop ? 280 : 220,
          }}
          aria-hidden={Illustration ? undefined : 'true'}
        >
          {Illustration ? (
            <Illustration
              active={true}
              id={illId}
              className="absolute inset-0 w-full h-full"
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default function SpecimenCards() {
  const items = capabilities.items
  const isDesktop = useIsDesktop()

  return (
    <Container>
      <div className="max-w-[min(1080px,92vw)] mx-auto">
        {/* Sticky title block — locks below navbar while user scrolls
            through the card stack. */}
        <div
          className="text-center"
          style={{ paddingBottom: 24 }}
        >
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
            style={{ fontSize: 'clamp(14px, 1.8vw, 16px)', maxWidth: 640 }}
          >
            {capabilities.subheader}
          </p>
        </div>

        <div className="flex flex-col gap-6 mt-4">
          {items.map((item, i) => (
            <SpecimenCard key={item.number} item={item} index={i} />
          ))}
        </div>
      </div>
    </Container>
  )
}
