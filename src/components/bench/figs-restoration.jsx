// Diagrams for the "Restoration & Bench Skills" track: staking a balance
// staff, poising, six-position adjustment, hairspring work, jewelling,
// pivots, shellac and escapement adjustment, case work, and endshake.
// Original schematics built on the strap kit. Nothing is traced from an ETA,
// Witschi or other published figure, and every number matches the step text.
// Small parts are drawn enlarged; where a tool's real form varies by maker
// the figure says `schematic`.
import { C, Fig, T, Note, Dim, Arrow, Num, Verdict, Tag, Sep } from '../strap/kit.jsx'

/* ------------------------------------------------------------------ */
/* Palette and defs for this file                                       */
/* ------------------------------------------------------------------ */
const R = {
  plate: '#5b5339',
  plateHi: '#7a6e4c',
  brassP: '#b89548',
  brassD: '#7d6430',
  steelD: '#55646e',
  ruby: '#c9495e',
  rubyD: '#8a3943',
  oil: '#7fc4e8',
  shellac: '#c98a2e',
  burnt: '#4a2a12',
  blue: '#3f63b8',
  wood: '#b48455',
  lcd: '#0f1916',
  grid: 'rgba(134,167,189,0.14)',
  rust: '#9c4a22',
  gold: '#d9b45a',
}

function RDefs() {
  const hatch = (id, bg, fg) => (
    <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="6" fill={bg} />
      <line x1="0" y1="0" x2="0" y2="6" stroke={fg} strokeWidth="1.1" />
    </pattern>
  )
  return (
    <defs>
      {hatch('rs-cut', '#5f717d', '#93a5b1')}
      {hatch('rs-bcut', '#7f6a33', '#c6a65c')}
      {hatch('rs-pcut', '#4b4430', '#6d6346')}
      <pattern id="rs-knurl" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#a7b6bf" />
        <line x1="2" y1="0" x2="2" y2="4" stroke="#55646e" strokeWidth="1" />
      </pattern>
      <pattern id="rs-brush" width="40" height="3" patternUnits="userSpaceOnUse">
        <rect width="40" height="3" fill="#9aa9b2" />
        <line x1="0" y1="1.5" x2="40" y2="1.5" stroke="#c3cfd6" strokeWidth="0.6" />
      </pattern>
      <pattern id="rs-bead" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#7f8c94" />
        <circle cx="1" cy="1" r="0.6" fill="#a9b6be" />
        <circle cx="3" cy="3" r="0.6" fill="#65737b" />
      </pattern>
      <linearGradient id="rs-temper" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#c9ccd0" />
        <stop offset="0.18" stopColor="#e3c77a" />
        <stop offset="0.38" stopColor="#a8682e" />
        <stop offset="0.58" stopColor="#7a3f86" />
        <stop offset="0.8" stopColor="#3f63b8" />
        <stop offset="1" stopColor="#5d86b5" />
      </linearGradient>
      <radialGradient id="rs-flame" cx="0.5" cy="0.8" r="0.7">
        <stop offset="0" stopColor="rgba(140,190,255,0.9)" />
        <stop offset="0.5" stopColor="rgba(240,200,110,0.55)" />
        <stop offset="1" stopColor="rgba(240,200,110,0)" />
      </radialGradient>
      <radialGradient id="rs-jewel" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#f08a9a" />
        <stop offset="0.6" stopColor="#c9495e" />
        <stop offset="1" stopColor="#7d2635" />
      </radialGradient>
    </defs>
  )
}

const F = ({ children, ...p }) => (
  <Fig {...p}>
    <RDefs />
    {children}
  </Fig>
)

// Group placed at a working point: tools extend up (−y) from (0,0)
const G = ({ x = 0, y = 0, ang = 0, k = 1, children, o }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${k})`} opacity={o}>
    {children}
  </g>
)

// screen polar: 0° = 3 o'clock, clockwise on screen
const pol = (cx, cy, r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)]
const fx = (p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`
function arcD(cx, cy, r, a0, a1) {
  const sweep = a1 > a0 ? 1 : 0
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0
  return `M${fx(pol(cx, cy, r, a0))} A${r} ${r} 0 ${large} ${sweep} ${fx(pol(cx, cy, r, a1))}`
}
function spiralD(cx, cy, r0, r1, turns, a0 = 0, n = 220, ox = 0, oy = 0) {
  let d = ''
  for (let i = 0; i <= n; i++) {
    const u = i / n
    const p = pol(cx + ox * (1 - u), cy + oy * (1 - u), r0 + (r1 - r0) * u, a0 + u * turns * 360)
    d += `${i ? 'L' : 'M'}${fx(p)}`
  }
  return d
}

/* ------------------------------------------------------------------ */
/* Layout helpers                                                       */
/* ------------------------------------------------------------------ */
const FW = 0.5
function wrap(text, width, s) {
  const max = Math.floor(width / (s * FW))
  const out = []
  let line = ''
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word
    if (next.length > max && line) {
      out.push(line)
      line = word
    } else line = next
  }
  if (line) out.push(line)
  return out
}
function Para({ x, y, w, text, s = 10.5, lh = 13.5, c = C.dim, a }) {
  return (
    <g>
      {wrap(text, w, s).map((l, i) => (
        <T key={i} x={x} y={y + i * lh} s={s} c={c} a={a}>
          {l}
        </T>
      ))}
    </g>
  )
}

function Pn({ x, y, w, h, t, c = C.line, tc, ok }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill="rgba(255,255,255,0.025)" stroke={c} />
      {t && (
        <Tag x={x + 9} y={y + 16} c={tc}>
          {t}
        </Tag>
      )}
      {ok !== undefined && <Verdict x={x + w - 15} y={y + 15} ok={ok} r={8} />}
    </g>
  )
}

// Rounded box with centred lines; first line bold when there are several
function Bx({ x, y, w, h, l, c = C.struct, f = 'rgba(255,255,255,0.03)', tc = C.text, s = 11, lh, b = C.dim }) {
  const gap = lh || s + 3
  const y0 = y + h / 2 - ((l.length - 1) * gap) / 2 + s * 0.36
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={f} stroke={c} />
      {l.map((t, i) => (
        <T key={i} x={x + w / 2} y={y0 + i * gap} a="middle" s={i === 0 ? s : Math.max(10, s - 0.5)} c={i === 0 ? tc : b} w={i === 0 && l.length > 1 ? 600 : undefined}>
          {t}
        </T>
      ))}
    </g>
  )
}

// Label whose leader stops at the text. up: text sits above its end point.
const Lab = ({ p, x, y, text, sub, c = C.text, s = 10.5, up, a = 'middle' }) => (
  <g>
    <line x1={p[0]} y1={p[1]} x2={x} y2={up ? y + 4 : y - s} stroke={C.struct} strokeWidth="0.8" opacity="0.85" />
    <circle cx={p[0]} cy={p[1]} r="2.2" fill={c} />
    <T x={x} y={y} a={a} s={s} c={c}>
      {text}
    </T>
    {sub && (
      <T x={x} y={up ? y - s - 2 : y + s + 2} a={a} s={10} c={C.faint}>
        {sub}
      </T>
    )}
  </g>
)

// Side label: leader runs horizontally to text at (x, y)
const SL = ({ p, x, y, text, sub, c = C.text, s = 10.5 }) => {
  const a = x >= p[0] ? 'start' : 'end'
  return (
    <g>
      <polyline points={`${p[0]},${p[1]} ${x + (a === 'start' ? -3 : 3)},${y - 3.5}`} fill="none" stroke={C.struct} strokeWidth="0.8" opacity="0.85" />
      <circle cx={p[0]} cy={p[1]} r="2" fill={c} />
      <T x={x} y={y} a={a} s={s} c={c}>
        {text}
      </T>
      {sub && (
        <T x={x} y={y + s + 1.5} a={a} s={10} c={C.faint}>
          {sub}
        </T>
      )}
    </g>
  )
}

const Ring = ({ x, y, r, c = C.brass }) => <circle cx={x} cy={y} r={r} fill="rgba(0,0,0,0.25)" stroke={c} strokeWidth="1.6" />

const Screw = ({ x, y, r = 5, ang = 30, c = '#c5ced4' }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={c} stroke="#3e4a52" strokeWidth="0.8" />
    <line
      x1={x - r * 0.75 * Math.cos((ang * Math.PI) / 180)}
      y1={y - r * 0.75 * Math.sin((ang * Math.PI) / 180)}
      x2={x + r * 0.75 * Math.cos((ang * Math.PI) / 180)}
      y2={y + r * 0.75 * Math.sin((ang * Math.PI) / 180)}
      stroke="#2c353b"
      strokeWidth={r > 4 ? 1.6 : 1.2}
    />
  </g>
)

// Flow arrow between boxes
const FA = ({ a, b, c = 'brass' }) => <Arrow a={a} b={b} c={c} w={1.5} />

/* ------------------------------------------------------------------ */
/* Watch parts                                                          */
/* ------------------------------------------------------------------ */
// Balance wheel, plan. screws: number of rim screws. heavy: angle of a heavy dot.
function Balance({ cx, cy, r, rot = 0, arms = 2, screws = 0, heavy, roller, pin = 90 }) {
  const ri = r * 0.86
  const ring = `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z M${cx - ri} ${cy} a${ri} ${ri} 0 1 1 ${2 * ri} 0 a${ri} ${ri} 0 1 1 ${-2 * ri} 0 Z`
  return (
    <g>
      <g transform={`rotate(${rot} ${cx} ${cy})`}>
        {screws > 0 &&
          Array.from({ length: screws }, (_, i) => {
            const a = (i * 360) / screws + 360 / screws / 2
            const p0 = pol(cx, cy, r, a)
            const p1 = pol(cx, cy, r + r * 0.13, a)
            return (
              <g key={i}>
                <line x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke={R.brassP} strokeWidth={Math.max(2.2, r * 0.07)} />
                <circle cx={p1[0]} cy={p1[1]} r={Math.max(2.4, r * 0.075)} fill={R.gold} stroke={R.brassD} strokeWidth="0.6" />
              </g>
            )
          })}
        <path d={ring} fill="url(#sk-brassG)" fillRule="evenodd" stroke="#7d5f22" strokeWidth="0.8" />
        {Array.from({ length: arms }, (_, i) => {
          const p = pol(cx, cy, ri + 1, (i * 360) / arms)
          const q = pol(cx, cy, ri + 1, (i * 360) / arms + 180)
          return i < arms / 2 || arms % 2 ? (
            <line key={i} x1={arms % 2 ? cx : q[0]} y1={arms % 2 ? cy : q[1]} x2={p[0]} y2={p[1]} stroke="#b08a3c" strokeWidth={Math.max(2.4, r * 0.1)} strokeLinecap="round" />
          ) : null
        })}
        <circle cx={cx} cy={cy} r={r * 0.15} fill="url(#sk-brassG)" stroke="#7d5f22" strokeWidth="0.8" />
      </g>
      {roller && (
        <g>
          <circle cx={cx} cy={cy} r={r * 0.3} fill="url(#sk-steel)" stroke={R.steelD} strokeWidth="0.7" opacity="0.95" />
          <circle cx={pol(cx, cy, r * 0.24, pin)[0]} cy={pol(cx, cy, r * 0.24, pin)[1]} r={Math.max(2.2, r * 0.06)} fill={C.ruby} stroke={R.rubyD} strokeWidth="0.6" />
        </g>
      )}
      <circle cx={cx} cy={cy} r={Math.max(1.6, r * 0.05)} fill={C.ruby} />
      {heavy !== undefined && <circle cx={pol(cx, cy, (r + ri) / 2, heavy)[0]} cy={pol(cx, cy, (r + ri) / 2, heavy)[1]} r={Math.max(3, r * 0.07)} fill={C.ruby} stroke={C.text} strokeWidth="1" />}
    </g>
  )
}

function Spring({ cx, cy, r0, r1, turns = 6, a0 = 0, c = C.steel, w = 0.9, ox = 0, oy = 0 }) {
  return <path d={spiralD(cx, cy, r0, r1, turns, a0, 260, ox, oy)} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" />
}

// Escape wheel with slanted club teeth, plan view.
function EscWheel({ cx, cy, r, n = 15, rot = 0 }) {
  const rb = r * 0.76
  const pitch = 360 / n
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = rot + i * pitch
    const pts = [pol(cx, cy, rb, a), pol(cx, cy, r, a + pitch * 0.52), pol(cx, cy, r, a + pitch * 0.68), pol(cx, cy, rb, a + pitch * 0.82)]
    d += `${i ? 'L' : 'M'}${fx(pts[0])}L${fx(pts[1])}L${fx(pts[2])}L${fx(pts[3])}`
  }
  d += 'Z'
  return (
    <g>
      <path d={d} fill="url(#sk-steel)" stroke="#5f717d" strokeWidth="0.7" />
      <circle cx={cx} cy={cy} r={r * 0.52} fill={C.ground} stroke="#5f717d" strokeWidth="0.7" />
      {[0, 1, 2, 3].map((i) => {
        const p = pol(cx, cy, r * 0.56, rot + 45 + i * 90)
        return <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke="#8fa2ae" strokeWidth={Math.max(1.6, r * 0.09)} />
      })}
      <circle cx={cx} cy={cy} r={r * 0.13} fill="url(#sk-steel)" stroke="#5f717d" strokeWidth="0.6" />
    </g>
  )
}

// Pallet fork, pivot at (x,y); fork end points up, stones down before rot.
function Fork({ x, y, k = 1, rot = 0 }) {
  const body =
    'M-3 -3 L-3.4 -44 L-8 -56 L-9.5 -64 L-4.2 -62 L-3 -52 L3 -52 L4.2 -62 L9.5 -64 L8 -56 L3.4 -44 L3 -3 L30 8 L34 18 L27 21 L5 10 L-5 10 L-27 21 L-34 18 L-30 8 Z'
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
      <path d={body} fill="url(#sk-steel)" stroke="#5f717d" strokeWidth={0.8 / k} strokeLinejoin="round" />
      <rect x="-34" y="15" width="9" height="19" rx="1" transform="rotate(14 -30 20)" fill={C.ruby} stroke={R.rubyD} strokeWidth={0.6 / k} />
      <rect x="25" y="15" width="9" height="19" rx="1" transform="rotate(-14 30 20)" fill={C.ruby} stroke={R.rubyD} strokeWidth={0.6 / k} />
      <circle cx="0" cy="0" r="3.4" fill={C.ground} stroke="#5f717d" strokeWidth={0.9 / k} />
    </g>
  )
}

// Watch from the front. rot turns the whole head; 0 = 12 up, crown right.
function Face({ cx, cy, r, rot = 0, crownHi, bal, heavy }) {
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      {[-1, 1].map((sy) =>
        [-1, 1].map((sx) => <rect key={`${sx}${sy}`} x={cx + sx * r * 0.52 - r * 0.13} y={cy + sy * r * 0.98 - r * 0.2} width={r * 0.26} height={r * 0.42} rx={r * 0.05} fill="#7b8a94" />)
      )}
      <rect x={cx + r * 0.97} y={cy - r * 0.15} width={r * 0.2} height={r * 0.3} rx={r * 0.04} fill={crownHi ? C.brass : '#9fb0ba'} stroke="#4e5f6a" strokeWidth="0.6" />
      <circle cx={cx} cy={cy} r={r} fill="url(#sk-steel)" stroke="#4e5f6a" strokeWidth="0.7" />
      <circle cx={cx} cy={cy} r={r * 0.85} fill="#26211b" stroke="#55503f" strokeWidth="0.6" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = i * 30 - 90
        const p0 = pol(cx, cy, r * 0.8, a)
        const p1 = pol(cx, cy, r * (i % 3 === 0 ? 0.62 : 0.7), a)
        return <line key={i} x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke={i === 0 ? C.brassHi : '#a59a86'} strokeWidth={i === 0 ? 2.4 : i % 3 === 0 ? 1.5 : 0.8} />
      })}
      {!bal && <line x1={cx} y1={cy} x2={cx} y2={cy - r * 0.6} stroke={C.text} strokeWidth="1.2" strokeLinecap="round" />}
      {!bal && <line x1={cx} y1={cy} x2={cx + r * 0.36} y2={cy + r * 0.12} stroke={C.text} strokeWidth="1.8" strokeLinecap="round" />}
      {bal && <circle cx={cx} cy={cy} r={r * 0.5} fill="none" stroke={R.brassP} strokeWidth={Math.max(2, r * 0.08)} />}
      {bal && heavy !== undefined && <circle cx={pol(cx, cy, r * 0.5, heavy - rot)[0]} cy={pol(cx, cy, r * 0.5, heavy - rot)[1]} r={Math.max(2.8, r * 0.09)} fill={C.ruby} stroke={C.text} strokeWidth="0.9" />}
      <circle cx={cx} cy={cy} r={Math.max(1.5, r * 0.06)} fill={C.brass} />
    </g>
  )
}

// Watch from the side. up = dial facing up.
function Side({ cx, cy, w = 70, up = true }) {
  const h = w * 0.2
  const dome = up ? -1 : 1
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={h * 0.25} fill="url(#sk-steel)" stroke="#4e5f6a" strokeWidth="0.7" />
      <path d={`M${cx - w * 0.42} ${cy + (dome * h) / 2} Q${cx} ${cy + dome * (h / 2 + w * 0.11)} ${cx + w * 0.42} ${cy + (dome * h) / 2} Z`} fill="url(#sk-glass)" stroke="#7fa0b0" strokeWidth="0.8" />
      <rect x={cx + w / 2} y={cy - h * 0.3} width={w * 0.09} height={h * 0.6} rx="1" fill="#9fb0ba" stroke="#4e5f6a" strokeWidth="0.6" />
    </g>
  )
}

// Balance staff in side elevation, vertical, top pivot at (x, y). k px per unit.
// Units (from the top): upper pivot 0–7, cone 7–12, collet seat 12–20,
// rivet 20–22, balance seat 22–24, hub 24–28, roller seat 28–33, cone 33–36, lower pivot 36–43.
const STAFF = [
  [0, 0.45], [0.6, 0.7], [7, 0.7], [7.6, 1.1], [12, 2.1], [20, 2.1], [20, 3.1], [22, 3.1], [22, 2.7], [24, 2.7],
  [24, 5.4], [28, 5.4], [28, 2.5], [33, 2.5], [36, 1.1], [36.4, 0.7], [42.4, 0.7], [43, 0.45],
]
const SY = { pivU: 3.5, cone: 9.5, collet: 16, rivet: 21, seat: 23, hub: 26, roller: 30.5, pivL: 39.5, len: 43 }
function Staff({ x, y, k = 4, broken, bent, rivetGone, fill = 'url(#sk-steelH)' }) {
  let pts = STAFF
  if (broken === 'lower') pts = STAFF.filter(([u]) => u <= 38).concat([[38.6, 0.7]])
  if (rivetGone) pts = pts.map(([u, w]) => (u >= 20 && u <= 22 && w > 3 ? [u, 2.7] : [u, w]))
  const L = pts.map(([u, w]) => [x - w * k, y + u * k])
  const Rr = pts.map(([u, w]) => [x + w * k, y + u * k]).reverse()
  const d = 'M' + L.concat(Rr).map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L') + ' Z'
  return (
    <g>
      <path d={d} fill={fill} stroke={R.steelD} strokeWidth="0.7" strokeLinejoin="round" transform={bent ? `rotate(0)` : undefined} />
      {bent && <path d={`M${x - 0.7 * k} ${y + 36.4 * k} q${-1.2 * k} ${3 * k} ${-3 * k} ${6.4 * k} l${1.4 * k} ${0.3 * k} q${1.6 * k} ${-3 * k} ${3 * k} ${-6.3 * k} Z`} fill={C.ruby} opacity="0.9" />}
    </g>
  )
}

// Balance wheel in section on a staff (wheel seated at SY.seat). w = rim radius px.
function WheelSec({ x, y, k = 4, w = 70, dish = 0 }) {
  const ys = y + SY.seat * k
  const armT = 1.4 * k * 0.8
  return (
    <g>
      <path d={`M${x - w} ${ys - armT / 2 + dish} L${x - 3 * k} ${ys - armT / 2} L${x + 3 * k} ${ys - armT / 2} L${x + w} ${ys - armT / 2 + dish} L${x + w} ${ys + armT / 2 + dish} L${x + 3 * k} ${ys + armT / 2} L${x - 3 * k} ${ys + armT / 2} L${x - w} ${ys + armT / 2 + dish} Z`} fill="url(#rs-bcut)" stroke={R.brassD} strokeWidth="0.6" />
      {[-1, 1].map((s) => (
        <rect key={s} x={s < 0 ? x - w - 5 : x + w - 1} y={ys - 7 + dish} width={6} height={14} rx="1" fill="url(#rs-bcut)" stroke={R.brassD} strokeWidth="0.6" />
      ))}
    </g>
  )
}

// Hole jewel in section, centred at (x, y): total width w, thickness h, hole d.
function JewelSec({ x, y, w = 28, h = 9, d = 4, sink = true, c = 'url(#rs-jewel)' }) {
  const hw = w / 2
  const hd = d / 2
  return (
    <g>
      {[-1, 1].map((s) => (
        <path
          key={s}
          d={`M${x + s * hd} ${y - h / 2 + (sink ? 2.5 : 0)} ${sink ? `Q${x + s * (hd + 3)} ${y - h / 2} ${x + s * (hd + 6)} ${y - h / 2}` : ''} L${x + s * hw} ${y - h / 2} L${x + s * hw} ${y + h / 2} L${x + s * hd} ${y + h / 2} Z`}
          fill={c}
          stroke={R.rubyD}
          strokeWidth="0.6"
        />
      ))}
    </g>
  )
}

// Plate in section, a slab from x0 to x1 at y (top) of thickness th, with a gap (hole) [g0, g1]
function Slab({ x0, x1, y, th, gap, fill = 'url(#rs-pcut)' }) {
  if (!gap) return <rect x={x0} y={y} width={x1 - x0} height={th} fill={fill} stroke={R.brassD} strokeWidth="0.6" />
  return (
    <g>
      <rect x={x0} y={y} width={gap[0] - x0} height={th} fill={fill} stroke={R.brassD} strokeWidth="0.6" />
      <rect x={gap[1]} y={y} width={x1 - gap[1]} height={th} fill={fill} stroke={R.brassD} strokeWidth="0.6" />
    </g>
  )
}

