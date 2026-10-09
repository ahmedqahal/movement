// Strap diagrams — Bund, single-pass and no-sew builds. See AUTHORING.md.
// Lessons: sm-bund (b-*), sm-singlepass (sp-*), sm-nosew (ns-*).
import { useId } from 'react'
import { C, Fig, T, Note, Lead, Dim, Arrow, Num, Verdict, Tag, Sep, Legend } from './kit.jsx'
import { StrapPlan, Ply, Wrap, BarEnd, GlueLine, NoGlue, XSec, Buckle, SpringBar, CaseSide, Wrist, SectionStitch } from './parts.jsx'
import { BuckleSide } from './sections.jsx'
import { offset, resample, pathOf, px } from './geom.js'
import { Knife, Rule, Awl, Punch, Mallet, Beveller, Slicker, Sander, Brush, Dauber, Rivet, Slab, Weight, Dividers, Iron } from './tools.jsx'

/* ================================================================== */
/* Local helpers                                                       */
/* ================================================================== */
const MONO = 'var(--font-mono)'
const uid = () => useId().replace(/[^a-zA-Z0-9]/g, '')

// Horizontal / vertical dimension with explicit text placement.
function HDim({ x1, x2, y, text, ty, tx, a = 'middle', f1, f2, c = C.dim, s = 10.5 }) {
  const short = Math.abs(x2 - x1) < 24
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
      {text && (
        <text x={tx ?? (x1 + x2) / 2} y={ty ?? y - 4} textAnchor={a} fontSize={s} fill={c} fontFamily={MONO}>
          {text}
        </text>
      )}
    </g>
  )
}
function VDim({ y1, y2, x, text, tx, ty, a = 'start', f1, f2, c = C.dim, s = 10.5, sub }) {
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
      {text && (
        <text x={X} y={Y} textAnchor={a} fontSize={s} fill={c} fontFamily={MONO}>
          {text}
        </text>
      )}
      {sub && (
        <text x={X} y={Y + s + 2} textAnchor={a} fontSize={s - 0.5} fill={C.faint} fontFamily={MONO}>
          {sub}
        </text>
      )}
    </g>
  )
}

// Numbered list item: disc + text (+ optional second line).
function Step({ x, y, n, text, sub, c = C.text, s = 11, nc }) {
  return (
    <g>
      <Num x={x} y={y - 4} n={n} r={7} c={nc} />
      <T x={x + 12} y={y} s={s} c={c}>
        {text}
      </T>
      {sub && (
        <T x={x + 12} y={y + s + 2} s={s - 1} c={C.faint}>
          {sub}
        </T>
      )}
    </g>
  )
}

// Leader ending in a numbered disc, text beside it.
function NLead({ p, t, n, text, sub, a = 'start', c = C.text, s = 11.5, nc }) {
  const dir = a === 'end' ? -1 : 1
  const tx = t[0] + dir * 11
  return (
    <g>
      <line x1={p[0]} y1={p[1]} x2={t[0]} y2={t[1]} stroke={C.struct} strokeWidth="0.8" opacity="0.8" />
      <circle cx={p[0]} cy={p[1]} r="2.2" fill={c} />
      <Num x={t[0]} y={t[1]} n={n} r={7} c={nc} />
      <text x={tx} y={t[1] + 4} textAnchor={a} fontSize={s} fill={c} fontFamily="var(--font-body)">
        {text}
      </text>
      {sub && (
        <text x={tx} y={t[1] + 4 + s + 2} textAnchor={a} fontSize={s - 1.5} fill={C.faint} fontFamily="var(--font-body)">
          {sub}
        </text>
      )}
    </g>
  )
}

// Ribbon of leather in a side view, drawn as a stroked centreline.
const BAND = {
  top: ['#b2804a', '#4a3018'],
  lining: ['#e2d2b3', '#8f7b5a'],
  dark: ['#6e4a2a', '#22160b'],
  pad: ['#9b6a38', '#3a2716'],
  ghost: ['rgba(178,128,74,0.25)', 'rgba(224,178,119,0.6)'],
}
function Band({ d, w = 5, k = 'top', op, dash }) {
  const [f, e] = BAND[k] || BAND.top
  return (
    <g opacity={op}>
      <path d={d} fill="none" stroke={e} strokeWidth={w + 1.6} strokeLinejoin="round" strokeDasharray={dash} />
      <path d={d} fill="none" stroke={f} strokeWidth={w} strokeLinejoin="round" strokeDasharray={dash} />
    </g>
  )
}

// Zig-zag break mark across a strip at x (from y1 to y2).
function Break({ x, y1, y2, c = C.dim, side = 'right' }) {
  const h = y2 - y1
  return (
    <g>
      <rect x={side === 'right' ? x - 1 : x - 40} y={y1 - 3} width={41} height={h + 6} fill={C.ground} />
      <path d={`M${x} ${y1 - 4} l-4 ${h * 0.35} l8 ${h * 0.3} l-4 ${h * 0.35 + 8}`} fill="none" stroke={c} strokeWidth="1" />
    </g>
  )
}

// Rivet cap seen from above.
function RivetCap({ x, y, r = 4.5 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="url(#sk-brassG)" stroke="#5c461a" strokeWidth="0.7" />
      <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.35} fill="#fff3cf" opacity="0.6" />
    </g>
  )
}

// Magnified inset: a circle on the spot, a framed box with the detail.
function Inset({ x, y, w, h, at, r = 9, title, children }) {
  const id = uid()
  // connect the spot circle to the nearest box corner
  const cx = Math.max(x, Math.min(at[0], x + w))
  const cy = Math.max(y, Math.min(at[1], y + h))
  return (
    <g>
      <circle cx={at[0]} cy={at[1]} r={r} fill="none" stroke={C.brass} strokeWidth="1.1" strokeDasharray="3 2" />
      <line x1={at[0] + ((cx - at[0]) / (Math.hypot(cx - at[0], cy - at[1]) || 1)) * r} y1={at[1] + ((cy - at[1]) / (Math.hypot(cx - at[0], cy - at[1]) || 1)) * r} x2={cx} y2={cy} stroke={C.brass} strokeWidth="0.8" strokeDasharray="3 2" />
      <clipPath id={`in${id}`}>
        <rect x={x} y={y} width={w} height={h} rx="6" />
      </clipPath>
      <rect x={x} y={y} width={w} height={h} rx="6" fill="#1d1814" stroke={C.brass} strokeWidth="1" />
      <g clipPath={`url(#in${id})`}>{children}</g>
      {title && (
        <text x={x + 7} y={y + 13} fontSize="9.5" letterSpacing="1" fill={C.brass} fontFamily={MONO}>
          {String(title).toUpperCase()}
        </text>
      )}
    </g>
  )
}

const cubic = (p0, p1, p2, p3, t) => {
  const u = 1 - t
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ]
}

/* ------------------------------------------------------------------ */
/* The Bund pad: a waisted outline, centre = case Ø, ends = lug + 5.   */
/* mm coordinates, (0,0) = pad centre, x along the pad.                */
/* ------------------------------------------------------------------ */
const PAD = { L: 110, wc: 40, we: 25, tab: 18, lug: 20 }
function padPts({ L = 110, wc = 40, we = 25, tab = 18, rc = 1.5 } = {}) {
  const h = L / 2
  const n = 22
  const p0 = [h - tab, -we / 2]
  const p1 = [(h - tab) * 0.55, -we / 2]
  const p2 = [(h - tab) * 0.5, -wc / 2]
  const p3 = [0, -wc / 2]
  const right = [[h, -we / 2 + rc], [h - rc, -we / 2]]
  for (let i = 0; i <= n; i++) right.push(cubic(p0, p1, p2, p3, i / n))
  const topEdge = [...right.map(([x, y]) => [-x, y]), ...right.slice(0, -1).reverse()]
  const bottom = topEdge
    .slice()
    .reverse()
    .map(([x, y]) => [x, -y])
  return [...topEdge, ...bottom]
}
// slit centres, mm from each end
const SLITS = [5, 13]

const FACE = {
  grain: ['url(#sk-top)', '#5c3c1d'],
  back: ['url(#sk-lin)', C.liningEdge],
  card: ['rgba(226,214,190,0.10)', C.struct],
  dark: ['url(#sk-dark)', '#2e1e10'],
}

function StitchLoop({ T: Tr, pts, m = 3, p = 3, c = C.thread, w = 1.4 }) {
  const inner = offset(pts, m)
  const st = resample([...inner, inner[0]], p)
  return (
    <g>
      {st.map(({ p: q, tan }, i) => {
        const nxt = st[i + 1]
        if (!nxt) return null
        const [x, y] = px(Tr, q[0], q[1])
        const [x2, y2] = px(Tr, nxt.p[0], nxt.p[1])
        const nx = -tan[1] * 0.4 * Tr.s
        const ny = tan[0] * 0.4 * Tr.s
        return <line key={i} x1={x + (x2 - x) * 0.15 - nx} y1={y + (y2 - y) * 0.15 - ny} x2={x + (x2 - x) * 0.85 + nx} y2={y + (y2 - y) * 0.85 + ny} stroke={c} strokeWidth={w} strokeLinecap="round" />
      })}
    </g>
  )
}

function PadPlan({ T: Tr, p = PAD, face = 'grain', slits = true, stitch, caseDia, glow, dash, over, slitW = 1.8, slitLen, children, op }) {
  const pts = padPts(p)
  const d = pathOf(pts, Tr)
  const [fill, stroke] = FACE[face] || FACE.grain
  const h = p.L / 2
  const sl = slitLen ?? p.lug + 1
  return (
    <g opacity={op}>
      {over && <path d={pathOf(offset(pts, -over), Tr)} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="1" />}
      {glow && <path d={d} fill="none" stroke={glow} strokeWidth="6" opacity="0.35" />}
      <path d={d} fill={over ? 'rgba(0,0,0,0)' : fill} stroke={over ? C.dim : stroke} strokeWidth={over ? 1 : 1.1} strokeDasharray={over ? '5 3' : dash} />
      {caseDia && <circle cx={Tr.x} cy={Tr.y} r={(caseDia / 2) * Tr.s} fill="none" stroke={C.steel} strokeWidth="1" strokeDasharray="5 3" />}
      {stitch && <StitchLoop T={Tr} pts={pts} {...stitch} />}
      {slits &&
        [-1, 1].flatMap((sg) =>
          SLITS.map((a) => {
            const [cx, cy] = px(Tr, sg * (h - a), 0)
            const W = slitW * Tr.s
            const H = sl * Tr.s
            return <rect key={`${sg}${a}`} x={cx - W / 2} y={cy - H / 2} width={W} height={H} rx={W / 2} fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />
          })
        )}
      {children}
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* Watch head in plan (from above) and in side view                    */
/* ------------------------------------------------------------------ */
function WatchPlan({ cx, cy, s, dia = 40, lug = 20, lugLen = 9, crown = true }) {
  const R = (dia / 2) * s
  const li = (lug / 2) * s
  const lw = 3 * s
  const yEdge = (x) => Math.sqrt(Math.max(0, R * R - x * x))
  const horn = (sx, sy) => {
    const xa = cx + sx * li
    const xb = cx + sx * (li + lw)
    const y0 = cy + sy * (yEdge(li + lw) - 4)
    const y1 = cy + sy * (R + lugLen * s)
    return <path key={`${sx}${sy}`} d={`M${xa} ${y0} L${xa} ${y1 - sy * 3} Q${xa} ${y1} ${(xa + xb) / 2} ${y1} Q${xb} ${y1} ${xb} ${y1 - sy * 3} L${xb} ${y0} Z`} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.8" />
  }
  const barY = (sy) => cy + sy * (R + (lugLen - 2.2) * s)
  return (
    <g>
      {[-1, 1].flatMap((sy) => [horn(-1, sy), horn(1, sy)])}
      {[-1, 1].map((sy) => (
        <rect key={sy} x={cx - li} y={barY(sy) - 0.9 * s} width={li * 2} height={1.8 * s} rx={0.9 * s} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.6" />
      ))}
      {crown && (
        <g>
          <rect x={cx + R - 2} y={cy - 1.4 * s} width={1.6 * s + 2} height={2.8 * s} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.6" />
          <rect x={cx + R + 1.4 * s} y={cy - 2.6 * s} width={2.6 * s} height={5.2 * s} rx={0.8 * s} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.7" />
          {[0.2, 0.4, 0.6, 0.8].map((f) => (
            <line key={f} x1={cx + R + 1.4 * s + 2} y1={cy - 2.6 * s + 5.2 * s * f} x2={cx + R + 4 * s - 2} y2={cy - 2.6 * s + 5.2 * s * f} stroke="#3b4850" strokeWidth="0.6" />
          ))}
        </g>
      )}
      <circle cx={cx} cy={cy} r={R} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={R - 1.6 * s} fill="#232a2f" stroke="#5f717d" strokeWidth="1" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * Math.PI) / 6
        const r1 = R - 2.6 * s
        const r2 = R - (i % 3 ? 3.6 : 4.6) * s
        return <line key={i} x1={cx + Math.sin(a) * r1} y1={cy - Math.cos(a) * r1} x2={cx + Math.sin(a) * r2} y2={cy - Math.cos(a) * r2} stroke="#d9e3e9" strokeWidth={i % 3 ? 1 : 1.8} />
      })}
      <line x1={cx} y1={cy} x2={cx + R * 0.42} y2={cy - R * 0.3} stroke="#d9e3e9" strokeWidth="2.2" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx - R * 0.2} y2={cy - R * 0.6} stroke="#d9e3e9" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="2.2" fill="#d9e3e9" />
    </g>
  )
}

// Side view: y = bar-centre line. Bars at cx ± (dia/2 + gap)·s.
// Lugs are drawn separately (LugGhosts) so the strap can pass behind them.
function WatchSide({ cx, y, s, dia = 40 }) {
  const hw = (dia / 2) * s
  const L = cx - hw
  const R = cx + hw
  const top = y - 5.4 * s
  const bot = y + 3.6 * s
  const r = 1.6 * s
  const body = `M${L + r} ${top + 0.6 * s} L${R - r} ${top + 0.6 * s} Q${R} ${top + 0.7 * s} ${R} ${top + 2.2 * s} L${R} ${bot - r} Q${R} ${bot} ${R - r} ${bot} L${L + r} ${bot} Q${L} ${bot} ${L} ${bot - r} L${L} ${top + 2.2 * s} Q${L} ${top + 0.7 * s} ${L + r} ${top + 0.6 * s} Z`
  return (
    <g>
      <path d={body} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.9" />
      <rect x={L + 2.6 * s} y={bot} width={R - L - 5.2 * s} height={1.1 * s} rx={0.4 * s} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.7" />
      <rect x={L + 0.8 * s} y={top - 0.6 * s} width={R - L - 1.6 * s} height={1.3 * s} rx={0.4 * s} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.7" />
      <path d={`M${L + 1.4 * s} ${top - 0.6 * s} Q${cx} ${top - 2.4 * s} ${R - 1.4 * s} ${top - 0.6 * s} Z`} fill="url(#sk-glass)" stroke={C.steel} strokeWidth="0.8" />
    </g>
  )
}
function LugGhosts({ cx, y, s, dia = 40, gap = 3.2, solid }) {
  const fx = cx + (dia / 2) * s
  const x = fx + gap * s
  const top = y - 5.4 * s
  const d = `M${fx - 0.6 * s} ${top + 0.7 * s} L${x + 0.6 * s} ${top + 1.5 * s} Q${x + 2.3 * s} ${top + 2.1 * s} ${x + 2.3 * s} ${y - 0.6 * s} Q${x + 2.3 * s} ${y + 2.2 * s} ${x} ${y + 2.2 * s} Q${x - 1.8 * s} ${y + 2.2 * s} ${fx + 0.6 * s} ${y + 0.7 * s} L${fx - 0.6 * s} ${y + 0.4 * s} Z`
  const style = solid
    ? { fill: 'url(#sk-steel)', stroke: '#3b4850', strokeWidth: 0.9 }
    : { fill: 'rgba(180,196,206,0.16)', stroke: '#9fb4c2', strokeWidth: 1, strokeDasharray: '4 3' }
  return (
    <g>
      <path d={d} {...style} />
      <path d={d} {...style} transform={`translate(${2 * cx} 0) scale(-1 1)`} />
    </g>
  )
}
const barX = (cx, s, dia = 40, gap = 3.2) => [cx - (dia / 2 + gap) * s, cx + (dia / 2 + gap) * s]

// A fold round a bar in section, with a full-thickness flap of `flap` px.
// dir = 1: body to the right (fold on the left); dir = -1: mirrored.
// Returns body top y via fg().
const fg = (cy, r, t) => ({ y1: cy - r, top: cy - r - t })
function FoldEnd({ cx, cy, r, t, dir = 1, flap, skive = 0.5, body, k = 'top', bar = true }) {
  const cv = r * 2.4
  const y1 = cy - r
  const fx1 = dir === 1 ? cx + cv : cx - cv - flap
  const fx2 = dir === 1 ? cx + cv + flap : cx - cv
  const skLen = Math.min(flap * 0.45, 40)
  return (
    <g>
      {body != null && <Ply x1={dir === 1 ? cx : body} x2={dir === 1 ? body : cx} y={y1 - t} t={t} k={k} open={dir === 1 ? 'l' : 'r'} />}
      <Wrap cx={cx} cy={cy} r={r} t={t} xR={cx} conv={cv} tail={1} ts={t} k={k} dir={dir} seam={false} />
      <Ply x1={fx1} x2={fx2} y={y1} t={t} k={k} open={dir === 1 ? 'l' : 'r'} {...(dir === 1 ? { skR: [skLen, t * skive] } : { skL: [skLen, t * skive] })} />
      <line x1={fx1} y1={y1} x2={fx2} y2={y1} stroke="#4a3018" strokeWidth="0.8" />
      {bar && <BarEnd cx={cx} cy={cy} r={r * 0.92} />}
    </g>
  )
}

