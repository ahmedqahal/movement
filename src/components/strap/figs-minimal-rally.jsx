// Strap diagrams — minimal-stitch straps (sm-minimal, mn-*), the new rally
// steps (sm-rally: ra-patterns … ra-shell) and the thick-padding variant
// (sm-padded: p-thick). See AUTHORING.md.
//
// Local helpers (copied / adapted from figs-padded-rally and figs-bund-sp-nosew):
//   Cap, HDim/VDim (+ dark pill text for dims over leather), ClipRect,
//   ClipCircle, Brk/HBrk, TopShape, SecThread, dilate/kama/fullP,
//   domeG/DomeX (padded section across), Cord (twisted cord), TackPlan
//   (a wrapped corner tack seen on a face), StitchSeg, Opening.
// Plan coordinates for the new figures are measured from the LUG END (the
// outer edge of the lug fold) where the step text does so; the bar centre
// sits LUG = 2.1 mm inside it (0.9 mm bar radius + 1.2 mm top).
import { useId } from 'react'
import { C, FONT, MONO, Fig, T, Note, Lead, Arrow, Num, Verdict, Tag, Sep, Legend } from './kit.jsx'
import { StrapPlan, StitchRun, Ply, GlueLine, XSec, Buckle, SpringBar } from './parts.jsx'
import { StrapSection, secGeom } from './sections.jsx'
import { LONG, SHORT, holeXs, outline, pathOf, widthAt, px } from './geom.js'
import { Knife, Punch, Roller, Applicator, Creaser, Burner, Slab } from './tools.jsx'

/* ================================================================== */
/* Local helpers                                                       */
/* ================================================================== */
const useUid = () => 'mr' + useId().replace(/[^a-zA-Z0-9]/g, '')
const r1 = (v) => Math.round(v * 10) / 10
const poly = (pts, close = true) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${r1(x)} ${r1(y)}`).join(' ') + (close ? ' Z' : '')
const range = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n)

const TOPF = '#bb8d57' // top leather, cut face
const GRAIN = '#6f4521' // grain surface line
const EDGE = '#4a3018'
const LINE = '#8f7b5a'
const SKIN = 'rgba(214,170,140,0.34)'
const NAVY = '#3d5f9e'
const LUG = 2.1 // lug end → bar centre, mm

// Tack geometry measured on commercial tack-stitched straps (mm).
const TK = { in: 4.25, down: 6.5, cord: 0.9, vApex: 4.5, vSpread: 4.5, vDepth: 3.4 }

function MRDefs() {
  return (
    <defs>
      <linearGradient id="mr-shell" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b8672f" />
        <stop offset="0.5" stopColor="#8e4620" />
        <stop offset="1" stopColor="#6a3014" />
      </linearGradient>
      <linearGradient id="mr-minerva" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8a5a34" />
        <stop offset="1" stopColor="#5e3a1e" />
      </linearGradient>
      <pattern id="mr-epsom" width="7" height="6" patternUnits="userSpaceOnUse">
        <rect width="7" height="6" fill="#22304f" />
        <path d="M0.5 1.5 l2 -0.6 M3.5 4.2 l2.2 0.5 M1.2 4.8 l0.8 -1.2 M5 1.1 l0.6 1.4" stroke="#3b5180" strokeWidth="0.7" />
        <circle cx="2.4" cy="3" r="0.5" fill="#141d36" />
        <circle cx="5.7" cy="3.6" r="0.45" fill="#141d36" />
      </pattern>
    </defs>
  )
}

// Callout: dot on the feature, leader to the nearest edge of the text block.
function Cap({ p, x, y, text, sub, a = 'middle', c = C.text, s = 11.5, subc = C.faint, w, dot = true }) {
  const top = y - s * 0.8
  const bot = y + 4 + (sub ? s + 1 : 0)
  const ay = p[1] > y ? bot : top - 1
  const ax = a === 'middle' ? x : a === 'start' ? x + 8 : x - 8
  return (
    <g>
      <line x1={p[0]} y1={p[1]} x2={ax} y2={ay} stroke={C.struct} strokeWidth="0.8" opacity="0.85" />
      {dot && <circle cx={p[0]} cy={p[1]} r="2.2" fill={c} />}
      <text x={x} y={y} textAnchor={a} fontSize={s} fill={c} fontWeight={w} fontFamily={FONT}>
        {text}
      </text>
      {sub && (
        <text x={x} y={y + s + 1.5} textAnchor={a} fontSize={s - 1.5} fill={subc} fontFamily={FONT}>
          {sub}
        </text>
      )}
    </g>
  )
}

// Mono text on a dark pill — for dimension figures that sit over leather.
function Pill({ x, y, text, a = 'start', s = 10.5, c = C.text }) {
  const w = String(text).length * s * 0.62 + 6
  const x0 = a === 'middle' ? x - w / 2 : a === 'start' ? x - 3 : x - w + 3
  return (
    <g>
      <rect x={x0} y={y - s + 0.5} width={w} height={s + 4} rx="3" fill={C.ground} opacity="0.9" />
      <text x={x} y={y + 1} textAnchor={a} fontSize={s} fill={c} fontFamily={MONO}>
        {text}
      </text>
    </g>
  )
}

function HDim({ x1, x2, y, text, ty, tx, a = 'middle', f1, f2, c = C.dim, s = 10.5, pill }) {
  const short = Math.abs(x2 - x1) < 24
  const X = tx ?? (x1 + x2) / 2
  const Y = ty ?? y - 4
  return (
    <g>
      {f1 != null && <line x1={x1} y1={f1} x2={x1} y2={y + (y > f1 ? 3 : -3)} stroke={c} strokeWidth="0.6" opacity="0.6" />}
      {f2 != null && <line x1={x2} y1={f2} x2={x2} y2={y + (y > f2 ? 3 : -3)} stroke={c} strokeWidth="0.6" opacity="0.6" />}
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={c} strokeWidth="0.85" markerStart={short ? undefined : 'url(#sk-a-dim)'} markerEnd={short ? undefined : 'url(#sk-a-dim)'} />
      {short && (
        <g stroke={c} strokeWidth="1.1">
          <line x1={x1 - 2} y1={y + 3} x2={x1 + 2} y2={y - 3} />
          <line x1={x2 - 2} y1={y + 3} x2={x2 + 2} y2={y - 3} />
        </g>
      )}
      {text &&
        (pill ? (
          <Pill x={X} y={Y} text={text} a={a} s={s} />
        ) : (
          <text x={X} y={Y} textAnchor={a} fontSize={s} fill={c} fontFamily={MONO}>
            {text}
          </text>
        ))}
    </g>
  )
}
function VDim({ y1, y2, x, text, tx, ty, a = 'start', f1, f2, c = C.dim, s = 10.5, pill }) {
  const short = Math.abs(y2 - y1) < 24
  const X = tx ?? x + 5
  const Y = ty ?? (y1 + y2) / 2 + 3.5
  return (
    <g>
      {f1 != null && <line x1={f1} y1={y1} x2={x + (x > f1 ? 3 : -3)} y2={y1} stroke={c} strokeWidth="0.6" opacity="0.6" />}
      {f2 != null && <line x1={f2} y1={y2} x2={x + (x > f2 ? 3 : -3)} y2={y2} stroke={c} strokeWidth="0.6" opacity="0.6" />}
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={c} strokeWidth="0.85" markerStart={short ? undefined : 'url(#sk-a-dim)'} markerEnd={short ? undefined : 'url(#sk-a-dim)'} />
      {short && (
        <g stroke={c} strokeWidth="1.1">
          <line x1={x - 3} y1={y1 + 2} x2={x + 3} y2={y1 - 2} />
          <line x1={x - 3} y1={y2 + 2} x2={x + 3} y2={y2 - 2} />
        </g>
      )}
      {text &&
        (pill ? (
          <Pill x={X} y={Y} text={text} a={a} s={s} />
        ) : (
          <text x={X} y={Y} textAnchor={a} fontSize={s} fill={c} fontFamily={MONO}>
            {text}
          </text>
        ))}
    </g>
  )
}

function ClipRect({ x, y, w, h, children }) {
  const id = useUid()
  return (
    <g>
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#${id})`}>{children}</g>
    </g>
  )
}
function ClipPath({ d, children }) {
  const id = useUid()
  return (
    <g>
      <clipPath id={id}>
        <path d={d} />
      </clipPath>
      <g clipPath={`url(#${id})`}>{children}</g>
    </g>
  )
}
function ClipCircle({ cx, cy, r, children }) {
  const id = useUid()
  return (
    <g>
      <clipPath id={id}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <circle cx={cx} cy={cy} r={r} fill={C.ground} />
      <g clipPath={`url(#${id})`}>{children}</g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.brass} strokeWidth="1.3" />
    </g>
  )
}
// break marks: vertical (piece continues to the right) and horizontal
const Brk = ({ x, y1, y2 }) => {
  const h = y2 - y1
  return <path d={`M${x} ${y1} l5 ${h * 0.3} l-10 ${h * 0.4} l5 ${h * 0.3}`} fill="none" stroke={C.dim} strokeWidth="1" />
}
const HBrk = ({ x1, x2, y }) => {
  const w = x2 - x1
  return <path d={`M${x1} ${y} l${w * 0.3} -4 l${w * 0.4} 8 l${w * 0.3} -4`} fill="none" stroke={C.dim} strokeWidth="1" />
}
// a top-leather body in section: fill + grain line along the upper surface
function TopShape({ up, lo, fill = TOPF }) {
  return (
    <g>
      <path d={poly([...up, ...lo.slice().reverse()])} fill={fill} stroke={EDGE} strokeWidth="0.8" strokeLinejoin="round" />
      <path d={poly(up, false)} fill="none" stroke={GRAIN} strokeWidth="1.8" strokeLinejoin="round" />
    </g>
  )
}
// thread through a section: vertical pass with the stitch ends on both faces
const SecThread = ({ x, y1, y2, c = C.thread }) => (
  <g>
    <line x1={x} y1={y1 - 1} x2={x} y2={y2 + 1} stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    <ellipse cx={x} cy={y1 - 1.4} rx="2.8" ry="1.5" fill={c} />
    <ellipse cx={x} cy={y2 + 1.4} rx="2.8" ry="1.5" fill={c} />
  </g>
)

// Height of a layer of thickness t laid over a bump h(x) (all in mm).
function dilate(h, t, x, n = 14) {
  let m = t
  for (let i = -n; i <= n; i++) {
    const d = (i / n) * t
    const v = h(x + d) + Math.sqrt(Math.max(0, t * t - d * d))
    if (v > m) m = v
  }
  return m
}
const kama = (u) => {
  const a = Math.abs(u)
  return a >= 1 ? 0 : Math.pow(1 - Math.pow(a, 2.2), 0.75)
}
const fullP = (u) => {
  const a = Math.abs(u)
  return a >= 1 ? 0 : Math.pow(1 - Math.pow(a, 4), 0.42)
}

