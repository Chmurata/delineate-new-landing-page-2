import { lazy, Suspense } from 'react'
import { useCapabilityLayout } from '../../hooks/useCapabilityLayout'

const SpecimenCards = lazy(() => import('./capabilities/layouts/SpecimenCards'))
const WorkflowTheater = lazy(() => import('./capabilities/layouts/WorkflowTheater'))
const ScrollytellingCinema = lazy(() => import('./capabilities/layouts/ScrollytellingCinema'))

const LAYOUT_COMPONENTS = {
  specimen: SpecimenCards,
  theater: WorkflowTheater,
  cinema: ScrollytellingCinema,
}

export default function Capabilities() {
  const [layout] = useCapabilityLayout()
  const LayoutComponent = LAYOUT_COMPONENTS[layout] ?? SpecimenCards

  return (
    <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
      <LayoutComponent />
    </Suspense>
  )
}
