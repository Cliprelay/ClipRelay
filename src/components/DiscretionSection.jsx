import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { attachTilt } from '../hooks/tilt'
import './DiscretionSection.css'

gsap.registerPlugin(ScrollTrigger)

export default function DiscretionSection() {
  const sectionRef = useRef(null)
  const ndaRef = useRef(null)
  const sampleRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ndaRef.current, {
        scrollTrigger: { trigger: ndaRef.current, start: 'top 82%', end: 'top 55%', scrub: 1 },
        y: 30, opacity: 0,
      })
      gsap.from(sampleRef.current, {
        scrollTrigger: { trigger: sampleRef.current, start: 'top 85%', end: 'top 58%', scrub: 1 },
        y: 30, opacity: 0,
      })
    }, sectionRef)

    const detachTilt = attachTilt(sampleRef.current, { max: 4, lift: -2 })
    return () => { ctx.revert(); detachTilt() }
  }, [])

  return (
    <section ref={sectionRef} className="discretion" id="discretion">
      <div className="discretion__inner">

        <div ref={ndaRef} className="discretion__nda">
          <span className="section-label">Privacy by default</span>
          <h2 className="section-title">
            Your campaign. <span className="accent">Your call.</span>
          </h2>
          <div className="discretion__copy">
            <p>
              Every client we've worked with has worked under NDA — not because we have
              something to hide, but because most clients prefer it that way.
            </p>
            <p>
              If keeping your campaign private gives you a competitive edge, we keep it
              private. No case studies, no name drops, no "featured client" carousel.
            </p>
            <p>
              And if you'd rather be seen — you can choose to waive the NDA and we'll
              showcase your campaign publicly. Either way, it's your decision.
            </p>
          </div>
        </div>

        <div ref={sampleRef} className="discretion__sample">
          <div className="discretion__sample-inner">
            <h3 className="discretion__sample-title">See it on your own brief.</h3>
            <p className="discretion__sample-desc">
              Want to see our work before you commit? Tell us the film, the track, or
              the product — we'll build a custom sample edit for your exact brief, so
              you can judge the quality on something that actually matters to you.
            </p>
            <a href="#contact" className="discretion__sample-btn">
              Request a sample edit
              <span className="discretion__sample-arrow">→</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
