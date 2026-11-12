// Diagrams for the "Your First Project" track: a strap change, a battery,
// opening and identifying a movement, a module swap with hands, a first full
// service on the 6497, and what to do next. These are the beginner's first
// drawings in the app, so each one names its parts in plain words.
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

function FDefs() {
  const hatch = (id, bg, fg) => (
    <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="6" fill={bg} />
      <line x1="0" y1="0" x2="0" y2="6" stroke={fg} strokeWidth="1.1" />
    </pattern>
  )
  return (
    <defs>
      {hatch('fp-cut', '#6f808b', '#a3b3bd')}
      {hatch('fp-mov', '#433c31', '#5e5546')}
      {hatch('fp-bcut', '#7f6a33', '#c6a65c')}
      <pattern id="fp-knurl" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#a7b6bf" />
        <line x1="2" y1="0" x2="2" y2="4" stroke="#55646e" strokeWidth="1" />
      </pattern>
      <pattern id="fp-carpet" width="6" height="8" patternUnits="userSpaceOnUse">
        <rect width="6" height="8" fill="#5a3b3b" />
        <path d="M1 8 L1.6 1 M3.5 8 L3 0.5 M5.2 8 L5.6 2" stroke="#7b5151" strokeWidth="1.1" />
      </pattern>
      <linearGradient id="fp-acr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(190,225,235,0.55)" />
        <stop offset="1" stopColor="rgba(120,170,190,0.28)" />
      </linearGradient>
      <radialGradient id="fp-cell" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#eef3f6" />
        <stop offset="0.6" stopColor="#aebcc5" />
        <stop offset="1" stopColor="#66767f" />
      </radialGradient>
      <radialGradient id="fp-gold" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#f6dc98" />
        <stop offset="0.6" stopColor="#cfa24a" />
        <stop offset="1" stopColor="#7d5f22" />
      </radialGradient>
      <radialGradient id="fp-lamp" cx="0.5" cy="0" r="1">
        <stop offset="0" stopColor="rgba(250,226,150,0.32)" />
        <stop offset="1" stopColor="rgba(250,226,150,0.02)" />
      </radialGradient>
    </defs>
  )
}

const F = ({ children, ...p }) => (
  <Fig {...p}>
    <FDefs />
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
  const caseFill = gold ? 'url(#fp-gold)' : 'url(#sk-steel)'
  return (
    <g>
      {strap && [-1, 1].map((d) => <rect key={d} x={cx - r * 0.5} y={d < 0 ? cy - r - strap : cy + r * 0.7} width={r} height={strap + r * 0.3} rx="3" fill={strap > 0 ? 'url(#sk-top)' : 'none'} />)}
      {lugs && [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => (
        <rect key={i} x={cx + a * r * 0.58 - r * 0.1} y={cy + b * r * 0.92 - (b < 0 ? r * 0.2 : 0)} width={r * 0.2} height={r * 0.28} rx="2.5" fill={gold ? '#b08a3c' : '#8c9aa3'} />
      ))}
      {crown && <rect x={cx + r - 1} y={cy - r * 0.13} width={r * 0.2} height={r * 0.26} rx="2" fill={gold ? '#c9a24c' : 'url(#fp-knurl)'} stroke="#55646e" strokeWidth="0.5" />}
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
      {cell && <circle cx={c(26, 26)[0]} cy={c(26, 26)[1]} r={31 * u} fill="url(#fp-cell)" stroke="#4e5f6a" />}
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
      <rect x="-6" y={-len} width="12" height={Math.max(0, len - 30)} rx="2" fill="url(#fp-knurl)" stroke="#55646e" strokeWidth="0.6" />
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
      <rect x="-5.5" y={-len} width="11" height={Math.max(0, len - 34)} rx="3" fill="url(#fp-knurl)" stroke={M.steelD} strokeWidth="0.6" />
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
      <rect x="-6" y={-len} width="12" height={Math.max(0, len - 22)} rx="2" fill="url(#fp-knurl)" stroke={M.steelD} strokeWidth="0.6" />
    </g>
  )
}

/* ================================================================== */
/* fp-start · the bench and a strap                                     */
/* ================================================================== */

function FpPick() {
  // photo frame
  const Photo = ({ x, n, label, children }) => (
    <g>
      <rect x={x} y={200} width={142} height={78} rx="4" fill="#1f1b17" stroke={C.dim} strokeWidth="1" />
      <rect x={x + 4} y={204} width={134} height={70} rx="2" fill="#2b2620" />
      {children}
      <Num x={x + 14} y={214} n={n} r={7} />
      <T x={x + 71} y={292} a="middle" s={10.5} c={C.text}>
        {label}
      </T>
    </g>
  )
  return (
    <F h={302} view="Comparison · choosing the first watch" scale="schematic">
      <Pn x={12} y={26} w={222} h={140} t="Learn on this" tc={C.emerald} c={C.emerald} ok />
      <Face cx={74} cy={104} r={34} strap={20} h={305} m={60} s={200} />
      <Note x={124} y={70} lines={['cheap', 'working', 'plain quartz', 'on a strap']} c={C.text} s={11.5} lh={17} />
      <T x={124} y={150} s={10} c={C.faint}>a mark costs nothing</T>

      <Pn x={246} y={26} w={222} h={140} t="Not this one" tc={C.ruby} c={C.ruby} ok={false} />
      <Face cx={308} cy={104} r={34} strap={20} h={300} m={50} gold dial="#efe6cf" />
      <Note x={358} y={70} lines={['valuable', 'sentimental', 'someone else’s']} c={C.text} s={11.5} lh={17} />
      <T x={358} y={150} s={10} c={C.faint}>a mark here is for ever</T>

      <Tag x={12} y={190}>Before you touch it: three photos, good light</Tag>
      <Photo x={12} n={1} label="the case">
        <rect x={34} y={226} width={98} height={26} rx="9" fill="url(#sk-steel)" />
        <rect x={42} y={220} width={82} height={7} rx="3" fill="url(#fp-acr)" stroke={M.glass} strokeWidth="0.6" />
        <rect x={132} y={234} width={8} height={10} rx="2" fill="url(#fp-knurl)" />
        <line x1={58} y1={240} x2={70} y2={236} stroke="#f4f4f4" strokeWidth="1.2" />
        <Lab p={[64, 238]} x={88} y={268} text="old scratch, on record" s={10} />
      </Photo>
      <Photo x={169} n={2} label="the lugs">
        {[200, 270].map((lx) => (
          <g key={lx}>
            <rect x={lx} y={214} width={22} height={50} rx="4" fill="url(#sk-steel)" />
            <circle cx={lx + 11} cy={246} r={3.4} fill={M.ink} />
          </g>
        ))}
        <rect x={222} y={232} width={48} height={42} fill="url(#sk-top)" />
      </Photo>
      <Photo x={326} n={3} label="the crystal">
        <circle cx={397} cy={239} r={30} fill="url(#sk-steel)" />
        <circle cx={397} cy={239} r={24} fill="url(#fp-acr)" stroke={M.glass} />
        <path d="M381 228 Q389 220 400 219" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.7" strokeLinecap="round" />
      </Photo>
    </F>
  )
}

function FpBench() {
  return (
    <F h={300} view="Side view · a safe place to work" scale="schematic">
      {/* lamp */}
      <path d="M232 46 L198 118 L278 118 Z" fill="url(#fp-lamp)" />
      <path d="M304 168 L304 156 M304 156 L286 70 L240 48" stroke={C.struct} strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x={292} y={160} width={26} height={8} rx="2" fill={C.struct} />
      <path d="M226 40 L254 52 L244 62 L216 50 Z" fill={C.struct} />
      <circle cx={286} cy={70} r={3.5} fill={C.dim} />
      {/* bench */}
      <rect x={24} y={168} width={300} height={10} fill="url(#sk-wood)" />
      <rect x={34} y={178} width={9} height={92} fill="#5e4027" />
      <rect x={306} y={178} width={9} height={92} fill="#5e4027" />
      {/* tray */}
      <path d="M150 168 L150 146 L156 146 L156 162 L274 162 L274 146 L280 146 L280 168 Z" fill={M.tray} stroke="#a89c82" />
      {/* watch in tray */}
      <rect x={200} y={152} width={40} height={10} rx="4" fill="url(#sk-steel)" />
      <rect x={206} y={148} width={28} height={5} rx="2" fill="url(#fp-acr)" />
      {/* a spring flying, caught by the rim */}
      <Arrow d="M214 146 Q236 118 262 150" c="emerald" w={1.6} />
      <path d="M262 156 l3 -2 l2 3 l3 -2 l2 3" stroke={C.text} strokeWidth="1" fill="none" />
      {/* floor */}
      <line x1={14} y1={270} x2={330} y2={270} stroke={C.struct} strokeWidth="2" />
      <rect x={14} y={270} width={316} height={12} fill="url(#sk-hatch)" />

      <Lab p={[232, 54]} x={140} y={40} text="good light on the work" up />
      <Lab p={[156, 152]} x={90} y={120} text="light-coloured tray or mat" sub="parts show up and stay in" up />
      <T x={170} y={204} a="middle" s={10.5} c={C.dim}>the raised rim catches a spring</T>
      <T x={170} y={262} a="middle" s={10.5} c={C.dim}>hard floor under the bench</T>

      {/* floor comparison */}
      <Pn x={340} y={26} w={128} h={118} t="Hard floor" tc={C.emerald} c={C.emerald} ok />
      <rect x={352} y={100} width={104} height={14} fill="#6b6257" />
      <g transform="translate(404 96)">
        <rect x={-5} y={-2} width={10} height={4} rx="1" fill="#c5ced4" />
        <rect x={-2} y={2} width={4} height={2} fill="#c5ced4" />
      </g>
      <Lab p={[404, 96]} x={404} y={64} text="a dropped screw" sub="" up />
      <T x={404} y={134} a="middle" s={10.5} c={C.dim}>sits where you can see it</T>

      <Pn x={340} y={154} w={128} h={132} t="Carpet" tc={C.ruby} c={C.ruby} ok={false} />
      <rect x={352} y={214} width={104} height={30} fill="url(#fp-carpet)" />
      <g transform="translate(404 232)" opacity="0.55">
        <rect x={-5} y={-2} width={10} height={4} rx="1" fill="#c5ced4" />
      </g>
      <rect x={352} y={226} width={104} height={18} fill="url(#fp-carpet)" opacity="0.75" />
      <Lab p={[404, 228]} x={404} y={196} text="lost in the pile" up />
      <T x={404} y={262} a="middle" s={10.5} c={C.dim}>springs and screws</T>
      <T x={404} y={276} a="middle" s={10.5} c={C.dim}>vanish into it</T>

      <T x={14} y={292} s={10} c={C.faint}>Full setup: Workshop › Set up your workspace</T>
    </F>
  )
}

function FpStrap() {
  const cy = 130
  return (
    <F h={330} view="Section · lug, spring bar and tool" scale="schematic, magnified">
      {/* lug, cut through, with its blind hole */}
      <rect x={20} y={96} width={60} height={94} fill="url(#fp-cut)" stroke="#4e5f6a" />
      <rect x={50} y={cy - 8} width={30} height={16} fill={M.ink} />
      <rect x={54} y={cy - 5} width={38} height={10} rx="3" fill="none" stroke={C.steel} strokeDasharray="3 2" />
      <T x={50} y={88} a="middle" s={10.5} c={C.dim}>lug</T>
      {/* tube, cut open to show the spring */}
      <rect x={112} y={cy - 14} width={318} height={28} rx="3" fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={112} y={cy - 9} width={318} height={18} fill="#2f3438" />
      <path d="M430 108 L436 118 L426 128 L436 138 L430 152" fill="none" stroke={C.faint} strokeWidth="1" />
      <rect x={86} y={cy - 5} width={64} height={10} rx="3" fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.6" />
      <rect x={146} y={cy - 8} width={8} height={16} fill="url(#sk-steelH)" />
      <polyline points={Array.from({ length: 17 }, (_, i) => `${156 + i * 9},${i % 2 ? cy - 7 : cy + 7}`).join(' ')} fill="none" stroke={C.text} strokeWidth="1.3" />
      <rect x={104} y={cy - 18} width={9} height={36} rx="2" fill="url(#sk-steel)" stroke={M.steelD} />
      {/* strap loop round the bar, cut */}
      <rect x={128} y={88} width={302} height={22} fill="url(#sk-topS)" />
      <rect x={128} y={150} width={302} height={22} fill="url(#sk-linS)" />
      {/* the tool: fork astride the pin, against the shoulder */}
      <G x={98} y={cy + 2} ang={187}>
        <SBTool len={100} />
      </G>
      <Arrow a={[126, 186]} b={[184, 186]} c="brass" w={2.4} />
      <T x={192} y={190} s={11.5} c={C.brassHi}>push the shoulder toward the centre</T>

      <line x1={95} y1={cy - 5} x2={95} y2={52} stroke={C.struct} strokeWidth="0.8" />
      <circle cx={95} cy={cy - 5} r="2.2" fill={C.text} />
      <T x={95} y={46} a="middle" s={10.5} c={C.text}>pin, now clear of the hole</T>
      <Lab p={[108, cy - 18]} x={140} y={74} text="shoulder" a="start" up />
      <Lab p={[240, cy]} x={250} y={74} text="spring inside" up />
      <Lab p={[340, 98]} x={340} y={74} text="strap end" up />
      <Lab p={[410, cy + 10]} x={420} y={74} text="tube" up />
      <Lab p={[64, cy + 4]} x={40} y={214} text="lug hole" />
      <Lab p={[88, 196]} x={130} y={214} text="spring-bar tool, fork end" a="start" />

      <Sep x1={12} y1={232} x2={468} y2={232} />
      {[
        [1, ['Slip the fork in', 'between strap and lug']],
        [2, ['Press the shoulder in', 'till the pin leaves', 'the lug hole']],
        [3, ['Tilt the strap end', 'out of the lugs']],
      ].map(([n, l], i) => (
        <g key={n}>
          <Num x={24 + i * 154} y={254} n={n} r={8} />
          <Note x={38 + i * 154} y={250} lines={l} c={C.text} s={10.5} lh={13} />
        </g>
      ))}
      <T x={14} y={306} s={10.5} c={C.dim}>Fit: seat one pin, compress the other, slide it across till it snaps into its hole.</T>
      <T x={14} y={322} s={10} c={C.faint}>Full lesson: Basics › Change a watch strap</T>
    </F>
  )
}

