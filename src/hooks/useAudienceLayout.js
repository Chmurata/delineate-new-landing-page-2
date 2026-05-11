import { useSyncExternalStore } from 'react'

export const AUDIENCE_LAYOUTS = [
  { id: 'quadrant', label: 'Quadrant', short: 'Glass cards' },
  { id: 'minimalist', label: 'Minimalist', short: 'Editorial row' },
]

const STORAGE_KEY = 'delineate.audiences.layout'
const DEFAULT_LAYOUT = 'quadrant'

function readInitial() {
  if (typeof window === 'undefined') return DEFAULT_LAYOUT
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored && AUDIENCE_LAYOUTS.some(l => l.id === stored)) return stored
  return DEFAULT_LAYOUT
}

let value = readInitial()
const listeners = new Set()

const subscribe = (fn) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
const getSnapshot = () => value
const getServerSnapshot = () => DEFAULT_LAYOUT

function setLayout(next) {
  if (!AUDIENCE_LAYOUTS.some(l => l.id === next)) return
  if (next === value) return
  value = next
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, next)
  }
  listeners.forEach(fn => fn())
}

export function useAudienceLayout() {
  const layout = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return [layout, setLayout]
}
