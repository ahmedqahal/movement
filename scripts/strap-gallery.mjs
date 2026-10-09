#!/usr/bin/env node
// Build a single self-contained HTML gallery of every strap-making diagram,
// grouped by lesson with each step's title and caption — for reviewing the
// whole set at once. Each figs-*.jsx file is bundled separately so one broken
// file can't stop the rest; missing diagrams are listed as pending.
//
//   node scripts/strap-gallery.mjs [out.html]
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const out = path.resolve(process.argv[2] || path.join(root, 'build/strap-gallery.html'))
const cache = path.join(root, 'node_modules/.cache/strap-render')
fs.mkdirSync(cache, { recursive: true })
fs.mkdirSync(path.dirname(out), { recursive: true })

const dir = path.join(root, 'src/components/strap')
const files = fs.readdirSync(dir).filter((f) => /^figs-.*\.jsx$/.test(f))
const svgs = {}
const broken = []
for (const f of files) {
  const tag = f.replace(/\W+/g, '_') + '_g' + process.pid
  const entry = path.join(cache, `_gal_${tag}.jsx`)
  const bundle = path.join(cache, `_gal_${tag}.mjs`)
  fs.writeFileSync(
    entry,
    `import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { FIGS } from ${JSON.stringify(path.join(dir, f))}
export const ids = Object.keys(FIGS)
export const render = (id) => renderToStaticMarkup(createElement(FIGS[id]))
`
  )
  try {
    await build({ entryPoints: [entry], bundle: true, platform: 'node', format: 'esm', outfile: bundle, jsx: 'automatic', logLevel: 'silent', packages: 'external' })
    const m = await import(pathToFileURL(bundle).href + `?t=${Date.now()}`)
    for (const id of m.ids) {
      try {
        svgs[id] = m.render(id)
      } catch (e) {
        broken.push(`${id}: ${e.message}`)
      }
    }
  } catch (e) {
    broken.push(`${f}: ${String(e.message).split('\n')[0]}`)
  }
  fs.rmSync(entry, { force: true })
  fs.rmSync(bundle, { force: true })
}

const { STRAP_TRACK } = await import(pathToFileURL(path.join(root, 'src/data/strapmaking/index.js')).href)
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
let done = 0
let total = 0
let body = ''
let part = ''
for (const [li, l] of STRAP_TRACK.lessons.entries()) {
  if (l.part !== part) {
    part = l.part
    body += `<h2 class="part">${esc(part)}</h2>`
  }
  body += `<section class="lesson"><h3><span>${li + 1}</span>${esc(l.title)}</h3><div class="grid">`
  for (const [si, s] of l.steps.entries()) {
    const id = s.figure.slice(6)
    total++
    const svg = svgs[id]
    if (svg) done++
    body += `<figure class="${svg ? '' : 'pending'}"><div class="art">${svg || `<div class="ph">pending · ${esc(id)}</div>`}</div><figcaption><b>${si + 1}. ${esc(s.title)}</b><br>${esc(s.caption || '')}</figcaption></figure>`
  }
  body += `</div></section>`
}

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Strap Diagrams</title>
<style>
:root{--font-body:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;--font-mono:'SF Mono',Menlo,ui-monospace,monospace;--bg:#efe7d8;--ink:#2b241c;--dim:#6e6252}
@media (prefers-color-scheme:dark){:root{--bg:#14110e;--ink:#efe8dc;--dim:#a99d8b}}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font-body)}
header{padding:28px 20px 8px;max-width:1500px;margin:0 auto}
header h1{font-family:Georgia,'Iowan Old Style',serif;font-size:2rem;margin:0 0 6px}
header p{color:var(--dim);margin:0}
main{max-width:1500px;margin:0 auto;padding:0 20px 60px}
h2.part{font-family:var(--font-mono);font-size:.8rem;letter-spacing:.16em;text-transform:uppercase;color:var(--dim);margin:40px 0 4px;border-top:1px solid rgba(128,110,90,.35);padding-top:16px}
.lesson h3{font-family:Georgia,serif;font-size:1.3rem;margin:22px 0 12px;display:flex;gap:10px;align-items:baseline}
.lesson h3 span{font-family:var(--font-mono);font-size:.8rem;color:#b08a3e}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(420px,1fr));gap:16px}
@media (max-width:520px){.grid{grid-template-columns:1fr}}
figure{margin:0}
.art{background:radial-gradient(circle at 50% 40%,#1f1a15,#141110 80%);border-radius:12px;padding:10px;border:1px solid rgba(128,110,90,.3)}
.art svg{display:block;width:100%;height:auto}
.ph{aspect-ratio:480/260;display:grid;place-items:center;color:#7d7264;font-family:var(--font-mono);font-size:.8rem}
figcaption{font-size:.82rem;color:var(--dim);margin-top:6px;line-height:1.35}
figcaption b{color:var(--ink);font-weight:600}
</style></head><body>
<header><h1>Make a Leather Strap — diagrams</h1><p>${done} of ${total} drawn · ${STRAP_TRACK.lessons.length} lessons</p></header>
<main>${body}</main></body></html>`
fs.writeFileSync(out, html)
console.log(`${done}/${total} diagrams → ${out}`)
if (broken.length) console.log('problems:\n  ' + broken.join('\n  '))
