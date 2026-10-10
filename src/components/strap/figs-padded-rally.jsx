// Strap diagrams — padded (bombé) strap and rally strap. See AUTHORING.md.
//
// Local helpers (the shared StrapSection / XSec are flat-only):
//   domeG / DomeX  — transverse section of a padded strap: a filler domed
//                    across (kamaboko), the top laid over it at constant
//                    thickness, flat flanges either side, lining under.
//   padG / PadLong — longitudinal section along the centreline: the filler
//                    tapered along (thick at the lug → feathered), with the
//                    lug fold, buckle fold, holes and fixed keeper.
//   Cap            — a callout whose leader meets the near edge of its text
//                    block, so leaders never run through the words.
import { useId } from 'react'
import { C, FONT, Fig, T, Note, Lead, Dim, Arrow, Num, Verdict, Tag, Sep, Legend } from './kit.jsx'
import { StrapPlan, Ply, Wrap, BarEnd, GlueLine, NoGlue, Buckle, SpringBar } from './parts.jsx'
import { StrapSection, BuckleSide } from './sections.jsx'
import { LONG, SHORT, holeXs, outline, pathOf, widthAt, px } from './geom.js'
import { Knife, Rule, Hammer, Mallet, Needle, Punch, Dividers, BoneFolder, Slab, Applicator } from './tools.jsx'

