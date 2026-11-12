// Diagrams for the "Quartz Repair" and "Workshop & Safety" tracks: how a
// quartz movement works, battery changes, diagnosis with a meter, corrosion,
// module swaps, solar and Kinetic watches, and the bench habits that keep
// parts, tools and people safe (including radium and button cells).
// Original schematics built on the strap kit. Nothing is traced from an ETA,
// Witschi, Seiko or other published figure, and every number matches the step text.
import { C, Fig, T, Note, Dim, Arrow, Num, Verdict, Tag, Sep } from '../strap/kit.jsx'

/* ------------------------------------------------------------------ */
/* Palette and defs for this file                                       */
/* ------------------------------------------------------------------ */
const M = {
  gasket: '#e08a55',
  plate: '#5b5339',
  board: '#2f4a5a',
  copper: '#c07f45',
  copperD: '#7d4d24',
  dial: '#d8d0bd',
  dialDark: '#25221f',
  glass: '#a9d0de',
  magnet: '#b5545f',
  magnetB: '#5a7fa8',
  grease: '#8fd19e',
  oil: '#7fc4e8',
  ink: '#120f0d',
  ruby: '#c9495e',
  brassP: '#b89548',
  steelD: '#55646e',
  plastic: '#e9e1c6',
  green: '#7fbf6a',
  crust: '#9fd08a',
  white: '#ece8de',
  lume: '#c9d79a',
  paper: '#e8e2d2',
  nitrile: '#6f8fd0',
  skin: '#d9a982',
  skinD: '#a8775a',
  screen: '#b8c9a0',
  meter: '#3a3f44',
}

function QDefs() {
  const hatch = (id, bg, fg) => (
    <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="6" fill={bg} />
      <line x1="0" y1="0" x2="0" y2="6" stroke={fg} strokeWidth="1.1" />
    </pattern>
  )
  return (
    <defs>
      {hatch('qw-cut', '#6f808b', '#a3b3bd')}
      {hatch('qw-mov', '#433c31', '#5e5546')}
      {hatch('qw-plcut', '#8a8470', '#b7b097')}
      <pattern id="qw-knurl" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#a7b6bf" />
        <line x1="2" y1="0" x2="2" y2="4" stroke="#55646e" strokeWidth="1" />
      </pattern>
      <pattern id="qw-carpet" width="6" height="8" patternUnits="userSpaceOnUse">
        <rect width="6" height="8" fill="#5a3b3b" />
        <path d="M1 8 L1.6 1 M3.5 8 L3 0.5 M5.2 8 L5.6 2" stroke="#7b5151" strokeWidth="1.1" />
      </pattern>
      <pattern id="qw-crust" width="7" height="7" patternUnits="userSpaceOnUse">
        <rect width="7" height="7" fill="rgba(127,191,106,0.25)" />
        <circle cx="2" cy="2" r="1.3" fill="#9fd08a" />
        <circle cx="5.2" cy="4.8" r="1" fill="#e6efd8" />
      </pattern>
      <pattern id="qw-coilw" width="3" height="6" patternUnits="userSpaceOnUse">
        <rect width="3" height="6" fill="#c07f45" />
        <line x1="1.5" y1="0" x2="1.5" y2="6" stroke="#7d4d24" strokeWidth="0.7" />
      </pattern>
      <linearGradient id="qw-acr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(190,225,235,0.55)" />
        <stop offset="1" stopColor="rgba(120,170,190,0.28)" />
      </linearGradient>
      <radialGradient id="qw-cell" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#eef3f6" />
        <stop offset="0.6" stopColor="#aebcc5" />
        <stop offset="1" stopColor="#66767f" />
      </radialGradient>
      <radialGradient id="qw-gold" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#f6dc98" />
        <stop offset="0.6" stopColor="#cfa24a" />
        <stop offset="1" stopColor="#7d5f22" />
      </radialGradient>
      <radialGradient id="qw-lamp" cx="0.5" cy="0" r="1">
        <stop offset="0" stopColor="rgba(250,226,150,0.32)" />
        <stop offset="1" stopColor="rgba(250,226,150,0.02)" />
      </radialGradient>
      <radialGradient id="qw-sun" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="rgba(250,220,120,0.9)" />
        <stop offset="1" stopColor="rgba(250,220,120,0)" />
      </radialGradient>
    </defs>
  )
}

const F = ({ children, ...p }) => (
  <Fig {...p}>
    <QDefs />
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

// Side label: leader from p runs horizontally-ish to text at (x, y); text anchored away from p
const SL = ({ p, x, y, text, sub, c = C.text, s = 10.5, a: al }) => {
  const a = al || (x >= p[0] ? 'start' : 'end')
  const tx = x + (a === 'start' ? 3 : -3)
  return (
    <g>
      <line x1={p[0]} y1={p[1]} x2={x} y2={y - 4} stroke={C.struct} strokeWidth="0.8" opacity="0.85" />
      <circle cx={p[0]} cy={p[1]} r="2.2" fill={c} />
      <T x={tx} y={y} a={a} s={s} c={c}>
        {text}
      </T>
      {sub && (
        <T x={tx} y={y + s + 2} a={a} s={10} c={C.faint}>
          {sub}
        </T>
      )}
    </g>
  )
}

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

// A curved turning arrow round (cx, cy). from/to in clock degrees.
function Turn({ cx, cy, r, from, to, c = 'brass', w = 1.8 }) {
  const [x1, y1] = clk(cx, cy, r, from)
  const [x2, y2] = clk(cx, cy, r, to)
  const sweep = to > from ? 1 : 0
  const large = Math.abs(to - from) > 180 ? 1 : 0
  return <Arrow d={`M${x1} ${y1} A${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`} c={c} w={w} />
}

// Numbered row: disc + bold line + optional sub line
const Row = ({ x, y, n, t, sub, c = C.text, nc }) => (
  <g>
    {n !== undefined && <Num x={x} y={y - 4} n={n} r={7.5} c={nc} />}
    <T x={x + (n !== undefined ? 14 : 0)} y={y} s={11} c={c}>
      {t}
    </T>
    {sub && (
      <T x={x + (n !== undefined ? 14 : 0)} y={y + 13} s={10} c={C.faint}>
        {sub}
      </T>
    )}
  </g>
)

// Bullet with ✓/✗ verdict
const VRow = ({ x, y, ok, t, sub, s = 11 }) => (
  <g>
    <Verdict x={x} y={y - 4} ok={ok} r={6.5} />
    <T x={x + 12} y={y} s={s} c={C.text}>
      {t}
    </T>
    {sub && (
      <T x={x + 12} y={y + 13} s={10} c={C.faint}>
        {sub}
      </T>
    )}
  </g>
)

/* ------------------------------------------------------------------ */
/* Watch parts                                                          */
/* ------------------------------------------------------------------ */
// Watch seen from the front. h/m/s: hand angles in clock degrees.
function Face({ cx, cy, r, h = 300, m = 60, s, crown = true, lugs = true, strap, gold, date, ticks = 12, dial = M.dialDark, crownOut }) {
  const hand = (deg, len, wdt, col) => {
    const [x, y] = clk(cx, cy, len, deg)
    return <line x1={cx} y1={cy} x2={x} y2={y} stroke={col} strokeWidth={wdt} strokeLinecap="round" />
  }
  const caseFill = gold ? 'url(#qw-gold)' : 'url(#sk-steel)'
  return (
    <g>
      {strap && [-1, 1].map((d) => <rect key={d} x={cx - r * 0.5} y={d < 0 ? cy - r - strap : cy + r * 0.7} width={r} height={strap + r * 0.3} rx="3" fill="url(#sk-top)" />)}
      {lugs && [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => (
        <rect key={i} x={cx + a * r * 0.58 - r * 0.1} y={cy + b * r * 0.92 - (b < 0 ? r * 0.2 : 0)} width={r * 0.2} height={r * 0.28} rx="2.5" fill={gold ? '#b08a3c' : '#8c9aa3'} />
      ))}
      {crown && <rect x={cx + r - 1 + (crownOut || 0)} y={cy - r * 0.13} width={r * 0.2} height={r * 0.26} rx="2" fill={gold ? '#c9a24c' : 'url(#qw-knurl)'} stroke="#55646e" strokeWidth="0.5" />}
      {crown && crownOut && <rect x={cx + r - 1} y={cy - r * 0.04} width={crownOut + 1} height={r * 0.08} fill="url(#sk-steelH)" />}
      <circle cx={cx} cy={cy} r={r} fill={caseFill} stroke="#55646e" />
      <circle cx={cx} cy={cy} r={r * 0.86} fill={dial} stroke={C.struct} strokeWidth="0.6" />
      {Array.from({ length: ticks }, (_, i) => {
        const [a, b] = clk(cx, cy, r * 0.82, i * (360 / ticks))
        const [c2, d2] = clk(cx, cy, r * (i % 3 === 0 ? 0.68 : 0.73), i * (360 / ticks))
        return <line key={i} x1={a} y1={b} x2={c2} y2={d2} stroke={dial === M.dialDark ? C.dim : '#3a342c'} strokeWidth={i % 3 === 0 ? 1.8 : 1.1} />
      })}
      {date && <rect x={cx + r * 0.46} y={cy - r * 0.1} width={r * 0.2} height={r * 0.2} fill="#f2ede0" stroke={C.struct} strokeWidth="0.5" />}
      {h !== null && hand(h, r * 0.48, Math.max(2, r * 0.07), C.brassHi)}
      {m !== null && hand(m, r * 0.72, Math.max(1.6, r * 0.045), C.brassHi)}
      {s !== undefined && hand(s, r * 0.78, 1, C.ruby)}
      <circle cx={cx} cy={cy} r={Math.max(2, r * 0.05)} fill={C.brassHi} />
    </g>
  )
}

// Generic quartz module in plan (dial side down, we see the back). Stem at 3 o'clock.
// Returns the same coordinates for callers through `QP` below.
const QP = (cx, cy, r) => {
  const u = r / 70
  const c = (dx, dy) => [cx + dx * u, cy + dy * u]
  return { u, c, cell: c(26, 26), cellR: 31 * u, coil: c(-26, -40), rotor: c(10, -30), ic: c(-21, 1), xtal: c(-54, 5), clamp: c(46, 8), ac: c(-44, 30), neg: c(26, 58) }
}
function QMod({ cx, cy, r, cell = true, clamp = true, stem = true, label, ac, crust, cellCode }) {
  const { u, c } = QP(cx, cy, r)
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
        <rect x={-24 * u} y={-6.5 * u} width={48 * u} height={13 * u} rx={2 * u} fill={M.copper} stroke={M.copperD} strokeWidth="0.8" />
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1={(-20 + i * 4) * u} y1={-6.5 * u} x2={(-20 + i * 4) * u} y2={6.5 * u} stroke={M.copperD} strokeWidth="0.6" />
        ))}
      </g>
      <rect x={c(-30, -8)[0]} y={c(-30, -8)[1]} width={18 * u} height={18 * u} fill="#1e1c1b" stroke={C.dim} strokeWidth="0.7" />
      <rect x={c(-58, -6)[0]} y={c(-58, -6)[1]} width={8 * u} height={22 * u} rx={3 * u} fill="url(#sk-steelH)" />
      <circle cx={c(10, -30)[0]} cy={c(10, -30)[1]} r={7 * u} fill={M.magnet} stroke={C.text} strokeWidth="0.6" />
      {ac && (
        <g>
          <circle cx={c(-44, 30)[0]} cy={c(-44, 30)[1]} r={5 * u} fill={C.brassHi} stroke={C.ground} strokeWidth="0.6" />
          <T x={c(-44, 30)[0] - 7 * u} y={c(-44, 30)[1] + 4} a="end" s={10} c={C.brassHi}>
            AC
          </T>
        </g>
      )}
      {cell && <circle cx={c(26, 26)[0]} cy={c(26, 26)[1]} r={31 * u} fill="url(#qw-cell)" stroke="#4e5f6a" />}
      {cell && (
        <T x={c(26, 26)[0]} y={c(26, 26)[1] + (cellCode ? -2 : 5)} a="middle" s={Math.max(10, 13 * u)} c="#2b343a" w={700}>
          +
        </T>
      )}
      {cell && cellCode && (
        <T x={c(26, 26)[0]} y={c(26, 26)[1] + 12} a="middle" s={10} c="#2b343a">
          {cellCode}
        </T>
      )}
      {crust && (
        <g>
          <ellipse cx={c(48, 6)[0]} cy={c(48, 6)[1]} rx={9 * u} ry={7 * u} fill="url(#qw-crust)" />
          <ellipse cx={c(26, 58)[0]} cy={c(26, 58)[1]} rx={10 * u} ry={5 * u} fill="url(#qw-crust)" />
        </g>
      )}
      {cell && clamp && <path d={`M${c(56, 0)[0]} ${c(56, 0)[1]} L${c(36, 18)[0]} ${c(36, 18)[1]}`} stroke={C.brassHi} strokeWidth={4 * u} strokeLinecap="round" />}
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

// Button cell, side view: the wide + can, the small − cap underneath (cap down)
function CellSide({ x, y, w = 60, h = 16, flip, code }) {
  const cap = w * 0.68
  const ch = Math.max(3, h * 0.22)
  const bodyY = flip ? y + ch : y
  const capY = flip ? y : y + h - ch
  return (
    <g>
      <rect x={x + (w - cap) / 2} y={capY} width={cap} height={ch} rx="1.5" fill="#8e9ca5" stroke={M.steelD} strokeWidth="0.6" />
      <rect x={x} y={bodyY} width={w} height={h - ch} rx="2.5" fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.7" />
      <T x={x + w / 2} y={bodyY + (h - ch) / 2 + 4} a="middle" s={10} c="#2b343a" w={700}>
        {code || '+'}
      </T>
    </g>
  )
}
// Button cell, plan view of its + face
function CellTop({ cx, cy, r, code, sub }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="url(#qw-cell)" stroke="#4e5f6a" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r * 0.86} fill="none" stroke="#7d8d97" strokeWidth="0.6" />
      <T x={cx} y={cy - (code ? r * 0.18 : -4)} a="middle" s={Math.max(10, r * 0.36)} c="#2b343a" w={700}>
        +
      </T>
      {code && (
        <T x={cx} y={cy + r * 0.38} a="middle" s={Math.max(10, r * 0.24)} c="#2b343a">
          {code}
        </T>
      )}
      {sub && (
        <T x={cx} y={cy + r + 14} a="middle" s={10} c={C.dim}>
          {sub}
        </T>
      )}
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
      <rect x="-6" y={-len} width="12" height={Math.max(0, len - 30)} rx="2" fill="url(#qw-knurl)" stroke="#55646e" strokeWidth="0.6" />
      <rect x="-6.5" y={-len - 6} width="13" height="7" rx="3" fill="#8c9aa3" stroke="#55646e" strokeWidth="0.6" />
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
      <rect x="-6" y={-len} width="12" height={Math.max(0, len - 22)} rx="2" fill="url(#qw-knurl)" stroke={M.steelD} strokeWidth="0.6" />
    </g>
  )
}
// Fibreglass pen, bristle tip at (0,0)
function GlassPen({ len = 90 }) {
  return (
    <g>
      {[-2.4, -1.2, 0, 1.2, 2.4].map((d) => (
        <line key={d} x1={d * 0.6} y1="0" x2={d} y2="-12" stroke="#f1f1e8" strokeWidth="0.9" />
      ))}
      <rect x="-4" y="-22" width="8" height="10" fill="#b9c3c8" stroke={M.steelD} strokeWidth="0.5" />
      <rect x="-5.5" y={-len} width="11" height={Math.max(0, len - 22)} rx="3" fill="#c94a3c" stroke="#7a2a22" strokeWidth="0.6" />
    </g>
  )
}
// Meter probe pen, tip at (0,0)
function ProbePen({ c = C.ruby, len = 70 }) {
  return (
    <g>
      <line x1="0" y1="0" x2="0" y2="-14" stroke="#d7dde0" strokeWidth="1.4" />
      <path d={`M-3.5 -14 L3.5 -14 L4.5 ${-len} L-4.5 ${-len} Z`} fill={c} stroke={C.ground} strokeWidth="0.6" />
      <rect x="-6" y="-22" width="12" height="3" rx="1" fill={c} />
    </g>
  )
}
// Fingertip, pad at (0,0), finger runs up (schematic)
function Finger({ w = 16, len = 60, gloved, c }) {
  const fill = c || (gloved ? M.nitrile : M.skin)
  return (
    <g>
      <path d={`M${-w / 2} ${-len} L${-w / 2} ${-w / 2} A${w / 2} ${w / 2} 0 0 0 ${w / 2} ${-w / 2} L${w / 2} ${-len}`} fill={fill} stroke={gloved ? '#3d5a99' : M.skinD} strokeWidth="0.8" />
      {!gloved && <path d={`M${-w * 0.3} ${-w * 0.7} Q0 ${-w * 0.05} ${w * 0.3} ${-w * 0.7} L${w * 0.28} ${-w * 1.5} L${-w * 0.28} ${-w * 1.5} Z`} fill="#f0cdb2" opacity="0.6" />}
    </g>
  )
}

// Multimeter: body at (x,y) top-left, w 78, h 110. read/unit on the display, mode label on the dial.
function Meter({ x, y, read, unit, mode, k = 1, rc = M.ink }) {
  const w = 78 * k
  const h = 110 * k
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={8 * k} fill="#c99a2e" />
      <rect x={x + 4 * k} y={y + 4 * k} width={w - 8 * k} height={h - 8 * k} rx={6 * k} fill={M.meter} />
      <rect x={x + 9 * k} y={y + 10 * k} width={w - 18 * k} height={28 * k} rx="2" fill={M.screen} />
      <T x={x + w - 13 * k} y={y + 30 * k} a="end" s={Math.max(11, 14 * k)} c={rc} w={700} mono>
        {read}
      </T>
      <T x={x + 13 * k} y={y + 20 * k} s={10} c="#3c4a2c" mono>
        {unit}
      </T>
      <circle cx={x + w / 2} cy={y + 64 * k} r={15 * k} fill="#22262a" stroke="#6b737a" />
      <line x1={x + w / 2} y1={y + 64 * k} x2={x + w / 2} y2={y + 51 * k} stroke={C.brassHi} strokeWidth="2.2" strokeLinecap="round" />
      <T x={x + w / 2} y={y + 47 * k} a="middle" s={10} c={C.brassHi} mono>
        {mode}
      </T>
      <circle cx={x + 22 * k} cy={y + 96 * k} r={4 * k} fill={M.ink} stroke={C.ruby} strokeWidth="1.4" />
      <circle cx={x + w - 22 * k} cy={y + 96 * k} r={4 * k} fill={M.ink} stroke="#888" strokeWidth="1.4" />
    </g>
  )
}
// Lead from a jack to a probe tip (soft curve)
const Lead2 = ({ a, b, c = C.ruby, sag = 30 }) => (
  <path d={`M${a[0]} ${a[1]} C${a[0]} ${a[1] + sag} ${b[0]} ${b[1] - sag - 40} ${b[0]} ${b[1] - 70}`} fill="none" stroke={c} strokeWidth="1.8" />
)

// Covered compartment tray, plan. cells: [[label, fill]] row-major
function Tray({ x, y, cols = 4, rows = 2, cw = 46, ch = 40, lid, items = [] }) {
  return (
    <g>
      <rect x={x - 5} y={y - 5} width={cols * cw + 10} height={rows * ch + 10} rx="7" fill="#d8d2c2" stroke="#9c9484" />
      {Array.from({ length: rows * cols }, (_, i) => {
        const cx = x + (i % cols) * cw
        const cy = y + Math.floor(i / cols) * ch
        return <rect key={i} x={cx + 2} y={cy + 2} width={cw - 4} height={ch - 4} rx="5" fill="#eeeadf" stroke="#b7ae9c" />
      })}
      {items.map((it, i) => it && <g key={i}>{it(x + (i % cols) * cw + cw / 2, y + Math.floor(i / cols) * ch + ch / 2)}</g>)}
      {lid && <rect x={x - 7} y={y - 7} width={cols * cw + 14} height={rows * ch + 14} rx="8" fill="rgba(170,210,225,0.18)" stroke={M.glass} strokeWidth="1.2" />}
    </g>
  )
}

// Seconds-hand step chart. events: array of seconds (floats) at which the hand steps; x0..x1 maps 0..secs
function TickRow({ x, y, w, secs = 12, events = [], c = C.brassHi, label, sub, h = 14 }) {
  const sx = (t) => x + (t / secs) * w
  return (
    <g>
      <line x1={x} y1={y} x2={x + w} y2={y} stroke={C.line} />
      {Array.from({ length: secs + 1 }, (_, i) => (
        <line key={i} x1={sx(i)} y1={y} x2={sx(i)} y2={y + 3} stroke={C.faint} strokeWidth="0.7" />
      ))}
      {events.map((t, i) => (
        <rect key={i} x={sx(t) - 1.6} y={y - h} width="3.2" height={h} rx="1" fill={c} />
      ))}
      {label && (
        <T x={x} y={y - h - 6} s={11} c={C.text}>
          {label}
        </T>
      )}
      {sub && (
        <T x={x + w} y={y - h - 6} a="end" s={10} c={C.faint}>
          {sub}
        </T>
      )}
    </g>
  )
}

// Arrow chain of boxes, horizontal. items: [[lines], colour]; returns group
function Chain({ x, y, w, h, gap = 18, items, s = 10.5 }) {
  return (
    <g>
      {items.map(([l, c], i) => (
        <g key={i}>
          <Bx x={x + i * (w + gap)} y={y} w={w} h={h} l={l} c={c || C.struct} s={s} />
          {i < items.length - 1 && <Arrow a={[x + i * (w + gap) + w + 2, y + h / 2]} b={[x + (i + 1) * (w + gap) - 3, y + h / 2]} c="brass" w={1.5} />}
        </g>
      ))}
    </g>
  )
}

// Small radiation trefoil (schematic warning mark)
function Trefoil({ x, y, r = 10, c = '#e3c34a' }) {
  const blade = (a) => {
    const [x1, y1] = pol(x, y, r * 0.3, a - 30)
    const [x2, y2] = pol(x, y, r, a - 30)
    const [x3, y3] = pol(x, y, r, a + 30)
    const [x4, y4] = pol(x, y, r * 0.3, a + 30)
    return `M${x1} ${y1} L${x2} ${y2} A${r} ${r} 0 0 1 ${x3} ${y3} L${x4} ${y4} A${r * 0.3} ${r * 0.3} 0 0 0 ${x1} ${y1} Z`
  }
  return (
    <g>
      <circle cx={x} cy={y} r={r + 3} fill={c} />
      {[-90, 30, 150].map((a) => (
        <path key={a} d={blade(a)} fill={M.ink} />
      ))}
      <circle cx={x} cy={y} r={r * 0.18} fill={M.ink} />
    </g>
  )
}

/* ================================================================== */
/* quartz-how · inside a quartz movement                                */
/* ================================================================== */

// Tuning-fork crystal in its can, schematic; centre of the can at (x, y)
const Xtal = ({ x, y, k = 1 }) => (
  <g>
    <rect x={x - 9 * k} y={y - 20 * k} width={18 * k} height={40 * k} rx={9 * k} fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.7" />
    <path d={`M${x - 4 * k} ${y - 14 * k} L${x - 4 * k} ${y + 6 * k} Q${x} ${y + 11 * k} ${x + 4 * k} ${y + 6 * k} L${x + 4 * k} ${y - 14 * k}`} fill="none" stroke="#f3f7f9" strokeWidth={2.2 * k} />
    <line x1={x - 3 * k} y1={y + 20 * k} x2={x - 3 * k} y2={y + 28 * k} stroke={C.dim} strokeWidth="1" />
    <line x1={x + 3 * k} y1={y + 20 * k} x2={x + 3 * k} y2={y + 28 * k} stroke={C.dim} strokeWidth="1" />
  </g>
)

function QwIcDivide() {
  const vals = [32768, 16384, 8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1]
  const cw = 44
  const gap = 12
  const x0 = 26
  const pos = (i) => {
    const row = i < 8 ? 0 : 1
    const col = row === 0 ? i : 15 - i
    return [x0 + col * (cw + gap), row === 0 ? 92 : 136]
  }
  return (
    <F h={318} view="Block diagram · the divider chain" scale="schematic">
      <Xtal x={36} y={48} k={0.8} />
      <T x={54} y={44} s={11} c={C.text} w={600}>crystal</T>
      <T x={54} y={57} s={10} c={C.dim}>32,768 Hz in</T>
      <Arrow a={[130, 48]} b={[160, 48]} c="brass" w={1.6} />
      <T x={166} y={44} s={11} c={C.text} w={600}>CMOS IC halves it 15 times</T>
      <T x={166} y={57} s={10} c={C.dim}>2¹⁵ = 32,768, so 15 halvings reach exactly 1</T>
      <rect x={14} y={70} width={452} height={104} rx="8" fill="rgba(47,74,90,0.25)" stroke={C.steel} />
      <Tag x={22} y={84} c={C.steel}>
        inside the chip · each arrow is one ÷2 stage
      </Tag>
      {vals.map((v, i) => {
        const [x, y] = pos(i)
        const last = i === 15
        return (
          <g key={v}>
            <rect x={x} y={y} width={cw} height={24} rx="4" fill={last ? 'rgba(208,168,79,0.22)' : '#1d2a32'} stroke={last ? C.brass : C.struct} />
            <T x={x + cw / 2} y={y + 16} a="middle" s={10.5} c={last ? C.brassHi : C.text} mono>
              {v.toLocaleString('en-GB')}
            </T>
          </g>
        )
      })}
      {vals.slice(0, 15).map((v, i) => {
        const [x, y] = pos(i)
        const [x2, y2] = pos(i + 1)
        if (i === 7) return <Arrow key={i} d={`M${x + cw / 2} ${y + 25} L${x2 + cw / 2} ${y2 - 2}`} c="steel" w={1.3} />
        return i < 7 ? <Arrow key={i} a={[x + cw + 1, y + 12]} b={[x2 - 2, y2 + 12]} c="steel" w={1.3} /> : <Arrow key={i} a={[x - 1, y + 12]} b={[x2 + cw + 2, y2 + 12]} c="steel" w={1.3} />
      })}
      <T x={22 + 0 * 56 + 22} y={172} a="middle" s={10} c={C.faint}>Hz</T>
      <Lab p={[48, 160]} x={110} y={194} text="1 pulse per second, out to the coil" c={C.brassHi} a="start" />

      <Pn x={14} y={206} w={222} h={100} t="low-battery warning" />
      <T x={24} y={240} s={10.5} c={C.text}>watches the cell voltage and, when it</T>
      <T x={24} y={254} s={10.5} c={C.text}>runs low, changes the seconds hand:</T>
      <TickRow x={30} y={292} w={190} secs={12} events={[4, 4.15, 4.3, 4.45, 8, 8.15, 8.3, 8.45, 12, 12.15]} h={12} />
      <T x={30} y={276} s={10} c={C.faint}>e.g. the 4-second jump</T>

      <Pn x={244} y={206} w={222} h={100} t="inhibition, on many calibres" />
      <T x={254} y={240} s={10.5} c={C.text}>trims the rate in software by</T>
      <T x={254} y={254} s={10.5} c={C.text}>skipping counts at fixed intervals</T>
      {Array.from({ length: 22 }, (_, i) => (
        <rect key={i} x={258 + i * 9} y={268} width="4" height="16" fill={i === 13 ? 'none' : C.steel} stroke={i === 13 ? C.ruby : 'none'} strokeDasharray="2 2" />
      ))}
      <T x={258 + 13 * 9 + 2} y={300} a="middle" s={10} c={C.ruby}>skipped</T>
    </F>
  )
}

// Lavet stepper: rotor centre (cx, cy), north pole pointing to angle `ang` (screen degrees)
function LavetRotor({ cx, cy, r = 16, ang = -90 }) {
  const [ax, ay] = pol(cx, cy, r, ang - 90)
  const [bx, by] = pol(cx, cy, r, ang + 90)
  const [nx, ny] = pol(cx, cy, r * 0.55, ang)
  const [sx, sy] = pol(cx, cy, r * 0.55, ang + 180)
  return (
    <g>
      <path d={`M${ax} ${ay} A${r} ${r} 0 0 1 ${bx} ${by} Z`} fill={M.magnet} />
      <path d={`M${bx} ${by} A${r} ${r} 0 0 1 ${ax} ${ay} Z`} fill={M.magnetB} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.text} strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r="3" fill={C.brassHi} />
      <T x={nx} y={ny + 4} a="middle" s={10} c="#fff" w={700}>N</T>
      <T x={sx} y={sy + 4} a="middle" s={10} c="#fff" w={700}>S</T>
    </g>
  )
}

