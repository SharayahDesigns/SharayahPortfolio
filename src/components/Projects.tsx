import {
  motion,
  useReducedMotion,
} from 'framer-motion'
import { Link } from 'react-router-dom'
import { portfolioData } from '../data/portfolio'
import { caseStudies } from '../data/caseStudies'
import { ArrowUpRight, BriefcaseBusiness, ExternalLink, Heart } from 'lucide-react'
import ProjectVisual, { type ProjectVisualType } from './ProjectVisual'
import { trackExternalLinkClick, trackProjectClick } from '../lib/analytics'

/** `type` is a '·'-joined discipline list; a card only has room for the headline one. */
function primaryDiscipline(type: string) {
  return type.split('·')[0].trim()
}

const MAX_TAGS = 3
const PERSONAL_PROJECT_NAMES = new Set(['Atlas League'])

type ProjectCardItem = {
  name: string
  type: string
  technologies: string[]
  color: string
  image?: string | null
  imageSmall?: string | null
  imageWidth?: number
  imageHeight?: number
  imageAlt?: string
  visual?: string | null
  slug?: string | null
  link?: string | null
  linkLabel?: string | null
}

function ProjectCards({ items }: { items: ProjectCardItem[] }) {
  const reducedMotion = useReducedMotion() ?? false

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
  const cardHover = reducedMotion
    ? {
        rest: {},
        hover: {},
      }
    : {
        rest: { rotateX: 0, rotateY: 0, y: 0 },
        hover: {
          rotateX: -4,
          rotateY: 5,
          y: -6,
          transition: {
            duration: 0.26,
            ease: [0.16, 1, 0.3, 1],
            staggerChildren: 0.045,
            delayChildren: 0.03,
          },
        },
      }
  const staticCardHover = reducedMotion
    ? {
        rest: {},
        hover: {},
      }
    : {
        rest: { rotateX: 0, rotateY: 0, y: 0 },
        hover: {
          rotateX: -2,
          rotateY: 3,
          y: -4,
          transition: {
            duration: 0.26,
            ease: [0.16, 1, 0.3, 1],
          },
        },
      }
  const hoverSequence = reducedMotion
    ? {
        rest: {},
        hover: {},
      }
    : {
        rest: {},
        hover: {
          transition: {
            staggerChildren: 0.045,
            delayChildren: 0.03,
          },
        },
      }
  const hoverPart = reducedMotion
    ? {
        rest: { opacity: 1, y: 0 },
        hover: { opacity: 1, y: 0 },
      }
    : {
        rest: { opacity: 0, y: 10 },
        hover: (distance: number) => ({
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 420,
            damping: 30,
            mass: 0.7,
            delay: distance * 0.035,
          },
        }),
      }

  return (
    <>
      {items.map((p) => {
        const study = caseStudies.find((cs) => cs.title === p.name || cs.slug === p.slug)
        const caseStudySlug = study?.slug || p.slug
        const extraTags = p.technologies.length - MAX_TAGS
        const hasCaseStudy = Boolean(caseStudySlug)

        return (
          <motion.article
            key={p.name}
            className="project-card"
            initial="rest"
            whileHover="hover"
            whileFocus="hover"
            variants={hasCaseStudy ? cardHover : staticCardHover}
            style={{ transformPerspective: 1400 }}
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
              {hasCaseStudy && (
                <>
                  <div className="project-card-hover-wash" aria-hidden="true" />
                  <div className="project-card-hover-beam" aria-hidden="true" />
                  <motion.div
                    className="project-card-hover-cue"
                    aria-hidden="true"
                    variants={hoverSequence}
                  >
                    <motion.span className="project-card-hover-kicker" variants={hoverPart} custom={2}>Case Study</motion.span>
                    <motion.span className="project-card-hover-title" variants={hoverPart} custom={1}>Enter Project Details</motion.span>
                    <motion.span className="project-card-hover-action" variants={hoverPart} custom={0}>
                      <span>Open</span>
                      <ArrowUpRight size={15} />
                    </motion.span>
                  </motion.div>
                </>
              )}
            </div>

            <div className="project-card-body">
              <p className="project-card-type">{primaryDiscipline(p.type)}</p>
              <h3 className="project-card-name">
                {hasCaseStudy ? (
                  <>
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
                  </>
                ) : (
                  <span>{p.name}</span>
                )}
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
    </>
  )
}

type ProjectsProps = {
  id?: string
  showIntro?: boolean
}

export default function Projects({ id = 'projects', showIntro = true }: ProjectsProps) {
  const reducedMotion = useReducedMotion() ?? false
  const professionalProjects = portfolioData.projects.filter((project) => !PERSONAL_PROJECT_NAMES.has(project.name))
  const personalProjects: ProjectCardItem[] = [
    ...portfolioData.projects.filter((project) => PERSONAL_PROJECT_NAMES.has(project.name)),
    ...portfolioData.experiments.map((project) => ({
      name: project.name,
      type: project.type,
      technologies: project.technologies,
      color: project.color,
      image: project.image,
      imageWidth: project.imageWidth,
      imageHeight: project.imageHeight,
      imageAlt: project.imageAlt,
      visual: null,
      slug: null,
      link: null,
      linkLabel: null,
    })),
  ]

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
    <motion.section
      className="section projects-section"
      id={id}
    >
      <div className="container">
        <motion.div
          className="projects-content"
          variants={container}
          initial={false}
          animate="show"
        >
                {showIntro && (
                  <>
                    <motion.p className="section-label" variants={item}>Selected Work</motion.p>
                    <motion.h2 className="section-title" variants={item}>
                      Products I've designed{' '}
                      <br />
                      <span className="teal">and engineered</span>
                    </motion.h2>
                  </>
                )}

                <motion.div className="experiments" variants={container}>
                  <motion.div className="experiments-header" variants={item}>
                    <div className="projects-subsection-label" aria-label="Professional projects">
                      <span className="projects-subsection-icon" aria-hidden="true">
                        <BriefcaseBusiness size={13} />
                      </span>
                      <span>Professional</span>
                    </div>
                  </motion.div>
                  <motion.p className="experiment-summary" variants={item}>
                    Because I got bills to pay.
                  </motion.p>
                  <motion.div className="projects-grid" variants={container}>
                    <ProjectCards items={professionalProjects} />
                  </motion.div>
                </motion.div>

                <motion.div className="experiments" variants={container}>
                  <motion.div className="experiments-header" variants={item}>
                    <div className="projects-subsection-label" aria-label="Personal projects">
                      <span className="projects-subsection-icon" aria-hidden="true">
                        <Heart size={13} />
                      </span>
                      <span>Personal</span>
                    </div>
                  </motion.div>
                  <motion.p className="experiment-summary" variants={item}>
                    Because I legitimately enjoy what I do.
                  </motion.p>
                  <motion.div className="projects-grid projects-grid--personal" variants={container}>
                    <ProjectCards items={personalProjects} />
                  </motion.div>
                </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
