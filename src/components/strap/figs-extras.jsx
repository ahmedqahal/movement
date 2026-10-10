// Strap diagrams — extras (premium-maker additions). See AUTHORING.md.
//
// New steps added across existing lessons: front-loaded taper, middle-hole
// rule and the five-colour system (sm-design); choosing the edge colour
// (sm-edgepaint); commercial hole ladders (sm-holes); lug-end fitting —
// over-bar thickness, top-loading, curved ends, thin lug ends, exposed
// return flap, closed lug end (sm-folds); the antique finish (sm-finish);
// the corded edge (sm-remborde); inverted shell cordovan (sm-exotic).
//
// Local helpers are copied from neighbouring files (VDim/HDim, Magnifier
// from figs-materials; Lb, Panel, BreakV, foldPaths/Fold from figs-finish).
import { useId } from 'react'
import { C, FONT, MONO, Fig, T, Note, Lead, Dim, Arrow, Num, Verdict, Tag, Sep } from './kit.jsx'
import { StrapPlan, BarEnd, Buckle, SpringBar, Wrist } from './parts.jsx'
import { LONG, SHORT, outline, offset, runBetween, resample, pathOf, px, widthAt } from './geom.js'
import { Knife, Dauber, Applicator, Calipers, Brush, Awl, Iron, Needle, Rule } from './tools.jsx'

/* ------------------------------------------------------------------ */
/* Local helpers                                                        */
/* ------------------------------------------------------------------ */
const uid = () => useId().replace(/[^a-zA-Z0-9]/g, '')
const f1 = (v) => (Math.round(v * 10) / 10).toString()
const P = (pts, close) => pts.map((p, i) => `${i ? 'L' : 'M'}${f1(p[0])} ${f1(p[1])}`).join(' ') + (close ? ' Z' : '')
const LIGHT = '#f6ead6' // text on leather

// deterministic pseudo-random, so renders are stable
function rng(seed = 1) {
  let s = (seed * 7919 + 104729) % 233280
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// Vertical dimension with the figure written level.
function VDim({ x, y1, y2, text, side = 'r', c = C.dim, s = 10.5, from, ty }) {
  const short = Math.abs(y2 - y1) < 18
  const d = side === 'r' ? 1 : -1
  const g = from == null ? 0 : Math.sign(x - from)
  return (
    <g>
      {from != null && (
        <g stroke={c} strokeWidth="0.6" opacity="0.6">
          <line x1={from + g * 2} y1={y1} x2={x + g * 3} y2={y1} />
          <line x1={from + g * 2} y1={y2} x2={x + g * 3} y2={y2} />
        </g>
      )}
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={c} strokeWidth="0.85" markerStart={short ? undefined : 'url(#sk-a-dim)'} markerEnd={short ? undefined : 'url(#sk-a-dim)'} />
      {short && (
        <g stroke={c} strokeWidth="1.1">
          <line x1={x - 3} y1={y1} x2={x + 3} y2={y1} />
          <line x1={x - 3} y1={y2} x2={x + 3} y2={y2} />
        </g>
      )}
      {text && (
        <text x={x + d * 5} y={ty ?? (y1 + y2) / 2 + s * 0.36} fontSize={s} fill={c} fontFamily={MONO} textAnchor={d > 0 ? 'start' : 'end'}>
          {text}
        </text>
      )}
    </g>
  )
}

// Horizontal dimension with the figure centred above (or below) it.
function HDim({ x1, x2, y, text, below, c = C.dim, s = 10.5, ext }) {
  const short = Math.abs(x2 - x1) < 22
  return (
    <g>
      {ext != null && (
        <g stroke={c} strokeWidth="0.6" opacity="0.6">
          <line x1={x1} y1={ext} x2={x1} y2={y + Math.sign(y - ext) * 3} />
          <line x1={x2} y1={ext} x2={x2} y2={y + Math.sign(y - ext) * 3} />
        </g>
      )}
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={c} strokeWidth="0.85" markerStart={short ? undefined : 'url(#sk-a-dim)'} markerEnd={short ? undefined : 'url(#sk-a-dim)'} />
      {short && (
        <g stroke={c} strokeWidth="1.1">
          <line x1={x1} y1={y - 3} x2={x1} y2={y + 3} />
          <line x1={x2} y1={y - 3} x2={x2} y2={y + 3} />
        </g>
      )}
      {text && (
        <text x={(x1 + x2) / 2} y={below ? y + s + 2 : y - 4} fontSize={s} fill={c} fontFamily={MONO} textAnchor="middle">
          {text}
        </text>
      )}
    </g>
  )
}

// Width tick: a short vertical dim across a piece with its figure above it.
function WDim({ x, y1, y2, text, c = C.text, s = 10.5, below }) {
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={c} strokeWidth="0.8" markerStart="url(#sk-a-dim)" markerEnd="url(#sk-a-dim)" opacity="0.9" />
      <text x={x} y={below ? y2 + s + 3 : y1 - 5} fontSize={s} fill={c} fontFamily={MONO} textAnchor="middle">
        {text}
      </text>
    </g>
  )
}

// Leader (from figs-finish): a centred label never has its line run into it.
function Lb({ p, t, text, sub, a, c = C.text, s = 11, subc = C.faint, dot = true }) {
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
        <text x={tx} y={t[1] + 4 + s + 2} textAnchor={anchor} fontSize={Math.max(10, s - 1.5)} fill={subc} fontFamily={FONT}>
          {sub}
        </text>
      )}
    </g>
  )
}

// Pass / fail panel frame.
function Panel({ x, y, w, h, title, ok, c, tc }) {
  const col = c || (ok === undefined ? C.line : ok ? 'rgba(123,165,131,0.55)' : 'rgba(194,88,99,0.55)')
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill="rgba(255,255,255,0.025)" stroke={col} strokeWidth="1" />
      {title && (
        <Tag x={x + 10} y={y + 18} c={tc}>
          {title}
        </Tag>
      )}
      {ok !== undefined && <Verdict x={x + w - 16} y={y + 16} ok={ok} r={8.5} />}
    </g>
  )
}

const BreakV = ({ x, y1, y2 }) => (
  <path d={`M${x + 2} ${y1} l-4 ${(y2 - y1) * 0.3} l4 ${(y2 - y1) * 0.4} l-4 ${(y2 - y1) * 0.3}`} fill="none" stroke={C.dim} strokeWidth="1" />
)

// Magnified detail: ring on (fx, fy), round window at (cx, cy) showing the
// same drawing (children) k times larger.
function Magnifier({ cx, cy, r, fx, fy, k = 3, children, lc = C.brass, label, ly }) {
  const id = uid()
  const rr = r / k
  const dx = cx - fx
  const dy = cy - fy
  const L = Math.hypot(dx, dy) || 1
  const ux = dx / L
  const uy = dy / L
  return (
    <g>
      <circle cx={fx} cy={fy} r={rr} fill="none" stroke={lc} strokeWidth="1" strokeDasharray="2 2" />
      <line x1={fx + ux * rr} y1={fy + uy * rr} x2={cx - ux * r} y2={cy - uy * r} stroke={lc} strokeWidth="0.8" strokeDasharray="2 2" />
      <clipPath id={`mg${id}`}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <circle cx={cx} cy={cy} r={r} fill={C.ground} />
      <g clipPath={`url(#mg${id})`}>
        <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-fx} ${-fy})`}>{children}</g>
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={lc} strokeWidth="1.3" />
      <text x={cx + r * 0.72} y={cy - r * 0.78} fontSize="9.5" fill={lc} fontFamily={MONO}>
        ×{k}
      </text>
      {label && (
        <text x={cx} y={ly ?? cy + r + 14} fontSize="10.5" fill={C.dim} textAnchor="middle" fontFamily={FONT}>
          {label}
        </text>
      )}
    </g>
  )
}

// A piece outline filled with a flat colour (plan), optional texture and rim.
function Piece({ T: tr, o, fill, rim, rimW = 2.6, stroke = '#1d150e', pebble, seed = 3, clipId, op }) {
  const id = uid()
  const d = pathOf(outline(o), tr)
  const R = rng(seed)
  const dots = []
  if (pebble) {
    const [x1] = px(tr, o.x0, 0)
    const [x2] = px(tr, o.x1, 0)
    const h = (Math.max(o.w0, o.w1) / 2) * tr.s
    for (let x = x1 + 2; x < x2; x += 4.2) {
      for (let y = tr.y - h; y < tr.y + h; y += 3.8) {
        dots.push(<circle key={`${f1(x)}-${f1(y)}`} cx={f1(x + R() * 3)} cy={f1(y + R() * 3)} r={f1(0.6 + R() * 0.7)} fill={pebble} />)
      }
    }
  }
  return (
    <g opacity={op}>
      <clipPath id={clipId || `pc${id}`}>
        <path d={d} />
      </clipPath>
      <path d={d} fill={fill} stroke={stroke} strokeWidth="0.8" />
      {pebble && <g clipPath={`url(#${clipId || `pc${id}`})`}>{dots}</g>}
      {rim && <path d={d} fill="none" stroke={rim} strokeWidth={rimW} strokeLinejoin="round" />}
    </g>
  )
}

// Saddle stitches along an open polyline given in mm (piece coords).
function SeamRun({ T: tr, pts, p = 2.8, c = C.thread, w = 1.4, halo = '#7d6845' }) {
  const st = resample(pts, p)
  return (
    <g>
      {st.map(({ p: q, tan }, i) => {
        const nxt = st[i + 1]
        if (!nxt) return null
        const [x, y] = px(tr, q[0], q[1])
        const [x2, y2] = px(tr, nxt.p[0], nxt.p[1])
        const nx = -tan[1] * 0.42 * tr.s
        const ny = tan[0] * 0.42 * tr.s
        const ln = { x1: x + (x2 - x) * 0.14 - nx, y1: y + (y2 - y) * 0.14 - ny, x2: x + (x2 - x) * 0.86 + nx, y2: y + (y2 - y) * 0.86 + ny }
        return (
          <g key={i}>
            {halo && <line {...ln} stroke={halo} strokeWidth={w + 1.4} strokeLinecap="round" />}
            <line {...ln} stroke={c} strokeWidth={w} strokeLinecap="round" />
          </g>
        )
      })}
    </g>
  )
}

/* ================================================================== */
/* sm-design                                                            */
/* ================================================================== */

/* Variant · front-loaded taper */
function FrontLoad() {
  const s = 2.6
  const x0 = 50
  const oA = LONG({ x1: 115, w1: 16, taper: [8, 95] })
  const oB = LONG({ x1: 115, w1: 16, taper: [8, 48] })
  const holes = [53, 59, 65, 71, 77, 83, 89]
  const TA = { x: x0, y: 84, s }
  const TB = { x: x0, y: 202, s }
  const X = (v) => x0 + v * s
  const wA = (x) => widthAt(x, oA)
  const fmt = (v) => (Math.round(v * 10) / 10).toFixed(1)
  return (
    <Fig h={340} view="Plan · long piece, 20 → 16, two tapers" scale="×2.6 · lower ×1.2">
      {/* A — straight */}
      <Tag x={14} y={38}>A · straight taper to the tip</Tag>
      <StrapPlan T={TA} o={oA} centre holes={{ xs: holes }} />
      <SpringBar x={x0} y1={TA.y - 31} y2={TA.y + 31} r={2.2} />
      {[holes[0], holes[6]].map((h) => (
        <WDim key={h} x={X(h) - 8} y1={TA.y - (wA(h) / 2) * s} y2={TA.y + (wA(h) / 2) * s} text={fmt(wA(h))} c={C.ruby} />
      ))}
      <VDim x={38} y1={TA.y - 10 * s} y2={TA.y + 10 * s} side="l" text="20" />
      <VDim x={372} y1={TA.y - 8 * s} y2={TA.y + 8 * s} text="16" from={X(101)} />
      <T x={X(71)} y={TA.y + 42} a="middle" s={10.5} c={C.ruby}>
        the width the keepers grip changes from hole to hole
      </T>

      {/* B — front-loaded */}
      <Sep x1={14} y1={140} x2={466} y2={140} />
      <Tag x={14} y={158}>B · front-loaded (A dashed)</Tag>
      <StrapPlan T={TB} o={oB} centre holes={{ xs: holes }} />
      <path d={pathOf(outline(oA), TB)} fill="none" stroke={C.brass} strokeWidth="1" strokeDasharray="4 3" opacity="0.9" />
      <SpringBar x={x0} y1={TB.y - 31} y2={TB.y + 31} r={2.2} />
      {[holes[0], holes[6]].map((h) => (
        <WDim key={h} x={X(h) - 8} y1={TB.y - 8 * s} y2={TB.y + 8 * s} text="16.0" c={C.emerald} />
      ))}
      <VDim x={38} y1={TB.y - 10 * s} y2={TB.y + 10 * s} side="l" text="20" />
      <HDim x1={x0} x2={X(48)} y={TB.y + 36} text="45–50" below ext={TB.y + 22} />
      <HDim x1={X(48)} x2={X(115)} y={TB.y + 36} text="16, parallel to the tip" below ext={TB.y + 22} />
      <Lb p={[X(108), TB.y + 8]} t={[388, 226]} text="tip stays full" a="start" s={10.5} />
      <T x={466} y={158} a="end" s={10.5} c={C.emerald}>
        the keepers grip 16 at every hole
      </T>

      {/* one buckle, four lug widths */}
      <Sep x1={14} y1={262} x2={466} y2={262} />
      <Tag x={14} y={278}>One 16 mm buckle for 18–21 mm lugs</Tag>
      {[
        [21, 5],
        [20, 4],
        [19, 3],
        [18, 2],
      ].map(([w, t], i) => {
        const col = i % 2
        const row = Math.floor(i / 2)
        const tr = { x: 30 + col * 222, y: 297 + row * 27, s: 1.2 }
        const o = LONG({ x0: 0, x1: 70, w0: w, w1: 16, taper: [6, 48], tip: 'square' })
        return (
          <g key={w}>
            <StrapPlan T={tr} o={o} />
            <BreakV x={tr.x + 70 * 1.2} y1={tr.y - 12} y2={tr.y + 12} />
            <T x={tr.x + 70 * 1.2 + 10} y={tr.y + 4} s={10.5} mono c={C.text}>
              {w} → 16
            </T>
            <T x={tr.x + 70 * 1.2 + 64} y={tr.y + 4} s={10} c={C.faint}>
              taper {t}
            </T>
          </g>
        )
      })}
    </Fig>
  )
}

