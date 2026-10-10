// Strap diagrams — grained & napped leathers (lesson sm-grained): printed,
// milled, shrunken and natural grains, the named premium leathers, finishes,
// layout, reinforcement, skiving, marking, pitch, edges, nap, the specials,
// linings and care. See AUTHORING.md.
//
// Surfaces are drawn procedurally: a milled or shrunken pebble is generated
// (so it never repeats), a printed grain is an SVG pattern (so it does).
// `Grain` fills a rect or path with a surface; `GSec` draws the same surface
// as a section profile. Local pattern / gradient ids are prefixed `gr-`.
import { useId } from 'react'
import { C, MONO, FONT, Fig, T, Note, Lead, Arrow, Num, Verdict, Tag, Sep } from './kit.jsx'
import { StrapPlan, XSec } from './parts.jsx'
import { LONG, SHORT, outline, pathOf } from './geom.js'
import { Knife, Dividers, Creaser, Sander, Brush, Hammer, Iron, Slab, Applicator } from './tools.jsx'

/* ------------------------------------------------------------------ */
/* Local helpers                                                        */
/* ------------------------------------------------------------------ */
const uid = () => useId().replace(/[^a-zA-Z0-9]/g, '')
const f1 = (v) => (Math.round(v * 10) / 10).toString()
const P = (pts, close) => pts.map((p, i) => `${i ? 'L' : 'M'}${f1(p[0])} ${f1(p[1])}`).join(' ') + (close ? ' Z' : '')
const LIGHT = '#f6ead6' // text on leather

// deterministic pseudo-random, so renders are stable
function rng(seed = 1) {
  let s = Math.abs(Math.round(seed * 7919 + 104729)) % 233280
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// Leather colours used in this lesson.
const LC = {
  taupe: '#8a7b6b',
  green: '#3f5b4a',
  noisette: '#9c6b3d',
  navy: '#3b4b6a',
  navy2: '#2f3d5c',
  blue: '#3e5f92',
  core: '#c27a3c',
  cognac: '#b06f36',
  grey: '#5d5b58',
  nub: '#a19f99',
  orange: '#b8652f',
  aqua: '#2f727a',
  black: '#1f1b18',
  chestnut: '#6e3c22',
  baranil: '#a86630',
  tan: '#a8763f',
  zermatt: '#cdb38a',
  crust: '#d2b07e',
  ox: '#7a2530',
  pebble: '#8e6a4a',
}

// Patterns and gradients for the surfaces.
function GrDefs() {
  const sc = (k) => (k === 1 ? undefined : `scale(${k})`)
  const print = (id, k) => (
    <pattern key={id} id={id} width={5 * k} height={4 * k} patternUnits="userSpaceOnUse">
      <path d={`M0 ${2 * k} L${2.5 * k} 0 L${5 * k} ${2 * k} L${2.5 * k} ${4 * k} Z`} fill="rgba(255,244,228,0.13)" stroke="rgba(18,10,4,0.5)" strokeWidth={0.5 * k} />
      <path d={`M${0.8 * k} ${2 * k} L${2.5 * k} ${0.62 * k} L${4.2 * k} ${2 * k}`} fill="none" stroke="rgba(255,246,230,0.3)" strokeWidth={0.4 * k} />
    </pattern>
  )
  const nub = (id, k) => (
    <pattern key={id} id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform={sc(k)}>
      <path d="M0.6 1 l1 0.5 M3.4 0.4 l0.6 0.9 M5 2.6 l-0.9 0.6 M1.4 3.6 l0.9 -0.5 M3.2 4.6 l1 0.4 M0.4 5.4 l0.8 -0.6" stroke="rgba(255,250,240,0.3)" strokeWidth="0.55" strokeLinecap="round" />
      <path d="M2.2 1.8 l0.7 0.6 M4.4 1.2 l0.6 -0.6 M2.6 3.2 l-0.5 0.8 M5 4.6 l-0.6 0.7 M1.6 5 l0.4 0.7" stroke="rgba(0,0,0,0.28)" strokeWidth="0.55" strokeLinecap="round" />
    </pattern>
  )
  const sue = (id, k) => (
    <pattern key={id} id={id} width="12" height="10" patternUnits="userSpaceOnUse" patternTransform={sc(k)}>
      <path d="M1 2 q1.5 -1.4 3 -0.4 M6 1 q1.4 1 2.6 0 M9 4 q1.2 -1.2 2.6 -0.2 M2 6 q1.4 1.2 3 0.2 M7 7.4 q1.5 -1 3 0 M0.5 9 q1.2 -0.8 2.4 0" fill="none" stroke="rgba(255,232,205,0.32)" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M4 4 q1.2 1 2.6 0.2 M8.6 9 q1 -1 2.4 -0.2 M0.6 4.6 q0.8 0.8 2 0.4 M5.6 9.4 q1 -0.8 2 0" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="0.8" strokeLinecap="round" />
    </pattern>
  )
  const alc = (id, k) => (
    <pattern key={id} id={id} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform={sc(k)}>
      <path d="M0 1.5 L3 2.6 M4 0.6 L7.6 1.8 M1 5 L4.2 4 M4.6 6.2 L8 7 M2 7.6 L5 6.8 M5.6 3.4 L7.8 4.6" stroke="rgba(225,250,250,0.28)" strokeWidth="0.45" />
      <path d="M0.4 3.4 L2.6 4.6 M3.4 2.2 L6.6 3 M1.4 6.4 L3.2 7.6 M6 5 L7.6 5.8" stroke="rgba(0,0,0,0.32)" strokeWidth="0.45" />
    </pattern>
  )
  const pecCl = [[5, 5, 0.3], [19, 3.5, 2.1], [29, 12, 4], [11, 15, 1.2], [23, 22, 5.2], [4.5, 25, 2.6], [15, 29, 0.8], [30.5, 27.5, 3.3]]
  const pec = (id, k) => (
    <pattern key={id} id={id} width="34" height="32" patternUnits="userSpaceOnUse" patternTransform={sc(k)}>
      <path d="M0 9 q8 -2 16 1 t18 -1 M0 20 q9 2 17 -1 t17 1" fill="none" stroke="rgba(0,0,0,0.14)" strokeWidth="0.7" />
      {pecCl.map(([x, y, a], i) => (
        <g key={i}>
          {[0, 1, 2].map((j) => {
            const an = a + (j * 2 * Math.PI) / 3
            const cx = x + Math.cos(an) * 1.5
            const cy = y + Math.sin(an) * 1.5
            return (
              <g key={j}>
                <circle cx={f1(cx)} cy={f1(cy + 0.35)} r="0.85" fill="rgba(255,236,210,0.28)" />
                <circle cx={f1(cx)} cy={f1(cy)} r="0.75" fill="rgba(22,10,3,0.75)" />
              </g>
            )
          })}
        </g>
      ))}
    </pattern>
  )
  const uru = (id, k) => (
    <pattern key={id} id={id} width="14" height="14" patternUnits="userSpaceOnUse" patternTransform={sc(k)}>
      {[[2, 3, 0.55, 0.95], [9, 1.5, 0.4, 0.6], [12, 8, 0.6, 1], [5, 10, 0.45, 0.75], [7.5, 6, 0.3, 0.5], [1, 12.5, 0.4, 0.6], [11, 12, 0.3, 0.45]].map(([x, y, r, o], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#fff1c8" opacity={o} />
      ))}
    </pattern>
  )
  return (
    <defs>
      {print('gr-print', 1)}
      {print('gr-print2', 2)}
      {print('gr-print3', 3)}
      {nub('gr-nub', 1)}
      {nub('gr-nubL', 2.5)}
      {sue('gr-sue', 1)}
      {sue('gr-sueL', 2.2)}
      {alc('gr-alc', 1)}
      {alc('gr-alcL', 2.5)}
      {pec('gr-pec', 1)}
      {pec('gr-pecL', 2.2)}
      {uru('gr-uru', 1)}
      {uru('gr-uruL', 2)}
      <pattern id="gr-brush" width="40" height="6" patternUnits="userSpaceOnUse">
        <path d="M0 1 h14 M18 1.2 h20 M4 3 h22 M28 3.2 h10 M0 5 h9 M12 4.8 h24" stroke="rgba(255,255,255,0.14)" strokeWidth="0.6" />
        <path d="M8 2 h16 M30 2 h8 M2 4 h8 M20 4 h12" stroke="rgba(0,0,0,0.2)" strokeWidth="0.6" />
      </pattern>
      <pattern id="gr-mottle" width="48" height="40" patternUnits="userSpaceOnUse">
        <ellipse cx="10" cy="8" rx="9" ry="5" fill="rgba(255,240,220,0.07)" />
        <ellipse cx="34" cy="22" rx="12" ry="6" fill="rgba(255,240,220,0.06)" />
        <ellipse cx="16" cy="30" rx="8" ry="4" fill="rgba(0,0,0,0.08)" />
        <ellipse cx="40" cy="5" rx="6" ry="3" fill="rgba(0,0,0,0.07)" />
      </pattern>
      <linearGradient id="gr-topSinv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d3ae7b" />
        <stop offset="0.82" stopColor="#b2804a" />
        <stop offset="1" stopColor="#7d5228" />
      </linearGradient>
      <linearGradient id="gr-shade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.12" />
        <stop offset="1" stopColor="#000000" stopOpacity="0.22" />
      </linearGradient>
      <linearGradient id="gr-sheen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.14" />
        <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="1" stopColor="#000000" stopOpacity="0.14" />
      </linearGradient>
    </defs>
  )
}

// A smooth closed blob (irregular pebble outline).
function blob(cx, cy, r, R, irr = 0.3, ex = 1, n = 7) {
  const phi = R() * Math.PI * 2
  const pts = []
  for (let i = 0; i < n; i++) {
    const a = phi + (i / n) * Math.PI * 2
    const rr = r * (1 - irr / 2 + irr * R())
    const u = Math.cos(a) * rr * ex
    const v = Math.sin(a) * rr
    pts.push([cx + u * Math.cos(phi) - v * Math.sin(phi), cy + u * Math.sin(phi) + v * Math.cos(phi)])
  }
  const m = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
  const s = m(pts[n - 1], pts[0])
  let d = `M${f1(s[0])} ${f1(s[1])}`
  for (let i = 0; i < n; i++) {
    const q = m(pts[i], pts[(i + 1) % n])
    d += ` Q${f1(pts[i][0])} ${f1(pts[i][1])} ${f1(q[0])} ${f1(q[1])}`
  }
  return d + ' Z'
}

// Pebble field: rounded irregular pebbles of mean size c separated by dark
// creases. d = crease darkness, hi = highlight, deep = lower-right shadow,
// hc = highlight colour (r,g,b).
function pebbles({ x, y, w, h, c, col, seed = 1, irr = 0.3, ex = 1, d = 0.45, hi = 0.16, deep = 0, gap = 0.92, sw, hc = '255,246,232', key = 'p' }) {
  const R = rng(seed)
  const out = [<rect key={key + 'cr'} x={x} y={y} width={w} height={h} fill={`rgba(16,9,4,${d})`} />]
  let row = 0
  for (let yy = y - c * 0.3; yy < y + h + c * 0.5; yy += c * 0.84, row++) {
    for (let xx = x - c * (row % 2 ? 0.1 : 0.6); xx < x + w + c * 0.5; ) {
      const cc = c * (0.78 + R() * 0.44)
      const cx = xx + cc * 0.5
      const cy = yy + (R() - 0.5) * c * 0.22
      const r = cc * 0.51
      const i = out.length
      out.push(<path key={key + i} d={blob(cx, cy, r, R, irr, ex)} fill={col} stroke={`rgba(16,9,4,${Math.min(0.9, d * 0.9 + 0.05)})`} strokeWidth={f1(sw ?? Math.max(0.5, c * 0.07))} />)
      if (deep) out.push(<path key={key + i + 'd'} d={blob(cx + r * 0.18, cy + r * 0.22, r * 0.72, R, irr, ex)} fill={`rgba(0,0,0,${deep})`} />)
      if (hi) out.push(<path key={key + i + 'h'} d={blob(cx - r * 0.22, cy - r * 0.26, r * 0.46, R, irr, 1)} fill={`rgba(${hc},${hi})`} />)
      xx += cc * gap
    }
  }
  return out
}

// Texture elements for a surface kind inside the box (x, y, w, h).
function tex(kind, x, y, w, h, k, seed, col) {
  const Rf = (id) => <rect key={id} x={x} y={y} width={w} height={h} fill={`url(#${id})`} />
  const big = k >= 2
  switch (kind) {
    case 'print':
      return [Rf(`gr-print${k >= 2.6 ? 3 : k >= 1.6 ? 2 : ''}`)]
    case 'milled':
      return pebbles({ x, y, w, h, c: 6.5 * k, col, seed, irr: 0.3, d: 0.42, hi: 0.15 })
    case 'coarse':
      return pebbles({ x, y, w, h, c: 10 * k, col, seed, irr: 0.34, d: 0.45, hi: 0.16 })
    case 'shrunken':
      return pebbles({ x, y, w, h, c: 10 * k, col, seed, irr: 0.45, ex: 1.3, d: 0.62, hi: 0.22, deep: 0.16, gap: 0.86 })
    case 'chevre':
      return pebbles({ x, y, w, h, c: 3.4 * k, col, seed, irr: 0.3, d: 0.36, hi: 0.22, gap: 0.95 })
    case 'scales':
      return pebbles({ x, y, w, h, c: 8 * k, col, seed, irr: 0.12, d: 0.6, hi: 0.2, gap: 1.02 })
    case 'urushi':
      return [...pebbles({ x, y, w, h, c: 4.4 * k, col, seed, irr: 0.42, d: 0.7, hi: 0.08 }), Rf(big ? 'gr-uruL' : 'gr-uru')]
    case 'nubuck':
      return [Rf(big ? 'gr-nubL' : 'gr-nub')]
    case 'suede':
      return [Rf('gr-mottle'), Rf(big ? 'gr-sueL' : 'gr-sue')]
    case 'alc':
      return [Rf(big ? 'gr-alcL' : 'gr-alc')]
    case 'peccary':
      return [Rf('gr-mottle'), Rf(big ? 'gr-pecL' : 'gr-pec')]
    case 'brush':
      return [Rf('gr-brush'), Rf('gr-mottle')]
    case 'pullup':
      return [...pebbles({ x, y, w, h, c: 9 * k, col, seed, irr: 0.4, d: 0.1, hi: 0.07, sw: 0.3 }), Rf('gr-mottle'), Rf('gr-sheen')]
    case 'oiled':
      return [Rf('gr-mottle'), Rf('gr-sheen')]
    case 'flat':
      return []
    default:
      return [Rf('gr-sheen')]
  }
}

// A leather surface: fills the rect (x, y, w, h) — or the path d, with that
// rect as its bounding box — with a texture.
function Grain({ x, y, w, h, d, kind = 'smooth', col = LC.tan, k = 1, seed = 1, rx = 0, stroke = 'rgba(20,12,6,0.9)', sw = 0.8, children, noStroke }) {
  const id = uid()
  return (
    <g>
      <clipPath id={`gc${id}`}>{d ? <path d={d} /> : <rect x={x} y={y} width={w} height={h} rx={rx} />}</clipPath>
      <g clipPath={`url(#gc${id})`}>
        <rect x={x} y={y} width={w} height={h} fill={col} />
        {tex(kind, x, y, w, h, k, seed, col)}
        {children}
      </g>
      {!noStroke && (d ? <path d={d} fill="none" stroke={stroke} strokeWidth={sw} /> : <rect x={x} y={y} width={w} height={h} rx={rx} fill="none" stroke={stroke} strokeWidth={sw} />)}
    </g>
  )
}

// Relief of each surface in section: bump width b, height h (px at k = 1),
// p = sharpness exponent (smaller = broader crests, narrower creases).
const RELIEF = {
  milled: { b: [6, 11], h: [1.6, 2.8], p: 0.6 },
  coarse: { b: [9, 15], h: [2, 3.2], p: 0.6 },
  shrunken: { b: [8, 15], h: [3.4, 5.6], p: 0.45 },
  chevre: { b: [2.8, 4.4], h: [0.8, 1.3], p: 0.6 },
  peccary: { b: [10, 18], h: [0.5, 1.0], p: 0.8 },
  urushi: { b: [3.5, 6], h: [0.9, 1.6], p: 0.55 },
  scales: { b: [7, 9], h: [1.5, 2], p: 0.4 },
}
// Upper surface of a ply from x1 to x2 about the mean line y.
function profile(kind, x1, x2, y, k = 1, seed = 3) {
  if (kind === 'print') {
    const p = 4 * k
    const pts = []
    for (let x = x1; x < x2 - 0.01; x += p) {
      const e = Math.min(x2, x + p)
      pts.push([x, y - 0.5 * k], [x + (e - x) * 0.3, y - 0.5 * k], [x + (e - x) * 0.5, y + 0.9 * k], [x + (e - x) * 0.7, y - 0.5 * k])
    }
    pts.push([x2, y - 0.5 * k])
    return pts
  }
  const r = RELIEF[kind]
  if (!r) return [[x1, y], [x2, y]]
  const R = rng(seed)
  const pts = []
  let x = x1
  while (x < x2 - 0.01) {
    const b = (r.b[0] + R() * (r.b[1] - r.b[0])) * k
    const hh = (r.h[0] + R() * (r.h[1] - r.h[0])) * k
    const e = Math.min(x2, x + b)
    for (let i = pts.length ? 1 : 0; i <= 8; i++) {
      const t = i / 8
      pts.push([x + (e - x) * t, y + hh * 0.5 - hh * Math.pow(Math.sin(Math.PI * t), r.p)])
    }
    x = e
  }
  return pts
}

const wavy = (x1, x2, y, w) => {
  let d = `M${f1(x1)} ${f1(y)}`
  const n = Math.max(1, Math.floor((x2 - x1) / w))
  for (let i = 0; i < n; i++) d += ` q${f1(w / 2)} -1.1 ${f1(w)} 0`
  return d
}

// A ply in section whose upper surface carries the grain's relief.
// x1..x2, mean surface y, thickness t (px). coat = colour of the surface
// finish line; nap = hair length px (nubuck short, suede long).
function GSec({ x1, x2, y, t, kind = 'smooth', k = 1, seed = 3, fill = 'url(#sk-topS)', stroke = '#4a3018', coat, coatW = 1.8, nap = 0, napC = 'rgba(236,228,214,0.75)', fib = true, pts }) {
  const id = uid()
  const top = pts || profile(kind, x1, x2, y, k, seed)
  const poly = [...top, [x2, y + t], [x1, y + t]]
  const d = P(poly, true)
  const R = rng(seed + 11)
  const hairs = []
  if (nap) {
    const step = nap > 3 ? 1.7 : 1.3
    let i = 0
    for (let x = x1 + 0.8; x < x2 - 0.5; x += step, i++) {
      const L = nap * (0.55 + R() * 0.65)
      const lean = (R() - 0.35) * L * 0.7
      hairs.push(
        <path
          key={i}
          d={nap > 3 ? `M${f1(x)} ${f1(y)} q${f1(lean * 0.1)} ${f1(-L * 0.6)} ${f1(lean)} ${f1(-L)}` : `M${f1(x)} ${f1(y)} l${f1(lean)} ${f1(-L)}`}
          fill="none"
          stroke={napC}
          strokeWidth="0.7"
          strokeLinecap="round"
        />
      )
    }
  }
  const fibres = []
  if (fib) for (let yy = y + 3.5; yy < y + t - 1; yy += 4.5) fibres.push(<path key={yy} d={wavy(x1 - 6, x2 + 6, yy + R() * 1.4, 12)} fill="none" stroke="rgba(78,48,20,0.28)" strokeWidth="0.6" />)
  return (
    <g>
      <clipPath id={`gs${id}`}>
        <path d={d} />
      </clipPath>
      <path d={d} fill={fill} />
      {!String(fill).startsWith('url') && <path d={d} fill="url(#gr-shade)" />}
      <g clipPath={`url(#gs${id})`}>{fibres}</g>
      {coat && <path d={P(top)} fill="none" stroke={coat} strokeWidth={coatW} strokeLinejoin="round" transform={`translate(0 ${coatW / 2})`} />}
      <path d={d} fill="none" stroke={stroke} strokeWidth="0.8" strokeLinejoin="round" />
      {hairs}
    </g>
  )
}

// Vertical dimension, figure written level.
function VDim({ x, y1, y2, text, side = 'r', c = C.dim, s = 10.5, from }) {
  const short = Math.abs(y2 - y1) < 18
  const d = side === 'r' ? 1 : -1
  const g = from == null ? 0 : Math.sign(x - from)
  return (
    <g>
      {from != null && (
        <g stroke={c} strokeWidth="0.6" opacity="0.6">
          <line x1={from + g * 2} y1={y1} x2={x + g * 3} y2={y1} />
          <line x1={from + g * 2} y1={y2} x2={x + g * 3} y2={y2} />
        </g>
      )}
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={c} strokeWidth="0.85" markerStart={short ? undefined : 'url(#sk-a-dim)'} markerEnd={short ? undefined : 'url(#sk-a-dim)'} />
      {short && (
        <g stroke={c} strokeWidth="1.1">
          <line x1={x - 3} y1={y1} x2={x + 3} y2={y1} />
          <line x1={x - 3} y1={y2} x2={x + 3} y2={y2} />
        </g>
      )}
      {text && (
        <text x={x + d * 5} y={(y1 + y2) / 2 + s * 0.36} fontSize={s} fill={c} fontFamily={MONO} textAnchor={d > 0 ? 'start' : 'end'}>
          {text}
        </text>
      )}
    </g>
  )
}

// Horizontal dimension, figure centred above (or below).
function HDim({ x1, x2, y, text, below, c = C.dim, s = 10.5, ext }) {
  const short = Math.abs(x2 - x1) < 22
  return (
    <g>
      {ext != null && (
        <g stroke={c} strokeWidth="0.6" opacity="0.6">
          <line x1={x1} y1={ext} x2={x1} y2={y + Math.sign(y - ext) * 3} />
          <line x1={x2} y1={ext} x2={x2} y2={y + Math.sign(y - ext) * 3} />
        </g>
      )}
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={c} strokeWidth="0.85" markerStart={short ? undefined : 'url(#sk-a-dim)'} markerEnd={short ? undefined : 'url(#sk-a-dim)'} />
      {short && (
        <g stroke={c} strokeWidth="1.1">
          <line x1={x1} y1={y - 3} x2={x1} y2={y + 3} />
          <line x1={x2} y1={y - 3} x2={x2} y2={y + 3} />
        </g>
      )}
      {text && (
        <text x={(x1 + x2) / 2} y={below ? y + s + 2 : y - 4} fontSize={s} fill={c} fontFamily={MONO} textAnchor="middle">
          {text}
        </text>
      )}
    </g>
  )
}

// Leader whose line stops short of a centred label (copied from figs-finish).
function Lb({ p, t, text, sub, a, c = C.text, s = 11, subc = C.faint, dot = true }) {
  const anchor = a || (t[0] >= p[0] ? 'start' : 'end')
  let e = t
  if (anchor === 'middle') e = [t[0], t[1] > p[1] ? t[1] - s + 1 : t[1] + 9 + (sub ? s + 1 : 0)]
  const tx = t[0] + (anchor === 'start' ? 4 : anchor === 'end' ? -4 : 0)
  return (
    <g>
      <line x1={p[0]} y1={p[1]} x2={e[0]} y2={e[1]} stroke={C.struct} strokeWidth="0.8" opacity="0.85" />
      {dot && <circle cx={p[0]} cy={p[1]} r="2.2" fill={c} />}
      <text x={tx} y={t[1] + 4} textAnchor={anchor} fontSize={s} fill={c} fontFamily={FONT}>
        {text}
      </text>
      {sub && (
        <text x={tx} y={t[1] + 4 + s + 2} textAnchor={anchor} fontSize={Math.max(10, s - 1)} fill={subc} fontFamily={FONT}>
          {sub}
        </text>
      )}
    </g>
  )
}

const Frame = ({ x, y, w, h, c = C.line }) => <rect x={x} y={y} width={w} height={h} rx="8" fill="rgba(255,255,255,0.025)" stroke={c} />

// Label on a dark pill, for text over a textured surface.
function Pill({ x, y, text, c = C.text, s = 10.5 }) {
  const w = text.length * s * 0.55 + 10
  return (
    <g>
      <rect x={x - w / 2} y={y - s - 1} width={w} height={s + 7} rx="4" fill="rgba(20,15,11,0.84)" />
      <text x={x} y={y + 1.5} textAnchor="middle" fontSize={s} fill={c} fontFamily={FONT}>
        {text}
      </text>
    </g>
  )
}

// Break mark on a section end that continues.
const Brk = ({ x, y1, y2 }) => {
  const h = y2 - y1 + 8
  return <path d={`M${x - 3} ${y1 - 4} l6 ${h * 0.3} l-6 ${h * 0.4} l6 ${h * 0.3}`} fill="none" stroke={C.dim} strokeWidth="1" />
}

// Saddle stitches along a straight line, pitch p px, slits at the holes.
function StitchLine({ x1, x2, y, p, c = C.thread, w = 1.6, holes = true, shadow, op = 1 }) {
  const n = Math.floor((x2 - x1) / p + 1e-6)
  const els = []
  for (let i = 0; i <= n; i++) {
    const x = x1 + i * p
    if (holes) els.push(<line key={'h' + i} x1={f1(x - w * 0.45)} y1={f1(y + w * 0.9)} x2={f1(x + w * 0.45)} y2={f1(y - w * 0.9)} stroke={C.hole} strokeWidth={f1(w * 0.75)} strokeLinecap="round" />)
    if (i < n) {
      const ax = x + p * 0.15
      const bx = x + p * 0.85
      if (shadow) els.push(<line key={'d' + i} x1={f1(ax)} y1={f1(y + w * 0.5 + 0.9)} x2={f1(bx)} y2={f1(y - w * 0.5 + 0.9)} stroke="rgba(0,0,0,0.5)" strokeWidth={f1(w + 0.8)} strokeLinecap="round" />)
      els.push(<line key={'s' + i} x1={f1(ax)} y1={f1(y + w * 0.5)} x2={f1(bx)} y2={f1(y - w * 0.5)} stroke={c} strokeWidth={f1(w)} strokeLinecap="round" opacity={op} />)
    }
  }
  return <g>{els}</g>
}

// Magnified detail: a ring at (fx, fy), and a circle at (cx, cy) showing
// the children (drawn in figure coordinates) enlarged k times.
function Magnifier({ cx, cy, r, fx, fy, k = 3, children, lc = C.brass }) {
  const id = uid()
  const rr = r / k
  const dx = cx - fx
  const dy = cy - fy
  const L = Math.hypot(dx, dy) || 1
  const ux = dx / L
  const uy = dy / L
  return (
    <g>
      <circle cx={fx} cy={fy} r={rr} fill="none" stroke={lc} strokeWidth="1" strokeDasharray="2 2" />
      <line x1={fx + ux * rr} y1={fy + uy * rr} x2={cx - ux * r} y2={cy - uy * r} stroke={lc} strokeWidth="0.8" strokeDasharray="2 2" />
      <clipPath id={`mg${id}`}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <circle cx={cx} cy={cy} r={r} fill={C.ground} />
      <g clipPath={`url(#mg${id})`}>
        <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-fx} ${-fy})`}>{children}</g>
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={lc} strokeWidth="1.3" />
      <text x={cx + r * 0.72} y={cy - r * 0.78} fontSize="10" fill={lc} fontFamily={MONO}>
        ×{k}
      </text>
    </g>
  )
}

// Skiving knife in side view: edge at (x, y), blade rising right at `ang`°.
function SideKnife({ x, y, ang, L = 110, hl = 66, k = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${-ang}) scale(${k})`}>
      <path d={`M0 0 L16 -4.5 L${L} -4.5 L${L} 0 Z`} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
      <line x1="0.5" y1="-0.2" x2="16" y2="-4.4" stroke="#f6fbff" strokeWidth="1.1" />
      <rect x={L} y={-9} width={hl} height={13} rx="3" fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.8" />
      {[L + 10, L + hl - 12].map((xx) => (
        <rect key={xx} x={xx} y={-9.5} width="3" height="14" fill="#2a2018" />
      ))}
    </g>
  )
}