function FpStrapCheck() {
  // lug side, seen close: lug with hole, optional fresh mark
  const LugClose = ({ cx, cy, mark }) => (
    <g>
      <path d={`M${cx - 40} ${cy - 30} L${cx + 26} ${cy - 30} Q${cx + 40} ${cy - 30} ${cx + 40} ${cy - 16} L${cx + 40} ${cy + 30} L${cx - 40} ${cy + 30} Z`} fill="url(#sk-steel)" />
      <circle cx={cx + 8} cy={cy + 2} r={7} fill={M.ink} />
      {mark && <path d={`M${cx - 10} ${cy + 14} L${cx + 6} ${cy - 10}`} stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />}
    </g>
  )
  return (
    <F h={318} view="Inspection · the first bench check" scale="schematic">
      <Pn x={12} y={26} w={148} h={216} t="Tug each lug" />
      <rect x={70} y={52} width={32} height={46} rx="3" fill="url(#sk-top)" />
      <rect x={70} y={170} width={32} height={46} rx="3" fill="url(#sk-top)" />
      <Face cx={86} cy={134} r={34} h={300} m={60} />
      <Arrow a={[86, 84]} b={[86, 56]} c="brass" w={2.4} />
      <Arrow a={[86, 184]} b={[86, 212]} c="brass" w={2.4} />
      <T x={86} y={234} a="middle" s={10.5} c={C.text}>firmly, both ends</T>

      <Pn x={170} y={26} w={298} h={162} t="Loupe on the lug, against your photo" />
      <Ring x={236} y={104} r={50} c={C.struct} />
      <LugClose cx={236} cy={104} />
      <T x={236} y={170} a="middle" s={10.5} c={C.dim}>your before photo</T>
      <Ring x={386} y={104} r={50} />
      <LugClose cx={386} cy={104} mark />
      <T x={386} y={168} a="middle" s={10.5} c={C.ruby}>now: a fresh bright line</T>
      <T x={386} y={181} a="middle" s={10.5} c={C.ruby}>beside the hole</T>
      <Verdict x={446} y={140} ok={false} r={8} />
      <Verdict x={290} y={140} ok r={8} />

      <Pn x={170} y={196} w={298} h={92} t="Keep the fork square to the bar" />
      <rect x={186} y={250} width={84} height={10} rx="3" fill="url(#sk-steel)" />
      <G x={200} y={255}>
        <SBTool len={32} />
      </G>
      <Verdict x={290} y={255} ok r={8} />
      <rect x={330} y={250} width={84} height={10} rx="3" fill="url(#sk-steel)" />
      <G x={344} y={255} ang={-40}>
        <SBTool len={32} />
      </G>
      <Arrow a={[344, 264]} b={[332, 280]} c="ruby" w={1.6} />
      <T x={352} y={280} s={10.5} c={C.ruby}>it slips and marks</T>
      <Verdict x={446} y={255} ok={false} r={8} />

      <Note x={12} y={262} lines={['Mark found? Slow down', 'and repeat the swap', 'till it leaves none.']} c={C.dim} s={10.5} lh={13} />
      <T x={240} y={310} a="middle" s={11.5} c={C.text} w={600}>Pass this check before you open a case.</T>
    </F>
  )
}

function FpLoupe() {
  // rows: magnification, distance mm. 3.2 px per mm, true proportion between rows.
  const k = 3.2
  const lens = 86
  const rows = [
    ['10×', 25, 66],
    ['5×', 50, 136],
    ['3.3×', 75, 206],
  ]
  const Eye = ({ y }) => (
    <g>
      <path d={`M${lens - 34} ${y} Q${lens - 24} ${y - 13} ${lens - 14} ${y} Q${lens - 24} ${y + 13} ${lens - 34} ${y} Z`} fill="#e6dccb" stroke={C.struct} />
      <circle cx={lens - 19} cy={y} r={4.6} fill="#3b5a6b" />
    </g>
  )
  return (
    <F h={316} view="Chart · loupe working distance" scale="distances to scale, 3.2 px = 1 mm">
      <T x={240} y={38} a="middle" s={11.5} c={C.text}>The stronger the loupe, the closer the work must be.</T>
      {rows.map(([mag, d, y]) => {
        const px = lens + d * k
        const hgt = 14 + d * 0.08
        return (
          <g key={mag}>
            <T x={14} y={y + 5} s={13} w={700} c={C.brassHi}>
              {mag}
            </T>
            <Eye y={y} />
            {/* loupe barrel, side view */}
            <path d={`M${lens - 8} ${y - 15} L${lens + 2} ${y - 11} L${lens + 2} ${y + 11} L${lens - 8} ${y + 15} Z`} fill="#2d2a27" stroke={C.struct} />
            <ellipse cx={lens + 2} cy={y} rx={2.6} ry={11} fill="url(#fp-acr)" stroke={M.glass} />
            {/* rays to the focus */}
            <path d={`M${lens + 3} ${y - 10} L${px} ${y} L${lens + 3} ${y + 10}`} fill="rgba(169,208,222,0.07)" stroke={M.glass} strokeWidth="0.7" strokeDasharray="3 2" />
            {/* the part: a caseback edge with print */}
            <rect x={px} y={y - hgt} width={7} height={hgt * 2} rx="1.5" fill="url(#sk-steelH)" />
            <Dim a={[lens + 2, y + 18]} b={[px, y + 18]} off={0} text={`about ${d} mm`} flip />
          </g>
        )
      })}
      <Sep x1={340} y1={50} x2={340} y2={244} />
      <Tag x={352} y={60}>Find focus</Tag>
      <Num x={360} y={82} n={1} r={8} />
      <Note x={374} y={78} lines={['Loupe close to', 'the eye']} c={C.text} s={10.5} lh={13} />
      <Num x={360} y={122} n={2} r={8} />
      <Note x={374} y={118} lines={['Both eyes open']} c={C.text} s={10.5} lh={13} />
      <Num x={360} y={150} n={3} r={8} />
      <Note x={374} y={146} lines={['Bring the watch', 'up till it snaps', 'sharp']} c={C.text} s={10.5} lh={13} />
      <Num x={360} y={204} n={4} r={8} />
      <Note x={374} y={200} lines={['Read the smallest', 'caseback print']} c={C.text} s={10.5} lh={13} />

      <rect x={12} y={256} width={456} height={48} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={275} s={11} c={C.text}>Blurred? Move the watch in or out, not the loupe.</T>
      <T x={24} y={292} s={11} c={C.text}>Shaking? Rest your wrists on the bench.</T>
      <T x={456} y={292} a="end" s={10} c={C.faint}>BHI list: three eyeglasses</T>
    </F>
  )
}

function FpLook() {
  const [t1, t2] = [pol(236, 124, 88, -150), pol(236, 124, 88, 160)]
  return (
    <F h={300} view="Detail · training the eye" scale="schematic">
      <Face cx={70} cy={130} r={50} h={300} m={52} s={130} />
      <circle cx={92} cy={92} r={12} fill="none" stroke={C.brass} strokeWidth="1.4" />
      <line x1={102} y1={85} x2={t1[0]} y2={t1[1]} stroke={C.brass} strokeWidth="0.8" opacity="0.7" />
      <line x1={102} y1={99} x2={t2[0]} y2={t2[1]} stroke={C.brass} strokeWidth="0.8" opacity="0.7" />
      <Ring x={236} y={124} r={88} />
      {/* magnified dial: minute track, an index, the minute-hand tip, a fibre, dust */}
      <path d="M160 92 Q236 60 314 94" fill="none" stroke={C.dim} strokeWidth="1.4" />
      {Array.from({ length: 9 }, (_, i) => {
        const x = 168 + i * 17.5
        const y = 86 - Math.sin(((x - 160) / 154) * Math.PI) * 14
        return <line key={i} x1={x} y1={y} x2={x} y2={y + (i === 4 ? 16 : 8)} stroke={C.text} strokeWidth={i === 4 ? 2.4 : 1.4} />
      })}
      <rect x={228} y={98} width={20} height={58} rx="2" fill="#e8e1d1" />
      <path d="M230 100 L246 100" stroke="#b9b09c" strokeWidth="1" />
      <path d="M176 200 L210 112 L218 115 L184 203 Z" fill={C.brassHi} stroke={M.brassD} />
      <path d="M262 176 q8 -6 14 2 t16 -2" fill="none" stroke="#c9bfae" strokeWidth="1" />
      {[[286, 140], [294, 158], [272, 150], [258, 196]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.6} fill="#cfc6b2" />
      ))}
      <Lab p={[300, 92]} x={344} y={56} text="minute-track print" a="start" up />
      <Lab p={[248, 126]} x={344} y={110} text="index: crisp edges?" a="start" />
      <Lab p={[294, 158]} x={344} y={154} text="dust you can’t see" a="start" sub="with the bare eye" />
      <Lab p={[290, 174]} x={344} y={198} text="a fibre" a="start" />
      <Lab p={[212, 114]} x={130} y={32} text="hand tip: straight, clean?" up />

      <Note x={14} y={250} lines={['Study a dial or movement', 'up close. Training your', 'eye is half of watchmaking.']} c={C.dim} s={10.5} lh={14} />
      <rect x={236} y={236} width={232} height={56} rx="6" fill="#2a2520" stroke={C.brass} strokeOpacity="0.6" />
      <T x={246} y={254} s={10.5} c={C.brassHi} w={600}>Practice Log · watch 1</T>
      <T x={246} y={270} s={10.5} c={C.text}>strap change · checked with a loupe</T>
      <T x={246} y={285} s={10.5} c={C.dim}>next: Project 1, a quartz battery</T>
    </F>
  )
}

/* ================================================================== */
/* fp-battery · Project 1, a quartz battery                             */
/* ================================================================== */

function FpReadSeconds() {
  const x0 = 140
  const k = 21 // px per second
  const rows = [
    { y: 82, a: 'Steady', b: '1 step a second', ev: [0, 1, 2, 3, 4, 5, 6, 7, 8], c: C.emerald, v: ['Running normally.', 'Fine to work on.'] },
    { y: 146, a: '4 steps', b: 'every 4 seconds', ev: [0, 4, 8], n: '4 steps', c: C.brass, v: ['Low-battery warning', 'on many Swiss calibres:', 'change the cell.'] },
    { y: 210, a: '1 move', b: 'every 2 seconds', ev: [0, 2, 4, 6, 8], c: C.ruby, v: ['Usually low charge on a', 'solar or Kinetic watch.', 'Stop: pick another.'] },
  ]
  return (
    <F h={316} view="Chart · reading the seconds hand" scale="time to scale">
      <T x={14} y={42} s={11} c={C.text}>Watch the seconds hand for a full minute and write down what it does.</T>
      {rows.map((r) => (
        <g key={r.a}>
          <T x={14} y={r.y - 2} s={11.5} c={C.text} w={600}>{r.a}</T>
          <T x={14} y={r.y + 12} s={10.5} c={C.dim}>{r.b}</T>
          <line x1={x0} y1={r.y + 6} x2={x0 + 8 * k + 8} y2={r.y + 6} stroke={C.struct} strokeWidth="1" />
          {Array.from({ length: 9 }, (_, i) => (
            <line key={i} x1={x0 + i * k} y1={r.y + 2} x2={x0 + i * k} y2={r.y + 10} stroke={C.faint} strokeWidth="0.8" />
          ))}
          {r.ev.map((t) => (
            <g key={t}>
              <circle cx={x0 + t * k} cy={r.y + 6} r={4.5} fill={r.c} />
              {r.n && <T x={x0 + t * k} y={r.y - 6} a="middle" s={10} c={r.c}>{r.n}</T>}
            </g>
          ))}
          <Note x={348} y={r.y - 4} lines={r.v} c={r.c === C.emerald ? C.text : r.c} s={10.5} lh={13} />
        </g>
      ))}
      {[0, 4, 8].map((t) => (
        <T key={t} x={x0 + t * k} y={238} a="middle" s={10} c={C.faint} mono>{t} s</T>
      ))}
      <T x={x0 + 4 * k} y={58} a="middle" s={10} c={C.faint}>● = the hand moves</T>
      <rect x={12} y={252} width={456} height={52} rx="6" fill="rgba(194,88,99,0.10)" stroke={C.ruby} />
      <T x={24} y={272} s={11.5} c={C.ruby} w={600}>Never fit an ordinary cell in place of a rechargeable one.</T>
      <T x={24} y={290} s={10.5} c={C.dim}>Citizen warns that it can overcharge and damage the watch.</T>
    </F>
  )
}

function FpBatteryFlow() {
  const cx = 130
  return (
    <F h={312} view="Exploded section · battery change, dial down" scale="schematic">
      <line x1={cx} y1={60} x2={cx} y2={290} stroke={C.faint} strokeDasharray="6 3 1 3" strokeWidth="0.8" />
      {/* caseback */}
      <path d={`M${cx - 92} 50 L${cx + 92} 50 L${cx + 92} 62 L${cx + 80} 62 L${cx + 80} 72 L${cx + 72} 72 L${cx + 72} 62 L${cx - 72} 62 L${cx - 72} 72 L${cx - 80} 72 L${cx - 80} 62 L${cx - 92} 62 Z`} fill="url(#fp-cut)" stroke="#4e5f6a" />
      <T x={cx} y={42} a="middle" s={10.5} c={C.dim}>caseback, lifted off</T>
      {/* gasket */}
      <ellipse cx={cx} cy={94} rx={78} ry={7} fill="none" stroke={M.gasket} strokeWidth="4" />
      <ellipse cx={cx} cy={94} rx={78} ry={7} fill="none" stroke={M.grease} strokeWidth="1" strokeDasharray="2 3" />
      {/* the new cell, held by its edge */}
      <rect x={cx - 26} y={186} width={52} height={11} rx="3" fill="url(#sk-steelH)" stroke={M.steelD} />
      <T x={cx} y={195} a="middle" s={10} c="#2b343a" w={700}>+</T>
      <G x={cx} y={190}>
        <Tweezers c={M.plastic} gap={22} tip={28} len={70} w={4} />
      </G>
      {/* case, dial down, with the module */}
      <rect x={cx - 98} y={226} width={24} height={44} fill="url(#fp-cut)" stroke="#4e5f6a" />
      <rect x={cx + 74} y={226} width={24} height={44} fill="url(#fp-cut)" stroke="#4e5f6a" />
      <rect x={cx - 74} y={232} width={148} height={26} fill="url(#fp-mov)" stroke={C.struct} />
      <rect x={cx - 28} y={226} width={56} height={12} fill="none" stroke={C.steel} strokeDasharray="3 2" />
      <rect x={cx - 74} y={258} width={148} height={4} fill={M.dial} />
      <rect x={cx - 74} y={266} width={148} height={7} fill="url(#fp-acr)" stroke={M.glass} />
      <Arrow a={[cx + 44, 222]} b={[cx + 44, 204]} c="steel" w={1.4} />
      <Lab p={[cx - 60, 245]} x={cx - 60} y={296} text="module" />
      <Lab p={[cx + 40, 270]} x={cx + 50} y={296} text="crystal, face down" />

      {/* callouts */}
      <Num x={292} y={92} n={1} r={8} />
      <T x={306} y={89} s={11.5} c={C.text} w={600}>Correct cell</T>
      <T x={306} y={103} s={10.5} c={C.dim}>match the code on the old one</T>
      <line x1={cx + 30} y1={191} x2={284} y2={98} stroke={C.struct} strokeWidth="0.8" />
      <Num x={292} y={150} n={2} r={8} />
      <T x={306} y={147} s={11.5} c={C.text} w={600}>No fingerprints</T>
      <T x={306} y={161} s={10.5} c={C.dim}>plastic tweezers, cell by its edge;</T>
      <T x={306} y={174} s={10.5} c={C.dim}>steel ones can short it</T>
      <line x1={cx + 30} y1={160} x2={284} y2={152} stroke={C.struct} strokeWidth="0.8" />
      <Num x={292} y={214} n={3} r={8} />
      <T x={306} y={211} s={11.5} c={C.text} w={600}>Fresh seal</T>
      <T x={306} y={225} s={10.5} c={C.dim}>gasket clean and lightly greased</T>
      <line x1={cx + 78} y1={96} x2={284} y2={208} stroke={C.struct} strokeWidth="0.8" />
      <T x={292} y={290} s={10} c={C.faint}>Quartz › Change a quartz battery</T>
    </F>
  )
}

