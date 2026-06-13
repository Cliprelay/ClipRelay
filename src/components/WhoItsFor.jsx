import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { attachTiltAll } from '../hooks/tilt'
import './WhoItsFor.css'

gsap.registerPlugin(ScrollTrigger)

const segments = [
  { icon: '♪',  title: 'Music',                       desc: 'Get a track discovered and drive it into streams.' },
  { icon: '🎬', title: 'Film & TV',                    desc: "Get trailers and clips in front of the audiences who'll watch the whole thing." },
  { icon: '🎮', title: 'Games',                        desc: "Put gameplay and launch moments in front of players who'll actually wishlist and buy." },
  { icon: '◎',  title: 'Brands & Products',            desc: "Put your product in front of buyers who weren't looking for an ad." },
  { icon: '▶',  title: 'Creators & Subscription Brands', desc: "Organic top-of-funnel traffic where paid ads can't reach." },
  { icon: '⟐',  title: 'Agencies',                    desc: 'Your back-end distribution layer, white-labeled, at volume.' },
]

export default function WhoItsFor() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', end: 'top 55%', scrub: 1 },
        y: 30, opacity: 0,
      })

      cardsRef.current.forEach((el) => {
        if (!el) return
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 62%', scrub: 1 },
          y: 35, opacity: 0,
        })
      })
    }, sectionRef)

    const detachTilt = attachTiltAll(cardsRef.current)
    return () => { ctx.revert(); detachTilt() }
  }, [])

  return (
    <section ref={sectionRef} className="who" id="who-its-for">
      <div className="who__inner">
        <div ref={headerRef} className="who__header">
          <span className="section-label">Who it's for</span>
          <h2 className="section-title">
            One network.<br />
            <span className="accent">Every use case.</span>
          </h2>
        </div>

        <div className="who__grid">
          {segments.map((seg, i) => (
            <div key={i} ref={(el) => (cardsRef.current[i] = el)} className="who__card">
              <div className="who__card-icon">{seg.icon}</div>
              <h3 className="who__card-title">{seg.title}</h3>
              <p className="who__card-desc">{seg.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
