import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

/**
 * SplitText — per-character stagger animation.
 *
 * Uses a SINGLE IntersectionObserver on the wrapper <motion.span> instead of
 * one per character. Each char animates via a parent-controlled variant with
 * staggerChildren, eliminating 100+ individual IntersectionObservers that
 * caused layout thrashing on mobile (especially during address-bar show/hide).
 */
export default function SplitText({
  children,
  className,
  delay = 0,
  staggerDelay = 0.03,
  duration = 0.4,
  once = true,
}) {
  const words = useMemo(() => {
    const text = typeof children === 'string' ? children : ''
    return text.split(' ').map((word, wi) => {
      const chars = word.split('').map((char, ci) => ({
        char,
        key: `${wi}-${ci}`,
      }))
      return { word, chars, key: `w-${wi}` }
    })
  }, [children])

  // Container variants — single observer triggers all children
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: staggerDelay,
      },
    },
  }

  const charVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <motion.span
      className={cn('inline-flex flex-wrap', className)}
      aria-label={children}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: '-50px 0px' }}
    >
      {words.map((w, wi) => (
        <span key={w.key} style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}>
          {w.chars.map(({ char, key }) => (
            <motion.span
              key={key}
              variants={charVariants}
              style={{ display: 'inline-block' }}
              aria-hidden="true"
            >
              {char}
            </motion.span>
          ))}
          {/* Space between words — rendered as a normal space so line-wrap works naturally */}
          {wi < words.length - 1 && <span style={{ display: 'inline-block', width: '0.3em' }}>{'\u00A0'}</span>}
        </span>
      ))}
    </motion.span>
  )
}
