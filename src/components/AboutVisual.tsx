import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { MotionValue } from 'framer-motion'

/**
 * One form, four states. Each trait card in the About section maps to a shape
 * and an accent colour; hovering or focusing a card morphs the object. The
 * solid half and the wireframe half are the same geometry rendered twice and
 * clipped against opposite planes — design on one side, structure on the other.
 */

export type AboutVisualProps = {
  activeIndex: number
  scrollProgress: MotionValue<number>
  reducedMotion: boolean
  paused: boolean
}

const ACCENTS = ['#00ffc6', '#4dc9ff', '#ffb84d', '#00d97e']

const MORPH_DURATION = 0.62

function createGeometries() {
  return [
    new THREE.IcosahedronGeometry(1.32, 1),
    new THREE.TorusKnotGeometry(0.82, 0.29, 160, 24),
    new THREE.OctahedronGeometry(1.5, 0),
    new THREE.DodecahedronGeometry(1.3, 0),
  ]
}

function MorphingForm({ activeIndex, scrollProgress, reducedMotion }: Omit<AboutVisualProps, 'paused'>) {
  const group = useRef<THREE.Group>(null)
  const accentLight = useRef<THREE.PointLight>(null)
  const rimLight = useRef<THREE.DirectionalLight>(null)
  const solidMaterial = useRef<THREE.MeshStandardMaterial>(null)
  const wireMaterial = useRef<THREE.MeshBasicMaterial>(null)
  const [shownIndex, setShownIndex] = useState(activeIndex)
  const morph = useRef(1)
  const accentColor = useRef(new THREE.Color(ACCENTS[activeIndex] ?? ACCENTS[0]))

  const geometries = useMemo(createGeometries, [])
  useEffect(() => () => geometries.forEach((g) => g.dispose()), [geometries])

  const clipSolid = useMemo(() => new THREE.Plane(new THREE.Vector3(1, 0, 0), 0), [])
  const clipWire = useMemo(() => new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0), [])

  useFrame((state, delta) => {
    if (!group.current) return

    // Collapse, swap geometry at the midpoint, expand.
    if (shownIndex !== activeIndex && morph.current >= 1) morph.current = 0
    if (morph.current < 1) {
      morph.current = Math.min(1, morph.current + delta / MORPH_DURATION)
      if (morph.current >= 0.5 && shownIndex !== activeIndex) setShownIndex(activeIndex)
    }

    const collapse = Math.sin(morph.current * Math.PI)
    const progress = scrollProgress.get()
    const idle = reducedMotion ? 0 : state.clock.elapsedTime * 0.16

    group.current.scale.setScalar(1 - collapse * 0.82)
    group.current.rotation.y = idle + progress * Math.PI * 1.4 + collapse * Math.PI * 0.9
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      reducedMotion ? 0.2 : 0.2 + state.pointer.y * 0.22,
      0.05,
    )
    group.current.position.y = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.9) * 0.07

    accentColor.current.lerp(new THREE.Color(ACCENTS[activeIndex] ?? ACCENTS[0]), 0.06)
    if (accentLight.current) accentLight.current.color.copy(accentColor.current)
    if (rimLight.current) rimLight.current.color.copy(accentColor.current)
    if (wireMaterial.current) wireMaterial.current.color.copy(accentColor.current)
    if (solidMaterial.current) solidMaterial.current.emissive.copy(accentColor.current)
  })

  const geometry = geometries[shownIndex] ?? geometries[0]

  return (
    <>
      <ambientLight intensity={0.9} />
      {/* key on the solid half so its facets read against the dark page */}
      <directionalLight position={[4.5, 3.5, 4]} intensity={2.4} color="#eef2ff" />
      <directionalLight ref={rimLight} position={[3.5, -2, -3]} intensity={2.2} color={ACCENTS[0]} />
      <pointLight ref={accentLight} position={[-3, 1.5, 3]} intensity={26} distance={14} color={ACCENTS[0]} />

      <group ref={group}>
        <mesh geometry={geometry}>
          <meshStandardMaterial
            ref={solidMaterial}
            color="#2a2a3d"
            roughness={0.26}
            metalness={0.62}
            emissive={ACCENTS[0]}
            emissiveIntensity={0.09}
            clippingPlanes={[clipSolid]}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh geometry={geometry}>
          <meshBasicMaterial
            ref={wireMaterial}
            color={ACCENTS[0]}
            wireframe
            transparent
            opacity={0.55}
            clippingPlanes={[clipWire]}
          />
        </mesh>
      </group>
    </>
  )
}

export default function AboutVisual({ activeIndex, scrollProgress, reducedMotion, paused }: AboutVisualProps) {
  return (
    <Canvas
      className="about-visual-canvas"
      camera={{ position: [0, 0, 5.1], fov: 42 }}
      dpr={[1, 1.5]}
      frameloop={paused ? 'demand' : 'always'}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true
      }}
    >
      <MorphingForm activeIndex={activeIndex} scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
    </Canvas>
  )
}