// Stitching groover, side view: cutting tip at (0,0), handle up.
function Groover({ x, y, ang = 0, k = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${k})`}>
      <path d="M-1.6 0 L1.6 0 L2.8 -9 L-2.8 -9 Z" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.6" />
      <path d="M-2.8 -9 L-9 -14 L-9 -20 L-3 -18 L-3 -40 L3 -40 L3 -9 Z" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.7" />
      <rect x="-4" y="-46" width="8" height="7" rx="1.5" fill="url(#sk-brassG)" stroke="#5c461a" strokeWidth="0.6" />
      <path d="M-5.5 -46 L-6.5 -100 Q0 -106 6.5 -100 L5.5 -46 Z" fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.8" />
    </g>
  )
}

// Suede / nubuck brush: bristle tips on y, centred on x.
function NapBrush({ x, y, w = 40 }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - 18} width={w} height={11} rx="3" fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.8" />
      {Array.from({ length: Math.floor(w / 3) }, (_, i) => (
        <line key={i} x1={x - w / 2 + 2.5 + i * 3} y1={y - 7} x2={x - w / 2 + 3.3 + i * 3} y2={y} stroke="#cfc6b4" strokeWidth="0.9" />
      ))}
    </g>
  )
}

const Drop = ({ x, y, s = 1, c = 'rgba(150,200,225,0.9)' }) => (
  <path d={`M${x} ${y} C${x - 3.2 * s} ${y + 4.5 * s} ${x - 3.2 * s} ${y + 8 * s} ${x} ${y + 8 * s} C${x + 3.2 * s} ${y + 8 * s} ${x + 3.2 * s} ${y + 4.5 * s} ${x} ${y} Z`} fill={c} stroke="rgba(90,140,170,0.9)" strokeWidth="0.6" />
)

// Section of a lined strap's edge, end-on: blue face over a cognac core,
// cream lining, both edges painted `paint`.
function MiniEdge({ cx, y, w = 76, paint, seed = 3 }) {
  const x1 = cx - w / 2
  const x2 = cx + w / 2
  const top = profile('shrunken', x1 + 3, x2 - 3, y + 2, 0.7, seed)
  return (
    <g>
      <GSec x1={x1 + 3} x2={x2 - 3} y={y + 2} t={12} pts={top} fill={LC.core} coat={LC.blue} coatW={2.4} fib={false} />
      <rect x={x1 + 3} y={y + 14} width={w - 6} height={7} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
      {[x1 + 1.5, x2 - 1.5].map((ex) => (
        <line key={ex} x1={ex} y1={y} x2={ex} y2={y + 21.5} stroke={paint} strokeWidth="3.4" strokeLinecap="round" />
      ))}
    </g>
  )
}

/* ================================================================== */
/* 1 · Three ways a grain is made                                       */
/* ================================================================== */
const SKIN = (x, y) =>
  `M${x + 8} ${y + 10} Q${x + 20} ${y + 2} ${x + 35} ${y + 4} Q${x + 50} ${y + 2} ${x + 62} ${y + 10} L${x + 68} ${y + 5} L${x + 66} ${y + 16} Q${x + 70} ${y + 24} ${x + 66} ${y + 32} L${x + 70} ${y + 42} L${x + 60} ${y + 38} Q${x + 48} ${y + 45} ${x + 35} ${y + 42} Q${x + 22} ${y + 45} ${x + 10} ${y + 38} L${x} ${y + 42} L${x + 4} ${y + 32} Q${x} ${y + 24} ${x + 4} ${y + 16} L${x + 2} ${y + 5} Z`

function GGrains() {
  const W = 100
  const cols = [
    { x: 30, tag: 'Printed', sub: 'Epsom-type', kind: 'print', k: 2, col: LC.taupe, t: 12, rk: 1.4, how: 'heated plate', sec: 'regular relief', notes: ['heated plate stamps', 'a small, even print', 'light and firm:', 'holds its shape'] },
    { x: 142, tag: 'Milled', sub: 'Togo, Taurillon', kind: 'milled', k: 1.2, col: LC.noisette, t: 15, rk: 1.3, how: 'tumbled in a drum', sec: 'irregular pebbles', notes: ['drum-tumbled: the', 'grain gathers into', 'soft pebbles:', 'heavier, stretchier'] },
    { x: 254, tag: 'Shrunken', sub: 'shrunk calf', kind: 'shrunken', k: 1.1, col: LC.blue, t: 21, rk: 1.15, how: 'area −20–30 %', sec: 'tall crests, thick', notes: ['hide contracts:', 'grain rises into', 'deep crests:', 'thicker, spongier'] },
    { x: 366, tag: 'Natural', sub: 'goat · chèvre', kind: 'chevre', k: 1.15, col: LC.grey, t: 11, rk: 1.3, how: 'goatskin, as tanned', sec: 'fine pebble', notes: ['goat’s own grain,', 'not stamped or', 'tumbled: a fine', 'natural pebble'] },
  ]
  const glyph = (i, c) => {
    const x = c.x
    if (i === 0) {
      let zig = `M${x + 18} 89`
      for (let j = 0; j <= 16; j++) zig += ` L${x + 18 + j * 4} ${j % 2 ? 92.5 : 89}`
      zig += ` L${x + 82} 89 Z`
      return (
        <g>
          {[0, 1, 2].map((j) => (
            <path key={j} d={`M${x + 32 + j * 18} 74 q3 -3.5 0 -7 q-3 -3.5 0 -7`} fill="none" stroke="#e5824a" strokeWidth="1.3" opacity="0.85" />
          ))}
          <rect x={x + 18} y={76} width={64} height={13} rx="2" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
          <path d={zig} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.6" />
          <Arrow a={[x + 92, 74]} b={[x + 92, 96]} w={1.6} />
          <GSec x1={x + 6} x2={x + 86} y={104} t={9} kind="print" k={1.4} coat={c.col} fib={false} />
        </g>
      )
    }
    if (i === 1) {
      const cx = x + 50
      const cy = 93
      return (
        <g>
          <circle cx={cx} cy={cy} r={24} fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={19} fill="#1d1713" stroke="#3e2614" strokeWidth="0.8" />
          {[0, 1, 2, 3, 4, 5].map((j) => {
            const a = (j * Math.PI) / 3 + 0.3
            return <line key={j} x1={cx + 19 * Math.cos(a)} y1={cy + 19 * Math.sin(a)} x2={cx + 13.5 * Math.cos(a)} y2={cy + 13.5 * Math.sin(a)} stroke="#8d6c4b" strokeWidth="2.4" strokeLinecap="round" />
          })}
          {[[-7, 6, 20], [5, -5, -30], [4, 9, 60]].map(([dx, dy, a], j) => (
            <path key={j} d="M-5 0 q5 -3.5 10 0" transform={`translate(${cx + dx} ${cy + dy}) rotate(${a})`} stroke={c.col} strokeWidth="3.4" fill="none" strokeLinecap="round" />
          ))}
          <circle cx={cx} cy={cy} r={2.6} fill="url(#sk-barEnd)" />
          <Arrow d={`M${cx - 25.1} ${cy - 14.5} A29 29 0 0 1 ${cx + 25.1} ${cy - 14.5}`} w={1.5} />
        </g>
      )
    }
    if (i === 2) {
      return (
        <g>
          <rect x={x + 20} y={71} width={60} height={42} fill="none" stroke={C.dim} strokeWidth="1" strokeDasharray="4 3" />
          <Grain x={x + 24.5} y={74.2} w={51} h={35.6} kind="shrunken" k={0.6} col={c.col} seed={41} />
          <Arrow a={[x + 4, 92]} b={[x + 22, 92]} w={1.5} />
          <Arrow a={[x + 96, 92]} b={[x + 78, 92]} w={1.5} />
          <Arrow a={[x + 50, 60]} b={[x + 50, 73]} w={1.5} />
        </g>
      )
    }
    return <Grain x={x + 15} y={70} w={70} h={46} d={SKIN(x + 15, 70)} kind="chevre" k={0.8} col={c.col} seed={77} />
  }
  return (
    <Fig h={336} view="Plan & section · four grains" scale="sections schematic">
      <GrDefs />
      {[
        ['process', 92],
        ['plan', 163],
        ['section', 224],
      ].map(([l, yy]) => (
        <g key={l} transform={`rotate(-90 16 ${yy})`}>
          <Tag x={16} y={yy + 3} a="middle">
            {l}
          </Tag>
        </g>
      ))}
      {[136, 248, 360].map((x) => (
        <Sep key={x} x1={x} y1={30} x2={x} y2={312} />
      ))}
      {cols.map((c, i) => (
        <g key={c.tag}>
          <Tag x={c.x} y={40}>
            {c.tag}
          </Tag>
          <T x={c.x} y={54} s={10.5} c={C.dim}>
            {c.sub}
          </T>
          {glyph(i, c)}
          <T x={c.x + W / 2} y={126} a="middle" s={10} c={i === 2 ? C.text : C.faint} mono={i === 2}>
            {c.how}
          </T>
          <Grain x={c.x} y={134} w={W} h={60} rx={3} kind={c.kind} k={c.k} col={c.col} seed={i * 13 + 2} />
          <GSec x1={c.x + 2} x2={c.x + W - 2} y={214} t={c.t} kind={c.kind} k={c.rk} seed={i * 5 + 1} coat={c.col} />
          <T x={c.x + W / 2} y={254} a="middle" s={10} c={C.faint} it>
            {c.sec}
          </T>
          <Note x={c.x} y={274} lines={c.notes} s={10.5} lh={13} c={C.dim} />
        </g>
      ))}
      <T x={240} y={329} a="middle" s={10.5} c={C.text}>
        All four take a painted or turned edge, never a burnish.
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* 2 · The named leathers                                               */
/* ================================================================== */
function GNamed() {
  // [name, sub, temper 1–5, note 1, note 2, surface, colour, k]
  const rows = [
    ['Epsom', 'embossed calf, several tanneries', 4, 'light, scratch-resistant', 'a name, not one tannery', 'print', LC.taupe, 1],
    ['Togo', 'naturally shrunk · pebbled · matte', 2, 'soft, stretchier', 'reinforce full length', 'milled', LC.navy, 0.9],
    ['Taurillon', 'young bull · large soft pebble', 2, 'soft, stretchier', 'reinforce full length', 'coarse', LC.noisette, 0.8],
    ['Alran Chèvre Sully', 'fine-grained goat', 2, 'soft', 'hard to shape', 'chevre', LC.grey, 1],
    ['Peccary', 'three-pore clusters · supple', 2, 'noticeably stretchy', 'reinforce full length', 'peccary', LC.cognac, 1],
    ['Badalassi Pueblo', 'veg-tan dyed through, brushed', 4, 'not water-resistant', 'waxed cousin: a pull-up', 'brush', LC.navy2, 1],
    ['Badalassi Minerva Box', 'veg-tan · drum-tumbled · oiled', 3, 'pull-up, ≈ 1.8–2 mm', 'lightens where it bends', 'pullup', LC.chestnut, 1],
    ['Degermann Baranil', 'chrome, then veg re-tan, oiled', 1, 'soft, ≈ 2 mm', 'soft from new', 'oiled', LC.baranil, 1],
    ['Himeji Kurozan', 'hide lacquered with urushi', 4, 'sparkling grain', 'never flex hard', 'urushi', LC.black, 0.9],
  ]
  const y0 = 66
  const dy = 29
  return (
    <Fig h={340} view="Chart · the named leathers" scale="swatches enlarged">
      <GrDefs />
      <Tag x={14} y={40}>
        Leather
      </Tag>
      <Tag x={242} y={40}>
        Temper
      </Tag>
      <Tag x={304} y={40}>
        Behaviour
      </Tag>
      <Tag x={455} y={40} a="middle">
        Edge
      </Tag>
      <T x={242} y={53} s={10} c={C.faint}>
        soft
      </T>
      <T x={292} y={53} a="end" s={10} c={C.faint}>
        firm
      </T>
      {rows.map(([name, sub, temper, n1, n2, kind, col, k], i) => {
        const yc = y0 + i * dy
        return (
          <g key={name}>
            {i > 0 && <line x1={14} y1={yc - 15} x2={466} y2={yc - 15} stroke={C.line} strokeWidth="0.6" strokeDasharray="2 3" />}
            <Grain x={14} y={yc - 11} w={30} h={22} rx={2} kind={kind} col={col} k={k} seed={i * 7 + 3} />
            <T x={52} y={yc - 1} s={11.5} c={C.text} w="600">
              {name}
            </T>
            <T x={52} y={yc + 11} s={10} c={C.faint}>
              {sub}
            </T>
            {[0, 1, 2, 3, 4].map((j) => (
              <circle key={j} cx={247 + j * 10} cy={yc + 1} r={3.4} fill={j < temper ? C.brass : 'none'} stroke={j < temper ? C.brass : C.struct} strokeWidth="1" opacity={j < temper ? 1 : 0.6} />
            ))}
            <T x={304} y={yc - 1} s={10.5} c={C.text}>
              {n1}
            </T>
            <T x={304} y={yc + 11} s={10} c={C.dim}>
              {n2}
            </T>
            <rect x={445} y={yc - 6} width={20} height={7} fill={col} stroke="#120c07" strokeWidth="0.5" />
            <rect x={445} y={yc + 1} width={20} height={4.5} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="0.5" />
            {[444, 466].map((ex) => (
              <line key={ex} x1={ex} y1={yc - 7} x2={ex} y2={yc + 6.5} stroke={col === LC.black ? '#3b3632' : col} strokeWidth="2.6" strokeLinecap="round" />
            ))}
          </g>
        )
      })}
      <T x={14} y={330} s={10} c={C.faint}>
        Temper is relative, read from the makers’ descriptions. All nine take a painted edge.
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* 3 · Read the finish                                                  */
/* ================================================================== */
function GFinish() {
  const cells = [
    { t: 'Aniline', b: ['shows every mark,', 'patinas most'] },
    { t: 'Semi-aniline', b: ['more even,', 'less patina'] },
    { t: 'Pigmented', b: ['scratches to a', 'different colour'] },
    { t: 'Pull-up', b: ['lightens where', 'it bends'] },
    { t: 'Rub-off · antique', b: ['dark coat over a', 'bright base'] },
    { t: 'PU-coated', b: ['a split under film:', 'avoid for straps'], bad: true },
  ]
  const fibres = (x1, x2, y, n, c = 'rgba(255,210,160,0.16)') =>
    Array.from({ length: n }, (_, i) => <path key={i} d={wavy(x1, x2, y + 4 + i * 5, 12)} fill="none" stroke={c} strokeWidth="0.7" />)
  const draw = (i, x0, y0) => {
    const sx1 = x0 + 12
    const sx2 = x0 + 128
    const sy = y0 + 30
    const W = sx2 - sx1
    const out = (d) => <path d={d} fill="none" stroke="#2b1a0d" strokeWidth="0.8" />
    const box = `M${sx1} ${sy} H${sx2} V${sy + 22} H${sx1} Z`
    if (i === 0)
      return (
        <g>
          <rect x={sx1} y={sy} width={W} height={22} fill="#7a4522" />
          <rect x={sx1} y={sy} width={W} height={22} fill="url(#gr-shade)" />
          {fibres(sx1, sx2, sy, 4)}
          <path d={`M${sx1 + 78} ${sy} l3 4.5 l3 -4.5 Z`} fill="#4a2510" />
          {out(box)}
          <Lb p={[sx1 + 34, sy + 13]} t={[x0 + 12, y0 + 64]} text="dye right through" s={10.5} a="start" />
          <Lb p={[sx2 - 14, sy + 1.5]} t={[x0 + 128, y0 + 77]} text="no pigment coat" s={10.5} a="end" />
        </g>
      )
    if (i === 1)
      return (
        <g>
          <rect x={sx1} y={sy} width={W} height={22} fill="#7a4522" />
          <rect x={sx1} y={sy} width={W} height={22} fill="url(#gr-shade)" />
          {fibres(sx1, sx2, sy + 2, 4)}
          <rect x={sx1} y={sy} width={W} height={3.6} fill="#a0714a" />
          <line x1={sx1} y1={sy + 0.5} x2={sx2} y2={sy + 0.5} stroke="#6a3a1c" strokeWidth="1" />
          {out(box)}
          <Lb p={[sx1 + 30, sy + 14]} t={[x0 + 12, y0 + 64]} text="dyed through" s={10.5} a="start" />
          <Lb p={[sx2 - 16, sy + 2]} t={[x0 + 128, y0 + 77]} text="light pigment base" s={10.5} a="end" />
        </g>
      )
    if (i === 2)
      return (
        <g>
          <rect x={sx1} y={sy} width={W} height={22} fill={LC.crust} />
          <rect x={sx1} y={sy} width={W} height={22} fill="url(#gr-shade)" />
          {fibres(sx1, sx2, sy + 2, 4, 'rgba(120,80,40,0.22)')}
          <rect x={sx1} y={sy} width={W} height={4.2} fill="#3a5d93" />
          <path d={`M${sx1 + 80} ${sy - 0.5} L${sx1 + 83} ${sy + 5} L${sx1 + 91} ${sy + 5} L${sx1 + 94} ${sy - 0.5} Z`} fill={LC.crust} />
          <circle cx={sx1 + 87} cy={sy + 2} r={7.5} fill="none" stroke={C.ruby} strokeWidth="1" strokeDasharray="2 2" />
          {out(box)}
          <Lb p={[sx1 + 30, sy + 14]} t={[x0 + 12, y0 + 64]} text="pale core" s={10.5} a="start" />
          <Lb p={[sx1 + 52, sy + 2]} t={[x0 + 128, y0 + 77]} text="opaque coloured coat" s={10.5} a="end" />
        </g>
      )
    if (i === 3) {
      const cx = x0 + 70
      const cy = y0 + 94
      const pt = (r, a) => [cx + r * Math.sin((a * Math.PI) / 180), cy - r * Math.cos((a * Math.PI) / 180)]
      const [o1, o2, i2, i1] = [pt(68, -40), pt(68, 40), pt(50, 40), pt(50, -40)]
      const d = `M${f1(o1[0])} ${f1(o1[1])} A68 68 0 0 1 ${f1(o2[0])} ${f1(o2[1])} L${f1(i2[0])} ${f1(i2[1])} A50 50 0 0 0 ${f1(i1[0])} ${f1(i1[1])} Z`
      const id = `pu${x0}`
      return (
        <g>
          <clipPath id={id}>
            <path d={d} />
          </clipPath>
          <path d={d} fill="#6e3c22" />
          <g clipPath={`url(#${id})`}>
            <ellipse cx={cx} cy={y0 + 30} rx={34} ry={13} fill="rgba(226,166,104,0.5)" />
            <ellipse cx={cx} cy={y0 + 28} rx={17} ry={6} fill="rgba(244,196,138,0.5)" />
            {[54, 59, 64].map((r) => (
              <path key={r} d={`M${f1(pt(r, -40)[0])} ${f1(pt(r, -40)[1])} A${r} ${r} 0 0 1 ${f1(pt(r, 40)[0])} ${f1(pt(r, 40)[1])}`} fill="none" stroke="rgba(30,14,4,0.25)" strokeWidth="0.7" />
            ))}
          </g>
          {out(d)}
          <Arrow d={`M${f1(pt(74, -46)[0])} ${f1(pt(74, -46)[1])} q-2 8 -6 13`} c="brass" w={1.3} />
          <Arrow d={`M${f1(pt(74, 46)[0])} ${f1(pt(74, 46)[1])} q2 8 6 13`} c="brass" w={1.3} />
          <Lb p={[cx - 4, y0 + 30]} t={[x0 + 12, y0 + 64]} text="lighter on the bend" s={10.5} a="start" />
          <Lb p={[x0 + 104, y0 + 50]} t={[x0 + 128, y0 + 77]} text="dark where flat" s={10.5} a="end" />
        </g>
      )
    }
    if (i === 4) {
      const top = profile('milled', sx1, sx2, sy + 3, 0.65, 4)
      const poly = [...top, [sx2, sy + 22], [sx1, sy + 22]]
      return (
        <g>
          <path d={P(poly, true)} fill={LC.crust} />
          <path d={P(poly, true)} fill="url(#gr-shade)" />
          <path d={P(top)} fill="none" stroke="#e08a33" strokeWidth="4.2" transform="translate(0 2.1)" />
          <path d={P(top)} fill="none" stroke="#2b1a10" strokeWidth="3" strokeDasharray="15 5" transform="translate(0 0.8)" />
          {out(P(poly, true))}
          <Lb p={[sx1 + 30, sy + 6]} t={[x0 + 12, y0 + 64]} text="bright base coat" s={10.5} a="start" />
          <Lb p={[sx2 - 22, sy + 2.5]} t={[x0 + 128, y0 + 77]} text="dark top coat" s={10.5} a="end" />
        </g>
      )
    }
    const R = rng(9)
    const cid = `pu-split${x0}`
    return (
      <g>
        <clipPath id={cid}>
          <rect x={sx1} y={sy + 4} width={W} height={18} />
        </clipPath>
        <rect x={sx1} y={sy + 4} width={W} height={18} fill="#b8a488" />
        <g clipPath={`url(#${cid})`}>
        {Array.from({ length: 26 }, (_, j) => {
          const x = sx1 + 2 + R() * (W - 10)
          const y = sy + 7 + R() * 12
          return <path key={j} d={`M${f1(x)} ${f1(y)} q${f1(3 + R() * 3)} ${f1((R() - 0.5) * 6)} ${f1(7 + R() * 4)} ${f1((R() - 0.5) * 3)}`} fill="none" stroke="rgba(100,76,48,0.6)" strokeWidth="0.7" />
        })}
        </g>
        <rect x={sx1} y={sy} width={W} height={4.4} fill="#2c3138" />
        <line x1={sx1 + 2} y1={sy + 1.2} x2={sx2 - 2} y2={sy + 1.2} stroke="#a8b4bf" strokeWidth="0.8" opacity="0.7" />
        {out(box)}
        <Lb p={[sx1 + 30, sy + 14]} t={[x0 + 12, y0 + 64]} text="split, no grain" s={10.5} a="start" />
        <Lb p={[sx2 - 18, sy + 2]} t={[x0 + 128, y0 + 77]} text="plastic (PU) film" s={10.5} a="end" />
      </g>
    )
  }
  const swatch = (i, x0, y0) => {
    const g = { x: x0 + 12, y: y0 + 90, w: 116, h: 18, rx: 2 }
    if (i === 0)
      return (
        <Grain {...g} kind="smooth" col="#7a4522">
          <ellipse cx={x0 + 46} cy={y0 + 99} rx={16} ry={6} fill="rgba(255,214,160,0.1)" />
          <path d={`M${x0 + 30} ${y0 + 95} l14 6 M${x0 + 70} ${y0 + 94} l20 -1 M${x0 + 96} ${y0 + 104} l12 -6`} stroke="rgba(42,20,6,0.75)" strokeWidth="1" />
        </Grain>
      )
    if (i === 1) return <Grain {...g} kind="smooth" col="#865433" />
    if (i === 2)
      return (
        <Grain {...g} kind="smooth" col="#3a5d93">
          <path d={`M${x0 + 40} ${y0 + 95} l26 7`} stroke="#e0c493" strokeWidth="1.3" />
        </Grain>
      )
    if (i === 3)
      return (
        <Grain {...g} kind="smooth" col="#6e3c22">
          <rect x={x0 + 50} y={y0 + 90} width={40} height={18} fill="rgba(226,166,104,0.22)" />
          <rect x={x0 + 60} y={y0 + 90} width={20} height={18} fill="rgba(236,180,118,0.35)" />
        </Grain>
      )
    if (i === 4) return <Grain {...g} kind="flat" col="#2b1a10">{pebbles({ x: g.x, y: g.y, w: g.w, h: g.h, c: 6, col: '#2b1a10', seed: 8, d: 0.3, hi: 0.5, hc: '224,138,51' })}</Grain>
    return (
      <Grain {...g} kind="flat" col="#2c3138">
        <rect x={g.x} y={y0 + 93} width={g.w} height={2.4} fill="rgba(255,255,255,0.16)" />
        <rect x={g.x} y={y0 + 97} width={g.w} height={1} fill="rgba(255,255,255,0.1)" />
      </Grain>
    )
  }
  return (
    <Fig h={336} view="Section · where the colour sits" scale="thickness ×12, schematic">
      <GrDefs />
      {cells.map((c, i) => {
        const x0 = 14 + (i % 3) * 156
        const y0 = i < 3 ? 28 : 184
        return (
          <g key={c.t}>
            <Frame x={x0} y={y0} w={140} h={146} c={c.bad ? 'rgba(194,88,99,0.55)' : C.line} />
            <Tag x={x0 + 10} y={y0 + 18}>
              {c.t}
            </Tag>
            {c.bad && <Verdict x={x0 + 124} y={y0 + 14} ok={false} r={7.5} />}
            {draw(i, x0, y0)}
            {swatch(i, x0, y0)}
            <T x={x0 + 12} y={y0 + 125} s={10.5} c={C.text}>
              {c.b[0]}
            </T>
            <T x={x0 + 12} y={y0 + 138} s={10.5} c={c.bad ? C.ruby : C.dim}>
              {c.b[1]}
            </T>
          </g>
        )
      })}
    </Fig>
  )
}

