import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { routes, site } from './seo-routes.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const publicDir = path.join(repoRoot, 'public')
const buildDate = new Date().toISOString().slice(0, 10)

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true })
}

function routeLastMod(route) {
  const sourcePath = path.join(repoRoot, route.sourceFile)
  if (!fs.existsSync(sourcePath)) return buildDate
  return fs.statSync(sourcePath).mtime.toISOString().slice(0, 10)
}

function buildSitemap() {
  const entries = routes.map((route) => `  <url>
    <loc>${site.origin}${route.path}</loc>
    <lastmod>${routeLastMod(route)}</lastmod>
  </url>`).join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`
}

function buildRobots() {
  return `User-agent: *
Allow: /

Sitemap: ${site.origin}/sitemap.xml
`
}

ensureDir(publicDir)
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), buildSitemap(), 'utf8')
fs.writeFileSync(path.join(publicDir, 'robots.txt'), buildRobots(), 'utf8')