// Timegrapher screen with simple traces. lines: [{y (−1..1), c, fat, slope}]
function Screen({ x, y, w, h, lines = [], seed = 3 }) {
  let s = seed
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={R.lcd} stroke="#3c4c46" strokeWidth="1.2" />
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={x + w * f} y1={y + 2} x2={x + w * f} y2={y + h - 2} stroke={R.grid} />
      ))}
      <line x1={x + 2} y1={y + h / 2} x2={x + w - 2} y2={y + h / 2} stroke={R.grid} strokeDasharray="1 3" />
      {lines.map((ln, j) => {
        let d = ''
        for (let i = 0; i < 70; i++) {
          const px = x + 5 + (i / 69) * (w - 10)
          const jit = ln.fat ? (rnd() - 0.5) * ln.fat : (rnd() - 0.5) * 1.2
          const py = y + h / 2 - ln.y * (h / 2 - 6) - (ln.slope || 0) * (i / 69 - 0.5) * h + jit
          d += `M${px.toFixed(1)} ${py.toFixed(1)}l.01 0`
        }
        return <path key={j} d={d} stroke={ln.c} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      })}
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* Tools: (0,0) is the working point, the tool runs up (−y)             */
/* ------------------------------------------------------------------ */
function Tweezers({ c = C.steel, gap = 5, len = 96, tip = 1, w = 3 }) {
  return (
    <g fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
      <path d={`M${-tip} 0 L${-gap - 2} ${-len * 0.55} L${-1.5} ${-len}`} />
      <path d={`M${tip} 0 L${gap + 2} ${-len * 0.55} L1.5 ${-len}`} />
    </g>
  )
}
function Pegwood({ len = 90 }) {
  return <path d={`M-0.8 0 L0.8 0 L3.5 ${-len * 0.3} L3.5 ${-len} L-3.5 ${-len} L-3.5 ${-len * 0.3} Z`} fill={R.wood} stroke="#6f4a2b" strokeWidth="0.6" />
}
// Staking punch, face at (0,0). face: flat | round | hollow
function Punch({ len = 110, d = 10, face = 'flat', hole = 3 }) {
  const tipD = face === 'round' ? `M${-d / 2} -10 Q0 4 ${d / 2} -10 Z` : null
  return (
    <g>
      {face === 'round' ? (
        <path d={`M${-d / 2} -12 L${-d / 2} -10 Q0 3 ${d / 2} -10 L${d / 2} -12 Z`} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.6" />
      ) : (
        <rect x={-d / 2} y={-12} width={d} height={12} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.6" />
      )}
      {face === 'hollow' && <rect x={-hole / 2} y={-10} width={hole} height={10} fill={C.ground} />}
      {tipD && null}
      <rect x={-7} y={-len} width={14} height={Math.max(0, len - 12)} rx="1.5" fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.6" />
      <rect x={-8} y={-len} width={16} height={8} rx="2" fill="url(#rs-knurl)" stroke={R.steelD} strokeWidth="0.5" />
    </g>
  )
}
// Staking stump in section, top face centred at (x, y); hole width hw; width w; depth dp
function Stump({ x, y, w = 70, dp = 40, hw = 12 }) {
  return (
    <g>
      <rect x={x - w / 2} y={y} width={(w - hw) / 2} height={dp} fill="url(#rs-cut)" stroke={R.steelD} strokeWidth="0.6" />
      <rect x={x + hw / 2} y={y} width={(w - hw) / 2} height={dp} fill="url(#rs-cut)" stroke={R.steelD} strokeWidth="0.6" />
      <rect x={x - w / 2} y={y + dp} width={w} height={8} fill="url(#rs-cut)" stroke={R.steelD} strokeWidth="0.6" />
    </g>
  )
}
function Burnisher({ len = 120 }) {
  return (
    <g>
      <rect x={-len * 0.55} y={-6} width={len * 0.55} height={6} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.6" />
      <rect x={-len} y={-8} width={len * 0.45} height={10} rx="2" fill="url(#sk-wood)" stroke="#6f4a2b" strokeWidth="0.6" />
    </g>
  )
}
function Graver({ len = 110 }) {
  return (
    <g>
      <path d={`M0 0 L6 -8 L6 ${-len * 0.6} L-3 ${-len * 0.6} L-3 -10 Z`} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.6" />
      <rect x={-6} y={-len} width={15} height={len * 0.4} rx="3" fill="url(#sk-wood)" stroke="#6f4a2b" strokeWidth="0.6" />
    </g>
  )
}

/* ================================================================== */
/* rest-staff · replace a balance staff                                 */
/* ================================================================== */

function RsStaffDiagnose() {
  const k = 5
  const sx = 112
  const sy = 48
  return (
    <F h={330} view="Detail · a staff after a drop" scale="enlarged · schematic">
      <Staff x={sx} y={sy} k={k} />
      <WheelSec x={sx} y={sy} k={k} w={62} />
      <SL p={[sx + 0.7 * k, sy + SY.pivU * k]} x={sx + 34} y={sy + SY.pivU * k + 4} text="upper pivot" />
      <SL p={[sx + 5.4 * k, sy + SY.hub * k]} x={sx + 34} y={sy + SY.hub * k + 30} text="hub" />
      <SL p={[sx - 2.5 * k, sy + SY.roller * k]} x={sx - 36} y={sy + SY.roller * k + 16} text="roller seat" />
      <SL p={[sx + 0.7 * k, sy + SY.pivL * k]} x={sx + 34} y={sy + SY.pivL * k + 8} text="lower pivot" />
      <T x={sx - 60} y={sy + SY.seat * k - 12} s={10.5} c={C.dim}>balance</T>
      <Ring x={sx} y={sy + SY.pivU * k} r={13} />
      <Ring x={sx} y={sy + SY.pivL * k} r={13} />
      <T x={sx} y={316} a="middle" s={10.5} c={C.brassHi} w={600}>look at BOTH ends</T>

      <Tag x={232} y={42}>Under the loupe</Tag>
      {[
        ['Good', 'straight, full length', 'ok'],
        ['Snapped', 'tip missing', 'snap'],
        ['Bent', 'off the staff’s axis', 'bent'],
      ].map(([h, sub, kind], i) => {
        const cx = 262 + i * 74
        const cy = 96
        return (
          <g key={h}>
            <circle cx={cx} cy={cy} r={30} fill="rgba(0,0,0,0.25)" stroke={kind === 'ok' ? C.emerald : C.ruby} strokeWidth="1.4" />
            <path d={`M${cx - 10} ${cy + 26} L${cx - 3.5} ${cy + 6} L${cx + 3.5} ${cy + 6} L${cx + 10} ${cy + 26} Z`} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.6" />
            {kind === 'ok' && <rect x={cx - 3.5} y={cy - 22} width={7} height={28} rx="3" fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.6" />}
            {kind === 'snap' && <path d={`M${cx - 3.5} ${cy + 6} L${cx - 3.5} ${cy - 4} L${cx - 1} ${cy - 1} L${cx + 1.5} ${cy - 6} L${cx + 3.5} ${cy - 3} L${cx + 3.5} ${cy + 6} Z`} fill="url(#sk-steelH)" stroke={C.ruby} strokeWidth="0.8" />}
            {kind === 'bent' && <path d={`M${cx - 3.5} ${cy + 6} Q${cx - 4} ${cy - 8} ${cx + 8} ${cy - 20} L${cx + 12} ${cy - 16} Q${cx + 3} ${cy - 6} ${cx + 3.5} ${cy + 6} Z`} fill="url(#sk-steelH)" stroke={C.ruby} strokeWidth="0.8" />}
            {kind === 'bent' && <line x1={cx} y1={cy + 6} x2={cx} y2={cy - 24} stroke={C.faint} strokeDasharray="2 2" />}
            <Verdict x={cx + 22} y={cy - 22} ok={kind === 'ok'} r={7} />
            <T x={cx} y={cy + 46} a="middle" s={11} c={C.text} w={600}>{h}</T>
            <T x={cx} y={cy + 59} a="middle" s={10} c={C.faint}>{sub}</T>
          </g>
        )
      })}
      <Sep x1={232} y1={172} x2={468} y2={172} />
      <Tag x={232} y={192}>Symptoms that point at the staff</Tag>
      {['Balance flops loosely', 'Sits at the wrong height', 'Won’t run, though clean'].map((t, i) => (
        <g key={t}>
          <circle cx={240} cy={210 + i * 20} r={2.5} fill={C.brass} />
          <T x={250} y={214 + i * 20} s={11} c={C.text}>{t}</T>
        </g>
      ))}
      <rect x={232} y={272} width={236} height={44} rx="6" fill="rgba(208,168,79,0.08)" stroke={C.brass} />
      <T x={242} y={290} s={10.5} c={C.text}>The end that looks fine is often</T>
      <T x={242} y={305} s={10.5} c={C.text}>the broken one. Check both.</T>
    </F>
  )
}

function RsStaffMeasure() {
  const k = 5
  const sx = 100
  const sy = 42
  const xr = (u) => sx + u * k
  return (
    <F h={330} view="Dimensions · match the replacement" scale="enlarged · schematic">
      <Staff x={sx} y={sy} k={k} />
      {/* overall length */}
      <Dim a={[sx - 40, sy]} b={[sx - 40, sy + SY.len * k]} off={0} />
      <line x1={sx - 46} y1={sy} x2={sx - 4} y2={sy} stroke={C.dim} strokeWidth="0.6" opacity="0.6" />
      <line x1={sx - 46} y1={sy + SY.len * k} x2={sx - 4} y2={sy + SY.len * k} stroke={C.dim} strokeWidth="0.6" opacity="0.6" />
      <T x={sx - 48} y={sy + (SY.len * k) / 2} a="end" s={10.5} c={C.text}>overall</T>
      <T x={sx - 48} y={sy + (SY.len * k) / 2 + 13} a="end" s={10.5} c={C.text}>length</T>
      {/* pivot diameters */}
      <Dim a={[xr(-0.7), sy + 3 * k]} b={[xr(0.7), sy + 3 * k]} off={0} />
      <SL p={[xr(0.7), sy + 3 * k]} x={sx + 44} y={sy + 3 * k + 4} text="upper pivot Ø" />
      <Dim a={[xr(-0.7), sy + 40 * k]} b={[xr(0.7), sy + 40 * k]} off={0} />
      <SL p={[xr(0.7), sy + 40 * k]} x={sx + 44} y={sy + 40 * k + 4} text="lower pivot Ø" />
      {/* hub */}
      <Dim a={[xr(-5.4), sy + 28 * k + 8]} b={[xr(5.4), sy + 28 * k + 8]} off={0} />
      <SL p={[xr(5.4), sy + 27 * k]} x={sx + 44} y={sy + 27 * k + 22} text="hub Ø and height" />
      {/* rivet / seat */}
      <SL p={[xr(3.1), sy + 21 * k]} x={sx + 44} y={sy + 18 * k} text="rivet Ø" />
      <SL p={[xr(2.7), sy + 23 * k]} x={sx + 44} y={sy + 22 * k - 3} text="balance seat Ø" sub="suits the wheel’s hole" />

      <Sep x1={250} y1={30} x2={250} y2={316} />
      <Tag x={262} y={42}>Two ways to match</Tag>
      <Num x={272} y={66} n={1} />
      <T x={286} y={70} s={11} c={C.text} w={600}>Identify the calibre</T>
      <T x={286} y={84} s={10.5} c={C.dim}>order by its reference;</T>
      <T x={286} y={97} s={10.5} c={C.dim}>staffs come in variants</T>
      <Num x={272} y={122} n={2} />
      <T x={286} y={126} s={11} c={C.text} w={600}>Measure the old staff</T>
      <T x={286} y={140} s={10.5} c={C.dim}>with a micrometer, against</T>
      <T x={286} y={153} s={10.5} c={C.dim}>the replacement</T>
      {/* micrometer */}
      <g transform="translate(300 176)">
        <path d="M0 0 L0 50 Q0 64 14 64 L84 64 Q98 64 98 50 L98 40" fill="none" stroke="url(#sk-steelH)" strokeWidth="9" />
        <rect x={-4} y={-4} width={8} height={18} fill="url(#sk-steel)" stroke={R.steelD} strokeWidth="0.6" />
        <rect x={60} y={4} width={8} height={10} fill="url(#sk-steel)" stroke={R.steelD} strokeWidth="0.6" />
        <rect x={68} y={2} width={56} height={14} fill="url(#rs-knurl)" stroke={R.steelD} strokeWidth="0.6" />
        <rect x={9} y={6} width={6} height={6} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.5" />
        <line x1={15} y1={9} x2={60} y2={9} stroke={C.faint} strokeWidth="0.6" strokeDasharray="2 2" />
        <T x={30} y={34} s={10} c={C.faint}>anvil · spindle</T>
      </g>
      <rect x={262} y={260} width={206} height={50} rx="6" fill="rgba(123,165,131,0.08)" stroke={C.emerald} />
      <T x={272} y={279} s={11} c={C.emerald} w={600}>Buy two.</T>
      <T x={272} y={295} s={10.5} c={C.text}>The first one you rivet is rarely</T>
      <T x={272} y={308} s={10.5} c={C.text}>the one that ends up in the watch.</T>
    </F>
  )
}

function RsStaffStrip() {
  const k = 3.4
  return (
    <F h={330} view="Section · strip the balance bare" scale="schematic">
      {/* Panel 1: collet remover */}
      <Pn x={10} y={26} w={148} h={226} t="1 · Collet" ok />
      {(() => {
        const x = 84
        const y = 76
        const yc = y + SY.collet * k
        return (
          <g>
            <Staff x={x} y={y} k={k} />
            <WheelSec x={x} y={y} k={k} w={52} />
            <rect x={x - 7} y={yc - 4} width={14} height={8} fill="url(#rs-bcut)" stroke={R.brassD} strokeWidth="0.6" />
            <path d={`M${x + 7} ${yc} q14 -2 30 6`} fill="none" stroke={C.steel} strokeWidth="1" />
            {[-1, 1].map((s) => (
              <path key={s} d={`M${x + s * 4} ${yc + 5} L${x + s * 14} ${yc + 5} L${x + s * 22} ${yc - 34}`} fill="none" stroke="url(#sk-steelH)" strokeWidth="3" />
            ))}
            <rect x={x - 2.5} y={y - 22} width={5} height={21} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.5" />
            <Arrow a={[x - 46, yc - 12]} b={[x - 46, yc - 34]} c="brass" w={1.6} />
            <Arrow a={[x + 14, y - 22]} b={[x + 14, y - 4]} c="steel" w={1.4} />
            <T x={x - 46} y={yc - 52} a="middle" s={10} c={C.brassHi}>collet</T>
            <T x={x - 46} y={yc - 40} a="middle" s={10} c={C.brassHi}>lifts</T>
            <T x={x + 20} y={y - 12} s={10} c={C.steel}>pin on</T>
            <T x={x + 20} y={y} s={10} c={C.steel}>staff</T>
          </g>
        )
      })()}
      <T x={84} y={232} a="middle" s={10.5} c={C.text}>collet remover</T>
      <T x={84} y={245} a="middle" s={10} c={C.faint}>never pull the spring</T>

      {/* Panel 2: roller remover, balance upside down */}
      <Pn x={166} y={26} w={148} h={226} t="2 · Roller" ok />
      {(() => {
        const x = 240
        const y = 70
        const mid = y + (SY.len * k) / 2
        const jy = mid - (28.8 * k - SY.len * k / 2) // jaw level after flip
        return (
          <g>
            <g transform={`translate(0 ${2 * mid}) scale(1 -1)`}>
              <Staff x={x} y={y} k={k} />
              <WheelSec x={x} y={y} k={k} w={52} />
              <rect x={x - 11} y={y + 29.4 * k} width={22} height={3.2 * k} fill="url(#rs-cut)" stroke={R.steelD} strokeWidth="0.6" />
              <rect x={x + 5} y={y + 32.6 * k} width={4} height={6} fill={C.ruby} />
            </g>
            {/* slotted plate between hub and roller */}
            <rect x={x - 48} y={jy - 2} width={45} height={6} fill="url(#sk-steel)" stroke={R.steelD} strokeWidth="0.6" />
            <rect x={x + 3} y={jy - 2} width={45} height={6} fill="url(#sk-steel)" stroke={R.steelD} strokeWidth="0.6" />
            {/* hollow punch on the lower end */}
            <G x={x} y={y + 7 * k}>
              <Punch len={30} d={9} face="hollow" hole={3.4} />
            </G>
            <Arrow a={[x - 30, y - 12]} b={[x - 30, y + 14]} c="steel" w={1.4} />
            <T x={x - 36} y={y + 26} a="middle" s={10} c={C.steel}>punch</T>
            <SL p={[x + 40, jy + 1]} x={x + 50} y={jy - 16} text="slot" />
            <Arrow a={[x + 38, jy + 52]} b={[x + 38, jy + 76]} c="brass" w={1.6} />
            <T x={x - 66} y={jy + 64} s={10} c={C.brassHi}>staff and</T>
            <T x={x - 66} y={jy + 76} s={10} c={C.brassHi}>wheel drop</T>
          </g>
        )
      })()}
      <T x={240} y={232} a="middle" s={10.5} c={C.text}>roller remover</T>
      <T x={240} y={245} a="middle" s={10} c={C.faint}>balance upside down</T>

      {/* Panel 3: wrong way */}
      <Pn x={322} y={26} w={148} h={226} t="Tweezers" c={C.ruby} tc={C.ruby} ok={false} />
      {(() => {
        const x = 410
        const y = 64
        const yc = y + SY.collet * k
        return (
          <g>
            <Staff x={x} y={y} k={k} />
            <WheelSec x={x} y={y} k={k} w={52} />
            <rect x={x - 7} y={yc - 4} width={14} height={8} fill="url(#rs-bcut)" stroke={R.brassD} strokeWidth="0.6" />
            <path d={`M${x + 7} ${yc} q10 -12 28 -10`} fill="none" stroke={C.ruby} strokeWidth="1.2" />
            <G x={x - 9} y={yc + 2} ang={-62}>
              <Tweezers len={56} gap={3} w={2.4} c={C.ruby} />
            </G>
            <T x={x - 50} y={yc - 34} a="middle" s={10} c={C.ruby}>levered</T>
          </g>
        )
      })()}
      <T x={396} y={216} a="middle" s={10.5} c={C.ruby}>bends the hairspring</T>
      <T x={396} y={230} a="middle" s={10.5} c={C.ruby}>or cracks the roller</T>
      <rect x={10} y={262} width={460} height={56} rx="7" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <T x={22} y={282} s={11} c={C.text} w={600}>The proper removers push against the staff, not the part.</T>
      <T x={22} y={300} s={10.5} c={C.dim}>Hairspring off first, then the roller. The wheel must be completely bare</T>
      <T x={22} y={313} s={10.5} c={C.dim}>before the staff comes out.</T>
    </F>
  )
}

function RsStaffRemove() {
  const k = 3.2
  return (
    <F h={330} view="Section · two ways to remove the staff" scale="schematic">
      <Pn x={10} y={26} w={226} h={186} t="Lathe · safest" ok />
      {(() => {
        const x = 150
        const y = 52
        return (
          <g>
            <Staff x={x} y={y} k={k} rivetGone />
            <WheelSec x={x} y={y} k={k} w={56} />
            {[-1, 1].map((s) => (
              <path key={s} d={`M${x + s * 2.6 * k} ${y + 29 * k} L${x + s * 2.6 * k} ${y + 37 * k} L${x + s * 20} ${y + 44 * k} L${x + s * 20} ${y + 29 * k} Z`} fill="url(#rs-cut)" stroke={R.steelD} strokeWidth="0.6" />
            ))}
            <SL p={[x + 18, y + 40 * k]} x={x + 30} y={y + 40 * k + 4} text="chuck" />
            <G x={x + 2.8 * k} y={y + 20.5 * k} ang={58}>
              <Graver len={62} />
            </G>
            <path d={arcD(x, y + 12 * k, 14, 200, 340)} fill="none" stroke={C.brass} strokeWidth="1.5" markerEnd="url(#sk-a-brass)" />
            <T x={24} y={64} s={10.5} c={C.brassHi}>graver turns</T>
            <T x={24} y={77} s={10.5} c={C.brassHi}>the rivet away</T>
            <Arrow a={[56, y + 23 * k - 8]} b={[56, y + 23 * k - 34]} c="emerald" w={1.5} />
            <T x={24} y={y + 23 * k + 10} s={10.5} c={C.emerald}>wheel lifts off</T>
          </g>
        )
      })()}
      <T x={20} y={204} s={10.5} c={C.dim}>Nothing stresses the arms.</T>

      <Pn x={244} y={26} w={226} h={186} t="Staking set" />
      {(() => {
        const x = 344
        const y = 70
        const ys = y + SY.seat * k
        const hw = 5.4 * k * 2 + 4
        return (
          <g>
            <Staff x={x} y={y} k={k} />
            <WheelSec x={x} y={y} k={k} w={56} />
            <rect x={x - 46} y={ys + 3} width={46 - hw / 2} height={44} fill="url(#rs-cut)" stroke={R.steelD} strokeWidth="0.6" />
            <rect x={x + hw / 2} y={ys + 3} width={46 - hw / 2} height={44} fill="url(#rs-cut)" stroke={R.steelD} strokeWidth="0.6" />
            <G x={x} y={y + 7.4 * k}>
              <Punch len={36} d={12} face="hollow" hole={3} />
            </G>
            <Arrow a={[x + 22, y - 26]} b={[x + 22, y + 6]} c="brass" w={1.6} />
            <T x={x + 28} y={y - 16} s={10.5} c={C.brassHi}>flat punch</T>
            <T x={x + 28} y={y - 3} s={10} c={C.faint}>drives it out</T>
            <SL p={[x - 32, ys + 14]} x={x - 60} y={ys - 14} text="flat stump" />
            <SL p={[x + hw / 2 - 1, ys + 28]} x={x + 60} y={ys + 36} text="hole just" sub="clears the hub" />
          </g>
        )
      })()}
      <T x={254} y={199} s={10} c={C.dim}>Quick, but it can</T>
      <T x={254} y={210} s={10} c={C.dim}>dish the wheel.</T>

      <Pn x={10} y={220} w={460} h={100} t="Never" c={C.ruby} tc={C.ruby} ok={false} />
      {(() => {
        const x = 130
        const yr = 268
        return (
          <g>
            <path d={`M${x - 64} ${yr} L${x - 4} ${yr + 16} L${x + 4} ${yr + 16} L${x + 64} ${yr}`} fill="none" stroke={R.brassP} strokeWidth="4" />
            <line x1={x - 64} y1={yr} x2={x + 64} y2={yr} stroke={C.faint} strokeDasharray="2 3" />
            {[-1, 1].map((s) => (
              <rect key={s} x={x + s * 64 - 4} y={yr - 7} width={8} height={14} fill="url(#rs-bcut)" stroke={R.brassD} strokeWidth="0.6" />
            ))}
            {[-1, 1].map((s) => (
              <rect key={s} x={x + s * 64 - 9} y={yr + 7} width={18} height={30} fill="url(#rs-cut)" stroke={R.steelD} strokeWidth="0.6" />
            ))}
            <rect x={x - 3} y={yr - 30} width={6} height={50} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.6" />
            <Arrow a={[x + 18, yr - 34]} b={[x + 18, yr - 12]} c="ruby" w={1.8} />
            <T x={x} y={yr + 46} a="middle" s={10} c={C.ruby}>rim on supports, centre driven: arms dish</T>
          </g>
        )
      })()}
      <T x={286} y={254} s={11} c={C.text}>Wheel unsupported, or resting</T>
      <T x={286} y={268} s={11} c={C.text}>on its rim: you bend the arms</T>
      <T x={286} y={284} s={10.5} c={C.dim}>and spend longer truing than</T>
      <T x={286} y={298} s={10.5} c={C.dim}>the whole job took.</T>
    </F>
  )
}

function RsStaffRefit() {
  const k = 3.4
  return (
    <F h={320} view="Section + plan · roller, then hairspring" scale="schematic">
      <Pn x={10} y={26} w={220} h={232} t="1 · Press the roller on" />
      {(() => {
        const x = 104
        const y = 50
        const yr = y + SY.roller * k
        return (
          <g>
            <Staff x={x} y={y} k={k} />
            <WheelSec x={x} y={y} k={k} w={58} />
            <rect x={x - 11} y={yr - 7} width={22} height={9} fill="url(#rs-cut)" stroke={R.steelD} strokeWidth="0.6" />
            <rect x={x + 5} y={yr + 2} width={4} height={7} fill={C.ruby} />
            <Arrow a={[x - 34, yr + 26]} b={[x - 34, yr + 4]} c="brass" w={1.6} />
            <T x={x - 34} y={yr + 40} a="middle" s={10} c={C.brassHi}>square, firm</T>
            <SL p={[x + 9, yr + 6]} x={x + 40} y={yr + 22} text="impulse jewel" sub="facing down" />
            <SL p={[x + 11, yr - 4]} x={x + 58} y={yr - 12} text="roller table" />
          </g>
        )
      })()}
      <T x={20} y={250} s={10} c={C.faint}>friction fit: not forced</T>

      <Pn x={238} y={26} w={232} h={232} t="Orient the jewel to the arms" />
      {(() => {
        const cx = 330
        const cy = 140
        return (
          <g>
            <Balance cx={cx} cy={cy} r={64} arms={2} roller pin={90} />
            <line x1={cx} y1={cy - 80} x2={cx} y2={cy + 82} stroke={C.faint} strokeDasharray="3 3" />
            <T x={cx} y={cy + 96} a="middle" s={10} c={C.faint}>reference: the arms</T>
            <SL p={pol(cx, cy, 15.4, 90)} x={cx + 78} y={cy + 30} text="impulse" sub="jewel" />
            <SL p={[cx + 70, cy - 10]} x={cx + 78} y={cy - 22} text="arm" />
            <Note x={408} y={60} lines={['angle', 'as the', 'calibre', 'requires']} s={10} lh={13} c={C.dim} />
          </g>
        )
      })()}
      <rect x={10} y={266} width={460} height={46} rx="7" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <Num x={28} y={289} n={2} />
      <T x={44} y={286} s={11} c={C.text} w={600}>Then refit the hairspring collet</T>
      <T x={44} y={301} s={10.5} c={C.dim}>also a friction fit: square and firm, not forced</T>
    </F>
  )
}

function RsStaffOrder() {
  const steps = [
    ['True', 'flat and round'],
    ['Poise', 'next lesson'],
    ['Beat', 'rotate the collet'],
  ]
  return (
    <F h={300} view="Sequence · after riveting" scale="schematic">
      {steps.map(([h, sub], i) => {
        const x = 12 + i * 158
        return (
          <g key={h}>
            <Pn x={x} y={28} w={146} h={196} />
            <Num x={x + 18} y={46} n={i + 1} />
            <T x={x + 32} y={51} s={12} c={C.text} w={600}>{h}</T>
            <T x={x + 73} y={212} a="middle" s={10.5} c={C.dim}>{sub}</T>
            {i < 2 && <FA a={[x + 147, 126]} b={[x + 157, 126]} />}
          </g>
        )
      })}
      {/* True: side wobble + plan runout */}
      <g>
        <line x1={34} y1={92} x2={136} y2={92} stroke={R.brassP} strokeWidth="4" />
        <line x1={34} y1={92} x2={136} y2={84} stroke={C.ruby} strokeWidth="1.2" strokeDasharray="3 2" />
        <T x={85} y={78} a="middle" s={10} c={C.faint}>in the flat</T>
        <circle cx={85} cy={150} r={34} fill="none" stroke={R.brassP} strokeWidth="4" />
        <circle cx={88} cy={150} r={34} fill="none" stroke={C.ruby} strokeWidth="1" strokeDasharray="3 2" />
        <T x={85} y={198} a="middle" s={10} c={C.faint}>in the round</T>
      </g>
      {/* Poise: balance on jaws */}
      <g>
        <Balance cx={243} cy={118} r={40} arms={2} heavy={90} />
        <rect x={190} y={160} width={106} height={6} fill="url(#sk-steel)" />
        <T x={243} y={186} a="middle" s={10} c={C.faint}>heavy point settles low</T>
      </g>
      {/* Beat: line of centres */}
      <g>
        <line x1={330} y1={120} x2={460} y2={120} stroke={C.emerald} strokeDasharray="4 3" />
        <circle cx={354} cy={120} r={22} fill="url(#sk-steel)" stroke={R.steelD} />
        <circle cx={376} cy={120} r={4} fill={C.ruby} />
        <Fork x={420} y={120} k={0.55} rot={-90} />
        <EscWheel cx={452} cy={120} r={12} n={15} />
        <T x={395} y={164} a="middle" s={10} c={C.emerald}>jewel on the line</T>
        <T x={395} y={177} a="middle" s={10} c={C.emerald}>of centres at rest</T>
      </g>
      <rect x={12} y={236} width={456} height={52} rx="7" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <T x={24} y={256} s={11} c={C.text} w={600}>Riveting almost always disturbs the wheel.</T>
      <T x={24} y={273} s={10.5} c={C.dim}>Work in this order every time: out of order means doing them twice.</T>
    </F>
  )
}

/* ================================================================== */
/* rest-poise · poise the balance                                       */
/* ================================================================== */

function RsPoiseTrue() {
  return (
    <F h={300} view="Check · before you poise" scale="schematic">
      <Pn x={10} y={26} w={150} h={180} t="True in the flat" />
      <rect x={30} y={130} width={110} height={5} fill={R.brassP} />
      <line x1={30} y1={126} x2={140} y2={138} stroke={C.ruby} strokeWidth="1" strokeDasharray="3 2" />
      <path d={`M140 70 L140 118`} stroke={C.steel} strokeWidth="2" />
      <path d="M134 118 L146 118 L140 126 Z" fill={C.steel} />
      <T x={85} y={160} a="middle" s={10} c={C.dim}>rim runs in one plane</T>
      <T x={85} y={174} a="middle" s={10} c={C.faint}>caliper point: no rise and fall</T>

      <Pn x={166} y={26} w={150} h={180} t="True in the round" />
      <circle cx={241} cy={118} r={46} fill="none" stroke={R.brassP} strokeWidth="5" />
      <circle cx={244} cy={116} r={46} fill="none" stroke={C.ruby} strokeWidth="1" strokeDasharray="3 2" />
      <path d="M296 118 L290 118" stroke={C.steel} strokeWidth="2" />
      <path d="M302 112 L302 124 L292 118 Z" fill={C.steel} />
      <T x={241} y={184} a="middle" s={10} c={C.dim}>no wobble about the staff</T>

      <Pn x={322} y={26} w={148} h={180} t="Clean and dry" />
      <Balance cx={396} cy={112} r={42} arms={2} />
      <g transform="translate(422 88)">
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={i} cx={0} cy={0} rx={4 + i * 2.6} ry={3 + i * 2} fill="none" stroke={C.ruby} strokeWidth="0.8" opacity={0.9 - i * 0.15} />
        ))}
      </g>
      <T x={396} y={176} a="middle" s={11} c={C.ruby} w={600}>a fingerprint</T>
      <T x={396} y={190} a="middle" s={11} c={C.ruby} w={600}>is a weight</T>

      <Bx x={10} y={220} w={300} h={60} l={['Not true, not clean? Stop.', 'Poising it now is wasted work.']} c={C.ruby} />
      <FA a={[312, 250]} b={[330, 250]} c="emerald" />
      <Bx x={332} y={220} w={138} h={60} l={['All three pass', 'then poise']} c={C.emerald} />
    </F>
  )
}

