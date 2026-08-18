// Client-side global search. Builds one in-memory index at load from all the
// local content (lessons, glossary, reference, tools, plates, diagrams,
// diagnostics) and ranks matches with a small hand-rolled scorer — no external
// dependency, so it stays lean for the offline PWA.
import { TRACKS } from '../data/lessons.js'
import { GLOSSARY } from '../data/glossary.js'
import { REFERENCE } from '../data/reference.js'
import { TOOLS } from '../data/tools.js'
import { PLATES } from '../components/plates/index.jsx'
import { DIAGRAMS } from '../data/anatomy.js'
import { FLOWCHARTS } from '../data/flowcharts.js'
import { MOVEMENTS } from '../data/movements.js'
import { ILLUSTRATIONS } from '../data/illustrations.js'

// Stable slug used both here (as the ?focus= value) and by the target pages
// (as the element id) so search can scroll/highlight the exact item.
export const slug = (s) =>
  (s || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

const clip = (s, n = 120) => {
  const t = (s || '').replace(/\s+/g, ' ').trim()
  return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t
}

// The bench calculators (page has no per-tool data module, so list them here).
const CALCULATORS = [
  { title: 'Daily rate calculator', summary: 'Drift over time → seconds per day.', kw: 'rate accuracy fast slow s/day cosc regulate timing' },
  { title: 'Beat rate calculator', summary: 'Beats per hour → beats/sec and hertz.', kw: 'bph beat hz frequency 28800 21600 36000 high-beat' },
  { title: 'Power-reserve estimate', summary: 'Barrel turns and gearing → rough hours.', kw: 'power reserve mainspring barrel turns running time autonomy' },
  { title: 'Strap & lug sizing', summary: 'Lug width → strap, taper and spring-bar sizes.', kw: 'strap lug width spring bar taper buckle mm sizing' },
  { title: 'Amplitude & beat error', summary: 'Read a timegrapher trace — verdict + lift-angle note.', kw: 'amplitude beat error timegrapher lift angle degrees ms regulate escapement' },
  { title: 'Battery cross-reference', summary: 'Look up a watch cell by code or size.', kw: 'battery cell sr lr cr silver oxide lithium 377 sr626 lr44 equivalent' },
]

function buildIndex() {
  const out = []

  // Lessons (flattened across tracks)
  for (const track of TRACKS) {
    for (const l of track.lessons) {
      const steps = (l.steps || []).map((s) => s.title).join(' ')
      out.push({
        type: 'Lesson',
        title: l.title,
        subtitle: l.summary,
        group: track.name,
        path: `/learn/${l.id}`,
        kw: [l.title, l.summary, l.intro, steps, track.name, l.level].filter(Boolean).join(' '),
      })
    }
  }

  // Glossary terms
  for (const g of GLOSSARY) {
    out.push({
      type: 'Term',
      title: g.term,
      subtitle: clip(g.def),
      path: '/glossary',
      focus: slug(g.term),
      kw: `${g.term} ${g.def}`,
    })
  }

  // Reference field guides
  for (const a of REFERENCE) {
    const secs = (a.sections || []).map((s) => `${s.heading} ${s.body}`).join(' ')
    out.push({
      type: 'Guide',
      title: a.title,
      subtitle: a.summary,
      path: '/reference',
      focus: a.id,
      kw: [a.title, a.summary, secs].join(' '),
    })
  }

  // Tools
  for (const t of TOOLS) {
    out.push({
      type: 'Tool',
      title: t.name,
      subtitle: clip(t.use),
      path: '/tools',
      focus: slug(t.name),
      kw: [t.name, t.use, t.group].join(' '),
    })
  }

  // Technical plates
  for (const p of PLATES) {
    out.push({
      type: 'Plate',
      title: p.title,
      subtitle: clip(p.caption),
      path: '/plates',
      focus: p.id,
      kw: [p.title, p.caption, p.source].join(' '),
    })
  }

  // Anatomy diagrams
  for (const d of DIAGRAMS) {
    const parts = (d.parts || []).map((p) => p.name).join(' ')
    out.push({
      type: 'Diagram',
      title: d.name,
      subtitle: d.tagline,
      path: '/anatomy',
      focus: d.id,
      kw: [d.name, d.tagline, d.note, parts].filter(Boolean).join(' '),
    })
  }

  // Diagnostic flowcharts
  for (const f of FLOWCHARTS) {
    out.push({
      type: 'Fix',
      title: f.title,
      subtitle: f.summary,
      path: '/diagnose',
      focus: f.id,
      kw: `${f.title} ${f.summary}`,
    })
  }

  // Illustrated plates (interactive raster artwork)
  for (const p of ILLUSTRATIONS) {
    out.push({
      type: 'Plate',
      title: p.title,
      subtitle: 'Illustrated plate — clickable labels',
      path: '/illustrated',
      focus: p.id,
      kw: [p.title, 'illustrated painterly plate', p.hotspots.map((h) => h.label).join(' ')].join(' '),
    })
  }

  // Movement guides
  for (const m of MOVEMENTS) {
    out.push({
      type: 'Movement',
      title: m.name,
      subtitle: `${m.maker} · ${m.type}`,
      path: '/movements',
      focus: m.id,
      kw: [m.name, m.maker, m.type, m.character, m.faults, m.tags.join(' ')].join(' '),
    })
  }

  // Bench calculators
  for (const c of CALCULATORS) {
    out.push({
      type: 'Calc',
      title: c.title,
      subtitle: c.summary,
      path: '/calculators',
      kw: `${c.title} ${c.summary} ${c.kw} calculator`,
    })
  }

  // Precompute lowercase haystacks used by the scorer.
  for (const e of out) {
    e._t = e.title.toLowerCase()
    e._h = `${e.kw} ${e.subtitle || ''}`.toLowerCase()
  }
  return out
}

export const INDEX = buildIndex()

const TYPE_RANK = { Lesson: 0, Movement: 1, Fix: 2, Calc: 3, Guide: 4, Plate: 5, Diagram: 6, Term: 7, Tool: 8 }

export function search(query, limit = 30) {
  const q = (query || '').trim().toLowerCase()
  if (!q) return []
  const tokens = q.split(/\s+/)
  const scored = []

  for (const e of INDEX) {
    // Require every token to appear somewhere (AND semantics).
    let ok = true
    for (const tok of tokens) {
      if (!e._h.includes(tok)) {
        ok = false
        break
      }
    }
    if (!ok) continue

    let score = 0
    if (e._t === q) score += 100
    else if (e._t.startsWith(q)) score += 45
    else if (e._t.includes(q)) score += 22
    for (const tok of tokens) {
      if (e._t.startsWith(tok)) score += 8
      else if (e._t.includes(tok)) score += 5
      if (e._h.includes(tok)) score += 1
    }
    scored.push({ e, score })
  }

  scored.sort(
    (a, b) =>
      b.score - a.score ||
      TYPE_RANK[a.e.type] - TYPE_RANK[b.e.type] ||
      a.e._t.localeCompare(b.e._t)
  )
  return scored.slice(0, limit).map((s) => s.e)
}

export const GROUP_ORDER = ['Lesson', 'Movement', 'Fix', 'Calc', 'Guide', 'Plate', 'Diagram', 'Term', 'Tool']
export const GROUP_LABEL = {
  Lesson: 'Lessons',
  Movement: 'Movement guides',
  Fix: 'Diagnostics',
  Calc: 'Calculators',
  Guide: 'Field guides',
  Plate: 'Technical plates',
  Diagram: 'Anatomy diagrams',
  Term: 'Glossary',
  Tool: 'Tools',
}
export const TYPE_TAG = {
  Lesson: 'Lesson',
  Movement: 'Movement',
  Fix: 'Diagnose',
  Calc: 'Calc',
  Guide: 'Guide',
  Plate: 'Plate',
  Diagram: 'Diagram',
  Term: 'Term',
  Tool: 'Tool',
}
