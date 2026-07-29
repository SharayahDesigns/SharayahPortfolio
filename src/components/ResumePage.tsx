import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { portfolioData } from '../data/portfolio'
import { resumePdfPath, resumePdfFilename } from '../data/siteConfig'
import { trackResumeDownload } from '../lib/analytics'
import SEO from './SEO'
import {
  ArrowLeft, Download, Mail, Github, Linkedin, MapPin, Briefcase,
  GraduationCap, Award, Code, Wrench,
} from 'lucide-react'

function DownloadResumeButton({ className }: { className: string }) {
  return (
    <a
      href={resumePdfPath}
      download={resumePdfFilename}
      aria-label="Download Sharayah Hefner résumé as PDF"
      className={className}
      onClick={() => {
        trackResumeDownload()
      }}
    >
      <Download size={16} /> Download PDF
    </a>
  )
}

export default function ResumePage() {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <>
      <SEO
        title="Resume - Sharayah Hefner"
        description="Online résumé for Sharayah Hefner, Frontend UX Engineer and Design Engineer. View experience, skills, education, and certifications, or download the PDF."
        path="/resume"
      />

      <motion.article
        className="resume-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* ===== HEADER ===== */}
        <header className="resume-header" ref={heroRef}>
          <div className="container resume-header-inner">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to="/" className="cs-back-link">
                <ArrowLeft size={16} /> Back to Home
              </Link>

              <p className="resume-header-label">Résumé</p>
              <h1 className="resume-header-name">{portfolioData.name}</h1>
              <p className="resume-header-title">{portfolioData.title}</p>

              <div className="resume-header-contact">
                <a href={`mailto:${portfolioData.email}`} className="resume-contact-item">
                  <Mail size={14} /> {portfolioData.email}
                </a>
                <a href={portfolioData.linkedin} target="_blank" rel="noopener noreferrer" className="resume-contact-item">
                  <Linkedin size={14} /> LinkedIn
                </a>
                <a href={portfolioData.github} target="_blank" rel="noopener noreferrer" className="resume-contact-item">
                  <Github size={14} /> GitHub
                </a>
                <span className="resume-contact-item">
                  <MapPin size={14} /> {portfolioData.location}
                </span>
              </div>

              <div className="resume-header-actions">
                <DownloadResumeButton className="btn btn-primary" />
                <Link to="/#contact" className="btn btn-ghost">
                  Let's Talk
                </Link>
              </div>
            </motion.div>
          </div>
        </header>

        {/* ===== BODY ===== */}
        <div className="container resume-body">
          {/* Summary */}
          <ResumeSection label="Summary">
            <p className="resume-summary-text">{portfolioData.summary}</p>
          </ResumeSection>

          {/* Key Metrics */}
          <ResumeSection label="Key Metrics">
            <div className="resume-stats">
              {portfolioData.stats.map((s) => (
                <div className="resume-stat" key={s.label}>
                  <div className="resume-stat-number">{s.number}</div>
                  <div className="resume-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </ResumeSection>

          {/* Experience */}
          <ResumeSection label="Experience" icon={<Briefcase size={16} />}>
            <div className="resume-experience">
              {portfolioData.experience.map((exp) => (
                <div className="resume-exp-item" key={exp.company}>
                  <div className="resume-exp-header">
                    <div>
                      <h3 className="resume-exp-title">{exp.title}</h3>
                      <p className="resume-exp-company" style={{ color: exp.color }}>
                        {exp.company}
                      </p>
                    </div>
                    <span className="resume-exp-period">{exp.period}</span>
                  </div>
                  <ul className="resume-exp-bullets">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>
                        <span className="resume-bullet-dot" style={{ background: exp.color }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ResumeSection>

          {/* Skills */}
          <ResumeSection label="Skills" icon={<Code size={16} />}>
            <div className="resume-skills-grid">
              {portfolioData.skillGroups.map((group) => (
                <div className="resume-skill-group" key={group.label}>
                  <h3 className="resume-skill-group-title">{group.label}</h3>
                  <div className="resume-skill-tags">
                    {group.skills.map((skill) => (
                      <span className="resume-skill-tag" key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {portfolioData.additionalSkills.length > 0 && (
              <div className="resume-additional-skills">
                <h3 className="resume-skill-group-title">Additional</h3>
                <div className="resume-skill-tags">
                  {portfolioData.additionalSkills.map((skill) => (
                    <span className="resume-skill-tag resume-skill-tag--muted" key={skill}>{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </ResumeSection>

          {/* Education */}
          <ResumeSection label="Education" icon={<GraduationCap size={16} />}>
            <div className="resume-education">
              {portfolioData.education.map((e) => (
                <div className="resume-edu-item" key={e.degree}>
                  <div>
                    <h3 className="resume-edu-degree">{e.degree}</h3>
                    <p className="resume-edu-institution">{e.institution}</p>
                  </div>
                  <span className="resume-edu-period">{e.period}</span>
                </div>
              ))}
            </div>
          </ResumeSection>

          {/* Certifications */}
          <ResumeSection label="Certifications" icon={<Award size={16} />}>
            <div className="resume-certs">
              {portfolioData.allCertifications.map((c) => (
                <div className="resume-cert-item" key={c.name}>
                  <span className="resume-cert-dot" />
                  <span className="resume-cert-name">{c.name}</span>
                  {c.source && <span className="resume-cert-source">{c.source}</span>}
                  <span className="resume-cert-year">{c.year}</span>
                </div>
              ))}
            </div>
          </ResumeSection>

          {/* Download CTA */}
          <section className="resume-download-cta">
            <div className="resume-download-glow" />
            <h3 className="resume-download-heading">
              Want a copy for your records?
            </h3>
            <p className="resume-download-body">
              Download the full résumé as a PDF, or reach out to start a conversation.
            </p>
            <div className="resume-download-actions">
              <DownloadResumeButton className="btn btn-primary" />
              <Link to="/#contact" className="btn btn-ghost">
                Contact Me
              </Link>
            </div>
          </section>
        </div>
      </motion.article>
    </>
  )
}

function ResumeSection({
  label,
  icon,
  children,
}: {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <motion.section
      className="resume-section"
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="resume-section-header">
        {icon && <span className="resume-section-icon">{icon}</span>}
        <h2 className="resume-section-label">{label}</h2>
      </div>
      <div className="resume-section-body">{children}</div>
    </motion.section>
  )
}
