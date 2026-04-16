import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Scroll-position based section detection.
 * Throttled to fire at most every 150ms to avoid layout thrashing
 * from getBoundingClientRect() calls on every scroll frame.
 */
export default function useActiveSection(sectionIds) {
  const [active, setActive] = useState(sectionIds[0])
  const refs = useRef({})

  // Build stable refs object
  sectionIds.forEach(id => {
    if (!refs.current[id]) refs.current[id] = { current: null }
  })

  const detect = useCallback(() => {
    const trigger = window.innerHeight * 0.4
    let closest = null
    let closestDist = Infinity

    for (const id of sectionIds) {
      const el = refs.current[id]?.current
      if (!el) continue
      const rect = el.getBoundingClientRect()
      const dist = Math.abs(rect.top - trigger)
      const inside = rect.top <= trigger && rect.bottom > trigger
      if (inside) {
        closest = id
        closestDist = 0
        break
      }
      if (dist < closestDist) {
        closestDist = dist
        closest = id
      }
    }

    if (closest) {
      setActive(prev => prev === closest ? prev : closest)
    }
  }, [sectionIds])

  useEffect(() => {
    let lastRun = 0
    let scheduled = null
    const THROTTLE_MS = 150

    const onScroll = () => {
      const now = Date.now()
      if (now - lastRun >= THROTTLE_MS) {
        lastRun = now
        detect()
      } else if (!scheduled) {
        // Schedule a trailing call so we always catch the final position
        scheduled = setTimeout(() => {
          lastRun = Date.now()
          detect()
          scheduled = null
        }, THROTTLE_MS - (now - lastRun))
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // Run once on mount
    detect()

    return () => {
      window.removeEventListener('scroll', onScroll)
      if (scheduled) clearTimeout(scheduled)
    }
  }, [detect])

  return [active, refs.current]
}
