// Diagrams for the "Diagnostics & Troubleshooting" track: a watch that won't
// run, bad timekeeping, water ingress, winding and setting faults, noises,
// hand friction, magnetism and low amplitude. Most steps here are decisions,
// so many figures are flows, isolation tests and ✓/✗ comparisons, each tied
// to the part or test the step names.
// Original schematics built on the strap kit. Nothing is traced from an ETA,
// Witschi or other published figure, and every number matches the step text.
import { C, Fig, T, Note, Dim, Arrow, Num, Verdict, Tag, Sep } from '../strap/kit.jsx'

/* ------------------------------------------------------------------ */
/* Palette and defs for this file                                       */
/* ------------------------------------------------------------------ */
const M = {
  gasket: '#e08a55',
  gasketEdge: '#f2b68f',
  plate: '#5b5339',
  board: '#2f4a5a',
  copper: '#c07f45',
  dial: '#d8d0bd',
  dialDark: '#25221f',
  glass: '#a9d0de',
  magnet: '#b5545f',
  grease: '#8fd19e',
  oil: '#7fc4e8',
  ink: '#120f0d',
  ruby: '#c9495e',
  brassP: '#b89548',
  brassD: '#7d6430',
  steelD: '#55646e',
  tray: '#e4dccb',
  light: 'rgba(240,214,140,0.13)',
  plastic: '#e9e1c6',
  tape: '#d9c86a',
}

function DDefs() {
  const hatch = (id, bg, fg) => (
    <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="6" fill={bg} />
      <line x1="0" y1="0" x2="0" y2="6" stroke={fg} strokeWidth="1.1" />
    </pattern>
  )
  return (
    <defs>
      {hatch('dg-cut', '#6f808b', '#a3b3bd')}
      {hatch('dg-mov', '#433c31', '#5e5546')}
      {hatch('dg-bcut', '#7f6a33', '#c6a65c')}
      <pattern id="dg-knurl" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#a7b6bf" />
        <line x1="2" y1="0" x2="2" y2="4" stroke="#55646e" strokeWidth="1" />
      </pattern>
      <pattern id="dg-carpet" width="6" height="8" patternUnits="userSpaceOnUse">
        <rect width="6" height="8" fill="#5a3b3b" />
        <path d="M1 8 L1.6 1 M3.5 8 L3 0.5 M5.2 8 L5.6 2" stroke="#7b5151" strokeWidth="1.1" />
      </pattern>
      <linearGradient id="dg-acr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(190,225,235,0.55)" />
        <stop offset="1" stopColor="rgba(120,170,190,0.28)" />
      </linearGradient>
      <radialGradient id="dg-cell" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#eef3f6" />
        <stop offset="0.6" stopColor="#aebcc5" />
        <stop offset="1" stopColor="#66767f" />
      </radialGradient>
      <radialGradient id="dg-gold" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#f6dc98" />
        <stop offset="0.6" stopColor="#cfa24a" />
        <stop offset="1" stopColor="#7d5f22" />
      </radialGradient>
      <radialGradient id="dg-lamp" cx="0.5" cy="0" r="1">
        <stop offset="0" stopColor="rgba(250,226,150,0.32)" />
        <stop offset="1" stopColor="rgba(250,226,150,0.02)" />
      </radialGradient>
    </defs>
  )
}

const F = ({ children, ...p }) => (
  <Fig {...p}>
    <DDefs />
    {children}
  </Fig>
)

// Group placed at a working point: tools extend up (−y) from (0,0)
const G = ({ x = 0, y = 0, ang = 0, k = 1, children, o }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${k})`} opacity={o}>
    {children}
  </g>
)

// clock-face polar point: 0° = 12 o'clock, clockwise
const clk = (cx, cy, r, deg) => [cx + r * Math.sin((deg * Math.PI) / 180), cy - r * Math.cos((deg * Math.PI) / 180)]
// screen polar: 0° = 3 o'clock, clockwise on screen
const pol = (cx, cy, r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)]

/* ------------------------------------------------------------------ */
/* Layout helpers                                                       */
/* ------------------------------------------------------------------ */
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

// Loupe ring for a magnified inset
const Ring = ({ x, y, r, c = C.brass }) => <circle cx={x} cy={y} r={r} fill="rgba(0,0,0,0.22)" stroke={c} strokeWidth="1.6" />

// A curved turning arrow round (cx, cy). from/to in clock degrees; cw = clockwise on screen.
function Turn({ cx, cy, r, from, to, c = 'brass', w = 1.8 }) {
  const [x1, y1] = clk(cx, cy, r, from)
  const [x2, y2] = clk(cx, cy, r, to)
  const sweep = to > from ? 1 : 0
  const large = Math.abs(to - from) > 180 ? 1 : 0
  return <Arrow d={`M${x1} ${y1} A${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`} c={c} w={w} />
}

/* ------------------------------------------------------------------ */
/* Watch parts                                                          */
/* ------------------------------------------------------------------ */
// Watch seen from the front. h/m/s: hand angles in clock degrees.
function Face({ cx, cy, r, h = 300, m = 60, s, crown = true, lugs = true, strap, gold, date, ticks = 12, dial = M.dialDark }) {
  const hand = (deg, len, wdt, col) => {
    const [x, y] = clk(cx, cy, len, deg)
    return <line x1={cx} y1={cy} x2={x} y2={y} stroke={col} strokeWidth={wdt} strokeLinecap="round" />
  }
  const caseFill = gold ? 'url(#dg-gold)' : 'url(#sk-steel)'
  return (
    <g>
      {strap && [-1, 1].map((d) => <rect key={d} x={cx - r * 0.5} y={d < 0 ? cy - r - strap : cy + r * 0.7} width={r} height={strap + r * 0.3} rx="3" fill={strap > 0 ? 'url(#sk-top)' : 'none'} />)}
      {lugs && [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => (
        <rect key={i} x={cx + a * r * 0.58 - r * 0.1} y={cy + b * r * 0.92 - (b < 0 ? r * 0.2 : 0)} width={r * 0.2} height={r * 0.28} rx="2.5" fill={gold ? '#b08a3c' : '#8c9aa3'} />
      ))}
      {crown && <rect x={cx + r - 1} y={cy - r * 0.13} width={r * 0.2} height={r * 0.26} rx="2" fill={gold ? '#c9a24c' : 'url(#dg-knurl)'} stroke="#55646e" strokeWidth="0.5" />}
      <circle cx={cx} cy={cy} r={r} fill={caseFill} stroke="#55646e" />
      <circle cx={cx} cy={cy} r={r * 0.86} fill={dial} stroke={C.struct} strokeWidth="0.6" />
      {Array.from({ length: ticks }, (_, i) => {
        const [a, b] = clk(cx, cy, r * 0.82, i * (360 / ticks))
        const [c2, d2] = clk(cx, cy, r * (i % 3 === 0 ? 0.68 : 0.73), i * (360 / ticks))
        return <line key={i} x1={a} y1={b} x2={c2} y2={d2} stroke={dial === M.dialDark ? C.dim : '#3a342c'} strokeWidth={i % 3 === 0 ? 1.8 : 1.1} />
      })}
      {date && <rect x={cx + r * 0.46} y={cy - r * 0.1} width={r * 0.2} height={r * 0.2} fill="#f2ede0" stroke={C.struct} strokeWidth="0.5" />}
      {hand(h, r * 0.48, Math.max(2, r * 0.07), C.brassHi)}
      {hand(m, r * 0.72, Math.max(1.6, r * 0.045), C.brassHi)}
      {s !== undefined && hand(s, r * 0.78, 1, C.ruby)}
      <circle cx={cx} cy={cy} r={Math.max(2, r * 0.05)} fill={C.brassHi} />
    </g>
  )
}

// Generic quartz module in plan (dial-side down, we see the back). Stem at 3 o'clock.
function QMod({ cx, cy, r, cell = true, clamp = true, stem = true, label }) {
  const u = r / 70
  const c = (dx, dy) => [cx + dx * u, cy + dy * u]
  return (
    <g>
      {stem && <rect x={cx + r - 3} y={cy - 2.5 * u} width={26 * u} height={5 * u} rx="1" fill="url(#sk-steel)" />}
      <circle cx={cx} cy={cy} r={r} fill={M.plate} stroke={C.brass} strokeWidth="1.4" />
      <path
        d={`M${c(-64, 22)[0]} ${c(-64, 22)[1]} A${64 * u} ${64 * u} 0 0 1 ${c(46, -44)[0]} ${c(46, -44)[1]} L${c(18, -14)[0]} ${c(18, -14)[1]} L${c(-8, 26)[0]} ${c(-8, 26)[1]} Z`}
        fill={M.board}
        stroke={C.steel}
        strokeWidth="1"
      />
      <g transform={`translate(${c(-26, -40)[0]} ${c(-26, -40)[1]}) rotate(-28)`}>
        <rect x={-24 * u} y={-6.5 * u} width={48 * u} height={13 * u} rx={2 * u} fill={M.copper} stroke="#7d4d24" strokeWidth="0.8" />
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1={(-20 + i * 4) * u} y1={-6.5 * u} x2={(-20 + i * 4) * u} y2={6.5 * u} stroke="#7d4d24" strokeWidth="0.6" />
        ))}
      </g>
      <rect x={c(-30, -8)[0]} y={c(-30, -8)[1]} width={18 * u} height={18 * u} fill="#1e1c1b" stroke={C.dim} strokeWidth="0.7" />
      <rect x={c(-58, -6)[0]} y={c(-58, -6)[1]} width={8 * u} height={22 * u} rx={3 * u} fill="url(#sk-steelH)" />
      <circle cx={c(10, -30)[0]} cy={c(10, -30)[1]} r={7 * u} fill={M.magnet} stroke={C.text} strokeWidth="0.6" />
      {cell && <circle cx={c(26, 26)[0]} cy={c(26, 26)[1]} r={31 * u} fill="url(#dg-cell)" stroke="#4e5f6a" />}
      {cell && (
        <T x={c(26, 26)[0]} y={c(26, 26)[1] + 5} a="middle" s={Math.max(10, 13 * u)} c="#2b343a" w={700}>
          +
        </T>
      )}
      {cell && clamp && <path d={`M${c(52, 2)[0]} ${c(52, 2)[1]} L${c(34, 18)[0]} ${c(34, 18)[1]}`} stroke={C.brassHi} strokeWidth={4 * u} strokeLinecap="round" />}
      {[[-40, 44], [58, -22], [-8, -60]].map(([dx, dy], i) => <Screw key={i} x={c(dx, dy)[0]} y={c(dx, dy)[1]} r={4.2 * u} ang={i * 40} />)}
      {label && (
        <T x={cx} y={cy + r + 16} a="middle" s={10.5} c={C.dim}>
          {label}
        </T>
      )}
    </g>
  )
}

// A gear wheel in plan: teeth as a dashed rim, spokes, pivot
function Wheel({ cx, cy, r, c = M.brassP, spokes = 4, teeth = true, rot = 0 }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth={teeth ? Math.max(2, r * 0.12) : 1.4} strokeDasharray={teeth ? `${Math.max(1.2, r * 0.09)} ${Math.max(1, r * 0.07)}` : undefined} />
      <circle cx={cx} cy={cy} r={r * 0.86} fill="rgba(201,162,76,0.10)" stroke={c} strokeWidth="1" />
      {Array.from({ length: spokes }, (_, i) => {
        const [x, y] = pol(cx, cy, r * 0.84, rot + (i * 360) / spokes)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={c} strokeWidth={Math.max(1, r * 0.08)} />
      })}
      <circle cx={cx} cy={cy} r={Math.max(2, r * 0.14)} fill={M.ruby} stroke={C.ground} strokeWidth="0.6" />
    </g>
  )
}

// Balance wheel with hairspring, plan
function Balance({ cx, cy, r }) {
  const sp = []
  for (let a = 0; a < 360 * 3.2; a += 12) {
    const rr = r * 0.12 + (a / (360 * 3.2)) * r * 0.48
    sp.push(pol(cx, cy, rr, a))
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={M.brassP} strokeWidth={Math.max(2.5, r * 0.13)} />
      {[0, 120, 240].map((a) => {
        const [x, y] = pol(cx, cy, r, a + 30)
        return <line key={a} x1={cx} y1={cy} x2={x} y2={y} stroke={M.brassP} strokeWidth="1.8" />
      })}
      <polyline points={sp.map((p) => p.join(',')).join(' ')} fill="none" stroke={C.steel} strokeWidth="0.9" />
      <circle cx={cx} cy={cy} r={2.6} fill={M.ruby} />
    </g>
  )
}

// Escape wheel (club teeth, schematic) in plan
function EscW({ cx, cy, r, n = 15, c = C.steel }) {
  const pts = []
  for (let i = 0; i < n; i++) {
    const a = (i * 360) / n
    pts.push(pol(cx, cy, r * 0.7, a), pol(cx, cy, r, a + 6), pol(cx, cy, r, a + 12), pol(cx, cy, r * 0.7, a + 18))
  }
  return (
    <g>
      <polygon points={pts.map((p) => p.join(',')).join(' ')} fill="rgba(134,167,189,0.12)" stroke={c} strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r * 0.25} fill="none" stroke={c} strokeWidth="1" />
      <circle cx={cx} cy={cy} r={2.2} fill={M.ruby} />
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
function Screwdriver({ len = 80, blade = 7 }) {
  return (
    <g>
      <path d={`M${-blade / 2} 0 L${blade / 2} 0 L2 -12 L-2 -12 Z`} fill="url(#sk-steel)" />
      <rect x="-2" y="-30" width="4" height="18" fill="url(#sk-steelH)" />
      <rect x="-6" y={-len} width="12" height={Math.max(0, len - 30)} rx="2" fill="url(#dg-knurl)" stroke="#55646e" strokeWidth="0.6" />
    </g>
  )
}
function Oiler({ len = 70, drop = 3 }) {
  return (
    <g>
      <line x1="0" y1="0" x2="0" y2="-26" stroke={C.steel} strokeWidth="1.3" />
      <rect x="-2.6" y={-len} width="5.2" height={Math.max(0, len - 26)} rx="2" fill="#7c8d97" />
      {drop > 0 && <circle cx="0" cy="1" r={drop} fill={M.oil} />}
    </g>
  )
}
// Spring-bar tool, fork end at (0,0)
function SBTool({ len = 120 }) {
  return (
    <g>
      <path d="M-4 0 L-4 -10 L-1.2 -10 L-1.2 -3 L1.2 -3 L1.2 -10 L4 -10 L4 0 L3 -1.5 L3 1 Z" fill="url(#sk-steel)" stroke={M.steelD} strokeWidth="0.5" />
      <path d="M-4 -10 L-3 -34 L3 -34 L4 -10 Z" fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.5" />
      <rect x="-5.5" y={-len} width="11" height={Math.max(0, len - 34)} rx="3" fill="url(#dg-knurl)" stroke={M.steelD} strokeWidth="0.6" />
    </g>
  )
}
// Hand lever, blade tip at (0,0)
function HandLever({ len = 90 }) {
  return (
    <g>
      <path d="M0 0 L5 -2 L7 -26 L-1 -26 Z" fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.5" />
      <rect x="-1.5" y={-len} width="9" height={Math.max(0, len - 26)} rx="2" fill="url(#sk-ebony)" />
    </g>
  )
}
// Hollow hand-setting pusher, face at (0,0)
function Pusher({ d = 8, len = 80 }) {
  return (
    <g>
      <path d={`M${-d / 2} 0 L${-d / 2} -22 L${d / 2} -22 L${d / 2} 0`} fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.5" />
      <rect x="-6" y={-len} width="12" height={Math.max(0, len - 22)} rx="2" fill="url(#dg-knurl)" stroke={M.steelD} strokeWidth="0.6" />
    </g>
  )
}

const SEC = 20
const MS = 5
const TICK = C.brassHi
const TOCK = C.steel
const LCD = '#0f1916'
const GRID = 'rgba(134,167,189,0.12)'
const GRID2 = 'rgba(134,167,189,0.3)'

const msPerSec = (rate) => rate / 86.4 // s/d to ms of drift per second
const line = (rate, off = 0) => (t) => off + msPerSec(rate) * (t - SEC / 2)
const wrapMs = (v, ms = MS) => ((((v + ms) % (2 * ms)) + 2 * ms) % (2 * ms)) - ms

// Deterministic noise, so a figure renders the same every time.
function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 4294967296
  }
}

// Sample a trace function; `wrapIt` folds it back into the window like a machine.
function sample(fn, { n = 96, jitter = 0, seed = 7, wrapIt = false } = {}) {
  const r = rng(seed)
  const pts = []
  for (let i = 0; i < n; i++) {
    const t = ((i + 0.5) / n) * SEC
    let v = fn(t, i) + (r() - 0.5) * 2 * jitter
    if (wrapIt) v = wrapMs(v)
    pts.push([t, v])
  }
  return pts
}

function Screen({ x, y, w, h, grid = true, children }) {
  const vs = [5, 10, 15].map((t) => x + (t / SEC) * w)
  const hs = [-2.5, 2.5].map((v) => y + h / 2 - (v / MS) * (h / 2))
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill={LCD} stroke="#3c4c46" strokeWidth="1.2" />
      {grid && (
        <g>
          {vs.map((v) => (
            <line key={v} x1={v} y1={y + 2} x2={v} y2={y + h - 2} stroke={GRID} />
          ))}
          {hs.map((v) => (
            <line key={v} x1={x + 2} y1={v} x2={x + w - 2} y2={v} stroke={GRID} />
          ))}
          <line x1={x + 2} y1={y + h / 2} x2={x + w - 2} y2={y + h / 2} stroke={GRID2} strokeDasharray="1 3" />
        </g>
      )}
      {children}
    </g>
  )
}

// Dots drawn as one path of near-zero strokes with round caps.
function Dots({ x, y, w, h, pts, c = TICK, r = 1.3, o }) {
  let d = ''
  for (const [t, v] of pts) {
    if (Math.abs(v) > MS) continue
    const px = x + (t / SEC) * w
    const py = y + h / 2 - (v / MS) * (h / 2)
    d += `M${px.toFixed(1)} ${py.toFixed(1)}l.01 0`
  }
  return <path d={d} fill="none" stroke={c} strokeWidth={r * 2} strokeLinecap="round" opacity={o} />
}

// A trace on its own screen. series = [{ pts, c, r }]
function Trace({ x, y, w, h, series, grid = true, r }) {
  return (
    <Screen x={x} y={y} w={w} h={h} grid={grid}>
      {series.map((s, i) => (
        <Dots key={i} x={x} y={y} w={w} h={h} pts={s.pts} c={s.c} r={s.r || r} o={s.o} />
      ))}
    </Screen>
  )
}

const yOf = (y, h, v) => y + h / 2 - (v / MS) * (h / 2)
const xOf = (x, w, t) => x + (t / SEC) * w


const fx = (p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`
function spiralD(cx, cy, r0, r1, turns, a0 = 0, n = 220) {
  let d = ''
  for (let i = 0; i <= n; i++) {
    const u = i / n
    const p = pol(cx, cy, r0 + (r1 - r0) * u, a0 + u * turns * 360)
    d += `${i ? 'L' : 'M'}${fx(p)}`
  }
  return d
}

function Spring({ cx, cy, r0, r1, turns = 6, a0 = 0, c = C.steel, w = 0.9 }) {
  return <path d={spiralD(cx, cy, r0, r1, turns, a0)} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" />
}

// Escape wheel with slanted club teeth, plan view.
function EscWheelT({ cx, cy, r, n = 15, rot = 0, fill = 'url(#sk-steel)' }) {
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
      <path d={d} fill={fill} stroke="#5f717d" strokeWidth="0.7" />
      <circle cx={cx} cy={cy} r={r * 0.52} fill={C.ground} stroke="#5f717d" strokeWidth="0.7" />
      {[0, 1, 2, 3].map((i) => {
        const p = pol(cx, cy, r * 0.56, rot + 45 + i * 90)
        return <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke="#8fa2ae" strokeWidth={Math.max(1.6, r * 0.09)} />
      })}
      <circle cx={cx} cy={cy} r={r * 0.13} fill="url(#sk-steel)" stroke="#5f717d" strokeWidth="0.6" />
    </g>
  )
}

// Plain toothed wheel for the going train.
function Gear({ cx, cy, r, n = 28, fill = 'url(#sk-brassG)', stroke = '#7d5f22', rot = 0, saw = false }) {
  const rb = r * 0.91
  const pitch = 360 / n
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = rot + i * pitch
    d += saw
      ? `${i ? 'L' : 'M'}${fx(pol(cx, cy, rb, a))}L${fx(pol(cx, cy, r, a))}L${fx(pol(cx, cy, rb, a + pitch))}`
      : `${i ? 'L' : 'M'}${fx(pol(cx, cy, rb, a))}L${fx(pol(cx, cy, r, a + pitch * 0.2))}L${fx(pol(cx, cy, r, a + pitch * 0.5))}L${fx(pol(cx, cy, rb, a + pitch * 0.7))}`
  }
  return (
    <g>
      <path d={`${d}Z`} fill={fill} stroke={stroke} strokeWidth="0.6" />
      <circle cx={cx} cy={cy} r={r * 0.62} fill={C.ground} stroke={stroke} strokeWidth="0.6" />
      {[0, 1, 2, 3].map((i) => {
        const p = pol(cx, cy, r * 0.66, rot + i * 90)
        return <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke="#b08a3c" strokeWidth={Math.max(1.5, r * 0.08)} />
      })}
      <circle cx={cx} cy={cy} r={Math.max(2, r * 0.13)} fill="url(#sk-steel)" stroke="#5f717d" strokeWidth="0.6" />
    </g>
  )
}