// Transverse section of a padded strap (from figs-padded-rally).
function domeG({ cx, yb, s, k = s, w = 20, inset = 4, fh = 2.2, top = 1.2, lin = 0.8, prof = kama, n = 160 }) {
  const W = w * s
  const x1 = cx - W / 2
  const x2 = cx + W / 2
  const FWm = w - 2 * inset
  const FW = FWm * s
  const hm = (xm) => (fh ? fh * prof(xm / (FWm / 2)) : 0)
  const hf = (x) => k * hm((x - cx) / s)
  const hu = (x) => k * dilate(hm, top, (x - cx) / s)
  const xs = range(x1, x2, n)
  return {
    cx, yb, s, k, x1, x2, W, FW, xs, hf, hu,
    tt: top * k,
    lt: lin * k,
    f1: cx - FW / 2,
    f2: cx + FW / 2,
    yUp: (x) => yb - hu(x),
    yLo: (x) => yb - hf(x),
    yBot: yb + lin * k,
    crest: yb - hu(cx),
  }
}
function DomeX({ g, lining = true, stitch, paint }) {
  const { x1, x2, xs, yb, lt } = g
  const up = xs.map((x) => [x, g.yUp(x)])
  const lo = xs.map((x) => [x, g.yLo(x)])
  const fxs = xs.filter((x) => x > g.f1 && x < g.f2)
  const threads = stitch ? [x1 + stitch.m * g.s, x2 - stitch.m * g.s] : []
  const yt = g.yUp(x1)
  return (
    <g>
      {lining && <rect x={x1} y={yb} width={x2 - x1} height={lt} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" />}
      <path d={poly([[g.f1, yb], ...fxs.map((x) => [x, g.yLo(x)]), [g.f2, yb]])} fill="url(#sk-fill)" stroke="#3a2716" strokeWidth="0.8" />
      <TopShape up={up} lo={lo} />
      {paint && (
        <g fill="none" stroke={C.paint} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round">
          <path d={`M${x1 + 2.6} ${yt - 0.8} L${x1 - 1} ${yt + 1.6} L${x1 - 1} ${yb + lt - 1.6} L${x1 + 2.6} ${yb + lt + 0.8}`} />
          <path d={`M${x2 - 2.6} ${yt - 0.8} L${x2 + 1} ${yt + 1.6} L${x2 + 1} ${yb + lt - 1.6} L${x2 - 2.6} ${yb + lt + 0.8}`} />
        </g>
      )}
      {threads.map((x, i) => (
        <SecThread key={i} x={x} y1={g.yUp(x)} y2={yb + lt} />
      ))}
    </g>
  )
}

// Heavy twisted cord along a path, w = cord diameter in px.
function Cord({ d, w = 3, op }) {
  return (
    <g opacity={op} fill="none" strokeLinejoin="round">
      <path d={d} stroke="#5d4c31" strokeWidth={w + 1.2} strokeLinecap="round" />
      <path d={d} stroke="#efe2c2" strokeWidth={w} strokeLinecap="round" />
      <path d={d} stroke="#b8a57c" strokeWidth={w * 0.9} strokeDasharray={`${(w * 0.42).toFixed(2)} ${(w * 0.72).toFixed(2)}`} />
    </g>
  )
}
// A wrapped corner tack on a face: two turns of cord from the hole h out
// over the edge point e.
function TackPlan({ h, e, w = 2.6, over = 1 }) {
  const dx = e[0] - h[0]
  const dy = e[1] - h[1]
  const L = Math.hypot(dx, dy) || 1
  const ux = dx / L
  const uy = dy / L
  const nx = -uy
  const ny = ux
  const o = w * 0.56
  return (
    <g>
      <circle cx={h[0]} cy={h[1]} r={w * 0.8} fill={C.hole} />
      {[-1, 1].map((sg) => (
        <Cord key={sg} w={w} d={`M${h[0] + nx * o * sg} ${h[1] + ny * o * sg} L${e[0] + ux * w * over + nx * o * sg} ${e[1] + uy * w * over + ny * o * sg}`} />
      ))}
    </g>
  )
}
// One saddle stitch lying slanted between two hole points.
function StitchSeg({ a, b, w = 1.6, c = C.thread }) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const L = Math.hypot(dx, dy) || 1
  const nx = -dy / L
  const ny = dx / L
  const sl = Math.min(2.2, L * 0.14)
  return <line x1={a[0] + dx * 0.1 - nx * sl} y1={a[1] + dy * 0.1 - ny * sl} x2={a[0] + dx * 0.9 + nx * sl} y2={a[1] + dy * 0.9 + ny * sl} stroke={c} strokeWidth={w} strokeLinecap="round" />
}
const StitchRow = ({ pts, w, c }) => (
  <g>
    {pts.slice(0, -1).map((p, i) => (
      <StitchSeg key={i} a={p} b={pts[i + 1]} w={w} c={c} />
    ))}
  </g>
)
// A rally opening in plan. look: 'through' (background shows) | 'underlay'
function Opening({ cx, cy, r, look = 'through' }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={look === 'through' ? C.ground : 'url(#sk-lin)'} />
      {look === 'through' && <circle cx={cx} cy={cy} r={r} fill={SKIN} />}
      <path d={`M${cx - r * 0.86} ${cy + r * 0.5} A${r} ${r} 0 0 1 ${cx + r * 0.5} ${cy - r * 0.86}`} fill="none" stroke="rgba(60,35,15,0.55)" strokeWidth={Math.max(1, r * 0.22)} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={EDGE} strokeWidth={r > 5 ? 1.1 : 0.8} />
    </g>
  )
}
// a marked hole position: dark centre, cross, dashed ring
const HoleMark = ({ x, y, r = 8 }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="none" stroke={C.brass} strokeWidth="1.1" strokeDasharray="3 2" />
    <circle cx={x} cy={y} r={2.4} fill={C.hole} />
    <path d={`M${x - 5} ${y} h10 M${x} ${y - 5} v10`} stroke="#2a1d10" strokeWidth="1.1" />
  </g>
)

/* ================================================================== */
/* MINIMAL-STITCH STRAPS (sm-minimal)                                   */
/* ================================================================== */

/* 1 · Laminate a firm stack — classic build to the cure, no seam */
function MnLaminate() {
  const x1 = 60
  const x2 = 388
  const y = 96
  const s = (x2 - x1) / 80
  const g = secGeom({ x1, x2, y, s, k: 9 })
  const rx = 300
  const ys = 262
  const tops = [
    { f: 'url(#mr-minerva)', n: 'Minerva Box', sub: 'veg-tan, ≈1.8–2 mm as sold' },
    { f: 'url(#mr-shell)', n: 'Shell cordovan', sub: 'dense and firm' },
    { f: 'url(#sk-top)', n: 'Firm veg-tan', sub: 'a full, firm temper' },
  ]
  return (
    <Fig h={336} view="Section · laminate, no seam" scale="short piece · thickness ×3">
      <MRDefs />
      <StrapSection x1={x1} x2={x2} y={y} s={s} k={9} left={{ kind: 'bar' }} right={{ kind: 'buckle' }} glue={{}} />
      <Roller x={rx} y={y} k={0.6} />
      <Arrow a={[rx + 14, y - 8]} b={[rx + 52, y - 8]} w={1.6} />
      <T x={344} y={46} s={11} c={C.text}>
        roller
      </T>
      <T x={344} y={59} s={10} c={C.faint}>
        press out the air
      </T>
      <Cap p={[150, y + 3]} x={130} y={50} text="top: firm and dense" sub="Minerva Box · shell · firm veg-tan" />
      <Cap p={[x1 + 22, g.y1 + 1]} x={90} y={156} a="start" text="channel open" sub="no glue · 10 mm" c={C.ruby} />
      <Cap p={[x2 - 30, g.y1 + 1]} x={372} y={156} text="no glue · 14 mm" sub="buckle channel" c={C.ruby} />
      <Cap p={[220, g.yL - 1]} x={232} y={184} text="lining cemented full-face" sub="contact cement, rolled flat" />
      <T x={240} y={214} a="middle" s={11} c={C.text}>
        Nothing is sewn: the glue joint has to do the seam’s work.
      </T>

      <Sep x1={14} y1={226} x2={466} y2={226} />
      <Tag x={14} y={242}>Across the width</Tag>
      <XSec cx={125} y={ys} w={180} layers={[{ k: 'top', t: 17 }, { k: 'lining', t: 11 }]} edge="square" />
      <GlueLine x1={37} x2={213} y={ys + 17} />
      <Lead p={[209, ys + 17]} t={[214, 250]} a="end" text="cement right to the edge" c={C.emerald} s={11} />
      <HDim x1={35} x2={215} y={304} f1={ys + 30} f2={ys + 30} text="20 mm" ty={318} />

      <Sep x1={238} y1={232} x2={238} y2={326} />
      <T x={252} y={246} s={11.5} c={C.text} w="600">
        Tops that hold without a seam
      </T>
      {tops.map((t, i) => {
        const ry = 270 + i * 24
        return (
          <g key={t.n}>
            <rect x={252} y={ry - 12} width={24} height={17} rx="2" fill={t.f} stroke="#2a1a0c" strokeWidth="0.8" />
            <T x={284} y={ry - 1} s={11} c={C.text}>
              {t.n}
            </T>
            <T x={284} y={ry + 11} s={10} c={C.faint}>
              {t.sub}
            </T>
          </g>
        )
      })}
    </Fig>
  )
}

/* 2 · Cut and paint now — surcoupe, then edge paint before any stitch */
function MnCutpaint() {
  const s = 2.3
  const o = LONG({ x0: -LUG })
  const TT = { x: 50 + LUG * s, y: 100, s }
  const X = (mm) => 50 + mm * s // lug-end mm
  const kxm = 104
  const kx = TT.x + kxm * s
  const ky = TT.y - (widthAt(kxm, o) / 2) * s
  const yt = 206
  const tT = 24
  const tL = 16
  const yi = yt + tT
  const yb = yi + tL
  const B = 5
  return (
    <Fig h={336} view="Plan + edge section · cut, then paint" scale="plan ×2.3 · edge ×20">
      <Num x={22} y={42} n={1} />
      <T x={36} y={46} s={11.5} c={C.text}>
        Cut top and lining as one (surcoupe)
      </T>
      <rect x={X(0)} y={TT.y - 16 * s} width={128 * s} height={32 * s} rx="2" fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="0.9" />
      <rect x={X(0)} y={TT.y - 14 * s} width={126 * s} height={28 * s} rx="2" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.9" />
      <StrapPlan T={TT} o={o} face="none" dash="5 3" edge={C.thread} />
      <Knife kind="utility" x={kx} y={ky} ang={25} k={0.55} />
      <Arrow a={[kx + 10, ky - 1]} b={[kx + 34, ky + 3]} w={1.5} />
      <Cap p={[X(1), TT.y + 20]} x={X(14)} y={150} a="start" text="lug fold already formed" c={C.dim} s={10.5} />
      <Note x={356} y={74} lines={['both layers at once,', 'edges flush']} s={10.5} lh={14} c={C.text} />
      <Note x={356} y={112} lines={['nothing sewn yet:', 'no seam to cut round']} s={10.5} lh={14} />

      <Sep x1={14} y1={160} x2={466} y2={160} />
      <Num x={22} y={180} n={2} />
      <T x={36} y={184} s={11.5} c={C.text}>
        Paint the edges now, before any stitching
      </T>
      {/* before: raw cut edge */}
      <rect x={40} y={yt} width={130} height={tT} fill="url(#sk-topS)" stroke={EDGE} strokeWidth="0.8" />
      <line x1={40} y1={yt} x2={170} y2={yt} stroke={GRAIN} strokeWidth="1.8" />
      <rect x={40} y={yi} width={130} height={tL} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" />
      <GlueLine x1={42} x2={168} y={yi} />
      <path d={range(0, 1, 10).map((f, i) => `${i ? 'L' : 'M'}${170 + (i % 2 ? 2 : 0)} ${yt + f * (yb - yt)}`).join(' ')} fill="none" stroke="#e9cf9f" strokeWidth="0.9" />
      <Brk x={40} y1={yt - 4} y2={yb + 4} />
      <Arrow a={[188, yi - 4]} b={[244, yi - 4]} w={1.6} />
      {/* after: sanded, bevelled, painted */}
      <path d={poly([[262, yt], [390 - B, yt], [390, yt + B], [390, yi], [262, yi]])} fill="url(#sk-topS)" stroke={EDGE} strokeWidth="0.8" />
      <line x1={262} y1={yt} x2={390 - B} y2={yt} stroke={GRAIN} strokeWidth="1.8" />
      <path d={poly([[262, yi], [390, yi], [390, yb - B], [390 - B, yb], [262, yb]])} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" />
      <GlueLine x1={264} x2={386} y={yi} />
      <path d={`M${390 - B - 2} ${yt - 1.5} L${392.5} ${yt + B - 0.5} L${392.5} ${yb - B + 0.5} L${390 - B - 2} ${yb + 1.5}`} fill="none" stroke={C.paint} strokeWidth="4.5" strokeLinejoin="round" strokeLinecap="round" />
      <path d={`M${394.4} ${yt + B} L${394.4} ${yb - B}`} stroke="#7a5638" strokeWidth="0.8" />
      <Brk x={262} y1={yt - 4} y2={yb + 4} />
      <Applicator x={396} y={yi - 2} ang={55} k={0.6} />
      <Cap p={[150, yb]} x={105} y={274} text="raw cut edge" sub="the glue line is exposed" c={C.dim} />
      <Cap p={[384, yb + 1]} x={330} y={274} text="paint bridges the glue line" sub="part of what holds the edge" />
      <T x={240} y={310} a="middle" s={10.5} c={C.faint}>
        Thin coats, sanded between; let it cure before marking the tacks.
      </T>
      <Legend x={70} y={327} items={[['top', 'top'], ['lining', 'lining'], ['glue', 'cement'], ['paint', 'edge paint']]} />
    </Fig>
  )
}

