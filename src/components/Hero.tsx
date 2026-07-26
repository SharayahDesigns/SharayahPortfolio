import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ParticleField from './ParticleField'
import { portfolioData } from '../data/portfolio'
import { Github, Linkedin, Mail, ArrowDown, FileText } from 'lucide-react'

const HeroAvatar = lazy(() => import('./HeroAvatar'))

export default function Hero() {
  const [reducedMotion, setReducedMotion] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

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

  return (
    <section className="hero" id="hero" ref={heroRef}>
      {!reducedMotion && <ParticleField />}

      <div className="hero-noise" />

      <div className="hero-orb hero-orb--1" />
      <div className="hero-orb hero-orb--2" />

      <div className="container hero-inner">
        <motion.div className="hero-content" variants={containerVariants} initial="hidden" animate="show">
          <motion.p className="hero-label" variants={item}>
            <span className="hero-label-dot" />
            Available for Frontend UX & Design Engineering Opportunities
          </motion.p>

          <motion.h1 className="hero-headline" variants={item}>
            I design and build digital products that feel as good as they work.
          </motion.h1>

          <motion.p className="hero-title" variants={item}>
            Frontend UX Engineer · Design Engineer · E-Commerce Front-End Developer
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
          // Fade only — a scale transform here would be measured by the R3F
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
                <HeroAvatar reducedMotion={reducedMotion} />
              </Suspense>
            </div>
            <div className="avatar-badge">
              <span className="avatar-badge-dot" />
              Open to Work
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
