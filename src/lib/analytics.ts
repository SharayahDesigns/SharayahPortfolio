import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim()

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

function gtag(...args: unknown[]) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push(args)
}

function hasAnalytics() {
  return Boolean(GA_MEASUREMENT_ID)
}

function ensureAnalyticsScript() {
  if (!hasAnalytics()) return
  if (window.gtag) return

  window.dataLayer = window.dataLayer || []
  window.gtag = function analyticsProxy(...args: unknown[]) {
    gtag(...args)
  }

  const existing = document.querySelector<HTMLScriptElement>(`script[data-ga="${GA_MEASUREMENT_ID}"]`)
  if (!existing) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    script.setAttribute('data-ga', GA_MEASUREMENT_ID)
    document.head.appendChild(script)
  }

  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
  })
}

export function AnalyticsRouterTracker() {
  const location = useLocation()

  useEffect(() => {
    ensureAnalyticsScript()
  }, [])

  useEffect(() => {
    if (!hasAnalytics() || !window.gtag) return

    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: `${location.pathname}${location.search}`,
    })
  }, [location.pathname, location.search])

  return null
}

export function trackResumeDownload() {
  if (!hasAnalytics() || !window.gtag) return

  window.gtag('event', 'resume_download', {
    file_name: 'Sharayah_Hefner_Frontend_UX_Engineer_Resume.pdf',
    file_extension: 'pdf',
    link_url: `${window.location.origin}/Sharayah_Hefner_Frontend_UX_Engineer_Resume.pdf`,
    content_type: 'resume',
  })
}

export { GA_MEASUREMENT_ID }
