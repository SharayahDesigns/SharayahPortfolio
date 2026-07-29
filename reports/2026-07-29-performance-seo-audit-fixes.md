# Performance / SEO / A11y Audit — Fixes Shipped

**Date:** 2026-07-29
**Source audit:** `2026-07-29-sharayahdesigns-audit.md`
**Scope:** Batches 1–4 fully implemented and verified. Batch 5's prerendering step deliberately not shipped (see below). One item (GLB mesh simplification) deliberately left as an open decision rather than applied.

---

## Decisions needed

| # | Item | Status |
|---|---|---|
| 1 | Vercel primary domain → non-www | **Action needed from you.** No code change required — all metadata (canonical, sitemap, JSON-LD, robots.txt) already assumes non-www. Set `sharayahdesigns.com` as the primary domain in Vercel → Project → Domains. |
| 2 | GLB mesh simplification | **Not applied.** Textures were already optimized (1024px WebP) and geometry already Draco-compressed — the audit's "compress textures" prescription doesn't apply. The real remaining weight is raw vertex count (130K+ per model). Reducing it further requires lossy mesh simplification, which risks visibly degrading your hero avatars. Say the word if you want me to generate a before/after for you to review. |
| 3 | Prerendering the 9 routes for non-JS crawlers | **Not implemented.** This sandbox can't run headless Chrome (Puppeteer downloads an x86 binary; the host is ARM64 with no emulation available), so I couldn't verify a prerender script would produce clean output rather than baked-in mid-animation states. Flagging rather than shipping unverified browser-automation code into your build. |
| 4 | Analytics (GA4 vs. lighter alternative) | Left as-is per your call. |
| 5 | CSP | New `vercel.json` CSP has not been tested against a live deploy. **Test on a Vercel preview before promoting to production** — your Three.js pipeline creates `blob:` workers and inline styles. |

---

## What shipped

