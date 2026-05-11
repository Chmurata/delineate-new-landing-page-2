/* ScrollStack — adapted from React Bits, native-scroll edition.
 * https://reactbits.dev/components/scroll-stack
 *
 * Window-scroll mode. A native passive scroll listener drives a per-frame
 * callback that applies translate3d + scale + optional blur to each
 * `.scroll-stack-card`. No Lenis — native scroll keeps the math in sync
 * with browser scroll position frame-for-frame, eliminates stutter, and
 * avoids fighting other scroll listeners on the page.
 *
 * Each card pins at `stackPosition + (itemStackDistance * index)` from the
 * top of the viewport. Later cards pin lower, so a deck-style stack forms
 * with each previous card peeking by `itemStackDistance` px.
 */

import { useLayoutEffect, useRef, useCallback } from 'react'
import './ScrollStack.css'

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
)

export default function ScrollStack({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  onStackComplete,
}) {
  const scrollerRef = useRef(null)
  const stackCompletedRef = useRef(false)
  const cardsRef = useRef([])
  const lastTransformsRef = useRef(new Map())
  const rafIdRef = useRef(null)
  const offsetsCacheRef = useRef({ cards: [], end: 0 })

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0
    if (scrollTop > end) return 1
    return (scrollTop - start) / (end - start)
  }, [])

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight
    }
    return parseFloat(value)
  }, [])

  const getElementOffset = useCallback((element) => {
    const rect = element.getBoundingClientRect()
    return rect.top + window.scrollY
  }, [])

  const updateOffsetsCache = useCallback(() => {
    if (!cardsRef.current.length) return

    const cachedTransforms = []
    cardsRef.current.forEach((card) => {
      cachedTransforms.push(card.style.transform)
      card.style.transform = 'none'
    })

    const cards = cardsRef.current.map((card) => getElementOffset(card))
    const endElement = scrollerRef.current?.querySelector('.scroll-stack-end')
    const end = endElement ? getElementOffset(endElement) : 0

    cardsRef.current.forEach((card, i) => {
      card.style.transform = cachedTransforms[i]
    })

    offsetsCacheRef.current = { cards, end }
  }, [getElementOffset])

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length) return

    const { cards: cachedCardTops, end: endElementTop } = offsetsCacheRef.current
    if (!cachedCardTops.length) return

    const scrollTop = window.scrollY
    const containerHeight = window.innerHeight
    const stackPositionPx = parsePercentage(stackPosition, containerHeight)
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight)

    cardsRef.current.forEach((card, i) => {
      if (!card) return

      const cardTop = cachedCardTops[i] || 0
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i
      const triggerEnd = cardTop - scaleEndPositionPx
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i
      const pinEnd = endElementTop - containerHeight / 2

      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd)
      const targetScale = baseScale + i * itemScale
      const scale = 1 - scaleProgress * (1 - targetScale)
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0

      let blur = 0
      if (blurAmount) {
        let topCardIndex = 0
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = cachedCardTops[j] || 0
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j
          if (scrollTop >= jTriggerStart) topCardIndex = j
        }
        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i
          blur = Math.max(0, depthInStack * blurAmount)
        }
      }

      let translateY = 0
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd
      if (isPinned) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      }

      const lastTransform = lastTransformsRef.current.get(i)
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : ''
        card.style.transform = transform
        card.style.filter = filter
        lastTransformsRef.current.set(i, newTransform)
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true
          onStackComplete?.()
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false
        }
      }
    })
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getElementOffset,
  ])

  // Throttle scroll handler to RAF — runs at most once per animation frame.
  const handleScroll = useCallback(() => {
    if (rafIdRef.current != null) return
    rafIdRef.current = requestAnimationFrame(() => {
      rafIdRef.current = null
      updateCardTransforms()
    })
  }, [updateCardTransforms])

  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card'))
    cardsRef.current = cards
    const transformsCache = lastTransformsRef.current

    cards.forEach((card, i) => {
      if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`
      card.style.willChange = 'transform, filter'
      card.style.transformOrigin = 'top center'
      card.style.backfaceVisibility = 'hidden'
      card.style.transform = 'translateZ(0)'
      card.style.perspective = '1000px'
    })

    if (reduce) {
      // Cards flow naturally with normal scroll; no transforms applied.
      return () => {
        cardsRef.current = []
        transformsCache.clear()
      }
    }

    const handleResize = () => {
      updateOffsetsCache()
      handleScroll()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    // Apply once after layout settles (fonts, images).
    const settle = setTimeout(() => {
      updateOffsetsCache()
      updateCardTransforms()
    }, 100)
    // Apply once immediately so the first paint reflects current scroll.
    updateOffsetsCache()
    updateCardTransforms()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      clearTimeout(settle)
      if (rafIdRef.current != null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      stackCompletedRef.current = false
      cardsRef.current = []
      transformsCache.clear()
    }
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
    handleScroll,
    updateCardTransforms,
  ])

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  )
}
