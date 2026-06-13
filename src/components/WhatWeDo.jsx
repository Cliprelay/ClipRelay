import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './WhatWeDo.css'

gsap.registerPlugin(ScrollTrigger)

const cards = [
  {
    icon: '◉',
    title: 'We distribute, organically.',
    desc: 'Real creators, real feeds — never paid ads. Your content reaches people who chose to watch, so it converts and compounds.',
  },
  {
    icon: '◎',
    title: 'You only pay for views.',
    desc: 'Not impressions. Not reach on paper. Real watches, billed on delivery. No waste.',
  },
  {
    icon: '⬡',
    title: 'Built to your brief.',
    desc: 'Your track, your product, your hook, your tags, your style. You brief it, we execute it across thousands of feeds.',
  },
]

export default function WhatWeDo() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', end: 'top 50%', scrub: 1 },
        y: 30, opacity: 0,
      })

      cardRefs.current.forEach((card) => {
        if (!card) return
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 88%', end: 'top 60%', scrub: 1 },
          y: 40, opacity: 0,
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="wwd" id="what-we-do">
      <div className="wwd__inner">
        <div ref={headerRef} className="wwd__header">
          <span className="section-label">What we do</span>
          <h2 className="section-title">
            Distribution that works<br />
            because it's <em className="accent">real.</em>
          </h2>
        </div>

        <div className="wwd__grid">
          {cards.map((card, i) => (
            <div key={i} ref={(el) => (cardRefs.current[i] = el)} className="wwd__card">
              <div className="wwd__card-icon">{card.icon}</div>
              <h3 className="wwd__card-title">{card.title}</h3>
              <p className="wwd__card-desc">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
