import { useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue, Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router-dom'
import { portfolioData } from '../data/portfolio'
import { TechMark } from './TechMarks'
import { ArrowRight, Code2, MapPin, PenTool, Quote, Rocket, Send, Users } from 'lucide-react'

const statIcons: Record<string, React.ReactNode> = {
  code: <Code2 size={18} />,
  rocket: <Rocket size={18} />,
  users: <Users size={18} />,
  pin: <MapPin size={18} />,
}

const stepIcons: Record<string, React.ReactNode> = {
  users: <Users size={18} />,
  pen: <PenTool size={18} />,
  code: <Code2 size={18} />,
  send: <Send size={18} />,
}

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const reducedMotion = useReducedMotion() ?? false
  const { about } = portfolioData

  // Documented Motion recipe: a tall track with a `position: sticky` 100vh
  // stage inside it. The stage holds the portrait centred, so its pinned
  // position is its starting position and it never shifts — scroll progress
  // only drives the transforms.
  const runwayRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: dive } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  })

  // Accelerates into the screen once the About content has been read.
  const diveScale = useTransform(dive, [0, 0.28, 0.55, 1], [1, 2.2, 7, 22])
  const chromeFade = useTransform(dive, [0.02, 0.2], [1, 0])
  const screenFade = useTransform(dive, [0.18, 0.34], [0, 1])
  const phoneFade = useTransform(dive, [0.6, 0.8], [1, 0])
  const glowFade = useTransform(dive, [0.3, 0.6, 0.85], [0, 0.45, 0])

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  }
  const item = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section about-section" id="about" ref={ref}>
      <div className="container">
        <motion.div className="about-grid" variants={container} initial="hidden" animate={inView ? 'show' : 'hidden'}>
        {/* ===== Intro column ===== */}
          <div className="about-intro">
            <motion.p className="section-label" variants={item}>{about.eyebrow}</motion.p>

            <motion.h2 className="about-heading" variants={item}>
              {about.headingLines.map((line) => (
                <span className="about-heading-line" key={line.lead}>
                  {line.lead} <span className="teal">{line.accent}</span>
                </span>
              ))}
            </motion.h2>

            <motion.p className="about-lede" variants={item}>{about.lede}</motion.p>

            <motion.dl className="about-stats" variants={container}>
              {about.stats.map((stat) => (
                <motion.div className="about-stat" key={stat.label} variants={item}>
                  <span className="about-stat-icon">{statIcons[stat.icon]}</span>
                  <dt className="about-stat-value">{stat.value}</dt>
                  <dd className="about-stat-label">{stat.label}</dd>
                </motion.div>
              ))}
            </motion.dl>

            <motion.p className="about-script" variants={item}>
              {about.script}
              <svg className="about-script-underline" viewBox="0 0 320 14" aria-hidden="true" focusable="false">
                <path
                  d="M3 9.5C58 4.2 128 2.5 196 3.6c42 .7 80 2.6 121 5.9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </motion.p>
          </div>

          {/* ===== Portrait column — pins, then dives ===== */}
          <div className="about-portrait">
            <motion.div className="about-portrait-stage" variants={item}>
              {/* everything anchors to the phone box, not the full-height stage */}
              <div className="about-portrait-rig">
                <motion.span
                  className="about-portrait-dots"
                  aria-hidden="true"
                  style={reducedMotion ? undefined : { opacity: chromeFade }}
                />
                <motion.span
                  className="about-portrait-glow"
                  aria-hidden="true"
                  style={reducedMotion ? undefined : { opacity: chromeFade }}
                />

                {/* the screen plate carries the Selected Work background out
                    of the phone as it swallows the viewport */}
                <motion.span
                  className="about-portrait-screen"
                  aria-hidden="true"
                  style={reducedMotion ? { opacity: 0 } : { scale: diveScale, opacity: screenFade }}
                >
                  <motion.span
                    className="about-portrait-screen-glow"
                    style={reducedMotion ? undefined : { opacity: glowFade }}
                  />
                </motion.span>

                <Portrait
                  scale={reducedMotion ? undefined : diveScale}
                  opacity={reducedMotion ? undefined : phoneFade}
                />
                <motion.div
                  className="about-tech"
                  style={reducedMotion ? undefined : { opacity: chromeFade }}
                >
                  <p className="about-tech-label">{about.techLabel}</p>
                  <ul className="about-tech-grid">
                    {about.tech.map((tech) => (
                      <li key={tech.name}>
                        <span className="about-tech-tile" title={tech.name}>
                          <TechMark mark={tech.mark} />
                          <span className="sr-only">{tech.name}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </motion.div>
        </div>

          {/* ===== Approach + note ===== */}
          <div className="about-panels">
            <motion.div className="about-panel about-approach" variants={item}>
              <div className="approach-head">
                <div>
                  <p className="section-label">{about.approach.eyebrow}</p>
                  <h3 className="approach-title">
                    {about.approach.title}
                    <br />
                    {about.approach.titleSecond}
                    <span className="teal">.</span>
                  </h3>
                </div>
                <p className="approach-intro">{about.approach.intro}</p>
              </div>

              <ol className="approach-steps">
                {about.approach.steps.map((step, i) => (
                  <li className="approach-step" key={step.title}>
                    <span className={`approach-step-icon${i === 0 ? ' is-first' : ''}`}>
                      {stepIcons[step.icon]}
                    </span>
                    <span className="approach-step-number">{String(i + 1).padStart(2, '0')}</span>
                    <h4 className="approach-step-title">{step.title}</h4>
                    <p className="approach-step-desc">{step.desc}</p>
                  </li>
                ))}
              </ol>
            </motion.div>

            <motion.figure className="about-panel about-note" variants={item}>
              <Quote className="about-note-mark" size={34} aria-hidden="true" />
              <blockquote className="about-note-quote">{about.note.quote}</blockquote>
              <figcaption>
                <span className="about-note-rule" aria-hidden="true" />
                <span className="about-note-location">
                  <MapPin size={15} /> {about.note.location}
                </span>
              </figcaption>
              <Link to={about.note.ctaHref} className="about-note-cta">
                {about.note.ctaLabel} <ArrowRight size={16} />
              </Link>
            </motion.figure>
          </div>

          {!reducedMotion && <div className="about-runway" ref={runwayRef} aria-hidden="true" />}
        </motion.div>
      </div>
    </section>
  )
}

/** Falls back to a monogram panel until the portrait file is added. */
function Portrait({ scale, opacity }: { scale?: MotionValue<number>; opacity?: MotionValue<number> }) {
  const { portrait, eyebrow } = portfolioData.about
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className="about-portrait-frame">
        <div className="about-portrait-placeholder" role="img" aria-label={portrait.alt}>
          <span className="about-portrait-monogram">SH</span>
          <span className="about-portrait-caption">{eyebrow}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="about-portrait-frame">
      <motion.img
        src={portrait.src}
        alt={portrait.alt}
        width={portrait.width}
        height={portrait.height}
        loading="lazy"
        decoding="async"
        style={{ scale, opacity }}
        onError={() => setFailed(true)}
      />
    </div>
  )
}
