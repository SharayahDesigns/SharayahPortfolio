import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { Link } from 'react-router-dom'
import { portfolioData } from '../data/portfolio'
import { caseStudies } from '../data/caseStudies'
import { FlaskConical, ArrowRight, ExternalLink } from 'lucide-react'
import ProjectVisual, { type ProjectVisualType } from './ProjectVisual'

export default function Projects() {
  const transitionRef = useRef<HTMLDivElement>(null)
  const projectRef = useRef<HTMLElement>(null)
  const [continuationHeight, setContinuationHeight] = useState(0)
  const { scrollYProgress } = useScroll({
    target: transitionRef,
    offset: ['start start', 'start -100vh'],
  })
  const reducedMotion = useReducedMotion() ?? false
  const slideX = useTransform(scrollYProgress, [0, 1], ['100vw', '0vw'])
  const featuredProjects = portfolioData.projects.filter((project) => project.featured)
  const [activeSlug, setActiveSlug] = useState(featuredProjects[0]?.slug ?? portfolioData.projects[0]?.slug ?? '')
  const activeProject = featuredProjects.find((project) => project.slug === activeSlug) ?? featuredProjects[0]
  const activeStudy = activeProject
    ? caseStudies.find((study) => study.title === activeProject.name || study.slug === activeProject.slug)
    : null
  const activeCaseStudySlug = activeStudy?.slug || activeProject?.slug

  useEffect(() => {
    const project = projectRef.current
    if (!project) return

    const updateContinuationHeight = () => {
      setContinuationHeight(Math.max(0, project.offsetHeight - window.innerHeight))
    }

    updateContinuationHeight()
    const observer = new ResizeObserver(updateContinuationHeight)
    observer.observe(project)
    window.addEventListener('resize', updateContinuationHeight)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateContinuationHeight)
    }
  }, [])

  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reducedMotion ? 0 : 0.1,
      },
    },
  }
  const item = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        duration: reducedMotion ? 0 : 0.45,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <div className="projects-transition-shell" ref={transitionRef}>
      <div
        className="projects-horizontal-track"
        style={{ height: reducedMotion ? '100vh' : '200vh' }}
      >
        <div className="projects-sticky-viewport">
          <motion.section
            ref={projectRef}
            className="section projects-section"
            id="projects"
            style={{ x: reducedMotion ? 0 : slideX }}
          >
            <div className="container">
              <motion.div
                variants={container}
                initial={false}
                animate="show"
              >
          <motion.p className="section-label" variants={item}>Selected Work</motion.p>
          <motion.h2 className="section-title" variants={item}>
            Products I've designed{' '}
            <br />
            <span className="teal">and engineered</span>
          </motion.h2>

          {activeProject && (
            <motion.div className="project-showcase" variants={item}>
              <div className="project-showcase-heading">
                <p className="project-showcase-kicker">Hover-Driven Preview</p>
                <p className="project-showcase-intro">
                  A faster way to scan the work. The list stays text-first, and the preview responds immediately, similar to the editorial interaction pattern used on the reference site.
                </p>
              </div>

              <div className="project-showcase-grid">
                <div className="project-showcase-list" role="list" aria-label="Featured projects">
                  {featuredProjects.map((project, index) => {
                    const isActive = project.slug === activeProject.slug

                    return (
                      <button
                        type="button"
                        key={project.slug}
                        className={`project-showcase-item${isActive ? ' is-active' : ''}`}
                        onMouseEnter={() => setActiveSlug(project.slug)}
                        onFocus={() => setActiveSlug(project.slug)}
                        onClick={() => setActiveSlug(project.slug)}
                        data-cursor="pointer"
                        aria-pressed={isActive}
                      >
                        <span className="project-showcase-index">{String(index + 1).padStart(2, '0')}</span>
                        <div className="project-showcase-copy">
                          <span className="project-showcase-name">{project.name}</span>
                          <span className="project-showcase-type">{project.type}</span>
                        </div>
                        <span className="project-showcase-arrow">
                          <ArrowRight size={18} />
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="project-showcase-preview">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeProject.slug}
                      className="project-showcase-preview-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="project-showcase-preview-visual">
                        {activeProject.image ? (
                          <div className="project-shot">
                            <img
                              src={activeProject.image}
                              srcSet={activeProject.imageSmall && activeProject.imageWidth
                                ? `${activeProject.imageSmall} 720w, ${activeProject.image} ${activeProject.imageWidth}w`
                                : undefined}
                              sizes={activeProject.imageSmall ? '(max-width: 900px) 100vw, 620px' : undefined}
                              alt={activeProject.imageAlt || `${activeProject.name} website screenshot`}
                              width={activeProject.imageWidth ?? undefined}
                              height={activeProject.imageHeight ?? undefined}
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        ) : activeProject.visual ? (
                          <ProjectVisual type={activeProject.visual as ProjectVisualType} color={activeProject.color} />
                        ) : null}
                      </div>

                      <div className="project-showcase-preview-body">
                        <p className="project-showcase-preview-label" style={{ color: activeProject.color }}>
                          Active Selection
                        </p>
                        <h3>{activeProject.name}</h3>
                        <p>{activeProject.summary}</p>

                        <div className="project-showcase-preview-meta">
                          <div>
                            <span>Role</span>
                            <strong>{activeProject.role}</strong>
                          </div>
                          <div>
                            <span>Outcome</span>
                            <strong>{activeProject.outcome}</strong>
                          </div>
                        </div>

                        <div className="project-tags">
                          {activeProject.technologies.map((technology) => (
                            <span className="project-tag" key={technology}>{technology}</span>
                          ))}
                        </div>

                        <div className="project-card-actions">
                          <Link
                            to={`/work/${activeCaseStudySlug}`}
                            className="project-case-study-link"
                            style={{ color: activeProject.color }}
                            aria-label={`View ${activeProject.name} case study`}
                          >
                            View Case Study <ArrowRight size={14} />
                          </Link>
                          {activeProject.link && activeProject.linkLabel && (
                            <a
                              href={activeProject.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="project-live-link"
                              style={{ color: activeProject.color }}
                              aria-label={`Visit the live ${activeProject.name} site (opens in a new tab)`}
                            >
                              Live Site <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

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
                    {p.image ? (
                      <div className="project-shot">
                        <img
                          src={p.image}
                          srcSet={p.imageSmall && p.imageWidth
                            ? `${p.imageSmall} 720w, ${p.image} ${p.imageWidth}w`
                            : undefined}
                          sizes={p.imageSmall ? '(max-width: 600px) 100vw, 520px' : undefined}
                          alt={p.imageAlt || `${p.name} website screenshot`}
                          width={p.imageWidth ?? undefined}
                          height={p.imageHeight ?? undefined}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ) : p.visual ? (
                      <ProjectVisual type={p.visual as ProjectVisualType} color={p.color} />
                    ) : null}
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
          </motion.section>
        </div>
      </div>
      <div
        className="projects-continuation-spacer"
        style={{ height: continuationHeight }}
        aria-hidden="true"
      />
    </div>
  )
}