/* ================================================================== */
/* 4 · Test a scrap before you commit                                   */
/* ================================================================== */
// Map a flat section (x along the piece xa..xb, underside at yb) onto a
// former of radius R centred (cx, cy): underside on the former, centred on top.
function bendPts(pts, xa, xb, yb, cx, cy, R) {
  const xm = (xa + xb) / 2
  return pts.map(([x, y]) => {
    const th = (x - xm) / R
    const r = R + (yb - y)
    return [cx + r * Math.sin(th), cy - r * Math.cos(th)]
  })
}
function BentScrap({ cx, cy, R = 25, kind, k, col, soften, seed = 4 }) {
  const L = 100
  const t = 10
  let top = profile(kind, 0, L, 0, k, seed)
  if (soften) top = top.map(([x, y]) => [x, y * (0.3 + 0.7 * Math.min(1, Math.abs(x - L / 2) / 36))])
  const bot = []
  for (let x = L; x >= 0; x -= 2) bot.push([x, t])
  const poly = bendPts([...top, ...bot], 0, L, t, cx, cy, R)
  const surf = bendPts(top, 0, L, t, cx, cy, R)
  return (
    <g>
      <circle cx={cx} cy={cy} r={R - 1} fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.8" />
      <path d={P(poly, true)} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" strokeLinejoin="round" />
      <path d={P(surf)} fill="none" stroke={col} strokeWidth="2" strokeLinejoin="round" />
    </g>
  )
}