/* 3 · Mark the corner tacks — 4–4.5 in, 6–7 below the lug end; buckle fold too */
function MnTackmark() {
  const s = 6
  const LX = 56
  const CY = 116
  const P = { x: LX, y: CY, s }
  const o = { x0: 0, x1: 40, w0: 20, w1: 20, tip: 'square' }
  const hx = LX + TK.down * s
  const hyU = CY - (10 - TK.in) * s
  const hyD = CY + (10 - TK.in) * s
  const top = CY - 10 * s
  const bot = CY + 10 * s
  const xe = LX + 30 * s
  // section through the tack, true scale ×10
  const bx = 300
  const sy = 78
  const ss = 10
  const g = secGeom({ x1: bx, x2: 460, y: sy, s: ss, k: ss })
  const lugE = bx - g.r - g.T
  const hxs = lugE + TK.down * ss
  // buckle end, ×4.2
  const sb = 4.2
  const FX = 270
  const BY = 276
  const TB = { x: FX - 80 * sb, y: BY, s: sb }
  const foldE = TB.x + (80 + 1.1 + 1.2) * sb
  const bhx = foldE - TK.down * sb
  return (
    <Fig h={330} view="Plan + section · tack positions" scale="true scale ×6 / ×10">
      <ClipRect x={20} y={36} w={xe - 20} h={170}>
        <StrapPlan T={P} o={o} edge={C.paint} />
        {[hyU, hyD].map((yy) => (
          <line key={yy} x1={LX + 1.5 * s} y1={yy} x2={xe} y2={yy} stroke="#f3e6c8" strokeWidth="0.9" strokeDasharray="2 3" opacity="0.7" />
        ))}
      </ClipRect>
      <SpringBar x={LX + LUG * s} y1={top - 8} y2={bot + 8} r={3.2} />
      <Brk x={xe} y1={top - 4} y2={bot + 4} />
      <HoleMark x={hx} y={hyU} />
      <HoleMark x={hx} y={hyD} />
      <HDim x1={LX} x2={hx} y={36} f1={top} f2={hyU - 9} text="6–7" ty={32} />
      <VDim x={hx + 15} y1={top} y2={hyU} text="4–4.5" tx={hx + 21} pill />
      <T x={LX + 4} y={bot + 30} a="end" s={10.5}>
        lug end
      </T>
      <Lead p={[hx + 2, hyD + 3]} t={[112, 188]} a="start" text="both corners" sub="on the scribed line" s={11} />

      <Sep x1={254} y1={30} x2={254} y2={198} />
      <Tag x={264} y={40}>
        Section through the tack
      </Tag>
      <StrapSection x1={bx} x2={460} y={sy} s={ss} k={ss} left={{ kind: 'bar' }} right={{ kind: 'break' }} />
      <line x1={hxs} y1={sy - 9} x2={hxs} y2={g.y1 + 13} stroke={C.ruby} strokeWidth="1.5" strokeDasharray="4 2" />
      <HDim x1={lugE} x2={hxs} y={58} f1={sy + 2} f2={sy - 11} text="6–7" ty={54} />
      <Cap p={[420, sy + 3]} x={444} y={64} text="top" c={C.dim} />
      <Cap p={[bx, g.y1 + g.r]} x={290} y={146} text="spring bar" c={C.dim} s={10.5} />
      <Cap p={[356, g.y1 + 2]} x={372} y={146} text="skived tail" sub="under the lining" s={10.5} />
      <Cap p={[440, g.y1 + 3.5]} x={442} y={146} text="lining" s={10.5} />
      <T x={360} y={186} a="middle" s={10.5} c={C.text}>
        one hole clamps top, tail and lining
      </T>

      <Sep x1={14} y1={214} x2={466} y2={214} />
      <Tag x={14} y={230}>
        Repeat at the buckle fold
      </Tag>
      <ClipRect x={40} y={226} w={FX + 70 - 40} h={100}>
        <StrapPlan T={TB} o={SHORT()} edge={C.paint} keepers={[{ x: 70 }]} slot={{ x: 80 }} />
      </ClipRect>
      <Brk x={40} y1={BY - 42} y2={BY + 42} />
      <Buckle x={FX} y={BY} w={18 * sb} L={46} />
      <HoleMark x={bhx} y={BY - (9 - TK.in) * sb} r={6} />
      <HoleMark x={bhx} y={BY + (9 - TK.in) * sb} r={6} />
      <HDim x1={bhx} x2={foldE} y={226} f1={BY - 38} f2={BY - 38} text="6–7" ty={222} />
      <Lead p={[bhx - 2, BY + (9 - TK.in) * sb + 3]} t={[200, 318]} a="end" text="both sides, as at the lug" s={10.5} />
      <Note x={334} y={240} head="Measured" hc={C.text} lines={['on commercial tack-', 'stitched straps: one', 'hole a side, 4–4.5 mm', 'in, 6–7 mm below the', 'lug end; again at the', 'buckle fold.']} s={10.5} lh={13.5} />
    </Fig>
  )
}

/* 4 · Wrap the tacks — cord through the hole and round the edge, twice */
function MnTackwrap() {
  const k = 14
  const CX = 76
  const EX = CX + 10 * k
  const y0 = 220
  const yA = y0 + 1.2 * k
  const yB = yA + 0.55 * k
  const ybot = yB + 0.8 * k
  const HX = EX - TK.in * k
  const hr = 0.5 * k
  const cw = TK.cord * k
  const c = cw / 2
  const yTc = y0 - c
  const yBc = ybot + c
  const ex = EX + c - 1.4
  const loop = (d) =>
    `M${HX} ${ybot} L${HX} ${y0} Q${HX} ${yTc - d} ${HX + c} ${yTc - d} L${EX - 4} ${yTc - d} Q${ex + d} ${yTc - d} ${ex + d} ${y0 + 6} ` +
    `L${ex + d} ${ybot - 6} Q${ex + d} ${yBc + d} ${EX - 4} ${yBc + d} L${HX + c} ${yBc + d} Q${HX} ${yBc + d} ${HX} ${ybot}`
  const body = (a, b) => (
    <g key={a}>
      <rect x={a} y={y0} width={b - a} height={yA - y0} fill="url(#sk-topS)" stroke={EDGE} strokeWidth="0.8" />
      <line x1={a} y1={y0} x2={b} y2={y0} stroke={GRAIN} strokeWidth="1.8" />
      <rect x={a} y={yA} width={b - a} height={yB - yA} fill={TOPF} stroke={EDGE} strokeWidth="0.7" />
      <rect x={a} y={yB} width={b - a} height={ybot - yB} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" />
    </g>
  )
  const kx = HX - 18
  // face / back corner minis, ×5: lug end at x0, edge at y = 130
  const m = 5
  const fy = 130
  return (
    <Fig h={336} view="Sequence + section · wrapping a tack" scale="minis ×5 · section true ×14">
      {/* 1 · punch */}
      <Num x={24} y={44} n={1} />
      <T x={36} y={48} s={11} c={C.text}>
        Punch Ø ≈ cord
      </T>
      <Slab x={22} y={117} w={124} h={9} kind="pad" />
      <Ply x1={26} x2={142} y={96} t={9} />
      <Ply x1={26} x2={142} y={105} t={4} />
      <Ply x1={26} x2={142} y={109} t={8} k="lining" />
      <rect x={92.5} y={95} width={7} height={23} fill={C.ground} />
      <Punch x={96} y={96} d={11} k={0.62} />
      <T x={84} y={142} a="middle" s={10.5} c={C.text}>
        round punch, on the mark
      </T>
      <T x={84} y={155} a="middle" s={10} c={C.faint}>
        Ø to suit the 0.8–1 mm cord
      </T>

      {/* 2 · wrap, face side */}
      <Sep x1={160} y1={30} x2={160} y2={162} />
      <Num x={176} y={44} n={2} />
      <T x={188} y={48} s={11} c={C.text}>
        Wrap the edge, ×2
      </T>
      <rect x={172} y={68} width={134} height={fy - 68} fill="url(#sk-top)" />
      <path d={`M172 68 V${fy} H306`} fill="none" stroke={C.paint} strokeWidth="2.4" />
      <HBrk x1={172} x2={306} y={68} />
      <Brk x={306} y1={68} y2={fy + 2} />
      <SpringBar x={172 + LUG * m} y1={66} y2={fy + 3} r={2.2} />
      <TackPlan h={[172 + TK.down * m, fy - TK.in * m]} e={[172 + TK.down * m, fy]} w={TK.cord * m} />
      <Arrow d={`M220 100 C236 108 238 128 226 137`} w={1.4} />
      <T x={238} y={147} a="middle" s={10.5} c={C.text}>
        2 turns, each pulled down
      </T>
      <T x={238} y={160} a="middle" s={10} c={C.faint}>
        into the edge paint
      </T>

      {/* 3 · tie off, back side */}
      <Sep x1={320} y1={30} x2={320} y2={162} />
      <Num x={336} y={44} n={3} />
      <T x={348} y={48} s={11} c={C.text}>
        Tie off behind
      </T>
      <rect x={332} y={68} width={128} height={fy - 68} fill="url(#sk-lin)" />
      <rect x={332} y={68} width={4.4 * m} height={fy - 68} fill="url(#sk-top)" />
      <path d={`M332 68 V${fy} H460`} fill="none" stroke={C.paint} strokeWidth="2.4" />
      <HBrk x1={332} x2={460} y={68} />
      <TackPlan h={[332 + TK.down * m, fy - TK.in * m]} e={[332 + TK.down * m, fy]} w={TK.cord * m} />
      <g>
        <ellipse cx={371} cy={104} rx={6} ry={4} fill="#efe2c2" stroke="#5d4c31" strokeWidth="0.8" />
        <ellipse cx={375} cy={100} rx={4.5} ry={3.4} fill="#e4d4ae" stroke="#5d4c31" strokeWidth="0.8" />
        <circle cx={380} cy={97} r={1.8} fill="#3b2a1d" />
      </g>
      <Burner x={381} y={96} ang={35} k={0.42} />
      <T x={396} y={147} a="middle" s={10.5} c={C.text}>
        lining side: knot,
      </T>
      <T x={396} y={160} a="middle" s={10} c={C.faint}>
        end sealed
      </T>

      {/* section across the strap at the tack */}
      <Sep x1={14} y1={168} x2={466} y2={168} />
      <Tag x={14} y={186}>
        Section at the tack · ×14
      </Tag>
      <line x1={CX} y1={y0 - 14} x2={CX} y2={ybot + 14} stroke={C.steel} strokeWidth="0.8" strokeDasharray="8 3 2 3" />
      <T x={CX} y={ybot + 28} a="middle" s={10} c={C.faint}>
        centre
      </T>
      <Cord d={loop(3.2)} w={cw} op={0.45} />
      {body(CX, HX - hr)}
      {body(HX + hr, EX)}
      <rect x={HX - hr} y={y0} width={2 * hr} height={ybot - y0} fill={C.ground} />
      <path d={`M${EX - 3} ${y0 - 1} L${EX + 1.5} ${y0 + 3} L${EX + 1.5} ${ybot - 3} L${EX - 3} ${ybot + 1}`} fill="none" stroke={C.paint} strokeWidth="3.2" strokeLinejoin="round" />
      <Cord d={loop(0)} w={cw} />
      <g>
        <ellipse cx={kx} cy={yBc + 2} rx={9} ry={6} fill="#efe2c2" stroke="#5d4c31" strokeWidth="0.8" />
        <ellipse cx={kx - 6} cy={yBc + 6} rx={6} ry={4.5} fill="#e4d4ae" stroke="#5d4c31" strokeWidth="0.8" />
        <circle cx={kx - 12} cy={yBc + 9} r={2.4} fill="#3b2a1d" />
      </g>
      <path d={`M${CX - 8} ${y0} h-4 v${ybot - y0} h4`} fill="none" stroke={C.dim} strokeWidth="0.9" />
      <T x={62} y={y0 + 15} a="end" s={10.5} c={C.text}>
        3 layers,
      </T>
      <T x={62} y={y0 + 28} a="end" s={10.5} c={C.dim}>
        clamped
      </T>
      <HDim x1={HX} x2={EX} y={286} f1={yBc + 9} f2={ybot + 3} text="4–4.5" ty={300} />
      <Lead p={[190, yTc]} t={[256, 196]} a="start" text="twisted cord, 0.8–1 mm" s={11} />
      <Lead p={[ex + c, (y0 + ybot) / 2]} t={[256, 228]} a="start" text="round the edge, twice" sub="2nd turn beside the 1st" s={11} />
      <Lead p={[EX + 1, ybot - 4]} t={[256, 266]} a="start" text="pulled down into the edge paint" s={11} c={C.brass} />
      <Cap p={[kx - 8, yBc + 8]} x={100} y={316} text="tie off, seal the end" sub="on the lining side" s={10.5} />
    </Fig>
  )
}