/* Place the middle hole: ≈ 0.6 L, seven holes at 6 mm */
function MidHole() {
  const s = 2.4
  const x0 = 70
  const rows = [
    [105, 63, '0.60'],
    [115, 71, '0.62'],
    [125, 81, '0.65'],
  ]
  return (
    <Fig h={340} view="Plan · long pieces, aligned at the bar" scale="×2.4 · strip ×2.6">
      {rows.map(([L, m, r], i) => {
        const yc = 56 + i * 72
        const tr = { x: x0, y: yc, s }
        const xs = [-18, -12, -6, 0, 6, 12, 18].map((d) => m + d)
        const X = (v) => x0 + v * s
        return (
          <g key={L}>
            <StrapPlan T={tr} o={LONG({ x1: L, taper: [8, L - 20] })} centre holes={{ xs }} />
            <SpringBar x={x0} y1={yc - 28} y2={yc + 28} r={2} />
            <circle cx={X(m)} cy={yc} r={6} fill="none" stroke={C.emerald} strokeWidth="1.5" />
            <line x1={x0 + 3} y1={yc - 9} x2={X(m)} y2={yc - 9} stroke={C.emerald} strokeWidth="1" markerStart="url(#sk-a-emerald)" markerEnd="url(#sk-a-emerald)" />
            <line x1={X(m)} y1={yc - 9} x2={X(m)} y2={yc - 6} stroke={C.emerald} strokeWidth="1" />
            <T x={x0 + (X(m) - x0) * 0.42} y={yc - 13} a="middle" s={10.5} mono c={LIGHT}>
              {m} = {r} L
            </T>
            <T x={14} y={yc + 1} s={13} w="600" c={C.text}>
              {L}
            </T>
            <T x={14} y={yc + 15} s={10} c={C.faint}>
              L, mm
            </T>
            <HDim x1={X(xs[0])} x2={X(xs[6])} y={yc + 32} text="6 × 6" below ext={yc + 4} />
            <HDim x1={X(xs[6])} x2={X(L)} y={yc + 32} text={String(L - xs[6])} below ext={yc + 4} />
          </g>
        )
      })}
      <Note x={404} y={52} head="Rule" hc={C.text} lines={['middle hole', '≈ 0.6 of the', 'long piece,', 'then 6 mm', 'each way', '', 'last hole', '≈ 25 from', 'the tip']} s={10.5} lh={14} />

      {/* fit target */}
      <Sep x1={14} y1={258} x2={466} y2={258} />
      <Tag x={14} y={274}>Fit target · pin in hole 3–5 of 7</Tag>
      {(() => {
        const ss = 2.6
        const tr = { x: 86 - 34 * ss, y: 308, s: ss }
        const xs = [40, 46, 52, 58, 64, 70, 76]
        const X = (v) => tr.x + v * ss
        return (
          <g>
            <StrapPlan T={tr} o={{ x0: 34, x1: 82, w0: 18, w1: 18, taper: [0, 82], tip: 'square' }} holes={{ xs }} />
            <BreakV x={X(34)} y1={tr.y - 26} y2={tr.y + 26} />
            <BreakV x={X(82)} y1={tr.y - 26} y2={tr.y + 26} />
            <rect x={X(49)} y={tr.y - 27} width={X(67) - X(49)} height={54} rx="4" fill="rgba(123,165,131,0.14)" stroke={C.emerald} strokeWidth="1.1" strokeDasharray="3 2" />
            {xs.map((x, i) => (
              <T key={x} x={X(x)} y={tr.y - 9} a="middle" s={10} mono c={i >= 2 && i <= 4 ? '#e8f3e6' : LIGHT}>
                {i + 1}
              </T>
            ))}
            <T x={X(58)} y={tr.y + 19} a="middle" s={10} c="#e8f3e6">
              target
            </T>
            <T x={X(34) - 8} y={tr.y - 2} a="end" s={10} c={C.dim}>
              tighter
            </T>
            <T x={X(34) - 8} y={tr.y + 11} a="end" s={10} c={C.faint}>
              bar side
            </T>
            <T x={X(82) + 8} y={tr.y - 2} s={10} c={C.dim}>
              looser
            </T>
            <T x={X(82) + 8} y={tr.y + 11} s={10} c={C.faint}>
              tip side
            </T>
            <Note x={296} y={286} s={10.5} lh={13.5} head="Lengths decide the fit" hc={C.text} lines={['pin near the bar: next size', 'shorter; near the tip: next', 'size longer. Keep 7 holes.']} />
          </g>
        )
      })()}
    </Fig>
  )
}

/* Design the colour system: five zones, tonal and two-tone */
const SCHEMES = {
  tonal: {
    title: 'Tonal',
    top: '#7a5331',
    pebble: null,
    lining: '#d9c4a0',
    thread: '#a57b4f',
    edge: '#5b3b20',
    keeper: '#7a5331',
    chips: [
      ['top', 'brown calf'],
      ['lining', 'natural'],
      ['thread', '= the top'],
      ['edge', '= the top'],
      ['keepers', 'same leather'],
    ],
  },
  two: {
    title: 'Two-tone',
    top: '#4a4a4d',
    pebble: 'rgba(18,18,20,0.32)',
    lining: '#141415',
    thread: '#dedcd4',
    edge: '#d4d2ca',
    keeper: '#a7a6a2',
    chips: [
      ['top', 'dark-grey chèvre'],
      ['lining', 'black'],
      ['thread', 'pearl grey'],
      ['edge', 'pearl = thread'],
      ['keepers', 'light-grey leather'],
    ],
  },
}
function SchemeRow({ k, y, labels, cap = 'across the width' }) {
  const sc = SCHEMES[k]
  const s = 1.9
  const tr = { x: 30, y: y + 52, s }
  const o = SHORT({ x1: 75, w1: 16 })
  const X = (v) => tr.x + v * s
  const keeper = (x, w = 5) => {
    const h = widthAt(x, o) / 2 + 1.2
    return <rect x={X(x - w / 2)} y={tr.y - h * s} width={w * s} height={2 * h * s} rx="2.5" fill={sc.keeper} stroke={sc.edge} strokeWidth="1.5" />
  }
  // section across the width
  const sx = 226
  const sy = y + 44
  const sw = 78
  const tT = 10
  const tL = 7
  const yb = sy + tT + tL
  return (
    <g>
      <Tag x={14} y={y + 14} c={C.text}>
        {sc.title}
      </Tag>
      <Piece T={tr} o={o} fill={sc.top} pebble={sc.pebble} seed={k === 'two' ? 5 : 2} />
      <StrapPlan T={tr} o={o} face="none" stitch={{ m: 2.6, p: 2.6, from: 5, to: 61, c: sc.thread, w: 1.3 }} />
      <path d={pathOf(outline(o), tr)} fill="none" stroke={sc.edge} strokeWidth="2.4" />
      {keeper(63)}
      {keeper(53)}
      <Buckle x={X(75)} y={tr.y} w={16 * s} L={16 * s} />
      <SpringBar x={tr.x} y1={tr.y - 23} y2={tr.y + 23} r={1.8} />

      {/* the section */}
      <rect x={sx} y={sy} width={sw} height={tT} rx="1" fill={sc.top} stroke="#6b6358" strokeWidth="0.6" />
      <rect x={sx} y={sy + tT} width={sw} height={tL} rx="1" fill={sc.lining} stroke="#6b6358" strokeWidth="0.6" />
      {[sx, sx + sw].map((ex, i) => (
        <path key={i} d={`M${ex + (i ? -2 : 2)} ${sy - 1} Q${ex + (i ? 5 : -5)} ${(sy + yb) / 2} ${ex + (i ? -2 : 2)} ${yb + 1}`} fill="none" stroke={sc.edge} strokeWidth="3.4" strokeLinecap="round" />
      ))}
      {[sx + 11, sx + sw - 11].map((tx) => (
        <g key={tx}>
          <line x1={tx} y1={sy - 2} x2={tx} y2={yb + 2} stroke={sc.thread} strokeWidth="1.4" />
          <ellipse cx={tx} cy={sy - 1.5} rx="3.4" ry="1.6" fill={sc.thread} />
          <ellipse cx={tx} cy={yb + 1.5} rx="3.4" ry="1.6" fill={sc.thread} />
        </g>
      ))}
      <T x={sx + sw / 2} y={sy - 10} a="middle" s={10} c={C.faint}>
        {cap}
      </T>

      {/* the five chips */}
      {sc.chips.map(([zone, name], i) => {
        const cy = y + 26 + i * 16
        const fill = [sc.top, sc.lining, sc.thread, sc.edge, sc.keeper][i]
        return (
          <g key={zone}>
            <rect x={322} y={cy - 6} width={13} height={10} rx="2" fill={fill} stroke="#8a7f6e" strokeWidth="0.6" />
            <T x={340} y={cy + 3} s={10.5} c={C.text}>
              {zone}
            </T>
            <T x={386} y={cy + 3} s={10} c={C.dim}>
              {name}
            </T>
          </g>
        )
      })}
      {labels && (
        <g>
          <Lb p={[X(30), tr.y + 15.2 * s / 2 + 0.6]} t={[40, y + 100]} text="edge paint" a="start" s={10.5} />
          <Lb p={[X(44), tr.y + 5.6 * s]} t={[124, y + 100]} text="thread" a="start" s={10.5} />
          <Lb p={[X(63), tr.y + 9.4 * s]} t={[178, y + 100]} text="keepers" a="start" s={10.5} />
          <Lb p={[sx + sw / 2, sy + tT + tL / 2]} t={[236, y + 100]} text="lining" a="start" s={10.5} />
        </g>
      )}
    </g>
  )
}
function TwoTone() {
  const two = SCHEMES.two
  return (
    <Fig h={340} view="Design · the five colour zones" scale="plan ×1.9 · schematic">
      <SchemeRow k="tonal" y={24} />
      <Sep x1={14} y1={122} x2={466} y2={122} />
      <SchemeRow k="two" y={128} labels cap="pearl on both faces" />

      <Sep x1={14} y1={244} x2={466} y2={244} />
      <Tag x={14} y={262}>Swap pair</Tag>
      {(() => {
        const a = { x: 20, y: 290, s: 1.2 }
        const b = { x: 20, y: 318, s: 1.2 }
        const oL = LONG({ x1: 115, w1: 16, taper: [8, 48] })
        const oS = SHORT({ x1: 75, w1: 16 })
        return (
          <g>
            <Piece T={a} o={oL} fill={two.top} rim={two.edge} rimW={1.6} />
            <StrapPlan T={a} o={oL} face="none" stitch={{ m: 2.6, p: 3.2, from: 5, to: 112, c: two.thread, w: 1.1 }} />
            <Piece T={b} o={oS} fill={two.keeper} rim={two.top} rimW={1.6} />
            <StrapPlan T={b} o={oS} face="none" stitch={{ m: 2.6, p: 3.2, from: 5, to: 72, c: two.top, w: 1.1 }} />
            <T x={170} y={296} s={10.5} c={C.text}>
              each piece in one colour,
            </T>
            <T x={170} y={310} s={10.5} c={C.text}>
              stitched in the other’s
            </T>
          </g>
        )
      })()}
      <Sep x1={316} y1={252} x2={316} y2={336} />
      <Note x={328} y={266} s={10.5} lh={14} head="Saddle stitch" hc={C.text} lines={['one thread colour on', 'both faces: the pearl', 'shows on the black', 'lining too']} />
    </Fig>
  )
}

