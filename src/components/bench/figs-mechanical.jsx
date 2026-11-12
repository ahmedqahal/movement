// Diagrams for the "Mechanical Movement Skills" track: letting down the
// mainspring, uncasing, dial and hands, diagnosis, the barrel, regulating,
// oiling, crown and stem, truing the balance, broken screws and the keyless
// works. Each figure shows the step's own operation, with its numbers.
// Original schematics built on the strap kit. Nothing is traced from an ETA,
// Witschi or other published figure, and every number matches the step text.
import { C, Fig, T, Note, Dim, Arrow, Num, Verdict, Tag, Sep } from '../strap/kit.jsx'

/* ------------------------------------------------------------------ */
/* Palette and defs for this file                                       */
/* ------------------------------------------------------------------ */
const M = {
  plate: '#5b5339',
  dial: '#d8d0bd',
  dialDark: '#25221f',
  glass: '#a9d0de',
  grease: '#8fd19e',
  oil: '#7fc4e8',
  ink: '#120f0d',
  ruby: '#c9495e',
  brassP: '#b89548',
  brassD: '#7d6430',
  steelD: '#55646e',
  tray: '#e4dccb',
  plastic: '#e9e1c6',
  wood: '#c9a36b',
  gasket: '#e08a55',
  bridge: '#8b8574',
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
      {hatch('mk-cut', '#6f808b', '#a3b3bd')}
      {hatch('mk-mov', '#433c31', '#5e5546')}
      {hatch('mk-bcut', '#7f6a33', '#c6a65c')}
      {hatch('mk-pcut', '#b9b08f', '#ddd4b4')}
      <pattern id="mk-knurl" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#a7b6bf" />
        <line x1="2" y1="0" x2="2" y2="4" stroke="#55646e" strokeWidth="1" />
      </pattern>
      <pattern id="mk-thread" width="4" height="10" patternUnits="userSpaceOnUse">
        <rect width="4" height="10" fill="#b3c2cc" />
        <line x1="0" y1="10" x2="4" y2="0" stroke="#55646e" strokeWidth="1" />
      </pattern>
      <linearGradient id="mk-acr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(190,225,235,0.55)" />
        <stop offset="1" stopColor="rgba(120,170,190,0.28)" />
      </linearGradient>
      <radialGradient id="mk-steelW" cx="0.4" cy="0.35" r="0.85">
        <stop offset="0" stopColor="#dfe7ec" />
        <stop offset="0.6" stopColor="#9fb0ba" />
        <stop offset="1" stopColor="#5f717d" />
      </radialGradient>
      <radialGradient id="mk-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="rgba(250,236,190,0.9)" />
        <stop offset="1" stopColor="rgba(250,236,190,0)" />
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
const pts = (a) => a.map((p) => p.join(',')).join(' ')

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

// Numbered step row: disc, bold head, dim second line
const Step = ({ x, y, n, h, s, c = C.brass }) => (
  <g>
    <Num x={x} y={y} n={n} r={8} c={c} />
    <T x={x + 14} y={y + 4} s={11} c={C.text} w={600}>{h}</T>
    {s && (Array.isArray(s) ? s : [s]).map((l, i) => (
      <T key={i} x={x + 14} y={y + 18 + i * 13} s={10} c={C.dim}>{l}</T>
    ))}
  </g>
)

// Warning band
const Warn = ({ x, y, w, h = 34, head, text, c = C.ruby }) => (
  <g>
    <rect x={x} y={y} width={w} height={h} rx="6" fill={c === C.ruby ? 'rgba(194,88,99,0.10)' : 'rgba(123,165,131,0.10)'} stroke={c} />
    <T x={x + 10} y={y + (text ? 15 : h / 2 + 4)} s={11} c={c} w={700}>{head}</T>
    {text && (Array.isArray(text) ? text : [text]).map((l, i) => (
      <T key={i} x={x + 10} y={y + 29 + i * 13} s={10.5} c={C.text}>{l}</T>
    ))}
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

// Curved turning arrow round (cx, cy) in clock degrees; to > from = clockwise
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
// Gear wheel in plan: teeth as a dashed rim, spokes, pivot
function Wheel({ cx, cy, r, c = M.brassP, spokes = 4, teeth = true, rot = 0, jewel = true }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={c} strokeWidth={teeth ? Math.max(2, r * 0.12) : 1.4} strokeDasharray={teeth ? `${Math.max(1.2, r * 0.09)} ${Math.max(1, r * 0.07)}` : undefined} />
      <circle cx={cx} cy={cy} r={r * 0.86} fill="rgba(201,162,76,0.10)" stroke={c} strokeWidth="1" />
      {Array.from({ length: spokes }, (_, i) => {
        const [x, y] = pol(cx, cy, r * 0.84, rot + (i * 360) / spokes)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={c} strokeWidth={Math.max(1, r * 0.08)} />
      })}
      {jewel && <circle cx={cx} cy={cy} r={Math.max(2, r * 0.14)} fill={M.ruby} stroke={C.ground} strokeWidth="0.6" />}
    </g>
  )
}

// Ratchet wheel with saw teeth. dir 1: winds clockwise on screen (the click
// rides up the ramps), and the radial faces catch the click when it runs back.
function Ratchet({ cx, cy, r, n = 30, rot = 0, screw = true, d = 0.92 }) {
  const st = 360 / n
  const p = []
  for (let i = 0; i < n; i++) {
    const a = rot + i * st
    p.push(pol(cx, cy, r * d, a), pol(cx, cy, r, a), pol(cx, cy, r * d, a + st))
  }
  return (
    <g>
      <polygon points={pts(p)} fill="url(#mk-steelW)" stroke="#3e4a52" strokeWidth="0.8" />
      {[0.72, 0.56, 0.4].map((k) => (
        <circle key={k} cx={cx} cy={cy} r={r * k} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="0.7" />
      ))}
      {screw && <Screw x={cx} y={cy} r={Math.max(5, r * 0.16)} ang={25} />}
    </g>
  )
}

// Click (pawl) whose tip sits at clock-free screen angle phi on a ratchet of radius r.
// The pivot lies behind the tip, so a tooth running back pushes the click onto its pivot.
function Click({ cx, cy, r, phi, lift = 0 }) {
  const tip = pol(cx, cy, r * 0.92 + lift, phi)
  const pv = pol(cx, cy, r * 1.32, phi - 26)
  const a = Math.atan2(tip[1] - pv[1], tip[0] - pv[0])
  const nx = -Math.sin(a)
  const ny = Math.cos(a)
  const body = [
    [pv[0] + nx * 7, pv[1] + ny * 7],
    [tip[0] + nx * 2, tip[1] + ny * 2],
    tip,
    [pv[0] - nx * 7, pv[1] - ny * 7],
  ]
  const spr = pol(cx, cy, r * 1.42, phi + 6)
  return (
    <g>
      <path d={`M${spr[0]} ${spr[1]} Q${(spr[0] + tip[0]) / 2 + nx * 10} ${(spr[1] + tip[1]) / 2 + ny * 10} ${(pv[0] + tip[0]) / 2} ${(pv[1] + tip[1]) / 2}`} fill="none" stroke={C.steel} strokeWidth="1.4" />
      <polygon points={pts(body)} fill="url(#sk-steelH)" stroke="#3e4a52" strokeWidth="0.8" />
      <Screw x={pv[0]} y={pv[1]} r={5} ang={60} />
    </g>
  )
}

// Steel wheel with symmetric teeth (crown wheel, winding parts)
function Gear({ cx, cy, r, n = 24, d = 0.88, fill = 'url(#mk-steelW)', screw = true }) {
  const st = 360 / n
  const p = []
  for (let i = 0; i < n; i++) {
    const a = i * st
    p.push(pol(cx, cy, r * d, a), pol(cx, cy, r, a + st * 0.3), pol(cx, cy, r, a + st * 0.5), pol(cx, cy, r * d, a + st * 0.8))
  }
  return (
    <g>
      <polygon points={pts(p)} fill={fill} stroke="#3e4a52" strokeWidth="0.7" />
      {screw && <Screw x={cx} y={cy} r={Math.max(4, r * 0.2)} ang={-40} />}
    </g>
  )
}

// Balance wheel with hairspring, plan
function Balance({ cx, cy, r, spring = true, arms = 3 }) {
  const sp = []
  for (let a = 0; a < 360 * 3.2; a += 12) {
    const rr = r * 0.12 + (a / (360 * 3.2)) * r * 0.48
    sp.push(pol(cx, cy, rr, a))
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={M.brassP} strokeWidth={Math.max(2.5, r * 0.13)} />
      {Array.from({ length: arms }, (_, i) => {
        const [x, y] = pol(cx, cy, r, 30 + (i * 360) / arms)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={M.brassP} strokeWidth="1.8" />
      })}
      {spring && <polyline points={pts(sp)} fill="none" stroke={C.steel} strokeWidth="0.9" />}
      <circle cx={cx} cy={cy} r={2.6} fill={M.ruby} />
    </g>
  )
}

// Escape wheel (club teeth, schematic) in plan
function EscW({ cx, cy, r, n = 15, c = C.steel }) {
  const p = []
  for (let i = 0; i < n; i++) {
    const a = (i * 360) / n
    p.push(pol(cx, cy, r * 0.7, a), pol(cx, cy, r, a + 6), pol(cx, cy, r, a + 12), pol(cx, cy, r * 0.7, a + 18))
  }
  return (
    <g>
      <polygon points={pts(p)} fill="rgba(134,167,189,0.12)" stroke={c} strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r * 0.25} fill="none" stroke={c} strokeWidth="1" />
      <circle cx={cx} cy={cy} r={2.2} fill={M.ruby} />
    </g>
  )
}

