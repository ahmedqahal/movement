// Strap diagrams — stitch: marking the line (T7), pricking (T8), the saddle
// stitch (T9), adjustment holes & slot (T11) and keepers (T12). See AUTHORING.md.
//
// Saddle-stitch drawings colour the two halves of the one thread so the eye
// can follow them: needle A's half ivory, needle B's half brass.
import { useId } from 'react'
import { C, FONT, Fig, T, Note, Dim, Arrow, Num, Verdict, Tag, Sep } from './kit.jsx'
import { StrapPlan, Ply, XSec, GlueLine, SpringBar, Buckle } from './parts.jsx'
import { StrapSection } from './sections.jsx'
import { LONG, SHORT, outline, offset, runBetween, px, pathOf, widthAt, holeXs } from './geom.js'
import { Knife, Iron, Mallet, Hammer, Awl, Needle, Punch, Calipers, Creaser, Burner, Slab, BoneFolder, Slicker, Rule, Beveller, Rivet } from './tools.jsx'

const TA = C.thread // needle A's half
const TB = '#d9a74a' // needle B's half (brass)
const CASE = '#1a120b'

/* ------------------------------------------------------------------ */
/* Local helpers                                                        */
/* ------------------------------------------------------------------ */

// Leader with explicit geometry: pts = [feature, …, end of line]. The text
// goes beside the end: a='start' to its right, 'end' to its left, 'middle'
// above or below (away from the line).
function Ld({ pts, text, sub, a = 'start', x, y, c = C.text, s = 11.5, subc = C.faint, dot = true }) {
  const p = pts[0]
  const e = pts[pts.length - 1]
  const prev = pts[pts.length - 2] || p
  let tx = x
  let ty = y
  if (tx === undefined) tx = a === 'start' ? e[0] + 4 : a === 'end' ? e[0] - 4 : e[0]
  if (ty === undefined) {
    if (a === 'middle') ty = prev[1] < e[1] ? e[1] + s + 1 : e[1] - 4 - (sub ? s + 1.5 : 0)
    else ty = e[1] + 4
  }
  return (
    <g>
      <polyline points={pts.map((q) => q.join(',')).join(' ')} fill="none" stroke={C.struct} strokeWidth="0.8" opacity="0.85" />
      {dot && <circle cx={p[0]} cy={p[1]} r="2.2" fill={c} />}
      <text x={tx} y={ty} textAnchor={a} fontSize={s} fill={c} fontFamily={FONT}>
        {text}
      </text>
      {sub && (
        <text x={tx} y={ty + s + 1.5} textAnchor={a} fontSize={s - 1.5} fill={subc} fontFamily={FONT}>
          {sub}
        </text>
      )}
    </g>
  )
}

// Magnifier: re-draws `children` (given in figure coordinates) k× about src,
// inside a circle of radius r centred at `at`, joined to the source spot.
function Inset({ src, k, at, r, children, label, la = 'middle', lc = C.dim }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const rs = r / k
  const dx = at[0] - src[0]
  const dy = at[1] - src[1]
  const L = Math.hypot(dx, dy) || 1
  const ux = dx / L
  const uy = dy / L
  return (
    <g>
      <circle cx={src[0]} cy={src[1]} r={rs} fill="none" stroke={C.brass} strokeWidth="0.9" />
      <line x1={src[0] + ux * rs} y1={src[1] + uy * rs} x2={at[0] - ux * r} y2={at[1] - uy * r} stroke={C.brass} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.8" />
      <clipPath id={`ins${id}`}>
        <circle cx={at[0]} cy={at[1]} r={r} />
      </clipPath>
      <circle cx={at[0]} cy={at[1]} r={r} fill={C.ground} />
      <g clipPath={`url(#ins${id})`}>
        <g transform={`translate(${at[0]} ${at[1]}) scale(${k}) translate(${-src[0]} ${-src[1]})`}>{children}</g>
      </g>
      <circle cx={at[0]} cy={at[1]} r={r} fill="none" stroke={C.brass} strokeWidth="1.3" />
      <text x={at[0] + r * 0.72} y={at[1] - r * 0.72} fontSize="10" fill={C.brass} fontFamily="var(--font-mono)" textAnchor="start">
        ×{k}
      </text>
      {label && (
        <text x={la === 'middle' ? at[0] : at[0] + (la === 'start' ? r + 6 : -r - 6)} y={la === 'middle' ? at[1] + r + 14 : at[1] + 4} fontSize="10.5" fill={lc} fontFamily={FONT} textAnchor={la}>
          {label}
        </text>
      )}
    </g>
  )
}

// A thread: dark casing under a coloured core so it reads on leather.
function Thr({ d, c = TA, w = 2.4, cap = 'round', op }) {
  return (
    <g opacity={op}>
      <path d={d} fill="none" stroke={CASE} strokeWidth={w + 1.8} strokeLinecap={cap} strokeLinejoin="round" />
      <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap={cap} strokeLinejoin="round" />
    </g>
  )
}
const poly = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')

// Wing dividers seen side-on: hinge h, points p1 / p2. `round1` draws the
// first point filed short and round (the leg that rides the edge).
function Divs({ h, p1, p2, round1, op, ghost }) {
  const at = (p, f) => [h[0] + (p[0] - h[0]) * f, h[1] + (p[1] - h[1]) * f]
  const w1 = at(p1, 0.62)
  const w2 = at(p2, 0.62)
  const mid = [(w1[0] + w2[0]) / 2, (w1[1] + w2[1]) / 2 - 10]
  const legs = [p1, p2].map((p, i) => (
    <g key={i}>
      {!ghost && <path d={`M${h[0]} ${h[1]} L${p[0]} ${p[1]}`} stroke="#9fb0bc" strokeWidth="4.4" strokeLinecap="round" />}
      <path d={`M${h[0]} ${h[1]} L${p[0]} ${p[1]}`} stroke={ghost ? C.steel : '#3b4850'} strokeWidth={ghost ? 1 : 0.7} strokeDasharray={ghost ? '4 3' : undefined} />
    </g>
  ))
  return (
    <g opacity={op}>
      {legs}
      <path d={`M${w1[0]} ${w1[1]} Q${mid[0]} ${mid[1]} ${w2[0]} ${w2[1]}`} fill="none" stroke={ghost ? C.steel : '#9fb0bc'} strokeWidth={ghost ? 1 : 2} strokeDasharray={ghost ? '4 3' : undefined} />
      {!ghost && <circle cx={w2[0]} cy={w2[1]} r="3" fill="url(#sk-brassG)" />}
      <circle cx={h[0]} cy={h[1]} r="6" fill={ghost ? 'none' : 'url(#sk-steel)'} stroke={ghost ? C.steel : '#3b4850'} strokeWidth="0.8" strokeDasharray={ghost ? '3 2' : undefined} />
      {round1 && !ghost && <circle cx={p1[0]} cy={p1[1]} r="2.6" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.6" />}
    </g>
  )
}

// Vertical zig-zag break line.
const BreakV = ({ x, y1, y2 }) => {
  const h = y2 - y1
  return <path d={`M${x - 3} ${y1 - 4} l6 ${(h + 8) * 0.3} l-6 ${(h + 8) * 0.4} l6 ${(h + 8) * 0.3}`} fill="none" stroke={C.dim} strokeWidth="1" />
}

// Two-layer laminate (top + lining) in section, from x1 to x2.
function Lam({ x1, x2, y, t = 14, l = 9, breakL, breakR }) {
  return (
    <g>
      <Ply x1={x1} x2={x2} y={y} t={t} />
      <Ply x1={x1} x2={x2} y={y + t} t={l} k="lining" cut="top" />
      {breakL && <BreakV x={x1} y1={y} y2={y + t + l} />}
      {breakR && <BreakV x={x2} y1={y} y2={y + t + l} />}
    </g>
  )
}

// Plan-view slit left by a French iron (slanted), centred at (x, y).
function Slit({ x, y, len = 7, ang = -50, c = C.hole, w = 1.8, op }) {
  const a = (ang * Math.PI) / 180
  const dx = (Math.cos(a) * len) / 2
  const dy = (Math.sin(a) * len) / 2
  return <line x1={x - dx} y1={y - dy} x2={x + dx} y2={y + dy} stroke={c} strokeWidth={w} strokeLinecap="round" opacity={op} />
}

// Face (plan) stitches along a straight line: slanted dashes between holes.
function FaceStitches({ x0, y, p, n, cols = [TA, TB], slant = 2.4, w = 2.2, alt, kn }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const xa = x0 + i * p + p * 0.16
        const xb = x0 + (i + 1) * p - p * 0.16
        const s = alt && i % 2 ? -slant : slant
        const d = `M${xa} ${y + s} L${xb} ${y - s}`
        return (
          <g key={i}>
            <Thr d={d} c={cols[i % cols.length]} w={w} />
            {kn && i < n - 1 && <circle cx={xb + p * 0.16} cy={y} r="2.6" fill={C.ruby} stroke={CASE} strokeWidth="0.8" />}
          </g>
        )
      })}
    </g>
  )
}

// Points every `step` along a closed polygon (px), walking both ways from
// the vertex with the largest x (the apex of a tip).
function fromApex(pg, step, count, first = step) {
  const n = pg.length
  let ia = 0
  pg.forEach((p, i) => {
    if (p[0] > pg[ia][0]) ia = i
  })
  const walk = (dir) => {
    const out = [pg[ia]]
    let i = ia
    let rest = 0
    let cur = pg[ia]
    let guard = 0
    while (out.length <= count && guard++ < 5000) {
      const want = out.length === 1 ? first : step
      const j = (i + dir + n) % n
      const nx = pg[j]
      const seg = Math.hypot(nx[0] - cur[0], nx[1] - cur[1])
      if (rest + seg >= want) {
        const f = (want - rest) / seg
        cur = [cur[0] + (nx[0] - cur[0]) * f, cur[1] + (nx[1] - cur[1]) * f]
        out.push(cur)
        rest = 0
      } else {
        rest += seg
        cur = nx
        i = j
      }
    }
    return out
  }
  return { apex: pg[ia], up: walk(-1).slice(1), down: walk(1).slice(1) }
}

// Stitch holes round a tip, laid out from the apex along the stitch line.
// Each hole carries the line's direction (polygon order) for slit angles.
function tipHoles(TP, o, count, { m = 3, pitch = 3, first } = {}) {
  const pg = offset(outline(o), m).map(([x, y]) => px(TP, x, y))
  const step = pitch * TP.s
  const { apex, up, down } = fromApex(pg, step, count, first ?? step)
  const ang = (a, b) => (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI
  const tag = (arr, flip) => arr.map((p, i) => ({ p, a: ang(i ? arr[i - 1] : apex, p) + (flip ? 180 : 0) }))
  return { pg, apex, up: tag(up, true), down: tag(down, false) }
}

/* ------------------------------------------------------------------ */
/* Saddle-stitch section helper                                         */
/* ------------------------------------------------------------------ */
// An enlarged section cut along the seam, through the holes. Holes at
// x0 + i·p (i = 0..n-1); grain surface at y, laminate h thick (top tk·h).
// Thread A starts on the grain side, B on the lining side, centred in hole 0.
// `done` complete stitches. Each stitch k: the thread on the grain side goes
// down through hole k first; the other comes up through the same hole behind
// it (drawn behind at the crossing), so every crossing is made the same way.
function seamPaths({ x0, p, y, h, done, r = 2.4, d = 1.8 }) {
  const X = (i) => x0 + i * p
  const yt = y - r
  const yb = y + h + r
  const A = [[X(0), y + h / 2], [X(0), yt]]
  const B = [[X(0), y + h / 2], [X(0), yb]]
  const cross = []
  for (let k = 1; k <= done; k++) {
    const aTop = k % 2 === 1
    A.push([X(k) - d, aTop ? yt : yb], [X(k) + d, aTop ? yb : yt])
    B.push([X(k) - d, aTop ? yb : yt], [X(k) + d, aTop ? yt : yb])
    cross.push({ k, c: aTop ? TA : TB, pts: [[X(k) - d * 0.55, yt + (yb - yt) * 0.22], [X(k) + d * 0.55, yt + (yb - yt) * 0.78]] })
  }
  return { A, B, cross, yt, yb, X }
}

function SeamBand({ x0, p, n, y, h, tk = 0.6, ext = 0.75, holeW = 5, breakL = true, breakR = true, lk = 'lining', shade = [] }) {
  const xa = x0 - ext * p
  const xb = x0 + (n - 1) * p + ext * p
  const t = h * tk
  return (
    <g>
      <Ply x1={xa} x2={xb} y={y} t={t} />
      <Ply x1={xa} x2={xb} y={y + t} t={h - t} k={lk} cut="top" />
      {shade.map((s, i) => (
        <rect key={i} x={s.x1} y={y - 0.5} width={s.x2 - s.x1} height={h + 1} fill={s.c || 'rgba(208,168,79,0.18)'} />
      ))}
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={x0 + i * p - holeW / 2} y={y - 0.6} width={holeW} height={h + 1.2} fill={C.ground} stroke="#5c4128" strokeWidth="0.5" />
      ))}
      {breakL && <BreakV x={xa} y1={y} y2={y + h} />}
      {breakR && <BreakV x={xb} y1={y} y2={y + h} />}
    </g>
  )
}

function SeamThreads({ x0, p, y, h, done, r, d, w = 2.4 }) {
  const { A, B, cross } = seamPaths({ x0, p, y, h, done, r, d })
  return (
    <g>
      <Thr d={poly(B)} c={TB} w={w} />
      <Thr d={poly(A)} c={TA} w={w} />
      {cross.map((c) => (
        <Thr key={c.k} d={poly(c.pts)} c={c.c} w={w} cap="butt" />
      ))}
    </g>
  )
}

// Small legend for the two thread halves.
function ThreadKey({ x, y, la = 'needle A', lb = 'needle B' }) {
  return (
    <g>
      <Thr d={`M${x} ${y} l14 0`} c={TA} w={2.2} />
      <T x={x + 20} y={y + 4} s={10.5}>
        {la}
      </T>
      <Thr d={`M${x + 86} ${y} l14 0`} c={TB} w={2.2} />
      <T x={x + 106} y={y + 4} s={10.5}>
        {lb}
      </T>
    </g>
  )
}

/* ================================================================== */
/* T7 · Marking the stitch line                                         */
/* ================================================================== */

/* Re-check the width after gluing */
function Recheck() {
  const x1 = 70
  const x2 = 270
  const y = 140
  const tt = 11
  const tl = 7
  const sh = 3 // lining crept 0.3 mm
  const lam = (
    <g>
      <rect x={x1} y={y} width={x2 - x1} height={tt} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <rect x={x1 + sh} y={y + tt} width={x2 - x1} height={tl} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.8" />
      <GlueLine x1={x1 + sh + 2} x2={x2 - 2} y={y + tt} />
    </g>
  )
  const TP = { x: 46, y: 278, s: 2.6 }
  const o = LONG()
  const stations = [
    [4, '20.0', 'lug'],
    [54, '19.0', 'middle'],
    [100, '18.0', 'tip end'],
  ]
  return (
    <Fig h={350} view="Detail · section across, after gluing" scale="section ×10 · plan ×2.6">
      <T x={16} y={44} s={11} c={C.text} w="600">
        Target: the lug width, at most 0.2 mm under
      </T>
      <T x={16} y={58} s={10.5} c={C.dim}>
        here 20.0 at the lug, tapering to 18.0
      </T>
      <Calipers x1={x1} x2={x2 + sh} y={y + tt + tl / 2} reading="20.3" />
      {lam}
      <Ld pts={[[150, 111], [150, 104]]} text="digital calipers" sub="jaws square on both edges" a="middle" s={11} />
      <Ld pts={[[110, y + 5], [110, 182]]} text="top 1.1 mm" a="middle" s={11} />
      <Ld pts={[[200, y + tt + 4], [200, 182]]} text="lining 0.7 mm" a="middle" s={11} />
      <Inset src={[x2 + 1, y + tt]} k={4} at={[420, 196]} r={44}>
        {lam}
        <line x1={x2} y1={y - 6} x2={x2} y2={y + tt + tl + 6} stroke={C.ruby} strokeWidth="0.45" strokeDasharray="1.5 1" />
      </Inset>
      <T x={420} y={256} a="middle" s={11} c={C.ruby}>
        lining proud 0.3 mm
      </T>
      <T x={420} y={269} a="middle" s={10} c={C.faint}>
        trim to the red line
      </T>

      <Tag x={16} y={234}>Measure at three stations</Tag>
      <StrapPlan T={TP} o={o} />
      {stations.map(([mx, v, nm]) => {
        const h = widthAt(mx, o) / 2
        const [sx, sy1] = px(TP, mx, -h)
        const [, sy2] = px(TP, mx, h)
        return (
          <g key={mx}>
            <Dim a={[sx, sy1]} b={[sx, sy2]} text="" c={C.text} />
            <T x={sx + (mx < 10 ? 6 : 0)} y={sy2 + 15} a={mx < 10 ? 'start' : 'middle'} s={10.5} mono c={C.text}>
              {v}
            </T>
            <T x={sx + (mx < 10 ? 6 : 0)} y={sy2 + 28} a={mx < 10 ? 'start' : 'middle'} s={10} c={C.faint}>
              {nm}
            </T>
          </g>
        )
      })}
      {/* what an untrimmed step does to the line */}
      <Tag x={388} y={292}>Untrimmed</Tag>
      <path d="M388 306 L426 306 L426 302 L466 302 L466 340 L388 340 Z" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <path d="M388 314 L426 314 L426 310 L466 310" fill="none" stroke={C.ruby} strokeWidth="1.2" strokeDasharray="2 2" />
      <T x={427} y={332} a="middle" s={10} c={C.dim}>
        line copies it
      </T>
    </Fig>
  )
}

/* Set the dividers: the margin chart, and why it matters */
function SetDividers() {
  const k = 12 // px per mm on the rule
  const r0 = 34
  const ry = 176
  const rows = [
    ['CalgaryJim', 1.5],
    ['Hab-To', 2.0],
    ['Indian Leather Craft', [2, 2.5]],
    ['Instructables', 2.75],
    ['Decocuir', 3.0],
    ['Tandy', 3.2],
  ]
  const x0 = 330
  const m = 36 // px per mm on the chart
  const X = (v) => x0 + v * m
  const wallSec = (ex, mm, label, sub, good) => {
    const y = 282
    const s = 14
    const tt = 1.1 * s
    const tl = 0.7 * s
    const hx = ex + mm * s
    return (
      <g>
        <Lam x1={ex} x2={ex + 150} y={y} t={tt} l={tl} breakR />
        <rect x={ex} y={y} width={hx - ex - 2} height={tt + tl} fill={good ? 'rgba(123,165,131,0.28)' : 'rgba(194,88,99,0.28)'} />
        <Thr d={`M${hx} ${y - 3} L${hx} ${y + tt + tl + 3}`} c={TA} w={2.6} />
        <ellipse cx={hx} cy={y - 2.5} rx="5" ry="2.4" fill={TA} stroke={CASE} strokeWidth="0.8" />
        <ellipse cx={hx} cy={y + tt + tl + 2.5} rx="5" ry="2.4" fill={TA} stroke={CASE} strokeWidth="0.8" />
        <Dim a={[ex, y]} b={[hx, y]} off={-12} text={String(mm)} flip />
        <T x={ex + 60} y={y + 46} s={11} c={good ? C.emerald : C.ruby} w="600">
          {label}
        </T>
        <T x={ex + 60} y={y + 59} s={10} c={C.dim}>
          {sub}
        </T>
      </g>
    )
  }
  return (
    <Fig h={350} view="Tool · setting the margin" scale="rule ×12 · chart · sections ×14">
      {/* left: dividers set on a steel rule */}
      <Tag x={16} y={42}>Set on a steel rule</Tag>
      <rect x={r0 - 12} y={ry} width={150} height={15} rx="1.5" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={r0 + i * k} y1={ry} x2={r0 + i * k} y2={ry + (i % 5 === 0 ? 7 : 4)} stroke="#2f3b42" strokeWidth="0.8" />
      ))}
      {[0, 5, 10].map((v) => (
        <T key={v} x={r0 + v * k} y={ry + 28} a="middle" s={10} mono c={C.faint}>
          {v}
        </T>
      ))}
      <Divs h={[r0 + 1.5 * k, 64]} p1={[r0, ry]} p2={[r0 + 3 * k, ry]} />
      <Ld pts={[[r0 + 1.5 * k + 6, 64], [100, 64]]} text="hinge" s={10.5} />
      <Ld pts={[[64, 140], [100, 120]]} text="wing & lock screw" s={10.5} />
      <Dim a={[r0, ry - 14]} b={[r0 + 3 * k, ry - 14]} text="" c={C.brass} />
      <T x={r0 + 3 * k + 10} y={ry - 10} s={11.5} c={C.brass} w="600">
        2.75–3 mm
      </T>
      <T x={r0 - 12} y={ry + 44} s={10} c={C.faint}>
        points seated in the ticks
      </T>

      {/* right: margins in use */}
      <Tag x={196} y={42}>Margins in use · edge → line</Tag>
      <rect x={x0} y={66} width={142} height={110} fill="rgba(168,118,63,0.13)" />
      <line x1={x0} y1={62} x2={x0} y2={178} stroke={C.topEdge} strokeWidth="1.6" />
      <T x={x0} y={58} a="middle" s={10} c={C.faint}>
        edge
      </T>
      <rect x={X(2.75)} y={64} width={X(3) - X(2.75)} height={114} fill="rgba(208,168,79,0.3)" stroke={C.brass} strokeWidth="0.8" />
      <T x={X(2.875)} y={58} a="middle" s={10} c={C.brass}>
        this course
      </T>
      {rows.map(([name, v], i) => {
        const yy = 78 + i * 18
        const lo = Array.isArray(v) ? v[0] : v
        const hi = Array.isArray(v) ? v[1] : v
        const course = !Array.isArray(v) && v >= 2.75 && v <= 3
        return (
          <g key={name}>
            <T x={x0 - 8} y={yy + 4} a="end" s={10.5} c={course ? C.text : C.dim}>
              {name} · {Array.isArray(v) ? '2–2.5' : String(v)}
            </T>
            <line x1={x0} y1={yy} x2={X(lo)} y2={yy} stroke={C.struct} strokeWidth="0.8" strokeDasharray="2 2" />
            {lo !== hi && <line x1={X(lo)} y1={yy} x2={X(hi)} y2={yy} stroke={C.thread} strokeWidth="3" strokeLinecap="round" />}
            <circle cx={X(hi)} cy={yy} r="3.2" fill={C.thread} stroke={CASE} strokeWidth="0.8" />
            {lo !== hi && <circle cx={X(lo)} cy={yy} r="3.2" fill={C.thread} stroke={CASE} strokeWidth="0.8" />}
          </g>
        )
      })}
      {[0, 1, 2, 3].map((v) => (
        <g key={v}>
          <line x1={X(v)} y1={178} x2={X(v)} y2={183} stroke={C.dim} strokeWidth="0.8" />
          <T x={X(v)} y={196} a="middle" s={10} mono c={C.faint}>
            {v}
          </T>
        </g>
      ))}
      <T x={x0 - 8} y={196} a="end" s={10} c={C.faint}>
        mm from the edge
      </T>

      <Sep x1={14} y1={226} x2={466} y2={226} />
      <Tag x={16} y={246}>Why the margin matters · leather outside the thread</Tag>
      {wallSec(24, 1.5, 'Narrow · 1.5 mm', 'finer look, thin wall outside', false)}
      {wallSec(256, 3, 'This course · 3 mm', 'more leather to hold the thread', true)}
    </Fig>
  )
}

