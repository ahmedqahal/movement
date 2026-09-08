#!/usr/bin/env node
// Data-integrity checks for the content files.
//
// These are deliberately not UI tests. The bugs this project actually
// accumulates are broken cross-references in a large hand-edited data set:
// a figure that resolves to nothing, a flowchart pointing at a deleted
// lesson, an illustration whose file was never added. All silent in the
// browser; all caught here in under a second.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8')
const errors = []
const fail = (msg) => errors.push(msg)

const { TRACKS } = await import('../src/data/lessons.js')
const { FLOWCHARTS } = await import('../src/data/flowcharts.js')
const { ILLUSTRATIONS } = await import('../src/data/illustrations.js')
const { MOVEMENTS } = await import('../src/data/movements.js')
const { REFERENCE } = await import('../src/data/reference.js')
const { PATHS, MOVEMENT_FLAGSHIP } = await import('../src/data/paths.js')

const lessons = TRACKS.flatMap((t) => t.lessons)
const lessonIds = new Set(lessons.map((l) => l.id))
const illusIds = new Set(ILLUSTRATIONS.map((p) => p.id))

// figure keys the resolver knows about
const stepSrc = read('src/components/StepFigures.jsx')
const figKeys = new Set([
  ...[...stepSrc.matchAll(/^\s{2}(\w+):\s*'\/illustrations/gm)].map((m) => m[1]),
  ...[...stepSrc.matchAll(/^\s{2}(\w+):\s*[A-Z]\w+,/gm)].map((m) => m[1]),
])
const plateIds = new Set(
  [...read('src/components/plates/index.jsx').matchAll(/id:\s*'([a-z-]+)'/g)].map((m) => m[1])
)

// 1 — unique lesson ids
const seen = new Set()
for (const l of lessons) {
  if (seen.has(l.id)) fail(`duplicate lesson id: ${l.id}`)
  seen.add(l.id)
}

// 2 — every figure reference resolves
for (const l of lessons) {
  for (const s of l.steps || []) {
    if (!s.figure) continue
    const f = s.figure
    if (f.startsWith('illus:')) {
      if (!illusIds.has(f.slice(6))) fail(`${l.id}: unknown illustration "${f}"`)
    } else if (f.startsWith('plate:')) {
      if (!plateIds.has(f.slice(6))) fail(`${l.id}: unknown plate "${f}"`)
    } else if (!figKeys.has(f)) {
      fail(`${l.id}: unknown figure key "${f}"`)
    }
  }
}

// 3 — quiz answers are in range
for (const l of lessons) {
  for (const [i, q] of (l.quiz || []).entries()) {
    if (!Array.isArray(q.options) || q.options.length < 2) fail(`${l.id} quiz ${i + 1}: needs options`)
    if (typeof q.answer !== 'number' || q.answer < 0 || q.answer >= q.options.length)
      fail(`${l.id} quiz ${i + 1}: answer index ${q.answer} out of range`)
    if (!q.explain) fail(`${l.id} quiz ${i + 1}: missing explanation`)
  }
}

// 4 — flowchart nodes and lesson links resolve
for (const chart of FLOWCHARTS) {
  if (!chart.nodes[chart.start]) fail(`${chart.id}: start node "${chart.start}" missing`)
  for (const [id, node] of Object.entries(chart.nodes)) {
    for (const opt of node.options || []) {
      if (!chart.nodes[opt.next]) fail(`${chart.id}/${id}: option points at missing node "${opt.next}"`)
    }
    if (node.lessonId && !lessonIds.has(node.lessonId))
      fail(`${chart.id}/${id}: links to missing lesson "${node.lessonId}"`)
  }
}

// 5 — movement-guide walkthrough links resolve
for (const m of MOVEMENTS) {
  if (m.lessonId && !lessonIds.has(m.lessonId)) fail(`movement ${m.id}: missing lesson "${m.lessonId}"`)
}

// 6 — every illustration file exists on disk
for (const p of ILLUSTRATIONS) {
  const f = path.join(root, 'public', p.file)
  if (!fs.existsSync(f)) fail(`illustration "${p.id}": file not found (${p.file})`)
  for (const h of p.hotspots || []) {
    if (h.x < 0 || h.x > 100 || h.y < 0 || h.y > 100)
      fail(`illustration "${p.id}": hotspot "${h.label}" out of bounds (${h.x},${h.y})`)
  }
}

// 7 — every figure image referenced by the resolver exists
for (const m of stepSrc.matchAll(/'(\/illustrations\/[\w-]+\.webp)'/g)) {
  if (!fs.existsSync(path.join(root, 'public', m[1]))) fail(`step figure file missing: ${m[1]}`)
}

// 8 — reference articles have unique ids and content
const refSeen = new Set()
for (const a of REFERENCE) {
  if (refSeen.has(a.id)) fail(`duplicate reference id: ${a.id}`)
  refSeen.add(a.id)
  if (!a.sections?.length) fail(`reference "${a.id}": no sections`)
}

// 9 — every "Guide me" path step (and calibre flagship) is a real lesson
for (const [goal, p] of Object.entries(PATHS)) {
  for (const s of p.steps || []) {
    if (!lessonIds.has(s.id)) fail(`path "${goal}": unknown lesson id "${s.id}"`)
  }
  if (p.flagship && !lessonIds.has(p.flagship)) fail(`path "${goal}": unknown flagship "${p.flagship}"`)
  const maxStart = (p.steps || []).length
  for (const [lvl, idx] of Object.entries(p.starts || {})) {
    if (idx < 0 || idx >= maxStart) fail(`path "${goal}": start index for "${lvl}" out of range`)
  }
}
for (const [chip, id] of Object.entries(MOVEMENT_FLAGSHIP)) {
  if (!lessonIds.has(id)) fail(`movement flagship "${chip}" → unknown lesson "${id}"`)
}

const counts = {
  tracks: TRACKS.length,
  lessons: lessons.length,
  illustrations: ILLUSTRATIONS.length,
  flowcharts: FLOWCHARTS.length,
  movements: MOVEMENTS.length,
  reference: REFERENCE.length,
}
console.log('content:', Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(' · '))

if (errors.length) {
  console.error(`\n✗ ${errors.length} problem${errors.length > 1 ? 's' : ''} found:\n`)
  for (const e of errors) console.error('  •', e)
  process.exit(1)
}
console.log('✓ all content checks passed')
