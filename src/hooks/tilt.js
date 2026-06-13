import gsap from 'gsap'

/**
 * Attaches a smooth 3D tilt-toward-cursor effect to an element.
 * Returns a cleanup function. No-ops on touch devices to keep mobile fast.
 */
export function attachTilt(el, { max = 7, perspective = 900, lift = -4 } = {}) {
  if (!el || window.matchMedia('(hover: none)').matches) return () => {}

  const onMove = (e) => {
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    gsap.to(el, {
      rotateY: px * max,
      rotateX: -py * max,
      y: lift,
      transformPerspective: perspective,
      duration: 0.45,
      ease: 'power2.out',
    })
  }

  const onLeave = () => {
    gsap.to(el, { rotateX: 0, rotateY: 0, y: 0, duration: 0.7, ease: 'power3.out' })
  }

  el.addEventListener('mousemove', onMove)
  el.addEventListener('mouseleave', onLeave)
  return () => {
    el.removeEventListener('mousemove', onMove)
    el.removeEventListener('mouseleave', onLeave)
  }
}

/** Attaches tilt to a list of elements; returns one combined cleanup. */
export function attachTiltAll(els, opts) {
  const cleanups = [...els].filter(Boolean).map((el) => attachTilt(el, opts))
  return () => cleanups.forEach((fn) => fn())
}
