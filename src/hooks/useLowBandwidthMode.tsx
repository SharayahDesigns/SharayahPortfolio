import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type NetworkConnection = {
  addEventListener?: (type: 'change', listener: () => void) => void
  removeEventListener?: (type: 'change', listener: () => void) => void
  effectiveType?: string
  saveData?: boolean
  downlink?: number
}

type NavigatorWithConnection = Navigator & {
  connection?: NetworkConnection
  mozConnection?: NetworkConnection
  webkitConnection?: NetworkConnection
}

function getConnection() {
  if (typeof navigator === 'undefined') return null
  const nav = navigator as NavigatorWithConnection
  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection ?? null
}

function detectLowBandwidth() {
  if (typeof window === 'undefined') return false

  const connection = getConnection()
  if (!connection) return false

  // Be conservative here. This mode strips motion, sticky behavior, WebGL,
  // and swaps in lighter images, so false positives are worse than missing a
  // few borderline cases.
  if (connection.saveData) return true

  if (connection.effectiveType && ['slow-2g', '2g'].includes(connection.effectiveType)) {
    return true
  }

  return false
}

const LowBandwidthModeContext = createContext(false)

export function LowBandwidthModeProvider({ children }: { children: ReactNode }) {
  const [isLowBandwidth, setIsLowBandwidth] = useState(() => detectLowBandwidth())

  useEffect(() => {
    const update = () => setIsLowBandwidth(detectLowBandwidth())
    const connection = getConnection()

    update()
    connection?.addEventListener?.('change', update)

    return () => {
      connection?.removeEventListener?.('change', update)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.lowBandwidth = String(isLowBandwidth)
  }, [isLowBandwidth])

  const value = useMemo(() => isLowBandwidth, [isLowBandwidth])

  return (
    <LowBandwidthModeContext.Provider value={value}>
      {children}
    </LowBandwidthModeContext.Provider>
  )
}

export function useLowBandwidthMode() {
  return useContext(LowBandwidthModeContext)
}