/* ================================================================== */
/* sm-edgepaint                                                         */
/* ================================================================== */

// A strap end in oblique view: top face above, the cut edge as a band below.
function EdgeSlab({ x, y, L = 112, W = 34, t = 13, top, edge, thread, layer, core, tip = true, label }) {
  const ox = W * 0.42
  const oy = W * 0.5
  const tipR = W * 0.5
  // top face: parallelogram with a rounded far end
  const face = `M${x} ${y} L${x + L} ${y} Q${x + L + tipR * 0.9} ${y - oy * 0.5} ${x + L + ox} ${y - oy} L${x + ox} ${y - oy} Z`
  const faceSq = `M${x} ${y} L${x + L} ${y} L${x + L + ox} ${y - oy} L${x + ox} ${y - oy} Z`
  return (
    <g>
      <path d={tip ? face : faceSq} fill={top} stroke="#140d07" strokeWidth="0.8" />
      {thread && (
        <path d={`M${x + 4 + ox * 0.18} ${y - oy * 0.18} L${x + L - 4 + ox * 0.18} ${y - oy * 0.18}`} stroke={thread} strokeWidth="1.5" strokeDasharray="4 2.2" />
      )}
      <rect x={x} y={y} width={L} height={t} fill={edge} stroke="#140d07" strokeWidth="0.8" />
      {core && <rect x={x} y={y} width={L} height={1.6} fill={core} />}
      {layer && <line x1={x} y1={y + t * 0.58} x2={x + L} y2={y + t * 0.58} stroke={layer} strokeWidth="0.8" />}
      {tip && <path d={`M${x + L} ${y} Q${x + L + tipR * 0.9} ${y - oy * 0.5} ${x + L + ox} ${y - oy} L${x + L + ox} ${y - oy + t} Q${x + L + tipR * 0.9} ${y - oy * 0.5 + t} ${x + L} ${y + t} Z`} fill={edge} stroke="#140d07" strokeWidth="0.8" />}
      <path d={`M${x + 2} ${y - oy - 3} l-4 ${(oy + t + 6) * 0.3} l4 ${(oy + t + 6) * 0.4} l-4 ${(oy + t + 6) * 0.3}`} fill="none" stroke={C.dim} strokeWidth="1" />
      {label && (
        <T x={x + L / 2} y={y + t + 16} a="middle" s={10.5} c={C.text}>
          {label}
        </T>
      )}
    </g>
  )
}
function EdgeColour() {
  const panels = [
    { title: 'Matched', top: '#a06f3c', edge: '#7e5328', thread: '#c9a273', l1: 'edge = top', l2: 'a quiet strap', l3: 'tonal with the face' },
    { title: 'Darker', top: '#c0915c', edge: '#2a1b12', thread: '#efe3cb', l1: '1–2 shades darker', l2: 'frames a light leather', l3: 'hazel top: edge near black' },
    { title: 'Thread-matched', top: '#2f4a3b', edge: '#e9dfc8', thread: '#e9dfc8', l1: 'edge = thread', l2: 'the two-tone scheme', l3: 'not the leather colour' },
  ]
  return (
    <Fig h={340} view="Oblique view · strap end, face and edge" scale="schematic">
      {panels.map((p, i) => {
        const x = 14 + i * 152
        return (
          <g key={p.title}>
            <Panel x={x} y={28} w={144} h={152} title={p.title} />
            <EdgeSlab x={x + 12} y={90} L={92} W={40} t={14} top={p.top} edge={p.edge} thread={p.thread} />
            <rect x={x + 12} y={116} width={11} height={9} rx="1.5" fill={p.top} stroke="#8a7f6e" strokeWidth="0.6" />
            <T x={x + 27} y={124} s={10} c={C.dim}>
              top
            </T>
            <rect x={x + 60} y={116} width={11} height={9} rx="1.5" fill={p.edge} stroke="#8a7f6e" strokeWidth="0.6" />
            <T x={x + 75} y={124} s={10} c={C.dim}>
              edge
            </T>
            <T x={x + 12} y={143} s={10.5} c={C.text}>
              {p.l1}
            </T>
            <T x={x + 12} y={157} s={10} c={C.faint}>
              {p.l2}
            </T>
            <T x={x + 12} y={171} s={10} c={C.faint}>
              {p.l3}
            </T>
          </g>
        )
      })}

      {/* pigment finish with a different core */}
      <Tag x={14} y={200}>Pigment finish, different core</Tag>
      <EdgeSlab x={22} y={240} L={96} W={26} t={11} top="#2d4f86" edge="#b8743c" core="#2d4f86" thread="#e8e0cc" />
      <Verdict x={136} y={216} ok={false} r={8} />
      <T x={22} y={270} s={10.5} c={C.ruby}>
        cut edge shows the core
      </T>
      <EdgeSlab x={22} y={304} L={96} W={26} t={11} top="#2d4f86" edge="#2a4677" thread="#e8e0cc" />
      <Verdict x={136} y={282} ok r={8} />
      <T x={22} y={334} s={10.5} c={C.emerald}>
        paint every cut edge
      </T>
      <Lb p={[70, 245]} t={[160, 254]} text="cognac core" a="start" s={10} c={C.dim} />
      <Lb p={[44, 233]} t={[160, 234]} text="blue pigment skin" a="start" s={10} c={C.dim} />

      <Sep x1={262} y1={192} x2={262} y2={334} />
      {/* test stripe */}
      <Tag x={276} y={200}>Test a stripe on an offcut</Tag>
      <g transform="translate(0 10)">
      <path d="M282 214 Q300 206 330 210 L436 208 Q456 214 452 240 L448 270 Q420 280 380 274 L300 278 Q280 268 284 244 Z" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.9" />
      <path d="M298 236 L352 236" stroke="#4b2f19" strokeWidth="10" strokeLinecap="round" />
      <path d="M300 232.5 L350 232.5" stroke="#fff3da" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      <Arrow a={[362, 236]} b={[384, 236]} w={1.4} />
      <path d="M396 236 L438 236" stroke="#73502f" strokeWidth="10" strokeLinecap="round" />
      <T x={325} y={260} a="middle" s={10.5} c={LIGHT}>
        wet
      </T>
      <T x={417} y={260} a="middle" s={10.5} c={LIGHT}>
        dry
      </T>
      </g>
      <Note x={276} y={304} s={10.5} lh={14} head="Mix, stripe, let it dry" hc={C.text} lines={['it dries lighter or darker:', 'judge it against the top dry']} />
    </Fig>
  )
}

/* ================================================================== */
/* sm-holes                                                             */
/* ================================================================== */

/* Commercial hole ladders to scale on the same 16 mm tip */
function Ladders() {
  const s = 3
  const xt = 360 // tip x
  const X = (d) => xt - d * s // d = mm from the tip
  const o = { x0: 40, x1: 120, w0: 16, w1: 16, taper: [0, 120], tip: 'ogive', tipLen: 12 }
  const rows = [
    { n: 8, p: 5, last: 33 },
    { n: 6, p: 6.6, last: 30 },
    { n: 7, p: 7.3, last: 24 },
  ]
  return (
    <Fig h={340} view="Chart · three commercial ladders, one 16 mm tip" scale="true scale ×3">
      {/* axis */}
      <T x={xt + 8} y={44} s={10} c={C.faint}>
        mm from the tip
      </T>
      {Array.from({ length: 9 }, (_, i) => {
        const d = i * 10
        return (
          <g key={d}>
            <line x1={X(d)} y1={50} x2={X(d)} y2={292} stroke={C.line} strokeWidth="0.7" strokeDasharray={d ? '2 4' : undefined} />
            <T x={X(d)} y={44} a="middle" s={10} mono c={C.faint}>
              {d}
            </T>
          </g>
        )
      })}
      {rows.map((r, i) => {
        const yc = 84 + i * 82
        const tr = { x: xt - 120 * s, y: yc, s }
        const xs = Array.from({ length: r.n }, (_, k) => 120 - r.last - k * r.p)
        const span = (r.n - 1) * r.p
        const ok = span >= 35 && span <= 45
        return (
          <g key={r.p}>
            <StrapPlan T={tr} o={o} centre holes={{ xs }} />
            <BreakV x={X(80)} y1={yc - 28} y2={yc + 28} />
            <T x={14} y={yc - 2} s={14} w="600" c={C.text}>
              {r.n} × {r.p}
            </T>
            <T x={14} y={yc + 13} s={10} c={C.faint}>
              holes × pitch
            </T>
            <HDim x1={X(r.last + span)} x2={X(r.last)} y={yc + 31} text={`span ${f1(span)}`} below c={ok ? C.emerald : C.dim} ext={yc + 4} />
            <HDim x1={X(r.last)} x2={xt} y={yc + 31} text={`≈ ${r.last}`} below ext={yc + 4} />
            <T x={xt + 10} y={yc - 2} s={10.5} c={C.text}>
              steps of {r.p}
            </T>
            <T x={xt + 10} y={yc + 12} s={10} c={C.faint}>
              last ≈ {r.last} to tip
            </T>
          </g>
        )
      })}
      <Sep x1={14} y1={302} x2={466} y2={302} />
      <Note x={14} y={318} s={10.5} lh={14} head="Measured spans: 33–45 mm" hc={C.emerald} lines={['finer pitch, finer steps · 7 × 6 also seen']} />
      {/* round vs oval */}
      {(() => {
        const cx1 = 262
        const cx2 = 376
        const cy = 320
        return (
          <g>
            <circle cx={cx1} cy={cy} r={7.5} fill={C.hole} stroke="#e7c48f" strokeWidth="0.8" />
            <circle cx={cx1} cy={cy} r={5} fill="url(#sk-barEnd)" stroke="#3b4850" strokeWidth="0.6" />
            <T x={cx1 + 14} y={cy - 2} s={10.5} c={C.text}>
              round hole
            </T>
            <T x={cx1 + 14} y={cy + 11} s={10} c={C.faint}>
              standard tongue
            </T>
            <rect x={cx2 - 13} y={cy - 6} width={26} height={12} rx={6} fill={C.hole} stroke="#e7c48f" strokeWidth="0.8" />
            <rect x={cx2 - 10} y={cy - 2.6} width={20} height={5.2} rx={1.6} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.6" />
            <T x={cx2 + 19} y={cy - 2} s={10.5} c={C.text}>
              oval hole
            </T>
            <T x={cx2 + 19} y={cy + 11} s={10} c={C.faint}>
              wide flat tongue
            </T>
          </g>
        )
      })()}
    </Fig>
  )
}

/* ================================================================== */
/* sm-folds — fitting the lug end to the case                          */
/* ================================================================== */

const TOPC = '#b07d47' // top leather cut face
const GRAIN = '#6f4b27' // grain surface line
const LEDGE = '#4a3018'

