import { lazy, Suspense } from 'react'
import { useAudienceLayout } from '../../hooks/useAudienceLayout'

const Quadrant = lazy(() => import('./audiences/layouts/Quadrant'))
const Minimalist = lazy(() => import('./audiences/layouts/Minimalist'))

const LAYOUT_COMPONENTS = {
  quadrant: Quadrant,
  minimalist: Minimalist,
}

export default function Audiences() {
  const [layout] = useAudienceLayout()
  const LayoutComponent = LAYOUT_COMPONENTS[layout] ?? Quadrant

  return (
    <Suspense fallback={<div style={{ minHeight: '40vh' }} />}>
      <LayoutComponent />
    </Suspense>
  )
}
