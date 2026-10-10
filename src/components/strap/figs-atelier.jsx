// Strap diagrams — atelier grade: fine stitching & finishing (sm-atelier).
// The finer spec premium makers sew to: 2.25–2.5 mm pitch, 0.35 mm linen, a
// 2 mm margin, micro-stitch, cross rows and staged QC. See AUTHORING.md.
//
// Thread-path sections follow figs-stitch: needle A's half ivory, needle B's
// half brass. Plan views draw the thread in its real colour.
import { useId } from 'react'
import { C, FONT, MONO, Fig, T, Dim, Arrow, Num, Verdict, Tag, Sep } from './kit.jsx'
import { StrapPlan, Ply, XSec, BarEnd, GlueLine, Buckle, SpringBar } from './parts.jsx'
import { StrapSection, secGeom } from './sections.jsx'
import { LONG, SHORT, outline, offset, runBetween, resample, px } from './geom.js'
import { Iron, Needle, Creaser, Knife, Slab, Dividers } from './tools.jsx'

const TA = C.thread // needle A's half (and white thread in plan)
const TB = '#d9a74a' // needle B's half
const CASE = '#1a120b'
const TAN_T = '#b9844a' // tan bobbin / tonal thread
const TEAL = '#5fb3b0'

// Atelier pieces: 20 → 16, 115 / 75 (the makers' standard pair).
const ALONG = (x = {}) => LONG({ x1: 115, w1: 16, taper: [8, 95], tipLen: 12, ...x })
const ASHORT = (x = {}) => SHORT({ x1: 75, w1: 16, taper: [8, 60], ...x })

/* ------------------------------------------------------------------ */
/* Local helpers (adapted from figs-stitch / figs-classic)              */
/* ------------------------------------------------------------------ */

function AtDefs() {
  return (
    <defs>
      {/* a layer in section with the grain at the BOTTOM (flesh up) */}
      <linearGradient id="at-topUp" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#7d5228" />
        <stop offset="0.18" stopColor="#b2804a" />
        <stop offset="1" stopColor="#d3ae7b" />
      </linearGradient>
      <linearGradient id="at-navy" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#34465f" />
        <stop offset="1" stopColor="#202c3d" />
      </linearGradient>
      <linearGradient id="at-navyS" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1d2838" />
        <stop offset="0.2" stopColor="#3a4c66" />
        <stop offset="1" stopColor="#4c5f7a" />
      </linearGradient>
      <pattern id="at-peccary" width="12" height="10" patternUnits="userSpaceOnUse">
        <rect width="12" height="10" fill="#a8763f" />
        {[[2, 2], [8, 7]].map(([x, y], i) => (
          <g key={i} fill="#5c3c1d">
            <circle cx={x} cy={y} r="0.8" />
            <circle cx={x + 1.8} cy={y + 0.3} r="0.8" />
            <circle cx={x + 0.9} cy={y + 1.6} r="0.8" />
          </g>
        ))}
      </pattern>
      <pattern id="at-goat" width="7" height="6" patternUnits="userSpaceOnUse">
        <rect width="7" height="6" fill="#34465f" />
        <path d="M0 3 q1.7 -2.4 3.5 0 t3.5 0 M1.7 6 q1.8 -2.2 3.5 0" fill="none" stroke="#1d2838" strokeWidth="0.7" />
      </pattern>
    </defs>
  )
}

// Leader with explicit geometry: pts = [feature, …, end of line].
function Ld({ pts, text, sub, a = 'start', x, y, c = C.text, s = 11, subc = C.faint, dot = true }) {
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
        <text x={tx} y={ty + s + 1.5} textAnchor={a} fontSize={Math.max(10, s - 1)} fill={subc} fontFamily={FONT}>
          {sub}
        </text>
      )}
    </g>
  )
}

// Magnifier: re-draws `children` (figure coordinates) k× about src.
function Inset({ src, k, at, r, children }) {
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
      <clipPath id={`ains${id}`}>
        <circle cx={at[0]} cy={at[1]} r={r} />
      </clipPath>
      <circle cx={at[0]} cy={at[1]} r={r} fill={C.ground} />
      <g clipPath={`url(#ains${id})`}>
        <g transform={`translate(${at[0]} ${at[1]}) scale(${k}) translate(${-src[0]} ${-src[1]})`}>{children}</g>
      </g>
      <circle cx={at[0]} cy={at[1]} r={r} fill="none" stroke={C.brass} strokeWidth="1.3" />
      <text x={at[0] + r * 0.74} y={at[1] - r * 0.74} fontSize="10" fill={C.brass} fontFamily={MONO}>
        ×{k}
      </text>
    </g>
  )
}

// A thread: dark casing under a coloured core so it reads on leather.
function Thr({ d, c = TA, w = 2.4, cap = 'round', op, cas = 1.8 }) {
  return (
    <g opacity={op}>
      {cas > 0 && <path d={d} fill="none" stroke={CASE} strokeWidth={w + cas} strokeLinecap={cap} strokeLinejoin="round" />}
      <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap={cap} strokeLinejoin="round" />
    </g>
  )
}
const poly = (pts) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
const ptsStr = (pts) => pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')

// Plan-view saddle stitches through holes `pts` (px): slanted spans.
function Stitches({ pts, c = TA, w = 1.6, sl = 0.3, gap = 0.14, cas = 0.9, op, straight }) {
  return (
    <g opacity={op}>
      {pts.slice(0, -1).map((a, i) => {
        const b = pts[i + 1]
        const dx = b[0] - a[0]
        const dy = b[1] - a[1]
        const L = Math.hypot(dx, dy) || 1
        const nx = -dy / L
        const ny = dx / L
        const h = straight ? 0 : (sl * L) / 2
        const g = straight ? 0.08 : gap
        const d = `M${(a[0] + dx * g + nx * h).toFixed(1)} ${(a[1] + dy * g + ny * h).toFixed(1)} L${(b[0] - dx * g - nx * h).toFixed(1)} ${(b[1] - dy * g - ny * h).toFixed(1)}`
        return <Thr key={i} d={d} c={c} w={w} cas={cas} cap={straight ? 'butt' : 'round'} />
      })}
    </g>
  )
}

// Stitch holes along a piece's seam line (offset m mm), pitch p mm, as px runs.
const seamRuns = (TP, o, m, p, from, to) =>
  runBetween(offset(outline(o), m), from, to).map((r) => resample(r, p).map((q) => px(TP, q.p[0], q.p[1])))

const BreakV = ({ x, y1, y2 }) => {
  const h = y2 - y1
  return <path d={`M${x - 3} ${y1 - 4} l6 ${(h + 8) * 0.3} l-6 ${(h + 8) * 0.4} l6 ${(h + 8) * 0.3}`} fill="none" stroke={C.dim} strokeWidth="1" />
}

function ClipBox({ x, y, w, h, children }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  return (
    <g>
      <clipPath id={`acb${id}`}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#acb${id})`}>{children}</g>
    </g>
  )
}

// Plan-view slit left by a French iron, centred at (x, y).
function Slit({ x, y, len = 7, ang = -50, c = C.hole, w = 1.8, op }) {
  const a = (ang * Math.PI) / 180
  const dx = (Math.cos(a) * len) / 2
  const dy = (Math.sin(a) * len) / 2
  return <line x1={x - dx} y1={y - dy} x2={x + dx} y2={y + dy} stroke={c} strokeWidth={w} strokeLinecap="round" opacity={op} />
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

// A formed fold in section (from figs-classic): fold at cx, body thickness t
// running bl px; the ply round the bar skived to tl; tail feathered.
function FoldEnd({ cx, y0, r, t, tl, cv, tail, a, bl, dir = 1, op }) {
  const R = r + tl
  const cy = y0 + R
  const yB = y0 + t
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
      <path d={`${outer} Z ${hole}`} fill="url(#sk-topS)" fillRule="evenodd" />
      <path d={outer} fill="none" stroke="#4a3018" strokeWidth="0.8" strokeLinejoin="round" />
      <path d={hole} fill="none" stroke="#4a3018" strokeWidth="0.8" strokeLinejoin="round" />
      <line x1={cx + cv} y1={yB} x2={tip} y2={yB} stroke="#4a3018" strokeWidth="0.8" />
    </g>
  )
}
const foldGeo = ({ cx, y0, r, t, tl, cv, tail }) => {
  const R = r + tl
  return { cy: y0 + R, R, yB: y0 + t, bottom: y0 + 2 * R, tip: cx + cv + tail, conv: cx + cv }
}

// Saddle-stitch path through a seam section (figs-stitch `route`).
// moves: [{ to, lane, pass }]; lanes stack doubled spans outward.
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

// Regular saddle stitch in section: A starts on the grain side in hole 0.
function seamPaths({ x0, p, y, h, done, r = 2.4, d = 1.8 }) {
  const X = (i) => x0 + i * p
  const yt = y - r
  const yb = y + h + r
  const A = [[X(0), y + h / 2], [X(0), yt]]
  const B = [[X(0), y + h / 2], [X(0), yb]]
  for (let k = 1; k <= done; k++) {
    const aTop = k % 2 === 1
    A.push([X(k) - d, aTop ? yt : yb], [X(k) + d, aTop ? yb : yt])
    B.push([X(k) - d, aTop ? yb : yt], [X(k) + d, aTop ? yt : yb])
  }
  return { A, B, yt, yb, X }
}

// Seam band in section: top + lining with holes.
function SeamBand({ x0, p, n, y, h, tk = 0.6, ext = 0.75, holeW = 5, breakL = true, breakR = true, vel }) {
  const xa = x0 - ext * p
  const xb = x0 + (n - 1) * p + ext * p
  const t = h * tk
  return (
    <g>
      <Ply x1={xa} x2={xb} y={y} t={t} />
      <Ply x1={xa} x2={xb} y={y + t} t={h - t} k="lining" cut="top" />
      {vel && <line x1={xa} y1={y + t} x2={xb} y2={y + t} stroke={C.velodon} strokeWidth={vel} />}
      {Array.from({ length: n }, (_, i) => (
        <rect key={i} x={x0 + i * p - holeW / 2} y={y - 0.6} width={holeW} height={h + 1.2} fill={C.ground} stroke="#5c4128" strokeWidth="0.5" />
      ))}
      {breakL && <BreakV x={xa} y1={y} y2={y + h} />}
      {breakR && <BreakV x={xb} y1={y} y2={y + h} />}
    </g>
  )
}

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

// Keeper loop end-on round a stack (from figs-stitch).
function Loop({ x, y, w, h, kt = 10, op, stroke = C.top }) {
  const o = kt / 2
  const d = `M${x - o + 6} ${y - o} H${x + w + o - 6} Q${x + w + o} ${y - o} ${x + w + o} ${y - o + 6} V${y + h + o - 6} Q${x + w + o} ${y + h + o} ${x + w + o - 6} ${y + h + o} H${x - o + 6} Q${x - o} ${y + h + o} ${x - o} ${y + h + o - 6} V${y - o + 6} Q${x - o} ${y - o} ${x - o + 6} ${y - o} Z`
  return (
    <g opacity={op}>
      <path d={d} fill="none" stroke="#4a3018" strokeWidth={kt + 1.6} />
      <path d={d} fill="none" stroke={stroke} strokeWidth={kt} />
    </g>
  )
}

/* ================================================================== */
/* 1 · The premium spec                                                  */
/* ================================================================== */