// Lug end in longitudinal section, as worn (grain up), built from mm.
// u runs along the strap from the bar centre (+ toward the body), v down
// from the face. s = px/mm along, k = px/mm through the thickness.
// tb top body, tw loop wall, br bar radius, conv where the tail meets the
// top behind the bar, tailT/tailFull/tailEnd the tail and its feather,
// lin lining. linMode 'under' (tail hidden) or 'scarf' (tail exposed, the
// lining's feathered end lapping the tail's feather).
function lugGeom({ cx, cy, s, k = s, tb = 1.2, tw = 0.55, br = 0.9, ramp = 4, conv = 2.6, tailT = 0.55, tailFull = 6, tailEnd = 12, lin = 1.0, uR = 18, linMode = 'under', linFrom, linFeather = 2, bodyT }) {
  const X = (u) => cx + u * s
  const Y = (v) => cy + v * k
  const f = bodyT || ((u) => (u <= 0 ? tw : u >= ramp ? tb : tw + (tb - tw) * (u / ramp)))
  const tk = (u) => (u <= tailFull ? tailT : u >= tailEnd ? 0 : tailT * (1 - (u - tailFull) / (tailEnd - tailFull)))
  const R = br + tw
  const vb = tw + 2 * br
  const vB = 2 * R
  const N = 40
  const run = (a, b, fn) => Array.from({ length: N + 1 }, (_, i) => {
    const u = a + ((b - a) * i) / N
    return [X(u), Y(fn(u))]
  })
  const Lp = (pts) => pts.map(([x, y]) => `L${f1(x)} ${f1(y)}`).join(' ')
  const body = P([[X(0), Y(0)], [X(uR), Y(0)], ...run(uR, 0, f)], true)
  const loop = `M${f1(X(0))} ${f1(Y(0))} A${f1(R * s)} ${f1(R * k)} 0 0 0 ${f1(X(0))} ${f1(Y(vB))} L${f1(X(0))} ${f1(Y(vb))} A${f1(br * s)} ${f1(br * k)} 0 0 1 ${f1(X(0))} ${f1(Y(tw))} Z`
  const fc = f(conv)
  const tail =
    `M${f1(X(0))} ${f1(Y(vb))} C${f1(X(conv * 0.55))} ${f1(Y(vb))} ${f1(X(conv * 0.62))} ${f1(Y(fc))} ${f1(X(conv))} ${f1(Y(fc))} ` +
    Lp(run(conv, tailEnd, f).slice(1)) + ' ' + Lp(run(tailEnd, conv, (u) => f(u) + tk(u)).slice(1)) +
    ` C${f1(X(conv * 0.62))} ${f1(Y(fc + tailT))} ${f1(X(conv * 0.55))} ${f1(Y(vB))} ${f1(X(0))} ${f1(Y(vB))} Z`
  const tailOuter =
    `M${f1(X(0))} ${f1(Y(vB))} C${f1(X(conv * 0.55))} ${f1(Y(vB))} ${f1(X(conv * 0.62))} ${f1(Y(fc + tailT))} ${f1(X(conv))} ${f1(Y(fc + tailT))} ` + Lp(run(conv, tailEnd, (u) => f(u) + tk(u)).slice(1))
  let lining = null
  if (lin > 0) {
    if (linMode === 'scarf') {
      const u0 = tailFull
      const top = run(u0, uR, (u) => f(u) + tk(u))
      const bot = run(uR, u0, () => tb + tailT)
      lining = P([...top, ...bot], true)
    } else {
      const u0 = linFrom ?? conv + 0.4
      const g = (u) => f(u) + tk(u)
      const b = (u) => g(u) + Math.max(0.05, (tb + lin - g(u)) * Math.min(1, (u - u0) / linFeather))
      lining = P([...run(u0, uR, g), ...run(uR, u0, b)], true)
    }
  }
  return { X, Y, f, tk, R, vb, vB, body, loop, tail, tailOuter, lining, bar: [X(0), Y(tw + br)], br, tw, tb, uR, conv }
}
function LugEnd({ g, bar = true, grain = true, lk = 'url(#sk-linS)', tailFill = TOPC, op }) {
  return (
    <g opacity={op}>
      {g.lining && <path d={g.lining} fill={lk} stroke="#8f7b5a" strokeWidth="0.7" strokeLinejoin="round" />}
      <path d={g.tail} fill={tailFill} stroke={LEDGE} strokeWidth="0.7" strokeLinejoin="round" />
      <path d={g.body} fill={TOPC} stroke={LEDGE} strokeWidth="0.7" strokeLinejoin="round" />
      <path d={g.loop} fill={TOPC} stroke={LEDGE} strokeWidth="0.7" strokeLinejoin="round" />
      {grain && (
        <g fill="none" stroke={GRAIN} strokeWidth="1.6" strokeLinecap="round">
          <line x1={g.X(0)} y1={g.Y(0) + 0.8} x2={g.X(g.uR)} y2={g.Y(0) + 0.8} />
          <path d={`M${f1(g.X(0))} ${f1(g.Y(0) + 0.8)} A${f1(g.R * (g.X(1) - g.X(0)) - 0.8)} ${f1(g.R * (g.Y(1) - g.Y(0)) - 0.8)} 0 0 0 ${f1(g.X(0))} ${f1(g.Y(g.vB) - 0.8)}`} />
        </g>
      )}
      {bar && <BarEnd cx={g.bar[0]} cy={g.bar[1]} r={g.br * (g.X(1) - g.X(0)) * 0.97} />}
    </g>
  )
}

// Watch case flank in side view (steel block to the left of x).
function CaseBlock({ x, y1, y2, w = 54, glass = true }) {
  return (
    <g>
      <path d={`M${x - w} ${y1} L${x - 6} ${y1} Q${x} ${y1} ${x} ${y1 + 6} L${x} ${y2 - 6} Q${x} ${y2} ${x - 6} ${y2} L${x - w} ${y2} Z`} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.9" />
      {glass && <path d={`M${x - w} ${y1} Q${x - w * 0.45} ${y1 - 10} ${x - 8} ${y1} Z`} fill="url(#sk-glass)" stroke={C.steel} strokeWidth="0.8" />}
    </g>
  )
}
const LugGhost = ({ d }) => <path d={d} fill="rgba(180,196,206,0.16)" stroke="#9fb4c2" strokeWidth="1" strokeDasharray="4 3" />

/* Measure the strap over the bar: 2.2 body, ≈ 2.8 over the bar */
function OverBar() {
  const s = 18
  const g = lugGeom({ cx: 150, cy: 64, s, tb: 1.2, tw: 0.5, br: 0.9, ramp: 4, conv: 2.4, tailT: 0.5, tailFull: 5, tailEnd: 11, lin: 1.0, uR: 14.8, linFrom: 5.2, linFeather: 2.4 })
  const top = g.Y(0)
  const bot = g.Y(2.8)
  const jx = 84
  return (
    <Fig h={336} view="Section · lug loop, as worn" scale="true scale ×18 · lower schematic">
      <LugEnd g={g} />
      {/* calipers over the loop */}
      <rect x={jx - 8} y={top - 22} width={8} height={bot - top + 46} rx="2" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.7" />
      <path d={`M${jx} ${top - 9} L${g.X(0) + 14} ${top - 9} L${g.X(0) + 20} ${top} L${jx} ${top} Z`} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.7" />
      <path d={`M${jx} ${bot} L${g.X(0) + 8} ${bot} L${g.X(0) + 2} ${bot + 9} L${jx} ${bot + 9} Z`} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.7" />
      <rect x={18} y={(top + bot) / 2 - 12} width={46} height={24} rx="3" fill="#1f2a24" stroke="#3b4850" />
      <T x={41} y={(top + bot) / 2 + 4.5} a="middle" s={12} mono c="#a5d6a7">
        2.8
      </T>
      <T x={41} y={(top + bot) / 2 + 30} a="middle" s={10.5} c={C.text}>
        over
      </T>
      <T x={41} y={(top + bot) / 2 + 43} a="middle" s={10.5} c={C.text}>
        the bar
      </T>
      {/* body thickness */}
      <VDim x={g.X(14.8) + 12} y1={top} y2={g.Y(2.2)} text="2.2" />
      <T x={g.X(14.8) + 12} y={g.Y(2.2) + 16} a="middle" s={10.5} c={C.text}>
        body
      </T>
      <BreakV x={g.X(14.8)} y1={top - 4} y2={g.Y(2.2) + 4} />
      <Lb p={[g.bar[0] + 6, g.bar[1] + 6]} t={[184, 152]} text="bar Ø 1.5–1.8" a="start" s={10.5} c={C.steel} />
      <Lb p={[g.X(-1.15), g.bar[1] + 4]} t={[130, 152]} text="wall ≈ 0.5" sub="(2.8 − 1.8) ÷ 2" a="end" s={10.5} />
      <Lb p={[g.X(8), g.Y(0.6)]} t={[g.X(8), 40]} text="top" a="middle" s={10.5} />
      <Lb p={[g.X(6.5), g.Y(1.45)]} t={[310, 152]} text="tail, under the top" a="start" s={10.5} />
      <Lb p={[g.X(12), g.Y(1.75)]} t={[g.X(11.2), 40]} text="lining" a="middle" s={10.5} />

      {/* the space to the case */}
      <Sep x1={14} y1={176} x2={466} y2={176} />
      {[
        { x0: 14, gap: 1.15, ok: false, title: 'Space sized for 2.2', l1: 'the 2.8 loop jams', l2: 'dashed: a 2.2 envelope would clear' },
        { x0: 244, gap: 1.75, ok: true, title: 'Space sized for 2.8', l1: 'the loop turns', l2: 'clear of the case' },
      ].map((p) => {
        const ss = 13
        const fx = p.x0 + 54
        const cy = 236
        const bx = fx + p.gap * ss
        const h = lugGeom({ cx: bx, cy: cy - 1.4 * ss, s: ss, tb: 1.2, tw: 0.5, br: 0.9, conv: 2.4, tailT: 0.5, tailFull: 5, tailEnd: 9, lin: 1.0, uR: (p.x0 + 206 - bx) / ss, linFrom: 5.2, linFeather: 2 })
        const id = `ob${p.x0}`
        return (
          <g key={p.x0}>
            <Panel x={p.x0} y={184} w={222} h={148} title={p.title} ok={p.ok} />
            <LugEnd g={h} />
            <CaseBlock x={fx} y1={cy - 30} y2={cy + 28} w={40} glass={false} />
            <clipPath id={id}>
              <rect x={fx - 40} y={cy - 40} width={40} height={80} />
            </clipPath>
            {!p.ok && <circle cx={bx} cy={cy} r={1.4 * ss} fill="rgba(194,88,99,0.85)" clipPath={`url(#${id})`} />}
            {!p.ok && <circle cx={bx} cy={cy} r={1.1 * ss} fill="none" stroke={C.emerald} strokeWidth="1.1" strokeDasharray="3 2" />}
            {p.ok && <line x1={fx + 1} y1={cy} x2={bx - 1.4 * ss - 1} y2={cy} stroke={C.emerald} strokeWidth="2.6" />}
            {p.ok && <Lb p={[fx + 3, cy - 1]} t={[fx + 40, 210]} text="clearance" a="start" s={10} c={C.emerald} />}
            <BreakV x={p.x0 + 206} y1={h.Y(0) - 4} y2={h.Y(2.2) + 4} />
            <T x={fx - 20} y={cy + 42} a="middle" s={10} c={C.faint}>
              case
            </T>
            <T x={p.x0 + 12} y={304} s={10.5} c={p.ok ? C.emerald : C.ruby}>
              {p.l1}
            </T>
            <T x={p.x0 + 12} y={318} s={10} c={p.ok ? C.faint : C.emerald}>
              {p.l2}
            </T>
          </g>
        )
      })}
    </Fig>
  )
}

