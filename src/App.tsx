import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CustomCursor from './components/CustomCursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import AboutProjectsStack from './components/AboutProjectsStack'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Education from './components/Education'
import StoryParallax from './components/StoryParallax'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import ScrollToTop from './components/ScrollToTop'
import CaseStudyPage from './components/CaseStudyPage'
import ResumePage from './components/ResumePage'
import NotFoundPage from './components/NotFoundPage'
import SEO from './components/SEO'
import { upsertJsonLd, removeJsonLd } from './components/SEO'
import { siteConfig, navItems, resumePdfPath } from './data/siteConfig'
import { portfolioData } from './data/portfolio'
import { caseStudies } from './data/caseStudies'

function HomePage() {
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

  return (
    <>
      <SEO
        title={`${siteConfig.name} — ${siteConfig.title}`}
        description="Frontend UX Engineer and Design Engineer specializing in React, Next.js, e-commerce, design systems, interaction design, and polished production experiences."
        path="/"
        image="/images/shareImage.webp"
        imageAlt="Sharayah Hefner portfolio preview"
        type="website"
      />
      <Nav />
      <main className="home-main">
        <Hero />
        <div className="home-content-stack">
          <AboutProjectsStack />
          <Experience />
          <Skills />
          <Education />
          <StoryParallax />
          <Contact />
        </div>
      </main>
      <Footer />
    </>
  )
}

function CaseStudyLayout() {
  return (
    <>
      <Nav />
      <main>
        <CaseStudyPage />
      </main>
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
        <ResumePage />
      </main>
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
  return (
    <BrowserRouter>
      <ScrollToTop />
      <CustomCursor />
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
