import { useEffect, useRef, useCallback, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './HeroSection.css'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const statRef = useRef(null)
  const headlineRef = useRef(null)
  const subRef = useRef(null)
  const btnRef = useRef(null)
  const btnInnerRef = useRef(null)
  const proofRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    // Subtle 3D depth: hero content tilts toward the cursor
    if (contentRef.current && !window.matchMedia('(hover: none)').matches) {
      const px = e.clientX / window.innerWidth - 0.5
      const py = e.clientY / window.innerHeight - 0.5
      gsap.to(contentRef.current, {
        rotateY: px * 3,
        rotateX: -py * 3,
        transformPerspective: 1400,
        duration: 0.8,
        ease: 'power2.out',
      })
    }

    if (!btnRef.current || !btnInnerRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const dist = Math.sqrt(x * x + y * y)
    if (dist < 100) {
      const pull = 1 - dist / 100
      gsap.to(btnInnerRef.current, { x: x * pull * 0.3, y: y * pull * 0.3, duration: 0.3, ease: 'power2.out' })
    } else {
      gsap.to(btnInnerRef.current, { x: 0, y: 0, duration: 0.4, ease: 'power2.out' })
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (btnInnerRef.current) gsap.to(btnInnerRef.current, { x: 0, y: 0, duration: 0.4, ease: 'power2.out' })
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from(statRef.current,    { y: 30, opacity: 0, scale: 0.96, duration: 0.8, delay: 0.15 })
        .from(headlineRef.current, { y: 40, opacity: 0, duration: 0.8 }, '-=0.5')
        .from(subRef.current,      { y: 30, opacity: 0, duration: 0.7 }, '-=0.4')
        .from(btnRef.current,      { y: 20, opacity: 0, duration: 0.6 }, '-=0.35')
        .from(proofRef.current,    { y: 15, opacity: 0, duration: 0.5 }, '-=0.2')

      gsap.to(contentRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true },
        opacity: 0, y: -80,
      })
    }, sectionRef)

    const section = sectionRef.current
    section.addEventListener('mousemove', handleMouseMove)
    return () => { ctx.revert(); section.removeEventListener('mousemove', handleMouseMove) }
  }, [handleMouseMove])

  return (
    <section ref={sectionRef} className="hero" id="hero">
      <div ref={contentRef} className="hero__content">

        <div ref={statRef} className="hero__stat">
          <span className="hero__stat-number">1B+</span>
          <span className="hero__stat-label">organic views delivered</span>
        </div>

        <h1 ref={headlineRef} className="hero__headline">
          Your content.<br />
          Millions of real feeds.<br />
          <span className="hero__headline-accent">Organically.</span>
        </h1>

        <p ref={subRef} className="hero__sub">
          ClipRelay distributes your music, brand, film, or game across thousands of real
          creator accounts on TikTok, Reels and Shorts — fully managed, billed per real view.
        </p>

        <div ref={btnRef} className="hero__btn-wrap" onMouseLeave={handleMouseLeave}>
          <a ref={btnInnerRef} href="#contact" className="hero__btn">
            Start a campaign
            <span className="hero__btn-arrow">→</span>
          </a>
        </div>

        <div ref={proofRef} className="hero__proof">
          {['TikTok', 'Reels', 'Shorts', 'Fully managed', 'Pay per real view'].map((item, i) => (
            <span key={i} className="hero__proof-item">
              {i > 0 && <span className="hero__proof-dot" />}
              {item}
            </span>
          ))}
        </div>

      </div>
    </section>
  )
}