function FpCellTest() {
  const cx = 104
  const cy = 150
  const r = 66
  const list = [
    ['Crown pushed fully in', ''],
    ['Cell the right way up', ''],
    ['Clamp pressing firmly', ''],
    ['Hands not touching', 'each other or the dial'],
    ['Try a second new cell', 'bad new cells are reported'],
  ]
  return (
    <F h={316} view="Test · before the back goes on" scale="schematic">
      <circle cx={cx} cy={cy} r={r} fill={M.dialDark} stroke={C.struct} />
      {Array.from({ length: 60 }, (_, i) => {
        const [a, b] = clk(cx, cy, r - 4, i * 6)
        const [c2, d2] = clk(cx, cy, r - (i % 5 ? 9 : 14), i * 6)
        return <line key={i} x1={a} y1={b} x2={c2} y2={d2} stroke={i % 5 ? C.faint : C.dim} strokeWidth={i % 5 ? 0.8 : 1.6} />
      })}
      {[0, 6, 12].map((d, i) => {
        const [x, y] = clk(cx, cy, r - 20, d)
        return <line key={d} x1={cx} y1={cy} x2={x} y2={y} stroke={C.ruby} strokeWidth="1.2" opacity={i === 2 ? 1 : 0.3} />
      })}
      <circle cx={cx} cy={cy} r={3} fill={C.ruby} />
      <Turn cx={cx} cy={cy} r={r + 10} from={20} to={340} />
      <T x={cx} y={58} a="middle" s={11.5} c={C.brassHi} w={600}>at least 2 full turns</T>
      <T x={cx} y={244} a="middle" s={10.5} c={C.text}>one step a second, evenly</T>
      <Note x={14} y={266} lines={['Many movements check the cell', 'only about once a minute: give', 'it that long to settle.']} c={C.dim} s={10.5} lh={14} />

      <Tag x={222} y={44}>Still stutters? Work down the list</Tag>
      {list.map(([a, b], i) => (
        <g key={a}>
          <Num x={232} y={66 + i * 34} n={i + 1} r={8} />
          <T x={246} y={70 + i * 34 - (b ? 4 : 0)} s={11} c={C.text}>{a}</T>
          {b && <T x={246} y={79 + i * 34} s={10} c={C.faint}>{b}</T>}
        </g>
      ))}
      <Arrow a={[232, 222]} b={[232, 238]} c="brass" w={1.6} />
      <Bx x={222} y={240} w={246} h={26} l={['Only then suspect the movement']} c={C.brass} s={11} />
      <T x={222} y={290} s={10} c={C.faint}>A multimeter shows a flat cell, but Witschi</T>
      <T x={222} y={303} s={10} c={C.faint}>warns against trusting it to judge condition.</T>
    </F>
  )
}

function FpOldCell() {
  return (
    <F h={316} view="Sequence · the old cell, straight away" scale="schematic">
      <Pn x={12} y={26} w={146} h={140} t="1 · Cover it" />
      <rect x={52} y={66} width={66} height={14} rx="4" fill="url(#sk-steelH)" stroke={M.steelD} />
      <path d="M44 62 L126 62 L126 84 L44 84 Z" fill={M.tape} opacity="0.45" stroke={M.tape} />
      <T x={85} y={104} a="middle" s={10.5} c={C.text}>tape over</T>
      <T x={85} y={117} a="middle" s={10.5} c={C.text}>both terminals</T>
      <T x={85} y={136} a="middle" s={10} c={C.faint}>or bag it on its own</T>
      <rect x={64} y={142} width={42} height={18} rx="3" fill="none" stroke={C.dim} strokeDasharray="2 2" />
      <rect x={76} y={148} width={18} height={6} rx="2" fill="url(#sk-steelH)" />

      <Pn x={167} y={26} w={146} h={140} t="2 · Out of reach" />
      <line x1={196} y1={86} x2={284} y2={86} stroke={C.struct} strokeWidth="3" />
      <rect x={226} y={62} width={28} height={24} rx="3" fill="rgba(255,255,255,0.05)" stroke={C.dim} />
      <rect x={232} y={74} width={16} height={6} rx="2" fill="url(#sk-steelH)" />
      <Dim a={[290, 86]} b={[290, 150]} off={0} />
      <T x={240} y={112} a="middle" s={10.5} c={C.text}>away from</T>
      <T x={240} y={126} a="middle" s={10.5} c={C.text}>children and pets</T>
      <T x={240} y={150} a="middle" s={10} c={C.faint}>not on the bench</T>

      <Pn x={322} y={26} w={146} h={140} t="3 · Hand it in" />
      <rect x={340} y={60} width={44} height={52} rx="3" fill="rgba(123,165,131,0.12)" stroke={C.emerald} />
      <rect x={350} y={66} width={24} height={4} rx="2" fill={C.emerald} />
      <Verdict x={362} y={92} ok r={8} />
      <path d="M408 66 L448 66 L444 112 L412 112 Z" fill="rgba(194,88,99,0.10)" stroke={C.ruby} />
      <line x1={404} y1={64} x2={452} y2={64} stroke={C.ruby} strokeWidth="2" />
      <Verdict x={428} y={92} ok={false} r={8} />
      <T x={362} y={128} a="middle" s={10} c={C.text}>collection</T>
      <T x={362} y={140} a="middle" s={10} c={C.text}>point</T>
      <T x={428} y={128} a="middle" s={10} c={C.text}>household</T>
      <T x={428} y={140} a="middle" s={10} c={C.text}>bin</T>
      <T x={395} y={158} a="middle" s={10} c={C.faint}>check your local rules</T>

      <rect x={12} y={180} width={456} height={124} rx="8" fill="rgba(194,88,99,0.10)" stroke={C.ruby} />
      <T x={26} y={202} s={12} c={C.ruby} w={700}>If a button cell may have been swallowed</T>
      <line x1={40} y1={232} x2={250} y2={232} stroke={C.ruby} strokeWidth="2" />
      <circle cx={40} cy={232} r={4} fill={C.ruby} />
      <path d="M250 222 L250 242" stroke={C.ruby} strokeWidth="2" />
      <T x={40} y={252} a="middle" s={10.5} c={C.text}>swallowed</T>
      <T x={250} y={252} a="middle" s={10.5} c={C.text}>within 2 hours:</T>
      <T x={250} y={265} a="middle" s={10.5} c={C.text}>severe damage possible</T>
      <Note x={340} y={226} lines={['It is an emergency.', 'Get medical help', 'at once.']} c={C.text} s={10.5} lh={13} />
      <T x={26} y={292} s={11} c={C.text} w={600}>Don’t try to make the person sick.</T>
    </F>
  )
}

function FpQuartzChain() {
  const chain = [
    ['Cell', 'the power'],
    ['Quartz crystal', 'a steady beat'],
    ['IC', 'counts it, sends pulses'],
    ['Coil', 'turns a pulse into magnetism'],
    ['Stepper rotor', 'a magnet: one step a pulse'],
    ['Gear train', 'carries the step to the hands'],
    ['Hands', 'one step a second'],
  ]
  return (
    <F h={316} view="Plan and flow · what the cell powers" scale="schematic, not one calibre">
      <QMod cx={120} cy={160} r={80} />
      <Lab p={[90, 114]} x={52} y={46} text="coil" up />
      <Lab p={[131, 126]} x={160} y={46} text="stepper rotor" up />
      <Lab p={[58, 166]} x={34} y={272} text="quartz crystal" a="start" />
      <Lab p={[96, 160]} x={104} y={290} text="IC" a="start" />
      <Lab p={[170, 200]} x={190} y={272} text="cell" a="start" />
      <Lab p={[212, 160]} x={222} y={120} text="stem" up />
      {chain.map(([a, b], i) => {
        const y = 36 + i * 38
        return (
          <g key={a}>
            <rect x={262} y={y} width={206} height={30} rx="5" fill="rgba(255,255,255,0.03)" stroke={i === 0 ? C.steel : C.struct} />
            <T x={272} y={y + 13} s={11} c={C.text} w={600}>{a}</T>
            <T x={272} y={y + 25} s={10} c={C.dim}>{b}</T>
            {i < chain.length - 1 && <Arrow a={[452, y + 30]} b={[452, y + 38]} c="brass" w={1.4} />}
          </g>
        )
      })}
      <T x={14} y={308} s={10} c={C.faint}>Quartz › Inside a quartz movement</T>
    </F>
  )
}

function FpReseal() {
  // one sealing joint across the case, in section
  const Joint = ({ x, tilt, ok }) => {
    const y = 96
    return (
      <g>
        <rect x={x + 14} y={y} width={180} height={34} fill="url(#fp-cut)" stroke="#4e5f6a" />
        {[x + 34, x + 174].map((gx) => <rect key={gx} x={gx - 8} y={y + 22} width={16} height={12} fill={C.ground} />)}
        <g transform={`rotate(${tilt} ${x + 34} ${y + 40})`}>
          <rect x={x + 14} y={y + 38} width={180} height={18} fill="url(#fp-cut)" stroke="#4e5f6a" />
        </g>
        {ok ? (
          [x + 34, x + 174].map((gx) => (
            <g key={gx}>
              <ellipse cx={gx} cy={y + 32} rx={8} ry={6} fill={M.gasket} stroke={M.grease} strokeWidth="1.2" />
            </g>
          ))
        ) : (
          <g>
            <ellipse cx={x + 34} cy={y + 33} rx={9} ry={5} fill={M.gasket} />
            <ellipse cx={x + 186} cy={y + 46} rx={7} ry={5} fill={M.gasket} />
          </g>
        )}
        {ok ? (
          [x + 60, x + 150].map((ax) => <Arrow key={ax} a={[ax, y + 86]} b={[ax, y + 62]} c="brass" w={2} />)
        ) : (
          <Arrow a={[x + 50, y + 86]} b={[x + 50, y + 62]} c="ruby" w={2} />
        )}
      </g>
    )
  }
  return (
    <F h={300} view="Section · the caseback seal" scale="schematic, gap exaggerated">
      <Pn x={12} y={26} w={222} h={178} t="Seated squarely" tc={C.emerald} c={C.emerald} ok />
      <Joint x={12} tilt={0} ok />
      <T x={123} y={90} a="middle" s={10.5} c={C.dim}>case</T>
      <T x={123} y={194} a="middle" s={10.5} c={C.text}>even squeeze all round</T>
      <Pn x={246} y={26} w={222} h={178} t="Pressed on one side" tc={C.ruby} c={C.ruby} ok={false} />
      <Joint x={246} tilt={4} />
      <T x={357} y={90} a="middle" s={10.5} c={C.dim}>case</T>
      <Lab p={[432, 142]} x={357} y={194} text="gasket rolled out: a leak path" c={C.ruby} />
      <Lab p={[46, 128]} x={70} y={62} text="gasket, greased" a="start" up />

      <T x={14} y={228} s={11.5} c={C.text} w={600}>Opening the case broke its water resistance.</T>
      <T x={14} y={246} s={10.5} c={C.dim}>Grease the gasket and seat the back squarely. It isn’t water resistant</T>
      <T x={14} y={260} s={10.5} c={C.dim}>again until it has been re-sealed and tested: close every case as if it will get wet.</T>
      <T x={14} y={286} s={10} c={C.faint}>Won’t start? Work “Quartz: testing the electronics” before assuming the worst.</T>
    </F>
  )
}

function FpNextDay() {
  const rows = [
    ['Stopped', ['Open it and recheck the clamp and the cell.'], C.ruby],
    ['Runs open, stops closed', ['Something is touching. Lay it dial down and', 'see whether a hand is catching the crystal.'], C.ruby],
    ['Back won’t close', ['“Open the caseback” has a recovery step.'], C.brass],
    ['Passed', ['Log the cell code, the date and the result.'], C.emerald],
  ]
  return (
    <F h={316} view="Test · a day later" scale="schematic">
      <rect x={18} y={48} width={84} height={34} rx="5" fill="#1d2a24" stroke={C.steel} />
      <T x={60} y={71} a="middle" s={14} mono c="#b7c9b5">10:10:00</T>
      <T x={60} y={98} a="middle" s={10} c={C.dim}>accurate clock</T>
      <Face cx={150} cy={66} r={24} h={305} m={60} s={0} />
      <T x={150} y={106} a="middle" s={10.5} c={C.text}>Day 0: set it</T>
      <Arrow a={[188, 66]} b={[300, 66]} c="brass" w={2} />
      <T x={244} y={58} a="middle" s={11} c={C.brassHi} mono>24 h</T>
      <Face cx={338} cy={66} r={24} h={305} m={60} s={6} />
      <T x={338} y={106} a="middle" s={10.5} c={C.text}>Day 1: still ticking?</T>
      <Note x={376} y={54} lines={['drift about', '1 s or less']} c={C.emerald} s={10.5} lh={13} />
      <T x={14} y={132} s={10.5} c={C.dim}>Why so little: many quartz movements are rated at around ±15 to ±20 seconds a month.</T>

      {rows.map(([a, l, c], i) => {
        const y = 152 + i * 38
        return (
          <g key={a}>
            <rect x={12} y={y} width={456} height={32} rx="5" fill="rgba(255,255,255,0.025)" stroke={C.line} />
            <rect x={12} y={y} width={4} height={32} fill={c} />
            <T x={24} y={y + 20} s={11} c={C.text} w={600}>{a}</T>
            {l.map((t, j) => (
              <T key={j} x={182} y={y + (l.length > 1 ? 14 + j * 13 : 20)} s={10.5} c={C.dim}>{t}</T>
            ))}
          </g>
        )
      })}
    </F>
  )
}

/* ================================================================== */
/* fp-inspect · Project 2, open, inspect and identify                    */
/* ================================================================== */

