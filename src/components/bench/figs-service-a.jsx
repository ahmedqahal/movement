// Diagrams for the "Servicing a Movement" lessons: what a service involves,
// teardown, cleaning, oiling, shock settings, the automatic module,
// reassembly and final testing. Each drawing shows the operation of its step
// and only the numbers the step itself gives.
// Original schematics built on the strap kit. Nothing is traced from an ETA,
// Witschi or other published figure; maker marks are drawn as the app's own
// generic symbols.
import { C, Fig, T, Note, Dim, Arrow, Num, Verdict, Tag, Sep } from '../strap/kit.jsx'

/* ------------------------------------------------------------------ */
/* Palette and defs for this file                                       */
/* ------------------------------------------------------------------ */
const M = {
  plate: '#5b5339',
  plateL: '#8b8574',
  dial: '#d8d0bd',
  dialDark: '#25221f',
  oil: '#7fc4e8',
  oilOld: '#8a5a24',
  grease: '#8fd19e',
  brake: '#e0b45a',
  ink: '#120f0d',
  ruby: '#c9495e',
  brassP: '#b89548',
  brassD: '#7d6430',
  steelD: '#55646e',
  tray: '#e4dccb',
  glass: '#a9d0de',
  rodico: '#5f8fc9',
  cot: '#e9d9b5',
  fluid: 'rgba(120,180,210,0.28)',
  screen: '#1d2a24',
  lcd: '#b7c9b5',
}

function SDefs() {
  const hatch = (id, bg, fg) => (
    <pattern id={id} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="6" height="6" fill={bg} />
      <line x1="0" y1="0" x2="0" y2="6" stroke={fg} strokeWidth="1.1" />
    </pattern>
  )
  return (
    <defs>
      {hatch('sa-cut', '#6f6a55', '#8f8a72')}
      {hatch('sa-scut', '#6f808b', '#a3b3bd')}
      {hatch('sa-mov', '#433c31', '#5e5546')}
      <pattern id="sa-knurl" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#a7b6bf" />
        <line x1="2" y1="0" x2="2" y2="4" stroke="#55646e" strokeWidth="1" />
      </pattern>
      <radialGradient id="sa-ball" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.5" stopColor="#b9c7d0" />
        <stop offset="1" stopColor="#4e5f6a" />
      </radialGradient>
      <linearGradient id="sa-rotor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c8d2d8" />
        <stop offset="1" stopColor="#6d7f8a" />
      </linearGradient>
    </defs>
  )
}

const F = ({ children, ...p }) => (
  <Fig {...p}>
    <SDefs />
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

// Step box: numbered, a bold line and a dim line
function StepBox({ x, y, w, n, a, b, h = 44, c = C.brass }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill="rgba(255,255,255,0.03)" stroke={c} strokeOpacity="0.6" />
      {n !== undefined && <Num x={x + 14} y={y + h / 2} n={n} r={8} />}
      <T x={x + (n !== undefined ? 28 : 10)} y={b ? y + h / 2 - 3 : y + h / 2 + 4} s={11} c={C.text} w={600}>{a}</T>
      {b && <T x={x + (n !== undefined ? 28 : 10)} y={y + h / 2 + 11} s={10} c={C.dim}>{b}</T>}
    </g>
  )
}

