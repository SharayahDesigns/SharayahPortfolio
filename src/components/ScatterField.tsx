import { useEffect, useRef, useState } from 'react'

/**
 * A GitHub contribution grid that lifts and settles as the pointer passes over
 * it: quantised green cells with GitHub's cell-to-gap proportion and corner
 * radius, at rest until disturbed. Ported from the pixel motif on
 * sharayahwebsitedesigns.com (components/HeroScatter.tsx there), re-palletted and
 * made placeable rather than hero-specific.
 *
 * PROGRESSIVE ENHANCEMENT - read before editing:
 * The element this returns is the same `<span>` the CSS checkerboard motif
 * paints, so the decoration is there on first paint. WebGL layers on top only
 * after `three` loads and a context is confirmed, at which point `is-gl` hides
 * the checkerboard. Reduced-motion, a failed context, or a chunk that never
 * arrives all degrade to the CSS motif rather than an empty box - and each of
 * those paths logs a reason in dev through `bail()`.
 *
 * `three` arrives via a dynamic import inside the effect. It is already in the
 * bundle for the home page's 3D avatar, but that is a separate lazy chunk; this
 * keeps the résumé route from paying for it before first paint either.
 *
 * MOTION MODEL
 * Every cell is a damped spring anchored at z = 0. Input only ever adds velocity,
 * never sets position - that is why the settle reads as physical rather than
 * eased, and why overlapping ripples add instead of fighting.
 *
 *   pointer (fine pointers)  -> continuous impulse near the cursor
 *   scroll  (touch + mouse)  -> a sweeping wave, so phones get the effect too
 *
 * SIZING
 * The grid is not a fixed cell count. It measures its own frame by raycasting the
 * four viewport corners onto the z = 0 plane, then lays out however many cells fit
 * at a constant world-space pitch. That keeps squares square in any container -
 * necessary here, because the résumé banner is a wide, short band on desktop and
 * closer to square on a phone.
 *
 * PERFORMANCE
 * One InstancedMesh, one draw call, no lights or post-processing. `mesh.count` is
 * clamped to the cells actually in use, so a small container does not pay for the
 * capacity a large one needs. The loop stops completely when the host leaves the
 * viewport or the tab hides.
 */

/**
 * GitHub's dark-theme contribution levels, brightest first. Four discrete steps,
 * not a gradient - that quantisation is most of what makes a contribution graph
 * recognisable, so cells snap to one of these rather than interpolating between
 * them (see `pickLevel`).
 *
 * Keep in sync with the `.scatter-field::before` ramp in styles.css.
 */
const LEVELS = ['#39d353', '#26a641', '#006d32', '#0e4429'] as const

/**
 * Spread of the random level offset, in level steps. The frame position sets the
 * average brightness (denser at the top, fading down into the section) and this
 * scatters neighbours around it.
 *
 * At 0 the field reads as four hard horizontal bands. Much above 2 the vertical
 * dissolve stops being legible and it reads as uniform noise. ~1.7 puts most
 * cells within one level of their neighbours, which is roughly how a real
 * contribution graph looks.
 */
const LEVEL_JITTER = 1.7

/**
 * Corner radius as a fraction of the square's edge. GitHub's cells are 11px with
 * a 2px radius, so ~0.18. Applied as a signed-distance mask in the fragment
 * shader rather than by rounding the geometry - one plane, no extra triangles.
 */
const CORNER = 0.18

/**
 * Instance capacity. Cells are allocated once at this size and `mesh.count` is
 * clamped to what a given frame actually needs. Higher than the source's 2400
 * because this host is a wide band rather than a near-square panel: a 3:1 frame
 * needs roughly 2900 cells at pitch 1, and falling short only coarsens the grid
 * (see `buildGrid`) rather than clipping it.
 */
const MAX_INSTANCES = 3200

/**
 * Camera framing. `TILT_DEG` is the angle between the view direction and the
 * grid's normal: 0 looks straight down at the plane, larger is more oblique.
 *
 * Hard limit: TILT_DEG + FOV/2 must stay well under 90, or the rays through the
 * top of the frame run parallel to the plane and never intersect it.
 */