function FpPretest() {
  const y = 104
  const Box = ({ x, yy }) => <rect x={x} y={yy - 9} width={11} height={11} rx="2" fill="none" stroke={C.dim} />
  return (
    <F h={318} view="Test · before you open it" scale="crown positions: typical date automatic">
      <Pn x={12} y={26} w={196} h={196} t="What the crown does" />
      <rect x={30} y={y - 30} width={70} height={60} fill="url(#fp-mov)" stroke={C.struct} />
      <rect x={100} y={y - 34} width={14} height={68} fill="url(#fp-cut)" stroke="#4e5f6a" />
      <rect x={60} y={y - 2.5} width={100} height={5} fill="url(#sk-steel)" />
      {[0, 1].map((p) => (
        <rect key={p} x={118 + p * 13} y={y - 13} width={16} height={26} rx="3" fill="none" stroke={C.faint} strokeDasharray="2 2" />
      ))}
      <rect x={144} y={y - 13} width={16} height={26} rx="3" fill="url(#fp-knurl)" stroke={M.steelD} />
      {[0, 1, 2].map((p) => (
        <T key={p} x={126 + p * 13} y={y - 20} a="middle" s={11} c={C.brassHi} w={700}>{p}</T>
      ))}
      <Arrow a={[166, y]} b={[190, y]} c="brass" w={1.6} />
      <T x={65} y={y + 46} a="middle" s={10} c={C.faint}>movement</T>
      <T x={107} y={y + 46} a="middle" s={10} c={C.faint}>case</T>
      <Note x={22} y={y + 72} lines={['0  pushed in: wind', '1  change the date', '2  set the hands; seconds stop?']} c={C.text} s={10.5} lh={14} />

      <Pn x={218} y={26} w={250} h={196} t="Write it down" />
      <T x={380} y={58} a="middle" s={10} c={C.faint}>before</T>
      <T x={432} y={58} a="middle" s={10} c={C.faint}>after</T>
      {['Winds by hand', 'Sets the hands', 'Changes the date', 'Seconds stop, crown out', 'Runs, and how'].map((r, i) => (
        <g key={r}>
          <T x={230} y={84 + i * 26} s={11} c={C.text}>{r}</T>
          <Box x={375} yy={84 + i * 26} />
          <Box x={427} yy={84 + i * 26} />
          <line x1={228} y1={92 + i * 26} x2={458} y2={92 + i * 26} stroke={C.line} strokeWidth="0.6" />
        </g>
      ))}
      <T x={230} y={214} s={10} c={C.faint}>“after” is filled in when you close it</T>

      <T x={14} y={244} s={11} c={C.text}>Use a cheap hand-wound or automatic: a quartz module hides most parts.</T>
      <T x={14} y={262} s={10.5} c={C.dim}>Faults on the list were there before you. Anything new, you caused.</T>
      <rect x={12} y={274} width={456} height={36} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={22} y={289} s={10.5} c={C.dim}>Seconds that keep running aren’t always a fault: the Seiko 7S26 and</T>
      <T x={22} y={303} s={10.5} c={C.dim}>Miyota 8215 don’t hack, by design, and the 7S26 doesn’t hand-wind either.</T>
    </F>
  )
}

function FpRemove() {
  return (
    <F h={322} view="Section · which way it comes out" scale="schematic">
      <Pn x={12} y={26} w={222} h={192} t="Back-loader · most watches" />
      {/* dial down, back removed: movement leaves through the back */}
      <rect x={40} y={150} width={22} height={46} fill="url(#fp-cut)" stroke="#4e5f6a" />
      <rect x={184} y={150} width={22} height={46} fill="url(#fp-cut)" stroke="#4e5f6a" />
      <rect x={62} y={190} width={122} height={7} fill="url(#fp-acr)" stroke={M.glass} />
      <rect x={66} y={86} width={114} height={26} fill="url(#fp-mov)" stroke={C.struct} />
      <rect x={66} y={112} width={114} height={4} fill={M.dial} />
      <rect x={66} y={152} width={114} height={30} fill="none" stroke={C.faint} strokeDasharray="3 2" />
      <Arrow a={[123, 146]} b={[123, 122]} c="brass" w={2.2} />
      <T x={123} y={72} a="middle" s={10.5} c={C.text}>out through the back</T>
      <T x={123} y={212} a="middle" s={10} c={C.faint}>case dial down, back off, crystal below</T>

      <Pn x={246} y={26} w={222} h={192} t="Front-loader · one-piece case" />
      {/* dial up, case has no removable back */}
      <path d="M274 130 L296 130 L296 186 L418 186 L418 130 L440 130 L440 200 L274 200 Z" fill="url(#fp-cut)" stroke="#4e5f6a" />
      <rect x={300} y={92} width={114} height={4} fill={M.dial} />
      <rect x={300} y={96} width={114} height={26} fill="url(#fp-mov)" stroke={C.struct} />
      <rect x={300} y={150} width={114} height={30} fill="none" stroke={C.faint} strokeDasharray="3 2" />
      <Arrow a={[357, 146]} b={[357, 128]} c="brass" w={2.2} />
      <T x={357} y={56} a="middle" s={10.5} c={C.text}>bezel and crystal off first,</T>
      <T x={357} y={70} a="middle" s={10.5} c={C.text}>then out from the dial side</T>
      <T x={357} y={212} a="middle" s={10} c={C.faint}>dial up, the back is part of the case</T>

      {[
        ['Release the stem', 'and withdraw it'],
        ['Out the way it', 'went in'],
        ['Into a holder,', 'by the edge only'],
      ].map(([a, b], i) => (
        <g key={a}>
          <Num x={24 + i * 156} y={244} n={i + 1} r={8} />
          <T x={38 + i * 156} y={241} s={11} c={C.text}>{a}</T>
          <T x={38 + i * 156} y={255} s={11} c={C.text}>{b}</T>
        </g>
      ))}
      <rect x={12} y={272} width={456} height={38} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <T x={240} y={296} a="middle" s={11.5} c={C.text} w={600}>Never touch the dial. A fingerprint on it is for ever.</T>
    </F>
  )
}

function FpStemRelease() {
  const rows = [
    ['Seiko NH, 6R', 'crown pushed fully in', 'press the lever as you pull'],
    ['Sellita SW260-1, SW500', 'time-setting position', 'a 1 mm flat tool, not pointed'],
    ['Screw-type release', 'per your calibre', 'at most two turns'],
  ]
  return (
    <F h={322} view="Detail · a stuck stem" scale="schematic">
      <rect x={12} y={28} width={456} height={34} rx="6" fill="rgba(194,88,99,0.10)" stroke={C.ruby} />
      <T x={24} y={50} s={12} c={C.ruby} w={700}>Stop pulling.</T>
      <T x={120} y={50} s={10.5} c={C.text}>Releases differ by calibre. Look yours up first.</T>

      <Pn x={12} y={72} w={222} h={124} t="Flat tip, not a point" />
      {/* push-piece of a setting-lever release, side view */}
      {[[40, true], [140, false]].map(([x, ok]) => (
        <g key={x}>
          <rect x={x} y={160} width={70} height={14} fill="url(#fp-mov)" stroke={C.struct} />
          <rect x={x + 28} y={156} width={14} height={6} fill={M.brassP} />
          {ok ? (
            <path d={`M${x + 30} 154 L${x + 40} 154 L${x + 40} 116 L${x + 30} 116 Z`} fill="url(#sk-steelH)" stroke={M.steelD} />
          ) : (
            <path d={`M${x + 44} 158 L${x + 50} 116 L${x + 58} 116 Z`} fill="url(#sk-steelH)" stroke={M.steelD} />
          )}
          <Verdict x={x + 66} y={130} ok={ok} r={8} />
        </g>
      ))}
      <Dim a={[70, 122]} b={[80, 122]} off={0} />
      <T x={64} y={126} a="end" s={10.5} c={C.dim} mono>1 mm</T>
      <T x={182} y={190} a="middle" s={10} c={C.ruby}>can jam the lever</T>
      <T x={75} y={190} a="middle" s={10} c={C.emerald}>sits on the lever</T>

      <Pn x={246} y={72} w={222} h={124} t="A released stem" />
      <rect x={262} y={128} width={56} height={34} fill="url(#fp-mov)" stroke={C.struct} />
      <rect x={300} y={142} width={120} height={5} fill="url(#sk-steel)" />
      <rect x={420} y={134} width={16} height={22} rx="3" fill="url(#fp-knurl)" stroke={M.steelD} />
      <Arrow a={[444, 145]} b={[458, 145]} c="emerald" w={1.4} />
      <T x={357} y={110} a="middle" s={10.5} c={C.text}>slides out with</T>
      <T x={357} y={124} a="middle" s={10.5} c={C.text}>almost no force</T>
      <T x={357} y={182} a="middle" s={10} c={C.faint}>if it needs force, it isn’t released</T>

      <Tb x={14} y={216} rows={rows} />
      <T x={14} y={312} s={10} c={C.faint}>Reported releases. Screw type stuck after two turns: tighten it back a turn and look again.</T>
    </F>
  )
}

// small table: first row is the header style
function Tb({ x, y, rows }) {
  const cols = [x, x + 150, x + 290]
  return (
    <g>
      <Tag x={cols[0]} y={y}>Calibre</Tag>
      <Tag x={cols[1]} y={y}>Crown</Tag>
      <Tag x={cols[2]} y={y}>Then</Tag>
      {rows.map((r, i) => (
        <g key={i}>
          <line x1={x - 2} y1={y + 8 + i * 22} x2={466} y2={y + 8 + i * 22} stroke={C.line} strokeWidth="0.6" />
          {r.map((c, j) => (
            <T key={j} x={cols[j]} y={y + 24 + i * 22} s={10.5} c={j === 0 ? C.text : C.dim}>{c}</T>
          ))}
        </g>
      ))}
    </g>
  )
}

function FpIdQuartz() {
  return (
    <F h={300} view="Identify · read the module" scale="schematic">
      <QMod cx={96} cy={140} r={74} />
      <rect x={34} y={170} width={60} height={14} rx="2" fill="rgba(0,0,0,0.45)" />
      <T x={64} y={181} a="middle" s={10} c={C.text} mono>RONDA 763</T>
      <circle cx={64} cy={177} r={32} fill="none" stroke={C.brass} strokeWidth="1.4" />
      <line x1={92} y1={162} x2={196} y2={106} stroke={C.brass} strokeWidth="0.8" opacity="0.7" />
      <line x1={88} y1={198} x2={196} y2={174} stroke={C.brass} strokeWidth="0.8" opacity="0.7" />
      <rect x={196} y={104} width={112} height={72} rx="8" fill="rgba(0,0,0,0.3)" stroke={C.brass} strokeWidth="1.4" />
      <T x={252} y={146} a="middle" s={15} c={C.text} mono w={700}>RONDA 763</T>
      <T x={252} y={196} a="middle" s={10.5} c={C.dim}>copy every digit and letter</T>
      <T x={96} y={238} a="middle" s={10} c={C.faint}>printed on the module or plate</T>

      <Arrow a={[312, 140]} b={[330, 140]} c="brass" w={1.6} />
      <Bx x={334} y={118} w={134} h={44} l={['Movement Guides', 'and maker sheet']} c={C.brass} />
      {['data sheet', 'parts', 'oiling chart'].map((t, i) => (
        <g key={t}>
          <Arrow a={[400, 164]} b={[352 + i * 48, 210]} c="emerald" w={1.3} />
          <Bx x={330 + i * 48} y={212} w={44} h={40} l={t.split(' ')} s={10} />
        </g>
      ))}
      <T x={400} y={272} a="middle" s={10.5} c={C.text}>the calibre unlocks all three</T>
      <T x={14} y={290} s={10} c={C.faint}>Full lesson: Identify a quartz calibre</T>
    </F>
  )
}

function FpIdMech() {
  const cx = 104
  const cy = 136
  const r = 62
  return (
    <F h={322} view="Identify · measure, then match" scale="schematic">
      {/* calliper across the movement */}
      <rect x={cx - r - 16} y={48} width={2 * r + 52} height={14} rx="2" fill="url(#sk-steelH)" stroke={M.steelD} />
      <path d={`M${cx - r - 6} 62 L${cx - r} 62 L${cx - r} 118 L${cx - r - 6} 108 Z`} fill="url(#sk-steel)" stroke={M.steelD} />
      <path d={`M${cx + r} 62 L${cx + r + 6} 62 L${cx + r + 6} 108 L${cx + r} 118 Z`} fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={cx + r - 4} y={28} width={62} height={20} rx="3" fill="#1d2a24" stroke={C.steel} />
      <T x={cx + r + 27} y={43} a="middle" s={11} mono c="#b7c9b5">25.6 mm</T>
      <circle cx={cx} cy={cy} r={r} fill={M.plate} stroke={C.brass} strokeWidth="1.4" />
      <path d={`M${cx - 50} ${cy - 30} Q${cx} ${cy - 50} ${cx + 40} ${cy - 30} L${cx + 20} ${cy + 4} L${cx - 30} ${cy + 4} Z`} fill="#6a6148" stroke={C.struct} />
      <Balance cx={cx + 26} cy={cy + 28} r={20} />
      <Screw x={cx - 30} y={cy - 22} r={4} />
      <Screw x={cx + 24} y={cy - 26} r={4} ang={80} />
      <Dim a={[cx - r, cy + r + 14]} b={[cx + r, cy + r + 14]} off={0} text="diameter" />
      <rect x={12} y={232} width={196} height={78} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.brass} />
      <T x={22} y={252} s={11} c={C.text} w={600}>lignes = mm ÷ 2.256</T>
      <T x={22} y={270} s={10.5} c={C.dim}>ETA 2824: 25.6 ÷ 2.256 ≈ 11.3</T>
      <T x={22} y={285} s={10.5} c={C.dim}>sold as 11½‴, so compare</T>
      <T x={22} y={299} s={10.5} c={C.dim}>the mm with the guide</T>

      <Tag x={236} y={44}>Match all of these</Tag>
      {['diameter', 'seconds position', 'date position', 'bridge shapes'].map((t, i) => (
        <g key={t}>
          <Verdict x={236} y={64 + i * 22} ok r={7} />
          <T x={250} y={68 + i * 22} s={11} c={C.text}>{t}</T>
        </g>
      ))}
      <T x={226} y={164} s={10.5} c={C.dim}>Marks: near the balance or under the dial.</T>
      <T x={226} y={180} s={10.5} c={C.dim}>Write the full name: a 2824-2 isn’t a 2824.</T>
      <rect x={220} y={194} width={248} height={66} rx="6" fill="rgba(194,88,99,0.10)" stroke={C.ruby} />
      <T x={230} y={213} s={11} c={C.ruby} w={600}>Layout doesn’t match the mark?</T>
      <T x={230} y={229} s={10.5} c={C.text}>Suspect a clone or a swapped</T>
      <T x={230} y={243} s={10.5} c={C.text}>movement. Don’t order parts yet.</T>
      <T x={226} y={282} s={10} c={C.faint}>Some Sea-Gull ST2130s are engraved 2824-2:</T>
      <T x={226} y={296} s={10} c={C.faint}>trust the layout over the engraving.</T>
    </F>
  )
}

