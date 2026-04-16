import { useState, useCallback, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PreloaderAnimation from './components/background/PreloaderAnimation'
import CinematicBg from './components/background/CinematicBg'
import ScrollCells from './components/background/ScrollCells'
import Navbar from './components/layout/Navbar'
import HeroSection from './components/hero/HeroSection'
import SocialProof from './components/sections/SocialProof'
import useActiveSection from './hooks/useActiveSection'

const Differentiators = lazy(() => import('./components/sections/Differentiators'))
const CaseStudies = lazy(() => import('./components/sections/CaseStudies'))
const Process = lazy(() => import('./components/sections/Process'))
const Services = lazy(() => import('./components/sections/Services'))
const ClosingCTA = lazy(() => import('./components/sections/ClosingCTA'))
const Footer = lazy(() => import('./components/layout/Footer'))

const BASE = '#020B0F'
const SECTION_IDS = ['hero', 'socialproof', 'differentiators', 'casestudies', 'process', 'services', 'closing']

function SectionWrap({ id, sectionRef, children, className = '' }) {
  return (
    <div
      ref={el => { if (sectionRef) sectionRef.current = el }}
      data-section={id}
      className={className}
      style={{ position: 'relative' }}
    >
      {children}
    </div>
  )
}

export default function App() {
  const [showPreloader, setShowPreloader] = useState(true)
  const [activeSection, sectionRefs] = useActiveSection(SECTION_IDS)

  const scrollToSection = useCallback((sectionId) => {
    const ref = sectionRefs[sectionId]
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [sectionRefs])

  return (
    <div>
      {/* Preloader */}
      <AnimatePresence>
        {showPreloader && (
          <motion.div
            key="preloader"
            className="fixed inset-0 z-50"
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <PreloaderAnimation onComplete={() => setShowPreloader(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background layers */}
      <CinematicBg />
      <ScrollCells />

      {/* Navbar */}
      <Navbar scrollToSection={scrollToSection} />

      {/* Hero */}
      <SectionWrap id="hero" sectionRef={sectionRefs.hero}>
        <HeroSection />
      </SectionWrap>

      {/* Below-fold sections */}
      <div className="relative" style={{ zIndex: 2 }}>
        <SectionWrap id="socialproof" sectionRef={sectionRefs.socialproof} className="pt-[clamp(2rem,5vw,4rem)] pb-[clamp(1rem,3vw,2rem)]">
          <SocialProof />
        </SectionWrap>

        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <SectionWrap id="differentiators" sectionRef={sectionRefs.differentiators} className="py-[clamp(3rem,6vw,5rem)]">
            <Differentiators />
          </SectionWrap>

          <SectionWrap id="casestudies" sectionRef={sectionRefs.casestudies} className="py-[clamp(3rem,6vw,5rem)]">
            <CaseStudies />
          </SectionWrap>

          <SectionWrap id="process" sectionRef={sectionRefs.process} className="py-[clamp(3rem,6vw,5rem)]">
            <Process />
          </SectionWrap>

          <SectionWrap id="services" sectionRef={sectionRefs.services} className="py-[clamp(3rem,6vw,5rem)]">
            <Services />
          </SectionWrap>

          <SectionWrap id="closing" sectionRef={sectionRefs.closing} className="py-[clamp(3rem,6vw,5rem)]">
            <ClosingCTA />
          </SectionWrap>

          <Footer />
        </Suspense>
      </div>
    </div>
  )
}