### Batch 1 — CLS + headers
- **Root-caused the 0.589 CLS**, not just patched it: `/resume` and `/work/*` rendered `<Suspense fallback={null}>` around their lazy route chunks, so `<main>` committed empty on the first pass (while nav + footer already painted), then jumped to full height once the chunk resolved — shoving the footer down the full document height. Fixed by giving those Suspense boundaries a space-reserving fallback (`RouteFallback`, `min-height: 100vh`) instead of `null`.
- Added a global `main { min-height: 100vh }` CSS floor as insurance against regressions (the audit's own recommendation — "do both").
- New `vercel.json`: immutable caching on hashed `/assets/*`, 7-day SWR caching on `/images`, `/models`, `/draco`, plus security headers (`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS with `includeSubDomains; preload`, and a CSP scoped to your actual script/style/font origins).

### Batch 2 — 3D model weight
- Self-hosted the Draco decoder instead of fetching it from `gstatic.com` at runtime. Copied from the `three` package you already depend on (no external download), via a new `scripts/copy-draco-decoder.mjs` wired into `prebuild`. `HeroAvatar.tsx` now points `useGLTF` at `/draco/`.
- Regenerated `shareImage.png` (551 KB, wrong aspect ratio for OG/Twitter) as a correctly-cropped 1200×630 JPG (78 KB) and updated every reference (`index.html`, `SEO.tsx`, `App.tsx`, `seo-routes.mjs`).
- **Did not** apply the audit's "lazy-load the below-fold dog model" fix — the Snowy Shepherd isn't below the fold. It renders in the same above-the-fold hero `<Canvas>` as the coding-chick avatar, so there's nothing to defer.
- **Did not** apply "texture-compress webp" — textures are already 1024px WebP, ~100 KB per model combined. Confirmed via `gltf-transform inspect` and a raw byte breakdown of each `.glb`'s JSON chunk.

### Batch 3 — Responsive images
- Wired `srcSet`/`sizes` (reusing the pattern your `ccnwa-hero` image already used) for the 5 grid images that were rendering 3–4× oversized: `AtlasMobileview`, `bhanddisposal`, `studioPlayerUXUI`, `cabana`, `logomat`. Generated 720w WebP variants for each, applied to both the homepage project grid and the case-study hero images.
- Added missing `width`/`height` to `computer2.webp` (was the one image on the site without intrinsic dimensions — a latent CLS source).
- Converted `monnitSoftware.jpg` → WebP. While in there, **fixed a real bug**: its declared dimensions in `caseStudies.ts`/`portfolio.ts` were `1200×750`; the actual file is `600×400`.
- Added `fetchPriority="high"` to case-study hero images and the hero static-fallback image (both LCP candidates).

### Batch 4 — Accessibility
- Fixed `.cs-section-number` contrast (4.25:1 → ~4.5:1+) by adjusting the teal opacity token from 0.5 → 0.62.
- Fixed `aria-prohibited-attr`: moved `aria-label` off three `<p>` elements (`.hero-title`, `.about-script`, `.work-image-typed`) into visually-hidden `<span className="sr-only">` siblings instead — same result, valid per the element's implicit role.
- Fixed `definition-list`: `about-stats` was a `<dl>` with `<div><span>icon</span><dt>…</dt><dd>…</dd></div>` children, which violates the `<dl>` content model (a div wrapping dt/dd may only contain dt/dd). Restructured to a plain `<ul>`/`<li>` — these are stat cards, not term/description pairs, so this is the more honest structure anyway.
- Fixed `heading-order` (h2 → h4 skips): bumped `.resume-exp-title`, `.resume-skill-group-title`, `.resume-edu-degree`, `.cs-process-title`, `.cs-feature-title` from h4 → h3. Also fixed `.cs-constraints-title`, which has the identical bug but wasn't in the audit's list (likely because no scanned case study happened to populate `constraints` data during the crawl).
- Added a skip-to-content link (first focusable element on every route, targets a new `id="main"` on each layout's `<main>`).
- Hid the HeroAvatar's WebGL `<canvas>` from assistive tech (`aria-hidden` on the r3f `<Canvas>` — ParticleField's canvas already had this).
- Added a `<noscript>` fallback in `index.html` with name, title, email, and a résumé PDF link.
- Fixed the fused `<h1>` words (`SharayahHefner` in the text layer) for text extractors — added a visually-hidden space between the two `aria-hidden` word spans, out of flow so it can't add visual gap on top of the existing word-spacing margin.

### Corrections to the audit's own claims
- **"Zero web fonts" is wrong.** `index.html` loads Google Fonts (Caveat, Space Grotesk, Syne, JetBrains Mono) via `<link>`. Accounted for in the new CSP's `font-src`/`style-src`.
- **GLB textures were already optimized; Draco was already applied.** The audit's specific compression prescription doesn't match reality (see Batch 2 decisions above).
- **The Snowy Shepherd model isn't below-fold.**
- **`monnitSoftware` had incorrect declared dimensions** in the data layer (unrelated to the audit, found while fixing the format).

---

## Verification performed
- `tsc --noEmit` — clean, run after every batch.
- `vite build` — succeeds (had to work around an unrelated sandbox `@rollup/rollup-linux-arm64-gnu` native-binary issue to test this; not a real project problem).
- `node scripts/postbuild-route-html.mjs` against the build output — confirmed all 9 route HTML files generate, `og:image` tags resolve to the new filenames, `/draco/*` and `shareImage.jpg` land in `dist/`.
- Manual diff review of all 16 changed files.
- **Not verified:** actual browser rendering (no working headless browser in this sandbox — see the prerendering item above). Recommend a visual pass on a preview deploy, especially the CSP and the icon-lighting/CLS fixes.

## Follow-up link check
Checked every `<Link>`/`href` in `src/` against defined routes (`/`, `/resume`, `/work/:slug`, `/404`) and section anchors (`#projects`, `#about`, `#experience`, `#skills`, `#contact`) — all resolve correctly, including the ones on `Projects.tsx`'s dynamic `id` prop that a naive search would miss. Also cross-referenced every `/images/*`, `/models/*`, and root-level static file reference in the codebase against what's actually in `public/` — none missing. No broken internal links found. The one `/404` view in GA4 is most likely an external referrer typo, an old bookmark, or a manual mistype — not something in the codebase.
