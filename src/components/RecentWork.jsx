import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './RecentWork.css'

gsap.registerPlugin(ScrollTrigger)

export default function RecentWork() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const gridRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', end: 'top 50%', scrub: 1 },
        y: 40, opacity: 0,
      })

      const items = gridRef.current?.children
      if (items) {
        gsap.from(items, {
          scrollTrigger: { trigger: gridRef.current, start: 'top 80%', end: 'top 40%', scrub: 1 },
          y: 50, opacity: 0, scale: 0.93, stagger: 0.08,
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="work" id="recent-work">
      <div ref={headerRef} className="work__header">
        <span className="work__label">Recent work</span>
        <h2 className="work__title">A few of the clips we've put across the feed.</h2>
      </div>

      <div ref={gridRef} className="work__grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="work__item">
            <div className="work__item-inner">
              <div className="work__item-play">▶</div>
              <div className="work__item-bar" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
