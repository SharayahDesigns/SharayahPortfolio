import { useLayoutEffect, useRef } from 'react'
import About from './About'
import Projects from './Projects'

export default function AboutProjectsStack() {
  const stackRef = useRef<HTMLDivElement>(null)
  const aboutLayerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const stack = stackRef.current
    const layer = aboutLayerRef.current
    if (!stack || !layer) return

    const updateStickyOffset = () => {
      const overflow = Math.max(0, layer.offsetHeight - window.innerHeight)
      layer.style.setProperty('--about-sticky-top', `${-overflow}px`)
      // About pins once its bottom meets the viewport bottom, but the projects
      // shell only reaches the top of the viewport a full screen later — that gap
      // reads as dead scroll. Pull the shell up by exactly that gap so the
      // horizontal slide starts the moment About stops moving.
      const deadZone = Math.min(layer.offsetHeight, window.innerHeight)
      stack.style.setProperty('--projects-overlap', `${deadZone}px`)
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
    <div className="about-projects-stack" ref={stackRef}>
      <div className="about-sticky-layer" ref={aboutLayerRef}>
        <About />
      </div>
      <Projects />
    </div>
  )
}
