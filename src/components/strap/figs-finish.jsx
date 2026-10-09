// Strap diagrams — finish: burnished & painted edges, spring-bar folds and
// QR notches, dye/seal/condition, and the ten QC checks. See AUTHORING.md.
//
// Most edge figures are EDGE PROFILES: the strap's edge cut across the width
// at true scale ×30-ish, showing the state of the fibres at that stage. The
// `Edge` helper below draws one from millimetre numbers (thicknesses, bevel,
// compressed band, coats …) so every stage is built from the same geometry.
import { useId } from 'react'
import { C, FONT, Fig, T, Note, Lead, Dim, Arrow, Num, Verdict, Tag, Sep } from './kit.jsx'
import { StrapPlan, Ply, Wrap, BarEnd, Buckle, SpringBar, CaseSide, Wrist } from './parts.jsx'
import { LONG, SHORT, holeXs, outline, runBetween, pathOf, px, widthAt } from './geom.js'
import { Beveller, Sander, Brush, Dauber, Applicator, Creaser, HeatGun, Awl, BoneFolder, Pliers, NotchPlier, Punch, Knife } from './tools.jsx'

/* ------------------------------------------------------------------ */
/* Local helpers                                                       */
/* ------------------------------------------------------------------ */
const uid = () => useId().replace(/[^a-zA-Z0-9]/g, '')
const f1 = (v) => (Math.round(v * 10) / 10).toString()
const P = (pts, close) => pts.map((p, i) => `${i ? 'L' : 'M'}${f1(p[0])} ${f1(p[1])}`).join(' ') + (close ? ' Z' : '')

// deterministic pseudo-random, so renders are stable
function rng(seed = 1) {
  let s = (seed * 7919 + 104729) % 233280
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// Chaikin corner-cutting on an open polyline (endpoints kept): rounds corners.
function chaikin(pts, n) {
  let p = pts
  for (let k = 0; k < n; k++) {
    const q = [p[0]]
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i]
      const b = p[i + 1]
      q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25])
      q.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75])
    }
    q.push(p[p.length - 1])
    p = q
  }
  return p
}

// Offset an open polyline by d px along its left-hand normal (for a contour
// running top → bottom down the right-hand edge, that is outward).
// d may be a function (i, n) → px.
function offLine(pts, d) {
  const n = pts.length
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)]
    const b = pts[Math.min(n - 1, i + 1)]
    const dx = b[0] - a[0]
    const dy = b[1] - a[1]
    const L = Math.hypot(dx, dy) || 1
    const k = typeof d === 'function' ? d(i, n) : d
    return [p[0] + (dy / L) * k, p[1] - (dx / L) * k]
  })
}
const bandPts = (run, d1, d2) => [...offLine(run, d1), ...offLine(run, d2).reverse()]

// Geometry of an edge profile. Face at x (px), top surface y (px), s px/mm.
// tT / tL = top & lining thickness (mm); W = width of section shown (mm);
// b = bevel (mm); r = rounding passes; step = lining proud of the top (mm).
function edgeGeom({ x: xe, y: y0, s = 30, tT = 1.1, tL = 0.7, W = 4, b = 0, r = 0, step = 0 }) {
  const H = tT + tL
  const L = Math.max(0.35, b + 0.25)
  let raw
  if (step) raw = [[-L, 0], [0, 0], [0, tT], [step, tT], [step, H], [-L, H]]
  else if (b > 0) raw = [[-b - L, 0], [-b, 0], [0, b], [0, H - b], [-b, H], [-b - L, H]]
  else raw = [[-L, 0], [0, 0], [0, H], [-L, H]]
  const sm = chaikin(raw, r)
  const toPx = ([u, v]) => [xe + u * s, y0 + v * s]
  const pts = sm.map(toPx)
  const cut = -(b + 0.1 + (r ? 0.12 : 0))
  const run = sm.filter(([u]) => u >= cut).map(toPx)
  const sec = [[xe - W * s, y0], ...pts, [xe - W * s, y0 + H * s]]
  return { H, Hp: H * s, pts, run, sec, x0: xe - W * s, xe, y0, s, b, tT, tL }
}
// point on the edge run at fraction f (0 = top, 1 = bottom), plus outward normal
function at(g, f) {
  const i = Math.max(0, Math.min(g.run.length - 1, Math.round(f * (g.run.length - 1))))
  const a = g.run[Math.max(0, i - 1)]
  const b = g.run[Math.min(g.run.length - 1, i + 1)]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
  return { p: g.run[i], n: [(b[1] - a[1]) / L, -(b[0] - a[0]) / L] }
}
const along = (q, d) => [q.p[0] + q.n[0] * d, q.p[1] + q.n[1] * d]

const PAINT = ['#3b2a1d', '#4a3524', '#33241a', '#56402c', '#2c1f15']

// An edge profile drawn from edgeGeom props plus surface states:
// fuzz (mm), pores, dye (mm, soaked in), band (mm, burnished compression),
// film (mm, agent), primer (mm), coats [{ t (mm), c, bump (px) }], wax (mm),
// gloss (0–1), crack (px positions on the outer coat).
function Edge(props) {
  const {
    k2 = 'lining', fuzz = 0, fuzzN = 18, fib = true, seed = 7, band = 0, gloss = 0, film = 0, dye = 0,
    wax = 0, coats = [], primer = 0, pores = 0, brk = true, singe = false, cond = 0, sealer = 0, cracks = [], fs = 1, poreR = 1, poreC,
  } = props
  const g = edgeGeom(props)
  const id = uid()
  const { s, run, sec, x0, xe, y0, Hp, tT } = g
  const R = rng(seed)

  // fibres inside the section
  const fibres = []
  if (fib) {
    const k = fs
    for (let yy = y0 + 3 * k; yy < y0 + Hp - 1; yy += 5 * k) {
      const top = yy < y0 + tT * s
      for (let xx = x0 + R() * 10 * k; xx < xe + 6; xx += (12 + R() * 8) * k) {
        const w = (4 + R() * 3) * k
        fibres.push(
          <path key={`${f1(xx)}-${f1(yy)}`} d={`M${f1(xx)} ${f1(yy + R() * 2 * k)} q${f1(w / 2)} ${f1((-1.2 - R()) * k)} ${f1(w)} 0 t${f1(w)} 0`} fill="none"
            stroke={top ? 'rgba(78,48,20,0.32)' : 'rgba(120,98,64,0.32)'} strokeWidth={0.6 * Math.min(k, 1.8)} />
        )
      }
    }
  }
  // open fibre ends (pores) along the face
  const poreEls = []
  if (pores) {
    const n = Math.round(pores)
    for (let i = 0; i < n; i++) {
      const q = at(g, 0.08 + (0.84 * (i + R() * 0.6)) / n)
      const r = (1.3 + R() * 1.1) * poreR
      const c = along(q, -r * 0.55)
      poreEls.push(<ellipse key={i} cx={f1(c[0])} cy={f1(c[1])} rx={f1(r)} ry={f1(r * 1.25)} fill={poreC || (primer ? '#7c6a58' : '#24170c')} opacity={primer || poreC ? 1 : 0.85} />)
    }
  }
  // outer layers (outward from the leather surface)
  let cum = 0
  const outer = []
  const layer = (t, fill, stroke, key, bump) => {
    const a = cum
    const bb = cum + t * s
    cum = bb
    const outerOff = bump ? (i, n) => bb + bump * Math.sin((i / Math.max(1, n - 1)) * Math.PI * 7 + seed) * Math.sin((i / Math.max(1, n - 1)) * Math.PI) : bb
    const pts = [...offLine(run, a), ...offLine(run, outerOff).reverse()]
    outer.push(<path key={key} d={P(pts, true)} fill={fill} stroke="none" />)
    outer.push(<path key={key + 's'} d={P(offLine(run, outerOff))} fill="none" stroke={stroke} strokeWidth="0.6" />)
  }
  if (sealer) layer(sealer, 'rgba(160,205,220,0.35)', 'rgba(185,225,238,0.8)', 'sl')
  if (film) layer(film, 'rgba(150,195,210,0.42)', 'rgba(175,215,230,0.75)', 'fm')
  if (primer) layer(primer, '#7c6a58', '#a39079', 'pr')
  coats.forEach((c, i) => layer(c.t, c.c || PAINT[i % PAINT.length], c.line || '#8a6a4a', 'c' + i, c.bump))
  if (wax) layer(wax, 'rgba(236,210,140,0.5)', 'rgba(246,226,170,0.85)', 'wx')

  // fuzz: loose fibres standing off the face
  const fuzzEls = []
  if (fuzz) {
    for (let i = 0; i < fuzzN; i++) {
      const q = at(g, 0.04 + 0.92 * ((i + R() * 0.8) / fuzzN))
      const len = fuzz * s * (0.5 + R() * 0.8)
      const ang = (R() - 0.5) * 1.3
      const nx = q.n[0] * Math.cos(ang) - q.n[1] * Math.sin(ang)
      const ny = q.n[0] * Math.sin(ang) + q.n[1] * Math.cos(ang)
      const e = [q.p[0] + nx * len, q.p[1] + ny * len]
      const m = [q.p[0] + nx * len * 0.5 + (R() - 0.5) * 3, q.p[1] + ny * len * 0.5 + (R() - 0.5) * 3]
      const isTop = q.p[1] < y0 + tT * s
      fuzzEls.push(
        <g key={i}>
          <path d={`M${f1(q.p[0])} ${f1(q.p[1])} Q${f1(m[0])} ${f1(m[1])} ${f1(e[0])} ${f1(e[1])}`} fill="none" stroke={isTop ? '#e2bb85' : '#efe2c6'} strokeWidth="0.8" />
          {singe && R() > 0.35 && <circle cx={f1(e[0])} cy={f1(e[1])} r="1.4" fill="#ff8a3d" opacity="0.9" />}
        </g>
      )
    }
  }
  const glossEl =
    gloss > 0 ? (
      <path
        d={P(offLine(run, cum - 1.1).slice(Math.floor(run.length * 0.18), Math.ceil(run.length * 0.82)))}
        fill="none"
        stroke="#fff4d8"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity={gloss}
      />
    ) : null

  return (
    <g>
      <clipPath id={`ec${id}`}>
        <path d={P(sec, true)} />
      </clipPath>
      <g clipPath={`url(#ec${id})`}>
        <rect x={x0 - 2} y={y0} width={xe - x0 + 40} height={tT * s} fill="url(#sk-topS)" />
        <rect x={x0 - 2} y={y0 + tT * s} width={xe - x0 + 40} height={Hp - tT * s} fill={k2 === 'top' ? 'url(#sk-topS)' : 'url(#sk-linS)'} />
        {fibres}
        <line x1={x0} y1={y0 + tT * s} x2={xe + 40} y2={y0 + tT * s} stroke="#8f7b5a" strokeWidth="0.8" />
        {cond > 0 && <rect x={x0 - 2} y={y0} width={xe - x0 + 40} height={cond * s} fill="rgba(90,52,20,0.45)" />}
        {dye > 0 && <path d={P(bandPts(run, 3, -dye * s * 1.7), true)} fill="rgba(62,34,14,0.3)" />}
        {dye > 0 && <path d={P(bandPts(run, 3, -dye * s), true)} fill="rgba(58,30,12,0.8)" />}
        {film > 0 && <path d={P(bandPts(run, 3, -0.1 * s), true)} fill="rgba(70,40,18,0.35)" />}
        {band > 0 && <path d={P(bandPts(run, 3, -band * s), true)} fill="rgba(88,52,22,0.6)" />}
        {band > 0 &&
          [0.3, 0.6, 0.85].map((f) => <path key={f} d={P(offLine(run, -band * s * f))} fill="none" stroke="rgba(48,26,10,0.6)" strokeWidth="0.6" />)}
        {poreEls}
      </g>
      <path d={P(sec)} fill="none" stroke="#4a3018" strokeWidth="0.9" strokeLinejoin="round" />
      {brk && <path d={`M${f1(x0 + 2)} ${f1(y0 - 4)} l-4 ${f1((Hp + 8) * 0.3)} l4 ${f1((Hp + 8) * 0.4)} l-4 ${f1((Hp + 8) * 0.3)}`} fill="none" stroke={C.dim} strokeWidth="1" />}
      {outer}
      {cracks.map((f, i) => {
        const q = at(g, f)
        const a = along(q, cum + 2)
        const b = along(q, -1)
        return <path key={'k' + i} d={`M${f1(a[0])} ${f1(a[1])} L${f1((a[0] + b[0]) / 2 + 2)} ${f1((a[1] + b[1]) / 2 - 2)} L${f1(b[0])} ${f1(b[1])}`} fill="none" stroke={C.ruby} strokeWidth="1.4" />
      })}
      {fuzzEls}
      {glossEl}
    </g>
  )
}

// The edge face seen edge-on (elevation): bevel strips and the two layers.
// Returns the band; children are clipped to it. y = top of the band.
function EdgeFace({ x1, x2, y, h = 38, children, bev = true, tone, brkL, brkR }) {
  const id = uid()
  const bv = bev ? h * 0.2 : 0
  const ht = h * 0.58
  return (
    <g>
      <clipPath id={`ef${id}`}>
        <rect x={x1} y={y} width={x2 - x1} height={h} />
      </clipPath>
      <g clipPath={`url(#ef${id})`}>
        <rect x={x1} y={y} width={x2 - x1} height={h} fill="#e2d2b3" />
        <rect x={x1} y={y} width={x2 - x1} height={ht} fill="#b5844c" />
        {bev && <rect x={x1} y={y} width={x2 - x1} height={bv} fill="#cf9f66" />}
        {bev && <rect x={x1} y={y + h - bv} width={x2 - x1} height={bv} fill="#efe3c9" />}
        <line x1={x1} y1={y + ht} x2={x2} y2={y + ht} stroke="#8f7b5a" strokeWidth="0.7" />
        {tone && <rect x={x1} y={y} width={x2 - x1} height={h} fill={tone} />}
        {children}
      </g>
      <rect x={x1} y={y} width={x2 - x1} height={h} fill="none" stroke="#4a3018" strokeWidth="0.8" />
      {brkL && <path d={`M${x1 + 2} ${y - 4} l-4 ${(h + 8) * 0.3} l4 ${(h + 8) * 0.4} l-4 ${(h + 8) * 0.3}`} fill="none" stroke={C.dim} strokeWidth="1" />}
      {brkR && <path d={`M${x2 + 2} ${y - 4} l-4 ${(h + 8) * 0.3} l4 ${(h + 8) * 0.4} l-4 ${(h + 8) * 0.3}`} fill="none" stroke={C.dim} strokeWidth="1" />}
    </g>
  )
}

// Lengthwise scratch lines for an EdgeFace (deterministic).
function Scratches({ x1, x2, y, h, n = 20, w = 0.8, op = 0.5, seed = 2, across, minL = 18, maxL = 60 }) {
  const R = rng(seed)
  return (
    <g stroke={`rgba(55,32,14,${op})`} strokeWidth={w} strokeLinecap="round">
      {Array.from({ length: n }, (_, i) => {
        if (across) {
          const x = x1 + R() * (x2 - x1)
          const yy = y + R() * h * 0.3
          return <line key={i} x1={f1(x)} y1={f1(yy)} x2={f1(x + (R() - 0.5) * 3)} y2={f1(yy + h * (0.4 + R() * 0.4))} />
        }
        const yy = y + 2 + R() * (h - 4)
        const L = minL + R() * (maxL - minL)
        const x = x1 - 10 + R() * (x2 - x1)
        return <line key={i} x1={f1(x)} y1={f1(yy)} x2={f1(x + L)} y2={f1(yy + (R() - 0.5) * 0.8)} />
      })}
    </g>
  )
}

// Panel frame for pass / fail comparisons.
function Panel({ x, y, w, h, title, ok, c }) {
  const col = c || (ok === undefined ? C.line : ok ? 'rgba(123,165,131,0.55)' : 'rgba(194,88,99,0.55)')
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill="rgba(255,255,255,0.025)" stroke={col} strokeWidth="1" />
      {title && <Tag x={x + 10} y={y + 18}>{title}</Tag>}
      {ok !== undefined && <Verdict x={x + w - 16} y={y + 16} ok={ok} r={8.5} />}
    </g>
  )
}

// White cloth swatch, with an optional smudge of colour.
function Cloth({ x, y, w = 70, h = 50, smudge = 0, damp, seed = 4 }) {
  const R = rng(seed)
  return (
    <g>
      <path
        d={`M${x} ${y + 4} Q${x + w * 0.3} ${y - 2} ${x + w * 0.55} ${y + 2} T${x + w} ${y + 3} L${x + w - 2} ${y + h - 3} Q${x + w * 0.6} ${y + h + 3} ${x + w * 0.3} ${y + h - 1} T${x + 2} ${y + h} Z`}
        fill="#f1ece2"
        stroke="#b9b1a1"
        strokeWidth="0.9"
      />
      {smudge > 0 && (
        <g>
          <ellipse cx={x + w * 0.5} cy={y + h * 0.52} rx={w * 0.3} ry={h * 0.2} fill="#6e4422" opacity={0.18 * smudge + 0.08} transform={`rotate(-12 ${x + w * 0.5} ${y + h * 0.52})`} />
          <ellipse cx={x + w * 0.48} cy={y + h * 0.5} rx={w * 0.2} ry={h * 0.11} fill="#5a3416" opacity={0.3 * smudge} transform={`rotate(-12 ${x + w * 0.5} ${y + h * 0.52})`} />
        </g>
      )}
      {damp &&
        Array.from({ length: 4 }, (_, i) => (
          <circle key={i} cx={x + 10 + R() * (w - 20)} cy={y + 8 + R() * (h - 16)} r="1.6" fill="rgba(150,200,220,0.75)" />
        ))}
    </g>
  )
}

const strokeRun = (T, run, c, w = 4, key, op = 0.92) => (
  <path key={key} d={P(run.map(([x, y]) => px(T, x, y)))} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={op} />
)
const runsOf = (o, a, b) => runBetween(outline(o), a, b)
const BreakV = ({ x, y1, y2 }) => (
  <path d={`M${x + 2} ${y1} l-4 ${(y2 - y1) * 0.3} l4 ${(y2 - y1) * 0.4} l-4 ${(y2 - y1) * 0.3}`} fill="none" stroke={C.dim} strokeWidth="1" />
)

// Leader like kit's Lead, but a centred label never has its line run into
// the text: the line stops above (or below) the label block.
function Lb({ p, t, text, sub, a, c = C.text, s = 11.5, subc = C.faint, dot = true }) {
  const anchor = a || (t[0] >= p[0] ? 'start' : 'end')
  let e = t
  if (anchor === 'middle') e = [t[0], t[1] > p[1] ? t[1] - s + 1 : t[1] + 9 + (sub ? s + 1 : 0)]
  const tx = t[0] + (anchor === 'start' ? 4 : anchor === 'end' ? -4 : 0)
  return (
    <g>
      <line x1={p[0]} y1={p[1]} x2={e[0]} y2={e[1]} stroke={C.struct} strokeWidth="0.8" opacity="0.8" />
      {dot && <circle cx={p[0]} cy={p[1]} r="2.2" fill={c} />}
      <text x={tx} y={t[1] + 4} textAnchor={anchor} fontSize={s} fill={c} fontFamily={FONT}>
        {text}
      </text>
      {sub && (
        <text x={tx} y={t[1] + 4 + s + 2} textAnchor={anchor} fontSize={s - 1.5} fill={subc} fontFamily={FONT}>
          {sub}
        </text>
      )}
    </g>
  )
}

// Magnifier: a ring on the source spot, a dashed tie, and a round window
// whose children (drawn in absolute coords, at a larger scale) are clipped.
function Loupe({ cx, cy, r, src, sr = 7, children, label, lc = C.dim }) {
  const id = uid()
  const dx = cx - src[0]
  const dy = cy - src[1]
  const L = Math.hypot(dx, dy) || 1
  return (
    <g>
      <circle cx={src[0]} cy={src[1]} r={sr} fill="none" stroke={C.brassHi} strokeWidth="1.1" />
      <line x1={src[0] + (dx / L) * sr} y1={src[1] + (dy / L) * sr} x2={cx - (dx / L) * r} y2={cy - (dy / L) * r} stroke={C.brassHi} strokeWidth="0.8" strokeDasharray="3 2" />
      <clipPath id={`lp${id}`}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <circle cx={cx} cy={cy} r={r} fill={C.ground} />
      <g clipPath={`url(#lp${id})`}>{children}</g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.brassHi} strokeWidth="1.4" />
      {label && (
        <T x={cx} y={cy + r + 16} a="middle" s={10.5} c={lc}>
          {label}
        </T>
      )}
    </g>
  )
}

// Clock face with the minutes from..to filled (and to..to2 lighter).
function Clock({ x, y, r = 16, to = 20, to2 }) {
  const pt = (m) => [x + r * Math.sin((m / 60) * 2 * Math.PI), y - r * Math.cos((m / 60) * 2 * Math.PI)]
  const sector = (a, b) => {
    const [x1, y1] = pt(a)
    const [x2, y2] = pt(b)
    return `M${x} ${y} L${f1(x1)} ${f1(y1)} A${r} ${r} 0 ${b - a > 30 ? 1 : 0} 1 ${f1(x2)} ${f1(y2)} Z`
  }
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="rgba(255,255,255,0.03)" stroke={C.struct} strokeWidth="1.1" />
      {to2 && <path d={sector(to, to2)} fill="rgba(123,165,131,0.22)" />}
      <path d={sector(0, to)} fill="rgba(123,165,131,0.5)" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * 2 * Math.PI
        return <line key={i} x1={x + (r - 3) * Math.sin(a)} y1={y - (r - 3) * Math.cos(a)} x2={x + r * Math.sin(a)} y2={y - r * Math.cos(a)} stroke={C.struct} strokeWidth="0.8" />
      })}
      <line x1={x} y1={y} x2={x} y2={y - r * 0.75} stroke={C.text} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx={x} cy={y} r="1.6" fill={C.text} />
    </g>
  )
}

// A bigger, clipped piece of an edge profile for a loupe: the run point at
// fraction f of the small profile is placed at (cx, cy).
function EdgeZoom({ cx, cy, s = 110, g, q, ...rest }) {
  const u = (q.p[0] - g.xe) / g.s
  const v = (q.p[1] - g.y0) / g.s
  return <Edge x={cx - u * s} y={cy - v * s} s={s} W={2.2} brk={false} fs={(s / g.s) * 0.45} b={g.b} {...rest} />
}

/* ================================================================== */
/* EDGES I — bevel, sand & burnish                                     */
/* ================================================================== */