function QwStepper() {
  const cx = 130
  const cy = 112
  return (
    <F h={330} view="Plan · Lavet-type stepper motor" scale="schematic">
      {/* stator: two pole pieces around the rotor hole, joined through the coil core */}
      <path d={`M40 236 L40 92 L${cx - 24} 92 L${cx - 24} ${cy - 10} A26 26 0 0 0 ${cx - 24} ${cy + 10} L${cx - 24} 132 L62 132 L62 236 Z`} fill="#8b8f8f" stroke="#c9cfd2" strokeWidth="0.9" />
      <path d={`M220 236 L220 92 L${cx + 24} 92 L${cx + 24} ${cy - 10} A26 26 0 0 1 ${cx + 24} ${cy + 10} L${cx + 24} 132 L198 132 L198 236 Z`} fill="#8b8f8f" stroke="#c9cfd2" strokeWidth="0.9" />
      <rect x={40} y={236} width={180} height={20} fill="#7c8080" stroke="#c9cfd2" strokeWidth="0.9" />
      <rect x={70} y={226} width={120} height={40} rx="4" fill="url(#qw-coilw)" stroke={M.copperD} />
      <circle cx={cx} cy={cy} r={20} fill={C.ground} stroke="#c9cfd2" strokeWidth="0.8" />
      <LavetRotor cx={cx} cy={cy} r={16} ang={-120} />
      <Arrow d={`M${cx - 6} ${cy - 30} A31 31 0 0 0 ${cx - 30} ${cy + 6}`} c="brass" w={1.8} />
      <T x={40} y={62} s={11} c={C.brassHi} w={600}>180° per pulse</T>
      <SL p={[cx + 8, cy + 8]} x={170} y={56} text="permanent-magnet rotor" a="start" />
      <SL p={[212, 160]} x={250} y={176} text="soft-iron stator" sub="magnetised by the coil" />
      <SL p={[150, 262]} x={250} y={262} text="coil of hair-fine wire" sub="on the stator core" />
      <line x1={70} y1={266} x2={64} y2={292} stroke={M.copper} strokeWidth="1.2" />
      <line x1={190} y1={266} x2={196} y2={292} stroke={M.copper} strokeWidth="1.2" />
      <T x={130} y={300} a="middle" s={10.5} c={C.dim}>coil ends to the IC</T>

      <Sep x1={246} y1={30} x2={246} y2={150} />
      <Tag x={256} y={40}>pulses from the IC, one a second</Tag>
      <line x1={262} y1={96} x2={466} y2={96} stroke={C.line} />
      {[0, 1, 2, 3].map((i) => {
        const x = 274 + i * 50
        const up = i % 2 === 0
        return (
          <g key={i}>
            <rect x={x} y={up ? 70 : 96} width="8" height="26" fill={up ? M.magnet : M.magnetB} />
            <T x={x + 4} y={up ? 64 : 136} a="middle" s={11} c={up ? M.magnet : M.magnetB} w={700}>
              {up ? '+' : '−'}
            </T>
            <LavetRotor cx={x + 4} cy={up ? 122 : 74} r={9} ang={up ? -90 : 90} />
          </g>
        )
      })}
      <T x={262} y={152} s={10} c={C.faint}>polarity alternates, so the rotor</T>
      <T x={262} y={164} s={10} c={C.faint}>flips back and forth by half-turns</T>
      <T x={466} y={110} a="end" s={10} c={C.faint}>1 s</T>
    </F>
  )
}

function QwTrain() {
  return (
    <F h={316} view="Plan · from rotor to hands" scale="schematic">
      <LavetRotor cx={48} cy={110} r={14} ang={-90} />
      <circle cx={48} cy={110} r={5} fill="none" stroke={C.brassHi} strokeWidth="2" strokeDasharray="1.5 1.2" />
      <Wheel cx={92} cy={86} r={30} spokes={4} />
      <circle cx={92} cy={86} r={7} fill="none" stroke={M.brassP} strokeWidth="2.4" strokeDasharray="1.5 1.2" />
      <Wheel cx={160} cy={118} r={42} spokes={5} rot={12} />
      <circle cx={160} cy={118} r={8} fill="none" stroke={M.brassP} strokeWidth="2.4" strokeDasharray="1.5 1.2" />
      <Wheel cx={240} cy={82} r={34} spokes={4} rot={30} />
      <circle cx={240} cy={82} r={7} fill="none" stroke={M.brassP} strokeWidth="2.4" strokeDasharray="1.5 1.2" />
      <Wheel cx={318} cy={120} r={44} spokes={5} rot={5} />
      <SL p={[48, 124]} x={14} y={176} text="rotor pinion" sub="half-turn per pulse" a="start" />
      <SL p={[92, 64]} x={92} y={40} text="reduction wheels" />
      <SL p={[160, 160]} x={120} y={200} text="seconds wheel" sub="one step a second" a="start" />
      <SL p={[240, 52]} x={250} y={40} text="more reduction" />
      <SL p={[318, 164]} x={250} y={200} text="minute wheel, motion work" sub="minute and hour follow" a="start" />
      <Arrow d="M36 92 A18 18 0 0 1 58 94" c="brass" w={1.4} />

      {/* the dial, showing the result */}
      <Face cx={416} cy={110} r={44} h={300} m={40} s={66} lugs={false} />
      <Lab p={[442, 96]} x={420} y={182} text="seconds hand" c={C.ruby} />

      <Sep x1={12} y1={226} x2={468} y2={226} />
      <Tag x={14} y={246}>one second, three views</Tag>
      <Chain
        x={14}
        y={256}
        w={140}
        h={44}
        gap={20}
        items={[
          [['1 pulse from the IC', 'alternating polarity'], C.steel],
          [['1 rotor half-turn', 'the Lavet stepper fires'], C.brass],
          [['1 seconds step', 'the visible “tick”'], C.ruby],
        ]}
      />
    </F>
  )
}

function QwAccuracy() {
  return (
    <F h={300} view="Chart · what moves a quartz rate" scale="schematic, no scale implied">
      <Pn x={12} y={26} w={220} h={262} t="error over a month" />
      <line x1={40} y1={70} x2={40} y2={232} stroke={C.dim} />
      <line x1={40} y1={152} x2={220} y2={152} stroke={C.dim} />
      <T x={36} y={74} a="end" s={10} c={C.faint}>+</T>
      <T x={36} y={236} a="end" s={10} c={C.faint}>−</T>
      <T x={220} y={246} a="end" s={10} c={C.faint}>time, 1 month →</T>
      <path d="M40 152 Q130 100 220 76 L220 226 Q130 200 40 152 Z" fill="rgba(194,88,99,0.14)" stroke={C.ruby} strokeDasharray="4 3" />
      <path d="M40 152 L220 144 L220 160 Z" fill="rgba(123,165,131,0.35)" stroke={C.emerald} />
      <SL p={[200, 150]} x={150} y={128} text="quartz" c={C.emerald} />
      <T x={52} y={188} s={10} c={C.emerald}>a few seconds a month,</T>
      <T x={52} y={200} s={10} c={C.emerald}>even on a cheap watch</T>
      <T x={52} y={96} s={10} c={C.ruby}>most mechanicals:</T>
      <T x={52} y={108} s={10} c={C.ruby}>a far wider spread</T>
      <T x={22} y={262} s={10} c={C.dim}>The crystal barely changes with</T>
      <T x={22} y={275} s={10} c={C.dim}>position or power state.</T>

      <Pn x={244} y={26} w={224} h={262} t="temperature: the main enemy" />
      <line x1={270} y1={70} x2={270} y2={210} stroke={C.dim} />
      <line x1={270} y1={210} x2={456} y2={210} stroke={C.dim} />
      <T x={264} y={78} a="end" s={10} c={C.faint}>rate</T>
      <T x={456} y={226} a="end" s={10} c={C.faint}>temperature →</T>
      <T x={270} y={226} s={10} c={C.faint}>cold</T>
      <path d="M276 196 Q362 34 450 196" fill="none" stroke={C.ruby} strokeWidth="2" />
      <line x1={276} y1={100} x2={450} y2={100} stroke={C.emerald} strokeWidth="2" />
      <SL p={[300, 160]} x={316} y={180} text="ordinary quartz" sub="falls off either side" c={C.ruby} />
      <T x={362} y={92} a="middle" s={10.5} c={C.emerald}>thermocompensated</T>
      <T x={254} y={250} s={10} c={C.dim}>The most accurate quartz watches</T>
      <T x={254} y={263} s={10} c={C.dim}>sense temperature and correct for</T>
      <T x={254} y={276} s={10} c={C.dim}>it, flattening the curve.</T>
    </F>
  )
}

/* ================================================================== */
/* quartz-battery · change a quartz battery                             */
/* ================================================================== */

function QwBatOpen() {
  const Back = ({ cx, cy, kind }) => (
    <g>
      <circle cx={cx} cy={cy} r={34} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={cx} cy={cy} r={26} fill="none" stroke={M.steelD} strokeWidth="0.8" />
      {kind === 'screw' &&
        Array.from({ length: 6 }, (_, i) => {
          const [x, y] = clk(cx, cy, 30, i * 60)
          return <rect key={i} x={x - 3} y={y - 3} width="6" height="6" fill={M.steelD} transform={`rotate(${i * 60} ${x} ${y})`} />
        })}
      {kind === 'snap' && <path d={`M${cx + 22} ${cy + 22} q8 0 10 -6`} fill="none" stroke={M.ink} strokeWidth="4" />}
      {kind === 'snap' && <SL p={[cx + 30, cy + 22]} x={cx + 44} y={cy + 40} text="lip" a="end" s={10} />}
      {kind === 'screws' && [45, 135, 225, 315].map((a) => {
        const [x, y] = clk(cx, cy, 29, a)
        return <Screw key={a} x={x} y={y} r={3.6} ang={a} />
      })}
    </g>
  )
  return (
    <F h={330} view="Plan · three backs, three openers" scale="schematic">
      {[
        ['screw', 'screw-down back', 'notches round the rim', 'a case opener in the notches'],
        ['snap', 'snap-on back', 'a small lip at one side', 'a case knife in the lip'],
        ['screws', 'back held by screws', 'four small screws', 'a screwdriver that fits'],
      ].map(([k, a, b, c], i) => {
        const x = 12 + i * 154
        return (
          <g key={k}>
            <Pn x={x} y={26} w={146} h={150} />
            <Back cx={x + 73} cy={84} kind={k} />
            <T x={x + 73} y={136} a="middle" s={11} c={C.text} w={600}>{a}</T>
            <T x={x + 73} y={150} a="middle" s={10} c={C.faint}>{b}</T>
            <T x={x + 73} y={166} a="middle" s={10} c={C.brassHi}>→ {c}</T>
          </g>
        )
      })}
      {/* tray section */}
      <Tag x={14} y={198}>work on a clean tray with a rim</Tag>
      <path d="M20 296 L20 262 L28 262 L28 288 L212 288 L212 262 L220 262 L220 296 Z" fill="#d8d2c2" stroke="#9c9484" />
      <rect x={70} y={270} width={90} height={18} rx="6" fill="url(#sk-steel)" />
      <CellSide x={180} y={276} w={26} h={10} />
      <path d="M40 286 q6 -14 16 -2" fill="none" stroke={C.brassHi} strokeWidth="2.2" />
      <Arrow d="M150 250 Q190 236 200 270" c="steel" w={1.3} dash="3 2" />
      <T x={30} y={248} s={10} c={C.dim}>clamp and cell stop at the rim</T>
      <Verdict x={226} y={214} ok r={8} />

      <path d="M262 288 L456 288" stroke="#5e4027" strokeWidth="5" />
      <rect x={300} y={270} width={90} height={18} rx="6" fill="url(#sk-steel)" />
      <CellSide x={436} y={296} w={26} h={10} />
      <Arrow d="M392 254 Q440 240 452 290" c="ruby" w={1.4} dash="3 2" />
      <T x={262} y={248} s={10} c={C.dim}>bare table: the cell rolls off</T>
      <Verdict x={456} y={214} ok={false} r={8} />
      <T x={14} y={320} s={10} c={C.faint}>Full method for each back: Cases › Open the caseback.</T>
    </F>
  )
}

function QwBatBeside() {
  const cx = 140
  const cy = 150
  return (
    <F h={330} view="Plan · look before a tool goes in" scale="schematic layout">
      <circle cx={cx} cy={cy} r={104} fill={M.plate} stroke={C.brass} strokeWidth="1.4" />
      <rect x={cx + 102} y={cy - 4} width={30} height={8} rx="1" fill="url(#sk-steel)" />
      <path d={`M${cx - 92} ${cy + 30} A96 96 0 0 1 ${cx + 10} ${cy - 96} L${cx - 10} ${cy - 10} Z`} fill={M.board} stroke={C.steel} />
      <circle cx={cx + 20} cy={cy + 34} r={44} fill="url(#qw-cell)" stroke="#4e5f6a" />
      <T x={cx + 20} y={cy + 40} a="middle" s={14} c="#2b343a" w={700}>+</T>
      {/* plastic isolator */}
      <path d={`M${cx - 30} ${cy + 66} A52 52 0 0 0 ${cx + 66} ${cy + 64}`} fill="none" stroke={M.plastic} strokeWidth="5" opacity="0.9" />
      {/* clamp, and the coil right beside it */}
      <path d={`M${cx + 92} ${cy - 30} L${cx + 50} ${cy + 6}`} stroke={C.brassHi} strokeWidth="6" strokeLinecap="round" />
      <Screw x={cx + 92} y={cy - 30} r={5} ang={20} />
      <g transform={`translate(${cx + 58} ${cy - 50}) rotate(-38)`}>
        <rect x={-30} y={-8} width={60} height={16} rx="2" fill="url(#qw-coilw)" stroke={M.copperD} />
      </g>
      {/* the danger zone a slip reaches */}
      <path d={`M${cx + 72} ${cy - 12} m-36 0 a36 36 0 1 0 72 0 a36 36 0 1 0 -72 0`} fill="rgba(194,88,99,0.10)" stroke={C.ruby} strokeDasharray="4 3" />
      <G x={cx + 72} y={cy - 12} ang={30}>
        <Tweezers c={M.plastic} gap={4} len={70} w={3.4} />
      </G>
      <SL p={[cx + 40, cy - 60]} x={cx + 6} y={34} text="coil, right beside the clamp" c={M.copper} />
      <SL p={[cx + 50, cy + 6]} x={cx - 50} y={cy - 40} text="clamp" />
      <SL p={[cx + 100, cy + 10]} x={300} y={cy + 30} text="a slip reaches the coil" c={C.ruby} />
      <SL p={[cx - 20, cy + 70]} x={20} y={cy + 128} text="plastic isolator: note how it sits" c={C.text} a="start" />

      <Pn x={300} y={26} w={168} h={120} t="brace the hand" />
      <rect x={316} y={112} width={136} height={18} rx="3" fill="#596770" stroke={M.steelD} />
      <rect x={350} y={102} width={68} height={10} fill="url(#qw-mov)" stroke={C.struct} />
      <G x={334} y={112} ang={-60}>
        <Finger w={13} len={46} />
      </G>
      <G x={384} y={102} ang={30}>
        <Tweezers c={M.plastic} gap={2} len={28} w={2.4} />
      </G>
      <T x={316} y={60} s={10} c={C.dim}>a finger on the holder</T>
      <T x={316} y={72} s={10} c={C.dim}>keeps any slip small</T>
      <T x={384} y={143} a="middle" s={10} c={C.faint}>movement holder</T>

      <Pn x={300} y={196} w={168} h={124} t="dead after a change?" tc={C.ruby} />
      <T x={310} y={228} s={10} c={C.dim}>field reports on this family:</T>
      {['missing isolator', 'reversed cell', 'corrosion', 'a bad new cell'].map((t, i) => (
        <g key={t}>
          <circle cx={316} cy={243 + i * 18} r="2.4" fill={C.ruby} />
          <T x={324} y={247 + i * 18} s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
      <T x={14} y={322} s={10} c={C.faint}>Example: on a Ronda 515 the coil sits beside the clamp.</T>
    </F>
  )
}

function QwBatLift() {
  return (
    <F h={322} view="Section · release, lift, note the face" scale="schematic, magnified">
      {/* movement section with cell seat */}
      <rect x={20} y={150} width={280} height={36} fill="url(#qw-mov)" stroke={C.struct} />
      <rect x={90} y={128} width={110} height={22} fill={C.ground} />
      <path d="M96 150 L96 146 L124 146 L130 150" fill="none" stroke={C.brassHi} strokeWidth="2" />
      <T x={70} y={204} s={10} c={C.dim}>negative contact under the cell</T>
      <CellSide x={104} y={110} w={84} h={22} />
      {/* clamp swung off */}
      <path d="M260 126 L214 120" stroke={C.brassHi} strokeWidth="5" strokeLinecap="round" />
      <path d="M260 126 L210 140" stroke={C.brassHi} strokeWidth="5" strokeLinecap="round" opacity="0.25" strokeDasharray="3 3" />
      <Screw x={262} y={128} r={6} />
      <Arrow d="M224 154 A40 40 0 0 0 214 110" c="brass" w={1.6} />
      <Num x={240} y={90} n={1} />
      <T x={252} y={94} s={10.5} c={C.text}>unclip or unscrew the clamp</T>
      <G x={188} y={118} ang={20}>
        <Tweezers c={M.plastic} gap={4} tip={3} len={50} w={3.4} />
      </G>
      <Arrow a={[146, 104]} b={[146, 62]} c="brass" w={1.8} />
      <Num x={164} y={56} n={2} />
      <T x={176} y={60} s={10.5} c={C.text}>lift the old cell out</T>
      <T x={20} y={70} s={10.5} c={C.brassHi}>note which face is up</T>
      <T x={20} y={83} s={10} c={C.dim}>usually +</T>
      <line x1={84} y1={80} x2={122} y2={112} stroke={C.brassHi} strokeWidth="0.8" />
      <T x={20} y={234} s={10.5} c={C.text} w={600}>Plastic or anti-static tweezers.</T>
      <T x={20} y={248} s={10.5} c={C.dim}>Never force a clamp: if it resists, look for a screw.</T>

      <Pn x={316} y={160} w={152} h={150} t="never" tc={C.ruby} ok={false} />
      <rect x={330} y={262} width={124} height={16} fill="url(#qw-mov)" stroke={C.struct} />
      <rect x={350} y={256} width={6} height={6} fill={C.brassHi} />
      <CellSide x={362} y={240} w={70} h={18} />
      <G x={354} y={256} ang={-14}>
        <path d="M0 0 L-6 -56" stroke={C.steel} strokeWidth="3" strokeLinecap="round" />
      </G>
      <G x={392} y={240} ang={10}>
        <path d="M0 0 L6 -54" stroke={C.steel} strokeWidth="3" strokeLinecap="round" />
      </G>
      <path d="M346 236 L352 228 L348 226 L356 214" fill="none" stroke={C.ruby} strokeWidth="1.6" />
      <T x={324} y={296} s={10} c={C.dim}>steel tips bridge + and −:</T>
      <T x={324} y={308} s={10} c={C.ruby}>a short can damage the circuit</T>
    </F>
  )
}

function QwBatFit() {
  return (
    <F h={318} view="Comparison · handling and seating the new cell" scale="schematic">
      <Pn x={12} y={26} w={148} h={150} t="by the edge" tc={C.emerald} ok />
      <ellipse cx={86} cy={120} rx={42} ry={14} fill="#aebcc5" stroke="#4e5f6a" />
      <rect x={44} y={108} width={84} height={12} fill="url(#sk-steelH)" />
      <ellipse cx={86} cy={108} rx={42} ry={14} fill="url(#qw-cell)" stroke="#4e5f6a" />
      <T x={86} y={112} a="middle" s={11} c="#2b343a" w={700}>+</T>
      <G x={44} y={114} ang={-70}><Tweezers c={M.plastic} gap={3} len={34} w={3} /></G>
      <G x={128} y={114} ang={70}><Tweezers c={M.plastic} gap={3} len={34} w={3} /></G>
      <T x={86} y={156} a="middle" s={10} c={C.dim}>faces stay clean</T>

      <Pn x={168} y={26} w={148} h={150} t="on the face" tc={C.ruby} ok={false} />
      <ellipse cx={242} cy={120} rx={42} ry={14} fill="#aebcc5" stroke="#4e5f6a" />
      <rect x={200} y={108} width={84} height={12} fill="url(#sk-steelH)" />
      <ellipse cx={242} cy={108} rx={42} ry={14} fill="url(#qw-cell)" stroke="#4e5f6a" />
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={252} cy={106} rx={4 + i * 3.4} ry={2 + i * 1.5} fill="none" stroke="rgba(120,90,60,0.6)" strokeWidth="0.8" />
      ))}
      <G x={232} y={96} ang={160}><Finger w={18} len={50} /></G>
      <T x={242} y={158} a="middle" s={10} c={C.dim}>a print on the face:</T>
      <T x={242} y={171} a="middle" s={10} c={C.ruby}>discharge and corrosion</T>

      <Pn x={324} y={26} w={144} h={150} t="same way up" />
      <CellTop cx={396} cy={96} r={34} />
      <T x={396} y={150} a="middle" s={10.5} c={C.text}>seat it as the old one sat</T>
      <T x={396} y={164} a="middle" s={10} c={C.faint}>check your note or photo</T>

      <Tag x={14} y={198}>then the clamp</Tag>
      {[[20, true], [250, false]].map(([x, ok]) => (
        <g key={x}>
          <rect x={x} y={262} width={200} height={20} fill="url(#qw-mov)" stroke={C.struct} />
          <CellSide x={x + 40} y={240} w={90} h={22} />
          <Screw x={x + 176} y={256} r={6} />
          {ok ? (
            <path d={`M${x + 176} 252 L${x + 120} 240`} stroke={C.brassHi} strokeWidth="5" strokeLinecap="round" />
          ) : (
            <path d={`M${x + 176} 252 L${x + 120} 222`} stroke={C.brassHi} strokeWidth="5" strokeLinecap="round" />
          )}
          <Verdict x={x + 192} y={218} ok={ok} r={8} />
          <T x={x} y={302} s={10.5} c={ok ? C.text : C.dim}>{ok ? 'sits flat and firm on the cell' : 'standing proud: poor contact'}</T>
        </g>
      ))}
    </F>
  )
}

function QwBatTest() {
  const cx = 96
  const cy = 150
  const r = 72
  return (
    <F h={306} view="Check · before the back goes on" scale="schematic">
      <circle cx={cx} cy={cy} r={r} fill={M.dialDark} stroke={C.struct} />
      {Array.from({ length: 60 }, (_, i) => {
        const [a, b] = clk(cx, cy, r - 4, i * 6)
        const [c2, d2] = clk(cx, cy, r - (i % 5 ? 9 : 15), i * 6)
        return <line key={i} x1={a} y1={b} x2={c2} y2={d2} stroke={i % 5 ? C.faint : C.dim} strokeWidth={i % 5 ? 0.8 : 1.6} />
      })}
      {[60, 66, 72].map((d, i) => {
        const [x, y] = clk(cx, cy, r - 18, d)
        return <line key={d} x1={cx} y1={cy} x2={x} y2={y} stroke={C.ruby} strokeWidth="1.3" opacity={i === 2 ? 1 : 0.3} />
      })}
      <circle cx={cx} cy={cy} r={3} fill={C.ruby} />
      <T x={cx} y={56} a="middle" s={11.5} c={C.brassHi} w={600}>is the seconds hand ticking?</T>
      <T x={cx} y={250} a="middle" s={10.5} c={C.text}>one step each second</T>

      <Bx x={210} y={36} w={120} h={40} l={['Ticking', 'carry on and close']} c={C.emerald} />
      <Verdict x={344} y={56} ok r={8} />
      <Bx x={210} y={102} w={120} h={40} l={['Not ticking', 'don’t assume a fault']} c={C.ruby} />
      <Arrow a={[270, 144]} b={[270, 160]} c="brass" w={1.6} />
      <Row x={214} y={180} n={1} t="Reseat the cell" sub="same way up as the old one" />
      <Arrow a={[270, 202]} b={[270, 214]} c="brass" w={1.6} />
      <Row x={214} y={232} n={2} t="Check the clamp contact" sub="pressing on the cell, not lifted" />
      <Arrow a={[270, 256]} b={[270, 266]} c="brass" w={1.6} />
      <Bx x={210} y={268} w={258} h={26} l={['Only then: Diagnose a stopped quartz watch']} c={C.brass} s={10.5} />
      <line x1={174} y1={140} x2={206} y2={122} stroke={C.struct} strokeWidth="0.8" />
      <line x1={174} y1={110} x2={206} y2={60} stroke={C.struct} strokeWidth="0.8" />
    </F>
  )
}

function QwBatMinute() {
  const x0 = 26
  const w = 430
  const sx = (t) => x0 + (t / 120) * w
  const ev = []
  for (let t = 4; t <= 60; t += 4) ev.push(t, t + 0.4, t + 0.8, t + 1.2)
  for (let t = 61; t <= 120; t += 1) ev.push(t)
  return (
    <F h={322} view="Timeline · a fresh cell's first minutes" scale="time in seconds">
      <Tag x={14} y={42}>seconds hand after a fresh cell goes in</Tag>
      <line x1={x0} y1={94} x2={x0 + w} y2={94} stroke={C.line} />
      {ev.map((t, i) => (
        <rect key={i} x={sx(t) - 0.9} y={78} width="1.8" height="16" fill={t <= 61 ? C.ruby : C.emerald} />
      ))}
      {[0, 30, 60, 90, 120].map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={94} x2={sx(t)} y2={99} stroke={C.faint} />
          <T x={sx(t)} y={112} a="middle" s={10} c={C.faint} mono>{t}</T>
        </g>
      ))}
      <line x1={sx(60)} y1={56} x2={sx(60)} y2={98} stroke={C.brass} strokeDasharray="3 2" />
      <T x={sx(60)} y={66} a="middle" s={10.5} c={C.brassHi}>voltage check</T>
      <T x={sx(30)} y={70} a="middle" s={10} c={C.ruby}>4-second jump carries on</T>
      <T x={sx(92)} y={70} a="middle" s={10} c={C.emerald}>normal 1-second steps</T>
      <T x={x0} y={130} s={10.5} c={C.dim}>Most movements check their voltage only about once a minute, so wait before you judge.</T>

      <Pn x={12} y={146} w={226} h={110} t="some take longer" />
      <T x={22} y={180} s={11} c={C.text} w={600}>ETA 251.264</T>
      <T x={22} y={194} s={10.5} c={C.dim}>its sheet gives a 60-minute</T>
      <T x={22} y={207} s={10.5} c={C.dim}>delay on the warning</T>
      <rect x={22} y={222} width={204} height={10} rx="3" fill="rgba(208,168,79,0.18)" stroke={C.brass} />
      <rect x={22} y={222} width={3.4} height={10} fill={C.brassHi} />
      <T x={22} y={248} s={10} c={C.faint}>1 min</T>
      <T x={226} y={248} a="end" s={10} c={C.faint}>60 min</T>

      <Pn x={246} y={146} w={222} h={110} t="multi-function watch" />
      <T x={256} y={180} s={10.5} c={C.text}>odd hands or displays after</T>
      <T x={256} y={193} s={10.5} c={C.text}>a cell change: the IC needs</T>
      <T x={256} y={206} s={10.5} c={C.text}>a restart</T>
      <T x={256} y={226} s={10} c={C.brassHi}>find the reset on the calibre’s sheet</T>
      <T x={256} y={240} s={10} c={C.faint}>contact varies by maker; not every</T>
      <T x={256} y={252} s={10} c={C.faint}>movement has one</T>
      <T x={14} y={282} s={10.5} c={C.dim}>Own a watch tester? Witschi recommends measuring current</T>
      <T x={14} y={296} s={10.5} c={C.dim}>at every battery change: it shows faults that cut the last</T>
      <T x={14} y={310} s={10.5} c={C.dim}>cell’s life short.</T>
    </F>
  )
}

function QwBatSeal() {
  return (
    <F h={326} view="Section · caseback, gasket and case" scale="schematic, magnified">
      {/* caseback with its collar */}
      <path d="M24 84 L262 84 L262 98 L148 98 L148 150 L132 150 L132 98 L24 98 Z" fill="url(#qw-cut)" stroke="#4e5f6a" />
      {/* case middle, right half section */}
      <path d="M24 102 L126 102 L126 210 L24 210 Z" fill="url(#qw-cut)" stroke="#4e5f6a" />
      <rect x={148} y={160} width={114} height={40} fill="url(#qw-mov)" stroke={C.struct} />
      <T x={204} y={184} a="middle" s={10} c={C.dim}>movement</T>
      {/* O-ring in the collar groove, squeezed against the case wall */}
      <rect x={126} y={116} width={8} height={16} fill={C.ground} />
      <ellipse cx={130.5} cy={124} rx={5} ry={7} fill={M.gasket} />
      <ellipse cx={130.5} cy={124} rx={8} ry={10} fill="none" stroke={M.grease} strokeWidth="1.4" strokeDasharray="2 2" />
      <Arrow a={[200, 44]} b={[200, 78]} c="brass" w={1.8} />
      <T x={210} y={52} s={10.5} c={C.text}>refit squarely</T>
      <T x={250} y={78} a="end" s={10} c={C.dim}>caseback</T>
      <T x={30} y={224} s={10} c={C.dim}>case</T>
      <SL p={[126, 108]} x={20} y={54} text="gasket seat wiped clean" a="start" />
      <SL p={[134, 130]} x={150} y={226} text="O-ring: cleaned, lightly greased" sub="with silicone, or replaced" c={M.gasket} a="start" />
      {[
        ['Wipe the gasket seat', 'no old grease, no grit'],
        ['Grease the O-ring', 'silicone, lightly, or a new one'],
        ['Refit the back', 'evenly all the way round'],
        ['Clean the crystal', 'Rodico or a cloth'],
      ].map(([a, b], i) => (
        <Row key={a} x={288} y={50 + i * 40} n={i + 1} t={a} sub={b} />
      ))}
      <rect x={14} y={254} width={454} height={62} rx="8" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <T x={26} y={274} s={11} c={C.ruby} w={600}>A battery change breaks the water seal.</T>
      <T x={26} y={290} s={10.5} c={C.text}>Unless the gasket is cleaned or greased and the watch pressure-tested,</T>
      <T x={26} y={304} s={10.5} c={C.text}>treat it as no longer water-resistant.</T>
    </F>
  )
}

/* ================================================================== */
/* quartz-diagnose · diagnose a stopped quartz watch                    */
/* ================================================================== */

function QwDxCell() {
  return (
    <F h={300} view="Test · start with a known-good cell" scale="schematic">
      <Meter x={40} y={40} read="1.55" unit="V" mode="V⎓" />
      <Lead2 a={[62, 136]} b={[150, 236]} c={C.ruby} />
      <Lead2 a={[96, 136]} b={[214, 252]} c="#888" />
      <CellSide x={140} y={236} w={96} h={24} />
      <G x={150} y={238} ang={-20}><ProbePen c={C.ruby} len={58} /></G>
      <G x={214} y={258} ang={40}><ProbePen c="#555" len={58} /></G>
      <T x={188} y={286} a="middle" s={10.5} c={C.dim}>a fresh silver-oxide cell</T>
      <SL p={[110, 62]} x={140} y={50} text="about 1.55 V" sub="red probe on +, black on −" c={C.brassHi} a="start" />

      <Pn x={276} y={26} w={192} h={262} t="why first" />
      <T x={288} y={62} s={10.5} c={C.text}>Of all stopped quartz</T>
      <T x={288} y={76} s={10.5} c={C.text}>watches, a fresh cell</T>
      <T x={288} y={90} s={10.5} c={C.text}>alone fixes the large majority.</T>
      <rect x={288} y={110} width={168} height={22} rx="4" fill="rgba(255,255,255,0.04)" stroke={C.line} />
      <rect x={288} y={110} width={136} height={22} rx="4" fill="rgba(123,165,131,0.35)" stroke={C.emerald} />
      <T x={294} y={125} s={10} c={C.text}>fixed by the cell</T>
      <T x={288} y={146} s={10} c={C.faint}>schematic, not a measured share</T>
      <Sep x1={288} y1={162} x2={456} y2={162} />
      <T x={288} y={184} s={10.5} c={C.text} w={600}>Then work down:</T>
      {['crown and hands', 'seconds-hand pattern', 'contacts', 'reset pad', 'module'].map((t, i) => (
        <Row key={t} x={292} y={206 + i * 17} t={`${i + 1}. ${t}`} c={i === 4 ? C.ruby : C.dim} />
      ))}
    </F>
  )
}

