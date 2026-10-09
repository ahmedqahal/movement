// Strap diagrams — the classic two-piece lined cut-edge strap (tranche
// franche), the reference build. ONE strap all the way through:
//   20 → 18 mm, 120 / 80 mm, top 1.1 mm veg-tan over a 0.7 mm calf lining,
//   0.2 mm Velodon, stitch 3.0 mm pitch at a 3 mm margin, concealed lug tail.
// Blanks stay ≈10 mm oversize (5 mm a side) until the step-19 surcoupe.
// See AUTHORING.md.
import { useId } from 'react'
import { C, Fig, T, Note, Lead, Dim, Arrow, Num, Verdict, Tag, Sep, Legend } from './kit.jsx'
import { StrapPlan, StitchRun, Slot, Ply, Wrap, BarEnd, GlueLine, NoGlue, Reinf, SectionStitch, XSec, Buckle, SpringBar, CaseSide, Wrist } from './parts.jsx'
import { StrapSection, BuckleSide } from './sections.jsx'
import { LONG, SHORT, outline, offset, pathOf, px, widthAt, holeXs, runBetween, resample } from './geom.js'
import * as Tl from './tools.jsx'

/* ------------------------------------------------------------------ */
/* Local helpers                                                       */
/* ------------------------------------------------------------------ */
const OV = 5 // oversize per side, mm (≈10 mm overall)
const LF = LONG({ x0: -20 }) // long top, lug flap still open
const SF = SHORT({ x0: -20, x1: 105 }) // short top, both flaps open
const big = (o, m = OV) => ({
  ...o,
  x1: o.x1 + (o.tip && o.tip !== 'square' ? m : 0),
  w0: o.w0 + 2 * m,
  w1: o.w1 + 2 * m,
  tipLen: o.tipLen ? o.tipLen + m : o.tipLen,
})
const P = (T, x, y) => px(T, x, y)
const half = (o, x) => widthAt(x, o) / 2
const polar = (cx, cy, r, a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)]
// closed Catmull-Rom curve through points
const smooth = (pts) => {
  const n = pts.length
  let d = `M${pts[0][0]} ${pts[0][1]}`
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]
    const p1 = pts[i]
    const p2 = pts[(i + 1) % n]
    const p3 = pts[(i + 2) % n]
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`
  }
  return d + ' Z'
}

// Local defs (ids prefixed cl-): natural undyed veg-tan, Velodon fleece,
// pin fabric, oil sheen.
function ClDefs() {
  return (
    <defs>
      <linearGradient id="cl-nat" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ebd1a6" />
        <stop offset="1" stopColor="#d2ad7b" />
      </linearGradient>
      <linearGradient id="cl-natS" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c9a777" />
        <stop offset="1" stopColor="#e6cda4" />
      </linearGradient>
      <pattern id="cl-vel" width="10" height="8" patternUnits="userSpaceOnUse">
        <rect width="10" height="8" fill="rgba(143,178,201,0.5)" />
        <path d="M0 2 l4.5 1.6 M5.5 0.6 l3.8 2.2 M1 6 l3.4 -1.2 M5.5 6.8 l4.2 -1.3" stroke="#dbe9f2" strokeWidth="0.6" opacity="0.9" />
      </pattern>
      <pattern id="cl-fab" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="rgba(238,232,220,0.75)" />
        <path d="M0 2 H4 M2 0 V4" stroke="#9c927e" strokeWidth="0.7" />
      </pattern>
      <linearGradient id="cl-sheen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.28" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="cl-dyeEdge" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#a8763f" stopOpacity="1" />
        <stop offset="1" stopColor="#a8763f" stopOpacity="0" />
      </linearGradient>
    </defs>
  )
}

// A plan piece. face 'nat' = undyed veg-tan (before step 8).
function Piece({ T, o, face = 'grain', ...rest }) {
  if (face === 'nat')
    return (
      <g>
        <path d={pathOf(outline(o), T)} fill="url(#cl-nat)" />
        <StrapPlan T={T} o={o} face="none" edge="#9a7a4c" {...rest} />
      </g>
    )
  return <StrapPlan T={T} o={o} face={face} {...rest} />
}

// The true pattern outline traced on a blank.
const PatLine = ({ T, o, c = C.text, dash = '5 3', w = 1, op = 0.85 }) => (
  <path d={pathOf(outline(o), T)} fill="none" stroke={c} strokeWidth={w} strokeDasharray={dash} opacity={op} />
)

// Clip children to a piece outline.
function ClipTo({ T, o, children }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <g>
      <clipPath id={`clc${id}`}>
        <path d={pathOf(outline(o), T)} />
      </clipPath>
      <g clipPath={`url(#clc${id})`}>{children}</g>
    </g>
  )
}

// Magnified callout: a ring at `from` and a circular inset at (cx, cy).
function Zoom({ cx, cy, r, from, fr = 7, label, la = 'middle', ly, children }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  let lead = null
  if (from) {
    const dx = cx - from[0]
    const dy = cy - from[1]
    const L = Math.hypot(dx, dy) || 1
    lead = (
      <g>
        <circle cx={from[0]} cy={from[1]} r={fr} fill="none" stroke={C.brass} strokeWidth="1" strokeDasharray="2 2" />
        <line x1={from[0] + (dx / L) * fr} y1={from[1] + (dy / L) * fr} x2={cx - (dx / L) * r} y2={cy - (dy / L) * r} stroke={C.brass} strokeWidth="0.8" strokeDasharray="2 2" />
      </g>
    )
  }
  return (
    <g>
      {lead}
      <clipPath id={`clz${id}`}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <circle cx={cx} cy={cy} r={r} fill={C.ground} />
      <g clipPath={`url(#clz${id})`}>{children}</g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.brass} strokeWidth="1.2" />
      {label && (
        <Tag x={la === 'middle' ? cx : cx + r + 6} y={ly ?? cy + r + 13} a={la === 'middle' ? 'middle' : 'start'} c={C.brass}>
          {label}
        </Tag>
      )}
    </g>
  )
}

// Panel box with a mono heading.
function Box({ x, y, w, h, title, c = C.line, tc }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="7" fill="rgba(255,255,255,0.022)" stroke={c} strokeWidth="1" />
      {title && (
        <Tag x={x + 10} y={y + 16} c={tc}>
          {title}
        </Tag>
      )}
    </g>
  )
}

// Thickness profile (fraction of full) of a skived flap at distance d (mm)
// beyond its fold line: full to −2, half by +2 (the wrap), held to +7,
// then feathered to nothing at the flap end.
const skiveF = (d, flap) => {
  if (d <= -2) return 1
  if (d <= 2) return 1 - (0.5 * (d + 2)) / 4
  if (d <= 7) return 0.5
  return Math.max(0.03, 0.5 * (1 - (d - 7) / (flap - 7)))
}

// Longitudinal section of a FLAT top with skived flaps (before folding).
// x = px of the lug fold (0 mm), s px/mm along, k px/mm through.
function SkivedTop({ x, y, s, k, a = -20, b = 105, lug = 20, buckle = 25, buckleAt = 80, t = 1.1, up = false, fill = 'url(#sk-topS)' }) {
  const pts = []
  for (let m = a; m <= b + 1e-6; m += 0.5) {
    let f = 1
    if (lug) f = Math.min(f, skiveF(-m, lug))
    if (buckle) f = Math.min(f, skiveF(m - buckleAt, buckle))
    pts.push([x + m * s, up ? y + t * k * (1 - f) : y + t * k * f])
  }
  const flat = up ? y + t * k : y
  const d = `M${x + a * s} ${flat} L${x + b * s} ${flat} ` + pts.reverse().map(([px_, py]) => `L${px_.toFixed(1)} ${py.toFixed(1)}`).join(' ') + ' Z'
  return <path d={d} fill={fill} stroke="#4a3018" strokeWidth="0.8" strokeLinejoin="round" />
}

// A formed fold in section, true to the concealed-tail build. Fold at cx,
// body (thickness t) runs `bl` px away from the fold; the ply round the rod
// is skived to tl; the tail returns under the body, feathered to nothing.
// dir = 1: fold on the left; −1: fold on the right (mirrored).
function FoldEnd({ cx, y0, r, t, tl, cv, tail, a, bl, dir = 1, k = 'top', op, seam = true }) {
  const R = r + tl
  const cy = y0 + R
  const yB = y0 + t
  const fill = k === 'top' ? 'url(#sk-topS)' : 'url(#sk-linS)'
  const edge = k === 'top' ? '#4a3018' : '#8f7b5a'
  const xR = cx + bl
  const tip = cx + cv + tail
  const outer =
    `M${xR} ${y0} L${cx} ${y0} A${R} ${R} 0 0 0 ${cx} ${cy + R} ` +
    `C${cx + cv * 0.55} ${cy + R} ${cx + cv * 0.62} ${yB + tl} ${cx + cv} ${yB + tl} L${tip} ${yB} L${xR} ${yB}`
  const hole =
    `M${cx} ${y0 + tl} A${r} ${r} 0 0 0 ${cx} ${cy + r} ` +
    `C${cx + cv * 0.55} ${cy + r} ${cx + cv * 0.62} ${yB} ${cx + cv} ${yB} L${cx + a} ${yB} Z`
  return (
    <g opacity={op} transform={dir === -1 ? `translate(${2 * cx} 0) scale(-1 1)` : undefined}>
      <path d={`${outer} Z ${hole}`} fill={fill} fillRule="evenodd" />
      <path d={outer} fill="none" stroke={edge} strokeWidth="0.8" strokeLinejoin="round" />
      <path d={hole} fill="none" stroke={edge} strokeWidth="0.8" strokeLinejoin="round" />
      {seam && <line x1={cx + cv} y1={yB} x2={tip} y2={yB} stroke={edge} strokeWidth="0.8" />}
    </g>
  )
}
// geometry of a FoldEnd for annotation
const foldGeo = ({ cx, y0, r, t, tl, cv, tail, dir = 1 }) => {
  const R = r + tl
  const X = (v) => cx + (v - cx) * dir
  return { cy: y0 + R, R, yB: y0 + t, bottom: y0 + 2 * R, tip: X(cx + cv + tail), conv: X(cx + cv), X }
}

/* ================================================================== */
/* Lesson I — specify, cut & prepare (steps 1–13)                      */
/* ================================================================== */

/* 1 · Specify: the four measurements and the edge decision */
function Specify() {
  const s = 2.6
  return (
    <Fig h={304} view="Job card · measure, then decide" scale="before any cut">
      {/* 1 lug gap */}
      <Box x={14} y={28} w={138} h={130} title="1 · lug gap" />
      <path d="M20 60 L28 60 Q46 98 28 136 L20 136 Z" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
      <rect x={30} y={60} width={46} height={10} rx="4" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
      <rect x={30} y={70 + 20 * s} width={46} height={10} rx="4" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
      <SpringBar x={62} y1={70} y2={70 + 20 * s} r={2.3} />
      <Dim a={[76, 70]} b={[76, 70 + 20 * s]} off={-16} text="20.0" flip />
      <T x={83} y={148} a="middle" s={10} c={C.faint}>calipers, to 0.1 mm</T>

      {/* 2 buckle */}
      <Box x={160} y={28} w={138} h={130} title="2 · buckle" />
      <Buckle x={176} y={98} w={18 * s} L={46} />
      <Dim a={[222, 98 - 9 * s]} b={[222, 98 + 9 * s]} off={-14} text="18" flip />
      <T x={229} y={148} a="middle" s={10} c={C.faint}>inner width = lug − 2</T>

      {/* 3 tongue */}
      <Box x={14} y={166} w={138} h={130} title="3 · tongue" />
      <path d="M24 196 L104 196 Q116 196 116 203 Q116 210 104 210 L24 210 Z" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
      <Dim a={[120, 196]} b={[120, 210]} off={-10} text="w" flip />
      <circle cx={46} cy={248} r={8} fill={C.hole} stroke="#e7c48f" strokeWidth="0.8" />
      <T x={64} y={246} s={11} c={C.text}>hole Ø ≥ w</T>
      <T x={64} y={260} s={10} c={C.faint}>→ 1.5–2 mm</T>
      <T x={83} y={287} a="middle" s={10} c={C.faint}>sets the hole punch</T>

      {/* 4 wrist */}
      <Box x={160} y={166} w={138} h={130} title="4 · wrist" />
      <Wrist cx={229} cy={226} rx={38} ry={27} />
      <ellipse cx={229} cy={226} rx={43} ry={32} fill="none" stroke={C.brass} strokeWidth="1.6" strokeDasharray="4 2" />
      <rect x={266} y={216} width={18} height={8} rx="1.5" fill={C.brass} />
      <T x={229} y={274} a="middle" s={10.5} c={C.text}>wrist, or the old strap’s</T>
      <T x={229} y={287} a="middle" s={10.5} c={C.text}>used hole → 120 / 80</T>

      {/* edge route */}
      <Box x={306} y={28} w={162} h={268} title="5 · edge route, now" c={C.brass} tc={C.brass} />
      <XSec cx={332} y={54} w={34} layers={[{ k: 'top', t: 8 }, { k: 'top', t: 6 }]} edge="round" />
      <T x={358} y={60} s={12} c={C.text} w="600">Burnish</T>
      <T x={358} y={75} s={10.5}>only if top AND</T>
      <T x={358} y={88} s={10.5}>lining are firm</T>
      <T x={358} y={101} s={10.5}>veg-tan</T>

      <rect x={312} y={110} width={150} height={66} rx="6" fill="rgba(208,168,79,0.08)" stroke={C.brass} strokeWidth="0.9" strokeDasharray="3 3" />
      <XSec cx={332} y={120} w={34} layers={[{ k: 'top', t: 8 }, { k: 'lining', t: 6 }]} edge="paint" b={3} coat={2.4} />
      <T x={358} y={126} s={12} c={C.text} w="600">Paint</T>
      <T x={358} y={141} s={10.5}>chrome calf lining,</T>
      <T x={358} y={154} s={10.5}>exotic, padded</T>
      <T x={358} y={168} s={10} c={C.brass}>← this strap</T>

      <Sep x1={314} y1={186} x2={460} y2={186} />
      <T x={316} y={203} s={11} c={C.text} w="600">This strap</T>
      <T x={316} y={218} s={10.5}>veg-tan top 1.1 mm</T>
      <T x={316} y={231} s={10.5}>+ calf lining 0.7 mm</T>
      <T x={316} y={244} s={10.5} c={C.brass}>→ painted edge (26b)</T>
      <T x={316} y={263} s={10} c={C.faint}>Paint adds width: cut a hair</T>
      <T x={316} y={276} s={10} c={C.faint}>under; burnish compresses:</T>
      <T x={316} y={289} s={10} c={C.faint}>cut a hair over.</T>
    </Fig>
  )
}

/* 2 · Draft: both patterns unfolded, every mark */
function Draft() {
  const s = 2.8
  const TL = { x: 86, y: 84, s }
  const TS = { x: 86, y: 218, s }
  const hx = holeXs(120)
  return (
    <Fig h={300} view="Plan · both patterns, unfolded" scale="20 → 18 · 120 / 80">
      {/* long */}
      <StrapPlan T={TL} o={LF} face="card" centre folds={[{ x: 0, label: 'lug fold', below: true }]} stitch={{ mode: 'line', from: 4, m: 3 }} holes={{}} />
      <Dim a={P(TL, -20, -10)} b={P(TL, 0, -10)} off={-12} text="20" flip />
      <Dim a={P(TL, 0, -10)} b={P(TL, 120, -10)} off={-12} text="120" flip />
      <Dim a={P(TL, -20, -10)} b={P(TL, -20, 10)} off={10} text="20" />
      <Dim a={P(TL, hx[0], 10)} b={P(TL, 120, 10)} off={10} text="25" flip />
      <Lead p={P(TL, 30, half(LF, 30) - 3)} t={[110, 146]} text="stitch line, 3 mm in" sub="stops 4 mm behind the fold" a="start" />
      <Lead p={P(TL, hx[3], 0)} t={[270, 146]} text="7 holes · 7 mm pitch" sub="last hole 25 mm from the tip" a="start" />

      {/* short */}
      <StrapPlan
        T={TS}
        o={SF}
        face="card"
        centre
        folds={[{ x: 0, label: 'lug fold' }, { x: 80, label: 'buckle fold' }, { x: 70, c: C.brass }]}
        stitch={{ mode: 'line', from: 4, to: 76, m: 3 }}
        slot={{ x: 80, len: 10 }}
      />
      <Dim a={P(TS, 70, -3)} b={P(TS, 80, -3)} text="10" />
      <Lead p={P(TS, 70, -11.5)} t={[250, 178]} text="keeper line, 10 mm in" a="end" c={C.brass} />
      <Lead p={P(TS, 84, 0)} t={[400, 172]} text="slot 10 mm" sub="on the fold" a="start" />
      <Dim a={P(TS, -20, 10)} b={P(TS, 0, 10)} off={12} text="20" flip />
      <Dim a={P(TS, 0, 10)} b={P(TS, 80, 9)} off={12} text="80" flip />
      <Dim a={P(TS, 80, 9)} b={P(TS, 105, 9)} off={12} text="≥ 25" flip />
      <Dim a={P(TS, 105, -9)} b={P(TS, 105, 9)} off={-12} text="18" flip />
      <T x={30} y={293} s={10} c={C.faint}>flap lengths are measured from the fold line</T>
    </Fig>
  )
}

