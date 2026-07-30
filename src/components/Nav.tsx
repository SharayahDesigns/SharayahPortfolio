import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { navItems } from '../data/siteConfig'
import { trackNavClick, trackSectionView } from '../lib/analytics'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/'
  const viewedSections = useRef<Set<string>>(new Set())

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isHome) return
    viewedSections.current = new Set()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive('#' + e.target.id)
            if (!viewedSections.current.has(e.target.id)) {
              viewedSections.current.add(e.target.id)
              trackSectionView(e.target.id)
            }
          }
        })
      },
      { threshold: 0.4 }
    )
    navItems.forEach((l) => {
      if (l.route || !l.section) return
      const el = document.getElementById(l.section)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [isHome])

  function handleSectionClick(label: string, href: string, navLocation: string, e: React.MouseEvent) {
    e.preventDefault()
    setMenuOpen(false)
    trackNavClick(label, href, navLocation)
    if (isHome) {
      const id = href.replace('/#', '')
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate(href)
    }
  }

  return (
    <>
      <motion.nav
        className={`nav${scrolled ? ' nav--scrolled' : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link to="/" className="nav-logo" aria-label="Sharayah Hefner - Home">
          <span className="nav-logo-bracket">&lt;</span>SH<span className="nav-logo-bracket">/&gt;</span>
        </Link>

        <ul className="nav-links">
          {navItems.map((l) => (
            <li key={l.href}>
              {l.route ? (
                <Link
                  to={l.href}
                  onClick={() => trackNavClick(l.label, l.href, 'nav_links')}
                  className={`nav-link${active === '#' + l.section ? ' nav-link--active' : ''}`}
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  href={l.href}
                  onClick={(e) => handleSectionClick(l.label, l.href, 'nav_links', e)}
                  className={`nav-link${active === '#' + l.section ? ' nav-link--active' : ''}`}
                >
                  {l.label}
                  {active === '#' + l.section && (
                    <motion.span className="nav-dot" layoutId="nav-dot" />
                  )}
                </a>
              )}
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <Link
            to="/resume"
            className="nav-resume"
            aria-label="View Résumé"
            onClick={() => trackNavClick('Résumé', '/resume', 'nav_actions')}
          >
            <FileText size={14} />
            <span>Résumé</span>
          </Link>
          <a
            href="/#contact"
            className="nav-cta"
            onClick={(e) => handleSectionClick("Let's Talk", '/#contact', 'nav_actions', e)}
          >
            Let's Talk
          </a>
        </div>

        <button
          type="button"
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
        </button>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {navItems.map((l, i) =>
              l.route ? (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={l.href}
                    className="mobile-link"
                    onClick={() => {
                      setMenuOpen(false)
                      trackNavClick(l.label, l.href, 'mobile_menu')
                    }}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ) : (
                <motion.a
                  key={l.href}
                  href={l.href}
                  className="mobile-link"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={(e) => handleSectionClick(l.label, l.href, 'mobile_menu', e)}
                >
                  {l.label}
                </motion.a>
              )
            )}
            <motion.a
              href="/#contact"
              className="btn btn-primary mobile-cta"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navItems.length * 0.04 }}
              onClick={(e) => handleSectionClick("Let's Talk", '/#contact', 'mobile_menu', e)}
            >
              Let's Talk
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