function QwDxCrown() {
  // side view of a case with crown; out = pulled distance
  const Side = ({ x, y, out, dirt }) => (
    <g>
      <rect x={x} y={y} width={120} height={34} rx="10" fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={x + 6} y={y - 6} width={108} height={8} rx="3" fill="url(#qw-acr)" stroke={M.glass} strokeWidth="0.6" />
      <rect x={x + 120} y={y + 15} width={4 + out} height={4} fill="url(#sk-steelH)" />
      <rect x={x + 122 + out} y={y + 8} width={12} height={18} rx="3" fill="url(#qw-knurl)" stroke={M.steelD} strokeWidth="0.6" />
      {dirt && [0, 1, 2].map((i) => <circle key={i} cx={x + 123} cy={y + 11 + i * 6} r="1.8" fill="#8a7a55" />)}
    </g>
  )
  return (
    <F h={330} view="Check · two free checks before any meter" scale="schematic">
      <Tag x={14} y={42}>1 · is the crown pushed fully in?</Tag>
      <Side x={20} y={64} out={0} />
      <Verdict x={190} y={80} ok r={8} />
      <T x={204} y={78} s={10.5} c={C.text}>in: the motor pulses</T>
      <T x={204} y={91} s={10} c={C.faint}>a healthy watch runs</T>
      <Side x={20} y={124} out={12} />
      <T x={204} y={138} s={10.5} c={C.text}>pulled: pulses stop on purpose</T>
      <T x={204} y={151} s={10} c={C.faint}>so a healthy watch looks dead</T>
      <Side x={20} y={184} out={5} dirt />
      <SL p={[143, 196]} x={204} y={198} text="dirt in the gap holds it out" sub="clean the gap if it won’t seat" c={C.ruby} a="start" />

      <Sep x1={12} y1={232} x2={468} y2={232} />
      <Tag x={14} y={252}>2 · are the hands touching anything?</Tag>
      {/* section: dial, hands, crystal; one dial-down */}
      {[[20, 'dial up'], [250, 'dial down']].map(([x, l], k) => (
        <g key={x}>
          <rect x={x} y={k ? 268 : 306} width={200} height={5} fill={M.dial} />
          <rect x={x} y={k ? 306 : 266} width={200} height={6} fill="url(#qw-acr)" stroke={M.glass} strokeWidth="0.6" />
          <rect x={x + 96} y={k ? 273 : 286} width={6} height={20} fill={C.brass} />
          {k === 0 ? (
            <g>
              <line x1={x + 99} y1={300} x2={x + 30} y2={305} stroke={C.brassHi} strokeWidth="2" />
              <line x1={x + 99} y1={294} x2={x + 180} y2={293} stroke={C.brassHi} strokeWidth="2" />
              <line x1={x + 99} y1={287} x2={x + 170} y2={273} stroke={C.ruby} strokeWidth="1.4" />
              <circle cx={x + 30} cy={305} r="4" fill="none" stroke={C.ruby} strokeWidth="1.4" />
              <circle cx={x + 170} cy={273} r="4" fill="none" stroke={C.ruby} strokeWidth="1.4" />
              <T x={x + 20} y={326} s={10} c={C.ruby}>hand on dial</T>
              <T x={x + 120} y={326} s={10} c={C.ruby}>hand on crystal</T>
            </g>
          ) : (
            <g>
              <line x1={x + 99} y1={279} x2={x + 180} y2={280} stroke={C.brassHi} strokeWidth="2" />
              <line x1={x + 99} y1={286} x2={x + 170} y2={304} stroke={C.ruby} strokeWidth="1.4" />
              <circle cx={x + 170} cy={304} r="4" fill="none" stroke={C.ruby} strokeWidth="1.4" />
              <T x={x + 20} y={326} s={10} c={C.dim}>turned over, a hand can sag onto the glass</T>
            </g>
          )}
          {k === 1 && <T x={x + 200} y={262} a="end" s={10} c={C.faint}>{l}</T>}
        </g>
      ))}
    </F>
  )
}

function QwDxSeconds() {
  const one = Array.from({ length: 12 }, (_, i) => i + 1)
  const jump = [4, 4.2, 4.4, 4.6, 8, 8.2, 8.4, 8.6, 12, 12.2]
  return (
    <F h={300} view="Chart · twelve seconds of the seconds hand" scale="time in seconds">
      <TickRow x={150} y={66} w={300} secs={12} events={one} c={C.emerald} />
      <Note x={14} y={50} head="Steady 1-second steps" lines={['running normally']} c={C.faint} hc={C.emerald} s={10.5} lh={13} />
      <TickRow x={150} y={136} w={300} secs={12} events={jump} c={C.brassHi} />
      <Note x={14} y={118} head="A 4-second jump" lines={['moves once every 4 s:', 'low-battery warning']} c={C.faint} hc={C.brassHi} s={10.5} lh={13} />
      <TickRow x={150} y={206} w={300} secs={12} events={[]} c={C.ruby} />
      <T x={300} y={198} a="middle" s={10.5} c={C.ruby}>no movement at all</T>
      <Note x={14} y={188} head="A totally still hand" lines={['no power, or a', 'jammed train']} c={C.faint} hc={C.ruby} s={10.5} lh={13} />
      {[0, 4, 8, 12].map((t) => (
        <T key={t} x={150 + t * 25} y={222} a="middle" s={10} c={C.faint} mono>{t}</T>
      ))}
      <rect x={14} y={240} width={454} height={50} rx="8" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <T x={26} y={259} s={10.5} c={C.text}>New cell, still jumping? Wait a few minutes: many chips re-check the</T>
      <T x={26} y={274} s={10.5} c={C.text}>voltage only about once a minute. Then contacts, then mechanical load.</T>
    </F>
  )
}

function QwDxStutter() {
  return (
    <F h={334} view="Flow · new cell, still jumping" scale="schematic">
      <Bx x={14} y={30} w={200} h={36} l={['Fresh cell still jumps', 'or stutters']} c={C.brass} />
      <Arrow a={[114, 68]} b={[114, 84]} c="brass" w={1.6} />
      <Bx x={14} y={86} w={200} h={36} l={['Give it a minute', 'voltage is checked about once a minute']} />
      <Arrow a={[114, 124]} b={[114, 140]} c="brass" w={1.6} />
      <Bx x={14} y={142} w={200} h={36} l={['Still at it?', 'don’t condemn the module yet']} c={C.ruby} />
      <Arrow a={[114, 180]} b={[114, 196]} c="brass" w={1.6} />
      <Tag x={14} y={210}>look for mechanical load</Tag>
      {[
        ['Hand clearance', 'hands that touch'],
        ['Train under a loupe', 'sluggish gears'],
        ['Rotor under a loupe', 'steel particles: clean them out'],
      ].map(([a, b], i) => (
        <Row key={a} x={22} y={232 + i * 30} n={i + 1} t={a} sub={b} />
      ))}
      <Bx x={14} y={316 - 6} w={200} h={20} l={['Only then: suspect the module']} c={C.struct} s={10.5} />

      {/* rotor with particles, magnified */}
      <Ring x={350} y={110} r={74} />
      <circle cx={350} cy={110} r={44} fill={M.plate} />
      <LavetRotor cx={350} cy={110} r={30} ang={-60} />
      {[[318, 76], [384, 84], [330, 146], [392, 128]].map(([x, y], i) => (
        <path key={i} d={`M${x - 3} ${y - 2} l6 1 l-2 4 l-5 -1 Z`} fill="#9aa7af" stroke="#d6dde1" strokeWidth="0.6" />
      ))}
      <T x={350} y={204} a="middle" s={10.5} c={C.text}>steel particles at the rotor</T>
      <T x={350} y={218} a="middle" s={10} c={C.faint}>the magnet pulls them in</T>
      <Pn x={236} y={236} w={232} h={92} t="why it stutters" />
      <T x={246} y={268} s={10.5} c={C.text}>Some movements raise motor</T>
      <T x={246} y={282} s={10.5} c={C.text}>power when they miss a step, so</T>
      <T x={246} y={296} s={10.5} c={C.text}>a stiff train shows up as stutter</T>
      <T x={246} y={310} s={10.5} c={C.brassHi}>and high current.</T>
    </F>
  )
}

function QwDxContacts() {
  const cx = 110
  const cy = 150
  const q = QP(cx, cy, 90)
  return (
    <F h={322} view="Plan · clamp, contacts and corrosion" scale="schematic">
      <QMod cx={cx} cy={cy} r={90} crust />
      <SL p={q.c(48, 6)} x={220} y={50} text="clamp contact" sub="green crust, bent tab?" c={M.crust} a="start" />
      <SL p={q.c(26, 58)} x={220} y={226} text="negative contact point" c={M.crust} a="start" />
      <Ring x={380} y={140} r={70} />
      <rect x={322} y={150} width={116} height={24} fill="url(#qw-mov)" />
      <rect x={334} y={124} width={74} height={26} rx="4" fill="url(#sk-steelH)" stroke={M.steelD} />
      <path d="M440 120 L400 128 L392 134" fill="none" stroke={C.brassHi} strokeWidth="5" strokeLinecap="round" />
      <ellipse cx={398} cy={132} rx={11} ry={7} fill="url(#qw-crust)" />
      <path d="M346 150 l14 -6" stroke={C.brassHi} strokeWidth="3" />
      <ellipse cx={352} cy={150} rx={10} ry={4} fill="url(#qw-crust)" />
      <T x={380} y={62} a="middle" s={10.5} c={C.text}>×10 at the clamp</T>
      <T x={380} y={241} a="middle" s={10} c={M.crust}>green fuzz: leaked electrolyte</T>
      <G x={262} y={300} ang={-25}><GlassPen len={50} /></G>
      <T x={282} y={284} s={10.5} c={C.text}>fibreglass pen, or Rodico</T>
      <T x={282} y={298} s={10.5} c={C.text}>then: the clamp presses firmly</T>
      <T x={282} y={314} s={10} c={C.ruby}>clean thoroughly: it spreads</T>
    </F>
  )
}

function QwDxReset() {
  const cx = 118
  const cy = 160
  const q = QP(cx, cy, 100)
  const ac = q.ac
  const targets = [
    [q.c(46, -44), 'circuit cover'],
    [q.c(46, 6), 'battery clamp'],
    [q.c(-56, -30), 'a switch spring'],
  ]
  return (
    <F h={326} view="Plan · the AC (reset) pad" scale="schematic, calibre-specific">
      <QMod cx={cx} cy={cy} r={100} ac />
      {targets.map(([p, l], i) => (
        <g key={l}>
          <path d={`M${ac[0]} ${ac[1]} Q${(ac[0] + p[0]) / 2 - 30} ${(ac[1] + p[1]) / 2 - 20} ${p[0]} ${p[1]}`} fill="none" stroke={C.brass} strokeWidth="1.3" strokeDasharray="4 3" />
          <circle cx={p[0]} cy={p[1]} r="4" fill="none" stroke={C.brassHi} strokeWidth="1.6" />
          <T x={p[0] + 6} y={p[1] - 6} s={10} c={C.brassHi}>{String.fromCharCode(97 + i)}</T>
        </g>
      ))}
      <Pn x={250} y={26} w={218} h={160} t="briefly short AC to…" />
      {targets.map(([, l], i) => (
        <T key={l} x={262} y={64 + i * 18} s={11} c={C.text}>{`${String.fromCharCode(97 + i)}  ${l}`}</T>
      ))}
      <T x={262} y={128} s={10.5} c={C.dim}>Which one? It varies by calibre.</T>
      <T x={262} y={144} s={10.5} c={C.dim}>Check the calibre’s sheet first.</T>
      <T x={262} y={168} s={10.5} c={C.ruby}>Not every movement has one.</T>
      <Pn x={250} y={196} w={218} h={118} t="what it does" />
      <T x={262} y={230} s={10.5} c={C.text}>Resets the IC, and can restart</T>
      <T x={262} y={244} s={10.5} c={C.text}>a “sulking” movement.</T>
      <T x={262} y={266} s={10} c={C.faint}>dashed lines: alternatives, never</T>
      <T x={262} y={279} s={10} c={C.faint}>all three on one movement</T>
      <T x={262} y={300} s={10} c={C.faint}>positions here are schematic</T>
    </F>
  )
}

function QwDxDecide() {
  const Q = ({ y, l, n }) => (
    <g>
      <Num x={30} y={y + 18} n={n} />
      <Bx x={46} y={y} w={200} h={36} l={l} />
      <Arrow a={[248, y + 18]} b={[300, y + 18]} c="emerald" w={1.5} />
      <T x={262} y={y + 12} s={10} c={C.emerald}>runs</T>
      <Bx x={302} y={y + 4} w={166} h={28} l={['fixed: no module needed']} c={C.emerald} s={10.5} />
    </g>
  )
  return (
    <F h={316} view="Decision · repair or replace the module" scale="schematic">
      <Q y={30} n={1} l={['Known-good cell', 'about 1.55 V']} />
      <Arrow a={[146, 68]} b={[146, 84]} c="ruby" w={1.5} />
      <T x={154} y={80} s={10} c={C.ruby}>still dead</T>
      <Q y={86} n={2} l={['Clean contacts', 'clamp pressing firmly']} />
      <Arrow a={[146, 124]} b={[146, 140]} c="ruby" w={1.5} />
      <T x={154} y={136} s={10} c={C.ruby}>still dead</T>
      <Q y={142} n={3} l={['Reset (AC), if it has one', 'as the calibre sheet says']} />
      <Arrow a={[146, 180]} b={[146, 200]} c="ruby" w={1.5} />
      <T x={154} y={194} s={10} c={C.ruby}>all three fail</T>
      <Bx x={46} y={202} w={422} h={40} l={['The movement itself has failed', 'for most quartz calibres: a fresh module, not component-level repair']} c={C.ruby} f="rgba(194,88,99,0.08)" />
      <QMod cx={110} cy={286} r={24} label="" />
      <Arrow a={[146, 286]} b={[196, 286]} c="brass" w={1.8} />
      <T x={206} y={282} s={11} c={C.text} w={600}>swap in the same calibre</T>
      <T x={206} y={296} s={10} c={C.faint}>see Swap a quartz movement (module)</T>
    </F>
  )
}

function QwDxEarly() {
  return (
    <F h={336} view="Flow · new cells die early" scale="Witschi’s order">
      <T x={14} y={42} s={10.5} c={C.dim}>A cell that dies far too soon is a fault in the watch, not a bad cell.</T>
      <Bx x={14} y={54} w={190} h={38} l={['1  Measure current', 'against the maker’s figure']} c={C.brass} />
      <Arrow a={[109, 94]} b={[109, 110]} c="ruby" w={1.5} />
      <T x={116} y={106} s={10} c={C.ruby}>high</T>
      <Bx x={14} y={112} w={190} h={38} l={['2  Measure the coil', 'resistance, cell out']} c={C.brass} />
      <Arrow a={[206, 124]} b={[262, 108]} c="ruby" w={1.4} />
      <Bx x={264} y={86} w={204} h={34} l={['open', 'broken coil']} c={C.ruby} s={10.5} />
      <Arrow a={[206, 138]} b={[262, 146]} c="ruby" w={1.4} />
      <Bx x={264} y={130} w={204} h={34} l={['far below the range', 'shorted turns']} c={C.ruby} s={10.5} />
      <Arrow a={[109, 152]} b={[109, 176]} c="emerald" w={1.5} />
      <T x={116} y={168} s={10} c={C.emerald}>coil fine</T>
      <Bx x={14} y={178} w={190} h={38} l={['3  Negative contact tongue', 'touching the board?']} c={C.brass} />
      <Arrow a={[109, 218]} b={[109, 234]} c="emerald" w={1.5} />
      <Bx x={14} y={236} w={190} h={38} l={['4  Stiff train or', 'hands that touch?']} c={C.brass} />
      {/* tongue inset */}
      <Pn x={236} y={178} w={232} h={96} t="3 · a short at the tongue" tc={C.ruby} />
      <rect x={250} y={250} width={204} height={10} fill={M.board} stroke={C.steel} />
      <T x={448} y={269} a="end" s={10} c={C.faint}>circuit board</T>
      <CellSide x={300} y={206} w={90} h={20} />
      <path d="M270 238 L300 238 L330 228" fill="none" stroke={C.brassHi} strokeWidth="2.2" />
      <path d="M270 238 L300 238 L340 250" fill="none" stroke={C.ruby} strokeWidth="2.2" />
      <circle cx={340} cy={250} r="5" fill="none" stroke={C.ruby} strokeWidth="1.5" />
      <T x={352} y={244} s={10} c={C.ruby}>bent onto it: short</T>
      <Sep x1={12} y1={288} x2={468} y2={288} />
      <T x={14} y={306} s={10.5} c={C.text}>No watch tester? A fresh module may be the cheaper test.</T>
      <T x={14} y={322} s={10} c={C.faint}>How to take each reading: Electrical testing: limits, meters and the 0.40 V rule.</T>
    </F>
  )
}

/* ================================================================== */
/* quartz-test · test a quartz movement with a multimeter               */
/* ================================================================== */

function QwMtVolt() {
  const cx = 228
  const cy = 196
  const q = QP(cx, cy, 80)
  return (
    <F h={330} view="Test · cell voltage, in circuit" scale="schematic">
      <Meter x={20} y={36} read="1.55" unit="V" mode="2 V⎓" />
      <QMod cx={cx} cy={cy} r={80} />
      <Lead2 a={[42, 132]} b={[q.cell[0] - 4, q.cell[1] - 10]} c={C.ruby} sag={60} />
      <G x={q.cell[0] - 4} y={q.cell[1] - 10} ang={-10}><ProbePen c={C.ruby} len={60} /></G>
      <Lead2 a={[76, 132]} b={[q.c(-40, 44)[0], q.c(-40, 44)[1]]} c="#888" sag={40} />
      <G x={q.c(-40, 44)[0]} y={q.c(-40, 44)[1]} ang={-30}><ProbePen c="#555" len={50} /></G>
      <T x={150} y={316} s={10} c={C.faint}>black probe on the movement (−)</T>

      {/* voltage scale */}
      <line x1={354} y1={56} x2={354} y2={236} stroke={C.dim} />
      {[[1.55, C.emerald, 'healthy silver-oxide', 'about 1.55 V'], [1.3, C.ruby, 'most warn or stop', 'near 1.30 V']].map(([v, c, a, b]) => {
        const y = 236 - (v - 1.1) * 360
        return (
          <g key={v}>
            <line x1={346} y1={y} x2={362} y2={y} stroke={c} strokeWidth="2" />
            <T x={366} y={y} s={10.5} c={c}>{a}</T>
            <T x={366} y={y + 13} s={10} c={C.faint}>{b}</T>
          </g>
        )
      })}
      <T x={354} y={48} a="middle" s={10} c={C.faint}>V</T>
      <rect x={14} y={256} width={128} height={56} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={22} y={274} s={10} c={C.dim}>A plain meter applies</T>
      <T x={22} y={287} s={10} c={C.dim}>no short load, so it’s</T>
      <T x={22} y={300} s={10} c={C.dim}>a rough guide only.</T>
      <Pn x={340} y={250} w={128} h={70} />
      <T x={350} y={270} s={10} c={C.text}>fine out of the watch,</T>
      <T x={350} y={283} s={10} c={C.text}>sags in it:</T>
      <T x={350} y={300} s={10} c={C.ruby}>a short downstream</T>
    </F>
  )
}

function QwMtCoil() {
  return (
    <F h={330} view="Test · coil resistance, on the pads" scale="schematic, magnified">
      <Meter x={20} y={36} read="- - -" unit="kΩ" mode="Ω" />
      {/* coil block, magnified */}
      <rect x={140} y={70} width={200} height={40} rx="4" fill="url(#qw-coilw)" stroke={M.copperD} />
      <rect x={130} y={110} width={220} height={22} fill={M.board} stroke={C.steel} />
      <rect x={150} y={116} width={22} height={10} rx="2" fill={C.brassHi} />
      <rect x={308} y={116} width={22} height={10} rx="2" fill={C.brassHi} />
      <path d="M150 96 Q140 112 160 118" fill="none" stroke={M.copper} strokeWidth="1" />
      <path d="M330 96 Q342 112 320 118" fill="none" stroke={M.copper} strokeWidth="1" />
      <Lead2 a={[42, 132]} b={[161, 118]} c={C.ruby} sag={40} />
      <G x={161} y={118} ang={-15}><ProbePen c={C.ruby} len={50} /></G>
      <Lead2 a={[76, 132]} b={[319, 118]} c="#888" sag={70} />
      <G x={319} y={118} ang={20}><ProbePen c="#555" len={50} /></G>
      <rect x={192} y={83} width={96} height={15} rx="2" fill="#b9783c" opacity="0.95" />
      <T x={240} y={94} a="middle" s={10.5} c="#2a1608" w={600}>hair-fine winding</T>
      <T x={240} y={148} a="middle" s={10.5} c={C.brassHi}>touch the terminal pads only, gently</T>
      <T x={240} y={162} a="middle" s={10} c={C.ruby}>never drag a probe across the winding</T>

      {/* band */}
      <Tag x={14} y={196}>what the reading means</Tag>
      {(() => {
        const sx = (k) => 40 + k * 90
        return (
          <g>
            <line x1={sx(0)} y1={240} x2={sx(4.4)} y2={240} stroke={C.dim} />
            {[0, 1, 2, 3, 4].map((k) => (
              <g key={k}>
                <line x1={sx(k)} y1={240} x2={sx(k)} y2={245} stroke={C.dim} />
                <T x={sx(k)} y={257} a="middle" s={10} c={C.faint} mono>{k}</T>
              </g>
            ))}
            <T x={sx(4.4)} y={257} a="end" s={10} c={C.faint}>kΩ</T>
            <rect x={sx(1)} y={222} width={sx(3) - sx(1)} height={14} rx="3" fill="rgba(123,165,131,0.25)" stroke={C.emerald} />
            <T x={sx(2)} y={218} a="middle" s={10} c={C.emerald}>a good analogue coil: about 1–3 kΩ</T>
            <rect x={sx(1.3)} y={226} width={sx(1.8) - sx(1.3)} height={6} fill={C.brassHi} />
            <SL p={[sx(1.55), 232]} x={sx(1.55) + 12} y={274} text="ETA 955: 1.30–1.80 kΩ" c={C.brassHi} a="start" />
            <rect x={sx(0)} y={226} width={sx(0.5) - sx(0)} height={10} fill="url(#sk-noglue)" />
            <T x={sx(0)} y={276} s={10} c={C.ruby}>far below:</T>
            <T x={sx(0)} y={289} s={10} c={C.ruby}>shorted turns</T>
            <T x={sx(4.4)} y={276} a="end" s={10} c={C.ruby}>OL / infinite:</T>
            <T x={sx(4.4)} y={289} a="end" s={10} c={C.ruby}>broken winding</T>
          </g>
        )
      })()}
      <T x={14} y={312} s={10} c={C.dim}>Each calibre has its own limits. ETA rejects ohmmeters with a test voltage</T>
      <T x={14} y={325} s={10} c={C.dim}>above 0.40 V: check yours before trusting a borderline reading.</T>
    </F>
  )
}

function QwMtCurrent() {
  const x0 = 250
  const w = 210
  const sx = (t) => x0 + (t / 4) * w
  return (
    <F h={330} view="Test · current draw, in series" scale="schematic">
      {/* series hookup in section */}
      <rect x={20} y={172} width={210} height={22} fill="url(#qw-mov)" stroke={C.struct} />
      <CellSide x={60} y={150} w={100} h={22} />
      <rect x={128} y={144} width={40} height={6} rx="2" fill={M.plastic} />
      <path d="M214 168 L150 142" stroke={C.brassHi} strokeWidth="5" strokeLinecap="round" />
      <Screw x={214} y={168} r={5} />
      <Meter x={20} y={36} k={0.8} read="µA" unit="" mode="µA" />
      <Lead2 a={[38, 113]} b={[90, 150]} c={C.ruby} sag={10} />
      <G x={90} y={150} ang={0}><ProbePen c={C.ruby} len={30} /></G>
      <Lead2 a={[64, 113]} b={[192, 158]} c="#888" sag={10} />
      <G x={192} y={158} ang={30}><ProbePen c="#555" len={30} /></G>
      <SL p={[150, 146]} x={96} y={244} text="insulating sheet under clamp" a="start" s={10} />
      <SL p={[202, 162]} x={150} y={222} text="black probe on the clamp" a="start" s={10} />
      <SL p={[90, 152]} x={30} y={222} text="red on cell +" a="start" s={10} />
      <T x={20} y={276} s={10} c={C.dim}>The meter sits between the cell’s +</T>
      <T x={20} y={289} s={10} c={C.dim}>and its contact: a hobby shortcut.</T>
      <T x={20} y={306} s={10} c={C.faint}>ETA measures with no cell fitted,</T>
      <T x={20} y={319} s={10} c={C.faint}>on an external 1.55 V supply.</T>

      {/* chart */}
      <line x1={x0} y1={60} x2={x0} y2={200} stroke={C.dim} />
      <line x1={x0} y1={200} x2={x0 + w} y2={200} stroke={C.dim} />
      <T x={x0 - 4} y={64} a="end" s={10} c={C.faint}>µA</T>
      {[0, 1, 2, 3, 4].map((t) => (
        <T key={t} x={sx(t)} y={214} a="middle" s={10} c={C.faint} mono>{t}</T>
      ))}
      <T x={x0 + w} y={228} a="end" s={10} c={C.faint}>seconds</T>
      <rect x={x0} y={150} width={w} height={34} fill="rgba(123,165,131,0.18)" />
      <polyline points={[0, 1, 2, 3].flatMap((t) => [`${sx(t) + 4},190`, `${sx(t) + 6},82`, `${sx(t) + 9},190`, `${sx(t + 1)},190`]).join(' ')} fill="none" stroke={C.steel} strokeWidth="1.3" />
      <line x1={x0} y1={168} x2={x0 + w} y2={168} stroke={C.emerald} strokeWidth="1.8" strokeDasharray="5 3" />
      <rect x={x0 + 14} y={154} width={124} height={14} fill="#15120f" opacity="0.9" />
      <T x={x0 + 20} y={164} s={10} c={C.emerald}>average: about 0.3–2 µA</T>
      <rect x={x0 + 46} y={82} width={160} height={14} fill="#15120f" opacity="0.9" />
      <T x={x0 + 52} y={92} s={10} c={C.steel}>tiny spike each time the motor fires</T>
      <Pn x={250} y={240} w={218} h={80} t="steady and high" tc={C.ruby} />
      <T x={260} y={274} s={10.5} c={C.text}>tens of µA or more, no pulses:</T>
      <T x={260} y={290} s={10.5} c={C.ruby}>a short or a failed IC</T>
      <T x={260} y={308} s={10} c={C.faint}>many meters can’t resolve these currents</T>
    </F>
  )
}

function QwMtVerdict() {
  const rows = [
    [['✓', '✓', '✓', '✗'], 'mechanical jam', 'train, rotor or hands: free it, don’t replace', C.brassHi],
    [['✓', 'open', '–', '✗'], 'coil / module failed', 'fresh module', C.ruby],
    [['✓', '✓', 'no pulses', '✗'], 'IC or crystal failed', 'fresh module', C.ruby],
  ]
  const cols = ['cell', 'coil', 'current', 'motion']
  return (
    <F h={286} view="Table · read the verdict" scale="schematic">
      {cols.map((c, i) => (
        <Tag key={c} x={24 + i * 54} y={44}>{c}</Tag>
      ))}
      <Tag x={262} y={44}>verdict</Tag>
      {rows.map(([cells, v, sub, col], r) => {
        const y = 60 + r * 62
        return (
          <g key={v}>
            <rect x={14} y={y} width={454} height={52} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
            {cells.map((t, i) => (
              <T key={i} x={44 + i * 54} y={y + 31} a="middle" s={t.length > 2 ? 10 : 13} c={t === '✓' ? C.emerald : t === '–' ? C.faint : C.ruby} w={600}>
                {t}
              </T>
            ))}
            <Arrow a={[236, y + 26]} b={[256, y + 26]} c="brass" w={1.4} />
            <T x={262} y={y + 22} s={11.5} c={col} w={600}>{v}</T>
            <T x={262} y={y + 38} s={10} c={C.dim}>{sub}</T>
          </g>
        )
      })}
      <rect x={14} y={250} width={454} height={28} rx="6" fill="rgba(194,88,99,0.07)" stroke={C.ruby} />
      <T x={241} y={268} a="middle" s={10.5} c={C.text}>Every “electronics dead” path ends in a fresh module.</T>
    </F>
  )
}

