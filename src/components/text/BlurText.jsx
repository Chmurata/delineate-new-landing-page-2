import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

export default function BlurText({
  children,
  className,
  delay = 0,
  duration = 0.6,
  once = true,
  as: Tag = 'span',
}) {
  const words = useMemo(() => {
    const text = typeof children === 'string' ? children : ''
    return text.split(' ')
  }, [children])

  return (
    <Tag className={cn('inline-flex flex-wrap gap-x-[0.3em]', className)} aria-label={children}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, filter: 'blur(0px)' }}
          viewport={{ once }}
          transition={{
            duration,
            delay: delay + i * 0.06,
            ease: [0.16, 1, 0.3, 1],
          }}
          style={{ display: 'inline-block', willChange: 'opacity, filter' }}
          aria-hidden="true"
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  )
}