function RsPoiseRemove() {
  return (
    <F h={330} view="Plan + detail · lighten the heavy point" scale="enlarged · schematic">
      <Balance cx={92} cy={110} r={62} arms={2} screws={12} heavy={90} />
      <T x={92} y={210} a="middle" s={10.5} c={C.ruby} w={600}>heavy point</T>
      <T x={92} y={223} a="middle" s={10} c={C.faint}>settles at the bottom</T>
      <circle cx={92} cy={181} r={11} fill="none" stroke={C.brass} strokeWidth="1.4" />
      <line x1={103} y1={178} x2={180} y2={140} stroke={C.brass} strokeWidth="0.8" />

      {/* inset: screw undercut */}
      <circle cx={232} cy={118} r={56} fill="rgba(0,0,0,0.25)" stroke={C.brass} strokeWidth="1.6" />
      <T x={232} y={50} a="middle" s={10} c={C.faint}>that screw, side view</T>
      <rect x={190} y={130} width={84} height={18} fill="url(#rs-bcut)" stroke={R.brassD} strokeWidth="0.6" />
      <T x={232} y={164} a="middle" s={10} c={C.faint}>rim</T>
      <rect x={226} y={106} width={12} height={26} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.5" />
      <path d="M210 86 L254 86 L254 106 L246 106 L240 102 L224 102 L218 106 L210 106 Z" fill={R.gold} stroke={R.brassD} strokeWidth="0.7" />
      <path d="M218 106 L224 102 L240 102 L246 106 Z" fill="none" stroke={C.ruby} strokeWidth="1.2" strokeDasharray="2 1.5" />
      <rect x={229} y={84} width={6} height={6} fill={C.ground} />
      <line x1={243} y1={104} x2={262} y2={196} stroke={C.struct} strokeWidth="0.8" />
      <circle cx={243} cy={104} r={2} fill={C.ruby} />
      <T x={262} y={208} a="middle" s={10.5} c={C.ruby}>undercut</T>

      <Sep x1={300} y1={30} x2={300} y2={236} />
      <Tag x={310} y={42}>Two corrections</Tag>
      <Num x={320} y={64} n={1} />
      <T x={334} y={68} s={11} c={C.text}>Screw undercutter</T>
      <T x={310} y={86} s={10} c={C.faint}>takes metal from under the</T>
      <T x={310} y={98} s={10} c={C.faint}>head; the top looks unchanged</T>
      <Num x={320} y={122} n={2} />
      <T x={334} y={126} s={11} c={C.text}>Lighter timing washer</T>
      <T x={310} y={144} s={10} c={C.faint}>swapped in under that screw</T>
      <g transform="translate(380 160)">
        <rect x={-30} y={0} width={20} height={5} fill={R.gold} stroke={R.brassD} strokeWidth="0.5" />
        <rect x={10} y={1} width={20} height={3} fill={R.gold} stroke={R.brassD} strokeWidth="0.5" />
        <Arrow a={[-8, 2.5]} b={[8, 2.5]} c="brass" w={1.2} />
      </g>
      <T x={310} y={198} s={10.5} c={C.brassHi}>Remove a very little,</T>
      <T x={310} y={212} s={10.5} c={C.brassHi}>retest, repeat.</T>

      <Pn x={10} y={244} w={226} h={76} t="Never file the rim" c={C.ruby} tc={C.ruby} ok={false} />
      <Note x={22} y={278} lines={['Destroys its truth, its finish', 'and its value in one stroke.']} s={10.5} lh={14} c={C.text} />
      <Pn x={244} y={244} w={226} h={76} t="Screwless Glucydur" c={C.steel} tc={C.steel} />
      <Note x={256} y={278} lines={['Nothing to adjust: poise is set', 'at manufacture. Leave it alone.']} s={10.5} lh={14} c={C.text} />
    </F>
  )
}

function RsPoiseDynamic() {
  const pos = [
    ['Crown up', -90],
    ['Crown down', 90],
    ['Crown left', 180],
    ['Crown right', 0],
  ]
  return (
    <F h={316} view="Method · four vertical readings" scale="schematic">
      <T x={14} y={42} s={11} c={C.text}>In the running watch, fully wound. Read the rate in each:</T>
      {pos.map(([name, rot], i) => {
        const cx = 66 + i * 116
        return (
          <g key={name}>
            <Pn x={cx - 54} y={54} w={108} h={128} />
            <Face cx={cx} cy={112} r={30} rot={rot} crownHi />
            <T x={cx} y={168} a="middle" s={11} c={C.text}>{name}</T>
          </g>
        )
      })}
      {/* rewinding loop */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <path d={`M${110 + i * 116} 190 Q${124 + i * 116} 204 ${138 + i * 116} 190`} fill="none" stroke={C.brass} strokeWidth="1.4" markerEnd="url(#sk-a-brass)" />
          <T x={124 + i * 116} y={216} a="middle" s={10} c={C.brassHi}>re-wind</T>
        </g>
      ))}
      <rect x={12} y={232} width={456} height={72} rx="7" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <T x={24} y={252} s={11} c={C.text} w={600}>Equal amplitude, or the comparison is invalid</T>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={30 + i * 34} y={266} width={22} height={28} fill="none" stroke={C.dim} />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={30 + i * 34} y={272} width={22} height={22} fill={C.emerald} opacity="0.7" />
      ))}
      <line x1={26} y1={272} x2={162} y2={272} stroke={C.emerald} strokeDasharray="3 2" />
      <T x={176} y={278} s={10.5} c={C.dim}>amplitude matched in all four, re-winding</T>
      <T x={176} y={292} s={10.5} c={C.dim}>between readings</T>
    </F>
  )
}

function RsPoiseRead() {
  const bars = [
    ['CU', 0.55],
    ['CD', 0.35],
    ['CL', 0.1],
    ['CR', 0.75],
  ]
  const top = (v) => 200 - 20 - v * 120
  return (
    <F h={330} view="Chart + plan · find the heavy side" scale="schematic · example">
      <Tag x={14} y={42}>Four vertical rates</Tag>
      <line x1={30} y1={60} x2={30} y2={200} stroke={C.struct} />
      <line x1={30} y1={200} x2={224} y2={200} stroke={C.struct} />
      <T x={26} y={66} a="end" s={10} c={C.faint}>fast</T>
      <T x={26} y={200} a="end" s={10} c={C.faint}>slow</T>
      {bars.map(([n, v], i) => {
        const x = 42 + i * 40
        const slow = v === 0.1
        return (
          <g key={n}>
            <rect x={x} y={top(v)} width={26} height={200 - top(v)} fill={slow ? C.ruby : C.steel} opacity={slow ? 0.85 : 0.55} />
            <T x={x + 13} y={216} a="middle" s={10.5} c={slow ? C.ruby : C.dim}>{n}</T>
          </g>
        )
      })}
      <line x1={40} y1={top(0.75)} x2={204} y2={top(0.75)} stroke={C.faint} strokeDasharray="2 2" />
      <line x1={40} y1={top(0.1)} x2={204} y2={top(0.1)} stroke={C.faint} strokeDasharray="2 2" />
      <Dim a={[204, top(0.75)]} b={[204, top(0.1)]} off={0} />
      <T x={210} y={(top(0.75) + top(0.1)) / 2 + 4} s={10} c={C.text}>spread</T>
      <T x={14} y={236} s={10.5} c={C.ruby}>slowest vertical, above ~220°: heavy point at the top</T>

      <Sep x1={262} y1={30} x2={262} y2={244} />
      <Tag x={274} y={42}>Slowest here: CL</Tag>
      <Face cx={340} cy={136} r={58} rot={180} crownHi bal heavy={270} />
      <line x1={340} y1={74} x2={340} y2={204} stroke={C.faint} strokeDasharray="3 3" />
      <line x1={344} y1={106} x2={404} y2={74} stroke={C.struct} strokeWidth="0.8" />
      <T x={408} y={72} s={10.5} c={C.ruby}>heavy</T>
      <T x={408} y={85} s={10.5} c={C.ruby}>point</T>
      <Arrow a={[448, 126]} b={[448, 180]} c="steel" w={1.4} />
      <T x={448} y={118} a="middle" s={10} c={C.steel}>gravity</T>
      <T x={274} y={226} s={10} c={C.dim}>balance at rest:</T>
      <T x={274} y={239} s={10} c={C.dim}>correct on that side</T>

      <rect x={12} y={252} width={456} height={66} rx="7" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <Num x={28} y={272} n={1} r={7} />
      <T x={40} y={276} s={10.5} c={C.text}>one small correction</T>
      <FA a={[164, 272]} b={[178, 272]} />
      <Num x={192} y={272} n={2} r={7} />
      <T x={204} y={276} s={10.5} c={C.text}>re-measure: did the spread shrink?</T>
      <T x={24} y={296} s={10.5} c={C.dim}>Verify empirically rather than trust the rule blindly. A spread of a</T>
      <T x={24} y={310} s={10.5} c={C.dim}>few seconds a day is an excellent result on a wristwatch.</T>
    </F>
  )
}

function RsPoiseNot() {
  const c = [
    ['Bent pivot', 'roll the arbor'],
    ['Dirty or worn jewel', 'inspect, clean'],
    ['Hairspring rubbing', 'check its clearance'],
    ['Escapement fault', 'inspect lock and drop'],
  ]
  return (
    <F h={300} view="Decision · is it really poise?" scale="schematic">
      <Bx x={12} y={30} w={190} h={48} l={['Rate varies between', 'positions']} c={C.ruby} />
      <FA a={[204, 54]} b={[226, 54]} />
      <T x={232} y={50} s={11} c={C.text} w={600}>Rule these out first</T>
      <T x={232} y={65} s={10.5} c={C.dim}>each one causes positional variation too</T>
      {c.map(([h, s], i) => (
        <g key={h}>
          <rect x={12 + (i % 2) * 232} y={92 + Math.floor(i / 2) * 58} width={224} height={48} rx="6" fill="rgba(255,255,255,0.025)" stroke={C.line} />
          <Num x={30 + (i % 2) * 232} y={116 + Math.floor(i / 2) * 58} n={i + 1} r={8} c={C.steel} />
          <T x={46 + (i % 2) * 232} y={113 + Math.floor(i / 2) * 58} s={11} c={C.text}>{h}</T>
          <T x={46 + (i % 2) * 232} y={127 + Math.floor(i / 2) * 58} s={10} c={C.faint}>{s}</T>
        </g>
      ))}
      <FA a={[240, 210]} b={[240, 226]} c="emerald" />
      <Bx x={120} y={228} w={240} h={40} l={['All clear: now poise the wheel']} c={C.emerald} />
      <T x={240} y={288} a="middle" s={10.5} c={C.dim}>Poising a healthy wheel to fix someone else’s problem wastes an afternoon.</T>
    </F>
  )
}


/* ================================================================== */
/* rest-positions · six-position timing                                 */
/* ================================================================== */

function RsPosSix() {
  const vert = [
    ['Crown up', 'CU', -90],
    ['Crown down', 'CD', 90],
    ['Crown left', '6 up', 180],
    ['Crown right', '12 up', 0],
  ]
  return (
    <F h={330} view="Positions · the six readings" scale="schematic">
      <Tag x={14} y={42}>Two horizontal</Tag>
      {[
        ['Dial up', 'DU', true],
        ['Dial down', 'DD', false],
      ].map(([n, ab, up], i) => {
        const cx = 70 + i * 128
        return (
          <g key={n}>
            <Pn x={cx - 56} y={52} w={112} h={92} />
            <line x1={cx - 44} y1={110} x2={cx + 44} y2={110} stroke={C.line} strokeWidth="2" />
            <Side cx={cx - 4} cy={up ? 100 : 100} w={70} up={up} />
            <T x={cx} y={130} a="middle" s={11} c={C.text}>{n}</T>
            <T x={cx} y={72} a="middle" s={11} c={C.brassHi} w={700}>{ab}</T>
          </g>
        )
      })}
      <Note x={276} y={66} lines={['Pivots run on their', 'flat ends.']} s={10.5} lh={14} c={C.dim} />
      <Note x={276} y={104} lines={['Read each at matched,', 'healthy amplitude.']} s={10.5} lh={14} c={C.dim} />

      <Tag x={14} y={166}>Four vertical</Tag>
      {vert.map(([n, ab, rot], i) => {
        const cx = 70 + i * 113
        return (
          <g key={n}>
            <Pn x={cx - 52} y={176} w={104} h={112} />
            <Face cx={cx} cy={222} r={26} rot={rot} crownHi />
            <T x={cx} y={268} a="middle" s={11} c={C.text}>{n}</T>
            <T x={cx} y={281} a="middle" s={10} c={C.faint}>{ab}</T>
          </g>
        )
      })}
      <T x={14} y={306} s={10.5} c={C.dim}>A wristwatch is usually judged on DU, DD and the verticals; chronometer-grade</T>
      <T x={14} y={320} s={10.5} c={C.dim}>adjustment uses five or six. Re-wind between positions.</T>
    </F>
  )
}

function RsPosHV() {
  const ampN = [0.86, 0.84, 0.72, 0.7, 0.71, 0.73]
  const ampF = [0.86, 0.84, 0.4, 0.36, 0.42, 0.38]
  const names = ['DU', 'DD', 'CU', 'CD', 'CL', 'CR']
  const chart = (x, vals, title, ok) => (
    <g>
      <Pn x={x} y={26} w={228} h={150} t={title} ok={ok} c={ok ? C.line : C.ruby} tc={ok ? undefined : C.ruby} />
      <line x1={x + 16} y1={146} x2={x + 214} y2={146} stroke={C.struct} />
      {vals.map((v, i) => (
        <g key={i}>
          <rect x={x + 22 + i * 32} y={146 - v * 96} width={22} height={v * 96} fill={i < 2 ? C.brass : C.steel} opacity="0.75" />
          <T x={x + 33 + i * 32} y={162} a="middle" s={10} c={C.dim}>{names[i]}</T>
        </g>
      ))}
    </g>
  )
  return (
    <F h={330} view="Chart · amplitude, horizontal vs vertical" scale="schematic · no values">
      {chart(10, ampN, 'Small, consistent gap', true)}
      {chart(242, ampF, 'Large vertical drop', false)}
      <T x={124} y={190} a="middle" s={10.5} c={C.emerald}>normal</T>
      <T x={356} y={190} a="middle" s={10.5} c={C.ruby}>escapement, pivot or jewel</T>
      <T x={356} y={203} a="middle" s={10.5} c={C.ruby}>problem, not poise</T>

      {/* pivot insets */}
      <Tag x={14} y={226}>Why the gap is normal</Tag>
      <g transform="translate(0 552) scale(1 -1)">
        <Ring x={70} y={276} r={36} />
        <rect x={50} y={248} width={40} height={6} fill="url(#rs-jewel)" stroke={R.rubyD} strokeWidth="0.5" />
        <JewelSec x={70} y={266} w={44} h={10} d={8} sink={false} />
        <rect x={66.5} y={256} width={7} height={36} rx="3" fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.5" />
      </g>
      <T x={116} y={262} s={10.5} c={C.text}>horizontal:</T>
      <T x={116} y={276} s={10.5} c={C.dim}>runs on its</T>
      <T x={116} y={290} s={10.5} c={C.dim}>flat end</T>
      <g>
        <Ring x={232} y={276} r={36} />
        <g transform="rotate(90 232 276)">
          <JewelSec x={232} y={266} w={44} h={10} d={8} sink={false} />
          <rect x={228.5} y={256} width={7} height={36} rx="3" fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.5" />
        </g>
        <T x={278} y={262} s={10.5} c={C.text}>vertical:</T>
        <T x={278} y={276} s={10.5} c={C.dim}>runs on its side,</T>
        <T x={278} y={290} s={10.5} c={C.dim}>more friction</T>
      </g>
      <rect x={378} y={226} width={92} height={92} rx="7" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <Note x={424} y={246} a="middle" lines={['Poise only', 'explains', 'differences', 'AMONG the', 'verticals']} s={10.5} lh={13.5} c={C.text} />
    </F>
  )
}

