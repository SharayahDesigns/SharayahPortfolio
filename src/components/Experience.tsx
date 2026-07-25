import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { portfolioData } from '../data/portfolio'
import { Calendar } from 'lucide-react'

function ExperienceCard({
  exp,
  index,
}: {
  exp: (typeof portfolioData.experience)[0]
  index: number
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <motion.div
      ref={ref}
      className="exp-card"
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div className="exp-card-header">
        <div>
          <h3 className="exp-title">{exp.title}</h3>
          <p className="exp-company" style={{ color: exp.color }}>
            {exp.company}
          </p>
        </div>
        <div className="exp-meta">
          <Calendar size={13} />
          <span>{exp.period}</span>
        </div>
      </div>

      <ul className="exp-bullets">
        {exp.bullets.map((b, i) => (
          <li key={i}>
            <span className="exp-bullet-dot" style={{ background: exp.color }} />
            {b}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function Experience() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section className="section" id="experience">
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p className="section-label">Experience</p>
          <h2 className="section-title">
            Frontend roles across{' '}
            <br />
            <span className="teal">e-commerce & SaaS</span>
          </h2>
        </motion.div>

        <div className="exp-timeline">
          <div className="exp-timeline-line" />
          {portfolioData.experience.map((exp, i) => (
            <div className="exp-timeline-item" key={exp.company}>
              <div className="exp-timeline-dot" style={{ background: exp.color, boxShadow: `0 0 12px ${exp.color}` }} />
              <ExperienceCard exp={exp} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