/* Top-loading for low-drilled lugs */
function TopLoad() {
  const s = 7
  const side = (oy, loaded) => {
    const fx = 66
    const bx = 116
    const by = 96 + oy
    const g = lugGeom({ cx: bx, cy: by - 1.45 * s, s, tb: 1.2, tw: 0.55, br: 0.9, conv: 2.6, tailT: 0.55, tailFull: 6, tailEnd: 11, lin: 1.0, uR: (268 - bx) / s, linFrom: 3.4 })
    const face = g.Y(0)
    const lugTop = 73 + oy
    const lugD = `M${fx - 2} ${62 + oy} L${bx + 4} ${lugTop - 2} Q${bx + 14} ${lugTop} ${bx + 14} ${by - 4} Q${bx + 14} ${by + 12} ${bx} ${by + 12} Q${bx - 30} ${by + 12} ${fx - 2} ${by + 8} Z`
    const xA = bx - 1.45 * s
    const xF = 196
    const xE = 246
    const layer = `M${xA} ${face} Q${xA} ${lugTop} ${xA + 10} ${lugTop} L${xF} ${lugTop} L${xE} ${face} Z`
    return (
      <g>
        <CaseBlock x={fx} y1={58 + oy} y2={124 + oy} w={50} />
        <LugEnd g={g} />
        {loaded && (
          <g>
            <path d={layer} fill={TOPC} stroke={LEDGE} strokeWidth="0.8" />
            <path d={layer} fill="rgba(208,168,79,0.28)" />
            <line x1={xA + 8} y1={lugTop + 0.9} x2={xF} y2={lugTop + 0.9} stroke={GRAIN} strokeWidth="1.6" />
            <path d={`M${xA + 6} ${face + 1} L${xE - 6} ${face + 1}`} stroke={C.glue} strokeWidth="2" strokeDasharray="1.2 2.6" strokeLinecap="round" />
          </g>
        )}
        <LugGhost d={lugD} />
        <line x1={fx + 20} y1={lugTop} x2={loaded ? xF + 40 : 168} y2={lugTop} stroke={loaded ? C.emerald : C.ruby} strokeWidth="0.9" strokeDasharray="5 3" />
        <BreakV x={268} y1={face - 4} y2={g.Y(2.2) + 4} />
        <T x={fx - 26} y={128 + oy + 14} a="middle" s={10} c={C.faint}>
          case
        </T>
        {!loaded && <VDim x={174} y1={lugTop} y2={face} text="ears" c={C.ruby} />}
        {loaded && <VDim x={282} y1={face} y2={g.Y(2.2)} text="2.2" />}
        {loaded ? null : <Lb p={[bx + 6, by + 6]} t={[160, 134 + oy]} text="bar hole drilled low and far from the case" a="start" s={10} c={C.dim} />}
        {loaded && <Lb p={[150, lugTop + 6]} t={[76, 124 + oy]} text="extra layer, lug end only" a="start" s={10.5} c={C.brass} />}
        <T x={96} y={by - 14} a="middle" s={10} c={C.dim}>
          lug
        </T>
      </g>
    )
  }
  const front = (oy, loaded) => {
    const cx = 386
    const sp = 4.2
    const lugT = 74 + oy
    const face = loaded ? lugT : lugT + 1.7 * sp * 2
    const th = 2.2 * sp * 2
    return (
      <g>
        <rect x={cx - 72} y={46 + oy} width={144} height={22} rx="5" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
        {[-1, 1].map((sg) => (
          <rect key={sg} x={cx + sg * (10 * sp + 7.5) - 7.5} y={lugT} width={15} height={44} rx="3" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.8" />
        ))}
        {loaded && <rect x={cx - 10 * sp} y={lugT} width={20 * sp} height={face + 1.7 * sp * 2 - lugT} fill={TOPC} stroke={LEDGE} strokeWidth="0.7" />}
        {loaded && <rect x={cx - 10 * sp} y={lugT} width={20 * sp} height={1.7 * sp * 2} fill="rgba(208,168,79,0.28)" />}
        <rect x={cx - 10 * sp} y={loaded ? lugT + 1.7 * sp * 2 : face} width={20 * sp} height={th * 0.55} fill={TOPC} stroke={LEDGE} strokeWidth="0.7" />
        <rect x={cx - 10 * sp} y={(loaded ? lugT + 1.7 * sp * 2 : face) + th * 0.55} width={20 * sp} height={th * 0.45} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
        <line x1={cx - 10 * sp} y1={(loaded ? lugT : face) + 0.8} x2={cx + 10 * sp} y2={(loaded ? lugT : face) + 0.8} stroke={GRAIN} strokeWidth="1.6" />
        {!loaded &&
          [-1, 1].map((sg) => (
            <rect key={sg} x={cx + sg * (10 * sp + 7.5) - 9.5} y={lugT - 2} width={19} height={face - lugT + 4} rx="3" fill="none" stroke={C.ruby} strokeWidth="1.3" />
          ))}
        <line x1={cx - 80} y1={lugT} x2={cx + 80} y2={lugT} stroke={loaded ? C.emerald : C.ruby} strokeWidth="0.9" strokeDasharray="5 3" />
      </g>
    )
  }
  return (
    <Fig h={340} view="Side view + end view · lug end in the lugs" scale="schematic">
      <Tag x={14} y={36}>A · standard strap, low-drilled lugs</Tag>
      <Verdict x={286} y={32} ok={false} r={8} />
      {side(0, false)}
      <Sep x1={14} y1={160} x2={300} y2={160} />
      <Tag x={14} y={178}>B · top-loaded</Tag>
      <Verdict x={286} y={174} ok r={8} />
      {side(140, true)}
      <Magnifier cx={226} cy={306} r={26} fx={222} fy={140 + 96 - 1.45 * 7 - 4} k={3}>
        {side(140, true)}
      </Magnifier>
      <T x={190} y={304} a="end" s={10} c={C.dim}>
        back edge feathered:
      </T>
      <T x={190} y={317} a="end" s={10} c={C.dim}>
        no step shows
      </T>

      <Sep x1={308} y1={28} x2={308} y2={334} />
      <Tag x={320} y={36}>End view, 6 o’clock</Tag>
      {front(0, false)}
      <T x={386} y={150} a="middle" s={10.5} c={C.ruby}>
        lug tips stand proud: “ears”
      </T>
      {front(140, true)}
      <T x={386} y={290} a="middle" s={10.5} c={C.emerald}>
        face flush with the lugs
      </T>
      <Note x={320} y={308} s={10} lh={13} lines={['body stays slim — never', 'thicken the whole strap']} c={C.dim} />
    </Fig>
  )
}

/* Curved ends — only where the case needs them */
function CurvedPanel({ i, kind }) {
  const id = uid()
  const x0 = 14 + i * 152
  const w = 144
  const cx = x0 + w / 2
  const s = 4.2
  const R = 19 * s
  const yEdge = 124
  const cyC = yEdge - R
  const half = 10 * s
  const caseY = (x) => cyC + Math.sqrt(R * R - (x - cx) ** 2)
  // bar curve: y(x) for x in [cx-half, cx+half]
  let barY
  let lugEnd
  if (kind === 'straight') {
    const yb = yEdge + 2.6 * s
    barY = () => yb
    lugEnd = yb + 2.4 * s
  } else if (kind === 'curved') {
    const Rb = R + 2.0 * s
    barY = (x) => cyC + Math.sqrt(Rb * Rb - (x - cx) ** 2)
    lugEnd = caseY(cx + half) + 4.6 * s
  } else {
    const Rb = R + 2.0 * s
    const yb = yEdge + 2.6 * s
    const c0 = yb - Math.sqrt(Rb * Rb - half * half)
    barY = (x) => c0 + Math.sqrt(Rb * Rb - (x - cx) ** 2)
    lugEnd = yb + 2.4 * s
  }
  const n = 24
  const xs = Array.from({ length: n + 1 }, (_, j) => cx - half + (2 * half * j) / n)
  const endPts = xs.map((x) => [x, barY(x) - 1.4 * s])
  const caseArc = xs.map((x) => [x, caseY(x)])
  const yBot = 244
  const strap = P([...endPts, [cx + half, yBot], [cx - half, yBot]], true)
  const gapPoly = P([...caseArc, ...[...endPts].reverse()], true)
  const ok = kind !== 'wrong'
  const lugTop = (x) => caseY(x) - 6
  const titles = { straight: 'Straight bar', curved: 'Curved bar', wrong: 'Wrong pairing' }
  return (
    <g>
      <Panel x={x0} y={28} w={w} h={262} title={titles[kind]} ok={ok} />
      <clipPath id={`cv${id}`}>
        <rect x={x0 + 1} y={56} width={w - 2} height={yEdge - 56} />
      </clipPath>
      <g clipPath={`url(#cv${id})`}>
        <circle cx={cx} cy={cyC} r={R} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.9" />
        <circle cx={cx} cy={cyC} r={R - 7} fill="none" stroke="#6d7f8a" strokeWidth="0.8" />
      </g>
      <path d={gapPoly} fill={ok ? 'rgba(123,165,131,0.6)' : 'rgba(194,88,99,0.6)'} />
      <path d={strap} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.9" />
      <path d={P(xs.map((x) => [x, barY(x)]))} fill="none" stroke="#9fb4c2" strokeWidth="2.4" strokeDasharray="5 3" />
      {[-1, 1].map((sg) => {
        const xa = cx + sg * half
        const xb = cx + sg * (half + 2.6 * s)
        const yTop = Math.min(lugTop(xa), lugTop(xb))
        return <path key={sg} d={`M${Math.min(xa, xb)} ${yTop} L${Math.max(xa, xb)} ${yTop} L${Math.max(xa, xb)} ${lugEnd - 4} Q${(xa + xb) / 2} ${lugEnd + 3} ${Math.min(xa, xb)} ${lugEnd - 4} Z`} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.8" />
      })}
      <path d={`M${x0 + 4} ${yBot + 4} l${w - 8} 0`} stroke="none" />
      <BreakH x1={cx - half - 3} x2={cx + half + 3} y={yBot} />
      {kind === 'curved' && (
        <g>
          <line x1={cx} y1={barY(cx)} x2={cx} y2={yBot - 6} stroke={C.steel} strokeWidth="0.9" strokeDasharray="6 3 1.5 3" />
          <Arrow a={[cx, yBot - 30]} b={[cx, yBot - 6]} c="steel" w={1.2} />
          <T x={cx + 5} y={yBot - 50} s={10} c={LIGHT}>
            bar → tip
          </T>
          <T x={cx + 5} y={yBot - 37} s={10} c={LIGHT}>
            as straight
          </T>
        </g>
      )}
    </g>
  )
}
const BreakH = ({ x1, x2, y }) => {
  const w = x2 - x1
  return <path d={`M${x1} ${y} l${w * 0.3} -3 l${w * 0.4} 6 l${w * 0.3} -3`} fill="none" stroke={C.dim} strokeWidth="1" />
}
function Curved() {
  const notes = [
    ['straight-lug case', 'even, small gap', C.emerald],
    ['short lugs, holes close', 'close, never flush', C.emerald],
    ['straight-lug case', 'the gap grows', C.ruby],
  ]
  return (
    <Fig h={340} view="Plan · case end, from above" scale="×4.2 · gaps exaggerated">
      {['straight', 'curved', 'wrong'].map((k, i) => (
        <CurvedPanel key={k} i={i} kind={k} />
      ))}
      {notes.map(([a, b, c], i) => (
        <g key={i}>
          <T x={14 + i * 152 + 72} y={264} a="middle" s={10.5} c={c}>
            {b}
          </T>
          <T x={14 + i * 152 + 72} y={279} a="middle" s={10} c={C.faint}>
            {a}
          </T>
        </g>
      ))}
      <Note x={14} y={308} s={10.5} lh={14} lines={['Curved ends follow a curved bar, no insert — a flush fit needs a watch-specific insert.', 'Never fit curved ends to a watch that takes straight straps.']} c={C.dim} />
    </Fig>
  )
}

