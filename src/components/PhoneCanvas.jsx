import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Environment } from '@react-three/drei'
import * as THREE from 'three'
import './PhoneCanvas.css'

/*
 * Realistic flagship phone — 9:19.5 ratio
 * Body: 2.0 × 4.33, depth 0.18, corner radius 0.24
 * Thin uniform bezels: 0.06 → screen 1.88 × 4.21
 */
const BW = 2.0, BH = 4.33, BD = 0.18, BR = 0.24, BZ = 0.06
const SW = BW - BZ * 2, SH = BH - BZ * 2
const Z_FRONT = BD / 2  // front face z

/* ─────────────────────────────────────────────────────────────
   Phone screen content — tasteful short-form video mockup
   Animated progress bar, soft play indicator, gradient content
   ───────────────────────────────────────────────────────────── */
function ScreenContent({ time }) {
  const progressRef = useRef()
  const contentRef = useRef()

  useFrame(() => {
    if (!progressRef.current) return
    // Looping progress bar: 0→1 over 6 seconds
    const progress = (time.current % 6) / 6
    progressRef.current.scale.x = progress
    progressRef.current.position.x = -(SW * 0.42) * (1 - progress)

    // Subtle content color shift (simulates video)
    if (contentRef.current) {
      const hue = (time.current * 0.02) % 1
      contentRef.current.material.emissive.setHSL(hue, 0.3, 0.08)
    }
  })

  return (
    <group position={[0, 0, Z_FRONT + 0.004]}>
      {/* Video content area — subtle shifting gradient */}
      <mesh ref={contentRef}>
        <planeGeometry args={[SW - 0.04, SH - 0.04]} />
        <meshStandardMaterial
          color="#0c0c0c"
          emissive="#1B5E20"
          emissiveIntensity={0.08}
          roughness={0.2}
        />
      </mesh>

      {/* Soft centered play indicator (circle + triangle) */}
      <group position={[0, 0.2, 0.001]}>
        {/* Circle bg */}
        <mesh>
          <circleGeometry args={[0.22, 32]} />
          <meshStandardMaterial color="white" transparent opacity={0.08} />
        </mesh>
        {/* Triangle play icon */}
        <mesh position={[0.03, 0, 0.001]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.09, 0.12, 3]} />
          <meshStandardMaterial color="white" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* Bottom UI bar area */}
      <group position={[0, -(SH / 2 - 0.16), 0.001]}>
        {/* Progress track */}
        <mesh>
          <planeGeometry args={[SW * 0.84, 0.02]} />
          <meshStandardMaterial color="white" transparent opacity={0.1} />
        </mesh>
        {/* Green progress fill */}
        <mesh ref={progressRef} position={[0, 0, 0.001]}>
          <planeGeometry args={[SW * 0.84, 0.02]} />
          <meshStandardMaterial color="#1B5E20" emissive="#1B5E20" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Creator handle placeholder — bottom left */}
      <mesh position={[-(SW / 2 - 0.42), -(SH / 2 - 0.35), 0.001]}>
        <planeGeometry args={[0.55, 0.035]} />
        <meshStandardMaterial color="white" transparent opacity={0.15} />
      </mesh>

      {/* Right-side engagement icons (heart, comment, share) */}
      {[0.3, 0, -0.3].map((y, i) => (
        <mesh key={i} position={[SW / 2 - 0.16, y - 0.5, 0.001]}>
          <circleGeometry args={[0.06, 16]} />
          <meshStandardMaterial
            color={i === 0 ? '#ff3366' : 'white'}
            transparent
            opacity={i === 0 ? 0.25 : 0.12}
          />
        </mesh>
      ))}
    </group>
  )
}

/* ─────────────────────────────────────────────────────────────
   Phone model — clean realistic flagship
   ───────────────────────────────────────────────────────────── */
