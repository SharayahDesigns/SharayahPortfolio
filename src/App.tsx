import { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CustomCursor from './components/CustomCursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Footer from './components/Footer'
import BackToTopButton from './components/BackToTopButton'
import ScrollProgress from './components/ScrollProgress'
import ScrollToTop from './components/ScrollToTop'
import NotFoundPage from './components/NotFoundPage'
import PageLoader from './components/PageLoader'
import { AnalyticsRouterTracker } from './lib/analytics'
import SEO from './components/SEO'
import { upsertJsonLd, removeJsonLd } from './components/SEO'
import { siteConfig, resumePdfPath } from './data/siteConfig'
import { portfolioData } from './data/portfolio'
import { useMediaQuery } from './hooks/useMediaQuery'

const AboutProjectsStack = lazy(() => import('./components/AboutProjectsStack'))
const Experience = lazy(() => import('./components/Experience'))
const Skills = lazy(() => import('./components/Skills'))
const Education = lazy(() => import('./components/Education'))
const StoryParallax = lazy(() => import('./components/StoryParallax'))
const Contact = lazy(() => import('./components/Contact'))
const CaseStudyPage = lazy(() => import('./components/CaseStudyPage'))
const ResumePage = lazy(() => import('./components/ResumePage'))

type IdleWindow = Window & {
  cancelIdleCallback?: (id: number) => void
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => number
}

let hasShownIntroLoaderInAppSession = false

function BelowFoldFallback() {
  return <div className="below-fold-fallback" aria-hidden="true" />
}

function shouldShowIntroLoader() {
  return !hasShownIntroLoaderInAppSession
}

function HomePage() {
  const isMobileViewport = useMediaQuery('(max-width: 900px)')
  const isCoarsePointer = useMediaQuery('(pointer: coarse)')
  const deferHeavyContent = isMobileViewport || isCoarsePointer
  const [showBelowFoldContent, setShowBelowFoldContent] = useState(!deferHeavyContent)
  const [showIntroLoader, setShowIntroLoader] = useState(() => shouldShowIntroLoader())

  useEffect(() => {
    upsertJsonLd('page-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: `${siteConfig.name} — ${siteConfig.title}`,
      description: 'Frontend UX Engineer and Design Engineer specializing in React, Next.js, e-commerce, design systems, interaction design, and polished production experiences.',
      url: `${siteConfig.origin}/`,
      mainEntity: {
        '@type': 'Person',
        name: siteConfig.name,
        jobTitle: siteConfig.title,
        url: siteConfig.origin,
        email: `mailto:${siteConfig.email}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Herriman',
          addressRegion: 'Utah',
          addressCountry: 'US',
        },
        alumniOf: 'Southern New Hampshire University',
        knowsAbout: ['React', 'Next.js', 'TypeScript', 'UX Design', 'Design Systems', 'E-Commerce', 'Frontend Development', 'Accessibility', 'Animation'],
        sameAs: [
          portfolioData.github,
          portfolioData.linkedin,
        ],
      },
    })
    return () => removeJsonLd('page-jsonld')
  }, [])

  useEffect(() => {
    if (!showIntroLoader) return
    hasShownIntroLoaderInAppSession = true
  }, [showIntroLoader])

  useEffect(() => {
    if (!deferHeavyContent) {
      setShowBelowFoldContent(true)
      return
    }

    const idleWindow = window as IdleWindow
    let timeoutId = 0
    let idleId: number | undefined

    const reveal = () => setShowBelowFoldContent(true)

    if (typeof idleWindow.requestIdleCallback === 'function') {
      idleId = idleWindow.requestIdleCallback(reveal, { timeout: 1200 })
    } else {
      timeoutId = window.setTimeout(reveal, 700)
    }

    return () => {
      if (idleId != null && typeof idleWindow.cancelIdleCallback === 'function') {
        idleWindow.cancelIdleCallback(idleId)
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
    }
  }, [deferHeavyContent])

  return (
    <>
      <PageLoader
        visible={showIntroLoader}
        onComplete={() => {
          setShowIntroLoader(false)
        }}
      />
      <SEO
        title={`${siteConfig.name} — ${siteConfig.title}`}
        description="Frontend UX Engineer and Design Engineer specializing in React, Next.js, e-commerce, design systems, interaction design, and polished production experiences."
        path="/"
        image="/images/shareImage.png"
        imageAlt="Sharayah Hefner portfolio preview"
        type="website"
      />
      <Nav />
      <main className="home-main">
        <Hero />
        <div className="home-content-stack">
          {showBelowFoldContent ? (
            <Suspense fallback={<BelowFoldFallback />}>
              <AboutProjectsStack />
              <Experience />
              <Skills />
              <Education />
              <StoryParallax />
              <Contact />
            </Suspense>
          ) : (
            <BelowFoldFallback />
          )}
        </div>
      </main>
      <BackToTopButton />
      <Footer />
    </>
  )
}

function CaseStudyLayout() {
  return (
    <>
      <Nav />
      <main>
        <Suspense fallback={null}>
          <CaseStudyPage />
        </Suspense>
      </main>
      <BackToTopButton />
      <Footer />
    </>
  )
}

function ResumeLayout() {
  useEffect(() => {
    upsertJsonLd('page-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      name: `${siteConfig.name} Résumé`,
      description: 'Online résumé for Sharayah Hefner, Frontend UX Engineer and Design Engineer.',
      url: `${siteConfig.origin}/resume`,
      mainEntity: {
        '@type': 'Person',
        name: siteConfig.name,
        jobTitle: siteConfig.title,
        url: `${siteConfig.origin}/resume`,
        email: `mailto:${siteConfig.email}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Herriman',
          addressRegion: 'Utah',
          addressCountry: 'US',
        },
        alumniOf: 'Southern New Hampshire University',
        knowsAbout: ['React', 'Next.js', 'TypeScript', 'UX Design', 'Design Systems', 'E-Commerce', 'Frontend Development', 'Accessibility', 'Animation'],
        sameAs: [
          portfolioData.github,
          portfolioData.linkedin,
        ],
      },
      subjectOf: {
        '@type': 'DigitalDocument',
        name: 'Sharayah Hefner Résumé',
        url: `${siteConfig.origin}${resumePdfPath}`,
        encodingFormat: 'application/pdf',
      },
    })
    return () => removeJsonLd('page-jsonld')
  }, [])

  return (
    <>
      <Nav />
      <main>
        <Suspense fallback={null}>
          <ResumePage />
        </Suspense>
      </main>
      <BackToTopButton />
      <Footer />
    </>
  )
}

function NotFoundLayout() {
  return (
    <>
      <NotFoundPage />
    </>
  )
}

export default function App() {
  const showCustomCursor = useMediaQuery('(hover: hover) and (pointer: fine)')

  return (
    <BrowserRouter>
      <AnalyticsRouterTracker />
      <ScrollToTop />
      {showCustomCursor ? <CustomCursor /> : null}
      <ScrollProgress />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work/:slug" element={<CaseStudyLayout />} />
        <Route path="/resume" element={<ResumeLayout />} />
        <Route path="*" element={<NotFoundLayout />} />
      </Routes>
    </BrowserRouter>
  )
}