/* ================================================================== */
/* BUND STRAP                                                          */
/* ================================================================== */

/* 1 · Measure: lug width, case Ø with crown, wrist */
function BMeasure() {
  const cx = 132
  const cy = 150
  const s = 2.8
  const R = 20 * s
  const li = 10 * s
  const crownTip = cx + R + 4 * s
  const lugTop = cy - R - 9 * s
  const lugBot = cy + R + 9 * s
  return (
    <Fig h={300} view="Plan · what to measure" scale="example: Ø 40 case · 20 mm lugs">
      <WatchPlan cx={cx} cy={cy} s={s} />
      {/* lug width */}
      <HDim x1={cx - li} x2={cx + li} y={lugTop - 12} f1={lugTop + 2} f2={lugTop + 2} text="20" />
      <Lead p={[cx + li + 4, lugTop + 10]} t={[196, 48]} text="lug width" sub="inside the lugs, at the bar" />
      {/* case diameter */}
      <HDim x1={cx - R} x2={cx + R} y={cy + R + 40} f1={cy + 6} f2={cy + 6} text="40 case Ø" ty={cy + R + 36} />
      <HDim x1={cx - R} x2={crownTip} y={lugBot + 22} f1={cy + R + 44} f2={cy + 12} text="44 with the crown" ty={lugBot + 36} />
      <Lead p={[crownTip - 4, cy - 8]} t={[206, 108]} text="crown — include it" sub="if the pad sits under it" />
      <Lead p={[cx - R + 4, cy + 30]} t={[34, 232]} text="case" a="middle" />

      <Sep x1={330} y1={34} x2={330} y2={290} />
      {/* wrist */}
      <Tag x={342} y={48}>wrist</Tag>
      <Wrist cx={400} cy={138} rx={50} ry={36} />
      <ellipse cx={400} cy={138} rx={55} ry={41} fill="none" stroke="#e9dcc0" strokeWidth="5" />
      <ellipse cx={400} cy={138} rx={55} ry={41} fill="none" stroke="#6b5b43" strokeWidth="5" strokeDasharray="1 5" />
      <rect x={446} y={126} width={13} height={20} rx="2" fill="#e9dcc0" stroke="#6b5b43" strokeWidth="0.8" />
      <T x={400} y={202} a="middle" s={11.5} c={C.text}>
        tape, snug
      </T>
      <T x={400} y={217} a="middle" s={10.5}>
        just above the wrist bone
      </T>
      <Note x={342} y={250} s={10.5} lh={14} lines={['lug width → strap width', 'case Ø → pad centre', 'wrist → strap lengths']} />
    </Fig>
  )
}

/* 2 · Draw the pad round the case */
function BDraw() {
  const Tr = { x: 236, y: 128, s: 3 }
  const h = 55 * Tr.s
  const L = Tr.x - h
  const Rx = Tr.x + h
  return (
    <Fig h={336} view="Plan · pad pattern on card" scale="true scale ×3">
      <line x1={L - 12} y1={Tr.y} x2={Rx + 12} y2={Tr.y} stroke={C.steel} strokeWidth="0.8" strokeDasharray="10 3 2 3" opacity="0.85" />
      <PadPlan T={Tr} face="card" slits={false} caseDia={40} />
      {/* bars, for reference */}
      {barX(Tr.x, Tr.s).map((x) => (
        <g key={x}>
          <line x1={x} y1={Tr.y - 28} x2={x} y2={Tr.y + 34} stroke={C.steel} strokeWidth="0.8" strokeDasharray="2 3" opacity="0.8" />
          <T x={x} y={Tr.y - 32} a="middle" s={10} c={C.steel}>
            bar
          </T>
        </g>
      ))}
      <Awl kind="scratch" x={Rx - 54} y={Tr.y - 37.5} ang={28} k={0.62} />
      {/* centre width = case Ø */}
      <VDim x={Rx + 26} y1={Tr.y - 60} y2={Tr.y + 60} f1={Tr.x + 6} f2={Tr.x + 6} text="40" tx={Rx + 31} sub="= case Ø" />
      {/* end width */}
      <VDim x={L - 16} y1={Tr.y - 37.5} y2={Tr.y + 37.5} f1={L - 2} f2={L - 2} text="25" tx={L - 21} a="end" sub="lug + 5" />
      {/* length */}
      <HDim x1={L} x2={Rx} y={Tr.y + 96} f1={Tr.y + 40} f2={Tr.y + 40} text="110  (100–110)" ty={Tr.y + 110} />
      <Lead p={[Tr.x - 40, Tr.y - 45]} t={[150, 44]} text="case outline, drawn first" a="end" sub="Ø incl. crown: 32–50" />
      <Lead p={[Rx - 54, Tr.y + 40]} t={[330, 194]} text="waisted neck" a="end" sub="round centre eases into the end" />
      <T x={Tr.x} y={Tr.y + 26} a="middle" s={10} c={C.steel}>
        centreline
      </T>

      <Sep x1={14} y1={250} x2={466} y2={250} />
      <Tag x={20} y={268}>Vintage slip-through pads (L × W)</Tag>
      {[
        ['66 × 32', '15–16 mm straps', 66, 32],
        ['68 × 34', '17–18 mm straps', 68, 34],
        ['73 × 37', '19–20 mm straps', 73, 37],
      ].map(([a, b, l, w], i) => (
        <g key={a}>
          <rect x={22 + i * 150} y={280} width={l * 0.55} height={w * 0.55} rx="6" fill="rgba(226,214,190,0.10)" stroke={C.struct} strokeWidth="0.9" />
          <T x={68 + i * 150} y={294} s={11} c={C.text} mono>
            {a}
          </T>
          <T x={68 + i * 150} y={309} s={10}>
            {b}
          </T>
        </g>
      ))}
      <T x={20} y={330} s={10} c={C.faint}>
        Modern pads ≈110 mm long; vintage pads are shorter and narrower.
      </T>
    </Fig>
  )
}

/* 3 · Cut the top and the back */
function BCut() {
  const Tt = { x: 140, y: 84, s: 1.9 }
  const Tb = { x: 140, y: 222, s: 1.9 }
  const h = 55 * 1.9
  return (
    <Fig h={318} view="Plan · cutting the pad" scale="plan ×1.9 · sections ×5">
      <Tag x={20} y={40}>Top · grain up</Tag>
      <PadPlan T={Tt} face="grain" slits={false} />
      <Knife kind="utility" x={Tt.x + h} y={Tt.y + 10} ang={18} k={0.62} />
      <Arrow a={[Tt.x + h + 10, Tt.y - 22]} b={[Tt.x + h + 10, Tt.y + 6]} w={1.6} />
      <Lead p={[Tt.x + 20, Tt.y + 26]} t={[140, 146]} text="veg-tan or saddle leather" a="middle" />

      <Tag x={20} y={172}>Back · flesh up</Tag>
      <PadPlan T={Tb} face="back" slits={false} over={3} />
      <Lead p={[Tb.x + h + 4, Tb.y + 14]} t={[294, 288]} text="cut oversize" a="end" sub="trimmed with the top after gluing" />
      <Lead p={[Tb.x - 70, Tb.y + 30]} t={[22, 288]} text="pigskin or calf" a="start" />
      <Lead p={[Tb.x + 40, Tb.y - 31]} t={[212, 172]} text="pad line" sub="marked, cut later" />

      <Sep x1={300} y1={30} x2={300} y2={308} />
      <Tag x={312} y={44}>Two layers</Tag>
      <XSec cx={385} y={64} w={120} layers={[{ k: 'top', t: 7 }, { k: 'lining', t: 5 }]} edge="square" />
      <Lead p={[440, 67]} t={[452, 100]} text="top" a="end" />
      <Lead p={[352, 74]} t={[338, 100]} text="back" a="start" />
      <T x={312} y={126} s={10.5}>glued, then stitched round</T>

      <Tag x={312} y={164}>Or one layer</Tag>
      <XSec cx={385} y={182} w={120} layers={[{ k: 'top', t: 11 }]} edge="square" />
      <T x={312} y={214} s={10.5}>a single firm layer</T>
      <T x={312} y={228} s={10.5}>— lighter, no seam</T>

      <Note x={312} y={262} s={10} lh={13.5} c={C.faint} lines={['The top’s grain faces the case;', 'the back lies on the wrist.', 'Long, single knife strokes.']} />
    </Fig>
  )
}

/* 4 · The passages: two slits per end, strap + 1 mm */
function BPassages() {
  const s = 4.2
  const Tr = { x: 60 - 20 * s, y: 132, s }
  const endX = Tr.x + 55 * s
  const xo = Tr.x + (55 - SLITS[0]) * s
  const xi = Tr.x + (55 - SLITS[1]) * s
  const sh = 10.5 * s
  return (
    <Fig h={330} view="Detail · pad end" scale="plan ×4.2 · section ×4">
      <clipPath id="bp-clip">
        <rect x={58} y={20} width={240} height={250} />
      </clipPath>
      <g clipPath="url(#bp-clip)">
        <PadPlan T={Tr} face="grain" slitLen={21} />
      </g>
      <path d={`M60 ${Tr.y - 80} l-4 30 l8 25 l-6 30 l6 25 l-4 30 l4 30`} fill="none" stroke={C.dim} strokeWidth="1" />
      {/* punched ends */}
      {[xo, xi].map((x) => [Tr.y - sh, Tr.y + sh].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r={2.6} fill={C.hole} stroke="#e7c48f" strokeWidth="0.7" />))}
      {/* the strap that will pass: 20 wide */}
      <rect x={64} y={Tr.y - 10 * s} width={xi - 70} height={20 * s} fill="rgba(134,167,189,0.08)" stroke={C.steel} strokeWidth="0.9" strokeDasharray="4 3" />
      <VDim x={84} y1={Tr.y - 10 * s} y2={Tr.y + 10 * s} text="20" tx={89} sub="strap" c={C.steel} />
      <Knife kind="utility" x={xo} y={Tr.y - 18} ang={14} k={0.56} />
      {/* dims */}
      <VDim x={endX + 18} y1={Tr.y - sh} y2={Tr.y + sh} f1={xo + 4} f2={xo + 4} text="21" sub="strap + 1" />
      <HDim x1={xo} x2={endX} y={Tr.y + 70} f1={Tr.y + sh + 4} f2={Tr.y + 54} text="5" ty={Tr.y + 84} />
      <HDim x1={xi} x2={endX} y={Tr.y + 94} f1={Tr.y + sh + 4} f2={Tr.y + 74} text="13" ty={Tr.y + 108} />
      <Lead p={[xi, Tr.y - sh - 3]} t={[150, 46]} text="inner slit" a="end" />
      <Lead p={[xo + 2, Tr.y - sh - 3]} t={[236, 70]} text="outer" a="start" />
      <Lead p={[(xi + xo) / 2, Tr.y + 30]} t={[112, 212]} text="bridge" a="end" sub="strap passes under" />
      <Lead p={[xi - 1, Tr.y + sh + 2]} t={[140, 252]} text="punch each end," a="end" sub="then cut between" />
      <T x={66} y={292} s={10} c={C.faint}>Slit positions: house standard.</T>
      <T x={66} y={306} s={10} c={C.faint}>Slit length: strap width + ≈1 mm.</T>

      <Sep x1={306} y1={30} x2={306} y2={318} />
      {/* section of the weave */}
      <Tag x={316} y={44}>The weave, in section</Tag>
      {(() => {
        const k = 4
        const e = 458
        const so = e - 5 * k
        const si = e - 13 * k
        const y = 96
        const tT = 4.8
        const tB = 4
        const g = 5.5
        const segs = [[318, si - g], [si + g, so - g], [so + g, e]]
        const t = 8.8
        const yc = y - t / 2
        const yu = y + tT + tB + t / 2
        return (
          <g>
            {segs.map(([a, b], i) => (
              <g key={i}>
                <Ply x1={a} x2={b} y={y} t={tT} open={i === 0 ? 'l' : ''} />
                <Ply x1={a} x2={b} y={y + tT} t={tB} k="lining" open={i === 0 ? 'l' : ''} />
              </g>
            ))}
            <Band w={t} d={`M318 ${yc} L${si - 9} ${yc} C${si - 2} ${yc} ${si + 1} ${yu} ${si + 9} ${yu} L${so - 9} ${yu} C${so - 1} ${yu} ${so + 2} ${yc} ${so + 9} ${yc} L470 ${yc}`} />
            <Arrow a={[330, yc - 14]} b={[370, yc - 14]} w={1.5} />
            <T x={350} y={yc - 20} a="middle" s={10} c={C.brass}>from the lug</T>
            <Num x={si - 14} y={y + 24} n={1} r={7} />
            <Num x={(si + so) / 2} y={yu + 18} n={2} r={7} />
            <Num x={so + 14} y={yc - 14} n={3} r={7} />
            <T x={322} y={150} s={10.5}><tspan fill={C.brass}>1</tspan> down the inner slit</T>
            <T x={322} y={164} s={10.5}><tspan fill={C.brass}>2</tspan> under the bridge</T>
            <T x={322} y={178} s={10.5}><tspan fill={C.brass}>3</tspan> up the outer slit, on out</T>
          </g>
        )
      })()}

      <Sep x1={316} y1={190} x2={466} y2={190} />
      <Tag x={316} y={208}>Or: stitched loops</Tag>
      <path d="M318 230 L440 230 Q446 230 446 236 L446 272 Q446 278 440 278 L318 278" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="1" />
      <rect x={398} y={224} width={14} height={60} rx="2" fill="url(#sk-dark)" stroke="#e0b277" strokeWidth="0.8" />
      {[228, 234, 274, 280].map((y) => (
        <line key={y} x1={400} y1={y} x2={410} y2={y} stroke={C.thread} strokeWidth="1.2" />
      ))}
      <rect x={340} y={238} width={110} height={32} fill="none" stroke={C.steel} strokeWidth="0.9" strokeDasharray="4 3" />
      <T x={318} y={300} s={10.5}>a leather loop stitched across</T>
      <T x={318} y={314} s={10.5}>each end; the strap runs under it</T>
    </Fig>
  )
}

/* 5 · Close the pad: glue, then stitch the perimeter */
function BClose() {
  const Tr = { x: 196, y: 100, s: 2.6 }
  const h = 55 * Tr.s
  return (
    <Fig h={340} view="Plan + section · closing the pad" scale="plan ×2.6 · section ×8">
      <PadPlan T={Tr} face="grain" stitch={{ m: 3, p: 3 }} />
      <Lead p={[Tr.x + 30, Tr.y - 44]} t={[300, 34]} text="perimeter stitch" sub="≈3 mm in, 3 mm pitch" />
      <Lead p={[Tr.x - h + 8, Tr.y - 10]} t={[34, 40]} text="slits through" a="start" sub="both layers" />
      <Lead p={[Tr.x + h - 6, Tr.y + 22]} t={[372, 150]} text="top + back" sub="glued face to face" />
      <Step x={30} y={186} n={1} text="Glue the back to the top, full face;" sub="press, then trim both edges together" />
      <Step x={30} y={220} n={2} text="Mark ≈3 mm in, prick, saddle-stitch" sub="the whole perimeter, ends included" />

      <Sep x1={14} y1={244} x2={466} y2={244} />
      <Tag x={20} y={262}>Section at the edge</Tag>
      {(() => {
        const y = 296
        const tt = 9.6
        const tb = 8
        const xe = 60
        const xs = xe + 3 * 8
        const yb = y + tt + tb
        return (
          <g>
            <Ply x1={xe} x2={290} y={y} t={tt} open="r" />
            <Ply x1={xe} x2={290} y={y + tt} t={tb} k="lining" open="r" />
            <GlueLine x1={xe + 4} x2={288} y={y + tt} />
            {/* one stitch: thread through the hole, lying along the seam top and bottom (seen end-on) */}
            <line x1={xs} y1={y - 2} x2={xs} y2={yb + 2} stroke={C.thread} strokeWidth="1.8" />
            <ellipse cx={xs} cy={y - 2.5} rx={4} ry={2.2} fill={C.thread} stroke="#9c927e" strokeWidth="0.5" />
            <ellipse cx={xs} cy={yb + 2.5} rx={4} ry={2.2} fill={C.thread} stroke="#9c927e" strokeWidth="0.5" />
            <HDim x1={xe} x2={xs} y={y - 14} f1={y - 2} f2={y - 6} text="3" ty={y - 18} />
            <path d={`M290 ${y - 4} l-4 8 l8 8 l-4 8`} fill="none" stroke={C.dim} />
            <Lead p={[xs + 3, y - 4]} t={[132, 276]} text="saddle stitch, seen end-on" a="start" s={10.5} />
            <Lead p={[180, y + 3]} t={[316, 284]} text="top · veg-tan / saddle" s={10.5} />
            <Lead p={[240, y + tt]} t={[316, 304]} text="contact cement" c={C.emerald} s={10.5} />
            <Lead p={[260, y + tt + tb - 3]} t={[316, 324]} text="back · pigskin / calf" s={10.5} />
            <T x={20} y={334} s={10} c={C.faint}>top 1.2 · back 1.0 mm (example)</T>
          </g>
        )
      })()}
    </Fig>
  )
}