/* 5 · Sew the V at the tip — three holes, saddle-stitched, tied behind */
function MnVtack() {
  const s = 9
  const o = LONG({ x0: 93 })
  const CY = 150
  const Tp = { x: 30 - 93 * s, y: CY, s }
  const X = (mm) => Tp.x + mm * s
  const ax = 120 - TK.vApex
  const armx = ax - TK.vDepth
  const half = TK.vSpread / 2
  const A = [X(ax), CY]
  const L = [X(armx), CY - half * s]
  const R = [X(armx), CY + half * s]
  const cw = 6.5
  const hole = (p) => <circle cx={p[0]} cy={p[1]} r={0.55 * s} fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />
  // geometry panel, ×12
  const gs = 12
  const GA = [405, 128]
  const GL = [GA[0] - TK.vDepth * gs, GA[1] - half * gs]
  const GR = [GA[0] - TK.vDepth * gs, GA[1] + half * gs]
  const GP = GA[0] + TK.vApex * gs
  // back mini, ×3
  const TBk = { x: 330 - 100 * 3, y: 292, s: 3 }
  const BX = (mm) => TBk.x + mm * 3
  const bA = [BX(ax), 292]
  const bL = [BX(armx), 292 - half * 3]
  const bR = [BX(armx), 292 + half * 3]
  return (
    <Fig h={320} view="Plan · V-tack at the tip" scale="tip ×9 · geometry ×12">
      <T x={30} y={44} s={11.5} c={C.text}>
        Three holes near the tip, then the V
      </T>
      <ClipRect x={30} y={50} w={290} h={200}>
        <StrapPlan T={Tp} o={o} edge={C.paint} holes={{ xs: [95] }} />
      </ClipRect>
      <Brk x={30} y1={CY - 86} y2={CY + 86} />
      {hole(L)}
      {hole(A)}
      {hole(R)}
      <Cord d={`M${L[0]} ${L[1]} L${A[0]} ${A[1]}`} w={cw} />
      <Cord d={`M${A[0]} ${A[1]} L${R[0]} ${R[1]}`} w={cw} />
      <Arrow d={`M${L[0] - 6} ${L[1] - 16} L${A[0] - 8} ${A[1] - 16}`} w={1.4} />
      <Arrow d={`M${A[0] - 8} ${A[1] + 16} L${R[0] - 6} ${R[1] + 16}`} w={1.4} />
      <Num x={L[0] - 18} y={L[1] - 4} n={1} r={7} />
      <Num x={A[0] + 18} y={A[1] - 14} n={2} r={7} />
      <Num x={R[0] - 18} y={R[1] + 4} n={3} r={7} />
      <HDim x1={A[0]} x2={X(120)} y={248} f1={CY + 8} f2={CY + 4} text="≈4.5 to the point" ty={262} />
      <Lead p={[X(95), CY + 9]} t={[44, 270]} a="start" text="last adjustment hole" s={10.5} c={C.dim} />
      <T x={30} y={294} s={10.5} c={C.text}>
        Saddle-stitch 1 → 2 (down one arm), 2 → 3 (up the other),
      </T>
      <T x={30} y={308} s={10.5} c={C.text}>
        then tie off behind and seal. Same heavy cord as the tacks.
      </T>

      <Sep x1={322} y1={30} x2={322} y2={278} />
      <Tag x={332} y={40}>
        Hole geometry ×12
      </Tag>
      <line x1={358} y1={GA[1]} x2={GP + 6} y2={GA[1]} stroke={C.steel} strokeWidth="0.8" strokeDasharray="8 3 2 3" />
      <path d={`M${GP - 40} ${GA[1] - 52} Q${GP - 6} ${GA[1] - 40} ${GP} ${GA[1]} Q${GP - 6} ${GA[1] + 40} ${GP - 40} ${GA[1] + 52}`} fill="none" stroke={C.paint} strokeWidth="1.6" strokeDasharray="4 3" />
      <line x1={GL[0]} y1={GL[1]} x2={GA[0]} y2={GA[1]} stroke={C.thread} strokeWidth="2.2" />
      <line x1={GA[0]} y1={GA[1]} x2={GR[0]} y2={GR[1]} stroke={C.thread} strokeWidth="2.2" />
      {[GL, GA, GR].map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={5} fill={C.hole} stroke="#e7c48f" strokeWidth="0.8" />
      ))}
      <T x={GP - 4} y={GA[1] + 16} a="end" s={10} c={C.faint}>
        point
      </T>
      <VDim x={350} y1={GL[1]} y2={GR[1]} f1={GL[0] - 6} f2={GR[0] - 6} text="4.5" tx={346} a="end" />
      <HDim x1={GL[0]} x2={GA[0]} y={176} f1={GR[1] + 6} f2={GA[1] + 6} text="≈3.4" ty={190} />
      <HDim x1={GA[0]} x2={GP} y={176} f1={GA[1] + 6} f2={GA[1] + 4} text="4.5" ty={190} />
      <Note x={332} y={214} lines={['measured on a commercial', 'strap: 4.6 across, 3.4 deep,', 'apex 4.6 from the point']} s={10} lh={13} c={C.faint} />
      <T x={332} y={262} s={10.5} c={C.text}>
        Behind: knot, sealed
      </T>
      <ClipRect x={326} y={268} w={140} h={50}>
        <StrapPlan T={TBk} o={LONG({ x0: 100 })} face="lining" edge={C.paint} />
      </ClipRect>
      <Cord d={`M${bL[0]} ${bL[1]} L${bA[0]} ${bA[1]} L${bR[0]} ${bR[1]}`} w={2.6} />
      <circle cx={bR[0] - 4} cy={bR[1] + 4} r={3.2} fill="#e4d4ae" stroke="#5d4c31" strokeWidth="0.7" />
      <circle cx={bR[0] - 7} cy={bR[1] + 7} r={1.6} fill="#3b2a1d" />
      <T x={400} y={300} s={10} c={C.faint}>
        lining side
      </T>
    </Fig>
  )
}

/* 6 · Side-stitch, row-stitch and stitchless compared (short pieces) */
function MnStyles() {
  const s = 2.4
  const x0 = 50
  const rows = [
    { c: 74, key: 'side', name: 'Side-stitch', lines: ['1 stitch each side at the lug end', '2 stitches at the fixed keeper', 'built 2.5 mm thick by one maker'] },
    { c: 172, key: 'row', name: 'Row-stitch', lines: ['one row across at the lug end', 'no side seams', 'keeper fixing: not stated'] },
    { c: 266, key: 'none', name: 'Stitchless', lines: ['nothing sewn at the lug end:', 'glue and edge paint carry it', '2 stitches at the fixed keeper'] },
  ]
  return (
    <Fig h={340} view="Plan · three minimal-stitch styles" scale="short piece · plan ×2.4">
      {rows.map((r) => {
        const P = { x: x0, y: r.c, s }
        const at = (x, y) => px(P, x, y)
        const keeperSt = r.key !== 'row'
        const kw = widthAt(70, SHORT()) / 2
        return (
          <g key={r.key}>
            <StrapPlan T={P} o={SHORT()} edge={C.paint} keepers={[{ x: 70 }]} />
            <SpringBar x={x0} y1={r.c - 29} y2={r.c + 29} r={2.2} />
            <Buckle x={x0 + 80 * s} y={r.c} w={18 * s} L={30} />
            {r.key === 'side' &&
              [-1, 1].map((sg) => (
                <g key={sg}>
                  <StitchSeg a={at(4.5, sg * 7.4)} b={at(8, sg * 7.4)} w={1.8} />
                  <circle cx={at(6.2, 0)[0]} cy={at(0, sg * 7.4)[1]} r={9} fill="none" stroke={C.brass} strokeWidth="1" strokeDasharray="3 2" />
                </g>
              ))}
            {r.key === 'row' && (
              <g>
                <StitchRow pts={range(-7.5, 7.5, 5).map((y) => at(6, y))} w={1.6} />
                <rect x={at(6, 0)[0] - 7} y={at(0, -9)[1]} width={14} height={18 * s} rx="5" fill="none" stroke={C.brass} strokeWidth="1" strokeDasharray="3 2" />
              </g>
            )}
            {r.key === 'none' && <rect x={at(1, 0)[0]} y={at(0, -9.2)[1]} width={12 * s} height={18.4 * s} rx="5" fill="rgba(123,165,131,0.18)" stroke={C.emerald} strokeWidth="1" strokeDasharray="3 2" />}
            {keeperSt &&
              [-1, 1].map((sg) => (
                <g key={sg}>
                  <StitchSeg a={at(68.2, sg * (kw - 2.2))} b={at(71.8, sg * (kw - 2.2))} w={1.8} />
                  <circle cx={at(70, 0)[0]} cy={at(0, sg * (kw - 2.2))[1]} r={8} fill="none" stroke={C.brass} strokeWidth="1" strokeDasharray="3 2" />
                </g>
              ))}
            {r.key === 'side' && (
              <g>
                <T x={at(6, 0)[0]} y={r.c + 39} a="middle" s={10} c={C.faint}>
                  lug end
                </T>
                <T x={at(70, 0)[0] + 10} y={r.c + 39} a="end" s={10} c={C.faint}>
                  fixed keeper
                </T>
                <T x={x0 + 80 * s + 6} y={r.c + 39} a="start" s={10} c={C.faint}>
                  buckle
                </T>
              </g>
            )}
            <T x={290} y={r.c - 22} s={12.5} c={C.text} w="600">
              {r.name}
            </T>
            {r.lines.map((l, i) => (
              <T key={i} x={290} y={r.c - 5 + i * 14} s={10.5} c={i === 2 && r.key === 'row' ? C.faint : C.dim}>
                {l}
              </T>
            ))}
          </g>
        )
      })}
      <Sep x1={14} y1={125} x2={466} y2={125} />
      <Sep x1={14} y1={219} x2={466} y2={219} />
      <Sep x1={14} y1={312} x2={466} y2={312} />
      <T x={14} y={330} s={10.5} c={C.text}>
        All three: lined, glued full-face, edges painted · thread 0.55 mm linen
      </T>
    </Fig>
  )
}