function Spec() {
  const s = 2.15
  const oC = LONG()
  const oA = ALONG()
  const PC = { x: 44, y: 76, s }
  const PA = { x: 44, y: 190, s }
  const runC = seamRuns(PC, oC, 3, 3, 4)
  const runA = seamRuns(PA, oA, 2, 2.45, 4)
  // side elevation under a plan, thickness ×5
  const prof = (P, o, t0, t1, y) => {
    const k = 5
    const tAt = (x) => (x <= 18 ? t0 : t0 + ((t1 - t0) * (x - 18)) / (o.x1 - 18))
    const top = []
    const mid = []
    const bot = []
    for (let i = 0; i <= 30; i++) {
      const x = (o.x1 * i) / 30
      const X = P.x + x * P.s
      top.push([X, y])
      mid.push([X, y + tAt(x) * k * 0.58])
      bot.push([X, y + tAt(x) * k])
    }
    return (
      <g>
        <polygon points={ptsStr([...top, ...mid.slice().reverse()])} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.7" />
        <polygon points={ptsStr([...mid, ...bot.slice().reverse()])} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
      </g>
    )
  }
  // width dimension beyond the tip
  const tipDim = (P, o, wTip, label) => {
    const h = (wTip / 2) * P.s
    const xa = px(P, o.x1 - 14, 0)[0]
    const xd = px(P, o.x1, 0)[0] + 8
    return (
      <g>
        <g stroke={C.dim} strokeWidth="0.6" opacity="0.6">
          <line x1={xa} y1={P.y - h} x2={xd + 3} y2={P.y - h} />
          <line x1={xa} y1={P.y + h} x2={xd + 3} y2={P.y + h} />
        </g>
        <Dim a={[xd, P.y - h]} b={[xd, P.y + h]} text="" />
        <T x={xd + 6} y={P.y + 4} s={10.5} mono c={C.text}>
          {label}
        </T>
      </g>
    )
  }
  const card = (x, y, h, title, rows, c) => (
    <g>
      <Box x={x} y={y} w={136} h={h} title={title} c={c} tc={c} />
      {rows.map(([k, v], i) => (
        <g key={i}>
          <T x={x + 8} y={y + 34 + i * 12.5} s={10} c={C.faint}>
            {k}
          </T>
          <T x={x + 50} y={y + 34 + i * 12.5} s={10.5} mono c={k ? C.text : C.dim}>
            {v}
          </T>
        </g>
      ))}
    </g>
  )
  const detail = (x0, w, m, p, d, title, mT, pT, c) => {
    const k = 8
    const y0 = 282
    const H = 48
    const ly = y0 + m * k
    const hx = []
    for (let x = x0 + 22; x <= x0 + w + p * k; x += p * k) hx.push([x, ly])
    return (
      <g>
        <Tag x={x0} y={274} c={c}>
          {title}
        </Tag>
        <ClipBox x={x0} y={y0 - 4} w={w} h={H + 8}>
          <rect x={x0} y={y0} width={w} height={H} fill="url(#sk-top)" />
          {hx.map(([x, y], i) => (
            <Slit key={i} x={x} y={y} len={p * k * 0.32} w={1.4} />
          ))}
          <Stitches pts={hx} w={d * k} sl={0.32} cas={1.1} />
        </ClipBox>
        <line x1={x0} y1={y0} x2={x0 + w} y2={y0} stroke={C.paint} strokeWidth="2.6" />
        <BreakV x={x0 + w} y1={y0} y2={y0 + H} />
        <Dim a={[x0 + 8, y0]} b={[x0 + 8, ly]} text="" c={C.text} />
        <T x={x0 + 12} y={y0 + (ly - y0) / 2 + 4} s={10.5} mono c={C.text}>
          {mT}
        </T>
        <Dim a={hx[3]} b={hx[4]} off={y0 + H + 6 - ly} text={pT} flip c={C.text} />
      </g>
    )
  }
  return (
    <Fig h={348} view="Plan · two specs" scale="plans ×2.15 · details ×8">
      {/* course */}
      <StrapPlan T={PC} o={oC} />
      {runC.map((r, i) => (
        <Stitches key={i} pts={r} w={1.1} sl={0.3} cas={0.6} />
      ))}
      <Dim a={px(PC, 0, -10)} b={px(PC, 120, -10)} off={-9} text="120" flip />
      <Dim a={px(PC, 0, -10)} b={px(PC, 0, 10)} off={8} text="" />
      <T x={30} y={PC.y + 4} a="end" s={10.5} mono c={C.text}>
        20
      </T>
      {tipDim(PC, oC, 18, '18')}
      {prof(PC, oC, 2.0, 2.0, 106)}
      <T x={40} y={115} a="end" s={10} mono c={C.dim}>
        2.0
      </T>
      <T x={px(PC, 120, 0)[0] + 6} y={115} s={10} mono c={C.dim}>
        2.0
      </T>

      {/* atelier */}
      <StrapPlan T={PA} o={oA} />
      {runA.map((r, i) => (
        <Stitches key={i} pts={r} w={0.8} sl={0.3} cas={0.6} />
      ))}
      <Dim a={px(PA, 0, -10)} b={px(PA, 115, -10)} off={-9} text="115" flip />
      <Dim a={px(PA, 0, -10)} b={px(PA, 0, 10)} off={8} text="" />
      <T x={30} y={PA.y + 4} a="end" s={10.5} mono c={C.text}>
        20
      </T>
      {tipDim(PA, oA, 16, '16')}
      {prof(PA, oA, 2.5, 1.8, 220)}
      <T x={40} y={231} a="end" s={10} mono c={C.brass}>
        2.5
      </T>
      <T x={px(PA, 115, 0)[0] + 6} y={229} s={10} mono c={C.brass}>
        1.8
      </T>

      {card(334, 28, 96, 'Course · first', [
        ['pitch', '3.0 mm'],
        ['thread', '0.5 mm'],
        ['margin', '3 mm'],
        ['taper', '20 → 18'],
        ['thick', '≈ 2.0 even'],
      ])}
      {card(334, 134, 132, 'Atelier', [
        ['pitch', '2.45 mm'],
        ['', '2.7 pre-2024'],
        ['', 'finest 2.25'],
        ['thread', '0.35 linen'],
        ['margin', '≈ 2 mm'],
        ['taper', '20 → 16'],
        ['thick', '2.5 → 1.8'],
        ['slim', '≈ 2.2 mm'],
      ], C.brass)}

      {detail(16, 214, 3, 3, 0.5, 'Course · 3.0 / 0.5 · ×8', '3', '3.0')}
      {detail(250, 216, 2, 2.45, 0.35, 'Atelier · 2.45 / 0.35 · ×8', '2', '2.45', C.brass)}
    </Fig>
  )
}

/* ================================================================== */
/* 2 · Five stitch grades                                               */
/* ================================================================== */

