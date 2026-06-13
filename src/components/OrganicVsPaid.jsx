import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './OrganicVsPaid.css'

gsap.registerPlugin(ScrollTrigger)

export default function OrganicVsPaid() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const colsRef = useRef(null)
  const paidDotsRef = useRef(null)
  const organicDotsRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', end: 'top 55%', scrub: 1 },
        y: 30, opacity: 0,
      })

      gsap.from(colsRef.current, {
        scrollTrigger: { trigger: colsRef.current, start: 'top 85%', end: 'top 55%', scrub: 1 },
        y: 40, opacity: 0,
      })

      // Paid dots: scatter outward and fade
      if (paidDotsRef.current) {
        const dots = paidDotsRef.current.children
        gsap.from(dots, {
          scrollTrigger: { trigger: colsRef.current, start: 'top 80%', end: 'top 40%', scrub: 1 },
          scale: 0, opacity: 0, stagger: { each: 0.02, from: 'center' },
        })
        // Fade most dots out as you scroll further
        Array.from(dots).forEach((dot, i) => {
          if (i % 4 !== 0) { // 75% fade to dim
            gsap.to(dot, {
              scrollTrigger: { trigger: colsRef.current, start: 'top 40%', end: 'top 10%', scrub: 1 },
              opacity: 0.12,
            })
          }
        })
      }

      // Organic dots: appear clustered, glow
      if (organicDotsRef.current) {
        const dots = organicDotsRef.current.children
        gsap.from(dots, {
          scrollTrigger: { trigger: colsRef.current, start: 'top 75%', end: 'top 35%', scrub: 1 },
          scale: 0, opacity: 0, stagger: { each: 0.03, from: 'center' },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Generate dot positions
  const paidDots = Array.from({ length: 36 }, (_, i) => ({
    left: `${10 + Math.random() * 80}%`,
    top: `${8 + Math.random() * 84}%`,
    size: 5 + Math.random() * 4,
    opacity: Math.random() < 0.25 ? 0.5 : 0.2,
  }))

  const organicDots = Array.from({ length: 28 }, (_, i) => {
    const angle = (i / 28) * Math.PI * 2 + Math.random() * 0.5
    const dist = 8 + Math.random() * 30
    return {
      left: `${50 + Math.cos(angle) * dist}%`,
      top: `${50 + Math.sin(angle) * dist}%`,
      size: 5 + Math.random() * 5,
    }
  })

  return (
    <section ref={sectionRef} className="ovp" id="why-organic">
      <div className="ovp__inner">
        <div ref={headerRef} className="ovp__header">
          <span className="section-label">Why organic</span>
          <h2 className="section-title">
            Paid traffic stops.<br />
            <span className="accent">Organic compounds.</span>
          </h2>
        </div>

        <div ref={colsRef} className="ovp__columns">
          {/* PAID */}
          <div className="ovp__col">
            <div className="ovp__viz ovp__viz--paid">
              <div ref={paidDotsRef} className="ovp__dots">
                {paidDots.map((d, i) => (
                  <span
                    key={i}
                    className="ovp__dot ovp__dot--grey"
                    style={{ left: d.left, top: d.top, width: d.size, height: d.size, opacity: d.opacity }}
                  />
                ))}
              </div>
            </div>
            <span className="ovp__col-tag">Paid</span>
            <h3 className="ovp__col-title">Forced impressions.</h3>
            <p className="ovp__col-desc">
              Pushed at everyone, whether they care or not. Most scroll past.
              Budget stops, traffic stops.
            </p>
          </div>

          <div className="ovp__divider" />

          {/* ORGANIC */}
          <div className="ovp__col">
            <div className="ovp__viz ovp__viz--organic">
              <div ref={organicDotsRef} className="ovp__dots">
                {organicDots.map((d, i) => (
                  <span
                    key={i}
                    className="ovp__dot ovp__dot--green"
                    style={{ left: d.left, top: d.top, width: d.size, height: d.size }}
                  />
                ))}
              </div>
            </div>
            <span className="ovp__col-tag ovp__col-tag--green">Organic</span>
            <h3 className="ovp__col-title">Real views.</h3>
            <p className="ovp__col-desc">
              The exact feeds of people who chose to watch.
              The signal compounds — algorithms push it further.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
