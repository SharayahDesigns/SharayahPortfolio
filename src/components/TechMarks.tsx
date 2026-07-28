/**
 * Brand marks for the "Tech I work with" grid, in each brand's own colours.
 *
 * Everything is drawn with explicit fills rather than `currentColor`; the
 * whole point is that the tiles no longer inherit the text colour. The two
 * brands whose marks are black (Vercel, GitHub) and the one that is black or
 * white (Next.js) are rendered white, since the grid sits on a dark surface.
 */

const BRAND: Record<string, string> = {
  react: '#61DAFB',
  ts: '#3178C6',
  next: '#FFFFFF',
  js: '#F7DF1E',
  figma: '#A259FF',
  ps: '#31A8FF',
  ai: '#FF9A00',
  github: '#FFFFFF',
  vercel: '#FFFFFF',
  aws: '#FF9900',
}

/**
 * Hover tint per tile, pre-mixed to rgba(). Handed to CSS as `--brand-tint`.
 *
 * Not `color-mix(... , transparent)` in the stylesheet: that computes to fully
 * transparent here even when forced with `!important`, so the tint silently
 * never appeared. Mixing the alpha in JS sidesteps it entirely.
 */
export const techBrandTint: Record<string, string> = Object.fromEntries(
  Object.entries(BRAND).map(([k, hex]) => {
    const n = parseInt(hex.slice(1), 16)
    return [k, `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, 0.16)`]
  })
)

function ReactMark() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#61DAFB" strokeWidth="1.1" aria-hidden="true">
      <circle cx="12" cy="12" r="2.1" fill="#61DAFB" stroke="none" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
    </svg>
  )
}

function NextMark() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="#FFFFFF" />
      <path d="M8.6 16.6V7.4h1.6l5.2 7.4V7.4" fill="none" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function VercelMark() {
  return (
    <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
      <path d="M12 4.5 21.5 20H2.5Z" fill="#FFFFFF" />
    </svg>
  )
}

/** The five-shape Figma logo, at its native 38x57 proportions. */
function FigmaMark() {
  return (
    <svg viewBox="0 0 38 57" width="15" height="22" aria-hidden="true">
      <path fill="#1ABCFE" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
      <path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
      <path fill="#FF7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
      <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
      <path fill="#A259FF" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
    </svg>
  )
}

/** The Octocat, filled white, because GitHub's own #181717 would vanish here. */
function GithubMark() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        fill="#FFFFFF"
        d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.9 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.2 4 18.2 4.3 18.2 4.3c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z"
      />
    </svg>
  )
}

function LetterMark({ label, bg, fg, ring }: { label: string; bg: string; fg: string; ring?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      {/* The Adobe tiles are near-black, so they need a keyline to read at all
          against a dark surface. */}
      <rect
        x="1.6"
        y="1.6"
        width="20.8"
        height="20.8"
        rx="5"
        fill={bg}
        stroke={ring ?? 'none'}
        strokeWidth={ring ? 1.1 : 0}
      />
      <text
        x="12"
        y="12"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-display), sans-serif"
        fontSize={label.length > 2 ? 7 : 9}
        fontWeight="700"
        fill={fg}
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
      return <LetterMark label="TS" bg="#3178C6" fg="#FFFFFF" />
    case 'js':
      return <LetterMark label="JS" bg="#F7DF1E" fg="#0A0A0A" />
    case 'aws':
      return <LetterMark label="AWS" bg="#FF9900" fg="#141414" />
    case 'figma':
      return <FigmaMark />
    // Creative Cloud app-icon colours: deep tile, bright lettering.
    case 'ps':
      return <LetterMark label="Ps" bg="#001E36" fg="#31A8FF" ring="#31A8FF" />
    case 'ai':
      return <LetterMark label="Ai" bg="#330000" fg="#FF9A00" ring="#FF9A00" />
    case 'github':
      return <GithubMark />
    default:
      return null
  }
}
