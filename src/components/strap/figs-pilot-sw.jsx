// Strap diagrams — pilot strap (notched taper, square tail, box stitching)
// and smartwatch adapter straps (spring-bar and fixed adapters).
// See AUTHORING.md.
//
// Pilot: 20 → 16 mm, full lug width for 26 mm (1.3 × W) below the fold, a
// concave shoulder (≈8 mm, house), parallel 16 mm body, square tail with
// r ≈ 2 corners (house); lengths as the classic build (120 / 80). Dark waxed
// top, bold ecru thread.
// Smartwatch: generic adapters only — a slider with ears and its own spring
// bar, or a slider with the bar built in. Maker standards: 2.5 → 1.8 mm
// (Ultra 3.0 → 2.0), tapers 20→16 22→18 24→18 26→20, lengths 105/65 115/75
// 125/85 (Ultra 100/60 110/70 120/80).
import { useId } from 'react'
import { C, Fig, T, Note, Lead, Dim, Arrow, Num, Verdict, Tag, Sep, Legend } from './kit.jsx'
import { StrapPlan, Ply, Wrap, BarEnd, XSec, Buckle } from './parts.jsx'
import { LONG, outline, offset, pathOf, px, widthAt, holeXs, runBetween, resample } from './geom.js'
import * as Tl from './tools.jsx'

/* ------------------------------------------------------------------ */
/* Local helpers                                                        */
/* ------------------------------------------------------------------ */
const uid = () => useId().replace(/[^a-zA-Z0-9]/g, '')
const P = (M, x, y) => px(M, x, y)
const pts = (a) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
const LEDGE = '#4a3018'
const LINEDGE = '#8f7b5a'
const STEEL_EDGE = '#3b4850'
const ECRU = C.thread

// Break mark across a piece that continues.
const Brk = ({ x, y, h }) => (
  <path d={`M${x - 3} ${y - 3} l6 ${(h + 6) * 0.3} l-6 ${(h + 6) * 0.4} l6 ${(h + 6) * 0.3}`} fill="none" stroke={C.dim} strokeWidth="1" />
)

