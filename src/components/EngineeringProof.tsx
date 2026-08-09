import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, GitCommitHorizontal, Github, LockKeyhole, Network } from 'lucide-react'
import { portfolioData } from '../data/portfolio'
import { siteConfig } from '../data/siteConfig'
import { trackExternalLinkClick } from '../lib/analytics'

const stateLayers = [
  {
    number: '01',
    title: 'Typed content',
    detail: 'Portfolio and case-study modules keep durable content separate from rendering logic.',
    code: 'portfolio.ts · caseStudies.ts',
  },
  {
    number: '02',
    title: 'URL state',
    detail: 'React Router makes the route and case-study slug the shareable source of truth.',
    code: '/work/:slug · /resume',
  },
  {
    number: '03',
    title: 'Interaction state',
    detail: 'Menus, disclosures, loaders, and capability checks stay with the component that owns them.',
    code: 'useState · refs · effects',
  },
  {
    number: '04',
    title: 'Motion state',
    detail: 'Scroll progress and animation values remain isolated from content and navigation state.',
    code: 'MotionValue · reduced motion',
  },
]

export default function EngineeringProof() {
  const reducedMotion = useReducedMotion() ?? false
  const reveal = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 24 },
    visible: { opacity: 1, y: 0 },
  }
  const linkTracked = (label: string, url: string) => () => {
    trackExternalLinkClick(label, url, 'engineering_proof')
  }

  return (
    <section className="section engineering-proof" id="code">
      <div className="container">
        <motion.div
          className="engineering-proof__header"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={reveal}
          transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <p className="section-label">Under the hood</p>
            <h2 className="section-title">
              Public code. <span className="teal">Clear decisions.</span>
            </h2>
          </div>
          <p className="engineering-proof__intro">
            This portfolio is not just a visual demo. Its source and development history are public,
            with state boundaries designed to stay understandable as the experience grows.
          </p>
        </motion.div>

        <div className="engineering-proof__grid">
          <motion.article
            className="engineering-card engineering-card--architecture"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.16 }}
            variants={reveal}
            transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="engineering-card__heading">
              <span className="engineering-card__icon" aria-hidden="true"><Network size={19} /></span>
              <div>
                <p className="engineering-card__eyebrow">Architecture note</p>
                <h3>State management by responsibility</h3>
              </div>
            </div>
            <p className="engineering-card__summary">
              There is intentionally no global store. The site has no shared mutable product data, so each
              kind of state lives at the narrowest stable boundary instead of adding synchronization work.
            </p>
            <ol className="state-flow" aria-label="Portfolio state architecture">
              {stateLayers.map((layer) => (
                <li className="state-flow__item" key={layer.number}>
                  <span className="state-flow__number">{layer.number}</span>
                  <div>
                    <h4>{layer.title}</h4>
                    <p>{layer.detail}</p>
                    <code>{layer.code}</code>
                  </div>
                </li>
              ))}
            </ol>
          </motion.article>

          <motion.article
            className="engineering-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={reveal}
            transition={{ duration: reducedMotion ? 0 : 0.55, delay: reducedMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="engineering-card__heading">
              <span className="engineering-card__icon" aria-hidden="true"><Github size={19} /></span>
              <div>
                <p className="engineering-card__eyebrow">Public engineering</p>
                <h3>Inspect the implementation</h3>
              </div>
            </div>
            <p className="engineering-card__summary">
              Review the React and TypeScript source, animation components, accessibility fallbacks,
              SEO pipeline, and the commits behind the live site.
            </p>
            <div className="engineering-card__links">
              <a href={siteConfig.repository} target="_blank" rel="noopener noreferrer" onClick={linkTracked('portfolio repository', siteConfig.repository)}>
                <Github size={16} aria-hidden="true" /> View repository <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a href={siteConfig.repositoryCommits} target="_blank" rel="noopener noreferrer" onClick={linkTracked('portfolio commit history', siteConfig.repositoryCommits)}>
                <GitCommitHorizontal size={16} aria-hidden="true" /> Read the build history <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </motion.article>

          <motion.article
            className="engineering-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={reveal}
            transition={{ duration: reducedMotion ? 0 : 0.55, delay: reducedMotion ? 0 : 0.14, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="engineering-card__heading">
              <span className="engineering-card__icon" aria-hidden="true"><LockKeyhole size={19} /></span>
              <div>
                <p className="engineering-card__eyebrow">Transparent scope</p>
                <h3>Public work, clearly labeled</h3>
              </div>
            </div>
            <p className="engineering-card__summary">
              Client products are documented through case studies and live releases because their production
              repositories are private. Public source and future community contributions are linked only when
              they can be independently reviewed.
            </p>
            <div className="engineering-card__links">
              <a href={portfolioData.github} target="_blank" rel="noopener noreferrer" onClick={linkTracked('github profile', portfolioData.github)}>
                <Github size={16} aria-hidden="true" /> Follow public work <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  )
}
