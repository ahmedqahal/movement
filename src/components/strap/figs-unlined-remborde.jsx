// Strap diagrams — the unlined single-layer strap (u-*) and the rembordé /
// turned-edge strap (r-*). See AUTHORING.md.
//
// Local helpers (kept in this file, see AUTHORING.md):
//   UFold    unlined folded end in longitudinal section (thin loop, skived
//            tail returning under a full-thickness body), open or closed
//   TurnSec  rembordé TRANSVERSE section (across the width): top with its
//            thinned margins rolled round a narrower core, flanges, lining
//            full / semi, stitch — any turn angle per side, bench or worn
//   OpenSec  the top flat before turning (flesh up): margins with step or
//            long-taper skive, groove, core, cement, damp fold line
import { useId } from 'react'
import { C, Fig, T, Note, Lead, Dim, Arrow, Num, Verdict, Tag, Sep, Legend } from './kit.jsx'
import { StrapPlan, SpringBar, Buckle, Ply, BarEnd, NoGlue, Reinf, XSec } from './parts.jsx'
import { BuckleSide } from './sections.jsx'
import { LONG, SHORT, outline, offset, pathOf, px, widthAt, holeXs, resample, runBetween } from './geom.js'
import { Knife, Iron, Hammer, Awl, Punch, Beveller, Slicker, Dividers, BoneFolder, Brush, Sander, Dauber, Slab, Needle, Applicator } from './tools.jsx'

const uid = () => useId().replace(/[^a-zA-Z0-9]/g, '')

// Unlined strap, Tandy-style numbers (mm, from the fold / bar centre)
const TAIL = 17.2 // tail length: fold → tail tip (tip glued 3.2 mm)
const JOINT = 14 // joint stitch row
const RAMP = [5, 9.2] // tail skive: ~0.8 mm up to 5 mm, full from 9.2 (= JOINT − 4.8)

