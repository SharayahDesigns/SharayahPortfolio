import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Link } from 'react-router-dom'
import ParticleField from './ParticleField'
import { portfolioData } from '../data/portfolio'
import { Github, Linkedin, Mail, ArrowDown, FileText } from 'lucide-react'
import { useMediaQuery } from '../hooks/useMediaQuery'

const HeroAvatar = lazy(() => import('./HeroAvatar'))

const HEADLINE_WORDS = portfolioData.name.split(' ')
const HERO_TITLE = portfolioData.title
/** Per-character cadence: fast enough not to stall, slow enough to read. */
const TYPE_MS = 26

type HeroProps = {
  onReady?: () => void
}

export default function Hero({ onReady }: HeroProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const heroRef = useRef<HTMLElement>(null)
  const isMobileViewport = useMediaQuery('(max-width: 900px)')
  const isCoarsePointer = useMediaQuery('(pointer: coarse)')
  const useMobileHero = isMobileViewport || isCoarsePointer

  // The local state above starts false and only resolves after mount, which is
  // deliberate for the 3D avatar. The text animations need the value on the
  // first render instead, or the typewriter starts and then restarts.
  const prefersReduced = useReducedMotion() ?? false

  // Typed out by advancing a character count, so the string updates outside
  // React's render loop rather than re-rendering the hero ~70 times.
  const typedCount = useMotionValue(0)
  const typedText = useTransform(typedCount, (v) => HERO_TITLE.slice(0, Math.round(v)))

  useEffect(() => {
    if (prefersReduced) {
      typedCount.set(HERO_TITLE.length)
      return
    }
    typedCount.set(0)
    let i = 0
    let tick: ReturnType<typeof setInterval>
    // Stepped per character rather than interpolated over a duration. The 3D
    // avatar chunk initialises right about here and blocks the main thread; a
    // time-based tween would catch up after that stall by jumping straight to
    // the full string. Stepping just resumes where it left off.
    const start = setTimeout(() => {
      tick = setInterval(() => {
        i += 1
        typedCount.set(i)
        if (i >= HERO_TITLE.length) clearInterval(tick)
      }, TYPE_MS)
    }, 1050)
    return () => {
      clearTimeout(start)
      clearInterval(tick)
    }
  }, [prefersReduced, typedCount])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
  }, [])

  // The hero sticks so the content below scrolls up over it. When the hero is
  // taller than the viewport it pins at a negative offset instead of 0, so the
  // bottom of the hero is fully readable before the stack covers it.
  useEffect(() => {
    const el = heroRef.current
    if (!el) return

    const updateStickyOffset = () => {
      const overflow = Math.max(0, el.offsetHeight - window.innerHeight)
      el.style.setProperty('--hero-sticky-top', `${-overflow}px`)
    }

    updateStickyOffset()
    const observer = new ResizeObserver(updateStickyOffset)
    observer.observe(el)
    window.addEventListener('resize', updateStickyOffset)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateStickyOffset)
    }
  }, [])

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  }

  // The headline drops in a word at a time and overshoots on landing.
  const headline: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
  }
  const headlineWord: Variants = prefersReduced
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 48, scale: 0.94 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          // Underdamped on purpose; damping this low is what produces the
          // settle-and-bounce rather than a flat glide.
          transition: { type: 'spring', stiffness: 400, damping: 11, mass: 0.9 },
        },
      }

  return (
    <section className="hero" id="hero" ref={heroRef}>
      {!reducedMotion && !useMobileHero && <ParticleField />}

      <div className="hero-noise" />

      <div className="hero-orb hero-orb--1" />
      <div className="hero-orb hero-orb--2" />

      <div className="container hero-inner">
        <motion.div className="hero-content" variants={containerVariants} initial="hidden" animate="show">
          <motion.p className="hero-label" variants={item}>
            <span className="hero-label-dot" />
            Available for Frontend UX & Design Engineering Opportunities
          </motion.p>

          <motion.h1 className="hero-headline" variants={headline} aria-label={portfolioData.name}>
            {HEADLINE_WORDS.map((word) => (
              <motion.span className="hero-headline-word" key={word} variants={headlineWord} aria-hidden="true">
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* The ghost copy reserves the final wrapped height so the summary and
              everything under it never shifts while the line types itself. */}
          <motion.p className="hero-title" variants={item} aria-label={HERO_TITLE}>
            <span className="hero-title-ghost" aria-hidden="true">{HERO_TITLE}</span>
            <span className="hero-title-typed" aria-hidden="true">
              <motion.span>{typedText}</motion.span>
              <span className="hero-caret" />
            </span>
          </motion.p>

          <motion.p className="hero-summary" variants={item}>
            {portfolioData.summary}
          </motion.p>

          <motion.ul className="hero-stats" variants={item} aria-label="Career highlights">
            {portfolioData.stats.map((stat) => (
              <li className="hero-stat-card" key={stat.label}>
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </li>
            ))}
          </motion.ul>

          <motion.div className="hero-actions" variants={item}>
            <a href="#projects" className="btn btn-primary">
              View My Work
            </a>
            <a href="#contact" className="btn btn-ghost">
              Let's Talk
            </a>
          </motion.div>

          <motion.div className="hero-meta-row" variants={item}>
            <Link to="/resume" className="hero-resume-link">
              <FileText size={14} />
              View Résumé
            </Link>
            <div className="hero-socials">
              <a href={portfolioData.github} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub profile">
                <Github size={18} />
              </a>
              <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn profile">
                <Linkedin size={18} />
              </a>
              <a href={`mailto:${portfolioData.email}`} className="social-link" aria-label="Send email">
                <Mail size={18} />
              </a>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-graphic"
          // Fade only; a scale transform here would be measured by the R3F
          // canvas mid-animation and lock it to the wrong size until the first
          // scroll re-measures it.
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="avatar-frame hero-avatar-frame">
            <div className="avatar-ring avatar-ring--1" />
            <div className="avatar-ring avatar-ring--2" />
            <div className="hero-avatar-shell">
              <Suspense fallback={<div className="hero-avatar-loading">Loading 3D Model</div>}>
                {/* Same scene either way; mobile just swaps in the merged,
                    decimated model instead of the two full-resolution ones. */}
                <HeroAvatar reducedMotion={reducedMotion} mobile={useMobileHero} onReady={onReady} />
              </Suspense>
            </div>
            <div className="avatar-badge">
              <span className="avatar-badge-dot" />
              {useMobileHero ? 'Available for Hire' : 'Open to Work'}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="hero-scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        aria-label="Scroll to about section"
      >
        <span>Scroll to explore</span>
        <ArrowDown size={16} />
      </motion.a>
    </section>
  )
}