/* 3 · Sharpen and strop */
function Sharpen() {
  return (
    <Fig h={300} view="Side view · hone, strop, test" scale="schematic">
      <Box x={14} y={28} w={222} h={160} title="1 · hone" />
      <T x={24} y={64} s={11} c={C.text}>~1000 grit, the whole edge,</T>
      <T x={24} y={78} s={11} c={C.text}>until a burr forms; then ~5000</T>
      <Tl.Stone x={26} y={150} w={98} h={22} grit="1000" />
      <Tl.Stone x={130} y={150} w={98} h={22} grit="5000" tone="#7d8a7f" />
      <Tl.Knife kind="skive" x={100} y={150} ang={-68} k={0.66} />
      <Arrow a={[44, 102]} b={[120, 102]} both w={1.6} />
      <T x={82} y={96} a="middle" s={10} c={C.faint}>whole edge, both ways</T>
      <T x={180} y={140} a="middle" s={10} c={C.faint}>then refine</T>

      <Box x={244} y={28} w={224} h={160} title="2 · strop" />
      <T x={254} y={64} s={11} c={C.text}>~20 passes, edge trailing</T>
      <T x={254} y={78} s={11} c={C.text}>again every 5–10 skiving cuts</T>
      <Tl.Strop x={256} y={150} w={150} h={22} />
      <Tl.Knife kind="skive" x={300} y={150} ang={70} k={0.72} />
      <Arrow a={[318, 182]} b={[420, 182]} w={1.6} />
      <T x={262} y={186} s={10} c={C.faint}>pull</T>
      <Lead p={[300, 150]} t={[268, 112]} text="edge" a="end" s={10.5} />

      {/* burr zoom */}
      <Zoom cx={72} cy={246} r={42} from={[100, 149]} fr={6} label="">
        <path d="M32 222 L104 241 L104 251 L32 270 Z" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.9" />
        <path d="M104 241 L108 241 Q113 242 111 248" fill="none" stroke="#d9e3e9" strokeWidth="1.6" strokeLinecap="round" />
      </Zoom>
      <T x={122} y={228} s={11} c={C.text}>burr: the edge is</T>
      <T x={122} y={242} s={11} c={C.text}>reached — feel for it</T>
      <T x={122} y={256} s={10} c={C.faint}>on the back of the blade</T>

      {/* test cut */}
      <Box x={262} y={204} w={206} h={92} title="3 · test" />
      <ClDefs />
      <rect x={274} y={230} width={84} height={36} rx="3" fill="url(#cl-nat)" stroke="#9a7a4c" />
      <line x1={316} y1={230} x2={316} y2={266} stroke={C.hole} strokeWidth="1.6" />
      <Verdict x={346} y={222} ok r={7} />
      <rect x={372} y={230} width={84} height={36} rx="3" fill="url(#cl-nat)" stroke="#9a7a4c" />
      <path d="M414 230 l2 5 l-3 4 l3 5 l-2 5 l3 4 l-2 5 l2 4 l-1 4" fill="none" stroke={C.hole} strokeWidth="1.6" />
      <path d="M411 236 l-4 2 M418 246 l4 1 M412 256 l-4 2" stroke="#8a6a3e" strokeWidth="0.8" />
      <Verdict x={444} y={222} r={7} />
      <T x={316} y={282} a="middle" s={10} c={C.dim}>sharp: clean</T>
      <T x={414} y={282} a="middle" s={10} c={C.dim}>dull: torn, dragged</T>
    </Fig>
  )
}

/* 4 · Select and test the leather */
function Select() {
  const hide = smooth([
    [34, 150], [42, 132], [58, 118], [44, 86], [56, 76], [78, 92], [120, 84], [170, 84], [204, 92], [226, 62], [240, 70],
    [234, 106], [242, 130], [246, 150], [242, 170], [234, 194], [240, 230], [226, 238], [204, 208], [170, 216], [120, 216],
    [78, 208], [56, 224], [44, 214], [58, 182], [42, 168],
  ])
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const r = 0.9 * 6
  const t = 1.1 * 6
  const tl = 0.7 * 6
  const bx = 336
  const by = 266
  return (
    <Fig h={316} view="Plan · the hide  ·  section · the sample" scale="hide not to scale">
      <ClDefs />
      <clipPath id={`hd${id}`}>
        <path d={hide} />
      </clipPath>
      <path d={hide} fill="url(#cl-nat)" stroke="#9a7a4c" strokeWidth="1.2" />
      <g clipPath={`url(#hd${id})`}>
        <rect x={20} y={56} width={240} height={40} fill="url(#sk-noglue)" />
        <rect x={20} y={204} width={240} height={40} fill="url(#sk-noglue)" />
      </g>
      <rect x={58} y={104} width={60} height={92} rx="14" fill="rgba(123,165,131,0.16)" stroke={C.emerald} strokeDasharray="4 3" />
      <rect x={140} y={100} width={88} height={100} rx="14" fill="rgba(123,165,131,0.16)" stroke={C.emerald} strokeDasharray="4 3" />
      <line x1={40} y1={150} x2={240} y2={150} stroke={C.steel} strokeWidth="1" strokeDasharray="10 3 2 3" />
      {[118, 130, 166, 178].map((y) => (
        <rect key={y} x={150} y={y} width={68} height={7} rx="1" fill="#c89f6a" stroke="#6f4b27" strokeWidth="0.7" />
      ))}
      {[124, 168].map((y) => (
        <rect key={y} x={66} y={y} width={44} height={7} rx="1" fill="#c89f6a" stroke="#6f4b27" strokeWidth="0.7" />
      ))}
      <Arrow a={[150, 142]} b={[218, 142]} c="steel" w={1.3} />
      <T x={34} y={154} s={10} c={C.dim} a="end">head</T>
      <Lead p={[88, 104]} t={[66, 42]} text="shoulder" a="end" c={C.emerald} />
      <Lead p={[196, 100]} t={[226, 42]} text="butt / bend" a="end" c={C.emerald} />
      <Lead p={[130, 222]} t={[130, 262]} text="belly — stretches, avoid" a="middle" c={C.ruby} />
      <T x={140} y={286} a="middle" s={10.5}>strap blanks laid along the backbone:</T>
      <T x={140} y={300} a="middle" s={10.5} c={C.text}>grain lengthwise</T>

      {/* gauge */}
      <Box x={258} y={28} w={210} h={152} title="gauge" />
      <Ply x1={272} x2={350} y={58} t={1.1 * 12} k="top" />
      <Dim a={[350, 58]} b={[350, 58 + 13.2]} off={-10} text="" />
      <T x={368} y={64} s={11.5} c={C.text}>top 1.1</T>
      <T x={368} y={78} s={10}>range 1.0–1.2 mm</T>
      <T x={272} y={92} s={10} c={C.faint}>≤ 1.6 mm over a 0.5 mm lining</T>
      <Ply x1={272} x2={350} y={110} t={0.7 * 12} k="lining" />
      <Dim a={[350, 110]} b={[350, 110 + 8.4]} off={-10} text="" />
      <T x={368} y={116} s={11.5} c={C.text}>lining 0.7</T>
      <T x={368} y={130} s={10}>range 0.5–1.0 mm</T>
      <T x={272} y={154} s={10} c={C.faint}>shoulder or butt · full grain</T>
      <T x={272} y={168} s={10} c={C.faint}>thickness ×12</T>

      {/* test sample */}
      <Box x={258} y={188} w={210} h={120} title="glued test sample" />
      <CaseSide x={bx} y={by} s={6} gap={3.0} len={6} />
      <Wrap cx={bx} cy={by} r={r} t={t} xR={bx} conv={r * 2.6} tail={r * 3.2} ts={t * 0.45} />
      <Ply x1={bx} x2={460} y={by - r - t} t={t} open="l" />
      <Ply x1={bx + r * 2.6 + 2} x2={460} y={by - r + 2} t={tl} k="lining" skL={[24, tl * 0.25]} cut="top" />
      <BarEnd cx={bx} cy={by} r={r} />
      <Lead p={[bx - 1.9 * 6, by - 2]} t={[272, 300]} text="passes bar–case?" a="start" c={C.ruby} />
      <Dim a={[452, by - r - t]} b={[452, by - r + 2 + tl]} off={-8} text="" />
      <T x={456} y={by + 22} a="end" s={10.5} mono>1.1 + 0.7 + reinf.</T>
    </Fig>
  )
}

/* 5 · Rough-cut the top */
function Rough() {
  const s = 2.7
  const TL = { x: 90, y: 112, s }
  const TS = { x: 90, y: 252, s }
  const bl = big(LF)
  const bs = big(SF)
  const marks = [
    [-20, -10], [-20, 10], [0, -10], [0, 10], [80, -9], [80, 9], [105, -9], [105, 9], [75, 0], [85, 0],
  ]
  return (
    <Fig h={322} view="Plan · top blanks, rough-cut" scale="≈ 10 mm oversize">
      <ClDefs />
      {/* long blank, grain up, template on */}
      <Piece T={TL} o={bl} face="nat" />
      <StrapPlan T={TL} o={LF} face="card" dash="5 3" />
      <Tl.Rule x={P(TL, 18, 0)[0]} y={P(TL, 0, 15)[1]} len={250} side="below" w={11} />
      <Tl.Knife kind="utility" x={P(TL, 112, 15)[0]} y={P(TL, 112, 15)[1]} ang={28} k={0.5} />
      <Tl.Awl kind="round" x={P(TL, 0, -10)[0]} y={P(TL, 0, -10)[1]} ang={-10} k={0.48} />
      <Lead p={P(TL, 0, -10)} t={[110, 40]} text="awl: fold, trim & buckle marks" a="start" />
      <Lead p={P(TL, 70, -6)} t={[318, 40]} text="card template, grain side" a="start" />
      <T x={240} y={182} a="middle" s={10.5}>straights against the rule first, then curves · blade vertical, light passes</T>
      <Dim a={P(TL, -20, -15)} b={P(TL, -20, 15)} off={10} text="30" />
      <Dim a={P(TL, -13, -10)} b={P(TL, -13, 10)} off={0} text="20" />

      {/* short blank, flesh up, marks through */}
      <Piece T={TS} o={bs} face="flesh" />
      <PatLine T={TS} o={SF} c={C.dim} dash="2 4" op={0.55} />
      {marks.map(([x, y], i) => {
        const [cx, cy] = P(TS, x, y)
        return <circle key={i} cx={cx} cy={cy} r="2.4" fill={C.hole} stroke="#f2dcb3" strokeWidth="0.7" />
      })}
      <T x={P(TS, 0, 0)[0]} y={P(TS, 0, -15)[1] - 8} a="middle" s={10} c={C.dim}>fold</T>
      <T x={P(TS, 80, 0)[0]} y={P(TS, 0, -15)[1] - 8} a="middle" s={10} c={C.dim}>buckle fold · slot ends</T>
      <T x={P(TS, 40, 0)[0]} y={P(TS, 0, 15)[1] + 16} a="middle" s={10.5} c={C.text}>turned over: the flesh side carries every mark</T>

      <Zoom cx={430} cy={248} r={34} from={P(TS, 105, 9)} fr={6} label="awl through" ly={298}>
        <rect x={392} y={246} width={76} height={10} fill="url(#cl-natS)" stroke="#6f4b27" strokeWidth="0.6" />
        <rect x={392} y={256} width={76} height={30} fill="#4b4a49" />
        <path d="M430 259 L427 210 L433 210 Z" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" />
      </Zoom>
    </Fig>
  )
}

/* 6 · Cut the linings and keeper strips */
function Linings() {
  const s = 2.3
  const TL = { x: 52, y: 100, s }
  const TS = { x: 52, y: 246, s }
  const linL = { x0: -2, x1: 126, w0: 40, w1: 40, taper: [0, 126], tip: 'square' }
  const linS = { x0: -2, x1: 82, w0: 40, w1: 40, taper: [0, 82], tip: 'square' }
  return (
    <Fig h={330} view="Plan · lining blanks & keeper strips" scale="lining undyed">
      <ClDefs />
      <StrapPlan T={TL} o={linL} face="lining" />
      <PatLine T={TL} o={LONG()} c="#8f7b5a" dash="4 3" />
      <Dim a={P(TL, 126, -20)} b={P(TL, 126, 20)} off={-12} text="40" flip />
      <Dim a={P(TL, 100, -9)} b={P(TL, 100, 9)} off={0} text="18" />
      <Dim a={P(TL, 8, -10)} b={P(TL, 8, 10)} off={0} text="20" />
      <T x={52} y={40} s={11.5} c={C.text}>long lining blank</T>
      <T x={152} y={40} s={10} c={C.faint}>calf 0.7 mm · undyed</T>
      <Lead p={P(TL, 70, 7)} t={[300, 40]} text="pattern traced inside" a="start" />

      <StrapPlan T={TS} o={linS} face="lining" />
      <PatLine T={TS} o={SHORT()} c="#8f7b5a" dash="4 3" />
      <Dim a={P(TS, -2, -20)} b={P(TS, -2, 20)} off={10} text="40" />
      <T x={52} y={312} s={11.5} c={C.text}>short lining blank</T>
      <T x={52 + 60 * s} y={166} a="middle" s={10.5} c={C.text}>≥ 20 mm wider than the pattern (40 vs 20)</T>
      <T x={52 + 60 * s} y={180} a="middle" s={10} c={C.faint}>room to shift while gluing — the surcoupe trims it</T>

      {/* keeper strips */}
      <Box x={262} y={196} w={206} h={126} title="2 keeper strips" />
      {[224, 246].map((y) => (
        <rect key={y} x={278} y={y} width={152} height={5 * s} rx="1" fill="url(#cl-nat)" stroke="#9a7a4c" strokeWidth="0.8" />
      ))}
      <Dim a={[430, 246]} b={[430, 246 + 5 * s]} off={-10} text="5" flip />
      <Tl.Rule x={278} y={258} len={150} side="below" w={9} />
      <Tl.Knife kind="utility" x={294} y={258} ang={34} k={0.42} />
      <T x={276} y={296} s={10.5} c={C.text}>5 mm wide, top leather</T>
      <T x={276} y={310} s={10} c={C.faint}>length ≈ 4t + 2w, cut long</T>
    </Fig>
  )
}

/* 7 · Split or level */
function Split() {
  const bx = 250 // blade edge
  const by = 136 // blade top = underside of the kept piece
  const g = 1.1 * 12 // gauge, px
  const R = 24
  const inPts = []
  for (let x = 40; x <= bx; x += 6) inPts.push([x, by + 3 + Math.sin(x * 0.09) * 3 + (x < 140 ? 4 : 1)])
  return (
    <Fig h={304} view="Side view · pull-through splitter" scale="thickness ×12">
      <rect x={176} y={by + 24} width={150} height={20} rx="3" fill="#3a332c" stroke="#1b1612" />
      <path d={`M${bx} ${by} L${bx + 70} ${by - 2} L${bx + 70} ${by + 24} L${bx + 30} ${by + 24} Z`} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.9" />
      <circle cx={bx + 4} cy={by - g - R} r={R} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.9" />
      <circle cx={bx + 4} cy={by - g - R} r={5} fill="#5f717d" />
      <Arrow a={[bx + 4, by - g - R * 2 - 26]} b={[bx + 4, by - g - R * 2 - 6]} c="brass" w={1.4} />
      <T x={bx + 12} y={by - g - R * 2 - 16} s={10.5} c={C.brass}>roller: set the gap = gauge</T>
      <path
        d={`M40 ${by - g} L${bx} ${by - g} L${bx} ${by} ` + inPts.slice().reverse().map(([x, y]) => `L${x} ${y}`).join(' ') + ' Z'}
        fill="url(#sk-topS)"
        stroke="#4a3018"
        strokeWidth="0.8"
      />
      <Ply x1={bx} x2={462} y={by - g} t={g} />
      <path d={`M${bx} ${by} Q${bx + 26} ${by + 2} ${bx + 18} ${by + 58} L${bx + 12} ${by + 58} Q${bx + 18} ${by + 8} ${bx - 4} ${by + 6} Z`} fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="0.7" />
      <Arrow a={[360, by - g - 14]} b={[452, by - g - 14]} w={2} />
      <T x={406} y={by - g - 22} a="middle" s={11} c={C.brass}>pull through</T>
      <T x={60} y={by - g - 8} s={10} c={C.faint}>grain up</T>
      <Lead p={[96, by + 6]} t={[70, 196]} text="uneven gauge in" a="middle" />
      <Lead p={[bx + 16, by + 40]} t={[222, 196]} text="flesh offcut" a="end" />
      <Lead p={[bx + 50, by + 10]} t={[300, 196]} text="fixed blade" a="start" />
      <Lead p={[420, by - 6]} t={[466, 196]} text="uniform out" a="end" />

      <Sep x1={14} y1={216} x2={466} y2={216} />
      <Tag x={14} y={234}>Targets · thickness ×12</Tag>
      {[
        ['top', 1.1, 'top', '1.1 mm, whole piece'],
        ['lining', 0.7, 'lining', '0.7 mm'],
        ['keepers', 1.2, 'top', '≈ 1.2 mm'],
      ].map(([n, t, k, lab], i) => {
        const x = 20 + i * 152
        return (
          <g key={n}>
            <Ply x1={x} x2={x + 56} y={256} t={t * 12} k={k} />
            <T x={x + 64} y={262} s={11.5} c={C.text}>{n}</T>
            <T x={x + 64} y={276} s={10} mono>{lab}</T>
          </g>
        )
      })}
      <T x={14} y={298} s={10} c={C.faint}>check both ends and the middle: a thick spot shows as a bulge after gluing</T>
    </Fig>
  )
}

/* 8 · Dye and seal the top */
function Dye() {
  const s = 2.7
  const TL = { x: 88, y: 100, s }
  const bl = big(LF)
  const dx = 64
  const [ex] = P(TL, dx, 0)
  return (
    <Fig h={322} view="Plan · dye flat, buff, seal" scale="hand-dyed veg-tan only">
      <ClDefs />
      <Piece T={TL} o={bl} face="nat" />
      <ClipTo T={TL} o={bl}>
        <rect x={P(TL, -26, 0)[0]} y={P(TL, 0, -16)[1]} width={ex - P(TL, -26, 0)[0] - 12} height={32 * s} fill="url(#sk-top)" />
        <rect x={ex - 12} y={P(TL, 0, -16)[1]} width={24} height={32 * s} fill="url(#cl-dyeEdge)" />
      </ClipTo>
      <PatLine T={TL} o={LF} c="#f0d9b0" dash="2 4" op={0.6} />
      <Tl.Dauber x={ex + 2} y={104} ang={18} k={0.9} />
      <path d={`M${ex - 26} ${138} a26 12 0 1 0 52 0`} fill="none" stroke={C.brass} strokeWidth="1.6" markerEnd="url(#sk-a-brass)" />
      <Lead p={P(TL, 20, -8)} t={[150, 32]} text="dyed" sub="thinned 1:1, even strokes" a="start" />
      <Lead p={P(TL, 95, -8)} t={[330, 32]} text="natural veg-tan" sub="still undyed" a="start" />
      <T x={250} y={166} a="middle" s={10.5} c={C.text}>flat, before any fold or glue · flaps and keeper strips too</T>

      {[
        ['1 · dye', 'dauber, light even coats', 'let it dry fully'],
        ['2 · buff', 'until a white cloth', 'comes away clean'],
        ['3 · seal', 'Resolene 1:1, 2–3 light', 'coats, damp sponge'],
      ].map(([h, a, b], i) => {
        const x = 14 + i * 152
        return (
          <g key={h}>
            <Box x={x} y={182} w={144} h={106} title={h} c={i === 2 ? C.emerald : C.line} />
            <T x={x + 10} y={264} s={10.5} c={C.text}>{a}</T>
            <T x={x + 10} y={278} s={10.5}>{b}</T>
          </g>
        )
      })}
      <Tl.Dauber x={56} y={246} ang={0} k={0.7} />
      <rect x={80} y={218} width={56} height={28} rx="3" fill="url(#sk-top)" stroke="#5c3c1d" />
      <rect x={168} y={218} width={60} height={28} rx="3" fill="url(#sk-top)" stroke="#5c3c1d" />
      <path d="M200 210 q18 -4 26 6 q6 10 -6 18 q-14 6 -24 -4 q-6 -12 4 -20 Z" fill="#f4efe5" stroke="#b8ad98" />
      <Arrow d="M236 228 q10 6 2 14" c="brass" w={1.3} />
      <rect x={320} y={218} width={60} height={28} rx="3" fill="url(#sk-top)" stroke="#5c3c1d" />
      <rect x={320} y={218} width={60} height={28} rx="3" fill="url(#cl-sheen)" />
      <rect x={392} y={212} width={30} height={20} rx="6" fill="#d8c27a" stroke="#8a7a3a" />
      <Arrow a={[384, 224]} b={[386, 234]} c="brass" w={1.2} />
      <T x={14} y={306} s={10} c={C.faint}>The lining stays undyed. Conditioners are not sealers: unsealed dye bleeds with sweat.</T>
      <T x={14} y={319} s={10} c={C.faint}>Chrome or pre-finished tops skip this step.</T>
    </Fig>
  )
}

