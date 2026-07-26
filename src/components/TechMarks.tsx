import { Figma, Github } from 'lucide-react'

/**
 * Compact brand marks for the "Tech I work with" grid. lucide only ships a
 * couple of the brands used here, so the rest are minimal inline shapes and
 * lettermarks drawn to sit on the same 24px grid.
 */

function ReactMark() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
      <circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
    </svg>
  )
}

function NextMark() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <circle cx="12" cy="12" r="10.4" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8.6 16.2V7.8h1.5l5 7.1V7.8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function VercelMark() {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
      <path d="M12 4.5 21.5 20H2.5Z" fill="currentColor" />
    </svg>
  )
}

function LetterMark({ label, rounded = 5 }: { label: string; rounded?: number }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <rect x="1.6" y="1.6" width="20.8" height="20.8" rx={rounded} fill="currentColor" />
      <text
        x="12"
        y="12"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-display), sans-serif"
        fontSize={label.length > 2 ? 7 : 9}
        fontWeight="700"
        fill="var(--bg-primary)"
      >
        {label}
      </text>
    </svg>
  )
}

export function TechMark({ mark }: { mark: string }) {
  switch (mark) {
    case 'react':
      return <ReactMark />
    case 'next':
      return <NextMark />
    case 'vercel':
      return <VercelMark />
    case 'ts':
      return <LetterMark label="TS" />
    case 'js':
      return <LetterMark label="JS" />
    case 'aws':
      return <LetterMark label="AWS" />
    case 'figma':
      return <Figma size={21} aria-hidden="true" />
    case 'github':
      return <Github size={22} aria-hidden="true" />
    default:
      return null
  }
}
