import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import SEO from './SEO'
import { trackPageNotFound } from '../lib/analytics'
import { ArrowLeft, FolderOpen } from 'lucide-react'

export default function NotFoundPage() {
  const location = useLocation()

  useEffect(() => {
    trackPageNotFound(`${location.pathname}${location.search}`)
    // Fire once per landing on a broken URL, not on every re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <SEO
        title="404 - Page Not Found | Sharayah Hefner"
        description="The page you were looking for could not be found."
        path="/404"
        noindex
      />
      <main className="not-found">
        <div className="not-found-glow" />
        <motion.div
          className="not-found-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="not-found-label">Error</p>
          <h1 className="not-found-title">404 - Page Not Found</h1>
          <p className="not-found-body">
            The page you were looking for could not be found. It may have been moved,
            renamed, or never existed.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="btn btn-primary">
              <ArrowLeft size={16} /> Back to Home
            </Link>
            <Link to="/#projects" className="btn btn-ghost">
              <FolderOpen size={16} /> View My Work
            </Link>
          </div>
        </motion.div>
      </main>
    </>
  )
}