/* Score the line: one leg rides the edge, the other scores */
function Score() {
  const s = 16
  const ex = 72
  const y = 142
  const tt = 1.1 * s
  const tl = 0.7 * s
  const sx = ex + 3 * s
  const lam = (
    <g>
      <Lam x1={ex} x2={256} y={y} t={tt} l={tl} />
      <path d={`M${sx - 3} ${y} L${sx} ${y + 3} L${sx + 3} ${y}`} fill={C.hole} stroke="#4a3018" strokeWidth="0.4" />
    </g>
  )
  const divs = <Divs h={[106, 40]} p1={[ex - 2.4, y + 5]} p2={[sx, y + 1]} round1 />
  // plan inset
  const py0 = 76
  const pk = 8
  const tipX = 400
  return (
    <Fig h={330} view="Section across · scoring the line" scale="section ×16 · plan ×8">
      {lam}
      <BreakV x={256} y1={y} y2={y + tt + tl} />
      {divs}
      <Ld pts={[[ex - 4, y + 3], [44, 112]]} x={16} y={104} text="edge leg" s={11} />
      <Ld pts={[[sx + 1, y - 2], [150, 104]]} text="scoring leg" s={11} />
      <Ld pts={[[110, 56], [150, 56]]} text="hinge, locked" s={10.5} />
      <Ld pts={[[180, y + 5], [200, 120]]} text="top" s={10.5} c={C.dim} />
      <Ld pts={[[220, y + tt + 5], [236, 196]]} text="lining" a="middle" s={10.5} c={C.dim} />

      <Inset src={[ex - 1, y + 3]} k={4} at={[64, 258]} r={40}>
        {lam}
        {divs}
      </Inset>
      <T x={64} y={312} a="middle" s={10.5} c={C.text}>
        filed short & round:
      </T>
      <T x={64} y={325} a="middle" s={10} c={C.faint}>
        rides, doesn’t dig
      </T>
      <Inset src={[sx, y + 1]} k={4} at={[176, 258]} r={40}>
        {lam}
        {divs}
      </Inset>
      <T x={176} y={312} a="middle" s={10.5} c={C.text}>
        light pressure:
      </T>
      <T x={176} y={325} a="middle" s={10} c={C.faint}>
        a score, not a cut
      </T>

      <Sep x1={270} y1={30} x2={270} y2={322} />
      <Tag x={284} y={44}>Plan · from above</Tag>
      <rect x={284} y={py0} width={182} height={92} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <line x1={284} y1={py0} x2={466} y2={py0} stroke={C.topEdge} strokeWidth="1.4" />
      <line x1={284} y1={py0 + 3 * pk} x2={tipX} y2={py0 + 3 * pk} stroke="#3a2412" strokeWidth="1.2" />
      <line x1={tipX} y1={py0 + 3 * pk} x2={466} y2={py0 + 3 * pk} stroke={C.text} strokeWidth="0.8" strokeDasharray="1.5 3" opacity="0.55" />
      <line x1={tipX} y1={py0 - 6} x2={tipX} y2={py0 + 3 * pk} stroke="#cfdbe3" strokeWidth="3.2" strokeLinecap="round" />
      <circle cx={tipX} cy={py0 - 3} r="3" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.6" />
      <circle cx={tipX} cy={py0 + 3 * pk} r="2.2" fill="#cfdbe3" stroke="#3b4850" strokeWidth="0.6" />
      <Arrow a={[tipX + 12, py0 + 52]} b={[tipX + 52, py0 + 52]} />
      <T x={tipX + 32} y={py0 + 72} a="middle" s={10} c={C.brass}>
        one steady pass
      </T>
      <Dim a={[300, py0]} b={[300, py0 + 3 * pk]} off={0} text="" />
      <T x={306} y={py0 + 16} s={10} mono c={C.dim}>
        2.75–3
      </T>
      <Ld pts={[[350, py0 + 3 * pk], [350, 200]]} text="scored line" a="middle" s={11} />
      <Ld pts={[[440, py0 + 3 * pk], [440, 200]]} text="not yet" a="middle" s={11} c={C.dim} />
      <Ld pts={[[tipX - 2, py0 - 3], [370, 58]]} text="edge leg" a="end" s={10.5} />
      <Note
        x={284}
        y={236}
        lines={['Run the edge leg along the cut', 'edge, not the lining’s. Keep the', 'dividers upright: tilting them', 'moves the line.']}
        s={10.5}
        lh={14}
      />
    </Fig>
  )
}

/* Groove: the thread sits recessed — light passes on thin stock */
function Groove() {
  const s = 20
  const y = 124
  const tt = 1.1 * s
  const tl = 0.7 * s
  const tr = 5 // 0.5 mm thread
  const gd = 10
  const gw = 8
  const grooved = (x0, depth) =>
    `M${x0} ${y} L${x0 + 60 - gw} ${y} C${x0 + 60 - gw} ${y + depth} ${x0 + 60 + gw} ${y + depth} ${x0 + 60 + gw} ${y} L${x0 + 126} ${y} L${x0 + 126} ${y + tt} L${x0} ${y + tt} Z`
  const panel = (x0, kind) => (
    <g>
      {kind === 'scored' ? (
        <Ply x1={x0} x2={x0 + 126} y={y} t={tt} />
      ) : (
        <path d={grooved(x0, kind === 'cut' ? gd * 0.75 : gd)} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" strokeLinejoin="round" />
      )}
      <Ply x1={x0} x2={x0 + 126} y={y + tt} t={tl} k="lining" cut="top" />
      <BreakV x={x0 + 126} y1={y} y2={y + tt + tl} />
      {kind === 'scored' && <path d={`M${x0 + 57} ${y} L${x0 + 60} ${y + 3} L${x0 + 63} ${y}`} fill={C.hole} />}
      {kind !== 'cut' && (
        <g>
          <circle cx={x0 + 60} cy={kind === 'scored' ? y - tr : y + gd - tr} r={tr} fill={TA} stroke={CASE} strokeWidth="1" />
          <circle cx={x0 + 60} cy={y + tt + tl + tr} r={tr} fill={TA} stroke={CASE} strokeWidth="1" />
        </g>
      )}
    </g>
  )
  const mini = (cx, depth, n) => (
    <g key={n}>
      <path d={`M${cx - 42} 272 L${cx - 8} 272 C${cx - 8} ${272 + depth} ${cx + 8} ${272 + depth} ${cx + 8} 272 L${cx + 42} 272 L${cx + 42} 294 L${cx - 42} 294 Z`} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      {n > 1 && (
        <path d={`M${cx - 8} 272 C${cx - 8} ${272 + depth - 3.3} ${cx + 8} ${272 + depth - 3.3} ${cx + 8} 272`} fill="none" stroke={C.brass} strokeWidth="0.9" strokeDasharray="2 2" />
      )}
      <Num x={cx - 32} y={256} n={n} r={7} />
      <T x={cx + 42} y={310} a="end" s={10} mono c={C.dim}>
        {['⅓', '⅔', 'full'][n - 1]} depth
      </T>
    </g>
  )
  return (
    <Fig h={342} view="Section across · stitch groove" scale="true scale ×20">
      <Tag x={20} y={46}>Scored only</Tag>
      <Tag x={174} y={46}>Grooving</Tag>
      <Tag x={328} y={46}>Grooved, sewn</Tag>
      {panel(20, 'scored')}
      {panel(174, 'cut')}
      {panel(328, 'grooved')}
      {/* groover: guide on the edge, cutter in the channel */}
      <g>
        <rect x={168} y={y - 26} width={6} height={36} rx="1.5" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.7" />
        <rect x={168} y={y - 34} width={70} height={9} rx="2" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.7" />
        <rect x={230} y={y - 30} width={8} height={26} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" />
        <path d={`M${234 - 7} ${y - 6} L${234 - 7} ${y + 1} Q234 ${y + gd * 0.75 + 1} ${234 + 7} ${y + 1} L${234 + 7} ${y - 6} Z`} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.7" />
        <path d={`M${242} ${y - 2} q8 -10 18 -8 q6 2 2 8`} fill="none" stroke="#c99b62" strokeWidth="2.4" strokeLinecap="round" />
        <path d={`M196 ${y - 34} L192 ${y - 60} L212 ${y - 60} L208 ${y - 34} Z`} fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.7" />
      </g>
      <Ld pts={[[171, y + 8], [171, 196]]} x={176} y={200} text="guide rides the edge" s={10.5} />
      <Ld pts={[[212, y - 50], [240, 70]]} text="groover" s={10.5} />
      <Ld pts={[[260, y - 8], [282, 96]]} text="shaving" s={10.5} c={C.dim} />
      <Ld pts={[[234, y + 4], [234, 168]]} text="U cutter" a="middle" s={10.5} c={C.dim} />

      <Dim a={[20, y]} b={[80, y]} off={-22} text="3" flip />
      <Dim a={[328, y]} b={[388, y]} off={-22} text="3" flip />
      <Ld pts={[[80, y - tr * 2], [92, 92]]} text="thread proud" sub="wears first" s={10.5} />
      <Ld pts={[[392, y + gd - 2 * tr], [392, 96]]} text="thread sits flush" sub="protected from wear" a="middle" s={10.5} />
      <Ld pts={[[46, y + 6], [46, 194]]} text="top 1.1" a="middle" s={10.5} c={C.dim} />
      <Ld pts={[[110, y + tt + 7], [110, 194]]} text="lining 0.7" a="middle" s={10.5} c={C.dim} />

      <Sep x1={14} y1={216} x2={466} y2={216} />
      <Tag x={16} y={234}>Stock under ~1.6 mm: 2–3 light passes</Tag>
      {mini(70, 3.5, 1)}
      {mini(180, 6.8, 2)}
      {mini(290, 10, 3)}
      <BoneFolder x={404} y={272} ang={-12} k={0.4} />
      <path d={`M362 272 L398 272 Q404 276 410 272 L446 272 L446 294 L362 294 Z`} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <rect x={362} y={272} width={84} height={22} fill="rgba(40,30,20,0.25)" />
      <T x={404} y={310} a="middle" s={10} c={C.dim}>
        or dampen & press
      </T>
      <T x={16} y={332} s={10.5} c={C.ruby}>
        One deep cut stretches thin leather: the line wanders and the edge waves.
      </T>
    </Fig>
  )
}

/* Mark the stops behind each fold */
function Stops() {
  const TP = { x: 90, y: 100, s: 3.4 }
  const o = SHORT({ x0: -20, x1: 105 })
  const stop = (mx) => {
    const h = widthAt(mx, o) / 2 - 3
    return [-1, 1].map((sg) => {
      const [x, y] = px(TP, mx, sg * h)
      return <line key={sg} x1={x} y1={y - 5} x2={x} y2={y + 5} stroke={C.brass} strokeWidth="2.4" strokeLinecap="round" />
    })
  }
  const sx1 = 90
  const sx2 = 90 + 80 * 3.4
  const sy = 236
  return (
    <Fig h={330} view="Plan · short piece, folds still open" scale="×3.4 · section thickness ×3">
      <StrapPlan
        T={TP}
        o={o}
        zones={[
          { from: -20, to: -3, k: 'skiveL' },
          { from: 83, to: 105, k: 'skiveR' },
          { from: -3, to: 3, k: 'ruby' },
          { from: 77, to: 83, k: 'ruby' },
        ]}
        folds={[{ x: 0, label: 'lug fold' }, { x: 80, label: 'buckle fold' }]}
        stitch={{ mode: 'line', m: 3, from: 6, to: 74 }}
      />
      {stop(6)}
      {stop(74)}
      <Ld pts={[px(TP, 6, 7), [140, 158]]} text="stop" sub="a few mm behind the fold" a="start" s={11} />
      <Ld pts={[px(TP, 74, 6.1), [372, 150]]} text="stop" sub="short of the fold" a="start" s={11} />
      <Ld pts={[px(TP, 40, -7.1), [240, 46]]} text="marked stitch line, 2.75–3 mm in" a="middle" s={11} />
      <Ld pts={[px(TP, -12, -6), [46, 46]]} text="skived flap" a="middle" s={10} c={C.dim} />
      <T x={TP.x} y={184} a="middle" s={10.5} c={C.ruby}>
        fold zone
      </T>
      <T x={TP.x + 80 * TP.s} y={186} a="middle" s={10.5} c={C.ruby}>
        fold zone
      </T>

      <Sep x1={14} y1={196} x2={466} y2={196} />
      <Tag x={16} y={212}>After folding: no needle hole in a bend</Tag>
      <StrapSection x1={sx1} x2={sx2} y={sy} s={3.4} k={9} left={{ kind: 'bar' }} right={{ kind: 'buckle' }} stitch={{ from: 6, to: 6 }} />
      {[sx1 + 6 * 3.4, sx2 - 6 * 3.4].map((x, i) => (
        <line key={i} x1={x} y1={sy - 12} x2={x} y2={sy - 3} stroke={C.brass} strokeWidth="2.2" strokeLinecap="round" />
      ))}
      <Ld pts={[[sx1 + 6 * 3.4, sy - 12], [150, 222]]} text="first hole" s={10.5} />
      <Ld pts={[[sx2 - 6 * 3.4, sy - 12], [300, 222]]} text="last hole" a="end" s={10.5} />
      <Ld pts={[[sx1 - 8, sy + 26], [60, 300]]} text="lug fold stays" sub="supple, unpierced" a="middle" s={10.5} />
      <Ld pts={[[sx2 + 8, sy + 26], [372, 300]]} text="buckle fold" sub="unpierced" a="middle" s={10.5} />
      <Verdict x={452} y={208} ok />
    </Fig>
  )
}

/* Padded strap: line on the flat flange, paper under the iron */
function Padded() {
  const s = 12
  const x1 = 70
  const x2 = x1 + 20 * s
  const yb = 180 // underside
  const L = 0.7 * s
  const Tt = 1.1 * s
  const F = 1.6 * s
  const yl = yb - L // top of lining
  const yf = yl - Tt // flange surface
  const fa = x1 + 4 * s
  const fb = x2 - 4 * s
  const filler = `M${fa} ${yl} C${fa + 8} ${yl} ${fa + 12} ${yl - F} ${fa + 30} ${yl - F} L${fb - 30} ${yl - F} C${fb - 12} ${yl - F} ${fb - 8} ${yl} ${fb} ${yl} Z`
  const top =
    `M${x1} ${yf} L${fa - 4} ${yf} C${fa + 6} ${yf} ${fa + 10} ${yf - F} ${fa + 30} ${yf - F} L${fb - 30} ${yf - F} C${fb - 10} ${yf - F} ${fb - 6} ${yf} ${fb + 4} ${yf} L${x2} ${yf} ` +
    `L${x2} ${yl} L${fb} ${yl} C${fb - 8} ${yl} ${fb - 12} ${yl - F} ${fb - 30} ${yl - F} L${fa + 30} ${yl - F} C${fa + 12} ${yl - F} ${fa + 8} ${yl} ${fa} ${yl} L${x1} ${yl} Z`
  const sl = x1 + 3 * s
  const sr = x2 - 3 * s
  const paper = `M${fb - 50} ${yf - F - 2} L${fb - 30} ${yf - F - 2} C${fb - 10} ${yf - F - 2} ${fb - 6} ${yf - 2} ${fb + 4} ${yf - 2} L${x2 + 14} ${yf - 2}`
  const TP = { x: 70, y: 302, s: 2.4 }
  return (
    <Fig h={340} view="Section across · padded strap" scale="section ×12 · plan ×2.4">
      <rect x={x1} y={yl} width={x2 - x1} height={L} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.8" />
      <path d={filler} fill="url(#sk-fill)" stroke="#3a2716" strokeWidth="0.8" />
      <path d={top} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" strokeLinejoin="round" />
      {/* marked line, left */}
      <path d={`M${sl - 3} ${yf} L${sl} ${yf + 3} L${sl + 3} ${yf}`} fill={C.hole} />
      {/* iron end-on at the right line, with paper over the dome */}
      <path d={paper} fill="none" stroke="#f4efe4" strokeWidth="2" />
      <path d={`M${sr - 2.5} ${yf - 4} L${sr} ${yf + 6} L${sr + 2.5} ${yf - 4} Z`} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.6" />
      <rect x={sr - 16} y={yf - 34} width={32} height={30} rx="2" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
      <rect x={sr - 6} y={yf - 78} width={12} height={44} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.7" />
      <Arrow a={[sr + 32, yf - 78]} b={[sr + 32, yf - 50]} />

      <Ld pts={[[sl, yf - 3], [sl, 82]]} x={20} y={64} text="stitch line on the flat flange" sub="tight to the filler step" s={11} />
      <Ld pts={[[fb - 42, yf - F - 2], [232, 108]]} text="paper over the dome" a="end" s={11} />
      <Ld pts={[[sr + 16, yf - 22], [334, 112]]} text="iron, end-on" sub="its base would bruise the dome" s={11} />
      <Ld pts={[[88, yf + 5], [88, 222]]} text="top 1.1" a="middle" s={10.5} c={C.dim} />
      <Ld pts={[[200, yl - F / 2], [200, 222]]} text="filler 1.6, inset 4 mm" a="middle" s={10.5} c={C.dim} />
      <Ld pts={[[296, yl + 4], [296, 222]]} text="lining 0.7" a="middle" s={10.5} c={C.dim} />
      <Dim a={[x1, yf]} b={[sl, yf]} off={-14} text="3" flip />
      <Dim a={[x1, yb]} b={[fa, yb]} off={12} text="4" />
      <Dim a={[x2 + 18, yf - F]} b={[x2 + 18, yf]} text="" />
      <T x={x2 + 24} y={yf - F / 2 + 4} s={10} mono c={C.dim}>
        1.6
      </T>

      <Sep x1={14} y1={250} x2={466} y2={250} />
      <Tag x={16} y={268}>Plan · the line follows the filler outline</Tag>
      <StrapPlan T={TP} o={LONG()} filler={{ inset: 4, from: 8, to: 92 }} stitch={{ mode: 'line', m: 3, from: 4 }} />
      <Ld pts={[px(TP, 60, -3), [380, 284]]} text="filler edge" s={10.5} c={C.dim} />
      <Ld pts={[px(TP, 100, 6), [380, 322]]} text="stitch line" s={10.5} />
    </Fig>
  )
}

/* Optional heated crease, 1.5 mm in */
function Crease() {
  const s = 24
  const ex = 64
  const y = 150
  const tt = 1.1 * s
  const tl = 0.7 * s
  const cx = ex + 1.5 * s
  const sx = ex + 3 * s
  const pk = 10
  const py0 = 76
  return (
    <Fig h={320} view="Section across · edge crease" scale="section ×24 · plan ×10">
      <path
        d={`M${ex} ${y + 2.5} L${cx - 4} ${y + 2.5} L${cx} ${y + 7} L${cx + 4} ${y} L262 ${y} L262 ${y + tt} L${ex} ${y + tt} Z`}
        fill="url(#sk-topS)"
        stroke="#4a3018"
        strokeWidth="0.8"
      />
      <path d={`M${ex} ${y + 2.5} L${cx - 4} ${y + 2.5} L${cx} ${y + 7} L${cx} ${y + 11} L${ex} ${y + 8} Z`} fill="rgba(60,35,15,0.45)" />
      <Ply x1={ex} x2={262} y={y + tt} t={tl} k="lining" cut="top" />
      <BreakV x={262} y1={y} y2={y + tt + tl} />
      <line x1={sx} y1={y - 14} x2={sx} y2={y - 2} stroke={C.text} strokeWidth="1.1" strokeDasharray="2 2" />
      <Creaser hot x={cx} y={y + 6} />
      <Ld pts={[[cx + 5, y - 46], [150, 76]]} text="heated creaser" sub="run along the edge" s={11} />
      <Ld pts={[[sx, y - 14], [150, 116]]} text="stitch line (to come)" s={11} />
      <Ld pts={[[ex + 6, y + 6], [46, 140]]} x={16} y={118} text="border" s={11} />
      <T x={16} y={131} s={11} c={C.text}>
        compressed
      </T>
      <Dim a={[ex, y + tt + tl]} b={[cx, y + tt + tl]} off={16} text="1.5" />
      <Dim a={[ex, y + tt + tl]} b={[sx, y + tt + tl]} off={36} text="3" />
      <Ld pts={[[190, y + 8], [190, 214]]} text="top 1.1" a="middle" s={10.5} c={C.dim} />
      <Ld pts={[[250, y + tt + 7], [250, 214]]} text="lining 0.7" a="middle" s={10.5} c={C.dim} />

      <Sep x1={286} y1={30} x2={286} y2={310} />
      <Tag x={300} y={44}>Plan</Tag>
      <rect x={300} y={py0} width={166} height={96} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <line x1={300} y1={py0} x2={466} y2={py0} stroke={C.topEdge} strokeWidth="1.4" />
      <rect x={300} y={py0 + 1} width={166} height={1.5 * pk - 1} fill="rgba(60,35,15,0.32)" />
      <line x1={300} y1={py0 + 1.5 * pk} x2={466} y2={py0 + 1.5 * pk} stroke="#3a2412" strokeWidth="1.8" />
      <line x1={300} y1={py0 + 3 * pk} x2={466} y2={py0 + 3 * pk} stroke={C.text} strokeWidth="0.9" strokeDasharray="1.5 2.5" />
      <Ld pts={[[330, py0], [330, 60]]} text="edge" a="middle" s={10.5} c={C.dim} />
      <Ld pts={[[440, py0 + 1.5 * pk], [440, 200]]} text="crease" sub="1.5 mm in" a="middle" s={11} />
      <Ld pts={[[360, py0 + 3 * pk], [360, 200]]} text="stitch line" sub="3 mm in" a="middle" s={11} />
      <Note x={300} y={252} lines={['A decorative line that also', 'firms the border before', 'the iron goes in.']} s={10.5} lh={14} />
    </Fig>
  )
}