/* 9 · Skive the flaps */
function SkiveFlaps() {
  const s = 2.2
  const TP = { x: 74, y: 76, s }
  const bs = big(SF)
  const sx = 66 // section: px of lug fold
  const sy = 196 // top of the body (flesh up)
  const ss = 2.6
  const kk = 14
  const top = (m) => {
    const f = Math.min(skiveF(-m, 20), skiveF(m - 80, 25))
    return sy + 1.1 * kk * (1 - f)
  }
  const X = (m) => sx + m * ss
  return (
    <Fig h={340} view="Plan · flesh side  ·  section" scale="section: thickness ×5">
      <StrapPlan
        T={TP}
        o={bs}
        face="flesh"
        zones={[
          { from: -20, to: 2, k: 'skiveL' },
          { from: 78, to: 105, k: 'skiveR' },
        ]}
        folds={[{ x: 0 }, { x: 80 }]}
      />
      <Dim a={P(TP, -20, -15)} b={P(TP, 0, -15)} off={-8} text="20" flip />
      <Dim a={P(TP, 80, -15)} b={P(TP, 105, -15)} off={-8} text="25" flip />
      <T x={P(TP, -10, 0)[0]} y={P(TP, 0, 15)[1] + 14} a="middle" s={10.5} c={C.text}>lug flap</T>
      <T x={P(TP, 92, 0)[0]} y={P(TP, 0, 15)[1] + 14} a="middle" s={10.5} c={C.text}>buckle flap</T>
      <T x={P(TP, 40, 0)[0]} y={P(TP, 0, 15)[1] + 14} a="middle" s={10} c={C.faint}>short top · flesh up · dyed</T>

      <Box x={334} y={28} w={134} h={112} title="test-fold" c={C.emerald} tc={C.emerald} />
      <FoldEnd cx={364} y0={70} r={8} t={11} tl={5.5} cv={20} tail={50} a={10} bl={96} />
      <BarEnd cx={364} cy={70 + 13.5} r={7.4} />
      <line x1={420} y1={60} x2={420} y2={104} stroke={C.emerald} strokeWidth="0.9" strokeDasharray="2 2" />
      <T x={424} y={58} s={10.5} c={C.emerald}>≈ 1</T>
      <T x={344} y={120} s={10.5} c={C.text}>doubled ≈ one layer</T>
      <T x={344} y={133} s={10} c={C.faint}>not a step, not a bulge</T>

      <Tag x={14} y={160}>Section · short top on glass, flesh up</Tag>
      <Tl.Slab x={X(-23)} y={sy + 1.1 * kk} w={(131) * ss} h={8} kind="glass" />
      <SkivedTop x={sx} y={sy} s={ss} k={kk} up />
      {[0, 80].map((m) => (
        <line key={m} x1={X(m)} y1={sy - 18} x2={X(m)} y2={sy + 26} stroke={C.text} strokeWidth="0.9" strokeDasharray="4 3" />
      ))}
      <T x={X(0)} y={sy - 22} a="middle" s={10}>fold</T>
      <T x={X(80)} y={sy - 22} a="middle" s={10}>fold</T>
      <Dim a={[X(40), sy]} b={[X(40), sy + 1.1 * kk]} off={-10} text="" />
      <T x={X(40) + 16} y={sy - 4} s={10.5} mono>1.1</T>
      <Lead p={[X(-4), top(-4)]} t={[X(-4), 250]} text="≈ ½ at the fold" a="middle" />
      <Lead p={[X(-18), top(-18)]} t={[22, 276]} text="tail → 0" a="start" />
      <Lead p={[X(85), top(85)]} t={[X(85), 250]} text="≈ ½ round the buckle bar" a="middle" />
      <Lead p={[X(104), top(104)]} t={[408, 276]} text="feathered to nothing" a="end" />
      <Tl.Knife kind="skive" x={X(95)} y={top(95)} ang={-79} k={0.62} />
      <Arrow a={[X(97), sy - 8]} b={[X(106), sy - 8]} w={1.6} />
      <T x={14} y={306} s={10.5} c={C.text}>Blade 10–15° to the work · several light pull-slicing passes, never one heavy push.</T>
      <T x={14} y={321} s={10} c={C.faint}>Above ~20° it cuts through; below ~5° it skates. Short overlapping fan cuts on curves.</T>
    </Fig>
  )
}

/* 10 · Skive the lining ends */
function SkiveLinings() {
  const s = 2.9
  const k = 14
  const t = 0.7 * k
  const xL = 64
  const yL = 86
  const yS = 206
  const hl = (x) => <rect x={x} y={-14} width={12 * s} height={t + 22} rx="4" fill="rgba(208,168,79,0.14)" stroke={C.brass} strokeDasharray="3 3" />
  return (
    <Fig h={300} view="Section · the two linings, flesh up" scale="thickness ×5">
      <Tag x={14} y={46}>Long lining</Tag>
      <g transform={`translate(0 ${yL})`}>{hl(xL - 4)}</g>
      <Ply x1={xL} x2={xL + 126 * s} y={yL} t={t} k="lining" cut="top" skL={[10 * s, t * 0.35]} />
      <Lead p={[xL + 4 * s, yL + 4]} t={[xL + 4 * s, 128]} text="lug end: light skive" sub="meets the lug-fold tail" a="middle" c={C.text} />
      <Lead p={[xL + 125 * s, yL + 5]} t={[xL + 120 * s, 128]} text="tip end: leave full" sub="cut through at the surcoupe" a="end" />
      <Dim a={[xL + 60 * s, yL]} b={[xL + 60 * s, yL + t]} off={-8} text="" />
      <T x={xL + 60 * s + 14} y={yL - 6} s={10.5} mono>0.7</T>

      <Tag x={14} y={170}>Short lining</Tag>
      <g transform={`translate(0 ${yS})`}>
        {hl(xL - 4)}
        {hl(xL + 82 * s - 12 * s + 4)}
      </g>
      <Ply x1={xL} x2={xL + 82 * s} y={yS} t={t} k="lining" cut="top" skL={[10 * s, t * 0.35]} skR={[10 * s, t * 0.35]} />
      <Tl.Knife kind="skive" x={xL + 77 * s} y={yS + 1} ang={-80} k={0.6} />
      <Arrow a={[xL + 74 * s, yS + 30]} b={[xL + 83 * s, yS + 30]} w={1.5} />
      <Lead p={[xL + 4 * s, yS + 4]} t={[xL + 4 * s, 252]} text="lug end" sub="meets the lug tail" a="middle" c={C.text} />
      <Lead p={[xL + 70 * s, yS + 9]} t={[xL + 66 * s, 252]} text="buckle end" sub="meets the buckle tail" a="middle" c={C.text} />

      <Zoom cx={410} cy={212} r={44} from={[xL + 80 * s, yS + 4]} fr={9} label="light, not feathered" ly={270}>
        <Ply x1={350} x2={460} y={204} t={20} k="lining" cut="top" skR={[52, 8]} />
        <line x1={454} y1={200} x2={454} y2={232} stroke={C.dim} strokeWidth="0.6" />
      </Zoom>
      <T x={14} y={292} s={10} c={C.faint}>Skive on the flesh, the face that will meet the top. The tip end is never skived: the surcoupe cuts it.</T>
    </Fig>
  )
}

/* 11 · Reinforce */
function Reinforce() {
  const s = 2.7
  const TL = { x: 88, y: 90, s }
  const TS = { x: 88, y: 236, s }
  const bl = big(LF)
  const bs = big(SF)
  const r = (T, x1, x2, y1, y2, fill, stroke) => {
    const [a, b] = P(T, x1, y1)
    const [c, d] = P(T, x2, y2)
    return <rect x={a} y={b} width={c - a} height={d - b} fill={fill} stroke={stroke} strokeWidth="0.8" />
  }
  return (
    <Fig h={340} view="Plan · flesh side · reinforcement" scale="Velodon 0.2 mm">
      <ClDefs />
      <Tag x={14} y={36}>A · Velodon, full length</Tag>
      <StrapPlan T={TL} o={bl} face="flesh" zones={[{ from: -20, to: 2, k: 'skiveL' }]} folds={[{ x: 0 }]} />
      <ClipTo T={TL} o={bl}>
        {r(TL, 6, 124, -13, 13, 'url(#cl-vel)', C.steel)}
        {r(TL, -8, 5, -14, 14, 'url(#cl-fab)', '#9c927e')}
      </ClipTo>
      <Lead p={P(TL, 6, -13)} t={[214, 36]} text="stops short of the lug fold" a="start" />
      <Lead p={P(TL, -3, 10)} t={[24, 152]} text="fabric where the pin goes" sub="rolled over a stick ≥ the pin" a="start" />
      <Lead p={P(TL, 60, 10)} t={[236, 152]} text="0.2 mm non-woven polyester" sub="glued on the flesh, to the tip" a="start" />

      <Tag x={14} y={188}>B · or a 6–8 mm centre tape</Tag>
      <StrapPlan T={TS} o={bs} face="flesh" zones={[{ from: -20, to: 2, k: 'skiveL' }, { from: 78, to: 105, k: 'skiveR' }]} folds={[{ x: 0 }, { x: 80 }]} />
      <ClipTo T={TS} o={bs}>
        {r(TS, 10, 66, -3.5, 3.5, 'url(#cl-vel)', C.steel)}
        {r(TS, -8, 5, -14, 14, 'url(#cl-fab)', '#9c927e')}
      </ClipTo>
      <Dim a={P(TS, 66, -3.5)} b={P(TS, 66, 3.5)} off={-12} text="" />
      <T x={P(TS, 66, 0)[0] + 18} y={P(TS, 0, 0)[1] + 4} s={10.5} mono>6–8</T>
      <Lead p={P(TS, 40, 3.5)} t={[200, 291]} text="centre tape: never into a fold" a="middle" />
      <Lead p={P(TS, 92, 10)} t={[400, 291]} text="buckle fold kept free" a="middle" />

      <Box x={14} y={304} w={454} h={34} />
      <Tl.Slicker x={58} y={327} len={60} k={0.8} />
      <T x={104} y={318} s={10.5} c={C.text}>Press with a wood block over paper so the leather can’t distort —</T>
      <T x={104} y={332} s={10} c={C.faint}>no roller over the reinforcement. Solvent cement for synthetic sheets.</T>
    </Fig>
  )
}

/* 12 · Emboss (optional) */
function Emboss() {
  const y = 176
  const t = 0.7 * 12
  return (
    <Fig h={286} view="Side view · stamp on the flat lining" scale="optional">
      <ClDefs />
      <Tl.Slab x={24} y={y + t} w={290} h={16} kind="granite" />
      <Ply x1={34} x2={304} y={y} t={t} k="lining" />
      <g transform={`translate(170 ${y - 4})`}>
        <circle cx="0" cy="-8" r="34" fill="rgba(230,120,60,0.16)" />
        <rect x="-30" y="-22" width="60" height="18" rx="2" fill="url(#sk-brassG)" stroke="#5c461a" strokeWidth="0.8" />
        {[-20, -12, -4, 4, 12, 20].map((x) => (
          <rect key={x} x={x - 2.5} y="-4" width="5" height="4" fill="#b88f3c" stroke="#5c461a" strokeWidth="0.5" />
        ))}
        <rect x="-8" y="-66" width="16" height="44" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.7" />
        <rect x="-11" y="-128" width="22" height="64" rx="6" fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.8" />
      </g>
      <Arrow a={[218, 70]} b={[218, 140]} w={2} />
      <T x={226} y={96} s={11} c={C.brass}>press once,</T>
      <T x={226} y={110} s={11} c={C.brass}>straight down</T>
      <Lead p={[142, y - 18]} t={[118, 116]} text="brass die" sub="factory: ≈ 100 °C" a="end" />
      <Lead p={[80, y + 4]} t={[40, 232]} text="lining, flat, grain up" sub="before it is glued" a="start" />
      <Lead p={[260, y + t + 8]} t={[316, 240]} text="hard, flat bed" a="end" />

      <Box x={330} y={36} w={138} h={242} title="result" />
      <rect x={346} y={64} width={106} height={170} rx="2" fill="url(#sk-lin)" stroke={C.liningEdge} />
      <rect x={366} y={124} width={66} height={36} rx="6" fill="none" stroke="#a48f68" strokeWidth="1.4" />
      <rect x={368} y={126} width={62} height={32} rx="5" fill="rgba(120,95,60,0.18)" />
      <T x={399} y={148} a="middle" s={12} c="#7d6a4a" w="600" mono>20·18</T>
      <T x={399} y={192} a="middle" s={10} c="#7d6a4a">debossed mark</T>
      <T x={399} y={206} a="middle" s={10} c="#7d6a4a">on the wrist face</T>
      <T x={399} y={252} a="middle" s={10} c={C.faint}>size, maker’s mark</T>
      <T x={399} y={266} a="middle" s={10} c={C.faint}>— stamped while flat</T>
    </Fig>
  )
}

/* 13 · Punch the tongue slot */
function SlotPunch() {
  const s = 2.6
  const TP = { x: 72, y: 82, s }
  const bs = big(SF)
  const py = 258 // section top
  const ps = 4
  return (
    <Fig h={340} view="Plan · short top, flat  ·  side view · punch" scale="slot 10 mm">
      <StrapPlan T={TP} o={bs} face="grain" folds={[{ x: 0 }, { x: 80, c: C.brass }]} slot={{ x: 80, len: 10, w: 2.2 }} centre />
      <Lead p={P(TP, 80, -2)} t={[300, 30]} text="slot, centred on the buckle fold" a="end" />
      <T x={P(TP, 0, 0)[0]} y={P(TP, 0, 15)[1] + 14} a="middle" s={10}>lug fold</T>
      <T x={P(TP, 40, 0)[0]} y={P(TP, 0, 15)[1] + 14} a="middle" s={10} c={C.faint}>still flat — no fold made yet</T>
      <T x={P(TP, 80, 0)[0]} y={P(TP, 0, 15)[1] + 14} a="middle" s={10} c={C.brass}>buckle fold</T>

      <Box x={14} y={144} w={226} h={194} title="punch, on a pad" />
      <Tl.Slab x={28} y={py + 1.1 * 12} w={198} h={14} kind="pad" />
      <Ply x1={34} x2={220} y={py} t={1.1 * 12} k="top" />
      <Tl.Punch kind="oblong" d={(10 * ps) / 2.6} x={150} y={py} k={1} />
      <Tl.Mallet x={150} y={py - 66} k={0.55} />
      <Arrow a={[70, 196]} b={[70, 226]} w={1.6} />
      <T x={30} y={186} s={10} c={C.faint}>oblong mouth</T>
      <Dim a={[150 - 5 * ps, py + 1.1 * 12 + 18]} b={[150 + 5 * ps, py + 1.1 * 12 + 18]} text="10" flip />
      <T x={26} y={318} s={10.5} c={C.text}>one square strike, then lift</T>
      <T x={26} y={332} s={10} c={C.faint}>or a round punch each end + knife cut</T>

      <Box x={248} y={144} w={220} h={194} title="detail · ×7" c={C.brass} tc={C.brass} />
      {(() => {
        const cx = 358
        const cy = 236
        const k = 7.2
        return (
          <g>
            <rect x={262} y={cy - 56} width={192} height={112} fill="url(#sk-top)" opacity="0.55" />
            <line x1={cx} y1={cy - 62} x2={cx} y2={cy + 62} stroke={C.brass} strokeWidth="1" strokeDasharray="5 3" />
            <rect x={cx - 5 * k} y={cy - 1.1 * k} width={10 * k} height={2.2 * k} rx={1.1 * k} fill={C.hole} stroke="#e7c48f" strokeWidth="0.8" />
            <Dim a={[cx - 5 * k, cy - 1.1 * k]} b={[cx, cy - 1.1 * k]} off={-20} text="5" flip />
            <Dim a={[cx, cy - 1.1 * k]} b={[cx + 5 * k, cy - 1.1 * k]} off={-20} text="5" flip />
            <Dim a={[cx + 5 * k, cy - 1.1 * k]} b={[cx + 5 * k, cy + 1.1 * k]} off={-14} text="" />
            <T x={cx + 5 * k + 20} y={cy + 4} s={10.5} mono>tongue w</T>
            <T x={cx} y={cy + 76} a="middle" s={10.5} c={C.brass}>buckle fold line</T>
            <T x={cx} y={cy + 90} a="middle" s={10} c={C.faint}>check the tongue sits before folding</T>
          </g>
        )
      })()}
    </Fig>
  )
}

