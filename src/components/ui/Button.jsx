import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

const ACCENT = '#7C9ED9'

const variants = {
  primary: {
    base: `
      bg-accent text-text-on-accent font-semibold
      shadow-[0_0_20px_-4px_rgba(124,158,217,0.4),0_0_8px_-2px_rgba(124,158,217,0.3)]
    `,
    hover: {
      boxShadow: `0 0 28px -4px ${ACCENT}70, 0 0 12px -2px ${ACCENT}50`,
      scale: 1.03,
    },
  },
  secondary: {
    base: `
      bg-accent-dark text-accent border border-accent/25
    `,
    hover: {
      borderColor: `${ACCENT}50`,
      boxShadow: `0 0 16px -4px ${ACCENT}30`,
      scale: 1.02,
    },
  },
  ghost: {
    base: `
      bg-transparent text-accent border border-accent/20
    `,
    hover: {
      borderColor: `${ACCENT}40`,
      backgroundColor: `${ACCENT}0A`,
      scale: 1.02,
    },
  },
}

export default function Button({
  children,
  variant = 'primary',
  className,
  href,
  ...props
}) {
  const v = variants[variant]
  const Tag = href ? motion.a : motion.button

  return (
    <Tag
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'rounded-full px-4 py-2.5 sm:px-6 sm:py-3',
        'font-body text-sm sm:text-base font-semibold',
        'cursor-pointer outline-none',
        'transition-all duration-300',
        'min-h-[44px]',
        v.base,
        className
      )}
      whileHover={v.hover}
      whileTap={{ scale: 0.97 }}
      {...props}
    >
      {children}
    </Tag>
  )
}