/* ------------------------------------------------------------------ */
/* Small utilities                                                     */
/* ------------------------------------------------------------------ */
const useUid = () => 'pr' + useId().replace(/[^a-zA-Z0-9]/g, '')
const r1 = (v) => Math.round(v * 10) / 10
const poly = (pts, close = true) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${r1(x)} ${r1(y)}`).join(' ') + (close ? ' Z' : '')
const range = (a, b, n) => Array.from({ length: n + 1 }, (_, i) => a + ((b - a) * i) / n)

const TOPF = '#bb8d57' // top leather, cut face
const GRAIN = '#6f4521' // grain surface line
const EDGE = '#4a3018'
const LINE = '#8f7b5a'
const SKIN = 'rgba(214,170,140,0.34)'

// Height of a layer of thickness t laid over a bump h(x): the bump dilated
// by a disc of radius t, so the layer keeps its thickness on the slopes.
// Works in whatever unit h and t share (mm here, so exaggerated sections
// stay true to the real geometry before they are scaled).
function dilate(h, t, x, n = 14) {
  let m = t
  for (let i = -n; i <= n; i++) {
    const d = (i / n) * t
    const v = h(x + d) + Math.sqrt(Math.max(0, t * t - d * d))
    if (v > m) m = v
  }
  return m
}
// Filler profiles across the width, u = −1…1 → height 0…1
const kama = (u) => {
  const a = Math.abs(u)
  return a >= 1 ? 0 : Math.pow(1 - Math.pow(a, 2.2), 0.75) // bevelled dome (kamaboko)
}
const fullP = (u) => {
  const a = Math.abs(u)
  return a >= 1 ? 0 : Math.pow(1 - Math.pow(a, 4), 0.42) // flat-ish crown, rounded shoulders
}
const squareP = (u) => {
  const a = Math.abs(u)
  return a >= 1 ? 0 : Math.pow(1 - Math.pow(a, 14), 0.2) // flat top, square shoulders
}

// Callout: dot on the feature, leader to the nearest edge (top or bottom)
// of the text block. (x, y) = first baseline; a = text anchor.
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
const VDim = ({ x, y1, y2, c = C.dim }) => (
  <line x1={x} y1={y1} x2={x} y2={y2} stroke={c} strokeWidth="0.85" markerStart="url(#sk-a-dim)" markerEnd="url(#sk-a-dim)" />
)

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
// zone rectangle (mm) clipped to a piece outline
function Zone({ T: Tr, o, from, to, half = 15, kind = 'keep' }) {
  const id = useUid()
  const clear = kind === 'clear'
  return (
    <g>
      <clipPath id={id}>
        <path d={pathOf(outline(o), Tr)} />
      </clipPath>
      <rect
        clipPath={`url(#${id})`}
        x={Tr.x + from * Tr.s}
        y={Tr.y - half * Tr.s}
        width={(to - from) * Tr.s}
        height={2 * half * Tr.s}
        rx="3"
        fill={clear ? 'rgba(123,165,131,0.26)' : 'rgba(194,88,99,0.24)'}
        stroke={clear ? C.emerald : C.ruby}
        strokeWidth="1"
        strokeDasharray="4 3"
      />
    </g>
  )
}
// Zoom marker + connector lines to a detail circle
function ZoomLink({ from, r = 9, to, R }) {
  const ang = Math.atan2(to[1] - from[1], to[0] - from[0])
  const n = [-Math.sin(ang), Math.cos(ang)]
  const a1 = [from[0] + n[0] * r, from[1] + n[1] * r]
  const a2 = [from[0] - n[0] * r, from[1] - n[1] * r]
  const b1 = [to[0] + n[0] * R, to[1] + n[1] * R]
  const b2 = [to[0] - n[0] * R, to[1] - n[1] * R]
  return (
    <g stroke={C.brass} strokeWidth="0.8" fill="none" opacity="0.75">
      <circle cx={from[0]} cy={from[1]} r={r} strokeWidth="1.2" />
      <line x1={a1[0]} y1={a1[1]} x2={b1[0]} y2={b1[1]} strokeDasharray="3 3" />
      <line x1={a2[0]} y1={a2[1]} x2={b2[0]} y2={b2[1]} strokeDasharray="3 3" />
    </g>
  )
}
const Brk = ({ x, y1, y2 }) => {
  const h = y2 - y1
  return <path d={`M${x} ${y1} l5 ${h * 0.3} l-10 ${h * 0.4} l5 ${h * 0.3}`} fill="none" stroke={C.dim} strokeWidth="1" />
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

/* ------------------------------------------------------------------ */
/* Transverse (across-the-width) section of a padded strap             */
/* ------------------------------------------------------------------ */
// mm in, px out: s = px/mm across, k = px/mm in thickness.
// yb = the flat interface (top of the lining). inset = filler inset per side.
function domeG({ cx, yb, s, k = s, w = 20, inset = 4, fw, fh = 2.2, top = 1.2, lin = 0.8, shift = 0, prof = kama, n = 160 }) {
  const W = w * s
  const x1 = cx - W / 2
  const x2 = cx + W / 2
  const FWm = fw ?? w - 2 * inset
  const FW = FWm * s
  const fc = cx + shift * s
  const hm = (xm) => (fh ? fh * prof((xm - shift) / (FWm / 2)) : 0) // mm, xm from cx
  const hf = (x) => k * hm((x - cx) / s)
  const hu = (x) => k * dilate(hm, top, (x - cx) / s)
  const tt = top * k
  const lt = lin * k
  const xs = range(x1, x2, n)
  return {
    cx, yb, s, k, x1, x2, W, FW, fc, tt, lt, hf, hu, xs,
    f1: fc - FW / 2,
    f2: fc + FW / 2,
    yUp: (x) => yb - hu(x),
    yLo: (x) => yb - hf(x),
    yBot: yb + lt,
    crest: yb - hu(fc),
  }
}
function EdgePaint({ g, coat = 2.6 }) {
  const { x1, x2, yb, lt } = g
  const yt = g.yUp(x1)
  return (
    <g fill="none" stroke={C.paint} strokeWidth={coat} strokeLinejoin="round" strokeLinecap="round">
      <path d={`M${x1 + 2.6} ${yt - 0.8} L${x1 - 1} ${yt + 1.6} L${x1 - 1} ${yb + lt - 1.6} L${x1 + 2.6} ${yb + lt + 0.8}`} />
      <path d={`M${x2 - 2.6} ${yt - 0.8} L${x2 + 1} ${yt + 1.6} L${x2 + 1} ${yb + lt - 1.6} L${x2 - 2.6} ${yb + lt + 0.8}`} />
    </g>
  )
}
function DomeX({ g, filler = true, lining = true, top = true, vel, stitch, paint, op }) {
  const { x1, x2, xs, yb, lt } = g
  const up = xs.map((x) => [x, g.yUp(x)])
  const lo = xs.map((x) => [x, g.yLo(x)])
  const fxs = xs.filter((x) => x > g.f1 && x < g.f2)
  const threads = stitch ? (stitch.sides ?? 'lr').split('').map((sd) => (sd === 'l' ? x1 + stitch.m * g.s : x2 - stitch.m * g.s)) : []
  return (
    <g opacity={op}>
      {lining && <rect x={x1} y={yb} width={x2 - x1} height={lt} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" />}
      {vel != null && <line x1={x1 + vel * g.s} y1={yb + 1.1} x2={x2 - vel * g.s} y2={yb + 1.1} stroke={C.velodon} strokeWidth="2.2" />}
      {filler && g.hf(g.fc) > 0 && (
        <path d={poly([[g.f1, yb], ...fxs.map((x) => [x, g.yLo(x)]), [g.f2, yb]])} fill="url(#sk-fill)" stroke="#3a2716" strokeWidth="0.8" />
      )}
      {top && <TopShape up={up} lo={lo} />}
      {paint && <EdgePaint g={g} />}
      {threads.map((x, i) => (
        <SecThread key={i} x={x} y1={g.yUp(x)} y2={yb + lt} />
      ))}
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* Longitudinal section of a padded piece                              */
/* ------------------------------------------------------------------ */
function fillerMM(f, xm) {
  const { from, to, h, ramp = 3, flat } = f
  if (xm <= from || xm >= to) return 0
  const a = from + ramp
  if (xm < a) {
    const u = (a - xm) / ramp
    return h * Math.sqrt(Math.max(0, 1 - u * u))
  }
  if (flat) {
    const b = to - ramp
    if (xm > b) {
      const u = (xm - b) / ramp
      return h * Math.sqrt(Math.max(0, 1 - u * u))
    }
    return h
  }
  return h * Math.pow((to - xm) / (to - a), 0.9)
}
// ox = px of the lug fold (bar centre); y = px of the top/lining interface.
function padG({ ox, y, s, k, len, top = 1.2, lin = 0.8, fillers = [], bar = 0.9, buckleBar = 1.1, right = 'tip', tailEnd = 10, buckleTail = 14 }) {
  const X = (mm) => ox + mm * s
  const tt = top * k
  const lt = lin * k
  const r = bar * k
  const rb = buckleBar * k
  const xe = X(len)
  const fm = (xm) => {
    let m = 0
    for (const f of fillers) m = Math.max(m, fillerMM(f, xm))
    return m
  }
  const hf = (x) => k * fm((x - ox) / s)
  const hu = (x) => k * dilate(fm, top, (x - ox) / s)
  const cvL = r * 2.6
  const tailL = { a: ox + cvL, b: X(tailEnd), t: tt * 0.45 }
  const cvR = rb * 2.4
  const tailR = right === 'buckle' ? { a: X(len - buckleTail), b: xe - cvR, t: tt * 0.45 } : null
  const tailT = (x) => {
    let t = 0
    if (x >= tailL.a && x <= tailL.b) t = Math.max(t, tailL.t * (1 - (x - tailL.a) / (tailL.b - tailL.a)))
    if (tailR && x >= tailR.a && x <= tailR.b) t = Math.max(t, tailR.t * ((x - tailR.a) / (tailR.b - tailR.a)))
    return t
  }
  return {
    X, ox, y, s, k, tt, lt, r, rb, xe, cvL, cvR, tailL, tailR, tailT, hf, hu, fillers, right,
    yTop: (x) => y - hu(x),
    yFill: (x) => y - hf(x),
    yLin: (x) => y + tailT(x),
  }
}
function PadLong({ g, left = 'bar', holes = [], keeper, lining = true, noBar }) {
  const { X, ox, y, s, tt, lt, r, rb, xe, cvL, cvR, tailL, tailR, tailT, right } = g
  const xs = range(ox, xe, Math.max(120, Math.round((xe - ox) / 1.2)))
  const els = []
  if (lining) {
    const la = left === 'bar' ? tailL.a + 1 : ox
    const lb = tailR ? tailR.b - 1 : xe
    const fe = 10 * s
    const top = range(la, lb, 90).map((x) => [x, y + tailT(x)])
    const th = (x) => {
      let t = lt
      if (left === 'bar') t = Math.min(t, lt * (0.25 + (0.75 * (x - la)) / fe))
      if (tailR) t = Math.min(t, lt * (0.25 + (0.75 * (lb - x)) / fe))
      return Math.max(lt * 0.25, t)
    }
    const bot = top.map(([x, yy]) => [x, yy + th(x)]).reverse()
    els.push(<path key="lin" d={poly([...top, ...bot])} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" strokeLinejoin="round" />)
  }
  g.fillers.forEach((f, i) => {
    const a = X(f.from)
    const b = Math.min(X(f.to), xe)
    const fx = range(a, b, 80)
    els.push(<path key={'f' + i} d={poly([[a, y], ...fx.map((x) => [x, g.yFill(x)]), [b, y]])} fill="url(#sk-fill)" stroke="#3a2716" strokeWidth="0.8" />)
  })
  els.push(<TopShape key="top" up={xs.map((x) => [x, g.yTop(x)])} lo={xs.map((x) => [x, g.yFill(x)])} />)
  if (left === 'bar') {
    els.push(<Wrap key="wl" cx={ox} cy={y + r} r={r} t={tt} xR={ox} conv={cvL} tail={tailL.b - tailL.a} ts={tailL.t} />)
    if (!noBar) els.push(<BarEnd key="bl" cx={ox} cy={y + r} r={r * 0.92} />)
  }
  if (right === 'buckle') {
    els.push(<Wrap key="wr" cx={xe} cy={y + rb} r={rb} t={tt} xR={xe} conv={cvR} tail={tailR.b - tailR.a} ts={tailR.t} dir={-1} />)
    els.push(<BuckleSide key="bk" cx={xe} cy={y + rb} r={rb} s={s} T={tt} />)
  }
  holes.forEach((h, i) => {
    const cx = X(h)
    const w = 1.8 * s
    els.push(<rect key={'h' + i} x={cx - w / 2} y={y - tt - 1} width={w} height={tt + lt + 2 + tailT(cx)} fill={C.ground} stroke="#e7c48f" strokeWidth="0.5" />)
  })
  if (keeper && right === 'buckle') {
    const kx = xe - keeper.at * s
    const kw = 5 * s
    const kt = 1.2 * g.k
    const gap = (tt + lt) * 1.05
    const ktop = y - tt - gap - kt
    els.push(
      <g key="kp">
        <rect x={kx - kw / 2} y={ktop} width={kw} height={kt} rx="1.5" fill="url(#sk-topS)" stroke={EDGE} strokeWidth="0.8" />
        <path d={`M${kx - kw / 2} ${ktop + kt / 2} q-5 0 -5 6 V${y + 1} M${kx + kw / 2} ${ktop + kt / 2} q5 0 5 6 V${y + 1}`} fill="none" stroke="#b98c57" strokeWidth="1" strokeDasharray="2.5 2" />
      </g>
    )
  }
  if (right === 'break') els.push(<Brk key="brk" x={xe} y1={y - tt - g.hf(xe) - 6} y2={y + lt + 6} />)
  return <g>{els}</g>
}

/* ------------------------------------------------------------------ */
/* Rally openings in plan                                              */
/* ------------------------------------------------------------------ */
// look: 'underlay' (lining shows) | 'through' (skin shows) | 'mark' (laid out)
function Openings({ T: Tr, xs, d = 7, look = 'underlay' }) {
  const r = (d / 2) * Tr.s
  return (
    <g>
      {xs.map((x, i) => {
        const [cx, cy] = px(Tr, x, 0)
        if (look === 'mark')
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill="rgba(208,168,79,0.10)" stroke={C.brass} strokeWidth="1.1" strokeDasharray="3 2" />
              <path d={`M${cx - 3.5} ${cy} h7 M${cx} ${cy - 3.5} v7`} stroke={C.brass} strokeWidth="1" />
            </g>
          )
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} fill={look === 'through' ? C.ground : 'url(#sk-lin)'} />
            {look === 'through' && <circle cx={cx} cy={cy} r={r} fill={SKIN} />}
            <path d={`M${cx - r * 0.86} ${cy + r * 0.5} A${r} ${r} 0 0 1 ${cx + r * 0.5} ${cy - r * 0.86}`} fill="none" stroke="rgba(60,35,15,0.55)" strokeWidth={Math.max(1.5, r * 0.22)} />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={EDGE} strokeWidth="1.2" />
          </g>
        )
      })}
    </g>
  )
}

/* ================================================================== */
/* PADDED (BOMBÉ) STRAP                                                */
/* ================================================================== */

/* 1 · Pattern — strap plus filler, with insets and stops */
function PPattern() {
  const s = 2.8
  const TL = { x: 66, y: 92, s }
  const TS = { x: 66, y: 214, s }
  const XL = (mm) => TL.x + mm * s
  const XS = (mm) => TS.x + mm * s
  const hL = (mm) => (widthAt(mm, LONG()) / 2) * s
  const hS = (mm) => (widthAt(mm, SHORT()) / 2) * s
  const first = Math.min(...holeXs(120)) // the hole nearest the lug (53)
  const fEnd = first - 5
  return (
    <Fig h={300} view="Plan · strap & filler patterns" scale="card templates · 20 → 18 mm">
      <Tag x={24} y={40}>long piece · 120</Tag>
      <StrapPlan T={TL} o={LONG({ x0: -15 })} face="card" centre folds={[{ x: 0, label: 'lug fold' }]} filler={{ inset: 4, from: 10, to: fEnd }} holes={{ d: 1.8 }} />
      <Dim a={[XL(fEnd), TL.y]} b={[XL(first), TL.y]} off={-9} />
      <T x={XL(fEnd) + 2} y={TL.y - 15} s={10.5} mono c={C.text}>
        5
      </T>
      <T x={XL(first) + 8} y={TL.y - 10} s={10.5} c={C.text}>
        mm before the first hole
      </T>
      <Dim a={[XL(14), TL.y - 6 * s]} b={[XL(14), TL.y + 6 * s]} text="12" c={C.text} />
      <Dim a={[XL(30), TL.y + hL(30) - 4 * s]} b={[XL(30), TL.y + hL(30)]} />
      <T x={XL(30) + 6} y={TL.y + hL(30) + 12} s={10.5} mono>
        3–5
      </T>
      <Lead p={[XL(24), TL.y + 5]} t={[148, 150]} text="filler pattern · inset 3–5 mm per side" sub="starts past the lug fold, never in it" />

      <Tag x={24} y={183}>short piece · 80</Tag>
      <StrapPlan T={TS} o={SHORT({ x0: -15, x1: 105 })} face="card" centre folds={[{ x: 0 }, { x: 80 }]} filler={{ inset: 4, from: 10, to: 66 }} slot={{ x: 80 }} />
      <rect x={XS(67.5)} y={TS.y - hS(70) - 3} width={5 * s} height={2 * hS(70) + 6} rx="2" fill="none" stroke={C.dim} strokeWidth="0.9" strokeDasharray="3 2" />
      <line x1={XS(66)} y1={TS.y - hS(66) - 6} x2={XS(66)} y2={TS.y + hS(66) + 6} stroke={C.brass} strokeWidth="1.4" />
      <Lead p={[XS(70) + 6, TS.y - hS(70) - 3]} t={[372, 178]} text="fixed keeper" sub="≈ 10 mm from the fold" />
      <T x={XS(0)} y={TS.y + 44} a="middle" s={10.5}>
        lug fold
      </T>
      <T x={XS(85)} y={TS.y + 44} a="middle" s={10.5}>
        buckle fold · slot
      </T>
      <Lead p={[XS(66), TS.y + hS(66) + 6]} t={[236, 282]} text="keeper seam: the filler stops here" c={C.brass} />
    </Fig>
  )
}

/* 2 · Cut — top, lining and filler blanks */
function PCut() {
  const s = 1.9
  const ox = 54
  const X = (mm) => ox + mm * s
  const k = 9.5 // slab px per mm (×5 the plan)
  const blank = (x0, x1, cy, half, fill, stroke) => (
    <rect x={X(x0)} y={cy - half * s} width={(x1 - x0) * s} height={2 * half * s} rx="2" fill={fill} stroke={stroke} strokeWidth="1" />
  )
  const yT = 86
  const yL = 186
  const yF = 272
  const cx0 = 300
  return (
    <Fig h={322} view="Plan · blanks" scale="plan ×1.9 · slabs ×5">
      {/* top */}
      {blank(-18, 124, yT, 14, 'url(#sk-top)', '#5c3c1d')}
      <StrapPlan T={{ x: ox, y: yT, s }} o={LONG({ x0: -15 })} face="none" dash="5 3" edge={C.thread} />
      <Rule x={X(-12)} y={yT - 14 * s} len={196} s={s} side="above" />
      <Knife kind="utility" x={X(-12) + 196} y={yT - 14 * s} ang={62} k={0.5} />
      <T x={X(-18)} y={34} s={10.5} c={C.dim}>
        rough-cut on a rule, several light passes
      </T>
      <Dim a={[X(-18) - 5, yT - 14 * s]} b={[X(-18) - 5, yT + 14 * s]} flip text="25–30" />
      <Cap p={[X(60), yT + 10 * s]} x={X(60)} y={yT + 14 * s + 18} text="finished outline, scribed" s={10.5} c={C.dim} />
      {/* lining */}
      {blank(-4, 124, yL, 20, 'url(#sk-lin)', C.liningEdge)}
      <StrapPlan T={{ x: ox, y: yL, s }} o={LONG({ x0: 2 })} face="none" dash="5 3" edge="#7d6a4a" />
      <Dim a={[X(-4) - 6, yL - 20 * s]} b={[X(-4) - 6, yL + 20 * s]} flip text="40" />
      {/* fillers */}
      <rect x={X(8)} y={yF - 6 * s} width={38 * s} height={12 * s} rx="2" fill="url(#sk-fill)" stroke="#d9b07a" strokeWidth="1" />
      <rect x={X(58)} y={yF - 6 * s} width={56 * s} height={12 * s} rx="2" fill="url(#sk-fill)" stroke="#d9b07a" strokeWidth="1" />
      <T x={X(27)} y={yF + 28} a="middle" s={10.5} c={C.faint}>
        long · 38 mm
      </T>
      <T x={X(86)} y={yF + 28} a="middle" s={10.5} c={C.faint}>
        short · 56 mm
      </T>
      <Dim a={[X(8) - 5, yF - 6 * s]} b={[X(8) - 5, yF + 6 * s]} flip text="12" />

      <Sep x1={290} y1={44} x2={290} y2={312} />
      {/* right column: thickness slabs and the numbers */}
      <T x={cx0} y={58} s={12} c={C.text} w="600">
        Top · firm veg-tan
      </T>
      <rect x={cx0} y={66} width={64} height={1.5 * k} fill="none" stroke={C.dim} strokeWidth="0.8" strokeDasharray="2 2" />
      <rect x={cx0} y={66} width={64} height={1.0 * k} fill="url(#sk-topS)" stroke={EDGE} strokeWidth="0.8" />
      <T x={cx0 + 72} y={75} s={11} c={C.text} mono>
        ≈ 1.0 mm
      </T>
      <T x={cx0 + 72} y={89} s={10.5} c={C.faint}>
        ≤ 1.5 (dashed)
      </T>
      <Note x={cx0} y={108} lines={['5–10 mm wider than finished,', 'or 1 cm all round']} s={11} lh={14} />

      <T x={cx0} y={156} s={12} c={C.text} w="600">
        Lining · calf
      </T>
      <rect x={cx0} y={164} width={64} height={1.0 * k} fill="none" stroke={C.dim} strokeWidth="0.8" strokeDasharray="2 2" />
      <rect x={cx0} y={164} width={64} height={0.5 * k} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" />
      <T x={cx0 + 72} y={173} s={11} c={C.text} mono>
        0.5–1 mm
      </T>
      <Note x={cx0} y={196} lines={['up to 2 cm wider:', '40 mm for a 20 mm strap']} s={11} lh={14} />

      <T x={cx0} y={238} s={12} c={C.text} w="600">
        Filler
      </T>
      <rect x={cx0} y={246} width={46} height={1.7 * k} fill="url(#sk-fill)" stroke="#3a2716" strokeWidth="0.8" />
      <rect x={cx0 + 76} y={246} width={46} height={1 * k} fill="#8d8a7a" stroke="#4d4b42" strokeWidth="0.8" />
      <rect x={cx0 + 76} y={246 + k} width={46} height={1 * k} fill="#8d8a7a" stroke="#4d4b42" strokeWidth="0.8" />
      <T x={cx0} y={280} s={11} c={C.text} mono>
        1.5–1.9
      </T>
      <T x={cx0} y={294} s={10.5}>
        veg-tan
      </T>
      <T x={cx0 + 76} y={280} s={11} c={C.text} mono>
        2 × 1 mm
      </T>
      <T x={cx0 + 76} y={294} s={10.5}>
        foam, cork,
      </T>
      <T x={cx0 + 76} y={307} s={10.5}>
        fleece or Salpa
      </T>
    </Fig>
  )
}

/* 3 · Shape the filler — domed across, tapered along */
function PFiller() {
  const domePts = (cx, base, w, h, n = 60, a = -1, b = 1) => range(a, b, n).map((u) => [cx + (u * w) / 2, base - h * kama(u)])
  // panel A
  const ax = 112
  const ab = 130
  const aw = 144
  const ah = 41
  // panel B
  const bx = 362
  const bb = 128
  // panel C (side view of the short piece's filler, 56 mm)
  const cs = 7
  const cx1 = 44
  const cy = 290
  const ck = 14
  const fc = (xm) => fillerMM({ from: 0, to: 56, h: 1.7, ramp: 1.6 }, xm) * ck
  const side = range(0, 56, 112).map((xm) => [cx1 + xm * cs, cy - fc(xm)])
  return (
    <Fig h={330} view="Detail · shaping the filler" scale="thickness ×2">
      {/* A — across: bevel to a kamaboko dome */}
      <Tag x={14} y={40}>Across · bevel to a dome</Tag>
      <rect x={ax - aw / 2} y={ab - ah} width={aw} height={ah} fill="none" stroke={C.dim} strokeWidth="0.9" strokeDasharray="4 3" />
      <path d={poly([[ax - aw / 2, ab], [ax - aw / 2, ab - ah], [ax, ab - ah], ...domePts(ax, ab, aw, ah, 30, 0, -1)])} fill="url(#sk-fadeL)" />
      <path d={poly([[ax + aw / 2, ab], [ax + aw / 2, ab - ah], [ax, ab - ah], ...domePts(ax, ab, aw, ah, 30, 0, 1)])} fill="url(#sk-fadeR)" />
      <path d={poly(domePts(ax, ab, aw, ah))} fill="url(#sk-fill)" stroke="#d9b07a" strokeWidth="1" />
      <Cap p={[ax - aw / 2 + 8, ab - ah + 8]} x={24} y={68} a="start" text="bevel off both long edges" c={C.brass} />
      <Dim a={[ax - aw / 2, ab]} b={[ax + aw / 2, ab]} off={12} flip text="12 = 20 − 2 × 4" />
      <VDim x={ax + aw / 2 + 8} y1={ab - ah} y2={ab} />
      <T x={ax + aw / 2 + 12} y={ab - ah / 2 + 4} s={10.5} mono>
        1.5–1.9
      </T>
      <T x={ax} y={ab - 10} a="middle" s={10} c="#f1dfc0">
        kamaboko
      </T>

      <Sep x1={246} y1={28} x2={246} y2={164} />
      {/* B — taller: stack two, the upper narrower, carve */}
      <Tag x={256} y={40}>Taller · stack two, carve</Tag>
      <rect x={bx - 72} y={bb - 34} width={144} height={34} fill="rgba(109,80,53,0.35)" stroke="#d9b07a" strokeWidth="0.9" strokeDasharray="4 3" />
      <rect x={bx - 60} y={bb - 68} width={120} height={34} fill="rgba(109,80,53,0.35)" stroke="#d9b07a" strokeWidth="0.9" strokeDasharray="4 3" />
      <path d={poly(domePts(bx, bb, 144, 64))} fill="url(#sk-fill)" />
      <path d={poly(domePts(bx, bb, 144, 64), false)} fill="none" stroke={C.brass} strokeWidth="1.4" strokeDasharray="5 3" />
      <line x1={bx - 72} y1={bb} x2={bx + 72} y2={bb} stroke="#3a2716" strokeWidth="1" />
      <T x={bx} y={bb - 12} a="middle" s={10} c="#f1dfc0">
        one dome
      </T>
      <T x={bx} y={bb + 18} a="middle" s={10.5} c={C.text}>
        upper layer narrower;
      </T>
      <T x={bx} y={bb + 32} a="middle" s={10.5} c={C.brass}>
        carve along the dashed line
      </T>

      <Sep x1={14} y1={170} x2={466} y2={170} />
      {/* C — along: plan of the strip, then the taper in side view */}
      <Tag x={14} y={188}>Along · thickest at the lug, feathered at the end</Tag>
      <rect x={cx1} y={200} width={56 * cs} height={30} rx="2" fill="url(#sk-fill)" stroke="#d9b07a" strokeWidth="1" />
      <rect x={cx1} y={200} width={56 * cs} height={7.5} fill="rgba(208,168,79,0.34)" />
      <rect x={cx1} y={222.5} width={56 * cs} height={7.5} fill="rgba(208,168,79,0.34)" />
      <rect x={cx1} y={200} width={56 * cs} height={30} fill="url(#sk-fadeR)" opacity="0.5" />
      <T x={cx1 + 56 * cs + 8} y={208} s={10.5} c={C.brass}>
        bevels
      </T>
      <T x={cx1 + 56 * cs + 8} y={230} s={10.5} c={C.dim}>
        plan
      </T>
      {/* side view */}
      <rect x={cx1} y={cy - 1.7 * ck} width={56 * cs} height={1.7 * ck} fill="none" stroke={C.dim} strokeWidth="0.9" strokeDasharray="4 3" />
      <path d={poly([[cx1, cy - 1.7 * ck], [cx1 + 56 * cs, cy - 1.7 * ck], [cx1 + 56 * cs, cy], ...side.slice().reverse().slice(1)])} fill="url(#sk-fadeR)" opacity="0.9" />
      <path d={poly([[cx1, cy], ...side, [cx1 + 56 * cs, cy]])} fill="url(#sk-fill)" stroke="#d9b07a" strokeWidth="1" />
      <Slab x={cx1 - 8} y={cy} w={56 * cs + 16} h={10} kind="glass" />
      <Knife kind="skive" x={cx1 + 34 * cs} y={cy - fc(34) - 1} ang={76} k={0.5} />
      <Arrow d={`M${cx1 + 39 * cs} ${cy - fc(39) - 10} L${cx1 + 50 * cs} ${cy - fc(50) - 6}`} w={1.6} />
      <VDim x={cx1 - 8} y1={cy - 1.7 * ck} y2={cy} />
      <T x={cx1 - 12} y={cy - 8} a="end" s={10.5} mono>
        1.7
      </T>
      <T x={cx1} y={318} s={10.5}>
        lug end: full thickness
      </T>
      <T x={cx1 + 56 * cs} y={318} a="end" s={10.5}>
        tip / buckle end: feathered to nothing
      </T>
    </Fig>
  )
}

/* 4 · Skive the flaps — fold line 10–15 mm from the end */
function PFlaps() {
  const s = 3.4
  const TP = { x: 112, y: 84, s }
  const X = (mm) => TP.x + mm * s
  // bottom section: the flap on glass, flesh up, being skived
  const k = 12
  const t = 1.2 * k
  const bs = 4.5
  const x1 = 70
  const yb = 250
  const ramp = 25 * bs
  const xf = x1 + 12.5 * bs
  // folded result (top right)
  const fcx = 300
  const fy = 86
  const tl = t * 0.5
  const fr = 0.9 * k
  return (
    <Fig h={316} view="Plan + section · lug flap" scale="section thickness ×3">
      <ClipRect x={10} y={20} w={X(40) - 10} h={120}>
        <StrapPlan T={TP} o={LONG({ x0: -14 })} face="flesh" zones={[{ from: -14, to: 11, k: 'skiveL' }]} folds={[{ x: 0, label: 'fold line' }]} />
      </ClipRect>
      <Brk x={X(40)} y1={TP.y - 40} y2={TP.y + 40} />
      <line x1={X(11)} y1={TP.y - 37} x2={X(11)} y2={TP.y + 37} stroke={C.brass} strokeWidth="0.9" strokeDasharray="2 2" />
      <Dim a={[X(-14), TP.y + 34]} b={[X(0), TP.y + 34]} off={10} flip text="10–15" />
      <Lead p={[X(-9), TP.y - 12]} t={[56, 48]} text="skive" sub="flesh side" a="end" c={C.brass} />
      <Lead p={[X(11), TP.y + 37]} t={[X(11) + 24, 140]} text="skive starts" sub="past the fold line" c={C.dim} />

      {/* folded: doubled ≈ single */}
      <Tag x={272} y={40}>Folded</Tag>
      <Ply x1={fcx} x2={458} y={fy} t={t} skL={[40, tl]} open="l" />
      <Wrap cx={fcx} cy={fy + tl + fr} r={fr} t={tl} xR={fcx} conv={fr * 2.8} tail={64} ts={tl * 0.5} />
      <BarEnd cx={fcx} cy={fy + tl + fr} r={fr * 0.92} />
      <line x1={fcx + 44} y1={fy - 12} x2={fcx + 44} y2={fy + t + 12} stroke={C.emerald} strokeWidth="0.9" strokeDasharray="2 2" />
      <T x={fcx + 44} y={fy - 16} a="middle" s={10.5} mono c={C.emerald}>
        ≈ 1
      </T>
      <line x1={452} y1={fy} x2={452} y2={fy + t} stroke={C.dim} strokeWidth="0.85" />
      <T x={446} y={fy - 5} a="end" s={10.5} mono>
        1
      </T>
      <T x={370} y={136} a="middle" s={11.5} c={C.emerald} w="600">
        Doubled ≈ single
      </T>
      <T x={370} y={151} a="middle" s={10.5}>
        the fold is no thicker than the body
      </T>

      <Sep x1={14} y1={166} x2={466} y2={166} />
      {/* skiving the flap */}
      <Tag x={14} y={184}>Skiving · grain down on glass, flesh up</Tag>
      <Slab x={x1 - 14} y={yb + t} w={392} h={10} kind="glass" />
      <Ply x1={x1} x2={440} y={yb} t={t} skL={[ramp, t * 0.06]} cut="top" />
      <path d={`M${x1} ${yb} L${x1 + ramp} ${yb} L${x1} ${yb + t - t * 0.06} Z`} fill="url(#sk-fadeL)" opacity="0.55" />
      <line x1={xf} y1={yb - 22} x2={xf} y2={yb + t + 14} stroke={C.text} strokeWidth="1" strokeDasharray="4 3" />
      <T x={xf} y={yb - 26} a="middle" s={10.5}>
        fold line
      </T>
      <Knife kind="skive" x={x1 + 30} y={yb + t * 0.62} ang={78} k={0.55} />
      <Arrow a={[x1 + 22, yb + 20]} b={[x1 + 2, yb + 23]} w={1.6} />
      <line x1={xf + 6} y1={yb + t * 0.47} x2={xf + 6} y2={yb + t} stroke={C.dim} strokeWidth="0.85" />
      <Cap p={[x1 + 2, yb + t - 1]} x={18} y={218} a="start" text="feathered" c={C.dim} />
      <Dim a={[x1, yb + t + 22]} b={[xf, yb + t + 22]} flip text="10–15" />
      <Cap p={[xf + 6, yb + t * 0.74]} x={200} y={306} a="start" text="≈ ½ thickness through the fold" />
    </Fig>
  )
}

/* 5 · Reinforce — the lining and around the folds, short of the edges */
function PReinforce() {
  const s = 2.9
  const TL = { x: 40, y: 84, s }
  const reinf = outline(LONG({ x0: 5.5, x1: 117.5, w0: 15.5, w1: 13.5, tipLen: 12 }))
  const TT = { x: 74, y: 226, s }
  const XT = (mm) => TT.x + mm * s
  const g = domeG({ cx: 378, yb: 246, s: 7.5 })
  const eY = (mm) => TL.y - (widthAt(mm, LONG()) / 2 - 2) * s
  return (
    <Fig h={334} view="Plan · lining & lug flap" scale="plan ×2.9 · section ×7.5">
      <Tag x={14} y={36}>Lining · flesh up</Tag>
      <StrapPlan T={TL} o={LONG({ x0: 3 })} face="lining" />
      <path d={pathOf(reinf, TL)} fill="rgba(134,167,189,0.34)" stroke={C.velodon} strokeWidth="1.2" />
      <Cap p={[TL.x + 70 * s, eY(70)]} x={250} y={36} a="start" text="stops short of the edges" sub="trim and paint stay in leather" />
      <Cap p={[TL.x + 30 * s, TL.y + 8]} x={TL.x + 30 * s} y={140} text="0.2 mm non-stretch non-woven" sub="on the lining's flesh, full body" c={C.velodon} />

      <Sep x1={14} y1={164} x2={466} y2={164} />
      <Tag x={14} y={182}>Top · lug flap, flesh up</Tag>
      <ClipRect x={10} y={190} w={XT(26) - 10} h={76}>
        <StrapPlan T={TT} o={LONG({ x0: -14 })} face="flesh" folds={[{ x: 0 }]} />
        <rect x={XT(-7)} y={TT.y - 8.4 * s} width={14 * s} height={16.8 * s} rx="2" fill="rgba(134,167,189,0.4)" stroke={C.velodon} strokeWidth="1.2" />
      </ClipRect>
      <Brk x={XT(26)} y1={TT.y - 36} y2={TT.y + 36} />
      <T x={XT(0)} y={TT.y + 46} a="middle" s={10.5}>
        fold
      </T>
      <Lead p={[XT(4), TT.y + 18]} t={[XT(4) + 24, 292]} text="thin, flexible patch round the pin" sub="never stiff tape across a fold" c={C.velodon} />

      <Tag x={292} y={182}>Section · where it sits</Tag>
      <DomeX g={g} vel={1.6} />
      <Cap p={[g.x2 - 22, g.yb + 1]} x={g.x2} y={286} a="end" text="on the lining" c={C.velodon} />
      <Dim a={[g.x1, g.yBot + 6]} b={[g.x1 + 1.6 * g.s, g.yBot + 6]} />
      <T x={g.x1} y={g.yBot + 22} s={10.5} c={C.dim}>
        short of the edge
      </T>
      <T x={g.cx} y={g.crest - 8} a="middle" s={10.5} c={C.dim}>
        top over the filler
      </T>
      <T x={14} y={326} s={10.5} c={C.faint}>
        On a flat strap it runs full length on the top's flesh instead; on a padded one the filler sits there.
      </T>
    </Fig>
  )
}

/* 6 · Glue the filler — exactly centred */
function PGlueFiller() {
  const s = 2.5
  const TP = { x: 65, y: 90, s }
  const X = (mm) => TP.x + mm * s
  const hS = (mm) => (widthAt(mm, SHORT()) / 2) * s
  const gA = domeG({ cx: 112, yb: 244, s: 6 })
  const gB = domeG({ cx: 342, yb: 244, s: 6, shift: 1.5 })
  return (
    <Fig h={308} view="Plan · top, flesh up" scale="plan ×2.5 · sections ×6">
      <rect x={X(-18)} y={TP.y - 14 * s} width={127 * s} height={28 * s} rx="2" fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="1" />
      <rect x={X(-18)} y={TP.y - 14 * s} width={127 * s} height={28 * s} rx="2" fill="url(#sk-fibre)" />
      <StrapPlan T={TP} o={SHORT({ x0: -14, x1: 105 })} face="none" dash="5 3" edge="#7a5a35" folds={[{ x: 0 }, { x: 80 }]} filler={{ inset: 4, from: 10, to: 66, solid: true }} />
      <line x1={X(-22)} y1={TP.y} x2={X(112)} y2={TP.y} stroke={C.steel} strokeWidth="0.9" strokeDasharray="10 3 2 3" />
      {[10, 66].map((mm) => (
        <line key={mm} x1={X(mm)} y1={TP.y - 5} x2={X(mm)} y2={TP.y + 5} stroke={C.steel} strokeWidth="1.6" />
      ))}
      <Dim a={[X(38), TP.y - hS(38)]} b={[X(38), TP.y - hS(38) + 4 * s]} c={C.hole} />
      <Dim a={[X(38), TP.y + hS(38) - 4 * s]} b={[X(38), TP.y + hS(38)]} c={C.hole} />
      <T x={X(38) + 6} y={TP.y - hS(38) + 8} s={10.5} mono c={C.hole}>
        4
      </T>
      <T x={X(38) + 6} y={TP.y + hS(38) - 2} s={10.5} mono c={C.hole}>
        4
      </T>
      <Cap p={[X(38), TP.y - hS(38) + 2]} x={40} y={34} a="start" text="equal margins both sides" sub="centring is the hard part" />
      <Cap p={[X(66), TP.y - 4]} x={250} y={34} a="start" text="centre marks" sub="on filler and top, aligned" c={C.steel} />
      <Cap p={[X(30), TP.y + 6]} x={X(30)} y={152} text="filler, cemented flesh to flesh" />
      <Note x={350} y={72} head="or" hc={C.text} lines={['glue it on the lining', 'instead — the top is', 'then the cover layer']} s={10.5} lh={14} />

      <Sep x1={14} y1={170} x2={466} y2={170} />
      <Tag x={14} y={188}>Why centring matters · section</Tag>
      <DomeX g={gA} stitch={{ m: 3 }} />
      <DomeX g={gB} stitch={{ m: 3 }} />
      <Verdict x={gA.x2 + 22} y={210} ok />
      <Verdict x={gB.x2 + 22} y={210} ok={false} />
      <circle cx={gB.x2 - 3 * gB.s} cy={gB.yUp(gB.x2 - 3 * gB.s) - 2} r="8" fill="none" stroke={C.ruby} strokeWidth="1.3" />
      <T x={gA.cx} y={272} a="middle" s={11} c={C.emerald} w="600">
        Centred: equal flanges
      </T>
      <T x={gA.cx} y={287} a="middle" s={10.5}>
        both stitch lines hug the step
      </T>
      <T x={gB.cx} y={272} a="middle" s={11} c={C.ruby} w="600">
        1.5 mm off: lopsided dome
      </T>
      <T x={gB.cx} y={287} a="middle" s={10.5}>
        one stitch line climbs the dome
      </T>
    </Fig>
  )
}

/* 7 · Close the stack — centre outward with a slight stretch */
function PClose() {
  const g = domeG({ cx: 124, yb: 152, s: 9 })
  const { x1, x2, f1, f2, yb, lt } = g
  const lin = `M${x1} ${yb + 8} Q${f1 - 12} ${yb} ${f1} ${yb} L${f2} ${yb} Q${f2 + 12} ${yb} ${x2} ${yb + 8} L${x2} ${yb + 8 + lt} Q${f2 + 12} ${yb + lt} ${f2} ${yb + lt} L${f1} ${yb + lt} Q${f1 - 12} ${yb + lt} ${x1} ${yb + 8 + lt} Z`
  // panel B: round a bottle, polar layers
  const bc = [356, 300]
  const R = 92
  const P = (rr, a) => [bc[0] + rr * Math.cos((a * Math.PI) / 180), bc[1] + rr * Math.sin((a * Math.PI) / 180)]
  const fil = (a) => {
    // filler along the strap: thick at the lug end (left) → feathered
    if (a < -140 || a > -46) return 0
    const u = (a + 140) / 94
    const rise = Math.min(1, (a + 140) / 10)
    return 12 * Math.sqrt(rise) * Math.pow(1 - u, 0.9)
  }
  const band = (a0, a1, rin, rout) => {
    const as = range(a0, a1, 100)
    return poly([...as.map((a) => P(rin(a), a)), ...as.slice().reverse().map((a) => P(rout(a), a))])
  }
  return (
    <Fig h={312} view="Section · closing the stack" scale="schematic">
      <Tag x={14} y={40}>Filler on the top</Tag>
      <T x={14} y={57} s={11}>
        lining preloaded, laid centre → out
      </T>
      <DomeX g={g} lining={false} />
      <path d={lin} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" />
      <GlueLine x1={f1 + 2} x2={f2 - 2} y={yb + 0.8} />
      <NoGlue x1={x1 + 2} x2={f1 - 2} y={yb + 4} h={6} />
      <NoGlue x1={f2 + 2} x2={x2 - 2} y={yb + 4} h={6} />
      <Arrow a={[g.cx - 8, yb + lt + 26]} b={[x1 + 6, yb + lt + 26]} w={1.8} />
      <Arrow a={[g.cx + 8, yb + lt + 26]} b={[x2 - 6, yb + lt + 26]} w={1.8} />
      <circle cx={g.cx} cy={yb + lt + 26} r="3" fill={C.brass} />
      <T x={g.cx} y={yb + lt + 46} a="middle" s={11} c={C.text}>
        from the centreline outward,
      </T>
      <T x={g.cx} y={yb + lt + 60} a="middle" s={11} c={C.text}>
        with a slight stretch
      </T>
      <Cap p={[x1 + 12, yb + 4]} x={20} y={98} a="start" text="flanges unglued for now" c={C.ruby} />
      <Cap p={[g.cx + 30, yb + 1]} x={168} y={124} a="start" text="cement" c={C.emerald} />
      <T x={g.cx} y={262} a="middle" s={10.5} c={C.faint}>
        (Ramrod: preloaded, never a wrinkle)
      </T>

      <Sep x1={246} y1={28} x2={246} y2={302} />
      <Tag x={256} y={40}>Filler on the lining</Tag>
      <T x={256} y={57} s={11}>
        top stretched over, round a bottle
      </T>
      <circle cx={bc[0]} cy={bc[1]} r={R} fill="rgba(120,170,150,0.07)" stroke="#6e9c8c" strokeWidth="1.2" />
      <path d={band(-150, -30, () => R, () => R + 6)} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" />
      <path d={band(-140, -46, () => R + 6, (a) => R + 6 + fil(a))} fill="url(#sk-fill)" stroke="#3a2716" strokeWidth="0.6" />
      <path d={band(-150, -30, (a) => R + 6 + fil(a), (a) => R + 15 + fil(a))} fill={TOPF} stroke={EDGE} strokeWidth="0.8" />
      <path d={poly(range(-150, -30, 100).map((a) => P(R + 15 + fil(a), a)), false)} fill="none" stroke={GRAIN} strokeWidth="1.6" />
      <Arrow d={`M${P(R + 36, -94)[0]} ${P(R + 36, -94)[1]} A${R + 36} ${R + 36} 0 0 0 ${P(R + 36, -130)[0]} ${P(R + 36, -130)[1]}`} w={1.8} />
      <Arrow d={`M${P(R + 36, -86)[0]} ${P(R + 36, -86)[1]} A${R + 36} ${R + 36} 0 0 1 ${P(R + 36, -50)[0]} ${P(R + 36, -50)[1]}`} w={1.8} />
      <circle cx={P(R + 36, -90)[0]} cy={P(R + 36, -90)[1]} r="3" fill={C.brass} />
      <T x={bc[0]} y={P(R + 36, -90)[1] - 12} a="middle" s={11} c={C.text}>
        centre → out, slight stretch
      </T>
      <Cap p={P(R + 11, -146)} x={262} y={290} a="start" text="top" />
      <Cap p={P(R + 3, -36)} x={456} y={290} a="end" text="lining" />
      <Cap p={P(R + 9, -112)} x={bc[0]} y={240} text="filler, on the lining" />
      <T x={bc[0]} y={262} a="middle" s={10} c="#8fbcae">
        bottle / former
      </T>
      <T x={bc[0]} y={278} a="middle" s={10} c={C.faint}>
        (dete-diary)
      </T>
    </Fig>
  )
}

/* 8 · Set the step — bone folder along the filler edge, flanges flat */
function PStep() {
  const g = domeG({ cx: 170, yb: 176, s: 10 })
  const fx = g.f2 + 1
  const hx = g.x1 + 20
  const hy = g.yb - g.tt - 4
  const TP = { x: 40, y: 302, s: 3 }
  const X = (mm) => TP.x + mm * TP.s
  const fe = (widthAt(30, SHORT()) / 2 - 4) * TP.s
  // before / after minis
  const gF = domeG({ cx: 400, yb: 152, s: 5.5 })
  const gT = domeG({ cx: 400, yb: 148, s: 5.5, inset: 0.5, fh: 2.6, prof: (u) => Math.pow(Math.max(0, 1 - u * u), 1.4) })
  const gA = domeG({ cx: 400, yb: 230, s: 5.5 })
  return (
    <Fig h={340} view="Section · setting the step" scale="true scale ×10">
      <Slab x={g.x1 - 20} y={g.yb + g.lt} w={g.W + 40} h={12} kind="granite" />
      <DomeX g={g} />
      <BoneFolder x={fx} y={g.yUp(fx) + 1} ang={38} k={0.72} />
      <g transform={`translate(${2 * hx} 0) scale(-1 1)`}>
        <Hammer x={hx} y={hy} k={0.8} />
      </g>
      <Arrow a={[hx, hy - 64]} b={[hx, hy - 40]} w={1.8} />
      <Cap p={[hx, hy - 66]} x={20} y={66} a="start" text="hammer the flanges flat" sub="or clamp them" />
      <Cap p={[fx + 34, g.yUp(fx) - 46]} x={258} y={66} a="start" text="bone folder along" sub="the filler edge: the step" />
      <T x={g.cx} y={g.yb - 8} a="middle" s={10.5} c="#f1dfc0">
        dome
      </T>
      <Cap p={[g.x1 + 30, g.yb - 5]} x={g.x1 + 40} y={226} text="flange" c={C.dim} />
      <T x={g.x2 + 24} y={g.yb + g.lt + 10} s={10} c={C.faint}>
        slab
      </T>

      <Sep x1={322} y1={96} x2={322} y2={262} />
      <Tag x={334} y={112}>Before</Tag>
      <Verdict x={456} y={108} ok={false} r={8} />
      <rect x={gF.x1} y={gF.yb} width={gF.W} height={gF.lt} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" />
      <path d={poly([[gF.f1, gF.yb], ...gF.xs.filter((x) => x > gF.f1 && x < gF.f2).map((x) => [x, gF.yLo(x)]), [gF.f2, gF.yb]])} fill="url(#sk-fill)" stroke="#3a2716" strokeWidth="0.8" />
      <TopShape up={gT.xs.map((x) => [x, gT.yUp(x)])} lo={gT.xs.map((x) => [x, gT.yLo(x)])} />
      <T x={400} y={176} a="middle" s={10.5} c={C.ruby}>
        soft: the flange springs up
      </T>
      <Tag x={334} y={196}>After</Tag>
      <Verdict x={456} y={192} ok r={8} />
      <DomeX g={gA} />
      <T x={400} y={254} a="middle" s={10.5} c={C.emerald}>
        crisp step, flange flat
      </T>

      <Sep x1={14} y1={268} x2={466} y2={268} />
      <StrapPlan T={TP} o={SHORT()} filler={{ inset: 4, from: 10, to: 66 }} />
      <Arrow a={[X(13), TP.y - fe - 4]} b={[X(63), TP.y - fe - 4]} w={1.8} />
      <Arrow a={[X(13), TP.y + fe + 4]} b={[X(63), TP.y + fe + 4]} w={1.8} />
      <T x={296} y={296} s={11} c={C.text}>
        Plan: run the folder along
      </T>
      <T x={296} y={311} s={11} c={C.text}>
        both edges, the full length
      </T>
    </Fig>
  )
}

/* 9 · Form the ends — the lug fold beyond the end of the filler */
function PEnds() {
  const g = padG({ ox: 136, y: 140, s: 6, k: 12, len: 52, fillers: [{ from: 10, to: 66, h: 2.2, ramp: 3 }], right: 'break', tailEnd: 10 })
  const { X, ox, y, r, tt } = g
  const R = r + tt
  const cy = y + r
  const ap = (deg) => [ox + R * Math.cos((deg * Math.PI) / 180), cy + R * Math.sin((deg * Math.PI) / 180)]
  const fp = ap(215)
  return (
    <Fig h={300} view="Section · lug end, long piece" scale="thickness ×2">
      <PadLong g={g} />
      <NoGlue x1={ox + 3} x2={X(10)} y={y + 3.5} h={6} />
      <GlueLine x1={X(10)} x2={g.xe - 6} y={y + 0.8} />
      <BoneFolder x={fp[0]} y={fp[1]} ang={-55} k={0.68} />
      <Arrow d={`M${ap(150)[0] - 10} ${ap(150)[1] + 6} A${R + 12} ${R + 12} 0 0 1 ${ap(250)[0] - 2} ${ap(250)[1] - 9}`} w={1.5} />
      {/* dims */}
      <line x1={ox} y1={y + 2 * r + tt + 6} x2={ox} y2={238} stroke={C.dim} strokeWidth="0.6" opacity="0.6" />
      <line x1={X(10)} y1={y + 12} x2={X(10)} y2={238} stroke={C.dim} strokeWidth="0.6" opacity="0.6" />
      <Dim a={[ox, 234]} b={[X(10), 234]} text="10" />
      <T x={(ox + X(10)) / 2} y={254} a="middle" s={10.5} c={C.ruby}>
        no glue · no filler
      </T>
      <Cap p={[fp[0] - 22, fp[1] - 30]} x={110} y={46} a="start" text="bone-fold until the pin shows" sub="the bar's shape reads through" />
      <Lead p={[X(12.5), g.yTop(X(12.5)) - 1]} t={[296, 72]} text="filler starts past the fold" sub="never in it · thickest here" />
      <Lead p={[ox + 18, y + 4]} t={[110, 214]} text="channel glue-free" a="end" c={C.ruby} />
      <Cap p={[X(32), y + 1]} x={X(32)} y={222} text="cement from 10 mm on" c={C.emerald} />
      <Lead p={[X(44), g.yTop(X(44))]} t={[X(44) + 8, 100]} text="top" c={C.dim} />
      <Lead p={[X(46), y + 5]} t={[X(46) + 12, 186]} text="lining" c={C.dim} />
      <T x={ox - 30} y={192} a="end" s={10} c={C.faint}>
        bar Ø 1.8
      </T>
      <Note x={250} y={272} lines={['Fold as for a flat strap: rod in the channel,', 'crease with leather-tipped pliers, clamp.']} s={10.5} lh={14} c={C.faint} />
    </Fig>
  )
}

/* 10 · Trim — spacer under the flange, or the dog-collar method */
function PTrim() {
  const yb0 = 152
  const g = domeG({ cx: 156, yb: yb0, s: 9, w: 28, fw: 12 })
  const cut1 = g.cx - 90
  const cut2 = g.cx + 90
  const board = yb0 + g.hu(g.cx)
  const sp = 3.2
  const ds = 3
  const dcy = 150
  const xa = 314
  const xb = 462
  const yy = (mm) => dcy + mm * ds
  const stitches = range(xa + 6, xb - 6, 16)
  return (
    <Fig h={300} view="Section + plan · trimming" scale="section true ×9">
      <Tag x={14} y={40}>Spacer method · dome down</Tag>
      <Slab x={g.x1 - 10} y={board} w={g.W + 20} h={12} kind="board" />
      {[g.x1, g.f2 + 12].map((xs, i) => (
        <rect key={i} x={xs} y={yb0 + g.tt} width={g.f1 - 12 - g.x1} height={board - yb0 - g.tt} rx="1.5" fill="url(#sk-dark)" stroke="#2e1e10" strokeWidth="0.8" />
      ))}
      <g transform={`translate(0 ${2 * yb0}) scale(1 -1)`}>
        <DomeX g={g} />
      </g>
      <rect x={cut1} y={yb0 - g.lt - sp} width={cut2 - cut1} height={sp} fill="rgba(226,214,190,0.55)" stroke={C.struct} strokeWidth="0.7" />
      <rect x={g.x1} y={yb0 - g.lt} width={cut1 - g.x1} height={g.lt + g.tt} fill="url(#sk-hatch)" />
      <rect x={cut2} y={yb0 - g.lt} width={g.x2 - cut2} height={g.lt + g.tt} fill="url(#sk-hatch)" />
      {[cut1, cut2].map((x) => (
        <line key={x} x1={x} y1={yb0 - g.lt - 14} x2={x} y2={yb0 + g.tt + 12} stroke={C.brass} strokeWidth="1" strokeDasharray="4 3" />
      ))}
      <Knife kind="utility" x={cut1} y={yb0 + g.tt - 2} k={0.62} />
      <Lead p={[cut1 + 4, 112]} t={[86, 84]} text="cut square, 90°" sub="lining and flange in one cut" />
      <Cap p={[g.cx + 40, yb0 - g.lt - sp]} x={g.cx} y={124} text="card pattern on the lining" c={C.dim} />
      <T x={(g.x1 + cut1) / 2} y={132} a="middle" s={10} c={C.faint}>
        waste
      </T>
      <T x={(cut2 + g.x2) / 2} y={132} a="middle" s={10} c={C.faint}>
        waste
      </T>
      <T x={g.cx} y={board - 8} a="middle" s={10} c="#f1dfc0">
        dome down
      </T>
      <Dim a={[cut1, board + 22]} b={[cut2, board + 22]} flip text="20 · finished width" />
      <Cap p={[g.x1 + 20, board - 6]} x={24} y={250} a="start" text="spacer under each flange" sub="so the flange can't collapse under the knife" c={C.dim} />

      <Sep x1={300} y1={28} x2={300} y2={290} />
      <Tag x={310} y={40}>or · dog-collar method</Tag>
      <rect x={xa} y={yy(-12)} width={xb - xa} height={24 * ds} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="1" />
      <rect x={xa} y={yy(-6)} width={xb - xa} height={12 * ds} fill="rgba(255,236,200,0.12)" stroke="#d9b07a" strokeWidth="0.8" strokeDasharray="4 3" />
      {[-7, 7].map((m) => (
        <g key={m}>
          {stitches.slice(0, -1).map((x, i) => (
            <line key={i} x1={x + 1.5} y1={yy(m) - 1.2} x2={x + (stitches[1] - stitches[0]) - 1.5} y2={yy(m) + 1.2} stroke={C.thread} strokeWidth="1.5" strokeLinecap="round" />
          ))}
        </g>
      ))}
      <rect x={xa} y={yy(-12)} width={xb - xa} height={2 * ds} fill="url(#sk-hatch)" />
      <rect x={xa} y={yy(10)} width={xb - xa} height={2 * ds} fill="url(#sk-hatch)" />
      {[-10, 10].map((m) => (
        <line key={m} x1={xa - 4} y1={yy(m)} x2={xb + 4} y2={yy(m)} stroke={C.brass} strokeWidth="1.1" strokeDasharray="5 3" />
      ))}
      <Cap p={[xa + 30, yy(-7)]} x={314} y={96} a="start" text="1 · sew the oversize piece" />
      <Cap p={[xa + 100, yy(10)]} x={314} y={214} a="start" text="2 · trim after" sub="≈ 2 mm extra per side" c={C.brass} />
      <Note x={314} y={262} lines={['for flanges that', "won't lie flat"]} s={10.5} lh={14} c={C.faint} />
    </Fig>
  )
}

/* 11 · Mark the line — 3 mm in, on the flange, hugging the step */
function PMark() {
  const TP = { x: 40, y: 70, s: 3.6 }
  const X = (mm) => TP.x + mm * TP.s
  const hS = (mm) => (widthAt(mm, SHORT()) / 2) * TP.s
  const g = domeG({ cx: 200, yb: 240, s: 12 })
  const gx = g.x2 - 3 * g.s
  const paper = range(g.f1 - 10, g.f2 + 2, 60).map((x) => [x, g.yUp(x) - 2.6])
  return (
    <Fig h={340} view="Plan + section · the stitch line" scale="section true ×12">
      <StrapPlan T={TP} o={SHORT()} filler={{ inset: 4, from: 10, to: 66 }} stitch={{ mode: 'line', m: 3, from: 5, to: 66 }} />
      <Lead p={[X(70), TP.y - hS(70) + 3 * TP.s]} t={[352, 40]} text="stitch line, 3 mm in" sub="on the flange" />
      <Lead p={[X(52), TP.y + hS(52) - 4 * TP.s]} t={[352, 98]} text="filler step, 4 mm in" sub="the line hugs it" c={C.brass} />

      <Sep x1={14} y1={124} x2={466} y2={124} />
      <Tag x={14} y={142}>Section · marking the flange</Tag>
      <DomeX g={g} />
      <path d={poly(paper, false)} fill="none" stroke="#efe6d2" strokeWidth="2.4" strokeLinecap="round" />
      <path d={`M${gx - 2.5} ${g.yUp(gx) - 0.5} L${gx} ${g.yUp(gx) + 2.6} L${gx + 2.5} ${g.yUp(gx) - 0.5}`} fill={C.hole} stroke={C.hole} strokeWidth="0.8" />
      <Dividers x={(gx + g.x2) / 2} y={g.yUp(gx) - 0.5} sp={g.x2 - gx} h={70} />
      <Dim a={[gx, g.yBot + 6]} b={[g.x2, g.yBot + 6]} off={8} flip text="3" />
      <Dim a={[g.f2, g.yBot + 6]} b={[g.x2, g.yBot + 6]} off={26} flip text="4 · step" />
      <line x1={g.f2} y1={g.yb} x2={g.f2} y2={g.yBot + 32} stroke={C.dim} strokeWidth="0.6" opacity="0.6" />
      <Lead p={[g.x2 - 1, g.yUp(g.x2) - 30]} t={[332, 162]} text="one leg rides" sub="the edge" />
      <Lead p={[gx, g.yUp(gx) + 2]} t={[332, 206]} text="groove (optional)" sub="dampen first" c={C.brass} />
      <Cap p={[g.f1 + 6, g.yUp(g.f1 + 6) - 3]} x={22} y={170} a="start" text="paper over the dome" sub="it goes under the iron next" />
      <Note x={14} y={320} lines={['On a padded strap the line sits on the flat flange, about 1 mm from', 'the step — never on the slope of the dome.']} s={10.5} lh={14} />
    </Fig>
  )
}

/* 12 · Prick and stitch — through the flange only */
function PStitch() {
  const g = domeG({ cx: 240, yb: 186, s: 11 })
  const xs = g.x1 + 3 * g.s
  const xr = g.x2 - 3 * g.s
  // the iron body rests on paper laid over the dome's shoulder
  const bw = 24
  const bodyY = Math.min(...range(xs - bw, xs + bw, 30).map((x) => g.yUp(x))) - 6
  const paper = range(xs - 18, g.f1 + 48, 40).map((x) => [x, g.yUp(x) - 2.2])
  return (
    <Fig h={300} view="Section · pricking & stitching" scale="true scale ×11">
      <Slab x={g.x1 - 16} y={g.yb + g.lt} w={g.cx - g.x1 + 4} h={11} kind="pad" />
      <DomeX g={g} stitch={{ m: 3, sides: 'r' }} />
      <path d={poly(paper, false)} fill="none" stroke="#efe6d2" strokeWidth="2.4" strokeLinecap="round" />
      {/* the iron, end-on: prongs through the flange */}
      <path d={`M${xs - 2.4} ${bodyY} L${xs + 2.4} ${bodyY} L${xs} ${g.yBot + 5} Z`} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" />
      <rect x={xs - bw} y={bodyY - 22} width={bw * 2} height={22} rx="2" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
      <path d={`M${xs - 7} ${bodyY - 22} L${xs - 5} ${bodyY - 62} L${xs + 5} ${bodyY - 62} L${xs + 7} ${bodyY - 22} Z`} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.8" />
      <rect x={xs - 9} y={bodyY - 72} width="18" height="11" rx="2" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
      <Arrow a={[xs, bodyY - 100]} b={[xs, bodyY - 78]} w={1.8} />
      {/* needles through the right flange */}
      <Needle x1={xr} y1={g.yUp(xr) - 3} x2={xr + 50} y2={g.yUp(xr) - 50} thread={`M${xr + 50} ${g.yUp(xr) - 50} q14 -12 30 -6`} />
      <Needle x1={xr} y1={g.yBot + 3} x2={xr + 50} y2={g.yBot + 46} thread={`M${xr + 50} ${g.yBot + 46} q14 10 30 2`} />
      {/* never through the dome */}
      <line x1={g.cx} y1={g.crest - 22} x2={g.cx} y2={g.yBot + 14} stroke={C.ruby} strokeWidth="1.2" strokeDasharray="4 3" />
      <Verdict x={g.cx} y={g.yBot + 28} ok={false} />
      <T x={g.cx} y={g.yBot + 54} a="middle" s={11} c={C.ruby}>
        never through the dome
      </T>
      <Lead p={[xs - bw, bodyY - 12]} t={[124, 104]} text="pricking iron" sub="seen end-on" a="end" />
      <Lead p={[212, g.yUp(212) - 3]} t={[222, 62]} text="paper over the dome" sub="keeps the iron off it" />
      <Lead p={[xr + 40, g.yUp(xr) - 42]} t={[384, 46]} text="saddle stitch" sub="two needles" s={11} />
      <Lead p={[xs, g.yBot + 3]} t={[140, 262]} text="prongs: flange only" sub="top + lining, on a pad" a="end" />
      <T x={466} y={290} a="end" s={10.5} mono c={C.dim}>
        3 mm in · pitch 3 · thread 0.45–0.55
      </T>
    </Fig>
  )
}

/* 13 · Set the seam — hammer the stitches flat on the flange */
function PSet() {
  const k = 12
  const tt = 1.2 * k
  const lt = 0.8 * k
  const y = 112
  const xa = 46
  const xb = 410
  const p = 27
  const holes = range(xa + 14, xb - 14, Math.round((xb - xa - 28) / p))
  const mid = 232
  const yS = y + tt + lt + 3
  const g = domeG({ cx: 112, yb: 254, s: 5.5 })
  const ax = g.x2 - 3 * g.s
  const ha = holes.findIndex((x) => x > mid + 6)
  return (
    <Fig h={300} view="Section A–A · along the flange" scale="thickness ×4">
      <Slab x={xa - 10} y={yS} w={xb - xa + 20} h={14} kind="granite" />
      <Ply x1={xa} x2={xb} y={y} t={tt} />
      <Ply x1={xa} x2={xb} y={y + tt} t={lt} k="lining" />
      <g stroke={C.thread} strokeLinecap="round" fill="none">
        {holes.map((x, i) => (
          <line key={'v' + i} x1={x} y1={y - 1} x2={x} y2={y + tt + lt + 1} strokeWidth="1.4" />
        ))}
        {holes.slice(0, -1).map((x, i) => {
          const x2 = holes[i + 1]
          return x < mid ? (
            <g key={'s' + i}>
              <path d={`M${x} ${y - 1} Q${(x + x2) / 2} ${y - 9} ${x2} ${y - 1}`} strokeWidth="2" />
              <path d={`M${x} ${y + tt + lt + 1} Q${(x + x2) / 2} ${y + tt + lt + 4} ${x2} ${y + tt + lt + 1}`} strokeWidth="1.8" opacity="0.7" />
            </g>
          ) : (
            <g key={'s' + i}>
              <line x1={x} y1={y + 0.6} x2={x2} y2={y + 0.6} strokeWidth="2.2" />
              <line x1={x} y1={y + tt + lt - 0.6} x2={x2} y2={y + tt + lt - 0.6} strokeWidth="1.8" opacity="0.7" />
            </g>
          )
        })}
      </g>
      <line x1={mid} y1={96} x2={mid} y2={yS + 16} stroke={C.line} strokeWidth="1" strokeDasharray="2 4" />
      <Hammer x={mid + 96} y={y - 3} k={1} />
      <T x={(xa + mid) / 2} y={60} a="middle" s={11.5} c={C.text} w="600">
        Before: thread stands proud
      </T>
      <T x={(mid + xb) / 2} y={60} a="middle" s={11.5} c={C.emerald} w="600">
        Set: hammered flat
      </T>
      <Lead p={[(holes[1] + holes[2]) / 2, y - 7]} t={[112, 86]} text="loops ride above the grain" c={C.dim} />
      <Dim a={[holes[ha], y + tt + lt]} b={[holes[ha + 1], y + tt + lt]} off={22} flip text="3" />
      <Lead p={[xb - 8, y + 6]} t={[422, 112]} text="top" c={C.dim} />
      <Lead p={[xb - 8, y + tt + 5]} t={[422, 134]} text="lining" c={C.dim} />
      <T x={xb + 14} y={yS + 11} s={10} c={C.faint}>
        slab
      </T>

      <Sep x1={14} y1={204} x2={466} y2={204} />
      <Tag x={14} y={222}>Where A–A is cut</Tag>
      <DomeX g={g} stitch={{ m: 3 }} />
      <line x1={ax} y1={g.crest - 10} x2={ax} y2={g.yBot + 12} stroke={C.brass} strokeWidth="1.2" strokeDasharray="8 3 2 3" />
      <T x={ax + 4} y={g.crest - 12} s={10.5} c={C.brass} w="600">
        A
      </T>
      <T x={ax + 4} y={g.yBot + 22} s={10.5} c={C.brass} w="600">
        A
      </T>
      <Note x={214} y={240} lines={['A–A runs down the stitch line, on the flange:', 'only top and lining are struck. Keep the', 'hammer off the dome — it would flatten the filler.']} s={10.5} lh={14} />
    </Fig>
  )
}

/* 14 · Edges — a multi-layer edge, painted */
function PEdges() {
  const g = domeG({ cx: 100, yb: 150, s: 7 })
  const K = 30
  const ex = 252 // the cut leather edge
  const ytop = 106
  const tTop = 1.2 * K
  const tVel = 0.2 * K
  const tLin = 0.8 * K
  const yv = ytop + tTop
  const yl = yv + tVel
  const yB = yl + tLin
  const b = 10 // light bevel
  const xe = 348
  const prof = (o) => `M${ex + b - o * 0.4} ${ytop - o} L${ex - o} ${ytop + b - o * 0.4} L${ex - o} ${yB - b + o * 0.4} L${ex + b - o * 0.4} ${yB + o}`
  const fx = ex - 9
  return (
    <Fig h={300} view="Detail · the painted edge" scale="detail ×30">
      <Tag x={14} y={40}>Full section</Tag>
      <DomeX g={g} paint vel={0.6} />
      <circle cx={g.x1 + 1} cy={g.yb - 2} r={12} fill="none" stroke={C.brass} strokeWidth="1.2" />
      <rect x={ex - 22} y={ytop - 30} width={xe - ex + 30} height={yB - ytop + 60} rx="6" fill="none" stroke={C.brass} strokeWidth="0.9" strokeDasharray="4 3" opacity="0.7" />
      <line x1={g.x1 + 4} y1={g.yb - 13} x2={ex - 22} y2={ytop - 26} stroke={C.brass} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
      <line x1={g.x1 + 4} y1={g.yb + 9} x2={ex - 22} y2={yB + 26} stroke={C.brass} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
      {/* magnified edge */}
      <rect x={ex} y={ytop} width={xe - ex} height={tTop} fill={TOPF} />
      <rect x={ex} y={yv} width={xe - ex} height={tVel} fill={C.velodon} />
      <rect x={ex} y={yl} width={xe - ex} height={tLin} fill="url(#sk-linS)" />
      <path d={`M${ex + b} ${ytop} L${xe} ${ytop}`} stroke={GRAIN} strokeWidth="2.2" />
      <path d={`M${ex} ${ytop} L${ex + b} ${ytop} L${ex} ${ytop + b} Z M${ex} ${yB} L${ex + b} ${yB} L${ex} ${yB - b} Z`} fill={C.ground} />
      <path d={`M${ex + b} ${ytop} L${ex} ${ytop + b} L${ex} ${yB - b} L${ex + b} ${yB}`} fill="none" stroke={EDGE} strokeWidth="0.8" />
      {[7.5, 5, 2.5].map((o, i) => (
        <path key={o} d={prof(o)} fill="none" stroke={['#2b1e14', '#3b2a1d', '#4a3524'][i]} strokeWidth="2.7" strokeLinejoin="round" strokeLinecap="round" />
      ))}
      {[6.2, 3.7].map((o) => (
        <path key={o} d={prof(o)} fill="none" stroke="#7a5638" strokeWidth="0.5" strokeLinejoin="round" opacity="0.8" />
      ))}
      <Brk x={xe} y1={ytop - 6} y2={yB + 6} />
      <line x1={fx} y1={ytop - 22} x2={fx} y2={yB + 22} stroke={C.brass} strokeWidth="1" strokeDasharray="4 3" />
      <Applicator x={ex - 13} y={(ytop + yB) / 2 + 6} ang={-125} k={0.72} />
      <Lead p={[fx, ytop - 18]} t={[272, 50]} text="finished width" sub="the leather is cut a hair inside" c={C.brass} />
      <Lead p={[xe - 30, ytop + 14]} t={[366, ytop + 14]} text="top" />
      <Lead p={[xe - 30, yv + 3]} t={[366, yv + 6]} text="reinforcement" c={C.velodon} />
      <Lead p={[xe - 30, yl + 14]} t={[366, yl + 18]} text="lining" />
      <Lead p={[ex - 6, yB - 2]} t={[274, 222]} text="3–4 thin coats, sanded between" sub="light bevel first" />
      <Lead p={[ex - 52, (ytop + yB) / 2 + 40]} t={[150, 222]} text="roller pen" a="end" c={C.dim} />

      <Sep x1={14} y1={252} x2={466} y2={252} />
      <Verdict x={28} y={274} ok={false} r={8} />
      <Note x={44} y={270} lines={['Burnish only if every layer is veg-tan. A padded stack — chrome lining,', 'filler, reinforcement — will not compress evenly, so paint it.']} s={10.5} lh={14} />
    </Fig>
  )
}

/* 15 · Keepers — ends skived to half, sized over the dome */
function PKeepers() {
  const g = domeG({ cx: 160, yb: 210, s: 8 })
  const lw = 18 * 8
  const ltT = 1.2 * 8
  const ltL = 0.8 * 8
  const tailY = g.crest - ltT - ltL
  const kt = 1.2 * 8
  const ix1 = g.x1 - 4
  const ix2 = g.x2 + 4
  const iy1 = tailY - 3
  const iy2 = g.yBot + 3
  const ring = `M${ix1 - kt} ${iy1 - kt + 6} Q${ix1 - kt} ${iy1 - kt} ${ix1 - kt + 6} ${iy1 - kt} L${ix2 + kt - 6} ${iy1 - kt} Q${ix2 + kt} ${iy1 - kt} ${ix2 + kt} ${iy1 - kt + 6} L${ix2 + kt} ${iy2 + kt - 6} Q${ix2 + kt} ${iy2 + kt} ${ix2 + kt - 6} ${iy2 + kt} L${ix1 - kt + 6} ${iy2 + kt} Q${ix1 - kt} ${iy2 + kt} ${ix1 - kt} ${iy2 + kt - 6} Z M${ix1 + 3} ${iy1} L${ix2 - 3} ${iy1} Q${ix2} ${iy1} ${ix2} ${iy1 + 3} L${ix2} ${iy2 - 3} Q${ix2} ${iy2} ${ix2 - 3} ${iy2} L${ix1 + 3} ${iy2} Q${ix1} ${iy2} ${ix1} ${iy2 - 3} L${ix1} ${iy1 + 3} Q${ix1} ${iy1} ${ix1 + 3} ${iy1} Z`
  // keeper strip, side view (right panel)
  const st = 12
  const sx1 = 356
  const sx2 = 450
  const sy = 92
  const sl = 30
  const ly = 168
  return (
    <Fig h={300} view="Section · floating keeper" scale="true scale ×8">
      <Tag x={14} y={40}>Across the keeper</Tag>
      <DomeX g={g} paint />
      <rect x={g.cx - lw / 2} y={tailY} width={lw} height={ltT} fill={TOPF} stroke={EDGE} strokeWidth="0.8" />
      <line x1={g.cx - lw / 2} y1={tailY} x2={g.cx + lw / 2} y2={tailY} stroke={GRAIN} strokeWidth="1.6" />
      <rect x={g.cx - lw / 2} y={tailY + ltT} width={lw} height={ltL} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" />
      <path d={ring} fill="url(#sk-dark)" fillRule="evenodd" stroke="#e0b277" strokeWidth="0.8" />
      <path d={`M${g.cx - 16} ${iy2} L${g.cx + 16} ${iy2 + kt}`} stroke="#e0b277" strokeWidth="1.2" />
      <VDim x={ix2 + kt + 14} y1={iy1} y2={iy2} />
      <line x1={ix2} y1={iy1} x2={ix2 + kt + 18} y2={iy1} stroke={C.dim} strokeWidth="0.6" opacity="0.6" />
      <line x1={ix2} y1={iy2} x2={ix2 + kt + 18} y2={iy2} stroke={C.dim} strokeWidth="0.6" opacity="0.6" />
      <T x={ix2 + kt + 20} y={(iy1 + iy2) / 2 - 4} s={10.5} mono>
        dome
      </T>
      <T x={ix2 + kt + 20} y={(iy1 + iy2) / 2 + 10} s={10.5} mono>
        + tail
      </T>
      <Cap p={[g.cx + 30, tailY + 4]} x={g.cx + 36} y={96} a="start" text="long piece · 2.2" c={C.dim} />
      <Cap p={[g.cx - 40, g.yUp(g.cx - 40) + 4]} x={g.cx - 46} y={118} a="start" text="short piece, domed · 4–4.5" c={C.dim} />
      <Cap p={[ix1 - kt + 2, iy2]} x={40} y={268} a="start" text="keeper · 5 × 1.2" />
      <Cap p={[g.cx, iy2 + kt / 2]} x={g.cx + 10} y={286} a="start" text="lap joint at the back" />

      <Sep x1={330} y1={28} x2={330} y2={290} />
      <Tag x={340} y={40}>Strip · ends skived</Tag>
      <path d={poly([[sx1, sy + st / 2], [sx1 + sl, sy], [sx2, sy], [sx2, sy + st / 2], [sx2 - sl, sy + st], [sx1, sy + st]])} fill="url(#sk-topS)" stroke={EDGE} strokeWidth="0.8" />
      <path d={`M${sx1} ${sy} L${sx1 + sl} ${sy} L${sx1} ${sy + st / 2} Z M${sx2} ${sy + st} L${sx2 - sl} ${sy + st} L${sx2} ${sy + st / 2} Z`} fill="url(#sk-fadeL)" opacity="0.6" />
      <line x1={sx1 - 4} y1={sy + st / 2} x2={sx1 - 4} y2={sy + st} stroke={C.text} strokeWidth="1" />
      <line x1={sx2 + 4} y1={sy} x2={sx2 + 4} y2={sy + st / 2} stroke={C.text} strokeWidth="1" />
      <T x={sx1 - 8} y={sy + st} a="end" s={10.5} mono c={C.text}>
        ½
      </T>
      <T x={sx2 + 8} y={sy + st / 2} s={10.5} mono c={C.text}>
        ½
      </T>
      <T x={(sx1 + sx2) / 2} y={sy + st + 30} a="middle" s={10.5}>
        opposite faces (scarf)
      </T>
      <path d={poly([[sx1 + 6, ly], [416, ly], [416, ly + st / 2], [416 - sl, ly + st], [sx1 + 6, ly + st]])} fill="url(#sk-topS)" stroke={EDGE} strokeWidth="0.8" />
      <path d={poly([[416 - sl, ly + st], [416, ly + st / 2], [416, ly], [458, ly], [458, ly + st], [416 - sl, ly + st]])} fill="#a77845" stroke={EDGE} strokeWidth="0.8" />
      <T x={400} y={ly + 32} a="middle" s={11} c={C.emerald} w="600">
        Lapped ≈ one thickness
      </T>
      <Note x={340} y={236} lines={['Size it over the crown:', 'wrap the domed short', 'piece with the long one', 'inside, then mark.']} s={10.5} lh={14} />
    </Fig>
  )
}

/* 16 · Holes, hardware — holes start where the filler ends */
function PHardware() {
  const s = 3
  const TP = { x: 50, y: 82, s }
  const X = (mm) => TP.x + mm * s
  const hx = holeXs(120)
  const first = Math.min(...hx)
  const last = Math.max(...hx)
  const g = padG({ ox: 50, y: 232, s, k: 9, len: 120, fillers: [{ from: 10, to: first - 5, h: 2.2, ramp: 4 }], right: 'tip', tailEnd: 10 })
  return (
    <Fig h={320} view="Plan + section · long piece" scale="section thickness ×3">
      <StrapPlan T={TP} o={LONG()} filler={{ inset: 4, from: 10, to: first - 5 }} stitch={{ m: 3, p: 3, from: 5 }} holes={{}} edge={C.paint} />
      <SpringBar x={50} y1={46} y2={118} r={2.6} />
      <Dim a={[X(first - 5), 54]} b={[X(first), 54]} off={-8} flip text="5" />
      <line x1={X(first - 5)} y1={54} x2={X(first - 5)} y2={TP.y - 18} stroke={C.dim} strokeWidth="0.6" opacity="0.6" />
      <line x1={X(first)} y1={54} x2={X(first)} y2={TP.y - 4} stroke={C.dim} strokeWidth="0.6" opacity="0.6" />
      <Dim a={[X(first + 14), 54]} b={[X(first + 21), 54]} off={-8} flip text="7" />
      <Dim a={[X(last), 116]} b={[X(120), 116]} off={8} flip text="25" />
      <T x={X(74)} y={138} a="middle" s={10.5} mono>
        7 holes × 7 · Ø 1.5–2
      </T>
      <Cap p={[X(28), TP.y + 6]} x={X(28)} y={138} text="filler under the dome" c={C.brass} />
      <Lead p={[X(first), TP.y]} t={[160, 36]} text="first hole" a="end" />

      <Sep x1={14} y1={154} x2={466} y2={154} />
      <PadLong g={g} holes={hx} />
      <Punch x={X(first)} y={g.y - g.tt - 1} d={1.8 * s + 1} k={0.8} />
      <VDim x={X(16)} y1={g.yTop(X(16))} y2={g.y + g.lt} />
      <T x={X(16) + 6} y={g.yTop(X(16)) - 6} s={10.5} mono c={C.text}>
        4–4.5
      </T>
      <line x1={X(120) + 8} y1={g.y - g.tt} x2={X(120) + 8} y2={g.y + g.lt} stroke={C.dim} strokeWidth="0.9" />
      <T x={X(120) + 6} y={g.y - g.tt - 8} a="end" s={10.5} mono c={C.text}>
        2.2
      </T>
      <Cap p={[X(32), g.y - 6]} x={X(32)} y={284} text="filler tapers to nothing" c={C.dim} />
      <Lead p={[X(first) + 4, g.y - g.tt - 30]} t={[X(first) + 30, 186]} text="punch where the stack is flat" />
      <T x={240} y={308} a="middle" s={10.5} c={C.faint}>
        Then fit bars and buckle, condition, and run the ten checks.
      </T>
    </Fig>
  )
}

/* Variant · four padded profiles */
function PProfiles() {
  const s = 4.8
  const k = 9.6
  const yb = 140
  const cols = [
    { cx: 64, name: 'Flat', sub: 'no filler', fh: 0, m: 3 },
    { cx: 180, name: 'Domed', sub: 'this course', fh: 2.2, inset: 4, prof: kama, m: 3 },
    { cx: 296, name: 'Full', sub: 'filler near the edge', fh: 2.2, inset: 1.8, prof: fullP, m: 1.2 },
    { cx: 412, name: 'Square', sub: 'full width, flat top', fh: 2.0, inset: 1.8, prof: squareP, m: 1.2 },
  ]
  return (
    <Fig h={316} view="Comparison · padded profiles across" scale="width ×4.8 · thickness ×2">
      {cols.map((c) => {
        const g = domeG({ cx: c.cx, yb, s, k, inset: c.inset ?? 4, fh: c.fh, prof: c.prof ?? kama })
        const hl = c.name === 'Domed'
        return (
          <g key={c.name}>
            {hl && <rect x={c.cx - 56} y={30} width={112} height={206} rx="8" fill="rgba(208,168,79,0.06)" stroke={C.brass} strokeWidth="0.9" strokeDasharray="3 3" />}
            <T x={c.cx} y={50} a="middle" s={12} c={hl ? C.brass : C.text} w="600">
              {c.name}
            </T>
            <T x={c.cx} y={64} a="middle" s={10} c={C.faint}>
              {c.sub}
            </T>
            <DomeX g={g} paint stitch={{ m: c.m, sides: 'r' }} />
            {c.fh > 0 && (
              <g>
                <line x1={g.f2} y1={g.yBot + 2} x2={g.f2} y2={g.yBot + 16} stroke={C.brass} strokeWidth="0.7" />
                <line x1={g.x2} y1={g.yBot + 2} x2={g.x2} y2={g.yBot + 16} stroke={C.brass} strokeWidth="0.7" />
                <line x1={g.f2} y1={g.yBot + 12} x2={g.x2} y2={g.yBot + 12} stroke={C.brass} strokeWidth="2" />
                <T x={(g.f2 + g.x2) / 2} y={g.yBot + 28} a="middle" s={10} c={C.brass}>
                  {hl ? '4' : 'narrow'}
                </T>
              </g>
            )}
            {/* plan strip below: flange (dark), dome (light) and stitch lines */}
            <rect x={g.x1} y={190} width={g.W} height={34} rx="2" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
            {c.fh > 0 && <rect x={g.f1} y={190} width={g.FW} height={34} fill="rgba(255,236,200,0.16)" stroke="#d9b07a" strokeWidth="0.7" strokeDasharray="3 2" />}
            {[g.x1 + c.m * s, g.x2 - c.m * s].map((x, i) => (
              <line key={i} x1={x} y1={194} x2={x} y2={220} stroke={C.thread} strokeWidth="1.4" strokeDasharray="3 2" />
            ))}
          </g>
        )
      })}
      <T x={14} y={186} s={10} c={C.faint}>
        plan
      </T>
      <T x={180} y={252} a="middle" s={10.5} mono c={C.brass}>
        stitch 3 mm in
      </T>
      <T x={354} y={252} a="middle" s={10.5} c={C.text}>
        narrow flange: the stitch runs close to the step
      </T>
      <path d="M246 260 L462 260" stroke={C.line} strokeWidth="1" />
      <Legend x={20} y={280} items={[['top', 'top'], ['filler', 'filler'], ['lining', 'lining'], ['paint', 'edge paint'], ['thread', 'stitch']]} />
      <T x={14} y={304} s={10.5} c={C.faint}>
        Full and square need a wider filler; their flange widths here are illustrative, not sourced.
      </T>
    </Fig>
  )
}

/* Variant · turned-edge padded */
function turnedShapes({ cx, yc, s, turned = true }) {
  const xl = cx - 10 * s
  const xr = cx + 10 * s
  const ct = 1.0 * s
  const tt = 0.8 * s
  const c2 = ct / 2
  const fh = 2.0 * s
  const fwh = 8 * s // fleece half width (inset 2 mm)
  const hf = (x) => fh * kama((x - cx) / fwh)
  const m = 4 * s
  const up = range(xl + c2, xr - c2, 140).map((x) => [x, yc - dilate(hf, tt, x)])
  const inner = range(xl + c2, xr - c2, 140).map((x) => [x, yc - hf(x)])
  const R = c2 + tt
  const tEnd = Math.max(1.5, 0.25 * tt)
  const L = (pts) => pts.map(([x, y]) => `L${r1(x)} ${r1(y)}`).join(' ')
  const topD = turned
    ? `M${xl + c2 + m} ${yc + ct + tEnd} L${xl + c2} ${yc + ct + tt} A${R} ${R} 0 0 1 ${xl + c2} ${yc - tt} ${L(up)} A${R} ${R} 0 0 1 ${xr - c2} ${yc + ct + tt} L${xr - c2 - m} ${yc + ct + tEnd} L${xr - c2 - m} ${yc + ct} L${xr - c2} ${yc + ct} A${c2} ${c2} 0 0 0 ${xr - c2} ${yc} ${L(inner.slice().reverse())} A${c2} ${c2} 0 0 0 ${xl + c2} ${yc + ct} L${xl + c2 + m} ${yc + ct} Z`
    : (() => {
        const ext = range(xl - m, xr + m, 160)
        const u2 = ext.map((x) => [x, yc - dilate(hf, tt, x)])
        const l2 = ext.map((x) => [x, yc - hf(x)])
        return poly([...u2, ...l2.reverse()])
      })()
  const grain = turned ? up : range(xl - m, xr + m, 160).map((x) => [x, yc - dilate(hf, tt, x)])
  const marg = (x) => {
    if (x <= xl + c2 + m) return tt - ((tt - tEnd) * (x - xl - c2)) / m
    if (x >= xr - c2 - m) return tt - ((tt - tEnd) * (xr - c2 - x)) / m
    return 0
  }
  const lt = 0.6 * s
  const lin = range(xl + c2 + 1, xr - c2 - 1, 120).map((x) => [x, yc + ct + marg(x)])
  const linD = poly([...lin, [xr - c2 - 1, yc + ct + tt + lt], [xl + c2 + 1, yc + ct + tt + lt]])
  const fillD = poly([[cx - fwh, yc], ...range(cx - fwh, cx + fwh, 80).map((x) => [x, yc - hf(x)]), [cx + fwh, yc]])
  return { xl, xr, ct, tt, c2, R, m, topD, linD, fillD, grain, hf }
}
function TurnedX({ cx, yc, s, turned = true, lining = true }) {
  const t = turnedShapes({ cx, yc, s, turned })
  return (
    <g>
      <path d={t.fillD} fill="url(#sk-fill)" stroke="#3a2716" strokeWidth="0.8" />
      <rect x={t.xl} y={yc} width={t.xr - t.xl} height={t.ct} rx={t.c2} fill="url(#sk-dark)" stroke="#2e1e10" strokeWidth="0.8" />
      {lining && <path d={t.linD} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" />}
      <path d={t.topD} fill={TOPF} stroke={EDGE} strokeWidth="0.8" strokeLinejoin="round" />
      <path d={poly(t.grain, false)} fill="none" stroke={GRAIN} strokeWidth={Math.max(1.2, s * 0.13)} />
    </g>
  )
}
function PTurned() {
  const s = 14
  const cx = 240
  const yc = 134
  const t = turnedShapes({ cx, yc, s })
  return (
    <Fig h={340} view="Section · turned-edge padded" scale="true scale ×14">
      <Num x={22} y={44} n={3} />
      <T x={36} y={48} s={11} c={C.text}>
        finished: margins turned, lining on
      </T>
      <T x={466} y={48} a="end" s={10.5} c={C.faint}>
        even hornback croc turns over fleece
      </T>
      <TurnedX cx={cx} yc={yc} s={s} />
      <Cap p={[cx, yc - 12]} x={cx} y={74} text="fleece or filler dome" />
      <Cap p={[t.xr - 40, yc + 6]} x={398} y={84} a="start" text="core" sub="firm backing" c={C.dim} />
      <Lead p={[t.xl - t.R + t.c2 + 1, yc + t.ct / 2]} t={[t.xl + 6, 214]} text="grain wraps the core edge" sub="no cut edge, nothing to paint" />
      <Cap p={[t.xr - t.c2 - 30, yc + t.ct + 5]} x={300} y={196} a="start" text="turned margin, skived" c={C.dim} />
      <Cap p={[cx + 20, yc + t.ct + 4]} x={cx + 30} y={240} a="start" text="lining over the margins" sub="trimmed just inside the fold" />
      <Dim a={[t.xl + t.c2, yc + t.ct + t.tt + 10]} b={[t.xl + t.c2 + t.m, yc + t.ct + t.tt + 10]} flip text="4–5" />

      <Sep x1={14} y1={260} x2={466} y2={260} />
      <Num x={22} y={280} n={1} />
      <T x={36} y={284} s={11} c={C.text}>
        top cemented over the domed core
      </T>
      <TurnedX cx={130} yc={316} s={4.6} turned={false} lining={false} />
      <Num x={252} y={280} n={2} />
      <T x={266} y={284} s={11} c={C.text}>
        margins turned under, hammered
      </T>
      <TurnedX cx={362} yc={316} s={4.6} lining={false} />
      <Arrow d="M300 300 q-12 8 -2 22" w={1.4} />
      <Arrow d="M424 300 q12 8 2 22" w={1.4} />
    </Fig>
  )
}

/* Variant · rolled (cord-cored) — experimental */
function PRolled() {
  const roll = (cx, cy, stitched) => {
    const R = 21
    const a0 = (104 * Math.PI) / 180
    const a1 = (76 * Math.PI) / 180
    const p0 = [cx + R * Math.cos(a0), cy + R * Math.sin(a0)]
    const p1 = [cx + R * Math.cos(a1), cy + R * Math.sin(a1)]
    return (
      <g>
        <path d={`M${p0[0]} ${p0[1]} A${R} ${R} 0 1 1 ${p1[0]} ${p1[1]} L${cx + 5} ${cy + 62} L${cx - 5} ${cy + 62} Z`} fill={TOPF} stroke={EDGE} strokeWidth="0.8" />
        <path d={`M${p0[0]} ${p0[1]} A${R} ${R} 0 1 1 ${p1[0]} ${p1[1]}`} fill="none" stroke={GRAIN} strokeWidth="1.8" />
        <line x1={cx} y1={cy + 16} x2={cx} y2={cy + 62} stroke={EDGE} strokeWidth="0.8" />
        <circle cx={cx} cy={cy} r="16" fill="#cfc2a3" stroke="#7e7258" strokeWidth="0.8" />
        {[-8, 0, 8].map((d) => (
          <path key={d} d={`M${cx - 12} ${cy + d - 4} q12 6 24 0`} fill="none" stroke="#9c9077" strokeWidth="0.9" />
        ))}
        <circle cx={cx} cy={cy} r="16.8" fill="none" stroke={C.glue} strokeWidth="1.6" strokeDasharray="1.2 2.6" />
        {stitched &&
          [cy + 26, cy + 40].map((yy) => (
            <g key={yy}>
              <line x1={cx - 9} y1={yy} x2={cx + 9} y2={yy} stroke={C.thread} strokeWidth="1.6" strokeLinecap="round" />
              <circle cx={cx - 9} cy={yy} r="1.6" fill={C.thread} />
              <circle cx={cx + 9} cy={yy} r="1.6" fill={C.thread} />
            </g>
          ))}
      </g>
    )
  }
  const groove = (gx, r) => `L${gx - r} 186 A${r} ${r} 0 0 0 ${gx + r} 186`
  return (
    <Fig h={312} view="Sequence · rolled strap" scale="schematic · experimental">
      <Num x={24} y={44} n={1} />
      <T x={38} y={48} s={11} c={C.text}>
        wrap & tack
      </T>
      {roll(86, 108, false)}
      <Lead p={[76, 100]} t={[60, 76]} text="cord core" a="end" c={C.dim} />
      <Cap p={[92, 160]} x={86} y={196} text="thin middle piece" sub="cemented to the cord" />

      <Sep x1={162} y1={30} x2={162} y2={238} />
      <Num x={176} y={44} n={2} />
      <T x={190} y={48} s={11} c={C.text}>
        dampen, stitch tight
      </T>
      {roll(238, 108, true)}
      <Arrow a={[226, 148]} b={[196, 156]} w={1.5} />
      <Arrow a={[250, 148]} b={[280, 156]} w={1.5} />
      <Lead p={[226, 94]} t={[212, 76]} text="damp grain" a="end" c={C.steel} />
      <Cap p={[238, 141]} x={238} y={196} text="stitched close" sub="to the cord" />

      <Sep x1={314} y1={30} x2={314} y2={238} />
      <Num x={328} y={44} n={3} />
      <T x={342} y={48} s={11} c={C.text}>
        set in the block
      </T>
      <path d={`M326 186 ${groove(352, 18)} ${groove(400, 14)} ${groove(440, 10)} L462 186 L462 222 L326 222 Z`} fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.9" />
      <circle cx={440} cy={186} r="10" fill={TOPF} stroke={EDGE} strokeWidth="0.8" />
      <circle cx={440} cy={186} r="6.5" fill="#cfc2a3" stroke="#7e7258" strokeWidth="0.6" />
      <rect x={437.5} y={156} width={5} height={22} fill={TOPF} stroke={EDGE} strokeWidth="0.6" />
      <Arrow a={[458, 136]} b={[447, 160]} w={1.6} />
      <Arrow d="M352 160 q24 -20 44 0" w={1.3} dash="3 3" />
      <Arrow d="M402 160 q18 -16 34 -2" w={1.3} dash="3 3" />
      <T x={352} y={240} a="middle" s={10} mono>
        wide
      </T>
      <T x={440} y={240} a="middle" s={10} mono>
        narrow
      </T>
      <T x={394} y={96} a="middle" s={11} c={C.dim}>
        half-round grooves,
      </T>
      <T x={394} y={110} a="middle" s={11} c={C.dim}>
        progressively narrower
      </T>
      <T x={394} y={124} a="middle" s={10} c={C.faint}>
        hardwood block
      </T>

      <Sep x1={14} y1={254} x2={466} y2={254} />
      <Note
        x={240}
        y={276}
        a="middle"
        head="Experimental — no watch-strap tutorial exists"
        hc={C.ruby}
        lines={['This is falconry-glove practice, extrapolated. Treat it as an experiment.']}
        s={10.5}
        lh={15}
      />
    </Fig>
  )
}

/* ================================================================== */
/* RALLY STRAP                                                         */
/* ================================================================== */
const OPEN_L = [18, 29.5, 41] // opening centres, long piece (mm from the lug fold)
const OPEN_S = [19, 30.5, 42] // short piece
const OD = 5 // drawn diameter of the classic three-opening layout (measured standard: see ra-sizes)

/* 1 · Pattern — two-piece, 120 / 75–80, 2 mm taper */
function RaPattern() {
  const s = 3
  const TL = { x: 60, y: 76, s }
  const TS = { x: 60, y: 196, s }
  const XL = (mm) => TL.x + mm * s
  const XS = (mm) => TS.x + mm * s
  return (
    <Fig h={316} view="Plan · rally pattern" scale="card templates · true plan">
      <StrapPlan T={TL} o={LONG()} face="card" centre folds={[{ x: 0, label: 'lug fold' }]} />
      <Dim a={[TL.x, 106]} b={[XL(120), 106]} off={12} flip text="120" />
      <Dim a={[48, TL.y - 30]} b={[48, TL.y + 30]} flip text="20" />
      <Dim a={[XL(100), TL.y - 27]} b={[XL(100), TL.y + 27]} />
      <T x={XL(100) + 6} y={TL.y - 8} s={10.5} mono c={C.text}>
        18
      </T>
      <Cap p={[XL(40), TL.y]} x={XL(40)} y={148} text="centreline: the openings go on it" c={C.steel} />
      <StrapPlan T={TS} o={SHORT()} face="card" centre folds={[{ x: 0 }, { x: 80 }]} />
      <line x1={XS(75)} y1={TS.y - 32} x2={XS(75)} y2={TS.y + 32} stroke={C.dim} strokeWidth="0.9" strokeDasharray="2 3" />
      <T x={XS(75) - 3} y={TS.y - 36} a="end" s={10} mono>
        75
      </T>
      <T x={XS(80) + 4} y={TS.y - 36} s={10.5}>
        80 · buckle fold
      </T>
      <T x={XS(0)} y={TS.y - 36} a="middle" s={10.5}>
        lug fold
      </T>
      <Dim a={[TS.x, 226]} b={[XS(80), 226]} off={12} flip text="75–80" />
      <Dim a={[XS(80) + 10, TS.y - 27]} b={[XS(80) + 10, TS.y + 27]} text="18" />
      <Dim a={[48, TS.y - 30]} b={[48, TS.y + 30]} flip text="20" />
      <T x={XS(40)} y={TS.y - 8} a="middle" s={10.5} c={C.text}>
        2 mm taper · 20 → 18
      </T>
      <Note x={334} y={184} head="Commercial rally" hc={C.text} lines={['120 / 80 or 120 / 75', '4 → 1.8 mm thick (Barton)', '5 → 3 mm (Strapsco GT)']} s={10.5} lh={14} />
      <Sep x1={14} y1={268} x2={466} y2={268} />
      <Note x={14} y={288} lines={['The openings come from ventilated racing-driver gloves;', 'the pattern itself is the standard two-piece strap.']} s={10.5} lh={14} c={C.faint} />
    </Fig>
  )
}

/* 2 · Lay out the openings — in the clear zone */
function RaLayout() {
  const s = 2.9
  const TL = { x: 52, y: 82, s }
  const TS = { x: 52, y: 204, s }
  const XL = (mm) => TL.x + mm * s
  const XS = (mm) => TS.x + mm * s
  return (
    <Fig h={316} view="Plan · laying out the openings" scale="on the card pattern">
      <StrapPlan T={TL} o={LONG()} face="card" centre stitch={{ mode: 'line', m: 3, from: 5 }} holes={{}} />
      <Zone T={TL} o={LONG()} from={-2} to={11} />
      <Zone T={TL} o={LONG()} from={49} to={99} />
      <Zone T={TL} o={LONG()} from={13} to={46} half={6.4} kind="clear" />
      <Openings T={TL} xs={OPEN_L} d={OD} look="mark" />
      <T x={XL(5)} y={TL.y - 36} a="middle" s={10.5} c={C.ruby}>
        lug fold
      </T>
      <T x={XL(74)} y={TL.y - 36} a="middle" s={10.5} c={C.ruby}>
        adjustment-hole zone
      </T>
      <Cap p={[XL(29.5), TL.y + 14]} x={XL(29.5)} y={136} text="clear zone: on the centreline, inside the stitch line" c={C.emerald} />
      <Cap p={[XL(110), TL.y + 6.4 * s]} x={440} y={136} a="end" text="stitch line, 3 mm" c={C.dim} />

      <StrapPlan T={TS} o={SHORT()} face="card" centre stitch={{ mode: 'line', m: 3, from: 5, to: 66 }} keepers={[{ x: 70 }]} />
      <Zone T={TS} o={SHORT()} from={-2} to={11} />
      <Zone T={TS} o={SHORT()} from={53} to={82} />
      <Zone T={TS} o={SHORT()} from={13} to={48} half={6.4} kind="clear" />
      <Openings T={TS} xs={OPEN_S} d={OD} look="mark" />
      <T x={XS(5)} y={TS.y + 46} a="middle" s={10.5} c={C.ruby}>
        lug fold
      </T>
      <T x={XS(67)} y={TS.y + 46} a="middle" s={10.5} c={C.ruby}>
        keeper & buckle-fold zone
      </T>
      <Lead p={[XS(OPEN_S[2]) + 3.5 * s, TS.y]} t={[300, 182]} text="Ø: see Size the openings" sub="graded ≈4.5–5 / 2.2–2.5 mm" c={C.brass} />
      <Sep x1={14} y1={268} x2={466} y2={268} />
      <Note x={14} y={288} lines={['Measured on 20 mm racing straps: large Ø ≈4.5–5 mm, small 2.2–2.5 mm (graded);', 'see Size the openings. Shown here: the classic three per piece.']} s={10.5} lh={14} />
    </Fig>
  )
}

/* 3 · Prick the centres — dividers stepped along the centreline */
function RaCentres() {
  const TP = { x: 46, y: 80, s: 4 }
  const X = (mm) => TP.x + mm * TP.s
  const marks = OPEN_L.map(X)
  const gy = 262
  return (
    <Fig h={316} view="Plan + side · pricking the centres" scale="plan ×4">
      <ClipRect x={10} y={30} w={X(52) - 10} h={100}>
        <StrapPlan T={TP} o={LONG()} face="card" centre folds={[{ x: 0 }]} />
      </ClipRect>
      <Brk x={X(52)} y1={TP.y - 44} y2={TP.y + 44} />
      {marks.slice(0, -1).map((x, i) => {
        const x2 = marks[i + 1]
        return <Arrow key={i} d={`M${x} ${TP.y - 4} A${(x2 - x) / 2} ${(x2 - x) / 2} 0 0 1 ${x2} ${TP.y - 4}`} w={1.4} dash="4 3" />
      })}
      {marks.map((x) => (
        <g key={x}>
          <circle cx={x} cy={TP.y} r={(OD / 2) * TP.s} fill="none" stroke={C.brass} strokeWidth="0.9" strokeDasharray="2 3" opacity="0.7" />
          <circle cx={x} cy={TP.y} r="2.6" fill={C.text} />
        </g>
      ))}
      <Dim a={[marks[0], TP.y + 32]} b={[marks[1], TP.y + 32]} off={12} flip text="p" />
      <Dim a={[marks[1], TP.y + 32]} b={[marks[2], TP.y + 32]} off={12} flip text="p" />
      <Lead p={[marks[2], TP.y]} t={[300, 56]} text="pricked centres" sub="equal steps, p from your pattern" />
      <Lead p={[X(48), TP.y]} t={[300, 104]} text="centreline, scribed first" c={C.steel} />

      <Sep x1={14} y1={150} x2={466} y2={150} />
      <Tag x={14} y={168}>Side · walking the dividers</Tag>
      <Ply x1={24} x2={240} y={gy} t={9} />
      {[60, 106, 152].map((x, i) => (
        <path key={x} d={`M${x - 2.5} ${gy - 0.5} L${x} ${gy + 3} L${x + 2.5} ${gy - 0.5}`} fill={C.hole} opacity={i === 2 ? 0.4 : 1} />
      ))}
      <Dividers x={83} y={gy - 0.5} sp={46} h={64} />
      <Arrow d={`M60 ${gy - 8} A46 46 0 0 1 152 ${gy - 8}`} w={1.4} dash="4 3" />
      <T x={106} y={gy + 28} a="middle" s={10.5}>
        pivot on the last mark, swing to the next
      </T>

      <Sep x1={256} y1={160} x2={256} y2={306} />
      <Tag x={268} y={168}>Punch on the mark · plan</Tag>
      {[
        [318, true],
        [418, false],
      ].map(([cx, ok]) => (
        <g key={cx}>
          <rect x={cx - 42} y={190} width={84} height={66} rx="3" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
          <circle cx={cx} cy={223} r="2.6" fill={C.hole} />
          <circle cx={ok ? cx : cx + 6} cy={ok ? 223 : 219} r="22" fill="none" stroke="url(#sk-steelH)" strokeWidth="4" />
          <circle cx={ok ? cx : cx + 6} cy={ok ? 223 : 219} r="20" fill="none" stroke="#3b4850" strokeWidth="0.6" />
          <Verdict x={cx + 36} y={196} ok={ok} r={8} />
        </g>
      ))}
      <T x={318} y={274} a="middle" s={10.5}>
        mouth even all round
      </T>
      <T x={418} y={274} a="middle" s={10.5}>
        off the mark
      </T>
      <T x={364} y={294} a="middle" s={10.5} c={C.faint}>
        align the punch's edge to the mark
      </T>
    </Fig>
  )
}

/* 4 · Cut — top and lining blanks */
function RaCut() {
  const s = 2.5
  const ox = 40
  const X = (mm) => ox + mm * s
  const TT = { x: ox, y: 78, s }
  const TLn = { x: ox, y: 198, s }
  return (
    <Fig h={290} view="Plan · blanks" scale="true plan ×2.5">
      <rect x={X(-5)} y={78 - 15 * s} width={130 * s} height={30 * s} rx="2" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="1" />
      <StrapPlan T={TT} o={LONG()} face="none" dash="5 3" edge={C.thread} centre />
      <Openings T={TT} xs={OPEN_L} d={OD} look="mark" />
      <Rule x={X(4)} y={78 + 15 * s} len={250} s={s} side="below" />
      <Knife kind="utility" x={X(4) + 250} y={78 + 15 * s} ang={35} k={0.55} />
      <Arrow a={[X(4) + 196, 78 + 15 * s - 8]} b={[X(4) + 236, 78 + 15 * s - 8]} w={1.5} />
      <Dim a={[X(-5) - 6, 78 - 15 * s]} b={[X(-5) - 6, 78 + 15 * s]} flip text="30" />
      <Lead p={[X(OPEN_L[1]), 78]} t={[X(OPEN_L[1]) + 10, 28]} text="centres transferred from the pattern" c={C.brass} />
      <T x={X(70)} y={142} a="middle" s={10.5} c={C.dim}>
        rough-cut along a rule, blade upright, light passes
      </T>

      <rect x={X(-2)} y={198 - 20 * s} width={127 * s} height={40 * s} rx="2" fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="1" />
      <StrapPlan T={TLn} o={LONG({ x0: 2 })} face="none" dash="5 3" edge="#7d6a4a" />
      <Dim a={[X(-2) - 6, 198 - 20 * s]} b={[X(-2) - 6, 198 + 20 * s]} flip text="40" />
      <Note x={X(30)} y={194} lines={['contrasting lining', '(it will show through)']} s={10.5} lh={14} c={C.hole} />

      <Sep x1={X(126) + 8} y1={30} x2={X(126) + 8} y2={280} />
      <Note x={X(126) + 18} y={56} head="Top" hc={C.text} lines={['~10 mm oversize:', '30 mm for a 20', 'mm strap']} s={10.5} lh={14} />
      <Note x={X(126) + 18} y={174} head="Lining" hc={C.text} lines={['≥ 20 mm wider:', '40 mm; cut it', 'in a contrast', 'colour for the', 'underlay look']} s={10.5} lh={14} />
    </Fig>
  )
}

/* 5 · Underlay look — punch the top only, before assembly */
function RaUnderlay() {
  const s = 7
  const k = 14
  const cx = 146
  const tt = 1.2 * k
  const lt = 0.8 * k
  const y = 160
  const r = (OD / 2) * s
  const TP = { x: 268, y: 98, s: 3.6 }
  const xc = 356
  const yx = 222
  const xr = (OD / 2) * 6
  return (
    <Fig h={300} view="Section + plan · underlay look" scale="section thickness ×2">
      <Tag x={14} y={40}>Punch the top only</Tag>
      <Slab x={cx - 86} y={y + tt} w={172} h={14} kind="pad" />
      <Ply x1={cx - 70} x2={cx - r} y={y} t={tt} />
      <Ply x1={cx + r} x2={cx + 70} y={y} t={tt} />
      <Punch x={cx} y={y + tt} d={2 * r} k={1} />
      <Mallet x={cx} y={y + tt - 66} k={0.62} />
      <Ply x1={cx - 70} x2={cx + 70} y={y + tt + 34} t={lt} k="lining" />
      <Cap p={[cx - 62, y + 4]} x={16} y={116} a="start" text="top only," sub="before assembly" />
      <Cap p={[cx + 74, y + tt + 7]} x={232} y={146} a="end" text="pad" c={C.dim} />
      <T x={cx} y={y + tt + 62} a="middle" s={10.5} c={C.text}>
        lining stays whole
      </T>
      <T x={cx} y={y + tt + 76} a="middle" s={10} c={C.faint}>
        punched only for see-through
      </T>
      <T x={cx} y={y + tt + 92} a="middle" s={10} c={C.faint}>
        Ø: see Size the openings
      </T>

      <Sep x1={246} y1={28} x2={246} y2={290} />
      <Tag x={256} y={40}>The look</Tag>
      <ClipRect x={250} y={50} w={TP.x + 52 * TP.s - 250} h={100}>
        <StrapPlan T={TP} o={LONG()} />
        <Openings T={TP} xs={OPEN_L} d={OD} />
      </ClipRect>
      <Brk x={TP.x + 52 * TP.s} y1={TP.y - 40} y2={TP.y + 40} />
      <SpringBar x={TP.x} y1={TP.y - 40} y2={TP.y + 40} r={2.4} />
      <Cap p={[TP.x + OPEN_L[2] * TP.s, TP.y + 6]} x={360} y={162} text="the contrasting lining shows" />
      {/* mini section */}
      <rect x={xc - 60} y={yx} width={60 - xr} height={1.2 * 12} fill={TOPF} stroke={EDGE} strokeWidth="0.8" />
      <rect x={xc + xr} y={yx} width={60 - xr} height={1.2 * 12} fill={TOPF} stroke={EDGE} strokeWidth="0.8" />
      <line x1={xc - 60} y1={yx} x2={xc - xr} y2={yx} stroke={GRAIN} strokeWidth="1.6" />
      <line x1={xc + xr} y1={yx} x2={xc + 60} y2={yx} stroke={GRAIN} strokeWidth="1.6" />
      <rect x={xc - 60} y={yx + 14.4} width={120} height={0.8 * 12} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" />
      <Cap p={[xc, yx + 18]} x={xc} y={270} text="opening in the top, lining under" c={C.dim} />
    </Fig>
  )
}

/* 6 · Skive and fold — folds formed as for the classic strap */
function RaFold() {
  const s = 2.9
  const TP = { x: 72, y: 94, s }
  const XP = (mm) => TP.x + mm * s
  const x1 = 92
  const ss = 3.5
  const x2 = x1 + 80 * ss
  const y = 232
  const tk = 1.1 * 9
  const r = 0.9 * 9
  const cyB = y + tk + r
  const R = r + tk
  const fp = [x1 + R * Math.cos((215 * Math.PI) / 180), cyB + R * Math.sin((215 * Math.PI) / 180)]
  return (
    <Fig h={316} view="Plan + section · short piece, top only" scale="section thickness ×3">
      <Tag x={14} y={38}>Before · flesh up, skived</Tag>
      <StrapPlan T={TP} o={SHORT({ x0: -14, x1: 105 })} face="flesh" folds={[{ x: 0 }, { x: 80 }]} zones={[{ from: -14, to: 3, k: 'skiveL' }, { from: 77, to: 105, k: 'skiveR' }]} slot={{ x: 80 }} />
      <Openings T={TP} xs={OPEN_S} d={OD} look="through" />
      <Cap p={[XP(-8), TP.y - 10]} x={16} y={56} a="start" text="lug flap" c={C.brass} />
      <Cap p={[XP(95), TP.y - 10]} x={466} y={56} a="end" text="buckle flap" c={C.brass} />
      <T x={XP(0)} y={TP.y + 44} a="middle" s={10.5}>
        lug fold
      </T>
      <T x={XP(31)} y={TP.y + 44} a="middle" s={10.5} c={C.dim}>
        openings punched
      </T>
      <T x={XP(80)} y={TP.y + 44} a="middle" s={10.5}>
        buckle fold · slot
      </T>

      <Sep x1={14} y1={152} x2={466} y2={152} />
      <Tag x={14} y={170}>After · folds formed</Tag>
      <StrapSection x1={x1} x2={x2} y={y} s={ss} k={9} left={{ kind: 'bar' }} right={{ kind: 'buckle' }} noLining />
      {OPEN_S.map((c) => (
        <g key={c}>
          <rect x={x1 + c * ss - (OD / 2) * ss} y={y - 1} width={OD * ss} height={tk + 2} fill={C.ground} />
          <line x1={x1 + c * ss - (OD / 2) * ss} y1={y} x2={x1 + c * ss - (OD / 2) * ss} y2={y + tk} stroke={EDGE} strokeWidth="0.9" />
          <line x1={x1 + c * ss + (OD / 2) * ss} y1={y} x2={x1 + c * ss + (OD / 2) * ss} y2={y + tk} stroke={EDGE} strokeWidth="0.9" />
        </g>
      ))}
      <NoGlue x1={x1 + 3} x2={x1 + 10 * ss} y={y + tk + 3} h={5} />
      <NoGlue x1={x2 - 14 * ss} x2={x2 - 3} y={y + tk + 3} h={5} />
      <BoneFolder x={fp[0]} y={fp[1]} ang={-55} k={0.55} />
      <Cap p={[fp[0] - 24, fp[1] - 34]} x={16} y={192} a="start" text="bone-fold round the bar" />
      <Cap p={[x1 + OPEN_S[1] * ss, y + 4]} x={300} y={192} text="openings clear of both folds" c={C.dim} />
      <Cap p={[x1 + 6, cyB + R - 2]} x={16} y={292} a="start" text="doubled ≈ single" sub="tail glued, channel free" />
      <Cap p={[x1 + 22, y + tk + 4]} x={220} y={292} text="no glue: 10 mm" c={C.ruby} />
      <Cap p={[x2 - 30, y + tk + 4]} x={360} y={292} text="no glue: 14 mm" c={C.ruby} />
    </Fig>
  )
}

/* 7 · Laminate — glue the lining, padding outside the opening zones */
function RaLaminate() {
  const s = 2.9
  const TL = { x: 50, y: 84, s }
  const X = (mm) => TL.x + mm * s
  const inset = 3.5
  const clr = OD / 2 + 1
  const pad = (() => {
    const a = 10
    const b = 48
    const outer = range(a, b, 30).map((x) => [x, -(widthAt(x, LONG()) / 2 - inset)])
    const lower = range(a, b, 30)
      .map((x) => [x, widthAt(x, LONG()) / 2 - inset])
      .reverse()
    const ring = (c) => `M${X(c) + clr * s} ${TL.y} A${clr * s} ${clr * s} 0 1 0 ${X(c) - clr * s} ${TL.y} A${clr * s} ${clr * s} 0 1 0 ${X(c) + clr * s} ${TL.y} Z`
    return pathOf([...outer, ...lower], TL) + ' ' + OPEN_L.map(ring).join(' ')
  })()
  // transverse section through an opening (mm geometry, s = k = 11)
  const sk = 11
  const cx = 160
  const yb = 254
  const xl = cx - 10 * sk
  const xr = cx + 10 * sk
  const pm = (xm) => {
    const d = Math.abs(xm)
    return d >= clr && d <= 10 - inset ? 1.0 : 0
  }
  const half = (sg) => {
    const xs = sg < 0 ? range(xl, cx - (OD / 2) * sk, 80) : range(cx + (OD / 2) * sk, xr, 80)
    const up = xs.map((x) => [x, yb - sk * dilate(pm, 1.2, (x - cx) / sk)])
    const lo = xs.map((x) => [x, yb - sk * pm((x - cx) / sk)])
    return <TopShape up={up} lo={lo} />
  }
  return (
    <Fig h={330} view="Plan + section · laminating" scale="plan ×2.9 · section ×11">
      <Tag x={14} y={36}>Lining · flesh up, cemented</Tag>
      <StrapPlan T={TL} o={LONG({ x0: 3 })} face="lining" zones={[{ from: 3, to: 10, k: 'noglue' }, { from: 10, to: 121, k: 'glue' }]} />
      <path d={pad} fill="url(#sk-fill)" fillRule="evenodd" stroke="#d9b07a" strokeWidth="0.9" opacity="0.95" />
      <Openings T={TL} xs={OPEN_L} d={OD} look="mark" />
      <Cap p={[X(6.5), TL.y + 18]} x={X(6.5)} y={138} text="no glue: 10 mm" c={C.ruby} />
      <Cap p={[X(23.75), TL.y + 20]} x={X(34)} y={138} a="start" text="padding cut clear of each opening" />
      <Cap p={[X(85), TL.y - 6]} x={X(85)} y={42} text="cement over the whole body" c={C.emerald} />
      <T x={X(48) + 4} y={TL.y + 40} s={10} c={C.faint}>
        padding stops before the holes
      </T>

      <Sep x1={14} y1={156} x2={466} y2={156} />
      <Tag x={14} y={174}>Section across an opening · padding optional</Tag>
      <rect x={xl} y={yb} width={20 * sk} height={0.8 * sk} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" />
      {[-1, 1].map((sg) => (
        <rect key={sg} x={sg < 0 ? cx - (10 - inset) * sk : cx + clr * sk} y={yb - sk} width={(10 - inset - clr) * sk} height={sk} fill="url(#sk-fill)" stroke="#3a2716" strokeWidth="0.8" />
      ))}
      {half(-1)}
      {half(1)}
      <GlueLine x1={xl + 2} x2={xr - 2} y={yb + 0.8} />
      <Dim a={[cx - (OD / 2) * sk, yb - 30]} b={[cx + (OD / 2) * sk, yb - 30]} />
      <T x={cx} y={yb - 38} a="middle" s={10.5} mono>
        Ø: Size the openings
      </T>
      <Cap p={[cx, yb + 4]} x={cx} y={306} text="the lining shows in the opening" />
      <Cap p={[cx - clr * sk - 6, yb - 6]} x={24} y={194} a="start" text="padding stops short" sub="of the opening zone" />
      <Cap p={[xr - 14, yb - sk * 1.2 + 2]} x={xr - 6} y={216} a="end" text="top" c={C.dim} />
      <Note x={300} y={232} lines={['Padding under an opening', 'shows (underlay) or blocks', 'the hole (see-through).', 'Keep it light: commercial', 'rally straps run 4 → 1.8 mm.']} s={10.5} lh={14} />
    </Fig>
  )
}

/* 8 · Stitch — full perimeter */
function RaStitch() {
  const s = 2.9
  const TL = { x: 46, y: 80, s }
  const TS = { x: 46, y: 204, s }
  const zc = [392, 232]
  const zr = 62
  const Z = 6
  const ZT = { x: zc[0] - 111 * Z, y: zc[1] - 1 * Z, s: Z }
  const src = [TL.x + 112 * s, TL.y + 1 * s]
  const zx = ZT.x + 104 * Z
  return (
    <Fig h={316} view="Plan · perimeter stitch" scale="plan ×2.9 · detail ×6">
      <StrapPlan T={TL} o={LONG()} stitch={{ m: 3, p: 3, from: 4 }} />
      <Openings T={TL} xs={OPEN_L} d={OD} />
      <SpringBar x={TL.x} y1={TL.y - 36} y2={TL.y + 36} r={2.4} />
      <StrapPlan T={TS} o={SHORT()} stitch={{ m: 3, p: 3, from: 4, to: 66 }} />
      <Openings T={TS} xs={OPEN_S} d={OD} />
      <SpringBar x={TS.x} y1={TS.y - 36} y2={TS.y + 36} r={2.4} />
      <Cap p={[TL.x + 70 * s, TL.y - 26]} x={TL.x + 70 * s} y={36} text="full perimeter, 3 mm in, round the tip" />
      <Cap p={[TL.x + OPEN_L[1] * s, TL.y + 10]} x={TL.x + OPEN_L[1] * s} y={140} text="openings inside the stitch line" c={C.dim} />
      <Cap p={[TS.x + 66 * s, TS.y + 22]} x={180} y={268} text="short piece: from the fold to the keeper seam" c={C.dim} />
      <ZoomLink from={src} r={10} to={zc} R={zr} />
      <ClipCircle cx={zc[0]} cy={zc[1]} r={zr}>
        <StrapPlan T={ZT} o={LONG()} stitch={{ m: 3, p: 3, from: 4 }} />
      </ClipCircle>
      <Dim a={[zx, ZT.y + (widthAt(104, LONG()) / 2 - 3) * Z]} b={[zx, ZT.y + (widthAt(104, LONG()) / 2) * Z]} c={C.text} />
      <T x={zx + 6} y={ZT.y + (widthAt(104, LONG()) / 2 - 1) * Z} s={10.5} mono c={C.text}>
        3
      </T>
      <T x={zc[0]} y={zc[1] + zr + 16} a="middle" s={10.5}>
        pitch 3 · walked round the tip
      </T>
    </Fig>
  )
}

/* 9 · See-through look — punch through the laminate */
function RaThrough() {
  const s = 7
  const k = 14
  const cx = 146
  const tt = 1.2 * k
  const lt = 0.8 * k
  const y = 156
  const r = (OD / 2) * s
  const mini = (mx, through) => {
    const my = 232
    const rr = 15
    return (
      <g>
        <rect x={mx - 44} y={my} width={44 - rr} height={12} fill={TOPF} stroke={EDGE} strokeWidth="0.8" />
        <rect x={mx + rr} y={my} width={44 - rr} height={12} fill={TOPF} stroke={EDGE} strokeWidth="0.8" />
        <line x1={mx - 44} y1={my} x2={mx - rr} y2={my} stroke={GRAIN} strokeWidth="1.6" />
        <line x1={mx + rr} y1={my} x2={mx + 44} y2={my} stroke={GRAIN} strokeWidth="1.6" />
        {through ? (
          <g>
            <rect x={mx - 44} y={my + 12} width={44 - rr} height={8} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" />
            <rect x={mx + rr} y={my + 12} width={44 - rr} height={8} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" />
          </g>
        ) : (
          <rect x={mx - 44} y={my + 12} width={88} height={8} fill="url(#sk-linS)" stroke={LINE} strokeWidth="0.8" />
        )}
      </g>
    )
  }
  return (
    <Fig h={300} view="Section + comparison · see-through" scale="section thickness ×2">
      <Tag x={14} y={40}>Punch through the laminate</Tag>
      <Slab x={cx - 86} y={y + tt + lt} w={172} h={14} kind="pad" />
      {[
        [cx - 70, cx - r],
        [cx + r, cx + 70],
      ].map(([a, b]) => (
        <g key={a}>
          <Ply x1={a} x2={b} y={y} t={tt} />
          <Ply x1={a} x2={b} y={y + tt} t={lt} k="lining" />
        </g>
      ))}
      <GlueLine x1={cx - 68} x2={cx - r - 2} y={y + tt} />
      <GlueLine x1={cx + r + 2} x2={cx + 68} y={y + tt} />
      <Punch x={cx} y={y + tt + lt} d={2 * r} k={1} />
      <Mallet x={cx} y={y + tt + lt - 66} k={0.62} />
      <Cap p={[cx - 62, y + 4]} x={16} y={112} a="start" text="top + lining," sub="already glued" />
      <Cap p={[cx + 74, y + tt + lt + 7]} x={232} y={150} a="end" text="pad" c={C.dim} />
      <T x={16} y={238} s={12} c={C.brass} w="700">
        × 2
      </T>
      <Note x={46} y={238} lines={['Atelier de Griff punches every', 'hole twice — at least 46', 'punches a strap.']} s={10.5} lh={14} />

      <Sep x1={246} y1={28} x2={246} y2={290} />
      <Tag x={256} y={40}>Underlay vs see-through</Tag>
      {[
        [302, false],
        [414, true],
      ].map(([mx, thr]) => (
        <g key={mx}>
          <rect x={mx - 44} y={66} width={88} height={64} rx="3" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
          <Openings T={{ x: mx, y: 98, s: 4.2 }} xs={[0]} d={OD} look={thr ? 'through' : 'underlay'} />
          <path d={`M${mx - 44} 74 h88 M${mx - 44} 122 h88`} stroke={C.thread} strokeWidth="1.3" strokeDasharray="3 2" />
          {mini(mx, thr)}
        </g>
      ))}
      <T x={302} y={152} a="middle" s={11} c={C.text} w="600">
        Underlay
      </T>
      <T x={302} y={167} a="middle" s={10.5}>
        top only, before
      </T>
      <T x={302} y={181} a="middle" s={10.5}>
        assembly
      </T>
      <T x={302} y={196} a="middle" s={10.5} c={C.dim}>
        lining shows
      </T>
      <T x={414} y={152} a="middle" s={11} c={C.text} w="600">
        See-through
      </T>
      <T x={414} y={167} a="middle" s={10.5}>
        both layers, after
      </T>
      <T x={414} y={181} a="middle" s={10.5}>
        laminating
      </T>
      <T x={414} y={196} a="middle" s={10.5} c={C.dim}>
        the skin shows
      </T>
      <T x={302} y={272} a="middle" s={10} c={C.faint}>
        section
      </T>
      <T x={414} y={272} a="middle" s={10} c={C.faint}>
        section
      </T>
    </Fig>
  )
}

/* 10 · Finish — the finished pair, QR bars */
function RaFinish() {
  const s = 2.8
  const TL = { x: 104, y: 92, s }
  const TS = { x: 104, y: 210, s }
  const hx = holeXs(120)
  return (
    <Fig h={316} view="Plan · finished rally pair" scale="120 / 80 · 20 → 18 mm">
      <StrapPlan T={TL} o={LONG()} stitch={{ m: 3, p: 3, from: 4 }} holes={{}} edge={C.paint} />
      <Openings T={TL} xs={OPEN_L} d={OD} />
      <SpringBar x={TL.x} y1={TL.y - 34} y2={TL.y + 34} r={2.5} qr />
      <StrapPlan T={TS} o={SHORT()} stitch={{ m: 3, p: 3, from: 4, to: 66 }} keepers={[{ x: 70 }, { x: 52, float: true }]} edge={C.paint} />
      <Openings T={TS} xs={OPEN_S} d={OD} />
      <SpringBar x={TS.x} y1={TS.y - 34} y2={TS.y + 34} r={2.5} qr />
      <Buckle x={TS.x + 80 * s} y={TS.y} w={50} L={41} />

      <Cap p={[TL.x + 4, TL.y - 18]} x={16} y={36} a="start" text="quick-release bars" sub="common on rally straps" />
      <Cap p={[TL.x + hx[3] * s, TL.y]} x={330} y={36} text="7 holes, last 25 mm from the tip" />
      <Cap p={[TL.x + OPEN_L[1] * s, TL.y + 10]} x={TL.x + OPEN_L[1] * s} y={150} text="three openings per piece" />
      <Cap p={[TL.x + 92 * s, TL.y + 26]} x={TL.x + 92 * s} y={150} text="painted edges" />
      <Cap p={[TS.x + 52 * s, TS.y + 28]} x={TS.x + 52 * s - 30} y={270} text="floating keeper" />
      <Cap p={[TS.x + 70 * s, TS.y + 28]} x={TS.x + 70 * s + 34} y={270} text="fixed keeper" />
      <Cap p={[TS.x + 80 * s + 30, TS.y - 18]} x={466} y={158} a="end" text="buckle" sub="tongue through the slot" />
      {/* QR detail: the knob needs a notch in the underside */}
      <ClipCircle cx={430} cy={258} r={32}>
        <rect x={396} y={224} width={70} height={70} fill="url(#sk-lin)" />
        <rect x={406} y={242} width={6} height={30} rx="3" fill={C.ground} stroke={EDGE} strokeWidth="0.8" />
        <rect x={401} y={224} width={6} height={70} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" />
        <rect x={405} y={250} width={8} height={7} rx="2" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.6" />
      </ClipCircle>
      <T x={466} y={306} a="end" s={10.5} c={C.dim}>
        QR notch ≈ 1 × 5 mm
      </T>
      <T x={16} y={306} s={10.5} c={C.faint}>
        Commercial: 120 / 75–80, 20 / 18, 4 → 1.8 mm thick.
      </T>
    </Fig>
  )
}

export const FIGS = {
  'p-pattern': PPattern,
  'p-cut': PCut,
  'p-filler': PFiller,
  'p-flaps': PFlaps,
  'p-reinforce': PReinforce,
  'p-glue-filler': PGlueFiller,
  'p-close': PClose,
  'p-step': PStep,
  'p-ends': PEnds,
  'p-trim': PTrim,
  'p-mark': PMark,
  'p-stitch': PStitch,
  'p-set': PSet,
  'p-edges': PEdges,
  'p-keepers': PKeepers,
  'p-hardware': PHardware,
  'p-profiles': PProfiles,
  'p-turned': PTurned,
  'p-rolled': PRolled,
  'ra-pattern': RaPattern,
  'ra-layout': RaLayout,
  'ra-centres': RaCentres,
  'ra-cut': RaCut,
  'ra-underlay': RaUnderlay,
  'ra-fold': RaFold,
  'ra-laminate': RaLaminate,
  'ra-stitch': RaStitch,
  'ra-through': RaThrough,
  'ra-finish': RaFinish,
}