function Band({ cx, cy, r1, r2, a0, a1, fill, stroke }) {
  const Q = (r, a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)]
  const [x1, y1] = Q(r1, a0)
  const [x2, y2] = Q(r1, a1)
  const [x3, y3] = Q(r2, a1)
  const [x4, y4] = Q(r2, a0)
  const L = a1 - a0 > 180 ? 1 : 0
  return (
    <path
      d={`M${x1} ${y1} A${r1} ${r1} 0 ${L} 1 ${x2} ${y2} L${x3} ${y3} A${r2} ${r2} 0 ${L} 0 ${x4} ${y4} Z`}
      fill={fill}
      stroke={stroke}
      strokeWidth="0.8"
    />
  )
}

/* 14 · Form the folds — pre-form, crease, open again */
function Folds() {
  const A = { cx: 64, y0: 108, r: 10, t: 11, tl: 6, cv: 26, tail: 54, a: 16 }
  const gA = foldGeo(A)
  const B = { cx: 410, y0: 108, r: 10, t: 11, tl: 6, cv: 26, tail: 54, a: 16, dir: -1 }
  const gB = foldGeo(B)
  const sx = 70
  const sy = 262
  const ss = 2.0
  return (
    <Fig h={340} view="Section · pre-forming the folds" scale="schematic · thickness ×10">
      <Box x={14} y={28} w={222} h={170} title="1 · lug fold round a former" />
      <FoldEnd {...A} bl={164} />
      <BarEnd cx={A.cx} cy={gA.cy} r={A.r * 0.95} />
      <NoGlue x1={A.cx + 12} x2={gA.tip} y={gA.yB} h={6} />
      <Tl.BoneFolder x={76} y={A.y0} ang={38} k={0.62} />
      <Arrow d={`M${A.cx + 12} ${A.y0 - 10} A28 28 0 0 0 ${A.cx - 26} ${gA.cy + 4}`} w={1.6} />
      <T x={136} y={66} s={11} c={C.text}>bone-fold until</T>
      <T x={136} y={80} s={11} c={C.text}>the bar shape shows</T>
      <Lead p={[A.cx, gA.cy]} t={[26, 172]} text="rod or stick ≥ the pin" a="start" />
      <Lead p={[gA.tip - 16, gA.yB + 2]} t={[150, 152]} text="no glue yet" a="start" c={C.ruby} />
      <T x={26} y={188} s={10} c={C.faint}>the top is still single — no lining</T>

      <Box x={246} y={28} w={222} h={170} title="2 · buckle fold, creased" />
      <FoldEnd {...B} bl={84} />
      <BarEnd cx={B.cx} cy={gB.cy} r={B.r * 0.95} />
      <path d={`M${B.cx - 84} ${B.y0 - 4} l-5 6 l5 6 l-5 6 l5 6`} fill="none" stroke={C.dim} strokeWidth="1" />
      <Tl.Pliers x={B.cx - 26} y={gB.cy - 4} open={24} k={0.72} ang={180} />
      <Lead p={[B.cx - 26, B.y0 - 6]} t={[300, 62]} text="leather-tipped pliers" sub="set the crease" a="start" />
      <Lead p={[B.cx, gB.cy]} t={[456, 172]} text="a rod — not the buckle" a="end" />
      <T x={256} y={188} s={10} c={C.faint}>slot from step 13 sits on this fold</T>

      <Box x={14} y={206} w={274} h={130} title="3 · then open them again" c={C.brass} tc={C.brass} />
      <OpenTop x={sx} y={sy} s={ss} k={10} />
      {[0, 80].map((m) => (
        <line key={m} x1={sx + m * ss} y1={sy - 14} x2={sx + m * ss} y2={sy + 22} stroke={C.text} strokeWidth="0.9" strokeDasharray="3 3" />
      ))}
      <T x={sx} y={sy - 18} a="middle" s={10}>crease</T>
      <T x={sx + 80 * ss} y={sy - 18} a="middle" s={10}>crease</T>
      <Lead p={[sx - 26, sy + 10]} t={[24, 304]} text="flaps open again: the" sub="creases remember the bar" a="start" />
      <T x={170} y={sy + 34} s={10.5} c={C.text}>top flat, flesh down</T>

      <Box x={296} y={206} w={172} h={130} title="why open?" c={C.ruby} tc={C.ruby} />
      <T x={306} y={240} s={10.5} c={C.text}>The surcoupe (step 19)</T>
      <T x={306} y={254} s={10.5} c={C.text}>runs along every edge,</T>
      <T x={306} y={268} s={10.5} c={C.text}>flaps included — it would</T>
      <T x={306} y={282} s={10.5} c={C.text}>slice a keeper in place.</T>
      <T x={306} y={302} s={10.5} c={C.ruby}>✗ no keeper  ✗ no buckle</T>
      <T x={306} y={318} s={10.5} c={C.ruby}>✗ no glue yet</T>
    </Fig>
  )
}

/* 15 · Prepare to glue: roughen, mark the stops, leave the pockets */
function Stops() {
  const s = 2.6
  const TL = { x: 76, y: 80, s }
  const TS = { x: 76, y: 192, s }
  const bl = big(LF)
  const bs = big(SF)
  const hatch = (T, o, a, b) => {
    const [x1, y1] = P(T, a, -16)
    const [x2] = P(T, b, 0)
    return (
      <ClipTo T={T} o={o}>
        <rect x={x1} y={y1} width={x2 - x1} height={32 * s} fill="url(#sk-hatch)" opacity="0.5" />
      </ClipTo>
    )
  }
  // pocket section
  const fx = 150
  const ps = 5
  const py = 294
  const X = (m) => fx + m * ps
  return (
    <Fig h={340} view="Plan · flesh side, flaps open  ·  section" scale="stops 10 / 14 mm">
      <StrapPlan
        T={TL}
        o={bl}
        face="flesh"
        zones={[
          { from: -20, to: 2, k: 'skiveL' },
          { from: 0, to: 10, k: 'noglue' },
        ]}
        folds={[{ x: 0 }, { x: 10, c: C.brass }]}
      />
      {hatch(TL, bl, 10, 126)}
      <Dim a={P(TL, 0, -15)} b={P(TL, 10, -15)} off={-8} text="10" flip />
      <Lead p={P(TL, 5, 12)} t={[118, 142]} text="pocket for the lug tail" a="start" c={C.ruby} />
      <Lead p={P(TL, 60, -10)} t={[240, 32]} text="roughen between the stops" a="start" />
      <Lead p={P(TL, -12, 12)} t={[70, 140]} text="open flap" a="end" />

      <StrapPlan
        T={TS}
        o={bs}
        face="flesh"
        zones={[
          { from: -20, to: 2, k: 'skiveL' },
          { from: 78, to: 105, k: 'skiveR' },
          { from: 0, to: 10, k: 'noglue' },
          { from: 66, to: 80, k: 'noglue' },
        ]}
        folds={[{ x: 0 }, { x: 80 }, { x: 10, c: C.brass }, { x: 66, c: C.brass }]}
        slot={{ x: 80, len: 10, w: 2.2 }}
      />
      {hatch(TS, bs, 10, 66)}
      <Dim a={P(TS, 0, -15)} b={P(TS, 10, -15)} off={-8} text="10" flip />
      <Dim a={P(TS, 66, -14)} b={P(TS, 80, -14)} off={-8} text="14" flip />
      <Lead p={P(TS, 73, 11)} t={[300, 252]} text="pocket for the buckle tail" a="start" c={C.ruby} />
      <T x={360} y={182} s={10.5} c={C.text}>same stops on</T>
      <T x={360} y={196} s={10.5} c={C.text}>the linings</T>
      <T x={360} y={212} s={10} c={C.faint}>folds creased,</T>
      <T x={360} y={225} s={10} c={C.faint}>flaps open</T>

      {/* the pocket, in section */}
      <Box x={14} y={262} w={454} h={74} />
      <Tag x={24} y={278}>The pocket, in section, once the lining is laid</Tag>
      <SkivedTop x={fx} y={py} s={ps} k={10} a={-20} b={28} buckle={0} />
      <path d={`M${X(0)} ${py + 13.5} L${X(10)} ${py + 13.5} L${X(11.5)} ${py + 11} L${X(28)} ${py + 11} L${X(28)} ${py + 18} L${X(0)} ${py + 20} Z`} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.8" />
      <GlueLine x1={X(11.5)} x2={X(28)} y={py + 11} />
      <rect x={X(0)} y={py + 11} width={10 * ps} height={2.5} fill="url(#sk-noglue)" />
      <line x1={X(0)} y1={py - 8} x2={X(0)} y2={py + 26} stroke={C.text} strokeWidth="0.8" strokeDasharray="3 3" />
      <Arrow d={`M${X(-16)} ${py + 16} C${X(-14)} ${py + 34} ${X(-2)} ${py + 34} ${X(4)} ${py + 16}`} w={1.3} dash="4 3" />
      <Lead p={[X(5), py + 12]} t={[330, 300]} text="unglued band = pocket" sub="the tail slides in at step 19" a="start" c={C.ruby} />
      <T x={X(-10)} y={py - 6} a="middle" s={10} c={C.dim}>flap</T>
    </Fig>
  )
}

/* 16 · Glue both faces to the stops */
function Glue() {
  const fx = 82
  const s = 2.6
  const k = 9
  const y = 92
  const X = (m) => fx + m * s
  const ga = X(10)
  const gb = X(66)
  const ly = 168
  const lt = 0.7 * k
  const yf = y + 1.1 * k
  return (
    <Fig h={336} view="Section · exploded · short piece" scale="thickness ×3">
      <SkivedTop x={fx} y={y} s={s} k={k} />
      {[0, 80].map((m) => (
        <line key={'f' + m} x1={X(m)} y1={y - 12} x2={X(m)} y2={ly + lt + 8} stroke={C.text} strokeWidth="0.8" strokeDasharray="3 4" opacity="0.7" />
      ))}
      <GlueLine x1={ga} x2={gb} y={yf} />
      <NoGlue x1={X(0)} x2={ga} y={yf + 1} h={6} />
      <NoGlue x1={gb} x2={X(80)} y={yf + 1} h={6} />
      <Lead p={[X(40), y + 2]} t={[X(40), 42]} text="top, flaps open, flesh down" a="middle" />
      <T x={X(-10)} y={y - 8} a="middle" s={10} c={C.dim}>lug flap</T>
      <T x={X(92)} y={y - 8} a="middle" s={10} c={C.dim}>buckle flap</T>
      <Dim a={[X(0), yf + 4]} b={[ga, yf + 4]} off={12} text="10" flip />
      <Dim a={[gb, yf + 4]} b={[X(80), yf + 4]} off={12} text="14" flip />

      <Ply x1={X(0)} x2={X(80)} y={ly} t={lt} k="lining" cut="top" skL={[26, 2]} skR={[26, 2]} />
      <GlueLine x1={ga} x2={gb} y={ly} />
      <NoGlue x1={X(0)} x2={ga} y={ly + 1} h={7} />
      <NoGlue x1={gb} x2={X(80)} y={ly + 1} h={7} />
      {[130, 230].map((x) => (
        <Arrow key={x} a={[x, ly - 10]} b={[x, yf + 26]} c="emerald" w={1.3} dash="3 3" />
      ))}
      <Tl.Brush x={186} y={ly} ang={24} k={0.52} />
      <Lead p={[X(76), ly + 4]} t={[380, 166]} text="lining, flesh up" sub="same thin coat" a="start" />
      <Lead p={[X(4), ly + 1]} t={[76, 150]} text="pockets" sub="stay bare" a="end" c={C.ruby} />
      <T x={250} y={ly + 30} a="middle" s={10.5} c={C.text}>thin water-based contact cement on BOTH faces, up to the stops</T>

      <Box x={14} y={214} w={222} h={118} title="the coat" />
      <Ply x1={28} x2={110} y={256} t={10} />
      <GlueLine x1={30} x2={108} y={266} />
      <Verdict x={122} y={262} ok r={7} />
      <T x={28} y={290} s={10.5} c={C.text}>thin, even, full</T>
      <T x={28} y={303} s={10} c={C.faint}>doesn’t stiffen</T>
      <Ply x1={142} x2={218} y={256} t={10} />
      <path d="M144 266 q6 7 12 2 q8 8 14 1 q6 9 14 2 q8 7 14 0 q6 6 10 1" fill="rgba(123,165,131,0.55)" stroke={C.emerald} strokeWidth="0.8" />
      <Verdict x={224} y={242} r={7} />
      <T x={142} y={290} s={10.5} c={C.text}>puddled</T>
      <T x={142} y={303} s={10} c={C.faint}>squeezes out at</T>
      <T x={142} y={316} s={10} c={C.faint}>the cut edge</T>

      <Box x={246} y={214} w={222} h={118} title="wait for tack" c={C.emerald} tc={C.emerald} />
      <circle cx={286} cy={270} r={24} fill="none" stroke={C.dim} strokeWidth="1.2" />
      <path d="M286 270 L286 250 A20 20 0 0 1 299 254.7 Z" fill="rgba(123,165,131,0.45)" />
      <line x1={286} y1={270} x2={286} y2={252} stroke={C.text} strokeWidth="1.6" strokeLinecap="round" />
      <line x1={286} y1={270} x2={297} y2={262} stroke={C.text} strokeWidth="1.2" strokeLinecap="round" />
      <T x={320} y={252} s={10.5} c={C.text}>thin water-based:</T>
      <T x={320} y={266} s={10.5} c={C.text}>≈ 2–3 min</T>
      <T x={320} y={284} s={10} c={C.faint}>knuckle test: tacky,</T>
      <T x={320} y={297} s={10} c={C.faint}>not wet</T>
      <T x={258} y={322} s={10} c={C.faint}>times vary by glue — test on scrap</T>
    </Fig>
  )
}

/* 17 · Lay the linings */
function Lay() {
  const cx = 160
  const cy = 272
  const R = 76
  const lt = 6
  const tt = 10
  const [rx, ry] = polar(cx, cy, R + lt + tt, -90)
  const [lx0, ly0] = polar(cx, cy, R + lt / 2, -156)
  const [lx1, ly1] = polar(cx, cy, R + lt / 2, -8)
  const fx = 324
  const fs = 1.1
  return (
    <Fig h={330} view="Side view · lay the linings" scale="schematic">
      <Box x={14} y={28} w={292} h={298} title="1 · long piece: boated" />
      <ClipRect x={15} y={29} w={290} h={296}>
        <Tl.Bottle cx={cx} cy={cy} r={R} />
      </ClipRect>
      <Band cx={cx} cy={cy} r1={R} r2={R + lt} a0={-156} a1={-8} fill="url(#sk-linS)" stroke="#8f7b5a" />
      <Band cx={cx} cy={cy} r1={R + lt} r2={R + lt + tt} a0={-172} a1={-22} fill="url(#sk-topS)" stroke="#4a3018" />
      <Arrow a={[lx0, ly0]} b={[lx0 - 10, ly0 + 26]} c="brass" w={1.8} />
      <Arrow a={[lx1, ly1]} b={[lx1 + 6, ly1 + 28]} c="brass" w={1.8} />
      <Tl.Roller x={rx} y={ry} k={0.72} />
      <Arrow d={`M${polar(cx, cy, 116, -132).join(' ')} A116 116 0 0 1 ${polar(cx, cy, 116, -104).join(' ')}`} w={1.6} />
      <T x={cx} y={250} a="middle" s={10} c="#8fbcae">former / bottle</T>
      <T x={24} y={64} s={10.5} c={C.text}>Pulled at both ends, the lining is pre-loaded:</T>
      <T x={24} y={78} s={10.5} c={C.text}>the strap is born in the wrist curve.</T>
      <Lead p={polar(cx, cy, R + 3, -140)} t={[26, 132]} text="lining stretched" sub="round the former" a="start" />
      <Lead p={polar(cx, cy, R + lt + 5, -50)} t={[296, 140]} text="top laid on" sub="glue to glue" a="end" />
      <Lead p={polar(cx, cy, R + lt + 5, -168)} t={[26, 300]} text="lug flap, still open" a="start" />
      <Lead p={polar(cx, cy, R + lt + 5, -24)} t={[296, 300]} text="tip" a="end" />
      <T x={rx + 30} y={ry - 66} s={10} c={C.brass}>roll</T>

      <Box x={314} y={28} w={154} h={298} title="2 · short, flat" />
      <Tl.Slab x={322} y={123} w={140} h={10} kind="board" />
      <SkivedTop x={fx + 20 * fs} y={110} s={fs} k={7} />
      <Ply x1={fx + 20 * fs} x2={fx + 100 * fs} y={117.7} t={4.9} k="lining" />
      <Tl.Roller x={384} y={110} k={0.52} />
      <Num x={330} y={62} n={1} />
      <T x={344} y={66} s={10.5} c={C.text}>roll</T>
      <Tl.Slab x={322} y={243} w={140} h={10} kind="board" />
      <SkivedTop x={fx + 20 * fs} y={230} s={fs} k={7} />
      <Ply x1={fx + 20 * fs} x2={fx + 100 * fs} y={237.7} t={4.9} k="lining" />
      <Tl.Hammer x={384} y={230} k={0.6} />
      <Num x={330} y={176} n={2} />
      <T x={344} y={180} s={10.5} c={C.text}>tap lightly</T>
      <T x={324} y={284} s={10.5} c={C.text}>short lining flat,</T>
      <T x={324} y={298} s={10.5} c={C.text}>fold to fold</T>
      <T x={324} y={314} s={10} c={C.faint}>press ≥ 1 bar overall</T>
    </Fig>
  )
}

