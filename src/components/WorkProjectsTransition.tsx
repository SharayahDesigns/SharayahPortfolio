import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Projects from './Projects'

const WORK_IMAGE_TEXT = "const title =\n  \"Sharayah's Awesome Projects\";\nrender(title);"
const WORK_IMAGE_LABEL = "JavaScript snippet showing Sharayah's Awesome Projects"
const TYPE_MS = 38

export default function WorkProjectsTransition() {
  const prefersReduced = useReducedMotion() ?? false
  const typedCount = useMotionValue(0)
  const typedText = useTransform(typedCount, (v) => WORK_IMAGE_TEXT.slice(0, Math.round(v)))
  const buttonTransitionTimeoutRef = useRef<number | null>(null)
  const [shellRef, shellInView] = useInView({ triggerOnce: true, threshold: 0.55 })
  const [buttonTransitionPhase, setButtonTransitionPhase] = useState<'idle' | 'opening' | 'closing'>('idle')

  const scrollToProjects = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const projectsSection = document.getElementById('projects')

    if (prefersReduced) {
      projectsSection?.scrollIntoView({ behavior: 'auto', block: 'start' })
      return
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
    if (buttonTransitionTimeoutRef.current != null) {
      window.clearTimeout(buttonTransitionTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (buttonTransitionPhase === 'idle') return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [buttonTransitionPhase])

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

      <section className="section work-image-section" aria-label="Workspace image">
        <div className="container">
          <div className="work-image-shell" ref={shellRef}>
            <div className="work-image-stage">
              <p className="work-image-typed" aria-label={WORK_IMAGE_LABEL}>
                <span className="work-image-typed-ghost" aria-hidden="true">{WORK_IMAGE_TEXT}</span>
                <span className="work-image-typed-live" aria-hidden="true">
                  <motion.span>{typedText}</motion.span>
                  {!prefersReduced ? <span className="hero-caret work-image-caret" /> : null}
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

      <Projects showIntro={false} />
    </>
  )
}