const f = (v) => Math.round(v * 100) / 100
const P = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${f(x)} ${f(y)}`).join(' ')
const PZ = (pts) => `${P(pts)} Z`
const Lp = (pts) => pts.map(([x, y]) => `L${f(x)} ${f(y)}`).join(' ')

/* ------------------------------------------------------------------ */
/* small local pieces                                                   */
/* ------------------------------------------------------------------ */
function LocalDefs() {
  return (
    <defs>
      {/* top leather cut face, flesh UP (grain at the bottom) */}
      <linearGradient id="ur-fleshUp" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d3ae7b" />
        <stop offset="0.82" stopColor="#b2804a" />
        <stop offset="1" stopColor="#7d5228" />
      </linearGradient>
    </defs>
  )
}

function Break({ x, y1, y2 }) {
  const h = y2 - y1 + 8
  return <path d={`M${x - 3} ${y1 - 4} l6 ${h * 0.3} l-6 ${h * 0.4} l6 ${h * 0.3}`} fill="none" stroke={C.dim} strokeWidth="1" />
}
function HBreak({ y, x1, x2 }) {
  const w = x2 - x1
  return <path d={`M${x1} ${y} l${w * 0.3} -3 l${w * 0.4} 6 l${w * 0.3} -3`} fill="none" stroke={C.dim} strokeWidth="1" />
}
const GluePath = ({ pts }) => <path d={P(pts)} fill="none" stroke={C.glue} strokeWidth="2.4" strokeDasharray="1.2 2.6" strokeLinecap="round" strokeLinejoin="round" />
const Wet = ({ pts, w = 6 }) => <path d={P(pts)} fill="none" stroke="rgba(96,150,196,0.6)" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />

// Leader whose label sits ABOVE its end point (the kit's Lead puts the text
// below the end, so a leader rising from below would run through it).
function LeadA({ p, t, text, sub, a = 'middle', s = 11.5, c = C.text }) {
  const tx = t[0] + (a === 'start' ? 4 : a === 'end' ? -4 : 0)
  return (
    <g>
      <line x1={p[0]} y1={p[1]} x2={t[0]} y2={t[1]} stroke={C.struct} strokeWidth="0.8" opacity="0.8" />
      <circle cx={p[0]} cy={p[1]} r="2.2" fill={c} />
      <text x={tx} y={t[1] - 4 - (sub ? s + 1 : 0)} textAnchor={a} fontSize={s} fill={c} fontFamily="var(--font-body)">
        {text}
      </text>
      {sub && (
        <text x={tx} y={t[1] - 4} textAnchor={a} fontSize={s - 1.5} fill={C.faint} fontFamily="var(--font-body)">
          {sub}
        </text>
      )}
    </g>
  )
}

// magnified-detail frame (rounded box) with a tag
function Inset({ x, y, w, h, tag, a = 'start' }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="7" fill="rgba(255,255,255,0.025)" stroke={C.struct} strokeWidth="0.9" strokeDasharray="3 2" />
      {tag && (
        <Tag x={a === 'end' ? x + w - 8 : x + 8} y={y + 14} a={a}>
          {tag}
        </Tag>
      )}
    </g>
  )
}
// dashed callout ring + connector from a spot to an inset
function Callout({ cx, cy, r = 9, to }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.brass} strokeWidth="1.1" strokeDasharray="3 2" />
      {to && <line x1={cx + (to[0] > cx ? r : -r) * 0.7} y1={cy + (to[1] > cy ? r : -r) * 0.7} x2={to[0]} y2={to[1]} stroke={C.brass} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.8" />}
    </g>
  )
}

// triangular (V) knife / groover, seen end-on: V tip at (0,0)
function TriKnife({ x, y, ang = 0, k = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${k})`}>
      <path d="M0 0 L-5.5 -15 L-4.5 -40 L4.5 -40 L5.5 -15 Z" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.8" />
      <path d="M0 -1 L0 -38" stroke="#f6fbff" strokeWidth="0.7" opacity="0.7" />
      <rect x="-7" y="-104" width="14" height="66" rx="4" fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.8" />
    </g>
  )
}
// clamp jaws pressing a stack between yTop and yBot at x
function Press({ x, yTop, yBot, w = 18 }) {
  return (
    <g>
      <rect x={x - w / 2} y={yTop - 6} width={w} height="6" rx="1.5" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.7" />
      <rect x={x - w / 2} y={yBot} width={w} height="6" rx="1.5" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.7" />
      <rect x={x - 2.5} y={yTop - 26} width="5" height="20" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" />
      <rect x={x - 2.5} y={yBot + 6} width="5" height="20" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" />
      <Arrow a={[x + 11, yTop - 24]} b={[x + 11, yTop - 8]} w={1.5} />
      <Arrow a={[x + 11, yBot + 24]} b={[x + 11, yBot + 8]} w={1.5} />
    </g>
  )
}
// laboratory jar for the dye mix
function Jar({ x, y, w = 26, h = 36, fill, level = 0.6, label }) {
  const ly = y + h * (1 - level)
  return (
    <g>
      <path d={`M${x} ${ly} L${x + w} ${ly} L${x + w} ${y + h - 3} Q${x + w} ${y + h} ${x + w - 3} ${y + h} L${x + 3} ${y + h} Q${x} ${y + h} ${x} ${y + h - 3} Z`} fill={fill} />
      <path d={`M${x} ${y} L${x} ${y + h - 3} Q${x} ${y + h} ${x + 3} ${y + h} L${x + w - 3} ${y + h} Q${x + w} ${y + h} ${x + w} ${y + h - 3} L${x + w} ${y}`} fill="none" stroke="#9fb4c2" strokeWidth="1.2" />
      {label && (
        <T x={x + w / 2} y={y + h + 14} a="middle" s={10.5}>
          {label}
        </T>
      )}
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* UFold — unlined folded end, longitudinal section                    */
/* ------------------------------------------------------------------ */
// Bar at (cx, ·); the body runs to +x (to −x with mirror). s px/mm along,
// k px/mm through the thickness. Thin loop tt, body T beyond the ramp.
// open > 0: the tail is passed round but not yet laid down (drops open px).
function ufGeom({ cx, yTop, s = 6, k = 12, r, T: th = 2.2, tt = 0.8, ramp = RAMP, mirror }) {
  const rr = r ?? 0.9 * k
  const tk = tt * k
  const y1 = yTop + tk
  const cy = y1 + rr
  const bu = (u) => (u <= ramp[0] ? y1 : u >= ramp[1] ? yTop + th * k : y1 + ((u - ramp[0]) / (ramp[1] - ramp[0])) * (th - tt) * k)
  return { rr, tk, y1, cy, Ro: rr + tk, bu, uc: (rr * 2.6) / s, X: (u) => cx + (mirror ? -1 : 1) * u * s }
}
function UFold(p) {
  const { cx, yTop, s = 6, tip = TAIL, end = 40, open = 0, mirror, bar = 'spring', glue = {}, brk = true, ramp = RAMP, slits = [], fill = 'url(#sk-topS)' } = p
  const { rr, tk, y1, cy, Ro, bu, uc } = ufGeom(p)
  const X = (u) => cx + u * s
  const bps = (a, b) => [a, ...[ramp[0], ramp[1]].filter((u) => u > a + 1e-6 && u < b - 1e-6), b]
  const c1 = cx + (X(uc) - cx) * 0.55
  const c2 = cx + (X(uc) - cx) * 0.62
  const ty = (u) => cy + rr + (open * u) / tip
  let d
  let seam = null
  if (!open) {
    const outer =
      `M${X(end)} ${yTop} L${cx} ${yTop} A${Ro} ${Ro} 0 0 0 ${cx} ${cy + Ro} ` +
      `C${c1} ${cy + Ro} ${c2} ${bu(uc) + tk} ${X(uc)} ${bu(uc) + tk} ` +
      `${Lp(bps(uc, tip).slice(1).map((u) => [X(u), bu(u) + tk]))} L${X(tip)} ${bu(tip)} ` +
      `${Lp(bps(tip, end).slice(1).map((u) => [X(u), bu(u)]))} Z`
    const hole =
      `M${cx} ${y1} A${rr} ${rr} 0 0 0 ${cx} ${cy + rr} C${c1} ${cy + rr} ${c2} ${bu(uc)} ${X(uc)} ${bu(uc)} ` +
      `${Lp(bps(0, uc).reverse().slice(1).map((u) => [X(u), bu(u)]))} Z`
    d = `${outer} ${hole}`
    seam = bps(uc, tip).map((u) => [X(u), bu(u)])
  } else {
    d =
      `M${X(end)} ${yTop} L${cx} ${yTop} A${Ro} ${Ro} 0 0 0 ${cx} ${cy + Ro} L${X(tip)} ${ty(tip) + tk} L${X(tip)} ${ty(tip)} ` +
      `L${cx} ${cy + rr} A${rr} ${rr} 0 0 1 ${cx} ${y1} ${Lp(bps(0, end).slice(1).map((u) => [X(u), bu(u)]))} Z`
  }
  const g3 = Math.max(uc, tip - 3.2)
  return (
    <g>
      <g transform={mirror ? `matrix(-1 0 0 1 ${2 * cx} 0)` : undefined}>
        <path d={d} fillRule="evenodd" fill={fill} stroke="#4a3018" strokeWidth="0.8" strokeLinejoin="round" />
        {seam && <path d={P(seam)} fill="none" stroke="#4a3018" strokeWidth="0.8" />}
        {seam && glue.all && <GluePath pts={seam} />}
        {seam && glue.tip && <GluePath pts={bps(g3, tip).map((u) => [X(u), bu(u)])} />}
        {open > 0 && glue.tip && <GluePath pts={[[X(tip - 3.2), ty(tip - 3.2)], [X(tip), ty(tip)]]} />}
        {open > 0 && glue.land && <GluePath pts={bps(tip - 3.2, tip).map((u) => [X(u), bu(u)])} />}
        {slits.map((u, i) => (
          <rect key={i} x={X(u) - 2.6} y={yTop - 1} width="5.2" height={bu(u) + (u <= tip ? tk : 0) - yTop + 2} fill={C.ground} stroke="#e7c48f" strokeWidth="0.5" />
        ))}
        {brk && <Break x={X(end)} y1={yTop} y2={bu(end)} />}
      </g>
      {bar === 'spring' && <BarEnd cx={cx} cy={cy} r={rr * 0.92} />}
      {bar === 'former' && <BarEnd cx={cx} cy={cy} r={rr * 0.94} c="url(#sk-steel)" />}
      {bar === 'buckle' && <BuckleSide cx={cx} cy={cy} r={rr} s={s} T={tk} />}
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* Rembordé transverse sections                                         */
/* ------------------------------------------------------------------ */
// Margin of the top bent through `th` degrees round the core edge.
// Coordinates in mm: x across (0 = centreline), z up from the grain.
function marginPts({ W2, t, tc, tm, M, th, taper }) {
  const rho = (t + tc) / 2
  const xb = W2 - rho - tm / 2
  const zc = tm / 2 + rho
  const Ro = rho + tm / 2
  const Ri = rho - tm / 2
  const thr = (th * Math.PI) / 180
  const Ls = Math.max(0.2, M + (W2 - xb) - rho * thr)
  const n = Math.max(3, Math.ceil(th / 6))
  const outer = []
  for (let i = 0; i <= n; i++) {
    const a = (thr * i) / n
    outer.push([xb + Ro * Math.sin(a), zc - Ro * Math.cos(a)])
  }
  const a0 = Math.acos(Math.max(-1, Math.min(1, (zc - t) / Ri)))
  const inner = []
  const m = Math.max(2, Math.ceil((((thr - a0) * 180) / Math.PI) / 6))
  for (let i = 0; i <= m; i++) {
    const a = a0 + ((thr - a0) * i) / m
    inner.push([xb + Ri * Math.sin(a), zc - Ri * Math.cos(a)])
  }
  const dir = [Math.cos(thr), Math.sin(thr)]
  const nrm = [Math.sin(thr), -Math.cos(thr)]
  const oL = outer[outer.length - 1]
  const iL = inner[inner.length - 1]
  const iE = [iL[0] + dir[0] * Ls, iL[1] + dir[1] * Ls]
  const oE = taper ? [iE[0] + nrm[0] * 0.05, iE[1] + nrm[1] * 0.05] : [oL[0] + dir[0] * Ls, oL[1] + dir[1] * Ls]
  outer.push(oE)
  inner.push(iE)
  return { outer, inner, xb, zc, Ro, H: zc + Ro, end: iE }
}

function TurnSec({ cx, yG, s, k, worn, W = 20, t = 1, tc = 1.2, tm = 0.5, M = 5, thL = 180, thR = 180, taper = true, inset = 1, core = true, lining, tl = 0.6, reinf, stitch, clip, brkL, paint = true }) {
  const id = uid()
  const kk = k ?? s
  const W2 = W / 2
  const X = (x) => cx + x * s
  const Y = (z) => yG + (worn ? z : -z) * kk
  const R = marginPts({ W2, t, tc, tm, M, th: thR, taper })
  const Lm = marginPts({ W2, t, tc, tm, M, th: thL, taper })
  const mir = ([x, z]) => [-x, z]
  const Lo = Lm.outer.map(mir)
  const Li = Lm.inner.map(mir)
  const toPx = ([x, z]) => [X(x), Y(z)]
  const poly = [...[...Lo].reverse(), ...R.outer, ...[...R.inner].reverse(), ...Li].map(toPx)
  const grain = [...[...Lo].reverse(), ...R.outer].map(toPx)
  const xce = W2 - inset
  const { H, xb, zc, Ro } = R
  const xfe = R.end[0]
  const els = []
  if (core) {
    const ya = Y(t)
    const yb = Y(t + tc)
    els.push(<rect key="core" x={X(-xce)} y={Math.min(ya, yb)} width={X(xce) - X(-xce)} height={Math.abs(yb - ya)} rx="1.5" fill="url(#sk-fill)" stroke="#3a2716" strokeWidth="0.8" />)
  }
  if (reinf) els.push(<Reinf key="rf" x1={X(-xce + 0.6)} x2={X(xce - 0.6)} y={Y(t + 0.09)} w={2} />)
  els.push(<path key="top" d={PZ(poly)} fill={worn ? 'url(#sk-topS)' : 'url(#ur-fleshUp)'} stroke="#4a3018" strokeWidth="0.8" strokeLinejoin="round" />)
  els.push(<path key="grain" d={P(grain)} fill="none" stroke={C.topEdge} strokeWidth="1.4" strokeLinejoin="round" opacity="0.9" />)
  // underside (bench: upper face) of the turned flanges + core, at |x| = ax
  const zIn = (ax) => (ax <= xfe ? t + tc : ax <= xb ? t + tc + 0.05 + ((ax - xfe) / (xb - xfe)) * (H - t - tc - 0.05) : H)
  if (lining && thR >= 179 && thL >= 179) {
    const semi = lining === 'semi'
    const xL = semi ? W2 : xb
    const xs = [-xL, -xb, -xfe, xfe, xb, xL].filter((v, i, a) => i === 0 || v > a[i - 1] + 1e-6)
    const inner = xs.map((x) => [x, zIn(Math.abs(x))])
    // uniform thickness, following the flanges; full: ends feathered over 1.6 mm
    const thk = (ax) => (semi ? tl : Math.max(0.05, tl * Math.min(1, (xL - ax) / 1.6)))
    const xo = (semi ? [xL, xb, xfe] : [xL, xL - 1.6, xfe]).filter((v, i, a) => i === 0 || v < a[i - 1] - 1e-6)
    const outerR = xo.map((x) => [x, zIn(x) + thk(x)])
    const outerL = [...outerR, ...[...outerR].reverse().map(([x, z]) => [-x, z])]
    els.push(<path key="lin" d={PZ([...inner, ...outerL].map(toPx))} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.8" strokeLinejoin="round" />)
    if (semi && paint)
      [-1, 1].forEach((sg) => {
        const arc = []
        for (let i = 0; i <= 10; i++) {
          const a = Math.PI / 2 + (Math.PI / 2) * (i / 10)
          arc.push([sg * (xb + Ro * Math.sin(a)), zc - Ro * Math.cos(a)])
        }
        const wedge = [...arc, [sg * W2, H]]
        els.push(<path key={'pw' + sg} d={PZ(wedge.map(toPx))} fill={C.paint} />)
        els.push(<path key={'ps' + sg} d={P([[sg * (W2 + 0.04), zc + 0.45], [sg * (W2 + 0.07), H], [sg * (W2 + 0.07), H + tl]].map(toPx))} fill="none" stroke={C.paint} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />)
      })
  }
  if (stitch) {
    const zb = zIn(W2 - stitch) + (lining ? tl : 0)
    ;[-1, 1].forEach((sg) => {
      const x = X(sg * (W2 - stitch))
      els.push(
        <g key={'st' + sg}>
          <line x1={x} y1={Y(0)} x2={x} y2={Y(zb)} stroke={C.thread} strokeWidth="1.6" />
          <ellipse cx={x} cy={Y(0) + (worn ? -1.2 : 1.2)} rx="3" ry="1.4" fill={C.thread} />
          <ellipse cx={x} cy={Y(zb) + (worn ? 1.2 : -1.2)} rx="3" ry="1.4" fill={C.thread} />
        </g>
      )
    })
  }
  const zMax = lining ? H + tl : Math.max(H, ...R.outer.map((p) => p[1]))
  els.unshift(<LocalDefs key="defs" />)
  if (!clip) return <g>{els}</g>
  return (
    <g>
      <clipPath id={`ts${id}`}>
        <rect x={clip[0]} y={-2000} width={clip[1] - clip[0]} height={4000} />
      </clipPath>
      <g clipPath={`url(#ts${id})`}>{els}</g>
      {brkL && <Break x={clip[0]} y1={Math.min(Y(0), Y(zMax))} y2={Math.max(Y(0), Y(zMax))} />}
    </g>
  )
}

// right half profile of the flat top, [x, thickness] — flesh surface
function openProfile({ W2, t, M, skive, groove }) {
  if (skive === 'step') return [[0, t], [W2 - 0.3, t], [W2 - 0.3, 0.6], [W2 + M, 0.6]]
  if (skive === 'taper') return [[0, t], [W2 - 0.8, t], [W2, 0.45], [W2 + M, 0.06]]
  if (groove) return [[0, t], [W2 - 0.35, t], [W2, t - 0.35], [W2 + 0.35, t], [W2 + M, t]]
  return [[0, t], [W2 + M, t]]
}
const zAt = (prof, x) => {
  const ax = Math.abs(x)
  for (let i = 1; i < prof.length; i++) {
    const [x0, z0] = prof[i - 1]
    const [x1, z1] = prof[i]
    if (ax <= x1 + 1e-9) return x1 === x0 ? z1 : z0 + ((ax - x0) / (x1 - x0)) * (z1 - z0)
  }
  return prof[prof.length - 1][1]
}
function OpenSec({ cx, yG, s, k, W = 20, t = 1, M = 5, skive = 'none', groove, core, tc = 1.2, inset = 1, reinf, ghost, passes, clip, brkL, wet, glue, glueFrom = 5.8, sides = [-1, 1] }) {
  const id = uid()
  const kk = k ?? s
  const W2 = W / 2
  const X = (x) => cx + x * s
  const Y = (z) => yG - z * kk
  const prof = openProfile({ W2, t, M, skive, groove })
  const left = prof.map(([x, z]) => [-x, z]).reverse()
  const surf = [...left.slice(0, -1), ...prof]
  const poly = [...surf, [W2 + M, 0], [-(W2 + M), 0]]
  const toPx = ([x, z]) => [X(x), Y(z)]
  const xce = W2 - inset
  const els = []
  els.push(<path key="top" d={PZ(poly.map(toPx))} fill="url(#ur-fleshUp)" stroke="#4a3018" strokeWidth="0.8" strokeLinejoin="round" />)
  if (ghost && skive !== 'none')
    sides.forEach((sg) => {
      const g = [...prof.slice(1), [W2 + M, t]].map(([x, z]) => [sg * x, z])
      els.push(<path key={'gh' + sg} d={PZ(g.map(toPx))} fill="rgba(208,168,79,0.13)" stroke={C.brass} strokeWidth="0.8" strokeDasharray="3 2" />)
    })
  if (passes && skive !== 'none')
    sides.forEach((sg) => {
      ;[0.36, 0.68].forEach((fr, i) => {
        const x0 = prof[1][0]
        const pts = []
        for (let j = 0; j <= 16; j++) {
          const x = x0 + ((W2 + M - x0) * j) / 16
          pts.push([sg * x, t - (t - zAt(prof, x)) * fr])
        }
        els.push(<path key={'ps' + sg + i} d={P(pts.map(toPx))} fill="none" stroke={C.brass} strokeWidth="0.8" strokeDasharray="2 2.5" opacity="0.85" />)
      })
    })
  if (core) {
    els.push(<rect key="core" x={X(-xce)} y={Y(t + tc)} width={X(xce) - X(-xce)} height={tc * kk} rx="1.5" fill="url(#sk-fill)" stroke="#3a2716" strokeWidth="0.8" />)
    if (reinf) els.push(<line key="rf" x1={X(-xce + 0.6)} y1={Y(t) - 1.6} x2={X(xce - 0.6)} y2={Y(t) - 1.6} stroke={C.velodon} strokeWidth="2" strokeDasharray={reinf === 'opt' ? '5 3' : undefined} />)
  }
  if (glue)
    sides.forEach((sg) => {
      const pts = []
      for (let j = 0; j <= 14; j++) {
        const x = W2 - 0.5 + ((M + 0.3) * j) / 14
        pts.push([sg * x, zAt(prof, x) + 0.07])
      }
      els.push(<GluePath key={'gm' + sg} pts={pts.map(toPx)} />)
      if (core) els.push(<GluePath key={'gc' + sg} pts={[[sg * glueFrom, t + tc + 0.07], [sg * xce, t + tc + 0.07]].map(toPx)} />)
    })
  if (wet)
    sides.forEach((sg) => {
      els.push(<ellipse key={'wt' + sg} cx={X(sg * W2)} cy={Y(t * 0.5)} rx={0.9 * s} ry={t * 0.48 * kk} fill="rgba(96,150,196,0.62)" />)
      ;[-0.6, 0, 0.6].forEach((dx, i) => (
        els.push(<path key={'dr' + sg + i} d={`M${X(sg * W2 + dx)} ${Y(t) - 12 - (i % 2) * 5} q-2.4 4 0 5.6 q2.4 -1.6 0 -5.6 Z`} fill="#9cc2d6" />)
      ))
    })
  els.unshift(<LocalDefs key="defs" />)
  if (!clip) return <g>{els}</g>
  return (
    <g>
      <clipPath id={`os${id}`}>
        <rect x={clip[0]} y={-2000} width={clip[1] - clip[0]} height={4000} />
      </clipPath>
      <g clipPath={`url(#os${id})`}>{els}</g>
      {brkL && <Break x={clip[0]} y1={Y(core ? t + tc : t)} y2={Y(0)} />}
    </g>
  )
}

// plan-view outline helpers for the rembordé top (turn allowance M, lug end at x0)
const topBlank = (x0 = -15, M = 5) => offset(outline(LONG({ x0 })), -M).map(([x, y]) => [Math.max(x, x0), y])
const corePts = (from = 12) => offset(outline(LONG({ x0: from })), 1)

/* ================================================================== */
/* UNLINED SINGLE-LAYER STRAP                                           */
/* ================================================================== */

/* 1 · Acrylic template, stitch points awled through it 3.2 mm from the edge */
function UTemplate() {
  const o = LONG({ x0: -TAIL })
  const Tt = { x: 76, y: 136, s: 2.5 }
  const pts = outline(o)
  const runs = runBetween(offset(pts, 3.2), 2)
  const marks = runs.flatMap((run) => resample(run, 4).map((q) => q.p))
  const cross = [-2.25, 2.25].map((y) => [JOINT, y])
  const AW = 62
  const awl = marks.filter((q) => q[1] < 0).reduce((b, q) => (Math.abs(q[0] - AW) < Math.abs(b[0] - AW) ? q : b))
  const [ax, ay] = px(Tt, awl[0], awl[1])
  const hide = 'M22 98 L392 96 Q399 116 393 136 Q388 156 396 176 L22 178 Z'
  const [fx] = px(Tt, 0, 0)
  const ins = { x: 238, y: 192, w: 232, h: 100 }
  const ey = 216 // edge line in the inset
  const hy = ey + 3.2 * 10
  const by = hy + 14 // leather band ends here
  return (
    <Fig h={300} view="Plan · template on the leather" scale="plan ×2.5 · detail ×10">
      <path d={hide} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="1" />
      <T x={30} y={172} s={10} c="#e9cf9f">5–6 oz veg-tan</T>
      <path d={pathOf(pts, Tt)} fill="rgba(178,212,228,0.22)" stroke="#b5d3e2" strokeWidth="1.3" />
      <path d={pathOf(offset(pts, 1.4).filter((q) => q[1] < 0 && q[0] > 6 && q[0] < 96), Tt, false)} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
      <line x1={fx} y1={104} x2={fx} y2={168} stroke={C.text} strokeWidth="1" strokeDasharray="4 3" />
      {[...marks, ...cross].map(([x, y], i) => {
        const [cx, cy] = px(Tt, x, y)
        const done = x < awl[0] - 0.5 || (x === JOINT && Math.abs(y) < 3)
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r="2" fill="none" stroke="#d6eaf3" strokeWidth="0.7" />
            {done && <circle cx={cx} cy={cy} r="1.15" fill={C.hole} />}
          </g>
        )
      })}
      <circle cx={ax} cy={ay} r="4.5" fill="none" stroke={C.brass} strokeWidth="1.2" />
      <Awl kind="round" x={ax} y={ay} k={0.78} ang={-6} />
      <T x={ax + 12} y={44} s={11.5} c={C.text}>awl through each hole</T>
      <T x={ax + 12} y={58} s={10} c={C.faint}>a mark on the grain, not a hole</T>
      <LeadA p={px(Tt, 98, 4)} t={[352, 78]} text="acrylic template" a="middle" />
      <LeadA p={px(Tt, 28, -6.6)} t={[118, 62]} text="stitch points" sub="right round the edge" a="middle" />
      <T x={fx} y={192} a="middle" s={10.5}>fold</T>
      <Lead p={px(Tt, -9, 5)} t={[50, 214]} text="tail included" sub="turns back later" a="middle" />
      <Lead p={px(Tt, JOINT, 2.25)} t={[150, 214]} text="joint row" sub="where the tail ends" a="middle" />
      {/* detail */}
      <Callout cx={px(Tt, 44, -7.6)[0]} cy={px(Tt, 44, -7.6)[1]} r={10} to={[ins.x + 40, ins.y]} />
      <Inset {...ins} tag="detail ×10" a="end" />
      <rect x={ins.x + 40} y={ey} width={ins.w - 48} height={by - ey} fill="url(#sk-top)" />
      <rect x={ins.x + 40} y={ey} width={ins.w - 48} height={by - ey} fill="rgba(178,212,228,0.22)" />
      <line x1={ins.x + 40} y1={ey} x2={ins.x + ins.w - 8} y2={ey} stroke="#b5d3e2" strokeWidth="1.4" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx={ins.x + 70 + i * 40} cy={hy} r="5" fill="none" stroke="#d6eaf3" strokeWidth="1" />
          {i < 2 && <circle cx={ins.x + 70 + i * 40} cy={hy} r="2.6" fill={C.hole} />}
        </g>
      ))}
      <Dim a={[ins.x + 30, ey]} b={[ins.x + 30, hy]} text="" />
      <T x={ins.x + 24} y={ey + 15} a="end" s={11} mono c={C.text}>3.2</T>
      <T x={ins.x + 24} y={ey + 29} a="end" s={10} c={C.faint}>⅛ in</T>
      <Dim a={[ins.x + 70, by + 8]} b={[ins.x + 110, by + 8]} text="" />
      <T x={ins.x + 118} y={by + 12} s={10.5} mono c={C.text}>4</T>
      <T x={ins.x + 130} y={by + 12} s={10} c={C.faint}>= the chisel pitch</T>
    </Fig>
  )
}

/* 2 · Cut: one heavy layer, tails included */
function UCut() {
  const T1 = { x: 66, y: 86, s: 2.3 }
  const T2 = { x: 66, y: 196, s: 2.3 }
  const oL = LONG({ x0: -TAIL })
  const oS = SHORT({ x0: -TAIL, x1: 108 })
  const apex = px(T1, 120, 0)
  return (
    <Fig h={300} view="Plan · one-layer pieces" scale="plan ×2.3">
      <StrapPlan T={T1} o={oL} zones={[{ from: -TAIL, to: 0, k: 'hl' }]} folds={[{ x: 0 }]} />
      <StrapPlan T={T2} o={oS} zones={[{ from: -TAIL, to: 0, k: 'hl' }, { from: 80, to: 108, k: 'hl' }]} folds={[{ x: 0 }, { x: 80 }]} />
      <Knife kind="utility" x={apex[0]} y={apex[1]} ang={58} k={0.74} />
      <T x={200} y={50} a="middle" s={11.5} c={C.text}>long piece</T>
      <T x={120} y={160} a="middle" s={11.5} c={C.text}>short piece</T>
      <Lead p={px(T1, -4, 6)} t={[210, 126]} text="lug tail" sub="wraps the spring bar" a="start" />
      <Lead p={px(T2, 94, 7)} t={[300, 252]} text="buckle tail" sub="wraps the buckle bar" a="middle" />
      <Lead p={px(T2, -9, 7)} t={[60, 252]} text="lug tail" a="middle" />
      <T x={px(T1, 0, 0)[0]} y={50} a="middle" s={10}>fold</T>
      <T x={px(T2, 80, 0)[0]} y={166} a="middle" s={10}>fold</T>
      <Dim a={px(T1, -TAIL, 12)} b={px(T1, 0, 12)} off={0} text="" />
      <T x={px(T1, -TAIL / 2, 0)[0]} y={px(T1, 0, 12)[1] + 14} a="middle" s={10.5} mono c={C.text}>17.2</T>
      {/* thickness callout */}
      <Inset x={364} y={104} w={106} h={156} tag="section" />
      <XSec cx={417} y={146} w={78} layers={[{ k: 'top', t: 22 }]} edge="square" />
      <Dim a={[372, 146]} b={[372, 168]} text="" />
      <T x={417} y={140} a="middle" s={11} mono c={C.text}>2.0–2.4 mm</T>
      <T x={417} y={186} a="middle" s={10.5} c={C.text}>one layer,</T>
      <T x={417} y={199} a="middle" s={10.5} c={C.text}>no lining</T>
      <T x={417} y={218} a="middle" s={10}>5–6 oz veg-tan</T>
      <T x={417} y={231} a="middle" s={10}>or Horween;</T>
      <T x={417} y={244} a="middle" s={10}>4–5 oz Dublin</T>
      <T x={240} y={290} a="middle" s={10.5} c={C.faint}>tails stay in the pattern: the strap is folded from one piece, not lined</T>
    </Fig>
  )
}

/* 3 · Bevel both faces — the flesh edge shows on an unlined strap */
function UBevel() {
  const y0 = 100
  const y1 = 144
  const xe = 268
  const xb = 96
  const b = 12
  const body = [[xb, y0], [xe - b, y0], [xe, y0 + b], [xe, y1 - b], [xe - b, y1], [xb, y1]]
  return (
    <Fig h={300} view="Section · across one edge" scale="true scale ×20">
      <path d={PZ(body)} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.9" />
      <path d={PZ([[xe - b, y0], [xe, y0], [xe, y0 + b]])} fill="rgba(208,168,79,0.16)" stroke={C.brass} strokeWidth="0.8" strokeDasharray="2 2" />
      <path d={PZ([[xe, y1 - b], [xe, y1], [xe - b, y1]])} fill="rgba(208,168,79,0.16)" stroke={C.brass} strokeWidth="0.8" strokeDasharray="2 2" />
      <Break x={xb} y1={y0} y2={y1} />
      <Beveller x={xe - b / 2} y={y0 + b / 2} ang={45} k={0.85} />
      <Beveller x={xe - b / 2} y={y1 - b / 2} ang={135} k={0.85} op={0.45} />
      <Num x={330} y={36} n={1} />
      <T x={344} y={40} s={11.5} c={C.text}>top arris</T>
      <Num x={330} y={226} n={2} />
      <T x={344} y={230} s={11.5} c={C.text}>flip: back arris</T>
      <LeadA p={[150, y0]} t={[150, 66]} text="grain" a="middle" />
      <Lead p={[150, y1]} t={[150, 182]} text="flesh — the wrist face" sub="it shows: bevel it too" a="middle" />
      <Dim a={[82, y0]} b={[82, y1]} text="" />
      <T x={76} y={118} a="end" s={11} mono c={C.text}>2.0–</T>
      <T x={76} y={132} a="end" s={11} mono c={C.text}>2.4</T>
      <Lead p={[xe - 3, y0 + 2]} t={[300, 84]} text="chip lifts off" a="start" />
      <Lead p={[xe - 4, y1 - 4]} t={[300, 168]} text="bevel ≈ 0.5–0.7 mm" a="start" s={11} />
      <Note x={344} y={114} head="Beveller size" hc={C.text} lines={['#0–#1  dress strap', '#2  heavy stock']} s={11} />
      {/* before / after mini sections */}
      <Sep x1={14} y1={246} x2={466} y2={246} />
      <Tag x={20} y={264}>result</Tag>
      <path d={PZ([[86, 268], [166, 268], [166, 290], [86, 290]])} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <T x={176} y={283} s={10.5}>unbevelled: a hard arris</T>
      <path d={PZ([[290, 268], [364, 268], [370, 274], [370, 284], [364, 290], [290, 290]])} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <T x={380} y={277} s={10.5} c={C.emerald}>both arrises:</T>
      <T x={380} y={290} s={10.5} c={C.emerald}>ready to burnish</T>
    </Fig>
  )
}

/* 4 · Holes and slot, while flat */
function UHoles() {
  const T1 = { x: 64, y: 78, s: 2.3 }
  const oL = LONG({ x0: -TAIL })
  const hx = holeXs(120)
  const ph = px(T1, hx[3], 0)
  const T2 = { x: 60 - 56 * 5, y: 238, s: 5 }
  const o2 = SHORT({ x0: 56, x1: 108 })
  const h1 = px(T2, 76.1, 0)
  const h2 = px(T2, 83.9, 0)
  const r = 1.1 * 5
  const fx = px(T2, 80, 0)[0]
  return (
    <Fig h={324} view="Plan · holes and slot, pieces flat" scale="plan ×2.3 · detail ×5">
      <StrapPlan T={T1} o={oL} holes={{}} folds={[{ x: 0 }]} />
      <Punch d={5} x={ph[0]} y={ph[1]} k={0.72} />
      <Dim a={px(T1, hx[0], 0)} b={px(T1, 120, 0)} off={26} text="25" flip />
      <Lead p={px(T1, hx[6], 0)} t={[118, 128]} text="7 holes · Ø 1.5–2" sub="7 mm pitch, on the centreline" a="middle" />
      <T x={ph[0] + 22} y={30} s={11} c={C.text}>round punch</T>
      <T x={ph[0] + 22} y={43} s={10} c={C.faint}>Ø ≥ tongue, on a pad</T>
      <T x={px(T1, 0, 0)[0]} y={42} a="middle" s={10}>fold</T>
      {/* slot detail */}
      <Sep x1={14} y1={150} x2={466} y2={150} />
      <Tag x={20} y={168}>short piece · buckle end · ×5</Tag>
      <StrapPlan T={T2} o={o2} />
      <line x1={fx} y1={186} x2={fx} y2={300} stroke={C.text} strokeWidth="1" strokeDasharray="4 3" />
      <Break x={60} y1={192} y2={284} />
      <circle cx={h1[0]} cy={h1[1]} r={r} fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />
      <circle cx={h2[0]} cy={h2[1]} r={r} fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />
      <line x1={h1[0]} y1={h1[1] - r} x2={h2[0]} y2={h2[1] - r} stroke={C.hole} strokeWidth="1.6" />
      <line x1={h1[0]} y1={h1[1] + r} x2={h2[0]} y2={h2[1] + r} stroke={C.brass} strokeWidth="1.2" strokeDasharray="3 2" />
      <Knife kind="utility" x={fx + 4} y={h1[1] + r} ang={200} k={0.6} />
      <Num x={h1[0] - 22} y={h1[1]} n={1} />
      <Num x={h2[0] + 22} y={h2[1]} n={2} />
      <Num x={fx + 28} y={h1[1] + 26} n={3} />
      <Dim a={[h1[0] - r, h1[1] - 6]} b={[h2[0] + r, h1[1] - 6]} off={-50} text="≈ 10" flip />
      <T x={fx + 8} y={306} s={10.5}>buckle fold</T>
      <Note x={334} y={196} head="Slot" hc={C.text} lines={['1, 2 · round punch', 'at each end', '3 · knife cut between', 'centred on the fold;', 'width = tongue']} s={11} lh={14.5} />
    </Fig>
  )
}

/* 5 · Oil, then dye cut 1:1 */
function UDye() {
  const id = uid()
  const Tt = { x: 64, y: 112, s: 2.3 }
  const o = LONG({ x0: -TAIL })
  const d = pathOf(outline(o), Tt)
  const xa = px(Tt, 25, 0)[0]
  const xm = px(Tt, 70, 0)[0]
  const xz = px(Tt, 126, 0)[0]
  const d1 = px(Tt, 46, 0)
  const d2 = px(Tt, 98, 0)
  return (
    <Fig h={300} view="Plan · oil, then dye" scale="schematic">
      <clipPath id={`dy${id}`}>
        <path d={d} />
      </clipPath>
      <StrapPlan T={Tt} o={o} />
      <g clipPath={`url(#dy${id})`}>
        <rect x={xa} y={60} width={xz - xa} height={110} fill="rgba(120,70,28,0.30)" />
        <rect x={xm} y={60} width={xz - xm} height={110} fill="rgba(42,22,9,0.74)" />
      </g>
      <Dauber x={d1[0]} y={d1[1]} c="#cfa65a" ang={-8} k={0.95} />
      <Dauber x={d2[0]} y={d2[1]} c="#2e1a0c" ang={-8} k={0.95} />
      <Arrow d={`M${d1[0] - 34} ${d1[1] + 14} q34 10 68 0`} w={1.5} both />
      <Arrow d={`M${d2[0] - 34} ${d2[1] + 14} q34 10 68 0`} w={1.5} both />
      <Num x={d1[0] - 18} y={44} n={1} />
      <Num x={d2[0] - 18} y={44} n={2} />
      <T x={px(Tt, 2, 0)[0]} y={156} a="middle" s={10.5}>untreated</T>
      <T x={d1[0]} y={156} a="middle" s={11} c={C.text}>neatsfoot</T>
      <T x={d1[0]} y={170} a="middle" s={10}>one light coat</T>
      <T x={d2[0]} y={156} a="middle" s={11} c={C.text}>dye</T>
      <T x={d2[0]} y={170} a="middle" s={10}>thinned 1:1</T>
      {/* the mix */}
      <Sep x1={14} y1={190} x2={466} y2={190} />
      <Tag x={20} y={210}>the dye mix</Tag>
      <Jar x={60} y={222} fill="#3a2212" level={0.55} label="dye" />
      <T x={104} y={248} a="middle" s={16} c={C.text}>+</T>
      <Jar x={118} y={222} fill="rgba(170,205,222,0.35)" level={0.55} label="thinner" />
      <T x={166} y={248} a="middle" s={16} c={C.text}>=</T>
      <Jar x={180} y={210} w={32} h={48} fill="#5a3518" level={0.62} label="1 : 1" />
      <Note x={258} y={222} head="Order" hc={C.text} lines={['oil, then dye: work the', 'whole piece while it is', 'still flat; the sealer', 'comes last (step 14)']} s={10.5} lh={14} />
    </Fig>
  )
}

/* 6 · Edges finished now, while the piece is flat */
function UEdges() {
  const Tt = { x: 60, y: 96, s: 2.3 }
  const o = LONG({ x0: -TAIL })
  const se = px(Tt, 40, -widthAt(40, o) / 2)
  const sl = px(Tt, 88, widthAt(88, o) / 2)
  return (
    <Fig h={316} view="Plan + section · edges while flat" scale="plan ×2.3">
      <StrapPlan T={Tt} o={o} holes={{}} folds={[{ x: 0 }]} />
      <Sander len={66} grit="400" x={se[0]} y={se[1]} />
      {[[-10, -24], [-2, -30], [8, -22]].map(([dx, dy], i) => (
        <path key={i} d={`M${se[0] + 40 + dx} ${se[1] + dy} q-2.6 4.2 0 6 q2.6 -1.8 0 -6 Z`} fill="#9cc2d6" />
      ))}
      <Arrow a={[se[0] - 30, se[1] - 26]} b={[se[0] + 26, se[1] - 26]} w={1.5} both />
      <T x={se[0] - 38} y={se[1] - 18} a="end" s={11.5} c={C.text}>wet-sand 400</T>
      <Slicker len={60} x={sl[0]} y={sl[1]} ang={180} />
      <Arrow a={[sl[0] - 30, sl[1] + 30]} b={[sl[0] + 30, sl[1] + 30]} w={1.5} both />
      <T x={sl[0] + 40} y={sl[1] + 18} s={11.5} c={C.text}>burnish</T>
      <T x={sl[0] + 40} y={sl[1] + 32} s={10} c={C.faint}>slicker, then canvas</T>
      <T x={px(Tt, 0, 0)[0]} y={140} a="middle" s={10}>fold not yet made</T>
      {/* edge progression */}
      <Sep x1={14} y1={168} x2={466} y2={168} />
      <Tag x={20} y={186}>the edge, in section</Tag>
      <XSec cx={66} y={204} w={70} layers={[{ k: 'top', t: 22 }]} edge="bevel" b={5} />
      <T x={66} y={246} a="middle" s={10.5}>bevelled</T>
      <Arrow a={[106, 215]} b={[128, 215]} w={1.4} />
      <XSec cx={168} y={204} w={70} layers={[{ k: 'top', t: 22 }]} edge="round" />
      <T x={168} y={246} a="middle" s={10.5}>sanded, burnished</T>
      <T x={168} y={259} a="middle" s={10} c={C.faint}>a glassy round edge</T>
      {/* why now */}
      <Sep x1={238} y1={180} x2={238} y2={300} />
      <Tag x={252} y={186}>after folding</Tag>
      <UFold cx={290} yTop={212} s={2.6} k={6} end={62} />
      <circle cx={290} cy={224} r={22} fill="none" stroke={C.ruby} strokeWidth="1.2" strokeDasharray="3 2" />
      <Verdict x={444} y={266} ok={false} r={8} />
      <T x={352} y={262} a="middle" s={10.5} c={C.ruby}>doubled and stitched:</T>
      <T x={352} y={276} a="middle" s={10.5} c={C.ruby}>hard to burnish later</T>
      <T x={240} y={306} a="middle" s={10.5} c={C.faint}>finish every edge now — before any fold closes</T>
    </Fig>
  )
}

/* 7 · The flesh face becomes the wrist face: sand, trim, slick */
function UFlesh() {
  const ys = 120
  const panel = (x, n, title, sub, kind) => {
    const fibres = []
    if (kind === 1)
      for (let i = 0; i < 30; i++) {
        const fx = x + 4 + i * 3.1
        const h = 3 + ((i * 7) % 5)
        const lean = ((i * 5) % 7) - 3
        fibres.push(<path key={i} d={`M${fx} ${ys} q${lean * 0.4} ${-h * 0.6} ${lean} ${-h}`} fill="none" stroke="#e8cfa0" strokeWidth="0.9" />)
      }
    if (kind === 2)
      for (let i = 0; i < 6; i++) {
        const fx = x + 54 + i * 8
        fibres.push(<path key={i} d={`M${fx} ${ys} q3 -8 -1 -14 q-3 -5 3 -9`} fill="none" stroke="#e8cfa0" strokeWidth="1" />)
      }
    return (
      <g>
        <rect x={x} y={ys} width="100" height="30" fill="url(#ur-fleshUp)" stroke="#4a3018" strokeWidth="0.8" />
        {fibres}
        {kind === 2 && <path d={`M${x} ${ys - 1.2} H${x + 50}`} stroke="#e8cfa0" strokeWidth="1.4" />}
        {kind === 3 && <rect x={x} y={ys - 3} width="100" height="3.4" fill="rgba(238,228,204,0.6)" />}
        {kind === 4 && <line x1={x + 4} y1={ys + 1.5} x2={x + 96} y2={ys + 1.5} stroke="#fff6e4" strokeWidth="1.1" opacity="0.8" />}
        {kind === 1 && <Sander len={72} grit="400–600" x={x + 50} y={ys - 8} />}
        {kind === 1 && <Arrow a={[x + 14, ys - 34]} b={[x + 86, ys - 34]} w={1.4} both />}
        {kind === 2 && <Knife kind="skive" x={x + 52} y={ys - 1} ang={-80} k={0.55} />}
        {kind === 3 && <Brush x={x + 62} y={ys - 3} ang={28} k={0.6} />}
        {kind === 4 && <Slicker len={62} x={x + 50} y={ys - 1} />}
        {kind === 4 && <Arrow a={[x + 14, ys - 30]} b={[x + 86, ys - 30]} w={1.4} both />}
        <Num x={x + 10} y={ys + 52} n={n} r={7} />
        <T x={x + 22} y={ys + 56} s={11} c={C.text}>{title}</T>
        <T x={x + 22} y={ys + 70} s={10}>{sub}</T>
      </g>
    )
  }
  const Tp = { x: 36, y: 262, s: 1.9 }
  const o = LONG()
  const id = uid()
  return (
    <Fig h={330} view="Detail · the flesh face, magnified" scale="schematic">
      <LocalDefs />
      <T x={20} y={44} s={10.5} c={C.faint}>flesh side up · section through the surface</T>
      {panel(16, 1, 'sand', '400 → 600', 1)}
      {panel(132, 2, 'skive off', 'stringy fibres', 2)}
      {panel(248, 3, 'gum tragacanth', 'or Tokonole', 3)}
      {panel(364, 4, 'burnish', 'slick and smooth', 4)}
      <Sep x1={14} y1={208} x2={466} y2={208} />
      <Tag x={20} y={226}>plan · the wrist side</Tag>
      <clipPath id={`fl${id}`}>
        <path d={pathOf(outline(o), Tp)} />
      </clipPath>
      <StrapPlan T={Tp} o={o} face="flesh" />
      <g clipPath={`url(#fl${id})`}>
        <rect x={px(Tp, 60, 0)[0]} y={230} width="140" height="60" fill="rgba(236,214,176,0.86)" />
        <line x1={px(Tp, 64, 0)[0]} y1={258} x2={px(Tp, 116, 0)[0]} y2={258} stroke="#fff6e4" strokeWidth="1.2" opacity="0.6" />
      </g>
      <Lead p={px(Tp, 30, 6)} t={[px(Tp, 30, 0)[0], 300]} text="as cut: fibrous" a="middle" s={11} />
      <Lead p={px(Tp, 88, 6)} t={[px(Tp, 88, 0)[0], 300]} text="finished: smooth" a="middle" s={11} />
      <T x={292} y={248} s={11.5} c={C.text}>Unlined: the flesh</T>
      <T x={292} y={262} s={11.5} c={C.text}>is the wrist face.</T>
      <T x={292} y={280} s={10.5}>Finish it like an edge:</T>
      <T x={292} y={293} s={10.5}>smooth, no loose</T>
      <T x={292} y={306} s={10.5}>fibres against the skin.</T>
    </Fig>
  )
}

/* 8 · Skive the tails: ~0.8 mm, from 4.8 mm beyond the stitch line */
function USkive() {
  const s = 6
  const k = 12
  const x0 = 170
  const yG = 158
  const X = (u) => x0 + u * s
  const Y = (th) => yG - th * k
  const uE = 25
  const piece = [[X(-TAIL), yG], [X(-TAIL), Y(0.8)], [X(RAMP[0]), Y(0.8)], [X(RAMP[1]), Y(2.2)], [X(uE), Y(2.2)], [X(uE), yG]]
  const ghost = [[X(-TAIL), Y(0.8)], [X(-TAIL), Y(2.2)], [X(RAMP[1]), Y(2.2)], [X(RAMP[0]), Y(0.8)]]
  const pass = (th) => {
    const u = RAMP[0] + ((th - 0.8) / 1.4) * (RAMP[1] - RAMP[0])
    return [[X(-TAIL), Y(th)], [X(u), Y(th)]]
  }
  const kn = [X(7), Y(0.8 + (2 / 4.2) * 1.4)]
  // alternative
  const s2 = 3.4
  const k2 = 8
  const X2 = (u) => 66 + (u + TAIL) * s2
  const yG2 = 292
  const Y2 = (th) => yG2 - th * k2
  const alt = [[X2(-TAIL), yG2], [X2(-TAIL), Y2(0.7)], [X2(-TAIL + 9.5), Y2(2.2)], [X2(uE), Y2(2.2)], [X2(uE), yG2]]
  return (
    <Fig h={316} view="Section · lug end, flat, flesh up" scale="thickness ×2">
      <LocalDefs />
      <Slab x={44} y={yG} w={300} h={10} kind="glass" />
      <path d={PZ(ghost)} fill="rgba(208,168,79,0.14)" stroke={C.brass} strokeWidth="0.8" strokeDasharray="3 2" />
      {[1.75, 1.3].map((th, i) => (
        <path key={i} d={P(pass(th))} fill="none" stroke={C.brass} strokeWidth="0.8" strokeDasharray="2 2.5" />
      ))}
      <path d={PZ(piece)} fill="url(#ur-fleshUp)" stroke="#4a3018" strokeWidth="0.9" strokeLinejoin="round" />
      <Break x={X(uE)} y1={Y(2.2)} y2={yG} />
      <Knife kind="skive" x={kn[0]} y={kn[1]} ang={-70} k={0.68} />
      <line x1={X(0)} y1={Y(2.2) - 12} x2={X(0)} y2={yG + 16} stroke={C.text} strokeWidth="1" strokeDasharray="4 3" />
      <T x={X(0)} y={yG + 28} a="middle" s={10.5}>fold line (round the bar)</T>
      <line x1={X(JOINT)} y1={Y(2.2) - 6} x2={X(JOINT)} y2={Y(2.2) + 4} stroke={C.thread} strokeWidth="1.6" />
      <Lead p={[X(JOINT), Y(2.2) - 6]} t={[X(JOINT) + 30, 70]} text="stitch line" sub="the skive starts 4.8 mm beyond it" a="start" />
      <Dim a={[X(RAMP[1]), Y(2.2)]} b={[X(JOINT), Y(2.2)]} off={-14} text="4.8" />
      <Dim a={[X(-TAIL) - 7, yG]} b={[X(-TAIL) - 7, Y(0.8)]} text="" />
      <T x={X(-TAIL) - 12} y={yG - 1} a="end" s={11} mono c={C.text}>0.8</T>
      <Dim a={[X(uE) + 10, yG]} b={[X(uE) + 10, Y(2.2)]} text="" />
      <T x={X(uE) + 16} y={yG - 10} s={11} mono c={C.text}>2.0–2.4</T>
      <LeadA p={[X(-13), Y(0.8)]} t={[X(-13) + 4, 96]} text="tail skived to ≈ 0.8 mm" sub="light passes, never one heavy cut" a="middle" />
      <T x={X(-TAIL) + 6} y={yG + 28} s={10} c={C.faint}>tail tip</T>
      <T x={360} y={yG + 6} s={10} c={C.faint}>glass</T>
      {/* alternative */}
      <Sep x1={14} y1={206} x2={466} y2={206} />
      <Tag x={20} y={224}>alternative · full thickness at the case</Tag>
      <path d={PZ([[X2(-TAIL), Y2(0.7)], [X2(-TAIL), Y2(2.2)], [X2(-TAIL + 9.5), Y2(2.2)]])} fill="rgba(208,168,79,0.14)" stroke={C.brass} strokeWidth="0.8" strokeDasharray="3 2" />
      <path d={PZ(alt)} fill="url(#ur-fleshUp)" stroke="#4a3018" strokeWidth="0.9" />
      <Break x={X2(uE)} y1={Y2(2.2)} y2={yG2} />
      <line x1={X2(0)} y1={Y2(2.2) - 8} x2={X2(0)} y2={yG2 + 8} stroke={C.text} strokeWidth="1" strokeDasharray="4 3" />
      <Dim a={[X2(-TAIL), Y2(2.2)]} b={[X2(-TAIL + 9.5), Y2(2.2)]} off={-12} text="" />
      <T x={X2(-TAIL) - 6} y={Y2(2.2) - 8} a="end" s={11} mono c={C.text}>≈ 9.5</T>
      <T x={X2(0)} y={Y2(2.2) - 12} a="middle" s={10}>fold</T>
      <Note x={250} y={250} lines={['skive only the last ~9.5 mm;', 'the loop stays full thickness', 'where the strap bears on the case']} s={10.5} lh={14} />
    </Fig>
  )
}

/* 9 · Glue the tip first, pass it round the buckle grain-side out */
function UTip() {
  const g = { cx: 330, yTop: 104, s: 6, k: 12, end: 46, open: 18, mirror: true }
  const G = ufGeom(g)
  const xt = G.X(TAIL)
  const x3 = G.X(TAIL - 3.2)
  const tyT = G.cy + G.rr + 18
  const ty3 = G.cy + G.rr + (18 * (TAIL - 3.2)) / TAIL
  const yFull = g.yTop + 2.2 * g.k
  return (
    <Fig h={300} view="Section · buckle end, tail passed round" scale="thickness ×2">
      <UFold {...g} bar="buckle" glue={{ tip: true, land: true }} />
      <Arrow a={[(xt + x3) / 2, tyT - 4]} b={[(xt + x3) / 2, yFull + 3]} w={1.6} />
      <Dim a={[xt, tyT + 14]} b={[x3, tyT + 14]} text="" />
      <T x={(xt + x3) / 2} y={tyT + 30} a="middle" s={11} mono c={C.text}>3.2</T>
      <LeadA p={[(xt + x3) / 2 - 4, yFull]} t={[256, 60]} text="its landing, glued too" a="middle" />
      <Lead p={[xt + 2, tyT - 1]} t={[96, 214]} text="tail tip glued first" sub="~3.2 mm, both faces" a="middle" />
      <Lead p={[G.X(7), G.cy + G.rr + 8.5]} t={[270, 226]} text="rest of the overlap" sub="no glue yet" a="middle" />
      <Lead p={[346.5, 132]} t={[400, 196]} text="grain side out" sub="round the hardware" a="middle" />
      <LeadA p={[392, 112]} t={[420, 66]} text="buckle" a="middle" />
      <LeadA p={[G.X(38), g.yTop]} t={[90, 60]} text="body, full thickness" a="middle" />
      <LeadA p={[G.X(3), G.y1 - 2]} t={[G.X(3) - 6, 84]} text="thin zone" a="end" s={10.5} />
      <Legend x={30} y={284} items={[['top', 'leather'], ['glue', 'contact cement']]} />
    </Fig>
  )
}

/* 10 · Glue the rest of the overlap, away from the hardware, clamp */
function UOverlap() {
  const g = { cx: 74, yTop: 108, s: 6, k: 12, end: 62 }
  const G = ufGeom(g)
  const yb = G.bu(14) + G.tk
  return (
    <Fig h={290} view="Section · lug end, overlap glued" scale="thickness ×2">
      <UFold {...g} glue={{ all: true }} />
      <Press x={G.X(10.5)} yTop={g.yTop} yBot={yb} />
      <Press x={G.X(15.6)} yTop={g.yTop} yBot={yb} />
      <T x={G.X(13)} y={64} a="middle" s={11.5} c={C.text}>clamp</T>
      <Arrow a={[G.X(5), yb + 46]} b={[G.X(17), yb + 46]} w={1.8} />
      <T x={G.X(11)} y={yb + 64} a="middle" s={11} c={C.text}>work away from the bar</T>
      <NoGlue x1={g.cx + 6} x2={G.X(G.uc) - 2} y={G.y1 + 3} h={5} />
      <Lead p={[g.cx, G.cy + G.rr * 0.92]} t={[40, 224]} text="channel" sub="no glue: the bar must turn" a="start" c={C.ruby} />
      <Lead p={[G.X(TAIL), yb - 3]} t={[260, 210]} text="tip, set first" a="start" />
      <Lead p={[G.X(12), G.bu(12)]} t={[330, 160]} text="overlap cemented" sub="flesh to flesh" a="start" />
      <LeadA p={[G.X(36), g.yTop]} t={[G.X(36), 74]} text="body" a="middle" />
      <LeadA p={[g.cx - 4, G.cy - 3]} t={[40, 70]} text="spring bar" a="middle" />
      <Legend x={30} y={276} items={[['glue', 'cement'], ['noglue', 'no glue']]} />
    </Fig>
  )
}

/* 11 · Punch the stitch holes with a 4 mm 2-prong chisel */
function UPunch() {
  const g = { cx: 60, yTop: 114, s: 6, k: 12, end: 64 }
  const G = ufGeom(g)
  const done = [6, 10, 14]
  const ahead = [26, 30, 34, 38, 42, 46, 50, 54, 58]
  const Tp = { x: 60, y: 302, s: 6 }
  const oP = LONG({ x1: 64, w1: 18.78, taper: [8, 64], tip: 'square' })
  const id = uid()
  const rowY = (u) => -widthAt(u, oP) / 2 + 3.2
  return (
    <Fig h={322} view="Side + plan · punching the joint" scale="thickness ×2 · plan ×6">
      <Slab x={36} y={G.cy + G.Ro + 1} w={420} h={9} kind="pad" />
      <UFold {...g} slits={done} />
      {ahead.map((u) => (
        <line key={u} x1={G.X(u)} y1={g.yTop - 3} x2={G.X(u)} y2={g.yTop + 2} stroke={C.hole} strokeWidth="1.4" />
      ))}
      <Iron n={2} pitch={24} kind="chisel" x={G.X(18)} y={g.yTop + 7} />
      <Arrow a={[G.X(20), 26]} b={[G.X(20), 42]} w={1.8} />
      <T x={G.X(20) + 12} y={36} s={11} c={C.text}>strike</T>
      <Lead p={[G.X(22) + 8, 70]} t={[262, 62]} text="4 mm 2-prong chisel" a="start" />
      <Lead p={[G.X(10), G.bu(10) + 4]} t={[200, 186]} text="through body and tail" sub="both layers at once" a="start" />
      <Lead p={[G.X(34), g.yTop - 1]} t={[360, 98]} text="awl marks to follow" a="start" />
      <T x={420} y={G.cy + G.Ro + 22} a="end" s={10} c={C.faint}>poundo board</T>
      {/* plan, half width */}
      <Sep x1={14} y1={214} x2={466} y2={214} />
      <Tag x={20} y={232}>plan · half width</Tag>
      <clipPath id={`pp${id}`}>
        <rect x={0} y={236} width={480} height={58} />
      </clipPath>
      <g clipPath={`url(#pp${id})`}>
        <StrapPlan T={Tp} o={oP} />
        <line x1={px(Tp, TAIL, 0)[0]} y1={240} x2={px(Tp, TAIL, 0)[0]} y2={300} stroke={C.dim} strokeWidth="1" strokeDasharray="3 3" />
        {[...done, 18, 22].map((u) => {
          const [x, y] = px(Tp, u, rowY(u))
          const cur = u >= 18
          return <line key={u} x1={x - 2.6} y1={y + 2.6} x2={x + 2.6} y2={y - 2.6} stroke={cur ? C.brass : C.hole} strokeWidth={cur ? 2.4 : 1.8} strokeLinecap="round" />
        })}
        {ahead.map((u) => {
          const [x, y] = px(Tp, u, rowY(u))
          return <circle key={u} cx={x} cy={y} r="1.3" fill={C.hole} />
        })}
        {(() => {
          const [x, y] = px(Tp, JOINT, -2.25)
          return <line x1={x - 2.6} y1={y + 2.6} x2={x + 2.6} y2={y - 2.6} stroke={C.hole} strokeWidth="1.8" strokeLinecap="round" />
        })()}
      </g>
      <SpringBar x={60} y1={240} y2={300} r={3} />
      <HBreak y={296} x1={66} x2={450} />
      <Dim a={px(Tp, 18, rowY(18))} b={px(Tp, 22, rowY(22))} off={-10} text="" />
      <Lead p={[px(Tp, 20, 0)[0], px(Tp, 18, rowY(18))[1] - 10]} t={[300, 228]} text="4 mm pitch" a="start" s={10.5} dot={false} />
      <Lead p={[px(Tp, TAIL, 0)[0], 288]} t={[200, 314]} text="tail tip, under" a="start" s={10.5} />
      <Lead p={px(Tp, JOINT, -2.25)} t={[96, 314]} text="joint row" a="end" s={10.5} />
    </Fig>
  )
}

/* 12 · Saddle-stitch: each joint hole passed three times */
function UStitch() {
  const Tt = { x: 66, y: 120, s: 6 }
  const o = LONG({ x1: 50, w1: 19.09, taper: [8, 50], tip: 'square' })
  const w14 = widthAt(JOINT, o) / 2
  const ys = [-(w14 - 3.2), -2.25, 2.25, w14 - 3.2]
  const cx = px(Tt, JOINT, 0)[0]
  const st = px(Tt, 26, widthAt(26, o) / 2 - 3.2)
  const ins = { x: 330, y: 192, w: 140, h: 112 }
  return (
    <Fig h={326} view="Plan · stitching the joint" scale="plan ×6">
      <StrapPlan T={Tt} o={o} stitch={{ m: 3.2, p: 4, from: 5, to: 46 }} />
      <Break x={px(Tt, 50, 0)[0]} y1={56} y2={184} />
      <SpringBar x={66} y1={50} y2={190} r={3} />
      <line x1={px(Tt, TAIL, 0)[0]} y1={64} x2={px(Tt, TAIL, 0)[0]} y2={176} stroke={C.dim} strokeWidth="1" strokeDasharray="3 3" />
      <rect x={cx - 12} y={66} width={24} height={108} rx="5" fill="none" stroke={C.brass} strokeWidth="1" strokeDasharray="3 2" />
      {ys.slice(0, -1).map((ya, i) => {
        const yb = ys[i + 1]
        const [, y1] = px(Tt, JOINT, ya)
        const [, y2] = px(Tt, JOINT, yb)
        return [-2.6, 0, 2.6].map((dx, j) => <line key={i + '-' + j} x1={cx - 3 + dx} y1={y1 + 2.5} x2={cx + 3 + dx} y2={y2 - 2.5} stroke={C.thread} strokeWidth="1.2" strokeLinecap="round" />)
      })}
      {ys.map((y, i) => (
        <circle key={i} cx={cx} cy={px(Tt, JOINT, y)[1]} r="1.8" fill={C.hole} />
      ))}
      <Lead p={[cx + 12, 72]} t={[200, 36]} text="joint row" sub="each hole passed 3×" a="start" />
      <Lead p={[px(Tt, TAIL, 0)[0], 172]} t={[120, 214]} text="tail tip (under)" a="middle" s={10.5} />
      <Lead p={px(Tt, 40, -(widthAt(40, o) / 2 - 3.2))} t={[330, 44]} text="edges stitched too" a="start" />
      <Lead p={[66, 52]} t={[30, 36]} text="bar" a="middle" s={10.5} />
      {/* start mid-seam */}
      <circle cx={st[0]} cy={st[1]} r="4.5" fill="none" stroke={C.brass} strokeWidth="1.3" />
      <path d={`M${st[0]} ${st[1]} Q${st[0] - 10} ${st[1] + 26} ${st[0] - 32} ${st[1] + 50}`} fill="none" stroke={C.thread} strokeWidth="1.3" />
      <path d={`M${st[0]} ${st[1]} Q${st[0] + 10} ${st[1] + 26} ${st[0] + 32} ${st[1] + 50}`} fill="none" stroke={C.thread} strokeWidth="1.3" />
      <Needle x1={st[0] - 52} y1={st[1] + 72} x2={st[0] - 32} y2={st[1] + 50} />
      <Needle x1={st[0] + 52} y1={st[1] + 72} x2={st[0] + 32} y2={st[1] + 50} />
      <T x={st[0]} y={st[1] + 96} a="middle" s={11.5} c={C.text}>start mid-seam</T>
      <T x={st[0]} y={st[1] + 111} a="middle" s={10.5}>≈ 400 mm (16 in) of thread per row</T>
      <T x={st[0]} y={st[1] + 125} a="middle" s={10} c={C.faint}>a needle on each end</T>
      {/* the joint hole, magnified */}
      <Inset {...ins} tag="one joint hole" a="end" />
      <path d={`M${ins.x + 14} ${ins.y + 46} H${ins.x + 126} V${ins.y + 80} H${ins.x + 14} Z`} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <path d={`M${ins.x + 14} ${ins.y + 80} H${ins.x + 126} V${ins.y + 92} H${ins.x + 14} Z`} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" opacity="0.85" />
      <rect x={ins.x + 66} y={ins.y + 44} width="8" height="50" fill={C.ground} />
      {[-5, 0, 5].map((dx, i) => (
        <path key={i} d={`M${ins.x + 70 + dx * 0.3} ${ins.y + 38} L${ins.x + 70 + dx * 0.3} ${ins.y + 98}`} stroke={C.thread} strokeWidth="1.3" />
      ))}
      <path d={`M${ins.x + 30} ${ins.y + 40} Q${ins.x + 70} ${ins.y + 28} ${ins.x + 110} ${ins.y + 40}`} fill="none" stroke={C.thread} strokeWidth="1.2" />
      <path d={`M${ins.x + 30} ${ins.y + 96} Q${ins.x + 70} ${ins.y + 108} ${ins.x + 110} ${ins.y + 96}`} fill="none" stroke={C.thread} strokeWidth="1.2" />
      <T x={ins.x + 70} y={ins.y + 30} a="middle" s={10} c={C.text}>3 passes</T>
      <T x={ins.x + 18} y={ins.y + 66} s={10} c="#3a2614">body</T>
      <T x={ins.x + 96} y={ins.y + 66} s={10} c="#3a2614">body</T>
      <T x={ins.x + 18} y={ins.y + 90} s={10} c="#3a2614">tail</T>
      <Callout cx={cx} cy={px(Tt, JOINT, ys[2])[1]} r={8} />
      <T x={ins.x + 70} y={ins.y + 126} a="middle" s={10} c={C.faint}>the ringed hole, in section</T>
    </Fig>
  )
}

/* 13 · Keepers: scarfed from a measured blank */
function UKeepers() {
  const strip = [[120, 48], [450, 48], [450, 67], [120, 67]]
  return (
    <Fig h={316} view="Sequence · lapped keeper" scale="schematic">
      <Num x={24} y={58} n={1} />
      <path d={PZ(strip)} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.9" />
      <Dim a={[120, 67]} b={[450, 67]} off={14} text="82.6 mm · 3¼ in" flip />
      <T x={112} y={58} a="end" s={11} mono c={C.text}>4.8 mm</T>
      <T x={112} y={71} a="end" s={10} c={C.faint}>3/16 in</T>
      <T x={285} y={40} a="middle" s={10.5} c={C.faint}>blank, cut from the strap leather</T>
      <Sep x1={14} y1={108} x2={466} y2={108} />
      {/* 2 wrap and mark */}
      <Num x={24} y={130} n={2} />
      <rect x={52} y={160} width={76} height={10} rx="2" fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.7" />
      <rect x={52} y={171} width={76} height={10} rx="2" fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.7" />
      <path d="M92 186 H55 Q45 186 45 176 V165 Q45 155 55 155 H125 Q135 155 135 165 V176 Q135 186 125 186 H94" fill="none" stroke="#5c3c1d" strokeWidth="6.5" />
      <path d="M92 186 H55 Q45 186 45 176 V165 Q45 155 55 155 H125 Q135 155 135 165 V176 Q135 186 125 186 H94" fill="none" stroke="#a8763f" strokeWidth="4.6" />
      <path d="M86 192 H113" fill="none" stroke="#a8763f" strokeWidth="4.6" />
      <path d="M113 192 H140" fill="none" stroke="#a8763f" strokeWidth="4.6" strokeDasharray="4 3" opacity="0.6" />
      <line x1={113} y1={185} x2={113} y2={199} stroke={C.brass} strokeWidth="1.8" />
      <Dim a={[90, 204]} b={[113, 204]} text="" />
      <T x={90} y={140} a="middle" s={11} c={C.text}>wrap both straps</T>
      <T x={102} y={222} a="middle" s={10.5}>mark ¼ in (6.4 mm)</T>
      <T x={102} y={235} a="middle" s={10.5}>past the overlap</T>
      <Sep x1={170} y1={120} x2={170} y2={280} />
      {/* 3 scarf skive */}
      <Num x={184} y={130} n={3} />
      <path d="M190 176 L214 166 L302 166 L302 176 Z" fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <path d="M190 176 L190 166 L214 166 Z" fill="rgba(208,168,79,0.16)" stroke={C.brass} strokeWidth="0.8" strokeDasharray="2 2" />
      <path d="M214 166 L302 166 L302 176 L214 176" fill="none" />
      <path d="M302 166 L302 176 L278 176" fill="none" />
      <path d="M190 176 L214 166 L302 166 L302 166" fill="none" />
      <path d="M278 176 L302 166 L302 176 Z" fill="rgba(208,168,79,0.16)" stroke={C.brass} strokeWidth="0.8" strokeDasharray="2 2" />
      <path d="M190 176 L214 166 L302 166 L278 176 Z" fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <T x={246} y={140} a="middle" s={11} c={C.text}>scarf-skive the ends</T>
      <Lead p={[200, 170]} t={[206, 204]} text="grain face" a="middle" s={10.5} />
      <Lead p={[292, 174]} t={[288, 204]} text="flesh face" a="middle" s={10.5} />
      <T x={246} y={228} a="middle" s={10.5}>opposite faces, to ~½</T>
      <T x={246} y={242} a="middle" s={10.5} c={C.faint}>shortens it ≈ ½ in</T>
      <Sep x1={322} y1={120} x2={322} y2={280} />
      {/* 4 glue, clamp */}
      <Num x={336} y={130} n={4} />
      <rect x={350} y={154} width={100} height={42} rx="12" fill="none" stroke="#5c3c1d" strokeWidth="9.5" />
      <rect x={350} y={154} width={100} height={42} rx="12" fill="none" stroke="#a8763f" strokeWidth="7.5" />
      <path d="M390 149.5 L410 158.5" stroke="#4a3018" strokeWidth="1" />
      <path d="M391 152 L409 157" stroke={C.glue} strokeWidth="2.2" strokeDasharray="1.2 2.4" strokeLinecap="round" />
      <Arrow a={[400, 126]} b={[400, 144]} w={1.5} />
      <Arrow a={[400, 178]} b={[400, 164]} w={1.5} />
      <T x={400} y={218} a="middle" s={11} c={C.text}>glue the scarf, clamp</T>
      <T x={400} y={232} a="middle" s={10.5}>joint the same</T>
      <T x={400} y={245} a="middle" s={10.5}>thickness as the strip</T>
      <T x={240} y={302} a="middle" s={10.5} c={C.faint}>finish the keeper’s edges before closing it</T>
    </Fig>
  )
}

/* 14 · Seal and condition */
function USeal() {
  const T1 = { x: 44, y: 98, s: 2.2 }
  const T2 = { x: 44, y: 196, s: 2.2 }
  const o1 = LONG()
  const o2 = SHORT()
  const id = uid()
  const dp = px(T1, 72, -1)
  return (
    <Fig h={300} view="Plan · the finished pair, sealed" scale="plan ×2.2">
      <clipPath id={`se${id}`}>
        <path d={pathOf(outline(o1), T1)} />
      </clipPath>
      <StrapPlan T={T1} o={o1} stitch={{ m: 3.2, p: 4, from: 4 }} holes={{}} />
      <g clipPath={`url(#se${id})`}>
        <rect x={44} y={60} width={dp[0] - 44} height={80} fill="rgba(255,250,236,0.13)" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1={60 + i * 22} y1={120} x2={74 + i * 22} y2={76} stroke="#fffaf0" strokeWidth="1" opacity="0.25" />
        ))}
      </g>
      <SpringBar x={44} y1={68} y2={128} r={2.6} />
      <line x1={px(T1, TAIL, 0)[0]} y1={78} x2={px(T1, TAIL, 0)[0]} y2={118} stroke={C.dim} strokeWidth="0.9" strokeDasharray="3 3" />
      <StrapPlan T={T2} o={o2} stitch={{ m: 3.2, p: 4, from: 4, to: 76 }} keepers={[{ x: 70 }, { x: 54, float: true }]} />
      <SpringBar x={44} y1={166} y2={226} r={2.6} />
      <Buckle x={44 + 80 * 2.2} y={196} w={46} L={36} />
      <Dauber x={dp[0]} y={dp[1]} c="#e6dcc3" ang={12} k={0.85} />
      <Arrow a={[dp[0] - 40, dp[1] + 32]} b={[dp[0] - 4, dp[1] + 32]} w={1.4} />
      <T x={dp[0] + 18} y={46} s={11} c={C.text}>damp sponge</T>
      <Lead p={px(T1, 30, 6)} t={[120, 146]} text="sealed: a faint sheen" a="middle" s={10.5} />
      <Lead p={px(T2, 70, 9)} t={[214, 244]} text="keepers sealed too" a="middle" s={10.5} />
      {/* film detail */}
      <Inset x={322} y={30} w={148} h={118} tag="film, magnified" a="end" />
      <XSec cx={396} y={70} w={104} layers={[{ k: 'top', t: 22 }]} edge="round" />
      <rect x={342} y={67} width={108} height={28} rx="14" fill="none" stroke="#aed7e8" strokeWidth="1.6" />
      <T x={396} y={114} a="middle" s={10.5} c={C.text}>grain, flesh and</T>
      <T x={396} y={127} a="middle" s={10.5} c={C.text}>both edges</T>
      <Note x={322} y={176} head="Seal, then condition" hc={C.text} lines={['Resolene 1:1 with water', '2–3 light coats, sponge', 'condition lightly;', 'never heat-dry']} s={10.5} lh={14} />
      <Legend x={30} y={286} items={[['thread', 'saddle stitch'], ['top', 'one layer, 2.0–2.4']]} />
    </Fig>
  )
}

