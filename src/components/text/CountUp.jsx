import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '../../lib/cn'

export default function CountUp({
  end,
  start = 0,
  duration = 2,
  suffix = '',
  prefix = '',
  className,
  once = true,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once })
  const [value, setValue] = useState(start)

  useEffect(() => {
    if (!inView) return

    const startTime = performance.now()
    const diff = end - start

    function tick(now) {
      const elapsed = (now - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(start + diff * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [inView, start, end, duration])

  return (
    <motion.span
      ref={ref}
      className={cn('tabular-nums', className)}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {prefix}{value.toLocaleString()}{suffix}
    </motion.span>
  )
}