function RsPosSpread() {
  const pts = [
    ['CU', 0.62],
    ['CD', 0.42],
    ['CL', 0.14],
    ['CR', 0.86],
  ]
  const X = (v) => 40 + v * 400
  return (
    <F h={300} view="Chart · the vertical spread" scale="schematic · example">
      <T x={14} y={40} s={11} c={C.text}>List the four vertical rates on one line:</T>
      <line x1={30} y1={124} x2={450} y2={124} stroke={C.struct} strokeWidth="1.2" markerEnd="url(#sk-a-dim)" />
      <T x={30} y={144} s={10} c={C.faint}>slower</T>
      <T x={450} y={144} a="end" s={10} c={C.faint}>faster</T>
      {pts.map(([n, v]) => (
        <g key={n}>
          <circle cx={X(v)} cy={124} r={6} fill={v === 0.14 ? C.ruby : C.steel} stroke={C.ground} strokeWidth="1" />
          <T x={X(v)} y={108} a="middle" s={11} c={v === 0.14 ? C.ruby : C.text} w={600}>{n}</T>
        </g>
      ))}
      <Dim a={[X(0.14), 124]} b={[X(0.86), 124]} off={-52} text="spread = positional error" />
      <Sep x1={12} y1={176} x2={468} y2={176} />
      <Tag x={14} y={198}>Then read the slowest</Tag>
      <Face cx={84} cy={250} r={36} rot={180} crownHi bal heavy={270} />
      <T x={140} y={232} s={11} c={C.ruby} w={600}>Slowest (here CL), above ~220°: heavy point at the top</T>
      <T x={140} y={250} s={10.5} c={C.dim}>That gives the axis to correct, exactly as in</T>
      <T x={140} y={264} s={10.5} c={C.dim}>dynamic poising. The fastest and slowest</T>
      <T x={140} y={278} s={10.5} c={C.dim}>define it; the other two confirm it.</T>
    </F>
  )
}

function RsPosOrder() {
  const st = [
    ['Balance true and clean', ''],
    ['Fix escapement, pivot or jewel faults', 'behind a big horizontal-to-vertical loss'],
    ['Dynamic-poise', 'to close the vertical spread'],
    ['Beat error', 'with the stud carrier'],
    ['Overall rate, last', 'with the regulator'],
  ]
  return (
    <F h={330} view="Sequence · correct in the right order" scale="schematic">
      {st.map(([h, s], i) => (
        <g key={h}>
          <rect x={12} y={30 + i * 50} width={300} height={40} rx="6" fill="rgba(255,255,255,0.03)" stroke={i === 4 ? C.emerald : C.struct} />
          <Num x={32} y={50 + i * 50} n={i + 1} c={i === 4 ? C.emerald : C.brass} />
          <T x={50} y={s ? 47 + i * 50 : 54 + i * 50} s={11} c={C.text} w={600}>{h}</T>
          {s && <T x={50} y={61 + i * 50} s={10} c={C.faint}>{s}</T>}
          {i < 4 && <FA a={[162, 70 + i * 50]} b={[162, 80 + i * 50]} />}
        </g>
      ))}
      <rect x={326} y={30} width={142} height={240} rx="7" fill="rgba(194,88,99,0.07)" stroke={C.ruby} />
      <Verdict x={344} y={50} ok={false} r={8} />
      <T x={358} y={54} s={11} c={C.ruby} w={600}>Rate first?</T>
      <Note x={338} y={80} lines={['Correcting rate', 'before poise just', 'hides the error.']} s={10.5} lh={14} c={C.text} />
      <Note x={338} y={150} lines={['regulator', 'moves every', 'position', 'equally']} s={10} lh={13} c={C.faint} />
      <T x={14} y={300} s={10.5} c={C.dim}>Each step assumes the one before it is done. The regulator never closes a</T>
      <T x={14} y={314} s={10.5} c={C.dim}>positional spread: it shifts all six readings together.</T>
    </F>
  )
}

function RsPosHairspring() {
  const cy = 112
  return (
    <F h={320} view="Plan · hairspring faults poising can’t cure" scale="schematic">
      <Pn x={10} y={26} w={148} h={176} t="Flat, centred" ok />
      <Spring cx={84} cy={cy} r0={7} r1={52} turns={9} />
      <circle cx={84} cy={cy} r={6} fill="url(#rs-bcut)" stroke={R.brassD} />
      <circle cx={84} cy={cy} r={1.8} fill={C.ruby} />
      <T x={84} y={188} a="middle" s={10.5} c={C.dim}>breathes evenly</T>

      <Pn x={166} y={26} w={148} h={176} t="Off-centre" c={C.ruby} tc={C.ruby} ok={false} />
      <Spring cx={240} cy={cy} r0={7} r1={52} turns={9} ox={-12} oy={6} />
      <circle cx={228} cy={cy + 6} r={6} fill="url(#rs-bcut)" stroke={R.brassD} />
      <circle cx={228} cy={cy + 6} r={1.8} fill={C.ruby} />
      <line x1={240} y1={cy - 58} x2={240} y2={cy + 58} stroke={C.faint} strokeDasharray="2 3" />
      <T x={240} y={188} a="middle" s={10.5} c={C.dim}>rate changes with position</T>

      <Pn x={322} y={26} w={148} h={176} t="Rubbing coil" c={C.ruby} tc={C.ruby} ok={false} />
      <Spring cx={396} cy={cy} r0={7} r1={52} turns={9} />
      <path d={arcD(396, cy, 46, -60, 10)} fill="none" stroke={C.ruby} strokeWidth="2.6" />
      <path d={arcD(396, cy, 52, -60, 10)} fill="none" stroke={C.ruby} strokeWidth="2.6" />
      <circle cx={396} cy={cy} r={6} fill="url(#rs-bcut)" stroke={R.brassD} />
      <T x={396} y={188} a="middle" s={10.5} c={C.dim}>coils touch in some positions</T>

      <Bx x={10} y={220} w={180} h={50} l={['Vertical spread won’t', 'close after poising']} c={C.ruby} />
      <FA a={[192, 245]} b={[214, 245]} />
      <Bx x={216} y={220} w={140} h={50} l={['Re-check the', 'hairspring']} c={C.brass} />
      <FA a={[358, 245]} b={[376, 245]} c="emerald" />
      <Bx x={378} y={220} w={92} h={50} l={['then decide', 'on metal']} c={C.emerald} />
      <T x={14} y={296} s={10.5} c={C.dim}>Before removing more metal from the balance: is the spring flat, centred</T>
      <T x={14} y={310} s={10.5} c={C.dim}>and breathing concentrically? See “Hairspring work”.</T>
    </F>
  )
}

function RsPosGood() {
  const names = ['DU', 'DD', 'CU', 'CD', 'CL', 'CR']
  return (
    <F h={330} view="Targets · what good looks like" scale="schematic">
      <Tag x={14} y={42}>On a decent wristwatch</Tag>
      <rect x={14} y={54} width={220} height={58} rx="6" fill="rgba(123,165,131,0.08)" stroke={C.emerald} />
      <T x={26} y={74} s={11} c={C.text} w={600}>Vertical spread</T>
      <T x={26} y={92} s={11} c={C.emerald}>a few seconds a day</T>
      <rect x={246} y={54} width={222} height={58} rx="6" fill="rgba(123,165,131,0.08)" stroke={C.emerald} />
      <T x={258} y={74} s={11} c={C.text} w={600}>Positional range</T>
      <T x={258} y={92} s={11} c={C.emerald}>within ~10–15 s/day</T>
      <T x={14} y={130} s={10.5} c={C.dim}>Chronometer adjustment is tighter still.</T>

      {/* diminishing returns */}
      <Tag x={14} y={156}>Effort vs gain</Tag>
      <line x1={24} y1={250} x2={220} y2={250} stroke={C.struct} />
      <line x1={24} y1={250} x2={24} y2={166} stroke={C.struct} />
      <path d="M24 250 C60 182 100 172 220 168" fill="none" stroke={C.brass} strokeWidth="2" />
      <rect x={150} y={164} width={70} height={86} fill="rgba(194,88,99,0.10)" />
      <T x={185} y={240} a="middle" s={10} c={C.ruby}>last second</T>
      <T x={122} y={266} a="middle" s={10} c={C.faint}>effort</T>
      <T x={30} y={178} s={10} c={C.faint}>gain</T>
      <T x={14} y={290} s={10.5} c={C.dim}>Chasing it risks over-</T>
      <T x={14} y={304} s={10.5} c={C.dim}>correcting a wheel that</T>
      <T x={14} y={318} s={10.5} c={C.dim}>was fine.</T>

      {/* practice log */}
      <Tag x={246} y={156}>Practice Log</Tag>
      {names.map((n, i) => (
        <T key={n} x={302 + i * 28} y={180} a="middle" s={10} c={C.text}>{n}</T>
      ))}
      {['Before', 'After'].map((r, j) => (
        <g key={r}>
          <T x={250} y={206 + j * 28} s={10.5} c={C.dim}>{r}</T>
          {names.map((n, i) => (
            <rect key={n} x={290 + i * 28} y={192 + j * 28} width={24} height={20} rx="2" fill="rgba(255,255,255,0.03)" stroke={C.line} />
          ))}
        </g>
      ))}
      <T x={246} y={268} s={10.5} c={C.dim}>Record all six positions before</T>
      <T x={246} y={282} s={10.5} c={C.dim}>and after: the table is the</T>
      <T x={246} y={296} s={10.5} c={C.dim}>clearest proof the work worked.</T>
    </F>
  )
}

/* ================================================================== */
/* rest-hairspring · truing, centring and vibrating                     */
/* ================================================================== */

function RsHsMagnet() {
  const cy = 128
  return (
    <F h={316} view="Sequence · demagnetise before you bend" scale="schematic">
      <Pn x={10} y={26} w={150} h={200} t="Looks bent" c={C.ruby} tc={C.ruby} />
      <path d={spiralD(85, cy, 6, 30, 4)} fill="none" stroke={C.steel} strokeWidth="0.9" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={arcD(85, cy, 34 + i * 1.6, 200, 330)} fill="none" stroke={C.steel} strokeWidth="0.9" />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={arcD(85, cy, 34 + i * 6, -30, 200)} fill="none" stroke={C.steel} strokeWidth="0.9" />
      ))}
      <circle cx={85} cy={cy} r={5} fill="url(#rs-bcut)" />
      <SL p={[70, cy - 38]} x={96} y={66} text="coils cling" />
      <T x={85} y={196} a="middle" s={10.5} c={C.ruby}>watch gains wildly</T>
      <T x={85} y={210} a="middle" s={10} c={C.faint}>usually magnetism</T>

      <FA a={[162, 126]} b={[178, 126]} />
      <Pn x={180} y={26} w={130} h={200} t="Demagnetise" c={C.brass} tc={C.brass} />
      <rect x={198} y={120} width={94} height={44} rx="6" fill="#2c2722" stroke="#55503f" />
      <rect x={210} y={128} width={70} height={10} rx="2" fill="rgba(255,255,255,0.05)" stroke={C.line} />
      <circle cx={280} cy={152} r={5} fill={C.brass} />
      <Side cx={238} cy={108} w={56} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${222 - i * 8} 96 q16 -${14 + i * 6} 32 0`} fill="none" stroke={C.steel} strokeWidth="0.9" opacity={0.8 - i * 0.2} />
      ))}
      <T x={245} y={190} a="middle" s={11} c={C.brassHi} w={600}>about ten seconds</T>
      <T x={245} y={204} a="middle" s={10} c={C.faint}>no tweezers</T>

      <FA a={[312, 126]} b={[328, 126]} c="emerald" />
      <Pn x={330} y={26} w={140} h={200} t="Even again" ok />
      <Spring cx={400} cy={cy} r0={6} r1={58} turns={9} />
      <circle cx={400} cy={cy} r={5} fill="url(#rs-bcut)" />
      <T x={400} y={210} a="middle" s={10.5} c={C.emerald}>no correction needed</T>
      <rect x={10} y={240} width={460} height={62} rx="7" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <T x={22} y={260} s={11} c={C.text} w={600}>Rule out magnetism first.</T>
      <T x={22} y={278} s={10.5} c={C.dim}>Clinging coils look exactly like a distorted spring. Demagnetise before</T>
      <T x={22} y={292} s={10.5} c={C.dim}>you touch anything: many “bent hairsprings” are fixed this way.</T>
    </F>
  )
}

function RsHsHandle() {
  return (
    <F h={330} view="Side view · handle only at the ends" scale="schematic">
      {/* balance cock */}
      <path d="M20 54 L150 54 L150 66 L40 66 L40 84 L20 84 Z" fill="url(#rs-pcut)" stroke={R.brassD} strokeWidth="0.6" />
      <T x={24} y={46} s={10.5} c={C.dim}>balance cock</T>
      {/* stud */}
      <rect x={112} y={66} width={8} height={12} fill="url(#sk-steel)" stroke={R.steelD} strokeWidth="0.5" />
      {/* spring stretched as balance hangs */}
      <path d="M116 78 C118 100 96 104 98 124 C100 140 86 144 88 160" fill="none" stroke={C.steel} strokeWidth="1.1" />
      {/* collet + staff + balance */}
      <rect x={82} y={158} width={12} height={7} fill="url(#rs-bcut)" stroke={R.brassD} strokeWidth="0.6" />
      <rect x={86} y={150} width={4} height={50} fill="url(#sk-steelH)" />
      <rect x={34} y={176} width={108} height={5} fill={R.brassP} />
      <rect x={30} y={172} width={6} height={13} fill={R.brassP} />
      <rect x={140} y={172} width={6} height={13} fill={R.brassP} />
      <line x1={160} y1={66} x2={196} y2={66} stroke={C.dim} strokeWidth="0.6" />
      <line x1={150} y1={150} x2={196} y2={150} stroke={C.dim} strokeWidth="0.6" />
      <Dim a={[190, 66]} b={[190, 150]} off={0} />
      <T x={198} y={102} s={11} c={C.brassHi} w={600}>about a</T>
      <T x={198} y={116} s={11} c={C.brassHi} w={600}>centimetre</T>
      <T x={198} y={130} s={10} c={C.faint}>never more</T>
      <T x={30} y={214} s={10.5} c={C.dim}>Lifting the balance by its cock</T>
      <T x={30} y={228} s={10.5} c={C.dim}>stretches the spring: the</T>
      <T x={30} y={242} s={10.5} c={C.dim}>commonest self-inflicted damage.</T>

      <Sep x1={282} y1={30} x2={282} y2={250} />
      <Tag x={294} y={42}>Where tweezers may touch</Tag>
      <Spring cx={354} cy={142} r0={8} r1={56} turns={8} />
      <circle cx={354} cy={142} r={7} fill="url(#rs-bcut)" stroke={R.brassD} />
      <rect x={406} y={130} width={10} height={10} fill="url(#sk-steel)" stroke={R.steelD} />
      <Verdict x={354} y={142} ok r={7} />
      <Verdict x={420} y={122} ok r={7} />
      <circle cx={354 - 34} cy={142 - 12} r={6} fill="none" stroke={C.ruby} strokeWidth="1.4" />
      <Verdict x={306} y={100} ok={false} r={7} />
      <line x1={312} y1={105} x2={318} y2={124} stroke={C.ruby} />
      <T x={294} y={222} s={10.5} c={C.text}>collet or stud only</T>
      <T x={294} y={236} s={10.5} c={C.ruby}>never grip a coil or pull</T>
      <rect x={12} y={262} width={456} height={56} rx="7" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <T x={24} y={282} s={11} c={C.text} w={600}>Every correction is permanent.</T>
      <T x={24} y={300} s={10.5} c={C.dim}>Support the work. Bend a fraction, look, bend again: you cannot un-crease it.</T>
    </F>
  )
}

function RsHsTrue() {
  return (
    <F h={330} view="Plan + side · true in the round and flat" scale="schematic">
      <Pn x={10} y={26} w={226} h={150} t="In the round" />
      <Spring cx={70} cy={104} r0={6} r1={44} turns={7} />
      {/* crowding: a coil pushed out towards its neighbour */}
      <path d={arcD(70, 104, 38.5, 10, 70)} fill="none" stroke={C.ruby} strokeWidth="2.2" />
      <circle cx={70} cy={104} r={5} fill="url(#rs-bcut)" />
      <Verdict x={116} y={56} ok={false} r={7} />
      <Spring cx={176} cy={104} r0={6} r1={44} turns={7} />
      <circle cx={176} cy={104} r={5} fill="url(#rs-bcut)" />
      <Verdict x={222} y={56} ok r={7} />
      <T x={70} y={166} a="middle" s={10} c={C.ruby}>coil crowds neighbour</T>
      <T x={176} y={166} a="middle" s={10} c={C.emerald}>even spacing</T>

      <Pn x={244} y={26} w={226} h={150} t="In the flat" />
      <rect x={302} y={50} width={4} height={56} fill="url(#sk-steelH)" />
      <path d="M262 92 L304 72 L346 92" fill="none" stroke={C.ruby} strokeWidth="1.6" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${270 + i * 8} ${88 - i * 3.7} L${338 - i * 8} ${88 - i * 3.7}`} stroke={C.ruby} strokeWidth="0.6" opacity="0.5" />
      ))}
      <T x={304} y={120} a="middle" s={10} c={C.ruby}>coned / dished</T>
      <Verdict x={354} y={58} ok={false} r={7} />
      <rect x={410} y={50} width={4} height={56} fill="url(#sk-steelH)" />
      <line x1={370} y1={80} x2={454} y2={80} stroke={C.emerald} strokeWidth="1.6" />
      <T x={412} y={120} a="middle" s={10} c={C.emerald}>one plane</T>
      <T x={412} y={133} a="middle" s={10} c={C.faint}>⊥ to the staff</T>
      <Verdict x={456} y={58} ok r={7} />
      <T x={356} y={166} a="middle" s={10} c={C.faint}>parallel to the balance</T>

      <Pn x={10} y={184} w={300} h={136} t="Clearance through the whole swing" />
      <circle cx={100} cy={258} r={54} fill="none" stroke={R.brassP} strokeWidth="5" />
      <line x1={46} y1={258} x2={154} y2={258} stroke={R.brassP} strokeWidth="3" />
      <Spring cx={100} cy={258} r0={5} r1={36} turns={6} />
      <path d="M134 230 L210 216 L210 236 L140 246 Z" fill="url(#rs-pcut)" stroke={R.brassD} strokeWidth="0.6" opacity="0.85" />
      <T x={214} y={228} s={10.5} c={C.dim}>cock</T>
      <circle cx={130} cy={240} r={8} fill="none" stroke={C.brass} strokeWidth="1.2" />
      <T x={170} y={274} s={10.5} c={C.text}>outer coil clears</T>
      <T x={170} y={288} s={10.5} c={C.text}>the cock and the arms</T>
      <rect x={318} y={184} width={152} height={136} rx="8" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <Note x={330} y={206} lines={['Work close to the', 'fault with fine', 'tweezers. Correct a', 'little, then re-check', 'under the loupe.']} s={10.5} lh={15} c={C.text} />
    </F>
  )
}

function RsHsCentre() {
  return (
    <F h={338} view="Plan · centre the collet, then set the beat" scale="schematic">
      <Pn x={10} y={26} w={148} h={170} t="Off-centre" c={C.ruby} tc={C.ruby} ok={false} />
      <Spring cx={84} cy={112} r0={7} r1={52} turns={8} ox={-12} oy={-6} />
      <circle cx={72} cy={106} r={6} fill="url(#rs-bcut)" stroke={R.brassD} />
      <circle cx={84} cy={112} r={2.2} fill={C.ruby} />
      <T x={84} y={182} a="middle" s={10} c={C.dim}>breathes unevenly</T>
      <FA a={[160, 112]} b={[176, 112]} />
      <Pn x={178} y={26} w={148} h={170} t="Concentric" ok />
      <Spring cx={252} cy={112} r0={7} r1={52} turns={8} />
      <circle cx={252} cy={112} r={6} fill="url(#rs-bcut)" stroke={R.brassD} />
      <circle cx={252} cy={112} r={2.2} fill={C.ruby} />
      <T x={252} y={182} a="middle" s={10} c={C.dim}>collet on the staff’s axis</T>
      <rect x={334} y={26} width={136} height={170} rx="8" fill="rgba(194,88,99,0.07)" stroke={C.ruby} />
      <Note x={346} y={50} lines={['Off-centre, the', 'rate changes with', 'amplitude.']} s={10.5} lh={15} c={C.text} />
      <Note x={346} y={114} lines={['On a modern', 'movement, set the', 'beat by moving the', 'stud carrier.']} s={10.5} lh={15} c={C.dim} />

      <Tag x={14} y={220}>Then the beat: jewel on the line of centres at rest</Tag>
      <line x1={40} y1={276} x2={430} y2={276} stroke={C.emerald} strokeDasharray="5 4" />
      <circle cx={92} cy={276} r={40} fill="none" stroke={R.brassP} strokeWidth="4" />
      <circle cx={92} cy={276} r={14} fill="url(#sk-steel)" stroke={R.steelD} />
      <circle cx={104} cy={276} r={3.5} fill={C.ruby} />
      <path d={arcD(92, 276, 50, 200, 250)} fill="none" stroke={C.brass} strokeWidth="1.5" markerEnd="url(#sk-a-brass)" />
      <path d={arcD(92, 276, 50, 340, 290)} fill="none" stroke={C.brass} strokeWidth="1.5" markerEnd="url(#sk-a-brass)" />
      <T x={92} y={332} a="middle" s={10.5} c={C.brassHi}>rotate the collet</T>
      <Fork x={232} y={276} k={0.75} rot={-90} />
      <EscWheel cx={340} cy={276} r={30} />
      <T x={232} y={318} a="middle" s={10} c={C.dim}>pallet staff</T>
      <T x={340} y={322} a="middle" s={10} c={C.dim}>escape wheel</T>
      <T x={430} y={270} s={10} c={C.emerald}>line of</T>
      <T x={430} y={283} s={10} c={C.emerald}>centres</T>
    </F>
  )
}