/* 6 · Finish the pad edges */
function BFinish() {
  const Tr = { x: 240, y: 92, s: 2.3 }
  const stages = [
    ['1', 'Bevel', '0.5–0.7 mm, top and back', 'bevel', 'edge beveller'],
    ['2', 'Sand', '400 → 600 → 1000', 'sand', 'sanding stick'],
    ['3', 'Burnish', 'gum or Tokonole, slicker', 'round', 'wood slicker'],
  ]
  return (
    <Fig h={330} view="Plan + edge sections" scale="plan ×2.3 · edge ×8">
      <PadPlan T={Tr} face="grain" stitch={{ m: 3, p: 3 }} glow={C.brass} />
      <Lead p={[Tr.x - 55 * Tr.s + 1, Tr.y + 18]} t={[40, 158]} text="whole perimeter," a="start" sub="ends and waist alike" />
      <Lead p={[Tr.x + 30, Tr.y + 46]} t={[300, 158]} text="edges finished" sub="after stitching" />
      <Sep x1={14} y1={186} x2={466} y2={186} />
      {stages.map(([n, name, sub, kind, tool], i) => {
        const cx = 84 + i * 156
        const y = 240
        const ex = cx + 14
        const layers = [{ k: 'top', t: 10 }, { k: 'lining', t: 8 }]
        return (
          <g key={n}>
            <clipPath id={`bf-${n}`}>
              <rect x={cx - 66} y={200} width={86} height={80} />
            </clipPath>
            <g clipPath={`url(#bf-${n})`}>
              <XSec cx={ex - 50} y={y} w={100} layers={layers} edge={kind === 'bevel' ? 'bevel' : kind === 'round' ? 'round' : 'bevel'} b={kind === 'sand' ? 6 : 4} />
            </g>
            {kind === 'round' && <path d={`M${ex - 5} ${y + 1} Q${ex + 2} ${y + 9} ${ex - 5} ${y + 17}`} fill="none" stroke="#fff3d6" strokeWidth="1.6" opacity="0.8" />}
            {kind === 'bevel' && <Beveller x={ex - 2} y={y + 1} ang={38} k={0.5} />}
            {kind === 'sand' && <Sander x={ex + 2} y={y + 9} ang={90} len={50} />}
            {kind === 'round' && <Slicker x={ex + 2} y={y + 9} ang={90} len={50} />}
            <Num x={cx - 56} y={206} n={n} r={7} />
            <T x={cx - 44} y={210} s={11.5} c={C.text} w="600">
              {name}
            </T>
            <T x={cx - 56} y={284} s={10.5} c={C.text}>
              {tool}
            </T>
            <T x={cx - 56} y={298} s={10.5}>
              {sub}
            </T>
          </g>
        )
      })}
      <T x={28} y={320} s={10} c={C.faint}>
        Burnish only if top AND back are firm veg-tan; a calf back means paint the edge.
      </T>
    </Fig>
  )
}

/* 7 · The strap: thin two-piece or single-pass strip */
function BStrap() {
  return (
    <Fig h={320} view="Plan + sections · the strap" scale="plan ×1.3–1.4 · sections ×5">
      <Tag x={20} y={40}>a · Unpadded two-piece</Tag>
      <StrapPlan T={{ x: 34, y: 78, s: 1.3 }} o={{ x0: 0, x1: 120, w0: 20, w1: 18, taper: [8, 100], tip: 'ogive', tipLen: 14 }} stitch={{ m: 3, p: 3, from: 5 }} holes={{}} />
      <StrapPlan T={{ x: 34, y: 126, s: 1.3 }} o={{ x0: 0, x1: 80, w0: 20, w1: 18, taper: [8, 80], tip: 'square' }} stitch={{ m: 3, p: 3, from: 5, to: 66 }} keepers={[{ x: 70 }, { x: 54, float: true }]} />
      <Buckle x={34 + 104} y={126} w={24} L={20} />
      <T x={198} y={76} s={10.5} c={C.text}>long 120</T>
      <T x={198} y={90} s={10}>20 → 18 mm, flat</T>
      <T x={170} y={124} s={10.5} c={C.text}>short 80</T>
      <T x={170} y={138} s={10}>no filler, no dome</T>
      <XSec cx={372} y={70} w={64} layers={[{ k: 'top', t: 6 }, { k: 'lining', t: 5 }]} edge="paint" b={2.5} coat={2} />
      <VDim x={412} y1={70} y2={81} f1={406} f2={406} text="≈2.2" />
      <T x={340} y={104} s={10}>top 1.2 + lining 1.0</T>
      <T x={340} y={58} s={10} c={C.faint}>section</T>

      <Sep x1={14} y1={156} x2={466} y2={156} />
      <Tag x={20} y={176}>b · Or a single-pass strip</Tag>
      <StrapPlan T={{ x: 46, y: 206, s: 1.4 }} o={{ x0: 0, x1: 270, w0: 20, w1: 20, tip: 'round', tipLen: 8 }} holes={{ n: 7, pitch: 7, fromTip: 25 }} />
      <HDim x1={46} x2={46 + 270 * 1.4} y={234} f1={222} f2={214} text="270" ty={248} />
      <VDim x={36} y1={192} y2={220} f1={46} f2={46} text="20" tx={30} a="end" />
      <XSec cx={110} y={276} w={70} layers={[{ k: 'top', t: 8 }]} edge="round" />
      <VDim x={152} y1={276} y2={284} f1={146} f2={146} text="1.6" sub="one layer" />
      <Note x={250} y={270} s={10.5} lh={14} lines={['Runs under the case on top of', 'the pad: over the bars, through', 'the slits, round the wrist.']} />
      <T x={20} y={312} s={10} c={C.ruby}>✕ No padded straps: they jam in the passages (step 9).</T>
    </Fig>
  )
}

/* 8 · Assemble: strap to the bars, then through the pad */
function BAssemble() {
  const s = 3.5
  const cx = 240
  const padTop = 168
  const tT = 1.2 * s
  const tB = 1.0 * s
  const padBot = padTop + tT + tB
  const by = padTop - 4.7 * s
  const [bl] = barX(cx, s)
  const rb = 0.9 * s
  const t = 2.2 * s
  const L = cx - 55 * s
  const Rx = cx + 55 * s
  const so = L + 5 * s
  const si = L + 13 * s
  const g = 4.8
  const yc = padTop - t / 2
  const yu = padBot + t / 2
  // one strap piece, left side (mirrored for the right)
  const fr = rb + t / 2
  const yb = by - fr // body centreline at the bar
  const piece = (
    <g>
      {/* tail of the lug fold, rising to lie under the body */}
      <Band w={t} d={`M${bl} ${by + fr} L${bl - 4} ${by + fr} C${bl - 9} ${by + fr} ${bl - 11} ${yb + t} ${bl - 16} ${yb + t} L${bl - 22} ${yb + t}`} />
      {/* body: over the bar, down to the pad, through the two slits */}
      <Band
        w={t}
        d={`M${bl} ${by + fr} A${fr} ${fr} 0 0 0 ${bl} ${yb} L${bl - 20} ${yb} C${bl - 34} ${yb} ${bl - 36} ${yc} ${bl - 52} ${yc} L${si + 10} ${yc} C${si + 2} ${yc} ${si - 1} ${yu} ${si - 9} ${yu} L${so + 9} ${yu} C${so + 1} ${yu} ${so - 2} ${yc} ${so - 10} ${yc} L22 ${yc}`}
      />
      <BarEnd cx={bl} cy={by} r={rb} />
    </g>
  )
  const segs = [[L, so - g], [so + g, si - g], [si + g, 2 * cx - si - g], [2 * cx - si + g, 2 * cx - so - g], [2 * cx - so + g, Rx]]
  return (
    <Fig h={316} view="Side section · assembled" scale="true scale ×3.5">
      <line x1={14} y1={yu + t / 2 + 3} x2={466} y2={yu + t / 2 + 3} stroke="#a57e66" strokeWidth="1" strokeDasharray="6 4" opacity="0.7" />
      <T x={466} y={yu + t / 2 + 16} a="end" s={10} c="#a57e66">wrist side</T>
      {segs.map(([a, b], i) => (
        <g key={i}>
          <Ply x1={a} x2={b} y={padTop} t={tT} />
          <Ply x1={a} x2={b} y={padTop + tT} t={tB} k="lining" />
        </g>
      ))}
      <WatchSide cx={cx} y={by} s={s} />
      {piece}
      <g transform={`translate(${2 * cx} 0) scale(-1 1)`}>{piece}</g>
      <LugGhosts cx={cx} y={by} s={s} />
      <path d="M22 150 l-4 8 l8 8 l-4 8" fill="none" stroke={C.dim} />
      <path d="M458 150 l-4 8 l8 8 l-4 8" fill="none" stroke={C.dim} />

      <NLead n={1} p={[bl - 6, yb - 4]} t={[30, 62]} text="fit the strap to the bars first" sub="ordinary lug folds, 2.2 mm strap" />
      <NLead n={2} p={[si - 4, yu + 3]} t={[30, 222]} text="thread each end: down the inner slit," sub="under the bridge, up the outer slit" />
      <NLead n={3} p={[cx + 20, padTop + 3]} t={[300, 222]} text="pad centred under the caseback" sub="the case sits on the pad" />
      <Lead p={[cx + 40, by - 24]} t={[300, 52]} text="case" a="end" />

      <Inset x={326} y={26} w={140} h={84} at={[2 * cx - bl, by]} r={13} title="lug fold ×2">
        {(() => {
          const k = 2.2
          const bx = 404
          const yy = 72
          const R1 = fr * k
          const w = t * k
          const fl = bx - 3.2 * s * k
          const d = `M470 ${yy - R1} L${bx} ${yy - R1} A${R1} ${R1} 0 0 0 ${bx} ${yy + R1} L${bx + 22} ${yy + R1}`
          return (
            <g>
              <rect x={300} y={46} width={fl - 300} height={70} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
              <path d={d} fill="none" stroke="#4a3018" strokeWidth={w + 1.6} />
              <path d={d} fill="none" stroke="#b2804a" strokeWidth={w} />
              <BarEnd cx={bx} cy={yy} r={rb * k} />
              <T x={fl - 4} y={104} a="end" s={9.5} c={C.ground}>case</T>
              <T x={462} y={104} a="end" s={9.5} c={C.dim}>2.2 strap</T>
            </g>
          )
        })()}
      </Inset>

      <HDim x1={L} x2={Rx} y={268} f1={padBot + 12} f2={padBot + 12} text="pad 110" ty={282} />
      <T x={20} y={306} s={10} c={C.faint}>
        A single-pass strip runs on under the case instead — between caseback and pad.
      </T>
    </Fig>
  )
}

/* 9 · Check: a thin strap slides, a padded one jams */
function BCheck() {
  const panel = (ox, ok) => {
    const k = 5
    const y = 140
    const tT = 6
    const tB = 5
    const e = ox + 196
    const so = e - 5 * k
    const si = e - 13 * k
    const g = 6.5
    const t = ok ? 11 : 22
    const segs = [[ox + 4, si - g], [si + g, so - g], [so + g, e]]
    const lift = ok ? 0 : 8
    return (
      <g>
        {segs.map(([a, b], i) => (
          <g key={i} transform={i === 1 && !ok ? `translate(0 ${-lift})` : undefined}>
            <Ply x1={a} x2={b} y={y} t={tT} open={i === 0 ? 'l' : ''} />
            <Ply x1={a} x2={b} y={y + tT} t={tB} k="lining" open={i === 0 ? 'l' : ''} />
          </g>
        ))}
        {ok ? (
          <Band w={t} d={`M${ox + 30} ${y - t / 2} L${si - 10} ${y - t / 2} C${si - 2} ${y - t / 2} ${si + 1} ${y + tT + tB + t / 2} ${si + 10} ${y + tT + tB + t / 2} L${so - 10} ${y + tT + tB + t / 2} C${so - 1} ${y + tT + tB + t / 2} ${so + 2} ${y - t / 2} ${so + 10} ${y - t / 2} L${e + 18} ${y - t / 2}`} />
        ) : (
          <g>
            <Band w={t} d={`M${ox + 30} ${y - t / 2} L${si - 26} ${y - t / 2} C${si - 12} ${y - t / 2} ${si - 6} ${y + 2} ${si - 1} ${y + 10}`} />
            <path d={`M${si - 7} ${y - 6} l-5 -5 M${si + 7} ${y - 12} l5 -5 M${si + 8} ${y - 4} l7 -1`} stroke={C.ruby} strokeWidth="1.4" strokeLinecap="round" />
          </g>
        )}
        {ok ? (
          <Arrow a={[ox + 40, y - 24]} b={[ox + 100, y - 24]} c="emerald" both w={1.6} />
        ) : (
          <g>
            <Arrow a={[ox + 46, y - 40]} b={[si - 34, y - 40]} c="ruby" w={1.6} />
            <path d={`M${si - 22} ${y - 46} l10 10 m0 -10 l-10 10`} stroke={C.ruby} strokeWidth="1.8" />
          </g>
        )}
        <Verdict x={ox + 20} y={52} ok={ok} />
        <T x={ox + 36} y={50} s={12} c={ok ? C.emerald : C.ruby} w="600">
          {ok ? 'Thin, flat strap' : 'Heavily padded strap'}
        </T>
        <T x={ox + 36} y={65} s={10.5}>
          {ok ? '≈2.2 mm two-piece or 1.6 mm strip' : '4–5 mm at the lug, domed'}
        </T>
        <VDim x={ox + 22} y1={y - t} y2={y} text={ok ? '2.2' : '4.5'} tx={ox + 18} a="end" />
        <Lead p={[si, y + 2]} t={[si - 20, y + 40]} text="inner slit" a="end" s={10.5} />
        <Lead p={[so, y + 2]} t={[so + 6, y + 58]} text="outer slit" a="middle" s={10.5} />
        <T x={ox + 8} y={234} s={11} c={ok ? C.emerald : C.ruby}>
          {ok ? 'bends through both slits and slides' : 'won’t bend through the slit:'}
        </T>
        <T x={ox + 8} y={249} s={11} c={ok ? C.emerald : C.ruby}>
          {ok ? 'to adjust; the pad stays put' : 'jams, lifts and tears the bridge'}
        </T>
        <Lead p={[(si + so) / 2, y + tT + tB - lift + 1]} t={[(si + so) / 2 + 30, 172]} text="bridge" s={10.5} />
      </g>
    )
  }
  return (
    <Fig h={322} view="Section · through a passage" scale="true scale ×5">
      {panel(14, true)}
      <Sep x1={240} y1={34} x2={240} y2={256} />
      {panel(250, false)}
      <Sep x1={14} y1={264} x2={466} y2={264} />
      <Tag x={20} y={282}>Before you thread it</Tag>
      <Note x={20} y={298} s={10.5} lh={14} lines={['Slit length = strap width + ≈1 mm: test with the strap itself.', 'Push the strap through by hand — it should go without forcing.']} />
    </Fig>
  )
}

/* ================================================================== */
/* SINGLE-PASS (ZULU / NATO-STYLE) LEATHER STRAP                       */
/* ================================================================== */

/* 1 · Cut one strip, lug width × 250–270 mm */
function SpCut() {
  const Tr = { x: 50, y: 100, s: 1.5 }
  const x2 = 50 + 260 * 1.5
  return (
    <Fig h={276} view="Plan · cutting the strip" scale="plan ×1.5 · sections ×5">
      <Rule x={50} y={84} len={390} s={1.5} w={12} />
      <StrapPlan T={Tr} o={{ x0: 0, x1: 260, w0: 20, w1: 20, tip: 'square' }} />
      <Knife kind="utility" x={x2} y={108} ang={12} k={0.6} />
      <Lead p={[150, 76]} t={[150, 52]} text="steel rule, held on the strip" a="middle" />
      <Lead p={[x2 - 2, 92]} t={[388, 52]} text="one stroke, square end" a="end" />
      <VDim x={38} y1={85} y2={115} f1={48} f2={48} text="20" tx={33} a="end" />
      <T x={33} y={128} a="end" s={10} c={C.faint}>= lug</T>
      <HDim x1={50} x2={x2} y={134} f1={117} f2={117} text="250–270 · 260 here" ty={148} />
      <T x={245} y={163} a="middle" s={10} c={C.faint}>
        examples: 250 · 256 · 265 mm
      </T>

      <Sep x1={14} y1={176} x2={466} y2={176} />
      <Tag x={20} y={194}>Thickness</Tag>
      <XSec cx={80} y={210} w={100} layers={[{ k: 'top', t: 9.5 }]} edge="rough" />
      <T x={80} y={240} a="middle" s={10.5} c={C.text}>4–5 oz as bought</T>
      <T x={80} y={254} a="middle" s={10}>≈1.6–2.0 mm</T>
      <Arrow a={[138, 215]} b={[168, 215]} w={1.8} />
      <T x={153} y={206} a="middle" s={10} c={C.brass}>split</T>
      <XSec cx={226} y={211} w={100} layers={[{ k: 'top', t: 7.5 }]} edge="square" />
      <VDim x={282} y1={211} y2={218.5} f1={277} f2={277} text="1.3–1.6" />
      <T x={226} y={240} a="middle" s={10.5} c={C.text}>split to 1.3–1.6 mm</T>
      <T x={226} y={254} a="middle" s={10}>one layer, no lining</T>
      <Note x={340} y={204} head="Cut a touch wide?" hc={C.text} s={10.5} lh={14} lines={['Veg-tan narrows a little', 'with wear — some makers', 'cut slightly over lug width.']} />
    </Fig>
  )
}