/* Which edges get what: the finish map */
function EdgeMap() {
  const TL = { x: 84, y: 76, s: 2.6 }
  const TS = { x: 84, y: 170, s: 2.6 }
  const oL = LONG()
  const oS = SHORT()
  const G = C.emerald
  const B = C.brass
  const Rr = C.ruby
  return (
    <Fig h={318} view="Plan · the finish map" scale="20 → 18 mm · 120 / 80">
      <StrapPlan T={TL} o={oL} stitch={{ m: 3, p: 3, from: 5 }} holes={{}} />
      {runsOf(oL, 10).map((r, i) => strokeRun(TL, r, G, 4, 'g' + i))}
      {runsOf(oL, 3, 10).map((r, i) => strokeRun(TL, r, B, 4, 'b' + i))}
      {runsOf(oL, 0, 3).map((r, i) => strokeRun(TL, r, Rr, 4.5, 'r' + i))}

      <Buckle x={84 + 80 * 2.6} y={170} w={18 * 2.6} L={38} />
      <StrapPlan T={TS} o={oS} stitch={{ m: 3, p: 3, from: 5, to: 64 }} keepers={[{ x: 70 }, { x: 52, float: true }]} />
      {runsOf(oS, 10, 70).map((r, i) => strokeRun(TS, r, G, 4, 'sg' + i))}
      {runsOf(oS, 3, 10).map((r, i) => strokeRun(TS, r, B, 4, 'sb' + i))}
      {runsOf(oS, 70, 80).map((r, i) => strokeRun(TS, r, B, 4, 'sb2' + i))}
      {runsOf(oS, 0, 3).map((r, i) => strokeRun(TS, r, Rr, 4.5, 'sr' + i))}
      <line x1={292} y1={146.6} x2={292} y2={193.4} stroke={Rr} strokeWidth="4.5" strokeLinecap="round" opacity="0.92" />

      <Lb p={[86, 51]} t={[62, 34]} text="horns" c={Rr} />
      <Lb p={[84, 170]} t={[62, 170]} text="spine" c={Rr} />
      <Lb p={[101, 145]} t={[126, 126]} text="fold sides" c={B} />
      <Lb p={[240, 51]} t={[240, 34]} text="long edges & tip" c={G} a="middle" />
      <Lb p={[292, 193]} t={[292, 214]} text="buckle-fold spine" c={Rr} a="middle" />

      {/* side view of the lug fold against the case, same colour code */}
      <Tag x={344} y={128}>Side · lug fold</Tag>
      <rect x={346} y={140} width={6} height={84} rx="2" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" />
      <T x={349} y={236} a="middle" s={10} c={C.faint}>case</T>
      <Ply x1={384} x2={466} y={164} t={10} open="l" />
      <Wrap cx={384} cy={182} r={8} t={10} xR={384} conv={21} tail={26} ts={5} />
      <BarEnd cx={384} cy={182} r={7.3} />
      <path d="M384 164 A18 18 0 0 0 384 200" fill="none" stroke={Rr} strokeWidth="4" strokeLinecap="round" opacity="0.92" />
      <line x1={387} y1={164} x2={410} y2={164} stroke={B} strokeWidth="4" strokeLinecap="round" opacity="0.92" />
      <line x1={415} y1={164} x2={464} y2={164} stroke={G} strokeWidth="4" strokeLinecap="round" opacity="0.92" />
      <T x={398} y={154} a="middle" s={10} c={B}>fold</T>
      <T x={440} y={154} a="middle" s={10} c={G}>body</T>
      <Lb p={[367, 192]} t={[414, 214]} text="spine" sub="rubs on the case" c={Rr} a="middle" />

      {[
        [G, 'full finish: bevel, sand, colour, burnish, seal'],
        [B, 'gum or Tokonole only'],
        [Rr, 'nothing: horns & fold spines (finish rubs off)'],
      ].map(([c, l], i) => (
        <g key={l}>
          <line x1={22} y1={262 + i * 18} x2={40} y2={262 + i * 18} stroke={c} strokeWidth="4" strokeLinecap="round" />
          <T x={48} y={266 + i * 18} s={11} c={C.text}>
            {l}
          </T>
        </g>
      ))}
    </Fig>
  )
}

/* Level: top and lining sanded into one face */
function Level() {
  const s = 30
  const A = { x: 160, y: 90, s, W: 3.2, step: 0.25 }
  const B = { x: 372, y: 90, s, W: 3.2 }
  const H = 1.8 * s
  return (
    <Fig h={290} view="Detail · edge profile" scale="true scale ×30">
      <Tag x={20} y={44}>Before · a step</Tag>
      <Edge {...A} fuzz={0.16} seed={3} />
      <line x1={160} y1={74} x2={160} y2={152} stroke={C.brass} strokeWidth="1" strokeDasharray="4 3" />
      <T x={164} y={72} s={10.5} c={C.brass}>sand to here</T>
      <Lb p={[161, 97]} t={[110, 62]} text="cut fibres, fuzz" />
      <Lb p={[166, 128]} t={[160, 172]} text="lining proud of the top" sub="a step at the glue line" a="middle" />
      <T x={56} y={111} a="end" s={10} c={C.faint}>top</T>
      <T x={56} y={138} a="end" s={10} c={C.faint}>lining</T>
      <T x={20} y={210} s={10} c={C.faint}>plan</T>
      <rect x={40} y={216} width={196} height={18} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <rect x={40} y={234} width={196} height={3.5} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="0.5" />
      <Lb p={[150, 237]} t={[140, 260]} text="lining shows past the top" a="middle" s={10.5} />

      <Sep x1={250} y1={30} x2={250} y2={280} />

      <Tag x={262} y={44}>Levelled · one face</Tag>
      <Edge {...B} fuzz={0.04} fuzzN={6} seed={5} />
      <rect x={374} y={66} width={32} height={H + 48} rx="3" fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.8" />
      <rect x={373} y={66} width={5} height={H + 48} fill="#9d9483" stroke="#5d5649" strokeWidth="0.5" />
      <path d="M363 90 v9 h9" fill="none" stroke={C.brassHi} strokeWidth="1.1" />
      <Lb p={[396, 74]} t={[352, 58]} text="sanding block" />
      <Lb p={[371, 120]} t={[316, 180]} text="one flat face" sub="square, no step" a="middle" />
      <T x={268} y={111} a="end" s={10} c={C.faint}>top</T>
      <T x={262} y={210} s={10} c={C.faint}>plan</T>
      <rect x={282} y={216} width={180} height={18} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <rect x={352} y={234} width={36} height={9} rx="1.5" fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.7" />
      <Arrow a={[300, 256]} b={[444, 256]} both w={1.6} />
      <T x={372} y={276} a="middle" s={10.5} c={C.brass}>lengthwise strokes, block flat</T>
    </Fig>
  )
}

/* Bevel both arrises, 0.5–0.7 mm */
function Bevel() {
  const s = 34
  const xe = 230
  const y0 = 112
  const spec = { x: xe, y: y0, s, W: 4.6, b: 0.6 }
  const g = edgeGeom(spec)
  const b = 0.6 * s
  const yb = y0 + g.Hp
  const x0 = g.x0
  return (
    <Fig h={300} view="Detail · edge profile" scale="true scale ×34">
      <Edge {...spec} fuzz={0.04} fuzzN={5} seed={11} />
      <path d={`M${xe - b} ${y0} L${xe} ${y0} L${xe} ${y0 + b} Z`} fill="none" stroke={C.dim} strokeWidth="0.8" strokeDasharray="3 2" />
      <path d={`M${xe - b} ${yb} L${xe} ${yb} L${xe} ${yb - b} Z`} fill="none" stroke={C.dim} strokeWidth="0.8" strokeDasharray="3 2" />
      <Beveller x={xe - b / 2 + 1} y={y0 + b / 2 - 1} ang={45} k={0.85} />
      <Dim a={[xe - b, y0]} b={[xe, y0]} off={-12} text="" />
      <T x={xe - b / 2} y={y0 - 20} a="middle" s={10.5} mono>0.5–0.7</T>
      <Dim a={[xe, yb - b]} b={[xe, yb]} off={-12} text="" />
      <T x={250} y={yb - b / 2 + 4} s={10.5} mono>0.5–0.7</T>
      <Dim a={[xe - b, yb]} b={[xe, yb]} off={12} text="" />
      <T x={xe - b / 2} y={yb + 28} a="middle" s={10.5} mono>0.5–0.7</T>
      <T x={x0 - 6} y={y0 + 22} a="end" s={10} c={C.faint}>top</T>
      <T x={x0 - 6} y={y0 + 52} a="end" s={10} c={C.faint}>lining</T>
      <Lb p={[xe - b - 2, y0 + 2]} t={[170, 78]} text="top arris" />
      <Lb p={[xe - b - 2, yb - 2]} t={[170, 222]} text="bottom arris" sub="then turn the strap over" />
      <Lb p={[268, 74]} t={[296, 58]} text="beveller" sub="held at a steady angle" />
      <T x={x0} y={262} s={10} c={C.faint}>dashed: the corner the beveller removes</T>

      <Tag x={310} y={110}>Before → after</Tag>
      <Edge x={358} y={124} s={16} W={2.4} fib={false} />
      <Arrow a={[368, 138]} b={[404, 138]} w={1.4} />
      <Edge x={458} y={124} s={16} W={2.4} b={0.6} fib={false} />
      <T x={339} y={170} a="middle" s={10.5}>square</T>
      <T x={439} y={170} a="middle" s={10.5}>both bevelled</T>

      <Tag x={310} y={200}>Plan · one stroke</Tag>
      <rect x={310} y={208} width={156} height={30} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <rect x={310} y={234.5} width={80} height={3.5} fill="#e0b277" />
      <path d="M390 240 q-18 8 -40 4 q-14 -2 -26 6" fill="none" stroke="#d3a66e" strokeWidth="2.2" strokeLinecap="round" />
      <Beveller x={392} y={238} ang={-62} k={0.6} />
      <Arrow a={[404, 252]} b={[460, 252]} w={1.8} />
      <T x={466} y={272} a="end" s={10.5} c={C.brass}>push: one smooth stroke</T>
      <T x={310} y={290} s={10} c={C.faint}>the shaving lifts in one strip</T>
    </Fig>
  )
}

/* Sand lengthwise through the grits */
function Sand() {
  const y = 100
  const h = 38
  const segs = [
    [30, 135, '220', { n: 30, w: 1, op: 0.6, minL: 22, maxL: 70 }],
    [135, 240, '400', { n: 34, w: 0.7, op: 0.42, minL: 20, maxL: 60 }],
    [240, 345, '600', { n: 38, w: 0.45, op: 0.3, minL: 16, maxL: 50 }],
    [345, 450, '1000–1200', null],
  ]
  const amp = [4.5, 3, 1.6, 0.35]
  return (
    <Fig h={282} view="Elevation · the edge face" scale="schematic">
      <Edge x={66} y={34} s={14} W={2.2} b={0.6} r={1} fib={false} />
      <Arrow a={[112, 47]} b={[76, 47]} w={1.4} />
      <T x={20} y={84} s={10} c={C.faint}>looking at the edge face</T>
      <Sander x={190} y={92} len={92} />
      <T x={190} y={87} a="middle" s={10} mono c="#f1e6d2">400</T>
      <Arrow a={[140, 64]} b={[240, 64]} both w={1.6} />
      <T x={248} y={68} s={11} c={C.brass}>lengthwise strokes, never across</T>
      <EdgeFace x1={30} x2={450} y={y} h={h} brkL brkR>
        {segs.map(([a, b, , sc], i) => (sc ? <Scratches key={i} x1={a} x2={b} y={y} h={h} seed={i + 3} {...sc} /> : null))}
        <rect x={345} y={y} width={105} height={h} fill="rgba(255,240,215,0.07)" />
        <line x1={352} y1={y + 12} x2={444} y2={y + 12} stroke="#fff4d8" strokeWidth="1.3" opacity="0.55" strokeLinecap="round" />
        {segs.slice(1).map(([a]) => (
          <line key={a} x1={a} y1={y} x2={a} y2={y + h} stroke={C.ground} strokeWidth="1" strokeDasharray="2 2" />
        ))}
      </EdgeFace>
      {segs.map(([a, b, lab], i) => (
        <g key={lab}>
          <T x={(a + b) / 2} y={156} a="middle" s={11.5} mono c={C.text}>
            {lab}
          </T>
          {i < 3 && <path d={`M${b - 9} 152 l9 0`} stroke={C.brass} strokeWidth="1.2" markerEnd="url(#sk-a-brass)" />}
          <polyline
            points={Array.from({ length: Math.floor((b - a - 10) / 3.5) }, (_, k) => `${a + 5 + k * 3.5},${194 + (k % 2 ? amp[i] : -amp[i])}`).join(' ')}
            fill="none"
            stroke={C.dim}
            strokeWidth="0.9"
          />
        </g>
      ))}
      <T x={397} y={170} a="middle" s={10} c={C.faint}>optional: for glass</T>
      <T x={30} y={220} s={10} c={C.faint}>surface profile (schematic): each grit removes the previous one’s scratches</T>
      <EdgeFace x1={60} x2={140} y={238} h={22} bev={false}>
        <Scratches x1={60} x2={140} y={238} h={22} n={14} w={0.8} op={0.55} seed={9} minL={14} maxL={40} />
      </EdgeFace>
      <Verdict x={156} y={249} ok />
      <T x={172} y={253} s={11} c={C.emerald}>along the edge</T>
      <EdgeFace x1={276} x2={356} y={238} h={22} bev={false}>
        <Scratches x1={276} x2={356} y={238} h={22} n={22} w={0.8} op={0.6} seed={9} across />
      </EdgeFace>
      <Verdict x={372} y={249} ok={false} />
      <T x={388} y={253} s={11} c={C.ruby}>across</T>
    </Fig>
  )
}

/* Colour (optional): edge dye soaks in */
function Colour() {
  const spec = { x: 200, y: 92, s: 32, W: 4.3, b: 0.6, r: 1 }
  const g = edgeGeom(spec)
  const mid = at(g, 0.5)
  const lo = at(g, 0.76)
  return (
    <Fig h={296} view="Detail · edge profile" scale="true scale ×32">
      <T x={20} y={44} s={11} c={C.brass} it>optional</T>
      <Edge {...spec} dye={0.16} seed={21} />
      <Brush x={mid.p[0] + 3} y={mid.p[1]} ang={64} k={0.9} />
      <Lb p={[251, 97]} t={[296, 64]} text="edge-dye brush" />
      <Lb p={[140, 94]} t={[110, 64]} text="grain stays clean" />
      <Lb p={[mid.p[0] - 6, 140]} t={[150, 198]} text="edge dye soaks into the fibres" a="middle" />
      <T x={g.x0 - 6} y={113} a="end" s={10} c={C.faint}>top</T>
      <T x={g.x0 - 6} y={141} a="end" s={10} c={C.faint}>lining</T>
      <Loupe cx={404} cy={128} r={44} src={[lo.p[0] - 2, lo.p[1]]} label="dye held in the outer fibres">
        <EdgeZoom cx={404} cy={128} g={g} q={lo} r={1} dye={0.16} seed={22} s={110} />
      </Loupe>

      <Sep x1={14} y1={214} x2={466} y2={214} />
      <EdgeFace x1={30} x2={170} y={230} h={22} />
      <T x={30} y={268} s={10.5}>natural edge</T>
      <EdgeFace x1={196} x2={336} y={230} h={22} tone="rgba(45,24,10,0.78)" />
      <T x={196} y={268} s={10.5}>dyed: darker than the leather</T>
      <Clock x={420} y={240} r={14} to={20} to2={30} />
      <T x={420} y={268} a="middle" s={10.5} c={C.text}>let it dry</T>
      <T x={420} y={282} a="middle" s={10} c={C.faint}>before the agent</T>
    </Fig>
  )
}

/* Apply the agent: a thin film that just darkens */
function Agent() {
  const spec = { x: 200, y: 92, s: 32, W: 4.3, b: 0.6, r: 1 }
  const g = edgeGeom(spec)
  const mid = at(g, 0.5)
  const lo = at(g, 0.8)
  const bx = mid.p[0] + 9
  const by = mid.p[1] - 4
  return (
    <Fig h={290} view="Detail · edge profile" scale="true scale ×32 · film exaggerated">
      <Edge {...spec} film={0.07} seed={23} />
      <line x1={bx + 4} y1={by - 6} x2={bx + 64} y2={by - 56} stroke="#e8e0cc" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx={bx} cy={by} rx="6.5" ry="10" fill="#f4efe4" stroke="#b9b1a1" strokeWidth="0.8" />
      <Lb p={[bx + 40, by - 36]} t={[290, 52]} text="cotton bud or fingertip" />
      <Lb p={[along(lo, 3)[0], along(lo, 3)[1]]} t={[150, 198]} text="a thin film: just enough to darken" a="middle" />
      <Lb p={[140, 94]} t={[110, 64]} text="none on the grain" />
      <T x={g.x0 - 6} y={113} a="end" s={10} c={C.faint}>top</T>
      <T x={g.x0 - 6} y={141} a="end" s={10} c={C.faint}>lining</T>
      <Loupe cx={404} cy={128} r={44} src={[lo.p[0] + 1, lo.p[1]]} label="film wets the outer fibres">
        <EdgeZoom cx={404} cy={128} g={g} q={lo} r={1} film={0.07} seed={24} s={110} />
      </Loupe>

      <Sep x1={14} y1={214} x2={466} y2={214} />
      <T x={20} y={236} s={11} c={C.text}>Agent</T>
      <T x={62} y={236} s={11}>water · gum tragacanth · Tokonole · saddle soap</T>
      <EdgeFace x1={30} x2={130} y={252} h={20} tone="rgba(70,40,18,0.3)" />
      <Verdict x={146} y={262} ok />
      <T x={162} y={266} s={11} c={C.emerald}>edge just darkened</T>
      <EdgeFace x1={276} x2={376} y={252} h={20} tone="rgba(70,40,18,0.5)">
        <path d="M300 252 q2 10 0 20 M330 252 q-2 8 1 20 M352 252 q2 10 0 20" stroke="rgba(150,195,210,0.9)" strokeWidth="2.5" fill="none" />
      </EdgeFace>
      <Verdict x={392} y={262} ok={false} />
      <T x={408} y={266} s={11} c={C.ruby}>flooded</T>
    </Fig>
  )
}

/* The slicker groove and the canvas: the band forms */
function SlickerOn({ g }) {
  const groove = offLine(g.run, 2.5)
  const top = groove[0]
  const bot = groove[groove.length - 1]
  const right = g.xe + 46
  const pts = [...groove, [bot[0] - 2, bot[1] + 15], [right, bot[1] + 15], [right, top[1] - 15], [top[0] - 2, top[1] - 15]]
  return (
    <g>
      <path d={P(pts, true)} fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.8" />
      <path d={`M${right - 12} ${top[1] - 15} v${bot[1] - top[1] + 30}`} stroke="#3e2614" strokeWidth="0.6" opacity="0.6" />
    </g>
  )
}
function CanvasOn({ g }) {
  const run = offLine(g.run, 3.2)
  const a = run[0]
  const b = run[run.length - 1]
  const mx = g.xe + 58
  const my = g.y0 + g.Hp / 2
  const d = `M${mx} ${my - 5} Q${a[0] + 14} ${a[1] - 6} ${a[0]} ${a[1]} ${P(run).replace('M', 'L')} Q${b[0] + 14} ${b[1] + 6} ${mx} ${my + 5}`
  return (
    <g>
      <path d={d} fill="none" stroke="#d8ccb0" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
      <path d={d} fill="none" stroke="#a89878" strokeWidth="0.7" strokeDasharray="2 2" />
      <ellipse cx={mx + 8} cy={my} rx="11" ry="9" fill="rgba(214,170,140,0.35)" stroke="#a57e66" strokeWidth="0.9" />
    </g>
  )
}
const Heat = ({ x, y }) => (
  <path d={`M${x} ${y} q3 -4 0 -8 q-3 -4 0 -8 M${x + 7} ${y + 2} q3 -4 0 -8 q-3 -4 0 -8`} fill="none" stroke="rgba(235,135,60,0.85)" strokeWidth="1.2" />
)
// a magnified window on the surface: raised fibres, or a compressed glassy band
function FibreWindow({ x, y, w, h, done }) {
  const id = uid()
  const R = rng(done ? 77 : 78)
  const sy = y + 26
  const els = []
  for (let yy = sy + 6; yy < y + h; yy += 6) {
    for (let xx = x - 4 + R() * 8; xx < x + w; xx += 14 + R() * 8) {
      const dense = done && yy < sy + 16
      els.push(
        <path key={`${xx}-${yy}`} d={`M${f1(xx)} ${f1(yy)} q4 ${dense ? -0.6 : -2.5 + R() * 2} 8 0 t8 0`} fill="none" stroke={dense ? 'rgba(48,26,10,0.75)' : 'rgba(78,48,20,0.45)'} strokeWidth={dense ? 0.9 : 0.8} />
      )
    }
  }
  const tufts = []
  if (!done) {
    for (let i = 0; i < 16; i++) {
      const tx = x + 6 + i * ((w - 12) / 15) + (R() - 0.5) * 4
      const L = 7 + R() * 12
      const lean = (R() - 0.5) * 12
      tufts.push(<path key={i} d={`M${f1(tx)} ${sy} q${f1(lean / 2)} ${f1(-L * 0.6)} ${f1(lean)} ${f1(-L)}`} fill="none" stroke="#e2bb85" strokeWidth="1" />)
    }
  }
  return (
    <g>
      <clipPath id={`fw${id}`}>
        <rect x={x} y={y} width={w} height={h} rx="6" />
      </clipPath>
      <g clipPath={`url(#fw${id})`}>
        <rect x={x} y={y} width={w} height={h} fill={C.ground} />
        <rect x={x} y={sy} width={w} height={h} fill="#b5844c" />
        {done && <rect x={x} y={sy} width={w} height={16} fill="rgba(88,52,22,0.6)" />}
        {els}
        {tufts}
        <line x1={x} y1={sy} x2={x + w} y2={sy} stroke={done ? '#3a2412' : '#6f4b27'} strokeWidth={done ? 1.4 : 0.9} />
        {done && <line x1={x + 10} y1={sy + 1.6} x2={x + w - 30} y2={sy + 1.6} stroke="#fff4d8" strokeWidth="1.4" opacity="0.8" strokeLinecap="round" />}
      </g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill="none" stroke={C.brassHi} strokeWidth="1.1" />
    </g>
  )
}
function Burnish() {
  const A = { x: 150, y: 86, s: 30, W: 3.4, b: 0.6, r: 3 }
  const B = { x: 372, y: 86, s: 30, W: 3.4, b: 0.6, r: 3 }
  const gB = edgeGeom(B)
  const gA = edgeGeom(A)
  const bandB = at(gB, 0.62)
  return (
    <Fig h={322} view="Detail · edge profile" scale="true scale ×30">
      <Num x={28} y={42} n={1} />
      <T x={42} y={46} s={12} c={C.text} w="600">Wood slicker</T>
      <SlickerOn g={gA} />
      <Edge {...A} band={0.1} gloss={0.3} seed={31} />
      <Heat x={150} y={60} />
      <Lb p={[182, 150]} t={[150, 172]} text="groove cups the edge" sub="firm, brisk strokes along it" />

      <Sep x1={240} y1={28} x2={240} y2={196} />

      <Num x={258} y={42} n={2} />
      <T x={272} y={46} s={12} c={C.text} w="600">Then canvas</T>
      <CanvasOn g={gB} />
      <Edge {...B} band={0.15} gloss={0.85} seed={33} />
      <Lb p={[440, 106]} t={[462, 70]} text="canvas, pinched" a="end" />
      <Lb p={[bandB.p[0] - 4, bandB.p[1]]} t={[330, 172]} text="compressed band" sub="the fibres lie down and seal" a="middle" />

      <Sep x1={14} y1={206} x2={466} y2={206} />
      <Tag x={20} y={226}>The surface, magnified</Tag>
      <FibreWindow x={40} y={236} w={160} h={58} />
      <FibreWindow x={280} y={236} w={160} h={58} done />
      <Arrow a={[208, 266]} b={[272, 266]} w={1.6} />
      <T x={240} y={257} a="middle" s={10} c={C.brass}>friction heat</T>
      <T x={120} y={310} a="middle" s={10.5}>raised, open fibres</T>
      <T x={360} y={310} a="middle" s={10.5}>laid down: a hard, glassy band</T>
    </Fig>
  )
}