function RsHsVibrate() {
  const tick = (x0, n, y, c) =>
    [<line key="b" x1={x0} y1={y + 10} x2={x0 + 200} y2={y + 10} stroke={C.faint} strokeWidth="0.8" />, <line key="e" x1={x0 + 200} y1={y + 4} x2={x0 + 200} y2={y + 12} stroke={C.faint} strokeWidth="0.8" />].concat(Array.from({ length: n }, (_, i) => <line key={i} x1={x0 + (i * 200) / n} y1={y - 7} x2={x0 + (i * 200) / n} y2={y + 7} stroke={c} strokeWidth="2" />))
  return (
    <F h={330} view="Setup · vibrating a new spring" scale="schematic">
      <rect x={12} y={30} width={290} height={170} rx="8" fill="#2c2722" stroke="#55503f" />
      <Tag x={22} y={46}>Vibrating tool</Tag>
      {/* master */}
      <rect x={30} y={60} width={110} height={110} rx="6" fill="url(#sk-glass)" stroke="#7fa0b0" />
      <Balance cx={85} cy={115} r={34} arms={2} />
      <Spring cx={85} cy={115} r0={4} r1={24} turns={6} />
      <T x={85} y={188} a="middle" s={10.5} c={C.text}>master</T>
      {/* candidate hanging from clamp */}
      <rect x={200} y={58} width={70} height={10} fill="url(#sk-steel)" stroke={R.steelD} />
      <rect x={222} y={66} width={16} height={14} fill="url(#rs-cut)" stroke={R.steelD} />
      <path d="M230 80 C232 92 220 96 222 106" fill="none" stroke={C.steel} strokeWidth="1.1" />
      <Balance cx={222} cy={130} r={32} arms={2} />
      <Spring cx={222} cy={130} r0={4} r1={24} turns={6} />
      <T x={222} y={188} a="middle" s={10.5} c={C.text}>candidate</T>
      <line x1={270} y1={64} x2={276} y2={74} stroke={C.faint} strokeWidth="0.8" />
      <T x={296} y={86} a="end" s={10.5} c={C.text}>clamp</T>
      <T x={296} y={98} a="end" s={10} c={C.faint}>sets length</T>
      <path d={arcD(85, 115, 44, 200, 250)} fill="none" stroke={C.brass} strokeWidth="1.3" markerEnd="url(#sk-a-brass)" />
      <path d={arcD(222, 130, 42, 200, 250)} fill="none" stroke={C.brass} strokeWidth="1.3" markerEnd="url(#sk-a-brass)" />

      <rect x={312} y={30} width={156} height={170} rx="8" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <Num x={328} y={52} n={1} r={7} />
      <Note x={342} y={56} lines={['Master beats at', 'the target rate']} s={10.5} lh={14} c={C.text} />
      <Num x={328} y={96} n={2} r={7} />
      <Note x={342} y={100} lines={['Shorten the spring', 'progressively']} s={10.5} lh={14} c={C.text} />
      <Num x={328} y={140} n={3} r={7} />
      <Note x={342} y={144} lines={['Swing together?', 'Pin at the stud', 'at that length']} s={10.5} lh={14} c={C.text} />

      <Tag x={14} y={226}>One second</Tag>
      <T x={14} y={252} s={10.5} c={C.text}>18,000 A/h</T>
      {tick(110, 5, 248, C.brassHi)}
      <T x={326} y={252} s={10.5} c={C.brassHi}>5 beats a second</T>
      <T x={14} y={282} s={10.5} c={C.text}>28,800 A/h</T>
      {tick(110, 8, 278, C.steel)}
      <T x={326} y={282} s={10.5} c={C.steel}>8 beats a second</T>
      <T x={14} y={314} s={10.5} c={C.dim}>Hard to rush: many repairs sensibly fit a complete balance-and-spring assembly.</T>
    </F>
  )
}

function RsHsScrap() {
  const cells = [
    ['Rust', 'rust'],
    ['Sharp kink', 'kink'],
    ['Stretched coil', 'stretch'],
    ['Corrected again and again', 'wavy'],
  ]
  return (
    <F h={300} view="Comparison · springs that are scrap" scale="schematic">
      {cells.map(([h, k], i) => {
        const x = 12 + i * 116
        const cx = x + 54
        const cy = 102
        return (
          <g key={h}>
            <Pn x={x} y={28} w={108} h={150} c={C.ruby} />
            <Verdict x={x + 93} y={42} ok={false} r={7} />
            {k !== 'stretch' && k !== 'wavy' && <Spring cx={cx} cy={cy} r0={5} r1={40} turns={6} />}
            {k === 'rust' && [[-20, -14], [16, 22], [28, -8], [-8, 30]].map(([dx, dy], j) => <circle key={j} cx={cx + dx} cy={cy + dy} r={3.4} fill={R.rust} opacity="0.85" />)}
            {k === 'kink' && <path d={`M${cx + 30} ${cy - 22} l6 6 l-9 3 l6 6`} fill="none" stroke={C.ruby} strokeWidth="1.8" />}
            {k === 'stretch' && <path d={spiralD(cx, cy - 10, 4, 26, 4)} fill="none" stroke={C.steel} strokeWidth="0.9" />}
            {k === 'stretch' && <path d={`M${cx + 26} ${cy - 10} C${cx + 30} ${cy + 20} ${cx - 10} ${cy + 30} ${cx - 30} ${cy + 46}`} fill="none" stroke={C.ruby} strokeWidth="1.3" />}
            {k === 'wavy' && <path d={spiralD(cx, cy, 5, 40, 6).replace(/L([\d.]+) ([\d.]+)/g, (m, a, b, off) => `L${(+a + Math.sin(off / 9) * 1.4).toFixed(1)} ${b}`)} fill="none" stroke={C.steel} strokeWidth="0.9" />}
            <circle cx={k === 'stretch' ? cx : cx} cy={k === 'stretch' ? cy - 10 : cy} r={4} fill="url(#rs-bcut)" />
            <Note x={cx} y={160} a="middle" lines={h.length > 16 ? ['Corrected again', 'and again'] : [h]} s={10.5} lh={13} c={C.text} />
          </g>
        )
      })}
      <FA a={[240, 186]} b={[240, 204]} c="emerald" />
      <Bx x={60} y={206} w={360} h={48} l={['Fit a fresh spring, or a complete balance assembly']} c={C.emerald} />
      <T x={240} y={280} a="middle" s={10.5} c={C.dim}>It gives a better watch than heroics on a ruined spring.</T>
    </F>
  )
}


/* ================================================================== */
/* rest-jewel · jewelling                                               */
/* ================================================================== */

// Hole jewel in plan: cx, cy, r; hole shape and faults
function JewelPlan({ cx, cy, r = 26, fault, setting = true }) {
  const hole = fault === 'oval' ? <ellipse cx={cx} cy={cy} rx={r * 0.26} ry={r * 0.14} fill={C.ground} /> : <circle cx={cx} cy={cy} r={r * 0.14} fill={C.ground} />
  const off = fault === 'shift' ? 5 : 0
  return (
    <g>
      {setting && <circle cx={cx} cy={cy} r={r + 7} fill={R.plate} stroke={R.brassD} />}
      <circle cx={cx + off} cy={cy - off * 0.4} r={r} fill="url(#rs-jewel)" stroke={R.rubyD} />
      <circle cx={cx + off} cy={cy - off * 0.4} r={r * 0.55} fill="none" stroke="rgba(255,255,255,0.25)" />
      <g transform={`translate(${off} ${-off * 0.4})`}>{hole}</g>
      {fault === 'chip' && <path d={`M${cx + r * 0.6} ${cy - r * 0.8} L${cx + r * 0.95} ${cy - r * 0.3} L${cx + r * 0.62} ${cy - r * 0.35} Z`} fill={R.plate} stroke={C.ruby} strokeWidth="1" />}
      {fault === 'crack' && <path d={`M${cx - r} ${cy + 4} L${cx - r * 0.5} ${cy + 1} L${cx - r * 0.2} ${cy + 5} L${cx + r * 0.3} ${cy - 2} L${cx + r * 0.7} ${cy + 3} L${cx + r} ${cy}`} fill="none" stroke={C.text} strokeWidth="1" />}
      {fault === 'oil' && <circle cx={cx} cy={cy} r={r * 0.95} fill="rgba(127,196,232,0.25)" stroke={R.oil} strokeDasharray="2 2" />}
      {fault === 'oil' && <path d={`M${cx + r} ${cy + 4} q14 6 22 18`} fill="none" stroke={R.oil} strokeWidth="2" />}
      {fault === 'shift' && <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.faint} strokeDasharray="2 2" />}
    </g>
  )
}

function RsJwDiagnose() {
  const items = [
    ['Sound', '', undefined, true],
    ['Chip', 'at the edge', 'chip'],
    ['Fine crack', 'across the jewel', 'crack'],
    ['Oil won’t stay', 'runs off', 'oil'],
    ['Worn oval', 'sloppy side-shake', 'oval'],
    ['Shifted', 'in its setting', 'shift'],
  ]
  return (
    <F h={330} view="Plan · what to look for" scale="enlarged · schematic">
      {items.map(([h, sub, f, ok], i) => {
        const x = 12 + (i % 3) * 154
        const y = 28 + Math.floor(i / 3) * 128
        return (
          <g key={h}>
            <Pn x={x} y={y} w={146} h={120} c={ok ? C.emerald : C.line} />
            <JewelPlan cx={x + 36} cy={y + 58} r={25} fault={f} />
            <Verdict x={x + 130} y={y + 16} ok={!!ok} r={7} />
            {(() => {
              const hl = h.length > 11 ? [h.slice(0, h.lastIndexOf(' ')), h.slice(h.lastIndexOf(' ') + 1)] : [h]
              const w2 = sub ? sub.split(' ') : []
              const sl = w2.length > 2 ? [w2.slice(0, 2).join(' '), w2.slice(2).join(' ')] : w2.length === 2 && sub.length > 12 ? w2 : sub ? [sub] : []
              return (
                <g>
                  {hl.map((t, j) => <T key={t} x={x + 76} y={y + 50 + j * 13 - (hl.length - 1) * 6} s={10.5} c={C.text} w={600}>{t}</T>)}
                  {sl.map((t, j) => <T key={t + j} x={x + 76} y={y + 50 + (hl.length - 1) * 7 + 14 + j * 12} s={10} c={C.faint}>{t}</T>)}
                </g>
              )
            })()}
          </g>
        )
      })}
      <rect x={12} y={288} width={456} height={34} rx="6" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <T x={24} y={309} s={10.5} c={C.text}>Excessive side-shake with good pivots means the jewel, not the staff.</T>
    </F>
  )
}

function RsJwTypes() {
  const pl = (x0, x1, y, th, g) => <Slab x0={x0} x1={x1} y={y} th={th} gap={g} />
  return (
    <F h={330} view="Section · four ways a jewel is held" scale="enlarged · schematic">
      <Pn x={10} y={26} w={226} h={140} t="Friction-set" />
      {pl(30, 216, 90, 24, [104, 142])}
      <JewelSec x={123} y={102} w={38} h={14} d={6} />
      <T x={123} y={140} a="middle" s={10.5} c={C.text}>pressed straight into the plate</T>
      <T x={123} y={154} a="middle" s={10} c={C.faint}>modern movements</T>

      <Pn x={244} y={26} w={226} h={140} t="In a chaton, screwed" />
      {pl(264, 450, 90, 24, [330, 384])}
      <rect x={330} y={90} width={8} height={18} fill="url(#rs-bcut)" stroke={R.brassD} strokeWidth="0.6" />
      <rect x={376} y={90} width={8} height={18} fill="url(#rs-bcut)" stroke={R.brassD} strokeWidth="0.6" />
      <JewelSec x={357} y={99} w={38} h={14} d={6} />
      {[312, 402].map((x) => (
        <g key={x}>
          <rect x={x - 9} y={82} width={18} height={8} rx="2" fill="url(#sk-steel)" stroke={R.steelD} strokeWidth="0.5" />
          <rect x={x - 3} y={90} width={6} height={20} fill="url(#sk-steelH)" />
        </g>
      ))}
      <SL p={[336, 104]} x={300} y={128} text="chaton" />
      <SL p={[402, 84]} x={428} y={72} text="screw" />
      <T x={357} y={154} a="middle" s={10} c={C.faint}>older and higher-grade work</T>

      <Pn x={10} y={174} w={226} h={148} t="Rubbed-in (vintage)" />
      {pl(30, 216, 236, 24, [100, 146])}
      <JewelSec x={123} y={250} w={42} h={12} d={6} sink={false} />
      {[-1, 1].map((sd) => (
        <path key={sd} d={`M${123 + sd * 23} 236 L${123 + sd * 23} 228 Q${123 + sd * 23} 240 ${123 + sd * 16} 244`} fill="url(#rs-bcut)" stroke={R.brassD} strokeWidth="0.8" />
      ))}
      <SL p={[103, 238]} x={130} y={204} text="bezel burnished" sub="over the stone" />
      <T x={123} y={300} a="middle" s={10} c={C.faint}>the metal holds the stone</T>

      <Pn x={244} y={174} w={226} h={148} t="Shock setting" />
      {pl(264, 450, 250, 24, [320, 394])}
      <rect x={322} y={248} width={70} height={26} fill="url(#rs-cut)" stroke={R.steelD} strokeWidth="0.6" opacity="0.6" />
      <JewelSec x={357} y={266} w={36} h={10} d={5} />
      <rect x={339} y={252} width={36} height={6} rx="2" fill="url(#rs-jewel)" stroke={R.rubyD} strokeWidth="0.6" />
      <path d="M318 246 Q340 236 357 244 Q374 236 396 246" fill="none" stroke={C.steel} strokeWidth="1.6" />
      <SL p={[372, 255]} x={404} y={222} text="cap jewel" sub="end-stone" />
      <SL p={[346, 268]} x={332} y={300} text="hole jewel" />
      <SL p={[330, 242]} x={286} y={216} text="spring" />
    </F>
  )
}

function RsJwSetup() {
  return (
    <F h={330} view="Section · jewelling tool, set up square" scale="schematic">
      {/* frame */}
      <rect x={24} y={34} width={14} height={250} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.6" />
      <rect x={24} y={34} width={140} height={14} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.6" />
      <rect x={24} y={270} width={200} height={14} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.6" />
      <rect x={128} y={20} width={22} height={14} fill="url(#rs-knurl)" stroke={R.steelD} strokeWidth="0.5" />
      <T x={156} y={30} s={10} c={C.faint}>micrometer</T>
      {/* pusher */}
      <rect x={133} y={48} width={12} height={92} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.6" />
      <rect x={130} y={140} width={18} height={20} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.6" />
      {/* plate */}
      <Slab x0={58} x1={130} y={160} th={22} />
      <Slab x0={148} x1={220} y={160} th={22} />
      <JewelSec x={139} y={171} w={18} h={22} d={4} sink={false} />
      {/* stump */}
      <rect x={96} y={182} width={34} height={88} fill="url(#rs-cut)" stroke={R.steelD} strokeWidth="0.6" />
      <rect x={148} y={182} width={34} height={88} fill="url(#rs-cut)" stroke={R.steelD} strokeWidth="0.6" />
      <Dim a={[130, 150]} b={[148, 150]} off={0} />
      <SL p={[148, 146]} x={186} y={130} text="pusher Ø = jewel’s" sub="outside diameter" />
      <SL p={[178, 170]} x={236} y={174} text="plate" />
      <SL p={[150, 230]} x={196} y={222} text="stump clears" sub="the jewel" />
      <T x={196} y={250} s={10} c={C.faint}>supports only</T>
      <T x={196} y={262} s={10} c={C.faint}>the plate</T>
      <line x1={139} y1={44} x2={139} y2={276} stroke={C.emerald} strokeDasharray="4 3" />
      <T x={46} y={128} s={10} c={C.emerald}>one axis:</T>
      <T x={46} y={141} s={10} c={C.emerald}>dead square</T>

      <Sep x1={300} y1={30} x2={300} y2={316} />
      <Pn x={310} y={30} w={160} h={134} t="Oversized pusher" c={C.ruby} tc={C.ruby} ok={false} />
      <Slab x0={322} x1={376} y={118} th={16} />
      <Slab x0={404} x1={458} y={118} th={16} />
      <JewelSec x={390} y={126} w={28} h={16} d={4} sink={false} />
      <rect x={368} y={84} width={44} height={34} fill="url(#sk-steelH)" stroke={C.ruby} strokeWidth="1" />
      <T x={390} y={154} a="middle" s={10} c={C.ruby}>cracks the stone</T>
      <Pn x={310} y={176} w={160} h={140} t="Stump fouls jewel" c={C.ruby} tc={C.ruby} ok={false} />
      <Slab x0={322} x1={376} y={228} th={16} />
      <Slab x0={404} x1={458} y={228} th={16} />
      <JewelSec x={390} y={236} w={28} h={16} d={4} sink={false} />
      <rect x={346} y={244} width={38} height={36} fill="url(#rs-cut)" stroke={C.ruby} strokeWidth="1" />
      <rect x={396} y={244} width={38} height={36} fill="url(#rs-cut)" stroke={C.ruby} strokeWidth="1" />
      <T x={390} y={300} a="middle" s={10} c={C.ruby}>cracks it instantly</T>
      <T x={14} y={308} s={10.5} c={C.dim}>Tilted, it cracks the stone or scores the plate.</T>
    </F>
  )
}

function RsJwPush() {
  const panel = (x, t, n) => (
    <g>
      <Pn x={x} y={26} w={148} h={226} />
      <Num x={x + 18} y={44} n={n} />
      <T x={x + 32} y={48} s={11} c={C.text} w={600}>{t}</T>
    </g>
  )
  return (
    <F h={330} view="Sequence · out, then in" scale="schematic">
      {panel(10, 'Push out', 1)}
      <Slab x0={20} x1={66} y={130} th={22} />
      <Slab x0={102} x1={148} y={130} th={22} />
      <rect x={66} y={160} width={36} height={4} fill="none" />
      <JewelSec x={84} y={176} w={36} h={22} d={5} sink={false} />
      <rect x={76} y={70} width={16} height={60} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.6" />
      <Arrow a={[110, 82]} b={[110, 118]} c="brass" w={1.6} />
      <rect x={28} y={152} width={36} height={60} fill="url(#rs-cut)" stroke={R.steelD} strokeWidth="0.5" opacity="0.7" />
      <rect x={104} y={152} width={36} height={60} fill="url(#rs-cut)" stroke={R.steelD} strokeWidth="0.5" opacity="0.7" />
      <T x={84} y={232} a="middle" s={10.5} c={C.dim}>straight out</T>

      {panel(166, 'Keep the hole', 2)}
      <Slab x0={176} x1={222} y={130} th={22} />
      <Slab x0={258} x1={304} y={130} th={22} />
      <Dim a={[222, 120]} b={[258, 120]} off={0} />
      <T x={240} y={110} a="middle" s={10} c={C.text}>original hole</T>
      <Verdict x={240} y={176} ok r={8} />
      <T x={240} y={202} a="middle" s={10} c={C.dim}>don’t ream it, unless</T>
      <T x={240} y={215} a="middle" s={10} c={C.dim}>fitting a larger-diameter</T>
      <T x={240} y={228} a="middle" s={10} c={C.dim}>jewel on purpose</T>

      {panel(322, 'Press in', 3)}
      <Slab x0={332} x1={378} y={130} th={22} />
      <Slab x0={414} x1={460} y={130} th={22} />
      <JewelSec x={396} y={130} w={36} h={22} d={5} sink={false} />
      <rect x={388} y={76} width={16} height={43} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.6" />
      <Arrow a={[426, 84]} b={[426, 108]} c="brass" w={1.4} />
      <line x1={378} y1={152} x2={460} y2={152} stroke={C.emerald} strokeDasharray="3 2" />
      <line x1={414} y1={141} x2={460} y2={141} stroke={C.faint} strokeDasharray="2 2" />
      <T x={396} y={182} a="middle" s={10} c={C.emerald}>final depth (dashed)</T>
      <T x={396} y={202} a="middle" s={10.5} c={C.text}>gently; stop short</T>
      <T x={396} y={215} a="middle" s={10.5} c={C.text}>of final depth</T>
      <rect x={10} y={262} width={460} height={56} rx="7" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <T x={22} y={282} s={11} c={C.text} w={600}>Why stop short?</T>
      <T x={22} y={300} s={10.5} c={C.dim}>Final depth is set next, against the wheel’s end-shake.</T>
    </F>
  )
}

function RsJwDepth() {
  return (
    <F h={330} view="Section · depth sets end-shake" scale="end-shake exaggerated">
      {/* bridge top, plate bottom */}
      <Slab x0={30} x1={110} y={50} th={24} />
      <Slab x0={140} x1={220} y={50} th={24} />
      <JewelSec x={125} y={62} w={30} h={24} d={6} sink={false} />
      <Slab x0={30} x1={110} y={220} th={24} />
      <Slab x0={140} x1={220} y={220} th={24} />
      <JewelSec x={125} y={232} w={30} h={24} d={6} sink={false} />
      <T x={32} y={44} s={10} c={C.faint}>bridge</T>
      <T x={32} y={262} s={10} c={C.faint}>plate</T>
      {/* arbor with wheel */}
      <rect x={122} y={58} width={6} height={20} fill="url(#sk-steelH)" />
      <rect x={118} y={78} width={14} height={136} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.5" />
      <rect x={122} y={214} width={6} height={22} fill="url(#sk-steelH)" />
      <rect x={52} y={130} width={146} height={6} fill={R.brassP} />
      {/* gap between top shoulder and top jewel */}
      <line x1={140} y1={74} x2={196} y2={74} stroke={C.dim} strokeWidth="0.6" />
      <line x1={132} y1={78} x2={196} y2={78} stroke={C.dim} strokeWidth="0.6" />
      <line x1={196} y1={74} x2={226} y2={74} stroke={C.dim} strokeWidth="0.6" />
      <line x1={196} y1={78} x2={226} y2={78} stroke={C.dim} strokeWidth="0.6" />
      <T x={228} y={96} s={10.5} c={C.brassHi} w={600}>end-</T>
      <T x={228} y={109} s={10.5} c={C.brassHi} w={600}>shake</T>
      <Arrow a={[90, 190]} b={[90, 160]} c="brass" w={1.4} both />
      <T x={40} y={208} s={10} c={C.dim}>nudge the wheel</T>
      <Arrow a={[160, 286]} b={[160, 260]} c="steel" w={1.6} />
      <T x={170} y={290} s={10.5} c={C.steel}>micrometer advances</T>
      <T x={170} y={303} s={10.5} c={C.steel}>the jewel a fraction</T>

      <Sep x1={286} y1={30} x2={286} y2={316} />
      <Tag x={298} y={44}>Read it</Tag>
      <Bx x={298} y={56} w={170} h={50} l={['Too little', 'binds']} c={C.ruby} />
      <Bx x={298} y={114} w={170} h={64} l={['Too much', 'rate suffers; pivot', 'can jump its jewel']} c={C.ruby} />
      <Bx x={298} y={186} w={170} h={64} l={['About right', 'just visible under a', 'loupe, free running']} c={C.emerald} />
      <Note x={298} y={270} lines={['No binding with the bridge', 'fully tightened.']} s={10.5} lh={14} c={C.dim} />
    </F>
  )
}