/* ================================================================== */
/* REMBORDÉ (TURNED EDGE)                                               */
/* ================================================================== */

/* 1 · Pattern: top = finished line + 4–6 mm; core ~1 mm narrower; lining oversize */
function RPattern() {
  const s = 2.1
  const Tt = { x: 54, y: 104, s }
  const fin = outline(LONG({ x0: -15 }))
  const TL = { x: 54, y: 248, s }
  const ins = { x: 334, y: 30, w: 136, h: 168 }
  const ey = 70
  const fy = ey + 50
  const cyy = fy + 10
  const sy = fy + 30
  return (
    <Fig h={306} view="Plan · the three pattern lines" scale="plan ×2.1 · detail ×10">
      <path d={pathOf(topBlank(), Tt)} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="1" />
      <path d={pathOf(corePts(), Tt)} fill="url(#sk-fill)" stroke="#d9b07a" strokeWidth="1" strokeDasharray="4 3" opacity="0.92" />
      <path d={pathOf(fin, Tt, false)} fill="none" stroke={C.brassHi} strokeWidth="1.2" strokeDasharray="5 3" />
      <path d={pathOf(offset(outline(LONG({ x0: -2 })), -3), TL)} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="1" />
      <path d={pathOf(outline(LONG({ x0: -2 })), TL)} fill="none" stroke={C.dim} strokeWidth="0.9" strokeDasharray="3 3" />
      <LeadA p={px(Tt, 48, -14)} t={[150, 48]} text="top: finished line + 4–6 mm a side" a="middle" />
      <Lead p={px(Tt, 92, 9.4)} t={[214, 166]} text="fold line = finished edge" a="middle" />
      <Lead p={px(Tt, 34, 5)} t={[84, 180]} text="core, ≈ 1 mm narrower a side" a="middle" />
      <Lead p={px(Tt, -10, 8)} t={[40, 150]} text="lug end" a="middle" s={10.5} />
      <T x={84} y={210} a="middle" s={10} c={C.faint}>it stops short of the bar fold</T>
      <Lead p={px(TL, 60, 12)} t={[214, 296]} text="lining: cut oversize, trimmed at assembly" a="middle" />
      {/* edge detail */}
      <Callout cx={px(Tt, 100, -11)[0]} cy={px(Tt, 100, -11)[1]} r={9} to={[ins.x, ins.y + 40]} />
      <Inset {...ins} tag="edge ×10" a="end" />
      <rect x={354} y={ey} width={32} height={ins.y + ins.h - 6 - ey} fill="url(#sk-top)" />
      <rect x={354} y={cyy} width={32} height={ins.y + ins.h - 6 - cyy} fill="url(#sk-fill)" opacity="0.92" />
      <line x1={348} y1={fy} x2={392} y2={fy} stroke={C.brassHi} strokeWidth="1.2" strokeDasharray="5 3" />
      <line x1={348} y1={sy} x2={392} y2={sy} stroke={C.thread} strokeWidth="1.2" strokeDasharray="1.5 2.5" />
      <line x1={354} y1={ey} x2={386} y2={ey} stroke="#5c3c1d" strokeWidth="1" />
      <Dim a={[346, fy]} b={[346, sy]} text="" />
      <Dim a={[392, ey]} b={[392, fy]} text="" />
      <T x={400} y={ey + 22} s={11} mono c={C.text}>4–6</T>
      <T x={400} y={ey + 35} s={10} c={C.faint}>allowance</T>
      <Dim a={[392, fy]} b={[392, cyy]} text="" />
      <T x={400} y={fy + 9} s={11} mono c={C.text}>≈ 1</T>
      <T x={400} y={fy + 22} s={10} c={C.faint}>core inset</T>
      <T x={400} y={sy + 6} s={11} mono c={C.text}>3</T>
      <T x={400} y={sy + 19} s={10} c={C.faint}>stitch line:</T>
      <T x={400} y={sy + 31} s={10} c={C.faint}>the turn must</T>
      <T x={400} y={sy + 43} s={10} c={C.faint}>reach past it</T>
    </Fig>
  )
}

