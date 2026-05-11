import { lazy, Suspense } from 'react'
import { useDatabaseLayout } from '../../hooks/useDatabaseLayout'

const Editorial = lazy(() => import('./databases/layouts/Editorial'))
const Terminal = lazy(() => import('./databases/layouts/Terminal'))

const LAYOUT_COMPONENTS = {
  editorial: Editorial,
  terminal: Terminal,
}

export default function Databases() {
  const [layout] = useDatabaseLayout()
  const LayoutComponent = LAYOUT_COMPONENTS[layout] ?? Editorial

  return (
    <Suspense fallback={<div style={{ minHeight: '40vh' }} />}>
      <LayoutComponent />
    </Suspense>
  )
}