// Checklist row with a verdict mark
function Row({ x, y, w, ok, a, b, bx }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={26} rx="5" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      {ok !== undefined && <Verdict x={x + 14} y={y + 13} ok={ok} r={7} />}
      <T x={x + (ok !== undefined ? 28 : 10)} y={y + 17} s={10.5} c={C.text} w={600}>{a}</T>
      {b && <T x={bx || x + 170} y={y + 17} s={10.5} c={C.dim}>{b}</T>}
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

// A curved turning arrow round (cx, cy). from/to in clock degrees; increasing = clockwise.
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
function Face({ cx, cy, r, h = 300, m = 60, s, crown = true, dial = M.dialDark, date }) {
  const hand = (deg, len, wdt, col) => {
    const [x, y] = clk(cx, cy, len, deg)
    return <line x1={cx} y1={cy} x2={x} y2={y} stroke={col} strokeWidth={wdt} strokeLinecap="round" />
  }
  return (
    <g>
      {crown && <rect x={cx + r - 1} y={cy - r * 0.13} width={r * 0.2} height={r * 0.26} rx="2" fill="url(#sa-knurl)" stroke="#55646e" strokeWidth="0.5" />}
      <circle cx={cx} cy={cy} r={r} fill="url(#sk-steel)" stroke="#55646e" />
      <circle cx={cx} cy={cy} r={r * 0.86} fill={dial} stroke={C.struct} strokeWidth="0.6" />
      {Array.from({ length: 12 }, (_, i) => {
        const [a, b] = clk(cx, cy, r * 0.82, i * 30)
        const [c2, d2] = clk(cx, cy, r * (i % 3 === 0 ? 0.68 : 0.73), i * 30)
        return <line key={i} x1={a} y1={b} x2={c2} y2={d2} stroke={dial === M.dialDark ? C.dim : '#3a342c'} strokeWidth={i % 3 === 0 ? 1.8 : 1.1} />
      })}
      {date && (
        <g>
          <rect x={cx + r * 0.42} y={cy - r * 0.12} width={r * 0.26} height={r * 0.24} fill="#f2ede0" stroke={C.struct} strokeWidth="0.5" />
          <T x={cx + r * 0.55} y={cy + r * 0.08} a="middle" s={10} c="#2b2620" w={700}>{date}</T>
        </g>
      )}
      {hand(h, r * 0.48, Math.max(2, r * 0.07), C.brassHi)}
      {hand(m, r * 0.72, Math.max(1.6, r * 0.045), C.brassHi)}
      {s !== undefined && hand(s, r * 0.78, 1, C.ruby)}
      <circle cx={cx} cy={cy} r={Math.max(2, r * 0.05)} fill={C.brassHi} />
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
function Balance({ cx, cy, r, spring = true }) {
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
      {spring && <polyline points={sp.map((p) => p.join(',')).join(' ')} fill="none" stroke={C.steel} strokeWidth="0.9" />}
      <circle cx={cx} cy={cy} r={2.6} fill={M.ruby} />
    </g>
  )
}

// Escape wheel (club teeth, schematic) in plan
function EscW({ cx, cy, r, n = 15, c = C.steel, rot = 0 }) {
  const pts = []
  for (let i = 0; i < n; i++) {
    const a = rot + (i * 360) / n
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

// Pallet fork in plan, schematic: pivot at (x,y), stones point toward −y
// (the escape wheel side), lever and horns run toward +y. tilt in degrees.
function Fork({ x, y, k = 1, tilt = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${k})`}>
      <path d="M-26 -10 L-4 -2 L-4 46 L-9 58 L-3 58 L0 52 L3 58 L9 58 L4 46 L4 -2 L26 -10 L22 -16 L0 -8 L-22 -16 Z" fill="rgba(134,167,189,0.22)" stroke={C.steel} strokeWidth="1.1" strokeLinejoin="round" />
      <rect x="-27" y="-24" width="6" height="12" rx="1" transform="rotate(-18 -24 -18)" fill={M.ruby} />
      <rect x="21" y="-24" width="6" height="12" rx="1" transform="rotate(18 24 -18)" fill={M.ruby} />
      <circle cx="0" cy="0" r="3" fill={M.ruby} stroke={C.ground} strokeWidth="0.6" />
    </g>
  )
}

// Jewel in section: hole of half-width hw, oil sink on top. Plate either side.
function JewelSec({ cx, cy, w = 70, h = 16, hw = 4, sink = 9, plate = 40, sinkDown, pf = 'url(#sa-cut)' }) {
  const t = cy - h / 2
  const b = cy + h / 2
  const s = sinkDown ? -1 : 1
  const top = sinkDown ? b : t
  const bot = sinkDown ? t : b
  const half = (d) => `M${cx + d * (w / 2)} ${top} L${cx + d * (hw + sink)} ${top} L${cx + d * hw} ${top + s * sink * 0.7} L${cx + d * hw} ${bot} L${cx + d * (w / 2)} ${bot} Z`
  return (
    <g>
      {plate > 0 && [-1, 1].map((d) => <rect key={d} x={d < 0 ? cx - w / 2 - plate : cx + w / 2} y={t - 4} width={plate} height={h + 8} fill={pf} stroke="#4a4436" strokeWidth="0.6" />)}
      <path d={half(-1)} fill={M.ruby} stroke="#7a2232" strokeWidth="0.8" />
      <path d={half(1)} fill={M.ruby} stroke="#7a2232" strokeWidth="0.8" />
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
      <rect x="-6" y={-len} width="12" height={Math.max(0, len - 30)} rx="2" fill="url(#sa-knurl)" stroke="#55646e" strokeWidth="0.6" />
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
function Pegwood({ len = 80, w = 4 }) {
  return <path d={`M0 0 L${-w * 0.7} ${-len * 0.28} L${-w} ${-len} L${w} ${-len} L${w * 0.7} ${-len * 0.28} Z`} fill="url(#sk-wood)" stroke="#5e4027" strokeWidth="0.6" />
}
// Air blower: nozzle tip at (0,0), bulb up and to the left
function Blower({ puff = true, k = 1 }) {
  return (
    <g transform={`scale(${k})`}>
      <ellipse cx="-30" cy="-34" rx="20" ry="15" fill="#3b3833" stroke={C.dim} />
      <path d="M-16 -24 L-2 -4" stroke={C.dim} strokeWidth="4" strokeLinecap="round" />
      {puff && [0, 1, 2].map((i) => <path key={i} d={`M${3 + i * 4} ${2 + i * 3} q5 1 6 6`} fill="none" stroke={M.glass} strokeWidth="1.2" />)}
    </g>
  )
}
// Jar with fluid, lid optional. (x,y) = top-left of jar body
function Jar({ x, y, w = 60, h = 56, fluid = M.fluid, lid, label, lc = C.dim }) {
  return (
    <g>
      <rect x={x} y={y + h * 0.25} width={w} height={h * 0.75} rx="3" fill={fluid} />
      <rect x={x} y={y} width={w} height={h} rx="4" fill="none" stroke={C.dim} strokeWidth="1.2" />
      {lid && <rect x={x - 3} y={y - 7} width={w + 6} height={7} rx="2" fill={C.struct} />}
      {label && (
        <T x={x + w / 2} y={y + h + 14} a="middle" s={10.5} c={lc}>
          {label}
        </T>
      )}
    </g>
  )
}
// Timegrapher readout: three values in a screen
function Screen({ x, y, w = 150, rows }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={14 + rows.length * 22} rx="5" fill={M.screen} stroke={C.steel} />
      {rows.map(([k, v], i) => (
        <g key={k}>
          <T x={x + 10} y={y + 25 + i * 22} s={10.5} c={C.dim}>{k}</T>
          <T x={x + w - 10} y={y + 26 + i * 22} a="end" s={12} mono c={M.lcd} w={700}>{v}</T>
        </g>
      ))}
    </g>
  )
}

/* ================================================================== */
/* svc-overview · what a full service involves                          */
/* ================================================================== */

// A pivot running in its jewel, in section. state: 'fresh' | 'old'
function PivotSec({ cx, cy, old }) {
  return (
    <g>
      <JewelSec cx={cx} cy={cy} w={72} h={16} hw={5} sink={10} plate={34} />
      {/* arbor and pivot from below */}
      <rect x={cx - 12} y={cy + 22} width={24} height={28} fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.6" />
      {old ? (
        <path d={`M${cx - 4.5} ${cy + 22} L${cx - 4.5} ${cy + 6} Q${cx - 0.5} ${cy} ${cx - 4.5} ${cy - 6} L${cx - 4.5} ${cy - 10} L${cx + 4.5} ${cy - 10} L${cx + 4.5} ${cy - 6} Q${cx + 0.5} ${cy} ${cx + 4.5} ${cy + 6} L${cx + 4.5} ${cy + 22} Z`} fill="url(#sk-steelH)" stroke={C.ruby} strokeWidth="0.9" />
      ) : (
        <rect x={cx - 4.5} y={cy - 10} width={9} height={32} fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.6" />
      )}
      {old ? (
        <g>
          <path d={`M${cx - 15} ${cy - 8} Q${cx - 10} ${cy - 16} ${cx - 3} ${cy - 13} L${cx + 4} ${cy - 15} Q${cx + 14} ${cy - 13} ${cx + 14} ${cy - 7} L${cx + 6} ${cy - 3} L${cx - 6} ${cy - 3} Z`} fill={M.oilOld} opacity="0.9" />
          {[[-10, -10], [9, -9], [1, -15], [-4, -7]].map(([dx, dy], i) => <circle key={i} cx={cx + dx} cy={cy + dy} r="1.4" fill={M.ink} />)}
        </g>
      ) : (
        <path d={`M${cx - 15} ${cy - 8} L${cx - 5} ${cy - 1.5} L${cx + 5} ${cy - 1.5} L${cx + 15} ${cy - 8} Q${cx} ${cy - 14} ${cx - 15} ${cy - 8} Z`} fill={M.oil} opacity="0.9" />
      )}
    </g>
  )
}

function SaWhy() {
  // amplitude over years, schematic sawtooth
  const x0 = 262
  const y0 = 236
  const pts = (a, b) => {
    const p = []
    for (let i = 0; i <= 20; i++) {
      const t = i / 20
      p.push([a + (b - a) * t, 76 + 120 * Math.pow(t, 1.6)])
    }
    return p
  }
  const seg1 = pts(x0 + 6, x0 + 120)
  const seg2 = pts(x0 + 120, x0 + 196)
  return (
    <F h={300} view="Section + chart · why service" scale="schematic, magnified">
      <Pn x={12} y={26} w={226} h={118} t="After a service" tc={C.emerald} c={C.emerald} ok />
      <PivotSec cx={86} cy={88} />
      <Lab p={[92, 78]} x={176} y={60} text="clean oil" a="start" up />
      <Lab p={[86, 104]} x={164} y={112} text="smooth pivot" a="start" />
      <Lab p={[66, 88]} x={176} y={88} text="jewel" a="start" />

      <Pn x={12} y={152} w={226} h={136} t="Years later" tc={C.ruby} c={C.ruby} ok={false} />
      <PivotSec cx={86} cy={214} old />
      <Lab p={[80, 201]} x={164} y={196} text="oil dried and" a="start" up />
      <T x={168} y={212} s={10.5} c={C.text}>thickened</T>
      <Lab p={[95, 205]} x={164} y={228} text="dirt" a="start" />
      <Lab p={[89, 214]} x={164} y={250} text="dry pivot" a="start" />
      <T x={168} y={266} s={10.5} c={C.text}>wears</T>
      <T x={24} y={280} s={10} c={C.faint}>drag rises at every pivot like this</T>

      {/* chart */}
      <line x1={x0} y1={60} x2={x0} y2={y0} stroke={C.struct} />
      <line x1={x0} y1={y0} x2={460} y2={y0} stroke={C.struct} />
      <T x={x0 - 6} y={54} s={10.5} c={C.dim} a="start">amplitude</T>
      <T x={460} y={y0 + 16} a="end" s={10.5} c={C.dim}>years</T>
      <polyline points={seg1.map((p) => p.join(',')).join(' ')} fill="none" stroke={C.brassHi} strokeWidth="2" />
      <line x1={x0 + 120} y1={seg1[20][1]} x2={x0 + 120} y2={76} stroke={C.emerald} strokeWidth="2" />
      <polyline points={seg2.map((p) => p.join(',')).join(' ')} fill="none" stroke={C.brassHi} strokeWidth="2" />
      <line x1={x0 + 120} y1={y0} x2={x0 + 120} y2={y0 + 6} stroke={C.emerald} />
      <T x={x0 + 120} y={y0 + 18} a="middle" s={10.5} c={C.emerald}>service</T>
      <Arrow a={[x0 + 108, 98]} b={[x0 + 118, 84]} c="emerald" w={1.4} />
      <T x={x0 + 108} y={110} a="end" s={10.5} c={C.emerald}>resets it</T>
      <T x={x0 + 8} y={204} s={10.5} c={C.text}>amplitude falls,</T>
      <T x={x0 + 8} y={218} s={10.5} c={C.text}>timekeeping drifts</T>
      <T x={250} y={270} s={10.5} c={C.dim}>A service cleans, re-oils and replaces</T>
      <T x={250} y={284} s={10.5} c={C.dim}>worn parts, so the cycle starts again.</T>
    </F>
  )
}

function SaExpect() {
  return (
    <F h={290} view="Comparison · plan the first service" scale="schematic">
      <Tag x={14} y={44}>Time</Tag>
      <Pn x={12} y={52} w={222} h={92} c={C.ruby} ok={false} />
      <T x={24} y={74} s={11.5} c={C.text} w={600}>An evening</T>
      <rect x={24} y={86} width={196} height={14} rx="3" fill="rgba(255,255,255,0.04)" stroke={C.line} />
      <rect x={24} y={86} width={34} height={14} rx="3" fill={C.ruby} opacity="0.6" />
      <T x={24} y={120} s={10.5} c={C.dim}>rushing is how parts get lost</T>
      <T x={24} y={134} s={10.5} c={C.dim}>and springs go flying</T>
      <Pn x={246} y={52} w={222} h={92} c={C.emerald} ok />
      <T x={258} y={74} s={11.5} c={C.text} w={600}>A weekend project</T>
      <rect x={258} y={86} width={196} height={14} rx="3" fill="rgba(255,255,255,0.04)" stroke={C.line} />
      <rect x={258} y={86} width={92} height={14} rx="3" fill={C.emerald} opacity="0.6" />
      <rect x={354} y={86} width={92} height={14} rx="3" fill={C.emerald} opacity="0.6" />
      <T x={304} y={97} a="middle" s={10} c={C.ground} w={700}>day 1</T>
      <T x={400} y={97} a="middle" s={10} c={C.ground} w={700}>day 2</T>
      <T x={258} y={120} s={10.5} c={C.dim}>time to strip, clean, oil,</T>
      <T x={258} y={134} s={10.5} c={C.dim}>rebuild and test</T>

      <Tag x={14} y={170}>The movement</Tag>
      <Pn x={12} y={178} w={222} h={100} c={C.emerald} ok />
      <circle cx={60} cy={228} r={32} fill={M.plate} stroke={C.brass} />
      <Wheel cx={50} cy={218} r={12} />
      <Balance cx={72} cy={238} r={11} />
      <Note x={104} y={206} lines={['cheap', 'common', 'spares you can buy']} c={C.text} s={11} lh={16} />
      <T x={104} y={264} s={10} c={C.faint}>a broken part is a lesson</T>
      <Pn x={246} y={178} w={222} h={100} c={C.ruby} ok={false} />
      <Face cx={296} cy={228} r={30} h={300} m={50} dial={M.dial} />
      <Note x={338} y={206} lines={['valuable', 'sentimental', 'irreplaceable parts']} c={C.text} s={11} lh={16} />
      <T x={338} y={264} s={10} c={C.faint}>a broken part is a loss</T>
    </F>
  )
}

function Glasses({ x, y, k = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d="M-44 -6 Q-44 -18 -26 -18 L-8 -18 Q-2 -18 -2 -8 Q0 -12 2 -8 Q2 -18 8 -18 L26 -18 Q44 -18 44 -6 Q44 12 24 12 Q8 12 4 2 L-4 2 Q-8 12 -24 12 Q-44 12 -44 -6 Z" fill="rgba(169,208,222,0.25)" stroke={C.steel} strokeWidth="1.8" />
      <path d="M-44 -12 L-60 -16 M44 -12 L60 -16" stroke={C.steel} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M-34 -12 L-22 -12 M14 -12 L26 -12" stroke="#ffffff" strokeWidth="1.4" opacity="0.6" strokeLinecap="round" />
    </g>
  )
}

function SaSafety() {
  return (
    <F h={306} view="Safety · eyes and waste" scale="schematic">
      <Pn x={12} y={26} w={210} h={162} t="Eye protection" tc={C.emerald} c={C.emerald} ok />
      <Glasses x={117} y={80} k={1.1} />
      <T x={117} y={122} a="middle" s={11} c={C.text} w={600}>compulsory on ETA’s sheet</T>
      <T x={117} y={137} a="middle" s={10.5} c={C.dim}>for all work on a movement</T>
      <path d="M40 160 l4 -3 l3 4 l4 -3 l3 4 l4 -3" stroke={C.text} strokeWidth="1.1" fill="none" />
      <Arrow a={[64, 158]} b={[86, 150]} c="ruby" w={1.3} />
      <T x={92} y={162} s={10.5} c={C.dim}>springs</T>
      <rect x={140} y={150} width={14} height={18} rx="2" fill={M.fluid} stroke={C.dim} />
      <path d="M160 154 q4 -6 8 0" stroke={M.glass} fill="none" />
      <T x={172} y={162} s={10.5} c={C.dim}>fluid</T>

      <Pn x={232} y={26} w={236} h={162} t="Used fluids" />
      <Jar x={252} y={64} w={52} h={62} lid fluid="rgba(138,90,36,0.45)" />
      <rect x={256} y={92} width={44} height={18} rx="2" fill="#efe6cf" />
      <T x={278} y={105} a="middle" s={10} c="#2b2620" w={700}>WASTE</T>
      <Verdict x={278} y={150} ok r={8} />
      <T x={278} y={176} a="middle" s={10.5} c={C.text}>closed container</T>
      {/* drain */}
      <circle cx={350} cy={100} r={22} fill="#2a2724" stroke={C.dim} />
      {[-12, -6, 0, 6, 12].map((d) => <line key={d} x1={350 + d} y1={84} x2={350 + d} y2={116} stroke={C.dim} strokeWidth="1.4" />)}
      <path d="M332 82 L368 118" stroke={C.ruby} strokeWidth="2.6" />
      <T x={350} y={136} a="middle" s={10.5} c={C.text}>drain</T>
      {/* ground */}
      <path d="M396 108 L452 108" stroke="#6b5a45" strokeWidth="2" />
      <rect x={396} y={108} width={56} height={12} fill="url(#sk-hatch)" />
      <ellipse cx={424} cy={104} rx={14} ry={4} fill="rgba(138,90,36,0.6)" />
      <path d="M406 84 L442 120" stroke={C.ruby} strokeWidth="2.6" />
      <T x={424} y={136} a="middle" s={10.5} c={C.text}>ground</T>
      <Verdict x={387} y={160} ok={false} r={8} />
      <T x={387} y={182} a="middle" s={10.5} c={C.text}>never pour away</T>

      <Sep x1={12} y1={200} x2={468} y2={200} />
      <StepBox x={12} y={212} w={146} n={1} a="Collect" b="in a closed jar" />
      <Arrow a={[160, 234]} b={[170, 234]} c="brass" w={1.3} />
      <StepBox x={172} y={212} w={146} n={2} a="Label it" b="what it is, the date" />
      <Arrow a={[320, 234]} b={[330, 234]} c="brass" w={1.3} />
      <StepBox x={332} y={212} w={136} n={3} a="Dispose legally" b="check local rules" />
      <T x={14} y={282} s={10.5} c={C.dim}>ETA’s sheet says lubricants and cleaning products must be disposed of legally.</T>
    </F>
  )
}

function SaPhotos() {
  const Photo = ({ x, y, n, label, children }) => (
    <g>
      <rect x={x} y={y} width={106} height={84} rx="4" fill="#1f1b17" stroke={C.dim} />
      <rect x={x + 4} y={y + 4} width={98} height={76} rx="2" fill="#2b2620" />
      {children}
      <Num x={x + 13} y={y + 13} n={n} r={7} />
      <T x={x + 53} y={y + 98} a="middle" s={10.5} c={C.text}>{label}</T>
    </g>
  )
  return (
    <F h={316} view="Sequence · a photo before each part comes off" scale="schematic">
      <Photo x={12} y={30} n={1} label="as received">
        <circle cx={65} cy={74} r={30} fill={M.plate} stroke={C.brass} />
        <path d="M44 56 L86 60 L88 90 L46 92 Z" fill={M.plateL} opacity="0.8" />
        <Balance cx={74} cy={86} r={10} />
      </Photo>
      <Photo x={128} y={30} n={2} label="balance out">
        <circle cx={181} cy={74} r={30} fill={M.plate} stroke={C.brass} />
        <path d="M160 56 L202 60 L204 90 L162 92 Z" fill={M.plateL} opacity="0.8" />
      </Photo>
      <Photo x={244} y={30} n={3} label="bridge off">
        <circle cx={297} cy={74} r={30} fill={M.plate} stroke={C.brass} />
        <Wheel cx={286} cy={66} r={11} spokes={3} />
        <Wheel cx={306} cy={80} r={8} spokes={3} />
        <EscW cx={292} cy={92} r={6} />
      </Photo>
      <Photo x={360} y={30} n={4} label="wheels out">
        <circle cx={413} cy={74} r={30} fill={M.plate} stroke={C.brass} />
        {[[402, 66], [422, 80], [408, 92]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={2.2} fill={M.ruby} />)}
      </Photo>

      <Sep x1={12} y1={146} x2={468} y2={146} />
      <Tag x={14} y={166}>Why: one bridge, three pivots at once</Tag>
      {/* train bridge in section over three wheels */}
      <rect x={30} y={194} width={250} height={14} rx="3" fill={M.plateL} stroke={C.struct} />
      <rect x={30} y={268} width={250} height={14} fill="url(#sa-cut)" stroke="#4a4436" strokeWidth="0.6" />
      {[[80, 'third'], [150, 'fourth'], [220, 'escape']].map(([x, n], i) => (
        <g key={n}>
          <rect x={x - 3} y={208} width={6} height={60} fill="url(#sk-steelH)" />
          <rect x={x - (22 - i * 4)} y={236 - i * 8} width={44 - i * 8} height={4} fill={M.brassP} />
          <rect x={x - 6} y={196} width={12} height={10} fill={M.ruby} />
          <T x={x} y={300} a="middle" s={10.5} c={C.dim}>{n}</T>
        </g>
      ))}
      <Arrow a={[155, 186]} b={[155, 196]} c="brass" w={1.4} />
      <T x={155} y={182} a="middle" s={10.5} c={C.brassHi}>lower the bridge</T>
      <Note x={300} y={200} lines={['Every pivot must find', 'its jewel together.', 'The photo shows where', 'each wheel sat and', 'which way it faced.']} c={C.text} s={10.5} lh={15} />
      <T x={300} y={290} s={10} c={C.faint}>the photos are your reassembly map</T>
    </F>
  )
}

function SaIntake() {
  const Line = ({ x, y, w, label }) => (
    <g>
      <T x={x} y={y} s={10.5} c={C.dim}>{label}</T>
      <line x1={x} y1={y + 6} x2={x + w} y2={y + 6} stroke={C.faint} strokeDasharray="2 2" />
    </g>
  )
  return (
    <F h={334} view="Record · the intake card" scale="schematic">
      <rect x={12} y={26} width={456} height={262} rx="6" fill="#2a2520" stroke={C.brass} strokeOpacity="0.7" />
      <rect x={12} y={26} width={456} height={22} rx="6" fill="rgba(208,168,79,0.18)" />
      <T x={22} y={41} s={10.5} c={C.brassHi} w={600}>Intake · before you touch it</T>

      <Num x={28} y={66} n={1} r={7} />
      <T x={42} y={70} s={10.5} c={C.text} w={600}>How it came to you</T>
      {['case condition', 'crown feel', 'winding', 'setting', 'the date change'].map((l, i) => (
        <Line key={l} x={42} y={90 + i * 18} w={150} label={l} />
      ))}
      <T x={42} y={188} s={10.5} c={C.text} w={600}>Owner says is wrong</T>
      <line x1={42} y1={204} x2={210} y2={204} stroke={C.faint} strokeDasharray="2 2" />

      <Num x={244} y={66} n={2} r={7} />
      <T x={258} y={70} s={10.5} c={C.text} w={600}>If it runs</T>
      {['before', 'after'].map((h, i) => <T key={h} x={330 + i * 62} y={88} s={10} c={i ? C.emerald : C.faint}>{h}</T>)}
      {['rate', 'amplitude', 'beat error'].map((r, j) => (
        <g key={r}>
          <line x1={256} y1={94 + j * 22} x2={458} y2={94 + j * 22} stroke={C.line} strokeWidth="0.6" />
          <T x={258} y={110 + j * 22} s={10.5} c={C.text}>{r}</T>
          <line x1={330} y1={112 + j * 22} x2={380} y2={112 + j * 22} stroke={C.faint} strokeDasharray="2 2" />
          <line x1={392} y1={112 + j * 22} x2={450} y2={112 + j * 22} stroke={C.emerald} strokeDasharray="2 2" />
        </g>
      ))}
      <Num x={244} y={180} n={3} r={7} />
      <T x={258} y={184} s={10.5} c={C.text} w={600}>Found during the strip</T>
      {['worn parts', 'odd screws', 'old repairs'].map((l, i) => (
        <Line key={l} x={258} y={204 + i * 18} w={190} label={l} />
      ))}
      <Sep x1={22} y1={262} x2={458} y2={262} />
      <T x={22} y={279} s={10.5} c={C.dim}>AWCI’s standards make this record part of the job, filled in as you go.</T>
      <T x={14} y={308} s={10.5} c={C.text}>At the end, take the same readings again in the “after” column.</T>
      <T x={14} y={324} s={10.5} c={C.dim}>The difference is your proof of what the service changed.</T>
    </F>
  )
}

/* ================================================================== */
/* svc-teardown · disassembly in order                                  */
/* ================================================================== */

// Ratchet wheel with fine teeth
function Ratchet({ cx, cy, r }) {
  const pts = []
  const n = 40
  for (let i = 0; i < n; i++) {
    const a = (i * 360) / n
    pts.push(pol(cx, cy, r, a), pol(cx, cy, r - 4, a + 9))
  }
  return (
    <g>
      <polygon points={pts.map((p) => p.join(',')).join(' ')} fill="url(#sk-steel)" stroke={M.steelD} strokeWidth="0.6" />
      <circle cx={cx} cy={cy} r={r * 0.62} fill="none" stroke={M.steelD} strokeWidth="0.6" opacity="0.6" />
    </g>
  )
}

function SaLetDown() {
  const cx = 96
  const cy = 142
  return (
    <F h={330} view="Plan + order · power down, then the dial side" scale="schematic">
      <Pn x={12} y={26} w={224} h={232} t="1 · Let down the mainspring" />
      <Ratchet cx={cx} cy={cy} r={50} />
      <Screw x={cx} y={cy} r={9} ang={20} />
      {/* click, its tip in the teeth */}
      <path d={`M${cx + 24} ${cy - 44} L${cx + 52} ${cy - 70} L${cx + 58} ${cy - 56} Z`} fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.7" />
      <circle cx={cx + 52} cy={cy - 62} r={2.4} fill={M.ink} />
      {/* pegwood easing the click back */}
      <G x={cx + 57} y={cy - 54} ang={95}>
        <Pegwood len={64} />
      </G>
      <Turn cx={cx} cy={cy} r={60} from={160} to={110} c="emerald" w={1.8} />
      <Lab p={[cx + 28, cy - 48]} x={56} y={66} text="click" up a="start" />
      <Lab p={[cx - 36, cy + 30]} x={40} y={214} text="ratchet wheel" a="start" />
      <T x={170} y={206} s={10.5} c={C.emerald} a="middle">unwinds</T>
      <T x={24} y={232} s={10.5} c={C.dim}>Hold the crown, ease the click off</T>
      <T x={24} y={246} s={10.5} c={C.dim}>and let the crown slip back slowly.</T>
      <Note x={24} y={278} lines={['Then take the ratchet wheel off.', 'With it gone, no power can be left.']} c={C.text} s={10.5} lh={14} />

      <Pn x={246} y={26} w={222} h={232} t="2 · Dial side, top down" />
      {[
        ['Hands', 'lift off the pipes'],
        ['Dial', 'free its feet'],
        ['Motion works', 'cannon pinion stays for now'],
        ['Keyless work', 'setting parts out'],
      ].map(([a, b], i) => (
        <g key={a}>
          <rect x={258} y={46 + i * 44} width={198} height={36} rx="5" fill="rgba(255,255,255,0.03)" stroke={i === 3 ? C.brass : C.line} />
          <Num x={272} y={64 + i * 44} n={i + 1} r={8} />
          <T x={286} y={61 + i * 44} s={11} c={C.text} w={600}>{a}</T>
          <T x={286} y={75 + i * 44} s={10} c={C.dim}>{b}</T>
        </g>
      ))}
      <T x={258} y={240} s={10.5} c={C.brassHi}>Keyless out now: winding pinion</T>
      <T x={258} y={254} s={10.5} c={C.brassHi}>and clutch can’t drop out later.</T>
      <T x={258} y={290} s={10} c={C.faint}>Full order: Service Sequence diagram</T>
    </F>
  )
}

function SaAutoOff() {
  const L = 60
  const R = 300
  return (
    <F h={300} view="Side view · automatic works off first" scale="schematic, height ×4">
      {/* movement proper */}
      <rect x={L} y={226} width={R - L} height={16} fill="url(#sa-mov)" stroke={C.struct} />
      <rect x={L + 10} y={204} width={110} height={14} rx="2" fill={M.plateL} stroke={C.struct} />
      <rect x={L + 130} y={204} width={100} height={14} rx="2" fill={M.plateL} stroke={C.struct} />
      <rect x={L + 120} y={218} width={10} height={8} fill="url(#sk-steelH)" />
      <T x={R + 12} y={222} s={10.5} c={C.dim}>movement proper</T>
      <T x={R + 12} y={236} s={10} c={C.faint}>plate and bridges</T>
      {/* lifted module */}
      <g>
        <rect x={L + 20} y={134} width={200} height={14} rx="3" fill="#7d8790" stroke={C.steel} />
        {[L + 60, L + 110, L + 160].map((x, i) => (
          <rect key={x} x={x - 10} y={148} width={20} height={5} fill={i === 1 ? C.steel : M.brassP} />
        ))}
        <rect x={L + 116} y={148} width={8} height={18} fill="url(#sk-steelH)" />
        <Screw x={L + 34} y={128} r={4} ang={10} />
        <Screw x={L + 206} y={128} r={4} ang={60} />
      </g>
      {/* lifted rotor */}
      <path d={`M${L - 4} 76 L${R + 4} 76 L${R + 4} 88 L${L - 4} 88 Z`} fill="url(#sa-rotor)" stroke={M.steelD} />
      <rect x={L + 104} y={88} width={32} height={10} fill="#9fb0bb" stroke={M.steelD} />
      <Screw x={L + 120} y={70} r={5} ang={0} />
      <Arrow a={[36, 104]} b={[36, 70]} c="brass" w={1.8} />
      <Arrow a={[36, 170]} b={[36, 136]} c="brass" w={1.8} />
      <Num x={R + 26} y={68} n={1} r={8} />
      <Num x={R + 26} y={144} n={2} r={8} />
      <T x={R + 40} y={66} s={11} c={C.text} w={600}>rotor</T>
      <T x={R + 40} y={78} s={10} c={C.dim}>lifts first</T>
      <T x={R + 40} y={140} s={11} c={C.text} w={600}>winding module</T>
      <T x={R + 40} y={154} s={10} c={C.dim}>then its bridge</T>
      <T x={R + 40} y={168} s={10} c={C.dim}>and gearing</T>
      <Lab p={[L + 160, 151]} x={L + 180} y={186} text="reversing / winding wheels" a="start" />
      <line x1={L} y1={252} x2={R} y2={252} stroke={C.line} strokeDasharray="2 3" />
      <T x={14} y={274} s={10.5} c={C.text}>On an automatic the rotor and winding module are the top layer.</T>
      <T x={14} y={290} s={10.5} c={C.dim}>Lift them off before anything in the movement itself.</T>
    </F>
  )
}

function SaTrainTest() {
  return (
    <F h={340} view="Plan + section · test the free train" scale="schematic, magnified">
      <Pn x={12} y={26} w={196} h={172} t="1 · Air at the escape wheel" />
      <Wheel cx={60} cy={110} r={30} spokes={0} />
      <T x={60} y={156} a="middle" s={10} c={C.faint}>barrel</T>
      <Wheel cx={104} cy={86} r={18} />
      <Wheel cx={128} cy={118} r={14} />
      <Wheel cx={152} cy={92} r={12} />
      <EscW cx={168} cy={128} r={12} />
      <G x={168} y={144} ang={-140}>
        <Blower k={0.7} />
      </G>
      <T x={22} y={180} s={10.5} c={C.dim}>balance and fork out,</T>
      <T x={22} y={193} s={10.5} c={C.dim}>power down</T>

      <Pn x={218} y={26} w={250} h={172} t="2 · Watch it coast" />
      <line x1={238} y1={56} x2={238} y2={160} stroke={C.struct} />
      <line x1={238} y1={160} x2={456} y2={160} stroke={C.struct} />
      <T x={244} y={58} s={10} c={C.faint}>spin</T>
      <T x={456} y={176} a="end" s={10} c={C.faint}>time</T>
      <path d="M240 64 C290 66 330 104 360 132 S400 158 420 160" fill="none" stroke={C.emerald} strokeWidth="2" />
      <T x={330} y={84} s={10.5} c={C.emerald}>free: spins a few seconds,</T>
      <T x={330} y={98} s={10.5} c={C.emerald}>coasts to a stop</T>
      <path d="M240 72 L252 72 L256 160" fill="none" stroke={C.ruby} strokeWidth="2" />
      <T x={262} y={142} s={10.5} c={C.ruby}>stops dead: a fault</T>
      <T x={228} y={190} s={10} c={C.faint}>already wrong before you strip it</T>

      <Pn x={12} y={206} w={224} h={124} t="3 · Lift: endshake" />
      <rect x={30} y={234} width={100} height={8} fill={M.plateL} stroke={C.struct} />
      <rect x={30} y={300} width={100} height={8} fill="url(#sa-cut)" />
      <rect x={76} y={234} width={8} height={8} fill={M.ruby} />
      <rect x={76} y={300} width={8} height={8} fill={M.ruby} />
      <rect x={78} y={238} width={4} height={66} fill="url(#sk-steelH)" />
      <rect x={52} y={266} width={56} height={5} fill={M.brassP} />
      <G x={108} y={272} ang={-60}>
        <Pegwood len={40} w={3} />
      </G>
      <Arrow a={[148, 266]} b={[148, 248]} c="brass" w={1.4} />
      <Note x={154} y={248} lines={['rises and', 'drops a hair']} c={C.text} s={10.5} lh={13} />
      <T x={30} y={322} s={10} c={C.ruby}>none at all: something binds</T>

      <Pn x={244} y={206} w={224} h={124} t="4 · Nudge: side-shake" />
      {[[300, true, 'right'], [400, false, 'worn hole']].map(([x, ok, l]) => (
        <g key={x}>
          <circle cx={x} cy={268} r={22} fill={M.ruby} stroke="#7a2232" />
          {ok ? <circle cx={x} cy={268} r={7} fill={C.ground} /> : <ellipse cx={x + 3} cy={268} rx={11} ry={7.5} fill={C.ground} />}
          <circle cx={x - (ok ? 1 : 1)} cy={268} r={5.5} fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.6" />
          <Arrow a={[x - 14, 302]} b={[x + 14, 302]} c="brass" w={1.2} both />
          <Verdict x={x + 30} y={246} ok={ok} r={7} />
          <T x={x} y={322} a="middle" s={10.5} c={ok ? C.emerald : C.ruby}>{l}</T>
        </g>
      ))}
    </F>
  )
}

function SaBridgeStuck() {
  return (
    <F h={330} view="Plan + section · a bridge that won’t lift" scale="schematic">
      <Pn x={12} y={26} w={262} h={180} t="Check, then ease it up" />
      <path d="M40 80 Q40 60 70 58 L230 66 Q256 70 252 96 L246 150 Q240 176 210 176 L72 170 Q42 168 40 140 Z" fill={M.plateL} stroke={C.struct} />
      {[[62, 90], [232, 92]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={5} fill={C.ground} stroke={C.struct} />
      ))}
      <Screw x={150} y={160} r={6} ang={40} />
      <circle cx={150} cy={160} r={10} fill="none" stroke={C.ruby} strokeWidth="1.6" />
      <T x={150} y={194} a="middle" s={10.5} c={C.ruby}>one screw still in</T>
      {[[110, 112], [184, 118]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={6} fill={M.ruby} stroke="#7a2232" />
      ))}
      <Lab p={[110, 112]} x={86} y={150} text="jewel" />
      {/* slot */}
      <path d="M40 120 l-6 0 l0 12 l6 0" fill={C.ground} stroke={C.struct} />
      <G x={36} y={126} ang={-25} k={0.7}>
        <Screwdriver len={70} />
      </G>
      <Verdict x={24} y={150} ok r={7} />
      <T x={22} y={176} s={10} c={C.emerald}>at the slot</T>
      <G x={190} y={112} ang={30} k={0.5}>
        <Screwdriver len={70} />
      </G>
      <Verdict x={226} y={112} ok={false} r={7} />
      <T x={218} y={58} a="middle" s={10} c={C.ruby}>never near a jewel</T>

      <Pn x={284} y={26} w={184} h={180} t="Screws stay with" />
      <T x={293} y={56} s={10} c={C.faint} ls="1.2">THEIR BRIDGE</T>
      {['barrel', 'train', 'pallet'].map((n, i) => (
        <g key={n}>
          <rect x={296} y={68 + i * 44} width={160} height={36} rx="4" fill={M.tray} stroke="#a89c82" />
          <T x={306} y={90 + i * 44} s={10.5} c="#2b2620" w={700}>{n}</T>
          {[0, 1, 2].map((j) => (
            <Screw key={j} x={376 + j * 24} y={86 + i * 44} r={5} ang={j * 50} />
          ))}
        </g>
      ))}

      <Sep x1={12} y1={216} x2={468} y2={216} />
      <Tag x={14} y={234}>Why: look-alike screws differ in length</Tag>
      {[[40, true, 'right screw'], [250, false, 'long one, wrong hole']].map(([x, ok, l]) => (
        <g key={x}>
          <rect x={x} y={250} width={150} height={20} fill="url(#sa-cut)" stroke="#4a4436" strokeWidth="0.6" />
          <rect x={x + 66} y={242} width={18} height={8} rx="2" fill="#c5ced4" stroke={M.steelD} />
          <rect x={x + 71} y={250} width={8} height={ok ? 18 : 34} fill="#c5ced4" stroke={M.steelD} strokeWidth="0.6" />
          <rect x={x + 40} y={284} width={90} height={5} fill={M.brassP} />
          <Verdict x={x + 150} y={256} ok={ok} r={7} />
          <T x={x + 75} y={310} a="middle" s={10.5} c={ok ? C.emerald : C.ruby}>{l}</T>
          {!ok && <T x={x + 75} y={324} a="middle" s={10} c={C.dim}>fouls the wheel below</T>}
        </g>
      ))}
    </F>
  )
}

function SaBarePlate() {
  return (
    <F h={300} view="Section + plan · clear the mainplate" scale="schematic">
      <Pn x={12} y={26} w={210} h={204} t="Cannon pinion, dial side" />
      <rect x={30} y={170} width={176} height={16} fill="url(#sa-cut)" stroke="#4a4436" strokeWidth="0.6" />
      <rect x={112} y={124} width={8} height={62} fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.5" />
      {/* lifted cannon pinion */}
      <rect x={106} y={84} width={20} height={34} rx="2" fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={100} y={108} width={32} height={6} fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.5" />
      <rect x={112} y={84} width={8} height={34} fill={C.ground} opacity="0.5" />
      <Arrow a={[150, 118]} b={[150, 78]} c="brass" w={1.8} />
      <T x={158} y={98} s={10.5} c={C.brassHi}>lift</T>
      <T x={158} y={111} s={10.5} c={C.brassHi}>straight</T>
      <Lab p={[106, 96]} x={44} y={70} text="cannon pinion" up a="start" />
      <Lab p={[116, 150]} x={52} y={146} text="arbor" a="end" />
      <T x={118} y={206} a="middle" s={10.5} c={C.dim}>mainplate</T>
      <T x={24} y={222} s={10} c={C.faint}>and anything else still fitted</T>

      <Pn x={232} y={26} w={236} h={204} t="Bare, ready to clean" tc={C.emerald} c={C.emerald} ok />
      <circle cx={350} cy={126} r={80} fill={M.plate} stroke={C.brass} strokeWidth="1.4" />
      {[[318, 94, 7], [372, 106, 5], [392, 140, 4], [340, 160, 4], [304, 132, 5], [356, 70, 3]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={M.ruby} stroke="#7a2232" />
      ))}
      {[[290, 80], [410, 104], [330, 196], [396, 176]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill={C.ground} stroke={C.struct} />
      ))}
      <rect x={420} y={122} width={18} height={8} fill={C.ground} stroke={C.struct} />
      <T x={350} y={222} a="middle" s={10.5} c={C.text}>only jewels and holes left</T>

      <Sep x1={12} y1={242} x2={468} y2={242} />
      <T x={14} y={262} s={10.5} c={C.text}>Every part now sits in the tray in the order it came off.</T>
      <T x={14} y={280} s={10.5} c={C.dim}>A bare plate washes clean, with nothing to trap fluid.</T>
    </F>
  )
}

/* ================================================================== */
/* svc-clean · cleaning the parts                                       */
/* ================================================================== */

function SaSort() {
  const Cell = ({ x, y, w = 146, h = 112, title, sub, tone, children }) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill="rgba(255,255,255,0.025)" stroke={tone || C.line} />
      {children}
      <T x={x + w / 2} y={y + h - 22} a="middle" s={11} c={C.text} w={600}>{title}</T>
      <T x={x + w / 2} y={y + h - 8} a="middle" s={10} c={tone || C.dim}>{sub}</T>
    </g>
  )
  return (
    <F h={300} view="Plan · sort before anything is washed" scale="schematic">
      <Cell x={12} y={30} title="Balance and cock" sub="kept separate" tone={C.brass}>
        <Balance cx={85} cy={70} r={22} />
      </Cell>
      <Cell x={167} y={30} title="Shock springs" sub="kept separate, covered" tone={C.brass}>
        <path d="M222 62 q18 -18 36 0 q-18 18 -36 0" fill="none" stroke={C.steel} strokeWidth="1.6" />
        <path d="M228 62 l-6 -4 m6 4 l-6 4" stroke={C.steel} strokeWidth="1.4" />
        <ellipse cx={240} cy={62} rx={36} ry={24} fill="none" stroke={C.dim} strokeDasharray="3 3" />
      </Cell>
      <Cell x={322} y={30} title="Mainspring, fork" sub="no harsh cycles" tone={C.ruby}>
        <circle cx={364} cy={68} r={20} fill="none" stroke={C.steel} strokeWidth="1" />
        {[16, 12, 8].map((r) => <circle key={r} cx={364} cy={68} r={r} fill="none" stroke={C.steel} strokeWidth="1" />)}
        <Fork x={430} y={60} k={0.55} />
      </Cell>
      <Cell x={12} y={152} title="Screws" sub="grouped by bridge">
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={26 + i * 40} y={166} width={34} height={42} rx="3" fill={M.tray} stroke="#a89c82" />
            <Screw x={43 + i * 40} y={180} r={4} ang={i * 30} />
            <Screw x={43 + i * 40} y={196} r={4} ang={i * 30 + 60} />
          </g>
        ))}
      </Cell>
      <Cell x={167} y={152} w={301} title="Plates, bridges, wheels" sub="into the cleaning baskets">
        <rect x={190} y={166} width={120} height={58} rx="4" fill="url(#sk-hatch)" stroke={C.dim} />
        <circle cx={228} cy={194} r={20} fill={M.plate} stroke={C.brass} />
        <Wheel cx={280} cy={186} r={12} spokes={4} />
        <Wheel cx={290} cy={210} r={8} spokes={3} />
        <rect x={326} y={166} width={120} height={58} rx="4" fill="url(#sk-hatch)" stroke={C.dim} />
        <path d="M340 186 L400 180 L430 194 L380 210 Z" fill={M.plateL} stroke={C.struct} />
      </Cell>
      <T x={14} y={288} s={10.5} c={C.dim}>Group screws so none are lost; the delicate parts never share a basket.</T>
    </F>
  )
}

// The app's own "keep out of the wash" symbol: a basket with a bar through it
function NoWash({ x, y, k = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d="M-12 -6 L12 -6 L9 10 L-9 10 Z" fill="none" stroke={C.ruby} strokeWidth="1.8" />
      <path d="M-14 -10 Q-8 -14 -2 -10 Q4 -6 10 -10" fill="none" stroke={M.oil} strokeWidth="1.6" />
      <line x1="-16" y1="12" x2="16" y2="-14" stroke={C.ruby} strokeWidth="2.2" />
    </g>
  )
}

function Reverser({ cx, cy, r }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={M.brassP} strokeWidth={Math.max(2, r * 0.14)} strokeDasharray="2 1.6" />
      <circle cx={cx} cy={cy} r={r * 0.82} fill="rgba(201,162,76,0.12)" stroke={M.brassP} />
      <circle cx={cx} cy={cy} r={r * 0.42} fill="none" stroke={C.steel} />
      <circle cx={cx} cy={cy} r={r * 0.14} fill={M.ruby} />
    </g>
  )
}

function SaNoWash() {
  return (
    <F h={316} view="Check · parts that stay out of the wash" scale="schematic">
      <Pn x={12} y={26} w={218} h={170} t="1 · Read the sheet" />
      <rect x={26} y={46} width={190} height={136} rx="3" fill="#efe6cf" />
      <T x={36} y={64} s={10.5} c="#2b2620" w={700}>2824-2</T>
      <Reverser cx={66} cy={102} r={16} />
      <Reverser cx={112} cy={102} r={16} />
      <NoWash x={168} y={102} />
      <T x={36} y={140} s={10.5} c="#2b2620">both reversing wheels:</T>
      <T x={36} y={154} s={10.5} c="#2b2620">do not wash; exchange for</T>
      <T x={36} y={168} s={10.5} c="#2b2620">prelubricated originals</T>
      <T x={22} y={210} s={10} c={C.faint}>symbol drawn by the app, not ETA’s</T>

      <Pn x={240} y={26} w={228} h={84} t="Also, per Sellita’s charts" />
      <circle cx={274} cy={76} r={18} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={274} cy={76} r={6} fill={M.steelD} />
      <T x={302} y={72} s={10.5} c={C.text}>SW500 RDM+ barrel</T>
      <T x={302} y={86} s={10.5} c={C.dim}>isn’t cleaned at service</T>
      <T x={302} y={100} s={10} c={C.faint}>as reported by Caliber Corner</T>

      <Pn x={240} y={118} w={228} h={78} t="2 · Set them aside" tc={C.emerald} c={C.emerald} ok />
      <ellipse cx={300} cy={168} rx={40} ry={10} fill={M.tray} stroke="#a89c82" />
      <path d="M262 164 Q300 128 338 164" fill="rgba(169,208,222,0.18)" stroke={M.glass} />
      <Reverser cx={290} cy={162} r={7} />
      <Reverser cx={310} cy={162} r={7} />
      <T x={350} y={160} s={10.5} c={C.text}>covered dish</T>

      <Sep x1={12} y1={226} x2={468} y2={226} />
      <Verdict x={26} y={252} ok={false} r={8} />
      <T x={42} y={256} s={11} c={C.text} w={600}>Washed one by mistake?</T>
      <Bx x={42} y={268} w={190} h={36} l={['factory lubricant has gone']} c={C.ruby} />
      <Arrow a={[234, 286]} b={[256, 286]} c="ruby" w={1.4} />
      <Bx x={258} y={268} w={140} h={36} l={['replace the part']} c={C.ruby} />
    </F>
  )
}

function SaPeg() {
  return (
    <F h={316} view="Section · peg each jewel hole" scale="schematic, magnified">
      <Pn x={12} y={26} w={140} h={200} t="Before" tc={C.ruby} c={C.ruby} />
      <JewelSec cx={82} cy={130} w={84} h={22} hw={7} sink={12} plate={0} />
      {[-1, 1].map((d) => (
        <path key={d} d={`M${82 + d * 7} ${120} l${d * -2} 4 l0 14 l${d * 2} 4`} fill="none" stroke={M.oilOld} strokeWidth="3" />
      ))}
      <path d="M62 118 Q70 112 76 122" fill="none" stroke={M.oilOld} strokeWidth="3" />
      <Lab p={[76, 132]} x={82} y={190} text="dried oil" />
      <T x={82} y={204} a="middle" s={10} c={C.faint}>the machine missed</T>

      <Pn x={162} y={26} w={156} h={200} t="Peg it" />
      <JewelSec cx={240} cy={160} w={84} h={22} hw={7} sink={12} plate={0} />
      <G x={240} y={168} ang={0}>
        <path d="M0 0 L-6 -22 L-7 -92 L7 -92 L6 -22 Z" fill="url(#sk-wood)" stroke="#5e4027" strokeWidth="0.6" />
      </G>
      <ellipse cx={240} cy={86} rx={20} ry={7} fill="none" stroke={C.brass} strokeWidth="1.8" strokeDasharray="60 200" />
      <Arrow d="M222 88 Q240 98 258 88" c="brass" w={1.8} />
      <T x={240} y={60} a="middle" s={10.5} c={C.brassHi}>about a half turn</T>
      <Lab p={[238, 120]} x={252} y={128} text="sharpened" a="start" />
      <T x={256} y={146} s={10.5} c={C.text}>pegwood</T>
      <T x={240} y={200} a="middle" s={10.5} c={C.dim}>point fills the hole</T>

      <Pn x={328} y={26} w={140} h={200} t="After" tc={C.emerald} c={C.emerald} ok />
      <JewelSec cx={398} cy={130} w={84} h={22} hw={7} sink={12} plate={0} />
      <Lab p={[398, 130]} x={398} y={190} text="spotless hole" />
      <T x={398} y={204} a="middle" s={10} c={C.faint}>ready to hold fresh oil</T>

      <Sep x1={12} y1={238} x2={468} y2={238} />
      <T x={14} y={258} s={10.5} c={C.text}>Peg out the dried oil the cleaning machine missed.</T>
      <T x={14} y={276} s={10.5} c={C.dim}>A jewel must be spotless to hold fresh oil properly.</T>
    </F>
  )
}

function SaBalanceDip() {
  // balance cock in side view with balance hanging below
  const Cock = ({ x, y }) => (
    <g>
      <path d={`M${x - 46} ${y} L${x + 20} ${y} L${x + 20} ${y + 10} L${x - 46} ${y + 10} Z`} fill={M.plateL} stroke={C.struct} />
      <circle cx={x - 34} cy={y + 5} r={3.4} fill={C.ground} stroke={C.struct} />
      <rect x={x - 2} y={y + 10} width={4} height={14} fill="url(#sk-steelH)" />
      <rect x={x - 22} y={y + 22} width={44} height={6} rx="2" fill={M.brassP} />
      <path d={`M${x - 14} ${y + 18} q14 -4 28 0`} fill="none" stroke={C.steel} strokeWidth="1" />
    </g>
  )
  return (
    <F h={320} view="Side view · the balance gets its own dip" scale="schematic">
      <Pn x={12} y={26} w={210} h={232} t="1 · Dip by the cock hole" />
      <Jar x={52} y={150} w={130} h={90} />
      <T x={117} y={232} a="middle" s={10.5} c={C.dim}>degreaser</T>
      <Cock x={130} y={160} />
      <path d={`M96 165 L96 70 Q96 56 110 56 L160 56`} fill="none" stroke={C.steel} strokeWidth="1.6" />
      <Lab p={[96, 165]} x={106} y={104} text="held by" a="start" />
      <T x={110} y={118} s={10.5} c={C.text}>the cock hole</T>
      <Arrow a={[200, 76]} b={[200, 124]} c="brass" w={1.6} both />
      <T x={200} y={68} a="middle" s={10} c={C.brassHi}>dip</T>
      <Lab p={[140, 184]} x={170} y={144} text="balance" a="start" />

      <Pn x={232} y={26} w={236} h={110} t="2 · Puff gently" tc={C.emerald} c={C.emerald} ok />
      <Balance cx={290} cy={86} r={30} />
      <G x={326} y={86} ang={130} k={0.8}>
        <Blower />
      </G>
      <T x={380} y={128} s={10} c={C.dim}>coils stay even</T>

      <Pn x={232} y={146} w={236} h={112} t="Too hard" tc={C.ruby} c={C.ruby} ok={false} />
      <circle cx={290} cy={206} r={30} fill="none" stroke={M.brassP} strokeWidth="3.9" />
      <path d="M290 206 q6 -4 10 2 q2 10 -10 10 q-16 -2 -12 -16 q8 -12 22 -4 q4 2 -6 12 q-14 6 -20 -6 q14 -22 30 -2" fill="none" stroke={C.steel} strokeWidth="1" />
      <T x={340} y={200} s={10.5} c={C.text}>coils tangle</T>
      <T x={340} y={214} s={10} c={C.dim}>and touch each other</T>
      <T x={14} y={282} s={10.5} c={C.text}>The balance never goes in the basket with the plates.</T>
      <T x={14} y={300} s={10.5} c={C.dim}>Hold the assembly by its cock hole, dip, then puff dry.</T>
    </F>
  )
}

function SaHandleClean() {
  return (
    <F h={290} view="Comparison · handle clean parts" scale="schematic">
      <Pn x={12} y={26} w={222} h={210} t="Clean tools, finger cots" tc={C.emerald} c={C.emerald} ok />
      <path d="M50 190 L170 182 L196 204 L60 214 Z" fill={M.plateL} stroke={C.struct} />
      <G x={120} y={186} ang={-10}>
        <Tweezers len={110} />
      </G>
      {/* finger with cot */}
      <path d="M150 90 Q150 72 166 72 Q182 72 182 90 L182 150 L150 150 Z" fill={M.cot} stroke="#b9a684" />
      <path d="M150 128 L182 128" stroke="#b9a684" />
      <Lab p={[178, 100]} x={214} y={66} text="finger cot" up a="end" />
      <Lab p={[116, 140]} x={36} y={74} text="clean tweezers" up a="start" />

      <Pn x={246} y={26} w={222} h={210} t="Bare finger" tc={C.ruby} c={C.ruby} ok={false} />
      <path d="M284 190 L404 182 L430 204 L294 214 Z" fill={M.plateL} stroke={C.struct} />
      <g transform="translate(352 198)">
        {[4, 8, 12].map((r) => <ellipse key={r} cx="0" cy="0" rx={r * 1.4} ry={r * 0.55} fill="none" stroke="rgba(239,232,220,0.55)" strokeWidth="0.9" />)}
      </g>
      <path d="M280 110 Q280 92 296 92 Q312 92 312 110 L312 170 L280 170 Z" fill="#d6a98a" stroke="#9c6f52" />
      <Lab p={[352, 198]} x={380} y={130} text="fingerprint" a="start" />
      <T x={380} y={144} s={10} c={C.dim}>oils and moisture</T>
      <T x={14} y={258} s={10.5} c={C.text}>One fingerprint puts back what the cleaning took out.</T>
      <T x={14} y={276} s={10.5} c={C.dim}>From now on, nothing touches a part but clean tweezers and cots.</T>
    </F>
  )
}

/* ================================================================== */
/* svc-oil · oiling chart & technique                                   */
/* ================================================================== */

function SaOilMatch() {
  const rows = [
    [M.oil, '9010', 'light oil', 'escape, third, fourth wheel and balance pivots'],
    ['#4f8fb8', 'HP-1300 / D5', 'heavier oil', 'centre wheel, barrel arbor, motion work'],
    ['#c58fd8', '9415', 'pallet oil / grease', 'the escapement stones'],
    [M.grease, '9504', 'grease', 'the keyless works'],
    ['#d7c27a', '8200', 'mainspring grease', 'manual-wind barrel'],
    [M.brake, '8217 or P125', 'braking grease', 'automatic barrel wall'],
  ]
  return (
    <F h={316} view="Chart · match the lubricant to the job" scale="summary">
      <Tag x={14} y={44}>Lubricant</Tag>
      <Tag x={190} y={44}>Where it goes</Tag>
      {rows.map(([col, name, kind, where], i) => {
        const y = 52 + i * 34
        return (
          <g key={name}>
            <rect x={12} y={y} width={456} height={30} rx="5" fill="rgba(255,255,255,0.025)" stroke={C.line} />
            <path d={`M28 ${y + 6} Q22 ${y + 16} 28 ${y + 22} Q34 ${y + 16} 28 ${y + 6} Z`} fill={col} />
            <T x={42} y={y + 13} s={11} c={C.text} w={600}>{name}</T>
            <T x={42} y={y + 25} s={10} c={C.dim}>{kind}</T>
            <T x={190} y={y + 19} s={10.5} c={C.text}>{where}</T>
          </g>
        )
      })}
      <rect x={12} y={258} width={456} height={30} rx="5" fill="rgba(194,88,99,0.10)" stroke={C.ruby} />
      <Verdict x={28} y={273} ok={false} r={7} />
      <T x={42} y={277} s={11} c={C.text} w={600}>nothing</T>
      <T x={190} y={277} s={10.5} c={C.text}>the roller jewel and the hairspring</T>
      <T x={14} y={306} s={10} c={C.faint}>Most work, in short. The Reference oiling chart has the full table.</T>
    </F>
  )
}

function SaGrease() {
  const bx = 112
  const by = 150
  return (
    <F h={316} view="Section + plan · grease the barrel and keyless" scale="schematic">
      <Pn x={12} y={26} w={214} h={238} t="Barrel, automatic" />
      {/* barrel drum in section */}
      <path d={`M${bx - 74} ${by - 50} L${bx - 74} ${by + 56} L${bx + 74} ${by + 56} L${bx + 74} ${by - 50} L${bx + 66} ${by - 50} L${bx + 66} ${by + 48} L${bx - 66} ${by + 48} L${bx - 66} ${by - 50} Z`} fill="url(#sa-cut)" stroke="#4a4436" />
      <rect x={bx - 74} y={by - 58} width={148} height={8} fill="url(#sa-cut)" stroke="#4a4436" strokeWidth="0.6" />
      {/* braking grease on the wall */}
      {[-1, 1].map((d) => (
        <rect key={d} x={d < 0 ? bx - 66 : bx + 61} y={by - 48} width={5} height={94} fill={M.brake} opacity="0.85" />
      ))}
      {/* arbor */}
      <rect x={bx - 7} y={by - 66} width={14} height={140} fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.6" />
      {/* mainspring coils in section */}
      {[18, 26, 34, 42, 50].map((r) => (
        <g key={r}>
          <rect x={bx - r - 2} y={by - 46} width={3} height={92} fill={C.steel} />
          <rect x={bx + r - 1} y={by - 46} width={3} height={92} fill={C.steel} />
        </g>
      ))}
      {[[bx - 34, by - 10], [bx + 26, by + 14], [bx - 18, by + 26], [bx + 42, by - 22]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={M.grease} />
      ))}
      <Lab p={[bx - 64, by - 30]} x={36} y={62} text="braking grease" a="start" up />
      <T x={40} y={74} s={10} c={C.faint}>on the barrel wall</T>
      <Lab p={[bx + 26, by + 14]} x={150} y={236} text="a little grease" a="start" />
      <T x={154} y={250} s={10} c={C.faint}>on the spring</T>
      <T x={22} y={226} s={10.5} c={C.dim}>barrel drum</T>

      <Pn x={236} y={26} w={232} h={238} t="Keyless works, plan" />
      {/* stem */}
      <rect x={250} y={142} width={204} height={8} rx="2" fill="url(#sk-steel)" stroke={M.steelD} strokeWidth="0.6" />
      <rect x={440} y={134} width={20} height={24} rx="3" fill="url(#sa-knurl)" />
      {/* winding pinion */}
      <rect x={278} y={132} width={22} height={28} rx="2" fill={M.brassP} stroke={M.brassD} />
      {/* sliding pinion */}
      <rect x={312} y={132} width={34} height={28} rx="2" fill="url(#sk-steelH)" stroke={M.steelD} />
      <rect x={326} y={132} width={6} height={28} fill={C.ground} opacity="0.6" />
      {/* yoke */}
      <path d="M329 132 L329 92 Q330 70 360 66 L420 62" fill="none" stroke={C.steel} strokeWidth="5" strokeLinecap="round" />
      {/* setting lever */}
      <path d="M392 150 L392 206 Q392 222 410 224 L444 226" fill="none" stroke="#9fb0bb" strokeWidth="6" strokeLinecap="round" />
      {[[312, 146], [346, 146], [329, 104], [392, 158], [300, 146]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={M.grease} stroke={C.ground} strokeWidth="0.6" />
      ))}
      <Lab p={[289, 132]} x={244} y={116} text="winding pinion" up a="start" />
      <Lab p={[340, 158]} x={290} y={196} text="sliding pinion" a="middle" />
      <Lab p={[380, 64]} x={400} y={48} text="yoke" up a="start" />
      <Lab p={[420, 225]} x={350} y={248} text="setting lever" a="middle" />
      <T x={250} y={176} s={10} c={C.faint}>stem</T>

      <circle cx={22} cy={290} r={4} fill={M.grease} />
      <T x={32} y={294} s={10.5} c={C.dim}>grease points</T>
      <rect x={132} y={286} width={10} height={8} fill={M.brake} />
      <T x={148} y={294} s={10.5} c={C.dim}>braking grease (automatics)</T>
      <T x={14} y={312} s={10} c={C.faint}>For smooth winding and setting.</T>
    </F>
  )
}

/* ================================================================== */
/* svc-shock · shock protection                                         */
/* ================================================================== */

// Shock setting in plan: outer ring, bore with cap jewel visible
function SettingPlan({ cx, cy, r = 54 }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={cx} cy={cy} r={r * 0.68} fill="#3a4248" stroke={M.steelD} />
      <circle cx={cx} cy={cy} r={r * 0.5} fill="#c9a24c" stroke={M.brassD} />
      <circle cx={cx} cy={cy} r={r * 0.36} fill={M.ruby} stroke="#7a2232" />
    </g>
  )
}
// Incabloc-style lyre spring, hinge at left, prongs at right (schematic)
function Lyre({ cx, cy, r = 54, c = C.text }) {
  const k = r / 54
  const p = (x, y) => `${cx + x * k} ${cy + y * k}`
  return (
    <g fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round">
      <path d={`M${p(-50, -4)} Q${p(-44, -40)} ${p(0, -42)} Q${p(40, -42)} ${p(44, -14)} L${p(36, -8)}`} />
      <path d={`M${p(-50, 4)} Q${p(-44, 40)} ${p(0, 42)} Q${p(40, 42)} ${p(44, 14)} L${p(36, 8)}`} />
      <circle cx={cx - 50 * k} cy={cy} r={4 * k} fill={c} />
    </g>
  )
}

function SaIncaRelease() {
  const cx = 110
  const cy = 136
  return (
    <F h={316} view="Plan + side view · release a lyre spring" scale="schematic, magnified">
      <Pn x={12} y={26} w={220} h={226} t="1 · Tease each prong" />
      <SettingPlan cx={cx} cy={cy} />
      <Lyre cx={cx} cy={cy} />
      <G x={cx + 44} y={cy - 18} ang={40} k={0.8}>
        <Tweezers c={M.brassP} len={80} />
      </G>
      <Arrow a={[cx + 58, cy - 20]} b={[cx + 58, cy - 4]} c="brass" w={1.6} />
      <Lab p={[cx - 54, cy]} x={40} y={216} text="hinge" a="start" />
      <Lab p={[cx + 40, cy + 14]} x={150} y={216} text="prongs" a="start" />
      <T x={22} y={236} s={10.5} c={C.dim}>toward the other, one at a time,</T>
      <T x={22} y={249} s={10} c={C.faint}>with fine brass tweezers</T>

      <Pn x={242} y={26} w={226} h={226} t="2 · Hinge it back" />
      {/* setting in section */}
      <rect x={262} y={170} width={180} height={22} fill="url(#sa-scut)" stroke={M.steelD} strokeWidth="0.6" />
      <rect x={322} y={160} width={60} height={10} fill="#c9a24c" stroke={M.brassD} />
      <rect x={334} y={154} width={36} height={6} fill={M.ruby} />
      {/* spring swung up about 80° about its hinge */}
      <circle cx={282} cy={166} r={4} fill={C.text} />
      {(() => {
        const [ex, ey] = pol(282, 166, 90, -80)
        return (
          <g>
            <line x1={282} y1={166} x2={ex} y2={ey} stroke={C.text} strokeWidth="2.6" strokeLinecap="round" />
            <line x1={282} y1={166} x2={410} y2={166} stroke={C.text} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            <path d={`M${282 + 60} 166 A60 60 0 0 0 ${pol(282, 166, 60, -80).join(' ')}`} fill="none" stroke={C.brass} strokeWidth="1.4" />
            <T x={350} y={100} s={10.5} c={C.brassHi}>no more than</T>
            <T x={350} y={114} s={10.5} c={C.brassHi}>about 80°</T>
            <ellipse cx={ex - 14} cy={ey + 30} rx={9} ry={12} fill={M.rodico} />
            <Lab p={[ex - 18, ey + 32]} x={262} y={64} text="Rodico behind it" up a="start" />
          </g>
        )
      })()}
      <T x={300} y={212} s={10.5} c={C.dim}>setting, in section</T>
      <T x={252} y={236} s={10.5} c={C.dim}>the blob stops the spring</T>
      <T x={252} y={249} s={10} c={C.faint}>falling out of the setting</T>
      <T x={14} y={276} s={10.5} c={C.text}>Gently: the spring stays on its hinge and only swings back.</T>
      <T x={14} y={294} s={10} c={C.faint}>Incabloc uses a hinged lyre-shaped spring. Drawn schematically.</T>
    </F>
  )
}

// Three-wing clover spring, rot in degrees
function Clover({ cx, cy, r = 40, rot = 0 }) {
  return (
    <g transform={`rotate(${rot} ${cx} ${cy})`}>
      {[0, 120, 240].map((a) => {
        const [x, y] = pol(cx, cy, r, a - 90)
        const [l1x, l1y] = pol(cx, cy, r * 0.9, a - 90 - 22)
        const [l2x, l2y] = pol(cx, cy, r * 0.9, a - 90 + 22)
        return <path key={a} d={`M${cx} ${cy} L${l1x} ${l1y} Q${x} ${y} ${l2x} ${l2y} Z`} fill="rgba(239,232,220,0.85)" stroke={C.steel} strokeWidth="1" />
      })}
      <circle cx={cx} cy={cy} r={r * 0.3} fill={M.ruby} stroke="#7a2232" />
    </g>
  )
}
// Setting with three lips and three cut-outs
function KifSetting({ cx, cy, r = 50 }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={cx} cy={cy} r={r * 0.78} fill="#3a4248" stroke={M.steelD} />
      {[60, 180, 300].map((a) => {
        const [x, y] = pol(cx, cy, r * 0.84, a - 90)
        return <circle key={a} cx={x} cy={y} r={r * 0.16} fill="#3a4248" stroke={M.steelD} />
      })}
    </g>
  )
}

function SaKifRelease() {
  return (
    <F h={316} view="Plan + side view · release a clover spring" scale="schematic, magnified">
      <Pn x={12} y={26} w={140} h={176} t="Locked" />
      <KifSetting cx={82} cy={110} />
      <Clover cx={82} cy={110} r={44} rot={0} />
      <T x={82} y={186} a="middle" s={10.5} c={C.dim}>wings under the lips</T>

      <Pn x={162} y={26} w={140} h={176} t="Twisted" tc={C.emerald} c={C.emerald} />
      <KifSetting cx={232} cy={110} />
      <Clover cx={232} cy={110} r={44} rot={60} />
      <Turn cx={232} cy={110} r={58} from={300} to={350} c="brass" w={1.6} />
      <T x={232} y={186} a="middle" s={10.5} c={C.dim}>wings at the cut-outs</T>

      <Pn x={312} y={26} w={156} h={176} t="Tool, side" />
      <rect x={334} y={150} width={112} height={18} fill="url(#sa-scut)" stroke={M.steelD} strokeWidth="0.6" />
      <path d="M350 146 Q390 136 430 146" fill="none" stroke={C.text} strokeWidth="2.4" />
      <path d="M374 140 L374 60 L406 60 L406 140 L398 140 L398 132 L382 132 L382 140 Z" fill="#b7c2c8" stroke={M.steelD} />
      <Arrow a={[420, 70]} b={[420, 100]} c="brass" w={1.6} />
      <T x={424} y={66} s={10} c={C.brassHi}>light</T>
      <Arrow d="M366 86 Q390 100 414 86" c="brass" w={1.4} />
      <T x={330} y={58} s={10} c={C.text}>Kif tool</T>
      <T x={322} y={186} s={10} c={C.dim}>press down, then twist</T>

      <Sep x1={12} y1={214} x2={468} y2={214} />
      <T x={14} y={234} s={11} c={C.text} w={600}>No Kif tool?</T>
      <rect x={110} y={224} width={70} height={14} fill="url(#sk-wood)" />
      <rect x={110} y={228} width={10} height={6} fill={C.ground} />
      <T x={192} y={235} s={10.5} c={C.dim}>a pegwood tool, bored to size with a screwdriver</T>
      <T x={14} y={262} s={10.5} c={C.text}>Press down lightly and twist, so the wings escape</T>
      <T x={14} y={278} s={10.5} c={C.text}>through the cut-outs in the setting.</T>
      <T x={14} y={300} s={10} c={C.faint}>Kif uses a three-leaf “clover” spring. Drawn schematically.</T>
    </F>
  )
}

// Chaton in section: brass ring with the hole jewel
function Chaton({ x, y, w = 50 }) {
  return (
    <g>
      <rect x={x - w / 2} y={y} width={w} height={14} rx="2" fill="#c9a24c" stroke={M.brassD} />
      <rect x={x - w * 0.32} y={y + 2} width={w * 0.64} height={10} fill={M.ruby} />
      <rect x={x - 2} y={y + 2} width={4} height={10} fill={C.ground} />
    </g>
  )
}

function SaJewelLift() {
  return (
    <F h={316} view="Section · lift the chaton, then clean" scale="schematic, magnified">
      <Pn x={12} y={26} w={150} h={210} t="Rodico point" tc={C.emerald} c={C.emerald} ok />
      <path d="M30 196 L30 168 L48 168 L48 186 L126 186 L126 168 L144 168 L144 196 Z" fill="url(#sa-scut)" stroke={M.steelD} strokeWidth="0.6" />
      <Chaton x={87} y={118} />
      <path d="M72 118 Q80 90 87 50 Q94 90 102 118 Z" fill={M.rodico} />
      <Arrow a={[126, 140]} b={[126, 104]} c="emerald" w={1.6} />
      <Lab p={[87, 70]} x={108} y={58} text="tapered" a="start" up />
      <T x={112} y={72} s={10} c={C.dim}>Rodico</T>
      <Lab p={[66, 124]} x={30} y={150} text="chaton" a="start" />
      <T x={87} y={226} a="middle" s={10.5} c={C.dim}>setting</T>

      <Pn x={172} y={26} w={140} h={210} t="Tweezers" tc={C.ruby} c={C.ruby} ok={false} />
      <path d="M186 196 L186 168 L204 168 L204 186 L280 186 L280 168 L298 168 L298 196 Z" fill="url(#sa-scut)" stroke={M.steelD} strokeWidth="0.6" />
      <G x={242} y={182} ang={-8} k={0.9}>
        <Tweezers len={110} gap={6} />
      </G>
      <Arrow d="M250 172 Q280 110 300 84" c="ruby" w={1.6} />
      <g transform="translate(296 74) rotate(30)">
        <Chaton x={0} y={0} w={26} />
      </g>
      <T x={242} y={226} a="middle" s={10.5} c={C.ruby}>pings it away</T>

      <Pn x={322} y={26} w={146} h={210} t="Then degreaser" />
      <Jar x={350} y={70} w={90} h={90} />
      <Chaton x={378} y={136} w={30} />
      <circle cx={414} cy={144} r={9} fill={M.ruby} stroke="#7a2232" />
      <T x={395} y={182} a="middle" s={10.5} c={C.text}>a few minutes</T>
      <T x={395} y={202} a="middle" s={10} c={C.dim}>chaton and end-stone</T>
      <T x={395} y={216} a="middle" s={10} c={C.dim}>usually separate</T>

      <Sep x1={12} y1={248} x2={468} y2={248} />
      <T x={14} y={268} s={10.5} c={C.text}>Two parts come out: the chaton with its hole jewel, and the end-stone.</T>
      <T x={14} y={286} s={10.5} c={C.dim}>Lift it with Rodico, so nothing is gripped and nothing can spring away.</T>
    </F>
  )
}

function SaCapOilRefit() {
  return (
    <F h={320} view="Sequence · oil the end-stone and refit" scale="schematic, magnified">
      <Pn x={12} y={26} w={146} h={210} t="1 · Oil it" />
      <circle cx={85} cy={130} r={38} fill={M.ruby} stroke="#7a2232" />
      <circle cx={85} cy={130} r={16} fill={M.oil} opacity="0.85" />
      <circle cx={85} cy={130} r={2} fill={C.ground} />
      <G x={85} y={116} ang={30} k={0.9}>
        <Oiler len={60} drop={0} />
      </G>
      <T x={85} y={190} a="middle" s={10.5} c={C.text}>small drop of 9010</T>
      <T x={85} y={204} a="middle" s={10} c={C.dim}>a ring where the</T>
      <T x={85} y={217} a="middle" s={10} c={C.dim}>pivot sits</T>

      <Pn x={167} y={26} w={146} h={210} t="2 · Chaton in" />
      <path d="M180 196 L180 160 L196 160 L196 184 L284 184 L284 160 L300 160 L300 196 Z" fill="url(#sa-scut)" stroke={M.steelD} strokeWidth="0.6" />
      <rect x={210} y={170} width={60} height={8} fill={M.ruby} />
      <ellipse cx={240} cy={169} rx={10} ry={2} fill={M.oil} />
      <Chaton x={240} y={110} />
      <Arrow a={[290, 104]} b={[290, 150]} c="brass" w={1.6} />
      <Lab p={[240, 174]} x={240} y={216} text="end-stone, oiled" />
      <Lab p={[262, 116]} x={240} y={70} text="chaton" up />

      <Pn x={322} y={26} w={146} h={210} t="3 · Spring home" />
      <path d="M336 196 L336 160 L352 160 L352 184 L438 184 L438 160 L454 160 L454 196 Z" fill="url(#sa-scut)" stroke={M.steelD} strokeWidth="0.6" />
      <rect x={366} y={170} width={58} height={8} fill={M.ruby} />
      <Chaton x={395} y={156} />
      <path d="M344 150 Q395 138 446 150" fill="none" stroke={C.text} strokeWidth="2.6" />
      <Verdict x={395} y={110} ok r={9} />
      <T x={395} y={86} a="middle" s={10.5} c={C.text}>hinged or clipped</T>
      <T x={395} y={216} a="middle" s={10.5} c={C.dim}>locked in place</T>

      <Sep x1={12} y1={248} x2={468} y2={248} />
      <Num x={24} y={270} n={4} r={8} />
      <T x={38} y={274} s={11} c={C.text} w={600}>Balance back in: a little end-shake, and it runs freely</T>
      <Arrow a={[56, 296]} b={[56, 284]} c="brass" w={1.4} both />
      <T x={68} y={298} s={10.5} c={C.dim}>lift it gently with pegwood: it should rise and drop a hair</T>
    </F>
  )
}

function SaShockCheck() {
  return (
    <F h={330} view="Check · before the balance goes back" scale="schematic, magnified">
      <Pn x={12} y={26} w={148} h={150} t="Ring centred" tc={C.emerald} c={C.emerald} ok />
      <circle cx={86} cy={100} r={42} fill={M.ruby} stroke="#7a2232" />
      <circle cx={86} cy={100} r={24} fill={M.oil} opacity="0.85" />
      <Dim a={[44, 152]} b={[128, 152]} />
      <T x={86} y={170} a="middle" s={10} c={C.text}>oil ½ to ⅔ of the width</T>

      <Pn x={168} y={26} w={148} h={150} t="Off-centre" tc={C.ruby} c={C.ruby} ok={false} />
      <circle cx={242} cy={100} r={42} fill={M.ruby} stroke="#7a2232" />
      <circle cx={256} cy={92} r={24} fill={M.oil} opacity="0.85" />
      <T x={242} y={156} a="middle" s={10} c={C.text}>not parallel or not clean:</T>
      <T x={242} y={169} a="middle" s={10} c={C.text}>lift out, start again</T>

      <Pn x={324} y={26} w={144} h={150} t="Spring home" />
      {[[362, true], [430, false]].map(([x, ok]) => (
        <g key={x}>
          <rect x={x - 26} y={100} width={52} height={14} fill="url(#sa-scut)" stroke={M.steelD} strokeWidth="0.6" />
          {ok ? (
            <path d={`M${x - 24} 98 Q${x} 90 ${x + 24} 98`} fill="none" stroke={C.text} strokeWidth="2.4" />
          ) : (
            <path d={`M${x - 24} 98 L${x + 14} 66`} fill="none" stroke={C.text} strokeWidth="2.4" />
          )}
          <Verdict x={x} y={140} ok={ok} r={8} />
        </g>
      ))}
      <T x={396} y={168} a="middle" s={10} c={C.dim}>it must not swing out</T>

      <Sep x1={12} y1={188} x2={468} y2={188} />
      <Tag x={14} y={206}>Then, balance in: lift it gently with pegwood</Tag>
      {[
        ['A little endshake', 'right', C.emerald, true],
        ['None', 'a jewel isn’t seated', C.ruby, false],
        ['Too much', 'look at the setting first', C.ruby, false],
      ].map(([a, b, c, ok], i) => (
        <g key={a}>
          <rect x={12 + i * 154} y={216} width={148} height={104} rx="6" fill="rgba(255,255,255,0.025)" stroke={c} strokeOpacity="0.7" />
          <rect x={40 + i * 154} y={232} width={60} height={6} fill={M.ruby} />
          <rect x={40 + i * 154} y={264} width={60} height={6} fill={M.ruby} />
          <rect x={68 + i * 154} y={238 - (i === 2 ? 0 : 0)} width={4} height={26} fill="url(#sk-steelH)" />
          <rect x={58 + i * 154} y={i === 1 ? 236 : 246} width={24} height={4} fill={M.brassP} />
          {i !== 1 && <Arrow a={[112 + i * 154, 262]} b={[112 + i * 154, i === 2 ? 236 : 248]} c="brass" w={1.3} both />}
          <Verdict x={146 + i * 154} y={230} ok={ok} r={7} />
          <T x={20 + i * 154} y={286} s={10.5} c={C.text} w={600}>{a}</T>
          <T x={20 + i * 154} y={310} s={10} c={C.dim}>{b}</T>
        </g>
      ))}
    </F>
  )
}

/* ================================================================== */
/* svc-auto · the automatic module                                      */
/* ================================================================== */

function SaAutoDiagnose() {
  const chain = [
    ['Rotor', 'turns freely?', true],
    ['Reversers', 'sticky?', true],
    ['Reduction', 'wheels', false],
    ['Ratchet', '', false],
    ['Barrel', 'bridle slipping?', true],
  ]
  return (
    <F h={300} view="Flow · where winding power is lost" scale="schematic">
      <Bx x={12} y={28} w={456} h={36} l={['A serviced automatic still runs down overnight']} c={C.ruby} />
      {chain.map(([a, b, sus], i) => {
        const x = 12 + i * 92
        return (
          <g key={a}>
            <rect x={x} y={92} width={80} height={56} rx="6" fill={sus ? 'rgba(194,88,99,0.12)' : 'rgba(255,255,255,0.03)'} stroke={sus ? C.ruby : C.line} />
            <T x={x + 40} y={115} a="middle" s={11} c={C.text} w={600}>{a}</T>
            {b && <T x={x + 40} y={131} a="middle" s={10} c={sus ? C.ruby : C.dim}>{b}</T>}
            {i < 4 && <Arrow a={[x + 81, 120]} b={[x + 91, 120]} c="brass" w={1.4} />}
          </g>
        )
      })}
      <T x={14} y={84} s={10} c={C.faint}>winding power flows this way</T>

      <rect x={12} y={168} width={300} height={56} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <T x={22} y={186} s={11} c={C.text} w={600}>The usual suspects</T>
      <T x={22} y={202} s={10.5} c={C.dim}>sticky reversers, a slipping mainspring bridle,</T>
      <T x={22} y={216} s={10.5} c={C.dim}>a rotor that isn’t turning freely</T>
      <rect x={322} y={168} width={146} height={56} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={332} y={186} s={11} c={C.text} w={600}>Usually not</T>
      <T x={332} y={202} s={10.5} c={C.dim}>the going train</T>
      <T x={332} y={216} s={10} c={C.faint}>look there after these</T>
      <T x={14} y={252} s={10.5} c={C.text}>A healthy automatic gains reserve from ordinary wear.</T>
      <T x={14} y={270} s={10.5} c={C.dim}>Check the winding side, in this order, before you strip the train.</T>
    </F>
  )
}

function SaRotorCheck() {
  const Side = ({ x, ok }) => (
    <g>
      <rect x={x + 10} y={60} width={200} height={10} rx="4" fill="url(#sk-steel)" stroke={M.steelD} />
      <T x={x + 110} y={54} a="middle" s={10} c={C.faint}>caseback</T>
      <rect x={x + 10} y={176} width={200} height={20} fill="url(#sa-mov)" stroke={C.struct} />
      <rect x={x + 98} y={128} width={24} height={48} fill="#9fb0bb" stroke={M.steelD} />
      {ok ? (
        <g>
          <rect x={x + 22} y={100} width={176} height={12} fill="url(#sa-rotor)" stroke={M.steelD} />
          <Dim a={[x + 40, 70]} b={[x + 40, 100]} off={0} text="" />
          <T x={x + 48} y={90} s={10} c={C.emerald}>clear gap</T>
        </g>
      ) : (
        <g>
          <g transform={`rotate(-9 ${x + 110} 112)`}>
            <rect x={x + 22} y={100} width={176} height={12} fill="url(#sa-rotor)" stroke={M.steelD} />
          </g>
          <path d={`M${x + 186} 72 l6 -4 l4 6 l6 -4`} stroke={C.ruby} strokeWidth="1.6" fill="none" />
          <T x={x + 56} y={88} s={10} c={C.ruby}>touches caseback</T>
          <Arrow a={[x + 40, 138]} b={[x + 40, 108]} c="ruby" w={1.4} both />
        </g>
      )}
      <Screw x={x + 110} y={106} r={5} ang={20} />
      <Verdict x={x + 196} y={150} ok={ok} r={8} />
    </g>
  )
  return (
    <F h={306} view="Side view · rock the rotor gently" scale="schematic, play exaggerated">
      <Side x={12} ok />
      <Side x={246} ok={false} />
      <T x={122} y={218} a="middle" s={11} c={C.text} w={600}>spins freely</T>
      <T x={122} y={233} a="middle" s={10.5} c={C.dim}>no up-and-down play you can feel</T>
      <T x={356} y={218} a="middle" s={11} c={C.text} w={600}>play, roughness, scraping</T>
      <T x={356} y={233} a="middle" s={10.5} c={C.dim}>worn ball bearing or jewelled bushing</T>
      <Sep x1={12} y1={248} x2={468} y2={248} />
      <T x={14} y={276} s={10.5} c={C.text}>While you’re there, check the rotor screw is tight.</T>
      <T x={14} y={296} s={10} c={C.faint}>Rock it at the rim, without forcing.</T>
    </F>
  )
}

function SaRotorBearing() {
  return (
    <F h={322} view="Plan + section · two kinds of rotor bearing" scale="schematic">
      <Pn x={12} y={26} w={222} h={170} t="Replaceable unit" />
      <path d="M56 132 A64 64 0 0 1 184 132 L160 132 A40 40 0 0 0 80 132 Z" fill="url(#sa-rotor)" stroke={M.steelD} />
      <circle cx={120} cy={120} r={22} fill="#9fb0bb" stroke={M.steelD} />
      <circle cx={120} cy={120} r={10} fill={C.ground} stroke={M.steelD} />
      {Array.from({ length: 10 }, (_, i) => {
        const [x, y] = pol(120, 120, 16, i * 36)
        return <circle key={i} cx={x} cy={y} r={3} fill="url(#sa-ball)" />
      })}
      <Arrow a={[120, 168]} b={[120, 148]} c="brass" w={1.6} />
      <T x={120} y={182} a="middle" s={10.5} c={C.text}>swap the ball-bearing unit</T>

      <Pn x={246} y={26} w={222} h={170} t="Part of the rotor" />
      <path d="M290 132 A64 64 0 0 1 418 132 L394 132 A40 40 0 0 0 314 132 Z" fill="url(#sa-rotor)" stroke={M.steelD} />
      <circle cx={354} cy={120} r={22} fill="#9fb0bb" stroke={M.steelD} />
      <circle cx={354} cy={120} r={10} fill={C.ground} stroke={M.steelD} />
      <rect x={280} y={58} width={148} height={86} rx="8" fill="none" stroke={C.brass} strokeDasharray="4 3" />
      <T x={354} y={170} a="middle" s={10.5} c={C.text}>replace the whole rotor</T>
      <T x={354} y={184} a="middle" s={10} c={C.dim}>bearing comes with it</T>

      <Sep x1={12} y1={206} x2={468} y2={206} />
      {[[60, true, 'seated square'], [200, false, 'tilted']].map(([x, ok, l]) => (
        <g key={x}>
          <rect x={x - 30} y={256} width={100} height={12} fill="url(#sa-mov)" />
          <g transform={ok ? undefined : `rotate(-8 ${x + 20} 244)`}>
            <rect x={x - 30} y={226} width={100} height={8} fill="url(#sa-rotor)" stroke={M.steelD} />
            <rect x={x + 10} y={234} width={20} height={22} fill="#9fb0bb" stroke={M.steelD} />
          </g>
          <Verdict x={x + 84} y={232} ok={ok} r={7} />
          <T x={x + 20} y={286} a="middle" s={10.5} c={ok ? C.emerald : C.ruby}>{l}</T>
        </g>
      ))}
      <Note x={316} y={232} lines={['Fit the correct part', 'for the calibre. Then', 'check it spins freely', 'and clears the caseback.']} c={C.text} s={10.5} lh={15} />
      <T x={14} y={310} s={10} c={C.faint}>Which kind you have depends on the calibre.</T>
    </F>
  )
}

function SaReverserSheet() {
  return (
    <F h={330} view="Decision · the sheet first, then the routine" scale="schematic">
      <Bx x={120} y={28} w={240} h={40} l={['Does the calibre’s sheet mark the', 'reversing wheels “do not wash”?']} c={C.brass} s={10.5} />
      <Arrow a={[180, 70]} b={[110, 96]} c="brass" w={1.4} />
      <T x={124} y={84} a="end" s={10.5} c={C.brassHi}>yes, e.g. 2824-2</T>
      <Arrow a={[300, 70]} b={[370, 96]} c="brass" w={1.4} />
      <T x={360} y={84} s={10.5} c={C.brassHi}>no such rule</T>

      <Bx x={12} y={98} w={196} h={46} l={['Exchange them for', 'prelubricated originals']} c={C.emerald} s={10.5} />
      <Arrow a={[110, 146]} b={[110, 168]} c="brass" w={1.4} />
      <T x={116} y={162} s={10} c={C.dim}>can’t get them?</T>
      <Bx x={12} y={170} w={196} h={36} l={['the maker’s rule wins if you can']} c={C.line} s={10} tc={C.dim} />
      <Arrow d="M208 188 Q270 188 300 162" c="brass" w={1.3} />

      <Bx x={272} y={98} w={196} h={60} l={['Fallback: clean and dip', 'clean as a complete unit,', 'then the dip lubricant']} c={C.struct} s={10.5} />

      <Sep x1={12} y1={220} x2={468} y2={220} />
      <Tag x={14} y={240}>Either way: test each wheel by hand</Tag>
      {[
        ['locks one way', true],
        ['runs free the other', true],
      ].map(([l, ok], i) => (
        <g key={l}>
          <Reverser cx={44 + i * 150} cy={276} r={18} />
          {i === 0 ? (
            <g>
              <Turn cx={44} cy={276} r={26} from={30} to={80} c="ruby" w={1.6} />
              <rect x={64} y={252} width={4} height={10} fill={C.ruby} />
            </g>
          ) : (
            <Turn cx={194} cy={276} r={26} from={300} to={60} c="emerald" w={1.6} />
          )}
          <T x={76 + i * 150} y={290} s={10.5} c={C.text}>{l}</T>
        </g>
      ))}
      <rect x={330} y={252} width={138} height={48} rx="6" fill="rgba(194,88,99,0.10)" stroke={C.ruby} />
      <T x={340} y={271} s={10.5} c={C.text} w={600}>Won’t do both?</T>
      <T x={340} y={288} s={10.5} c={C.ruby}>replace it</T>
      <T x={14} y={322} s={10} c={C.faint}>Reverser practice isn’t universal. Follow the maker wherever you can get the part.</T>
    </F>
  )
}

// Reverser wheel cut open, with schematic pawls inside
function ReverserOpen({ cx, cy, r }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={M.brassP} strokeWidth={r * 0.12} strokeDasharray="3 2" />
      <circle cx={cx} cy={cy} r={r * 0.84} fill="rgba(201,162,76,0.12)" stroke={M.brassP} />
      {/* inner ratchet ring */}
      {Array.from({ length: 12 }, (_, i) => {
        const [a1, b1] = pol(cx, cy, r * 0.62, i * 30)
        const [a2, b2] = pol(cx, cy, r * 0.74, i * 30 + 12)
        const [a3, b3] = pol(cx, cy, r * 0.62, i * 30 + 30)
        return <path key={i} d={`M${a1} ${b1} L${a2} ${b2} L${a3} ${b3}`} fill="none" stroke={C.steel} strokeWidth="1" />
      })}
      {[0, 120, 240].map((a) => {
        const [x1, y1] = pol(cx, cy, r * 0.22, a)
        const [x2, y2] = pol(cx, cy, r * 0.6, a + 35)
        return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.text} strokeWidth="2" strokeLinecap="round" />
      })}
      <circle cx={cx} cy={cy} r={r * 0.2} fill={M.ruby} />
    </g>
  )
}

function SaReverserUnit() {
  return (
    <F h={316} view="Cutaway · a one-way clutch, cleaned whole" scale="schematic, magnified">
      <Pn x={12} y={26} w={172} h={196} t="Inside a reverser" />
      <ReverserOpen cx={98} cy={116} r={58} />
      <Lab p={[116, 84]} x={40} y={196} text="pawls" a="middle" />
      <Lab p={[150, 116]} x={150} y={196} text="teeth" a="middle" />

      <Pn x={194} y={26} w={134} h={196} t="As a unit" tc={C.emerald} c={C.emerald} ok />
      <rect x={210} y={70} width={102} height={70} rx="4" fill="url(#sk-hatch)" stroke={C.dim} />
      <Reverser cx={240} cy={105} r={16} />
      <Reverser cx={282} cy={105} r={16} />
      <T x={261} y={166} a="middle" s={10.5} c={C.text}>whole, through</T>
      <T x={261} y={180} a="middle" s={10.5} c={C.text}>the cleaning cycle</T>

      <Pn x={338} y={26} w={130} h={196} t="Stripped" tc={C.ruby} c={C.ruby} ok={false} />
      <circle cx={380} cy={88} r={18} fill="none" stroke={M.brassP} strokeWidth="2.2" strokeDasharray="3 2" />
      <line x1={410} y1={110} x2={420} y2={100} stroke={C.text} strokeWidth="2" strokeLinecap="round" />
      <line x1={366} y1={126} x2={374} y2={136} stroke={C.text} strokeWidth="2" strokeLinecap="round" />
      <line x1={350} y1={190} x2={460} y2={190} stroke={C.struct} strokeWidth="1.6" />
      <line x1={430} y1={186} x2={438} y2={188} stroke={C.text} strokeWidth="2" strokeLinecap="round" />
      <T x={403} y={160} a="middle" s={10.5} c={C.text}>parts on</T>
      <T x={403} y={174} a="middle" s={10.5} c={C.text}>the floor</T>

      <Sep x1={12} y1={232} x2={468} y2={232} />
      <T x={14} y={252} s={11} c={C.text} w={600}>After cleaning, inspect each one</T>
      <Verdict x={24} y={276} ok r={7} />
      <T x={38} y={280} s={10.5} c={C.text}>still locks one way</T>
      <Verdict x={204} y={276} ok r={7} />
      <T x={218} y={280} s={10.5} c={C.text}>still freewheels the other</T>
      <T x={14} y={304} s={10} c={C.faint}>Drawn schematically: pawl layouts differ between calibres.</T>
    </F>
  )
}

function SaReverserDip() {
  return (
    <F h={316} view="Sequence · the dip lubricant" scale="schematic">
      {[
        ['Clean, dry wheel', ''],
        ['Dip it', 'Lubeta V105'],
        ['Carrier evaporates', ''],
        ['Lubricant stays', 'where it’s needed'],
      ].map(([a, b], i) => {
        const x = 12 + i * 116
        const cx = x + 52
        return (
          <g key={a}>
            <rect x={x} y={28} width={104} height={160} rx="6" fill="rgba(255,255,255,0.025)" stroke={C.line} />
            <Num x={x + 14} y={42} n={i + 1} r={8} />
            {i === 1 && <Jar x={x + 18} y={96} w={68} h={60} fluid="rgba(196,176,120,0.35)" />}
            <Reverser cx={cx} cy={i === 1 ? 120 : 104} r={18} />
            {i === 1 && (
              <G x={cx} y={104} k={0.6}>
                <Tweezers len={80} />
              </G>
            )}
            {i === 2 && [0, 1, 2].map((j) => <path key={j} d={`M${cx - 14 + j * 14} 80 q-5 -8 0 -16 q5 -8 0 -16`} fill="none" stroke={C.faint} strokeWidth="1.2" />)}
            {i === 3 && [0, 90, 180, 270].map((d) => {
              const [px, py] = pol(cx, 104, 9, d + 20)
              return <circle key={d} cx={px} cy={py} r="2.4" fill={M.grease} />
            })}
            <T x={cx} y={168} a="middle" s={10.5} c={C.text} w={600}>{a}</T>
            {b && <T x={cx} y={182} a="middle" s={10} c={C.dim}>{b}</T>}
            {i < 3 && <Arrow a={[x + 105, 108]} b={[x + 115, 108]} c="brass" w={1.3} />}
          </g>
        )
      })}
      <rect x={12} y={202} width={456} height={72} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <Verdict x={30} y={222} ok={false} r={8} />
      <T x={46} y={226} s={11} c={C.text} w={600}>Never ordinary oil or grease</T>
      <T x={46} y={244} s={10.5} c={C.dim}>It gums the pawls and kills winding efficiency:</T>
      <T x={46} y={260} s={10.5} c={C.dim}>the commonest automatic complaint after a service.</T>
      <T x={14} y={298} s={10} c={C.faint}>Lubeta V105 is the standard dip lubricant for reversers.</T>
    </F>
  )
}

function SaAutoProve() {
  return (
    <F h={300} view="Test · prove the winding before casing" scale="schematic">
      <Pn x={12} y={26} w={226} h={176} t="1 · Spin the rotor by hand" />
      <path d="M44 150 A80 80 0 0 1 204 150 L174 150 A50 50 0 0 0 74 150 Z" fill="url(#sa-rotor)" stroke={M.steelD} />
      <circle cx={124} cy={150} r={10} fill="#9fb0bb" stroke={M.steelD} />
      <Arrow d="M48 132 Q52 62 124 60 Q192 62 200 120" c="brass" w={1.8} />
      <T x={22} y={176} s={10.5} c={C.text}>feel the ratchet advance,</T>
      <T x={22} y={190} s={10.5} c={C.text}>see the barrel take up power</T>

      <Pn x={248} y={26} w={220} h={176} t="2 · Winder, or wear it a day" />
      <line x1={272} y1={60} x2={272} y2={160} stroke={C.struct} />
      <line x1={272} y1={160} x2={452} y2={160} stroke={C.struct} />
      <T x={278} y={62} s={10} c={C.faint}>reserve</T>
      <T x={452} y={176} a="end" s={10} c={C.faint}>one day</T>
      <path d="M274 150 C320 140 360 100 440 76" fill="none" stroke={C.emerald} strokeWidth="2" />
      <T x={360} y={140} s={10.5} c={C.emerald}>it builds</T>
      <path d="M274 150 C320 150 380 150 440 152" fill="none" stroke={C.ruby} strokeWidth="1.6" strokeDasharray="4 3" />
      <T x={390} y={194} a="middle" s={10} c={C.ruby}>flat: back to the suspects</T>

      <Sep x1={12} y1={214} x2={468} y2={214} />
      <T x={14} y={236} s={10.5} c={C.text}>Hand spins show the winding gears drive the barrel. A winder or</T>
      <T x={14} y={252} s={10.5} c={C.text}>a day on the wrist confirms the reserve actually builds.</T>
      <T x={14} y={276} s={10} c={C.faint}>Do this before the case goes on, so a fault means no re-casing.</T>
    </F>
  )
}

/* ================================================================== */
/* svc-reassemble · reassembly in order                                 */
/* ================================================================== */

function SaRebuildUp() {
  return (
    <F h={316} view="Section · rebuild from the mainplate up" scale="schematic, height ×3">
      {/* mainplate */}
      <rect x={30} y={150} width={280} height={22} fill="url(#sa-cut)" stroke="#4a4436" />
      <T x={170} y={165} a="middle" s={10.5} c={C.text}>mainplate</T>
      <T x={22} y={80} s={10} c={C.faint}>BRIDGE SIDE</T>
      <T x={22} y={214} s={10} c={C.faint}>DIAL SIDE</T>
      {/* dial side: keyless and motion works */}
      <rect x={210} y={180} width={90} height={7} fill="#9fb0bb" stroke={M.steelD} strokeWidth="0.6" />
      <rect x={280} y={186} width={60} height={6} rx="2" fill="url(#sk-steel)" />
      <rect x={96} y={172} width={10} height={30} fill="url(#sk-steelH)" />
      <rect x={80} y={196} width={42} height={6} fill={M.brassP} />
      <rect x={130} y={184} width={30} height={5} fill={M.brassP} />
      <Num x={256} y={226} n={1} r={8} />
      <T x={270} y={230} s={10.5} c={C.text}>keyless works</T>
      <Num x={100} y={226} n={2} r={8} />
      <T x={114} y={230} s={10.5} c={C.text}>motion works</T>
      {/* barrel and bridge */}
      <rect x={70} y={112} width={100} height={34} rx="3" fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={114} y={104} width={12} height={46} fill="url(#sk-steelH)" />
      <rect x={52} y={88} width={150} height={14} rx="3" fill={M.plateL} stroke={C.struct} />
      <Arrow a={[220, 62]} b={[220, 86]} c="brass" w={1.6} />
      <Num x={186} y={128} n={3} r={8} />
      <T x={200} y={132} s={10.5} c={C.text}>barrel</T>
      <Num x={236} y={52} n={4} r={8} />
      <T x={250} y={56} s={10.5} c={C.text}>barrel bridge</T>
      {/* oil and grease points */}
      {[[120, 104, M.oil], [120, 150, M.oil], [101, 196, M.oil], [240, 182, M.grease], [290, 188, M.grease]].map(([x, y, c], i) => (
        <circle key={i} cx={x} cy={y} r={3.6} fill={c} stroke={C.ground} strokeWidth="0.6" />
      ))}

      <rect x={356} y={50} width={112} height={180} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <Tag x={366} y={68}>Each part</Tag>
      <circle cx={372} cy={92} r={4} fill={M.oil} />
      <T x={382} y={96} s={10.5} c={C.text}>oil its points</T>
      <circle cx={372} cy={116} r={4} fill={M.grease} />
      <T x={382} y={120} s={10.5} c={C.text}>grease its</T>
      <T x={382} y={134} s={10.5} c={C.text}>sliding parts</T>
      <Note x={366} y={164} lines={['Oil now, while', 'every point is', 'still in reach.']} c={C.dim} s={10.5} lh={15} />

      <Sep x1={12} y1={250} x2={468} y2={250} />
      <T x={14} y={272} s={10.5} c={C.text}>Order: keyless and motion works, then the barrel and its bridge.</T>
      <T x={14} y={290} s={10} c={C.faint}>Oil points shown are illustrative. Use the oiling chart for your calibre.</T>
    </F>
  )
}

function SaEndshake() {
  const Sec = ({ x, crooked }) => (
    <g>
      <rect x={x} y={150} width={180} height={12} fill="url(#sa-cut)" stroke="#4a4436" strokeWidth="0.6" />
      <g transform={crooked ? `rotate(-4 ${x + 20} 82)` : undefined}>
        <rect x={x} y={76} width={180} height={12} rx="2" fill={M.plateL} stroke={C.struct} />
        {[50, 110].map((d) => <rect key={d} x={x + d - 5} y={78} width={10} height={8} fill={M.ruby} />)}
      </g>
      {[50, 110].map((d) => (
        <g key={d}>
          <rect x={x + d - 5} y={152} width={10} height={8} fill={M.ruby} />
          <rect x={x + d - 2} y={crooked && d === 110 ? 82 : 86} width={4} height={crooked && d === 110 ? 72 : 66} fill="url(#sk-steelH)" />
          <rect x={x + d - 18} y={116} width={36} height={4} fill={M.brassP} />
        </g>
      ))}
      <Screw x={x + 168} y={70} r={5} ang={20} />
    </g>
  )
  return (
    <F h={334} view="Section · endshake, bridge down" scale="gaps exaggerated">
      <Pn x={12} y={26} w={222} h={170} t="Bridge seats flat" tc={C.emerald} c={C.emerald} ok />
      <Sec x={30} />
      <Arrow a={[208, 128]} b={[208, 108]} c="brass" w={1.4} both />
      <T x={122} y={182} a="middle" s={10.5} c={C.text}>each pivot rises and drops a hair</T>
      <Pn x={246} y={26} w={222} h={170} t="Bridge going down crooked" tc={C.ruby} c={C.ruby} ok={false} />
      <Sec x={264} crooked />
      <circle cx={374} cy={86} r={9} fill="none" stroke={C.ruby} strokeWidth="1.6" />
      <T x={356} y={182} a="middle" s={10.5} c={C.text}>no endshake: a pivot is caught</T>

      <Tag x={14} y={218}>Check every wheel and the barrel</Tag>
      {[
        ['Screws light', '', C.brass],
        ['Air test', 'train free', C.emerald],
        ['Screws tight', 'firmly, not hard', C.brass],
        ['Air test again', 'still free?', C.emerald],
      ].map(([a, b, c], i) => (
        <g key={a}>
          <rect x={12 + i * 116} y={228} width={104} height={44} rx="6" fill="rgba(255,255,255,0.03)" stroke={c} strokeOpacity="0.6" />
          <Num x={26 + i * 116} y={250} n={i + 1} r={8} />
          <T x={40 + i * 116} y={b ? 247 : 254} s={10.5} c={C.text} w={600}>{a}</T>
          {b && <T x={40 + i * 116} y={261} s={10} c={C.dim}>{b}</T>}
          {i < 3 && <Arrow a={[117 + i * 116, 250]} b={[127 + i * 116, 250]} c="brass" w={1.3} />}
        </g>
      ))}
      <T x={14} y={294} s={10.5} c={C.text}>Free when light but not when tight: the bridge is going down crooked.</T>
      <T x={14} y={310} s={10.5} c={C.dim}>No endshake? Back the screws off and look again.</T>
      <T x={14} y={326} s={10} c={C.faint}>Forum posters report over-tightened bridges as a hidden cause of low amplitude.</T>
    </F>
  )
}

function SaForkSnap() {
  return (
    <F h={316} view="Plan · fit the fork, then a power check" scale="schematic">
      <Pn x={12} y={26} w={250} h={262} t="A little power on the barrel" />
      <EscW cx={137} cy={84} r={42} rot={4} />
      <Fork x={137} y={164} k={1.35} tilt={6} />
      {/* banking pins */}
      <circle cx={117} cy={226} r={4} fill="#c5ced4" stroke={M.steelD} />
      <circle cx={157} cy={226} r={4} fill="#c5ced4" stroke={M.steelD} />
      <Arrow d="M110 254 Q137 270 164 254" c="brass" w={1.8} both />
      <Lab p={[117, 226]} x={60} y={246} text="banking" a="end" />
      <T x={56} y={260} a="end" s={10.5} c={C.text}>pins</T>
      <Lab p={[137, 164]} x={210} y={170} text="pallet fork" a="start" />
      <Lab p={[160, 72]} x={210} y={60} text="escape" a="start" up />
      <T x={214} y={74} s={10.5} c={C.text}>wheel</T>
      <T x={137} y={284} a="middle" s={10.5} c={C.brassHi}>snaps side to side</T>

      <Pn x={272} y={26} w={196} h={122} t="Crisp snap" tc={C.emerald} c={C.emerald} ok />
      <Note x={284} y={68} lines={['The fork flicks from', 'banking to banking', 'when you nudge it.', 'Proof the train is free.']} c={C.text} s={10.5} lh={15} />
      <Pn x={272} y={156} w={196} h={132} t="Lazy, or no snap" tc={C.ruby} c={C.ruby} ok={false} />
      <Note x={284} y={198} lines={['The train isn’t free.', 'Find out why before', 'the balance goes in:', 'go back to endshake.']} c={C.text} s={10.5} lh={15} />
      <T x={14} y={306} s={10} c={C.faint}>Install the fork and its bridge first, then put a little power on.</T>
    </F>
  )
}

function SaBalanceIn() {
  return (
    <F h={316} view="Side + inset · balance in last" scale="schematic">
      <Pn x={12} y={26} w={262} h={236} t="Lower balance and cock" />
      <rect x={30} y={226} width={226} height={14} fill="url(#sa-cut)" stroke="#4a4436" strokeWidth="0.6" />
      {/* cock */}
      <path d="M60 86 L200 86 L200 100 L150 100 L150 112 L110 112 L110 100 L60 100 Z" fill={M.plateL} stroke={C.struct} />
      <rect x={128} y={112} width={4} height={100} fill="url(#sk-steelH)" />
      <rect x={92} y={150} width={76} height={8} rx="2" fill={M.brassP} />
      <path d="M100 136 L160 136" stroke={C.steel} strokeWidth="1.6" />
      <rect x={124} y={190} width={12} height={8} fill="#c9a24c" />
      <rect x={134} y={192} width={4} height={8} fill={M.ruby} />
      <rect x={140} y={192} width={64} height={5} rx="1" fill="rgba(134,167,189,0.5)" stroke={C.steel} strokeWidth="0.6" />
      <rect x={198} y={180} width={4} height={46} fill="url(#sk-steelH)" />
      <Lab p={[180, 196]} x={208} y={216} text="pallet fork" a="start" />
      <Arrow a={[230, 60]} b={[230, 120]} c="brass" w={1.6} />
      <T x={236} y={56} s={10.5} c={C.brassHi} a="middle">gently</T>
      <Lab p={[160, 136]} x={214} y={146} text="hairspring" a="start" />
      <T x={218} y={160} s={10} c={C.emerald}>settles flat</T>
      <Lab p={[136, 196]} x={100} y={190} text="impulse jewel" a="end" />
      <T x={96} y={204} a="end" s={10} c={C.dim}>on the roller</T>
      <T x={22} y={254} s={10.5} c={C.dim}>balance and cock together</T>

      <Pn x={284} y={26} w={184} h={236} t="Inset · from above" />
      <Ring x={376} y={140} r={78} />
      <circle cx={376} cy={92} r={20} fill="rgba(201,162,76,0.25)" stroke="#c9a24c" />
      <rect x={372} y={108} width={8} height={10} fill={M.ruby} />
      <path d="M356 214 L362 128 L370 116 L370 132 L382 132 L382 116 L390 128 L396 214 Z" fill="rgba(134,167,189,0.22)" stroke={C.steel} />
      <Verdict x={440} y={58} ok r={8} />
      <Lab p={[376, 113]} x={440} y={110} text="jewel" a="end" />
      <T x={376} y={238} a="middle" s={10.5} c={C.text}>between the horns</T>
      <Lab p={[364, 126]} x={310} y={170} text="horns" a="start" />

      <T x={14} y={284} s={10.5} c={C.text}>With power on, the watch should spring to life.</T>
      <T x={14} y={302} s={10} c={C.faint}>Won’t start? The next step works down the list.</T>
    </F>
  )
}

function SaBalanceNoStart() {
  const Fk = ({ x, y, out }) => (
    <g>
      <path d={`M${x - 20} ${y + 50} L${x - 14} ${y + 12} L${x - 6} ${y} L${x - 6} ${y + 16} L${x + 6} ${y + 16} L${x + 6} ${y} L${x + 14} ${y + 12} L${x + 20} ${y + 50} Z`} fill="rgba(134,167,189,0.22)" stroke={C.steel} />
      <circle cx={x} cy={y - 30} r={20} fill="rgba(201,162,76,0.25)" stroke="#c9a24c" />
      <rect x={out ? x - 26 : x - 4} y={out ? y - 4 : y - 12 + 16} width={8} height={10} fill={M.ruby} transform={out ? `rotate(-50 ${x} ${y - 30})` : undefined} />
      <Verdict x={x + 34} y={y - 36} ok={!out} r={7} />
    </g>
  )
  return (
    <F h={334} view="Fault list · the balance won’t start" scale="schematic">
      <T x={14} y={44} s={10.5} c={C.dim}>Puff air at the balance. Dead, or won’t keep going? Work down this list.</T>
      <Pn x={12} y={54} w={190} h={156} t="1 · Commonest slip" />
      <Fk x={60} y={128} out />
      <Fk x={146} y={128} />
      <T x={60} y={202} a="middle" s={10} c={C.ruby}>outside the horns</T>
      <T x={146} y={202} a="middle" s={10} c={C.emerald}>between them</T>
      {[
        ['Ease the cock screw, lift the balance', 'slightly so the jewel drops in, tighten.'],
        ['Hairspring caught on the regulator pins,', 'rubbing the arms or the cock? Fluff below?'],
        ['Check balance endshake.', ''],
        ['Still stuck? Let the power down, lift out', 'balance and fork, refit the balance alone.'],
      ].map(([a, b], i) => (
        <g key={a}>
          <Num x={224} y={68 + i * 42} n={i === 0 ? '1' : i + 1} r={8} />
          <T x={238} y={72 + i * 42} s={10.5} c={C.text}>{a}</T>
          {b && <T x={238} y={86 + i * 42} s={10.5} c={C.dim}>{b}</T>}
        </g>
      ))}
      <Sep x1={12} y1={226} x2={468} y2={226} />
      <Bx x={12} y={240} w={210} h={44} l={['Balance alone swings freely?']} c={C.brass} />
      <Arrow a={[222, 262]} b={[246, 262]} c="emerald" w={1.4} />
      <Bx x={248} y={240} w={220} h={44} l={['The fault is in how', 'the jewel meets the fork']} c={C.emerald} s={10.5} />
      <T x={14} y={306} s={10.5} c={C.dim}>With the jewel in the horns and power on, it should start straight away.</T>
      <T x={14} y={324} s={10} c={C.faint}>This list comes from forum fault reports.</T>
    </F>
  )
}

function SaDialHands() {
  return (
    <F h={290} view="Front view · refit dial and hands" scale="schematic">
      <Pn x={12} y={26} w={222} h={196} t="Aligned at 12:00" tc={C.emerald} c={C.emerald} ok />
      <Face cx={123} cy={128} r={70} h={0} m={0} />
      <Pn x={246} y={26} w={222} h={196} t="Hour hand off" tc={C.ruby} c={C.ruby} ok={false} />
      <Face cx={357} cy={128} r={70} h={12} m={0} />
      <path d={`M${clk(357, 128, 40, 0).join(' ')} A40 40 0 0 1 ${clk(357, 128, 40, 12).join(' ')}`} fill="none" stroke={C.ruby} strokeWidth="1.6" />
      <T x={123} y={214} a="middle" s={10.5} c={C.text}>hands overlap exactly</T>
      <T x={357} y={214} a="middle" s={10.5} c={C.text}>hour hand lags or leads</T>
      <T x={14} y={246} s={10.5} c={C.text}>Only once the movement runs. Turn the hands through 12:00 and look:</T>
      <T x={14} y={262} s={10.5} c={C.text}>both must point at 12 together.</T>
      <T x={14} y={280} s={10} c={C.faint}>Method: the hands-and-dial lesson.</T>
    </F>
  )
}

/* ================================================================== */
/* svc-test · final testing & regulation                                */
/* ================================================================== */

function SaDemagMeasure() {
  const X = (d) => 40 + (d - 230) * 3.4
  return (
    <F h={300} view="Test · demagnetise, then measure" scale="schematic">
      <Pn x={12} y={26} w={180} h={150} t="1 · Demagnetise" />
      <rect x={42} y={110} width={120} height={40} rx="5" fill="#3b3833" stroke={C.dim} />
      <circle cx={142} cy={130} r={7} fill={C.ruby} />
      <Face cx={92} cy={92} r={22} crown={false} />
      {[0, 1, 2].map((i) => <path key={i} d={`M${60 - i * 6} ${70 - i * 5} q-10 22 0 44`} fill="none" stroke={C.steel} strokeWidth="1" opacity={0.8 - i * 0.2} />)}
      <T x={102} y={166} a="middle" s={10.5} c={C.dim}>before you read anything</T>

      <Pn x={202} y={26} w={266} h={150} t="2 · On the timegrapher" />
      <Screen x={218} y={48} w={234} rows={[['rate', 's/d'], ['amplitude', '°'], ['beat error', 'ms']]} />
      <T x={218} y={152} s={10.5} c={C.text}>read all three</T>

      <Tag x={14} y={202}>Healthy amplitude, fully wound, dial up</Tag>
      <rect x={X(270)} y={212} width={X(310) - X(270)} height={26} rx="3" fill="rgba(123,165,131,0.38)" stroke={C.emerald} />
      <T x={X(290)} y={230} a="middle" s={11} c={C.text} w={600}>roughly 270–310°</T>
      <line x1={X(230)} y1={246} x2={X(350)} y2={246} stroke={C.struct} />
      {[230, 270, 310, 350].map((d) => (
        <g key={d}>
          <line x1={X(d)} y1={242} x2={X(d)} y2={250} stroke={C.faint} />
          <T x={X(d)} y={264} a="middle" s={10} c={C.dim} mono>{d}°</T>
        </g>
      ))}
      <T x={14} y={288} s={10} c={C.faint}>Demagnetise first, then read all three.</T>
    </F>
  )
}

// Watch icon for a position. pos: 'DU','DD','CD','CL','CU','CR'
function PosIcon({ x, y, pos, r = 18 }) {
  if (pos === 'DU' || pos === 'DD') {
    return (
      <g>
        <rect x={x - r - 4} y={y - 4} width={2 * r + 8} height={8} rx="3" fill="url(#sk-steel)" stroke={M.steelD} strokeWidth="0.6" />
        <rect x={x - r} y={pos === 'DU' ? y - 7 : y + 4} width={2 * r} height={3} fill={M.glass} />
        <rect x={x + r + 3} y={y - 3} width={5} height={6} fill="url(#sa-knurl)" />
        <line x1={x - r - 8} y1={y + 10} x2={x + r + 12} y2={y + 10} stroke={C.struct} />
        <T x={x} y={pos === 'DU' ? y - 12 : y - 10} a="middle" s={10} c={C.faint}>{pos === 'DU' ? 'dial ▲' : 'dial ▼'}</T>
      </g>
    )
  }
  const rot = { CR: 0, CD: 90, CL: 180, CU: -90 }[pos]
  return (
    <g>
      <g transform={`rotate(${rot} ${x} ${y})`}>
        <Face cx={x} cy={y} r={r} h={300} m={60} />
      </g>
      <line x1={x - r - 6} y1={y + r + 8} x2={x + r + 6} y2={y + r + 8} stroke={C.struct} />
    </g>
  )
}

function SaPositionsCheck() {
  const bars = (x, vals, c) =>
    vals.map((v, i) => <rect key={i} x={x + i * 34} y={250 - v} width={22} height={v} rx="2" fill={c} opacity="0.75" />)
  return (
    <F h={316} view="Test · dial up, dial down, crown positions" scale="schematic, no values">
      {[['DU', 'dial up'], ['DD', 'dial down'], ['CD', 'crown down'], ['CL', 'crown left'], ['CU', 'crown up']].map(([p, l], i) => (
        <g key={p}>
          <PosIcon x={58 + i * 92} y={74} pos={p} />
          <T x={58 + i * 92} y={124} a="middle" s={10.5} c={C.text}>{l}</T>
        </g>
      ))}
      <Sep x1={12} y1={140} x2={468} y2={140} />
      <Pn x={12} y={150} w={222} h={130} t="Consistent" tc={C.emerald} c={C.emerald} ok />
      {bars(40, [70, 68, 64, 66, 62], C.emerald)}
      <line x1={30} y1={250} x2={214} y2={250} stroke={C.struct} />
      <T x={123} y={268} a="middle" s={10.5} c={C.text}>clean, well oiled</T>
      <Pn x={246} y={150} w={222} h={130} t="Scattered" tc={C.ruby} c={C.ruby} ok={false} />
      {bars(274, [74, 70, 36, 52, 24], C.ruby)}
      <line x1={264} y1={250} x2={448} y2={250} stroke={C.struct} />
      <T x={357} y={268} a="middle" s={10.5} c={C.text}>something to find</T>
      <T x={14} y={302} s={10.5} c={C.dim}>Compare rate and amplitude across the positions, not just one reading.</T>
    </F>
  )
}

function SaSixPositions() {
  const X = (v) => 60 + (v + 8) * 20
  const pts = [['DU', 3], ['DD', 5], ['CD', -3], ['CL', 1], ['CU', 7], ['CR', -1]]
  return (
    <F h={330} view="Chart · six positions and the delta" scale="example values">
      {[['DU', 'dial up'], ['DD', 'dial down'], ['CD', 'crown down'], ['CL', 'crown left'], ['CU', 'crown up'], ['CR', 'crown right']].map(([p, l], i) => (
        <g key={p} opacity={p === 'CR' ? 0.55 : 1}>
          <PosIcon x={46 + i * 78} y={66} pos={p} r={15} />
          <T x={46 + i * 78} y={110} a="middle" s={10} c={C.text}>{l}</T>
        </g>
      ))}
      <T x={436} y={124} a="middle" s={10} c={C.faint}>often dropped</T>
      <Sep x1={12} y1={134} x2={468} y2={134} />
      {/* rate axis */}
      <rect x={X(-4)} y={150} width={X(6) - X(-4)} height={110} fill="rgba(123,165,131,0.10)" stroke={C.emerald} strokeOpacity="0.4" />
      <T x={(X(-4) + X(6)) / 2} y={164} a="middle" s={10} c={C.emerald}>chronometer-grade mean: −4/+6 s/day</T>
      {pts.map(([p, v], i) => (
        <g key={p}>
          <circle cx={X(v)} cy={186 + i * 11} r={4.5} fill={p === 'CR' ? C.faint : C.brassHi} />
          <T x={X(v) + 9} y={190 + i * 11} s={10} c={C.dim} mono>{p}</T>
        </g>
      ))}
      <line x1={X(2)} y1={176} x2={X(2)} y2={252} stroke={C.text} strokeDasharray="3 2" />
      <T x={X(2)} y={258} a="middle" s={10} c={C.text}>mean</T>
      <line x1={X(-8)} y1={268} x2={X(10)} y2={268} stroke={C.struct} />
      {[-4, 0, 6].map((v) => (
        <g key={v}>
          <line x1={X(v)} y1={264} x2={X(v)} y2={272} stroke={C.faint} />
          <T x={X(v)} y={286} a="middle" s={10} c={C.dim} mono>{v > 0 ? `+${v}` : v}</T>
        </g>
      ))}
      <T x={X(10)} y={286} a="end" s={10} c={C.faint}>s/day</T>
      <Dim a={[X(-3), 296]} b={[X(7), 296]} text="" />
      <T x={(X(-3) + X(7)) / 2} y={318} a="middle" s={10.5} c={C.text}>delta = best − worst; about 10 s is a fine serviced result</T>
    </F>
  )
}

function SaIsochronism() {
  return (
    <F h={316} view="Chart · rate as the mainspring runs down" scale="schematic">
      <line x1={50} y1={40} x2={50} y2={200} stroke={C.struct} />
      <line x1={50} y1={200} x2={456} y2={200} stroke={C.struct} />
      <T x={56} y={44} s={10} c={C.faint}>rate</T>
      <T x={56} y={216} s={10} c={C.dim}>fully wound</T>
      <T x={456} y={216} a="end" s={10} c={C.dim}>after 24 hours</T>
      <line x1={56} y1={110} x2={450} y2={106} stroke={C.emerald} strokeWidth="2.2" />
      <T x={110} y={100} s={10.5} c={C.emerald}>keeps its rate: isochronous</T>
      <path d="M56 116 C200 120 330 150 450 190" fill="none" stroke={C.ruby} strokeWidth="2.2" />
      <T x={300} y={182} s={10.5} c={C.ruby}>big change</T>
      <path d="M56 70 C200 74 330 104 450 144" fill="none" stroke={C.ruby} strokeWidth="1.4" strokeDasharray="4 3" />
      <Arrow a={[420, 172]} b={[420, 142]} c="brass" w={1.4} />
      <T x={330} y={62} s={10.5} c={C.brassHi}>regulator moves it up,</T>
      <T x={330} y={76} s={10.5} c={C.brassHi}>the slope stays</T>
      {[56, 450].map((x) => <circle key={x} cx={x} cy={x === 56 ? 112 : 106} r={4} fill={C.text} />)}

      <Sep x1={12} y1={232} x2={468} y2={232} />
      <T x={14} y={252} s={11} c={C.text} w={600}>A big change points to</T>
      {['a tired mainspring', 'a barrel problem', 'a hairspring not breathing evenly'].map((l, i) => (
        <T key={l} x={[14, 140, 262][i]} y={272} s={10.5} c={C.dim}>{l}</T>
      ))}
      <T x={14} y={298} s={10.5} c={C.text}>A mainspring or hairspring conversation, not something the regulator can fix.</T>
    </F>
  )
}

function SaPowerReserve() {
  const X = (h) => 112 + h * 5
  return (
    <F h={334} view="Test · run it out, dial up" scale="maker figures">
      {[
        ['Wind fully', ''],
        ['Note the time', ''],
        ['Leave dial up', ''],
        ['Note the stop', ''],
      ].map(([a], i) => (
        <g key={a}>
          <rect x={12 + i * 116} y={28} width={104} height={32} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.brass} strokeOpacity="0.6" />
          <Num x={26 + i * 116} y={44} n={i + 1} r={8} />
          <T x={40 + i * 116} y={48} s={10.5} c={C.text} w={600}>{a}</T>
          {i < 3 && <Arrow a={[117 + i * 116, 44]} b={[127 + i * 116, 44]} c="brass" w={1.3} />}
        </g>
      ))}
      <Tag x={14} y={86}>Compare with the maker’s figure</Tag>
      {[['2824-2', 38, 42, 98], ['7750', 48, 54, 130]].map(([n, mn, ty, y]) => (
        <g key={n}>
          <T x={14} y={y + 14} s={11} c={C.text} w={600}>ETA {n}</T>
          <rect x={X(0)} y={y} width={X(mn) - X(0)} height={20} rx="3" fill="rgba(123,165,131,0.35)" stroke={C.emerald} />
          <rect x={X(mn)} y={y} width={X(ty) - X(mn)} height={20} rx="3" fill="rgba(123,165,131,0.15)" stroke={C.emerald} strokeDasharray="3 2" />
          <T x={X(mn) - 4} y={y + 14} a="end" s={10} c={C.text} mono>{mn} h min</T>
          <T x={X(ty) + 4} y={y + 14} s={10} c={C.dim} mono>{ty} h typical</T>
        </g>
      ))}
      <line x1={X(0)} y1={160} x2={X(60)} y2={160} stroke={C.struct} />
      {[0, 24, 48].map((h) => (
        <g key={h}>
          <line x1={X(h)} y1={156} x2={X(h)} y2={164} stroke={C.faint} />
          <T x={X(h)} y={176} a="middle" s={10} c={C.dim} mono>{h} h</T>
        </g>
      ))}

      <Pn x={12} y={188} w={222} h={104} t="Automatic: no hard stop" />
      <T x={22} y={222} s={10.5} c={C.text}>Wind well past the 10 to 15</T>
      <T x={22} y={236} s={10.5} c={C.text}>turns of a timing check.</T>
      <T x={22} y={258} s={10.5} c={C.dim}>A Miyota 9075 is reported</T>
      <T x={22} y={272} s={10.5} c={C.dim}>to take about 40 turns from empty.</T>

      <Pn x={246} y={188} w={222} h={104} t="Falls short? Check, in order" tc={C.ruby} />
      {['the mainspring', 'the wall grease (automatic)', 'drag in the train'].map((l, i) => (
        <g key={l}>
          <Num x={262} y={218 + i * 24} n={i + 1} r={7} />
          <T x={276} y={222 + i * 24} s={10.5} c={C.text}>{l}</T>
        </g>
      ))}
      <T x={14} y={314} s={10} c={C.faint}>A service should give back the full reserve; running it out is the only proof.</T>
    </F>
  )
}

function SaBeatThenRate() {
  const cx = 124
  const cy = 84
  const [ix, iy] = clk(cx, cy, 100, 186)
  const [sx, sy] = clk(cx, cy, 44, 300)
  return (
    <F h={320} view="Plan · beat first, then rate" scale="schematic">
      <Pn x={12} y={26} w={226} h={236} t="Balance cock, from above" />
      <path d={`M${cx - 30} ${cy - 22} Q${cx} ${cy - 36} ${cx + 30} ${cy - 22} L${cx + 80} ${cy + 116} L${cx - 80} ${cy + 116} Z`} fill={M.plateL} stroke={C.struct} opacity="0.85" />
      <circle cx={cx - 46} cy={cy + 66} r={6} fill={C.ground} stroke={C.struct} />
      {/* scale arc engraved on the cock */}
      <path d={`M${clk(cx, cy, 104, 160).join(' ')} A104 104 0 0 1 ${clk(cx, cy, 104, 200).join(' ')}`} fill="none" stroke={C.ground} strokeWidth="1" />
      {[160, 170, 180, 190, 200].map((d) => {
        const [a, b] = clk(cx, cy, 100, d)
        const [c2, d2] = clk(cx, cy, 108, d)
        return <line key={d} x1={a} y1={b} x2={c2} y2={d2} stroke={C.ground} strokeWidth="1" />
      })}
      <T x={clk(cx, cy, 118, 158)[0]} y={clk(cx, cy, 118, 158)[1] + 4} a="middle" s={12} c={C.text} w={700}>+</T>
      <T x={clk(cx, cy, 118, 202)[0]} y={clk(cx, cy, 118, 202)[1] + 4} a="middle" s={12} c={C.text} w={700}>−</T>
      {/* regulator index */}
      <path d={`M${cx - 6} ${cy} L${cx + 6} ${cy} L${ix + 1.5} ${iy} L${ix - 1.5} ${iy} Z`} fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.6" />
      {/* stud carrier */}
      <line x1={cx} y1={cy} x2={sx} y2={sy} stroke={C.steel} strokeWidth="6" strokeLinecap="round" />
      <circle cx={sx} cy={sy} r={4.5} fill="#c5ced4" stroke={M.steelD} />
      <circle cx={cx} cy={cy} r={11} fill={M.ruby} stroke="#7a2232" />
      <Arrow d={`M${clk(cx, cy, 90, 170).join(' ')} A90 90 0 0 1 ${clk(cx, cy, 90, 198).join(' ')}`} c="brass" w={1.4} both />
      <Num x={sx - 16} y={sy - 4} n={1} r={8} />
      <Num x={ix + 20} y={iy - 26} n={2} r={8} />
      <T x={24} y={228} s={10.5} c={C.text}>1 stud or beat adjuster</T>
      <T x={24} y={246} s={10.5} c={C.text}>2 regulator index</T>

      <Pn x={248} y={26} w={220} h={110} t="1 · Beat error first" />
      <Note x={258} y={66} lines={['At the stud or adjuster,', 'if the movement has one.', 'Changing it shifts the rate,', 'so rate comes after.']} c={C.text} s={10.5} lh={15} />
      <Pn x={248} y={144} w={220} h={118} t="2 · Then the rate" />
      {(() => {
        const X = (v) => 270 + (v + 10) * 7.5
        return (
          <g>
            <rect x={X(0)} y={176} width={X(10) - X(0)} height={24} rx="3" fill="rgba(123,165,131,0.38)" stroke={C.emerald} />
            <T x={X(5)} y={192} a="middle" s={10.5} c={C.text} w={600}>small gain</T>
            <line x1={X(-10)} y1={208} x2={X(14)} y2={208} stroke={C.struct} />
            {[-10, 0, 10].map((v) => (
              <g key={v}>
                <line x1={X(v)} y1={204} x2={X(v)} y2={212} stroke={C.faint} />
                <T x={X(v)} y={226} a="middle" s={10} c={C.dim} mono>{v > 0 ? `+${v}` : v}</T>
              </g>
            ))}
            <T x={458} y={252} a="end" s={10} c={C.faint}>s/day</T>
            <T x={258} y={252} s={10} c={C.dim}>0 to +10 s/day</T>
          </g>
        )
      })()}
      <T x={14} y={286} s={10.5} c={C.text}>Beat first, rate second: a beat change shifts the rate.</T>
      <T x={14} y={304} s={10} c={C.faint}>Regulator layouts differ; this one is drawn schematically.</T>
    </F>
  )
}
function SaFunctions() {
  return (
    <F h={334} view="Checklist · test every function before casing" scale="schematic">
      <T x={14} y={42} s={10.5} c={C.dim}>A good trace doesn’t prove the whole watch works.</T>
      {[
        ['Crown positions', 'click through each: crisp detents'],
        ['Hacking', 'stops crown out, restarts in'],
        ['Date change', 'run the hands through it'],
        ['Self-winding', 'on a winder or simulator'],
        ['Power reserve', 'as in the previous step'],
      ].map(([a, b], i) => (
        <Row key={a} x={12} y={52 + i * 32} w={290} ok a={a} b={b} bx={130} />
      ))}
      <Pn x={312} y={52} w={156} h={154} t="Date at noon?" tc={C.ruby} c={C.ruby} />
      <Face cx={390} cy={128} r={44} h={0} m={0} date="15" />
      <T x={390} y={190} a="middle" s={10} c={C.text}>hands are 12 hours out</T>
      <Sep x1={12} y1={220} x2={468} y2={220} />
      <T x={14} y={240} s={10.5} c={C.text}>If the date changes around noon, advance through the change and reset the hands.</T>
      <T x={14} y={264} s={10.5} c={C.dim}>Witschi’s checklist adds the date, the power reserve and self-winding</T>
      <T x={14} y={278} s={10.5} c={C.dim}>as tests of their own.</T>
      <rect x={12} y={290} width={456} height={34} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <T x={22} y={311} s={10.5} c={C.text}>Fix it now: a fault found after casing means doing dial and hands twice.</T>
    </F>
  )
}

function SaCaseSeal() {
  return (
    <F h={300} view="Sequence · run on test, then case and seal" scale="schematic">
      <Pn x={12} y={26} w={456} h={110} t="Run 24–48 hours, re-check" />
      <line x1={40} y1={110} x2={440} y2={110} stroke={C.struct} />
      {[0, 24, 48].map((h) => (
        <g key={h}>
          <line x1={40 + h * 8.3} y1={106} x2={40 + h * 8.3} y2={114} stroke={C.faint} />
          <T x={40 + h * 8.3} y={128} a="middle" s={10} c={C.dim} mono>{h} h</T>
        </g>
      ))}
      <path d="M40 78 L438 76" stroke={C.emerald} strokeWidth="2" />
      {[0, 24, 48].map((h) => <circle key={h} cx={40 + h * 8.3} cy={78 - h * 0.04} r={4} fill={C.text} />)}
      <T x={240} y={66} a="middle" s={10.5} c={C.emerald}>the readings hold</T>

      {[
        ['Case it', 'movement in'],
        ['Fresh gaskets', 'replace them'],
        ['Close', ''],
        ['Pressure-test', 'then it’s done'],
      ].map(([a, b], i) => (
        <g key={a}>
          <rect x={12 + i * 116} y={156} width={104} height={50} rx="6" fill="rgba(255,255,255,0.03)" stroke={i === 3 ? C.emerald : C.brass} strokeOpacity="0.7" />
          <Num x={26 + i * 116} y={181} n={i + 1} r={8} />
          <T x={40 + i * 116} y={b ? 178 : 185} s={10.5} c={C.text} w={600}>{a}</T>
          {b && <T x={40 + i * 116} y={192} s={10} c={C.dim}>{b}</T>}
          {i < 3 && <Arrow a={[117 + i * 116, 181]} b={[127 + i * 116, 181]} c="brass" w={1.3} />}
        </g>
      ))}
      {/* gasket ring */}
      <circle cx={180} cy={244} r={20} fill="none" stroke="#e08a55" strokeWidth="4" />
      <T x={210} y={248} s={10.5} c={C.dim}>a fresh gasket at each seal</T>
      <T x={14} y={284} s={10.5} c={C.text}>Only declare it done once it has held its readings and passed the pressure test.</T>
    </F>
  )
}

export const FIGS = {
  'sa-why-service': SaWhy,
  'sa-expectations': SaExpect,
  'sa-safety': SaSafety,
  'sa-photos': SaPhotos,
  'sa-intake': SaIntake,
  'sa-letdown': SaLetDown,
  'sa-auto-off': SaAutoOff,
  'sa-train-test': SaTrainTest,
  'sa-bridge-stuck': SaBridgeStuck,
  'sa-bare-plate': SaBarePlate,
  'sa-sort': SaSort,
  'sa-no-wash': SaNoWash,
  'sa-peg': SaPeg,
  'sa-balance-dip': SaBalanceDip,
  'sa-handle-clean': SaHandleClean,
  'sa-oil-match': SaOilMatch,
  'sa-grease': SaGrease,
  'sa-inca-release': SaIncaRelease,
  'sa-kif-release': SaKifRelease,
  'sa-jewel-lift': SaJewelLift,
  'sa-cap-oil-refit': SaCapOilRefit,
  'sa-shock-check': SaShockCheck,
  'sa-auto-diagnose': SaAutoDiagnose,
  'sa-rotor-check': SaRotorCheck,
  'sa-rotor-bearing': SaRotorBearing,
  'sa-reverser-sheet': SaReverserSheet,
  'sa-reverser-unit': SaReverserUnit,
  'sa-reverser-dip': SaReverserDip,
  'sa-auto-prove': SaAutoProve,
  'sa-rebuild-up': SaRebuildUp,
  'sa-endshake': SaEndshake,
  'sa-fork-snap': SaForkSnap,
  'sa-balance-in': SaBalanceIn,
  'sa-balance-nostart': SaBalanceNoStart,
  'sa-dial-hands': SaDialHands,
  'sa-demag-measure': SaDemagMeasure,
  'sa-positions-check': SaPositionsCheck,
  'sa-six-positions': SaSixPositions,
  'sa-isochronism': SaIsochronism,
  'sa-power-reserve': SaPowerReserve,
  'sa-beat-then-rate': SaBeatThenRate,
  'sa-functions': SaFunctions,
  'sa-case-seal': SaCaseSeal,
}
