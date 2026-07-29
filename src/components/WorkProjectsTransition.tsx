import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Projects from './Projects'

const WORK_IMAGE_TEXT = "const title =\n  \"Sharayah's Awesome Projects\";\nrender(title);"
const WORK_IMAGE_LABEL = "JavaScript snippet showing Sharayah's Awesome Projects"
const TYPE_MS = 38
const SCENE_HOLD_END = 0.28
const SCENE_ZOOM_END = 0.92
const PREVIEW_REVEAL_START = 0.68
const PREVIEW_REVEAL_MID = 0.86
const PREVIEW_FULLY_OPEN = 0.92
const PREVIEW_HOLD_END = 0.98
const REVERSE_RELEASE_POINT = 0.56
const PREVIEW_IRIS_ORIGIN = '50% 70%'

export default function WorkProjectsTransition() {
  const prefersReduced = useReducedMotion() ?? false
  const typedCount = useMotionValue(0)
  const typedText = useTransform(typedCount, (v) => WORK_IMAGE_TEXT.slice(0, Math.round(v)))
  const transitionRef = useRef<HTMLElement | null>(null)
  const scrollAnimationRef = useRef<number | null>(null)
  const buttonTransitionTimeoutRef = useRef<number | null>(null)
  const lastScrollProgressRef = useRef(0)
  const hasCompletedScrollTransitionRef = useRef(false)
  const [shellRef, shellInView] = useInView({ triggerOnce: true, threshold: 0.55 })
  const [buttonTransitionPhase, setButtonTransitionPhase] = useState<'idle' | 'opening' | 'closing'>('idle')
  const [isReverseLocked, setIsReverseLocked] = useState(false)
  const { scrollYProgress } = useScroll({
    target: transitionRef,
    offset: ['start end', 'end start'],
  })

  const shellHeight = prefersReduced ? 'auto' : '420vh'
  const sceneScale = useTransform(
    scrollYProgress,
    [0, SCENE_HOLD_END, PREVIEW_REVEAL_START, PREVIEW_FULLY_OPEN, PREVIEW_HOLD_END],
    [1, 1, 13.85, 13.85, 13.85],
  )
  const sceneY = useTransform(
    scrollYProgress,
    [0, SCENE_HOLD_END, PREVIEW_REVEAL_START, PREVIEW_FULLY_OPEN, PREVIEW_HOLD_END],
    ['0vh', '0vh', '-300vh', '-300vh', '-300vh'],
  )
  const sceneOpacity = useTransform(scrollYProgress, [0, 1], [1, 1])
  const imageBlur = useTransform(scrollYProgress, [0, SCENE_ZOOM_END, PREVIEW_HOLD_END], ['0px', '0px', '12px'])
  const irisClipPath = useTransform(
    scrollYProgress,
    [0, PREVIEW_REVEAL_START, PREVIEW_REVEAL_MID, PREVIEW_FULLY_OPEN, PREVIEW_HOLD_END],
    [
      `circle(0% at ${PREVIEW_IRIS_ORIGIN})`,
      `circle(0% at ${PREVIEW_IRIS_ORIGIN})`,
      `circle(26% at ${PREVIEW_IRIS_ORIGIN})`,
      `circle(190% at ${PREVIEW_IRIS_ORIGIN})`,
      `circle(190% at ${PREVIEW_IRIS_ORIGIN})`,
    ],
  )
  const irisRingOpacity = useTransform(
    scrollYProgress,
    [PREVIEW_REVEAL_START, 0.88, PREVIEW_FULLY_OPEN, PREVIEW_HOLD_END, 1],
    [0, 1, 0.35, 0.35, 0],
  )
  const previewOpacity = useTransform(
    scrollYProgress,
    [PREVIEW_REVEAL_START, PREVIEW_REVEAL_MID, PREVIEW_FULLY_OPEN, PREVIEW_HOLD_END, 1],
    [0, 1, 1, 1, 1],
  )

  const scrollToProjects = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const projectsSection = document.getElementById('projects')

    if (prefersReduced) {
      projectsSection?.scrollIntoView({ behavior: 'auto', block: 'start' })
      return
    }

    if (scrollAnimationRef.current != null) {
      window.cancelAnimationFrame(scrollAnimationRef.current)
      scrollAnimationRef.current = null
    }

    if (buttonTransitionTimeoutRef.current != null) {
      window.clearTimeout(buttonTransitionTimeoutRef.current)
      buttonTransitionTimeoutRef.current = null
    }

    if (!projectsSection || buttonTransitionPhase !== 'idle') return

    setButtonTransitionPhase('opening')
  }

  useEffect(() => {
    if (prefersReduced) {
      typedCount.set(WORK_IMAGE_TEXT.length)
      return
    }

    if (!shellInView) {
      typedCount.set(0)
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
  }, [prefersReduced, shellInView, typedCount])

  useEffect(() => () => {
    if (scrollAnimationRef.current != null) {
      window.cancelAnimationFrame(scrollAnimationRef.current)
    }
    if (buttonTransitionTimeoutRef.current != null) {
      window.clearTimeout(buttonTransitionTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (value) => {
      const previous = lastScrollProgressRef.current
      const movingUp = value < previous
      const movingDown = value > previous

      if (value >= PREVIEW_HOLD_END) {
        hasCompletedScrollTransitionRef.current = true
      }

      if (hasCompletedScrollTransitionRef.current && movingUp && value > SCENE_HOLD_END) {
        setIsReverseLocked(true)
      }

      if (value <= REVERSE_RELEASE_POINT || movingDown) {
        setIsReverseLocked(false)
      }

      lastScrollProgressRef.current = value
    })

    return unsubscribe
  }, [scrollYProgress])

  useEffect(() => {
    if (buttonTransitionPhase === 'idle') return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [buttonTransitionPhase])

  const sceneScaleStyle = isReverseLocked ? 13.85 : sceneScale
  const sceneYStyle = isReverseLocked ? '-300vh' : sceneY
  const sceneOpacityStyle = isReverseLocked ? 1 : sceneOpacity
  const imageBlurStyle = isReverseLocked ? '12px' : imageBlur
  const irisClipPathStyle = isReverseLocked ? `circle(190% at ${PREVIEW_IRIS_ORIGIN})` : irisClipPath
  const irisRingOpacityStyle = isReverseLocked ? 0.35 : irisRingOpacity
  const previewOpacityStyle = isReverseLocked ? 1 : previewOpacity

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
              <a href="#projects" className="work-image-cta" onClick={scrollToProjects}>View Projects</a>
            </div>
          </div>
        </section>
        <Projects />
      </>
    )
  }

  return (
    <>
      <AnimatePresence>
        {buttonTransitionPhase !== 'idle' ? (
          <motion.div
            key="work-projects-button-transition"
            className="work-projects-transition__button-overlay"
            initial={{ opacity: 1 }}
            animate={{ opacity: buttonTransitionPhase === 'closing' ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: buttonTransitionPhase === 'closing' ? 0.32 : 0.18, ease: 'easeOut' }}
            onAnimationComplete={() => {
              if (buttonTransitionPhase === 'closing') {
                setButtonTransitionPhase('idle')
              }
            }}
          >
            <motion.div
              className="work-projects-transition__button-overlay-mask"
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0 0 0)' }}
              transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
              onAnimationComplete={() => {
                if (buttonTransitionPhase !== 'opening') return

                document.getElementById('projects')?.scrollIntoView({ behavior: 'auto', block: 'start' })
                buttonTransitionTimeoutRef.current = window.setTimeout(() => {
                  setButtonTransitionPhase('closing')
                  buttonTransitionTimeoutRef.current = null
                }, 180)
              }}
            >
              <motion.div
                className="work-projects-transition__button-overlay-copy"
                initial={{ opacity: 0, x: 28 }}
                animate={{
                  opacity: buttonTransitionPhase === 'closing' ? 0 : 1,
                  x: buttonTransitionPhase === 'closing' ? -28 : 0,
                }}
                transition={{ duration: buttonTransitionPhase === 'closing' ? 0.22 : 0.34, ease: 'easeOut', delay: 0.08 }}
              >
                <p className="section-label">Selected Work</p>
                <h2 className="section-title">
                  Products I've designed <span className="teal">and engineered</span>
                </h2>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <section className="work-projects-transition" ref={transitionRef} aria-label="Workspace to selected work transition">
        <div className="work-projects-transition__track" style={{ height: shellHeight }}>
          <div className="work-projects-transition__sticky">
            <motion.div
              className="work-projects-transition__scene"
              style={{ scale: sceneScaleStyle, y: sceneYStyle, opacity: sceneOpacityStyle }}
            >
              <div className="container">
                <div className="work-image-shell" ref={shellRef}>
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
                    style={{ filter: imageBlurStyle }}
                  />
                  <a href="#projects" className="work-image-cta" onClick={scrollToProjects}>View Projects</a>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="work-projects-transition__preview"
              style={{ clipPath: irisClipPathStyle, opacity: previewOpacityStyle }}
              aria-hidden="true"
            >
              <motion.div className="work-projects-transition__preview-inner">
                <div className="work-projects-transition__preview-copy">
                  <motion.div
                    className="work-projects-transition__preview-ring"
                    style={{ opacity: irisRingOpacityStyle }}
                  />
                  <p className="section-label">Selected Work</p>
                  <h2 className="section-title">
                    Products I've designed <span className="teal">and engineered</span>
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
