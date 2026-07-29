// Self-hosts the Draco decoder instead of loading it from gstatic.com at
// runtime (see the CLS/perf audit: gstatic costs a fresh DNS + TLS handshake
// on the critical path for ~98KB). The gltf-flavoured decoder ships inside
// the `three` package we already depend on, so this just copies it into
// public/ on every build - no network fetch, and it stays in sync whenever
// `three` is upgraded. useGLTF.setDecoderPath('/draco/') in HeroAvatar.tsx
// points the loader at the copies this script produces.
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')

const sourceDir = path.join(repoRoot, 'node_modules/three/examples/jsm/libs/draco/gltf')
const destDir = path.join(repoRoot, 'public/draco')

const files = ['draco_decoder.js', 'draco_decoder.wasm', 'draco_wasm_wrapper.js']

fs.mkdirSync(destDir, { recursive: true })

for (const file of files) {
  const src = path.join(sourceDir, file)
  if (!fs.existsSync(src)) {
    throw new Error(`Draco decoder file missing from three/examples: ${src}`)
  }
  fs.copyFileSync(src, path.join(destDir, file))
}

console.log(`Copied Draco decoder (${files.length} files) to public/draco/`)