// Pallet fork. Pivot at (x, y); the fork end points up and the stones down
// before `rot` is applied. k scales it.
function Fork({ x, y, k = 1, rot = 0 }) {
  const body =
    'M-3 -3 L-3.4 -44 L-8 -56 L-9.5 -64 L-4.2 -62 L-3 -52 L3 -52 L4.2 -62 L9.5 -64 L8 -56 L3.4 -44 L3 -3 L30 8 L34 18 L27 21 L5 10 L-5 10 L-27 21 L-34 18 L-30 8 Z'
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`}>
      <path d={body} fill="url(#sk-steel)" stroke="#5f717d" strokeWidth={0.8 / k} strokeLinejoin="round" />
      <rect x="-34" y="15" width="9" height="19" rx="1" transform="rotate(14 -30 20)" fill={C.ruby} stroke="#8a3943" strokeWidth={0.6 / k} />
      <rect x="25" y="15" width="9" height="19" rx="1" transform="rotate(-14 30 20)" fill={C.ruby} stroke="#8a3943" strokeWidth={0.6 / k} />
      <circle cx="0" cy="0" r="3.4" fill={C.ground} stroke="#5f717d" strokeWidth={0.9 / k} />
    </g>
  )
}

// Roller with its impulse pin at `pin` degrees.
function Roller({ cx, cy, r, pin = 90 }) {
  const p = pol(cx, cy, r * 0.82, pin)
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="url(#sk-steel)" stroke="#5f717d" strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r={r * 0.3} fill={C.ground} stroke="#5f717d" strokeWidth="0.7" />
      <circle cx={p[0]} cy={p[1]} r={Math.max(2.4, r * 0.17)} fill={C.ruby} stroke="#8a3943" strokeWidth="0.7" />
    </g>
  )
}


/* ------------------------------------------------------------------ */
/* Extra helpers for this file                                          */
/* ------------------------------------------------------------------ */
// Pegwood stick, point at (0,0)
function Peg({ len = 80 }) {
  return <path d={`M0 0 L-3 -14 L-4.5 ${-len} L4.5 ${-len} L3 -14 Z`} fill="url(#sk-wood)" stroke="#5e4027" strokeWidth="0.6" />
}
// Rubber air blower, nozzle tip at (0,0)
function Blower({ k = 1 }) {
  return (
    <g transform={`scale(${k})`}>
      <path d="M-1.6 0 L-3 -22 L3 -22 L1.6 0 Z" fill="#c9c2b2" stroke="#6e675b" strokeWidth="0.6" />
      <ellipse cx="0" cy="-48" rx="18" ry="27" fill="#3b3631" stroke="#6e675b" />
      <ellipse cx="-6" cy="-56" rx="5" ry="9" fill="rgba(255,255,255,0.08)" />
    </g>
  )
}
// Puff of air leaving a nozzle at (x,y) toward angle (screen degrees)
function Puff({ x, y, ang, n = 3, len = 26 }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const d = (i - (n - 1) / 2) * 9
        const a = pol(x, y, 4, ang + d)
        const b = pol(x, y, len, ang + d)
        return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.steel} strokeWidth="1.2" strokeDasharray="3 3" strokeLinecap="round" />
      })}
    </g>
  )
}
// Compass, needle angle in screen degrees (north end)
function Compass({ cx, cy, r = 26, ang = -90, ghost }) {
  const n = pol(cx, cy, r * 0.8, ang)
  const s = pol(cx, cy, r * 0.8, ang + 180)
  const l = pol(cx, cy, r * 0.13, ang + 90)
  const rr = pol(cx, cy, r * 0.13, ang - 90)
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#221e1a" stroke={C.dim} strokeWidth="1.4" />
      {[0, 90, 180, 270].map((a) => {
        const p0 = pol(cx, cy, r * 0.86, a)
        const p1 = pol(cx, cy, r * 0.98, a)
        return <line key={a} x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke={C.faint} />
      })}
      {ghost !== undefined && (() => {
        const g = pol(cx, cy, r * 0.8, ghost)
        return <line x1={cx} y1={cy} x2={g[0]} y2={g[1]} stroke={C.faint} strokeWidth="1.5" strokeDasharray="2 2" />
      })()}
      <path d={`M${fx(n)} L${fx(l)} L${fx(s)} L${fx(rr)} Z`} fill={C.text} />
      <path d={`M${fx(n)} L${fx(l)} L${cx} ${cy} L${fx(rr)} Z`} fill={M.magnet} />
      <circle cx={cx} cy={cy} r="2" fill={C.ground} />
    </g>
  )
}
// Small LCD readout
function Readout({ x, y, w = 72, label, value, unit, c = C.text }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={34} rx="3" fill={LCD} stroke="#3c4c46" />
      <T x={x + 6} y={y + 12} s={10} c={C.faint}>{label}</T>
      <T x={x + 6} y={y + 28} s={13} c={c} mono w="600">{value}</T>
      {unit && <T x={x + w - 5} y={y + 28} s={10} c={C.faint} a="end">{unit}</T>}
    </g>
  )
}
// Numbered stage box in a row
function Stage({ x, y, w, h = 44, n, head, sub, c = C.brass }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill="rgba(255,255,255,0.03)" stroke={c} strokeOpacity="0.6" />
      {n !== undefined && <Num x={x + 14} y={y + h / 2} n={n} r={8} c={c} />}
      <T x={x + (n !== undefined ? 28 : 10)} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} s={11} c={C.text} w={600}>{head}</T>
      {sub && <T x={x + (n !== undefined ? 28 : 10)} y={y + h / 2 + 11} s={10} c={C.dim}>{sub}</T>}
    </g>
  )
}
// Outcome row: verdict mark (or coloured bar), bold lead and plain consequence
function Row({ x, y, w, h = 30, ok, c, head, text, sub }) {
  const col = c || (ok === true ? C.emerald : ok === false ? C.ruby : C.line)
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="5" fill="rgba(255,255,255,0.025)" stroke={col} strokeOpacity="0.7" />
      {ok !== undefined ? <Verdict x={x + 15} y={y + h / 2} ok={ok} r={7} /> : <rect x={x + 6} y={y + 6} width={4} height={h - 12} rx="2" fill={col} />}
      <T x={x + 29} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} s={11} c={C.text} w={600}>{head}</T>
      {text && <T x={x + w - 8} y={y + h / 2 + 4} s={10.5} c={C.dim} a="end">{text}</T>}
      {sub && <T x={x + 29} y={y + h / 2 + 11} s={10} c={C.dim}>{sub}</T>}
    </g>
  )
}
// Vertical gap marker with its own label
function VGap({ x, y1, y2, n, c = C.brassHi }) {
  return (
    <g>
      <line x1={x - 4} y1={y1} x2={x + 4} y2={y1} stroke={c} strokeWidth="1" />
      <line x1={x - 4} y1={y2} x2={x + 4} y2={y2} stroke={c} strokeWidth="1" />
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={c} strokeWidth="1" />
      {n !== undefined && <Num x={x + 14} y={(y1 + y2) / 2} n={n} r={7} />}
    </g>
  )
}
// Caution strip along the bottom
function Caution({ x = 12, y, w = 456, h = 34, l1, l2 }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill="rgba(194,88,99,0.09)" stroke={C.ruby} strokeOpacity="0.8" />
      <path d={`M${x + 16} ${y + 9} L${x + 25} ${y + 25} L${x + 7} ${y + 25} Z`} fill="none" stroke={C.ruby} strokeWidth="1.4" strokeLinejoin="round" />
      <T x={x + 16} y={y + 23} a="middle" s={10} c={C.ruby} w={700}>!</T>
      <T x={x + 34} y={l2 ? y + 15 : y + h / 2 + 4} s={10.5} c={C.text}>{l1}</T>
      {l2 && <T x={x + 34} y={y + 28} s={10.5} c={C.dim}>{l2}</T>}
    </g>
  )
}
// Tip strip along the bottom
function TipBar({ x = 12, y, w = 456, h = 34, l1, l2 }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill="rgba(208,168,79,0.07)" stroke={C.brass} strokeOpacity="0.6" />
      <T x={x + 10} y={l2 ? y + 15 : y + h / 2 + 4} s={10.5} c={C.brassHi} w={600}>Tip</T>
      <T x={x + 36} y={l2 ? y + 15 : y + h / 2 + 4} s={10.5} c={C.text}>{l1}</T>
      {l2 && <T x={x + 36} y={y + 28} s={10.5} c={C.dim}>{l2}</T>}
    </g>
  )
}
// Source note in faint text: where a claim comes from
const Src = ({ x, y, children, a = 'start' }) => (
  <T x={x} y={y} s={10} c={C.faint} a={a} it>
    {children}
  </T>
)
// Pallet click on a ratchet: simple pawl, tip at (0,0) pointing down
function Click({ x, y, ang = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      <path d="M0 0 L-5 -6 L-22 -14 L-26 -9 L-8 -1 Z" fill="url(#sk-steel)" stroke="#4e5f6a" strokeWidth="0.7" />
      <circle cx="-23" cy="-11" r="2.4" fill={C.ground} stroke="#4e5f6a" strokeWidth="0.7" />
    </g>
  )
}

/* ================================================================== */
/* diag-stopped · a watch that won't run                                */
/* ================================================================== */

// Cell seat in section: plate, cell, clamp (+) above, tongue (−) below
function CellSeat({ x, y, dirty }) {
  return (
    <g>
      <rect x={x} y={y + 40} width={150} height={16} fill="url(#dg-mov)" stroke={C.struct} strokeWidth="0.6" />
      <rect x={x + 30} y={y + 14} width={90} height={22} rx="4" fill="url(#dg-cell)" stroke="#4e5f6a" />
      <T x={x + 75} y={y + 29} a="middle" s={10} c="#2b343a" w={700}>cell</T>
      {/* + clamp over the top and down the side */}
      <path d={`M${x + 70} ${y + 12} L${x + 124} ${y + 12} L${x + 124} ${y + 40}`} fill="none" stroke={C.brassHi} strokeWidth="3" strokeLinejoin="round" />
      {/* − tongue under the cell */}
      <path d={`M${x + 20} ${y + 40} L${x + 48} ${y + 40} L${x + 62} ${y + 36}`} fill="none" stroke={C.steel} strokeWidth="2.6" strokeLinecap="round" />
      {dirty && (
        <g>
          <ellipse cx={x + 60} cy={y + 37} rx="7" ry="3.4" fill="#6fa85e" stroke="#3f6e35" strokeWidth="0.6" />
          <ellipse cx={x + 118} cy={y + 15} rx="6" ry="3" fill="#6fa85e" stroke="#3f6e35" strokeWidth="0.6" />
        </g>
      )}
    </g>
  )
}

function DgQuartzCell() {
  return (
    <F h={306} view="Section and flow · cell and contacts" scale="schematic">
      <Pn x={12} y={26} w={186} h={168} t="Module back" />
      <QMod cx={104} cy={116} r={60} />
      <Lab p={[126, 140]} x={140} y={182} text="the cell" />
      <Lab p={[141, 125]} x={176} y={52} text="clamp" up />

      <Pn x={208} y={26} w={260} h={80} t="Crusted contacts" tc={C.ruby} ok={false} />
      <CellSeat x={218} y={34} dirty />
      <T x={378} y={60} s={10.5} c={C.text}>dull or green</T>
      <T x={378} y={74} s={10.5} c={C.text}>contacts:</T>
      <T x={378} y={88} s={10.5} c={C.dim}>poor contact</T>

      <Pn x={208} y={114} w={260} h={80} t="Clean, fresh cell" tc={C.emerald} ok />
      <CellSeat x={218} y={122} />
      <T x={378} y={148} s={10.5} c={C.text}>bright contacts,</T>
      <T x={378} y={162} s={10.5} c={C.text}>clamp (+) on top,</T>
      <T x={378} y={176} s={10.5} c={C.text}>tongue (−) below</T>

      {/* flow */}
      <Bx x={12} y={212} w={150} h={44} l={['Fit a fresh cell', 'clean the contacts']} c={C.brass} />
      <Arrow a={[162, 234]} b={[180, 234]} c="brass" w={1.4} />
      <Bx x={182} y={212} w={70} h={44} l={['Runs?']} c={C.brass} />
      <Arrow a={[252, 224]} b={[278, 224]} c="emerald" w={1.4} />
      <Arrow d="M252 246 Q266 272 278 272" c="ruby" w={1.4} />
      <Bx x={280} y={204} w={188} h={36} l={['Fixed: most stopped quartz', 'watches end here']} c={C.emerald} s={10.5} lh={13} />
      <Bx x={280} y={252} w={188} h={42} l={['A good cell still won’t run', 'suspect the module']} c={C.ruby} s={10.5} lh={14} />
      <T x={262} y={216} s={10} c={C.emerald}>yes</T>
      <T x={250} y={284} s={10} c={C.ruby}>no</T>
      <T x={14} y={276} s={10.5} c={C.dim}>Start here before you</T>
      <T x={14} y={290} s={10.5} c={C.dim}>suspect anything else.</T>
    </F>
  )
}

function DgQuartzCased() {
  const cx = 150
  return (
    <F h={336} view="Section · the four gaps in a cased watch" scale="heights exaggerated">
      {/* case and crystal */}
      <path d="M20 112 L20 236 L280 236 L280 112" fill="none" stroke="#6f808b" strokeWidth="6" />
      <path d="M26 104 Q150 84 274 104 L274 112 Q150 94 26 112 Z" fill="url(#dg-acr)" stroke={M.glass} strokeWidth="1" />
      <T x={150} y={82} a="middle" s={10.5} c={C.dim}>crystal</T>
      {/* dial */}
      <rect x={26} y={206} width={248} height={8} fill={M.dialDark} stroke={C.struct} strokeWidth="0.6" />
      <rect x={26} y={214} width={248} height={20} fill="url(#dg-mov)" />
      <T x={40} y={228} s={10} c={C.faint}>movement</T>
      {/* pipes */}
      <rect x={cx - 11} y={186} width={22} height={20} fill={M.brassP} stroke={M.brassD} strokeWidth="0.6" />
      <rect x={cx - 6} y={164} width={12} height={22} fill="#a7b6bf" stroke={M.steelD} strokeWidth="0.6" />
      <rect x={cx - 2} y={138} width={4} height={26} fill="#c5ced4" stroke={M.steelD} strokeWidth="0.5" />
      {/* hour hand right, minute hand left, seconds both ways */}
      <rect x={cx + 11} y={186} width={86} height={3} fill={C.brassHi} />
      <rect x={cx - 128} y={164} width={122} height={2.6} fill={C.brassHi} />
      <rect x={cx - 52} y={138} width={174} height={1.8} fill={C.ruby} />
      <rect x={cx - 52} y={135} width={22} height={7} rx="2" fill={C.ruby} />
      {/* gaps */}
      <VGap x={226} y1={189} y2={206} n={1} />
      <VGap x={70} y1={166.6} y2={186} n={2} />
      <VGap x={262} y1={109} y2={138} n={3} />
      <VGap x={-30 + cx - 12} y1={142} y2={164} n={4} />
      <Lab p={[240, 187]} x={250} y={176} text="hour" a="start" up />
      <Lab p={[34, 165]} x={34} y={156} text="minute" a="start" up />
      <T x={178} y={132} s={10.5} c={C.text}>seconds hand</T>
      <T x={96} y={128} a="end" s={10} c={C.dim}>counterweight</T>
      <line x1={96} y1={131} x2={104} y2={136} stroke={C.struct} strokeWidth="0.8" />

      {/* checklist */}
      <Tag x={14} y={258}>Check each gap in turn</Tag>
      {[
        ['dial to hour hand', 1],
        ['hour hand to minute hand', 2],
        ['seconds hand to crystal', 3],
        ['counterweight to minute hand', 4],
      ].map(([t, n], i) => (
        <g key={t}>
          <Num x={22 + (i % 2) * 134} y={276 + Math.floor(i / 2) * 22} n={n} r={7} />
          <T x={34 + (i % 2) * 134} y={280 + Math.floor(i / 2) * 22} s={10.5} c={C.text}>{t}</T>
        </g>
      ))}

      <Pn x={312} y={26} w={156} h={122} t="Often the cause" tc={C.ruby} />
      <T x={322} y={58} s={10.5} c={C.text}>Runs out of the case,</T>
      <T x={322} y={72} s={10.5} c={C.text}>stops once cased:</T>
      <T x={322} y={92} s={10.5} c={C.ruby}>3 seconds hand</T>
      <T x={334} y={106} s={10.5} c={C.ruby}>on the crystal</T>
      <T x={322} y={124} s={10.5} c={C.ruby}>4 counterweight</T>
      <T x={334} y={138} s={10.5} c={C.ruby}>on the minute hand</T>
      <Src x={322} y={162}>both in Witschi’s guide</Src>

      <Pn x={312} y={172} w={156} h={142} t="Fix and prove" tc={C.emerald} />
      <Note x={322} y={204} lines={['Movement out, reseat', 'the hand that’s out,', 'case it, then watch', 'one full turn.']} c={C.text} s={10.5} lh={14} />
      <Face cx={420} cy={284} r={20} lugs={false} crown={false} s={60} />
      <Turn cx={420} cy={284} r={26} from={20} to={340} c="emerald" w={1.4} />
    </F>
  )
}

// One link in the power chain, as a labelled chip
function Chain({ x, y, hi, items, w = 72, gap = 4 }) {
  return (
    <g>
      {items.map((t, i) => {
        const on = hi && hi.includes(i)
        const xx = x + i * (w + gap)
        return (
          <g key={t}>
            <rect x={xx} y={y} width={w} height={26} rx="5" fill={on ? 'rgba(194,88,99,0.18)' : 'rgba(255,255,255,0.03)'} stroke={on ? C.ruby : C.line} />
            <T x={xx + w / 2} y={y + 17} a="middle" s={10.5} c={on ? C.text : C.faint}>{t}</T>
            {i < items.length - 1 && <line x1={xx + w} y1={y + 13} x2={xx + w + gap} y2={y + 13} stroke={C.struct} />}
          </g>
        )
      })}
    </g>
  )
}

function DgMechPower() {
  const chain = ['crown', 'keyless', 'mainspring', 'train', 'escapement', 'balance']
  return (
    <F h={290} view="Decision · is there power?" scale="schematic">
      {/* crown being wound */}
      <rect x={30} y={44} width={34} height={44} rx="5" fill="url(#dg-knurl)" stroke="#55646e" />
      <rect x={64} y={60} width={40} height={12} fill="url(#sk-steel)" />
      <Arrow d="M24 40 Q47 22 70 40" c="brass" w={1.8} />
      <Bx x={124} y={42} w={118} h={48} l={['Wind it', 'a few turns, slowly']} c={C.brass} />
      <Arrow d="M242 58 Q262 58 276 48" c="ruby" w={1.4} />
      <Arrow d="M242 76 Q262 76 276 92" c="brass" w={1.4} />
      <Bx x={278} y={28} w={190} h={32} l={['Won’t wind at all']} c={C.ruby} />
      <Bx x={278} y={78} w={190} h={32} l={['Winds, but won’t run']} c={C.brass} />

      <Tag x={14} y={140} c={C.ruby}>Won’t wind: look on the power side</Tag>
      <Chain x={14} y={150} items={chain} hi={[1, 2]} />
      <T x={14} y={196} s={10.5} c={C.text}>The fault is in the mainspring or the keyless works.</T>

      <Sep x1={12} y1={210} x2={468} y2={210} />
      <Tag x={14} y={230} c={C.brassHi}>Winds but won’t run: look downstream</Tag>
      <Chain x={14} y={240} items={chain} hi={[3, 4, 5]} />
      <T x={14} y={284} s={10.5} c={C.text}>The train or the balance is stuck. Work outward from the power.</T>
    </F>
  )
}

function DgOneSystem() {
  const sys = ['power', 'train', 'escapement', 'keyless', 'motion works']
  const rx = 110
  const ry = 196
  return (
    <F h={334} view="Plan · test the power first" scale="schematic">
      <Tag x={14} y={40}>Five systems, one test each</Tag>
      {sys.map((t, i) => (
        <g key={t}>
          <rect x={14 + i * 91} y={48} width={88} height={26} rx="5" fill={i === 0 ? 'rgba(208,168,79,0.18)' : 'rgba(255,255,255,0.03)'} stroke={i === 0 ? C.brass : C.line} />
          <Num x={26 + i * 91} y={61} n={i + 1} r={7} c={i === 0 ? C.brass : C.faint} />
          <T x={37 + i * 91} y={65} s={10} c={i === 0 ? C.text : C.dim}>{t}</T>
        </g>
      ))}
      <T x={14} y={94} s={10.5} c={C.dim}>Each test clears one system. Start with the power.</T>

      {/* barrel side: ratchet, crown wheel, click, stem */}
      <circle cx={rx} cy={ry} r={88} fill="none" stroke={C.faint} strokeDasharray="5 4" />
      <T x={14} y={322} s={10} c={C.faint}>dashed: the rotor, which comes off first</T>
      <Gear cx={rx} cy={ry} r={54} n={44} saw />
      <Screw x={rx} y={ry} r={9} ang={20} />
      <Gear cx={rx + 56} cy={ry - 51} r={20} n={20} />
      <rect x={rx + 76} y={ry - 54} width={84} height={6} fill="url(#sk-steel)" />
      <rect x={rx + 160} y={ry - 61} width={12} height={20} rx="2" fill="url(#dg-knurl)" />
      <path d="M38 196 L33 187 L63 160 L71 168 Z" fill="url(#sk-steel)" stroke="#4e5f6a" strokeWidth="0.7" />
      <circle cx={38} cy={190} r={2.6} fill={C.ground} stroke="#4e5f6a" strokeWidth="0.7" />
      <path d="M22 140 Q14 168 44 176" fill="none" stroke={C.text} strokeWidth="1.3" />
      <Turn cx={rx} cy={ry} r={66} from={60} to={150} c="brass" w={1.8} />
      <T x={rx + 30} y={ry + 84} s={10.5} c={C.text}>ratchet wheel</T>
      <Lab p={[56, 172]} x={64} y={124} text="click" up />
      <Lab p={[19, 152]} x={22} y={124} text="spring" up />
      <Lab p={[rx + 56, ry - 51]} x={rx + 86} y={ry - 18} text="crown wheel" a="start" />
      <T x={rx + 166} y={ry - 70} a="middle" s={10.5} c={C.dim}>crown</T>

      {/* outcomes */}
      <Tag x={262} y={196}>Turn the crown slowly and watch</Tag>
      <Row x={262} y={204} w={206} h={28} ok head="Steps round, click holds" />
      <Row x={262} y={236} w={206} h={28} ok={false} head="Slides back" text="click, click spring" />
      <Row x={262} y={268} w={206} h={28} ok={false} head="Never moves" text="crown to ratchet" />
      <Row x={262} y={300} w={206} h={28} ok={false} head="Never firms up" text="mainspring" />
    </F>
  )
}

// Loupe circle with a clip path for its contents
function Loupe({ id, x, y, r, children, ok, label, sub }) {
  return (
    <g>
      <clipPath id={id}>
        <circle cx={x} cy={y} r={r} />
      </clipPath>
      <circle cx={x} cy={y} r={r} fill="#1d1916" />
      <g clipPath={`url(#${id})`}>{children}</g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={C.brass} strokeWidth="1.8" />
      {ok !== undefined && <Verdict x={x + r * 0.72} y={y - r * 0.72} ok={ok} r={8} />}
      {label && <T x={x} y={y + r + 18} a="middle" s={10.5} c={C.text}>{label}</T>}
      {sub && <T x={x} y={y + r + 32} a="middle" s={10} c={C.dim}>{sub}</T>}
    </g>
  )
}

function DgObviousJam() {
  const R = 50
  return (
    <F h={276} view="Inspection · under the loupe" scale="magnified, schematic">
      {/* 1 bent hand on the dial (side view) */}
      <Loupe id="dg-j1" x={64} y={100} r={R} label="bent hand" sub="touches dial or crystal">
        <rect x={10} y={124} width={110} height={30} fill={M.dialDark} />
        <rect x={10} y={66} width={110} height={8} fill="url(#dg-acr)" />
        <rect x={40} y={104} width={8} height={20} fill={M.brassP} />
        <path d="M48 106 L84 110 L104 122" fill="none" stroke={C.brassHi} strokeWidth="3" />
        <circle cx={104} cy={123} r={5} fill="none" stroke={C.ruby} strokeWidth="1.4" />
      </Loupe>
      {/* 2 hands fouling each other */}
      <Loupe id="dg-j2" x={180} y={100} r={R} label="hands fouling" sub="common, easy fix">
        <rect x={120} y={128} width={110} height={30} fill={M.dialDark} />
        <rect x={156} y={104} width={10} height={24} fill={M.brassP} />
        <rect x={158} y={92} width={6} height={12} fill="#a7b6bf" />
        <rect x={166} y={112} width={62} height={3} fill={C.brassHi} />
        <path d="M164 94 L196 100 L222 110" fill="none" stroke={C.brassHi} strokeWidth="2.4" />
        <circle cx={214} cy={110} r={5} fill="none" stroke={C.ruby} strokeWidth="1.4" />
      </Loupe>
      {/* 3 loose part */}
      <Loupe id="dg-j3" x={296} y={100} r={R} label="a loose part" sub="a screw adrift">
        <Gear cx={276} cy={92} r={30} n={36} />
        <Gear cx={326} cy={124} r={18} n={18} />
        <g transform="translate(302 98) rotate(28)">
          <rect x={-10} y={-3} width={14} height={6} fill="#c5ced4" stroke="#3e4a52" strokeWidth="0.6" />
          <circle cx={6} cy={0} r={5} fill="#c5ced4" stroke="#3e4a52" strokeWidth="0.6" />
          <line x1={6} y1={-4} x2={6} y2={4} stroke="#2c353b" strokeWidth="1.2" />
        </g>
      </Loupe>
      {/* 4 debris in the train */}
      <Loupe id="dg-j4" x={412} y={100} r={R} label="debris in the train" sub="fibre in the teeth">
        <Gear cx={392} cy={96} r={30} n={36} />
        <Gear cx={438} cy={122} r={16} n={12} />
        <path d="M410 104 q8 -6 14 4 q6 10 16 2 q6 -4 12 6" fill="none" stroke="#e8e0cf" strokeWidth="1.3" />
      </Loupe>
      <Sep x1={12} y1={200} x2={468} y2={200} />
      <Note x={14} y={222} lines={['Look before you take anything apart. A bent hand or a loose part is often the', 'whole fault. Straighten or reseat the hand, lift out the loose part, peg out', 'the debris, then try it again.']} c={C.dim} s={10.5} lh={15} />
    </F>
  )
}