/* Thin lug ends for short lugs */
function ThinLug() {
  const panel = (x0, thin) => {
    const s = 15
    const fx = x0 + 66
    const by = 104
    const gap = 1.42
    const bx = fx + gap * s
    const tw = thin ? 0.25 : 0.7
    const tb = 1.2
    const lin = 1.0
    const bodyT = thin ? (u) => (u <= 0 ? tw : u >= 8 ? tb : tw + (tb - tw) * (u / 8)) : undefined
    const g = lugGeom({ cx: bx, cy: by - (0.9 + tw) * s, s, tb, tw, br: 0.9, ramp: 3, conv: 2.0, tailT: tw, tailFull: 4, tailEnd: 7, lin, uR: (x0 + 212 - bx) / s, linFrom: 3.4, linFeather: 1.6, bodyT })
    const R = (0.9 + tw) * s
    const id = `tl${x0}`
    const lugD = `M${fx - 2} ${by - 22} L${bx + 4} ${by - 19} Q${bx + 13} ${by - 17} ${bx + 13} ${by - 4} Q${bx + 13} ${by + 12} ${bx} ${by + 12} Q${bx - 10} ${by + 12} ${fx - 2} ${by + 9} Z`
    return (
      <g>
        <Panel x={x0} y={28} w={222} h={150} title={thin ? 'Lug end thinned locally' : 'Standard lug end'} ok={thin} />
        <LugEnd g={g} />
        <CaseBlock x={fx} y1={by - 34} y2={by + 22} w={46} />
        <LugGhost d={lugD} />
        <clipPath id={id}>
          <rect x={fx - 46} y={by - 40} width={46} height={80} />
        </clipPath>
        {!thin && <circle cx={bx} cy={by} r={R} fill="rgba(194,88,99,0.85)" clipPath={`url(#${id})`} />}
        {!thin && <path d={`M${bx - R * 0.5} ${by - R * 0.87} A${R} ${R} 0 0 0 ${bx - R * 0.5} ${by + R * 0.87}`} fill="none" stroke={C.ruby} strokeWidth="1.6" />}
        {thin && <line x1={fx + 1} y1={by} x2={bx - R - 1} y2={by} stroke={C.emerald} strokeWidth="2.6" />}
        <BreakV x={x0 + 212} y1={g.Y(0) - 4} y2={g.Y(tb + lin) + 4} />
        <T x={fx - 23} y={by + 36} a="middle" s={10} c={C.faint}>
          case
        </T>
        <T x={x0 + 12} y={164} s={10.5} c={thin ? C.emerald : C.ruby}>
          {thin ? 'clearance to the case' : 'binds: no room to the case'}
        </T>
        {thin && <Lb p={[g.X(4), g.Y(0.35)]} t={[x0 + 140, 58]} text="thinned zone" a="start" s={10} c={C.brass} />}
        {!thin && <Lb p={[bx, by - 3]} t={[x0 + 140, 58]} text="short lug" a="start" s={10} c={C.steel} dot={false} />}
      </g>
    )
  }
  return (
    <Fig h={340} view="Side view + profile · short-lug case" scale="schematic">
      {panel(14, false)}
      {panel(244, true)}

      <Sep x1={14} y1={190} x2={466} y2={190} />
      <Tag x={14} y={208}>Thickness along the strap · ×10</Tag>
      {(() => {
        const a = lugGeom({ cx: 44, cy: 224, s: 3.2, k: 10, tb: 1.2, tw: 0.3, br: 0.9, conv: 2.2, tailT: 0.3, tailFull: 5, tailEnd: 9, lin: 1.0, uR: 62, linFrom: 4, bodyT: (u) => (u <= 0 ? 0.3 : u >= 14 ? 1.2 : 0.3 + 0.9 * (u / 14)) })
        const b = lugGeom({ cx: 44, cy: 290, s: 3.2, k: 10, tb: 0.9, tw: 0.4, br: 0.9, conv: 2.2, tailT: 0.4, tailFull: 5, tailEnd: 9, lin: 0.6, uR: 62, linFrom: 4 })
        return (
          <g>
            <LugEnd g={a} bar={false} />
            <BreakV x={a.X(62)} y1={a.Y(0) - 4} y2={a.Y(2.2) + 4} />
            <HDim x1={a.X(0)} x2={a.X(14)} y={a.Y(2.4) + 10} text="round the lugs" below c={C.brass} ext={a.Y(1.6)} />
            <VDim x={a.X(62) + 12} y1={a.Y(0)} y2={a.Y(2.2)} text="2.2 body" />
            <LugEnd g={b} bar={false} />
            <BreakV x={b.X(62)} y1={b.Y(0) - 4} y2={b.Y(1.5) + 4} />
            <VDim x={b.X(62) + 12} y1={b.Y(0)} y2={b.Y(1.5)} text="≈ 1.5" />
            <T x={44} y={326} s={10} c={C.faint}>
              or the whole strap ≈ 1.5: vintage dress watches, fold-over clasps
            </T>
          </g>
        )
      })()}
      <Note x={322} y={226} s={10.5} lh={14} head="Short or sharp lugs" hc={C.text} lines={['rectangular cases, some', 'round ones: thin the lug', 'end rather than switch', 'to curved ends']} />
    </Fig>
  )
}

/* Variant · exposed return flap */
function Exposed() {
  const ps = 4.2
  const tr = { x: 62, y: 98, s: ps }
  const o = { x0: 0, x1: 40, w0: 20, w1: 20, taper: [0, 40], tip: 'square' }
  const X = (v) => tr.x + v * ps
  const band = 7
  const g = lugGeom({ cx: 70, cy: 214, s: 14, tb: 1.2, tw: 0.6, br: 0.9, ramp: 4, conv: 2.6, tailT: 0.6, tailFull: band, tailEnd: band + 3, lin: 0.6, uR: 21, linMode: 'scarf' })
  const st = Array.from({ length: 7 }, (_, i) => g.X(3.4 + i * 2.8))
  const yT = tr.y - 10 * ps
  const yB = tr.y + 10 * ps
  return (
    <Fig h={340} view="Underside plan + section" scale="plan ×4.2 · section ×14">
      <Tag x={14} y={36}>Underside, lug end</Tag>
      <StrapPlan T={tr} o={o} face="lining" />
      <rect x={X(0)} y={yT} width={band * ps} height={20 * ps} fill="url(#sk-top)" />
      <line x1={X(band)} y1={yT} x2={X(band)} y2={yB} stroke="#5c3c1d" strokeWidth="1.1" />
      <SeamRun T={tr} pts={[[2.4, -7.2], [40, -7.2]]} />
      <SeamRun T={tr} pts={[[2.4, 7.2], [40, 7.2]]} />
      <SpringBar x={X(0)} y1={yT - 6} y2={yB + 6} r={2.4} />
      <BreakV x={X(40)} y1={yT - 4} y2={yB + 4} />
      <HDim x1={X(0)} x2={X(band)} y={yB + 12} text="6–8" below ext={yB} />
      <Lb p={[X(3.5), yT + 12]} t={[250, 50]} text="the folded top shows as a band" sub="in the top colour" a="start" s={10.5} />
      <Lb p={[X(band), tr.y - 10]} t={[250, 88]} text="lining laps the flap — no step" a="start" s={10.5} />
      <Lb p={[X(24), tr.y + 6]} t={[250, 116]} text="lining" a="start" s={10.5} />
      <Lb p={[X(30), yB - 2.8 * ps]} t={[250, 144]} text="side seams lock the flap" sub="no cross seam needed" a="start" s={10.5} />

      <Sep x1={14} y1={176} x2={466} y2={176} />
      <Tag x={14} y={194}>Section along the side seam, as worn</Tag>
      <LugEnd g={g} />
      <g stroke={C.thread} strokeLinecap="round">
        {st.map((x) => (
          <line key={x} x1={x} y1={g.Y(0) - 1.5} x2={x} y2={g.Y(1.8) + 1.5} strokeWidth="1.3" />
        ))}
      </g>
      <BreakV x={g.X(21)} y1={g.Y(0) - 4} y2={g.Y(1.8) + 4} />
      <HDim x1={g.X(0)} x2={g.X(band)} y={g.Y(3.0) + 12} text="6–8 band" below ext={g.Y(1.8) + 4} />
      <Magnifier cx={418} cy={262} r={40} fx={g.X(band + 1.5)} fy={g.Y(1.5)} k={3}>
        <LugEnd g={g} />
      </Magnifier>
      <T x={418} y={318} a="middle" s={10} c={C.text}>
        lining skived to nothing,
      </T>
      <T x={418} y={331} a="middle" s={10} c={C.text}>
        flat under the flap’s end
      </T>
      <Lb p={[g.X(4.5), g.Y(1.65)]} t={[236, 300]} text="tail exposed on the underside" a="start" s={10.5} />
      <Lb p={[g.bar[0] - 4, g.bar[1] - 4]} t={[28, 224]} text="bar" a="end" s={10.5} c={C.steel} />
    </Fig>
  )
}

/* Variant · closed lug end */
function Closed() {
  const g = lugGeom({ cx: 74, cy: 64, s: 22, tb: 1.2, tw: 0.55, br: 0.9, ramp: 3.4, conv: 1.9, tailT: 0.55, tailFull: 4.5, tailEnd: 7.5, lin: 0.9, uR: 7.8, linFrom: 3.6, linFeather: 1.6 })
  const xs = g.X(1.9)
  const ps = 4.2
  const tr = { x: 296, y: 104, s: ps }
  const o = { x0: 0, x1: 37, w0: 20, w1: 20, taper: [0, 37], tip: 'square' }
  const Xp = (v) => tr.x + v * ps
  const m = 2.8
  return (
    <Fig h={340} view="Section + underside plan" scale="section ×22 · plan ×4.2">
      <Tag x={14} y={36}>Section, as worn</Tag>
      <LugEnd g={g} />
      <line x1={xs} y1={g.Y(0) - 3} x2={xs} y2={g.Y(g.f(1.9) + 0.55) + 3} stroke={C.thread} strokeWidth="2.2" strokeLinecap="round" />
      <BreakV x={g.X(7.8)} y1={g.Y(0) - 4} y2={g.Y(2.1) + 4} />
      <HDim x1={g.X(0.9)} x2={xs} y={g.Y(2.9) + 12} text="≈ 1" below c={C.emerald} ext={g.bar[1]} />
      <Lb p={[xs, g.Y(0) - 3]} t={[140, 36]} text="cross seam, just past the bar" a="start" s={10.5} />
      <Lb p={[g.bar[0] - 6, g.bar[1] + 6]} t={[20, 160]} text="1 · measure the bar Ø first" a="start" s={10.5} c={C.steel} />
      <T x={24} y={180} s={10.5} c={C.emerald}>
        2 · cross seam at the bar + ≈ 1 mm
      </T>
      <Lb p={[g.X(5.5), g.Y(1.45)]} t={[214, 150]} text="tail" a="start" s={10.5} />

      <Sep x1={276} y1={28} x2={276} y2={186} />
      <Tag x={288} y={36}>Underside · U-seam</Tag>
      <StrapPlan T={tr} o={o} face="lining" />
      <SeamRun T={tr} pts={[[37, -(10 - m)], [1.9, -(10 - m)], [1.9, 10 - m], [37, 10 - m]]} />
      <rect x={tr.x - 3} y={tr.y - 10 * ps + 2} width={6} height={20 * ps - 4} rx="3" fill="none" stroke={C.steel} strokeWidth="1" strokeDasharray="3 2" />
      <BreakV x={Xp(37)} y1={tr.y - 10 * ps - 4} y2={tr.y + 10 * ps + 4} />
      <Lb p={[Xp(1.9), tr.y + 14]} t={[330, 168]} text="cross seam closes the tunnel" a="start" s={10} />
      <Lb p={[tr.x, tr.y - 30]} t={[340, 50]} text="bar inside (hidden)" a="start" s={10} c={C.steel} />

      <Sep x1={14} y1={190} x2={466} y2={190} />
      <Tag x={14} y={208}>3 · the tunnel is fixed for good: clear the QR lever</Tag>
      {[
        { x0: 14, c: 1.0, ok: true, l1: 'bar + ≈ 1 mm: bar and', l2: 'lever slide in and out' },
        { x0: 244, c: 0.3, ok: false, l1: 'seam tight to the bar:', l2: 'the lever jams' },
      ].map((p) => {
        const h = lugGeom({ cx: p.x0 + 46, cy: 240, s: 13, tb: 1.2, tw: 0.55, br: 0.9, ramp: 3.4, conv: 0.9 + p.c, tailT: 0.55, tailFull: 4, tailEnd: 8, lin: 0.9, uR: 10.8, linFrom: 3.4, linFeather: 1.6 })
        const sx = h.X(0.9 + p.c)
        const ang = (14 * Math.PI) / 180
        const L = 1.7 * 13
        const lx = h.bar[0] + Math.cos(ang) * L
        const ly = h.bar[1] + Math.sin(ang) * L
        return (
          <g key={p.x0}>
            <Panel x={p.x0} y={216} w={222} h={118} ok={p.ok} />
            <LugEnd g={h} />
            <line x1={h.bar[0]} y1={h.bar[1]} x2={lx} y2={ly} stroke="url(#sk-steelH)" strokeWidth="4.2" strokeLinecap="round" />
            <line x1={h.bar[0]} y1={h.bar[1]} x2={lx} y2={ly} stroke="#3b4850" strokeWidth="0.6" />
            <line x1={sx} y1={h.Y(0) - 2} x2={sx} y2={h.Y(h.f(0.9 + p.c) + 0.55) + 2} stroke={C.thread} strokeWidth="2" strokeLinecap="round" />
            <BreakV x={h.X(10.8)} y1={h.Y(0) - 4} y2={h.Y(2.1) + 4} />
            {!p.ok && <circle cx={lx - 2} cy={ly} r={6} fill="none" stroke={C.ruby} strokeWidth="1.5" />}
            <Lb p={[lx - 1, ly + 1]} t={[p.x0 + 112, 292]} text="QR lever" a="start" s={10} c={C.steel} />
            <T x={p.x0 + 12} y={312} s={10.5} c={p.ok ? C.emerald : C.ruby}>
              {p.l1}
            </T>
            <T x={p.x0 + 12} y={326} s={10} c={C.faint}>
              {p.l2}
            </T>
          </g>
        )
      })}
    </Fig>
  )
}

/* ================================================================== */
/* sm-finish                                                            */
/* ================================================================== */

// White cloth swatch (from figs-finish).
function Cloth({ x, y, w = 50, h = 34, smudge = 0 }) {
  return (
    <g>
      <path
        d={`M${x} ${y + 4} Q${x + w * 0.3} ${y - 2} ${x + w * 0.55} ${y + 2} T${x + w} ${y + 3} L${x + w - 2} ${y + h - 3} Q${x + w * 0.6} ${y + h + 3} ${x + w * 0.3} ${y + h - 1} T${x + 2} ${y + h} Z`}
        fill="#f1ece2"
        stroke="#b9b1a1"
        strokeWidth="0.9"
      />
      {smudge > 0 && <ellipse cx={x + w * 0.5} cy={y + h * 0.55} rx={w * 0.3} ry={h * 0.2} fill="#4a2c16" opacity={0.3 * smudge} transform={`rotate(-12 ${x + w * 0.5} ${y + h * 0.55})`} />}
    </g>
  )
}

