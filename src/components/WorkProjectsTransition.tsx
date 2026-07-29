import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { X } from 'lucide-react'
import Projects from './Projects'
import { useMediaQuery } from '../hooks/useMediaQuery'

const WORK_IMAGE_IDLE = "function onyx() {\n  while (!carrot)\n    stare();\n}"
const WORK_IMAGE_FED = "carrot = true;\n// exit code 0"
const WORK_IMAGE_LABEL = "JavaScript snippet showing a function named onyx"
const TYPE_MS = 38

export default function WorkProjectsTransition() {
  const prefersReduced = useReducedMotion() ?? false
  const typedCount = useMotionValue(0)
  const typedText = useTransform(typedCount, (v) => WORK_IMAGE_IDLE.slice(0, Math.round(v)))
  const buttonTransitionTimeoutRef = useRef<number | null>(null)
  const fedTimeoutRef = useRef<number | null>(null)
  const [shellRef, shellInView] = useInView({ triggerOnce: true, threshold: 0.55 })
  const [buttonTransitionPhase, setButtonTransitionPhase] = useState<'idle' | 'opening' | 'closing'>('idle')
  const [fed, setFed] = useState(false)
  // The on-screen code renders at 5-9px on phones, which is decorative rather
  // than readable, so touch layouts get a tap-to-open copy at a legible size.
  const isMobile = useMediaQuery('(max-width: 900px)')
  const [codeOpen, setCodeOpen] = useState(false)

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

    buttonTransitionTimeoutRef.current = window.setTimeout(() => {
      setButtonTransitionPhase('opening')
      buttonTransitionTimeoutRef.current = null
    }, 120)
  }

  const giveCarrot = () => {
    if (fed) return
    setFed(true)
  }

  useEffect(() => {
    if (prefersReduced) {
      typedCount.set(WORK_IMAGE_IDLE.length)
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
        if (i >= WORK_IMAGE_IDLE.length) {
          window.clearInterval(tick)
        }
      }, TYPE_MS)
    }, 250)

    return () => {
      window.clearTimeout(start)
      window.clearInterval(tick)
    }
  }, [prefersReduced, shellInView, typedCount])

  // Rotating a phone past the breakpoint would otherwise leave the panel
  // stranded over a layout that no longer has a trigger to close it.
  useEffect(() => {
    if (!isMobile) setCodeOpen(false)
  }, [isMobile])

  useEffect(() => {
    if (!fed) return

    fedTimeoutRef.current = window.setTimeout(() => {
      setFed(false)
      fedTimeoutRef.current = null
    }, 3000)

    return () => {
      if (fedTimeoutRef.current != null) {
        window.clearTimeout(fedTimeoutRef.current)
        fedTimeoutRef.current = null
      }
    }
  }, [fed])

  useEffect(() => () => {
    if (buttonTransitionTimeoutRef.current != null) {
      window.clearTimeout(buttonTransitionTimeoutRef.current)
    }
    if (fedTimeoutRef.current != null) {
      window.clearTimeout(fedTimeoutRef.current)
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
              {/* aria-label on a <p> is dropped by most AT (no role that
                  accepts a name); the real text lives in a visually-hidden
                  span instead. */}
              <p className="work-image-typed">
                <span className="sr-only">{WORK_IMAGE_LABEL}</span>
                <span className="work-image-typed-ghost" aria-hidden="true">{WORK_IMAGE_IDLE}</span>
                <span className="work-image-typed-live" aria-hidden="true">
                  {fed ? (
                    WORK_IMAGE_FED
                  ) : (
                    <>
                      <motion.span>{typedText}</motion.span>
                      {!prefersReduced ? <span className="hero-caret work-image-caret" /> : null}
                    </>
                  )}
                </span>
              </p>
              {isMobile ? (
                <button
                  type="button"
                  className="work-image-typed-trigger"
                  aria-expanded={codeOpen}
                  aria-controls="work-image-code-panel"
                  onClick={() => setCodeOpen((open) => !open)}
                >
                  <span className="work-image-typed-trigger__label">
                    {codeOpen ? 'Hide the code shown on the screen' : 'Read the code shown on the screen'}
                  </span>
                </button>
              ) : null}
              <AnimatePresence>
                {fed ? (
                  <motion.span
                    className="work-image-carrot"
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.85 }}
                    transition={{ duration: 0.28, ease: 'easeOut' }}
                    aria-hidden="true"
                  >
                    🥕
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>
            <img
              className="work-image-figure"
              src="/images/computer2.webp"
              alt="Workspace setup showing computer-based design and development work"
              width={961}
              height={1358}
              loading="lazy"
              decoding="async"
            />
            <AnimatePresence>
              {isMobile && codeOpen ? (
                <motion.div
                  key="work-image-code-panel"
                  id="work-image-code-panel"
                  className="work-image-code-panel"
                  initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                >
                  <pre className="work-image-code-panel__code">{fed ? WORK_IMAGE_FED : WORK_IMAGE_IDLE}</pre>
                  <button
                    type="button"
                    className="work-image-code-panel__close"
                    onClick={() => setCodeOpen(false)}
                    aria-label="Close the code"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <div className="work-image-actions">
              <a href="#projects" className="work-image-cta" onClick={scrollToProjects}>
                cd ~/projects
              </a>
              <button
                type="button"
                className={`work-image-cta work-image-cta--secondary${fed ? ' is-disabled' : ''}`}
                onClick={giveCarrot}
                disabled={fed}
              >
                Give(Carrot)
              </button>
            </div>
          </div>
        </div>
      </section>

      <Projects showIntro={false} />
    </>
  )
}