function ClipRect({ x, y, w, h, children }) {
  const id = uid()
  return (
    <g>
      <clipPath id={`pr${id}`}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#pr${id})`}>{children}</g>
    </g>
  )
}
function ClipPath({ d, children }) {
  const id = uid()
  return (
    <g>
      <clipPath id={`pp${id}`}>
        <path d={d} />
      </clipPath>
      <g clipPath={`url(#pp${id})`}>{children}</g>
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

// Magnified callout: a ring round `at`, a connector, and a circular window at
// `c` whose contents the caller draws in absolute coordinates.
function Inset({ at, r0 = 9, c, R, children, label, ly, lc = C.brass }) {
  const id = uid()
  const dx = c[0] - at[0]
  const dy = c[1] - at[1]
  const L = Math.hypot(dx, dy) || 1
  const ux = dx / L
  const uy = dy / L
  return (
    <g>
      {at && <circle cx={at[0]} cy={at[1]} r={r0} fill="none" stroke={C.brass} strokeWidth="1" strokeDasharray="3 2" />}
      {at && <line x1={at[0] + ux * r0} y1={at[1] + uy * r0} x2={c[0] - ux * R} y2={c[1] - uy * R} stroke={C.brass} strokeWidth="0.8" strokeDasharray="3 2" />}
      <clipPath id={`pi${id}`}>
        <circle cx={c[0]} cy={c[1]} r={R} />
      </clipPath>
      <circle cx={c[0]} cy={c[1]} r={R} fill="#120f0c" />
      <g clipPath={`url(#pi${id})`}>{children}</g>
      <circle cx={c[0]} cy={c[1]} r={R} fill="none" stroke={C.brass} strokeWidth="1.2" />
      {label && (
        <Tag x={c[0]} y={ly ?? c[1] + R + 13} a="middle" c={lc}>
          {label}
        </Tag>
      )}
    </g>
  )
}

/* ---- pilot outline ------------------------------------------------ */
// Half-width at x (mm): full lug width to `full`, a concave shoulder of
// length `sh` (steep at first, flattening into the body), then parallel.
const PIL = { w0: 20, w1: 16, full: 26, sh: 8 }
function pilotHW(x, o) {
  if (x <= o.full) return o.w0 / 2
  if (x >= o.full + o.sh) return o.w1 / 2
  const u = (x - o.full) / o.sh
  return o.w0 / 2 - ((o.w0 - o.w1) / 2) * (1 - (1 - u) * (1 - u))
}
// Closed outline: o = { x0, x1, w0, w1, full, sh, rc } — rc = tail corner
// radius (0 = sharp square end). soft = smoothing (mm) of the shoulder's
// upper corner for the cut line; seams use the sharp version.
function pilotPts(o, soft = 0.7) {
  const rc = o.rc || 0
  const hw = (x) =>
    soft ? (pilotHW(x - soft, o) + pilotHW(x - soft / 2, o) + pilotHW(x, o) + pilotHW(x + soft / 2, o) + pilotHW(x + soft, o)) / 5 : pilotHW(x, o)
  const xe = o.x1 - rc
  const n = Math.ceil((xe - o.x0) / 0.5)
  const top = []
  for (let i = 0; i <= n; i++) {
    const x = o.x0 + ((xe - o.x0) * i) / n
    top.push([x, -hw(x)])
  }
  if (rc > 0)
    for (let i = 1; i <= 10; i++) {
      const a = -Math.PI / 2 + ((Math.PI / 2) * i) / 10
      top.push([xe + rc * Math.cos(a), -o.w1 / 2 + rc + rc * Math.sin(a)])
    }
  const bottom = top
    .slice()
    .reverse()
    .map(([x, y]) => [x, -y])
  return [...top, ...bottom]
}
// Side-seam runs (upper, lower) at margin m between x = from and to.
function sideRuns(o, m = 3, from = 4, to) {
  const sharp = pilotPts({ ...o, rc: 0 }, 0)
  return runBetween(offset(sharp, m), from, to ?? o.x1 - m)
}

const FACE = {
  grain: ['url(#sk-top)', '#5c3c1d'],
  dark: ['url(#sk-dark)', '#2e1e10'],
  lining: ['url(#sk-lin)', C.liningEdge],
  card: ['rgba(226,214,190,0.10)', C.struct],
  wax: ['url(#ps-wax)', '#1b120a'],
}
// A plan piece from a point list (mm).
function Piece({ M, p, face = 'grain', edge, ew = 1.4, dash, op, children }) {
  const d = pathOf(p, M)
  const [fill, stroke] = FACE[face] || FACE.grain
  return (
    <g opacity={op}>
      <path d={d} fill={fill} stroke={edge || stroke} strokeWidth={edge ? ew : 1} strokeDasharray={dash} strokeLinejoin="round" />
      {children && <ClipPath d={d}>{children}</ClipPath>}
    </g>
  )
}
const CLine = ({ M, x0, x1 }) => (
  <line x1={P(M, x0, 0)[0]} y1={M.y} x2={P(M, x1, 0)[0]} y2={M.y} stroke={C.steel} strokeWidth="0.8" strokeDasharray="10 3 2 3" opacity="0.85" />
)
function FoldLine({ M, x, h, label, below, c = C.text, lc }) {
  const [fx, ya] = P(M, x, -h - 2.5)
  const [, yb] = P(M, x, h + 2.5)
  return (
    <g>
      <line x1={fx} y1={ya} x2={fx} y2={yb} stroke={c} strokeWidth="1" strokeDasharray="4 3" />
      {label && (
        <T x={fx} y={below ? yb + 12 : ya - 5} a="middle" s={10} c={lc || C.dim}>
          {label}
        </T>
      )}
    </g>
  )
}
function HoleRow({ M, xs, d = 1.8, c = C.hole }) {
  return (
    <g>
      {xs.map((x) => {
        const [cx, cy] = P(M, x, 0)
        return <circle key={x} cx={cx} cy={cy} r={(d / 2) * M.s} fill={c} stroke="#e7c48f" strokeWidth="0.6" />
      })}
    </g>
  )
}

// Saddle stitches (or pricked slits) along an open polyline in mm.
// mode 'stitch' | 'holes' | 'line'. Each run is resampled on its own, so a
// run's end points are always holes (corners are shared with the next run).
function Seam({ M, run, p = 3, mode = 'stitch', c, w = 1.7, sl = 0.65 }) {
  if (mode === 'line') return <path d={pathOf(run, M, false)} fill="none" stroke={c || C.text} strokeWidth="0.9" strokeDasharray="1.5 2.5" opacity="0.9" />
  const st = resample(run, p)
  return (
    <g>
      {st.map(({ p: q, tan }, i) => {
        const [x, y] = P(M, q[0], q[1])
        if (mode === 'holes') {
          const a = Math.atan2(tan[1], tan[0]) + 0.8
          const l = sl * M.s
          return <line key={i} x1={x - Math.cos(a) * l} y1={y - Math.sin(a) * l} x2={x + Math.cos(a) * l} y2={y + Math.sin(a) * l} stroke={c || C.hole} strokeWidth="1.4" strokeLinecap="round" />
        }
        const nxt = st[i + 1]
        if (!nxt) return null
        const [x2, y2] = P(M, nxt.p[0], nxt.p[1])
        const nx = -tan[1] * 0.42 * M.s
        const ny = tan[0] * 0.42 * M.s
        const ax = x + (x2 - x) * 0.14
        const ay = y + (y2 - y) * 0.14
        const bx = x + (x2 - x) * 0.86
        const by = y + (y2 - y) * 0.86
        return <line key={i} x1={ax - nx} y1={ay - ny} x2={bx + nx} y2={by + ny} stroke={c || ECRU} strokeWidth={w} strokeLinecap="round" />
      })}
    </g>
  )
}
// Transverse row across a pilot piece at x, margin m.
const rowRun = (o, x, m = 3) => {
  const h = pilotHW(x, o) - m
  return [
    [x, -h],
    [x, h],
  ]
}
// The tail trapezoid (open polylines): base row, legs + end row.
const TRAP = { base: 14, end: 3, endHalf: 2.5 } // mm from the tail end (house)
function trapRuns(o, m = 3) {
  const xb = o.x1 - TRAP.base
  const xe = o.x1 - TRAP.end
  const hb = o.w1 / 2 - m
  const he = TRAP.endHalf
  return {
    base: [
      [xb, -hb],
      [xb, hb],
    ],
    legA: [
      [xb, -hb],
      [xe, -he],
    ],
    end: [
      [xe, -he],
      [xe, he],
    ],
    legB: [
      [xe, he],
      [xb, hb],
    ],
    xb,
    xe,
    hb,
    he,
  }
}

// Local defs: dark waxed (pull-up) leather, its lighter pull-up, ecru.
function PsDefs() {
  return (
    <defs>
      <linearGradient id="ps-wax" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4b3a2c" />
        <stop offset="0.5" stopColor="#3a2b1f" />
        <stop offset="1" stopColor="#2a1f16" />
      </linearGradient>
      <linearGradient id="ps-waxS" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2c2016" />
        <stop offset="0.2" stopColor="#4a3828" />
        <stop offset="1" stopColor="#6f5641" />
      </linearGradient>
      <radialGradient id="ps-pull" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#a98a63" stopOpacity="0.85" />
        <stop offset="1" stopColor="#a98a63" stopOpacity="0" />
      </radialGradient>
      <pattern id="ps-hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="4" height="4" fill="url(#sk-steel)" />
        <line x1="0" y1="0" x2="0" y2="4" stroke="#5f717d" strokeWidth="0.9" />
      </pattern>
    </defs>
  )
}

/* ---- fold sections ------------------------------------------------- */
// Concealed lug fold in section (classic): top round a bar at (cx, cy),
// channel radius r, top t, tail returning under the body (cv convergence,
// feathered to nothing at tailEnd px), lining under it to xR.
function FoldSec({ cx, cy, r, t, tl, xR, cv, tailEnd, ts, k = 'top', lk = 'lining', bar = true, barR }) {
  const y1 = cy - r
  const tailT = (x) => (x < cx + cv ? ts : x > tailEnd ? 0 : ts * (1 - (x - cx - cv) / (tailEnd - cx - cv)))
  const la = cx + cv + 1
  const N = 40
  const topPts = []
  for (let i = 0; i <= N; i++) {
    const x = la + ((xR - la) * i) / N
    topPts.push([x, y1 + tailT(x)])
  }
  const fe = Math.min(40, (xR - la) * 0.3)
  const thick = (x) => Math.max(tl * 0.25, Math.min(tl, tl * (0.25 + (0.75 * (x - la)) / fe)))
  const bot = topPts.map(([x, yy]) => [x, yy + thick(x)]).reverse()
  return (
    <g>
      <Wrap cx={cx} cy={cy} r={r} t={t} xR={cx} conv={cv} tail={tailEnd - cx - cv} ts={ts} k={k} />
      <Ply x1={cx} x2={xR} y={y1 - t} t={t} k={k} open="lr" />
      <polygon points={pts([...topPts, ...bot])} fill={lk === 'lining' ? 'url(#sk-linS)' : 'url(#sk-topS)'} stroke={LINEDGE} strokeWidth="0.8" strokeLinejoin="round" />
      {bar && <BarEnd cx={cx} cy={cy} r={barR ?? r * 0.9} />}
    </g>
  )
}
// Vertical thread pass through a section (x, from y1 to y2), with the
// stitch lying on both faces.
function Pass({ x, y1, y2, c = ECRU, w = 1.6, run = 5 }) {
  return (
    <g stroke={c} strokeLinecap="round">
      <line x1={x} y1={y1 - 1.5} x2={x} y2={y2 + 1.5} strokeWidth={w} />
      <line x1={x - run} y1={y1 - 1.5} x2={x + run} y2={y1 - 1.5} strokeWidth={w + 0.4} opacity="0.75" />
      <line x1={x - run} y1={y2 + 1.5} x2={x + run} y2={y2 + 1.5} strokeWidth={w + 0.4} opacity="0.75" />
    </g>
  )
}

/* ================================================================== */
/* Pilot strap                                                         */
/* ================================================================== */
const PL = { ...PIL, x0: -20, x1: 120, rc: 2 } // long piece, lug flap open
const PS = { ...PIL, x0: -20, x1: 105, rc: 0 } // short piece, both flaps open
const PLF = { ...PIL, x0: -2.4, x1: 120, rc: 2 } // long piece, folded (fold edge at −2.4)

/* 1 · Pattern the notch */
function PiPattern() {
  const s = 2.55
  const ML = { x: 92, y: 92, s }
  const MS = { x: 92, y: 228, s }
  const hx = holeXs(120)
  const lp = pilotPts(PL)
  const sp = pilotPts(PS)
  const zone = (M, o) => {
    const [x1, y1] = P(M, 0, -12)
    const [x2] = P(M, o.full, 0)
    return <rect x={x1} y={y1} width={x2 - x1} height={24 * M.s} fill="rgba(208,168,79,0.20)" />
  }
  const [slx, sly] = P(MS, 80, 0)
  return (
    <Fig h={340} view="Plan · both patterns, unfolded" scale="20 → 16 · 120 / 80">
      {/* long */}
      <Piece M={ML} p={lp} face="card">
        {zone(ML, PL)}
      </Piece>
      <CLine M={ML} x0={-23} x1={123} />
      <FoldLine M={ML} x={0} h={10} />
      <HoleRow M={ML} xs={hx} />
      <Dim a={P(ML, -20, -10)} b={P(ML, 0, -10)} off={-12} text="20" flip />
      <Dim a={P(ML, 0, -10)} b={P(ML, 26, -10)} off={-12} text="26" flip />
      <Dim a={P(ML, 26, -10)} b={P(ML, 34, -10)} off={-12} />
      <T x={P(ML, 30, 0)[0] + 13} y={P(ML, 0, -10)[1] - 15} s={10} mono>
        ≈8
      </T>
      <Dim a={P(ML, 0, -10)} b={P(ML, 120, -10)} off={-28} text="120" flip />
      <Dim a={P(ML, -20, -10)} b={P(ML, -20, 10)} off={10} text="20" />
      <Dim a={P(ML, 120, -8)} b={P(ML, 120, 8)} off={-10} text="16" />
      <T x={P(ML, 0, 0)[0]} y={P(ML, 0, 12.5)[1] + 12} a="middle" s={10}>
        lug fold
      </T>
      <Lead p={P(ML, 13, 6)} t={[140, 146]} text="full lug width" sub="1.3 × W below the fold" a="end" />
      <Lead p={P(ML, 30, 8.6)} t={[200, 146]} text="concave shoulder" sub="20 → 16, about the buckle width" />
      <Lead p={P(ML, 119.6, 7.6)} t={[468, 146]} text="square tail" sub="r ≈ 2 corners (house)" a="end" />

      {/* short */}
      <Piece M={MS} p={sp} face="card">
        {zone(MS, PS)}
      </Piece>
      <CLine M={MS} x0={-23} x1={108} />
      <FoldLine M={MS} x={0} h={10} />
      <FoldLine M={MS} x={80} h={8} />
      <FoldLine M={MS} x={70} h={8} c={C.brass} />
      <rect x={slx - 5 * s} y={sly - 1.1 * s} width={10 * s} height={2.2 * s} rx={1.1 * s} fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />
      <T x={P(MS, 0, 0)[0]} y={P(MS, 0, -12.5)[1] - 5} a="middle" s={10}>
        lug fold
      </T>
      <T x={P(MS, 70, 0)[0] - 4} y={P(MS, 0, -10.5)[1] - 5} a="end" s={10} c={C.brass}>
        keeper line
      </T>
      <T x={P(MS, 80, 0)[0] + 4} y={P(MS, 0, -10.5)[1] - 5} a="start" s={10}>
        buckle fold · slot
      </T>
      <Lead p={P(MS, 30, -8.6)} t={[186, 178]} text="shoulder sits before the keepers" s={10.5} />
      <Dim a={P(MS, -20, 10)} b={P(MS, 0, 10)} off={12} text="20" flip />
      <Dim a={P(MS, 0, 10)} b={P(MS, 26, 10)} off={12} text="26" flip />
      <Dim a={P(MS, 0, 10)} b={P(MS, 80, 10)} off={28} text="80" flip />
      <Dim a={P(MS, 80, 10)} b={P(MS, 105, 10)} off={28} text="≥ 25" flip />
      <Dim a={P(MS, 105, -8)} b={P(MS, 105, 8)} off={-10} text="16" />

      {/* proportions */}
      <Sep x1={14} y1={298} x2={466} y2={298} />
      <Tag x={14} y={314}>Scale by lug width W</Tag>
      {[
        ['lug W', '18', '20', '22'],
        ['full zone 1.3 W', '≈ 23', '26', '≈ 29'],
        ['body', '14', '16', '18'],
      ].map((row, i) => (
        <g key={i}>
          <T x={318} y={312 + i * 12} s={10} c={C.faint} a="end">
            {row[0]}
          </T>
          {row.slice(1).map((v, j) => (
            <T key={j} x={350 + j * 40} y={312 + i * 12} s={10} c={j === 1 ? C.text : C.dim} a="middle" mono>
              {v}
            </T>
          ))}
        </g>
      ))}
      <T x={14} y={330} s={10} c={C.faint}>
        body ≈ buckle width
      </T>
      <T x={120} y={330} s={10} c={C.faint}>
        · cut it in card first
      </T>
    </Fig>
  )
}

/* 2 · Square the tail */
function PiTail() {
  const s = 6
  const M = { x: 40 - 92 * s, y: 128, s }
  const o = { ...PL, x0: 92 }
  const p = pilotPts(o)
  const ogive = outline({ x0: 92, x1: 120, w0: 16, w1: 16, taper: [92, 120], tip: 'ogive', tipLen: 14 })
  const [ex] = P(M, 120, 0)
  const [, yt] = P(M, 0, -8)
  const [, yb] = P(M, 0, 8)
  const zc = [ex - 2 * s, yb - 2 * s] // lower corner, radius centre
  const ic = [242, 268] // inset centre
  return (
    <Fig h={334} view="Plan ×6 · the tail end" scale="16 mm tail">
      <PsDefs />
      <Box x={14} y={28} w={290} h={300} title="1 · square, then soften the corners" />
      {/* rule on the work, knife on the line */}
      <Piece M={M} p={p} face="wax" edge={C.paint} ew={2.2} />
      <Brk x={40} y={yt} h={16 * s} />
      <CLine M={M} x0={92} x1={124} />
      <path d={pathOf(ogive, M)} fill="none" stroke={C.ruby} strokeWidth="1" strokeDasharray="4 3" opacity="0.9" />
      <HoleRow M={M} xs={[95]} />
      <path d={`M${ex - 10} ${M.y} L${ex - 10} ${M.y - 10} L${ex} ${M.y - 10}`} fill="none" stroke={C.emerald} strokeWidth="1.1" />
      <T x={ex - 14} y={M.y - 14} a="end" s={10} c={C.emerald}>
        90°
      </T>
      <Tl.Knife kind="skive" x={ex + 1} y={M.y + 26} ang={22} k={0.42} />
      <Dim a={[ex, yt]} b={[ex, yb]} off={-44} text="16" />
      <Dim a={P(M, 95, 8)} b={P(M, 120, 8)} off={14} text="25 to last hole" flip />
      <Lead p={P(M, 100, -8)} t={[52, 62]} text="cut, painted edge" s={10.5} a="start" />
      <Lead p={P(M, 112.5, -4.4)} t={[300, 62]} text="classic ogive — not here" a="end" c={C.ruby} s={10.5} />
      <Inset at={zc} r0={2 * s + 4} c={ic} R={44} label="corner ×14" ly={326}>
        {(() => {
          const z = 14
          const r = 2 * z
          const cx = ic[0] + 16
          const cy = ic[1] + 16
          return (
            <g>
              <path d={`M${cx - 120} ${cy} L${cx - r} ${cy} A${r} ${r} 0 0 0 ${cx} ${cy - r} L${cx} ${cy - 120} L${cx - 120} ${cy - 120} Z`} fill="url(#ps-wax)" stroke={C.paint} strokeWidth="3" />
              <path d={`M${cx - r} ${cy} L${cx} ${cy} L${cx} ${cy - r}`} fill="none" stroke={C.ruby} strokeWidth="1" strokeDasharray="3 2" />
              <circle cx={cx - r} cy={cy - r} r={r} fill="none" stroke={C.brass} strokeWidth="1.1" strokeDasharray="3 2" />
              <circle cx={cx - r} cy={cy - r} r="2" fill={C.brass} />
              <line x1={cx - r} y1={cy - r} x2={cx - r + r * 0.7071} y2={cy - r + r * 0.7071} stroke={C.text} strokeWidth="1.1" />
              <T x={cx - r - 6} y={cy - r - 6} a="end" s={10.5} mono c={C.text}>
                r 2
              </T>
            </g>
          )
        })()}
      </Inset>
      <Note x={26} y={222} s={10.5} lh={14} lines={['Cut the end square on', 'a rule, then pare each', 'corner to a Ø 4 circle', 'drawn tangent to both', 'edges: r ≈ 2 (house).']} />
      <T x={26} y={300} s={10} c={C.faint}>
        or one strike of a
      </T>
      <T x={26} y={313} s={10} c={C.faint}>
        16 mm square end punch
      </T>

      {/* edge route */}
      <Box x={312} y={28} w={156} h={146} title="2 · cut + painted" c={C.emerald} tc={C.emerald} />
      <Verdict x={452} y={42} ok />
      <XSec cx={390} y={70} w={110} layers={[{ k: 'dark', t: 12 }, { k: 'velodon', t: 2 }, { k: 'lining', t: 8 }]} edge="paint" b={3.5} coat={3} />
      <T x={390} y={118} a="middle" s={10.5} c={C.text}>
        the square end takes
      </T>
      <T x={390} y={132} a="middle" s={10.5} c={C.text}>
        a cut edge, 3+ coats
      </T>
      <T x={390} y={150} a="middle" s={10} c={C.faint}>
        sanded between coats
      </T>

      <Box x={312} y={182} w={156} h={146} title="3 · no rembordé" c={C.ruby} tc={C.ruby} />
      <Verdict x={452} y={196} ok={false} />
      {(() => {
        const x0 = 328
        const y0 = 212
        const cx = 432
        const a = 12
        return (
          <g>
            <rect x={x0} y={y0} width={cx - x0} height={56} fill="url(#ps-wax)" stroke={C.liningEdge} strokeWidth="0.6" />
            <rect x={x0} y={y0} width={cx - x0} height={a} fill="rgba(194,88,99,0.28)" stroke={C.ruby} strokeWidth="0.8" strokeDasharray="2 2" />
            <rect x={cx - a} y={y0} width={a} height={56} fill="rgba(194,88,99,0.28)" stroke={C.ruby} strokeWidth="0.8" strokeDasharray="2 2" />
            <rect x={cx - a} y={y0} width={a} height={a} fill="url(#sk-noglue)" stroke={C.ruby} strokeWidth="1.3" />
            <T x={x0} y={y0 + 72} s={10} c={C.text}>
              the turn-over allowance
            </T>
            <T x={x0} y={y0 + 85} s={10} c={C.text}>
              doubles at a square corner
            </T>
            <T x={x0} y={y0 + 100} s={10} c={C.faint}>
              a pilot tail is never turned
            </T>
          </g>
        )
      })()}
    </Fig>
  )
}

/* 3 · Prick the shoulder with a 2-prong iron */
function PiPrick() {
  const s = 8.2
  const M = { x: 26 - 13 * s, y: 176, s }
  const o = PLF
  const p = pilotPts(o)
  const [up] = sideRuns(o, 3, 4, 60)
  const st = resample(up, 3)
  const vis = st.filter((h) => h.p[0] >= 13.5 && h.p[0] <= 43)
  const iC0 = vis.findIndex((h) => h.p[0] > o.full - 1.5)
  const done = iC0 + 3 // last hole made so far
  const prong = vis[done]
  const next = vis[done + 1]
  const [ax, ay] = P(M, prong.p[0], prong.p[1])
  const [bx, by] = P(M, next.p[0], next.p[1])
  const fa = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI
  const fl = Math.hypot(bx - ax, by - ay)
  const [sx0, sy0] = P(M, vis[1].p[0], vis[1].p[1])
  return (
    <Fig h={340} view="Plan ×8 · the shoulder  ·  side view" scale="seam 3 mm in">
      <PsDefs />
      <Box x={14} y={28} w={290} h={306} title="walk the curve, two prongs" />
      <ClipRect x={22} y={48} w={276} h={166}>
        <Piece M={M} p={p} face="wax" edge={C.paint} ew={2} />
        <CLine M={M} x0={10} x1={50} />
        <Seam M={M} run={up} mode="line" c={C.dim} />
        {vis.map((h, i) => {
          if (i > done + 1) return null
          return <Seam key={i} M={M} run={[h.p, [h.p[0] + h.tan[0] * 0.01, h.p[1] + h.tan[1] * 0.01]]} p={1} mode="holes" c={i <= done ? '#120c07' : '#c9a26d'} sl={0.7} />
        })}
      </ClipRect>
      <rect x={ax - 7} y={ay - 6} width={fl + 14} height={12} rx="5" fill="rgba(180,196,206,0.30)" stroke={C.steel} strokeWidth="1.1" transform={`rotate(${fa} ${ax} ${ay})`} />
      <circle cx={ax} cy={ay} r={7.5} fill="none" stroke={C.emerald} strokeWidth="1.4" />
      {vis.slice(iC0, done + 2).map((h, j) => {
        const [x, y] = P(M, h.p[0], h.p[1])
        const nx = h.tan[1]
        const ny = -h.tan[0]
        return <Num key={j} x={x + nx * 21} y={y + ny * 21} n={j + 1} r={7} />
      })}
      <Lead p={[sx0, sy0 - 5]} t={[32, 62]} text="straight: multi-prong iron" a="start" s={10.5} sub="pricked first, up to the curve" />
      <Lead p={[bx + 3, by - 4]} t={[294, 62]} text="next hole" a="end" s={10.5} sub="strike · lift · step on" />
      <Lead p={[ax - 2, ay + 7]} t={[196, 232]} text="prong keyed in the last hole" c={C.emerald} s={10.5} a="end" />
      <Lead p={P(M, 40, -5)} t={[294, 232]} text="seam line" a="end" s={10} c={C.dim} />
      <Note
        x={26}
        y={268}
        s={10.5}
        lh={14}
        lines={['Each strike pivots on the keyed prong, so', 'every hole lands on the curve and the', 'seam turns the shoulder without a kink.']}
      />
      <T x={26} y={322} s={10} c={C.faint}>
        Slits keep their slant to the seam line, not to the strap.
      </T>

      {/* side view of the iron */}
      <Box x={312} y={28} w={156} h={144} title="2-prong iron" />
      <Tl.Slab x={322} y={146} w={136} h={10} kind="pad" />
      <rect x={322} y={132} width={136} height={8} fill="url(#ps-waxS)" stroke="#1b120a" strokeWidth="0.6" />
      <rect x={322} y={140} width={136} height={1.6} fill={C.velodon} />
      <rect x={322} y={141.6} width={136} height={4.4} fill="url(#sk-linS)" stroke={LINEDGE} strokeWidth="0.6" />
      {[350, 368].map((x) => (
        <rect key={x} x={x - 1.1} y={131} width={2.2} height={16} fill={C.hole} />
      ))}
      <Tl.Iron n={2} pitch={18} kind="french" x={368} y={135} k={0.9} />
      <Tl.Mallet x={376} y={70} k={0.34} />
      <Lead p={[368, 134]} t={[334, 106]} text="keyed" a="end" s={10} c={C.emerald} />
      <T x={322} y={166} s={10} c={C.faint}>
        same pitch as the straights
      </T>

      {/* ✗ / ✓ */}
      <Box x={312} y={180} w={156} h={154} title="why not a long iron" />
      {(() => {
        const cv = (ox, ok) => {
          const pts2 = []
          for (let i = 0; i <= 20; i++) {
            const u = i / 20
            pts2.push([ox + u * 64, 238 + 26 * (1 - (1 - u) * (1 - u))])
          }
          const d = 'M' + pts2.map((q) => q.join(' ')).join(' L')
          const slits = ok
            ? [0, 0.25, 0.5, 0.75, 1].map((u) => [ox + u * 64, 238 + 26 * (1 - (1 - u) * (1 - u))])
            : [0, 1 / 3, 2 / 3, 1].map((u) => [ox + u * 64, 238 + 26 * u * 0.85])
          return (
            <g>
              <path d={`${d} L${ox + 64} 300 L${ox} 300 Z`} fill="url(#ps-wax)" />
              <path d={d} fill="none" stroke={C.dim} strokeWidth="1" strokeDasharray="2 2" />
              {slits.map(([x, y], i) => (
                <line key={i} x1={x - 2.5} y1={y + 3} x2={x + 2.5} y2={y - 3} stroke={ok ? ECRU : C.ruby} strokeWidth="1.8" strokeLinecap="round" />
              ))}
              <Verdict x={ox + 32} y={316} ok={ok} r={7} />
            </g>
          )
        }
        return (
          <g>
            {cv(322, false)}
            {cv(396, true)}
            <T x={354} y={212} a="middle" s={10} c={C.ruby}>
              4 prongs:
            </T>
            <T x={354} y={225} a="middle" s={10} c={C.ruby}>
              a chord, a kink
            </T>
            <T x={428} y={212} a="middle" s={10} c={C.emerald}>
              2 prongs:
            </T>
            <T x={428} y={225} a="middle" s={10} c={C.emerald}>
              on the curve
            </T>
          </g>
        )
      })()}
    </Fig>
  )
}

/* 4 · Box the lug end — two rows across, tied into the side seams */
function PiBoxLug() {
  const s = 5
  const M = { x: 92, y: 98, s }
  const o = PLF
  const p = pilotPts(o)
  const runs = sideRuns(o, 3, 4, 46)
  const r1 = rowRun(o, 4)
  const r2 = rowRun(o, 8)
  const [x46] = P(M, 46, 0)
  const [x0] = P(M, -2.4, 0)
  const [, yT] = P(M, 0, -10)
  // section along the centreline
  const k = 9
  const ss = 7
  const cx = 92
  const cy = 252
  const sec = { r: 0.95 * k, t: 1.2 * k, tl: 0.7 * k }
  const y1 = cy - sec.r
  const cv = sec.r * 2.6
  const ts = sec.t * 0.45
  const tailEnd = cx + 10 * ss
  const tailAt = (x) => ts * Math.max(0, Math.min(1, 1 - (x - cx - cv) / (tailEnd - cx - cv)))
  return (
    <Fig h={340} view="Plan · lug end  ·  section on the centreline" scale="plan ×5 · section ×7">
      <PsDefs />
      <ClipRect x={x0 - 4} y={30} w={x46 - x0 + 4} h={150}>
        <Piece M={M} p={p} face="wax" edge={C.paint} ew={2} />
        <CLine M={M} x0={-5} x1={48} />
        <rect x={M.x - 0.9 * s} y={yT + 1} width={1.8 * s} height={20 * s - 2} rx={0.9 * s} fill="none" stroke={C.steel} strokeWidth="1" strokeDasharray="3 2" />
        <line x1={P(M, 10, 0)[0]} y1={P(M, 0, -9.6)[1]} x2={P(M, 10, 0)[0]} y2={P(M, 0, 9.6)[1]} stroke={C.dim} strokeWidth="1" strokeDasharray="2 3" />
        {runs.map((r, i) => (
          <Seam key={i} M={M} run={r} w={2.1} />
        ))}
        <Seam M={M} run={r1} w={2.1} />
        <Seam M={M} run={r2} w={2.1} />
      </ClipRect>
      <Brk x={x46} y={P(M, 0, -8)[1]} h={16 * s} />
      <rect x={P(M, 4, 0)[0] - 3} y={P(M, 0, -7)[1] - 3} width={4 * s + 6} height={14 * s + 6} rx="3" fill="none" stroke={C.brass} strokeWidth="1" strokeDasharray="3 2" />
      <Dim a={P(M, 0, -10)} b={P(M, 4, -10)} off={-12} text="" />
      <T x={P(M, 2, 0)[0]} y={yT - 18} a="middle" s={10.5} mono c={C.text}>
        ≈4
      </T>
      <Dim a={P(M, 4, -10)} b={P(M, 8, -10)} off={-12} text="" />
      <T x={P(M, 8, 0)[0] + 4} y={yT - 16} a="start" s={10.5} mono c={C.text}>
        4
      </T>
      <Dim a={P(M, 0, 10)} b={P(M, 10, 10)} off={12} text="tail ≈ 10" flip />
      <Dim a={P(M, 20, -7)} b={P(M, 20, -10)} off={0} />
      <T x={P(M, 20, 0)[0] + 5} y={P(M, 0, -8.5)[1] + 4} s={10} mono c={C.text}>
        3
      </T>
      <Lead p={[M.x, M.y + 30]} t={[70, M.y + 30]} text="bar" a="end" s={10.5} c={C.steel} sub="hidden" />
      <Lead p={P(M, 4, -7)} t={[336, 44]} text="row 1 · seam start" s={10.5} sub="shares the corner holes" />
      <Lead p={P(M, 8, 3)} t={[336, 92]} text="row 2 · 4 mm on" s={10.5} sub="through the hidden tail" />
      <Lead p={P(M, 10, 8.5)} t={[336, 140]} text="tail end" s={10.5} c={C.dim} sub="classic glue stop ≈ 10" />

      <Sep x1={14} y1={186} x2={466} y2={186} />
      <Tag x={14} y={204}>Section · the rows clamp top, tail and lining</Tag>
      <FoldSec cx={cx} cy={cy} r={sec.r} t={sec.t} tl={sec.tl} xR={330} cv={cv} tailEnd={tailEnd} ts={ts} k="top" />
      <Brk x={330} y={y1 - sec.t} h={sec.t + sec.tl + 4} />
      {[4, 8].map((mm) => {
        const x = cx + mm * ss
        return <Pass key={mm} x={x} y1={y1 - sec.t} y2={y1 + tailAt(x) + sec.tl} />
      })}
      <Lead p={[cx + 4 * ss, y1 - sec.t - 3]} t={[cx + 4 * ss - 8, 224]} text="row 1" a="end" s={10.5} />
      <Lead p={[cx + 8 * ss, y1 - sec.t - 3]} t={[cx + 8 * ss + 8, 224]} text="row 2" s={10.5} />
      <Lead p={[cx + 6 * ss, y1 + 2]} t={[150, 304]} text="the tail, trapped twice" s={10.5} a="end" />
      <Lead p={[210, y1 + sec.tl - 1]} t={[214, 304]} text="lining" s={10.5} a="start" />
      <Lead p={[cx - 3, cy + 3]} t={[58, 274]} text="bar" s={10.5} a="end" c={C.steel} />
      <Note x={344} y={224} s={10.5} lh={14} head="Why two rows" hc={C.text} lines={['They lock the fold where', 'it flexes, and make the', 'box that reads as pilot —', 'in the same bold ecru.']} />
    </Fig>
  )
}

/* 5 · Box the tail — the trapezoid seam */
function PiBoxTail() {
  const s = 6.4
  const M = { x: 34 - 84 * s, y: 124, s }
  const o = PLF
  const p = pilotPts(o)
  const runs = sideRuns(o, 3, 60, o.x1 - TRAP.base)
  const tr = trapRuns(o)
  const [ex] = P(M, 120, 0)
  const corners = [
    [tr.xb, -tr.hb],
    [tr.xb, tr.hb],
    [tr.xe, -tr.he],
    [tr.xe, tr.he],
  ]
  return (
    <Fig h={334} view="Plan ×6.4 · the tail end" scale="trapezoid sizes: house">
      <PsDefs />
      <Piece M={M} p={p} face="wax" edge={C.paint} ew={2} />
      <Brk x={34} y={P(M, 0, -8)[1]} h={16 * s} />
      <CLine M={M} x0={84} x1={124} />
      <HoleRow M={M} xs={holeXs(120).filter((x) => x >= 85)} />
      {runs.map((r, i) => (
        <Seam key={i} M={M} run={r} w={2.1} />
      ))}
      <polygon
        points={pts([P(M, tr.xb, -tr.hb), P(M, tr.xe, -tr.he), P(M, tr.xe, tr.he), P(M, tr.xb, tr.hb)])}
        fill="rgba(208,168,79,0.12)"
        stroke="none"
      />
      <Seam M={M} run={tr.base} w={2.1} />
      <Seam M={M} run={tr.legA} w={2.1} p={2.9} />
      <Seam M={M} run={tr.end} w={2.1} p={2.6} />
      <Seam M={M} run={tr.legB} w={2.1} p={2.9} />
      {corners.map((c, i) => {
        const [x, y] = P(M, c[0], c[1])
        return <circle key={i} cx={x} cy={y} r={5} fill="none" stroke={C.emerald} strokeWidth="1.3" />
      })}
      <Dim a={P(M, tr.xb, -8)} b={P(M, 120, -8)} off={-14} text="14" flip />
      <Dim a={P(M, tr.xe, -8)} b={P(M, 120, -8)} off={-34} />
      <T x={ex + 8} y={P(M, 0, -8)[1] - 30} s={10.5} mono c={C.text}>
        3
      </T>
      <Dim a={[ex, P(M, 0, -tr.he)[1]]} b={[ex, P(M, 0, tr.he)[1]]} off={-14} text="5" />
      <Lead p={P(M, 92, -5)} t={[44, 52]} text="side seam, 3 mm in" s={10.5} a="start" />
      <Lead p={P(M, tr.xb, 1.5)} t={[186, 214]} text="base row" s={10.5} a="start" sub="ties the side seams across" />
      <Lead p={P(M, (tr.xb + tr.xe) / 2, (tr.hb + tr.he) / 2)} t={[312, 176]} text="legs turn in" s={10.5} sub="continuing the side seams" />
      <Lead p={P(M, tr.xe, -0.8)} t={[312, 118]} text="end row" s={10.5} sub="3 in from the end" />
      <Lead p={P(M, tr.xb, tr.hb)} t={[150, 214]} text="corner holes first" c={C.emerald} s={10.5} a="end" />

      <Sep x1={14} y1={240} x2={466} y2={240} />
      <Tag x={14} y={258}>Order</Tag>
      <Num x={30} y={278} n={1} />
      <T x={44} y={282} s={10.5} c={C.text}>
        Draw it from a card template —
      </T>
      <T x={44} y={296} s={10} c={C.faint}>
        one card for both tails, so they match.
      </T>
      <Num x={260} y={278} n={2} />
      <T x={274} y={282} s={10.5} c={C.text}>
        Prick the four corners, then fill
      </T>
      <T x={274} y={296} s={10} c={C.faint}>
        each side with the 2-prong iron.
      </T>
      <Num x={30} y={316} n={3} />
      <T x={44} y={320} s={10.5} c={C.text}>
        One seam: side → leg → end → leg → side; the base row tied in at its corners.
      </T>
    </Fig>
  )
}

/* 6 · Thread and leather */
function PiThread() {
  const s = 4.4
  const o = PLF
  const strip = (yc, w, c) => {
    const M = { x: 28 - 60 * s, y: yc, s }
    const p = pilotPts({ ...o, x0: 50, x1: 118, rc: 0 })
    const runs = sideRuns({ ...o, x0: 50, x1: 118 }, 3, 58, 110)
    return (
      <ClipRect x={28} y={yc - 40} w={196} h={80}>
        <Piece M={M} p={p} face="wax" edge={C.paint} ew={1.6} />
        {runs.map((r, i) => (
          <Seam key={i} M={M} run={r} w={w} c={c} />
        ))}
        <HoleRow M={M} xs={[74, 81]} />
      </ClipRect>
    )
  }
  return (
    <Fig h={330} view="Plan ×4.4  ·  thread end-on  ·  side view" scale="thread Ø ×48">
      <PsDefs />
      <Tag x={14} y={38}>On a dark waxed top</Tag>
      {strip(86, 2.8, ECRU)}
      {strip(172, 1.5, '#7a634b')}
      <Brk x={28} y={P({ x: 0, y: 86, s }, 0, -8)[1]} h={16 * s} />
      <Brk x={28} y={P({ x: 0, y: 172, s }, 0, -8)[1]} h={16 * s} />
      <Brk x={224} y={P({ x: 0, y: 86, s }, 0, -8)[1]} h={16 * s} />
      <Brk x={224} y={P({ x: 0, y: 172, s }, 0, -8)[1]} h={16 * s} />
      <T x={240} y={74} s={11.5} c={C.text} w="600">
        bold ecru · 0.55–0.65 mm
      </T>
      <T x={240} y={89} s={10} c={C.faint}>
        the heavy end of the course range;
      </T>
      <T x={240} y={102} s={10} c={C.faint}>
        the box seams read at arm's length
      </T>
      <Verdict x={456} y={70} ok />
      <T x={240} y={160} s={11.5} c={C.dim} w="600">
        tonal · 0.45 mm
      </T>
      <T x={240} y={175} s={10} c={C.faint}>
        the classic default: on a pilot
      </T>
      <T x={240} y={188} s={10} c={C.faint}>
        the box and trapezoid disappear
      </T>

      <Sep x1={14} y1={214} x2={466} y2={214} />
      <Tag x={14} y={232}>End-on, same enlargement</Tag>
      {[
        [0.45, 'default', '#9c8b72'],
        [0.57, '532 linen', ECRU],
        [0.63, '432 linen', ECRU],
      ].map(([d, lab, c], i) => {
        const x = 40 + i * 56
        const r = (d / 2) * 48
        return (
          <g key={d}>
            <circle cx={x} cy={266} r={r} fill={c} stroke="#8c7d64" strokeWidth="0.8" />
            <T x={x} y={302} a="middle" s={10.5} mono c={C.text}>
              {d.toFixed(2)}
            </T>
            <T x={x} y={316} a="middle" s={10} c={C.faint}>
              {lab}
            </T>
          </g>
        )
      })}
      <T x={196} y={256} s={10.5} c={C.text}>
        Match the iron:
      </T>
      <T x={196} y={271} s={10} c={C.dim}>
        3.38 mm pitch
      </T>
      <T x={196} y={284} s={10} c={C.dim}>
        ↔ 0.55–0.6 thread
      </T>
      <T x={196} y={300} s={10} c={C.faint}>
        course matched sets
      </T>

      <Box x={322} y={222} w={146} h={102} title="firm, waxed top" />
      {(() => {
        const cx = 395
        return (
          <g>
            <path d={`M334 272 Q${cx} 250 456 272 L456 283 Q${cx} 261 334 283 Z`} fill="url(#ps-wax)" stroke="#1b120a" strokeWidth="0.6" />
            <ellipse cx={cx} cy={262} rx={24} ry={5} fill="url(#ps-pull)" />
            <Arrow a={[cx - 40, 248]} b={[cx - 34, 258]} w={1.4} />
            <Arrow a={[cx + 40, 248]} b={[cx + 34, 258]} w={1.4} />
            <T x={cx} y={302} a="middle" s={10} c={C.text}>
              pull-up: lightens
            </T>
            <T x={cx} y={315} a="middle" s={10} c={C.text}>
              where it bends
            </T>
          </g>
        )
      })()}
    </Fig>
  )
}

/* 7 · Variant · decorative rivets beyond the fold's tail */
function PiRivets() {
  const s = 5.2
  const M = { x: 52 + 2.4 * s, y: 100, s }
  const o = PLF
  const p = pilotPts(o)
  const runs = sideRuns(o, 3, 4, 46)
  const rv = [
    [16, -4.5],
    [16, 4.5],
  ]
  const [x46] = P(M, 46, 0)
  const [x0] = P(M, -2.4, 0)
  const [xz] = P(M, 10, 0)
  // section through a rivet line
  const k = 9
  const ss = 6
  const cx = 60
  const cy = 272
  const r = 0.95 * k
  const t = 1.2 * k
  const tl = 0.7 * k
  const y1 = cy - r
  const tailEnd = cx + 10 * ss
  return (
    <Fig h={340} view="Plan · lug end  ·  section" scale="plan ×5.2 · rivet place: house">
      <PsDefs />
      <ClipRect x={x0 - 4} y={30} w={x46 - x0 + 4} h={150}>
        <Piece M={M} p={p} face="wax" edge={C.paint} ew={2}>
          <rect x={P(M, -3, 0)[0]} y={M.y - 12 * s} width={xz - P(M, -3, 0)[0]} height={24 * s} fill="rgba(194,88,99,0.24)" />
        </Piece>
        <CLine M={M} x0={-5} x1={48} />
        {runs.map((rr, i) => (
          <Seam key={i} M={M} run={rr} w={2} />
        ))}
        <Seam M={M} run={rowRun(o, 4)} w={2} />
        <Seam M={M} run={rowRun(o, 8)} w={2} />
      </ClipRect>
      <Brk x={x46} y={P(M, 0, -8)[1]} h={16 * s} />
      <line x1={xz} y1={P(M, 0, -10)[1] - 6} x2={xz} y2={P(M, 0, 10)[1] + 6} stroke={C.ruby} strokeWidth="1" strokeDasharray="4 3" />
      {rv.map(([x, y], i) => {
        const [rx, ry] = P(M, x, y)
        return (
          <g key={i}>
            <circle cx={rx} cy={ry} r={1.8 * s + 1} fill="url(#sk-brassG)" stroke="#5c461a" strokeWidth="0.8" />
            <circle cx={rx - 2} cy={ry - 2} r={2} fill="#fff4cf" opacity="0.6" />
          </g>
        )
      })}
      <Dim a={P(M, -2.4, -10)} b={P(M, 10, -10)} off={-12} text="flex zone" flip />
      <Dim a={P(M, 10, -10)} b={P(M, 16, -10)} off={-12} text="" />
      <T x={P(M, 13, 0)[0]} y={P(M, 0, -10)[1] - 18} a="middle" s={10.5} mono c={C.text}>
        6
      </T>
      <Dim a={P(M, 16, -4.5)} b={P(M, 16, 4.5)} off={-18} text="9" />
      <Lead p={[xz, P(M, 0, 10)[1] + 4]} t={[xz - 4, 182]} text="tail end · ≈ 10" a="end" s={10.5} c={C.ruby} />
      <Lead p={P(M, 16, 4.5)} t={[150, 196]} text="two rivets, side by side" s={10.5} sub="beyond the tail, before the shoulder" />
      <Lead p={P(M, 30, 8.4)} t={[330, 160]} text="shoulder at 26" s={10} c={C.dim} />
      <Note x={330} y={46} s={10.5} lh={14} head="Optional" hc={C.text} lines={['The flieger look; many', 'pilot straps — the one', 'studied included — have', 'none. Stitches may cross', 'the flex zone; rivets not.']} />

      <Sep x1={14} y1={216} x2={466} y2={216} />
      <Tag x={14} y={234}>Section through a rivet</Tag>
      <rect x={cx - r - t - 4} y={y1 - t - 8} width={tailEnd - (cx - r - t - 4)} height={t + tl + 2 * r + 20} fill="rgba(194,88,99,0.12)" stroke={C.ruby} strokeWidth="0.8" strokeDasharray="3 3" />
      <FoldSec cx={cx} cy={cy} r={r} t={t} tl={tl} xR={286} cv={r * 2.6} tailEnd={tailEnd} ts={t * 0.45} />
      <Brk x={286} y={y1 - t} h={t + tl + 4} />
      <Tl.Rivet x={cx + 16 * ss} y={y1 - t - 2.5} h={t + tl + 5} k={0.85} />
      <Lead p={[tailEnd - 3, y1 + 1.5]} t={[tailEnd + 30, 318]} text="tail feathers out" s={10} />
      <Lead p={[cx + 16 * ss + 6, y1 - t - 3]} t={[cx + 16 * ss + 26, 246]} text="rivet: top + lining" s={10.5} />
      <T x={cx + 2} y={cy + r + 28} a="middle" s={10} c={C.ruby}>
        flexes
      </T>

      <Box x={312} y={222} w={156} h={112} title="in the flex zone" c={C.ruby} tc={C.ruby} />
      <Verdict x={452} y={236} ok={false} />
      {(() => {
        const bx = 336
        const by = 282
        return (
          <g>
            <path d={`M${bx} ${by} Q${bx + 50} ${by - 2} ${bx + 100} ${by - 34}`} fill="none" stroke="url(#sk-topS)" strokeWidth="9" />
            <path d={`M${bx} ${by + 7} Q${bx + 52} ${by + 5} ${bx + 104} ${by - 27}`} fill="none" stroke="#e2d2b3" strokeWidth="4" />
            <Tl.Rivet x={bx + 56} y={by - 13} h={14} k={0.7} ang={-24} />
            <path d={`M${bx + 68} ${by - 3} l4 3 l-3 3 l4 3`} fill="none" stroke={C.ruby} strokeWidth="1.4" />
            <T x={390} y={310} a="middle" s={10} c={C.text}>
              a rigid post in the bend
            </T>
            <T x={390} y={324} a="middle" s={10} c={C.ruby}>
              cracks and tears out
            </T>
          </g>
        )
      })()}
    </Fig>
  )
}

/* ================================================================== */
/* Smartwatch adapter straps                                           */
/* ================================================================== */
// A generic adapter (mm): slider `depth` deep (along the strap) and `h` tall,
// ears `ear` thick reaching `reach` beyond the slider, bar centre `barAt`
// from the slider's strap-side face. Drawing proportions only — no brand's part.
const AD = { ear: 1.6, depth: 3.2, reach: 5, barAt: 3, barR: 0.9, h: 4.4, eh: 2.0 }

// Spring bar seen from above, horizontal between x1 and x2 (px).
function SpringBarH({ x1, x2, y, r, pin, hidden }) {
  const L = x2 - x1
  return (
    <g>
      <rect x={x1 - pin} y={y - r * 0.5} width={pin + 2} height={r} rx={r * 0.4} fill="url(#sk-steelH)" stroke={STEEL_EDGE} strokeWidth="0.6" strokeDasharray={hidden ? '2 1.5' : undefined} />
      <rect x={x2 - 2} y={y - r * 0.5} width={pin + 2} height={r} rx={r * 0.4} fill="url(#sk-steelH)" stroke={STEEL_EDGE} strokeWidth="0.6" strokeDasharray={hidden ? '2 1.5' : undefined} />
      <rect x={x1} y={y - r} width={L} height={2 * r} rx={r} fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.7" />
      {[0.1, 0.9].map((f) => (
        <line key={f} x1={x1 + L * f} y1={y - r} x2={x1 + L * f} y2={y + r} stroke={STEEL_EDGE} strokeWidth="0.8" />
      ))}
    </g>
  )
}

// Adapter in plan. (cx, y) = centre of the slider's case-side face; ears
// point +y (dir 1) or −y (dir −1). slot = strap width, mm.
// kind 'spring' (own spring bar) | 'fixed' (bar built in) | 'none' (bar out).
function AdapterPlan({ cx, y, s, slot, kind = 'spring', dir = 1, holes, op }) {
  const half = slot / 2
  const Y = (mm) => y + dir * mm * s
  const top = (a, b) => Math.min(Y(a), Y(b))
  const xl = cx - (half + AD.ear) * s
  const xr = cx + (half + AD.ear) * s
  const xli = cx - half * s
  const xri = cx + half * s
  const ew = AD.ear * s
  const ey = top(AD.depth - 0.4, AD.depth + AD.reach)
  const eh = (AD.reach + 0.4) * s
  const by = Y(AD.depth + AD.barAt)
  const br = AD.barR * s
  return (
    <g opacity={op}>
      <rect x={xl} y={ey} width={ew} height={eh} rx={ew / 2} fill="url(#sk-steelH)" stroke={STEEL_EDGE} strokeWidth="0.8" />
      <rect x={xri} y={ey} width={ew} height={eh} rx={ew / 2} fill="url(#sk-steelH)" stroke={STEEL_EDGE} strokeWidth="0.8" />
      {kind === 'fixed' && (
        <g>
          <rect x={xli - ew * 0.5} y={by - br} width={xri - xli + ew} height={2 * br} fill="url(#sk-steel)" />
          {[xli, xri].map((xx, i) => (
            <path
              key={i}
              d={`M${xx} ${by - br - 2.2} Q${xx} ${by - br} ${xx + (i ? -2.2 : 2.2)} ${by - br} L${xx + (i ? -2.2 : 2.2)} ${by + br} Q${xx} ${by + br} ${xx} ${by + br + 2.2} Z`}
              fill="#b3c2cc"
            />
          ))}
          <line x1={xli + 2} y1={by - br} x2={xri - 2} y2={by - br} stroke={STEEL_EDGE} strokeWidth="0.8" />
          <line x1={xli + 2} y1={by + br} x2={xri - 2} y2={by + br} stroke={STEEL_EDGE} strokeWidth="0.8" />
        </g>
      )}
      <rect x={xl} y={top(0, AD.depth)} width={xr - xl} height={AD.depth * s} rx={1.1 * s} fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.8" />
      <rect x={cx - 1.6 * s} y={Y(AD.depth / 2) - 0.55 * s} width={3.2 * s} height={1.1 * s} rx={0.55 * s} fill="#4e5f6a" stroke="#2d3940" strokeWidth="0.5" />
      {holes &&
        [xl + ew / 2, xri + ew / 2].map((hx) => <circle key={hx} cx={hx} cy={by} r={0.5 * s} fill={C.ground} stroke="#2d3940" strokeWidth="0.6" />)}
      {kind === 'spring' && <SpringBarH x1={xli} x2={xri} y={by} r={br} pin={ew * 0.7} hidden />}
    </g>
  )
}

// Adapter in side view: (x, y) = bar centre, ears toward +x, slider (left)
// against the case. The near ear is a ghost so the strap fold shows behind.
function AdapterSide({ x, y, s, kind = 'spring', eh = AD.eh, slider = true, bar = true }) {
  const sx1 = x - (AD.barAt + AD.depth) * s
  const sx2 = x - AD.barAt * s
  const hh = (AD.h / 2) * s
  const e = eh * s
  const br = AD.barR * s
  return (
    <g>
      {slider && <rect x={sx1} y={y - hh} width={AD.depth * s} height={2 * hh} rx={1.2 * s} fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.8" />}
      {bar && kind === 'spring' && <BarEnd cx={x} cy={y} r={br} />}
      {bar && kind === 'fixed' && <circle cx={x} cy={y} r={br * 1.1} fill="url(#ps-hatch)" stroke={STEEL_EDGE} strokeWidth="0.8" />}
      <rect x={sx2 - 0.4 * s} y={y - e} width={(AD.reach + 0.4) * s} height={2 * e} rx={e} fill="rgba(180,196,206,0.14)" stroke="#9fb4c2" strokeWidth="1" strokeDasharray="4 3" />
    </g>
  )
}
// x of the ear's far end (bar centre + 2 mm) for annotation
const earEnd = (x, s) => x + (AD.reach - AD.barAt) * s

// Concealed lug fold (classic, concealed tail) in section with a thinned
// wrap. Grain surface y0; channel radius r round (cx, y0 + tw + r); wrap
// ply tw; body thickness tf(x) (px); the tail returns under the body over
// cv + tail (px), feathered; skive ramp a (px) on the body underside; a
// lining tl (with an optional reinforcement band vel) under it to xR.
function FoldC({ cx, y0, r, tw, tf, t, tl, xR, cv, tail, a, vel = 0, open = true }) {
  const th = tf || (() => t)
  const R = r + tw
  const cy = y0 + R
  const ub = (x) => (x < cx + a ? y0 + tw + ((th(cx + a) - tw) * (x - cx)) / a : y0 + th(x))
  const tip = cx + cv + tail
  const xsT = []
  for (let x = cx + cv; x <= tip + 0.01; x += 2) xsT.push(x)
  const tailT = (x) => (x < cx + cv ? tw : x > tip ? 0 : tw * (1 - (x - cx - cv) / tail))
  const yc = ub(cx + cv)
  const bodyU = []
  for (let x = tip; x <= xR + 0.01; x += 3) bodyU.push(x)
  bodyU.push(xR)
  const outer =
    `M${xR} ${y0} L${cx} ${y0} A${R} ${R} 0 0 0 ${cx} ${cy + R} C${cx + cv * 0.55} ${cy + R} ${cx + cv * 0.62} ${yc + tw} ${cx + cv} ${yc + tw} ` +
    xsT.map((x) => `L${x.toFixed(1)} ${(ub(x) + tailT(x)).toFixed(1)}`).join(' ') +
    ' ' +
    bodyU.map((x) => `L${x.toFixed(1)} ${ub(x).toFixed(1)}`).join(' ') +
    ` Z`
  const back = []
  for (let x = cx + cv; x >= cx; x -= 1.5) back.push(x)
  const hole =
    `M${cx} ${y0 + tw} A${r} ${r} 0 0 0 ${cx} ${cy + r} C${cx + cv * 0.55} ${cy + r} ${cx + cv * 0.62} ${yc} ${cx + cv} ${yc} ` +
    back.map((x) => `L${x.toFixed(1)} ${ub(x).toFixed(1)}`).join(' ') +
    ' Z'
  // lining under the tail
  const la = cx + cv + 1
  const N = 40
  const topL = []
  for (let i = 0; i <= N; i++) {
    const x = la + ((xR - la) * i) / N
    topL.push([x, ub(x) + tailT(x) + vel])
  }
  const fe = Math.min(30, (xR - la) * 0.3)
  const thick = (x) => Math.max(tl * 0.25, Math.min(tl, tl * (0.25 + (0.75 * (x - la)) / fe)))
  const botL = topL.map(([x, yy]) => [x, yy + thick(x)]).reverse()
  return (
    <g>
      <path d={`${outer} ${hole}`} fill="url(#sk-topS)" fillRule="evenodd" />
      <path d={outer} fill="none" stroke={LEDGE} strokeWidth="0.8" strokeLinejoin="round" />
      <path d={hole} fill="none" stroke={LEDGE} strokeWidth="0.8" strokeLinejoin="round" />
      {vel > 0 && <polyline points={pts(topL.map(([x, yy]) => [x, yy - vel / 2]))} fill="none" stroke={C.velodon} strokeWidth={vel} />}
      <polygon points={pts([...topL, ...botL])} fill="url(#sk-linS)" stroke={LINEDGE} strokeWidth="0.8" strokeLinejoin="round" />
      {!open && <line x1={xR} y1={y0} x2={xR} y2={ub(xR) + vel + tl} stroke={LEDGE} strokeWidth="0.8" />}
    </g>
  )
}
// geometry helper for FoldC annotation
const foldCgeo = ({ cx, y0, r, tw }) => ({ cy: y0 + r + tw, R: r + tw, bottom: y0 + 2 * (r + tw) })

// Fixed-adapter fold in section: the top wraps a bar at (cx, cy) (channel
// radius r), its tail laid back OVER the end of a lining that starts short
// at lA (skived over skL), the tail skived thin (te) and ending in a painted
// edge at tE. Body t, wrap underside tb, lining tl, to xR.
function FoldX({ cx, cy, r, t, tb, te, tl, lA, skL, tE, xR, cv, peel = 0 }) {
  const y1 = cy - r
  const y0 = y1 - t
  const B = cy + r + tb
  const R = (2 * r + t + tb) / 2
  const lin = (x) => (x <= lA ? 0 : x >= lA + skL ? tl : tl * (0.15 + (0.85 * (x - lA)) / skL))
  // peel: the tail hangs away from the body near the fold (fault drawing)
  const drop = (x) => (peel ? peel * Math.max(0, 1 - (x - cx - cv) / (lA - cx - cv + 30)) : 0)
  const xs = []
  for (let x = cx + cv; x < tE; x += 2) xs.push(x)
  xs.push(tE)
  const lower = xs.map((x) => [x, y1 + lin(x) + te + drop(x)])
  const upper = xs
    .filter((x) => x >= lA || peel)
    .reverse()
    .map((x) => [x, y1 + lin(x) + drop(x)])
  const outer =
    `M${xR} ${y0} L${cx} ${y0} A${R} ${R} 0 0 0 ${cx} ${B} C${cx + cv * 0.55} ${B} ${cx + cv * 0.62} ${y1 + te + drop(cx + cv)} ${cx + cv} ${y1 + te + drop(cx + cv)} ` +
    lower.map((p) => `L${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ') +
    ' ' +
    upper.map((p) => `L${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ') +
    (peel ? ` L${cx + cv} ${y1 + drop(cx + cv)} L${cx + cv} ${y1}` : '') +
    ` L${peel ? cx + cv : lA} ${y1} L${xR} ${y1} Z`
  const hole = `M${cx} ${y1} A${r} ${r} 0 0 0 ${cx} ${cy + r} C${cx + cv * 0.55} ${cy + r} ${cx + cv * 0.62} ${y1 + drop(cx + cv)} ${cx + cv} ${y1 + drop(cx + cv)} L${cx + cv} ${y1} Z`
  const linTop = []
  for (let x = lA; x <= xR; x += 3) linTop.push([x, y1])
  linTop.push([xR, y1])
  const linBot = linTop.map(([x]) => [x, y1 + lin(x)]).reverse()
  return (
    <g>
      <path d={`${outer} ${hole}`} fill="url(#sk-topS)" fillRule="evenodd" />
      <path d={outer} fill="none" stroke={LEDGE} strokeWidth="0.8" strokeLinejoin="round" />
      <path d={hole} fill="none" stroke={LEDGE} strokeWidth="0.8" strokeLinejoin="round" />
      {!peel && <line x1={cx + cv} y1={y1} x2={lA} y2={y1} stroke={LEDGE} strokeWidth="0.6" opacity="0.8" />}
      <polygon points={pts([...linTop, ...linBot])} fill="url(#sk-linS)" stroke={LINEDGE} strokeWidth="0.8" strokeLinejoin="round" />
      <line x1={tE} y1={y1 + lin(tE) + drop(tE) - 0.5} x2={tE} y2={y1 + lin(tE) + te + drop(tE) + 0.5} stroke={C.paint} strokeWidth="2.6" strokeLinecap="round" />
    </g>
  )
}
const foldXgeo = ({ cx, cy, r, t, tb, te, tl, lA, skL }) => {
  const y1 = cy - r
  const lin = (x) => (x <= lA ? 0 : x >= lA + skL ? tl : tl * (0.15 + (0.85 * (x - lA)) / skL))
  return { y1, y0: y1 - t, B: cy + r + tb, R: (2 * r + t + tb) / 2, lin, under: (x, tE) => y1 + lin(x) + (x <= tE ? te : 0) }
}

/* ---- quick-release hardware (as in the QR lesson) ---- */
function QRBar({ x = 0, y = 0, ang = 0, L, r, kx, kdir = 1, knob = true }) {
  const pl = r * 1.25
  const pr = r * 0.5
  const kw = r * 0.85
  const kh = r * 1.5
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      <rect x={-pl} y={-pr} width={pl + 2} height={pr * 2} rx={pr * 0.7} fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.6" />
      <rect x={L - 2} y={-pr} width={pl + 2} height={pr * 2} rx={pr * 0.7} fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.6" />
      <rect x={0} y={-r} width={L} height={r * 2} rx={r * 0.5} fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.7" />
      {[r * 0.9, L - r * 0.9].map((v) => (
        <line key={v} x1={v} y1={-r} x2={v} y2={r} stroke={STEEL_EDGE} strokeWidth="0.8" />
      ))}
      <rect x={kx - r * 2.4} y={-r * 0.22} width={r * 2.4 + kw / 2} height={r * 0.44} rx={r * 0.22} fill="#2d3940" />
      {knob && <rect x={kx - kw / 2} y={kdir > 0 ? 0 : -(r + kh)} width={kw} height={r + kh} rx={kw / 2} fill="url(#sk-steelH)" stroke={STEEL_EDGE} strokeWidth="0.7" />}
    </g>
  )
}
function QREnd({ cx, cy, r, kh, kdir = 1 }) {
  const kw = r * 0.95
  return (
    <g>
      <rect x={cx - kw / 2} y={kdir > 0 ? cy : cy - r - kh} width={kw} height={r + kh} rx={kw / 2} fill="url(#sk-steelH)" stroke={STEEL_EDGE} strokeWidth="0.7" />
      <BarEnd cx={cx} cy={cy} r={r} />
    </g>
  )
}
// Lug loop with a notch through its back layer (QR lesson geometry).
function QRLoop({ cx, cy, r, t, tb = t, xR, tl, notch = 0, seal, open }) {
  const y1 = cy - r
  const cv = r * 2.6
  const tail = r * 3.6
  const ts = t * 0.45
  const B = cy + r + tb
  const R = (2 * r + t + tb) / 2
  const outer =
    `M${cx} ${y1 - t} A${R} ${R} 0 0 0 ${cx} ${B} ` +
    `C${cx + cv * 0.55} ${B} ${cx + cv * 0.62} ${y1 + ts} ${cx + cv} ${y1 + ts} L${cx + cv + tail} ${y1}`
  const hole = `M${cx} ${y1} A${r} ${r} 0 0 0 ${cx} ${cy + r} C${cx + cv * 0.55} ${cy + r} ${cx + cv * 0.62} ${y1} ${cx + cv} ${y1} Z`
  const n2 = notch / 2
  return (
    <g>
      <path d={`${outer} L${cx} ${y1} Z ${hole}`} fill="url(#sk-topS)" fillRule="evenodd" />
      <path d={outer} fill="none" stroke={LEDGE} strokeWidth="0.8" strokeLinejoin="round" />
      <path d={hole} fill="none" stroke={LEDGE} strokeWidth="0.8" />
      <Ply x1={cx} x2={xR} y={y1 - t} t={t} open={open ? 'lr' : 'l'} />
      {tl ? <Ply x1={cx + cv + 2} x2={xR} y={y1 + 2} t={tl} k="lining" skL={[r * 2.4, tl * 0.25]} cut="top" open={open ? 'r' : ''} /> : null}
      {notch > 0 && <rect x={cx - n2} y={cy + r - 0.8} width={notch} height={tb + 1.6} fill={C.ground} />}
      {notch > 0 && seal && (
        <g stroke={C.paint} strokeWidth="2.4" strokeLinecap="round">
          <line x1={cx - n2 + 0.6} y1={cy + r + 0.4} x2={cx - n2 + 0.6} y2={B - 0.4} />
          <line x1={cx + n2 - 0.6} y1={cy + r + 0.4} x2={cx + n2 - 0.6} y2={B - 0.4} />
        </g>
      )}
    </g>
  )
}

// Inside-jaw calipers measuring a gap between faces xa and xb, jaws hanging
// from a beam above, tips at y.
function SlotCal({ xa, xb, y, by, reading }) {
  const st = { stroke: STEEL_EDGE, strokeWidth: 0.8 }
  return (
    <g>
      <rect x={xa - 26} y={by} width={xb - xa + 30} height={12} rx="2" fill="url(#sk-steel)" {...st} />
      {Array.from({ length: Math.floor((xb - xa + 20) / 6) }, (_, i) => (
        <line key={i} x1={xa - 20 + i * 6} y1={by + 12} x2={xa - 20 + i * 6} y2={by + (i % 5 ? 9 : 7)} stroke={STEEL_EDGE} strokeWidth="0.6" />
      ))}
      <path d={`M${xa} ${by + 10} L${xa + 12} ${by + 10} L${xa + 12} ${y - 22} L${xa + 4} ${y} L${xa} ${y} Z`} fill="url(#sk-steelH)" {...st} />
      <path d={`M${xb} ${by + 2} L${xb - 12} ${by + 2} L${xb - 12} ${y - 22} L${xb - 4} ${y} L${xb} ${y} Z`} fill="url(#sk-steelH)" {...st} />
      <rect x={xb - 16} y={by - 8} width={96} height={30} rx="4" fill="url(#sk-steel)" {...st} />
      <rect x={xb + 4} y={by - 3} width={62} height={20} rx="2" fill="#1f2a24" stroke="#3b4850" />
      <T x={xb + 35} y={by + 12} a="middle" s={12} c="#a5d6a7" mono>
        {reading}
      </T>
    </g>
  )
}

/* 1 · Identify the adapter */
function SwAdapter() {
  const s = 4
  const k = 7
  const A = { cx: 76, y: 52 }
  const B = { cx: 306, y: 52 }
  const sideY = 172
  const ax = 80
  const bxx = 310
  const fc = { r: 1.0 * k, tw: 0.7 * k, t: 1.3 * k, tl: 0.8 * k, cv: 2.4 * k, tail: 7 * k, a: 2.2 * k }
  const gA = foldCgeo({ cx: ax, y0: sideY - fc.r - fc.tw, r: fc.r, tw: fc.tw })
  const fx = { r: 1.0 * k, t: 1.3 * k, tb: 0.7 * k, te: 0.5 * k, tl: 0.8 * k, cv: 2.4 * k, lA: bxx + 5 * k, skL: 3 * k, tE: bxx + 18 * k }
  return (
    <Fig h={330} view="Plan + side view · the two adapter types" scale="plan ×4 · side ×7">
      <PsDefs />
      <Tag x={14} y={38}>Spring-bar adapter</Tag>
      <Tag x={466} y={38} a="end">
        Fixed adapter
      </Tag>
      <Sep x1={240} y1={28} x2={240} y2={322} />

      {/* plans */}
      <AdapterPlan cx={A.cx} y={A.y} s={s} slot={22} kind="spring" />
      <AdapterPlan cx={B.cx} y={B.y} s={s} slot={22} kind="fixed" />
      <Lead p={[A.cx + 48, A.y + 6]} t={[140, 50]} text="slider" s={10.5} sub="into the case slot" />
      <Lead p={[A.cx + 30, A.y + 6.2 * s]} t={[140, 96]} text="own spring bar" s={10.5} sub="sprung pins" />
      <Lead p={[A.cx - 48, A.y + 7.5 * s]} t={[22, 104]} text="ears" a="start" s={10.5} />
      <Lead p={[B.cx + 48, B.y + 6]} t={[370, 50]} text="same slider" s={10.5} sub="and ears" />
      <Lead p={[B.cx + 30, B.y + 6.2 * s]} t={[370, 96]} text="bar built in" s={10.5} sub="one with the ears" />

      {/* side views */}
      <FoldC cx={ax} y0={sideY - fc.r - fc.tw} r={fc.r} tw={fc.tw} t={fc.t} tl={fc.tl} xR={226} cv={fc.cv} tail={fc.tail} a={fc.a} />
      <Brk x={226} y={sideY - fc.r - fc.tw} h={fc.t + fc.tl + 2} />
      <AdapterSide x={ax} y={sideY} s={k} kind="spring" />
      <FoldX cx={bxx} cy={sideY} r={fx.r} t={fx.t} tb={fx.tb} te={fx.te} tl={fx.tl} lA={fx.lA} skL={fx.skL} tE={fx.tE} xR={460} cv={fx.cv} />
      <Brk x={460} y={sideY - fx.r - fx.t} h={fx.t + fx.tl + fx.te + 2} />
      <AdapterSide x={bxx} y={sideY} s={k} kind="fixed" />
      <Lead p={[ax, sideY]} t={[30, 222]} text="removable" a="start" s={10.5} c={C.steel} sub="bar tool, as on any watch" />
      <Lead p={[ax + fc.cv + 20, gA.cy - 2]} t={[140, 136]} text="ordinary fold" s={10.5} sub="tail hidden inside" />
      <Lead p={[bxx, sideY]} t={[262, 222]} text="solid bar" a="start" s={10.5} c={C.steel} sub="the fold is closed round it" />
      <Lead p={[fx.tE - 20, sideY - fx.r + fx.tl + 3]} t={[392, 136]} text="tail over the lining" a="end" s={10.5} sub="visible, wrist side" />

      <Sep x1={14} y1={250} x2={466} y2={250} />
      <Note x={14} y={270} s={10.5} lh={14} head="A normal lug strap" hc={C.text} lines={['Channel and fold as for a watch;', 'the strap comes off and swaps.', 'QR bars work — notch at the fold.']} />
      <Note x={252} y={270} s={10.5} lh={14} head="Strap and adapter are one part" hc={C.text} lines={['The top is folded round the bar', 'and sewn; they never separate.', 'One maker builds its Ultra straps so.']} />
    </Fig>
  )
}

/* 2 · Measure the slot, not the watch */
function SwSlot() {
  const s = 4.6
  const cx = 334
  const y = 190
  const xa = cx - 11 * s
  const xb = cx + 11 * s
  const rows = [
    ['38 · 40 · 41 mm, and 42 mm on recent models', '20 or 22'],
    ['44 · 45 · 46 · 49 mm', '22 or 24'],
    ['Ultra', '26'],
  ]
  return (
    <Fig h={322} view="Plan · measuring the strap slot" scale="adapter ×4.6">
      <Box x={14} y={28} w={180} h={186} title="not the watch" c={C.ruby} tc={C.ruby} />
      <Verdict x={178} y={42} ok={false} />
      {(() => {
        const wx = 98
        const wy = 124
        const w = 76
        const h = 90
        return (
          <g>
            <rect x={wx - w / 2} y={wy - h / 2} width={w} height={h} rx="20" fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="1" />
            <rect x={wx - w / 2 + 6} y={wy - h / 2 + 6} width={w - 12} height={h - 12} rx="15" fill="#12161a" stroke="#4e5f6a" strokeWidth="0.8" />
            <rect x={wx + w / 2 - 1} y={wy - 18} width={5} height={14} rx="2" fill="url(#sk-steelH)" stroke={STEEL_EDGE} strokeWidth="0.6" />
            {[wy - h / 2, wy + h / 2].map((yy) => (
              <rect key={yy} x={wx - 26} y={yy - 2} width={52} height={4} rx="2" fill={C.hole} stroke="#4e5f6a" strokeWidth="0.6" />
            ))}
            <Dim a={[wx - w / 2, wy - h / 2]} b={[wx - w / 2, wy + h / 2]} off={12} text="45" />
            <T x={30} y={wy + 4} a="middle" s={10} c={C.faint}>
              case
            </T>
            <Lead p={[wx + 20, wy - h / 2]} t={[150, 66]} text="slot" s={10.5} />
            <T x={104} y={192} a="middle" s={10.5} c={C.text}>
              the case size names the watch,
            </T>
            <T x={104} y={206} a="middle" s={10.5} c={C.ruby}>
              not the strap width
            </T>
          </g>
        )
      })()}

      <Box x={202} y={28} w={266} h={186} title="calipers on the slot" c={C.emerald} tc={C.emerald} />
      <Verdict x={452} y={42} ok />
      <AdapterPlan cx={cx} y={y} s={s} slot={22} kind="spring" dir={-1} />
      <SlotCal xa={xa} xb={xb} y={165} by={66} reading="22.0" />
      <Dim a={[xa, y + 2]} b={[xb, y + 2]} off={10} text="slot = strap lug width" flip />
      <Lead p={[xa + 4, 128]} t={[270, 112]} text="inside jaws" a="end" s={10.5} sub="on the ears" />


      <Sep x1={14} y1={226} x2={466} y2={226} />
      <Tag x={14} y={244}>One maker's fittings</Tag>
      <Tag x={466} y={244} a="end">
        strap slot, mm
      </Tag>
      {rows.map(([a, b], i) => (
        <g key={i}>
          <T x={24} y={266 + i * 18} s={11} c={C.text}>
            {a}
          </T>
          <line x1={300} y1={262 + i * 18} x2={392} y2={262 + i * 18} stroke={C.line} strokeWidth="1" strokeDasharray="2 3" />
          <T x={460} y={266 + i * 18} a="end" s={11} c={C.brass} mono>
            {b}
          </T>
        </g>
      ))}
      <T x={24} y={316} s={10} c={C.faint}>
        Two widths fit some sizes: the slot you measure decides which.
      </T>
    </Fig>
  )
}

/* 3 · Draft the pattern */
function SwPattern() {
  const s = 2.6
  const ML = { x: 104, y: 92, s }
  const MS = { x: 104, y: 214, s }
  const oL = { x0: -20, x1: 115, w0: 24, w1: 18, taper: [8, 95], tip: 'ogive', tipLen: 14 }
  const oS = { x0: -20, x1: 100, w0: 24, w1: 18, taper: [8, 75], tip: 'square' }
  const ghost = { ...oL, w1: 22 }
  return (
    <Fig h={340} view="Plan · both pieces, unfolded" scale="24 → 18 · 115 / 75">
      <StrapPlan T={ML} o={oL} face="card" centre zones={[{ from: 0, to: 8, k: 'hl' }]} folds={[{ x: 0 }]} holes={{ n: 7, pitch: 7, fromTip: 25 }} />
      <path d={pathOf(outline(ghost), ML)} fill="none" stroke={C.dim} strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
      <Dim a={P(ML, -20, -12)} b={P(ML, 0, -12)} off={-12} text="20" flip />
      <Dim a={P(ML, 0, -12)} b={P(ML, 8, -12)} off={-12} />
      <T x={P(ML, 4, 0)[0]} y={P(ML, 0, -12)[1] - 16} a="middle" s={10.5} mono c={C.text}>
        8
      </T>
      <Dim a={P(ML, 0, -12)} b={P(ML, 115, -12)} off={-30} text="115" flip />
      <Dim a={P(ML, -20, -12)} b={P(ML, -20, 12)} off={10} text="24" />
      <path d={`M${P(ML, -20, -12)[0] + 8} ${P(ML, -20, -12)[1]} v8 h-8`} fill="none" stroke={C.emerald} strokeWidth="1" />
      <T x={P(ML, 0, 0)[0]} y={P(ML, 0, 14.5)[1] + 12} a="middle" s={10}>
        lug fold
      </T>
      <Lead p={P(ML, -10, 8)} t={[20, 150]} text="square to the slot" a="start" c={C.emerald} s={10.5} sub="width = slot, exactly" />
      <Lead p={P(ML, 4, 10)} t={[160, 150]} text="8 mm parallel" s={10.5} sub="full slot width" />
      <Lead p={P(ML, 60, 10.2)} t={[278, 150]} text="taper 24 → 18" s={10.5} sub="6 mm, harder than a watch" />
      <Lead p={P(ML, 80, -10.6)} t={[392, 52]} text="a watch strap's 2 mm" s={10} c={C.dim} a="end" />

      <StrapPlan
        T={MS}
        o={oS}
        face="card"
        centre
        zones={[{ from: 0, to: 8, k: 'hl' }]}
        folds={[{ x: 0 }, { x: 75 }, { x: 65, c: C.brass }]}
        slot={{ x: 75, len: 10 }}
      />
      <T x={P(MS, 75, 0)[0] + 4} y={P(MS, 0, -11.5)[1] - 4} s={10}>
        buckle fold · slot
      </T>
      <T x={P(MS, 65, 0)[0] - 4} y={P(MS, 0, -11.5)[1] - 4} a="end" s={10} c={C.brass}>
        keeper line
      </T>
      <Dim a={P(MS, -20, 12)} b={P(MS, 0, 12)} off={12} text="20" flip />
      <Dim a={P(MS, 0, 12)} b={P(MS, 75, 12)} off={12} text="75" flip />
      <Dim a={P(MS, 75, 12)} b={P(MS, 100, 12)} off={12} text="≥ 25" flip />
      <Dim a={P(MS, 100, -9)} b={P(MS, 100, 9)} off={-10} text="18" />

      <Sep x1={14} y1={268} x2={466} y2={268} />
      <Tag x={14} y={286}>Slot → tail</Tag>
      <T x={14} y={304} s={11} c={C.text} mono>
        20→16 · 22→18 · 24→18
      </T>
      <T x={14} y={320} s={11} c={C.text} mono>
        Ultra 26→20
      </T>
      <Tag x={466} y={286} a="end">
        Lengths, long / short
      </Tag>
      <T x={466} y={304} a="end" s={11} c={C.text} mono>
        105/65 · 115/75 · 125/85
      </T>
      <T x={466} y={320} a="end" s={11} c={C.brass} mono>
        Ultra 100/60 · 110/70 · 120/80
      </T>
      <T x={466} y={335} a="end" s={10} c={C.faint}>
        Ultra: 5 mm shorter each
      </T>
    </Fig>
  )
}

/* 4 · Budget the fold thickness */
function SwThickness() {
  const s = 2.7
  const k = 10
  const cx = 52
  const y0 = 64
  const L = 115 * s
  const xT = cx + L
  const tf = (x) => (1.5 - 0.7 * Math.max(0, Math.min(1, (x - cx) / L))) * k
  const vel = 0.2 * k
  const tl = 0.8 * k
  const bottomAt = (x) => y0 + tf(x) + vel + tl
  const xa = cx + 22 * s
  const xb = xT - 6 * s
  // sample panels
  const kk = 9
  const sample = (ox, ok) => {
    const bx = ox + 70
    const by = 254
    const r = 1.0 * kk
    const tw = (ok ? 0.7 : 1.5) * kk
    const t = (ok ? 1.5 : 1.8) * kk
    const y0s = by - r - tw
    const top = by - AD.eh * kk
    const bot = by + AD.eh * kk
    const g = foldCgeo({ cx: bx, y0: y0s, r, tw })
    const proud = !ok
    return (
      <g>
        <FoldC cx={bx} y0={y0s} r={r} tw={tw} t={t} tl={(ok ? 0.8 : 1.2) * kk} vel={0.2 * kk} xR={ox + 196} cv={2.4 * kk} tail={6 * kk} a={2 * kk} open={false} />
        <AdapterSide x={bx} y={by} s={kk} kind="spring" />
        {[top, bot].map((yy) => (
          <line key={yy} x1={bx - 6.4 * kk} y1={yy} x2={ox + 206} y2={yy} stroke={ok ? C.emerald : C.ruby} strokeWidth="0.8" strokeDasharray="5 3" opacity="0.8" />
        ))}
        {proud && (
          <g>
            <path d={`M${bx - 10} ${g.cy - g.R} A${g.R} ${g.R} 0 0 0 ${bx - g.R} ${g.cy}`} fill="none" stroke={C.ruby} strokeWidth="2.6" opacity="0.9" />
            <path d={`M${bx - g.R} ${g.cy} A${g.R} ${g.R} 0 0 0 ${bx - 10} ${g.cy + g.R}`} fill="none" stroke={C.ruby} strokeWidth="2.6" opacity="0.9" />
          </g>
        )}
      </g>
    )
  }
  return (
    <Fig h={330} view="Section · long piece  ·  sample fold" scale="thickness ×10 · sample ×9">
      <PsDefs />
      <FoldC cx={cx} y0={y0} r={1.0 * k} tw={0.7 * k} tf={tf} tl={tl} vel={vel} xR={xT} cv={2.2 * k} tail={11 * s} a={2 * k} open={false} />
      <BarEnd cx={cx} cy={y0 + 1.7 * k} r={0.9 * k} />
      <Dim a={[xa, y0]} b={[xa, bottomAt(xa)]} off={-12} />
      <line x1={xa + 12} y1={y0 - 4} x2={xa + 12} y2={y0 - 16} stroke={C.dim} strokeWidth="0.6" />
      <T x={xa + 16} y={y0 - 30} s={11} mono c={C.text}>
        2.5 at the lug
      </T>
      <T x={xa + 16} y={y0 - 16} s={10} mono c={C.brass}>
        Ultra 3.0
      </T>
      <Dim a={[xb, y0]} b={[xb, bottomAt(xb)]} off={-14} />
      <T x={xb + 20} y={y0 + 12} s={11} mono c={C.text}>
        1.8
      </T>
      <T x={xb + 20} y={y0 + 25} s={10} mono c={C.brass}>
        Ultra 2.0
      </T>
      <Lead p={[cx + 70 * s, y0 + 3]} t={[cx + 70 * s, 46]} text="top" a="middle" s={10.5} />
      <Lead p={[cx + 40 * s, y0 + tf(cx + 40 * s) + 1]} t={[200, 116]} text="reinforcement" s={10.5} c={C.steel} a="end" />
      <Lead p={[cx + 55 * s, bottomAt(cx + 55 * s) - 3]} t={[232, 116]} text="lining" s={10.5} />
      <Lead p={[cx - 6, y0 + 22]} t={[24, 116]} text="at the lug" a="start" s={10} sub="the fold enters the slot" />
      <T x={466} y={112} a="end" s={10} c={C.faint}>
        thinning steadily to the tail
      </T>

      <Sep x1={14} y1={138} x2={466} y2={138} />
      <Box x={14} y={146} w={222} h={178} title="sample fold, as built" c={C.emerald} tc={C.emerald} />
      <Verdict x={220} y={160} ok />
      <Box x={244} y={146} w={224} h={178} title="fold not skived" c={C.ruby} tc={C.ruby} />
      <Verdict x={452} y={160} ok={false} />
      {sample(14, true)}
      {sample(244, false)}
      {/* calipers on the sample */}
      {(() => {
        const x = 178
        const ytop = 254 - 1.7 * kk
        const ybot = ytop + (1.5 + 0.2 + 0.8) * kk
        return (
          <g>
            <rect x={x + 16} y={ytop - 30} width={10} height={ybot - ytop + 52} rx="2" fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.7" />
            <rect x={x - 8} y={ytop - 6} width={34} height={6} fill="url(#sk-steelH)" stroke={STEEL_EDGE} strokeWidth="0.7" />
            <rect x={x - 8} y={ybot} width={34} height={6} fill="url(#sk-steelH)" stroke={STEEL_EDGE} strokeWidth="0.7" />
            <rect x={x - 22} y={ytop - 30} width={46} height={18} rx="2" fill="#1f2a24" stroke="#3b4850" />
            <T x={x + 1} y={ytop - 17} a="middle" s={11} c="#a5d6a7" mono>
              2.50
            </T>
          </g>
        )
      })()}
      <T x={24} y={304} s={10.5} c={C.text}>
        loop inside the adapter's faces
      </T>
      <T x={24} y={318} s={10} c={C.faint}>
        glue a sample, push it in, then cut
      </T>
      <T x={254} y={304} s={10.5} c={C.ruby}>
        proud of the faces: it jams
      </T>
      <T x={254} y={318} s={10} c={C.faint}>
        skive the fold, thin the stack
      </T>
    </Fig>
  )
}

/* 5 · Spring-bar adapter: a normal fold */
function SwSpringbar() {
  const s = 4.2
  const cx = 150
  const ay = 50
  const xli = cx - 11 * s
  const xri = cx + 11 * s
  const barY = 116
  const r = 0.9 * s
  const kmm = 4
  const kxp = xli + (22 - kmm) * s
  const fy = 152 // fold edge
  const chY = fy + 1.7 * s
  const sy1 = 256
  const MS = { x: 0, y: 0, s }
  const mm = (v) => v / s
  const seamA = xli + 3 * s
  const seamB = xri - 3 * s
  const rowY = fy + 7 * s
  return (
    <Fig h={330} view="Exploded · wrist side up  ·  section" scale="plan ×4.2 · section ×10">
      <PsDefs />
      <AdapterPlan cx={cx} y={ay} s={s} slot={22} kind="none" holes />
      <QRBar x={xli} y={barY} L={xri - xli} r={r} kx={kxp - xli} kdir={1} />
      {/* strap, lining side up */}
      <rect x={xli} y={fy} width={xri - xli} height={sy1 - fy} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="0.9" />
      <path d={`M${xli - 3} ${sy1} l${(xri - xli + 6) / 4} -5 l${(xri - xli + 6) / 4} 5 l${(xri - xli + 6) / 4} -5 l${(xri - xli + 6) / 4} 5`} fill="none" stroke={C.dim} strokeWidth="1" />
      <rect x={xli + 1} y={chY - r - 0.6} width={xri - xli - 2} height={2 * r + 1.2} rx={r} fill="none" stroke={C.steel} strokeWidth="1" strokeDasharray="3 2" />
      <rect x={kxp - 2.5 * s} y={chY - 0.5 * s} width={5 * s} height={1 * s} rx={0.5 * s} fill={C.ground} stroke={C.paint} strokeWidth="1" />
      <Seam M={MS} run={[[mm(seamA), mm(rowY)], [mm(seamA), mm(sy1 - 4)]]} w={1.4} c="#c9b48d" />
      <Seam M={MS} run={[[mm(seamB), mm(rowY)], [mm(seamB), mm(sy1 - 4)]]} w={1.4} c="#c9b48d" />
      <Seam M={MS} run={[[mm(seamA), mm(rowY)], [mm(seamB), mm(rowY)]]} w={1.4} c="#c9b48d" />
      {/* alignment */}
      <g stroke={C.brass} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.9">
        {[xli - AD.ear * s * 0.5, xri + AD.ear * s * 0.5].map((x) => (
          <line key={x} x1={x} y1={ay + 6.2 * s + 3} x2={x} y2={barY - 4} />
        ))}
        {[xli + 1, xri - 1].map((x) => (
          <line key={x} x1={x} y1={barY + r + 2} x2={x} y2={chY - r - 2} />
        ))}
      </g>
      <Arrow a={[cx - 20, barY + 12]} b={[cx - 20, chY - 8]} w={1.6} />
      <Arrow a={[cx + 20, barY - 8]} b={[cx + 20, ay + 6.2 * s + 4]} w={1.6} />
      <Lead p={[xli - 4, ay + 6]} t={[86, 42]} text="adapter" a="end" s={10.5} sub="slider + ears" />
      <Lead p={[xli - AD.ear * s * 0.5, ay + 6.2 * s]} t={[86, 86]} text="pin holes" a="end" s={10.5} />
      <Lead p={[xli + 6, barY]} t={[86, 122]} text="QR spring bar" a="end" s={10.5} c={C.steel} />
      <Lead p={[xli + 2, chY]} t={[86, 168]} text="channel" a="end" s={10.5} sub="formed as usual" />
      <Lead p={[kxp, barY + r + 4]} t={[216, 98]} text="QR knob" s={10.5} sub="wrist side" />
      <Lead p={[kxp + 2.5 * s, chY]} t={[216, 160]} text="notch 1 × 5" s={10.5} sub="at the fold" c={C.text} />
      <Lead p={[seamB, rowY + 16]} t={[214, 218]} text="seams clear" s={10.5} sub="of the channel" />
      <T x={14} y={322} s={10} c={C.faint}>
        Bar through the channel, pins into the ears: the same fold as a watch strap.
      </T>

      <Box x={304} y={28} w={164} h={276} title="section at the knob" />
      {(() => {
        const k = 10
        const qx = 346
        const qy = 132
        const rr = 0.9 * k + 1.5
        const t = 1.1 * k
        const tb = 0.6 * k
        return (
          <g>
            <QRLoop cx={qx} cy={qy} r={rr} t={t} tb={tb} xR={460} tl={0.7 * k} notch={1.0 * k} seal open />
            <Brk x={460} y={qy - rr - t} h={t + 0.7 * k + 3} />
            <QREnd cx={qx} cy={qy} r={0.9 * k} kh={1.2 * k} kdir={1} />
            <rect x={qx - (AD.barAt + AD.depth) * k} y={qy - (AD.h / 2) * k} width={AD.depth * k} height={AD.h * k} rx={1.2 * k} fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.8" />
            <rect x={qx - AD.barAt * k - 3} y={qy - AD.eh * k} width={(AD.barAt + 2) * k + 3} height={2 * AD.eh * k} rx={AD.eh * k} fill="rgba(180,196,206,0.14)" stroke="#9fb4c2" strokeWidth="1" strokeDasharray="4 3" />
            <Lead p={[qx, qy + rr + tb + 6]} t={[372, 206]} text="knob out" s={10.5} sub="through the notch" />
            <Lead p={[qx + 30, qy - rr - t + 2]} t={[386, 70]} text="top face uncut" s={10.5} c={C.emerald} />
            <Lead p={[qx - (AD.barAt + AD.depth / 2) * k, qy - 18]} t={[318, 70]} text="slider" a="start" s={10} />
            <T x={316} y={244} s={10.5} c={C.text}>
              Wrist side down: the
            </T>
            <T x={316} y={258} s={10.5} c={C.text}>
              knob reaches through
            </T>
            <T x={316} y={272} s={10.5} c={C.text}>
              the back layer only.
            </T>
            <T x={316} y={292} s={10} c={C.faint}>
              cut & sealed as in the QR lesson
            </T>
          </g>
        )
      })()}
    </Fig>
  )
}

/* 6 · Fixed adapter: fold round the bar */
function SwFixed() {
  const k = 8
  const cx = 104
  const cy = 92
  const f = { r: 1.0 * k, t: 1.3 * k, tb: 0.7 * k, te: 0.5 * k, tl: 0.8 * k, cv: 2.4 * k, lA: cx + 5 * k, skL: 3 * k, tE: cx + 18 * k }
  const g = foldXgeo({ cx, cy, ...f })
  const passes = []
  for (let x = cx + 7 * k; x < 452; x += 3 * k) passes.push(x)
  const foldEdge = cx - g.R
  // back view
  const s = 3.8
  const by = 246
  const ax0 = 34 // slider case face
  const bxp = ax0 + (AD.depth + AD.barAt) * s
  const fE = bxp - 1.7 * s
  const tEp = bxp + 18 * s
  const half = 13 * s
  const MS = { x: 0, y: 0, s }
  const mm = (v) => v / s
  return (
    <Fig h={340} view="Section on the side seam · back view" scale="×8 · back ×3.8">
      <PsDefs />
      <FoldX cx={cx} cy={cy} {...f} xR={460} />
      <Brk x={460} y={g.y0} h={f.t + f.tl + 2} />
      <AdapterSide x={cx} y={cy} s={k} kind="fixed" eh={2.4} />
      {passes.map((x) => (
        <Pass key={x} x={x} y1={g.y0} y2={g.under(x, f.tE)} w={1.4} run={4} />
      ))}
      <Dim a={[foldEdge, g.B + 2]} b={[f.tE, g.B + 2]} off={44} text="18–20 visible (photo est.)" flip />
      <Num x={cx - 14} y={50} n={3} />
      <Lead p={[cx + 2, g.y0 - 1]} t={[cx + 2, 46]} text="top wrapped round the bar" s={10.5} />
      <Num x={passes[6] - 14} y={50} n={5} />
      <Lead p={[passes[6] + 2, g.y0 - 2]} t={[passes[6] + 2, 46]} text="seams: tail + lining + top" s={10.5} />
      <Num x={f.lA + 2} y={124} n={2} />
      <Lead p={[f.lA + 2, g.y1 + 2]} t={[f.lA + 14, 120]} text="lining stops short" s={10.5} sub="skived to a feather" />
      <Num x={f.tE + 34} y={124} n={4} />
      <Lead p={[f.tE + 1, g.under(f.tE - 1, f.tE) - 1]} t={[f.tE + 46, 120]} text="tail laid over the lining" s={10.5} sub="skived thin, end painted" />
      <Lead p={[cx, cy]} t={[24, 122]} text="bar built in" a="start" s={10.5} c={C.steel} />

      <Sep x1={14} y1={172} x2={466} y2={172} />
      <Tag x={14} y={190}>Back · wrist side</Tag>
      <rect x={fE} y={by - half} width={330 - fE} height={2 * half} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="0.9" />
      <rect x={fE} y={by - half} width={tEp - fE} height={2 * half} rx="2" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.9" />
      <line x1={tEp} y1={by - half} x2={tEp} y2={by + half} stroke={C.paint} strokeWidth="3" />
      <line x1={bxp + 5 * s} y1={by - half + 3} x2={bxp + 5 * s} y2={by + half - 3} stroke={C.dim} strokeWidth="1" strokeDasharray="2 3" />
      <Brk x={330} y={by - half} h={2 * half} />
      {[by - half, by + half].map((yy) => (
        <line key={yy} x1={fE} y1={yy} x2={fE + 8 * s} y2={yy} stroke={C.paint} strokeWidth="3.4" strokeLinecap="round" />
      ))}
      <Seam M={MS} run={[[mm(bxp + 7 * s), mm(by - half + 3 * s)], [mm(326), mm(by - half + 3 * s)]]} w={1.6} c={ECRU} />
      <Seam M={MS} run={[[mm(bxp + 7 * s), mm(by + half - 3 * s)], [mm(326), mm(by + half - 3 * s)]]} w={1.6} c={ECRU} />
      <g transform={`rotate(-90 ${ax0} ${by})`}>
        <AdapterPlan cx={ax0} y={by} s={s} slot={26} kind="fixed" />
      </g>
      <Num x={fE + 18} y={by + half + 14} n={1} />
      <Lead p={[fE + 6 * s, by + half + 1]} t={[fE + 32, 314]} text="lug-end edges painted first" s={10.5} sub="the ears hide them later" />
      <Lead p={[tEp, by - half + 18]} t={[178, 186]} text="tail end, painted" s={10.5} a="start" />
      <Lead p={[bxp + 5 * s, by + 6]} t={[200, 298]} text="lining end (hidden)" s={10} c={C.dim} a="start" />
      <Note
        x={346}
        y={204}
        s={10.5}
        lh={15}
        lines={['1 paint the lug end', '2 stop the lining short', '3 wrap the top round', '4 tail over the lining', '5 sew through all three']}
      />
      <T x={346} y={292} s={10} c={C.faint}>
        Ultra: 26 mm slot
      </T>
    </Fig>
  )
}

/* 7 · Close the lug end */
function SwClose() {
  const s = 4
  const ay = 104
  const ax0 = 30
  const bxp = ax0 + (AD.depth + AD.barAt) * s
  const fE = bxp - 1.7 * s
  const earX = bxp + (AD.reach - AD.barAt) * s
  const rowX = earX + 3.5 * s
  const half = 13 * s
  const MS = { x: 0, y: 0, s }
  const mm = (v) => v / s
  const yA = ay - half + 3 * s
  const yB = ay + half - 3 * s
  const xEnd = 300
  // sections
  const k = 6
  const sec = (ox, ok) => {
    const cx = ox + 50
    const cy = 262
    const f = { r: 1.0 * k, t: 1.3 * k, tb: 0.7 * k, te: 0.5 * k, tl: 0.8 * k, cv: 2.4 * k, lA: cx + 5 * k, skL: 3 * k, tE: cx + 18 * k }
    const g = foldXgeo({ cx, cy, ...f })
    const rx = cx + 5.5 * k
    return (
      <g>
        <FoldX cx={cx} cy={cy} {...f} xR={ox + 206} peel={ok ? 0 : 9} />
        <AdapterSide x={cx} y={cy} s={k} kind="fixed" eh={2.4} />
        {ok ? (
          <Pass x={rx} y1={g.y0} y2={g.under(rx, f.tE)} w={1.6} run={4} />
        ) : (
          <Arrow a={[cx + f.cv + 14, cy + 12]} b={[cx + f.cv + 22, cy + 30]} c="ruby" w={1.6} />
        )}
        {ok && <Lead p={[rx, g.y0 - 2]} t={[rx + 12, 228]} text="the closing row" s={10.5} />}
        {!ok && <Lead p={[cx + f.cv + 6, cy + 4]} t={[cx + 60, 230]} text="the fold opens here" s={10.5} c={C.ruby} />}
      </g>
    )
  }
  return (
    <Fig h={330} view="Plan · top face  ·  sections" scale="plan ×4 · sections ×6">
      <PsDefs />
      <rect x={fE} y={ay - half} width={xEnd - fE} height={2 * half} rx="2" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.9" />
      <rect x={bxp - 0.9 * s} y={ay - half + 2} width={1.8 * s} height={2 * half - 4} rx={0.9 * s} fill="none" stroke={C.steel} strokeWidth="1" strokeDasharray="3 2" />
      <Brk x={xEnd} y={ay - half} h={2 * half} />
      <g transform={`rotate(-90 ${ax0} ${ay})`}>
        <AdapterPlan cx={ax0} y={ay} s={s} slot={26} kind="fixed" />
      </g>
      <path d={`M${xEnd - 6} ${yA} L${rowX} ${yA} L${rowX} ${yB} L${xEnd - 6} ${yB}`} fill="none" stroke={C.brass} strokeWidth="5" strokeLinejoin="round" opacity="0.22" />
      <Seam M={MS} run={[[mm(rowX), mm(yA)], [mm(xEnd - 6), mm(yA)]]} w={1.8} />
      <Seam M={MS} run={[[mm(rowX), mm(yB)], [mm(xEnd - 6), mm(yB)]]} w={1.8} />
      <Seam M={MS} run={[[mm(rowX), mm(yA)], [mm(rowX), mm(yB)]]} w={1.8} />
      <line x1={earX} y1={ay - half - 14} x2={earX} y2={ay - half + 2} stroke={C.dim} strokeWidth="0.7" opacity="0.7" />
      <Dim a={[earX, ay - half]} b={[rowX, ay - half]} off={-10} />
      <T x={(earX + rowX) / 2} y={ay - half - 18} a="middle" s={10.5} mono c={C.text}>
        3–4
      </T>
      <Lead p={[rowX, yA - 2]} t={[326, 36]} text="one row straight across" s={10.5} sub="3–4 below the ears (photo est.)" />
      <Lead p={[200, yA]} t={[318, 116]} text="joins the side seams" s={10.5} sub="a U-shaped closed seam" />
      <Lead p={[bxp, ay + half - 6]} t={[64, 172]} text="bar inside the fold" a="start" s={10} c={C.steel} />
      <Lead p={[earX, ay + half + 1]} t={[200, 172]} text="ear end" a="start" s={10} c={C.dim} />

      <Sep x1={14} y1={186} x2={466} y2={186} />
      <Box x={14} y={194} w={222} h={130} title="no closing row" c={C.ruby} tc={C.ruby} />
      <Verdict x={220} y={208} ok={false} />
      <Box x={244} y={194} w={224} h={130} title="row across the fold" c={C.emerald} tc={C.emerald} />
      <Verdict x={452} y={208} ok />
      {sec(14, false)}
      {sec(244, true)}
      <T x={24} y={316} s={10} c={C.faint}>
        flexing peels the fold from the bar side
      </T>
      <T x={254} y={316} s={10} c={C.faint}>
        top, tail and lining clamped together
      </T>
    </Fig>
  )
}

/* 8 · Check the fit */
function SwFit() {
  const s = 6
  const xe = 150 // case end face
  const yt = 100
  const yb = yt + 9.5 * s
  const ym = (yt + yb) / 2
  const bx = xe + AD.barAt * s
  const r = 1.0 * s
  const tw = 0.7 * s
  const y0 = ym - r - tw
  const g = foldCgeo({ cx: bx, y0, r, tw })
  const rot = 24
  const ang = (rot * Math.PI) / 180
  const wrapBot = [bx - g.R * Math.sin(ang), ym + g.R * Math.cos(ang)]
  const endView = (oy, proud) => {
    const es = 3.6
    const cxv = 390
    const yy = oy + 54
    const sh = (AD.h / 2) * es
    const eh = AD.eh * es
    const lh = (proud ? 2.8 : 1.7) * es
    const xl = cxv - (11 + AD.ear) * es
    const xli = cxv - 11 * es
    const xri = cxv + 11 * es
    return (
      <g>
        <rect x={xl - 8} y={yy - sh - 7} width={(22 + 2 * AD.ear) * es + 16} height={2 * sh + 14} rx="6" fill="rgba(180,196,206,0.18)" stroke="#6d7f8a" strokeWidth="0.8" />
        <rect x={xl} y={yy - sh} width={(22 + 2 * AD.ear) * es} height={2 * sh} rx="3" fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.8" />
        <rect x={xli} y={yy - lh} width={22 * es} height={2 * lh} rx={lh} fill="url(#sk-topS)" stroke={LEDGE} strokeWidth="0.8" />
        {[xl, xri].map((x) => (
          <rect key={x} x={x} y={yy - eh} width={AD.ear * es} height={2 * eh} rx="1.5" fill="url(#sk-steelH)" stroke={STEEL_EDGE} strokeWidth="0.8" />
        ))}
        <line x1={xl - 4} y1={yy - eh} x2={xri + AD.ear * es + 4} y2={yy - eh} stroke={proud ? C.ruby : C.emerald} strokeWidth="0.9" strokeDasharray="4 2" />
        {proud && <rect x={xli} y={yy - lh} width={22 * es} height={lh - eh} fill="rgba(194,88,99,0.45)" />}
      </g>
    )
  }
  return (
    <Fig h={330} view="Side view · seated  ·  end views" scale="side ×6 · ends ×3.6">
      <PsDefs />
      {/* case */}
      <path
        d={`M20 ${yt} L${xe - 18} ${yt} Q${xe} ${yt} ${xe} ${yt + 18} L${xe} ${yb - 18} Q${xe} ${yb} ${xe - 18} ${yb} L20 ${yb} Z`}
        fill="url(#sk-steel)"
        stroke={STEEL_EDGE}
        strokeWidth="1"
      />
      <path d={`M24 ${yt} Q${(20 + xe) / 2} ${yt - 12} ${xe - 20} ${yt} Z`} fill="url(#sk-glass)" stroke={C.steel} strokeWidth="0.8" />
      <path d={`M44 ${yb} Q${(44 + 126) / 2} ${yb + 18} 126 ${yb} Z`} fill="#3a4148" stroke={STEEL_EDGE} strokeWidth="0.8" />
      <path d={`M20 ${yt - 4} l5 ${(yb - yt + 8) * 0.3} l-5 ${(yb - yt + 8) * 0.4} l5 ${(yb - yt + 8) * 0.3}`} fill="none" stroke={C.dim} strokeWidth="1" />
      <rect x={xe - AD.depth * s - 1} y={ym - (AD.h / 2) * s - 1} width={AD.depth * s + 1} height={AD.h * s + 2} fill="#1a1f23" />
      <g transform={`rotate(${rot} ${bx} ${ym})`}>
        <FoldC cx={bx} y0={y0} r={r} tw={tw} t={1.4 * s} tl={0.8 * s} vel={0.2 * s} xR={bx + 128} cv={2.4 * s} tail={7 * s} a={2 * s} />
        <Brk x={bx + 128} y={y0} h={2.4 * s + 2} />
      </g>
      <AdapterSide x={bx} y={ym} s={s} kind="spring" />
      <Dim a={wrapBot} b={[xe - 6, yb - 3]} off={0} c={C.emerald} />
      <Lead p={[xe - 1.6 * s, ym - 10]} t={[160, 46]} text="seated: the detent clicks" a="start" s={10.5} sub="slider flush with the case end" />
      <Lead p={[(wrapBot[0] + xe - 6) / 2, (wrapBot[1] + yb - 3) / 2]} t={[178, 238]} text="clear of the case back" s={10.5} c={C.emerald} />
      <Lead p={[86, yb + 8]} t={[64, 238]} text="case back" a="end" s={10.5} c={C.dim} />
      <Lead p={[bx + 100 * Math.cos(ang) - 6, ym + 100 * Math.sin(ang) + 14]} t={[298, 210]} text="hangs freely" a="end" s={10.5} />
      <Lead p={[bx + 2 * s, ym - 14]} t={[236, 92]} text="ear (near side)" s={10} c={C.dim} />
      <Note x={14} y={274} s={10.5} lh={14} lines={['The adapter clicks home with the leather', 'flush in the slot and nothing proud; the', 'strap hangs without touching the case back.']} />

      <Box x={312} y={28} w={156} h={92} title="end view · flush" c={C.emerald} tc={C.emerald} />
      <Verdict x={452} y={42} ok />
      {endView(28, false)}
      <T x={390} y={112} a="middle" s={10} c={C.text}>
        leather within the ears
      </T>
      <Box x={312} y={128} w={156} h={92} title="end view · proud" c={C.ruby} tc={C.ruby} />
      <Verdict x={452} y={142} ok={false} />
      {endView(128, true)}
      <T x={390} y={212} a="middle" s={10} c={C.text}>
        rubs the case, won't click
      </T>
      <Box x={312} y={228} w={156} h={96} title="QR knob" c={C.emerald} tc={C.emerald} />
      <Verdict x={452} y={242} ok />
      {(() => {
        const k = 6
        const qx = 352
        const qy = 278
        const rr = 0.9 * k + 1.2
        return (
          <g>
            <QRLoop cx={qx} cy={qy} r={rr} t={1.1 * k} tb={0.6 * k} xR={460} tl={0.7 * k} notch={1.0 * k} seal open />
            <QREnd cx={qx} cy={qy} r={0.9 * k} kh={1.0 * k} kdir={1} />
            <T x={322} y={304} s={10} c={C.text}>
              knob in its notch,
            </T>
            <T x={322} y={317} s={10} c={C.text}>
              clear of the lining
            </T>
          </g>
        )
      })()}
    </Fig>
  )
}

export const FIGS = {
  'pi-pattern': PiPattern,
  'pi-tail': PiTail,
  'pi-prick': PiPrick,
  'pi-boxlug': PiBoxLug,
  'pi-boxtail': PiBoxTail,
  'pi-thread': PiThread,
  'pi-rivets': PiRivets,
  'sw-adapter': SwAdapter,
  'sw-slot': SwSlot,
  'sw-pattern': SwPattern,
  'sw-thickness': SwThickness,
  'sw-springbar': SwSpringbar,
  'sw-fixed': SwFixed,
  'sw-close': SwClose,
  'sw-fit': SwFit,
}