/* ================================================================== */
/* T8 · Pricking the holes                                              */
/* ================================================================== */

// Iron seen end-on (looking along its row of prongs): tip at (0,0).
function IronEnd({ x, y, len = 46, op }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={op}>
      <path d={`M-4 ${-len} L0 0 L4 ${-len} Z`} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" />
      <rect x="-18" y={-len - 28} width="36" height="28" rx="2" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
      <rect x="-6" y={-len - 70} width="12" height="42" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.7" />
      <rect x="-12" y={-len - 82} width="24" height="12" rx="2" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.7" />
    </g>
  )
}

// Through-hole (opened) and surface dent (marked) in a section.
const HoleThru = ({ x, y, h, w = 2.8 }) => <rect x={x - w / 2} y={y - 0.5} width={w} height={h + 1} fill={C.hole} />
const Dent = ({ x, y, d = 3 }) => <path d={`M${x - 2.2} ${y} L${x} ${y + d} L${x + 2.2} ${y}`} fill={C.hole} />

/* Support the work: on a pad, never on a hard or soft-topped surface */
function Support() {
  const y = 214
  const t = 9
  const l = 6
  const scene = (
    <g>
      <Slab x={20} y={y + t + l + 16} w={286} h={22} kind="wood" />
      <Slab x={40} y={y + t + l} w={250} h={16} kind="pad" />
      <Lam x1={52} x2={280} y={y} t={t} l={l} breakL breakR />
      <Iron n={6} pitch={12} x={104} y={y + t + l + 3} />
    </g>
  )
  return (
    <Fig h={330} view="Side view · pricking set-up" scale="schematic">
      {scene}
      <Mallet x={134} y={y + t + l + 3 - 72 - 18} k={0.9} />
      <Arrow a={[108, 100]} b={[108, 128]} />
      <Ld pts={[[134, 104], [134, 82]]} text="poly or rawhide mallet" sub="light, square blows" a="middle" s={11} />
      <Ld pts={[[106, 205], [70, 160]]} x={16} y={138} text="pricking iron" s={11} />
      <T x={16} y={151} s={10} c={C.faint}>
        upright on the marked line
      </T>
      <Ld pts={[[80, y + 4], [80, 284]]} text="strap, grain up" a="middle" s={11} />
      <Ld pts={[[200, y + t + l + 8], [200, 284]]} text="punch pad" sub="or poundo board" a="middle" s={11} />
      <Ld pts={[[262, y + t + l + 27], [262, 284]]} text="bench" a="middle" s={11} c={C.dim} />
      <Inset src={[160, y + t + l]} k={3} at={[404, 246]} r={48}>
        {scene}
      </Inset>
      <T x={414} y={312} a="middle" s={10.5} c={C.emerald}>
        tips finish in the pad
      </T>
      <Verdict x={344} y={308} ok r={8} />

      <Sep x1={318} y1={30} x2={318} y2={186} />
      <Tag x={330} y={44}>Never on</Tag>
      <Verdict x={456} y={40} ok={false} r={8} />
      <Slab x={334} y={132} w={132} h={16} kind="granite" />
      <Lam x1={340} x2={460} y={117} t={9} l={6} breakL breakR />
      <Iron n={3} pitch={12} x={372} y={132} />
      {[372, 384, 396].map((x) => (
        <g key={x} stroke={C.ruby} strokeWidth="1.2" strokeLinecap="round">
          <line x1={x - 5} y1={134} x2={x - 8} y2={139} />
          <line x1={x + 5} y1={134} x2={x + 8} y2={139} />
        </g>
      ))}
      <T x={330} y={164} s={10.5} c={C.ruby}>
        bench, stone or cutting mat:
      </T>
      <T x={330} y={177} s={10} c={C.dim}>
        tips blunt and holes tear out
      </T>
    </Fig>
  )
}

/* Lay out the tip first: a centre hole on the apex, then pairs outward */
function TipFirst() {
  const TP = { x: 30 - 80 * 7, y: 166, s: 7 }
  const o = LONG({ x0: 79 })
  const H = tipHoles(TP, o, 12)
  const ctr = [H.apex[0] - 70, TP.y]
  const out = (p, d) => {
    const v = [p[0] - ctr[0], p[1] - ctr[1]]
    const L = Math.hypot(v[0], v[1])
    return [p[0] + (v[0] / L) * d, p[1] + (v[1] / L) * d]
  }
  const slit = (h, i, op) => <Slit key={i} x={h.p[0]} y={h.p[1]} len={9} ang={h.a - 50} w={2.2} op={op} />
  const apexH = { p: H.apex, a: 90 }
  // the ✗ mini: laid out from the two straights, meeting at the point
  const TP2 = { x: 330 - 95 * 3.6, y: 294, s: 3.6 }
  const o2 = LONG({ x0: 94 })
  const bad = tipHoles(TP2, o2, 6, { first: 0.35 * 3 * 3.6 })
  const apexPx = px(TP, 120, 0)
  const arc = (arr) => {
    const a = out(arr[2].p, 26)
    const b = out(arr[4].p, 26)
    const c = out(arr[6].p, 26)
    return `M${a[0]} ${a[1]} Q${b[0]} ${b[1]} ${c[0]} ${c[1]}`
  }
  return (
    <Fig h={340} view="Plan · tip of the long piece" scale="×7 · mini ×3.6">
      <StrapPlan T={TP} o={o} centre stitch={{ mode: 'line', m: 3, from: 83 }} />
      <BreakV x={px(TP, 79, 0)[0]} y1={TP.y - 68} y2={TP.y + 68} />
      {H.up.map((h, i) => slit(h, 'u' + i, i < 2 ? 1 : 0.6))}
      {H.down.map((h, i) => slit(h, 'd' + i, i < 2 ? 1 : 0.6))}
      {slit(apexH, 'apex', 1)}
      <circle cx={H.apex[0]} cy={H.apex[1]} r="7.5" fill="none" stroke={C.emerald} strokeWidth="1.4" />
      <Num x={out(H.apex, 50)[0]} y={out(H.apex, 50)[1]} n={1} />
      {[0, 1].map((i) => (
        <g key={i}>
          <Num x={out(H.up[i].p, 42 + i * 4)[0]} y={out(H.up[i].p, 42 + i * 4)[1]} n={i + 2} />
          <Num x={out(H.down[i].p, 42 + i * 4)[0]} y={out(H.down[i].p, 42 + i * 4)[1]} n={i + 2} />
        </g>
      ))}
      <Arrow d={arc(H.up)} w={1.6} />
      <Arrow d={arc(H.down)} w={1.6} />
      <T x={358} y={162} s={11} c={C.text}>
        centre hole on the apex,
      </T>
      <T x={358} y={175} s={10} c={C.faint}>
        exactly on the centreline
      </T>
      <T x={300} y={74} s={11} c={C.text}>
        2, 3 … pairs stepped out
      </T>
      <T x={300} y={87} s={10} c={C.faint}>
        the same pitch on both sides
      </T>
      <Ld pts={[[60, TP.y], [60, 84]]} text="centreline" a="middle" s={10.5} c={C.steel} />
      <Dim a={H.down[6].p} b={H.down[5].p} off={36} text="3.0" flip />
      <Dim a={[H.apex[0], TP.y]} b={[apexPx[0], TP.y]} off={18} text="3" flip />
      <Verdict x={24} y={44} ok r={8} />
      <T x={40} y={48} s={11} c={C.emerald}>
        The tip first: everything else follows from it
      </T>

      <Sep x1={14} y1={260} x2={466} y2={260} />
      <StrapPlan T={TP2} o={o2} stitch={{ mode: 'line', m: 3, from: 98 }} />
      <BreakV x={px(TP2, 94, 0)[0]} y1={TP2.y - 33} y2={TP2.y + 33} />
      {[...bad.up, ...bad.down].map((h, i) => (
        <Slit key={i} x={h.p[0]} y={h.p[1]} len={5} ang={h.a - 50} w={1.6} />
      ))}
      <circle cx={bad.apex[0] - 1} cy={bad.apex[1]} r="8" fill="none" stroke={C.ruby} strokeWidth="1.4" />
      <Verdict x={24} y={282} ok={false} r={8} />
      <Note x={40} y={286} lines={['Laid out from the straights instead:', 'the two runs meet in an odd short gap', 'at the point — exactly where the eye looks.']} s={10.5} lh={14} />
    </Fig>
  )
}

// 2-prong iron footprint in plan along the chord a→b.
function Foot({ a, b, cur }) {
  const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  return (
    <g transform={`translate(${a[0]} ${a[1]}) rotate(${ang})`}>
      <rect x={-6} y={-7} width={L + 12} height={14} rx="3" fill={cur ? 'rgba(180,200,212,0.42)' : 'none'} stroke={cur ? '#cfdbe3' : C.steel} strokeWidth={cur ? 1.2 : 0.9} strokeDasharray={cur ? undefined : '3 2'} />
    </g>
  )
}

/* Curves with the 2-prong iron */
function Curves() {
  const TP = { x: 252 - 120 * 7.6, y: 178, s: 7.6 }
  const o = LONG({ x0: 88 })
  const H = tipHoles(TP, o, 7)
  const seq = [H.apex, ...H.up.map((h) => h.p)]
  const all = [{ p: H.apex, a: 90 }, ...H.up, ...H.down]
  const mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
  return (
    <Fig h={340} view="Plan · round the tip" scale="plan ×7.6 · side views schematic">
      <StrapPlan T={TP} o={o} stitch={{ mode: 'line', m: 3, from: 92 }} />
      <BreakV x={px(TP, 88, 0)[0]} y1={TP.y - 70} y2={TP.y + 70} />
      {all.map((h, i) => (
        <Slit key={i} x={h.p[0]} y={h.p[1]} len={9} ang={h.a - 50} w={2.2} />
      ))}
      {/* tight part at the apex: one prong at a time */}
      {[seq[0], seq[1]].map((p, i) => (
        <rect key={i} x={p[0] - 7} y={p[1] - 7} width="14" height="14" rx="3" fill="none" stroke={C.brass} strokeWidth="1.2" />
      ))}
      <Foot a={seq[1]} b={seq[2]} />
      <Foot a={seq[2]} b={seq[3]} />
      <Foot a={seq[3]} b={seq[4]} cur />
      <Ld pts={[[seq[0][0] + 8, seq[0][1] + 4], [270, 214]]} x={268} y={226} text="tightest:" s={11} c={C.brass} />
      <T x={268} y={239} s={10.5} c={C.brass}>
        one prong
      </T>
      <T x={268} y={252} s={10.5} c={C.brass}>
        at a time
      </T>
      <Ld pts={[[seq[3][0], seq[3][1] - 7], [seq[3][0], 92]]} text="prong 1 in the last hole" a="middle" s={11} />
      <Ld pts={[[seq[4][0] - 6, seq[4][1] - 4], [112, 100]]} x={16} y={92} text="2-prong iron" s={11} />
      <T x={16} y={105} s={10} c={C.faint}>
        follows the curve
      </T>
      <Ld pts={[mid(seq[1], seq[2]), [272, 124]]} text="earlier" s={10.5} c={C.steel} />
      <T x={276} y={141} s={10.5} c={C.steel}>
        strikes
      </T>
      <Note x={16} y={296} lines={['Each strike pivots on the last hole, so the', 'chords follow the curve and the pitch holds.']} s={10.5} lh={14} />

      <Sep x1={336} y1={30} x2={336} y2={330} />
      <Tag x={346} y={44}>Two prongs</Tag>
      <Lam x1={348} x2={466} y={150} t={7} l={5} breakL breakR />
      <HoleThru x={376} y={150} h={12} />
      <Iron n={2} pitch={20} k={1.2} x={376} y={164} />
      <Ld pts={[[376, 165], [376, 182]]} x={382} y={190} text="prong 1 in" s={10.5} />
      <T x={382} y={203} s={10} c={C.faint}>
        the last hole
      </T>
      <Lam x1={348} x2={466} y={296} t={7} l={5} breakL breakR />
      <HoleThru x={362} y={296} h={12} />
      <Iron n={2} pitch={20} k={1.2} x={370} y={293} ang={20} />
      <T x={407} y={324} a="middle" s={10.5} c={C.brass}>
        tight curve: cant it,
      </T>
      <T x={407} y={337} a="middle" s={10.5} c={C.brass}>
        one prong bites
      </T>
    </Fig>
  )
}

/* Walk the straights: the first prong drops into the last hole */
function Walk() {
  const p = 14 // 3 mm at ×4.67
  const y = 196
  const t = 6.2
  const l = 4.1
  const x0 = 40
  const X = (i) => x0 + i * p
  const scene = (
    <g>
      <Slab x={20} y={y + t + l} w={440} h={14} kind="pad" />
      <Lam x1={24} x2={456} y={y} t={t} l={l} breakL breakR />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <HoleThru key={i} x={X(i)} y={y} h={t + l} w={2.4} />
      ))}
      <Iron n={6} pitch={p} x={X(5)} y={y + t + l + 2} />
    </g>
  )
  const y0 = 252
  const ly = y0 + 14
  return (
    <Fig h={340} view="Side view & plan · walking the iron" scale="true scale ×4.7">
      {scene}
      <Mallet x={X(7.5)} y={y + t + l + 2 - 72 - 16} k={0.85} />
      <Arrow a={[X(5.4), 82]} b={[X(5.4), 104]} />
      <Ld pts={[[X(2.5), y + 2], [X(2.5), 160]]} text="strike 1, done" a="middle" s={11} />
      <Ld pts={[[X(10) + 6, y - 16], [260, 180]]} text="6-prong iron, strike 2" s={11} />
      <Ld pts={[[440, y + t + l + 8], [440, 236]]} x={436} y={240} text="punch pad" a="end" s={10.5} c={C.dim} />
      <Inset src={[X(5), y + 4]} k={3} at={[400, 74]} r={44}>
        {scene}
      </Inset>
      <T x={400} y={134} a="middle" s={10.5} c={C.text}>
        prong 1 drops into
      </T>
      <T x={400} y={147} a="middle" s={10.5} c={C.text}>
        the last hole
      </T>

      {/* plan strip */}
      <rect x={24} y={y0} width={250} height={36} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <line x1={24} y1={y0} x2={274} y2={y0} stroke={C.topEdge} strokeWidth="1.2" />
      <line x1={24} y1={ly} x2={274} y2={ly} stroke={C.text} strokeWidth="0.7" strokeDasharray="1.5 2.5" opacity="0.6" />
      {Array.from({ length: 16 }, (_, i) => (
        <Slit key={i} x={X(i)} y={ly} len={7} w={2} c={i <= 5 ? C.hole : i <= 10 ? C.brassHi : 'rgba(239,232,220,0.35)'} />
      ))}
      {[5, 10].map((i) => (
        <circle key={i} cx={X(i)} cy={ly} r="6.5" fill="none" stroke={C.emerald} strokeWidth="1.3" />
      ))}
      <Dim a={[X(5), y0]} b={[X(6), y0]} off={-10} text="3.0" flip tOff={3} />
      {[
        [0, 5, 1, 298],
        [5, 10, 2, 306],
        [10, 15, 3, 298],
      ].map(([a, b, n, by]) => (
        <g key={n}>
          <path d={`M${X(a)} ${by - 4} V${by} H${X(b)} V${by - 4}`} fill="none" stroke={C.dim} strokeWidth="0.8" />
          <Num x={(X(a) + X(b)) / 2} y={by + 14} n={n} r={7} />
        </g>
      ))}
      <g>
        {[262, 282, 302].map((yy) => (
          <rect key={yy} x={292} y={yy - 8} width={16} height={16} rx="2" fill="url(#sk-top)" />
        ))}
        <Slit x={300} y={262} len={7} w={2} />
        <T x={310} y={266} s={10.5}>strike 1</T>
        <Slit x={300} y={282} len={7} w={2} c={C.brassHi} />
        <T x={310} y={286} s={10.5}>strike 2</T>
        <Slit x={300} y={302} len={7} w={2} c="rgba(239,232,220,0.35)" />
        <T x={310} y={306} s={10.5}>strike 3, next</T>
        <circle cx={390} cy={262} r="6" fill="none" stroke={C.emerald} strokeWidth="1.3" />
        <T x={400} y={266} s={10.5}>shared hole</T>
      </g>
    </Fig>
  )
}

/* Keep the iron vertical: a lean walks the exit holes off the line */
function Vertical() {
  const s = 16
  const y = 168
  const tt = 1.1 * s
  const tl = 0.7 * s
  const H = tt + tl
  const len = H + 12
  const panel = (ex, lean) => {
    const sx = ex + 3 * s
    const exitX = sx - H * Math.tan((lean * Math.PI) / 180)
    return (
      <g>
        <Lam x1={ex} x2={ex + 126} y={y} t={tt} l={tl} breakR />
        <line x1={sx} y1={y - 112} x2={sx} y2={y + H + 18} stroke={C.steel} strokeWidth="0.8" strokeDasharray="6 3 1.5 3" />
        <g transform={`rotate(${lean} ${sx} ${y})`}>
          <IronEnd x={sx} y={y + len - 4} len={len} />
          {lean !== 0 && <line x1={sx} y1={y} x2={sx} y2={y - 118} stroke={C.ruby} strokeWidth="0.8" strokeDasharray="3 2" />}
        </g>
        <circle cx={sx} cy={y} r="2.6" fill={C.emerald} />
        <circle cx={exitX} cy={y + H} r="2.6" fill={lean ? C.ruby : C.emerald} />
        {lean !== 0 && <circle cx={sx} cy={y + H} r="2.8" fill="none" stroke={C.emerald} strokeWidth="1" />}
      </g>
    )
  }
  const sx2 = 214 + 3 * s
  const rows = [0, 3, 5, 2, -2, -5, -3, 0, 4, 5]
  return (
    <Fig h={350} view="Section across · iron end-on" scale="×16 · lining side ×10">
      <Tag x={16} y={44}>Upright</Tag>
      <Verdict x={100} y={40} ok r={8} />
      {panel(24, 0)}
      <Tag x={204} y={44}>Leaning</Tag>
      <Verdict x={300} y={40} ok={false} r={8} />
      {panel(214, 5)}
      <path d={`M${sx2} ${y - 104} A104 104 0 0 1 ${sx2 + 104 * Math.sin(Math.PI / 36)} ${y - 104 * Math.cos(Math.PI / 36)}`} fill="none" stroke={C.ruby} strokeWidth="1.2" />
      <T x={sx2 + 14} y={y - 100} s={11} c={C.ruby} w="600">
        5°
      </T>
      <Ld pts={[[72, y + H], [100, 222]]} text="exit on the line" s={10.5} c={C.emerald} />
      <Ld pts={[[sx2 - 3, y + H], [262, 236]]} text="exit off the line" s={10.5} c={C.ruby} />
      <Ld pts={[[72, y + H + 16], [40, 226]]} x={16} y={238} text="stitch line" s={10.5} c={C.steel} />
      <Inset src={[sx2 - 1.2, y + H]} k={5} at={[420, 156]} r={40}>
        {panel(214, 5)}
      </Inset>
      <T x={420} y={212} a="middle" s={10.5} c={C.text}>
        offset = t × tan 5°
      </T>
      <T x={420} y={225} a="middle" s={10} c={C.faint}>
        ≈ 0.2 mm on 2.2 mm
      </T>

      <Sep x1={14} y1={250} x2={466} y2={250} />
      <Tag x={16} y={268}>Lining side · holes as they come out · 3 mm pitch</Tag>
      {[0, 1].map((r) => {
        const yy = 292 + r * 34
        return (
          <g key={r}>
            <rect x={24} y={yy - 14} width={316} height={28} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="0.7" />
            <line x1={24} y1={yy} x2={340} y2={yy} stroke={C.steel} strokeWidth="0.8" strokeDasharray="6 3 1.5 3" />
            {rows.map((d, i) => (
              <Slit key={i} x={40 + i * 30} y={yy + (r ? d : 0)} len={7} w={2} />
            ))}
            <Verdict x={356} y={yy} ok={!r} r={7} />
            <T x={370} y={yy + 4} s={10.5} c={r ? C.ruby : C.emerald}>
              {r ? '±0.5 mm: it shows' : 'on the line'}
            </T>
          </g>
        )
      })}
    </Fig>
  )
}

/* Strike lightly: mark only (then awl) versus punching through */
function Strike() {
  const tt = 7
  const tl = 5
  const H = tt + tl
  return (
    <Fig h={346} view="Side view · two ways to strike" scale="schematic">
      <Tag x={16} y={44}>Mark only, then awl</Tag>
      <Tag x={252} y={44}>Punch straight through</Tag>
      <Sep x1={240} y1={30} x2={240} y2={316} />

      {/* A1: light marks */}
      <Num x={22} y={110} n={1} r={7} />
      <Slab x={30} y={150 + H} w={196} h={12} kind="pad" />
      <Lam x1={34} x2={222} y={150} t={tt} l={tl} breakL breakR />
      <Iron n={4} pitch={14} x={93} y={153} />
      <Mallet x={114} y={74} k={0.6} />
      <Arrow a={[96, 50]} b={[96, 70]} w={1.4} dash="3 2" />
      <Ld pts={[[158, 153], [176, 120]]} text="prongs dent" sub="the grain only" s={10.5} />
      <T x={60} y={60} a="end" s={10.5} c={C.brass}>
        light taps
      </T>

      {/* A2: awl opens each mark */}
      <Num x={22} y={218} n={2} r={7} />
      <Slab x={30} y={262 + H} w={196} h={12} kind="pad" />
      <Lam x1={34} x2={222} y={262} t={tt} l={tl} breakL breakR />
      {Array.from({ length: 12 }, (_, i) => {
        const x = 44 + i * 15
        return i < 4 ? <HoleThru key={i} x={x} y={262} h={H} w={2.4} /> : i === 4 ? null : <Dent key={i} x={x} y={262} />
      })}
      <Awl x={104} y={276} k={0.8} />
      <Ld pts={[[59, 268], [59, 300]]} text="opened" a="middle" s={10.5} />
      <Ld pts={[[164, 263], [164, 300]]} text="marked" a="middle" s={10.5} c={C.dim} />
      <Ld pts={[[108, 222], [150, 206]]} text="diamond awl" sub="opens each mark" s={10.5} />

      {/* B1: through */}
      <Num x={258} y={110} n={1} r={7} />
      <Slab x={262} y={150 + H} w={200} h={12} kind="pad" />
      <Lam x1={266} x2={458} y={150} t={tt} l={tl} breakL breakR />
      <Iron n={4} pitch={14} kind="chisel" x={325} y={165} />
      <Mallet x={346} y={80} k={0.75} />
      <Arrow a={[322, 48]} b={[322, 74]} />
      <Ld pts={[[390, 166], [404, 120]]} text="irons or chisels" sub="driven to the pad" s={10.5} />

      {/* B2: result */}
      <Num x={258} y={218} n={2} r={7} />
      <Slab x={262} y={262 + H} w={200} h={12} kind="pad" />
      <Lam x1={266} x2={458} y={262} t={tt} l={tl} breakL breakR />
      {Array.from({ length: 12 }, (_, i) => (
        <HoleThru key={i} x={278 + i * 15} y={262} h={H} w={2.4} />
      ))}
      <T x={362} y={238} a="middle" s={10.5} c={C.text}>
        open through, ready to sew
      </T>
      <T x={362} y={304} a="middle" s={10.5} c={C.faint}>
        no awl step
      </T>
      <Note x={16} y={336} lines={['Either way: light, even blows with the iron upright — a hard blow drives prongs crooked.']} s={10.5} />
    </Fig>
  )
}