/* Repeat agent + burnish: 2 rounds working, 4–6 glass */
function BurnishRepeat() {
  const rounds = [
    [1, 0.05, 0.12],
    [2, 0.1, 0.35],
    [4, 0.16, 0.65],
    [6, 0.21, 0.95],
  ]
  return (
    <Fig h={272} view="Sequence · rounds" scale="profiles ×22">
      <rect x={110} y={30} width={96} height={30} rx="6" fill="rgba(150,195,210,0.1)" stroke={C.steel} />
      <T x={158} y={50} a="middle" s={12} c={C.text}>agent</T>
      <T x={158} y={76} a="middle" s={10} c={C.faint}>thin film</T>
      <rect x={274} y={30} width={96} height={30} rx="6" fill="rgba(208,168,79,0.1)" stroke={C.brass} />
      <T x={322} y={50} a="middle" s={12} c={C.text}>burnish</T>
      <T x={322} y={76} a="middle" s={10} c={C.faint}>slicker, then canvas</T>
      <Arrow d="M210 38 Q240 26 270 38" w={1.6} />
      <Arrow d="M270 54 Q240 66 210 54" w={1.6} />
      <T x={240} y={50} a="middle" s={10.5} c={C.brass}>repeat</T>

      {rounds.map(([n, band, gl], i) => {
        const xe = 102 + i * 110
        return (
          <g key={n}>
            <Edge x={xe} y={96} s={22} W={3.4} b={0.6} r={3} band={band} gloss={gl} seed={41 + i} />
            <EdgeFace x1={xe - 76} x2={xe + 4} y={150} h={16} tone={`rgba(60,34,14,${0.12 + band * 1.6})`}>
              <line x1={xe - 70} y1={155} x2={xe - 2} y2={155} stroke="#fff4d8" strokeWidth="1.4" opacity={gl * 0.8} strokeLinecap="round" />
            </EdgeFace>
            <T x={xe - 36} y={186} a="middle" s={11.5} c={C.text}>
              {n === 1 ? '1 round' : `${n} rounds`}
            </T>
          </g>
        )
      })}
      <path d="M142 198 v8 h72 v-8" fill="none" stroke={C.emerald} strokeWidth="1.1" />
      <T x={178} y={222} a="middle" s={11} c={C.emerald}>working strap: 2</T>
      <path d="M252 198 v8 h184 v-8" fill="none" stroke={C.brass} strokeWidth="1.1" />
      <T x={344} y={222} a="middle" s={11} c={C.brass}>glass edge: 4–6</T>
      <T x={240} y={256} a="middle" s={10.5} c={C.dim}>each round compresses the band further and deepens the shine</T>
    </Fig>
  )
}

/* Seal with wax */
function Seal() {
  const spec = { x: 186, y: 100, s: 32, W: 4, b: 0.6, r: 3 }
  const g = edgeGeom(spec)
  const drops = [0.14, 0.82].map((f) => along(at(g, f), 0.28 * 32 + 6))
  const wx = along(at(g, 0.45), 0.28 * 32 - 2)
  const bd = at(g, 0.66)
  return (
    <Fig h={276} view="Detail · edge profile + elevation" scale="profile ×32 · wax exaggerated">
      <Edge {...spec} band={0.16} gloss={0.9} wax={0.12} seed={51} />
      {drops.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x + 3} cy={y} r="4.2" fill="rgba(150,200,220,0.55)" stroke="#9cc3d3" strokeWidth="0.7" />
          <circle cx={x + 1.8} cy={y - 1.4} r="1.1" fill="#ffffff" opacity="0.8" />
        </g>
      ))}
      <Lb p={[drops[0][0] + 2, drops[0][1] - 4]} t={[176, 60]} text="water beads off" c={C.steel} />
      <Lb p={wx} t={[244, 128]} text="wax layer" />
      <Lb p={[bd.p[0] - 3, bd.p[1]]} t={[120, 196]} text="burnished band beneath" a="middle" />
      <T x={g.x0 - 6} y={121} a="end" s={10} c={C.faint}>top</T>
      <T x={g.x0 - 6} y={149} a="end" s={10} c={C.faint}>lining</T>

      <Sep x1={300} y1={30} x2={300} y2={262} />
      <Num x={322} y={44} n={1} />
      <T x={336} y={48} s={12} c={C.text} w="600">Rub in</T>
      <EdgeFace x1={316} x2={466} y={62} h={24} tone="rgba(70,40,18,0.35)">
        <path d="M316 70 h70 M316 78 h56" stroke="rgba(236,210,140,0.7)" strokeWidth="3" strokeLinecap="round" />
      </EdgeFace>
      <rect x={392} y={54} width={34} height={40} rx="5" fill="#e8cf7a" stroke="#9c8240" strokeWidth="0.9" />
      <Arrow a={[384, 104]} b={[440, 104]} both w={1.4} />
      <T x={316} y={124} s={10.5}>beeswax or paraffin</T>

      <Num x={322} y={156} n={2} />
      <T x={336} y={160} s={12} c={C.text} w="600">Buff</T>
      <EdgeFace x1={316} x2={466} y={174} h={24} tone="rgba(70,40,18,0.35)">
        <line x1={322} y1={181} x2={410} y2={181} stroke="#fff4d8" strokeWidth="1.6" opacity="0.75" strokeLinecap="round" />
      </EdgeFace>
      <Cloth x={410} y={166} w={52} h={40} />
      <Arrow d="M404 216 q22 10 44 0" w={1.4} />
      <T x={316} y={236} s={10.5}>a cloth, brisk strokes</T>
      <T x={316} y={254} s={10.5} c={C.emerald}>sheen + water resistance</T>
    </Fig>
  )
}

/* ================================================================== */
/* EDGES II — painted edges                                            */
/* ================================================================== */
const COATS = (n, t = 0.08) => Array.from({ length: n }, (_, i) => ({ t, c: i % 2 ? '#5a4330' : '#3b2a1d', line: '#8a6a4a' }))

const Thermo = ({ x, y, label }) => (
  <g>
    <rect x={x - 3} y={y - 26} width="6" height="22" rx="3" fill="rgba(255,255,255,0.06)" stroke={C.struct} strokeWidth="0.9" />
    <rect x={x - 1.4} y={y - 16} width="2.8" height="12" fill={C.ruby} />
    <circle cx={x} cy={y} r="5" fill={C.ruby} stroke={C.struct} strokeWidth="0.9" />
    {label && (
      <T x={x + 10} y={y - 6} s={12} c={C.text} w="600">
        {label}
      </T>
    )}
  </g>
)

/* Prepare: sanded flat, fuzz singed, no agent */
function PaintPrep() {
  const spec = { x: 176, y: 98, s: 30, W: 3.8 }
  const gA = { x: 150, y: 246, s: 22, W: 3.6, b: 0.3, r: 1 }
  const gB = { x: 380, y: 246, s: 22, W: 3.6, b: 0.3, r: 2 }
  const geoB = edgeGeom(gB)
  const lift = at(geoB, 0.7)
  const lp = along(lift, 5)
  return (
    <Fig h={330} view="Detail · edge profile" scale="true scale ×30">
      <Edge {...spec} fuzz={0.15} fuzzN={20} singe seed={61} />
      <HeatGun x={206} y={125} ang={90} k={0.8} />
      <Lb p={[246, 118]} t={[276, 72]} text="heat gun" sub="one quick pass" />
      <Lb p={[181, 104]} t={[132, 66]} text="fuzz singed off" />
      <Lb p={[176, 140]} t={[118, 182]} text="sanded flat: ~180 → 400" sub="no agent, no slicking" a="middle" />
      <T x={spec.x - 3.8 * 30 - 6} y={121} a="end" s={10} c={C.faint}>top</T>
      <T x={spec.x - 3.8 * 30 - 6} y={145} a="end" s={10} c={C.faint}>lining</T>
      <Sander x={404} y={136} len={112} />
      <T x={404} y={131} a="middle" s={10} mono c="#f1e6d2">~180 → 400</T>
      <Arrow a={[350, 150]} b={[458, 150]} both w={1.4} />
      <T x={404} y={170} a="middle" s={10.5}>sand along the edge first</T>

      <Sep x1={14} y1={202} x2={466} y2={202} />
      <Panel x={14} y={212} w={222} h={110} title="Sanded: paint keys in" ok />
      <Edge {...gA} pores={6} poreR={1.3} poreC="#3b2a1d" coats={COATS(2, 0.12)} seed={62} />
      <Lb p={[152, 262]} t={[178, 302]} text="paint grips the open fibres" a="middle" s={10.5} />
      <Panel x={244} y={212} w={222} h={110} title="Slicked first: paint lifts" ok={false} />
      <Edge {...gB} band={0.12} gloss={0.5} coats={COATS(2, 0.12)} seed={63} />
      <path d={`M${lift.p[0] + 1} ${lift.p[1] - 6} q10 2 14 14`} fill="none" stroke="#3b2a1d" strokeWidth="3" strokeLinecap="round" />
      <path d={`M${lift.p[0] + 1} ${lift.p[1] - 6} q10 2 14 14`} fill="none" stroke={C.ruby} strokeWidth="0.8" strokeDasharray="2 2" />
      <Lb p={[lp[0] + 8, lp[1] + 6]} t={[404, 302]} text="slicked: paint can’t key" a="middle" s={10.5} />
    </Fig>
  )
}

/* A small bevel: paint wraps a gentle corner */
function BentEdge({ cx, cy, painted = true, cracked }) {
  const a0 = -150
  const a1 = -30
  const P2 = (r, a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)]
  const band = (r1, r2, fill) => {
    const [x1, y1] = P2(r1, a0)
    const [x2, y2] = P2(r1, a1)
    const [x3, y3] = P2(r2, a1)
    const [x4, y4] = P2(r2, a0)
    return <path d={`M${x1} ${y1} A${r1} ${r1} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${r2} ${r2} 0 0 0 ${x4} ${y4} Z`} fill={fill} stroke="#2a1d14" strokeWidth="0.7" />
  }
  return (
    <g>
      {band(66, 56, painted ? '#3b2a1d' : 'url(#sk-topS)')}
      {band(56, 50, painted ? '#4a3524' : 'url(#sk-linS)')}
      {cracked &&
        [-128, -112, -98, -84, -70, -54].map((a) => {
          const [x1, y1] = P2(67, a)
          const [x2, y2] = P2(58, a + 1.5)
          const [x3, y3] = P2(54, a - 1)
          return <path key={a} d={`M${f1(x1)} ${f1(y1)} L${f1(x2)} ${f1(y2)} L${f1(x3)} ${f1(y3)}`} fill="none" stroke={C.ruby} strokeWidth="1.3" />
        })}
      {!cracked && <path d={`M${f1(P2(64, -128)[0])} ${f1(P2(64, -128)[1])} A64 64 0 0 1 ${f1(P2(64, -52)[0])} ${f1(P2(64, -52)[1])}`} fill="none" stroke="#fff4d8" strokeWidth="1" opacity="0.45" />}
    </g>
  )
}
function PaintBevel() {
  const A = { x: 150, y: 84, s: 32, W: 3.2, b: 0.25, r: 2 }
  const B = { x: 382, y: 84, s: 32, W: 3.2, b: 0.75, r: 0 }
  const gA = edgeGeom(A)
  const gB = edgeGeom(B)
  const tA = at(gA, 0.15)
  const cB = at(gB, 1 / 3)
  return (
    <Fig h={330} view="Detail · profile + side view" scale="×32 · paint exaggerated">
      <Panel x={14} y={28} w={222} h={180} title="Small bevel · size 0" ok />
      <Edge {...A} coats={COATS(3, 0.07)} gloss={0.4} seed={64} />
      <Beveller x={tA.p[0] + 10} y={tA.p[1] - 8} ang={50} k={0.5} op={0.9} />
      <Lb p={[184, 64]} t={[120, 66]} text="small beveller" a="end" s={10.5} />
      <Lb p={[at(gA, 0.62).p[0] + 6, at(gA, 0.62).p[1]]} t={[118, 172]} text="paint wraps a gentle corner" sub="even thickness all round" a="middle" />
      <Panel x={244} y={28} w={222} h={180} title="Big bevel" ok={false} />
      <Edge {...B} coats={COATS(3, 0.07)} cracks={[0, 1 / 3, 2 / 3, 1]} seed={65} />
      <Lb p={[along(cB, 8)[0], along(cB, 8)[1]]} t={[300, 66]} text="a sharp ridge of paint" a="middle" s={10.5} c={C.ruby} />
      <Lb p={[at(gB, 0.62).p[0] + 6, at(gB, 0.62).p[1]]} t={[350, 172]} text="paint thins on the corners" sub="and cracks there first" a="middle" />

      <Tag x={20} y={230}>Where the strap folds (side view)</Tag>
      <Verdict x={40} y={252} ok />
      <T x={54} y={256} s={10.5} c={C.emerald}>small bevel: flexes with the leather</T>
      <BentEdge cx={125} cy={340} />
      <Verdict x={270} y={252} ok={false} />
      <T x={284} y={256} s={10.5} c={C.ruby}>big bevel: cracks at the fold</T>
      <BentEdge cx={355} cy={340} cracked />
    </Fig>
  )
}

/* Prime (optional): fill the open fibres */
function TipPaint({ x, y, runs, ok }) {
  const T0 = { x: x - 92 * 3, y, s: 3 }
  const o = LONG({ x0: 92 })
  const R = rng(ok ? 3 : 4)
  return (
    <g>
      <StrapPlan T={T0} o={o} />
      {runsOf(o, 96).map((r, i) => strokeRun(T0, r, C.paint, 3.2, 'tp' + i, 1))}
      <BreakV x={x} y1={y - 34} y2={y + 34} />
      {runs &&
        [104, 110, 114, 117].map((mx, i) => {
          const [px0, py0] = px(T0, mx, -widthAt(mx, o) / 2 + (mx > 112 ? 2.5 : 0))
          const L = 6 + R() * 9
          return (
            <g key={i}>
              <path d={`M${f1(px0)} ${f1(py0)} q-0.6 ${f1(L * 0.6)} 0 ${f1(L)}`} fill="none" stroke={C.paint} strokeWidth="1.8" strokeLinecap="round" />
              <circle cx={f1(px0)} cy={f1(py0 + L + 1)} r="2.2" fill={C.paint} />
            </g>
          )
        })}
    </g>
  )
}
function PaintPrime() {
  const A = { x: 170, y: 66, s: 40, W: 2.6, b: 0.3, r: 1 }
  const B = { x: 404, y: 66, s: 40, W: 2.6, b: 0.3, r: 1 }
  const gA = edgeGeom(A)
  const gB = edgeGeom(B)
  return (
    <Fig h={330} view="Detail · edge profile" scale="true scale ×40 · primer exaggerated">
      <T x={20} y={44} s={11} c={C.brass} it>optional</T>
      <Tag x={66} y={44}>Open fibres</Tag>
      <Edge {...A} pores={9} poreR={1.7} seed={66} />
      <Arrow a={[194, 102]} b={[288, 102]} w={1.8} />
      <T x={241} y={94} a="middle" s={11} c={C.brass}>prime</T>
      <Tag x={300} y={44}>Primed</Tag>
      <Edge {...B} pores={9} poreR={1.7} primer={0.1} seed={66} />
      <Lb p={[at(gA, 0.55).p[0] - 3, at(gA, 0.55).p[1]]} t={[118, 170]} text="open fibre ends" sub="paint would sink and run" a="middle" />
      <Lb p={[along(at(gB, 0.4), 2)[0], along(at(gB, 0.4), 2)[1]]} t={[456, 52]} text="primer" a="end" />
      <Lb p={[at(gB, 0.62).p[0] - 3, at(gB, 0.62).p[1]]} t={[352, 170]} text="fibres filled" sub="a level base for the paint" a="middle" />

      <Sep x1={14} y1={202} x2={466} y2={202} />
      <T x={20} y={222} s={11} c={C.text}>Primers</T>
      <T x={76} y={222} s={11}>Uniters EP Coat · Giardini Basecoat Dense · Fenice base</T>
      <TipPaint x={90} y={270} runs />
      <Verdict x={30} y={270} ok={false} />
      <T x={130} y={318} a="middle" s={10.5} c={C.ruby}>unprimed: coats run on the curve</T>
      <TipPaint x={320} y={270} />
      <Verdict x={260} y={270} ok />
      <T x={360} y={318} a="middle" s={10.5} c={C.emerald}>primed: the coat stays put</T>
    </Fig>
  )
}

/* One thin coat: strap upright, one edge at a time */
function UprightSec({ x, y, blob }) {
  const w = 28
  const h = 70
  return (
    <g>
      <rect x={x} y={y} width={w * 0.6} height={h} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.7" />
      <rect x={x + w * 0.6} y={y} width={w * 0.4} height={h} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
      <BreakH x1={x - 3} x2={x + w + 3} y={y + h} />
      {blob ? (
        <g fill={C.paint}>
          <path d={`M${x - 3} ${y + 4} Q${x - 4} ${y - 9} ${x + w / 2} ${y - 10} Q${x + w + 4} ${y - 9} ${x + w + 3} ${y + 4} Z`} />
          <path d={`M${x - 3} ${y + 2} q-2 14 0 22 q2 4 3 0 q1 -10 1 -22 Z M${x + w + 3} ${y + 2} q2 9 0 30 q-2 4 -3 0 q-1 -14 -1 -30 Z`} />
        </g>
      ) : (
        <path d={`M${x - 0.5} ${y + 2} Q${x} ${y - 3} ${x + w / 2} ${y - 3} Q${x + w} ${y - 3} ${x + w + 0.5} ${y + 2} Z`} fill={C.paint} />
      )}
    </g>
  )
}
const BreakH = ({ x1, x2, y }) => (
  <path d={`M${x1} ${y - 2} l${(x2 - x1) * 0.3} 4 l${(x2 - x1) * 0.4} -4 l${(x2 - x1) * 0.3} 4`} fill="none" stroke={C.dim} strokeWidth="1" />
)
function PaintCoat() {
  const T0 = { x: 26, y: 118, s: 2.4 }
  const o = LONG()
  const upper = (a, b) => Array.from({ length: 30 }, (_, i) => {
    const x = a + ((b - a) * i) / 29
    return [x, -widthAt(x, o) / 2]
  })
  const ax = 26 + 70 * 2.4
  const ay = 118 - (widthAt(70, o) / 2) * 2.4
  return (
    <Fig h={330} view="Side view · strap held upright" scale="plan ×2.4 · sections ×16">
      <StrapPlan T={T0} o={o} holes={{}} stitch={{ m: 3, p: 3, from: 5 }} />
      {strokeRun(T0, upper(6, 70), C.paint, 3.4, 'bead', 1)}
      <path d={P(upper(8, 68).map(([x, y]) => px(T0, x, y - 0.35)))} fill="none" stroke="#7a5638" strokeWidth="0.7" opacity="0.9" />
      <Applicator x={ax + 2} y={ay - 1} ang={-28} k={0.85} />
      <Arrow a={[ax + 16, ay - 10]} b={[ax + 70, ay - 10]} w={1.6} />
      <Lb p={[ax - 24, ay - 54]} t={[150, 40]} text="roller pen or applicator" a="end" />
      <Lb p={[110, ay + 0.5]} t={[70, 62]} text="thin bead behind it" a="middle" />
      <T x={ax + 16} y={ay - 18} s={10.5} c={C.brass}>along the edge</T>
      <Lb p={[130, 92]} t={[120, 176]} text="the edge being painted faces up" sub="one edge at a time" a="middle" />
      {/* stray paint on the face, wiped at once */}
      <ellipse cx={262} cy={128} rx="5" ry="2.6" fill={C.paint} opacity="0.9" />
      <Lb p={[262, 130]} t={[282, 176]} text="stray paint" sub="wipe off at once" c={C.ruby} a="middle" s={10.5} />

      <Sep x1={340} y1={30} x2={340} y2={200} />
      <Tag x={352} y={44}>Section · upright</Tag>
      <UprightSec x={364} y={84} />
      <Verdict x={378} y={62} ok />
      <T x={378} y={184} a="middle" s={10.5} c={C.emerald}>thin bead</T>
      <UprightSec x={424} y={84} blob />
      <Verdict x={438} y={62} ok={false} />
      <T x={438} y={184} a="middle" s={10.5} c={C.ruby}>runs down</T>

      <Sep x1={14} y1={210} x2={466} y2={210} />
      <Tag x={20} y={230}>Wipe strays off the faces</Tag>
      <rect x={30} y={244} width={200} height={50} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <rect x={30} y={240} width={200} height={4} fill={C.paint} />
      <ellipse cx={92} cy={262} rx="9" ry="4" fill={C.paint} opacity="0.85" />
      <path d="M150 262 q14 -3 30 1" fill="none" stroke="rgba(59,42,29,0.35)" strokeWidth="5" strokeLinecap="round" />
      <Cloth x={176} y={248} w={46} h={34} />
      <Arrow a={[160, 302]} b={[214, 302]} w={1.4} />
      <T x={30} y={320} s={10.5}>wet paint wipes clean; dried paint won’t</T>
      <Note x={262} y={240} head="One thin coat" hc={C.text} lines={['held upright, so the bead sits on', 'the edge and can’t run onto a face;', 'one edge at a time, never one', 'thick coat']} s={10.5} lh={14} />
    </Fig>
  )
}

/* Dry: 10–30 minutes, one edge of both pieces then the other */
function PaintDry() {
  const TLp = { x: 40, y: 262, s: 1.45 }
  const TSp = { x: 254, y: 262, s: 1.45 }
  const oL = LONG()
  const oS = SHORT()
  const up = (o, a, b) => runsOf(o, a, b)
  return (
    <Fig h={328} view="Chart · drying & work order" scale="schematic">
      <Clock x={96} y={100} r={44} to={10} to2={30} />
      <T x={96} y={168} a="middle" s={15} c={C.text} w="600">10–30 min</T>
      <T x={96} y={185} a="middle" s={10.5}>by paint and thickness</T>

      <Tag x={214} y={44}>Wet → dry</Tag>
      <Edge x={292} y={66} s={26} W={2.6} b={0.3} r={2} coats={[{ t: 0.17, c: '#4a3524', line: '#9b7a58' }]} gloss={0.95} seed={67} />
      <Arrow a={[312, 92]} b={[362, 92]} w={1.5} />
      <Edge x={440} y={66} s={26} W={2.6} b={0.3} r={2} coats={[{ t: 0.09, c: '#3b2a1d' }]} seed={67} />
      <T x={262} y={140} a="middle" s={10.5} c={C.text}>wet: glossy, proud</T>
      <T x={406} y={140} a="middle" s={10.5} c={C.text}>dry: matt, settled</T>
      <T x={334} y={170} a="middle" s={10.5}>don’t smooth or recoat until it is dry</T>

      <Sep x1={14} y1={200} x2={466} y2={200} />
      <Tag x={20} y={220}>Work order</Tag>
      <StrapPlan T={TLp} o={oL} />
      <StrapPlan T={TSp} o={oS} />
      {up(oL, 0, 200).slice(0, 1).map(() => null)}
      {[
        [TLp, oL, -1, 1, 60],
        [TSp, oS, -1, 2, 40],
        [TLp, oL, 1, 3, 60],
        [TSp, oS, 1, 4, 40],
      ].map(([T0, o, side, n, mx], i) => {
        const pts = Array.from({ length: 24 }, (_, k) => {
          const x = 4 + ((o.x1 - (o === oL ? 18 : 4)) * k) / 23
          return px(T0, x, (side * widthAt(x, o)) / 2)
        })
        const [nx, ny] = px(T0, mx, (side * widthAt(mx, o)) / 2)
        return (
          <g key={i}>
            <path d={P(pts)} fill="none" stroke={n <= 2 ? C.paint : C.brass} strokeWidth={n <= 2 ? 3.4 : 1.4} strokeLinecap="round" strokeDasharray={n <= 2 ? undefined : '6 4'} />
            <Num x={nx} y={ny + side * 14} n={n} r={7.5} />
          </g>
        )
      })}
      <T x={24} y={250} s={10} c={C.faint}>A</T>
      <T x={24} y={280} s={10} c={C.faint}>B</T>
      <T x={20} y={318} s={10.5}>Edge A of both pieces, then edge B: each coat dries while you work the next.</T>
    </Fig>
  )
}

