import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Quote } from 'lucide-react'
import { portfolioData } from '../data/portfolio'

export default function Testimonials() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section" id="testimonials" ref={ref}>
      <div className="container">
        <motion.div variants={container} initial="hidden" animate={inView ? 'show' : 'hidden'}>
          <motion.p className="section-label" variants={item}>What People Say</motion.p>
          <motion.h2 className="section-title" variants={item}>
            Feedback from{' '}
            <br />
            <span className="teal">people I've worked with</span>
          </motion.h2>

          <div className="testimonial-grid">
            {portfolioData.testimonials.map((t) => (
              <motion.figure
                className="testimonial-card"
                key={t.name}
                variants={item}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Quote size={22} className="testimonial-mark" aria-hidden="true" />
                <blockquote className="testimonial-quote">{t.quote}</blockquote>
                <figcaption className="testimonial-author">
                  <span className="testimonial-name">{t.name}</span>
                  <span className="testimonial-role">
                    {t.title} · {t.company}
                  </span>
                  {t.context && <span className="testimonial-context">{t.context}</span>}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