function FpReadMachine() {
  return (
    <F h={322} view="Plan · the four groups to name by sight" scale="schematic">
      {/* barrel */}
      <circle cx={100} cy={140} r={54} fill="rgba(201,162,76,0.12)" stroke={M.brassP} strokeWidth="3" strokeDasharray="4 3" />
      <circle cx={100} cy={140} r={40} fill="none" stroke={M.brassP} strokeWidth="1" />
      <path d="M100 140 m-6 0 a6 6 0 1 1 12 0 a12 12 0 1 1 -24 0 a20 20 0 1 1 40 0 a28 28 0 1 1 -56 0" fill="none" stroke={C.steel} strokeWidth="1" />
      <Wheel cx={196} cy={112} r={34} />
      <Wheel cx={254} cy={164} r={24} />
      <Wheel cx={300} cy={118} r={20} />
      <EscW cx={340} cy={170} r={16} />
      {/* pallet fork */}
      <g stroke={C.emerald} strokeWidth="2.4" strokeLinecap="round">
        <line x1={346} y1={190} x2={384} y2={206} />
        <line x1={336} y1={190} x2={356} y2={186} />
      </g>
      <circle cx={364} cy={198} r={2.6} fill={M.ruby} />
      <Balance cx={410} cy={214} r={34} />
      <Arrow d="M150 124 Q166 114 170 112" c="brass" w={1.4} />
      <Arrow d="M222 128 Q234 140 238 150" c="brass" w={1.4} />
      <Arrow d="M274 150 Q284 138 288 132" c="brass" w={1.4} />
      <Arrow d="M314 132 Q324 146 328 156" c="brass" w={1.4} />

      {/* group brackets */}
      <T x={100} y={60} a="middle" s={12} c={C.brassHi} w={700}>Barrel</T>
      <T x={250} y={62} a="middle" s={12} c={C.steel} w={700}>Train</T>
      <line x1={170} y1={70} x2={318} y2={70} stroke={C.steel} strokeWidth="1" />
      <T x={196} y={162} a="middle" s={10} c={C.dim}>centre</T>
      <T x={254} y={202} a="middle" s={10} c={C.dim}>third</T>
      <T x={300} y={154} a="middle" s={10} c={C.dim}>fourth</T>
      <T x={300} y={246} a="middle" s={12} c={C.emerald} w={700}>Escapement</T>
      <T x={300} y={260} a="middle" s={10} c={C.dim}>escape wheel + pallet fork</T>
      <T x={418} y={168} a="middle" s={12} c={C.ruby} w={700}>Balance</T>

      <T x={14} y={226} s={10.5} c={C.dim}>stores the power</T>
      <T x={14} y={240} s={10.5} c={C.dim}>in the mainspring</T>
      <rect x={12} y={276} width={456} height={38} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={22} y={292} s={10.5} c={C.text}>Power flows barrel → train → escapement; the balance swings to keep time.</T>
      <T x={22} y={306} s={10} c={C.faint}>Save the calibre and stem details in your Practice Log.</T>
    </F>
  )
}

function FpStemRefit() {
  const y = 96
  return (
    <F h={322} view="Sequence · refitting the stem" scale="schematic">
      {[0, 1, 2].map((i) => {
        const x = 12 + i * 154
        return <Pn key={i} x={x} y={26} w={146} h={140} />
      })}
      {[0, 1, 2].map((i) => {
        const x = 12 + i * 154
        const pos = [24, 10, 0][i]
        return (
          <g key={i}>
            <rect x={x + 10} y={y - 22} width={50} height={44} fill="url(#fp-mov)" stroke={C.struct} />
            <rect x={x + 30 + pos} y={y - 2.5} width={70} height={5} fill="url(#sk-steel)" />
            <rect x={x + 100 + pos} y={y - 11} width={14} height={22} rx="3" fill="url(#fp-knurl)" stroke={M.steelD} />
            <Num x={x + 14} y={40} n={i + 1} r={8} />
          </g>
        )
      })}
      <Arrow a={[150, 120]} b={[124, 120]} c="brass" w={1.8} />
      <Note x={24} y={142} lines={['Offer it to its hole,', 'push gently']} c={C.text} s={10.5} lh={13} />
      <circle cx={282} cy={64} r={13} fill="url(#fp-knurl)" stroke={M.steelD} />
      <Turn cx={282} cy={64} r={20} from={300} to={60} c="brass" w={1.6} />
      <T x={196} y={52} s={10} c={C.faint}>crown end</T>
      <Note x={178} y={136} lines={['Stops short? Turn it', 'slowly anticlockwise', 'as you push']} c={C.text} s={10.5} lh={13} />
      <T x={404} y={70} a="middle" s={11} c={C.emerald} w={700}>click</T>
      <Arrow a={[426, 120]} b={[446, 120]} c="steel" w={1.4} />
      <Note x={332} y={142} lines={['Clicks home; stays', 'put on a light tug']} c={C.text} s={10.5} lh={13} />

      {[
        ['Pulls straight out again', 'Release not re-engaged: re-seat the stem and', 'tighten the setting-lever screw a turn or two.', C.brass],
        ['Gritty or blocked', 'Take the stem out and look.', 'Never force it.', C.ruby],
      ].map(([a, b, c, col], i) => (
        <g key={a}>
          <rect x={12} y={178 + i * 46} width={456} height={40} rx="5" fill="rgba(255,255,255,0.025)" stroke={C.line} />
          <rect x={12} y={178 + i * 46} width={4} height={40} fill={col} />
          <T x={24} y={202 + i * 46} s={11} c={C.text} w={600}>{a}</T>
          <T x={190} y={195 + i * 46} s={10.5} c={C.dim}>{b}</T>
          <T x={190} y={209 + i * 46} s={10.5} c={C.dim}>{c}</T>
        </g>
      ))}
      <T x={14} y={290} s={11} c={C.text}>Refit clamps or ring, then repeat your opening test.</T>
      <T x={14} y={306} s={10.5} c={C.emerald}>Every function should match the notes you made before.</T>
    </F>
  )
}

/* ================================================================== */
/* fp-module · Project 3, swap a quartz module and refit hands           */
/* ================================================================== */

function FpModuleCompare() {
  const rows = [
    ['Calibre number', 'same?'],
    ['Stem position', 'same?'],
    ['Date position', 'same?'],
    ['Runs on a cell', 'new one: yes'],
  ]
  return (
    <F h={318} view="Comparison · prove the new module first" scale="schematic">
      <QMod cx={74} cy={98} r={52} />
      <T x={74} y={172} a="middle" s={11} c={C.text} w={600}>old</T>
      <T x={74} y={186} a="middle" s={10} c={C.faint}>dead, still in the case</T>
      <QMod cx={214} cy={98} r={52} />
      <T x={214} y={172} a="middle" s={11} c={C.text} w={600}>new</T>
      <T x={214} y={186} a="middle" s={10} c={C.emerald}>untouched, with a cell</T>
      <Arrow a={[136, 52]} b={[152, 52]} c="brass" w={1.4} both />
      {rows.map(([a, b], i) => (
        <g key={a}>
          <Verdict x={22} y={212 + i * 22} ok r={7} />
          <T x={36} y={216 + i * 22} s={11} c={C.text}>{a}</T>
          <T x={166} y={216 + i * 22} s={10.5} c={C.dim}>{b}</T>
        </g>
      ))}
      <T x={14} y={308} s={10.5} c={C.dim}>A module that won’t run is a simple return while untouched.</T>

      <Pn x={290} y={26} w={178} h={266} t="Number differs?" tc={C.brass} c={C.brass} />
      <T x={300} y={58} s={10.5} c={C.text}>Check on the data sheet:</T>
      {/* side view: stem height */}
      <rect x={312} y={108} width={110} height={30} fill="url(#fp-mov)" stroke={C.struct} />
      <rect x={312} y={138} width={110} height={4} fill={M.dial} />
      <rect x={422} y={114} width={34} height={5} fill="url(#sk-steel)" />
      <line x1={412} y1={142} x2={440} y2={142} stroke={C.dim} strokeWidth="0.6" strokeDasharray="2 2" />
      <Dim a={[434, 142]} b={[434, 116.5]} off={0} />
      <T x={367} y={98} a="middle" s={10.5} c={C.text}>stem height</T>
      <T x={367} y={158} a="middle" s={10} c={C.faint}>from the dial side</T>
      {/* plan: hand holes */}
      <circle cx={360} cy={214} r={22} fill="#6b6257" stroke={C.struct} />
      <circle cx={360} cy={214} r={14} fill="#8a8173" stroke={C.struct} />
      <circle cx={360} cy={214} r={6} fill="#b5ab99" stroke={C.struct} />
      <circle cx={360} cy={214} r={1.6} fill={C.ink} />
      <Lab p={[380, 204]} x={400} y={190} text="hour" a="start" up />
      <Lab p={[372, 218]} x={400} y={222} text="minute" a="start" />
      <Lab p={[361, 210]} x={400} y={256} text="seconds" a="start" />
      <T x={300} y={282} s={10.5} c={C.text}>hand-hole sizes</T>
    </F>
  )
}

// small section of a module with dial and hands, for sequence panels
function MiniStack({ x, y, dial = true, hands = true, mod = 'plain', prot, lift }) {
  const modFill = mod === 'old' ? 'rgba(194,88,99,0.35)' : mod === 'new' ? 'rgba(123,165,131,0.35)' : 'url(#fp-mov)'
  const dy = lift || 0
  return (
    <g>
      {mod && <rect x={x - 50} y={y} width={100} height={22} fill={modFill} stroke={C.struct} />}
      {dial && <rect x={x - 54} y={y - 4 - dy} width={108} height={4} fill={M.dial} />}
      {prot && <rect x={x - 50} y={y - 7} width={44} height={3} fill={M.glass} opacity="0.7" />}
      {prot && <rect x={x + 6} y={y - 7} width={44} height={3} fill={M.glass} opacity="0.7" />}
      {hands && (
        <g>
          <rect x={x - 3} y={y - 16 - (hands === 'up' ? 10 : 0)} width={6} height={12} fill={C.dim} />
          <rect x={x - 40} y={y - 10 - (hands === 'up' ? 10 : 0)} width={40} height={2} fill={C.brassHi} />
          <rect x={x} y={y - 14 - (hands === 'up' ? 10 : 0)} width={46} height={2} fill={C.brassHi} />
        </g>
      )}
    </g>
  )
}

function FpModuleSwap() {
  const st = [
    ['Hands off', 'protectors on the dial', { prot: true, hands: 'up' }, true],
    ['Dial off', 'free the dial feet', { hands: false, lift: 12 }],
    ['Old module out', 'stem released', { hands: false, dial: false, mod: 'old' }],
    ['New module in', 'the one you proved', { hands: false, dial: false, mod: 'new' }],
    ['Dial on', 'fixed the same way', { hands: false, mod: 'new' }],
    ['Hands on', 'dead flat, indexed', { mod: 'new' }, true],
  ]
  return (
    <F h={318} view="Sequence · the module swap" scale="schematic">
      {st.map(([a, b, p, hot], i) => {
        const x = 12 + (i % 3) * 154
        const y = 28 + Math.floor(i / 3) * 128
        return (
          <g key={a}>
            <rect x={x} y={y} width={146} height={118} rx="7" fill="rgba(255,255,255,0.025)" stroke={hot ? C.brass : C.line} strokeWidth={hot ? 1.5 : 1} />
            <Num x={x + 14} y={y + 15} n={i + 1} r={8} />
            <T x={x + 28} y={y + 19} s={11} c={C.text} w={600}>{a}</T>
            <MiniStack x={x + 73} y={y + 64} {...p} />
            {p.hands === 'up' && <Arrow a={[x + 73, y + 44]} b={[x + 73, y + 30]} c="brass" w={1.4} />}
            {p.lift && <Arrow a={[x + 120, y + 58]} b={[x + 120, y + 40]} c="brass" w={1.4} />}
            {p.mod === 'old' && <Arrow a={[x + 132, y + 76]} b={[x + 132, y + 48]} c="ruby" w={1.4} />}
            <T x={x + 73} y={y + 108} a="middle" s={10} c={hot ? C.brassHi : C.dim}>{b}</T>
          </g>
        )
      })}
      <T x={14} y={300} s={10.5} c={C.text}>The electronics are the easy part. Steps 1 and 6 are where dials get marked.</T>
      <T x={14} y={314} s={10} c={C.faint}>Full lesson: Swap a quartz movement (module)</T>
    </F>
  )
}

function FpHandsPractice() {
  const cx = 150
  const d = 214
  return (
    <F h={320} view="Section · hands off and on" scale="schematic, heights exaggerated">
      <Pn x={12} y={26} w={282} h={256} t="Lift: levers on a protector" />
      <rect x={30} y={d + 4} width={240} height={30} fill="url(#fp-mov)" stroke={C.struct} />
      <rect x={26} y={d} width={248} height={4} fill={M.dial} />
      <rect x={40} y={d - 4} width={100} height={4} fill={M.glass} opacity="0.75" />
      <rect x={160} y={d - 4} width={100} height={4} fill={M.glass} opacity="0.75" />
      {/* pipes and hands, lifted a little */}
      <rect x={cx - 8} y={d - 22} width={16} height={22} fill="#8a8173" />
      <rect x={cx - 5} y={d - 36} width={10} height={14} fill="#a39a88" />
      <rect x={cx - 2} y={d - 50} width={4} height={14} fill="#bdb4a2" />
      <rect x={cx - 10} y={d - 26} width={20} height={6} fill={C.brassHi} />
      <rect x={60} y={d - 24} width={80} height={2.4} fill={C.brassHi} />
      <rect x={cx - 7} y={d - 40} width={14} height={6} fill={C.brassHi} />
      <rect x={cx + 7} y={d - 38} width={100} height={2} fill={C.brassHi} />
      <rect x={90} y={d - 52} width={110} height={1.4} fill={C.ruby} />
      <G x={cx - 12} y={d - 6} ang={-62}>
        <HandLever len={92} />
      </G>
      <G x={cx + 12} y={d - 6} ang={62}>
        <HandLever len={92} />
      </G>
      <Arrow a={[66, 140]} b={[60, 156]} c="brass" w={1.6} />
      <Arrow a={[234, 140]} b={[240, 156]} c="brass" w={1.6} />
      <Arrow a={[cx, 150]} b={[cx, 128]} c="emerald" w={2} />
      <T x={cx} y={120} a="middle" s={10.5} c={C.emerald}>straight up, evenly</T>
      <Lab p={[90, d - 2]} x={74} y={262} text="dial protector" />
      <Lab p={[200, d + 2]} x={210} y={262} text="dial" />
      <Lab p={[80, d - 23]} x={44} y={181} text="hour hand" up />
      <Lab p={[250, d - 37]} x={262} y={160} text="minute" up />
      <T x={152} y={276} a="middle" s={10} c={C.faint}>levers press on the protector, not the dial</T>

      <Pn x={302} y={26} w={166} h={256} t="Press on" />
      {[[0, true], [1, false]].map(([i, ok]) => {
        const y = 124 + i * 110
        return (
          <g key={i}>
            <rect x={322} y={y} width={126} height={4} fill={M.dial} />
            <rect x={381} y={y - 18} width={8} height={18} fill="#a39a88" />
            {ok ? (
              <rect x={330} y={y - 14} width={100} height={2.4} fill={C.brassHi} />
            ) : (
              <path d={`M330 ${y - 4} L430 ${y - 22}`} stroke={C.brassHi} strokeWidth="2.4" />
            )}
            <G x={385} y={y - 16}>
              <Pusher d={12} len={58} />
            </G>
            <Verdict x={444} y={y - 50} ok={ok} r={8} />
            <T x={385} y={y + 18} a="middle" s={10.5} c={ok ? C.emerald : C.ruby}>{ok ? 'dead flat' : 'tilted: lift, refit'}</T>
          </g>
        )
      })}
      <T x={14} y={304} s={10.5} c={C.text}>Hands are friction-fit: the hand’s collet grips its pipe, so it is unforgiving.</T>
    </F>
  )
}