/* 2 · Cut: top ~1 mm, core, lining */
function RCut() {
  const s = 2
  const T1 = { x: 50, y: 76, s }
  const T2 = { x: 50, y: 160, s }
  const T3 = { x: 50, y: 236, s }
  const apex = px(T1, 125, 0)
  return (
    <Fig h={292} view="Plan + section · three blanks" scale="plan ×2 · sections ×10">
      <path d={pathOf(topBlank(), T1)} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="1" />
      <path d={pathOf(outline(LONG({ x0: -15 })), T1, false)} fill="none" stroke={C.brassHi} strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
      <Knife kind="utility" x={apex[0]} y={apex[1]} ang={48} k={0.6} />
      <path d={pathOf(corePts(), T2)} fill="url(#sk-fill)" stroke="#d9b07a" strokeWidth="1" />
      <path d={pathOf(offset(outline(LONG({ x0: -2 })), -3), T3)} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="1" />
      <T x={20} y={36} s={10.5} c={C.faint}>top · with its turn allowance</T>
      <T x={20} y={134} s={10.5} c={C.faint}>core · no allowance, 1 mm in</T>
      <T x={20} y={202} s={10.5} c={C.faint}>lining · oversize</T>
      {/* sections */}
      <Sep x1={330} y1={30} x2={330} y2={282} />
      <Tag x={342} y={66}>top</Tag>
      <Ply x1={342} x2={402} y={76} t={10} />
      <T x={410} y={85} s={11} mono c={C.text}>≈ 1 mm</T>
      <T x={342} y={106} s={10}>smooth, dense, stable</T>
      <Tag x={342} y={140}>core</Tag>
      <Ply x1={342} x2={402} y={150} t={12} k="filler" />
      <T x={342} y={180} s={10}>veg-tan, cotton fleece</T>
      <T x={342} y={193} s={10}>or thermo-active fibre</T>
      <Tag x={342} y={222}>lining</Tag>
      <Ply x1={342} x2={402} y={232} t={6} k="lining" />
      <T x={410} y={239} s={11} mono c={C.text}>0.5–0.8</T>
      <T x={342} y={258} s={10}>full or semi rembordé</T>
      <T x={342} y={271} s={10}>decides its final trim</T>
    </Fig>
  )
}