function PhoneModel({ visibility }) {
  const group = useRef()
  const glowRef = useRef()
  const rimRef = useRef()
  const timeRef = useRef(0)

  useFrame((state) => {
    if (!group.current) return
    const t = state.clock.elapsedTime
    timeRef.current = t
    const v = visibility.current  // 0 = hidden, 1 = fully visible

    if (v <= 0.001) {
      group.current.visible = false
      return
    }
    group.current.visible = true

    // Entrance from bottom-right, tilted, settling upright at right side
    // v: 0 → 1 (in), stays at 1, then 1 → 0 (out)
    const eased = 1 - Math.pow(1 - Math.min(v, 1), 3)

    // Position: start off-screen bottom-right → settle at right of center
    const targetX = 2.6
    const targetY = 0
    const x = targetX + (1 - eased) * 3    // slides in from further right
    const y = targetY + (1 - eased) * -4    // slides up from below
    const rotY = -0.2 + (1 - eased) * -0.5  // tilts in
    const rotX = 0.05 + (1 - eased) * 0.15
    const rotZ = (1 - eased) * 0.1
    const scale = eased * 0.95

    // Gentle idle float
    const idleY = Math.sin(t * 0.45) * 0.03 * eased
    const idleRot = Math.sin(t * 0.3) * 0.006 * eased

    // Smooth lerp
    const lr = 0.06
    group.current.position.x += (x - group.current.position.x) * lr
    group.current.position.y += (y + idleY - group.current.position.y) * lr
    group.current.rotation.x += (rotX - group.current.rotation.x) * lr
    group.current.rotation.y += (rotY - group.current.rotation.y) * lr
    group.current.rotation.z += (rotZ + idleRot - group.current.rotation.z) * lr
    const s = group.current.scale.x + (scale - group.current.scale.x) * lr
    group.current.scale.setScalar(Math.max(0.001, s))

    // Rim light + glow follow visibility
    if (rimRef.current) rimRef.current.intensity = eased * (0.5 + Math.sin(t * 0.7) * 0.12)
    if (glowRef.current) glowRef.current.material.opacity = eased * 0.06
  })

  return (
    <group ref={group} visible={false} scale={[0.001, 0.001, 0.001]}>
      {/* Green rim lights */}
      <pointLight ref={rimRef} position={[-1.6, 0.5, -0.6]} intensity={0} color="#1B5E20" distance={6} />
      <pointLight position={[1.6, -0.4, -0.6]} intensity={0.2} color="#1B5E20" distance={5} />

      {/* ── Body — matte space-grey aluminium ── */}
      <RoundedBox args={[BW, BH, BD]} radius={BR} smoothness={10}>
        <meshPhysicalMaterial
          color="#2a2a2c"
          metalness={0.82}
          roughness={0.38}
          envMapIntensity={1.0}
        />
      </RoundedBox>

      {/* ── Glass front panel ── */}
      <mesh position={[0, 0, Z_FRONT + 0.001]}>
        <planeGeometry args={[BW - 0.01, BH - 0.01]} />
        <meshPhysicalMaterial
          color="#080808"
          metalness={0}
          roughness={0.04}
          clearcoat={1}
          clearcoatRoughness={0.02}
          envMapIntensity={1.8}
          reflectivity={0.95}
          transparent
          opacity={0.96}
        />
      </mesh>

      {/* ── Screen ── */}
      <mesh position={[0, 0, Z_FRONT + 0.003]}>
        <planeGeometry args={[SW, SH]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.12} />
      </mesh>

      {/* ── Screen content (video mockup) ── */}
      <ScreenContent time={timeRef} />

      {/* ── Front camera — single subtle dot ── */}
      <mesh position={[0, SH / 2 - 0.12, Z_FRONT + 0.005]}>
        <circleGeometry args={[0.035, 24]} />
        <meshStandardMaterial color="#111" metalness={0.4} roughness={0.2} />
      </mesh>
      <mesh position={[0, SH / 2 - 0.12, Z_FRONT + 0.0055]}>
        <ringGeometry args={[0.035, 0.048, 24]} />
        <meshStandardMaterial color="#2a2a2c" metalness={0.7} roughness={0.15} />
      </mesh>

      {/* ── Side buttons ── */}
      {/* Power — right */}
      <mesh position={[BW / 2 + 0.01, 0.3, 0]}>
        <boxGeometry args={[0.018, 0.5, 0.055]} />
        <meshPhysicalMaterial color="#3a3a3c" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Volume — left */}
      <mesh position={[-(BW / 2 + 0.01), 0.5, 0]}>
        <boxGeometry args={[0.018, 0.24, 0.055]} />
        <meshPhysicalMaterial color="#3a3a3c" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[-(BW / 2 + 0.01), 0.05, 0]}>
        <boxGeometry args={[0.018, 0.24, 0.055]} />
        <meshPhysicalMaterial color="#3a3a3c" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* ── Green glow behind phone ── */}
      <mesh ref={glowRef} position={[0, 0, -0.5]}>
        <planeGeometry args={[4, 6.5]} />
        <meshStandardMaterial
          color="#1B5E20"
          emissive="#1B5E20"
          emissiveIntensity={1.5}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