/* 18 · Cure */
function Cure() {
  const cx = 104
  const cy = 142
  const r = 66
  const ang = (m) => -90 + m * 6
  const sector = (m0, m1, fill) => {
    const [x0, y0] = polar(cx, cy, r - 4, ang(m0))
    const [x1, y1] = polar(cx, cy, r - 4, ang(m1))
    return <path d={`M${cx} ${cy} L${x0} ${y0} A${r - 4} ${r - 4} 0 0 1 ${x1} ${y1} Z`} fill={fill} />
  }
  const [hx, hy] = polar(cx, cy, r - 14, ang(42))
  const bc = [338, 236]
  const BR = 104
  const fs = 1.4
  return (
    <Fig h={300} view="Rest · let the bond set" scale="30–60 min">
      <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.03)" stroke={C.dim} strokeWidth="1.4" />
      {sector(0, 30, 'rgba(194,88,99,0.20)')}
      {sector(30, 60, 'rgba(123,165,131,0.30)')}
      {Array.from({ length: 12 }, (_, i) => {
        const [a, b] = polar(cx, cy, r - 2, ang(i * 5))
        const [c, d] = polar(cx, cy, r - (i % 3 ? 7 : 11), ang(i * 5))
        return <line key={i} x1={a} y1={b} x2={c} y2={d} stroke={C.dim} strokeWidth={i % 3 ? 1 : 1.6} />
      })}
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke={C.text} strokeWidth="2.2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={3.5} fill={C.text} />
      <T x={cx} y={cy - r - 8} a="middle" s={11} c={C.emerald} mono>60</T>
      <T x={cx} y={cy + r + 17} a="middle" s={11} c={C.dim} mono>30 min</T>
      <T x={cx + 30} y={cy + 4} s={10.5} c={C.ruby}>wait</T>
      <T x={cx - 52} y={cy + 4} s={10.5} c={C.emerald}>ready</T>
      <T x={cx} y={250} a="middle" s={11.5} c={C.text}>30–60 min before cutting</T>
      <T x={cx} y={265} a="middle" s={10} c={C.faint}>water-based cement, thin coats</T>

      <Sep x1={196} y1={36} x2={196} y2={284} />
      <Tag x={212} y={46}>On the bench, untouched</Tag>
      <rect x={212} y={150} width={252} height={8} rx="2" fill="url(#sk-bench)" />
      <Band cx={bc[0]} cy={bc[1]} r1={BR} r2={BR + 5} a0={-118} a1={-54} fill="url(#sk-linS)" stroke="#8f7b5a" />
      <Band cx={bc[0]} cy={bc[1]} r1={BR + 5} r2={BR + 13} a0={-128} a1={-58} fill="url(#sk-topS)" stroke="#4a3018" />
      <Lead p={[338, 120]} t={[300, 78]} text="long piece keeps its boat" a="end" />
      <Lead p={polar(bc[0], bc[1], BR + 9, -124)} t={[232, 116]} text="flap still open" a="start" />

      <rect x={212} y={232} width={252} height={8} rx="2" fill="url(#sk-bench)" />
      <SkivedTop x={250 + 20 * fs} y={216.4} s={fs} k={7} />
      <Ply x1={250 + 20 * fs} x2={250 + 100 * fs} y={224.1} t={4.9} k="lining" />
      <Lead p={[330, 218]} t={[330, 188]} text="short piece, flat, flaps open" a="middle" />
      <T x={212} y={268} s={10.5} c={C.ruby}>✗ no cutting, stitching or flexing yet</T>
      <T x={212} y={284} s={10.5} c={C.emerald}>✓ then straight to the surcoupe</T>
    </Fig>
  )
}

/* 19 · Final cut — the surcoupe — then close the folds */
function FinalCut() {
  const s = 2.4
  const T0 = { x: 40 + 20 * s, y: 112, s }
  const o = LF
  const bo = big(LF)
  const lin = { x0: 0, x1: 127, w0: 40, w1: 40, taper: [0, 127], tip: 'square' }
  const xc = 56
  const edge = (x) => -widthAt(x, o) / 2
  const keep = []
  for (let x = -20; x <= xc; x += 2) keep.push([x, edge(x)])
  keep.push([xc, -21], [128, -21], [128, 21], [-21, 21], [-21, edge(-20)])
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const topW = []
  for (let x = -20; x <= xc; x += 2) topW.push([x, edge(x)])
  topW.push([xc, -15], [-20, -15])
  const linW = [[0, -15], [xc, -15], [xc, -20], [0, -20]]
  const [kx, ky] = P(T0, xc, edge(xc))
  // closing sections
  const A = { cx: 62, y0: 238, r: 9, t: 11, tl: 6, cv: 22, tail: 18, a: 14 }
  const gA = foldGeo(A)
  const B = { cx: 420, y0: 238, r: 9, t: 11, tl: 6, cv: 22, tail: 34, a: 14, dir: -1 }
  const gB = foldGeo(B)
  const lin2 = (pts, key) => <polygon key={key} points={pts.map((p) => p.join(',')).join(' ')} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.8" />
  const kx2 = B.cx - 40
  return (
    <Fig h={340} view="Plan · the surcoupe  ·  section · closing" scale="cut, then close">
      <Box x={14} y={24} w={454} h={150} title="1 · the surcoupe" />
      <clipPath id={`kp${id}`}>
        <path d={pathOf(keep, T0)} />
      </clipPath>
      <g clipPath={`url(#kp${id})`}>
        <StrapPlan T={T0} o={lin} face="lining" />
        <StrapPlan T={T0} o={bo} face="grain" />
      </g>
      <StrapPlan T={T0} o={o} face="card" centre folds={[{ x: 0 }]} />
      <g transform="translate(-2 -10) rotate(-1 150 60)">
        <path d={pathOf(linW, T0)} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="0.8" />
        <path d={pathOf(topW, T0)} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      </g>
      <Tl.Knife kind="utility" x={kx} y={ky} ang={22} k={0.5} />
      <Dim a={P(T0, 30, -10)} b={P(T0, 30, 10)} off={0} text="" />
      <T x={P(T0, 30, 0)[0] + 5} y={P(T0, 0, 4)[1]} s={10.5} mono c={C.text}>19.8–20.0</T>
      <Lead p={[136, 64]} t={[152, 40]} text="offcut: top + lining, flap included" a="start" />
      <Lead p={P(T0, 90, 6)} t={[300, 166]} text="card pattern glued on · one 90° cut" a="end" />
      <Lead p={P(T0, 119, 0)} t={[462, 166]} text="apex on the line" a="end" />

      {/* close — lug */}
      <Box x={14} y={182} w={222} h={154} title="2 · close the lug fold" />
      <FoldEnd {...A} bl={166} />
      <BarEnd cx={A.cx} cy={gA.cy} r={A.r * 0.95} />
      {lin2([[gA.conv, gA.yB + A.tl], [gA.tip, gA.yB], [228, gA.yB], [228, gA.yB + 7], [gA.tip, gA.yB + 7], [gA.conv, gA.yB + A.tl + 4]], 'la')}
      <GlueLine x1={gA.tip} x2={228} y={gA.yB} />
      <circle cx={gA.tip - 4} cy={gA.yB} r="5" fill="rgba(123,165,131,0.35)" stroke={C.emerald} strokeWidth="1" />
      <Arrow a={[gA.conv - 6, 290]} b={[gA.tip + 8, 290]} w={1.5} />
      <Pin p={[A.cx, gA.cy]} d={[34, 222]} n={1} />
      <Pin p={[gA.conv + 6, gA.yB + 4]} d={[86, 214]} n={2} />
      <Pin p={[gA.tip - 4, gA.yB]} d={[132, 214]} n={3} c={C.emerald} />
      <T x={24} y={308} s={10} c={C.text}>1 former in the channel</T>
      <T x={24} y={321} s={10} c={C.text}>2 tail slid into the 10 mm pocket</T>
      <T x={24} y={334} s={10} c={C.emerald}>3 glue on the tail tip only</T>
      <T x={150} y={294} s={10} c={C.brass}>slide in</T>

      {/* close — buckle */}
      <Box x={246} y={182} w={222} h={154} title="3 · buckle end" />
      <FoldEnd {...B} bl={166} />
      {lin2([[gB.conv, gB.yB + B.tl], [gB.tip, gB.yB], [254, gB.yB], [254, gB.yB + 7], [gB.tip, gB.yB + 7], [gB.conv, gB.yB + B.tl + 4]], 'lb')}
      <GlueLine x1={254} x2={gB.tip} y={gB.yB} />
      <rect x={kx2 - 10} y={B.y0 - 34} width={20} height={12} rx="2" fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <path d={`M${kx2 - 10} ${B.y0 - 28} q-7 0 -7 8 V${gB.yB} M${kx2 + 10} ${B.y0 - 28} q7 0 7 8 V${gB.yB}`} fill="none" stroke="#b98c57" strokeWidth="1" strokeDasharray="2.5 2" />
      <path d={`M${kx2 - 14} ${gB.yB} L${kx2 + 14} ${gB.yB} L${kx2 + 14} ${gB.yB + 1.2} L${kx2} ${gB.yB + 3} L${kx2 - 14} ${gB.yB + 1.2} Z`} fill="url(#sk-dark)" stroke="#2e1e10" strokeWidth="0.6" />
      <circle cx={gB.tip + 4} cy={gB.yB} r="5" fill="rgba(123,165,131,0.35)" stroke={C.emerald} strokeWidth="1" />
      <BuckleSide cx={B.cx} cy={gB.cy} r={B.r} s={2.2} T={B.t} />
      <Dim a={[kx2, B.y0 - 40]} b={[B.cx, B.y0 - 40]} text="10" />
      <Pin p={[B.cx + 20, gB.cy]} d={[452, 290]} n={1} />
      <Pin p={[kx2, gB.yB + 2]} d={[kx2 - 12, 290]} n={2} />
      <Pin p={[gB.tip + 4, gB.yB]} d={[gB.tip - 40, 290]} n={3} c={C.emerald} />
      <T x={256} y={308} s={10} c={C.text}>1 buckle on first, tongue in the slot</T>
      <T x={256} y={321} s={10} c={C.text}>2 keeper ends trapped, ~10 mm in</T>
      <T x={256} y={334} s={10} c={C.emerald}>3 tail in the 14 mm pocket, tip glued</T>
    </Fig>
  )
}

/* 20 · Sand and bevel */
function Bevel() {
  const L = [{ k: 'top', t: 12 }, { k: 'velodon', t: 2 }, { k: 'lining', t: 8 }]
  const y = 92
  return (
    <Fig h={330} view="Section · the cut edge, end-on" scale="thickness ×10">
      <Tag x={24} y={46}>1 · as cut</Tag>
      <XSec cx={74} y={y} w={100} layers={L} edge="rough" />
      <Tl.Sander x={126} y={y + 11} len={56} k={0.8} ang={90} />
      <T x={74} y={146} a="middle" s={10.5} c={C.text}>sand level</T>
      <T x={74} y={160} a="middle" s={10} c={C.faint}>lengthwise · 400 grit</T>

      <Arrow a={[150, y + 11]} b={[176, y + 11]} c="text" w={1.2} />
      <Tag x={190} y={46}>2 · levelled</Tag>
      <XSec cx={240} y={y} w={100} layers={L} edge="square" />
      <T x={240} y={146} a="middle" s={10.5} c={C.text}>flush, square</T>
      <T x={240} y={160} a="middle" s={10} c={C.faint}>no ridge between layers</T>

      <Arrow a={[302, y + 11]} b={[328, y + 11]} c="text" w={1.2} />
      <Tag x={344} y={46}>3 · bevelled</Tag>
      <XSec cx={406} y={y} w={100} layers={L} edge="bevel" b={6} />
      <Tl.Beveller x={359} y={y + 3} ang={-45} k={0.55} />
      <T x={406} y={146} a="middle" s={10.5} c={C.text}>both arrises</T>
      <T x={406} y={160} a="middle" s={10} c={C.faint}>grain side, then flip</T>

      <Box x={14} y={180} w={222} h={146} title="keep it small" />
      <XSec cx={70} y={222} w={80} layers={L} edge="bevel" b={6} />
      <Verdict x={70} y={206} ok r={7} />
      <T x={70} y={270} a="middle" s={10.5} c={C.text}>0.5–0.7 mm</T>
      <XSec cx={178} y={222} w={80} layers={L} edge="bevel" b={9} />
      <Verdict x={178} y={206} r={7} />
      <T x={178} y={270} a="middle" s={10.5} c={C.text}>big bevel</T>
      <T x={24} y={298} s={10} c={C.faint}>A big bevel leaves a thin lip that</T>
      <T x={24} y={311} s={10} c={C.faint}>cracks paint where the strap flexes.</T>

      <Box x={246} y={180} w={222} h={146} title="detail · ×40" c={C.brass} tc={C.brass} />
      <path d="M262 230 L392 230 L424 262 L424 300 L262 300 Z" fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <path d="M392 230 L424 230 L424 262 Z" fill="rgba(208,168,79,0.18)" stroke={C.brass} strokeWidth="0.8" strokeDasharray="2 2" />
      <Dim a={[392, 230]} b={[424, 230]} off={-10} text="" />
      <T x={408} y={214} a="middle" s={10.5} mono>0.5–0.7</T>
      <Dim a={[424, 230]} b={[424, 262]} off={-12} text="" />
      <T x={276} y={252} s={10.5} c={C.text}>grain-side arris</T>
      <T x={276} y={266} s={10} c={C.ground}>top layer, end-on</T>
      <T x={256} y={322} s={10} c={C.faint}>same 0.5–0.7 on the lining-side arris</T>
    </Fig>
  )
}

/* 21 · Mark the stitch line */
function Mark() {
  const s = 2.6
  const TL = { x: 40, y: 76, s }
  const TS = { x: 190, y: 220, s }
  const zx = 98
  const zy = 236
  return (
    <Fig h={330} view="Plan · the stitch line" scale="dividers 2.75–3 mm">
      <StrapPlan T={TL} o={LONG()} edge="#d9b07a" stitch={{ mode: 'line', from: 4, m: 3 }} />
      <Lead p={P(TL, 60, -half(LONG(), 60) + 3)} t={[180, 34]} text="3 mm in, round the tip" a="start" />
      <Lead p={P(TL, 117, 0)} t={[466, 124]} text="tip: same margin" a="end" />

      <StrapPlan T={TS} o={SHORT()} edge="#d9b07a" stitch={{ mode: 'line', from: 4, to: 76, m: 3 }} keepers={[{ x: 70 }]} />
      <Buckle x={P(TS, 80, 0)[0] + 3} y={TS.y} w={18 * s} L={38} />
      <Lead p={P(TS, 76, 6)} t={[466, 166]} text="stops 4 mm behind the buckle fold" a="end" />
      <T x={190} y={276} s={10.5} c={C.text}>Re-check the width first: the leather</T>
      <T x={190} y={290} s={10.5} c={C.text}>may have shifted while it was glued.</T>
      <T x={190} y={306} s={10} c={C.faint}>One leg on the edge, light pressure;</T>
      <T x={190} y={319} s={10} c={C.faint}>no groover on stock this thin.</T>

      <Zoom cx={zx} cy={zy} r={60} from={P(TL, 4, -7)} fr={9} label="lug end · ×10" ly={310}>
        <rect x={zx - 46} y={zy - 40} width={120} height={110} fill="url(#sk-top)" />
        <line x1={zx - 46} y1={zy - 40} x2={zx + 80} y2={zy - 40} stroke="#d9b07a" strokeWidth="2" />
        <line x1={zx - 46} y1={zy - 40} x2={zx - 46} y2={zy + 80} stroke="#d9b07a" strokeWidth="2" />
        <line x1={zx - 6} y1={zy - 10} x2={zx + 22} y2={zy - 10} stroke={C.text} strokeWidth="1.3" strokeDasharray="2 3" />
        <Tl.Dividers x={zx + 22} y={zy - 25} sp={30} h={64} ang={90} />
        <Dim a={[zx - 22, zy - 40]} b={[zx - 22, zy - 10]} off={0} text="" />
        <T x={zx - 18} y={zy - 22} s={11} c={C.text} mono>3</T>
        <Dim a={[zx - 46, zy + 6]} b={[zx - 6, zy + 6]} off={0} text="4" />
        <T x={zx - 40} y={zy + 40} s={10} c={C.text}>fold</T>
      </Zoom>
    </Fig>
  )
}

function along(ring, i0, dir, pitch, n) {
  const N = ring.length
  const pts = [ring[i0]]
  for (let k = 1; k < N / 2; k++) pts.push(ring[(((i0 + dir * k) % N) + N) % N])
  const cum = [0]
  for (let k = 1; k < pts.length; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]))
  const out = []
  for (let m = 1; m <= n; m++) {
    const d = m * pitch
    const k = cum.findIndex((c) => c >= d)
    if (k < 1) break
    const a = pts[k - 1]
    const b = pts[k]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    const t = (d - cum[k - 1]) / (cum[k] - cum[k - 1])
    out.push({ p: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], tan: [(b[0] - a[0]) / L, (b[1] - a[1]) / L] })
  }
  return out
}

function Slit({ T, q, tan, c = C.hole, l = 0.65 }) {
  const [x, y] = P(T, q[0], q[1])
  const a = Math.atan2(tan[1], tan[0]) + 0.8
  const L = l * T.s
  return <line x1={x - Math.cos(a) * L} y1={y - Math.sin(a) * L} x2={x + Math.cos(a) * L} y2={y + Math.sin(a) * L} stroke={c} strokeWidth="1.6" strokeLinecap="round" />
}

function partial(run, f) {
  const seg = []
  let tot = 0
  for (let i = 1; i < run.length; i++) {
    const l = Math.hypot(run[i][0] - run[i - 1][0], run[i][1] - run[i - 1][1])
    seg.push(l)
    tot += l
  }
  let left = tot * f
  const out = [run[0]]
  for (let i = 1; i < run.length; i++) {
    if (left >= seg[i - 1]) {
      out.push(run[i])
      left -= seg[i - 1]
    } else {
      const t = left / seg[i - 1]
      out.push([run[i - 1][0] + (run[i][0] - run[i - 1][0]) * t, run[i - 1][1] + (run[i][1] - run[i - 1][1]) * t])
      break
    }
  }
  return out
}

function ClipRect({ x, y, w, h, children }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <g>
      <clipPath id={`clr${id}`}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#clr${id})`}>{children}</g>
    </g>
  )
}

