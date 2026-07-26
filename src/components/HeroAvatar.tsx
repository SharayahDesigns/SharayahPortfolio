import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Center, Html, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

type HeroAvatarProps = {
  reducedMotion: boolean
}

type StaticHeroModelProps = {
  path: string
  targetPosition: [number, number, number]
  baseRotation: [number, number, number]
  reducedMotion: boolean
  scaleMultiplier?: number
  entrance?: {
    fromX: number
    delay: number
    duration: number
  }
}

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
  entrance,
}: StaticHeroModelProps) {
  const group = useRef<THREE.Group>(null)
  const { scene } = useGLTF(path)
  const modelScene = useMemo(() => scene.clone(true), [scene])
  const scale = useMemo(() => {
    const box = new THREE.Box3().setFromObject(modelScene)
    const size = new THREE.Vector3()
    box.getSize(size)

    const normalized = size.y > 0 ? 2.95 / size.y : 1.35
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

    group.current.position.x = THREE.MathUtils.lerp(startX, targetPosition[0], eased)
    group.current.position.y = targetPosition[1]
    group.current.position.z = targetPosition[2]

    const targetRotX = reducedMotion ? baseRotation[0] : THREE.MathUtils.lerp(group.current.rotation.x, baseRotation[0] + state.pointer.y * 0.08, 0.06)
    const pointerRotY = reducedMotion ? baseRotation[1] : baseRotation[1] + state.pointer.x * 0.2
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
            targetPosition={[0, 0, 0]}
            baseRotation={[-0.04, 0.14, 0]}
            reducedMotion={reducedMotion}
          />
          <StaticHeroModel
            path={DOG_MODEL_PATH}
            targetPosition={[.98, -.80, .40]}
            baseRotation={[0, -0.08, 0]}
            reducedMotion={reducedMotion}
            scaleMultiplier={0.6}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

useGLTF.preload(HERO_MODEL_PATH)
useGLTF.preload(DOG_MODEL_PATH)