function QwMtBother() {
  return (
    <F h={300} view="Decision · test, then swap" scale="schematic">
      <Pn x={12} y={26} w={210} h={160} t="the sum" />
      <rect x={32} y={70} width={60} height={88} fill="rgba(208,168,79,0.15)" stroke={C.brass} />
      <rect x={142} y={46} width={60} height={112} fill="rgba(134,167,189,0.15)" stroke={C.steel} />
      <T x={62} y={174} a="middle" s={10} c={C.text}>a module</T>
      <T x={172} y={174} a="middle" s={10} c={C.text}>an hour of you</T>
      <QMod cx={62} cy={114} r={22} stem={false} />
      <circle cx={172} cy={100} r={20} fill="none" stroke={C.steel} strokeWidth="1.5" />
      <line x1={172} y1={100} x2={172} y2={86} stroke={C.steel} strokeWidth="1.5" />
      <line x1={172} y1={100} x2={182} y2={104} stroke={C.steel} strokeWidth="1.5" />
      <T x={117} y={110} a="middle" s={16} c={C.dim}>&lt;</T>
      <T x={22} y={204} s={10.5} c={C.dim}>Most quartz modules cost less than</T>
      <T x={22} y={218} s={10.5} c={C.dim}>an hour of your time, so component-</T>
      <T x={22} y={232} s={10.5} c={C.dim}>level repair rarely pays.</T>

      <Tag x={240} y={44}>test for two reasons</Tag>
      <Row x={246} y={70} n="a" t="Prove it isn’t just the" />
      <T x={260} y={84} s={11} c={C.text}>battery or contacts</T>
      <Row x={246} y={110} n="b" t="Learn what failed" />
      <Arrow a={[300, 126]} b={[300, 144]} c="brass" w={1.6} />
      <Bx x={240} y={146} w={228} h={30} l={['then swap the module']} c={C.brass} />
      <Pn x={240} y={196} w={228} h={94} t="magnetism" />
      <T x={250} y={226} s={10.5} c={C.text}>Analog quartz has no balance wheel,</T>
      <T x={250} y={240} s={10.5} c={C.text}>so it’s largely immune. A very strong</T>
      <T x={250} y={254} s={10.5} c={C.text}>field can stall the stepper, but</T>
      <T x={250} y={268} s={10.5} c={C.text}>demagnetising rarely helps:</T>
      <T x={250} y={282} s={10.5} c={C.brassHi}>look to the coil and IC instead.</T>
    </F>
  )
}

/* ================================================================== */
/* quartz-corrosion · clean up battery corrosion                        */
/* ================================================================== */

function QwCorRemove() {
  const stage = (x, k, l) => {
    const q = QP(x, 116, 52)
    return (
      <g>
        <QMod cx={x} cy={116} r={52} stem={false} />
        {k > 0 && <circle cx={q.cell[0]} cy={q.cell[1]} r={q.cellR + k * 8} fill="url(#qw-crust)" opacity="0.9" />}
        {k > 0 && <CellTop cx={q.cell[0]} cy={q.cell[1]} r={q.cellR} />}
        <T x={x} y={190} a="middle" s={10.5} c={C.text}>{l}</T>
      </g>
    )
  }
  return (
    <F h={300} view="Sequence · a leaking cell left in" scale="schematic">
      {stage(80, 0.6, 'just leaking')}
      <Arrow a={[140, 116]} b={[172, 116]} c="ruby" w={1.6} />
      {stage(236, 1.6, 'left longer')}
      <Arrow a={[296, 116]} b={[328, 116]} c="ruby" w={1.6} />
      {stage(392, 3, 'longer still')}
      <T x={240} y={44} a="middle" s={10.5} c={C.ruby}>the longer it sits, the further the corrosion spreads</T>
      <Sep x1={12} y1={208} x2={468} y2={208} />
      <Num x={26} y={236} n={1} />
      <T x={40} y={240} s={11.5} c={C.text} w={600}>Take it out now</T>
      <T x={40} y={256} s={10.5} c={C.dim}>before any cleaning or testing</T>
      <Num x={256} y={236} n={2} />
      <T x={270} y={240} s={11.5} c={C.text} w={600}>Dispose of it properly</T>
      <T x={270} y={256} s={10.5} c={C.dim}>tape its terminals or bag it, and</T>
      <T x={270} y={270} s={10.5} c={C.dim}>check your local rules</T>
    </F>
  )
}

function QwCorAssess() {
  const cx1 = 120
  const cx2 = 360
  const q1 = QP(cx1, 130, 76)
  const q2 = QP(cx2, 130, 76)
  return (
    <F h={300} view="Comparison · light crust or deep damage" scale="schematic">
      <Pn x={12} y={26} w={220} h={262} t="usually fixable" tc={C.emerald} ok />
      <QMod cx={cx1} cy={130} r={76} cell={false} />
      <ellipse cx={q1.clamp[0]} cy={q1.clamp[1] - 4} rx={9} ry={6} fill="url(#qw-crust)" />
      <ellipse cx={q1.neg[0]} cy={q1.neg[1]} rx={9} ry={5} fill="url(#qw-crust)" />
      <T x={122} y={236} a="middle" s={10.5} c={C.text}>light surface crust</T>
      <T x={122} y={250} a="middle" s={10.5} c={C.text}>on the contacts only</T>
      <T x={122} y={270} a="middle" s={10} c={C.emerald}>clean it up</T>

      <Pn x={248} y={26} w={220} h={262} t="often beyond saving" tc={C.ruby} ok={false} />
      <QMod cx={cx2} cy={130} r={76} cell={false} />
      <path d={`M${q2.c(30, 50)[0]} ${q2.c(30, 50)[1]} Q${q2.c(-10, 20)[0]} ${q2.c(-10, 20)[1]} ${q2.c(-20, -40)[0]} ${q2.c(-20, -40)[1]}`} fill="none" stroke={M.crust} strokeWidth="8" opacity="0.7" />
      <ellipse cx={q2.coil[0]} cy={q2.coil[1]} rx={22} ry={10} fill="url(#qw-crust)" transform={`rotate(-28 ${q2.coil[0]} ${q2.coil[1]})`} />
      <ellipse cx={q2.c(-6, 10)[0]} cy={q2.c(-6, 10)[1]} rx={14} ry={8} fill="url(#qw-crust)" />
      <T x={360} y={236} a="middle" s={10.5} c={C.text}>eaten into circuit traces,</T>
      <T x={360} y={250} a="middle" s={10.5} c={C.text}>or under the coil</T>
      <T x={360} y={270} a="middle" s={10} c={C.ruby}>usually: a new module</T>
    </F>
  )
}

function QwCorClean() {
  return (
    <F h={330} view="Section · cleaning the contacts" scale="schematic, magnified">
      <rect x={20} y={190} width={440} height={30} fill="url(#qw-mov)" stroke={C.struct} />
      {/* coil and IC zone to protect */}
      <rect x={300} y={160} width={80} height={30} rx="3" fill="url(#qw-coilw)" stroke={M.copperD} />
      <rect x={392} y={168} width={40} height={22} fill="#1e1c1b" stroke={C.dim} />
      <rect x={290} y={146} width={160} height={50} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} strokeDasharray="4 3" />
      <T x={370} y={140} a="middle" s={10.5} c={C.ruby}>keep alcohol and dust away</T>
      <T x={340} y={210} a="middle" s={10} c={C.text}>coil</T>
      <T x={412} y={210} a="middle" s={10} c={C.text}>IC</T>
      {/* contact being scrubbed */}
      <rect x={60} y={178} width={50} height={12} fill={C.brassHi} />
      <rect x={60} y={178} width={20} height={12} fill={C.brassHi} />
      <rect x={84} y={178} width={26} height={12} fill="url(#qw-crust)" />
      <G x={86} y={176} ang={-15}><GlassPen len={60} /></G>
      <Num x={36} y={42} n={1} />
      <T x={50} y={46} s={10.5} c={C.text}>fibreglass pen till bright metal shows</T>
      {/* Rodico */}
      <rect x={150} y={150} width={30} height={20} rx="8" fill="#5fb3b0" />
      <Arrow a={[165, 146]} b={[165, 116]} c="brass" w={1.4} />
      <Num x={36} y={66} n={2} />
      <T x={50} y={70} s={10.5} c={C.text}>lift the residue with Rodico</T>
      {/* swab on flat area */}
      <rect x={196} y={178} width={70} height={12} fill={C.struct} />
      <ellipse cx={232} cy={172} rx={12} ry={7} fill="#f1ede2" />
      <line x1={238} y1={166} x2={268} y2={110} stroke="#e6e1d4" strokeWidth="2.5" />
      <Num x={36} y={90} n={3} />
      <T x={50} y={94} s={10.5} c={C.text}>swab with a little isopropyl on flat areas</T>
      {/* blower */}
      <path d="M120 270 q-20 -20 0 -40 l40 6 l0 28 Z" fill="#c94a3c" />
      <rect x={160} y={240} width={30} height={10} fill="#333" />
      <Arrow a={[194, 245]} b={[230, 245]} c="steel" w={1.4} />
      <Arrow a={[194, 252]} b={[230, 262]} c="steel" w={1.4} />
      <T x={240} y={250} s={10.5} c={C.text}>blow debris away from the movement,</T>
      <T x={240} y={264} s={10.5} c={C.text}>don’t push it in</T>
      <T x={20} y={310} s={10} c={C.faint}>Hold the movement so the blast carries dust out over the edge, not across the coil.</T>
    </F>
  )
}

function QwCorNeg() {
  return (
    <F h={326} view="Section · negative contact and seat" scale="schematic, magnified">
      <Pn x={12} y={26} w={220} h={168} t="tongue presses the cell" tc={C.emerald} ok />
      <rect x={26} y={150} width={192} height={12} fill={M.board} stroke={C.steel} />
      <rect x={26} y={162} width={192} height={18} fill="url(#qw-mov)" />
      <CellSide x={70} y={96} w={110} h={24} />
      <path d="M40 136 L90 136 L120 122" fill="none" stroke={C.brassHi} strokeWidth="2.6" />
      <T x={30} y={190} s={10} c={C.dim}>tongue up against the cell’s −</T>

      <Pn x={248} y={26} w={220} h={168} t="bent onto the board" tc={C.ruby} ok={false} />
      <rect x={262} y={150} width={192} height={12} fill={M.board} stroke={C.steel} />
      <rect x={262} y={162} width={192} height={18} fill="url(#qw-mov)" />
      <CellSide x={306} y={96} w={110} h={24} />
      <path d="M276 136 L326 136 L356 150" fill="none" stroke={C.brassHi} strokeWidth="2.6" />
      <circle cx={356} cy={150} r="6" fill="none" stroke={C.ruby} strokeWidth="1.6" />
      <T x={266} y={190} s={10} c={C.ruby}>no contact, and a short</T>

      <Ring x={84} y={258} r={56} />
      <rect x={40} y={250} width={88} height={18} fill="#d8c27a" />
      <rect x={40} y={268} width={88} height={10} fill="url(#qw-mov)" />
      <T x={84} y={232} a="middle" s={10} c={C.text}>seat at ×10</T>
      <T x={156} y={240} s={11} c={C.text} w={600}>Clean the seat the same way</T>
      <T x={156} y={256} s={10.5} c={C.dim}>Leaked contents and salt crystals sit here</T>
      <T x={156} y={270} s={10.5} c={C.dim}>and go on attacking the metal.</T>
      <T x={156} y={292} s={10.5} c={C.emerald}>Look for bright metal, no green or white left.</T>
      <T x={156} y={312} s={10} c={C.faint}>Witschi’s checklist singles out the negative contact and seat.</T>
    </F>
  )
}

function QwCorTest() {
  return (
    <F h={300} view="Flow · test with a fresh cell" scale="schematic">
      <Bx x={160} y={30} w={160} h={36} l={['Fit a new cell', 'clean contacts, right way up']} c={C.brass} />
      <Arrow a={[200, 68]} b={[90, 100]} c="emerald" w={1.5} />
      <Arrow a={[240, 68]} b={[240, 100]} c="ruby" w={1.5} />
      <Arrow a={[280, 68]} b={[390, 100]} c="brass" w={1.5} />
      <Bx x={14} y={102} w={150} h={44} l={['Runs and keeps time', 'done: now prove it held']} c={C.emerald} />
      <Bx x={170} y={102} w={140} h={44} l={['Stays dead', 'despite clean contacts']} c={C.ruby} />
      <Bx x={316} y={102} w={152} h={44} l={['Stutters', 'or jumps']} c={C.brass} />
      <Arrow a={[240, 148]} b={[240, 176]} c="ruby" w={1.5} />
      <Bx x={170} y={178} w={140} h={34} l={['Replace the module']} c={C.ruby} f="rgba(194,88,99,0.08)" />
      <Arrow a={[392, 148]} b={[392, 176]} c="brass" w={1.5} />
      <Bx x={316} y={178} w={152} h={34} l={['Wait a few minutes']} />
      <Arrow a={[392, 214]} b={[392, 236]} c="brass" w={1.5} />
      <Bx x={316} y={238} w={152} h={44} l={['Mechanical load?', 'before you blame the module']} />
      <Pn x={14} y={178} w={150} h={104} t="tip" />
      <T x={24} y={210} s={10.5} c={C.text}>Change dead cells</T>
      <T x={24} y={224} s={10.5} c={C.text}>promptly, and never</T>
      <T x={24} y={238} s={10.5} c={C.text}>leave a dead cell in</T>
      <T x={24} y={252} s={10.5} c={C.text}>a stored watch.</T>
      <T x={24} y={272} s={10} c={C.faint}>prevention beats cure</T>
    </F>
  )
}

function QwCorProve() {
  return (
    <F h={300} view="Timeline · prove the clean-up held" scale="schematic">
      <line x1={40} y1={110} x2={440} y2={110} stroke={C.dim} strokeWidth="1.4" />
      <circle cx={60} cy={110} r={6} fill={C.brass} />
      <circle cx={380} cy={110} r={6} fill={C.steel} />
      <T x={60} y={92} a="middle" s={11} c={C.text} w={600}>day of the clean-up</T>
      <T x={60} y={132} a="middle" s={10} c={C.dim}>note the date</T>
      <T x={380} y={92} a="middle" s={11} c={C.text} w={600}>after a few days</T>
      <T x={220} y={104} a="middle" s={10} c={C.faint}>it can look fine and still fail later</T>
      <Row x={300} y={140} t="re-check the rate" />
      <Row x={300} y={156} t="re-check the seconds hand" />
      <Row x={300} y={172} t="current vs the maker’s figure" sub="if you own a watch tester" />
      <Sep x1={12} y1={200} x2={468} y2={200} />
      <Pn x={12} y={210} w={220} h={80} t="high current after a leak" tc={C.brassHi} />
      <T x={22} y={244} s={10.5} c={C.text}>suggests damage or residue</T>
      <T x={22} y={258} s={10.5} c={C.text}>you haven’t reached</T>
      <Pn x={248} y={210} w={220} h={80} t="if it fails again" tc={C.ruby} />
      <T x={258} y={244} s={10.5} c={C.text}>fit a new module rather</T>
      <T x={258} y={258} s={10.5} c={C.text}>than cleaning again</T>
    </F>
  )
}

/* ================================================================== */
/* quartz-module · swap a quartz movement                               */
/* ================================================================== */

// Hand arbors in side view at (x, base y): hour pipe, minute pipe, seconds pivot
function Arbors({ x, y, k = 1, hw = 7, mw = 4.4, sw = 1.8 }) {
  return (
    <g>
      <rect x={x - (hw * k) / 2} y={y - 14 * k} width={hw * k} height={14 * k} fill={M.brassP} stroke={C.ground} strokeWidth="0.5" />
      <rect x={x - (mw * k) / 2} y={y - 26 * k} width={mw * k} height={26 * k} fill="url(#sk-steelH)" stroke={C.ground} strokeWidth="0.5" />
      <rect x={x - (sw * k) / 2} y={y - 38 * k} width={sw * k} height={38 * k} fill="#dfe6ea" />
    </g>
  )
}

function QwModMatch() {
  const PlasMod = ({ cx, cy, txt, c = M.plastic }) => (
    <g>
      <rect x={cx + 54} y={cy - 3} width={36} height={6} rx="1" fill="url(#sk-steel)" />
      <circle cx={cx} cy={cy} r={58} fill={c} stroke="#a59d86" strokeWidth="1.2" />
      <circle cx={cx + 18} cy={cy + 18} r={22} fill="url(#qw-cell)" stroke="#4e5f6a" />
      <T x={cx - 12} y={cy - 18} a="middle" s={11} c="#3a342c" w={700} mono>{txt}</T>
      <T x={cx - 12} y={cy - 4} a="middle" s={10} c="#5e5646" mono>SWISS</T>
    </g>
  )
  return (
    <F h={330} view="Comparison · old module and its replacement" scale="schematic">
      <PlasMod cx={88} cy={100} txt="RONDA 763" />
      <T x={88} y={182} a="middle" s={10.5} c={C.dim}>failed module</T>
      <PlasMod cx={300} cy={100} txt="RONDA 763" />
      <T x={300} y={182} a="middle" s={10.5} c={C.dim}>replacement</T>
      <Arrow a={[186, 100]} b={[226, 100]} c="brass" w={1.8} />
      <T x={206} y={90} a="middle" s={10} c={C.brassHi}>same</T>
      <Sep x1={12} y1={198} x2={468} y2={198} />
      <Tag x={14} y={218}>confirm three things before you buy</Tag>
      <Row x={22} y={244} n={1} t="Same calibre" sub="e.g. Ronda 763, Miyota 2035" />
      <Row x={22} y={280} n={2} t="Same stem type" sub="crown and stem must fit" />
      <Row x={190} y={244} n={3} t="Same hand-hole sizes" sub="or you’ll need new hands" />
      <Arbors x={226} y={316} k={0.8} />
      <T x={244} y={300} s={10} c={C.faint}>hour, minute and seconds</T>
      <T x={244} y={313} s={10} c={C.faint}>holes must match the hands</T>
    </F>
  )
}

function QwModHands() {
  const base = 196
  return (
    <F h={330} view="Section · protectors in, hands lifted evenly" scale="schematic, magnified">
      <rect x={20} y={base} width={300} height={18} fill="url(#qw-mov)" stroke={C.struct} />
      <rect x={20} y={base - 6} width={300} height={6} fill={M.dial} />
      <rect x={40} y={base - 10} width={260} height={4} rx="1.5" fill="rgba(170,210,225,0.55)" stroke={M.glass} />
      <Arbors x={170} y={base - 6} k={1.4} />
      {/* hands */}
      <rect x={70} y={base - 30} width={200} height={3} fill={C.brassHi} />
      <rect x={60} y={base - 42} width={230} height={2.4} fill={C.brassHi} />
      <rect x={40} y={base - 56} width={270} height={1.6} fill={C.ruby} />
      <G x={130} y={base - 30} ang={-62}><HandLever len={88} /></G>
      <G x={210} y={base - 30} ang={62}><g transform="scale(-1 1)"><HandLever len={88} /></g></G>
      <Arrow a={[170, 120]} b={[170, 80]} c="brass" w={1.8} />
      <T x={180} y={84} s={10.5} c={C.brassHi}>straight up, evenly</T>
      <SL p={[60, base - 8]} x={20} y={252} text="thin plastic dial protector, slid under the hands" c={M.glass} a="start" />
      <T x={22} y={base - 12} s={10} c={C.dim}>dial</T>
      <T x={20} y={276} s={10.5} c={C.dim}>Lift all three hands with the levers pressing</T>
      <T x={20} y={290} s={10.5} c={C.dim}>on the protector, never on the dial.</T>

      <Pn x={344} y={26} w={124} h={150} t="never" tc={C.ruby} ok={false} />
      <circle cx={406} cy={110} r={44} fill={M.dial} stroke={C.struct} />
      <path d="M380 92 A30 30 0 0 0 384 132" fill="none" stroke="#8a8170" strokeWidth="2.2" />
      <G x={384} y={110} ang={-80}><HandLever len={60} /></G>
      <T x={406} y={168} a="middle" s={10} c={C.ruby}>a crescent scratch</T>
      <T x={344} y={198} s={10} c={C.dim}>One slip on a bare dial</T>
      <T x={344} y={211} s={10} c={C.dim}>is permanent. The</T>
      <T x={344} y={224} s={10} c={C.dim}>protectors are not</T>
      <T x={344} y={237} s={10} c={C.dim}>optional.</T>
    </F>
  )
}

function QwModDial() {
  return (
    <F h={316} view="Exploded section · moving the dial across" scale="schematic">
      <Tag x={14} y={42}>old module</Tag>
      <rect x={20} y={56} width={180} height={6} fill={M.dial} />
      <rect x={52} y={62} width={4} height={30} fill={C.brassHi} />
      <rect x={164} y={62} width={4} height={30} fill={C.brassHi} />
      <rect x={20} y={96} width={180} height={34} fill={M.plastic} stroke="#a59d86" />
      <rect x={50} y={96} width={8} height={34} fill={C.ground} />
      <rect x={162} y={96} width={8} height={34} fill={C.ground} />
      <Arrow a={[110, 52]} b={[110, 34]} c="brass" w={1.6} />
      <T x={120} y={40} s={10} c={C.brassHi}>2 · lift the dial</T>
      {/* clamps / screws from the side */}
      <rect x={34} y={108} width={16} height={6} fill={C.steel} />
      <Screw x={30} y={111} r={5} ang={90} />
      <rect x={170} y={108} width={16} height={6} fill={C.steel} />
      <Screw x={190} y={111} r={5} ang={90} />
      <SL p={[54, 80]} x={210} y={74} text="dial feet" a="start" />
      <SL p={[190, 116]} x={210} y={130} text="1 · free the feet" sub="small clamps or screws, movement side" a="start" />
      <Arrow a={[40, 140]} b={[40, 124]} c="brass" w={1.3} />

      <Arrow d="M110 156 C110 190 360 160 360 196" c="brass" w={1.8} />
      <T x={250} y={172} s={10} c={C.brassHi}>3 · fit it the same way</T>

      <Tag x={268} y={200}>new module</Tag>
      <rect x={270} y={210} width={180} height={6} fill={M.dial} />
      <rect x={302} y={216} width={4} height={40} fill={C.brassHi} />
      <rect x={414} y={216} width={4} height={40} fill={C.brassHi} />
      <rect x={270} y={240} width={180} height={34} fill={M.plastic} stroke="#a59d86" />
      <rect x={300} y={240} width={8} height={34} fill={C.ground} />
      <rect x={412} y={240} width={8} height={34} fill={C.ground} />
      <rect x={284} y={252} width={16} height={6} fill={C.steel} />
      <rect x={420} y={252} width={16} height={6} fill={C.steel} />
      <T x={20} y={196} s={10.5} c={C.text} w={600}>note how it came off</T>
      <T x={20} y={212} s={10} c={C.dim}>which foot went in which hole,</T>
      <T x={20} y={225} s={10} c={C.dim}>and how each clamp was turned</T>
      <T x={270} y={296} s={10} c={C.faint}>feet in their holes, then clamp or screw them</T>
    </F>
  )
}

function QwModDate() {
  return (
    <F h={330} view="Sequence · find the date change, then fit hands" scale="schematic">
      <Face cx={80} cy={96} r={52} h={null} m={null} date lugs={false} />
      <Turn cx={140} cy={96} r={14} from={30} to={300} />
      <T x={80} y={170} a="middle" s={10.5} c={C.text}>no hands yet: turn the stem</T>
      <T x={80} y={184} a="middle" s={10.5} c={C.text}>until the date changes</T>
      <Arrow a={[164, 96]} b={[204, 96]} c="brass" w={1.8} />
      <Face cx={272} cy={96} r={52} h={0} m={0} s={0} date lugs={false} />
      <T x={272} y={170} a="middle" s={10.5} c={C.text}>then hands on, all at 12</T>
      <T x={272} y={184} a="middle" s={10} c={C.faint}>so the change falls at the right time</T>
      <T x={404} y={70} s={10} c={C.faint}>Witschi’s</T>
      <T x={404} y={83} s={10} c={C.faint}>guide makes</T>
      <T x={404} y={96} s={10} c={C.faint}>this the rule</T>

      <Sep x1={12} y1={204} x2={468} y2={204} />
      <Tag x={14} y={224}>hands feel stiff? lift the dial and look</Tag>
      {/* section: minute wheel pivot and hour wheel */}
      <rect x={20} y={300} width={220} height={14} fill="url(#qw-mov)" />
      <rect x={60} y={256} width={8} height={44} fill="#dfe6ea" />
      <rect x={42} y={262} width={44} height={6} fill={M.brassP} />
      <rect x={120} y={268} width={110} height={6} fill={M.brassP} />
      <rect x={160} y={240} width={14} height={60} fill={M.brassP} />
      <path d="M120 284 q55 -10 110 0" fill="none" stroke={C.steel} strokeWidth="1.6" />
      <SL p={[64, 258]} x={30} y={246} text="minute wheel pivot" a="start" />
      <SL p={[200, 270]} x={250} y={262} text="hour wheel: lined up with it?" a="start" />
      <SL p={[176, 282]} x={250} y={290} text="expansion spring, in some designs" sub="damaged or doubled, it can jam" a="start" />
      <T x={250} y={322} s={10} c={C.ruby}>Too much force damages the hour wheel too.</T>
    </F>
  )
}

function QwModRecase() {
  const st = [
    ['Drop it in', 'square in the case'],
    ['Refit the stem', 'it clicks home'],
    ['Check it', 'time, hand clearance'],
    ['Seal and close', 'as in the battery lesson'],
  ]
  return (
    <F h={290} view="Sequence · back into the case" scale="schematic">
      {st.map(([a, b], i) => {
        const x = 14 + i * 116
        return (
          <g key={a}>
            <Pn x={x} y={26} w={108} h={170} />
            <Num x={x + 14} y={42} n={i + 1} />
            <circle cx={x + 54} cy={110} r={38} fill="url(#sk-steel)" stroke={M.steelD} />
            <circle cx={x + 54} cy={110} r={30} fill={i === 0 ? C.ground : M.plastic} stroke="#a59d86" />
            {i === 0 && <Arrow a={[x + 54, 58]} b={[x + 54, 92]} c="brass" w={1.8} />}
            {i >= 1 && <rect x={x + 84} y={107} width={i === 1 ? 14 : 8} height={5} fill="url(#sk-steelH)" />}
            {i >= 1 && <rect x={x + 92 + (i === 1 ? 6 : 0)} y={102} width={8} height={15} rx="2" fill="url(#qw-knurl)" />}
            {i === 1 && <Arrow a={[x + 104, 132]} b={[x + 92, 132]} c="brass" w={1.4} />}
            {i === 2 && <Face cx={x + 54} cy={110} r={26} lugs={false} crown={false} s={90} />}
            {i === 3 && <circle cx={x + 54} cy={110} r={33} fill="none" stroke={M.gasket} strokeWidth="3" />}
            <T x={x + 54} y={170} a="middle" s={10.5} c={C.text}>{a}</T>
            <T x={x + 54} y={184} a="middle" s={10} c={C.faint}>{b}</T>
          </g>
        )
      })}
      <T x={14} y={222} s={10.5} c={C.dim}>Check 3 covers both timekeeping and hand clearance: watch the seconds</T>
      <T x={14} y={236} s={10.5} c={C.dim}>hand step, then look across the dial for a hand touching another or the glass.</T>
      <T x={14} y={262} s={10} c={C.faint}>Sealing: clean or renew the gasket, and treat it as not water-resistant</T>
      <T x={14} y={275} s={10} c={C.faint}>until pressure-tested.</T>
    </F>
  )
}

function QwModRing() {
  const Plan = ({ cx, cy, rot }) => (
    <g>
      <circle cx={cx} cy={cy} r={62} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={cx} cy={cy} r={52} fill={M.plastic} stroke="#a59d86" />
      <g transform={`rotate(${rot} ${cx} ${cy})`}>
        <rect x={cx + 40} y={cy - 6} width={14} height={12} fill={C.ground} />
      </g>
      <circle cx={cx} cy={cy} r={36} fill={M.plate} stroke={C.brass} />
      <rect x={cx + 34} y={cy - 2.5} width={44} height={5} fill="url(#sk-steelH)" />
      <rect x={cx + 76} y={cy - 8} width={10} height={16} rx="2" fill="url(#qw-knurl)" />
    </g>
  )
  return (
    <F h={334} view="Plan and side · ring recess on the stem" scale="schematic">
      <Pn x={12} y={26} w={226} h={196} t="recess lined up" tc={C.emerald} ok />
      <Plan cx={108} cy={118} rot={0} />
      <T x={125} y={206} a="middle" s={10.5} c={C.text}>stem passes through the recess</T>
      <Pn x={246} y={26} w={222} h={196} t="out of line" tc={C.ruby} ok={false} />
      <Plan cx={342} cy={118} rot={-35} />
      <T x={357} y={206} a="middle" s={10.5} c={C.text}>ring sits on the stem</T>
      {/* side view gap */}
      <rect x={250} y={250} width={150} height={20} rx="4" fill="url(#sk-steel)" />
      <path d="M250 236 L400 228 L400 240 L250 248 Z" fill="url(#qw-cut)" stroke="#4e5f6a" />
      <Dim a={[404, 228]} b={[404, 250]} off={-10} text="gap" c={C.ruby} />
      <T x={250} y={290} s={10} c={C.ruby}>back sits high on one side:</T>
      <T x={250} y={303} s={10} c={C.ruby}>the seal is spoiled</T>
      <T x={14} y={246} s={10.5} c={C.text}>Look along the joint: the back</T>
      <T x={14} y={260} s={10.5} c={C.text}>sits down evenly all the way round.</T>
      <T x={14} y={282} s={10.5} c={C.dim}>Grease on the stem tube: sparing.</T>
      <T x={14} y={296} s={10.5} c={C.dim}>Excess is carried inside.</T>
      <T x={14} y={318} s={10.5} c={C.brassHi}>Then run it dial down as well as dial up.</T>
    </F>
  )
}

/* ================================================================== */
/* quartz-full-service · hands, case and seal                           */
/* ================================================================== */

