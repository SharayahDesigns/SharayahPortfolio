import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { portfolioData } from '../data/portfolio'
import { GraduationCap, Award, ChevronDown } from 'lucide-react'

export default function Education() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })
  const [showAll, setShowAll] = useState(false)
  const allCredentialsRef = useRef<HTMLDivElement | null>(null)

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  }

  useEffect(() => {
    if (!showAll || !allCredentialsRef.current) return

    allCredentialsRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [showAll])

  return (
    <section className="section" id="education" ref={ref}>
      <div className="container">
        <motion.div variants={container} initial="hidden" animate={inView ? 'show' : 'hidden'}>
          <motion.p className="section-label" variants={item}>Education & Credentials</motion.p>
          <motion.h2 className="section-title" variants={item}>
            Foundations &{' '}
            <br />
            <span className="teal">continuous learning</span>
          </motion.h2>

          <div className="education-layout">
            <motion.div className="education-col" variants={item}>
              <h3 className="education-col-title">
                <GraduationCap size={18} className="teal" />
                Education
              </h3>
              <div className="education-list">
                {portfolioData.education.map((e) => (
                  <motion.div className="education-card" key={e.degree} variants={item} whileHover={{ x: 4, transition: { duration: 0.2 } }}>
                    <h4 className="education-degree">{e.degree}</h4>
                    <p className="education-institution">{e.institution}</p>
                    <p className="education-period">{e.period}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div className="education-col" variants={item}>
              <h3 className="education-col-title">
                <Award size={18} className="teal" />
                Featured Credentials
              </h3>
              <div className="cert-grid">
                {portfolioData.featuredCertifications.map((c) => (
                  <motion.div className="cert-card" key={c.name} variants={item} whileHover={{ y: -3, transition: { duration: 0.2 } }}>
                    <div className="cert-header">
                      <span className="cert-dot" />
                      <span className="cert-year">{c.year}</span>
                    </div>
                    <p className="cert-name">{c.name}</p>
                    {c.source && <p className="cert-source">{c.source}</p>}
                  </motion.div>
                ))}
              </div>

              <button
                type="button"
                className="cert-toggle"
                onClick={() => setShowAll(!showAll)}
                aria-expanded={showAll}
                aria-controls="all-credentials"
              >
                {showAll ? 'Show Fewer Credentials' : 'View All Credentials'}
                <ChevronDown size={16} className={showAll ? 'cert-toggle-icon--open' : 'cert-toggle-icon'} />
              </button>

              {showAll && (
                <motion.div
                  id="all-credentials"
                  ref={allCredentialsRef}
                  className="cert-grid cert-grid--all"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {portfolioData.allCertifications.map((c) => (
                    <div className="cert-card" key={c.name}>
                      <div className="cert-header">
                        <span className="cert-dot" />
                        <span className="cert-year">{c.year}</span>
                      </div>
                      <p className="cert-name">{c.name}</p>
                      {c.source && <p className="cert-source">{c.source}</p>}
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
