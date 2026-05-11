import Container from '../../../ui/Container'
import { capabilities } from '../../../../content'
import { glassCardStyle } from '../../../../lib/glass'
import { Ill01, Ill02, Ill03, Ill04, Ill05, Ill06 } from '../illustrations'

const ILLUSTRATIONS = [Ill01, Ill02, Ill03, Ill04, Ill05, Ill06]

const NUMERAL_GRADIENT =
  'linear-gradient(90deg, #5B7FBF, #7C9ED9, #A8C4E8, #B8D4F0, #7C9ED9, #5B7FBF, #7C9ED9)'

function SpecimenCard({ item, index }) {
  const Illustration = ILLUSTRATIONS[index] ?? null
  const illId = `ill${item.number}`

  return (
    <div
      className="rounded-3xl overflow-hidden flex flex-col h-full"
      style={glassCardStyle()}
    >
      {/* Illustration — inset block with its own 16px radius */}
      <div style={{ padding: '10px 10px 0 10px' }}>
        <div
          className="relative overflow-hidden w-full"
          style={{ aspectRatio: '3 / 2', borderRadius: 16 }}
          aria-hidden={Illustration ? undefined : 'true'}
        >
          {Illustration ? (
            <Illustration active={true} id={illId} className="absolute inset-0 w-full h-full" />
          ) : null}
        </div>
      </div>

      {/* Text — bottom ~60% */}
      <div
        className="flex-1 flex flex-col gap-2"
        style={{ padding: 'clamp(18px, 1.8vw, 24px) clamp(18px, 1.8vw, 24px) clamp(20px, 2vw, 26px)' }}
      >
        <div
          className="font-heading font-extrabold leading-none"
          style={{
            fontSize: 'clamp(22px, 2.2vw, 30px)',
            background: NUMERAL_GRADIENT,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 4,
          }}
        >
          {item.number}
        </div>
        <h3
          className="font-heading font-semibold text-text-heading"
          style={{
            fontSize: 'clamp(15px, 1.45vw, 17px)',
            lineHeight: 1.3,
          }}
        >
          {item.title}
        </h3>
        <p
          className="font-heading text-text-body"
          style={{
            fontSize: 'clamp(12px, 1.05vw, 13px)',
            lineHeight: '20px',
            opacity: 0.85,
          }}
        >
          {item.description}
        </p>
      </div>
    </div>
  )
}

export default function SpecimenCards() {
  const items = capabilities.items

  return (
    <Container>
      <div className="max-w-[min(1240px,94vw)] mx-auto">
        <div className="text-center" style={{ paddingBottom: 32 }}>
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
            style={{ fontSize: 'clamp(14px, 1.6vw, 16px)', maxWidth: 720 }}
          >
            {capabilities.subheader}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <SpecimenCard key={item.number} item={item} index={i} />
          ))}
        </div>
      </div>
    </Container>
  )
}
