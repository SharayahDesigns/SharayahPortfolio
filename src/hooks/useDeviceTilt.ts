import { useCallback, useEffect, useRef, useState } from 'react'

export type Tilt = { x: number; y: number }
export type DeviceTiltPermission = 'idle' | 'granted' | 'denied' | 'unsupported'
export type DeviceTiltResult = {
  tilt: React.MutableRefObject<Tilt>
  permission: DeviceTiltPermission
  requestPermission: () => Promise<void>
  canRequestPermission: boolean
}

/** Degrees of tilt that map to the full -1..1 range. */
const RANGE_DEG = 26
/** Low-pass factor. Raw gyro output is noisy enough to visibly jitter a model. */
const SMOOTHING = 0.12

function clamp(v: number) {
  return Math.max(-1, Math.min(1, v))
}

/**
 * Normalised phone tilt, in the same -1..1 shape as R3F's `state.pointer`, so
 * the hero can treat "user tilted the phone" and "user moved the mouse" as the
 * same input.
 *
 * Returns a ref rather than state on purpose: the frame loop reads this every
 * frame, and re-rendering React 60 times a second to carry two floats would be
 * far more expensive than the effect it drives.
 *
 * iOS 13+ gates the sensor behind `requestPermission()`, which only resolves
 * when called from a user gesture, so on those devices the tilt stays at zero
 * until the visitor's first tap, and stays at zero for good if they decline.
 * Android and desktop Chrome need no permission but do require a secure
 * context, so this is inert on plain http (localhost excepted).
 */
export function useDeviceTilt(enabled: boolean): DeviceTiltResult {
  const tilt = useRef<Tilt>({ x: 0, y: 0 })
  const [permission, setPermission] = useState<DeviceTiltPermission>('idle')
  const [canRequestPermission, setCanRequestPermission] = useState(false)

  const requestPermission = useCallback(async () => {
    if (!enabled || typeof window === 'undefined') return
    if (!('DeviceOrientationEvent' in window)) {
      setPermission('unsupported')
      return
    }

    const request = (
      window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<PermissionState>
      }
    ).requestPermission

    if (typeof request !== 'function') {
      setPermission('granted')
      return
    }

    try {
      const result = await request()
      setPermission(result === 'granted' ? 'granted' : 'denied')
    } catch {
      setPermission('denied')
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return
    if (!('DeviceOrientationEvent' in window)) {
      setPermission('unsupported')
      return
    }

    // Only where there is a real accelerometer behind a touch screen. A desktop
    // that reports orientation would otherwise fight the pointer parallax.
    if (!window.matchMedia('(pointer: coarse)').matches) {
      setPermission('unsupported')
      return
    }

    let baseline: { beta: number; gamma: number } | null = null
    let detach: (() => void) | undefined

    const onOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event
      if (beta == null || gamma == null) return

      // First reading becomes neutral. A phone is typically held at 50-70
      // degrees of beta, so treating 0 as level would slam the model to one
      // extreme and hold it there.
      if (!baseline) {
        baseline = { beta, gamma }
        return
      }

      const targetX = clamp((gamma - baseline.gamma) / RANGE_DEG)
      const targetY = clamp((beta - baseline.beta) / RANGE_DEG)

      tilt.current.x += (targetX - tilt.current.x) * SMOOTHING
      tilt.current.y += (targetY - tilt.current.y) * SMOOTHING
    }

    const attach = () => {
      window.addEventListener('deviceorientation', onOrientation)
      detach = () => window.removeEventListener('deviceorientation', onOrientation)
    }

    const request = (
      window.DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<PermissionState>
      }
    ).requestPermission

    if (typeof request === 'function') {
      setCanRequestPermission(true)
      if (permission !== 'granted') {
        return () => detach?.()
      }
      attach()
      return () => detach?.()
    }

    setCanRequestPermission(false)
    setPermission('granted')
    attach()
    return () => detach?.()
  }, [enabled, permission])

  return { tilt, permission, requestPermission, canRequestPermission }
}