// Timegrapher screen: kind = clean | fast | slow | low | fuzzy | beat | wrap
function Trace({ x, y, w, h, kind = 'clean', label, c }) {
  const n = 22
  const slope = { fast: -0.9, slow: 0.9 }[kind] || 0
  const spread = kind === 'fuzzy' ? 7 : 0
  const gap = kind === 'beat' ? 16 : kind === 'wrap' ? 0 : 7
  const col = c || (kind === 'clean' ? '#9fd5a8' : '#e7b67a')
  const dots = []
  for (let i = 0; i < n; i++) {
    const px = x + 10 + (i * (w - 20)) / (n - 1)
    const base = y + h / 2 + slope * (i - n / 2) * (h / 40)
    const j = spread ? ((i * 37) % 11) / 11 - 0.5 : 0
    const j2 = spread ? ((i * 53) % 13) / 13 - 0.5 : 0
    dots.push([px, base - gap / 2 + j * spread * 2], [px, base + gap / 2 + j2 * spread * 2])
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="4" fill="#141c18" stroke={C.steel} strokeWidth="0.8" />
      {[0.25, 0.5, 0.75].map((k) => (
        <line key={k} x1={x + 2} y1={y + h * k} x2={x + w - 2} y2={y + h * k} stroke="rgba(160,200,170,0.12)" />
      ))}
      {dots.map(([a, b], i) => (
        <circle key={i} cx={a} cy={Math.min(y + h - 3, Math.max(y + 3, b))} r="1.5" fill={col} />
      ))}
      {label && (
        <T x={x + w / 2} y={y + h + 14} a="middle" s={10.5} c={C.text}>
          {label}
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
      <rect x="-6" y={-len} width="12" height={Math.max(0, len - 30)} rx="2" fill="url(#mk-knurl)" stroke="#55646e" strokeWidth="0.6" />
      <rect x="-5" y={-len - 6} width="10" height="7" rx="2" fill="#7c8d97" />
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
function Pegwood({ len = 90 }) {
  return <path d={`M-1 0 L1 0 L4 -24 L4 ${-len} L-4 ${-len} L-4 -24 Z`} fill={M.wood} stroke="#8a6a3c" strokeWidth="0.6" />
}
// Pin vice: collet jaws at (0,0), body up
function PinVice({ len = 80 }) {
  return (
    <g>
      <path d="M-4 0 L4 0 L6 -10 L-6 -10 Z" fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.5" />
      <rect x="-8" y="-24" width="16" height="14" rx="2" fill="url(#mk-knurl)" stroke={M.steelD} strokeWidth="0.6" />
      <rect x="-5" y={-len} width="10" height={Math.max(0, len - 24)} rx="2" fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.5" />
      <circle cx="0" cy={-len} r="5" fill="#7c8d97" />
    </g>
  )
}
// Hollow hand-setting pusher, face at (0,0)
function Pusher({ d = 8, len = 80 }) {
  return (
    <g>
      <path d={`M${-d / 2} 0 L${-d / 2} -22 L${d / 2} -22 L${d / 2} 0`} fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.5" />
      <rect x="-6" y={-len} width="12" height={Math.max(0, len - 22)} rx="2" fill="url(#mk-knurl)" stroke={M.steelD} strokeWidth="0.6" />
    </g>
  )
}

// Movement seen in section between plate and bridge: one wheel and pivots
function WheelSection({ x, y, w = 90, gapH = 34, bridge = true, tilt = 0 }) {
  return (
    <g>
      <rect x={x} y={y + gapH} width={w} height={10} fill="url(#mk-bcut)" />
      {bridge && <rect x={x} y={y - 10} width={w} height={10} fill="url(#mk-bcut)" />}
      <g transform={`rotate(${tilt} ${x + w / 2} ${y + gapH / 2})`}>
        <line x1={x + w / 2} y1={y - 4} x2={x + w / 2} y2={y + gapH + 4} stroke={C.steel} strokeWidth="2.4" />
        <rect x={x + w / 2 - 26} y={y + gapH / 2 - 2} width={52} height={4} fill={M.brassP} />
      </g>
      <rect x={x + w / 2 - 4} y={y + gapH} width={8} height={4} fill={M.ruby} />
      {bridge && <rect x={x + w / 2 - 4} y={y - 4} width={8} height={4} fill={M.ruby} />}
    </g>
  )
}

/* ================================================================== */
/* mech-letdown · safely let down the mainspring                        */
/* ================================================================== */

function MkLetdownWhy() {
  const chain = [
    ['Barrel', 'mainspring'],
    ['Train', 'wheels'],
    ['Escape', 'wheel'],
    ['Pallets', ''],
    ['Balance', ''],
  ]
  return (
    <F h={322} view="Sequence · where the stored torque goes" scale="schematic">
      {chain.map(([a, b], i) => (
        <g key={a}>
          <Bx x={12 + i * 92} y={30} w={80} h={40} l={b ? [a, b] : [a]} c={i === 0 ? C.brass : C.struct} />
          {i < 4 && <Arrow a={[93 + i * 92, 50]} b={[103 + i * 92, 50]} c="brass" w={1.4} />}
        </g>
      ))}
      <T x={12} y={88} s={10.5} c={C.dim}>Wound, the spring pushes on every wheel at once. Only the escapement holds it back.</T>

      <Pn x={12} y={100} w={222} h={156} t="Bridge on" tc={C.emerald} c={C.emerald} ok />
      <WheelSection x={40} y={160} w={80} />
      <WheelSection x={128} y={160} w={80} />
      <T x={123} y={232} a="middle" s={10.5} c={C.text}>each pivot held top and bottom</T>
      <T x={123} y={246} a="middle" s={10} c={C.faint}>torque passes on, tooth to tooth</T>

      <Pn x={246} y={100} w={222} h={156} t="Bridge off, still wound" tc={C.ruby} c={C.ruby} ok={false} />
      <rect x={270} y={130} width={90} height={10} fill="url(#mk-bcut)" transform="rotate(-10 315 135)" />
      <WheelSection x={270} y={172} w={80} bridge={false} tilt={-16} />
      <WheelSection x={358} y={172} w={80} bridge={false} tilt={12} />
      <Arrow d="M300 162 q10 -14 22 -4" c="ruby" w={1.6} />
      <Arrow d="M414 162 q-10 -14 -22 -4" c="ruby" w={1.6} />
      <T x={357} y={232} a="middle" s={10.5} c={C.ruby}>wheels jump, teeth bend,</T>
      <T x={357} y={246} a="middle" s={10.5} c={C.ruby}>the escapement is damaged</T>

      <Warn x={12} y={266} w={456} h={46} head="The number-one safety step in mechanical work" text="Never remove the balance or train bridge with the mainspring wound." />
    </F>
  )
}

function MkLetdownHolder() {
  return (
    <F h={312} view="Plan and side · secure the movement" scale="schematic">
      <Pn x={12} y={26} w={262} h={210} t="In a movement holder" tc={C.emerald} c={C.emerald} ok />
      {/* holder base */}
      <rect x={38} y={70} width={210} height={120} rx="10" fill="#2c2722" stroke={C.struct} />
      <rect x={52} y={124} width={182} height={12} rx="3" fill="url(#sk-steelH)" opacity="0.6" />
      {/* jaws */}
      <path d="M64 100 L96 100 L96 160 L64 160 Z" fill="url(#sk-steel)" stroke={M.steelD} />
      <path d="M190 100 L222 100 L222 160 L190 160 Z" fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={143} cy={130} r={48} fill="url(#mk-mov)" stroke={C.brass} strokeWidth="1.4" />
      <path d="M110 112 Q130 92 170 104 L176 140 L120 150 Z" fill={M.bridge} opacity="0.55" stroke={C.struct} />
      <Ratchet cx={128} cy={122} r={14} n={22} />
      <rect x={191} y={127} width={34} height={5} fill="url(#sk-steel)" />
      <Arrow a={[60, 172]} b={[78, 172]} c="brass" w={1.6} />
      <Arrow a={[226, 172]} b={[208, 172]} c="brass" w={1.6} />
      <T x={143} y={200} a="middle" s={10.5} c={C.brassHi}>jaws closed on the edge</T>
      <T x={143} y={226} a="middle" s={10.5} c={C.text}>nothing shifts while you work</T>
      <Lab p={[208, 100]} x={232} y={56} text="jaw" up />
      <Lab p={[150, 170]} x={78} y={56} text="movement" up />

      <Pn x={284} y={26} w={184} h={210} t="Both hands free" />
      <circle cx={376} cy={130} r={30} fill="url(#mk-mov)" stroke={C.brass} />
      <rect x={406} y={127} width={22} height={5} fill="url(#sk-steel)" />
      <rect x={428} y={121} width={12} height={17} rx="3" fill="url(#mk-knurl)" stroke={M.steelD} />
      <G x={360} y={120} ang={-30}>
        <Pegwood len={70} />
      </G>
      <Lab p={[434, 138]} x={434} y={180} text="one hand:" sub="" />
      <T x={434} y={194} a="middle" s={10.5} c={C.text}>the crown</T>
      <Lab p={[336, 82]} x={322} y={180} text="the other:" />
      <T x={322} y={194} a="middle" s={10.5} c={C.text}>pegwood</T>
      <T x={376} y={222} a="middle" s={10} c={C.faint}>to control the release</T>

      <Pn x={12} y={244} w={456} h={58} t="Not loose on the bench" tc={C.ruby} c={C.ruby} ok={false} />
      <circle cx={60} cy={282} r={14} fill="url(#mk-mov)" stroke={C.brass} />
      <Arrow a={[80, 282]} b={[112, 282]} c="ruby" w={1.6} />
      <T x={124} y={286} s={10.5} c={C.text}>it skids as you turn the crown, and your hand is busy holding it</T>
    </F>
  )
}

function MkLetdownControl() {
  const cx = 112
  const cy = 176
  const r = 72
  const phi = 240
  return (
    <F h={330} view="Plan · letting the power out" scale="schematic">
      {/* bridge outline */}
      <path d="M30 120 Q40 70 120 64 L230 70 L250 150 L230 270 L50 272 Q24 220 30 120 Z" fill={M.bridge} opacity="0.28" stroke={C.struct} />
      <Ratchet cx={cx} cy={cy} r={r} n={56} d={0.94} />
      <Gear cx={196} cy={118} r={31} n={26} />
      <Click cx={cx} cy={cy} r={r} phi={phi} lift={4} />
      <rect x={226} y={115} width={38} height={6} fill="url(#sk-steel)" />
      <rect x={262} y={106} width={14} height={24} rx="3" fill="url(#mk-knurl)" stroke={M.steelD} />
      {/* pegwood lifting the click outward */}
      <G x={72} y={130} ang={-120}>
        <Pegwood len={44} />
      </G>
      {/* motion: ratchet running back (anticlockwise), crown wheel clockwise */}
      <Turn cx={cx} cy={cy} r={r + 16} from={150} to={100} c="emerald" w={2} />
      <Turn cx={196} cy={118} r={40} from={300} to={350} c="emerald" w={1.8} />
      <T x={14} y={318} s={10.5} c={C.emerald}>ratchet and crown wheels turn backwards</T>
      <Lab p={[cx - 20, cy + 46]} x={60} y={294} text="ratchet wheel" />
      <Lab p={[204, 140]} x={232} y={196} text="crown wheel" a="start" />
      <Lab p={[pol(cx, cy, r * 1.32, phi - 26)[0], pol(cx, cy, r * 1.32, phi - 26)[1]]} x={60} y={46} text="click" up />

      {/* inset: click about to ride over a tooth */}
      <Ring x={410} y={84} r={52} />
      <g>
        <path d="M362 112 L382 112 L382 90 L402 112 L422 112 L422 90 L442 112 L458 112" fill="url(#mk-steelW)" stroke="#3e4a52" strokeWidth="1" />
        <path d="M370 52 L414 88 L408 92 L364 60 Z" fill="url(#sk-steelH)" stroke="#3e4a52" />
      </g>
      <T x={410} y={150} a="middle" s={10} c={C.dim}>tip at the crest:</T>
      <T x={410} y={163} a="middle" s={10} c={C.dim}>just about to ride over</T>

      <Step x={300} y={186} n={1} h="Wind slowly to that point" s="and hold the crown there" />
      <Step x={300} y={226} n={2} h="Lift the click clear" s="pegwood or tweezers" />
      <Step x={300} y={266} n={3} h="Let the crown slip back" s={['slowly, through your fingers']} />
      <T x={468} y={318} a="end" s={10} c={C.ruby}>never just release the click</T>
    </F>
  )
}

function MkLetdownDriver() {
  return (
    <F h={318} view="Section and plan · letting down with a screwdriver" scale="schematic">
      <Pn x={12} y={26} w={210} h={196} t="Press straight down" tc={C.emerald} c={C.emerald} ok />
      <rect x={30} y={170} width={174} height={14} fill="url(#mk-bcut)" />
      <rect x={52} y={160} width={130} height={10} fill="url(#mk-cut)" />
      <rect x={106} y={152} width={22} height={8} fill="url(#mk-cut)" />
      <rect x={114} y={152} width={6} height={4} fill={M.ink} />
      <G x={117} y={154}>
        <Screwdriver len={100} blade={6} />
      </G>
      <Arrow a={[148, 70]} b={[148, 110]} c="brass" w={2} />
      <T x={154} y={92} s={10.5} c={C.brassHi}>firm</T>
      <Lab p={[150, 165]} x={176} y={204} text="ratchet wheel" />
      <Lab p={[119, 155]} x={60} y={204} text="screw slot" />

      <Pn x={232} y={26} w={236} h={196} t="A blade that slips" tc={C.ruby} c={C.ruby} ok={false} />
      <rect x={250} y={170} width={200} height={14} fill="url(#mk-bcut)" />
      <rect x={272} y={160} width={156} height={10} fill="url(#mk-cut)" />
      <rect x={340} y={152} width={22} height={8} fill="url(#mk-cut)" />
      <path d="M346 152 L352 156 L358 152" fill={M.ink} />
      <G x={354} y={150} ang={22}>
        <Screwdriver len={100} blade={6} />
      </G>
      <T x={350} y={204} a="middle" s={10.5} c={C.ruby}>chews the slot and</T>
      <T x={350} y={216} a="middle" s={10.5} c={C.ruby}>lets the wheel go</T>

      {/* plan: short controlled moves */}
      <Ratchet cx={62} cy={270} r={34} n={24} />
      <Turn cx={62} cy={270} r={42} from={20} to={45} c="brass" w={1.6} />
      {[0, 1, 2].map((i) => (
        <Turn key={i} cx={62} cy={270} r={42} from={-10 - i * 34} to={-34 - i * 34} c="emerald" w={1.6} />
      ))}
      <Step x={112} y={244} n={1} h="Turn a touch to wind" s="takes the load off the click" />
      <Step x={112} y={284} n={2} h="Click clear, then back" s="in short, controlled moves" />
      <rect x={300} y={234} width={168} height={70} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={310} y={252} s={11} c={C.text} w={600}>Can’t reach the click?</T>
      <T x={310} y={268} s={10.5} c={C.dim}>Leave the watch to run</T>
      <T x={310} y={282} s={10.5} c={C.dim}>down. It’s slow, but</T>
      <T x={310} y={296} s={10.5} c={C.emerald}>it’s safe.</T>
    </F>
  )
}

function MkLetdownConfirm() {
  return (
    <F h={286} view="Inspection · proving the power is out" scale="schematic">
      <Pn x={12} y={26} w={148} h={196} t="Crown" ok />
      <rect x={30} y={112} width={70} height={7} fill="url(#sk-steel)" />
      <rect x={100} y={102} width={18} height={27} rx="3" fill="url(#mk-knurl)" stroke={M.steelD} />
      <Turn cx={109} cy={116} r={22} from={-30} to={30} c="text" w={1.4} />
      <T x={86} y={160} a="middle" s={10.5} c={C.text}>turn it a little and let go:</T>
      <T x={86} y={174} a="middle" s={10.5} c={C.emerald}>it no longer pulls back</T>

      <Pn x={170} y={26} w={148} h={196} t="Balance" ok />
      <Balance cx={244} cy={110} r={34} />
      <Arrow a={[290, 96]} b={[272, 106]} c="brass" w={1.4} />
      <T x={244} y={160} a="middle" s={10.5} c={C.text}>nudge it gently:</T>
      <T x={244} y={174} a="middle" s={10.5} c={C.emerald}>it won’t restart</T>

      <Pn x={328} y={26} w={140} h={196} t="Result" ok />
      <Ratchet cx={398} cy={118} r={30} n={24} />
      <T x={398} y={174} a="middle" s={10.5} c={C.text}>no pull-back, no restart:</T>
      <T x={398} y={188} a="middle" s={10.5} c={C.emerald}>the power is out</T>

      <Bx x={12} y={234} w={456} h={40} l={['Both checks pass: the movement is safe to disassemble']} c={C.emerald} tc={C.emerald} />
    </F>
  )
}

function MkLetdownDamage() {
  const teeth = (x, y, bad) => (
    <g>
      <path
        d={`M${x} ${y} L${x + 14} ${y} L${x + 14} ${y - 16} L${x + 32} ${y} L${x + 46} ${y} ${bad ? `L${x + 46} ${y - 8} L${x + 54} ${y - 6}` : `L${x + 46} ${y - 16}`} L${x + 64} ${y} L${x + 78} ${y} L${x + 78} ${y - 16} L${x + 96} ${y} L${x + 104} ${y} L${x + 104} ${y + 18} L${x} ${y + 18} Z`}
        fill="url(#mk-steelW)"
        stroke="#3e4a52"
      />
    </g>
  )
  return (
    <F h={318} view="Sequence · after the spring got away" scale="schematic">
      <Step x={22} y={38} n={1} h="Fingers clear" s={['let it finish the whirr']} />
      <Step x={176} y={38} n={2} h="Loupe on the teeth" s={['ratchet and click']} />
      <Step x={330} y={38} n={3} h="Test the click spring" s={['it must snap home']} />

      <Pn x={12} y={78} w={300} h={140} t="Ratchet teeth under the loupe" />
      <Ring x={88} y={150} r={52} c={C.emerald} />
      {teeth(36, 154, false)}
      <Verdict x={130} y={110} ok r={8} />
      <T x={88} y={210} a="middle" s={10.5} c={C.emerald}>clean, sharp faces</T>
      <Ring x={232} y={150} r={52} c={C.ruby} />
      {teeth(180, 154, true)}
      <Verdict x={274} y={110} ok={false} r={8} />
      <T x={232} y={210} a="middle" s={10.5} c={C.ruby}>bent or chipped tooth</T>

      <Pn x={322} y={78} w={146} h={140} t="Click spring" />
      <path d="M346 176 L420 140 L424 146 L352 184 Z" fill="url(#sk-steelH)" stroke="#3e4a52" />
      <Screw x={348} y={180} r={5} />
      <path d="M444 194 Q430 160 412 150" fill="none" stroke={C.steel} strokeWidth="1.6" />
      <Arrow a={[430, 126]} b={[420, 142]} c="emerald" w={1.6} />
      <T x={395} y={208} a="middle" s={10.5} c={C.text}>snaps the click home</T>

      <Warn x={12} y={230} w={456} h={76} head="Replace anything damaged" text={['A chipped ratchet tooth can let go again under full power.', 'Check the click, the ratchet teeth and the click spring before you', 'go on with the strip-down.']} />
    </F>
  )
}

/* ================================================================== */
/* mech-uncase · remove the movement from the case                      */
/* ================================================================== */

// case in section: back-loader has the ledge at the dial side
function CaseSec({ x, y, front }) {
  return (
    <g>
      <rect x={x} y={y} width={18} height={70} fill="url(#mk-cut)" stroke={M.steelD} />
      <rect x={x + 142} y={y} width={18} height={70} fill="url(#mk-cut)" stroke={M.steelD} />
      {!front && (
        <>
          <rect x={x + 18} y={y + 6} width={10} height={8} fill="url(#mk-cut)" />
          <rect x={x + 132} y={y + 6} width={10} height={8} fill="url(#mk-cut)" />
        </>
      )}
      {front && (
        <>
          <rect x={x + 18} y={y + 56} width={18} height={14} fill="url(#mk-cut)" />
          <rect x={x + 124} y={y + 56} width={18} height={14} fill="url(#mk-cut)" />
        </>
      )}
    </g>
  )
}

function MkUncaseLoader() {
  return (
    <F h={322} view="Section · two ways out" scale="schematic">
      <Pn x={12} y={26} w={222} h={232} t="Back-loader (most)" />
      <rect x={42} y={50} width={160} height={8} rx="3" fill="url(#mk-acr)" stroke={M.glass} />
      <CaseSec x={42} y={58} />
      <rect x={70} y={72} width={104} height={4} fill={M.dial} />
      <rect x={70} y={108} width={104} height={30} fill="url(#mk-mov)" stroke={C.brass} />
      <Arrow a={[122, 142]} b={[122, 176]} c="brass" w={2.2} />
      <rect x={60} y={196} width={124} height={8} rx="2" fill="url(#mk-cut)" opacity="0.5" />
      <T x={122} y={224} a="middle" s={10.5} c={C.text}>stem released, it drops</T>
      <T x={122} y={238} a="middle" s={10.5} c={C.text}>out of the back</T>
      <Lab p={[64, 66]} x={36} y={186} text="ledge" a="start" />

      <Pn x={246} y={26} w={222} h={232} t="Front-loader" />
      <rect x={276} y={54} width={160} height={8} rx="3" fill="url(#mk-acr)" stroke={M.glass} opacity="0.5" strokeDasharray="3 2" />
      <CaseSec x={276} y={86} front />
      <rect x={296} y={150} width={120} height={8} fill="url(#mk-cut)" />
      <rect x={302} y={158} width={108} height={4} fill={M.gasket} />
      <rect x={306} y={110} width={100} height={30} fill="url(#mk-mov)" stroke={C.brass} />
      <rect x={306} y={104} width={100} height={4} fill={M.dial} />
      <Arrow a={[356, 102]} b={[356, 84]} c="brass" w={2.2} />
      <T x={438} y={78} a="end" s={10} c={C.faint}>bezel and crystal off</T>
      <T x={356} y={212} a="middle" s={10.5} c={C.text}>lift out from the dial side</T>
      <Lab p={[356, 160]} x={430} y={190} text="gasketed back" a="end" />

      <Bx x={12} y={268} w={456} h={44} l={['Tell-tale of a front-loader', 'a plain gasketed caseback, and a movement that won’t drop free']} c={C.brass} />
    </F>
  )
}

function MkUncaseOpen() {
  return (
    <F h={300} view="Sequence · open, let down, turn dial-up" scale="schematic">
      <Pn x={12} y={26} w={146} h={170} />
      <Num x={28} y={42} n={1} />
      <circle cx={85} cy={110} r={44} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={85} cy={110} r={34} fill="url(#mk-mov)" stroke={C.brass} />
      <Ratchet cx={74} cy={104} r={14} n={20} />
      <ellipse cx={128} cy={70} rx={22} ry={8} fill="url(#sk-steel)" transform="rotate(-30 128 70)" opacity="0.8" />
      <T x={85} y={176} a="middle" s={10.5} c={C.text}>open the caseback</T>

      <Pn x={168} y={26} w={146} h={170} />
      <Num x={184} y={42} n={2} />
      <Ratchet cx={232} cy={110} r={36} n={26} />
      <Click cx={232} cy={110} r={36} phi={200} lift={3} />
      <Turn cx={232} cy={110} r={46} from={150} to={110} c="emerald" w={1.8} />
      <T x={241} y={176} a="middle" s={10.5} c={C.text}>let down the power</T>
      <T x={241} y={189} a="middle" s={10} c={C.faint}>previous lesson</T>

      <Pn x={324} y={26} w={144} h={170} />
      <Num x={340} y={42} n={3} />
      <rect x={350} y={62} width={92} height={10} rx="3" fill="url(#mk-acr)" stroke={M.glass} />
      <rect x={348} y={72} width={14} height={40} fill="url(#mk-cut)" />
      <rect x={430} y={72} width={14} height={40} fill="url(#mk-cut)" />
      <rect x={364} y={76} width={64} height={4} fill={M.dial} />
      <rect x={364} y={82} width={64} height={22} fill="url(#mk-mov)" stroke={C.brass} />
      <path d="M342 150 L342 136 L346 136 L346 146 L446 146 L446 136 L450 136 L450 150 Z" fill={M.tray} stroke="#a89c82" />
      <Arrow a={[396, 112]} b={[396, 136]} c="brass" w={1.4} dash="3 3" />
      <T x={396} y={176} a="middle" s={10.5} c={C.text}>dial-up, over a</T>
      <T x={396} y={189} a="middle" s={10.5} c={C.text}>clean tray</T>

      <T x={14} y={220} s={11} c={C.text} w={600}>Why dial-up?</T>
      <T x={14} y={236} s={10.5} c={C.dim}>The open back faces the tray. Anything that springs loose, and later the movement</T>
      <T x={14} y={250} s={10.5} c={C.dim}>itself, falls a short way into the tray instead of across the room.</T>
      <T x={14} y={276} s={10.5} c={C.faint}>A quick look needs no let-down. Anything beyond that does.</T>
    </F>
  )
}

function MkUncaseStemPos() {
  const pos = (x, n) => x + n * 22
  return (
    <F h={326} view="Detail · which crown position releases" scale="schematic">
      <rect x={12} y={26} width={456} height={30} rx="6" fill="rgba(194,88,99,0.10)" stroke={C.ruby} />
      <T x={22} y={46} s={11} c={C.ruby} w={700}>Check your calibre before you press anything.</T>

      {/* case edge, stem and the three positions */}
      <rect x={30} y={78} width={60} height={86} fill="url(#mk-mov)" stroke={C.struct} />
      <rect x={90} y={78} width={20} height={86} fill="url(#mk-cut)" />
      <rect x={60} y={118} width={92} height={6} fill="url(#sk-steel)" />
      <rect x={152} y={110} width={16} height={22} rx="3" fill="url(#mk-knurl)" stroke={M.steelD} />
      {[0, 1, 2].map((n) => (
        <g key={n}>
          <line x1={pos(160, n)} y1={140} x2={pos(160, n)} y2={154} stroke={n === 0 ? C.brass : C.steel} strokeWidth="1.4" />
          <T x={pos(160, n)} y={168} a="middle" s={10.5} c={n === 0 ? C.brassHi : C.steel} mono>{n}</T>
        </g>
      ))}
      <T x={182} y={184} a="middle" s={10} c={C.faint}>crown positions</T>
      <T x={60} y={182} s={10} c={C.faint}>0 = pushed in</T>

      {/* table */}
      <Tag x={250} y={80}>Calibre</Tag>
      <Tag x={372} y={80}>Releases at</Tag>
      {[
        ['Seiko NH, 6R', 'position 0', 'press the lever while you pull'],
        ['Sellita SW260-1', 'time-setting', ''],
        ['Sellita SW500', 'time-setting', 'two clicks out'],
      ].map(([a, b, c2], i) => (
        <g key={a}>
          <line x1={248} y1={88 + i * 34} x2={468} y2={88 + i * 34} stroke={C.line} strokeWidth="0.6" />
          <T x={250} y={104 + i * 34} s={10.5} c={C.text}>{a}</T>
          <T x={372} y={104 + i * 34} s={10.5} c={i ? C.steel : C.brassHi}>{b}</T>
          {c2 && <T x={250} y={117 + i * 34} s={10} c={C.dim}>{c2}</T>}
        </g>
      ))}

      <Pn x={12} y={200} w={222} h={94} t="Sellita: a 1 mm flat tool" />
      <rect x={40} y={262} width={60} height={12} fill="url(#mk-mov)" stroke={C.struct} />
      <rect x={64} y={256} width={12} height={6} fill={M.brassP} />
      <rect x={65} y={226} width={10} height={30} fill="url(#sk-steelH)" stroke={M.steelD} />
      <Verdict x={112} y={238} ok r={8} />
      <rect x={140} y={262} width={60} height={12} fill="url(#mk-mov)" stroke={C.struct} />
      <rect x={164} y={256} width={12} height={6} fill={M.brassP} />
      <path d="M178 258 L184 226 L192 226 Z" fill="url(#sk-steelH)" stroke={M.steelD} />
      <Verdict x={212} y={238} ok={false} r={8} />
      <T x={170} y={288} a="middle" s={10} c={C.ruby}>a point can jam it</T>

      <Pn x={246} y={200} w={222} h={94} t="Stem won’t come?" tc={C.ruby} />
      <T x={258} y={238} s={11} c={C.text} w={600}>Stop. Try the other position</T>
      <T x={258} y={254} s={10.5} c={C.dim}>rather than pulling harder.</T>
      <T x={258} y={274} s={10} c={C.faint}>A released stem slides out easily.</T>

      <T x={14} y={314} s={10} c={C.faint}>Examples from Caliber Corner’s pages. Other calibres differ: look yours up.</T>
    </F>
  )
}

function MkUncaseWithdraw() {
  return (
    <F h={290} view="Side view · withdraw the stem and crown" scale="schematic">
      <Pn x={12} y={26} w={300} h={150} t="Straight out" />
      <rect x={30} y={70} width={110} height={70} fill="url(#mk-mov)" stroke={C.brass} />
      <rect x={140} y={66} width={20} height={78} fill="url(#mk-cut)" />
      <rect x={96} y={102} width={44} height={6} fill="none" stroke={C.steel} strokeDasharray="3 2" />
      <rect x={160} y={102} width={92} height={6} fill="url(#sk-steel)" />
      <rect x={252} y={93} width={18} height={24} rx="3" fill="url(#mk-knurl)" stroke={M.steelD} />
      <Arrow a={[276, 105]} b={[302, 105]} c="emerald" w={2} />
      <G x={92} y={92} ang={20}>
        <Pegwood len={40} />
      </G>
      <T x={226} y={160} a="middle" s={10.5} c={C.emerald}>the stem comes with the crown</T>
      <Lab p={[92, 92]} x={44} y={56} text="release pressed" up a="start" />

      <Pn x={322} y={26} w={146} h={150} t="Not at an angle" tc={C.ruby} c={C.ruby} ok={false} />
      <rect x={334} y={80} width={40} height={60} fill="url(#mk-mov)" stroke={C.brass} />
      <g transform="rotate(-18 380 108)">
        <rect x={378} y={105} width={56} height={6} fill="url(#sk-steel)" />
        <rect x={434} y={96} width={14} height={24} rx="3" fill="url(#mk-knurl)" stroke={M.steelD} />
      </g>
      <T x={395} y={160} a="middle" s={10.5} c={C.ruby}>bends the stem</T>

      <Pn x={12} y={186} w={456} h={92} t="Keep them together" />
      <rect x={36} y={212} width={120} height={56} rx="4" fill={M.tray} stroke="#a89c82" />
      <rect x={60} y={238} width={70} height={4} fill="url(#sk-steel)" />
      <rect x={128} y={232} width={12} height={16} rx="2" fill="url(#mk-knurl)" stroke={M.steelD} />
      <T x={96} y={226} a="middle" s={10} c="#5a5040">stem + crown</T>
      <T x={176} y={226} s={11} c={C.text}>Small and easily lost, and you need</T>
      <T x={176} y={242} s={11} c={C.text}>them both to refit. Give them their own</T>
      <T x={176} y={258} s={11} c={C.text}>covered compartment, together.</T>
    </F>
  )
}

function MkUncaseClamps() {
  return (
    <F h={330} view="Plan and section · what holds it in" scale="schematic">
      <Pn x={12} y={26} w={148} h={178} t="Casing clamps" />
      <circle cx={86} cy={112} r={56} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={86} cy={112} r={46} fill="url(#mk-mov)" stroke={C.brass} />
      {[[50, 76, 40], [122, 148, 220]].map(([x, y, a]) => (
        <g key={x}>
          <path d={`M${x - 8} ${y - 5} L${x + 12} ${y - 5} L${x + 12} ${y + 5} L${x - 8} ${y + 5} Z`} fill={M.brassP} stroke={M.brassD} transform={`rotate(${a} ${x} ${y})`} />
          <Screw x={x} y={y} r={4} ang={a} />
        </g>
      ))}
      <Turn cx={50} cy={76} r={12} from={40} to={-80} c="brass" w={1.4} />
      <T x={86} y={186} a="middle" s={10.5} c={C.text}>loosen, swing clear</T>

      <Pn x={170} y={26} w={148} h={178} t="Movement ring" />
      <circle cx={244} cy={112} r={56} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={244} cy={112} r={48} fill={M.plastic} stroke="#a89c82" />
      <circle cx={244} cy={112} r={34} fill="url(#mk-mov)" stroke={C.brass} />
      <rect x={278} y={109} width={36} height={6} fill="url(#sk-steel)" opacity="0.4" />
      <path d="M236 64 L244 72 L252 64 Z" fill={C.ruby} />
      <T x={244} y={186} a="middle" s={10.5} c={C.text}>note how it seats</T>
      <Lab p={[204, 140]} x={196} y={58} text="spacer" up />

      <Pn x={328} y={26} w={140} h={178} t="Front-loader" />
      <rect x={350} y={70} width={96} height={6} rx="2" fill="url(#mk-acr)" stroke={M.glass} />
      <rect x={346} y={60} width={104} height={8} rx="3" fill="url(#sk-steel)" opacity="0.7" />
      <rect x={352} y={96} width={92} height={36} fill="url(#mk-mov)" stroke={C.brass} />
      <rect x={352} y={90} width={92} height={4} fill={M.dial} />
      <rect x={340} y={86} width={10} height={60} fill="url(#mk-cut)" />
      <rect x={446} y={86} width={10} height={60} fill="url(#mk-cut)" />
      <T x={398} y={170} a="middle" s={10.5} c={C.text}>bezel and crystal</T>
      <T x={398} y={184} a="middle" s={10.5} c={C.text}>off first</T>

      <T x={14} y={226} s={11} c={C.text} w={600}>Then ease it out, dial-up, into a holder.</T>
      <Pn x={12} y={238} w={456} h={80} t="Handle by the edges, in finger cots" />
      <circle cx={110} cy={286} r={22} fill="url(#mk-mov)" stroke={C.brass} />
      {[[78, 270], [142, 302]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={12} ry={9} fill="#e8d9c0" stroke="#a89c82" transform={`rotate(${i ? 30 : -30} ${x} ${y})`} />
      ))}
      <T x={180} y={278} s={10.5} c={C.text}>Skin oils corrode plating and are</T>
      <T x={180} y={292} s={10.5} c={C.text}>surprisingly hard to remove later.</T>
      <T x={180} y={308} s={10} c={C.faint}>Hold the edges, nothing else.</T>
    </F>
  )
}

/* ================================================================== */
/* mech-hands-dial · remove and refit hands and dial                    */
/* ================================================================== */

// Movement edge in section with a dial on top. feet: x positions.
function DialSec({ x, y, w, lift = 0, tilt = 0, feet, gap = 0 }) {
  const cx = x + w / 2
  return (
    <g>
      <rect x={x} y={y} width={w} height={34} fill="url(#mk-bcut)" />
      {feet.map((fx) => (
        <rect key={fx} x={fx - 3} y={y} width={6} height={20} fill={M.ink} />
      ))}
      <g transform={`translate(0 ${-lift}) rotate(${tilt} ${cx} ${y})`}>
        <rect x={x - 4} y={y - 6 - gap} width={w + 8} height={6} fill={M.dial} stroke="#a89c82" strokeWidth="0.6" />
        {feet.map((fx) => (
          <rect key={fx} x={fx - 2} y={y - gap} width={4} height={18} fill={M.brassP} />
        ))}
      </g>
    </g>
  )
}

function MkDialRelease() {
  return (
    <F h={322} view="Section · how dial feet are held" scale="schematic, magnified">
      <Pn x={12} y={26} w={222} h={150} t="Side-screws" />
      <rect x={30} y={80} width={186} height={44} fill="url(#mk-bcut)" />
      <rect x={30} y={74} width={186} height={6} fill={M.dial} stroke="#a89c82" strokeWidth="0.6" />
      <rect x={98} y={80} width={8} height={30} fill={M.ink} />
      <rect x={100} y={80} width={4} height={26} fill={M.brassP} />
      {/* screw entering from the plate edge, nipping the foot */}
      <rect x={106} y={92} width={60} height={8} fill="url(#mk-thread)" />
      <rect x={166} y={88} width={12} height={16} rx="2" fill="#c5ced4" stroke="#3e4a52" />
      <Turn cx={172} cy={96} r={16} from={20} to={-60} c="brass" w={1.4} />
      <Lab p={[102, 104]} x={60} y={150} text="dial foot" />
      <Lab p={[150, 96]} x={170} y={150} text="side-screw" sub="" />
      <T x={123} y={166} a="middle" s={10} c={C.faint}>loosen a little, the foot comes free</T>

      <Pn x={246} y={26} w={222} h={150} t="Press-clamp" />
      <rect x={264} y={80} width={186} height={44} fill="url(#mk-bcut)" />
      <rect x={264} y={74} width={186} height={6} fill={M.dial} stroke="#a89c82" strokeWidth="0.6" />
      <rect x={332} y={80} width={8} height={30} fill={M.ink} />
      <rect x={334} y={80} width={4} height={26} fill={M.brassP} />
      <path d="M340 96 L400 96 L400 104 L342 104 Z" fill="url(#sk-steelH)" stroke={M.steelD} />
      <circle cx={400} cy={100} r={6} fill="#c5ced4" stroke="#3e4a52" />
      <Arrow a={[372, 116]} b={[392, 116]} c="brass" w={1.4} />
      <Lab p={[360, 100]} x={360} y={150} text="clamp, slid or turned off" />
      <T x={357} y={166} a="middle" s={10} c={C.faint}>calibre decides which</T>

      <Pn x={12} y={186} w={222} h={124} t="Lift straight off" tc={C.emerald} c={C.emerald} ok />
      <DialSec x={40} y={250} w={166} feet={[70, 176]} lift={22} />
      <Arrow a={[123, 226]} b={[123, 212]} c="emerald" w={1.8} />
      <T x={123} y={302} a="middle" s={10.5} c={C.text}>both feet leave together</T>

      <Pn x={246} y={186} w={222} h={124} t="Peeled from one side" tc={C.ruby} c={C.ruby} ok={false} />
      <DialSec x={274} y={250} w={166} feet={[304, 410]} lift={10} tilt={-9} />
      <T x={357} y={302} a="middle" s={10.5} c={C.ruby}>the far foot bends</T>
    </F>
  )
}

function MkDialFoot() {
  return (
    <F h={330} view="Inspection · both feet before the dial goes back" scale="schematic">
      {/* back of the dial */}
      <circle cx={92} cy={108} r={66} fill={M.dial} stroke="#a89c82" />
      <circle cx={92} cy={108} r={6} fill={C.ground} stroke="#a89c82" />
      <circle cx={46} cy={150} r={4.5} fill={M.brassP} stroke={M.brassD} />
      <circle cx={138} cy={66} r={4.5} fill={M.brassP} stroke={M.brassD} />
      <T x={92} y={194} a="middle" s={10.5} c={C.text}>dial, back side</T>
      <Lab p={[138, 66]} x={150} y={42} text="foot" up a="start" />

      {/* side views of feet */}
      {[
        [196, 'straight, firm', C.emerald, 0, true],
        [284, 'bent', C.ruby, 18, false],
        [372, 'loose', C.ruby, 0, false],
      ].map(([x, l, col, bend, ok], i) => (
        <g key={l}>
          <rect x={x} y={64} width={70} height={8} fill={M.dial} stroke="#a89c82" strokeWidth="0.6" />
          <path d={`M${x + 33} 72 L${x + 33} 92 L${x + 33 + bend} ${92 + 22 - Math.abs(bend) * 0.3}`} fill="none" stroke={M.brassP} strokeWidth="4" strokeLinecap="round" />
          {i === 2 && <path d={`M${x + 26} 74 q7 6 14 0`} fill="none" stroke={C.ruby} strokeWidth="1.2" />}
          {i === 2 && <Arrow a={[x + 18, 104]} b={[x + 48, 104]} c="ruby" w={1.2} both />}
          <Verdict x={x + 62} y={92} ok={ok} r={7} />
          <T x={x + 35} y={134} a="middle" s={10.5} c={col}>{l}</T>
        </g>
      ))}
      <T x={240} y={152} s={10} c={C.dim}>ease straight before seating</T>
      <T x={372} y={152} s={10} c={C.dim}>lets the dial shift</T>
      <Tag x={196} y={44}>Under the loupe</Tag>

      <Tag x={12} y={222}>Broken foot: three forum routes</Tag>
      {[
        ['Dial dots', 'quick', 'suit day-date poorly; can jam the date ring'],
        ['Glue', 'strength varies', 'can’t be released with heat'],
        ['Soldering', 'cleanest result', 'risks the paint: experienced hands only'],
      ].map(([a, b, c2], i) => (
        <g key={a}>
          <line x1={12} y1={230 + i * 26} x2={468} y2={230 + i * 26} stroke={C.line} strokeWidth="0.6" />
          <T x={14} y={248 + i * 26} s={11} c={C.text} w={600}>{a}</T>
          <T x={96} y={248 + i * 26} s={10.5} c={C.emerald}>{b}</T>
          <T x={204} y={248 + i * 26} s={10.5} c={C.ruby}>{c2}</T>
        </g>
      ))}
      <T x={14} y={322} s={10} c={C.faint}>None of these is a maker’s method.</T>
    </F>
  )
}

function MkDialRefit() {
  return (
    <F h={306} view="Section and plan · refitting the dial" scale="schematic">
      <Pn x={12} y={26} w={222} h={146} t="Seated" tc={C.emerald} c={C.emerald} ok />
      <DialSec x={40} y={104} w={166} feet={[70, 176]} />
      <Arrow a={[123, 64]} b={[123, 88]} c="brass" w={1.6} />
      <T x={123} y={160} a="middle" s={10.5} c={C.text}>flat, level, no gap</T>

      <Pn x={246} y={26} w={222} h={146} t="Not home" tc={C.ruby} c={C.ruby} ok={false} />
      <DialSec x={274} y={104} w={166} feet={[304, 410]} gap={6} tilt={-2} />
      <Dim a={[452, 98]} b={[452, 104]} off={0} />
      <T x={458} y={124} a="end" s={10} c={C.ruby}>gap</T>
      <T x={357} y={160} a="middle" s={10.5} c={C.ruby}>foot not in its hole</T>

      {/* plan, movement dial side */}
      <circle cx={92} cy={238} r={52} fill="url(#mk-mov)" stroke={C.brass} />
      <circle cx={92} cy={238} r={5} fill={M.ruby} />
      {[[58, 270], [126, 206]].map(([x, y]) => (
        <g key={x}>
          <circle cx={x} cy={y} r={4} fill={M.ink} stroke={C.brassHi} />
          <Screw x={x + (x < 92 ? -14 : 14)} y={y + (x < 92 ? 6 : -6)} r={4} />
        </g>
      ))}
      <Num x={190} y={204} n={1} />
      <T x={204} y={208} s={11} c={C.text}>Line the feet into their holes</T>
      <Num x={190} y={236} n={2} />
      <T x={204} y={240} s={11} c={C.text}>Seat it flat</T>
      <Num x={190} y={268} n={3} />
      <T x={204} y={272} s={11} c={C.text}>Re-lock the clamps or screws</T>
      <T x={204} y={294} s={10.5} c={C.dim}>then check it sits level with no gap</T>
    </F>
  )
}

function MkHandsPress() {
  const dx = 40
  return (
    <F h={330} view="Section · hand stack and pusher" scale="schematic, heights exaggerated">
      {/* dial and the centre posts */}
      <rect x={dx} y={250} width={240} height={8} fill={M.dial} stroke="#a89c82" strokeWidth="0.6" />
      <rect x={dx + 104} y={150} width={32} height={100} fill="url(#mk-cut)" opacity="0.35" />
      <rect x={dx + 108} y={196} width={24} height={54} fill="url(#sk-steelH)" />
      <rect x={dx + 113} y={170} width={14} height={80} fill="url(#sk-steelH)" opacity="0.9" />
      <rect x={dx + 117.5} y={140} width={5} height={110} fill="url(#sk-steelH)" />
      {/* hands: hour lowest, minute, seconds on top */}
      <rect x={dx + 108} y={232} width={24} height={6} fill={C.brassHi} />
      <rect x={dx + 20} y={234} width={98} height={3} fill={C.brassHi} />
      <rect x={dx + 113} y={206} width={14} height={6} fill={C.brassHi} />
      <rect x={dx + 120} y={208} width={110} height={2.5} fill={C.brassHi} />
      <rect x={dx + 117} y={176} width={6} height={5} fill={C.ruby} />
      <rect x={dx + 40} y={177.5} width={180} height={2} fill={C.ruby} />
      <Num x={dx + 8} y={236} n={1} r={7} />
      <Num x={dx + 238} y={209} n={2} r={7} />
      <Num x={dx + 228} y={162} n={3} r={7} />
      <T x={dx + 10} y={222} s={10.5} c={C.text}>hour</T>
      <T x={dx + 182} y={200} s={10.5} c={C.text}>minute</T>
      <T x={dx + 140} y={166} s={10.5} c={C.text}>sweep second</T>
      {/* paper clearance */}
      <Dim a={[dx + 60, 237]} b={[dx + 60, 250]} off={0} />
      <T x={dx + 66} y={270} s={10.5} c={C.dim}>a paper’s thickness above the dial</T>
      {/* pusher on the minute boss */}
      <G x={dx + 120} y={204}>
        <Pusher d={18} len={60} />
      </G>
      <Arrow a={[dx + 150, 120]} b={[dx + 150, 150]} c="brass" w={1.8} />
      <T x={dx + 156} y={132} s={10.5} c={C.brassHi}>straight down</T>
      <Lab p={[dx + 112, 182]} x={36} y={100} text="hollow pusher" sub="sized just under the hole" up a="start" />

      <rect x={316} y={30} width={152} height={118} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <Tag x={326} y={48}>Order</Tag>
      <T x={326} y={68} s={10.5} c={C.text} w={600}>Centre seconds</T>
      <T x={326} y={82} s={10.5} c={C.dim}>hour, minute, sweep second</T>
      <T x={326} y={106} s={10.5} c={C.text} w={600}>Sub-seconds dial</T>
      <T x={326} y={120} s={10.5} c={C.dim}>small seconds hand first</T>
      <T x={326} y={138} s={10} c={C.faint}>check each one dead flat</T>

      <rect x={316} y={160} width={152} height={98} rx="6" fill="rgba(123,165,131,0.07)" stroke={C.emerald} />
      <Tag x={326} y={178} c={C.emerald}>Clearance check</Tag>
      <T x={326} y={198} s={10.5} c={C.text}>Set the hour to 12.</T>
      <T x={326} y={214} s={10.5} c={C.text}>Sight across with a loupe:</T>
      <T x={326} y={228} s={10.5} c={C.text}>hands parallel.</T>
      <T x={326} y={246} s={10.5} c={C.text}>Run past 12:00: no touch.</T>
      <T x={14} y={312} s={10} c={C.faint}>Support the movement in a holder while you press.</T>
    </F>
  )
}

/* ================================================================== */
/* mech-diagnose · diagnose a mechanical watch                          */
/* ================================================================== */

function MkDiagDead() {
  return (
    <F h={300} view="Decision · fully wound but dead" scale="schematic">
      <Bx x={150} y={28} w={180} h={40} l={['Won’t run at all', 'even fully wound']} c={C.ruby} />
      <Arrow a={[240, 70]} b={[240, 88]} c="brass" w={1.4} />
      <Bx x={170} y={90} w={140} h={34} l={['Does it wind?']} c={C.brass} />
      <Arrow d="M170 107 L100 107 L100 140" c="emerald" w={1.4} />
      <Arrow d="M310 107 L380 107 L380 140" c="ruby" w={1.4} />
      <T x={132} y={100} a="middle" s={10.5} c={C.emerald}>yes</T>
      <T x={346} y={100} a="middle" s={10.5} c={C.ruby}>no</T>

      <Pn x={12} y={144} w={226} h={144} t="A stopped train" />
      {[
        ['dried oil', ''],
        ['dirt', ''],
        ['a knock', 'that damaged a pivot'],
        ['a stuck balance', ''],
      ].map(([a, b], i) => (
        <g key={a}>
          <circle cx={28} cy={176 + i * 26} r={3} fill={C.brass} />
          <T x={38} y={180 + i * 26} s={11} c={C.text}>{a}</T>
          {b && <T x={100} y={180 + i * 26} s={10.5} c={C.dim}>{b}</T>}
        </g>
      ))}
      <WheelSection x={176} y={246} w={52} gapH={24} tilt={8} />

      <Pn x={248} y={144} w={220} h={144} t="Power never arrives" />
      <T x={262} y={180} s={11} c={C.text}>Suspect the mainspring</T>
      <T x={262} y={196} s={11} c={C.text}>or the keyless works.</T>
      <Ratchet cx={300} cy={246} r={26} n={30} />
      <rect x={340} y={243} width={56} height={6} fill="url(#sk-steel)" />
      <rect x={396} y={236} width={14} height={20} rx="3" fill="url(#mk-knurl)" stroke={M.steelD} />
      <Turn cx={403} cy={246} r={18} from={-40} to={40} c="ruby" w={1.4} />
      <T x={436} y={280} a="end" s={10} c={C.faint}>crown turns, nothing winds</T>
    </F>
  )
}

function WatchSide({ x, y, down, ok }) {
  return (
    <g>
      <rect x={x - 30} y={y - 9} width={60} height={18} rx="7" fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={x - 24} y={down ? y + 9 : y - 13} width={48} height={4} rx="2" fill="url(#mk-acr)" stroke={M.glass} strokeWidth="0.6" />
      <rect x={x - 40} y={y + 13} width={80} height={3} fill={C.struct} />
      <Verdict x={x + 44} y={y - 10} ok={ok} r={7} />
    </g>
  )
}

function MkDiagStops() {
  return (
    <F h={306} view="Comparison · runs, then stops" scale="schematic">
      <Pn x={12} y={26} w={456} h={124} t="Runs when shaken, stops when still" />
      <Face2 cx={66} cy={92} r={30} />
      <path d="M28 68 l-8 -6 M28 116 l-8 6 M104 68 l8 -6 M104 116 l8 6" stroke={C.brass} strokeWidth="1.6" />
      <Arrow a={[120, 92]} b={[146, 92]} c="brass" w={1.4} />
      <T x={156} y={80} s={11} c={C.text} w={600}>Low amplitude</T>
      <T x={156} y={96} s={10.5} c={C.dim}>from old oil or wear</T>
      <T x={156} y={118} s={11} c={C.brassHi}>a service is due</T>
      <Trace x={318} y={58} w={136} h={56} kind="clean" c="#e7b67a" />
      <T x={386} y={132} a="middle" s={10} c={C.faint}>weak swing, little reserve</T>

      <Pn x={12} y={160} w={456} h={134} t="Stops only in certain positions" />
      <WatchSide x={66} y={204} ok />
      <T x={66} y={234} a="middle" s={10.5} c={C.emerald}>dial-up: runs</T>
      <WatchSide x={176} y={204} down ok={false} />
      <T x={176} y={234} a="middle" s={10.5} c={C.ruby}>dial-down: stops</T>
      <T x={14} y={264} s={10} c={C.faint}>a fault that only bites</T>
      <T x={14} y={278} s={10} c={C.faint}>in that orientation</T>
      <T x={260} y={196} s={11} c={C.text} w={600}>Suspect</T>
      {['a bent pivot', 'a dry or cracked jewel', 'a hairspring fouling'].map((l, i) => (
        <g key={l}>
          <circle cx={266} cy={214 + i * 18} r={3} fill={C.ruby} />
          <T x={276} y={218 + i * 18} s={10.5} c={C.text}>{l}</T>
        </g>
      ))}
      <T x={276} y={284} s={10} c={C.faint}>in that position</T>
    </F>
  )
}

// small dial for flow figures
function Face2({ cx, cy, r }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={cx} cy={cy} r={r * 0.84} fill={M.dialDark} stroke={C.struct} strokeWidth="0.6" />
      {Array.from({ length: 12 }, (_, i) => {
        const [a, b] = clk(cx, cy, r * 0.78, i * 30)
        const [c2, d2] = clk(cx, cy, r * 0.68, i * 30)
        return <line key={i} x1={a} y1={b} x2={c2} y2={d2} stroke={C.dim} strokeWidth="1" />
      })}
      <line x1={cx} y1={cy} x2={clk(cx, cy, r * 0.45, 300)[0]} y2={clk(cx, cy, r * 0.45, 300)[1]} stroke={C.brassHi} strokeWidth="2" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={clk(cx, cy, r * 0.68, 60)[0]} y2={clk(cx, cy, r * 0.68, 60)[1]} stroke={C.brassHi} strokeWidth="1.5" strokeLinecap="round" />
      <rect x={cx + r - 1} y={cy - 4} width={6} height={8} rx="1.5" fill="url(#mk-knurl)" />
    </g>
  )
}

function MkDiagReserve() {
  const x0 = 40
  const k = 8.4 // px per hour
  const X = (h) => x0 + h * k
  return (
    <F h={316} view="Chart · timing the power reserve" scale="hours to scale">
      <Step x={22} y={38} n={1} h="Wind fully" s="note the time" />
      <Step x={170} y={38} n={2} h="Leave it dial up" s="untouched" />
      <Step x={318} y={38} n={3} h="Note when it stops" s="hours run = reserve" />
      {/* axis */}
      <line x1={X(0)} y1={150} x2={X(48)} y2={150} stroke={C.struct} />
      {[0, 6, 12, 18, 24, 30, 36, 42, 48].map((h) => (
        <g key={h}>
          <line x1={X(h)} y1={146} x2={X(h)} y2={154} stroke={C.faint} />
          <T x={X(h)} y={168} a="middle" s={10} c={C.faint} mono>{h}</T>
        </g>
      ))}
      <T x={X(48)} y={184} a="end" s={10} c={C.faint}>hours</T>
      <rect x={X(38)} y={100} width={X(42) - X(38)} height={40} fill="rgba(123,165,131,0.18)" />
      <line x1={X(38)} y1={92} x2={X(38)} y2={150} stroke={C.emerald} strokeWidth="1.4" />
      <line x1={X(42)} y1={92} x2={X(42)} y2={150} stroke={C.emerald} strokeWidth="1.4" strokeDasharray="3 2" />
      <T x={X(38) - 4} y={88} a="end" s={10.5} c={C.emerald}>38 h minimum</T>
      <T x={X(42) + 4} y={88} s={10.5} c={C.emerald}>42 h typical</T>
      <rect x={X(0)} y={112} width={X(29) - X(0)} height={14} rx="3" fill="rgba(194,88,99,0.35)" stroke={C.ruby} />
      <T x={X(1)} y={123} s={10.5} c={C.text}>your watch: stopped too soon</T>
      <T x={X(29) + 4} y={123} s={10} c={C.ruby}>short</T>
      <T x={X(0)} y={202} s={10} c={C.faint}>Maker’s figure: ETA 2824-2. Use your own calibre’s.</T>

      <Bx x={12} y={214} w={148} h={92} l={['Good amplitude', 'look at the barrel:', 'spring too short, or an', 'automatic slipping early']} c={C.brass} s={11} lh={15} />
      <Bx x={166} y={214} w={148} h={92} l={['Poor from the start', 'treat it as a', 'low-amplitude fault']} c={C.ruby} s={11} lh={15} />
      <Bx x={320} y={214} w={148} h={92} l={['Short only on the wrist', 'it may not be getting', 'wound: test by', 'crown first']} c={C.steel} s={11} lh={15} />
    </F>
  )
}

function MkDiagSlow() {
  return (
    <F h={306} view="Timegrapher · slow or erratic" scale="schematic traces">
      <Trace x={12} y={30} w={140} h={70} kind="clean" label="healthy: two tight lines" />
      <Trace x={170} y={30} w={140} h={70} kind="slow" label="losing time" c="#e7b67a" />
      <Trace x={328} y={30} w={140} h={70} kind="fuzzy" label="fat, fuzzy trace" c="#e98b8b" />
      <T x={398} y={132} a="middle" s={10} c={C.ruby}>escapement or hairspring fault</T>

      <Pn x={12} y={146} w={226} h={150} t="Amplitude, fully wound" />
      {(() => {
        const X = (d) => 30 + (d - 180) * 1.3
        return (
          <g>
            <rect x={X(180)} y={196} width={X(250) - X(180)} height={14} fill="rgba(194,88,99,0.35)" />
            <rect x={X(250)} y={196} width={X(320) - X(250)} height={14} fill="rgba(123,165,131,0.25)" />
            {[200, 250, 300].map((d) => (
              <g key={d}>
                <line x1={X(d)} y1={192} x2={X(d)} y2={214} stroke={C.faint} />
                <T x={X(d)} y={228} a="middle" s={10} c={C.faint} mono>{d}°</T>
              </g>
            ))}
            <T x={X(215)} y={186} a="middle" s={10.5} c={C.ruby}>below ~250°</T>
          </g>
        )
      })()}
      <T x={24} y={252} s={10.5} c={C.text}>The escapement isn’t getting</T>
      <T x={24} y={266} s={10.5} c={C.text}>enough power.</T>

      <Pn x={248} y={146} w={220} h={150} t="Usual causes" />
      {['dirt', 'dry pivots', 'worn parts', 'a damaged hairspring'].map((l, i) => (
        <g key={l}>
          <circle cx={264} cy={180 + i * 24} r={3} fill={C.brass} />
          <T x={274} y={184 + i * 24} s={11} c={C.text}>{l}</T>
        </g>
      ))}
      <T x={260} y={284} s={10} c={C.faint}>losing time, or a wildly variable rate</T>
    </F>
  )
}

function MkDiagCannon() {
  return (
    <F h={316} view="Section · centre of the motion work" scale="schematic, magnified">
      {/* plate */}
      <rect x={40} y={200} width={220} height={20} fill="url(#mk-bcut)" />
      <rect x={140} y={200} width={20} height={20} fill={M.ink} />
      {/* centre arbor */}
      <rect x={146} y={70} width={8} height={160} fill="url(#sk-steelH)" />
      {/* cannon pinion tube, friction fit on the arbor */}
      <path d="M134 96 L134 196 L166 196 L166 96 Z" fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={128} y={180} width={44} height={14} fill="url(#mk-knurl)" />
      <path d="M140 122 q10 6 20 0" fill="none" stroke={C.ruby} strokeWidth="1.6" />
      {/* hour wheel on its pipe */}
      <rect x={126} y={136} width={48} height={26} fill="url(#mk-bcut)" opacity="0.7" />
      <rect x={100} y={160} width={100} height={6} fill={M.brassP} />
      {/* hands: hour, minute, seconds */}
      <rect x={60} y={137} width={66} height={3} fill={C.brassHi} />
      <rect x={166} y={98} width={100} height={2.5} fill={C.brassHi} />
      <rect x={150} y={66} width={120} height={2} fill={C.ruby} />
      <Lab p={[150, 124]} x={70} y={84} text="friction grip lost" c={C.ruby} up />
      <Lab p={[166, 186]} x={290} y={190} text="cannon pinion" a="start" />
      <Lab p={[154, 210]} x={290} y={228} text="centre wheel arbor" a="start" />
      <Lab p={[262, 99]} x={300} y={124} text="hands stay put" a="start" c={C.ruby} />
      <Lab p={[268, 67]} x={300} y={56} text="seconds keep moving" a="start" c={C.emerald} up />
      <Turn cx={150} cy={238} r={14} from={100} to={260} c="emerald" w={1.4} />
      <T x={150} y={268} a="middle" s={10} c={C.emerald}>train turning</T>

      <Bx x={12} y={280} w={456} h={28} l={['A friction fit that needs tightening, not a train fault. See “Cannon-pinion & hand friction”.']} c={C.brass} s={10.5} />
    </F>
  )
}

function MkDiagNoise() {
  return (
    <F h={316} view="Section · scraping and rattling" scale="schematic">
      <Pn x={12} y={26} w={270} h={186} t="Scraping automatic" />
      {/* caseback */}
      <rect x={30} y={184} width={234} height={12} rx="3" fill="url(#mk-cut)" />
      {/* movement */}
      <rect x={40} y={62} width={214} height={50} fill="url(#mk-mov)" stroke={C.brass} />
      {/* rotor tilted on worn bearing */}
      <rect x={140} y={112} width={14} height={14} fill="url(#sk-steel)" stroke={M.steelD} />
      <g transform="rotate(7 147 128)">
        <path d="M60 128 L234 128 L234 142 L60 142 Z" fill={M.brassP} stroke={M.brassD} />
      </g>
      <path d="M220 168 l8 -6 l6 6 l8 -6" fill="none" stroke={C.ruby} strokeWidth="1.6" />
      <Lab p={[147, 120]} x={176} y={46} text="worn rotor bearing" up a="start" />
      <Lab p={[230, 160]} x={120} y={172} text="rubs the caseback" c={C.ruby} />
      <T x={147} y={207} a="middle" s={10} c={C.dim}>caseback</T>

      <Pn x={292} y={26} w={176} h={186} t="Loose rattle" />
      <circle cx={380} cy={120} r={56} fill="url(#mk-mov)" stroke={C.brass} />
      <Wheel cx={364} cy={104} r={18} spokes={4} />
      <g transform="translate(412 142) rotate(30)">
        <rect x={-6} y={-2.5} width={12} height={5} rx="1" fill="#c5ced4" />
        <rect x={-2} y={2.5} width={4} height={4} fill="#c5ced4" />
      </g>
      <Lab p={[412, 142]} x={380} y={196} text="a stray screw, or a broken part adrift" s={10} />

      <Warn x={12} y={226} w={456} h={36} head="Open and inspect before running it further." />
      <rect x={12} y={270} width={456} height={38} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={22} y={286} s={10.5} c={C.text}>Note the exact symptom in the Practice Log first.</T>
      <T x={22} y={300} s={10} c={C.dim}>It helps confirm you fixed the right thing.</T>
    </F>
  )
}

/* ================================================================== */
/* mech-mainspring · barrel and mainspring service                      */
/* ================================================================== */

// spiral of a spring in plan: r0 inner, r1 outer, turns
function Spiral({ cx, cy, r0, r1, turns, c = C.steel, w = 1.6, kink }) {
  const p = []
  const n = Math.round(turns * 36)
  for (let i = 0; i <= n; i++) {
    const a = i * 10
    let rr = r0 + ((r1 - r0) * i) / n
    if (kink && Math.abs(i - kink) < 2) rr += 7 * (i === kink ? 1 : 0.4)
    p.push(pol(cx, cy, rr, a))
  }
  return <polyline points={pts(p)} fill="none" stroke={c} strokeWidth={w} strokeLinejoin="round" />
}

function MkMsInspect() {
  const cell = (x, t, ok, child, sub) => (
    <g>
      <Pn x={x} y={26} w={110} h={160} t={t} ok={ok} c={ok ? C.emerald : C.ruby} tc={ok ? C.emerald : C.ruby} />
      {child}
      <T x={x + 55} y={176} a="middle" s={10} c={C.dim}>{sub}</T>
    </g>
  )
  return (
    <F h={300} view="Inspection · the spring out of the barrel" scale="schematic">
      {cell(12, 'Healthy', true, <Spiral cx={67} cy={108} r0={6} r1={44} turns={4} />, 'opens out freely')}
      {cell(128, 'Set', false, <Spiral cx={183} cy={108} r0={6} r1={22} turns={6} />, 'stays tightly coiled')}
      {cell(244, 'Kinked', false, <Spiral cx={299} cy={108} r0={6} r1={40} turns={4} kink={96} />, 'a sharp bend')}
      {cell(360, 'Bridle', false, (
        <g>
          <Spiral cx={410} cy={108} r0={6} r1={36} turns={4} />
          <path d="M442 136 L452 150" stroke={C.ruby} strokeWidth="2.4" />
          <path d="M448 120 L456 124" stroke={C.ruby} strokeWidth="1.4" />
        </g>
      ), 'outer end parted')}
      <T x={14} y={208} s={11} c={C.text} w={600}>A set spring gives weak amplitude.</T>
      <T x={14} y={224} s={10.5} c={C.dim}>Worth replacing during a service.</T>
      <rect x={250} y={196} width={218} height={92} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <Tag x={260} y={214}>Steel or alloy</Tag>
      <T x={260} y={234} s={10.5} c={C.text}>Modern springs: rust-resistant</T>
      <T x={260} y={248} s={10.5} c={C.text}>alloy, and they rarely break.</T>
      <T x={260} y={266} s={10} c={C.faint}>“Don’t over-wind or it snaps”</T>
      <T x={260} y={280} s={10} c={C.faint}>dates from the carbon-steel era.</T>
      <Spiral cx={56} cy={262} r0={4} r1={22} turns={3} w={1.2} />
      <T x={92} y={260} s={10} c={C.faint}>control it as it comes out:</T>
      <T x={92} y={274} s={10} c={C.faint}>let it expand slowly</T>
    </F>
  )
}

// Barrel in section, exploded: lid above, drum, arbor
function MkMsBarrelCheck() {
  return (
    <F h={302} view="Section · barrel, lid and arbor, exploded" scale="schematic">
      {/* lid */}
      <rect x={70} y={54} width={150} height={8} fill="url(#mk-bcut)" stroke={M.brassD} strokeWidth="0.6" />
      <rect x={139} y={50} width={12} height={16} fill={C.ground} />
      {/* drum */}
      <path d="M62 112 L62 196 L228 196 L228 112 L220 112 L220 188 L70 188 L70 112 Z" fill="url(#mk-bcut)" stroke={M.brassD} strokeWidth="0.6" />
      <rect x={139} y={188} width={12} height={8} fill={C.ground} />
      {/* teeth on the outside of the drum */}
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={56} y={116 + i * 6.5} width={6} height={3.5} fill={M.brassP} />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={228} y={116 + i * 6.5} width={6} height={3.5} fill={M.brassP} />
      ))}
      {/* spring coils in section */}
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <rect x={74 + i * 4} y={120} width={2} height={62} fill={C.steel} />
          <rect x={214 - i * 4} y={120} width={2} height={62} fill={C.steel} />
        </g>
      ))}
      {/* arbor lifted between */}
      <rect x={141} y={72} width={8} height={124} fill="url(#sk-steelH)" />
      <rect x={133} y={130} width={24} height={40} fill="url(#sk-steelH)" stroke={M.steelD} />
      <rect x={143} y={66} width={4} height={8} fill="#dfe7ec" />
      <rect x={143} y={196} width={4} height={10} fill="#dfe7ec" />

      <Num x={40} y={58} n={1} />
      <Num x={30} y={150} n={2} />
      <Num x={182} y={86} n={3} />
      <line x1={174} y1={86} x2={150} y2={70} stroke={C.struct} strokeWidth="0.8" />
      <line x1={174} y1={92} x2={150} y2={200} stroke={C.struct} strokeWidth="0.8" />

      <Step x={262} y={40} n={1} h="Wall and lid" s="scoring" />
      <Step x={262} y={84} n={2} h="Barrel teeth" s={['bends or chips: they drive', 'the whole train']} />
      <Step x={262} y={142} n={3} h="Arbor pivots, under a loupe" s={['worn pivots are a reported', 'cause of low amplitude']} />

      <Warn x={12} y={228} w={456} h={62} head="Wall or teeth damaged? Replace the barrel." text={['A new spring won’t cure it.', 'ETA sells the 2824-2’s barrel as one complete part.']} c={C.ruby} />
    </F>
  )
}