function QwQsHands() {
  const bars = [
    ['Ronda 509 · hour and minute', 40],
    ['Ronda 509 · seconds', 30],
    ['Ronda 1062 (slim)', 25],
  ]
  const sx = (n) => 30 + n * 4.4
  return (
    <F h={334} view="Chart · hand-pressing force limits" scale="maximum force, N">
      {bars.map(([l, n], i) => (
        <g key={l}>
          <T x={30} y={50 + i * 40} s={10.5} c={C.text}>{l}</T>
          <rect x={30} y={56 + i * 40} width={sx(n) - 30} height={12} rx="3" fill="rgba(194,88,99,0.25)" stroke={C.ruby} />
          <T x={sx(n) + 6} y={66 + i * 40} s={11} c={C.ruby} w={600} mono>{n} N max</T>
        </g>
      ))}
      <T x={30} y={176} s={10} c={C.faint}>Ronda’s figures; don’t lean on the press.</T>
      {/* support under the movement */}
      <Pn x={290} y={26} w={178} h={156} t="support the movement" />
      <rect x={318} y={140} width={122} height={16} fill="#596770" stroke={M.steelD} />
      <rect x={366} y={124} width={26} height={16} fill="#8c9aa3" />
      <rect x={322} y={112} width={114} height={12} fill="url(#qw-mov)" />
      <rect x={322} y={108} width={114} height={4} fill={M.dial} />
      <G x={379} y={104}><Pusher d={8} len={58} /></G>
      <SL p={[392, 132]} x={440} y={174} text="stake under the pipe" a="end" s={10} />

      <Sep x1={12} y1={196} x2={468} y2={196} />
      <Tag x={14} y={216}>then, in order</Tag>
      {[
        ['Hand clearance all round', 'a lightly touching hand raises current'],
        ['Wind through 12 and a date change', ''],
        ['Case up, renew the gasket', 'Gaskets: types, measuring, sizing'],
        ['Water test', 'Test water resistance and find the leak'],
        ['Log before and after numbers', ''],
      ].map(([a, b], i) => (
        <g key={a}>
          <Num x={i < 3 ? 24 : 260} y={234 + (i % 3) * 32} n={i + 1} r={7} />
          <T x={i < 3 ? 36 : 272} y={238 + (i % 3) * 32} s={10.5} c={C.text}>{a}</T>
          {b && <T x={i < 3 ? 36 : 272} y={250 + (i % 3) * 32} s={10} c={C.faint}>{b}</T>}
        </g>
      ))}
    </F>
  )
}

/* ================================================================== */
/* quartz-chrono-zero · stop where the checked steps stop               */
/* ================================================================== */

function QwQzStop() {
  return (
    <F h={330} view="Decision · unverified calibres" scale="schematic">
      <Pn x={12} y={26} w={220} h={170} t="not verified here" tc={C.ruby} />
      <T x={22} y={58} s={10.5} c={C.text} w={600}>Zero procedures</T>
      <T x={22} y={73} s={10.5} c={C.dim} mono>Seiko 7T32, 7T62</T>
      <T x={22} y={98} s={10.5} c={C.text} w={600}>Reset steps</T>
      <T x={22} y={113} s={10.5} c={C.dim} mono>VD57, VD78, VK64,</T>
      <T x={22} y={127} s={10.5} c={C.dim} mono>FS00, 6P00, ISA 8171</T>
      <T x={22} y={152} s={10.5} c={C.text} w={600}>Casio</T>
      <T x={22} y={166} s={10} c={C.dim}>by module number; AC terminal</T>
      <T x={22} y={179} s={10} c={C.dim}>varies, so no general list</T>
      <Pn x={244} y={26} w={224} h={170} t="don’t guess" tc={C.ruby} ok={false} />
      <T x={254} y={60} s={10.5} c={C.text}>A similar number is not</T>
      <T x={254} y={74} s={10.5} c={C.text}>the same procedure.</T>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={300 + i * 44} cy={120} r={13} fill="#3a3530" stroke={C.dim} />
          <T x={300 + i * 44} y={124} a="middle" s={11} c={C.text}>?</T>
        </g>
      ))}
      <T x={254} y={160} s={10} c={C.ruby}>random buttons can leave an</T>
      <T x={254} y={173} s={10} c={C.ruby}>unknown module worse</T>
      <Chain
        x={14}
        y={216}
        w={136}
        h={46}
        gap={18}
        items={[
          [['Read the module', 'number, movement back'], C.brass],
          [['Find that module’s', 'own guide'], C.brass],
          [['Follow it, or stop', 'if you can’t find it'], C.emerald],
        ]}
      />
      <T x={14} y={292} s={10.5} c={C.dim}>Sources disagree on which click and button apply to the 7T32 and 7T62,</T>
      <T x={14} y={306} s={10.5} c={C.dim}>and the documents opened for this app didn’t include them.</T>
    </F>
  )
}

/* ================================================================== */
/* quartz-identify · identify a quartz calibre                          */
/* ================================================================== */

function QwIdMark() {
  return (
    <F h={316} view="Plan · the number on the movement" scale="schematic">
      <circle cx={150} cy={166} r={124} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={150} cy={166} r={108} fill={M.plastic} stroke="#a59d86" />
      <circle cx={186} cy={206} r={42} fill="url(#qw-cell)" stroke="#4e5f6a" />
      <T x={186} y={212} a="middle" s={14} c="#2b343a" w={700}>+</T>
      <rect x={70} y={100} width={34} height={20} rx="3" fill="#cfc6ab" />
      <T x={106} y={140} a="middle" s={11} c="#3a342c" w={700} mono>RONDA 763</T>
      <T x={106} y={154} a="middle" s={10} c="#5e5646" mono>SWISS MADE</T>
      <circle cx={84} cy={200} r={6} fill={C.brassHi} />
      <T x={84} y={222} a="middle" s={10} c="#5e5646">AC</T>
      <Ring x={370} y={130} r={80} />
      <T x={370} y={124} a="middle" s={19} c="#e8e1cc" w={700} mono>RONDA</T>
      <T x={370} y={150} a="middle" s={19} c="#e8e1cc" w={700} mono>763</T>
      <line x1={140} y1={130} x2={292} y2={122} stroke={C.brass} strokeDasharray="3 3" />
      <T x={370} y={234} a="middle" s={10.5} c={C.text}>under a loupe</T>
      <T x={300} y={268} s={10.5} c={C.dim}>Makers such as Ronda, ISA,</T>
      <T x={300} y={282} s={10.5} c={C.dim}>Miyota and Seiko print the</T>
      <T x={300} y={296} s={10.5} c={C.dim}>calibre on the module or plate.</T>
    </F>
  )
}

function QwIdStyle() {
  const Mod = ({ cx, cy, cellAt, ac, coilAt }) => (
    <g>
      <circle cx={cx} cy={cy} r={54} fill={M.plastic} stroke="#a59d86" />
      <rect x={cx + 52} y={cy - 2.5} width={18} height={5} fill="url(#sk-steelH)" />
      <circle cx={cx + cellAt[0]} cy={cy + cellAt[1]} r={22} fill="url(#qw-cell)" stroke="#4e5f6a" />
      <rect x={cx + coilAt[0] - 18} y={cy + coilAt[1] - 6} width={36} height={12} rx="2" fill="url(#qw-coilw)" stroke={M.copperD} />
      {ac && <circle cx={cx + ac[0]} cy={cy + ac[1]} r={5} fill={C.brassHi} />}
      {ac && <T x={cx + ac[0]} y={cy + ac[1] + 17} a="middle" s={10} c="#5e5646">AC</T>}
    </g>
  )
  return (
    <F h={312} view="Comparison · layout tells the family" scale="schematic, not real calibres">
      {[
        [{ cellAt: [16, 16], coilAt: [-18, -30], ac: [-30, 14] }, 'cell lower right', 'AC pad marked'],
        [{ cellAt: [-18, -14], coilAt: [20, 30], ac: null }, 'cell upper left', 'no reset pad'],
        [{ cellAt: [0, 22], coilAt: [0, -32], ac: [32, -10] }, 'cell at 6', 'AC near the stem'],
      ].map(([p, a, b], i) => {
        const x = 12 + i * 154
        return (
          <g key={a}>
            <Pn x={x} y={26} w={146} h={186} t={`family ${String.fromCharCode(65 + i)}`} />
            <Mod cx={x + 66} cy={112} {...p} />
            <T x={x + 73} y={188} a="middle" s={10.5} c={C.text}>{a}</T>
            <T x={x + 73} y={202} a="middle" s={10} c={C.faint}>{b}</T>
          </g>
        )
      })}
      <rect x={20} y={232} width={46} height={32} rx="5" fill="#3a3f44" stroke={C.dim} />
      <circle cx={43} cy={248} r={10} fill="#1b1e21" stroke={C.dim} />
      <rect x={52} y={228} width={10} height={5} rx="1" fill={C.dim} />
      <T x={80} y={246} s={11} c={C.text} w={600}>No number? Photograph it.</T>
      <T x={80} y={262} s={10.5} c={C.dim}>The layout, battery position and reset-pad markings</T>
      <T x={80} y={276} s={10.5} c={C.dim}>often identify the family, so keep the picture.</T>
    </F>
  )
}

function QwIdSpec() {
  const rows = [
    ['Battery type', 'the cell to stock'],
    ['Stem reference', 'the stem to order'],
    ['Hand sizes', 'the hands that fit the holes'],
    ['Number of jewels', 'confirms the version'],
  ]
  return (
    <F h={300} view="Card · what the data sheet tells you" scale="schematic">
      <rect x={20} y={30} width={250} height={250} rx="6" fill={M.paper} />
      <rect x={20} y={30} width={250} height={34} rx="6" fill="#cfc6ab" />
      <T x={32} y={52} s={12} c="#2d2820" w={700} mono>CALIBRE DATA SHEET</T>
      {rows.map(([a], i) => (
        <g key={a}>
          <T x={32} y={92 + i * 48} s={11} c="#3a342c" w={600}>{a}</T>
          <rect x={32} y={100 + i * 48} width={226} height={16} rx="2" fill="#f5f1e6" stroke="#b7ae9c" />
          <line x1={270} y1={108 + i * 48} x2={300} y2={108 + i * 48} stroke={C.struct} />
        </g>
      ))}
      {rows.map(([, b], i) => (
        <T key={b} x={306} y={112 + i * 48} s={10.5} c={C.text}>{b}</T>
      ))}
      <T x={306} y={60} s={11} c={C.brassHi} w={600}>exactly what to buy</T>
      <T x={20} y={296} s={10} c={C.faint}>Tip: save the calibre and cell code in the Practice Log.</T>
    </F>
  )
}

function QwIdNumber() {
  const k = 4.6
  const cx = 130
  const cy = 170
  return (
    <F h={330} view="Plan · two endings, two sizes" scale="true scale ×4.6">
      <circle cx={cx} cy={cy} r={(25.6 * k) / 2} fill="rgba(208,168,79,0.12)" stroke={C.brass} strokeWidth="1.6" />
      <circle cx={cx} cy={cy} r={(23.3 * k) / 2} fill="rgba(134,167,189,0.14)" stroke={C.steel} strokeWidth="1.6" strokeDasharray="5 3" />
      <Dim a={[cx - (25.6 * k) / 2, cy]} b={[cx + (25.6 * k) / 2, cy]} off={-70} text="25.60 mm" c={C.brassHi} />
      <Dim a={[cx - (23.3 * k) / 2, cy + 6]} b={[cx + (23.3 * k) / 2, cy + 6]} off={0} text="23.30 mm" c={C.steel} />
      <T x={290} y={64} s={12} c={C.brassHi} w={700} mono>ETA 955.112</T>
      <T x={290} y={80} s={10.5} c={C.text}>11½ lignes, 25.60 mm across</T>
      <T x={290} y={114} s={12} c={C.steel} w={700} mono>ETA 955.412</T>
      <T x={290} y={130} s={10.5} c={C.text}>10½ lignes, 23.30 mm across</T>
      <T x={290} y={162} s={10.5} c={C.ruby}>One won’t fit where the</T>
      <T x={290} y={176} s={10.5} c={C.ruby}>other came from.</T>
      <Sep x1={276} y1={196} x2={468} y2={196} />
      <T x={290} y={218} s={10.5} c={C.text} w={600}>Copy every digit and letter,</T>
      <T x={290} y={232} s={10.5} c={C.text} w={600}>not just the family name.</T>
      <T x={290} y={256} s={10.5} c={C.dim}>Save the sheet’s electrical</T>
      <T x={290} y={270} s={10.5} c={C.dim}>limits with the number: a good</T>
      <T x={290} y={284} s={10.5} c={C.dim}>reading on one calibre can be</T>
      <T x={290} y={298} s={10.5} c={C.dim}>a fault on another.</T>
    </F>
  )
}

/* ================================================================== */
/* quartz-solar · solar, Eco-Drive and Kinetic                          */
/* ================================================================== */

function QwSolMistake() {
  return (
    <F h={330} view="Comparison · same size, different cell" scale="schematic">
      <Pn x={12} y={26} w={220} h={180} t="rechargeable cell" tc={C.emerald} ok />
      <CellTop cx={122} cy={100} r={40} code="MT920" />
      <T x={122} y={164} a="middle" s={10.5} c={C.text}>e.g. MT920, MT621,</T>
      <T x={122} y={178} a="middle" s={10.5} c={C.text}>or an older Kinetic capacitor</T>
      <T x={122} y={196} a="middle" s={10} c={C.faint}>confirm against the calibre</T>
      <Pn x={248} y={26} w={220} h={180} t="silver-oxide primary (SR)" tc={C.ruby} ok={false} />
      <CellTop cx={358} cy={100} r={40} code="SR" />
      <T x={358} y={164} a="middle" s={10.5} c={C.text}>can be the same physical size:</T>
      <T x={358} y={178} a="middle" s={10.5} c={C.ruby}>exactly the trap</T>
      <Sep x1={12} y1={220} x2={468} y2={220} />
      <Tag x={14} y={240}>fit a primary cell and the circuit charges it</Tag>
      <circle cx={52} cy={286} r={18} fill="url(#qw-sun)" />
      <T x={52} y={290} a="middle" s={10} c={M.ink}>light</T>
      <Arrow a={[74, 286]} b={[110, 286]} c="brass" w={1.8} />
      <Bx x={112} y={268} w={90} h={36} l={['charging', 'circuit']} />
      <Arrow a={[204, 286]} b={[240, 286]} c="ruby" w={1.8} />
      <CellSide x={244} y={276} w={56} h={18} code="SR" />
      <path d="M262 296 q-4 10 4 14 M282 296 q6 8 0 14" stroke={M.crust} strokeWidth="2" fill="none" />
      <T x={312} y={276} s={10.5} c={C.ruby}>it cannot be charged:</T>
      <T x={312} y={290} s={10.5} c={C.ruby}>it may leak, vent or corrode,</T>
      <T x={312} y={304} s={10.5} c={C.ruby}>and you can lose the movement</T>
    </F>
  )
}

function QwSolSymptoms() {
  return (
    <F h={330} view="Check · read the symptoms before opening" scale="schematic">
      <Pn x={12} y={26} w={148} h={140} t="solar" />
      <circle cx={52} cy={80} r={16} fill="url(#qw-sun)" />
      <T x={86} y={78} s={10.5} c={C.emerald}>runs in light</T>
      <circle cx={52} cy={124} r={12} fill="#2a2a3a" stroke={C.dim} />
      <circle cx={57} cy={120} r={10} fill="rgba(255,255,255,0.025)" />
      <T x={74} y={128} s={10.5} c={C.ruby}>stops overnight</T>
      <T x={22} y={156} s={10} c={C.faint}>low on charge</T>
      <Pn x={166} y={26} w={148} h={140} t="eco-drive" />
      <TickRow x={180} y={110} w={120} secs={8} events={[2, 4, 6, 8]} c={C.brassHi} />
      <T x={176} y={80} s={10.5} c={C.text}>2-second steps</T>
      <T x={176} y={136} s={10} c={C.faint}>a charge warning,</T>
      <T x={176} y={149} s={10} c={C.faint}>not a fault</T>
      <Pn x={320} y={26} w={148} h={140} t="kinetic" />
      <T x={330} y={70} s={10.5} c={C.text}>no reserve after</T>
      <T x={330} y={84} s={10.5} c={C.text}>plenty of wear</T>
      <rect x={330} y={100} width={120} height={14} rx="3" fill="none" stroke={C.dim} />
      <rect x={330} y={100} width={14} height={14} rx="3" fill={C.ruby} />
      <T x={330} y={136} s={10} c={C.faint}>points at a tired</T>
      <T x={330} y={149} s={10} c={C.faint}>storage cell</T>
      <Tag x={14} y={192}>first: a day or two of daylight</Tag>
      <Pn x={12} y={204} w={220} h={114} t="bright indirect daylight" tc={C.emerald} ok />
      <rect x={40} y={238} width={60} height={60} fill="rgba(170,210,225,0.18)" stroke={M.glass} />
      <Face cx={150} cy={268} r={26} lugs={false} />
      <path d="M100 250 L124 262 M100 268 L122 270 M100 286 L124 278" stroke="rgba(250,220,120,0.5)" strokeWidth="2" />
      <Pn x={248} y={204} w={220} h={114} t="hot sunny windowsill" tc={C.ruby} ok={false} />
      <circle cx={296} cy={256} r={22} fill="url(#qw-sun)" />
      <Face cx={390} cy={268} r={26} lugs={false} />
      <path d="M428 266 q4 -8 0 -14 M440 266 q4 -8 0 -14" stroke={C.ruby} strokeWidth="1.6" fill="none" />
      <T x={258} y={310} s={10} c={C.ruby}>heat is harder on it than lack of light</T>
    </F>
  )
}

function QwSolReplace() {
  const st = [
    ['Identify the calibre', ''],
    ['Order its secondary cell', 'the matching type'],
    ['Clean the contacts', ''],
    ['Handle by the edge', 'plastic tweezers'],
    ['Same orientation', 'check your photo'],
    ['Insulator in place', ''],
    ['Bridge AC briefly', 'many calibres need it'],
  ]
  return (
    <F h={330} view="Sequence · swap it like a battery" scale="schematic">
      {st.map(([a, b], i) => (
        <g key={a}>
          <Num x={26} y={44 + i * 38} n={i + 1} />
          <T x={42} y={48 + i * 38} s={11} c={i === 6 ? C.brassHi : C.text}>{a}</T>
          {b && <T x={42} y={61 + i * 38} s={10} c={C.faint}>{b}</T>}
        </g>
      ))}
      {(() => {
        const q = QP(350, 170, 100)
        return (
          <g>
            <QMod cx={350} cy={170} r={100} ac clamp={false} />
            <path d={`M${q.ac[0]} ${q.ac[1]} Q300 300 ${q.c(46, 6)[0]} ${q.c(46, 6)[1]}`} fill="none" stroke={C.brass} strokeDasharray="4 3" strokeWidth="1.4" />
            <T x={350} y={300} a="middle" s={10.5} c={C.dim}>AC to its named point, as the sheet says</T>
            <G x={q.cell[0] + 30} y={q.cell[1] - 8} ang={15}><Tweezers c={M.plastic} gap={3} len={60} w={3} /></G>
            <circle cx={q.cell[0]} cy={q.cell[1]} r={q.cellR + 6} fill="none" stroke={M.plastic} strokeWidth="2.5" strokeDasharray="6 3" />
          </g>
        )
      })()}
      <T x={230} y={46} s={10} c={C.faint}>insulator (dashed ring) round the cell</T>
    </F>
  )
}

function QwSolReset() {
  return (
    <F h={300} view="Sequence · after a power interruption" scale="schematic">
      <Chain
        x={14}
        y={34}
        w={100}
        h={52}
        gap={14}
        items={[
          [['Power cut', 'cell out or flat'], C.ruby],
          [['All-reset', 'calibre’s procedure'], C.brass],
          [['Hands to zero', 'reference positions'], C.brass],
          [['Full charge', 'before you judge'], C.emerald],
        ]}
      />
      <Face cx={126} cy={190} r={64} h={300} m={135} s={210} lugs={false} />
      <T x={126} y={280} a="middle" s={10.5} c={C.ruby}>hands lost: odd positions</T>
      <Arrow a={[204, 190]} b={[268, 190]} c="brass" w={2} />
      <Face cx={346} cy={190} r={64} h={0} m={0} s={0} lugs={false} />
      <T x={346} y={280} a="middle" s={10.5} c={C.emerald}>at their zero references</T>
      <T x={346} y={294} a="middle" s={10} c={C.faint}>positions per the calibre’s sheet</T>
    </F>
  )
}

function QwSolCare() {
  const x0 = 40
  const w = 410
  return (
    <F h={300} view="Chart · charge over a long time" scale="schematic, no scale implied">
      <line x1={x0} y1={50} x2={x0} y2={220} stroke={C.dim} />
      <line x1={x0} y1={220} x2={x0 + w} y2={220} stroke={C.dim} />
      <T x={x0 - 4} y={58} a="end" s={10} c={C.faint}>full</T>
      <T x={x0 - 4} y={220} a="end" s={10} c={C.faint}>0</T>
      <T x={x0 + w} y={236} a="end" s={10} c={C.faint}>years →</T>
      <polyline points={Array.from({ length: 21 }, (_, i) => `${x0 + i * (w / 20)},${i % 2 ? 76 : 64}`).join(' ')} fill="none" stroke={C.emerald} strokeWidth="2" />
      <T x={x0 + 10} y={50} s={10.5} c={C.emerald}>worn, or parked in daylight now and then</T>
      <path d={`M${x0} 70 C${x0 + 120} 100 ${x0 + 200} 190 ${x0 + 300} 212 L${x0 + w} 214`} fill="none" stroke={C.ruby} strokeWidth="2" />
      <rect x={x0 + 290} y={196} width={120} height={22} fill="url(#sk-noglue)" />
      <T x={x0 + 220} y={124} s={10.5} c={C.ruby}>left in a drawer</T>
      <T x={x0 + 296} y={176} s={10} c={C.ruby}>deep discharge:</T>
      <T x={x0 + 296} y={189} s={10} c={C.ruby}>may never recover</T>
      <Pn x={12} y={246} w={456} h={46} />
      <T x={24} y={265} s={10.5} c={C.text}>Tell owners: wear it, or park a solar watch in daylight now and then.</T>
      <T x={24} y={280} s={10} c={C.faint}>A Kinetic left unworn does the same as a solar watch left in the dark.</T>
    </F>
  )
}

function QwSolDispose() {
  return (
    <F h={316} view="Sequence · used and damaged cells" scale="schematic">
      <Pn x={12} y={26} w={220} h={136} t="used rechargeable cells" />
      <CellTop cx={60} cy={84} r={22} />
      <Arrow a={[86, 84]} b={[150, 84]} c="brass" w={1.6} />
      <circle cx={180} cy={84} r={22} fill="none" stroke={C.emerald} strokeWidth="2" />
      <path d="M170 76 l10 -8 l10 8 M180 68 l0 30" stroke={C.emerald} strokeWidth="2" fill="none" />
      <T x={22} y={130} s={10.5} c={C.text}>lithium cells and capacitors:</T>
      <T x={22} y={144} s={10.5} c={C.emerald}>recycle like any lithium battery</T>
      <Pn x={248} y={26} w={220} h={136} t="not general waste" tc={C.ruby} ok={false} />
      <path d="M318 60 L398 60 L392 140 L324 140 Z" fill="#3a3f44" stroke={C.dim} />
      <rect x={312} y={52} width={92} height={8} rx="2" fill="#4a5056" />
      <Pn x={12} y={176} w={456} h={130} t="swollen or leaking: it has already failed" tc={C.ruby} />
      <ellipse cx={70} cy={240} rx={30} ry={14} fill="#aebcc5" stroke="#4e5f6a" />
      <ellipse cx={70} cy={232} rx={30} ry={16} fill="url(#qw-cell)" stroke="#4e5f6a" />
      <path d="M44 228 Q70 210 96 228" fill="none" stroke={C.ruby} strokeWidth="1.4" />
      <T x={70} y={282} a="middle" s={10} c={C.faint}>domed, swollen</T>
      {[['Handle it by the edges', true], ['Bag it, then recycle it', true], ['Never puncture it', false], ['Never “test” it in another watch', false]].map(([t, ok], i) => (
        <VRow key={t} x={150} y={218 + i * 22} ok={ok} t={t} />
      ))}
    </F>
  )
}

/* ================================================================== */
/* quartz-cell-replace · what doesn't belong on this bench              */
/* ================================================================== */

function QwQcOther() {
  return (
    <F h={334} view="Comparison · look electronic, aren’t this job" scale="schematic">
      <Pn x={12} y={26} w={456} h={92} t="spring drive · no cell to replace" />
      <Chain
        x={22}
        y={50}
        w={96}
        h={40}
        gap={16}
        items={[
          [['mainspring'], C.brass],
          [['train'], C.struct],
          [['glide wheel', 'generates current'], C.steel],
          [['IC regulates'], C.steel],
        ]}
      />
      <T x={22} y={110} s={10} c={C.faint}>No battery, no motor, no secondary cell.</T>
      <Pn x={12} y={126} w={224} h={196} t="accutron 214" tc={C.brassHi} />
      <Wheel cx={70} cy={196} r={34} spokes={6} teeth />
      <circle cx={70} cy={196} r={44} fill="none" stroke={C.ruby} strokeDasharray="3 3" />
      <T x={70} y={250} a="middle" s={10} c={C.ruby}>never touch the rim</T>
      <G x={70} y={196} ang={140}><Tweezers c={C.steel} gap={2} len={44} w={2} /></G>
      <T x={124} y={160} s={10.5} c={C.text}>handle the index</T>
      <T x={124} y={174} s={10.5} c={C.text}>wheel by its pinion</T>
      <T x={22} y={272} s={10} c={C.dim}>Original cells were 1.35 V. Forum advice:</T>
      <T x={22} y={285} s={10} c={C.dim}>a 1.55 V silver cell can destroy a 214</T>
      <T x={22} y={298} s={10} c={C.dim}>coil set. Field opinion, not Bulova</T>
      <T x={22} y={311} s={10} c={C.dim}>guidance.</T>
      <Pn x={244} y={126} w={224} h={124} t="hamilton 500 electric" tc={C.brassHi} />
      <T x={254} y={160} s={10.5} c={C.text}>contacts have no adjustment margin</T>
      <T x={254} y={184} s={10.5} c={C.dim}>A 394 or 389 with a spacer stands</T>
      <T x={254} y={198} s={10.5} c={C.dim}>in for the original 500 and 505 cells.</T>
      <CellSide x={268} y={214} w={44} h={14} code="394" />
      <rect x={268} y={228} width={44} height={6} fill={M.plastic} />
      <T x={322} y={232} s={10} c={C.faint}>+ spacer</T>
      <rect x={244} y={262} width={224} height={60} rx="8" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <T x={356} y={286} a="middle" s={11} c={C.ruby} w={600}>Meet one of these?</T>
      <T x={356} y={304} a="middle" s={10.5} c={C.text}>Stop and read up first.</T>
    </F>
  )
}

/* ================================================================== */
/* shop-setup · setting up your bench                                   */
/* ================================================================== */

