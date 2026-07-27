import { useEffect, useRef } from 'react'
import About from './About'
import Projects from './Projects'

export default function AboutProjectsStack() {
  const aboutLayerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const layer = aboutLayerRef.current
    if (!layer) return

    const updateStickyOffset = () => {
      const overflow = Math.max(0, layer.offsetHeight - window.innerHeight)
      layer.style.setProperty('--about-sticky-top', `${-overflow}px`)
    }

    updateStickyOffset()
    const observer = new ResizeObserver(updateStickyOffset)
    observer.observe(layer)
    window.addEventListener('resize', updateStickyOffset)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateStickyOffset)
    }
  }, [])

  return (
    <div className="about-projects-stack">
      <div className="about-sticky-layer" ref={aboutLayerRef}>
        <About />
      </div>
      <Projects />
    </div>
  )
}