function MkMsDims() {
  return (
    <F h={300} view="Detail · the four numbers to match" scale="schematic">
      {/* strip, magnified section */}
      <Pn x={12} y={26} w={180} h={148} t="Strip section" />
      <rect x={70} y={70} width={16} height={86} fill="url(#mk-cut)" stroke={M.steelD} />
      <Dim a={[70, 70]} b={[70, 156]} off={18} text="height" />
      <Dim a={[70, 70]} b={[86, 70]} off={-8} />
      <T x={94} y={66} s={10.5} c={C.dim} mono>thickness</T>
      <T x={102} y={110} s={10} c={C.faint}>magnified</T>

      {/* spiral length */}
      <Pn x={202} y={26} w={130} h={148} t="Length" />
      <Spiral cx={267} cy={104} r0={6} r1={46} turns={4} />
      <T x={267} y={166} a="middle" s={10.5} c={C.dim}>end to end, unwound</T>

      {/* barrel diameter */}
      <Pn x={342} y={26} w={126} h={148} t="Barrel" />
      <circle cx={405} cy={104} r={44} fill="none" stroke={M.brassP} strokeWidth="4" />
      <circle cx={405} cy={104} r={8} fill="url(#sk-steelH)" />
      <Dim a={[363, 104]} b={[447, 104]} off={0} />
      <T x={405} y={96} a="middle" s={10.5} c={C.dim} mono>diameter</T>

      <T x={14} y={198} s={11} c={C.text} w={600}>Match all four to the original:</T>
      <T x={14} y={214} s={10.5} c={C.dim}>height, thickness, length and barrel diameter.</T>
      <Bx x={12} y={228} w={222} h={58} l={['Wrong dimensions', 'the wrong power']} c={C.ruby} />
      <Bx x={246} y={228} w={222} h={58} l={['Or it won’t fit', 'in the barrel at all']} c={C.ruby} />
    </F>
  )
}