/* 2 · Punch the tongue slot across the future buckle fold */
function SpSlot() {
  const s = 3.4
  const Tr = { x: 40, y: 84, s }
  const F = 20
  const fx = 40 + F * s
  const sy = 224.6
  return (
    <Fig h={272} view="Plan + section · the slot" scale="true scale ×3.4">
      <StrapPlan T={Tr} o={{ x0: 0, x1: 115, w0: 20, w1: 20, tip: 'square' }} folds={[{ x: F, label: 'buckle fold' }]} slot={{ x: F, len: 10, w: 2.2 }} centre />
      <Break x={420} y1={84 - 34} y2={84 + 34} />
      <T x={46} y={78} s={10} c={C.text}>end</T>
      <HDim x1={fx - 17} x2={fx + 17} y={128} f1={88} f2={88} text="≈10 × tongue width" tx={fx + 24} ty={131} a="start" />
      <HDim x1={40} x2={fx} y={150} f1={120} f2={132} text="flap ≈20" ty={146} />
      <Lead p={[fx + 10, 84]} t={[226, 28]} text="slot centred on the fold line" sub="half each side once folded" />
      <Lead p={[300, 84]} t={[330, 112]} text="strip continues to the tip" sub="(260 overall)" />

      <Sep x1={14} y1={166} x2={466} y2={166} />
      <Tag x={200} y={184}>Section · punching</Tag>
      <Slab x={26} y={230} w={300} h={12} kind="board" />
      <Ply x1={40} x2={320} y={sy} t={5.4} open="r" />
      <Punch kind="oblong" d={20} x={fx} y={229} k={0.65} />
      <Mallet x={fx} y={229 - 64 * 0.65} k={0.6} />
      <Arrow a={[fx - 34, 176]} b={[fx - 34, 200]} w={1.6} />
      <Lead p={[fx + 15, 214]} t={[200, 206]} text="oblong punch" sub="2–3 mm wide" />
      <Lead p={[290, 236]} t={[290, 262]} text="poly board" a="middle" />
      <Lead p={[60, 227]} t={[60, 260]} text="strip, 1.3–1.6" a="middle" />
      <Note x={340} y={196} head="Or: round + knife" hc={C.text} s={10.5} lh={14} lines={['a round punch at each', 'end, knife cut between.', 'Check the tongue’s', 'direction before folding.']} />
    </Fig>
  )
}

// A keeper ring in longitudinal section: the cut top and bottom spans,
// with the out-of-plane sides dashed.
function KeeperRing({ x, w, y1, y2, kt = 5, k = 'top' }) {
  return (
    <g>
      <rect x={x - w / 2 - 2} y={y1 - kt} width={w + 4} height={y2 - y1 + 2 * kt} rx="3" fill="none" stroke="#b98c57" strokeWidth="1" strokeDasharray="2.5 2" />
      <rect x={x - w / 2} y={y1 - kt} width={w} height={kt} rx="1.5" fill={k === 'dark' ? 'url(#sk-dark)' : 'url(#sk-topS)'} stroke="#4a3018" strokeWidth="0.8" />
      <rect x={x - w / 2} y={y2} width={w} height={kt} rx="1.5" fill={k === 'dark' ? 'url(#sk-dark)' : 'url(#sk-topS)'} stroke="#4a3018" strokeWidth="0.8" />
    </g>
  )
}

/* 3 · Skive the end, slip the keeper on, fold round the buckle */
function SpFold() {
  const s = 5
  const t = 1.6 * s
  const r = 1.1 * s
  const cx = 330
  const yTop = 96
  const y1 = yTop + t
  const cy = y1 + r
  const flap = 20 * s
  const cv = r * 2.4
  const fEnd = cx - flap
  const kx = 288
  const tailAt = (x) => t * 0.85 * ((x - fEnd) / (cx - cv - fEnd))
  return (
    <Fig h={300} view="Section · buckle end" scale="true scale ×5">
      <Ply x1={30} x2={cx} y={yTop} t={t} open="lr" />
      <path d={`M30 ${yTop - 4} l-4 6 l8 6 l-4 6`} fill="none" stroke={C.dim} />
      <Wrap cx={cx} cy={cy} r={r} t={t} xR={cx} conv={cv} tail={flap - cv} ts={t * 0.85} dir={-1} />
      <BuckleSide cx={cx} cy={cy} r={r} s={s} T={t} />
      <KeeperRing x={kx} w={25} y1={yTop - 1} y2={y1 + tailAt(kx) + 1} kt={6} />

      <NLead n={1} p={[fEnd + 8, y1 + 1]} t={[40, 150]} text="skive the end" sub="feathered, so the loop lies flat" />
      <NLead n={2} p={[kx, yTop - 7]} t={[150, 46]} text="slip the fixed keeper on" sub="before the fold closes" />
      <NLead n={3} p={[cx - 4, cy + r + t - 1]} t={[458, 186]} a="end" text="fold round the buckle bar" sub="tongue up through the slot" />
      <Lead p={[cx + 44, cy - r - t + 1]} t={[452, 62]} text="tongue" a="end" />
      <Lead p={[cx + 3, cy + 2]} t={[452, 140]} text="buckle bar" a="end" />
      <HDim x1={fEnd} x2={cx + r + t} y={cy + 44} f1={y1 + 4} f2={cy + r + t + 4} text="loop ≈15–20" ty={cy + 58} />

      <Sep x1={14} y1={214} x2={466} y2={214} />
      <Tag x={20} y={232}>Fixed keeper: either</Tag>
      <XSec cx={84} y={252} w={56} layers={[{ k: 'top', t: 6 }, { k: 'top', t: 6 }]} edge="square" />
      <rect x={52} y={246} width={64} height={24} rx="4" fill="none" stroke="#6e4a2a" strokeWidth="4" />
      <rect x={52} y={246} width={64} height={24} rx="4" fill="none" stroke="#e0b277" strokeWidth="0.7" />
      <T x={84} y={288} a="middle" s={10.5} c={C.text}>a leather loop</T>
      <XSec cx={220} y={252} w={56} layers={[{ k: 'top', t: 6 }, { k: 'top', t: 6 }]} edge="square" />
      <rect x={187} y={245} width={66} height={26} rx="6" fill="none" stroke="url(#sk-steelH)" strokeWidth="3" />
      <T x={220} y={288} a="middle" s={10.5} c={C.text}>or a metal ring</T>
      <Note x={300} y={244} s={10.5} lh={14} lines={['Shown across the doubled', 'end. A 15–20 mm loop is a', 'sensible start (inferred).']} />
    </Fig>
  )
}

/* 4 · Close the loop — stitched, clear of the lug zone */
function SpClose() {
  const Tr = { x: 62, y: 76, s: 1.5 }
  const X = (mm) => 62 + mm * 1.5
  const s = 5
  const t = 1.6 * s
  const r = 1.1 * s
  const cx = 300
  const yTop = 198
  const y1 = yTop + t
  const cy = y1 + r
  const flap = 20 * s
  const cv = r * 2.4
  const fEnd = cx - flap
  return (
    <Fig h={300} view="Plan + section · closing the loop" scale="plan ×1.5 · section ×5">
      <StrapPlan
        T={Tr}
        o={{ x0: 0, x1: 240, w0: 20, w1: 20, tip: 'round', tipLen: 8 }}
        zones={[
          { from: 28, to: 42, k: 'ruby' },
          { from: 76, to: 90, k: 'ruby' },
        ]}
        keepers={[{ x: 12 }]}
        holes={{ n: 7, pitch: 7, fromTip: 25 }}
      />
      <Buckle x={62} y={76} w={30} L={24} ang={180} />
      <line x1={X(20)} y1={60} x2={X(20)} y2={92} stroke={C.dim} strokeWidth="0.9" strokeDasharray="3 2" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={X(16) - 1.5} y1={65 + i * 5} x2={X(16) + 1.5} y2={68 + i * 5} stroke={C.thread} strokeWidth="1.4" strokeLinecap="round" />
      ))}
      <T x={X(59)} y={40} a="middle" s={11} c={C.ruby}>
        over the bars: it flexes — no rivets
      </T>
      <line x1={X(35)} y1={60} x2={X(48)} y2={45} stroke={C.ruby} strokeWidth="0.8" />
      <line x1={X(83)} y1={60} x2={X(70)} y2={45} stroke={C.ruby} strokeWidth="0.8" />
      <T x={X(98)} y={106} a="middle" s={10} c={C.faint}>
        bar zones shift with wrist size
      </T>
      <Verdict x={40} y={134} ok r={7} />
      <T x={52} y={138} s={10.5} c={C.emerald}>close the loop here</T>
      <line x1={X(16)} y1={92} x2={X(16)} y2={127} stroke={C.emerald} strokeWidth="0.8" />
      <Lead p={[X(20), 92]} t={[X(26), 114]} text="flap end, underneath" s={10.5} />
      <Lead p={[X(240) - 6, 76]} t={[448, 112]} text="tip" a="end" s={10.5} />

      <Sep x1={14} y1={146} x2={466} y2={146} />
      <Tag x={20} y={164}>Section · the loop stitched shut</Tag>
      <Ply x1={30} x2={cx} y={yTop} t={t} open="lr" />
      <path d={`M30 ${yTop - 4} l-4 6 l8 6 l-4 6`} fill="none" stroke={C.dim} />
      <Wrap cx={cx} cy={cy} r={r} t={t} xR={cx} conv={cv} tail={flap - cv} ts={t * 0.85} dir={-1} />
      <BuckleSide cx={cx} cy={cy} r={r} s={s} T={t} />
      <KeeperRing x={262} w={25} y1={yTop - 1} y2={y1 + 6} kt={6} />
      <SectionStitch x1={fEnd + 10} x2={fEnd + 34} y1={yTop} y2={y1 + 2.5} p={8} />
      <Lead p={[fEnd + 22, yTop - 3]} t={[160, 182]} text="stitches through both layers" a="end" s={10.5} />
      <Lead p={[fEnd + 3, y1 + 1]} t={[150, 236]} text="skived flap end" a="end" s={10.5} />
      <Lead p={[262, yTop - 8]} t={[262, 178]} text="fixed keeper, trapped" a="middle" s={10.5} />
      <Note x={30} y={262} s={10.5} lh={14} lines={['Stitch it — or glue and rivet the loop.', 'A rivet is fine in the loop, never where', 'the strap bends over the bars.']} />
      <Verdict x={380} y={258} ok r={7} />
      <T x={392} y={262} s={10.5} c={C.emerald}>loop: stitch / rivet</T>
      <Verdict x={380} y={280} ok={false} r={7} />
      <T x={392} y={284} s={10.5} c={C.ruby}>lug zone: no rivet</T>
    </Fig>
  )
}

/* 5 · Shape the tail: angled or round, holes punched */
function SpTail() {
  const s = 3
  const T1 = { x: 40 - 150 * s, y: 78, s }
  const T2 = { x: 40 - 150 * s, y: 190, s }
  const o = (tip, tipLen) => ({ x0: 150, x1: 260, w0: 20, w1: 20, taper: [0, 260], tip, tipLen })
  const hx = (mm) => 40 + (mm - 150) * s
  return (
    <Fig h={286} view="Plan · the tail" scale="true scale ×3">
      <StrapPlan T={T1} o={o('point', 12)} holes={{ n: 7, pitch: 7, fromTip: 25 }} centre />
      <path d="M40 44 l-4 12 l8 12 l-4 12 l4 12 l-4 12" fill="none" stroke={C.dim} />
      <StrapPlan T={T2} o={o('round', 10)} holes={{ n: 7, pitch: 7, fromTip: 25 }} centre />
      <path d="M40 156 l-4 12 l8 12 l-4 12 l4 12 l-4 12" fill="none" stroke={C.dim} />
      <Knife kind="utility" x={352} y={63} ang={-14} k={0.5} />
      <HDim x1={hx(228)} x2={hx(235)} y={36} f1={74} f2={74} text="7" tx={hx(231.5)} ty={31} />
      <HDim x1={hx(235)} x2={hx(260)} y={122} f1={82} f2={82} text="25" ty={135} />
      <T x={378} y={74} s={11.5} c={C.text}>angled</T>
      <T x={378} y={88} s={10}>two knife cuts</T>
      <T x={378} y={186} s={11.5} c={C.text}>or round</T>
      <T x={378} y={200} s={10}>punch or template</T>
      <Lead p={[hx(214), 75]} t={[184, 30]} text="hole Ø 1.5–2 mm" a="end" sub="≥ the tongue" />
      <Punch d={5.4} x={hx(193)} y={190} k={0.85} />
      <Mallet x={hx(193)} y={190 - 64 * 0.85} k={0.5} />
      <Lead p={[hx(193) + 5, 176]} t={[250, 246]} text="cutting punch, on a board" sub="last hole ≈25 from the tip" />
      <T x={40} y={274} s={10} c={C.faint}>
        Pitch 6–7 mm (house default) · 7 holes · centre hole near your wrist size.
      </T>
    </Fig>
  )
}

/* 6 · Keepers: the tail passes at least two */
function SpKeepers() {
  const Tr = { x: 180, y: 86, s: 2.6 }
  const X = (mm) => 180 + mm * 2.6
  const yA = 214
  const yB = 222
  const yC = 230
  return (
    <Fig h={300} view="Plan + section · keepers" scale="plan ×2.6 · section schematic">
      {/* buckle end, running on to the watch */}
      <StrapPlan T={Tr} o={{ x0: 0, x1: 108, w0: 20, w1: 20, tip: 'square' }} />
      <Break x={440} y1={60} y2={112} />
      {/* the tail coming from round the wrist */}
      <rect x={60} y={60} width={82} height={52} fill="rgba(178,128,74,0.18)" stroke="#e0b277" strokeWidth="0.9" strokeDasharray="4 3" />
      <StrapPlan T={Tr} o={{ x0: -15, x1: 42, w0: 20, w1: 20, tip: 'point', tipLen: 8 }} holes={{ xs: [-11, -4, 3, 10, 17] }} keepers={[{ x: 12 }, { x: 28, float: true }]} />
      <Buckle x={180} y={86} w={52} L={39} ang={180} />
      <Lead p={[150, 80]} t={[128, 36]} text="tongue in a hole" a="end" />
      <Lead p={[X(12), 57]} t={[200, 36]} text="fixed keeper" a="start" />
      <Lead p={[X(28), 57]} t={[290, 46]} text="floating keeper" a="start" />
      <Verdict x={X(42) + 18} y={86} ok r={7} />
      <T x={X(42) + 30} y={90} s={10.5} c={C.emerald}>tip past both</T>
      <Lead p={[100, 112]} t={[100, 140]} text="tail, from round the wrist" a="middle" s={10.5} />
      <Lead p={[380, 112]} t={[380, 140]} text="buckle end → 12 o’clock bar" a="middle" s={10.5} />

      <Sep x1={14} y1={156} x2={466} y2={156} />
      <Tag x={20} y={174}>Section · same positions</Tag>
      {/* flap of the buckle loop */}
      <Band w={6} d={`M${X(20)} ${yC} L180 ${yC}`} />
      {/* buckle end, folded round the bar */}
      <Band w={6} d={`M180 ${yC} A4 4 0 0 1 180 ${yB} L470 ${yB}`} />
      {/* buckle frame and bar */}
      <rect x={141} y={216.5} width={39} height={2.6} rx="1.2" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.5" />
      <circle cx={141} cy={217.5} r={2.6} fill="url(#sk-barEnd)" stroke="#2d3940" strokeWidth="0.6" />
      <BarEnd cx={180} cy={226} r={2.4} />
      {/* tail: up through the frame, back over everything */}
      <Band w={6} d={`M50 246 L120 246 C138 246 140 ${yA} 156 ${yA} L${X(42) - 6} ${yA}`} />
      <path d={`M180 226 Q166 204 151 206 L143 214`} fill="none" stroke="#d9e3e9" strokeWidth="2" strokeLinecap="round" />
      <KeeperRing x={X(12)} w={13} y1={yA - 4} y2={yC + 4} kt={4} />
      <KeeperRing x={X(28)} w={13} y1={yA - 4} y2={yB + 4} kt={4} k="dark" />
      <Lead p={[X(42) - 8, yA]} t={[332, 194]} text="tail (outer)" s={10.5} />
      <Lead p={[360, yB + 2]} t={[400, 248]} text="buckle end" s={10.5} />
      <Lead p={[X(16), yC + 3]} t={[260, 262]} text="loop flap (skin side)" s={10.5} />
      <Lead p={[80, 247]} t={[60, 270]} text="tail coming up" a="start" s={10.5} />
      <T x={20} y={292} s={10} c={C.faint}>
        One or two floating leather keepers; the tail should pass at least two.
      </T>
    </Fig>
  )
}