function DgHandsOff() {
  const cx = 104
  return (
    <F h={316} view="Exploded side view · take the load off" scale="schematic">
      {/* exploded layers lifted off the movement */}
      <line x1={cx} y1={34} x2={cx} y2={238} stroke={C.faint} strokeDasharray="6 3 1 3" strokeWidth="0.8" />
      <rect x={cx - 3} y={40} width={6} height={8} fill={C.dim} />
      <rect x={cx - 46} y={44} width={46} height={2.4} fill={C.brassHi} />
      <rect x={cx} y={41} width={60} height={2} fill={C.brassHi} />
      <T x={cx + 70} y={48} s={10.5} c={C.text}>hands</T>
      <rect x={cx - 80} y={78} width={160} height={7} rx="2" fill={M.dial} />
      <T x={cx + 88} y={86} s={10.5} c={C.text}>dial</T>
      <rect x={cx - 74} y={114} width={148} height={4} rx="2" fill={C.steel} />
      <T x={cx + 82} y={120} s={10.5} c={C.text}>date wheel</T>
      <rect x={cx - 84} y={170} width={168} height={46} rx="6" fill="url(#dg-mov)" stroke={C.struct} />
      <T x={cx} y={198} a="middle" s={10.5} c={C.text}>movement, out of its case</T>
      <Arrow a={[cx - 100, 160]} b={[cx - 100, 70]} c="brass" w={1.8} />
      <T x={cx - 96} y={236} s={10.5} c={C.dim}>wind it again, bare</T>

      {/* sequence */}
      {[
        ['Let the power down', 1],
        ['Movement out of the case', 2],
        ['Hands and dial off', 3],
        ['Wind it again', 4],
      ].map(([t, n], i) => (
        <g key={t}>
          <Num x={290} y={42 + i * 26} n={n} r={8} />
          <T x={304} y={46 + i * 26} s={11} c={C.text}>{t}</T>
        </g>
      ))}
      <Bx x={244} y={146} w={80} h={32} l={['Runs now?']} c={C.brass} />
      <Arrow d="M284 178 L284 196" c="emerald" w={1.4} />
      <Arrow d="M324 162 Q396 162 396 196" c="ruby" w={1.4} />
      <T x={290} y={192} s={10} c={C.emerald}>yes</T>
      <T x={402} y={186} s={10} c={C.ruby}>no</T>
      <rect x={196} y={198} width={150} height={104} rx="6" fill="rgba(123,165,131,0.07)" stroke={C.emerald} />
      <Note x={206} y={216} head="The stop was above" hc={C.emerald} lines={['in the hands, the dial', 'or the calendar.', 'Check hand clearance', 'and that the date', 'wheel turns freely.']} c={C.text} s={10.5} lh={14} />
      <rect x={354} y={198} width={114} height={104} rx="6" fill="rgba(194,88,99,0.07)" stroke={C.ruby} />
      <Note x={364} y={216} head="It’s inside" hc={C.ruby} lines={['the movement', 'itself. The next', 'two steps narrow', 'it down.']} c={C.text} s={10.5} lh={14} />
    </F>
  )
}

function DgBalanceNudge() {
  return (
    <F h={316} view="Test · a puff of air at the balance" scale="schematic">
      {/* balance under its cock, with the blower */}
      <Balance cx={130} cy={132} r={64} />
      <path d="M130 132 L60 40 L36 52" fill="none" stroke="#8b8574" strokeWidth="14" strokeLinecap="round" opacity="0.55" />
      <T x={72} y={34} s={10.5} c={C.dim}>balance cock</T>
      <G x={214} y={88} ang={60}>
        <Blower k={1} />
      </G>
      <Puff x={210} y={90} ang={160} />
      <Turn cx={130} cy={132} r={78} from={70} to={130} c="brass" w={1.6} />
      <Turn cx={130} cy={132} r={78} from={250} to={190} c="brass" w={1.6} />
      <T x={242} y={122} s={10.5} c={C.text}>blower</T>
      <T x={130} y={226} a="middle" s={10.5} c={C.dim}>balance and hairspring</T>

      <Pn x={290} y={74} w={178} h={78} t="Swings, keeps going" tc={C.emerald} c={C.emerald} ok />
      <Note x={300} y={108} lines={['The escapement is fine.', 'The fault was elsewhere.']} c={C.text} s={10.5} lh={14} />
      <Pn x={290} y={160} w={178} h={78} t="Won’t stay running" tc={C.ruby} c={C.ruby} ok={false} />
      <Note x={300} y={194} lines={['Suspect dirt, dry oil', 'or damage.']} c={C.text} s={10.5} lh={14} />

      {/* caution: never tweezers */}
      <rect x={12} y={252} width={456} height={52} rx="6" fill="rgba(194,88,99,0.09)" stroke={C.ruby} />
      <G x={64} y={292} ang={-60}>
        <Tweezers len={60} gap={3} w={2.4} />
      </G>
      <circle cx={46} cy={278} r={16} fill="none" stroke={C.ruby} strokeWidth="2" />
      <line x1={35} y1={267} x2={57} y2={289} stroke={C.ruby} strokeWidth="2" />
      <T x={110} y={274} s={11} c={C.ruby} w={600}>Never poke the balance or hairspring with tweezers</T>
      <T x={110} y={290} s={10.5} c={C.text}>to “start” it. Use only a puff of air from a blower.</T>
    </F>
  )
}

function DgReadFork() {
  const fx0 = 112
  const fy0 = 128
  return (
    <F h={340} view="Plan and flow · balance out, read the fork" scale="schematic">
      <circle cx={fx0} cy={fy0 - 70} r={34} fill="none" stroke={C.faint} strokeDasharray="4 4" />
      <T x={fx0 + 40} y={fy0 - 92} s={10} c={C.faint}>balance removed</T>
      <EscWheelT cx={fx0} cy={fy0 + 78} r={40} />
      <Fork x={fx0} y={fy0} k={1.15} rot={-8} />
      {/* banking pins */}
      <circle cx={fx0 - 12} cy={fy0 - 26} r={3.4} fill="#c5ced4" stroke="#3e4a52" />
      <circle cx={fx0 + 12} cy={fy0 - 26} r={3.4} fill="#c5ced4" stroke="#3e4a52" />
      <Lab p={[fx0 + 12, fy0 - 26]} x={fx0 + 60} y={fy0 - 30} text="bankings" a="start" />
      <G x={fx0 - 14} y={fy0 - 64} ang={-70}>
        <Peg len={60} />
      </G>
      <Arrow d={`M${fx0 - 30} ${fy0 - 86} q16 -10 32 -4`} c="brass" w={1.4} both />
      <T x={14} y={fy0 - 52} s={10.5} c={C.text}>pegwood</T>
      <Lab p={[fx0, fy0 + 116]} x={fx0 + 54} y={fy0 + 128} text="escape wheel" a="start" />
      <Lab p={[fx0 + 30, fy0 + 20]} x={fx0 + 62} y={fy0 + 30} text="fork" a="start" />
      <T x={14} y={fy0 + 156} s={10.5} c={C.dim}>Wind a few clicks first,</T>
      <T x={14} y={fy0 + 170} s={10.5} c={C.dim}>with the fork in place.</T>

      {/* flow */}
      <Bx x={232} y={28} w={236} h={40} l={['Nudge the fork: does it snap', 'across and stay, both ways?']} c={C.brass} s={10.5} lh={14} />
      <Arrow d="M290 68 L290 82" c="emerald" w={1.4} />
      <Arrow d="M410 68 L410 82" c="ruby" w={1.4} />
      <Bx x={232} y={84} w={116} h={78} l={['Crisp snap', 'power reaches the', 'escapement: look', 'at the balance']} c={C.emerald} s={10.5} lh={14} />
      <Bx x={352} y={84} w={116} h={78} l={['Lazy, or', 'won’t stay over:', 'power isn’t', 'getting through']} c={C.ruby} s={10.5} lh={14} />
      <Note x={240} y={180} lines={['broken pivot', 'fouled hairspring', 'dirty jewel']} c={C.text} s={10.5} lh={14} />
      <Arrow d="M410 162 L410 176" c="brass" w={1.4} />
      <Bx x={352} y={178} w={116} h={50} l={['Let down, fork out,', 'puff at the', 'escape wheel']} c={C.brass} s={10.5} lh={13} />
      <Arrow d="M380 228 L380 242" c="emerald" w={1.4} />
      <Arrow d="M444 228 L444 242" c="ruby" w={1.4} />
      <Bx x={308} y={244} w={92} h={44} l={['Coasts a few', 'seconds: free']} c={C.emerald} s={10.5} lh={13} />
      <Bx x={404} y={244} w={64} h={44} l={['Stops', 'dead']} c={C.ruby} s={10.5} lh={13} />
      <T x={300} y={300} s={10} c={C.dim} a="end">fault: fork to escape wheel</T>
      <T x={468} y={300} s={10} c={C.dim} a="end">dirt, pivot, debris</T>
      <Caution y={306} h={30} l1="Let the power down before the balance cock or pallet bridge comes off, every time." />
    </F>
  )
}

function DgSameTime() {
  const cx = 74
  const cy = 106
  // amplitude across the date change
  const X = (h) => 196 + (h - 21) * 44
  const Y = (a) => 272 - (a - 220) * 0.65
  const amp = (h) => (h < 23.3 ? 290 : h < 24.1 ? 290 - (h - 23.3) * 75 : 230 + Math.min(1, (h - 24.1) * 2) * 60)
  const pts = []
  for (let h = 21; h <= 25.6; h += 0.05) pts.push([X(h), Y(amp(h))])
  return (
    <F h={344} view="Decision · it stops at the same hour" scale="schematic">
      <Face cx={cx} cy={cy} r={50} h={355} m={300} date lugs={false} />
      <circle cx={cx} cy={cy} r={60} fill="none" stroke={C.ruby} strokeDasharray="3 3" />
      <T x={cx} y={186} a="middle" s={10.5} c={C.text}>stops near the date change</T>
      <T x={cx} y={200} a="middle" s={10} c={C.faint}>about the same hour daily</T>

      <Row x={160} y={30} w={308} h={40} c={C.ruby} head="Stops near the date change" sub="calendar load or date-wheel friction on the dial" />
      <Row x={160} y={76} w={308} h={40} c={C.brass} head="Loses time at the change instead" sub="the cannon pinion slipping under that load" />
      <Row x={160} y={122} w={308} h={40} c={C.steel} head="Neither fits" sub="a weak mainspring or a heavy train" />
      <Src x={160} y={180}>A forum lead, not a maker’s guide: treat it as a lead.</Src>

      {/* test chart */}
      <Tag x={160} y={204}>Test: hands a little before the change</Tag>
      <line x1={X(21)} y1={Y(220)} x2={X(25.6)} y2={Y(220)} stroke={C.struct} />
      <line x1={X(21)} y1={Y(220)} x2={X(21)} y2={Y(300)} stroke={C.struct} />
      <rect x={X(23.3)} y={Y(300)} width={X(24.4) - X(23.3)} height={Y(220) - Y(300)} fill="rgba(194,88,99,0.10)" />
      <polyline points={pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')} fill="none" stroke={C.brassHi} strokeWidth="2" />
      <T x={X(21) - 4} y={Y(290) + 4} a="end" s={10} c={C.faint}>amp</T>
      <T x={X(23.85)} y={Y(220) + 14} a="middle" s={10} c={C.ruby}>date work takes up</T>
      <T x={X(24.45) + 6} y={Y(262)} s={10.5} c={C.ruby}>sharp sag</T>
      <T x={X(24.45) + 6} y={Y(262) + 13} s={10} c={C.dim}>confirms the load</T>
      <T x={X(21.2)} y={Y(290) - 6} s={10} c={C.dim}>steady</T>
      <TipBar y={300} l1="Don’t take rate readings with the hands near midnight." l2="Witschi warns the date change can falsify them." />
    </F>
  )
}

/* ================================================================== */
/* diag-timekeeping · runs but keeps bad time                           */
/* ================================================================== */

function DgRealFault() {
  const X = (r) => 150 + (r + 30) * 3.6 // −30 … +50 s/day
  const rows = [
    ['Witschi service table', 'gent’s watch', -5, 15, false],
    ['Seiko 7S26', 'maker’s rating', -20, 40, true],
  ]
  return (
    <F h={322} view="Chart · judge the rate against its own figures" scale="s/day to scale">
      <line x1={X(-30)} y1={132} x2={X(50)} y2={132} stroke={C.struct} />
      {[-30, -20, -10, 0, 10, 20, 30, 40, 50].map((r) => (
        <g key={r}>
          <line x1={X(r)} y1={128} x2={X(r)} y2={136} stroke={C.faint} />
          <T x={X(r)} y={150} a="middle" s={10} c={r === 0 ? C.text : C.faint} mono>{r > 0 ? `+${r}` : r}</T>
        </g>
      ))}
      <T x={X(50)} y={164} a="end" s={10} c={C.faint}>s/day</T>
      {rows.map(([a, b, lo, hi, ok], i) => {
        const y = 40 + i * 42
        return (
          <g key={a}>
            <T x={14} y={y + 12} s={11} c={C.text} w={600}>{a}</T>
            <T x={14} y={y + 26} s={10} c={C.dim}>{b}</T>
            <rect x={X(lo)} y={y + 2} width={X(hi) - X(lo)} height={26} rx="3" fill="rgba(123,165,131,0.25)" stroke={C.emerald} />
            <T x={X(lo) + 5} y={y + 19} s={10.5} c={C.text} mono>{lo}</T>
            <T x={X(hi) - 5} y={y + 19} a="end" s={10.5} c={C.text} mono>+{hi}</T>
            <Verdict x={X(18) + 16} y={y + 15} ok={ok} r={7} />
          </g>
        )
      })}
      <line x1={X(18)} y1={34} x2={X(18)} y2={136} stroke={C.brassHi} strokeWidth="2" />
      <T x={X(18)} y={30} a="middle" s={10.5} c={C.brassHi} w={600}>+18</T>
      <T x={14} y={186} s={10.5} c={C.text}>+18 s/day is healthy on a 7S26 and a fail on a chronometer.</T>

      <Tag x={14} y={212}>Then confirm it</Tag>
      <Stage x={12} y={220} w={146} n={1} head="Owner’s notes" sub="over a few days" />
      <Arrow a={[158, 242]} b={[168, 242]} c="brass" w={1.3} />
      <Stage x={170} y={220} w={146} n={2} head="Timegrapher" sub="crown pushed in" />
      <Arrow a={[316, 242]} b={[326, 242]} c="brass" w={1.3} />
      <Stage x={328} y={220} w={140} n={3} head="Hands away" sub="from the date change" />
      <rect x={12} y={276} width={456} height={34} rx="6" fill="rgba(123,165,131,0.08)" stroke={C.emerald} />
      <T x={22} y={297} s={10.5} c={C.text}>Inside the movement’s own figures? There’s nothing to fix.</T>
    </F>
  )
}

// Hairspring in plan; stuck = coils bunched on one side
function HSpring({ cx, cy, r = 40, stuck }) {
  let d = ''
  const turns = 7
  for (let i = 0; i <= 260; i++) {
    const u = i / 260
    const a = u * turns * 360
    let rr = r * 0.18 + u * r * 0.82
    if (stuck && u > 0.35) {
      const wgt = Math.pow(Math.max(0, Math.cos(((a - 20) * Math.PI) / 180)), 3) * 0.8
      rr = rr * (1 - wgt) + r * 0.78 * wgt
    }
    const p = pol(cx, cy, rr, a)
    d += `${i ? 'L' : 'M'}${fx(p)}`
  }
  return (
    <g>
      <path d={d} fill="none" stroke={C.steel} strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r * 0.14} fill="url(#sk-brassG)" />
    </g>
  )
}

function DgStillFast() {
  const sx = 238
  const sy = 236
  const tw = 156
  const th = 64
  const below = []
  const r = rng(11)
  for (let i = 0; i < 70; i++) {
    const t = ((i + 0.5) / 70) * SEC
    below.push([t, -0.4])
    if (r() < 0.45) below.push([t + 0.1, -1.4 - r() * 2.6])
  }
  return (
    <F h={332} view="Flow · still fast after demagnetising" scale="schematic">
      <Bx x={12} y={28} w={210} h={42} l={['Confirm the cure first', 'compass still at 1 to 2 cm']} c={C.brass} s={10.5} lh={14} />
      <Compass cx={258} cy={49} r={20} ang={-90} />
      <T x={286} y={46} s={10.5} c={C.text}>needle stays still</T>
      <T x={286} y={60} s={10} c={C.dim}>not magnetism</T>

      <Tag x={14} y={96}>Still gaining? Watch the hairspring run</Tag>
      <Pn x={12} y={104} w={110} h={112} ok />
      <HSpring cx={67} cy={160} r={40} />
      <T x={67} y={210} a="middle" s={10.5} c={C.text}>coils evenly spaced</T>
      <Pn x={130} y={104} w={110} h={112} ok={false} />
      <HSpring cx={185} cy={160} r={40} stuck />
      <T x={185} y={210} a="middle" s={10.5} c={C.text}>coils stuck together</T>
      <rect x={252} y={104} width={216} height={112} rx="8" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <Note x={262} y={124} lines={['Stuck coils shorten the spring', 'just as magnetism does.', 'Usual cause: oil or dirt.']} c={C.text} s={10.5} lh={14} />
      <T x={262} y={180} s={11} c={C.emerald} w={600}>Cure: a clean</T>
      <Src x={262} y={198}>forum consensus, one magazine article</Src>

      <Tag x={14} y={234}>Still gains after cleaning?</Tag>
      <Note x={14} y={254} lines={['Look for a bent spring or', 'coils touching. Then listen:']} c={C.text} s={10.5} lh={14} />
      <T x={14} y={292} s={10.5} c={C.ruby}>clean line, dots below,</T>
      <T x={14} y={306} s={10.5} c={C.ruby}>a scratching sound</T>
      <Arrow a={[132, 288]} b={[150, 288]} c="ruby" w={1.3} />
      <T x={154} y={284} s={10.5} c={C.text}>spring on the</T>
      <T x={154} y={298} s={10.5} c={C.text}>pins or stud</T>
      <Trace x={sx} y={sy} w={tw} h={th} series={[{ pts: below, c: TICK, r: 1.2 }]} />
      <T x={sx + tw + 8} y={sy + 20} s={10.5} c={C.emerald} w={600}>Centre</T>
      <T x={sx + tw + 8} y={sy + 34} s={10.5} c={C.emerald} w={600}>the spring,</T>
      <T x={sx + tw + 8} y={sy + 48} s={10.5} c={C.emerald} w={600}>re-regulate</T>
      <Src x={sx} y={sy + th + 16}>remedy: Witschi</Src>
    </F>
  )
}

// Pivot in its jewel, section. state: ok | thick | worn
function PivotSec({ cx, cy, state }) {
  return (
    <g>
      <rect x={cx - 40} y={cy - 6} width={80} height={20} fill="url(#dg-bcut)" />
      <path d={`M${cx - 18} ${cy - 6} L${cx - 18} ${cy + 14} L${cx + 18} ${cy + 14} L${cx + 18} ${cy - 6} Z`} fill={M.ruby} stroke="#8a3943" strokeWidth="0.7" />
      <rect x={cx - 4} y={cy - 6} width={8} height={20} fill={C.ground} />
      {/* pivot coming down from the staff */}
      <path d={state === 'worn' ? `M${cx - 9} ${cy - 46} L${cx - 9} ${cy - 18} L${cx - 3} ${cy - 10} L${cx - 2} ${cy + 10} L${cx + 3} ${cy + 10} L${cx + 3.6} ${cy - 10} L${cx + 9} ${cy - 18} L${cx + 9} ${cy - 46} Z` : `M${cx - 9} ${cy - 46} L${cx - 9} ${cy - 18} L${cx - 3.4} ${cy - 10} L${cx - 3.4} ${cy + 10} L${cx + 3.4} ${cy + 10} L${cx + 3.4} ${cy - 10} L${cx + 9} ${cy - 18} L${cx + 9} ${cy - 46} Z`} fill="url(#sk-steelH)" stroke="#4e5f6a" strokeWidth="0.6" />
      {state === 'ok' && <path d={`M${cx - 10} ${cy - 6} Q${cx} ${cy - 13} ${cx + 10} ${cy - 6}`} fill={M.oil} opacity="0.8" />}
      {state === 'thick' && <path d={`M${cx - 20} ${cy - 6} Q${cx - 14} ${cy - 22} ${cx} ${cy - 18} Q${cx + 16} ${cy - 22} ${cx + 22} ${cy - 6} Z`} fill="#6b4a1e" stroke="#3d2a10" strokeWidth="0.6" />}
      {state === 'worn' && <circle cx={cx} cy={cy + 2} r={13} fill="none" stroke={C.ruby} strokeDasharray="2 2" />}
    </g>
  )
}