// One antique-finish piece in plan: base colour, then (stage ≥ 2) a dark
// stain heavier at the edges and the bar end with lighter high spots,
// then (stage 3) wax sheen and dark painted edges. seed varies the rub.
function AntiquePiece({ T: tr, o, stage, seed = 3 }) {
  const id = uid()
  const d = pathOf(outline(o), tr)
  const R = rng(seed)
  const [x0] = px(tr, o.x0, 0)
  const [x1] = px(tr, o.x1, 0)
  const h = (o.w0 / 2) * tr.s
  const blot = []
  if (stage >= 2) {
    for (let i = 0; i < 26; i++) {
      const bx = x0 + R() * (x1 - x0)
      const edge = R() > 0.45
      const by = edge ? tr.y + (R() > 0.5 ? 1 : -1) * h * (0.65 + R() * 0.3) : tr.y + (R() - 0.5) * h * 1.2
      blot.push(<ellipse key={'d' + i} cx={f1(bx)} cy={f1(by)} rx={f1(4 + R() * 9)} ry={f1(2 + R() * 4)} fill="#3a2010" opacity={f1(0.12 + R() * 0.14)} />)
    }
    for (let i = 0; i < 9; i++) {
      const bx = x0 + 30 + R() * (x1 - x0 - 60)
      blot.push(<ellipse key={'l' + i} cx={f1(bx)} cy={f1(tr.y + (R() - 0.5) * h * 0.6)} rx={f1(6 + R() * 10)} ry={f1(3 + R() * 4)} fill="#f0c58a" opacity={f1(0.1 + R() * 0.1)} />)
    }
  }
  return (
    <g>
      <defs>
        <linearGradient id={`aw${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff4dc" stopOpacity="0" />
          <stop offset="0.45" stopColor="#fff4dc" stopOpacity="0.26" />
          <stop offset="1" stopColor="#fff4dc" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`ae${id}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2e180a" stopOpacity="0.85" />
          <stop offset="1" stopColor="#2e180a" stopOpacity="0" />
        </linearGradient>
      </defs>
      <clipPath id={`ac${id}`}>
        <path d={d} />
      </clipPath>
      <path d={d} fill="#c8925a" />
      {stage >= 2 && (
        <g clipPath={`url(#ac${id})`}>
          <path d={d} fill="#8a5a31" opacity="0.55" />
          {blot}
          <path d={d} fill="none" stroke="#2e180a" strokeWidth="18" opacity="0.28" />
          <path d={d} fill="none" stroke="#2e180a" strokeWidth="10" opacity="0.32" />
          <path d={d} fill="none" stroke="#2e180a" strokeWidth="4" opacity="0.4" />
          <rect x={x0} y={tr.y - h - 2} width={14 * tr.s} height={2 * h + 4} fill={`url(#ae${id})`} />
        </g>
      )}
      {stage >= 3 && (
        <g clipPath={`url(#ac${id})`}>
          <rect x={x0} y={tr.y - h} width={x1 - x0} height={h * 1.1} fill={`url(#aw${id})`} />
        </g>
      )}
      <path d={d} fill="none" stroke={stage >= 3 ? '#22130a' : '#5c3c1d'} strokeWidth={stage >= 3 ? 2.6 : 0.9} />
    </g>
  )
}

/* Variant · antique hand-painted finish */
function Antique() {
  const s = 2.2
  const x0 = 60
  const o = LONG()
  const rows = [
    { y: 66, stage: 1, head: 'Light base dye', l: ['even passes, flat veg-tan'] },
    { y: 140, stage: 2, head: 'Darker stain, by hand', l: ['heavier at edges and bar', 'end; wipe back while wet'] },
    { y: 214, stage: 3, head: 'Buff, wax, buff, seal', l: ['edges painted the dark', 'colour'] },
  ]
  return (
    <Fig h={340} view="Plan · long piece, three stages" scale="×2.2">
      {rows.map((r, i) => {
        const tr = { x: x0, y: r.y, s }
        return (
          <g key={r.stage}>
            <AntiquePiece T={tr} o={o} stage={r.stage} seed={4} />
            <Num x={34} y={r.y} n={r.stage} />
            <T x={344} y={r.y - 8} s={11.5} w="600" c={C.text}>
              {r.head}
            </T>
            {r.l.map((t, j) => (
              <T key={t} x={344} y={r.y + 7 + j * 13} s={10} c={C.dim}>
                {t}
              </T>
            ))}
            {i < 2 && <Sep x1={14} y1={r.y + 37} x2={466} y2={r.y + 37} />}
          </g>
        )
      })}
      <Dauber x={150} y={60} ang={22} k={0.55} c="#9c6533" />
      <Lb p={[154, 44]} t={[196, 34]} text="dauber, light dye" a="start" s={10} c={C.dim} dot={false} />
      <Arrow a={[176, 76]} b={[236, 76]} w={1.4} />
      <Cloth x={250} y={118} w={44} h={30} smudge={1} />
      <Arrow a={[244, 158]} b={[196, 158]} w={1.4} />
      <T x={204} y={172} a="middle" s={10} c={C.brass}>
        wipe back
      </T>
      <Lb p={[x0 + 3, 140]} t={[24, 172]} text="bar end darkest" a="start" s={10} c={C.dim} dot={false} />
      <Cloth x={232} y={184} w={40} h={26} />
      <path d="M244 214 a12 5 0 1 0 22 -2" fill="none" stroke={C.brass} strokeWidth="1.3" markerEnd="url(#sk-a-brass)" />
      <T x={280} y={196} s={10} c={C.brass}>
        wax · buff
      </T>
      <Lb p={[x0 + 118 * s, 214 + 4]} t={[316, 244]} text="dark painted edge" a="start" s={10} c={C.dim} />
      <Lb p={[x0 + 60 * s, 214]} t={[160, 246]} text="lighter on the high spots" a="end" s={10} c={C.dim} />

      <Sep x1={14} y1={256} x2={466} y2={256} />
      <Tag x={14} y={274}>Tone across the width</Tag>
      {(() => {
        const cx0 = 30
        const w = 150
        const y0 = 290
        const pts = Array.from({ length: 41 }, (_, i) => {
          const u = i / 40
          const e = Math.min(u, 1 - u)
          const v = 0.25 + 0.7 * Math.exp(-e * 9) + 0.06 * Math.sin(i * 1.7)
          return [cx0 + u * w, y0 + 32 - v * 30]
        })
        return (
          <g>
            <line x1={cx0} y1={y0 + 32} x2={cx0 + w} y2={y0 + 32} stroke={C.line} />
            <path d={P(pts)} fill="none" stroke={C.brass} strokeWidth="1.6" />
            <T x={cx0} y={y0 + 46} s={10} c={C.faint}>
              edge
            </T>
            <T x={cx0 + w / 2} y={y0 + 46} a="middle" s={10} c={C.faint}>
              centre
            </T>
            <T x={cx0 + w} y={y0 + 46} a="end" s={10} c={C.faint}>
              edge
            </T>
            <T x={cx0 + w + 8} y={y0 + 6} s={10} c={C.dim}>
              darker
            </T>
          </g>
        )
      })()}
      <Sep x1={238} y1={264} x2={238} y2={336} />
      <Tag x={252} y={274}>No two straps match</Tag>
      <AntiquePiece T={{ x: 254, y: 296, s: 1.4 }} o={o} stage={3} seed={11} />
      <AntiquePiece T={{ x: 254, y: 324, s: 1.4 }} o={o} stage={3} seed={29} />
      <T x={430} y={300} s={10} c={C.dim}>
        that is
      </T>
      <T x={430} y={313} s={10} c={C.dim}>
        the point
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* sm-remborde                                                          */
/* ================================================================== */

// Corded rembordé section across the width (mm → px), as worn.
// Top t over the core, cord Ø dc butted to the core edge on its mid-plane,
// margin skived to tm round the bead, flanges under the core, lining.
function cordGeom({ cx, y, s, W = 20, t = 1.0, tc = 1.2, dc = 1.3, tm = 0.4, flange = 3.6, tl = 0.6, cord = true }) {
  const X = (x) => cx + x * s
  const Y = (z) => y + z * s
  const W2 = W / 2
  const rc = dc / 2
  const zc = t + tc / 2
  const xc = W2 - tm - rc
  const xcore = cord ? xc - rc : W2 - tm
  const xfE = W2 - flange
  const zb = t + tc
  const ft = (x) => Math.max(0.05, Math.min(tm, 0.05 + (tm - 0.05) * ((x - xfE) / 1.6)))
  // right half chain: outer from the face centre, round the edge, along the flange; inner back
  const outer = [[0, 0]]
  const inner = []
  if (cord) {
    // top quarter: face down to the widest point; bottom quarter round the cord
    const rx = W2 - xc
    for (let i = 0; i <= 14; i++) {
      const a = (Math.PI / 2) * (i / 14)
      outer.push([xc + rx * Math.sin(a), zc - zc * Math.cos(a)])
    }
    const rb = rc + tm
    for (let i = 1; i <= 14; i++) {
      const a = (Math.PI / 2) * (i / 14)
      outer.push([xc + rx * Math.cos(a), zc + rb * Math.sin(a)])
    }
  } else {
    const rr = 0.35
    outer.push([W2 - rr, 0])
    for (let i = 1; i <= 6; i++) {
      const a = (Math.PI / 2) * (i / 6)
      outer.push([W2 - rr + rr * Math.sin(a), rr - rr * Math.cos(a)])
    }
    for (let i = 0; i <= 6; i++) {
      const a = (Math.PI / 2) * (i / 6)
      outer.push([W2 - rr + rr * Math.cos(a), zb + tm - rr + rr * Math.sin(a)])
    }
  }
  const fl = []
  for (let i = 0; i <= 12; i++) {
    const x = xc + (xfE - xc) * (i / 12)
    fl.push([x, zb + ft(x)])
  }
  outer.push(...fl.filter(([x]) => x <= (cord ? xc : W2 - 0.35)))
  inner.push([xfE, zb], [xcore, zb])
  if (cord) {
    for (let i = 0; i <= 24; i++) {
      const th = Math.PI / 2 - (Math.PI * i) / 24
      inner.push([xc + rc * Math.cos(th), zc + rc * Math.sin(th)])
    }
  } else {
    inner.push([W2 - tm, zb], [W2 - tm, t])
  }
  inner.push([xcore, t], [0, t])
  const R = [...outer, ...inner]
  const L = R.map(([x, z]) => [-x, z])
  const top = P([...R, ...[...L].reverse()].map(([x, z]) => [X(x), Y(z)]), true)
  const core = P([[-xcore, t], [xcore, t], [xcore, zb], [-xcore, zb]].map(([x, z]) => [X(x), Y(z)]), true)
  // lining: over the core and the flanges, trimmed just inside the bead
  const xl = cord ? xc + 0.1 : W2 - 0.6
  const lt = (x) => (Math.abs(x) <= xfE ? zb : zb + ft(Math.abs(x)))
  const N = 30
  const lTop = Array.from({ length: N + 1 }, (_, i) => {
    const x = -xl + (2 * xl * i) / N
    return [x, lt(x)]
  })
  const lBot = [...lTop].reverse().map(([x, z]) => [x, z + Math.max(0.05, tl * Math.min(1, (xl - Math.abs(x)) / 1.4))])
  const lining = P([...lTop, ...lBot].map(([x, z]) => [X(x), Y(z)]), true)
  return { X, Y, top, core, lining, xc, zc, rc, xcore, xfE, zb, t, tm }
}
function CordSec({ g, cord = true, grain = true }) {
  return (
    <g>
      <path d={g.core} fill="url(#sk-fill)" stroke="#3a2716" strokeWidth="0.7" />
      {cord &&
        [-1, 1].map((sg) => (
          <g key={sg}>
            <circle cx={g.X(sg * g.xc)} cy={g.Y(g.zc)} r={g.rc * (g.X(1) - g.X(0))} fill="#d8c08a" stroke="#6d5a33" strokeWidth="0.8" />
            {[-0.45, 0, 0.45].map((d) => (
              <line key={d} x1={g.X(sg * g.xc) + (d - 0.3) * g.rc * (g.X(1) - g.X(0))} y1={g.Y(g.zc) + 0.7 * g.rc * (g.X(1) - g.X(0))} x2={g.X(sg * g.xc) + (d + 0.3) * g.rc * (g.X(1) - g.X(0))} y2={g.Y(g.zc) - 0.7 * g.rc * (g.X(1) - g.X(0))} stroke="#8d7546" strokeWidth="0.8" />
            ))}
          </g>
        ))}
      <path d={g.top} fill={TOPC} stroke={LEDGE} strokeWidth="0.8" strokeLinejoin="round" />
      <path d={g.lining} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" strokeLinejoin="round" />
      {grain && <line x1={g.X(-g.xc)} y1={g.Y(0) + 0.8} x2={g.X(g.xc)} y2={g.Y(0) + 0.8} stroke={GRAIN} strokeWidth="1.6" />}
    </g>
  )
}

/* Variant · corded edge (jonc) */
function Cord() {
  const g = cordGeom({ cx: 152, y: 66, s: 13 })
  return (
    <Fig h={340} view="Section across the width + core plan" scale="section ×13 · plan ×2.6">
      <CordSec g={g} />
      <Lb p={[g.X(g.xc), g.Y(g.zc)]} t={[300, 40]} text="cord Ø 1–1.5" sub="cemented to the core edge" a="start" s={10.5} />
      <Lb p={[g.X(3), g.Y(1.6)]} t={[g.X(3), 132]} text="core" a="middle" s={10.5} />
      <Lb p={[g.X(-3), g.Y(0.5)]} t={[g.X(-3), 40]} text="top" a="middle" s={10.5} />
      <Lb p={[g.X(9.98), g.Y(1.0)]} t={[300, 84]} text="margin wraps a round bead," sub="not a square core edge" a="start" s={10.5} />
      <Lb p={[g.X(-7.6), g.Y(g.zb + 0.25)]} t={[40, 132]} text="flange" a="middle" s={10.5} />
      <Lb p={[g.X(-1), g.Y(g.zb + 0.4)]} t={[g.X(-1), 132]} text="lining" a="middle" s={10.5} />
      <Lb p={[g.X(9.4), g.Y(g.zb + 0.45)]} t={[300, 122]} text="lining trimmed inside the bead" a="start" s={10} c={C.dim} />

      <Sep x1={14} y1={150} x2={466} y2={150} />
      <Tag x={14} y={168}>Edge profile compared</Tag>
      {(() => {
        const ga = cordGeom({ cx: 30 - 4 * 10, y: 186, s: 10, cord: false })
        const gb = cordGeom({ cx: 30 - 4 * 10, y: 240, s: 10 })
        return (
          <g>
            <clipPath id="cdA">
              <rect x={30} y={176} width={130} height={104} />
            </clipPath>
            <g clipPath="url(#cdA)">
              <CordSec g={ga} cord={false} />
              <CordSec g={gb} />
            </g>
            <BreakV x={32} y1={182} y2={222} />
            <BreakV x={32} y1={236} y2={276} />
            <T x={150} y={202} s={10.5} c={C.text}>
              plain:
            </T>
            <T x={150} y={215} s={10} c={C.faint}>
              square shoulder
            </T>
            <T x={150} y={256} s={10.5} c={C.text}>
              corded:
            </T>
            <T x={150} y={269} s={10} c={C.faint}>
              a round 1950s bead
            </T>
          </g>
        )
      })()}

      <Sep x1={248} y1={160} x2={248} y2={296} />
      <Tag x={260} y={168}>Core plan, flesh up</Tag>
      {(() => {
        const ss = 2.6
        const tr = { x: 300, y: 218, s: ss }
        const X = (v) => tr.x + v * ss
        const Y = (v) => tr.y + v * ss
        return (
          <g>
            <rect x={X(-14)} y={Y(-15)} width={(14 + 52) * ss} height={30 * ss} fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="0.8" />
            <rect x={X(-14)} y={Y(-15)} width={12 * ss} height={30 * ss} fill="url(#sk-fadeL)" opacity="0.7" />
            <rect x={X(10)} y={Y(-8.3)} width={42 * ss} height={16.6 * ss} fill="url(#sk-fill)" stroke="#3a2716" strokeWidth="0.7" />
            {[-1, 1].map((sg) => (
              <g key={sg}>
                <rect x={X(10)} y={Y(sg * 8.95 - 0.65)} width={42 * ss} height={1.3 * ss} rx={0.6 * ss} fill="#d8c08a" stroke="#6d5a33" strokeWidth="0.6" />
                {Array.from({ length: 22 }, (_, i) => (
                  <line key={i} x1={X(10.6 + i * 1.9)} y1={Y(sg * 8.95 + 0.6)} x2={X(11.4 + i * 1.9)} y2={Y(sg * 8.95 - 0.6)} stroke="#8d7546" strokeWidth="0.7" />
                ))}
              </g>
            ))}
            <line x1={X(0)} y1={Y(-15)} x2={X(0)} y2={Y(15)} stroke={C.text} strokeWidth="1" strokeDasharray="4 3" />
            <BreakV x={X(52)} y1={Y(-15) - 3} y2={Y(15) + 3} />
            <HDim x1={X(0)} x2={X(10)} y={Y(15) + 10} text="" ext={Y(15)} />
            <T x={X(0) + 4} y={Y(-11)} s={10} c="#5c3c1d">
              fold
            </T>
            <Lb p={[X(44), Y(-8.95)]} t={[X(38), Y(0)]} text="cords" a="end" s={10.5} c={LIGHT} />
            <T x={X(-12)} y={Y(0) + 4} s={10} c="#5c3c1d">
              flap
            </T>
          </g>
        )
      })()}
      <Note x={260} y={278} s={10} lh={13} lines={['cord stops with the core, short of', 'the fold: doubled fold = one layer']} c={C.text} />
      <Sep x1={14} y1={302} x2={466} y2={302} />
      <Note x={14} y={318} s={10} lh={13} lines={['The maker lists cord, padding and a glass-fibre underlay but not their positions;', 'the placement drawn here is the course’s reading.']} c={C.faint} />
    </Fig>
  )
}

/* ================================================================== */
/* sm-exotic                                                            */
/* ================================================================== */

// An ink stamp on the hide (schematic, generic wording).
function InkStamp({ x, y, ang = 0, k = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${k})`} opacity="0.78">
      <ellipse cx="0" cy="0" rx="66" ry="24" fill="none" stroke="#2a201c" strokeWidth="2.2" />
      <ellipse cx="0" cy="0" rx="60" ry="19" fill="none" stroke="#2a201c" strokeWidth="0.9" />
      <text x="0" y="-1" fontSize="10.5" fontWeight="700" letterSpacing="0.6" fill="#2a201c" textAnchor="middle" fontFamily={FONT}>
        SHELL CORDOVAN
      </text>
      <text x="0" y="12" fontSize="9" letterSpacing="1.4" fill="#2a201c" textAnchor="middle" fontFamily={FONT}>
        GENUINE · No. 4
      </text>
    </g>
  )
}
function NapField({ x, y, w, h, seed = 5, n = 260, c = 'rgba(120,92,60,0.45)' }) {
  const R = rng(seed)
  return (
    <g stroke={c} strokeWidth="0.8" strokeLinecap="round">
      {Array.from({ length: n }, (_, i) => {
        const px0 = x + R() * w
        const py0 = y + R() * h
        const a = -0.5 + R() * 1.0
        const l = 2 + R() * 3
        return <line key={i} x1={f1(px0)} y1={f1(py0)} x2={f1(px0 + Math.cos(a) * l)} y2={f1(py0 + Math.sin(a) * l)} />
      })}
    </g>
  )
}

/* Inverted (reverse) shell */
function Reverse() {
  const id = uid()
  const shell = 'M30 70 Q30 40 70 38 L400 42 Q456 46 458 104 Q458 168 400 174 L70 176 Q30 176 30 140 Z'
  const sL = { x: 52, y: 92, s: 1.65 }
  const sS = { x: 272, y: 146, s: 1.65 }
  const oL = LONG()
  const oS = SHORT()
  const stamps = [
    { x: 150, y: 84, ang: -6 },
    { x: 368, y: 136, ang: 4 },
    { x: 330, y: 72, ang: -3 },
  ]
  const stampEls = stamps.map((p, i) => <InkStamp key={i} {...p} />)
  return (
    <Fig h={340} view="Plan · shell, unglazed face up" scale="schematic · plan ×1.65">
      <clipPath id={`sh${id}`}>
        <path d={shell} />
      </clipPath>
      <path d={shell} fill="#cdb48e" stroke="#7d6648" strokeWidth="1" />
      <g clipPath={`url(#sh${id})`}>
        <NapField x={30} y={38} w={430} h={140} />
        {stampEls}
      </g>
      <path d={pathOf(outline(oL), sL)} fill="rgba(208,168,79,0.10)" stroke={C.brass} strokeWidth="1.5" strokeDasharray="6 3" />
      <path d={pathOf(outline(oS), sS)} fill="rgba(208,168,79,0.10)" stroke={C.brass} strokeWidth="1.5" strokeDasharray="6 3" />
      <Lb p={[sL.x + 30, sL.y + 12]} t={[36, 196]} text="long piece: part of a stamp" a="start" s={10.5} c={C.brass} />
      <Lb p={[sS.x + 20, sS.y + 14]} t={[210, 196]} text="short piece: part of another" a="start" s={10.5} c={C.brass} />
      <Lb p={[432, 146]} t={[432, 196]} text="ink stamp" a="middle" s={10.5} />

      <Sep x1={14} y1={214} x2={466} y2={214} />
      <Tag x={14} y={232}>Which face</Tag>
      {/* usual: glazed face up */}
      <rect x={20} y={248} width={150} height={12} fill="#c4a57a" stroke="#7d6648" strokeWidth="0.8" />
      <line x1={22} y1={249.6} x2={168} y2={249.6} stroke="#fff6e4" strokeWidth="1.6" opacity="0.9" />
      <T x={24} y={279} s={10} c={C.brass}>
        turn it over
      </T>
      <T x={178} y={252} s={10.5} c={C.text}>
        usual: glazed face up
      </T>
      <T x={178} y={265} s={10} c={C.faint}>
        polished, glossy
      </T>
      <Arrow d="M150 268 q14 8 0 18" w={1.3} />
      <rect x={20} y={290} width={150} height={12} fill="#cdb48e" stroke="#7d6648" strokeWidth="0.8" />
      <NapField x={20} y={285} w={150} h={6} n={70} seed={8} c="rgba(140,110,70,0.9)" />
      <T x={178} y={296} s={10.5} c={C.text}>
        inverted: the unglazed
      </T>
      <T x={178} y={309} s={10} c={C.faint}>
        side — matte, napped
      </T>
      <Note x={20} y={324} s={10} lh={13} lines={['no glaze, no polish · paint the edges · it patinas fast']} c={C.dim} />

      <Sep x1={316} y1={222} x2={316} y2={336} />
      <Tag x={328} y={232}>Lined, finished</Tag>
      {(() => {
        const x1 = 350
        const x2 = 436
        const yt = 256
        const k = 10
        return (
          <g>
            <path d={`M${x1} ${yt} L${x2} ${yt} L${x2} ${yt + 2.6 * k} L${x1} ${yt + 3.2 * k} Z`} fill="#cdb48e" stroke="#7d6648" strokeWidth="0.8" />
            <path d={`M${x1} ${yt + 1.6 * k} L${x2} ${yt + 1.3 * k} L${x2} ${yt + 2.6 * k} L${x1} ${yt + 3.2 * k} Z`} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
            <VDim x={x1 - 6} y1={yt} y2={yt + 3.2 * k} side="l" text="3.2" />
            <VDim x={x2 + 6} y1={yt} y2={yt + 2.6 * k} text="2.6" />
            <T x={x1} y={yt + 3.2 * k + 16} s={10} c={C.faint}>
              lug
            </T>
            <T x={x2} y={yt + 3.2 * k + 16} a="end" s={10} c={C.faint}>
              buckle
            </T>
            <T x={(x1 + x2) / 2} y={yt - 6} a="middle" s={10} c={C.faint}>
              thickness ×10
            </T>
          </g>
        )
      })()}
    </Fig>
  )
}

export const FIGS = {
  't1-frontload': FrontLoad,
  't1-midhole': MidHole,
  't1-twotone': TwoTone,
  't10p-colour': EdgeColour,
  't11-ladders': Ladders,
  't13-overbar': OverBar,
  't13-topload': TopLoad,
  't13-curved': Curved,
  't13-thinlug': ThinLug,
  't13-exposed': Exposed,
  't13-closed': Closed,
  't14-antique': Antique,
  'r-cord': Cord,
  'ex-reverse': Reverse,
}