/* 7 · Finish: edges, sealing, conditioning */
function SpFinish() {
  const Tr = { x: 62, y: 70, s: 1.5 }
  const panels = [
    ['Edges', 'bevel · sand · burnish', 'gum or Tokonole, slicker'],
    ['Seal', 'e.g. Resolene 1:1', '2–3 thin coats'],
    ['Condition', 'a light balm or oil', 'buff off the excess'],
  ]
  return (
    <Fig h={290} view="Plan + finishing details" scale="plan ×1.5 · sections ×5">
      <StrapPlan T={Tr} o={{ x0: 0, x1: 240, w0: 20, w1: 20, tip: 'round', tipLen: 8 }} glow={C.brass} keepers={[{ x: 12 }, { x: 28, float: true }]} holes={{ n: 7, pitch: 7, fromTip: 25 }} />
      <Buckle x={62} y={70} w={30} L={24} ang={180} />
      <Lead p={[260, 55]} t={[260, 36]} text="edges finished full length, both sides" a="middle" />
      <Lead p={[90, 85]} t={[90, 112]} text="round the loop and keepers too" a="start" s={10.5} />
      <Lead p={[62 + 236 * 1.5, 80]} t={[440, 112]} text="and the tip" a="end" s={10.5} />
      <Sep x1={14} y1={128} x2={466} y2={128} />
      {panels.map(([name, a, b], i) => {
        const cx = 84 + i * 156
        const y = 196
        return (
          <g key={name}>
            <Num x={cx - 60} y={146} n={i + 1} r={7} />
            <T x={cx - 48} y={150} s={11.5} c={C.text} w="600">
              {name}
            </T>
            <clipPath id={`spf-${i}`}>
              <rect x={cx - 66} y={160} width={98} height={70} />
            </clipPath>
            <g clipPath={`url(#spf-${i})`}>
              <XSec cx={cx - 34} y={y} w={100} layers={[{ k: 'top', t: 8 }]} edge={i === 0 ? 'round' : 'round'} />
            </g>
            {i === 0 && <Slicker x={cx + 18} y={y + 4} ang={90} len={44} />}
            {i === 0 && <path d={`M${cx + 10} ${y + 1} Q${cx + 16} ${y + 4} ${cx + 10} ${y + 7}`} fill="none" stroke="#fff3d6" strokeWidth="1.4" />}
            {i === 1 && (
              <g>
                <path d={`M${cx - 66} ${y - 1.2} L${cx + 12} ${y - 1.2}`} stroke="rgba(170,215,230,0.8)" strokeWidth="1.6" />
                <Dauber x={cx - 10} y={y - 2} k={0.7} c="#c9b98f" />
              </g>
            )}
            {i === 2 && <Dauber x={cx - 10} y={y - 2} k={0.7} c="#8a5a2c" />}
            <T x={cx - 60} y={252} s={10.5} c={C.text}>
              {a}
            </T>
            <T x={cx - 60} y={266} s={10}>
              {b}
            </T>
          </g>
        )
      })}
      <T x={20} y={284} s={10} c={C.faint}>
        Both faces show on a single-pass strap: finish the flesh side smooth as well.
      </T>
    </Fig>
  )
}

/* 8 · Fit: over the top bar, under the case, over the bottom bar, buckle, keepers */
function SpFit() {
  const s = 2.9
  const W = { cx: 150, cy: 170, A: 96, B: 62 }
  const E = (td, d = 0) => {
    const a = (td * Math.PI) / 180
    return [W.cx + (W.A + d) * Math.cos(a), W.cy + (W.B + d) * Math.sin(a)]
  }
  const arc = (t1, t2, d1, d2 = d1, n = 30) =>
    Array.from({ length: n + 1 }, (_, i) => {
      const f = i / n
      const sm = f * f * (3 - 2 * f)
      return E(t1 + (t2 - t1) * f, d1 + (d2 - d1) * sm)
    })
  const L = (pts) => pts.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  const M = ([x, y]) => `M${x.toFixed(1)} ${y.toFixed(1)}`
  const yS = W.cy - W.B
  const by = yS - 2.5 - 4.7 * s
  const [bl, br] = barX(W.cx, s)
  const rb = 0.9 * s
  const fr = rb + 2.5
  const gl = bl + fr
  const gr = br - fr
  const ol = bl - fr
  const or = br + fr
  const e214 = E(214)
  const em30 = E(-30)
  // flap of the buckle loop (skin side) + fold round the buckle bar
  const flapD = M(E(126)) + ' ' + L(arc(126, 92, 0)) + ` A2.5 2.5 0 0 1 ${E(92, 5)[0].toFixed(1)} ${E(92, 5)[1].toFixed(1)}`
  // buckle end → over the 12 bar → under the case → over the 6 bar → round the wrist
  const mainD =
    M(E(92, 5)) +
    ' ' +
    L([...arc(92, 130, 5), ...arc(130, 138, 5, 0, 8), ...arc(138, 214, 0)]) +
    ` C${e214[0] + 10} ${e214[1] - 10} ${ol} ${by + 20} ${ol} ${by + 8} L${ol} ${by} A${fr} ${fr} 0 0 1 ${gl} ${by} L${gl} ${yS - 8} Q${gl} ${yS} ${gl + 8} ${yS}` +
    ` L${gr - 8} ${yS} Q${gr} ${yS} ${gr} ${yS - 8} L${gr} ${by} A${fr} ${fr} 0 0 1 ${or} ${by} L${or} ${by + 8} C${or} ${by + 22} ${em30[0] - 10} ${em30[1] - 11} ${em30[0]} ${em30[1]} ` +
    L(arc(-30, 70, 0))
  const tailD = M(E(70)) + ' ' + L([...arc(70, 80, 0, 10, 10), ...arc(80, 160, 10)])
  const keeper = (td, d0, d1, dt = 5) => {
    const p = [E(td - dt, d0), E(td + dt, d0), E(td + dt, d1), E(td - dt, d1)]
    return <path d={`M${p.map((q) => q.map((v) => v.toFixed(1)).join(' ')).join(' L')} Z`} fill="none" stroke="#6e4a2a" strokeWidth="3" strokeLinejoin="round" />
  }
  const fb = E(92, 2.5)
  const ff = E(72, 7)
  const tongueTip = E(80, 14)
  return (
    <Fig h={300} view="Section · the threading path" scale="schematic · watch ×2.9">
      <Wrist cx={W.cx} cy={W.cy} rx={W.A - 3} ry={W.B - 3} />
      <WatchSide cx={W.cx} y={by} s={s} />
      <BarEnd cx={bl} cy={by} r={rb} />
      <BarEnd cx={br} cy={by} r={rb} />
      <Band w={5} d={flapD} />
      <Band w={5} d={mainD} />
      <Band w={5} d={tailD} />
      {/* buckle */}
      <path d={`M${fb[0]} ${fb[1]} ${L(arc(90, 72, 7, 7, 10))}`} fill="none" stroke="url(#sk-steelH)" strokeWidth="2.6" />
      <circle cx={ff[0]} cy={ff[1]} r={2.4} fill="url(#sk-barEnd)" stroke="#2d3940" strokeWidth="0.6" />
      <BarEnd cx={fb[0]} cy={fb[1]} r={2.4} />
      <path d={`M${fb[0]} ${fb[1]} Q${tongueTip[0]} ${tongueTip[1]} ${ff[0]} ${ff[1] + 2}`} fill="none" stroke="#d9e3e9" strokeWidth="1.8" strokeLinecap="round" />
      {keeper(106, -3.5, 13.5)}
      {keeper(146, -3.5, 13.5)}
      <LugGhosts cx={W.cx} y={by} s={s} />
      {/* direction */}
      <Arrow d={`M${W.cx - 30} ${yS + 14} L${W.cx + 30} ${yS + 14}`} w={1.6} />
      <Arrow d={M(E(-12, 16)) + ' ' + L(arc(-12, 22, 16, 16, 10))} w={1.6} />
      <Arrow d={M(E(178, 18)) + ' ' + L(arc(178, 200, 18, 18, 10))} w={1.6} />
      <T x={bl} y={by - 26} a="middle" s={10} c={C.dim}>12</T>
      <T x={br} y={by - 26} a="middle" s={10} c={C.dim}>6</T>
      <Num x={bl - 20} y={by - 6} n={1} r={7} />
      <Num x={W.cx} y={yS + 30} n={2} r={7} />
      <Num x={br + 20} y={by - 6} n={3} r={7} />
      <Num x={E(84, 30)[0]} y={E(84, 30)[1]} n={4} r={7} />
      <Num x={E(150, 30)[0]} y={E(150, 30)[1]} n={5} r={7} />

      <Tag x={290} y={44}>Threading order</Tag>
      <Step x={298} y={68} n={1} text="over the 12 o’clock bar" sub="from outside, down the gap" />
      <Step x={298} y={100} n={2} text="under the case" sub="flat on the caseback" />
      <Step x={298} y={132} n={3} text="over the 6 o’clock bar" sub="up the gap, out and down" />
      <Step x={298} y={164} n={4} text="round the wrist, through" sub="the buckle, tongue in a hole" />
      <Step x={298} y={196} n={5} text="back through the keepers" sub="tuck the surplus tail" />
      <Inset x={290} y={220} w={176} h={72} at={[br, by]} r={11} title="gap caps thickness">
        {(() => {
          const k = 7.25
          const bx = 412
          const yy = 262
          const R1 = 0.9 * k + 0.8 * k
          const fl = bx - 3.2 * k
          const d = `M${bx - R1} 300 L${bx - R1} ${yy} A${R1} ${R1} 0 0 1 ${bx + R1} ${yy} L${bx + R1} 300`
          return (
            <g>
              <rect x={280} y={238} width={fl - 280} height={80} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
              <path d={d} fill="none" stroke="#4a3018" strokeWidth={1.6 * k + 1.6} />
              <path d={d} fill="none" stroke="#b2804a" strokeWidth={1.6 * k} />
              <BarEnd cx={bx} cy={yy} r={0.9 * k} />
              <T x={fl - 4} y={286} a="end" s={9.5} c={C.ground}>case</T>
              <T x={462} y={286} a="end" s={9.5} c={C.dim}>1.3–1.6</T>
            </g>
          )
        })()}
      </Inset>
    </Fig>
  )
}

/* 9 · NATO variant: a second flap of 80–100 mm behind the keeper */
function SpNato() {
  const k = 1.4
  const X = (mm) => 60 + mm * k
  const y = 82
  // worn panel
  const s = 2.4
  const cx = 250
  const by = 196
  const yS = by + 4.7 * s + 2.5
  const [bl, br] = barX(cx, s)
  const rb = 0.9 * s
  const fr = rb + 2.5
  const yF = yS + 5
  return (
    <Fig h={330} view="Sections · NATO-style flap" scale="flat ×1.4 · worn ×2.4">
      <Tag x={20} y={40}>Laid flat</Tag>
      {/* loop flap and fold */}
      <Band w={5} d={`M${X(20)} ${y + 5} L${X(0)} ${y + 5} A2.5 2.5 0 0 1 ${X(0)} ${y}`} />
      {/* second flap, stitched behind the fixed keeper */}
      <Band w={5} d={`M${X(22)} ${y + 5} L${X(112)} ${y + 5}`} k="dark" />
      {/* main strip */}
      <Band w={5} d={`M${X(0)} ${y} L${X(240)} ${y}`} />
      <BarEnd cx={X(0)} cy={y + 2.5} r={2.2} />
      <rect x={X(0) - 22} y={y + 1} width={22} height={2.4} rx="1.2" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.5" />
      <circle cx={X(0) - 22} cy={y + 2.2} r={2.4} fill="url(#sk-barEnd)" stroke="#2d3940" strokeWidth="0.6" />
      <KeeperRing x={X(11)} w={7} y1={y - 3} y2={y + 8} kt={3} />
      <KeeperRing x={X(108)} w={7} y1={y + 2} y2={y + 8} kt={3} k="dark" />
      {[24, 27, 30, 33].map((m) => (
        <line key={m} x1={X(m)} y1={y - 4} x2={X(m)} y2={y + 9} stroke={C.thread} strokeWidth="1.3" />
      ))}
      {[180, 187, 194, 201, 208, 215].map((m) => (
        <rect key={m} x={X(m) - 1.3} y={y - 3} width={2.6} height={6} fill={C.ground} />
      ))}
      <HDim x1={X(22)} x2={X(112)} y={y + 26} f1={y + 10} f2={y + 12} text="80–100 (90 here)" ty={y + 40} />
      <Lead p={[X(28), y - 4]} t={[120, 50]} text="stitched just behind the keeper" a="start" s={10.5} />
      <Lead p={[X(160), y - 3]} t={[300, 50]} text="main strip, 250–270" a="start" s={10.5} />
      <Lead p={[X(108), y + 11]} t={[X(130), y + 32]} text="keeper on the flap end" a="start" s={10.5} />
      <Lead p={[X(0) - 22, y + 2]} t={[34, 108]} text="buckle" a="middle" s={10.5} />

      <Sep x1={14} y1={140} x2={466} y2={140} />
      <Tag x={20} y={158}>Worn · section at the watch</Tag>
      <path d={`M60 ${yF + 30} Q${cx} ${yF - 2} 440 ${yF + 30}`} fill="none" stroke="#a57e66" strokeWidth="1" strokeDasharray="6 4" opacity="0.7" />
      <WatchSide cx={cx} y={by} s={s} />
      {/* second flap: from its stitching near the buckle, under the case, to its keeper */}
      <Band w={5} k="dark" d={`M70 284 C120 262 ${bl - 20} ${yF} ${bl + 10} ${yF} L${br + 10} ${yF} C${br + 22} ${yF} ${br + 26} ${yF + 4} ${br + 30} ${yF + 9}`} />
      {/* main strap */}
      <Band
        w={5}
        d={`M40 292 C110 262 ${bl - fr} ${by + 30} ${bl - fr} ${by + 6} L${bl - fr} ${by} A${fr} ${fr} 0 0 1 ${bl + fr} ${by} L${bl + fr} ${yS - 6} Q${bl + fr} ${yS} ${bl + fr + 6} ${yS} L${br - fr - 6} ${yS} Q${br - fr} ${yS} ${br - fr} ${yS - 6} L${br - fr} ${by} A${fr} ${fr} 0 0 1 ${br + fr} ${by} L${br + fr} ${by + 10} C${br + fr} ${by + 30} 380 262 440 284`}
      />
      <BarEnd cx={bl} cy={by} r={rb} />
      <BarEnd cx={br} cy={by} r={rb} />
      <g transform={`rotate(58 ${br + 30} ${yF + 14})`}>
        <rect x={br + 30 - 9} y={yF + 14 - 9} width={18} height={18} rx="3" fill="none" stroke="#6e4a2a" strokeWidth="3" />
      </g>
      <LugGhosts cx={cx} y={by} s={s} />
      <T x={bl} y={by - 22} a="middle" s={10} c={C.dim}>12</T>
      <T x={br} y={by - 22} a="middle" s={10} c={C.dim}>6</T>
      <line x1={141} y1={244} x2={96} y2={200} stroke={C.struct} strokeWidth="0.8" opacity="0.8" />
      <circle cx={141} cy={244} r="2.2" fill={C.text} />
      <T x={24} y={180} s={10.5} c={C.text}>main strap</T>
      <T x={24} y={193} s={9.5} c={C.faint}>over both bars, under the case</T>
      <Lead p={[cx + 30, yF + 1]} t={[cx + 30, 252]} text="second flap: under the case, skin side" a="middle" s={10.5} />
      <Lead p={[br + 33, yF + 14]} t={[332, 178]} text="flap keeper" a="start" s={10.5} sub="catches the main strap" />
      <Lead p={[90, 276]} t={[28, 314]} text="flap stitched at the buckle end" a="start" s={10.5} />
      <T x={466} y={306} a="end" s={10} c={C.faint}>so the watch can’t slide off —</T>
      <T x={466} y={320} a="end" s={10} c={C.faint}>extrapolated from nylon NATOs</T>
    </Fig>
  )
}

/* ================================================================== */
/* NO-SEW STRAPS: GLUED, RIVETED, CHICAGO-SCREW                        */
/* ================================================================== */
const NS = { t: 1.2, bar: 0.9, rivA: 9, pitch: 12.7 }

// Small fixed-width check / cross line for comparison lists.
function VLine({ x, y, ok, text, s = 10.5, c }) {
  return (
    <g>
      {ok != null && <Verdict x={x + 5} y={y - 4} ok={ok} r={5} />}
      <T x={x + 14} y={y} s={s} c={c || (ok == null ? C.dim : ok ? C.emerald : C.ruby)}>
        {text}
      </T>
    </g>
  )
}