function RsJwBush() {
  const st = ['Worn oval', 'Broach out', 'Fit a bushing', 'Jewel it']
  return (
    <F h={320} view="Sequence · re-bush a worn hole" scale="schematic">
      {st.map((h, i) => {
        const x = 12 + i * 116
        const cx = x + 54
        const cy = 100
        return (
          <g key={h}>
            <Pn x={x} y={28} w={108} h={158} />
            <Num x={x + 16} y={44} n={i + 1} r={7} />
            <T x={x + 28} y={48} s={10.5} c={C.text} w={600}>{h}</T>
            <circle cx={cx} cy={cy} r={34} fill={R.plate} stroke={R.brassD} />
            {i === 0 && <ellipse cx={cx + 3} cy={cy} rx={9} ry={5.5} fill={C.ground} stroke={C.ruby} />}
            {i === 0 && <circle cx={cx} cy={cy} r={4} fill="none" stroke={C.faint} strokeDasharray="1.5 1.5" />}
            {i === 1 && <circle cx={cx} cy={cy} r={12} fill={C.ground} stroke={C.steel} />}
            {i === 1 && <path d={`M${cx - 5} ${cy - 50} L${cx + 5} ${cy - 50} L${cx + 3} ${cy} L${cx - 3} ${cy} Z`} fill="url(#sk-steelH)" opacity="0.85" />}
            {i >= 2 && <circle cx={cx} cy={cy} r={12} fill={R.gold} stroke={R.brassD} />}
            {i === 2 && <circle cx={cx} cy={cy} r={3.4} fill={C.ground} />}
            {i === 3 && <circle cx={cx} cy={cy} r={8} fill="url(#rs-jewel)" stroke={R.rubyD} />}
            {i === 3 && <circle cx={cx} cy={cy} r={2} fill={C.ground} />}
            <T x={cx} y={156} a="middle" s={10} c={C.faint}>{['pivot wanders', 'round, true centre', 'new hole', 'friction jewel'][i]}</T>
            <T x={cx} y={170} a="middle" s={10} c={C.faint}>{['', '', 'on the centre', ''][i]}</T>
            {i < 3 && <FA a={[x + 109, 108]} b={[x + 115, 108]} />}
          </g>
        )
      })}
      <Pn x={12} y={198} w={224} h={110} t="Done well" ok />
      <Note x={24} y={236} lines={['Invisible. The wheel sits', 'where it always did.']} s={10.5} lh={14} c={C.text} />
      <Pn x={244} y={198} w={224} h={110} t="Done badly" c={C.ruby} tc={C.ruby} ok={false} />
      <Note x={256} y={236} lines={['Off the true centre, it moves', 'the wheel out of depth.']} s={10.5} lh={14} c={C.text} />
      <T x={256} y={290} s={10} c={C.faint}>Lathe and jewelling-tool work.</T>
      <T x={24} y={280} s={10} c={C.faint}>Common on old, unjewelled</T>
      <T x={24} y={293} s={10} c={C.faint}>or brass-bushed pivots.</T>
    </F>
  )
}