/* 22 · Prick: tip first from the apex, then walk the straights */
function Prick() {
  const s = 7
  const TT = { x: 24 - 95 * s, y: 156, s }
  const o = LONG()
  const ring = offset(outline(o), 3)
  let i0 = 0
  ring.forEach((p, i) => {
    if (p[0] > ring[i0][0]) i0 = i
  })
  const up = along(ring, i0, -1, 3, 8)
  const dn = along(ring, i0, 1, 3, 8)
  const apex = ring[i0]
  const disc = (q, n, out) => {
    const [x, y] = P(TT, q[0], q[1])
    return <Num key={n} x={x + out[0]} y={y + out[1]} n={n} r={7} />
  }
  const [ax, ay] = P(TT, apex[0], apex[1])
  const [u1x, u1y] = P(TT, up[0].p[0], up[0].p[1])
  const fa = (Math.atan2(u1y - ay, u1x - ax) * 180) / Math.PI
  const fl = Math.hypot(u1x - ax, u1y - ay)
  return (
    <Fig h={340} view="Plan · tip ×7  ·  side view · iron" scale="pitch 3.0 mm">
      <Box x={14} y={28} w={238} h={308} title="1 · the tip first, 2-prong iron" />
      <ClipRect x={27} y={52} w={219} h={182}>
        <StrapPlan T={TT} o={o} edge={C.paint} stitch={{ mode: 'line', from: 90, m: 3 }} centre />
      </ClipRect>
      <path d="M24 88 l5 10 l-6 10 l6 10 l-6 10 l6 10 l-6 10 l6 10 l-6 10 l6 10 l-6 10 l5 10" fill="none" stroke={C.dim} strokeWidth="1" />
      {/* the 2-prong iron's footprint on strike 2 */}
      <rect x={ax - 6} y={ay - 5} width={fl + 12} height={10} rx="4" fill="rgba(180,196,206,0.32)" stroke={C.steel} strokeWidth="1" transform={`rotate(${fa} ${ax} ${ay})`} />
      <Slit T={TT} q={apex} tan={[0, 1]} />
      {up.map((h, i) => <Slit key={'u' + i} T={TT} q={h.p} tan={h.tan} c={i < 3 ? C.hole : '#5a3c22'} />)}
      {dn.map((h, i) => <Slit key={'d' + i} T={TT} q={h.p} tan={h.tan} c={i < 3 ? C.hole : '#5a3c22'} />)}
      {disc(apex, 1, [16, 0])}
      {disc(up[0].p, 2, [8, -14])}
      {disc(dn[0].p, 3, [8, 14])}
      {disc(up[1].p, 4, [4, -16])}
      {disc(dn[1].p, 5, [4, 16])}
      {disc(up[2].p, 6, [0, -17])}
      {disc(dn[2].p, 7, [0, 17])}
      <Lead p={[ax - fl / 2 + 4, ay - 10]} t={[60, 70]} text="2 prongs: one in the last hole" a="start" s={10.5} />
      <T x={24} y={252} s={10.5} c={C.text}>1 · centre mark at the apex</T>
      <T x={24} y={266} s={10.5} c={C.text}>2, 3 … step out, both sides in turn</T>
      <T x={24} y={280} s={10.5} c={C.text}>so the stitches meet evenly</T>
      <T x={24} y={298} s={10} c={C.faint}>Cant the iron so only two teeth bite;</T>
      <T x={24} y={311} s={10} c={C.faint}>one prong at a time on tight curves.</T>
      <T x={24} y={324} s={10} c={C.faint}>Spread any error on a straight, never here.</T>

      {/* walk the straights */}
      <Box x={260} y={28} w={208} h={196} title="2 · walk the straights" />
      <Tl.Slab x={266} y={166} w={196} h={12} kind="pad" />
      <rect x={268} y={150} width={192} height={9} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />
      <rect x={268} y={159} width={192} height={1.6} fill={C.velodon} />
      <rect x={268} y={160.6} width={192} height={5.4} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.6" />
      {[280, 298, 316].map((x) => (
        <rect key={x} x={x - 1.2} y={149} width={2.4} height={18} fill={C.hole} />
      ))}
      <Tl.Iron n={4} pitch={18} x={316} y={153} />
      <Tl.Mallet x={343} y={80} k={0.55} />
      <Dim a={[280, 150]} b={[298, 150]} off={-12} text="3.0" flip />
      <Arrow a={[392, 124]} b={[448, 124]} w={1.6} />
      <T x={420} y={116} a="middle" s={10} c={C.brass}>walk on</T>
      <T x={402} y={92} s={10} c={C.dim}>light blows</T>
      <Lead p={[316, 152]} t={[268, 204]} text="first prong in the last hole" a="start" />
      <T x={268} y={218} s={10} c={C.faint}>multi-prong iron on a punch pad</T>

      <Box x={260} y={232} w={208} h={104} title="hold it vertical" />
      {[0, 1].map((i) => {
        const x0 = 274 + i * 100
        const ok = i === 0
        return (
          <g key={i}>
            <rect x={x0} y={260} width={84} height={16} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />
            <line x1={x0} y1={280} x2={x0 + 84} y2={280} stroke={C.text} strokeWidth="0.8" strokeDasharray="2 2" />
            {[16, 42, 68].map((d) => (
              <line key={d} x1={x0 + d} y1={256} x2={x0 + d + (ok ? 0 : 6)} y2={280} stroke={C.hole} strokeWidth="2" />
            ))}
            <Verdict x={x0 + 42} y={296} ok={ok} r={6.5} />
          </g>
        )
      })}
      <T x={274} y={318} s={10} c={C.faint}>5° of drift misaligns the back holes;</T>
      <T x={274} y={331} s={10} c={C.faint}>0.5 mm off line shows at 3 mm</T>
    </Fig>
  )
}

/* 23 · Crease (optional), before stitching */
function Crease() {
  const k = 10
  const ey = 72 // edge, px
  const holes = Array.from({ length: 6 }, (_, i) => 118 + i * 30)
  return (
    <Fig h={304} view="Plan detail ×10  ·  end-on ×30" scale="optional · before stitching">
      <Box x={14} y={28} w={274} h={226} title="the crease run" />
      <rect x={24} y={ey} width={254} height={104} fill="url(#sk-top)" />
      <line x1={24} y1={ey} x2={278} y2={ey} stroke="#d9b07a" strokeWidth="2" />
      {holes.map((x) => (
        <line key={x} x1={x - 4} y1={ey + 3 * k + 4} x2={x + 4} y2={ey + 3 * k - 4} stroke={C.hole} strokeWidth="1.8" strokeLinecap="round" />
      ))}
      <line x1={24} y1={ey + 1.5 * k} x2={196} y2={ey + 1.5 * k} stroke="#4a2c12" strokeWidth="1.8" />
      <line x1={24} y1={ey + 1.5 * k + 1.6} x2={196} y2={ey + 1.5 * k + 1.6} stroke="#e0b277" strokeWidth="0.7" opacity="0.7" />
      <Tl.Creaser hot x={198} y={ey + 1.5 * k} ang={-38} k={0.7} />
      <Arrow a={[212, 60]} b={[270, 60]} w={1.6} />
      <Dim a={[44, ey]} b={[44, ey + 1.5 * k]} off={0} text="" />
      <T x={50} y={ey + 11} s={10.5} mono c={C.text}>1.5</T>
      <Dim a={[74, ey]} b={[74, ey + 3 * k]} off={0} text="" />
      <T x={80} y={ey + 26} s={10.5} mono c={C.text}>3.0</T>
      <T x={24} y={198} s={10.5} c={C.text}>Creaser heated over a spirit lamp,</T>
      <T x={24} y={212} s={10.5} c={C.text}>one steady pass, guided by the edge.</T>
      <T x={24} y={228} s={10} c={C.faint}>The crease runs inside the pricked holes;</T>
      <T x={24} y={241} s={10} c={C.faint}>test the heat on scrap first.</T>

      <Box x={296} y={28} w={172} h={226} title="end-on · ×30" c={C.brass} tc={C.brass} />
      {(() => {
        const ex = 452
        const y0 = 96
        const b = 16
        const crx = ex - 45
        const hx = ex - 90
        return (
          <g>
            <path d={`M304 ${y0} L${crx - 6} ${y0} L${crx} ${y0 + 7} L${crx + 6} ${y0} L${ex - b} ${y0} L${ex} ${y0 + b} L${ex} ${y0 + 33} L304 ${y0 + 33} Z`} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
            <rect x={304} y={y0 + 33} width={ex - 304} height={6} fill={C.velodon} />
            <path d={`M304 ${y0 + 39} L${ex} ${y0 + 39} L${ex} ${y0 + 44} L${ex - b} ${y0 + 60} L304 ${y0 + 60} Z`} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.8" />
            <rect x={hx - 2} y={y0 - 1} width={4} height={62} fill={C.hole} />
            <Dim a={[crx, y0]} b={[ex, y0]} off={-14} text="1.5" flip />
            <Dim a={[hx, y0]} b={[ex, y0]} off={-34} text="3.0" flip />
            <Lead p={[crx, y0 + 6]} t={[458, 196]} text="crease: pressed," sub="a sealed line" a="end" />
            <Lead p={[hx, y0 + 50]} t={[310, 232]} text="pricked hole" a="start" />
          </g>
        )
      })()}
      <T x={14} y={274} s={10.5} c={C.text}>Heated 1.5 mm crease, run before the thread goes in — the creaser can’t foul the stitches.</T>
      <T x={14} y={290} s={10} c={C.faint}>Step 27 shows the other order: an electric fileteuse after stitching.</T>
    </Fig>
  )
}

/* 24 · Saddle-stitch */
function Stitch() {
  const s = 3
  const TS = { x: 44, y: 82, s }
  const o = SHORT()
  const holes = Array.from({ length: 16 }, (_, i) => 36 + i * 18)
  const done = holes.filter((x) => x <= 216)
  return (
    <Fig h={340} view="Plan · short piece  ·  section along the seam" scale="3.0 mm pitch">
      <StrapPlan
        T={TS}
        o={o}
        edge="#d9b07a"
        zones={[
          { from: 4, to: 14, k: 'hl' },
          { from: 61, to: 76, k: 'hl' },
        ]}
        stitch={{ mode: 'stitch', from: 4, to: 76, m: 3, p: 3 }}
        keepers={[{ x: 70 }]}
      />
      <StitchRun T={TS} pts={outline(o)} m={3} p={3} from={4} to={14} w={2.8} />
      <StitchRun T={TS} pts={outline(o)} m={3} p={3} from={61} to={67} w={2.8} />
      <Buckle x={P(TS, 80, 0)[0] + 3} y={TS.y} w={18 * s} L={40} />
      <Lead p={P(TS, 9, -9)} t={[30, 34]} text="doubled through the lug tail" a="start" />
      <Lead p={P(TS, 63, -8)} t={[214, 34]} text="doubled: buckle tail + keeper" a="start" />
      <circle cx={P(TS, 40, 7)[0]} cy={P(TS, 40, 7)[1]} r="6" fill="none" stroke={C.brass} strokeWidth="1" />
      <Lead p={[P(TS, 40, 7)[0], P(TS, 40, 7)[1] + 6]} t={[60, 134]} text="start & finish mid-side, a low-stress zone" a="start" />

      <Box x={372} y={30} w={96} h={96} title="set" />
      <T x={380} y={64} s={10.5} c={C.text}>thread</T>
      <T x={380} y={77} s={10} mono>0.4–0.55</T>
      <T x={380} y={94} s={10.5} c={C.text}>length</T>
      <T x={380} y={107} s={10} mono>≈ 4× seam</T>
      <T x={380} y={120} s={10} c={C.faint}>2 blunt needles</T>

      {/* section along the seam */}
      <Tag x={14} y={160}>Section along the seam</Tag>
      <rect x={24} y={196} width={286} height={10} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />
      <rect x={24} y={206} width={286} height={2} fill={C.velodon} />
      <rect x={24} y={208} width={286} height={7} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.6" />
      {holes.map((x) => (
        <rect key={x} x={x - 1} y={195} width={2} height={21} fill={C.hole} />
      ))}
      <SectionStitch x1={36} x2={216} y1={196} y2={215} p={18} />
      <Tl.Needle x1={236} y1={232} x2={226} y2={166} thread="M226 166 Q206 172 216 194" />
      <Tl.Needle x1={232} y1={180} x2={244} y2={248} thread="M244 248 Q226 244 216 217" />
      <T x={230} y={160} s={10} c={C.text} a="middle">needle 1 first</T>
      <T x={248} y={262} s={10} c={C.dim}>needle 2, behind it</T>
      <T x={24} y={242} s={10.5} c={C.text}>same-side needle first, every time</T>
      <T x={24} y={256} s={10} c={C.faint}>pull both sides equally — uneven</T>
      <T x={24} y={269} s={10} c={C.faint}>tension curves the strap</T>

      <Zoom cx={402} cy={210} r={56} label="lining-side finish" ly={282}>
        <rect x={340} y={150} width={130} height={120} fill="url(#sk-lin)" />
        {[352, 376, 400, 424, 448].map((x) => (
          <line key={x} x1={x - 3} y1={212} x2={x + 3} y2={204} stroke="#5f4a2a" strokeWidth="1.4" />
        ))}
        {[352, 376].map((x) => (
          <line key={x} x1={x + 3} y1={209} x2={x + 21} y2={207} stroke={C.thread} strokeWidth="2.4" strokeLinecap="round" />
        ))}
        {[400, 424].map((x) => (
          <g key={x}>
            <line x1={x + 3} y1={210} x2={x + 21} y2={206} stroke={C.thread} strokeWidth="2.4" strokeLinecap="round" />
            <line x1={x + 3} y1={206} x2={x + 21} y2={210} stroke={C.thread} strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
          </g>
        ))}
        <circle cx={448} cy={204} r="2.6" fill="#c9b48d" stroke="#8f7b5a" />
        <circle cx={448} cy={212} r="2.6" fill="#c9b48d" stroke="#8f7b5a" />
        <T x={402} y={234} a="middle" s={10} c="#6e5a3a">backstitch 2 holes</T>
        <T x={446} y={192} a="end" s={10} c="#6e5a3a">ends, melted</T>
      </Zoom>

      <Sep x1={14} y1={290} x2={466} y2={290} />
      <Tl.Burner x={32} y={334} k={0.42} ang={30} />
      <T x={60} y={308} s={10.5} c={C.text}>Polyester: trim the ends to ~1 mm and melt them with a thread burner.</T>
      <T x={60} y={322} s={10} c={C.faint}>Finish on the lining side — never at the tip or across a fold.</T>
    </Fig>
  )
}

/* 25 · Set the seam */
function SetSeam() {
  const holes = Array.from({ length: 21 }, (_, i) => 40 + i * 20)
  const y = 112
  return (
    <Fig h={300} view="Section along the seam  ·  plan" scale="thickness ×8">
      <Tl.Slab x={20} y={y + 17} w={440} h={14} kind="granite" />
      <rect x={30} y={y} width={420} height={9} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />
      <rect x={30} y={y + 9} width={420} height={2} fill={C.velodon} />
      <rect x={30} y={y + 11} width={420} height={6} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.6" />
      {holes.map((x) => (
        <rect key={x} x={x - 1} y={y - 0.5} width={2} height={18} fill={C.hole} />
      ))}
      {holes.slice(0, -1).map((x) =>
        x < 240 ? (
          <line key={x} x1={x + 1} y1={y + 0.6} x2={x + 19} y2={y + 0.6} stroke={C.thread} strokeWidth="1.8" />
        ) : (
          <path key={x} d={`M${x + 1} ${y} Q${x + 10} ${y - 8} ${x + 19} ${y}`} fill="none" stroke={C.thread} strokeWidth="2.2" />
        )
      )}
      <Tl.Hammer x={250} y={y - 6} k={0.72} />
      <Arrow a={[226, 52]} b={[226, 92]} w={1.8} />
      <Arrow a={[300, 66]} b={[360, 66]} c="text" w={1.2} />
      <T x={330} y={58} a="middle" s={10} c={C.dim}>work along</T>
      <Lead p={[150, y]} t={[120, 70]} text="bedded: flat, locked in" a="middle" c={C.emerald} />
      <Lead p={[390, y - 5]} t={[400, 98]} text="proud" a="middle" c={C.ruby} />
      <Lead p={[100, y + 22]} t={[100, 168]} text="hard, flat surface" a="middle" />
      <Lead p={[256, y - 28]} t={[330, 168]} text="polished hammer face" sub="light, even blows" a="start" />

      <Box x={14} y={190} w={222} h={104} title="before" />
      <rect x={28} y={214} width={194} height={40} fill="url(#sk-top)" />
      {Array.from({ length: 9 }, (_, i) => 36 + i * 21).map((x) => (
        <g key={x}>
          <line x1={x} y1={238} x2={x + 15} y2={230} stroke={C.thread} strokeWidth="2.2" strokeLinecap="round" />
          <line x1={x + 2} y1={236.5} x2={x + 13} y2={230.5} stroke="#ffffff" strokeWidth="0.7" opacity="0.8" />
        </g>
      ))}
      <Verdict x={218} y={208} r={7} />
      <T x={28} y={274} s={10.5} c={C.text}>round and proud: catches, wears</T>

      <Box x={246} y={190} w={222} h={104} title="after" />
      <rect x={260} y={214} width={194} height={40} fill="url(#sk-top)" />
      {Array.from({ length: 9 }, (_, i) => 268 + i * 21).map((x) => (
        <line key={x} x1={x} y1={238} x2={x + 16} y2={230} stroke="#e6dcc6" strokeWidth="3" strokeLinecap="butt" opacity="0.92" />
      ))}
      <Verdict x={450} y={208} ok r={7} />
      <T x={260} y={274} s={10.5} c={C.text}>flat, bedded into the grain</T>
    </Fig>
  )
}

function EdgeCell({ x, y, state }) {
  const ex = x + 26
  const edge = state === 1 ? 'rough' : state >= 4 ? 'round' : 'square'
  return (
    <g>
      <ClipRect x={x - 30} y={y - 6} w={62} h={30}>
        <XSec cx={ex - 35} y={y} w={70} layers={[{ k: 'top', t: 10 }, { k: 'top', t: 8 }]} edge={edge} />
      </ClipRect>
      {state === 2 && <line x1={ex} y1={y} x2={ex} y2={y + 18} stroke="#3a2410" strokeWidth="3" />}
      {state === 3 && (
        <g>
          <line x1={ex} y1={y} x2={ex} y2={y + 18} stroke="#3a2410" strokeWidth="3" />
          <line x1={ex + 1.5} y1={y + 1} x2={ex + 1.5} y2={y + 17} stroke="rgba(200,230,240,0.85)" strokeWidth="1.6" />
        </g>
      )}
      {state >= 4 && <path d={`M${ex - 9} ${y + 0.5} A9 9 0 0 1 ${ex - 9} ${y + 17.5}`} fill="none" stroke="#3a2410" strokeWidth="2.4" opacity={state === 4 ? 0.7 : 0.9} />}
      {state >= 5 && <path d={`M${ex - 4} ${y + 3} A6 6 0 0 1 ${ex - 1} ${y + 9}`} fill="none" stroke="#ffffff" strokeWidth="1.6" opacity="0.85" />}
      {state === 6 && <ellipse cx={ex - 1} cy={y + 9} rx={3} ry={7} fill="rgba(255,240,200,0.25)" />}
    </g>
  )
}