/* Smooth: light sanding or a hot iron under 90 °C */
function PaintSmooth() {
  const A = { x: 140, y: 82, s: 30, W: 3, b: 0.3, r: 2 }
  const B = { x: 372, y: 82, s: 30, W: 3, b: 0.3, r: 2 }
  const gA = edgeGeom(A)
  const gB = edgeGeom(B)
  const lvl = offLine(gA.run, 0.2 * 30 - 0.5)
  const mA = at(gA, 0.5)
  const mB = at(gB, 0.5)
  return (
    <Fig h={318} view="Detail · edge profile" scale="true scale ×30 · paint exaggerated">
      <Tag x={20} y={42}>A · Sand lightly</Tag>
      <Edge {...A} coats={[{ t: 0.1, c: '#3b2a1d' }, { t: 0.1, c: '#5a4330', bump: 2.6 }]} seed={68} />
      <path d={P(lvl)} fill="none" stroke={C.brassHi} strokeWidth="1" strokeDasharray="3 2" />
      <g transform={`translate(${mA.p[0] + 12} ${mA.p[1]}) rotate(90)`}>
        <rect x={-34} y={-14} width={68} height={14} rx="2" fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.8" />
        <rect x={-30} y={-4} width={60} height={4} fill="#9d9483" />
      </g>
      <Lb p={[mA.p[0] + 20, mA.p[1] - 26]} t={[206, 44]} text="sanding stick" a="end" s={10.5} />
      <Lb p={[along(at(gA, 0.3), 6)[0], along(at(gA, 0.3), 6)[1]]} t={[70, 160]} text="knock the ridges down" sub="to the dashed line" a="middle" />
      <rect x={24} y={198} width={200} height={50} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={34} y={218} s={11} c={C.text}>early coats</T>
      <T x={214} y={218} s={11} mono a="end" c={C.brass}>400–600</T>
      <T x={34} y={238} s={11} c={C.text}>later coats</T>
      <T x={214} y={238} s={11} mono a="end" c={C.brass}>800–1200</T>

      <Sep x1={240} y1={30} x2={240} y2={300} />
      <circle cx={240} cy={120} r={13} fill={C.ground} stroke={C.line} />
      <T x={240} y={124} a="middle" s={11} c={C.text} it>or</T>

      <Tag x={256} y={42}>B · Hot edge iron</Tag>
      <Edge {...B} coats={COATS(2, 0.1)} gloss={0.5} seed={69} />
      <Creaser x={mB.p[0] + 7} y={mB.p[1]} ang={90} k={0.8} hot />
      <Lb p={[440, 112]} t={[462, 66]} text="edge iron, glided along" a="end" s={10.5} />
      <Lb p={[along(at(gB, 0.25), 6)[0], along(at(gB, 0.25), 6)[1]]} t={[300, 166]} text="paint flowed level" a="middle" />
      <Thermo x={276} y={238} label="under 90 °C" />
      <T x={268} y={268} s={10.5}>glide it; don’t let it dwell</T>
      <T x={20} y={290} s={10.5} c={C.faint}>Either way: light, quick, then the next coat.</T>
    </Fig>
  )
}

/* Build the coats: 3–4 thin, sanded between; width grows */
function LugGap({ x, y, coats, ok }) {
  const gap = 52
  const lug = (yy) => <rect x={x} y={yy} width={92} height={10} rx="4" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.7" />
  const c = coats * 2.6
  const body = gap - 4
  const y0 = y + 10 + (gap - body) / 2
  return (
    <g>
      {lug(y)}
      {lug(y + 10 + gap)}
      <rect x={x + 20} y={y0} width={72} height={body} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.7" />
      <rect x={x + 20} y={y0 - c} width={72} height={c} fill={C.paint} />
      <rect x={x + 20} y={y0 + body} width={72} height={c} fill={C.paint} />
      {!ok && <rect x={x + 18} y={y + 6} width={76} height={6} fill="rgba(194,88,99,0.55)" />}
      {!ok && <rect x={x + 18} y={y + 8 + gap} width={76} height={6} fill="rgba(194,88,99,0.55)" />}
      <BarEnd cx={x + 8} cy={y + 10 + gap / 2} r={4} />
    </g>
  )
}
function PaintRepeat() {
  const spec = { x: 170, y: 74, s: 36, W: 3, b: 0.3, r: 2 }
  const g = edgeGeom(spec)
  const m = at(g, 0.5)
  const L = { cx: 330, cy: 112, r: 64 }
  return (
    <Fig h={346} view="Detail · edge profile" scale="true scale ×36 · coats exaggerated">
      <Edge {...spec} coats={COATS(4, 0.08)} gloss={0.5} seed={70} />
      <T x={g.x0 - 6} y={100} a="end" s={10} c={C.faint}>top</T>
      <T x={g.x0 - 6} y={128} a="end" s={10} c={C.faint}>lining</T>
      <Loupe cx={L.cx} cy={L.cy} r={L.r} src={along(m, 5)} sr={8} label="4 thin coats, sanded between">
        <EdgeZoom cx={L.cx - 36} cy={L.cy} g={g} q={m} s={170} r={2} coats={COATS(4, 0.08)} seed={71} />
        {[0, 1, 2, 3].map((i) => (
          <Num key={i} x={L.cx - 36 + (i + 0.5) * 13.6} y={L.cy - 30} n={i + 1} r={6} />
        ))}
      </Loupe>
      <Lb p={[along(at(g, 0.2), 9)[0], along(at(g, 0.2), 9)[1]]} t={[150, 48]} text="a level, sealed edge" a="end" s={10.5} />
      <Note x={410} y={64} head="Course" hc={C.text} lines={['3–4 thin', 'coats']} s={10.5} lh={14} />
      <Note x={410} y={124} head="Makers" hc={C.text} lines={['2 light', 'up to 6']} s={10.5} lh={14} />

      <Sep x1={14} y1={206} x2={466} y2={206} />
      <Tag x={20} y={226}>Each round</Tag>
      {[
        ['coat', 20, 50],
        ['dry 10–30 min', 82, 94],
        ['smooth', 188, 50],
      ].map(([t, x, w], i) => (
        <g key={t}>
          <rect x={x} y={240} width={w} height={26} rx="5" fill="rgba(255,255,255,0.03)" stroke={C.brass} />
          <T x={x + w / 2} y={257} a="middle" s={10.5} c={C.text}>
            {t}
          </T>
          {i < 2 && <path d={`M${x + w + 2} 253 l8 0`} stroke={C.brass} strokeWidth="1.2" markerEnd="url(#sk-a-brass)" />}
        </g>
      ))}
      <Arrow d="M212 270 Q128 302 46 270" w={1.3} />
      <T x={128} y={314} a="middle" s={11} c={C.brass}>× 3–4 thin coats</T>

      <Tag x={250} y={226}>Every coat adds width</Tag>
      <T x={250} y={243} s={10.5}>cut exactly to the lug gap? stop at two</T>
      <LugGap x={256} y={252} coats={2} ok />
      <Verdict x={274} y={332} ok r={7} />
      <T x={286} y={336} s={10.5} c={C.emerald}>2 coats</T>
      <LugGap x={370} y={252} coats={4} />
      <Verdict x={388} y={332} ok={false} r={7} />
      <T x={400} y={336} s={10.5} c={C.ruby}>4: binds</T>
    </Fig>
  )
}

/* Finish: heat-set, then a little wax */
function PaintFinish() {
  const spec = { x: 150, y: 92, s: 30, W: 3.4, b: 0.3, r: 2 }
  const g = edgeGeom(spec)
  return (
    <Fig h={300} view="Detail · profile + elevation" scale="×30 · layers exaggerated">
      <Tag x={20} y={44}>The finished edge</Tag>
      <Edge {...spec} coats={COATS(3, 0.08)} wax={0.06} gloss={0.55} seed={72} />
      <Lb p={[along(at(g, 0.25), 4)[0], along(at(g, 0.25), 4)[1]]} t={[112, 62]} text="paint, heat-set" a="end" s={10.5} />
      <Lb p={[along(at(g, 0.7), 9.4)[0], along(at(g, 0.7), 9.4)[1]]} t={[150, 196]} text="a little wax: semi-gloss" a="end" s={10.5} />
      <T x={g.x0 - 6} y={113} a="end" s={10} c={C.faint}>top</T>
      <Loupe cx={176} cy={254} r={36} src={along(at(g, 0.5), 4)} sr={6}>
        <EdgeZoom cx={156} cy={254} g={g} q={at(g, 0.5)} s={130} r={2} coats={COATS(3, 0.08)} wax={0.06} seed={73} />
      </Loupe>
      <T x={128} y={248} a="end" s={10.5}>3 paint coats</T>
      <T x={128} y={266} a="end" s={10.5}>wax film</T>

      <Sep x1={236} y1={30} x2={236} y2={286} />
      <Num x={258} y={44} n={1} />
      <T x={272} y={48} s={12} c={C.text} w="600">Heat-set the last coat</T>
      <EdgeFace x1={252} x2={466} y={102} h={24} tone="rgba(40,24,12,0.88)" />
      <path d="M252 125 h120" stroke="rgba(255,244,216,0.28)" strokeWidth="1" />
      <Creaser x={384} y={114} ang={-32} k={0.55} hot />
      <Arrow a={[396, 138]} b={[452, 138]} w={1.5} />
      <T x={252} y={156} s={10.5}>warm creaser glided along the edge</T>

      <Num x={258} y={180} n={2} />
      <T x={272} y={184} s={12} c={C.text} w="600">Wax & buff</T>
      <EdgeFace x1={252} x2={466} y={198} h={24} tone="rgba(40,24,12,0.88)">
        <line x1={258} y1={205} x2={396} y2={205} stroke="#fff4d8" strokeWidth="1.6" opacity="0.55" strokeLinecap="round" />
      </EdgeFace>
      <Cloth x={402} y={190} w={56} h={40} />
      <Arrow d="M396 240 q24 10 50 0" w={1.4} />
      <T x={252} y={262} s={10.5}>a little wax, buffed with a cloth</T>
      <T x={252} y={280} s={10.5} c={C.emerald}>semi-gloss, sealed</T>
    </Fig>
  )
}

/* Where paint never goes: stop where the fold begins */
function PaintNoGo() {
  const x1 = 104
  const x2 = 452
  const y = 72
  const s = 3.4
  const k = 12
  const Tt = 1.1 * k
  const Lt = 0.7 * k
  const r = 0.9 * k
  const y1 = y + Tt
  const cv = r * 2.6
  const tl = r * 4.2
  const xs = x1 + cv
  const tailT = (x) => (x >= xs && x <= xs + tl ? Tt * 0.45 * (1 - (x - xs) / tl) : 0)
  const thick = (x) => Math.max(Lt * 0.25, Math.min(Lt, Lt * (0.25 + (0.75 * (x - xs - 1)) / (10 * s))))
  const N = 50
  const topPts = [[xs, y], [x2, y]]
  const bot = Array.from({ length: N + 1 }, (_, i) => {
    const x = x2 - ((x2 - xs) * i) / N
    return [x, y1 + tailT(x) + thick(x)]
  })
  return (
    <Fig h={330} view="Side view · the edge at the lug end" scale="thickness ×3.5">
      <Ply x1={x1} x2={x2} y={y} t={Tt} open="l" />
      <Wrap cx={x1} cy={y1 + r} r={r} t={Tt} xR={x1} conv={cv} tail={tl} ts={Tt * 0.45} />
      <polygon
        points={(() => {
          const pts = []
          for (let i = 0; i <= N; i++) {
            const x = xs + 1 + ((x2 - xs - 1) * i) / N
            pts.push([x, y1 + tailT(x)])
          }
          for (let i = N; i >= 0; i--) {
            const x = xs + 1 + ((x2 - xs - 1) * i) / N
            pts.push([x, y1 + tailT(x) + thick(x)])
          }
          return pts.map((p) => p.map(f1).join(',')).join(' ')
        })()}
        fill="url(#sk-linS)"
        stroke="#8f7b5a"
        strokeWidth="0.8"
      />
      <BarEnd cx={x1} cy={y1 + r} r={r * 0.92} />
      <path d={P([...topPts, ...bot], true)} fill={C.paint} opacity="0.93" />
      <path d={P([...topPts, ...bot], true)} fill="none" stroke="#7a5638" strokeWidth="0.7" />
      <path d={`M${x2 + 2} ${y - 4} l-4 ${(Tt + Lt + 8) * 0.3} l4 ${(Tt + Lt + 8) * 0.4} l-4 ${(Tt + Lt + 8) * 0.3}`} fill="none" stroke={C.dim} strokeWidth="1" />
      <path d={`M${x1} ${y} A${r + Tt} ${r + Tt} 0 0 0 ${x1} ${y1 + 2 * r + Tt}`} fill="none" stroke={C.ruby} strokeWidth="3.5" strokeLinecap="round" opacity="0.9" />
      <line x1={xs} y1={y - 14} x2={xs} y2={y + 52} stroke={C.brassHi} strokeWidth="1.3" strokeDasharray="4 3" />
      <Lb p={[xs, y - 14]} t={[xs + 24, 40]} text="stop the coat here" sub="where the fold begins" c={C.brass} />
      <Lb p={[x1 - r - Tt + 1, y1 + r]} t={[44, 132]} text="spine" sub="no paint" c={C.ruby} a="middle" />
      <Lb p={[330, y + 10]} t={[372, 40]} text="painted edge" sub="3–4 thin coats" />
      <Lb p={[x1, y1 + r]} t={[118, 136]} text="bar" a="start" s={10.5} />

      <Sep x1={14} y1={160} x2={466} y2={160} />
      <Tag x={20} y={180}>Plan · lug end</Tag>
      {(() => {
        const T0 = { x: 64, y: 240, s: 3 }
        const o = LONG({ x1: 44, tip: 'square' })
        const edge = (side) => Array.from({ length: 20 }, (_, i) => {
          const x = 9 + (35 * i) / 19
          return px(T0, x, (side * widthAt(x, o)) / 2)
        })
        return (
          <g>
            <SpringBar x={64} y1={204} y2={276} r={2.6} />
            <StrapPlan T={T0} o={o} />
            <BreakV x={64 + 44 * 3} y1={206} y2={274} />
            <path d={P(edge(-1))} fill="none" stroke={C.paint} strokeWidth="4" strokeLinecap="round" />
            <path d={P(edge(1))} fill="none" stroke={C.paint} strokeWidth="4" strokeLinecap="round" />
            {[-1, 1].map((sd) => (
              <circle key={sd} cx={66} cy={240 + sd * 29} r="7" fill="none" stroke={C.ruby} strokeWidth="1.5" />
            ))}
            <line x1={64 + 9 * 3} y1={204} x2={64 + 9 * 3} y2={276} stroke={C.brassHi} strokeWidth="1" strokeDasharray="3 3" />
            <Lb p={[70, 274]} t={[100, 304]} text="horns: no paint" c={C.ruby} s={10.5} />
            <T x={91} y={200} a="middle" s={10} c={C.brass}>fold</T>
          </g>
        )
      })()}

      <Panel x={246} y={172} w={220} h={146} title="Paint on the spine" ok={false} />
      {(() => {
        const cx = 300
        const cy = 248
        const rr = 12
        const tt = 13
        return (
          <g>
            <Ply x1={cx} x2={458} y={cy - rr - tt} t={tt} open="l" />
            <Wrap cx={cx} cy={cy} r={rr} t={tt} xR={cx} conv={30} tail={40} ts={6} />
            <BarEnd cx={cx} cy={cy} r={rr * 0.92} />
            <path d={`M${cx} ${cy - rr - tt - 1.5} A${rr + tt + 1.5} ${rr + tt + 1.5} 0 0 0 ${cx} ${cy + rr + tt + 1.5}`} fill="none" stroke={C.paint} strokeWidth="3.5" />
            {[-60, -20, 20, 55].map((a) => {
              const rad = (Math.PI * (180 + a)) / 180
              const R1 = rr + tt + 4
              const R2 = rr + tt - 3
              return <line key={a} x1={cx + R1 * Math.cos(rad)} y1={cy + R1 * Math.sin(rad)} x2={cx + R2 * Math.cos(rad)} y2={cy + R2 * Math.sin(rad)} stroke={C.ruby} strokeWidth="1.5" />
            })}
            <path d={`M${cx - 30} ${cy + 12} l-6 3 l2 5 l6 -2 Z M${cx - 26} ${cy - 22} l-5 -4 l-4 4 l4 3 Z`} fill={C.paint} />
            <T x={348} y={296} s={10.5} c={C.ruby}>cracks and rubs off</T>
          </g>
        )
      })()}
    </Fig>
  )
}

/* ================================================================== */
/* SPRING-BAR FOLDS & QR NOTCHES                                       */
/* ================================================================== */
// Local gradient: the cut face of a top layer lying flesh UP (grain at the bottom).
function FinDefs() {
  return (
    <defs>
      <linearGradient id="skf-topR" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#7d5228" />
        <stop offset="0.18" stopColor="#b2804a" />
        <stop offset="1" stopColor="#d3ae7b" />
      </linearGradient>
    </defs>
  )
}

// Thickness (mm) of the lug-end top layer at d mm beyond the fold line
// (d > 0 toward the 20 mm flap end): full body, a short ramp, the wrap zone at
// about half, then the tail feathered to nothing.
const T_TOP = 1.1
const flapT = (d) => {
  if (d <= -6) return T_TOP
  if (d < 0) return T_TOP - ((d + 6) / 6) * (T_TOP - 0.55)
  if (d <= 6) return 0.55
  return Math.max(0.04, 0.55 * (1 - (d - 6) / 14))
}
// Section polygon of that strip, flesh up, grain on y = yb. F = fold-line px.
function flapPoly({ F, yb, s, k, d0 = -30, d1 = 20 }) {
  const N = 90
  const pts = []
  for (let i = 0; i <= N; i++) {
    const d = d1 - ((d1 - d0) * i) / N
    pts.push([F - d * s, yb - flapT(d) * k])
  }
  return [...pts, [F - d0 * s, yb], [F - d1 * s, yb]]
}
const surf = (F, yb, s, k) => (d, lift = 0) => [F - d * s, yb - flapT(d) * k - lift]
const runD = (fn, a, b, lift = 0, n = 16) => Array.from({ length: n + 1 }, (_, i) => fn(a + ((b - a) * i) / n, lift))
const GlueRun = ({ pts }) => <path d={P(pts)} fill="none" stroke={C.glue} strokeWidth="2.4" strokeDasharray="1.2 2.6" strokeLinecap="round" />

// Lug fold in section, grain up as worn: body (t) whose flesh ramps up to
// the loop, the loop (tl ≈ ½ t) round the bar or former (radius r), and the
// tail feathered under the body. flip mirrors it about y = ym (flesh up).
function foldPaths({ cx, cy, r, t, tl, ramp, conv, tail, body }) {
  const yT = cy - r - tl
  const yB = yT + t
  const tt = tl * 0.85
  const outer = `M${cx} ${yT} A${r + tl} ${r + tl} 0 0 0 ${cx} ${cy + r + tl} C${cx + conv * 0.55} ${cy + r + tl} ${cx + conv * 0.62} ${yB + tt} ${cx + conv} ${yB + tt} L${cx + conv + tail} ${yB + 0.4}`
  const innerTail = `L${cx + conv} ${yB} C${cx + conv * 0.62} ${yB} ${cx + conv * 0.55} ${cy + r} ${cx} ${cy + r} A${r} ${r} 0 0 1 ${cx} ${cy - r}`
  return {
    yT,
    yB,
    tt,
    loop: `${outer} ${innerTail} Z`,
    outer,
    inner: `M${cx + conv + tail} ${yB + 0.4} ${innerTail}`,
    body: `M${cx} ${yT} L${cx + body} ${yT} L${cx + body} ${yB} L${cx + ramp} ${yB} L${cx} ${cy - r} Z`,
    bodyLine: `M${cx} ${yT} L${cx + body} ${yT} M${cx + body} ${yB} L${cx + ramp} ${yB} L${cx} ${cy - r}`,
    tailAt: (x) => (x <= cx + conv ? tt : x >= cx + conv + tail ? 0 : tt * (1 - (x - cx - conv) / tail)),
  }
}
function Fold({ flip, ym = 0, bar = true, former, barDash, paint, spine, children, ...g }) {
  const f = foldPaths(g)
  const { cx, cy, r, tl, body } = g
  const el = (
    <g>
      <path d={f.body} fill="url(#sk-topS)" />
      <path d={f.loop} fill="url(#sk-topS)" />
      {paint && <path d={`M${cx + paint} ${f.yT} L${cx + body} ${f.yT} L${cx + body} ${f.yB} L${cx + paint} ${f.yB} Z`} fill={C.paint} opacity="0.92" />}
      <path d={f.bodyLine} fill="none" stroke="#4a3018" strokeWidth="0.8" strokeLinejoin="round" />
      <path d={f.outer} fill="none" stroke="#4a3018" strokeWidth="0.8" />
      <path d={f.inner} fill="none" stroke="#4a3018" strokeWidth="0.8" />
      {spine && <path d={`M${cx} ${f.yT - 1.5} A${r + tl + 1.5} ${r + tl + 1.5} 0 0 0 ${cx} ${cy + r + tl + 1.5}`} fill="none" stroke={spine} strokeWidth="3.4" strokeLinecap="round" />}
      {former && <circle cx={cx} cy={cy} r={r - 0.6} fill="url(#sk-barEnd)" stroke="#2d3940" strokeWidth="0.8" />}
      {former && barDash && <circle cx={cx} cy={cy} r={r * 0.8} fill="none" stroke="#2d3940" strokeWidth="0.9" strokeDasharray="2 2" />}
      {bar && !former && <BarEnd cx={cx} cy={cy} r={r * 0.92} />}
      {children}
    </g>
  )
  return flip ? <g transform={`translate(0 ${2 * ym}) scale(1 -1)`}>{el}</g> : el
}