/* 7 · Holes, notch and keepers — the finished tack-stitched pair */
function MnFinish() {
  const s = 2.8
  const TL = { x: 92, y: 98, s }
  const TS = { x: 92, y: 214, s }
  const hx = holeXs(120)
  const tx = TK.down - LUG
  const tyL = 10 - TK.in
  const P = (Tr, x, y) => px(Tr, x, y)
  const ax = 120 - TK.vApex
  const armx = ax - TK.vDepth
  const kw = widthAt(70, SHORT()) / 2
  const bfx = 80 + 1.1 + 1.2 - TK.down
  const bty = widthAt(bfx, SHORT()) / 2 - TK.in
  return (
    <Fig h={330} view="Plan · finished tack-stitched pair" scale="120 / 80 · 20 → 18 mm">
      <StrapPlan T={TL} o={LONG()} holes={{}} edge={C.paint} />
      <SpringBar x={TL.x} y1={TL.y - 34} y2={TL.y + 34} r={2.5} qr />
      {[-1, 1].map((sg) => (
        <TackPlan key={sg} h={P(TL, tx, sg * tyL)} e={P(TL, tx, sg * 10)} w={2.6} />
      ))}
      {[[armx, -TK.vSpread / 2], [ax, 0], [armx, TK.vSpread / 2]].map(([x, y], i) => {
        const [cx, cy] = P(TL, x, y)
        return <circle key={i} cx={cx} cy={cy} r={1.6} fill={C.hole} />
      })}
      <Cord d={poly([P(TL, armx, -TK.vSpread / 2), P(TL, ax, 0), P(TL, armx, TK.vSpread / 2)], false)} w={2.4} />

      <StrapPlan T={TS} o={SHORT()} edge={C.paint} slot={{ x: 80 }} keepers={[{ x: 70 }, { x: 52, float: true }]} />
      <SpringBar x={TS.x} y1={TS.y - 34} y2={TS.y + 34} r={2.5} qr />
      {[-1, 1].map((sg) => (
        <g key={sg}>
          <TackPlan h={P(TS, tx, sg * tyL)} e={P(TS, tx, sg * 10)} w={2.6} />
          <TackPlan h={P(TS, bfx, sg * bty)} e={P(TS, bfx, sg * widthAt(bfx, SHORT()) / 2)} w={2.6} />
          <StitchSeg a={P(TS, 68.3, sg * (kw - 2))} b={P(TS, 71.7, sg * (kw - 2))} w={1.6} />
        </g>
      ))}
      <Buckle x={TS.x + 80 * s} y={TS.y} w={50} L={41} />

      <Cap p={[TL.x + 4, TL.y - 24]} x={16} y={36} a="start" text="quick-release bars" sub="knob out through a notch in the tail" />
      <Cap p={[TL.x + hx[3] * s, TL.y]} x={330} y={36} text="7 holes at 7 mm" />
      <Cap p={[P(TL, ax, 0)[0] - 4, TL.y - 3]} x={466} y={62} a="end" text="V-tack" />
      <Cap p={[P(TL, tx, 10)[0], P(TL, tx, 10)[1] + 2]} x={60} y={150} a="start" text="corner tacks: cord round the edge" />
      <Cap p={[380, TL.y + widthAt(103, LONG()) / 2 * s]} x={466} y={150} a="end" text="no perimeter seam" sub="painted edge" />
      <Cap p={P(TS, bfx, -widthAt(bfx, SHORT()) / 2)} x={322} y={176} a="start" text="buckle-fold tacks" />
      <Cap p={[TS.x + 52 * s, TS.y + 27]} x={206} y={270} text="floating keeper" />
      <Cap p={P(TS, 70, kw - 2)} x={300} y={290} text="fixed keeper · 2 stitches" />
      <ClipCircle cx={430} cy={272} r={30}>
        <rect x={398} y={240} width={66} height={66} fill="url(#sk-lin)" />
        <rect x={398} y={240} width={14} height={66} fill="url(#sk-top)" />
        <rect x={407} y={256} width={6} height={30} rx="3" fill={C.ground} stroke={EDGE} strokeWidth="0.8" />
        <rect x={402} y={240} width={6} height={66} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" />
        <rect x={406} y={264} width={8} height={7} rx="2" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.6" />
      </ClipCircle>
      <T x={430} y={318} a="middle" s={10.5} c={C.dim}>
        QR notch (back)
      </T>
      <T x={16} y={318} s={10.5} c={C.faint}>
        Holes, slot and notch as the classic strap.
      </T>
    </Fig>
  )
}

/* 8 · Know its limits */
function CornerMini({ x, y, s, kind }) {
  const o = { x0: 0, x1: 40, w0: 20, w1: 20, tip: 'square' }
  const P = { x, y, s }
  const xe = x + 34 * s
  const top = y - 10 * s
  return (
    <g>
      <ClipRect x={x - 12} y={top - 20} w={34 * s + 12} h={20 * s + 40}>
        <StrapPlan T={P} o={o} edge={C.paint} stitch={kind === 'seam' ? { m: 3, p: 3, from: 3.5 } : undefined} />
      </ClipRect>
      <SpringBar x={x + LUG * s} y1={top - 5} y2={y + 10 * s + 5} r={2} />
      <Brk x={xe} y1={top - 3} y2={y + 10 * s + 3} />
      {kind === 'tack' &&
        [-1, 1].map((sg) => <TackPlan key={sg} h={[x + TK.down * s, y + sg * (10 - TK.in) * s]} e={[x + TK.down * s, y + sg * 10 * s]} w={2.6} />)}
      {kind === 'glue' && (
        <g>
          <path d={`M${x + 1} ${top} L${x + 14 * s} ${top} Q${x + 9 * s} ${top - 6} ${x + 2} ${top - 13} Z`} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="0.8" />
          <path d={`M${x + 1} ${top} L${x + 14 * s} ${top}`} stroke="rgba(0,0,0,0.45)" strokeWidth="1.4" />
          <Arrow d={`M${x + 16 * s} ${top - 2} Q${x + 15 * s} ${top - 14} ${x + 9 * s} ${top - 15}`} c="ruby" w={1.4} />
        </g>
      )}
    </g>
  )
}
function FlatPeel({ cx, y, w, tT, tL, peel, pl = 22, ang = 22 }) {
  const x1 = cx - w / 2
  const x2 = cx + w / 2
  const yi = y + tT
  const a = (ang * Math.PI) / 180
  const xa = peel ? x2 - pl : x2
  const lin = peel
    ? [[x1, yi], [xa, yi], [xa + pl * Math.cos(a), yi + pl * Math.sin(a)], [xa + pl * Math.cos(a) - tL * Math.sin(a), yi + pl * Math.sin(a) + tL * Math.cos(a)], [xa, yi + tL], [x1, yi + tL]]
    : [[x1, yi], [x2, yi], [x2, yi + tL], [x1, yi + tL]]
  return (
    <g>
      <path d={poly(lin)} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" />
      <rect x={x1} y={y} width={w} height={tT} fill="url(#sk-topS)" stroke={EDGE} strokeWidth="0.8" />
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={GRAIN} strokeWidth="1.6" />
      <GlueLine x1={x1 + 2} x2={xa - 2} y={yi} />
      <path d={`M${x1 + 3} ${y - 1} L${x1 - 1.5} ${y + 3} L${x1 - 1.5} ${yi + tL - 3} L${x1 + 3} ${yi + tL + 1}`} fill="none" stroke={C.paint} strokeWidth="3" strokeLinejoin="round" />
      {peel ? (
        <g>
          <path d={`M${x2 - 3} ${y - 1} L${x2 + 1.5} ${y + 3} L${x2 + 1.5} ${yi - 0.5}`} fill="none" stroke={C.paint} strokeWidth="3" strokeLinejoin="round" />
          <path d={`M${x2 + 3} ${yi + 1} l3 3 l-3 2 l3 3`} fill="none" stroke={C.ruby} strokeWidth="1.2" />
        </g>
      ) : (
        <path d={`M${x2 - 3} ${y - 1} L${x2 + 1.5} ${y + 3} L${x2 + 1.5} ${yi + tL - 3} L${x2 - 3} ${yi + tL + 1}`} fill="none" stroke={C.paint} strokeWidth="3" strokeLinejoin="round" />
      )}
    </g>
  )
}
function MnLimits() {
  const ms = 3.2
  const minis = [
    { x: 24, kind: 'glue', name: 'No-sew: glue only', sub: 'peel starts at a corner' },
    { x: 180, kind: 'tack', name: 'Minimal: glue + tacks', sub: 'tacks stop peel at the corners' },
    { x: 340, kind: 'seam', name: 'Full perimeter seam', sub: 'the seam holds every edge' },
  ]
  const yS = 232
  const sw = 20 * 5.6
  const tT = 1.2 * 8
  const tL = 0.8 * 8
  const pg = domeG({ cx: 395, yb: yS + tT + 4, s: 5.6, k: 8, inset: 4, fh: 2.2 })
  const pl = 20
  const pa = (22 * Math.PI) / 180
  const pyi = pg.yb
  const plin = [[pg.x1, pyi], [pg.x2 - pl, pyi], [pg.x2 - pl + pl * Math.cos(pa), pyi + pl * Math.sin(pa)], [pg.x2 - pl + pl * Math.cos(pa) - pg.lt * Math.sin(pa), pyi + pl * Math.sin(pa) + pg.lt * Math.cos(pa)], [pg.x2 - pl, pyi + pg.lt], [pg.x1, pyi + pg.lt]]
  const cases = [
    { cx: 85, ok: true, name: 'Firm, dense, flat', sub: 'the glue holds the edge' },
    { cx: 240, ok: false, name: 'Soft or oily top', sub: 'peels at the edge' },
    { cx: 395, ok: false, name: 'Padded stack', sub: 'peels without a seam' },
  ]
  return (
    <Fig h={330} view="Comparison · where minimal stitching works" scale="schematic">
      <Tag x={14} y={38}>
        Between no-sew and a full seam
      </Tag>
      <rect x={150} y={46} width={166} height={120} rx="8" fill="rgba(208,168,79,0.06)" stroke={C.brass} strokeWidth="0.9" strokeDasharray="3 3" />
      {minis.map((m) => (
        <g key={m.kind}>
          <CornerMini x={m.x} y={94} s={ms} kind={m.kind} />
          <T x={m.x + 52} y={142} a="middle" s={11.5} c={m.kind === 'tack' ? C.brass : C.text} w="600">
            {m.name}
          </T>
          <T x={m.x + 52} y={156} a="middle" s={10} c={C.faint}>
            {m.sub}
          </T>
        </g>
      ))}

      <Sep x1={14} y1={176} x2={466} y2={176} />
      <Tag x={14} y={194}>
        Which stacks it suits · section across
      </Tag>
      <FlatPeel cx={85} y={yS} w={sw} tT={tT} tL={tL} />
      <FlatPeel cx={240} y={yS} w={sw} tT={tT} tL={tL} peel />
      <Arrow d={`M${240 + sw / 2 + 12} ${yS + 4} q8 10 0 22`} c="ruby" w={1.3} />
      <path d={poly(plin)} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" />
      <DomeX g={pg} lining={false} />
      <path d={`M${pg.x1 + 2.6} ${pg.yUp(pg.x1) - 0.8} L${pg.x1 - 1} ${pg.yUp(pg.x1) + 1.6} L${pg.x1 - 1} ${pg.yb + pg.lt - 1.6} L${pg.x1 + 2.6} ${pg.yb + pg.lt + 0.8}`} fill="none" stroke={C.paint} strokeWidth="2.6" strokeLinejoin="round" />
      <path d={`M${pg.x2 + 3} ${pyi + 1} l3 3 l-3 2 l3 3`} fill="none" stroke={C.ruby} strokeWidth="1.2" />
      <Arrow d={`M${pg.x2 + 12} ${pyi - 8} q8 10 0 22`} c="ruby" w={1.3} />
      {cases.map((c) => (
        <g key={c.name}>
          <Verdict x={c.cx - 56} y={284} ok={c.ok} r={7} />
          <T x={c.cx - 44} y={288} s={11.5} c={c.ok ? C.emerald : C.ruby} w="600">
            {c.name}
          </T>
          <T x={c.cx - 44} y={302} s={10} c={C.faint}>
            {c.sub}
          </T>
        </g>
      ))}
      <T x={240} y={324} a="middle" s={11} c={C.text}>
        The glue carries the load; the tacks only stop peel at the corners.
      </T>
    </Fig>
  )
}
/* ================================================================== */
/* RALLY STRAP — new steps (sm-rally)                                  */
/* ================================================================== */
// Measured layouts on a 20 mm strap, lug-end mm (x along, y across).
// Graded pair offset ±4.9 is scaled from ±5.4 measured on a 22 mm strap.
const RALLY = {
  graded: [
    ...[14, 22, 30, 38].map((x) => ({ x, y: 0, d: 4.75 })),
    ...[10, 18, 26, 34, 42].flatMap((x) => [-1, 1].map((sg) => ({ x, y: sg * 4.9, d: 2.35 }))),
  ],
  uniform: range(0, 9, 9).flatMap((i) => {
    const x = 10 + i * 3.2
    return i % 2 ? [-1, 1].map((sg) => ({ x, y: sg * 4.7, d: 1.9 })) : [{ x, y: 0, d: 1.9 }]
  }),
  diamond: [
    ...[13, 24, 35, 46].map((x) => ({ x, y: 0, d: 3.5 })),
    ...[18.5, 29.5, 40.5].flatMap((x) => [-1, 1].map((sg) => ({ x, y: sg * 4.2, d: 1.7 }))),
  ],
}
// A rally piece from its lug end (px x0), shown for `len` mm, then broken.
function RallySeg({ x0, y, s, len, list, o = LONG({ x0: -LUG }), stitch, look = 'through', bar = true }) {
  const Tr = { x: x0 + LUG * s, y, s }
  const xe = x0 + len * s
  const hw = (widthAt(0, o) / 2) * s
  return (
    <g>
      <ClipRect x={x0 - 14} y={y - hw - 14} w={xe - x0 + 14} h={2 * hw + 28}>
        <StrapPlan T={Tr} o={o} edge={C.paint} stitch={stitch} />
        {list.map((h, i) => (
          <Opening key={i} cx={x0 + h.x * s} cy={y + h.y * s} r={(h.d / 2) * s} look={look} />
        ))}
      </ClipRect>
      {bar && <SpringBar x={Tr.x} y1={y - hw - 5} y2={y + hw + 5} r={2.3} />}
      <Brk x={xe} y1={y - hw - 3} y2={y + hw + 3} />
    </g>
  )
}

