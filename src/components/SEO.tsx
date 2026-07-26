import { useEffect } from 'react'
import { siteConfig } from '../data/siteConfig'

type SEOProps = {
  title: string
  description: string
  path: string
  image?: string
  type?: string
  noindex?: boolean
  /** Social-share title; falls back to the page title. */
  ogTitle?: string
  /** Social-share description; falls back to the meta description. */
  ogDescription?: string
}

function upsertMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(id: string, data: object) {
  let el = document.head.querySelector<HTMLScriptElement>(`script[data-jsonld="${id}"]`)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.setAttribute('data-jsonld', id)
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

function removeJsonLd(id: string) {
  const el = document.head.querySelector(`script[data-jsonld="${id}"]`)
  if (el) el.remove()
}

export default function SEO({ title, description, path, image = '/og-image.png', type = 'article', noindex = false, ogTitle, ogDescription }: SEOProps) {
  useEffect(() => {
    const url = `${siteConfig.origin}${path}`
    const img = image.startsWith('http') ? image : `${siteConfig.origin}${image}`
    const socialTitle = ogTitle || title
    const socialDescription = ogDescription || description

    document.title = title

    upsertMeta('description', description)
    upsertLink('canonical', url)

    if (noindex) {
      upsertMeta('robots', 'noindex, follow')
    } else {
      const robotsEl = document.head.querySelector('meta[name="robots"]')
      if (robotsEl) robotsEl.remove()
    }

    upsertMeta('og:title', socialTitle, 'property')
    upsertMeta('og:description', socialDescription, 'property')
    upsertMeta('og:url', url, 'property')
    upsertMeta('og:image', img, 'property')
    upsertMeta('og:type', type, 'property')

    upsertMeta('twitter:card', 'summary_large_image')
    upsertMeta('twitter:title', socialTitle)
    upsertMeta('twitter:description', socialDescription)
    upsertMeta('twitter:image', img)

    return () => {
      removeJsonLd('page-jsonld')
    }
  }, [title, description, path, image, type, noindex, ogTitle, ogDescription])

  return null
}

export { upsertJsonLd, removeJsonLd, upsertMeta, upsertLink }
