// Diagrams for "How a Watch Works" (fundamentals) and "Chronographs &
// Complications" (chrono): the energy path of a mechanical watch, automatic
// winding, quartz, the keyless works, other escapements, the fusee, sweep
// seconds, temperature, and the chronograph, calendar, GMT and repeater
// steps. Original schematics built on the strap kit. Nothing is traced from
// an ETA, Witschi or other published figure, and every number matches the
// step text.
import { C, Fig, T, Note, Dim, Arrow, Num, Verdict, Tag, Sep } from '../strap/kit.jsx'

/* ------------------------------------------------------------------ */
/* Palette and defs for this file                                       */
/* ------------------------------------------------------------------ */
const M = {
  plate: '#5b5339',
  board: '#2f4a5a',
  copper: '#c07f45',
  dial: '#d8d0bd',
  dialDark: '#25221f',
  glass: '#a9d0de',
  magnet: '#b5545f',
  oil: '#7fc4e8',
  ink: '#120f0d',
  ruby: '#c9495e',
  brassP: '#b89548',
  brassD: '#7d6430',
  steelD: '#55646e',
  quartz: '#cfe3ea',
  hot: '#d9774f',
  cold: '#6fa6d6',
  spring: '#9fb8c8',
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
      {hatch('fc-cut', '#6f808b', '#a3b3bd')}
      {hatch('fc-mov', '#433c31', '#5e5546')}
      {hatch('fc-bcut', '#7f6a33', '#c6a65c')}
      <pattern id="fc-knurl" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#a7b6bf" />
        <line x1="2" y1="0" x2="2" y2="4" stroke="#55646e" strokeWidth="1" />
      </pattern>
      <linearGradient id="fc-acr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(190,225,235,0.55)" />
        <stop offset="1" stopColor="rgba(120,170,190,0.28)" />
      </linearGradient>
      <radialGradient id="fc-cell" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#eef3f6" />
        <stop offset="0.6" stopColor="#aebcc5" />
        <stop offset="1" stopColor="#66767f" />
      </radialGradient>
      <radialGradient id="fc-gold" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#f6dc98" />
        <stop offset="0.6" stopColor="#cfa24a" />
        <stop offset="1" stopColor="#7d5f22" />
      </radialGradient>
      <radialGradient id="fc-moon" cx="0.4" cy="0.35" r="0.75">
        <stop offset="0" stopColor="#fff6d8" />
        <stop offset="1" stopColor="#d6b660" />
      </radialGradient>
      <linearGradient id="fc-temp" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={M.cold} />
        <stop offset="0.5" stopColor="#b9b2a2" />
        <stop offset="1" stopColor={M.hot} />
      </linearGradient>
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
// SVG arc path on a clock face (clock degrees, clockwise)
const arcD = (cx, cy, r, from, to) => {
  const [x1, y1] = clk(cx, cy, r, from)
  const [x2, y2] = clk(cx, cy, r, to)
  return `M${x1} ${y1} A${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`
}

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

// Side label: horizontal leader from p to a text at (x, p[1]) or (x, y)
const SLab = ({ p, x, y, text, sub, c = C.text, s = 10.5 }) => {
  const ty = y ?? p[1]
  const right = x > p[0]
  const est = Math.max(String(text).length * s * 0.53, sub ? String(sub).length * 10 * 0.53 : 0)
  // a left-hand label that would run off the frame is pinned to the left margin instead
  const pin = !right && x - est < 12
  const tx = pin ? 12 : x
  const anchor = right || pin ? 'start' : 'end'
  const lx = right ? x - 4 : pin ? 12 + est + 4 : x + 4
  return (
    <g>
      <polyline points={`${p[0]},${p[1]} ${lx},${ty}`} fill="none" stroke={C.struct} strokeWidth="0.8" opacity="0.85" />
      <circle cx={p[0]} cy={p[1]} r="2.2" fill={c} />
      <T x={tx} y={ty + 4} a={anchor} s={s} c={c}>
        {text}
      </T>
      {sub && (
        <T x={tx} y={ty + 4 + s + 2} a={anchor} s={10} c={C.faint}>
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

// A curved turning arrow round (cx, cy). from/to in clock degrees; to > from = clockwise.
function Turn({ cx, cy, r, from, to, c = 'brass', w = 1.8 }) {
  const [x1, y1] = clk(cx, cy, r, from)
  const [x2, y2] = clk(cx, cy, r, to)
  const sweep = to > from ? 1 : 0
  const large = Math.abs(to - from) > 180 ? 1 : 0
  return <Arrow d={`M${x1} ${y1} A${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`} c={c} w={w} />
}

// Arrow from box edge to box edge (straight)
const Flow = ({ a, b, c = 'brass', w = 1.5 }) => <Arrow a={a} b={b} c={c} w={w} />

/* ------------------------------------------------------------------ */
/* Watch parts                                                          */
/* ------------------------------------------------------------------ */
// Watch seen from the front. h/m/s: hand angles in clock degrees.
function Face({ cx, cy, r, h = 300, m = 60, s, crown = true, lugs = true, gold, ticks = 12, dial = M.dialDark, children }) {
  const hand = (deg, len, wdt, col) => {
    const [x, y] = clk(cx, cy, len, deg)
    return <line x1={cx} y1={cy} x2={x} y2={y} stroke={col} strokeWidth={wdt} strokeLinecap="round" />
  }
  const caseFill = gold ? 'url(#fc-gold)' : 'url(#sk-steel)'
  const light = dial !== M.dialDark
  return (
    <g>
      {lugs && [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => (
        <rect key={i} x={cx + a * r * 0.58 - r * 0.1} y={cy + b * r * 0.92 - (b < 0 ? r * 0.2 : 0)} width={r * 0.2} height={r * 0.28} rx="2.5" fill={gold ? '#b08a3c' : '#8c9aa3'} />
      ))}
      {crown && <rect x={cx + r - 1} y={cy - r * 0.13} width={r * 0.2} height={r * 0.26} rx="2" fill={gold ? '#c9a24c' : 'url(#fc-knurl)'} stroke="#55646e" strokeWidth="0.5" />}
      <circle cx={cx} cy={cy} r={r} fill={caseFill} stroke="#55646e" />
      <circle cx={cx} cy={cy} r={r * 0.86} fill={dial} stroke={C.struct} strokeWidth="0.6" />
      {Array.from({ length: ticks }, (_, i) => {
        const [a, b] = clk(cx, cy, r * 0.82, i * (360 / ticks))
        const [c2, d2] = clk(cx, cy, r * (i % 3 === 0 ? 0.68 : 0.73), i * (360 / ticks))
        return <line key={i} x1={a} y1={b} x2={c2} y2={d2} stroke={light ? '#3a342c' : C.dim} strokeWidth={i % 3 === 0 ? 1.8 : 1.1} />
      })}
      {children}
      {h !== null && hand(h, r * 0.48, Math.max(2, r * 0.07), C.brassHi)}
      {m !== null && hand(m, r * 0.72, Math.max(1.6, r * 0.045), C.brassHi)}
      {s !== undefined && hand(s, r * 0.78, 1.1, C.ruby)}
      <circle cx={cx} cy={cy} r={Math.max(2, r * 0.05)} fill={C.brassHi} />
    </g>
  )
}

// A gear wheel in plan: teeth as a dashed rim, spokes, pivot
function Wheel({ cx, cy, r, c = M.brassP, spokes = 4, teeth = true, rot = 0, jewel = true }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth={teeth ? Math.max(2, r * 0.12) : 1.4} strokeDasharray={teeth ? `${Math.max(1.2, r * 0.09)} ${Math.max(1, r * 0.07)}` : undefined} />
      <circle cx={cx} cy={cy} r={r * 0.86} fill="rgba(201,162,76,0.10)" stroke={c} strokeWidth="1" />
      {Array.from({ length: spokes }, (_, i) => {
        const [x, y] = pol(cx, cy, r * 0.84, rot + (i * 360) / spokes)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={c} strokeWidth={Math.max(1, r * 0.08)} />
      })}
      <circle cx={cx} cy={cy} r={Math.max(2, r * 0.14)} fill={jewel ? M.ruby : C.dim} stroke={C.ground} strokeWidth="0.6" />
    </g>
  )
}

// Wheel with real teeth (triangular), plan
function Gear({ cx, cy, r, n = 24, c = M.brassP, fill = 'rgba(201,162,76,0.12)', rot = 0, hub = true, depth }) {
  const d = depth || Math.max(2, r * 0.12)
  const pts = []
  for (let i = 0; i < n; i++) {
    const a = rot + (i * 360) / n
    const s = 360 / n
    pts.push(pol(cx, cy, r - d, a), pol(cx, cy, r, a + s * 0.3), pol(cx, cy, r, a + s * 0.55), pol(cx, cy, r - d, a + s * 0.85))
  }
  return (
    <g>
      <polygon points={pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')} fill={fill} stroke={c} strokeWidth="1" />
      {hub && <circle cx={cx} cy={cy} r={Math.max(2, r * 0.16)} fill={M.ruby} stroke={C.ground} strokeWidth="0.6" />}
    </g>
  )
}

// Balance wheel with hairspring, plan
function Balance({ cx, cy, r, sp = true }) {
  const pts = []
  for (let a = 0; a < 360 * 3.2; a += 12) {
    const rr = r * 0.12 + (a / (360 * 3.2)) * r * 0.48
    pts.push(pol(cx, cy, rr, a))
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={M.brassP} strokeWidth={Math.max(2.5, r * 0.13)} />
      {[0, 120, 240].map((a) => {
        const [x, y] = pol(cx, cy, r, a + 30)
        return <line key={a} x1={cx} y1={cy} x2={x} y2={y} stroke={M.brassP} strokeWidth="1.8" />
      })}
      {sp && <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={C.steel} strokeWidth="0.9" />}
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

// Mainspring barrel in plan: drum, coiled spring, arbor. wound: 0..1
function Barrel({ cx, cy, r, wound = 1, teeth = true }) {
  const turns = 5
  const inner = r * 0.22
  const outer = r * 0.86
  const pts = []
  // wound: coils packed round the arbor; let down: coils against the wall
  const lo = wound > 0.5 ? inner : outer - (outer - inner) * 0.38
  const hi = wound > 0.5 ? inner + (outer - inner) * 0.42 : outer
  for (let a = 0; a <= 360 * turns; a += 10) {
    const rr = lo + (a / (360 * turns)) * (hi - lo)
    pts.push(pol(cx, cy, rr, a))
  }
  const end = pts[pts.length - 1]
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="rgba(201,162,76,0.10)" stroke={M.brassP} strokeWidth={teeth ? Math.max(2, r * 0.08) : 1.4} strokeDasharray={teeth ? '2 1.5' : undefined} />
      <circle cx={cx} cy={cy} r={r * 0.9} fill="#2a251f" stroke={M.brassD} />
      <polyline points={pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')} fill="none" stroke={M.spring} strokeWidth="1.3" />
      {wound > 0.5 && <path d={`M${end[0]} ${end[1]} Q${cx + r * 0.7} ${cy + r * 0.5} ${pol(cx, cy, r * 0.88, 60)[0]} ${pol(cx, cy, r * 0.88, 60)[1]}`} fill="none" stroke={M.spring} strokeWidth="1.3" />}
      <circle cx={cx} cy={cy} r={inner * 0.8} fill="url(#sk-steel)" stroke={M.steelD} />
    </g>
  )
}

// Heart cam (reset) in plan; ang rotates it (deg). Lowest point toward +y when ang=0
function Heart({ cx, cy, s = 1, ang = 0, c = C.steel }) {
  const d = 'M0 18 C -8 8 -20 -2 -18 -12 C -16 -22 -4 -22 0 -12 C 4 -22 16 -22 18 -12 C 20 -2 8 8 0 18 Z'
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${ang}) scale(${s})`}>
      <path d={d} fill="url(#sk-steel)" stroke={c} strokeWidth={1 / s} />
      <circle cx="0" cy="0" r={2.4} fill={M.ruby} />
    </g>
  )
}

// Quartz tuning fork, upright, base at (x, y), tines up
function Fork({ x, y, k = 1, vib }) {
  const tine = (dx, off) => <rect x={x + (dx + off) * k} y={y - 46 * k} width={7 * k} height={36 * k} rx={1.5 * k} fill={M.quartz} stroke={C.steel} strokeWidth="0.8" />
  return (
    <g>
      {vib && (
        <g opacity="0.35">
          {tine(-11, -3)}
          {tine(4, 3)}
        </g>
      )}
      <rect x={x - 11 * k} y={y - 12 * k} width={22 * k} height={12 * k} rx={1.5 * k} fill={M.quartz} stroke={C.steel} strokeWidth="0.8" />
      {tine(-11, 0)}
      {tine(4, 0)}
      <rect x={x - 9.5 * k} y={y - 40 * k} width={2 * k} height={30 * k} fill={C.brass} opacity="0.7" />
      <rect x={x + 7.5 * k} y={y - 40 * k} width={2 * k} height={30 * k} fill={C.brass} opacity="0.7" />
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
      <rect x="-6" y={-len} width="12" height={Math.max(0, len - 30)} rx="2" fill="url(#fc-knurl)" stroke="#55646e" strokeWidth="0.6" />
    </g>
  )
}

// Chart axes: origin (x, y), width w, height h
function Axes({ x, y, w, h, xl, yl, c = C.struct }) {
  return (
    <g>
      <line x1={x} y1={y} x2={x + w} y2={y} stroke={c} strokeWidth="1" />
      <line x1={x} y1={y} x2={x} y2={y - h} stroke={c} strokeWidth="1" />
      {xl && (
        <T x={x + w} y={y + 16} a="end" s={10} c={C.faint}>
          {xl}
        </T>
      )}
      {yl && (
        <T x={x + 6} y={y - h + 4} s={10} c={C.faint}>
          {yl}
        </T>
      )}
    </g>
  )
}

/* ================================================================== */
/* fund-overview · what's inside a watch                                */
/* ================================================================== */

function FcShared() {
  return (
    <F h={318} view="Comparison · what both families share" scale="schematic">
      <Pn x={12} y={26} w={126} h={236} t="Mechanical only" tc={C.brassHi} c={C.brass} />
      <Pn x={146} y={26} w={188} h={236} t="Both" tc={C.text} c={C.text} />
      <Pn x={342} y={26} w={126} h={236} t="Quartz only" tc={C.steel} c={C.steel} />
      {/* mechanical-only items */}
      <Barrel cx={75} cy={86} r={26} />
      <T x={75} y={128} a="middle" s={10.5} c={C.text}>wound spring</T>
      <Balance cx={75} cy={180} r={24} />
      <T x={75} y={222} a="middle" s={10.5} c={C.text}>balance wheel</T>
      <T x={75} y={238} a="middle" s={10} c={C.faint}>power + oscillator</T>
      {/* quartz-only items */}
      <rect x={388} y={64} width={34} height={34} rx="17" fill="url(#fc-cell)" stroke="#4e5f6a" />
      <T x={405} y={86} a="middle" s={12} c="#2b343a" w={700}>+</T>
      <T x={405} y={128} a="middle" s={10.5} c={C.text}>battery</T>
      <Fork x={405} y={206} k={0.9} />
      <T x={405} y={222} a="middle" s={10.5} c={C.text}>quartz crystal</T>
      <T x={405} y={238} a="middle" s={10} c={C.faint}>power + oscillator</T>
      {/* shared */}
      <Gear cx={186} cy={74} r={18} n={18} />
      <Gear cx={213} cy={90} r={10} n={10} c={C.brassHi} />
      <T x={240} y={74} s={10.5} c={C.text}>gear train</T>
      <T x={240} y={88} s={10} c={C.faint}>turns the hands</T>
      <path d="M162 124 L222 124 L222 154 L162 154 Z" fill="url(#fc-cut)" stroke="#4e5f6a" />
      <rect x={168} y={118} width={48} height={6} rx="2" fill="url(#fc-acr)" stroke={M.glass} strokeWidth="0.6" />
      <rect x={168} y={130} width={48} height={16} fill="#2a251f" />
      <circle cx={166} cy={138} r={3} fill="#e08a55" />
      <circle cx={218} cy={138} r={3} fill="#e08a55" />
      <T x={240} y={134} s={10.5} c={C.text}>sealed case</T>
      <T x={240} y={148} s={10} c={C.faint}>with gaskets</T>
      <rect x={162} y={196} width={46} height={5} fill="url(#sk-steel)" />
      <rect x={208} y={190} width={13} height={17} rx="2" fill="url(#fc-knurl)" stroke={M.steelD} strokeWidth="0.5" />
      <T x={240} y={196} s={10.5} c={C.text}>crown and stem</T>
      <T x={240} y={210} s={10} c={C.faint}>wind and set</T>
      <T x={240} y={244} a="middle" s={10} c={C.faint}>learn these once</T>
      <T x={240} y={286} a="middle" s={11} c={C.dim}>Learn the shared parts once: they apply to every watch.</T>
      <T x={240} y={304} a="middle" s={10} c={C.faint}>Only the power source and the oscillator differ.</T>
    </F>
  )
}

function FcOscillator() {
  const wave = (x0, y0, w, amp, per) => {
    const p = []
    for (let x = 0; x <= w; x += 2) p.push(`${x0 + x},${(y0 - amp * Math.sin((x / per) * 2 * Math.PI)).toFixed(1)}`)
    return p.join(' ')
  }
  return (
    <F h={300} view="Chart · a steady oscillator is the reference" scale="schematic">
      <Pn x={12} y={26} w={140} h={124} t="Mechanical" />
      <Balance cx={82} cy={92} r={30} />
      <Arrow d="M50 64 A44 44 0 0 1 114 64" c="brass" w={1.4} both />
      <T x={82} y={140} a="middle" s={10.5} c={C.text}>balance wheel swings</T>
      <Pn x={12} y={160} w={140} h={124} t="Quartz" />
      <Fork x={82} y={254} k={1.15} vib />
      <T x={82} y={274} a="middle" s={10.5} c={C.text}>crystal vibrates</T>
      <Arrow a={[156, 88]} b={[184, 132]} c="brass" w={1.5} />
      <Arrow a={[156, 222]} b={[184, 168]} c="brass" w={1.5} />
      {/* waveform */}
      <Axes x={192} y={150} w={270} h={0} />
      <polyline points={wave(192, 150, 266, 34, 66.5)} fill="none" stroke={C.brassHi} strokeWidth="1.8" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={192 + i * 66.5} y1={106} x2={192 + i * 66.5} y2={194} stroke={C.faint} strokeWidth="0.7" strokeDasharray="2 3" />
      ))}
      {[0, 1, 2, 3].map((i) => (
        <Dim key={i} a={[192 + i * 66.5, 204]} b={[192 + (i + 1) * 66.5, 204]} text="equal" flip />
      ))}
      <T x={326} y={52} a="middle" s={11.5} c={C.text} w={600}>Something that repeats at a perfectly steady rate</T>
      <T x={326} y={70} a="middle" s={10.5} c={C.dim}>Each swing is one equal slice of time.</T>
      <T x={326} y={88} a="middle" s={10.5} c={C.dim}>The watch counts the slices.</T>
      <rect x={192} y={232} width={276} height={52} rx="6" fill="rgba(201,162,76,0.08)" stroke={C.brass} strokeOpacity="0.7" />
      <T x={330} y={253} a="middle" s={11} c={C.brassHi} w={600}>The craft is protecting and tuning it</T>
      <T x={330} y={271} a="middle" s={10.5} c={C.dim}>Accuracy comes from the oscillator.</T>
    </F>
  )
}

function FcFamily() {
  const x0 = 150
  const k = 228 // px per second
  const rows = [
    { y: 64, a: 'Quartz', b: '1 clean jump', n: 1, c: C.steel },
    { y: 112, a: '18,000 beats/h', b: '5 steps a second', n: 5, c: C.brass },
    { y: 160, a: '21,600 beats/h', b: '6 steps a second', n: 6, c: C.brass },
    { y: 208, a: '28,800 beats/h', b: '8 steps a second', n: 8, c: C.brass },
  ]
  return (
    <F h={330} view="Chart · counting the seconds-hand steps" scale="1 second to scale">
      <T x={x0} y={36} s={10} c={C.faint}>0 s</T>
      <T x={x0 + k} y={36} a="end" s={10} c={C.faint}>1 s</T>
      {rows.map((r) => (
        <g key={r.a}>
          <T x={14} y={r.y - 2} s={11.5} c={C.text} w={600}>{r.a}</T>
          <T x={14} y={r.y + 12} s={10.5} c={C.dim}>{r.b}</T>
          {/* staircase of hand position over 1 s */}
          <polyline
            points={(() => {
              const p = [`${x0},${r.y + 12}`]
              for (let i = 1; i <= r.n; i++) {
                const xs = x0 + (i * k) / r.n
                const yPrev = r.y + 12 - ((i - 1) / r.n) * 22
                const yNew = r.y + 12 - (i / r.n) * 22
                p.push(`${xs},${yPrev}`, `${xs},${yNew}`)
              }
              return p.join(' ')
            })()}
            fill="none"
            stroke={r.c}
            strokeWidth="1.8"
          />
          <line x1={x0} y1={r.y + 12} x2={x0 + k} y2={r.y + 12} stroke={C.line} strokeWidth="0.8" />
          <T x={x0 + k + 10} y={r.y + 6} s={11} c={r.c} w={600}>{r.n === 1 ? 'quartz' : 'mechanical'}</T>
        </g>
      ))}
      <T x={x0 + k / 2} y={236} a="middle" s={10} c={C.faint}>hand position through one second</T>
      <Sep x1={12} y1={246} x2={468} y2={246} />
      <Num x={22} y={264} n={1} r={7} />
      <T x={34} y={268} s={10.5} c={C.text}>Film the hand in slow motion to count the steps.</T>
      <Num x={22} y={286} n={2} r={7} />
      <T x={34} y={290} s={10.5} c={C.text}>Judge the running seconds, not a chronograph hand:</T>
      <T x={34} y={304} s={10.5} c={C.dim}>a quartz chronograph can have a fast sweep too.</T>
      <rect x={326} y={256} width={142} height={60} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} strokeOpacity="0.7" />
      <T x={397} y={274} a="middle" s={10.5} c={C.ruby} w={600}>Moves every 2 or 4 s?</T>
      <T x={397} y={290} a="middle" s={10} c={C.dim}>battery or solar watch:</T>
      <T x={397} y={304} a="middle" s={10} c={C.dim}>a low-power warning</T>
    </F>
  )
}

/* ================================================================== */
/* fund-mechanical · how a mechanical watch keeps time                  */
/* ================================================================== */

function FcMainspring() {
  return (
    <F h={304} view="Plan · the barrel, let down and wound" scale="schematic, cover removed">
      <Pn x={12} y={26} w={186} h={200} t="Let down" />
      <Barrel cx={105} cy={124} r={66} wound={0} />
      <T x={105} y={212} a="middle" s={10.5} c={C.dim}>coils lie against the wall</T>
      <Pn x={210} y={26} w={186} h={200} t="Fully wound" c={C.brass} />
      <Barrel cx={303} cy={124} r={66} wound={1} />
      <Turn cx={303} cy={124} r={22} from={200} to={320} c="brass" w={1.8} />
      <T x={303} y={212} a="middle" s={10.5} c={C.brassHi}>coiled tight round the arbor</T>
      <Lab p={[322, 104]} x={436} y={66} text="mainspring" sub="a flat spring" />
      <SLab p={[308, 124]} x={410} y={124} text="arbor" />
      <Lab p={[368, 160]} x={436} y={176} text="barrel" sub="toothed drum" />
      <Arrow a={[200, 124]} b={[212, 124]} c="brass" w={1.6} />
      <T x={205} y={114} a="middle" s={10} c={C.brassHi}>wind</T>
      {/* reserve bar */}
      <Tag x={14} y={248}>Energy stored by a full wind</Tag>
      <rect x={14} y={258} width={454} height={18} rx="3" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <rect x={14} y={258} width={454 * (40 / 70)} height={18} rx="3" fill="rgba(201,162,76,0.35)" />
      <rect x={14 + 454 * (40 / 70)} y={258} width={454 * (30 / 70)} height={18} fill="rgba(201,162,76,0.15)" />
      <T x={14 + 454 * (40 / 70) - 6} y={271} a="end" s={10.5} c={C.text} mono>40 h</T>
      <T x={462} y={271} a="end" s={10.5} c={C.text} mono>70 h</T>
      <T x={240} y={294} a="middle" s={10.5} c={C.dim}>The fuel tank: roughly 40–70 hours of running.</T>
    </F>
  )
}

function FcLoop() {
  const nodes = [
    { x: 30, y: 52, l: ['Mainspring', 'pushes'], c: C.brass },
    { x: 260, y: 52, l: ['Going train', 'carries power'], c: C.brass },
    { x: 260, y: 196, l: ['Escapement', 'releases one step'], c: C.steel },
    { x: 30, y: 196, l: ['Balance', 'steady rhythm'], c: C.emerald },
  ]
  return (
    <F h={316} view="Sequence · the self-sustaining loop" scale="schematic">
      {nodes.map((n, i) => (
        <g key={i}>
          <Bx x={n.x} y={n.y} w={190} h={56} l={n.l} c={n.c} />
          <Num x={n.x + 14} y={n.y + 14} n={i + 1} r={8} c={n.c} />
        </g>
      ))}
      <Arrow a={[222, 80]} b={[256, 80]} c="brass" w={2} />
      <Arrow a={[355, 110]} b={[355, 192]} c="brass" w={2} />
      <T x={364} y={156} s={10.5} c={C.brassHi}>pushes</T>
      {/* escapement → balance: impulse; balance → escapement: unlock */}
      <Arrow a={[256, 216]} b={[224, 216]} c="brass" w={2} />
      <T x={240} y={208} a="middle" s={10} c={C.brassHi}>nudge</T>
      <Arrow a={[224, 236]} b={[256, 236]} c="emerald" w={2} />
      <T x={240} y={252} a="middle" s={10} c={C.emerald}>unlock</T>
      {/* centre explanation */}
      <T x={240} y={138} a="middle" s={11} c={C.text} w={600}>Every beat:</T>
      <T x={240} y={154} a="middle" s={10.5} c={C.dim}>escapement feeds the balance a nudge,</T>
      <T x={240} y={168} a="middle" s={10.5} c={C.dim}>balance lets exactly one step through</T>
      <rect x={30} y={268} width={420} height={36} rx="6" fill="rgba(201,162,76,0.08)" stroke={C.brass} strokeOpacity="0.7" />
      <T x={240} y={291} a="middle" s={11} c={C.brassHi} w={600}>The single most important idea in watchmaking</T>
    </F>
  )
}

function FcEnergy() {
  // waterfall: energy reaching each link, schematic heights
  const steps = [
    ['mainspring', 150],
    ['centre', 136],
    ['third', 124],
    ['fourth', 112],
    ['escapement', 96],
    ['balance', 84],
  ]
  const x0 = 26
  const bw = 46
  const gap = 12
  const base = 214
  return (
    <F h={330} view="Chart · energy lost along the chain" scale="schematic, no values">
      <Axes x={x0 - 8} y={base} w={6 * (bw + gap) + 8} h={170} yl="energy" />
      {steps.map(([n, v], i) => {
        const x = x0 + i * (bw + gap)
        return (
          <g key={n}>
            <rect x={x} y={base - v} width={bw} height={v} fill={i === 5 ? 'rgba(123,165,131,0.45)' : 'rgba(201,162,76,0.38)'} stroke={i === 5 ? C.emerald : C.brass} />
            {i > 0 && <rect x={x} y={base - steps[i - 1][1]} width={bw} height={steps[i - 1][1] - v} fill="url(#sk-noglue)" stroke={C.ruby} strokeWidth="0.6" />}
            <T x={x + bw / 2} y={base + 14} a="middle" s={10} c={C.dim}>{n}</T>
          </g>
        )
      })}
      <T x={x0 + 5 * (bw + gap) + bw / 2} y={base - 40} a="middle" s={10} c={C.text}>amplitude</T>
      <Lab p={[x0 + 2 * (bw + gap) + bw / 2, base - 130]} x={150} y={52} text="friction takes its share" c={C.ruby} up />
      {/* causes */}
      <Pn x={372} y={26} w={96} h={190} t="Causes" tc={C.ruby} />
      <Note x={382} y={60} lines={['a dry pivot', '', 'an over-tight', 'bridge', '', 'too much oil']} c={C.text} s={10.5} lh={14} />
      <T x={382} y={170} s={10} c={C.faint}>all show as a</T>
      <T x={382} y={184} s={10} c={C.faint}>smaller swing</T>
      <T x={382} y={198} s={10} c={C.faint}>at the balance</T>
      {/* see it yourself */}
      <Sep x1={12} y1={236} x2={468} y2={236} />
      <Tag x={14} y={254}>See it yourself</Tag>
      {[
        [50, 'just after a full wind', 150, C.emerald],
        [262, 'near the end of the reserve', 80, C.brass],
      ].map(([cx, l, sw, c]) => (
        <g key={l}>
          <Balance cx={cx} cy={286} r={16} sp={false} />
          <Arrow d={arcD(cx, 286, 26, -sw / 2, sw / 2)} c={c === C.emerald ? 'emerald' : 'brass'} w={1.6} both />
          <T x={cx + 34} y={290} s={10.5} c={C.text}>{l}</T>
        </g>
      ))}
      <T x={240} y={322} a="middle" s={10} c={C.dim}>The swing shrinks as the spring’s push fades.</T>
    </F>
  )
}

/* ================================================================== */
/* fund-automatic · how automatic winding works                         */
/* ================================================================== */

function FcReverser() {
  // rotor pinion drives two reversing wheels; each has a one-way click
  const Panel = ({ x, dir, t }) => {
    const cw = dir > 0
    return (
      <g>
        <Pn x={x} y={26} w={222} h={210} t={t} />
        {/* rotor sector */}
        <path d={`M${x + 111} 116 L${x + 68} 86 A52 52 0 0 1 ${x + 154} 86 Z`} fill="rgba(134,167,189,0.25)" stroke={C.steel} />
        <circle cx={x + 111} cy={116} r={6} fill={M.ruby} />
        <Arrow d={cw ? `M${x + 72} 66 A58 58 0 0 1 ${x + 150} 66` : `M${x + 150} 66 A58 58 0 0 0 ${x + 72} 66`} c="steel" w={1.8} />
        <Arrow a={[x + 104, 126]} b={[x + 88, 136]} c="brass" w={1.2} />
        <Arrow a={[x + 118, 126]} b={[x + 134, 136]} c="brass" w={1.2} />
        {/* reversing wheels */}
        <Gear cx={x + 78} cy={150} r={20} n={20} c={cw ? C.brassHi : C.faint} fill={cw ? 'rgba(201,162,76,0.25)' : 'rgba(255,255,255,0.03)'} />
        <Gear cx={x + 144} cy={150} r={20} n={20} c={cw ? C.faint : C.brassHi} fill={cw ? 'rgba(255,255,255,0.03)' : 'rgba(201,162,76,0.25)'} />
        <T x={x + 78} y={184} a="middle" s={10} c={cw ? C.brassHi : C.faint}>{cw ? 'drives' : 'freewheels'}</T>
        <T x={x + 144} y={184} a="middle" s={10} c={cw ? C.faint : C.brassHi}>{cw ? 'freewheels' : 'drives'}</T>
        {/* output */}
        <Gear cx={x + 111} cy={214} r={13} n={14} />
        <Arrow d={`M${x + 128} 206 A18 18 0 0 1 ${x + 128} 222`} c="emerald" w={1.6} />
        <T x={x + 150} y={218} s={10} c={C.emerald}>one way</T>
      </g>
    )
  }
  return (
    <F h={300} view="Schematic · the reversing-wheel cluster" scale="schematic">
      <Panel x={12} dir={1} t="Rotor turns clockwise" />
      <Panel x={246} dir={-1} t="Rotor turns anticlockwise" />
      <T x={240} y={262} a="middle" s={11} c={C.text}>Each reversing wheel has a one-way click: it drives in one direction and slips in the other.</T>
      <T x={240} y={282} a="middle" s={10.5} c={C.emerald}>Both rotor directions end as one-way winding of the mainspring.</T>
    </F>
  )
}

function FcWindSystems() {
  return (
    <F h={316} view="Comparison · three ways to wind from the rotor" scale="schematic">
      <Pn x={12} y={26} w={148} h={210} t="Reversing wheels" />
      <Gear cx={56} cy={100} r={22} n={20} />
      <Gear cx={116} cy={100} r={22} n={20} />
      <Gear cx={86} cy={150} r={14} n={14} c={C.brassHi} />
      <T x={86} y={190} a="middle" s={11} c={C.text} w={600}>ETA 2824-2</T>
      <T x={86} y={206} a="middle" s={10} c={C.dim}>both rotor directions</T>
      <T x={86} y={220} a="middle" s={10} c={C.dim}>wind</T>

      <Pn x={166} y={26} w={148} h={210} t="Magic Lever" />
      <Gear cx={240} cy={150} r={26} n={30} />
      <circle cx={240} cy={76} r={10} fill="none" stroke={C.steel} strokeWidth="1.4" />
      <circle cx={244} cy={76} r={3} fill={M.ruby} />
      <path d="M244 76 L222 124 M244 76 L262 124" stroke={C.steel} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M222 124 l-4 6 M262 124 l4 6" stroke={C.steel} strokeWidth="2.4" strokeLinecap="round" />
      <Lab p={[232, 70]} x={196} y={56} text="eccentric" up />
      <Lab p={[262, 122]} x={296} y={100} text="pawl" up />
      <T x={240} y={190} a="middle" s={11} c={C.text} w={600}>Seiko NH35</T>
      <T x={240} y={206} a="middle" s={10} c={C.dim}>a lever with two pawls</T>
      <T x={240} y={220} a="middle" s={10} c={C.dim}>pulls the wheel round</T>

      <Pn x={320} y={26} w={148} h={210} t="One direction" />
      <g transform="translate(0 14)">
        <path d="M394 100 L346 72 A56 56 0 0 1 442 72 Z" fill="rgba(134,167,189,0.25)" stroke={C.steel} />
        <circle cx={394} cy={100} r={5} fill={M.ruby} />
        <Arrow d="M352 58 A60 60 0 0 1 436 58" c="emerald" w={1.6} />
        <Arrow d="M436 112 A60 60 0 0 1 352 112" c="ruby" w={1.4} dash="4 3" />
        <T x={394} y={138} a="middle" s={10} c={C.ruby}>slips this way</T>
      </g>
      <T x={394} y={190} a="middle" s={11} c={C.text} w={600}>Valjoux 7750</T>
      <T x={394} y={206} a="middle" s={10} c={C.dim}>winds in one rotor</T>
      <T x={394} y={220} a="middle" s={10} c={C.dim}>direction only</T>

      <rect x={12} y={248} width={456} height={58} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} strokeOpacity="0.7" />
      <T x={24} y={267} s={11} c={C.ruby} w={600}>Find out which yours uses before you strip it: the service differs.</T>
      <T x={24} y={284} s={10.5} c={C.dim}>ETA 2824-2: never wash the reversing wheels. Replace them, if needed,</T>
      <T x={24} y={298} s={10.5} c={C.dim}>with pre-lubricated originals.</T>
    </F>
  )
}

function FcBridle() {
  return (
    <F h={300} view="Plan · no over-winding" scale="schematic, cover removed">
      <Pn x={12} y={26} w={220} h={200} t="Hand-wound barrel" />
      <circle cx={122} cy={126} r={70} fill="#2a251f" stroke={M.brassP} strokeWidth="3" />
      <polyline
        points={Array.from({ length: 150 }, (_, i) => pol(122, 126, 14 + i * 0.29, i * 12).map((v) => v.toFixed(1)).join(',')).join(' ')}
        fill="none"
        stroke={M.spring}
        strokeWidth="1.3"
      />
      <circle cx={122} cy={126} r={11} fill="url(#sk-steel)" />
      <rect x={185} y={120} width={6} height={10} fill={C.brassHi} />
      <Lab p={[188, 125]} x={160} y={52} text="end fixed to the barrel" up />
      <T x={122} y={212} a="middle" s={10.5} c={C.text}>fully wound: the crown stops</T>

      <Pn x={248} y={26} w={220} h={200} t="Automatic barrel" c={C.brass} />
      <circle cx={358} cy={126} r={70} fill="#2a251f" stroke={M.brassP} strokeWidth="3" />
      <polyline
        points={Array.from({ length: 138 }, (_, i) => pol(358, 126, 14 + i * 0.29, i * 12).map((v) => v.toFixed(1)).join(',')).join(' ')}
        fill="none"
        stroke={M.spring}
        strokeWidth="1.3"
      />
      <circle cx={358} cy={126} r={11} fill="url(#sk-steel)" />
      {/* bridle: an extra arc pressing on the wall */}
      <path d={arcD(358, 126, 64, 40, 150)} fill="none" stroke={C.steel} strokeWidth="3.4" />
      <Arrow d={arcD(358, 126, 78, 50, 130)} c="brass" w={1.8} />
      <Lab p={[...clk(358, 126, 64, 120)]} x={432} y={200} text="bridle" c={C.brassHi} up />
      <T x={358} y={56} a="middle" s={10.5} c={C.brassHi}>slips round inside</T>
      <T x={358} y={212} a="middle" s={10.5} c={C.text}>fully wound: it slips, no harm</T>

      <T x={14} y={262} s={11} c={C.text}>Once fully wound, an automatic mainspring slips inside the barrel,</T>
      <T x={14} y={278} s={11} c={C.text}>so wearing it can never wind it too far.</T>
      <T x={14} y={294} s={10} c={C.faint}>Worn only now and then? A few hand winds first tops up the reserve.</T>
    </F>
  )
}

function FcHandWind() {
  return (
    <F h={322} view="Decision · does the crown wind it?" scale="schematic">
      {/* crown, pushed in, turned forward */}
      <rect x={20} y={52} width={78} height={60} rx="10" fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={98} y={78} width={18} height={8} fill="url(#sk-steel)" />
      <rect x={116} y={66} width={20} height={32} rx="3" fill="url(#fc-knurl)" stroke={M.steelD} />
      <Arrow d="M144 98 Q156 82 144 66" c="brass" w={1.8} />
      <T x={78} y={134} a="middle" s={10.5} c={C.text}>crown pushed in,</T>
      <T x={78} y={148} a="middle" s={10.5} c={C.text}>turn gently forward</T>
      <Arrow a={[164, 82]} b={[196, 82]} c="brass" w={1.5} />
      <Bx x={200} y={60} w={118} h={44} l={['Feel winding', 'clicks?']} c={C.brass} />
      <Arrow a={[318, 70]} b={[344, 54]} c="emerald" w={1.5} />
      <Arrow a={[318, 94]} b={[344, 112]} c="ruby" w={1.5} />
      <Bx x={348} y={30} w={120} h={44} l={['Yes', 'it hand-winds']} c={C.emerald} />
      <Bx x={348} y={92} w={120} h={58} l={['Nothing', 'check the calibre', 'guide first']} c={C.ruby} />
      {/* no-wind calibres */}
      <Pn x={12} y={168} w={230} h={86} t="Design, not a fault" tc={C.emerald} />
      <T x={24} y={206} s={11} c={C.text} w={600}>Seiko 7S26 · 7009 · 6309</T>
      <T x={24} y={222} s={10.5} c={C.dim}>don’t hand-wind,</T>
      <T x={24} y={238} s={10.5} c={C.dim}>and none of them hacks</T>
      {/* turns bar */}
      <Pn x={250} y={168} w={218} h={86} t="A full hand wind" />
      <rect x={262} y={200} width={194} height={14} rx="3" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <rect x={262} y={200} width={194} height={14} rx="3" fill="rgba(201,162,76,0.30)" />
      <rect x={262} y={200} width={24} height={14} rx="3" fill={C.brass} />
      <T x={274} y={232} a="middle" s={10} c={C.brassHi}>a few</T>
      <T x={456} y={232} a="end" s={10.5} c={C.text} mono>about 40 turns</T>
      <T x={262} y={246} s={10} c={C.faint}>Miyota 9075: a few turns is only a top-up</T>
      <T x={240} y={284} a="middle" s={11} c={C.text}>The tip about topping up assumes your crown winds the spring.</T>
      <T x={240} y={302} a="middle" s={10.5} c={C.dim}>Many automatics do. Check before you suspect a problem.</T>
    </F>
  )
}

function FcAutoTrain() {
  const chain = [
    { x: 40, l: 'rotor', sub: 'swings both ways' },
    { x: 124, l: 'reduction', sub: 'wheels' },
    { x: 208, l: 'reversing', sub: 'wheels' },
    { x: 292, l: 'ratchet', sub: 'wheel' },
    { x: 380, l: 'mainspring', sub: 'in the barrel' },
  ]
  return (
    <F h={290} view="Schematic · the automatic winding train" scale="schematic">
      {/* rotor */}
      <path d="M60 150 L14 120 A54 54 0 0 1 106 120 Z" fill="rgba(134,167,189,0.28)" stroke={C.steel} />
      <circle cx={60} cy={150} r={5} fill={M.ruby} />
      <Arrow d="M20 102 A60 60 0 0 1 100 102" c="steel" w={1.5} both />
      <Gear cx={60} cy={150} r={9} n={10} c={C.steel} />
      {/* reduction wheels */}
      <Gear cx={124} cy={160} r={26} n={28} />
      <Gear cx={124} cy={160} r={8} n={9} c={C.brassHi} />
      {/* reversing wheels */}
      <Gear cx={196} cy={140} r={20} n={22} />
      <Gear cx={220} cy={182} r={20} n={22} />
      {/* ratchet */}
      <Gear cx={300} cy={160} r={34} n={36} c={C.steel} fill="rgba(134,167,189,0.14)" />
      {/* barrel */}
      <Barrel cx={398} cy={160} r={48} wound={1} />
      <Arrow a={[72, 166]} b={[94, 172]} c="brass" w={1.3} />
      <Arrow a={[152, 160]} b={[174, 152]} c="brass" w={1.3} />
      <Arrow a={[242, 170]} b={[264, 166]} c="brass" w={1.3} />
      <Arrow d="M300 104 Q350 92 384 108" c="emerald" w={1.6} />
      <T x={340} y={90} a="middle" s={10} c={C.emerald}>one way only</T>
      {chain.map((c, i) => (
        <g key={c.l}>
          <Num x={c.x + 20} y={230} n={i + 1} r={8} />
          <T x={c.x + 20} y={254} a="middle" s={10.5} c={C.text}>{c.l}</T>
          <T x={c.x + 20} y={268} a="middle" s={10} c={C.faint}>{c.sub}</T>
        </g>
      ))}
      <T x={240} y={46} a="middle" s={11} c={C.text}>Open the “Automatic winding” diagram in the Anatomy Explorer</T>
      <T x={240} y={62} a="middle" s={10.5} c={C.dim}>to watch this chain move.</T>
    </F>
  )
}

function FcReserveTest() {
  return (
    <F h={330} view="Sequence · testing the winding" scale="schematic">
      <Num x={22} y={42} n={1} r={8} />
      <T x={36} y={46} s={11} c={C.text}>Wind fully by hand (if it can), or wear it a full day</T>
      <Num x={22} y={66} n={2} r={8} />
      <T x={36} y={70} s={11} c={C.text}>Lay it still and note when it stops</T>
      {/* timeline */}
      <line x1={36} y1={104} x2={456} y2={104} stroke={C.struct} strokeWidth="1" />
      <rect x={36} y={96} width={336} height={16} rx="3" fill="rgba(123,165,131,0.35)" stroke={C.emerald} />
      <T x={204} y={108} a="middle" s={10.5} c={C.text}>running</T>
      <line x1={372} y1={88} x2={372} y2={120} stroke={C.emerald} strokeWidth="1.6" />
      <T x={372} y={84} a="middle" s={10.5} c={C.emerald}>NH35: about 41 h</T>
      <rect x={36} y={122} width={170} height={10} rx="2" fill="rgba(194,88,99,0.35)" stroke={C.ruby} />
      <T x={214} y={131} s={10.5} c={C.ruby}>much less, worn daily? suspect the winding</T>
      <Num x={22} y={156} n={3} r={8} />
      <T x={36} y={160} s={11} c={C.text}>Narrow it down</T>
      {[
        ['The click holds when you hand-wind', 'automatic gears', 182],
        ['Rotor spins freely, stem feels stiff', 'seized reversers', 216],
        ['Rotor scrapes', 'worn bearing or bent rotor', 250],
      ].map(([a, b, y]) => (
        <g key={a}>
          <rect x={36} y={y - 13} width={230} height={26} rx="5" fill="rgba(255,255,255,0.03)" stroke={C.line} />
          <T x={46} y={y + 4} s={10.5} c={C.text}>{a}</T>
          <Arrow a={[268, y]} b={[296, y]} c="brass" w={1.4} />
          <T x={302} y={y + 4} s={10.5} c={C.brassHi}>{b}</T>
        </g>
      ))}
      <rect x={12} y={274} width={456} height={46} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={292} s={10.5} c={C.dim}>Forum tests. Reports on ETA, Rolex and Miyota share one theme:</T>
      <T x={24} y={308} s={10.5} c={C.dim}>the reverser or winding train wears first when lubrication is neglected.</T>
    </F>
  )
}

/* ================================================================== */
/* fund-quartz · how a quartz watch works                               */
/* ================================================================== */

function FcQuartzFork() {
  return (
    <F h={310} view="Detail · the quartz crystal" scale="schematic, magnified">
      {/* module, with the capsule */}
      <circle cx={92} cy={150} r={70} fill={M.plate} stroke={C.brass} strokeWidth="1.4" />
      <path d="M40 120 A60 60 0 0 1 140 100 L110 140 L70 170 Z" fill={M.board} stroke={C.steel} />
      <circle cx={112} cy={184} r={26} fill="url(#fc-cell)" stroke="#4e5f6a" />
      <g transform="translate(64 112) rotate(-30)">
        <rect x={-6} y={-20} width={12} height={40} rx="6" fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.6" />
      </g>
      <circle cx={64} cy={112} r={13} fill="none" stroke={C.brass} strokeWidth="1.4" />
      <line x1={76} y1={106} x2={196} y2={56} stroke={C.brass} strokeWidth="0.8" opacity="0.7" />
      <line x1={70} y1={124} x2={196} y2={246} stroke={C.brass} strokeWidth="0.8" opacity="0.7" />
      <T x={92} y={240} a="middle" s={10.5} c={C.dim}>quartz module</T>
      <T x={92} y={254} a="middle" s={10} c={C.faint}>the capsule is this small</T>
      {/* magnified capsule, opened */}
      <Ring x={290} y={150} r={98} />
      <rect x={244} y={74} width={92} height={132} rx="40" fill="rgba(170,190,200,0.10)" stroke={C.steel} strokeDasharray="4 3" />
      <Fork x={290} y={208} k={2.3} vib />
      <line x1={278} y1={208} x2={278} y2={234} stroke={C.dim} strokeWidth="1.4" />
      <line x1={302} y1={208} x2={302} y2={234} stroke={C.dim} strokeWidth="1.4" />
      <Arrow a={[248, 120]} b={[236, 120]} c="brass" w={1.5} />
      <Arrow a={[332, 120]} b={[344, 120]} c="brass" w={1.5} />
      <Lab p={[270, 110]} x={420} y={66} text="tuning-fork tines" up />
      <SLab p={[297, 178]} x={404} y={178} text="electrodes" />
      <SLab p={[302, 228]} x={404} y={226} text="leads to" sub="the circuit" />
      <SLab p={[334, 96]} x={404} y={110} text="sealed can" />
      <rect x={12} y={264} width={456} height={38} rx="6" fill="rgba(201,162,76,0.08)" stroke={C.brass} strokeOpacity="0.7" />
      <T x={240} y={288} a="middle" s={12} c={C.brassHi} w={600}>Powered, it vibrates exactly 32,768 times a second</T>
    </F>
  )
}

function FcDivider() {
  const vals = ['32,768', '16,384', '8,192', '4,096', '2,048', '1,024', '512', '256', '128', '64', '32', '16', '8', '4', '2', '1']
  const sq = (x0, y0, w, n, h) => {
    const p = [`${x0},${y0}`]
    const step = w / (2 * n)
    for (let i = 0; i < 2 * n; i++) {
      const yy = i % 2 === 0 ? y0 - h : y0
      p.push(`${x0 + i * step},${yy}`, `${x0 + (i + 1) * step},${yy}`)
    }
    return p.join(' ')
  }
  return (
    <F h={322} view="Sequence · the circuit counts and divides" scale="schematic">
      <Fork x={40} y={104} k={1.1} vib />
      <T x={40} y={122} a="middle" s={10.5} c={C.text}>crystal</T>
      <Arrow a={[64, 80]} b={[88, 80]} c="brass" w={1.5} />
      {/* IC */}
      <rect x={92} y={40} width={276} height={174} rx="6" fill="#1e1c1b" stroke={C.dim} />
      <T x={230} y={58} a="middle" s={10.5} c={C.dim}>integrated circuit: halve, and halve again</T>
      {vals.map((v, i) => {
        const col = i % 4
        const row = Math.floor(i / 4)
        const x = 104 + col * 66
        const y = 72 + row * 31
        const last = i === vals.length - 1
        return (
          <g key={v}>
            <rect x={x} y={y} width={54} height={22} rx="3" fill={last ? 'rgba(123,165,131,0.25)' : 'rgba(255,255,255,0.04)'} stroke={last ? C.emerald : C.line} />
            <T x={x + 27} y={y + 15} a="middle" s={10.5} c={last ? C.emerald : C.text} mono>{v}</T>
            {!last && col < 3 && <T x={x + 60} y={y + 15} a="middle" s={10} c={C.faint}>›</T>}
          </g>
        )
      })}
      <T x={230} y={206} a="middle" s={10} c={C.faint}>vibrations a second at each stage (÷2, fifteen times)</T>
      <Arrow a={[368, 172]} b={[396, 172]} c="emerald" w={1.5} />
      <Bx x={398} y={146} w={70} h={52} l={['1 pulse', 'per second']} c={C.emerald} s={10.5} />
      {/* waveforms */}
      <Tag x={14} y={252}>In</Tag>
      <polyline points={sq(60, 256, 400, 40, 12)} fill="none" stroke={C.brass} strokeWidth="1" />
      <T x={466} y={234} a="end" s={10} c={C.faint}>too fast to draw: 32,768 a second</T>
      <Tag x={14} y={284}>Out</Tag>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={60 + i * 133} y={272} width={10} height={14} fill={C.emerald} />
      ))}
      <line x1={60} y1={286} x2={460} y2={286} stroke={C.emerald} strokeWidth="1" />
      {[0, 1, 2].map((i) => (
        <Dim key={i} a={[60 + i * 133, 300]} b={[60 + (i + 1) * 133, 300]} text="1 s" flip />
      ))}
    </F>
  )
}

function FcCellLife() {
  const lo = 0.3
  const hi = 2
  const x0 = 40
  const w = 400
  const px = (v) => x0 + ((v - lo) / (hi - lo)) * w
  return (
    <F h={322} view="Chart · estimating cell life" scale="schematic">
      <Tag x={14} y={42}>Published draw of quartz movements</Tag>
      <rect x={x0} y={54} width={w} height={16} rx="3" fill="rgba(134,167,189,0.25)" stroke={C.steel} />
      <T x={x0} y={88} a="middle" s={10.5} c={C.text} mono>0.3 µA</T>
      <T x={x0 + w} y={88} a="middle" s={10.5} c={C.text} mono>2 µA</T>
      <line x1={px(1.35)} y1={48} x2={px(1.35)} y2={76} stroke={C.brassHi} strokeWidth="2" />
      <T x={px(1.35)} y={88} a="middle" s={10.5} c={C.brassHi} mono>1.35 µA</T>
      {/* formula */}
      <rect x={12} y={104} width={456} height={46} rx="6" fill="rgba(201,162,76,0.08)" stroke={C.brass} strokeOpacity="0.7" />
      <T x={240} y={132} a="middle" s={13} c={C.brassHi} mono>months ≈ mAh × 1000 ÷ µA ÷ 730</T>
      {/* worked example */}
      <Tag x={14} y={172}>Worked example</Tag>
      <rect x={20} y={184} width={40} height={40} rx="20" fill="url(#fc-cell)" stroke="#4e5f6a" />
      <T x={40} y={208} a="middle" s={10} c="#2b343a" w={700}>55</T>
      <T x={40} y={240} a="middle" s={10} c={C.dim}>mAh cell</T>
      <T x={76} y={200} s={11.5} c={C.text} mono>55 × 1000 ÷ 1.35 ÷ 730</T>
      <T x={76} y={220} s={11.5} c={C.emerald} mono>≈ 56 months</T>
      <T x={300} y={200} s={10.5} c={C.dim}>ISA quotes 57 months</T>
      <T x={300} y={216} s={10.5} c={C.dim}>for that pairing</T>
      <rect x={12} y={252} width={456} height={60} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} strokeOpacity="0.7" />
      <T x={24} y={272} s={11} c={C.ruby} w={600}>Cell dies far sooner than the sum says?</T>
      <T x={24} y={288} s={10.5} c={C.dim}>Suspect a load, such as dirt in the gears or a chronograph</T>
      <T x={24} y={302} s={10.5} c={C.dim}>left running, not just a bad cell. Try it with your own sheet.</T>
    </F>
  )
}

function FcQuartzSimple() {
  return (
    <F h={290} view="Comparison · why quartz repairs are simple" scale="schematic">
      <Pn x={12} y={26} w={220} h={168} t="Mechanical" />
      <Barrel cx={70} cy={100} r={30} />
      <T x={70} y={146} a="middle" s={10.5} c={C.text}>mainspring</T>
      <Balance cx={170} cy={100} r={28} />
      <T x={170} y={146} a="middle" s={10.5} c={C.text}>balance</T>
      <T x={122} y={176} a="middle" s={10} c={C.faint}>the parts that need the most skill</T>
      <Pn x={248} y={26} w={220} h={168} t="Quartz" c={C.steel} />
      {[[306, 100], [410, 100]].map(([x, y]) => (
        <g key={x} opacity="0.5">
          <circle cx={x} cy={y} r={28} fill="none" stroke={C.faint} strokeDasharray="3 3" />
          <path d={`M${x - 18} ${y - 18} L${x + 18} ${y + 18} M${x + 18} ${y - 18} L${x - 18} ${y + 18}`} stroke={C.ruby} strokeWidth="2" />
        </g>
      ))}
      <T x={306} y={146} a="middle" s={10.5} c={C.dim}>no mainspring</T>
      <T x={410} y={146} a="middle" s={10.5} c={C.dim}>no balance</T>
      <Tag x={14} y={218}>So most quartz faults are one of two</Tag>
      <Bx x={12} y={228} w={150} h={48} l={['Flat battery', 'change the cell']} c={C.emerald} />
      <Bx x={174} y={228} w={150} h={48} l={['Failed module', 'fit a new one']} c={C.emerald} />
      <Note x={338} y={244} lines={['quick, low-cost fixes:', 'Quartz Repair track']} c={C.dim} s={10.5} lh={14} />
    </F>
  )
}

function FcQuartzTrain() {
  return (
    <F h={330} view="Plan · a quartz movement still has gears" scale="schematic">
      {/* coil, stator, rotor, train */}
      <rect x={24} y={60} width={92} height={22} rx="3" fill={M.copper} stroke="#7d4d24" />
      {Array.from({ length: 14 }, (_, i) => <line key={i} x1={28 + i * 6} y1={60} x2={28 + i * 6} y2={82} stroke="#7d4d24" strokeWidth="0.6" />)}
      <path d="M116 64 L150 64 L150 96 M116 78 L134 78 L134 96" fill="none" stroke={C.steel} strokeWidth="3" />
      <circle cx={142} cy={110} r={11} fill={M.magnet} stroke={C.text} strokeWidth="0.6" />
      <T x={70} y={52} a="middle" s={10.5} c={C.text}>coil</T>
      <Gear cx={186} cy={128} r={22} n={22} />
      <Gear cx={242} cy={160} r={26} n={26} />
      <Gear cx={300} cy={136} r={30} n={30} />
      <Gear cx={300} cy={136} r={10} n={10} c={C.brassHi} />
      {[[186, 128], [242, 160], [300, 136]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={7} fill="none" stroke={M.oil} strokeWidth="1.4" />
      ))}
      {/* steel particle at rotor */}
      {[[130, 104], [150, 120], [138, 124]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.6} fill={C.ruby} />)}
      <Lab p={[142, 120]} x={86} y={154} text="steel particles" sub="at the rotor" c={C.ruby} />
      <Lab p={[193, 121]} x={196} y={64} text="pivots and oil" up />
      <Lab p={[262, 172]} x={252} y={214} text="sluggish gears" c={C.ruby} />
      <Lab p={[322, 116]} x={370} y={64} text="hands touching" c={C.ruby} up />
      <Note x={360} y={120} lines={['Any of these can', 'make a fresh cell', 'stutter.']} c={C.dim} s={10.5} lh={14} />
      {/* accuracy check */}
      <Sep x1={12} y1={226} x2={468} y2={226} />
      <Tag x={14} y={244}>Check accuracy against a clock, over a week or two</Tag>
      <rect x={14} y={256} width={210} height={62} rx="6" fill="rgba(123,165,131,0.08)" stroke={C.emerald} />
      <Verdict x={32} y={274} ok r={8} />
      <T x={46} y={278} s={11} c={C.emerald} w={600}>Normal</T>
      <T x={26} y={298} s={10.5} c={C.text}>small drift: many movements are</T>
      <T x={26} y={312} s={10.5} c={C.text}>rated about ±15 to ±20 s a month</T>
      <rect x={236} y={256} width={232} height={62} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <Verdict x={254} y={274} ok={false} r={8} />
      <T x={268} y={278} s={11} c={C.ruby} w={600}>A fault</T>
      <T x={248} y={298} s={10.5} c={C.text}>minutes gained, or random stops:</T>
      <T x={248} y={312} s={10.5} c={C.dim}>see the Quartz Repair track</T>
    </F>
  )
}

/* ================================================================== */
/* fund-keyless · winding vs setting                                    */
/* ================================================================== */

// Keyless works in plan: stem along x, crown at the right. setting: clutch slid inward (left)
function StemAssy({ y, setting }) {
  const cl = setting ? 150 : 192 // clutch left edge
  const teethR = (x0) => Array.from({ length: 5 }, (_, i) => `${x0},${y - 14 + i * 7} ${x0 + 6},${y - 10.5 + i * 7}`).join(' ')
  return (
    <g>
      {/* setting wheel (left of the clutch's inner teeth) and crown wheel (above the winding pinion) */}
      <Gear cx={122} cy={y + 20} r={22} n={18} c={setting ? C.steel : C.faint} fill={setting ? 'rgba(134,167,189,0.25)' : 'rgba(255,255,255,0.03)'} />
      <Gear cx={262} cy={y - 42} r={26} n={24} c={setting ? C.faint : C.brass} fill={setting ? 'rgba(255,255,255,0.03)' : 'rgba(201,162,76,0.25)'} />
      {/* stem: round inner end, square middle, crown */}
      <rect x={110} y={y - 4} width={300} height={8} fill="url(#sk-steel)" />
      <rect x={140} y={y - 6} width={100} height={12} fill="url(#sk-steelH)" opacity="0.7" />
      <rect x={410} y={y - 18} width={22} height={36} rx="4" fill="url(#fc-knurl)" stroke={M.steelD} />
      {/* winding pinion, free on the round part */}
      <rect x={244} y={y - 16} width={36} height={32} fill="rgba(201,162,76,0.35)" stroke={C.brass} />
      <polyline points={teethR(238)} fill="none" stroke={C.brass} strokeWidth="1.2" />
      {/* clutch (sliding pinion) */}
      <rect x={cl} y={y - 16} width={44} height={32} fill={setting ? 'rgba(134,167,189,0.4)' : 'rgba(201,162,76,0.4)'} stroke={setting ? C.steel : C.brass} />
      <polyline points={teethR(cl + 44)} fill="none" stroke={setting ? C.faint : C.brass} strokeWidth="1.2" />
      {Array.from({ length: 4 }, (_, i) => <rect key={i} x={cl - 5} y={y - 14 + i * 8} width={5} height={5} fill={setting ? C.steel : C.faint} />)}
      <rect x={cl + 18} y={y - 16} width={8} height={32} fill="#2a251f" />
      {/* yoke in the clutch groove */}
      <path d={`M${cl + 22} ${y + 18} L${cl + 22} ${y + 44} L${cl + 80} ${y + 56}`} fill="none" stroke={C.steel} strokeWidth="4" strokeLinecap="round" />
    </g>
  )
}

function FcClutch() {
  return (
    <F h={340} view="Plan · the sliding pinion" scale="schematic">
      <Tag x={14} y={42} c={C.brassHi}>Crown pushed in · winding</Tag>
      <StemAssy y={102} />
      <SLab p={[262, 52]} x={300} y={44} text="crown wheel" sub="→ ratchet → mainspring" c={C.brassHi} />
      <SLab p={[280, 112]} x={330} y={130} text="winding pinion" sub="free on the stem" />
      <SLab p={[214, 118]} x={330} y={164} text="clutch: teeth locked to it" c={C.brassHi} />
      <T x={60} y={140} a="middle" s={10} c={C.faint}>setting</T>
      <T x={60} y={152} a="middle" s={10} c={C.faint}>wheel idle</T>
      <Sep x1={12} y1={178} x2={468} y2={178} />
      <Tag x={14} y={198} c={C.steel}>Crown pulled out · setting</Tag>
      <StemAssy y={262} setting />
      <Arrow a={[226, 236]} b={[186, 236]} c="steel" w={1.8} />
      <T x={250} y={324} s={10.5} c={C.steel}>the yoke slides the clutch inward</T>
      <Arrow a={[432, 230]} b={[456, 230]} c="steel" w={1.6} />
      <T x={444} y={218} a="middle" s={10} c={C.faint}>pulled</T>
      <T x={14} y={324} s={10.5} c={C.steel}>meshes with the setting wheel → hands</T>
      <SLab p={[262, 212]} x={300} y={204} text="crown wheel idle" c={C.faint} />
    </F>
  )
}

function FcClicks() {
  const pos = [
    ['0', 'pushed in', 'winds', C.brass],
    ['1', 'first click', 'sets the date', C.steel],
    ['2', 'last click', 'sets the hands', C.emerald],
  ]
  return (
    <F h={330} view="Detail · counting crown positions" scale="schematic">
      {/* case edge and crown positions */}
      <rect x={14} y={44} width={70} height={118} rx="10" fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={84} y={98} width={150} height={6} fill="url(#sk-steel)" />
      {pos.map(([n, a, b, c], i) => {
        const cx = 92 + i * 34
        return (
          <g key={n}>
            <rect x={cx} y={84} width={18} height={34} rx="3" fill={i === 2 ? 'url(#fc-knurl)' : 'none'} stroke={c} strokeDasharray={i === 2 ? undefined : '3 2'} strokeWidth="1.3" />
            <line x1={cx + 9} y1={120} x2={cx + 9} y2={136 + i * 10} stroke={c} strokeWidth="0.8" />
            <Num x={cx + 9} y={142 + i * 10} n={n} r={8} c={c} />
          </g>
        )
      })}
      {pos.map(([n, a, b, c], i) => (
        <g key={'t' + n}>
          <Num x={264} y={60 + i * 36} n={n} r={8} c={c} />
          <T x={280} y={64 + i * 36} s={11} c={C.text}>{a}</T>
          <T x={366} y={64 + i * 36} s={11} c={c} w={600}>{b}</T>
        </g>
      ))}
      <T x={256} y={168} s={10} c={C.faint}>date watch: each click crisp, crown stays put</T>
      <Sep x1={12} y1={184} x2={468} y2={184} />
      <Tag x={14} y={202}>What a bad click points at</Tag>
      {[
        ['Vague click, or crown drifts back', 'setting lever or its spring', C.ruby],
        ['Crown pulls right out', 'loose setting-lever screw', C.ruby],
        ['An extra position that does nothing', 'phantom date: not a fault', C.emerald],
      ].map(([a, b, c], i) => (
        <g key={a}>
          <rect x={14} y={212 + i * 36} width={238} height={28} rx="5" fill="rgba(255,255,255,0.03)" stroke={C.line} />
          <T x={24} y={230 + i * 36} s={10.5} c={C.text}>{a}</T>
          <Arrow a={[254, 226 + i * 36]} b={[278, 226 + i * 36]} c="brass" w={1.3} />
          <T x={284} y={230 + i * 36} s={10.5} c={c}>{b}</T>
        </g>
      ))}
      <T x={14} y={324} s={10} c={C.faint}>Phantom date: a date movement behind a no-date dial.</T>
    </F>
  )
}

function FcKeylessHistory() {
  return (
    <F h={300} view="Sequence · from key to crown" scale="schematic">
      <line x1={40} y1={140} x2={440} y2={140} stroke={C.struct} strokeWidth="1.2" />
      {[
        [80, 'Key-wound', 'a key winds and sets'],
        [240, 'Pin-set', 'press a pin on the case to set'],
        [400, 'Keyless works', 'the crown does both'],
      ].map(([x, a, b], i) => (
        <g key={a}>
          <circle cx={x} cy={140} r={6} fill={C.brass} />
          <Num x={x} y={170} n={i + 1} r={8} />
          <T x={x} y={196} a="middle" s={11} c={C.text} w={600}>{a}</T>
          <T x={x} y={212} a="middle" s={10} c={C.dim}>{b}</T>
        </g>
      ))}
      {/* key */}
      <g>
        <circle cx={80} cy={88} r={30} fill="url(#sk-steel)" stroke={M.steelD} />
        <circle cx={80} cy={88} r={24} fill={M.dial} />
        <circle cx={68} cy={100} r={3} fill={M.ink} />
        <rect x={56} y={44} width={8} height={36} rx="2" fill="url(#fc-gold)" transform="rotate(-30 60 62)" />
        <circle cx={48} cy={42} r={7} fill="none" stroke={C.brass} strokeWidth="2.4" />
      </g>
      {/* pin-set */}
      <g>
        <circle cx={240} cy={88} r={30} fill="url(#sk-steel)" stroke={M.steelD} />
        <circle cx={240} cy={88} r={24} fill={M.dial} />
        <rect x={270} y={81} width={8} height={14} rx="2" fill="url(#fc-knurl)" />
        <circle cx={262} cy={110} r={2.4} fill={M.ink} />
        <Arrow a={[284, 126]} b={[266, 114]} c="brass" w={1.4} />
      </g>
      <Face cx={400} cy={88} r={30} h={300} m={60} />
      <Arrow d="M444 72 Q456 88 444 104" c="brass" w={1.4} />
      <rect x={12} y={232} width={456} height={56} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={252} s={11} c={C.text}>Removing a stem disturbs this mechanism, and it’s a common source</T>
      <T x={24} y={268} s={11} c={C.text}>of “crown won’t wind / won’t set” faults. You’ll meet all three types.</T>
      <T x={456} y={282} a="end" s={10} c={C.faint}>trace both paths: “Keyless works” diagram</T>
    </F>
  )
}

/* ================================================================== */
/* fund-complications                                                   */
/* ================================================================== */

function FcDateTypes() {
  return (
    <F h={300} view="Comparison · three ways to show the date" scale="schematic">
      {[
        [84, 'Date', 'a window'],
        [240, 'Day-date', 'adds a day wheel'],
        [396, 'Pointer date', 'a hand, not a window'],
      ].map(([x, a, b]) => (
        <g key={a}>
          <T x={x} y={44} a="middle" s={11.5} c={C.text} w={600}>{a}</T>
          <T x={x} y={210} a="middle" s={10.5} c={C.dim}>{b}</T>
        </g>
      ))}
      <Face cx={84} cy={124} r={60} h={300} m={60} dial={M.dial}>
        <rect x={108} y={116} width={22} height={16} fill="#fff" stroke={C.struct} />
        <T x={119} y={128} a="middle" s={10.5} c={M.ink} w={700}>14</T>
      </Face>
      <Face cx={240} cy={124} r={60} h={300} m={60} dial={M.dial}>
        <rect x={218} y={82} width={44} height={16} fill="#fff" stroke={C.struct} />
        <T x={240} y={94} a="middle" s={10.5} c={M.ink} w={700}>TUE</T>
        <rect x={264} y={116} width={22} height={16} fill="#fff" stroke={C.struct} />
        <T x={275} y={128} a="middle" s={10.5} c={M.ink} w={700}>14</T>
      </Face>
      <Face cx={396} cy={124} r={60} h={300} m={60} dial={M.dial}>
        {Array.from({ length: 31 }, (_, i) => {
          const [a, b] = clk(396, 124, 48, (i * 360) / 31)
          return <circle key={i} cx={a} cy={b} r={i % 5 === 0 ? 1.6 : 0.9} fill="#3a342c" />
        })}
        {(() => {
          const [a, b] = clk(396, 124, 46, (13 * 360) / 31)
          return <line x1={396} y1={124} x2={a} y2={b} stroke={C.ruby} strokeWidth="1.4" />
        })()}
      </Face>
      <T x={404} y={226} a="middle" s={10} c={C.faint}>points to 1–31 round the edge</T>
      <rect x={12} y={240} width={456} height={48} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={259} s={10.5} c={C.text}>Under the dial: a date wheel advanced once per day by the motion works.</T>
      <T x={24} y={276} s={10} c={C.faint}>Example readings only.</T>
    </F>
  )
}

function FcChronoLayout() {
  return (
    <F h={320} view="Front and section · a chronograph" scale="schematic">
      <Face cx={130} cy={150} r={92} h={null} m={null} crown={false}>
        <circle cx={130} cy={102} r={22} fill="none" stroke={C.dim} strokeWidth="0.8" />
        <circle cx={130} cy={198} r={22} fill="none" stroke={C.dim} strokeWidth="0.8" />
        <line x1={130} y1={102} x2={130} y2={86} stroke={C.brassHi} strokeWidth="1.4" />
        <line x1={130} y1={198} x2={140} y2={186} stroke={C.brassHi} strokeWidth="1.4" />
        <line x1={130} y1={150} x2={92} y2={120} stroke={C.brassHi} strokeWidth="3" strokeLinecap="round" />
        <line x1={130} y1={150} x2={160} y2={92} stroke={C.brassHi} strokeWidth="2" strokeLinecap="round" />
        <line x1={130} y1={150} x2={198} y2={176} stroke={C.ruby} strokeWidth="1.4" />
      </Face>
      {/* crown and pushers */}
      <rect x={221} y={140} width={14} height={20} rx="2" fill="url(#fc-knurl)" stroke={M.steelD} />
      {[[-46], [46]].map(([d]) => {
        const [x, y] = clk(130, 150, 94, 90 + d)
        return <rect key={d} x={x - 4} y={y - 8} width={16} height={16} rx="3" fill="url(#sk-steel)" stroke={M.steelD} transform={`rotate(${d} ${x} ${y})`} />
      })}
      <Lab p={[204, 82]} x={236} y={52} text="start / stop pusher" a="start" up />
      <Lab p={[208, 216]} x={236} y={250} text="reset pusher" a="start" />
      <Lab p={[190, 172]} x={258} y={186} text="sweep seconds hand" a="start" c={C.ruby} />
      <Lab p={[146, 102]} x={258} y={110} text="sub-counters" a="start" />
      {/* section stack */}
      <Tag x={330} y={42}>A layer on top</Tag>
      <rect x={350} y={56} width={110} height={28} rx="3" fill="rgba(194,88,99,0.18)" stroke={C.ruby} />
      <T x={405} y={74} a="middle" s={10.5} c={C.text}>chronograph</T>
      <rect x={350} y={86} width={110} height={36} rx="3" fill="url(#fc-mov)" stroke={C.struct} />
      <T x={405} y={108} a="middle" s={10.5} c={C.text}>base movement</T>
      <T x={330} y={290} s={10.5} c={C.dim}>Start, stop and reset timing,</T>
      <T x={330} y={304} s={10.5} c={C.dim}>layered on the base movement.</T>
      <T x={14} y={290} s={10} c={C.faint}>The Chronograph track</T>
      <T x={14} y={304} s={10} c={C.faint}>covers it in depth.</T>
    </F>
  )
}

function FcGmt() {
  return (
    <F h={300} view="Front · a GMT watch" scale="schematic">
      {/* 24-hour bezel */}
      <circle cx={150} cy={150} r={118} fill="#1f2a33" stroke={M.steelD} />
      <path d={`M${clk(150, 150, 118, 270)[0]} ${clk(150, 150, 118, 270)[1]} A118 118 0 0 1 ${clk(150, 150, 118, 90)[0]} ${clk(150, 150, 118, 90)[1]} L${clk(150, 150, 96, 90)[0]} ${clk(150, 150, 96, 90)[1]} A96 96 0 0 0 ${clk(150, 150, 96, 270)[0]} ${clk(150, 150, 96, 270)[1]} Z`} fill="#3b2730" />
      {Array.from({ length: 12 }, (_, i) => {
        const [x, y] = clk(150, 150, 107, i * 30)
        return (
          <T key={i} x={x} y={y + 4} a="middle" s={10} c={C.text} mono>
            {i * 2 === 0 ? 24 : i * 2}
          </T>
        )
      })}
      <Face cx={150} cy={150} r={96} h={60} m={0} lugs={false} crown={false} />
      {(() => {
        const [x, y] = clk(150, 150, 76, 210)
        return (
          <g>
            <line x1={150} y1={150} x2={x} y2={y} stroke={C.ruby} strokeWidth="2" />
            <path d={`M${x} ${y} l-5 -6 l10 0 Z`} fill={C.ruby} transform={`rotate(30 ${x} ${y})`} />
          </g>
        )
      })()}
      <Lab p={[clk(150, 150, 70, 210)[0], clk(150, 150, 70, 210)[1]]} x={300} y={250} text="extra hour hand" sub="once round in 24 hours" c={C.ruby} a="start" />
      <Lab p={[clk(150, 150, 110, 45)[0], clk(150, 150, 110, 45)[1]]} x={300} y={70} text="24-hour bezel or scale" a="start" up />
      <Lab p={[clk(150, 150, 40, 60)[0], clk(150, 150, 40, 60)[1]]} x={300} y={150} text="local hour hand" a="start" />
      <Note x={300} y={186} lines={['Tracks a second', 'time zone: home', 'while you travel']} c={C.dim} s={10.5} lh={14} />
    </F>
  )
}

function FcMoonPr() {
  return (
    <F h={300} view="Front · moonphase and power reserve" scale="schematic">
      <Face cx={130} cy={150} r={104} h={300} m={60}>
        {/* moon aperture at 6 */}
        <path d="M94 196 A36 36 0 0 1 166 196 Z" fill="#1b2a44" stroke={C.dim} />
        <circle cx={130} cy={196} r={14} fill="url(#fc-moon)" />
        <path d="M94 196 L166 196" stroke={C.dim} />
        {/* power reserve at 12 */}
        <path d={arcD(130, 150, 70, -50, 50)} fill="none" stroke={C.dim} strokeWidth="5" opacity="0.4" />
        <line x1={130} y1={150} x2={clk(130, 150, 70, 22)[0]} y2={clk(130, 150, 70, 22)[1]} stroke={C.ruby} strokeWidth="1.4" />
      </Face>
      <Lab p={[130, 186]} x={262} y={232} text="moonphase" sub="shows the lunar cycle" a="start" />
      <Lab p={[clk(130, 150, 70, -40)[0], clk(130, 150, 70, -40)[1]]} x={262} y={56} text="power-reserve indicator" sub="" a="start" up />
      <T x={266} y={74} s={10} c={C.faint}>shows remaining wind</T>
      <Tag x={262} y={110}>Each one adds</Tag>
      {['parts', 'cost', 'service complexity'].map((t, i) => (
        <g key={t}>
          <T x={262} y={134 + i * 22} s={11} c={C.text}>+ {t}</T>
        </g>
      ))}
      <rect x={256} y={250} width={212} height={40} rx="6" fill="rgba(201,162,76,0.08)" stroke={C.brass} strokeOpacity="0.7" />
      <T x={362} y={268} a="middle" s={10.5} c={C.brassHi}>Master a simple three-hander</T>
      <T x={362} y={282} a="middle" s={10.5} c={C.brassHi}>first</T>
    </F>
  )
}

/* ================================================================== */
/* fund-escapements · other escapements                                 */
/* ================================================================== */

function FcPinPallet() {
  // escape wheel with teeth that carry the impulse face; pallet with two steel pins
  const cx = 150
  const cy = 200
  const r = 92
  const n = 15
  const pts = []
  for (let i = 0; i < n; i++) {
    const a = -90 + (i * 360) / n
    pts.push(pol(cx, cy, r * 0.74, a), pol(cx, cy, r, a + 4), pol(cx, cy, r * 0.9, a + 18), pol(cx, cy, r * 0.74, a + 20))
  }
  const pin = (a) => pol(cx, cy, r * 0.88, a)
  const [p1, p2] = [pin(-112), pin(-64)]
  return (
    <F h={316} view="Plan · pin-pallet (Roskopf) escapement" scale="schematic">
      <polygon points={pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')} fill="rgba(201,162,76,0.12)" stroke={M.brassP} />
      <circle cx={cx} cy={cy} r={5} fill={C.dim} />
      {/* pallet frame */}
      <path d={`M${p1[0]} ${p1[1] - 6} L${cx} ${70} L${p2[0]} ${p2[1] - 6}`} fill="none" stroke={M.brassP} strokeWidth="6" strokeLinejoin="round" />
      <line x1={cx} y1={70} x2={cx} y2={34} stroke={M.brassP} strokeWidth="5" />
      <circle cx={cx} cy={70} r={4} fill={C.dim} />
      {[p1, p2].map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={4.2} fill="url(#sk-steel)" stroke={M.steelD} />
      ))}
      <Lab p={p1} x={40} y={70} text="steel pin" sub="no jewel" up />
      <Lab p={p2} x={290} y={92} text="steel pin" a="start" />
      <Lab p={[cx, 50]} x={230} y={40} text="pressed-brass fork" a="start" up />
      <Lab p={pol(cx, cy, r * 0.82, -10)} x={290} y={170} text="impulse face on the tooth" a="start" />
      <Lab p={pol(cx, cy, r * 0.75, -82)} x={290} y={136} text="tooth root: the banking" a="start" />
      <Note x={290} y={210} lines={['Cheap and robust:', 'inexpensive and', 'alarm watches.', 'Reliable, not fine.']} c={C.dim} s={10.5} lh={14} />
      <T x={290} y={290} s={10} c={C.faint}>Pins replace jewelled pallet stones.</T>
    </F>
  )
}

function FcCylinder() {
  return (
    <F h={316} view="Plan and detail · the cylinder escapement" scale="schematic">
      {/* escape wheel, teeth on stalks */}
      {Array.from({ length: 15 }, (_, i) => {
        const a = (i * 360) / 15
        const [x1, y1] = pol(120, 190, 60, a)
        const [x2, y2] = pol(120, 190, 80, a)
        const [x3, y3] = pol(120, 190, 86, a + 10)
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.steel} strokeWidth="1.6" />
            <path d={`M${x2} ${y2} L${x3} ${y3} L${pol(120, 190, 80, a + 14)[0]} ${pol(120, 190, 80, a + 14)[1]} Z`} fill="rgba(134,167,189,0.4)" stroke={C.steel} />
          </g>
        )
      })}
      <circle cx={120} cy={190} r={60} fill="rgba(134,167,189,0.10)" stroke={C.steel} />
      <circle cx={120} cy={190} r={4} fill={M.ruby} />
      {/* cylinder (half-cut tube) at top */}
      <circle cx={120} cy={100} r={13} fill="none" stroke={C.brassHi} strokeWidth="3.4" strokeDasharray="41 41" transform="rotate(200 120 100)" />
      <circle cx={120} cy={100} r={2} fill={C.dim} />
      <Lab p={[108, 96]} x={40} y={60} text="hollow cylinder" sub="the balance staff" up />
      <Lab p={pol(120, 190, 70, 130)} x={84} y={300} text="teeth up on stalks" />
      {/* side detail */}
      <Pn x={260} y={36} w={208} h={196} t="Tooth in the cylinder" />
      <rect x={340} y={60} width={44} height={150} fill="rgba(201,162,76,0.10)" stroke={C.brassHi} strokeWidth="1.6" />
      <rect x={340} y={118} width={22} height={36} fill={C.ground} stroke="none" />
      <path d={`M340 118 L340 154`} stroke={C.ground} strokeWidth="2" />
      <path d="M290 140 L326 132 L346 140 L326 148 Z" fill="rgba(134,167,189,0.5)" stroke={C.steel} />
      <line x1={272} y1={140} x2={290} y2={140} stroke={C.steel} strokeWidth="2" />
      <Lab p={[340, 124]} x={418} y={104} text="lips" a="start" up />
      <T x={362} y={226} a="middle" s={10} c={C.dim}>impulse on the cylinder’s lips</T>
      <Note x={262} y={254} lines={['Improved on the verge; delicate and', 'long obsolete. You’ll see it in', 'antique watches.']} c={C.dim} s={10.5} lh={14} />
    </F>
  )
}

function FcVergeCoax() {
  // crown wheel side view: saw teeth pointing up along its rim
  const teeth = []
  for (let i = 0; i < 9; i++) teeth.push(`${40 + i * 18},150 ${49 + i * 18},128 ${58 + i * 18},150`)
  return (
    <F h={326} view="Comparison · the oldest and a modern escapement" scale="schematic">
      <Pn x={12} y={26} w={216} h={240} t="Verge" />
      {/* crown wheel edge-on, upright, teeth pointing left */}
      <rect x={128} y={70} width={14} height={130} fill="rgba(201,162,76,0.25)" stroke={M.brassP} />
      <polyline points={Array.from({ length: 9 }, (_, i) => `128,${70 + i * 14.4} 110,${77 + i * 14.4} 128,${84.4 + i * 14.4}`).join(' ')} fill="rgba(201,162,76,0.25)" stroke={M.brassP} />
      <line x1={142} y1={135} x2={196} y2={135} stroke={C.dim} strokeWidth="2.4" />
      {/* the verge: vertical staff beside the teeth, two paddles at the top and bottom teeth */}
      <line x1={96} y1={54} x2={96} y2={204} stroke={C.steel} strokeWidth="4" />
      <path d="M96 80 L118 74 L120 82 L96 88 Z" fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={93} y={184} width={23} height={4} fill="url(#sk-steel)" stroke={M.steelD} strokeWidth="0.6" />
      <ellipse cx={96} cy={54} rx={36} ry={6} fill="none" stroke={M.brassP} strokeWidth="3" />
      <Lab p={[116, 80]} x={160} y={76} text="pallet “paddles”" a="start" up />
      <SLab p={[94, 186]} x={84} y={196} text="at 90°" sub="to the first" />
      <Lab p={[140, 160]} x={176} y={186} text="crown wheel" a="start" />
      <SLab p={[94, 124]} x={84} y={124} text="vertical" sub="staff" />
      <SLab p={[132, 54]} x={150} y={44} text="balance" />
      <T x={120} y={240} a="middle" s={10.5} c={C.text}>needs an odd tooth count</T>
      <T x={120} y={255} a="middle" s={10} c={C.faint}>so the paddles alternate</T>

      <Pn x={240} y={26} w={228} h={240} t="Co-axial" c={C.steel} />
      <circle cx={318} cy={140} r={56} fill="rgba(134,167,189,0.08)" stroke={C.steel} strokeDasharray="4 2" />
      <circle cx={318} cy={140} r={30} fill="rgba(134,167,189,0.12)" stroke={C.steel} strokeDasharray="3 2" />
      <circle cx={318} cy={140} r={3} fill={M.ruby} />
      <path d="M362 106 L410 84 M362 106 L404 140 M362 106 L376 154" stroke={C.brassHi} strokeWidth="3" strokeLinecap="round" />
      <circle cx={362} cy={106} r={4} fill={C.dim} />
      {[[410, 84], [404, 140], [376, 154]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3.5} fill={M.ruby} />)}
      <Lab p={[300, 92]} x={270} y={60} text="two-tier escape wheel" a="start" up />
      <Lab p={[404, 140]} x={420} y={196} text="three pallets" a="middle" />
      <Note x={254} y={220} lines={['George Daniels; used by Omega.', 'Radial pushing, not sliding friction:', 'longer service intervals.']} c={C.dim} s={10.5} lh={14} />
      <T x={240} y={290} a="middle" s={10.5} c={C.dim}>Two ends of history: verge oldest, co-axial among the newest.</T>
      <T x={240} y={308} a="middle" s={10} c={C.faint}>Both drawn schematically.</T>
    </F>
  )
}

function FcEscId() {
  const tooth = (x, y, kind) => {
    if (kind === 'pointed') return <path d={`M${x - 10} ${y + 10} L${x + 6} ${y - 12} L${x + 8} ${y + 10} Z`} fill="rgba(134,167,189,0.4)" stroke={C.steel} />
    if (kind === 'club') return <path d={`M${x - 10} ${y + 10} L${x - 2} ${y - 10} L${x + 8} ${y - 12} L${x + 8} ${y + 10} Z`} fill="rgba(134,167,189,0.4)" stroke={C.steel} />
    if (kind === 'pins') return <g><rect x={x - 12} y={y - 2} width={24} height={4} fill={M.brassP} /><circle cx={x - 10} cy={y + 6} r={3} fill="url(#sk-steel)" /><circle cx={x + 10} cy={y + 6} r={3} fill="url(#sk-steel)" /></g>
    return <g><line x1={x - 8} y1={y + 10} x2={x - 8} y2={y - 4} stroke={C.steel} strokeWidth="1.6" /><path d={`M${x - 8} ${y - 4} L${x + 4} ${y - 10} L${x + 8} ${y - 4} Z`} fill="rgba(134,167,189,0.4)" stroke={C.steel} /></g>
  }
  const rows = [
    ['pointed', 'Pointed teeth', 'English lever', C.text],
    ['club', 'Club-shaped teeth', 'Swiss lever', C.emerald],
    ['pins', 'Steel pins, no pallet stones', 'pin-pallet', C.text],
    ['stalk', 'Teeth on stalks, hollow staff', 'cylinder', C.text],
  ]
  return (
    <F h={330} view="Decision · identify the escapement" scale="schematic">
      <T x={14} y={42} s={11} c={C.text}>Escape wheel and fork under a loupe, before you plan any work:</T>
      {rows.map(([k, a, b, c], i) => {
        const y = 66 + i * 38
        return (
          <g key={k}>
            <rect x={14} y={y - 14} width={36} height={30} rx="4" fill="rgba(255,255,255,0.03)" stroke={C.line} />
            {tooth(32, y + 1, k)}
            <T x={60} y={y + 5} s={11} c={C.text}>{a}</T>
            <Arrow a={[250, y + 1]} b={[276, y + 1]} c="brass" w={1.3} />
            <T x={282} y={y + 5} s={11} c={c} w={600}>{b}</T>
          </g>
        )
      })}
      <rect x={14} y={212} width={220} height={106} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} strokeOpacity="0.7" />
      <T x={24} y={232} s={11} c={C.ruby} w={600}>Not a plain Swiss lever?</T>
      <Note x={24} y={250} lines={['Stop and read up first:', 'the routine you know', 'may not apply.']} c={C.text} s={10.5} lh={14} />
      <rect x={246} y={212} width={222} height={106} rx="6" fill="rgba(134,167,189,0.08)" stroke={C.steel} strokeOpacity="0.7" />
      <T x={256} y={232} s={11} c={C.steel} w={600}>Co-axial</T>
      <Note x={256} y={250} lines={['Needs the right lift angle and a', 'timing machine that can read it.', 'Older Witschi units can’t;', 'newer ones use a mode called Spe1.']} c={C.text} s={10.5} lh={14} />
    </F>
  )
}

/* ================================================================== */
/* fund-fusee · fusee & constant force                                  */
/* ================================================================== */

function FcTorque() {
  const x0 = 60
  const y0 = 220
  const w = 380
  const pts = []
  for (let i = 0; i <= 40; i++) {
    const t = i / 40
    pts.push(`${x0 + t * w},${(y0 - 160 + 110 * Math.pow(t, 1.6)).toFixed(1)}`)
  }
  return (
    <F h={300} view="Chart · force as the spring unwinds" scale="schematic, no values">
      <Axes x={x0} y={y0} w={w + 10} h={180} xl="unwinding →" yl="force reaching the escapement" />
      <T x={x0} y={y0 + 16} s={10} c={C.faint}>full wind</T>
      <polyline points={pts.join(' ')} fill="none" stroke={C.brassHi} strokeWidth="2.2" />
      <line x1={x0} y1={y0 - 100} x2={x0 + w} y2={y0 - 100} stroke={C.emerald} strokeWidth="1.8" strokeDasharray="6 4" />
      <T x={x0 + w} y={y0 - 108} a="end" s={10.5} c={C.emerald}>wanted: roughly constant</T>
      <SLab p={[x0 + 30, y0 - 152]} x={120} y={110} text="strong when fully wound" />
      <Lab p={[x0 + w - 20, y0 - 56]} x={380} y={190} text="weak near run-down" />
      <rect x={12} y={244} width={456} height={46} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} strokeOpacity="0.7" />
      <T x={24} y={263} s={11} c={C.ruby} w={600}>Timekeeping suffers when this force changes.</T>
      <T x={24} y={279} s={10.5} c={C.dim}>Early watches needed a way to deliver roughly constant torque.</T>
    </F>
  )
}

// Fusee cone in side elevation; top small, bottom large. Groove lines.
function Cone({ x, y, h = 120, rt = 12, rb = 34 }) {
  const lines = []
  for (let i = 1; i < 9; i++) {
    const t = i / 9
    const r = rt + (rb - rt) * t
    const yy = y + h * t
    lines.push(<path key={i} d={`M${x - r} ${yy - 2} Q${x} ${yy + 4} ${x + r} ${yy + 2}`} fill="none" stroke={M.brassD} strokeWidth="1" />)
  }
  return (
    <g>
      <path d={`M${x - rt} ${y} L${x + rt} ${y} L${x + rb} ${y + h} L${x - rb} ${y + h} Z`} fill="url(#fc-gold)" stroke={M.brassD} />
      {lines}
      <line x1={x} y1={y - 12} x2={x} y2={y + h + 12} stroke={C.dim} strokeWidth="2" />
    </g>
  )
}
const ChainL = ({ x1, y1, x2, y2 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.text} strokeWidth="2.4" strokeDasharray="3 1.6" />
)

function FcFusee() {
  const Panel = ({ x, wound }) => {
    const bx = x + 50
    const cx = x + 160
    const top = 66
    const h = 120
    const yl = wound ? top + 8 : top + h - 6
    const rl = wound ? 13 : 33
    return (
      <g>
        <Pn x={x} y={26} w={222} h={210} t={wound ? 'Fully wound' : 'Nearly run down'} c={wound ? C.brass : C.line} />
        {/* barrel: cylinder side view */}
        <rect x={bx - 26} y={top + 10} width={52} height={h - 20} rx="4" fill="rgba(201,162,76,0.18)" stroke={M.brassP} />
        {Array.from({ length: wound ? 2 : 9 }, (_, i) => (
          <line key={i} x1={bx - 26} y1={top + 18 + i * 10} x2={bx + 26} y2={top + 18 + i * 10} stroke={C.text} strokeWidth="2" strokeDasharray="3 1.6" />
        ))}
        <line x1={bx} y1={top} x2={bx} y2={top + h} stroke={C.dim} strokeWidth="2" />
        <Cone x={cx} y={top} h={h} />
        {Array.from({ length: wound ? 8 : 1 }, (_, i) => {
          const t = wound ? (i + 0.5) / 9 + 0.06 : 0.95
          const r = 12 + 22 * t
          const yy = top + h * t
          return <path key={i} d={`M${cx - r} ${yy - 2} Q${cx} ${yy + 4} ${cx + r} ${yy + 2}`} fill="none" stroke={C.text} strokeWidth="2" strokeDasharray="3 1.6" />
        })}
        <ChainL x1={bx + 26} y1={wound ? top + 18 : top + 98} x2={cx - rl} y2={yl} />
        <Arrow a={[cx - rl + 6, yl]} b={[cx - 2, yl]} c="brass" w={1.2} />
        <T x={bx} y={208} a="middle" s={10} c={C.dim}>barrel</T>
        <T x={cx} y={208} a="middle" s={10} c={C.dim}>fusee cone</T>
        <T x={x + 111} y={226} a="middle" s={10.5} c={wound ? C.brassHi : C.text}>{wound ? 'pulls on the small diameter' : 'pulls on a large radius'}</T>
      </g>
    )
  }
  return (
    <F h={316} view="Side view · the fusee cone and chain" scale="schematic">
      <Panel x={12} wound />
      <Panel x={246} />
      <T x={240} y={258} a="middle" s={11} c={C.text}>Strong spring × small radius ≈ weak spring × large radius</T>
      <T x={240} y={276} a="middle" s={10.5} c={C.emerald}>so the torque reaching the train evens out</T>
      <T x={240} y={300} a="middle" s={10} c={C.faint}>The chain is a tiny one, like a miniature bicycle chain. The cone has a spiral groove.</T>
    </F>
  )
}

function FcMaintaining() {
  const tl = (y, keeps, label) => (
    <g>
      <T x={14} y={y + 4} s={10.5} c={C.text}>{label}</T>
      <line x1={140} y1={y} x2={460} y2={y} stroke={C.line} />
      <rect x={250} y={y - 12} width={90} height={24} fill="rgba(201,162,76,0.10)" />
      <polyline
        points={Array.from({ length: 33 }, (_, i) => {
          const x = 140 + i * 10
          const run = keeps || x < 250 || x > 340
          return `${x},${run ? y - (i % 2 ? 6 : -6) : y}`
        }).join(' ')}
        fill="none"
        stroke={keeps ? C.emerald : C.ruby}
        strokeWidth="1.4"
      />
    </g>
  )
  return (
    <F h={316} view="Schematic · maintaining power" scale="schematic">
      {/* drive path */}
      <Cone x={80} y={58} h={90} rt={10} rb={26} />
      <circle cx={80} cy={164} r={34} fill="rgba(201,162,76,0.15)" stroke={M.brassP} strokeWidth="3" strokeDasharray="2 1.5" />
      <circle cx={80} cy={164} r={22} fill="none" stroke={C.steel} strokeWidth="1.2" strokeDasharray="4 2" />
      <path d={arcD(80, 164, 27, 200, 320)} fill="none" stroke={M.spring} strokeWidth="2.2" />
      <Lab p={[...clk(80, 164, 27, 260)]} x={22} y={226} text="maintaining spring" c={C.brassHi} a="start" />
      <Lab p={[114, 164]} x={170} y={164} text="great wheel → train" a="start" />
      <Lab p={[80, 58]} x={140} y={52} text="fusee" a="start" up />
      <Note x={250} y={60} lines={['Winding briefly reverses the drive.', 'The spring, already tensioned,', 'keeps pushing the train meanwhile,', 'so the watch never stops.']} c={C.dim} s={10.5} lh={15} />
      <Tag x={14} y={248}>The balance while you wind</Tag>
      <T x={295} y={248} a="middle" s={10} c={C.brassHi}>winding</T>
      {tl(268, false, 'without it')}
      {tl(298, true, 'with it')}
      <T x={295} y={287} a="middle" s={10} c={C.ruby}>train stops</T>
    </F>
  )
}

function FcFuseeSafety() {
  return (
    <F h={300} view="Sequence · before any fusee work" scale="schematic">
      {[
        ['Let the power', 'down first'],
        ['Release the', 'movement from', 'its case'],
        ['Only then', 'work on it'],
      ].map((l, i) => (
        <g key={i}>
          <Bx x={12 + i * 158} y={40} w={140} h={66} l={l} c={i < 2 ? C.ruby : C.emerald} s={10.5} />
          <Num x={26 + i * 158} y={54} n={i + 1} r={8} c={i < 2 ? C.ruby : C.emerald} />
          {i < 2 && <Arrow a={[154 + i * 158, 73]} b={[168 + i * 158, 73]} c="brass" w={1.4} />}
        </g>
      ))}
      {/* the chain, magnified */}
      <Ring x={110} y={190} r={56} />
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <rect x={58 + i * 15} y={184} width={18} height={10} rx="4" fill="none" stroke={C.text} strokeWidth="1.4" />
          <circle cx={60 + i * 15} cy={189} r={1.4} fill={C.dim} />
        </g>
      ))}
      <rect x={58 + 3 * 15} y={194} width={18} height={10} rx="4" fill="none" stroke={C.ruby} strokeWidth="1.2" transform="rotate(20 112 199)" />
      <T x={110} y={258} a="middle" s={10.5} c={C.text}>the chain is the fragile part</T>
      <Note x={206} y={150} head="Practise on scrap" hc={C.brassHi} lines={['Cheap, un-cased scrap movements', 'only, until you’re very experienced.', 'Admire the ingenuity first.']} c={C.dim} s={10.5} lh={15} />
      <rect x={12} y={266} width={456} height={28} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} strokeOpacity="0.7" />
      <T x={240} y={284} a="middle" s={10.5} c={C.ruby}>Never work on a fusee still under power or still cased.</T>
    </F>
  )
}

/* ================================================================== */
/* fund-sweep · centre (sweep) seconds                                  */
/* ================================================================== */

function FcSubCentre() {
  return (
    <F h={316} view="Front and plan · where the seconds hand sits" scale="schematic">
      <Pn x={12} y={26} w={222} h={232} t="Subsidiary seconds" />
      <Face cx={123} cy={128} r={78} h={300} m={60} dial={M.dial} lugs={false}>
        <circle cx={123} cy={170} r={20} fill="none" stroke="#3a342c" strokeWidth="0.8" />
        <line x1={123} y1={170} x2={136} y2={156} stroke={C.ruby} strokeWidth="1.3" />
        <circle cx={123} cy={170} r={2} fill={C.ruby} />
      </Face>
      <Lab p={[123, 170]} x={123} y={232} text="rides on the fourth wheel at 6" />
      <Pn x={246} y={26} w={222} h={232} t="Centre seconds" />
      <Face cx={357} cy={128} r={78} h={300} m={60} s={130} dial={M.dial} lugs={false} />
      <circle cx={357} cy={170} r={6} fill="none" stroke={C.ruby} strokeDasharray="2 2" />
      <Arrow d="M357 162 Q368 148 360 134" c="ruby" w={1.4} />
      <T x={357} y={232} a="middle" s={10.5} c={C.text}>motion carried to the middle</T>
      <T x={357} y={246} a="middle" s={10} c={C.faint}>needs extra gearing</T>
      <rect x={12} y={268} width={456} height={38} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={240} y={291} a="middle" s={11} c={C.text}>The fourth wheel turns once a minute, so it drives the seconds hand.</T>
    </F>
  )
}

// Section: plate at bottom, pipes up to the dial (top). Drawn dial-side up.
function SecBase({ children }) {
  return (
    <g>
      <rect x={30} y={226} width={300} height={14} fill="url(#fc-bcut)" />
      <T x={340} y={238} s={10} c={C.faint}>plate</T>
      <rect x={30} y={60} width={300} height={6} fill={M.dial} opacity="0.85" />
      <T x={340} y={66} s={10} c={C.faint}>dial</T>
      <line x1={180} y1={30} x2={180} y2={250} stroke={C.faint} strokeWidth="0.7" strokeDasharray="6 3 1 3" />
      {children}
    </g>
  )
}

function FcDirect() {
  return (
    <F h={300} view="Section · direct-drive centre seconds" scale="schematic">
      <SecBase>
        {/* fourth wheel in the centre, long arbor up through the hollow pipes */}
        <rect x={130} y={204} width={100} height={6} fill={C.ruby} opacity="0.85" />
        <rect x={178} y={40} width={4} height={186} fill={C.ruby} />
        <rect x={150} y={36} width={60} height={3} fill={C.ruby} />
        {/* cannon pinion and hour wheel pipes round it */}
        <rect x={170} y={70} width={20} height={120} fill="none" stroke={C.brassHi} strokeWidth="2" />
        <rect x={164} y={84} width={32} height={60} fill="none" stroke={C.brass} strokeWidth="2" />
        <rect x={150} y={176} width={60} height={6} fill={C.brassHi} opacity="0.7" />
        <rect x={140} y={110} width={80} height={5} fill={C.brass} opacity="0.7" />
        {/* off-centre minute drive */}
        <rect x={62} y={170} width={50} height={6} fill={C.brassHi} opacity="0.7" />
        <line x1={87} y1={150} x2={87} y2={226} stroke={C.brassHi} strokeWidth="3" />
      </SecBase>
      <Lab p={[180, 38]} x={260} y={36} text="seconds hand" a="start" up />
      <SLab p={[230, 207]} x={360} y={200} text="fourth wheel," sub="in the centre" c={C.ruby} />
      <SLab p={[190, 130]} x={360} y={130} text="hollow pipes" sub="minutes and hours" />
      <SLab p={[87, 160]} x={20} y={110} text="minute drive" sub="moved off-centre" />
      <rect x={12} y={260} width={456} height={32} rx="6" fill="rgba(123,165,131,0.08)" stroke={C.emerald} strokeOpacity="0.7" />
      <T x={240} y={281} a="middle" s={10.5} c={C.emerald}>Smooth, but it needs a purpose-built movement.</T>
    </F>
  )
}

function FcIndirect() {
  return (
    <F h={324} view="Section · indirect-drive centre seconds" scale="schematic">
      <SecBase>
        {/* centre wheel with hollow arbor */}
        <rect x={130} y={196} width={100} height={6} fill={C.brassHi} opacity="0.8" />
        <rect x={172} y={70} width={16} height={156} fill="none" stroke={C.brassHi} strokeWidth="2" />
        {/* fourth wheel off-centre, extended pivot, driving wheel on top */}
        <rect x={50} y={206} width={60} height={6} fill={C.ruby} opacity="0.85" />
        <rect x={78} y={90} width={4} height={136} fill={C.ruby} />
        <rect x={60} y={90} width={70} height={6} fill={C.ruby} opacity="0.85" />
        {/* seconds pinion, passing down through the hollow centre arbor */}
        <rect x={130} y={88} width={32} height={10} fill="rgba(194,88,99,0.35)" stroke={C.ruby} />
        <rect x={178} y={40} width={4} height={150} fill={C.text} />
        <rect x={160} y={88} width={22} height={10} fill={C.text} opacity="0.6" />
        <rect x={150} y={36} width={60} height={3} fill={C.text} />
        {/* tension spring pressing lightly */}
        <path d="M250 100 Q220 96 186 92" fill="none" stroke={M.spring} strokeWidth="1.6" />
        <rect x={250} y={96} width={10} height={14} fill="url(#fc-cut)" />
      </SecBase>
      <Lab p={[180, 38]} x={260} y={36} text="seconds hand" a="start" up />
      <Lab p={[100, 93]} x={90} y={48} text="driving wheel" up />
      <SLab p={[60, 209]} x={46} y={160} text="fourth wheel" sub="off-centre" c={C.ruby} />
      <SLab p={[188, 150]} x={360} y={150} text="seconds pinion" sub="through the hollow centre" />
      <SLab p={[234, 98]} x={360} y={104} text="tension spring" c={C.brassHi} />
      <rect x={12} y={260} width={456} height={56} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={279} s={10.5} c={C.text}>The seconds pinion drives nothing, so gear backlash lets it tremble.</T>
      <T x={24} y={295} s={10.5} c={C.text}>A fine leaf-spring presses on it to steady the hand.</T>
      <T x={24} y={310} s={10} c={C.faint}>A faint flutter in a vintage sweep seconds is this backlash, not a fault.</T>
    </F>
  )
}

function FcSweepWhich() {
  const trace = (y, tremble, c) => {
    const p = []
    for (let i = 0; i <= 120; i++) {
      const x = 150 + i * 2.6
      const yy = y - i * 0.28 + (tremble ? Math.sin(i * 2.1) * 2.2 : 0)
      p.push(`${x},${yy.toFixed(1)}`)
    }
    return <polyline points={p.join(' ')} fill="none" stroke={c} strokeWidth="1.8" />
  }
  return (
    <F h={290} view="Chart · which drive you have" scale="schematic, tremble exaggerated">
      <T x={150} y={44} s={10} c={C.faint}>the hand’s path, close up under a loupe</T>
      <T x={14} y={84} s={11.5} c={C.text} w={600}>Crisp, dead steady</T>
      {trace(100, false, C.emerald)}
      <Arrow a={[150, 124]} b={[200, 124]} c="emerald" w={1.3} />
      <T x={210} y={128} s={11} c={C.emerald}>usually direct drive</T>
      <T x={14} y={174} s={11.5} c={C.text} w={600}>Slight tremble</T>
      {trace(190, true, C.brass)}
      <Arrow a={[150, 214]} b={[200, 214]} c="brass" w={1.3} />
      <T x={210} y={218} s={11} c={C.brassHi}>indirect drive, with a tension spring</T>
      <rect x={12} y={238} width={456} height={42} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={240} y={256} a="middle" s={10.5} c={C.dim}>A faint, even tremble on a watch that keeps good time</T>
      <T x={240} y={271} a="middle" s={10.5} c={C.dim}>is normal for indirect drive.</T>
    </F>
  )
}

function FcTensionSpring() {
  return (
    <F h={330} view="Plan · the seconds tension spring" scale="schematic, magnified">
      {/* bridge */}
      <path d="M30 60 L250 60 Q280 60 280 90 L280 200 L30 200 Z" fill={M.plate} stroke={C.brass} />
      <circle cx={170} cy={130} r={18} fill="rgba(194,88,99,0.25)" stroke={C.ruby} />
      <circle cx={170} cy={130} r={5} fill={C.text} />
      {/* spring: screwed at left, thin arm to the pinion */}
      <Screw x={60} y={100} r={7} ang={20} />
      <path d="M66 104 Q120 128 158 128" fill="none" stroke={M.spring} strokeWidth="2" />
      <Lab p={[120, 122]} x={110} y={230} text="thin tension spring" c={C.brassHi} />
      <Lab p={[170, 130]} x={220} y={230} text="seconds pinion" />
      <Ring x={380} y={110} r={62} />
      <circle cx={400} cy={110} r={22} fill="rgba(194,88,99,0.25)" stroke={C.ruby} />
      <path d="M322 110 Q350 108 378 104" fill="none" stroke={M.spring} strokeWidth="3" />
      <Arrow a={[364, 88]} b={[376, 100]} c="brass" w={1.4} />
      <T x={380} y={192} a="middle" s={10.5} c={C.text}>it should press lightly</T>
      {/* tweezers, kept clear */}
      <G x={140} y={110} ang={-35}>
        <Tweezers len={70} />
      </G>
      <Verdict x={112} y={44} ok={false} r={8} />
      <T x={126} y={48} s={10.5} c={C.ruby}>tweezers near it</T>
      <Sep x1={12} y1={246} x2={468} y2={246} />
      {[
        ['Photograph how it sits first', 'Omega 550: a reported trouble point'],
        ['Flutters after a service?', 'check the spring first'],
      ].map(([a, b], i) => (
        <g key={a}>
          <Num x={24 + i * 232} y={266} n={i + 1} r={8} />
          <T x={38 + i * 232} y={270} s={10.5} c={C.text}>{a}</T>
          <T x={38 + i * 232} y={286} s={10} c={C.dim}>{b}</T>
        </g>
      ))}
      <T x={14} y={314} s={10} c={C.faint}>That differs from the faint, even tremble some vintage hands have always had.</T>
    </F>
  )
}

/* ================================================================== */
/* fund-temperature · temperature & the balance                         */
/* ================================================================== */

function FcTempRate() {
  const x0 = 60
  const y0 = 140
  return (
    <F h={316} view="Chart · temperature against rate" scale="schematic, no values">
      <rect x={x0} y={y0 - 2} width={240} height={4} fill="url(#fc-temp)" />
      <line x1={x0} y1={50} x2={x0} y2={230} stroke={C.struct} />
      <T x={x0 - 6} y={60} a="end" s={10} c={C.faint}>fast</T>
      <T x={x0 - 6} y={226} a="end" s={10} c={C.faint}>slow</T>
      <T x={x0} y={y0 + 18} s={10.5} c={M.cold}>cold</T>
      <T x={x0 + 240} y={y0 + 18} a="end" s={10.5} c={M.hot}>warm</T>
      <line x1={x0 + 10} y1={70} x2={x0 + 230} y2={210} stroke={C.brassHi} strokeWidth="2.2" />
      <T x={x0 + 70} y={72} s={10.5} c={C.text}>runs fast when cold</T>
      <T x={x0 + 130} y={226} a="end" s={10.5} c={C.text}>runs slow when warm</T>
      <Tag x={330} y={44}>When warm</Tag>
      <T x={330} y={68} s={10.5} c={C.text}>hairspring loses</T>
      <T x={330} y={82} s={10.5} c={C.text}>elasticity</T>
      <rect x={330} y={90} width={136} height={14} fill={M.hot} opacity="0.8" />
      <T x={466} y={120} a="end" s={10} c={C.faint}>by far the largest</T>
      <T x={330} y={146} s={10.5} c={C.text}>balance expands</T>
      <rect x={330} y={154} width={22} height={14} fill={M.hot} opacity="0.5" />
      <T x={358} y={165} s={10} c={C.faint}>a little</T>
      <Note x={330} y={196} lines={['Both make it', 'swing slower.']} c={C.dim} s={10.5} lh={14} />
      <rect x={12} y={250} width={456} height={54} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={270} s={10.5} c={C.text}>Temperature changes the spring’s strength far more than the metal’s size.</T>
      <T x={24} y={287} s={10.5} c={C.dim}>Historically the single biggest source of error.</T>
    </F>
  )
}

function FcMte() {
  const x0 = 50
  const y0 = 150
  const w = 300
  const pts = []
  for (let i = 0; i <= 50; i++) {
    const t = 0.12 + (i / 50) * 0.76
    const u = (t - 0.5) / 0.3
    pts.push(`${x0 + t * w},${(y0 - 46 * (1 - u * u)).toFixed(1)}`)
  }
  return (
    <F h={300} view="Chart · middle-temperature error" scale="schematic, no values">
      <rect x={x0} y={y0 + 44} width={w} height={4} fill="url(#fc-temp)" />
      <T x={x0} y={y0 + 62} s={10} c={M.cold}>cold</T>
      <T x={x0 + w} y={y0 + 62} a="end" s={10} c={M.hot}>warm</T>
      <line x1={x0} y1={y0} x2={x0 + w} y2={y0} stroke={C.emerald} strokeWidth="1.4" strokeDasharray="5 3" />
      <T x={x0 + w + 6} y={y0 + 4} s={10.5} c={C.emerald}>correct rate</T>
      <line x1={x0} y1={40} x2={x0} y2={y0 + 40} stroke={C.struct} />
      <T x={x0 + 6} y={46} s={10} c={C.faint}>rate error</T>
      <polyline points={pts.join(' ')} fill="none" stroke={C.brassHi} strokeWidth="2.2" />
      {[0.2, 0.8].map((t) => (
        <g key={t}>
          <circle cx={x0 + t * w} cy={y0} r={4} fill={C.emerald} />
        </g>
      ))}
      <T x={x0 + 0.2 * w - 8} y={y0 - 8} a="end" s={10} c={C.emerald}>agrees</T>
      <T x={x0 + 0.8 * w + 8} y={y0 - 8} s={10} c={C.emerald}>agrees</T>
      <Dim a={[x0 + w / 2, y0]} b={[x0 + w / 2, y0 - 46]} off={0} />
      <Lab p={[x0 + w / 2 + 4, y0 - 46]} x={x0 + w + 10} y={64} text="residual error" sub="in between" a="start" c={C.brassHi} />
      <rect x={12} y={232} width={456} height={58} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={252} s={10.5} c={C.text}>A bimetallic balance can’t compensate perfectly at every temperature.</T>
      <T x={24} y={268} s={10.5} c={C.text}>The small residual is the “middle-temperature error”.</T>
      <T x={24} y={283} s={10} c={C.faint}>Minimising it is one of the branches of fine adjusting.</T>
    </F>
  )
}

function FcModernBalance() {
  return (
    <F h={316} view="Comparison · the classic and the modern answer" scale="schematic">
      <Pn x={12} y={26} w={222} h={210} t="Classic" />
      {/* split bimetallic rim with screws */}
      <path d={arcD(123, 128, 66, 10, 170)} fill="none" stroke={M.brassP} strokeWidth="6" />
      <path d={arcD(123, 128, 60, 10, 170)} fill="none" stroke={C.steel} strokeWidth="4" />
      <path d={arcD(123, 128, 66, 190, 350)} fill="none" stroke={M.brassP} strokeWidth="6" />
      <path d={arcD(123, 128, 60, 190, 350)} fill="none" stroke={C.steel} strokeWidth="4" />
      <line x1={57} y1={128} x2={189} y2={128} stroke={C.steel} strokeWidth="4" />
      {Array.from({ length: 10 }, (_, i) => {
        const a = [25, 50, 75, 105, 130, 205, 230, 255, 285, 310][i]
        const [x, y] = clk(123, 128, 72, a)
        return <circle key={i} cx={x} cy={y} r={3} fill="url(#fc-gold)" />
      })}
      <circle cx={123} cy={128} r={4} fill={M.ruby} />
      <T x={123} y={218} a="middle" s={10.5} c={C.text}>split bimetallic rim, brass and steel</T>
      <Pn x={246} y={26} w={222} h={210} t="Modern" c={C.emerald} />
      <circle cx={357} cy={128} r={66} fill="none" stroke="#b9a36a" strokeWidth="7" />
      <line x1={291} y1={128} x2={423} y2={128} stroke="#b9a36a" strokeWidth="4" />
      <polyline points={Array.from({ length: 100 }, (_, i) => pol(357, 128, 8 + i * 0.3, i * 12).map((v) => v.toFixed(1)).join(',')).join(' ')} fill="none" stroke={C.steel} strokeWidth="1" />
      <circle cx={357} cy={128} r={4} fill={M.ruby} />
      <Lab p={[400, 78]} x={432} y={58} text="solid Glucydur" up />
      <T x={357} y={218} a="middle" s={10.5} c={C.text}>Elinvar / Nivarox hairspring</T>
      <Tag x={14} y={256}>The modern alloys</Tag>
      <T x={14} y={276} s={10.5} c={C.text}>Invar, and especially Elinvar/Nivarox hairsprings, hold their elasticity</T>
      <T x={14} y={292} s={10.5} c={C.text}>across temperature and resist magnetism, so a plain monometallic</T>
      <T x={14} y={308} s={10.5} c={C.text}>balance is enough.</T>
    </F>
  )
}

function FcSettle() {
  const thermo = (x, y, lvl, c) => (
    <g>
      <rect x={x - 4} y={y - 50} width={8} height={50} rx="4" fill="rgba(255,255,255,0.05)" stroke={C.dim} />
      <rect x={x - 2} y={y - 50 * lvl} width={4} height={50 * lvl} fill={c} />
      <circle cx={x} cy={y + 4} r={7} fill={c} />
    </g>
  )
  return (
    <F h={316} view="Sequence · compare like with like" scale="schematic">
      <Pn x={12} y={26} w={140} h={130} t="Off the wrist" />
      <Face cx={64} cy={96} r={30} h={300} m={60} />
      {thermo(124, 116, 0.8, M.hot)}
      <T x={82} y={146} a="middle" s={10.5} c={M.hot}>warm</T>
      <Pn x={12} y={166} w={140} h={130} t="Cold windowsill" />
      <Face cx={64} cy={236} r={30} h={300} m={60} />
      {thermo(124, 256, 0.25, M.cold)}
      <T x={82} y={286} a="middle" s={10.5} c={M.cold}>cold</T>
      <Arrow a={[156, 92]} b={[196, 140]} c="brass" w={1.5} />
      <Arrow a={[156, 232]} b={[196, 180]} c="brass" w={1.5} />
      <Bx x={200} y={132} w={120} h={56} l={['Let it settle', 'at room temperature']} c={C.emerald} s={10.5} />
      <Arrow a={[322, 160]} b={[344, 160]} c="emerald" w={1.5} />
      <Bx x={348} y={132} w={120} h={56} l={['Then compare', 'the two readings']} c={C.emerald} s={10.5} />
      <rect x={200} y={30} width={268} height={86} rx="6" fill="#2a2520" stroke={C.brass} strokeOpacity="0.6" />
      <T x={212} y={50} s={10.5} c={C.brassHi} w={600}>Practice Log</T>
      <T x={212} y={68} s={10.5} c={C.text}>note where it has been</T>
      <T x={212} y={86} s={10.5} c={C.dim}>rate changed, nothing else did?</T>
      <T x={212} y={102} s={10.5} c={C.dim}>check temperature before the regulator</T>
      <rect x={200} y={208} width={268} height={56} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={212} y={230} s={10.5} c={C.text}>Wrist and windowsill rates aren’t comparable.</T>
      <T x={212} y={250} s={10.5} c={C.dim}>COSC tests at three temperatures.</T>
    </F>
  )
}

/* ================================================================== */
/* chrono-how · how a chronograph works                                 */
/* ================================================================== */

// Column wheel in plan: castellated ring of n columns
function ColumnWheel({ cx, cy, r = 20, n = 6, rot = 0 }) {
  return (
    <g>
      <Gear cx={cx} cy={cy} r={r} n={n * 3} c={C.ruby} fill="rgba(194,88,99,0.15)" hub={false} rot={rot} />
      {Array.from({ length: n }, (_, i) => {
        const [x, y] = pol(cx, cy, r * 0.62, rot + (i * 360) / n)
        return <circle key={i} cx={x} cy={y} r={r * 0.2} fill={C.ruby} stroke={C.ground} strokeWidth="0.6" />
      })}
      <circle cx={cx} cy={cy} r={2.4} fill={C.dim} />
    </g>
  )
}

function FcCoupling() {
  const Panel = ({ x, on }) => {
    const dw = [x + 58, 168] // driving wheel on the fourth-wheel pivot
    const cw = [x + 154, 168] // chronograph wheel
    const pv = [x + 196, 168] // coupling lever pivot
    const iw = on ? [x + 106, 148] : [x + 108, 126] // coupling wheel
    const nz = on ? [x + 186, 86] : [x + 206, 92] // lever nose
    return (
      <g>
        <Pn x={x} y={26} w={222} h={232} t={on ? 'Start: in mesh' : 'Stop: out of mesh'} c={on ? C.emerald : C.line} tc={on ? C.emerald : undefined} />
        <Gear cx={dw[0]} cy={dw[1]} r={30} n={36} depth={3} />
        <Turn cx={dw[0]} cy={dw[1]} r={38} from={200} to={250} c="brass" w={1.4} />
        <Gear cx={cw[0]} cy={cw[1]} r={30} n={40} depth={3} c={on ? C.brassHi : C.faint} fill={on ? 'rgba(201,162,76,0.2)' : 'rgba(255,255,255,0.03)'} />
        {on && <Turn cx={cw[0]} cy={cw[1]} r={38} from={110} to={160} c="brass" w={1.4} />}
        {/* column wheel and the coupling lever (pivot, arm to the wheel, nose to the columns) */}
        <ColumnWheel cx={x + 192} cy={72} r={18} />
        <path d={`M${iw[0]} ${iw[1]} L${pv[0]} ${pv[1]} L${nz[0]} ${nz[1]}`} stroke={C.steel} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx={pv[0]} cy={pv[1]} r={4} fill={C.dim} />
        <Gear cx={iw[0]} cy={iw[1]} r={20} n={24} depth={2.5} c={C.steel} fill="rgba(134,167,189,0.35)" />
        <T x={x + 111} y={236} a="middle" s={10} c={on ? C.emerald : C.dim}>{on ? 'nose drops between two columns' : 'a column lifts the lever'}</T>
        <T x={x + 111} y={250} a="middle" s={10} c={C.faint}>{on ? 'sweep hand runs' : 'wheel swings out of mesh'}</T>
      </g>
    )
  }
  return (
    <F h={324} view="Plan · the coupling clutch" scale="schematic">
      <Panel x={12} on />
      <Panel x={246} />
      <Lab p={[70, 140]} x={60} y={64} text="driving wheel" up />
      <Lab p={[112, 140]} x={110} y={92} text="coupling wheel" c={C.steel} up />
      <Lab p={[160, 196]} x={150} y={218} text="chrono wheel" c={C.brassHi} />
      <Lab p={[180, 62]} x={166} y={46} text="column wheel" c={C.ruby} up />
      <T x={240} y={280} a="middle" s={10.5} c={C.text}>The driving wheel turns constantly, friction-tight on the fourth-wheel pivot.</T>
      <T x={240} y={298} a="middle" s={10} c={C.faint}>Vertical-clutch designs clamp a disc instead, for a jitter-free start.</T>
    </F>
  )
}

function FcCounting() {
  return (
    <F h={322} view="Plan · runner, counter and brake" scale="schematic">
      {/* runner */}
      <Gear cx={150} cy={150} r={70} n={60} depth={3} c={C.brassHi} fill="rgba(201,162,76,0.12)" />
      <circle cx={150} cy={150} r={5} fill={M.ruby} />
      <path d={`M${pol(150, 150, 62, -20)[0]} ${pol(150, 150, 62, -20)[1]} L${pol(150, 150, 82, -18)[0]} ${pol(150, 150, 82, -18)[1]}`} stroke={C.steel} strokeWidth="4" strokeLinecap="round" />
      <Turn cx={150} cy={150} r={86} from={210} to={290} c="brass" w={1.5} />
      {/* minute counter wheel */}
      <Gear cx={250} cy={100} r={30} n={30} c={C.steel} fill="rgba(134,167,189,0.18)" />
      <path d={`M300 140 Q284 136 ${pol(250, 100, 30, 70)[0]} ${pol(250, 100, 30, 70)[1] + 2}`} fill="none" stroke={C.text} strokeWidth="1.8" />
      <rect x={298} y={138} width={8} height={8} fill="url(#fc-cut)" />
      {/* brake */}
      <path d="M60 248 L86 212 L98 218" fill="none" stroke={C.ruby} strokeWidth="4" strokeLinecap="round" />
      <circle cx={60} cy={248} r={4} fill={C.dim} />
      <Lab p={[150, 150]} x={60} y={60} text="runner" sub="carries the sweep-seconds hand" a="start" up />
      <Lab p={[pol(150, 150, 80, -18)[0], pol(150, 150, 80, -18)[1]]} x={236} y={196} text="finger" a="start" />
      <Lab p={[250, 100]} x={380} y={58} text="minute-counter wheel" up />
      <T x={330} y={98} s={10} c={C.dim}>one tooth per</T>
      <T x={330} y={110} s={10} c={C.dim}>revolution</T>
      <Lab p={[290, 126]} x={350} y={152} text="jumper spring" sub="stops it drifting" a="start" />
      <Lab p={[92, 216]} x={150} y={258} text="brake, at the stop position" c={C.ruby} a="start" />
      <rect x={12} y={274} width={456} height={40} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={292} s={10.5} c={C.text}>The brake presses the runner so it can’t creep before you read it.</T>
      <T x={24} y={306} s={10} c={C.faint}>Fitted on many chronographs, not all.</T>
    </F>
  )
}

function FcReset() {
  const Hammer = ({ x, y, ang }) => (
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      <rect x={-22} y={-4} width={44} height={8} rx="1" fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={-3} y={4} width={6} height={50} fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.5" />
    </g>
  )
  return (
    <F h={326} view="Plan · reset: hammer on heart" scale="schematic">
      <Pn x={12} y={26} w={222} h={210} t="Hammer falls" />
      <Heart cx={123} cy={140} s={2.2} ang={130} />
      <Hammer x={123} y={88} ang={180} />
      <Arrow a={[123, 54]} b={[123, 70]} c="brass" w={1.6} />
      <Turn cx={123} cy={140} r={58} from={100} to={160} c="brass" w={1.6} />
      <T x={123} y={222} a="middle" s={10.5} c={C.text}>pressure off-centre turns the heart</T>
      <Pn x={246} y={26} w={222} h={210} t="At zero" c={C.emerald} tc={C.emerald} />
      <Heart cx={357} cy={146} s={2.2} ang={0} />
      <Hammer x={357} y={96} ang={180} />
      <Lab p={[357, 108]} x={414} y={64} text="flat on its lowest point" up />
      <T x={357} y={222} a="middle" s={10.5} c={C.emerald}>the hand sits exactly at zero</T>
      <Lab p={[123, 66]} x={70} y={56} text="sprung hammer" up />
      <Tag x={14} y={258}>Two hearts, two hammers</Tag>
      <T x={14} y={278} s={10.5} c={C.text}>one heart on the runner (sweep seconds), one on the minute counter</T>
      <T x={14} y={296} s={10.5} c={C.dim}>Each spins to its lowest point and snaps the hand back instantly.</T>
      <T x={14} y={314} s={10} c={C.faint}>Explore the Chronograph diagram to see it laid out.</T>
    </F>
  )
}

function FcChronoId() {
  const q = [
    ['Switched by?', 'column wheel', 'cam', 'display back, or the calibre’s guide'],
    ['Couples with?', 'swinging wheel', 'vertical clutch', 'press start: small jump, or a clean start (Seiko 6139)'],
    ['Built in?', 'integrated', 'modular', 'meca-quartz: quartz base + mechanical chrono module'],
  ]
  return (
    <F h={330} view="Decision · which chronograph layout" scale="schematic">
      {q.map(([a, b, c, how], i) => {
        const y = 36 + i * 88
        return (
          <g key={a}>
            <Num x={22} y={y + 14} n={i + 1} r={8} />
            <T x={36} y={y + 18} s={11.5} c={C.text} w={600}>{a}</T>
            <Bx x={150} y={y} w={140} h={30} l={[b]} c={C.brass} s={10.5} />
            <T x={308} y={y + 19} a="middle" s={10} c={C.faint}>or</T>
            <Bx x={326} y={y} w={142} h={30} l={[c]} c={C.steel} s={10.5} />
            <T x={36} y={y + 50} s={10.5} c={C.dim}>{how}</T>
          </g>
        )
      })}
      {/* sweep-hand start traces */}
      <rect x={12} y={290} width={456} height={32} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} strokeOpacity="0.7" />
      <T x={240} y={310} a="middle" s={10.5} c={C.ruby}>Settle all three before you order parts or pick up a screwdriver.</T>
    </F>
  )
}

/* ================================================================== */
/* chrono-use · using a chronograph correctly                           */
/* ================================================================== */

// Chronograph front with pushers; state: 'zero' | 'run' | 'stop'
function ChronoFace({ cx, cy, r, sweep = 0, push }) {
  return (
    <g>
      <Face cx={cx} cy={cy} r={r} h={300} m={60} s={sweep} crown>
        <circle cx={cx} cy={cy + r * 0.42} r={r * 0.2} fill="none" stroke={C.dim} strokeWidth="0.7" />
      </Face>
      {[-46, 46].map((d) => {
        const [x, y] = clk(cx, cy, r + 2, 90 + d)
        const on = (push === 'top' && d < 0) || (push === 'bottom' && d > 0)
        return <rect key={d} x={x - 3} y={y - 6} width={12} height={12} rx="2" fill={on ? C.brass : 'url(#sk-steel)'} stroke={M.steelD} transform={`rotate(${d} ${x} ${y})`} />
      })}
    </g>
  )
}

function FcCycle() {
  const st = [
    ['top', 'Top pusher', 'starts', 0, 'run'],
    ['top', 'Top pusher', 'stops', 140, 'stop'],
    ['bottom', 'Bottom pusher', 'resets to zero', 0, 'zero'],
  ]
  return (
    <F h={290} view="Sequence · the normal cycle" scale="schematic">
      {st.map(([p, a, b, sw], i) => {
        const cx = 84 + i * 156
        return (
          <g key={i}>
            <ChronoFace cx={cx} cy={110} r={50} sweep={sw} push={p} />
            {i === 0 && <Turn cx={cx} cy={110} r={36} from={10} to={70} c="emerald" w={1.4} />}
            <Num x={cx - 56} y={48} n={i + 1} r={8} />
            <T x={cx} y={190} a="middle" s={11} c={C.text} w={600}>{a}</T>
            <T x={cx} y={206} a="middle" s={10.5} c={i === 2 ? C.emerald : C.brassHi}>{b}</T>
            {i < 2 && <Arrow a={[cx + 64, 110]} b={[cx + 90, 110]} c="brass" w={1.5} />}
          </g>
        )
      })}
      <rect x={12} y={230} width={456} height={44} rx="6" fill="rgba(123,165,131,0.08)" stroke={C.emerald} strokeOpacity="0.7" />
      <T x={240} y={257} a="middle" s={11.5} c={C.emerald} w={600}>Always reset only after stopping.</T>
    </F>
  )
}

function FcNoReset() {
  return (
    <F h={316} view="Comparison · reset while running" scale="schematic">
      <Pn x={12} y={26} w={222} h={206} t="Running, then reset" c={C.ruby} tc={C.ruby} ok={false} />
      <Heart cx={123} cy={140} s={2} ang={70} />
      <Turn cx={123} cy={140} r={52} from={20} to={110} c="ruby" w={1.6} />
      <rect x={101} y={74} width={44} height={8} fill="url(#sk-steel)" stroke={M.steelD} />
      <Arrow a={[123, 50]} b={[123, 70]} c="ruby" w={1.8} />
      <path d="M140 100 l6 -6 l2 8 l6 -5" fill="none" stroke={C.ruby} strokeWidth="1.6" />
      <Note x={123} y={206} a="middle" lines={['hammers slam into moving parts:', 'they can bend or break']} c={C.text} s={10.5} lh={14} />
      <Pn x={246} y={26} w={222} h={206} t="Stopped, then reset" c={C.emerald} tc={C.emerald} ok />
      <Heart cx={357} cy={140} s={2} ang={70} />
      <rect x={335} y={74} width={44} height={8} fill="url(#sk-steel)" stroke={M.steelD} />
      <Arrow a={[357, 50]} b={[357, 70]} c="emerald" w={1.8} />
      <T x={357} y={206} a="middle" s={10.5} c={C.text}>heart is still: it simply turns to zero</T>
      <rect x={12} y={244} width={456} height={62} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} strokeOpacity="0.7" />
      <T x={24} y={264} s={11} c={C.ruby} w={600}>Stop before resetting, unless you know it’s a flyback.</T>
      <T x={24} y={281} s={10.5} c={C.dim}>A flyback is the exception, by design. This one habit prevents</T>
      <T x={24} y={296} s={10.5} c={C.dim}>the most common chronograph damage.</T>
    </F>
  )
}

function FcStoreZero() {
  return (
    <F h={290} view="Comparison · how to leave it" scale="schematic">
      <Pn x={12} y={26} w={222} h={250} t="Reset to zero" c={C.emerald} tc={C.emerald} ok />
      <ChronoFace cx={123} cy={118} r={56} sweep={0} />
      <T x={123} y={208} a="middle" s={11} c={C.text}>chronograph stopped,</T>
      <T x={123} y={224} a="middle" s={11} c={C.text}>hands at zero</T>
      <Pn x={246} y={26} w={222} h={250} t="Left running" c={C.ruby} tc={C.ruby} ok={false} />
      <ChronoFace cx={357} cy={118} r={56} sweep={220} />
      <Turn cx={357} cy={118} r={40} from={160} to={220} c="ruby" w={1.4} />
      <T x={357} y={208} a="middle" s={11} c={C.text}>adds wear</T>
      <T x={357} y={224} a="middle" s={11} c={C.text}>drains an automatic’s</T>
      <T x={357} y={240} a="middle" s={11} c={C.text}>reserve faster</T>
    </F>
  )
}

function FcChronoDrain() {
  const x0 = 150
  const k = 3.2 // px per month
  return (
    <F h={290} view="Chart · a quartz chronograph’s cell" scale="months to scale">
      <T x={14} y={44} s={11} c={C.text}>ISA 8171/204 on a 55 mAh cell</T>
      <T x={14} y={60} s={10} c={C.faint}>months ≈ mAh × 1000 ÷ µA ÷ 730</T>
      {[
        [96, 'chronograph stopped', '1.35 µA', 56, C.emerald],
        [150, 'chronograph running', '12 µA', 6, C.ruby],
      ].map(([y, a, b, mo, c]) => (
        <g key={a}>
          <T x={14} y={y} s={10.5} c={C.text}>{a}</T>
          <T x={14} y={y + 15} s={10.5} c={C.dim} mono>{b}</T>
          <rect x={x0} y={y - 12} width={mo * k} height={22} rx="3" fill={c} opacity="0.55" />
          <T x={x0 + mo * k + 8} y={y + 4} s={11} c={c} mono>about {mo} months</T>
        </g>
      ))}
      <line x1={x0} y1={72} x2={x0} y2={180} stroke={C.struct} />
      {[0, 12, 24, 36, 48].map((m) => (
        <g key={m}>
          <line x1={x0 + m * k} y1={180} x2={x0 + m * k} y2={185} stroke={C.faint} />
          <T x={x0 + m * k} y={198} a="middle" s={10} c={C.faint} mono>{m}</T>
        </g>
      ))}
      <T x={x0 + 200} y={198} a="start" s={10} c={C.faint}>months</T>
      <rect x={12} y={222} width={456} height={52} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} strokeOpacity="0.7" />
      <T x={24} y={242} s={11} c={C.ruby} w={600}>Keeps flattening cells?</T>
      <T x={24} y={260} s={10.5} c={C.dim}>Check that the chronograph isn’t being left to run.</T>
    </F>
  )
}

function FcZeroRefit() {
  return (
    <F h={300} view="Detail · re-fitting a chrono hand at zero" scale="schematic">
      <Pn x={12} y={26} w={186} h={196} t="Before" c={C.ruby} tc={C.ruby} ok={false} />
      <circle cx={105} cy={120} r={58} fill={M.dialDark} stroke={C.struct} />
      <line x1={105} y1={66} x2={105} y2={76} stroke={C.dim} strokeWidth="2" />
      <line x1={105} y1={120} x2={clk(105, 120, 54, 8)[0]} y2={clk(105, 120, 54, 8)[1]} stroke={C.ruby} strokeWidth="1.6" />
      <circle cx={105} cy={120} r={3} fill={C.ruby} />
      <T x={105} y={212} a="middle" s={10.5} c={C.text}>resets just off zero</T>
      <Arrow a={[204, 128]} b={[234, 128]} c="brass" w={1.6} />
      <Pn x={240} y={26} w={228} h={196} t="After" c={C.emerald} tc={C.emerald} ok />
      <circle cx={330} cy={120} r={58} fill={M.dialDark} stroke={C.struct} />
      <line x1={330} y1={66} x2={330} y2={76} stroke={C.dim} strokeWidth="2" />
      <line x1={330} y1={120} x2={330} y2={66} stroke={C.emerald} strokeWidth="1.6" />
      <circle cx={330} cy={120} r={3} fill={C.emerald} />
      <G x={330} y={120} ang={40}>
        <rect x={-4} y={-90} width={8} height={70} rx="2" fill="url(#fc-knurl)" stroke={M.steelD} />
        <rect x={-3} y={-20} width={6} height={18} fill="url(#sk-steelH)" />
      </G>
      <T x={354} y={196} a="middle" s={10.5} c={C.text}>hand pressed on at true zero</T>
      <T x={354} y={212} a="middle" s={10.5} c={C.emerald}>counter held at zero</T>
      <rect x={12} y={236} width={456} height={52} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={256} s={10.5} c={C.text}>A job for after servicing: reset, hold the counter at zero,</T>
      <T x={24} y={272} s={10.5} c={C.text}>then re-fit the hand at the true zero position.</T>
    </F>
  )
}

function FcHandHammer() {
  const Dial = ({ cx, pts, c }) => (
    <g>
      <circle cx={cx} cy={112} r={56} fill={M.dialDark} stroke={C.struct} />
      {Array.from({ length: 12 }, (_, i) => {
        const [a, b] = clk(cx, 112, 52, i * 30)
        const [c2, d2] = clk(cx, 112, 46, i * 30)
        return <line key={i} x1={a} y1={b} x2={c2} y2={d2} stroke={C.dim} strokeWidth={i === 0 ? 2 : 1} />
      })}
      {pts.map((d, i) => {
        const [x, y] = clk(cx, 112, 40, d)
        return <line key={i} x1={cx} y1={112} x2={x} y2={y} stroke={c} strokeWidth="1.3" opacity="0.8" />
      })}
      <circle cx={cx} cy={112} r={3} fill={c} />
    </g>
  )
  return (
    <F h={330} view="Test · is it the hand or the hammer?" scale="schematic">
      <T x={14} y={42} s={11} c={C.text}>Start, stop and reset several times, stopping at different points. Note where it lands.</T>
      <Dial cx={110} pts={[8, 8, 8, 8]} c={C.brassHi} />
      <T x={110} y={190} a="middle" s={11} c={C.text} w={600}>Same wrong spot every time</T>
      <T x={110} y={206} a="middle" s={10.5} c={C.dim}>hand fitted off zero</T>
      <T x={110} y={222} a="middle" s={10.5} c={C.emerald}>refit the hand</T>
      <Dial cx={350} pts={[-9, 6, 14, -4]} c={C.ruby} />
      <T x={350} y={190} a="middle" s={11} c={C.text} w={600}>A different place each time</T>
      <T x={350} y={206} a="middle" s={10.5} c={C.dim}>hammer slipping off the heart</T>
      <T x={350} y={222} a="middle" s={10.5} c={C.ruby}>a job for the bench</T>
      <rect x={12} y={240} width={456} height={78} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={260} s={10.5} c={C.text}>Quartz chronograph? A hand off zero is usually a crown-and-pusher</T>
      <T x={24} y={276} s={10.5} c={C.text}>zeroing job: see the Quartz Repair track.</T>
      <T x={24} y={300} s={10} c={C.faint}>These are forum tests, but they cost nothing.</T>
    </F>
  )
}

function FcTachy() {
  const cx = 150
  const cy = 166
  const r = 130
  // tachymeter: value v at seconds s = 3600/v → clock angle s*6
  const marks = [500, 400, 300, 250, 200, 150, 120, 100, 90, 80, 70, 60]
  return (
    <F h={330} view="Detail · reading a tachymeter" scale="schematic">
      <circle cx={cx} cy={cy} r={r} fill="#1f1b17" stroke={M.steelD} />
      <circle cx={cx} cy={cy} r={r - 24} fill={M.dialDark} stroke={C.struct} />
      {marks.map((v) => {
        const deg = (3600 / v) * 6
        const [a, b] = clk(cx, cy, r - 2, deg)
        const [c2, d2] = clk(cx, cy, r - 8, deg)
        const [tx, ty] = clk(cx, cy, r - 16, deg)
        return (
          <g key={v}>
            <line x1={a} y1={b} x2={c2} y2={d2} stroke={C.text} strokeWidth="1.2" />
            <T x={tx} y={ty + 3.5} a="middle" s={10} c={v === 120 || v === 80 ? C.brassHi : C.dim} mono>{v}</T>
          </g>
        )
      })}
      {[30, 45].map((sec) => {
        const [x, y] = clk(cx, cy, r - 30, sec * 6)
        return <line key={sec} x1={cx} y1={cy} x2={x} y2={y} stroke={sec === 30 ? C.ruby : C.brass} strokeWidth="1.6" />
      })}
      <circle cx={cx} cy={cy} r={4} fill={C.ruby} />
      <T x={cx - 26} y={cy + 66} a="middle" s={10.5} c={C.ruby}>30 s</T>
      <T x={cx - 66} y={cy - 6} a="middle" s={10.5} c={C.brassHi}>45 s</T>
      <T x={cx} y={cy - 64} a="middle" s={10} c={C.faint}>scale ends at 60</T>
      {/* right column */}
      <Tag x={298} y={44}>Over a known distance</Tag>
      <Num x={306} y={66} n={1} r={8} />
      <T x={320} y={70} s={10.5} c={C.text}>start at one marker</T>
      <Num x={306} y={92} n={2} r={8} />
      <T x={320} y={96} s={10.5} c={C.text}>stop at the next,</T>
      <T x={320} y={110} s={10.5} c={C.dim}>1 km or 1 mile on</T>
      <Num x={306} y={132} n={3} r={8} />
      <T x={320} y={136} s={10.5} c={C.text}>read the scale under</T>
      <T x={320} y={150} s={10.5} c={C.text}>the sweep hand</T>
      <rect x={296} y={168} width={172} height={66} rx="6" fill="rgba(201,162,76,0.08)" stroke={C.brass} strokeOpacity="0.7" />
      <T x={382} y={188} a="middle" s={11.5} c={C.brassHi} mono>3600 ÷ seconds</T>
      <T x={382} y={206} a="middle" s={10.5} c={C.text} mono>30 s → 120</T>
      <T x={382} y={222} a="middle" s={10.5} c={C.text} mono>45 s → 80</T>
      <Note x={298} y={256} lines={['Slower than one turn of the', 'hand? Use the sum instead.', 'A pulsometer works the same', 'way, for a heart rate.']} c={C.dim} s={10.5} lh={14} />
    </F>
  )
}

/* ================================================================== */
/* comp-date · setting date, day & GMT safely                           */
/* ================================================================== */

function FcWindows() {
  // timeline 18:00 → 06:00
  const x0 = 120
  const k = 26 // px per hour
  const hx = (h) => x0 + ((h - 18 + 24) % 24) * k
  const rows = [
    ['ETA 2836-2, 2834-2', 21, 3],
    ['Seiko 6R35, 6R54', 21, 1],
    ['Seiko 8L35', 20, 2],
    ['Don’t know? use', 20, 3],
  ]
  return (
    <F h={326} view="Chart · each calibre’s danger zone" scale="time to scale">
      {[18, 20, 22, 0, 2, 4, 6].map((h) => (
        <g key={h}>
          <line x1={hx(h)} y1={46} x2={hx(h)} y2={178} stroke={h === 0 ? C.brass : C.line} strokeDasharray={h === 0 ? undefined : '2 3'} />
          <T x={hx(h)} y={40} a="middle" s={10} c={h === 0 ? C.brassHi : C.faint} mono>{h === 0 ? '12 am' : h > 12 ? `${h - 12} pm` : `${h} am`}</T>
        </g>
      ))}
      {rows.map(([n, a, b], i) => {
        const y = 62 + i * 30
        const last = i === 3
        return (
          <g key={n}>
            <T x={14} y={y + 12} s={10.5} c={last ? C.brassHi : C.text}>{n}</T>
            <rect x={hx(a)} y={y} width={hx(b) - hx(a)} height={16} rx="3" fill={last ? 'rgba(201,162,76,0.45)' : 'rgba(194,88,99,0.4)'} stroke={last ? C.brass : C.ruby} />
            <T x={hx(b) + 6} y={y + 12} s={10} c={C.dim} mono>{`${a - 12} pm–${b} am`}</T>
          </g>
        )
      })}
      <Sep x1={12} y1={194} x2={468} y2={194} />
      <Tag x={14} y={214}>First: AM or PM?</Tag>
      <Face cx={60} cy={268} r={36} h={0} m={0} dial={M.dial}>
        <rect x={74} y={262} width={14} height={12} fill="#fff" stroke={C.struct} />
      </Face>
      <Arrow d="M104 280 Q114 266 104 252" c="brass" w={1.2} />
      <Note x={120} y={240} lines={['Date flips around noon?', 'The watch is 12 hours out.']} c={C.text} s={10.5} lh={15} />
      <Arrow a={[290, 254]} b={[312, 254]} c="emerald" w={1.4} />
      <Note x={318} y={240} lines={['Run the hands on', 'through 12 hours', 'before setting anything.']} c={C.emerald} s={10.5} lh={15} />
    </F>
  )
}

function FcDayDate() {
  const Win = ({ x, y, day, date, hl }) => (
    <g>
      <rect x={x} y={y} width={44} height={18} fill="#fff" stroke={hl || C.struct} strokeWidth={hl ? 1.6 : 0.8} />
      <T x={x + 22} y={y + 13} a="middle" s={10.5} c={M.ink} w={700}>{day}</T>
      <rect x={x + 50} y={y} width={24} height={18} fill="#fff" stroke={hl || C.struct} strokeWidth={hl ? 1.6 : 0.8} />
      <T x={x + 62} y={y + 13} a="middle" s={10.5} c={M.ink} w={700}>{date}</T>
    </g>
  )
  const steps = [
    ['Quick-set both', 'to yesterday', 'TUE', '14', 180],
    ['Advance the hands', 'through midnight', 'TUE', '14', 360],
    ['Both roll over', 'naturally to today', 'WED', '15', 30],
  ]
  return (
    <F h={290} view="Sequence · setting a day-date" scale="schematic">
      {steps.map(([a, b, d, n, m], i) => {
        const cx = 84 + i * 156
        return (
          <g key={i}>
            <Face cx={cx} cy={112} r={56} h={[180, 0, 30][i]} m={0} dial={M.dial}>
              <g>{null}</g>
            </Face>
            <Win x={cx - 37} y={128} day={d} date={n} hl={i === 2 ? C.emerald : i === 0 ? C.brass : undefined} />
            {i === 1 && <Turn cx={cx} cy={112} r={44} from={-60} to={20} c="brass" w={1.6} />}
            <Num x={cx - 58} y={50} n={i + 1} r={8} />
            <T x={cx} y={196} a="middle" s={11} c={C.text} w={600}>{a}</T>
            <T x={cx} y={212} a="middle" s={10.5} c={C.dim}>{b}</T>
            {i < 2 && <Arrow a={[cx + 66, 112]} b={[cx + 90, 112]} c="brass" w={1.5} />}
          </g>
        )
      })}
      <rect x={12} y={232} width={456} height={44} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={251} s={10.5} c={C.text}>Today in this example is Wednesday 15th.</T>
      <T x={24} y={267} s={10} c={C.faint}>Example dates only. The roll-over does both changes for you.</T>
    </F>
  )
}

function FcGmtTypes() {
  return (
    <F h={316} view="Comparison · true GMT and office GMT" scale="schematic">
      {[
        [123, 'True GMT', 'local hour hand jumps', 'independently, for travel', C.brassHi],
        [357, 'Office GMT', '24-hour hand set via', 'the date position', C.ruby],
      ].map(([cx, a, b, c, col], i) => (
        <g key={a}>
          <Pn x={cx - 111} y={26} w={222} h={264} t={a} />
          <Face cx={cx} cy={136} r={74} h={i === 0 ? 60 : 300} m={0} dial={M.dialDark}>
            {(() => {
              const [x, y] = clk(cx, 136, 58, 150)
              return <line x1={cx} y1={136} x2={x} y2={y} stroke={C.ruby} strokeWidth="1.8" />
            })()}
          </Face>
          {i === 0 && (
            <g>
              {[0, 30, 60].map((d) => {
                const [x, y] = clk(cx, 136, 46, d)
                return <circle key={d} cx={x} cy={y} r={2.4} fill={C.brassHi} opacity={d === 60 ? 1 : 0.4} />
              })}
              <Turn cx={cx} cy={136} r={54} from={5} to={55} c="brass" w={1.5} />
            </g>
          )}
          {i === 1 && <Turn cx={cx} cy={136} r={66} from={120} to={170} c="ruby" w={1.5} />}
          <T x={cx} y={240} a="middle" s={10.5} c={col}>{b}</T>
          <T x={cx} y={256} a="middle" s={10.5} c={col}>{c}</T>
        </g>
      ))}
      <T x={123} y={278} a="middle" s={10} c={C.faint}>in one-hour steps</T>
      <T x={357} y={278} a="middle" s={10} c={C.faint}>red: the 24-hour hand</T>
      <T x={240} y={308} a="middle" s={10.5} c={C.dim}>Know which you have before setting.</T>
    </F>
  )
}

function FcGmtTest() {
  return (
    <F h={330} view="Decision · test which GMT you have" scale="schematic">
      <Bx x={12} y={30} w={140} h={46} l={['Hands well clear', 'of the date change']} c={C.struct} s={10.5} />
      <Arrow a={[152, 53]} b={[170, 53]} c="brass" w={1.4} />
      <Bx x={172} y={30} w={136} h={46} l={['Crown to first click', 'turn slowly each way']} c={C.brass} s={10.5} />
      <Arrow a={[308, 53]} b={[326, 53]} c="brass" w={1.4} />
      <Bx x={328} y={30} w={140} h={46} l={['What moves?']} c={C.brass} />
      {[
        ['Local hour hand jumps', 'in one-hour steps', 'True GMT', ['Miyota 9075: that hand also', 'drives the date; no separate', 'quick-set'], C.emerald],
        ['24-hour hand moves', '', 'Office GMT', ['Seiko NH34, first click:', 'clockwise moves the', 'GMT hand; anticlockwise', 'sets the date'], C.steel],
        ['Nothing moves', '', 'Try the next click', ['and check the', 'calibre’s guide'], C.dim],
      ].map(([a, a2, b, notes, c], i) => {
        const x = 12 + i * 156
        return (
          <g key={a}>
            <Arrow d={`M398 78 Q398 96 ${x + 72} 104`} c="brass" w={1.2} />
            <rect x={x} y={108} width={144} height={170} rx="6" fill="rgba(255,255,255,0.03)" stroke={c} />
            <T x={x + 10} y={128} s={10.5} c={C.text}>{a}</T>
            {a2 && <T x={x + 10} y={142} s={10.5} c={C.text}>{a2}</T>}
            <T x={x + 10} y={170} s={12} c={c} w={600}>{b}</T>
            <Note x={x + 10} y={192} lines={notes} c={C.dim} s={10} lh={14} />
          </g>
        )
      })}
      <T x={240} y={306} a="middle" s={10.5} c={C.emerald}>Neither type is a fault.</T>
    </F>
  )
}

function FcAdvance() {
  return (
    <F h={290} view="Sequence · no quick-set? advance the hands" scale="schematic">
      <Face cx={90} cy={124} r={64} h={0} m={0} dial={M.dial}>
        <rect x={124} y={116} width={20} height={16} fill="#fff" stroke={C.struct} />
        <T x={134} y={128} a="middle" s={10} c={M.ink} w={700}>12</T>
      </Face>
      <Turn cx={90} cy={124} r={52} from={20} to={320} c="brass" w={1.8} />
      <T x={90} y={210} a="middle" s={10.5} c={C.text}>crown out, turn the hands</T>
      <T x={90} y={224} a="middle" s={10.5} c={C.text}>forward, day after day</T>
      {['12', '13', '14', '15'].map((d, i) => (
        <g key={d}>
          <rect x={192 + i * 64} y={100} width={40} height={30} rx="3" fill={i === 3 ? '#fff' : '#d9d2c2'} stroke={i === 3 ? C.emerald : C.struct} strokeWidth={i === 3 ? 1.8 : 0.8} />
          <T x={212 + i * 64} y={120} a="middle" s={12} c={M.ink} w={700}>{d}</T>
          {i < 3 && <Arrow a={[234 + i * 64, 115]} b={[254 + i * 64, 115]} c="brass" w={1.3} />}
          <T x={212 + i * 64} y={146} a="middle" s={10} c={C.faint}>{i < 3 ? 'one day' : 'reads right'}</T>
        </g>
      ))}
      <T x={316} y={74} a="middle" s={10.5} c={C.text}>until the complication reads correctly</T>
      <T x={316} y={176} a="middle" s={11} c={C.emerald} w={600}>Slow, but always safe.</T>
      <T x={316} y={194} a="middle" s={10} c={C.faint}>Example dates only.</T>
      <rect x={12} y={240} width={456} height={38} rx="6" fill="rgba(201,162,76,0.08)" stroke={C.brass} strokeOpacity="0.7" />
      <T x={240} y={263} a="middle" s={10.5} c={C.brassHi}>Perpetual and annual calendars: check the maker’s instructions first.</T>
    </F>
  )
}

/* ================================================================== */
/* comp-calendar · calendars, moonphase & perpetuals                    */
/* ================================================================== */

function MoonDisc({ cx, cy, r, rot = 0 }) {
  const pts = []
  for (let i = 0; i < 59; i++) {
    const a = rot + (i * 360) / 59
    pts.push(pol(cx, cy, r, a), pol(cx, cy, r + 3.5, a + 2.5), pol(cx, cy, r, a + 6.1))
  }
  return (
    <g>
      <polygon points={pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')} fill="#1b2a44" stroke={C.steel} strokeWidth="0.8" />
      {[0, 180].map((d) => {
        const [x, y] = pol(cx, cy, r * 0.62, rot - 90 + d)
        return <circle key={d} cx={x} cy={y} r={r * 0.26} fill="url(#fc-moon)" />
      })}
      {Array.from({ length: 10 }, (_, i) => {
        const [x, y] = pol(cx, cy, r * (0.3 + (i % 3) * 0.2), rot + i * 37)
        return <circle key={i} cx={x} cy={y} r={1} fill="#f3ead8" opacity="0.7" />
      })}
      <circle cx={cx} cy={cy} r={3} fill={C.dim} />
    </g>
  )
}

function FcMoonDisc() {
  return (
    <F h={330} view="Plan · the moon disc and its finger" scale="schematic">
      <MoonDisc cx={140} cy={160} r={96} />
      {/* dial aperture outline */}
      <path d="M70 110 Q90 50 140 50 Q190 50 210 110" fill="none" stroke={C.brass} strokeWidth="1.6" strokeDasharray="5 3" />
      <T x={140} y={42} a="middle" s={10} c={C.brassHi}>dial aperture</T>
      {/* driving wheel with sprung finger */}
      <Gear cx={268} cy={240} r={30} n={30} />
      <path d="M268 240 L226 214" stroke={C.steel} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M262 236 q-12 -2 -16 -12" fill="none" stroke={M.spring} strokeWidth="1.2" />
      <Turn cx={268} cy={240} r={40} from={300} to={340} c="brass" w={1.5} />
      <Lab p={[140, 160]} x={60} y={300} text="moon disc, often 59 teeth" a="start" />
      <Lab p={[228, 215]} x={330} y={150} text="finger: one step a day" a="start" c={C.brassHi} />
      <Lab p={[250, 228]} x={330} y={186} text="sprung: it folds back" sub="if the hands run backwards" a="start" />
      <Lab p={[292, 256]} x={360} y={276} text="wheel driven" sub="from the motion works" a="start" />
      <rect x={300} y={34} width={168} height={92} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} strokeOpacity="0.7" />
      <T x={310} y={54} s={10.5} c={C.ruby} w={600}>Calendar dials</T>
      <Note x={310} y={72} lines={['Handle with extreme care:', 'they usually can’t be', 'restored if marked.']} c={C.text} s={10.5} lh={15} />
    </F>
  )
}

function FcMoonSet() {
  const steps = [
    ['Look up the last', 'full moon'],
    ['Hands well clear of', 'the date change'],
    ['Corrector: full moon', 'centred in the aperture'],
    ['Add one step for each', 'day since'],
    ['Check against a lunar', 'calendar for today'],
  ]
  return (
    <F h={330} view="Sequence · setting a moonphase" scale="schematic">
      {steps.map((l, i) => {
        const y = 36 + i * 36
        return (
          <g key={i}>
            <Num x={24} y={y + 12} n={i + 1} r={8} />
            <T x={40} y={y + 10} s={10.5} c={C.text}>{l[0]}</T>
            <T x={40} y={y + 24} s={10.5} c={C.dim}>{l[1]}</T>
          </g>
        )
      })}
      {/* aperture: full moon centred */}
      <g>
        <rect x={250} y={36} width={218} height={150} rx="8" fill="rgba(255,255,255,0.025)" stroke={C.line} />
        <clipPath id="fc-ap">
          <path d="M290 132 A70 70 0 0 1 430 132 Z" />
        </clipPath>
        <path d="M290 132 A70 70 0 0 1 430 132 Z" fill="#1b2a44" />
        <g clipPath="url(#fc-ap)">
          <circle cx={360} cy={102} r={26} fill="url(#fc-moon)" />
        </g>
        <path d="M290 132 Q308 106 325 132 M395 132 Q412 106 430 132" fill={M.dial} />
        <line x1={360} y1={64} x2={360} y2={140} stroke={C.emerald} strokeDasharray="3 2" />
        <T x={360} y={160} a="middle" s={10.5} c={C.emerald}>full moon, centred</T>
        <T x={360} y={176} a="middle" s={10} c={C.faint}>then +1 step per day since</T>
      </g>
      {/* drift */}
      <Sep x1={12} y1={226} x2={468} y2={226} />
      <Tag x={14} y={244}>Why it drifts</Tag>
      <T x={14} y={264} s={10.5} c={C.text}>A 59-tooth disc treats two lunar months as 59 days;</T>
      <T x={14} y={280} s={10.5} c={C.text}>they are really about 59.06.</T>
      <rect x={300} y={252} width={168} height={40} rx="6" fill="rgba(201,162,76,0.08)" stroke={C.brass} strokeOpacity="0.7" />
      <T x={384} y={268} a="middle" s={10.5} c={C.brassHi}>about a day every</T>
      <T x={384} y={283} a="middle" s={10.5} c={C.brassHi}>2–3 years (sources vary)</T>
      <T x={14} y={312} s={10} c={C.faint}>Correct it by a step when it drifts. Stopped? Start again from a full moon.</T>
    </F>
  )
}

function FcPerpetual() {
  const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
  const len = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  const cx = 120
  const cy = 160
  const R = 86
  const path = []
  for (let i = 0; i < 12; i++) {
    const depth = len[i] === 31 ? 0 : len[i] === 30 ? 9 : 24
    const a0 = i * 30 + 4
    const a1 = i * 30 + 26
    const [x0, y0] = clk(cx, cy, R, a0)
    const [x1, y1] = clk(cx, cy, R - depth, a0 + 3)
    const [x2, y2] = clk(cx, cy, R - depth, a1 - 3)
    const [x3, y3] = clk(cx, cy, R, a1)
    const [x4, y4] = clk(cx, cy, R, i * 30 + 34)
    path.push(i === 0 ? `M${x0} ${y0}` : `L${x0} ${y0}`, `L${x1} ${y1}`, `L${x2} ${y2}`, `L${x3} ${y3}`, `A${R} ${R} 0 0 1 ${x4} ${y4}`)
  }
  return (
    <F h={330} view="Plan · a perpetual calendar’s programme" scale="schematic">
      <path d={path.join(' ') + ' Z'} fill="rgba(134,167,189,0.15)" stroke={C.steel} />
      {months.map((m, i) => {
        const [x, y] = clk(cx, cy, R - 40, i * 30 + 15)
        return (
          <T key={i} x={x} y={y + 4} a="middle" s={10} c={len[i] === 31 ? C.faint : C.text} w={len[i] < 31 ? 600 : undefined}>
            {m}
          </T>
        )
      })}
      <circle cx={cx} cy={cy} r={4} fill={M.ruby} />
      <T x={cx} y={58} a="middle" s={10.5} c={C.text}>month cam: once round a year</T>
      <Lab p={[...clk(cx, cy, R - 24, 45)]} x={232} y={88} text="deep: February" a="start" />
      <Lab p={[...clk(cx, cy, R - 9, 105)]} x={232} y={140} text="shallow: 30-day months" a="start" />
      <Lab p={[...clk(cx, cy, R, 195)]} x={60} y={276} text="no notch: 31 days" />
      {/* maltese cross wheel */}
      <g transform="translate(400 210)">
        {[0, 90, 180, 270].map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <path d="M-9 -6 L-9 -34 Q0 -40 9 -34 L9 -6 Z" fill="rgba(201,162,76,0.25)" stroke={M.brassP} />
            <line x1={0} y1={-12} x2={0} y2={a === 0 ? -34 : -28} stroke={M.brassD} strokeWidth="3" />
          </g>
        ))}
        <circle r={4} fill={M.ruby} />
      </g>
      <T x={400} y={164} a="middle" s={10.5} c={C.text}>Maltese-cross-style wheel</T>
      <T x={400} y={268} a="middle" s={10} c={C.dim}>four positions: the</T>
      <T x={400} y={281} a="middle" s={10} c={C.dim}>four-year leap cycle</T>
      <rect x={232} y={24} width={236} height={34} rx="6" fill="rgba(123,165,131,0.08)" stroke={C.emerald} strokeOpacity="0.7" />
      <T x={350} y={46} a="middle" s={10.5} c={C.emerald}>Shows the 1st correctly, untouched, until 2100</T>
      <rect x={12} y={294} width={456} height={30} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} strokeOpacity="0.7" />
      <T x={240} y={313} a="middle" s={10.5} c={C.ruby}>Maker’s procedure only. Never force it. No oil on the date ring.</T>
    </F>
  )
}

/* ================================================================== */
/* comp-repeater · repeaters                                            */
/* ================================================================== */

function FcRepTypes() {
  const dot = (x, y, c, n, gap = 9) => Array.from({ length: n }, (_, i) => <circle key={i} cx={x + i * gap} cy={y} r={3.2} fill={c} />)
  const pair = (x, y, n) =>
    Array.from({ length: n }, (_, i) => (
      <g key={i}>
        <circle cx={x + i * 20} cy={y} r={3.2} fill={C.brassHi} />
        <circle cx={x + i * 20 + 8} cy={y} r={3.2} fill={C.steel} />
      </g>
    ))
  return (
    <F h={330} view="Comparison · what each type strikes" scale="schematic">
      <T x={14} y={42} s={11} c={C.text}>Example: the time is 3:47</T>
      <Tag x={190} y={42}>Strikes</Tag>
      {[
        ['Quarter repeater', 'hours + quarters', 'q'],
        ['Half-quarter repeater', 'in between', null],
        ['Five-minute repeater', 'in between', null],
        ['Minute repeater', 'hours + quarters + minutes', 'm'],
      ].map(([a, b, k], i) => {
        const y = 70 + i * 44
        return (
          <g key={a}>
            <T x={14} y={y} s={11} c={C.text} w={600}>{a}</T>
            <T x={14} y={y + 15} s={10} c={C.dim}>{b}</T>
            {k && (
              <g>
                {dot(196, y - 2, M.hot, 3)}
                {pair(232, y - 2, 3)}
                {k === 'm' && dot(300, y - 2, C.text, 2)}
              </g>
            )}
            {!k && <T x={196} y={y + 2} s={10} c={C.faint}>finer than quarters, coarser than minutes</T>}
          </g>
        )
      })}
      <T x={196} y={250} s={10} c={M.hot}>● hours, deep gong</T>
      <T x={300} y={250} s={10} c={C.brassHi}>●</T>
      <T x={310} y={250} s={10} c={C.steel}>● quarters, ting-tang</T>
      <T x={196} y={266} s={10} c={C.text}>● minutes</T>
      <rect x={12} y={280} width={456} height={40} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={298} s={10.5} c={C.text}>A clock watch also strikes automatically in passing,</T>
      <T x={24} y={313} s={10.5} c={C.text}>like a striking clock. A repeater strikes on demand.</T>
    </F>
  )
}

function FcRepSnail() {
  const cx = 130
  const cy = 170
  const rr = (i) => 34 + i * 4.2
  let d = ''
  for (let i = 0; i < 12; i++) {
    const [x0, y0] = clk(cx, cy, rr(i), i * 30)
    const [x1, y1] = clk(cx, cy, rr(i), i * 30 + 30)
    d += `${i === 0 ? 'M' : 'L'}${x0.toFixed(1)} ${y0.toFixed(1)} A${rr(i)} ${rr(i)} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} `
  }
  const tail = clk(cx, cy, rr(2) + 1, 75)
  return (
    <F h={330} view="Schematic · snail, rack, hammer and gong" scale="schematic">
      <path d={d + 'Z'} fill="rgba(201,162,76,0.18)" stroke={M.brassP} />
      <circle cx={cx} cy={cy} r={4} fill={M.ruby} />
      <Lab p={[...clk(cx, cy, rr(10), 315)]} x={90} y={74} text="hour snail" sub="12 steps, one per hour" up />
      {/* rack: arm from the pivot, tail resting on a step, toothed arc */}
      <circle cx={300} cy={120} r={5} fill={C.dim} />
      <line x1={300} y1={120} x2={tail[0]} y2={tail[1]} stroke={C.steel} strokeWidth="4" strokeLinecap="round" />
      <path d={`M${clk(300, 120, 64, 120).join(' ')} L300 120 L${clk(300, 120, 64, 200).join(' ')}`} fill="none" stroke={C.steel} strokeWidth="2" />
      <path d={arcD(300, 120, 64, 120, 200)} fill="none" stroke={C.steel} strokeWidth="2" />
      <path d={arcD(300, 120, 70, 120, 200)} fill="none" stroke={C.steel} strokeWidth="6" strokeDasharray="2 3" />
      <Arrow a={[238, 108]} b={[222, 130]} c="brass" w={1.4} />
      <Lab p={[300, 120]} x={330} y={64} text="rack" sub="falls onto the snail" a="start" up />
      <SLab p={[...clk(300, 120, 70, 130)]} x={380} y={180} text="its teeth lift" sub="the hammer, returning" />
      {/* hammer lever: tail on the rack teeth, head on the gongs */}
      <path d="M296 196 L340 244 L374 288" fill="none" stroke={C.steel} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={340} cy={244} r={4} fill={C.dim} />
      <rect x={368} y={282} width={12} height={12} rx="2" fill="url(#sk-steel)" />
      <SLab p={[340, 244]} x={400} y={236} text="hammer" />
      <path d="M390 304 Q220 318 60 262" fill="none" stroke={M.hot} strokeWidth="2.6" />
      <path d="M390 296 Q230 306 74 254" fill="none" stroke={C.steel} strokeWidth="2.2" />
      <T x={30} y={300} s={10.5} c={M.hot}>deep gong: hours</T>
      <T x={30} y={316} s={10.5} c={C.steel}>quarters: a two-note “ting-tang” on both gongs</T>
      <T x={466} y={322} a="end" s={10} c={C.faint}>quarter snail: the same way</T>
    </F>
  )
}

function FcRepPower() {
  return (
    <F h={316} view="Schematic · the strike has its own power" scale="schematic">
      <Tag x={14} y={42}>Most repeaters</Tag>
      <Bx x={12} y={54} w={110} h={52} l={['Push the slide', 'by hand']} c={C.brass} s={10.5} />
      <Arrow a={[122, 80]} b={[140, 80]} c="brass" w={1.5} />
      <Bx x={142} y={54} w={110} h={52} l={['Winds the', 'strike spring']} c={C.brass} s={10.5} />
      <Arrow a={[252, 80]} b={[270, 80]} c="brass" w={1.5} />
      <Bx x={272} y={54} w={92} h={52} l={['Strike', 'train']} c={C.brass} s={10.5} />
      <Arrow a={[364, 80]} b={[382, 80]} c="brass" w={1.5} />
      <Bx x={384} y={54} w={84} h={52} l={['Hammers', 'and gongs']} c={C.brass} s={10.5} />
      <Tag x={14} y={140}>The going train: separate</Tag>
      <Bx x={12} y={152} w={110} h={44} l={['Mainspring']} c={C.struct} s={10.5} />
      <Arrow a={[122, 174]} b={[140, 174]} c="steel" w={1.4} />
      <Bx x={142} y={152} w={110} h={44} l={['Train', 'and balance']} c={C.struct} s={10.5} />
      <Arrow a={[252, 174]} b={[270, 174]} c="steel" w={1.4} />
      <Bx x={272} y={152} w={92} h={44} l={['Hands']} c={C.struct} s={10.5} />
      <line x1={12} y1={126} x2={468} y2={126} stroke={C.ruby} strokeDasharray="4 3" opacity="0.6" />
      <T x={466} y={120} a="end" s={10} c={C.ruby}>no energy shared</T>
      <Sep x1={12} y1={214} x2={468} y2={214} />
      <Tag x={14} y={234}>Clock watch</Tag>
      <Bx x={12} y={246} w={170} h={52} l={['Separate strike barrel', 'wound daily']} c={C.steel} s={10.5} />
      <Note x={200} y={262} lines={['So the chime has power independent', 'of the going train.']} c={C.dim} s={10.5} lh={15} />
    </F>
  )
}

function FcAllOrNothing() {
  return (
    <F h={316} view="Decision · the all-or-nothing piece" scale="schematic">
      <Pn x={12} y={26} w={222} h={150} t="Slide pushed part-way" c={C.ruby} tc={C.ruby} ok={false} />
      <rect x={40} y={70} width={160} height={14} rx="7" fill="rgba(255,255,255,0.05)" stroke={C.struct} />
      <rect x={40} y={70} width={70} height={14} rx="7" fill={C.ruby} opacity="0.55" />
      <T x={123} y={112} a="middle" s={10.5} c={C.text}>half-wound: blocked</T>
      <T x={123} y={128} a="middle" s={10.5} c={C.dim}>no strike at all, rather</T>
      <T x={123} y={142} a="middle" s={10.5} c={C.dim}>than a wrong chime</T>
      <Pn x={246} y={26} w={222} h={150} t="Slide pushed fully" c={C.emerald} tc={C.emerald} ok />
      <rect x={274} y={70} width={160} height={14} rx="7" fill={C.emerald} opacity="0.55" />
      <T x={357} y={112} a="middle" s={10.5} c={C.text}>strikes the correct time</T>
      <Tag x={14} y={202}>Build up to it</Tag>
      {['simple watches', 'automatics', 'chronographs', 'repeaters'].map((t, i) => (
        <g key={t}>
          <rect x={12 + i * 116} y={258 - i * 14} width={104} height={20 + i * 14} rx="4" fill={i === 3 ? 'rgba(194,88,99,0.2)' : 'rgba(201,162,76,0.12)'} stroke={i === 3 ? C.ruby : C.brass} />
          <T x={64 + i * 116} y={272} a="middle" s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
      <T x={14} y={300} s={10} c={C.faint}>Dozens of tensioned levers and springs timed together. Study the action fully first.</T>
    </F>
  )
}

/* ================================================================== */
/* chrono-service · servicing a chronograph                             */
/* ================================================================== */

function FcStudy() {
  return (
    <F h={316} view="Sequence · study the action first" scale="schematic">
      <ChronoFace cx={84} cy={110} r={58} sweep={100} push="top" />
      <T x={84} y={196} a="middle" s={10.5} c={C.text}>run it for a few minutes</T>
      <Arrow d="M160 66 Q200 40 240 66" c="brass" w={1.4} />
      <Tag x={180} y={98}>Watch what moves on each push</Tag>
      {[
        ['start', 'column wheel steps; coupling lever drops in'],
        ['stop', 'coupling lever lifts; brake on'],
        ['reset', 'hammers fall onto the hearts'],
      ].map(([a, b], i) => (
        <g key={a}>
          <rect x={180} y={110 + i * 30} width={288} height={24} rx="4" fill="rgba(255,255,255,0.03)" stroke={C.line} />
          <T x={190} y={126 + i * 30} s={10.5} c={C.brassHi} w={600}>{a}</T>
          <T x={234} y={126 + i * 30} s={10.5} c={C.text}>{b}</T>
        </g>
      ))}
      <T x={180} y={218} s={10} c={C.faint}>typical column-wheel layout; yours may differ</T>
      <rect x={12} y={236} width={456} height={68} rx="6" fill="rgba(201,162,76,0.08)" stroke={C.brass} strokeOpacity="0.7" />
      <T x={24} y={256} s={11} c={C.brassHi} w={600}>Know what each lever does before touching a screwdriver.</T>
      <T x={24} y={274} s={10.5} c={C.dim}>A craftsman who understands the action can rebuild a chronograph</T>
      <T x={24} y={290} s={10.5} c={C.dim}>from a box of loose parts. That understanding is the whole secret.</T>
    </F>
  )
}

function FcCwCam() {
  return (
    <F h={300} view="Comparison · column wheel or cam" scale="schematic">
      <Pn x={12} y={26} w={222} h={260} t="Column wheel" c={C.ruby} tc={C.ruby} />
      <ColumnWheel cx={123} cy={104} r={44} n={6} />
      <path d="M40 150 L104 128" stroke={C.steel} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M104 128 l-4 -6" stroke={C.steel} strokeWidth="2.4" strokeLinecap="round" />
      <Lab p={[90, 133]} x={60} y={182} text="pawl" />
      <T x={123} y={210} a="middle" s={10.5} c={C.text}>castellated wheel, turned by a pawl</T>
      <T x={123} y={234} a="middle" s={10.5} c={C.dim}>the classic</T>
      <T x={123} y={258} a="middle" s={10.5} c={C.brassHi}>older Valjoux and Venus</T>
      <T x={123} y={272} a="middle" s={10} c={C.faint}>common families</T>
      <Pn x={246} y={26} w={222} h={260} t="Cam" c={C.steel} tc={C.steel} />
      <path d="M300 76 L392 66 Q418 92 396 132 L360 140 L350 116 L322 130 Z" fill="rgba(134,167,189,0.25)" stroke={C.steel} />
      <circle cx={340} cy={102} r={4} fill={M.ruby} />
      <Lab p={[392, 68]} x={420} y={176} text="flat cam" />
      <T x={357} y={210} a="middle" s={10.5} c={C.text}>flat cam; simpler, two-push</T>
      <T x={357} y={234} a="middle" s={10.5} c={C.dim}>common</T>
      <T x={357} y={258} a="middle" s={10.5} c={C.brassHi}>Landeron, Valjoux 7750</T>
      <T x={357} y={272} a="middle" s={10} c={C.faint}>common designs</T>
    </F>
  )
}

function FcDismantle() {
  return (
    <F h={330} view="Sequence · relieving a lever spring" scale="schematic, magnified">
      {[0, 1, 2].map((i) => {
        const x = 12 + i * 156
        const out = i >= 1
        return (
          <g key={i}>
            <Pn x={x} y={26} w={144} h={168} />
            <Num x={x + 14} y={42} n={i + 1} r={8} />
            {/* lever */}
            <path d={`M${x + 30} 150 L${x + 110} 110`} stroke={C.steel} strokeWidth="6" strokeLinecap="round" />
            <circle cx={x + 30} cy={150} r={4} fill={C.dim} />
            {/* spring */}
            {i < 2 && <path d={`M${x + 60} 70 Q${x + 90} 80 ${out ? x + 120 : x + 106} ${out ? 96 : 104}`} fill="none" stroke={M.spring} strokeWidth="2" />}
            {i < 2 && <Screw x={x + 56} y={70} r={8} ang={i === 0 ? 30 : 75} />}
            {i === 0 && <Turn cx={x + 56} cy={70} r={14} from={20} to={-60} c="brass" w={1.4} />}
            {i === 1 && <Arrow a={[x + 104, 96]} b={[x + 124, 88]} c="brass" w={1.4} />}
            {i === 2 && (
              <g>
                <rect x={x + 76} y={56} width={58} height={34} rx="4" fill="#e4dccb" />
                <path d={`M${x + 84} 76 Q${x + 104} 70 ${x + 124} 80`} fill="none" stroke={M.steelD} strokeWidth="2" />
                <circle cx={x + 120} cy={68} r={4} fill="#c5ced4" stroke="#3e4a52" />
              </g>
            )}
            <T x={x + 72} y={176} a="middle" s={10.5} c={C.text}>{['Undo the screw a turn', 'Ease it out of action', 'Remove; keep the screw'][i]}</T>
            <T x={x + 72} y={190} a="middle" s={10} c={C.faint}>{['', 'spring now relaxed', 'with its part'][i]}</T>
          </g>
        )
      })}
      <T x={14} y={216} s={10.5} c={C.text}>Top parts first, never blindly.</T>
      {/* eccentric stud warning */}
      <rect x={12} y={230} width={456} height={92} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} strokeOpacity="0.7" />
      <circle cx={60} cy={276} r={18} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={64} cy={272} r={7} fill="#c5ced4" stroke="#3e4a52" />
      <line x1={58} y1={268} x2={70} y2={276} stroke="#2c353b" strokeWidth="1.6" />
      <Verdict x={84} y={252} ok={false} r={8} />
      <T x={100} y={252} s={11} c={C.ruby} w={600}>Don’t touch the slotted eccentric studs</T>
      <T x={100} y={270} s={10.5} c={C.text}>They look like screws but are precise depth</T>
      <T x={100} y={286} s={10.5} c={C.text}>adjustments. Turning one throws the chronograph</T>
      <T x={100} y={302} s={10.5} c={C.text}>out of adjustment.</T>
    </F>
  )
}

function FcDepth() {
  const P = ({ x, d, t, ok, note }) => (
    <g>
      <Pn x={x} y={26} w={146} h={186} t={t} c={ok ? C.emerald : C.ruby} tc={ok ? C.emerald : C.ruby} ok={ok} />
      <Gear cx={x + 50} cy={150} r={36} n={60} depth={3} c={C.brassHi} />
      <Gear cx={x + 50 + (50 - d) * 0.707} cy={150 - (50 - d) * 0.707} r={14} n={24} depth={2.5} c={C.steel} fill="rgba(134,167,189,0.3)" />
      <T x={x + 73} y={204} a="middle" s={10} c={C.text}>{note}</T>
    </g>
  )
  return (
    <F h={330} view="Detail · chronograph-wheel depth" scale="schematic">
      <P x={12} d={-6} t="Too shallow" note="slips and stutters" />
      <P x={167} d={4} t="Smooth" ok note="clean engagement" />
      <P x={322} d={7} t="Too deep" note="binds and drags" />
      <T x={240} y={232} a="middle" s={10.5} c={C.dim}>The eccentric moves the coupling wheel closer to or away from the chronograph wheel.</T>
      <Sep x1={12} y1={246} x2={468} y2={246} />
      <Num x={24} y={266} n={1} r={8} />
      <T x={38} y={270} s={10.5} c={C.text}>Rebuild in reverse, oiling as you go with the correct chronograph greases</T>
      <Num x={24} y={290} n={2} r={8} />
      <T x={38} y={294} s={10.5} c={C.text}>Set the depth on its eccentric: smooth, with no stutter</T>
      <Num x={24} y={314} n={3} r={8} />
      <T x={38} y={318} s={10.5} c={C.text}>Run start / stop / reset repeatedly to test</T>
    </F>
  )
}

function FcProveReset() {
  return (
    <F h={330} view="Detail · prove the reset before the dial" scale="schematic, magnified">
      <Pn x={12} y={26} w={222} h={176} t="Seconds heart" c={C.emerald} tc={C.emerald} />
      <Heart cx={123} cy={128} s={2} ang={0} />
      <rect x={93} y={75} width={60} height={9} fill="url(#sk-steel)" stroke={M.steelD} />
      <T x={123} y={188} a="middle" s={10.5} c={C.emerald}>hammer seats fully</T>
      <Pn x={246} y={26} w={222} h={176} t="Minute-counter heart" c={C.brass} tc={C.brassHi} />
      <Heart cx={357} cy={128} s={2} ang={0} />
      <rect x={327} y={66} width={60} height={9} fill="url(#sk-steel)" stroke={M.steelD} />
      <Lab p={[357, 79]} x={430} y={60} text="small gap" up c={C.brassHi} />
      <T x={357} y={188} a="middle" s={10.5} c={C.brassHi}>leaves a small gap</T>
      <T x={240} y={220} a="middle" s={10} c={C.faint}>Forum advice on a Valjoux 7736. Check your own calibre’s sheet.</T>
      <Sep x1={12} y1={234} x2={468} y2={234} />
      <Num x={24} y={254} n={1} r={8} />
      <T x={38} y={258} s={10.5} c={C.text}>Start, stop, reset many times, stopping at different points</T>
      <Num x={24} y={278} n={2} r={8} />
      <T x={38} y={282} s={10.5} c={C.text}>Each heart finishes in the same position every time</T>
      <T x={38} y={296} s={10} c={C.ruby}>changes between resets? the hammer is slipping: correct that first</T>
      <Num x={24} y={316} n={3} r={8} />
      <T x={38} y={320} s={10.5} c={C.text}>Only then fit the chronograph hands, so no hand hides a fault</T>
    </F>
  )
}

function FcDrag() {
  const bar = (x, h, c, l) => (
    <g>
      <rect x={x} y={200 - h} width={48} height={h} fill={c} opacity="0.55" stroke={c} />
      <T x={x + 24} y={216} a="middle" s={10} c={C.dim}>{l}</T>
    </g>
  )
  return (
    <F h={330} view="Chart · the drag test" scale="schematic, no values">
      <Axes x={20} y={200} w={270} h={160} yl="amplitude" />
      {bar(34, 130, C.emerald, 'stopped')}
      {bar(88, 118, C.brass, 'running')}
      {bar(178, 130, C.emerald, 'stopped')}
      {bar(232, 60, C.ruby, 'running')}
      <T x={86} y={236} a="middle" s={10.5} c={C.brassHi}>a small fall</T>
      <T x={86} y={250} a="middle" s={10} c={C.faint}>can be normal</T>
      <T x={230} y={236} a="middle" s={10.5} c={C.ruby}>a collapse</T>
      <T x={230} y={250} a="middle" s={10} c={C.faint}>the works are dragging</T>
      <Tag x={318} y={44} c={C.ruby}>Then check, in order</Tag>
      {['coupling depth', 'misplaced grease', 'a lever that isn’t free'].map((t, i) => (
        <g key={t}>
          <Num x={328} y={66 + i * 28} n={i + 1} r={8} c={C.ruby} />
          <T x={342} y={70 + i * 28} s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
      <Note x={318} y={164} lines={['Change one thing at', 'a time, and re-read', 'after each change.']} c={C.dim} s={10.5} lh={15} />
      <rect x={12} y={268} width={456} height={52} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={288} s={10.5} c={C.text}>Read only once the base movement has passed on its own.</T>
      <T x={24} y={304} s={10} c={C.faint}>No published limit for the drop was found: judge it by size.</T>
    </F>
  )
}

export const FIGS = {
  'fc-shared': FcShared,
  'fc-oscillator': FcOscillator,
  'fc-family': FcFamily,
  'fc-mainspring': FcMainspring,
  'fc-loop': FcLoop,
  'fc-energy': FcEnergy,
  'fc-reverser': FcReverser,
  'fc-wind-systems': FcWindSystems,
  'fc-bridle': FcBridle,
  'fc-handwind': FcHandWind,
  'fc-auto-train': FcAutoTrain,
  'fc-reserve-test': FcReserveTest,
  'fc-quartz-fork': FcQuartzFork,
  'fc-divider': FcDivider,
  'fc-cell-life': FcCellLife,
  'fc-quartz-simple': FcQuartzSimple,
  'fc-quartz-train': FcQuartzTrain,
  'fc-clutch': FcClutch,
  'fc-clicks': FcClicks,
  'fc-keyless-history': FcKeylessHistory,
  'fc-date-types': FcDateTypes,
  'fc-chrono-layout': FcChronoLayout,
  'fc-gmt': FcGmt,
  'fc-moon-pr': FcMoonPr,
  'fc-pin-pallet': FcPinPallet,
  'fc-cylinder': FcCylinder,
  'fc-verge-coax': FcVergeCoax,
  'fc-esc-id': FcEscId,
  'fc-torque': FcTorque,
  'fc-fusee': FcFusee,
  'fc-maintaining': FcMaintaining,
  'fc-fusee-safety': FcFuseeSafety,
  'fc-sub-centre': FcSubCentre,
  'fc-direct': FcDirect,
  'fc-indirect': FcIndirect,
  'fc-sweep-which': FcSweepWhich,
  'fc-tension-spring': FcTensionSpring,
  'fc-temp-rate': FcTempRate,
  'fc-mte': FcMte,
  'fc-modern-balance': FcModernBalance,
  'fc-settle': FcSettle,
  'fc-coupling': FcCoupling,
  'fc-counting': FcCounting,
  'fc-reset': FcReset,
  'fc-chrono-id': FcChronoId,
  'fc-cycle': FcCycle,
  'fc-no-reset': FcNoReset,
  'fc-store-zero': FcStoreZero,
  'fc-chrono-drain': FcChronoDrain,
  'fc-zero-refit': FcZeroRefit,
  'fc-hand-hammer': FcHandHammer,
  'fc-tachy': FcTachy,
  'fc-windows': FcWindows,
  'fc-daydate': FcDayDate,
  'fc-gmt-types': FcGmtTypes,
  'fc-gmt-test': FcGmtTest,
  'fc-advance': FcAdvance,
  'fc-moon-disc': FcMoonDisc,
  'fc-moon-set': FcMoonSet,
  'fc-perpetual': FcPerpetual,
  'fc-rep-types': FcRepTypes,
  'fc-rep-snail': FcRepSnail,
  'fc-rep-power': FcRepPower,
  'fc-all-or-nothing': FcAllOrNothing,
  'fc-study': FcStudy,
  'fc-cw-cam': FcCwCam,
  'fc-dismantle': FcDismantle,
  'fc-depth': FcDepth,
  'fc-prove-reset': FcProveReset,
  'fc-drag': FcDrag,
}
