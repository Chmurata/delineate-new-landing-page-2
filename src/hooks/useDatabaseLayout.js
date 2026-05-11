import { useSyncExternalStore } from 'react'

export const DATABASE_LAYOUTS = [
  { id: 'editorial', label: 'Editorial', short: 'Single card' },
  { id: 'terminal', label: 'Terminal', short: 'Data terminal' },
]

const STORAGE_KEY = 'delineate.databases.layout'
const DEFAULT_LAYOUT = 'editorial'

function readInitial() {
  if (typeof window === 'undefined') return DEFAULT_LAYOUT
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored && DATABASE_LAYOUTS.some(l => l.id === stored)) return stored
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
  if (!DATABASE_LAYOUTS.some(l => l.id === next)) return
  if (next === value) return
  value = next
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, next)
  }
  listeners.forEach(fn => fn())
}

export function useDatabaseLayout() {
  const layout = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return [layout, setLayout]
}