/* 26a · Burnished edges */
function Burnish() {
  const s = 3
  const TL = { x: 44, y: 80, s }
  const o = LONG()
  const pts = outline(o)
  const [bx] = P(TL, 70, 0)
  const cells = [
    ['sand', '600 → 1200'],
    ['colour', 'edge dye'],
    ['gum or', 'Tokonole'],
    ['slicker', 'firm strokes'],
    ['canvas', 'then again'],
    ['wax', 'seals'],
  ]
  return (
    <Fig h={340} view="Plan  ·  the edge, end-on" scale="all-veg-tan strap only">
      <StrapPlan T={TL} o={o} stitch={{ mode: 'stitch', from: 4, m: 3, p: 3 }} />
      <ClipRect x={0} y={20} w={bx} h={120}>
        <path d={pathOf(pts, TL)} fill="none" stroke="#3a2410" strokeWidth="2.8" />
        <path d={pathOf(pts, TL)} fill="none" stroke="#f3d9a8" strokeWidth="0.6" opacity="0.5" />
      </ClipRect>
      <ClipRect x={bx} y={20} w={480 - bx} h={120}>
        <path d={pathOf(pts, TL)} fill="none" stroke="#ead2a4" strokeWidth="1.6" strokeDasharray="1 1.5" />
      </ClipRect>
      <Tl.Slicker x={bx} y={P(TL, 70, half(o, 70))[1] + 1} len={64} k={0.8} ang={180} />
      <Arrow a={[bx - 40, 134]} b={[bx + 40, 134]} both w={1.5} />
      <T x={bx} y={148} a="middle" s={10} c={C.dim}>firm strokes along the edge</T>
      <Lead p={P(TL, 30, -half(o, 30))} t={[80, 34]} text="burnished: dark, glassy" a="start" />
      <Lead p={P(TL, 100, -half(o, 100))} t={[300, 34]} text="sanded, not yet slicked" a="start" />

      <Tag x={14} y={176}>End-on, round by round</Tag>
      <path d="M346 196 C346 178 202 178 202 196" fill="none" stroke={C.brass} strokeWidth="1.4" strokeDasharray="4 3" markerEnd="url(#sk-a-brass)" />
      <T x={274} y={180} a="middle" s={10} c={C.brass}>repeat 2–6 rounds</T>
      {cells.map(([a, b], i) => {
        const x = 50 + i * 74
        return (
          <g key={a}>
            <Num x={x - 26} y={208} n={i + 1} r={7} />
            <EdgeCell x={x} y={222} state={i + 1} />
            <T x={x} y={262} a="middle" s={10.5} c={C.text}>{a}</T>
            <T x={x} y={276} a="middle" s={10} c={C.faint}>{b}</T>
          </g>
        )
      })}
      <Sep x1={14} y1={290} x2={466} y2={290} />
      <T x={14} y={308} s={10.5} c={C.text}>Only when top AND lining are firm veg-tan. This strap’s calf lining takes 26b.</T>
      <T x={14} y={323} s={10} c={C.faint}>Bevelled in step 20 · gum or Tokonole only on the folds · nothing on the horns or fold spine.</T>
    </Fig>
  )
}