/* Skive the fold zone: doubled ≈ one layer */
function FoldSkive() {
  const F = 210
  const yb = 118
  const s = 5
  const k = 26
  const sp = surf(F, yb, s, k)
  const g = { cx: 84, cy: 272, r: 14, t: 22, tl: 11, ramp: 36, conv: 38, tail: 92, body: 196 }
  const fg = foldPaths(g)
  return (
    <Fig h={334} view="Section · lug end, flesh up" scale="length ×5 · thickness ×26">
      <FinDefs />
      <rect x={60} y={yb} width={392} height={7} rx="1.5" fill="url(#sk-glass)" stroke={C.steel} strokeWidth="0.6" />
      <path d={P(flapPoly({ F, yb, s, k, d0: -46, d1: 20 }), true)} fill="url(#skf-topR)" stroke="#4a3018" strokeWidth="0.8" />
      <BreakV x={F + 46 * s} y1={yb - 34} y2={yb + 4} />
      <line x1={F} y1={74} x2={F} y2={yb + 10} stroke={C.text} strokeWidth="1" strokeDasharray="4 3" />
      <T x={F + 5} y={74} s={10.5}>fold line</T>
      <Knife x={sp(18)[0]} y={sp(18)[1] - 0.5} ang={78} k={0.5} />
      <Lb p={[140, 109]} t={[96, 82]} text="skiving knife" sub="light passes" />
      <Lb p={sp(3, 1)} t={[176, 50]} text="wrap zone ≈ ½ thick" a="middle" />
      <Lb p={[332, yb - 1.1 * k + 3]} t={[338, 66]} text="body: full thickness" />
      <Dim a={[424, yb - 1.1 * k]} b={[424, yb]} off={-10} text="" />
      <T x={440} y={yb - 10} s={10.5} mono>1.1</T>
      <Dim a={[110, 142]} b={[180, 142]} text="" />
      <Dim a={[180, 142]} b={[210, 142]} text="" />
      <T x={145} y={158} a="middle" s={10.5}>tail → 0</T>
      <T x={195} y={158} a="middle" s={10.5} mono>5–6</T>
      <Dim a={[110, 172]} b={[210, 172]} text="" />
      <T x={160} y={188} a="middle" s={10.5}>
        lug flap <tspan fontFamily="var(--font-mono)">20</tspan>
      </T>
      <T x={256} y={158} s={10} c={C.faint}>wrap ≈ π(bar Ø + t)/2</T>

      <Sep x1={14} y1={204} x2={466} y2={204} />
      <Tag x={20} y={224}>Folded, grain up · doubled ≈ one layer</Tag>
      <Fold {...g} />
      <line x1={g.cx} y1={fg.yT - 8} x2={g.cx} y2={g.cy + g.r + g.tl + 8} stroke={C.emerald} strokeWidth="0.8" strokeDasharray="2 2" />
      <Lb p={[g.cx - 4, fg.yT + 5]} t={[40, 242]} text="½" a="middle" s={11} c={C.emerald} />
      <Lb p={[g.cx - 4, g.cy + g.r + 5]} t={[40, 316]} text="½" a="middle" s={11} c={C.emerald} />
      <T x={g.cx + 4} y={326} s={10.5} c={C.emerald}>½ + ½ ≈ one layer</T>
      <Lb p={[g.cx + g.conv + 50, fg.yB + 3]} t={[300, 300]} text="tail feathered under the body" a="middle" s={10.5} />
      <Dim a={[g.cx + g.body + 6, fg.yT]} b={[g.cx + g.body + 6, fg.yB]} off={-6} text="" />
      <T x={g.cx + g.body + 18} y={fg.yT + 15} s={10.5} mono>1.1</T>
      <Note x={330} y={232} head="Test-fold first" hc={C.text} lines={['fold the flap dry over', 'a bar: the doubled fold', 'should match the body']} s={10.5} lh={14} />
    </Fig>
  )
}

/* Mark the fold on the flesh */
function FoldMark() {
  const T0 = { x: 170, y: 116, s: 3.4 }
  const o = LONG({ x0: -20, x1: 36, tip: 'square' })
  const yb = 268
  const k = 20
  const sp = surf(170, yb, 3.4, k)
  const pr = Array.from({ length: 10 }, (_, i) => 87 + i * 6.4)
  const L = { cx: 404, cy: 222, r: 48 }
  return (
    <Fig h={318} view="Plan & section · flesh side up" scale="plan ×3.4 · section thickness ×20">
      <FinDefs />
      <StrapPlan T={T0} o={o} face="flesh" zones={[{ from: -20, to: 0, k: 'skiveL' }]} />
      <BreakV x={170 + 36 * 3.4} y1={80} y2={152} />
      <line x1={170} y1={76} x2={170} y2={156} stroke={C.text} strokeWidth="0.7" strokeDasharray="2 3" opacity="0.6" />
      {pr.map((y) => (
        <circle key={y} cx={170} cy={y} r="1.3" fill="#3a2612" stroke="#f3e2c4" strokeWidth="0.4" />
      ))}
      <Awl kind="round" x={170} y={100} ang={-16} k={0.7} />
      <Lb p={[156, 52]} t={[120, 50]} text="needle or awl" />
      <Lb p={[112, 98]} t={[94, 78]} text="skived flap" />
      <Lb p={[172, 88]} t={[196, 60]} text="fold line pricked across the flesh" sub="at the pompe position" />
      <Dim a={[102, 150]} b={[170, 150]} off={14} text="" />
      <T x={136} y={182} a="middle" s={10.5}>
        lug flap <tspan fontFamily="var(--font-mono)">20</tspan>
      </T>

      <line x1={170} y1={192} x2={170} y2={yb + 10} stroke={C.brassHi} strokeWidth="0.9" strokeDasharray="3 3" />
      <rect x={90} y={yb} width={210} height={6} rx="1.5" fill="url(#sk-glass)" stroke={C.steel} strokeWidth="0.6" />
      <path d={P(flapPoly({ F: 170, yb, s: 3.4, k, d0: -36, d1: 20 }), true)} fill="url(#skf-topR)" stroke="#4a3018" strokeWidth="0.8" />
      <BreakV x={170 + 36 * 3.4} y1={yb - 26} y2={yb + 4} />
      <path d={`M167 ${sp(0)[1]} l3 3 l3 -3`} fill="none" stroke={C.ruby} strokeWidth="1.2" />
      <Lb p={[176, sp(0)[1] - 1]} t={[200, 222]} text="start of the wrap zone" sub="mark, don’t pierce" />

      <Loupe cx={L.cx} cy={L.cy} r={L.r} src={[170, 145]} sr={6} label="light pricks in the flesh">
        <rect x={L.cx - L.r} y={L.cy - L.r} width={L.r * 2} height={L.r * 2} fill="url(#sk-flesh)" />
        <rect x={L.cx - L.r} y={L.cy - L.r} width={L.r * 2} height={L.r * 2} fill="url(#sk-fibre)" />
        <rect x={L.cx - L.r} y={L.cy - L.r} width={L.r * 1.05} height={L.r * 2} fill="rgba(208,168,79,0.22)" />
        <line x1={L.cx + 2} y1={L.cy - L.r} x2={L.cx + 2} y2={L.cy + L.r} stroke={C.text} strokeWidth="0.8" strokeDasharray="3 4" opacity="0.6" />
        {[-28, 0, 28].map((dy) => (
          <g key={dy}>
            <circle cx={L.cx + 2} cy={L.cy + dy} r="4.5" fill="#3a2612" />
            <circle cx={L.cx + 2} cy={L.cy + dy} r="6.5" fill="none" stroke="#f3e2c4" strokeWidth="0.8" opacity="0.7" />
          </g>
        ))}
      </Loupe>
    </Fig>
  )
}

/* Glue only the tail tip and its landing zone */
function MiniFold({ x, y, glue, glueFrom = 0.75, arrow }) {
  return (
    <g>
      <path d={`M${x + 120} ${y - 5} L${x + 18} ${y - 5} A9 9 0 0 0 ${x + 18} ${y + 13} L${x + 96} ${y + 13}`} fill="none" stroke="url(#sk-topS)" strokeWidth="5" />
      <path d={`M${x + 120} ${y - 5} L${x + 18} ${y - 5} A9 9 0 0 0 ${x + 18} ${y + 13} L${x + 96} ${y + 13}`} fill="none" stroke="#4a3018" strokeWidth="0.5" />
      <BarEnd cx={x + 18} cy={y + 4} r={5.2} />
      {glue && <line x1={x + 18 + 78 * glueFrom} y1={y + 8.5} x2={x + 96} y2={y + 8.5} stroke={C.glue} strokeWidth="2.2" strokeDasharray="1.2 2.6" strokeLinecap="round" />}
      {arrow && <Arrow a={[x + 44, y + 24]} b={[x + 92, y + 24]} w={1.3} />}
    </g>
  )
}
function FoldGlue() {
  const F = 200
  const yb = 104
  const s = 5
  const k = 22
  const sp = surf(F, yb, s, k)
  const g = { cx: 74, cy: 248, r: 14, t: 22, tl: 11, ramp: 36, conv: 38, tail: 96, body: 176 }
  const fg = foldPaths(g)
  const fy = (y) => 2 * g.cy - y
  const gx0 = g.cx + g.conv + g.tail * 0.62
  const gx1 = g.cx + g.conv + g.tail
  const noglue = [...runD(sp, -2, 6, 1), ...runD(sp, 6, -2, 9)]
  return (
    <Fig h={340} view="Section · flesh up, as on the bench" scale="length ×5 · thickness ×22">
      <FinDefs />
      <rect x={60} y={yb} width={392} height={7} rx="1.5" fill="url(#sk-glass)" stroke={C.steel} strokeWidth="0.6" />
      <path d={P(flapPoly({ F, yb, s, k, d0: -48, d1: 20 }), true)} fill="url(#skf-topR)" stroke="#4a3018" strokeWidth="0.8" />
      <BreakV x={F + 48 * s} y1={yb - 32} y2={yb + 4} />
      <line x1={F} y1={58} x2={F} y2={yb + 10} stroke={C.text} strokeWidth="0.9" strokeDasharray="4 3" />
      <GlueRun pts={runD(sp, 14, 20, 1.6)} />
      <GlueRun pts={runD(sp, -14.5, -8.5, 1.6)} />
      <path d={P(noglue, true)} fill="url(#sk-noglue)" stroke={C.ruby} strokeWidth="0.7" strokeDasharray="2 2" />
      <Arrow d={`M${sp(17)[0]} ${sp(17)[1] - 8} C${sp(17)[0] + 10} 30 ${sp(-11.5)[0] - 10} 30 ${sp(-11.5)[0]} ${sp(-11.5)[1] - 8}`} w={1.4} dash="4 3" />
      <T x={186} y={36} a="middle" s={10.5} c={C.brass}>folds over and lands here</T>
      <Lb p={[sp(18)[0], sp(18)[1] - 2]} t={[70, 66]} text="tail tip" sub="glue" c={C.emerald} a="end" />
      <Lb p={[sp(-11.5)[0], sp(-11.5)[1] - 2]} t={[300, 54]} text="landing zone" sub="glue" c={C.emerald} />
      <Lb p={[190, yb - 16]} t={[200, 136]} text="channel: no glue" c={C.ruby} a="middle" />
      <T x={F + 5} y={58} s={10} c={C.faint}>fold</T>

      <Sep x1={14} y1={160} x2={466} y2={160} />
      <Tag x={20} y={180}>Folded (preview)</Tag>
      <Fold {...g} bar={false} flip ym={g.cy}>
        <line x1={gx0} y1={fg.yB + 0.6} x2={gx1} y2={fg.yB + 0.6} stroke={C.glue} strokeWidth="2.6" strokeDasharray="1.2 2.6" strokeLinecap="round" />
        <circle cx={g.cx} cy={g.cy} r={g.r - 2} fill="url(#sk-noglue)" stroke={C.ruby} strokeWidth="0.8" strokeDasharray="2 2" />
      </Fold>
      <Lb p={[(gx0 + gx1) / 2, fy(fg.yB) - 1]} t={[200, 196]} text="tail tip on its landing zone" c={C.emerald} a="middle" s={10.5} />
      <Lb p={[g.cx, g.cy]} t={[80, 306]} text="channel stays bare" sub="the bar or former goes here" c={C.ruby} a="middle" s={10.5} />

      <Sep x1={270} y1={170} x2={270} y2={330} />
      <Tag x={282} y={180}>Or: 3 mm first</Tag>
      <Num x={292} y={204} n={1} r={7} />
      <rect x={306} y={200} width={130} height={6} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.5" />
      <line x1={307} y1={198} x2={320} y2={198} stroke={C.glue} strokeWidth="2.4" strokeDasharray="1.2 2.4" strokeLinecap="round" />
      <T x={324} y={222} s={10.5}>
        glue the first <tspan fontFamily="var(--font-mono)">3</tspan> mm at the tip
      </T>
      <Num x={292} y={248} n={2} r={7} />
      <MiniFold x={300} y={244} />
      <T x={324} y={276} s={10.5}>pass the bar or buckle</T>
      <Num x={292} y={298} n={3} r={7} />
      <MiniFold x={300} y={294} glue glueFrom={0.3} />
      <Arrow a={[350, 314]} b={[420, 314]} w={1.2} />
      <T x={424} y={318} s={10}>glue</T>
      <T x={300} y={332} s={10} c={C.faint}>then the rest, working away from it</T>
    </Fig>
  )
}

