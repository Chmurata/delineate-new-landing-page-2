import { useState, useEffect } from 'react'

export default function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(query)
    setMatches(mql.matches)

    const handler = (e) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

// Convenience hooks
export const useIsDesktop = () => useMediaQuery('(min-width: 1280px)')
export const useIsTablet = () => useMediaQuery('(min-width: 768px)')
export const useIsMobile = () => useMediaQuery('(max-width: 639px)')
