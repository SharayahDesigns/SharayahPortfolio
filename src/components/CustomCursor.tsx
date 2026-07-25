import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isPointer, setIsPointer] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [clickScale, setClickScale] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      const target = e.target as HTMLElement
      const interactive =
        target.closest('a, button, [data-cursor="pointer"], input, textarea') !== null
      setIsPointer(interactive)
    }
    const down = () => setClickScale(true)
    const up = () => setClickScale(false)
    const leave = () => setIsHidden(true)
    const enter = () => setIsHidden(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.addEventListener('mouseleave', leave)
    document.addEventListener('mouseenter', enter)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseleave', leave)
      document.removeEventListener('mouseenter', enter)
    }
  }, [])

  return (
    <>
      <div
        className="cursor-dot"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%) scale(${
            clickScale ? 0.5 : 1
          })`,
          opacity: isHidden ? 0 : 1,
        }}
      />
      <div
        className="cursor-ring"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%) scale(${
            isPointer ? 1.8 : clickScale ? 0.7 : 1
          })`,
          opacity: isHidden ? 0 : 1,
          borderColor: isPointer ? 'var(--teal)' : 'rgba(255,255,255,0.3)',
        }}
      />
    </>
  )
}
