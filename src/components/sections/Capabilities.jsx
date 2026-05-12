import SpecimenCards from './capabilities/layouts/SpecimenCards'
import SidebarCapabilities from './capabilities/layouts/SidebarCapabilities'

export default function Capabilities() {
  return (
    <>
      {/* Variant A — existing 3×2 grid (kept as-is for Jawad to compare) */}
      <SpecimenCards />

      {/* Variant B — sidebar selection layout (new alternate preview) */}
      <div style={{ paddingTop: 'clamp(48px, 6vw, 96px)' }}>
        <SidebarCapabilities />
      </div>
    </>
  )
}