function MkMsClose() {
  return (
    <F h={306} view="Section · closing the barrel" scale="schematic">
      <Pn x={12} y={26} w={148} h={176} t="Oil the arbor" />
      <rect x={82} y={56} width={8} height={120} fill="url(#sk-steelH)" />
      <rect x={74} y={100} width={24} height={34} fill="url(#sk-steelH)" stroke={M.steelD} />
      {[70, 160].map((y) => <circle key={y} cx={86} cy={y} r={3} fill={M.oil} />)}
      <G x={92} y={70} ang={40}>
        <Oiler len={46} drop={0} />
      </G>
      <T x={86} y={192} a="middle" s={10.5} c={C.text}>lightly, where it bears</T>

      <Pn x={170} y={26} w={148} h={176} t="Lid on squarely" ok tc={C.emerald} c={C.emerald} />
      <path d="M190 110 L190 170 L298 170 L298 110 L292 110 L292 164 L196 164 L196 110 Z" fill="url(#mk-bcut)" />
      <rect x={196} y={104} width={96} height={6} fill="url(#mk-bcut)" stroke={M.brassD} strokeWidth="0.6" />
      <rect x={240} y={84} width={8} height={90} fill="url(#sk-steelH)" />
      {[214, 274].map((x) => <Arrow key={x} a={[x, 70]} b={[x, 98]} c="brass" w={1.8} />)}
      <T x={244} y={192} a="middle" s={10.5} c={C.emerald}>presses home: click</T>

      <Pn x={328} y={26} w={140} h={176} t="Tilted" ok={false} tc={C.ruby} c={C.ruby} />
      <path d="M342 110 L342 170 L450 170 L450 110 L444 110 L444 164 L348 164 L348 110 Z" fill="url(#mk-bcut)" />
      <rect x={348} y={100} width={96} height={6} fill="url(#mk-bcut)" transform="rotate(-6 396 103)" />
      <rect x={392} y={84} width={8} height={90} fill="url(#sk-steelH)" />
      <T x={398} y={192} a="middle" s={10.5} c={C.ruby}>one side not seated</T>

      <Pn x={12} y={212} w={456} h={82} t="Spin-check" />
      <circle cx={80} cy={258} r={24} fill="url(#mk-bcut)" stroke={M.brassD} />
      <rect x={74} y={252} width={12} height={12} fill="url(#sk-steel)" stroke={M.steelD} />
      <Turn cx={80} cy={258} r={32} from={20} to={140} c="emerald" w={1.6} />
      <T x={130} y={252} s={11} c={C.text}>Turn the arbor: it turns freely.</T>
      <T x={130} y={270} s={10.5} c={C.dim}>Any drag now drags on the whole train later.</T>
    </F>
  )
}

function MkMsHook() {
  return (
    <F h={322} view="Test · hook and endshake" scale="schematic, magnified">
      <Pn x={12} y={26} w={226} h={196} t="Does the hook catch?" />
      <circle cx={84} cy={150} r={48} fill="url(#mk-bcut)" stroke={M.brassD} />
      <circle cx={84} cy={150} r={40} fill="#2a241c" />
      <Spiral cx={84} cy={150} r0={12} r1={38} turns={3} w={1.3} />
      <circle cx={84} cy={150} r={9} fill="url(#sk-steelH)" stroke={M.steelD} />
      <rect x={79} y={145} width={10} height={10} fill="url(#sk-steel)" stroke={M.steelD} />
      <G x={84} y={150}>
        <PinVice len={74} />
      </G>
      <Turn cx={84} cy={150} r={60} from={60} to={100} c="brass" w={1.8} />
      <T x={148} y={136} s={10} c={C.brassHi}>winding</T>
      <T x={148} y={148} s={10} c={C.brassHi}>direction</T>
      <T x={148} y={180} s={10.5} c={C.emerald}>spring takes up:</T>
      <T x={148} y={193} s={10.5} c={C.emerald}>hook caught</T>
      <T x={22} y={212} s={10.5} c={C.ruby}>turns freely: open it, seat the hook</T>
      <Lab p={[88, 150]} x={30} y={60} text="arbor square" a="start" up />

      <Pn x={248} y={26} w={220} h={196} t="Endshake" />
      <rect x={270} y={78} width={160} height={8} fill="url(#mk-bcut)" />
      <rect x={270} y={160} width={160} height={10} fill="url(#mk-bcut)" />
      <rect x={344} y={78} width={12} height={8} fill={C.ground} />
      <rect x={344} y={160} width={12} height={10} fill={C.ground} />
      <rect x={346} y={72} width={8} height={104} fill="url(#sk-steelH)" />
      <rect x={338} y={102} width={24} height={40} fill="url(#sk-steelH)" stroke={M.steelD} />
      <Arrow a={[380, 112]} b={[380, 100]} c="emerald" w={1.4} />
      <Arrow a={[380, 132]} b={[380, 144]} c="emerald" w={1.4} />
      <T x={388} y={126} s={10.5} c={C.emerald}>a hair</T>
      <Lab p={[300, 82]} x={290} y={58} text="lid" up />
      <Lab p={[300, 165]} x={300} y={196} text="barrel floor" />
      <T x={358} y={212} a="middle" s={10} c={C.faint}>lift the arbor gently</T>

      <Bx x={12} y={232} w={226} h={78} l={['Pinched?', 'the lid may not be fully', 'home. No endshake drags', 'on the whole train.']} c={C.ruby} s={11} lh={14} />
      <Bx x={248} y={232} w={220} h={78} l={['Check again', 'once the barrel is under', 'its bridge']} c={C.brass} s={11} lh={14} />
    </F>
  )
}