function DgSlowDies() {
  return (
    <F h={300} view="Section · pivot and jewel" scale="magnified, schematic">
      <Pn x={12} y={26} w={148} h={150} t="Healthy" tc={C.emerald} ok />
      <PivotSec cx={86} cy={116} state="ok" />
      <T x={86} y={160} a="middle" s={10.5} c={C.text}>thin, clean oil</T>
      <Pn x={166} y={26} w={148} h={150} t="Old, thick oil" tc={C.ruby} ok={false} />
      <PivotSec cx={240} cy={116} state="thick" />
      <T x={240} y={160} a="middle" s={10.5} c={C.text}>dark, gummy drag</T>
      <Pn x={320} y={26} w={148} h={150} t="Worn pivot" tc={C.ruby} ok={false} />
      <PivotSec cx={394} cy={116} state="worn" />
      <T x={394} y={160} a="middle" s={10.5} c={C.text}>thinned, loose fit</T>

      <Tag x={14} y={202}>The symptom</Tag>
      {[['losing time', C.ruby], ['low amplitude', C.ruby], ['dies when still', C.ruby]].map(([t, c], i) => (
        <g key={t}>
          <rect x={12 + i * 104} y={212} width={96} height={30} rx="5" fill="rgba(194,88,99,0.08)" stroke={c} strokeOpacity="0.7" />
          <T x={60 + i * 104} y={231} a="middle" s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
      <Arrow a={[322, 227]} b={[340, 227]} c="brass" w={1.4} />
      <Bx x={342} y={206} w={126} h={42} l={['It’s asking', 'for a service']} c={C.emerald} />
      <T x={14} y={274} s={10.5} c={C.dim}>Regulating won’t help: the drag eats the balance’s swing,</T>
      <T x={14} y={288} s={10.5} c={C.dim}>and a weaker swing loses time and stops sooner.</T>
    </F>
  )
}

// Position icon: watch seen from the side or front, schematic
function PosGlyph({ x, y, k }) {
  if (k === 'DU' || k === 'DD') {
    return (
      <g>
        <rect x={x - 16} y={y - 4} width={32} height={8} rx="2" fill="url(#sk-steel)" />
        <rect x={x - 12} y={k === 'DU' ? y - 7 : y + 4} width={24} height={3} rx="1" fill="url(#dg-acr)" />
      </g>
    )
  }
  const rot = { CU: 0, CD: 180, CL: 90, CR: -90 }[k]
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <circle cx={x} cy={y} r={11} fill="url(#sk-steel)" />
      <circle cx={x} cy={y} r={8.5} fill={M.dialDark} />
      <rect x={x - 3} y={y - 16} width={6} height={5} rx="1" fill={C.brass} />
    </g>
  )
}

function DgErratic() {
  const pos = [
    ['DU', 'dial up', 3],
    ['DD', 'dial down', 6],
    ['CU', 'crown up', -14],
    ['CD', 'crown down', 22],
    ['CL', 'crown left', -6],
    ['CR', 'crown right', 16],
  ]
  const y0 = 150
  return (
    <F h={316} view="Chart · rate by position" scale="schematic, no values">
      <T x={14} y={40} s={11} c={C.text} w={600}>Big swings between positions</T>
      <line x1={20} y1={y0} x2={300} y2={y0} stroke={C.struct} />
      <T x={20} y={y0 - 70} s={10} c={C.faint}>fast</T>
      <T x={20} y={y0 + 78} s={10} c={C.faint}>slow</T>
      {pos.map(([k, n, v], i) => {
        const x = 64 + i * 44
        const h = v * 3
        return (
          <g key={k}>
            <rect x={x - 11} y={h > 0 ? y0 - h : y0} width={22} height={Math.abs(h)} rx="2" fill={v > 0 ? 'rgba(208,168,79,0.6)' : 'rgba(134,167,189,0.6)'} />
            <PosGlyph x={x} y={y0 + 98} k={k} />
          </g>
        )
      })}
      <T x={160} y={y0 + 128} a="middle" s={10.5} c={C.dim}>DU · DD · CU · CD · CL · CR</T>
      <Dim a={[300, y0 - 66]} b={[300, y0 + 42]} off={-12} text="" />
      <T x={312} y={y0 + 60} s={10.5} c={C.ruby} w={600} a="middle">spread</T>

      <rect x={352} y={30} width={116} height={160} rx="8" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <Tag x={362} y={48}>Suspect</Tag>
      <Note x={362} y={72} lines={['a poise problem', '', 'a damaged', 'hairspring', '', 'escapement', 'issues']} c={C.text} s={10.5} lh={14} />
      <rect x={352} y={200} width={116} height={80} rx="8" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <Note x={362} y={220} lines={['A timegrapher', 'trace in each', 'position reveals', 'the pattern.']} c={C.dim} s={10.5} lh={14} />
      <T x={14} y={306} s={10} c={C.faint}>Bars show the shape of a fault, not real figures.</T>
    </F>
  )
}

function Dg24h() {
  const X = (h) => 60 + h * 11
  const Y = (a) => 250 - (a - 140) * 1.1
  return (
    <F h={318} view="Chart · fully wound, then 24 hours on" scale="amplitude to scale">
      <line x1={X(0)} y1={Y(140)} x2={X(26)} y2={Y(140)} stroke={C.struct} />
      <line x1={X(0)} y1={Y(140)} x2={X(0)} y2={Y(320)} stroke={C.struct} />
      {[160, 200, 240, 280, 320].map((a) => (
        <g key={a}>
          <line x1={X(0) - 4} y1={Y(a)} x2={X(0)} y2={Y(a)} stroke={C.faint} />
          <T x={X(0) - 7} y={Y(a) + 4} a="end" s={10} c={C.faint} mono>{a}°</T>
        </g>
      ))}
      {[0, 12, 24].map((h) => (
        <T key={h} x={X(h)} y={Y(140) + 16} a="middle" s={10} c={C.faint} mono>{h} h</T>
      ))}
      <rect x={X(23)} y={Y(270)} width={X(25) - X(23)} height={Y(255) - Y(270)} fill="rgba(123,165,131,0.35)" stroke={C.emerald} />
      <path d={`M${X(0)} ${Y(300)} Q${X(12)} ${Y(290)} ${X(24)} ${Y(262)}`} fill="none" stroke={C.emerald} strokeWidth="2.2" />
      <path d={`M${X(0)} ${Y(300)} Q${X(12)} ${Y(280)} ${X(24)} ${Y(180)}`} fill="none" stroke={C.ruby} strokeWidth="2.2" strokeDasharray="6 3" />
      <circle cx={X(0)} cy={Y(300)} r="4" fill={C.brassHi} />
      <T x={X(0) + 8} y={Y(300) - 8} s={10.5} c={C.brassHi}>300° fully wound</T>
      <T x={X(25) + 6} y={Y(266)} s={10.5} c={C.emerald} w={600}>255° to 270°</T>
      <T x={X(25) + 6} y={Y(266) + 14} s={10} c={C.dim}>a 10 to 15% fall:</T>
      <T x={X(25) + 6} y={Y(266) + 28} s={10} c={C.dim}>accepted (Witschi)</T>
      <T x={X(24) + 8} y={Y(184)} s={10.5} c={C.ruby} w={600}>a much bigger fall</T>
      <T x={X(24) + 8} y={Y(184) + 14} s={10} c={C.dim}>or a sharp rate shift</T>
      <T x={60} y={292} s={10.5} c={C.text}>Points at the mainspring or barrel.</T>
      <T x={60} y={306} s={10.5} c={C.ruby}>No regulator setting will cure that.</T>
      <T x={X(12)} y={Y(140) - 8} a="middle" s={10} c={C.faint}>no rewinding in between</T>
    </F>
  )
}

function DgRegulate() {
  const cx = 130
  const cy = 170
  return (
    <F h={312} view="Plan · the regulator on the balance cock" scale="schematic">
      <path d={`M${cx - 30} ${cy + 80} L${cx - 22} ${cy - 10} Q${cx} ${cy - 40} ${cx + 22} ${cy - 10} L${cx + 30} ${cy + 80} Z`} fill="#8b8574" opacity="0.5" stroke={C.struct} />
      <circle cx={cx} cy={cy} r={22} fill="#8b8574" stroke={C.struct} />
      <circle cx={cx} cy={cy} r={7} fill={M.ruby} stroke="#8a3943" />
      {/* +/− scale */}
      <path d={`M${fx(pol(cx, cy, 70, -150))} A70 70 0 0 1 ${fx(pol(cx, cy, 70, -30))}`} fill="none" stroke={C.dim} />
      {Array.from({ length: 13 }, (_, i) => {
        const a = -150 + i * 10
        return <line key={i} x1={pol(cx, cy, 66, a)[0]} y1={pol(cx, cy, 66, a)[1]} x2={pol(cx, cy, i % 3 === 0 ? 76 : 72, a)[0]} y2={pol(cx, cy, i % 3 === 0 ? 76 : 72, a)[1]} stroke={C.dim} />
      })}
      <T x={pol(cx, cy, 88, -150)[0]} y={pol(cx, cy, 88, -150)[1] + 4} a="middle" s={14} c={C.steel} w={700}>−</T>
      <T x={pol(cx, cy, 88, -30)[0]} y={pol(cx, cy, 88, -30)[1] + 4} a="middle" s={14} c={C.brassHi} w={700}>+</T>
      {/* index arm */}
      <path d={`M${cx} ${cy} L${fx(pol(cx, cy, 72, -84))}`} stroke="url(#sk-steelH)" strokeWidth="5" strokeLinecap="round" />
      <path d={`M${cx} ${cy} L${fx(pol(cx, cy, 72, -84))}`} stroke="#c5ced4" strokeWidth="2.4" strokeLinecap="round" />
      <Arrow d={`M${fx(pol(cx, cy, 98, -96))} A98 98 0 0 1 ${fx(pol(cx, cy, 98, -72))}`} c="brass" w={1.6} both />
      <T x={cx} y={cy - 108} a="middle" s={10.5} c={C.text}>a small nudge</T>
      <T x={cx} y={cy + 100} a="middle" s={10.5} c={C.dim}>balance cock</T>
      <Lab p={pol(cx, cy, 40, -84)} x={cx + 60} y={cy + 20} text="index" a="start" />
      <T x={20} y={cy - 30} s={10} c={C.steel}>slower</T>
      <T x={204} y={cy - 30} s={10} c={C.brassHi}>faster</T>

      <Tag x={262} y={44}>Only when</Tag>
      <Row x={262} y={52} w={206} h={30} ok head="Amplitude is healthy" />
      <Row x={262} y={88} w={206} h={30} ok head="Error is small and steady" />
      <Tag x={262} y={146}>Not when</Tag>
      <Row x={262} y={154} w={206} h={30} ok={false} head="Amplitude is low" />
      <Row x={262} y={190} w={206} h={30} ok={false} head="Rate is erratic" />
      <Row x={262} y={226} w={206} h={30} ok={false} head="Gaining many minutes" />
      <T x={262} y={280} s={10.5} c={C.dim}>Method: the mechanical</T>
      <T x={262} y={294} s={10.5} c={C.dim}>regulation lesson.</T>
    </F>
  )
}

/* ================================================================== */
/* diag-water · water got in                                            */
/* ================================================================== */

// Watch case in section. Centre cx, top y; w wide. back: 'on' | 'off'
function WCase({ cx, y, w = 220, back = 'on', crownOut, mov = true, ring, cracked, pushers }) {
  const L = cx - w / 2
  const R = cx + w / 2
  const g = M.gasket
  return (
    <g>
      {/* mid-case walls */}
      <path d={`M${L} ${y + 10} L${L + 16} ${y + 10} L${L + 16} ${y + 70} L${L} ${y + 70} Z`} fill="url(#dg-cut)" stroke="#4e5f6a" />
      <path d={`M${R} ${y + 10} L${R - 16} ${y + 10} L${R - 16} ${y + 70} L${R} ${y + 70} Z`} fill="url(#dg-cut)" stroke="#4e5f6a" />
      {/* crystal and its gasket */}
      <rect x={L + 8} y={y} width={w - 16} height={9} rx="2" fill="url(#dg-acr)" stroke={M.glass} />
      {cracked && <path d={`M${cx - 20} ${y} L${cx - 8} ${y + 9} M${cx - 8} ${y} L${cx + 6} ${y + 9} L${cx + 14} ${y + 3}`} stroke="#ffffff" strokeWidth="1.1" fill="none" />}
      <rect x={L + 6} y={y + 8} width={10} height={5} fill={g} />
      <rect x={R - 16} y={y + 8} width={10} height={5} fill={g} />
      {/* dial and movement */}
      {mov && <rect x={L + 18} y={y + 24} width={w - 36} height={5} fill={M.dial} />}
      {mov && <rect x={L + 22} y={y + 29} width={w - 44} height={34} rx="3" fill="url(#dg-mov)" stroke={C.struct} strokeWidth="0.6" />}
      {ring && <rect x={L + 16} y={y + 29} width={8} height={36} fill={M.plastic} opacity="0.85" />}
      {ring && <rect x={R - 24} y={y + 29} width={8} height={36} fill={M.plastic} opacity="0.85" />}
      {/* crown tube, stem and crown on the right */}
      <rect x={R} y={y + 36} width={14} height={14} fill="url(#dg-cut)" stroke="#4e5f6a" />
      {mov && <rect x={R - 26} y={y + 41} width={crownOut ? 52 : 44} height={4} fill="url(#sk-steel)" />}
      <rect x={R + (crownOut ? 22 : 14)} y={y + 31} width={14} height={24} rx="3" fill="url(#dg-knurl)" stroke="#55646e" />
      <rect x={R + (crownOut ? 18 : 12)} y={y + 35} width={4} height={16} fill={g} />
      {pushers && <rect x={L - 12} y={y + 38} width={12} height={10} rx="2" fill="url(#sk-steel)" stroke="#55646e" />}
      {/* caseback and its gasket */}
      {back === 'on' && <rect x={L + 4} y={y + 70} width={w - 8} height={10} rx="3" fill="url(#dg-cut)" stroke="#4e5f6a" />}
      {back === 'on' && <rect x={L + 10} y={y + 67} width={w - 20} height={3} fill={g} />}
    </g>
  )
}

function DgWaterSigns() {
  const sign = (x, kind, label) => (
    <g>
      <Face cx={x} cy={96} r={46} h={300} m={60} lugs={false} dial={kind === 'damp' ? '#3a332a' : M.dialDark} />
      {kind === 'fog' && <circle cx={x} cy={96} r={40} fill="rgba(220,230,235,0.32)" />}
      {kind === 'fog' && <circle cx={x - 10} cy={84} r={22} fill="rgba(235,240,245,0.22)" />}
      {kind === 'drop' && [[-18, -20, 4], [10, -26, 3], [22, 4, 5], [-24, 12, 3], [4, 22, 4], [-6, -6, 2.5]].map(([dx, dy, r], i) => (
        <g key={i}>
          <circle cx={x + dx} cy={96 + dy} r={r} fill="rgba(169,208,222,0.35)" stroke={M.glass} strokeWidth="0.8" />
          <circle cx={x + dx - r * 0.35} cy={96 + dy - r * 0.35} r={r * 0.3} fill="#ffffff" opacity="0.7" />
        </g>
      ))}
      {kind === 'damp' && <path d={`M${x - 30} ${110} q10 -14 22 -4 q12 10 26 -6 q6 16 -10 24 q-22 8 -38 -14 Z`} fill="rgba(80,60,40,0.55)" />}
      <T x={x} y={164} a="middle" s={11} c={C.text} w={600}>{label}</T>
    </g>
  )
  return (
    <F h={322} view="Inspection · signs of water inside" scale="schematic">
      {sign(80, 'fog', 'fogging under the crystal')}
      {sign(240, 'drop', 'droplets')}
      {sign(400, 'damp', 'a dial that looks damp')}
      <T x={240} y={190} a="middle" s={11} c={C.ruby} w={600}>Any one means water has breached a seal.</T>
      <WCase cx={150} y={210} w={210} />
      <Lab p={[56, 219]} x={30} y={312} text="crystal seal" a="start" />
      <Lab p={[150, 277]} x={150} y={312} text="caseback seal" />
      <Lab p={[267, 253]} x={300} y={300} text="crown seal" a="start" />
      <Note x={320} y={226} lines={['Every way in has', 'a gasket. One of', 'them has let go.']} c={C.dim} s={10.5} lh={14} />
    </F>
  )
}

function DgOpenNow() {
  return (
    <F h={314} view="Section · open it to let the moisture out" scale="schematic">
      <WCase cx={140} y={70} w={220} back="off" />
      {/* the back, lifted away */}
      <rect x={34} y={196} width={212} height={10} rx="3" fill="url(#dg-cut)" stroke="#4e5f6a" />
      <rect x={40} y={192} width={200} height={3} fill={M.gasket} />
      <Arrow a={[140, 156]} b={[140, 186]} c="brass" w={1.6} />
      <T x={150} y={176} s={10.5} c={C.text}>caseback off</T>
      {/* moisture leaving */}
      {[80, 120, 160, 200].map((x) => (
        <path key={x} d={`M${x} 218 q-6 10 0 18 q6 8 0 18`} fill="none" stroke={C.steel} strokeWidth="1.3" strokeDasharray="3 2" />
      ))}
      <T x={140} y={274} a="middle" s={10.5} c={C.steel}>moisture escapes</T>

      <Pn x={282} y={30} w={186} h={128} t="Every hour counts" tc={C.ruby} />
      <Note x={292} y={62} lines={['Trapped water rusts the', 'steel parts quickly:', 'pivots and springs first.']} c={C.text} s={10.5} lh={14} />
      {/* rusting pivot */}
      <rect x={300} y={118} width={60} height={8} fill="url(#sk-steelH)" />
      <rect x={360} y={119} width={22} height={6} fill="url(#sk-steelH)" />
      {[364, 370, 377].map((x) => <circle key={x} cx={x} cy={122} r={2.2} fill="#a0521d" />)}
      <T x={392} y={126} s={10.5} c="#d0773a">rust</T>
      <Pn x={282} y={168} w={186} h={60} ok={false} />
      <T x={292} y={194} s={11} c={C.ruby} w={600}>Don’t “wait and see”</T>
      <T x={292} y={210} s={10.5} c={C.dim}>it won’t dry closed up</T>
      <Pn x={282} y={238} w={186} h={60} ok />
      <T x={292} y={264} s={11} c={C.emerald} w={600}>Open it now</T>
      <T x={292} y={280} s={10.5} c={C.dim}>as soon as possible</T>
    </F>
  )
}

function DgMovementOut() {
  return (
    <F h={330} view="Sequence · movement out, then inspect" scale="schematic">
      {/* setting lever release with the stem */}
      <Pn x={12} y={26} w={150} h={140} t="Release the stem" />
      <rect x={30} y={70} width={110} height={70} rx="8" fill="url(#dg-mov)" stroke={C.struct} />
      <rect x={100} y={102} width={60} height={5} fill="url(#sk-steel)" />
      <circle cx={84} cy={92} r={4} fill={M.ruby} stroke={C.ground} />
      <G x={84} y={92} ang={-30}>
        <Screwdriver len={50} blade={5} />
      </G>
      <Arrow a={[118, 124]} b={[150, 124]} c="brass" w={1.6} />
      <T x={20} y={156} s={10.5} c={C.dim}>press, draw the stem</T>

      <Pn x={170} y={26} w={140} h={140} t="Lift it out" />
      <rect x={190} y={112} width={100} height={30} rx="3" fill="none" stroke="#6f808b" strokeWidth="5" />
      <rect x={198} y={62} width={84} height={26} rx="4" fill="url(#dg-mov)" stroke={C.struct} />
      <Arrow a={[240, 108]} b={[240, 94]} c="brass" w={1.6} />
      <T x={180} y={158} s={10.5} c={C.dim}>out of the damp air</T>

      <Pn x={318} y={26} w={150} h={140} t="Photograph" />
      <rect x={346} y={66} width={92} height={60} rx="8" fill="#2b2620" stroke={C.dim} />
      <circle cx={392} cy={96} r={20} fill="#1a1714" stroke={C.dim} strokeWidth="2" />
      <circle cx={392} cy={96} r={10} fill="#334651" />
      <rect x={358} y={58} width={22} height={9} rx="2" fill={C.dim} />
      <Note x={328} y={142} lines={['the dial, and anything', 'that looks wet']} c={C.dim} s={10.5} lh={14} />

      <Tag x={14} y={192}>Look for rust on</Tag>
      {[['screws', 60], ['the click', 170], ['keyless parts', 280]].map(([t, x], i) => (
        <g key={t}>
          <Ring x={x} y={242} r={34} c="#d0773a" />
          {i === 0 && <g><Screw x={x} y={242} r={14} ang={20} /><circle cx={x + 6} cy={236} r={3} fill="#a0521d" /><circle cx={x - 7} cy={248} r={2.4} fill="#a0521d" /></g>}
          {i === 1 && <g><path d={`M${x - 22} ${252} L${x - 26} ${244} L${x + 14} ${226} L${x + 22} ${234} Z`} fill="url(#sk-steel)" stroke="#4e5f6a" /><circle cx={x + 10} cy={232} r={3} fill="#a0521d" /><circle cx={x - 8} cy={244} r={2.5} fill="#a0521d" /></g>}
          {i === 2 && <g><path d={`M${x - 26} ${236} L${x + 8} ${236} L${x + 22} ${250} L${x - 26} ${250} Z`} fill="url(#sk-steel)" stroke="#4e5f6a" /><circle cx={x + 2} cy={243} r={3} fill="#a0521d" /><circle cx={x + 14} cy={247} r={2.4} fill="#a0521d" /></g>}
          <T x={x} y={292} a="middle" s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
      <rect x={348} y={204} width={120} height={86} rx="6" fill="rgba(194,88,99,0.09)" stroke={C.ruby} />
      <Note x={358} y={224} head="Rust started?" hc={C.ruby} lines={['That means a', 'full strip, not', 'just drying.']} c={C.text} s={10.5} lh={14} />
      <T x={14} y={318} s={10.5} c={C.dim}>Only if you have the tools. Otherwise get the back off and let it dry open.</T>
    </F>
  )
}

function DgQuartzCellOut() {
  return (
    <F h={314} view="Detail · cell out, contacts checked" scale="magnified, schematic">
      <QMod cx={96} cy={120} r={66} cell={false} />
      <circle cx={96 + 26 * 0.94} cy={120 + 26 * 0.94} r={29} fill="none" stroke={C.faint} strokeDasharray="3 3" />
      {/* cell lifted out with tweezers */}
      <circle cx={190} cy={54} r={22} fill="url(#dg-cell)" stroke="#4e5f6a" />
      <G x={190} y={52} ang={60}>
        <Tweezers len={44} gap={4} tip={21} w={2.6} />
      </G>
      <Arrow d="M150 112 Q160 80 176 70" c="brass" w={1.6} />
      <T x={196} y={92} s={10.5} c={C.text}>cell out first</T>
      <T x={96} y={206} a="middle" s={10.5} c={C.dim}>empty cell seat</T>

      <Loupe id="dg-co1" x={318} y={92} r={56} ok={false}>
        <rect x={262} y={90} width={112} height={60} fill={M.plate} />
        <path d="M268 112 L330 112 L352 104" fill="none" stroke={C.steel} strokeWidth="5" strokeLinecap="round" />
        {[[300, 107], [312, 110], [322, 105], [306, 116]].map(([x, y], i) => <rect key={i} x={x} y={y} width={5} height={5} fill="#f2f2ee" transform={`rotate(${i * 25} ${x} ${y})`} />)}
        <ellipse cx={340} cy={106} rx={12} ry={6} fill="#6fa85e" stroke="#3f6e35" />
        <path d="M280 70 L360 70 L360 88" fill="none" stroke={C.brassHi} strokeWidth="4" />
        <ellipse cx={356} cy={84} rx={7} ry={4} fill="#6fa85e" />
      </Loupe>
      <Lab p={[306, 112]} x={268} y={172} text="salt crystals" />
      <Lab p={[340, 106]} x={384} y={172} text="green crust" a="start" />
      <Note x={258} y={196} lines={['Salt and leaked cell contents', 'can destroy the contacts.']} c={C.text} s={10.5} lh={14} />
      <Src x={258} y={226}>warning: Witschi</Src>

      <Bx x={12} y={240} w={150} h={52} l={['Found any?', 'clean the contacts', 'before a new cell']} c={C.brass} s={10.5} lh={14} />
      <Arrow a={[162, 266]} b={[180, 266]} c="brass" w={1.4} />
      <Bx x={182} y={240} w={286} h={52} l={['Follow the battery corrosion lesson', 'for the clean and the check after it']} c={C.emerald} s={10.5} lh={14} />
    </F>
  )
}

function DgDryGently() {
  return (
    <F h={300} view="Comparison · drying the opened watch" scale="schematic">
      <Pn x={12} y={26} w={148} h={190} t="Sealed tub" tc={C.emerald} c={C.emerald} ok />
      <rect x={30} y={70} width={112} height={92} rx="8" fill="rgba(169,208,222,0.12)" stroke={M.glass} />
      <rect x={26} y={62} width={120} height={10} rx="3" fill={M.glass} opacity="0.7" />
      {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={40 + (i % 11) * 9} cy={148 + Math.floor(i / 11) * 8} r={3.4} fill={i % 3 ? '#e8e4d6' : '#f0b96a'} />)}
      <rect x={58} y={116} width={56} height={14} rx="4" fill="url(#sk-steel)" />
      <rect x={66} y={112} width={40} height={4} fill="url(#dg-mov)" />
      <T x={86} y={186} a="middle" s={10.5} c={C.text}>with silica gel</T>
      <T x={86} y={200} a="middle" s={10} c={C.dim}>back open, lid shut</T>

      <Pn x={166} y={26} w={148} h={190} t="Gentle warmth" tc={C.emerald} c={C.emerald} ok />
      <path d="M210 60 L270 60 L262 74 L218 74 Z" fill={C.struct} />
      <path d="M218 74 L196 130 L284 130 L262 74 Z" fill="url(#dg-lamp)" />
      <rect x={212} y={134} width={56} height={14} rx="4" fill="url(#sk-steel)" />
      <rect x={198} y={148} width={84} height={6} fill="url(#sk-wood)" />
      <T x={240} y={186} a="middle" s={10.5} c={C.text}>warm, never hot</T>
      <T x={240} y={200} a="middle" s={10} c={C.dim}>back open</T>

      <Pn x={320} y={26} w={148} h={190} t="High heat" tc={C.ruby} c={C.ruby} ok={false} />
      <rect x={346} y={64} width={96} height={86} rx="6" fill="#2b2620" stroke={C.dim} />
      <rect x={354} y={72} width={80} height={60} rx="3" fill="#3a2418" />
      {[364, 384, 404, 424].map((x) => <path key={x} d={`M${x - 6} 128 q3 -8 0 -14 q-3 -6 0 -12`} stroke="#e0894a" strokeWidth="1.6" fill="none" />)}
      <rect x={370} y={112} width={44} height={12} rx="4" fill="url(#sk-steel)" />
      <T x={394} y={176} a="middle" s={10.5} c={C.text}>don’t bake it</T>
      <T x={394} y={190} a="middle" s={10} c={C.dim}>never high heat</T>

      <T x={14} y={240} s={11} c={C.ruby} w={600}>Heat damages:</T>
      {['seals', 'lubricants', 'some dials'].map((t, i) => (
        <g key={t}>
          <rect x={110 + i * 120} y={228} width={110} height={20} rx="4" fill="rgba(194,88,99,0.08)" stroke={C.ruby} strokeOpacity="0.6" />
          <T x={165 + i * 120} y={242} a="middle" s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
      <T x={14} y={276} s={10.5} c={C.dim}>Drying only gets the water out. It doesn’t clean the oils (next step).</T>
    </F>
  )
}

function DgAssessService() {
  return (
    <F h={302} view="Flow · dried is not fixed" scale="schematic">
      <Bx x={12} y={30} w={130} h={50} l={['Properly wet,', 'now dried']} c={C.steel} />
      <Arrow a={[142, 55]} b={[160, 55]} c="brass" w={1.4} />
      <Bx x={162} y={30} w={140} h={50} l={['The oils are', 'contaminated']} c={C.ruby} />
      <Arrow a={[302, 55]} b={[320, 55]} c="brass" w={1.4} />
      <Bx x={322} y={30} w={146} h={50} l={['A full service']} c={C.emerald} />

      {/* oil drop: clean vs contaminated */}
      <Pn x={12} y={98} w={220} h={102} t="In a jewel" />
      <PivotSec cx={70} cy={168} state="ok" />
      <T x={70} y={194} a="middle" s={10} c={C.dim}>clean oil</T>
      {(() => {
        return (
          <g>
            <PivotSec cx={174} cy={168} state="ok" />
            {[[166, 160], [176, 158], [182, 162]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2} fill="#d0d8dc" />)}
            <T x={174} y={194} a="middle" s={10} c={C.ruby}>water in the oil</T>
          </g>
        )
      })()}
      <Pn x={240} y={98} w={228} h={102} t="And the gaskets" />
      {[0, 1].map((i) => (
        <g key={i}>
          <circle cx={290 + i * 104} cy={146} r={22} fill="none" stroke={M.gasket} strokeWidth="6" opacity={i ? 1 : 0.55} />
          <T x={290 + i * 104} y={184} a="middle" s={10} c={i ? C.emerald : C.ruby}>{i ? 'new, then re-tested' : 'old: replace'}</T>
        </g>
      ))}
      <Arrow a={[318, 146]} b={[366, 146]} c="emerald" w={1.4} />

      <TipBar y={212} h={78} l1="Afterwards, find out why it leaked and fix the cause" l2="before you trust it near water again." />
      {['a tired gasket', 'an unscrewed crown'].map((t, i) => (
        <g key={t}>
          <rect x={48 + i * 160} y={256} width={150} height={24} rx="4" fill="rgba(255,255,255,0.03)" stroke={C.brass} strokeOpacity="0.5" />
          <T x={123 + i * 160} y={272} a="middle" s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
    </F>
  )
}

function DgWayIn() {
  return (
    <F h={340} view="Inspection · find the way in" scale="schematic">
      <WCase cx={150} y={44} w={230} pushers crownOut />
      <Num x={150} y={34} n={1} r={7} />
      <T x={162} y={38} s={10.5} c={C.text}>crystal</T>
      <Num x={300} y={70} n={2} r={7} />
      <T x={312} y={74} s={10.5} c={C.text}>crown: fully home?</T>
      <Num x={22} y={106} n={3} r={7} />
      <T x={14} y={140} s={10.5} c={C.text}>pushers</T>
      <Num x={150} y={140} n={4} r={7} />
      <T x={162} y={144} s={10.5} c={C.text}>gaskets: damage, dirt</T>
      <Arrow a={[290, 80]} b={[278, 80]} c="brass" w={1.4} />

      <Tag x={14} y={172}>Plastic movement ring: line up the recess</Tag>
      <Pn x={12} y={180} w={224} h={110} ok />
      <rect x={30} y={216} width={186} height={32} fill={M.plastic} />
      <rect x={168} y={216} width={24} height={12} fill={C.ground} />
      <rect x={168} y={220} width={60} height={4} fill="url(#sk-steel)" />
      <rect x={24} y={248} width={198} height={8} rx="2" fill="url(#dg-cut)" />
      <T x={124} y={276} a="middle" s={10.5} c={C.text}>recess over the stem: back seats</T>
      <Pn x={244} y={180} w={224} h={110} ok={false} />
      <rect x={262} y={204} width={186} height={32} fill={M.plastic} />
      <rect x={392} y={236} width={68} height={5} fill="url(#sk-steel)" />
      <rect x={256} y={250} width={198} height={8} rx="2" fill="url(#dg-cut)" />
      <Dim a={[300, 241]} b={[300, 250]} off={0} />
      <T x={312} y={248} s={10.5} c={C.ruby}>gap</T>
      <T x={356} y={276} a="middle" s={10.5} c={C.text}>ring sits on the stem: gap at the back</T>

      <Caution y={300} h={34} l1="Looking won’t prove a seal: test it next (water testing lesson)." l2="Don’t pressure-test a cracked crystal: the glass can break up onto the hands and dial." />
    </F>
  )
}

/* ================================================================== */
/* diag-winding · winding & setting problems                            */
/* ================================================================== */

// Zig-zag ratchet (Breguet) teeth on a vertical face at x, from y1 to y2; dir +1 points right
function Zig({ x, y1, y2, dir = 1, c = '#c5ced4', n = 4 }) {
  const h = (y2 - y1) / n
  let d = `M${x} ${y1}`
  for (let i = 0; i < n; i++) d += ` L${x + dir * 5} ${y1 + h * (i + 0.8)} L${x} ${y1 + h * (i + 1)}`
  return <path d={d} fill="none" stroke={c} strokeWidth="1.4" />
}

// Keyless works, schematic plan. pos: 'wind' | 'set' | 'mid'. Stem axis at y.
function Keyless({ x0, y, pos = 'wind', lever = true, yoke = true, short, glue, greaseAt, loose, k = 1 }) {
  const pull = pos === 'set' ? 22 : 0
  const spx = pos === 'set' ? x0 + 76 : pos === 'mid' ? x0 + 92 : x0 + 108
  const stemEnd = short ? x0 + 104 : x0 + 30
  return (
    <g transform={k === 1 ? undefined : `translate(${x0} ${y}) scale(${k}) translate(${-x0} ${-y})`}>
      {/* setting wheel and crown wheel */}
      <Gear cx={x0 + 60} cy={y + 26} r={16} n={16} />
      <Gear cx={x0 + 166} cy={y - 34} r={20} n={20} />
      {/* stem: plain part, square, groove */}
      <rect x={stemEnd + pull} y={y - 3} width={x0 + 250 - stemEnd} height={6} fill="url(#sk-steel)" stroke="#4e5f6a" strokeWidth="0.5" />
      <rect x={Math.max(stemEnd, x0 + 40) + pull} y={y - 3} width={x0 + 150 - Math.max(stemEnd, x0 + 40)} height={6} fill="#7e909b" />
      {glue && <path d={`M${x0 + 82} ${y - 5} q6 -3 12 0 q6 3 13 0 L${x0 + 107} ${y + 5} q-7 3 -13 0 q-6 -3 -12 0 Z`} fill="#e8d7a0" stroke="#a8935a" strokeWidth="0.6" />}
      <rect x={x0 + 196 + pull} y={y - 3} width={5} height={6} fill={C.ground} />
      {/* crown */}
      <rect x={x0 + 250 + pull} y={y - 14} width={16} height={28} rx="3" fill="url(#dg-knurl)" stroke="#55646e" />
      {/* winding pinion (fixed) */}
      <rect x={x0 + 150} y={y - 10} width={32} height={20} rx="2" fill="url(#sk-steel)" stroke="#4e5f6a" strokeWidth="0.6" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={x0 + 153 + i * 6} y={y - 14} width={3} height={4} fill="#c5ced4" />)}
      <Zig x={x0 + 150} y1={y - 10} y2={y + 10} dir={-1} />
      {/* sliding pinion */}
      <rect x={spx} y={y - 10} width={40} height={20} rx="2" fill="url(#sk-steel)" stroke="#4e5f6a" strokeWidth="0.6" />
      <rect x={spx + 17} y={y - 10} width={6} height={20} fill="#5f717d" />
      <Zig x={spx + 40} y1={y - 10} y2={y + 10} dir={1} />
      <Zig x={spx} y1={y - 10} y2={y + 10} dir={-1} c="#a7b6bf" />
      {/* yoke from its pivot to the sliding pinion's groove, with its spring */}
      {yoke && (
        <g>
          <path d={`M${x0 + 20} ${y + 66} L${spx + 20} ${y + 14} L${spx + 20} ${y + 8}`} fill="none" stroke="#a7b6bf" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round" />
          <circle cx={x0 + 20} cy={y + 66} r={4} fill={C.ground} stroke="#a7b6bf" strokeWidth="1.4" />
          <path d={`M${x0 + 60} ${y + 76} q10 -4 6 -12 q-4 -8 6 -12 q10 -4 6 -12`} fill="none" stroke={C.text} strokeWidth="1.3" />
        </g>
      )}
      {/* setting lever: pivot screw, pin in the stem groove, beak toward the yoke */}
      {lever && (
        <g transform={loose ? `translate(0 10)` : undefined}>
          <path d={`M${x0 + 220} ${y + 54} L${x0 + 198 + pull} ${y + 6} M${x0 + 220} ${y + 54} L${spx + 30} ${y + 34}`} fill="none" stroke="#c5ced4" strokeWidth="5" strokeLinecap="round" />
          <circle cx={x0 + 198.5 + pull} cy={loose ? y + 6 : y} r={3} fill="#c5ced4" stroke="#4e5f6a" />
          <Screw x={x0 + 220} y={y + 54} r={7} ang={loose ? 70 : 20} />
        </g>
      )}
      {greaseAt && greaseAt.map(([dx, dy], i) => <circle key={i} cx={x0 + dx} cy={y + dy} r={4} fill={greaseAt.dry ? '#7d5b2b' : M.grease} stroke={greaseAt.dry ? '#4d3416' : '#3f7a4f'} strokeWidth="0.6" />)}
    </g>
  )
}

function DgDrivePath() {
  const chain = [
    ['stem', 'turned by the crown'],
    ['sliding pinion', ''],
    ['winding pinion', ''],
    ['crown wheel', 'watch it first'],
    ['ratchet wheel', 'then this, click holds'],
    ['mainspring', 'should firm up'],
  ]
  return (
    <F h={340} view="Flow · follow the power by eye" scale="schematic">
      {chain.map(([t, sub], i) => (
        <g key={t}>
          <rect x={12 + i * 77} y={30} width={71} height={40} rx="6" fill={i === 3 || i === 4 ? 'rgba(208,168,79,0.15)' : 'rgba(255,255,255,0.03)'} stroke={i === 3 || i === 4 ? C.brass : C.line} />
          <Note x={47.5 + i * 77} y={47} a="middle" lines={t.split(' ')} c={C.text} s={10.5} lh={13} />
          {i < 5 && <Arrow a={[83 + i * 77, 50]} b={[89 + i * 77, 50]} c="brass" w={1.2} />}
        </g>
      ))}
      <T x={14} y={90} s={10.5} c={C.dim}>Back open, turn the crown slowly. On many automatics the rotor must come off first.</T>

      <Tag x={14} y={116}>Where does it stop?</Tag>
      {[
        ['Neither wheel moves', 'stem, sliding pinion or winding pinion', [0, 2]],
        ['Crown wheel turns, ratchet doesn’t', 'the teeth between them', [3, 4]],
        ['Ratchet turns, click holds, never firmer', 'the mainspring or its hook', [5, 5]],
      ].map(([a, b, [i0, i1]], j) => {
        const y = 126 + j * 52
        return (
          <g key={a}>
            <rect x={12} y={y} width={456} height={44} rx="6" fill="rgba(255,255,255,0.025)" stroke={C.line} />
            {Array.from({ length: 6 }, (_, k) => (
              <rect key={k} x={22 + k * 15} y={y + 18} width={11} height={8} rx="2" fill={k >= i0 && k <= i1 ? C.ruby : k < i0 ? C.emerald : C.line} />
            ))}
            <T x={122} y={y + 18} s={11} c={C.text} w={600}>{a}</T>
            <T x={122} y={y + 33} s={10.5} c={C.dim}>look at: {b}</T>
          </g>
        )
      })}
      <T x={22} y={296} s={10} c={C.faint}>green: proven moving · red: where to look</T>
      <Caution y={302} h={32} l1="An automatic has no hard stop at full wind. Don’t keep winding to find one." />
    </F>
  )
}

function DgWindNotSet() {
  return (
    <F h={340} view="Plan · the sliding pinion’s two positions" scale="schematic">
      <Tag x={14} y={40}>Crown in: winding</Tag>
      <Keyless x0={14} y={100} pos="wind" k={0.8} />
      <T x={60} y={84} a="middle" s={10} c={C.emerald}>engaged</T>
      <Tag x={254} y={40}>Crown out: setting</Tag>
      <Keyless x0={250} y={100} pos="set" k={0.8} />
      <Lab p={[298, 121]} x={300} y={200} text="setting wheel" />
      <Lab p={[327, 100]} x={384} y={176} text="sliding pinion" a="start" />
      <Lab p={[266, 153]} x={236} y={186} text="yoke" />
      <Lab p={[426, 143]} x={464} y={200} text="setting lever" a="end" />
      <Lab p={[383, 73]} x={468} y={52} text="crown wheel" a="end" up />
      <Sep x1={12} y1={208} x2={468} y2={208} />
      <Pn x={12} y={216} w={230} h={116} t="The fault" tc={C.ruby} ok={false} />
      <Note x={22} y={250} lines={['The sliding pinion isn’t reaching', 'one of its two positions, so it', 'winds but won’t set, or the', 'other way round.']} c={C.text} s={10.5} lh={14} />
      <Pn x={250} y={216} w={218} h={116} t="Usual cause" tc={C.brassHi} />
      <Note x={260} y={250} lines={['The yoke spring or setting-', 'lever spring is:']} c={C.text} s={10.5} lh={14} />
      {['worn', 'dislodged', 'gummed up'].map((t, i) => (
        <g key={t}>
          <rect x={260 + i * 68} y={284} width={62} height={24} rx="4" fill="rgba(208,168,79,0.08)" stroke={C.brass} strokeOpacity="0.6" />
          <T x={291 + i * 68} y={300} a="middle" s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
    </F>
  )
}

function DgCrownSpins() {
  const clutch = (x, y, gap) => (
    <g>
      <rect x={x} y={y - 3} width={150} height={6} fill="url(#sk-steel)" />
      <rect x={x + 30 - gap} y={y - 12} width={40} height={24} rx="2" fill="url(#sk-steel)" stroke="#4e5f6a" />
      <Zig x={x + 70 - gap} y1={y - 12} y2={y + 12} dir={1} n={5} />
      <rect x={x + 76} y={y - 12} width={36} height={24} rx="2" fill="url(#sk-steel)" stroke="#4e5f6a" />
      <Zig x={x + 76} y1={y - 12} y2={y + 12} dir={-1} n={5} />
    </g>
  )
  return (
    <F h={330} view="Detail · where the connection is lost" scale="magnified, schematic">
      <Pn x={12} y={26} w={224} h={112} t="Clutch engaged" tc={C.emerald} ok />
      {clutch(48, 92, 0)}
      <T x={88} y={128} a="middle" s={10} c={C.dim}>sliding pinion</T>
      <T x={192} y={128} a="middle" s={10} c={C.dim}>winding pinion</T>
      <Pn x={244} y={26} w={224} h={112} t="Not engaging" tc={C.ruby} ok={false} />
      {clutch(280, 92, 14)}
      <Dim a={[336, 70]} b={[356, 70]} off={0} />
      <T x={346} y={62} a="middle" s={10.5} c={C.ruby}>gap</T>
      <T x={356} y={128} a="middle" s={10} c={C.dim}>teeth never meet: the crown spins</T>

      <Tag x={14} y={162}>On a manual wind, also</Tag>
      {/* barrel with broken spring */}
      <circle cx={80} cy={234} r={52} fill="rgba(201,162,76,0.10)" stroke={M.brassP} strokeWidth="3" />
      <path d={spiralD(80, 234, 10, 34, 3.2, 0)} fill="none" stroke={C.steel} strokeWidth="1.6" />
      <path d={`M${fx(pol(80, 234, 40, 80))} A40 40 0 0 1 ${fx(pol(80, 234, 46, 200))}`} fill="none" stroke={C.steel} strokeWidth="1.6" />
      <path d={`M${pol(80, 234, 34, 70)[0]} ${pol(80, 234, 34, 70)[1]} l4 -3 M${pol(80, 234, 40, 80)[0]} ${pol(80, 234, 40, 80)[1]} l-3 4`} stroke={C.ruby} strokeWidth="2" />
      <circle cx={pol(80, 234, 37, 75)[0]} cy={pol(80, 234, 37, 75)[1]} r={8} fill="none" stroke={C.ruby} strokeWidth="1.4" />
      <T x={146} y={210} s={11} c={C.text} w={600}>Mainspring broken</T>
      <T x={146} y={224} s={10.5} c={C.dim}>nothing to wind against</T>
      <T x={146} y={254} s={11} c={C.text} w={600}>Or ratchet slipping</T>
      <T x={146} y={268} s={10.5} c={C.dim}>teeth or click not holding</T>

      <rect x={316} y={160} width={152} height={130} rx="8" fill="rgba(255,255,255,0.025)" stroke={C.brass} strokeOpacity="0.6" />
      <Note x={326} y={182} head="Listen and feel" hc={C.brassHi} lines={['Turn slowly with the back', 'off. Click but no wind?', 'Look at the click and', 'ratchet. Silent and', 'free? Look at the clutch.']} c={C.text} s={10.5} lh={14} />
      <T x={14} y={314} s={10.5} c={C.dim}>Find the first part that stops turning. The fault sits just before it.</T>
    </F>
  )
}

function DgGritty() {
  const pts = [[128, 0], [128, 10], [56, 72], [216, 8], [204, 0]]
  pts.dry = false
  const dry = [[128, 0], [128, 10], [56, 72], [216, 8], [204, 0]]
  dry.dry = true
  return (
    <F h={312} view="Plan · grease on the sliding parts" scale="schematic">
      <Tag x={14} y={40} c={C.ruby}>Before: dried grease, dirt</Tag>
      <Keyless x0={14} y={96} pos="wind" greaseAt={dry} k={0.82} />
      <Tag x={254} y={40} c={C.emerald}>After: cleaned, fresh grease</Tag>
      <Keyless x0={246} y={96} pos="wind" greaseAt={pts} k={0.82} />
      <Lab p={[351, 104]} x={364} y={186} text="sliding pinion" a="start" />
      <Lab p={[292, 155]} x={276} y={196} text="yoke" />
      <Lab p={[413, 96]} x={466} y={60} text="lever pin" a="end" up />
      <T x={120} y={190} a="middle" s={10.5} c={C.ruby}>gritty, stiff</T>

      <Sep x1={12} y1={208} x2={468} y2={208} />
      <T x={14} y={230} s={10.5} c={C.text}>Clean the keyless works, then fresh grease where parts slide:</T>
      <T x={14} y={246} s={10.5} c={C.dim}>sliding pinion on the square, yoke, setting lever and its pin.</T>
      <Caution y={262} h={40} l1="Don’t power through a stiff crown." l2="Forcing it can shear the tiny setting-lever parts or strip a stem." />
    </F>
  )
}

function DgCrownOut() {
  return (
    <F h={334} view="Plan · the setting-lever screw" scale="schematic">
      <Pn x={12} y={26} w={226} h={170} t="Screw tight" tc={C.emerald} ok />
      <Keyless x0={20} y={104} pos="wind" yoke={false} k={0.78} />
      <T x={125} y={186} a="middle" s={10.5} c={C.text}>pin sits in the groove</T>
      <Pn x={244} y={26} w={224} h={170} t="Screw loose" tc={C.ruby} ok={false} />
      <Keyless x0={252} y={104} pos="wind" yoke={false} loose k={0.78} />
      <T x={356} y={186} a="middle" s={10.5} c={C.text}>pin drops out: the stem pulls free</T>
      <Lab p={[192, 146]} x={140} y={166} text="setting-lever screw" a="end" />
      <Lab p={[175, 104]} x={228} y={58} text="pin in the stem groove" a="end" up />

      <Bx x={12} y={208} w={226} h={56} l={['Fix', 're-seat the stem, then tighten', 'the setting lever a turn or two']} c={C.emerald} s={10.5} lh={14} />
      <rect x={246} y={208} width={222} height={84} rx="6" fill="rgba(208,168,79,0.07)" stroke={C.brass} strokeOpacity="0.6" />
      <T x={256} y={226} s={10.5} c={C.brassHi} w={600}>Stem won’t refit at all?</T>
      <Note x={256} y={242} lines={['The clutch is misaligned. Turn', 'the crown slowly anticlockwise', 'as you push it in.']} c={C.text} s={10.5} lh={14} />
      <rect x={20} y={278} width={26} height={36} rx="4" fill="url(#dg-knurl)" stroke="#55646e" />
      <Turn cx={33} cy={296} r={24} from={60} to={-60} c="brass" w={1.6} />
      <Arrow a={[90, 296]} b={[54, 296]} c="brass" w={1.8} />
      <T x={98} y={300} s={10.5} c={C.dim}>anticlockwise, pushing in</T>
    </F>
  )
}

function DgHandsCrownIn() {
  return (
    <F h={338} view="Comparison · the stem in running position" scale="schematic">
      <Pn x={12} y={26} w={456} h={88} t="Full depth, clean square" tc={C.emerald} ok />
      <Keyless x0={200} y={78} pos="wind" lever={false} yoke={false} k={0.75} />
      <Note x={24} y={68} lines={['sliding pinion', 'on winding: hands', 'stay put']} c={C.text} s={10.5} lh={14} />

      <Pn x={12} y={120} w={456} h={88} t="Stem cut too short" tc={C.ruby} ok={false} />
      <Keyless x0={200} y={172} pos="mid" lever={false} yoke={false} short k={0.75} />
      <Note x={24} y={162} lines={['doesn’t reach its', 'full depth: the', 'hands can turn']} c={C.text} s={10.5} lh={14} />

      <Pn x={12} y={214} w={456} h={88} t="Crown adhesive on the square" tc={C.ruby} ok={false} />
      <Keyless x0={200} y={266} pos="wind" lever={false} yoke={false} glue k={0.75} />
      <Note x={24} y={256} lines={['glue on the square:', 'the pinion can’t', 'slide freely']} c={C.text} s={10.5} lh={14} />
      <T x={14} y={318} s={10.5} c={C.dim}>A short stem can’t be lengthened: fit a new one. Then check each position clicks.</T>
      <Src x={466} y={333} a="end">both seen often by Witschi</Src>
    </F>
  )
}

function DgAutoWind() {
  return (
    <F h={334} view="Flow · crown winds, rotor doesn’t" scale="schematic">
      <Bx x={12} y={28} w={150} h={46} l={['Wind by hand first', 'does the click hold?']} c={C.brass} s={10.5} lh={14} />
      <Arrow a={[162, 51]} b={[180, 51]} c="emerald" w={1.4} />
      <Bx x={182} y={28} w={286} h={46} l={['Barrel is fine', 'the fault is in the automatic gears']} c={C.emerald} s={10.5} lh={14} />
      <Src x={14} y={92}>forum consensus, and the next two checks are forum reports</Src>

      {/* rotor over reversers, plan */}
      <circle cx={110} cy={196} r={74} fill="none" stroke={C.faint} strokeDasharray="4 3" />
      <path d={`M${fx(pol(110, 196, 74, 200))} A74 74 0 0 1 ${fx(pol(110, 196, 74, 340))} L${fx(pol(110, 196, 30, 340))} A30 30 0 0 0 ${fx(pol(110, 196, 30, 200))} Z`} fill="url(#sk-brassG)" opacity="0.85" />
      <circle cx={110} cy={196} r={10} fill="url(#sk-steel)" stroke="#4e5f6a" />
      <Turn cx={110} cy={196} r={84} from={250} to={330} c="brass" w={1.5} />
      <Gear cx={86} cy={232} r={16} n={16} />
      <Gear cx={130} cy={240} r={14} n={14} />
      <Lab p={[86, 232]} x={40} y={290} text="reversers" />
      <Lab p={[110, 196]} x={168} y={290} text="rotor bearing" />
      <T x={110} y={112} a="middle" s={10.5} c={C.dim}>rotor</T>

      <Row x={220} y={110} w={248} h={42} c={C.ruby} head="Rotor free, stem stiff" sub="suspect seized reversers" />
      <Row x={220} y={160} w={248} h={42} c={C.ruby} head="Rotor noisy or scrapes" sub="suspect a worn bearing or bent rotor" />
      <rect x={220} y={210} width={248} height={46} rx="6" fill="rgba(255,255,255,0.025)" stroke={C.steel} />
      <T x={230} y={228} s={10.5} c={C.text} w={600}>ETA 2824-2</T>
      <T x={230} y={244} s={10.5} c={C.dim}>new prelubricated originals, not a wash</T>
      <rect x={220} y={264} width={248} height={46} rx="6" fill="rgba(123,165,131,0.08)" stroke={C.emerald} />
      <T x={230} y={282} s={10.5} c={C.emerald} w={600}>Prove it on a winder or simulator</T>
      <T x={230} y={298} s={10.5} c={C.dim}>not by feel (Witschi)</T>
    </F>
  )
}

/* ================================================================== */
/* diag-noise · rattles, scraping and odd sounds                        */
/* ================================================================== */

// Automatic movement in plan from the back with its rotor at angle a (screen deg)
function AutoBack({ cx, cy, r, a = 200, rub }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="url(#dg-mov)" stroke={C.struct} />
      <circle cx={cx} cy={cy} r={r * 0.62} fill="none" stroke={C.line} />
      <path d={`M${fx(pol(cx, cy, r * 0.96, a))} A${r * 0.96} ${r * 0.96} 0 0 1 ${fx(pol(cx, cy, r * 0.96, a + 180))} L${fx(pol(cx, cy, r * 0.2, a + 180))} A${r * 0.2} ${r * 0.2} 0 0 0 ${fx(pol(cx, cy, r * 0.2, a))} Z`} fill="url(#sk-brassG)" stroke="#7d5f22" />
      {rub && <path d={`M${fx(pol(cx, cy, r * 0.93, a + 40))} A${r * 0.93} ${r * 0.93} 0 0 1 ${fx(pol(cx, cy, r * 0.93, a + 110))}`} fill="none" stroke="#fff6dc" strokeWidth="3" strokeLinecap="round" />}
      <circle cx={cx} cy={cy} r={r * 0.14} fill="url(#sk-steel)" stroke="#4e5f6a" />
      <Screw x={cx} y={cy} r={r * 0.08} />
    </g>
  )
}

// Side section: movement, rotor on its bearing, caseback above. tilt in degrees.
function RotorSide({ x, y, w = 200, tilt = 0, back = true, play }) {
  const cx = x + w / 2
  return (
    <g>
      <rect x={x} y={y + 30} width={w} height={26} rx="3" fill="url(#dg-mov)" stroke={C.struct} />
      <rect x={cx - 7} y={y + 14} width={14} height={16} fill="url(#sk-steel)" stroke="#4e5f6a" strokeWidth="0.6" />
      <g transform={`rotate(${tilt} ${cx} ${y + 16})`}>
        <rect x={x + 6} y={y + 10} width={w - 12} height={6} rx="2" fill="url(#sk-brassG)" stroke="#7d5f22" />
      </g>
      {back && <rect x={x - 6} y={y - 8} width={w + 12} height={8} rx="3" fill="url(#dg-cut)" stroke="#4e5f6a" />}
      {play && <Arrow a={[x + 10, y + 30]} b={[x + 10, y + 2]} c="brass" w={1.4} both />}
    </g>
  )
}

const Wave = ({ x, y, n = 3, c = C.steel, s = 1 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => (
      <path key={i} d={`M${x + i * 7 * s} ${y - (6 + i * 4) * s} q${(5 + i * 2) * s} ${(6 + i * 4) * s} 0 ${(12 + i * 8) * s}`} fill="none" stroke={c} strokeWidth="1.3" opacity={1 - i * 0.22} />
    ))}
  </g>
)

function DgRotorSwish() {
  return (
    <F h={290} view="Plan · the rotor spinning" scale="schematic">
      <AutoBack cx={130} cy={150} r={96} a={160} />
      <Turn cx={130} cy={150} r={110} from={190} to={300} c="brass" w={2} />
      <Turn cx={130} cy={150} r={110} from={20} to={110} c="brass" w={2} />
      <Wave x={248} y={150} n={3} />
      <Lab p={[130, 150]} x={56} y={274} text="rotor bearing" />
      <Lab p={[150, 90]} x={210} y={40} text="rotor" a="start" up />
      <Pn x={282} y={50} w={186} h={190} t="Normal" tc={C.emerald} c={C.emerald} ok />
      <Note x={292} y={84} lines={['A soft whirring as you', 'move the watch is the', 'rotor spinning on its', 'bearing to wind the', 'mainspring.']} c={C.text} s={10.5} lh={15} />
      <T x={292} y={180} s={11} c={C.emerald} w={600}>Nothing to fix.</T>
      <T x={292} y={200} s={10.5} c={C.dim}>Next step: when a loud</T>
      <T x={292} y={214} s={10.5} c={C.dim}>rotor does matter.</T>
    </F>
  )
}

function DgLoudRotor() {
  return (
    <F h={330} view="Inspection · when rotor noise matters" scale="schematic, play exaggerated">
      <Tag x={14} y={40}>Noise matters when it comes with</Tag>
      {['the sound changing', 'grit', 'poor winding', 'rotor play'].map((t, i) => (
        <g key={t}>
          <rect x={12 + i * 115} y={48} width={109} height={26} rx="5" fill="rgba(194,88,99,0.08)" stroke={C.ruby} strokeOpacity="0.6" />
          <T x={66 + i * 115} y={65} a="middle" s={10.5} c={C.text}>{t}</T>
        </g>
      ))}

      <Pn x={12} y={88} w={226} h={150} t="1 · Rock it gently" />
      <RotorSide x={36} y={150} w={180} tilt={-4} back={false} play />
      <Turn cx={126} cy={166} r={52} from={-60} to={-20} c="brass" w={1.4} />
      <T x={125} y={226} a="middle" s={10.5} c={C.text}>feel for play at the rim</T>
      <Pn x={244} y={88} w={224} h={150} t="2 · Look for a bright rub" />
      <circle cx={306} cy={168} r={48} fill="url(#sk-steel)" stroke="#4e5f6a" />
      <circle cx={306} cy={168} r={40} fill="#8d9ca6" />
      <path d={`M${fx(pol(306, 168, 36, 200))} A36 36 0 0 1 ${fx(pol(306, 168, 36, 260))}`} fill="none" stroke="#fff6dc" strokeWidth="3" strokeLinecap="round" />
      <T x={306} y={228} a="middle" s={10.5} c={C.text}>inside the caseback</T>
      <AutoBack cx={414} cy={168} r={40} a={200} rub />
      <T x={414} y={228} a="middle" s={10.5} c={C.text}>rotor edge</T>

      <rect x={12} y={250} width={456} height={64} rx="6" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <T x={22} y={270} s={11} c={C.text} w={600}>Some rotors are simply loud.</T>
      <T x={22} y={286} s={10.5} c={C.dim}>One brand fitting Miyota 82xx movements calls the noise a</T>
      <T x={22} y={300} s={10.5} c={C.dim}>characteristic that a service won’t silence.</T>
    </F>
  )
}

function DgScrape() {
  return (
    <F h={316} view="Section · rotor, bearing and caseback" scale="clearances exaggerated">
      <Pn x={12} y={26} w={226} h={170} t="Bearing sound" tc={C.emerald} ok />
      <RotorSide x={34} y={92} w={182} />
      <Dim a={[200, 84]} b={[200, 100]} off={0} />
      <T x={196} y={74} a="end" s={10.5} c={C.emerald}>clear of the back</T>
      <T x={125} y={176} a="middle" s={10.5} c={C.text}>rotor runs level</T>

      <Pn x={244} y={26} w={224} h={170} t="Worn bearing" tc={C.ruby} ok={false} />
      <RotorSide x={264} y={92} w={182} tilt={-3.4} />
      <circle cx={276} cy={86} r={9} fill="none" stroke={C.ruby} strokeWidth="1.6" />
      <T x={290} y={74} s={10.5} c={C.ruby}>weight touches the back</T>
      <circle cx={355} cy={114} r={10} fill="none" stroke={C.brassHi} strokeDasharray="2 2" />
      <T x={356} y={176} a="middle" s={10.5} c={C.text}>bearing play lets it tilt</T>

      <Tag x={14} y={220}>What you hear and find</Tag>
      <Wave x={24} y={250} n={3} c={C.ruby} />
      <Note x={58} y={244} lines={['a gritty scrape as', 'the rotor turns']} c={C.text} s={10.5} lh={14} />
      <circle cx={232} cy={252} r={20} fill="url(#sk-steel)" stroke="#4e5f6a" />
      <path d={`M${fx(pol(232, 252, 15, 190))} A15 15 0 0 1 ${fx(pol(232, 252, 15, 300))}`} fill="none" stroke="#fff6dc" strokeWidth="2" />
      <T x={260} y={248} s={10.5} c={C.text}>score marks</T>
      <T x={260} y={262} s={10.5} c={C.text}>on the back</T>
      <rect x={350} y={226} width={118} height={58} rx="6" fill="rgba(194,88,99,0.09)" stroke={C.ruby} />
      <Note x={360} y={244} lines={['Fix it before it', 'scores the', 'movement.']} c={C.text} s={10.5} lh={14} />
      <T x={14} y={304} s={10.5} c={C.dim}>Usual cause: a worn rotor bearing letting the weight touch the caseback.</T>
    </F>
  )
}

function DgRattle() {
  return (
    <F h={316} view="Inspection · a rattle when shaken" scale="schematic">
      <Tag x={14} y={40}>It can be</Tag>
      <Pn x={12} y={48} w={148} h={128} />
      <AutoBack cx={70} cy={112} r={42} a={230} />
      <path d={`M${fx(pol(70, 112, 40, 250))} l8 -12`} stroke={C.ruby} strokeWidth="1.4" strokeDasharray="3 2" />
      <T x={86} y={166} a="middle" s={10.5} c={C.text}>a detached rotor</T>
      <Pn x={166} y={48} w={148} h={128} />
      <rect x={180} y={74} width={120} height={68} rx="6" fill="url(#dg-mov)" stroke={C.struct} />
      <g transform="translate(244 104) rotate(-30)">
        <rect x={-12} y={-3} width={16} height={6} fill="#c5ced4" stroke="#3e4a52" strokeWidth="0.6" />
        <circle cx={6} cy={0} r={6} fill="#c5ced4" stroke="#3e4a52" strokeWidth="0.6" />
        <line x1={6} y1={-5} x2={6} y2={5} stroke="#2c353b" strokeWidth="1.3" />
      </g>
      <circle cx={208} cy={124} r={5} fill={C.ground} stroke={C.faint} />
      <T x={240} y={166} a="middle" s={10.5} c={C.text}>a loose screw</T>
      <Pn x={320} y={48} w={148} h={128} />
      <rect x={334} y={74} width={120} height={68} rx="6" fill="url(#dg-mov)" stroke={C.struct} />
      <path d="M368 110 l10 -6 l4 6 l-8 8 Z M392 120 l12 -4 l2 6 Z" fill="url(#sk-steel)" stroke="#4e5f6a" />
      <T x={394} y={166} a="middle" s={10.5} c={C.text}>a broken part adrift</T>

      <Tag x={14} y={202} c={C.ruby}>What it can do</Tag>
      <Gear cx={52} cy={250} r={22} n={24} />
      <Gear cx={88} cy={262} r={12} n={10} />
      <circle cx={72} cy={250} r={4} fill="#c5ced4" stroke="#3e4a52" />
      <T x={110} y={246} s={10.5} c={C.text}>jam the train</T>
      <Balance cx={232} cy={254} r={24} />
      <circle cx={256} cy={240} r={4} fill="#c5ced4" stroke="#3e4a52" />
      <T x={266} y={250} s={10.5} c={C.text}>damage the</T>
      <T x={266} y={264} s={10.5} c={C.text}>balance</T>
      <rect x={344} y={214} width={124} height={76} rx="6" fill="rgba(194,88,99,0.09)" stroke={C.ruby} />
      <Note x={354} y={234} head="Stop wearing it" hc={C.ruby} lines={['Open it and find', 'the loose piece', 'first.']} c={C.text} s={10.5} lh={14} />
      <T x={14} y={306} s={10.5} c={C.dim}>A loose part rolling round the movement does damage every time it moves.</T>
    </F>
  )
}

function DgBuzz() {
  return (
    <F h={300} view="Plan · the quartz stepping motor" scale="schematic">
      {/* coil, stator, rotor */}
      <rect x={30} y={70} width={150} height={40} rx="4" fill={M.copper} stroke="#7d4d24" />
      {Array.from({ length: 22 }, (_, i) => <line key={i} x1={36 + i * 6.5} y1={70} x2={36 + i * 6.5} y2={110} stroke="#7d4d24" strokeWidth="0.7" />)}
      <path d="M20 80 L20 160 Q20 176 40 176 L210 176 Q240 176 240 150 L240 140 M20 100 L30 100 M180 100 L200 100 Q240 100 240 120" fill="none" stroke="#9aa9b2" strokeWidth="9" strokeLinejoin="round" />
      <circle cx={240} cy={132} r={20} fill="none" stroke="#9aa9b2" strokeWidth="6" />
      <circle cx={240} cy={132} r={12} fill={M.magnet} stroke={C.text} strokeWidth="0.6" />
      <line x1={240} y1={120} x2={240} y2={144} stroke={C.text} strokeWidth="1" />
      <T x={236} y={130} a="end" s={10} c={C.text} w={700}>N</T>
      <Lab p={[105, 90]} x={105} y={44} text="coil" up />
      <Lab p={[240, 132]} x={274} y={206} text="rotor magnet" a="start" />
      <Lab p={[120, 176]} x={120} y={210} text="stator" />
      <Wave x={130} y={132} n={2} c={C.ruby} s={0.8} />
      <Lab p={[180, 70]} x={230} y={56} text="loose coil?" a="start" up c={C.ruby} />

      <Pn x={320} y={30} w={148} h={150} t="Faint buzz" tc={C.ruby} />
      <Note x={330} y={62} lines={['a failing motor', 'or a loose coil']} c={C.text} s={10.5} lh={14} />
      <T x={330} y={110} s={10.5} c={C.dim}>usually a sign the</T>
      <T x={330} y={124} s={10.5} c={C.dim}>module is near the</T>
      <T x={330} y={138} s={10.5} c={C.dim}>end of its life</T>
      <Bx x={12} y={232} w={456} h={44} l={['Near the end of its life', 'expect the module to need replacing']} c={C.brass} s={10.5} lh={14} />
    </F>
  )
}

function DgListen() {
  const tx = 14
  const ty = 52
  const tw = 200
  const th = 70
  const r = rng(5)
  const knock = []
  for (let i = 0; i < 60; i++) {
    const t = ((i + 0.5) / 60) * SEC
    knock.push([t, 1.2 + (r() - 0.5) * 0.15])
    knock.push([t, -1.2 + (r() - 0.5) * 0.15])
    knock.push([t, 3.2 + (r() - 0.5) * 0.3])
  }
  return (
    <F h={336} view="Test · listen through the timegrapher" scale="schematic">
      <Tag x={14} y={42}>A doubled “tic-tac”: knocking</Tag>
      <Trace x={tx} y={ty} w={tw} h={th} series={[{ pts: knock, c: TICK, r: 1.1 }]} />
      <Readout x={tx} y={ty + th + 8} w={96} label="amplitude" value="> ≈330" unit="°" c={C.ruby} />
      <Note x={tx + 106} y={ty + th + 20} lines={['too high: the fork', 'horn hits the pin']} c={C.text} s={10.5} lh={13} />

      {/* fork horn touching impulse pin, plan detail */}
      <Pn x={226} y={30} w={242} h={124} t="Knock, in close-up" />
      <Fork x={274} y={100} k={0.9} rot={90} />
      <Roller cx={346} cy={100} r={18} pin={140} />
      <circle cx={333} cy={110} r={9} fill="none" stroke={C.ruby} strokeWidth="1.5" />
      <T x={274} y={142} a="middle" s={10} c={C.dim}>fork</T>
      <T x={346} y={142} a="middle" s={10} c={C.dim}>roller</T>
      <T x={374} y={70} s={10.5} c={C.text}>swings too far:</T>
      <T x={374} y={84} s={10.5} c={C.text}>the pin hits</T>
      <T x={374} y={98} s={10.5} c={C.text}>the horn</T>

      <Bx x={12} y={174} w={150} h={52} l={['First: check the', 'lift angle setting', 'a wrong one reads high']} c={C.brass} s={10.5} lh={14} />
      <Arrow a={[162, 200]} b={[176, 200]} c="brass" w={1.4} />
      <Bx x={178} y={174} w={290} h={52} l={['Real knocking: Witschi’s remedy is a new', 'mainspring, pallet stone or escape wheel.', 'Secondhand? Check for too strong a spring first.']} c={C.ruby} s={10.5} lh={14} />
      <rect x={12} y={236} width={456} height={46} rx="6" fill="rgba(255,255,255,0.025)" stroke={C.steel} />
      <Wave x={28} y={259} n={3} />
      <T x={58} y={254} s={11} c={C.text} w={600}>A scratching sound</T>
      <T x={58} y={270} s={10.5} c={C.dim}>usually the hairspring touching the regulator pins or stud</T>
      <Caution y={292} h={36} l1="Don’t keep running a watch that’s knocking." l2="Let it down and find the cause." />
    </F>
  )
}

/* ================================================================== */
/* diag-handfriction · hands slip or set stiffly                        */
/* ================================================================== */

// Cannon pinion in section on the centre arbor. cx centre, y top. fit: ok | loose | tight
function Cannon({ cx, y, fit = 'ok', arbor = true, broach, dent }) {
  const h = 130
  const pinch = fit === 'loose' ? 0 : fit === 'tight' ? 3 : 1.6
  const bore = 7
  return (
    <g>
      {arbor && <rect x={cx - bore + (fit === 'loose' ? 1.5 : 0)} y={y + 10} width={(bore - (fit === 'loose' ? 1.5 : 0)) * 2} height={h} fill="url(#sk-steelH)" stroke="#4e5f6a" strokeWidth="0.6" />}
      {broach && <path d={`M${cx - bore} ${y - 30} L${cx + bore} ${y - 30} L${cx + 2} ${y + h + 10} L${cx - 2} ${y + h + 10} Z`} fill="url(#sk-steelH)" stroke="#4e5f6a" strokeWidth="0.6" />}
      {[-1, 1].map((sd) => {
        const xo = cx + sd * bore
        const wall = (dx) => cx + sd * (bore + dx)
        return (
          <path
            key={sd}
            d={`M${xo} ${y} L${wall(5)} ${y} L${wall(5)} ${y + 60} L${wall(3) - sd * pinch} ${y + 70} L${wall(3) - sd * pinch} ${y + 84} L${wall(5)} ${y + 94} L${wall(5)} ${y + 104} L${wall(14)} ${y + 104} L${wall(14)} ${y + h} L${xo} ${y + h} L${xo} ${y + 84} L${xo - sd * pinch} ${y + 77} L${xo} ${y + 70} Z`}
            fill="url(#dg-cut)"
            stroke="#4e5f6a"
            strokeWidth="0.7"
          />
        )
      })}
      {dent && <circle cx={cx + bore + 3} cy={y + 77} r={4} fill="none" stroke={C.brassHi} strokeWidth="1.4" />}
    </g>
  )
}

function DgLooseFriction() {
  return (
    <F h={316} view="Section · the cannon pinion’s grip" scale="schematic, magnified">
      <Pn x={12} y={26} w={140} h={196} t="Right grip" tc={C.emerald} ok />
      <Cannon cx={82} y={58} />
      <Lab p={[92, 136]} x={128} y={110} text="waist" a="start" up />
      <T x={82} y={214} a="middle" s={10} c={C.dim}>grips the arbor</T>
      <Pn x={160} y={26} w={140} h={196} t="Loose" tc={C.ruby} ok={false} />
      <Cannon cx={230} y={58} fit="loose" />
      <T x={230} y={214} a="middle" s={10} c={C.dim}>slips on the arbor</T>
      <Lab p={[232, 150]} x={268} y={110} text="centre arbor" up />

      <rect x={310} y={26} width={158} height={196} rx="8" fill="rgba(194,88,99,0.07)" stroke={C.ruby} strokeOpacity="0.7" />
      <Tag x={320} y={44} c={C.ruby}>Signs it’s loose</Tag>
      {[
        ['hands jump', 'with a knock'],
        ['seems to suddenly', 'gain, lose or stop'],
        ['almost no resistance', 'when setting'],
      ].map(([a, b], i) => (
        <g key={a}>
          <Num x={328} y={70 + i * 50} n={i + 1} r={7} c={C.ruby} />
          <T x={340} y={68 + i * 50} s={10.5} c={C.text}>{a}</T>
          <T x={340} y={82 + i * 50} s={10.5} c={C.text}>{b}</T>
        </g>
      ))}
      <T x={320} y={212} s={10} c={C.faint}>signs, not a ranked order</T>
      <Bx x={12} y={236} w={456} h={44} l={['The more common of the two faults', 'tight friction is the next step']} c={C.brass} s={10.5} lh={14} />
      <T x={14} y={302} s={10.5} c={C.dim}>The cannon pinion carries the minute hand. Its friction lets you set the hands.</T>
    </F>
  )
}

function DgTightFriction() {
  return (
    <F h={322} view="Test · turn the hands slowly backwards" scale="schematic">
      <Face cx={86} cy={110} r={64} h={250} m={150} s={300} date lugs={false} />
      <Turn cx={86} cy={110} r={78} from={170} to={120} c="brass" w={2} />
      <T x={86} y={210} a="middle" s={10.5} c={C.text}>backwards, slowly</T>
      <T x={86} y={224} a="middle" s={10.5} c={C.dim}>watch the seconds hand</T>
      <rect x={12} y={238} width={150} height={52} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <Note x={22} y={256} lines={['Well clear of the date', 'change: turning back', 'through it can damage it.']} c={C.text} s={10} lh={12.5} />

      <Tag x={180} y={40}>On a watch with no hacking</Tag>
      <Row x={180} y={50} w={288} h={44} ok={false} head="Seconds hand stops instantly" sub="friction too tight: setting is stiff" />
      <Row x={180} y={102} w={288} h={44} ok head="Falters a little" sub="the friction is right" />
      <Row x={180} y={154} w={288} h={44} ok={false} head="Not affected at all" sub="friction too loose" />
      <Src x={180} y={216}>“falters a little” is the pass mark used in Prove the fix</Src>
      <rect x={180} y={232} width={288} height={58} rx="6" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <Note x={190} y={250} lines={['The drag of the cannon pinion reaches the train.', 'Too much drag stops it; none at all means', 'the pinion is slipping freely.']} c={C.dim} s={10.5} lh={14} />
      <T x={14} y={312} s={10} c={C.faint}>Seconds hand stopping instantly = too tight. Not affected = too loose.</T>
    </F>
  )
}

function DgDateLoad() {
  const X = (h) => 40 + (h - 18) * 46
  return (
    <F h={322} view="Test · time across the date change" scale="schematic">
      <line x1={X(18)} y1={110} x2={X(26)} y2={110} stroke={C.struct} strokeWidth="2" />
      {[18, 20, 22, 24, 26].map((h) => (
        <g key={h}>
          <line x1={X(h)} y1={104} x2={X(h)} y2={116} stroke={C.faint} />
          <T x={X(h)} y={132} a="middle" s={10} c={C.faint} mono>{`${h % 24}:00`.padStart(5, '0')}</T>
        </g>
      ))}
      <rect x={X(23.6)} y={92} width={X(24.4) - X(23.6)} height={36} fill="rgba(194,88,99,0.15)" />
      <T x={X(24)} y={84} a="middle" s={10.5} c={C.ruby}>date change</T>
      <circle cx={X(20)} cy={110} r={6} fill={C.brassHi} />
      <circle cx={X(25.4)} cy={110} r={6} fill={C.brassHi} />
      <Num x={X(20)} y={60} n={1} r={8} />
      <T x={X(20) + 12} y={64} s={10.5} c={C.text}>note the time</T>
      <T x={X(20) + 12} y={48} s={10} c={C.dim}>a few hours before</T>
      <Num x={X(25.4) - 70} y={60} n={2} r={8} />
      <T x={X(25.4) - 58} y={64} s={10.5} c={C.text}>again, after</T>
      <line x1={X(20)} y1={68} x2={X(20)} y2={104} stroke={C.struct} strokeDasharray="2 2" />
      <line x1={X(25.4)} y1={68} x2={X(25.4)} y2={104} stroke={C.struct} strokeDasharray="2 2" />

      <Row x={12} y={150} w={456} h={44} c={C.ruby} head="Drops minutes across the change, timegrapher rate normal" sub="treat the friction as too loose, even if setting feels normal" />
      <Row x={12} y={202} w={456} h={44} c={C.brass} head="Check the date work for stiffness too" sub="a stiff calendar adds to the load on the cannon pinion" />
      <rect x={12} y={256} width={456} height={52} rx="6" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <Note x={22} y={274} lines={['Feels fine when you set it, yet slips under load: the date work pushes back.', 'Hands losing minutes at the change is a forum-reported sign.']} c={C.dim} s={10.5} lh={15} />
    </F>
  )
}

function DgTighten() {
  return (
    <F h={330} view="Section · denting the waist, bore supported" scale="schematic">
      {/* V-block */}
      <path d="M40 250 L40 200 L100 200 L130 232 L160 200 L220 200 L220 250 Z" fill="url(#dg-cut)" stroke="#4e5f6a" />
      <T x={130} y={264} a="middle" s={10.5} c={C.dim}>V-block</T>
      {/* cannon pinion lying in the V, seen end-on */}
      <circle cx={130} cy={214} r={16} fill={M.brassP} stroke={M.brassD} />
      <circle cx={130} cy={214} r={6} fill="url(#sk-steelH)" stroke="#4e5f6a" />
      <T x={176} y={194} s={10} c={C.dim}>pinion in the V</T>
      {/* punch */}
      <rect x={124} y={90} width={12} height={84} fill="url(#sk-steelH)" stroke="#4e5f6a" />
      <path d="M124 174 L136 174 L132 196 L128 196 Z" fill="url(#sk-steel)" stroke="#4e5f6a" />
      <rect x={116} y={60} width={28} height={30} rx="3" fill="url(#dg-knurl)" />
      <Arrow a={[160, 120]} b={[160, 160]} c="brass" w={1.8} />
      <T x={168} y={140} s={10.5} c={C.text}>light press</T>
      <T x={150} y={56} a="middle" s={10.5} c={C.dim}>punch</T>
      <T x={130} y={282} a="middle" s={10.5} c={C.text}>the cannon-pinion tool, end view</T>

      {/* side section with broach */}
      <Cannon cx={330} y={74} arbor={false} broach dent />
      <Lab p={[330, 52]} x={362} y={48} text="smoothing broach" a="start" up />
      <T x={366} y={62} s={10} c={C.dim}>supports the bore</T>
      <Lab p={[342, 151]} x={380} y={170} text="small dent here" a="start" />
      <T x={380} y={186} s={10} c={C.dim}>in the waisted section</T>
      <T x={330} y={236} a="middle" s={10.5} c={C.dim}>side section</T>
      <Bx x={258} y={248} w={210} h={38} l={['Re-test, a little at a time']} c={C.emerald} />
      <Caution y={296} h={30} l1="Support the bore or you’ll crush it. Over-tightening can snap the arbor inside." />
    </F>
  )
}

function DgEase() {
  return (
    <F h={290} view="Decision · easing a tight pinion" scale="schematic">
      <Bx x={170} y={28} w={140} h={40} l={['Tight cannon pinion']} c={C.brass} />
      <Arrow d="M200 68 Q160 92 124 100" c="brass" w={1.4} />
      <Arrow d="M280 68 Q320 92 356 100" c="brass" w={1.4} />
      <Pn x={12} y={102} w={220} h={176} t="Often just dry" tc={C.emerald} />
      <Cannon cx={70} y={132} fit="tight" />
      <circle cx={70} cy={210} r={5} fill={M.oil} opacity="0.85" />
      <Note x={110} y={150} lines={['Clean it and', 'lightly lubricate.', '', 'Then repeat the', 'friction test.']} c={C.text} s={10.5} lh={14} />
      <Pn x={248} y={102} w={220} h={176} t="Worn or distorted" tc={C.ruby} />
      <g transform="rotate(4 306 196)">
        <Cannon cx={306} y={132} fit="tight" arbor={false} />
      </g>
      <Note x={346} y={150} lines={['Replace it,', 'don’t fight it.']} c={C.text} s={10.5} lh={14} />
      <Note x={346} y={210} lines={['A distorted part', 'won’t hold an', 'even friction.']} c={C.dim} s={10.5} lh={14} />
    </F>
  )
}

function DgProveFix() {
  return (
    <F h={326} view="Checklist · prove the friction fix" scale="schematic">
      {[
        ['Refit the motion work', 'and repeat the tests'],
        ['Set the hands', 'smooth, a light even drag'],
        ['Turn back, slowly', 'clear of the date change'],
        ['Run through a change', 'compare before and after'],
      ].map(([a, b], i) => (
        <g key={a}>
          <Stage x={12 + (i % 2) * 232} y={30 + Math.floor(i / 2) * 52} w={224} n={i + 1} head={a} sub={b} />
        </g>
      ))}
      <Tag x={14} y={152}>Step 3 · the seconds hand should</Tag>
      {[
        ['stop dead', false],
        ['falter a little', true],
        ['ignore you', false],
      ].map(([t, ok], i) => (
        <g key={t}>
          <rect x={12 + i * 154} y={160} width={146} height={60} rx="6" fill="rgba(255,255,255,0.025)" stroke={ok ? C.emerald : C.ruby} strokeOpacity="0.7" />
          <Verdict x={30 + i * 154} y={190} ok={ok} r={8} />
          <T x={46 + i * 154} y={194} s={11} c={C.text} w={600}>{t}</T>
        </g>
      ))}
      <rect x={12} y={232} width={456} height={80} rx="6" fill="rgba(194,88,99,0.07)" stroke={C.ruby} strokeOpacity="0.8" />
      <T x={22} y={252} s={11} c={C.ruby} w={600}>Still slips?</T>
      <T x={22} y={268} s={10.5} c={C.text}>Don’t keep nipping it. Use a light touch, and a pinion that won’t</T>
      <T x={22} y={282} s={10.5} c={C.text}>hold should be replaced.</T>
      <Src x={22} y={300}>forum advice</Src>
    </F>
  )
}

/* ================================================================== */
/* diag-magnetism · spot it and demagnetize                             */
/* ================================================================== */

// Demagnetizer box with plate and button
function Demag({ x, y, on }) {
  return (
    <g>
      <rect x={x} y={y} width={110} height={44} rx="6" fill="#2f4a6a" stroke="#86a7bd" />
      <rect x={x + 10} y={y - 6} width={72} height={8} rx="2" fill="#9db0bb" />
      <circle cx={x + 96} cy={y + 14} r={7} fill={on ? C.brassHi : '#55646e'} stroke={C.text} strokeWidth="0.8" />
      <T x={x + 46} y={y + 30} a="middle" s={10} c="#c9d8e2">demagnetizer</T>
    </g>
  )
}
// Field lines leaving a plate centred at cx, top y
function FieldLines({ cx, y, n = 3, k = 1, o = 0.7 }) {
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const r = (14 + i * 14) * k
        return <path key={i} d={`M${cx - r} ${y} A${r} ${r * 0.9} 0 0 1 ${cx + r} ${y}`} fill="none" stroke={C.steel} strokeDasharray="3 3" />
      })}
    </g>
  )
}

function DgMagSymptom() {
  const X = (d) => 40 + d * 40
  const Y = (v) => 150 - v * 1.1
  return (
    <F h={316} view="Chart · a sudden gain" scale="schematic">
      <line x1={X(0)} y1={Y(0)} x2={X(7)} y2={Y(0)} stroke={C.struct} />
      <line x1={X(0)} y1={Y(-20)} x2={X(0)} y2={Y(100)} stroke={C.struct} />
      {Array.from({ length: 8 }, (_, d) => <T key={d} x={X(d)} y={Y(0) + 34} a="middle" s={10} c={C.faint} mono>{`d${d}`}</T>)}
      <T x={X(0) - 6} y={Y(0) + 4} a="end" s={10} c={C.faint}>0</T>
      <T x={X(0) - 6} y={Y(90)} a="end" s={10} c={C.faint}>gain</T>
      <polyline points={[[0, 3], [1, 2], [2, 4], [3, 3], [3.2, 80], [4, 84], [5, 78], [6, 86], [7, 82]].map(([d, v]) => `${X(d)},${Y(v)}`).join(' ')} fill="none" stroke={C.ruby} strokeWidth="2.2" />
      <line x1={X(3.1)} y1={Y(-12)} x2={X(3.1)} y2={Y(100)} stroke={C.brass} strokeDasharray="3 3" />
      <T x={X(3.1) + 6} y={Y(0) + 16} s={10.5} c={C.brassHi}>near a magnet</T>
      <T x={X(3.6)} y={Y(108)} s={10.5} c={C.ruby} w={600}>many seconds to</T>
      <T x={X(3.6)} y={Y(108) + 14} s={10.5} c={C.ruby} w={600}>minutes a day</T>
      <T x={X(0.2)} y={Y(14)} s={10.5} c={C.emerald}>steady</T>

      <Pn x={330} y={30} w={138} h={148} t="Inside" />
      <HSpring cx={399} cy={104} r={44} stuck />
      <Note x={340} y={160} lines={['coils cling together']} c={C.text} s={10.5} lh={14} />

      <Tag x={14} y={218}>It can also show as</Tag>
      {[['a sudden big gain', 'with no other change', C.ruby], ['an erratic rate', '', C.brass], ['a watch that stops', 'in bad cases', C.steel]].map(([a, b, c], i) => (
        <g key={a}>
          <rect x={12 + i * 154} y={226} width={148} height={44} rx="6" fill="rgba(255,255,255,0.025)" stroke={c} strokeOpacity="0.7" />
          <T x={22 + i * 154} y={b ? 244 : 252} s={11} c={C.text} w={600}>{a}</T>
          {b && <T x={22 + i * 154} y={259} s={10} c={C.dim}>{b}</T>}
        </g>
      ))}
      <T x={14} y={296} s={10.5} c={C.text}>A mechanical watch like this is magnetised until proven otherwise.</T>
    </F>
  )
}

function DgCompass() {
  const tx = 270
  const ty = 196
  const tw = 196
  const th = 80
  return (
    <F h={316} view="Test · watch near a compass" scale="schematic">
      <Compass cx={110} cy={120} r={50} ang={-60} ghost={-90} />
      <T x={110} y={190} a="middle" s={10.5} c={C.text}>needle swings</T>
      <T x={110} y={204} a="middle" s={10} c={C.dim}>a phone compass app works</T>
      <g transform="translate(220 100)">
        <rect x={-6} y={-24} width={12} height={10} fill="url(#sk-top)" />
        <rect x={-6} y={14} width={12} height={10} fill="url(#sk-top)" />
        <circle r={18} fill="url(#sk-steel)" stroke="#4e5f6a" />
        <circle r={14} fill={M.dialDark} />
      </g>
      <Arrow a={[262, 100]} b={[244, 100]} c="brass" w={1.8} />
      <T x={268} y={96} s={10.5} c={C.text}>bring it slowly</T>
      <T x={268} y={110} s={10.5} c={C.text}>closer, then turn it</T>
      <Turn cx={220} cy={100} r={28} from={200} to={330} c="brass" w={1.4} />
      <T x={268} y={136} s={10.5} c={C.ruby} w={600}>deflects or swings:</T>
      <T x={268} y={150} s={10.5} c={C.ruby} w={600}>magnetised</T>

      <Tag x={14} y={238}>On a timegrapher</Tag>
      <Note x={14} y={258} lines={['the usual tell-tale: a sudden', 'large gain, often with clean,', 'steep lines']} c={C.text} s={10.5} lh={14} />
      <Trace x={tx} y={ty} w={tw} h={th} series={[{ pts: sample(line(120 * 60 / 60, 0), { n: 120, jitter: 0.06, wrapIt: true }), c: TICK, r: 1.1 }, { pts: sample(line(120, 0.9), { n: 120, jitter: 0.06, wrapIt: true }), c: TOCK, r: 1.1 }]} />
      <T x={tx + tw} y={ty - 6} a="end" s={10} c={C.faint}>steep, clean lines</T>
    </F>
  )
}

function DgMagSources() {
  const items = [
    ['fridge magnets', (x, y) => <g><rect x={x - 18} y={y - 22} width={36} height={44} rx="3" fill="#d8d0bd" /><rect x={x - 8} y={y - 12} width={16} height={10} rx="2" fill={M.magnet} /></g>],
    ['cabinet and bag clasps', (x, y) => <g><rect x={x - 22} y={y - 14} width={44} height={28} rx="6" fill="#6f4b27" /><rect x={x - 8} y={y - 4} width={16} height={10} rx="3" fill="#c5ced4" /></g>],
    ['speakers', (x, y) => <g><rect x={x - 18} y={y - 24} width={36} height={48} rx="4" fill="#2b2620" stroke={C.dim} /><circle cx={x} cy={y + 6} r={12} fill="#3a342c" stroke={C.dim} /><circle cx={x} cy={y - 14} r={5} fill="#3a342c" stroke={C.dim} /></g>],
    ['tablet, laptop covers', (x, y) => <g><rect x={x - 26} y={y - 18} width={52} height={36} rx="3" fill="#2f4a5a" stroke={C.steel} /><rect x={x - 26} y={y - 18} width={8} height={36} fill="#4b6b7e" /></g>],
    ['magnetic phone mounts', (x, y) => <g><rect x={x - 12} y={y - 24} width={24} height={44} rx="5" fill="#2b2620" stroke={C.dim} /><circle cx={x} cy={y} r={7} fill={M.magnet} opacity="0.8" /></g>],
    ['phone chargers', (x, y) => <g><circle cx={x} cy={y} r={20} fill="#e9e1c6" stroke={C.dim} /><circle cx={x} cy={y} r={8} fill="none" stroke={M.magnet} strokeWidth="2" /></g>],
  ]
  return (
    <F h={300} view="Map · where magnetism comes from" scale="schematic">
      {items.map(([t, draw], i) => {
        const x = 70 + (i % 3) * 116
        const y = 80 + Math.floor(i / 3) * 100
        return (
          <g key={t}>
            {draw(x, y)}
            <FieldLines cx={x} y={y - 26} n={2} k={0.9} o={0.5} />
            <T x={x} y={y + 44} a="middle" s={10.5} c={C.text}>{t}</T>
          </g>
        )
      })}
      <rect x={366} y={30} width={102} height={200} rx="8" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <Note x={376} y={52} lines={['A watch picks', 'it up silently,', 'just by sitting', 'near one.', '', 'No knock, no', 'warning: it', 'just starts', 'gaining.']} c={C.dim} s={10.5} lh={14} />
      <T x={14} y={276} s={10.5} c={C.text}>The usual culprits. Keep a mechanical watch away from them.</T>
    </F>
  )
}

function DgDemag() {
  const X = (d) => 60 + d * 380
  return (
    <F h={330} view="Sequence · demagnetising" scale="schematic">
      <Demag x={24} y={110} on />
      <FieldLines cx={70} y={104} n={4} />
      <rect x={58} y={96} width={26} height={8} rx="3" fill="url(#sk-steel)" opacity="0.4" />
      <rect x={176} y={70} width={26} height={8} rx="3" fill="url(#sk-steel)" opacity="0.65" />
      <rect x={300} y={44} width={26} height={8} rx="3" fill="url(#sk-steel)" />
      <Arrow d="M90 92 Q200 60 296 48" c="brass" w={2} />
      <T x={340} y={50} s={10.5} c={C.text}>about arm’s length</T>
      <T x={340} y={64} s={10.5} c={C.text}>then release</T>
      {[
        ['On or beside it', 48],
        ['Press and hold', 158],
        ['Draw it away', 262],
        ['Then release', 374],
      ].map(([t, x], i) => (
        <g key={t}>
          <Num x={x - 34} y={182} n={i + 1} r={8} />
          <T x={x - 22} y={186} s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
      {/* field strength vs distance */}
      <Tag x={14} y={214}>Field on the watch as it leaves</Tag>
      <line x1={X(0)} y1={276} x2={X(1)} y2={276} stroke={C.struct} />
      <line x1={X(0)} y1={226} x2={X(0)} y2={276} stroke={C.struct} />
      <path d={`M${X(0)} 232 C${X(0.15)} 232 ${X(0.25)} 270 ${X(1)} 275`} fill="none" stroke={C.steel} strokeWidth="2" />
      <T x={X(0.4)} y={252} s={10.5} c={C.dim}>diminishing field cancels the magnetism</T>
      <T x={X(1)} y={290} a="end" s={10} c={C.faint}>distance</T>
      <Caution y={296} h={30} l1="Draw it well away before you release: switching off on the plate can leave it magnetised." />
    </F>
  )
}

function DgVerify() {
  const before = sample(line(120, 0), { n: 110, jitter: 0.06, wrapIt: true })
  const after = sample(line(4, 0), { n: 110, jitter: 0.06 })
  return (
    <F h={312} view="Test · verify the cure" scale="schematic">
      <Pn x={12} y={26} w={150} h={150} t="Compass" tc={C.emerald} ok />
      <Compass cx={87} cy={104} r={40} ang={-90} />
      <T x={87} y={164} a="middle" s={10.5} c={C.text}>no deflection</T>
      <Tag x={176} y={42}>Timegrapher, before</Tag>
      <Trace x={176} y={50} w={136} h={60} series={[{ pts: before, c: TICK, r: 1 }]} />
      <Tag x={330} y={42} c={C.emerald}>After</Tag>
      <Trace x={330} y={50} w={136} h={60} series={[{ pts: after, c: TICK, r: 1 }]} />
      <Arrow a={[312, 80]} b={[328, 80]} c="emerald" w={1.4} />
      <Note x={176} y={132} lines={['The rate drops straight back to normal', 'and the trace cleans up.']} c={C.text} s={10.5} lh={14} />

      <Bx x={12} y={196} w={180} h={50} l={['Still fast after', 'demagnetising?']} c={C.brass} />
      <Arrow a={[192, 221]} b={[210, 221]} c="brass" w={1.4} />
      <rect x={212} y={190} width={256} height={100} rx="6" fill="rgba(194,88,99,0.07)" stroke={C.ruby} />
      <T x={222} y={210} s={11} c={C.ruby} w={600}>The cause is mechanical</T>
      {['dirt', 'a hairspring fault', 'a bad regulation'].map((t, i) => (
        <g key={t}>
          <circle cx={228} cy={230 + i * 18} r={2.5} fill={C.text} />
          <T x={238} y={234 + i * 18} s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
      <T x={14} y={276} s={10.5} c={C.dim}>not magnetism</T>
    </F>
  )
}

function DgCompassMoves() {
  const L = (v) => 70 + (Math.log10(v) + 1.5) * 68 // minutes a day, log scale
  return (
    <F h={330} view="Sequence and chart · a second, slower pass" scale="log scale below">
      <Demag x={14} y={86} on />
      <rect x={110} y={34} width={26} height={8} rx="3" fill="url(#sk-steel)" />
      <Arrow d="M150 40 Q110 46 70 74" c="brass" w={1.6} />
      <Num x={160} y={40} n={1} r={8} />
      <T x={172} y={36} s={10.5} c={C.text}>hold the button before</T>
      <T x={172} y={50} s={10.5} c={C.text}>it reaches the coil</T>
      <Num x={160} y={84} n={2} r={8} />
      <T x={172} y={80} s={10.5} c={C.text}>lift it away slowly,</T>
      <T x={172} y={94} s={10.5} c={C.text}>to about 30 cm</T>
      <Num x={160} y={126} n={3} r={8} />
      <T x={172} y={130} s={10.5} c={C.text}>only then let go</T>
      <Dim a={[340, 142]} b={[340, 40]} off={-10} text="≈30 cm" flip />
      <rect x={366} y={30} width={102} height={110} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <Verdict x={384} y={48} ok={false} r={8} />
      <Note x={376} y={74} lines={['Tapping the', 'button on the', 'coil can leave', 'it worse.']} c={C.text} s={10.5} lh={14} />
      <T x={14} y={166} s={10.5} c={C.dim}>Then test again with the compass 1 to 2 cm from the watch.</T>

      <Tag x={14} y={194}>Keep the size of the fault in mind</Tag>
      <line x1={L(0.03)} y1={250} x2={L(600)} y2={250} stroke={C.struct} />
      {[[0.05, '3 s'], [1, '1 min'], [10, '10 min'], [60, '1 h'], [300, '5 h']].map(([v, t]) => (
        <g key={t}>
          <line x1={L(v)} y1={246} x2={L(v)} y2={254} stroke={C.faint} />
          <T x={L(v)} y={268} a="middle" s={10} c={C.faint} mono>{t}</T>
        </g>
      ))}
      <rect x={L(2)} y={222} width={L(10) - L(2)} height={22} rx="3" fill="rgba(194,88,99,0.35)" stroke={C.ruby} />
      <T x={(L(2) + L(10)) / 2} y={216} a="middle" s={10.5} c={C.ruby} w={600}>2 to 10 min</T>
      <rect x={L(60)} y={222} width={L(400) - L(60)} height={22} rx="3" fill="rgba(194,88,99,0.15)" stroke={C.ruby} strokeDasharray="3 2" />
      <T x={(L(60) + L(400)) / 2} y={216} a="middle" s={10.5} c={C.ruby}>hours: bad case</T>
      <rect x={L(0.033)} y={222} width={L(0.15) - L(0.033)} height={22} rx="3" fill="rgba(123,165,131,0.25)" stroke={C.emerald} />
      <T x={L(0.033)} y={216} s={10.5} c={C.emerald}>a few seconds</T>
      <T x={L(600)} y={284} a="end" s={10} c={C.faint}>gain per day</T>
      <T x={14} y={304} s={10.5} c={C.text}>One guide’s typical magnetised gain is 2 to 10 minutes a day.</T>
      <T x={14} y={320} s={10.5} c={C.dim}>An error of a few seconds probably isn’t magnetism.</T>
    </F>
  )
}

function DgAntimag() {
  return (
    <F h={322} view="Section · what resists magnetism" scale="schematic">
      {/* field lines through an ordinary watch */}
      <Pn x={12} y={26} w={220} h={160} t="Ordinary watch" tc={C.ruby} />
      {[70, 90, 110, 130, 150].map((y) => <line key={y} x1={22} y1={y} x2={222} y2={y} stroke={C.steel} strokeDasharray="4 3" opacity="0.7" />)}
      <rect x={72} y={86} width={100} height={48} rx="6" fill="url(#dg-mov)" stroke={C.struct} />
      <T x={122} y={174} a="middle" s={10.5} c={C.text}>field passes straight through</T>
      <Pn x={248} y={26} w={220} h={160} t="Soft-iron inner cage" tc={C.emerald} />
      {[70, 150].map((y) => <line key={y} x1={258} y1={y} x2={458} y2={y} stroke={C.steel} strokeDasharray="4 3" opacity="0.7" />)}
      {[90, 110, 130].map((y) => <path key={y} d={`M258 ${y} L300 ${y} Q306 ${y < 110 ? 80 : y > 110 ? 140 : 80} 320 ${y < 110 ? 78 : y > 110 ? 142 : 78} L396 ${y < 110 ? 78 : y > 110 ? 142 : 78} Q410 ${y < 110 ? 80 : 140} 416 ${y} L458 ${y}`} fill="none" stroke={C.steel} strokeDasharray="4 3" opacity="0.7" />)}
      <rect x={304} y={80} width={104} height={60} rx="8" fill="none" stroke="#8d969c" strokeWidth="5" />
      <rect x={314} y={90} width={84} height={40} rx="5" fill="url(#dg-mov)" stroke={C.struct} />
      <T x={358} y={174} a="middle" s={10.5} c={C.text}>field runs round the cage</T>

      <Row x={12} y={198} w={456} h={36} ok head="A silicon hairspring also resists it" />
      <Row x={12} y={240} w={456} h={36} c={C.brass} head="Most ordinary watches have neither" text="avoidance is the defence" />
      <TipBar y={284} h={32} l1="Keeps getting magnetised? Look at where it sits overnight." />
    </F>
  )
}

/* ================================================================== */
/* diag-lowamp · low amplitude                                          */
/* ================================================================== */

function DgMeasure() {
  const X = (d) => 40 + (d - 200) * 2.6
  const band = (y, lo, hi, label, sub) => (
    <g>
      <T x={14} y={y + 14} s={11} c={C.text} w={600}>{label}</T>
      <T x={14} y={y + 28} s={10} c={C.dim}>{sub}</T>
      <rect x={X(lo)} y={y} width={X(hi) - X(lo)} height={30} rx="3" fill="rgba(123,165,131,0.3)" stroke={C.emerald} />
      <T x={(X(lo) + X(hi)) / 2} y={y + 19} a="middle" s={10.5} c={C.text} mono>{`~${lo}–${hi}°`}</T>
    </g>
  )
  return (
    <F h={330} view="Chart · know the target first" scale="degrees to scale">
      {band(30, 270, 310, '4 Hz', 'dial up, fully wound')}
      {band(70, 250, 300, '3 Hz', 'a touch lower')}
      <line x1={X(200)} y1={112} x2={X(340)} y2={112} stroke={C.struct} />
      {[200, 230, 260, 290, 320].map((d) => (
        <g key={d}>
          <line x1={X(d)} y1={108} x2={X(d)} y2={116} stroke={C.faint} />
          <T x={X(d)} y={130} a="middle" s={10} c={C.faint} mono>{d}°</T>
        </g>
      ))}
      <Arrow a={[X(290), 150]} b={[X(260), 150]} c="steel" w={1.8} />
      <T x={X(292)} y={154} s={10.5} c={C.steel}>verticals: expect ~20–40° less</T>

      <Tag x={14} y={186} c={C.emerald}>The test</Tag>
      <Row x={12} y={194} w={226} h={28} ok head="Fully wound" />
      <Row x={12} y={226} w={226} h={28} ok head="Dial up" />
      <Row x={12} y={258} w={226} h={28} ok head="A clean trace" />
      <Tag x={244} y={186} c={C.ruby}>Not the test</Tag>
      <Row x={242} y={194} w={226} h={28} ok={false} head="Half-wound" />
      <Row x={242} y={226} w={226} h={28} ok={false} head="In a vertical position" />
      <rect x={242} y={258} width={226} height={28} rx="5" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <T x={252} y={276} s={10.5} c={C.dim}>a lower reading there isn’t “low”</T>
      <T x={14} y={312} s={10.5} c={C.dim}>Taken any other way, the number isn’t low: it just isn’t the test.</T>
    </F>
  )
}

function DgFalseReading() {
  const X = (d) => 230 + (d - 260) * 3.6
  return (
    <F h={334} view="Test · rule out a false reading" scale="schematic">
      <Stage x={12} y={28} w={146} n={1} head="10 to 15 turns" sub="of the crown" />
      <Arrow a={[158, 50]} b={[168, 50]} c="brass" w={1.3} />
      <Stage x={170} y={28} w={140} n={2} head="Run ~20 min" sub="as Witschi advises" />
      <Arrow a={[310, 50]} b={[320, 50]} c="brass" w={1.3} />
      <Stage x={322} y={28} w={146} n={3} head="Check lift angle" sub="amplitude scales with it" />

      <Pn x={12} y={88} w={456} h={110} t="Wrong lift angle, confident wrong number" tc={C.ruby} />
      <rect x={24} y={114} width={140} height={34} rx="4" fill={LCD} stroke={C.steel} />
      <T x={34} y={136} s={10.5} c={C.dim}>entered</T>
      <T x={154} y={137} a="end" s={14} mono c={C.ruby} w={700}>52°</T>
      <rect x={24} y={154} width={140} height={34} rx="4" fill={LCD} stroke={C.steel} />
      <T x={34} y={176} s={10.5} c={C.dim}>true</T>
      <T x={154} y={177} a="end" s={14} mono c="#b7c9b5" w={700}>50°</T>
      <line x1={X(255)} y1={160} x2={X(305)} y2={160} stroke={C.struct} />
      {[260, 280, 300].map((d) => (
        <g key={d}>
          <line x1={X(d)} y1={156} x2={X(d)} y2={164} stroke={C.faint} />
          <T x={X(d)} y={180} a="middle" s={10} c={C.faint} mono>{d}°</T>
        </g>
      ))}
      <circle cx={X(280)} cy={160} r={6} fill={C.emerald} />
      <T x={X(280)} y={144} a="middle" s={10.5} c={C.emerald}>real 280°</T>
      <circle cx={X(291)} cy={160} r={6} fill={C.ruby} />
      <T x={X(296)} y={128} a="middle" s={10.5} c={C.ruby}>shows ≈291°</T>
      <T x={X(305)} y={194} a="end" s={10} c={C.dim}>the error runs both ways</T>

      <Tag x={14} y={212}>Then use the right yardstick</Tag>
      {(() => {
        const Z = (d) => 40 + (d - 230) * 3.6
        return (
          <g>
            <rect x={Z(250)} y={232} width={Z(330) - Z(250)} height={26} rx="3" fill="rgba(123,165,131,0.14)" stroke={C.emerald} strokeOpacity="0.5" />
            <rect x={Z(270)} y={232} width={Z(310) - Z(270)} height={26} rx="3" fill="rgba(123,165,131,0.38)" stroke={C.emerald} />
            <T x={Z(290)} y={249} a="middle" s={10.5} c={C.text} w={600}>goal 270–310°</T>
            <T x={Z(250)} y={228} a="middle" s={10} c={C.dim} mono>250°</T>
            <T x={Z(330)} y={228} a="middle" s={10} c={C.dim} mono>330°</T>
            <line x1={Z(255)} y1={232} x2={Z(255)} y2={264} stroke={C.brassHi} strokeWidth="2" />
            <T x={Z(255)} y={280} a="middle" s={10.5} c={C.brassHi}>255° dial up</T>
            <T x={Z(255)} y={294} a="middle" s={10} c={C.dim}>not a failed watch</T>
            <T x={Z(330) + 8} y={244} s={10.5} c={C.text}>Witschi’s</T>
            <T x={Z(330) + 8} y={258} s={10.5} c={C.text}>service band</T>
          </g>
        )
      })()}
      <T x={14} y={322} s={10.5} c={C.dim}>A low reading can be the machine’s fault too.</T>
    </F>
  )
}

function DgLube() {
  return (
    <F h={340} view="Plan and section · where old oil robs amplitude" scale="schematic">
      <Pn x={12} y={26} w={226} h={212} t="Escapement" />
      <EscWheelT cx={124} cy={188} r={38} />
      <Fork x={124} y={120} k={1} rot={0} />
      {[[94, 140], [154, 140]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={5} fill="#7d5b2b" stroke="#3d2a10" />)}
      {[30, 100, 150, 220].map((a) => {
        const p = pol(124, 188, 38, a)
        return <circle key={a} cx={p[0]} cy={p[1]} r={3} fill="#7d5b2b" />
      })}
      <Lab p={[94, 140]} x={56} y={70} text="pallet stones" up />
      <Lab p={[pol(124, 188, 38, 30)[0], pol(124, 188, 38, 30)[1]]} x={196} y={228} text="escape teeth" />
      <T x={210} y={60} a="end" s={10} c={C.faint}>oil here: 9415</T>
      <Pn x={244} y={26} w={224} h={212} t="Automatic barrel wall" />
      <rect x={270} y={70} width={172} height={110} rx="6" fill="none" stroke={M.brassP} strokeWidth="6" />
      <path d={spiralD(356, 125, 8, 44, 3.4)} fill="none" stroke={C.steel} strokeWidth="1.5" />
      {[80, 110, 140, 170].map((y) => <circle key={y} cx={274} cy={y} r={4} fill="#7d5b2b" />)}
      {[80, 110, 140, 170].map((y) => <circle key={y} cx={438} cy={y} r={4} fill="#7d5b2b" />)}
      <T x={356} y={200} a="middle" s={10.5} c={C.text}>gummed braking grease</T>
      <T x={356} y={214} a="middle" s={10} c={C.dim}>on the wall</T>

      <Row x={12} y={246} w={456} h={40} c={C.brass} head="Commonest cause by far, if it ran fine before" sub="old, dried or migrated oil: a service usually brings amplitude straight back" />
      <Row x={12} y={292} w={456} h={40} c={C.ruby} head="Low straight after a fresh service?" sub="suspect wrong or missing escapement lubrication" />
    </F>
  )
}

function DgMainspring() {
  const X = (t) => 40 + t * 42
  const Y = (v) => 210 - v * 1.4
  return (
    <F h={320} view="Chart · torque through the reserve" scale="schematic, no values">
      <line x1={X(0)} y1={Y(0)} x2={X(9)} y2={Y(0)} stroke={C.struct} />
      <line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(120)} stroke={C.struct} />
      <T x={X(0) - 6} y={Y(110)} a="end" s={10} c={C.faint}>torque</T>
      <T x={X(9)} y={Y(0) + 16} a="end" s={10} c={C.faint}>through the reserve</T>
      <T x={X(0)} y={Y(0) + 16} s={10} c={C.faint}>fully wound</T>
      <path d={`M${X(0)} ${Y(100)} C${X(3)} ${Y(92)} ${X(6)} ${Y(84)} ${X(8)} ${Y(60)}`} fill="none" stroke={C.emerald} strokeWidth="2.4" />
      <path d={`M${X(0)} ${Y(70)} C${X(3)} ${Y(60)} ${X(5)} ${Y(48)} ${X(7)} ${Y(22)}`} fill="none" stroke={C.ruby} strokeWidth="2.4" strokeDasharray="6 3" />
      <T x={X(8) + 4} y={Y(64)} s={10.5} c={C.emerald}>correct spring</T>
      <T x={X(7) + 4} y={Y(26)} s={10.5} c={C.ruby}>set (tired)</T>
      <rect x={X(5.5)} y={Y(40)} width={X(9) - X(5.5)} height={Y(0) - Y(40)} fill="rgba(194,88,99,0.08)" />
      <T x={X(5.6)} y={Y(4)} s={10} c={C.dim}>near the end of its reserve</T>

      <Pn x={12} y={236} w={150} h={70} t="Set spring" tc={C.ruby} />
      <T x={22} y={272} s={10.5} c={C.text}>less torque: classic</T>
      <T x={22} y={286} s={10.5} c={C.text}>on a never-serviced</T>
      <T x={22} y={300} s={10} c={C.dim}>watch</T>
      <Pn x={168} y={236} w={150} h={70} t="Automatic bridle" tc={C.ruby} />
      <T x={178} y={272} s={10.5} c={C.text}>slipping or</T>
      <T x={178} y={286} s={10.5} c={C.text}>mis-greased: robs power</T>
      <Pn x={324} y={236} w={144} h={70} t="Cure" tc={C.emerald} />
      <T x={334} y={272} s={10.5} c={C.text}>the correct-strength</T>
      <T x={334} y={286} s={10.5} c={C.text}>mainspring</T>
      <T x={334} y={300} s={10} c={C.dim}>see Barrel & mainspring</T>
    </F>
  )
}

function DgEscFaults() {
  const panel = (x, y, title, children) => (
    <g>
      <Pn x={x} y={y} w={224} h={112} t={title} tc={C.ruby} />
      {children}
    </g>
  )
  return (
    <F h={328} view="Detail · energy lost at the escapement" scale="schematic">
      {panel(12, 26, 'Pallet stone out of position', (
        <g>
          <path d="M40 70 L120 70 L140 92 L60 92 Z" fill="url(#sk-steel)" stroke="#4e5f6a" />
          <rect x={64} y={88} width={10} height={30} fill={C.ruby} transform="rotate(10 69 100)" opacity="0.5" />
          <rect x={64} y={96} width={10} height={30} fill={C.ruby} transform="rotate(10 69 108)" />
          <T x={150} y={100} s={10.5} c={C.text}>stone set</T>
          <T x={150} y={114} s={10.5} c={C.text}>too deep or</T>
          <T x={150} y={128} s={10.5} c={C.text}>too shallow</T>
        </g>
      ))}
      {panel(244, 26, 'Too much lock or draw', (
        <g>
          <EscWheelT cx={300} cy={110} r={24} />
          <rect x={292} y={62} width={9} height={26} fill={C.ruby} transform="rotate(-14 296 75)" />
          <Dim a={[318, 80]} b={[318, 90]} off={0} />
          <T x={366} y={98} s={10.5} c={C.text}>tooth locks</T>
          <T x={366} y={112} s={10.5} c={C.text}>too deep on</T>
          <T x={366} y={126} s={10.5} c={C.text}>the stone</T>
        </g>
      ))}
      {panel(12, 146, 'Worn escape teeth', (
        <g>
          <path d="M40 240 L60 190 L72 190 L80 240 M90 240 L110 194 L118 200 L124 240" fill="none" stroke={C.steel} strokeWidth="2" />
          <circle cx={116} cy={198} r={8} fill="none" stroke={C.ruby} strokeWidth="1.4" />
          <T x={150} y={216} s={10.5} c={C.text}>rounded, worn</T>
          <T x={150} y={230} s={10.5} c={C.text}>impulse faces</T>
        </g>
      ))}
      {panel(244, 146, 'Fork / roller depth error', (
        <g>
          <Roller cx={320} cy={228} r={16} pin={-90} />
          <path d="M302 188 L313 204 M338 188 L327 204" stroke="#a7b6bf" strokeWidth="5" strokeLinecap="round" />
          <T x={366} y={210} s={10.5} c={C.text}>horns too</T>
          <T x={366} y={224} s={10.5} c={C.text}>deep or shallow</T>
          <T x={366} y={238} s={10.5} c={C.text}>on the pin</T>
        </g>
      ))}
      <rect x={12} y={266} width={456} height={52} rx="6" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <T x={22} y={286} s={10.5} c={C.text}>The tell: low amplitude that oiling and a new mainspring don’t fix,</T>
      <T x={22} y={302} s={10.5} c={C.dim}>often with a noisy or uneven trace.</T>
    </F>
  )
}

function DgDrag() {
  const pts = [
    ['a bent pivot', 70, 112],
    ['a cracked or dirty jewel', 150, 92],
    ['too little endshake', 230, 112],
    ['a rubbing hairspring', 300, 76],
    ['balance fouling the centre wheel', 120, 150],
  ]
  return (
    <F h={330} view="Plan and chart · friction that saps amplitude" scale="schematic">
      <Gear cx={120} cy={110} r={40} n={40} />
      <Gear cx={200} cy={96} r={24} n={24} />
      <Gear cx={250} cy={120} r={18} n={18} />
      <Balance cx={300} cy={76} r={34} />
      {pts.map(([t, x, y], i) => (
        <g key={t}>
          <Num x={x} y={y} n={i + 1} c={C.ruby} r={8} />
        </g>
      ))}
      {['a bent pivot', 'a cracked or dirty jewel', 'too little endshake', 'a rubbing hairspring', 'balance fouling the', 'centre wheel'].map((t, i) => (
        <T key={i} x={350} y={44 + i * 20} s={10.5} c={C.text}>{i < 5 ? `${i + 1}  ${t}` : `    ${t}`}</T>
      ))}
      <T x={350} y={170} s={10} c={C.faint}>endshake: see its lesson</T>

      <Tag x={14} y={196}>Dial up against vertical</Tag>
      {[
        ['Normal', 290, 255, C.emerald],
        ['Big drop', 290, 215, C.ruby],
      ].map(([t, h, v, c], i) => {
        const x0 = 30 + i * 150
        const Y = (a) => 306 - (a - 180) * 0.7
        return (
          <g key={t}>
            <rect x={x0} y={Y(h)} width={34} height={306 - Y(h)} fill={c} opacity="0.55" />
            <rect x={x0 + 44} y={Y(v)} width={34} height={306 - Y(v)} fill={c} opacity="0.3" />
            <T x={x0 + 17} y={320} a="middle" s={10} c={C.dim}>DU</T>
            <T x={x0 + 61} y={320} a="middle" s={10} c={C.dim}>vert.</T>
            <T x={x0 + 39} y={Y(h) - 8} a="middle" s={10.5} c={c} w={600}>{t}</T>
          </g>
        )
      })}
      <rect x={316} y={204} width={152} height={104} rx="6" fill="rgba(194,88,99,0.07)" stroke={C.ruby} />
      <Note x={326} y={224} lines={['A big drop points at', 'a pivot, jewel or', 'escapement fault,', 'not the mainspring.']} c={C.text} s={10.5} lh={14} />
      <T x={326} y={296} s={10} c={C.faint}>bars schematic</T>
    </F>
  )
}

function DgAfterService() {
  const checks = ['train bridge or balance cock screwed down too hard', 'fluff under the balance', 'a contaminated cleaning jar', 'fork jewels never pegged']
  return (
    <F h={340} view="Checklist · low straight after your service" scale="schematic">
      <T x={14} y={42} s={11} c={C.text} w={600}>Check your own work before you buy parts</T>
      <Src x={14} y={58}>causes reported by forum posters</Src>
      {checks.map((c, i) => (
        <g key={c}>
          <rect x={12} y={66 + i * 28} width={300} height={24} rx="4" fill="rgba(255,255,255,0.025)" stroke={C.line} />
          <rect x={20} y={72 + i * 28} width={12} height={12} rx="2" fill="none" stroke={C.brass} />
          <T x={40} y={82 + i * 28} s={10.5} c={C.text}>{c}</T>
        </g>
      ))}
      <rect x={322} y={66} width={146} height={108} rx="6" fill="rgba(123,165,131,0.08)" stroke={C.emerald} />
      <T x={395} y={110} a="middle" s={20} c={C.emerald} w={700}>≈ +30°</T>
      <T x={395} y={130} a="middle" s={10.5} c={C.text}>one poster’s gain</T>
      <T x={395} y={144} a="middle" s={10.5} c={C.text}>from checks like these</T>
      <T x={14} y={196} s={10} c={C.faint}>Also reported: worn barrel arbor pivots, too much lock, excess oil, excess endshake.</T>
      <T x={14} y={210} s={10} c={C.faint}>Posters rarely find the mainspring to blame.</T>

      <Stage x={12} y={222} w={146} n={1} head="Train coasts?" sub="confirm it first" />
      <Arrow a={[158, 244]} b={[168, 244]} c="brass" w={1.3} />
      <Stage x={170} y={222} w={146} n={2} head="Change one thing" sub="at a time" />
      <Arrow a={[316, 244]} b={[326, 244]} c="brass" w={1.3} />
      <Stage x={328} y={222} w={140} n={3} head="Re-read" sub="after each change" />
      <Caution y={274} h={28} l1="A dry reassembly is a short test only. Don’t leave a watch running without oil." />
      <TipBar y={306} h={30} l1="Automatic: 8217 can read lower, P125 can brake harder. Log which you used." />
    </F>
  )
}

function DgQuickWins() {
  const X = (yr) => 270 + yr * 22
  const Y = (a) => 230 - (a - 220) * 1.2
  return (
    <F h={330} view="Order · cheap checks, then the list" scale="schematic">
      {[
        ['Demagnetise', 'it can disturb amplitude'],
        ['Fully wound?', 'genuinely'],
        ['Dial up?', 'confirm the position'],
      ].map(([a, b], i) => (
        <g key={a}>
          <Stage x={12} y={28 + i * 48} w={220} h={40} n={i + 1} head={a} sub={b} c={C.emerald} />
        </g>
      ))}
      <Tag x={14} y={184}>Then work the list from the top</Tag>
      {['1 lubrication', '2 mainspring', '3 escapement', '4 drag'].map((t, i) => (
        <g key={t}>
          <rect x={12 + (i % 2) * 112} y={192 + Math.floor(i / 2) * 28} width={108} height={24} rx="4" fill="rgba(255,255,255,0.03)" stroke={C.brass} strokeOpacity="0.6" />
          <T x={66 + (i % 2) * 112} y={208 + Math.floor(i / 2) * 28} a="middle" s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
      <rect x={12} y={252} width={220} height={56} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <Verdict x={28} y={266} ok={false} r={7} />
      <T x={42} y={270} s={10.5} c={C.ruby} w={600}>Don’t “adjust” the regulator</T>
      <T x={22} y={286} s={10.5} c={C.text}>to hide it. Amplitude is a</T>
      <T x={22} y={300} s={10.5} c={C.text}>symptom: chase the cause.</T>

      <Pn x={244} y={28} w={224} h={280} t="Tip · log it every service" tc={C.brassHi} />
      <line x1={X(0)} y1={Y(220)} x2={X(8.5)} y2={Y(220)} stroke={C.struct} />
      <line x1={X(0)} y1={Y(220)} x2={X(0)} y2={Y(320)} stroke={C.struct} />
      {[[0, 305], [3, 296], [5, 284], [7, 268], [8, 258]].map(([yr, a], i, arr) => (
        <g key={yr}>
          <circle cx={X(yr)} cy={Y(a)} r={4} fill={C.brassHi} />
          {i > 0 && <line x1={X(arr[i - 1][0])} y1={Y(arr[i - 1][1])} x2={X(yr)} y2={Y(a)} stroke={C.brassHi} strokeWidth="1.4" />}
        </g>
      ))}
      <T x={X(8.5)} y={Y(220) + 14} a="end" s={10} c={C.faint}>years, one dot a service</T>
      <T x={X(0) - 4} y={Y(310)} a="end" s={10} c={C.faint}>amp</T>
      <Note x={254} y={266} lines={['A downward trend says the', 'mainspring or oil is aging', 'before it ever stops.']} c={C.text} s={10.5} lh={14} />
      <T x={14} y={322} s={10} c={C.faint}>Dots illustrate a trend, not real readings.</T>
    </F>
  )
}

export const FIGS = {
  'dg-quartz-cell': DgQuartzCell,
  'dg-quartz-cased': DgQuartzCased,
  'dg-mech-power': DgMechPower,
  'dg-one-system': DgOneSystem,
  'dg-obvious-jam': DgObviousJam,
  'dg-hands-off': DgHandsOff,
  'dg-balance-nudge': DgBalanceNudge,
  'dg-read-fork': DgReadFork,
  'dg-same-time': DgSameTime,
  'dg-real-fault': DgRealFault,
  'dg-still-fast': DgStillFast,
  'dg-slow-dies': DgSlowDies,
  'dg-erratic': DgErratic,
  'dg-24h': Dg24h,
  'dg-regulate': DgRegulate,
  'dg-water-signs': DgWaterSigns,
  'dg-open-now': DgOpenNow,
  'dg-movement-out': DgMovementOut,
  'dg-quartz-cell-out': DgQuartzCellOut,
  'dg-dry-gently': DgDryGently,
  'dg-assess-service': DgAssessService,
  'dg-way-in': DgWayIn,
  'dg-drive-path': DgDrivePath,
  'dg-wind-not-set': DgWindNotSet,
  'dg-crown-spins': DgCrownSpins,
  'dg-gritty': DgGritty,
  'dg-crown-out': DgCrownOut,
  'dg-hands-crown-in': DgHandsCrownIn,
  'dg-auto-wind': DgAutoWind,
  'dg-rotor-swish': DgRotorSwish,
  'dg-loud-rotor': DgLoudRotor,
  'dg-scrape': DgScrape,
  'dg-rattle': DgRattle,
  'dg-buzz': DgBuzz,
  'dg-listen': DgListen,
  'dg-loose-friction': DgLooseFriction,
  'dg-tight-friction': DgTightFriction,
  'dg-date-load': DgDateLoad,
  'dg-tighten': DgTighten,
  'dg-ease': DgEase,
  'dg-prove-fix': DgProveFix,
  'dg-mag-symptom': DgMagSymptom,
  'dg-compass': DgCompass,
  'dg-mag-sources': DgMagSources,
  'dg-demag': DgDemag,
  'dg-verify': DgVerify,
  'dg-compass-moves': DgCompassMoves,
  'dg-antimag': DgAntimag,
  'dg-measure': DgMeasure,
  'dg-false-reading': DgFalseReading,
  'dg-lube': DgLube,
  'dg-mainspring': DgMainspring,
  'dg-esc-faults': DgEscFaults,
  'dg-drag': DgDrag,
  'dg-after-service': DgAfterService,
  'dg-quick-wins': DgQuickWins,
}