/* Close the gap: spread the error over the last holes of a straight */
function Gap() {
  const k = 10
  const row = (y0, xs, ok) => {
    const ly = y0 + 3 * k
    const pts = [...xs, 138, 168, 198, 228, 258, 288, 318, 348, 378, 408, 438]
    return (
      <g>
        <rect x={24} y={y0} width={436} height={50} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
        <line x1={24} y1={y0} x2={460} y2={y0} stroke={C.topEdge} strokeWidth="1.2" />
        <line x1={40} y1={y0 - 6} x2={40} y2={y0 + 56} stroke={C.text} strokeWidth="1" strokeDasharray="4 3" />
        <line x1={44} y1={ly} x2={460} y2={ly} stroke={C.text} strokeWidth="0.7" strokeDasharray="1.5 2.5" opacity="0.5" />
        {ok ? (
          <rect x={60} y={ly - 9} width={78} height={18} rx="3" fill="rgba(123,165,131,0.28)" stroke={C.emerald} strokeWidth="0.8" />
        ) : (
          <rect x={60} y={ly - 9} width={18} height={18} rx="3" fill="rgba(194,88,99,0.3)" stroke={C.ruby} strokeWidth="0.8" />
        )}
        {pts.map((x, i) => (
          <Slit key={i} x={x} y={ly} len={8} w={2.2} />
        ))}
        {[60, ...xs.slice(1), 138, 168].map((x, i, arr) =>
          i < arr.length - 1 ? (
            <Dim key={i} a={[x, y0 + 50]} b={[arr[i + 1], y0 + 50]} off={10} text={((arr[i + 1] - x) / k).toFixed(1)} flip tOff={arr[i + 1] - x < 26 ? 4 : 0} c={i < arr.length - 2 ? (ok ? C.emerald : i === 0 ? C.ruby : C.dim) : C.dim} />
          ) : null
        )}
      </g>
    )
  }
  return (
    <Fig h={340} view="Plan · lug end of a straight" scale="×10">
      <Verdict x={24} y={42} ok={false} r={8} />
      <T x={38} y={46} s={11} c={C.ruby}>
        All the error in one short gap
      </T>
      <Arrow a={[456, 50]} b={[380, 50]} w={1.6} />
      <T x={376} y={46} a="end" s={10.5} c={C.brass}>
        laid out from the tip
      </T>
      {row(64, [60, 78, 108], false)}
      <Verdict x={24} y={162} ok r={8} />
      <T x={38} y={166} s={11} c={C.emerald}>
        Spread over the last three: 7.8 ÷ 3 = 2.6
      </T>
      {row(184, [60, 86, 112], true)}
      <T x={40} y={270} a="middle" s={10} c={C.dim}>
        lug fold
      </T>
      <T x={60} y={284} a="middle" s={10} c={C.dim}>
        stop
      </T>
      <Note x={110} y={274} lines={['Lug end: the stitches here sit under the case, where nobody looks.', 'Never close the gap at the tip — it is laid out first, and seen first.']} s={10.5} lh={15} />
      <T x={110} y={322} s={10} c={C.faint}>
        Example: 7.8 mm left for three gaps at 3.0 mm pitch.
      </T>
    </Fig>
  )
}

