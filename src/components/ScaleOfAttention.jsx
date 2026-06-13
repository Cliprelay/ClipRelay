import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './ScaleOfAttention.css'

gsap.registerPlugin(ScrollTrigger)

/* ── Live-ticking counter (for the hero 5.2B number) ── */
function LiveCounter({ end, suffix = '', prefix = '', decimals = 0, speed = 50 }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const increment = end / (3000 / speed)
          intervalRef.current = setInterval(() => {
            setValue((prev) => {
              const next = prev + increment + (Math.random() * increment * 0.5)
              if (next >= end) {
                clearInterval(intervalRef.current)
                return end
              }
              return next
            })
          }, speed)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => {
      observer.disconnect()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [end, speed])

  const display = decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString()

  return (
    <span ref={ref} className="live-counter">
      {prefix}{display}{suffix}
    </span>
  )
}

/* ── Count-up stat (for the discovery grid) ── */
function CountUpStat({ value, suffix = '', prefix = '', decimals = 0 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const startTime = performance.now()
          const duration = 2200
          const step = (currentTime) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 4)
            setCount(eased * value)
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  const display = decimals > 0
    ? count.toFixed(decimals)
    : Math.floor(count).toLocaleString()

  return (
    <span ref={ref} className="scale__stat-number">
      {prefix}{display}{suffix}
    </span>
  )
}

/* ── Floating icon ── */
function FloatingIcon({ icon, delay, side }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const startX = side === 'left' ? -60 : 60
    gsap.set(el, { x: startX, opacity: 0, scale: 0.5 })

    const tl = gsap.timeline({ repeat: -1, delay })
    tl.to(el, { y: -80, opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' })
      .to(el, { y: -160, opacity: 0, scale: 0.3, duration: 0.8, ease: 'power2.in' })
      .set(el, { y: 0 })

    return () => tl.kill()
  }, [delay, side])

  return (
    <span ref={ref} className={`floating-icon floating-icon--${side}`}>
      {icon}
    </span>
  )
}

/* ── Discovery stats data ── */
const discoveryStats = [
  // Music
  { value: 84, suffix: '%', label: 'of charting hit songs go viral on short-form first', group: 'music' },
  { value: 75, suffix: '%', label: 'of TikTok users discover new music on the platform', group: 'music' },
  // Film & TV
  { value: 77, suffix: '%', label: 'of people who see a TV/film clip on social go on to watch the full thing', group: 'film' },
  { value: 87, suffix: '%', label: 'of 16–24s have started a full show or film after seeing clips or memes', group: 'film' },
  // Products & commerce
  { value: 46, suffix: '%', label: 'of consumers say short-form video impacts their purchase decisions', group: 'products' },
  // Scale
  { value: 3.5, suffix: 'B', label: 'monthly users on TikTok alone', decimals: 1, group: 'scale' },
  { value: 200, suffix: 'B+', label: 'short-form views every single day on YouTube Shorts', group: 'scale' },
  { value: 74, suffix: '%', label: "of Shorts views come from people who don't already follow — pure discovery", group: 'scale' },
]

export default function ScaleOfAttention() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const bigNumberRef = useRef(null)
  const sublineRef = useRef(null)
  const statsGridRef = useRef(null)
  const captionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Pin the section for dramatic effect
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: true,
      })

      // Staggered reveals
      gsap.from(headingRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', end: 'top 20%', scrub: 1 },
        y: 40, opacity: 0,
      })

      gsap.from(bigNumberRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 50%', end: 'top 10%', scrub: 1 },
        scale: 0.6, opacity: 0,
      })

      gsap.from(sublineRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 45%', end: 'top 10%', scrub: 1 },
        y: 20, opacity: 0,
      })

      // Stat cards stagger in
      const cards = statsGridRef.current?.children
      if (cards) {
        gsap.from(cards, {
          scrollTrigger: { trigger: sectionRef.current, start: 'top 40%', end: 'top 0%', scrub: 1 },
          y: 50, opacity: 0, stagger: 0.08, scale: 0.9,
        })
      }

      gsap.from(captionRef.current, {
        scrollTrigger: { trigger: sectionRef.current, start: 'top 25%', end: 'top 0%', scrub: 1 },
        y: 20, opacity: 0,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="scale" id="scale">
      <div className="scale__inner">
        <span ref={headingRef} className="scale__label">The scale of attention</span>

        <div ref={bigNumberRef} className="scale__big-number">
          <div className="scale__big-number-icons">
            <FloatingIcon icon="❤️" delay={0} side="left" />
            <FloatingIcon icon="▶" delay={0.6} side="left" />
            <FloatingIcon icon="🔥" delay={1.2} side="right" />
            <FloatingIcon icon="❤️" delay={1.8} side="right" />
            <FloatingIcon icon="▶" delay={2.4} side="left" />
            <FloatingIcon icon="💬" delay={0.9} side="right" />
          </div>
          <div className="scale__number-value">
            <LiveCounter end={5.2} suffix="B" decimals={1} speed={40} />
          </div>
          <div className="scale__number-label">
            people watch short-form video daily
          </div>
        </div>

        <p ref={sublineRef} className="scale__subline">
          Music, products, films — it all gets discovered on the feed now.
        </p>

        {/* ── Discovery stats grid ── */}
        <div ref={statsGridRef} className="scale__stats-grid">
          {discoveryStats.map((stat, i) => (
            <div key={i} className={`scale__stat-card scale__stat-card--${stat.group}`}>
              <CountUpStat
                value={stat.value}
                suffix={stat.suffix}
                decimals={stat.decimals || 0}
              />
              <span className="scale__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <p ref={captionRef} className="scale__caption">
          This is what a single clip can do when it hits the right feeds.
          Now multiply it across thousands of creators.
        </p>
      </div>
    </section>
  )
}