/* Choose the pattern — graded, uniform Rallye, diamond on a 20 mm strap */
function RaPatterns() {
  const s = 3.3
  const x0 = 40
  const X = (mm) => x0 + mm * s
  const rows = [
    { c: 82, k: 'graded', name: 'Graded racing', lines: ['4 large + 5 staggered pairs = 14', 'large Ø ≈4.5–5, ≈8 mm apart', 'small Ø 2.2–2.5, pairs midway'] },
    { c: 178, k: 'uniform', name: 'Uniform Rallye', lines: ['15 equal holes, 1-2-1-2 quincunx', 'Ø ≈1.8–2 · side columns ±4.7', 'a row every ≈3.2 mm'] },
    { c: 272, k: 'diamond', name: 'Diamond', lines: ['large ≈3.5 on the centre, every ≈11', 'small 1.7 in pairs at ±4.2', 'pairs midway between the large'] },
  ]
  return (
    <Fig h={340} view="Plan · three opening layouts" scale="20 mm strap · true plan ×3.3">
      {rows.map((r) => (
        <g key={r.k}>
          <RallySeg x0={x0} y={r.c} s={s} len={56} list={RALLY[r.k]} stitch={{ m: 2.5, p: 3, from: 3 }} />
          <T x={250} y={r.c - 18} s={12.5} c={C.text} w="600">
            {r.name}
          </T>
          {r.lines.map((l, i) => (
            <T key={i} x={250} y={r.c - 1 + i * 14} s={10.5} c={C.dim}>
              {l}
            </T>
          ))}
        </g>
      ))}
      <HDim x1={X(14)} x2={X(22)} y={41} f1={82} f2={82} text="8" ty={37} />
      <HDim x1={X(30)} x2={X(38)} y={41} f1={82} f2={82} text="8" ty={37} />
      <HDim x1={X(10)} x2={X(13.2)} y={137} f1={178} f2={178 - 4.7 * s} text="3.2" tx={X(11.6) + 14} a="start" ty={135} />
      <HDim x1={X(13)} x2={X(24)} y={231} f1={272} f2={272} text="11" ty={227} />
      <HDim x1={X(35)} x2={X(46)} y={231} f1={272} f2={272} text="11" ty={227} />
      <Sep x1={14} y1={128} x2={466} y2={128} />
      <Sep x1={14} y1={222} x2={466} y2={222} />
      <Sep x1={14} y1={314} x2={466} y2={314} />
      <T x={14} y={332} s={10.5} c={C.faint}>
        Openings through both layers, as measured · put an identical block on both pieces
      </T>
    </Fig>
  )
}

/* Size the openings — diameters per layout, and the width ratios */
function RaSizes() {
  const sc = 6.4
  const y0 = 60
  const H = 15.4 * sc
  const pair = (y, off, d) => [-1, 1].map((sg) => ({ x: sg * off, y, d }))
  const sw = [
    { cx: 84, name: 'Graded racing', holes: [{ x: 0, y: 3.6, d: 4.75 }, { x: 0, y: 11.6, d: 4.75 }, ...pair(7.6, 4.9, 2.35)], l1: 'large Ø 4.5–5', l2: 'small Ø 2.2–2.5', big: 4.75, small: 2.35, sy: 7.6, so: 4.9 },
    { cx: 240, name: 'Uniform Rallye', holes: [{ x: 0, y: 2.1, d: 1.9 }, ...pair(5.3, 4.7, 1.9), { x: 0, y: 8.5, d: 1.9 }, ...pair(11.7, 4.7, 1.9)], l1: 'all Ø 1.8–2', l2: 'side columns ±4.7', big: 1.9 },
    { cx: 396, name: 'Diamond', holes: [{ x: 0, y: 2.2, d: 3.5 }, { x: 0, y: 13.2, d: 3.5 }, ...pair(7.7, 4.2, 1.7)], l1: 'large Ø ≈3.5', l2: 'small Ø ≈1.7', big: 3.5, small: 1.7, sy: 7.7, so: 4.2 },
  ]
  const rows = [
    ['graded · large', '0.22', '4.0', '4.5–5', '4.8'],
    ['graded · small', '0.11', '2.0', '2.2–2.5', '2.4'],
    ['uniform Rallye', '0.10', '1.8', '1.8–2', '2.2'],
    ['diamond · large', '≈0.175', '3.2', '3.5', '3.9'],
    ['diamond · small', '≈0.085', '1.5', '1.7', '1.9'],
  ]
  const cols = [262, 330, 398]
  return (
    <Fig h={340} view="Plan + table · opening sizes" scale="20 mm strap · swatches ×6.4">
      {sw.map((w) => {
        const x1 = w.cx - 10 * sc
        const x2 = w.cx + 10 * sc
        const first = w.holes[0]
        const fy = y0 + first.y * sc
        const R = (w.big / 2) * sc
        return (
          <g key={w.name}>
            <T x={w.cx} y={48} a="middle" s={11.5} c={C.text} w="600">
              {w.name}
            </T>
            <rect x={x1} y={y0} width={x2 - x1} height={H} fill="url(#sk-top)" />
            <line x1={x1} y1={y0} x2={x1} y2={y0 + H} stroke={C.paint} strokeWidth="2.4" />
            <line x1={x2} y1={y0} x2={x2} y2={y0 + H} stroke={C.paint} strokeWidth="2.4" />
            <line x1={w.cx} y1={y0 + 2} x2={w.cx} y2={y0 + H - 2} stroke={C.steel} strokeWidth="0.7" strokeDasharray="6 3 2 3" opacity="0.8" />
            {w.holes.map((h, i) => (
              <Opening key={i} cx={w.cx + h.x * sc} cy={y0 + h.y * sc} r={(h.d / 2) * sc} />
            ))}
            <HBrk x1={x1} x2={x2} y={y0} />
            <HBrk x1={x1} x2={x2} y={y0 + H} />
            <path d={`M${w.cx - R} ${fy} H${w.cx + R} M${w.cx - R} ${fy - 3} v6 M${w.cx + R} ${fy - 3} v6`} stroke={C.brass} strokeWidth="1.1" />
            {w.small && (
              <path
                d={`M${w.cx + w.so * sc - (w.small / 2) * sc} ${y0 + w.sy * sc} H${w.cx + w.so * sc + (w.small / 2) * sc}`}
                stroke={C.text}
                strokeWidth="1.1"
              />
            )}
            <T x={w.cx} y={174} a="middle" s={10.5} c={C.brass}>
              {w.l1}
            </T>
            <T x={w.cx} y={188} a="middle" s={10.5} c={w.small ? C.text : C.dim}>
              {w.l2}
            </T>
          </g>
        )
      })}
      <Sep x1={14} y1={199} x2={466} y2={199} />
      <rect x={300} y={204} width={60} height={118} rx="4" fill="rgba(208,168,79,0.07)" stroke={C.brass} strokeWidth="0.9" strokeDasharray="3 3" />
      <T x={24} y={218} s={10.5} c={C.faint}>
        opening
      </T>
      <T x={206} y={218} a="end" s={10.5} c={C.faint}>
        × width
      </T>
      {['18 mm', '20 mm', '22 mm'].map((h, i) => (
        <g key={h}>
          <T x={cols[i]} y={218} a="middle" s={10.5} c={C.text}>
            {h}
          </T>
          <T x={cols[i]} y={230} a="middle" s={10} c={i === 1 ? C.brass : C.faint}>
            {i === 1 ? 'measured' : 'scaled'}
          </T>
        </g>
      ))}
      <line x1={20} y1={236} x2={440} y2={236} stroke={C.line} strokeWidth="1" />
      {rows.map((r, i) => {
        const y = 252 + i * 16
        return (
          <g key={r[0]}>
            <T x={24} y={y} s={11} c={C.text}>
              {r[0]}
            </T>
            <T x={206} y={y} a="end" s={10.5} mono c={C.dim}>
              {r[1]}
            </T>
            {[r[2], r[3], r[4]].map((v, j) => (
              <T key={j} x={cols[j]} y={y} a="middle" s={10.5} mono c={j === 1 ? C.brass : C.dim}>
                {v}
              </T>
            ))}
          </g>
        )
      })}
      <T x={240} y={334} a="middle" s={10.5} c={C.faint}>
        Round to the nearest punch you own; keep the pairing as your house standard.
      </T>
    </Fig>
  )
}

