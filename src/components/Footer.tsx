import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { portfolioData } from '../data/portfolio'
import { navItems, siteConfig } from '../data/siteConfig'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-marquee-wrap">
        <motion.div
          className="footer-marquee"
          initial={{ x: 0 }}
          animate={{ x: '-50%' }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        >
          <span>FRONTEND UX ENGINEER</span>
          <span className="teal">●</span>
          <span>DESIGN ENGINEER</span>
          <span className="teal">●</span>
          <span>SHARAYAH HEFNER</span>
          <span className="teal">●</span>
          <span>FRONTEND UX ENGINEER</span>
          <span className="teal">●</span>
          <span>DESIGN ENGINEER</span>
          <span className="teal">●</span>
          <span>SHARAYAH HEFNER</span>
          <span className="teal">●</span>
        </motion.div>
      </div>

      <div className="container footer-inner">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="nav-logo" aria-label="Sharayah Hefner — Home">
              <span className="nav-logo-bracket">&lt;</span>SH<span className="nav-logo-bracket">/&gt;</span>
            </Link>
            <p className="footer-tagline">
              Frontend UX Engineer & Design Engineer building polished, production-ready
              digital products.
            </p>
          </div>

          <nav className="footer-links" aria-label="Footer navigation">
            <Link to="/">Home</Link>
            {navItems.filter((l) => l.section).map((l) => (
              <Link key={l.href} to={l.href}>{l.label}</Link>
            ))}
            <Link to="/resume">Résumé</Link>
          </nav>

          <div className="footer-socials">
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
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Sharayah Hefner. All rights reserved.</p>
          <a href="https://sharayahdesigner.com/" className="footer-top">
            {siteConfig.name} <ArrowUp size={14} />
          </a>
        </div>
      </div>
    </footer>
  )
}