/* Open the holes: diamond awl at the prong angle; round awl at the tip */
function OpenHoles() {
  const tt = 8
  const tl = 6
  const H = tt + tl
  const TP = { x: 262 - 97 * 5.4, y: 128, s: 5.4 }
  const o = LONG({ x0: 96 })
  const Hs = tipHoles(TP, o, 7)
  const isRound = (i) => i < 2
  const lozenge = (cx, cy, ang, big) => (
    <g transform={`translate(${cx} ${cy}) rotate(${ang})`}>
      <path d={`M${-big} 0 L0 ${-big * 0.45} L${big} 0 L0 ${big * 0.45} Z`} fill={C.hole} stroke="#9a7650" strokeWidth="0.5" />
    </g>
  )
  return (
    <Fig h={340} view="Opening the holes" scale="schematic · tip ×5.4">
      <Tag x={16} y={44}>Diamond awl · prong angle</Tag>
      <Slab x={20} y={138 + H} w={210} h={12} kind="pad" />
      <Lam x1={24} x2={226} y={138} t={tt} l={tl} breakL breakR />
      {Array.from({ length: 10 }, (_, i) => {
        const x = 40 + i * 20
        return i < 4 ? <HoleThru key={i} x={x} y={138} h={H} w={2.6} /> : i === 4 ? null : <Dent key={i} x={x} y={138} />
      })}
      <Awl x={120} y={156} k={0.9} />
      <Ld pts={[[60, 150], [60, 184]]} text="opened" a="middle" s={10.5} />
      <Ld pts={[[180, 139], [180, 184]]} text="marked" a="middle" s={10.5} c={C.dim} />
      <Ld pts={[[124, 80], [160, 66]]} text="diamond awl" s={10.5} />

      <Tag x={16} y={218}>Blade along the slit</Tag>
      {[0, 1].map((j) => {
        const cx = 50 + j * 110
        return (
          <g key={j}>
            <rect x={cx - 34} y={228} width={68} height={40} rx="3" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
            <Slit x={cx} y={248} len={22} w={1.2} c="#3a2412" />
            {j === 0 ? lozenge(cx, 248, -50, 9) : <g>{lozenge(cx, 248, 40, 9)}<Slit x={cx} y={248} len={20} w={2.6} /></g>}
            <Verdict x={cx + 42} y={232} ok={j === 0} r={7} />
            <T x={cx} y={284} a="middle" s={10.5} c={j === 0 ? C.emerald : C.ruby}>
              {j === 0 ? 'small, clean' : 'across: a cross tear'}
            </T>
          </g>
        )
      })}

      <Sep x1={238} y1={30} x2={238} y2={330} />
      <Tag x={250} y={44}>Round awl · at the point</Tag>
      <StrapPlan T={TP} o={o} stitch={{ mode: 'line', m: 3, from: 98 }} />
      <BreakV x={px(TP, 96, 0)[0]} y1={TP.y - 52} y2={TP.y + 52} />
      {[{ p: Hs.apex, a: 90 }, ...Hs.up, ...Hs.down].map((h, i) => {
        const near = i === 0 || (i >= 1 && i <= 2) || (i >= 8 && i <= 9)
        return near ? <circle key={i} cx={h.p[0]} cy={h.p[1]} r="2.6" fill={C.hole} stroke="#e7c48f" strokeWidth="0.5" /> : <Slit key={i} x={h.p[0]} y={h.p[1]} len={7} ang={h.a - 50} w={2} />
      })}
      <circle cx={Hs.apex[0] - 6} cy={Hs.apex[1]} r="24" fill="none" stroke={C.brass} strokeWidth="1" strokeDasharray="3 2" />
      <Ld pts={[[Hs.apex[0] - 6, Hs.apex[1] + 24], [Hs.apex[0] - 6, 196]]} text="round holes" sub="where the line turns" a="middle" s={10.5} />
      <Ld pts={[[px(TP, 100, -6)[0], px(TP, 100, -6)[1]], [282, 62]]} text="slits on the straights" s={10.5} c={C.dim} />
      <Awl kind="round" x={448} y={176} k={0.75} />
      <T x={448} y={194} a="middle" s={10} c={C.dim}>
        polished
      </T>
      <T x={448} y={207} a="middle" s={10} c={C.dim}>
        round awl
      </T>

      <Tag x={250} y={236}>Lining side</Tag>
      {[0, 1].map((r) => {
        const yy = 262 + r * 38
        return (
          <g key={r}>
            <rect x={250} y={yy - 12} width={150} height={24} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="0.7" />
            {Array.from({ length: 6 }, (_, i) => (
              <g key={i}>{lozenge(262 + i * 25, yy, -50, r === 1 ? 7 : 4.5)}</g>
            ))}
            {Array.from({ length: 5 }, (_, i) => (
              <Thr key={i} d={`M${265 + i * 25} ${yy + 2} L${284 + i * 25} ${yy - 2}`} c={i % 2 ? TB : TA} w={1.8} />
            ))}
            <Verdict x={414} y={yy} ok={!r} r={7} />
            <T x={426} y={yy + 4} s={10.5} c={r ? C.ruby : C.emerald}>
              {r ? 'gaping' : 'neat'}
            </T>
          </g>
        )
      })}
      <T x={250} y={334} s={10} c={C.faint}>
        Keep holes small — the back looks better.
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* T9 · The saddle stitch                                               */
/* ================================================================== */

// A thread's path through a seam section, hole by hole (the regular stitch
// uses seamPaths). moves: [{ to, lane, pass }]; lanes stack doubled spans
// outward from the face; pass:false stops on the current side.
function route({ X, yt, yb, mid, start, side, moves, lane = 3.6, d = 1.8 }) {
  const Y = (sd, ln) => (sd === 't' ? yt - ln * lane : yb + ln * lane)
  let cur = start
  let sd = side
  const pts = [[X(start), mid], [X(start), Y(sd, (moves[0] && moves[0].lane) || 0)]]
  moves.forEach((m, i) => {
    const dir = Math.sign(m.to - cur) || 1
    const ln = m.lane || 0
    pts.push([X(m.to) - dir * d, Y(sd, ln)])
    if (m.pass !== false) {
      const nx = moves[i + 1]
      const dOut = nx ? Math.sign(nx.to - m.to) || dir : dir
      const ns = sd === 't' ? 'b' : 't'
      pts.push([X(m.to) + dOut * d, Y(ns, (nx && nx.lane) || 0)])
      sd = ns
    }
    cur = m.to
  })
  return pts
}

// Grain / lining side labels at the left of a seam section.
function Faces({ x, y, h }) {
  return (
    <g>
      <T x={x} y={y - 8} a="end" s={10} c={C.faint}>
        grain
      </T>
      <T x={x} y={y + h + 16} a="end" s={10} c={C.faint}>
        lining
      </T>
    </g>
  )
}

/* Cut the thread: seam ≈ 2 × strap length, thread ≈ 4–5 × seam */
function Length() {
  const TL = { x: 60, y: 74, s: 2.6 }
  const TS = { x: 60, y: 166, s: 2.6 }
  const oL = LONG()
  const oS = SHORT()
  const hiL = runBetween(offset(outline(oL), 3), 5)
  const hiS = runBetween(offset(outline(oS), 3), 5, 75)
  const band = (runs, TT) =>
    runs.map((r, i) => <path key={i} d={pathOf(r, TT, false)} fill="none" stroke={C.brass} strokeWidth="5" opacity="0.32" strokeLinecap="round" />)
  const x0 = 100
  const k = 0.3
  const row = (y, name, seam, lo, hi, cut, cutTxt) => (
    <g>
      <T x={x0 - 10} y={y + 4} a="end" s={11} c={C.text}>
        {name}
      </T>
      <line x1={x0} y1={y} x2={x0 + hi * k} y2={y} stroke={TB} strokeWidth="1.2" />
      <rect x={x0 + lo * k} y={y - 4} width={(hi - lo) * k} height={8} fill="rgba(208,168,79,0.35)" stroke={C.brass} strokeWidth="0.8" />
      <rect x={x0} y={y - 3} width={seam * k} height={6} fill={C.thread} stroke={CASE} strokeWidth="0.6" />
      <path d={`M${x0 + cut[0] * k} ${y - 9} V${y - 13} H${x0 + cut[1] * k} V${y - 9}`} fill="none" stroke={C.text} strokeWidth="1" />
      <T x={x0 + ((cut[0] + cut[1]) / 2) * k} y={y - 17} a="middle" s={10.5} c={C.text} w="600">
        {cutTxt}
      </T>
      <T x={x0 + lo * k} y={y + 18} a="middle" s={10} mono c={C.brass}>
        4×
      </T>
      <T x={x0 + hi * k} y={y + 18} a="middle" s={10} mono c={C.brass}>
        5×
      </T>
      <T x={x0 + seam * k + 4} y={y + 18} s={10} mono c={C.dim}>
        seam
      </T>
    </g>
  )
  return (
    <Fig h={352} view="Plan & chart · how much thread" scale="plans ×2.6 · chart 1 m = 300 px">
      <StrapPlan T={TL} o={oL} stitch={{ mode: 'line', m: 3, from: 5 }} />
      {band(hiL, TL)}
      <Arrow a={px(TL, 40, -7)} b={px(TL, 70, -7)} w={1.4} />
      <Arrow a={px(TL, 70, 6.5)} b={px(TL, 40, 6.5)} w={1.4} />
      <Dim a={px(TL, 0, -10)} b={px(TL, 120, -10)} off={-10} text="120" flip />
      <T x={60} y={118} s={10.5} c={C.text}>
        Long piece: up one side, round the tip and back
      </T>
      <T x={60} y={131} s={10.5} mono c={C.brass}>
        seam ≈ 2 × 120 = 240 mm
      </T>
      <StrapPlan T={TS} o={oS} stitch={{ mode: 'line', m: 3, from: 5, to: 75 }} />
      {band(hiS, TS)}
      <Dim a={px(TS, 0, 10)} b={px(TS, 80, 10)} off={10} text="80" flip />
      <T x={292} y={162} s={10.5} c={C.text}>
        Short piece: both sides
      </T>
      <T x={292} y={175} s={10.5} mono c={C.brass}>
        seam ≈ 2 × 75 = 150 mm
      </T>

      <Sep x1={14} y1={216} x2={466} y2={216} />
      <Tag x={16} y={234}>Thread ≈ 4–5 × seam · cut from the reel</Tag>
      {row(282, 'long', 240, 960, 1200, [1000, 1100], '≈ 1.0–1.1 m')}
      {row(324, 'short', 150, 600, 750, [600, 700], '≈ 0.6–0.7 m')}
      {[0, 500, 1000].map((v) => (
        <T key={v} x={x0 + v * k} y={252} a="middle" s={10} mono c={C.faint}>
          {v / 1000} m
        </T>
      ))}
    </Fig>
  )
}

/* Thread the needles: polyester once, linen locked; wax; discard bad needles */
function ThreadUp() {
  const ny = 64
  return (
    <Fig h={350} view="Detail · threading up" scale="needles ×2 · schematic">
      <Tag x={16} y={40}>One thread, a needle on each end</Tag>
      <Needle x1={22} y1={ny} x2={104} y2={ny} />
      <Thr d={`M104 ${ny} C150 ${ny - 12} 190 ${ny + 12} 240 ${ny}`} c={TA} w={2} />
      <Thr d={`M240 ${ny} C290 ${ny - 12} 330 ${ny + 12} 376 ${ny}`} c={TB} w={2} />
      <Needle x1={458} y1={ny} x2={376} y2={ny} />
      <T x={60} y={ny - 10} a="middle" s={10.5} c={C.text}>
        needle A
      </T>
      <T x={418} y={ny - 10} a="middle" s={10.5} c={C.text}>
        needle B
      </T>
      <T x={240} y={ny + 24} a="middle" s={10} c={C.faint}>
        John James harness needles, blunt · size 004 (48 × 0.86 mm)
      </T>

      <Sep x1={14} y1={102} x2={466} y2={102} />
      <Tag x={16} y={120}>Polyester</Tag>
      <Needle x1={22} y1={156} x2={118} y2={156} />
      <Thr d="M118 156 L150 156" c={TA} w={2} />
      <Thr d="M118 156 Q110 162 100 161 L76 161" c={TA} w={2} />
      <Ld pts={[[80, 161], [80, 186]]} text="short tail lies back" sub="along the needle" a="middle" s={10.5} />
      <Sep x1={160} y1={110} x2={160} y2={238} />
      <Tag x={172} y={120}>Linen · lock it</Tag>
      {/* 1: pierce the tail */}
      <Num x={182} y={146} n={1} r={7} />
      <Needle x1={196} y1={146} x2={292} y2={146} />
      <Thr d="M292 146 L332 146" c={TA} w={2} />
      <Thr d="M292 146 Q286 140 278 140 L270 140 L266 152 L252 152 L248 140 L236 140 L232 152 L226 152" c={TA} w={1.8} />
      {[266, 248, 232].map((x) => (
        <circle key={x} cx={x - 1} cy={146} r="1.6" fill="#cfdbe3" />
      ))}
      <T x={340} y={142} s={10.5} c={C.text}>
        pierce the tail
      </T>
      <T x={340} y={155} s={10} c={C.faint}>
        2–3 times with the point
      </T>
      {/* 2: pull back over the eye */}
      <Num x={182} y={188} n={2} r={7} />
      <Needle x1={196} y1={188} x2={292} y2={188} />
      <Thr d="M292 188 L332 188" c={TA} w={2} />
      <Thr d="M292 188 Q286 182 280 182 L276 194 L270 194 L266 182 L260 182" c={TA} w={1.8} />
      <Arrow a={[262, 176]} b={[296, 176]} w={1.4} />
      <Arrow a={[300, 198]} b={[324, 198]} w={1.4} />
      <T x={340} y={184} s={10.5} c={C.text}>
        pull the long end:
      </T>
      <T x={340} y={197} s={10} c={C.faint}>
        the tail slides over the eye
      </T>
      {/* 3: locked */}
      <Num x={182} y={226} n={3} r={7} />
      <Needle x1={196} y1={226} x2={292} y2={226} />
      <path d="M284 226 Q292 219 302 222 Q308 226 302 230 Q292 233 284 226 Z" fill={TA} stroke={CASE} strokeWidth="0.8" />
      <Thr d="M302 226 L332 226" c={TA} w={2} />
      <T x={340} y={222} s={10.5} c={C.emerald}>
        locked, flat
      </T>
      <T x={340} y={235} s={10} c={C.faint}>
        no knot to drag through
      </T>

      <Sep x1={14} y1={252} x2={466} y2={252} />
      <Tag x={16} y={270}>Wax dry thread</Tag>
      <path d="M30 312 L46 286 L136 286 L120 312 Z" fill="#e3c35a" stroke="#8a6d1d" strokeWidth="0.9" />
      <path d="M120 312 L136 286 L136 298 L120 324 Z" fill="#b8962f" stroke="#8a6d1d" strokeWidth="0.9" />
      <rect x={30} y={312} width={90} height={12} fill="#cfae45" stroke="#8a6d1d" strokeWidth="0.9" />
      <Thr d="M18 300 Q84 294 150 300" c={TA} w={1.8} />
      <Arrow a={[100, 280]} b={[140, 280]} w={1.4} />
      <T x={84} y={340} a="middle" s={10.5} c={C.text}>
        draw it over a beeswax block
      </T>
      <Sep x1={196} y1={260} x2={196} y2={344} />
      <Tag x={208} y={270}>Throw away</Tag>
      <path d="M216 310 Q262 306 286 290" fill="none" stroke="#cfdbe3" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx={282} cy={293} rx="2.4" ry="0.9" transform="rotate(-35 282 293)" fill={C.ground} />
      <T x={250} y={330} a="middle" s={10.5} c={C.text}>
        bent
      </T>
      <line x1={318} y1={302} x2={360} y2={302} stroke="#cfdbe3" strokeWidth="2" strokeLinecap="round" />
      <line x1={366} y1={304} x2={400} y2={304} stroke="#cfdbe3" strokeWidth="2" strokeLinecap="round" />
      <path d="M360 299 l3 3 l-2 3 M366 301 l-2 3 l3 2" fill="none" stroke={C.ruby} strokeWidth="1" />
      <T x={360} y={330} a="middle" s={10.5} c={C.text}>
        broken or burred
      </T>
      <Verdict x={448} y={300} ok={false} r={9} />
    </Fig>
  )
}

/* Clamp the work: in the pony, slits up and away, work toward yourself */
function Clamp() {
  const fy = 96 // strap edge in the side view
  const sk = 4 // px per mm
  const ly = fy + 3 * sk
  const p = 3 * sk
  const sx = 186
  const cur = 6
  const X = (i) => sx + i * p
  const face = (w) => (
    <g>
      <rect x={164} y={fy} width={292} height={50} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <line x1={164} y1={fy} x2={456} y2={fy} stroke={C.topEdge} strokeWidth="1.4" />
      {Array.from({ length: 22 - cur }, (_, i) => (
        <Slit key={i} x={X(cur + i)} y={ly} len={7} ang={50} w={w} />
      ))}
    </g>
  )
  return (
    <Fig h={340} view="End view & side view · in the pony" scale="schematic · side ×4">
      <Tag x={16} y={44}>End-on</Tag>
      {/* pony: two staves gripping the strap */}
      <path d="M64 96 Q58 190 36 300" fill="none" stroke="url(#sk-wood)" strokeWidth="15" strokeLinecap="round" />
      <path d="M86 96 Q92 190 114 300" fill="none" stroke="url(#sk-wood)" strokeWidth="15" strokeLinecap="round" />
      <rect x={50} y={88} width={14} height={22} rx="3" fill="#7b5a3a" />
      <rect x={86} y={88} width={14} height={22} rx="3" fill="#7b5a3a" />
      <rect x={72} y={56} width={6} height={50} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />
      <rect x={30} y={210} width={90} height={7} rx="3" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" />
      <Ld pts={[[75, 60], [100, 56]]} text="strap, edge up" s={10.5} />
      <Ld pts={[[52, 96], [30, 82]]} x={16} y={78} text="jaws" s={10.5} />
      <Ld pts={[[110, 213], [128, 236]]} x={132} y={240} text="clamp" s={10} c={C.dim} />
      <T x={75} y={322} a="middle" s={10} c={C.faint}>
        legs held between
      </T>
      <T x={75} y={335} a="middle" s={10} c={C.faint}>
        the knees
      </T>

      <Sep x1={150} y1={30} x2={150} y2={330} />
      <Tag x={164} y={44}>Side view · the face you see</Tag>
      <Arrow a={[300, 70]} b={[436, 70]} />
      <T x={300} y={64} s={10.5} c={C.brass}>
        work toward yourself
      </T>
      {face(2)}
      <path d={`M164 ${fy + 44} H456 V${fy + 92} H164 Z`} fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.8" />
      <rect x={164} y={fy + 44} width={292} height={6} fill="#7b5a3a" />
      <FaceStitches x0={sx} y={ly} p={p} n={cur} />
      <Ld pts={[[X(3), ly - 4], [X(3), 84]]} text="sewn" a="middle" s={10.5} c={C.dim} />
      <Ld pts={[[300, fy + 70], [300, 212]]} text="jaw" sub="leather pad on top" a="middle" s={10.5} c={C.dim} />
      <T x={456} y={212} a="end" s={11} c={C.text} w="600">
        you
      </T>
      <Arrow a={[410, 208]} b={[428, 208]} c="text" w={1.2} />
      <Inset src={[X(16), ly]} k={4} at={[402, 284]} r={40}>
        {face(1.2)}
      </Inset>
      <Arrow a={[330, 312]} b={[302, 284]} c="emerald" w={1.4} />
      <T x={340} y={262} a="end" s={10.5} c={C.emerald}>
        each slit leans up
      </T>
      <T x={340} y={275} a="end" s={10.5} c={C.emerald}>
        and away from you
      </T>

    </Fig>
  )
}

/* Start: thread centred in the first hole */
function Start() {
  const x0 = 120
  const p = 50
  const y = 124
  const h = 32
  const X = (i) => x0 + i * p
  const yt = y - 2.4
  const yb = y + h + 2.4
  // the small alternative: start one hole in, back over the start
  const sx0 = 330
  const sp = 30
  const sy = 286
  const sh = 20
  const SX = (i) => sx0 + i * sp
  const A2 = route({ X: SX, yt: sy - 2.2, yb: sy + sh + 2.2, mid: sy + sh / 2, start: 1, side: 't', lane: 3.4, moves: [{ to: 0 }, { to: 1, lane: 1 }, { to: 2 }, { to: 3 }] })
  const B2 = route({ X: SX, yt: sy - 2.2, yb: sy + sh + 2.2, mid: sy + sh / 2, start: 1, side: 'b', lane: 3.4, moves: [{ to: 0 }, { to: 1, lane: 1 }, { to: 2 }, { to: 3 }] })
  return (
    <Fig h={340} view="Section along the seam · casting on" scale="thickness ×5 · schematic">
      <ThreadKey x={16} y={40} />
      <SeamBand x0={x0} p={p} n={6} y={y} h={h} breakL={false} />
      <Faces x={x0 - 44} y={y} h={h} />
      <Thr d={`M${X(0)} ${y + h / 2} L${X(0)} ${yt} C${X(0)} ${y - 30} ${X(0) + 40} ${y - 54} ${X(0) + 90} ${y - 58} L${X(0) + 150} ${y - 60}`} c={TA} />
      <Thr d={`M${X(0)} ${y + h / 2} L${X(0)} ${yb} C${X(0)} ${y + h + 30} ${X(0) + 40} ${y + h + 54} ${X(0) + 90} ${y + h + 58} L${X(0) + 150} ${y + h + 60}`} c={TB} />
      <path d={`M${X(0) + 156} ${y - 66} l4 12 M${X(0) + 162} ${y - 66} l4 12`} stroke={C.dim} strokeWidth="1" />
      <path d={`M${X(0) + 156} ${y + h + 54} l4 12 M${X(0) + 162} ${y + h + 54} l4 12`} stroke={C.dim} strokeWidth="1" />
      <Needle x1={X(0) + 250} y1={y - 60} x2={X(0) + 172} y2={y - 60} />
      <Thr d={`M${X(0) + 168} ${y - 60} L${X(0) + 172} ${y - 60}`} c={TA} />
      <Needle x1={X(0) + 250} y1={y + h + 60} x2={X(0) + 172} y2={y + h + 60} />
      <Thr d={`M${X(0) + 168} ${y + h + 60} L${X(0) + 172} ${y + h + 60}`} c={TB} />
      <T x={X(0) + 262} y={y - 56} s={10.5} c={C.text}>
        needle A · grain side
      </T>
      <T x={X(0) + 262} y={y + h + 64} s={10.5} c={C.text}>
        needle B · lining side
      </T>
      <Ld pts={[[X(0) + 2, y + h / 2], [40, y + h / 2]]} x={36} y={y + h / 2 - 2} text="hole 1" a="end" s={10.5} />
      <T x={36} y={y + h / 2 + 11} a="end" s={10} c={C.faint}>
        centred
      </T>
      <T x={X(0) + 110} y={y - 70} a="middle" s={10.5} c={C.brass} w="600">
        ½
      </T>
      <T x={X(0) + 110} y={y + h + 80} a="middle" s={10.5} c={C.brass} w="600">
        ½
      </T>
      <T x={X(3) + 25} y={y + h + 22} a="middle" s={10} c={C.faint}>
        holes still to sew →
      </T>

      <Sep x1={14} y1={242} x2={466} y2={242} />
      <Tag x={16} y={260}>Or start one hole in</Tag>
      <Note x={16} y={284} lines={['Centre the thread in hole 2, go back to', 'hole 1, then forward again: the first', 'stitch is doubled and cannot pull out.']} s={10.5} lh={14} />
      <SeamBand x0={sx0} p={sp} n={5} y={sy} h={sh} holeW={4} breakL={false} />
      <Thr d={poly(B2)} c={TB} w={2} />
      <Thr d={poly(A2)} c={TA} w={2} />
      <T x={SX(0)} y={sy + sh + 24} a="middle" s={10} mono c={C.dim}>
        1
      </T>
      <T x={SX(1)} y={sy + sh + 24} a="middle" s={10} mono c={C.brass}>
        2
      </T>
      <Arrow a={[SX(1) - 2, sy - 16]} b={[SX(0) + 4, sy - 16]} w={1.3} />
      <Arrow a={[SX(1) + 4, sy - 16]} b={[SX(3), sy - 16]} w={1.3} />
    </Fig>
  )
}

/* Make each stitch: A through first, B through the same hole behind it */
function StitchStep() {
  const x0 = 60
  const p = 58
  const y = 150
  const h = 34
  const d = 3
  const X = (i) => x0 + i * p
  const yt = y - 2.4
  const yb = y + h + 2.4
  const eyeA = [X(3) + 44, yb + 50]
  const ptA = [X(3) + 112, yb + 92]
  const eyeB = [X(3) - 40, yb + 62]
  const ptB = [X(3) + 2, y - 22]
  const scene = (
    <g>
      <SeamBand x0={x0} p={p} n={5} y={y} h={h} breakL={false} holeW={8} />
      <SeamThreads x0={x0} p={p} y={y} h={h} done={2} d={d} />
      <Thr d={`M${X(2) + d} ${yb} Q${X(2) + 26} ${yb + 6} ${eyeB[0] - 2} ${eyeB[1] - 2}`} c={TB} />
      <Needle x1={ptB[0]} y1={ptB[1]} x2={eyeB[0]} y2={eyeB[1]} />
      <Thr d={`M${X(2) + d} ${yt} L${X(3) - d} ${yt} L${X(3) + d} ${yb} Q${X(3) + 12} ${yb + 26} ${eyeA[0] - 2} ${eyeA[1] - 2}`} c={TA} />
      <Needle x1={ptA[0]} y1={ptA[1]} x2={eyeA[0]} y2={eyeA[1]} />
    </g>
  )
  return (
    <Fig h={350} view="Section along the seam · one stitch" scale="thickness ×5 · schematic">
      <ThreadKey x={16} y={42} />
      {scene}
      <T x={24} y={y - 10} s={10} c={C.faint}>
        grain
      </T>
      <T x={24} y={y + h + 18} s={10} c={C.faint}>
        lining
      </T>
      <Num x={ptA[0] + 14} y={ptA[1] - 10} n={1} />
      <T x={ptA[0] + 28} y={ptA[1] - 14} s={11} c={C.text}>
        needle A first,
      </T>
      <T x={ptA[0] + 28} y={ptA[1] - 1} s={10} c={C.faint}>
        from the grain side
      </T>
      <Num x={eyeB[0] - 26} y={eyeB[1] + 4} n={2} />
      <T x={eyeB[0] - 40} y={eyeB[1] + 22} a="end" s={11} c={C.text}>
        needle B, same hole,
      </T>
      <T x={eyeB[0] - 40} y={eyeB[1] + 35} a="end" s={10} c={C.faint}>
        from the lining side
      </T>
      <Ld pts={[[X(1) + p / 2, yt - 1], [X(1) + p / 2, 104]]} text="stitches already set" a="middle" s={10.5} c={C.dim} />
      <Inset src={[X(3), y + h / 2]} k={3} at={[414, 110]} r={48}>
        {scene}
      </Inset>
      <T x={414} y={174} a="middle" s={10.5} c={C.text}>
        B passes behind
      </T>
      <T x={414} y={187} a="middle" s={10.5} c={C.text}>
        A’s thread
      </T>

      <Sep x1={14} y1={294} x2={466} y2={294} />
      <rect x={16} y={310} width={234} height={26} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <FaceStitches x0={20} y={323} p={28} n={8} />
      <T x={262} y={316} s={10.5} c={C.text}>
        Grain face: the same order in
      </T>
      <T x={262} y={329} s={10.5} c={C.text}>
        every hole gives an even slant.
      </T>
      <T x={262} y={344} s={10} c={C.faint}>
        The needles swap sides each stitch.
      </T>
    </Fig>
  )
}

/* Control the slant: one method, never both */
function Slant() {
  const slit = (cx, cy) => {
    const u = [Math.cos((-50 * Math.PI) / 180), Math.sin((-50 * Math.PI) / 180)]
    const v = [-u[1], u[0]]
    const L = 34
    const W = 7
    return `M${cx + u[0] * L} ${cy + u[1] * L} L${cx + v[0] * W} ${cy + v[1] * W} L${cx - u[0] * L} ${cy - u[1] * L} L${cx - v[0] * W} ${cy - v[1] * W} Z`
  }
  const c1 = [118, 128]
  const c2 = [356, 128]
  return (
    <Fig h={350} view="Detail · the hole, magnified" scale="hole ×12 · face strips ×4">
      <Tag x={16} y={44}>Method 1 · same corner</Tag>
      <rect x={20} y={56} width={200} height={132} rx="4" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <path d={slit(...c1)} fill={C.hole} stroke="#3a2412" strokeWidth="0.8" />
      <Thr d={`M${c1[0] + 10} ${c1[1] - 14} Q${c1[0] - 10} ${c1[1] - 40} ${c1[0] - 80} ${c1[1] - 52}`} c={TA} w={3} />
      <circle cx={c1[0] + 10} cy={c1[1] - 14} r="2.2" fill={TA} />
      <Needle x1={c1[0] - 14} y1={c1[1] + 18} x2={c1[0] + 70} y2={c1[1] + 52} />
      <circle cx={c1[0] - 14} cy={c1[1] + 18} r="9" fill="none" stroke={C.emerald} strokeWidth="1.3" />
      <T x={120} y={204} a="middle" s={10.5} c={C.text}>
        second needle in the same corner,
      </T>
      <T x={120} y={217} a="middle" s={10} c={C.faint}>
        clear of the first thread, every time
      </T>
      <T x={240} y={126} a="middle" s={12} c={C.brass} w="600">
        or
      </T>
      <Tag x={258} y={44}>Method 2 · cast the loop</Tag>
      <rect x={260} y={56} width={200} height={132} rx="4" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <path d={slit(...c2)} fill={C.hole} stroke="#3a2412" strokeWidth="0.8" />
      <Needle x1={c2[0] - 2} y1={c2[1] + 2} x2={c2[0] + 84} y2={c2[1] + 42} />
      <Thr d={`M${c2[0] - 4} ${c2[1] - 4} Q${c2[0] + 30} ${c2[1] - 8} ${c2[0] + 38} ${c2[1] + 12}`} c={TA} w={3} />
      <Thr d={`M${c2[0] + 38} ${c2[1] + 12} Q${c2[0] + 44} ${c2[1] + 30} ${c2[0] + 30} ${c2[1] + 28}`} c={TA} w={3} op={0.55} />
      <Needle x1={c2[0] + 30} y1={c2[1] + 16} x2={c2[0] + 84} y2={c2[1] + 42} />
      <Thr d={`M${c2[0] + 30} ${c2[1] + 28} Q${c2[0] + 10} ${c2[1] + 30} ${c2[0] - 30} ${c2[1] + 46} L${c2[0] - 84} ${c2[1] + 50}`} c={TA} w={3} />
      <T x={360} y={204} a="middle" s={10.5} c={C.text}>
        first thread cast once round
      </T>
      <T x={360} y={217} a="middle" s={10} c={C.faint}>
        the second needle, every time
      </T>

      <Sep x1={14} y1={232} x2={466} y2={232} />
      {[0, 1].map((r) => {
        const yy = 262 + r * 50
        return (
          <g key={r}>
            <rect x={20} y={yy - 14} width={270} height={28} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
            <FaceStitches x0={24} y={yy} p={26} n={10} alt={r === 1} kn={r === 1} />
            <Verdict x={308} y={yy} ok={!r} r={8} />
            <T x={324} y={yy - 2} s={11} c={r ? C.ruby : C.emerald}>
              {r ? 'both methods mixed' : 'one method throughout'}
            </T>
            <T x={324} y={yy + 11} s={10} c={C.faint}>
              {r ? 'an overhand knot every stitch' : 'every stitch slants the same'}
            </T>
          </g>
        )
      })}
    </Fig>
  )
}

/* Check for piercing */
function Pierce() {
  const y = 96
  const tt = 26
  const tl = 18
  const H = tt + tl
  const strand = (d, w = 9) => (
    <g>
      <path d={d} fill="none" stroke={CASE} strokeWidth={w + 2} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={TA} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke="#c9bb98" strokeWidth={w * 0.35} strokeDasharray="2.5 3.5" strokeLinecap="round" />
    </g>
  )
  const lam = (cx) => (
    <g>
      <Lam x1={cx - 100} x2={cx + 100} y={y} t={tt} l={tl} breakL breakR />
      <rect x={cx - 13} y={y - 0.5} width={26} height={H + 1} fill={C.ground} />
    </g>
  )
  const c1 = 120
  const c2 = 360
  return (
    <Fig h={354} view="Section through one hole" scale="×20 · schematic">
      <Tag x={16} y={44}>Pierced</Tag>
      <Verdict x={84} y={40} ok={false} r={8} />
      {lam(c1)}
      {strand(`M${c1 - 96} ${y - 6} L${c1 - 10} ${y - 6} Q${c1 - 13} ${y + 8} ${c1 - 13} ${y + 20} L${c1 - 13} ${y + H - 12} Q${c1 - 13} ${y + H + 6} ${c1 + 10} ${y + H + 6} L${c1 + 96} ${y + H + 6}`, 4.5)}
      <Needle x1={c1} y1={y - 30} x2={c1} y2={y + H + 52} />
      {strand(`M${c1 - 4} ${y - 6} Q${c1 + 11} ${y + 8} ${c1 + 11} ${y + 20} L${c1 + 11} ${y + H - 12} Q${c1 + 11} ${y + H + 2} ${c1 + 6} ${y + H + 6}`, 4.5)}
      <T x={c1} y={y + H + 64} a="middle" s={10.5} c={C.ruby}>
        point went through A’s thread:
      </T>
      <T x={c1} y={y + H + 77} a="middle" s={10} c={C.faint}>
        its plies split round the needle
      </T>

      <Sep x1={240} y1={30} x2={240} y2={214} />
      <Tag x={256} y={44}>Clean pass</Tag>
      <Verdict x={340} y={40} ok r={8} />
      {lam(c2)}
      <Needle x1={c2 + 5} y1={y - 30} x2={c2 + 5} y2={y + H + 52} />
      {strand(`M${c2 - 96} ${y - 6} L${c2 - 10} ${y - 6} Q${c2 - 7} ${y + 6} ${c2 - 7} ${y + 18} L${c2 - 7} ${y + H - 12} Q${c2 - 7} ${y + H + 6} ${c2 + 14} ${y + H + 6} L${c2 + 96} ${y + H + 6}`)}
      <T x={c2} y={y + H + 64} a="middle" s={10.5} c={C.emerald}>
        needle passes behind it:
      </T>
      <T x={c2} y={y + H + 77} a="middle" s={10} c={C.faint}>
        A’s thread pushed aside, intact
      </T>

      <Sep x1={14} y1={228} x2={466} y2={228} />
      <Tag x={16} y={244}>The check · draw B about two needle-lengths</Tag>
      <Lam x1={24} x2={96} y={274} t={9} l={6} breakL />
      <rect x={86} y={273.5} width={4} height={16} fill={C.ground} />
      <Thr d="M88 282 L264 282" c={TB} w={2} />
      <Needle x1={344} y1={282} x2={264} y2={282} />
      <Arrow a={[350, 296]} b={[392, 296]} w={1.4} />
      <path d="M88 268 V264 H264 V268 M176 264 V268" fill="none" stroke={C.dim} strokeWidth="0.9" />
      <T x={132} y={260} a="middle" s={10} mono c={C.dim}>
        1
      </T>
      <T x={220} y={260} a="middle" s={10} mono c={C.dim}>
        2
      </T>
      <T x={360} y={274} s={10} c={C.faint}>
        JJ 004 = 48 mm
      </T>
      <Verdict x={28} y={318} ok r={7} />
      <T x={42} y={322} s={10.5} c={C.emerald}>
        slides freely: carry on
      </T>
      <Verdict x={208} y={318} ok={false} r={7} />
      <T x={222} y={322} s={10.5} c={C.ruby}>
        drags: pierced — back it out, go again
      </T>
      <T x={16} y={344} s={10} c={C.faint}>
        A pierced stitch can’t be tensioned now or picked out and repaired later.
      </T>
    </Fig>
  )
}

/* Tension evenly */
function Tension() {
  const s = 12
  const ex = 34
  const y = 150
  const tt = 1.1 * s
  const tl = 0.7 * s
  const hx = ex + 3 * s
  const strip = (y0, kind) => {
    const L = 180
    const x0 = 270
    if (kind === 'bow')
      return (
        <g>
          <path d={`M${x0} ${y0 + 8} Q${x0 + L / 2} ${y0 - 22} ${x0 + L} ${y0 + 8} L${x0 + L} ${y0 + 16} Q${x0 + L / 2} ${y0 - 14} ${x0} ${y0 + 16} Z`} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
          <path d={`M${x0} ${y0 + 16} Q${x0 + L / 2} ${y0 - 14} ${x0 + L} ${y0 + 16} L${x0 + L} ${y0 + 21} Q${x0 + L / 2} ${y0 - 9} ${x0} ${y0 + 21} Z`} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.8" />
          <path d={`M${x0 + 30} ${y0 - 3} Q${x0 + L / 2} ${y0 - 22} ${x0 + L - 30} ${y0 - 3}`} fill="none" stroke={TA} strokeWidth="1.6" strokeDasharray="5 3" />
        </g>
      )
    return (
      <g>
        <rect x={x0} y={y0 - 14} width={L} height={30} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
        {kind === 'pucker' && (
          <path d={Array.from({ length: 13 }, (_, i) => `${i ? 'L' : 'M'}${x0 + i * 15} ${y0 - 14 + (i % 2 ? 3 : 0)}`).join(' ')} fill="none" stroke={C.ruby} strokeWidth="1.4" />
        )}
        <FaceStitches x0={x0 + 4} y={y0 - 6} p={15} n={11} w={kind === 'pucker' ? 1.4 : 2} slant={1.8} />
        <FaceStitches x0={x0 + 4} y={y0 + 8} p={15} n={11} w={kind === 'pucker' ? 1.4 : 2} slant={1.8} />
      </g>
    )
  }
  return (
    <Fig h={340} view="Section across & views · tension" scale="section ×12 · schematic">
      <Tag x={16} y={44}>Both threads, the same pull</Tag>
      <Lam x1={ex} x2={210} y={y} t={tt} l={tl} breakR />
      <rect x={hx - 2} y={y - 0.5} width={4} height={tt + tl + 1} fill={C.hole} />
      <Thr d={`M${hx} ${y + tt + tl} L${hx} ${y} Q${hx} ${y - 24} ${hx + 44} ${y - 50}`} c={TA} />
      <Thr d={`M${hx} ${y} L${hx} ${y + tt + tl} Q${hx} ${y + tt + tl + 24} ${hx + 44} ${y + tt + tl + 50}`} c={TB} />
      <Arrow a={[hx + 50, y - 54]} b={[hx + 82, y - 78]} c="emerald" />
      <Arrow a={[hx + 50, y + tt + tl + 54]} b={[hx + 82, y + tt + tl + 78]} c="emerald" />
      <T x={hx + 88} y={y - 76} s={10.5} c={C.emerald}>
        same force
      </T>
      <T x={hx + 88} y={y + tt + tl + 88} s={10.5} c={C.emerald}>
        same force
      </T>
      <T x={150} y={y + tt + tl + 26} s={10.5} c={C.dim}>
        snug, not
      </T>
      <T x={150} y={y + tt + tl + 39} s={10.5} c={C.dim}>
        strangled
      </T>
      <Ld pts={[[hx, y + 4], [hx - 20, 120]]} x={16} y={116} text="stitch hole" s={10.5} c={C.dim} />
      <Note x={16} y={312} lines={['Pull with the little fingers,', 'the same on both sides, each stitch.']} s={10.5} lh={14} />

      <Sep x1={238} y1={30} x2={238} y2={330} />
      <Verdict x={256} y={60} ok r={8} />
      <T x={270} y={64} s={11} c={C.emerald}>
        even: lies straight and flat
      </T>
      {strip(96, 'even')}
      <Verdict x={256} y={146} ok={false} r={8} />
      <T x={270} y={150} s={11} c={C.ruby}>
        uneven: the strap curls
      </T>
      <T x={270} y={163} s={10} c={C.faint}>
        side view — toward the tighter face
      </T>
      {strip(204, 'bow')}
      <Verdict x={256} y={244} ok={false} r={8} />
      <T x={270} y={248} s={11} c={C.ruby}>
        over-tight: the edge puckers
      </T>
      {strip(286, 'pucker')}
    </Fig>
  )
}

// Clip a group to a rectangle (local helper for seam sections that run off).
function ClipBox({ x, y, w, h, children }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <g>
      <clipPath id={`cb${id}`}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#cb${id})`}>{children}</g>
    </g>
  )
}

/* Lock the fold zones: doubled stitches beside the fold, three passes at a joint */
function Lock() {
  const TP = { x: 40 - 36 * 5, y: 104, s: 5 }
  const o = SHORT({ x0: 36 })
  const holes = Array.from({ length: 13 }, (_, i) => 38 + i * 3)
  const side = (sg) => {
    const P = (x) => px(TP, x, sg * (widthAt(x, o) / 2 - 3))
    return (
      <g>
        {holes.slice(0, -1).map((x, i) => {
          const [xa, ya] = P(x)
          const [xb, yb] = P(holes[i + 1])
          const dbl = i >= holes.length - 3
          const a = [xa + (xb - xa) * 0.16, ya + 2.2]
          const b = [xb - (xb - xa) * 0.16, yb - 2.2]
          return (
            <g key={i}>
              <Thr d={`M${a[0]} ${a[1]} L${b[0]} ${b[1]}`} c={i % 2 ? TB : TA} w={2} />
              {dbl && <Thr d={`M${a[0]} ${a[1] + 3.4} L${b[0]} ${b[1] + 3.4}`} c={i % 2 ? TA : TB} w={2} />}
            </g>
          )
        })}
        {(() => {
          const [x1, y1] = P(holes[holes.length - 3])
          const [x2] = P(holes[holes.length - 1])
          return <rect x={x1 - 5} y={y1 - 9} width={x2 - x1 + 10} height={20} rx="4" fill="none" stroke={C.emerald} strokeWidth="1.2" />
        })()}
      </g>
    )
  }
  // joint section
  const x0 = 60
  const p = 44
  const y = 262
  const h = 28
  const X = (i) => x0 + i * p
  const mv = [0, 1, 2, 3, 4, { to: 3, lane: 1 }, { to: 4, lane: 2 }, 5, 6, 7].map((m) => (typeof m === 'number' ? { to: m } : m))
  const args = { X, yt: y - 2.4, yb: y + h + 2.4, mid: y + h / 2, lane: 3.6 }
  const A = route({ ...args, start: -1, side: 'b', moves: mv })
  const B = route({ ...args, start: -1, side: 't', moves: mv })
  return (
    <Fig h={340} view="Plan · buckle end" scale="plan ×5 · section ×5">
      <StrapPlan T={TP} o={o} />
      <BreakV x={px(TP, 36, 0)[0]} y1={TP.y - 50} y2={TP.y + 50} />
      <Buckle x={px(TP, 80, 0)[0]} y={TP.y} w={90} L={70} />
      {side(-1)}
      {side(1)}
      <line x1={px(TP, 77, 0)[0]} y1={TP.y - 46} x2={px(TP, 77, 0)[0]} y2={TP.y + 46} stroke={C.ruby} strokeWidth="1.4" strokeDasharray="4 3" />
      <Ld pts={[[px(TP, 71, -6.1)[0], px(TP, 71, -6.1)[1] - 9], [190, 44]]} text="doubled loops, each side" a="end" s={11} c={C.emerald} />
      <Ld pts={[[px(TP, 77, 0)[0], TP.y + 30], [212, 176]]} text="no cross-seam" a="end" s={10.5} c={C.ruby} />
      <Ld pts={[[px(TP, 80, 0)[0], TP.y - 50], [300, 44]]} text="buckle fold" s={10.5} c={C.dim} />
      <Note x={346} y={92} lines={['Last two holes', 'beside the fold', 'sewn twice:', 'nothing can', 'unravel into', 'the bend.']} s={10.5} lh={14} />

      <Sep x1={14} y1={194} x2={466} y2={194} />
      <Tag x={16} y={212}>Across a glued joint: three passes</Tag>
      <SeamBand x0={x0} p={p} n={8} y={y} h={h} />
      <path d={`M${X(3) + 8} ${y + h * 0.6} L${X(4) - 8} ${y + h}`} stroke="#3a2412" strokeWidth="1.4" />
      <GlueLine x1={X(3) + 10} x2={X(4) - 10} y={y + h * 0.8} />
      <ClipBox x={x0 - 0.75 * p} y={y - 30} w={8 * p} h={h + 60}>
        <Thr d={poly(B)} c={TB} w={2.2} />
        <Thr d={poly(A)} c={TA} w={2.2} />
      </ClipBox>
      <Ld pts={[[(X(3) + X(4)) / 2, y + h - 3], [(X(3) + X(4)) / 2 + 60, 326]]} text="glued joint" s={10.5} c={C.dim} />
      <Ld pts={[[(X(3) + X(4)) / 2, y - 10], [(X(3) + X(4)) / 2, 230]]} text="span over the joint sewn three times" a="middle" s={10.5} c={C.emerald} />
    </Fig>
  )
}

/* Backstitch: back two holes, both ends on the lining side — at both ends */
function Backstitch() {
  const x0 = 60
  const p = 62
  const y = 116
  const h = 32
  const X = (i) => x0 + i * p
  const args = { X, yt: y - 2.4, yb: y + h + 2.4, mid: y + h / 2, lane: 3.8 }
  const fwd = [0, 1, 2, 3, 4, 5].map((to) => ({ to }))
  const A = route({ ...args, start: -1, side: 'b', moves: [...fwd, { to: 4, lane: 1 }, { to: 3, lane: 1 }] })
  const B = route({ ...args, start: -1, side: 't', moves: [...fwd, { to: 4, lane: 1 }, { to: 3, lane: 1, pass: false }] })
  const yb = y + h + 2.4
  A.push([X(3) - 10, yb + 30])
  B.push([X(3) + 12, yb + 30])
  const TP = { x: 150, y: 300, s: 2.6 }
  return (
    <Fig h={350} view="Section along the seam · finishing" scale="thickness ×5 · plan ×2.6">
      <ThreadKey x={16} y={42} />
      <SeamBand x0={x0} p={p} n={6} y={y} h={h} breakR />
      <ClipBox x={x0 - 0.75 * p} y={y - 40} w={7 * p} h={h + 90}>
        <Thr d={poly(B)} c={TB} />
        <Thr d={poly(A)} c={TA} />
      </ClipBox>
      <Arrow a={[X(0), y - 30]} b={[X(5) + 4, y - 30]} c="text" w={1.2} />
      <T x={X(1)} y={y - 36} s={10.5} c={C.dim}>
        forward to the last hole
      </T>
      <Arrow a={[X(5), y - 16]} b={[X(3) - 2, y - 16]} w={1.8} />
      <T x={X(4)} y={y - 46} a="middle" s={10.5} c={C.brass} w="600">
        back 2 holes
      </T>
      <T x={24} y={y - 8} s={10} c={C.faint}>
        grain
      </T>
      <T x={24} y={y + h + 18} s={10} c={C.faint}>
        lining
      </T>
      <Ld pts={[[X(3), yb + 30], [X(3), 206]]} text="both ends finish on the lining side" a="middle" s={11} c={C.text} />
      <T x={X(3)} y={232} a="middle" s={10} c={C.faint}>
        trimmed and melted next
      </T>
      <T x={X(4)} y={yb + 22} a="middle" s={10} c={C.dim}>
        spans doubled
      </T>

      <Sep x1={14} y1={244} x2={466} y2={244} />
      <Tag x={16} y={262}>The same count at both ends of the seam</Tag>
      <StrapPlan T={TP} o={LONG()} stitch={{ mode: 'stitch', m: 3, p: 3, from: 5, w: 1.2 }} />
      {[-1, 1].map((sg) => {
        const [cx, cy] = px(TP, 9, sg * 7)
        return <rect key={sg} x={cx - 14} y={cy - 6} width={28} height={12} rx="4" fill="none" stroke={C.emerald} strokeWidth="1.3" />
      })}
      <Ld pts={[[px(TP, 9, -7)[0] - 14, px(TP, 9, -7)[1]], [120, 282]]} x={16} y={286} text="start: back 2" s={10.5} c={C.emerald} />
      <Ld pts={[[px(TP, 9, 7)[0] - 14, px(TP, 9, 7)[1]], [120, 318]]} x={16} y={322} text="end: back 2" s={10.5} c={C.emerald} />
      <T x={16} y={340} s={10} c={C.faint}>
        same count: the ends match
      </T>
      <circle cx={px(TP, 117, 0)[0]} cy={TP.y} r="11" fill="none" stroke={C.ruby} strokeWidth="1.3" />
      <T x={466} y={344} a="end" s={10.5} c={C.ruby}>
        not at the tip, not across a fold
      </T>
    </Fig>
  )
}

/* Finish the ends */
function Ends() {
  const panel = (cx, cy, kind) => {
    const lam = (
      <g>
        <Ply x1={cx - 56} x2={cx + 56} y={cy} t={11} k="lining" />
        <Ply x1={cx - 56} x2={cx + 56} y={cy + 11} t={17} />
        <BreakV x={cx - 56} y1={cy} y2={cy + 28} />
        <BreakV x={cx + 56} y1={cy} y2={cy + 28} />
        <rect x={cx - 3} y={cy - 0.5} width={6} height={29} fill={C.ground} />
        <Thr d={`M${cx - 52} ${cy + 30.5} L${cx - 3} ${cy + 30.5}`} c={TA} w={2.4} />
        <Thr d={`M${cx - 52} ${cy - 2.6} L${cx - 3} ${cy - 2.6}`} c={TB} w={2.4} />
      </g>
    )
    const stubs = (hgt, op) => (
      <g opacity={op}>
        <Thr d={`M${cx - 1.5} ${cy + 6} L${cx - 4} ${cy - hgt}`} c={TA} w={2.4} cap="butt" />
        <Thr d={`M${cx + 1.5} ${cy + 6} L${cx + 4} ${cy - hgt}`} c={TB} w={2.4} cap="butt" />
      </g>
    )
    return (
      <g>
        {lam}
        {kind === 'trim' && (
          <g>
            {stubs(16)}
            <g opacity="0.35">
              <Thr d={`M${cx - 5} ${cy - 24} L${cx - 14} ${cy - 58}`} c={TA} w={2.4} />
              <Thr d={`M${cx + 5} ${cy - 24} L${cx + 14} ${cy - 58}`} c={TB} w={2.4} />
            </g>
            <line x1={cx - 16} y1={cy - 19} x2={cx + 16} y2={cy - 19} stroke={C.ruby} strokeWidth="1" strokeDasharray="3 2" />
            <Dim a={[cx + 26, cy]} b={[cx + 26, cy - 16]} text="" />
            <T x={cx + 32} y={cy - 4} s={10} mono c={C.dim}>
              1 mm
            </T>
          </g>
        )}
        {kind === 'burn' && (
          <g>
            {stubs(16)}
            <Burner x={cx} y={cy - 17} k={0.62} />
          </g>
        )}
        {kind === 'bead' && (
          <g>
            <ellipse cx={cx} cy={cy - 3} rx="8" ry="4" fill="#e9d3a2" stroke={CASE} strokeWidth="0.9" />
            <ellipse cx={cx - 2} cy={cy - 4.5} rx="3" ry="1.2" fill="#fff6e2" opacity="0.8" />
          </g>
        )}
        {kind === 'glue' && (
          <g>
            {stubs(5)}
            <path d={`M${cx - 9} ${cy} Q${cx - 9} ${cy - 10} ${cx} ${cy - 13} Q${cx + 9} ${cy - 10} ${cx + 9} ${cy} Z`} fill="rgba(160,210,170,0.45)" stroke={C.emerald} strokeWidth="0.9" />
          </g>
        )}
        {kind === 'knot' && (
          <g>
            <path d={`M${cx - 2} ${cy} C${cx - 14} ${cy - 16} ${cx + 10} ${cy - 22} ${cx + 2} ${cy - 8} C${cx - 4} ${cy - 2} ${cx + 12} ${cy - 2} ${cx + 10} ${cy - 10}`} fill="none" stroke={CASE} strokeWidth="4" />
            <path d={`M${cx - 2} ${cy} C${cx - 14} ${cy - 16} ${cx + 10} ${cy - 22} ${cx + 2} ${cy - 8} C${cx - 4} ${cy - 2} ${cx + 12} ${cy - 2} ${cx + 10} ${cy - 10}`} fill="none" stroke={TA} strokeWidth="2.2" />
            <circle cx={cx} cy={cy + 2} r="3" fill="rgba(160,210,170,0.6)" />
          </g>
        )}
        {kind === 'lighter' && (
          <g>
            <ellipse cx={cx} cy={cy + 1} rx="22" ry="4" fill="#2a1508" opacity="0.85" />
            {stubs(8)}
            <path d={`M${cx} ${cy - 12} C${cx - 12} ${cy - 24} ${cx - 2} ${cy - 40} ${cx + 2} ${cy - 50} C${cx + 6} ${cy - 38} ${cx + 14} ${cy - 26} ${cx} ${cy - 12} Z`} fill="rgba(240,140,60,0.75)" stroke="#e36d3d" strokeWidth="0.8" />
          </g>
        )}
      </g>
    )
  }
  const cap = (x, y, a, b, c = C.text) => (
    <g>
      <T x={x} y={y} a="middle" s={11} c={c}>
        {a}
      </T>
      <T x={x} y={y + 13} a="middle" s={10} c={C.faint}>
        {b}
      </T>
    </g>
  )
  return (
    <Fig h={350} view="Detail · the thread ends, lining side up" scale="×16 · schematic">
      <Tag x={16} y={40}>Polyester</Tag>
      <Num x={20} y={70} n={1} r={7} />
      <Num x={176} y={70} n={2} r={7} />
      <Num x={332} y={70} n={3} r={7} />
      {panel(84, 120, 'trim')}
      {panel(240, 120, 'burn')}
      {panel(396, 120, 'bead')}
      {cap(84, 168, 'trim to ~1 mm', 'snips or a sharp blade')}
      {cap(240, 168, 'thread burner', 'touch, don’t hold')}
      {cap(396, 168, 'a small bead', 'pressed flat, can’t pull back')}
      <Ld pts={[[396 - 50, 116], [330, 96]]} x={326} y={92} text="lining" a="end" s={10} c={C.dim} />

      <Sep x1={14} y1={196} x2={466} y2={196} />
      <Tag x={16} y={214}>Linen, and the alternatives</Tag>
      {panel(84, 268, 'glue')}
      {panel(240, 268, 'knot')}
      {panel(396, 268, 'lighter')}
      {cap(84, 316, 'linen: a drop of glue', 'it won’t melt')}
      {cap(240, 316, 'half-knot + superglue', 'a touch drawn into the hole')}
      {cap(396, 316, 'not a lighter', 'it scorches the leather', C.ruby)}
      <Verdict x={452} y={226} ok={false} r={8} />
    </Fig>
  )
}

/* Set the seam: hammer the stitches flat on marble */
function SetSeam() {
  const y = 190
  const tt = 9
  const tl = 6
  return (
    <Fig h={330} view="Side view & sections · setting the seam" scale="schematic · sections ×5">
      <rect x={20} y={y + tt + tl} width={256} height={30} rx="2" fill="#d6d1c8" stroke="#8d877c" strokeWidth="0.9" />
      <path d={`M30 ${y + tt + tl + 8} q40 10 80 2 t90 8 M60 ${y + tt + tl + 24} q50 -8 110 0 t90 -6`} fill="none" stroke="#a8a196" strokeWidth="1" />
      <Lam x1={30} x2={266} y={y} t={tt} l={tl} breakL breakR />
      {Array.from({ length: 16 }, (_, i) => (
        <ellipse key={i} cx={40 + i * 14.4} cy={y - 1.6} rx="5" ry="1.9" fill={i % 2 ? TB : TA} stroke={CASE} strokeWidth="0.6" />
      ))}
      <Hammer x={160} y={y - 10} />
      <Arrow a={[132, y - 50]} b={[132, y - 18]} />
      <Ld pts={[[171, y - 26], [196, 112]]} text="polished hammer face" sub="light, even taps along the seam" s={10.5} />
      <Ld pts={[[70, y - 3], [70, 140]]} text="stitches" a="middle" s={10.5} />
      <Ld pts={[[230, y + tt + tl + 15], [230, 270]]} text="marble slab" sub="hard, flat, smooth" a="middle" s={10.5} />

      <Sep x1={290} y1={30} x2={290} y2={320} />
      <Tag x={302} y={44}>Before</Tag>
      <SeamBand x0={330} p={36} n={4} y={94} h={22} holeW={6} />
      <SeamThreads x0={330} p={36} y={94} h={22} done={3} r={3.4} w={2.8} />
      <T x={384} y={146} a="middle" s={10.5} c={C.dim}>
        stitch stands proud,
      </T>
      <T x={384} y={159} a="middle" s={10} c={C.faint}>
        holes still open
      </T>
      <Tag x={302} y={190}>After</Tag>
      <SeamBand x0={330} p={36} n={4} y={238} h={22} holeW={2.4} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${330 + i * 36 + 4} 238 q14 2.4 28 0`} fill="none" stroke="#5c3a1c" strokeWidth="1" />
      ))}
      <SeamThreads x0={330} p={36} y={238} h={22} done={3} r={0.4} w={2} />
      <T x={384} y={290} a="middle" s={10.5} c={C.emerald}>
        bedded in the surface,
      </T>
      <T x={384} y={303} a="middle" s={10} c={C.faint}>
        holes closed round the thread
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* T11 · Adjustment holes & the tongue slot                             */
/* ================================================================== */

/* Mark the centreline: dividers from both edges */
function Centre() {
  const s = 12
  const w = 18.5
  const cx = 240
  const x1 = cx - (w / 2) * s
  const x2 = cx + (w / 2) * s
  const y = 140
  const tt = 1.1 * s
  const tl = 0.7 * s
  const set = 8 * s
  const m1 = x1 + set
  const m2 = x2 - set
  const sec = (
    <g>
      <Lam x1={x1} x2={x2} y={y} t={tt} l={tl} />
      {[m1, m2].map((m) => (
        <path key={m} d={`M${m - 2.5} ${y} L${m} ${y + 2.5} L${m + 2.5} ${y}`} fill={C.hole} />
      ))}
      <line x1={cx} y1={y - 14} x2={cx} y2={y + tt + tl + 14} stroke={C.steel} strokeWidth="0.9" strokeDasharray="6 3 1.5 3" />
    </g>
  )
  const TP = { x: 40 - 46 * 3.6, y: 294, s: 3.6 }
  const o = LONG({ x0: 46 })
  const line = (sg) =>
    poly(
      Array.from({ length: 12 }, (_, i) => {
        const x = 48 + i * 5
        return px(TP, x, sg * (widthAt(x, o) / 2 - 8))
      })
    )
  return (
    <Fig h={340} view="Finding the centre" scale="section ×12 · plan ×3.6">
      {sec}
      <Divs h={[x1 + set / 2, 46]} p1={[x1 - 2.2, y + 5]} p2={[m1, y + 1]} round1 />
      <Divs ghost h={[x2 - set / 2, 46]} p1={[x2 + 2.2, y + 5]} p2={[m2, y + 1]} />
      <T x={16} y={48} s={10.5} c={C.text}>
        1 · from the left edge
      </T>
      <T x={466} y={48} a="end" s={10.5} c={C.steel}>
        2 · then from the right
      </T>
      <Dim a={[x1, y + tt + tl]} b={[m1, y + tt + tl]} off={14} text="set ≈ half" flip />
      <Ld pts={[[cx, y + tt + tl + 14], [cx, 196]]} text="true centre: midway" sub="between the two marks" a="middle" s={10.5} c={C.steel} />
      <Inset src={[cx, y + 1]} k={2.4} at={[412, 166]} r={40}>
        {sec}
      </Inset>
      <T x={412} y={222} a="middle" s={10} c={C.faint}>
        two light marks
      </T>

      <Sep x1={14} y1={238} x2={466} y2={238} />
      <Tag x={16} y={254}>Plan · scribed from each edge</Tag>
      <StrapPlan T={TP} o={o} centre />
      <BreakV x={px(TP, 46, 0)[0]} y1={TP.y - 37} y2={TP.y + 37} />
      <path d={line(-1)} fill="none" stroke={C.text} strokeWidth="0.9" strokeDasharray="1.5 2" />
      <path d={line(1)} fill="none" stroke={C.text} strokeWidth="0.9" strokeDasharray="1.5 2" />
      {holeXs(120).map((x) => (
        <circle key={x} cx={px(TP, x, 0)[0]} cy={TP.y} r="4" fill="none" stroke={C.text} strokeWidth="0.9" strokeDasharray="2 1.5" />
      ))}
      <Ld pts={[px(TP, 100, -1), [350, 272]]} text="line from one edge" s={10.5} />
      <Ld pts={[[px(TP, 112, 0)[0], TP.y], [350, 296]]} x={354} y={300} text="centreline, midway" s={10.5} c={C.steel} />
      <Ld pts={[px(TP, 100, 1), [350, 320]]} text="line from the other" s={10.5} />
      <T x={466} y={338} a="end" s={10} c={C.faint}>
        dashed circles: hole centres, next step
      </T>
    </Fig>
  )
}

/* Position from a template */
function Position() {
  const TP = { x: 40 - 40 * 3.4, y: 104, s: 3.4 }
  const o = LONG({ x0: 40 })
  const xs = holeXs(120)
  const card = offset(outline(LONG({ x0: 44 })), -0.8)
  return (
    <Fig h={340} view="Transferring the holes" scale="plan ×3.4 · section schematic">
      <StrapPlan T={TP} o={o} centre />
      <BreakV x={px(TP, 40, 0)[0]} y1={TP.y - 38} y2={TP.y + 38} />
      <path d={pathOf(card, TP)} fill="rgba(236,226,204,0.22)" stroke={C.text} strokeWidth="1" strokeDasharray="5 3" />
      {xs.map((x, i) => {
        const [hx, hy] = px(TP, x, 0)
        const done = i >= 3
        return (
          <g key={x}>
            <circle cx={hx} cy={hy} r="4.2" fill="none" stroke={C.text} strokeWidth="1" />
            {done && <circle cx={hx} cy={hy} r="1.6" fill={C.hole} />}
            {i === 2 && <circle cx={hx} cy={hy} r="8" fill="none" stroke={C.brass} strokeWidth="1.4" />}
          </g>
        )
      })}
      <Dim a={px(TP, xs[1], 0)} b={px(TP, xs[0], 0)} off={-42} text="7" flip />
      <Dim a={px(TP, xs[0], 0)} b={px(TP, 120, 0)} off={42} text="25" flip />
      <Ld pts={[px(TP, 60, -9.7), [140, 46]]} text="card template, held or glued" a="end" s={10.5} />
      <Ld pts={[[px(TP, xs[4], 0)[0], TP.y + 4], [150, 170]]} text="centres pricked" a="end" s={10.5} />
      <Ld pts={[[px(TP, xs[2], 0)[0] + 6, TP.y - 6], [330, 46]]} text="pricking this one" s={10.5} c={C.brass} />

      <Sep x1={14} y1={190} x2={466} y2={190} />
      <Tag x={16} y={208}>Section · awl through card</Tag>
      <Slab x={24} y={292} w={200} h={12} kind="pad" />
      <Lam x1={28} x2={220} y={276} t={9} l={7} breakL breakR />
      <rect x={28} y={272} width={192} height={4} fill="#ece2cc" stroke="#9c927e" strokeWidth="0.5" />
      <rect x={120} y={271.5} width={8} height={5} fill={C.ground} />
      <path d="M121 276 L124 279 L127 276" fill={C.hole} />
      <Awl kind="round" x={124} y={278} k={0.6} />
      <Ld pts={[[60, 274], [60, 236]]} text="card" a="middle" s={10.5} />
      <Ld pts={[[180, 280], [180, 324]]} x={184} y={328} text="a prick in the grain" s={10.5} c={C.dim} />

      <Sep x1={240} y1={200} x2={240} y2={334} />
      <Tag x={254} y={208}>Freehand</Tag>
      <Verdict x={330} y={204} ok={false} r={8} />
      <rect x={256} y={240} width={208} height={44} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <line x1={256} y1={262} x2={464} y2={262} stroke={C.steel} strokeWidth="0.8" strokeDasharray="6 3 1.5 3" />
      {[
        [276, 0],
        [301, 1],
        [323, 2],
        [350, 2.5],
        [372, 3.5],
        [399, 4],
        [420, 5],
      ].map(([x, d], i) => (
        <circle key={i} cx={x} cy={262 + d} r="2.4" fill={C.hole} stroke="#e7c48f" strokeWidth="0.5" />
      ))}
      <T x={360} y={304} a="middle" s={10.5} c={C.ruby}>
        pitch wanders, holes drift off centre
      </T>
    </Fig>
  )
}

/* Pick the punch: equal to or a little larger than the tongue */
function PunchSize() {
  const k = 14
  const tw = 1.7
  const sizes = [
    [1.5, false, 'too tight', 'stretches, tears'],
    [1.8, true, 'factory size', 'common'],
    [2.0, true, 'a touch over', 'easy fit'],
  ]
  return (
    <Fig h={340} view="Detail · tongue and hole" scale="true scale ×14">
      <Tag x={16} y={44}>Measure the tongue</Tag>
      <path d={`M24 ${110 - (tw * k) / 2} L150 ${110 - (tw * k) / 2} Q${150 + tw * k * 0.7} 110 150 ${110 + (tw * k) / 2} L24 ${110 + (tw * k) / 2} Z`} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
      <BreakV x={24} y1={110 - (tw * k) / 2} y2={110 + (tw * k) / 2} />
      <Dim a={[110, 110 - (tw * k) / 2]} b={[110, 110 + (tw * k) / 2]} off={0} text="" />
      <T x={116} y={82} s={11} mono c={C.text}>
        1.7
      </T>
      <ellipse cx={194} cy={110} rx={(tw * k) / 2} ry={(1.3 * k) / 2} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
      <T x={194} y={144} a="middle" s={10} c={C.faint}>
        its section
      </T>
      <Note x={16} y={164} lines={['Tongues run 1.0–3.0 mm:', 'measure the one you’ll use.']} s={10.5} lh={14} />

      <Sep x1={226} y1={30} x2={226} y2={204} />
      <Tag x={238} y={44}>Hole Ø against a 1.7 mm tongue</Tag>
      {sizes.map(([d, ok, a, b], i) => {
        const cx = 268 + i * 82
        return (
          <g key={d}>
            <circle cx={cx} cy={106} r={(d * k) / 2} fill={C.hole} stroke="#e7c48f" strokeWidth="0.8" />
            <ellipse cx={cx} cy={106} rx={(tw * k) / 2} ry={(1.3 * k) / 2} fill="none" stroke={ok ? '#cfdbe3' : C.ruby} strokeWidth="1.1" strokeDasharray="3 2" />
            <T x={cx} y={84 - (d * k) / 2 + 6} a="middle" s={11} mono c={ok ? C.text : C.ruby} w="600">
              Ø {d.toFixed(1)}
            </T>
            <Verdict x={cx} y={146} ok={ok} r={8} />
            <T x={cx} y={172} a="middle" s={10.5} c={ok ? C.emerald : C.ruby}>
              {a}
            </T>
            <T x={cx} y={185} a="middle" s={10} c={C.faint}>
              {b}
            </T>
          </g>
        )
      })}

      <Sep x1={14} y1={210} x2={466} y2={210} />
      <Tag x={16} y={228}>Round cutting punches · 1.5 – 2.0 mm</Tag>
      {sizes.map(([d], i) => (
        <g key={d}>
          <Punch x={110 + i * 130} y={318} d={d * 8} k={1} />
          <T x={110 + i * 130 + 26} y={312} s={10.5} mono c={C.dim}>
            {d.toFixed(1)}
          </T>
        </g>
      ))}
      <T x={466} y={334} a="end" s={10} c={C.faint}>
        punch glyphs ×8
      </T>
    </Fig>
  )
}

/* Set the pitch: 5, 6, 7 mm */
function Pitch() {
  const rows = [
    [5, 'Instructables'],
    [6, 'Delugs'],
    [7, 'Decocuir'],
  ]
  return (
    <Fig h={340} view="Plan · three pitches compared" scale="×3">
      {rows.map(([p, src], i) => {
        const TP = { x: 330 - 120 * 3, y: 80 + i * 92, s: 3 }
        const xs = holeXs(120, { n: 7, pitch: p, fromTip: 25 })
        const course = p >= 6
        return (
          <g key={p}>
            <StrapPlan T={TP} o={LONG({ x0: 44 })} holes={{ n: 7, pitch: p, fromTip: 25 }} centre />
            <BreakV x={px(TP, 44, 0)[0]} y1={TP.y - 30} y2={TP.y + 30} />
            <T x={16} y={TP.y} s={13} c={course ? C.brass : C.text} w="600">
              {p} mm
            </T>
            <T x={16} y={TP.y + 14} s={10} c={C.faint}>
              {src}
            </T>
            <Dim a={px(TP, xs[1], 0)} b={px(TP, xs[0], 0)} off={-34} text={String(p)} flip />
            <Dim a={px(TP, xs[6], 0)} b={px(TP, xs[0], 0)} off={34} text={`${6 * p}`} flip />
            {i === 0 && <Dim a={px(TP, xs[0], 0)} b={px(TP, 120, 0)} off={34} text="25" flip />}
            <T x={346} y={TP.y + 4} s={10.5} c={C.dim}>
              range {6 * p} mm
            </T>
          </g>
        )
      })}
      <path d="M432 140 H442 V292 H432" fill="none" stroke={C.brass} strokeWidth="1.2" />
      <T x={448} y={212} s={10.5} c={C.brass}>
        this
      </T>
      <T x={448} y={225} s={10.5} c={C.brass}>
        course
      </T>
      <T x={16} y={336} s={10} c={C.faint}>
        ½ in (12.7 mm) is also seen: very coarse. Range = the 6 gaps between 7 holes.
      </T>
    </Fig>
  )
}

/* Count and position: seven holes, middle at wrist size, last 25 mm from the tip */
function Count() {
  const TP = { x: 48, y: 100, s: 3.2 }
  const xs = holeXs(120)
  const ordered = [...xs].reverse() // lug side → tip
  const T2 = { x: 48, y: 268, s: 2.4 }
  const xs9 = holeXs(130, { n: 9, pitch: 7 })
  return (
    <Fig h={340} view="Plan · long piece" scale="×3.2 · lower ×2.4">
      <StrapPlan T={TP} o={LONG()} holes={{ xs, ring: null }} centre />
      <SpringBar x={48} y1={TP.y - 36} y2={TP.y + 36} r={2.6} />
      {ordered.map((x, i) => {
        const [hx] = px(TP, x, 0)
        return (
          <T key={x} x={hx} y={TP.y - 40} a="middle" s={10.5} mono c={i === 3 ? C.emerald : C.dim}>
            {i + 1}
          </T>
        )
      })}
      <circle cx={px(TP, ordered[3], 0)[0]} cy={TP.y} r="8" fill="none" stroke={C.emerald} strokeWidth="1.5" />
      <Ld pts={[[px(TP, ordered[3], 0)[0], TP.y + 8], [px(TP, ordered[3], 0)[0], 160]]} text="middle hole = the wearer’s size" a="middle" s={11} c={C.emerald} />
      <Arrow a={[px(TP, ordered[3], 0)[0] - 12, 186]} b={[px(TP, ordered[0], 0)[0], 186]} c="text" w={1.2} />
      <Arrow a={[px(TP, ordered[3], 0)[0] + 12, 186]} b={[px(TP, ordered[6], 0)[0], 186]} c="text" w={1.2} />
      <T x={px(TP, ordered[1], 0)[0]} y={202} a="middle" s={10} c={C.dim}>
        3 tighter
      </T>
      <T x={px(TP, ordered[5], 0)[0]} y={202} a="middle" s={10} c={C.dim}>
        3 looser
      </T>
      <Dim a={px(TP, ordered[6], 0)} b={px(TP, 120, 0)} off={42} text="25 to the tip" flip />
      <Dim a={px(TP, ordered[0], 0)} b={px(TP, ordered[1], 0)} off={42} text="7" flip />
      <T x={48} y={146} s={10.5} c={C.dim}>
        lug end
      </T>

      <Sep x1={14} y1={216} x2={466} y2={216} />
      <Tag x={16} y={234}>Large men’s wrist: nine or ten</Tag>
      <StrapPlan T={T2} o={LONG({ x1: 130, taper: [8, 110] })} holes={{ xs: xs9 }} centre />
      <T x={48 + 136 * 2.4} y={272} s={10.5} c={C.dim}>
        9 holes, same pitch
      </T>
      <T x={16} y={324} s={10} c={C.faint}>
        Seven is standard (women’s, most men’s); the long piece grows to carry the extra holes.
      </T>
    </Fig>
  )
}

/* Punch: a cutting punch, on a pad, aligned, one square blow */
function PunchStrike() {
  const y = 238
  const scene = (
    <g>
      <Slab x={20} y={y + 16} w={210} h={14} kind="pad" />
      <Lam x1={26} x2={224} y={y} t={9} l={7} breakL breakR />
    </g>
  )
  return (
    <Fig h={340} view="Side view & sections · punching" scale="schematic · sections ×10">
      {scene}
      <line x1={120} y1={70} x2={120} y2={y + 32} stroke={C.steel} strokeWidth="0.8" strokeDasharray="6 3 1.5 3" />
      <Punch x={120} y={y} d={16} />
      <Mallet x={120} y={y - 64 - 18} k={0.85} />
      <Arrow a={[88, 104]} b={[88, 136]} />
      <Ld pts={[[133, 200], [170, 170]]} text="cutting punch" sub="Ø 1.5–2 mm, sharp" s={10.5} />
      <Ld pts={[[120, y + 3], [64, 210]]} x={16} y={198} text="on the" s={10.5} />
      <T x={16} y={211} s={10.5} c={C.text}>
        mark
      </T>
      <T x={150} y={92} s={10.5} c={C.brass}>
        one square blow
      </T>
      <Ld pts={[[200, y + 22], [200, 300]]} text="pad" a="middle" s={10.5} c={C.dim} />
      <T x={120} y={322} a="middle" s={10} c={C.faint}>
        plumb: tilt it and the hole goes oval
      </T>

      <Sep x1={246} y1={30} x2={246} y2={330} />
      <Tag x={258} y={44}>Cutting punch</Tag>
      <Verdict x={360} y={40} ok r={8} />
      <Lam x1={262} x2={410} y={74} t={11} l={8} breakL breakR />
      <rect x={326} y={73.5} width={20} height={20} fill={C.ground} />
      <g transform="translate(428 70)">
        <rect x={-8} y={0} width={16} height={11} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />
        <rect x={-8} y={11} width={16} height={8} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.6" />
      </g>
      <T x={428} y={108} a="middle" s={10} c={C.dim}>
        plug out
      </T>
      <circle cx={336} cy={140} r="10" fill={C.hole} stroke="#e7c48f" strokeWidth="0.8" />
      <T x={360} y={144} s={10.5} c={C.emerald}>
        clean, round, open
      </T>
      <T x={262} y={124} s={10} c={C.faint}>
        straight walls
      </T>

      <Tag x={258} y={192}>Piercing (awl, nail)</Tag>
      <Verdict x={410} y={188} ok={false} r={8} />
      <Lam x1={262} x2={410} y={222} t={11} l={8} breakL breakR />
      <path d={`M326 222 L334 238 L334 241 L326 241 Z M346 222 L338 238 L338 241 L346 241 Z`} fill="#8c5f30" />
      <rect x={333} y={221.5} width={6} height={20} fill={C.ground} />
      <path d="M330 241 l4 8 M342 241 l-4 8" stroke="#c99b62" strokeWidth="1.4" />
      <path d={Array.from({ length: 13 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        const r = i % 2 ? 4 : 8
        return `${i ? 'L' : 'M'}${336 + Math.cos(a) * r} ${288 + Math.sin(a) * r}`
      }).join(' ')} fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />
      <T x={360} y={292} s={10.5} c={C.ruby}>
        torn, closes up
      </T>
      <T x={262} y={268} s={10} c={C.faint}>
        fibres pushed down
      </T>
    </Fig>
  )
}

/* Cut the slot: centred on the buckle fold */
function SlotCut() {
  const TP = { x: 40 - 52 * 4.4, y: 92, s: 4.4 }
  const o = SHORT({ x0: 52, x1: 105 })
  const k = 12
  const step = (cx, n) => {
    const cy = 276
    const r = 1 * k
    const half = 5 * k
    const ax = cx - half + r
    const bx = cx + half - r
    return (
      <g>
        <rect x={cx - 70} y={cy - 30} width={140} height={60} rx="3" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
        {n === 3 ? (
          <rect x={cx - half} y={cy - r} width={2 * half} height={2 * r} rx={r} fill={C.hole} stroke="#e7c48f" strokeWidth="0.7" />
        ) : (
          <g>
            <circle cx={ax} cy={cy} r={r} fill={C.hole} stroke="#e7c48f" strokeWidth="0.7" />
            <circle cx={bx} cy={cy} r={r} fill={C.hole} stroke="#e7c48f" strokeWidth="0.7" />
          </g>
        )}
        {n === 2 && (
          <g>
            <line x1={ax} y1={cy - r} x2={bx} y2={cy - r} stroke={C.ruby} strokeWidth="1.2" strokeDasharray="3 2" />
            <line x1={ax} y1={cy + r} x2={bx} y2={cy + r} stroke={C.ruby} strokeWidth="1.2" />
            <Knife kind="utility" x={cx + 6} y={cy + r} ang={-24} k={0.5} />
          </g>
        )}
        <Num x={cx - 60} y={cy - 40} n={n} r={7} />
      </g>
    )
  }
  return (
    <Fig h={340} view="Plan · buckle end, fold still open" scale="plan ×4.4 · steps ×12">
      <StrapPlan T={TP} o={o} zones={[{ from: 83, to: 105, k: 'skiveR' }]} folds={[{ x: 80, label: 'buckle fold' }]} slot={{ x: 80, len: 10, w: 2 }} />
      <BreakV x={px(TP, 52, 0)[0]} y1={TP.y - 46} y2={TP.y + 46} />
      <Dim a={px(TP, 75, 0)} b={px(TP, 85, 0)} off={54} text="10" flip />
      <Ld pts={[px(TP, 82, 0), [292, 92]]} text="slot ≈ 10 mm × tongue width" sub="centred on the fold: 5 mm each side" s={10.5} />
      <Ld pts={[px(TP, 95, 6), [292, 140]]} text="skived flap" s={10.5} c={C.dim} />
      <Punch kind="oblong" d={10} x={436} y={176} k={0.85} />
      <T x={300} y={178} s={10.5} c={C.dim}>
        or one blow of a
      </T>
      <T x={300} y={191} s={10.5} c={C.dim}>
        2–3 mm oblong punch
      </T>

      <Sep x1={14} y1={204} x2={466} y2={204} />
      <Tag x={16} y={220}>Round hole at each end, cut between</Tag>
      {step(88, 1)}
      {step(240, 2)}
      {step(392, 3)}
      <T x={88} y={326} a="middle" s={10.5} c={C.text}>
        two holes, Ø = tongue
      </T>
      <T x={240} y={326} a="middle" s={10.5} c={C.text}>
        knife along the tangents
      </T>
      <T x={392} y={326} a="middle" s={10.5} c={C.text}>
        a clean slot, 10 mm
      </T>
    </Fig>
  )
}

/* Check the tongue before the fold is glued */
function TongueCheck() {
  const x2 = 330
  const y = 150
  const s = 4
  const kk = 10
  const T0 = 1.1 * kk
  const rb = 1.1 * kk
  const cy = y + T0 + rb
  const L = 15 * s
  const ft = Math.max(3, rb * 0.55)
  const tongue = `M${x2} ${cy} Q${x2 + L * 0.25} ${cy - rb - T0 - 3} ${x2 + L * 0.55} ${cy - rb - T0 - 2} L${x2 + L - ft * 0.2} ${cy - ft * 1.4}`
  return (
    <Fig h={340} view="Side view · buckle end" scale="thickness ×3 · insets ×8">
      <StrapSection x1={110} x2={x2} y={y} s={s} k={kk} left={{ kind: 'break' }} right={{ kind: 'buckle' }} />
      <path d={`M${x2 + 5} ${cy - rb - 2} l6 -14`} stroke={C.ground} strokeWidth="6" />
      <path d={tongue} fill="none" stroke="#d9e3e9" strokeWidth="2.6" strokeLinecap="round" />
      <g transform={`rotate(-34 ${x2} ${cy})`}>
        <path d={tongue} fill="none" stroke="#d9e3e9" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.8" />
      </g>
      <Arrow d={`M${x2 + 66} ${cy - 30} A70 70 0 0 0 ${x2 + 44} ${cy - 66}`} c="emerald" w={1.4} both />
      <NoGlueBand x1={234} x2={300} y={y + T0 + 2} />
      <Ld pts={[[x2 + 46, cy - 64], [420, 96]]} x={466} y={88} text="swings freely" a="end" s={10.5} c={C.emerald} />
      <Ld pts={[[x2 + 7, cy - rb - 8], [280, 120]]} text="tongue through the slot" a="end" s={10.5} />
      <Ld pts={[[264, y + T0 + 3], [240, 232]]} text="flap not glued yet" a="end" s={10.5} c={C.ruby} />
      <Ld pts={[[x2, cy], [x2 - 6, 244]]} text="buckle bar" a="middle" s={10.5} c={C.dim} />
      <T x={110} y={64} s={11} c={C.text} w="600">
        Fit the buckle before the fold is glued
      </T>

      <Sep x1={14} y1={262} x2={466} y2={262} />
      {[0, 1].map((i) => {
        const cx = 90 + i * 220
        const half = i ? 26 : 40
        return (
          <g key={i}>
            <rect x={cx - 64} y={276} width={128} height={44} rx="3" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
            <rect x={cx - half} y={290} width={2 * half} height={16} rx="8" fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />
            <rect x={cx - 22} y={292} width={56} height={12} rx="6" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.6" transform={`rotate(${i ? 0 : -10} ${cx} 298)`} />
            <Verdict x={cx + 78} y={290} ok={!i} r={8} />
            <T x={cx + 92} y={294} s={10.5} c={i ? C.ruby : C.emerald}>
              {i ? 'grips:' : 'clears'}
            </T>
            <T x={cx + 92} y={307} s={10} c={C.faint}>
              {i ? 'lengthen it' : 'all round'}
            </T>
          </g>
        )
      })}
    </Fig>
  )
}

// No-glue hatch band (local; thin variant of parts' NoGlue).
const NoGlueBand = ({ x1, x2, y }) => <rect x={x1} y={y - 3} width={x2 - x1} height={6} fill="url(#sk-noglue)" stroke={C.ruby} strokeWidth="0.6" strokeDasharray="2 2" />

/* ================================================================== */
/* T12 · Keepers                                                        */
/* ================================================================== */

// Keeper loop seen end-on round a stack of straps: inner box (x, y, w, h),
// keeper thickness kt; `joint` marks the butt at the bottom centre.
function Loop({ x, y, w, h, kt = 10, gap = 0, joint = 'butt', op }) {
  const g = gap
  const o = kt / 2
  const d = `M${x - g - o + 6} ${y - g - o} H${x + w + g + o - 6} Q${x + w + g + o} ${y - g - o} ${x + w + g + o} ${y - g - o + 6} V${y + h + g + o - 6} Q${x + w + g + o} ${y + h + g + o} ${x + w + g + o - 6} ${y + h + g + o} H${x - g - o + 6} Q${x - g - o} ${y + h + g + o} ${x - g - o} ${y + h + g + o - 6} V${y - g - o + 6} Q${x - g - o} ${y - g - o} ${x - g - o + 6} ${y - g - o} Z`
  const jx = x + w / 2
  const jy = y + h + g + o
  return (
    <g opacity={op}>
      <path d={d} fill="none" stroke="#4a3018" strokeWidth={kt + 1.6} />
      <path d={d} fill="none" stroke={C.top} strokeWidth={kt} />
      <path d={d} fill="none" stroke={C.topEdge} strokeWidth="0.8" opacity="0.6" transform={`translate(0 ${-kt * 0.32})`} />
      {joint === 'butt' && <line x1={jx} y1={jy - o - 1} x2={jx} y2={jy + o + 1} stroke={CASE} strokeWidth="1.4" />}
      {joint === 'butt' && (
        <g>
          {[-1, 1].map((sg) => (
            <path key={sg} d={`M${jx - 5} ${jy + sg * 2.5} L${jx + 5} ${jy - sg * 2.5}`} stroke={TA} strokeWidth="1.4" />
          ))}
        </g>
      )}
      {joint === 'lap' && <path d={`M${jx - 12} ${jy - o} L${jx + 12} ${jy + o}`} stroke={CASE} strokeWidth="1.2" />}
    </g>
  )
}

// Two straps stacked in section (long over short), width w, each t thick.
function Stack({ x, y, w, t }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={t} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.7" />
      <rect x={x} y={y + t} width={w} height={t} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.7" />
    </g>
  )
}

/* Cut the strip: 5 mm, along the backbone */
function KeeperStrip() {
  const k = 6
  const panel = 'M40 62 L360 58 L364 172 L44 176 Q30 120 40 62 Z'
  return (
    <Fig h={340} view="Plan · cutting keeper strips" scale="×6">
      <path d={panel} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <line x1={44} y1={146} x2={362} y2={146} stroke="#3a2412" strokeWidth="1" />
      <Rule x={44} y={116} len={330} s={k} w={22} side="above" />
      <line x1={44} y1={116} x2={250} y2={116} stroke="#3a2412" strokeWidth="1" />
      <Knife kind="utility" x={250} y={116} ang={30} k={0.8} />
      <Arrow a={[262, 132]} b={[312, 132]} w={1.4} />
      {[0, 1].map((i) => (
        <g key={i}>
          <rect x={44 + i * 6} y={196 + i * 40} width={318} height={5 * k} rx="1" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
          <Dim a={[370 + i * 6, 196 + i * 40]} b={[370 + i * 6, 196 + i * 40 + 5 * k]} text="" />
          <T x={378 + i * 6} y={196 + i * 40 + 19} s={10.5} mono c={C.dim}>
            5
          </T>
        </g>
      ))}
      <Arrow a={[60, 40]} b={[340, 40]} c="text" w={1.2} both />
      <T x={200} y={34} a="middle" s={10.5} c={C.text}>
        backbone direction: the strip runs along it
      </T>
      <Ld pts={[[150, 140], [150, 186]]} x={154} y={190} text="next strip" s={10} c={C.dim} />
      <T x={60} y={109} s={10} c="#2f3b42">
        steel rule
      </T>
      <T x={44} y={300} s={10.5} c={C.text}>
        Two strips cut: 5 mm wide, square ends, the length comes later.
      </T>

      <Tag x={400} y={60}>Commercial</Tag>
      {[4, 5, 6].map((w, i) => (
        <g key={w}>
          <rect x={404 + i * 22} y={78} width={w * 3} height={92} rx="1" fill="url(#sk-top)" stroke={w === 5 ? C.brass : '#5c3c1d'} strokeWidth={w === 5 ? 1.4 : 0.8} />
          <T x={404 + i * 22 + (w * 3) / 2} y={186} a="middle" s={10.5} mono c={w === 5 ? C.brass : C.dim}>
            {w}
          </T>
        </g>
      ))}
      <T x={436} y={202} a="middle" s={10} c={C.faint}>
        4–6 mm (×3)
      </T>
      <XSec cx={160} y={318} w={5 * 12} layers={[{ k: 'top', t: 2 * 12 }]} edge="square" />
      <T x={200} y={332} s={10} c={C.faint}>
        section ×12: 5 × ~2 mm, before thinning
      </T>
    </Fig>
  )
}

/* Split thin: ~1.2 mm */
function KeeperSplit() {
  const k = 12
  const y = 204 // glass top
  const t1 = 1.2 * k
  const t0 = 2.0 * k
  const xc = 262
  const body = `M30 ${y} L440 ${y} L440 ${y - t0} L${xc + 10} ${y - t0} L${xc} ${y - t1} L30 ${y - t1} Z`
  return (
    <Fig h={340} view="Side view · thinning the strip" scale="thickness ×12 · schematic">
      <Slab x={20} y={y} w={430} h={14} kind="glass" />
      <path d={body} fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="0.8" />
      <rect x={30} y={y - 4} width={410} height={4} fill="#8c5f30" opacity="0.8" />
      <path d={`M${xc} ${y - t1} Q${xc - 12} ${y - t1 - 22} ${xc - 34} ${y - t1 - 26} L${xc - 36} ${y - t1 - 18} Q${xc - 16} ${y - t1 - 14} ${xc + 2} ${y - t1 - 2} Z`} fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="0.8" />
      <Knife kind="skive" x={xc + 2} y={y - t1 + 1} ang={-78} k={0.9} />
      <Arrow a={[300, y - 70]} b={[240, y - 70]} />
      <Dim a={[150, y - t1]} b={[150, y]} off={0} text="" />
      <T x={150} y={y - t1 - 6} a="middle" s={10.5} mono c={C.brass}>
        1.2
      </T>
      <Dim a={[420, y - t0]} b={[420, y]} off={0} text="" />
      <T x={414} y={y - t0 - 6} a="end" s={10.5} mono c={C.dim}>
        ~2.0 as cut
      </T>
      <Ld pts={[[xc - 30, y - t1 - 22], [180, 120]]} text="flesh shaving" a="end" s={10.5} c={C.dim} />
      <Ld pts={[[xc + 30, y - t1 - 60], [330, 92]]} text="skiving knife, near flat" s={10.5} />
      <Ld pts={[[120, y - 2], [120, 252]]} text="grain side down" a="middle" s={10.5} c={C.dim} />
      <Ld pts={[[380, y + 7], [380, 252]]} text="glass" a="middle" s={10.5} c={C.dim} />
      <T x={466} y={44} a="end" s={10.5} c={C.dim}>
        or through a splitter
      </T>

      <Sep x1={14} y1={278} x2={466} y2={278} />
      <XSec cx={80} y={302} w={5 * 12} layers={[{ k: 'top', t: 1.2 * 12 }]} edge="square" />
      <Dim a={[50, 320]} b={[110, 320]} off={10} text="5" flip />
      <T x={130} y={312} s={10.5} c={C.text}>
        finished strip: 5 × ~1.2 mm, even along its length —
      </T>
      <T x={130} y={326} s={10.5} c={C.faint}>
        a thin spot becomes the weak point of the loop
      </T>
    </Fig>
  )
}

/* Size the length: butt keeper = 4t + 2w */
function KeeperLength() {
  const k = 9
  const w = 16 * k
  const t = 2 * k
  const x = 50
  const y = 92
  const seg = [
    ['w', 16, 'top'],
    ['2t', 4, 'side'],
    ['w', 16, 'bottom'],
    ['2t', 4, 'side'],
  ]
  const sx = 40
  const sk = 10
  let acc = sx
  return (
    <Fig h={340} view="Section across both straps · keeper length" scale="×9 · strip ×10">
      <Stack x={x} y={y} w={w} t={t} />
      <Loop x={x} y={y} w={w} h={2 * t} kt={1.2 * k} />
      <T x={x + w / 2} y={y + t / 2 + 4} a="middle" s={10} c={C.text}>
        long piece
      </T>
      <T x={x + w / 2} y={y + t * 1.5 + 4} a="middle" s={10} c={C.text}>
        short piece
      </T>
      <Dim a={[x, y - 14]} b={[x + w, y - 14]} off={-8} text="w = 16" flip />
      <Dim a={[x + w + 20, y]} b={[x + w + 20, y + t]} off={-4} text="" />
      <Dim a={[x + w + 20, y + t]} b={[x + w + 20, y + 2 * t]} off={-4} text="" />
      <T x={x + w + 30} y={y + t / 2 + 4} s={10} mono c={C.dim}>
        t = 2
      </T>
      <T x={x + w + 30} y={y + t * 1.5 + 4} s={10} mono c={C.dim}>
        t = 2
      </T>
      <Ld pts={[[x + w / 2, y + 2 * t + 9], [x + w / 2, 160]]} text="butt joint, underneath" a="middle" s={10.5} c={C.dim} />

      <rect x={286} y={58} width={180} height={104} rx="6" fill="rgba(208,168,79,0.08)" stroke={C.brass} strokeWidth="1" />
      <T x={376} y={84} a="middle" s={15} c={C.brass} w="600">
        L = 4t + 2w
      </T>
      <T x={376} y={108} a="middle" s={11.5} mono c={C.text}>
        = 4 × 2 + 2 × 16
      </T>
      <T x={376} y={128} a="middle" s={11.5} mono c={C.text}>
        = 8 + 32
      </T>
      <T x={376} y={150} a="middle" s={12.5} mono c={C.brass} w="600">
        = 40 mm
      </T>

      <Sep x1={14} y1={194} x2={466} y2={194} />
      <Tag x={16} y={212}>The strip, unrolled: every mm goes round</Tag>
      {seg.map(([lab, mm, nm], i) => {
        const x0 = acc
        acc += mm * sk
        return (
          <g key={i}>
            <rect x={x0} y={232} width={mm * sk} height={5 * sk * 0.6} fill={i % 2 ? 'url(#sk-dark)' : 'url(#sk-top)'} stroke="#5c3c1d" strokeWidth="0.8" />
            <T x={x0 + (mm * sk) / 2} y={250} a="middle" s={10.5} mono c={C.text}>
              {lab}
            </T>
            <T x={x0 + (mm * sk) / 2} y={276} a="middle" s={10} c={C.faint}>
              {nm}
            </T>
          </g>
        )
      })}
      <Dim a={[sx, 262]} b={[sx + 40 * sk, 262]} off={26} text="40" flip />
      <T x={16} y={326} s={10.5} c={C.dim}>
        Lapped keeper instead: wrap both straps and add 10 mm (or 4 × width + 10 mm).
      </T>
    </Fig>
  )
}

/* Skive the ends on opposite faces */
function KeeperSkive() {
  const k = 14
  const t = 1.2 * k
  const L = 10 * 6
  const y = 78
  const strip = `M40 ${y} L${440 - L} ${y} L440 ${y + t / 2} L440 ${y + t} L${40 + L} ${y + t} L40 ${y + t / 2} Z`
  const ly = 196
  return (
    <Fig h={340} view="Long section · keeper strip" scale="thickness ×14 · length ×6">
      <path d={strip} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <rect x={40} y={y + t / 2} width={L} height={t / 2} fill="url(#sk-fadeL)" opacity="0.6" />
      <rect x={440 - L} y={y} width={L} height={t / 2} fill="url(#sk-fadeR)" opacity="0.6" />
      <Ld pts={[[70, y + t - 3], [70, 126]]} text="skived on the flesh" sub="to about half" a="middle" s={10.5} />
      <Ld pts={[[410, y + 3], [410, 52]]} text="skived on the grain" a="middle" s={10.5} />
      <T x={240} y={y + t / 2 + 4} a="middle" s={10} c="#3a2412">
        full thickness ~1.2
      </T>
      <Dim a={[440 + 10, y + t / 2]} b={[440 + 10, y + t]} text="" />
      <T x={450} y={y + t + 16} a="middle" s={10} mono c={C.dim}>
        ½
      </T>
      <T x={240} y={150} a="middle" s={10.5} c={C.faint}>
        skive length ≈ the lap
      </T>

      <Sep x1={14} y1={166} x2={466} y2={166} />
      <Tag x={16} y={184}>Closed: the scarfs mate</Tag>
      <Verdict x={190} y={180} ok r={8} />
      <path d={`M60 ${ly} L${240} ${ly} L${240 + L} ${ly + t / 2} L${240 + L} ${ly + t} L60 ${ly + t} Z`} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <path d={`M${240} ${ly} L${420} ${ly} L420 ${ly + t} L${240 + L} ${ly + t} Z`} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" opacity="0.85" />
      <GlueLine x1={244} x2={240 + L - 4} y={ly + t / 4 + 1} />
      <Dim a={[440, ly]} b={[440, ly + t]} text="" />
      <T x={448} y={ly + t / 2 + 4} s={10.5} mono c={C.emerald}>
        t
      </T>
      <T x={240} y={ly + t + 18} a="middle" s={10.5} c={C.emerald}>
        one thickness through the joint: flat
      </T>

      <Tag x={16} y={262}>Unskived lap</Tag>
      <Verdict x={130} y={258} ok={false} r={8} />
      <rect x={60} y={286} width={240} height={t} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <rect x={240} y={286 - t} width={180} height={t} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" opacity="0.85" />
      <Dim a={[440, 286 - t]} b={[440, 286 + t]} text="" />
      <T x={448} y={290} s={10.5} mono c={C.ruby}>
        2t
      </T>
      <T x={240} y={326} a="middle" s={10.5} c={C.ruby}>
        a hard lump that catches on the strap
      </T>
    </Fig>
  )
}

/* Finish the edges while the strip is flat */
function KeeperEdges() {
  const k = 16
  return (
    <Fig h={340} view="Plan & sections · keeper edges" scale="plan ×6 · sections ×16">
      <rect x={40} y={70} width={300} height={30} rx="1" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <line x1={40} y1={70} x2={340} y2={70} stroke={C.brass} strokeWidth="3" opacity="0.7" />
      <line x1={40} y1={100} x2={340} y2={100} stroke={C.brass} strokeWidth="3" opacity="0.7" />
      <Slicker x={200} y={66} len={80} k={0.8} />
      <Arrow a={[248, 50]} b={[300, 50]} w={1.4} />
      <Ld pts={[[330, 70], [380, 64]]} text="long edge 1" s={10.5} c={C.brass} />
      <Ld pts={[[330, 100], [380, 106]]} text="long edge 2" s={10.5} c={C.brass} />
      <Ld pts={[[42, 85], [24, 130]]} x={16} y={142} text="ends stay raw:" s={10.5} c={C.dim} />
      <T x={16} y={155} s={10} c={C.faint}>
        they go into the joint
      </T>

      <Sep x1={14} y1={170} x2={466} y2={170} />
      <Tag x={16} y={188}>Section across the strip</Tag>
      {[
        ['square', 'as cut'],
        ['bevel', 'bevelled'],
        ['round', 'burnished'],
        ['paint', 'or painted'],
      ].map(([e, lab], i) => {
        const cx = 60 + i * 100
        return (
          <g key={e}>
            <XSec cx={cx} y={226} w={5 * k} layers={[{ k: 'top', t: 1.2 * k }]} edge={e} b={3} coat={2.5} />
            <T x={cx} y={266} a="middle" s={10.5} c={C.text}>
              {lab}
            </T>
            {i < 3 && <Arrow a={[cx + 46, 236]} b={[cx + 56, 236]} w={1.2} />}
          </g>
        )
      })}
      <Beveller x={200} y={226} ang={35} k={0.36} />

      <Sep x1={14} y1={282} x2={466} y2={282} />
      <Verdict x={24} y={306} ok={false} r={8} />
      <T x={38} y={304} s={10.5} c={C.ruby}>
        Closed first: the inner edges
      </T>
      <T x={38} y={317} s={10.5} c={C.ruby}>
        are out of reach of any tool.
      </T>
      <Loop x={300} y={300} w={110} h={18} kt={8} joint="butt" />
      <rect x={292} y={292} width={126} height={34} rx="6" fill="none" stroke={C.ruby} strokeWidth="1.2" strokeDasharray="3 2" />
    </Fig>
  )
}

/* Close the floating keeper: butt-sewn or lapped; a touch longer than the fixed */
function KeeperFloat() {
  const k = 8
  const sw = 5 * k
  const cyA = 100
  return (
    <Fig h={340} view="Plan of the joints · end views" scale="joints ×8 · end views ×6">
      <Tag x={16} y={44}>Sewn edge to edge</Tag>
      <rect x={20} y={cyA - sw / 2} width={88} height={sw} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <rect x={110} y={cyA - sw / 2} width={88} height={sw} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      {[-12, 0, 12].map((d, i) => (
        <g key={d}>
          <circle cx={102} cy={cyA + d} r="1.6" fill={C.hole} />
          <circle cx={116} cy={cyA + d} r="1.6" fill={C.hole} />
          <Thr d={`M102 ${cyA + d - 4} L116 ${cyA + d + 4}`} c={i % 2 ? TB : TA} w={1.8} />
        </g>
      ))}
      <T x={109} y={150} a="middle" s={10.5} c={C.text}>
        ends butt, stitched across
      </T>

      <Tag x={238} y={44}>Glued lap · 3 stitch holes</Tag>
      <rect x={240} y={cyA - sw / 2} width={130} height={sw} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <rect x={300} y={cyA - sw / 2 - 3} width={140} height={sw} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" opacity="0.92" />
      <rect x={300} y={cyA - sw / 2} width={70} height={sw - 3} fill="url(#sk-glue)" opacity="0.6" />
      <Thr d="M319 98 L332 102" c={TA} w={1.8} />
      <Thr d="M338 98 L351 102" c={TB} w={1.8} />
      {[316, 335, 354].map((x) => (
        <circle key={x} cx={x} cy={cyA} r="2.6" fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />
      ))}
      <Dim a={[300, cyA + sw / 2 + 4]} b={[370, cyA + sw / 2 + 4]} off={10} text="lap" flip />
      <T x={340} y={160} a="middle" s={10.5} c={C.text}>
        scarfed, glued, three holes
      </T>
      <Rivet x={452} y={cyA - 10} h={18} k={1} />
      <T x={450} y={136} a="middle" s={10} c={C.faint}>
        or rivet
      </T>

      <Sep x1={14} y1={176} x2={466} y2={176} />
      <Tag x={16} y={194}>End-on, on the strap</Tag>
      <Stack x={60} y={238} w={96} t={12} />
      <Loop x={60} y={238} w={96} h={24} kt={7} />
      <T x={108} y={300} a="middle" s={10.5} c={C.text}>
        fixed: snug
      </T>
      <Stack x={290} y={238} w={96} t={12} />
      <Loop x={290} y={238} w={96} h={24} kt={7} gap={4} />
      <T x={338} y={300} a="middle" s={10.5} c={C.emerald}>
        floating: a touch longer
      </T>
      <T x={338} y={313} a="middle" s={10} c={C.faint}>
        so it slides along
      </T>
      <Ld pts={[[386 + 6, 238 - 6], [420, 214]]} text="clearance" s={10.5} c={C.dim} />
    </Fig>
  )
}

/* Fit the fixed keeper under the buckle flap, 10 mm from the fold */
function KeeperFixed() {
  const x1 = 60
  const x2 = 330
  const y = 118
  const s = 4
  const kx = x2 - 10 * s
  const TP = { x: 40 - 50 * 3.6, y: 292, s: 3.6 }
  const o = SHORT({ x0: 50 })
  return (
    <Fig h={340} view="Section · buckle end, folded" scale="×4 · thickness ×3 · plan ×3.6">
      <StrapSection x1={x1} x2={x2} y={y} s={s} k={9} left={{ kind: 'break' }} right={{ kind: 'buckle' }} keeper={{ at: 10 }} glue={{ stopL: 0, stopR: 14 }} />
      <Dim a={[kx, y - 46]} b={[x2, y - 46]} off={-8} text="10" flip />
      <Ld pts={[[kx, y - 33], [200, 52]]} text="fixed keeper" a="end" s={11} />
      <Ld pts={[[kx - 6, y + 12], [200, 184]]} text="pared ends, glued and" a="end" s={10.5} />
      <T x={196} y={201} a="end" s={10.5} c={C.text}>
        trapped under the flap
      </T>
      <Ld pts={[[260, y + 20], [260, 214]]} x={264} y={218} text="buckle flap" s={10.5} c={C.dim} />
      <Ld pts={[[x2 + 14, y + 30], [380, 196]]} text="fold: left free" sub="to crease and finish" s={10.5} c={C.emerald} />

      <Sep x1={14} y1={240} x2={466} y2={240} />
      <StrapPlan T={TP} o={o} keepers={[{ x: 70 }]} stitch={{ mode: 'stitch', m: 3, p: 3, from: 54, to: 76, w: 1.2 }} folds={[{ x: 80 }]} />
      <Buckle x={px(TP, 80, 0)[0]} y={TP.y} w={18 * 3.6} L={50} />
      <BreakV x={px(TP, 50, 0)[0]} y1={TP.y - 33} y2={TP.y + 33} />
      {[-1, 1].map((sg) => {
        const [ex, ey] = px(TP, 67.5, sg * 9.4)
        return <rect key={sg} x={ex} y={sg < 0 ? ey : ey - 5 * 3.6} width={5 * 3.6} height={5 * 3.6} fill="none" stroke={C.text} strokeWidth="0.9" strokeDasharray="2 2" />
      })}
      <Ld pts={[[px(TP, 70, 0)[0] + 10, px(TP, 70, 0)[1] - 24], [256, 266]]} text="keeper ends hidden" sub="inside, between the stitch lines" s={10.5} />
      <Ld pts={[[px(TP, 70, 0)[0], px(TP, 70, 0)[1] + 30], [256, 318]]} text="keeper 10 mm from the fold" s={10.5} c={C.dim} />
      <T x={466} y={338} a="end" s={10} c={C.faint}>
        plan from the grain side
      </T>
    </Fig>
  )
}

export const FIGS = {
  't7-recheck': Recheck,
  't7-dividers': SetDividers,
  't7-score': Score,
  't7-groove': Groove,
  't7-stops': Stops,
  't7-padded': Padded,
  't7-crease': Crease,
  't8-support': Support,
  't8-tip': TipFirst,
  't8-curves': Curves,
  't8-walk': Walk,
  't8-vertical': Vertical,
  't8-strike': Strike,
  't8-gap': Gap,
  't8-open': OpenHoles,
  't9-length': Length,
  't9-thread': ThreadUp,
  't9-clamp': Clamp,
  't9-start': Start,
  't9-stitch': StitchStep,
  't9-slant': Slant,
  't9-pierce': Pierce,
  't9-tension': Tension,
  't9-lock': Lock,
  't9-backstitch': Backstitch,
  't9-ends': Ends,
  't9-set': SetSeam,
  't11-centre': Centre,
  't11-position': Position,
  't11-punch': PunchSize,
  't11-pitch': Pitch,
  't11-count': Count,
  't11-strike': PunchStrike,
  't11-slot': SlotCut,
  't11-check': TongueCheck,
  't12-strip': KeeperStrip,
  't12-split': KeeperSplit,
  't12-length': KeeperLength,
  't12-skive': KeeperSkive,
  't12-edges': KeeperEdges,
  't12-float': KeeperFloat,
  't12-fixed': KeeperFixed,
}
