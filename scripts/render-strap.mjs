#!/usr/bin/env node
// Render the strap-making diagrams to PNG for visual review, without a
// browser. Bundles src/components/strap with esbuild, renders each figure
// with react-dom/server, rasterises with sharp, and also writes contact
// sheets (several figures per image) so a whole lesson can be reviewed at once.
//
//   node scripts/render-strap.mjs [idPrefix…] [--out dir] [--per 6] [--file figs-x.jsx]
// --file renders one figure file on its own (so a broken file elsewhere
// can't stop you), instead of the whole registry in index.jsx.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'esbuild'
import sharp from 'sharp'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const flag = (name, def) => {
  const i = args.indexOf(name)
  if (i < 0) return def
  const v = args[i + 1]
  args.splice(i, 2)
  return v
}
const out = path.resolve(flag('--out', path.join(os.tmpdir(), 'strap-png')))
const per = Number(flag('--per', 6))
const only = flag('--file', null)
const prefixes = args

fs.mkdirSync(out, { recursive: true })
// the bundle lives inside the repo so `react` resolves from node_modules
const cache = path.join(root, 'node_modules/.cache/strap-render')
fs.mkdirSync(cache, { recursive: true })
const tag = (only || 'index').replace(/\W+/g, '_') + '_' + process.pid
const entry = path.join(cache, `_entry_${tag}.jsx`)
fs.writeFileSync(
  entry,
  `import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { FIGS } from ${JSON.stringify(path.join(root, 'src/components/strap', only || 'index.jsx'))}
export const ids = Object.keys(FIGS)
export const render = (id) => renderToStaticMarkup(createElement(FIGS[id]))
`
)
const bundle = path.join(cache, `_bundle_${tag}.mjs`)
await build({
  entryPoints: [entry],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: bundle,
  jsx: 'automatic',
  logLevel: 'error',
  packages: 'external',
})
const { ids, render } = await import(pathToFileURL(bundle).href + `?t=${Date.now()}`)

const pick = prefixes.length ? ids.filter((id) => prefixes.some((p) => id.startsWith(p))) : ids
const W = 960
const files = []
for (const id of pick) {
  let svg = render(id)
  svg = svg
    .replaceAll('var(--font-body)', 'Helvetica Neue, Helvetica, Arial')
    .replaceAll('var(--font-mono)', 'Menlo, monospace')
    .replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ')
  const vb = svg.match(/viewBox="([\d.\s-]+)"/)[1].split(/\s+/).map(Number)
  const H = Math.round((W * vb[3]) / vb[2])
  svg = svg.replace('<svg ', `<svg width="${W}" height="${H}" `)
  const img = await sharp(Buffer.from(svg)).png().toBuffer()
  const pad = 20
  const framed = await sharp({
    create: { width: W + pad * 2, height: H + pad * 2 + 26, channels: 4, background: '#171310' },
  })
    .composite([
      { input: img, top: pad + 26, left: pad },
      {
        input: Buffer.from(
          `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="26"><text x="0" y="18" font-size="18" font-family="Menlo" fill="#d0a84f">${id}</text></svg>`
        ),
        top: 8,
        left: pad,
      },
    ])
    .png()
    .toBuffer()
  const f = path.join(out, `${id}.png`)
  fs.writeFileSync(f, framed)
  files.push({ f, w: W + pad * 2, h: H + pad * 2 + 26 })
}

// contact sheets: one column
const sheets = []
for (let i = 0; i < files.length; i += per) {
  const group = files.slice(i, i + per)
  const cols = 1
  const rows = Math.ceil(group.length / cols)
  const cw = Math.max(...group.map((g) => g.w))
  const rh = []
  for (let r = 0; r < rows; r++) rh.push(Math.max(...group.slice(r * cols, r * cols + cols).map((g) => g.h)))
  const comp = []
  let y = 0
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const g = group[r * cols + c]
      if (g) comp.push({ input: g.f, top: y, left: c * cw })
    }
    y += rh[r]
  }
  const sheet = path.join(out, `_sheet-${(only || 'all').replace(/\.jsx$/, '')}-${String(sheets.length + 1).padStart(2, '0')}.png`)
  await sharp({ create: { width: cw * cols, height: y, channels: 4, background: '#0d0b09' } })
    .composite(comp)
    .resize({ width: 1000 })
    .png()
    .toFile(sheet)
  sheets.push(sheet)
}
fs.rmSync(entry, { force: true })
fs.rmSync(bundle, { force: true })
console.log(`rendered ${files.length} figure(s) → ${out}`)
for (const s of sheets) console.log('sheet:', s)