function Grades() {
  const k = 8
  const x0 = 124
  const W = 30 * k
  const rows = [
    { p: 3.85, ps: '3.85', d: 0.55, name: 'rugged', n: '≈ 8', pc: '−22 %' },
    { p: 3.0, ps: '3.0', d: 0.5, name: 'this course’s default', n: '10', pc: 'baseline', course: true },
    { p: 2.7, ps: '2.7', d: 0.45, name: 'the old fine grade', n: '≈ 11', pc: '+11 %' },
    { p: 2.45, ps: '2.45', d: 0.35, name: 'atelier · linen', n: '≈ 12', pc: '+22 %', at: true },
    { p: 2.25, ps: '2.25', d: 0.35, name: 'atelier · finest', n: '≈ 13', pc: '+33 %', at: true },
  ]
  return (
    <Fig h={344} view="Plan · one 30 mm seam at five grades" scale="×8 · thread to scale">
      <Tag x={16} y={44}>pitch / thread</Tag>
      <Tag x={x0} y={44}>the same 30 mm of seam</Tag>
      <Tag x={376} y={44}>/ 30 mm</Tag>
      <Tag x={452} y={44} a="middle">
        Ø ×30
      </Tag>
      {rows.map((r, i) => {
        const y = 78 + i * 50
        const pk = r.p * k
        const hx = []
        for (let j = 0; j * pk <= W + pk; j++) hx.push([x0 + j * pk, y])
        const hl = r.at ? C.emerald : r.course ? C.brass : C.text
        return (
          <g key={r.ps}>
            <T x={16} y={y + 1} s={15} mono w="600" c={hl}>
              {r.ps}
            </T>
            <T x={16 + r.ps.length * 9.4 + 4} y={y + 1} s={10.5} mono c={C.dim}>
              / {r.d}
            </T>
            <T x={16} y={y + 16} s={10} c={r.at ? C.emerald : r.course ? C.brass : C.faint}>
              {r.name}
            </T>
            <rect x={x0} y={y - 12} width={W} height={24} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.6" />
            <ClipBox x={x0} y={y - 14} w={W} h={28}>
              {hx.map(([x, yy], j) => (
                <Slit key={j} x={x} y={yy} len={Math.min(7, pk * 0.34)} w={1.4} />
              ))}
              <Stitches pts={hx} w={r.d * k} sl={0.3} cas={0.9} />
            </ClipBox>
            <BreakV x={x0} y1={y - 12} y2={y + 12} />
            <BreakV x={x0 + W} y1={y - 12} y2={y + 12} />
            <Dim a={[hx[0][0], y - 12]} b={[hx[1][0], y - 12]} off={-5} text="" />
            <T x={376} y={y + 1} s={13} mono c={hl} w="600">
              {r.n}
            </T>
            <T x={376} y={y + 15} s={10} c={r.at ? C.emerald : C.dim}>
              {r.pc}
            </T>
            <circle cx={452} cy={y} r={r.d * 15} fill={TA} stroke={CASE} strokeWidth="0.8" />
          </g>
        )
      })}
      <path d={`M${x0 + W + 6} 216 h4 V282 h-4`} fill="none" stroke={C.emerald} strokeWidth="1.1" />
      <Sep x1={14} y1={302} x2={466} y2={302} />
      <T x={16} y={321} s={11} c={C.text}>
        At 2.45 mm a seam carries about a fifth more stitches than at 3.0 mm — budget the time.
      </T>
      <T x={16} y={336} s={10} c={C.faint}>
        Rugged 3.85 / 0.55 · default 3.0 / 0.5 · old fine 2.7 / 0.45 · atelier 2.45 and 2.25 / 0.35 linen.
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* 3 · Match the iron exactly                                           */
/* ================================================================== */

function IronMatch() {
  const k = 8
  const row = (y, xs, bad) => {
    const pts = xs.map((v) => [262 + v * k, y])
    return (
      <g>
        <rect x={252} y={y - 11} width={206} height={22} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.6" />
        <ClipBox x={252} y={y - 12} w={206} h={24}>
          {pts.map(([x], i) => (
            <Slit key={i} x={x} y={y} len={6} w={1.4} />
          ))}
          <Stitches pts={pts} w={2.8} sl={0.3} cas={0.9} />
        </ClipBox>
        <BreakV x={458} y1={y - 11} y2={y + 11} />
        {bad &&
          [3, 7].map((i) => (
            <rect key={i} x={pts[i][0] - 3} y={y - 9} width={pts[i + 1][0] - pts[i][0] + 6} height={18} rx="4" fill="none" stroke={C.ruby} strokeWidth="1.2" />
          ))}
      </g>
    )
  }
  const tight = [0, 2.7, 5.4, 8.1, 9.8, 12.5, 15.2, 17.9, 19.6, 22.3, 25.0]
  const even = Array.from({ length: 11 }, (_, i) => i * 2.45)
  // hole : thread cells, plan ×24 (schematic proportions)
  const cell = (cx, p, d, slitFor, ok) => {
    const kk = 24
    const yy = 240
    const L = 0.5 * p * kk
    const S = slitFor * kk * 1.1
    const r = (d * kk) / 2
    const holes = [cx - (p * kk) / 2, cx + (p * kk) / 2]
    const ang = -55
    const a = (ang * Math.PI) / 180
    const u = [Math.cos(a), Math.sin(a)]
    const v = [-u[1], u[0]]
    const loz = (hx) =>
      `M${hx + (u[0] * L) / 2} ${yy + (u[1] * L) / 2} L${hx + (v[0] * S) / 2} ${yy + (v[1] * S) / 2} L${hx - (u[0] * L) / 2} ${yy - (u[1] * L) / 2} L${hx - (v[0] * S) / 2} ${yy - (v[1] * S) / 2} Z`
    return (
      <g>
        <rect x={cx - 50} y={210} width={100} height={60} rx="3" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.6" />
        <line x1={cx - 50} y1={yy} x2={cx + 50} y2={yy} stroke={C.text} strokeWidth="0.6" strokeDasharray="1.5 2.5" opacity="0.6" />
        {holes.map((hx, i) => (
          <g key={i}>
            {!ok && <ellipse cx={hx} cy={yy} rx={r * 2.3} ry={r * 1.25} transform={`rotate(${ang} ${hx} ${yy})`} fill={C.hole} stroke={C.ruby} strokeWidth="1.1" />}
            <path d={loz(hx)} fill={C.hole} stroke="#e7c48f" strokeWidth="0.5" />
            {[-1, 1].map((sg) => (
              <circle key={sg} cx={hx + u[0] * sg * r * 1.1} cy={yy + u[1] * sg * r * 1.1} r={r} fill={TA} stroke={CASE} strokeWidth="0.8" />
            ))}
          </g>
        ))}
        {!ok && (
          <path
            d={`M${holes[0] + 9} ${yy + 3} l6 -5 l5 6 l6 -6 l5 6 l6 -5 l5 5 l6 -6 l5 4`}
            fill="none"
            stroke={C.ruby}
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        )}
        <Verdict x={cx + 40} y={221} ok={ok} r={6.5} />
      </g>
    )
  }
  const caps = [
    [68, '3.0 iron · 0.5', 'closes round it', true],
    [182, '2.45 iron · 0.35', 'closes round it', true],
    [296, '2.25 iron · 0.35', 'closes round it', true],
    [410, '2.45 iron · 0.5', 'crowds; the web splits', false],
  ]
  return (
    <Fig h={342} view="Tool & plan · iron and thread" scale="×8 · slits ×24 schematic">
      <Box x={14} y={26} w={222} h={150} title="Matched irons · ×8" />
      <Iron n={4} pitch={2.25 * k} x={34} y={124} />
      <Iron n={4} pitch={2.45 * k} x={136} y={124} />
      <Dim a={[34, 124]} b={[34 + 2.25 * k, 124]} off={7} text="2.25" flip c={C.text} />
      <Dim a={[136, 124]} b={[136 + 2.45 * k, 124]} off={7} text="2.45" flip c={C.text} />
      <T x={61} y={156} a="middle" s={10.5} c={C.text}>
        Vergez Blanchard
      </T>
      <T x={61} y={169} a="middle" s={10} c={C.faint}>
        #12 · 2.25 mm
      </T>
      <T x={166} y={156} a="middle" s={10.5} c={C.text}>
        2.45 mm iron
      </T>
      <T x={166} y={169} a="middle" s={10} c={C.faint}>
        as makers sell
      </T>

      <Box x={244} y={26} w={222} h={150} />
      <Verdict x={258} y={40} ok={false} r={7} />
      <T x={272} y={44} s={10.5} c={C.ruby}>
        2.7 iron walked tight
      </T>
      {row(66, tight, true)}
      <Dim a={[262, 66]} b={[262 + 2.7 * k, 66]} off={18} text="2.7" flip />
      <Dim a={[262 + 8.1 * k, 66]} b={[262 + 9.8 * k, 66]} off={18} text="1.7" flip c={C.ruby} />
      <T x={456} y={98} a="end" s={10} c={C.faint}>
        a short gap every strike
      </T>
      <Verdict x={258} y={112} ok r={7} />
      <T x={272} y={116} s={10.5} c={C.emerald}>
        a true 2.45 iron: even
      </T>
      {row(136, even, false)}
      <Dim a={[262, 136]} b={[262 + 2.45 * k, 136]} off={18} text="2.45" flip />
      <T x={456} y={168} a="end" s={10} c={C.faint}>
        both average 2.45 per hole
      </T>

      <Box x={14} y={186} w={452} h={150} title="Thread in the slit · plan ×24 · schematic" />
      {cell(68, 3.0, 0.5, 0.5, true)}
      {cell(182, 2.45, 0.35, 0.35, true)}
      {cell(296, 2.25, 0.35, 0.35, true)}
      {cell(410, 2.45, 0.5, 0.35, false)}
      {caps.map(([cx, a, b, ok]) => (
        <g key={cx}>
          <T x={cx} y={288} a="middle" s={10.5} mono c={ok ? C.text : C.ruby}>
            {a}
          </T>
          <T x={cx} y={302} a="middle" s={10} c={ok ? C.emerald : C.ruby}>
            {b}
          </T>
        </g>
      ))}
      <T x={240} y={326} a="middle" s={10.5} c={C.text}>
        Two strands pass each slit: use the thinnest thread the slits close round.
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* 4 · Scale the margin with the pitch                                  */
/* ================================================================== */

function Margin() {
  const k = 9
  const cell = (x0, y0, m, p, d, ok, cap, sub) => {
    const ey = y0 + 4
    const ly = ey + m * k
    const hx = []
    for (let x = x0 + 30; x <= x0 + 176 + p * k; x += p * k) hx.push([x, ly])
    return (
      <g>
        <ClipBox x={x0} y={ey - 3} w={176} h={60}>
          <rect x={x0} y={ey} width={176} height={56} fill="url(#sk-top)" />
          {hx.map(([x, y], i) => (
            <Slit key={i} x={x} y={y} len={p * k * 0.3} w={1.4} />
          ))}
          <Stitches pts={hx} w={d * k} sl={0.3} cas={1} />
        </ClipBox>
        <line x1={x0} y1={ey} x2={x0 + 176} y2={ey} stroke={C.paint} strokeWidth="2.6" />
        <line x1={x0} y1={ey + 1.6} x2={x0 + 176} y2={ey + 1.6} stroke="#7a5638" strokeWidth="0.6" />
        <BreakV x={x0 + 176} y1={ey} y2={ey + 56} />
        <Dim a={[x0 + 10, ey]} b={[x0 + 10, ly]} text="" c={C.text} />
        <T x={x0 + 15} y={(ey + ly) / 2 + 4} s={10.5} mono c={C.text}>
          {m}
        </T>
        <Verdict x={x0 + 8} y={y0 + 76} ok={ok} r={7} />
        <T x={x0 + 22} y={y0 + 80} s={10.5} c={ok ? C.emerald : C.ruby}>
          {cap}
        </T>
        <T x={x0 + 22} y={y0 + 93} s={10} c={C.faint}>
          {sub}
        </T>
      </g>
    )
  }
  return (
    <Fig h={342} view="Plan · margin against pitch" scale="×9 · thread to scale">
      <T x={192} y={46} a="middle" s={11.5} c={C.text} w="600">
        2 mm margin
      </T>
      <T x={378} y={46} a="middle" s={11.5} c={C.text} w="600">
        3 mm margin
      </T>
      <T x={16} y={84} s={14} mono w="600" c={C.emerald}>
        2.45
      </T>
      <T x={16} y={99} s={10} mono c={C.dim}>
        0.35 linen
      </T>
      <T x={16} y={112} s={10} c={C.emerald}>
        atelier
      </T>
      <T x={16} y={202} s={14} mono w="600" c={C.brass}>
        3.0
      </T>
      <T x={16} y={217} s={10} mono c={C.dim}>
        0.5 thread
      </T>
      <T x={16} y={230} s={10} c={C.brass}>
        course
      </T>
      {cell(104, 56, 2, 2.45, 0.35, true, 'sits with the edge', 'where premium makers sit')}
      {cell(290, 56, 3, 2.45, 0.35, false, 'looks lost', 'a fine stitch set too far in')}
      {cell(104, 174, 2, 3.0, 0.5, false, 'looks crowded', 'a heavy stitch set too close')}
      {cell(290, 174, 3, 3.0, 0.5, true, 'sits with the edge', 'keep 2.75–3 mm here')}

      <Sep x1={14} y1={280} x2={466} y2={280} />
      <rect x={24} y={318} width={96} height={12} rx="1.5" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
      {Array.from({ length: 10 }, (_, i) => (
        <line key={i} x1={32 + i * 9} y1={318} x2={32 + i * 9} y2={318 + (i % 5 === 0 ? 6 : 3.5)} stroke="#2f3b42" strokeWidth="0.8" />
      ))}
      <Dividers x={41} y={318} sp={18} h={24} />
      <T x={41} y={341} a="middle" s={10} mono c={C.text}>
        2.0
      </T>
      <T x={140} y={302} s={10.5} c={C.text}>
        Set the dividers to the margin before you prick:
      </T>
      <T x={140} y={317} s={10.5} c={C.emerald}>
        ≈ 2 mm for 2.25–2.5 mm pitch, 0.35 mm thread, slim strap
      </T>
      <T x={140} y={332} s={10.5} c={C.brass}>
        2.75–3 mm for 3 mm pitch and heavier thread
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* 5 · Taper the thickness as well as the width                         */
/* ================================================================== */

function Thickness() {
  const s = 3.2
  const k = 10
  const xb = 64
  const y0 = 58
  const X = (mm) => xb + mm * s
  const t0 = 1.6
  const t1 = 0.9
  const vel = 0.2 * k
  const lin = 0.7 * k
  const tTop = (mm) => (mm <= 18 ? t0 : t0 + ((t1 - t0) * (mm - 18)) / (115 - 18))
  const A = { cx: xb, y0, r: 0.9 * k, t: t0 * k, tl: 0.8 * k, cv: 22, tail: 34, a: 10 }
  const g = foldGeo(A)
  const xEnd = X(115)
  const mmOf = (x) => (x - xb) / s
  const under = (x) => y0 + tTop(mmOf(x)) * k
  // body (tapered top) from 18 mm to the tip
  const bodyTop = []
  const bodyBot = []
  for (let i = 0; i <= 40; i++) {
    const x = X(18) + ((xEnd - X(18)) * i) / 40
    bodyTop.push([x, y0])
    bodyBot.push([x, under(x)])
  }
  // lining: under the tail, then under the Velodon
  const linTop = []
  const linBot = []
  for (let i = 0; i <= 60; i++) {
    const x = g.conv + ((xEnd - g.conv) * i) / 60
    let yt
    if (x < g.tip) {
      const f = (x - g.conv) / (g.tip - g.conv)
      yt = g.yB + A.tl * (1 - f) + vel * f
    } else yt = under(x) + vel
    const th = lin * Math.min(1, 0.35 + (0.65 * (x - g.conv)) / 40)
    linTop.push([x, yt])
    linBot.push([x, yt + th])
  }
  const holes = [90, 84, 78, 72, 66, 60, 54]
  const yU = (x) => under(x) + vel + lin
  // keeper check, end-on ×6
  const keeper = (x, tip, ok) => {
    const kk = 6
    const w = 16 * kk
    const ky = 292
    const ih = 4.1 * kk
    const sp = 2.0 * kk
    const lp = tip * kk
    return (
      <g>
        <rect x={x} y={ky + ih - sp} width={w} height={sp} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.7" />
        <rect x={x} y={ky + ih - sp - lp} width={w} height={lp} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.7" />
        <Loop x={x} y={ky} w={w} h={ih} kt={7} />
        {!ok && <rect x={x - 2} y={ky - 6} width={w + 4} height={10} rx="3" fill="none" stroke={C.ruby} strokeWidth="1.2" strokeDasharray="3 2" />}
        <T x={x + w / 2} y={ky + ih - sp / 2 + 3.5} a="middle" s={10} c="#3a2412">
          short piece
        </T>
        <T x={x + w / 2} y={ky + ih - sp - lp / 2 + 3.5} a="middle" s={10} c="#3a2412">
          tip · {tip}
        </T>
      </g>
    )
  }
  return (
    <Fig h={344} view="Long section · lug → tip" scale="×3.2 · thickness ×10">
      {/* ghost: untapered underside */}
      <line x1={X(18)} y1={y0 + 2.5 * k} x2={xEnd} y2={y0 + 2.5 * k} stroke={C.ruby} strokeWidth="1" strokeDasharray="4 3" opacity="0.8" />
      <FoldEnd {...A} bl={X(18) - xb} />
      <polygon points={ptsStr([...bodyTop, ...bodyBot.slice().reverse()])} fill="url(#sk-topS)" />
      <polyline points={ptsStr([...bodyTop, [xEnd, under(xEnd)], ...bodyBot.slice().reverse()])} fill="none" stroke="#4a3018" strokeWidth="0.8" />
      <polyline
        points={ptsStr(Array.from({ length: 30 }, (_, i) => {
          const x = g.tip + ((xEnd - g.tip) * i) / 29
          return [x, under(x) + vel / 2]
        }))}
        fill="none"
        stroke={C.velodon}
        strokeWidth={vel}
      />
      <polygon points={ptsStr([...linTop, ...linBot.slice().reverse()])} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.8" />
      <BarEnd cx={xb} cy={g.cy} r={A.r * 0.95} />
      {holes.map((h) => (
        <rect key={h} x={X(h) - 2.9} y={y0 - 0.8} width={5.8} height={yU(X(h)) - y0 + 1.6} fill={C.ground} />
      ))}
      {/* stations */}
      <line x1={X(18)} y1={y0 - 10} x2={X(18)} y2={y0 + 2.5 * k + 6} stroke={C.text} strokeWidth="0.8" strokeDasharray="2 2" />
      <T x={X(18)} y={y0 - 14} a="middle" s={11} mono c={C.brass} w="600">
        2.5
      </T>
      <line x1={X(66)} y1={y0 - 10} x2={X(66)} y2={yU(X(66)) + 4} stroke={C.text} strokeWidth="0.8" strokeDasharray="2 2" />
      <T x={X(66)} y={y0 - 14} a="middle" s={10.5} mono c={C.dim}>
        ≈ 2.15
      </T>
      <Dim a={[xEnd + 9, y0]} b={[xEnd + 9, yU(xEnd)]} text="" c={C.text} />
      <T x={xEnd + 15} y={y0 + 11} s={11} mono c={C.brass} w="600">
        1.8
      </T>
      <Ld pts={[[xb - 14, g.cy + 6], [30, 106]]} x={16} y={118} text="thickest at the lug:" sub="wraps the bar with body" s={10.5} />
      <Ld pts={[[X(36), y0], [X(36), 34]]} text="grain face stays flat" a="middle" s={10.5} c={C.dim} />
      <Ld pts={[[X(100), y0 + 6], [X(92), 34]]} text="flesh side rises: top skived thinner" a="middle" s={10.5} c={C.dim} />
      <Ld pts={[[X(46), yU(X(46))], [X(46), 104]]} text="Velodon · lining" a="middle" s={10} c={C.faint} />
      <Ld pts={[[xEnd - 4, yU(xEnd) - 2], [xEnd - 28, 104]]} text="thinnest at the tip" sub="tucks through the keepers" a="middle" s={10.5} />
      <T x={X(78)} y={y0 + 2.5 * k + 16} a="middle" s={10} c={C.ruby}>
        untapered: 2.5 all the way
      </T>

      {/* how: two routes, before laminating */}
      <Box x={14} y={146} w={222} h={110} title="1 · skive the top, tapering" />
      <Slab x={22} y={226} w={206} h={10} kind="glass" />
      <polygon points="30,226 222,226 222,210 30,210" fill="url(#sk-fadeR)" opacity="0.9" />
      <polygon points="30,226 222,226 222,217 30,210" fill="url(#at-topUp)" stroke="#4a3018" strokeWidth="0.8" />
      <line x1={30} y1={210} x2={222} y2={210} stroke={C.brass} strokeWidth="0.8" strokeDasharray="3 2" />
      <Knife kind="skive" x={176} y={214} ang={-74} k={0.5} />
      <Arrow a={[186, 200]} b={[220, 204]} w={1.4} />
      <T x={30} y={248} s={10} c={C.dim}>
        lug end
      </T>
      <T x={222} y={248} a="end" s={10} c={C.dim}>
        tip end: most removed
      </T>
      <T x={30} y={176} s={10} c={C.faint}>
        flesh up on glass · long, light passes
      </T>

      <Box x={244} y={146} w={222} h={110} title="2 · or level the lining" />
      <Slab x={252} y={226} w={206} h={10} kind="glass" />
      <polygon points="260,226 452,226 452,212 260,212" fill="url(#sk-fadeR)" opacity="0.9" />
      <polygon points="260,226 452,226 452,219 260,212" fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.8" />
      <line x1={260} y1={212} x2={452} y2={212} stroke={C.brass} strokeWidth="0.8" strokeDasharray="3 2" />
      <Ld pts={[[400, 214], [400, 196]]} text="flesh side levelled away" a="middle" s={10} c={C.brass} />
      <T x={260} y={248} s={10} c={C.dim}>
        lug end
      </T>
      <T x={452} y={248} a="end" s={10} c={C.dim}>
        tip end: thinnest
      </T>
      <T x={260} y={176} s={10} c={C.faint}>
        flesh up · splitter or skiving knife
      </T>

      <Box x={14} y={264} w={452} h={76} />
      <Tag x={24} y={280}>In the keepers · end-on ×6</Tag>
      {keeper(40, 1.8, true)}
      <Verdict x={158} y={304} ok r={7} />
      <T x={170} y={308} s={10.5} c={C.emerald}>
        slides through
      </T>
      <T x={170} y={322} s={10} c={C.faint}>
        tapered: 1.8 tip
      </T>
      {keeper(264, 2.5, false)}
      <Verdict x={382} y={304} ok={false} r={7} />
      <T x={394} y={308} s={10.5} c={C.ruby}>
        tight
      </T>
      <T x={394} y={322} s={10} c={C.faint}>
        untapered
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* 6 · Start the seam at the lug end — and close it                     */
/* ================================================================== */

function LugStart() {
  // true-scale ×10 section along the side seam
  const A = { cx: 50, y0: 76, r: 9, t: 11, tl: 6, cv: 22, tail: 40, a: 14 }
  const g = foldGeo(A)
  const xR = 300
  const yL = g.yB + 2 + 7 // lining underside
  const linPts = [
    [g.conv, g.yB + A.tl],
    [g.tip, g.yB + 2],
    [xR, g.yB + 2],
    [xR, yL],
    [g.conv, yL],
  ]
  const p = 24.5
  const x0 = 80
  const n = 9
  const { A: TAp, B: TBp } = seamPaths({ x0, p, y: A.y0, h: yL - A.y0, done: n - 1, r: 2.4, d: 1.6 })
  // ✗ mini section ×5
  const Bm = { cx: 340, y0: 92, r: 4.5, t: 5.5, tl: 3, cv: 11, tail: 20, a: 7 }
  const gm = foldGeo(Bm)
  const hx = 404
  // plans
  const o = LONG()
  const s = 3.8
  const P1 = { x: 48, y: 254, s }
  const P2 = { x: 278, y: 254, s }
  const plan = (TP, cross) => {
    const runs = seamRuns(TP, o, 2, 2.45, 4, 36)
    const firsts = runs.map((r) => (r[0][0] < r[r.length - 1][0] ? r[0] : r[r.length - 1]))
    const row = Array.from({ length: 8 }, (_, j) => px(TP, 4, -8 + (16 * j) / 7))
    return (
      <g>
        <ClipBox x={TP.x - 14} y={TP.y - 50} w={36 * s + 14} h={100}>
          <StrapPlan T={TP} o={o} />
          {runs.map((r, i) => (
            <Stitches key={i} pts={r} w={1.2} sl={0.3} cas={0.7} />
          ))}
          {cross && <Stitches pts={row} w={1.2} sl={0.3} cas={0.7} />}
        </ClipBox>
        <BreakV x={TP.x + 36 * s} y1={TP.y - 38} y2={TP.y + 38} />
        <SpringBar x={TP.x} y1={TP.y - 44} y2={TP.y + 44} r={2.4} />
        {!cross &&
          firsts.map((q, i) => <circle key={i} cx={q[0]} cy={q[1]} r="6" fill="none" stroke={C.emerald} strokeWidth="1.3" />)}
        {cross && <rect x={row[0][0] - 6} y={row[0][1] - 6} width={12} height={row[7][1] - row[0][1] + 12} rx="5" fill="none" stroke={C.emerald} strokeWidth="1.2" />}
      </g>
    )
  }
  return (
    <Fig h={344} view="Section & plans · lug end" scale="×10 · mini ×5 · plans ×3.8">
      <Box x={14} y={26} w={300} h={150} title="Section along the side seam · ×10" />
      <FoldEnd {...A} bl={xR - A.cx} />
      <line x1={g.tip} y1={g.yB + 1} x2={xR} y2={g.yB + 1} stroke={C.velodon} strokeWidth="2" />
      <polygon points={ptsStr(linPts)} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.8" />
      <BreakV x={xR} y1={A.y0} y2={yL} />
      <BarEnd cx={A.cx} cy={g.cy} r={A.r * 0.95} />
      <ClipBox x={x0 - 6} y={A.y0 - 12} w={xR - x0 + 4} h={yL - A.y0 + 24}>
        {Array.from({ length: n }, (_, i) => (
          <rect key={i} x={x0 + i * p - 2} y={A.y0 - 0.6} width={4} height={yL - A.y0 + 1.2} fill={C.ground} />
        ))}
        <Thr d={poly(TBp)} c={TB} w={2.2} cas={1.2} />
        <Thr d={poly(TAp)} c={TA} w={2.2} cas={1.2} />
      </ClipBox>
      <circle cx={x0} cy={(A.y0 + yL) / 2} r="12" fill="none" stroke={C.emerald} strokeWidth="1.4" />
      <Ld pts={[[A.cx - 6, g.cy - 4], [36, 60]]} x={24} y={56} text="bar Ø 1.8" s={10} c={C.dim} />
      <T x={150} y={60} s={10} c={C.dim}>
        2.45 mm pitch · 0.35 linen
      </T>
      <Ld pts={[[A.cx + 4, g.cy + 6], [44, 132]]} x={24} y={136} text="fold channel" sub="left clear" s={10.5} c={C.dim} />
      <Ld pts={[[x0, yL + 12], [x0 + 30, 140]]} text="first stitch: top, tail" sub="and lining together" s={10.5} c={C.emerald} />
      <Ld pts={[[g.tip - 6, g.yB + 3], [214, 124]]} text="tail" s={10} c={C.faint} />
      <Ld pts={[[250, g.yB + 1], [268, 124]]} text="Velodon" s={10} c={C.faint} />
      <ThreadKey x={196} y={166} la="A" lb="B" />

      <Box x={322} y={26} w={144} h={150} title="Caught too late" c={C.ruby} tc={C.ruby} />
      <FoldEnd {...Bm} bl={118} />
      <polygon points={ptsStr([[hx, gm.yB], [458, gm.yB], [458, gm.yB + 3.5], [hx, gm.yB + 3.5]])} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
      <g transform={`rotate(9 ${hx} ${gm.yB})`}>
        <polygon points={ptsStr([[gm.conv, gm.yB + 1], [hx, gm.yB], [hx, gm.yB + 3.5], [gm.conv, gm.yB + 3.5]])} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
      </g>
      <path d={`M${gm.tip - 6} ${gm.yB + 0.5} L${hx - 2} ${gm.yB + 0.5} L${gm.tip} ${gm.yB + 8}`} fill="rgba(194,88,99,0.35)" stroke={C.ruby} strokeWidth="0.9" />
      <BarEnd cx={Bm.cx} cy={gm.cy} r={Bm.r * 0.95} />
      <rect x={hx - 1} y={Bm.y0 - 0.5} width={2} height={10} fill={C.ground} />
      <line x1={hx} y1={Bm.y0 - 2} x2={hx} y2={gm.yB + 5.5} stroke={TA} strokeWidth="1.6" />
      <Verdict x={452} y={42} ok={false} r={7} />
      <Ld pts={[[hx, Bm.y0 - 2], [hx + 10, 62]]} x={332} y={58} text="first stitch too far in" s={10} c={C.dim} dot={false} />
      <Ld pts={[[gm.tip + 6, gm.yB + 5], [372, 128]]} x={330} y={132} text="lining end left free:" s={10.5} c={C.ruby} />
      <T x={330} y={146} s={10} c={C.text}>
        peels as the glue ages
      </T>
      <T x={330} y={164} s={10} c={C.faint}>
        nothing clamps it
      </T>

      <Box x={14} y={184} w={452} h={156} />
      <Tag x={62} y={202}>
        Seams start at the lug
      </Tag>
      {plan(P1, false)}
      <Tag x={292} y={202} c={C.brass}>
        Optional · across: a U
      </Tag>
      {plan(P2, true)}
      <Sep x1={240} y1={192} x2={240} y2={332} />
      <T x={36} y={312} s={10.5} c={C.emerald}>
        first stitch just clear of the channel,
      </T>
      <T x={36} y={326} s={10} c={C.faint}>
        through top and lining, 2 mm in
      </T>
      <T x={252} y={312} s={10.5} c={C.brass}>
        a row straight across, a few mm below
      </T>
      <T x={252} y={326} s={10} c={C.faint}>
        the bar: the side seams join into a U
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* 7 · Lock the buckle end                                              */
/* ================================================================== */

function BuckleLock() {
  const s = 3.6
  const o = SHORT({ x0: 30, w0: 20, w1: 16, taper: [8, 50] })
  const p = 2.45
  const sideTo = (to) => {
    const xs = []
    for (let x = to; x >= 39; x -= p) xs.push(x)
    return xs.reverse()
  }
  const keeper = (TP, x, flt) => {
    const [x1, y1] = px(TP, x - 2.5, -9)
    return <rect x={x1} y={y1} width={5 * TP.s} height={18 * TP.s} rx="2" fill="url(#sk-dark)" stroke="#e0b277" strokeWidth="0.8" opacity={flt ? 0.95 : 1} />
  }
  const panel = (bx, by, kind, title, cap) => {
    const TP = { x: bx + 12 - 38 * s, y: by + 66, s }
    const P = (x, y) => px(TP, x, y)
    const seam = (to) => [-1, 1].map((sg) => sideTo(to).map((x) => P(x, sg * 6)))
    let stitches = null
    let rings = null
    if (kind === 'A') {
      const sides = seam(76.4)
      stitches = sides.map((pts, i) => (
        <g key={i}>
          <Stitches pts={pts} w={1.3} cas={0.7} />
          <Stitches pts={pts.slice(-4).map(([x, y]) => [x, y + (i ? 2.6 : -2.6)])} c={TB} w={1.3} cas={0.7} />
        </g>
      ))
      rings = [-1, 1].map((sg) => {
        const [x1, y1] = P(68.7, sg * 6)
        return <rect key={sg} x={x1 - 4} y={y1 - 8} width={8.2 * s + 8} height={16} rx="5" fill="none" stroke={C.emerald} strokeWidth="1.2" />
      })
    } else if (kind === 'B') {
      const sides = seam(66.2)
      stitches = (
        <g>
          {sides.map((pts, i) => (
            <Stitches key={i} pts={pts} w={1.3} cas={0.7} />
          ))}
          {[-1, 1].map((sg) => (
            <Stitches key={sg} pts={[P(73.55, sg * 6), P(76, sg * 6)]} w={1.5} cas={0.8} />
          ))}
        </g>
      )
      rings = [-1, 1].map((sg) => {
        const [cx, cy] = P(74.8, sg * 6)
        return <circle key={sg} cx={cx} cy={cy} r="8" fill="none" stroke={C.emerald} strokeWidth="1.2" />
      })
    } else if (kind === 'C') {
      const sides = seam(73.6)
      const row = Array.from({ length: 6 }, (_, j) => P(73.6, -6 + 2.4 * j))
      stitches = (
        <g>
          {sides.map((pts, i) => (
            <Stitches key={i} pts={pts} w={1.3} cas={0.7} />
          ))}
          <Stitches pts={row} w={1.3} cas={0.7} />
        </g>
      )
      rings = <rect x={row[0][0] - 6} y={row[0][1] - 6} width={12} height={row[5][1] - row[0][1] + 12} rx="5" fill="none" stroke={C.emerald} strokeWidth="1.2" />
    } else {
      const sides = seam(76.4)
      stitches = (
        <g>
          {sides.map((pts, i) => (
            <Stitches key={i} pts={pts} w={1.3} cas={0.7} />
          ))}
          {[-1, 1].map((sg) => {
            const t = [P(76.4, sg * 6), P(76.4, sg * 4), P(76.4, sg * 2)]
            return (
              <g key={sg}>
                <Stitches pts={t} w={1.3} cas={0.7} />
                <Stitches pts={t.map(([x, y]) => [x - 2.6, y])} c={TB} w={1.3} cas={0.7} />
              </g>
            )
          })}
        </g>
      )
      rings = [-1, 1].map((sg) => {
        const [x1, y1] = P(76.4, sg * 6)
        const [, y2] = P(76.4, sg * 2)
        return <rect key={sg} x={x1 - 8} y={Math.min(y1, y2) - 5} width={14} height={Math.abs(y2 - y1) + 10} rx="5" fill="none" stroke={C.emerald} strokeWidth="1.2" />
      })
    }
    const [sx, sy] = P(75, -1)
    return (
      <g>
        <Box x={bx} y={by} w={224} h={120} title={title} />
        <ClipBox x={P(38, 0)[0]} y={by + 20} w={224} h={96}>
          <StrapPlan T={TP} o={o} />
        </ClipBox>
        <BreakV x={P(38, 0)[0]} y1={TP.y - 29} y2={TP.y + 29} />
        <rect x={sx} y={sy} width={5 * s} height={2 * s} rx={s} fill={C.hole} stroke="#e7c48f" strokeWidth="0.5" />
        {stitches}
        {keeper(TP, 60, true)}
        {keeper(TP, 69, false)}
        <Buckle x={P(80, 0)[0]} y={TP.y} w={16 * s} L={42} />
        {rings}
        <T x={bx + 10} y={by + 114} s={10} c={C.text}>
          {cap}
        </T>
      </g>
    )
  }
  // section through C
  const x1 = 30
  const x2 = 210
  const y = 302
  const ss = 6
  const kk = 8
  const sg = secGeom({ x1, x2, y, s: ss, k: kk })
  const rowX = x2 - 6.4 * ss
  const cvR = sg.rb * 2.4
  const tlR = Math.max(sg.rb * 4.5, 25 * ss - cvR)
  const ta = x2 - cvR - tlR
  const tb = x2 - cvR
  const tailT = (sg.T * 0.45 * (rowX - ta)) / (tb - ta)
  const lb = tb - 1
  const thick = sg.L * Math.max(0.25, Math.min(1, 0.25 + (0.75 * (lb - rowX)) / (10 * ss)))
  const yBot = sg.y1 + tailT + thick
  return (
    <Fig h={344} view="Plan · buckle-end locks" scale="plans ×3.6 · section ×6">
      <AtDefs />
      {panel(14, 26, 'A', 'A · doubled loops', 'last spans sewn twice, each side')}
      {panel(242, 26, 'B', 'B · side ticks', 'seams stop; one stitch per edge')}
      {panel(14, 152, 'C', 'C · cross row', '4–5 stitches across, clear of the slot')}
      {panel(242, 152, 'D', 'D · inward tacks', 'seams turn in either side of the slot')}

      <StrapSection x1={x1} x2={x2} y={y} s={ss} k={kk} left={{ kind: 'break' }} right={{ kind: 'buckle' }} keeper={{ at: 10 }} />
      <rect x={x2 - 5 * ss} y={y - 0.5} width={5 * ss - 1} height={sg.T + 0.3} fill={C.ground} />
      <rect x={rowX - 1.6} y={y - 0.6} width={3.2} height={yBot - y + 1.2} fill={C.ground} />
      <Thr d={`M${rowX} ${y - 2.2} L${rowX} ${yBot + 2.2}`} c={TA} w={2} cas={1} />
      <ellipse cx={rowX} cy={y - 2.4} rx="3.4" ry="2" fill={TA} stroke={CASE} strokeWidth="0.7" />
      <ellipse cx={rowX} cy={yBot + 2.4} rx="3.4" ry="2" fill={TA} stroke={CASE} strokeWidth="0.7" />
      <circle cx={rowX} cy={(y + yBot) / 2} r="12" fill="none" stroke={C.emerald} strokeWidth="1.3" />
      <Tag x={312} y={290} c={C.brass}>
        C in section
      </Tag>
      <T x={312} y={306} s={10.5} c={C.text}>
        the ringed row stitch takes top,
      </T>
      <T x={312} y={320} s={10.5} c={C.text}>
        flap tail, keeper ends, lining
      </T>
      <T x={312} y={334} s={10} c={C.faint}>
        and pulls the fold flat
      </T>
      <Ld pts={[[x2 - 14, y + 2], [x2 - 8, 286]]} x={x2 - 4} y={288} text="slot" s={10} c={C.dim} />
    </Fig>
  )
}

/* ================================================================== */
/* 8 · Backstitch twice                                                 */
/* ================================================================== */

function BackTwice() {
  const x0 = 70
  const p = 54
  const y = 120
  const h = 30
  const X = (i) => x0 + i * p
  const args = { X, yt: y - 2.4, yb: y + h + 2.4, mid: y + h / 2, lane: 3.8 }
  const fwd = [0, 1, 2, 3, 4, 5, 6].map((to) => ({ to }))
  const back = [{ to: 5, lane: 1 }, { to: 4, lane: 1 }]
  const Ap = route({ ...args, start: -1, side: 't', moves: [...fwd, ...back, { to: 5, lane: 2 }, { to: 6, lane: 2 }] })
  const Bp = route({ ...args, start: -1, side: 'b', moves: [...fwd, ...back, { to: 5, lane: 2 }, { to: 6, lane: 2, pass: false }] })
  const yb = y + h + 2.4
  Ap.push([X(6) + 12, yb + 34])
  Bp.push([X(6) - 12, yb + 34])
  // lining-side views of the seam end
  const view = (yy, passes) => {
    const xs = Array.from({ length: 11 }, (_, i) => 30 + i * 18)
    const pts = xs.map((x) => [x, yy])
    return (
      <g>
        <rect x={20} y={yy - 12} width={212} height={24} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="0.7" />
        <ClipBox x={20} y={yy - 14} w={212} h={28}>
          <Stitches pts={pts} c={TA} w={2} cas={1} />
          {passes >= 1 && <Stitches pts={pts.slice(-3).map(([x]) => [x, yy + 3.2])} c={TB} w={2} cas={1} />}
          {passes >= 2 && <Stitches pts={pts.slice(-3).map(([x]) => [x, yy - 3.2])} c={TA} w={2} cas={1} />}
        </ClipBox>
        <BreakV x={20} y1={yy - 12} y2={yy + 12} />
        <circle cx={xs[10]} cy={yy} r="3" fill="#e9d3a2" stroke={CASE} strokeWidth="0.8" />
      </g>
    )
  }
  const TL = { x: 262, y: 270, s: 1.75 }
  const TS = { x: 262, y: 318, s: 1.75 }
  const oL = ALONG()
  const oS = ASHORT()
  const runL = seamRuns(TL, oL, 2, 2.45, 4)
  const runS = seamRuns(TS, oS, 2, 2.45, 4, 71)
  const ring = (q, key) => <circle key={key} cx={q[0]} cy={q[1]} r="6.5" fill="none" stroke={C.emerald} strokeWidth="1.3" />
  return (
    <Fig h={344} view="Section · finishing an end" scale="thickness ×5 · plans ×1.75">
      <ThreadKey x={16} y={40} />
      <SeamBand x0={x0} p={p} n={7} y={y} h={h} />
      <ClipBox x={x0 - 0.75 * p} y={y - 30} w={7.5 * p} h={h + 100}>
        <Thr d={poly(Bp)} c={TB} />
        <Thr d={poly(Ap)} c={TA} />
      </ClipBox>
      <Arrow a={[X(0), 62]} b={[X(6) + 2, 62]} c="text" w={1.2} />
      <T x={X(1)} y={56} s={10.5} c={C.dim}>
        forward to the last hole
      </T>
      <Arrow a={[X(6), 82]} b={[X(4) - 2, 82]} w={1.8} />
      <T x={X(4) - 8} y={86} a="end" s={10.5} c={C.brass} w="600">
        pass 1 · back 2 holes
      </T>
      <Arrow a={[X(4), 100]} b={[X(6) + 2, 100]} c="emerald" w={1.8} />
      <T x={X(4) - 8} y={104} a="end" s={10.5} c={C.emerald} w="600">
        pass 2 · over them again
      </T>
      <T x={24} y={y - 8} s={10} c={C.faint}>
        grain
      </T>
      <T x={24} y={y + h + 18} s={10} c={C.faint}>
        lining
      </T>
      <T x={X(3.6)} y={yb + 26} a="middle" s={10} c={C.dim}>
        end spans sewn three times
      </T>
      <Ld pts={[[X(6), yb + 35], [X(6) - 16, 194]]} x={X(6) - 20} y={198} a="end" text="both ends out on the lining side" s={10.5} />
      <T x={X(6) - 20} y={211} a="end" s={10} c={C.faint}>
        trimmed and sealed there
      </T>

      <Sep x1={14} y1={222} x2={466} y2={222} />
      <Tag x={16} y={240}>Lining side · the seam end</Tag>
      {view(264, 1)}
      <T x={20} y={290} s={10.5} c={C.dim}>
        one pass: end spans doubled
      </T>
      {view(312, 2)}
      <T x={20} y={338} s={10.5} c={C.emerald}>
        two passes: end spans tripled
      </T>
      <Sep x1={244} y1={232} x2={244} y2={338} />
      <Tag x={254} y={240}>At every seam end</Tag>
      <StrapPlan T={TL} o={oL} />
      {runL.map((r, i) => (
        <Stitches key={i} pts={r} w={0.8} sl={0.3} cas={0.5} />
      ))}
      {runL.map((r, i) => [ring(r[0], 'l' + i), ring(r[r.length - 1], 'm' + i)])}
      <StrapPlan T={TS} o={oS} />
      {runS.map((r, i) => (
        <Stitches key={i} pts={r} w={0.8} sl={0.3} cas={0.5} />
      ))}
      {runS.map((r, i) => [ring(r[0], 's' + i), ring(r[r.length - 1], 't' + i)])}
      <T x={404} y={308} s={10} c={C.emerald}>
        rings: two
      </T>
      <T x={404} y={321} s={10} c={C.emerald}>
        passes each
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* 9 · Micro-stitch: a 1.5 mm seam                                      */
/* ================================================================== */

function Micro() {
  const k = 7
  const rows = [
    { p: 3.0, ps: '3.0', d: 0.5, n: '≈ 8½', c: C.dim, name: 'course' },
    { p: 2.45, ps: '2.45', d: 0.35, n: '≈ 10', c: C.text, name: 'atelier' },
    { p: 1.5, ps: '1.5', d: 0.3, n: '≈ 17', c: C.brass, name: 'micro' },
  ]
  const x0 = 70
  const W = 25.4 * k
  const TP = { x: 26 - 70 * 5.4, y: 218, s: 5.4 }
  const oT = ALONG()
  const run = seamRuns(TP, oT, 2, 1.5, 70)
  const holes = [90, 84, 78, 72]
  const [h84] = px(TP, 84, 0)
  const [h90] = px(TP, 90, 0)
  const topY = px(TP, 80, -8)[1]
  // section along the micro seam ×10
  const sx0 = 30
  const sp = 15
  const sy = 296
  const sh = 20
  const { A: sA, B: sB } = seamPaths({ x0: sx0, p: sp, y: sy, h: sh, done: 14, r: 1.6, d: 1.2 })
  return (
    <Fig h={352} view="Plan · micro-stitch" scale="×7 · tail ×5.4 · section ×10">
      <AtDefs />
      <Tag x={16} y={42}>one inch (25.4 mm) of seam</Tag>
      <Tag x={256} y={42}>SPI</Tag>
      {rows.map((r, i) => {
        const y = 66 + i * 34
        const pk = r.p * k
        const pts = []
        for (let j = 0; j * pk <= W + pk; j++) pts.push([x0 + j * pk, y])
        return (
          <g key={r.ps}>
            <T x={16} y={y + 2} s={13} mono w="600" c={r.c}>
              {r.ps}
            </T>
            <T x={16} y={y + 14} s={10} c={C.faint}>
              {r.name}
            </T>
            <rect x={x0} y={y - 10} width={W} height={20} fill="url(#at-navy)" stroke="#121a26" strokeWidth="0.6" />
            <ClipBox x={x0} y={y - 11} w={W} h={22}>
              <Stitches pts={pts} c={TEAL} w={r.d * k} sl={0.3} cas={0.8} />
            </ClipBox>
            <BreakV x={x0} y1={y - 10} y2={y + 10} />
            <BreakV x={x0 + W} y1={y - 10} y2={y + 10} />
            <T x={256} y={y + 4} s={12} mono w="600" c={r.c}>
              {r.n}
            </T>
          </g>
        )
      })}

      <Box x={302} y={26} w={164} h={146} title="The set, halved" c={C.brass} tc={C.brass} />
      <Iron n={6} pitch={15} k={0.8} x={318} y={104} />
      <Dim a={[318, 104]} b={[330, 104]} off={6} text="1.5" flip c={C.text} />
      <T x={388} y={84} s={10.5} c={C.text}>
        1.5 mm iron
      </T>
      <Needle x1={312} y1={130} x2={350} y2={130} />
      <T x={356} y={134} s={10} c={C.text}>
        smallest harness
      </T>
      <Thr d="M312 149 L348 149" c={TEAL} w={1.4} cas={0.8} />
      <T x={356} y={152} s={10} c={C.text}>
        linen ≈ 0.25–0.35 mm
      </T>
      <T x={356} y={164} s={10} c={C.faint}>
        a starting point
      </T>

      <ClipBox x={26} y={170} w={260} h={96}>
        <path d={pathOfPlan(TP, oT)} fill="url(#at-navy)" stroke="#121a26" strokeWidth="1" />
        <StrapPlan T={TP} o={oT} face="none" holes={{ xs: holes, d: 1.8 }} />
        <Stitches pts={run[0]} c={TEAL} w={0.3 * 5.4} sl={0.3} cas={0.6} />
      </ClipBox>
      <BreakV x={26} y1={TP.y - 43} y2={TP.y + 43} />
      <path d={`M${h84} ${topY - 6} v-6 H${h90} v6`} fill="none" stroke={C.brass} strokeWidth="1.2" />
      <T x={(h84 + h90) / 2} y={topY - 16} a="middle" s={10.5} c={C.brass} w="600">
        6 mm = 4 stitches
      </T>
      <Dim a={px(TP, 84, 0)} b={px(TP, 90, 0)} off={0} text="" c={C.text} />
      <Dim a={px(TP, 76, -8)} b={px(TP, 76, -6)} text="" c={C.text} />
      <T x={px(TP, 76, 0)[0] - 4} y={px(TP, 76, -7)[1] + 4} a="end" s={10} mono c={C.text}>
        2
      </T>
      <T x={296} y={196} s={10.5} c={C.text}>
        Four micro-stitches per
      </T>
      <T x={296} y={210} s={10.5} c={C.text}>
        6 mm hole pitch, 2 mm in.
      </T>
      <T x={296} y={230} s={10.5} c={C.brass}>
        ≈ 17 SPI: twice the density
      </T>
      <T x={296} y={244} s={10.5} c={C.brass}>
        of a 3 mm seam
      </T>
      <T x={296} y={260} s={10} c={C.faint}>
        sold at nearly twice the price
      </T>

      <Sep x1={14} y1={274} x2={466} y2={274} />
      <SeamBand x0={sx0} p={sp} n={15} y={sy} h={sh} holeW={3.4} breakL breakR vel={2.4} />
      <Thr d={poly(sB)} c={TEAL} w={1.4} cas={0.7} />
      <Thr d={poly(sA)} c={TEAL} w={1.4} cas={0.7} />
      <Ld pts={[[118, sy + sh * 0.6], [128, 330]]} text="keep the full-length Velodon:" s={10.5} />
      <T x={16} y={289} s={10} c={C.faint}>
        section along the seam · holes every 1.5 mm
      </T>
      <T x={30} y={346} s={10} c={C.ruby}>
        at this density the hole line behaves like a perforation
      </T>
      <Tag x={290} y={290}>A dense, fine grain</Tag>
      <rect x={292} y={298} width={80} height={32} rx="2" fill="url(#at-peccary)" stroke="#5c3c1d" strokeWidth="0.6" />
      <rect x={384} y={298} width={80} height={32} rx="2" fill="url(#at-goat)" stroke="#121a26" strokeWidth="0.6" />
      <T x={332} y={344} a="middle" s={10} c={C.text}>
        peccary
      </T>
      <T x={424} y={344} a="middle" s={10} c={C.text}>
        goat
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* 10 · Sewing a micro-stitch                                           */
/* ================================================================== */

function Foot({ a, b, cur }) {
  const ang = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI
  const L = Math.hypot(b[0] - a[0], b[1] - a[1])
  return (
    <g transform={`translate(${a[0]} ${a[1]}) rotate(${ang})`}>
      <rect x={-4} y={-5} width={L + 8} height={10} rx="3" fill={cur ? 'rgba(180,200,212,0.42)' : 'none'} stroke={cur ? '#cfdbe3' : C.steel} strokeWidth={cur ? 1.2 : 0.9} strokeDasharray={cur ? undefined : '3 2'} />
    </g>
  )
}

function MicroWork() {
  // 1 · keyed run, side view ×10
  const sp = 15
  const by = 106
  const holesX = Array.from({ length: 9 }, (_, i) => 36 + i * sp)
  // 2 · twist plan ×8, lateral ×10
  const tx0 = 330
  const tp = 12
  const drift = (i) => i * 1.5 * Math.tan(Math.PI / 180) * 8 * 10
  // 3 · tip with 2-prong iron
  const oT = ALONG()
  const TP = { x: 40 - 98 * 5.6, y: 232, s: 5.6 }
  const ring = seamRuns(TP, oT, 2, 1.5, 98)[0]
  let ia = 0
  ring.forEach((q, i) => {
    if (q[0] > ring[ia][0]) ia = i
  })
  // 4 · tension sections ×12
  const tensRow = (y, bad) => {
    const x0 = 262
    const p = 18
    const n = 11
    const { A, B } = seamPaths({ x0, p, y, h: 20, done: n - 1, r: bad ? -0.6 : 1.8, d: 1.4 })
    return (
      <g>
        <SeamBand x0={x0} p={p} n={n} y={y} h={20} holeW={3} />
        <Thr d={poly(B)} c={TB} w={1.6} cas={0.8} />
        <Thr d={poly(A)} c={TA} w={1.6} cas={0.8} />
        {bad &&
          [4, 6].map((i) => (
            <path key={i} d={`M${x0 + i * p + 3} ${y} L${x0 + i * p + p / 2} ${y + 7} L${x0 + (i + 1) * p - 3} ${y}`} fill={C.ground} stroke={C.ruby} strokeWidth="1.2" strokeLinejoin="round" />
          ))}
      </g>
    )
  }
  return (
    <Fig h={344} view="Sewing 1.5 mm" scale="side ×10 · plans ×8, ×5.6">
      <AtDefs />
      <Box x={14} y={26} w={290} h={130} title="1 · short, keyed runs · side ×10" />
      <Slab x={22} y={by + 16} w={274} h={10} kind="pad" />
      <rect x={24} y={by} width={270} height={10} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />
      <rect x={24} y={by + 10} width={270} height={1.6} fill={C.velodon} />
      <rect x={24} y={by + 11.6} width={270} height={4.4} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.6" />
      {holesX.map((x) => (
        <rect key={x} x={x - 1.2} y={by - 0.5} width={2.4} height={17} fill={C.hole} />
      ))}
      <Iron n={6} pitch={sp} x={holesX[8]} y={by + 18} />
      <Arrow a={[holesX[8] + 66, 54]} b={[holesX[8] + 66, 72]} w={1.4} />
      <T x={holesX[8] + 74} y={66} s={10} c={C.brass}>
        light taps
      </T>
      <Ld pts={[[holesX[8], by + 4], [110, 78]]} x={24} y={68} text="prong 1 stays in" s={10.5} c={C.emerald} />
      <T x={24} y={81} s={10.5} c={C.emerald}>
        the last hole
      </T>
      <circle cx={holesX[8]} cy={by + 8} r="7" fill="none" stroke={C.emerald} strokeWidth="1.2" />
      <T x={24} y={146} s={10} c={C.faint}>
        6-prong 1.5 mm iron, struck in short runs, each keyed
      </T>

      <Box x={312} y={26} w={154} h={130} title="A 1° twist" c={C.ruby} tc={C.ruby} />
      <line x1={tx0 - 6} y1={64} x2={tx0 + 10 * tp + 8} y2={64} stroke={C.steel} strokeWidth="0.9" strokeDasharray="6 3 1.5 3" />
      {Array.from({ length: 11 }, (_, i) => (
        <g key={i}>
          <Slit x={tx0 + i * tp} y={64} len={5} w={1.2} c="rgba(239,232,220,0.3)" />
          <Slit x={tx0 + i * tp} y={64 + drift(i)} len={5} w={1.6} c={i > 6 ? C.ruby : C.text} />
        </g>
      ))}
      <Dim a={[tx0 + 10 * tp + 8, 64]} b={[tx0 + 10 * tp + 8, 64 + drift(10)]} text="" c={C.ruby} />
      <T x={324} y={108} s={10.5} c={C.text}>
        after 10 stitches (15 mm)
      </T>
      <T x={324} y={122} s={10.5} mono c={C.ruby}>
        ≈ 0.26 mm off the line
      </T>
      <T x={324} y={136} s={10} c={C.faint}>
        it shows · drift drawn ×10
      </T>

      <Box x={14} y={164} w={222} h={116} title="2 · round the tip, 2 prongs" />
      <ClipBox x={30} y={182} w={200} h={96}>
        <StrapPlan T={TP} o={oT} />
        {ring.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="1.3" fill={C.hole} />
        ))}
        <Foot a={ring[ia - 3]} b={ring[ia - 2]} />
        <Foot a={ring[ia - 2]} b={ring[ia - 1]} />
        <Foot a={ring[ia - 1]} b={ring[ia]} cur />
      </ClipBox>
      <BreakV x={40} y1={TP.y - 44} y2={TP.y + 44} />
      <Dim a={px(TP, 100, -8)} b={px(TP, 100, -6)} text="" c={C.text} />
      <T x={px(TP, 100, 0)[0] - 4} y={px(TP, 100, -7)[1] + 4} a="end" s={10} mono c={C.text}>
        2
      </T>
      <T x={150} y={202} s={10.5} c={C.text}>
        2-prong iron,
      </T>
      <T x={150} y={215} s={10.5} c={C.text}>
        one prong keyed
      </T>
      <T x={150} y={228} s={10.5} c={C.text}>
        in the last hole
      </T>
      <T x={150} y={248} s={10} c={C.faint}>
        mark a 2 mm
      </T>
      <T x={150} y={261} s={10} c={C.faint}>
        margin first
      </T>

      <Box x={244} y={164} w={222} h={116} title="3 · lighter, even tension" />
      {tensRow(190, false)}
      <Verdict x={258} y={228} ok r={6.5} />
      <T x={270} y={232} s={10.5} c={C.emerald}>
        the same light pull, every stitch
      </T>
      {tensRow(240, true)}
      <Verdict x={258} y={270} ok={false} r={6.5} />
      <T x={270} y={274} s={10.5} c={C.ruby}>
        over-tension cuts between holes
      </T>

      <Box x={14} y={288} w={452} h={52} title="4 · budget · 115 / 75 pair" />
      <T x={24} y={321} s={10} mono c={C.dim}>
        3.0
      </T>
      <rect x={52} y={313} width={80} height={9} rx="2" fill={C.struct} />
      <T x={138} y={321} s={10} mono c={C.dim}>
        ≈ 150
      </T>
      <T x={24} y={335} s={10} mono c={C.brass}>
        1.5
      </T>
      <rect x={52} y={327} width={160} height={9} rx="2" fill={C.brass} />
      <T x={218} y={335} s={10} mono c={C.brass}>
        ≈ 300 · ×2 time
      </T>
      <rect x={322} y={308} width={24} height={26} rx="2" fill="url(#at-navy)" />
      <Stitches pts={[[324, 321], [330, 321], [336, 321], [342, 321], [348, 321]]} c="#4a6080" w={1.3} cas={0.5} />
      <rect x={392} y={308} width={24} height={26} rx="2" fill="url(#at-navy)" />
      <Stitches pts={[[394, 321], [400, 321], [406, 321], [412, 321], [418, 321]]} c={TEAL} w={1.3} cas={0.5} />
      <T x={352} y={318} s={10} c={C.emerald}>
        tonal
      </T>
      <T x={352} y={330} s={10} c={C.faint}>
        first
      </T>
      <T x={420} y={318} s={10} c={C.text}>
        then
      </T>
      <T x={420} y={330} s={10} c={C.faint}>
        contrast
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* 11 · Crease both faces after stitching                               */
/* ================================================================== */

function CreaseBoth() {
  const k = 12
  const xa = 32
  const xb = xa + 18 * k
  const y = 132
  const tt = 13
  const tv = 2.4
  const tl = 9.6
  const H = tt + tv + tl
  const m = 2 * k
  const c1 = 1 * k
  const vt = (x, yy, dir) => `M${x - 4} ${yy} L${x} ${yy + dir * 4} L${x + 4} ${yy}`
  const sec = (
    <g>
      <rect x={xa} y={y} width={xb - xa} height={tt} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <rect x={xa} y={y + tt} width={xb - xa} height={tv} fill={C.velodon} />
      <rect x={xa} y={y + tt + tv} width={xb - xa} height={tl} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.8" />
      {[xa + c1, xb - c1].map((x) => (
        <g key={x}>
          <path d={`M${x - 7} ${y} Q${x} ${y + 9} ${x + 7} ${y} Z`} fill="rgba(60,35,15,0.35)" />
          <path d={vt(x, y, 1)} fill={C.hole} />
          <path d={`M${x - 7} ${y + H} Q${x} ${y + H - 8} ${x + 7} ${y + H} Z`} fill="rgba(90,70,40,0.35)" />
          <path d={vt(x, y + H, -1)} fill={C.hole} />
        </g>
      ))}
      {[xa + m, xb - m].map((x) => (
        <g key={x}>
          <rect x={x - 2} y={y - 0.5} width={4} height={H + 1} fill={C.ground} />
          <line x1={x} y1={y - 2} x2={x} y2={y + H + 2} stroke={TA} strokeWidth="2" />
          <ellipse cx={x} cy={y - 2.2} rx="4.2" ry="2.2" fill={TA} stroke={CASE} strokeWidth="0.7" />
          <ellipse cx={x} cy={y + H + 2.2} rx="4.2" ry="2.2" fill={TA} stroke={CASE} strokeWidth="0.7" />
        </g>
      ))}
    </g>
  )
  const strip = (y0, lining) => {
    const ey = y0
    const pts = Array.from({ length: 14 }, (_, i) => [28 + i * 22, ey + 18])
    return (
      <g>
        <rect x={20} y={ey} width={284} height={30} fill={lining ? 'url(#sk-lin)' : 'url(#sk-top)'} stroke={lining ? C.liningEdge : '#5c3c1d'} strokeWidth="0.6" />
        <line x1={20} y1={ey} x2={304} y2={ey} stroke="#d9b07a" strokeWidth="2" />
        <rect x={20} y={ey + 1} width={284} height={8} fill={lining ? 'rgba(90,70,40,0.18)' : 'rgba(60,35,15,0.3)'} />
        <line x1={20} y1={ey + 9} x2={304} y2={ey + 9} stroke={lining ? '#7d6a48' : '#3a2412'} strokeWidth="1.6" />
        <ClipBox x={20} y={ey} w={284} h={30}>
          <Stitches pts={pts} w={2.4} sl={0.3} cas={0.9} />
        </ClipBox>
        <BreakV x={304} y1={ey} y2={ey + 30} />
      </g>
    )
  }
  const chips = ['stitch', 'crease the face', 'crease the lining', 'then paint the edges']
  return (
    <Fig h={344} view="Section across · both faces" scale="×12 · inset ×2.6 · strips ×9">
      {sec}
      <Creaser hot x={xa + c1} y={y + 3} k={0.64} />
      <Creaser hot x={xb - c1} y={y + H - 3} ang={180} k={0.64} />
      <Num x={xa + c1 + 22} y={64} n={1} />
      <T x={xa + c1 + 36} y={60} s={11} c={C.text}>
        crease the face
      </T>
      <T x={xa + c1 + 36} y={73} s={10} c={C.faint}>
        heated, after stitching
      </T>
      <Num x={xb - c1 - 22} y={214} n={2} />
      <T x={xb - c1 - 36} y={210} a="end" s={11} c={C.text}>
        turn it over: crease the lining
      </T>
      <T x={xb - c1 - 36} y={223} a="end" s={10} c={C.faint}>
        the same line, lining side
      </T>
      <Dim a={[xb - m, y]} b={[xb, y]} off={-12} text="2" flip c={C.text} />
      <Ld pts={[[xb - m, y + H + 4], [xb - m - 20, 176]]} text="seam, 2 mm in" a="end" s={10.5} />
      <Ld pts={[[xb + 1, y + H / 2], [262, 160]]} text="edge, still bare" s={10.5} c={C.dim} />
      <Ld pts={[[120, y + tt + 1], [120, 100]]} text="top · Velodon · lining" a="middle" s={10} c={C.faint} />
      <Ld pts={[[xa + c1, y + H + 1], [64, 186]]} x={24} y={190} text="lining crease" s={10.5} />
      <Ld pts={[[xb - c1, y - 1], [212, 112]]} x={208} y={108} a="end" text="face crease" s={10.5} />
      <Inset src={[xa + 14, y + H / 2]} k={2.6} at={[392, 116]} r={66}>
        {sec}
      </Inset>
      <T x={392} y={200} a="middle" s={10.5} c={C.text}>
        crease between seam and edge,
      </T>
      <T x={392} y={213} a="middle" s={10.5} c={C.text}>
        on the face and on the lining
      </T>

      <Sep x1={14} y1={234} x2={466} y2={234} />
      <Tag x={20} y={252}>Face</Tag>
      {strip(260, false)}
      <Tag x={20} y={306}>Lining</Tag>
      {strip(312, true)}
      {chips.map((t, i) => (
        <g key={t}>
          <rect x={322} y={248 + i * 24} width={144} height={18} rx="9" fill="rgba(255,255,255,0.03)" stroke={i === 1 || i === 2 ? C.brass : C.line} />
          <T x={394} y={261 + i * 24} a="middle" s={10.5} c={i === 1 || i === 2 ? C.brass : C.text}>
            {t}
          </T>
          {i < 3 && <path d={`M394 ${267 + i * 24} v4`} stroke={C.dim} strokeWidth="1" />}
        </g>
      ))}
    </Fig>
  )
}

/* ================================================================== */
/* 12 · Build the keepers like small straps                             */
/* ================================================================== */

function KeepersMini() {
  const kk = 24
  const cx = 122
  const ky = 76
  const ktT = 16
  const ktL = 10
  const half = (5 * kk) / 2
  // plan keeper on a short piece
  const KP = ({ TP, x, fill, edge }) => {
    const [x1, y1] = px(TP, x - 2.5, -9)
    const W = 5 * TP.s
    const H = 18 * TP.s
    return (
      <g>
        <rect x={x1} y={y1} width={W} height={H} rx="2" fill={fill} stroke={edge} strokeWidth="1.6" />
        <line x1={x1 + 2.6} y1={y1 + 2} x2={x1 + 2.6} y2={y1 + H - 2} stroke="rgba(0,0,0,0.45)" strokeWidth="0.9" />
        <line x1={x1 + W - 2.6} y1={y1 + 2} x2={x1 + W - 2.6} y2={y1 + H - 2} stroke="rgba(0,0,0,0.45)" strokeWidth="0.9" />
      </g>
    )
  }
  const pair = (bx, strapFill, keeperFill, keeperEdge) => {
    const TP = { x: bx - 40 * 3.2, y: 268, s: 3.2 }
    const o = ASHORT({ x0: 30 })
    const runs = seamRuns(TP, o, 2, 2.45, 40, 71)
    return (
      <g>
        <ClipBox x={bx} y={220} w={200} h={100}>
          <StrapPlan T={TP} o={o} face={strapFill === 'navy' ? 'none' : 'grain'} />
          {strapFill === 'navy' && <path d={pathOfPlan(TP, o)} fill="url(#at-navy)" stroke="#121a26" strokeWidth="1" />}
          {runs.map((r, i) => (
            <Stitches key={i} pts={r} w={1.1} sl={0.3} cas={0.6} c={strapFill === 'navy' ? '#c9d2de' : TA} />
          ))}
        </ClipBox>
        <BreakV x={bx} y1={TP.y - 30} y2={TP.y + 30} />
        <KP TP={TP} x={57} fill={keeperFill} edge={keeperEdge} />
        <KP TP={TP} x={66} fill={keeperFill} edge={keeperEdge} />
        <Buckle x={px(TP, 75, 0)[0]} y={TP.y} w={16 * 3.2} L={36} />
        <Dim a={px(TP, 63.5, -9)} b={px(TP, 68.5, -9)} off={-6} text="" c={C.text} />
        <T x={px(TP, 66, 0)[0]} y={px(TP, 66, -9)[1] - 12} a="middle" s={10} mono c={C.text}>
          5
        </T>
        <Dim a={px(TP, 54.5, -9)} b={px(TP, 59.5, -9)} off={-6} text="" c={C.text} />
        <T x={px(TP, 57, 0)[0]} y={px(TP, 57, -9)[1] - 12} a="middle" s={10} mono c={C.text}>
          5
        </T>
      </g>
    )
  }
  return (
    <Fig h={344} view="Keeper · section & plans" scale="×24 · ×4.8 · plans ×3.2">
      <AtDefs />
      <Box x={14} y={26} w={216} h={150} title="Keeper section · ×24" />
      <XSec cx={cx} y={ky} w={5 * kk} layers={[{ k: 'top', t: ktT }, { k: 'lining', t: ktL }]} edge="paint" b={4} coat={3} />
      <GlueLine x1={cx - half + 6} x2={cx + half - 6} y={ky + ktT} />
      {[-1, 1].map((sg) => {
        const x = cx + sg * (half - 14)
        return (
          <g key={sg}>
            <path d={`M${x - 7} ${ky} Q${x} ${ky + 9} ${x + 7} ${ky} Z`} fill="rgba(60,35,15,0.4)" />
            <path d={`M${x - 4} ${ky} L${x} ${ky + 5} L${x + 4} ${ky}`} fill={C.hole} />
          </g>
        )
      })}
      <Dim a={[cx - half, ky + ktT + ktL]} b={[cx + half, ky + ktT + ktL]} off={14} text="5" flip c={C.text} />
      <Ld pts={[[cx - half + 14, ky + 2], [44, 56]]} x={24} y={56} text="heated crease, both edges" s={10.5} />
      <Ld pts={[[cx + half + 2, ky + ktT], [206, 136]]} x={214} y={152} text="painted edges" a="end" s={10.5} c={C.brass} />
      <Ld pts={[[cx - 30, ky + ktT], [60, 136]]} x={24} y={152} text="top + lining, glued" s={10.5} />

      <Box x={238} y={26} w={228} h={150} title="Built flat, like a strap" />
      {(() => {
        const x0 = 254
        const y0 = 74
        const L = 196
        const W = 24
        return (
          <g>
            <rect x={x0} y={y0} width={L} height={W} fill="url(#sk-top)" />
            <line x1={x0} y1={y0} x2={x0 + L} y2={y0} stroke={C.paint} strokeWidth="2.4" />
            <line x1={x0} y1={y0 + W} x2={x0 + L} y2={y0 + W} stroke={C.paint} strokeWidth="2.4" />
            <line x1={x0} y1={y0 + 3.5} x2={x0 + L} y2={y0 + 3.5} stroke="#3a2412" strokeWidth="1.2" />
            <line x1={x0} y1={y0 + W - 3.5} x2={x0 + L} y2={y0 + W - 3.5} stroke="#3a2412" strokeWidth="1.2" />
            <Stitches pts={Array.from({ length: 17 }, (_, i) => [x0 + 4 + i * 11.75, y0 + W / 2])} w={1.4} sl={0.3} cas={0.6} op={0.8} />
            <path d={`M${x0} ${y0} v${W}`} stroke="#e9cf9f" strokeWidth="1.2" />
            <path d={`M${x0 + L} ${y0} v${W}`} stroke="#e9cf9f" strokeWidth="1.2" />
            <Ld pts={[[x0 + 150, y0], [x0 + 150, 58]]} text="painted long edges" a="middle" s={10.5} c={C.brass} />
            <Ld pts={[[x0 + 40, y0 + W - 3.5], [x0 + 40, 128]]} text="crease near each edge" a="middle" s={10.5} />
            <Ld pts={[[x0 + 150, y0 + W / 2], [x0 + 176, 146]]} x={x0 + 196} y={157} a="end" text="own stitch row, optional" s={10} c={C.dim} />
            <T x={x0} y={171} s={10} c={C.faint}>
              ends: into the joint, or under the flap
            </T>
          </g>
        )
      })()}

      <Box x={14} y={184} w={452} h={156} title="The pair · about 5 mm each" />
      {pair(30, 'grain', 'url(#sk-dark)', C.paint)}
      {pair(262, 'navy', 'url(#sk-top)', '#5c2f12')}
      <T x={30} y={318} s={10.5} c={C.text}>
        fixed keeper just behind the buckle,
      </T>
      <T x={30} y={332} s={10} c={C.faint}>
        floating keeper beside it
      </T>
      <T x={262} y={318} s={10.5} c={C.brass}>
        or a contrasting leather:
      </T>
      <T x={262} y={332} s={10} c={C.faint}>
        a quiet signature, nowhere else
      </T>
    </Fig>
  )
}
// closed plan outline path for a piece (local, for custom fills)
const pathOfPlan = (TP, o) => outline(o).map(([x, y], i) => `${i ? 'L' : 'M'}${px(TP, x, y).map((v) => v.toFixed(1)).join(' ')}`).join(' ') + ' Z'

/* ================================================================== */
/* 13 · Hand or machine? Read the underside                             */
/* ================================================================== */

function ReadSeam() {
  const yb0 = 80
  const tt = 20
  const tl = 16
  const H = tt + tl
  const band = (cx) => (
    <g>
      <Ply x1={cx - 100} x2={cx + 100} y={yb0} t={tt} k="dark" />
      <Ply x1={cx - 100} x2={cx + 100} y={yb0 + tt} t={tl} k="lining" cut="top" />
      <BreakV x={cx - 100} y1={yb0} y2={yb0 + H} />
      <BreakV x={cx + 100} y1={yb0} y2={yb0 + H} />
    </g>
  )
  const hx = (cx) => [cx - 75, cx - 25, cx + 25, cx + 75]
  // saddle (one white thread, two needles)
  const cs = 120
  const sp = seamPaths({ x0: cs - 125, p: 50, y: yb0, h: H, done: 4, r: 2.6, d: 3 })
  // lockstitch
  const cl = 356
  const ym = yb0 + H / 2
  const yt = yb0 - 2.4
  const ybt = yb0 + H + 2.4
  const needle = (() => {
    let d = `M${cl - 100} ${yt}`
    hx(cl).forEach((x) => {
      d += ` L${x - 4} ${yt} L${x - 4} ${ym + 2} Q${x} ${ym + 11} ${x + 4} ${ym + 2} L${x + 4} ${yt}`
    })
    return d + ` L${cl + 100} ${yt}`
  })()
  const bobbin = (() => {
    let d = `M${cl - 100} ${ybt}`
    hx(cl).forEach((x) => {
      d += ` L${x - 1.8} ${ybt} L${x - 1.8} ${ym} Q${x} ${ym - 9} ${x + 1.8} ${ym} L${x + 1.8} ${ybt}`
    })
    return d + ` L${cl + 100} ${ybt}`
  })()
  const face = (cx, y, lining, col, straight) => {
    const pts = Array.from({ length: 10 }, (_, i) => [cx - 96 + i * 22, y])
    return (
      <g>
        <rect x={cx - 100} y={y - 12} width={200} height={24} fill={lining ? 'url(#sk-lin)' : 'url(#sk-dark)'} stroke={lining ? C.liningEdge : '#2e1e10'} strokeWidth="0.6" />
        <ClipBox x={cx - 100} y={y - 12} w={200} h={24}>
          <Stitches pts={pts} c={col} w={2.4} sl={straight ? 0 : 0.32} straight={straight} cas={0.9} />
        </ClipBox>
      </g>
    )
  }
  return (
    <Fig h={344} view="Section & faces · read it" scale="sections ×5 · strips ×4">
      <Tag x={20} y={44}>Hand · saddle stitch</Tag>
      <Tag x={256} y={44}>Machine · lockstitch</Tag>
      <Sep x1={240} y1={30} x2={240} y2={248} />

      {band(cs)}
      {hx(cs).map((x) => (
        <rect key={x} x={x - 3.5} y={yb0 - 0.6} width={7} height={H + 1.2} fill={C.ground} stroke="#5c4128" strokeWidth="0.5" />
      ))}
      <ClipBox x={cs - 100} y={yb0 - 20} w={200} h={H + 40}>
        <Thr d={poly([...sp.B, [cs + 106, sp.yb]])} c={TA} w={2.4} />
        <Thr d={poly([...sp.A, [cs + 106, sp.yt]])} c={TA} w={2.4} />
      </ClipBox>
      <T x={cs} y={64} a="middle" s={10.5} c={C.text}>
        one thread, a needle on each end:
      </T>
      <T x={cs} y={136} a="middle" s={10} c={C.faint}>
        it crosses itself in every hole
      </T>

      {band(cl)}
      {hx(cl).map((x) => (
        <rect key={x} x={x - 3.5} y={yb0 - 0.6} width={7} height={H + 1.2} fill={C.ground} stroke="#5c4128" strokeWidth="0.5" />
      ))}
      <Thr d={bobbin} c={TAN_T} w={2.2} />
      <Thr d={needle} c={TA} w={2.2} />
      {hx(cl).map((x) => (
        <Thr key={x} d={`M${x + 1.8} ${ym + 9} L${x + 1.8} ${ym + 1}`} c={TAN_T} w={2.2} cap="butt" />
      ))}
      <circle cx={cl + 25} cy={ym + 1} r="10" fill="none" stroke={C.emerald} strokeWidth="1.2" />
      <T x={cl} y={64} a="middle" s={10.5} c={C.text}>
        white needle thread on top,
      </T>
      <T x={cl} y={136} a="middle" s={10} c={C.faint}>
        tan bobbin thread below; the two
      </T>
      <T x={cl} y={149} a="middle" s={10} c={C.emerald}>
        lock mid-stack (ringed)
      </T>

      <Tag x={20} y={168}>face</Tag>
      {face(cs, 182, false, TA)}
      <Tag x={20} y={210}>underside</Tag>
      {face(cs, 224, true, TA)}
      <Tag x={256} y={168}>face</Tag>
      {face(cl, 182, false, TA, true)}
      <Tag x={256} y={210}>underside</Tag>
      {face(cl, 224, true, TAN_T, true)}
      <T x={cs + 100} y={168} a="end" s={10} c={C.faint}>
        slanted
      </T>
      <T x={cl + 100} y={168} a="end" s={10} c={C.faint}>
        straight, in line
      </T>

      <Sep x1={14} y1={252} x2={466} y2={252} />
      {[
        [20, TA, TA],
        [256, TA, TAN_T],
      ].map(([x, a, b]) => (
        <g key={x}>
          <rect x={x} y={264} width={16} height={9} rx="1.5" fill="url(#sk-dark)" />
          <line x1={x + 3} y1={268.5} x2={x + 13} y2={268.5} stroke={a} strokeWidth="2" />
          <rect x={x} y={275} width={16} height={9} rx="1.5" fill="url(#sk-lin)" />
          <line x1={x + 3} y1={279.5} x2={x + 13} y2={279.5} stroke={b} strokeWidth="2" />
        </g>
      ))}
      <T x={44} y={278} s={11} c={C.emerald}>
        same colour on both faces
      </T>
      <T x={280} y={278} s={11} c={C.text}>
        white face over a tan underside
      </T>
      <T x={20} y={298} s={10} c={C.faint}>
        a contrast face by hand shows on the lining too
      </T>
      <T x={256} y={298} s={10} c={C.faint}>
        two threads, one per face
      </T>
      <path d="M198 318 q14 -14 28 0" fill="none" stroke={C.brass} strokeWidth="1.6" markerEnd="url(#sk-a-brass)" />
      <T x={20} y={322} s={11} c={C.text}>
        Turn a commercial strap over:
      </T>
      <T x={20} y={337} s={10.5} c={C.dim}>
        a white face over a tan back was sewn on a lockstitch machine.
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* 14 · Check at three points, not one                                  */
/* ================================================================== */

function ThreeQC() {
  const gates = [146, 286, 426]
  const card = (x, title, items, c) => (
    <g>
      <Box x={x} y={108} w={146} h={196} title={title} c={c} tc={c} />
      {items.map((t, i) => (
        <g key={t}>
          <path d={`M${x + 10} ${242 + i * 15} l3 3 l6 -7`} fill="none" stroke={C.emerald} strokeWidth="1.4" strokeLinecap="round" />
          <T x={x + 24} y={245 + i * 15} s={10.5} c={C.text}>
            {t}
          </T>
        </g>
      ))}
    </g>
  )
  return (
    <Fig h={344} view="Sequence · three checkpoints in the build" scale="schematic">
      <line x1={24} y1={74} x2={452} y2={74} stroke={C.struct} strokeWidth="1.5" markerEnd="url(#sk-a-dim)" />
      {[
        [80, 'laminate · cut · prick'],
        [216, 'stitch · crease · paint'],
        [356, 'keepers · holes · bars'],
      ].map(([x, t]) => (
        <T key={x} x={x} y={62} a="middle" s={10.5} c={C.dim}>
          {t}
        </T>
      ))}
      {gates.map((gx, i) => (
        <g key={gx}>
          <rect x={gx - 9} y={65} width={18} height={18} transform={`rotate(45 ${gx} 74)`} fill={C.ground} stroke={C.emerald} strokeWidth="1.6" />
          <T x={gx} y={78} a="middle" s={11} c={C.emerald} w="700">
            {i + 1}
          </T>
          <T x={gx} y={100} a="middle" s={10} mono c={C.emerald}>
            QC {i + 1}
          </T>
        </g>
      ))}
      <T x={466} y={44} a="end" s={10} c={C.faint}>
        then measure against the order
      </T>
      <path d="M452 50 V66" stroke={C.dim} strokeWidth="0.8" />

      {card(14, 'Before stitching', ['thickness 2.5 → 1.8', 'shape vs template', 'dimensions', 'springback'], C.emerald)}
      {/* springback test */}
      <path d="M24 178 L54 178 Q72 178 72 161 Q72 144 54 144 L36 144" fill="none" stroke="#4a3018" strokeWidth="9.5" strokeLinecap="round" />
      <path d="M24 178 L54 178 Q72 178 72 161 Q72 144 54 144 L36 144" fill="none" stroke={C.top} strokeWidth="8" strokeLinecap="round" />
      <Arrow d="M80 146 q8 10 0 26" w={1.4} />
      <T x={48} y={200} a="middle" s={10} c={C.dim}>
        bend it
      </T>
      <path d="M98 172 L150 172" fill="none" stroke="#4a3018" strokeWidth="9.5" strokeLinecap="round" />
      <path d="M98 172 L150 172" fill="none" stroke={C.top} strokeWidth="8" strokeLinecap="round" />
      <path d="M98 172 Q132 170 142 140" fill="none" stroke={C.dim} strokeWidth="1" strokeDasharray="3 2" />
      <Arrow d="M148 140 q6 12 2 24" c="emerald" w={1.3} />
      <T x={124} y={194} a="middle" s={10} c={C.emerald}>
        let go: it
      </T>
      <T x={124} y={207} a="middle" s={10} c={C.emerald}>
        springs back
      </T>
      <T x={22} y={226} s={10} c={C.ruby}>
        stays bent: no body
      </T>

      {card(166, 'After the edges', ['stitch line even', 'thread colour', 'paint: smooth, sealed'], C.emerald)}
      <rect x={176} y={136} width={126} height={44} fill="url(#sk-top)" />
      <line x1={176} y1={136} x2={302} y2={136} stroke={C.paint} strokeWidth="3" />
      <Stitches pts={Array.from({ length: 11 }, (_, i) => [180 + i * 12.6, 152])} w={1.6} cas={0.7} />
      <circle cx={256} cy={146} r="15" fill="none" stroke={C.brass} strokeWidth="1.3" />
      <line x1={267} y1={157} x2={280} y2={170} stroke={C.brass} strokeWidth="2.4" strokeLinecap="round" />
      <T x={176} y={200} s={10} c={C.faint}>
        under a loupe, both faces
      </T>

      {card(318, 'After hardware', ['bars seated, pins equal', 'spring tension', 'buckle: tongue swings'], C.emerald)}
      <SpringBar x={344} y1={136} y2={194} r={3} />
      <Arrow a={[358, 130]} b={[358, 148]} w={1.3} />
      <Arrow a={[358, 202]} b={[358, 184]} w={1.3} />
      <T x={366} y={138} s={10} c={C.dim}>
        press, release:
      </T>
      <T x={366} y={151} s={10} c={C.dim}>
        snaps back
      </T>
      <Buckle x={392} y={180} w={30} L={34} />

      <Sep x1={14} y1={312} x2={466} y2={312} />
      <rect x={20} y={322} width={30} height={10} rx="2" fill={C.emerald} />
      <T x={56} y={331} s={10.5} c={C.emerald}>
        found before stitching: minutes
      </T>
      <rect x={236} y={322} width={110} height={10} rx="2" fill={C.ruby} />
      <T x={352} y={331} s={10.5} c={C.ruby}>
        after: the strap
      </T>
    </Fig>
  )
}

export const FIGS = {
  'at-spec': Spec,
  'at-grades': Grades,
  'at-iron': IronMatch,
  'at-margin': Margin,
  'at-thickness': Thickness,
  'at-lugstart': LugStart,
  'at-buckle': BuckleLock,
  'at-backstitch': BackTwice,
  'at-micro': Micro,
  'at-micro-work': MicroWork,
  'at-crease': CreaseBoth,
  'at-keepers': KeepersMini,
  'at-read': ReadSeam,
  'at-qc': ThreeQC,
}
