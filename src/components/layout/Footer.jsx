import { useState } from 'react'
import { footer } from '../../content'

const ACCENT = '#7C9ED9'

function SocialIcon({ href, src, alt, size = 18 }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
    >
      <img
        src={src}
        alt={alt}
        style={{
          height: size, width: 'auto',
          filter: hovered ? 'brightness(1) saturate(1)' : 'brightness(0.6) saturate(0)',
          opacity: hovered ? 1 : 0.4,
          transition: 'all 0.25s',
        }}
      />
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="px-[clamp(1.5rem,5vw,4rem)]">
      {/* Gradient separator */}
      <div className="h-[1px]" style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}30, transparent)` }} />

      <div className="max-w-[min(960px,90vw)] mx-auto py-5">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-3">
          <img src="/assets/logo.svg" alt="Delineate" className="h-7 w-auto" />

          <div className="flex gap-5 items-center">
            <a href="/about" className="font-body text-text-body text-[13px] font-medium no-underline hover:text-text-heading transition-colors">
              About
            </a>
            <a href="/blog" className="font-body text-text-body text-[13px] font-medium no-underline hover:text-text-heading transition-colors">
              Blog
            </a>
          </div>

          <SocialIcon href={footer.socials.linkedin || '#'} src="/assets/logos/linkedin.svg" alt="LinkedIn" size={22} />
        </div>

        {/* Row 2 */}
        <div className="flex items-center justify-between">
          <p className="font-body text-text-caption text-xs">
            © 2026 Delineate
          </p>
          <a
            href="#"
            className="font-body text-text-caption text-xs hover:text-text-body transition-colors underline-offset-4 hover:underline"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  )
}