/* Insert a former slightly larger than the bar */
function Pencil({ x, y, ang = 0, k = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${k})`}>
      <path d="M0 0 L5 -9 L-5 -9 Z" fill="#e4c49a" stroke="#6f5a35" strokeWidth="0.5" />
      <path d="M0 0 L1.8 -3.2 L-1.8 -3.2 Z" fill="#3c3f43" />
      <rect x="-5" y="-80" width="10" height="71" fill="#d9a83a" stroke="#6f5a35" strokeWidth="0.6" />
      <line x1="-1.6" y1="-80" x2="-1.6" y2="-9" stroke="#b8892a" strokeWidth="0.6" />
      <line x1="1.6" y1="-80" x2="1.6" y2="-9" stroke="#b8892a" strokeWidth="0.6" />
      <rect x="-5" y="-86" width="10" height="6" fill="#c7c9cc" />
    </g>
  )
}
function FoldFormer() {
  const F = 196
  const yb = 160
  const t = 22
  const tl = 11
  const rf = 17
  const ramp = 40
  const C0 = [F, yb - tl - rf]
  const th = (210 * Math.PI) / 180
  const I1 = [C0[0] + rf * Math.cos(th), C0[1] + rf * Math.sin(th)]
  const O1 = [C0[0] + (rf + tl) * Math.cos(th), C0[1] + (rf + tl) * Math.sin(th)]
  const u = [-Math.sin(th), Math.cos(th)]
  const no = [Math.cos(th), Math.sin(th)]
  const Lt = 84
  const tip = [I1[0] + u[0] * Lt, I1[1] + u[1] * Lt]
  const tipO = [tip[0] + no[0] * 0.8, tip[1] + no[1] * 0.8]
  const right = 452
  const d =
    `M${right} ${yb} L${right} ${yb - t} L${F + ramp} ${yb - t} L${F} ${yb - tl} ` +
    `A${rf} ${rf} 0 0 1 ${f1(I1[0])} ${f1(I1[1])} L${f1(tip[0])} ${f1(tip[1])} L${f1(tipO[0])} ${f1(tipO[1])} L${f1(O1[0])} ${f1(O1[1])} ` +
    `A${rf + tl} ${rf + tl} 0 0 0 ${F} ${yb} Z`
  const glueTail = [0.62, 1].map((f) => [I1[0] + u[0] * Lt * f - no[0] * 1.8, I1[1] + u[1] * Lt * f - no[1] * 1.8])
  const ga = [C0[0] + (rf + 1.2) * Math.cos(Math.PI / 2), C0[1] + (rf + 1.2) * Math.sin(Math.PI / 2)]
  const gb = [C0[0] + (rf + 1.2) * Math.cos(th), C0[1] + (rf + 1.2) * Math.sin(th)]
  return (
    <Fig h={330} view="Section · flesh up" scale="schematic">
      <FinDefs />
      <rect x={60} y={yb} width={392} height={7} rx="1.5" fill="url(#sk-glass)" stroke={C.steel} strokeWidth="0.6" />
      <path d={d} fill="url(#skf-topR)" stroke="#4a3018" strokeWidth="0.8" strokeLinejoin="round" />
      <BreakV x={right} y1={yb - t - 4} y2={yb + 4} />
      <path d={`M${f1(ga[0])} ${f1(ga[1])} A${rf + 1.2} ${rf + 1.2} 0 0 1 ${f1(gb[0])} ${f1(gb[1])}`} fill="none" stroke="#6f7378" strokeWidth="2.4" />
      <circle cx={C0[0]} cy={C0[1]} r={rf - 0.6} fill="url(#sk-barEnd)" stroke="#2d3940" strokeWidth="0.8" />
      <circle cx={C0[0]} cy={C0[1]} r={rf * 0.8} fill="none" stroke="#2d3940" strokeWidth="0.9" strokeDasharray="2 2" />
      <path d={P(glueTail)} fill="none" stroke={C.glue} strokeWidth="2.4" strokeDasharray="1.2 2.6" strokeLinecap="round" />
      <line x1={F + 52} y1={yb - t - 1.6} x2={F + 88} y2={yb - t - 1.6} stroke={C.glue} strokeWidth="2.4" strokeDasharray="1.2 2.6" strokeLinecap="round" />
      <Arrow d={`M${f1(tip[0] + 10)} ${f1(tip[1] - 2)} Q${F + 110} ${f1(tip[1] - 6)} ${F + 92} ${yb - t - 10}`} w={1.5} />
      <T x={F + 116} y={70} s={10.5} c={C.brass}>fold over next</T>
      <Lb p={[C0[0] + 6, C0[1] - 8]} t={[146, 46]} text="former: a metal rod" sub="makers call it critical" />
      <Lb p={[F + 70, yb - t - 2]} t={[320, 120]} text="landing zone, glued" c={C.emerald} s={10.5} />
      <Lb p={[glueTail[1][0] - 2, glueTail[1][1] + 2]} t={[260, 40]} text="tail tip, glued" c={C.emerald} s={10.5} />
      <Lb p={[C0[0] - rf * 0.85, C0[1] + rf * 0.55]} t={[110, 182]} text="graphite in the channel" sub="nothing can stick" a="middle" />

      <Sep x1={14} y1={210} x2={466} y2={210} />
      <Tag x={20} y={230}>End-on</Tag>
      <circle cx={92} cy={272} r={34} fill="url(#sk-barEnd)" stroke="#2d3940" strokeWidth="0.9" />
      <circle cx={92} cy={272} r={27} fill="none" stroke="#2d3940" strokeWidth="1" strokeDasharray="3 2" />
      <Lb p={[118, 252]} t={[150, 246]} text="former" />
      <Lb p={[100, 296]} t={[150, 300]} text="bar Ø (dashed)" />
      <T x={150} y={318} s={10} c={C.faint}>larger: the bar slides in</T>

      <Tag x={300} y={230}>Graphite, flesh side</Tag>
      <rect x={300} y={248} width={160} height={52} fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="0.8" />
      <rect x={300} y={248} width={160} height={52} fill="url(#sk-fibre)" />
      <rect x={350} y={248} width={22} height={52} fill="rgba(80,84,90,0.5)" />
      <line x1={361} y1={244} x2={361} y2={304} stroke={C.text} strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
      <Pencil x={362} y={286} ang={34} k={0.62} />
      <T x={300} y={318} s={10} c={C.faint}>pencil run down the fold zone</T>
    </Fig>
  )
}

/* Fold over the former, bone-fold, crease, clamp */
function FoldSet() {
  const g1 = { cx: 66, cy: 130, r: 16.5, t: 22, tl: 11, ramp: 40, conv: 43, tail: 88, body: 162 }
  const g2 = { ...g1, cx: 296 }
  const f1g = foldPaths(g1)
  const fy = (y) => 2 * g1.cy - y
  const okG = { cx: 72, cy: 276, r: 13, t: 18, tl: 9, ramp: 32, conv: 34, tail: 70, body: 140 }
  const noG = { cx: 302, cy: 276, r: 17, t: 18, tl: 9, ramp: 40, conv: 50, tail: 60, body: 140 }
  const stackTop = fy(f1g.yB) - f1g.tt
  return (
    <Fig h={336} view="Section · flesh up, then as worn" scale="schematic">
      <Num x={28} y={42} n={1} />
      <T x={42} y={46} s={12} c={C.text} w="600">Bone-fold</T>
      <Fold {...g1} former barDash flip ym={g1.cy} />
      <BoneFolder x={g1.cx + 14} y={fy(g1.cy + g1.r + g1.tl) + 1} ang={34} k={0.62} />
      <Arrow d={`M${g1.cx - 26} ${fy(g1.cy) - 30} q12 -12 30 -8`} w={1.3} both />
      <Lb p={[g1.cx + 40, 66]} t={[140, 40]} text="bone folder" s={10.5} />
      <Lb p={[g1.cx - g1.r - g1.tl, g1.cy]} t={[40, 186]} text="until the former’s shape shows" a="start" s={10.5} />

      <Sep x1={240} y1={28} x2={240} y2={200} />
      <Num x={258} y={42} n={2} />
      <T x={272} y={46} s={12} c={C.text} w="600">Crease & clamp</T>
      <Fold {...g2} former barDash flip ym={g2.cy} />
      <Pliers x={g2.cx + g2.r + g2.tl + 12} y={(stackTop + fy(f1g.yT)) / 2} open={fy(f1g.yT) - stackTop + 2} k={0.62} />
      <g>
        <rect x={426} y={stackTop - 13} width={14} height={11} rx="2" fill="#4b5157" />
        <rect x={426} y={fy(f1g.yT) + 2} width={14} height={11} rx="2" fill="#4b5157" />
        <line x1={433} y1={stackTop - 19} x2={433} y2={fy(f1g.yT) + 19} stroke="#9fb0bc" strokeWidth="2.4" />
      </g>
      <Lb p={[g2.cx + 46, stackTop - 10]} t={[316, 76]} text="leather-tipped pliers" sub="crease behind the former" s={10.5} />
      <Lb p={[433, fy(f1g.yT) + 14]} t={[440, 186]} text="clamp until set" a="end" s={10.5} />

      <Sep x1={14} y1={204} x2={466} y2={204} />
      <Tag x={20} y={222}>The result, grain up</Tag>
      <Fold {...okG} />
      <Verdict x={214} y={236} ok />
      <T x={20} y={326} s={10.5} c={C.emerald}>tight: hugs the bar, crisp crease</T>
      <Fold {...noG} bar={false} />
      <BarEnd cx={noG.cx + 2} cy={noG.cy + 4} r={11.5} />
      <Verdict x={448} y={236} ok={false} />
      <T x={256} y={326} s={10.5} c={C.ruby}>loose: soft, round, the bar rattles</T>
    </Fig>
  )
}

/* Stitch the tail in along the sides */
function FoldStitch() {
  const T0 = { x: 90, y: 86, s: 3.2 }
  const o = LONG({ x1: 50, tip: 'square' })
  const g = { cx: 90, cy: 244, r: 12, t: 20, tl: 10, ramp: 30, conv: 32, tail: 52, body: 340 }
  const fg = foldPaths(g)
  const L = 13
  const linTop = (x) => fg.yB + fg.tailAt(x)
  const la = g.cx + g.conv + 2
  const lb = g.cx + g.body
  const lin = []
  for (let i = 0; i <= 40; i++) {
    const x = la + ((lb - la) * i) / 40
    lin.push([x, linTop(x)])
  }
  for (let i = 40; i >= 0; i--) {
    const x = la + ((lb - la) * i) / 40
    lin.push([x, linTop(x) + Math.min(L, L * (0.3 + (0.7 * (x - la)) / 24))])
  }
  const st = Array.from({ length: 12 }, (_, i) => g.cx + 22 + i * 13)
  return (
    <Fig h={330} view="Plan + section along the seam" scale="schematic">
      <StrapPlan T={T0} o={o} stitch={{ m: 3, p: 3, from: 6, to: 44 }} />
      <SpringBar x={90} y1={48} y2={124} r={2.6} />
      <BreakV x={90 + 50 * 3.2} y1={50} y2={122} />
      <path d={`M90 ${86 - 28} L${90 + 16 * 3.2} ${86 - 28} L${90 + 16 * 3.2} ${86 + 28} L90 ${86 + 28}`} fill="rgba(208,168,79,0.12)" stroke="#e0b277" strokeWidth="1" strokeDasharray="4 3" />
      <Lb p={[90 + 12 * 3.2, 86 + 22]} t={[150, 156]} text="tail, hidden under the top" a="middle" s={10.5} />
      <Lb p={[90 + 30 * 3.2, 86 - 28]} t={[290, 44]} text="side seams through the tail" />
      <Lb p={[90, 48]} t={[60, 40]} text="bar" s={10.5} />

      <Sep x1={14} y1={176} x2={466} y2={176} />
      <Tag x={20} y={194}>Section along the seam</Tag>
      <rect x={g.cx - g.r - g.tl - 16} y={198} width={7} height={80} rx="2" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" />
      <T x={g.cx - g.r - g.tl - 20} y={244} a="end" s={10} c={C.faint}>case</T>
      <polygon points={lin.map((p) => p.map(f1).join(',')).join(' ')} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.8" />
      <Fold {...g} />
      <BreakV x={g.cx + g.body} y1={fg.yT - 4} y2={fg.yB + L + 4} />
      <g stroke={C.thread} strokeLinecap="round">
        {st.map((x) => (
          <line key={x} x1={x} y1={fg.yT - 1.5} x2={x} y2={linTop(x) + Math.min(L, L * (0.3 + (0.7 * (x - la)) / 24)) + 1.5} strokeWidth="1.4" />
        ))}
        {st.slice(0, -1).map((x) => (
          <line key={'t' + x} x1={x} y1={fg.yT - 1.5} x2={x + 13} y2={fg.yT - 1.5} strokeWidth="1.8" opacity="0.6" />
        ))}
      </g>
      <Dim a={[g.cx + 8, fg.yT]} b={[g.cx + 8, fg.yT + g.tl]} off={0} text="" />
      <Lb p={[g.cx + 22 + 13 * 8, fg.yT - 1.5]} t={[226, 202]} text="stitches through body, tail and lining" a="start" s={10.5} />
      <Lb p={[g.cx - g.r - g.tl + 1, g.cy - 6]} t={[44, 312]} text="the face that bears on the case:" sub="leave it full, no stitching through it" a="start" s={10.5} />
      <Lb p={[g.cx + g.conv + 30, fg.yB + 4]} t={[300, 300]} text="tail locked between top and lining" a="middle" s={10.5} />
    </Fig>
  )
}

/* Check alignment: bar square within 0.5 mm, both sides lock */
function AlignPanel({ x, ok }) {
  const top = 70
  const bot = 170
  const bx = x + 46
  const sk = ok ? 0.8 : 7
  return (
    <g>
      <rect x={bx - 6} y={top} width={150} height={bot - top} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <BreakV x={bx + 144} y1={top - 4} y2={bot + 4} />
      <line x1={bx - 12} y1={(top + bot) / 2} x2={bx + 150} y2={(top + bot) / 2} stroke={C.steel} strokeWidth="0.8" strokeDasharray="10 3 2 3" />
      <line x1={bx} y1={top - 18} x2={bx} y2={bot + 18} stroke={C.brassHi} strokeWidth="1" strokeDasharray="4 3" />
      <g transform={`rotate(${ok ? 0.5 : 4} ${bx} ${(top + bot) / 2})`}>
        <rect x={bx - 3} y={top - 10} width={6} height={bot - top + 20} rx="3" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" />
      </g>
      {[top, bot].map((y, i) => (
        <ellipse key={y} cx={bx + (i ? sk : -sk)} cy={y} rx="4.2" ry="2" fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />
      ))}
    </g>
  )
}
function LugLock({ x, ok }) {
  const y0 = 252
  const gap = 52
  const bx = x + 40
  return (
    <g>
      <rect x={x} y={y0 - 12} width={110} height={12} rx="4" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.7" />
      <rect x={x} y={y0 + gap} width={110} height={12} rx="4" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.7" />
      <circle cx={bx} cy={y0 - 5} r="3.4" fill={C.ground} stroke="#3b4850" strokeWidth="0.7" />
      <circle cx={bx} cy={y0 + gap + 5} r="3.4" fill={C.ground} stroke="#3b4850" strokeWidth="0.7" />
      <rect x={bx - 4} y={y0 + 2} width={70} height={gap - 4} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.7" />
      <g transform={`rotate(${ok ? 0 : 6} ${bx} ${y0 + gap / 2})`}>
        <rect x={bx - 2.6} y={y0 - 6} width={5.2} height={gap + 12} rx="2.6" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" />
      </g>
      {!ok && <circle cx={bx + 3.4} cy={y0 - 5} r="7" fill="none" stroke={C.ruby} strokeWidth="1.3" />}
    </g>
  )
}
function FoldAlign() {
  return (
    <Fig h={334} view="Plan · lug end, bar fitted" scale="offsets exaggerated">
      <Panel x={14} y={28} w={222} h={180} title="Square" ok />
      <AlignPanel x={14} ok />
      <T x={66} y={54} s={10} c={C.brass}>square to the centreline</T>
      <T x={30} y={196} s={10.5} c={C.emerald}>holes within 0.5 mm: bar runs true</T>
      <Panel x={244} y={28} w={222} h={180} title="Crooked" ok={false} />
      <AlignPanel x={244} />
      <Lb p={[283, 70]} t={[316, 52]} text="> 0.5 out of line" c={C.ruby} s={10.5} />
      <T x={260} y={196} s={10.5} c={C.ruby}>bar skews; one side won’t lock</T>

      <Tag x={20} y={232}>Fitted between the lugs</Tag>
      <LugLock x={40} ok />
      <T x={40} y={330} s={10.5} c={C.emerald}>both sides lock</T>
      <LugLock x={280} />
      <T x={280} y={330} s={10.5} c={C.ruby}>one pin misses its hole</T>
      <Verdict x={168} y={276} ok />
      <Verdict x={408} y={276} ok={false} />
    </Fig>
  )
}

/* No finish on the lug fold */
function NoFinishPanel({ x, ok }) {
  const g = { cx: x + 56, cy: 106, r: 13, t: 20, tl: 10, ramp: 30, conv: 34, tail: 50, body: 150 }
  const T0 = { x: x + 40, y: 238, s: 2.8 }
  const o = LONG({ x1: 56, tip: 'square' })
  const edge = (side, from) => Array.from({ length: 20 }, (_, i) => {
    const xx = from + ((56 - from) * i) / 19
    return px(T0, xx, (side * widthAt(xx, o)) / 2)
  })
  return (
    <g>
      <Fold {...g} paint={ok ? g.conv + 6 : undefined} spine={ok ? undefined : C.paint} />
      {!ok && <path d={`M${g.cx} ${g.cy - g.r - g.tl} L${g.cx + g.body} ${g.cy - g.r - g.tl} L${g.cx + g.body} ${g.cy - g.r - g.tl + g.t} L${g.cx} ${g.cy - g.r - g.tl + g.t}`} fill={C.paint} opacity="0.92" />}
      {!ok &&
        [-50, -10, 30, 62].map((a) => {
          const rad = (Math.PI * (180 + a)) / 180
          const R1 = g.r + g.tl + 5
          const R2 = g.r + g.tl - 3
          return <line key={a} x1={g.cx + R1 * Math.cos(rad)} y1={g.cy + R1 * Math.sin(rad)} x2={g.cx + R2 * Math.cos(rad)} y2={g.cy + R2 * Math.sin(rad)} stroke={C.ruby} strokeWidth="1.5" />
        })}
      <BreakV x={g.cx + g.body} y1={g.cy - g.r - g.tl - 4} y2={g.cy - g.r - g.tl + g.t + 4} />
      <StrapPlan T={T0} o={o} />
      <BreakV x={x + 40 + 56 * 2.8} y1={206} y2={270} />
      <path d={P(edge(-1, ok ? 9 : 0))} fill="none" stroke={C.paint} strokeWidth="4" strokeLinecap="round" />
      <path d={P(edge(1, ok ? 9 : 0))} fill="none" stroke={C.paint} strokeWidth="4" strokeLinecap="round" />
      {!ok && <line x1={x + 40} y1={210} x2={x + 40} y2={266} stroke={C.paint} strokeWidth="4" strokeLinecap="round" />}
      {[-1, 1].map((sd) => (
        <circle key={sd} cx={x + 42} cy={238 + sd * 28} r="7" fill="none" stroke={ok ? C.emerald : C.ruby} strokeWidth="1.4" />
      ))}
      {!ok && <path d={`M${x + 30} ${206} l-6 -3 l-2 5 l5 2 Z M${x + 31} ${272} l-6 3 l1 4 l6 -2 Z`} fill={C.paint} />}
    </g>
  )
}
function FoldNoFinish() {
  return (
    <Fig h={318} view="Side view + plan · lug end" scale="schematic">
      <Panel x={14} y={28} w={222} h={282} title="Bare fold" ok />
      <NoFinishPanel x={14} ok />
      <T x={28} y={160} s={10.5} c={C.emerald}>edge finish stops at the fold</T>
      <T x={28} y={176} s={10.5}>spine and horns left bare</T>
      <T x={28} y={300} s={10.5} c={C.emerald}>horns bare: nothing to rub off</T>
      <Panel x={244} y={28} w={222} h={282} title="Finished fold" ok={false} />
      <NoFinishPanel x={244} />
      <T x={258} y={160} s={10.5} c={C.ruby}>paint or burnish on the spine</T>
      <T x={258} y={176} s={10.5}>cracks as the fold flexes</T>
      <T x={258} y={300} s={10.5} c={C.ruby}>horns rub off on the lugs</T>
    </Fig>
  )
}

/* QR: locate the knob */
function FoldKnob() {
  const g = { cx: 112, cy: 128, r: 18, t: 24, tl: 12, ramp: 44, conv: 48, tail: 72, body: 112 }
  const fg = foldPaths(g)
  const kx = g.cx + 7
  const ky = g.cy + g.r
  const T0 = { x: 292, y: 244, s: 4.2 }
  const o = LONG({ x1: 38, tip: 'square' })
  return (
    <Fig h={330} view="Section + plan of the underside" scale="schematic">
      <Tag x={20} y={42}>Section, as worn</Tag>
      <Fold {...g} />
      <BreakV x={g.cx + g.body} y1={fg.yT - 4} y2={fg.yB + 4} />
      <line x1={g.cx + 3} y1={g.cy + 5} x2={kx} y2={ky - 0.5} stroke="url(#sk-steelH)" strokeWidth="5" strokeLinecap="round" />
      <line x1={g.cx + 3} y1={g.cy + 5} x2={kx} y2={ky - 0.5} stroke="#3b4850" strokeWidth="0.6" />
      <path d={`M${kx - 4} ${ky + g.tl + 4} l8 8 M${kx + 4} ${ky + g.tl + 4} l-8 8`} stroke={C.ruby} strokeWidth="1.6" />
      <Awl kind="round" x={kx + 14} y={ky + g.tl + 9} ang={150} k={0.55} />
      <Lb p={[g.cx - 8, g.cy - 6]} t={[70, 62]} text="QR bar in the loop" a="middle" s={10.5} />
      <Lb p={[kx + 1, ky - 3]} t={[210, 70]} text="knob presses on the" sub="underside of the loop" s={10.5} />
      <Lb p={[kx - 6, ky + g.tl + 10]} t={[60, 214]} text="mark it on the outside" c={C.ruby} a="middle" s={10.5} />

      <Sep x1={250} y1={30} x2={250} y2={318} />
      <Tag x={262} y={42}>The bar</Tag>
      <g transform="rotate(90 360 84)">
        <SpringBar x={360} y1={40} y2={128} r={3.4} qr />
      </g>
      <Lb p={[340, 92]} t={[330, 128]} text="knob: it slides along the bar" a="middle" s={10.5} />
      <Tag x={262} y={168}>Plan · underside</Tag>
      <StrapPlan T={T0} o={o} face="lining" />
      <BreakV x={292 + 38 * 4.2} y1={196} y2={292} />
      <rect x={288} y={198} width={8} height={92} rx="4" fill="none" stroke={C.steel} strokeWidth="1" strokeDasharray="3 2" />
      <rect x={296} y={216} width={9} height={7} rx="2" fill="none" stroke={C.steel} strokeWidth="1" strokeDasharray="2 1.5" />
      <path d="M298 214 l9 9 M307 214 l-9 9" stroke={C.ruby} strokeWidth="1.6" />
      <Lb p={[307, 219]} t={[350, 190]} text="knob position marked" c={C.ruby} s={10.5} />
      <Lb p={[292, 280]} t={[330, 310]} text="bar inside the loop (hidden)" c={C.steel} s={10.5} />
    </Fig>
  )
}

/* QR: cut the 1 × 5 mm notch */
function FoldNotch() {
  const T0 = { x: 62, y: 128, s: 5.4 }
  const o = LONG({ x1: 30, tip: 'square' })
  const nx = 62 + 2.6 * 5.4
  const ny = 128 - 10 * 5.4 + 0.22 * 20 * 5.4
  const nl = 5 * 5.4
  const nw = 1 * 5.4
  const g = { cx: 312, cy: 252, r: 15, t: 22, tl: 11, ramp: 38, conv: 40, tail: 60, body: 140 }
  const fg = foldPaths(g)
  return (
    <Fig h={334} view="Plan of the underside + section" scale="plan ×5.4">
      <StrapPlan T={T0} o={o} face="lining" />
      <BreakV x={62 + 30 * 5.4} y1={66} y2={190} />
      <rect x={59} y={66} width={6} height={124} rx="3" fill="none" stroke={C.steel} strokeWidth="1" strokeDasharray="3 2" />
      <rect x={nx - nw / 2} y={ny} width={nw} height={nl} rx={nw / 2} fill={C.hole} stroke="#e7c48f" strokeWidth="0.7" />
      <rect x={nx - 1.6} y={ny + 6} width={3.2} height={6} rx="1.4" fill="url(#sk-steelH)" />
      <Dim a={[nx + nw / 2 + 2, ny]} b={[nx + nw / 2 + 2, ny + nl]} off={-10} text="" />
      <T x={nx + 20} y={ny + nl / 2 + 4} s={11} mono c={C.text}>5</T>
      <Dim a={[nx - nw / 2, ny - 4]} b={[nx + nw / 2, ny - 4]} off={0} text="" />
      <T x={nx} y={ny - 10} a="middle" s={11} mono c={C.text}>1</T>
      <Lb p={[nx + 1, ny + 9]} t={[150, 54]} text="knob shows through" s={10.5} />
      <T x={62} y={210} s={10.5}>
        notch ≈ <tspan fontFamily="var(--font-mono)">1 × 5</tspan> mm, along the bar
      </T>
      <T x={62} y={226} s={10} c={C.faint}>underside layer only; seal the cut edges</T>

      <Tag x={262} y={42}>The tool</Tag>
      <rect x={262} y={74} width={64} height={52} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="0.8" />
      <NotchPlier x={288} y={100} k={0.6} />
      <Lb p={[330, 92]} t={[362, 62]} text="Bergeon 31227" sub="or a notch plier" s={10.5} />
      <Lb p={[288, 108]} t={[362, 138]} text="counter screw" sub="locks the strap" s={10.5} />

      <Sep x1={240} y1={170} x2={466} y2={170} />
      <Tag x={262} y={190}>Section at the notch</Tag>
      <Fold {...g} />
      <BreakV x={g.cx + g.body} y1={fg.yT - 4} y2={fg.yB + 4} />
      <rect x={g.cx + 2} y={g.cy + g.r - 1} width={7} height={g.tl + 2} fill={C.ground} />
      <path d={`M${g.cx + 2} ${g.cy + g.r} v${g.tl} M${g.cx + 9} ${g.cy + g.r} v${g.tl}`} stroke={C.paint} strokeWidth="1.6" />
      <line x1={g.cx + 3} y1={g.cy + 5} x2={g.cx + 5.5} y2={g.cy + g.r + g.tl + 3} stroke="url(#sk-steelH)" strokeWidth="4" strokeLinecap="round" />
      <Lb p={[g.cx + 6, g.cy + g.r + g.tl + 3]} t={[396, 312]} text="knob through the notch" a="middle" s={10.5} />
      
      <Sep x1={14} y1={240} x2={232} y2={240} />
      <Tag x={20} y={256}>Or: two holes + a cut</Tag>
      <rect x={40} y={272} width={150} height={30} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="0.8" />
      <circle cx={86} cy={287} r={2.7} fill={C.hole} />
      <circle cx={113} cy={287} r={2.7} fill={C.hole} />
      <path d="M86 284.3 L113 284.3 M86 289.7 L113 289.7" stroke={C.hole} strokeWidth="1.2" />
      <Punch x={113} y={285} k={0.3} d={6} />
      <T x={40} y={320} s={10.5}>punch each end, cut between; seal it</T>
    </Fig>
  )
}

/* ================================================================== */
/* DYE, SEAL & CONDITION                                               */
/* ================================================================== */
function Jar({ x, y, label, c = '#6e4422', w = 24, h = 34, level = 0.55, sub }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - h} width={w} height={h} rx="4" fill="rgba(255,255,255,0.05)" stroke={C.struct} strokeWidth="1" />
      {level > 0 && <rect x={x - w / 2 + 2} y={y - h * level} width={w - 4} height={h * level - 2} rx="2" fill={c} opacity="0.85" />}
      <rect x={x - 5} y={y - h - 7} width={10} height={7} rx="1.5" fill="#3a3f44" stroke={C.struct} strokeWidth="0.8" />
      {label && (
        <T x={x} y={y + 14} a="middle" s={10}>
          {label}
        </T>
      )}
      {sub && (
        <T x={x} y={y + 27} a="middle" s={10} c={C.faint}>
          {sub}
        </T>
      )}
    </g>
  )
}
// a plan piece clipped for overlays (dye passes, haze …)
function PlanClip({ T: T0, o, children }) {
  const id = uid()
  return (
    <g>
      <clipPath id={`pc${id}`}>
        <path d={pathOf(outline(o), T0)} />
      </clipPath>
      <g clipPath={`url(#pc${id})`}>{children}</g>
    </g>
  )
}
const Sponge = ({ x, y, w = 40, h = 18 }) => (
  <g>
    <rect x={x - w / 2} y={y - h} width={w} height={h} rx="5" fill="#e3cf76" stroke="#9c8240" strokeWidth="0.9" />
    {[0.2, 0.45, 0.7, 0.32, 0.58, 0.82].map((f, i) => (
      <circle key={i} cx={x - w / 2 + w * f} cy={y - h * (i < 3 ? 0.65 : 0.32)} r="1.5" fill="#b89c4a" />
    ))}
  </g>
)

/* Dye the top flat: even overlapping passes; caution */
function Dye() {
  const T0 = { x: 84, y: 92, s: 2.5 }
  const o = LONG({ x0: -20 })
  const TLn = { x: 84, y: 156, s: 2.5 }
  const band = (y0, y1, x1, i) => {
    const [a, b] = px(T0, -22, y0)
    const [c2, d2] = px(T0, x1, y1)
    return <rect key={i} x={a} y={b} width={c2 - a} height={d2 - b} fill="rgba(74,40,16,0.4)" />
  }
  const dx = 84 + 70 * 2.5
  const dy = 92 + 2.5 * 2.5
  return (
    <Fig h={340} view="Plan · the top piece, flat" scale="20 → 18 mm">
      <StrapPlan T={T0} o={o} />
      <PlanClip T={T0} o={o}>
        {band(-11, -3, 130, 1)}
        {band(-5.5, 2.5, 130, 2)}
        {band(0, 8, 70, 3)}
      </PlanClip>
      {[[-7, 1], [-1.5, 2], [4, 3]].map(([yy, n]) => (
        <Num key={n} x={22} y={92 + yy * 2.5} n={n} r={6.5} />
      ))}
      <Dauber x={dx} y={dy} ang={-28} k={0.95} />
      <Arrow a={[dx + 12, dy + 16]} b={[dx + 60, dy + 16]} w={1.5} />
      <Lb p={[dx - 19, dy - 35]} t={[300, 40]} text="dauber, only a little dye on it" s={10.5} />
      <Lb p={[150, 92 - 4.2 * 2.5]} t={[120, 40]} text="overlapping passes, wet edge to wet edge" a="middle" s={10.5} />
      <Lb p={[350, 92 + 6 * 2.5]} t={[398, 128]} text="still natural" s={10.5} c={C.faint} />

      <StrapPlan T={TLn} o={LONG({ tip: 'round' })} face="lining" />
      <Lb p={[200, 156]} t={[200, 196]} text="lining: left undyed" a="middle" s={10.5} />

      <Sep x1={14} y1={210} x2={466} y2={210} />
      <Num x={28} y={234} n="a" r={7} />
      <T x={42} y={238} s={11} c={C.text}>light oil first</T>
      <Jar x={60} y={290} c="#c8a24a" label="oil" />
      <T x={42} y={318} s={10} c={C.faint}>evens the take-up</T>
      <Num x={128} y={234} n="b" r={7} />
      <T x={142} y={238} s={11} c={C.text}>dye 1 : 1 with thinner</T>
      <Jar x={150} y={290} label="dye" />
      <T x={174} y={278} a="middle" s={12} c={C.text}>+</T>
      <Jar x={198} y={290} c="#a9c2cc" label="thinner" />
      <Arrow a={[216, 274]} b={[232, 274]} w={1.2} />
      <Jar x={252} y={290} c="#8a5a30" label="1 : 1" level={0.7} />
      <T x={142} y={330} s={10} c={C.faint}>goes on more evenly</T>

      <rect x={286} y={222} width={180} height={108} rx="8" fill="rgba(194,88,99,0.08)" stroke={C.ruby} strokeWidth="1" />
      <T x={298} y={242} s={11.5} c={C.ruby} w="600">Caution</T>
      <Note x={298} y={260} lines={['chemical-resistant gloves', 'a little dye on the dauber', 'bottle recapped first', 'ventilation']} s={10.5} lh={14} />
      <T x={298} y={322} s={10} c={C.emerald}>lowest hazard: tannery-dyed leather</T>
    </Fig>
  )
}