const FOV = 45
const TILT_DEG = 34
const CAM_DIST = 22

/** Distance between cell centres, in world units. */
const PITCH = 1
/** Square edge as a fraction of pitch; the remainder is the gap. GitHub's grid
    is an 11px cell on a 14px pitch, so 0.78. */
const FILL = 0.78

/**
 * Spring constants. Stiffness sets the pitch of the bounce, damping how many
 * wobbles before rest. The pairing matters more than either number: the damping
 * ratio here is 0.67, giving one gentle overshoot then rest. Retune both
 * together and keep the ratio near 0.65-0.7.
 */
const STIFFNESS = 74
const DAMPING = 11.5

/** Ceiling on travel, as a multiple of pitch. Caps runaway overlapping input. */
const MAX_LIFT = 2.4

/**
 * Impulse strength, in velocity per second at the centre of the cursor's reach.
 * If the effect ever feels dead, raise this first.
 */
const POINTER_IMPULSE = 260
const SCROLL_IMPULSE = 180

/** Cursor influence radius, as a multiple of pitch. */
const REACH = 3.4

/**
 * Per-instance alpha at rest and the extra alpha a fully-lifted cell gains.
 * Must sum to <= 1.
 *
 * Why alpha and not brightness: fading a cell by scaling its colour toward black
 * only reads as transparent over an opaque backdrop. This canvas is `alpha: true`
 * cleared to 0, so a "faded" cell would land at rgb=0, a=1 - an opaque black
 * square over the page. Fading has to move alpha, which for an InstancedMesh
 * means a custom attribute (see `aFade`).
 */
const REST_ALPHA = 0.58
const LIFT_ALPHA = 0.42

/** How far a fully-lifted cell shifts toward white, so the ripple reads. */
const LIFT_LIGHTEN = 0.3

/**
 * Directional edge fade, in normalised device coords (-1 = left/bottom of frame,
 * +1 = right/top). Each pair is (frame edge, where the fade finishes).
 *
 * Why this lives here and not in a CSS mask: a single `radial-gradient` is an
 * ellipse, so it cannot fade the left edge and the top edge by different
 * amounts, and compositing two mask layers needs `mask-composite`, whose
 * fallback behaviour is union - an opaque slab. The scene already knows where
 * every cell sits in the frame, so it fades per-direction and the CSS mask is
 * switched off entirely under `is-gl`.
 *
 * LEFT is aggressive because the name and contact copy sit there. TOP is
 * aggressive so the field appears to begin below the fixed nav rather than
 * butting into it.
 */
const FADE_LEFT: [number, number] = [-1.0, 0.02]
const FADE_TOP: [number, number] = [1.0, 0.22]
const FADE_BOTTOM: [number, number] = [-1.0, -0.5]
/** Right edge meets the viewport edge, so it only needs a token softening. */
const FADE_RIGHT: [number, number] = [1.06, 0.9]

/**
 * How far the grid extends past the visible frame, as a multiple of the measured
 * extent. Must be generous: the grid's outermost cells form a hard rectangular
 * boundary, and if that boundary lands inside the frame you see it as a line no
 * amount of fading will hide.
 */
const OVERSCAN = 1.45

const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1)
  return t * t * (3 - 2 * t)
}

const bail = (reason: string, err?: unknown) => {
  if (import.meta.env.DEV) {
    console.warn(`[ScatterField] 3D disabled: ${reason}. Falling back to the CSS motif.`, err ?? '')
  }
}

type ScatterFieldProps = {
  /** Extra class on the host, for per-placement sizing and opacity. */
  className?: string
}

