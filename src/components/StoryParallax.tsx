import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { portfolioData } from '../data/portfolio'

/**
 * Lag parallax, same mechanism as mountain.learnframer.site: every layer
 * translates *down* by `lag × scrolled`, so a layer's apparent speed is
 * `1 - lag`. Lag 1 holds a layer still in the viewport; lag 0 lets it scroll
 * away with the page.
 *
 * The headline lags most, so it hangs in place while the range and the figure
 * climb past and swallow it. Because the range paints above the copy
 * (z-index 3 vs 2), the peaks occlude the type rather than sliding under it —
 * that overtake is the whole effect.
 *
 * Relative climb against the headline, per pixel scrolled:
 *   range  0.92 - 0.35 = 0.57    figure  0.92 - 0.20 = 0.72
 */
const LAG = {
  sky: 0.95,
  copy: 0.92,
  range: 0.35,
  figure: 0.2,
} as const

const MOBILE_LAG = {
  sky: 0.78,
  copy: 0.74,
  range: 0.28,
  figure: 0.16,
} as const

export default function StoryParallax() {
  const stageRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion() ?? false
  const [stageH, setStageH] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const { story } = portfolioData

  // Drift amounts are a share of the stage height, so they need it in px —
  // Motion's percentage `y` resolves against the *element*, and each layer is
  // a different size.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setStageH(entry.contentRect.height))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // 0 as the section's top reaches the viewport top, 1 as its bottom does — so
  // progress spans exactly one stage-height of scroll and the layers sit at
  // their base composition while the section is still rising into view.
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end start'],
  })

  // Mobile browsers tend to deliver scroll updates in coarse bursts, which
  // makes direct layer mapping look jittery. Spring the progress there and
  // soften the lag so the scene still moves, just without the shake.
  const smoothedProgress = useSpring(scrollYProgress, isMobile
    ? { stiffness: 90, damping: 26, mass: 0.34 }
    : { stiffness: 220, damping: 34, mass: 0.2 })
  const progress = isMobile ? smoothedProgress : scrollYProgress
  const lag = isMobile ? MOBILE_LAG : LAG

  const skyY = useTransform(progress, (v) => v * lag.sky * stageH)
  const copyY = useTransform(progress, (v) => v * lag.copy * stageH)
  const rangeY = useTransform(progress, (v) => v * lag.range * stageH)
  const figureY = useTransform(progress, (v) => v * lag.figure * stageH)
  // Trails just behind the peaks. Without it the type survives the overtake as
  // stray slivers in the gaps between summits.
  const copyOpacity = useTransform(progress, isMobile ? [0.46, 0.66] : [0.4, 0.58], [1, 0])

  return (
    <section className="story" id="story" aria-labelledby="story-heading">
      <div className="story-stage" ref={stageRef}>
        {/* ---- Layer 1: sky (lags most → furthest away) ---- */}
        <motion.div
          className="story-sky"
          aria-hidden="true"
          style={reducedMotion ? undefined : { y: skyY }}
        >
          <img
            src={story.sky.src}
            alt=""
            width={story.sky.width}
            height={story.sky.height}
            loading="lazy"
            decoding="async"
          />
        </motion.div>

        {/* Hands the bright sky off to the dark section above it. Glued to the
            stage, not to a layer — it marks the section boundary. */}
        <div className="story-daybreak" aria-hidden="true" />

        {/* ---- Layer 2: the line. Nearly pinned, and painted *under* the range
                so the peaks climb over it. ---- */}
        <motion.div
          className="story-copy"
          style={reducedMotion ? undefined : { y: copyY, opacity: copyOpacity }}
        >
          <p className="story-eyebrow">{story.eyebrow}</p>
          <h2 className="story-heading" id="story-heading">
            {story.headingLead}{' '}
            <span className="story-heading-accent">{story.headingAccent}</span>
          </h2>
          <p className="story-body">{story.body}</p>
        </motion.div>

        {/* ---- Layer 3: the range. Cropped from the top so only the peaks
                break the skyline, and it climbs 0.57px per pixel scrolled. ---- */}
        <motion.div
          className="story-range"
          aria-hidden="true"
          style={reducedMotion ? undefined : { y: rangeY }}
        >
          <img
            src={story.range.src}
            alt=""
            width={story.range.width}
            height={story.range.height}
            loading="lazy"
            decoding="async"
          />
        </motion.div>

        {/* ---- Layer 4: the foreground (lags least → nearest) ---- */}
        <motion.div
          className="story-figure"
          style={reducedMotion ? undefined : { y: figureY }}
        >
          <img
            src={story.figure.src}
            alt={story.figure.alt}
            width={story.figure.width}
            height={story.figure.height}
            loading="lazy"
            decoding="async"
          />
        </motion.div>

        {/* Painted over the figure so the scene dissolves into Contact rather
            than ending on the cutout's cropped edge. */}
        <div className="story-floor" aria-hidden="true" />
      </div>
    </section>
  )
}