/* ================================================================== */
/* mech-regulate · regulate the timekeeping                             */
/* ================================================================== */

function MkRegDemag() {
  const coils = (cx, cy, stuck) => {
    const p = []
    for (let a = 0; a < 360 * 4; a += 10) {
      let rr = 6 + (a / (360 * 4)) * 36
      if (stuck && a % 360 > 200 && a % 360 < 300) rr = 6 + (Math.floor(a / 360) * 2) + 30
      p.push(pol(cx, cy, rr, a))
    }
    return <polyline points={pts(p)} fill="none" stroke={C.steel} strokeWidth="1.1" />
  }
  return (
    <F h={300} view="Comparison · a magnetised hairspring" scale="schematic">
      <Pn x={12} y={26} w={222} h={170} t="Coils evenly spaced" tc={C.emerald} c={C.emerald} ok />
      {coils(70, 108, false)}
      <Trace x={124} y={80} w={98} h={56} kind="clean" />
      <T x={123} y={182} a="middle" s={10.5} c={C.text}>true readings</T>

      <Pn x={246} y={26} w={222} h={170} t="Coils clinging" tc={C.ruby} c={C.ruby} ok={false} />
      {coils(304, 108, true)}
      <Trace x={358} y={80} w={98} h={56} kind="fast" c="#e98b8b" />
      <T x={357} y={170} a="middle" s={10.5} c={C.ruby}>every reading thrown off,</T>
      <T x={357} y={184} a="middle" s={10.5} c={C.ruby}>often very fast</T>

      <Bx x={12} y={210} w={140} h={40} l={['Demagnetise']} c={C.brass} />
      <Arrow a={[152, 230]} b={[170, 230]} c="brass" w={1.4} />
      <Bx x={172} y={210} w={140} h={40} l={['Then measure']} c={C.brass} />
      <Arrow a={[312, 230]} b={[330, 230]} c="brass" w={1.4} />
      <Bx x={332} y={210} w={136} h={40} l={['Then regulate']} c={C.brass} />
      <T x={14} y={276} s={10.5} c={C.ruby}>Skip it and you can spend an hour “regulating” a watch</T>
      <T x={14} y={290} s={10.5} c={C.ruby}>whose only problem is magnetism.</T>
    </F>
  )
}

function MkRegSettle() {
  const X = (t) => 250 + t * 2
  const Y = (t) => 150 - 60 * Math.exp(-t / 22) * Math.cos(t / 6)
  const curve = Array.from({ length: 100 }, (_, i) => [X(i), Y(i)])
  return (
    <F h={286} view="Side view and chart · a steady first reading" scale="schematic">
      {/* timegrapher stand with the watch dial-up */}
      <rect x={30} y={200} width={160} height={22} rx="4" fill="#2c2722" stroke={C.struct} />
      <rect x={100} y={150} width={12} height={50} fill="url(#sk-steelH)" />
      <rect x={60} y={138} width={96} height={12} rx="3" fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={68} y={118} width={80} height={20} rx="8" fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={74} y={112} width={68} height={6} rx="3" fill="url(#mk-acr)" stroke={M.glass} />
      <Lab p={[108, 114]} x={108} y={70} text="dial-up" up />
      <Lab p={[64, 144]} x={52} y={180} text="stand" />
      <Step x={22} y={242} n={1} h="Fully wind" />
      <Step x={130} y={242} n={2} h="Dial-up, let it settle" />

      {/* settling chart */}
      <line x1={X(0)} y1={210} x2={X(100)} y2={210} stroke={C.struct} />
      <line x1={X(0)} y1={70} x2={X(0)} y2={210} stroke={C.struct} />
      <line x1={X(0)} y1={150} x2={X(100)} y2={150} stroke={C.faint} strokeDasharray="3 3" />
      <polyline points={pts(curve)} fill="none" stroke="#e7b67a" strokeWidth="1.6" />
      <T x={X(0)} y={62} s={10} c={C.faint}>rate shown</T>
      <T x={X(100)} y={226} a="end" s={10} c={C.faint}>time on the stand</T>
      <rect x={X(70)} y={136} width={X(100) - X(70)} height={28} fill="rgba(123,165,131,0.15)" />
      <T x={X(85)} y={130} a="middle" s={10.5} c={C.emerald}>settled</T>
      <T x={X(18)} y={84} s={10.5} c={C.ruby}>first readings wander</T>
      <Step x={300} y={250} n={3} h="Note the rate" />
    </F>
  )
}

// Balance cock in plan with regulator index and stud carrier
function Cock({ cx, cy, r = 50, idx = 0 }) {
  const [ix, iy] = pol(cx, cy, r * 1.25, -100 + idx)
  return (
    <g>
      <path d={`M${cx - r * 0.9} ${cy + r * 0.3} Q${cx - r * 0.8} ${cy - r * 0.9} ${cx} ${cy - r * 0.95} Q${cx + r * 0.8} ${cy - r * 0.9} ${cx + r * 0.9} ${cy + r * 0.3} L${cx + r * 0.5} ${cy + r * 1.3} L${cx - r * 0.5} ${cy + r * 1.3} Z`} fill={M.bridge} opacity="0.5" stroke={C.struct} />
      <circle cx={cx} cy={cy} r={r * 0.32} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={cx} cy={cy} r={3} fill={M.ruby} />
      <line x1={cx} y1={cy} x2={ix} y2={iy} stroke={C.steel} strokeWidth="3" strokeLinecap="round" />
      <path d={`M${pol(cx, cy, r * 0.42, -60)[0]} ${pol(cx, cy, r * 0.42, -60)[1]} L${pol(cx, cy, r * 0.9, -40)[0]} ${pol(cx, cy, r * 0.9, -40)[1]}`} stroke={C.brassHi} strokeWidth="3.4" strokeLinecap="round" />
      <circle cx={pol(cx, cy, r * 0.9, -40)[0]} cy={pol(cx, cy, r * 0.9, -40)[1]} r={4} fill={C.brassHi} />
    </g>
  )
}

function MkRegBeat() {
  return (
    <F h={330} view="Plan and timegrapher · beat before rate" scale="schematic">
      <Bx x={12} y={28} w={140} h={40} l={['1 Beat error', 'at the stud carrier']} c={C.brass} />
      <Arrow a={[152, 48]} b={[170, 48]} c="brass" w={1.4} />
      <Bx x={172} y={28} w={140} h={40} l={['2 Rate', 'at the regulator']} c={C.struct} />
      <T x={322} y={44} s={10.5} c={C.dim}>Witschi’s order: moving the</T>
      <T x={322} y={58} s={10.5} c={C.dim}>stud changes the rate.</T>

      <Cock cx={110} cy={150} r={56} />
      <Lab p={[pol(110, 150, 56 * 0.9, -40)[0], pol(110, 150, 56 * 0.9, -40)[1]]} x={196} y={100} text="stud carrier" sub="move it a hair" a="start" c={C.brassHi} />
      <Lab p={[pol(110, 150, 70, -100)[0], pol(110, 150, 70, -100)[1]]} x={40} y={92} text="regulator index" a="middle" up />
      <T x={110} y={244} a="middle" s={10} c={C.faint}>not the regulator, for beat</T>

      <Trace x={300} y={84} w={168} h={50} kind="beat" c="#e7b67a" />
      <T x={384} y={150} a="middle" s={10.5} c={C.text}>two lines apart: beat error</T>
      <rect x={300} y={164} width={168} height={42} rx="6" fill="#1d2a24" stroke={C.steel} />
      <T x={310} y={190} s={11} c={C.dim}>aim for</T>
      <T x={458} y={191} a="end" s={14} mono c="#b7c9b5" w={700}>≤ 0.5 ms</T>
      <T x={384} y={224} a="middle" s={10} c={C.faint}>move, settle, read again</T>

      <Sep x1={12} y1={256} x2={468} y2={256} />
      <T x={14} y={276} s={11} c={C.text} w={600}>Fixed stud, no carrier?</T>
      <T x={14} y={292} s={10.5} c={C.dim}>Forum practice: twist the collet on</T>
      <T x={14} y={306} s={10.5} c={C.dim}>the staff. That’s hairspring work.</T>
      <Trace x={248} y={266} w={90} h={44} kind="wrap" c="#e98b8b" />
      <T x={348} y={280} s={10} c={C.ruby}>very large error can</T>
      <T x={348} y={294} s={10} c={C.ruby}>wrap: lines seem to</T>
      <T x={348} y={308} s={10} c={C.ruby}>meet. Read the number.</T>
    </F>
  )
}

function MkRegTypes() {
  return (
    <F h={326} view="Plan · how far each regulator moves" scale="schematic">
      <Pn x={12} y={26} w={148} h={200} t="Etachron" />
      <Cock cx={86} cy={110} r={40} />
      {[-6, -3, 0, 3, 6].map((d, i) => {
        const [a, b] = pol(86, 110, 54, -100 + d)
        const [c2, e] = pol(86, 110, 60, -100 + d)
        return <line key={i} x1={a} y1={b} x2={c2} y2={e} stroke={C.text} strokeWidth="1" />
      })}
      <T x={86} y={194} a="middle" s={10.5} c={C.text}>one line ≈ 5 s/day</T>
      <T x={86} y={210} a="middle" s={10} c={C.faint}>marking varies by movement</T>

      <Pn x={170} y={26} w={148} h={200} t="Triovis" />
      <path d="M200 116 L290 96 L292 104 L202 124 Z" fill={C.steel} />
      <circle cx={276} cy={100} r={14} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={279} cy={98} r={5} fill="none" stroke="#2c353b" strokeWidth="1.4" />
      <Turn cx={276} cy={100} r={24} from={30} to={330} c="brass" w={1.6} />
      <T x={244} y={170} a="middle" s={10} c={C.dim}>eccentric screw</T>
      <T x={244} y={194} a="middle" s={10.5} c={C.text}>one full turn ≈ 30 s/day</T>

      <Pn x={328} y={26} w={140} h={200} t="Free-sprung" />
      <Balance cx={398} cy={110} r={44} spring={false} />
      {[0, 90, 180, 270].map((a) => {
        const [x, y] = pol(398, 110, 38, a + 45)
        return <circle key={a} cx={x} cy={y} r={4.5} fill={C.brassHi} stroke={M.brassD} />
      })}
      <T x={398} y={180} a="middle" s={10.5} c={C.text}>no index at all</T>
      <T x={398} y={196} a="middle" s={10} c={C.dim}>move mass on the</T>
      <T x={398} y={210} a="middle" s={10} c={C.dim}>balance instead</T>

      <T x={14} y={246} s={10} c={C.faint}>Both figures are from secondary sources: treat them as starting points.</T>
      <Bx x={12} y={256} w={220} h={56} l={['Every time', 'adjust, settle, measure again']} c={C.brass} />
      <Bx x={248} y={256} w={220} h={56} l={['Target out of range?', 'stop: balance or hairspring']} c={C.ruby} />
    </F>
  )
}

function MkRegPositions() {
  const pos = [
    ['dial-up', 0],
    ['dial-down', 1],
    ['crown-down', 2],
  ]
  return (
    <F h={316} view="Comparison · a result that holds in position" scale="schematic">
      {pos.map(([l, k], i) => (
        <g key={l}>
          {k === 2 ? (
            <g>
              <rect x={52 + i * 150} y={34} width={18} height={60} rx="7" fill="url(#sk-steel)" stroke={M.steelD} />
              <rect x={56 + i * 150} y={94} width={10} height={6} rx="2" fill="url(#mk-knurl)" />
            </g>
          ) : (
            <g>
              <rect x={30 + i * 150} y={58} width={60} height={18} rx="7" fill="url(#sk-steel)" stroke={M.steelD} />
              <rect x={36 + i * 150} y={k ? 76 : 54} width={48} height={4} rx="2" fill="url(#mk-acr)" stroke={M.glass} strokeWidth="0.6" />
            </g>
          )}
          <rect x={20 + i * 150} y={100} width={80} height={3} fill={C.struct} />
          <T x={60 + i * 150} y={122} a="middle" s={11} c={C.text}>{l}</T>
        </g>
      ))}
      <Pn x={12} y={136} w={222} h={88} t="Small spread" tc={C.emerald} c={C.emerald} ok />
      {[0, 1, 2].map((i) => <rect key={i} x={40 + i * 50} y={180 - [8, 12, 6][i]} width={26} height={[8, 12, 6][i]} fill={C.emerald} opacity="0.7" />)}
      <line x1={30} y1={180} x2={200} y2={180} stroke={C.struct} />
      <T x={123} y={208} a="middle" s={10.5} c={C.text}>a good result holds up</T>

      <Pn x={246} y={136} w={222} h={88} t="Large swings" tc={C.ruby} c={C.ruby} ok={false} />
      <line x1={264} y1={180} x2={434} y2={180} stroke={C.struct} />
      {[0, 1, 2].map((i) => {
        const v = [-14, 22, -26][i]
        return <rect key={i} x={274 + i * 50} y={v < 0 ? 180 : 180 - v} width={26} height={Math.abs(v)} fill={C.ruby} opacity="0.7" />
      })}
      <T x={357} y={218} a="middle" s={10.5} c={C.ruby}>poise or escapement faults</T>

      <Tag x={14} y={248}>Full adjusting has three branches</Tag>
      {[
        ['Position', 'rate across orientations'],
        ['Isochronism', 'steady as it runs down'],
        ['Temperature', 'steady warm and cold'],
      ].map(([a, b], i) => (
        <g key={a}>
          <rect x={12 + i * 154} y={258} width={148} height={46} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
          <T x={22 + i * 154} y={276} s={11} c={C.text} w={600}>{a}</T>
          <T x={22 + i * 154} y={292} s={10} c={C.dim}>{b}</T>
        </g>
      ))}
    </F>
  )
}

/* ================================================================== */
/* mech-oiling · introduction to oiling                                 */
/* ================================================================== */

function MkOilTypes() {
  return (
    <F h={316} view="Chart · which lubricant where" scale="schematic, not to scale">
      <line x1={60} y1={240} x2={440} y2={240} stroke={C.struct} />
      <line x1={60} y1={240} x2={60} y2={40} stroke={C.struct} />
      <Arrow a={[60, 240]} b={[448, 240]} c="text" w={1} />
      <Arrow a={[60, 240]} b={[60, 34]} c="text" w={1} />
      <T x={448} y={258} a="end" s={10.5} c={C.dim}>faster moving</T>
      <T x={54} y={44} a="end" s={10.5} c={C.dim}>load</T>

      <rect x={300} y={160} width={130} height={66} rx="10" fill="rgba(127,196,232,0.14)" stroke={M.oil} />
      <T x={365} y={184} a="middle" s={11} c={C.text} w={600}>Thin oil</T>
      <T x={365} y={200} a="middle" s={10.5} c={M.oil}>e.g. Moebius 9010</T>
      <T x={365} y={216} a="middle" s={10} c={C.dim}>fast-moving pivots</T>

      <rect x={150} y={96} width={150} height={66} rx="10" fill="rgba(208,168,79,0.14)" stroke={C.brass} />
      <T x={225} y={120} a="middle" s={11} c={C.text} w={600}>Heavier oil</T>
      <T x={225} y={136} a="middle" s={10.5} c={C.brassHi}>HP-1300 / D5</T>
      <T x={225} y={152} a="middle" s={10} c={C.dim}>slower, higher-load wheels</T>

      <rect x={72} y={44} width={170} height={52} rx="10" fill="rgba(143,209,158,0.14)" stroke={M.grease} />
      <T x={157} y={66} a="middle" s={11} c={C.text} w={600}>Grease</T>
      <T x={157} y={82} a="middle" s={10} c={C.dim}>barrel, sliding keyless parts</T>

      <Bx x={12} y={268} w={260} h={40} l={['One lubricant everywhere', 'a classic mistake']} c={C.ruby} />
      <T x={286} y={284} s={10.5} c={C.dim}>Full chart: Reference ›</T>
      <T x={286} y={298} s={10.5} c={C.dim}>oiling guide</T>
    </F>
  )
}

function MkOilAmount() {
  const sink = (x, y, drop, spread) => (
    <g>
      <rect x={x - 60} y={y} width={120} height={26} fill="url(#mk-bcut)" />
      <path d={`M${x - 18} ${y} Q${x} ${y + 14} ${x + 18} ${y}`} fill={C.ground} />
      <rect x={x - 6} y={y + 4} width={12} height={22} fill={M.ruby} />
      <rect x={x - 1.5} y={y - 20} width={3} height={34} fill="url(#sk-steelH)" />
      {spread ? (
        <path d={`M${x - 52} ${y} Q${x} ${y - 14} ${x + 52} ${y} Z`} fill={M.oil} opacity="0.75" />
      ) : (
        <path d={`M${x - 12} ${y + 3} Q${x} ${y - drop} ${x + 12} ${y + 3} Z`} fill={M.oil} opacity="0.85" />
      )}
    </g>
  )
  return (
    <F h={330} view="Section and plan · how much, and where not" scale="schematic, magnified">
      <Pn x={12} y={26} w={222} h={118} t="Small clean bead" tc={C.emerald} c={C.emerald} ok />
      {sink(123, 84, 6)}
      <T x={123} y={132} a="middle" s={10.5} c={C.text}>stays inside the sink</T>
      <Pn x={246} y={26} w={222} h={118} t="Generous" tc={C.ruby} c={C.ruby} ok={false} />
      {sink(357, 84, 0, true)}
      <T x={357} y={132} a="middle" s={10.5} c={C.ruby}>spreads, draws dirt, starves the pivot</T>

      <Tag x={14} y={166}>The escapement</Tag>
      <EscW cx={92} cy={244} r={52} />
      {/* pallet fork */}
      <path d="M150 194 L194 216 L194 226 L150 248 L146 240 L184 221 L146 202 Z" fill="url(#sk-steelH)" stroke={M.steelD} />
      <path d="M190 218 L262 244 L262 252 L190 228 Z" fill="url(#sk-steelH)" stroke={M.steelD} />
      <circle cx={190} cy={222} r={4} fill={M.ruby} />
      <rect x={140} y={194} width={12} height={8} fill={M.ruby} transform="rotate(20 146 198)" />
      <rect x={140} y={238} width={12} height={8} fill={M.ruby} transform="rotate(-20 146 242)" />
      {/* roller and balance */}
      <circle cx={290} cy={250} r={20} fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={267} y={246} width={8} height={8} fill={M.ruby} />
      <Spiral cx={392} cy={250} r0={6} r1={40} turns={4} w={1} />
      <circle cx={146} cy={198} r={3} fill={M.oil} />
      <circle cx={146} cy={242} r={3} fill={M.oil} />
      <circle cx={139} cy={226} r={3} fill={M.oil} />
      <Lab p={[146, 198]} x={176} y={184} text="pallet stones" c={C.emerald} a="start" up />
      <Lab p={[139, 226]} x={70} y={316} text="escape-wheel teeth" c={C.emerald} />
      <Lab p={[271, 250]} x={276} y={316} text="roller jewel: never" c={C.ruby} />
      <Lab p={[400, 232]} x={420} y={184} text="hairspring: never" c={C.ruby} up />
      <T x={468} y={316} a="end" s={10} c={C.faint}>wrong oiling ruins timing</T>
    </F>
  )
}