/* ── Particles (only visible when phone is) ─────────────── */
function Particles({ count = 40, visibility }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 3
    }
    return arr
  }, [count])

  useFrame((state) => {
    if (!ref.current) return
    ref.current.material.opacity = Math.min(visibility.current, 1) * 0.35
    ref.current.rotation.y = state.clock.elapsedTime * 0.01
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#1B5E20" transparent opacity={0} sizeAttenuation />
    </points>
  )
}

/* ─────────────────────────────────────────────────────────────
   Canvas wrapper
   Phone is hidden by default. Visibility is driven by #scale
   section position: enters as section scrolls in, exits as
   section scrolls out. Does NOT appear in any other section.
   ───────────────────────────────────────────────────────────── */
export default function PhoneCanvas() {
  const visibility = useRef(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const onScroll = () => {
      const el = document.getElementById('scale')
      if (!el) return

      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight

      // ── Entrance: section top crosses from bottom of viewport to 20% from top
      const enterStart = vh          // top of section at bottom of screen
      const enterEnd = vh * 0.2      // top of section near top of screen

      // ── Exit: section bottom crosses from bottom of viewport to off-screen above
      const exitStart = vh * 0.5     // bottom of section at mid-screen
      const exitEnd = -rect.height * 0.2  // well past the section

      if (rect.top >= enterStart) {
        // Section hasn't reached viewport yet
        visibility.current = 0
      } else if (rect.top > enterEnd && rect.bottom > vh * 0.5) {
        // Entering
        visibility.current = 1 - (rect.top - enterEnd) / (enterStart - enterEnd)
      } else if (rect.bottom > vh * 0.5) {
        // Fully visible (section is in view)
        visibility.current = 1
      } else if (rect.bottom > 0) {
        // Exiting — bottom of section leaving viewport
        visibility.current = Math.max(0, rect.bottom / (vh * 0.5))
      } else {
        // Section is above viewport
        visibility.current = 0
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  if (isMobile) return <MobilePhoneFallback />

  return (
    <div className="phone-canvas">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[4, 4, 5]} intensity={0.6} />
        <directionalLight position={[-3, -1, 3]} intensity={0.12} color="#1B5E20" />
        <spotLight position={[0, 5, 6]} angle={0.25} penumbra={1} intensity={0.3} />

        <PhoneModel visibility={visibility} />
        <Particles count={40} visibility={visibility} />

        <Environment preset="city" environmentIntensity={0.18} />
      </Canvas>
    </div>
  )
}

/* ── Mobile: CSS phone, fades in/out with #scale only ──── */
function MobilePhoneFallback() {
  const ref = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById('scale')
      if (!el || !ref.current) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight

      if (rect.top < vh && rect.bottom > 0) {
        const enterP = Math.min(1, Math.max(0, 1 - rect.top / vh))
        const exitP = Math.min(1, Math.max(0, rect.bottom / (vh * 0.5)))
        const v = Math.min(enterP, exitP)
        ref.current.style.opacity = v * 0.45
        ref.current.style.transform = `translateY(-50%) translateX(${(1 - v) * 30}px)`
      } else {
        ref.current.style.opacity = 0
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={ref} className="phone-canvas-mobile">
      <div className="phone-mobile">
        <div className="phone-mobile__screen">
          <div className="phone-mobile__play" />
          <div className="phone-mobile__progress" />
        </div>
        <div className="phone-mobile__camera" />
      </div>
    </div>
  )
}