function RsJwDepthTool() {
  const mesh = (x, gap, t, ok) => {
    const cy = 72
    return (
      <g>
        <Pn x={x} y={28} w={148} h={110} t={t} c={ok ? C.emerald : C.ruby} tc={ok ? C.emerald : C.ruby} />
        <circle cx={x + 50} cy={cy + 26} r={40} fill="none" stroke={R.brassP} strokeWidth="1" />
        {Array.from({ length: 9 }, (_, i) => {
          const a = -40 + i * 10
          const p0 = pol(x + 50, cy + 26, 36, a)
          const p1 = pol(x + 50, cy + 26, 44, a)
          return <line key={i} x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke={R.brassP} strokeWidth="3.4" strokeLinecap="round" />
        })}
        {(() => {
          const pc = x + 50 + 40 + gap + 12
          return (
            <g>
              <circle cx={pc} cy={cy + 26} r={10} fill="url(#sk-steel)" stroke={R.steelD} />
              {Array.from({ length: 7 }, (_, i) => {
                const a = 180 + (i - 3) * 22
                const p0 = pol(pc, cy + 26, 9, a)
                const p1 = pol(pc, cy + 26, 14, a)
                return <line key={i} x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke="#b3c2cc" strokeWidth="3.4" strokeLinecap="round" />
              })}
            </g>
          )
        })()}
      </g>
    )
  }
  return (
    <F h={330} view="Tool · find the true centre distance" scale="schematic">
      {mesh(10, -9, 'Too deep', false)}
      {mesh(166, 0, 'Turns sweetly', true)}
      {mesh(322, 12, 'Too shallow', false)}
      {/* depthing tool */}
      <Tag x={14} y={160}>Depthing tool</Tag>
      {[60, 180].map((x) => (
        <g key={x}>
          <rect x={x - 3} y={170} width={6} height={110} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.5" />
          <path d={`M${x - 3} 280 L${x} 292 L${x + 3} 280`} fill="url(#sk-steel)" stroke={R.steelD} strokeWidth="0.5" />
        </g>
      ))}
      <circle cx={60} cy={222} r={30} fill="none" stroke={R.brassP} strokeWidth="3" strokeDasharray="2 1.5" />
      <circle cx={102} cy={222} r={11} fill="url(#sk-steel)" stroke={R.steelD} />
      <line x1={102} y1={170} x2={102} y2={280} stroke={C.steel} strokeWidth="2" />
      <path d="M60 300 L180 300" stroke={C.struct} strokeWidth="5" />
      <rect x={196} y={290} width={28} height={20} fill="url(#rs-knurl)" stroke={R.steelD} strokeWidth="0.5" />
      <Arrow a={[130, 254]} b={[150, 254]} c="brass" w={1.4} both />
      <T x={120} y={322} a="middle" s={10} c={C.faint}>adjustable runners · screw sets spacing</T>
      <T x={200} y={210} s={10.5} c={C.text}>roll them together;</T>
      <T x={200} y={224} s={10.5} c={C.text}>set where they turn</T>
      <T x={200} y={238} s={10.5} c={C.text}>sweetly</T>

      <rect x={318} y={150} width={150} height={168} rx="7" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <Tag x={328} y={168}>Then transfer it</Tag>
      {['move a jewel', 're-bush', 'eccentric jewel', 'setting'].map((t, i) => (
        <g key={t}>
          {i < 3 && <circle cx={334} cy={190 + i * 22} r={2.5} fill={C.brass} />}
          <T x={344} y={194 + (i < 3 ? i * 22 : 2 * 22 + 13)} s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
      <Note x={328} y={274} lines={['For a wrong-depth', 'train only.']} s={10.5} lh={14} c={C.dim} />
    </F>
  )
}

/* ================================================================== */
/* rest-pivots · burnishing                                             */
/* ================================================================== */

function PivotSide({ x, y, kind }) {
  // pivot pointing up from a shoulder at (x, y); length 54, Ø 10
  const base = <path d={`M${x - 16} ${y + 26} L${x - 16} ${y + 6} L${x - 5} ${y} L${x + 5} ${y} L${x + 16} ${y + 6} L${x + 16} ${y + 26} Z`} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.6" />
  let piv
  if (kind === 'taper') piv = <path d={`M${x - 5} ${y} L${x - 3} ${y - 52} Q${x} ${y - 56} ${x + 3} ${y - 52} L${x + 5} ${y} Z`} fill="url(#sk-steelH)" stroke={C.ruby} strokeWidth="0.8" />
  else if (kind === 'bent') piv = <path d={`M${x - 5} ${y} L${x - 5} ${y - 22} Q${x - 4} ${y - 40} ${x + 8} ${y - 52} Q${x + 12} ${y - 54} ${x + 13} ${y - 48} Q${x + 4} ${y - 36} ${x + 5} ${y - 22} L${x + 5} ${y} Z`} fill="url(#sk-steelH)" stroke={C.ruby} strokeWidth="0.8" />
  else piv = <path d={`M${x - 5} ${y} L${x - 5} ${y - 50} Q${x} ${y - 56} ${x + 5} ${y - 50} L${x + 5} ${y} Z`} fill="url(#sk-steelH)" stroke={kind === 'good' ? C.emerald : C.ruby} strokeWidth="0.8" />
  return (
    <g>
      {base}
      {piv}
      {kind === 'scored' && [10, 20, 30, 40].map((d) => <line key={d} x1={x - 5} y1={y - d} x2={x + 5} y2={y - d - 1} stroke={C.ruby} strokeWidth="0.9" />)}
      {kind === 'rust' && [[-2, -12], [2, -26], [-1, -38], [3, -6]].map(([a, b], i) => <circle key={i} cx={x + a} cy={y + b} r={1.8} fill={R.rust} />)}
      {kind === 'good' && <line x1={x - 2} y1={y - 4} x2={x - 2} y2={y - 46} stroke="#ffffff" strokeWidth="1.2" opacity="0.7" />}
      {(kind === 'bent' || kind === 'taper') && <line x1={x} y1={y + 4} x2={x} y2={y - 60} stroke={C.faint} strokeDasharray="2 2" />}
    </g>
  )
}

function RsPvInspect() {
  const k = [
    ['Good', 'good', 'see below', ''],
    ['Scored', 'scored', 'rings round it', ''],
    ['Rust pitting', 'rust', 'pits in the surface', ''],
    ['Taper', 'taper', 'thinner at the end', ''],
    ['Bent', 'bent', 'off the axis', ''],
  ]
  return (
    <F h={316} view="Detail · pivots under high magnification" scale="enlarged · schematic">
      {k.map(([h, kind, a, b], i) => {
        const x = 12 + i * 92
        return (
          <g key={h}>
            <Pn x={x} y={28} w={86} h={176} c={kind === 'good' ? C.emerald : C.line} />
            <PivotSide x={x + 43} y={124} kind={kind} />
            <Verdict x={x + 72} y={42} ok={kind === 'good'} r={7} />
            <T x={x + 43} y={172} a="middle" s={11} c={C.text} w={600}>{h}</T>
            <T x={x + 43} y={186} a="middle" s={10} c={C.faint}>{a}</T>
            {b && <T x={x + 43} y={198} a="middle" s={10} c={C.faint}>{b}</T>}
          </g>
        )
      })}
      <T x={14} y={224} s={10.5} c={C.emerald}>Good: straight, cylindrical, mirror-polished, slightly domed end.</T>
      <Tag x={14} y={248}>Roll it to find a bend</Tag>
      <rect x={14} y={298} width={300} height={6} fill="url(#sk-steel)" />
      <rect x={60} y={284} width={180} height={8} rx="3" fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.5" />
      <circle cx={150} cy={288} r={18} fill="none" stroke={R.brassP} strokeWidth="2" />
      <path d="M240 288 L262 282" stroke="url(#sk-steelH)" strokeWidth="3" />
      <path d="M240 288 L262 294" stroke={C.ruby} strokeWidth="1.2" strokeDasharray="2 2" />
      <Arrow d="M96 266 Q150 256 204 266" c="brass" w={1.4} />
      <T x={330} y={278} s={10.5} c={C.text}>On a flat surface a bent</T>
      <T x={330} y={292} s={10.5} c={C.text}>end wobbles as it rolls.</T>
    </F>
  )
}

function RsPvBurnish() {
  const rough = (x, y, w) => {
    let d = `M${x} ${y}`
    for (let i = 0; i <= w; i += 6) d += ` L${x + i + 3} ${y - 5} L${x + i + 6} ${y}`
    return d
  }
  return (
    <F h={316} view="Section · surface of a pivot, magnified" scale="schematic">
      <Pn x={10} y={26} w={226} h={196} t="Burnisher" ok />
      <rect x={30} y={130} width={186} height={50} fill="url(#rs-cut)" stroke={R.steelD} strokeWidth="0.6" />
      <path d={rough(30, 130, 84)} fill="none" stroke={C.ruby} strokeWidth="1" />
      <line x1={120} y1={127} x2={216} y2={127} stroke="#ffffff" strokeWidth="1.6" opacity="0.8" />
      <rect x={120} y={100} width={96} height={24} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.6" />
      <T x={168} y={116} a="middle" s={10} c={C.ground} w={700}>hardened, flat</T>
      <Arrow a={[170, 96]} b={[130, 96]} c="brass" w={1.4} />
      <Arrow a={[168, 70]} b={[168, 94]} c="steel" w={1.3} />
      <T x={176} y={76} s={10} c={C.steel}>light, even</T>
      <T x={30} y={198} s={10.5} c={C.text}>peaks pressed flat, not removed:</T>
      <T x={30} y={212} s={10.5} c={C.emerald}>brighter, work-hardened</T>
      <T x={74} y={120} a="middle" s={10} c={C.ruby}>before</T>

      <Pn x={244} y={26} w={226} h={196} t="File" c={C.ruby} tc={C.ruby} ok={false} />
      <rect x={264} y={140} width={186} height={40} fill="url(#rs-cut)" stroke={R.steelD} strokeWidth="0.6" />
      <rect x={264} y={130} width={186} height={10} fill="none" stroke={C.ruby} strokeDasharray="3 2" />
      <rect x={300} y={106} width={130} height={20} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.6" />
      {Array.from({ length: 16 }, (_, i) => <line key={i} x1={304 + i * 8} y1={126} x2={308 + i * 8} y2={120} stroke={R.steelD} />)}
      <Dim a={[456, 130]} b={[456, 140]} off={0} />
      <T x={358} y={198} a="middle" s={10.5} c={C.ruby}>metal cut away: undersized</T>
      <T x={358} y={212} a="middle" s={10.5} c={C.ruby}>an undersized pivot is scrap</T>
      <rect x={10} y={232} width={460} height={74} rx="7" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <T x={22} y={252} s={11} c={C.text} w={600}>Stroke along the pivot while the arbor turns in the Jacot bed.</T>
      <T x={22} y={270} s={10.5} c={C.dim}>You are smoothing, not removing material. A file is not a burnisher:</T>
      <T x={22} y={284} s={10.5} c={C.dim}>it cuts, and the part then needs replacing.</T>
    </F>
  )
}

function RsPvLimit() {
  return (
    <F h={300} view="Decision · burnish or replace?" scale="schematic">
      <Bx x={150} y={28} w={180} h={36} l={['Inspect the pivot']} c={C.brass} />
      <Arrow d="M200 64 Q120 76 120 96" c="emerald" w={1.5} />
      <Arrow d="M280 64 Q360 76 360 96" c="ruby" w={1.5} />
      <Pn x={12} y={98} w={220} h={120} t="Surface damage only" c={C.emerald} tc={C.emerald} />
      <Note x={26} y={136} lines={['light marks, dullness,', 'a little roughness']} s={10.5} lh={14} c={C.text} />
      <Bx x={26} y={172} w={192} h={34} l={['Burnish it']} c={C.emerald} />
      <Pn x={248} y={98} w={220} h={120} t="Beyond burnishing" c={C.ruby} tc={C.ruby} />
      {['undersized (lost diameter)', 'deeply scored', 'badly bent', 'rust-pitted'].map((t, i) => (
        <g key={t}>
          <circle cx={262} cy={128 + i * 20} r={2.5} fill={C.ruby} />
          <T x={272} y={132 + i * 20} s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
      <FA a={[358, 220]} b={[358, 236]} c="ruby" />
      <Bx x={248} y={238} w={104} h={50} l={['Replace', 'staff or arbor']} c={C.ruby} />
      <Bx x={364} y={238} w={104} h={50} l={['Turn a new', 'pivot (lathe)']} c={C.ruby} />
      <T x={12} y={248} s={10.5} c={C.dim}>Burnishing fixes the surface.</T>
      <T x={12} y={262} s={10.5} c={C.dim}>It cannot restore diameter,</T>
      <T x={12} y={276} s={10.5} c={C.dim}>straighten a bad bend, or</T>
      <T x={12} y={290} s={10.5} c={C.dim}>save a pitted pivot.</T>
    </F>
  )
}

function RsPvFinish() {
  return (
    <F h={316} view="Check · shake, then the air test" scale="schematic">
      <Pn x={10} y={26} w={180} h={196} t="Re-fit and check" />
      <JewelSec x={100} y={70} w={44} h={12} d={8} sink={false} />
      <rect x={97} y={64} width={6} height={18} fill="url(#sk-steelH)" />
      <rect x={93} y={82} width={14} height={92} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.5" />
      <JewelSec x={100} y={186} w={44} h={12} d={8} sink={false} />
      <rect x={97} y={174} width={6} height={18} fill="url(#sk-steelH)" />
      <Arrow a={[136, 140]} b={[136, 108]} c="brass" w={1.3} both />
      <T x={146} y={128} s={10} c={C.brassHi}>end</T>
      <Arrow a={[70, 100]} b={[44, 100]} c="steel" w={1.3} both />
      <T x={44} y={118} s={10} c={C.steel}>side</T>
      <T x={100} y={212} a="middle" s={10} c={C.faint}>both shakes, in its jewels</T>

      <Pn x={198} y={26} w={272} h={196} t="Air test: spin the train" />
      <line x1={220} y1={190} x2={456} y2={190} stroke={C.struct} />
      <line x1={220} y1={190} x2={220} y2={56} stroke={C.struct} />
      <T x={454} y={206} a="end" s={10} c={C.faint}>time</T>
      <T x={226} y={62} s={10} c={C.faint}>speed</T>
      <path d="M220 70 C300 80 380 140 440 188" fill="none" stroke={C.emerald} strokeWidth="2" />
      <path d="M220 70 C250 74 270 110 280 188" fill="none" stroke={C.ruby} strokeWidth="2" strokeDasharray="4 3" />
      <T x={360} y={110} s={10.5} c={C.emerald}>coasts to a</T>
      <T x={360} y={124} s={10.5} c={C.emerald}>gradual stop</T>
      <T x={290} y={160} s={10.5} c={C.ruby}>stalls</T>
      <rect x={10} y={232} width={460} height={70} rx="7" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <T x={22} y={252} s={11} c={C.text} w={600}>Amplitude is the proof.</T>
      <T x={22} y={270} s={10.5} c={C.dim}>Clean the pivot first. If a clean, correctly oiled movement still runs</T>
      <T x={22} y={284} s={10.5} c={C.dim}>low, suspect pivots and jewels before anything exotic.</T>
    </F>
  )
}

/* ================================================================== */
/* rest-shellac · escapement adjustment                                 */
/* ================================================================== */

// Pallet fork lying flat in plan, larger and simpler: pivot at (x, y), stones down.
function PalletBig({ x, y, k = 1, entryOut = 0, loose, burnt, shellac = true }) {
  const sh = burnt ? R.burnt : R.shellac
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d="M-4 -4 L-4 -60 L-12 -76 L-4 -78 L0 -70 L4 -78 L12 -76 L4 -60 L4 -4 L42 10 L46 26 L36 28 L10 14 L-10 14 L-36 28 L-46 26 L-42 10 Z" fill="url(#sk-steel)" stroke={R.steelD} strokeWidth={0.8 / k} strokeLinejoin="round" />
      <g transform={`rotate(14 -40 22) translate(0 ${entryOut})`}>
        <rect x="-46" y="14" width="11" height="26" rx="1" fill={C.ruby} stroke={R.rubyD} strokeWidth={0.6 / k} transform={loose ? 'rotate(12 -40 20)' : undefined} />
        {shellac && !loose && <rect x="-47.5" y="13" width="14" height="4" fill={sh} opacity="0.9" />}
      </g>
      <g transform="rotate(-14 40 22)">
        <rect x="35" y="14" width="11" height="26" rx="1" fill={C.ruby} stroke={R.rubyD} strokeWidth={0.6 / k} />
        {shellac && <rect x="33.5" y="13" width="14" height="4" fill={sh} opacity="0.9" />}
      </g>
      <circle cx="0" cy="0" r="4" fill={C.ground} stroke={R.steelD} strokeWidth={0.9 / k} />
    </g>
  )
}

function RsShWarm() {
  return (
    <F h={330} view="Schematic · warm, move, cool" scale="schematic">
      <Num x={22} y={44} n={1} r={7} />
      <T x={34} y={48} s={10.5} c={C.text}>warm until the shellac just goes glossy</T>
      {/* warming holder plate, seen from above, with handle */}
      <rect x={70} y={96} width={190} height={110} rx="6" fill="url(#sk-brassG)" stroke={R.brassD} strokeWidth="0.8" opacity="0.9" />
      <rect x={14} y={142} width={58} height={16} rx="3" fill="url(#sk-wood)" stroke="#6f4a2b" strokeWidth="0.6" />
      <T x={20} y={180} s={10} c={C.dim}>warming</T>
      <T x={20} y={192} s={10} c={C.dim}>holder</T>
      <PalletBig x={190} y={166} k={0.7} />
      {/* heat under the far end */}
      <ellipse cx={110} cy={236} rx={12} ry={22} fill="url(#rs-flame)" />
      <path d="M86 300 L86 270 Q86 258 104 258 L116 258 Q134 258 134 270 L134 300 Z" fill="url(#sk-glass)" stroke="#7fa0b0" />
      <Arrow d="M116 214 Q150 214 168 200" c="ruby" w={1.3} />
      <T x={110} y={318} a="middle" s={10} c={C.faint}>gentle heat, brief contact</T>
      {/* stone pusher on the entry stone */}
      <G x={163} y={188} ang={35}>
        <rect x={-1.5} y={-62} width={3} height={62} fill="url(#sk-steelH)" />
        <rect x={-4} y={-104} width={8} height={44} rx="2" fill="url(#sk-wood)" />
      </G>
      <SL p={[163, 186]} x={176} y={242} text="stone pusher" sub="in or out a fraction" />
      <T x={196} y={90} a="middle" s={10} c={C.faint}>pallet fork</T>

      <Sep x1={276} y1={30} x2={276} y2={316} />
      <Tag x={288} y={44}>The shellac at the joint</Tag>
      <Pn x={288} y={54} w={180} h={84} t="Tacky, glossy" ok />
      <rect x={304} y={92} width={30} height={14} rx="3" fill={R.shellac} />
      <rect x={334} y={88} width={14} height={34} fill={C.ruby} />
      <T x={358} y={102} s={10.5} c={C.text}>soft enough</T>
      <T x={358} y={116} s={10.5} c={C.text}>to nudge</T>
      <Pn x={288} y={146} w={180} h={84} t="Burnt" c={C.ruby} tc={C.ruby} ok={false} />
      <rect x={304} y={184} width={30} height={14} rx="3" fill={R.burnt} />
      <rect x={334} y={180} width={14} height={34} fill={C.ruby} />
      <path d="M338 186 L344 196 L340 204" fill="none" stroke={C.text} strokeWidth="1" />
      <T x={358} y={194} s={10.5} c={C.text}>dark, brittle;</T>
      <T x={358} y={208} s={10.5} c={C.text}>stone may crack</T>
      <Num x={300} y={252} n={2} r={7} />
      <T x={312} y={256} s={10.5} c={C.text}>heat away, let it set</T>
      <Num x={300} y={278} n={3} r={7} />
      <T x={312} y={282} s={10.5} c={C.text}>re-check lock each time</T>
      <T x={288} y={308} s={10} c={C.faint}>tacky, not running</T>
    </F>
  )
}

function RsShReshellac() {
  const panel = (x, n, t) => (
    <g>
      <Pn x={x} y={26} w={148} h={210} />
      <Num x={x + 18} y={44} n={n} />
      <T x={x + 32} y={48} s={11} c={C.text} w={600}>{t}</T>
    </g>
  )
  const slot = (x, y) => <path d={`M${x - 30} ${y - 40} L${x + 30} ${y - 40} L${x + 30} ${y + 40} L${x + 10} ${y + 40} L${x + 10} ${y - 20} L${x - 10} ${y - 20} L${x - 10} ${y + 40} L${x - 30} ${y + 40} Z`} fill="url(#sk-steel)" stroke={R.steelD} strokeWidth="0.6" />
  return (
    <F h={330} view="Detail · re-set a loose pallet stone" scale="enlarged · schematic">
      {panel(10, 1, 'Clean both')}
      {slot(84, 130)}
      <rect x={52} y={170} width={10} height={10} fill={R.burnt} opacity="0.7" />
      <rect x={104} y={166} width={10} height={12} fill={R.burnt} opacity="0.7" />
      <rect x={124} y={82} width={14} height={52} fill={C.ruby} stroke={R.rubyD} />
      <rect x={124} y={82} width={14} height={8} fill={R.burnt} opacity="0.7" />
      <T x={84} y={208} a="middle" s={10} c={C.dim}>old shellac off the</T>
      <T x={84} y={221} a="middle" s={10} c={C.dim}>stone and the slot</T>

      {panel(166, 2, 'Position it')}
      {slot(240, 130)}
      <rect x={233} y={102} width={14} height={76} fill={C.ruby} stroke={R.rubyD} />
      <Dim a={[268, 170]} b={[268, 178]} off={0} />
      <T x={274} y={162} s={10} c={C.text}>depth</T>
      <path d={arcD(240, 120, 30, -110, -70)} fill="none" stroke={C.brass} strokeWidth="1.2" />
      <T x={240} y={84} a="middle" s={10} c={C.brassHi}>angle</T>
      <T x={240} y={208} a="middle" s={10} c={C.dim}>at the correct depth</T>
      <T x={240} y={221} a="middle" s={10} c={C.dim}>and angle</T>

      {panel(322, 3, 'Wick it in')}
      {slot(396, 130)}
      <rect x={389} y={102} width={14} height={76} fill={C.ruby} stroke={R.rubyD} />
      <path d="M386 96 L386 150 M406 96 L406 150" stroke={R.shellac} strokeWidth="2.6" />
      <rect x={374} y={78} width={10} height={10} fill={R.shellac} transform="rotate(20 379 83)" />
      <Arrow a={[364, 72]} b={[376, 82]} c="brass" w={1.2} />
      <T x={396} y={208} a="middle" s={10} c={C.dim}>a small flake at the</T>
      <T x={396} y={221} a="middle" s={10} c={C.dim}>joint, while warm</T>

      <rect x={10} y={246} width={460} height={76} rx="7" fill="rgba(194,88,99,0.07)" stroke={C.ruby} />
      <T x={22} y={266} s={11} c={C.text} w={600}>Keep it out of these</T>
      <rect x={24} y={280} width={14} height={12} fill="url(#sk-noglue)" stroke={C.ruby} />
      <T x={46} y={290} s={10.5} c={C.text}>the fork slot</T>
      <rect x={160} y={280} width={14} height={12} fill="url(#sk-noglue)" stroke={C.ruby} />
      <T x={182} y={290} s={10.5} c={C.text}>the impulse faces of the stones</T>
      <T x={22} y={312} s={10.5} c={C.dim}>Shellac there behaves like dirt in the escapement.</T>
    </F>
  )
}

function RsShRoller() {
  return (
    <F h={330} view="Section + plan · set a roller jewel" scale="enlarged · schematic">
      <Pn x={10} y={26} w={200} h={212} t="Upright, minimum shellac" />
      <rect x={50} y={110} width={120} height={22} fill="url(#rs-cut)" stroke={R.steelD} strokeWidth="0.6" />
      <rect x={104} y={70} width={12} height={92} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.5" />
      <rect x={140} y={110} width={12} height={58} fill={C.ruby} stroke={R.rubyD} />
      <path d="M138 132 L138 136 Q146 140 154 136 L154 132 Z" fill={R.shellac} />
      <path d="M140 110 L140 106 L152 106 L152 110" fill="none" stroke={R.shellac} strokeWidth="1.6" />
      <line x1={146} y1={92} x2={146} y2={182} stroke={C.emerald} strokeDasharray="3 2" />
      <T x={146} y={86} a="middle" s={10} c={C.emerald}>upright</T>
      <SL p={[152, 150]} x={168} y={168} text="impulse" sub="jewel" />
      <SL p={[70, 121]} x={72} y={196} text="roller table, warmed" />
      <T x={20} y={222} s={10} c={C.faint}>secure with as little as will hold</T>

      <Pn x={218} y={26} w={252} h={212} t="Then check it works" />
      <PalletBig x={344} y={180} k={0.75} shellac={false} />
      <circle cx={344} cy={86} r={30} fill="url(#sk-steel)" stroke={R.steelD} />
      <path d={arcD(344, 86, 30, 70, 110)} fill="none" stroke={C.ground} strokeWidth="6" />
      <circle cx={344} cy={110} r={5} fill={C.ruby} stroke={R.rubyD} />
      <circle cx={344} cy={136} r={2.5} fill={C.text} />
      <SL p={[349, 110]} x={392} y={104} text="jewel enters" sub="the slot cleanly" />
      <SL p={[344, 136]} x={392} y={146} text="guard pin" sub="safety action" />
      <SL p={[322, 108]} x={240} y={64} text="crescent" />

      <rect x={10} y={248} width={460} height={72} rx="7" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <T x={22} y={268} s={11} c={C.text} w={600}>The roller jewel is never oiled.</T>
      <T x={22} y={286} s={10.5} c={C.dim}>Stray shellac around it behaves exactly like a smear of dirt. Seat it upright,</T>
      <T x={22} y={300} s={10.5} c={C.dim}>correctly oriented, and confirm the guard pin and crescent still give safety.</T>
    </F>
  )
}

function RsShBanking() {
  return (
    <F h={316} view="Plan · banking and the fork’s travel" scale="schematic">
      <Pn x={10} y={26} w={226} h={210} t="Banking pins (older)" />
      <PalletBig x={122} y={156} k={0.95} shellac={false} />
      {[-1, 1].map((sd) => (
        <g key={sd}>
          <circle cx={122 + sd * 26} cy={80} r={5} fill="url(#rs-bcut)" stroke={R.brassD} />
          <Arrow a={[122 + sd * 46, 80]} b={[122 + sd * 34, 80]} c="brass" w={1.2} both />
        </g>
      ))}
      <path d={arcD(122, 156, 86, -112, -68)} fill="none" stroke={C.steel} strokeWidth="1.3" markerEnd="url(#sk-a-steel)" markerStart="url(#sk-a-steel)" />
      <T x={30} y={104} s={10} c={C.steel}>fork swing</T>
      <T x={22} y={210} s={10.5} c={C.text}>Moving a pin changes</T>
      <T x={22} y={224} s={10.5} c={C.text}>slide and total lock.</T>

      <Pn x={244} y={26} w={226} h={210} t="Fixed banking (many modern)" />
      <PalletBig x={356} y={156} k={0.95} shellac={false} />
      {[-1, 1].map((sd) => (
        <path key={sd} d={`M${356 + sd * 22} 70 L${356 + sd * 42} 70 L${356 + sd * 42} 100 L${356 + sd * 24} 100 Z`} fill="url(#rs-pcut)" stroke={R.brassD} />
      ))}
      <T x={256} y={210} s={10.5} c={C.text}>Nothing to move here:</T>
      <T x={256} y={224} s={10.5} c={C.text}>all adjustment is at the stones.</T>
      <rect x={10} y={246} width={460} height={60} rx="7" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <T x={22} y={266} s={11} c={C.text} w={600}>Total lock = lock + slide (run to the banking)</T>
      <T x={22} y={284} s={10.5} c={C.dim}>Opening the bankings adds slide. See “The Swiss lever” for the checks.</T>
    </F>
  )
}

function RsShCleaning() {
  return (
    <F h={316} view="Sequence · the cleaning trap" scale="schematic">
      <Pn x={10} y={26} w={140} h={170} t="Before" ok />
      <PalletBig x={80} y={120} k={0.8} />
      <T x={80} y={182} a="middle" s={10.5} c={C.dim}>stones secure</T>
      <FA a={[152, 110]} b={[168, 110]} c="ruby" />
      <Pn x={170} y={26} w={140} h={170} t="Long alcohol soak" c={C.ruby} tc={C.ruby} />
      <path d="M196 70 L196 168 Q196 176 204 176 L276 176 Q284 176 284 168 L284 70" fill="none" stroke="#7fa0b0" strokeWidth="1.4" />
      <rect x={198} y={96} width={84} height={78} fill="rgba(127,196,232,0.18)" />
      <PalletBig x={240} y={130} k={0.6} />
      <T x={240} y={64} a="middle" s={10} c={R.oil}>shellac dissolves</T>
      <FA a={[312, 110]} b={[328, 110]} c="ruby" />
      <Pn x={330} y={26} w={140} h={170} t="After" c={C.ruby} tc={C.ruby} ok={false} />
      <PalletBig x={400} y={120} k={0.8} loose />
      <T x={400} y={182} a="middle" s={10.5} c={C.ruby}>a stone rattles loose</T>

      <rect x={10} y={206} width={460} height={98} rx="7" fill="rgba(123,165,131,0.07)" stroke={C.emerald} />
      <T x={22} y={226} s={11} c={C.text} w={600}>Every clean, for shellacked parts</T>
      {['short cycles', 'appropriate fluids', 'inspect stones and roller jewel after'].map((t, i) => (
        <g key={t}>
          <Num x={32} y={248 + i * 20} n={i + 1} r={7} c={C.emerald} />
          <T x={46} y={252 + i * 20} s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
      <T x={300} y={268} s={10.5} c={C.dim}>Fine before the</T>
      <T x={300} y={282} s={10.5} c={C.dim}>clean, loose after.</T>
    </F>
  )
}

function RsShVerify() {
  return (
    <F h={316} view="Trace · proof on the timegrapher" scale="schematic · no values">
      <Pn x={10} y={26} w={226} h={190} t="Correct adjustment" ok />
      <Screen x={24} y={46} w={198} h={90} lines={[{ y: 0.18, c: C.brassHi }, { y: -0.18, c: C.steel }]} />
      {['clean, thin trace', 'equal lock on both stones', 'better amplitude'].map((t, i) => (
        <g key={t}>
          <circle cx={30} cy={156 + i * 18} r={2.5} fill={C.emerald} />
          <T x={40} y={160 + i * 18} s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
      <Pn x={244} y={26} w={226} h={190} t="Not yet" c={C.ruby} tc={C.ruby} ok={false} />
      <Screen x={258} y={46} w={198} h={90} lines={[{ y: 0.4, c: C.brassHi, fat: 12 }, { y: -0.3, c: C.steel, fat: 12 }]} seed={9} />
      {['fat trace', 'beat won’t settle'].map((t, i) => (
        <g key={t}>
          <circle cx={264} cy={156 + i * 18} r={2.5} fill={C.ruby} />
          <T x={274} y={160 + i * 18} s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
      <Arrow d="M356 222 Q356 244 300 248" c="ruby" w={1.4} />
      <Bx x={12} y={232} w={284} h={68} l={['Go back to lock, drop and', 'safety action', 'before blaming the balance']} c={C.ruby} />
    </F>
  )
}


/* ================================================================== */
/* rest-case · case refinishing and dial ethics                         */
/* ================================================================== */

// Case seen from above with lugs. Finishes: top brushed, bezel polished, bevels polished.
function CasePlan({ cx, cy, r = 70 }) {
  const lug = (sx, sy) => {
    const x0 = cx + sx * r * 0.42
    const x1 = cx + sx * r * 0.82
    const y0 = cy + sy * r * 0.7
    const y1 = cy + sy * r * 1.42
    return (
      <g key={`${sx}${sy}`}>
        <path d={`M${x0} ${y0} L${x1} ${y0} L${x1} ${y1} L${x0} ${y1} Z`} fill="url(#rs-brush)" stroke={R.steelD} strokeWidth="0.6" />
        <rect x={sx > 0 ? x1 - 4 : x1} y={Math.min(y0, y1)} width={4} height={Math.abs(y1 - y0)} fill="url(#sk-steelH)" />
      </g>
    )
  }
  return (
    <g>
      {[-1, 1].map((sx) => [-1, 1].map((sy) => lug(sx, sy)))}
      <circle cx={cx} cy={cy} r={r} fill="url(#rs-brush)" stroke={R.steelD} />
      <circle cx={cx} cy={cy} r={r * 0.8} fill="url(#sk-steel)" stroke={R.steelD} />
      <circle cx={cx} cy={cy} r={r * 0.66} fill="url(#sk-glass)" stroke="#7fa0b0" />
      <circle cx={cx} cy={cy} r={r * 0.62} fill="#26211b" opacity="0.8" />
      <rect x={cx + r - 2} y={cy - 8} width={14} height={16} rx="2" fill="url(#rs-knurl)" stroke={R.steelD} strokeWidth="0.5" />
    </g>
  )
}

function RsCsRead() {
  return (
    <F h={330} view="Plan · map the finishes first" scale="schematic">
      <CasePlan cx={130} cy={160} r={74} />
      <SL p={[130 + 74 * 0.6, 160 - 74 * 0.6]} x={236} y={60} text="top: brushed (satin)" />
      <SL p={[130, 160 - 74 * 0.72]} x={236} y={84} text="bezel: polished (mirror)" />
      <SL p={[130 + 74 * 0.8, 160 + 74 * 1.2]} x={236} y={290} text="lug bevel: polished" sub="crisp edge between finishes" />
      <SL p={[130 - 74 * 0.6, 160 + 74 * 1.2]} x={118} y={318} text="lug top: brushed" />
      {/* side inset: bead-blasted flank */}
      <Tag x={290} y={124}>Side view</Tag>
      <rect x={290} y={134} width={170} height={30} rx="4" fill="url(#rs-bead)" stroke={R.steelD} />
      <rect x={290} y={130} width={170} height={6} fill="url(#sk-steelH)" />
      <T x={290} y={182} s={10.5} c={C.text}>flank: bead-blasted</T>
      <T x={290} y={196} s={10} c={C.faint}>(one possible map)</T>
      <rect x={290} y={212} width={170} height={52} rx="6" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <T x={302} y={232} s={10.5} c={C.text} w={600}>Photograph it, then</T>
      <T x={302} y={248} s={10.5} c={C.dim}>restore each finish inside</T>
      <T x={302} y={262} s={10.5} c={C.dim}>its original boundaries.</T>
    </F>
  )
}

function RsCsGeometry() {
  return (
    <F h={320} view="Section · a lug edge, before you touch it" scale="schematic">
      <Pn x={10} y={26} w={226} h={150} t="Sharp, correct" ok />
      <path d="M40 150 L40 70 L160 70 L190 92 L210 92 L210 150 Z" fill="url(#rs-cut)" stroke={R.steelD} />
      <line x1={160} y1={70} x2={190} y2={92} stroke="#ffffff" strokeWidth="2" opacity="0.8" />
      <SL p={[176, 81]} x={196} y={60} text="bevel" />
      <T x={70} y={166} s={10.5} c={C.dim}>crisp lines, flat faces</T>
      <Pn x={244} y={26} w={226} h={150} t="Over-polished" c={C.ruby} tc={C.ruby} ok={false} />
      <path d="M274 150 L274 80 Q274 70 290 70 L380 70 Q430 72 444 110 L444 150 Z" fill="url(#rs-cut)" stroke={C.ruby} />
      <path d="M394 70 L424 92 L444 92" fill="none" stroke={C.faint} strokeDasharray="2 2" />
      <T x={300} y={166} s={10.5} c={C.ruby}>soft, melted, bevel gone</T>

      <Tag x={14} y={200}>How to keep it</Tag>
      {/* flat backing */}
      <rect x={20} y={278} width={150} height={10} fill="#5f6b70" />
      <rect x={20} y={272} width={150} height={6} fill="rgba(208,168,79,0.4)" />
      <path d="M60 272 L60 236 L140 236 L140 272 Z" fill="url(#sk-steel)" stroke={R.steelD} />
      <Arrow a={[40, 254]} b={[154, 254]} c="brass" w={1.3} both />
      <T x={20} y={306} s={10.5} c={C.text}>flat surface on a flat backing</T>
      {/* masking */}
      <path d="M220 280 L220 236 L300 236 L330 256 L330 280 Z" fill="url(#sk-steel)" stroke={R.steelD} />
      <path d="M300 236 L330 256 L330 280 L300 280 Z" fill={R.gold} opacity="0.55" />
      <T x={212} y={306} s={10.5} c={C.text}>mask the next facet</T>
      <rect x={350} y={222} width={118} height={86} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <Note x={360} y={242} lines={['Least aggressive', 'abrasive that', 'does the job: you', 'can’t put metal back']} s={10.5} lh={14} c={C.text} />
    </F>
  )
}

function RsCsNoRefinish() {
  const layer = (x, y, top, base, thin, cut) => (
    <g>
      <rect x={x} y={y + 6} width={120} height={40} fill={base} stroke={R.steelD} strokeWidth="0.5" />
      <path d={cut ? `M${x} ${y} L${x + 40} ${y} Q${x + 60} ${y + 9} ${x + 80} ${y} L${x + 120} ${y} L${x + 120} ${y + thin} L${x} ${y + thin} Z` : `M${x} ${y} L${x + 120} ${y} L${x + 120} ${y + thin} L${x} ${y + thin} Z`} fill={top} />
      {cut && <path d={`M${x + 40} ${y} Q${x + 60} ${y + 12} ${x + 80} ${y}`} fill={base} stroke={C.ruby} strokeWidth="1.2" />}
    </g>
  )
  return (
    <F h={330} view="Section · surfaces you must not polish" scale="layers exaggerated">
      <Pn x={10} y={26} w={226} h={140} t="PVD, DLC, plated" c={C.ruby} tc={C.ruby} />
      {layer(28, 70, '#2a2a2e', '#a9b6be', 6, true)}
      <T x={28} y={140} s={10.5} c={C.text}>polish = coating removed</T>
      <T x={28} y={154} s={10} c={C.faint}>fix: strip and re-coat</T>
      <T x={160} y={84} s={10} c={C.faint}>coating</T>

      <Pn x={244} y={26} w={226} h={140} t="Gold-filled, gold-plated" c={C.ruby} tc={C.ruby} />
      {layer(262, 70, R.gold, '#b08a5a', 6, true)}
      <T x={262} y={140} s={10.5} c={C.text}>a thin layer: polishing</T>
      <T x={262} y={154} s={10.5} c={C.text}>goes straight through</T>
      <T x={392} y={84} s={10} c={C.faint}>gold</T>
      <T x={392} y={110} s={10} c={C.faint}>base</T>

      <Pn x={10} y={174} w={226} h={146} t="Titanium" c={C.brass} tc={C.brass} />
      <rect x={28} y={206} width={190} height={40} rx="4" fill="#8f9396" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${50 + i * 36} ${214 + (i % 2) * 8} l22 ${10 - (i % 2) * 6}`} stroke="#d8dcde" strokeWidth="1" />)}
      <T x={28} y={270} s={10.5} c={C.text}>behaves differently from</T>
      <T x={28} y={284} s={10.5} c={C.text}>steel and marks easily</T>
      <Pn x={244} y={174} w={226} h={146} t="Rule" />
      <Note x={258} y={210} lines={['Know the material', 'before any abrasive', 'touches it.']} s={11} lh={16} c={C.text} />
    </F>
  )
}

function RsCsDial() {
  const drop = (x, y, c) => <path d={`M${x} ${y - 12} Q${x + 8} ${y} ${x} ${y + 4} Q${x - 8} ${y} ${x} ${y - 12} Z`} fill={c} opacity="0.85" />
  return (
    <F h={316} view="Comparison · a vintage dial" scale="schematic">
      <circle cx={84} cy={124} r={64} fill="#d8cdb0" stroke={C.struct} />
      <circle cx={84} cy={124} r={64} fill="rgba(140,110,60,0.18)" />
      {Array.from({ length: 12 }, (_, i) => {
        const p0 = pol(84, 124, 56, i * 30 - 90)
        const p1 = pol(84, 124, 48, i * 30 - 90)
        return <line key={i} x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke="#3a342c" strokeWidth={i % 3 ? 1.2 : 2.4} />
      })}
      <T x={84} y={102} a="middle" s={10} c="#3a342c" w={700}>PRINTING</T>
      <T x={84} y={160} a="middle" s={10} c="#6a5a3c">patina</T>
      <T x={84} y={210} a="middle" s={10.5} c={C.dim}>original print and patina</T>

      <Pn x={164} y={26} w={148} h={196} t="Never liquid" c={C.ruby} tc={C.ruby} ok={false} />
      {drop(196, 76, R.oil)}
      {drop(238, 76, '#c8e0ea')}
      {drop(280, 76, '#e4d6a3')}
      <T x={196} y={100} a="middle" s={10} c={C.text}>water</T>
      <T x={238} y={100} a="middle" s={10} c={C.text}>alcohol</T>
      <T x={280} y={100} a="middle" s={10} c={C.text}>cleaners</T>
      <Note x={176} y={132} lines={['lift printing and', 'destroy patina in', 'seconds, and it', 'can’t be undone']} s={10.5} lh={14} c={C.ruby} />

      <Pn x={320} y={26} w={150} h={196} t="Dry only" ok />
      <path d="M340 70 L370 70 L380 76 L370 82 L340 82 Z" fill="#6b4a4a" stroke="#3a2a2a" />
      <path d="M382 70 Q394 66 400 60 M382 82 Q394 86 400 92" stroke={C.dim} strokeDasharray="2 2" fill="none" />
      <T x={344} y={104} s={10.5} c={C.text}>blower</T>
      <rect x={346} y={124} width={6} height={36} rx="2" fill="url(#sk-wood)" />
      {Array.from({ length: 7 }, (_, i) => <line key={i} x1={346 + i} y1={160} x2={343 + i * 2} y2={176} stroke="#d9c9a8" strokeWidth="0.8" />)}
      <T x={366} y={150} s={10.5} c={C.text}>very soft</T>
      <T x={366} y={164} s={10.5} c={C.text}>brush</T>
      <T x={334} y={202} s={10.5} c={C.emerald}>then stop</T>

      <rect x={12} y={234} width={456} height={70} rx="7" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <T x={24} y={254} s={11} c={C.text} w={600}>Genuinely damaged? That’s a specialist’s job.</T>
      <T x={24} y={272} s={10.5} c={C.dim}>More vintage watches are ruined by a well-meant dial clean than by any</T>
      <T x={24} y={286} s={10.5} c={C.dim}>mechanical fault.</T>
    </F>
  )
}

function RsCsBluing() {
  return (
    <F h={330} view="Setup + colour · bluing steel hands" scale="schematic">
      <Num x={22} y={44} n={1} r={7} />
      <T x={34} y={48} s={10.5} c={C.text}>stone or lap flat and polished, clean</T>
      {/* brass pan of sand on heat */}
      <path d="M40 150 L52 186 L208 186 L220 150 Z" fill="url(#sk-brassG)" stroke={R.brassD} />
      <path d="M44 152 L216 152 L210 166 L50 166 Z" fill="#c9b07a" />
      {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={56 + ((i * 37) % 150)} cy={156 + ((i * 7) % 8)} r={0.9} fill="#8a7448" />)}
      <path d="M90 150 L150 146 L154 149 L150 152 Z" fill={R.blue} />
      <circle cx={88} cy={150} r={4} fill={R.blue} />
      <path d="M160 152 L196 148 L198 150 L196 152 Z" fill="#7a3f86" />
      <ellipse cx={130} cy={214} rx={26} ry={22} fill="url(#rs-flame)" />
      <T x={130} y={250} a="middle" s={10} c={C.faint}>even heat</T>
      <T x={232} y={164} s={10.5} c={C.dim}>brass pan of sand</T>
      <T x={232} y={178} s={10.5} c={C.dim}>(or a bluing tray)</T>
      <T x={232} y={142} s={10.5} c={C.text}>hands on the sand</T>

      <Num x={22} y={84} n={2} r={7} />
      <T x={34} y={88} s={10.5} c={C.text}>heat evenly and watch the colours run</T>
      <rect x={22} y={268} width={360} height={18} rx="3" fill="url(#rs-temper)" />
      <T x={70} y={302} a="middle" s={10.5} c={C.text}>straw</T>
      <T x={232} y={302} a="middle" s={10.5} c={C.text}>purple</T>
      <T x={330} y={302} a="middle" s={10.5} c={C.text}>cornflower blue</T>
      <Arrow a={[40, 316]} b={[300, 316]} c="steel" w={1.2} />
      <T x={22} y={326} s={10} c={C.faint}>hotter</T>
      <line x1={322} y1={262} x2={322} y2={292} stroke={C.text} strokeWidth="2" />
      <Num x={400} y={276} n={3} r={7} />
      <T x={412} y={272} s={10.5} c={C.text}>quench</T>
      <T x={412} y={286} s={10.5} c={C.text}>right here</T>

      <rect x={300} y={30} width={168} height={98} rx="7" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <T x={312} y={50} s={11} c={C.ruby} w={600}>Spotless steel</T>
      <Note x={312} y={68} lines={['A fingerprint or a hot', 'spot leaves a permanent', 'patch of the wrong', 'colour.']} s={10.5} lh={14} c={C.text} />
      <T x={300} y={226} s={10} c={C.faint}>Learn on a spare set.</T>
      <T x={300} y={240} s={10} c={C.faint}>Screws blue the same way.</T>
    </F>
  )
}

function RsCsEthics() {
  return (
    <F h={316} view="Decision · reversible or not?" scale="schematic">
      <Pn x={10} y={26} w={226} h={170} t="Reversible: always safe" c={C.emerald} tc={C.emerald} />
      {['crystal polish', 'service', 'new gaskets'].map((t, i) => (
        <g key={t}>
          <Verdict x={30} y={62 + i * 30} ok r={7} />
          <T x={44} y={66 + i * 30} s={11} c={C.text}>{t}</T>
        </g>
      ))}
      <Pn x={244} y={26} w={226} h={170} t="Irreversible" c={C.ruby} tc={C.ruby} />
      {['case polish', 'redial', 'relume'].map((t, i) => (
        <g key={t}>
          <circle cx={264} cy={62 + i * 30} r={7} fill="none" stroke={C.ruby} strokeWidth="1.4" />
          <T x={264} y={66 + i * 30} a="middle" s={10} c={C.ruby} w={700}>!</T>
          <T x={278} y={66 + i * 30} s={11} c={C.text}>{t}</T>
        </g>
      ))}
      <T x={256} y={160} s={10.5} c={C.ruby}>needs a good reason</T>
      <T x={256} y={174} s={10.5} c={C.ruby}>and disclosure</T>
      <rect x={10} y={206} width={226} height={98} rx="7" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <Note x={22} y={226} lines={['Collectors value originality', 'over perfection. A redialled', 'watch loses most of its', 'collector value.']} s={10.5} lh={15} c={C.text} />
      <rect x={244} y={206} width={226} height={98} rx="7" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <rect x={258} y={222} width={36} height={44} rx="3" fill="rgba(255,255,255,0.05)" stroke={C.dim} strokeDasharray="2 2" />
      <circle cx={270} cy={238} r={4} fill={C.steel} />
      <rect x={276} y={246} width={12} height={3} fill={C.brass} />
      <Note x={304} y={226} lines={['Keep every original', 'part with the watch,', 'even replaced ones.', 'Say so when you sell.']} s={10.5} lh={15} c={C.text} />
    </F>
  )
}

/* ================================================================== */
/* rest-endshake · endshake and side-shake                              */
/* ================================================================== */

// Arbor between a bridge (top) and plate (bottom), section. gap: shake at the top shoulder in px.
function ArborSec({ x, y, h = 170, gap = 5, wheel = true, lift = 0, oval }) {
  const top = y
  const bot = y + h
  return (
    <g>
      <Slab x0={x - 70} x1={x - 15} y={top} th={22} />
      <Slab x0={x + 15} x1={x + 70} y={top} th={22} />
      <JewelSec x={x} y={top + 11} w={30} h={22} d={oval ? 12 : 7} sink={false} />
      <Slab x0={x - 70} x1={x - 15} y={bot - 22} th={22} />
      <Slab x0={x + 15} x1={x + 70} y={bot - 22} th={22} />
      <JewelSec x={x} y={bot - 11} w={30} h={22} d={7} sink={false} />
      <g transform={`translate(0 ${-lift})`}>
        <rect x={x - 3} y={top + 6 + gap} width={6} height={16} fill="url(#sk-steelH)" />
        <rect x={x - 7} y={top + 22 + gap} width={14} height={h - 44 - gap} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.5" />
        <rect x={x - 3} y={bot - 22} width={6} height={16} fill="url(#sk-steelH)" />
        {wheel && <rect x={x - 54} y={top + h * 0.45} width={108} height={6} fill={R.brassP} />}
      </g>
    </g>
  )
}

function RsEsDefine() {
  return (
    <F h={316} view="Section + plan · two kinds of play" scale="clearances exaggerated">
      <Pn x={10} y={26} w={226} h={226} t="Endshake" />
      <ArborSec x={110} y={52} h={180} gap={7} />
      <Arrow a={[200, 158]} b={[200, 122]} c="brass" w={1.5} both />
      <T x={196} y={176} a="end" s={10.5} c={C.brassHi}>along its</T>
      <T x={196} y={190} a="end" s={10.5} c={C.brassHi}>own axis</T>
      <T x={22} y={244} s={10} c={C.faint}>between its two bearings</T>

      <Pn x={244} y={26} w={226} h={226} t="Side-shake" />
      <circle cx={356} cy={128} r={56} fill="url(#rs-jewel)" stroke={R.rubyD} />
      <circle cx={356} cy={128} r={22} fill={C.ground} />
      <circle cx={350} cy={128} r={16} fill="url(#sk-steelH)" stroke={R.steelD} />
      <Arrow a={[318, 206]} b={[394, 206]} c="brass" w={1.5} both />
      <T x={356} y={226} a="middle" s={10.5} c={C.brassHi}>sideways, in the hole</T>
      <SL p={[350, 128]} x={420} y={70} text="pivot" />

      <line x1={40} y1={286} x2={440} y2={286} stroke={C.struct} />
      <rect x={180} y={278} width={120} height={16} fill="rgba(123,165,131,0.25)" stroke={C.emerald} />
      <T x={240} y={308} a="middle" s={10.5} c={C.emerald}>a tiny amount: wanted</T>
      <T x={40} y={308} s={10.5} c={C.ruby}>none: fault</T>
      <T x={440} y={308} a="end" s={10.5} c={C.ruby}>excessive: fault</T>
      <circle cx={40} cy={286} r={4} fill={C.ruby} />
      <circle cx={440} cy={286} r={4} fill={C.ruby} />
    </F>
  )
}

function RsEsFeel() {
  return (
    <F h={316} view="Section · feel it, bridge down" scale="clearances exaggerated">
      <ArborSec x={110} y={40} h={180} gap={0} lift={0} />
      {/* ghost lifted */}
      <rect x={103} y={96} width={14} height={4} fill="none" />
      <G x={60} y={128} ang={40}>
        <Pegwood len={70} />
      </G>
      <Arrow a={[40, 150]} b={[40, 112]} c="brass" w={1.5} />
      <T x={20} y={168} s={10.5} c={C.brassHi}>lift gently</T>
      <Arrow a={[160, 140]} b={[196, 140]} c="steel" w={1.4} both />
      <T x={170} y={160} s={10.5} c={C.steel}>nudge</T>
      <T x={170} y={174} s={10.5} c={C.steel}>sideways</T>
      <Screw x={66} y={34} r={6} />
      <Screw x={154} y={34} r={6} />
      <T x={110} y={244} a="middle" s={10.5} c={C.text}>watch the pivot rise and</T>
      <T x={110} y={258} a="middle" s={10.5} c={C.text}>drop a hair in its jewel</T>

      <Sep x1={238} y1={30} x2={238} y2={300} />
      <Tag x={250} y={44}>How sensitive</Tag>
      {[
        ['Balance', 1],
        ['Escape wheel', 1],
        ['Train wheels', 0],
      ].map(([n, hi], i) => (
        <g key={n}>
          <T x={250} y={78 + i * 40} s={11} c={C.text}>{n}</T>
          <rect x={350} y={66 + i * 40} width={110} height={16} rx="3" fill="rgba(255,255,255,0.04)" stroke={C.line} />
          <rect x={350} y={66 + i * 40} width={hi ? 104 : 60} height={16} rx="3" fill={hi ? C.ruby : C.brass} opacity="0.6" />
        </g>
      ))}
      <T x={250} y={196} s={10.5} c={C.dim}>Balance and escape wheel are</T>
      <T x={250} y={210} s={10.5} c={C.dim}>the most sensitive; a train</T>
      <T x={250} y={224} s={10.5} c={C.dim}>wheel can take a little more.</T>
      <T x={250} y={256} s={10} c={C.faint}>bars: sensitivity, not values</T>
    </F>
  )
}

function RsEsWhy() {
  return (
    <F h={316} view="Comparison · why it matters" scale="schematic">
      <Pn x={10} y={26} w={148} h={210} t="Too much" c={C.ruby} tc={C.ruby} />
      <ArborSec x={84} y={50} h={130} gap={14} wheel={false} />
      <rect x={52} y={118} width={64} height={5} fill={R.brassP} />
      <rect x={112} y={110} width={30} height={5} fill="url(#sk-steelH)" opacity="0.7" />
      <T x={84} y={200} a="middle" s={10} c={C.text}>wheels change depth</T>
      <T x={84} y={214} a="middle" s={10} c={C.text}>“runs dial-up,</T>
      <T x={84} y={227} a="middle" s={10} c={C.text}>stops crown-down”</T>

      <Pn x={166} y={26} w={148} h={210} t="Too little" c={C.ruby} tc={C.ruby} />
      <ArborSec x={240} y={50} h={130} gap={-2} wheel={false} />
      <circle cx={240} cy={64} r={10} fill="none" stroke={C.ruby} strokeWidth="1.4" />
      <circle cx={240} cy={166} r={10} fill="none" stroke={C.ruby} strokeWidth="1.4" />
      <T x={240} y={200} a="middle" s={10} c={C.text}>pivots pinched:</T>
      <T x={240} y={214} a="middle" s={10} c={C.text}>won’t run</T>

      <Pn x={322} y={26} w={148} h={210} t="Excess side-shake" c={C.ruby} tc={C.ruby} />
      <circle cx={396} cy={112} r={46} fill="url(#rs-jewel)" stroke={R.rubyD} />
      <ellipse cx={400} cy={112} rx={24} ry={16} fill={C.ground} />
      <circle cx={388} cy={112} r={12} fill="url(#sk-steelH)" stroke={R.steelD} />
      <Arrow a={[374, 172]} b={[418, 172]} c="ruby" w={1.3} both />
      <T x={396} y={200} a="middle" s={10} c={C.text}>worn hole: pivot</T>
      <T x={396} y={214} a="middle" s={10} c={C.text}>wanders out of good</T>
      <T x={396} y={227} a="middle" s={10} c={C.text}>engagement</T>
      <rect x={10} y={246} width={460} height={58} rx="7" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <T x={22} y={266} s={10.5} c={C.dim}>Too much endshake lets the escapement lose power or stop in some</T>
      <T x={22} y={280} s={10.5} c={C.dim}>positions. Too little and the watch won’t run at all.</T>
    </F>
  )
}

function RsEsTooMuch() {
  return (
    <F h={330} view="Section · close the gap gradually" scale="clearances exaggerated">
      <Pn x={10} y={26} w={226} h={230} t="Friction jewel: press deeper" />
      <ArborSec x={110} y={78} h={160} gap={10} wheel={false} />
      <rect x={100} y={50} width={20} height={26} fill="url(#sk-steelH)" stroke={R.steelD} strokeWidth="0.5" />
      <Arrow a={[150, 50]} b={[150, 74]} c="brass" w={1.5} />
      <T x={156} y={60} s={10} c={C.brassHi}>toward</T>
      <T x={156} y={72} s={10} c={C.brassHi}>the wheel</T>
      <T x={30} y={250} s={10} c={C.faint}>jewelling tool, gap shrinks</T>

      <Pn x={244} y={26} w={226} h={230} t="Rub-in setting: close it" />
      <Slab x0={262} x1={330} y={110} th={24} />
      <Slab x0={384} x1={452} y={110} th={24} />
      <JewelSec x={357} y={126} w={46} h={12} d={7} sink={false} />
      {[-1, 1].map((sd) => (
        <path key={sd} d={`M${357 + sd * 27} 110 L${357 + sd * 27} 100 Q${357 + sd * 27} 112 ${357 + sd * 19} 118`} fill="url(#rs-bcut)" stroke={R.brassD} strokeWidth="0.8" />
      ))}
      <G x={392} y={100} ang={30}>
        <Burnisher len={70} />
      </G>
      <T x={262} y={180} s={10.5} c={C.text}>carefully close</T>
      <T x={262} y={194} s={10.5} c={C.text}>the bearing</T>
      <T x={262} y={214} s={10} c={C.faint}>older movements</T>

      <rect x={10} y={264} width={460} height={56} rx="7" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <T x={22} y={284} s={11} c={C.ruby} w={600}>Over-closing leaves zero endshake and a seized wheel.</T>
      <T x={22} y={302} s={10.5} c={C.dim}>Creep up on it, a few microns at a time; re-test free running every time.</T>
    </F>
  )
}

function RsEsTooLittle() {
  return (
    <F h={316} view="Section · give the pivot back its freedom" scale="clearances exaggerated">
      <Pn x={10} y={26} w={226} h={220} t="Train: lift the jewel" />
      <ArborSec x={110} y={56} h={170} gap={-1} wheel={false} />
      <Arrow a={[196, 76]} b={[196, 50]} c="brass" w={1.5} />
      <T x={184} y={96} s={10} c={C.brassHi}>outward,</T>
      <T x={184} y={108} s={10} c={C.brassHi}>slightly</T>
      <T x={22} y={240} s={10} c={C.faint}>or fit the correct jewel / spacer</T>

      <Pn x={244} y={26} w={226} h={220} t="Balance: shock setting first" />
      <Slab x0={262} x1={320} y={130} th={30} />
      <Slab x0={394} x1={452} y={130} th={30} />
      <rect x={320} y={126} width={74} height={34} fill="url(#rs-cut)" stroke={R.steelD} strokeWidth="0.6" opacity="0.7" />
      <JewelSec x={357} y={150} w={44} h={12} d={6} />
      <rect x={333} y={132} width={48} height={7} rx="2" fill="url(#rs-jewel)" stroke={R.rubyD} strokeWidth="0.6" />
      <path d="M314 124 Q338 110 357 120 Q376 110 400 124" fill="none" stroke={C.steel} strokeWidth="1.8" />
      <rect x={354} y={156} width={6} height={50} fill="url(#sk-steelH)" />
      <SL p={[372, 135]} x={404} y={92} text="cap jewel" />
      <SL p={[320, 118]} x={272} y={92} text="spring" />
      <T x={256} y={214} s={10.5} c={C.text}>endshake is set by the cap-</T>
      <T x={256} y={228} s={10.5} c={C.text}>jewel / Incabloc setting</T>
      <rect x={10} y={256} width={460} height={48} rx="7" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <T x={22} y={276} s={11} c={C.text} w={600}>A pinched pivot needs its sliver of freedom back.</T>
      <T x={22} y={292} s={10.5} c={C.dim}>On the balance, inspect the setting before touching anything else.</T>
    </F>
  )
}

function RsEsSideShake() {
  return (
    <F h={300} view="Plan · a worn hole can’t be squeezed round" scale="schematic">
      <Pn x={10} y={26} w={148} h={190} t="Worn oval" />
      <circle cx={84} cy={112} r={50} fill="url(#rs-jewel)" stroke={R.rubyD} />
      <ellipse cx={88} cy={112} rx={22} ry={13} fill={C.ground} />
      <circle cx={80} cy={112} r={10} fill="url(#sk-steelH)" stroke={R.steelD} />
      <T x={84} y={190} a="middle" s={10.5} c={C.dim}>real side-shake wear</T>
      <FA a={[160, 112]} b={[174, 112]} c="ruby" />
      <Pn x={176} y={26} w={140} h={190} t="Close it" c={C.ruby} tc={C.ruby} ok={false} />
      <circle cx={246} cy={112} r={50} fill="url(#rs-jewel)" stroke={R.rubyD} />
      <path d="M232 112 Q246 96 262 108 Q256 124 240 122 Z" fill={C.ground} />
      <Arrow a={[200, 112]} b={[214, 112]} c="ruby" w={1.3} />
      <Arrow a={[292, 112]} b={[278, 112]} c="ruby" w={1.3} />
      <T x={246} y={190} a="middle" s={10.5} c={C.ruby}>stays out of round</T>
      <Pn x={324} y={26} w={146} h={190} t="Replace" ok />
      <circle cx={396} cy={112} r={50} fill="url(#rs-jewel)" stroke={R.rubyD} />
      <circle cx={396} cy={112} r={11.5} fill={C.ground} />
      <circle cx={396} cy={112} r={10} fill="url(#sk-steelH)" stroke={R.steelD} />
      <T x={396} y={182} a="middle" s={10.5} c={C.emerald}>hole matched to</T>
      <T x={396} y={196} a="middle" s={10.5} c={C.emerald}>the pivot diameter</T>
      <rect x={10} y={226} width={460} height={64} rx="7" fill="rgba(123,165,131,0.07)" stroke={C.emerald} />
      <T x={22} y={246} s={11} c={C.text} w={600}>The cure is a new jewel, or a re-bushed hole if unjewelled.</T>
      <T x={22} y={264} s={10.5} c={C.dim}>See “Jewelling: replace and re-set jewels”. Closing is for endshake,</T>
      <T x={22} y={278} s={10.5} c={C.dim}>never for a worn hole.</T>
    </F>
  )
}

function RsEsProve() {
  const names = ['DU', 'DD', 'CU', 'CD', 'CL', 'CR']
  const before = [0.82, 0.78, 0.46, 0.28, 0.5, 0.36]
  const after = [0.8, 0.78, 0.66, 0.62, 0.68, 0.64]
  const X = (i) => 46 + i * 44
  const Y = (v) => 190 - v * 130
  return (
    <F h={316} view="Chart · amplitude across positions" scale="schematic · no values">
      <line x1={30} y1={190} x2={290} y2={190} stroke={C.struct} />
      <line x1={30} y1={190} x2={30} y2={50} stroke={C.struct} />
      <T x={36} y={58} s={10} c={C.faint}>amplitude</T>
      {names.map((n, i) => (
        <T key={n} x={X(i)} y={206} a="middle" s={10.5} c={C.dim}>{n}</T>
      ))}
      <polyline points={before.map((v, i) => `${X(i)},${Y(v)}`).join(' ')} fill="none" stroke={C.ruby} strokeWidth="1.8" strokeDasharray="4 3" />
      <polyline points={after.map((v, i) => `${X(i)},${Y(v)}`).join(' ')} fill="none" stroke={C.emerald} strokeWidth="2" />
      {before.map((v, i) => <circle key={i} cx={X(i)} cy={Y(v)} r={3} fill={C.ruby} />)}
      {after.map((v, i) => <circle key={i} cx={X(i)} cy={Y(v)} r={3} fill={C.emerald} />)}
      <T x={160} y={226} a="middle" s={10.5} c={C.ruby}>before: big positional swing</T>
      <T x={160} y={240} a="middle" s={10.5} c={C.emerald}>after: held much closer</T>

      <Sep x1={306} y1={30} x2={306} y2={250} />
      <Tag x={318} y={44}>Still swinging?</Tag>
      <Bx x={318} y={56} w={150} h={40} l={['Endshake fixed,', 'swing remains']} c={C.ruby} />
      <FA a={[393, 98]} b={[393, 114]} />
      <Bx x={318} y={116} w={150} h={40} l={['Go on to poise', 'or the hairspring']} c={C.brass} />
      <rect x={10} y={256} width={460} height={50} rx="7" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <T x={22} y={276} s={11} c={C.text} w={600}>“Services fine but keeps odd time on the wrist”?</T>
      <T x={22} y={293} s={10.5} c={C.dim}>Check endshake before blaming the regulation. Rate should hold closer too.</T>
    </F>
  )
}

export const FIGS = {
  'rs-staff-diagnose': RsStaffDiagnose,
  'rs-staff-measure': RsStaffMeasure,
  'rs-staff-strip': RsStaffStrip,
  'rs-staff-remove': RsStaffRemove,
  'rs-staff-refit': RsStaffRefit,
  'rs-staff-order': RsStaffOrder,
  'rs-poise-true': RsPoiseTrue,
  'rs-poise-remove': RsPoiseRemove,
  'rs-poise-dynamic': RsPoiseDynamic,
  'rs-poise-read': RsPoiseRead,
  'rs-poise-not': RsPoiseNot,
  'rs-pos-six': RsPosSix,
  'rs-pos-h-v': RsPosHV,
  'rs-pos-spread': RsPosSpread,
  'rs-pos-order': RsPosOrder,
  'rs-pos-hairspring': RsPosHairspring,
  'rs-pos-good': RsPosGood,
  'rs-hs-magnet': RsHsMagnet,
  'rs-hs-handle': RsHsHandle,
  'rs-hs-true': RsHsTrue,
  'rs-hs-centre': RsHsCentre,
  'rs-hs-vibrate': RsHsVibrate,
  'rs-hs-scrap': RsHsScrap,
  'rs-jw-diagnose': RsJwDiagnose,
  'rs-jw-types': RsJwTypes,
  'rs-jw-setup': RsJwSetup,
  'rs-jw-push': RsJwPush,
  'rs-jw-depth': RsJwDepth,
  'rs-jw-bush': RsJwBush,
  'rs-jw-depth-tool': RsJwDepthTool,
  'rs-pv-inspect': RsPvInspect,
  'rs-pv-burnish': RsPvBurnish,
  'rs-pv-limit': RsPvLimit,
  'rs-pv-finish': RsPvFinish,
  'rs-sh-warm': RsShWarm,
  'rs-sh-reshellac': RsShReshellac,
  'rs-sh-roller': RsShRoller,
  'rs-sh-banking': RsShBanking,
  'rs-sh-cleaning': RsShCleaning,
  'rs-sh-verify': RsShVerify,
  'rs-cs-read': RsCsRead,
  'rs-cs-geometry': RsCsGeometry,
  'rs-cs-no-refinish': RsCsNoRefinish,
  'rs-cs-dial': RsCsDial,
  'rs-cs-bluing': RsCsBluing,
  'rs-cs-ethics': RsCsEthics,
  'rs-es-define': RsEsDefine,
  'rs-es-feel': RsEsFeel,
  'rs-es-why': RsEsWhy,
  'rs-es-too-much': RsEsTooMuch,
  'rs-es-too-little': RsEsTooLittle,
  'rs-es-side-shake': RsEsSideShake,
  'rs-es-prove': RsEsProve,
}
