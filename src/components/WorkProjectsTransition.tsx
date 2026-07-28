import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Projects from './Projects'

const WORK_IMAGE_TEXT = "Sharayah's Awesome\nProjects!"
const WORK_IMAGE_LABEL = "Sharayah's Awesome Projects!"
const TYPE_MS = 38

export default function WorkProjectsTransition() {
  const prefersReduced = useReducedMotion() ?? false
  const typedCount = useMotionValue(0)
  const typedText = useTransform(typedCount, (v) => WORK_IMAGE_TEXT.slice(0, Math.round(v)))
  const transitionRef = useRef<HTMLElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: transitionRef,
    offset: ['start end', 'end start'],
  })

  const shellHeight = prefersReduced ? 'auto' : '440vh'
  const sceneScale = useTransform(scrollYProgress, [0, 0.2, 0.66], [1, 1, 13.85])
  const sceneY = useTransform(scrollYProgress, [0, 0.2, 0.66], ['0vh', '0vh', '-390vh'])
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.72, 0.84], [1, 1, 0.08])
  const imageBlur = useTransform(scrollYProgress, [0, 0.66, 0.84], ['0px', '0px', '12px'])
  const irisClipPath = useTransform(
    scrollYProgress,
    [0, 0.68, 0.8, 0.86],
    [
      'circle(0% at 60% 20%)',
      'circle(0% at 60% 20%)',
      'circle(26% at 60% 20%)',
      'circle(160% at 60% 20%)',
    ],
  )
  const irisRingOpacity = useTransform(scrollYProgress, [0.68, 0.76, 0.84, 0.9], [0, 1, 0.35, 0])
  const previewOpacity = useTransform(scrollYProgress, [0.68, 0.78, 0.86], [0, 1, 1])

  useEffect(() => {
    if (prefersReduced) {
      typedCount.set(WORK_IMAGE_TEXT.length)
      return
    }

    typedCount.set(0)
    let i = 0
    let tick = 0
    const start = window.setTimeout(() => {
      tick = window.setInterval(() => {
        i += 1
        typedCount.set(i)
        if (i >= WORK_IMAGE_TEXT.length) {
          window.clearInterval(tick)
        }
      }, TYPE_MS)
    }, 250)

    return () => {
      window.clearTimeout(start)
      window.clearInterval(tick)
    }
  }, [prefersReduced, typedCount])

  if (prefersReduced) {
    return (
      <>
        <section className="section work-image-section" aria-label="Workspace image">
            <div className="container">
            <div className="work-image-shell">
              <div className="work-image-stage">
                <p className="work-image-typed" aria-label={WORK_IMAGE_LABEL}>
                  <span className="work-image-typed-ghost" aria-hidden="true">{WORK_IMAGE_TEXT}</span>
                  <span className="work-image-typed-live" aria-hidden="true">
                    <motion.span>{typedText}</motion.span>
                  </span>
                </p>
              </div>
              <img
                className="work-image-figure"
                src="/images/computer2.webp"
                alt="Workspace setup showing computer-based design and development work"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>
        <Projects />
      </>
    )
  }

  return (
    <>
      <section className="work-projects-transition" ref={transitionRef} aria-label="Workspace to selected work transition">
        <div className="work-projects-transition__track" style={{ height: shellHeight }}>
          <div className="work-projects-transition__sticky">
            <motion.div
              className="work-projects-transition__scene"
              style={{ scale: sceneScale, y: sceneY, opacity: sceneOpacity }}
            >
              <div className="container">
                <div className="work-image-shell">
                  <div className="work-image-stage">
                    <p className="work-image-typed" aria-label={WORK_IMAGE_LABEL}>
                      <span className="work-image-typed-ghost" aria-hidden="true">{WORK_IMAGE_TEXT}</span>
                      <span className="work-image-typed-live" aria-hidden="true">
                        <motion.span>{typedText}</motion.span>
                        <span className="hero-caret work-image-caret" />
                      </span>
                    </p>
                  </div>
                  <motion.img
                    className="work-image-figure"
                    src="/images/computer2.webp"
                    alt="Workspace setup showing computer-based design and development work"
                    loading="lazy"
                    decoding="async"
                    style={{ filter: imageBlur }}
                  />
                </div>
              </div>
            </motion.div>
            <motion.div
              className="work-projects-transition__preview"
              style={{ clipPath: irisClipPath, opacity: previewOpacity }}
              aria-hidden="true"
            >
              <motion.div className="work-projects-transition__preview-inner">
                <div className="work-projects-transition__preview-copy">
                  <motion.div
                    className="work-projects-transition__preview-ring"
                    style={{ opacity: irisRingOpacity }}
                  />
                  <p className="section-label">Selected Work</p>
                  <h2 className="section-title">
                    Products I've designed
                    <br />
                    <span className="teal">and engineered</span>
                  </h2>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      <Projects showIntro={false} />
    </>
  )
}
