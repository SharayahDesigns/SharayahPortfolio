import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { portfolioData } from '../data/portfolio'
import { caseStudies } from '../data/caseStudies'
import { FlaskConical, ArrowRight, ExternalLink } from 'lucide-react'
import ProjectVisual from './ProjectVisual'

export default function Projects() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
  }
  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section projects-section" id="projects" ref={ref}>
      <div className="container">
        <motion.div variants={container} initial="hidden" animate={inView ? 'show' : 'hidden'}>
          <motion.p className="section-label" variants={item}>Selected Work</motion.p>
          <motion.h2 className="section-title" variants={item}>
            Products I've designed{' '}
            <br />
            <span className="teal">and engineered</span>
          </motion.h2>

          <motion.div className="projects-grid" variants={container}>
            {portfolioData.projects.map((p) => {
              const study = caseStudies.find((cs) => cs.title === p.name || cs.slug === p.slug)
              const caseStudySlug = study?.slug || p.slug
              const hasLiveLink = p.link && p.linkLabel

              return (
                <motion.article
                  key={p.name}
                  className="project-card"
                  variants={item}
                  whileHover={{ y: -6, transition: { duration: 0.3 } }}
                >
                  <div className="project-visual-wrap">
                    <ProjectVisual type={p.visual as 'cabana' | 'dashboard' | 'ecommerce' | 'barnes' | 'atlas'} color={p.color} />
                  </div>
                  <div className="project-body">
                    <p className="project-type">{p.type}</p>
                    <h3 className="project-name">{p.name}</h3>
                    <p className="project-summary">{p.summary}</p>
                    <div className="project-meta">
                      <div className="project-meta-row">
                        <span className="project-meta-label">Role</span>
                        <span className="project-meta-value">{p.role}</span>
                      </div>
                      <div className="project-meta-row">
                        <span className="project-meta-label">Outcome</span>
                        <span className="project-meta-value">{p.outcome}</span>
                      </div>
                    </div>
                    <div className="project-tags">
                      {p.technologies.map((t) => (
                        <span className="project-tag" key={t}>{t}</span>
                      ))}
                    </div>

                    <div className="project-card-actions">
                      <Link
                        to={`/work/${caseStudySlug}`}
                        className="project-case-study-link"
                        style={{ color: p.color }}
                        aria-label={`View ${p.name} case study`}
                      >
                        View Case Study <ArrowRight size={14} />
                      </Link>
                      {hasLiveLink && (
                        <a
                          href={p.link!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-live-link"
                          style={{ color: p.color }}
                          aria-label={`Visit the live ${p.name} site (opens in a new tab)`}
                        >
                          Live Site <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </motion.div>

          <motion.div className="experiments" variants={container}>
            <motion.div className="experiments-header" variants={item}>
              <FlaskConical size={18} className="teal" />
              <h3 className="experiments-title">Experiments & Earlier Work</h3>
            </motion.div>
            <motion.div className="experiments-grid" variants={container}>
              {portfolioData.experiments.map((exp) => (
                <motion.div className="experiment-card" key={exp.name} variants={item} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  <div className="experiment-dot" style={{ background: exp.color }} />
                  <div>
                    <h4 className="experiment-name">{exp.name}</h4>
                    <p className="experiment-type">{exp.type}</p>
                    <p className="experiment-summary">{exp.summary}</p>
                    <div className="project-tags">
                      {exp.technologies.map((t) => (
                        <span className="project-tag" key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
