import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './CTASection.css'

gsap.registerPlugin(ScrollTrigger)

export default function CTASection() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const btnRef = useRef(null)
  const btnInnerRef = useRef(null)
  const emailRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
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
      gsap.from(titleRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', end: 'top 40%', scrub: 1 },
        y: 40, opacity: 0,
      })
      gsap.from(btnRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 55%', end: 'top 30%', scrub: 1 },
        y: 30, opacity: 0,
      })
      gsap.from(emailRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 50%', end: 'top 25%', scrub: 1 },
        y: 20, opacity: 0,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="cta" onMouseMove={handleMouseMove}>
      <div className="cta__content">
        <h2 ref={titleRef} className="cta__title">
          Real creators.<br />
          Real views.<br />
          <span className="cta__accent">Real growth.</span>
        </h2>

        <div ref={btnRef} className="cta__btn-wrap" onMouseLeave={handleMouseLeave}>
          <a ref={btnInnerRef} href="#contact" className="cta__btn">
            Start a campaign
            <span className="cta__btn-arrow">→</span>
          </a>
        </div>

        <p ref={emailRef} className="cta__email">
          <a href="mailto:Team@cliprelaymedia.com" style={{ color: 'inherit' }}>Team@cliprelaymedia.com</a>
        </p>
      </div>
    </section>
  )
}
