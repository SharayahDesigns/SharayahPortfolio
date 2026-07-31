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

/**
 * Pixel dimensions of a built image, read out of the file header.
 *
 * Facebook will not render a card until it knows how big the image is. Without
 * these tags it has to download and measure the image first, which is why the
 * FIRST share of a URL so often appears with no image and only fills in after a
 * manual re-scrape.
 *
 * JPEG and PNG only, because those are the formats the social cards use (and the
 * only ones Facebook reliably renders). Anything else returns null and the tags
 * are omitted - wrong dimensions make Facebook crop or reject the image, so no
 * tag is strictly better than a guessed one.
 */
function imageSize(file) {
  let buf
  try {
    buf = fs.readFileSync(file)
  } catch {
    return null
  }

  // PNG: width/height are the first two fields of the IHDR chunk.
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), type: 'image/png' }
  }

  if (buf.length > 4 && buf.readUInt16BE(0) === 0xffd8) {
    // Walk the marker segments looking for a start-of-frame, which is where the
    // real dimensions live. EXIF thumbnails earlier in the file would otherwise
    // give the wrong answer.
    let i = 2
    while (i + 9 < buf.length) {
      if (buf[i] !== 0xff) {
        i += 1
        continue
      }
      const marker = buf[i + 1]
      // Standalone markers carry no length field.
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
        i += 2
        continue
      }
      const length = buf.readUInt16BE(i + 2)
      // SOF0..SOF15, skipping DHT (c4), JPG (c8) and DAC (cc) which share the range.
      const isSof =
        marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc
      if (isSof) {
        return {
          height: buf.readUInt16BE(i + 5),
          width: buf.readUInt16BE(i + 7),
          type: 'image/jpeg',
        }
      }
      i += 2 + length
    }
  }

  return null
}

/** The og:image:* trio for a site-relative image, or '' if it can't be measured. */
function imageMetaTags(image) {
  if (image.startsWith('http') && !image.startsWith(site.origin)) return ''
  const relative = image.replace(site.origin, '')
  const size = imageSize(path.join(distDir, relative))
  if (!size) return ''
  return `
    <meta property="og:image:type" content="${size.type}" />
    <meta property="og:image:width" content="${size.width}" />
    <meta property="og:image:height" content="${size.height}" />`
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
    <meta property="og:image:alt" content="${imageAlt}" />${imageMetaTags(image)}
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
    <meta property="og:image:alt" content="${site.socialImageAlt}" />${imageMetaTags(site.socialImage)}
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
