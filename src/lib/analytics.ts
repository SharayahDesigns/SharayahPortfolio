import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()
const GA_DEBUG_MODE = import.meta.env.VITE_GA_DEBUG_MODE === 'true'
const GA_DEBUG_STORAGE_KEY = 'ga_debug_mode'
const PAGE_TITLE_BY_PATH: Record<string, string> = {
  '/': 'Sharayah Hefner - Product Engineer, Design Engineer & Frontend UX Engineer',
  '/resume': 'Resume - Sharayah Hefner',
}

declare global {
  interface Window {
    dataLayer: IArguments[]
    gtag?: (...args: unknown[]) => void
  }
}

function hasAnalytics() {
  return Boolean(GA_MEASUREMENT_ID)
}

function getTrackedPageTitle(pathname: string) {
  return PAGE_TITLE_BY_PATH[pathname] || document.title
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
    const timeout = window.setTimeout(() => {
      window.gtag?.('event', 'page_view', {
        page_title: getTrackedPageTitle(location.pathname),
        page_location: window.location.href,
        page_path: `${location.pathname}${location.search}`,
        debug_mode: debugMode,
      })
    }, 0)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [location.pathname, location.search])

  return null
}

export function trackResumeDownload() {
  trackResumeDownloadVariant({
    fileName: 'Sharayah_Hefner_Resume_Creative.pdf',
    filePath: '/Sharayah_Hefner_Resume_Creative.pdf',
    variant: 'creative-dark',
  })
}

export function trackResumeDownloadVariant({
  fileName,
  filePath,
  variant,
}: {
  fileName: string
  filePath: string
  variant: string
}) {
  if (!hasAnalytics() || !window.gtag) return
  const debugMode = isDebugModeEnabled()

  window.gtag('event', 'resume_download', {
    file_name: fileName,
    file_extension: 'pdf',
    link_url: `${window.location.origin}${filePath}`,
    content_type: 'resume',
    resume_variant: variant,
    debug_mode: debugMode,
  })
}

type AnalyticsParams = Record<string, string | number | boolean | undefined>

function trackEvent(eventName: string, params: AnalyticsParams) {
  if (!hasAnalytics() || !window.gtag) return
  window.gtag('event', eventName, {
    ...params,
    debug_mode: isDebugModeEnabled(),
  })
}

export function trackProjectClick(projectName: string, destinationPath: string) {
  trackEvent('project_click', {
    project_name: projectName,
    destination_path: destinationPath,
  })
}

export function trackCaseStudyView(slug: string, title: string) {
  trackEvent('case_study_view', {
    case_study_slug: slug,
    case_study_title: title,
  })
}

export function trackExternalLinkClick(label: string, url: string, location: string) {
  trackEvent('external_link_click', {
    link_label: label,
    link_url: url,
    link_location: location,
  })
}

export function trackContactClick(method: string, location: string) {
  trackEvent('contact_click', {
    contact_method: method,
    contact_location: location,
  })
}

export function trackNavClick(label: string, destination: string, location: string) {
  trackEvent('nav_click', {
    nav_label: label,
    destination,
    nav_location: location,
  })
}

export function trackSectionView(sectionId: string) {
  trackEvent('section_view', {
    section_id: sectionId,
  })
}

export function trackPageNotFound(path: string) {
  trackEvent('page_not_found', {
    path,
    referrer: typeof document !== 'undefined' ? document.referrer || '(direct)' : '(direct)',
  })
}

export { GA_MEASUREMENT_ID }
