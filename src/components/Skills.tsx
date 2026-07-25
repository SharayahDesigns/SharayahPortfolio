import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { portfolioData } from '../data/portfolio'

export default function Skills() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  }
  const chip = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section skills-section" id="skills" ref={ref}>
      <div className="container">
        <motion.div variants={container} initial="hidden" animate={inView ? 'show' : 'hidden'}>
          <motion.p className="section-label" variants={item}>Expertise</motion.p>
          <motion.h2 className="section-title" variants={item}>
            A toolkit built for{' '}
            <br />
            <span className="teal">production frontends</span>
          </motion.h2>

          <motion.div className="skills-grid" variants={container}>
            {portfolioData.skillGroups.map((group) => (
              <motion.div className="skill-group" key={group.label} variants={item}>
                <h3 className="skill-group-label">{group.label}</h3>
                <div className="skill-chips">
                  {group.skills.map((s) => (
                    <motion.span
                      key={s}
                      className="skill-chip"
                      variants={chip}
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: 'rgba(0, 255, 198, 0.1)',
                        borderColor: 'rgba(0, 255, 198, 0.4)',
                        color: '#00ffc6',
                        transition: { duration: 0.15 },
                      }}
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="additional-skills" variants={item}>
            <h4 className="additional-skills-label">Additional Experience</h4>
            <div className="skill-chips">
              {portfolioData.additionalSkills.map((s) => (
                <span className="skill-chip skill-chip--muted" key={s}>{s}</span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
