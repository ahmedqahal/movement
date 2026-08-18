// Generates PWA/app icons from an inline SVG using sharp.
// Run with: node scripts/gen-icons.mjs
import sharp from 'sharp'
import { mkdirSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pub = resolve(__dirname, '..', 'public')
mkdirSync(pub, { recursive: true })

function watchSVG({ rounded }) {
  const markers = Array.from({ length: 12 })
    .map((_, i) => {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2
      const r1 = i % 3 === 0 ? 108 : 116
      const x1 = 256 + r1 * Math.cos(a)
      const y1 = 256 + r1 * Math.sin(a)
      const x2 = 256 + 132 * Math.cos(a)
      const y2 = 256 + 132 * Math.sin(a)
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#d0a84f" stroke-width="${i % 3 === 0 ? 9 : 4}" stroke-linecap="round"/>`
    })
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="75%">
      <stop offset="0%" stop-color="#241f19"/>
      <stop offset="100%" stop-color="#14110f"/>
    </radialGradient>
    <radialGradient id="dial" cx="50%" cy="42%" r="60%">
      <stop offset="0%" stop-color="#221d17"/>
      <stop offset="100%" stop-color="#141110"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="${rounded ? 112 : 0}" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="158" fill="none" stroke="#3a3128" stroke-width="14"/>
  <circle cx="256" cy="256" r="150" fill="url(#dial)" stroke="#d0a84f" stroke-width="3"/>
  ${markers}
  <line x1="256" y1="256" x2="256" y2="150" stroke="#efe8dc" stroke-width="12" stroke-linecap="round"/>
  <line x1="256" y1="256" x2="330" y2="286" stroke="#efe8dc" stroke-width="12" stroke-linecap="round"/>
  <circle cx="256" cy="256" r="12" fill="#d0a84f"/>
</svg>`
}

const rounded = Buffer.from(watchSVG({ rounded: true }))
const square = Buffer.from(watchSVG({ rounded: false }))

async function run() {
  await sharp(rounded).resize(192, 192).png().toFile(resolve(pub, 'icon-192.png'))
  await sharp(rounded).resize(512, 512).png().toFile(resolve(pub, 'icon-512.png'))
  await sharp(square).resize(512, 512).png().toFile(resolve(pub, 'maskable-512.png'))
  await sharp(square).resize(180, 180).png().toFile(resolve(pub, 'apple-touch-icon.png'))
  writeFileSync(resolve(pub, 'favicon.svg'), watchSVG({ rounded: true }))
  console.log('Icons written to public/')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