/* Place the block — 10 → 40–43 mm below the lug end, ≥ 1.5 mm web */
function RaBlock() {
  const s = 2.9
  const X0 = 40
  const YL = 86
  const YS = 180
  const X = (mm) => X0 + mm * s
  const hw = 10 * s
  const TLb = { x: X0 + LUG * s, y: YL, s }
  const TSb = { x: X0 + LUG * s, y: YS, s }
  const G = RALLY.graded
  const ops = (Y) => G.map((h, i) => <Opening key={i} cx={X(h.x)} cy={Y + h.y * s} r={(h.d / 2) * s} />)
  const block = (Y) => <rect x={X(8.8)} y={Y - 7.6 * s} width={34.4 * s} height={15.2 * s} rx="4" fill="none" stroke={C.brass} strokeWidth="1" strokeDasharray="4 3" />
  const panel = (px0, m, ok) => {
    const ye = 262
    const sy = ye + m * 10
    const hy = ye + 5.075 * 10
    const hr = 1.175 * 10
    const hxp = px0 + 110
    const web = 3.9 - m
    return (
      <g>
        <Verdict x={px0 + 10} y={248} ok={ok} r={7} />
        <T x={px0 + 22} y={252} s={11} c={ok ? C.emerald : C.ruby}>
          {`stitch ${m} mm in → web ${web.toFixed(1)} ${ok ? '≥' : '<'} 1.5`}
        </T>
        <ClipRect x={px0} y={ye - 2} w={220} h={72}>
          <rect x={px0 + 4} y={ye} width={212} height={72} fill="url(#sk-top)" />
          <Opening cx={hxp} cy={hy} r={hr} />
          <StitchRow pts={range(px0 + 14, px0 + 206, 6).map((x) => [x, sy])} w={1.6} />
          {range(px0 + 14, px0 + 206, 6).map((x) => (
            <circle key={x} cx={x} cy={sy} r={1.2} fill={C.hole} />
          ))}
        </ClipRect>
        <line x1={px0 + 4} y1={ye} x2={px0 + 216} y2={ye} stroke={C.paint} strokeWidth="2.6" />
        <rect x={hxp - 3} y={sy + 1} width={6} height={hy - hr - sy - 1} fill={ok ? 'rgba(123,165,131,0.55)' : 'rgba(194,88,99,0.6)'} />
        <VDim x={px0 + 40} y1={ye} y2={sy} text={String(m)} tx={px0 + 46} pill />
        <VDim x={hxp + 22} y1={sy} y2={hy - hr} text={web.toFixed(1)} tx={hxp + 28} pill />
        <T x={px0 + 212} y={ye - 4} a="end" s={10} c={C.faint}>
          edge
        </T>
      </g>
    )
  }
  return (
    <Fig h={340} view="Plan · placing the block" scale="plan ×2.9 · detail ×10">
      <StrapPlan T={TLb} o={LONG({ x0: -LUG })} holes={{}} stitch={{ m: 2, p: 3, from: 3 }} edge={C.paint} />
      {ops(YL)}
      {block(YL)}
      <SpringBar x={TLb.x} y1={YL - hw - 5} y2={YL + hw + 5} r={2.3} />
      <StrapPlan T={TSb} o={SHORT({ x0: -LUG })} stitch={{ m: 2, p: 3, from: 3, to: 66 }} edge={C.paint} keepers={[{ x: 70 }, { x: 52, float: true }]} />
      {ops(YS)}
      {block(YS)}
      <SpringBar x={TSb.x} y1={YS - hw - 5} y2={YS + hw + 5} r={2.3} />
      <Buckle x={TSb.x + 80 * s} y={YS} w={52} L={42} />
      <HDim x1={X0} x2={X(10)} y={48} f1={YL - hw} f2={YL - 4.9 * s - 5} text="10" ty={44} />
      <HDim x1={X0} x2={X(43.2)} y={34} f1={YL - hw} f2={YL - hw} text="40–43" ty={31} />
      <HDim x1={X(43.2)} x2={X(55.1)} y={48} f1={YL - hw} f2={YL - 4} text="room" ty={44} />
      <Cap p={[X(100), YL - hw + 2 * s]} x={466} y={40} a="end" text="racing straps stitch ≈2 mm in" c={C.dim} s={10.5} />
      <T x={X(26)} y={136} a="middle" s={10.5} c={C.dim}>
        identical block on both pieces
      </T>
      <Cap p={[X(76.1), YL + 2]} x={330} y={136} text="adjustment holes" c={C.dim} s={10.5} />
      <Cap p={[TSb.x + 52 * s, YS + hw + 1]} x={190} y={226} a="end" text="keepers sit below the block" c={C.dim} s={10.5} />
      <Sep x1={14} y1={232} x2={466} y2={232} />
      {panel(14, 2, true)}
      <Sep x1={240} y1={240} x2={240} y2={334} />
      {panel(246, 3, false)}
    </Fig>
  )
}
// Outline from width stations [[x, w], …] (mm), square end with corner radius rc.
function stationPts(st, rc = 1, n = 60) {
  const w = (x) => {
    for (let i = 1; i < st.length; i++)
      if (x <= st[i][0]) {
        const [a, wa] = st[i - 1]
        const [b, wb] = st[i]
        return wa + ((x - a) / (b - a)) * (wb - wa)
      }
    return st[st.length - 1][1]
  }
  const end = st[st.length - 1][0]
  const h = w(end) / 2
  const up = range(st[0][0], end - rc, n).map((x) => [x, -w(x) / 2])
  const corner = range(0, 1, 5).map((t) => {
    const a = -Math.PI / 2 + (t * Math.PI) / 2
    return [end - rc + rc * Math.cos(a), -h + rc + rc * Math.sin(a)]
  })
  const upper = [...up, ...corner]
  const lower = upper.slice().reverse().map(([x, y]) => [x, -y])
  return [...upper, ...lower]
}
const track = (P, a, b, r, s) => {
  const [x1, y1] = P(a + r, -r)
  const [x2] = P(b - r, r)
  const [, y2] = P(0, r)
  const R = r * s
  return `M${r1(x1)} ${r1(y1)} L${r1(x2)} ${r1(y1)} A${R} ${R} 0 0 1 ${r1(x2)} ${r1(y2)} L${r1(x1)} ${r1(y2)} A${R} ${R} 0 0 1 ${r1(x1)} ${r1(y1)} Z`
}
const Groove = ({ d }) => (
  <g fill="none">
    <path d={d} stroke="#4a2c12" strokeWidth="1.8" />
    <path d={d} stroke="#e8bd84" strokeWidth="0.6" opacity="0.75" transform="translate(0 0.9)" />
  </g>
)

/* Variant · racing grooves — pressed U-closed grooves, staggered field, square tip */
function RaSpeedy() {
  const s = 3.25
  const Tr = { x: 40, y: 86, s }
  const P = (x, y) => [Tr.x + x * s, Tr.y + y * s]
  const X = (mm) => Tr.x + mm * s
  const pts = stationPts([[0, 20], [10, 20], [97, 15.5], [120, 12]], 1)
  const field = range(0, 10, 10).flatMap((i) => {
    const x = 14 + i * 3.5
    return i % 2 ? [{ x, y: 0 }] : [-1, 1].map((sg) => ({ x, y: sg * 2.3 }))
  })
  const holes = range(0, 5, 5).map((i) => 96 - i * 7.2)
  // press panel
  const cx = 128
  const ytop = 251.2
  const ybot = 262
  const pressed = [173, 183.8]
  const cur = 83
  const notch = (gx) => `L${gx - 3} ${ytop} L${gx} ${ytop + 2.8} L${gx + 3} ${ytop}`
  const topD = `M38 ${ytop} ${[cur, ...pressed].map(notch).join(' ')} L218 ${ytop} L218 ${ybot} L38 ${ybot} Z`
  // section panel
  const g = domeG({ cx: 356, yb: 262, s: 9, k: 9, inset: 4, fh: 1.3 })
  const gx = [-6.2, -5, 5, 6.2].map((m) => 356 + m * 9)
  const ox = [-2.3, 2.3].map((m) => 356 + m * 9)
  const orr = 1.5 * 9
  return (
    <Fig h={340} view="Plan + sections · racing grooves" scale="plan ×3.25 · sections ×9">
      <path d={pathOf(pts, Tr)} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="1" />
      <StitchRun T={Tr} pts={pts} m={2.75} p={3} from={4} />
      <Groove d={track(P, 9, 53, 6.2, s)} />
      <Groove d={track(P, 10.2, 51.8, 5, s)} />
      {field.map((h, i) => {
        const [x, y] = P(h.x, h.y)
        return <Opening key={i} cx={x} cy={y} r={1.5 * s} />
      })}
      {holes.map((x) => {
        const [hx, hy] = P(x, 0)
        return <circle key={x} cx={hx} cy={hy} r={0.9 * s} fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />
      })}
      <SpringBar x={Tr.x + LUG * s} y1={Tr.y - 10 * s - 5} y2={Tr.y + 10 * s + 5} r={2.3} />
      <VDim x={X(120) + 8} y1={Tr.y - 6 * s} y2={Tr.y + 6 * s} f1={X(120) - 3} f2={X(120) - 3} text="≈12" tx={X(120) + 12} />
      <HDim x1={X(96)} x2={X(120)} y={124} f1={Tr.y + 2} f2={Tr.y + 6 * s + 2} text="24" ty={138} />
      <Cap p={[X(9) + 1, Tr.y]} x={24} y={40} a="start" text="grooves close in a U" />
      <Cap p={[X(30), Tr.y - 6.2 * s]} x={160} y={40} a="start" text="3–4 lengthwise grooves" />
      <Cap p={[X(81.6), Tr.y]} x={466} y={40} a="end" text="6 holes, ≈7.2 mm apart" />
      <Cap p={[X(28), Tr.y + 2.3 * s]} x={130} y={146} text="staggered ≈3 mm openings" sub="punched through every layer" />
      <Cap p={[X(117), Tr.y + 5.6 * s]} x={466} y={154} a="end" text="tapered square tip" sub="≈15.5 at the holes → ≈12" />

      <Sep x1={14} y1={176} x2={466} y2={176} />
      <Num x={24} y={194} n={1} />
      <T x={36} y={198} s={11} c={C.text}>
        Press the grooves (top only)
      </T>
      <Slab x={26} y={ybot} w={204} h={12} kind="granite" />
      <path d={topD} fill="url(#sk-topS)" stroke={EDGE} strokeWidth="0.8" />
      <path d={`M38 ${ytop} ${[cur, ...pressed].map(notch).join(' ')} L218 ${ytop}`} fill="none" stroke={GRAIN} strokeWidth="1.6" />
      {pressed.map((x) => (
        <line key={x} x1={x - 1.5} y1={ytop + 1.2} x2={x + 1.5} y2={ytop + 1.2} stroke="#f0cf9a" strokeWidth="0.8" />
      ))}
      <line x1={72.2} y1={ytop - 3} x2={72.2} y2={ytop - 0.5} stroke={C.brass} strokeWidth="1" strokeDasharray="1.5 1.5" />
      <rect x={30} y={ytop - 8} width={51} height={8} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.7" />
      <Creaser x={cur} y={ytop + 2} ang={16} k={0.5} hot />
      <Cap p={[95, 222]} x={150} y={218} a="start" text="hot creaser" />
      <Cap p={[52, ytop - 6]} x={50} y={300} text="steel rule" c={C.dim} />
      <Cap p={[178, ytop + 1]} x={170} y={300} text="pressed grooves" sub="shiny lines in the grain" />
      <T x={128} y={334} a="middle" s={10} c={C.faint}>
        before laminating, the creaser run along the rule
      </T>

      <Sep x1={240} y1={184} x2={240} y2={336} />
      <Num x={254} y={194} n={2} />
      <T x={266} y={198} s={11} c={C.text}>
        Punch through the laminate
      </T>
      <DomeX g={g} stitch={{ m: 2.75 }} />
      {gx.map((x) => {
        const y = g.yUp(x)
        return <path key={x} d={`M${x - 2.5} ${y - 0.4} L${x} ${y + 2.2} L${x + 2.5} ${y - 0.4}`} fill="none" stroke="#3a2410" strokeWidth="1.3" />
      })}
      {ox.map((x) => (
        <g key={x}>
          <rect x={x - orr} y={g.crest - 4} width={2 * orr} height={g.yBot - g.crest + 8} fill={C.ground} />
          {[-1, 1].map((sg) => (
            <line key={sg} x1={x + sg * orr} y1={g.yUp(x + sg * orr)} x2={x + sg * orr} y2={g.yBot} stroke="#d9b07a" strokeWidth="1.8" />
          ))}
        </g>
      ))}
      <Cap p={[ox[1], g.yBot + 2]} x={356} y={300} text="≈3 mm, through every layer" sub="here a row of 2; the next row has 1" />
      <Cap p={[ox[1] + orr + 1, g.yb - 2]} x={462} y={216} a="end" text="raw core in the wall" sub="colour or seal it" />
      <Cap p={[gx[0], g.yUp(gx[0]) - 1]} x={262} y={222} a="start" text="grooves" />
      <T x={356} y={334} a="middle" s={10} c={C.faint}>
        reference strap ≈3.3 mm, thinly padded
      </T>
    </Fig>
  )
}

