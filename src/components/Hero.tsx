import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import ParticleField from './ParticleField'
import { portfolioData } from '../data/portfolio'
import { Github, Linkedin, Mail, ArrowDown, FileText } from 'lucide-react'

export default function Hero() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
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
    <section className="hero" id="hero">
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="avatar-frame">
            <div className="avatar-ring avatar-ring--1" />
            <div className="avatar-ring avatar-ring--2" />
            <div className="avatar-mono">
              <span>SH</span>
            </div>
            <div className="avatar-badge">
              <span className="avatar-badge-dot" />
              Open to Work
            </div>
          </div>

          <motion.div
            className="hero-stat-card hero-stat-card--1"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="stat-number">{portfolioData.stats[0].number}</div>
            <div className="stat-label">{portfolioData.stats[0].label}</div>
          </motion.div>

          <motion.div
            className="hero-stat-card hero-stat-card--2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="stat-number">{portfolioData.stats[1].number}</div>
            <div className="stat-label">{portfolioData.stats[1].label}</div>
          </motion.div>

          <motion.div
            className="hero-stat-card hero-stat-card--3"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="stat-number">{portfolioData.stats[2].number}</div>
            <div className="stat-label">{portfolioData.stats[2].label}</div>
          </motion.div>
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
