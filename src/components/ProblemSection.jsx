import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { attachTiltAll } from '../hooks/tilt'
import './ProblemSection.css'

gsap.registerPlugin(ScrollTrigger)

const problems = [
  {
    label: '01',
    title: 'Paid ads stop the moment you do.',
    desc: 'You rent the audience — and the meter never stops running.',
  },
  {
    label: '02',
    title: 'Impressions aren\'t views.',
    desc: 'Most channels bill you for content that flickered past a feed, not content anyone watched.',
  },
  {
    label: '03',
    title: 'Doing organic in-house doesn\'t scale.',
    desc: 'Editors, accounts, posting schedules — a full-time operation just to stay visible.',
  },
]

export default function ProblemSection() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const cardsRef = useRef([])
  const resolutionRef = useRef(null)

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
          y: 30, opacity: 0,
        })
      })

      gsap.from(resolutionRef.current, {
        scrollTrigger: { trigger: resolutionRef.current, start: 'top 88%', end: 'top 65%', scrub: 1 },
        y: 20, opacity: 0,
      })
    }, sectionRef)

    const detachTilt = attachTiltAll(cardsRef.current)
    return () => { ctx.revert(); detachTilt() }
  }, [])

  return (
    <section ref={sectionRef} className="problem" id="what-we-do">
      <div className="problem__inner">
        <div ref={headerRef} className="problem__header">
          <span className="section-label">The problem with marketing right now</span>
          <h2 className="section-title">
            Three reasons most<br />
            <span className="accent">campaigns underdeliver.</span>
          </h2>
        </div>

        <div className="problem__cards">
          {problems.map((p, i) => (
            <div key={i} ref={(el) => (cardsRef.current[i] = el)} className="problem__card">
              <span className="problem__card-num">{p.label}</span>
              <h3 className="problem__card-title">{p.title}</h3>
              <p className="problem__card-desc">{p.desc}</p>
            </div>
          ))}
        </div>

        <div ref={resolutionRef} className="problem__resolution">
          <p>ClipRelay exists because of all three.</p>
        </div>
      </div>
    </section>
  )
}