function GTest() {
  const head = (x, y, n, title) => (
    <g>
      <Num x={x + 16} y={y + 17} n={n} r={7} />
      <Tag x={x + 28} y={y + 21}>
        {title}
      </Tag>
    </g>
  )
  // C: iso block of a blue-finished, cognac-core leather
  const bx = 14
  const by = 190
  const F = [bx + 16, by + 80]
  const topFace = `M${F[0]} ${F[1]} L${F[0] + 100} ${F[1]} L${F[0] + 124} ${F[1] - 16} L${F[0] + 24} ${F[1] - 16} Z`
  const front = profile('shrunken', F[0], F[0] + 100, F[1] + 1, 0.7, 6)
  const frontPoly = [...front, [F[0] + 100, F[1] + 22], [F[0], F[1] + 22]]
  const side = `M${F[0] + 100} ${F[1]} L${F[0] + 124} ${F[1] - 16} L${F[0] + 124} ${F[1] + 6} L${F[0] + 100} ${F[1] + 22} Z`
  const sk = { x1: bx + 150, x2: bx + 212, y: by + 74 }
  const skTop = profile('shrunken', sk.x1, sk.x2, sk.y, 0.7, 9)
  const skPoly = [...skTop, [sk.x2, sk.y + 2.5], [sk.x2 - 32, sk.y + 18], [sk.x1, sk.y + 18]]
  return (
    <Fig h={340} view="Tests · on a scrap" scale="schematic">
      <GrDefs />
      {/* A · repeat */}
      <Frame x={14} y={28} w={222} h={156} />
      {head(14, 28, 1, 'Look for a repeat')}
      <Grain x={24} y={62} w={96} h={74} kind="print" k={3} col={LC.taupe} />
      {[
        [30, 66],
        [75, 102],
      ].map(([x, y]) => (
        <rect key={x} x={x} y={y} width={30} height={24} fill="none" stroke={C.brassHi} strokeWidth="1.4" strokeDasharray="3 2" />
      ))}
      <Grain x={130} y={62} w={96} h={74} kind="milled" k={1.6} col={LC.noisette} seed={21} />
      {[
        [136, 66],
        [181, 102],
      ].map(([x, y]) => (
        <rect key={x} x={x} y={y} width={30} height={24} fill="none" stroke={C.brassHi} strokeWidth="1.4" strokeDasharray="3 2" />
      ))}
      <T x={24} y={153} s={10.5} c={C.text}>
        printed: repeats
      </T>
      <T x={24} y={166} s={10} c={C.faint}>
        every cell the same
      </T>
      <T x={130} y={153} s={10.5} c={C.text}>
        milled: no repeat
      </T>
      <T x={130} y={166} s={10} c={C.faint}>
        no two cells alike
      </T>

      {/* B · flex */}
      <Frame x={244} y={28} w={222} h={156} />
      {head(244, 28, 2, 'Flex a scrap')}
      <BentScrap cx={300} cy={118} kind="print" k={1.6} col={LC.taupe} />
      <BentScrap cx={410} cy={118} kind="milled" k={1.6} col={LC.noisette} soften seed={7} />
      {[-1, 1].map((sg) => {
        const p = (th) => [410 + 45 * Math.sin(th), 118 - 45 * Math.cos(th)]
        const a = p(sg * 0.16)
        const b = p(sg * 0.6)
        return <Arrow key={sg} d={`M${f1(a[0])} ${f1(a[1])} A45 45 0 0 ${sg > 0 ? 1 : 0} ${f1(b[0])} ${f1(b[1])}`} w={1.4} />
      })}
      <T x={300} y={166} a="middle" s={10.5} c={C.text}>
        a print stays crisp
      </T>
      <T x={300} y={178} a="middle" s={10} c={C.faint}>
        firm, pattern unchanged
      </T>
      <T x={410} y={166} a="middle" s={10.5} c={C.text}>
        pebble softens
      </T>
      <T x={410} y={178} a="middle" s={10} c={C.faint}>
        and stretches
      </T>

      {/* C · core */}
      <Frame x={14} y={190} w={222} h={146} />
      {head(14, 190, 3, 'Cut: read the core')}
      <Grain x={F[0]} y={F[1] - 16} w={124} h={16} d={topFace} kind="shrunken" k={0.55} col={LC.blue} seed={31} />
      <path d={side} fill="#a7652f" stroke="#2b1a0d" strokeWidth="0.8" />
      <line x1={F[0] + 100} y1={F[1] + 1} x2={F[0] + 124} y2={F[1] - 15} stroke={LC.blue} strokeWidth="2.6" />
      <GSec x1={F[0]} x2={F[0] + 100} y={F[1] + 1} t={21} pts={front} fill={LC.core} coat={LC.blue} coatW={2.6} />
      <GSec x1={sk.x1} x2={sk.x2} y={sk.y} t={18} pts={[...skTop]} fill={LC.core} coat={LC.blue} coatW={2.4} fib={false} />
      <path d={P(skPoly, true)} fill={C.ground} opacity="0" />
      <path d={`M${sk.x2 + 1} ${sk.y - 4} L${sk.x2 + 1} ${sk.y + 19} L${sk.x2 - 33} ${sk.y + 19} Z`} fill={C.ground} />
      <line x1={sk.x2 - 32} y1={sk.y + 18} x2={sk.x2} y2={sk.y + 2.5} stroke={C.brassHi} strokeWidth="1.8" />
      <Lb p={[F[0] + 66, F[1] - 8]} t={[F[0] + 50, by + 40]} text="blue pigment on the grain" s={10.5} a="start" />
      <Lb p={[F[0] + 40, F[1] + 14]} t={[F[0], by + 120]} text="cognac core" sub="shows at every cut" s={10.5} a="start" />
      <Lb p={[sk.x2 - 14, sk.y + 11]} t={[sk.x2 + 2, by + 120]} text="and skive" s={10.5} a="end" />

      {/* D · edge */}
      <Frame x={244} y={190} w={222} h={146} />
      {head(244, 190, 4, 'Decide the edge')}
      <rect x={258} y={222} width={194} height={26} rx="6" fill="rgba(208,168,79,0.08)" stroke={C.brass} />
      <T x={355} y={239} a="middle" s={11} c={C.text}>
        finished or chrome-tanned grain?
      </T>
      <Arrow a={[330, 249]} b={[290, 266]} c="emerald" w={1.5} />
      <Arrow a={[355, 249]} b={[355, 266]} c="emerald" w={1.5} />
      <Arrow a={[380, 249]} b={[420, 266]} c="ruby" w={1.5} />
      <XSec cx={288} y={276} w={42} layers={[{ k: 'top', t: 8 }, { k: 'lining', t: 6 }]} edge="paint" b={2.5} coat={2.6} />
      <g>
        <rect x={334} y={279} width={38} height={7} fill="url(#sk-fill)" stroke="#3a2716" strokeWidth="0.6" />
        <path d="M334 276 H372 A7 7 0 0 1 372 290 H364" fill="none" stroke="#8c5f30" strokeWidth="3.6" />
        <rect x={334} y={290} width={30} height={5} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.6" />
      </g>
      <XSec cx={422} y={276} w={42} layers={[{ k: 'top', t: 8 }, { k: 'lining', t: 6 }]} edge="round" />
      <T x={288} y={312} a="middle" s={11} c={C.emerald}>
        paint
      </T>
      <T x={355} y={312} a="middle" s={11} c={C.emerald}>
        turn
      </T>
      <T x={422} y={312} a="middle" s={11} c={C.ruby}>
        burnish
      </T>
      <Verdict x={288} y={325} ok r={6.5} />
      <Verdict x={355} y={325} ok r={6.5} />
      <Verdict x={422} y={325} ok={false} r={6.5} />
    </Fig>
  )
}

/* ================================================================== */
/* 5 · Lay out for the pebble                                           */
/* ================================================================== */
const HIDE2 =
  'M52 42 L300 38 Q400 36 428 46 Q450 62 448 104 Q446 144 436 164 L456 204 L424 200 Q402 182 378 180 Q300 186 232 182 Q172 178 140 186 L118 210 L96 204 Q92 186 70 174 Q34 156 30 116 Q28 70 52 42 Z'
const Z_MED = 'M140 20 L310 20 Q300 80 312 148 Q240 170 150 162 Q132 90 140 20 Z'
const Z_FINE = 'M310 20 L470 20 L470 166 Q420 156 312 148 Q300 80 310 20 Z'