// A small slotted screw in side view, head at top; (x, y) = head top centre
const ScrewSide = ({ x, y, k = 1, ang = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${k})`}>
    <rect x={-6} y={0} width={12} height={5} rx="1.5" fill="#c5ced4" stroke="#3e4a52" strokeWidth="0.6" />
    <rect x={-1} y={0} width={2} height={2.5} fill="#2c353b" />
    <rect x={-3} y={5} width={6} height={12} fill="#aebac2" stroke="#3e4a52" strokeWidth="0.5" />
    {[7, 10, 13].map((d) => (
      <line key={d} x1={-3} y1={d} x2={3} y2={d + 2} stroke="#5e6c74" strokeWidth="0.7" />
    ))}
  </g>
)

function QwSsSurface() {
  return (
    <F h={330} view="Section and plan · catching dropped parts" scale="schematic">
      <Pn x={12} y={26} w={220} h={130} t="light mat with a lip" tc={C.emerald} ok />
      <path d="M26 128 L26 104 L34 104 L34 120 L210 120 L210 104 L218 104 L218 128 Z" fill="#e7e2d5" stroke="#9c9484" />
      <ScrewSide x={180} y={102} k={0.9} ang={80} />
      <Arrow d="M80 60 Q150 52 176 96" c="steel" w={1.3} dash="3 2" />
      <T x={30} y={146} s={10} c={C.dim}>it lands, it shows, it stays</T>
      <Pn x={248} y={26} w={220} h={130} t="carpet" tc={C.ruby} ok={false} />
      <rect x={262} y={104} width={192} height={24} fill="url(#qw-carpet)" />
      <ScrewSide x={380} y={110} k={0.9} ang={150} o={0.6} />
      <Arrow d="M320 60 Q370 54 378 100" c="ruby" w={1.3} dash="3 2" />
      <T x={262} y={146} s={10} c={C.ruby}>parts vanish into the fibres</T>

      {/* plan: two-metre radius */}
      <circle cx={108} cy={248} r={70} fill="rgba(208,168,79,0.06)" stroke={C.brass} strokeDasharray="5 4" />
      <rect x={84} y={238} width={48} height={20} rx="2" fill="url(#sk-wood)" />
      <circle cx={108} cy={272} r={8} fill="#596770" />
      <Dim a={[108, 248]} b={[178, 248]} off={-22} text="2 m" c={C.brassHi} />
      <T x={108} y={326} a="middle" s={10} c={C.dim}>a dropped part is usually inside here</T>
      {/* vacuum nozzle with stocking */}
      <path d="M268 210 L420 260" stroke="#596770" strokeWidth="16" strokeLinecap="round" />
      <path d="M408 248 L440 262 L432 282 L400 268 Z" fill="rgba(240,230,220,0.35)" stroke={C.dim} />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={404 + i * 6} y1={250 + i * 2.6} x2={398 + i * 6} y2={266 + i * 2.6} stroke={C.dim} strokeWidth="0.5" />
      ))}
      <rect x={398} y={246} width={8} height={22} fill={C.brass} transform="rotate(20 402 257)" />
      <ScrewSide x={446} y={268} k={0.8} ang={-70} />
      <SL p={[402, 252]} x={300} y={196} text="tape" a="start" s={10} />
      <SL p={[424, 272]} x={262} y={296} text="stocking over the nozzle" sub="the part sticks to it, not in the bag" a="start" />
    </F>
  )
}

function QwSsHeight() {
  return (
    <F h={330} view="Side view · eye level with the work" scale="schematic">
      {/* chair */}
      <rect x={40} y={252} width={90} height={10} fill="#5e4027" />
      <rect x={80} y={262} width={8} height={56} fill="#5e4027" />
      {/* person */}
      <circle cx={112} cy={108} r={20} fill="#6c5f53" stroke={C.dim} />
      <circle cx={126} cy={104} r="2.5" fill={C.text} />
      <path d="M100 128 L94 250" stroke="#6c5f53" strokeWidth="22" strokeLinecap="round" />
      <path d="M100 150 L150 176 L208 150" fill="none" stroke="#857565" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M94 246 L170 246 L170 316" fill="none" stroke="#6c5f53" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      {/* bench */}
      <rect x={160} y={150} width={290} height={14} fill="url(#sk-wood)" />
      <rect x={430} y={164} width={10} height={154} fill="#5e4027" />
      <rect x={210} y={140} width={30} height={10} rx="3" fill="url(#sk-steel)" />
      <circle cx={150} cy={176} r={5} fill={C.emerald} />
      <line x1={128} y1={104} x2={226} y2={140} stroke={C.brass} strokeDasharray="4 3" />
      <SL p={[176, 120]} x={250} y={92} text="eye nearly level with the watch" sub="you look across it, not down on it" c={C.brassHi} a="start" />
      <SL p={[150, 176]} x={250} y={196} text="elbows and wrists supported" sub="steadiness comes from support, not tension" c={C.emerald} a="start" />
      <line x1={448} y1={150} x2={448} y2={62} stroke={C.struct} strokeWidth="0.8" />
      <circle cx={448} cy={150} r="2.2" fill={C.text} />
      <T x={448} y={56} a="end" s={10.5} c={C.text}>bench high enough to almost rest your chin on</T>
      {/* front view inset: rough T */}
      <Pn x={196} y={226} w={220} h={94} t="from the front" />
      <circle cx={285} cy={262} r={9} fill="#6c5f53" />
      <line x1={285} y1={271} x2={285} y2={312} stroke="#6c5f53" strokeWidth="8" />
      <line x1={236} y1={282} x2={334} y2={282} stroke="#857565" strokeWidth="6" strokeLinecap="round" />
      <T x={346} y={286} s={10} c={C.dim}>arms form</T>
      <T x={346} y={299} s={10} c={C.dim}>a rough “T”</T>
    </F>
  )
}

function QwSsClean() {
  const No = ({ x, y, l, children }) => (
    <g>
      {children}
      <circle cx={x} cy={y} r={24} fill="none" stroke={C.ruby} strokeWidth="2" />
      <line x1={x - 17} y1={y - 17} x2={x + 17} y2={y + 17} stroke={C.ruby} strokeWidth="2" />
      <T x={x} y={y + 40} a="middle" s={10.5} c={C.text}>{l}</T>
    </g>
  )
  return (
    <F h={316} view="Plan and section · dust is the enemy" scale="schematic">
      <Tag x={14} y={42}>keep away from the bench</Tag>
      <No x={60} y={84} l="food">
        <path d="M46 88 Q60 70 74 88 Z" fill="#b48455" />
      </No>
      <No x={160} y={84} l="pets">
        <path d="M150 92 l4 -14 l6 8 l6 -8 l4 14 Z" fill="#8a7a6a" />
      </No>
      <No x={260} y={84} l="drafts">
        <path d="M244 80 q8 -6 16 0 t16 0 M244 90 q8 -6 16 0 t16 0" fill="none" stroke={C.steel} strokeWidth="2" />
      </No>
      <Pn x={312} y={26} w={156} h={120} t="before you open" />
      <path d="M332 100 q-14 -14 0 -28 l26 4 l0 20 Z" fill="#c94a3c" />
      <rect x={358} y={78} width={18} height={8} fill="#333" />
      {[0, 1, 2].map((i) => (
        <Arrow key={i} a={[380, 78 + i * 6]} b={[440, 70 + i * 14]} c="steel" w={1.2} />
      ))}
      <T x={322} y={130} s={10.5} c={C.text}>blow down the work area</T>
      <Sep x1={12} y1={166} x2={468} y2={166} />
      <Tag x={14} y={188}>tip: a silicone baking mat with a raised edge</Tag>
      <path d="M40 270 L40 230 Q40 222 48 222 L56 222 L56 254 L424 254 L424 222 L432 222 Q440 222 440 230 L440 270 Z" fill="#e4dcc6" stroke="#a89c82" />
      <circle cx={180} cy={250} r={4} fill="#4e5f6a" />
      <rect x={300} y={246} width={14} height={8} fill="#8a6a2a" />
      <SL p={[48, 224]} x={80} y={212} text="raised edge" a="start" s={10} />
      <T x={240} y={294} a="middle" s={10.5} c={C.dim}>cheap, light-coloured enough to show parts, and it catches everything</T>
    </F>
  )
}

function QwSsForget() {
  const Card = ({ x, y, l, sub, children }) => (
    <g>
      <rect x={x} y={y} width={146} height={112} rx="8" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      {children}
      <T x={x + 73} y={y + 88} a="middle" s={10.5} c={C.text}>{l}</T>
      {sub && <T x={x + 73} y={y + 102} a="middle" s={10} c={C.faint}>{sub}</T>}
    </g>
  )
  return (
    <F h={300} view="Checklist · the dull buys" scale="after the BHI student list">
      <Card x={12} y={30} l="bench and seat" sub="with arm rests">
        <rect x={40} y={50} width={90} height={8} fill="url(#sk-wood)" />
        <rect x={50} y={58} width={6} height={16} fill="#5e4027" />
        <rect x={114} y={58} width={6} height={16} fill="#5e4027" />
        <rect x={30} y={62} width={24} height={4} fill="#857565" />
      </Card>
      <Card x={166} y={30} l="a proper bench light">
        <path d="M224 76 L224 50 L264 44" stroke={C.struct} strokeWidth="3" fill="none" />
        <path d="M258 40 L278 46 L272 56 L254 50 Z" fill={C.struct} />
        <path d="M264 54 L250 80 L290 80 Z" fill="url(#qw-lamp)" />
      </Card>
      <Card x={320} y={30} l="a case cushion">
        <ellipse cx={393} cy={66} rx={34} ry={14} fill="#3b5a7a" stroke="#6a8aa8" />
        <ellipse cx={393} cy={60} rx={14} ry={6} fill="url(#sk-steel)" />
      </Card>
      <Card x={89} y={152} l="parts tray with a cover">
        <rect x={118} y={168} width={88} height={40} rx="4" fill="#d8d2c2" stroke="#9c9484" />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={122 + i * 21} y={172} width={17} height={32} rx="3" fill="#eeeadf" />)}
        <rect x={114} y={164} width={96} height={48} rx="5" fill="rgba(170,210,225,0.2)" stroke={M.glass} />
      </Card>
      <Card x={243} y={152} l="more than one eyeglass" sub="different strengths">
        {[0, 1].map((i) => (
          <g key={i}>
            <path d={`M${280 + i * 40} ${168} l20 0 l-4 34 l-12 0 Z`} fill="#2b2b2b" stroke={C.dim} />
            <ellipse cx={290 + i * 40} cy={168} rx={12} ry={4} fill="url(#qw-acr)" stroke={M.glass} />
          </g>
        ))}
      </Card>
      <T x={240} y={290} a="middle" s={10} c={C.faint}>What to buy and when: the Tool buying guide in Reference.</T>
    </F>
  )
}

function QwSsTest() {
  return (
    <F h={316} view="Test · try the bench with a spare screw" scale="schematic">
      {[
        ['1 · drop it', 'from working height', 'it should land and stay on the mat', 'bounces off? raise the edge or add a tray'],
        ['2 · pick it up', 'tweezers, elbows supported', 'a steady hand', 'shakes? change the height, not your grip'],
        ['3 · read the slot', 'through your loupe', 'clear, no leaning in', 'squinting? move the light'],
      ].map(([t, a, ok, fix], i) => {
        const x = 12 + i * 154
        return (
          <g key={t}>
            <Pn x={x} y={26} w={146} h={278} t={t} />
            <T x={x + 10} y={60} s={10.5} c={C.dim}>{a}</T>
            {i === 0 && (
              <g>
                <ScrewSide x={x + 73} y={74} k={1.2} />
                <Arrow a={[x + 73, 100]} b={[x + 73, 150]} c="steel" w={1.4} dash="3 2" />
                <path d={`M${x + 16} 176 L${x + 16} 160 L${x + 22} 160 L${x + 22} 170 L${x + 124} 170 L${x + 124} 160 L${x + 130} 160 L${x + 130} 176 Z`} fill="#e7e2d5" stroke="#9c9484" />
                <ScrewSide x={x + 80} y={156} k={0.9} ang={84} />
              </g>
            )}
            {i === 1 && (
              <g>
                <rect x={x + 16} y={170} width={114} height={8} fill="url(#sk-wood)" />
                <circle cx={x + 30} cy={166} r={5} fill={C.emerald} />
                <path d={`M${x + 30} 166 L${x + 70} 140`} stroke="#857565" strokeWidth="7" strokeLinecap="round" />
                <G x={x + 100} y={150} ang={-60}><Tweezers c={C.steel} gap={3} len={40} w={2.2} /></G>
                <ScrewSide x={x + 102} y={146} k={0.7} ang={90} />
              </g>
            )}
            {i === 2 && (
              <g>
                <Ring x={x + 73} y={128} r={44} />
                <circle cx={x + 73} cy={128} r={26} fill="#c5ced4" stroke="#3e4a52" />
                <rect x={x + 49} y={124} width={48} height={8} fill="#2c353b" />
              </g>
            )}
            <Verdict x={x + 18} y={208} ok r={7} />
            <T x={x + 30} y={212} s={10} c={C.text}>{ok.length > 22 ? ok.slice(0, ok.lastIndexOf(' ', 22)) : ok}</T>
            {ok.length > 22 && <T x={x + 30} y={225} s={10} c={C.text}>{ok.slice(ok.lastIndexOf(' ', 22) + 1)}</T>}
            <Verdict x={x + 18} y={250} ok={false} r={7} />
            <T x={x + 30} y={254} s={10} c={C.dim}>{fix.split('? ')[0]}?</T>
            <T x={x + 30} y={268} s={10} c={C.brassHi}>{fix.split('? ')[1].length > 20 ? fix.split('? ')[1].slice(0, fix.split('? ')[1].lastIndexOf(' ', 20)) : fix.split('? ')[1]}</T>
            {fix.split('? ')[1].length > 20 && <T x={x + 30} y={281} s={10} c={C.brassHi}>{fix.split('? ')[1].slice(fix.split('? ')[1].lastIndexOf(' ', 20) + 1)}</T>}
          </g>
        )
      })}
    </F>
  )
}

/* ================================================================== */
/* shop-handling · handling parts and staying clean                     */
/* ================================================================== */

function QwShFingers() {
  return (
    <F h={300} view="Comparison · skin oil on a part" scale="schematic">
      <Pn x={12} y={26} w={220} h={196} t="bare finger" tc={C.ruby} ok={false} />
      <rect x={30} y={170} width={184} height={18} rx="4" fill="url(#sk-steel)" />
      <G x={110} y={166}><Finger w={22} len={100} /></G>
      <T x={30} y={208} s={10} c={C.dim}>oil left on a polished part</T>
      <Pn x={248} y={26} w={220} h={196} t="finger cot" tc={C.emerald} ok />
      <rect x={266} y={170} width={184} height={18} rx="4" fill="url(#sk-steel)" />
      <G x={346} y={166}><Finger w={22} len={100} /></G>
      <G x={346} y={166}><Finger w={24} len={54} c="rgba(240,236,220,0.75)" gloved /></G>
      <T x={266} y={208} s={10} c={C.dim}>for components, cases and dials</T>
      <Tag x={14} y={246}>what a print becomes</Tag>
      <Chain
        x={14}
        y={256}
        w={136}
        h={36}
        gap={18}
        items={[
          [['fingerprint'], C.struct],
          [['skin oil and salt'], C.brass],
          [['long-term corrosion'], C.ruby],
        ]}
      />
    </F>
  )
}

function QwShTweezers() {
  return (
    <F h={324} view="Detail · how to hold a screw" scale="schematic, magnified">
      <Pn x={12} y={26} w={220} h={200} t="by the thread" tc={C.emerald} ok />
      <rect x={30} y={190} width={184} height={20} fill="url(#qw-plcut)" />
      <rect x={114} y={190} width={16} height={20} fill={C.ground} />
      <ScrewSide x={122} y={112} k={3} />
      <G x={122} y={136} ang={90}><Tweezers c={C.steel} gap={9} tip={10} len={90} w={3} /></G>
      <Arrow a={[160, 166]} b={[160, 186]} c="brass" w={1.4} />
      <T x={30} y={66} s={10} c={C.dim}>balanced, it drops</T>
      <T x={30} y={79} s={10} c={C.dim}>straight into its hole</T>
      <Pn x={248} y={26} w={220} h={200} t="grip" />
      <T x={258} y={60} s={10.5} c={C.text}>lightly, over as much of the</T>
      <T x={258} y={74} s={10.5} c={C.text}>part’s surface as you can</T>
      <circle cx={358} cy={140} r={36} fill="none" stroke={C.brass} strokeDasharray="4 3" />
      <ScrewSide x={358} y={124} k={1.6} />
      <Arrow d="M322 138 A36 36 0 0 0 358 176" c="brass" w={1.6} />
      <T x={358} y={200} a="middle" s={10} c={C.dim}>practise turning the tweezers</T>
      <T x={358} y={213} a="middle" s={10} c={C.dim}>round a held screw</T>
      <rect x={12} y={240} width={456} height={74} rx="8" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <T x={24} y={262} s={11} c={C.ruby} w={600}>Springs and small levers fly.</T>
      <T x={24} y={278} s={10.5} c={C.text}>Keep a cupped hand or a clear box around the work, and expect</T>
      <T x={24} y={292} s={10.5} c={C.text}>to search the floor now and then.</T>
      <T x={24} y={308} s={10} c={C.faint}>Dress the tips smooth so they don’t mar or slip off parts.</T>
    </F>
  )
}

function QwShMaterial() {
  const rows = [
    ['steel', C.steel, 'medium, fine, very fine, super fine', 'marks surfaces, conducts', 'keep away from cells'],
    ['brass', M.brassP, 'medium, fine', 'soft parts and plates', 'it conducts too'],
    ['plastic', M.plastic, 'one pair, 3 mm spade tips', 'for batteries', 'can cross and distort'],
  ]
  return (
    <F h={334} view="Table · a starter set by material" scale="after the BHI list">
      {rows.map(([m, c, sizes, use, warn], i) => {
        const y = 32 + i * 66
        return (
          <g key={m}>
            <rect x={12} y={y} width={456} height={58} rx="6" fill="rgba(255,255,255,0.025)" stroke={C.line} />
            <path d={`M28 ${y + 22} L84 ${y + 18} L84 ${y + 22} Z M28 ${y + 36} L84 ${y + 40} L84 ${y + 36} Z`} fill={c} />
            {m === 'plastic' && <rect x={20} y={y + 20} width={10} height={18} rx="2" fill={c} />}
            <T x={100} y={y + 22} s={11.5} c={C.text} w={600}>{m}</T>
            <T x={100} y={y + 38} s={10} c={C.dim}>{sizes}</T>
            <T x={300} y={y + 22} s={10.5} c={C.text}>{use}</T>
            <T x={300} y={y + 38} s={10.5} c={i === 2 ? C.brassHi : C.ruby}>{warn}</T>
          </g>
        )
      })}
      <Tag x={14} y={252}>check the tips against the light</Tag>
      {[
        ['meet evenly', true, 0],
        ['crossed', false, 1],
        ['gap', false, 2],
      ].map(([l, ok, k], i) => {
        const x = 60 + i * 150
        return (
          <g key={l}>
            <path d={`M${x - 20} 270 L${x + 2} ${k === 2 ? 294 : 296}`} stroke={C.steel} strokeWidth="3" strokeLinecap="round" />
            <path d={`M${x + 20} 270 L${k === 1 ? x - 4 : k === 2 ? x + 6 : x + 2} ${k === 2 ? 298 : 296}`} stroke={C.steel} strokeWidth="3" strokeLinecap="round" />
            <Verdict x={x + 34} y={284} ok={ok} r={7} />
            <T x={x} y={318} a="middle" s={10.5} c={ok ? C.emerald : C.ruby}>{l}</T>
          </g>
        )
      })}
      <T x={468} y={318} a="end" s={10} c={C.faint}>dress or replace</T>
    </F>
  )
}

function QwShDriver() {
  return (
    <F h={330} view="Section and side · a blade that fits" scale="schematic, magnified">
      <Pn x={12} y={26} w={220} h={150} t="fills the slot" tc={C.emerald} ok />
      <rect x={42} y={120} width={160} height={30} rx="6" fill="#c5ced4" stroke="#3e4a52" />
      <rect x={42} y={112} width={160} height={14} fill={C.ground} />
      <path d="M42 50 L202 50 L202 70 L130 112 L114 112 L42 70 Z" fill="url(#sk-steelH)" stroke={M.steelD} />
      <rect x={42} y={112} width={160} height={8} fill="url(#sk-steel)" stroke={M.steelD} />
      <T x={122} y={166} a="middle" s={10} c={C.dim}>as wide as the screw, touching the slot bottom</T>
      <Pn x={248} y={26} w={220} h={150} t="too narrow, too shallow" tc={C.ruby} ok={false} />
      <rect x={278} y={120} width={160} height={30} rx="6" fill="#c5ced4" stroke="#3e4a52" />
      <rect x={278} y={112} width={160} height={14} fill={C.ground} />
      <path d="M318 50 L398 50 L398 70 L362 104 L354 104 L318 70 Z" fill="url(#sk-steelH)" stroke={M.steelD} />
      <path d="M300 116 l10 -6 M418 116 l-8 -6" stroke={C.ruby} strokeWidth="2" />
      <T x={358} y={166} a="middle" s={10} c={C.ruby}>chews the polished head and slips</T>

      <Tag x={14} y={200}>dressed on a stone: the profile from the side</Tag>
      <path d="M60 235 L120 235 L240 262 L240 268 L120 295 L60 295 Z" fill="url(#sk-steelH)" stroke={M.steelD} />
      <line x1={120} y1={235} x2={120} y2={295} stroke={M.steelD} strokeDasharray="2 2" />
      <Dim a={[60, 235]} b={[60, 295]} off={14} text="w" c={C.brassHi} />
      <Dim a={[120, 222]} b={[240, 222]} off={0} text="taper ≈ 2 × w" c={C.brassHi} />
      <line x1={240} y1={222} x2={240} y2={258} stroke={C.dim} strokeWidth="0.6" />
      <line x1={120} y1={222} x2={120} y2={232} stroke={C.dim} strokeWidth="0.6" />
      <SL p={[241, 265]} x={180} y={318} text="tip ≈ w/10, a narrow flat" c={C.brassHi} a="start" s={10} />
      <T x={300} y={236} s={10.5} c={C.text}>rectangular tip, sharpened</T>
      <T x={300} y={250} s={10.5} c={C.text}>on a stone</T>
      <T x={300} y={276} s={10.5} c={C.dim}>Rest your index finger’s</T>
      <T x={300} y={290} s={10.5} c={C.dim}>middle joint on the swivel;</T>
      <T x={300} y={304} s={10.5} c={C.dim}>steady the hand on the bench.</T>
    </F>
  )
}

function QwShTray() {
  const items = Array.from({ length: 8 }, (_, i) => (cx, cy) => (
    <g>
      {i % 3 === 0 ? <Screw x={cx} y={cy} r={5} ang={i * 20} /> : i % 3 === 1 ? <Wheel cx={cx} cy={cy} r={11} spokes={4} /> : <rect x={cx - 12} y={cy - 5} width={24} height={10} rx="4" fill={M.plate} stroke={C.brass} />}
      <T x={cx - 16} y={cy - 9} s={10} c={C.ground} w={700}>{i + 1}</T>
    </g>
  ))
  return (
    <F h={252} view="Plan · one part, one place" scale="schematic">
      <Tray x={30} y={50} cols={4} rows={2} cw={56} ch={46} items={items} />
      <Arrow d="M30 34 L250 34" c="brass" w={1.6} />
      <T x={30} y={28} s={10} c={C.brassHi}>out: in removal order 1 → 8</T>
      <Arrow d="M250 162 L30 162" c="emerald" w={1.6} />
      <T x={30} y={180} s={10} c={C.emerald}>back in: run backward, 8 → 1</T>
      <Pn x={300} y={26} w={168} h={170} t="never" tc={C.ruby} ok={false} />
      {[[350, 120], [366, 126], [380, 118], [392, 130], [372, 136], [360, 110], [386, 108]].map(([x, y], i) => (
        <Screw key={i} x={x} y={y} r={5} ang={i * 37} />
      ))}
      <Wheel cx={410} cy={130} r={10} spokes={4} />
      <T x={384} y={170} a="middle" s={10.5} c={C.text}>one loose pile</T>
      <T x={384} y={184} a="middle" s={10} c={C.ruby}>matching screws later: a nightmare</T>
      <T x={14} y={224} s={10.5} c={C.dim}>Every screw and part goes in its own compartment the moment it comes</T>
      <T x={14} y={238} s={10.5} c={C.dim}>out. Reassembly then simply reads the tray in reverse.</T>
    </F>
  )
}

function QwShClean() {
  return (
    <F h={300} view="Sequence · clean tools before clean parts" scale="schematic">
      <Pn x={12} y={26} w={220} h={190} t="wipe the tips" />
      <rect x={40} y={140} width={150} height={30} rx="4" fill="#e7e2d5" />
      <G x={110} y={150} ang={-70}><Tweezers c={C.steel} gap={4} len={80} w={3} /></G>
      <Arrow a={[70, 120]} b={[150, 120]} c="brass" w={1.4} both />
      <T x={22} y={192} s={10.5} c={C.text}>tweezers and drivers, before</T>
      <T x={22} y={205} s={10} c={C.faint}>they touch a cleaned part</T>
      <Pn x={248} y={26} w={220} h={190} t="rodico as you go" />
      <rect x={262} y={140} width={192} height={18} fill={M.plate} stroke={C.brass} />
      <circle cx={300} cy={140} r="2" fill="#ddd" />
      <ellipse cx={360} cy={140} rx={10} ry={3} fill="rgba(127,196,232,0.6)" />
      <rect x={340} y={92} width={40} height={26} rx="10" fill="#5fb3b0" />
      <Arrow a={[360, 124]} b={[360, 134]} c="brass" w={1.4} />
      <SL p={[300, 140]} x={270} y={82} text="dust" a="start" s={10} />
      <SL p={[368, 140]} x={410} y={84} text="stray oil" a="middle" s={10} />
      <T x={258} y={192} s={10.5} c={C.text}>dab, don’t wipe, to lift</T>
      <T x={258} y={205} s={10} c={C.faint}>dust and oil off surfaces</T>
      <rect x={12} y={230} width={456} height={56} rx="8" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={252} s={10.5} c={C.dim}>Dirty tips carry old oil and grit straight back onto parts</T>
      <T x={24} y={266} s={10.5} c={C.dim}>you have just cleaned.</T>
    </F>
  )
}

function QwShMagnet() {
  return (
    <F h={330} view="Test and sequence · a magnetised tool" scale="schematic">
      <Pn x={12} y={26} w={220} h={130} t="lifts the screw" tc={C.ruby} ok={false} />
      <G x={80} y={104} ang={0}><Screwdriver len={42} blade={6} /></G>
      <ScrewSide x={80} y={106} k={1} />
      <rect x={30} y={130} width={190} height={6} fill="#e7e2d5" />
      <Pn x={248} y={26} w={220} h={130} t="leaves it" tc={C.emerald} ok />
      <G x={320} y={104} ang={0}><Screwdriver len={42} blade={6} /></G>
      <ScrewSide x={330} y={113} k={1} ang={88} />
      <rect x={266} y={130} width={190} height={6} fill="#e7e2d5" />
      <Tag x={14} y={178}>the cure, with a demagnetiser</Tag>
      <rect x={26} y={232} width={64} height={46} rx="6" fill="#3a3f44" stroke={C.dim} />
      <rect x={38} y={222} width={40} height={10} fill="#2a2e32" />
      <circle cx={58} cy={262} r="6" fill={C.ruby} />
      <G x={120} y={226} ang={-90}><Screwdriver len={50} blade={5} /></G>
      <Arrow a={[132, 230]} b={[262, 230]} c="brass" w={1.8} />
      <Dim a={[90, 290]} b={[262, 290]} off={-8} text="about 30 cm" c={C.brassHi} />
      {[['Hold the button down', 'before the tool comes near'], ['Draw it away slowly', 'to about 30 cm'], ['Only then release', ''], ['Test on the screw again', 'repeat if it still clings']].map(([a, b], i) => (
        <Row key={a} x={290} y={200 + i * 32} n={i + 1} t={a} sub={b} />
      ))}
      <T x={14} y={320} s={10} c={C.ruby}>Don’t tap the tool on the coil: it can leave it worse.</T>
    </F>
  )
}

/* ================================================================== */
/* shop-safety · safety on the bench                                    */
/* ================================================================== */

function Spiral({ cx, cy, r0, r1, turns, c = C.steel, w = 1.4 }) {
  const pts = []
  for (let a = 0; a <= 360 * turns; a += 10) pts.push(pol(cx, cy, r0 + ((r1 - r0) * a) / (360 * turns), a))
  return <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={c} strokeWidth={w} />
}

function QwSfSpring() {
  return (
    <F h={330} view="Plan · stored energy in the mainspring" scale="schematic">
      <Pn x={12} y={26} w={220} h={170} t="1 · let it down first" />
      <circle cx={110} cy={116} r={54} fill="rgba(201,162,76,0.12)" stroke={M.brassP} strokeWidth="3" />
      <Spiral cx={110} cy={116} r0={8} r1={50} turns={7} />
      <rect x={160} y={110} width={40} height={6} fill="url(#sk-steelH)" />
      <rect x={198} y={104} width={12} height={18} rx="2" fill="url(#qw-knurl)" />
      <Turn cx={204} cy={113} r={16} from={200} to={340} />
      <T x={22} y={186} s={10} c={C.dim}>release the power slowly, crown held</T>
      <Pn x={248} y={26} w={220} h={170} t="2 · out of the barrel" />
      <circle cx={300} cy={110} r={34} fill="rgba(201,162,76,0.12)" stroke={M.brassP} strokeWidth="2" />
      <Spiral cx={300} cy={110} r0={6} r1={30} turns={6} />
      <Verdict x={300} y={162} ok r={7} />
      <T x={312} y={166} s={10} c={C.text}>held</T>
      <path d="M400 90 C460 60 440 150 390 130 C350 110 420 60 446 120" fill="none" stroke={C.steel} strokeWidth="1.6" />
      <Arrow a={[440, 132]} b={[456, 162]} c="ruby" w={1.6} />
      <Verdict x={404} y={162} ok={false} r={7} />
      <T x={416} y={166} s={10} c={C.ruby}>loose</T>
      <rect x={12} y={210} width={456} height={108} rx="8" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <T x={24} y={234} s={11.5} c={C.ruby} w={600}>The biggest physical hazard on the bench</T>
      <T x={24} y={254} s={10.5} c={C.text}>A mainspring released carelessly can whip out, cut fingers and</T>
      <T x={24} y={268} s={10.5} c={C.text}>destroy the part.</T>
      <T x={24} y={292} s={10.5} c={C.dim}>Always let it down before disassembly, and control mainsprings</T>
      <T x={24} y={306} s={10.5} c={C.dim}>whenever they’re out of the barrel.</T>
    </F>
  )
}

function QwSfEyes() {
  return (
    <F h={300} view="Side view · what flies toward your face" scale="schematic">
      {/* head profile, simple */}
      <path d="M392 70 Q440 70 446 120 L452 140 L442 144 L444 170 Q440 200 400 204 L392 260" fill="none" stroke={C.dim} strokeWidth="2" />
      <circle cx={430} cy={118} r="3" fill={C.text} />
      <rect x={414} y={104} width={36} height={26} rx="6" fill="rgba(170,210,225,0.35)" stroke={M.glass} strokeWidth="2" />
      <line x1={414} y1={112} x2={382} y2={108} stroke={M.glass} strokeWidth="2" />
      {/* bench with watch and spring bar */}
      <rect x={20} y={236} width={300} height={10} fill="url(#sk-wood)" />
      <rect x={80} y={216} width={80} height={20} rx="6" fill="url(#sk-steel)" />
      <path d="M170 210 Q300 80 452 116" fill="none" stroke={C.ruby} strokeWidth="1.6" strokeDasharray="5 3" />
      <rect x={398} y={108} width={14} height={4} rx="2" fill="url(#sk-steelH)" transform="rotate(10 405 110)" />
      <T x={300} y={100} s={10.5} c={C.ruby}>a spring bar, launched</T>
      <SL p={[432, 130]} x={300} y={168} text="safety glasses stop it" c={M.glass} a="start" />
      <Pn x={12} y={26} w={236} h={96} t="most likely with" />
      <T x={22} y={62} s={10.5} c={C.text}>chronographs and spring bars:</T>
      <T x={22} y={76} s={10.5} c={C.text}>tensioned springs let go</T>
      <T x={22} y={98} s={10} c={C.faint}>Glasses are cheap insurance.</T>
      <T x={22} y={112} s={10} c={C.faint}>ETA requires them for all movement work.</T>
      <T x={20} y={276} s={10} c={C.faint}>Make glasses a habit, not a decision.</T>
    </F>
  )
}

function QwSfChem() {
  return (
    <F h={300} view="Checklist · solvents and cleaning fluids" scale="schematic">
      <path d="M60 110 L60 90 L80 90 L80 110 L96 128 L96 230 L44 230 L44 128 Z" fill="rgba(170,210,225,0.25)" stroke={M.glass} />
      <rect x={44} y={150} width={52} height={50} fill={M.paper} />
      <T x={70} y={172} a="middle" s={10} c="#3a342c" w={700}>READ</T>
      <T x={70} y={186} a="middle" s={10} c="#3a342c">label</T>
      {[
        ['Read the label', 'every fluid, every time'],
        ['Ventilation', 'open a window, keep air moving'],
        ['Avoid skin contact', 'gloves; wash off splashes'],
        ['Away from heat and flame', 'no flame, no heater nearby'],
      ].map(([a, b], i) => (
        <Row key={a} x={140} y={56 + i * 46} n={i + 1} t={a} sub={b} />
      ))}
      <path d="M402 68 l0 50 l48 0 l0 -50 Z" fill="none" stroke={C.dim} />
      <path d="M408 92 q10 -6 18 0 t18 0" stroke={C.steel} strokeWidth="1.6" fill="none" />
      <Arrow a={[400, 92]} b={[370, 92]} c="steel" w={1.2} />
      <path d="M426 212 q-12 -14 0 -32 q12 18 0 32 Z" fill="#e0884a" />
      <circle cx={426} cy={196} r={22} fill="none" stroke={C.ruby} strokeWidth="2" />
      <line x1={410} y1={180} x2={442} y2={212} stroke={C.ruby} strokeWidth="2" />
      <T x={14} y={268} s={10.5} c={C.dim}>Fluids and solvents need ventilation and care.</T>
    </F>
  )
}

function QwSfCuts() {
  const Pry = ({ x, ok }) => (
    <g>
      <rect x={x + 40} y={110} width={120} height={36} rx="10" fill="url(#sk-steel)" stroke={M.steelD} />
      <G x={x + 36} y={150} ang={180}><Finger w={20} len={34} /></G>
      <G x={x + (ok ? 160 : 44)} y={118} ang={ok ? 40 : -40}>
        <path d="M-3 0 L3 0 L3 -40 L-3 -40 Z" fill="url(#sk-steelH)" />
        <rect x="-6" y="-80" width="12" height="40" rx="3" fill="url(#sk-wood)" />
      </G>
      <Arrow a={ok ? [x + 166, 100] : [x + 50, 100]} b={ok ? [x + 200, 80] : [x + 20, 120]} c={ok ? 'emerald' : 'ruby'} w={2} />
    </g>
  )
  return (
    <F h={300} view="Plan · which way the blade goes if it slips" scale="schematic">
      <Pn x={12} y={26} w={220} h={200} t="away from your hands" tc={C.emerald} ok />
      <Pry x={20} ok />
      <T x={22} y={210} s={10.5} c={C.text}>a slip goes into empty air</T>
      <Pn x={248} y={26} w={220} h={200} t="toward the holding hand" tc={C.ruby} ok={false} />
      <Pry x={262} />
      <T x={258} y={210} s={10.5} c={C.ruby}>a slip goes into your finger</T>
      <T x={14} y={252} s={10.5} c={C.text}>Case knives and sharp tweezers cause most cuts, always when prying</T>
      <T x={14} y={266} s={10.5} c={C.text}>toward yourself. Cut and pry away from your hands, every time.</T>
    </F>
  )
}

function QwSfLume() {
  return (
    <F h={316} view="Comparison · old lume, intact or as dust" scale="schematic">
      <Pn x={12} y={26} w={220} h={190} t="intact, behind glass" tc={C.emerald} />
      <Face cx={122} cy={120} r={56} lugs={false} dial="#2a2620" />
      {Array.from({ length: 12 }, (_, i) => {
        const [x, y] = clk(122, 120, 42, i * 30)
        return <circle key={i} cx={x} cy={y} r={3.4} fill="#a69c76" />
      })}
      <circle cx={122} cy={120} r={50} fill="url(#qw-acr)" />
      <T x={122} y={196} a="middle" s={10.5} c={C.emerald}>safe behind the crystal</T>
      <Pn x={248} y={26} w={220} h={190} t="loose dust" tc={C.ruby} />
      <circle cx={358} cy={120} r={50} fill="#2a2620" stroke={C.struct} />
      {Array.from({ length: 12 }, (_, i) => {
        const [x, y] = clk(358, 120, 42, i * 30)
        return <circle key={i} cx={x} cy={y} r={3.4} fill={i % 3 ? '#a69c76' : 'none'} stroke="#a69c76" strokeWidth="0.6" />
      })}
      {[[380, 80], [386, 72], [396, 66], [402, 58], [372, 70]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.6" fill="#a69c76" />)}
      <Trefoil x={438} y={170} r={11} />
      <T x={358} y={196} a="middle" s={10.5} c={C.ruby}>dangerous if made airborne</T>
      <rect x={12} y={230} width={456} height={76} rx="8" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <T x={24} y={252} s={11} c={C.text} w={600}>Treat old unmarked lume as radium until tested.</T>
      <T x={24} y={268} s={10.5} c={C.dim}>Radium stays radioactive for thousands of years.</T>
      <T x={24} y={284} s={10.5} c={C.dim}>Read Radium &amp; vintage lume safety before you open a vintage watch.</T>
    </F>
  )
}

function QwSfCells() {
  return (
    <F h={340} view="Safety · loose button cells" scale="schematic">
      <Pn x={12} y={26} w={148} h={118} t="closed box" tc={C.emerald} ok />
      <rect x={44} y={74} width={84} height={44} rx="5" fill="#596770" stroke={C.dim} />
      <rect x={40} y={66} width={92} height={12} rx="4" fill="#6d7d87" stroke={C.dim} />
      <Pn x={166} y={26} w={148} h={118} t="open tray" tc={C.ruby} ok={false} />
      <rect x={188} y={92} width={104} height={20} rx="4" fill="#d8d2c2" />
      {[206, 230, 256].map((x) => <CellTop key={x} cx={x} cy={96} r={9} />)}
      <Pn x={320} y={26} w={148} h={118} t="out of reach" />
      <T x={330} y={62} s={10.5} c={C.text}>away from children</T>
      <T x={330} y={76} s={10.5} c={C.text}>and pets</T>
      <T x={330} y={102} s={10} c={C.dim}>used cells: tape the</T>
      <T x={330} y={115} s={10} c={C.dim}>terminals or bag each</T>
      <T x={330} y={128} s={10} c={C.dim}>one; check local rules</T>
      <rect x={12} y={156} width={456} height={176} rx="8" fill="rgba(194,88,99,0.10)" stroke={C.ruby} strokeWidth="1.5" />
      <T x={24} y={180} s={12} c={C.ruby} w={700}>A swallowed cell is an emergency</T>
      <T x={24} y={198} s={10.5} c={C.text}>It can cause severe damage within 2 hours.</T>
      <Row x={30} y={224} n={1} t="Go to hospital at once" nc={C.ruby} />
      <Row x={30} y={248} n={2} t="Don’t induce vomiting" nc={C.ruby} />
      <Row x={30} y={272} n={3} t="Call the number shown" nc={C.ruby} />
      <T x={250} y={224} s={10} c={C.dim}>In the US:</T>
      <T x={250} y={240} s={10.5} c={C.text}>National Battery Ingestion Hotline</T>
      <T x={250} y={255} s={11} c={C.brassHi} mono>1-800-498-8666</T>
      <T x={250} y={274} s={10.5} c={C.text}>Poison Help</T>
      <T x={250} y={289} s={11} c={C.brassHi} mono>1-800-222-1222</T>
      <T x={24} y={312} s={10.5} c={C.text}>Elsewhere: call your local emergency number.</T>
      <T x={24} y={326} s={10} c={C.faint}>Treat any suspected swallow as an emergency.</T>
    </F>
  )
}

function QwSfFluids() {
  return (
    <F h={316} view="Sequence · used cleaners and lubricants" scale="schematic">
      <Pn x={12} y={26} w={180} h={160} t="never" tc={C.ruby} ok={false} />
      <path d="M40 90 L160 90 L150 130 L50 130 Z" fill="#596770" stroke={C.dim} />
      <circle cx={100} cy={112} r={5} fill={M.ink} />
      <T x={102} y={156} a="middle" s={10.5} c={C.text}>sink, drains or soil</T>
      <T x={102} y={172} a="middle" s={10} c={C.faint}>water-polluting substances</T>
      <Arrow a={[196, 106]} b={[226, 106]} c="brass" w={1.8} />
      <Pn x={232} y={26} w={236} h={160} t="instead" tc={C.emerald} ok />
      <rect x={256} y={66} width={60} height={86} rx="6" fill="rgba(170,210,225,0.18)" stroke={M.glass} />
      <rect x={262} y={58} width={48} height={10} rx="3" fill="#6d7d87" />
      <rect x={262} y={92} width={48} height={34} fill={M.paper} />
      <T x={286} y={106} a="middle" s={10} c="#3a342c" w={700}>USED</T>
      <T x={286} y={119} a="middle" s={10} c="#3a342c">fluid</T>
      <T x={330} y={84} s={10.5} c={C.text}>sealed and labelled</T>
      <Arrow a={[330, 112]} b={[360, 112]} c="emerald" w={1.6} />
      <T x={330} y={136} s={10.5} c={C.text}>hazardous-waste</T>
      <T x={330} y={150} s={10.5} c={C.text}>collection point</T>
      <T x={14} y={214} s={10.5} c={C.dim}>ETA’s service sheets require legal disposal. Rules differ by area,</T>
      <T x={14} y={228} s={10.5} c={C.dim}>so check yours.</T>
      <rect x={12} y={246} width={456} height={56} rx="8" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={268} s={10.5} c={C.text}>ETA also requires eye protection for all work on a movement:</T>
      <T x={24} y={284} s={10.5} c={C.brassHi}>make glasses a habit, not a decision.</T>
    </F>
  )
}

/* ================================================================== */
/* shop-radium · radium and vintage lume safety                         */
/* ================================================================== */

// Crossed-out icon disc
const NoMark = ({ x, y, r = 22, children, l }) => (
  <g>
    {children}
    <circle cx={x} cy={y} r={r} fill="none" stroke={C.ruby} strokeWidth="2" />
    <line x1={x - r * 0.7} y1={y - r * 0.7} x2={x + r * 0.7} y2={y + r * 0.7} stroke={C.ruby} strokeWidth="2" />
    {l && <T x={x} y={y + r + 16} a="middle" s={10.5} c={C.text}>{l}</T>}
  </g>
)

function QwRaWhich() {
  const sx = (yr) => 40 + (yr - 1910) * 3.6
  const Bar = ({ y, a, b, fade, c, l, sub }) => (
    <g>
      <defs>
        <linearGradient id={`qw-f-${y}`} x1="0" x2="1">
          <stop offset="0" stopColor={c} stopOpacity="0.85" />
          <stop offset={(b - a) / (fade - a)} stopColor={c} stopOpacity="0.85" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={sx(a)} y={y} width={sx(fade) - sx(a)} height={16} rx="3" fill={`url(#qw-f-${y})`} />
      <T x={sx(a) + 6} y={y + 12} s={10.5} c={M.ink} w={600}>{l}</T>
      {sub && <T x={sx(fade) + 6} y={y + 12} s={10} c={C.faint}>{sub}</T>}
    </g>
  )
  return (
    <F h={334} view="Timeline · roughly which lume, when" scale="dates approximate">
      <Bar y={44} a={1914} b={1960} fade={1980} c="#c9b45a" l="radium" sub="into the 1960s or 1970s" />
      <Bar y={70} a={1960} b={1990} fade={2000} c="#8fb2c9" l="tritium" sub="to the late 1990s" />
      <rect x={sx(1993)} y={96} width={sx(2020) - sx(1993)} height={16} rx="3" fill="rgba(123,165,131,0.85)" />
      <T x={sx(1993) + 6} y={108} s={10.5} c={M.ink} w={600}>Super-LumiNova</T>
      <T x={sx(1993) - 6} y={108} a="end" s={10} c={C.emerald}>not radioactive →</T>
      <line x1={sx(1910)} y1={124} x2={sx(2020)} y2={124} stroke={C.dim} />
      {[1910, 1930, 1950, 1970, 1990, 2010].map((yr) => (
        <g key={yr}>
          <line x1={sx(yr)} y1={124} x2={sx(yr)} y2={129} stroke={C.dim} />
          <T x={sx(yr)} y={141} a="middle" s={10} c={C.faint} mono>{yr}</T>
        </g>
      ))}
      <T x={sx(1914)} y={38} s={10} c={C.faint}>from about the First World War</T>
      <T x={14} y={162} s={10} c={C.faint}>Sources disagree by a decade or more, so treat old unmarked lume as possibly radium.</T>

      <Pn x={12} y={176} w={220} h={146} t="a “T” on the dial" />
      <circle cx={122} cy={272} r={44} fill="#e4dcc6" stroke={C.struct} />
      <T x={122} y={300} a="middle" s={10} c="#3a342c" w={700}>T SWISS T</T>
      <T x={122} y={256} a="middle" s={10} c="#3a342c">T&lt;25</T>
      <T x={24} y={208} s={10} c={C.text}>suggests tritium, but a T alone</T>
      <T x={24} y={220} s={10} c={C.ruby}>doesn’t prove it</T>
      <Pn x={248} y={176} w={220} h={146} t="dead lume is the trap" tc={C.ruby} />
      <line x1={270} y1={210} x2={270} y2={290} stroke={C.dim} />
      <line x1={270} y1={290} x2={456} y2={290} stroke={C.dim} />
      <path d="M272 212 C300 270 340 284 456 288" fill="none" stroke="#c9d79a" strokeWidth="2" />
      <line x1={272} y1={222} x2={456} y2={226} stroke={C.ruby} strokeWidth="2" />
      <T x={456} y={218} a="end" s={10} c={C.ruby}>radioactivity stays</T>
      <T x={300} y={272} s={10} c="#c9d79a">glow fades long before</T>
      <T x={456} y={306} a="end" s={10} c={C.faint}>time →</T>
      <T x={258} y={316} s={10} c={C.dim}>no glow does not mean no radium</T>
    </F>
  )
}