function MkOilClean() {
  return (
    <F h={290} view="Sequence · oiling clean" scale="schematic">
      <Pn x={12} y={26} w={148} h={170} />
      <Num x={28} y={42} n={1} />
      <Wheel cx={86} cy={106} r={36} spokes={5} />
      <path d="M118 74 l6 -6 m-2 12 l8 -2 m-14 -12 l2 -8" stroke={C.brassHi} strokeWidth="1.4" />
      <T x={86} y={170} a="middle" s={10.5} c={C.text}>fully cleaned parts</T>
      <T x={86} y={184} a="middle" s={10.5} c={C.text}>only</T>

      <Pn x={170} y={26} w={148} h={170} />
      <Num x={186} y={42} n={2} />
      <G x={244} y={150}>
        <Oiler len={90} drop={0} />
      </G>
      <T x={244} y={184} a="middle" s={10.5} c={C.text}>oilers kept spotless</T>

      <Pn x={328} y={26} w={140} h={170} />
      <Num x={344} y={42} n={3} />
      <rect x={344} y={120} width={108} height={14} fill="url(#mk-bcut)" />
      <path d="M362 120 Q392 110 420 120 Z" fill={M.oil} opacity="0.75" />
      <G x={400} y={116} ang={30}>
        <Pegwood len={60} />
      </G>
      <T x={398} y={170} a="middle" s={10.5} c={C.text}>spill: Rodico or</T>
      <T x={398} y={184} a="middle" s={10.5} c={C.text}>pegwood, at once</T>

      <rect x={12} y={208} width={456} height={70} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.brass} />
      <T x={24} y={228} s={11} c={C.text} w={600}>Follow a lubrication chart for your calibre.</T>
      <T x={24} y={246} s={10.5} c={C.dim}>Reference has a general oiling guide to start from:</T>
      <T x={24} y={262} s={10.5} c={C.dim}>which lubricant, which point, how much.</T>
    </F>
  )
}

/* ================================================================== */
/* mech-crown-stem · replace a crown and winding stem                   */
/* ================================================================== */

// Crown on its tube, in section. x: case wall outer face.
function CrownSec({ x, y, kind }) {
  const screw = kind === 'screw'
  return (
    <g>
      <rect x={x - 26} y={y - 34} width={26} height={68} fill="url(#mk-cut)" stroke={M.steelD} strokeWidth="0.6" />
      {/* pendant tube */}
      <rect x={x} y={y - 9} width={22} height={18} fill={screw ? 'url(#mk-thread)' : 'url(#sk-steelH)'} stroke={M.steelD} strokeWidth="0.6" />
      <rect x={x - 26} y={y - 3} width={60} height={6} fill="#2c353b" />
      {/* stem */}
      <rect x={x - 40} y={y - 1.6} width={74} height={3.2} fill="url(#sk-steelH)" />
      {/* crown cup */}
      <path d={`M${x + 4} ${y - 20} L${x + 40} ${y - 20} L${x + 40} ${y + 20} L${x + 4} ${y + 20} L${x + 4} ${y + 13} L${x + 32} ${y + 13} L${x + 32} ${y - 13} L${x + 4} ${y - 13} Z`} fill="url(#mk-cut)" stroke={M.steelD} strokeWidth="0.6" />
      <rect x={x + 32} y={y - 4} width={8} height={8} fill="url(#mk-cut)" />
      {kind === 'wr' && (
        <>
          <circle cx={x + 26} cy={y - 11} r={2.6} fill={M.gasket} />
          <circle cx={x + 26} cy={y + 11} r={2.6} fill={M.gasket} />
        </>
      )}
      {kind === 'dust' && <path d={`M${x + 8} ${y - 12} Q${x + 2} ${y - 16} ${x + 1} ${y - 20} M${x + 8} ${y + 12} Q${x + 2} ${y + 16} ${x + 1} ${y + 20}`} fill="none" stroke={C.brassHi} strokeWidth="1.6" />}
      {screw && (
        <>
          <circle cx={x + 26} cy={y - 11} r={2.4} fill={M.gasket} />
          <circle cx={x + 26} cy={y + 11} r={2.4} fill={M.gasket} />
          <rect x={x + 2} y={y - 15} width={3} height={5} fill={M.gasket} />
          <rect x={x + 2} y={y + 10} width={3} height={5} fill={M.gasket} />
        </>
      )}
    </g>
  )
}

function MkCrownTypes() {
  const types = [
    ['wr', 'Water-resistant', 'O-ring in the crown', 'hugs the pendant', 'tube'],
    ['dust', 'Dust-proof', 'sprung diaphragm', 'presses the case'],
    ['plain', 'Plain pocket-watch', 'neither', ''],
    ['screw', 'Screw-down', 'two or three seals', 'for divers'],
  ]
  return (
    <F h={300} view="Section · four crown types" scale="schematic, magnified">
      {types.map(([k, a, b, c2, c3], i) => {
        const x = 12 + (i % 2) * 234
        const y = 26 + Math.floor(i / 2) * 120
        return (
          <g key={k}>
            <Pn x={x} y={y} w={222} h={110} t={a} />
            <CrownSec x={x + 70} y={y + 64} kind={k} />
            <T x={x + 128} y={y + 58} s={10.5} c={C.text}>{b}</T>
            {c2 && <T x={x + 128} y={y + 72} s={10.5} c={C.dim}>{c2}</T>}
            {c3 && <T x={x + 128} y={y + 86} s={10.5} c={C.dim}>{c3}</T>}
          </g>
        )
      })}
      <Bx x={12} y={268} w={456} h={26} l={['Replace like for like, so the sealing still works.']} c={C.brass} s={10.5} />
    </F>
  )
}

function MkCrownThread() {
  const stemEnd = (x, y, d, lbl) => (
    <g>
      <rect x={x} y={y - d / 2} width={90} height={d} fill="url(#mk-thread)" stroke={M.steelD} strokeWidth="0.6" />
      <rect x={x - 70} y={y - d / 2 - 2} width={70} height={d + 4} fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.6" />
      <Dim a={[x + 90, y - d / 2]} b={[x + 90, y + d / 2]} off={-16} />
      <T x={x + 116} y={y + 4} s={11} c={C.text} mono>{lbl}</T>
    </g>
  )
  return (
    <F h={322} view="Detail · match the thread in millimetres" scale="schematic, magnified">
      <Tag x={14} y={40}>Stem thread diameter</Tag>
      {stemEnd(90, 72, 18, '0.90 mm')}
      <T x={330} y={76} s={10.5} c={C.dim}>many modern movements</T>
      {stemEnd(90, 120, 20, '1.00 mm')}
      <T x={330} y={124} s={10.5} c={C.dim}>others, or larger</T>

      <Pn x={12} y={150} w={262} h={112} t="Don’t order by Tap number alone" tc={C.ruby} c={C.ruby} ok={false} />
      <rect x={30} y={182} width={70} height={30} rx="4" fill="#2c2722" stroke={C.struct} />
      <T x={65} y={202} a="middle" s={12} c={C.text} w={700}>Tap 10</T>
      <Arrow a={[102, 190]} b={[140, 180]} c="ruby" w={1.4} />
      <Arrow a={[102, 204]} b={[140, 222]} c="ruby" w={1.4} />
      <T x={146} y={184} s={10.5} c={C.text}>0.90 mm at some</T>
      <T x={146} y={226} s={10.5} c={C.text}>1.00 mm at others</T>
      <T x={30} y={250} s={10} c={C.faint}>suppliers’ charts disagree</T>

      <Pn x={284} y={150} w={184} h={112} t="Check it" tc={C.emerald} c={C.emerald} ok />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={300 + i * 38} y={186} width={26} height={30} rx="4" fill="url(#mk-knurl)" stroke={M.steelD} />
          <circle cx={313 + i * 38} cy={201} r={3 + i * 0.3} fill={C.ground} />
        </g>
      ))}
      <T x={376} y={236} a="middle" s={10.5} c={C.text}>a crown gauge, or a set</T>
      <T x={376} y={250} a="middle" s={10.5} c={C.text}>of known-thread crowns</T>

      <T x={14} y={286} s={11} c={C.text} w={600}>And the crown itself:</T>
      <T x={14} y={302} s={10.5} c={C.dim}>the right diameter and material, and the right type for the case.</T>
    </F>
  )
}

// Stem in side view: pilot, square, shoulder, plain shank, thread
function Stem({ x, y, len = 220, cut }) {
  return (
    <g>
      <rect x={x} y={y - 2} width={14} height={4} fill="url(#sk-steelH)" />
      <rect x={x + 14} y={y - 4} width={40} height={8} fill="#9fb0ba" stroke={M.steelD} strokeWidth="0.6" />
      <rect x={x + 54} y={y - 6} width={10} height={12} fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.6" />
      <rect x={x + 64} y={y - 4.5} width={len - 120} height={9} fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.6" />
      <rect x={x + len - 56} y={y - 4.5} width={56} height={9} fill="url(#mk-thread)" stroke={M.steelD} strokeWidth="0.6" />
      {cut && <line x1={cut} y1={y - 10} x2={cut} y2={y + 10} stroke={C.ruby} strokeWidth="1.4" strokeDasharray="3 2" />}
    </g>
  )
}

function MkCrownSeparate() {
  return (
    <F h={316} view="Side view · unscrew the old crown" scale="schematic, magnified">
      <Pn x={12} y={26} w={456} h={130} t="Grip the strong threaded part" tc={C.emerald} c={C.emerald} ok />
      <Stem x={40} y={96} len={250} />
      <rect x={290} y={78} width={40} height={36} rx="5" fill="url(#mk-knurl)" stroke={M.steelD} />
      <rect x={240} y={84} width={34} height={24} rx="3" fill="url(#sk-steelH)" stroke={M.steelD} />
      <rect x={160} y={88} width={80} height={16} rx="3" fill="url(#mk-knurl)" stroke={M.steelD} />
      <Turn cx={310} cy={96} r={26} from={20} to={160} c="brass" w={1.8} />
      <T x={354} y={92} s={10.5} c={C.brassHi}>unscrew</T>
      <T x={354} y={106} s={10.5} c={C.brassHi}>the crown</T>
      <Lab p={[200, 96]} x={200} y={140} text="pin vice on the threaded section" />
      <Lab p={[74, 96]} x={74} y={62} text="square" up />
      <Lab p={[47, 96]} x={40} y={140} text="pilot" />

      <Pn x={12} y={166} w={222} h={138} t="Not on the square" tc={C.ruby} c={C.ruby} ok={false} />
      <rect x={34} y={226} width={14} height={4} fill="url(#sk-steelH)" />
      <rect x={48} y={224} width={30} height={8} fill="#9fb0ba" stroke={M.steelD} strokeWidth="0.6" />
      <rect x={78} y={222} width={20} height={12} fill="url(#sk-steelH)" />
      <rect x={98} y={223.5} width={70} height={9} fill="url(#sk-steelH)" />
      <rect x={40} y={214} width={34} height={28} rx="3" fill="url(#sk-steelH)" stroke={M.steelD} opacity="0.85" />
      <path d="M80 214 l4 10 l-4 10" fill="none" stroke={C.ruby} strokeWidth="1.8" />
      <T x={123} y={270} a="middle" s={10.5} c={C.ruby}>the thin squared end</T>
      <T x={123} y={284} a="middle" s={10.5} c={C.ruby}>shears off easily</T>

      <Pn x={246} y={166} w={222} h={138} t="Won’t budge?" />
      <path d="M296 262 Q284 240 300 222 Q302 238 312 232 Q318 248 304 262 Z" fill="#e7a34a" opacity="0.85" />
      <path d="M298 260 Q294 248 302 238 Q306 250 300 260 Z" fill="#fde3a0" />
      <rect x={322} y={210} width={30} height={24} rx="4" fill="url(#mk-knurl)" stroke={M.steelD} />
      <T x={366} y={216} s={10.5} c={C.text}>it may be</T>
      <T x={366} y={230} s={10.5} c={C.text}>thread-locked</T>
      <T x={262} y={284} s={10.5} c={C.dim}>a little heat from a lighter</T>
      <T x={262} y={298} s={10.5} c={C.dim}>breaks the bond</T>
    </F>
  )
}

function MkCrownCut() {
  return (
    <F h={330} view="Side view · cutting to length" scale="schematic">
      {/* case and movement */}
      <rect x={30} y={60} width={110} height={80} fill="url(#mk-mov)" stroke={C.brass} />
      <rect x={140} y={50} width={30} height={100} fill="url(#mk-cut)" />
      <rect x={170} y={92} width={14} height={16} fill="url(#sk-steelH)" />
      <rect x={90} y={98} width={150} height={4} fill="url(#sk-steelH)" />
      <rect x={240} y={86} width={30} height={28} rx="4" fill="url(#mk-knurl)" stroke={M.steelD} opacity="0.55" />
      <line x1={228} y1={80} x2={228} y2={120} stroke={C.ruby} strokeWidth="1.4" strokeDasharray="3 2" />
      <Dim a={[184, 120]} b={[228, 120]} off={-14} />
      <T x={194} y={150} s={10.5} c={C.ruby}>cut 1–2 mm long</T>
      <T x={194} y={164} s={10} c={C.faint}>then file to length</T>
      <Lab p={[256, 88]} x={300} y={60} text="new crown, fitted loosely" a="start" up />

      {/* inset: final gap */}
      <Ring x={392} y={118} r={58} />
      <rect x={344} y={78} width={22} height={80} fill="url(#mk-cut)" />
      <rect x={366} y={110} width={10} height={16} fill="url(#sk-steelH)" />
      <rect x={378} y={96} width={40} height={44} rx="5" fill="url(#mk-knurl)" stroke={M.steelD} />
      <Dim a={[376, 150]} b={[378, 150]} off={0} />
      <T x={392} y={192} a="middle" s={10.5} c={C.text}>a paper’s thickness</T>
      <T x={392} y={206} a="middle" s={10.5} c={C.text}>crown to case</T>

      <Step x={22} y={234} n={1} h="Chamfer the cut end" s="remove the burr" />
      <Step x={180} y={234} n={2} h="Loctite 603" s="a tiny drop" />
      <Step x={318} y={234} n={3} h="Screw the crown" s="up tight" />
      <rect x={12} y={284} width={456} height={36} rx="6" fill="rgba(123,165,131,0.08)" stroke={C.emerald} />
      <T x={22} y={306} s={10.5} c={C.text}>Cut long and test repeatedly. A short stem means starting over.</T>
    </F>
  )
}

function MkCrownProve() {
  const rows = [
    ['Pull through each click', 'a crisp detent at every position'],
    ['Wind a few turns', 'smooth, no slip'],
    ['Crown pushed in', 'the hands must stay still'],
  ]
  return (
    <F h={318} view="Test · before the back goes on" scale="schematic">
      {rows.map(([a, b], i) => (
        <g key={a}>
          <Num x={24} y={44 + i * 36} n={i + 1} />
          <T x={38} y={48 + i * 36} s={11} c={C.text} w={600}>{a}</T>
          <T x={204} y={48 + i * 36} s={10.5} c={C.dim}>{b}</T>
          <Verdict x={452} y={44 + i * 36} ok r={8} />
        </g>
      ))}
      <Pn x={12} y={140} w={222} h={164} t="Hands move when in?" tc={C.ruby} c={C.ruby} />
      <T x={24} y={176} s={10.5} c={C.text}>stem too short, or adhesive</T>
      <T x={24} y={190} s={10.5} c={C.text}>has reached the square</T>
      <rect x={34} y={224} width={14} height={4} fill="url(#sk-steelH)" />
      <rect x={48} y={222} width={40} height={8} fill="#9fb0ba" stroke={M.steelD} strokeWidth="0.6" />
      <rect x={60} y={220} width={18} height={12} rx="4" fill="rgba(240,230,140,0.6)" />
      <rect x={88} y={220} width={10} height={12} fill="url(#sk-steelH)" />
      <rect x={98} y={221.5} width={100} height={9} fill="url(#sk-steelH)" />
      <Lab p={[69, 220]} x={110} y={260} text="adhesive on the square" c={C.ruby} />
      <T x={24} y={292} s={10} c={C.faint}>Witschi lists both as common results</T>

      <Pn x={246} y={140} w={222} h={164} t="While the adhesive cures" />
      <T x={258} y={176} s={10.5} c={C.text}>keep the stem straight</T>
      <T x={258} y={192} s={10.5} c={C.text}>keep adhesive off the square</T>
      <Warn x={258} y={222} w={198} h={68} head="Cut too short?" text={['It can’t be saved.', 'Start again with a new stem.']} />
    </F>
  )
}

/* ================================================================== */
/* mech-truing · true the balance wheel                                 */
/* ================================================================== */

// Truing calipers, side view: a C-frame, cones top and bottom, an index.
function Calipers({ x, y, h = 120, idxY, children }) {
  return (
    <g>
      <path d={`M${x} ${y} L${x - 70} ${y} L${x - 70} ${y + h} L${x} ${y + h}`} fill="none" stroke="url(#sk-steelH)" strokeWidth="9" strokeLinejoin="round" />
      <path d={`M${x} ${y} L${x - 70} ${y} L${x - 70} ${y + h} L${x} ${y + h}`} fill="none" stroke={M.steelD} strokeWidth="1" strokeLinejoin="round" />
      <path d={`M${x - 8} ${y + 4} L${x + 8} ${y + 4} L${x} ${y + 16} Z`} fill="#dfe7ec" stroke={M.steelD} />
      <path d={`M${x - 8} ${y + h - 4} L${x + 8} ${y + h - 4} L${x} ${y + h - 16} Z`} fill="#dfe7ec" stroke={M.steelD} />
      {children}
      {idxY !== undefined && (
        <g>
          <rect x={x - 70} y={idxY - 2} width={110} height={4} fill="url(#sk-steelH)" />
          <path d={`M${x + 40} ${idxY - 2} L${x + 52} ${idxY} L${x + 40} ${idxY + 2} Z`} fill="#dfe7ec" />
        </g>
      )}
    </g>
  )
}

// Balance seen from the side on its staff (rim as a flat bar)
function BalSide({ cx, cy, r = 70, dip = 0, h = 100 }) {
  return (
    <g>
      <rect x={cx - 1.6} y={cy - h / 2} width={3.2} height={h} fill="url(#sk-steelH)" />
      <path d={`M${cx - r} ${cy + dip} L${cx + r} ${cy - dip}`} stroke={M.brassP} strokeWidth="7" />
      <rect x={cx - 8} y={cy - 4} width={16} height={8} fill={M.brassP} />
      <rect x={cx - 5} y={cy + 10} width={10} height={4} fill="url(#sk-steel)" />
    </g>
  )
}

function MkTrueMount() {
  return (
    <F h={300} view="Side view · balance in truing calipers" scale="schematic">
      <Calipers x={180} y={60} h={170}>
        <BalSide cx={180} cy={145} r={80} h={150} />
      </Calipers>
      <Lab p={[180, 70]} x={240} y={46} text="cone" sub="" a="start" up />
      <Lab p={[180, 220]} x={240} y={252} text="cone" a="start" />
      <Lab p={[250, 145]} x={300} y={120} text="balance rim" a="start" up />
      <Lab p={[181, 100]} x={300} y={84} text="staff" a="start" up />
      <Lab p={[110, 130]} x={70} y={270} text="caliper frame" />
      <Turn cx={180} cy={145} r={26} from={60} to={150} c="brass" w={1.6} />

      <Ring x={404} y={190} r={52} />
      <path d={`M384 154 L424 154 L404 190 Z`} fill="#dfe7ec" stroke={M.steelD} />
      <path d="M400 230 L404 186 L408 230 Z" fill="url(#sk-steelH)" stroke={M.steelD} />
      <T x={404} y={260} a="middle" s={10} c={C.dim}>the pivot’s cone seats</T>
      <T x={404} y={273} a="middle" s={10} c={C.dim}>in the caliper cone</T>

      <T x={14} y={44} s={11} c={C.text} w={600}>It turns on its own axis.</T>
      <T x={14} y={292} s={10} c={C.faint}>Work under a loupe, against good light.</T>
    </F>
  )
}

function MkTruePivots() {
  return (
    <F h={300} view="Plan of the pivot end · look before you bend" scale="schematic, magnified">
      <Pn x={12} y={26} w={222} h={170} t="Runs true" tc={C.emerald} c={C.emerald} ok />
      <circle cx={123} cy={110} r={36} fill="none" stroke={C.faint} strokeDasharray="2 3" />
      <circle cx={123} cy={110} r={6} fill="#dfe7ec" stroke={M.steelD} />
      <Turn cx={123} cy={110} r={46} from={30} to={150} c="brass" w={1.4} />
      <T x={123} y={176} a="middle" s={10.5} c={C.text}>the pivot spins on the spot</T>

      <Pn x={246} y={26} w={222} h={170} t="Runs out" tc={C.ruby} c={C.ruby} ok={false} />
      <circle cx={357} cy={110} r={14} fill="none" stroke={C.ruby} strokeDasharray="3 2" />
      {[0, 90, 180, 270].map((a) => {
        const [x, y] = pol(357, 110, 14, a)
        return <circle key={a} cx={x} cy={y} r={5} fill="#dfe7ec" stroke={M.steelD} opacity={a ? 0.4 : 1} />
      })}
      <circle cx={357} cy={110} r={2} fill={C.faint} />
      <T x={357} y={160} a="middle" s={10.5} c={C.ruby}>bent pivot or staff: it orbits</T>
      <T x={357} y={176} a="middle" s={10} c={C.dim}>a good rim then looks as if it wobbles</T>

      <rect x={12} y={208} width={456} height={80} rx="6" fill="rgba(194,88,99,0.10)" stroke={C.ruby} />
      <T x={24} y={228} s={11} c={C.ruby} w={700}>Stop. That’s a staff or pivot job, not a truing job.</T>
      <T x={24} y={246} s={10.5} c={C.text}>Bending the rim to hide it leaves you with two faults.</T>
      <T x={24} y={264} s={10.5} c={C.dim}>Watch both pivots under a loupe as the balance turns,</T>
      <T x={24} y={278} s={10.5} c={C.dim}>before you judge the rim.</T>
    </F>
  )
}

