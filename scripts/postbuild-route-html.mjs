import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { routes, site } from './seo-routes.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const distDir = path.join(repoRoot, 'dist')
const templatePath = path.join(distDir, 'index.html')

if (!fs.existsSync(templatePath)) {
  throw new Error(`Build output not found at ${templatePath}`)
}

const template = fs.readFileSync(templatePath, 'utf8')

function absoluteImage(image) {
  return image.startsWith('http') ? image : `${site.origin}${image}`
}

function jsonLdScript(data) {
  return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`
}

function buildSeoBlock(route) {
  const image = absoluteImage(route.image || site.socialImage)
  const imageAlt = route.imageAlt || site.socialImageAlt
  const canonical = `${site.origin}${route.path}`
  const robots = route.noindex
    ? 'noindex, follow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

  return `<!-- SEO_HEAD_START -->
    <title>${route.title}</title>
    <meta name="description" content="${route.description}" />
    <meta name="author" content="${site.name}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${canonical}" />

    <meta property="og:type" content="${route.type || 'website'}" />
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:alt" content="${imageAlt}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:site_name" content="${site.name}" />
    <meta property="og:locale" content="en_US" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${route.title}" />
    <meta name="twitter:description" content="${route.description}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:image:alt" content="${imageAlt}" />

    <meta name="theme-color" content="#050508" />

    ${jsonLdScript(route.jsonLd)}
    <!-- SEO_HEAD_END -->`
}

function writeRouteHtml(route) {
  const seoBlock = buildSeoBlock(route)
  const html = template.replace(/<!-- SEO_HEAD_START -->[\s\S]*?<!-- SEO_HEAD_END -->/, seoBlock)
  const outPath = route.path === '/'
    ? templatePath
    : path.join(distDir, route.path.replace(/^\//, ''), 'index.html')

  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, html, 'utf8')
}

routes.forEach(writeRouteHtml)

const notFoundHtml = template.replace(
  /<!-- SEO_HEAD_START -->[\s\S]*?<!-- SEO_HEAD_END -->/,
  `<!-- SEO_HEAD_START -->
    <title>Page Not Found - ${site.name}</title>
    <meta name="description" content="The page you were looking for could not be found." />
    <meta name="author" content="${site.name}" />
    <meta name="robots" content="noindex, follow" />
    <link rel="canonical" href="${site.origin}/404" />

    <meta property="og:type" content="website" />
    <meta property="og:title" content="Page Not Found - ${site.name}" />
    <meta property="og:description" content="The page you were looking for could not be found." />
    <meta property="og:image" content="${site.origin}${site.socialImage}" />
    <meta property="og:image:alt" content="${site.socialImageAlt}" />
    <meta property="og:url" content="${site.origin}/404" />
    <meta property="og:site_name" content="${site.name}" />
    <meta property="og:locale" content="en_US" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Page Not Found - ${site.name}" />
    <meta name="twitter:description" content="The page you were looking for could not be found." />
    <meta name="twitter:image" content="${site.origin}${site.socialImage}" />
    <meta name="twitter:image:alt" content="${site.socialImageAlt}" />

    <meta name="theme-color" content="#050508" />
    <!-- SEO_HEAD_END -->`,
)

fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf8')