function QwRaRisk() {
  return (
    <F h={334} view="Section · outside the body and inside it" scale="schematic">
      <Pn x={12} y={26} w={220} h={196} t="outside: low risk" tc={C.emerald} />
      <rect x={30} y={150} width={180} height={10} fill="#2a2620" />
      {[60, 100, 140, 180].map((x) => <circle key={x} cx={x} cy={148} r={4} fill="#a69c76" />)}
      <rect x={26} y={112} width={188} height={8} rx="2" fill="url(#qw-acr)" stroke={M.glass} />
      <SL p={[36, 116]} x={30} y={96} text="crystal" a="start" s={10} />
      {[60, 140].map((x) => (
        <g key={x}>
          <Arrow a={[x, 142]} b={[x, 124]} c="emerald" w={1.6} />
        </g>
      ))}
      <T x={22} y={182} s={10} c={C.emerald}>alpha:</T>
      <T x={22} y={194} s={10} c={C.emerald}>stopped by</T>
      <T x={22} y={206} s={10} c={C.emerald}>glass or skin</T>
      <Arrow a={[180, 142]} b={[180, 54]} c="steel" w={1.4} dash="4 3" />
      <T x={172} y={64} a="end" s={10} c={C.steel}>some gamma passes:</T>
      <T x={172} y={76} a="end" s={10} c={C.steel}>what a Geiger counter hears</T>
      <T x={226} y={194} a="end" s={10} c={C.dim}>intact, in a closed case:</T>
      <T x={226} y={206} a="end" s={10} c={C.dim}>low risk to wear or handle</T>

      <Pn x={248} y={26} w={220} h={196} t="inside: the real danger" tc={C.ruby} />
      <path d="M300 200 L300 120 Q300 70 344 66 Q390 66 392 112 L400 126 L392 130 L392 156 Q392 170 370 172 L370 200" fill="none" stroke={C.dim} strokeWidth="2" />
      {[[420, 140], [430, 132], [438, 146], [446, 128]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.8" fill="#a69c76" />)}
      <Arrow a={[426, 140]} b={[400, 134]} c="ruby" w={1.4} />
      <T x={404} y={174} s={10} c={C.ruby}>dust, inhaled</T>
      <T x={404} y={186} s={10} c={C.ruby}>or swallowed</T>
      <T x={260} y={208} s={10} c={C.text}>it collects in bone and irradiates from inside</T>

      <rect x={12} y={236} width={456} height={86} rx="8" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <T x={24} y={258} s={11} c={C.text} w={600}>Radon gas, too</T>
      <T x={24} y={274} s={10.5} c={C.dim}>Old radium gives off radon. Never open a case in a sealed,</T>
      <T x={24} y={288} s={10.5} c={C.dim}>unventilated room with your face over it.</T>
      <path d="M400 300 q6 -10 0 -20 q-6 -10 0 -20 M420 300 q6 -10 0 -20 q-6 -10 0 -20" fill="none" stroke={C.faint} strokeWidth="1.4" />
      <Arrow a={[440, 270]} b={[460, 254]} c="steel" w={1.2} />
    </F>
  )
}

function QwRaDust() {
  const items = [
    ['dry-brush', (x, y) => <path d={`M${x - 10} ${y + 10} L${x + 10} ${y - 10} M${x + 6} ${y - 14} l8 8`} stroke={C.dim} strokeWidth="3" />],
    ['blow', (x, y) => <path d={`M${x - 12} ${y} q-4 -8 4 -12 l10 4 l0 12 Z`} fill="#c94a3c" />],
    ['scrape', (x, y) => <path d={`M${x - 12} ${y + 8} L${x + 12} ${y - 8}`} stroke={C.steel} strokeWidth="3" />],
    ['sand', (x, y) => <rect x={x - 12} y={y - 6} width={24} height={12} fill="#b48455" />],
    ['ultrasonic', (x, y) => <path d={`M${x - 12} ${y + 8} L${x - 12} ${y - 6} L${x + 12} ${y - 6} L${x + 12} ${y + 8} Z M${x - 8} ${y - 2} q4 -4 8 0 t8 0`} fill="none" stroke={C.steel} strokeWidth="1.6" />],
    ['pick at flakes', (x, y) => <path d={`M${x - 10} ${y + 10} L${x + 6} ${y - 6}`} stroke={C.steel} strokeWidth="2" />],
  ]
  return (
    <F h={330} view="Rule · never make dust" scale="schematic">
      <T x={240} y={42} a="middle" s={12} c={C.text} w={600}>The whole discipline in one rule: radium lume must not become airborne.</T>
      {items.map(([l, ic], i) => {
        const x = 50 + i * 76
        return (
          <NoMark key={l} x={x} y={88} l={l}>
            {ic(x, 88)}
          </NoMark>
        )
      })}
      <Pn x={12} y={140} w={220} h={110} t="already shed?" />
      <circle cx={70} cy={210} r={26} fill="#2a2620" stroke={C.struct} />
      {[[60, 214], [76, 220], [82, 204]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.8" fill="#a69c76" />)}
      <T x={108} y={196} s={10.5} c={C.text}>leave it undisturbed,</T>
      <T x={108} y={210} s={10.5} c={C.text}>and decide whether</T>
      <T x={108} y={224} s={10.5} c={C.brassHi}>it’s a specialist’s job</T>
      <Pn x={248} y={140} w={220} h={110} t="never, on a radium dial" tc={C.ruby} />
      <T x={258} y={174} s={10.5} c={C.text}>a dust blower</T>
      <T x={258} y={196} s={10.5} c={C.text}>a cleaning machine, for</T>
      <T x={258} y={210} s={10.5} c={C.text}>the dial or the hands</T>
      <T x={258} y={236} s={10} c={C.ruby}>both make the material airborne</T>
      <T x={14} y={276} s={10.5} c={C.dim}>Don’t pick at flaking material “to tidy it up”. Work in a contained</T>
      <T x={14} y={290} s={10.5} c={C.dim}>area (see Contain the work) and keep every flake where it is.</T>
    </F>
  )
}

function QwRaEat() {
  const ic = [
    ['eat', (x, y) => <path d={`M${x - 12} ${y + 4} Q${x} ${y - 14} ${x + 12} ${y + 4} Z`} fill="#b48455" />],
    ['drink', (x, y) => <path d={`M${x - 8} ${y - 10} L${x + 8} ${y - 10} L${x + 6} ${y + 10} L${x - 6} ${y + 10} Z`} fill="rgba(170,210,225,0.5)" stroke={M.glass} />],
    ['smoke or vape', (x, y) => <rect x={x - 14} y={y - 3} width={28} height={6} fill={M.white} />],
    ['touch your face', (x, y) => <G x={x} y={y + 10} ang={0}><Finger w={10} len={22} gloved /></G>],
  ]
  return (
    <F h={260} view="Habit · close the hand-to-mouth route" scale="schematic">
      <T x={14} y={42} s={11} c={C.text}>The realistic route into your body is hand-to-mouth. At the bench, don’t:</T>
      {ic.map(([l, f], i) => {
        const x = 70 + i * 112
        return (
          <NoMark key={l} x={x} y={92} r={26} l={l}>
            {f(x, 92)}
          </NoMark>
        )
      })}
      <Sep x1={12} y1={150} x2={468} y2={150} />
      <Tag x={14} y={172}>afterwards, even though you wore gloves</Tag>
      <path d="M60 230 Q80 196 110 230 Z" fill={M.skin} />
      <path d="M76 190 q4 -10 8 0 M92 186 q4 -10 8 0" fill="none" stroke={M.oil} strokeWidth="2" />
      <rect x={40} y={232} width={90} height={12} rx="4" fill="#9aa9b2" />
      <T x={150} y={210} s={11.5} c={C.emerald} w={600}>Wash your hands thoroughly</T>
      <T x={150} y={226} s={10.5} c={C.dim}>That single habit removes most of the risk.</T>
    </F>
  )
}

function QwRaStore() {
  return (
    <F h={330} view="Plan · storing and disposing of radium parts" scale="schematic">
      <Pn x={12} y={26} w={148} h={150} t="sealed" />
      <rect x={40} y={60} width={92} height={80} rx="4" fill="rgba(170,210,225,0.18)" stroke={M.glass} />
      <rect x={40} y={60} width={92} height={10} fill={C.ruby} />
      <circle cx={86} cy={108} r={20} fill="#2a2620" stroke={C.struct} />
      <Trefoil x={116} y={126} r={7} />
      <T x={22} y={162} s={10} c={C.dim}>a bag or small container</T>
      <Pn x={166} y={26} w={148} h={150} t="garage, workshop" tc={C.emerald} ok />
      <rect x={196} y={60} width={88} height={84} fill="#4b3a2b" stroke="#6f4a2b" />
      <line x1={196} y1={102} x2={284} y2={102} stroke="#6f4a2b" />
      <rect x={210} y={84} width={26} height={18} fill="rgba(170,210,225,0.3)" />
      <T x={176} y={162} s={10} c={C.dim}>a cupboard out of the way</T>
      <Pn x={320} y={26} w={148} h={150} t="bedside drawer" tc={C.ruby} ok={false} />
      <rect x={350} y={90} width={88} height={54} fill="#5e4027" />
      <rect x={350} y={72} width={88} height={18} fill="#6f4a2b" />
      <T x={330} y={162} s={10} c={C.dim}>not where you sleep</T>
      <Sep x1={12} y1={192} x2={468} y2={192} />
      <Row x={22} y={216} n={1} t="Ventilate before opening" sub="radon builds up in closed storage" />
      <Row x={22} y={256} n={2} t="Don’t casually bin it" sub="broken items: your state or local radiation programme" />
      <Pn x={292} y={202} w={176} h={118} t="a geiger counter" />
      <T x={302} y={234} s={10} c={C.text}>held to the closed watch,</T>
      <T x={302} y={247} s={10} c={C.text}>it can show it’s radioactive</T>
      <T x={302} y={270} s={10} c={C.ruby}>a quiet reading doesn’t</T>
      <T x={302} y={283} s={10} c={C.ruby}>prove the paint is safe</T>
      <T x={302} y={296} s={10} c={C.ruby}>to disturb</T>
      <T x={22} y={306} s={10} c={C.faint}>Check your local rules.</T>
    </F>
  )
}

function QwRaRelume() {
  return (
    <F h={316} view="Decision · relume and removal" scale="schematic">
      <Bx x={14} y={34} w={200} h={40} l={['Relume with radioactive', 'material?']} c={C.struct} />
      <Arrow a={[216, 54]} b={[256, 54]} c="ruby" w={1.6} />
      <Bx x={258} y={34} w={210} h={40} l={['Never', 'Super-LumiNova: brighter, safer, standard']} c={C.ruby} />
      <Bx x={14} y={100} w={200} h={40} l={['Remove the original', 'radium lume yourself?']} c={C.struct} />
      <Arrow a={[216, 120]} b={[256, 120]} c="ruby" w={1.6} />
      <Bx x={258} y={100} w={210} h={40} l={['No', 'leave it to a licensed specialist']} c={C.ruby} />
      <Pn x={12} y={160} w={456} h={88} t="what the agencies say" />
      <T x={24} y={194} s={10.5} c={C.text}>Health Physics Society: don’t open a radium watch or remove the paint.</T>
      <T x={24} y={212} s={10.5} c={C.text}>EPA: don’t take such items apart.</T>
      <T x={24} y={234} s={10} c={C.faint}>Removal is for a specialist licensed for it.</T>
      <rect x={12} y={262} width={456} height={44} rx="8" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <T x={24} y={281} s={10.5} c={C.text}>Removing original lume also destroys originality.</T>
      <T x={24} y={296} s={10} c={C.faint}>See Case refinishing &amp; dial ethics.</T>
    </F>
  )
}

function QwRaProportion() {
  return (
    <F h={300} view="Comparison · who was actually harmed" scale="schematic">
      <Pn x={12} y={26} w={220} h={190} t="people who wore them" tc={C.emerald} />
      {Array.from({ length: 18 }, (_, i) => (
        <g key={i}>
          <circle cx={36 + (i % 6) * 32} cy={70 + Math.floor(i / 6) * 34} r={6} fill={C.emerald} opacity="0.7" />
          <rect x={30 + (i % 6) * 32} y={78 + Math.floor(i / 6) * 34} width={12} height={12} rx="3" fill={C.emerald} opacity="0.5" />
        </g>
      ))}
      <T x={22} y={186} s={10.5} c={C.text}>millions, daily, for decades</T>
      <T x={22} y={202} s={10} c={C.faint}>intact dials behind glass</T>
      <Pn x={248} y={26} w={220} h={190} t="factory dial painters" tc={C.ruby} />
      <rect x={290} y={110} width={140} height={10} fill="url(#sk-wood)" />
      <circle cx={360} cy={70} r={12} fill="#6c5f53" />
      <path d="M360 82 L360 108" stroke="#6c5f53" strokeWidth="10" />
      <line x1={368} y1={92} x2={362} y2={78} stroke={C.brass} strokeWidth="1.6" />
      <T x={258} y={150} s={10.5} c={C.text}>ingested it in quantity,</T>
      <T x={258} y={164} s={10.5} c={C.text}>day after day</T>
      <T x={258} y={190} s={10} c={C.faint}>the people genuinely harmed</T>
      <rect x={12} y={230} width={456} height={60} rx="8" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={254} s={10.5} c={C.text}>With the precautions, the risk to you is very small.</T>
      <T x={24} y={272} s={10.5} c={C.brassHi}>But the precautions are not optional.</T>
    </F>
  )
}

/* ================================================================== */
/* shop-storage · organising parts and screws                           */
/* ================================================================== */

function QwStTray() {
  const parts = ['barrel bridge', 'train bridge', 'wheels', 'balance', 'dial side', 'keyless']
  return (
    <F h={270} view="Plan · the tray as a record of the strip" scale="schematic">
      <Tray
        x={30}
        y={52}
        cols={3}
        rows={2}
        cw={80}
        ch={56}
        items={parts.map((p, i) => (cx, cy) => (
          <g>
            <T x={cx} y={cy - 6} a="middle" s={13} c={C.ground} w={700}>{i + 1}</T>
            <T x={cx} y={cy + 12} a="middle" s={10} c="#3a342c">{p}</T>
          </g>
        ))}
      />
      <path d="M40 40 L260 40" stroke={C.brass} strokeWidth="1.6" fill="none" />
      <Arrow d="M260 40 L270 40" c="brass" w={1.6} />
      <T x={30} y={34} s={10} c={C.brassHi}>removal order: 1, 2, 3 … each in its own section</T>
      <Arrow d="M276 188 L30 188" c="emerald" w={1.6} />
      <T x={30} y={206} s={10} c={C.emerald}>reassembly runs backward through the tray</T>
      <Pn x={290} y={52} w={178} h={128} t="why it works" />
      <T x={300} y={84} s={10.5} c={C.text}>the last part out is</T>
      <T x={300} y={98} s={10.5} c={C.text}>the first part back,</T>
      <T x={300} y={112} s={10.5} c={C.text}>and it’s already</T>
      <T x={300} y={126} s={10.5} c={C.text}>at your fingertips</T>
      <T x={300} y={162} s={10} c={C.faint}>labels are an example strip</T>
      <T x={14} y={240} s={10.5} c={C.dim}>A movement has dozens of tiny near-identical parts. The tray’s order</T>
      <T x={14} y={254} s={10.5} c={C.dim}>is what lets you put them all back.</T>
    </F>
  )
}

function QwStCover() {
  return (
    <F h={316} view="Plan · screws stay with their bridge" scale="schematic">
      <Pn x={12} y={26} w={220} h={190} t="grouped and covered" tc={C.emerald} ok />
      <Tray
        x={34}
        y={60}
        cols={2}
        rows={1}
        cw={88}
        ch={80}
        lid
        items={[0, 1].map((k) => (cx, cy) => (
          <g>
            <path d={`M${cx - 28} ${cy - 14} L${cx + 28} ${cy - 20} L${cx + 26} ${cy} L${cx - 26} ${cy + 4} Z`} fill={M.plate} stroke={C.brass} />
            {[0, 1, k ? 2 : null].filter((v) => v !== null).map((j) => <Screw key={j} x={cx - 16 + j * 16} y={cy + 22} r={4.5} ang={j * 30} />)}
          </g>
        ))}
      />
      <T x={22} y={180} s={10} c={C.dim}>each screw group sits with</T>
      <T x={22} y={193} s={10} c={C.dim}>its bridge; a clear lid on top</T>
      <Pn x={248} y={26} w={220} h={190} t="open tray, one knock" tc={C.ruby} ok={false} />
      <rect x={290} y={110} width={140} height={40} rx="5" fill="#d8d2c2" stroke="#9c9484" transform="rotate(-8 360 130)" />
      {[[300, 80], [340, 70], [392, 86], [440, 120], [420, 170], [270, 160]].map(([x, y], i) => (
        <Screw key={i} x={x} y={y} r={4.5} ang={i * 50} />
      ))}
      <T x={258} y={196} s={10} c={C.ruby}>a sneeze or a knock scatters them</T>
      <T x={14} y={240} s={10.5} c={C.text}>Screws vary by fractions of a millimetre, so two that look alike</T>
      <T x={14} y={254} s={10.5} c={C.text}>may not be interchangeable.</T>
      {[5.6, 6.0].map((len, i) => (
        <g key={len}>
          <G x={40 + i * 50} y={270}><g transform="rotate(0)"><rect x={-5} y={0} width={10} height={4} fill="#c5ced4" /><rect x={-2.5} y={4} width={5} height={len * 4} fill="#aebac2" /></g></G>
        </g>
      ))}
      <T x={110} y={292} s={10} c={C.faint}>near-identical, not identical</T>
    </F>
  )
}

function QwStPhoto() {
  return (
    <F h={300} view="Sequence · a photo at every stage" scale="schematic">
      {/* phone over movement */}
      <rect x={60} y={40} width={64} height={110} rx="10" fill="#22262a" stroke={C.dim} />
      <rect x={66} y={50} width={52} height={86} rx="4" fill="#1b2a33" />
      <circle cx={92} cy={93} r={18} fill={M.plate} stroke={C.brass} />
      <path d="M70 160 L60 200 M114 160 L124 200" stroke={C.faint} strokeDasharray="3 3" />
      <circle cx={92} cy={214} r={30} fill={M.plate} stroke={C.brass} />
      <Wheel cx={84} cy={208} r={10} spokes={4} />
      <Screw x={104} y={222} r={4} />
      <T x={92} y={262} a="middle" s={10} c={C.dim}>before each part comes off</T>
      {['stage 1', 'stage 2', 'stage 3', 'stage 4'].map((l, i) => {
        const x = 180 + i * 72
        return (
          <g key={l}>
            <rect x={x} y={70} width={64} height={64} rx="4" fill="#1f1b17" stroke={C.dim} />
            <circle cx={x + 32} cy={102} r={22 - i * 3} fill={M.plate} stroke={C.brass} />
            {i < 3 && <Wheel cx={x + 28} cy={98} r={8} spokes={4} />}
            {i < 2 && <Screw x={x + 42} y={110} r={3.5} />}
            <T x={x + 32} y={150} a="middle" s={10} c={C.text}>{l}</T>
          </g>
        )
      })}
      <Arrow a={[180, 172]} b={[460, 172]} c="brass" w={1.4} />
      <T x={180} y={190} s={10} c={C.brassHi}>coming apart</T>
      <T x={180} y={226} s={10.5} c={C.text}>Where every part and every screw sat:</T>
      <T x={180} y={242} s={10.5} c={C.emerald}>your best reassembly reference.</T>
    </F>
  )
}

function QwStSort() {
  return (
    <F h={330} view="Detail · sorting screws that got mixed" scale="schematic, magnified">
      <Tag x={14} y={42}>1 · sort under a loupe by</Tag>
      {[
        ['length', { len: 12 }, { len: 16 }],
        ['thread', { len: 14, fine: true }, { len: 14 }],
        ['head', { len: 14, hd: 10 }, { len: 14, hd: 14 }],
      ].map(([l, a, b], i) => {
        const x = 40 + i * 100
        const S = ({ x: sx, len, fine, hd = 12 }) => (
          <g>
            <rect x={sx - hd / 2} y={60} width={hd} height={5} rx="1.5" fill="#c5ced4" stroke="#3e4a52" strokeWidth="0.6" />
            <rect x={sx - 3} y={65} width={6} height={len * 2.6} fill="#aebac2" stroke="#3e4a52" strokeWidth="0.5" />
            {Array.from({ length: Math.floor((len * 2.6) / (fine ? 2.5 : 4)) }, (_, j) => (
              <line key={j} x1={sx - 3} y1={67 + j * (fine ? 2.5 : 4)} x2={sx + 3} y2={68.5 + j * (fine ? 2.5 : 4)} stroke="#5e6c74" strokeWidth="0.6" />
            ))}
          </g>
        )
        return (
          <g key={l}>
            <S x={x} {...a} />
            <S x={x + 28} {...b} />
            <T x={x + 14} y={124} a="middle" s={10.5} c={C.text}>{l}</T>
          </g>
        )
      })}
      <T x={330} y={70} s={10} c={C.dim}>Compare each with</T>
      <T x={330} y={83} s={10} c={C.dim}>your photos.</T>
      <T x={330} y={106} s={10} c={C.ruby}>Don’t guess,</T>
      <T x={330} y={119} s={10} c={C.ruby}>don’t force.</T>
      <Sep x1={12} y1={140} x2={468} y2={140} />
      <Tag x={14} y={160}>2 · try it in its hole by hand</Tag>
      {[
        [true, 'turns easily, seats fully', 'right screw'],
        [false, 'stops early or feels tight', 'back it out at once'],
      ].map(([ok, a, b], i) => {
        const x = 20 + i * 150
        return (
          <g key={a}>
            <rect x={x} y={222} width={120} height={20} fill="url(#qw-plcut)" />
            <rect x={x + 54} y={222} width={12} height={20} fill={C.ground} />
            <ScrewSide x={x + 60} y={ok ? 212 : 196} k={1.4} />
            <Verdict x={x + 100} y={186} ok={ok} r={7} />
            <T x={x} y={262} s={10} c={C.text}>{a}</T>
            <T x={x} y={275} s={10} c={ok ? C.emerald : C.ruby}>{b}</T>
          </g>
        )
      })}
      <Pn x={320} y={150} w={148} h={172} t="3 · check from below" />
      <rect x={334} y={196} width={120} height={16} fill="url(#qw-plcut)" />
      <rect x={388} y={180} width={10} height={60} fill="#aebac2" />
      <rect x={382} y={176} width={22} height={6} fill="#c5ced4" />
      <Wheel cx={420} cy={250} r={18} spokes={4} />
      <circle cx={398} cy={238} r={6} fill="none" stroke={C.ruby} strokeWidth="1.5" />
      <T x={330} y={290} s={10} c={C.text}>a long screw mustn’t</T>
      <T x={330} y={303} s={10} c={C.ruby}>stick through and catch</T>
      <T x={330} y={316} s={10} c={C.ruby}>a wheel</T>
      <T x={14} y={312} s={10} c={C.faint}>Forcing a wrong screw is how threads get damaged.</T>
    </F>
  )
}

function QwStStore() {
  return (
    <F h={290} view="Plan · a job that spans days" scale="schematic">
      <rect x={20} y={150} width={260} height={10} fill="url(#sk-wood)" />
      <Tray x={50} y={92} cols={3} rows={1} cw={50} ch={50} lid items={[(cx, cy) => <Screw x={cx} y={cy} r={5} />, (cx, cy) => <Wheel cx={cx} cy={cy} r={12} spokes={4} />, null]} />
      <T x={130} y={180} a="middle" s={10.5} c={C.text}>covered, on a shelf nobody knocks</T>
      <T x={130} y={194} a="middle" s={10} c={C.faint}>dust-free and undisturbed</T>
      <rect x={300} y={60} width={160} height={110} rx="4" fill={M.paper} transform="rotate(3 380 115)" />
      <T x={314} y={86} s={11} c="#3a342c" w={700}>Stopped at:</T>
      <T x={314} y={104} s={10.5} c="#3a342c">train bridge off,</T>
      <T x={314} y={118} s={10.5} c="#3a342c">wheels in section 2</T>
      <T x={314} y={140} s={10} c="#5e5646">next: clean</T>
      <T x={300} y={196} s={10} c={C.faint}>an example note</T>
      <Sep x1={12} y1={216} x2={468} y2={216} />
      <T x={14} y={240} s={10.5} c={C.dim}>Tip: log part numbers and where you sourced them in the Practice</T>
      <T x={14} y={254} s={10.5} c={C.dim}>Log, so re-ordering later is trivial.</T>
    </F>
  )
}

function QwStOils() {
  const rows = [
    ['Moebius 9010', 6],
    ['Moebius 9020', 6],
    ['Moebius 9415', 6],
    ['Moebius 8200', 3],
    ['Moebius 8300', 3],
    ['Moebius 8217', 3],
  ]
  const sx = (y) => 130 + y * 42
  return (
    <F h={334} view="Chart · listed shelf lives" scale="years, treat as a maximum">
      {rows.map(([l, y], i) => (
        <g key={l}>
          <T x={120} y={50 + i * 24} a="end" s={10.5} c={C.text}>{l}</T>
          <rect x={sx(0)} y={40 + i * 24} width={sx(y) - sx(0)} height={14} rx="3" fill={y === 6 ? 'rgba(127,196,232,0.3)' : 'rgba(208,168,79,0.3)'} stroke={y === 6 ? M.oil : C.brass} />
          <T x={sx(y) + 6} y={51 + i * 24} s={10.5} c={C.dim} mono>{y} years</T>
        </g>
      ))}
      {[0, 1, 2, 3, 4, 5, 6].map((y) => (
        <line key={y} x1={sx(y)} y1={36} x2={sx(y)} y2={182} stroke={C.line} strokeDasharray="2 3" />
      ))}
      <Sep x1={12} y1={196} x2={468} y2={196} />
      <path d="M40 300 L40 236 L52 222 L72 222 L84 236 L84 300 Z" fill="rgba(127,196,232,0.2)" stroke={M.oil} />
      <rect x={50} y={212} width={24} height={12} rx="2" fill="#6d7d87" />
      <rect x={42} y={252} width={40} height={24} fill={M.paper} />
      <T x={62} y={268} a="middle" s={10} c="#3a342c" w={700}>date in</T>
      <T x={104} y={232} s={10.5} c={C.text} w={600}>Write the date on each bottle when it arrives</T>
      <T x={104} y={248} s={10.5} c={C.dim}>Lubricants age in the bottle. Past its date, replace it:</T>
      <T x={104} y={262} s={10.5} c={C.dim}>a fresh bottle costs far less than a second service.</T>
      <T x={104} y={286} s={10.5} c={C.text} w={600}>Keep lids on</T>
      <T x={104} y={302} s={10.5} c={C.dim}>ETA warns Fixodrop epilame is very volatile:</T>
      <T x={104} y={316} s={10.5} c={C.dim}>keep it airtight.</T>
    </F>
  )
}

/* ================================================================== */
/* shop-sourcing · sourcing parts and reading part numbers              */
/* ================================================================== */

function QwSoCalibre() {
  return (
    <F h={300} view="Comparison · the full designation" scale="schematic">
      <Tag x={14} y={42}>start from the calibre, always</Tag>
      {[
        ['ETA 2824', 'ETA 2824-2'],
        ['Seiko 7S26A', 'Seiko 7S26B'],
      ].map(([a, b], i) => {
        const y = 60 + i * 80
        return (
          <g key={a}>
            <rect x={20} y={y} width={170} height={50} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.struct} />
            <T x={105} y={y + 31} a="middle" s={14} c={C.text} w={700} mono>{a}</T>
            <T x={232} y={y + 32} a="middle" s={20} c={C.ruby} w={700}>≠</T>
            <rect x={274} y={y} width={190} height={50} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.struct} />
            <T x={369} y={y + 31} a="middle" s={14} c={C.text} w={700} mono>{b}</T>
          </g>
        )
      })}
      <T x={14} y={234} s={10.5} c={C.dim}>An ETA 2824-2 and a 2824 differ, and Seiko’s 7S26A, 7S26B and 7S26C</T>
      <T x={14} y={248} s={10.5} c={C.dim}>are not identical. Note the whole designation before you order.</T>
      <T x={14} y={274} s={10} c={C.faint}>Identify the movement first: Movement Guides and the calibre lessons.</T>
    </F>
  )
}

function QwSoSwiss() {
  return (
    <F h={300} view="Comparison · one number, one kind of part" scale="schematic">
      {['calibre A', 'calibre B', 'calibre C'].map((l, i) => {
        const x = 20 + i * 152
        return (
          <g key={l}>
            <Pn x={x - 8} y={26} w={144} h={150} t={l} />
            <circle cx={x + 64} cy={104} r={44 - i * 4} fill={M.plate} stroke={C.brass} />
            <rect x={x + 64} y={102} width={60 + i * 4} height={4} fill="url(#sk-steelH)" />
            <rect x={x + 64 + 58 + i * 4} y={98} width={8} height={12} rx="2" fill="#8c9aa3" />
            <T x={x + 64} y={168} a="middle" s={12} c={C.brassHi} w={700} mono>401</T>
          </g>
        )
      })}
      <T x={240} y={204} a="middle" s={12} c={C.text} w={600}>401 = the winding stem, whichever Swiss calibre</T>
      <T x={240} y={222} a="middle" s={10.5} c={C.dim}>The stems differ; the number names the kind of part.</T>
      <T x={14} y={254} s={10.5} c={C.dim}>Swiss makers share one part-numbering scheme across calibres. Once you</T>
      <T x={14} y={268} s={10.5} c={C.dim}>know a few numbers, ordering gets faster and far less error-prone.</T>
    </F>
  )
}

function QwSoJapan() {
  return (
    <F h={300} view="Diagram · a family that shares parts" scale="schematic">
      <circle cx={160} cy={130} r={70} fill="rgba(208,168,79,0.12)" stroke={C.brass} />
      <circle cx={240} cy={130} r={70} fill="rgba(134,167,189,0.12)" stroke={C.steel} />
      <circle cx={200} cy={190} r={70} fill="rgba(123,165,131,0.12)" stroke={C.emerald} />
      <T x={120} y={110} a="middle" s={13} c={C.brassHi} w={700} mono>NH35</T>
      <T x={280} y={110} a="middle" s={13} c={C.steel} w={700} mono>NH36</T>
      <T x={200} y={238} a="middle" s={13} c={C.emerald} w={700} mono>4R36</T>
      <T x={200} y={160} a="middle" s={10.5} c={C.text}>shared</T>
      <T x={200} y={174} a="middle" s={10.5} c={C.text}>parts</T>
      <T x={300} y={40} s={10.5} c={C.dim}>Seiko codes are tied to the</T>
      <T x={300} y={54} s={10.5} c={C.dim}>calibre: a 4R36 part is</T>
      <T x={300} y={68} s={10.5} c={C.dim}>listed under that calibre.</T>
      <T x={330} y={200} s={10.5} c={C.text}>The same physical part</T>
      <T x={330} y={214} s={10.5} c={C.text}>often serves the whole</T>
      <T x={330} y={228} s={10.5} c={C.text}>family.</T>
      <T x={14} y={286} s={10.5} c={C.brassHi}>Check compatibility lists before assuming a part is unique.</T>
    </F>
  )
}

function QwSoRoutes() {
  const r = [
    ['Genuine current', 'best, if available to you', C.emerald],
    ['Generic aftermarket', 'fine for many mechanical parts;', C.brassHi, 'variable for springs and jewels'],
    ['New old stock', 'original, but ageing gaskets', C.brassHi, 'and lubricants'],
    ['Donor movement', 'often cheapest, and the only option', C.steel, 'for obsolete calibres; a box of spares'],
  ]
  return (
    <F h={300} view="Comparison · four routes to a part" scale="schematic">
      {r.map(([a, b, c, d], i) => {
        const x = 12 + (i % 2) * 232
        const y = 26 + Math.floor(i / 2) * 104
        return (
          <g key={a}>
            <Pn x={x} y={y} w={224} h={96} />
            <Num x={x + 18} y={y + 20} n={i + 1} c={c} />
            <T x={x + 32} y={y + 24} s={12} c={c} w={600}>{a}</T>
            <T x={x + 14} y={y + 52} s={10.5} c={C.text}>{b}</T>
            {d && <T x={x + 14} y={y + 66} s={10.5} c={C.text}>{d}</T>}
          </g>
        )
      })}
      <rect x={12} y={238} width={456} height={52} rx="8" fill="rgba(134,167,189,0.08)" stroke={C.steel} />
      <T x={24} y={259} s={10.5} c={C.text}>Discontinued vintage calibre? A scrap donor of the same movement</T>
      <T x={24} y={274} s={10.5} c={C.text}>is usually cheaper than chasing the single part.</T>
    </F>
  )
}

function QwSoHouses() {
  const n = [
    [100, 80, 'material houses', 'parts, tools, consumables', C.brass],
    [380, 80, 'manufacturer', 'service centres', C.steel],
    [100, 200, 'specialist dealers', '', C.steel],
    [380, 200, 'secondhand market', 'for donors', C.emerald],
  ]
  return (
    <F h={300} view="Map · where parts come from" scale="schematic">
      {n.map(([x, y, a, , c]) => (
        <line key={a} x1={240} y1={140} x2={x} y2={y} stroke={c} strokeDasharray="4 3" />
      ))}
      <circle cx={240} cy={140} r={36} fill={C.ground} stroke={C.struct} />
      <T x={240} y={137} a="middle" s={11} c={C.text} w={600}>your</T>
      <T x={240} y={151} a="middle" s={11} c={C.text} w={600}>bench</T>
      {n.map(([x, y, a, b, c]) => (
        <Bx key={a} x={x - 80} y={y - 22} w={160} h={44} l={b ? [a, b] : [a]} c={c} f={C.ground} />
      ))}
      <T x={20} y={262} s={10.5} c={C.dim}>Cousins UK is the best-known material house in Britain, with equivalents</T>
      <T x={20} y={276} s={10.5} c={C.dim}>in the US and elsewhere. Some require a trade account; many do not.</T>
    </F>
  )
}

function QwSoAccess() {
  const tiers = [
    ['Seiko NH family', 'has been the easiest to supply', C.emerald],
    ['ETA 7750, 2836-2', 'tend to need donors or old stock', C.brassHi],
    ['Miyota 9075, ETA C07, most Chinese clones', 'usually a whole new movement', C.ruby],
  ]
  return (
    <F h={316} view="Guide · can you get the part?" scale="rough guide, not a stock list">
      {tiers.map(([a, b, c], i) => (
        <g key={a}>
          <rect x={14} y={30 + i * 50} width={14} height={40} rx="3" fill={c} opacity="0.7" />
          <T x={38} y={46 + i * 50} s={11.5} c={C.text} w={600}>{a}</T>
          <T x={38} y={62 + i * 50} s={10.5} c={c}>{b}</T>
        </g>
      ))}
      <Sep x1={12} y1={186} x2={468} y2={186} />
      <Tag x={14} y={206}>before the watch is in pieces</Tag>
      <Chain
        x={14}
        y={218}
        w={136}
        h={52}
        gap={18}
        items={[
          [['Search two', 'suppliers for', 'your calibre'], C.brass],
          [['Neither lists', 'the part?'], C.ruby],
          [['Plan a donor or', 'a movement swap', 'before you strip'], C.emerald],
        ]}
        s={10.5}
      />
      <T x={14} y={298} s={10} c={C.faint}>Not every part can be bought by a hobbyist.</T>
    </F>
  )
}

function QwSoSpare() {
  const items = [
    ['stem', (x, y) => <g><rect x={x - 26} y={y - 2} width={48} height={4} fill="url(#sk-steelH)" /><rect x={x + 20} y={y - 3} width={8} height={6} fill="#aebac2" /></g>],
    ['balance staff', (x, y) => <g><rect x={x - 2} y={y - 22} width={4} height={44} fill="url(#sk-steelH)" /><rect x={x - 6} y={y - 4} width={12} height={8} fill="#aebac2" /></g>],
    ['mainspring', (x, y) => <Spiral cx={x} cy={y} r0={4} r1={22} turns={5} />],
    ['crystal', (x, y) => <ellipse cx={x} cy={y} rx={26} ry={8} fill="url(#qw-acr)" stroke={M.glass} />],
  ]
  return (
    <F h={266} view="Plan · order two of the fragile things" scale="schematic">
      {items.map(([l, f], i) => {
        const x = 70 + i * 112
        return (
          <g key={l}>
            <Pn x={x - 52} y={26} w={104} h={130} />
            {f(x - 14, 80)}
            <g opacity="0.6">{f(x + 10, 98)}</g>
            <T x={x} y={140} a="middle" s={10.5} c={C.text}>{l}</T>
            <T x={x + 40} y={52} a="end" s={12} c={C.brassHi} w={700}>×2</T>
          </g>
        )
      })}
      <T x={14} y={186} s={10.5} c={C.text}>They all have a habit of needing a second attempt.</T>
      <rect x={12} y={204} width={456} height={50} rx="8" fill="rgba(208,168,79,0.07)" stroke={C.brass} />
      <T x={24} y={226} s={10.5} c={C.dim}>Shipping usually costs more than the part, so</T>
      <T x={24} y={242} s={10.5} c={C.brassHi}>order two the first time.</T>
    </F>
  )
}

function QwSoArrive() {
  return (
    <F h={330} view="Check · the part when it arrives" scale="schematic">
      <Ring x={110} y={108} r={74} />
      <rect x={50} y={88} width={110} height={5} fill="url(#sk-steelH)" />
      <rect x={156} y={85} width={10} height={11} fill="#aebac2" />
      <rect x={50} y={124} width={110} height={5} fill="url(#sk-steelH)" />
      <rect x={156} y={121} width={10} height={11} fill="#aebac2" />
      <T x={52} y={84} s={10} c={C.faint}>old</T>
      <T x={52} y={120} s={10} c={C.faint}>new</T>
      <T x={110} y={200} a="middle" s={10.5} c={C.text}>side by side, under a loupe</T>
      <Row x={210} y={50} n={1} t="Lay new beside old, compare" />
      <Row x={210} y={78} n={2} t="Measure what you can" sub="stems: by their thread, in millimetres" />
      <Row x={210} y={120} n={3} t="Keep the packaging" sub="until it’s fitted and working" />
      <Row x={210} y={162} n={4} t="Wrong? Stop and return it" sub="don’t try to make it fit" />
      <rect x={12} y={210} width={456} height={110} rx="8" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <T x={24} y={232} s={11} c={C.ruby} w={600}>Be wary of bargains</T>
      <rect x={30} y={248} width={130} height={56} rx="6" fill={M.plate} stroke={C.brass} />
      <T x={95} y={272} a="middle" s={11} c={C.brassHi} w={700} mono>ETA 2824-2</T>
      <T x={95} y={290} a="middle" s={10} c={C.dim}>engraved</T>
      <T x={180} y={262} s={10.5} c={C.text}>Some Sea-Gull ST2130 movements have turned</T>
      <T x={180} y={276} s={10.5} c={C.text}>up engraved as an ETA 2824-2, and not all</T>
      <T x={180} y={290} s={10.5} c={C.text}>their parts interchange.</T>
    </F>
  )
}

/* ================================================================== */
/* shop-take-in · keep the record, hand it back                         */
/* ================================================================== */

function QwTiRecord() {
  const f = ['Movement', 'Work done', 'Status and timing', 'Oils and fluids used', 'Parts fitted']
  return (
    <F h={316} view="Card · the job record" scale="schematic">
      <rect x={20} y={30} width={250} height={240} rx="6" fill={M.paper} />
      <rect x={20} y={30} width={250} height={32} rx="6" fill="#cfc6ab" />
      <T x={32} y={51} s={12} c="#2d2820" w={700} mono>PRACTICE LOG · JOB</T>
      {f.map((l, i) => (
        <g key={l}>
          <T x={32} y={86 + i * 38} s={10.5} c="#3a342c" w={600}>{l}</T>
          <line x1={32} y1={98 + i * 38} x2={258} y2={98 + i * 38} stroke="#b7ae9c" />
        </g>
      ))}
      <Pn x={290} y={30} w={178} h={150} t="old parts" />
      <path d="M330 80 L430 80 L424 150 L336 150 Z" fill="rgba(170,210,225,0.15)" stroke={M.glass} />
      <rect x={330} y={76} width={100} height={8} fill={C.ruby} />
      <Screw x={360} y={120} r={5} />
      <Wheel cx={396} cy={118} r={12} spokes={4} />
      <T x={300} y={170} s={10} c={C.dim}>bagged, handed back</T>
      <T x={290} y={204} s={10.5} c={C.text}>They prove what was done,</T>
      <T x={290} y={218} s={10.5} c={C.text}>and they belong to the owner.</T>
      <T x={20} y={292} s={10.5} c={C.brassHi}>Test: someone reading it in two years could tell what you did and why.</T>
      <T x={20} y={308} s={10} c={C.faint}>If the watch comes back, your notes are the first thing to read.</T>
    </F>
  )
}

function QwTiHandback() {
  const rows = [
    ['Runs', '✗ stopped', '✓ runs'],
    ['Sets and winds', '✓', '✓'],
    ['Date', '✗ stuck', '✓ changes'],
    ['Water resistance', 'not tested', 'not tested'],
  ]
  return (
    <F h={316} view="Table · before and after, side by side" scale="example entries">
      <Tag x={24} y={44}>function</Tag>
      <Tag x={200} y={44}>before</Tag>
      <Tag x={330} y={44}>after</Tag>
      {rows.map(([a, b, c], i) => {
        const y = 54 + i * 34
        const col = (t) => (t.startsWith('✓') ? C.emerald : t.startsWith('✗') ? C.ruby : C.faint)
        return (
          <g key={a}>
            <rect x={14} y={y} width={454} height={28} rx="4" fill="rgba(255,255,255,0.03)" stroke={C.line} />
            <T x={24} y={y + 18} s={10.5} c={C.text}>{a}</T>
            <T x={200} y={y + 18} s={10.5} c={col(b)}>{b}</T>
            <T x={330} y={y + 18} s={10.5} c={col(c)}>{c}</T>
          </g>
        )
      })}
      <Tag x={14} y={214}>go through it with the owner</Tag>
      <Row x={22} y={236} n={1} t="Show both lists, function by function" />
      <Row x={22} y={258} n={2} t="Say what you did, didn’t do, and didn’t test" />
      <Row x={22} y={280} n={3} t="Couldn’t fix something? Say so plainly and write it down" />
      <T x={22} y={306} s={10} c={C.faint}>Check: every item on your take-in sheet has been answered.</T>
    </F>
  )
}

export const FIGS = {
  'qw-ic-divide': QwIcDivide,
  'qw-stepper': QwStepper,
  'qw-train': QwTrain,
  'qw-accuracy': QwAccuracy,
  'qw-bat-open': QwBatOpen,
  'qw-bat-beside': QwBatBeside,
  'qw-bat-lift': QwBatLift,
  'qw-bat-fit': QwBatFit,
  'qw-bat-test': QwBatTest,
  'qw-bat-minute': QwBatMinute,
  'qw-bat-seal': QwBatSeal,
  'qw-dx-cell': QwDxCell,
  'qw-dx-crown': QwDxCrown,
  'qw-dx-seconds': QwDxSeconds,
  'qw-dx-stutter': QwDxStutter,
  'qw-dx-contacts': QwDxContacts,
  'qw-dx-reset': QwDxReset,
  'qw-dx-decide': QwDxDecide,
  'qw-dx-early': QwDxEarly,
  'qw-mt-volt': QwMtVolt,
  'qw-mt-coil': QwMtCoil,
  'qw-mt-current': QwMtCurrent,
  'qw-mt-verdict': QwMtVerdict,
  'qw-mt-bother': QwMtBother,
  'qw-cor-remove': QwCorRemove,
  'qw-cor-assess': QwCorAssess,
  'qw-cor-clean': QwCorClean,
  'qw-cor-neg': QwCorNeg,
  'qw-cor-test': QwCorTest,
  'qw-cor-prove': QwCorProve,
  'qw-mod-match': QwModMatch,
  'qw-mod-hands': QwModHands,
  'qw-mod-dial': QwModDial,
  'qw-mod-date': QwModDate,
  'qw-mod-recase': QwModRecase,
  'qw-mod-ring': QwModRing,
  'qw-qs-hands': QwQsHands,
  'qw-qz-stop': QwQzStop,
  'qw-id-mark': QwIdMark,
  'qw-id-style': QwIdStyle,
  'qw-id-spec': QwIdSpec,
  'qw-id-number': QwIdNumber,
  'qw-sol-mistake': QwSolMistake,
  'qw-sol-symptoms': QwSolSymptoms,
  'qw-sol-replace': QwSolReplace,
  'qw-sol-reset': QwSolReset,
  'qw-sol-care': QwSolCare,
  'qw-sol-dispose': QwSolDispose,
  'qw-qc-other': QwQcOther,
  'qw-ss-surface': QwSsSurface,
  'qw-ss-height': QwSsHeight,
  'qw-ss-clean': QwSsClean,
  'qw-ss-forget': QwSsForget,
  'qw-ss-test': QwSsTest,
  'qw-sh-fingers': QwShFingers,
  'qw-sh-tweezers': QwShTweezers,
  'qw-sh-material': QwShMaterial,
  'qw-sh-driver': QwShDriver,
  'qw-sh-tray': QwShTray,
  'qw-sh-clean': QwShClean,
  'qw-sh-magnet': QwShMagnet,
  'qw-sf-spring': QwSfSpring,
  'qw-sf-eyes': QwSfEyes,
  'qw-sf-chem': QwSfChem,
  'qw-sf-cuts': QwSfCuts,
  'qw-sf-lume': QwSfLume,
  'qw-sf-cells': QwSfCells,
  'qw-sf-fluids': QwSfFluids,
  'qw-ra-which': QwRaWhich,
  'qw-ra-risk': QwRaRisk,
  'qw-ra-dust': QwRaDust,
  'qw-ra-eat': QwRaEat,
  'qw-ra-store': QwRaStore,
  'qw-ra-relume': QwRaRelume,
  'qw-ra-proportion': QwRaProportion,
  'qw-st-tray': QwStTray,
  'qw-st-cover': QwStCover,
  'qw-st-photo': QwStPhoto,
  'qw-st-sort': QwStSort,
  'qw-st-store': QwStStore,
  'qw-st-oils': QwStOils,
  'qw-so-calibre': QwSoCalibre,
  'qw-so-swiss': QwSoSwiss,
  'qw-so-japan': QwSoJapan,
  'qw-so-routes': QwSoRoutes,
  'qw-so-houses': QwSoHouses,
  'qw-so-access': QwSoAccess,
  'qw-so-spare': QwSoSpare,
  'qw-so-arrive': QwSoArrive,
  'qw-ti-record': QwTiRecord,
  'qw-ti-handback': QwTiHandback,
}