/* 1 · Template: from an old strap, or width from the bar spacing */
function NsTemplate() {
  const TL = { x: 46, y: 96, s: 1.6 }
  const TS = { x: 46, y: 190, s: 1.6 }
  return (
    <Fig h={290} view="Plan · template" scale="plan ×1.6 · lugs ×4">
      <rect x={20} y={34} width={276} height={240} rx="4" fill="rgba(226,214,190,0.08)" stroke={C.struct} strokeWidth="0.9" />
      <T x={28} y={266} s={10} c={C.faint}>card</T>
      <StrapPlan T={TL} o={{ x0: 0, x1: 120, w0: 20, w1: 18, taper: [8, 100], tip: 'ogive', tipLen: 14 }} face="dark" over={1.5} holes={{}} />
      <StrapPlan T={TS} o={{ x0: 0, x1: 80, w0: 20, w1: 18, taper: [8, 80], tip: 'square' }} face="dark" over={1.5} slot={{ x: 74 }} />
      <Awl kind="scratch" x={46 + 121.5 * 1.6} y={96} ang={34} k={0.62} />
      <Lead p={[100, 90]} t={[60, 52]} text="old strap, unpicked" a="start" />
      <Lead p={[150, 114.6]} t={[150, 128]} text="traced 1.5 mm out" a="middle" s={10.5} sub="scratch awl round the edge" />
      <Lead p={[46 + 30 * 1.6, 190]} t={[60, 236]} text="short piece" a="start" s={10.5} />
      <Lead p={[46 + 74 * 1.6, 190]} t={[190, 236]} text="slot and holes" a="start" s={10.5} sub="pricked through" />

      <Sep x1={306} y1={34} x2={306} y2={280} />
      <Tag x={316} y={48}>Or: width from the bars</Tag>
      {/* lugs in plan */}
      <path d="M318 176 Q392 156 466 176" fill="none" stroke="#9fb4c2" strokeWidth="1" />
      <rect x={338} y={80} width={14} height={92} rx="5" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.8" />
      <rect x={432} y={80} width={14} height={92} rx="5" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.8" />
      <rect x={352} y={94} width={80} height={7} rx="3.5" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.7" />
      <rect x={352} y={101} width={80} height={60} fill="rgba(178,128,74,0.25)" stroke="#e0b277" strokeWidth="0.9" strokeDasharray="4 3" />
      <HDim x1={352} x2={432} y={68} f1={80} f2={80} text="20" />
      <T x={392} y={135} a="middle" s={10.5} c={C.text}>strap</T>
      <T x={466} y={192} a="end" s={10} c={C.faint}>case</T>
      <Note x={316} y={212} s={10.5} lh={14} lines={['bar spacing = strap width', '20 mm lugs → 20 mm strap', 'never wider; ≤ 0.2 mm under']} />
      <T x={316} y={262} s={10} c={C.faint}>measure inside the lugs</T>
    </Fig>
  )
}

/* 2 · Cut 2–4 oz strips and test-fit them in the hardware */
function NsCut() {
  return (
    <Fig h={316} view="Plan + side views · test-fit" scale="plan ×1.3 · sides ×6–7">
      <Tag x={20} y={40}>Strips · 2–4 oz veg-tan</Tag>
      <StrapPlan T={{ x: 30, y: 66, s: 1.3 }} o={{ x0: 0, x1: 175, w0: 20, w1: 20, tip: 'square' }} />
      <StrapPlan T={{ x: 30, y: 106, s: 1.3 }} o={{ x0: 0, x1: 110, w0: 20, w1: 20, tip: 'square' }} />
      <T x={30 + 175 * 1.3 + 8} y={70} s={10.5} c={C.text}>long blank</T>
      <T x={30 + 110 * 1.3 + 8} y={110} s={10.5} c={C.text}>short blank</T>
      <T x={30 + 110 * 1.3 + 8} y={123} s={10} c={C.faint}>cut long; trim later</T>
      <VDim x={22} y1={53} y2={79} text="20" tx={18} a="end" />
      <XSec cx={400} y={60} w={80} layers={[{ k: 'top', t: 7 }]} edge="square" />
      <VDim x={446} y1={60} y2={67} f1={441} f2={441} text="" />
      <T x={400} y={86} a="middle" s={10.5} c={C.text}>0.8–1.6 mm</T>
      <T x={400} y={100} a="middle" s={10}>2–4 oz (1 oz ≈ 0.4 mm)</T>

      <Sep x1={14} y1={140} x2={466} y2={140} />
      <Tag x={20} y={158}>Try it in the buckle</Tag>
      {(() => {
        const t = 1.2 * 6
        const r = 1.1 * 6
        const cx = 170
        const yTop = 200
        const cy = yTop + t + r
        return (
          <g>
            <Ply x1={30} x2={cx} y={yTop} t={t} open="lr" />
            <FoldEnd cx={cx} cy={cy} r={r} t={t} dir={-1} flap={70} bar={false} />
            <BuckleSide cx={cx} cy={cy} r={r} s={4.4} T={t} />
            <Lead p={[cx - 40, yTop + t + 2]} t={[80, 262]} text="folds round the bar" a="middle" s={10.5} sub="no glue yet" />
            <Lead p={[cx + 30, yTop - 3]} t={[232, 176]} text="tongue fits" a="end" s={10.5} />
          </g>
        )
      })()}
      <Sep x1={256} y1={150} x2={256} y2={300} />
      <Tag x={266} y={158}>…and in the lugs</Tag>
      {(() => {
        const s = 7
        const bx = 330
        const by = 220
        const t = 1.2 * s
        const r = 0.9 * s
        return (
          <g>
            <CaseSide x={bx} y={by} s={s} gap={3.2} len={6} />
            <FoldEnd cx={bx} cy={by} r={r} t={t} dir={1} flap={60} body={470} />
            <Lead p={[bx - 18, by + 4]} t={[326, 290]} text="clears the case flank" a="middle" s={10.5} c={C.emerald} />
            <Lead p={[420, by - r - t + 2]} t={[420, 176]} text="flat, no twist" a="middle" s={10.5} />
          </g>
        )
      })()}
    </Fig>
  )
}

/* 3 · Skive the fold ends (optional), lightly */
function NsSkive() {
  const y = 160
  const t = 9.8
  return (
    <Fig h={322} view="Plan + section · light skive" scale="plan ×1.6 · section ×7">
      <StrapPlan
        T={{ x: 60, y: 62, s: 1.6 }}
        o={{ x0: 0, x1: 110, w0: 20, w1: 20, tip: 'square' }}
        face="flesh"
        zones={[
          { from: 0, to: 14, k: 'skiveL' },
          { from: 86, to: 110, k: 'skiveR' },
        ]}
      />
      <Lead p={[68, 62]} t={[40, 104]} text="bar end" a="start" s={10.5} />
      <Lead p={[60 + 104 * 1.6, 62]} t={[250, 104]} text="buckle end" a="end" s={10.5} />
      <T x={260} y={58} s={10.5} c={C.text}>short piece, flesh up:</T>
      <T x={260} y={72} s={10.5}>skive each fold end lightly</T>
      <T x={260} y={86} s={10} c={C.faint}>(and the long piece’s bar end)</T>

      <Sep x1={14} y1={118} x2={466} y2={118} />
      <Tag x={20} y={136}>Section</Tag>
      <T x={360} y={196} s={10} c={C.faint}>grain down, on glass</T>
      <Slab x={30} y={y + t} w={330} h={10} kind="glass" />
      <Ply x1={50} x2={340} y={y} t={t} cut="top" skR={[76, t * 0.5]} open="l" />
      <Knife kind="skive" x={302} y={y + 2.6} ang={-76} k={0.6} />
      <path d={`M262 ${y + 2.6} A40 40 0 0 1 ${302 - 40 * Math.cos(0.244)} ${y + 2.6 - 40 * Math.sin(0.244)}`} fill="none" stroke={C.brass} strokeWidth="1.1" />
      <line x1={262} y1={y + 2.6} x2={302} y2={y + 2.6} stroke={C.brass} strokeWidth="0.7" strokeDasharray="2 2" />
      <line x1={258} y1={155} x2={226} y2={138} stroke={C.struct} strokeWidth="0.8" />
      <T x={222} y={136} a="end" s={10.5} c={C.brass}>blade 10–15°</T>
      <T x={222} y={149} a="end" s={10} c={C.faint}>to the leather</T>
      <VDim x={352} y1={y + t * 0.5} y2={y + t} text="≈ ½" tx={358} />
      <HDim x1={264} x2={340} y={y + t + 22} f1={y + t + 12} f2={y + t + 12} text="a gentle ramp" ty={y + t + 36} />
      <Lead p={[150, y + 3]} t={[150, 150]} text="" />
      <T x={52} y={154} s={10} c={C.faint}>flesh side up</T>

      <Sep x1={14} y1={218} x2={466} y2={218} />
      {[
        ['too hard', 'cuts through the strap', false, 'hard'],
        ['too light', 'slow — many passes', null, 'light'],
        ['light, even passes', 'feathers to about half', true, 'good'],
      ].map(([h, sub, ok, kind], i) => {
        const x0 = 22 + i * 152
        const yy = 254
        const tt = 8
        return (
          <g key={kind}>
            {ok == null ? <circle cx={x0 + 7} cy={236} r={7} fill="none" stroke={C.brass} strokeWidth="1.5" /> : <Verdict x={x0 + 7} y={236} ok={ok} r={7} />}
            {ok == null && <T x={x0 + 7} y={240} a="middle" s={10} c={C.brass} w="700">~</T>}
            <T x={x0 + 20} y={240} s={11} c={ok == null ? C.brass : ok ? C.emerald : C.ruby} w="600">
              {h}
            </T>
            {kind === 'hard' && (
              <g>
                <Ply x1={x0} x2={x0 + 130} y={yy} t={tt} cut="top" skR={[30, tt * 0.25]} />
                <path d={`M${x0 + 96} ${yy - 1} L${x0 + 112} ${yy + tt + 1} L${x0 + 118} ${yy + tt + 1} L${x0 + 104} ${yy - 1} Z`} fill={C.ground} />
                <path d={`M${x0 + 100} ${yy - 4} l12 ${tt + 8}`} stroke={C.ruby} strokeWidth="1.2" />
              </g>
            )}
            {kind === 'light' && <Ply x1={x0} x2={x0 + 130} y={yy} t={tt} cut="top" skR={[50, tt * 0.85]} />}
            {kind === 'good' && <Ply x1={x0} x2={x0 + 130} y={yy} t={tt} cut="top" skR={[60, tt * 0.5]} />}
            <T x={x0} y={286} s={10.5}>
              {sub}
            </T>
          </g>
        )
      })}
      <T x={22} y={310} s={10} c={C.faint}>Optional on 2–4 oz: it lets the fold lie closer to one layer.</T>
    </Fig>
  )
}

/* 4 · Glue only the tab tip and its landing zone; channel bare */
function NsGlue() {
  const y = 96
  const t = 8.4
  const fx = 330
  const yc = 238
  const r = 0.9 * 7
  const cv = r * 2.4
  const flap = 100
  const y1 = yc - r
  // flipped section (tab on top): y' = 2·yc − y
  const F = (v) => 2 * yc - v
  return (
    <Fig h={330} view="Section · glue the tab only" scale="section ×7 (schematic length)">
      <Tag x={20} y={40}>1 · Flat, flesh up</Tag>
      <Ply x1={40} x2={440} y={y} t={t} open="l" />
      <path d={`M40 ${y - 4} l-4 6 l8 6 l-4 6`} fill="none" stroke={C.dim} />
      <GlueLine x1={222} x2={262} y={y - 1} />
      <NoGlue x1={290} x2={372} y={y - 2} h={7} />
      <GlueLine x1={402} x2={438} y={y - 1} />
      <circle cx={fx} cy={y - 16} r={r} fill="none" stroke={C.steel} strokeWidth="1" strokeDasharray="3 2" />
      <T x={fx} y={y - 26} a="middle" s={10} c={C.steel}>bar goes here</T>
      <Brush x={424} y={y - 2} ang={28} k={0.62} />
      <Arrow d={`M406 ${y - 10} C392 ${y - 64} 262 ${y - 64} 246 ${y - 12}`} w={1.6} />
      <T x={300} y={42} a="middle" s={10.5} c={C.brass}>fold over once tacky</T>
      {[
        [222, 262, 'landing zone', C.emerald],
        [290, 372, 'channel — bare', C.ruby],
        [402, 438, 'tab tip', C.emerald],
      ].map(([a, b, l, c]) => (
        <g key={l}>
          <path d={`M${a} ${y + t + 6} v4 H${b} v-4`} fill="none" stroke={c} strokeWidth="1" />
          <T x={(a + b) / 2} y={y + t + 24} a="middle" s={10.5} c={c}>
            {l}
          </T>
        </g>
      ))}
      <T x={44} y={y + t + 24} s={10.5}>contact cement on</T>
      <T x={44} y={y + t + 38} s={10.5}>both glued faces</T>

      <Sep x1={14} y1={156} x2={466} y2={156} />
      <Tag x={20} y={174}>2 · Folded over the bar, pressed</Tag>
      <g transform={`translate(0 ${2 * yc}) scale(1 -1)`}>
        <FoldEnd cx={fx} cy={yc} r={r} t={t} dir={-1} flap={flap} body={40} />
        <GlueLine x1={fx - cv - flap + 2} x2={fx - cv - flap + 38} y={y1} />
        <NoGlue x1={fx - cv - 34} x2={fx - 2} y={y1} h={6} />
      </g>
      <path d={`M40 ${F(y1) - 2} l-4 6 l8 6 l-4 6`} fill="none" stroke={C.dim} />
      <Lead p={[fx - cv - flap + 20, F(y1) - 1]} t={[200, 204]} text="tab tip glued to its landing zone" a="middle" s={10.5} c={C.emerald} />
      <Lead p={[fx - 20, F(y1) - 1]} t={[300, 292]} text="channel left bare" a="end" s={10.5} c={C.ruby} sub="the bar sits free" />
      <Lead p={[fx + r + t - 1, yc]} t={[456, 210]} text="spring bar" a="end" s={10.5} />
      <Lead p={[120, F(y1 - t) - 2]} t={[100, 292]} text="body" a="middle" s={10.5} />
      <Note x={330} y={276} s={10} lh={13} c={C.faint} lines={['Glue in the channel', 'stiffens the fold and', 'traps the bar.']} />
    </Fig>
  )
}

/* 5 · Mark the rivets with an awl, ½ in apart, in line; punch */
function NsMark() {
  const s = 5
  const Tr = { x: 70, y: 150, s }
  const X = (mm) => 70 + mm * s
  const r1 = X(NS.rivA)
  const r2 = X(NS.rivA + NS.pitch)
  return (
    <Fig h={300} view="Plan · rivet marks" scale="true scale ×5">
      <StrapPlan T={Tr} o={{ x0: -2, x1: 80, w0: 20, w1: 20, tip: 'square' }} centre zones={[{ from: -2, to: 4.5, k: 'steel' }]} />
      <Break x={440} y1={100} y2={200} />
      <SpringBar x={70} y1={150 - 63} y2={150 + 63} r={3.4} />
      <line x1={X(30)} y1={100} x2={X(30)} y2={200} stroke={C.dim} strokeWidth="0.9" strokeDasharray="4 3" />
      <circle cx={r1} cy={150} r={5} fill={C.hole} stroke="#e7c48f" strokeWidth="0.8" />
      <path d={`M${r2 - 5} 150 h10 M${r2} 145 v10`} stroke="#2a1d10" strokeWidth="1.4" />
      <Awl kind="round" x={r2} y={150} ang={14} k={0.74} />
      <HDim x1={r1} x2={r2} y={222} f1={156} f2={156} text="12.7  (½ in)" ty={236} />
      <Lead p={[r1, 156]} t={[110, 268]} text="1st: marked, punched" a="middle" s={10.5} />
      <Lead p={[X(30), 196]} t={[X(30) + 20, 268]} text="flap end (underneath)" a="start" s={10.5} />
      <Lead p={[74, 106]} t={[40, 62]} text="channel: bar inside" a="start" s={10.5} />
      <Lead p={[r2 + 3, 147]} t={[260, 82]} text="2nd: awl mark, in line" a="start" s={10.5} />
      <T x={300} y={148} s={10} c={C.steel}>centreline</T>

      <Inset x={300} y={176} w={166} h={74} at={[(r1 + r2) / 2, 150]} r={38} title="through both layers">
        {(() => {
          const k = 3
          const tt = NS.t * k * 2.2
          const rr = NS.bar * k * 2.2
          const cx = 320
          const cy = 214
          const xa = cx + NS.rivA * k
          const xb = cx + (NS.rivA + NS.pitch) * k
          return (
            <g>
              <FoldEnd cx={cx} cy={cy} r={rr} t={tt} dir={1} flap={30 * k - rr * 2.4} body={470} />
              {[xa, xb].map((x) => (
                <line key={x} x1={x} y1={cy - rr - tt - 6} x2={x} y2={cy - rr + tt + 6} stroke={C.ruby} strokeWidth="1.2" strokeDasharray="3 2" />
              ))}
            </g>
          )
        })()}
      </Inset>
    </Fig>
  )
}

