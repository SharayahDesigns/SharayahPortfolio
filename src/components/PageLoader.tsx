import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLowBandwidthMode } from '../hooks/useLowBandwidthMode'

const LOADER_TEXT = 'Loading frontend experience'
const TYPE_MS = 42
const EXIT_DELAY_MS = 220

type PageLoaderProps = {
  visible: boolean
  onComplete?: () => void
}

export default function PageLoader({ visible, onComplete }: PageLoaderProps) {
  const isLowBandwidth = useLowBandwidthMode()
  const [typedCount, setTypedCount] = useState(0)

  useEffect(() => {
    if (isLowBandwidth) {
      onComplete?.()
      return
    }

    if (!visible) return

    setTypedCount(0)
    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setTypedCount(index)
      if (index >= LOADER_TEXT.length) {
        window.clearInterval(timer)
        window.setTimeout(() => {
          onComplete?.()
        }, EXIT_DELAY_MS)
      }
    }, TYPE_MS)

    return () => window.clearInterval(timer)
  }, [isLowBandwidth, visible, onComplete])

  if (isLowBandwidth) return null

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