/* 26b · Painted edges */
function Paint() {
  const y0 = 92
  const ex = 176
  const b = 7
  const prof = (o) => `M${ex - b - 2} ${y0 - o * 0.7} L${ex + o * 0.4} ${y0 + b - o * 0.3} L${ex + o} ${y0 + b + 1} L${ex + o} ${y0 + 23} L${ex + o * 0.4} ${y0 + 31 + o * 0.3} L${ex - b - 2} ${y0 + 38 + o * 0.7}`
  const TP = { x: 262, y: 120, s: 4.4 }
  const o = LONG()
  const h0 = half(o, 0)
  const sideEdge = (sgn) => {
    const pts = []
    for (let x = 3; x <= 40; x += 1) pts.push(P(TP, x, sgn * half(o, x)))
    return 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L')
  }
  return (
    <Fig h={340} view="End-on ×20  ·  plan of the lug end" scale="calf-lined strap">
      <Box x={14} y={28} w={222} h={206} title="coat by coat" />
      <path d={`M30 ${y0} L${ex - b} ${y0} L${ex} ${y0 + b} L${ex} ${y0 + 16} L30 ${y0 + 16} Z`} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <rect x={30} y={y0 + 16} width={ex - 30} height={4} fill={C.velodon} />
      <path d={`M30 ${y0 + 20} L${ex} ${y0 + 20} L${ex} ${y0 + 30} L${ex - b} ${y0 + 37} L30 ${y0 + 37} Z`} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.8" />
      {[1.5, 4, 6.5].map((o, i) => (
        <path key={i} d={prof(o)} fill="none" stroke={C.paint} strokeWidth="2.4" strokeLinejoin="round" opacity={0.95 - i * 0.12} />
      ))}
      {[2.8, 5.3].map((o, i) => (
        <path key={i} d={prof(o)} fill="none" stroke="#7a5638" strokeWidth="0.5" strokeLinejoin="round" />
      ))}
      <Tl.Applicator x={ex + 9} y={y0 + 22} ang={34} k={0.6} />
      <T x={ex - 4} y={y0 - 16} a="end" s={10} c={C.dim}>coats 1 · 2 · 3</T>
      <T x={30} y={156} s={10.5} c={C.text}>thin coats, one edge at a time,</T>
      <T x={30} y={170} s={10.5} c={C.text}>the piece held upright</T>
      <T x={30} y={188} s={10} c={C.faint}>3–6 coats ≈ 30 min apart,</T>
      <T x={30} y={201} s={10} c={C.faint}>sand 400–600 between coats;</T>
      <T x={30} y={214} s={10} c={C.faint}>small bevel, so nothing cracks</T>

      <Box x={244} y={28} w={224} h={206} title="where it stops" c={C.ruby} tc={C.ruby} />
      <ClipRect x={250} y={52} w={192} h={140}>
        <StrapPlan T={TP} o={o} edge="#d9b07a" stitch={{ mode: 'stitch', from: 4, m: 3, p: 3 }} />
      </ClipRect>
      <path d="M438 66 l5 8 l-5 8 l5 8 l-5 8 l5 8 l-5 8 l5 8 l-5 8 l5 8 l-5 8 l5 8 l-5 8" fill="none" stroke={C.dim} strokeWidth="1" />
      <path d={sideEdge(-1)} fill="none" stroke={C.paint} strokeWidth="3.4" strokeLinecap="round" />
      <path d={sideEdge(1)} fill="none" stroke={C.paint} strokeWidth="3.4" strokeLinecap="round" />
      <line x1={TP.x} y1={TP.y - h0 * TP.s} x2={TP.x} y2={TP.y + h0 * TP.s} stroke={C.ruby} strokeWidth="2" strokeDasharray="3 2" />
      <circle cx={TP.x} cy={TP.y - h0 * TP.s} r="7" fill="none" stroke={C.ruby} strokeWidth="1.3" />
      <circle cx={TP.x} cy={TP.y + h0 * TP.s} r="7" fill="none" stroke={C.ruby} strokeWidth="1.3" />
      <Lead p={[TP.x + 5, TP.y - h0 * TP.s - 5]} t={[300, 60]} text="no paint on the horns" a="start" c={C.ruby} />
      <Lead p={[TP.x, TP.y + 20]} t={[256, 210]} text="none on the fold spine" sub="it rubs off: gum or Tokonole only" a="start" c={C.ruby} />
      <Lead p={P(TP, 26, half(o, 26))} t={[440, 178]} text="painted sides" a="end" />

      {/* the cycle */}
      <Tag x={14} y={256}>The cycle</Tag>
      {[
        ['coat', 22, C.brass],
        ['dry ~30 min', 108, C.dim],
        ['sand 400–600', 212, C.dim],
        ['heat-set', 380, C.emerald],
      ].map(([t, x, c]) => (
        <g key={t}>
          <rect x={x} y={268} width={t.length * 6.2 + 18} height={24} rx="12" fill="rgba(255,255,255,0.03)" stroke={c} />
          <T x={x + (t.length * 6.2 + 18) / 2} y={284} a="middle" s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
      <Arrow a={[68, 280]} b={[104, 280]} c="text" w={1.1} />
      <Arrow a={[188, 280]} b={[208, 280]} c="text" w={1.1} />
      <path d="M262 294 C262 318 44 318 44 296" fill="none" stroke={C.brass} strokeWidth="1.3" strokeDasharray="4 3" markerEnd="url(#sk-a-brass)" />
      <T x={152} y={330} a="middle" s={10} c={C.brass}>repeat: 3–6 coats</T>
      <Arrow a={[306, 280]} b={[374, 280]} c="emerald" w={1.3} />
      <T x={340} y={306} a="middle" s={10} c={C.faint}>iron under 90 °C</T>
    </Fig>
  )
}

/* 27 · Crease after stitching (alternative): stitch → crease → coats */
function Crease2() {
  const s = 3
  const TL = { x: 40, y: 114, s }
  const o = LONG()
  const run = runBetween(offset(outline(o), 1.5), 4)[0]
  const done = partial(run, 0.36)
  const tip = done[done.length - 1]
  const [tx, ty] = P(TL, tip[0], tip[1])
  const a = (-32 * Math.PI) / 180
  const hx = tx + -(-104 * Math.sin(a)) * 0.78
  const hy = ty + -104 * Math.cos(a) * 0.78
  const chip = (x, y, t, c) => (
    <g>
      <rect x={x} y={y} width={t.length * 6 + 16} height={22} rx="11" fill="rgba(255,255,255,0.03)" stroke={c} />
      <T x={x + (t.length * 6 + 16) / 2} y={y + 15} a="middle" s={10.5} c={C.text}>{t}</T>
    </g>
  )
  return (
    <Fig h={322} view="Plan · long piece, stitched, edges bare" scale="alternative order">
      <StrapPlan T={TL} o={o} edge="#d9b07a" stitch={{ mode: 'stitch', from: 4, m: 3, p: 3 }} />
      <path d={pathOf(done, TL, false)} fill="none" stroke="#3e2410" strokeWidth="1.6" />
      <path d={pathOf(done, TL, false)} fill="none" stroke="#e8c48c" strokeWidth="0.6" opacity="0.6" transform="translate(0 1.4)" />
      <path d={`M${hx} ${hy} C${hx - 30} ${hy - 4} 150 30 74 40`} fill="none" stroke="#2b2826" strokeWidth="2.4" />
      <rect x={22} y={28} width={52} height={26} rx="4" fill="#323a42" stroke="#111" />
      <circle cx={36} cy={41} r={6} fill="#1b1f23" stroke={C.brass} strokeWidth="1" />
      <rect x={46} y={36} width={22} height={10} rx="2" fill="#1f2a24" />
      <Tl.Creaser hot x={tx} y={ty} ang={-32} k={0.78} />
      <Arrow a={[tx + 18, ty - 14]} b={[tx + 70, ty - 14]} w={1.6} />
      <T x={84} y={58} s={10.5} c={C.text}>electric fileteuse</T>
      <T x={84} y={72} s={10} c={C.faint}>set heat, steady speed</T>
      <Lead p={P(TL, 30, -half(o, 30) + 1.5)} t={[150, 164]} text="crease between stitches and edge" a="start" />
      <Lead p={P(TL, 70, half(o, 70))} t={[440, 164]} text="edge still bare" a="end" />

      <Box x={14} y={180} w={222} h={136} title="23 · before stitching" />
      <Box x={246} y={180} w={222} h={136} title="27 · after stitching" c={C.brass} tc={C.brass} />
      {[0, 1].map((i) => {
        const x0 = 30 + i * 232
        const ex = x0 + 150
        const y0 = 214
        return (
          <g key={i}>
            <path d={`M${x0} ${y0} L${ex - 50} ${y0} L${ex - 46} ${y0 + 5} L${ex - 42} ${y0} L${ex - 6} ${y0} L${ex} ${y0 + 6} L${ex} ${y0 + 14} L${x0} ${y0 + 14} Z`} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
            <rect x={x0} y={y0 + 14} width={ex - x0} height={2.5} fill={C.velodon} />
            <path d={`M${x0} ${y0 + 16.5} L${ex} ${y0 + 16.5} L${ex} ${y0 + 20} L${ex - 6} ${y0 + 26} L${x0} ${y0 + 26} Z`} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.8" />
            <rect x={ex - 92} y={y0 - 1} width={3} height={28} fill={C.hole} />
            {i === 1 && (
              <g stroke={C.thread} strokeWidth="2" strokeLinecap="round">
                <line x1={ex - 90.5} y1={y0 - 2} x2={ex - 90.5} y2={y0 + 28} />
                <line x1={ex - 112} y1={y0 - 2} x2={ex - 90.5} y2={y0 - 2} />
                <line x1={ex - 112} y1={y0 + 28} x2={ex - 90.5} y2={y0 + 28} />
              </g>
            )}
          </g>
        )
      })}
      <T x={30} y={260} s={10.5} c={C.text}>hand creaser over a lamp,</T>
      <T x={30} y={274} s={10.5} c={C.text}>into bare, pricked leather</T>
      <T x={30} y={290} s={10} c={C.faint}>then stitch, then the edges</T>
      <T x={30} y={304} s={10} c={C.faint}>Instructables Luxury</T>
      {chip(258, 252, 'stitch', C.dim)}
      <Arrow a={[310, 263]} b={[322, 263]} c="text" w={1.1} />
      {chip(326, 252, 'crease', C.brass)}
      <Arrow a={[384, 263]} b={[396, 263]} c="text" w={1.1} />
      {chip(400, 252, 'coats', C.dim)}
      <T x={258} y={292} s={10.5} c={C.text}>crease beside the stitches,</T>
      <T x={258} y={306} s={10} c={C.faint}>before the edge paint (Artisan)</T>
    </Fig>
  )
}

/* 28 · Punch the holes */
function Holes() {
  const s = 3.2
  const TL = { x: 40, y: 82, s }
  const o = LONG()
  const hx = holeXs(120)
  const py = 270
  return (
    <Fig h={336} view="Plan · long piece  ·  side view · punch" scale="7 × Ø 1.5–2 mm">
      <StrapPlan T={TL} o={o} edge={C.paint} stitch={{ mode: 'stitch', from: 4, m: 3, p: 3 }} holes={{}} centre />
      <Dim a={P(TL, hx[0], half(o, hx[0]))} b={P(TL, 120, half(o, 100))} off={12} text="25" flip />
      <Dim a={P(TL, hx[2], -half(o, hx[2]))} b={P(TL, hx[1], -half(o, hx[1]))} off={-12} text="7" flip />
      <Dim a={P(TL, hx[3], -half(o, hx[3]))} b={P(TL, hx[2], -half(o, hx[2]))} off={-12} text="7" flip />
      <Lead p={P(TL, hx[6], 0)} t={[150, 132]} text="7 holes on the centreline" sub="6–7 mm pitch" a="end" />
      <Lead p={P(TL, hx[4], 0)} t={[254, 140]} text="Ø 1.5–2 mm, ≥ the tongue" a="start" />

      <Box x={14} y={160} w={244} h={172} title="cutting punch, on a pad" />
      <Tl.Slab x={26} y={py + 17} w={220} h={14} kind="pad" />
      <rect x={34} y={py} width={204} height={9} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />
      <rect x={34} y={py + 9} width={204} height={2} fill={C.velodon} />
      <rect x={34} y={py + 11} width={204} height={6} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.6" />
      {[70, 98].map((x) => (
        <rect key={x} x={x - 7} y={py - 0.5} width={14} height={18} fill={C.ground} />
      ))}
      <Tl.Punch kind="round" d={14} x={154} y={py} />
      <Tl.Mallet x={154} y={py - 66} k={0.55} />
      <Dim a={[147, py + 36]} b={[161, py + 36]} text="" />
      <T x={170} y={py + 40} s={10} mono>Ø</T>
      <T x={30} y={324} s={10} c={C.faint}>pitch from a template — freehand drifts</T>

      <Box x={266} y={160} w={202} h={172} title="check the tongue" c={C.emerald} tc={C.emerald} />
      <rect x={278} y={196} width={178} height={86} rx="2" fill="url(#sk-top)" />
      <line x1={278} y1={239} x2={456} y2={239} stroke={C.steel} strokeWidth="0.8" strokeDasharray="10 3 2 3" />
      <circle cx={340} cy={239} r={13} fill={C.hole} stroke="#e7c48f" strokeWidth="1" />
      <circle cx={404} cy={239} r={13} fill={C.hole} stroke="#e7c48f" strokeWidth="1" />
      <path d="M392 233 L452 233 L452 245 L392 245 Q386 239 392 233 Z" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
      <T x={278} y={302} s={10.5} c={C.text}>tongue drops in and seats</T>
      <T x={278} y={316} s={10} c={C.faint}>last hole ~25 mm from the tip</T>
    </Fig>
  )
}

/* 29 · The floating keeper */
function Floater() {
  const k = 5
  return (
    <Fig h={340} view="Plan  ·  section across both pieces" scale="keeper 5 × 1.2 mm">
      <Box x={14} y={28} w={232} h={140} title="1 · size it, finish it" />
      <rect x={28} y={66} width={46 * 4.4} height={5 * 4.4} rx="1" fill="url(#sk-top)" stroke={C.paint} strokeWidth="2" />
      <Dim a={[28, 88]} b={[28 + 46 * 4.4, 88]} off={10} text="≈ 46" flip />
      <Dim a={[28 + 46 * 4.4, 66]} b={[28 + 46 * 4.4, 88]} off={-10} text="5" flip />
      <T x={28} y={124} s={10.5} c={C.text}>L = 4t + 2w ≈ 4×2.0 + 2×18.8</T>
      <T x={28} y={139} s={10} c={C.faint}>butt-sewn rule · a little longer</T>
      <T x={28} y={152} s={10} c={C.faint}>than the fixed keeper, so it slides</T>
      <T x={28} y={59} s={10} c={C.dim}>edges finished before it is closed</T>

      <Box x={254} y={28} w={214} h={204} title="2 · close it round both" c={C.brass} tc={C.brass} />
      {(() => {
        const cx = 360
        const w = 18.8 * k
        const t = 2.0 * 7
        const y1 = 100
        const y2 = y1 + t + 1
        const top = y1 - 5
        const bot = y2 + t + 5
        const L = cx - w / 2 - 5
        const R = cx + w / 2 + 5
        return (
          <g>
            <XSec cx={cx} y={y1} w={w} layers={[{ k: 'top', t: 8 }, { k: 'velodon', t: 1.5 }, { k: 'lining', t: 4.5 }]} edge="paint" b={2.5} coat={2} />
            <XSec cx={cx} y={y2} w={w} layers={[{ k: 'top', t: 8 }, { k: 'velodon', t: 1.5 }, { k: 'lining', t: 4.5 }]} edge="paint" b={2.5} coat={2} />
            <path d={`M${cx - 3} ${bot} L${L + 6} ${bot} Q${L} ${bot} ${L} ${bot - 6} L${L} ${top + 6} Q${L} ${top} ${L + 6} ${top} L${R - 6} ${top} Q${R} ${top} ${R} ${top + 6} L${R} ${bot - 6} Q${R} ${bot} ${R - 6} ${bot} L${cx + 3} ${bot}`} fill="none" stroke="#8c5f30" strokeWidth="6" />
            <path d={`M${cx - 3} ${bot} L${L + 6} ${bot} Q${L} ${bot} ${L} ${bot - 6} L${L} ${top + 6} Q${L} ${top} ${L + 6} ${top} L${R - 6} ${top} Q${R} ${top} ${R} ${top + 6} L${R} ${bot - 6} Q${R} ${bot} ${R - 6} ${bot} L${cx + 3} ${bot}`} fill="none" stroke={C.paint} strokeWidth="0.8" transform="translate(0 0)" />
            <path d={`M${cx - 7} ${bot - 4} L${cx + 7} ${bot + 4} M${cx - 7} ${bot + 4} L${cx + 7} ${bot - 4}`} stroke={C.thread} strokeWidth="1.6" />
            <T x={cx} y={y1 + 10} a="middle" s={10} c="#5c3c1d">long piece</T>
            <T x={cx} y={y2 + 10} a="middle" s={10} c="#5c3c1d">short piece</T>
            <Lead p={[cx, bot + 3]} t={[cx, 186]} text="butt joint, sewn edge to edge" sub="underneath, out of sight" a="middle" />
            <Lead p={[R + 2, top + 18]} t={[456, 62]} text="keeper" a="end" />
          </g>
        )
      })()}
      <T x={264} y={226} s={10} c={C.faint}>close it on two strap offcuts</T>

      <Box x={14} y={176} w={232} h={160} title="3 · on the short piece" />
      {(() => {
        const TS = { x: 22, y: 270, s: 2.4 }
        const o = SHORT()
        return (
          <g>
            <StrapPlan T={TS} o={o} edge={C.paint} stitch={{ mode: 'stitch', from: 4, to: 76, m: 3, p: 3 }} keepers={[{ x: 70 }, { x: 52, float: true }]} />
            <Buckle x={P(TS, 80, 0)[0] + 2} y={TS.y} w={18 * 2.4} L={30} />
            <Arrow a={P(TS, 46, -15)} b={P(TS, 30, -15)} both w={1.4} />
            <Lead p={P(TS, 52, 10)} t={[96, 324]} text="floating: slides" a="middle" />
            <Lead p={P(TS, 70, 10)} t={[186, 324]} text="fixed: snug" a="middle" />
          </g>
        )
      })()}
      <Box x={254} y={240} w={214} h={96} title="other closures" />
      <T x={264} y={274} s={10.5} c={C.text}>butt-sewn (Decocuir)</T>
      <T x={264} y={290} s={10.5} c={C.dim}>glued + 3 stitch holes</T>
      <T x={264} y={306} s={10.5} c={C.dim}>glued + riveted</T>
      <T x={264} y={324} s={10} c={C.faint}>finish the edges first, always</T>
    </Fig>
  )
}

/* 30 · Fit the hardware */
function Hardware() {
  const s = 2.6
  const TL = { x: 74, y: 92, s }
  const TS = { x: 30, y: 262, s }
  const o = LONG()
  const h = half(o, 0)
  const bxp = P(TS, 80, 0)[0] + 2
  return (
    <Fig h={340} view="Plan · fit the bars" scale="spring bars Ø 1.8">
      <Box x={14} y={28} w={454} h={130} title="1 · spring bars through the lug folds" />
      <SpringBar x={TL.x - 2} y1={TL.y - h * s - 6} y2={TL.y + h * s + 6} r={2.6} />
      <StrapPlan T={TL} o={o} edge={C.paint} stitch={{ mode: 'stitch', from: 4, m: 3, p: 3 }} holes={{}} />
      <Arrow a={[TL.x - 18, TL.y - 26]} b={[TL.x - 18, TL.y + 26]} w={1.4} />
      <Lead p={[TL.x - 2, TL.y + h * s + 10]} t={[120, 150]} text="pins proud equally, both sides" a="start" />
      <Lead p={[TL.x + 2, TL.y]} t={[300, 54]} text="bar slides freely in the channel" a="start" />

      <Box x={14} y={166} w={296} h={170} title="2 · buckle: only on a removable bar" />
      <StrapPlan T={TS} o={SHORT()} edge={C.paint} stitch={{ mode: 'stitch', from: 4, to: 76, m: 3, p: 3 }} keepers={[{ x: 70 }, { x: 52, float: true }]} />
      <SpringBar x={TS.x - 2} y1={TS.y - h * s - 6} y2={TS.y + h * s + 6} r={2.6} />
      <Buckle x={bxp} y={TS.y} w={18 * s} L={40} />
      <SpringBar x={bxp} y1={TS.y - 9 * s - 14} y2={TS.y + 9 * s - 2} r={1.8} />
      <Arrow a={[bxp + 52, TS.y - 30]} b={[bxp + 52, TS.y + 10]} w={1.3} />
      <Lead p={[bxp, TS.y - 9 * s - 14]} t={[300, 196]} text="removable bar: fit it now" a="end" />
      <Lead p={[bxp - 10, TS.y + 22]} t={[300, 318]} text="fixed bar: in the fold since 19" a="end" />
      <T x={24} y={322} s={10} c={C.faint}>keepers on, both bars in</T>

      <Box x={318} y={166} w={150} h={170} title="QR bar: notch first" c={C.brass} tc={C.brass} />
      {(() => {
        const x0 = 336
        const yc = 236
        return (
          <g>
            <rect x={x0} y={yc - 36} width={116} height={72} rx="2" fill="url(#sk-lin)" stroke={C.paint} strokeWidth="2" />
            <rect x={x0 - 2} y={yc + 10} width={7} height={22} rx="3" fill={C.ground} stroke="#c9b48d" />
            <Dim a={[x0 + 5, yc + 10]} b={[x0 + 5, yc + 32]} off={-10} text="" />
            <T x={x0 + 22} y={yc + 25} s={10} mono c="#5c4a2a">≈ 1 × 5</T>
            <T x={x0 + 58} y={yc - 18} a="middle" s={10} c="#6e5a3a">lining side</T>
          </g>
        )
      })()}
      <T x={326} y={294} s={10} c={C.text}>mark the knob, then</T>
      <T x={326} y={307} s={10} c={C.text}>notch plier (Bergeon</T>
      <T x={326} y={320} s={10} c={C.text}>31227); seal the cut</T>
    </Fig>
  )
}

/* 31 · Condition */
function Condition() {
  const s = 3
  const TL = { x: 44, y: 80, s }
  const TS = { x: 44, y: 206, s }
  const o = LONG()
  const [mx] = P(TL, 64, 0)
  return (
    <Fig h={330} view="Plan · grain side and lining side" scale="a light coat">
      <ClDefs />
      <StrapPlan T={TL} o={o} edge={C.paint} stitch={{ mode: 'stitch', from: 4, m: 3, p: 3 }} holes={{}} />
      <ClipTo T={TL} o={o}>
        <rect x={40} y={40} width={mx - 40} height={80} fill="url(#cl-sheen)" />
        <rect x={40} y={40} width={mx - 40} height={80} fill="rgba(90,50,20,0.10)" />
      </ClipTo>
      <Tl.Dauber x={mx} y={84} ang={25} c="#d8c27a" k={0.6} />
      <path d="M30 26 q6 9 0 14 q-6 -5 0 -14 Z" fill="#d8c27a" stroke="#8a7a3a" />
      <T x={40} y={38} s={10.5} c={C.text}>neatsfoot oil, a light coat — work it in, wipe off the excess</T>
      <Lead p={P(TL, 30, 4)} t={[120, 140]} text="conditioned" a="middle" />
      <Lead p={P(TL, 100, 4)} t={[340, 140]} text="not yet" a="middle" />

      <StrapPlan T={TS} o={SHORT()} face="lining" edge={C.paint} stitch={{ mode: 'stitch', from: 4, to: 76, m: 3, p: 3 }} />
      <ClipTo T={TS} o={SHORT()}>
        <rect x={40} y={170} width={260} height={70} fill="url(#cl-sheen)" />
      </ClipTo>
      <Lead p={P(TS, 40, -6)} t={[120, 166]} text="optional Tokonole on the lining" a="start" />
      <T x={44} y={256} s={10} c={C.faint}>short piece, lining side up</T>

      <Box x={300} y={160} w={168} h={164} title="how deep" />
      <rect x={314} y={200} width={60} height={13} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />
      <rect x={314} y={200} width={60} height={3} fill="rgba(70,40,15,0.45)" />
      <rect x={314} y={213} width={60} height={8} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.6" />
      <Verdict x={344} y={236} ok r={7} />
      <T x={344} y={258} a="middle" s={10} c={C.text}>skin-deep</T>
      <rect x={392} y={200} width={60} height={13} fill="#5a3a1c" stroke="#2e1e10" strokeWidth="0.6" />
      <rect x={392} y={213} width={60} height={8} fill="#a89a7c" stroke="#8f7b5a" strokeWidth="0.6" />
      <Verdict x={422} y={236} r={7} />
      <T x={422} y={258} a="middle" s={10} c={C.text}>soaked</T>
      <T x={312} y={286} s={10} c={C.faint}>Avoid over-conditioning;</T>
      <T x={312} y={300} s={10} c={C.faint}>never heat-dry. A cream</T>
      <T x={312} y={314} s={10} c={C.faint}>does the same job.</T>
      <T x={44} y={290} s={10.5} c={C.text}>Conditioners are not sealers:</T>
      <T x={44} y={304} s={10.5} c={C.text}>the step-8 seal still protects the dye.</T>
    </Fig>
  )
}

/* 32 · Quality control */
function QC() {
  const s = 2.7
  const TL = { x: 64, y: 74, s }
  const TS = { x: 64, y: 166, s }
  const o = LONG()
  const h = half(o, 0)
  const hx = holeXs(120)
  const items = [
    'width: gap to 0.2 under, at the lug',
    'lengths 120 / 80',
    'passes between bar and case',
    'bar slides; holes ≤ 0.5 mm',
    'even slant; 1 bad in 60 → redo',
    'no fuzz; nothing on horns/spine',
    'holes centred, last 25 from tip',
    'fixed snug · floating slides',
    'lies in a curve, no wrinkles',
    'damp white-cloth rub: clean',
  ]
  const disc = (x, y, n) => <Num key={n} x={x} y={y} n={n} r={7.5} />
  return (
    <Fig h={340} view="Plan · the finished pair" scale="the ten checks">
      <StrapPlan T={TL} o={o} edge={C.paint} stitch={{ mode: 'stitch', from: 4, m: 3, p: 3 }} holes={{}} />
      <SpringBar x={TL.x - 2} y1={TL.y - h * s - 6} y2={TL.y + h * s + 6} r={2.4} />
      <StrapPlan T={TS} o={SHORT()} edge={C.paint} stitch={{ mode: 'stitch', from: 4, to: 76, m: 3, p: 3 }} keepers={[{ x: 70 }, { x: 52, float: true }]} />
      <SpringBar x={TS.x - 2} y1={TS.y - h * s - 6} y2={TS.y + h * s + 6} r={2.4} />
      <Buckle x={P(TS, 80, 0)[0] + 2} y={TS.y} w={18 * s} L={42} />
      {disc(TL.x + 14, TL.y - h * s - 12, 1)}
      {disc(P(TL, 60, 0)[0], TL.y - h * s - 14, 2)}
      {disc(TS.x - 22, TS.y, 3)}
      {disc(TL.x - 22, TL.y, 4)}
      {disc(P(TL, 34, 0)[0], TL.y + h * s + 12, 5)}
      {disc(P(TS, 30, 0)[0], TS.y + h * s + 12, 6)}
      {disc(P(TL, hx[3], 0)[0], TL.y + h * s + 12, 7)}
      {disc(P(TS, 61, 0)[0], TS.y - h * s - 14, 8)}
      {disc(P(TL, 112, 0)[0] + 24, TL.y - 24, 9)}
      {disc(P(TS, 22, 0)[0], TS.y, 10)}

      <Sep x1={14} y1={214} x2={466} y2={214} />
      {items.map((t, i) => {
        const col = i < 5 ? 0 : 1
        const row = i % 5
        const x = 22 + col * 230
        const y = 236 + row * 20
        return (
          <g key={t}>
            <Num x={x + 8} y={y - 4} n={i + 1} r={7.5} />
            <T x={x + 22} y={y} s={10.5} c={C.text}>{t}</T>
          </g>
        )
      })}
    </Fig>
  )
}

/* The documented variations: a sequence chart */
function Variants() {
  const cols = [
    ['Reference', 'this build', ['cut', 'skive', 'reinforce', 'slot', 'glue lining', 'trim', 'mark + prick', 'stitch', 'edges', 'holes, keepers'], []],
    ['Edges first', 'Danne, Strapcode', ['cut', 'skive', 'reinforce', 'slot', 'glue lining', 'trim', 'edges', 'mark + prick', 'stitch', 'holes, keepers'], [6]],
    ['Trim after', 'forum makers', ['cut 2 mm over', 'skive', 'reinforce', 'slot', 'glue lining', 'mark + prick', 'stitch', 'trim', 'edges', 'holes, keepers'], [0, 7]],
    ['Late hardware', 'Delugs', ['cut', 'skive', 'reinforce', 'glue lining', 'trim', 'mark + prick', 'stitch', 'edges', 'holes', 'slot + QR notch'], [8, 9]],
    ['Lining last', 'Mu:n factory', ['cut', 'skive', 'reinforce', 'slot', 'mark + prick', 'stitch', 'glue lining', 'trim', 'edges', 'holes, keepers'], [6]],
  ]
  const cw = 88
  const gap = 3.5
  return (
    <Fig h={340} view="Sequence chart · the core order" scale="moved steps in brass">
      {cols.map(([h, sub, ops, moved], c) => {
        const x = 14 + c * (cw + gap)
        const ref = c === 0
        return (
          <g key={h}>
            <T x={x + cw / 2} y={44} a="middle" s={11.5} c={ref ? C.emerald : C.text} w="600">{h}</T>
            <T x={x + cw / 2} y={58} a="middle" s={10} c={C.faint}>{sub}</T>
            {ops.map((op, r) => {
              const y = 70 + r * 22
              const mv = moved.includes(r)
              return (
                <g key={op + r}>
                  <rect x={x} y={y} width={cw} height={18} rx="4" fill={mv ? 'rgba(208,168,79,0.22)' : ref ? 'rgba(123,165,131,0.10)' : 'rgba(255,255,255,0.03)'} stroke={mv ? C.brass : ref ? C.emerald : C.line} strokeWidth={mv ? 1.2 : 0.9} />
                  <T x={x + cw / 2} y={y + 12.5} a="middle" s={10} c={mv ? C.brassHi : C.dim}>{op}</T>
                </g>
              )
            })}
          </g>
        )
      })}
      {Array.from({ length: 10 }, (_, r) => (
        <T key={r} x={10} y={82 + r * 22} a="end" s={9} c={C.faint} mono>{r + 1}</T>
      ))}
      <Sep x1={14} y1={296} x2={466} y2={296} />
      <T x={14} y={313} s={10} c={C.text}>Alignment tricks: cut the lining a little narrower and register it with needles through the holes,</T>
      <T x={14} y={327} s={10} c={C.text}>or let a thin lining wrap slightly over the edge. Holes come after the edges in every order.</T>
    </Fig>
  )
}

function Pin({ p, d, n, c = C.brass }) {
  return (
    <g>
      <line x1={p[0]} y1={p[1]} x2={d[0]} y2={d[1]} stroke={C.struct} strokeWidth="0.8" />
      <circle cx={p[0]} cy={p[1]} r="2" fill={C.text} />
      <Num x={d[0]} y={d[1]} n={n} r={6.5} c={c} />
    </g>
  )
}

function OpenTop({ x, y, s, k, bend = 12, a = -20, b = 105, buckleAt = 80 }) {
  const fx2 = x + buckleAt * s
  const pivotY = y + 1.1 * k
  const yTop = y - 30
  const H = 1.1 * k + 60
  return (
    <g>
      <ClipRect x={x} y={yTop} w={fx2 - x} h={H}>
        <SkivedTop x={x} y={y} s={s} k={k} a={a} b={b} />
      </ClipRect>
      <g transform={`rotate(${-bend} ${x} ${pivotY})`}>
        <ClipRect x={x + a * s - 4} y={yTop} w={-a * s + 4} h={H}>
          <SkivedTop x={x} y={y} s={s} k={k} a={a} b={b} />
        </ClipRect>
      </g>
      <g transform={`rotate(${bend} ${fx2} ${pivotY})`}>
        <ClipRect x={fx2} y={yTop} w={(b - buckleAt) * s + 4} h={H}>
          <SkivedTop x={x} y={y} s={s} k={k} a={a} b={b} />
        </ClipRect>
      </g>
    </g>
  )
}

export const FIGS = {
  'c-specify': Specify,
  'c-draft': Draft,
  'c-sharpen': Sharpen,
  'c-select': Select,
  'c-rough': Rough,
  'c-lining': Linings,
  'c-split': Split,
  'c-dye': Dye,
  'c-skive-flaps': SkiveFlaps,
  'c-skive-linings': SkiveLinings,
  'c-reinforce': Reinforce,
  'c-emboss': Emboss,
  'c-slot': SlotPunch,
  'c-folds': Folds,
  'c-stops': Stops,
  'c-glue': Glue,
  'c-lay': Lay,
  'c-cure': Cure,
  'c-final': FinalCut,
  'c-bevel': Bevel,
  'c-mark': Mark,
  'c-prick': Prick,
  'c-crease': Crease,
  'c-stitch': Stitch,
  'c-set': SetSeam,
  'c-burnish': Burnish,
  'c-paint': Paint,
  'c-crease2': Crease2,
  'c-holes': Holes,
  'c-floater': Floater,
  'c-hardware': Hardware,
  'c-condition': Condition,
  'c-qc': QC,
  'c-variants': Variants,
}
