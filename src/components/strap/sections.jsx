// Longitudinal section of a flat strap piece — the drawing most build steps
// hang their annotation on. Thickness is exaggerated (k px/mm) against
// length (s px/mm); the drawing says so in its scale tag.
//
// Ends: 'bar' (fold round a spring bar), 'buckle' (fold round the buckle bar,
// with frame and tongue), 'tip' (cut end), 'flap' (fold not yet made: the
// skived flap lies flat), 'break' (piece continues).
import { C } from './kit.jsx'
import { Ply, Wrap, BarEnd, GlueLine, NoGlue, Reinf, SectionStitch } from './parts.jsx'

export function secGeom({ x1, x2, y, s = 3.2, k = 9, top = 1.1, lin = 0.7, bar = 0.9, buckleBar = 1.1 }) {
  const T = top * k
  const L = lin * k
  const y1 = y + T
  const r = bar * k
  const rb = buckleBar * k
  return {
    s, k, T, L, y1, r, rb,
    yL: y1 + L, // lining underside
    barL: { cx: x1, cy: y1 + r },
    barR: { cx: x2, cy: y1 + rb },
    mm: (v) => v * s,
  }
}

export function StrapSection(props) {
  const {
    x1, x2, y,
    left = { kind: 'bar' },
    right = { kind: 'tip' },
    vel, glue, stitch, holes = [], keeper, liningFrom, liningTo, noLining, hl = [],
    lk = 'lining', tk = 'top', tailSkive = 0.45,
  } = props
  const g = secGeom(props)
  const { T, L, y1, r, rb, s } = g
  const cvL = r * 2.6
  const tlL = r * 4.2
  const cvR = rb * 2.4
  const tlR = Math.max(rb * 4.5, 25 * s - cvR) // buckle flap ≥25 mm
  const els = []

  // ---- body (top layer) ----
  let bx1 = x1
  let bx2 = x2
  let skL
  let skR
  if (left.kind === 'flap') {
    const f = (left.len ?? 20) * s
    bx1 = x1 - f
    skL = [f * 0.85, T * (left.to ?? 0.35)]
  }
  if (right.kind === 'flap') {
    const f = (right.len ?? 25) * s
    bx2 = x2 + f
    skR = [f * 0.85, T * (right.to ?? 0.35)]
  }
  const open = (left.kind === 'bar' ? 'l' : '') + (right.kind === 'buckle' ? 'r' : '')
  els.push(<Ply key="body" x1={bx1} x2={bx2} y={y} t={T} k={tk} skL={skL} skR={skR} open={open} />)

  // ---- folds ----
  let tailL = null
  let tailR = null
  if (left.kind === 'bar') {
    els.push(<Wrap key="wl" cx={x1} cy={y1 + r} r={r} t={T} xR={x1} conv={cvL} tail={tlL} ts={T * tailSkive} k={tk} dir={1} />)
    if (!left.noBar) els.push(<BarEnd key="bl" cx={x1} cy={y1 + r} r={r * 0.92} />)
    tailL = { a: x1 + cvL, b: x1 + cvL + tlL, t: T * tailSkive }
  }
  if (right.kind === 'buckle') {
    els.push(<Wrap key="wr" cx={x2} cy={y1 + rb} r={rb} t={T} xR={x2} conv={cvR} tail={tlR} ts={T * tailSkive} k={tk} dir={-1} />)
    tailR = { a: x2 - cvR - tlR, b: x2 - cvR, t: T * tailSkive }
    if (!right.noBuckle) els.push(<BuckleSide key="bk" cx={x2} cy={y1 + rb} r={rb} s={s} T={T} />)
  }
  const tailT = (x) => {
    let t = 0
    if (tailL && x >= tailL.a && x <= tailL.b) t = Math.max(t, tailL.t * (1 - (x - tailL.a) / (tailL.b - tailL.a)))
    if (tailR && x >= tailR.a && x <= tailR.b) t = Math.max(t, tailR.t * ((x - tailR.a) / (tailR.b - tailR.a)))
    return t
  }

  // ---- reinforcement ----
  if (vel) {
    const va = tailL ? tailL.b : bx1 + 4
    const vb = tailR ? tailR.a : bx2 - 4
    els.push(<Reinf key="vel" x1={vel.from ?? va} x2={vel.to ?? vb} y={y1 + 1.1} />)
  }

  // ---- lining ----
  if (!noLining && L > 0) {
    const la = liningFrom ?? (tailL ? tailL.a + 1 : left.kind === 'flap' ? x1 + 2 : bx1)
    const lb = liningTo ?? (tailR ? tailR.b - 1 : right.kind === 'flap' ? x2 - 2 : bx2)
    const N = 40
    const topPts = []
    for (let i = 0; i <= N; i++) {
      const x = la + ((lb - la) * i) / N
      topPts.push([x, y1 + tailT(x) + (vel ? 2.2 : 0)])
    }
    // skive the lining's fold ends to a feather
    const fe = 10 * s
    const thick = (x) => {
      let t = L
      if (left.kind === 'bar' || left.kind === 'flap') t = Math.min(t, L * (0.25 + (0.75 * (x - la)) / fe))
      if (right.kind === 'buckle' || right.kind === 'flap') t = Math.min(t, L * (0.25 + (0.75 * (lb - x)) / fe))
      return Math.max(L * 0.25, t)
    }
    const bot = topPts.map(([x, yy]) => [x, yy + thick(x)]).reverse()
    els.push(
      <polygon
        key="lin"
        points={[...topPts, ...bot].map((p) => p.map((v) => v.toFixed(2)).join(',')).join(' ')}
        fill={lk === 'lining' ? 'url(#sk-linS)' : 'url(#sk-topS)'}
        stroke="#8f7b5a"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    )
  }

  // ---- glue ----
  if (glue) {
    const ga = x1 + (glue.stopL ?? 10) * s
    const gb = x2 - (glue.stopR ?? (right.kind === 'buckle' ? 14 : 0)) * s
    els.push(<GlueLine key="gl" x1={ga} x2={gb} y={y1 + 0.6} />)
    if (left.kind === 'bar' || left.kind === 'flap') els.push(<NoGlue key="ngl" x1={x1 + 2} x2={ga} y={y1 + 1} h={7} />)
    if (right.kind === 'buckle') els.push(<NoGlue key="ngr" x1={gb} x2={x2 - 2} y={y1 + 1} h={7} />)
  }

  // ---- stitches (section along the stitch line) ----
  if (stitch) {
    els.push(<SectionStitch key="st" x1={x1 + (stitch.from ?? 6) * s} x2={x2 - (stitch.to ?? 4) * s} y1={y} y2={y1 + (noLining ? 0 : L)} p={(stitch.p ?? 3) * s} />)
  }

  // ---- adjustment holes (mm from the right end) ----
  holes.forEach((h, i) => {
    const cx = x2 - h * s
    const w = 1.8 * s
    els.push(<rect key={'h' + i} x={cx - w / 2} y={y - 1} width={w} height={T + L + 2 + tailT(cx)} fill={C.ground} stroke="#e7c48f" strokeWidth="0.5" />)
  })

  // ---- fixed keeper (mm from the buckle fold) ----
  if (keeper && right.kind === 'buckle') {
    const kx = x2 - keeper.at * s
    const kw = 5 * s
    const kt = 1.2 * g.k
    const gap = (T + L) * 1.05 // room for the long piece
    const top = y - gap - kt
    els.push(
      <g key="kp">
        <rect x={kx - kw / 2} y={top} width={kw} height={kt} rx="1.5" fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
        <path
          d={`M${kx - kw / 2} ${top + kt / 2} q-5 0 -5 6 V${y1 + 1} M${kx + kw / 2} ${top + kt / 2} q5 0 5 6 V${y1 + 1}`}
          fill="none"
          stroke="#b98c57"
          strokeWidth="1"
          strokeDasharray="2.5 2"
        />
        <rect x={kx - kw * 0.8} y={y1 + 0.5} width={kw * 1.6} height={2.6} fill="#9c6e3d" stroke="#4a3018" strokeWidth="0.5" />
      </g>
    )
  }

  if (left.kind === 'break' || right.kind === 'break') {
    const bx = left.kind === 'break' ? x1 : x2
    const h = T + L + 6
    els.push(
      <path
        key="brk"
        d={`M${bx - 3} ${y - 4} l6 ${h * 0.3} l-6 ${h * 0.4} l6 ${h * 0.3}`}
        fill="none"
        stroke={C.dim}
        strokeWidth="1"
      />
    )
  }

  hl.forEach((h, i) =>
    els.push(<rect key={'hl' + i} x={h.from} y={h.y ?? y - 8} width={h.to - h.from} height={h.h ?? T + L + 16} rx="3" fill={h.c || 'rgba(208,168,79,0.16)'} stroke={h.stroke || C.brass} strokeWidth="0.9" strokeDasharray="3 3" />)
  )
  return <g>{els}</g>
}

// Side view of a tang buckle with its bar inside the fold at (cx, cy).
export function BuckleSide({ cx, cy, r, s, T, metal = 'steel' }) {
  const L = 15 * s
  const fill = metal === 'brass' ? 'url(#sk-brassG)' : 'url(#sk-steel)'
  const ft = Math.max(3, r * 0.55)
  return (
    <g>
      <rect x={cx} y={cy - ft / 2} width={L} height={ft} rx={ft / 2} fill={fill} stroke="#3b4850" strokeWidth="0.7" />
      <rect x={cx + L - ft} y={cy - ft * 1.6} width={ft * 1.4} height={ft * 2.6} rx={ft * 0.6} fill={fill} stroke="#3b4850" strokeWidth="0.7" />
      <BarEnd cx={cx} cy={cy} r={r * 0.9} />
      {/* tongue: from the bar, out through the slot, resting on the frame */}
      <path d={`M${cx} ${cy} Q${cx + L * 0.25} ${cy - r - T - 3} ${cx + L * 0.55} ${cy - r - T - 2} L${cx + L - ft * 0.2} ${cy - ft * 1.4}`} fill="none" stroke="#d9e3e9" strokeWidth="2.6" strokeLinecap="round" />
    </g>
  )
}
