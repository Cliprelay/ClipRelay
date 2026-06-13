import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './HowItWorks.css'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    number: '01',
    title: 'You send the content and the brief.',
    desc: 'Your hooks, your tags, your style. Everything we distribute is personalized to it.',
  },
  {
    number: '02',
    title: 'We handle the rest.',
    desc: 'Cutting, accounts, posting, distribution across thousands of real feeds. Fully managed — you\'re not involved in any of it.',
  },
  {
    number: '03',
    title: 'You pay per view delivered.',
    desc: 'Real watches, not impressions. No retainers for effort, no budget burned on reach that didn\'t happen.',
  },
]

export default function HowItWorks() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const stepsRef = useRef([])
  const closingRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', end: 'top 55%', scrub: 1 },
        y: 30, opacity: 0,
      })

      stepsRef.current.forEach((el) => {
        if (!el) return
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 62%', scrub: 1 },
          y: 35, opacity: 0,
        })
      })

      gsap.from(closingRef.current, {
        scrollTrigger: { trigger: closingRef.current, start: 'top 90%', end: 'top 68%', scrub: 1 },
        y: 20, opacity: 0,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="hiw" id="how-it-works">
      <div className="hiw__inner">
        <div ref={headerRef} className="hiw__header">
          <span className="section-label">How it works</span>
          <h2 className="section-title">
            You do nothing.<br />
            <span className="accent">We do everything.</span>
          </h2>
        </div>

        <div className="hiw__steps">
          {steps.map((step, i) => (
            <div key={i} ref={(el) => (stepsRef.current[i] = el)} className="hiw__step">
              <div className="hiw__step-number">{step.number}</div>
              <div className="hiw__step-content">
                <h3 className="hiw__step-title">{step.title}</h3>
                <p className="hiw__step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div ref={closingRef} className="hiw__closing">
          <p>No risk. No workload. Just views.</p>
        </div>
      </div>
    </section>
  )
}
