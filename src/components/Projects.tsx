import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { Link } from 'react-router-dom'
import { portfolioData } from '../data/portfolio'
import { caseStudies } from '../data/caseStudies'
import { FlaskConical, ArrowUpRight, ExternalLink } from 'lucide-react'
import ProjectVisual, { type ProjectVisualType } from './ProjectVisual'
import { trackExternalLinkClick, trackProjectClick } from '../lib/analytics'

/** `type` is a '·'-joined discipline list; a card only has room for the headline one. */
function primaryDiscipline(type: string) {
  return type.split('·')[0].trim()
}

const MAX_TAGS = 3

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
        staggerChildren: reducedMotion ? 0 : 0.06,
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

                <motion.div className="projects-grid" variants={container}>
                  {portfolioData.projects.map((p) => {
                    const study = caseStudies.find((cs) => cs.title === p.name || cs.slug === p.slug)
                    const caseStudySlug = study?.slug || p.slug
                    const extraTags = p.technologies.length - MAX_TAGS

                    return (
                      <motion.article
                        key={p.name}
                        className="project-card"
                        variants={item}
                        whileHover={reducedMotion ? undefined : { y: -4, transition: { duration: 0.25 } }}
                      >
                        <div className="project-card-media">
                          {p.image ? (
                            <img
                              src={p.image}
                              srcSet={p.imageSmall && p.imageWidth
                                ? `${p.imageSmall} 720w, ${p.image} ${p.imageWidth}w`
                                : undefined}
                              sizes={p.imageSmall ? '(max-width: 600px) 100vw, 380px' : undefined}
                              alt={p.imageAlt || `${p.name} website screenshot`}
                              width={p.imageWidth ?? undefined}
                              height={p.imageHeight ?? undefined}
                              loading="lazy"
                              decoding="async"
                            />
                          ) : p.visual ? (
                            <ProjectVisual type={p.visual as ProjectVisualType} color={p.color} />
                          ) : null}
                        </div>

                        <div className="project-card-body">
                          <p className="project-card-type">{primaryDiscipline(p.type)}</p>
                          {/* The link stretches over the whole card via ::after, so the
                              card is one target and the live-site button stays separate. */}
                          <h3 className="project-card-name">
                            <Link
                              to={`/work/${caseStudySlug}`}
                              className="project-card-link"
                              data-cursor="pointer"
                              onClick={() => {
                                trackProjectClick(p.name, `/work/${caseStudySlug}`)
                              }}
                            >
                              {p.name}
                            </Link>
                            <ArrowUpRight size={16} aria-hidden="true" />
                          </h3>
                          <div className="project-card-tags">
                            {p.technologies.slice(0, MAX_TAGS).map((t) => (
                              <span className="project-tag" key={t}>{t}</span>
                            ))}
                            {extraTags > 0 && (
                              <span className="project-tag project-tag--more">+{extraTags}</span>
                            )}
                          </div>
                        </div>

                        {p.link && p.linkLabel && (
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-card-live"
                            style={{ color: p.color }}
                            aria-label={`Visit the live ${p.name} site (opens in a new tab)`}
                            data-cursor="pointer"
                            onClick={() => {
                              trackExternalLinkClick(`${p.name} live site`, p.link!, 'projects_grid')
                            }}
                          >
                            <ExternalLink size={14} aria-hidden="true" />
                          </a>
                        )}
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
                        {exp.image && (
                          <div className="experiment-card-media">
                            <img
                              src={exp.image}
                              alt={exp.imageAlt}
                              width={exp.imageWidth}
                              height={exp.imageHeight}
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        )}
                        <div className="experiment-card-body">
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
