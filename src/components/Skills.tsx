import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Plus } from 'lucide-react'
import { portfolioData } from '../data/portfolio'

export default function Skills() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const reducedMotion = useReducedMotion() ?? false
  // Every box starts closed. A set rather than a single open index, so opening
  // one box does not slam another shut mid-read.
  const [openBoxes, setOpenBoxes] = useState<Set<string>>(new Set())

  const { skillGroups, skillsFigure } = portfolioData

  const toggle = (label: string) =>
    setOpenBoxes((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })

  // Alternating rather than first-half/second-half: with an odd group count
  // that keeps the two stacks level instead of leaving one side short.
  const left = skillGroups.filter((_, i) => i % 2 === 0)
  const right = skillGroups.filter((_, i) => i % 2 === 1)

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  }
  const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  }

  const renderBox = (group: (typeof skillGroups)[number]) => (
    <SkillBox
      key={group.label}
      group={group}
      isOpen={openBoxes.has(group.label)}
      onToggle={() => toggle(group.label)}
      reducedMotion={reducedMotion}
      variants={item}
    />
  )

  return (
    <section className="section skills-section" id="skills" ref={ref}>
      <div className="container">
        <motion.div variants={container} initial="hidden" animate={inView ? 'show' : 'hidden'}>
          <motion.p className="section-label" variants={item}>My Toolbox</motion.p>
          <motion.h2 className="section-title" variants={item}>
            A toolkit built for{' '}
            <br />
            <span className="teal">production frontends</span>
          </motion.h2>

          <motion.div className="toolbox" variants={container}>
            <div className="toolbox-col">{left.map(renderBox)}</div>

            <motion.div className="toolbox-figure" variants={item}>
              <span className="toolbox-glow" aria-hidden="true" />
              <img
                src={skillsFigure.src}
                alt={skillsFigure.alt}
                width={skillsFigure.width}
                height={skillsFigure.height}
                loading="lazy"
                decoding="async"
              />
              <span className="toolbox-stand" aria-hidden="true" />
              <p className={`toolbox-hint${openBoxes.size ? ' is-hidden' : ''}`}>Open a box</p>
            </motion.div>

            <div className="toolbox-col">
              {right.map(renderBox)}
              <motion.div className="additional-skills additional-skills--sidebox" variants={item}>
                <h4 className="additional-skills-label">Backend &amp; Security</h4>
                <div className="skill-chips">
                  {portfolioData.additionalSkills.map((s) => (
                    <span className="skill-chip skill-chip--muted" key={s}>{s}</span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function SkillBox({
  group,
  isOpen,
  onToggle,
  reducedMotion,
  variants,
}: {
  group: { label: string; skills: readonly string[] }
  isOpen: boolean
  onToggle: () => void
  reducedMotion: boolean
  variants: Variants
}) {
  const panelId = `skillbox-${group.label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`

  return (
    <motion.div className={`skill-box${isOpen ? ' is-open' : ''}`} variants={variants}>
      <button
        type="button"
        className="skill-box-lid"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="skill-box-label">{group.label}</span>
        <span className="skill-box-count">{group.skills.length}</span>
        <span className="skill-box-toggle" aria-hidden="true">
          <Plus size={16} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            className="skill-box-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    height: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
                    opacity: { duration: 0.26 },
                  }
            }
          >
            <div className="skill-box-panel-inner">
              <div className="skill-chips">
                {group.skills.map((s, i) => (
                  <motion.span
                    key={s}
                    className="skill-chip"
                    initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: reducedMotion ? 0 : 0.08 + i * 0.022, duration: 0.28 }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
