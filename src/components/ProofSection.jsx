import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { attachTiltAll } from '../hooks/tilt'
import './ProofSection.css'

gsap.registerPlugin(ScrollTrigger)

function CountUp({ end, prefix = '', suffix = '', decimals = 0 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const hasRun = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasRun.current) {
          hasRun.current = true
          const start = performance.now()
          const step = (now) => {
            const p = Math.min((now - start) / 2000, 1)
            const eased = 1 - Math.pow(1 - p, 4)
            setCount(eased * end)
            if (p < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end])

  const display = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()
  return <span ref={ref}>{prefix}{display}{suffix}</span>
}

const groups = [
  {
    heading: 'The audience',
    stats: [
      { value: 3.5,  prefix: '',  suffix: 'B+', label: 'monthly users on TikTok alone',                                          decimals: 1 },
      { value: 200,  prefix: '',  suffix: 'B+', label: 'views per day on YouTube Shorts',                                        decimals: 0 },
      { value: 140,  prefix: '',  suffix: 'B+', label: 'daily Reels plays',                                                      decimals: 0 },
      { value: 74,   prefix: '',  suffix: '%',  label: 'of Shorts views come from non-subscribers — pure discovery',             decimals: 0 },
    ],
  },
  {
    heading: 'Products',
    stats: [
      { value: 78,   prefix: '',  suffix: '%',  label: 'of consumers prefer short-form video for product discovery',             decimals: 0 },
      { value: 60,   prefix: '',  suffix: '%',  label: 'of TikTok Shop sales driven by short-form video',                        decimals: 0 },
      { value: 112,  prefix: '$', suffix: 'B',  label: 'projected TikTok Shop sales in 2026',                                    decimals: 0 },
      { value: 49,   prefix: '',  suffix: '%',  label: 'of Gen Z find their next purchase on TikTok',                            decimals: 0 },
    ],
  },
  {
    heading: 'Music & film',
    stats: [
      { value: 84,   prefix: '',  suffix: '%',  label: 'of charting hit songs go viral on short-form first',                     decimals: 0 },
      { value: 75,   prefix: '',  suffix: '%',  label: 'of TikTok users discover new music there',                               decimals: 0 },
      { value: 77,   prefix: '',  suffix: '%',  label: 'who see a film/TV clip on social go on to watch the full thing',         decimals: 0 },
      { value: 87,   prefix: '',  suffix: '%',  label: 'of 16–24s have started a show or film after seeing clips',               decimals: 0 },
    ],
  },
]

export default function ProofSection() {
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const groupRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', end: 'top 55%', scrub: 1 },
        y: 30, opacity: 0,
      })

      groupRefs.current.forEach((el) => {
        if (!el) return
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 58%', scrub: 1 },
          y: 35, opacity: 0,
        })
      })
    }, sectionRef)

    const detachTilt = attachTiltAll(
      sectionRef.current.querySelectorAll('.proof__stat-card'),
      { max: 6, lift: -2 }
    )
    return () => { ctx.revert(); detachTilt() }
  }, [])

  return (
    <section ref={sectionRef} className="proof" id="proof">
      <div className="proof__inner">
        <div ref={headerRef} className="proof__header">
          <span className="section-label">The feed is where everything gets found now</span>
          <h2 className="section-title">
            Numbers that explain<br />
            <span className="accent">why short-form works.</span>
          </h2>
        </div>

        {groups.map((group, gi) => (
          <div key={gi} ref={(el) => (groupRefs.current[gi] = el)} className="proof__group">
            <h3 className="proof__group-heading">{group.heading}</h3>
            <div className="proof__stats">
              {group.stats.map((stat, si) => (
                <div key={si} className="proof__stat-card">
                  <span className="proof__stat-number">
                    <CountUp
                      end={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </span>
                  <span className="proof__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