function GLayout() {
  const id = uid()
  const col = LC.pebble
  const set = (x, y, s, edge, keepers = true) => (
    <g>
      <StrapPlan T={{ x, y, s }} o={LONG()} face="none" edge={edge} />
      <StrapPlan T={{ x, y: y + 28 * s, s }} o={SHORT()} face="none" edge={edge} />
      {keepers &&
        [0, 1].map((j) => (
          <rect key={j} x={x + 88 * s} y={y + (24 + j * 8) * s} width={45 * s} height={5 * s} fill="none" stroke={edge} strokeWidth="1.6" />
        ))}
    </g>
  )
  const pair = (x0, kl, ks, ok) => {
    const TL = { x: x0 + 14, y: 270, s: 1.38 }
    const TS = { x: x0 + 14, y: 310, s: 1.38 }
    const dL = pathOf(outline(LONG()), TL)
    const dS = pathOf(outline(SHORT()), TS)
    return (
      <g>
        <Grain x={TL.x} y={TL.y - 15} w={170} h={30} d={dL} kind="milled" k={kl} col={col} seed={x0 + 3} />
        <Grain x={TS.x} y={TS.y - 15} w={112} h={30} d={dS} kind="milled" k={ks} col={col} seed={x0 + 9} />
        {[0, 1].map((j) => (
          <Grain key={j} x={x0 + 136} y={299 + j * 11} w={62} h={7} kind="milled" k={ks} col={col} seed={x0 + 20 + j} />
        ))}
        <Verdict x={x0 + 208} y={244} ok={ok} r={8} />
      </g>
    )
  }
  return (
    <Fig h={340} view="Plan · a milled side, and the pair cut from it" scale="pieces ≈ ×0.95">
      <GrDefs />
      <clipPath id={`hd${id}`}>
        <path d={HIDE2} />
      </clipPath>
      <clipPath id={`zm${id}`}>
        <path d={Z_MED} />
      </clipPath>
      <clipPath id={`zf${id}`}>
        <path d={Z_FINE} />
      </clipPath>
      <g clipPath={`url(#hd${id})`}>
        <rect x={24} y={30} width={440} height={186} fill={col} />
        {pebbles({ x: 24, y: 30, w: 440, h: 186, c: 10.5, col, seed: 3, irr: 0.36, d: 0.45, hi: 0.14, key: 'c' })}
        <g clipPath={`url(#zm${id})`}>
          <rect x={130} y={20} width={190} height={152} fill={col} />
          {pebbles({ x: 130, y: 20, w: 190, h: 152, c: 6.5, col, seed: 5, irr: 0.3, d: 0.42, hi: 0.14, key: 'm' })}
        </g>
        <g clipPath={`url(#zf${id})`}>
          <rect x={300} y={20} width={170} height={150} fill={col} />
          {pebbles({ x: 300, y: 20, w: 170, h: 150, c: 4.2, col, seed: 7, irr: 0.3, d: 0.4, hi: 0, key: 'f' })}
        </g>
        <path d={Z_MED} fill="none" stroke={LIGHT} strokeWidth="1.1" strokeDasharray="5 4" opacity="0.75" />
        <path d={Z_FINE} fill="none" stroke={LIGHT} strokeWidth="1.1" strokeDasharray="5 4" opacity="0.75" />
      </g>
      <path d={HIDE2} fill="none" stroke="#3a2614" strokeWidth="1.4" />
      <path d="M58 47 L300 43 Q398 41 424 50" fill="none" stroke={C.steel} strokeWidth="1.5" strokeDasharray="9 3 2 3" />
      <T x={60} y={34} s={10.5} c={C.steel}>
        backbone
      </T>

      {/* matched set in the even zone */}
      {set(160, 62, 0.95, C.brassHi)}
      <circle cx={298} cy={60} r={8.5} fill="rgba(20,15,11,0.85)" />
      <Verdict x={298} y={60} ok r={7} />
      <Arrow a={[160, 122]} b={[274, 122]} both w={1.4} />
      <Pill x={217} y={137} text="lengths along the backbone" s={10} />
      <Pill x={220} y={156} text="even zone: cut the set here" c={C.brassHi} s={10} />

      {/* a pair split across zones */}
      <StrapPlan T={{ x: 330, y: 74, s: 0.95 }} o={LONG()} face="none" edge={C.ruby} />
      <StrapPlan T={{ x: 44, y: 100, s: 0.95 }} o={SHORT()} face="none" edge={C.ruby} />
      <Pill x={387} y={100} text="long piece: fine" c={C.ruby} s={10} />
      <Pill x={82} y={126} text="short: coarse" c={C.ruby} s={10} />
      <Pill x={400} y={140} text="fine" s={10.5} />
      <Pill x={250} y={178} text="coarse" s={10.5} />

      {/* the two results */}
      <Frame x={14} y={228} w={222} h={108} c="rgba(123,165,131,0.5)" />
      <Tag x={24} y={246}>
        One zone: one strap
      </Tag>
      {pair(14, 0.95, 0.95, true)}
      <Frame x={244} y={228} w={222} h={108} c="rgba(194,88,99,0.5)" />
      <Tag x={254} y={246}>
        Two zones: two straps
      </Tag>
      {pair(244, 0.55, 1.6, false)}
      <Pill x={352} y={274} text="fine" s={10} />
      <Pill x={312} y={314} text="coarse" s={10} />
    </Fig>
  )
}

