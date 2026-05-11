import { useSyncExternalStore } from 'react'

export const LAYOUTS = [
  { id: 'specimen', label: 'Specimen', short: 'Cards' },
  { id: 'theater', label: 'Theater', short: 'Pipeline' },
]

const STORAGE_KEY = 'delineate.capabilities.layout'
const DEFAULT_LAYOUT = 'specimen'

function readInitial() {
  if (typeof window === 'undefined') return DEFAULT_LAYOUT
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored && LAYOUTS.some(l => l.id === stored)) return stored
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
  if (!LAYOUTS.some(l => l.id === next)) return
  if (next === value) return
  value = next
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, next)
  }
  listeners.forEach(fn => fn())
}

export function useCapabilityLayout() {
  const layout = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return [layout, setLayout]
}
