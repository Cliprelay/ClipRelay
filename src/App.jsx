import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import ProblemSection from './components/ProblemSection'
import ProofSection from './components/ProofSection'
import WhoItsFor from './components/WhoItsFor'
import OrganicVsPaid from './components/OrganicVsPaid'
import HowItWorks from './components/HowItWorks'
import DiscretionSection from './components/DiscretionSection'
import CTASection from './components/CTASection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import LegalPage from './components/LegalPage'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const path = window.location.pathname

  useEffect(() => {
    if (path === '/privacy' || path === '/terms') return
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    })

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [path])

  if (path === '/privacy') return <LegalPage type="privacy" />
  if (path === '/terms') return <LegalPage type="terms" />

  return (
    <div className="app">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <ProofSection />
        <WhoItsFor />
        <OrganicVsPaid />
        <HowItWorks />
        <DiscretionSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