/* ================================================================== */
/* 6 · Reinforce, and thicken soft leathers on wide straps              */
/* ================================================================== */
function GReinforce() {
  const X = (w) => 290 + (w - 16) * 26
  const Y = (t) => 290 - (t - 2.0) * 140
  return (
    <Fig h={340} view="Section, plan & chart · soft tops" scale="section thickness ×10">
      <GrDefs />
      <Tag x={16} y={40}>
        Section · along the strap
      </Tag>
      <GSec x1={34} x2={446} y={72} t={20} kind="milled" k={1.7} seed={12} coat={LC.noisette} />
      <rect x={34} y={92} width={412} height={3.6} fill={C.velodon} stroke="#4e6f84" strokeWidth="0.6" />
      <rect x={34} y={95.6} width={412} height={12} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.8" />
      <Brk x={34} y1={66} y2={108} />
      <Brk x={446} y1={66} y2={108} />
      <Lb p={[280, 71]} t={[296, 42]} text="milled or shrunken top" sub="stretches more than firm veg-tan" a="start" s={11} />
      <Lb p={[250, 93.8]} t={[270, 128]} text="reinforcement · full length" sub="compulsory, not optional · peccary too" a="start" s={11} />
      <Lb p={[432, 104]} t={[446, 130]} text="lining" a="end" s={11} />
      <Arrow a={[72, 120]} b={[38, 120]} w={1.4} />
      <T x={76} y={124} s={10.5} c={C.brass}>
        into the lug fold
      </T>

      <Sep x1={14} y1={156} x2={466} y2={156} />

      {/* holes */}
      <Tag x={16} y={176}>
        At the holes, after wear
      </Tag>
      {[
        { y: 190, ok: false },
        { y: 256, ok: true },
      ].map(({ y, ok }) => {
        const d = `M24 ${y} H212 Q228 ${y} 228 ${y + 13} Q228 ${y + 26} 212 ${y + 26} H24 Z`
        return (
          <g key={y}>
            <Grain x={24} y={y} w={204} h={26} d={d} kind="milled" k={0.9} col={LC.noisette} seed={y} />
            {ok && <path d={`M28 ${y + 3.5} H210 Q224 ${y + 3.5} 224 ${y + 13} Q224 ${y + 22.5} 210 ${y + 22.5} H28`} fill="none" stroke={C.velodon} strokeWidth="1.2" strokeDasharray="5 3" />}
            {[0, 1, 2, 3, 4, 5, 6].map((j) => {
              const cx = 70 + j * 20
              return ok ? (
                <circle key={j} cx={cx} cy={y + 13} r={2.6} fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />
              ) : (
                <g key={j}>
                  <circle cx={cx} cy={y + 13} r={2.6} fill="none" stroke={LIGHT} strokeWidth="0.6" strokeDasharray="1.5 1.5" />
                  <ellipse cx={cx + 2.2 + (j % 3) * 0.4} cy={y + 13} rx={4.6 + (j % 3) * 0.6} ry={2.5} fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />
                </g>
              )
            })}
            <Verdict x={222} y={y - 8} ok={ok} r={7} />
          </g>
        )
      })}
      <T x={24} y={232} s={10.5} c={C.text}>
        no reinforcement: holes stretch
      </T>
      <T x={24} y={245} s={10} c={C.faint}>
        toward the tip, under the tongue
      </T>
      <T x={24} y={298} s={10.5} c={C.text}>
        reinforced: the holes hold
      </T>
      <T x={24} y={311} s={10} c={C.faint}>
        Velodon, end to end
      </T>
      <T x={24} y={328} s={10} c={C.faint}>
        soft tops: milled, shrunken, peccary
      </T>

      {/* chart */}
      <Sep x1={240} y1={164} x2={240} y2={336} />
      <Tag x={254} y={176}>
        Thickness by width
      </Tag>
      <T x={290} y={196} s={10} c={C.faint}>
        finished thickness, mm
      </T>
      {[2.0, 2.2, 2.5].map((t) => (
        <g key={t}>
          <line x1={X(16)} y1={Y(t)} x2={X(22)} y2={Y(t)} stroke={C.line} strokeWidth="0.8" strokeDasharray="2 3" />
          <T x={284} y={Y(t) + 4} a="end" s={10} mono>
            {t.toFixed(1)}
          </T>
        </g>
      ))}
      {[16, 17, 18, 19, 20, 21, 22].map((w) => (
        <g key={w}>
          <line x1={X(w)} y1={290} x2={X(w)} y2={294} stroke={C.dim} strokeWidth="0.8" />
          <T x={X(w)} y={306} a="middle" s={10} mono>
            {w}
          </T>
        </g>
      ))}
      <T x={446} y={320} a="end" s={10} c={C.faint}>
        strap width, mm
      </T>
      <line x1={X(16)} y1={Y(2.2) + 0.5} x2={X(22)} y2={Y(2.2) + 0.5} stroke={C.steel} strokeWidth="1.8" strokeDasharray="5 3" />
      <path d={`M${X(16)} ${Y(2.2)} H${X(19.5)} V${Y(2.5)} H${X(22)}`} fill="none" stroke={C.brass} strokeWidth="2.2" />
      {[16, 17, 18, 19].map((w) => (
        <circle key={w} cx={X(w)} cy={Y(2.2)} r={2.8} fill={C.brass} />
      ))}
      {[20, 21, 22].map((w) => (
        <g key={w}>
          <circle cx={X(w)} cy={Y(2.5)} r={2.8} fill={C.brass} />
          <circle cx={X(w)} cy={Y(2.2)} r={2.6} fill={C.steel} />
        </g>
      ))}
      <T x={X(19.5) - 6} y={240} a="end" s={10.5} c={C.brass}>
        step at 20 mm
      </T>
      <T x={X(22)} y={Y(2.5) - 8} a="end" s={10.5} c={C.brass}>
        soft: 2.5
      </T>
      <T x={X(22)} y={Y(2.2) + 16} a="end" s={10.5} c={C.steel}>
        firm Epsom: 2.2
      </T>
      <line x1={254} y1={330} x2={270} y2={330} stroke={C.brass} strokeWidth="2.2" />
      <T x={274} y={334} s={10} c={C.dim}>
        shrunken calf
      </T>
      <line x1={346} y1={330} x2={362} y2={330} stroke={C.steel} strokeWidth="1.8" strokeDasharray="5 3" />
      <T x={366} y={334} s={10} c={C.dim}>
        Epsom
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* 7 · Skive from the flesh — no water or heat on the face              */
/* ================================================================== */
function faceDown(x1, x2, base, k, seed, kind = 'milled') {
  return profile(kind, x1, x2, 0, k, seed).map(([x, y]) => [x, base - y])
}
function GSkive() {
  const bot = faceDown(40, 316, 169.5, 1.5, 6)
  const ramp = (x) => 166 - (x - 40) * 0.2
  const poly = [[40, ramp(40)], [150, 144], [316, 144], ...bot.slice().reverse()]
  const body = (
    <g>
      <Slab x={20} y={172} w={300} h={12} kind="glass" />
      <path d={P(poly, true)} fill="url(#gr-topSinv)" stroke="#4a3018" strokeWidth="0.8" strokeLinejoin="round" />
      <path d={P(bot)} fill="none" stroke={LC.noisette} strokeWidth="2" transform="translate(0 -1)" />
    </g>
  )
  // spongy shrunken, bottom panels
  const botL = faceDown(30, 226, 288, 1.2, 9, 'shrunken')
  const dent = [[30, 256], [82, 256], [104, 261], [112, 270], [120, 262], [150, 256], [226, 256]]
  const botR = faceDown(256, 456, 288, 1.2, 13, 'shrunken')
  const rampR = (x) => 284.5 - ((x - 256) / 148) * 28.5
  const polyR = [[256, rampR(256)], [404, 256], [456, 256], ...botR.slice().reverse()]
  return (
    <Fig h={340} view="Side view · skiving a grained top" scale="leather ×16, schematic">
      <GrDefs />
      <path d="M40 144 L150 144 L40 166 Z" fill="rgba(208,168,79,0.12)" stroke={C.brass} strokeWidth="0.8" strokeDasharray="3 2" />
      {body}
      <SideKnife x={84} y={157.2} ang={11.3} L={108} hl={58} k={0.9} />
      <path d="M84 157 C95 153 108 148 118 144 C132 139 138 128 132 119 C128 113 120 115 122 122" fill="none" stroke="#4a3018" strokeWidth="6.2" strokeLinecap="round" />
      <path d="M84 157 C95 153 108 148 118 144 C132 139 138 128 132 119 C128 113 120 115 122 122" fill="none" stroke="#d3ae7b" strokeWidth="4.6" strokeLinecap="round" />
      <Arrow a={[214, 112]} b={[160, 122]} w={1.7} />
      <Magnifier cx={282} cy={78} r={34} fx={290} fy={166} k={4}>
        {body}
      </Magnifier>
      <T x={240} y={66} a="end" s={10.5} c={C.text}>
        the pattern lives in the
      </T>
      <T x={240} y={79} a="end" s={10.5} c={C.text}>
        top fraction of a mm
      </T>
      <Lb p={[70, 160]} t={[60, 108]} text="flesh up: skive here" a="start" s={11} />
      <Lb p={[44, 166]} t={[24, 204]} text="fold flap, feathered" a="start" s={10.5} />
      <Lb p={[230, 170]} t={[318, 204]} text="grain face down on glass" a="end" s={10.5} />
      <T x={316} y={182} a="end" s={10} c="#bfe0ea">
        glass
      </T>

      {/* keep off the face */}
      <Frame x={334} y={30} w={132} h={172} />
      <Tag x={344} y={48}>
        Keep off the face
      </Tag>
      <rect x={346} y={60} width={34} height={18} rx="5" fill="#d8c07a" stroke="#8c7a3e" strokeWidth="0.8" />
      {[[352, 65], [360, 71], [368, 64], [374, 72], [356, 74]].map(([x, y]) => (
        <ellipse key={x} cx={x} cy={y} rx={1.5} ry={1} fill="#9c8642" />
      ))}
      <Drop x={354} y={81} s={0.8} />
      <Drop x={368} y={84} s={0.8} />
      <Verdict x={398} y={70} ok={false} r={8} />
      <T x={412} y={74} s={11} c={C.text}>
        no damp
      </T>
      <GSec x1={342} x2={392} y={132} t={6} kind="print" k={1.2} coat={LC.taupe} fib={false} />
      <Creaser x={360} y={130} ang={58} k={0.42} hot />
      <Verdict x={410} y={122} ok={false} r={8} />
      <T x={424} y={126} s={11} c={C.text}>
        no heat
      </T>
      <GSec x1={344} x2={392} y={158} t={8} kind="print" k={2.2} coat={LC.taupe} fib={false} />
      <Arrow a={[396, 161]} b={[410, 161]} w={1.4} />
      <GSec x1={414} x2={460} y={158} t={8} pts={profile('print', 414, 460, 158, 2.2).map(([x, y]) => [x, 158 + (y - 158) * 0.25])} coat="#5a5045" fib={false} />
      <T x={368} y={182} a="middle" s={10} c={C.dim}>
        crisp
      </T>
      <T x={437} y={182} a="middle" s={10} c={C.ruby}>
        flattened
      </T>
      <T x={400} y={196} a="middle" s={10} c={C.faint}>
        the print is heat-set
      </T>

      {/* spongy shrunken */}
      <Sep x1={14} y1={212} x2={466} y2={212} />
      <Tag x={16} y={230}>
        Spongy shrunken leather
      </Tag>
      <Slab x={24} y={290} w={206} h={10} kind="glass" />
      <path d={P([...dent, ...botL.slice().reverse()], true)} fill="url(#gr-topSinv)" stroke="#4a3018" strokeWidth="0.8" strokeLinejoin="round" />
      <path d={P(botL)} fill="none" stroke={LC.blue} strokeWidth="2" transform="translate(0 -1)" />
      {[9, 15].map((r) => (
        <path key={r} d={`M${112 - r} ${266} A${r} ${r} 0 0 0 ${112 + r} ${266}`} fill="none" stroke={C.ruby} strokeWidth="0.9" strokeDasharray="2 2" />
      ))}
      <SideKnife x={112} y={270} ang={22} L={90} hl={50} k={0.8} />
      <Arrow a={[150, 238]} b={[146, 252]} c="ruby" w={1.6} />
      <Verdict x={214} y={322} ok={false} r={7.5} />
      <T x={30} y={318} s={10.5} c={C.text}>
        one heavy pass:
      </T>
      <T x={30} y={331} s={10.5} c={C.dim}>
        the blade sinks and gouges
      </T>

      <Slab x={250} y={290} w={212} h={10} kind="glass" />
      <path d="M256 256 L404 256 L256 284.5 Z" fill="rgba(208,168,79,0.1)" />
      <path d={P(polyR, true)} fill="url(#gr-topSinv)" stroke="#4a3018" strokeWidth="0.8" strokeLinejoin="round" />
      <path d={P(botR)} fill="none" stroke={LC.blue} strokeWidth="2" transform="translate(0 -1)" />
      {[262, 272].map((yl) => (
        <line key={yl} x1={256} y1={yl} x2={404} y2={256} stroke={C.brass} strokeWidth="1" strokeDasharray="3 2" />
      ))}
      <T x={262} y={250} s={10} c={C.brass}>
        1 · 2 · 3: light passes
      </T>
      <Verdict x={452} y={226} ok r={7.5} />
      <HDim x1={256} x2={404} y={314} text="a longer feather" ext={300} />
      <T x={256} y={331} s={10.5} c={C.text}>
        more, lighter passes
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* 8 · Mark with dividers, not a groover                                */
/* ================================================================== */
function GMark() {
  const panels = [
    { x0: 14, title: 'Dividers', ok: true, kind: 'milled', k: 1.4, col: LC.noisette, l: ['a light, clean score', 'rides over the pebbles'] },
    { x0: 170, title: 'Groover', ok: false, kind: 'milled', k: 1.4, col: LC.noisette, l: ['skids and tears', 'between the pebbles'] },
    { x0: 326, title: 'Hot creaser', ok: false, kind: 'print', k: 3, col: LC.taupe, l: ['glazes the print:', 'a shiny, flat track'] },
  ]
  const track = (i, x0) => {
    const y = 106
    if (i === 0)
      return (
        <g>
          <line x1={x0 + 8} y1={y} x2={x0 + 96} y2={y} stroke="rgba(28,12,4,0.9)" strokeWidth="1.1" />
          <line x1={x0 + 8} y1={y + 0.9} x2={x0 + 96} y2={y + 0.9} stroke="rgba(255,236,210,0.35)" strokeWidth="0.6" />
          <Dividers sp={24} h={34} x={x0 + 96} y={118} ang={90} />
        </g>
      )
    if (i === 1) {
      const R = rng(5)
      const segs = [[8, 24], [30, 46], [51, 70], [75, 92]]
      return (
        <g>
          {segs.map(([a, b], j) => {
            const pts = []
            for (let x = a; x <= b; x += 2) pts.push([x0 + x, y + (R() - 0.5) * 3])
            return (
              <g key={j}>
                <path d={P(pts)} fill="none" stroke="rgba(22,10,3,0.95)" strokeWidth="1.8" />
                <path d={`M${x0 + b} ${y - 1} l3 -4 l1 4 Z M${x0 + a + 4} ${y + 1} l2 4 l2 -3 Z`} fill="#e9d0a6" />
              </g>
            )
          })}
          <Groover x={x0 + 94} y={y} ang={40} k={0.52} />
        </g>
      )
    }
    return (
      <g>
        <rect x={x0 + 8} y={y - 4} width={86} height={8} fill="#5f5448" />
        <line x1={x0 + 8} y1={y - 2} x2={x0 + 94} y2={y - 2} stroke="#fff6e4" strokeWidth="1.2" opacity="0.55" />
        <line x1={x0 + 8} y1={y - 4} x2={x0 + 94} y2={y - 4} stroke="rgba(20,12,6,0.8)" strokeWidth="0.6" />
        <line x1={x0 + 8} y1={y + 4} x2={x0 + 94} y2={y + 4} stroke="rgba(20,12,6,0.8)" strokeWidth="0.6" />
        <Creaser x={x0 + 96} y={y} ang={40} k={0.5} hot />
      </g>
    )
  }
  const sec = (i, x0) => {
    const x1 = x0 + 22
    const x2 = x0 + 118
    const y = 180
    const mid = x0 + 70
    let pts = profile(panels[i].kind, x1, x2, y, i === 2 ? 1.8 : 1.5, 3 + i)
    if (i === 0) pts = [...pts.filter((p) => p[0] < mid - 2), [mid - 2, y - 0.8], [mid, y + 3.4], [mid + 2, y - 0.8], ...pts.filter((p) => p[0] > mid + 2)]
    if (i === 1) pts = [...pts.filter((p) => p[0] < mid - 6), [mid - 6, y - 3.4], [mid - 3.5, y + 1], [mid - 3, y + 6], [mid + 2.5, y + 5.5], [mid + 3.5, y + 0.5], [mid + 6.5, y - 3.6], ...pts.filter((p) => p[0] > mid + 6.5)]
    if (i === 2) pts = [...pts.filter((p) => p[0] < mid - 9), [mid - 9, y + 1.6], [mid + 9, y + 1.6], ...pts.filter((p) => p[0] > mid + 9)]
    return (
      <g>
        <GSec x1={x1} x2={x2} y={y} t={13} pts={pts} coat={panels[i].col} fib={false} />
        {i === 1 && <path d={`M${mid - 6} ${y - 3.4} l-2 -3 l3 1 Z M${mid + 6.5} ${y - 3.6} l2 -3 l-3 0.6 Z`} fill="#e9d0a6" />}
        {i === 2 && <line x1={mid - 9} y1={y + 2} x2={mid + 9} y2={y + 2} stroke="#fff6e4" strokeWidth="1.1" opacity="0.75" />}
      </g>
    )
  }
  return (
    <Fig h={340} view="Plan & section · marking the stitch line" scale="×7 · section ×12"
    >
      <GrDefs />
      {panels.map((p, i) => (
        <g key={p.title}>
          <Frame x={p.x0} y={28} w={140} h={172} c={p.ok ? 'rgba(123,165,131,0.55)' : 'rgba(194,88,99,0.55)'} />
          <Num x={p.x0 + 14} y={45} n={i + 1} r={7} />
          <Tag x={p.x0 + 26} y={49}>
            {p.title}
          </Tag>
          <Verdict x={p.x0 + 124} y={45} ok={p.ok} r={8} />
          <Grain x={p.x0 + 8} y={60} w={124} h={70} kind={p.kind} k={p.k} col={p.col} seed={i * 9 + 4} />
          <line x1={p.x0 + 8} y1={130} x2={p.x0 + 132} y2={130} stroke={C.topEdge} strokeWidth="1.4" />
          {track(i, p.x0)}
          <T x={p.x0 + 10} y={148} s={10.5} c={C.text}>
            {p.l[0]}
          </T>
          <T x={p.x0 + 10} y={161} s={10} c={C.dim}>
            {p.l[1]}
          </T>
          {sec(i, p.x0)}
        </g>
      ))}

      {/* template */}
      <Frame x={14} y={208} w={300} h={128} c="rgba(123,165,131,0.55)" />
      <Tag x={24} y={226}>
        Or prick through a template
      </Tag>
      <Verdict x={298} y={222} ok r={8} />
      <GSec x1={30} x2={296} y={296} t={12} kind="milled" k={1.3} seed={8} coat={LC.noisette} />
      <rect x={30} y={308} width={266} height={7} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
      <rect x={58} y={286.5} width={200} height={5.5} rx="1" fill="rgba(226,214,190,0.6)" stroke={C.struct} strokeWidth="0.8" />
      {Array.from({ length: 17 }, (_, j) => (
        <rect key={j} x={64 + j * 12 - 0.8} y={286.5} width={1.6} height={5.5} fill={C.hole} />
      ))}
      <Iron x={220} y={298} n={4} pitch={12} />
      <Lb p={[100, 288]} t={[44, 254]} text="template on the face" sub="card or acrylic, pre-pricked" a="start" s={10.5} />
      <T x={30} y={330} s={10.5} c={C.dim}>
        the iron goes straight through: no line scored
      </T>

      {/* test on scrap */}
      <Frame x={322} y={208} w={144} h={128} />
      <Tag x={332} y={226}>
        Test on scrap
      </Tag>
      <Grain x={334} y={238} w={120} h={56} kind="print" k={2} col={LC.taupe} rx={3}>
        <rect x={334} y={263} width={60} height={7} fill="#5f5448" />
        <line x1={334} y1={265} x2={394} y2={265} stroke="#fff6e4" strokeWidth="1.1" opacity="0.55" />
        <line x1={394} y1={266.5} x2={454} y2={266.5} stroke="rgba(28,14,4,0.9)" strokeWidth="1.3" />
        <line x1={394} y1={267.6} x2={454} y2={267.6} stroke="rgba(255,240,220,0.35)" strokeWidth="0.6" />
      </Grain>
      <line x1={394} y1={236} x2={394} y2={296} stroke={C.dim} strokeWidth="0.8" strokeDasharray="2 2" />
      <T x={364} y={310} a="middle" s={10.5} c={C.ruby}>
        too hot
      </T>
      <T x={424} y={310} a="middle" s={10.5} c={C.emerald}>
        right heat
      </T>
      <T x={394} y={328} a="middle" s={10} c={C.dim}>
        test any crease first
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* 9 · Match pitch and thread to the texture                            */
/* ================================================================== */
function GPitch() {
  const s = 7
  const x1 = 24
  const x2 = 234
  const rows = [
    { y: 54, kind: 'print', k: 1, col: LC.taupe, p: 2.4, w: 2.2, c: C.thread, ok: true, dim: '2.3–2.4', head: 'Fine print, fine stitch', l: ['reads crisp at ≈ 2.3–2.4 mm,', '2 mm from the edge (measured)'] },
    { y: 124, kind: 'coarse', k: 1.7, col: LC.navy, p: 2.4, w: 1.4, c: '#d9d2c2', op: 0.55, ok: false, dim: '2.4', head: 'Coarse pebble, fine stitch', l: ['the fine stitch disappears', 'into the texture'] },
    { y: 194, kind: 'coarse', k: 1.7, col: LC.navy, p: 3.0, w: 3, c: C.thread, shadow: true, ok: true, dim: '2.8–3.2', head: 'Coarse pebble, bold stitch', l: ['≈ 2.8–3.2 mm, off-white thread', 'sits on top of the texture'] },
  ]
  return (
    <Fig h={340} view="Plan · the same seam on two textures" scale="true scale ×7">
      <GrDefs />
      {rows.map((r, i) => {
        const yb = r.y + 42
        const ys = yb - 2 * s
        const p = r.p * s
        const hx = x1 + 8 + p * 5
        return (
          <g key={i}>
            <Grain x={x1} y={r.y} w={x2 - x1} h={42} kind={r.kind} k={r.k} col={r.col} seed={i * 11 + 5} noStroke />
            <line x1={x1} y1={yb} x2={x2} y2={yb} stroke={C.topEdge} strokeWidth="1.6" />
            <Brk x={x1} y1={r.y} y2={yb} />
            <Brk x={x2} y1={r.y} y2={yb} />
            <StitchLine x1={x1 + 8} x2={x2 - 4} y={ys} p={p} c={r.c} w={r.w} shadow={r.shadow} op={r.op} />
            <HDim x1={hx} x2={hx + p} y={yb + 9} text={r.dim} below />
            {i === 0 && <VDim x={244} y1={ys} y2={yb} text="2" from={x2} />}
            <T x={262} y={r.y + 10} s={11.5} c={C.text} w="600">
              {r.head}
            </T>
            <Verdict x={456} y={r.y + 6} ok={r.ok} r={8} />
            {r.l.map((l, j) => (
              <T key={j} x={262} y={r.y + 26 + j * 14} s={10.5} c={j ? C.dim : C.text}>
                {l}
              </T>
            ))}
          </g>
        )
      })}
      <T x={x1} y={46} s={10} c={C.faint}>
        edge at the bottom of each strip · 30 mm shown
      </T>

      <Sep x1={14} y1={262} x2={466} y2={262} />
      <Tag x={24} y={280}>
        Thread tone on pebble
      </Tag>
      {[
        { x: 24, c: '#5b6d93', a: 'tone-on-tone', b: 'a quiet strap' },
        { x: 134, c: '#efe6d2', a: 'pale contrast', b: 'draws the outline' },
      ].map((v, i) => (
        <g key={v.a}>
          <Grain x={v.x} y={286} w={100} h={22} kind="coarse" k={1.7} col={LC.navy} seed={60 + i} />
          <StitchLine x1={v.x + 6} x2={v.x + 96} y={297} p={21} c={v.c} w={2.6} shadow={i === 1} />
          <T x={v.x} y={321} s={10.5} c={C.text}>
            {v.a}
          </T>
          <T x={v.x} y={334} s={10} c={C.faint}>
            {v.b}
          </T>
        </g>
      ))}
      <Note x={262} y={286} s={10.5} lh={14} c={C.dim} lines={['Pebble swallows tonal thread.', 'Tone-on-tone for a quiet strap,', 'a pale contrast to draw', 'the outline.']} />
    </Fig>
  )
}

/* ================================================================== */
/* 10 · Level the bumps, then paint                                     */
/* ================================================================== */
function GEdge() {
  const segs = [46, 147, 248, 349, 450]
  const yA = 73
  const yT = 100
  const yL = 116
  const ar1 = profile('shrunken', segs[0], segs[1], yA, 0.85, 3)
  const ar2 = profile('shrunken', segs[1], segs[2], yA, 0.55, 5).map(([x, y]) => [x, Math.max(y, yA - 0.6)])
  const scratches = (a, b, n, seed) => {
    const R = rng(seed)
    return Array.from({ length: n }, (_, i) => {
      const y = yA + 4 + R() * (yL - yA - 6)
      const x = a + R() * (b - a - 30)
      return <line key={i} x1={f1(x)} y1={f1(y)} x2={f1(x + 14 + R() * 20)} y2={f1(y)} stroke="rgba(70,35,12,0.35)" strokeWidth="0.7" />
    })
  }
  // section at the edge for each stage
  const sec = (i) => {
    const x0 = segs[i]
    const xe = x0 + 72
    const y = 178
    const top = profile('shrunken', x0 + 8, xe, y, 0.9, 20 + i)
    // the arris sits in a crease: drop the last points to a low spot
    const n = top.length
    const low = top.map((p, j) => (j > n - 4 ? [p[0], y + 2.2] : p))
    const rough = i === 0
    const tEnd = rough ? xe + 2 : xe
    const poly = [...low.slice(0, -1), [tEnd, low[n - 1][1]], [tEnd + (rough ? 1 : 0), y + 8], [tEnd - (rough ? 1 : 0), y + 18], [x0 + 8, y + 18]]
    return (
      <g key={i}>
        <path d={P(poly, true)} fill={LC.core} />
        <path d={P(poly, true)} fill="url(#gr-shade)" />
        <path d={P(low)} fill="none" stroke={LC.blue} strokeWidth="2.2" transform="translate(0 1.1)" />
        <path d={P(poly, true)} fill="none" stroke="#2b1a0d" strokeWidth="0.8" />
        <rect x={x0 + 8} y={y + 18} width={xe - x0 - 8 - (rough ? 1 : 0)} height={11} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
        <Brk x={x0 + 8} y1={y - 3} y2={y + 29} />
        {rough &&
          [0, 1, 2, 3, 4, 5].map((j) => <path key={j} d={`M${xe + 2} ${y + 2 + j * 4.5} l${3 + (j % 2) * 2} ${-1 + (j % 3)}`} stroke="#e9cf9f" strokeWidth="0.8" />)}
        {i === 1 && (
          <g>
            <rect x={xe + 1} y={y - 10} width={12} height={46} rx="2" fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.8" />
            <rect x={xe + 0.5} y={y - 10} width={3} height={46} fill="#9d9483" />
          </g>
        )}
        {i >= 2 && (
          <g>
            <path d={`M${xe - 9} ${y - 1.4} L${xe} ${y - 1.4} L${xe} ${y + 2.6} Q${xe - 5} ${y + 2.2} ${xe - 9} ${y - 1.4} Z`} fill="#8a8279" />
            <rect x={xe} y={y - 1.4} width={2.6} height={31} fill="#8a8279" />
          </g>
        )}
        {i === 3 && (
          <g>
            <path d={`M${xe - 12} ${y - 2.6} L${xe + 2.6} ${y - 2.6} L${xe + 5.6} ${y} L${xe + 5.6} ${y + 27} L${xe + 2.6} ${y + 30.6} L${xe - 4} ${y + 30.6}`} fill="none" stroke={LC.blue} strokeWidth="3" strokeLinejoin="round" />
            <line x1={xe + 6.4} y1={y + 4} x2={xe + 6.4} y2={y + 22} stroke="#c9d8ee" strokeWidth="0.8" opacity="0.7" />
          </g>
        )}
      </g>
    )
  }
  return (
    <Fig h={340} view="Elevation & section · a pebbled edge" scale="edge ×12, schematic">
      <GrDefs />
      <Tag x={16} y={40}>
        The edge face, one strap length
      </Tag>
      {/* segment 1: wavy arris, raw */}
      <path d={P([...ar1, [segs[1], yT], [segs[0], yT]], true)} fill={LC.core} />
      {Array.from({ length: 21 }, (_, j) => (
        <line key={j} x1={segs[0] + 4 + j * 4.6} y1={yA + 6} x2={segs[0] + 5 + j * 4.6} y2={yT - 3} stroke="rgba(80,40,15,0.3)" strokeWidth="0.7" />
      ))}
      <path d={P(ar1)} fill="none" stroke={LC.blue} strokeWidth="2.2" transform="translate(0 1)" />
      {/* segment 2: sanded flat */}
      <path d={P([...ar2, [segs[2], yT], [segs[1], yT]], true)} fill={LC.core} />
      {scratches(segs[1], segs[2], 10, 3)}
      <path d={P(ar2)} fill="none" stroke={LC.blue} strokeWidth="2.2" transform="translate(0 1)" />
      <rect x={segs[0]} y={yT} width={segs[2] - segs[0]} height={yL - yT} fill="url(#sk-lin)" />
      {/* segment 3: primer */}
      <rect x={segs[2]} y={yA - 1.2} width={101} height={yL - yA + 1.2} fill="#8a8279" />
      <path d={P(profile('shrunken', segs[2], segs[3], yA, 0.55, 5).map(([x, y]) => [x, Math.max(y, yA - 0.6)]))} fill="none" stroke="rgba(40,30,20,0.35)" strokeWidth="0.8" strokeDasharray="2 2" />
      {/* segment 4: paint */}
      <rect x={segs[3]} y={yA - 1.6} width={101} height={yL - yA + 2} fill={LC.blue} />
      <rect x={segs[3]} y={yA - 1.6} width={101} height={yL - yA + 2} fill="url(#gr-shade)" />
      <line x1={segs[3] + 4} y1={yA + 3} x2={446} y2={yA + 3} stroke="#c9d8ee" strokeWidth="1" opacity="0.55" />
      <line x1={segs[0]} y1={yL} x2={450} y2={yL} stroke="#2b1a0d" strokeWidth="0.8" />
      {segs.slice(1, -1).map((x) => (
        <line key={x} x1={x} y1={yA - 6} x2={x} y2={yL + 4} stroke={C.ground} strokeWidth="1.2" strokeDasharray="2 2" />
      ))}
      <T x={40} y={yA + 16} a="end" s={10} c={C.faint}>
        top
      </T>
      <T x={40} y={yT + 11} a="end" s={10} c={C.faint}>
        lining
      </T>
      {['wavy arris', 'sanded flat, flush', 'primer fills lows', 'blue, like the face'].map((l, i) => {
        const cx = (segs[i] + segs[i + 1]) / 2
        return (
          <g key={l}>
            <Num x={cx} y={56} n={i + 1} r={7} />
            <T x={cx} y={133} a="middle" s={10.5} c={C.text}>
              {l}
            </T>
          </g>
        )
      })}
      <Tag x={16} y={160}>
        Section at the edge
      </Tag>
      {[0, 1, 2, 3].map(sec)}
      <Lb p={[segs[2] + 73, 196]} t={[segs[2] + 100, 222]} text="extra primer" a="end" s={10} />
      <Lb p={[segs[3] + 77, 190]} t={[segs[3] + 100, 222]} text="paint" a="end" s={10} />
      <Lb p={[segs[0] + 74, 186]} t={[segs[0] + 100, 222]} text="raw core" a="end" s={10} />
      <Lb p={[segs[1] + 82, 172]} t={[segs[1] + 98, 222]} text="sanding block" a="end" s={10} />

      <Sep x1={14} y1={230} x2={466} y2={230} />
      <Tag x={16} y={248}>
        Paint to the surface colour
      </Tag>
      <MiniEdge cx={70} y={262} paint={LC.blue} seed={4} />
      <MiniEdge cx={180} y={262} paint={LC.core} seed={6} />
      <Verdict x={118} y={258} ok r={7} />
      <Verdict x={228} y={258} ok={false} r={7} />
      <T x={70} y={306} a="middle" s={10.5} c={C.emerald}>
        surface colour
      </T>
      <T x={70} y={319} a="middle" s={10} c={C.faint}>
        edge reads as the face
      </T>
      <T x={180} y={306} a="middle" s={10.5} c={C.ruby}>
        core colour
      </T>
      <T x={180} y={319} a="middle" s={10} c={C.faint}>
        a cognac line shows
      </T>
      <Sep x1={240} y1={238} x2={240} y2={336} />
      <Tag x={252} y={248}>
        Colour the core where it shows
      </Tag>
      {[
        { y: 260, ok: false, t: 'raw' },
        { y: 292, ok: true, t: 'coloured' },
      ].map(({ y, ok, t }) => (
        <g key={y}>
          <rect x={290} y={y} width={110} height={22} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="0.7" />
          <Grain x={258} y={y} w={32} h={22} kind="shrunken" k={0.5} col={LC.blue} seed={y} noStroke />
          <rect x={280} y={y} width={10} height={22} fill={ok ? LC.blue : LC.core} opacity={ok ? 0.85 : 1} />
          {!ok && <rect x={276} y={y} width={5} height={22} fill={LC.core} opacity="0.5" />}
          <rect x={258} y={y} width={142} height={22} fill="none" stroke="#2b1a0d" strokeWidth="0.8" />
          <Verdict x={414} y={y + 11} ok={ok} r={7} />
          <T x={426} y={y + 15} s={10.5} c={ok ? C.emerald : C.ruby}>
            {t}
          </T>
        </g>
      ))}
      <T x={252} y={330} s={10} c={C.faint}>
        underside at the lug end: the skived flap tail
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* 11 · Nubuck and suede tops                                           */
/* ================================================================== */
function GNap() {
  const NUB = '#8e8c87'
  const head = (x, y, n, title) => (
    <g>
      {n ? <Num x={x + 16} y={y + 17} n={n} r={7} /> : null}
      <Tag x={x + (n ? 28 : 10)} y={y + 21}>
        {title}
      </Tag>
    </g>
  )
  return (
    <Fig h={340} view="Section & plan · a napped top" scale="sections ×12, schematic">
      <GrDefs />
      {/* 1 · mask then glue */}
      <Frame x={14} y={28} w={140} h={152} />
      {head(14, 28, 1, 'Mask, then glue')}
      <GSec x1={48} x2={146} y={100} t={13} kind="flat" fill={NUB} nap={2.2} seed={3} />
      <rect x={48} y={114.5} width={98} height={8} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
      <line x1={50} y1={114} x2={144} y2={114} stroke={C.glue} strokeWidth="2.2" strokeDasharray="1.2 2.6" strokeLinecap="round" />
      <rect x={44} y={90.5} width={106} height={5} rx="1" fill="rgba(120,170,215,0.85)" stroke="#5b88b0" strokeWidth="0.7" />
      <Brush x={46} y={113} ang={-36} k={0.38} />
      <Lb p={[120, 92]} t={[78, 66]} text="low-tack tape" a="start" s={10.5} />
      <Lb p={[60, 114]} t={[150, 134]} text="cement" a="end" s={10} c={C.emerald} />
      <Grain x={24} y={142} w={36} h={28} kind="nubuck" col={LC.nub} rx={2}>
        <path d="M32 152 q7 -6 14 0 q5 6 -2 9 q-9 4 -12 -2 Z" fill="rgba(240,226,170,0.55)" stroke="rgba(160,140,80,0.8)" strokeWidth="0.6" />
      </Grain>
      <Verdict x={72} y={150} ok={false} r={6.5} />
      <T x={84} y={154} s={10.5} c={C.text}>
        cement in nap
      </T>
      <T x={84} y={167} s={10} c={C.dim}>
        won’t wipe out
      </T>

      {/* 2 · brush the nap */}
      <Frame x={170} y={28} w={140} h={152} />
      {head(170, 28, 2, 'Brush the nap')}
      <Grain x={182} y={60} w={116} h={56} kind="nubuck" k={2.5} col={LC.nub} rx={2}>
        <rect x={182} y={60} width={52} height={56} fill="rgba(60,58,54,0.25)" />
        {Array.from({ length: 9 }, (_, j) => (
          <line key={j} x1={184} y1={64 + j * 6} x2={232} y2={65 + j * 6} stroke="rgba(30,28,26,0.35)" strokeWidth="0.8" />
        ))}
      </Grain>
      <NapBrush x={240} y={98} w={36} />
      <T x={208} y={130} a="middle" s={10} c={C.faint}>
        pressed flat
      </T>
      <T x={274} y={130} a="middle" s={10} c={C.faint}>
        brushed up
      </T>
      <Arrow a={[204, 140]} b={[284, 140]} w={1.6} />
      <T x={182} y={158} s={10.5} c={C.text}>
        after pressing, brush
      </T>
      <T x={182} y={171} s={10} c={C.dim}>
        the flattened nap up
      </T>

      {/* 3 · set through a scrap */}
      <Frame x={326} y={28} w={140} h={152} />
      {head(326, 28, 3, 'Set the seam')}
      <GSec x1={336} x2={456} y={118} t={12} kind="flat" fill={NUB} nap={2.2} seed={5} />
      <rect x={336} y={130} width={120} height={7} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
      {[346, 358, 370, 382, 394, 406, 418, 430, 442].map((x) => (
        <line key={x} x1={x} y1={116.5} x2={x + 8} y2={116.5} stroke={C.thread} strokeWidth="1.8" strokeLinecap="round" />
      ))}
      <rect x={366} y={104} width={66} height={9} rx="1.5" fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.7" />
      <Hammer x={399} y={103} k={0.55} />
      <Arrow a={[384, 62]} b={[384, 78]} w={1.4} />
      <T x={336} y={158} s={10.5} c={C.text}>
        hammer through a scrap
      </T>
      <T x={336} y={171} s={10} c={C.dim}>
        so the nap isn’t polished
      </T>

      {/* 4 · nubuck / suede */}
      <Frame x={14} y={188} w={140} h={148} />
      {head(14, 188, 0, 'Nubuck · suede')}
      <GSec x1={24} x2={80} y={240} t={14} kind="flat" fill={NUB} nap={2} seed={7} />
      <GSec x1={90} x2={146} y={240} t={14} kind="flat" fill={LC.orange} nap={6.5} seed={8} napC="rgba(245,214,180,0.7)" />
      <T x={52} y={272} a="middle" s={10.5} c={C.text}>
        nubuck
      </T>
      <T x={52} y={285} a="middle" s={10} c={C.faint}>
        grain sanded
      </T>
      <T x={52} y={297} a="middle" s={10} c={C.faint}>
        to a short nap
      </T>
      <T x={118} y={272} a="middle" s={10.5} c={C.text}>
        suede
      </T>
      <T x={118} y={285} a="middle" s={10} c={C.faint}>
        longer,
      </T>
      <T x={118} y={297} a="middle" s={10} c={C.faint}>
        velvety nap
      </T>
      <T x={24} y={316} s={10} c={C.ruby}>
        suede: no water resistance
      </T>
      <T x={24} y={329} s={10} c={C.ruby}>
        a dry-weather strap
      </T>

      {/* 5 · edge */}
      <Frame x={170} y={188} w={140} h={148} />
      {head(170, 188, 0, 'The edge')}
      <Grain x={182} y={220} w={116} h={44} kind="nubuck" k={1} col={LC.nub} rx={1}>
        <rect x={182} y={220} width={116} height={3.5} fill="#5f5d59" />
        <rect x={182} y={260.5} width={116} height={3.5} fill="#5f5d59" />
      </Grain>
      <Applicator x={268} y={264} ang={40} k={0.45} c="#5f5d59" />
      <Verdict x={190} y={280} ok r={7} />
      <T x={202} y={284} s={10.5} c={C.text}>
        stain or paint,
      </T>
      <T x={202} y={297} s={10} c={C.dim}>
        a shade darker
      </T>
      <XSec cx={196} y={312} w={24} layers={[{ k: 'top', t: 8 }]} edge="round" />
      <Verdict x={222} y={316} ok={false} r={7} />
      <T x={234} y={320} s={10.5} c={C.dim}>
        no burnish
      </T>

      {/* 6 · crease */}
      <Frame x={326} y={188} w={140} h={148} />
      {head(326, 188, 0, 'Heated crease')}
      <GSec
        x1={338}
        x2={456}
        y={246}
        t={13}
        pts={[[338, 246], [372, 246], [374, 248], [388, 248], [390, 246], [456, 246]]}
        fill={NUB}
        fib={false}
      />
      <GSec x1={338} x2={372} y={246} t={0.01} kind="flat" fill="none" stroke="none" nap={2} seed={9} fib={false} />
      <GSec x1={390} x2={456} y={246} t={0.01} kind="flat" fill="none" stroke="none" nap={2} seed={10} fib={false} />
      <line x1={374} y1={248.6} x2={388} y2={248.6} stroke="#4a4844" strokeWidth="1.6" />
      <Creaser x={381} y={247} ang={50} k={0.4} hot />
      <rect x={338} y={259} width={118} height={7} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
      <Grain x={338} y={276} w={118} h={26} kind="nubuck" col={LC.nub}>
        <rect x={338} y={293} width={118} height={3} fill="#5c5a56" />
        <line x1={338} y1={293.6} x2={456} y2={293.6} stroke="rgba(255,255,255,0.25)" strokeWidth="0.6" />
      </Grain>
      <T x={338} y={318} s={10.5} c={C.text}>
        nap pressed smooth
      </T>
      <T x={338} y={331} s={10} c={C.dim}>
        and darker: a design line
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* 12 · Alcantara and the other specials                                */
/* ================================================================== */
function GSpecial() {
  const cols = [
    { x0: 14, name: 'Alcantara', sub: 'synthetic microfibre', kind: 'alc', col: LC.aqua, k: 1 },
    { x0: 170, name: 'Peccary', sub: 'three-pore clusters', kind: 'peccary', col: LC.cognac, k: 2.2 },
    { x0: 326, name: 'Lacquered', sub: 'e.g. Himeji Kurozan', kind: 'urushi', col: LC.black, k: 1.6 },
  ]
  const item = (x, y, ok, a, b) => (
    <g>
      <Verdict x={x + 8} y={y - 4} ok={ok} r={6.5} />
      <T x={x + 22} y={y} s={10.5} c={C.text}>
        {a}
      </T>
      {b && (
        <T x={x + 22} y={y + 13} s={10} c={C.dim}>
          {b}
        </T>
      )}
    </g>
  )
  const R = rng(14)
  return (
    <Fig h={340} view="Section & plan · the specials" scale="swatches enlarged · sections ×12">
      <GrDefs />
      {cols.map((c) => (
        <g key={c.name}>
          <Frame x={c.x0} y={28} w={140} h={308} />
          <Tag x={c.x0 + 10} y={46}>
            {c.name}
          </Tag>
          <T x={c.x0 + 10} y={60} s={10} c={C.faint}>
            {c.sub}
          </T>
          <Grain x={c.x0 + 10} y={68} w={120} h={40} rx={3} kind={c.kind} col={c.col} k={c.k} seed={c.x0} />
        </g>
      ))}
      {/* Alcantara section */}
      <rect x={24} y={126} width={120} height={12} fill={LC.aqua} />
      {Array.from({ length: 30 }, (_, j) => {
        const x = 24 + R() * 112
        const y = 128 + R() * 8
        return <path key={j} d={`M${f1(x)} ${f1(y)} q${f1(3 + R() * 3)} ${f1((R() - 0.5) * 5)} ${f1(8)} ${f1((R() - 0.5) * 3)}`} fill="none" stroke="rgba(200,240,240,0.4)" strokeWidth="0.6" />
      })}
      <GSec x1={24} x2={144} y={126} t={0.01} kind="flat" fill="none" stroke="none" nap={1.6} napC="rgba(190,235,235,0.7)" fib={false} />
      <rect x={24} y={138} width={120} height={3} fill={C.velodon} stroke="#4e6f84" strokeWidth="0.5" />
      <rect x={24} y={141} width={120} height={8} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
      <line x1={145} y1={125} x2={145} y2={150} stroke="#1f4c52" strokeWidth="3.2" strokeLinecap="round" />
      <Brk x={24} y1={124} y2={149} />
      <Lb p={[60, 132]} t={[24, 170]} text="microfibre, not hide" a="start" s={10.5} />
      <Lb p={[110, 140]} t={[144, 186]} text="reinforced, lined" a="end" s={10.5} />

      {/* Peccary section */}
      <GSec x1={180} x2={300} y={128} t={12} kind="peccary" k={1} seed={4} coat={LC.cognac} />
      {[192, 222, 254, 284].map((x) =>
        [-2.4, 0, 2.4].map((dx) => <path key={x + dx} d={`M${x + dx - 0.9} 128.6 L${x + dx + 0.9} 128.6 L${x + dx + 0.3} 134 L${x + dx - 0.3} 134 Z`} fill={C.hole} />)
      )}
      <rect x={180} y={140} width={120} height={3} fill={C.velodon} stroke="#4e6f84" strokeWidth="0.5" />
      <rect x={180} y={143} width={120} height={7} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
      <Brk x={180} y1={124} y2={150} />
      <Brk x={300} y1={124} y2={150} />
      <Lb p={[222, 129]} t={[180, 170]} text="pore clusters" a="start" s={10.5} />
      <Lb p={[260, 141.5]} t={[300, 186]} text="full-length Velodon" a="end" s={10.5} />

      {/* Lacquer section */}
      <GSec x1={336} x2={456} y={132} t={14} kind="urushi" k={1} seed={6} coat="#141110" coatW={3.2} />
      {[[346, 131], [362, 132], [381, 130.5], [398, 132], [417, 131], [436, 130.6], [450, 132]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={0.9} fill="#fff1c8" />
      ))}
      <rect x={336} y={146} width={120} height={7} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
      <Brk x={336} y1={126} y2={153} />
      <Brk x={456} y1={126} y2={153} />
      <Lb p={[372, 131.5]} t={[336, 170]} text="urushi lacquer film" a="start" s={10.5} />
      <Lb p={[420, 140]} t={[456, 186]} text="hide beneath" a="end" s={10.5} />

      {/* handling */}
      {item(22, 214, true, 'cut with a fresh blade')}
      {item(22, 238, true, 'reinforce and line it', 'like leather')}
      {item(22, 274, true, 'paint the edge')}
      <Grain x={26} y={294} w={54} h={26} kind="alc" col={LC.aqua} />
      <Grain x={88} y={294} w={54} h={26} kind="alc" col={LC.aqua} noStroke />
      {Array.from({ length: 17 }, (_, j) => (
        <path key={j} d={`M${f1(89.5 + j * 3.1)} 294.5 q${(j % 3) - 1} -2 ${f1(((j * 7) % 5) - 2)} ${-3 - (j % 4)}`} fill="none" stroke="#9edadd" strokeWidth="0.9" />
      ))}
      <T x={53} y={331} a="middle" s={10} c={C.emerald}>
        fresh blade
      </T>
      <T x={115} y={331} a="middle" s={10} c={C.ruby}>
        dull: frays
      </T>

      {item(178, 214, true, 'reinforce full length', 'supple and stretchy')}
      {item(178, 250, true, 'prefer a fine stitch')}
      <Grain x={182} y={272} w={116} h={44} kind="peccary" k={1.6} col={LC.cognac} rx={2}>
        <line x1={182} y1={312} x2={298} y2={312} stroke={C.topEdge} strokeWidth="1.4" />
      </Grain>
      <StitchLine x1={188} x2={294} y={302} p={8} w={1.4} />
      <T x={240} y={331} a="middle" s={10} c={C.faint}>
        fine seam on a dense grain
      </T>

      {item(334, 214, false, 'flex hard over', 'a sharp edge')}
      {item(334, 250, false, 'skive from the face')}
      {item(334, 274, true, 'skive from the flesh')}
      <rect x={340} y={306} width={52} height={24} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
      <path d="M340 298 H392 Q400 298 400 306 V332 H392 V306 H340 Z" fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.7" />
      <path d="M340 298.6 H392 Q399.4 298.6 399.4 306 V332" fill="none" stroke="#141110" strokeWidth="2.4" />
      {[[350, 297], [366, 297.6], [380, 297]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={0.8} fill="#fff1c8" />
      ))}
      {[12, 34, 56, 78].map((a) => {
        const t = (a * Math.PI) / 180
        return <line key={a} x1={f1(392 + 6 * Math.sin(t))} y1={f1(306 - 6 * Math.cos(t))} x2={f1(392 + 12 * Math.sin(t))} y2={f1(306 - 12 * Math.cos(t))} stroke={C.ruby} strokeWidth="1.3" />
      })}
      <T x={410} y={318} s={10} c={C.ruby}>
        lacquer
      </T>
      <T x={410} y={330} s={10} c={C.ruby}>
        cracks
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* 13 · Linings beyond Zermatt                                          */
/* ================================================================== */
function GLinings() {
  const many = ['#3f5b4a', '#8a7b6b', '#7a2530', '#2f4f7f', '#c49a62', '#1c1a18', '#b8652f', '#d9cfb8']
  const many2 = ['#7a2530', '#5d5b58', '#2f727a', '#b06f36', '#3b4b6a', '#1c1a18', '#9c6b3d', '#c9b37a']
  // [name, sub, kind, colour, chips, water, stiff, use, bad]
  const rows = [
    ['Zermatt calf', 'matte, allergy-resistant', 'smooth', LC.zermatt, ['#cdb38a', '#1c1a18'], 4, 2, 'default'],
    ['Epsom', 'firmer, many colours', 'print', LC.green, many, 4, 4, 'colour'],
    ['Chèvre', 'pebbled, many colours', 'chevre', LC.ox, many2, 4, 2, 'colour'],
    ['FKM rubber', 'waterproof, stiffer', 'flat', '#232324', ['#1c1a18'], 5, 4, 'waterproof'],
    ['Alligator flank, matte', 'soft round scales', 'scales', '#4a3a2c', null, 0, 2, 'full exotic'],
    ['Alligator, glossy', 'too stiff for a lining', 'scales', '#3a2a1e', null, 0, 5, 'avoid', true],
  ]
  const y0 = 72
  const dy = 30
  const dots = (x, v, y, c) =>
    v ? (
      [0, 1, 2, 3, 4].map((j) => <circle key={j} cx={x + j * 9} cy={y} r={3} fill={j < v ? c : 'none'} stroke={j < v ? c : C.struct} strokeWidth="1" opacity={j < v ? 1 : 0.6} />)
    ) : (
      <T x={x + 18} y={y + 4} a="middle" s={10} c={C.faint}>
        not stated
      </T>
    )
  return (
    <Fig h={340} view="Chart · lining options" scale="swatches enlarged">
      <GrDefs />
      <Tag x={14} y={44}>
        Lining
      </Tag>
      <Tag x={200} y={44}>
        Colours
      </Tag>
      <Tag x={290} y={44}>
        Water
      </Tag>
      <Tag x={344} y={44}>
        Stiff
      </Tag>
      <Tag x={404} y={44}>
        Use
      </Tag>
      {rows.map(([name, sub, kind, col, chips, water, stiff, use, bad], i) => {
        const yc = y0 + i * dy
        return (
          <g key={name}>
            {i > 0 && <line x1={14} y1={yc - 15} x2={466} y2={yc - 15} stroke={C.line} strokeWidth="0.6" strokeDasharray="2 3" />}
            <Grain x={14} y={yc - 11} w={34} h={22} rx={2} kind={kind} col={col} seed={i * 5 + 2} k={kind === 'scales' ? 0.7 : 1}>
              {kind === 'flat' && <rect x={14} y={yc - 11} width={34} height={22} fill="url(#gr-sheen)" />}
              {bad && <rect x={14} y={yc - 11} width={34} height={22} fill="url(#gr-sheen)" />}
            </Grain>
            <T x={56} y={yc - 1} s={11.5} c={C.text} w="600">
              {name}
            </T>
            <T x={56} y={yc + 11} s={10} c={C.faint}>
              {sub}
            </T>
            {chips ? (
              <g>
                {chips.map((cc, j) => <rect key={j} x={200 + j * 10.5} y={yc - 7} width={8.5} height={14} rx="1.5" fill={cc} stroke="#e0d2b8" strokeWidth="0.5" />)}
                {chips.length < 3 && (
                  <T x={204 + chips.length * 10.5} y={yc + 4} s={10} c={C.faint}>
                    {chips.length === 1 ? 'black only' : 'only two'}
                  </T>
                )}
              </g>
            ) : (
              <T x={200} y={yc + 4} s={10} c={C.faint}>
                not stated
              </T>
            )}
            {dots(292, water, yc, C.steel)}
            {dots(346, stiff, yc, C.brass)}
            <T x={404} y={yc + 4} s={10.5} c={bad ? C.ruby : C.text}>
              {use}
            </T>
          </g>
        )
      })}
      <Sep x1={14} y1={246} x2={466} y2={246} />
      <Tag x={16} y={264}>
        A grained lining can be a show face
      </Tag>
      <Grain x={30} y={274} w={200} h={24} kind="smooth" col={LC.tan} rx={2} />
      <StitchLine x1={36} x2={226} y={279} p={8} w={1.3} />
      <StitchLine x1={36} x2={226} y={293} p={8} w={1.3} />
      <Grain x={30} y={306} w={200} h={24} kind="print" k={1} col={LC.green} rx={2} />
      <StitchLine x1={36} x2={226} y={311} p={8} w={1.3} />
      <StitchLine x1={36} x2={226} y={325} p={8} w={1.3} />
      <T x={240} y={290} s={10.5} c={C.text}>
        face: smooth calf
      </T>
      <T x={240} y={322} s={10.5} c={C.text}>
        lining: green Epsom
      </T>
      <GSec x1={370} x2={456} y={282} t={13} kind="flat" coat={LC.tan} fib={false} />
      <GSec x1={370} x2={456} y={295} t={9} fill={LC.green} pts={[[370, 295], [456, 295]]} fib={false} />
      <path d={P(profile('print', 370, 456, 304, 1.2).map(([x, y]) => [x, 608 - y]))} fill="none" stroke="#2a3d31" strokeWidth="1.2" />
      <Brk x={370} y1={280} y2={305} />
      <Brk x={456} y1={280} y2={305} />
      <T x={413} y={322} a="middle" s={10} c={C.faint}>
        print faces out
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* 14 · Care by surface                                                 */
/* ================================================================== */
function GCare() {
  const rows = [
    ['Printed calf', 'Epsom-type', 'print', LC.taupe, 1],
    ['Pebbled calf, goat', 'milled, shrunken, goat', 'milled', LC.noisette, 0.9],
    ['Nubuck', 'short nap', 'nubuck', LC.nub, 1],
    ['Suede', 'long nap', 'suede', LC.orange, 1],
  ]
  const cell = (x, y, ok, a, b) => (
    <g>
      <Verdict x={x + 6} y={y - 4} ok={ok} r={6} />
      <T x={x + 17} y={y} s={10} c={C.text}>
        {a}
      </T>
      {b && (
        <T x={x + 17} y={y + 12} s={10} c={C.faint}>
          {b}
        </T>
      )}
    </g>
  )
  const y0 = 74
  const dy = 32
  return (
    <Fig h={340} view="Matrix · care by surface" scale="schematic">
      <GrDefs />
      <Tag x={14} y={46}>
        Surface
      </Tag>
      <Tag x={172} y={46}>
        Water
      </Tag>
      <Tag x={262} y={46}>
        Perfume
      </Tag>
      <Tag x={352} y={46}>
        Conditioning
      </Tag>
      {rows.map(([name, sub, kind, col, k], i) => {
        const yc = y0 + i * dy
        const nap = i >= 2
        return (
          <g key={name}>
            {i > 0 && <line x1={14} y1={yc - 17} x2={466} y2={yc - 17} stroke={C.line} strokeWidth="0.6" strokeDasharray="2 3" />}
            <Grain x={14} y={yc - 12} w={30} h={24} rx={2} kind={kind} col={col} k={k} seed={i * 3 + 1} />
            <T x={52} y={yc - 1} s={11.5} c={C.text} w="600">
              {name}
            </T>
            <T x={52} y={yc + 11} s={10} c={C.faint}>
              {sub}
            </T>
            {i === 3 ? cell(172, yc, false, 'dry days only', 'no resistance') : cell(172, yc, false, 'no swimming', i < 2 ? 'holes leak' : null)}
            {cell(262, yc, false, 'off the edge', 'softens paint')}
            {nap ? cell(352, yc, false, 'nap products only', 'never a cream') : cell(352, yc, true, 'sparingly, when dry', 'every 6–12 months')}
          </g>
        )
      })}

      <Sep x1={14} y1={204} x2={466} y2={204} />
      {/* water at the holes */}
      <Tag x={16} y={222}>
        Water enters at the stitches
      </Tag>
      <GSec x1={30} x2={226} y={258} t={14} kind="milled" k={1.2} seed={5} coat={LC.noisette} />
      <rect x={30} y={272} width={196} height={8} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
      {[54, 92, 130, 168, 206].map((x, j) => (
        <g key={x}>
          <ellipse cx={x} cy={268} rx={9} ry={7} fill="rgba(120,175,205,0.32)" />
          <rect x={x - 1.6} y={255} width={3.2} height={26} fill={C.hole} />
          <line x1={x} y1={254} x2={x} y2={282} stroke={C.thread} strokeWidth="1.4" />
          <line x1={x} y1={254} x2={x + 38} y2={254} stroke={C.thread} strokeWidth="1.8" opacity={j < 4 ? 0.8 : 0} />
          <Drop x={x - 6} y={232} s={0.9} />
          <Arrow a={[x - 6, 243]} b={[x - 2, 252]} c="steel" w={1.2} />
        </g>
      ))}
      <Brk x={30} y1={252} y2={280} />
      <Brk x={226} y1={252} y2={280} />
      <T x={24} y={302} s={10.5} c={C.text}>
        even water-resistant leathers wick
      </T>
      <T x={24} y={315} s={10.5} c={C.text}>
        water in at the stitch holes:
      </T>
      <T x={24} y={329} s={10.5} c={C.ruby}>
        don’t swim in any of them
      </T>

      {/* perfume */}
      <Sep x1={240} y1={212} x2={240} y2={336} />
      <Tag x={252} y={222}>
        Perfume softens edge paint
      </Tag>
      <rect x={258} y={244} width={24} height={32} rx="5" fill="rgba(200,220,235,0.25)" stroke="#9fb4c2" strokeWidth="1" />
      <rect x={258} y={256} width={24} height={20} rx="4" fill="rgba(214,170,200,0.35)" />
      <rect x={265} y={236} width={10} height={8} rx="1.5" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.6" />
      <rect x={275} y={238} width={6} height={3} fill="url(#sk-steel)" />
      {[[292, 238], [300, 236], [306, 241], [314, 237], [320, 243], [328, 239], [298, 244], [312, 246]].map(([x, y], j) => (
        <circle key={j} cx={x} cy={y} r={1.2} fill="rgba(214,170,200,0.8)" />
      ))}
      <XSec cx={384} y={238} w={84} layers={[{ k: 'top', t: 12 }, { k: 'lining', t: 8 }]} edge="paint" b={3} coat={3.4} />
      {[0, 1].map((j) => (
        <path key={j} d={`M${342.5 - j * 0} ${248 + j * 8} q-3 4 -1 8`} fill="none" stroke={C.ruby} strokeWidth="1.6" strokeLinecap="round" />
      ))}
      <Lb p={[341, 252]} t={[300, 282]} text="the paint softens, runs" a="start" s={10.5} c={C.ruby} />
      <Num x={260} y={316} n={1} r={7} />
      <T x={271} y={320} s={10.5} c={C.text}>
        dry fully
      </T>
      <Arrow a={[322, 316]} b={[340, 316]} w={1.4} />
      <Num x={352} y={316} n={2} r={7} />
      <T x={363} y={320} s={10.5} c={C.text}>
        then condition
      </T>
      <T x={252} y={334} s={10} c={C.faint}>
        never condition a damp strap
      </T>
    </Fig>
  )
}

export const FIGS = {
  'g-grains': GGrains,
  'g-named': GNamed,
  'g-finish': GFinish,
  'g-test': GTest,
  'g-layout': GLayout,
  'g-reinforce': GReinforce,
  'g-skive': GSkive,
  'g-mark': GMark,
  'g-pitch': GPitch,
  'g-edge': GEdge,
  'g-nap': GNap,
  'g-special': GSpecial,
  'g-linings': GLinings,
  'g-care': GCare,
}
