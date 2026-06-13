import { useEffect, useRef, useState } from 'react'

export default function AnimatedCounter({ end, suffix = '', prefix = '', duration = 2000, decimals = 0 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const startTime = performance.now()
          const step = (currentTime) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 4)
            setCount(eased * end)
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])

  const formatted = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString()

  return (
    <span ref={ref} className="animated-counter">
      {prefix}{formatted}{suffix}
    </span>
  )
}
