import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { portfolioData } from '../data/portfolio'
import { Github, Linkedin, Mail, MapPin, ArrowUpRight } from 'lucide-react'
import { trackContactClick, trackExternalLinkClick } from '../lib/analytics'

export default function Contact() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  }
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section contact-section" id="contact" ref={ref}>
      <div className="container">
        <motion.div variants={container} initial="hidden" animate={inView ? 'show' : 'hidden'}>
          <motion.p className="section-label" variants={item}>Contact</motion.p>
          <motion.h2 className="section-title contact-title" variants={item}>
            Have a product that needs equal parts{' '}
            <br />
            <span className="teal">design thinking and frontend engineering?</span>
          </motion.h2>

          <div className="contact-layout">
            <motion.div className="contact-info" variants={item}>
              <p className="contact-intro">
                I'm currently open to Frontend UX Engineer, Design Engineer, and
                product-focused frontend opportunities. Let's talk about what you're building.
              </p>

              <div className="contact-channels">
                <a
                  href={`mailto:${portfolioData.email}`}
                  className="contact-channel"
                  onClick={() => {
                    trackContactClick('email', 'contact_channel')
                  }}
                >
                  <Mail size={20} className="teal" />
                  <div>
                    <span className="contact-channel-label">Email</span>
                    <span className="contact-channel-value">{portfolioData.email}</span>
                  </div>
                  <ArrowUpRight size={16} className="contact-channel-arrow" />
                </a>
                <a
                  href={portfolioData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-channel"
                  onClick={() => {
                    trackExternalLinkClick('linkedin', portfolioData.linkedin, 'contact_channel')
                    trackContactClick('linkedin', 'contact_channel')
                  }}
                >
                  <Linkedin size={20} className="teal" />
                  <div>
                    <span className="contact-channel-label">LinkedIn</span>
                    <span className="contact-channel-value">Sharayah Hefner</span>
                  </div>
                  <ArrowUpRight size={16} className="contact-channel-arrow" />
                </a>
                <a
                  href={portfolioData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-channel"
                  onClick={() => {
                    trackExternalLinkClick('github', portfolioData.github, 'contact_channel')
                  }}
                >
                  <Github size={20} className="teal" />
                  <div>
                    <span className="contact-channel-label">GitHub</span>
                    <span className="contact-channel-value">SharayahDesigns</span>
                  </div>
                  <ArrowUpRight size={16} className="contact-channel-arrow" />
                </a>
                <div className="contact-channel contact-channel--info">
                  <MapPin size={20} className="teal" />
                  <div>
                    <span className="contact-channel-label">Location</span>
                    <span className="contact-channel-value">{portfolioData.location}</span>
                  </div>
                </div>
                <div className="contact-channel contact-channel--info">
                  <div className="contact-availability-icon teal">
                    <span className="contact-availability-dot" />
                  </div>
                  <div>
                    <span className="contact-channel-label">Availability</span>
                    <span className="contact-channel-value">{portfolioData.availability}</span>
                  </div>
                </div>
              </div>

              <a
                href={`mailto:${portfolioData.email}?subject=Frontend%20UX%20Opportunity`}
                className="btn btn-primary contact-email-cta"
                onClick={() => {
                  trackContactClick('email', 'contact_cta')
                }}
              >
                <Mail size={18} />
                Start a Conversation
              </a>
            </motion.div>

            <motion.div className="contact-cta-panel" variants={item}>
              <div className="contact-cta-glow" />
              <p className="contact-cta-eyebrow">Currently Available</p>
              <h3 className="contact-cta-heading">Let's build something polished.</h3>
              <p className="contact-cta-body">
                Whether you need a design system, an e-commerce experience, or a full
                frontend build — I'd love to hear about it. The fastest way to reach me
                is by email.
              </p>
              <a
                href={`mailto:${portfolioData.email}`}
                className="contact-cta-email"
                onClick={() => {
                  trackContactClick('email', 'contact_panel')
                }}
              >
                {portfolioData.email}
              </a>
              <div className="contact-socials">
                <a
                  href={portfolioData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="GitHub profile"
                  onClick={() => {
                    trackExternalLinkClick('github', portfolioData.github, 'contact_social')
                  }}
                >
                  <Github size={18} />
                </a>
                <a
                  href={portfolioData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-link"
                  aria-label="LinkedIn profile"
                  onClick={() => {
                    trackExternalLinkClick('linkedin', portfolioData.linkedin, 'contact_social')
                    trackContactClick('linkedin', 'contact_social')
                  }}
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href={`mailto:${portfolioData.email}`}
                  className="social-link"
                  aria-label="Send email"
                  onClick={() => {
                    trackContactClick('email', 'contact_social')
                  }}
                >
                  <Mail size={18} />
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
