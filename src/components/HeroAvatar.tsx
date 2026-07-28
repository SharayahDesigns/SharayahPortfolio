import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, Html, useGLTF } from '@react-three/drei'
import { Smartphone } from 'lucide-react'
import * as THREE from 'three'
import { useDeviceTilt, type Tilt } from '../hooks/useDeviceTilt'

type HeroAvatarProps = {
  reducedMotion: boolean
}

type StaticHeroModelProps = {
  path: string
  targetPosition: [number, number, number]
  baseRotation: [number, number, number]
  reducedMotion: boolean
  scaleMultiplier?: number
  /** Phone tilt, already normalised to the same -1..1 shape as `state.pointer`. */
  tilt?: React.MutableRefObject<Tilt>
  /** Depth multiplier — the models drift by different amounts so they separate. */
  parallax?: number
  entrance?: {
    fromX: number
    delay: number
    duration: number
  }
}

/** World units of drift at full tilt. Small: this should read as weight, not slide. */
const SWAY_X = 0.2
const SWAY_Y = 0.13

function clampUnit(value: number) {
  return Math.max(-1, Math.min(1, value))
}

/** World-space height every model is normalised to before its multiplier. */
const HERO_MODEL_HEIGHT = 3.55

const HERO_MODEL_PATH = '/models/codingChick.glb'
const DOG_MODEL_PATH = '/models/Meshy_AI_Snowy_Shepherd_with_B_0725220024_texture.glb'

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3)
}

function StaticHeroModel({
  path,
  targetPosition,
  baseRotation,
  reducedMotion,
  scaleMultiplier = 1,
  tilt,
  parallax = 1,
  entrance,
}: StaticHeroModelProps) {
  const group = useRef<THREE.Group>(null)
  const { scene } = useGLTF(path)
  const modelScene = useMemo(() => scene.clone(true), [scene])
  const scale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(modelScene)
    const size = new THREE.Vector3()
    box.getSize(size)

    const normalized = size.y > 0 ? HERO_MODEL_HEIGHT / size.y : 1.35
    return normalized * scaleMultiplier
  }, [modelScene, scaleMultiplier])

  useFrame((state) => {
    if (!group.current) return

    const elapsed = state.clock.elapsedTime
    let progress = 1

    if (entrance && !reducedMotion) {
      progress = THREE.MathUtils.clamp((elapsed - entrance.delay) / entrance.duration, 0, 1)
    }

    const eased = reducedMotion ? 1 : easeOutCubic(progress)
    const startX = entrance ? entrance.fromX : targetPosition[0]

    // Tilt is additive rather than a separate mode: it sits at zero on anything
    // without a gyroscope, so a mouse behaves exactly as it did before.
    const tiltX = tilt?.current.x ?? 0
    const tiltY = tilt?.current.y ?? 0
    const inputX = reducedMotion ? 0 : clampUnit(state.pointer.x + tiltX)
    const inputY = reducedMotion ? 0 : clampUnit(state.pointer.y + tiltY)

    // Only the sensor translates the models. Tilting the phone should feel like
    // tipping a box — they slide toward whichever edge is lowest — while a mouse
    // keeps its lighter rotation-only response.
    const swayX = reducedMotion ? 0 : tiltX * SWAY_X * parallax
    const swayY = reducedMotion ? 0 : -tiltY * SWAY_Y * parallax

    group.current.position.x = THREE.MathUtils.lerp(startX, targetPosition[0], eased) + swayX
    group.current.position.y = targetPosition[1] + swayY
    group.current.position.z = targetPosition[2]

    const targetRotX = reducedMotion ? baseRotation[0] : THREE.MathUtils.lerp(group.current.rotation.x, baseRotation[0] + inputY * 0.08, 0.06)
    const pointerRotY = reducedMotion ? baseRotation[1] : baseRotation[1] + inputX * 0.2
    const entranceRotY = entrance && !reducedMotion
      ? THREE.MathUtils.lerp(baseRotation[1] + 0.45, pointerRotY, eased)
      : pointerRotY

    group.current.rotation.x = targetRotX
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, entranceRotY, 0.08)
    group.current.rotation.z = baseRotation[2]
  })

  return (
    <group ref={group} position={targetPosition} rotation={baseRotation} scale={scale}>
      <Center position={[0, -0.1, 0]}>
        <primitive object={modelScene} />
      </Center>
    </group>
  )
}

function AvatarFallback() {
  return (
    <Html center>
      <div className="hero-avatar-loading">Loading 3D Models</div>
    </Html>
  )
}

export default function HeroAvatar({ reducedMotion }: HeroAvatarProps) {
  const {
    tilt,
    permission,
    requestPermission,
    canRequestPermission,
  } = useDeviceTilt(!reducedMotion)

  return (
    <div className="hero-avatar-canvas">
      <Canvas camera={{ position: [0, 0.45, 11.2], fov: 27 }} dpr={[1, 1.75]}>
        <ambientLight intensity={1.9} />
        <directionalLight position={[4, 6, 5]} intensity={2.6} color="#fff6e8" />
        <directionalLight position={[-3, 2, 4]} intensity={1.1} color="#86d8ff" />
        <spotLight position={[0, 5, 3]} intensity={1.4} angle={0.38} penumbra={0.9} color="#c7fff1" />
        <Suspense fallback={<AvatarFallback />}>
          <StaticHeroModel
            path={HERO_MODEL_PATH}
            targetPosition={[0, 0.2, 0]}
            baseRotation={[-0.04, 0.14, 0]}
            reducedMotion={reducedMotion}
            tilt={tilt}
          />
          <StaticHeroModel
            path={DOG_MODEL_PATH}
            targetPosition={[1.02, -0.58, 0.4]}
            baseRotation={[0, -0.08, 0]}
            reducedMotion={reducedMotion}
            scaleMultiplier={0.6}
            tilt={tilt}
            /* nearer the camera, so it drifts further and the pair separates */
            parallax={1.5}
          />
        </Suspense>
      </Canvas>
      {canRequestPermission && permission !== 'granted' && (
        <button
          type="button"
          className="hero-tilt-button"
          onClick={() => {
            void requestPermission()
          }}
        >
          <Smartphone size={14} />
          {permission === 'denied' ? 'Tilt Access Blocked' : 'Enable Tilt Motion'}
        </button>
      )}
    </div>
  )
}

useGLTF.preload(HERO_MODEL_PATH)
useGLTF.preload(DOG_MODEL_PATH)