export default function ScatterField({ className = '' }: ScatterFieldProps) {
  const hostRef = useRef<HTMLSpanElement>(null)
  const [gl, setGl] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      bail('the browser or OS requests reduced motion')
      return
    }

    let cancelled = false
    let teardown: (() => void) | undefined

    void (async () => {
      let THREE: typeof import('three')
      try {
        THREE = await import('three')
      } catch (err) {
        bail("could not load 'three'", err)
        return
      }
      if (cancelled) return

      let renderer: import('three').WebGLRenderer
      try {
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: 'low-power',
        })
      } catch (err) {
        bail('this browser would not give up a WebGL context', err)
        return
      }

      if (!host.clientWidth || !host.clientHeight) {
        bail(`host measured ${host.clientWidth}x${host.clientHeight}`)
        renderer.dispose()
        return
      }

      let w = host.clientWidth
      let h = host.clientHeight
      const canvas = renderer.domElement

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(w, h, false)
      renderer.setClearAlpha(0)
      host.appendChild(canvas)

      const scene = new THREE.Scene()

      // The grid stays flat at z = 0 in world space and the CAMERA is tilted
      // instead. Two reasons: pointer picking becomes a ray/plane intersection
      // with no inverse transform, and a lift along +z still reads as "up" on
      // screen because the view is oblique.
      const camera = new THREE.PerspectiveCamera(FOV, w / h, 0.1, 600)
      // Guarded so a future edit to TILT_DEG cannot push the top of the frustum
      // parallel to the grid plane, which would break extent measurement.
      const tilt = THREE.MathUtils.degToRad(Math.min(TILT_DEG, 88 - FOV / 2 - 6))
      camera.position.set(0, -Math.sin(tilt) * CAM_DIST, Math.cos(tilt) * CAM_DIST)
      camera.lookAt(0, 0, 0)
      camera.updateMatrixWorld()

      const levels = LEVELS.map((hex) => new THREE.Color(hex))
      /**
       * Snap a frame position to one of the discrete contribution levels, with a
       * random offset so neighbours differ. `t` runs 0 at the top of the field to
       * 1 at the bottom, so level 0 (brightest) clusters at the top.
       */
      const pickLevel = (t: number) => {
        const jittered = t * (levels.length - 1) + (Math.random() - 0.5) * LEVEL_JITTER
        const i = Math.round(Math.min(Math.max(jittered, 0), levels.length - 1))
        return levels[i]
      }

      // Unit geometry; per-instance scale carries the real size, so pitch can
      // change on resize without rebuilding buffers.
      const geometry = new THREE.PlaneGeometry(1, 1)

      /**
       * Per-instance opacity. `InstancedMesh` gives us a matrix and a colour per
       * instance but no alpha, so it comes in as a custom instanced attribute and
       * gets multiplied into `diffuseColor.a` with a two-line shader patch.
       */
      const fade = new THREE.InstancedBufferAttribute(new Float32Array(MAX_INSTANCES), 1)
      fade.setUsage(THREE.DynamicDrawUsage)
      geometry.setAttribute('aFade', fade)

      const material = new THREE.MeshBasicMaterial({
        transparent: true,
        // Normal rather than additive blending: on a transparent canvas normal
        // blending lets alpha 0 mean genuinely invisible, which is what the edge
        // fade needs.
        blending: THREE.NormalBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      })
      material.onBeforeCompile = (shader) => {
        const V = '#include <begin_vertex>'
        const F = '#include <color_fragment>'
        // If three ever renames these chunks, `replace` becomes a silent no-op,
        // alpha stays 1, and every faded cell renders as a solid square. That is
        // the exact bug this attribute exists to fix, so fail loudly instead.
        if (import.meta.env.DEV) {
          if (!shader.vertexShader.includes(V) || !shader.fragmentShader.includes(F)) {
            console.error(
              '[ScatterField] shader patch target missing. Per-instance alpha is ' +
                'not being applied, so edge cells will render opaque. Check the ' +
                'MeshBasicMaterial chunk names for this version of three.',
            )
          }
        }
        // `uv` is declared unconditionally for every built-in shader, so passing
        // it along in our own varying avoids depending on three's USE_UV plumbing
        // (which is only switched on when a material actually samples a map).
        shader.vertexShader =
          'attribute float aFade;\nvarying float vFade;\nvarying vec2 vCell;\n' +
          shader.vertexShader.replace(V, `${V}\n\tvFade = aFade;\n\tvCell = uv;`)
        // Rounded corners, GitHub-style, as a signed distance to a rounded square:
        // inset the half-extents by the radius, take the distance to that box, and
        // subtract the radius back off. `fwidth` gives one pixel of antialiasing at
        // whatever size the cell happens to be drawn (core in GLSL ES 3.0, which
        // three targets).
        shader.fragmentShader =
          `varying float vFade;\nvarying vec2 vCell;\nconst float CORNER = ${CORNER.toFixed(3)};\n` +
          shader.fragmentShader.replace(
            F,
            `${F}
	vec2 q = abs(vCell - 0.5) - (0.5 - CORNER);
	float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - CORNER;
	float aa = max(fwidth(d), 1e-5);
	diffuseColor.a *= vFade * (1.0 - smoothstep(-aa, aa, d));`,
          )
      }

      const mesh = new THREE.InstancedMesh(geometry, material, MAX_INSTANCES)
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      mesh.frustumCulled = false
      scene.add(mesh)

      const raycaster = new THREE.Raycaster()
      const gridPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
      const ndc = new THREE.Vector2()
      const hit = new THREE.Vector3()
      const proj = new THREE.Vector3()

      type Cell = {
        x: number
        y: number
        z: number
        vz: number
        base: import('three').Color
        /** Directional frame fade, 0 at the frame edges. Computed in NDC. */
        edge: number
        phase: number
      }

      let cells: Cell[] = []
      let pitch = PITCH

      /**
       * Bounding extent of the z = 0 plane visible to the camera, found by
       * raycasting the four NDC corners. With an oblique camera the visible
       * region is a trapezoid, so this returns its bounding box - slightly
       * generous, which is what we want for coverage.
       */
      const measureExtent = () => {
        const pts: import('three').Vector3[] = []
        for (const [cx, cy] of [
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ] as const) {
          ndc.set(cx, cy)
          raycaster.setFromCamera(ndc, camera)
          if (raycaster.ray.intersectPlane(gridPlane, hit)) pts.push(hit.clone())
        }
        if (pts.length < 4) {
          // A corner ray parallel to or facing away from the plane. Should not
          // happen at this tilt, but guessing beats rendering nothing.
          return { w: 26, h: 20, cx: 0, cy: 0 }
        }
        const xs = pts.map((p) => p.x)
        const ys = pts.map((p) => p.y)
        const minX = Math.min(...xs)
        const maxX = Math.max(...xs)
        const minY = Math.min(...ys)
        const maxY = Math.max(...ys)
        return {
          w: maxX - minX,
          h: maxY - minY,
          cx: (minX + maxX) / 2,
          cy: (minY + maxY) / 2,
        }
      }

      const buildGrid = () => {
        camera.updateMatrixWorld()
        const ext = measureExtent()
        // Overshoot hard: the grid's outer boundary must sit outside the frame,
        // because a hard rectangle of squares inside it reads as a line.
        const spanW = ext.w * OVERSCAN
        const spanH = ext.h * OVERSCAN

        pitch = PITCH
        let cols = Math.ceil(spanW / pitch) + 1
        let rows = Math.ceil(spanH / pitch) + 1
        // Coarsen rather than clip if the container is enormous.
        while (cols * rows > MAX_INSTANCES) {
          pitch *= 1.1
          cols = Math.ceil(spanW / pitch) + 1
          rows = Math.ceil(spanH / pitch) + 1
        }

        const gridW = (cols - 1) * pitch
        const gridH = (rows - 1) * pitch

        cells = []
        // Row order is load-bearing. Instances render in index order with no
        // depth sorting, and alpha blending needs back-to-front. Because the
        // camera sits below and in front, higher y is farther away - so pushing
        // row 0 (top) first happens to give exactly the right order. Reverse this
        // loop and lifted squares will blend wrongly against their neighbours.
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const nx = cols > 1 ? c / (cols - 1) : 0.5
            const ny = rows > 1 ? r / (rows - 1) : 0.5
            const x = ext.cx - gridW / 2 + c * pitch
            const y = ext.cy + gridH / 2 - r * pitch

            // Mostly vertical with a slight lean, matching the 152deg ramp on
            // the CSS fallback.
            const t = ny * 0.85 + nx * 0.15

            // Project the cell's rest position into the frame, then fade per
            // direction. Projection rather than arithmetic on world x/y because
            // the camera is oblique: world-x maps to screen-x differently at the
            // far edge than the near one, and a linear guess leaves a wedge of
            // un-faded cells in the top corners.
            proj.set(x, y, 0).project(camera)
            const edge =
              smoothstep(FADE_LEFT[0], FADE_LEFT[1], proj.x) *
              smoothstep(FADE_RIGHT[0], FADE_RIGHT[1], proj.x) *
              smoothstep(FADE_TOP[0], FADE_TOP[1], proj.y) *
              smoothstep(FADE_BOTTOM[0], FADE_BOTTOM[1], proj.y)

            cells.push({
              x,
              y,
              z: 0,
              vz: 0,
              base: pickLevel(t).clone(),
              edge,
              phase: Math.random() * Math.PI * 2,
            })
          }
        }
        mesh.count = cells.length
      }

      buildGrid()

      // ---- input -------------------------------------------------------
      /** Cursor position in grid space, or null when the pointer is elsewhere. */
      let pointer: { x: number; y: number } | null = null

      const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches

      const onPointerMove = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect()
        // Generous margin: the motif is faded at the edges, so reacting only
        // inside the exact box would feel like hitting an invisible wall.
        const pad = 140
        if (
          e.clientX < rect.left - pad ||
          e.clientX > rect.right + pad ||
          e.clientY < rect.top - pad ||
          e.clientY > rect.bottom + pad
        ) {
          pointer = null
          return
        }
        ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(ndc, camera)
        if (raycaster.ray.intersectPlane(gridPlane, hit)) {
          pointer = { x: hit.x, y: hit.y }
        }
      }
      const onPointerLeave = () => {
        pointer = null
      }

      if (finePointer) {
        window.addEventListener('pointermove', onPointerMove, { passive: true })
        document.addEventListener('pointerleave', onPointerLeave)
      }

      // Scroll wave. This is what gives touch devices the effect, and it also
      // fires on desktop so the grid acknowledges the page moving.
      let waveY: number | null = null
      let waveDir = -1
      let waveStrength = 0
      let lastScroll = window.scrollY
      let scrollQueued = false

      const onScroll = () => {
        if (scrollQueued) return
        scrollQueued = true
        requestAnimationFrame(() => {
          scrollQueued = false
          const dy = window.scrollY - lastScroll
          lastScroll = window.scrollY
          if (Math.abs(dy) < 1) return
          const ext = measureExtent()
          // Enter from the edge the scroll came from and sweep across.
          waveY = dy > 0 ? ext.cy + ext.h / 2 + 3 * pitch : ext.cy - ext.h / 2 - 3 * pitch
          waveDir = dy > 0 ? -1 : 1
          waveStrength = Math.min(Math.abs(dy) / 26, 1)
        })
      }
      window.addEventListener('scroll', onScroll, { passive: true })

      // ---- frame -------------------------------------------------------
      const m4 = new THREE.Matrix4()
      const quat = new THREE.Quaternion()
      const axis = new THREE.Vector3(0.35, 0.6, 0.72).normalize()
      const pos = new THREE.Vector3()
      const scl = new THREE.Vector3()
      const col = new THREE.Color()
      const WHITE = new THREE.Color(0xffffff)

      const step = (dt: number, t: number) => {
        // Everything below scales with pitch so the feel survives a resize that
        // coarsens the grid.
        const reach = REACH * pitch
        const reachSq = reach * reach
        const maxLift = MAX_LIFT * pitch
        const cellSize = pitch * FILL
        const waveBand = 2.6 * pitch

        if (waveY !== null) {
          waveY += waveDir * 34 * pitch * dt
          const ext = 40 * pitch
          if (Math.abs(waveY) > ext) waveY = null
        }

        for (let i = 0; i < cells.length; i++) {
          const cell = cells[i]

          // --- impulses: input only ever adds velocity ---
          if (pointer) {
            const dx = cell.x - pointer.x
            const dy = cell.y - pointer.y
            const dSq = dx * dx + dy * dy
            if (dSq < reachSq) {
              // Squared falloff so the centre is decisively stronger than the
              // rim and the ripple has a clear focus.
              const f = 1 - dSq / reachSq
              cell.vz += f * f * POINTER_IMPULSE * pitch * dt
            }
          }

          if (waveY !== null) {
            const dy = Math.abs(cell.y - waveY)
            if (dy < waveBand) {
              const f = 1 - dy / waveBand
              cell.vz += f * f * waveStrength * SCROLL_IMPULSE * pitch * dt
            }
          }

          // --- damped spring back to the grid plane ---
          cell.vz += (-STIFFNESS * cell.z - DAMPING * cell.vz) * dt
          cell.z += cell.vz * dt

          if (cell.z > maxLift) {
            cell.z = maxLift
            if (cell.vz > 0) cell.vz = 0
          }

          // Barely-there idle breath, so an untouched grid is not a corpse.
          const idle = Math.sin(t * 0.9 + cell.phase) * 0.035 * pitch

          const lift = cell.z + idle
          const norm = Math.max(0, Math.min(cell.z / maxLift, 1))

          pos.set(cell.x, cell.y + lift * 0.34, lift)
          // Tumble scales with height: at rest the grid is perfectly square.
          quat.setFromAxisAngle(axis, norm * 0.7)
          scl.setScalar(cellSize * (1 + norm * 0.3))
          m4.compose(pos, quat, scl)
          mesh.setMatrixAt(i, m4)

          // Colour keeps full saturation and only shifts toward white on lift.
          // Brightness does no fading here - alpha does.
          col.copy(cell.base).lerp(WHITE, norm * LIFT_LIGHTEN)
          mesh.setColorAt(i, col)

          // The frame fade and the lift both land here. A cell at the frame edge
          // has edge = 0, so alpha = 0, so it is invisible rather than black.
          fade.setX(i, cell.edge * (REST_ALPHA + norm * LIFT_ALPHA))
        }

        mesh.instanceMatrix.needsUpdate = true
        fade.needsUpdate = true
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
        renderer.render(scene, camera)
      }

      // ---- loop control -------------------------------------------------
      let raf = 0
      let last = performance.now()
      let visible = true
      let onScreen = true

      const frame = (now: number) => {
        // Clamped so a backgrounded tab returning does not fire every spring at
        // once with one enormous dt.
        const dt = Math.min((now - last) / 1000, 1 / 30)
        last = now
        step(dt, now / 1000)
        raf = requestAnimationFrame(frame)
      }

      const start = () => {
        if (raf || !visible || !onScreen) return
        last = performance.now()
        raf = requestAnimationFrame(frame)
      }
      const stop = () => {
        if (!raf) return
        cancelAnimationFrame(raf)
        raf = 0
      }

      const io = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting
          if (onScreen) start()
          else stop()
        },
        { rootMargin: '80px' },
      )
      io.observe(host)

      const onVisibility = () => {
        visible = document.visibilityState === 'visible'
        if (visible) start()
        else stop()
      }
      document.addEventListener('visibilitychange', onVisibility)

      const ro = new ResizeObserver(() => {
        const nw = host.clientWidth || 1
        const nh = host.clientHeight || 1
        if (nw === w && nh === h) return
        w = nw
        h = nh
        camera.aspect = w / h
        camera.updateProjectionMatrix()
        renderer.setSize(w, h, false)
        // Re-lay the grid: a new aspect needs a different cell count to keep
        // squares square and the frame covered.
        buildGrid()
      })
      ro.observe(host)

      step(0, 0)
      setGl(true)
      start()

      teardown = () => {
        stop()
        io.disconnect()
        ro.disconnect()
        document.removeEventListener('visibilitychange', onVisibility)
        window.removeEventListener('scroll', onScroll)
        if (finePointer) {
          window.removeEventListener('pointermove', onPointerMove)
          document.removeEventListener('pointerleave', onPointerLeave)
        }
        geometry.dispose()
        material.dispose()
        mesh.dispose()
        renderer.dispose()
        canvas.remove()
      }
    })()

    return () => {
      cancelled = true
      teardown?.()
    }
  }, [])

  return (
    <span
      ref={hostRef}
      className={`scatter-field${className ? ` ${className}` : ''}${gl ? ' is-gl' : ''}`}
      aria-hidden="true"
    />
  )
}