/* 3 · Mark the fold line on the flesh */
function RMark() {
  const s = 4.2
  const Tt = { x: 292 - 120 * s, y: 140, s }
  const o = LONG({ x0: 66 })
  const fin = outline(o)
  const raw = offset(fin, -5)
  const id = uid()
  const x66 = px(Tt, 66, 0)[0]
  const upper = fin.filter((q) => q[1] < 0 && q[0] <= 106)
  const lower = fin.filter((q) => q[1] > 0 && q[0] <= 104)
  const rest = fin.filter((q) => q[0] >= 104 && !(q[1] < 0 && q[0] <= 106))
  const rx0 = 70
  const rx1 = 97
  const rul = []
  for (let i = 0; i <= 6; i++) {
    const x = rx0 + ((rx1 - rx0) * i) / 6
    rul.push([x, -widthAt(x, o) / 2])
  }
  for (let i = 6; i >= 0; i--) {
    const x = rx0 + ((rx1 - rx0) * i) / 6
    rul.push([x, -widthAt(x, o) / 2 - 6.4])
  }
  const lip = []
  for (let i = 0; i <= 6; i++) {
    const x = rx0 + ((rx1 - rx0) * i) / 6
    lip.push([x, -widthAt(x, o) / 2 - 5])
  }
  for (let i = 6; i >= 0; i--) {
    const x = rx0 + ((rx1 - rx0) * i) / 6
    lip.push([x, -widthAt(x, o) / 2 - 6.4])
  }
  const aw = px(Tt, 96.4, -widthAt(96.4, o) / 2)
  // compass on the tip curve
  const tipPts = fin.filter((q) => q[0] > 108 && q[1] < 0)
  const q = tipPts[Math.floor(tipPts.length * 0.45)]
  const qi = fin.indexOf(q)
  const a = fin[qi - 1]
  const b = fin[qi + 1]
  const tl = Math.hypot(b[0] - a[0], b[1] - a[1])
  const tan = [(b[0] - a[0]) / tl, (b[1] - a[1]) / tl]
  const n = [tan[1], -tan[0]]
  const mid = px(Tt, q[0] + n[0] * 2.5, q[1] + n[1] * 2.5)
  const ang = (Math.atan2(n[1], n[0]) * 180) / Math.PI + 180
  const dx = px(Tt, 98, 0)[0]
  const yl = px(Tt, 98, widthAt(98, o) / 2)[1]
  const yr = px(Tt, 98, widthAt(98, o) / 2 + 5)[1]
  const ins = { x: 20, y: 226, w: 226, h: 66 }
  return (
    <Fig h={300} view="Plan · flesh side, scribing the fold line" scale="plan ×4.2">
      <LocalDefs />
      <clipPath id={`mk${id}`}>
        <rect x={x66} y={0} width={480} height={300} />
      </clipPath>
      <g clipPath={`url(#mk${id})`}>
        <path d={pathOf(raw, Tt)} fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="1" />
        <path d={pathOf(raw, Tt)} fill="url(#sk-fibre)" />
        <path d={pathOf(upper, Tt, false)} fill="none" stroke="#5a3b1c" strokeWidth="1.3" />
        <path d={pathOf(lower, Tt, false)} fill="none" stroke="#5a3b1c" strokeWidth="1.3" />
        <path d={pathOf(rest, Tt, false)} fill="none" stroke={C.brass} strokeWidth="1.2" strokeDasharray="5 3" />
      </g>
      <Break x={x66} y1={px(Tt, 66, -14.6)[1]} y2={px(Tt, 66, 14.6)[1]} />
      <path d={pathOf(rul, Tt)} fill="url(#sk-brassG)" stroke="#5c461a" strokeWidth="0.8" opacity="0.94" />
      <path d={pathOf(lip, Tt)} fill="#7d5f22" stroke="#5c461a" strokeWidth="0.6" />
      <Awl kind="round" x={aw[0]} y={aw[1]} ang={28} k={0.7} />
      <Dividers sp={5 * s} h={56} x={mid[0]} y={mid[1]} ang={ang} />
      <LeadA p={px(Tt, 80, -12)} t={[110, 58]} text="brass edge ruler" sub="its lip rides the raw edge" a="middle" />
      <Lead p={[aw[0] + 1, aw[1] + 1]} t={[232, 76]} text="scribe" a="start" s={11} />
      <Lead p={[mid[0] + 8, mid[1] - 10]} t={[372, 70]} text="compass" sub="one leg on the edge" a="start" />
      <Lead p={px(Tt, 113, 7)} t={[372, 196]} text="still to scribe" a="start" s={10.5} c={C.brass} />
      <Lead p={px(Tt, 80, widthAt(80, o) / 2)} t={[120, 214]} text="fold line, scribed" a="middle" s={10.5} />
      <Dim a={[dx, yl]} b={[dx, yr]} text="" />
      <T x={dx + 8} y={yr + 14} s={11} mono c={C.text}>4–6</T>
      <T x={262} y={250} s={10.5} c={C.text}>same width everywhere:</T>
      <T x={262} y={264} s={10.5}>an even margin turns evenly</T>
      {/* the ruler in section */}
      <Inset {...ins} tag="ruler, in section" a="end" />
      <rect x={58} y={268} width={176} height={10} fill="url(#ur-fleshUp)" stroke="#4a3018" strokeWidth="0.7" />
      <path d="M46 254 H128 V268 H58 V282 H46 Z" fill="url(#sk-brassG)" stroke="#5c461a" strokeWidth="0.8" />
      <Awl kind="round" x={129} y={268} ang={24} k={0.32} />
      <T x={146} y={262} s={10} c={C.text}>scribe along its edge</T>
      <T x={28} y={250} s={10} c={C.faint}>lip</T>
      <line x1={40} y1={252} x2={50} y2={262} stroke={C.struct} strokeWidth="0.8" />
    </Fig>
  )
}