/* Buff until the cloth comes away clean */
function Buff() {
  const T0 = { x: 76, y: 92, s: 2.5 }
  const o = LONG({ x0: -20 })
  const R = rng(17)
  const haze = Array.from({ length: 70 }, () => [76 + (80 + R() * 60) * 2.5, 92 + (R() - 0.5) * 19 * 2.5])
  const cx = 76 + 70 * 2.5
  return (
    <Fig h={312} view="Plan + the cloth, pass by pass" scale="20 → 18 mm">
      <StrapPlan T={T0} o={o} />
      <PlanClip T={T0} o={o}>
        <rect x={0} y={0} width={480} height={200} fill="rgba(70,38,15,0.55)" />
        <rect x={0} y={74} width={cx - 10} height={3} fill="rgba(255,244,216,0.22)" />
        {haze.map(([x, y], i) => (
          <circle key={i} cx={f1(x)} cy={f1(y)} r="1.1" fill="rgba(40,18,6,0.75)" />
        ))}
      </PlanClip>
      <Cloth x={cx - 26} y={64} w={52} h={40} />
      <Arrow d={`M${cx - 30} 118 a30 12 0 1 0 30 -2`} w={1.4} />
      <Lb p={[cx, 70]} t={[cx - 10, 40]} text="white cloth, small circles" a="middle" s={10.5} />
      <Lb p={[300, 98]} t={[350, 136]} text="loose dye still on the surface" s={10.5} c={C.faint} a="middle" />
      <Lb p={[110, 84]} t={[90, 136]} text="buffed: even, nothing loose" s={10.5} a="middle" />

      <Sep x1={14} y1={156} x2={466} y2={156} />
      <Tag x={20} y={176}>The cloth, pass by pass</Tag>
      {[
        [1, 0.9, '1st pass', 'colour comes off'],
        [0.45, 0.45, '2nd pass', 'less'],
        [0, 0, 'clean', 'move on to sealing'],
      ].map(([sm, , a, b], i) => (
        <g key={a}>
          <Cloth x={40 + i * 150} y={190} w={78} h={56} smudge={sm} seed={i + 5} />
          <T x={79 + i * 150} y={266} a="middle" s={11} c={C.text}>
            {a}
          </T>
          <T x={79 + i * 150} y={280} a="middle" s={10} c={C.faint}>
            {b}
          </T>
          {i < 2 && <Arrow a={[126 + i * 150, 218]} b={[180 + i * 150, 218]} w={1.3} />}
        </g>
      ))}
      <Verdict x={354} y={200} ok />
      <T x={240} y={302} a="middle" s={10.5} c={C.brass}>Conditioners are not sealers: loose dye has to come off now.</T>
    </Fig>
  )
}

/* Seal: Resolene 1:1, 2–3 light coats, edges too */
function SealStrap() {
  const x1 = 40
  const w = 200
  const y = 92
  const ht = 20
  const hl = 13
  const h = ht + hl
  const id = uid()
  const coat = (o, i) => (
    <rect key={i} x={x1 - o} y={y - o} width={w + 2 * o} height={h + 2 * o} rx={h / 2 + o} fill="none" stroke="rgba(170,215,230,0.75)" strokeWidth="1.6" />
  )
  const eg = edgeGeom({ x: 200, y: 0, s: 30, b: 0.5, r: 3 })
  const q = at(eg, 0.2)
  const sealCoats = [0, 1, 2].map(() => ({ t: 0.05, c: 'rgba(160,205,220,0.42)', line: 'rgba(190,228,240,0.9)' }))
  return (
    <Fig h={330} view="Section across the strap" scale="thickness ×18 · coats exaggerated">
      <clipPath id={`sx${id}`}>
        <rect x={x1} y={y} width={w} height={h} rx={h / 2} />
      </clipPath>
      <g clipPath={`url(#sx${id})`}>
        <rect x={x1} y={y} width={w} height={ht} fill="url(#sk-topS)" />
        <rect x={x1} y={y + ht} width={w} height={hl} fill="url(#sk-linS)" />
        <rect x={x1} y={y} width={w} height={2.5} fill="rgba(60,32,12,0.6)" />
        <line x1={x1} y1={y + ht} x2={x1 + w} y2={y + ht} stroke="#8f7b5a" strokeWidth="0.8" />
      </g>
      <clipPath id={`sc${id}`}>
        <rect x={x1 - 12} y={y - 12} width={w + 24} height={h / 2 + 18} />
        <rect x={x1 - 12} y={y} width={h / 2 + 4} height={h + 12} />
        <rect x={x1 + w - h / 2 + 8} y={y} width={h / 2 + 4} height={h + 12} />
      </clipPath>
      <g clipPath={`url(#sc${id})`}>{[2, 4.5, 7].map(coat)}</g>
      <Sponge x={150} y={y - 12} />
      <Arrow a={[118, y - 40]} b={[184, y - 40]} both w={1.3} />
      <Lb p={[176, y - 22]} t={[226, 44]} text="damp sponge, light coats" s={10.5} />
      <Lb p={[x1 + w + 6, y + 10]} t={[270, 124]} text="edges sealed too" s={10.5} c={C.steel} a="start" />
      <Lb p={[70, y - 6]} t={[70, 40]} text="grain sealed" s={10.5} c={C.steel} a="middle" />
      <T x={x1} y={y + h + 22} s={10} c={C.faint}>dyed grain on top; lining undyed below</T>
      <Loupe cx={404} cy={96} r={50} src={[x1 + w + 4, y + 8]} sr={8} label="2–3 thin coats">
        <EdgeZoom cx={392} cy={96} g={eg} q={q} s={150} r={3} coats={sealCoats} seed={81} />
      </Loupe>

      <Sep x1={14} y1={176} x2={466} y2={176} />
      <Tag x={20} y={196}>The mix</Tag>
      <Jar x={52} y={252} c="#cfd6c4" label="Resolene" level={0.5} />
      <T x={86} y={238} a="middle" s={12} c={C.text}>+</T>
      <Jar x={120} y={252} c="#a9c2cc" label="water" level={0.5} />
      <Arrow a={[140, 236]} b={[158, 236]} w={1.2} />
      <Jar x={180} y={252} c="#bccfd2" label="1 : 1" level={0.75} />
      <T x={30} y={300} s={10.5} c={C.text}>2–3 light coats, dry between</T>
      <T x={30} y={316} s={10} c={C.faint}>sweat pulls unsealed dye out</T>

      <Panel x={244} y={186} w={222} h={136} title="Edges left unsealed" ok={false} />
      {(() => {
        const TS = { x: 266, y: 268, s: 1.9 }
        return (
          <g>
            <rect x={258} y={282} width={200} height={32} rx="6" fill="#efe6d8" />
            <ellipse cx={376} cy={288} rx="22" ry="6" fill="rgba(110,68,34,0.5)" />
            <StrapPlan T={TS} o={SHORT()} />
            <Buckle x={266 + 80 * 1.9} y={268} w={18 * 1.9} L={30} />
            <circle cx={362} cy={280} r="9" fill="none" stroke={C.ruby} strokeWidth="1.4" />
            <T x={258} y={224} s={10.5}>one maker found dye bleeding</T>
            <T x={258} y={238} s={10.5}>at the buckle, where he hadn’t</T>
            <T x={450} y={308} a="end" s={10} c="#7d7264">skin / cuff</T>
          </g>
        )
      })()}
    </Fig>
  )
}

/* Test: damp white cloth on a hidden spot */
function RubTest() {
  const T0 = { x: 40, y: 98, s: 2.3 }
  const o = LONG()
  const spot = px(T0, 104, 0)
  return (
    <Fig h={300} view="Test · damp white cloth" scale="plan ×2.3">
      <StrapPlan T={T0} o={o} stitch={{ m: 3, p: 3, from: 5 }} holes={{}} />
      <PlanClip T={T0} o={o}>
        <rect x={0} y={0} width={480} height={200} fill="rgba(70,38,15,0.45)" />
      </PlanClip>
      <rect x={spot[0] - 22} y={spot[1] - 18} width={44} height={36} rx="5" fill="none" stroke={C.brassHi} strokeWidth="1.2" strokeDasharray="3 2" />
      <Cloth x={spot[0] - 10} y={spot[1] - 40} w={46} h={34} damp />
      <path d={`M${spot[0] - 30} ${spot[1] + 30} l10 -8 l10 8 l10 -8 l10 8 l10 -8`} fill="none" stroke={C.brass} strokeWidth="1.4" />
      <Lb p={[spot[0] - 22, spot[1] + 2]} t={[230, 150]} text="a hidden spot" sub="e.g. under the keepers" a="middle" s={10.5} />
      <Lb p={[spot[0] + 30, spot[1] - 34]} t={[300, 40]} text="damp white cloth, rubbed hard" s={10.5} />

      <Sep x1={14} y1={176} x2={466} y2={176} />
      <Cloth x={60} y={196} w={80} h={56} />
      <Verdict x={150} y={200} ok />
      <T x={100} y={272} a="middle" s={11} c={C.emerald}>clean cloth: done</T>
      <Cloth x={260} y={196} w={80} h={56} smudge={1} seed={9} />
      <Verdict x={350} y={200} ok={false} />
      <T x={300} y={272} a="middle" s={11} c={C.ruby}>colour on the cloth</T>
      <T x={300} y={288} a="middle" s={10.5}>another sealing coat, then test again</T>
      <Arrow d="M352 230 C420 230 430 160 370 140" w={1.4} c="ruby" />
      <T x={418} y={208} s={10} c={C.ruby}>re-seal</T>
    </Fig>
  )
}

/* Condition: patch-test, thin coats, buff, dry flat, no heat */
function Condition() {
  const spec = { x: 236, y: 100, s: 30, W: 6.2, b: 0.5, r: 3, band: 0.1 }
  const steps = [
    ['Patch-test', 'every product, on a hidden spot'],
    ['Thin coat with a cloth', 'at most 2–3 thin coats a session'],
    ['Buff with a clean cloth', 'no film left standing'],
    ['Dry flat', 'never with heat'],
  ]
  return (
    <Fig h={340} view="Detail · section + sequence" scale="profile ×30">
      <Edge {...spec} cond={0.14} seed={91} />
      <rect x={52} y={spec.y} width={180} height={4.5} fill="rgba(80,44,16,0.55)" />
      <rect x={60} y={spec.y + 1.8 * 30 - 3} width={150} height={3} fill="rgba(140,180,160,0.55)" />
      <Cloth x={100} y={66} w={70} h={30} />
      <Arrow a={[86, 58]} b={[184, 58]} both w={1.3} />
      <T x={20} y={44} s={11} c={C.text}>neatsfoot oil or cream, with a cloth</T>
      <Lb p={[200, spec.y + 2]} t={[184, 174]} text="a thin coat, into the grain" s={10.5} a="middle" />
      <Lb p={[90, spec.y + 1.8 * 30 - 1.5]} t={[60, 174]} text="Tokonole, lining" sub="optional" s={10.5} a="middle" />

      <Sep x1={260} y1={28} x2={260} y2={190} />
      {steps.map(([a, b], i) => (
        <g key={a}>
          <Num x={282} y={50 + i * 36} n={i + 1} r={8} />
          <T x={298} y={50 + i * 36} s={11.5} c={C.text}>
            {a}
          </T>
          <T x={298} y={64 + i * 36} s={10} c={C.faint}>
            {b}
          </T>
        </g>
      ))}

      <Sep x1={14} y1={198} x2={466} y2={198} />
      <Panel x={14} y={208} w={146} h={124} title="Too much" ok={false} />
      <Edge x={140} y={250} s={22} W={4} b={0.5} r={3} cond={0.3} coats={[{ t: 0.12, c: 'rgba(150,110,40,0.55)', line: '#d8b860' }]} gloss={0.9} brk seed={92} />
      <rect x={54} y={246} width={78} height={4} fill="rgba(150,110,40,0.6)" />
      <path d="M58 248 q4 -6 8 0 q4 6 8 0 M80 247 q3 -5 6 0" fill="none" stroke="#e8e0cc" strokeWidth="1" />
      <T x={24} y={306} s={10.5} c={C.ruby}>sticky surface,</T>
      <T x={24} y={320} s={10.5} c={C.ruby}>too much, too often</T>
      <Panel x={167} y={208} w={146} h={124} title="Heat-dried" ok={false} />
      <HeatGun x={236} y={262} ang={-90} k={0.62} />
      <path d="M214 240 L258 284 M258 240 L214 284" stroke={C.ruby} strokeWidth="2.4" strokeLinecap="round" />
      <T x={177} y={306} s={10.5} c={C.ruby}>never heat-dry</T>
      <T x={177} y={320} s={10} c={C.faint}>no dryer, no heat gun</T>
      <Panel x={320} y={208} w={146} h={124} title="Dry flat" ok />
      <rect x={334} y={268} width={118} height={8} rx="2" fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.6" />
      <rect x={340} y={261} width={104} height={7} rx="3" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.6" />
      <Clock x={352} y={244} r={11} to={45} />
      <T x={330} y={306} s={10.5} c={C.emerald}>flat, at room</T>
      <T x={330} y={320} s={10.5} c={C.emerald}>temperature</T>
    </Fig>
  )
}

/* ================================================================== */
/* QUALITY CONTROL — the ten checks                                    */
/* ================================================================== */
const Readout = ({ x, y, v, bad }) => (
  <g>
    <rect x={x - 28} y={y - 14} width={56} height={21} rx="3" fill="#1f2a24" stroke={bad ? C.ruby : '#3b4850'} />
    <T x={x} y={y + 2} a="middle" s={12} mono c="#a5d6a7">
      {v}
    </T>
  </g>
)
const LugBar = ({ x, y, w }) => <rect x={x} y={y} width={w} height={11} rx="4" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.7" />

/* Width at the lug: within 0.2 mm of the gap */
function QcWidth() {
  const cases = [
    ['Too narrow', '19.4', 6, false, 'gaps: the strap shifts'],
    ['Within 0.2', '19.9', 1, true, 'snug, no play'],
    ['Too wide', '20.3', -3, false, 'won’t seat; edges crushed'],
  ]
  const nl = (v) => 50 + (v - 19.4) * 380
  return (
    <Fig h={328} view="Plan · between the lugs" scale="gaps exaggerated ×4">
      {cases.map(([title, v, gpx, ok, txt], i) => {
        const x = 14 + i * 152
        const top = 76
        const bot = 176
        return (
          <g key={v}>
            <Panel x={x} y={28} w={146} h={214} title={title} ok={ok} />
            <SpringBar x={x + 46} y1={top - 3} y2={bot + 3} r={2.4} />
            <rect x={x + 36} y={top + gpx} width={102} height={bot - top - 2 * gpx} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
            <BreakV x={x + 138} y1={top + gpx - 3} y2={bot - gpx + 3} />
            <LugBar x={x + 10} y={top - 11} w={64} />
            <LugBar x={x + 10} y={bot} w={64} />
            {gpx < 0 && <rect x={x + 36} y={top + gpx} width={38} height={-gpx} fill="rgba(194,88,99,0.75)" />}
            {gpx < 0 && <rect x={x + 36} y={bot} width={38} height={-gpx} fill="rgba(194,88,99,0.75)" />}
            {gpx > 2 && <rect x={x + 36} y={top} width={38} height={gpx} fill="rgba(194,88,99,0.3)" />}
            {gpx > 2 && <rect x={x + 36} y={bot - gpx} width={38} height={gpx} fill="rgba(194,88,99,0.3)" />}
            <Readout x={x + 73} y={206} v={v} bad={!ok} />
            <T x={x + 73} y={232} a="middle" s={10.5} c={ok ? C.emerald : C.ruby}>
              {txt}
            </T>
          </g>
        )
      })}
      <rect x={nl(19.4)} y={276} width={nl(19.8) - nl(19.4)} height={10} fill="rgba(194,88,99,0.16)" />
      <rect x={nl(19.8)} y={276} width={nl(20.0) - nl(19.8)} height={10} fill="rgba(123,165,131,0.5)" />
      <rect x={nl(20.0)} y={276} width={nl(20.4) - nl(20.0)} height={10} fill="rgba(194,88,99,0.32)" />
      {Array.from({ length: 11 }, (_, i) => 19.4 + i * 0.1).map((v, i) => (
        <g key={i}>
          <line x1={nl(v)} y1={286} x2={nl(v)} y2={i % 2 ? 290 : 293} stroke={C.dim} strokeWidth="0.8" />
          {i % 2 === 0 && (
            <T x={nl(v)} y={306} a="middle" s={10.5} mono>
              {v.toFixed(1)}
            </T>
          )}
        </g>
      ))}
      <line x1={nl(20)} y1={262} x2={nl(20)} y2={292} stroke={C.brassHi} strokeWidth="1.4" />
      <T x={nl(20) + 4} y={266} s={10.5} c={C.brass}>lug gap 20.0</T>
      <T x={(nl(19.8) + nl(20)) / 2} y={262} a="middle" s={10.5} c={C.emerald}>pass</T>
      {[[19.4, C.ruby], [19.9, C.emerald], [20.3, C.ruby]].map(([v, c]) => (
        <path key={v} d={`M${nl(v)} 274 l-4 -7 h8 Z`} fill={c} />
      ))}
      <T x={240} y={322} a="middle" s={10} c={C.faint}>calipers across the lug end, mm</T>
    </Fig>
  )
}

/* Lengths, from the bar centre */
function QcLength() {
  const TL = { x: 62, y: 82, s: 2.9 }
  const TS = { x: 62, y: 178, s: 2.9 }
  const g = { cx: 120, cy: 282, r: 9, t: 14, tl: 7, ramp: 22, conv: 24, tail: 40, body: 120 }
  const fg = foldPaths(g)
  return (
    <Fig h={330} view="Plan · the finished pair" scale="20 mm lug · 120 / 80">
      <SpringBar x={62} y1={53} y2={111} r={2.4} />
      <StrapPlan T={TL} o={LONG()} stitch={{ m: 3, p: 3, from: 5 }} holes={{}} />
      <Buckle x={62 + 80 * 2.9} y={178} w={18 * 2.9} L={36} />
      <SpringBar x={62} y1={149} y2={207} r={2.4} />
      <StrapPlan T={TS} o={SHORT()} stitch={{ m: 3, p: 3, from: 5, to: 64 }} keepers={[{ x: 70 }, { x: 52, float: true }]} />
      <g stroke={C.dim} strokeWidth="0.6" opacity="0.7">
        <line x1={62} y1={50} x2={62} y2={30} />
        <line x1={410} y1={78} x2={410} y2={30} />
        <line x1={62} y1={210} x2={62} y2={240} />
        <line x1={294} y1={208} x2={294} y2={240} />
      </g>
      <Dim a={[62, 36]} b={[410, 36]} text="120" s={11.5} />
      <Dim a={[62, 234]} b={[294, 234]} text="80" s={11.5} flip />
      {[82, 178].map((y) => (
        <circle key={y} cx={62} cy={y} r="5.5" fill="none" stroke={C.brassHi} strokeWidth="1.3" />
      ))}
      <Lb p={[56, 178]} t={[30, 140]} text="bar centre" sub="= the datum" a="middle" s={10.5} c={C.brass} />
      <Lb p={[350, 82]} t={[350, 122]} text="long: bar centre → tip" a="middle" s={10.5} />
      <Lb p={[294, 158]} t={[340, 140]} text="short: bar centre" sub="→ buckle-bar fold" s={10.5} />

      <Sep x1={14} y1={252} x2={466} y2={252} />
      <Fold {...g} />
      <BreakV x={g.cx + g.body} y1={fg.yT - 3} y2={fg.yB + 3} />
      <line x1={g.cx} y1={fg.yT - 14} x2={g.cx} y2={g.cy} stroke={C.emerald} strokeWidth="1" strokeDasharray="2 2" />
      <line x1={g.cx - g.r - g.tl} y1={fg.yT - 4} x2={g.cx - g.r - g.tl} y2={g.cy} stroke={C.ruby} strokeWidth="1" strokeDasharray="2 2" />
      <Arrow a={[g.cx, fg.yT - 12]} b={[g.cx + 60, fg.yT - 12]} c="emerald" w={1.3} />
      <Verdict x={g.cx + 74} y={fg.yT - 12} ok r={7} />
      <Arrow a={[g.cx - g.r - g.tl, g.cy + g.r + g.tl + 10]} b={[g.cx + 40, g.cy + g.r + g.tl + 10]} c="ruby" w={1.3} />
      <Verdict x={g.cx + 54} y={g.cy + g.r + g.tl + 10} ok={false} r={7} />
      <T x={20} y={276} s={10.5} c={C.emerald}>from here</T>
      <T x={20} y={306} s={10.5} c={C.ruby}>not the loop’s end</T>
      <Note x={286} y={276} lines={['20 mm lug: 120 / 80 (house),', 'or the wrist lengths you chose;', 'both pieces, every time']} s={10.5} lh={14} />
    </Fig>
  )
}

/* Case fit before the final coats */
function QcCase() {
  const bx = 150
  const by = 128
  const s = 7
  const r = 0.9 * s
  const t = 1.1 * s
  const mini = (y, ok) => {
    const top = y
    const gap = 50
    const sw = ok ? 40 : 50
    const sy = top + 11 + (gap - sw) / 2
    return (
      <g>
        <rect x={284} y={sy} width={150} height={sw} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
        <rect x={284} y={sy - 3.5} width={150} height={3.5} fill="none" stroke={C.brassHi} strokeWidth="0.9" strokeDasharray="3 2" />
        <rect x={284} y={sy + sw} width={150} height={3.5} fill="none" stroke={C.brassHi} strokeWidth="0.9" strokeDasharray="3 2" />
        <LugBar x={268} y={top} w={80} />
        <LugBar x={268} y={top + 11 + gap} w={80} />
        {!ok && <rect x={284} y={top + 7.5} width={64} height={3.5} fill="rgba(194,88,99,0.7)" />}
        {!ok && <rect x={284} y={top + 11 + gap} width={64} height={3.5} fill="rgba(194,88,99,0.7)" />}
        <BreakV x={434} y1={sy - 6} y2={sy + sw + 6} />
      </g>
    )
  }
  return (
    <Fig h={322} view="Side view + plan at the lugs" scale="side ×7 · coats exaggerated">
      <Tag x={20} y={42}>Test-fit on the watch</Tag>
      <CaseSide x={bx} y={by} s={s} gap={3.2} len={12} />
      <Ply x1={bx} x2={232} y={by - r - t} t={t} open="l" />
      <Wrap cx={bx} cy={by} r={r} t={t} xR={bx} conv={r * 2.6} tail={r * 3.4} ts={t * 0.45} />
      <Ply x1={bx + r * 2.6 + 2} x2={232} y={by - r + 1} t={0.7 * s} k="lining" skL={[16, 1.4]} cut="top" />
      <BarEnd cx={bx} cy={by} r={r} />
      <BreakV x={232} y1={by - r - t - 4} y2={by + 2} />
      <Lb p={[bx - 2.2 * s, by + 4]} t={[84, 196]} text="fold clears the case" a="middle" s={10.5} />
      <Lb p={[200, by - r - t + 2]} t={[180, 60]} text="strap fitted now" sub="before the final coats" a="middle" s={10.5} />

      <Sep x1={250} y1={30} x2={250} y2={310} />
      <Tag x={262} y={42}>Plan: room for the paint</Tag>
      {mini(62, true)}
      <Verdict x={452} y={70} ok r={8} />
      <T x={268} y={146} s={10.5} c={C.emerald}>room left for the coats to come</T>
      {mini(176, false)}
      <Verdict x={452} y={184} ok={false} r={8} />
      <T x={268} y={260} s={10.5} c={C.ruby}>snug already: the coats will bind</T>
      <T x={268} y={290} s={10} c={C.brass}>dashed: final paint coats</T>
      <Note x={20} y={240} lines={['Fit it before the last coats: the edge', 'paint adds width, and a strap that', 'fits bare may not fit painted.']} s={10.5} lh={14} />
    </Fig>
  )
}

