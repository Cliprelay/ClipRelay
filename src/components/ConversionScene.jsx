import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ConversionScene.css'

gsap.registerPlugin(ScrollTrigger)

const funnelStages = [
  { label: 'Views', icon: '▶', width: 100 },
  { label: 'Profile visits', icon: '👤', width: 62 },
  { label: 'Link clicks', icon: '🔗', width: 28 },
]

export default function ConversionScene() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const pathRef = useRef(null)
  const glowPathRef = useRef(null)
  const stagesRef = useRef([])
  const barsRef = useRef([])
  const endRef = useRef(null)
  const particlesRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', end: 'top 40%', scrub: 1 },
        y: 40, opacity: 0,
      })

      // SVG path draw on scroll
      if (pathRef.current) {
        const pathLength = pathRef.current.getTotalLength()
        gsap.set(pathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength })
        gsap.set(glowPathRef.current, { strokeDasharray: pathLength, strokeDashoffset: pathLength })

        gsap.to([pathRef.current, glowPathRef.current], {
          strokeDashoffset: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 40%',
            end: 'bottom 60%',
            scrub: 1,
          },
          ease: 'none',
        })
      }

      // Funnel stages stagger in + proportional bars grow
      stagesRef.current.forEach((stage, i) => {
        gsap.from(stage, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top ${45 - i * 12}%`,
            end: `top ${25 - i * 12}%`,
            scrub: 1,
          },
          y: 40,
          opacity: 0,
          scale: 0.85,
        })
      })

      barsRef.current.forEach((bar, i) => {
        if (!bar) return
        gsap.fromTo(bar,
          { scaleX: 0 },
          {
            scaleX: 1,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: `top ${42 - i * 12}%`,
              end: `top ${22 - i * 12}%`,
              scrub: 1,
            },
            ease: 'power2.out',
          }
        )
      })

      // Particles along path
      particlesRef.current.forEach((particle, i) => {
        gsap.from(particle, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: `top ${50 - i * 8}%`,
            end: `top ${30 - i * 8}%`,
            scrub: 1,
          },
          opacity: 0, scale: 0,
        })
      })

      // End CTA
      gsap.from(endRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 10%', end: 'bottom 70%', scrub: 1 },
        y: 30, opacity: 0,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="conversion" id="conversion">
      <div className="conversion__inner">
        <div ref={headingRef} className="conversion__header">
          <span className="conversion__label">How a view becomes a click</span>
          <h2 className="conversion__title">
            From feed to <span className="conversion__title--accent">action.</span>
          </h2>
        </div>

        <div className="conversion__funnel">
          {/* SVG flow path */}
          <svg className="conversion__svg" viewBox="0 0 1000 200" preserveAspectRatio="none">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Glow layer */}
            <path
              ref={glowPathRef}
              d="M 50 100 C 200 100 250 40 400 60 C 550 80 600 140 750 100 C 850 75 900 100 950 100"
              fill="none"
              stroke="rgba(76, 175, 80, 0.3)"
              strokeWidth="6"
              filter="url(#glow)"
            />
            {/* Main path */}
            <path
              ref={pathRef}
              d="M 50 100 C 200 100 250 40 400 60 C 550 80 600 140 750 100 C 850 75 900 100 950 100"
              fill="none"
              stroke="var(--green-glow)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Particle dots along the path */}
          <div className="conversion__particles">
            {[15, 30, 45, 58, 72, 85].map((left, i) => (
              <div
                key={i}
                ref={(el) => (particlesRef.current[i] = el)}
                className="conversion__particle"
                style={{ left: `${left}%` }}
              />
            ))}
          </div>

          {/* Stage cards — proportional funnel bars, no numbers */}
          <div className="conversion__stages">
            {funnelStages.map((stage, i) => (
              <div
                key={i}
                ref={(el) => (stagesRef.current[i] = el)}
                className="conversion__stage"
              >
                <div className="conversion__stage-icon">{stage.icon}</div>
                <div className="conversion__stage-bar-wrap">
                  <div
                    ref={(el) => (barsRef.current[i] = el)}
                    className="conversion__stage-bar"
                    style={{ '--bar-width': `${stage.width}%` }}
                  />
                </div>
                <div className="conversion__stage-label">{stage.label}</div>
                {i < funnelStages.length - 1 && (
                  <div className="conversion__stage-arrow">→</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div ref={endRef} className="conversion__end">
          <div className="conversion__end-line" />
          <p className="conversion__end-text">Traffic that converts.</p>
        </div>
      </div>
    </section>
  )
}