/* 4 · V-notches (crans) round the tip margin */
function RNotch() {
  const id = uid()
  const s = 6
  const Tt = { x: 290 - 120 * s, y: 136, s }
  const o = LONG({ x0: 86 })
  const fin = outline(o)
  const raw = offset(fin, -5)
  const run = fin.filter((q) => q[0] >= 104.5)
  const st = resample(run, 3.6).slice(1, -1)
  const tri = st.map(({ p, tan }) => {
    const n = [tan[1], -tan[0]]
    const at = (d, w) => [p[0] + n[0] * d + tan[0] * w, p[1] + n[1] * d + tan[1] * w]
    return { apex: at(0.9, 0), b1: at(5.8, 1.15), b2: at(5.8, -1.15), e1: at(5, 0.96), e2: at(5, -0.96) }
  })
  const x86 = px(Tt, 86, 0)[0]
  const pick = tri[Math.floor(tri.length * 0.25)]
  const pick2 = tri[Math.floor(tri.length * 0.8)]
  const ins = { x: 330, y: 180, w: 140, h: 110 }
  return (
    <Fig h={300} view="Plan · tip margin, flesh up" scale="plan ×6">
      <mask id={`nm${id}`}>
        <rect x="0" y="0" width="480" height="300" fill="#fff" />
        {tri.map((t, i) => (
          <path key={i} d={PZ([t.apex, t.b1, t.b2].map((q) => px(Tt, q[0], q[1])))} fill="#000" />
        ))}
        <rect x="0" y="0" width={x86} height="300" fill="#000" />
      </mask>
      <g mask={`url(#nm${id})`}>
        <path d={pathOf(raw, Tt)} fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="1" />
        <path d={pathOf(raw, Tt)} fill="url(#sk-fibre)" />
        <path d={pathOf(fin, Tt, false)} fill="none" stroke={C.brassHi} strokeWidth="1.2" strokeDasharray="5 3" />
      </g>
      {tri.map((t, i) => (
        <path key={i} d={P([t.e1, t.apex, t.e2].map((q) => px(Tt, q[0], q[1])))} fill="none" stroke="#6f5233" strokeWidth="0.9" strokeLinejoin="round" />
      ))}
      <Break x={x86} y1={px(Tt, 86, -14.2)[1]} y2={px(Tt, 86, 14.2)[1]} />
      <LeadA p={px(Tt, pick.e1[0], pick.e1[1])} t={[180, 44]} text="crans: small V-notches" a="middle" />
      <Lead p={px(Tt, pick2.apex[0], pick2.apex[1])} t={[200, 262]} text="apex stops short of the fold line" a="middle" />
      <Lead p={px(Tt, 100, 9.2)} t={[90, 230]} text="fold line" a="middle" s={10.5} />
      <T x={330} y={60} s={11} c={C.text}>at regular intervals</T>
      <T x={330} y={74} s={10.5}>round the curve only —</T>
      <T x={330} y={87} s={10.5}>the straights turn whole</T>
      <T x={330} y={112} s={11} c={C.text}>cut before skiving</T>
      <T x={330} y={126} s={10.5}>while the margin is firm</T>
      {/* single notch */}
      <Inset {...ins} tag="one cran" a="end" />
      <T x={ins.x + 12} y={ins.y + 30} s={10} c={C.faint}>raw edge</T>
      <path d={`M${ins.x + 12} ${ins.y + 84} H${ins.x + 128} V${ins.y + 36} H${ins.x + 12} Z`} fill="url(#sk-flesh)" />
      <path d={`M${ins.x + 50} ${ins.y + 36} L${ins.x + 68} ${ins.y + 68} L${ins.x + 86} ${ins.y + 36} Z`} fill={C.ground} />
      <path d={`M${ins.x + 50} ${ins.y + 36} L${ins.x + 68} ${ins.y + 68} L${ins.x + 86} ${ins.y + 36}`} fill="none" stroke="#6f5233" strokeWidth="1" />
      <line x1={ins.x + 12} y1={ins.y + 76} x2={ins.x + 128} y2={ins.y + 76} stroke={C.brassHi} strokeWidth="1.2" strokeDasharray="5 3" />
      <Dim a={[ins.x + 104, ins.y + 68]} b={[ins.x + 104, ins.y + 76]} text="" />
      <T x={ins.x + 12} y={ins.y + 100} s={10} c={C.faint}>fold line</T>
      <T x={ins.x + 128} y={ins.y + 100} a="end" s={10} c={C.text}>stops short</T>
      <Callout cx={px(Tt, pick.apex[0], pick.apex[1])[0]} cy={px(Tt, pick.apex[0], pick.apex[1])[1]} r={12} />
      <T x={20} y={290} s={10.5} c={C.faint}>or leave the margin whole and plan to pleat it (step 12)</T>
    </Fig>
  )
}

/* 5 · Groove the boundary with a triangular knife */
function RGroove() {
  const s = 20
  const X = (x) => 250 + (x - 10) * s
  const yG = 150
  const ins = { x: 340, y: 40, w: 130, h: 104 }
  return (
    <Fig h={300} view="Section · at the fold line, flesh up" scale="true scale ×20">
      <LocalDefs />
      <Inset x={14} y={34} w={124} h={120} tag="the V ×40" />
      <path d="M24 104 H64 L78 118 L92 104 H128 V144 H24 Z" fill="url(#ur-fleshUp)" stroke="#4a3018" strokeWidth="0.8" />
      <LeadA p={[78, 116]} t={[78, 94]} text="shallow V" sub="never through" a="middle" s={11} />
      <Callout cx={250} cy={136} r={11} />
      <Slab x={150} y={yG} w={214} h={10} kind="board" />
      <OpenSec cx={X(0)} yG={yG} s={s} groove sides={[1]} clip={[X(5.4), X(15) + 1]} brkL />
      <TriKnife x={X(10)} y={yG - 13} ang={18} k={0.86} />
      <LeadA p={[X(10) - 2, yG - 15]} t={[200, 70]} text="fold line" sub="the V sits on it" a="middle" />
      <Lead p={[X(12.5), yG - 20]} t={[300, 116]} text="margin" a="start" s={10.5} />
      <Lead p={[X(7), yG - 20]} t={[190, 116]} text="body" a="end" s={10.5} />
      <Dim a={[X(10), yG + 12]} b={[X(15), yG + 12]} off={0} text="" />
      <T x={X(12.5)} y={yG + 30} a="middle" s={11} mono c={C.text}>4–6</T>
      <T x={X(7.6)} y={yG + 30} a="middle" s={10} c={C.faint}>grain down</T>
      {/* why: the hinge */}
      <Inset {...ins} tag="the hinge" a="end" />
      <path d={`M${ins.x + 10} ${ins.y + 82} H${ins.x + 64} L${ins.x + 70} ${ins.y + 76} L${ins.x + 70} ${ins.y + 74} L${ins.x + 64} ${ins.y + 72} H${ins.x + 10} Z`} fill="url(#ur-fleshUp)" stroke="#4a3018" strokeWidth="0.8" />
      <path d={`M${ins.x + 64} ${ins.y + 82} L${ins.x + 70} ${ins.y + 82} L${ins.x + 100} ${ins.y + 30} L${ins.x + 94} ${ins.y + 27} L${ins.x + 66} ${ins.y + 74} Z`} fill="url(#ur-fleshUp)" stroke="#4a3018" strokeWidth="0.8" />
      <Arrow d={`M${ins.x + 112} ${ins.y + 62} q4 -18 -8 -32`} w={1.4} />
      <T x={ins.x + 65} y={ins.y + 98} a="middle" s={10} c={C.text}>folds crisply here</T>
      {/* plan strip */}
      <Sep x1={14} y1={200} x2={466} y2={200} />
      <Tag x={20} y={218}>plan · run it the full length</Tag>
      <rect x={40} y={228} width={400} height={50} fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="0.8" />
      <rect x={40} y={228} width={400} height={50} fill="url(#sk-fibre)" />
      <line x1={40} y1={240} x2={440} y2={240} stroke="none" />
      <line x1={40} y1={252} x2={300} y2={252} stroke="#5a3b1c" strokeWidth="2.2" />
      <line x1={40} y1={253.5} x2={300} y2={253.5} stroke="#e9cf9f" strokeWidth="0.7" />
      <line x1={300} y1={252} x2={440} y2={252} stroke={C.brass} strokeWidth="1.1" strokeDasharray="5 3" />
      <Arrow a={[244, 266]} b={[292, 266]} w={1.6} />
      <T x={440} y={222} a="end" s={10} c={C.faint}>raw edge ↑ · margin</T>
      <T x={40} y={292} s={10} c={C.faint}>body ↓</T>
      <T x={300} y={292} a="middle" s={10.5} c={C.text}>groove, cut so far</T>
      <T x={440} y={292} a="end" s={10.5} c={C.brass}>fold line ahead</T>
    </Fig>
  )
}

/* 6 · Skive the margin: step skive vs long taper */
function RSkive() {
  const s = 22
  const X = (x) => 190 + (x - 10) * s
  const yA = 124
  const yB = 252
  const kn = [X(13.8), yB - (0.45 - 0.39 * (3.8 / 5)) * s]
  return (
    <Fig h={322} view="Section · the margin, flesh up" scale="true scale ×22">
      <LocalDefs />
      <Tag x={20} y={40}>A · step skive</Tag>
      <Slab x={80} y={yA} w={228} h={8} kind="glass" />
      <OpenSec cx={X(0)} yG={yA} s={s} skive="step" ghost passes sides={[1]} clip={[X(5.3), X(15) + 1]} brkL />
      <line x1={X(10)} y1={yA - 34} x2={X(10)} y2={yA + 12} stroke={C.text} strokeWidth="0.9" strokeDasharray="4 3" />
      <T x={X(10)} y={yA - 38} a="middle" s={10.5}>fold</T>
      <Dim a={[X(15) + 8, yA]} b={[X(15) + 8, yA - 0.6 * s]} text="" />
      <T x={X(15) + 14} y={yA - 1} s={11} mono c={C.text}>0.6</T>
      <Dim a={[X(10), yA + 14]} b={[X(15), yA + 14]} text="" />
      <T x={X(12.5)} y={yA + 28} a="middle" s={10} mono>margin 4–6</T>
      <Lead p={[X(9.7), yA - 14]} t={[110, 66]} text="step just inside the fold" a="middle" s={10.5} />
      <Note x={330} y={62} head="Step skive" hc={C.text} lines={['a uniform ~0.6 mm band', 'good on chrome calf']} s={10.5} lh={14} />
      <Sep x1={14} y1={164} x2={466} y2={164} />
      <Tag x={20} y={184}>B · long taper</Tag>
      <Slab x={80} y={yB} w={228} h={8} kind="glass" />
      <OpenSec cx={X(0)} yG={yB} s={s} skive="taper" ghost passes sides={[1]} clip={[X(5.3), X(15) + 1]} brkL />
      <line x1={X(10)} y1={yB - 34} x2={X(10)} y2={yB + 12} stroke={C.text} strokeWidth="0.9" strokeDasharray="4 3" />
      <T x={X(10)} y={yB - 38} a="middle" s={10.5}>fold</T>
      <Knife kind="skive" x={kn[0]} y={kn[1]} ang={-76} k={0.5} />
      <Lead p={[X(10), yB - 0.45 * s]} t={[130, 290]} text="0.3–0.6 at the fold" a="middle" />
      <Lead p={[X(15), yB - 1.5]} t={[300, 290]} text="paper-thin" a="middle" />
      <Dim a={[X(9.2), yB - s - 6]} b={[X(10), yB - s - 6]} text="" />
      <T x={X(9.2) - 6} y={yB - s - 2} a="end" s={10}>slightly past the fold</T>
      <Note x={330} y={200} head="Long taper" hc={C.text} lines={['to paper-thin at the edge', 'good on firm leather;', 'on thick leather go', 'slightly past the fold']} s={10.5} lh={14} />
      <T x={240} y={312} a="middle" s={10.5} c={C.text}>bevel knife, then flat knife — small passes (dashed lines), never one cut</T>
    </Fig>
  )
}