function MkTrueFlat() {
  const X = (a) => 60 + a * 1.0
  const rimY = (a) => 214 + 7 * Math.sin(((a - 40) * Math.PI) / 180)
  const curve = Array.from({ length: 37 }, (_, i) => [X(i * 10), rimY(i * 10)])
  return (
    <F h={330} view="Side and chart · true in the flat" scale="error exaggerated">
      <Calipers x={130} y={40} h={110} idxY={78}>
        <BalSide cx={130} cy={95} r={66} dip={-6} h={100} />
      </Calipers>
      <Lab p={[170, 78]} x={210} y={48} text="index, fixed, just over the rim" a="start" up />
      <Ring x={392} y={98} r={52} />
      <rect x={344} y={84} width={96} height={6} fill="url(#sk-steelH)" />
      <path d="M344 104 L440 112" stroke={M.brassP} strokeWidth="9" />
      <path d="M344 90 L440 90 L440 107 L344 99 Z" fill="url(#mk-glow)" opacity="0.8" />
      <T x={392} y={168} a="middle" s={10} c={C.dim}>slit of light, index to rim</T>

      <line x1={X(0)} y1={200} x2={X(360)} y2={200} stroke={C.steel} strokeWidth="1.4" />
      <polyline points={pts(curve)} fill="none" stroke={C.brassHi} strokeWidth="2" />
      <T x={X(360) + 6} y={204} s={10} c={C.steel}>index</T>
      <T x={X(360) + 6} y={220} s={10} c={C.brassHi}>rim</T>
      {[0, 90, 180, 270, 360].map((a) => (
        <T key={a} x={X(a)} y={244} a="middle" s={10} c={C.faint} mono>{a}°</T>
      ))}
      <T x={X(130)} y={192} a="middle" s={10.5} c={C.ruby}>slit widens: rim dips down</T>
      <T x={X(310)} y={192} a="middle" s={10.5} c={C.emerald}>narrows: it rises</T>
      <Arrow a={[X(130), 196]} b={[X(130), 218]} c="ruby" w={1.2} />
      <T x={X(180)} y={262} a="middle" s={10} c={C.faint}>turn the balance slowly, one full turn</T>
      <Bx x={12} y={276} w={456} h={42} l={['Even the two arms', 'until the light stays constant all the way round']} c={C.brass} />
    </F>
  )
}

function MkTrueRound() {
  const cx = 120
  const cy = 150
  const ell = []
  for (let a = 0; a <= 360; a += 6) {
    const rr = 70 + 5 * Math.cos(((a - 30) * Math.PI) / 180)
    ell.push(pol(cx, cy, rr, a))
  }
  return (
    <F h={316} view="Plan · true in the round" scale="schematic, error exaggerated">
      <polyline points={pts(ell)} fill="none" stroke={M.brassP} strokeWidth="6" />
      <circle cx={cx} cy={cy} r={70} fill="none" stroke={C.faint} strokeDasharray="3 3" />
      {[0, 120, 240].map((a) => {
        const [x, y] = pol(cx, cy, 68, a + 60)
        return <line key={a} x1={cx} y1={cy} x2={x} y2={y} stroke={M.brassP} strokeWidth="2" />
      })}
      <circle cx={cx} cy={cy} r={3} fill={M.ruby} />
      {/* index alongside the edge, at 3 o'clock */}
      <rect x={cx + 80} y={cy - 3} width={64} height={6} fill="url(#sk-steelH)" />
      <path d={`M${cx + 80} ${cy - 3} L${cx + 74} ${cy} L${cx + 80} ${cy + 3} Z`} fill="#dfe7ec" />
      <Lab p={[cx + 110, cy]} x={cx + 124} y={cy + 44} text="index beside the edge" a="start" />
      <Turn cx={cx} cy={cy} r={90} from={200} to={250} c="brass" w={1.6} />
      <Lab p={pol(cx, cy, 75, 30)} x={236} y={250} text="bulges out" c={C.ruby} a="start" />
      <Lab p={pol(cx, cy, 65, 210)} x={30} y={280} text="flat / in" c={C.steel} />
      <T x={cx} y={300} a="middle" s={10} c={C.faint}>dashed: true circle</T>

      <rect x={290} y={30} width={178} height={110} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <Tag x={300} y={48}>Past the index</Tag>
      <T x={300} y={70} s={10.5} c={C.text}>gap opens:</T>
      <T x={378} y={70} s={10.5} c={C.steel}>rim flat / in</T>
      <T x={300} y={90} s={10.5} c={C.text}>gap closes:</T>
      <T x={378} y={90} s={10.5} c={C.ruby}>bulges out</T>
      <T x={300} y={118} s={10.5} c={C.dim}>coax high and low spots</T>
      <T x={300} y={132} s={10.5} c={C.dim}>till it runs concentric</T>
    </F>
  )
}

function MkTrueBend() {
  return (
    <F h={316} view="Plan · bending the rim by hand" scale="schematic">
      <Balance cx={150} cy={150} r={84} />
      {/* thumb and forefinger on the rim at 3 o'clock */}
      <ellipse cx={244} cy={134} rx={30} ry={16} fill="#d9b48f" stroke="#9b7650" transform="rotate(-20 244 134)" opacity="0.92" />
      <ellipse cx={246} cy={168} rx={30} ry={16} fill="#caa27c" stroke="#9b7650" transform="rotate(20 246 168)" opacity="0.92" />
      <Arrow a={[290, 120]} b={[290, 104]} c="brass" w={1.4} />
      <Arrow a={[290, 180]} b={[290, 196]} c="brass" w={1.4} />
      <Arrow a={[300, 150]} b={[316, 150]} c="brass" w={1.4} />
      <T x={300} y={98} s={10.5} c={C.brassHi}>up</T>
      <T x={300} y={208} s={10.5} c={C.brassHi}>down</T>
      <T x={322} y={154} s={10.5} c={C.brassHi}>sideways</T>
      <T x={300} y={236} s={10.5} c={C.text}>tiny amounts; re-check</T>
      <T x={300} y={250} s={10.5} c={C.text}>after every nudge</T>
      <Lab p={[150, 150]} x={60} y={46} text="hairspring: never touch it" c={C.ruby} up a="start" />
      <circle cx={150} cy={150} r={46} fill="none" stroke={C.ruby} strokeDasharray="4 3" />
      <Warn x={12} y={268} w={456} h={40} head="Delicate, advanced work: practise on scrap balances first." />
    </F>
  )
}

function MkTrueProve() {
  return (
    <F h={322} view="Sequence · prove the result" scale="schematic">
      <Pn x={12} y={26} w={222} h={110} t="Last turn in the calipers" />
      <rect x={30} y={70} width={186} height={4} fill="url(#sk-steelH)" />
      <rect x={30} y={86} width={186} height={6} fill={M.brassP} />
      <rect x={30} y={74} width={186} height={12} fill="url(#mk-glow)" opacity="0.7" />
      <T x={123} y={112} a="middle" s={10.5} c={C.text}>flat and round: the gap</T>
      <T x={123} y={126} a="middle" s={10.5} c={C.text}>stays even all the way</T>

      <Pn x={246} y={26} w={222} h={110} t="Then poise it" />
      <T x={258} y={64} s={10.5} c={C.text}>Bending moves weight.</T>
      <T x={258} y={80} s={10.5} c={C.text}>A true rim isn’t necessarily</T>
      <T x={258} y={94} s={10.5} c={C.text}>a poised one.</T>
      <Balance cx={436} cy={112} r={16} spring={false} />

      <Tag x={14} y={160}>Back in the watch: compare the vertical positions</Tag>
      {['crown up', 'crown down', 'crown left', 'crown right'].map((l, i) => (
        <g key={l}>
          <g transform={`rotate(${[0, 180, 270, 90][i]} ${30 + i * 118} 189)`}>
            <rect x={20 + i * 118} y={172} width={20} height={34} rx="6" fill="url(#sk-steel)" stroke={M.steelD} />
            <rect x={25 + i * 118} y={166} width={10} height={6} rx="2" fill="url(#mk-knurl)" />
          </g>
          <T x={58 + i * 118} y={194} s={10.5} c={C.text}>{l}</T>
        </g>
      ))}
      <Bx x={12} y={222} w={222} h={88} l={['Large differences', 'Witschi’s chart: centring,', 'poising, or replacing the', 'regulating parts']} c={C.ruby} s={11} lh={15} />
      <Bx x={246} y={222} w={222} h={88} l={['No better?', 'check the hairspring before', 'you bend the rim again']} c={C.brass} s={11} lh={15} />
    </F>
  )
}

/* ================================================================== */
/* mech-threads · broken screws and damaged threads                     */
/* ================================================================== */

// Screw head in section across the slot, with a blade in it
function SlotFit({ x, y, kind }) {
  const bw = { ok: 12, narrow: 5, thick: 12, round: 12 }[kind]
  return (
    <g>
      <rect x={x - 26} y={y} width={52} height={22} rx="3" fill="url(#mk-cut)" stroke={M.steelD} />
      <rect x={x - 6} y={y} width={12} height={12} fill={C.ground} />
      {kind === 'thick' ? (
        <path d={`M${x - 10} ${y - 40} L${x + 10} ${y - 40} L${x + 10} ${y - 10} L${x + 4} ${y} L${x - 4} ${y} L${x - 10} ${y - 10} Z`} fill="url(#sk-steelH)" stroke={M.steelD} />
      ) : kind === 'round' ? (
        <path d={`M${x - 6} ${y - 40} L${x + 6} ${y - 40} L${x + 6} ${y + 2} Q${x} ${y + 12} ${x - 6} ${y + 2} Z`} fill="url(#sk-steelH)" stroke={M.steelD} />
      ) : (
        <rect x={x - bw / 2} y={y - 40} width={bw} height={kind === 'ok' ? 51 : 50} fill="url(#sk-steelH)" stroke={M.steelD} />
      )}
    </g>
  )
}

function MkThrFit() {
  const cells = [
    ['ok', 'Fills the slot', 'flat, square tip', true],
    ['thick', 'Too thick', 'wedges, rides out', false],
    ['round', 'Rounded tip', 'cams out', false],
  ]
  return (
    <F h={300} view="Section · the driver that fits" scale="schematic, magnified">
      {cells.map(([k, a, b, ok], i) => (
        <g key={k}>
          <Pn x={12 + i * 154} y={26} w={146} h={140} t={a} ok={ok} c={ok ? C.emerald : C.ruby} tc={ok ? C.emerald : C.ruby} />
          <SlotFit x={85 + i * 154} y={98} kind={k} />
          <T x={85 + i * 154} y={150} a="middle" s={10.5} c={ok ? C.text : C.ruby}>{b}</T>
        </g>
      ))}
      <T x={14} y={186} s={11} c={C.text} w={600}>Match blade width and thickness to the slot; dress the tip flat and square.</T>
      <T x={14} y={202} s={10.5} c={C.dim}>Almost every sheared screw starts with a driver that doesn’t fit.</T>
      <Warn x={12} y={214} w={456} h={76} head="Never lean on a stuck screw" text={['A drop of penetrating oil and an hour’s patience beat a broken stub.', 'Once it shears, a five-minute job becomes an hour’s work,', 'or a scrapped plate.']} />
    </F>
  )
}