/* Bar channel: slides freely, holes within 0.5 mm */
function QcBar() {
  const okG = { cx: 74, cy: 108, r: 16, t: 22, tl: 11, ramp: 38, conv: 42, tail: 60, body: 130 }
  const noG = { cx: 304, cy: 108, r: 12, t: 22, tl: 11, ramp: 30, conv: 34, tail: 60, body: 130 }
  const fo = foldPaths(okG)
  const fn = foldPaths(noG)
  return (
    <Fig h={330} view="Section through the loop + plan" scale="schematic">
      <Panel x={14} y={28} w={222} h={156} title="Slides freely" ok />
      <Fold {...okG} bar={false} />
      <BreakV x={okG.cx + okG.body} y1={fo.yT - 3} y2={fo.yB + 3} />
      <BarEnd cx={okG.cx} cy={okG.cy + 2} r={12.5} />
      <Lb p={[okG.cx + 13, okG.cy - 10]} t={[150, 150]} text="clear all round, no glue" s={10.5} c={C.emerald} a="middle" />
      <Panel x={244} y={28} w={222} h={156} title="Tight or glued" ok={false} />
      <Fold {...noG} bar={false} />
      <BreakV x={noG.cx + noG.body} y1={fn.yT - 3} y2={fn.yB + 3} />
      <BarEnd cx={noG.cx} cy={noG.cy} r={12.4} />
      {Array.from({ length: 9 }, (_, i) => {
        const a = (i / 9) * 2 * Math.PI
        return <circle key={i} cx={noG.cx + 12.6 * Math.cos(a)} cy={noG.cy + 12.6 * Math.sin(a)} r="1.3" fill={C.glue} />
      })}
      <Lb p={[noG.cx + 12, noG.cy + 6]} t={[380, 150]} text="glue in the channel: the bar jams" s={10.5} c={C.ruby} a="middle" />

      <Tag x={20} y={208}>Plan · holes in line</Tag>
      <rect x={70} y={226} width={180} height={76} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <BreakV x={250} y1={222} y2={306} />
      <line x1={80} y1={214} x2={80} y2={314} stroke={C.brassHi} strokeWidth="1" strokeDasharray="4 3" />
      <rect x={77.5} y={218} width={5} height={92} rx="2.5" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" transform="rotate(0.6 80 264)" />
      <Arrow a={[86, 316]} b={[130, 316]} w={1.3} />
      <T x={136} y={320} s={10} c={C.brass}>slides out freely</T>
      <T x={270} y={244} s={10.5} c={C.text}>holes aligned within</T>
      <T x={270} y={260} s={11.5} mono c={C.emerald}>0.5 mm</T>
      <T x={270} y={278} s={10.5}>bar square to the strap;</T>
      <T x={270} y={292} s={10.5}>both sides lock on the lugs</T>
    </Fig>
  )
}

/* Stitching: even slant, 1 in 60, no pierced thread, ends on the lining */
function StitchRow({ x1, x2, y, p = 13, bad }) {
  const n = Math.floor((x2 - x1) / p)
  return (
    <g>
      <rect x={x1 - 10} y={y - 13} width={x2 - x1 + 20} height={26} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.7" />
      {Array.from({ length: n }, (_, i) => {
        const x = x1 + i * p
        const odd = i === bad
        return <line key={i} x1={x + (odd ? 3 : 1)} y1={y + (odd ? 0.5 : 2.6)} x2={x + p - (odd ? 1 : 3)} y2={y - (odd ? 4.8 : 2.6)} stroke={C.thread} strokeWidth="2" strokeLinecap="round" />
      })}
    </g>
  )
}
function QcStitch() {
  const L = { cx: 110, cy: 262, r: 48 }
  return (
    <Fig h={334} view="Plan of the seam + details" scale="schematic">
      <StitchRow x1={40} x2={420} y={58} />
      <Verdict x={448} y={58} ok />
      <T x={96} y={90} s={10.5} c={C.emerald}>even slant, even length, one pitch</T>
      <StitchRow x1={40} x2={420} y={128} bad={16} />
      <ellipse cx={40 + 16 * 13 + 6.5} cy={128} rx="13" ry="10" fill="none" stroke={C.ruby} strokeWidth="1.5" />
      <Verdict x={448} y={128} ok={false} />
      <T x={96} y={160} s={10.5} c={C.ruby}>one uneven stitch in sixty: re-stitch that whole run</T>

      <Sep x1={14} y1={176} x2={466} y2={176} />
      <Tag x={20} y={196}>No pierced thread</Tag>
      <Loupe cx={L.cx} cy={L.cy} r={L.r} src={[46, 128]} sr={7}>
        <rect x={L.cx - L.r} y={L.cy - L.r} width={L.r * 2} height={L.r * 2} fill="url(#sk-top)" />
        <path d={`M${L.cx - 60} ${L.cy + 12} L${L.cx - 10} ${L.cy - 2} M${L.cx + 10} ${L.cy - 8} L${L.cx + 60} ${L.cy - 22}`} stroke={C.thread} strokeWidth="9" strokeLinecap="round" />
        {[-6, -3, 0, 3, 6].map((d) => (
          <path key={d} d={`M${L.cx - 10} ${L.cy - 2 + d * 0.5} q6 ${d} 20 ${-6 + d * 0.6}`} fill="none" stroke="#efe2c6" strokeWidth="1" />
        ))}
        <path d={`M${L.cx + 2} ${L.cy - 6} L${L.cx - 2} ${L.cy - 44} L${L.cx + 6} ${L.cy - 44} Z`} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" />
      </Loupe>
      <Verdict x={170} y={222} ok={false} r={8} />
      <T x={180} y={262} s={10.5} c={C.ruby}>awl split</T>
      <T x={180} y={276} s={10.5} c={C.ruby}>the thread</T>

      <Sep x1={250} y1={186} x2={250} y2={326} />
      <Tag x={262} y={196}>Ends on the lining side</Tag>
      <rect x={270} y={226} width={180} height={14} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.7" />
      <rect x={270} y={240} width={180} height={9} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
      <g stroke={C.thread} strokeWidth="1.6" strokeLinecap="round">
        {[300, 324, 348, 372, 396].map((x) => (
          <line key={x} x1={x} y1={223} x2={x} y2={252} />
        ))}
        <line x1={300} y1={223} x2={396} y2={223} opacity="0.7" />
        <line x1={300} y1={252} x2={396} y2={252} opacity="0.7" />
        <line x1={348} y1={255} x2={372} y2={255} opacity="0.9" />
      </g>
      <circle cx={360} cy={259} r="2.6" fill="#d9c9a5" />
      <Verdict x={448} y={208} ok r={8} />
      <Lb p={[360, 260]} t={[360, 286]} text="backstitched, trimmed, sealed" sub="on the lining side, out of sight" a="middle" s={10.5} />
      <T x={262} y={232} a="end" s={10} c={C.faint}>top</T>
    </Fig>
  )
}

/* Edges: no fuzz, no cross-scratches, nothing on the horns or spine, no cracks */
function QcEdges() {
  const spec = { x: 196, y: 64, s: 30, W: 4.4, b: 0.6, r: 3 }
  const g = edgeGeom(spec)
  const m = at(g, 0.5)
  const thumb = (x, title, el) => (
    <g key={title}>
      <Panel x={x} y={210} w={108} h={112} ok={false} />
      <T x={x + 8} y={226} s={10} c={C.text}>
        {title}
      </T>
      {el}
    </g>
  )
  return (
    <Fig h={330} view="Detail · the finished edge" scale="profile ×30">
      <Panel x={14} y={28} w={452} h={174} title="Pass" ok />
      <Edge {...spec} band={0.16} gloss={0.85} seed={95} />
      <path d={`M${m.p[0] + 4} ${m.p[1] + 14} q14 -2 20 -18 q4 -14 -6 -22 q-10 -6 -14 6 Z`} fill="rgba(214,170,140,0.55)" stroke="#a57e66" strokeWidth="0.9" />
      <path d={`M${m.p[0] + 5} ${m.p[1] + 10} q6 -1 8 -9`} fill="none" stroke="#f3e6da" strokeWidth="2" strokeLinecap="round" />
      <Arrow a={[m.p[0] + 36, m.p[1] - 26]} b={[m.p[0] + 36, m.p[1] + 26]} both w={1.2} />
      <Lb p={[m.p[0] + 16, m.p[1] - 16]} t={[300, 54]} text="fingernail: nothing catches" s={10.5} />
      <Note x={290} y={96} lines={['no fuzz, no cross-scratches', 'nothing on the horns or spine', 'no cracks at the folds']} s={10.5} lh={15} c={C.emerald} />
      <EdgeFace x1={40} x2={440} y={164} h={16} tone="rgba(60,34,14,0.35)">
        <line x1={46} y1={169} x2={434} y2={169} stroke="#fff4d8" strokeWidth="1.3" opacity="0.6" strokeLinecap="round" />
      </EdgeFace>
      <T x={40} y={194} s={10} c={C.faint}>the edge seen edge-on: one even, sealed band from tip to lug</T>
      <T x={g.x0 - 6} y={86} a="end" s={10} c={C.faint}>top</T>

      {thumb(14, 'fuzz', <Edge x={100} y={250} s={18} W={3.6} fuzz={0.25} fuzzN={14} seed={96} />)}
      {thumb(129, 'scratches', (
        <EdgeFace x1={140} x2={226} y={252} h={26}>
          <Scratches x1={140} x2={226} y={252} h={26} n={22} w={0.8} op={0.6} seed={9} across />
        </EdgeFace>
      ))}
      {thumb(244, 'spine painted', (
        <g>
          <Fold cx={276} cy={270} r={9} t={14} tl={7} ramp={22} conv={24} tail={30} body={68} spine={C.paint} />
          <path d="M260 262 l-6 -2 M259 274 l-6 2" stroke={C.ruby} strokeWidth="1.4" />
        </g>
      ))}
      {thumb(359, 'cracked fold', (
        <g transform="translate(413 290) scale(0.55) translate(-125 -332)">
          <BentEdge cx={125} cy={332} cracked />
        </g>
      ))}
    </Fig>
  )
}

/* Holes: centreline, equal pitch, 25 mm from the tip, tongue seats */
function QcHoles() {
  const T1 = { x: 30 - 40 * 3.2, y: 84, s: 3.2 }
  const T2 = { x: 30 - 40 * 3.2, y: 214, s: 3.2 }
  const o = LONG({ x0: 40 })
  const hx = holeXs(120)
  const X = (mm) => T1.x + mm * T1.s
  const drift = [3.2, 0.6, -2.4, 1.6, 4.2, -3.1, 2.4]
  const off = [0, 0.8, -1.2, 1.5, 0, -0.9, 1.4]
  return (
    <Fig h={326} view="Plan · tip end of the long piece" scale="plan ×3.2">
      <StrapPlan T={T1} o={o} centre holes={{}} />
      <BreakV x={30} y1={50} y2={118} />
      <Dim a={[X(hx[0]), 116]} b={[X(120), 116]} off={14} text="25" s={11} flip />
      <Dim a={[X(hx[1]), 46]} b={[X(hx[0]), 46]} text="7" s={11} />
      <Lb p={[X(hx[4]), 84]} t={[100, 38]} text="on the centreline, equal pitch" a="middle" s={10.5} c={C.emerald} />
      <Verdict x={420} y={46} ok />
      <T x={30} y={156} s={10} c={C.faint}>house: 7 holes · pitch 7 · last hole 25 from the tip · Ø 1.5–2, ≥ the tongue</T>

      <StrapPlan T={T2} o={o} />
      <BreakV x={30} y1={180} y2={248} />
      <line x1={30} y1={214} x2={X(124)} y2={214} stroke={C.steel} strokeWidth="0.8" strokeDasharray="10 3 2 3" opacity="0.85" />
      {hx.map((h, i) => (
        <circle key={h} cx={X(h + off[i])} cy={214 + drift[i]} r={2.9} fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />
      ))}
      <Verdict x={420} y={176} ok={false} />
      <T x={30} y={268} s={10.5} c={C.ruby}>drifting off the line, uneven pitch</T>

      <Sep x1={14} y1={280} x2={466} y2={280} />
      <circle cx={70} cy={304} r={6} fill={C.hole} stroke="#e7c48f" strokeWidth="0.7" />
      <rect x={42} y={302} width={30} height={4} rx="2" fill="url(#sk-steelH)" />
      <Verdict x={96} y={304} ok r={7} />
      <T x={110} y={308} s={10.5} c={C.emerald}>tongue seats cleanly</T>
      <ellipse cx={300} cy={304} rx={5} ry={3.4} fill={C.hole} stroke={C.ruby} strokeWidth="0.9" />
      <rect x={272} y={302} width={30} height={4} rx="2" fill="url(#sk-steelH)" />
      <Verdict x={326} y={304} ok={false} r={7} />
      <T x={340} y={308} s={10.5} c={C.ruby}>hole too small: it tears</T>
    </Fig>
  )
}

/* Keepers: fixed snug, floating slides */
function KeeperSec({ x, y, gap, tight }) {
  const w = 70
  const h = 9
  return (
    <g>
      <rect x={x - w / 2} y={y} width={w} height={h} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />
      <rect x={x - w / 2 + 3} y={y + h} width={w - 6} height={h} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />
      <rect x={x - w / 2 - gap - 3} y={y - gap - 3} width={w + 2 * gap + 6} height={2 * h + 2 * gap + 6} rx="6" fill="none" stroke="#6f4b27" strokeWidth="5" />
      <rect x={x - w / 2 - gap - 3} y={y - gap - 3} width={w + 2 * gap + 6} height={2 * h + 2 * gap + 6} rx="6" fill="none" stroke="#e0b277" strokeWidth="0.7" />
      {tight && <path d={`M${x - 12} ${y - 6} l4 4 l4 -4 M${x + 4} ${y - 6} l4 4 l4 -4`} fill="none" stroke={C.ruby} strokeWidth="1.3" />}
    </g>
  )
}
function QcKeepers() {
  const T0 = { x: 40, y: 92, s: 3.1 }
  const o = SHORT()
  const k = (x, w = 5) => {
    const h = widthAt(x, o) / 2 + 1
    const [x1, y1] = px(T0, x - w / 2, -h)
    return <rect x={x1} y={y1} width={w * T0.s} height={h * 2 * T0.s} rx="2" fill="url(#sk-dark)" stroke="#e0b277" strokeWidth="0.9" />
  }
  return (
    <Fig h={330} view="Plan + sections across the keepers" scale="plan ×3.1">
      <StrapPlan T={T0} o={o} stitch={{ m: 3, p: 3, from: 5, to: 64 }} />
      <Buckle x={40 + 80 * 3.1} y={92} w={18 * 3.1} L={40} />
      <rect x={150} y={92 - 26} width={240} height={52} fill="rgba(168,118,63,0.32)" stroke="#e0b277" strokeWidth="0.9" strokeDasharray="5 3" />
      <T x={392} y={140} a="end" s={10} c={C.faint}>long piece threaded (dashed)</T>
      {k(70)}
      {k(52)}
      <Dim a={[40 + 70 * 3.1, 56]} b={[40 + 80 * 3.1, 56]} off={-6} text="10" s={10.5} />
      <Lb p={[40 + 70 * 3.1, 64]} t={[200, 36]} text="fixed keeper" sub="glued in, snug" a="end" s={10.5} />
      <Arrow a={[40 + 40 * 3.1, 132]} b={[40 + 64 * 3.1, 132]} both w={1.3} />
      <Lb p={[40 + 52 * 3.1, 120]} t={[120, 150]} text="floating keeper slides" a="middle" s={10.5} />

      <Sep x1={14} y1={172} x2={466} y2={172} />
      {[
        [64, 'fixed, snug', 0.5, true],
        [178, 'fixed, loose', 6, false],
        [292, 'floating, slides', 2.5, true],
        [406, 'floating, stuck', -1, false, true],
      ].map(([x, label, gap, ok, tight]) => (
        <g key={label}>
          <KeeperSec x={x} y={222} gap={gap} tight={tight} />
          <Verdict x={x} y={196} ok={ok} r={8} />
          <T x={x} y={288} a="middle" s={10.5} c={ok ? C.emerald : C.ruby}>
            {label}
          </T>
        </g>
      ))}
      <T x={240} y={316} a="middle" s={10} c={C.faint}>sections across the keeper: short piece below, long piece above</T>
    </Fig>
  )
}

/* Curve: lies in a wrist curve, no wrinkles */
function WristStrap({ cx, cy, wrinkle }) {
  const rx = 70
  const ry = 50
  const E = (a, k) => [cx + (rx + k) * Math.cos((a * Math.PI) / 180), cy + (ry + k) * Math.sin((a * Math.PI) / 180)]
  const ring = (k1, k2, fill, stroke) => {
    const [ax, ay] = E(-62, k2)
    const [bx, by] = E(-118, k2)
    const [cx2, cy2] = E(-118, k1)
    const [dx, dy] = E(-62, k1)
    return (
      <path
        d={`M${f1(ax)} ${f1(ay)} A${rx + k2} ${ry + k2} 0 1 1 ${f1(bx)} ${f1(by)} L${f1(cx2)} ${f1(cy2)} A${rx + k1} ${ry + k1} 0 1 0 ${f1(dx)} ${f1(dy)} Z`}
        fill={fill}
        stroke={stroke}
        strokeWidth="0.8"
      />
    )
  }
  return (
    <g>
      <Wrist cx={cx} cy={cy} rx={rx} ry={ry} />
      {ring(2, 6, '#e2d2b3', '#8f7b5a')}
      {ring(6, 13, '#a8763f', '#4a3018')}
      <rect x={cx - 34} y={cy - ry - 18} width={68} height={18} rx="6" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
      <rect x={cx - 24} y={cy - ry - 24} width={48} height={7} rx="3" fill="url(#sk-glass)" stroke={C.steel} strokeWidth="0.6" />
      <rect x={cx - 8} y={cy + ry + 3} width={16} height={12} rx="2" fill="none" stroke="url(#sk-steel)" strokeWidth="2.4" />
      {wrinkle &&
        [-48, -36, -24, -156, -144, -132].map((a) => {
          const [x1, y1] = E(a, 6)
          const [x2, y2] = E(a, 15)
          return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3a2412" strokeWidth="1.6" />
        })}
    </g>
  )
}
function QcCurve() {
  return (
    <Fig h={318} view="End view on the wrist + plan" scale="schematic">
      <Panel x={14} y={28} w={222} h={282} title="Lies curved" ok />
      <WristStrap cx={125} cy={150} />
      <T x={30} y={240} s={10.5} c={C.emerald}>follows the wrist; face smooth</T>
      <rect x={34} y={254} width={182} height={34} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <T x={30} y={304} s={10} c={C.faint}>top face, plan: clean</T>
      <Panel x={244} y={28} w={222} h={282} title="Wrinkled" ok={false} />
      <WristStrap cx={355} cy={150} wrinkle />
      <Lb p={[355 + 76 * Math.cos((-36 * Math.PI) / 180), 150 + 56 * Math.sin((-36 * Math.PI) / 180)]} t={[450, 58]} text="ridges" a="end" s={10.5} c={C.ruby} />
      <T x={260} y={240} s={10.5} c={C.ruby}>wrinkles across the top</T>
      <rect x={264} y={254} width={182} height={34} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${290 + i * 18} 256 q-3 15 0 30`} fill="none" stroke="#5a3a1c" strokeWidth="1.4" opacity="0.8" />
      ))}
      <T x={260} y={304} s={10} c={C.faint}>top face, plan: ridges across it</T>
    </Fig>
  )
}

/* Dye: the white-cloth rub test comes away clean */
function QcDye() {
  const T0 = { x: 140, y: 74, s: 2.2 }
  const o = LONG()
  const spot = px(T0, 100, 0)
  return (
    <Fig h={300} view="Test · damp white cloth" scale="plan ×2.2">
      <StrapPlan T={T0} o={o} holes={{}} stitch={{ m: 3, p: 3, from: 5 }} />
      <PlanClip T={T0} o={o}>
        <rect x={0} y={0} width={480} height={160} fill="rgba(70,38,15,0.45)" />
      </PlanClip>
      <Cloth x={spot[0] - 22} y={spot[1] - 22} w={44} h={34} damp />
      <path d={`M${spot[0] - 26} ${spot[1] + 30} l9 -7 l9 7 l9 -7 l9 7 l9 -7`} fill="none" stroke={C.brass} strokeWidth="1.4" />
      <Lb p={[spot[0] - 22, spot[1] - 6]} t={[230, 30]} text="damp white cloth, rubbed hard" sub="on a hidden spot" a="middle" s={10.5} />

      <Panel x={14} y={128} w={222} h={162} title="Pass" ok />
      <Cloth x={60} y={156} w={110} h={76} />
      <T x={30} y={260} s={11} c={C.emerald}>the cloth comes away clean</T>
      <T x={30} y={276} s={10} c={C.faint}>the dye is sealed in</T>
      <Panel x={244} y={128} w={222} h={162} title="Fail" ok={false} />
      <Cloth x={290} y={156} w={110} h={76} smudge={1} seed={11} />
      <T x={260} y={260} s={11} c={C.ruby}>colour on the cloth</T>
      <T x={260} y={276} s={10} c={C.faint}>another sealing coat, then retest</T>
    </Fig>
  )
}

export const FIGS = {
  't10-route': EdgeMap,
  't10-level': Level,
  't10-bevel': Bevel,
  't10-sand': Sand,
  't10-colour': Colour,
  't10-agent': Agent,
  't10-burnish': Burnish,
  't10-repeat': BurnishRepeat,
  't10-seal': Seal,
  't10p-prep': PaintPrep,
  't10p-bevel': PaintBevel,
  't10p-prime': PaintPrime,
  't10p-coat': PaintCoat,
  't10p-dry': PaintDry,
  't10p-smooth': PaintSmooth,
  't10p-repeat': PaintRepeat,
  't10p-finish': PaintFinish,
  't10p-nogo': PaintNoGo,
  't13-skive': FoldSkive,
  't13-mark': FoldMark,
  't13-glue': FoldGlue,
  't13-former': FoldFormer,
  't13-fold': FoldSet,
  't13-stitch': FoldStitch,
  't13-align': FoldAlign,
  't13-nofinish': FoldNoFinish,
  't13-knob': FoldKnob,
  't13-notch': FoldNotch,
  't14-dye': Dye,
  't14-buff': Buff,
  't14-seal': SealStrap,
  't14-test': RubTest,
  't14-condition': Condition,
  'qc-width': QcWidth,
  'qc-length': QcLength,
  'qc-case': QcCase,
  'qc-bar': QcBar,
  'qc-stitch': QcStitch,
  'qc-edges': QcEdges,
  'qc-holes': QcHoles,
  'qc-keepers': QcKeepers,
  'qc-curve': QcCurve,
  'qc-dye': QcDye,
}