/* 7 · Skive the lining edges almost to nothing */
function RLiningSkive() {
  const s = 10
  const k = 20
  const cx = 190
  const yG = 104
  const X = (x) => cx + x * s
  const Y = (z) => yG - z * k
  const th = (ax) => (ax <= 10.5 ? 0.6 : 0.6 - ((ax - 10.5) / 2.5) * 0.55)
  const pts = []
  for (let i = 0; i <= 52; i++) {
    const x = -13 + i * 0.5
    pts.push([X(x), Y(Math.abs(x) > 10.5 && x < 0 ? th(-x) : x > 10.5 ? th(x) : 0.6)])
  }
  const lin = [...pts, [X(13), yG], [X(-13), yG]]
  const ghostR = [[X(10.5), Y(0.6)], [X(13), Y(0.6)], [X(13), Y(0.05)]]
  const kn = [X(11.8), Y(th(11.8))]
  return (
    <Fig h={300} view="Section · lining, across the width" scale="thickness ×2">
      <Slab x={50} y={yG} w={290} h={8} kind="glass" />
      <path d={PZ(ghostR)} fill="rgba(208,168,79,0.14)" stroke={C.brass} strokeWidth="0.8" strokeDasharray="3 2" />
      <path d={PZ(lin)} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.8" strokeLinejoin="round" />
      <Knife kind="skive" x={kn[0]} y={kn[1]} ang={-74} k={0.6} />
      <Lead p={[X(-12.6), yG - 1.5]} t={[64, 150]} text="feathered almost to nothing" a="start" />
      <LeadA p={[X(0), Y(0.6)]} t={[X(0) - 40, 48]} text="lining 0.5–0.8, flesh up" a="middle" />
      <Dim a={[X(10.5), yG + 14]} b={[X(13), yG + 14]} text="" />
      <T x={X(11.75)} y={yG + 30} a="middle" s={10} c={C.faint}>the edge band</T>
      <T x={X(13) + 8} y={yG - 2} s={10}>≈ 0</T>
      {/* where it goes */}
      <Sep x1={14} y1={170} x2={466} y2={170} />
      <Tag x={20} y={190}>why · as fitted, worn side down</Tag>
      <TurnSec cx={300 - 10 * 16} yG={210} s={16} worn lining="full" clip={[180, 316]} brkL />
      <Lead p={[300 - 22, 210 + 3.25 * 16]} t={[340, 236]} text="feathered end" sub="no ridge over the flange" a="start" />
      <Lead p={[236, 210 + 2.45 * 16]} t={[90, 262]} text="flange (turned margin)" a="middle" s={10.5} />
      <Legend x={30} y={290} items={[['top', 'top'], ['filler', 'core'], ['lining', 'lining'], ['skive', 'skived away']]} />
    </Fig>
  )
}

/* 8 · Dampen the fold line only (veg-tan, optional) */
function RDampen() {
  const s = 3.6
  const Tt = { x: 60 - 30 * s, y: 96, s }
  const o = LONG({ x0: 30, x1: 104, tip: 'square' })
  const fin = outline(o)
  const raw = offset(fin, -5)
  const up = fin.filter((q) => q[1] < 0 && q[0] < 103.9)
  const lo = fin.filter((q) => q[1] > 0 && q[0] <= 74)
  const br = px(Tt, 74, widthAt(74, o) / 2)
  const id = uid()
  return (
    <Fig h={300} view="Plan + section · damp fold line" scale="plan ×3.6 · section ×8">
      <LocalDefs />
      <clipPath id={`dm${id}`}>
        <rect x={60} y={0} width={252} height={170} />
      </clipPath>
      <g clipPath={`url(#dm${id})`}>
        <path d={pathOf(raw, Tt)} fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="1" />
        <path d={pathOf(raw, Tt)} fill="url(#sk-fibre)" />
        <path d={pathOf(fin, Tt, false)} fill="none" stroke={C.brassHi} strokeWidth="1" strokeDasharray="5 3" />
        <Wet pts={up.map((q) => px(Tt, q[0], q[1]))} />
        <Wet pts={lo.map((q) => px(Tt, q[0], q[1]))} />
      </g>
      <Break x={60} y1={px(Tt, 30, -14.8)[1]} y2={px(Tt, 30, 14.8)[1]} />
      <Break x={312} y1={px(Tt, 100, -14)[1]} y2={px(Tt, 100, 14)[1]} />
      <Brush x={br[0]} y={br[1]} ang={32} k={0.62} />
      <Lead p={px(Tt, 50, -9.7)} t={[120, 32]} text="damp: the fold line only" a="middle" />
      <Lead p={px(Tt, 92, -12.4)} t={[370, 44]} text="margin stays dry" sub="it will be cemented" a="start" />
      <Lead p={px(Tt, 90, 2)} t={[370, 100]} text="core area dry" sub="cemented next" a="start" />
      <Lead p={[br[0] + 18, br[1] - 30]} t={[370, 152]} text="fine brush" a="start" s={10.5} />
      {/* section */}
      <Sep x1={14} y1={174} x2={466} y2={174} />
      <Tag x={20} y={192}>section · flesh up</Tag>
      <OpenSec cx={210} yG={252} s={8} k={16} wet />
      <Lead p={[210 + 80, 244]} t={[350, 226]} text="moisture in the fold only" a="start" s={10.5} />
      <T x={210} y={226} a="middle" s={10} c={C.faint}>dry</T>
      <T x={102} y={226} a="middle" s={10} c={C.faint}>dry</T>
      <T x={130} y={274} a="middle" s={10}>fold</T>
      <T x={290} y={274} a="middle" s={10}>fold</T>
      <T x={240} y={290} a="middle" s={10.5} c={C.faint}>optional · veg-tan only · never on an area that will be glued</T>
    </Fig>
  )
}

/* 9 · Mount the core: centred, margins equal */
function RCore() {
  const Tp = { x: 64, y: 74, s: 1.9 }
  const fin = outline(LONG({ x0: -15 }))
  const cx = 240
  const yG = 262
  const s = 11
  const k = 22
  const X = (x) => cx + x * s
  const Y = (z) => yG - z * k
  const w60 = widthAt(60, LONG()) / 2
  const xm = px(Tp, 60, 0)[0]
  return (
    <Fig h={342} view="Plan + section · core mounted" scale="plan ×1.9 · thickness ×2">
      <LocalDefs />
      <path d={pathOf(topBlank(), Tp)} fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="1" />
      <path d={pathOf(fin, Tp, false)} fill="none" stroke={C.brassHi} strokeWidth="1" strokeDasharray="4 3" />
      <path d={pathOf(corePts(), Tp)} fill="url(#sk-fill)" stroke="#d9b07a" strokeWidth="0.9" />
      <Dim a={px(Tp, 60, -w60 - 5)} b={px(Tp, 60, -w60 + 1)} text="" />
      <Dim a={px(Tp, 60, w60 - 1)} b={px(Tp, 60, w60 + 5)} text="" />
      <T x={xm} y={px(Tp, 60, -w60 - 5)[1] - 5} a="middle" s={12} mono c={C.brassHi}>=</T>
      <T x={xm} y={px(Tp, 60, w60 + 5)[1] + 14} a="middle" s={12} mono c={C.brassHi}>=</T>
      <T x={330} y={58} s={11.5} c={C.text}>centred on the top’s flesh</T>
      <T x={330} y={72} s={10.5}>equal margins both sides,</T>
      <T x={330} y={85} s={10.5}>checked along the length</T>
      <T x={330} y={110} s={10.5} c={C.faint}>core stops short of the</T>
      <T x={330} y={123} s={10.5} c={C.faint}>bar fold (step 13)</T>
      {/* section */}
      <Sep x1={14} y1={150} x2={466} y2={150} />
      <Tag x={20} y={168}>section across · flesh up</Tag>
      <OpenSec cx={cx} yG={yG} s={s} k={k} skive="taper" core reinf="opt" />
      <line x1={X(-9)} y1={Y(1) + 1} x2={X(9)} y2={Y(1) + 1} stroke={C.glue} strokeWidth="2.2" strokeDasharray="1.2 2.6" strokeLinecap="round" />
      <Dim a={[X(-15), Y(2.2) - 4]} b={[X(-9), Y(2.2) - 4]} off={-10} text="=" />
      <Dim a={[X(9), Y(2.2) - 4]} b={[X(15), Y(2.2) - 4]} off={-10} text="=" />
      <LeadA p={[X(-3), Y(1.6)]} t={[X(-3), 186]} text="core" a="middle" />
      <Lead p={[X(13), Y(0.2)]} t={[470, 182]} text="skived margin" a="end" s={10.5} />
      <Lead p={[X(-6), Y(1) + 1]} t={[70, 296]} text="cemented" a="middle" s={10.5} />
      <Lead p={[X(3), Y(1) - 1.6]} t={[220, 296]} text="optional reinforcement" sub="0.2–0.45 mm" a="middle" s={10.5} />
      <Lead p={[X(9), Y(1.4)]} t={[390, 296]} text="core edge" sub="≈ 1 mm inside the fold" a="middle" s={10.5} />
      <Legend x={30} y={332} items={[['top', 'top'], ['filler', 'core'], ['glue', 'cement'], ['velodon', 'reinforcement']]} />
    </Fig>
  )
}

/* 10 · Cement the margins and the core's edge band */
function RCement() {
  const s = 20
  const X = (x) => 220 + (x - 10) * s
  const yG = 186
  const br = [X(12.4), yG - (0.45 - 0.39 * (2.4 / 5)) * s - 1]
  return (
    <Fig h={300} view="Section · cement on margin and core edge" scale="true scale ×20">
      <LocalDefs />
      <Slab x={90} y={yG} w={250} h={10} kind="board" />
      <OpenSec cx={X(0)} yG={yG} s={s} skive="taper" core glue sides={[1]} clip={[X(3.6), X(15) + 1]} brkL />
      <line x1={X(10)} y1={yG - 34} x2={X(10)} y2={yG + 14} stroke={C.text} strokeWidth="0.9" strokeDasharray="4 3" />
      <T x={X(10) - 4} y={yG + 26} a="end" s={10.5}>fold</T>
      <Brush x={br[0]} y={br[1]} ang={30} k={0.74} />
      <Lead p={[X(13.6), yG - 4]} t={[300, 232]} text="margin flesh" sub="full width of the turn" a="start" />
      <LeadA p={[X(7.5), yG - 2.2 * s - 1]} t={[140, 74]} text="core edge band" sub="where the flange lands" a="middle" />
      <Lead p={[X(5), yG - 1.6 * s]} t={[100, 232]} text="core, already mounted" a="middle" s={10.5} />
      <Dim a={[X(5.8), yG - 2.2 * s - 10]} b={[X(9), yG - 2.2 * s - 10]} text="" />
      <Note x={356} y={54} head="Contact cement" hc={C.text} lines={['neoprene or', 'water-based;', 'both faces, then', 'wait for tack']} s={11} lh={14.5} />
      <Verdict x={366} y={148} ok={false} r={8} />
      <T x={380} y={146} s={11} c={C.ruby}>PVA</T>
      <T x={380} y={160} s={10.5}>barely holds</T>
      <T x={380} y={173} s={10.5}>until dry</T>
      <Legend x={30} y={286} items={[['glue', 'contact cement'], ['filler', 'core'], ['top', 'top, flesh up']]} />
    </Fig>
  )
}

/* 11 · Turn the straights: lift, roll, hammer */
function RStraights() {
  const s = 13
  const yG = 200
  const panels = [
    { th: 90, n: 1, a: 'folder lifts it', b: 'against a metal ruler' },
    { th: 140, n: 2, a: 'roll it over', b: 'the core edge' },
    { th: 180, n: 3, a: 'set it: polished', b: 'hammer on marble' },
  ]
  return (
    <Fig h={306} view="Sequence · turning a straight edge, flesh up" scale="true scale ×13">
      <LocalDefs />
      {panels.map((pn, i) => {
        const p0 = 14 + i * 154
        const X = (x) => p0 + (x - 3.5) * s
        const Y = (z) => yG - z * s
        const cxp = X(0)
        const mp = marginPts({ W2: 10, t: 1, tc: 1.2, tm: 0.5, M: 5, th: pn.th, taper: true })
        const midOut = (() => {
          const oL = mp.outer[mp.outer.length - 2]
          const oE = mp.outer[mp.outer.length - 1]
          return [X((oL[0] + oE[0]) / 2), Y((oL[1] + oE[1]) / 2)]
        })()
        return (
          <g key={i}>
            {i > 0 && <Sep x1={p0 - 6} y1={30} x2={p0 - 6} y2={270} />}
            <Slab x={p0} y={yG} w={146} h={10} kind="granite" />
            <TurnSec cx={cxp} yG={yG} s={s} thR={pn.th} clip={[p0, p0 + 148]} brkL />
            {pn.th === 90 && (
              <g>
                <rect x={X(3.6)} y={Y(3.25)} width={X(9.5) - X(3.6)} height={Y(2.2) - Y(3.25)} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
                <BoneFolder x={X(9.75) + 1} y={Y(4.4)} ang={90} k={0.5} />
                <T x={X(6.5)} y={Y(3.25) - 6} a="middle" s={10} c={C.text}>metal ruler</T>
                <LeadA p={[X(4.4), Y(1.6)]} t={[X(4.4) + 10, 108]} text="core" a="middle" s={10.5} />
                <Lead p={[X(9.8), Y(5.4)]} t={[X(9.8) + 4, 96]} text="margin" sub="skived" a="start" s={10.5} />
                <Lead p={[X(5.4), Y(0)]} t={[X(5.4), 226]} text="grain down" a="middle" s={10} />
              </g>
            )}
            {pn.th === 140 && (
              <g>
                <BoneFolder x={midOut[0] + 1} y={midOut[1] - 1} ang={40} k={0.5} />
                <Arrow d={`M${X(10.6)} ${Y(5.2)} q-6 -16 -26 -14`} w={1.5} />
              </g>
            )}
            {pn.th === 180 && (
              <g>
                <Hammer x={X(8.4)} y={Y(2.75) - 1} k={0.72} />
                <Lead p={[X(10), Y(1.35)]} t={[X(10) + 8, 168]} text="rolled" sub="grain out" a="start" s={10.5} />
                <Lead p={[X(6.6), Y(2.6)]} t={[X(4.2), 108]} text="flange on the core" a="start" s={10.5} />
              </g>
            )}
            <Num x={p0 + 8} y={250} n={pn.n} r={7} />
            <T x={p0 + 20} y={254} s={11} c={C.text}>{pn.a}</T>
            <T x={p0 + 20} y={268} s={10.5}>{pn.b}</T>
          </g>
        )
      })}
      <T x={240} y={296} a="middle" s={10.5} c={C.faint}>work short sections along each straight — lift, roll, hammer, move on</T>
    </Fig>
  )
}

/* 12 · Turn the tip: pleat, or overlap the crans */
function RTip() {
  const s = 5.4
  const T1 = { x: 206 - 120 * s, y: 128, s }
  const T2 = { x: 446 - 120 * s, y: 128, s }
  const o = LONG({ x0: 92 })
  const fin = outline(o)
  const inner = offset(fin, 4.2)
  const band = (Tt) => `${pathOf(fin, Tt)} ${pathOf([...inner].reverse(), Tt)}`
  const run = fin.filter((q) => q[0] >= 103)
  const pl = resample(run, 4.4).slice(1, -1)
  const idx = fin.map((q, i) => i).filter((i) => fin[i][0] >= 103)
  const tabs = []
  const per = Math.ceil(idx.length / 8)
  for (let i = 0; i < idx.length - 1; i += per) {
    const a = idx[i]
    const b = idx[Math.min(i + per + 2, idx.length - 1)]
    const outerT = fin.slice(a, b + 1)
    const innerT = inner.slice(a, b + 1).reverse()
    tabs.push([...outerT, ...innerT])
  }
  const id = uid()
  return (
    <Fig h={320} view="Plan · turning the tip, flesh side" scale="plan ×5.4">
      <Tag x={20} y={40}>A · pleated</Tag>
      <Tag x={262} y={40}>B · overlapped crans</Tag>
      <Sep x1={246} y1={30} x2={246} y2={232} />
      {/* A */}
      <rect x={98} y={58} width={136} height={142} rx="8" fill="#3a3f44" stroke="#22272b" strokeWidth="1" />
      <T x={228} y={194} a="end" s={10} c="#c9d3da">magnet plate</T>
      <clipPath id={`tA${id}`}>
        <rect x={px(T1, 92, 0)[0]} y={0} width={300} height={320} />
      </clipPath>
      <g clipPath={`url(#tA${id})`}>
        <path d={pathOf(fin, T1)} fill="url(#sk-fill)" />
        <path d={band(T1)} fill="url(#sk-top)" fillRule="evenodd" stroke="#5c3c1d" strokeWidth="0.9" />
      </g>
      {pl.map(({ p, tan }, i) => {
        const n = [tan[1], -tan[0]]
        const a = px(T1, p[0] - n[0] * 0.3, p[1] - n[1] * 0.3)
        const b = px(T1, p[0] - n[0] * 4.0, p[1] - n[1] * 4.0)
        const major = i === 1 || i === pl.length - 2
        const ne = px(T1, p[0] + n[0] * 3.6, p[1] + n[1] * 3.6)
        return (
          <g key={i}>
            <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#4a2f16" strokeWidth={major ? 2.2 : 1.4} />
            <line x1={a[0] + 1} y1={a[1] + 1} x2={b[0] + 1} y2={b[1] + 1} stroke="#e0b277" strokeWidth="0.7" opacity="0.8" />
            <line x1={a[0]} y1={a[1]} x2={ne[0]} y2={ne[1]} stroke="#d6e1e8" strokeWidth="1.5" />
            <circle cx={ne[0]} cy={ne[1]} r="1.8" fill="#9fb4c2" />
          </g>
        )
      })}
      <Break x={px(T1, 92, 0)[0]} y1={px(T1, 92, -9.2)[1]} y2={px(T1, 92, 9.2)[1]} />
      {(() => {
        const at = (q, d) => {
          const n = [q.tan[1], -q.tan[0]]
          return px(T1, q.p[0] + n[0] * d, q.p[1] + n[1] * d)
        }
        const a = at(pl[1], 6.6)
        const b = at(pl[2], 6.6)
        return (
          <g>
            <Num x={a[0]} y={a[1]} n={1} r={7} />
            <Num x={b[0]} y={b[1]} n={2} r={7} />
          </g>
        )
      })()}
      <Lead p={px(T1, 99, 4)} t={[40, 222]} text="core" a="middle" s={10.5} />
      <Lead p={px(T1, 97, 7.6)} t={[150, 212]} text="flange (turned margin)" a="middle" s={10.5} />
      {/* B */}
      <clipPath id={`tB${id}`}>
        <rect x={px(T2, 92, 0)[0]} y={0} width={300} height={320} />
      </clipPath>
      <g clipPath={`url(#tB${id})`}>
        <path d={pathOf(fin, T2)} fill="url(#sk-fill)" />
        <path d={`${pathOf(fin.filter((q) => q[0] < 104), T2, false)}`} fill="none" />
        <path d={band(T2)} fill="url(#sk-top)" fillRule="evenodd" stroke="#5c3c1d" strokeWidth="0.9" />
        {tabs.map((tb, i) => (
          <g key={i}>
            <path d={pathOf(tb, T2)} fill="rgba(20,12,6,0.55)" transform="translate(1.6 1.6)" />
            <path d={pathOf(tb, T2)} fill="url(#sk-top)" stroke="#4a2f16" strokeWidth="1" />
          </g>
        ))}
      </g>
      <Break x={px(T2, 92, 0)[0]} y1={px(T2, 92, -9.2)[1]} y2={px(T2, 92, 9.2)[1]} />
      <Hammer x={px(T2, 114, -5)[0]} y={px(T2, 114, -5)[1] - 6} k={0.55} op={0.9} />
      <Arrow d={`M${px(T2, 118, 9)[0] + 6} ${px(T2, 118, 9)[1] + 6} q8 -8 6 -20`} w={1.4} />
      <Lead p={px(T2, 108, 8.2)} t={[372, 222]} text="each cran laps the next" a="middle" s={10.5} />
      <Note x={20} y={256} lines={['needles on a magnet plate:', '2 pleats (1), then 4 (2);', 'refine with awl and tweezers']} s={10.5} lh={14} />
      <Note x={262} y={256} lines={['overlap the crans,', 'pulling lightly;', 'hammer at once']} s={10.5} lh={14} />
      <T x={240} y={310} a="middle" s={11} c={C.ruby}>alligator can’t pleat — its tip margin must be cut</T>
    </Fig>
  )
}