function MkThrStuck() {
  return (
    <F h={312} view="Section · freeing a stuck screw" scale="schematic">
      <Pn x={12} y={26} w={148} h={164} />
      <Num x={28} y={42} n={1} />
      <rect x={30} y={120} width={112} height={30} fill="url(#mk-bcut)" />
      <rect x={76} y={104} width={20} height={16} rx="2" fill="url(#mk-cut)" />
      <rect x={81} y={120} width={10} height={30} fill="url(#mk-thread)" />
      <circle cx={72} cy={116} r={3.5} fill={M.oil} />
      <circle cx={100} cy={116} r={3.5} fill={M.oil} />
      <G x={110} y={100} ang={35}>
        <Oiler len={50} drop={0} />
      </G>
      <T x={86} y={170} a="middle" s={10.5} c={C.text}>penetrating oil</T>
      <T x={86} y={184} a="middle" s={10.5} c={C.dim}>round the head; leave it</T>

      <Pn x={170} y={26} w={148} h={164} />
      <Num x={186} y={42} n={2} />
      <rect x={188} y={120} width={112} height={30} fill="url(#mk-cut)" />
      <rect x={234} y={104} width={20} height={16} rx="2" fill="url(#mk-cut)" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${222 + i * 22} 96 q-5 -10 0 -20 q5 -10 0 -20`} fill="none" stroke="#e7a34a" strokeWidth="1.4" opacity="0.8" />
      ))}
      <T x={244} y={170} a="middle" s={10.5} c={C.text}>gentle warmth</T>
      <T x={244} y={184} a="middle" s={10.5} c={C.dim}>for corroded case screws</T>

      <Pn x={328} y={26} w={140} h={164} />
      <Num x={344} y={42} n={3} />
      <rect x={346} y={130} width={106} height={30} fill="url(#mk-bcut)" />
      <rect x={389} y={114} width={20} height={16} rx="2" fill="url(#mk-cut)" />
      <G x={399} y={118}>
        <Screwdriver len={66} blade={12} />
      </G>
      <Arrow a={[432, 64]} b={[432, 92]} c="brass" w={1.8} />
      <T x={398} y={172} a="middle" s={10} c={C.text}>largest blade it takes,</T>
      <T x={398} y={184} a="middle" s={10} c={C.text}>straight down, turn slowly</T>

      <Pn x={12} y={200} w={456} h={100} t="If the slot starts to deform" tc={C.ruby} c={C.ruby} />
      <rect x={30} y={240} width={52} height={22} rx="3" fill="url(#mk-cut)" stroke={M.steelD} />
      <path d={`M48 240 L50 252 L62 252 L64 240`} fill={C.ground} />
      <path d="M44 240 L50 244 M68 240 L62 244" stroke={C.ruby} strokeWidth="1.4" />
      <T x={100} y={250} s={12} c={C.ruby} w={700}>stop and reconsider</T>
      <T x={100} y={270} s={10.5} c={C.dim}>A chewed slot leaves nothing to grip. More force now is how screws shear.</T>
    </F>
  )
}

function MkThrExtract() {
  return (
    <F h={316} view="Section · getting a broken stub out" scale="schematic, magnified">
      <Pn x={12} y={26} w={222} h={170} t="Stub stands proud" />
      <rect x={30} y={120} width={186} height={44} fill="url(#mk-bcut)" />
      <rect x={113} y={110} width={20} height={54} fill="url(#mk-thread)" stroke={M.steelD} />
      <path d="M113 110 l5 -4 l5 4 l5 -4 l5 4" fill="none" stroke={M.steelD} />
      <G x={123} y={110}>
        <PinVice len={52} />
      </G>
      <Turn cx={123} cy={96} r={20} from={240} to={120} c="brass" w={1.6} />
      <T x={123} y={182} a="middle" s={10.5} c={C.text}>pin vice or fine pliers: back it out</T>

      <Pn x={246} y={26} w={222} h={170} t="Stub flush" />
      <rect x={264} y={110} width={186} height={54} fill="url(#mk-bcut)" />
      <rect x={347} y={110} width={20} height={54} fill="url(#mk-thread)" stroke={M.steelD} />
      <circle cx={357} cy={112} r={2.4} fill={C.ground} />
      <path d="M352 52 L362 52 L362 96 L357 108 L352 96 Z" fill="url(#sk-steelH)" stroke={M.steelD} />
      <T x={372} y={68} s={10} c={C.text}>centre punch, then a</T>
      <T x={372} y={82} s={10} c={C.text}>left-hand drill or a</T>
      <T x={372} y={96} s={10} c={C.text}>screw extractor</T>
      <path d="M337 120 L345 162" stroke={C.ruby} strokeWidth="1.6" strokeDasharray="3 2" />
      <T x={357} y={182} a="middle" s={10.5} c={C.ruby}>a drill can wander into the thread</T>

      <rect x={12} y={208} width={456} height={96} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={228} s={11} c={C.text} w={600}>The risk</T>
      <T x={24} y={246} s={10.5} c={C.dim}>Drilling a hardened screw in a soft plate can wander</T>
      <T x={24} y={260} s={10.5} c={C.dim}>into the thread you are trying to save.</T>
      <T x={24} y={286} s={11} c={C.emerald}>So for steel in brass, alum is usually the safer first choice.</T>
    </F>
  )
}

function MkThrRescue() {
  const hole = (x, kind) => (
    <g>
      <rect x={x} y={86} width={120} height={60} fill="url(#mk-bcut)" />
      {kind === 0 && <rect x={x + 50} y={86} width={20} height={60} fill="url(#mk-thread)" stroke={C.emerald} />}
      {kind === 1 && (
        <>
          <rect x={x + 44} y={86} width={32} height={60} fill="url(#mk-cut)" stroke={C.steel} />
          <rect x={x + 52} y={86} width={16} height={60} fill="url(#mk-thread)" />
        </>
      )}
      {kind === 2 && (
        <>
          <rect x={x + 44} y={86} width={32} height={60} fill={M.brassP} stroke={C.brassHi} />
          <rect x={x + 54} y={86} width={12} height={60} fill="url(#mk-thread)" />
        </>
      )}
    </g>
  )
  const opts = [
    ['Re-tap a size up', 'fit a matching screw', 'next size up'],
    ['Threaded insert', 'a new thread in a sleeve', 'insert'],
    ['Plug, then re-tap', 'turned pin, drill and tap', 'original size'],
  ]
  return (
    <F h={300} view="Section · three ways to rescue a stripped thread" scale="schematic">
      {opts.map(([a, b, c2], i) => (
        <g key={a}>
          <Num x={30 + i * 154} y={44} n={i + 1} />
          <T x={44 + i * 154} y={48} s={11} c={C.text} w={600}>{a}</T>
          <T x={44 + i * 154} y={64} s={10} c={C.dim}>{b}</T>
          {hole(18 + i * 154, i)}
          <T x={78 + i * 154} y={166} a="middle" s={10.5} c={C.brassHi}>{c2}</T>
        </g>
      ))}
      <Arrow a={[30, 192]} b={[450, 192]} c="brass" w={1.6} />
      <T x={240} y={212} a="middle" s={10.5} c={C.dim}>increasing effort</T>
      <rect x={12} y={228} width={456} height={60} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={250} s={11} c={C.text}>Watch threads are fine metric.</T>
      <T x={24} y={268} s={10.5} c={C.dim}>The tap-size table on the Cheat-sheets page lists the common ones.</T>
    </F>
  )
}

function MkThrStem() {
  return (
    <F h={316} view="Section and flow · a stem broken in the crown" scale="schematic">
      {/* crown with stub */}
      <path d="M60 56 L140 56 L140 136 L60 136 L60 120 L120 120 L120 72 L60 72 Z" fill="url(#mk-knurl)" stroke={M.steelD} />
      <rect x={70} y={88} width={50} height={16} fill="url(#mk-thread)" stroke={M.steelD} />
      <path d="M70 88 l-4 4 l4 4 l-4 4 l4 4" fill="none" stroke={C.ruby} strokeWidth="1.4" />
      <rect x={100} y={86} width={20} height={20} fill="rgba(240,230,140,0.45)" />
      <Lab p={[90, 96]} x={40} y={170} text="broken stub" />
      <Lab p={[110, 92]} x={180} y={52} text="thread-lock" a="start" up />

      <Bx x={210} y={70} w={258} h={46} l={['1 Soften the thread-lock', 'gentle heat or a solvent']} c={C.brass} />
      <Arrow a={[339, 116]} b={[339, 132]} c="brass" w={1.4} />
      <Bx x={210} y={134} w={258} h={46} l={['2 Unscrew the stub', 'with a pin vice']} c={C.brass} />
      <Arrow a={[339, 180]} b={[339, 196]} c="ruby" w={1.4} />
      <T x={348} y={192} s={10} c={C.ruby}>that fails</T>
      <Bx x={210} y={198} w={258} h={34} l={['Is the crown worth saving?']} c={C.struct} />
      <Arrow d="M260 232 L260 252" c="emerald" w={1.4} />
      <Arrow d="M420 232 L420 252" c="ruby" w={1.4} />
      <T x={250} y={246} a="end" s={10} c={C.emerald}>yes</T>
      <T x={430} y={246} s={10} c={C.ruby}>no</T>
      <Bx x={180} y={254} w={140} h={46} l={['Drill the stub out', 'on a lathe']} c={C.emerald} />
      <Bx x={340} y={254} w={128} h={46} l={['New crown', 'and stem']} c={C.steel} />
    </F>
  )
}

function MkThrStop() {
  return (
    <F h={290} view="Decision · weigh it before you drill on" scale="schematic">
      {/* balance scale */}
      <path d="M240 210 L240 70" stroke={C.struct} strokeWidth="3" />
      <path d="M210 214 L270 214 L262 204 L218 204 Z" fill={C.struct} />
      <g transform="rotate(-9 240 70)">
        <line x1={110} y1={70} x2={370} y2={70} stroke={C.dim} strokeWidth="3" />
        <path d="M110 70 L80 120 L140 120 Z" fill="none" stroke={C.faint} />
        <path d="M370 70 L340 120 L400 120 Z" fill="none" stroke={C.faint} />
        <rect x={84} y={120} width={52} height={6} fill={C.dim} />
        <rect x={344} y={120} width={52} height={6} fill={C.dim} />
        <Wheel cx={110} cy={106} r={12} spokes={4} />
        <circle cx={370} cy={98} r={20} fill="url(#mk-bcut)" stroke={C.ruby} />
        <circle cx={378} cy={96} r={4} fill={C.ground} stroke={C.ruby} />
        <circle cx={372} cy={96} r={4} fill="none" stroke={C.ruby} strokeDasharray="2 1" />
      </g>
      <Note x={70} y={156} lines={['a replacement part', 'or a donor movement']} c={C.text} a="middle" s={10.5} lh={14} />
      <Note x={400} y={176} lines={['the risk of ruining', 'a good plate']} c={C.ruby} a="middle" s={10.5} lh={14} />

      <rect x={12} y={226} width={456} height={54} rx="6" fill="rgba(194,88,99,0.10)" stroke={C.ruby} />
      <T x={24} y={246} s={11} c={C.ruby} w={700}>A plate with a wandering drilled hole is worth less than a donor.</T>
      <T x={24} y={264} s={10.5} c={C.text}>If extraction is going wrong, stop and weigh it. That judgement is part of the craft.</T>
    </F>
  )
}

/* ================================================================== */
/* mech-keyless-repair · repair the keyless works                       */
/* ================================================================== */

// Keyless works in plan, schematic. Stem along y, crown at right.
// mode: 'wind' (clutch out, on the winding pinion) or 'set' (clutch in)
function Keyless({ x = 0, y = 0, mode = 'wind', marks, hi }) {
  const s = mode === 'set' ? -14 : 0
  const H = (id) => (hi && hi.includes(id) ? 1 : 0.85)
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* stem */}
      <rect x={40} y={127} width={300} height={6} fill="url(#sk-steelH)" />
      <rect x={150} y={124} width={86} height={12} fill="#9fb0ba" opacity="0.5" />
      <rect x={340} y={116} width={22} height={28} rx="4" fill="url(#mk-knurl)" stroke={M.steelD} />
      {/* winding pinion */}
      <g opacity={H('wp')}>
        <rect x={240} y={116} width={26} height={28} fill="url(#sk-steelH)" stroke={M.steelD} />
        {[0, 1, 2, 3, 4].map((i) => <line key={i} x1={242 + i * 5.5} y1={116} x2={242 + i * 5.5} y2={144} stroke={M.steelD} strokeWidth="0.8" />)}
      </g>
      {/* clutch */}
      <g opacity={H('cl')}>
        <rect x={190 + s} y={114} width={46} height={32} rx="2" fill="url(#sk-steel)" stroke={M.steelD} />
        <rect x={208 + s} y={114} width={8} height={32} fill="#5f717d" />
        <path d={`M${236 + s} 116 l4 4 l-4 4 l4 4 l-4 4 l4 4 l-4 4 l4 4 l-4 4`} fill="none" stroke={M.steelD} strokeWidth="1" />
      </g>
      {/* setting wheel */}
      <g opacity={H('sw')}>
        <Gear cx={176} cy={176} r={20} n={18} screw={false} />
        <circle cx={176} cy={176} r={3} fill={M.ruby} />
      </g>
      {/* minute wheel */}
      <g opacity={H('mw')}>
        <Gear cx={120} cy={206} r={26} n={22} screw={false} fill="rgba(201,162,76,0.5)" />
        <circle cx={120} cy={206} r={3} fill={M.ruby} />
      </g>
      {/* cannon pinion / centre */}
      <circle cx={56} cy={206} r={12} fill="url(#sk-steel)" stroke={M.steelD} opacity={H('mo')} />
      {/* yoke: pivot upper left, fork into the clutch groove */}
      <path d={`M120 70 L210 ${110} L${216 + s} 114 L${212 + s} 120 L${206 + s} 116 L116 78 Z`} fill="url(#sk-steelH)" stroke={M.steelD} opacity={H('yo')} />
      <circle cx={118} cy={74} r={5} fill="#c5ced4" stroke="#3e4a52" />
      {/* yoke spring */}
      <path d="M160 56 Q200 60 190 92" fill="none" stroke={C.steel} strokeWidth="1.6" opacity={H('ys')} />
      {/* setting lever: pivot lower, pin in the stem groove */}
      <path d={`M100 160 L${150} 136 L${158} 140 L106 168 Z`} fill="url(#sk-steelH)" stroke={M.steelD} opacity={H('sl')} />
      <circle cx={100} cy={164} r={5} fill="#c5ced4" stroke="#3e4a52" />
      {/* setting-lever spring / detent */}
      <path d={`M40 110 L80 110 L84 104 L88 110 L92 104 L96 110 L110 110 L110 116 L40 116 Z`} fill="url(#sk-steelH)" stroke={M.steelD} opacity={H('sp')} />
      {marks}
    </g>
  )
}

function MkKeyParts() {
  return (
    <F h={330} view="Plan · the keyless works" scale="schematic, layout varies by calibre">
      <Keyless y={0} />
      <Lab p={[351, 130]} x={420} y={110} text="crown" up />
      <Lab p={[300, 130]} x={300} y={168} text="stem" />
      <Lab p={[253, 118]} x={290} y={90} text="winding pinion" a="start" up />
      <Lab p={[212, 116]} x={226} y={56} text="sliding (castle) clutch" a="start" up />
      <Lab p={[160, 93]} x={110} y={46} text="yoke" up />
      <Lab p={[128, 150]} x={30} y={150} text="setting lever" a="start" />
      <Lab p={[66, 113]} x={30} y={96} text="lever spring / detent" a="start" up />
      <Lab p={[176, 176]} x={220} y={196} text="setting wheel" a="start" />
      <Lab p={[120, 206]} x={170} y={244} text="minute wheel" a="start" />
      <Lab p={[56, 206]} x={40} y={244} text="motion work" />

      <Tag x={14} y={270}>Chain</Tag>
      <T x={14} y={288} s={10.5} c={C.text}>crown → stem → winding pinion + clutch. The yoke slides the clutch; the setting</T>
      <T x={14} y={302} s={10.5} c={C.text}>lever positions the yoke; its spring/detent holds it. Setting: clutch → wheels → motion work.</T>
      <T x={14} y={320} s={10} c={C.faint}>Name each one before you touch it: the fault is a worn or displaced one of these.</T>
    </F>
  )
}

function MkKeySymptoms() {
  const rows = [
    ['Winds, won’t hand-set', ['clutch not reaching the setting wheels,', 'or worn setting / minute wheel teeth'], C.brass],
    ['Sets, won’t wind', ['a worn winding pinion, or a ratchet /', 'crown-wheel problem'], C.steel],
    ['Won’t hold a detent; crown pops out', ['a tired setting-lever spring or detent,', 'or a stem shoulder worn round'], C.ruby],
  ]
  return (
    <F h={300} view="Decision · reproduce the symptom first" scale="schematic">
      <T x={14} y={42} s={10.5} c={C.dim}>Work the crown through every position and name exactly what fails.</T>
      {rows.map(([a, b, col], i) => (
        <g key={a}>
          <rect x={12} y={56 + i * 76} width={196} height={64} rx="6" fill="rgba(255,255,255,0.03)" stroke={col} />
          <T x={24} y={84 + i * 76} s={11} c={C.text} w={600}>{a.length > 24 ? 'Won’t hold a detent;' : a}</T>
          {a.length > 24 && <T x={24} y={100 + i * 76} s={11} c={C.text} w={600}>crown pops out</T>}
          <Arrow a={[212, 88 + i * 76]} b={[232, 88 + i * 76]} c="brass" w={1.4} />
          <rect x={236} y={56 + i * 76} width={232} height={64} rx="6" fill="rgba(255,255,255,0.02)" stroke={C.line} />
          <T x={246} y={76 + i * 76} s={10} c={C.faint}>suspect</T>
          <T x={246} y={92 + i * 76} s={10.5} c={C.text}>{b[0]}</T>
          <T x={246} y={106 + i * 76} s={10.5} c={C.text}>{b[1]}</T>
        </g>
      ))}
    </F>
  )
}

function MkKeyStrip() {
  return (
    <F h={298} view="Sequence and detail · stripping the dial side" scale="schematic">
      {[
        ['Hands and dial', 'off'],
        ['Motion work', 'lift in order'],
        ['Keyless parts', 'in order'],
      ].map(([a, b], i) => (
        <g key={a}>
          <rect x={12 + i * 156} y={28} width={144} height={42} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.brass} strokeOpacity="0.55" />
          <Num x={28 + i * 156} y={49} n={i + 1} />
          <T x={42 + i * 156} y={46} s={11} c={C.text} w={600}>{a}</T>
          <T x={42 + i * 156} y={61} s={10} c={C.dim}>{b}</T>
          {i < 2 && <Arrow a={[157 + i * 156, 49]} b={[167 + i * 156, 49]} c="brass" w={1.3} />}
        </g>
      ))}

      <Pn x={12} y={82} w={200} h={130} t="Setting-lever screw" />
      <Screw x={80} y={150} r={14} ang={20} />
      <Turn cx={80} cy={150} r={24} from={30} to={210} c="brass" w={1.8} />
      <T x={120} y={142} s={11} c={C.brassHi} w={600}>half a turn</T>
      <T x={120} y={158} s={10.5} c={C.dim}>on many</T>
      <T x={120} y={172} s={10.5} c={C.dim}>movements</T>
      <T x={24} y={202} s={10} c={C.faint}>don’t remove it unless the calibre needs it</T>

      <Pn x={222} y={82} w={246} h={130} t="Cover the spring as it frees" tc={C.ruby} />
      <rect x={240} y={168} width={210} height={14} fill="url(#mk-mov)" />
      <path d="M262 160 L330 160 L336 152 L342 160 L420 160 L420 166 L262 166 Z" fill="url(#sk-steelH)" stroke={M.steelD} />
      <G x={378} y={156} ang={-20}>
        <Pegwood len={58} />
      </G>
      <G x={300} y={160} ang={30}>
        <Tweezers len={56} w={2} gap={3} />
      </G>
      <Arrow d="M430 150 q20 -30 10 -50" c="ruby" w={1.4} dash="3 3" />
      <T x={340} y={202} a="middle" s={10.5} c={C.text}>pegwood or a finger over the top</T>

      <Warn x={12} y={224} w={456} h={62} head="The setting-lever and yoke springs are under tension" text={['Freed without cover, they launch across the room.', 'Hold pegwood or a fingertip over each one as you free it.']} />
    </F>
  )
}

function MkKeyWear() {
  const teeth = (x, y, worn, n = 4) => (
    <path
      d={Array.from({ length: n }, (_, i) => (worn ? `M${x + i * 16} ${y} Q${x + i * 16 + 7} ${y - 10} ${x + i * 16 + 14} ${y}` : `M${x + i * 16} ${y} L${x + i * 16 + 4} ${y - 12} L${x + i * 16 + 10} ${y - 12} L${x + i * 16 + 14} ${y}`)).join(' ')}
      fill="url(#sk-steelH)"
      stroke={M.steelD}
    />
  )
  const pair = (y, name, good, bad) => (
    <g>
      <T x={14} y={y + 4} s={11} c={C.text} w={600}>{name}</T>
      <g>{good}</g>
      <Verdict x={286} y={y} ok r={7} />
      <g>{bad}</g>
      <Verdict x={452} y={y} ok={false} r={7} />
    </g>
  )
  return (
    <F h={322} view="Inspection · under the loupe" scale="schematic, magnified">
      <Tag x={190} y={38}>Sound</Tag>
      <Tag x={356} y={38}>Worn</Tag>
      {pair(66, 'Clutch teeth', teeth(196, 72, false), teeth(362, 72, true))}
      {pair(118, 'Winding pinion', teeth(196, 124, false), <g>{teeth(362, 124, false, 2)}<path d="M394 124 L398 118 L404 122 L408 116 L410 124" fill="url(#sk-steelH)" stroke={C.ruby} /></g>)}
      {pair(170, 'Setting-lever detent', <path d="M196 176 L216 176 L222 162 L232 162 L238 176 L258 176" fill="none" stroke={C.steel} strokeWidth="2.4" />, <path d="M362 176 L382 176 Q393 168 404 176 L424 176" fill="none" stroke={C.ruby} strokeWidth="2.4" />)}
      {pair(222, 'Stem square, shoulder', <rect x={196} y={216} width={62} height={10} fill="#9fb0ba" stroke={M.steelD} />, <path d="M362 226 L362 218 Q368 214 376 216 L424 216 L424 226 Z" fill="#9fb0ba" stroke={C.ruby} />)}
      <T x={14} y={186} s={10} c={C.faint}>flattened faces</T>
      <T x={14} y={238} s={10} c={C.faint}>square or shoulders worn</T>
      <T x={14} y={82} s={10} c={C.faint}>rounded</T>
      <T x={14} y={134} s={10} c={C.faint}>chewed</T>
      <rect x={12} y={252} width={456} height={58} rx="6" fill="rgba(194,88,99,0.08)" stroke={C.ruby} />
      <T x={24} y={274} s={11} c={C.ruby} w={700}>Mating steel parts fail in pairs.</T>
      <T x={24} y={292} s={10.5} c={C.text}>A worn clutch usually means a worn winding pinion too: check both.</T>
    </F>
  )
}

function MkKeyReplace() {
  return (
    <F h={300} view="Comparison · replace, don’t file" scale="schematic">
      <Pn x={12} y={26} w={222} h={150} t="Re-cutting worn teeth" tc={C.ruby} c={C.ruby} ok={false} />
      <rect x={60} y={98} width={60} height={30} fill="url(#sk-steel)" stroke={M.steelD} />
      <path d="M60 98 q8 -8 15 0 q8 -8 15 0 q8 -8 15 0 q8 -8 15 0" fill="none" stroke={M.steelD} />
      <path d="M100 60 L160 92 L156 98 L96 66 Z" fill="url(#mk-knurl)" stroke={M.steelD} />
      <T x={123} y={150} a="middle" s={10.5} c={C.text}>hardened steel, a bodge,</T>
      <T x={123} y={164} a="middle" s={10.5} c={C.text}>and hours lost</T>

      <Pn x={246} y={26} w={222} h={150} t="The correct new part" tc={C.emerald} c={C.emerald} ok />
      <rect x={290} y={98} width={60} height={30} fill="url(#sk-steel)" stroke={M.steelD} />
      <path d="M290 98 L294 86 L300 86 L304 98 L308 86 L314 86 L318 98 L322 86 L328 86 L332 98 L336 86 L342 86 L346 98" fill="url(#sk-steelH)" stroke={M.steelD} />
      <rect x={370} y={84} width={72} height={46} rx="4" fill="#efe8dc" stroke="#a89c82" />
      <T x={406} y={104} a="middle" s={10} c="#2b2620">for your</T>
      <T x={406} y={118} a="middle" s={10} c="#2b2620">calibre</T>
      <T x={357} y={156} a="middle" s={10.5} c={C.text}>cheap next to the time saved</T>

      <Tag x={14} y={198}>Fit new, for the calibre</Tag>
      {['clutch', 'winding pinion', 'setting lever', 'yoke', 'spring', 'stem'].map((l, i) => (
        <g key={l}>
          <rect x={12 + (i % 3) * 154} y={208 + Math.floor(i / 3) * 40} width={146} height={32} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
          <T x={85 + (i % 3) * 154} y={229 + Math.floor(i / 3) * 40} a="middle" s={11} c={C.text}>{l}</T>
        </g>
      ))}
    </F>
  )
}

function MkKeyLube() {
  const drop = (x, y, c) => <circle cx={x} cy={y} r={4} fill={c} stroke={C.ground} strokeWidth="0.8" />
  return (
    <F h={330} view="Plan · lubrication points" scale="after ETA 2824-2’s chart">
      <Keyless y={-20} marks={
        <g>
          {drop(120, 130, C.brassHi)}
          {drop(170, 130, C.brassHi)}
          {drop(212, 112, C.brassHi)}
          {drop(150, 140, C.brassHi)}
          {drop(253, 112, M.grease)}
          {drop(253, 148, M.grease)}
        </g>
      } />
      <rect x={300} y={158} width={168} height={82} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <circle cx={314} cy={180} r={4} fill={C.brassHi} />
      <T x={324} y={184} s={10.5} c={C.text} w={600}>HP-1300</T>
      <T x={324} y={198} s={10} c={C.dim}>stem, sliding pinion,</T>
      <T x={324} y={211} s={10} c={C.dim}>lever contact points</T>
      <circle cx={314} cy={226} r={4} fill={M.grease} />
      <T x={324} y={230} s={10.5} c={C.text}><tspan fontWeight="600">9504</tspan> winding pinion teeth</T>
      <T x={14} y={256} s={10} c={C.faint}>Heavier lubricant here: too thin and it wears again quickly. Other calibres vary: check the sheet.</T>

      <Tag x={14} y={274}>Then cycle it a dozen times</Tag>
      {['wind', 'set', 'date, if fitted'].map((l, i) => (
        <g key={l}>
          <rect x={12 + i * 104} y={284} width={96} height={30} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.brass} strokeOpacity="0.6" />
          <T x={60 + i * 104} y={304} a="middle" s={11} c={C.text}>{l}</T>
        </g>
      ))}
      <T x={326} y={296} s={10.5} c={C.emerald}>crisp, positive detents</T>
      <T x={326} y={310} s={10} c={C.dim}>test before the dial goes on</T>
    </F>
  )
}

export const FIGS = {
  'mk-letdown-why': MkLetdownWhy,
  'mk-letdown-holder': MkLetdownHolder,
  'mk-letdown-control': MkLetdownControl,
  'mk-letdown-driver': MkLetdownDriver,
  'mk-letdown-confirm': MkLetdownConfirm,
  'mk-letdown-damage': MkLetdownDamage,
  'mk-uncase-loader': MkUncaseLoader,
  'mk-uncase-open': MkUncaseOpen,
  'mk-uncase-stempos': MkUncaseStemPos,
  'mk-uncase-withdraw': MkUncaseWithdraw,
  'mk-uncase-clamps': MkUncaseClamps,
  'mk-dial-release': MkDialRelease,
  'mk-dial-foot': MkDialFoot,
  'mk-dial-refit': MkDialRefit,
  'mk-hands-press': MkHandsPress,
  'mk-diag-dead': MkDiagDead,
  'mk-diag-stops': MkDiagStops,
  'mk-diag-reserve': MkDiagReserve,
  'mk-diag-slow': MkDiagSlow,
  'mk-diag-cannon': MkDiagCannon,
  'mk-diag-noise': MkDiagNoise,
  'mk-ms-inspect': MkMsInspect,
  'mk-ms-barrelcheck': MkMsBarrelCheck,
  'mk-ms-dims': MkMsDims,
  'mk-ms-close': MkMsClose,
  'mk-ms-hook': MkMsHook,
  'mk-reg-demag': MkRegDemag,
  'mk-reg-settle': MkRegSettle,
  'mk-reg-beat': MkRegBeat,
  'mk-reg-types': MkRegTypes,
  'mk-reg-positions': MkRegPositions,
  'mk-oil-types': MkOilTypes,
  'mk-oil-amount': MkOilAmount,
  'mk-oil-clean': MkOilClean,
  'mk-crown-types': MkCrownTypes,
  'mk-crown-thread': MkCrownThread,
  'mk-crown-separate': MkCrownSeparate,
  'mk-crown-cut': MkCrownCut,
  'mk-crown-prove': MkCrownProve,
  'mk-true-mount': MkTrueMount,
  'mk-true-pivots': MkTruePivots,
  'mk-true-flat': MkTrueFlat,
  'mk-true-round': MkTrueRound,
  'mk-true-bend': MkTrueBend,
  'mk-true-prove': MkTrueProve,
  'mk-thr-fit': MkThrFit,
  'mk-thr-stuck': MkThrStuck,
  'mk-thr-extract': MkThrExtract,
  'mk-thr-rescue': MkThrRescue,
  'mk-thr-stem': MkThrStem,
  'mk-thr-stop': MkThrStop,
  'mk-key-parts': MkKeyParts,
  'mk-key-symptoms': MkKeySymptoms,
  'mk-key-strip': MkKeyStrip,
  'mk-key-wear': MkKeyWear,
  'mk-key-replace': MkKeyReplace,
  'mk-key-lube': MkKeyLube,
}
