import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()
const GA_DEBUG_MODE = import.meta.env.VITE_GA_DEBUG_MODE === 'true'
const GA_DEBUG_STORAGE_KEY = 'ga_debug_mode'

declare global {
  interface Window {
    dataLayer: IArguments[]
    gtag?: (...args: unknown[]) => void
  }
}

function hasAnalytics() {
  return Boolean(GA_MEASUREMENT_ID)
}

function isDebugModeEnabled() {
  if (typeof window === 'undefined') return GA_DEBUG_MODE

  const params = new URLSearchParams(window.location.search)
  const urlDebug = params.get('ga_debug')

  if (urlDebug === '1' || urlDebug === 'true') {
    window.localStorage.setItem(GA_DEBUG_STORAGE_KEY, 'true')
    return true
  }

  if (urlDebug === '0' || urlDebug === 'false') {
    window.localStorage.removeItem(GA_DEBUG_STORAGE_KEY)
    return GA_DEBUG_MODE
  }

  return GA_DEBUG_MODE || window.localStorage.getItem(GA_DEBUG_STORAGE_KEY) === 'true'
}

function ensureAnalyticsScript() {
  if (!hasAnalytics()) return
  if (window.gtag) return

  window.dataLayer = window.dataLayer || []
  window.gtag = function analyticsProxy(this: Window) {
    window.dataLayer.push(arguments)
  }

  const existing = document.querySelector<HTMLScriptElement>(`script[data-ga="${GA_MEASUREMENT_ID}"]`)
  if (!existing) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    script.setAttribute('data-ga', GA_MEASUREMENT_ID)
    document.head.appendChild(script)
  }

  const debugMode = isDebugModeEnabled()

  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
    debug_mode: debugMode,
  })
}

export function AnalyticsRouterTracker() {
  const location = useLocation()

  useEffect(() => {
    ensureAnalyticsScript()
  }, [])

  useEffect(() => {
    if (!hasAnalytics() || !window.gtag) return

    const debugMode = isDebugModeEnabled()
    const frame = window.requestAnimationFrame(() => {
      window.gtag?.('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: `${location.pathname}${location.search}`,
        debug_mode: debugMode,
      })
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [location.pathname, location.search])

  return null
}

export function trackResumeDownload() {
  if (!hasAnalytics() || !window.gtag) return
  const debugMode = isDebugModeEnabled()

  window.gtag('event', 'resume_download', {
    file_name: 'Sharayah_Hefner_Frontend_UX_Engineer_Resume.pdf',
    file_extension: 'pdf',
    link_url: `${window.location.origin}/Sharayah_Hefner_Frontend_UX_Engineer_Resume.pdf`,
    content_type: 'resume',
    debug_mode: debugMode,
  })
}

export { GA_MEASUREMENT_ID }
