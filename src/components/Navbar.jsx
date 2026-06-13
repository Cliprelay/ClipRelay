import { useEffect, useState } from 'react'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        <a href="#" className="navbar__logo">
          <img src="/cliprelay-icon.png" alt="" className="navbar__logo-img" />
          <span>Clip<span className="wordmark-accent">Relay</span></span>
        </a>
        <div className="navbar__links">
          <a href="#what-we-do">What we do</a>
          <a href="#proof">The feed</a>
          <a href="#why-organic">Why organic</a>
          <a href="#how-it-works">How it works</a>
          <a href="#contact" className="navbar__cta">Start a campaign</a>
        </div>
      </div>
    </nav>
  )
}