/* Variant · shell over a show lining — bar-tacks only, navy Epsom back */
function RaShell() {
  const s = 2.5
  const TL = { x: 52, y: 78, s }
  const TS = { x: 52, y: 170, s }
  const TB = { x: 52, y: 288, s }
  const D = RALLY.diamond.map((h) => ({ ...h, x: h.x - LUG })) // bar coords
  const ops = (Tr) => D.map((h, i) => <Opening key={i} cx={Tr.x + h.x * s} cy={Tr.y + h.y * s} r={(h.d / 2) * s} />)
  const tack = (Tr, o, a) =>
    [-1, 1].map((sg) => {
      const y = sg * (widthAt(a + 3.6, o) / 2 - 2.5)
      return <StitchRow key={sg} pts={range(a, a + 7.2, 3).map((x) => px(Tr, x, y))} w={1.7} c={NAVY} />
    })
  const shellFace = (Tr, o) => (
    <g>
      <path d={pathOf(outline(o), Tr)} fill="url(#mr-shell)" />
      <ClipPath d={pathOf(outline(o), Tr)}>
        <rect x={Tr.x + o.x0 * s} y={Tr.y - 9.5 * s} width={(o.x1 - o.x0) * s} height={3 * s} fill="rgba(255,236,210,0.16)" />
      </ClipPath>
    </g>
  )
  const lo = LONG()
  const so = SHORT()
  return (
    <Fig h={340} view="Plan · face and back" scale="plan ×2.5 · detail ×4.5">
      <MRDefs />
      {shellFace(TL, lo)}
      <StrapPlan T={TL} o={lo} face="none" edge="#2a1206" holes={{}} />
      {ops(TL)}
      {tack(TL, lo, 4.5)}
      <SpringBar x={TL.x} y1={TL.y - 30} y2={TL.y + 30} r={2.3} qr />
      {shellFace(TS, so)}
      <StrapPlan T={TS} o={so} face="none" edge="#2a1206" slot={{ x: 80 }} keepers={[{ x: 55, float: true }, { x: 68 }]} />
      {ops(TS)}
      {tack(TS, so, 71.5)}
      <SpringBar x={TS.x} y1={TS.y - 30} y2={TS.y + 30} r={2.3} qr />
      <Buckle x={TS.x + 80 * s} y={TS.y} w={46} L={38} />

      <Cap p={[118, TL.y - 18]} x={16} y={36} a="start" text="cognac shell cordovan" />
      <Cap p={[200, TL.y + 22]} x={180} y={126} text="no perimeter seam" sub="glue holds the body" />
      <Cap p={px(TS, 75, -6.5)} x={290} y={126} a="start" text="bar-tacks at both folds" sub="2–3 stitches a side, navy" />
      <Cap p={[TS.x + 21.9 * s, TS.y]} x={110} y={214} text="openings through both layers" sub="diamond: 3.5 / 1.7 mm" />
      {/* bar-tack detail */}
      <T x={466} y={34} a="end" s={10} c={C.brass}>
        lug-fold bar-tack ×4.5
      </T>
      <ClipCircle cx={420} cy={76} r={34}>
        <rect x={384} y={56} width={90} height={80} fill="url(#mr-shell)" />
        <line x1={384} y1={56} x2={474} y2={56} stroke="#2a1206" strokeWidth="2" />
        <line x1={384} y1={56} x2={384} y2={136} stroke="#2a1206" strokeWidth="2" />
        <StitchRow pts={range(384 + 6.6 * 4.5, 384 + 13.8 * 4.5, 3).map((x) => [x, 56 + 2.5 * 4.5])} w={2.6} c={NAVY} />
        <Opening cx={384 + 13 * 4.5} cy={56 + 10 * 4.5} r={1.75 * 4.5} />
      </ClipCircle>

      <Sep x1={14} y1={234} x2={466} y2={234} />
      <Tag x={14} y={250}>
        Back · navy Epsom show lining
      </Tag>
      <path d={pathOf(outline(lo), TB)} fill="url(#mr-epsom)" />
      <ClipPath d={pathOf(outline(lo), TB)}>
        <rect x={TB.x - 2.2 * s} y={TB.y - 11 * s} width={4.6 * s} height={22 * s} fill="url(#mr-shell)" />
      </ClipPath>
      <StrapPlan T={TB} o={lo} face="none" edge="#2a1206" holes={{}} />
      {ops(TB)}
      {tack(TB, lo, 4.5)}
      <SpringBar x={TB.x} y1={TB.y - 30} y2={TB.y + 30} r={2.3} qr />
      <Cap p={[TB.x + 3, TB.y + 20]} x={24} y={332} a="start" text="shell wraps the bar" c={C.dim} s={10.5} />
      <Cap p={[TB.x + 75 * s, TB.y - 8]} x={466} y={250} a="end" text="grained calf: a second finished face" s={10.5} />
      <T x={466} y={332} a="end" s={10.5} c={C.faint}>
        wears better than a soft lining; the navy thread all but vanishes
      </T>
    </Fig>
  )
}

/* Variant · thick (6–7 mm) padding — 7 → 3 profile, stacked flat-crowned dome */
function PThick() {
  const X0 = 50
  const base = 146
  const ls = 3.6
  const kk = 8
  const t1 = (x) => (x < 45 ? 3 + 4 * Math.pow(1 - x / 45, 1.6) : 3)
  const t2 = (x) => 2.2 + 2.3 * (1 - x / 73)
  const xs = range(0, 73, 120)
  const PX = (x) => X0 + x * ls
  const xe = PX(73)
  const up1 = xs.map((x) => [PX(x), base - t1(x) * kk])
  const fil = xs.map((x) => [PX(x), base - (t1(x) - 1.2) * kk])
  const up2 = xs.map((x) => [PX(x), base - t2(x) * kk])
  const ylin = base - 0.8 * kk
  const ifaces = [1.7, 3.4].map((hgt) => xs.filter((x) => t1(x) - 2.0 > hgt).map((x) => [PX(x), ylin - hgt * kk]))
  // section across at the lug, true scale ×10
  const cx = 130
  const yb = 272
  const sk = 10
  const env = (xm) => 5.0 * fullP(xm / 6.2)
  const stack = (xm) => {
    const a = Math.abs(xm)
    return (a < 6.2 ? 1.7 : 0) + (a < 6.1 ? 1.7 : 0) + (a < 5.5 ? 1.6 : 0)
  }
  const fm = (xm) => Math.min(env(xm), stack(xm))
  const sx = range(cx - 100, cx + 100, 220)
  const yUp = (x) => yb - sk * dilate(fm, 1.2, (x - cx) / sk)
  const yLo = (x) => yb - sk * fm((x - cx) / sk)
  const fx = sx.filter((x) => Math.abs(x - cx) < 62)
  const crest = yUp(cx)
  const lines = [1.7, 3.4].map((hgt) => fx.filter((x) => fm((x - cx) / sk) > hgt + 0.05))
  return (
    <Fig h={340} view="Profile + section · thick padding" scale="section true ×10">
      <Tag x={14} y={40}>
        Along the short piece · 114 / 73
      </Tag>
      <path d={poly([[X0, base], ...up1, [xe, base]])} fill="url(#sk-topS)" stroke={EDGE} strokeWidth="0.8" />
      <path d={poly([...fil, ...xs.slice().reverse().map((x) => [PX(x), ylin])])} fill="url(#sk-fill)" stroke="#3a2716" strokeWidth="0.7" />
      {ifaces.map((l, i) => l.length > 1 && <path key={i} d={poly(l, false)} fill="none" stroke="#d9b07a" strokeWidth="0.8" strokeDasharray="3 2" />)}
      <rect x={X0} y={ylin} width={xe - X0} height={0.8 * kk} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.7" />
      <path d={poly(up1, false)} fill="none" stroke={GRAIN} strokeWidth="1.6" />
      <path d={poly(up2, false)} fill="none" stroke={C.brass} strokeWidth="1.6" strokeDasharray="5 3" />
      <VDim x={40} y1={base - 7 * kk} y2={base} f1={X0 - 2} f2={X0 - 2} text="7" tx={36} ty={98} a="end" />
      <line x1={36} y1={base - 4.5 * kk} x2={X0} y2={base - 4.5 * kk} stroke={C.brass} strokeWidth="0.8" strokeDasharray="2 2" />
      <T x={34} y={base - 4.5 * kk + 4} a="end" s={10.5} mono c={C.brass}>
        4.5
      </T>
      <VDim x={xe + 8} y1={base - 3 * kk} y2={base} f1={xe + 2} f2={xe + 2} text="3" tx={xe + 13} />
      <HDim x1={X0} x2={PX(45)} y={64} f1={base - 7 * kk - 2} f2={base - 3 * kk - 4} text="taper hard over 40–50 mm" ty={58} />
      <T x={X0} y={160} s={10} c={C.faint}>
        lug end
      </T>
      <T x={xe} y={160} a="end" s={10} c={C.faint}>
        buckle end
      </T>
      <rect x={344} y={84} width={14} height={10} rx="1.5" fill="url(#sk-topS)" stroke={EDGE} strokeWidth="0.7" />
      <T x={364} y={93} s={11} c={C.text}>
        thick: 7 → 3 mm
      </T>
      <T x={364} y={106} s={10} c={C.faint}>
        (also 6 → 2.5)
      </T>
      <line x1={344} y1={127} x2={358} y2={127} stroke={C.brass} strokeWidth="1.6" strokeDasharray="5 3" />
      <T x={364} y={131} s={11} c={C.text}>
        course: 4.5 → 2.2
      </T>
      <T x={364} y={144} s={10} c={C.faint}>
        domed, this lesson
      </T>

      <Sep x1={14} y1={170} x2={466} y2={170} />
      <Tag x={14} y={188}>
        Across at the lug · true scale ×10
      </Tag>
      <rect x={cx - 100} y={yb} width={200} height={0.8 * sk} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" />
      <path d={poly([[cx - 62, yb], ...fx.map((x) => [x, yLo(x)]), [cx + 62, yb]])} fill="url(#sk-fill)" stroke="#3a2716" strokeWidth="0.8" />
      {lines.map((l, i) => l.length > 1 && <path key={i} d={poly(l.map((x) => [x, yb - (i ? 34 : 17)]), false)} fill="none" stroke="#d9b07a" strokeWidth="0.9" strokeDasharray="3 2" />)}
      <TopShape up={sx.map((x) => [x, yUp(x)])} lo={sx.map((x) => [x, yLo(x)])} />
      {[cx - 75, cx + 75].map((x) => (
        <SecThread key={x} x={x} y1={yUp(x)} y2={yb + 0.8 * sk} />
      ))}
      <VDim x={22} y1={crest} y2={yb + 8} f1={cx - 40} f2={cx - 104} text="7" tx={27} />
      <HDim x1={cx + 75} x2={cx + 100} y={yb + 18} f1={yb + 10} f2={yb + 10} text="2.5" ty={yb + 31} />
      <Lead p={[cx + 18, yUp(cx + 18) + 1]} t={[252, 200]} a="start" text="carved to a broad, flat crown" s={11} />
      <Lead p={[cx + 30, yb - 17]} t={[252, 226]} a="start" text="2–3 stacked filler layers" sub="each narrower than the one below" s={11} />
      <Lead p={[cx + 61, yb - 3]} t={[252, 262]} a="start" text="runs nearly to the stitch line" s={11} />
      <Lead p={[cx + 75, yb + 6]} t={[252, 284]} a="start" text="stitch in the valley, ≈2.5 mm in" s={11} c={C.brass} />
      <T x={14} y={320} s={10.5} c={C.text}>
        Size the keepers over the full height of the strap.
      </T>
      <T x={14} y={334} s={10.5} c={C.dim}>
        The height eats length: 7 mm at 114 / 73 fits ≈135–165 mm wrists.
      </T>
    </Fig>
  )
}

export const FIGS = {
  'mn-laminate': MnLaminate,
  'mn-cutpaint': MnCutpaint,
  'mn-tackmark': MnTackmark,
  'mn-tackwrap': MnTackwrap,
  'mn-vtack': MnVtack,
  'mn-styles': MnStyles,
  'mn-finish': MnFinish,
  'mn-limits': MnLimits,
  'ra-patterns': RaPatterns,
  'ra-sizes': RaSizes,
  'ra-block': RaBlock,
  'ra-speedy': RaSpeedy,
  'ra-shell': RaShell,
  'p-thick': PThick,
}