function FpTenFit() {
  const Run = ({ y, marks, note, c }) => (
    <g>
      {Array.from({ length: 10 }, (_, i) => {
        const m = marks[i]
        const x = 66 + i * 30
        return (
          <g key={i}>
            <rect x={x} y={y} width={24} height={24} rx="4" fill={m === 1 ? 'rgba(123,165,131,0.18)' : m === 0 ? 'rgba(194,88,99,0.18)' : 'none'} stroke={m === 1 ? C.emerald : m === 0 ? C.ruby : C.line} />
            <T x={x + 12} y={y + 16} a="middle" s={10.5} c={m === undefined ? C.faint : C.text}>{i + 1}</T>
          </g>
        )
      })}
      <Note x={372} y={y + 9} lines={note} c={c} s={10.5} lh={13} />
    </g>
  )
  return (
    <F h={318} view="Chart · the ten-fit bench check" scale="schematic">
      <T x={14} y={44} s={10.5} c={C.dim}>Dead module and its old hands as scrap · over a dial or a spare card · loupe after every fit</T>
      <T x={14} y={84} s={11} c={C.text} w={600}>Run 1</T>
      <Run y={66} marks={[1, 1, 1, 1, 1, 1, 0]} note={['Fit 7 marked it:', 'start the count again']} c={C.ruby} />
      <T x={14} y={128} s={11} c={C.text} w={600}>Run 2</T>
      <Run y={110} marks={[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]} note={['Ten clean fits:', 'log it']} c={C.emerald} />
      <Arrow a={[200, 144]} b={[200, 168]} c="brass" w={1.6} />
      <T x={210} y={162} s={10.5} c={C.brassHi}>about 30 days later</T>
      <T x={14} y={190} s={11} c={C.text} w={600}>Repeat</T>
      <Run y={172} marks={[]} note={['A skill you repeat', 'after a gap is yours']} c={C.text} />

      <Tag x={14} y={228}>Any one of these ends the run</Tag>
      {[
        ['A mark on the dial', 0],
        ['A bent hand', 1],
        ['A hand that needed forcing', 2],
      ].map(([t, i]) => (
        <g key={t}>
          <Verdict x={22 + i * 150} y={248} ok={false} r={7} />
          <T x={36 + i * 150} y={252} s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
      <rect x={12} y={268} width={456} height={40} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={22} y={284} s={10.5} c={C.dim}>A hand that feels loose or too tight is a fit problem, not a technique</T>
      <T x={22} y={299} s={10.5} c={C.dim}>problem. The hand-fitting lesson covers both.</T>
    </F>
  )
}

function FpHandAlign() {
  return (
    <F h={312} view="Inspection · hands at 12" scale="schematic">
      <Pn x={12} y={26} w={146} h={176} t="Aligned" tc={C.emerald} c={C.emerald} ok />
      <Face cx={85} cy={118} r={52} h={0} m={0} lugs={false} />
      <T x={85} y={192} a="middle" s={10.5} c={C.text}>one line at 12:00</T>

      <Pn x={167} y={26} w={146} h={176} t="Off" tc={C.ruby} c={C.ruby} ok={false} />
      <Face cx={240} cy={118} r={52} h={346} m={0} lugs={false} />
      <path d={`M240 76 L240 66`} stroke={C.faint} strokeDasharray="2 2" />
      <T x={240} y={192} a="middle" s={10.5} c={C.text}>hour hand short of 12</T>

      <Pn x={322} y={26} w={146} h={176} t="Clear of each other" />
      <rect x={338} y={170} width={114} height={4} fill={M.dial} />
      <rect x={391} y={112} width={8} height={58} fill="#a39a88" />
      <rect x={346} y={156} width={50} height={2.4} fill={C.brassHi} />
      <rect x={394} y={140} width={54} height={2.2} fill={C.brassHi} />
      <rect x={350} y={122} width={92} height={1.4} fill={C.ruby} />
      <Dim a={[372, 158]} b={[372, 170]} off={0} />
      <Dim a={[430, 142]} b={[430, 156]} off={0} />
      <T x={395} y={192} a="middle" s={10.5} c={C.text}>gaps all the way round</T>

      <T x={14} y={226} s={11} c={C.text} w={600}>Run the hands past 12:00: they must never touch, and align every time.</T>
      <Num x={22} y={250} n={1} r={8} />
      <T x={36} y={254} s={10.5} c={C.text}>Not aligned? Lift the hand and re-index it on its pipe.</T>
      <Num x={22} y={274} n={2} r={8} />
      <T x={36} y={278} s={10.5} c={C.text}>Never bend a hand into line, never force it.</T>
      <T x={14} y={302} s={10.5} c={C.ruby}>Dial protectors are not optional: one slip leaves a permanent scratch.</T>
    </F>
  )
}

function FpCasedTest() {
  return (
    <F h={318} view="Test · cased, the way it’s worn" scale="schematic">
      <Pn x={12} y={26} w={222} h={170} t="1 · Overnight, dial down" />
      {/* watch face down on a cloth: crystal at the bottom */}
      <path d="M24 170 Q123 160 222 170 L222 180 L24 180 Z" fill="#4b4560" />
      <rect x={40} y={92} width={22} height={70} fill="url(#fp-cut)" stroke="#4e5f6a" />
      <rect x={184} y={92} width={22} height={70} fill="url(#fp-cut)" stroke="#4e5f6a" />
      <rect x={62} y={154} width={122} height={8} fill="url(#fp-acr)" stroke={M.glass} />
      <rect x={66} y={100} width={114} height={28} fill="url(#fp-mov)" stroke={C.struct} />
      <rect x={66} y={128} width={114} height={4} fill={M.dial} />
      <rect x={120} y={132} width={6} height={10} fill="#a39a88" />
      <rect x={76} y={140} width={46} height={2.2} fill={C.brassHi} />
      <path d="M126 144 Q150 146 172 153" stroke={C.brassHi} strokeWidth="2.2" fill="none" />
      <circle cx={170} cy={153} r={3.5} fill="none" stroke={C.ruby} strokeWidth="1.5" />
      <Lab p={[170, 153]} x={180} y={62} text="hand on the crystal" c={C.ruby} up />
      <T x={123} y={60} a="end" s={10} c={C.faint}>back up</T>
      <T x={123} y={190} a="middle" s={10} c={C.dim}>can stop it in this position only</T>

      <Pn x={246} y={26} w={222} h={170} t="2 · Date: run to the flip" />
      <Face cx={326} cy={112} r={52} h={358} m={354} date lugs={false} />
      <Note x={390} y={74} lines={['the date', 'changes:', 'hands should', 'read close', 'to 12']} c={C.text} s={10.5} lh={13} />
      <T x={357} y={186} a="middle" s={10} c={C.dim}>if not, re-index the hour hand</T>

      {[
        ['Stutters on a fresh cell', 'Hands touching or sluggish gears, not the cell.', C.brass],
        ['Won’t start at all', 'First check the crown is pushed fully in.', C.ruby],
      ].map(([a, b, c], i) => (
        <g key={a}>
          <rect x={12} y={210 + i * 44} width={456} height={36} rx="5" fill="rgba(255,255,255,0.025)" stroke={C.line} />
          <rect x={12} y={210 + i * 44} width={4} height={36} fill={c} />
          <T x={24} y={232 + i * 44} s={11} c={C.text} w={600}>{a}</T>
          <T x={190} y={232 + i * 44} s={10.5} c={C.dim}>{b}</T>
        </g>
      ))}
    </F>
  )
}

/* ================================================================== */
/* fp-service · Project 4, a first full service                          */
/* ================================================================== */

function FpServiceMap() {
  const icon = (i, x, y) => {
    switch (i) {
      case 0:
        return (
          <g>
            <Wheel cx={x} cy={y} r={18} spokes={3} />
            <Turn cx={x} cy={y} r={24} from={60} to={-120} c="emerald" w={1.4} />
          </g>
        )
      case 1:
        return (
          <g>
            <path d={`M${x - 26} ${y + 8} L${x + 26} ${y + 8} L${x + 20} ${y - 2} L${x - 20} ${y - 2} Z`} fill="#8b8574" stroke={C.struct} />
            <G x={x + 10} y={y - 4} ang={20} k={0.5}>
              <Screwdriver />
            </G>
          </g>
        )
      case 2:
        return (
          <g>
            <rect x={x - 18} y={y - 18} width={36} height={36} rx="4" fill="rgba(160,200,215,0.08)" stroke={C.struct} />
            <rect x={x - 16} y={y - 4} width={32} height={20} fill="#d9c35c" opacity="0.5" />
          </g>
        )
      case 3:
        return (
          <g>
            <G x={x} y={y + 10} ang={15} k={0.6}>
              <Oiler />
            </G>
            <circle cx={x} cy={y + 14} r={6} fill="none" stroke={M.ruby} strokeWidth="2" />
          </g>
        )
      case 4:
        return (
          <g>
            <circle cx={x} cy={y} r={7} fill={M.ruby} />
            <path d={`M${x - 20} ${y + 4} Q${x - 22} ${y - 18} ${x} ${y - 16} Q${x + 22} ${y - 18} ${x + 20} ${y + 4}`} fill="none" stroke={C.steel} strokeWidth="1.8" />
          </g>
        )
      default:
        return (
          <g>
            <path d={`M${x - 26} ${y - 10} L${x + 26} ${y - 10} L${x + 20} ${y - 18} L${x - 20} ${y - 18} Z`} fill="#8b8574" stroke={C.struct} />
            <Arrow a={[x, y - 6]} b={[x, y + 6]} c="brass" w={1.4} />
            <rect x={x - 28} y={y + 10} width={56} height={6} fill="url(#fp-mov)" />
          </g>
        )
    }
  }
  const names = ['Let-down', 'Teardown', 'Cleaning', 'Oiling', 'Shock protection', 'Reassembly']
  return (
    <F h={300} view="Map · the Servicing track at a glance" scale="schematic">
      <T x={14} y={44} s={11} c={C.text}>Skim all six lessons before you start. Then work them in this order.</T>
      {names.map((n, i) => {
        const col = i % 3
        const row = Math.floor(i / 3)
        const x = 14 + col * 156
        const y = 60 + row * 110
        return (
          <g key={n}>
            <rect x={x} y={y} width={140} height={96} rx="7" fill="rgba(255,255,255,0.025)" stroke={C.line} />
            <Num x={x + 14} y={y + 15} n={i + 1} r={8} />
            {icon(i, x + 70, y + 46)}
            <T x={x + 70} y={y + 86} a="middle" s={11} c={C.text} w={600}>{n}</T>
            {col < 2 && <Arrow a={[x + 142, y + 48]} b={[x + 154, y + 48]} c="brass" w={1.4} />}
          </g>
        )
      })}
      <T x={240} y={290} a="middle" s={11} c={C.dim}>Knowing the shape of the job stops you improvising at the bench.</T>
    </F>
  )
}

function FpScrapStrip() {
  return (
    <F h={312} view="Sequence · practise on scrap first" scale="schematic">
      <Pn x={12} y={26} w={146} h={226} t="1 · Pick scrap" />
      <circle cx={85} cy={104} r={44} fill={M.plate} stroke={C.brass} />
      <circle cx={85} cy={104} r={36} fill="none" stroke={C.struct} strokeDasharray="3 3" />
      <Balance cx={100} cy={118} r={14} />
      <Wheel cx={70} cy={86} r={14} />
      <T x={85} y={168} a="middle" s={10.5} c={C.text}>old pocket movement</T>
      <T x={85} y={184} a="middle" s={10.5} c={C.text}>or a cheap ST36 or 6497</T>
      <T x={85} y={210} a="middle" s={10} c={C.faint}>doesn’t matter if</T>
      <T x={85} y={223} a="middle" s={10} c={C.faint}>it never runs</T>

      <Pn x={167} y={26} w={146} h={226} t="2 · Strip, photos" />
      <rect x={180} y={48} width={120} height={88} rx="4" fill={M.tray} stroke="#a89c82" />
      {Array.from({ length: 6 }, (_, i) => {
        const x = 184 + (i % 3) * 39
        const y = 52 + Math.floor(i / 3) * 42
        return (
          <g key={i}>
            <rect x={x} y={y} width={35} height={38} rx="3" fill="#cfc6b2" stroke="#a89c82" />
            <T x={x + 5} y={y + 12} s={10} c="#3a342c" w={700}>{i + 1}</T>
            <circle cx={x + 22} cy={y + 24} r={i % 2 ? 4 : 7} fill={i % 3 === 0 ? M.brassP : '#7e909b'} />
          </g>
        )
      })}
      <rect x={210} y={154} width={60} height={36} rx="5" fill="#2d2a27" stroke={C.dim} />
      <circle cx={240} cy={172} r={11} fill="#1d2a32" stroke={C.steel} strokeWidth="2" />
      <rect x={220} y={149} width={14} height={6} rx="1" fill={C.dim} />
      <T x={240} y={210} a="middle" s={10.5} c={C.text}>tray in teardown order,</T>
      <T x={240} y={224} a="middle" s={10.5} c={C.text}>a photo at every stage</T>

      <Pn x={322} y={26} w={146} h={226} t="3 · Pass test" />
      <Wheel cx={366} cy={124} r={20} />
      <Wheel cx={404} cy={104} r={14} />
      <EscW cx={428} cy={134} r={12} />
      <Turn cx={366} cy={124} r={27} from={-40} to={60} c="emerald" w={1.4} />
      {/* blower */}
      <ellipse cx={392} cy={200} rx={20} ry={14} fill="#3b3833" stroke={C.dim} />
      <path d="M404 190 L424 158" stroke={C.dim} strokeWidth="4" strokeLinecap="round" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${428 + i * 4} ${154 - i * 2} q4 -4 0 -8`} fill="none" stroke={M.glass} strokeWidth="1.2" />
      ))}
      <T x={395} y={64} a="middle" s={10.5} c={C.text}>puff air at the</T>
      <T x={395} y={78} a="middle" s={10.5} c={C.text}>escape wheel</T>
      <T x={395} y={232} a="middle" s={10.5} c={C.emerald}>the train spins freely</T>

      <T x={14} y={274} s={11} c={C.text}>You’ve passed when you can rebuild it from your tray and photos.</T>
      <T x={14} y={294} s={10.5} c={C.dim}>A part broke or pinged away? Note how it happened, and carry on.</T>
    </F>
  )
}

function FpBeforeReading() {
  const x0 = 60
  const k = 2.6 // px per degree, from 200°
  const ax = (deg) => x0 + (deg - 200) * k
  return (
    <F h={322} view="Test · the before reading" scale="schematic">
      {[
        ['Wind', '10 to 15 turns'],
        ['Run', 'about 20 min'],
        ['Demagnetise', ''],
        ['Read dial up', 'and log it'],
      ].map(([a, b], i) => (
        <g key={a}>
          <rect x={12 + i * 116} y={28} width={104} height={44} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.brass} strokeOpacity="0.55" />
          <Num x={26 + i * 116} y={50} n={i + 1} r={8} />
          <T x={40 + i * 116} y={b ? 47 : 54} s={11} c={C.text} w={600}>{a}</T>
          {b && <T x={40 + i * 116} y={61} s={10} c={C.dim}>{b}</T>}
          {i < 3 && <Arrow a={[117 + i * 116, 50]} b={[127 + i * 116, 50]} c="brass" w={1.3} />}
        </g>
      ))}
      <T x={14} y={94} s={10.5} c={C.dim}>Read rate, amplitude and beat error. Measure before you strip it.</T>

      <Pn x={12} y={106} w={160} h={110} t="6497 settings" />
      <rect x={24} y={130} width={136} height={34} rx="4" fill="#1d2a24" stroke={C.steel} />
      <T x={34} y={152} s={11} c={C.dim}>lift angle</T>
      <T x={150} y={153} a="end" s={14} mono c="#b7c9b5" w={700}>44°</T>
      <rect x={24} y={170} width={136} height={34} rx="4" fill="#1d2a24" stroke={C.steel} />
      <T x={34} y={192} s={11} c={C.dim}>beat rate</T>
      <T x={150} y={193} a="end" s={14} mono c="#b7c9b5" w={700}>18,000</T>

      <Pn x={182} y={106} w={286} h={110} t="Left at 52°, it reads high" tc={C.ruby} />
      {(() => {
        const X = (d) => 200 + (d - 220) * 2.6
        return (
          <g>
            <line x1={X(220)} y1={176} x2={X(320)} y2={176} stroke={C.struct} />
            {[220, 250, 280, 310].map((d) => (
              <g key={d}>
                <line x1={X(d)} y1={172} x2={X(d)} y2={180} stroke={C.faint} />
                <T x={X(d)} y={194} a="middle" s={10} c={C.faint} mono>{d}°</T>
              </g>
            ))}
            <circle cx={X(250)} cy={176} r={6} fill={C.emerald} />
            <T x={X(250)} y={160} a="middle" s={10.5} c={C.emerald}>true 250°</T>
            <circle cx={X(295)} cy={176} r={6} fill={C.ruby} />
            <T x={X(295)} y={160} a="middle" s={10.5} c={C.ruby}>shows ≈ 295°</T>
            <Arrow a={[X(250) + 8, 176]} b={[X(295) - 9, 176]} c="ruby" w={1.4} />
            <T x={X(272)} y={208} a="middle" s={10.5} c={C.text}>about 18% high</T>
          </g>
        )
      })()}

      <T x={14} y={240} s={10.5} c={C.dim}>No published lift angle (often so for Seagull)? Use one setting for both</T>
      <T x={14} y={254} s={10.5} c={C.dim}>readings, before and after, and compare those.</T>
      <rect x={12} y={268} width={456} height={42} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={22} y={285} s={10.5} c={C.text}>Phone timegrapher: trust rate first.</T>
      <T x={22} y={300} s={10.5} c={C.dim}>Beat error is marginal and amplitude isn’t reliable.</T>
    </F>
  )
}

function Fp6497() {
  return (
    <F h={312} view="Plan · the 6497 barrel side" scale="schematic, not to scale">
      <path d="M30 290 A190 190 0 0 1 250 60" fill="none" stroke={C.brass} strokeWidth="1.4" />
      <path d="M60 280 L60 150 Q60 110 110 104 L200 92 Q232 92 236 120 L236 280" fill="#8b8574" opacity="0.35" stroke={C.struct} />
      <T x={150} y={276} a="middle" s={10} c={C.faint}>barrel bridge</T>
      {/* ratchet wheel over the barrel */}
      <Wheel cx={130} cy={196} r={56} spokes={0} />
      <Screw x={130} y={196} r={9} ang={20} />
      {/* crown wheel */}
      <Wheel cx={196} cy={124} r={26} spokes={0} />
      <Screw x={196} y={124} r={7} ang={-30} />
      <Turn cx={196} cy={124} r={36} from={200} to={470} c="ruby" w={1.8} />
      <rect x={236} y={120} width={40} height={6} fill="url(#sk-steel)" />
      <Lab p={[260, 123]} x={262} y={104} text="stem" up />
      <Lab p={[196, 124]} x={130} y={58} text="crown-wheel screw" up />
      <Lab p={[130, 196]} x={90} y={300} text="ratchet-wheel screw" />

      <rect x={286} y={30} width={182} height={74} rx="6" fill="rgba(194,88,99,0.10)" stroke={C.ruby} />
      <T x={296} y={50} s={11.5} c={C.ruby} w={700}>Left-hand thread</T>
      <T x={296} y={67} s={10.5} c={C.text}>the crown-wheel screw undoes</T>
      <T x={296} y={81} s={10.5} c={C.text}>clockwise. Turned the usual</T>
      <T x={296} y={95} s={10.5} c={C.text}>way, it only tightens.</T>
      {[
        ['Real part names', 'learn them as you go'],
        ['Free-train air test', 'before the balance goes in'],
        ['The exact oiling map', 'where each oil goes'],
      ].map(([a, b], i) => (
        <g key={a}>
          <Num x={298} y={132 + i * 44} n={i + 1} r={8} />
          <T x={312} y={130 + i * 44} s={11} c={C.text} w={600}>{a}</T>
          <T x={312} y={144 + i * 44} s={10} c={C.dim}>{b}</T>
        </g>
      ))}
      <T x={286} y={276} s={10.5} c={C.dim}>Work the flagship lesson end to end.</T>
      <T x={286} y={292} s={10.5} c={C.brassHi}>No prize for speed.</T>
    </F>
  )
}

function FpPassTargets() {
  const X = (d) => 40 + (d - 220) * 3.1
  return (
    <F h={316} view="Chart · decide a pass before you read" scale="hobby targets">
      <Tag x={14} y={44}>Amplitude, fully wound, dial up</Tag>
      <rect x={X(250)} y={62} width={X(330) - X(250)} height={30} rx="3" fill="rgba(123,165,131,0.14)" stroke={C.emerald} strokeOpacity="0.5" />
      <rect x={X(270)} y={62} width={X(310) - X(270)} height={30} rx="3" fill="rgba(123,165,131,0.38)" stroke={C.emerald} />
      <line x1={X(220)} y1={100} x2={X(350)} y2={100} stroke={C.struct} />
      {[220, 250, 270, 310, 330, 350].map((d) => (
        <g key={d}>
          <line x1={X(d)} y1={96} x2={X(d)} y2={104} stroke={C.faint} />
          <T x={X(d)} y={118} a="middle" s={10} c={C.dim} mono>{d}°</T>
        </g>
      ))}
      <T x={X(290)} y={82} a="middle" s={11} c={C.text} w={600}>aim 270–310°</T>
      <T x={X(340)} y={82} a="middle" s={10} c={C.dim}>tolerance</T>
      <T x={X(340)} y={56} a="middle" s={10} c={C.faint}>250–330°</T>
      <line x1={X(255)} y1={58} x2={X(255)} y2={96} stroke={C.brassHi} strokeWidth="2" />
      <T x={X(255)} y={136} a="middle" s={10.5} c={C.brassHi}>255° is not a failure</T>

      {[
        ['Beat error', '0.5 ms or less'],
        ['Vertical positions', 'within about 40° of dial up'],
        ['After 24 hours', 'amplitude no more than 15% lower'],
      ].map(([a, b], i) => (
        <g key={a}>
          <rect x={12} y={152 + i * 34} width={456} height={28} rx="5" fill="rgba(255,255,255,0.025)" stroke={C.line} />
          <Verdict x={28} y={166 + i * 34} ok r={7} />
          <T x={44} y={170 + i * 34} s={11} c={C.text} w={600}>{a}</T>
          <T x={196} y={170 + i * 34} s={11} c={C.dim}>{b}</T>
        </g>
      ))}
      <T x={14} y={276} s={10.5} c={C.dim}>Set these before you read the machine, so you can’t talk yourself round.</T>
      <T x={14} y={292} s={10.5} c={C.dim}>Hobby targets, not a maker’s specification. A clear gain on your</T>
      <T x={14} y={306} s={10.5} c={C.dim}>before reading is a real result too.</T>
    </F>
  )
}

function FpProveLog() {
  return (
    <F h={306} view="Record · prove it and log it" scale="schematic">
      {[
        ['Regulate', 'on the timegrapher'],
        ['Run it', 'a day or two'],
        ['Record', 'the three readings'],
      ].map(([a, b], i) => (
        <g key={a}>
          <rect x={12 + i * 156} y={28} width={140} height={44} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.brass} strokeOpacity="0.55" />
          <Num x={26 + i * 156} y={50} n={i + 1} r={8} />
          <T x={40 + i * 156} y={47} s={11} c={C.text} w={600}>{a}</T>
          <T x={40 + i * 156} y={61} s={10} c={C.dim}>{b}</T>
          {i < 2 && <Arrow a={[154 + i * 156, 50]} b={[166 + i * 156, 50]} c="brass" w={1.3} />}
        </g>
      ))}
      <rect x={12} y={88} width={300} height={150} rx="6" fill="#2a2520" stroke={C.brass} strokeOpacity="0.7" />
      <rect x={12} y={88} width={300} height={22} rx="6" fill="rgba(208,168,79,0.18)" />
      <T x={22} y={103} s={10.5} c={C.brassHi} w={600}>Practice Log · 6497, first service</T>
      {['', 'rate', 'amplitude', 'beat error'].map((h, i) => (
        <T key={h} x={22 + i * 76} y={128} s={10} c={C.faint}>{h}</T>
      ))}
      {['before', 'day 0', 'day 1', 'day 2'].map((r, j) => (
        <g key={r}>
          <line x1={20} y1={134 + j * 24} x2={304} y2={134 + j * 24} stroke={C.line} strokeWidth="0.6" />
          <T x={22} y={150 + j * 24} s={10.5} c={C.text}>{r}</T>
          {[1, 2, 3].map((i) => (
            <line key={i} x1={22 + i * 76} y1={152 + j * 24} x2={76 + i * 76} y2={152 + j * 24} stroke={C.faint} strokeDasharray="2 2" />
          ))}
        </g>
      ))}
      <Note x={326} y={110} lines={['This baseline is', 'your proof the', 'work was right,', 'and the reference', 'for the next', 'service.']} c={C.text} s={10.5} lh={15} />
      <rect x={12} y={252} width={456} height={42} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={22} y={269} s={10.5} c={C.text}>Comfortable on the 6497?</T>
      <T x={22} y={284} s={10.5} c={C.dim}>Step up to the Seiko NH35 or ETA 2824 walkthroughs.</T>
    </F>
  )
}

function FpLowAmp() {
  const causes = ['Train bridge or balance cock over-tightened', 'Dust under the balance', 'Too much oil', 'Jewels not pegged clean']
  return (
    <F h={324} view="Flow · when the numbers disappoint" scale="schematic">
      <Bx x={12} y={28} w={180} h={40} l={['Low amplitude', 'after a service']} c={C.ruby} />
      <Arrow a={[192, 48]} b={[208, 48]} c="brass" w={1.4} />
      <rect x={210} y={28} width={258} height={58} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.brass} />
      <T x={220} y={44} s={11} c={C.text} w={600}>First rule out a bad reading</T>
      <T x={220} y={60} s={10.5} c={C.dim}>fully wound · 20 minutes’ running</T>
      <T x={220} y={74} s={10.5} c={C.dim}>· the correct lift angle</T>
      <T x={102} y={86} a="middle" s={10} c={C.faint}>don’t strip it straight away</T>
      <Arrow a={[339, 88]} b={[339, 102]} c="brass" w={1.4} />
      <T x={212} y={118} s={11} c={C.text} w={600}>Then work “Low amplitude: causes and cures”</T>
      <Tag x={14} y={142}>Often reported by repairers</Tag>
      {causes.map((c, i) => (
        <g key={c}>
          <rect x={12 + (i % 2) * 230} y={150 + Math.floor(i / 2) * 30} width={224} height={24} rx="4" fill="rgba(255,255,255,0.025)" stroke={C.line} />
          <T x={22 + (i % 2) * 230} y={166 + Math.floor(i / 2) * 30} s={10.5} c={C.text}>{c}</T>
        </g>
      ))}
      <Bx x={12} y={222} w={210} h={40} l={['Change one thing', 'then read and log']} c={C.brass} />
      <Arrow d="M222 242 Q250 242 262 242" c="brass" w={1.4} />
      <Bx x={264} y={222} w={90} h={40} l={['Passes?']} c={C.emerald} />
      <Arrow d="M300 264 Q300 290 200 290 Q110 290 110 266" c="ruby" w={1.3} />
      <T x={200} y={304} a="middle" s={10} c={C.ruby}>no: next suspect</T>
      <Arrow a={[354, 242]} b={[366, 242]} c="emerald" w={1.4} />
      <Bx x={368} y={214} w={100} h={56} l={['Recheck about', '30 days later']} c={C.emerald} />
      <T x={418} y={290} a="middle" s={10.5} c={C.emerald}>holds = sign-off</T>
    </F>
  )
}

/* ================================================================== */
/* fp-next · what to build next                                         */
/* ================================================================== */

function FpGate() {
  const checks = ['Reached your target amplitude', 'Held it after 24 hours', 'Still good at a later recheck']
  return (
    <F h={300} view="Decision · pass a gate before moving up" scale="schematic">
      <T x={14} y={44} s={11} c={C.text}>Your last job must pass all three:</T>
      {checks.map((c, i) => (
        <g key={c}>
          <rect x={12 + i * 128} y={60} width={118} height={62} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.emerald} strokeOpacity="0.6" />
          <Num x={26 + i * 128} y={76} n={i + 1} r={8} c={C.emerald} />
          <Note x={71 + i * 128} y={98} a="middle" lines={c.split(/(?<=target|after|a later) /)} c={C.text} s={10.5} lh={13} />
          {i < 2 && <Arrow a={[131 + i * 128, 91]} b={[139 + i * 128, 91]} c="emerald" w={1.3} />}
        </g>
      ))}
      <Arrow a={[396, 91]} b={[410, 91]} c="emerald" w={1.6} />
      {/* gate */}
      <rect x={414} y={58} width={8} height={66} fill={C.emerald} />
      <rect x={456} y={58} width={8} height={66} fill={C.emerald} />
      <T x={439} y={142} a="middle" s={11} c={C.emerald} w={600}>move up</T>
      <Arrow d="M200 124 Q200 176 160 176" c="ruby" w={1.4} />
      <T x={210} y={156} s={10.5} c={C.ruby}>any one fails</T>
      <Bx x={12} y={158} w={146} h={44} l={['Service the same', 'calibre again']} c={C.ruby} />
      <T x={14} y={228} s={10.5} c={C.dim}>Repeating the same calibre teaches more than a harder movement will.</T>
      <T x={14} y={250} s={10.5} c={C.dim}>Formal programmes work the same way, with a sign-off between modules.</T>
    </F>
  )
}

function FpMod() {
  const cx = 130
  const layer = (y, el, label, sub) => (
    <g>
      {el}
      <line x1={cx + 78} y1={y} x2={250} y2={y} stroke={C.struct} strokeWidth="0.7" strokeDasharray="2 3" />
      <T x={256} y={y + 4} s={11} c={C.text}>{label}</T>
      {sub && <T x={256} y={y + 18} s={10} c={C.faint}>{sub}</T>}
    </g>
  )
  return (
    <F h={316} view="Exploded view · an NH35 mod" scale="schematic">
      <line x1={cx} y1={34} x2={cx} y2={292} stroke={C.faint} strokeDasharray="6 3 1 3" strokeWidth="0.8" />
      {layer(46, <rect x={cx - 62} y={40} width={124} height={10} rx="3" fill="url(#fp-acr)" stroke={M.glass} />, 'crystal')}
      {layer(82, <path d={`M${cx - 76} 70 L${cx - 60} 70 L${cx - 60} 96 L${cx + 60} 96 L${cx + 60} 70 L${cx + 76} 70 L${cx + 76} 104 L${cx - 76} 104 Z`} fill="url(#fp-cut)" stroke="#4e5f6a" />, 'case of your choice', 'aftermarket: a huge range')}
      {layer(128, <g><rect x={cx - 3} y={122} width={6} height={10} fill={C.dim} /><rect x={cx - 46} y={127} width={46} height={2.4} fill={C.brassHi} /><rect x={cx} y={124} width={56} height={2} fill={C.brassHi} /></g>, 'hands')}
      {layer(160, <rect x={cx - 64} y={156} width={128} height={6} rx="1" fill={M.dial} />, 'dial')}
      {layer(204, <g><rect x={cx - 60} y={186} width={120} height={34} fill="url(#fp-mov)" stroke={C.struct} /><rect x={cx + 60} y={200} width={44} height={5} fill="url(#sk-steel)" /><rect x={cx + 104} y={194} width={12} height={18} rx="2" fill="url(#fp-knurl)" /></g>, 'Seiko NH35 and stem', 'service it first')}
      {layer(254, <path d={`M${cx - 70} 248 L${cx + 70} 248 L${cx + 70} 262 L${cx - 70} 262 Z`} fill="url(#fp-cut)" stroke="#4e5f6a" />, 'caseback')}
      <T x={14} y={300} s={10.5} c={C.dim}>Service it with the Servicing walkthrough, then build it into the parts you chose.</T>
    </F>
  )
}

function FpKit() {
  const st = ['Plan a build', 'Source a case and a 6497 or NH35', 'Fit the movement and stem', 'Case it up']
  return (
    <F h={290} view="Sequence · the Build track" scale="schematic">
      {st.map((s, i) => {
        const x = 12 + i * 116
        return (
          <g key={s}>
            <rect x={x} y={28} width={106} height={176} rx="7" fill="rgba(255,255,255,0.025)" stroke={C.line} />
            <Num x={x + 14} y={44} n={i + 1} r={8} />
            {i < 3 && <Arrow a={[x + 107, 116]} b={[x + 115, 116]} c="brass" w={1.3} />}
            <Note x={x + 53} y={176} a="middle" lines={s.length > 18 ? [s.split(' ').slice(0, 3).join(' '), s.split(' ').slice(3).join(' ')] : [s]} c={C.text} s={10.5} lh={13} />
          </g>
        )
      })}
      {/* 1 plan: a checklist */}
      <rect x={38} y={64} width={54} height={70} rx="3" fill="#e9e1c6" />
      {[0, 1, 2, 3].map((j) => (
        <g key={j}>
          <rect x={44} y={74 + j * 15} width={7} height={7} fill="none" stroke="#5a5040" />
          <line x1={56} y1={78 + j * 15} x2={86} y2={78 + j * 15} stroke="#5a5040" />
        </g>
      ))}
      {/* 2 source */}
      <circle cx={162} cy={86} r={26} fill="url(#sk-steel)" />
      <circle cx={162} cy={86} r={20} fill={C.ground} />
      <circle cx={162} cy={140} r={18} fill={M.plate} stroke={C.brass} />
      <T x={162} y={116} a="middle" s={10} c={C.faint}>+</T>
      {/* 3 fit movement and stem */}
      <circle cx={274} cy={104} r={30} fill="url(#sk-steel)" />
      <circle cx={274} cy={104} r={24} fill={M.plate} stroke={C.brass} />
      <rect x={298} y={101} width={22} height={5} fill="url(#sk-steel)" />
      <Arrow a={[316, 120]} b={[302, 120]} c="brass" w={1.4} />
      {/* 4 cased */}
      <Face cx={398} cy={104} r={32} h={305} m={60} s={150} />
      <T x={240} y={232} a="middle" s={11} c={C.text}>A watch you assembled yourself is a different kind of satisfying.</T>
      <T x={240} y={254} a="middle" s={10} c={C.faint}>Full track: Build</T>
    </F>
  )
}

function FpDeeper() {
  const Mv = ({ cx, kind }) => (
    <g>
      <circle cx={cx} cy={120} r={50} fill={M.plate} stroke={C.brass} strokeWidth="1.4" />
      {kind === 'manual' && (
        <g>
          <Wheel cx={cx - 14} cy={104} r={20} spokes={0} />
          <Balance cx={cx + 18} cy={140} r={16} />
        </g>
      )}
      {kind === 'auto' && (
        <g>
          <path d={`M${cx} 120 L${cx - 46} 104 A48 48 0 0 1 ${cx + 46} 104 Z`} fill="rgba(134,167,189,0.35)" stroke={C.steel} />
          <circle cx={cx} cy={120} r={5} fill={M.ruby} />
          <Balance cx={cx + 20} cy={146} r={13} />
        </g>
      )}
      {kind === 'chrono' && (
        <g>
          <path d={`M${cx} 120 L${cx - 46} 104 A48 48 0 0 1 ${cx + 46} 104 Z`} fill="rgba(134,167,189,0.25)" stroke={C.steel} />
          <Wheel cx={cx - 18} cy={140} r={14} spokes={0} />
          <Wheel cx={cx + 14} cy={142} r={10} spokes={0} />
          <circle cx={cx} cy={120} r={5} fill={M.ruby} />
        </g>
      )}
    </g>
  )
  return (
    <F h={300} view="Progression · going deeper into movements" scale="schematic">
      <Mv cx={80} kind="manual" />
      <Mv cx={240} kind="auto" />
      <Mv cx={400} kind="chrono" />
      <Arrow a={[136, 120]} b={[182, 120]} c="brass" w={2} />
      <Arrow a={[296, 120]} b={[342, 120]} c="brass" w={2} />
      <T x={80} y={56} a="middle" s={10} c={C.faint}>you are here</T>
      {[
        [80, '6497', 'hand-wound'],
        [240, 'ETA 2824', 'Swiss automatic'],
        [400, '7750', 'chronograph'],
      ].map(([x, a, b]) => (
        <g key={a}>
          <T x={x} y={196} a="middle" s={13} c={C.text} w={700}>{a}</T>
          <T x={x} y={212} a="middle" s={10.5} c={C.dim}>{b}</T>
        </g>
      ))}
      <T x={240} y={228} a="middle" s={10} c={C.steel}>+ self-winding rotor</T>
      <T x={400} y={228} a="middle" s={10} c={C.steel}>+ chronograph works</T>
      <T x={400} y={242} a="middle" s={10} c={C.faint}>via the Chronographs track</T>
      <T x={14} y={270} s={10.5} c={C.dim}>Use the Movement Guides to choose what to tackle next.</T>
      <T x={14} y={288} s={10.5} c={C.brassHi}>Keep logging every watch: the log is how far you’ve come.</T>
    </F>
  )
}

function FpLadder() {
  const left = ['Manual movement', 'Timing', 'Quartz', 'Automatic', 'Calendar', 'Chronograph', 'Casing, water resistance']
  const right = [
    ['Scrap pocket movement', C.dim],
    ['Cheap running ST36 or 6497', C.dim],
    ['Ronda 715, for quartz', C.dim],
    ['NH35 or 2824', C.brassHi],
    ['7750', C.brassHi],
  ]
  return (
    <F h={324} view="Ladder · the order schools use" scale="schematic">
      <Tag x={14} y={42}>Formal courses</Tag>
      <line x1={22} y1={74} x2={22} y2={250} stroke={C.struct} strokeWidth="2" />
      <line x1={206} y1={74} x2={206} y2={250} stroke={C.struct} strokeWidth="2" />
      {left.map((t, i) => {
        const y = 240 - i * 26
        return (
          <g key={t}>
            <line x1={22} y1={y} x2={206} y2={y} stroke={C.struct} strokeWidth="1.4" />
            <T x={34} y={y - 6} s={10.5} c={C.text}>{i + 1}  {t}</T>
          </g>
        )
      })}
      <Tag x={250} y={42}>Practice pieces, then this app</Tag>
      <line x1={258} y1={126} x2={258} y2={250} stroke={C.struct} strokeWidth="2" />
      <line x1={466} y1={126} x2={466} y2={250} stroke={C.struct} strokeWidth="2" />
      {right.map(([t, c], i) => {
        const y = 240 - i * 26
        return (
          <g key={t}>
            <line x1={258} y1={y} x2={466} y2={y} stroke={C.struct} strokeWidth="1.4" />
            <T x={270} y={y - 6} s={10.5} c={c}>{t}</T>
          </g>
        )
      })}
      <T x={270} y={76} s={10} c={C.faint}>grey: forum advice</T>
      <T x={270} y={90} s={10} c={C.brassHi}>brass: the app’s flagship lessons</T>
      <rect x={12} y={258} width={456} height={58} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={22} y={276} s={10.5} c={C.dim}>The forum advice is mostly from 2015 to 2017 and views on pin-lever</T>
      <T x={22} y={290} s={10.5} c={C.dim}>movements conflict, so treat it as a guide.</T>
      <T x={22} y={307} s={10.5} c={C.text}>A rung feels too hard? Drop back one and do it again.</T>
    </F>
  )
}

function FpOthers() {
  return (
    <F h={322} view="Decision · someone else’s watch" scale="schematic">
      <Bx x={12} y={30} w={220} h={46} l={['Valuable, sentimental,', 'or worn for swimming?']} c={C.brass} />
      <Arrow a={[122, 78]} b={[122, 96]} c="ruby" w={1.4} />
      <T x={130} y={92} s={10} c={C.ruby}>yes</T>
      <Bx x={12} y={98} w={220} h={46} l={['Say no', 'until you have a record of good results']} c={C.ruby} s={10.5} />
      <Arrow a={[232, 53]} b={[262, 53]} c="emerald" w={1.4} />
      <T x={238} y={46} s={10} c={C.emerald}>no</T>
      {['Photograph it', 'Test what works', 'Write down what doesn’t', 'Agree the work', 'Then open it'].map((t, i) => (
        <g key={t}>
          <Num x={278} y={53 + i * 26} n={i + 1} r={8} c={i === 4 ? C.emerald : C.brass} />
          <T x={292} y={57 + i * 26} s={11} c={C.text}>{t}</T>
        </g>
      ))}
      <rect x={12} y={166} width={220} height={120} rx="5" fill="#e9e1c6" />
      <T x={22} y={184} s={10.5} c="#3a342c" w={700}>Intake note</T>
      {['owner and date', 'photos taken', 'works:', 'doesn’t work:', 'agreed work:'].map((t, j) => (
        <g key={t}>
          <T x={22} y={204 + j * 17} s={10} c="#5a5040">{t}</T>
          <line x1={110} y1={206 + j * 17} x2={222} y2={206 + j * 17} stroke="#a89c82" />
        </g>
      ))}
      <rect x={246} y={190} width={222} height={62} rx="6" fill="rgba(194,88,99,0.10)" stroke={C.ruby} />
      <T x={256} y={210} s={11} c={C.ruby} w={600}>No water resistance promise</T>
      <T x={256} y={226} s={10.5} c={C.text}>unless you’ve pressure-tested</T>
      <T x={256} y={240} s={10.5} c={C.text}>it yourself.</T>
      <T x={246} y={272} s={10.5} c={C.dim}>If something goes wrong, your notes</T>
      <T x={246} y={286} s={10.5} c={C.dim}>show the state it arrived in.</T>
    </F>
  )
}






export const FIGS = {
  'fp-pick': FpPick,
  'fp-bench': FpBench,
  'fp-strap': FpStrap,
  'fp-strap-check': FpStrapCheck,
  'fp-loupe': FpLoupe,
  'fp-look': FpLook,
  'fp-read-seconds': FpReadSeconds,
  'fp-battery-flow': FpBatteryFlow,
  'fp-cell-test': FpCellTest,
  'fp-old-cell': FpOldCell,
  'fp-quartz-chain': FpQuartzChain,
  'fp-reseal': FpReseal,
  'fp-next-day': FpNextDay,
  'fp-pretest': FpPretest,
  'fp-remove': FpRemove,
  'fp-stem-release': FpStemRelease,
  'fp-id-quartz': FpIdQuartz,
  'fp-id-mech': FpIdMech,
  'fp-read-machine': FpReadMachine,
  'fp-stem-refit': FpStemRefit,
  'fp-module-compare': FpModuleCompare,
  'fp-module-swap': FpModuleSwap,
  'fp-hands-practice': FpHandsPractice,
  'fp-ten-fit': FpTenFit,
  'fp-hand-align': FpHandAlign,
  'fp-cased-test': FpCasedTest,
  'fp-service-map': FpServiceMap,
  'fp-scrap-strip': FpScrapStrip,
  'fp-before-reading': FpBeforeReading,
  'fp-6497': Fp6497,
  'fp-pass-targets': FpPassTargets,
  'fp-prove-log': FpProveLog,
  'fp-low-amp': FpLowAmp,
  'fp-gate': FpGate,
  'fp-mod': FpMod,
  'fp-kit': FpKit,
  'fp-deeper': FpDeeper,
  'fp-ladder': FpLadder,
  'fp-others': FpOthers,
}
