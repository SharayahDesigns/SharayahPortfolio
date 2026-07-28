import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const LOADER_TEXT = 'Loading frontend experience'
const TYPE_MS = 42

type PageLoaderProps = {
  visible: boolean
}

export default function PageLoader({ visible }: PageLoaderProps) {
  const [typedCount, setTypedCount] = useState(0)

  useEffect(() => {
    if (!visible) return

    setTypedCount(0)
    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setTypedCount(index)
      if (index >= LOADER_TEXT.length) {
        window.clearInterval(timer)
      }
    }, TYPE_MS)

    return () => window.clearInterval(timer)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } }}
          aria-live="polite"
          aria-label="Page loading"
        >
          <div className="page-loader__inner">
            <div className="page-loader__line">
              <span className="page-loader__prompt">{'>'}</span>
              <span>{LOADER_TEXT.slice(0, typedCount)}</span>
              <span className="page-loader__caret" aria-hidden="true" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
