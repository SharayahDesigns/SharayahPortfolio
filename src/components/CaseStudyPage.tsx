import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link, useParams, Navigate } from 'react-router-dom'
import { getCaseStudy, getAdjacentCaseStudies } from '../data/caseStudies'
import { portfolioData } from '../data/portfolio'
import { siteConfig } from '../data/siteConfig'
import SEO from './SEO'
import { upsertJsonLd, removeJsonLd } from './SEO'
import ProjectVisual from './ProjectVisual'
import { trackCaseStudyView, trackContactClick, trackExternalLinkClick, trackProjectClick } from '../lib/analytics'
import {
  ArrowLeft, ArrowRight, ArrowUpRight, ExternalLink, Github,
  CheckCircle2, AlertCircle, Lightbulb, Wrench, Target, Layers, Rocket,
} from 'lucide-react'
import { useEffect } from 'react'

const processIcons = [Target, Lightbulb, Layers, Wrench, CheckCircle2, Rocket]

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>()
  const study = slug ? getCaseStudy(slug) : undefined

  useEffect(() => {
    if (!study) return
    const pageUrl = `${siteConfig.origin}/work/${study.slug}`
    const heroImage = study.ogImage || study.heroImage || '/og-image.png'
    const absoluteImage = heroImage.startsWith('http') ? heroImage : `${siteConfig.origin}${heroImage}`

    upsertJsonLd('page-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: study.title,
      description: study.seo.description,
      url: pageUrl,
      image: absoluteImage,
      mainEntityOfPage: pageUrl,
      author: {
        '@type': 'Person',
        name: siteConfig.name,
        url: siteConfig.origin,
      },
      publisher: {
        '@type': 'Person',
        name: siteConfig.name,
        url: siteConfig.origin,
      },
      about: study.technologies,
      keywords: study.technologies.join(', '),
    })
    return () => removeJsonLd('page-jsonld')
  }, [study])

  useEffect(() => {
    if (!study) return
    trackCaseStudyView(study.slug, study.title)
  }, [study])

  if (!study) {
    return <Navigate to="/404" replace />
  }

  const { prev, next } = getAdjacentCaseStudies(study.slug)
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  // Sections are numbered in render order so optional sections never leave gaps.
  let sectionIndex = 0
  const sectionNumber = () => (sectionIndex += 1)

  return (
    <>
      <SEO
        title={study.seo.title}
        description={study.seo.description}
        path={`/work/${study.slug}`}
        image={study.ogImage || study.heroImage || '/og-image.png'}
        imageAlt={study.heroImageAlt || `${study.title} case study preview`}
        ogTitle={study.seo.ogTitle}
        ogDescription={study.seo.ogDescription}
      />

      <motion.article
        className="case-study"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* ===== HERO ===== */}
        <header className="cs-hero" ref={heroRef}>
          <div className="container cs-hero-inner">
            <motion.div
              className="cs-hero-content"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to="/#projects" className="cs-back-link">
                <ArrowLeft size={16} /> Back to Work
              </Link>

              <p className="cs-hero-category">{study.category}</p>
              <h1 className="cs-hero-title">{study.title}</h1>
              <p className="cs-hero-value">{study.valueStatement}</p>

              <div className="cs-hero-meta">
                <div className="cs-hero-meta-item">
                  <span className="cs-hero-meta-label">My Role</span>
                  <span className="cs-hero-meta-value">{study.role.join(' · ')}</span>
                </div>
                {study.status && (
                  <div className="cs-hero-meta-item">
                    <span className="cs-hero-meta-label">Status</span>
                    <span
                      className="cs-status-badge"
                      style={study.status === 'In Development'
                        ? { borderColor: 'var(--gold)', color: 'var(--gold)' }
                        : { borderColor: 'var(--teal)', color: 'var(--teal)' }}
                    >
                      {study.status === 'In Development' && <AlertCircle size={12} />}
                      {study.status !== 'In Development' && <CheckCircle2 size={12} />}
                      {study.status}
                    </span>
                  </div>
                )}
              </div>

              <div className="cs-hero-tags">
                {study.technologies.map((t) => (
                  <span className="project-tag" key={t}>{t}</span>
                ))}
              </div>

              <div className="cs-hero-actions">
                {study.liveUrl && (
                  <a
                    href={study.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    aria-label={`Visit the live ${study.title} site (opens in a new tab)`}
                    onClick={() => {
                      trackExternalLinkClick(`${study.title} live site`, study.liveUrl!, 'case_study_hero')
                    }}
                  >
                    <ExternalLink size={16} /> View Live Site
                  </a>
                )}
                {study.repositoryUrl && (
                  <a
                    href={study.repositoryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                    aria-label={`Visit the ${study.title} repository (opens in a new tab)`}
                    onClick={() => {
                      trackExternalLinkClick(`${study.title} repository`, study.repositoryUrl!, 'case_study_hero')
                    }}
                  >
                    <Github size={16} /> Visit Repository
                  </a>
                )}
                <Link
                  to="/#contact"
                  className="btn btn-ghost"
                  onClick={() => {
                    trackContactClick('cta', 'case_study_hero')
                  }}
                >
                  Let's Talk
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="cs-hero-visual"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              {study.heroImage ? (
                <div className="project-shot">
                  <img
                    src={study.heroImage}
                    srcSet={study.heroImageSmall && study.heroImageWidth
                      ? `${study.heroImageSmall} 720w, ${study.heroImage} ${study.heroImageWidth}w`
                      : undefined}
                    sizes={study.heroImageSmall ? '(max-width: 900px) 100vw, 560px' : undefined}
                    alt={study.heroImageAlt || `${study.title} website homepage`}
                    width={study.heroImageWidth}
                    height={study.heroImageHeight}
                    decoding="async"
                    {...{ fetchpriority: 'high' }}
                  />
                </div>
              ) : study.visual ? (
                <ProjectVisual type={study.visual} color={study.color} />
              ) : null}
            </motion.div>
          </div>
        </header>

        <div className="container cs-body">
          {/* ===== OVERVIEW GRID ===== */}
          <CsSection index={sectionNumber()} label="Overview">
            {study.overviewIntro && <p className="cs-paragraph">{study.overviewIntro}</p>}
            <div className="cs-overview-grid">
              {study.client && <CsOverviewItem label="Client" value={study.client} />}
              {study.projectType && <CsOverviewItem label="Project Type" value={study.projectType} />}
              <CsOverviewItem label="My Role" value={study.role.join(' · ')} />
              <CsOverviewItem label="Responsibilities" value={study.responsibilities.join(' · ')} />
              {study.audience && <CsOverviewItem label="Audience" value={study.audience} />}
              <CsOverviewItem label="Platform" value={study.platform} />
              <CsOverviewItem label="Technologies" value={study.technologies.join(' · ')} />
              {study.status && <CsOverviewItem label="Status" value={study.status} />}
              {study.team && <CsOverviewItem label="Team" value={study.team} />}
            </div>
          </CsSection>

          {/* ===== NARRATIVE SECTIONS (studies that define their own storyline) ===== */}
          {study.sections?.map((section) => (
            <CsSection index={sectionNumber()} label={section.label} key={section.label}>
              <h3 className="cs-narrative-heading">{section.heading}</h3>

              {section.paragraphs?.map((p, i) => (
                <p className="cs-paragraph" key={i}>{p}</p>
              ))}

              {section.list && section.list.length > 0 && (
                <ul className="cs-contribution-list">
                  {section.list.map((entry, i) => (
                    <li key={i}>
                      <span className="cs-check-dot" style={{ background: study.color }} />
                      {entry}
                    </li>
                  ))}
                </ul>
              )}

              {section.cards && section.cards.length > 0 && (
                <div className="cs-solution-features">
                  {section.cards.map((card, i) => (
                    <motion.div
                      className="cs-feature-card"
                      key={card.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                    >
                      <div className="cs-feature-dot" style={{ background: study.color }} />
                      <h3 className="cs-feature-title">{card.title}</h3>
                      <p className="cs-feature-desc">{card.description}</p>
                    </motion.div>
                  ))}
                </div>
              )}

              {section.steps && section.steps.length > 0 && (
                <ol className="cs-process-grid cs-process-grid--flow">
                  {section.steps.map((step, i) => (
                    <motion.li
                      className="cs-process-step"
                      key={step}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                    >
                      <div className="cs-process-number">{String(i + 1).padStart(2, '0')}</div>
                      <p className="cs-process-title">{step}</p>
                    </motion.li>
                  ))}
                </ol>
              )}
            </CsSection>
          ))}

          {/* ===== CHALLENGE ===== */}
          {study.challenge && (
            <CsSection index={sectionNumber()} label="The Challenge">
              <p className="cs-paragraph">{study.challenge}</p>
            </CsSection>
          )}

          {/* ===== MY CONTRIBUTION ===== */}
          {!study.sections && (
            <CsSection index={sectionNumber()} label="My Contribution">
              <ul className="cs-contribution-list">
                {study.responsibilities.map((r, i) => (
                  <li key={i}>
                    <span className="cs-check-dot" style={{ background: study.color }} />
                    {r}
                  </li>
                ))}
              </ul>
              {study.constraints && study.constraints.length > 0 && (
                <div className="cs-constraints">
                  <h3 className="cs-constraints-title">
                    <AlertCircle size={16} className="gold" /> Constraints
                  </h3>
                  <ul className="cs-constraints-list">
                    {study.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CsSection>
          )}

          {/* ===== PROCESS ===== */}
          {study.process && study.process.length > 0 && (
            <CsSection index={sectionNumber()} label="Process">
              <div className="cs-process-grid">
                {study.process.map((step, i) => {
                  const Icon = processIcons[i] || Target
                  return (
                    <motion.div
                      className="cs-process-step"
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                    >
                      <div className="cs-process-icon" style={{ color: study.color }}>
                        <Icon size={20} />
                      </div>
                      <div className="cs-process-number">0{i + 1}</div>
                      <h3 className="cs-process-title">{step.title}</h3>
                      <p className="cs-process-desc">{step.description}</p>
                    </motion.div>
                  )
                })}
              </div>
            </CsSection>
          )}

          {/* ===== SOLUTION ===== */}
          {study.solution && study.solution.length > 0 && (
            <CsSection index={sectionNumber()} label="Solution">
              <div className="cs-solution-text">
                {study.solution.map((s, i) => (
                  <p className="cs-paragraph" key={i}>{s}</p>
                ))}
              </div>
              <div className="cs-solution-features">
                {study.solutionFeatures?.map((f, i) => (
                  <motion.div
                    className="cs-feature-card"
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <div className="cs-feature-dot" style={{ background: study.color }} />
                    <h3 className="cs-feature-title">{f.title}</h3>
                    <p className="cs-feature-desc">{f.description}</p>
                  </motion.div>
                ))}
              </div>
            </CsSection>
          )}

          {/* ===== TECHNICAL IMPLEMENTATION ===== */}
          {study.technicalImplementation && study.technicalImplementation.length > 0 && (
            <CsSection index={sectionNumber()} label="Technical Implementation">
              <ul className="cs-tech-list">
                {study.technicalImplementation.map((t, i) => (
                  <li key={i}>
                    <span className="cs-tech-bullet" style={{ background: study.color }} />
                    {t}
                  </li>
                ))}
              </ul>
            </CsSection>
          )}

          {/* ===== OUTCOMES ===== */}
          {study.outcomes && study.outcomes.length > 0 && (
            <CsSection index={sectionNumber()} label="Outcomes">
              <ul className="cs-outcomes-list">
                {study.outcomes.map((o, i) => (
                  <li key={i}>
                    <CheckCircle2 size={18} style={{ color: study.color }} />
                    {o}
                  </li>
                ))}
              </ul>
            </CsSection>
          )}

          {/* ===== GALLERY ===== */}
          {study.images.length > 0 && (
            <CsSection index={sectionNumber()} label="Gallery">
              <div className="cs-gallery">
                {study.images.map((img, i) => (
                  <motion.figure
                    className="cs-gallery-item"
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="cs-gallery-visual">
                      {img.src ? (
                        <picture>
                          <img
                            src={img.src}
                            srcSet={img.srcSmall && img.width
                              ? `${img.srcSmall} 720w, ${img.src} ${img.width}w`
                              : undefined}
                            sizes={img.srcSmall ? '(max-width: 940px) 100vw, 900px' : undefined}
                            alt={img.alt}
                            width={img.width || 1200}
                            height={img.height || 750}
                            loading={i > 0 ? 'lazy' : 'eager'}
                            decoding="async"
                            className="cs-gallery-screenshot"
                          />
                        </picture>
                      ) : img.visual ? (
                        <>
                          <ProjectVisual type={img.visual} color={img.color} />
                          <span className="cs-gallery-illustration-label">Simplified interface illustration</span>
                        </>
                      ) : null}
                    </div>
                    {img.caption && (
                      <figcaption className="cs-gallery-caption">{img.caption}</figcaption>
                    )}
                  </motion.figure>
                ))}
              </div>
            </CsSection>
          )}

          {/* ===== PROJECT NAVIGATION ===== */}
          <nav className="cs-nav" aria-label="Case study navigation">
            <Link to="/#projects" className="cs-nav-back">
              <ArrowLeft size={16} /> Back to All Work
            </Link>

            <div className="cs-nav-arrows">
              <Link
                to={`/work/${prev.slug}`}
                className="cs-nav-arrow cs-nav-arrow--prev"
                onClick={() => {
                  trackProjectClick(prev.title, `/work/${prev.slug}`)
                }}
              >
                <ArrowLeft size={16} />
                <div>
                  <span className="cs-nav-arrow-label">Previous</span>
                  <span className="cs-nav-arrow-title">{prev.title}</span>
                </div>
              </Link>
              <Link
                to={`/work/${next.slug}`}
                className="cs-nav-arrow cs-nav-arrow--next"
                onClick={() => {
                  trackProjectClick(next.title, `/work/${next.slug}`)
                }}
              >
                <div>
                  <span className="cs-nav-arrow-label">Next</span>
                  <span className="cs-nav-arrow-title">{next.title}</span>
                </div>
                <ArrowRight size={16} />
              </Link>
            </div>
          </nav>

          {/* ===== CONTACT CTA ===== */}
          <section className="cs-contact-cta">
            <div className="cs-contact-glow" />
            {study.finalCta ? (
              <>
                <h3 className="cs-contact-heading">
                  {study.finalCta.heading}{' '}
                  <br />
                  <span className="teal">{study.finalCta.highlight}</span>
                </h3>
                <p className="cs-contact-body">{study.finalCta.body}</p>
                <div className="cs-contact-actions">
                  <Link
                    to="/#contact"
                    className="btn btn-primary"
                    onClick={() => {
                      trackContactClick('cta', 'case_study_footer')
                    }}
                  >
                    Let's Talk
                  </Link>
                  <Link
                    to={`/work/${next.slug}`}
                    className="btn btn-ghost"
                    onClick={() => {
                      trackProjectClick(next.title, `/work/${next.slug}`)
                    }}
                  >
                    View Next Project <ArrowRight size={16} />
                  </Link>
                  <Link to="/#projects" className="btn btn-ghost">
                    Back to All Work
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h3 className="cs-contact-heading">
                  Have a product that needs equal parts{' '}
                  <br />
                  <span className="teal">design thinking and product engineering?</span>
                </h3>
                <p className="cs-contact-body">
                  I'm currently open to product engineering, design engineering, UI engineering,
                  and customer-facing frontend roles. Let's talk about what you're building.
                </p>
                <a
                  href={`mailto:${portfolioData.email}`}
                  className="btn btn-primary"
                  onClick={() => {
                    trackContactClick('email', 'case_study_footer')
                  }}
                >
                  Start a Conversation
                </a>
              </>
            )}
          </section>
        </div>
      </motion.article>
    </>
  )
}

/* ===== Sub-components ===== */

function CsSection({ index, label, children }: { index: number; label: string; children: React.ReactNode }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  return (
    <motion.section
      className="cs-section"
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="cs-section-header">
        <span className="cs-section-number">{String(index).padStart(2, '0')}</span>
        <h2 className="cs-section-label">{label}</h2>
      </div>
      <div className="cs-section-body">{children}</div>
    </motion.section>
  )
}

function CsOverviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="cs-overview-item">
      <span className="cs-overview-label">{label}</span>
      <span className="cs-overview-value">{value}</span>
    </div>
  )
}