// Rivet setter: concave tip at (0,0), rod up.
function Setter({ x, y, h = 56 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M-6 ${-h} L6 ${-h} L6 -3 Q0 -7 -6 -3 Z`} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.8" />
      <rect x="-7" y={-h - 4} width="14" height="6" rx="1.5" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.7" />
    </g>
  )
}

/* 6 · Set the rivets: cap and post through both layers, mallet */
function NsSet() {
  const s = 7
  const t = NS.t * s
  const r = NS.bar * s
  const cx = 70
  const cy = 176
  const y1 = cy - r
  const top = y1 - t
  const fb = y1 + t
  const cv = r * 2.4
  const flap = 30 * s - cv
  const xa = cx + NS.rivA * s
  const xb = cx + (NS.rivA + NS.pitch) * s
  const capY = top - 9
  return (
    <Fig h={316} view="Section · setting a rivet" scale="true scale ×7">
      <Slab x={108} y={fb + 3} w={350} h={16} kind="granite" />
      <FoldEnd cx={cx} cy={cy} r={r} t={t} dir={1} flap={flap} body={450} />
      <path d={`M450 ${top - 4} l-4 7 l8 7 l-4 7`} fill="none" stroke={C.dim} />
      <GlueLine x1={cx + cv + flap - 40} x2={cx + cv + flap - 4} y={y1} />
      <NoGlue x1={cx + 3} x2={cx + cv + 14} y={y1} h={6} />
      {/* rivet 1: set */}
      <Rivet x={xa} y={top} h={2 * t} />
      {/* rivet 2: post up through both layers, cap waiting, setter on it */}
      <rect x={xb - 2} y={top - 4} width={4} height={2 * t + 4} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" />
      <ellipse cx={xb} cy={fb} rx={5} ry={3} fill="url(#sk-brassG)" stroke="#5c461a" strokeWidth="0.6" />
      <ellipse cx={xb} cy={capY} rx={7} ry={3.2} fill="url(#sk-brassG)" stroke="#5c461a" strokeWidth="0.6" />
      <Setter x={xb} y={capY - 3} h={50} />
      <Mallet x={xb} y={capY - 57} k={0.7} />
      <Arrow a={[xb - 30, 70]} b={[xb - 30, 98]} w={1.8} />
      <HDim x1={xa} x2={xb} y={fb + 34} f1={fb + 6} f2={fb + 6} text="12.7" ty={fb + 48} />

      <Lead p={[xa, top - 3]} t={[150, 92]} text="1st rivet, set" a="end" s={10.5} sub="cap flat, no wobble" />
      <Lead p={[xb + 7, capY]} t={[300, 132]} text="cap, waiting" s={10.5} />
      <Lead p={[xb + 2, fb - 3]} t={[250, 234]} text="post, up through both layers" s={10.5} />
      <Lead p={[xb + 7, capY - 30]} t={[300, 98]} text="setter" s={10.5} sub="concave tip" />
      <Lead p={[xb + 30, capY - 70]} t={[330, 52]} text="mallet: firm, square taps" s={10.5} />
      <Lead p={[400, fb + 12]} t={[456, 212]} text="hard, flat block" a="end" s={10.5} />
      <Lead p={[cx - r - t + 2, cy]} t={[30, 246]} text="bar fold" a="start" s={10.5} sub="hangs off the block" />
      <Note x={30} y={290} s={10} lh={13} c={C.faint} lines={['Extra-tiny mini rivets: cap and post through both layers,', 'set square so the cap seats evenly.']} />
    </Fig>
  )
}

/* 7 · Cut the tip ≈140 mm (5.5 in) out */
function NsTip() {
  const s = 1.6
  const Tr = { x: 40, y: 88, s }
  const X = (mm) => 40 + mm * s
  const tips = [
    ['pointed', { tip: 'point', tipLen: 12 }],
    ['round', { tip: 'round', tipLen: 10 }],
    ['square', { tip: 'square' }],
    ['angled', null],
  ]
  return (
    <Fig h={300} view="Plan · marking and cutting the tip" scale="plan ×1.6 · tips ×2">
      <rect x={X(126)} y={72} width={X(178) - X(126)} height={32} fill="rgba(178,128,74,0.16)" stroke="#e0b277" strokeWidth="0.8" strokeDasharray="4 3" />
      <T x={X(166)} y={92} a="middle" s={10} c={C.faint}>waste</T>
      <StrapPlan T={Tr} o={{ x0: 0, x1: 140, w0: 20, w1: 20, tip: 'point', tipLen: 12 }} centre />
      <SpringBar x={40} y1={66} y2={110} r={3} />
      <RivetCap x={X(NS.rivA)} y={88} r={4} />
      <RivetCap x={X(NS.rivA + NS.pitch)} y={88} r={4} />
      <circle cx={X(140)} cy={88} r={2.6} fill={C.ruby} />
      <Knife kind="utility" x={X(134)} y={80} ang={-28} k={0.55} />
      <HDim x1={40} x2={X(140)} y={128} f1={112} f2={96} text="≈140  (5.5 in)" ty={142} />
      <Lead p={[X(140), 88]} t={[X(140) + 46, 60]} text="tip mark" s={10.5} />
      <Lead p={[X(15), 100]} t={[60, 166]} text="bar end, already riveted" a="start" s={10.5} />
      <Lead p={[X(70), 72]} t={[150, 46]} text="long piece" a="start" s={10.5} />

      <Sep x1={14} y1={182} x2={466} y2={182} />
      <Tag x={20} y={200}>Tip shapes</Tag>
      {tips.map(([name, o], i) => {
        const x0 = 30 + i * 112
        const Tt = { x: x0 - 20 * 2, y: 240, s: 2 }
        return (
          <g key={name}>
            {o ? (
              <StrapPlan T={Tt} o={{ x0: 20, x1: 52, w0: 20, w1: 20, ...o }} />
            ) : (
              <path d={`M${x0} 220 L${x0 + 66} 220 L${x0 + 48} 260 L${x0} 260 Z`} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="1" />
            )}
            <T x={x0} y={282} s={10.5} c={C.text}>
              {name}
            </T>
          </g>
        )
      })}
    </Fig>
  )
}

/* 8 · Punch the holes, ½ in apart */
function NsHoles() {
  const s = 3
  const Tr = { x: 0, y: 100, s }
  const xs = [0, 1, 2, 3, 4].map((i) => 112 - i * NS.pitch)
  const X = (mm) => mm * s
  return (
    <Fig h={300} view="Plan · holes" scale="true scale ×3">
      <StrapPlan T={Tr} o={{ x0: 40, x1: 140, w0: 20, w1: 20, tip: 'point', tipLen: 12 }} holes={{ xs, d: 2 }} centre />
      <path d="M120 66 l-4 12 l8 12 l-4 12 l4 12 l-4 12" fill="none" stroke={C.dim} />
      <HDim x1={X(xs[1])} x2={X(xs[0])} y={54} f1={94} f2={94} text="12.7 (½ in)" />
      <T x={X(xs[2])} y={124} a="middle" s={10} c={C.dim}>all at 12.7, in line</T>
      <Punch d={6} x={X(xs[3])} y={100} k={0.8} />
      <Mallet x={X(xs[3])} y={100 - 51} k={0.5} />
      <Lead p={[X(xs[3]) + 5, 72]} t={[140, 40]} text="round cutting punch" a="end" s={10.5} />
      <Lead p={[X(xs[4]), 103]} t={[150, 150]} text="5 holes cover ≈50 mm" a="end" s={10.5} sub="of adjustment" />
      <T x={430} y={104} s={10} c={C.faint}>tip</T>

      <Sep x1={14} y1={170} x2={466} y2={170} />
      <Tag x={20} y={188}>For comparison: a sewn dress strap</Tag>
      <StrapPlan T={{ x: 0, y: 228, s }} o={{ x0: 40, x1: 140, w0: 20, w1: 20, tip: 'ogive', tipLen: 14 }} holes={{ n: 7, pitch: 7, fromTip: 25 }} op={0.7} />
      <path d="M120 194 l-4 12 l8 12 l-4 12 l4 12 l-4 12" fill="none" stroke={C.dim} />
      <HDim x1={X(108)} x2={X(115)} y={274} f1={232} f2={232} text="6–7" tx={X(111.5)} ty={288} />
      <T x={20} y={288} s={10} c={C.faint}>No-sew: ½ in pitch — coarser</T>
    </Fig>
  )
}

/* 9 · Cut the slot: two holes either side of the crease, cut between */
function NsSlot() {
  const s = 3.4
  const panels = [0, 1, 2]
  return (
    <Fig h={290} view="Plan · the slot in three moves" scale="true scale ×3.4">
      {panels.map((i) => {
        const cx = 84 + i * 156
        const y = 110
        const h = 10 * s
        const hx = 4 * s
        return (
          <g key={i}>
            {i < 2 ? (
              <g>
                <rect x={cx - 66} y={y - h} width={132} height={h * 2} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="1" />
                <line x1={cx} y1={y - h - 8} x2={cx} y2={y + h + 8} stroke={C.text} strokeWidth="1" strokeDasharray="4 3" />
                <circle cx={cx - hx} cy={y} r={3.4} fill={C.hole} stroke="#e7c48f" strokeWidth="0.7" />
                <circle cx={cx + hx} cy={y} r={3.4} fill={C.hole} stroke="#e7c48f" strokeWidth="0.7" />
                {i === 1 && <rect x={cx - hx} y={y - 3.4} width={hx * 2} height={6.8} fill={C.hole} />}
                {i === 0 && <Punch d={6.8} x={cx + hx} y={y - 12} k={0.6} />}
                {i === 0 && <Arrow a={[cx + hx + 20, y - 50]} b={[cx + hx + 20, y - 26]} w={1.5} />}
                {i === 1 && <Knife kind="utility" x={cx + 2} y={y} ang={20} k={0.5} />}
                {i === 1 && <HDim x1={cx - hx - 3.4} x2={cx + hx + 3.4} y={y + h + 18} f1={y + 6} f2={y + 6} text="≈10" ty={y + h + 32} />}
                {i === 0 && <T x={cx} y={y + h + 22} a="middle" s={10} c={C.text}>crease</T>}
              </g>
            ) : (
              <g>
                <rect x={cx - 66} y={y - h} width={66} height={h * 2} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="1" />
                <path d={`M${cx - hx} ${y - 3.4} L${cx} ${y - 3.4} L${cx} ${y + 3.4} L${cx - hx} ${y + 3.4} A3.4 3.4 0 0 1 ${cx - hx} ${y - 3.4} Z`} fill={C.hole} />
                <path d={`M${cx - hx - 3} ${y - 3.4} L${cx - hx - 16} ${y - 3.4} A3.4 3.4 0 0 0 ${cx - hx - 16} ${y + 3.4} L${cx - hx - 3} ${y + 3.4}`} fill="none" stroke={C.ruby} strokeWidth="1.1" strokeDasharray="3 2" />
                <Buckle x={cx} y={y} w={h * 2} L={44} />
                <Arrow a={[cx - hx - 2, y + 18]} b={[cx - hx - 22, y + 18]} c="ruby" w={1.4} />
                <T x={cx - 66} y={y + h + 22} s={10} c={C.ruby}>lengthen if stiff</T>
              </g>
            )}
            <Num x={cx - 60} y={192} n={i + 1} r={7} />
            <T x={cx - 48} y={196} s={11} c={C.text}>
              {['Two holes', 'Cut between', 'Try the tongue'][i]}
            </T>
            <Note x={cx - 60} y={214} s={10} lh={13} lines={[['round punch, one', 'each side of the crease'], ['knife, two straight', 'cuts joining the holes'], ['fold round the buckle;', 'it must lie flat']][i]} />
          </g>
        )
      })}
      <Sep x1={162} y1={40} x2={162} y2={250} />
      <Sep x1={318} y1={40} x2={318} y2={250} />
      <T x={20} y={276} s={10} c={C.faint}>Slot ≈10 mm × tongue width, centred on the crease.</T>
    </Fig>
  )
}

/* 10 · Close the ends: the buckle end first, then the bar end */
function NsEnds() {
  const s = 4
  const k = 8
  const t = NS.t * k
  const r = NS.bar * k
  const rb = 1.1 * k
  const xl = 75
  const xr = 395
  const yTop = 130
  const y1 = yTop + t
  const cyl = y1 + r
  const cyr = y1 + rb
  const ral = [xl + NS.rivA * s, xl + (NS.rivA + NS.pitch) * s]
  const rar = [xr - NS.rivA * s, xr - (NS.rivA + NS.pitch) * s]
  const flL = 25 * s
  const flR = 30 * s
  return (
    <Fig h={316} view="Section · short piece, ends closed" scale="length ×4 · thickness ×8">
      <Ply x1={xl} x2={xr} y={yTop} t={t} open="lr" />
      <FoldEnd cx={xl} cy={cyl} r={r} t={t} dir={1} flap={flL} />
      <FoldEnd cx={xr} cy={cyr} r={rb} t={t} dir={-1} flap={flR} bar={false} />
      <BuckleSide cx={xr} cy={cyr} r={rb} s={s} T={t} />
      <GlueLine x1={xl + r * 2.4 + flL - 30} x2={xl + r * 2.4 + flL - 4} y={y1} />
      <GlueLine x1={xr - rb * 2.4 - flR + 4} x2={xr - rb * 2.4 - flR + 30} y={y1} />
      <NoGlue x1={xl + 2} x2={xl + r * 2.4 + 6} y={y1} h={6} />
      <NoGlue x1={xr - rb * 2.4 - 6} x2={xr - 2} y={y1} h={6} />
      {[...ral, ...rar].map((x) => (
        <Rivet key={x} x={x} y={yTop} h={2 * t} k={0.9} />
      ))}
      <HDim x1={ral[0]} x2={ral[1]} y={204} f1={160} f2={160} text="12.7" />
      <HDim x1={rar[1]} x2={rar[0]} y={204} f1={160} f2={160} text="12.7" />

      <NLead n={1} p={[rar[0], yTop - 3]} t={[350, 52]} a="end" text="buckle end first" sub="glue, mark, punch, rivet" />
      <NLead n={2} p={[ral[0], yTop - 3]} t={[156, 52]} a="end" text="then the bar end" sub="same sequence" />
      <Lead p={[xr + 30, cyr - rb - t - 2]} t={[456, 96]} text="tongue" a="end" s={10.5} />
      <Lead p={[xl, cyl]} t={[36, 236]} text="spring bar" a="start" s={10.5} />
      <Lead p={[xl + r * 2.4 + flL - 16, y1 + 1]} t={[170, 236]} text="tab tip glued" a="start" s={10.5} c={C.emerald} />
      <Lead p={[xr - rb * 2.4 - 2, y1 + 2]} t={[330, 236]} text="channel bare" a="start" s={10.5} c={C.ruby} />
      <Lead p={[xr, cyr]} t={[456, 186]} text="buckle bar" a="end" s={10.5} />
      <Note x={36} y={268} s={10} lh={13} c={C.faint} lines={['Close the buckle end first so the slot and tongue line up;', 'the bar end last, with the bar (or a former) in the fold.']} />
    </Fig>
  )
}

/* 11 · Edges: optional bevel; water, Tokonole or gum; slicker */
function NsEdges() {
  return (
    <Fig h={310} view="Detail · a slicked edge" scale="end section ×10">
      <Tag x={20} y={40}>End-on, in the slicker’s groove</Tag>
      <clipPath id="nse-clip">
        <rect x={20} y={60} width={226} height={130} />
      </clipPath>
      <g clipPath="url(#nse-clip)">
        <XSec cx={110} y={118} w={200} layers={[{ k: 'top', t: 12 }]} edge="round" />
        <path d="M196 98 L246 98 L246 150 L196 150 L196 132 L204 132 Q214 132 214 124 Q214 116 204 116 L196 116 Z" fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.9" />
      </g>
      <path d="M206 119 Q211 124 206 129" fill="none" stroke="#fff3d6" strokeWidth="1.6" />
      <circle cx={230} cy={84} r={7} fill="none" stroke={C.brass} strokeWidth="1.4" />
      <circle cx={230} cy={84} r={1.8} fill={C.brass} />
      <T x={242} y={80} s={10.5} c={C.brass}>stroke along</T>
      <T x={242} y={93} s={10.5} c={C.brass}>the edge</T>
      <Lead p={[120, 124]} t={[80, 176]} text="2–4 oz strip, end-on" a="middle" s={10.5} />
      <Lead p={[230, 140]} t={[196, 190]} text="wood slicker, grooved" a="middle" s={10.5} />
      <Lead p={[207, 124]} t={[150, 92]} text="edge glazes" a="end" s={10.5} />

      <Sep x1={256} y1={110} x2={256} y2={196} />
      {[
        ['Bevel (optional)', 'takes the sharp corners off', 'bevel'],
        ['Wet it', 'water, Tokonole or gum', 'square'],
        ['Slick', 'brisk strokes till it glazes', 'round'],
      ].map(([h, sub, e], i) => {
        const y = 128 + i * 26
        return (
          <g key={h}>
            <Num x={276} y={y - 4} n={i + 1} r={7} />
            <T x={288} y={y} s={11} c={C.text}>
              {h}
            </T>
            <T x={288} y={y + 12} s={9.8}>
              {sub}
            </T>
          </g>
        )
      })}

      <Sep x1={14} y1={200} x2={466} y2={200} />
      <Tag x={20} y={222}>In plan</Tag>
      <StrapPlan T={{ x: 30, y: 252, s: 2 }} o={{ x0: 0, x1: 150, w0: 20, w1: 20, tip: 'square' }} />
      <Break x={330} y1={232} y2={272} />
      <Slicker x={200} y={290} len={90} />
      <Arrow a={[160, 296]} b={[240, 296]} both w={1.6} />
      <Dauber x={90} y={232} k={0.4} c="#8fb2c9" />
      <Lead p={[90, 229]} t={[124, 222]} text="wet a short run" s={10.5} />
      <Note x={344} y={240} s={10} lh={13} c={C.faint} lines={['Work a short run', 'at a time; rewet,', 'slick again for gloss.']} />
    </Fig>
  )
}

/* 12 · Keeper: a ½ in strip round both straps, glued and riveted */
function NsKeeper() {
  const s = 2.4
  const X = (mm) => 36 + mm * s
  const w = 12.7
  return (
    <Fig h={316} view="Plan + section · riveted keeper" scale="plan ×2.4 · section ×5">
      <Tag x={20} y={40}>The strip, flesh up</Tag>
      <StrapPlan
        T={{ x: 36, y: 76, s }}
        o={{ x0: 0, x1: 60, w0: w, w1: w, tip: 'square' }}
        face="flesh"
        zones={[
          { from: 0, to: 10, k: 'skiveL' },
          { from: 50, to: 60, k: 'glue' },
        ]}
      />
      <circle cx={X(55)} cy={76} r={3} fill={C.hole} stroke="#e7c48f" strokeWidth="0.7" />
      <line x1={X(50)} y1={56} x2={X(50)} y2={96} stroke={C.ruby} strokeWidth="1" strokeDasharray="3 2" />
      <VDim x={X(60) + 12} y1={76 - (w / 2) * s} y2={76 + (w / 2) * s} f1={X(60) + 2} f2={X(60) + 2} text="12.7" sub="½ in" />
      <Lead p={[X(5), 76]} t={[X(5), 120]} text="skived end" a="middle" s={10.5} />
      <Lead p={[X(55), 82]} t={[X(46), 120]} text="overlap: glue + rivet" a="middle" s={10.5} c={C.emerald} />
      <Lead p={[X(50), 58]} t={[X(42), 48]} text="trim mark" a="end" s={10.5} c={C.ruby} />

      <Step x={30} y={160} n={1} text="Wrap round both straps; mark the overlap" />
      <Step x={30} y={184} n={2} text="Trim at the mark" />
      <Step x={30} y={208} n={3} text="Skive one end" />
      <Step x={30} y={232} n={4} text="Glue the overlap and rivet it" />
      <T x={30} y={262} s={10} c={C.faint}>Finish the keeper edges before</T>
      <T x={30} y={276} s={10} c={C.faint}>closing it.</T>

      <Sep x1={268} y1={34} x2={268} y2={306} />
      <Tag x={280} y={52}>Section across the straps</Tag>
      {(() => {
        const cx = 368
        const yA = 140
        const tw = 100
        const p = `M340 165.5 L415.5 165.5 Q421.5 165.5 421.5 159.5 L421.5 145.5 Q421.5 139.5 415.5 139.5 L320.5 139.5 Q314.5 139.5 314.5 145.5 L314.5 165.5 Q314.5 171.5 320.5 171.5 L395 171.5`
        return (
          <g>
            <XSec cx={cx} y={yA + 3} w={tw} layers={[{ k: 'top', t: 6 }]} edge="round" />
            <XSec cx={cx} y={yA + 10} w={tw} layers={[{ k: 'top', t: 6 }, { k: 'top', t: 6 }]} edge="round" />
            <path d={p} fill="none" stroke="#4a3018" strokeWidth="7.6" strokeLinejoin="round" />
            <path d={p} fill="none" stroke="#b2804a" strokeWidth="6" strokeLinejoin="round" />
            <GlueLine x1={346} x2={392} y={168.5} />
            <Rivet x={370} y={177} ang={180} h={11} k={0.75} />
            <Lead p={[400, yA + 6]} t={[452, 96]} text="long piece" a="end" s={10.5} />
            <Lead p={[330, yA + 16]} t={[290, 96]} text="short piece" a="start" s={10.5} sub="doubled at the buckle" />
            <Lead p={[421.5, 152]} t={[452, 220]} text="keeper, ½ in" a="end" s={10.5} />
            <Lead p={[342, 166]} t={[300, 220]} text="skived end" a="start" s={10.5} />
            <Lead p={[370, 180]} t={[370, 252]} text="rivet through the overlap" a="middle" s={10.5} />
            <T x={280} y={290} s={10} c={C.faint}>Snug round both straps, so it</T>
            <T x={280} y={303} s={10} c={C.faint}>holds the tail but still slides.</T>
          </g>
        )
      })()}
    </Fig>
  )
}

/* 13 · Finished riveted strap */
function NsFinish() {
  const s = 1.6
  const TL = { x: 56, y: 82, s }
  const TS = { x: 56, y: 196, s }
  const XL = (mm) => 56 + mm * s
  const holes = [0, 1, 2, 3, 4].map((i) => 112 - i * NS.pitch)
  return (
    <Fig h={300} view="Plan · finished riveted strap" scale="plan ×1.6">
      <StrapPlan T={TL} o={{ x0: 0, x1: 140, w0: 20, w1: 20, tip: 'point', tipLen: 12 }} holes={{ xs: holes, d: 2 }} />
      <SpringBar x={56} y1={60} y2={104} r={3} />
      <RivetCap x={XL(NS.rivA)} y={82} r={4} />
      <RivetCap x={XL(NS.rivA + NS.pitch)} y={82} r={4} />
      <StrapPlan T={TS} o={{ x0: 0, x1: 80, w0: 20, w1: 20, tip: 'square' }} keepers={[{ x: 40, w: 12.7 }]} />
      <SpringBar x={56} y1={174} y2={218} r={3} />
      {[NS.rivA, NS.rivA + NS.pitch, 80 - NS.rivA, 80 - NS.rivA - NS.pitch].map((m) => (
        <RivetCap key={m} x={XL(m)} y={196} r={4} />
      ))}
      <Buckle x={XL(80)} y={196} w={32} L={26} />

      <Lead p={[56, 104]} t={[30, 140]} text="spring bars (or adapters)" a="start" s={10.5} />
      <Lead p={[XL(NS.rivA + NS.pitch), 76]} t={[XL(12), 44]} text="two rivets, no stitching" a="start" s={10.5} />
      <Lead p={[XL(99.3), 80]} t={[XL(110), 44]} text="holes ½ in apart" a="start" s={10.5} />
      <Lead p={[XL(40), 176]} t={[XL(40), 156]} text="riveted keeper" a="middle" s={10.5} sub="" />
      <Lead p={[XL(80) + 26, 196]} t={[XL(80) + 50, 230]} text="buckle" a="start" s={10.5} />
      <Lead p={[XL(71), 210]} t={[XL(60), 250]} text="buckle end riveted" a="middle" s={10.5} />

      <Inset x={300} y={116} w={166} h={86} at={[XL(16), 82]} r={14} title="the fold, in section">
        {(() => {
          const k = 5
          const tt = NS.t * k
          const rr = NS.bar * k
          const cx = 322
          const cy = 172
          return (
            <g>
              <FoldEnd cx={cx} cy={cy} r={rr} t={tt} dir={1} flap={28 * k - rr * 2.4} body={470} />
              <Rivet x={cx + NS.rivA * k} y={cy - rr - tt} h={2 * tt} k={0.7} />
              <Rivet x={cx + (NS.rivA + NS.pitch) * k} y={cy - rr - tt} h={2 * tt} k={0.7} />
            </g>
          )
        })()}
      </Inset>
      <T x={30} y={274} s={10.5} c={C.text}>Last: fit the bars or adapters, condition, then oil.</T>
      <T x={30} y={290} s={10} c={C.faint}>Glue at the tab tips, rivets behind the channels, nothing in the folds.</T>
    </Fig>
  )
}

/* The glued-and-folded strap: 25 cm and 16 cm blanks, 24 h under weight */
function NsGlued() {
  const s = 1.4
  const X = (mm) => 40 + mm * s
  const k = 5
  const t = NS.t * k
  const r = NS.bar * k
  return (
    <Fig h={336} view="Plan + side · glued-and-folded" scale="×1.4 · for a 20 cm wrist">
      <StrapPlan
        T={{ x: 40, y: 62, s }}
        o={{ x0: 0, x1: 250, w0: 20, w1: 20, tip: 'square' }}
        face="flesh"
        zones={[
          { from: 0, to: 122, k: 'glue' },
          { from: 122, to: 128, k: 'noglue' },
          { from: 128, to: 250, k: 'glue' },
        ]}
        folds={[{ x: 125 }]}
      />
      <HDim x1={X(0)} x2={X(250)} y={38} f1={46} f2={46} text="250 → folds to ≈125" ty={34} />
      <StrapPlan
        T={{ x: 40, y: 112, s }}
        o={{ x0: 0, x1: 160, w0: 20, w1: 20, tip: 'square' }}
        face="flesh"
        zones={[
          { from: 0, to: 77, k: 'glue' },
          { from: 77, to: 83, k: 'noglue' },
          { from: 83, to: 160, k: 'glue' },
        ]}
        folds={[{ x: 80 }]}
      />
      <T x={X(160) + 10} y={108} s={10.5} c={C.text} mono>160 → ≈80</T>
      <T x={X(160) + 10} y={122} s={10}>short piece</T>
      <rect x={X(0)} y={146} width={90 * s} height={8} rx="1" fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="0.8" />
      <T x={X(90) + 10} y={154} s={10.5} c={C.text}>keeper: 4 × width + 1 cm = 90 mm</T>
      <Lead p={[X(125), 62]} t={[X(125) + 30, 92]} text="bar channel left bare" s={10} c={C.ruby} />
      <T x={X(250) + 8} y={66} s={10} c={C.faint}>long</T>

      <Sep x1={14} y1={170} x2={466} y2={170} />
      <Tag x={20} y={188}>Glued, folded, pressed: cure 24 h</Tag>
      {(() => {
        const slabY = 292
        const y1 = slabY - t
        const cy = y1 + r
        const cvv = r * 2.4
        const longL = 125 * s
        const shortL = 80 * s
        const lx = 56
        const sx = 430
        return (
          <g>
            <Slab x={70} y={slabY} w={348} h={14} kind="board" />
            <FoldEnd cx={lx} cy={cy} r={r} t={t} dir={1} flap={longL - cvv} body={lx + longL} skive={1} />
            <FoldEnd cx={sx} cy={cy} r={r} t={t} dir={-1} flap={shortL - cvv} body={sx - shortL} skive={1} />
            <Weight x={lx + longL * 0.55} y={y1 - t} w={120} />
            <Weight x={sx - shortL * 0.5} y={y1 - t} w={86} />
            <circle cx={252} cy={226} r={14} fill="none" stroke={C.brass} strokeWidth="1.5" />
            <path d="M252 216 V226 L259 230" fill="none" stroke={C.brass} strokeWidth="1.6" strokeLinecap="round" />
            <T x={252} y={258} a="middle" s={14} c={C.brass} w="700">24 h</T>
            <Lead p={[lx, cy]} t={[30, 320]} text="rod in each fold keeps the channel" a="start" s={10.5} />
            <Lead p={[lx + 100, y1]} t={[300, 320]} text="flesh to flesh" a="start" s={10.5} c={C.emerald} />
            <T x={lx + longL * 0.55} y={y1 - t - 40} a="middle" s={10} c={C.dim}>weight</T>
          </g>
        )
      })()}
    </Fig>
  )
}

/* Choosing the joint: glue, rivet, Chicago screw */
function NsJoints() {
  const k = 5
  const t = NS.t * k
  const r = NS.bar * k
  const cy = 104
  const y1 = cy - r
  const top = y1 - t
  const cols = [
    {
      x: 30,
      name: 'Glue-and-fold',
      lines: [
        [true, 'flattest, fastest'],
        [false, 'peels under flex'],
        [null, 'and sweat unless'],
        [null, 'backed up'],
      ],
    },
    {
      x: 186,
      name: 'Rivet',
      lines: [
        [true, 'strong in shear'],
        [false, 'permanent, rigid spots'],
        [false, 'keep off flex zones'],
        [false, 'the bar still needs'],
        [null, 'its own loop'],
      ],
    },
    {
      x: 340,
      name: 'Chicago screw',
      lines: [
        [true, 'removable'],
        [false, 'smallest ≈9 × 6 mm'],
        [false, 'loosens without'],
        [null, 'threadlocker'],
      ],
    },
  ]
  const flap = 22 * k
  return (
    <Fig h={318} view="Comparison · three no-sew joints" scale="sections true scale ×5">
      {cols.map((c, i) => (
        <g key={c.name}>
          <T x={c.x - 12} y={42} s={12} c={C.text} w="600">
            {c.name}
          </T>
          <FoldEnd cx={c.x} cy={cy} r={r} t={t} dir={1} flap={(i === 2 ? 18 * k : flap) - r * 2.4} body={c.x + (i === 2 ? 92 : 124)} />
          {i === 0 && (
            <g>
              <GlueLine x1={c.x + flap - 28} x2={c.x + flap - 3} y={y1} />
              <NoGlue x1={c.x + 2} x2={c.x + r * 2.4 + 10} y={y1} h={6} />
            </g>
          )}
          {i === 1 && (
            <g>
              <GlueLine x1={c.x + flap - 14} x2={c.x + flap - 3} y={y1} />
              <Rivet x={c.x + 9 * k} y={top} h={2 * t} k={0.8} />
              <Rivet x={c.x + 21.7 * k} y={top} h={2 * t} k={0.8} />
              <HDim x1={c.x + 9 * k} x2={c.x + 21.7 * k} y={cy + 32} f1={cy + 12} f2={cy + 12} text="12.7" ty={cy + 46} />
            </g>
          )}
          {i === 2 && (
            <g>
              {(() => {
                const sx = c.x + 13 * k
                const hd = 9 * k
                const tot = 6 * k
                const hc = (tot - 2 * t) / 2
                const yT = top - hc
                return (
                  <g>
                    <rect x={sx - 10} y={top} width={20} height={2 * t} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.7" opacity="0.9" />
                    <path d={`M${sx - hd / 2} ${top} Q${sx - hd / 2} ${yT} ${sx - hd / 2 + 6} ${yT} L${sx + hd / 2 - 6} ${yT} Q${sx + hd / 2} ${yT} ${sx + hd / 2} ${top} Z`} fill="url(#sk-brassG)" stroke="#5c461a" strokeWidth="0.7" />
                    <path d={`M${sx - hd / 2} ${top + 2 * t} Q${sx - hd / 2} ${top + 2 * t + hc} ${sx - hd / 2 + 6} ${top + 2 * t + hc} L${sx + hd / 2 - 6} ${top + 2 * t + hc} Q${sx + hd / 2} ${top + 2 * t + hc} ${sx + hd / 2} ${top + 2 * t} Z`} fill="url(#sk-brassG)" stroke="#5c461a" strokeWidth="0.7" />
                    <line x1={sx - 6} y1={top + 2 * t + hc - 2} x2={sx + 6} y2={top + 2 * t + hc - 2} stroke="#5c461a" strokeWidth="1.4" />
                    <HDim x1={sx - hd / 2} x2={sx + hd / 2} y={yT - 10} f1={yT - 2} f2={yT - 2} text="9" />
                    <VDim x={sx + hd / 2 + 12} y1={yT} y2={top + 2 * t + hc} f1={sx + hd / 2 + 2} f2={sx + hd / 2 + 2} text="6" />
                  </g>
                )
              })()}
            </g>
          )}
          {c.lines.map(([ok, text], j) => (
            <VLine key={j} x={c.x - 14} y={170 + j * 17} ok={ok} text={text} c={ok == null ? C.dim : undefined} />
          ))}
        </g>
      ))}
      <Sep x1={164} y1={30} x2={164} y2={262} />
      <Sep x1={318} y1={30} x2={318} y2={262} />
      <Lead p={[30 + 6, y1 + 1]} t={[60, 64]} text="channel bare" a="start" s={10} c={C.ruby} />
      <Sep x1={14} y1={272} x2={466} y2={272} />
      <T x={20} y={290} s={10.5}>Every joint: glue only at the tab tip, nothing rigid where the strap bends.</T>
      <T x={20} y={306} s={10} c={C.faint}>Chicago screws suit casual straps, not dress ones (house view).</T>
    </Fig>
  )
}

export const FIGS = {
  'b-measure': BMeasure,
  'b-draw': BDraw,
  'b-cut': BCut,
  'b-passages': BPassages,
  'b-close': BClose,
  'b-finish': BFinish,
  'b-strap': BStrap,
  'b-assemble': BAssemble,
  'b-check': BCheck,
  'sp-cut': SpCut,
  'sp-slot': SpSlot,
  'sp-fold': SpFold,
  'sp-close': SpClose,
  'sp-tail': SpTail,
  'sp-keepers': SpKeepers,
  'sp-finish': SpFinish,
  'sp-fit': SpFit,
  'sp-nato': SpNato,
  'ns-template': NsTemplate,
  'ns-cut': NsCut,
  'ns-skive': NsSkive,
  'ns-glue': NsGlue,
  'ns-mark': NsMark,
  'ns-set': NsSet,
  'ns-tip': NsTip,
  'ns-holes': NsHoles,
  'ns-slot': NsSlot,
  'ns-ends': NsEnds,
  'ns-edges': NsEdges,
  'ns-keeper': NsKeeper,
  'ns-finish': NsFinish,
  'ns-glued': NsGlued,
  'ns-joints': NsJoints,
}
