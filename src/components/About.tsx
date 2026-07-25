import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { portfolioData } from '../data/portfolio'
import { Code2, Layers, Palette, Rocket } from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  code: <Code2 size={22} />,
  layers: <Layers size={22} />,
  palette: <Palette size={22} />,
  rocket: <Rocket size={22} />,
}

export default function About() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 })

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  }
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <section className="section" id="about" ref={ref}>
      <div className="container">
        <motion.div
          variants={container}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
        >
          <motion.p className="section-label" variants={item}>About</motion.p>
          <motion.h2 className="section-title" variants={item}>
            {portfolioData.about.heading}
          </motion.h2>

          <div className="about-layout">
            <motion.div className="about-text" variants={item}>
              {portfolioData.about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </motion.div>

            <motion.div className="about-traits" variants={container}>
              {portfolioData.about.cards.map((card) => (
                <motion.div className="trait-card" key={card.title} variants={item} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
                  <div className="trait-icon">{iconMap[card.icon]}</div>
                  <div>
                    <h4 className="trait-title">{card.title}</h4>
                    <p className="trait-desc">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