/* 13 · Form the bar fold: thinned end round a former, channel glue-free */
function RBarfold() {
  const s = 9
  const k = 14
  const cx = 132
  const ramp = [4.2, 7]
  const tip = 6.5
  const X = (u) => cx + u * s
  // flat, as worn (grain up)
  const yT = 70
  const th = (u) => (u <= ramp[0] ? 0.4 : u >= ramp[1] ? 1 : 0.4 + ((u - ramp[0]) / (ramp[1] - ramp[0])) * 0.6)
  const flat = [[X(-tip), yT], [X(34), yT], [X(34), yT + k], [X(ramp[1]), yT + k], [X(ramp[0]), yT + th(ramp[0]) * k], [X(-tip), yT + 0.4 * k]]
  const ghost = [[X(-tip), yT + 0.4 * k], [X(ramp[0]), yT + 0.4 * k], [X(ramp[1]), yT + k], [X(-tip), yT + k]]
  // folded
  const g = { cx, yTop: 176, s, k, r: 14, T: 1, tt: 0.4, ramp, tip, end: 34 }
  const G = ufGeom(g)
  const yCore = G.bu(10)
  return (
    <Fig h={314} view="Section · lug end, along the strap" scale="thickness ×1.6">
      <Tag x={20} y={40}>1 · thin the end</Tag>
      <path d={PZ(ghost)} fill="rgba(208,168,79,0.14)" stroke={C.brass} strokeWidth="0.8" strokeDasharray="3 2" />
      <path d={PZ(flat)} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.9" />
      <rect x={X(tip)} y={yT + k} width={X(34) - X(tip)} height={1.2 * k} fill="url(#sk-fill)" stroke="#3a2716" strokeWidth="0.8" />
      <Break x={X(34)} y1={yT} y2={yT + 2.2 * k} />
      <Dim a={[X(-tip), yT]} b={[X(ramp[1]), yT]} off={-12} text="10–15" />
      <line x1={X(0)} y1={yT + 2} x2={X(0)} y2={yT + 2.2 * k + 8} stroke={C.text} strokeWidth="1" strokeDasharray="4 3" />
      <T x={X(0)} y={yT + 2.2 * k + 20} a="middle" s={10.5}>fold</T>
      <Lead p={[X(20), yT + 1.8 * k]} t={[X(20), yT + 2.2 * k + 22]} text="core" a="middle" s={10.5} />
      <Lead p={[X(5.6), yT + 0.72 * k]} t={[330, 46]} text="thinned from the flesh" sub="top ≈ 1 mm" a="start" s={10.5} />
      <Sep x1={14} y1={136} x2={466} y2={136} />
      <Tag x={20} y={156}>2 · fold round a former</Tag>
      <UFold {...g} bar="former" glue={{ all: true }} />
      <rect x={X(tip) + 1} y={yCore} width={X(34) - X(tip) - 1} height={1.2 * k} fill="url(#sk-fill)" stroke="#3a2716" strokeWidth="0.8" />
      <NoGlue x1={cx + 8} x2={G.X(G.uc) - 2} y={G.y1 + 3} h={5} />
      <Lead p={[cx, G.cy + 6]} t={[90, 262]} text="former" sub="slightly larger than the bar" a="middle" />
      <Lead p={[cx + 14, G.y1 + 3]} t={[186, 280]} text="channel: glue-free" a="start" c={C.ruby} />
      <Lead p={[X(5.2), G.bu(5.2)]} t={[300, 252]} text="flap cemented to the thinned end" a="start" s={10.5} />
      <LeadA p={[X(24), yCore + 10]} t={[X(26), 162]} text="core butts the flap" a="middle" s={10.5} />
      <T x={240} y={306} a="middle" s={10.5} c={C.faint}>doubled thin end ≈ one full layer · no core inside the fold</T>
    </Fig>
  )
}

/* 14 · Fit the lining: full (trimmed inside) vs semi (flush, painted) */
function RLining() {
  const s = 20
  const cx = 34
  const X = (x) => cx + x * s
  const yA = 88
  const yB = 230
  const H = 2.7
  return (
    <Fig h={352} view="Section · one edge, as worn" scale="true scale ×20">
      <Tag x={20} y={40}>A · full rembordé</Tag>
      <TurnSec cx={cx} yG={yA} s={s} worn lining="full" clip={[42, 252]} brkL />
      <Arrow a={[336, yA + 30]} b={[262, yA + 30]} c="emerald" w={1.8} />
      <T x={342} y={yA + 26} s={11} c={C.emerald}>from the side:</T>
      <T x={342} y={yA + 40} s={11} c={C.emerald}>grain only</T>
      <Lead p={[X(8.6), yA + (H + 0.1) * s]} t={[300, yA + 80]} text="lining trimmed just" sub="inside the fold: invisible" a="start" />
      <LeadA p={[X(2), yA + 1.6 * s]} t={[X(2), 62]} text="core" a="middle" s={10.5} />
      <LeadA p={[X(5), yA]} t={[X(5) + 10, 62]} text="top · grain" a="middle" s={10.5} />
      <Lead p={[X(7), yA + 2.32 * s]} t={[120, 188]} text="flange (turned margin)" a="middle" s={10.5} />
      <Lead p={[X(9.35), yA + 1.6 * s]} t={[290, 62]} text="core stops ≈ 1 mm short" a="start" s={10} />
      <Sep x1={14} y1={200} x2={466} y2={200} />
      <Tag x={20} y={218}>B · semi rembordé</Tag>
      <TurnSec cx={cx} yG={yB} s={s} worn lining="semi" clip={[42, 252]} brkL />
      <Arrow a={[336, yB + 30]} b={[262, yB + 30]} c="ruby" w={1.8} />
      <T x={342} y={yB + 26} s={11} c={C.ruby}>from the side:</T>
      <T x={342} y={yB + 40} s={11} c={C.ruby}>a painted seam</T>
      <Lead p={[X(10) + 2, yB + (H + 0.3) * s]} t={[300, yB + 82]} text="lining flush," sub="junction painted — its weak point" a="start" />
      <Lead p={[X(4), yB + (H + 0.5) * s]} t={[120, yB + 90]} text="lining runs to the edge" a="middle" s={10.5} />
      <T x={240} y={346} a="middle" s={10.5} c={C.faint}>cement the lining over the flanges while bending the strap into its curve</T>
    </Fig>
  )
}

/* 15 · Hammer everything again */
function RHammer() {
  const Tt = { x: 50, y: 94, s: 2.4 }
  const o = LONG()
  const pts = outline(o)
  const ticks = resample(runBetween(pts, 3)[0] || pts, 7)
  const cx = 200
  const yG = 266
  const s = 12
  const X = (x) => cx + x * s
  return (
    <Fig h={318} view="Plan + section · setting every edge" scale="plan ×2.4 · section ×12">
      <LocalDefs />
      <Slab x={22} y={52} w={408} h={86} kind="granite" />
      <StrapPlan T={Tt} o={o} face="grain" />
      <path d={pathOf(offset(pts, 1.4).filter((q) => q[0] > 1.3), Tt)} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="0.8" />
      {ticks.map(({ p, tan }, i) => {
        const n = [tan[1], -tan[0]]
        const a = px(Tt, p[0] - n[0] * 1.1, p[1] - n[1] * 1.1)
        const b = px(Tt, p[0] + n[0] * 1.5, p[1] + n[1] * 1.5)
        return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.brass} strokeWidth="1.7" strokeLinecap="round" />
      })}
      <T x={438} y={72} s={10.5} c={C.text}>strike</T>
      <T x={438} y={85} s={10.5} c={C.text}>marks</T>
      <T x={438} y={102} s={10} c={C.faint}>all round,</T>
      <T x={438} y={114} s={10} c={C.faint}>tip too</T>
      <Lead p={px(Tt, 60, 6)} t={[200, 156]} text="lining side up, on marble" a="middle" s={10.5} />
      <LeadA p={px(Tt, 40, -9.6)} t={[100, 48]} text="grain border: the turned edge" a="start" s={10.5} />
      {/* section */}
      <Sep x1={14} y1={170} x2={466} y2={170} />
      <Tag x={20} y={188}>section · lining up</Tag>
      <Slab x={X(-11.5)} y={yG} w={23 * s} h={10} kind="granite" />
      <TurnSec cx={cx} yG={yG} s={s} lining="full" />
      <Hammer x={X(8.3)} y={yG - 3.3 * s - 2} k={0.72} />
      <Hammer x={X(-8.3)} y={yG - 3.3 * s - 2} k={0.72} op={0.4} />
      <Arrow a={[X(8.3) - 18, yG - 3.3 * s - 30]} b={[X(8.3) - 18, yG - 3.3 * s - 6]} w={1.5} />
      <Note x={374} y={222} head="Hammer again" hc={C.text} lines={['every turned edge,', 'flanges and lining', 'set flat and crisp']} s={10.5} lh={14} />
      <T x={X(0)} y={yG + 26} a="middle" s={10} c={C.faint}>polished face · marble beneath</T>
    </Fig>
  )
}

/* 16 · Stitch ~3 mm in through top, flange, core and lining */
function RStitch() {
  const cx = 200
  const yG = 92
  const s = 14
  const X = (x) => cx + x * s
  const Y = (z) => yG + z * s
  return (
    <Fig h={300} view="Section · across the strap, as worn" scale="true scale ×14">
      <TurnSec cx={cx} yG={yG} s={s} worn lining="full" stitch={3} />
      <Dim a={[X(7), yG]} b={[X(10), yG]} off={-16} text="≈ 3" />
      <LeadA p={[X(-2), Y(0.4)]} t={[X(-2), 50]} text="top · grain" a="middle" />
      <LeadA p={[X(-6), Y(1.6)]} t={[60, 56]} text="core" a="middle" />
      <Lead p={[X(8.2), Y(2.45)]} t={[392, 186]} text="flange" sub="the turned margin" a="middle" />
      <Lead p={[X(2), Y(2.5)]} t={[250, 186]} text="lining" a="middle" />
      <Lead p={[X(-7), Y(2.95)]} t={[110, 186]} text="saddle stitch" sub="through all four layers" a="middle" />
      <Sep x1={14} y1={210} x2={466} y2={210} />
      <Num x={30} y={236} n={1} r={7} />
      <Iron n={4} pitch={8} kind="diamond" x={60} y={278} k={0.62} />
      <T x={90} y={256} s={11} c={C.text}>prick</T>
      <T x={90} y={270} s={10}>through all layers</T>
      <Num x={180} y={236} n={2} r={7} />
      <Needle x1={204} y1={286} x2={226} y2={244} thread={`M226 244 q14 -8 20 6`} />
      <Needle x1={250} y1={286} x2={238} y2={244} />
      <T x={256} y={256} s={11} c={C.text}>saddle-stitch</T>
      <Num x={330} y={236} n={3} r={7} />
      <Hammer x={356} y={280} k={0.55} />
      <T x={410} y={256} s={11} c={C.text}>hammer</T>
      <T x={410} y={270} s={10}>flat</T>
    </Fig>
  )
}

/* 17 · Finish: no edge paint on the turned sides, lug fold bare */
function RFinish() {
  const s = 18
  const cx = 150 - 10 * s
  const Tp = { x: 268, y: 116, s: 1.66 }
  const o = LONG()
  return (
    <Fig h={300} view="Section + plan · finished" scale="section ×18 · plan ×1.7">
      <TurnSec cx={cx} yG={92} s={s} worn lining="full" clip={[36, 162]} brkL />
      <Applicator x={166} y={150} ang={48} k={0.5} />
      <Verdict x={186} y={130} ok={false} r={9} />
      <T x={196} y={82} a="middle" s={11} c={C.ruby}>no edge paint</T>
      <T x={196} y={96} a="middle" s={10.5}>on turned sides</T>
      <Lead p={[150, 100]} t={[100, 182]} text="grain wraps the edge" sub="nothing to paint or burnish" a="middle" />
      <Sep x1={246} y1={30} x2={246} y2={210} />
      <StrapPlan T={Tp} o={o} holes={{}} zones={[{ from: 0, to: 6, k: 'hl' }]} />
      <path d={pathOf(offset(outline(o), 1.2).filter((q) => q[0] > 1), Tp, true)} fill="none" stroke={C.topEdge} strokeWidth="0.8" opacity="0.7" />
      <SpringBar x={268} y1={92} y2={140} r={2.4} />
      <Dauber x={px(Tp, 70, 0)[0]} y={116} c="#b38a52" ang={10} k={0.8} />
      <T x={px(Tp, 70, 0)[0] + 16} y={50} s={11} c={C.text}>condition</T>
      <T x={px(Tp, 70, 0)[0] + 16} y={63} s={10}>lightly</T>
      <Lead p={px(Tp, 3, 8)} t={[290, 176]} text="lug fold: left bare" sub="it flexes; finish rubs off" a="start" />
      <Sep x1={14} y1={216} x2={466} y2={216} />
      <Legend x={30} y={240} items={[['top', 'top (grain all round)'], ['filler', 'core'], ['lining', 'lining, hidden inside']]} />
      <T x={240} y={276} a="middle" s={11} c={C.text}>Grain at every edge — nothing to paint.</T>
    </Fig>
  )
}

export const FIGS = {
  'u-template': UTemplate,
  'u-cut': UCut,
  'u-bevel': UBevel,
  'u-holes': UHoles,
  'u-dye': UDye,
  'u-edges': UEdges,
  'u-flesh': UFlesh,
  'u-skive': USkive,
  'u-tip': UTip,
  'u-overlap': UOverlap,
  'u-punch': UPunch,
  'u-stitch': UStitch,
  'u-keepers': UKeepers,
  'u-seal': USeal,
  'r-pattern': RPattern,
  'r-cut': RCut,
  'r-mark': RMark,
  'r-notch': RNotch,
  'r-groove': RGroove,
  'r-skive': RSkive,
  'r-lining-skive': RLiningSkive,
  'r-dampen': RDampen,
  'r-core': RCore,
  'r-cement': RCement,
  'r-straights': RStraights,
  'r-tip': RTip,
  'r-barfold': RBarfold,
  'r-lining': RLining,
  'r-hammer': RHammer,
  'r-stitch': RStitch,
  'r-finish': RFinish,
}
