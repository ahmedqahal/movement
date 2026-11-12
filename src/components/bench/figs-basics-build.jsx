// Diagrams for the "Straps, Case & Everyday Care" and "Build Your Own Watch"
// tracks: strap and bracelet work, casebacks, setting, daily care, glass,
// water resistance, and a first watch build from planning to relume.
// Original schematics built on the strap kit. Nothing is traced from an ETA,
// Witschi or other published figure, and every number matches the step text.
import { C, Fig, T, Note, Dim, Arrow, Num, Verdict, Tag, Sep } from '../strap/kit.jsx'

/* ------------------------------------------------------------------ */
/* Palette and defs for this file                                       */
/* ------------------------------------------------------------------ */
const M = {
  gasket: '#e08a55',
  gasketEdge: '#f2b68f',
  nylon: '#e8dfbd',
  plate: '#5b5339',
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
  rubber: '#2e3236',
  rubberHi: '#4a5157',
  nato: '#3f5a4a',
  natoHi: '#5b7a66',
  lume: '#b9f2a0',
  lumeB: '#bfe3f2',
  water: '#7fb6d6',
  salt: '#f1efe8',
  wood: '#c9a46a',
  cloth: '#3d4f5c',
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
      {hatch('bb-cut', '#6f808b', '#a3b3bd')}
      {hatch('bb-mov', '#433c31', '#5e5546')}
      {hatch('bb-bcut', '#7f6a33', '#c6a65c')}
      {hatch('bb-rcut', '#2e3236', '#4a5157')}
      <pattern id="bb-knurl" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#a7b6bf" />
        <line x1="2" y1="0" x2="2" y2="4" stroke="#55646e" strokeWidth="1" />
      </pattern>
      <pattern id="bb-mat" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#34505a" />
        <circle cx="2" cy="2" r="0.8" fill="#46666f" />
        <circle cx="6" cy="6" r="0.8" fill="#46666f" />
      </pattern>
      <pattern id="bb-weave" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill={M.nato} />
        <path d="M0 1.5 H6 M0 4.5 H6" stroke={M.natoHi} strokeWidth="1" />
      </pattern>
      <pattern id="bb-grit" width="9" height="7" patternUnits="userSpaceOnUse">
        <rect width="9" height="7" fill="#5a5148" />
        <circle cx="2" cy="2" r="1" fill="#a39684" />
        <circle cx="6.5" cy="5" r="0.8" fill="#8d8170" />
      </pattern>
      <linearGradient id="bb-acr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(190,225,235,0.55)" />
        <stop offset="1" stopColor="rgba(120,170,190,0.28)" />
      </linearGradient>
      <linearGradient id="bb-rub" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#25292c" />
        <stop offset="0.5" stopColor="#474e54" />
        <stop offset="1" stopColor="#25292c" />
      </linearGradient>
      <radialGradient id="bb-glow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="rgba(185,242,160,0.9)" />
        <stop offset="1" stopColor="rgba(185,242,160,0)" />
      </radialGradient>
      <radialGradient id="bb-glowB" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="rgba(191,227,242,0.9)" />
        <stop offset="1" stopColor="rgba(191,227,242,0)" />
      </radialGradient>
      <radialGradient id="bb-gold" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#f6dc98" />
        <stop offset="0.6" stopColor="#cfa24a" />
        <stop offset="1" stopColor="#7d5f22" />
      </radialGradient>
      <radialGradient id="bb-uv" cx="0.5" cy="0" r="1">
        <stop offset="0" stopColor="rgba(150,110,255,0.45)" />
        <stop offset="1" stopColor="rgba(150,110,255,0.03)" />
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

// Side label: leader runs horizontally to text at (x, y)
const SL = ({ p, x, y, text, sub, c = C.text, s = 10.5 }) => {
  const a = x >= p[0] ? 'start' : 'end'
  return (
    <g>
      <polyline points={`${p[0]},${p[1]} ${x + (a === 'start' ? -6 : 6)},${y - 3.5} ${x + (a === 'start' ? -2 : 2)},${y - 3.5}`} fill="none" stroke={C.struct} strokeWidth="0.8" opacity="0.85" />
      <circle cx={p[0]} cy={p[1]} r="2.2" fill={c} />
      <T x={x} y={y} a={a} s={s} c={c}>
        {text}
      </T>
      {sub && (
        <T x={x} y={y + s + 2} a={a} s={10} c={C.faint}>
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

// A curved turning arrow round (cx, cy). from/to in clock degrees; to > from turns clockwise.
function Turn({ cx, cy, r, from, to, c = 'brass', w = 1.8 }) {
  const [x1, y1] = clk(cx, cy, r, from)
  const [x2, y2] = clk(cx, cy, r, to)
  const sweep = to > from ? 1 : 0
  const large = Math.abs(to - from) > 180 ? 1 : 0
  return <Arrow d={`M${x1} ${y1} A${r} ${r} 0 ${large} ${sweep} ${x2} ${y2}`} c={c} w={w} />
}

// Checklist row: box (ticked or not) and text
const Chk = ({ x, y, text, sub, ok = true, s = 11 }) => (
  <g>
    <rect x={x} y={y - 9} width={11} height={11} rx="2" fill="none" stroke={ok ? C.emerald : C.struct} strokeWidth="1.2" />
    {ok && <path d={`M${x + 2} ${y - 3.5} l3 3 l5 -6`} fill="none" stroke={C.emerald} strokeWidth="1.8" strokeLinecap="round" />}
    <T x={x + 18} y={y} s={s} c={C.text}>
      {text}
    </T>
    {sub && (
      <T x={x + 18} y={y + 13} s={10} c={C.faint}>
        {sub}
      </T>
    )}
  </g>
)

// Flow arrow, short, steel
const Fl = ({ a, b, c = 'steel' }) => <Arrow a={a} b={b} c={c} w={1.5} />

/* ------------------------------------------------------------------ */
/* Watch parts                                                          */
/* ------------------------------------------------------------------ */
// Watch seen from the front. h/m/s: hand angles in clock degrees.
function Face({ cx, cy, r, h = 300, m = 60, s, crown = true, lugs = true, strap, gold, date, ticks = 12, dial = M.dialDark, dateAt = 90, nh }) {
  const hand = (deg, len, wdt, col) => {
    const [x, y] = clk(cx, cy, len, deg)
    return <line x1={cx} y1={cy} x2={x} y2={y} stroke={col} strokeWidth={wdt} strokeLinecap="round" />
  }
  const caseFill = gold ? 'url(#bb-gold)' : 'url(#sk-steel)'
  const [dx, dy] = clk(cx, cy, r * 0.56, dateAt)
  return (
    <g>
      {strap && [-1, 1].map((d) => <rect key={d} x={cx - r * 0.5} y={d < 0 ? cy - r - strap : cy + r * 0.7} width={r} height={strap + r * 0.3} rx="3" fill={typeof strap === 'number' ? 'url(#sk-top)' : 'none'} />)}
      {lugs && [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => (
        <rect key={i} x={cx + a * r * 0.58 - r * 0.1} y={cy + b * r * 0.92 - (b < 0 ? r * 0.2 : 0)} width={r * 0.2} height={r * 0.28} rx="2.5" fill={gold ? '#b08a3c' : '#8c9aa3'} />
      ))}
      {crown && <rect x={cx + r - 1} y={cy - r * 0.13} width={r * 0.2} height={r * 0.26} rx="2" fill={gold ? '#c9a24c' : 'url(#bb-knurl)'} stroke="#55646e" strokeWidth="0.5" />}
      <circle cx={cx} cy={cy} r={r} fill={caseFill} stroke="#55646e" />
      <circle cx={cx} cy={cy} r={r * 0.86} fill={dial} stroke={C.struct} strokeWidth="0.6" />
      {Array.from({ length: ticks }, (_, i) => {
        const [a, b] = clk(cx, cy, r * 0.82, i * (360 / ticks))
        const [c2, d2] = clk(cx, cy, r * (i % 3 === 0 ? 0.68 : 0.73), i * (360 / ticks))
        return <line key={i} x1={a} y1={b} x2={c2} y2={d2} stroke={dial === M.dialDark ? C.dim : '#3a342c'} strokeWidth={i % 3 === 0 ? 1.8 : 1.1} />
      })}
      {date && <rect x={dx - r * 0.1} y={dy - r * 0.1} width={r * 0.2} height={r * 0.2} fill="#f2ede0" stroke={C.struct} strokeWidth="0.5" />}
      {date && typeof date === 'string' && (
        <T x={dx} y={dy + r * 0.07} a="middle" s={Math.max(10, r * 0.16)} c="#222" w={700}>
          {date}
        </T>
      )}
      {!nh && hand(h, r * 0.48, Math.max(2, r * 0.07), C.brassHi)}
      {!nh && hand(m, r * 0.72, Math.max(1.6, r * 0.045), C.brassHi)}
      {s !== undefined && hand(s, r * 0.78, 1, C.ruby)}
      {!nh && <circle cx={cx} cy={cy} r={Math.max(2, r * 0.05)} fill={C.brassHi} />}
    </g>
  )
}

// Watch case in cross-section (side view). Top of crystal at y, width W.
// Returns parts by flag; gaskets drawn orange. Crown on the right.
function CaseSec({ cx, y, W = 220, gk = true, crown = 'in', mov = true, dome = false, back = true, hands = true, bulge = 0, dial = true }) {
  const L = cx - W / 2
  const R = cx + W / 2
  const cw = W * 0.34 // crystal half-width
  const top = y + (dome ? 10 : 0)
  return (
    <g>
      {/* case middle, both sides, cut */}
      {[-1, 1].map((d) => {
        const o = d < 0 ? L : R
        const i = cx + d * cw
        return (
          <path
            key={d}
            d={`M${o} ${top + 10} L${i + d * 6} ${top + 4} L${i} ${top + 4} L${i} ${top + 14} L${cx + d * W * 0.4} ${top + 16} L${cx + d * W * 0.4} ${top + 60} L${o} ${top + 60} Z`}
            fill="url(#bb-cut)"
            stroke="#4e5f6a"
          />
        )
      })}
      {/* crystal */}
      {dome ? (
        <path d={`M${cx - cw} ${top + 14} L${cx - cw} ${top + 6} Q${cx} ${y - 6} ${cx + cw} ${top + 6} L${cx + cw} ${top + 14} Z`} fill="url(#bb-acr)" stroke={M.glass} />
      ) : (
        <rect x={cx - cw} y={top + 4} width={cw * 2} height={8} fill="url(#bb-acr)" stroke={M.glass} />
      )}
      {gk && [-1, 1].map((d) => <rect key={d} x={d < 0 ? cx - cw - 4 : cx + cw} y={top + 4} width={4} height={10} fill={M.gasket} />)}
      {/* dial and hands */}
      {dial && <rect x={cx - W * 0.38} y={top + 26} width={W * 0.76} height={3} fill={M.dial} />}
      {hands && (
        <g stroke={C.brassHi} strokeWidth="1.6">
          <line x1={cx - 2} y1={top + 23} x2={cx + W * 0.2} y2={top + 23} />
          <line x1={cx - 2} y1={top + 20} x2={cx - W * 0.28} y2={top + 20} />
          <line x1={cx} y1={top + 17.5} x2={cx + W * 0.3} y2={top + 17.5} stroke={C.ruby} strokeWidth="1" />
          <line x1={cx} y1={top + 17} x2={cx} y2={top + 29} stroke={C.struct} strokeWidth="2" />
        </g>
      )}
      {/* movement */}
      {mov && <rect x={cx - W * 0.37} y={top + 30} width={W * 0.74} height={24} rx="2" fill="url(#bb-mov)" stroke={C.brass} strokeWidth="0.8" />}
      {/* caseback */}
      {back && (
        <g>
          <path d={`M${L + 12} ${top + 60} L${R - 12} ${top + 60} L${R - 18} ${top + 68} Q${cx} ${top + 74 + bulge} ${L + 18} ${top + 68} Z`} fill="url(#bb-cut)" stroke="#4e5f6a" />
          {gk && [-1, 1].map((d) => <rect key={d} x={d < 0 ? cx - W * 0.4 + 2 : cx + W * 0.4 - 8} y={top + 56} width={6} height={4} fill={M.gasket} />)}
        </g>
      )}
      {/* crown and stem */}
      {crown && (
        <g>
          <rect x={R} y={top + 36} width={crown === 'out' ? 14 : 8} height={10} fill="url(#sk-steelH)" />
          <rect x={cx + W * 0.37 - 2} y={top + 39} width={W * 0.13 + (crown === 'out' ? 16 : 6)} height={4} fill="url(#sk-steelH)" />
          <rect x={R + (crown === 'out' ? 14 : 6)} y={top + 30} width={12} height={22} rx="3" fill="url(#bb-knurl)" stroke={M.steelD} strokeWidth="0.6" />
        </g>
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
      <rect x="-6" y={-len} width="12" height={Math.max(0, len - 30)} rx="2" fill="url(#bb-knurl)" stroke="#55646e" strokeWidth="0.6" />
    </g>
  )
}
// Spring-bar tool, fork end at (0,0)
function SBTool({ len = 120 }) {
  return (
    <g>
      <path d="M-4 0 L-4 -10 L-1.2 -10 L-1.2 -3 L1.2 -3 L1.2 -10 L4 -10 L4 0 L3 -1.5 L3 1 Z" fill="url(#sk-steel)" stroke={M.steelD} strokeWidth="0.5" />
      <path d="M-4 -10 L-3 -34 L3 -34 L4 -10 Z" fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.5" />
      <rect x="-5.5" y={-len} width="11" height={Math.max(0, len - 34)} rx="3" fill="url(#bb-knurl)" stroke={M.steelD} strokeWidth="0.6" />
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
      <rect x="-6" y={-len} width="12" height={Math.max(0, len - 22)} rx="2" fill="url(#bb-knurl)" stroke={M.steelD} strokeWidth="0.6" />
    </g>
  )
}
// Blower bulb, nozzle at (0,0)
function Blower({ k = 1 }) {
  return (
    <g transform={`scale(${k})`}>
      <path d="M-2 0 L2 0 L3 -22 L-3 -22 Z" fill="#2a2a2a" />
      <ellipse cx="0" cy="-46" rx="17" ry="26" fill="#b5404a" stroke="#7a2730" />
      <path d="M-8 -60 Q-4 -66 2 -66" stroke="#e08a90" strokeWidth="2" fill="none" />
    </g>
  )
}
// Pegwood stick, sharpened tip at (0,0)
function Peg({ len = 90 }) {
  return (
    <g>
      <path d={`M0 0 L4 -14 L4 ${-len} L-4 ${-len} L-4 -14 Z`} fill={M.wood} stroke="#8a6a3a" strokeWidth="0.6" />
    </g>
  )
}
// Vernier calliper, outside jaws meeting at x0 (fixed) and x0+gap (moving), jaw tips at y
function Calliper({ x, y, gap, len = 230, inside, read }) {
  const by = inside ? y + 30 : y - 34
  return (
    <g>
      <rect x={x - 18} y={by - 8} width={len} height={16} rx="2" fill="url(#sk-steel)" stroke={M.steelD} strokeWidth="0.6" />
      {Array.from({ length: Math.floor((len - 40) / 6) }, (_, i) => (
        <line key={i} x1={x + 4 + i * 6} y1={by - 8} x2={x + 4 + i * 6} y2={by - (i % 5 === 0 ? 2 : 4)} stroke="#3e4a52" strokeWidth="0.7" />
      ))}
      {/* fixed jaw */}
      <path d={inside ? `M${x - 18} ${by - 8} L${x} ${by - 8} L${x} ${y} L${x - 4} ${y} L${x - 8} ${by - 8}` : `M${x - 18} ${by + 8} L${x} ${by + 8} L${x} ${y} L${x - 6} ${y - 4} L${x - 18} ${by + 8}`} fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.6" />
      {/* moving jaw */}
      <path d={inside ? `M${x + gap} ${by - 8} L${x + gap + 22} ${by - 8} L${x + gap + 22} ${by + 8} L${x + gap + 8} ${by + 8} L${x + gap + 8} ${by - 8} L${x + gap} ${y} L${x + gap + 4} ${y}` : `M${x + gap} ${y} L${x + gap + 6} ${y - 4} L${x + gap + 26} ${by + 8} L${x + gap + 26} ${by - 10} L${x + gap} ${by - 10} Z`} fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.6" />
      {read && (
        <g>
          <rect x={x + gap + 32} y={by - 7} width={46} height={14} rx="2" fill="#1b2a22" stroke={C.struct} strokeWidth="0.6" />
          <T x={x + gap + 55} y={by + 4} a="middle" s={10} c="#9fe0a8" mono>
            {read}
          </T>
        </g>
      )}
    </g>
  )
}

/* ================================================================== */
/* basics-strap · swap a strap with a spring-bar tool                    */
/* ================================================================== */

// Lugs and bar seen from the back, watch face-down, lugs toward you.
// x0..x1 inner faces of the lugs, bar at y.
function LugPair({ x0, x1, y, lugW = 26, top = 40, bot = 70, holes = true }) {
  return (
    <g>
      {[x0 - lugW, x1].map((x, i) => (
        <path key={i} d={`M${x} ${y - top} L${x + lugW} ${y - top} L${x + lugW} ${y + bot - 10} Q${x + lugW} ${y + bot} ${x + lugW - 10} ${y + bot} L${x + 10} ${y + bot} Q${x} ${y + bot} ${x} ${y + bot - 10} Z`} fill="url(#sk-steel)" stroke={M.steelD} />
      ))}
      {holes && [x0, x1].map((x, i) => <rect key={i} x={i ? x : x - 7} y={y - 4} width={7} height={8} fill={M.ink} />)}
    </g>
  )
}
// Spring bar in plan: tube x0..x1, pins extend `pin` beyond; shoulders at both ends
function Bar({ x0, x1, y, pinL = 7, pinR = 7, r = 4 }) {
  return (
    <g>
      <rect x={x0 - pinL} y={y - 1.8} width={pinL + 4} height={3.6} rx="1.5" fill="url(#sk-steelH)" />
      <rect x={x1 - 4} y={y - 1.8} width={pinR + 4} height={3.6} rx="1.5" fill="url(#sk-steelH)" />
      <rect x={x0} y={y - r} width={x1 - x0} height={r * 2} rx={r} fill="url(#sk-steel)" stroke={M.steelD} strokeWidth="0.6" />
      <rect x={x0 + 4} y={y - r - 1} width={3} height={r * 2 + 2} rx="1" fill="#9fb0bb" stroke={M.steelD} strokeWidth="0.5" />
      <rect x={x1 - 7} y={y - r - 1} width={3} height={r * 2 + 2} rx="1" fill="#9fb0bb" stroke={M.steelD} strokeWidth="0.5" />
    </g>
  )
}

function BbFaceDown() {
  return (
    <F h={316} view="Side view · watch face-down on a soft surface" scale="schematic">
      <Pn x={12} y={26} w={290} h={176} t="On a cloth or mat" tc={C.emerald} c={C.emerald} ok />
      {/* mat */}
      <rect x={24} y={152} width={266} height={16} rx="3" fill="url(#bb-mat)" />
      {/* watch upside down: crystal down */}
      <path d="M118 152 Q160 142 202 152 Z" fill="url(#bb-acr)" stroke={M.glass} />
      <rect x={108} y={120} width={104} height={30} rx="8" fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={118} y={110} width={84} height={12} rx="4" fill="url(#sk-steel)" stroke={M.steelD} />
      {/* lugs and strap, curving down to the mat */}
      <path d="M108 130 L84 134 L84 144 L108 142 Z" fill="url(#sk-steel)" />
      <path d="M212 130 L236 134 L236 144 L212 142 Z" fill="url(#sk-steel)" />
      <path d="M84 136 Q56 140 40 150 L44 152 Q60 146 84 144 Z" fill="url(#sk-top)" />
      <path d="M236 136 Q264 140 280 150 L276 152 Q260 146 236 144 Z" fill="url(#sk-top)" />
      <circle cx={160} cy={135} r={4} fill="url(#bb-knurl)" stroke={M.steelD} strokeWidth="0.5" />
      <Lab p={[160, 112]} x={160} y={60} text="caseback up" up />
      <Lab p={[132, 150]} x={40} y={100} text="crystal rests on the cloth" up a="start" />
      <Lab p={[254, 160]} x={250} y={192} text="cloth or watchmaker’s mat" a="end" />
      <Lab p={[94, 139]} x={244} y={110} text="lug" up />

      <Pn x={312} y={26} w={156} h={176} t="Lugs toward you" />
      <circle cx={390} cy={92} r={34} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={390} cy={92} r={24} fill="none" stroke={M.steelD} strokeWidth="0.8" strokeDasharray="2 2" />
      {[-1, 1].map((d) => (
        <rect key={d} x={390 + d * 22 - 5} y={118} width={10} height={24} rx="3" fill="url(#sk-steel)" stroke={M.steelD} />
      ))}
      <rect x={376} y={130} width={28} height={6} rx="3" fill="url(#sk-steelH)" />
      <rect x={426} y={86} width={8} height={12} rx="2" fill="url(#bb-knurl)" />
      <T x={390} y={96} a="middle" s={10} c={C.ground}>back</T>
      <Arrow a={[390, 150]} b={[390, 172]} c="brass" w={2} />
      <T x={390} y={190} a="middle" s={11} c={C.brassHi} w={600}>YOU</T>
      <T x={326} y={160} s={10} c={C.faint}>bar end</T>
      <T x={326} y={172} s={10} c={C.faint}>facing you</T>

      <Pn x={12} y={212} w={456} h={92} t="Not on a bare bench" tc={C.ruby} c={C.ruby} ok={false} />
      <rect x={30} y={268} width={180} height={12} fill="url(#bb-grit)" />
      <path d="M86 268 Q120 258 154 268 Z" fill="url(#bb-acr)" stroke={M.glass} />
      <rect x={78} y={242} width={84} height={24} rx="7" fill="url(#sk-steel)" stroke={M.steelD} />
      <path d="M104 266 L116 262 M126 266 L136 261" stroke="#ffffff" strokeWidth="1.4" />
      <Note x={230} y={248} lines={['Grit on a hard top scratches the crystal', 'and the case. A slipped tool has nowhere', 'soft to land.']} c={C.text} s={11} lh={15} />
    </F>
  )
}

function BbCompress() {
  const y = 132
  return (
    <F h={326} view="Plan · underside between the lugs" scale="schematic, magnified">
      <LugPair x0={70} x1={410} y={y} lugW={44} top={58} bot={64} />
      <Bar x0={74} x1={406} y={y} pinL={7} pinR={10} />
      {/* strap end wraps the bar: bar hidden under it */}
      <rect x={104} y={y - 14} width={272} height={70} rx="3" fill="url(#sk-top)" />
      <line x1={104} y1={y} x2={376} y2={y} stroke={C.steel} strokeDasharray="5 3" strokeWidth="1" />
      <path d="M104 186 L376 186" stroke="none" />
      {/* fork at the right shoulder */}
      <G x={399} y={y - 6} ang={-25}>
        <SBTool len={96} />
      </G>
      <Arrow a={[392, y - 34]} b={[350, y - 34]} c="brass" w={2.4} />
      <T x={346} y={y - 30} a="end" s={11.5} c={C.brassHi}>push toward the centre</T>

      {/* inset: section at the lug, fork astride the pin, pin clear of the hole */}
      <Ring x={92} y={250} r={58} />
      <rect x={40} y={222} width={36} height={56} fill="url(#bb-cut)" stroke="#4e5f6a" />
      <rect x={62} y={244} width={14} height={12} fill={M.ink} />
      <rect x={80} y={246} width={34} height={8} rx="2" fill="url(#sk-steelH)" />
      <rect x={114} y={239} width={9} height={22} rx="2" fill="#9fb0bb" stroke={M.steelD} />
      <rect x={123} y={241} width={26} height={18} fill="url(#sk-steel)" />
      <path d="M113 241 L96 241 L96 259 L113 259 M96 250 L76 214" fill="none" stroke={C.brassHi} strokeWidth="2.4" strokeLinecap="round" />
      <Arrow a={[98, 274]} b={[124, 274]} c="brass" w={1.8} />
      <line x1={77} y1={232} x2={77} y2={268} stroke={C.ruby} strokeDasharray="2 2" />
      <SL p={[82, 250]} x={164} y={212} text="pin tip clear of the lug hole" />
      <SL p={[110, 241]} x={164} y={232} text="fork astride the pin," sub="tips on the shoulder" />

      <Lab p={[90, y - 40]} x={90} y={42} text="lug" up />
      <Lab p={[240, y]} x={240} y={42} text="spring bar inside the strap end" up />
      <Lab p={[402, y]} x={440} y={206} text="shoulder" />
      <Sep x1={164} y1={262} x2={468} y2={262} />
      <Num x={176} y={282} n={1} r={8} />
      <Note x={190} y={286} lines={['Fork against the shoulder']} c={C.text} s={10.5} />
      <Num x={330} y={282} n={2} r={8} />
      <Note x={344} y={286} lines={['Compress inward']} c={C.text} s={10.5} />
      <Num x={176} y={306} n={3} r={8} />
      <Note x={190} y={310} lines={['The strap end pops free of the lug']} c={C.text} s={10.5} />
    </F>
  )
}

function BbFitStrap() {
  const Panel = ({ x, n, title, stage }) => {
    const y = 108
    const x0 = x + 26
    const x1 = x + 120
    return (
      <g>
        <Pn x={x} y={26} w={146} h={196} />
        <Num x={x + 16} y={42} n={n} r={8} />
        <T x={x + 30} y={46} s={10.5} c={C.text}>
          {title}
        </T>
        <LugPair x0={x0} x1={x1} y={y} lugW={16} top={36} bot={40} />
        {stage >= 2 && <rect x={x0 + 6} y={y - 10} width={x1 - x0 - 12} height={80} fill="url(#sk-top)" opacity={stage === 2 ? 0.85 : 1} />}
        {stage === 1 && <Bar x0={x0 + 2} x1={x1 - 14} y={y + 8} pinL={9} pinR={6} r={3.5} />}
        {stage === 1 && <Arrow a={[x0 + 40, y + 30]} b={[x0 + 12, y + 16]} c="brass" w={1.8} />}
        {stage === 2 && <Bar x0={x0 + 2} x1={x1 - 14} y={y + 4} pinL={7} pinR={6} r={3.5} />}
        {stage === 3 && <Bar x0={x0 + 2} x1={x1 - 4} y={y} pinL={7} pinR={-2} r={3.5} />}
        {stage === 3 && (
          <G x={x1 - 8} y={y - 4} ang={-20}>
            <SBTool len={56} />
          </G>
        )}
        {stage === 3 && <Arrow a={[x1 - 14, y + 18]} b={[x1 - 34, y + 18]} c="brass" w={1.8} />}
        {stage === 4 && <Bar x0={x0 + 2} x1={x1 - 2} y={y} pinL={7} pinR={7} r={3.5} />}
        {stage === 4 && <Arrow a={[x1 - 10, y + 22]} b={[x1 + 2, y + 22]} c="emerald" w={1.8} />}
        {stage === 4 && (
          <T x={x1 + 4} y={y - 14} a="end" s={10.5} c={C.emerald} w={600}>
            click
          </T>
        )}
      </g>
    )
  }
  return (
    <F h={318} view="Sequence · fit the new strap" scale="schematic">
      <Panel x={12} n={1} title="One tip in" stage={1} />
      <Panel x={167} n={2} title="Seat the strap" stage={2} />
      <Panel x={322} n={3} title="Compress the other" stage={3} />
      <T x={84} y={196} a="middle" s={10.5} c={C.dim}>into its lug hole</T>
      <T x={240} y={196} a="middle" s={10.5} c={C.dim}>strap square between lugs</T>
      <T x={395} y={196} a="middle" s={10.5} c={C.dim}>fork on the free shoulder</T>
      <T x={84} y={210} a="middle" s={10} c={C.faint}>bar threaded through strap</T>
      <T x={395} y={210} a="middle" s={10} c={C.faint}>slide it in line with the hole</T>
      <Pn x={12} y={232} w={300} h={74} t="4 · Let it click home" tc={C.emerald} />
      <Note x={24} y={268} lines={['Release the fork over the hole: the pin snaps in.', 'Then tug the strap: it must not move out.']} c={C.text} s={11} lh={15} />
      <rect x={322} y={232} width={146} height={74} rx="8" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <LugPair x0={346} x1={444} y={268} lugW={14} top={24} bot={24} />
      <rect x={352} y={262} width={86} height={34} fill="url(#sk-top)" />
      <Bar x0={348} x1={442} y={268} pinL={6} pinR={6} r={3.5} />
      <Arrow a={[395, 294]} b={[395, 306]} c="emerald" w={1.6} />
      <Verdict x={454} y={246} ok r={7} />
    </F>
  )
}

function BbBarCheck() {
  const BarS = ({ x, y, bend, worn, label, ok }) => (
    <g>
      <path d={bend ? `M${x} ${y} Q${x + 60} ${y - 10} ${x + 120} ${y}` : `M${x} ${y} L${x + 120} ${y}`} stroke="url(#sk-steelH)" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d={bend ? `M${x} ${y} Q${x + 60} ${y - 10} ${x + 120} ${y}` : `M${x} ${y} L${x + 120} ${y}`} stroke={M.steelD} strokeWidth="0.6" fill="none" />
      <rect x={x - 9} y={y - 2} width={10} height={4} rx="1.5" fill="#b9c7d0" />
      {worn ? <path d={`M${x + 119} ${y - 2} L${x + 126} ${y - 0.5} L${x + 124} ${y + 2} L${x + 119} ${y + 2} Z`} fill="#8c9aa3" /> : <rect x={x + 119} y={y - 2} width={10} height={4} rx="1.5" fill="#b9c7d0" />}
      <T x={x + 60} y={y + 22} a="middle" s={10.5} c={ok ? C.emerald : C.ruby}>
        {label}
      </T>
      <Verdict x={x + 146} y={y} ok={ok} r={7} />
    </g>
  )
  return (
    <F h={330} view="Inspection · each bar before reuse" scale="schematic">
      <Pn x={12} y={26} w={226} h={186} t="Under the loupe" />
      <BarS x={34} y={62} label="straight, clean tips" ok />
      <BarS x={34} y={106} bend label="bent" />
      <BarS x={34} y={150} worn label="worn tip" />
      <T x={125} y={198} a="middle" s={10.5} c={C.dim}>bent, worn or weak: replace it</T>

      <Pn x={248} y={26} w={220} h={186} t="Fingernail test" />
      <rect x={278} y={102} width={140} height={14} rx="7" fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={410} y={106} width={14} height={6} rx="2" fill="#b9c7d0" />
      <rect x={264} y={106} width={16} height={6} rx="2" fill="#b9c7d0" />
      <path d="M440 84 Q452 96 446 118 L432 118 Q426 98 440 84 Z" fill="#d8b49a" stroke="#9b7760" />
      <path d="M432 112 Q436 106 442 106" stroke="#f3e1d4" strokeWidth="2" fill="none" />
      <Arrow a={[432, 92]} b={[420, 92]} c="brass" w={1.8} />
      <T x={352} y={78} a="middle" s={10.5} c={C.text}>press each tip in</T>
      <Arrow a={[420, 132]} b={[432, 132]} c="emerald" w={1.8} />
      <T x={352} y={150} a="middle" s={10.5} c={C.text}>it should slide in and</T>
      <T x={352} y={164} a="middle" s={10.5} c={C.text}>spring back smoothly</T>
      <T x={352} y={190} a="middle" s={10.5} c={C.ruby}>sticky or weak: replace it</T>

      <Pn x={12} y={222} w={456} h={96} t="A replacement must match" />
      <rect x={34} y={258} width={20} height={40} fill="url(#sk-steel)" />
      <rect x={156} y={258} width={20} height={40} fill="url(#sk-steel)" />
      <rect x={58} y={272} width={94} height={10} rx="5" fill="url(#sk-steel)" stroke={M.steelD} />
      <Dim a={[54, 300]} b={[156, 300]} off={0} text="lug width" />
      <Dim a={[64, 270]} b={[64, 284]} off={-12} text="" />
      <T x={40} y={252} s={10} c={C.faint}>bar diameter</T>
      <Note x={196} y={256} lines={['Both must match the old bar.', 'A new bar rattles in the lug holes', 'or won’t seat? It’s the wrong one.', 'Swap it. Don’t force it.']} c={C.text} s={11} lh={14} />
      <T x={458} y={312} a="end" s={10} c={C.ruby}>a failed bar drops the watch</T>
    </F>
  )
}

/* ================================================================== */
/* basics-strap-types · choosing and caring for straps                   */
/* ================================================================== */

function BbLeather() {
  return (
    <F h={300} view="Comparison · leather strap care" scale="schematic">
      <Pn x={12} y={26} w={226} h={196} t="Kept dry, rested" tc={C.emerald} c={C.emerald} ok />
      <rect x={40} y={56} width={44} height={150} rx="6" fill="url(#sk-top)" stroke={C.topDark} />
      <path d="M40 56 h44" stroke={C.topEdge} />
      {[80, 104, 128].map((y) => <circle key={y} cx={62} cy={y + 50} r={3} fill={C.hole} />)}
      <path d="M46 62 L46 200 M78 62 L78 200" stroke={C.thread} strokeDasharray="3 2" strokeWidth="1" />
      <Note x={100} y={72} lines={['comfortable and smart', 'let it breathe', 'between wears', 'lasts years']} c={C.text} s={11} lh={16} />
      <T x={100} y={160} s={10} c={C.faint}>supple, even colour,</T>
      <T x={100} y={173} s={10} c={C.faint}>holes still round</T>

      <Pn x={248} y={26} w={220} h={196} t="Sweat and water" tc={C.ruby} c={C.ruby} ok={false} />
      <rect x={276} y={56} width={44} height={150} rx="6" fill="#6f4b27" stroke={C.topDark} />
      <path d="M282 74 l8 4 l-4 6 M300 120 l10 3 l-6 7 M286 160 l12 2" stroke="#2c1d0f" strokeWidth="1.4" fill="none" />
      <ellipse cx={298} cy={100} rx={14} ry={8} fill="rgba(30,20,10,0.5)" />
      {[[330, 70], [336, 90], [328, 112]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} q4 6 0 9 q-4 -3 0 -9`} fill={M.water} />
      ))}
      <Note x={344} y={72} lines={['darkens and stains', 'cracks at the bends', 'sweat and water', 'ruin it']} c={C.text} s={11} lh={16} />
      <T x={344} y={160} s={10} c={C.faint}>no swimming,</T>
      <T x={344} y={173} s={10} c={C.faint}>no showers</T>

      <Tag x={12} y={244}>Routine</Tag>
      {['Take it off before water', 'Let it air dry, away from heat', 'Rest it between wears'].map((l, i) => (
        <g key={i}>
          <Num x={24 + i * 152} y={268} n={i + 1} r={8} />
          <T x={38 + i * 152} y={272} s={10.5} c={C.text}>
            {l.split(',')[0]}
          </T>
          {l.includes(',') && (
            <T x={38 + i * 152} y={286} s={10} c={C.faint}>
              {l.split(', ')[1]}
            </T>
          )}
        </g>
      ))}
    </F>
  )
}

function BbRubber() {
  return (
    <F h={300} view="Plan · rubber or silicone strap" scale="schematic">
      <rect x={54} y={40} width={50} height={210} rx="10" fill="url(#bb-rub)" stroke="#16191b" />
      {[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={79} cy={140 + i * 22} rx={4} ry={3} fill="#0d0f10" />)}
      {[[64, 60], [92, 76], [70, 104], [94, 122], [66, 86]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y} rx={4.5} ry={3.5} fill="rgba(127,182,214,0.65)" stroke={M.water} strokeWidth="0.6" />
          <circle cx={x - 1.5} cy={y - 1.2} r={1} fill="#ffffff" opacity="0.8" />
        </g>
      ))}
      <Lab p={[92, 76]} x={150} y={58} text="water beads off" a="start" up />
      <Lab p={[79, 162]} x={114} y={176} text="waterproof and durable" a="start" />
      <T x={24} y={272} s={10.5} c={C.text}>ideal for swimming and sport</T>

      <Pn x={256} y={26} w={212} h={110} t="Wipe clean" tc={C.emerald} />
      <rect x={290} y={56} width={30} height={70} rx="7" fill="url(#bb-rub)" />
      <path d="M306 74 q34 -6 56 10 q-8 18 -40 22 q-24 -6 -16 -32 Z" fill={M.cloth} stroke="#5f7686" />
      <Arrow d="M360 66 Q392 80 380 108" c="brass" w={1.8} />
      <Note x={392} y={64} lines={['damp cloth,', 'then dry']} c={C.text} s={10.5} lh={14} />

      <Pn x={256} y={146} w={212} h={140} t="Cheaper rubber" tc={C.ruby} />
      <Ring x={312} y={216} r={44} />
      <rect x={292} y={178} width={40} height={76} rx="8" fill="url(#bb-rub)" />
      {Array.from({ length: 26 }, (_, i) => (
        <circle key={i} cx={296 + ((i * 37) % 33)} cy={184 + ((i * 53) % 66)} r={i % 3 ? 0.9 : 1.4} fill="#cfc6b6" />
      ))}
      <Note x={366} y={200} lines={['attracts dust', 'and lint', 'that clings']} c={C.text} s={10.5} lh={14} />
    </F>
  )
}

function BbNato() {
  const Wrist = ({ y }) => <path d={`M30 ${y} Q120 ${y + 30} 210 ${y}`} fill="none" stroke="#c99b7d" strokeWidth="14" opacity="0.35" />
  const Side = ({ x, failed }) => (
    <g transform={`translate(${x} 0)`}>
      {/* case side */}
      <rect x={70} y={78} width={100} height={26} rx="8" fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={80} y={72} width={80} height={8} rx="2" fill="url(#bb-acr)" />
      <rect x={54} y={92} width={18} height={10} fill="url(#sk-steel)" />
      <rect x={168} y={92} width={18} height={10} fill="url(#sk-steel)" />
      {/* bars */}
      <circle cx={62} cy={102} r={3.4} fill={failed ? 'none' : 'url(#sk-barEnd)'} stroke={failed ? C.ruby : M.steelD} strokeDasharray={failed ? '2 2' : undefined} />
      <circle cx={178} cy={102} r={3.4} fill="url(#sk-barEnd)" stroke={M.steelD} />
      {/* one strap passing under the case and through both bars */}
      <path d={`M14 ${failed ? 132 : 128} Q40 118 ${failed ? 58 : 60} ${failed ? 110 : 106} L${failed ? 66 : 66} 108 L174 108 L180 106 Q200 118 226 128`} fill="none" stroke="url(#bb-weave)" strokeWidth="7" />
      <path d={`M14 ${failed ? 132 : 128} Q40 118 60 108 L180 108 Q200 118 226 128`} fill="none" stroke={M.natoHi} strokeWidth="0.6" />
      {failed && <Arrow a={[62, 96]} b={[58, 76]} c="ruby" w={1.4} />}
    </g>
  )
  return (
    <F h={312} view="Side view · single-piece pass-through strap" scale="schematic">
      <Pn x={12} y={26} w={226} h={176} t="Both bars in" />
      <Side x={0} />
      <Wrist y={150} />
      <Lab p={[120, 108]} x={120} y={193} text="one strap runs under the case" />
      <Lab p={[178, 102]} x={210} y={60} text="spring bar" up />

      <Pn x={242} y={26} w={226} h={176} t="One bar fails" tc={C.emerald} ok />
      <Side x={230} failed />
      <Wrist y={150} />
      <T x={355} y={176} a="middle" s={10.5} c={C.text}>the other bar still holds</T>
      <T x={355} y={190} a="middle" s={10.5} c={C.text}>the watch on the strap</T>
      <Lab p={[292, 100]} x={290} y={56} text="lost bar" up c={C.ruby} />

      <Pn x={12} y={212} w={226} h={88} t="Two-piece, same failure" tc={C.ruby} ok={false} />
      <Note x={24} y={250} lines={['That half drops off and', 'the watch can fall.']} c={C.text} s={11} lh={15} />
      <Pn x={242} y={212} w={226} h={88} t="Also" />
      <Note x={254} y={250} lines={['Cheap, ideal for beaters.', 'Take it off and wash it.']} c={C.text} s={11} lh={15} />
    </F>
  )
}

function BbBraceletCare() {
  const links = (x, y, n, w = 34, h = 20) =>
    Array.from({ length: n }, (_, i) => (
      <g key={i}>
        <rect x={x} y={y + i * (h + 2)} width={w} height={h} rx="3" fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.6" />
        <rect x={x + w * 0.3} y={y + i * (h + 2)} width={w * 0.4} height={h} fill="url(#sk-steel)" opacity="0.7" />
      </g>
    ))
  return (
    <F h={300} view="Plan · metal bracelet, sizing and rinsing" scale="schematic">
      <Pn x={12} y={26} w={210} h={262} t="Tough, but sized to fit" />
      {links(62, 46, 4)}
      <rect x={56} y={136} width={46} height={40} rx="5" fill="url(#sk-steel)" stroke={M.steelD} />
      <path d="M62 146 h34 M62 166 h34" stroke={M.steelD} />
      {links(62, 182, 4)}
      <Lab p={[96, 156]} x={140} y={142} text="clasp" a="start" up />
      <Lab p={[96, 80]} x={136} y={72} text="removable links" a="start" up />
      <T x={136} y={88} s={10} c={C.faint}>sizing: next lesson</T>
      <T x={116} y={282} a="middle" s={10.5} c={C.dim}>resizable, durable, timeless</T>

      <Pn x={232} y={26} w={236} h={262} t="Rinse after sweat or salt" />
      {/* tap */}
      <path d="M300 46 L380 46 L380 58 L314 58 L314 70 L300 70 Z" fill="url(#sk-steel)" stroke={M.steelD} />
      <path d="M302 72 L312 72 L316 150 L298 150 Z" fill="rgba(127,182,214,0.35)" />
      {links(290, 120, 3, 34, 18)}
      {[[284, 150], [330, 140], [326, 170]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} q3 5 0 7 q-3 -2 0 -7`} fill={M.water} />
      ))}
      <Note x={344} y={92} lines={['fresh water', 'into the links', 'and clasp']} c={C.text} s={10.5} lh={14} />
      <Ring x={300} y={226} r={38} />
      <rect x={272} y={212} width={56} height={28} rx="3" fill="url(#sk-steelH)" />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={278 + i * 8} y={234} width={3} height={3} fill={M.salt} />)}
      <Note x={348} y={214} lines={['salt and sweat', 'dull the finish', 'and stiffen', 'the clasp']} c={C.text} s={10.5} lh={14} />
      <T x={350} y={278} a="middle" s={10.5} c={C.dim}>then dry with a cloth</T>
    </F>
  )
}

function BbMeasure() {
  return (
    <F h={330} view="Measurement · lug width and strap length" scale="schematic">
      <Pn x={12} y={26} w={456} h={130} t="Width: inside face to inside face" />
      {/* lugs from the back */}
      <rect x={130} y={58} width={34} height={70} rx="5" fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={260} y={58} width={34} height={70} rx="5" fill="url(#sk-steel)" stroke={M.steelD} />
      {/* calliper outside jaws used as inside? use jaw tips touching inner faces */}
      <rect x={110} y={52} width={240} height={10} rx="2" fill="url(#sk-steel)" stroke={M.steelD} strokeWidth="0.6" />
      {Array.from({ length: 36 }, (_, i) => <line key={i} x1={116 + i * 6.4} y1={52} x2={116 + i * 6.4} y2={i % 5 ? 56 : 59} stroke="#3e4a52" strokeWidth="0.7" />)}
      <path d="M164 62 L164 100 L170 100 L170 62 Z" fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.6" />
      <path d="M260 62 L260 100 L254 100 L254 62 Z" fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.6" />
      <Dim a={[164, 116]} b={[260, 116]} off={0} text="lug gap" />
      <T x={212} y={146} a="middle" s={10.5} c={C.dim}>calliper jaws on the inner faces</T>
      <rect x={334} y={84} width={96} height={44} rx="3" fill="url(#sk-top)" />
      <Dim a={[334, 80]} b={[430, 80]} off={0} text="old strap at lug end" />
      <T x={382} y={142} a="middle" s={10.5} c={C.dim}>cross-check only</T>
      <T x={24} y={90} s={10.5} c={C.brassHi}>disagree?</T>
      <T x={24} y={104} s={10.5} c={C.brassHi}>trust the gap</T>

      <Pn x={12} y={166} w={456} h={110} t="Length: to the hole you use" />
      <rect x={30} y={206} width={340} height={26} rx="10" fill="url(#sk-top)" />
      {[170, 196, 222, 248, 274].map((x) => <circle key={x} cx={x} cy={219} r={3.4} fill={C.hole} />)}
      <circle cx={222} cy={219} r={6} fill="none" stroke={C.brassHi} strokeWidth="1.4" />
      <Dim a={[30, 244]} b={[222, 244]} off={0} text="measure this" c={C.emerald} />
      <Dim a={[30, 201]} b={[370, 201]} off={0} text="not overall: old straps stretch" c={C.ruby} />
      <T x={236} y={248} s={10} c={C.faint}>worn hole</T>

      <rect x={316} y={286} width={152} height={36} rx="3" fill="#e9e1c6" />
      <T x={326} y={301} s={10.5} c="#2a241c">width: ____ mm</T>
      <T x={326} y={315} s={10.5} c="#2a241c">length: ____ mm</T>
      <T x={24} y={308} s={11} c={C.text}>Write both numbers down before you shop.</T>
    </F>
  )
}

function BbStrapInspect() {
  const Cell = ({ x, y, t, children }) => (
    <g>
      <Pn x={x} y={y} w={108} h={150} ok={false} />
      {children}
      <T x={x + 54} y={y + 140} a="middle" s={10.5} c={C.text}>
        {t}
      </T>
    </g>
  )
  return (
    <F h={326} view="Inspection · signs a strap is about to fail" scale="schematic">
      <Cell x={12} y={26} t="cracks">
        <path d="M34 120 Q66 60 98 120" fill="none" stroke="url(#sk-top)" strokeWidth="20" />
        <path d="M54 84 l6 4 l-4 4 M66 74 l3 6 M78 82 l-4 6" stroke="#2c1d0f" strokeWidth="1.4" fill="none" />
        <Arrow a={[40, 60]} b={[52, 82]} c="brass" w={1.4} />
        <T x={24} y={52} s={10} c={C.faint}>bend gently</T>
      </Cell>
      <Cell x={128} y={26} t="loose stitching">
        <rect x={160} y={50} width={44} height={86} rx="4" fill="url(#sk-top)" />
        <path d="M166 54 L166 96" stroke={C.thread} strokeDasharray="3 2" />
        <path d="M166 100 q6 8 -2 16 q-6 6 2 14" stroke={C.thread} fill="none" />
        <path d="M198 54 L198 132" stroke={C.thread} strokeDasharray="3 2" />
      </Cell>
      <Cell x={244} y={26} t="hole now a slot">
        <rect x={276} y={50} width={44} height={86} rx="4" fill="url(#sk-top)" />
        <circle cx={298} cy={66} r={3.4} fill={C.hole} />
        <rect x={294.6} y={84} width={7} height={18} rx="3.5" fill={C.hole} />
        <circle cx={298} cy={120} r={3.4} fill={C.hole} />
        <Arrow a={[332, 93]} b={[306, 93]} c="ruby" w={1.4} />
      </Cell>
      <Cell x={360} y={26} t="rubber: split at lug">
        <rect x={384} y={54} width={60} height={14} fill="url(#sk-steel)" />
        <rect x={392} y={66} width={44} height={70} rx="6" fill="url(#bb-rub)" />
        <path d="M402 70 l6 10 l-3 6 l7 8" stroke={C.ruby} strokeWidth="1.6" fill="none" />
      </Cell>
      <Sep x1={12} y1={188} x2={468} y2={188} />
      <Tag x={12} y={208}>Where to bend it</Tag>
      <rect x={30} y={226} width={300} height={22} rx="8" fill="url(#sk-top)" />
      <rect x={18} y={222} width={14} height={30} rx="3" fill="url(#sk-steel)" />
      {[200, 224, 248, 272].map((x) => <circle key={x} cx={x} cy={237} r={3} fill={C.hole} />)}
      <Arrow a={[50, 268]} b={[50, 252]} c="brass" w={1.6} />
      <Arrow a={[236, 268]} b={[236, 252]} c="brass" w={1.6} />
      <T x={50} y={284} a="middle" s={10.5} c={C.dim}>lug end</T>
      <T x={236} y={284} a="middle" s={10.5} c={C.dim}>around the buckle holes</T>
      <Note x={346} y={226} lines={['Any one of these:', 'replace it now.', 'A strap costs far', 'less than a', 'dropped watch.']} c={C.text} s={10.5} lh={14} />
    </F>
  )
}

/* ================================================================== */
/* basics-bracelet · resize a metal bracelet                             */
/* ================================================================== */

// A row of links seen from the back (plan), pins across. arrow: index of links carrying an arrow.
function LinkRow({ x, y, n, w = 44, h = 34, arrows = [], gapAt = -1, gap = 0, proud = -1 }) {
  let cx = x
  const out = []
  for (let i = 0; i < n; i++) {
    if (i === gapAt) cx += gap
    out.push(
      <g key={i}>
        <rect x={cx} y={y} width={w} height={h} rx="4" fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.7" />
        <rect x={cx + w * 0.32} y={y} width={w * 0.36} height={h} fill="url(#sk-steel)" opacity="0.6" />
        <line x1={cx + w - 4} y1={y - (i === proud ? 7 : 1)} x2={cx + w - 4} y2={y + h + 1} stroke="#2c353b" strokeWidth="2.2" />
        {arrows.includes(i) && <path d={`M${cx + w / 2} ${y + 8} L${cx + w / 2} ${y + h - 10} M${cx + w / 2 - 4} ${y + h - 15} L${cx + w / 2} ${y + h - 9} L${cx + w / 2 + 4} ${y + h - 15}`} stroke={C.ruby} strokeWidth="1.4" fill="none" />}
      </g>
    )
    cx += w + 2
  }
  return <g>{out}</g>
}

function BbPinPush() {
  return (
    <F h={326} view="Side view · pin-pusher tool" scale="schematic">
      {/* frame */}
      <path d="M60 60 L230 60 L230 76 L84 76 L84 250 L230 250 L230 266 L60 266 Z" fill="url(#bb-cut)" stroke="#4e5f6a" />
      {/* screw and handle */}
      <rect x={150} y={36} width={46} height={10} rx="3" fill="url(#bb-knurl)" />
      <rect x={168} y={46} width={10} height={14} fill="url(#sk-steelH)" />
      <rect x={168} y={60} width={10} height={70} fill="url(#bb-knurl)" />
      <rect x={171.5} y={130} width={3} height={28} fill="#d6dee3" />
      <Arrow d="M140 52 Q140 32 164 30" c="brass" w={1.8} />
      {/* anvil with slot */}
      <path d="M128 222 L166 222 L166 250 L128 250 Z M180 222 L218 222 L218 250 L180 250 Z" fill="url(#sk-steel)" stroke={M.steelD} />
      {/* link in section on the anvil */}
      <rect x={118} y={180} width={110} height={30} rx="5" fill="url(#sk-steelH)" stroke={M.steelD} />
      <rect x={118} y={210} width={110} height={10} fill="none" />
      <rect x={171.5} y={158} width={3} height={22} fill="#2c353b" />
      <rect x={171.5} y={180} width={3} height={52} fill="#e7d2a0" stroke={C.brass} strokeWidth="0.4" />
      <Arrow a={[200, 238]} b={[200, 270]} c="brass" w={2} />
      <T x={206} y={286} s={10.5} c={C.brassHi}>pin drops out through the slot</T>

      <Lab p={[196, 41]} x={300} y={50} text="turn the screw" a="start" />
      <Lab p={[173, 150]} x={300} y={110} text="pusher point" sub="aligned with the pin" a="start" />
      <Lab p={[220, 192]} x={300} y={170} text="link held on the block" a="start" />
      <Lab p={[174, 226]} x={300} y={226} text="pin, driven out" sub="in the arrow direction" a="start" />

      <T x={14} y={312} s={10.5} c={C.dim}>In a link-holding block instead: align a pin punch and tap the pin out gently.</T>
    </F>
  )
}

function BbRejoin() {
  return (
    <F h={316} view="Plan · take out a link and rejoin" scale="schematic">
      <Tag x={12} y={40}>1 · Separate the freed link</Tag>
      <LinkRow x={24} y={52} n={6} arrows={[2, 3]} gapAt={3} gap={0} />
      <rect x={166} y={46} width={46} height={46} rx="6" fill="none" stroke={C.brass} strokeDasharray="3 3" />
      <Arrow a={[188, 98]} b={[188, 120]} c="brass" w={1.8} />
      <T x={196} y={116} s={10.5} c={C.brassHi}>this link out</T>

      <Tag x={12} y={148}>2 · Bring the ends together</Tag>
      <LinkRow x={46} y={160} n={5} arrows={[2]} />
      <Arrow a={[312, 177]} b={[284, 177]} c="steel" w={1.6} />
      <Arrow a={[10, 177]} b={[38, 177]} c="steel" w={1.6} />

      <Tag x={12} y={240}>3 · Pin back in, against the arrow</Tag>
      {/* section across one link: pin entering from the arrowhead side */}
      <rect x={100} y={256} width={160} height={30} rx="5" fill="url(#sk-steelH)" stroke={M.steelD} />
      <rect x={120} y={268} width={120} height={6} fill="#e7d2a0" stroke={C.brass} strokeWidth="0.4" />
      <rect x={240} y={268} width={36} height={6} fill="#e7d2a0" stroke={C.brass} strokeWidth="0.4" />
      <Arrow a={[300, 271]} b={[284, 271]} c="brass" w={2} />
      <path d="M150 262 L150 280 M146 275 L150 281 L154 275" transform="rotate(-90 150 271)" stroke={C.ruby} strokeWidth="1.4" fill="none" />
      <T x={150} y={300} a="middle" s={10} c={C.ruby}>arrow: way out</T>
      <T x={300} y={262} s={10.5} c={C.brassHi}>push in this way</T>
      <T x={300} y={290} s={10.5} c={C.text}>till flush on both sides</T>
    </F>
  )
}

function BbPinSeat() {
  const Sect = ({ x, proud, gap, ok, t }) => (
    <g>
      <Pn x={x} y={26} w={146} h={186} ok={ok} />
      <T x={x + 12} y={46} s={10.5} c={ok ? C.emerald : C.ruby}>
        {t}
      </T>
      <rect x={x + 20} y={80} width={106} height={36} rx="5" fill="url(#sk-steelH)" stroke={M.steelD} />
      <rect x={x + 20 + (proud ? 0 : 0)} y={95} width={106 + (proud ? 12 : 0)} height={6} fill="#e7d2a0" stroke={C.brass} strokeWidth="0.4" />
      <rect x={x + 20} y={122 + gap} width={106} height={36} rx="5" fill="url(#sk-steelH)" stroke={M.steelD} />
      {gap > 0 && <Dim a={[x + 132, 116]} b={[x + 132, 122 + gap]} off={-6} />}
      {proud && <circle cx={x + 134} cy={98} r={10} fill="none" stroke={C.ruby} strokeWidth="1.4" />}
    </g>
  )
  return (
    <F h={300} view="Inspection · after rejoining" scale="schematic">
      <Sect x={12} ok t="pin flush, links closed" gap={0} />
      <Sect x={167} ok={false} t="pin proud" proud gap={0} />
      <Sect x={322} ok={false} t="link gapping" gap={10} />
      <T x={240} y={186} a="middle" s={10.5} c={C.dim}>snags, works out</T>
      <T x={395} y={186} a="middle" s={10.5} c={C.dim}>pin not fully home</T>
      <Tag x={12} y={236}>Flex the bracelet</Tag>
      <path d="M30 270 Q120 240 210 270" fill="none" stroke="url(#sk-steelH)" strokeWidth="12" />
      <Arrow d="M40 270 Q28 258 40 250" c="brass" w={1.6} />
      <Arrow d="M200 270 Q212 258 200 250" c="brass" w={1.6} />
      <Note x={236} y={256} lines={['No pin should protrude, no link gap.', 'Re-seat a proud pin flush', 'before you wear it.']} c={C.text} s={11} lh={15} />
    </F>
  )
}

/* ================================================================== */
/* basics-caseback · open and close the back                             */
/* ================================================================== */

function BbSnapPry() {
  return (
    <F h={330} view="Plan and section · case knife at the notch" scale="schematic">
      <Pn x={12} y={26} w={210} h={200} t="Back view" />
      <circle cx={118} cy={128} r={70} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={118} cy={128} r={60} fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.8" />
      {[-1, 1].map((d) => <rect key={d} x={118 + d * 34 - 7} y={50} width={14} height={14} fill="url(#sk-steel)" />)}
      <rect x={186} y={120} width={12} height={16} rx="2" fill="url(#bb-knurl)" />
      {/* notch at 9 o'clock */}
      <rect x={55} y={124} width={8} height={8} fill={M.ink} />
      <G x={58} y={128} ang={-90}>
        <path d="M-4 0 L4 0 L5 -30 L-5 -30 Z" fill="url(#sk-steel)" stroke={M.steelD} strokeWidth="0.6" />
        <rect x="-7" y="-70" width="14" height="40" rx="3" fill="url(#sk-wood)" />
      </G>
      <T x={118} y={130} a="middle" s={10} c={C.ground}>back</T>
      <Lab p={[59, 128]} x={46} y={200} text="find the notch" />
      <T x={22} y={216} s={10} c={C.faint}>often beside a lug (crown at 3)</T>

      <Pn x={232} y={26} w={236} h={200} t="Section at the notch" />
      <path d="M252 90 L340 90 L340 104 L300 104 L300 170 L252 170 Z" fill="url(#bb-cut)" stroke="#4e5f6a" />
      <path d="M306 108 L440 108 L440 120 L314 120 Z" fill="url(#bb-cut)" stroke="#4e5f6a" />
      <rect x={300} y={130} width={140} height={34} fill="url(#bb-mov)" />
      {/* blade wedge: flat against case body (below), bevel up */}
      <path d="M302 106 L380 92 L382 100 L306 110 Z" fill="url(#sk-steel)" stroke={M.steelD} strokeWidth="0.6" />
      <rect x={380} y={86} width={70} height={14} rx="3" fill="url(#sk-wood)" transform="rotate(-10 380 92)" />
      <Arrow d="M404 70 Q420 74 424 92" c="brass" w={1.8} />
      <Lab p={[320, 104]} x={290} y={196} text="flat of blade on the case body" />
      <Lab p={[400, 114]} x={420} y={150} text="back pops up" />
      <T x={350} y={56} a="middle" s={10.5} c={C.brassHi}>twist away from your hand,</T>
      <T x={350} y={70} a="middle" s={10.5} c={C.brassHi}>anticlockwise</T>

      <Pn x={12} y={236} w={456} h={82} t="Stubborn one" />
      <ellipse cx={90} cy={300} rx={56} ry={10} fill="#5a3b3b" stroke="#7b5151" />
      <rect x={60} y={278} width={60} height={16} rx="5" fill="url(#sk-steel)" />
      <path d="M64 282 L40 276 L40 282 Z" fill="url(#sk-steel)" />
      <rect x={150} y={256} width={28} height={16} rx="2" fill="url(#bb-gold)" transform="rotate(20 164 264)" />
      <rect x={168} y={262} width={50} height={6} rx="2" fill="url(#sk-wood)" transform="rotate(20 164 264)" />
      <Arrow a={[148, 264]} b={[126, 270]} c="brass" w={1.6} />
      <Note x={240} y={272} lines={['Rest the watch on a casing cushion,', 'then tap the blade in with a brass hammer.']} c={C.text} s={11} lh={15} />
    </F>
  )
}

function BbScrewTools() {
  return (
    <F h={316} view="Comparison · the right tool for the back" scale="schematic">
      <Pn x={12} y={26} w={148} h={226} t="Screw-off" />
      <circle cx={86} cy={128} r={52} fill="url(#sk-steel)" stroke={M.steelD} />
      {Array.from({ length: 6 }, (_, i) => {
        const [x, y] = clk(86, 128, 46, i * 60 + 30)
        return <rect key={i} x={x - 4} y={y - 4} width={8} height={8} fill={M.ink} transform={`rotate(${i * 60 + 30} ${x} ${y})`} />
      })}
      <rect x={30} y={122} width={112} height={12} rx="3" fill="#3a4148" opacity="0.85" />
      {[clk(86, 128, 46, 270), clk(86, 128, 46, 90)].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3.4} fill={C.brassHi} />)}
      <Turn cx={86} cy={128} r={62} from={40} to={-40} />
      <T x={86} y={210} a="middle" s={10.5} c={C.text}>wrench pins in notches</T>
      <T x={86} y={224} a="middle" s={10.5} c={C.brassHi}>press down, anticlockwise</T>

      <Pn x={166} y={26} w={148} h={226} t="Held by screws" />
      <circle cx={240} cy={128} r={52} fill="url(#sk-steel)" stroke={M.steelD} />
      {[45, 135, 225, 315].map((a, i) => {
        const [x, y] = clk(240, 128, 40, a)
        return <Screw key={i} x={x} y={y} r={5} ang={a} />
      })}
      <G x={274} y={100} ang={30}>
        <Screwdriver len={58} blade={6} />
      </G>
      <T x={240} y={210} a="middle" s={10.5} c={C.text}>four or more screws:</T>
      <T x={240} y={224} a="middle" s={10.5} c={C.text}>take them all out</T>

      <Pn x={320} y={26} w={148} h={226} t="Smooth screw-off" />
      <circle cx={394} cy={150} r={46} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={394} cy={104} r={40} fill="#b5404a" stroke="#7a2730" />
      <path d="M372 88 Q382 76 398 76" stroke="#e08a90" strokeWidth="2.4" fill="none" />
      <Turn cx={394} cy={104} r={50} from={40} to={-40} />
      <T x={394} y={210} a="middle" s={10.5} c={C.text}>sticky rubber ball</T>
      <T x={394} y={224} a="middle" s={10.5} c={C.dim}>grips without marking</T>

      <T x={14} y={276} s={11} c={C.text}>Every screw-off turns anticlockwise to open, seen from the back.</T>
      <T x={14} y={294} s={10.5} c={C.ruby}>A wrench that jumps out of its notch gouges the back: press down firmly.</T>
    </F>
  )
}

function BbWontOpen() {
  return (
    <F h={330} view="Decision · a back that won’t open" scale="schematic">
      <Bx x={12} y={30} w={170} h={40} l={['Tool about to slip?', 'stop first']} c={C.ruby} />
      <Fl a={[97, 70]} b={[97, 90]} />
      <Bx x={12} y={92} w={170} h={40} l={['Look at the edge again']} />
      <Fl a={[97, 132]} b={[97, 152]} />
      <Bx x={12} y={154} w={170} h={50} l={['No notch?', 'may be a screw-off', 'with fine knurling']} />
      <Fl a={[182, 112]} b={[226, 112]} />
      <Ring x={300} y={92} r={50} />
      <path d="M262 92 A40 40 0 0 1 338 92" fill="none" stroke="url(#sk-steelH)" strokeWidth="10" />
      {Array.from({ length: 22 }, (_, i) => {
        const [a, b] = clk(300, 120, 42, -70 + i * 6.6)
        const [c2, d2] = clk(300, 120, 34, -70 + i * 6.6)
        return <line key={i} x1={a} y1={b} x2={c2} y2={d2} stroke={M.steelD} strokeWidth="1" />
      })}
      <T x={300} y={128} a="middle" s={10.5} c={C.text}>fine knurling</T>

      <Pn x={12} y={216} w={250} h={104} t="Stubborn screw-off" />
      <Num x={28} y={246} n={1} r={8} />
      <T x={42} y={250} s={10.5} c={C.text}>re-seat the pins fully in the notches</T>
      <Num x={28} y={270} n={2} r={8} />
      <T x={42} y={274} s={10.5} c={C.text}>press down harder</T>
      <Num x={28} y={294} n={3} r={8} />
      <T x={42} y={298} s={10.5} c={C.text}>one firm, steady turn</T>

      <Pn x={272} y={154} w={196} h={64} t="Pin in the notch" />
      <rect x={292} y={190} width={40} height={14} fill="url(#sk-steel)" />
      <rect x={306} y={190} width={12} height={8} fill={M.ink} />
      <rect x={308} y={176} width={8} height={22} fill={C.brassHi} />
      <Verdict x={344} y={194} ok r={7} />
      <rect x={378} y={190} width={40} height={14} fill="url(#sk-steel)" />
      <rect x={392} y={190} width={12} height={8} fill={M.ink} />
      <rect x={400} y={172} width={8} height={20} fill={C.brassHi} transform="rotate(14 404 190)" />
      <Verdict x={432} y={194} ok={false} r={7} />

      <Pn x={272} y={228} w={196} h={92} t="Still won’t move" tc={C.ruby} c={C.ruby} />
      <Note x={284} y={264} lines={['Stop. A stuck back isn’t', 'worth a gouged case.', 'A watchmaker can open it.']} c={C.text} s={11} lh={15} />
    </F>
  )
}

function BbWontClose() {
  const cx = 150
  return (
    <F h={336} view="Section · closing a snap-on back in a case press" scale="schematic">
      {/* upper die on the back's outer rim */}
      <rect x={cx - 74} y={46} width={148} height={16} rx="3" fill="#cfd6db" stroke={M.steelD} />
      <path d={`M${cx - 74} 62 L${cx - 74} 76 L${cx - 58} 76 L${cx - 58} 62 M${cx + 74} 62 L${cx + 74} 76 L${cx + 58} 76 L${cx + 58} 62`} fill="#cfd6db" stroke={M.steelD} />
      <rect x={cx - 6} y={28} width={12} height={18} fill="url(#sk-steelH)" />
      <Arrow a={[cx, 22]} b={[cx, 40]} c="brass" w={2.2} />
      {/* back (inverted watch: back on top) */}
      <path d={`M${cx - 76} 78 L${cx + 76} 78 L${cx + 70} 90 L${cx - 70} 90 Z`} fill="url(#bb-cut)" stroke="#4e5f6a" />
      <rect x={cx - 66} y={90} width={6} height={5} fill={M.gasket} />
      <rect x={cx + 60} y={90} width={6} height={5} fill={M.gasket} />
      {/* case middle */}
      <path d={`M${cx - 88} 92 L${cx - 66} 92 L${cx - 66} 140 L${cx - 88} 140 Z M${cx + 66} 92 L${cx + 88} 92 L${cx + 88} 140 L${cx + 66} 140 Z`} fill="url(#bb-cut)" stroke="#4e5f6a" />
      <rect x={cx - 64} y={96} width={128} height={28} fill="url(#bb-mov)" />
      <rect x={cx - 52} y={140} width={104} height={8} fill="url(#bb-acr)" stroke={M.glass} />
      {/* cloth and lower die on the case, outside the crystal */}
      <rect x={cx - 92} y={148} width={184} height={6} rx="2" fill={M.cloth} />
      <path d={`M${cx - 92} 154 L${cx - 60} 154 L${cx - 60} 166 L${cx + 60} 166 L${cx + 60} 154 L${cx + 92} 154 L${cx + 92} 178 L${cx - 92} 178 Z`} fill="#cfd6db" stroke={M.steelD} />
      <SL p={[cx + 66, 52]} x={250} y={46} text="die on the outer rim of the back" />
      <SL p={[cx + 68, 93]} x={250} y={82} text="gasket in its groove, not pinched" />
      <SL p={[cx + 80, 151]} x={250} y={122} text="soft cloth on the crystal side" />
      <SL p={[cx + 76, 172]} x={250} y={148} text="die on the case outside the crystal" sub="never on crystal, lugs or crown tube" />
      <T x={250} y={186} s={10.5} c={C.brassHi}>press slowly</T>

      <Sep x1={12} y1={200} x2={468} y2={200} />
      <Pn x={12} y={210} w={224} h={116} t="Die too small" tc={C.ruby} ok={false} />
      <rect x={104} y={238} width={40} height={14} rx="2" fill="#cfd6db" stroke={M.steelD} />
      <path d="M48 262 L200 262 Q124 290 48 262 Z" fill="url(#bb-cut)" stroke="#4e5f6a" />
      <Arrow a={[124, 228]} b={[124, 236]} c="ruby" w={1.6} />
      <T x={124} y={300} a="middle" s={10.5} c={C.text}>centre bows, the back buckles</T>
      <T x={124} y={314} a="middle" s={10.5} c={C.text}>and won’t seat</T>

      <Pn x={244} y={210} w={224} h={116} t="Before you press" />
      <Chk x={256} y={246} text="snap-on notch over the stem" />
      <Chk x={256} y={268} text="gasket in its groove" />
      <Chk x={256} y={290} text="still won’t snap? stop:" ok={false} sub="bent rim or the wrong back" />
    </F>
  )
}

/* ================================================================== */
/* basics-settime · set the time and date safely                          */
/* ================================================================== */

// Schematic date drive: date ring arc with teeth and a driving finger on a 24 h wheel
function DateDrive({ cx, cy, r, fingerDeg, label }) {
  return (
    <g>
      <path d={`M${cx - r * 1.2} ${cy - r * 1.55} A${r * 2} ${r * 2} 0 0 1 ${cx + r * 1.2} ${cy - r * 1.55}`} fill="none" stroke={C.steel} strokeWidth="5" />
      {Array.from({ length: 9 }, (_, i) => {
        const a = -36 + i * 9
        const [x1, y1] = clk(cx, cy + r * 0.45, r * 2, a)
        const [x2, y2] = clk(cx, cy + r * 0.45, r * 2 - 7, a)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.steel} strokeWidth="2" />
      })}
      <circle cx={cx} cy={cy} r={r * 0.62} fill="rgba(201,162,76,0.12)" stroke={M.brassP} strokeWidth="1.4" />
      <circle cx={cx} cy={cy} r={3} fill={M.ruby} />
      {(() => {
        const [x, y] = clk(cx, cy, r * 0.9, fingerDeg)
        return <line x1={cx} y1={cy} x2={x} y2={y} stroke={C.brassHi} strokeWidth="3" strokeLinecap="round" />
      })()}
      {label && (
        <T x={cx} y={cy + r * 0.62 + 16} a="middle" s={10} c={C.faint}>
          {label}
        </T>
      )}
    </g>
  )
}

function BbHandsClear() {
  return (
    <F h={300} view="Plan · hands at 6 before a quick-set" scale="schematic">
      <Pn x={12} y={26} w={226} h={210} t="Hands near 12" tc={C.ruby} ok={false} />
      <Face cx={70} cy={120} r={40} h={0} m={350} date="14" lugs={false} />
      <DateDrive cx={180} cy={148} r={30} fingerDeg={-8} label="finger in the date teeth" />
      <T x={125} y={222} a="middle" s={10.5} c={C.text}>quick-set now can jam or damage it</T>

      <Pn x={248} y={26} w={220} h={210} t="Hands at about 6" tc={C.emerald} ok />
      <Face cx={306} cy={120} r={40} h={185} m={0} date="14" lugs={false} />
      <DateDrive cx={418} cy={148} r={30} fingerDeg={180} label="finger far away" />
      <T x={358} y={222} a="middle" s={10.5} c={C.text}>date works fully disengaged</T>
      <Note x={14} y={262} lines={['Turn the hands to about 6 o’clock first, then quick-set the date.', 'The finger and date ring are drawn as a schematic, not a real calibre.']} c={C.dim} s={10.5} lh={15} />
    </F>
  )
}

function BbDateThenTime() {
  return (
    <F h={300} view="Sequence · date first, then time" scale="schematic">
      {[
        [1, 'Quick-set the date', 'to the day before', 13],
        [2, 'Advance the hour hand', 'past midnight', 14],
        [3, 'It flips to today:', 'now you know it’s AM', 14],
      ].map(([n, a, b, d], i) => {
        const x = 12 + i * 154
        return (
          <g key={n}>
            <Pn x={x} y={26} w={148} h={200} />
            <Num x={x + 16} y={44} n={n} r={8} />
            <Face cx={x + 74} cy={118} r={46} h={i === 0 ? 185 : i === 1 ? 355 : 2} m={i === 0 ? 0 : i === 1 ? 300 : 30} date={String(d + (i === 2 ? 1 : 0))} lugs={false} />
            {i === 1 && <Turn cx={x + 74} cy={118} r={36} from={300} to={350} />}
            <T x={x + 74} y={190} a="middle" s={10.5} c={C.text}>
              {a}
            </T>
            <T x={x + 74} y={204} a="middle" s={10.5} c={C.dim}>
              {b}
            </T>
          </g>
        )
      })}
      <Arrow a={[156, 118]} b={[168, 118]} c="steel" w={1.4} />
      <Arrow a={[310, 118]} b={[322, 118]} c="steel" w={1.4} />
      <T x={14} y={252} s={11} c={C.text}>Example: today is the 15th. Set 14, then run the hands past midnight.</T>
      <T x={14} y={270} s={10.5} c={C.dim}>Then carry on to the right time: morning is the first trip round after the flip,</T>
      <T x={14} y={284} s={10.5} c={C.dim}>afternoon the second.</T>
    </F>
  )
}

function BbNoonFlip() {
  const x0 = 40
  const k = 400 / 24
  return (
    <F h={316} view="Chart · which 12 is midnight" scale="schematic">
      <T x={14} y={42} s={11} c={C.text}>Advance the hands slowly through both 12s. The date changes at only one.</T>
      <rect x={x0} y={70} width={400} height={22} fill="rgba(255,255,255,0.04)" stroke={C.line} />
      <rect x={x0} y={70} width={6 * k} height={22} fill="rgba(80,90,150,0.35)" />
      <rect x={x0 + 18 * k} y={70} width={6 * k} height={22} fill="rgba(80,90,150,0.35)" />
      {[0, 6, 12, 18, 24].map((h) => (
        <g key={h}>
          <line x1={x0 + h * k} y1={92} x2={x0 + h * k} y2={98} stroke={C.dim} />
          <T x={x0 + h * k} y={110} a="middle" s={10} c={C.dim} mono>
            {['00', '06', '12', '18', '24'][h / 6]}
          </T>
        </g>
      ))}
      <line x1={x0} y1={60} x2={x0} y2={92} stroke={C.emerald} strokeWidth="2" />
      <line x1={x0 + 24 * k} y1={60} x2={x0 + 24 * k} y2={92} stroke={C.emerald} strokeWidth="2" />
      <T x={x0 + 4} y={64} s={10.5} c={C.emerald}>midnight: date changes</T>
      <line x1={x0 + 12 * k} y1={60} x2={x0 + 12 * k} y2={92} stroke={C.ruby} strokeWidth="2" strokeDasharray="3 2" />
      <T x={x0 + 12 * k + 4} y={64} s={10.5} c={C.ruby}>noon: no change</T>

      <Pn x={12} y={124} w={226} h={180} t="Date flips at midday?" tc={C.brassHi} />
      <Note x={24} y={160} lines={['The watch is 12 hours out.', 'Run the hands forward', 'through a full 12 hours,', 'then set the time again.']} c={C.text} s={11} lh={15} />
      <Face cx={126} cy={262} r={30} h={0} m={0} lugs={false} crown={false} />
      <Turn cx={126} cy={262} r={36} from={20} to={340} c="brass" />
      <T x={176} y={266} s={10.5} c={C.brassHi}>+12 h</T>

      <Pn x={248} y={124} w={220} h={180} t="Changes at neither 12" tc={C.ruby} c={C.ruby} />
      <Note x={260} y={160} lines={['Stop turning.', 'Treat it as a fault, not', 'a setting mistake.']} c={C.text} s={11} lh={15} />
      <T x={260} y={240} s={10.5} c={C.dim}>Common build problems ›</T>
      <T x={260} y={254} s={10.5} c={C.dim}>Date changes at the wrong time</T>
    </F>
  )
}

// Crown and tube, side view; pos: 0 pushed in, 1 / 2 pulled; screw: threaded tube
function CrownSide({ x, y, pos = 0, screw, k = 1 }) {
  const out = pos * 8 * k
  return (
    <g>
      <rect x={x - 40 * k} y={y - 18 * k} width={40 * k} height={36 * k} fill="url(#bb-cut)" stroke="#4e5f6a" />
      <rect x={x} y={y - 5 * k} width={14 * k} height={10 * k} fill="url(#sk-steelH)" />
      {screw && Array.from({ length: 5 }, (_, i) => <line key={i} x1={x + 2 * k + i * 2.6 * k} y1={y - 5 * k} x2={x + 3.4 * k + i * 2.6 * k} y2={y + 5 * k} stroke={M.steelD} strokeWidth="0.8" />)}
      <rect x={x - 40 * k} y={y - 1.6 * k} width={40 * k + out + 10 * k} height={3.2 * k} fill="#d6dee3" />
      <rect x={x + 8 * k + out} y={y - 11 * k} width={20 * k} height={22 * k} rx={3 * k} fill="url(#bb-knurl)" stroke={M.steelD} strokeWidth="0.6" />
    </g>
  )
}

function BbWindManual() {
  return (
    <F h={300} view="Sequence · hand-wound watch" scale="schematic">
      {[
        [1, 'Wind gently', 'crown pushed in', 0],
        [2, 'Pull out and set', 'once it’s running', 2],
        [3, 'Push fully home', 'screw down if it has one', 0],
      ].map(([n, a, b, pos], i) => {
        const x = 12 + i * 154
        return (
          <g key={n}>
            <Pn x={x} y={26} w={148} h={190} />
            <Num x={x + 16} y={44} n={n} r={8} />
            <CrownSide x={x + 70} y={110} pos={pos} screw={i === 2} k={1.5} />
            {i === 0 && <Arrow d={`M${x + 100} 70 Q${x + 120} 110 ${x + 100} 150`} c="brass" w={1.8} />}
            {i === 1 && <Arrow a={[x + 100, 146]} b={[x + 132, 146]} c="brass" w={1.8} />}
            {i === 2 && <Arrow a={[x + 132, 146]} b={[x + 102, 146]} c="emerald" w={1.8} />}
            {i === 2 && <Arrow d={`M${x + 128} 74 Q${x + 140} 110 ${x + 128} 128`} c="emerald" w={1.6} />}
            <T x={x + 74} y={182} a="middle" s={10.5} c={C.text}>
              {a}
            </T>
            <T x={x + 74} y={198} a="middle" s={10} c={C.dim}>
              {b}
            </T>
          </g>
        )
      })}
      <Note x={14} y={244} lines={['A gentle wind first, so the watch is running before you set it.', 'When you are done, push the crown fully home (and screw it down).']} c={C.dim} s={10.5} lh={15} />
    </F>
  )
}

function BbHackSecond() {
  return (
    <F h={336} view="Sequence · set to the second" scale="schematic">
      {[
        [1, 'Seconds hand at 12:', 'pull the crown', 0, 0],
        [2, 'Minute hand to', 'the next full minute', 1, 0],
        [3, 'Push in on', 'the time signal', 2, 0],
      ].map(([n, a, b, st], i) => {
        const x = 12 + i * 154
        return (
          <g key={n}>
            <Pn x={x} y={26} w={148} h={162} />
            <Num x={x + 16} y={44} n={n} r={8} />
            <Face cx={x + 74} cy={100} r={40} h={302} m={st === 0 ? 54 : 60} s={0} lugs={false} />
            {st === 1 && <Turn cx={x + 74} cy={100} r={46} from={46} to={58} c="brass" />}
            {st === 0 && <T x={x + 138} y={48} a="end" s={10} c={C.ruby}>seconds stop</T>}
            <T x={x + 74} y={160} a="middle" s={10.5} c={C.text}>
              {a}
            </T>
            <T x={x + 74} y={174} a="middle" s={10} c={C.dim}>
              {b}
            </T>
          </g>
        )
      })}
      <Pn x={12} y={196} w={230} h={128} t="Come from one direction" />
      {/* gear play schematic: two teeth with a gap */}
      <path d="M40 270 l10 -18 l10 18 l10 -18 l10 18 l10 -18 l10 18" fill="none" stroke={M.brassP} strokeWidth="2" />
      <path d="M44 236 l10 18 l10 -18 l10 18 l10 -18" fill="none" stroke={C.steel} strokeWidth="2" transform="translate(4 0)" />
      <Arrow a={[130, 252]} b={[110, 252]} c="brass" w={1.6} />
      <Note x={136} y={246} lines={['play between', 'teeth: a hand', 'set both ways', 'sits slightly off']} c={C.text} s={10} lh={13} />
      <T x={24} y={298} s={10} c={C.faint}>some say 4 to 5 min past, turn back</T>
      <T x={24} y={312} s={10} c={C.faint}>Seiko manuals differ: follow yours</T>

      <Pn x={250} y={196} w={218} h={128} t="Seconds keeps running?" />
      <Note x={262} y={232} lines={['Your watch may not hack.', 'On the 7S26 and', 'Miyota 8215 that’s the', 'design, not a fault.']} c={C.text} s={10.5} lh={14} />
    </F>
  )
}

/* ================================================================== */
/* basics-care · everyday care and cleaning                              */
/* ================================================================== */

function BbWipe() {
  return (
    <F h={300} view="Plan · the daily wipe" scale="schematic">
      {/* bracelet + watch */}
      {[0, 1, 2].map((i) => <rect key={'t' + i} x={84} y={34 + i * 22} width={72} height={20} rx="3" fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.6" />)}
      {[0, 1].map((i) => <rect key={'b' + i} x={84} y={208 + i * 22} width={72} height={20} rx="3" fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.6" />)}
      <Face cx={120} cy={146} r={56} h={305} m={60} lugs />
      {/* cloth sweeping */}
      <path d="M170 92 q40 -14 70 6 q10 30 -16 50 q-36 4 -58 -18 Z" fill={M.cloth} stroke="#5f7686" />
      <path d="M180 100 l40 8 M184 116 l36 6 M190 132 l26 4" stroke="#56707f" strokeWidth="1" />
      <Arrow d="M250 86 Q270 120 244 158" c="brass" w={1.8} />
      <Lab p={[214, 120]} x={232} y={234} text="dry microfibre cloth, every day" a="start" />

      <Ring x={392} y={110} r={66} />
      <rect x={340} y={60} width={104} height={40} rx="5" fill="url(#sk-steel)" />
      <rect x={350} y={104} width={84} height={34} rx="4" fill="url(#sk-steelH)" />
      <rect x={350} y={140} width={84} height={30} rx="4" fill="url(#sk-steelH)" />
      {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={352 + i * 5.4} cy={101 + (i % 3)} r={1.3} fill="#a39684" />)}
      {Array.from({ length: 14 }, (_, i) => <circle key={'b' + i} cx={354 + i * 5.6} cy={138 + (i % 2)} r={1.1} fill="#a39684" />)}
      <ellipse cx={372} cy={80} rx={14} ry={6} fill="rgba(240,220,170,0.25)" />
      <T x={392} y={196} a="middle" s={10.5} c={C.text}>skin oil and grit collect</T>
      <T x={392} y={210} a="middle" s={10.5} c={C.text}>where case meets bracelet</T>
      <T x={14} y={286} s={11} c={C.text}>Wipe it off before it works into the case and the bracelet joints.</T>
    </F>
  )
}

function BbRinse() {
  return (
    <F h={310} view="Side view · rinse after sweat or salt water" scale="schematic">
      <Pn x={12} y={26} w={232} h={196} t="Crown fully closed" />
      <path d="M60 50 L160 50 L160 62 L80 62 L80 72 L60 72 Z" fill="url(#sk-steel)" stroke={M.steelD} />
      <path d="M62 74 L78 74 L92 130 L50 130 Z" fill="rgba(127,182,214,0.3)" />
      <CaseSec cx={80} y={128} W={100} gk={false} mov={false} hands={false} dial={false} />
      <Lab p={[148, 168]} x={196} y={110} text="crown screwed down" a="middle" up />
      <T x={128} y={210} a="middle" s={10.5} c={C.text}>fresh water, then dry</T>

      <Pn x={252} y={26} w={216} h={196} t="Why: salt corrodes" />
      <Ring x={360} y={122} r={64} />
      <CrownSide x={360} y={122} k={1.6} screw />
      <rect x={322} y={102} width={6} height={40} fill={M.gasket} />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={326 + (i % 4) * 8} y={98 + Math.floor(i / 4) * 18} width={3.4} height={3.4} fill={M.salt} transform={`rotate(${i * 20} ${328 + (i % 4) * 8} ${100 + Math.floor(i / 4) * 18})`} />)}
      <T x={360} y={204} a="middle" s={10.5} c={C.text}>dried salt attacks seals and steel</T>

      <Sep x1={12} y1={234} x2={468} y2={234} />
      <Num x={24} y={256} n={1} r={8} />
      <T x={38} y={260} s={10.5} c={C.text}>Screw-down watch only</T>
      <Num x={190} y={256} n={2} r={8} />
      <T x={204} y={260} s={10.5} c={C.text}>Crown fully closed</T>
      <Num x={336} y={256} n={3} r={8} />
      <T x={350} y={260} s={10.5} c={C.text}>Rinse, then dry</T>
      <T x={14} y={290} s={10.5} c={C.dim}>After sweat or salt water, the same day.</T>
    </F>
  )
}

function BbMagnets() {
  const Field = ({ x, y }) => (
    <g fill="none" stroke={M.magnet} strokeWidth="0.9" opacity="0.8">
      {[12, 20, 28].map((r) => <ellipse key={r} cx={x} cy={y} rx={r * 1.4} ry={r} strokeDasharray="3 3" />)}
    </g>
  )
  const Src = ({ x, label, children }) => (
    <g>
      <Field x={x} y={78} />
      {children}
      <T x={x} y={128} a="middle" s={10.5} c={C.text}>
        {label}
      </T>
    </g>
  )
  return (
    <F h={316} view="Chart · magnets that affect a watch" scale="schematic">
      <Src x={60} label="phone">
        <rect x={48} y={58} width={24} height={40} rx="4" fill="#2b2f33" stroke={C.struct} />
      </Src>
      <Src x={176} label="speaker">
        <circle cx={176} cy={78} r={16} fill="#2b2f33" stroke={C.struct} />
        <circle cx={176} cy={78} r={6} fill="#4a4f55" />
      </Src>
      <Src x={292} label="laptop closure">
        <path d="M268 90 L316 90 L322 98 L262 98 Z" fill="#6b747b" />
        <rect x={270} y={60} width={44} height={30} fill="#3b4248" stroke={C.struct} />
      </Src>
      <Src x={410} label="magnetic clasp">
        <rect x={392} y={68} width={36} height={20} rx="4" fill="url(#sk-steel)" />
        <line x1={410} y1={68} x2={410} y2={88} stroke={M.magnet} strokeWidth="2" />
      </Src>

      <Sep x1={12} y1={144} x2={468} y2={144} />
      <Pn x={12} y={154} w={146} h={150} t="Hairspring, normal" tc={C.emerald} />
      <g transform="translate(85 238)">
        {[10, 18, 26, 34, 42].map((r) => <circle key={r} r={r} fill="none" stroke={C.steel} strokeWidth="1" />)}
        <circle r={3} fill={M.ruby} />
      </g>
      <Pn x={166} y={154} w={146} h={150} t="Magnetised" tc={C.ruby} />
      <g transform="translate(239 238)">
        {[10, 18, 26, 34, 42].map((r, i) => <circle key={r} r={r - (i === 2 || i === 3 ? (i === 2 ? -3 : 3) : 0)} cx={i === 2 || i === 3 ? 2 : 0} fill="none" stroke={C.steel} strokeWidth="1" />)}
        <circle r={3} fill={M.ruby} />
        <circle cx={33} cy={0} r={5} fill="none" stroke={C.ruby} strokeWidth="1.4" />
      </g>
      <T x={239} y={296} a="middle" s={10} c={C.ruby}>coils cling together</T>
      <Note x={324} y={182} lines={['A shorter working', 'spring beats faster:', 'the watch runs fast.']} c={C.text} s={10.5} lh={14} />
      <Note x={324} y={246} lines={['Store it away from', 'all of these.']} c={C.brassHi} s={10.5} lh={14} />
    </F>
  )
}

function BbRateHome() {
  const x0 = 252
  const y0 = 196
  const k = 2.3 // px per s/day
  const yv = (v) => y0 - v * k
  return (
    <F h={330} view="Chart · rate against the calibre’s spec" scale="example readings">
      <Pn x={12} y={26} w={216} h={176} t="Log, same time each day" />
      {[
        ['Day', 'vs clock', 'change'],
        ['0', '0 s', ''],
        ['1', '+18 s', '+18'],
        ['2', '+37 s', '+19'],
        ['3', '+54 s', '+17'],
      ].map((r, i) => (
        <g key={i}>
          {r.map((c, j) => (
            <T key={j} x={30 + j * 66} y={60 + i * 20} s={i ? 11 : 10} c={i ? C.text : C.faint} mono={i > 0}>
              {c}
            </T>
          ))}
        </g>
      ))}
      <line x1={26} y1={152} x2={214} y2={152} stroke={C.struct} />
      <T x={30} y={172} s={11} c={C.brassHi} w={600}>average +18 s/day</T>
      <T x={30} y={188} s={10} c={C.faint}>average a few days, not one</T>

      {/* bands */}
      <line x1={x0} y1={y0 - 120} x2={x0} y2={y0 + 60} stroke={C.struct} />
      <line x1={x0} y1={y0} x2={460} y2={y0} stroke={C.struct} strokeDasharray="2 3" />
      <T x={x0 - 4} y={y0 + 4} a="end" s={10} c={C.dim} mono>0</T>
      <rect x={x0 + 14} y={yv(40)} width={80} height={yv(-20) - yv(40)} fill="rgba(123,165,131,0.18)" stroke={C.emerald} />
      <T x={x0 + 54} y={yv(40) - 6} a="middle" s={10} c={C.emerald}>+40</T>
      <T x={x0 + 54} y={yv(-20) + 14} a="middle" s={10} c={C.emerald}>−20</T>
      <T x={x0 + 54} y={y0 + 76} a="middle" s={10.5} c={C.text}>Seiko 7S26</T>
      <rect x={x0 + 120} y={yv(7)} width={80} height={yv(-4) - yv(7)} fill="rgba(134,167,189,0.18)" stroke={C.steel} />
      <T x={x0 + 160} y={y0 + 76} a="middle" s={10.5} c={C.text}>chronometer</T>
      <T x={x0 + 160} y={yv(7) - 6} a="middle" s={10} c={C.faint}>much tighter</T>
      <line x1={x0 + 6} y1={yv(18)} x2={x0 + 208} y2={yv(18)} stroke={C.brassHi} strokeWidth="1.6" />
      <T x={x0 + 208} y={yv(18) - 5} a="end" s={10.5} c={C.brassHi}>+18 s/day</T>
      <Verdict x={x0 + 54} y={yv(28)} ok r={7} />
      <Verdict x={x0 + 186} y={yv(28)} ok={false} r={7} />
      <T x={x0 + 4} y={y0 + 94} s={10} c={C.faint}>chronometer band schematic, not to scale</T>

      <rect x={12} y={212} width={216} height={106} rx="8" fill="rgba(194,88,99,0.06)" stroke={C.ruby} />
      <Tag x={22} y={230} c={C.ruby}>Sudden change?</Tag>
      <Note x={22} y={252} lines={['A watch that was steady and', 'now isn’t matters more than', 'the number. Check for', 'magnetism first.']} c={C.text} s={10.5} lh={14} />
    </F>
  )
}

function BbSafetyCheck() {
  return (
    <F h={316} view="Inspection · the quick safety check" scale="schematic">
      <rect x={80} y={34} width={64} height={70} rx="4" fill="url(#sk-top)" />
      <rect x={80} y={196} width={64} height={70} rx="4" fill="url(#sk-top)" />
      <Face cx={112} cy={150} r={58} h={305} m={60} />
      <rect x={92} y={262} width={40} height={22} rx="3" fill="url(#sk-steel)" stroke={M.steelD} />
      <Arrow a={[112, 92]} b={[112, 60]} c="brass" w={2} />
      <Arrow a={[112, 208]} b={[112, 240]} c="brass" w={2} />
      <path d="M86 116 Q100 104 118 112" stroke="rgba(230,240,245,0.6)" strokeWidth="5" fill="none" strokeLinecap="round" />
      {[
        [1, [128, 70], 'Tug the strap at each lug', 'a loose bar shows now, not on the street'],
        [2, [132, 273], 'Open and close the clasp', 'it should snap shut and hold'],
        [3, [176, 150], 'Crown closes fully', 'pushed or screwed home'],
        [4, [96, 118], 'No fog under the crystal', 'fog? work “Water got in” now'],
      ].map(([n, p, a, b], i) => {
        const ty = 60 + i * 62
        return (
          <g key={n}>
            <line x1={p[0]} y1={p[1]} x2={236} y2={ty - 4} stroke={C.struct} strokeWidth="0.8" />
            <circle cx={p[0]} cy={p[1]} r={2.2} fill={C.text} />
            <Num x={248} y={ty - 4} n={n} r={8} />
            <T x={262} y={ty} s={11} c={C.text}>
              {a}
            </T>
            <T x={262} y={ty + 14} s={10} c={C.faint}>
              {b}
            </T>
          </g>
        )
      })}
      <T x={14} y={306} s={10.5} c={C.dim}>Every so often, in good light. A bar or clasp costs far less than a dropped watch.</T>
    </F>
  )
}

function BbService() {
  return (
    <F h={316} view="Chart · why and when to service" scale="schematic">
      <Pn x={12} y={26} w={226} h={150} t="Fresh oil" tc={C.emerald} />
      <rect x={60} y={86} width={130} height={16} fill="url(#bb-bcut)" />
      <rect x={60} y={122} width={130} height={16} fill="url(#bb-bcut)" />
      <rect x={118} y={70} width={14} height={84} fill="url(#sk-steelH)" />
      <ellipse cx={125} cy={86} rx={18} ry={5} fill={M.oil} opacity="0.85" />
      <T x={125} y={168} a="middle" s={10.5} c={C.text}>pivot turns in an oil film</T>
      <Pn x={248} y={26} w={220} h={150} t="Years on: oil dried" tc={C.ruby} />
      <rect x={292} y={86} width={130} height={16} fill="url(#bb-bcut)" />
      <rect x={292} y={122} width={130} height={16} fill="url(#bb-bcut)" />
      <path d="M350 70 L364 70 L363 100 L361 108 L363 116 L364 154 L350 154 L351 116 L353 108 L351 100 Z" fill="url(#sk-steelH)" />
      <path d="M346 88 l4 -2 M368 86 l4 2" stroke="#7a6a4a" strokeWidth="2" />
      <T x={358} y={168} a="middle" s={10.5} c={C.text}>dry pivot wears</T>

      <Tag x={12} y={200}>Mechanical: full service every few years</Tag>
      <line x1={30} y1={232} x2={450} y2={232} stroke={C.struct} />
      {Array.from({ length: 11 }, (_, i) => (
        <g key={i}>
          <line x1={30 + i * 42} y1={228} x2={30 + i * 42} y2={236} stroke={C.dim} />
          <T x={30 + i * 42} y={250} a="middle" s={10} c={C.dim} mono>
            {i}
          </T>
        </g>
      ))}
      <rect x={30 + 5 * 42} y={220} width={3 * 42} height={12} fill="rgba(208,168,79,0.35)" stroke={C.brass} />
      <T x={30 + 6.5 * 42} y={214} a="middle" s={10.5} c={C.brassHi}>Omega suggests 5–8 years</T>
      <T x={450} y={266} a="end" s={10} c={C.faint}>years · makers differ, check yours</T>
      <rect x={12} y={276} width={456} height={32} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={296} s={10.5} c={C.text}>Quartz: change the battery on time, before an old cell can leak.</T>
    </F>
  )
}

/* ================================================================== */
/* basics-glass · fit a new watch glass                                  */
/* ================================================================== */

function BbGlassTypes() {
  return (
    <F h={316} view="Section · three kinds of watch glass" scale="thickness exaggerated">
      {[
        ['Acrylic', 'UB / “Plexi”', 0],
        ['Mineral', 'flat, i-gasket', 1],
        ['Sapphire', 'hardest', 2],
      ].map(([a, b, i]) => {
        const x = 12 + i * 154
        const cx = x + 74
        return (
          <g key={a}>
            <Pn x={x} y={26} w={148} h={200} t={a} />
            {/* bezel lips */}
            <path d={`M${x + 10} 120 L${x + 26} 120 L${x + 26} 150 L${x + 10} 150 Z M${x + 122} 120 L${x + 138} 120 L${x + 138} 150 L${x + 122} 150 Z`} fill="url(#bb-cut)" stroke="#4e5f6a" />
            {i === 0 && (
              <g>
                <path d={`M${x + 28} 140 L${x + 28} 118 Q${cx} 74 ${x + 120} 118 L${x + 120} 140 Z`} fill="url(#bb-acr)" stroke={M.glass} />
                <rect x={x + 30} y={132} width={88} height={5} fill="url(#sk-brassG)" />
              </g>
            )}
            {i === 1 && (
              <g>
                <rect x={x + 32} y={124} width={84} height={10} fill="url(#bb-acr)" stroke={M.glass} />
                <rect x={x + 26} y={122} width={6} height={18} fill={M.nylon} />
                <rect x={x + 116} y={122} width={6} height={18} fill={M.nylon} />
              </g>
            )}
            {i === 2 && (
              <g>
                <rect x={x + 32} y={124} width={84} height={10} fill="rgba(170,200,235,0.45)" stroke="#c8dcf2" />
                <rect x={x + 26} y={122} width={6} height={18} fill={M.gasket} />
                <rect x={x + 116} y={122} width={6} height={18} fill={M.gasket} />
              </g>
            )}
            <T x={cx} y={176} a="middle" s={10.5} c={C.text}>
              {b}
            </T>
            <T x={cx} y={192} a="middle" s={10} c={C.dim}>
              {['soft dome, polishes', 'harder', 'scratch-resistant'][i]}
            </T>
            <T x={cx} y={206} a="middle" s={10} c={C.dim}>
              {['but scratches easily', '', ''][i]}
            </T>
          </g>
        )
      })}
      <Lab p={[56, 134]} x={20} y={58} text="brass compression ring" up a="start" />
      <Lab p={[195, 130]} x={200} y={74} text="nylon i-gasket" up a="start" />
      <Arrow a={[40, 252]} b={[440, 252]} c="steel" w={1.6} />
      <T x={40} y={270} s={10.5} c={C.dim}>softer</T>
      <T x={440} y={270} a="end" s={10.5} c={C.dim}>harder</T>
      <T x={240} y={300} a="middle" s={11.5} c={C.text} w={600}>Replace like for like.</T>
    </F>
  )
}

function BbGlassMeasure() {
  return (
    <F h={326} view="Measurement · groove and glass" scale="interference exaggerated">
      <Pn x={12} y={26} w={456} h={128} t="Measure the bezel-groove diameter" />
      <path d="M60 80 L100 80 L100 96 L92 96 L92 112 L100 112 L100 128 L60 128 Z" fill="url(#bb-cut)" stroke="#4e5f6a" />
      <path d="M420 80 L380 80 L380 96 L388 96 L388 112 L380 112 L380 128 L420 128 Z" fill="url(#bb-cut)" stroke="#4e5f6a" />
      <Dim a={[92, 104]} b={[388, 104]} off={0} text="groove diameter" />
      <T x={240} y={144} a="middle" s={10.5} c={C.dim}>That interference is exactly what makes the seal.</T>

      <Pn x={12} y={164} w={224} h={150} t="Acrylic UB" />
      <path d="M40 260 L40 236 Q124 196 208 236 L208 260 Z" fill="url(#bb-acr)" stroke={M.glass} />
      <line x1={46} y1={270} x2={202} y2={270} stroke={C.dim} strokeDasharray="3 3" />
      <T x={124} y={290} a="middle" s={11} c={C.brassHi} mono>about +0.2 mm</T>
      <T x={124} y={304} a="middle" s={10} c={C.faint}>larger than the groove</T>
      <Pn x={244} y={164} w={224} h={150} t="Mineral with i-gasket" />
      <rect x={278} y={232} width={156} height={10} fill="url(#bb-acr)" stroke={M.glass} />
      <rect x={272} y={228} width={6} height={18} fill={M.nylon} />
      <rect x={434} y={228} width={6} height={18} fill={M.nylon} />
      <T x={356} y={290} a="middle" s={11} c={C.brassHi} mono>about +0.1 mm</T>
      <T x={356} y={304} a="middle" s={10} c={C.faint}>larger than the groove</T>
      <T x={356} y={262} a="middle" s={10} c={C.dim}>glass in gasket</T>
    </F>
  )
}

function BbAcrylicFit() {
  return (
    <F h={330} view="Section · fitting an acrylic glass" scale="schematic">
      <Pn x={12} y={26} w={290} h={290} t="Domed glass" />
      {/* domed die above, pressing the dome down: squeezing shrinks the rim */}
      <path d="M70 70 L240 70 L240 92 Q155 72 70 92 Z" fill="#cfd6db" stroke={M.steelD} />
      <rect x={148} y={46} width={14} height={24} fill="url(#sk-steelH)" />
      <Arrow a={[155, 34]} b={[155, 46]} c="brass" w={2} />
      <path d="M84 118 L84 104 Q155 82 226 104 L226 118 Z" fill="url(#bb-acr)" stroke={M.glass} />
      <Arrow a={[70, 112]} b={[86, 112]} c="brass" w={1.6} />
      <Arrow a={[240, 112]} b={[224, 112]} c="brass" w={1.6} />
      <SL p={[226, 108]} x={231} y={98} text="rim drawn in" />
      {/* case brought up */}
      <path d="M70 150 L96 150 L96 132 L102 132 L102 126 L90 126 L90 120 L70 120 Z M240 150 L214 150 L214 132 L208 132 L208 126 L220 126 L220 120 L240 120 Z" fill="url(#bb-cut)" stroke="#4e5f6a" transform="translate(0 30)" />
      <Arrow a={[155, 196]} b={[155, 172]} c="steel" w={2} />
      <T x={170} y={194} s={10.5} c={C.text}>case brought up to meet it</T>
      <Sep x1={24} y1={216} x2={290} y2={216} />
      <Num x={32} y={238} n={1} r={8} />
      <T x={46} y={242} s={10.5} c={C.text}>domed die squeezes the dome</T>
      <Num x={32} y={262} n={2} r={8} />
      <T x={46} y={266} s={10.5} c={C.text}>bring the case up to the glass</T>
      <Num x={32} y={286} n={3} r={8} />
      <T x={46} y={290} s={10.5} c={C.text}>release the pressure slowly</T>

      <Pn x={310} y={26} w={158} h={290} t="UB with ring" />
      <path d="M330 100 L352 100 L352 116 L346 116 L346 124 L352 124 L352 140 L330 140 Z M448 100 L426 100 L426 116 L432 116 L432 124 L426 124 L426 140 L448 140 Z" fill="url(#bb-cut)" stroke="#4e5f6a" />
      <path d="M350 186 L350 172 Q389 146 428 172 L428 186 Z" fill="url(#bb-acr)" stroke={M.glass} />
      <rect x={350} y={182} width={78} height={5} fill="url(#sk-brassG)" />
      <Arrow a={[389, 214]} b={[389, 196]} c="brass" w={2} />
      <Note x={389} y={232} a="middle" lines={['pressed straight up', 'into the bezel groove', 'until it clicks home']} c={C.text} s={10.5} lh={14} />
      <T x={389} y={88} a="middle" s={10} c={C.faint}>bezel groove</T>
    </F>
  )
}

function BbMineralFit() {
  return (
    <F h={326} view="Section · fitting mineral glass with an i-gasket" scale="schematic">
      <Pn x={12} y={26} w={196} h={290} t="1 · Gasket first" />
      <Ring x={110} y={128} r={70} />
      <path d="M62 96 L92 96 L92 160 L62 160 Z" fill="url(#bb-cut)" stroke="#4e5f6a" />
      {/* i-gasket profile: I shape */}
      <path d="M94 104 L108 104 L108 110 L103 110 L103 146 L108 146 L108 152 L94 152 Z" fill={M.nylon} stroke="#b9ac85" />
      <rect x={112} y={118} width={70} height={18} fill="url(#bb-acr)" stroke={M.glass} />
      <Arrow a={[150, 92]} b={[150, 112]} c="brass" w={1.6} />
      <Note x={110} y={222} a="middle" lines={['seat the nylon i-gasket', 'in the case, leading edge', 'toward the glass']} c={C.text} s={10.5} lh={14} />

      <Pn x={216} y={26} w={252} h={290} t="2 · Press" />
      <rect x={268} y={46} width={148} height={20} rx="3" fill="#cfd6db" stroke={M.steelD} />
      <rect x={370} y={30} width={14} height={16} fill="url(#sk-steelH)" />
      <Arrow a={[300, 76]} b={[300, 92]} c="brass" w={1.8} />
      <Arrow a={[384, 76]} b={[384, 92]} c="brass" w={1.8} />
      <rect x={282} y={96} width={120} height={10} fill="url(#bb-acr)" stroke={M.glass} />
      <path d="M248 104 L276 104 L276 98 L282 98 L282 134 L248 134 Z M436 104 L408 104 L408 98 L402 98 L402 134 L436 134 Z" fill="url(#bb-cut)" stroke="#4e5f6a" />
      <rect x={276} y={98} width={6} height={16} fill={M.nylon} />
      <rect x={402} y={98} width={6} height={16} fill={M.nylon} />
      <path d="M248 134 L436 134 L436 156 L248 156 Z" fill="url(#bb-cut)" stroke="#4e5f6a" opacity="0.6" />
      <path d="M240 162 L444 162 L444 186 L240 186 Z" fill="#cfd6db" stroke={M.steelD} />
      <SL p={[408, 64]} x={430} y={58} text="flat die" />
      <SL p={[440, 176]} x={430} y={208} text="case on a flat or cupped die" />
      <Note x={228} y={244} lines={['Firm, even force, straight down.', 'Tilted, the glass cracks or seats', 'crooked.']} c={C.text} s={10.5} lh={14} />
    </F>
  )
}

/* ================================================================== */
/* basics-water-care · keep a watch water-resistant                      */
/* ================================================================== */

function BbWrRating() {
  const rows = [
    ['30 m / 3 ATM', 'splash-resistant, not swimming', 1],
    ['50 m', 'light swimming', 2],
    ['100 m', 'swimming and snorkelling', 3],
    ['200 m and up', 'diving', 4],
  ]
  return (
    <F h={316} view="Chart · reading a water-resistance rating" scale="trade rule of thumb">
      {rows.map(([a, b, n], i) => {
        const y = 40 + i * 44
        return (
          <g key={a}>
            <rect x={150} y={y} width={60 * n} height={30} rx="4" fill={`rgba(127,182,214,${0.15 + n * 0.1})`} stroke={M.water} />
            <T x={140} y={y + 20} a="end" s={11.5} c={C.text} w={600}>
              {a}
            </T>
            <T x={160 + 60 * n} y={y + 20} s={10.5} c={C.text}>
              {n < 4 ? b : ''}
            </T>
            {n === 4 && (
              <T x={160} y={y + 20} s={10.5} c={C.ground} w={600}>
                {b}
              </T>
            )}
          </g>
        )
      })}
      <rect x={12} y={222} width={456} height={84} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <Note x={24} y={242} lines={['ISO 22810 leaves suitability to each maker: check yours.', 'The figure is a static pressure test, not a depth to chase.', 'Movement, temperature and age all eat into it.']} c={C.text} s={10.5} lh={15} />
      <T x={456} y={298} a="end" s={10} c={C.faint}>a rule of thumb, not a standard</T>
    </F>
  )
}

function BbCrownHome() {
  const St = ({ x, t, ok, pos, screwed }) => (
    <g>
      <Pn x={x} y={26} w={148} h={176} ok={ok} />
      <T x={x + 12} y={46} s={10.5} c={ok ? C.emerald : C.ruby}>
        {t}
      </T>
      <rect x={x + 18} y={82} width={50} height={56} fill="url(#bb-cut)" stroke="#4e5f6a" />
      <rect x={x + 68} y={102} width={26} height={16} fill="url(#sk-steelH)" />
      {Array.from({ length: 7 }, (_, i) => <line key={i} x1={x + 72 + i * 3.2} y1={102} x2={x + 74 + i * 3.2} y2={118} stroke={M.steelD} strokeWidth="0.8" />)}
      <rect x={x + 18} y={107.5} width={84 + pos} height={5} fill="#d6dee3" />
      <path d={`M${x + 80 + pos} 92 L${x + 118 + pos} 92 Q${x + 124 + pos} 92 ${x + 124 + pos} 98 L${x + 124 + pos} 122 Q${x + 124 + pos} 128 ${x + 118 + pos} 128 L${x + 80 + pos} 128 L${x + 80 + pos} 120 L${x + 92 + pos} 120 L${x + 92 + pos} 100 L${x + 80 + pos} 100 Z`} fill="url(#bb-knurl)" stroke={M.steelD} />
      <rect x={x + 92 + pos} y={100} width={4} height={20} fill={M.gasket} />
      {!screwed && pos === 0 && null}
      {pos > 0 && <path d={`M${x + 94} 100 L${x + 94 + pos} 100`} stroke={M.water} strokeWidth="3" strokeDasharray="2 2" />}
    </g>
  )
  return (
    <F h={300} view="Section · screw-down crown" scale="schematic">
      <St x={12} t="pulled out: open door" ok={false} pos={14} />
      <St x={167} t="pushed in, not screwed" ok={false} pos={5} />
      <St x={322} t="screwed fully down" ok pos={-2} screwed />
      <T x={86} y={160} a="middle" s={10.5} c={C.text}>water path past the gasket</T>
      <T x={241} y={160} a="middle" s={10.5} c={C.text}>gasket not compressed</T>
      <T x={396} y={160} a="middle" s={10.5} c={C.text}>gasket squeezed home</T>
      <T x={241} y={176} a="middle" s={10} c={C.faint}>threads not engaged</T>
      <Lab p={[418, 110]} x={430} y={70} text="gasket" up />
      <rect x={12} y={216} width={456} height={70} rx="6" fill="rgba(194,88,99,0.06)" stroke={C.ruby} />
      <Note x={24} y={238} lines={['Never operate the crown in or near water.', 'Screw it fully down before the watch gets wet.']} c={C.text} s={11} lh={16} />
    </F>
  )
}

function BbGasketsHeat() {
  return (
    <F h={316} view="Section · the three gaskets and what ages them" scale="schematic">
      <CaseSec cx={150} y={60} W={220} />
      <SL p={[76, 69]} x={110} y={42} text="crystal gasket" />
      <SL p={[246, 98]} x={300} y={56} text="crown gasket" />
      <rect x={250} y={94} width={4} height={16} fill={M.gasket} />
      <SL p={[70, 118]} x={110} y={170} text="caseback gasket" />

      <Pn x={300} y={78} w={168} h={100} t="New vs tired" />
      <circle cx={340} cy={136} r={16} fill="none" stroke={M.gasket} strokeWidth="7" />
      <circle cx={420} cy={136} r={13} fill="none" stroke="#9a6a4a" strokeWidth="5" />
      <path d="M411 128 l4 3 M426 143 l3 3" stroke={C.ground} strokeWidth="1.2" />
      <T x={340} y={170} a="middle" s={10} c={C.text}>supple</T>
      <T x={420} y={170} a="middle" s={10} c={C.text}>hard, shrunk</T>

      <Sep x1={12} y1={196} x2={468} y2={196} />
      <Pn x={12} y={206} w={456} h={98} t="Hot shower or sauna" tc={C.ruby} />
      {[40, 54, 68].map((x) => <path key={x} d={`M${x} 290 q6 -10 0 -20 q-6 -10 0 -20`} fill="none" stroke={C.ruby} strokeWidth="1.4" opacity="0.7" />)}
      <Note x={96} y={240} lines={['Heat expands the case and can draw moisture', 'past a tired gasket. Keep a watch you care', 'about out of both.']} c={C.text} s={11} lh={15} />
    </F>
  )
}

function BbReseal() {
  const steps = [
    ['Inspect', 'the gasket'],
    ['Grease lightly', 'with silicone'],
    ['Seat the back', 'squarely'],
    ['Splash-only', 'until tested'],
  ]
  return (
    <F h={300} view="Sequence · after any opening" scale="schematic">
      {steps.map(([a, b], i) => {
        const x = 12 + i * 116
        return (
          <g key={a}>
            <Pn x={x} y={26} w={110} h={180} />
            <Num x={x + 16} y={44} n={i + 1} r={8} />
            <T x={x + 55} y={176} a="middle" s={10.5} c={C.text}>
              {a}
            </T>
            <T x={x + 55} y={190} a="middle" s={10} c={C.dim}>
              {b}
            </T>
          </g>
        )
      })}
      <circle cx={67} cy={110} r={30} fill="none" stroke={M.gasket} strokeWidth="6" />
      <circle cx={92} cy={86} r={11} fill="rgba(0,0,0,0.2)" stroke={C.brass} strokeWidth="1.4" />
      <T x={67} y={156} a="middle" s={10} c={C.faint}>no cuts, no flats</T>
      <circle cx={183} cy={110} r={30} fill="none" stroke={M.gasket} strokeWidth="6" />
      <circle cx={183} cy={110} r={30} fill="none" stroke={M.grease} strokeWidth="2" strokeDasharray="2 3" />
      <path d="M205 80 q8 -8 16 -4" stroke={M.grease} strokeWidth="3" fill="none" />
      <T x={183} y={156} a="middle" s={10} c={C.faint}>a thin film</T>
      <rect x={252} y={100} width={80} height={10} fill="url(#bb-cut)" />
      <rect x={258} y={110} width={68} height={22} fill="url(#bb-cut)" opacity="0.6" />
      <Arrow a={[292, 70]} b={[292, 94]} c="brass" w={1.8} />
      <T x={292} y={156} a="middle" s={10} c={C.faint}>level, not tilted</T>
      <path d={`M${404} 74 q4 8 0 12 q-4 -4 0 -12`} fill={M.water} />
      <path d={`M${386} 84 q4 8 0 12 q-4 -4 0 -12`} fill={M.water} />
      <Face cx={410} cy={120} r={24} lugs={false} />
      <T x={410} y={156} a="middle" s={10} c={C.faint}>no swimming yet</T>
      <rect x={12} y={220} width={456} height={64} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <Note x={24} y={242} lines={['Every battery change or caseback removal breaks the seal.', 'Only a pressure test makes the rating real again.']} c={C.text} s={11} lh={16} />
    </F>
  )
}

function BbPressureTest() {
  return (
    <F h={326} view="Comparison · testing the seal" scale="schematic">
      <Pn x={12} y={26} w={226} h={170} t="Dry (air-pressure) test" />
      <rect x={52} y={60} width={146} height={92} rx="10" fill="rgba(255,255,255,0.04)" stroke={C.struct} strokeWidth="1.4" />
      <Face cx={125} cy={112} r={26} lugs={false} />
      {[[70, 76], [180, 76], [70, 140], [180, 140]].map(([x, y], i) => (
        <Arrow key={i} a={[x, y]} b={[x + (x < 125 ? 16 : -16), y + (y < 112 ? 12 : -12)]} c="steel" w={1.4} />
      ))}
      <T x={125} y={176} a="middle" s={10.5} c={C.text}>air pressure, case must not flex</T>
      <Pn x={248} y={26} w={220} h={170} t="Wet test" />
      <rect x={290} y={70} width={136} height={84} rx="6" fill="rgba(127,182,214,0.25)" stroke={M.water} />
      <Face cx={358} cy={118} r={22} lugs={false} />
      {[0, 1, 2].map((i) => <circle key={i} cx={384 + i * 3} cy={96 - i * 10} r={2.4} fill="none" stroke="#e6f2f8" />)}
      <T x={358} y={176} a="middle" s={10.5} c={C.text}>bubbles show a leak</T>

      <Tag x={12} y={220}>When</Tag>
      <line x1={40} y1={252} x2={440} y2={252} stroke={C.struct} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx={60 + i * 120} cy={252} r={6} fill={C.ground} stroke={C.brass} strokeWidth="1.4" />
          <T x={60 + i * 120} y={274} a="middle" s={10} c={C.dim}>
            {i === 0 ? 'at service' : 'about a year on'}
          </T>
        </g>
      ))}
      <T x={14} y={306} s={10.5} c={C.text}>“Was 200 m when new” is only as good as today’s gaskets.</T>
    </F>
  )
}

/* ================================================================== */
/* build-plan · plan your build and choose parts                          */
/* ================================================================== */

// Movement seen from the dial side, schematic: plate, date ring, centre arbor, dial-foot holes
function MovPlan({ cx, cy, r, feet = [], stem = true, dateRing = true, label }) {
  return (
    <g>
      {stem && <rect x={cx + r - 2} y={cy - 2.5} width={r * 0.45} height={5} rx="1" fill="url(#sk-steelH)" />}
      <circle cx={cx} cy={cy} r={r} fill={M.plate} stroke={C.brass} strokeWidth="1.2" />
      {dateRing && <circle cx={cx} cy={cy} r={r * 0.8} fill="none" stroke={M.dial} strokeWidth={r * 0.14} opacity="0.55" />}
      <circle cx={cx} cy={cy} r={r * 0.12} fill="#3e3a30" stroke={C.brass} strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r={2.4} fill={C.brassHi} />
      {feet.map((deg, i) => {
        const [x, y] = clk(cx, cy, r * 0.9, deg)
        return <circle key={i} cx={x} cy={y} r={3.2} fill={M.ink} stroke={C.brassHi} strokeWidth="1" />
      })}
      {label && (
        <T x={cx} y={cy + r + 16} a="middle" s={10.5} c={C.dim}>
          {label}
        </T>
      )}
    </g>
  )
}

function BbCaseMatch() {
  return (
    <F h={316} view="Plan · case from the back, movement fitted" scale="schematic">
      <Pn x={12} y={26} w={226} h={212} t="Made for the family" tc={C.emerald} ok />
      {[-1, 1].map((d) => [-1, 1].map((e) => <rect key={d + '' + e} x={125 + d * 40 - 9} y={e < 0 ? 58 : 196} width={18} height={20} rx="4" fill="url(#sk-steel)" />))}
      <circle cx={125} cy={137} r={72} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={125} cy={137} r={60} fill="#1f1c19" />
      <MovPlan cx={125} cy={137} r={58} dateRing={false} stem={false} />
      <rect x={183} y={134} width={30} height={5} fill="url(#sk-steelH)" />
      <rect x={196} y={128} width={14} height={18} rx="3" fill="url(#bb-knurl)" />
      <Dim a={[94, 230]} b={[156, 230]} off={0} text="lug width" />
      <T x={125} y={168} a="middle" s={10} c={C.text}>movement</T>

      <Pn x={244} y={26} w={224} h={212} t="Wrong family" tc={C.ruby} ok={false} />
      <circle cx={356} cy={137} r={72} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={356} cy={137} r={62} fill="#1f1c19" />
      <circle cx={356} cy={137} r={62} fill="none" stroke={M.nylon} strokeWidth="9" opacity="0.7" />
      <MovPlan cx={350} cy={137} r={48} dateRing={false} stem={false} />
      <rect x={398} y={134} width={14} height={5} fill="url(#sk-steelH)" />
      <rect x={428} y={128} width={14} height={18} rx="3" fill="url(#bb-knurl)" opacity="0.6" />
      <Lab p={[300, 104]} x={300} y={60} text="ring doesn’t fit" up />
      <Lab p={[414, 136]} x={420} y={222} text="stem too short" a="end" />

      <T x={14} y={264} s={11} c={C.text}>Buy the case for your movement family, or you fight movement rings</T>
      <T x={14} y={280} s={11} c={C.text}>and stem lengths. Write down the case’s movement size and lug width.</T>
    </F>
  )
}

// Side view of the hand stack on its arbors (centre at cx, dial at y)
function HandStack({ cx, y, k = 1, sec = true, gapOk = true }) {
  return (
    <g>
      <rect x={cx - 120 * k} y={y} width={240 * k} height={6 * k} fill={M.dial} />
      {/* hour wheel pipe, cannon pinion, seconds pinion */}
      <rect x={cx - 9 * k} y={y - 14 * k} width={18 * k} height={20 * k} fill={M.brassP} stroke={M.brassD} strokeWidth="0.6" />
      <rect x={cx - 5.5 * k} y={y - 32 * k} width={11 * k} height={38 * k} fill="url(#sk-steelH)" stroke={M.steelD} strokeWidth="0.6" />
      <rect x={cx - 1.6 * k} y={y - 50 * k} width={3.2 * k} height={56 * k} fill="#e3e8eb" />
      {/* hands */}
      <rect x={cx - 30 * k} y={y - 14 * k} width={100 * k} height={3 * k} fill={C.brassHi} />
      <rect x={cx - 30 * k} y={y - 32 * k} width={140 * k} height={2.6 * k} fill={C.brassHi} />
      {sec && <rect x={cx - 36 * k} y={y - (gapOk ? 50 : 36) * k} width={150 * k} height={1.6 * k} fill={C.ruby} />}
    </g>
  )
}

function BbDialHandsMatch() {
  return (
    <F h={316} view="Plan and side view · dial and hands" scale="schematic">
      <Pn x={12} y={26} w={210} h={238} t="Dial" />
      <MovPlan cx={86} cy={128} r={52} feet={[60, 240]} stem={false} />
      <circle cx={86} cy={128} r={56} fill="none" stroke={M.dial} strokeWidth="1.2" strokeDasharray="4 3" />
      {[60, 240].map((d) => {
        const [x, y] = clk(86, 128, 46.8, d)
        return <line key={d} x1={x} y1={y} x2={x} y2={y - 1} stroke={C.brassHi} />
      })}
      <Lab p={clk(86, 128, 46.8, 60)} x={170} y={84} text="foot holes" up a="middle" />
      <Dim a={[30, 200]} b={[142, 200]} off={0} text="dial diameter" />
      <Note x={24} y={226} lines={['feet must land on the holes,', 'diameter must fit the case']} c={C.text} s={10.5} lh={14} />

      <Pn x={232} y={26} w={236} h={238} t="Hands, side view" />
      <HandStack cx={300} y={170} k={1} />
      <SL p={[302, 120]} x={330} y={60} text="seconds arbor" sub="finest" />
      <SL p={[305, 140]} x={360} y={96} text="minute pinion" />
      <SL p={[309, 160]} x={360} y={128} text="hour wheel pipe" />
      <Note x={244} y={204} lines={['each hand’s hole must match', 'its arbor: three sizes, quoted', 'in millimetres. Measure and', 'cross-check.']} c={C.text} s={10.5} lh={14} />
      <T x={14} y={290} s={10.5} c={C.dim}>Sizes are on the next step. Parts drawn schematically, not one calibre.</T>
    </F>
  )
}

function BbHandHoles() {
  const rows = [
    ['NH35', '150', '90', '21'],
    ['ETA 2824', '150', '90', '25'],
    ['Miyota', '152', '100', '17'],
  ]
  return (
    <F h={330} view="Table · hand-hole sizes (hour / minute / seconds)" scale="forum figures">
      <Pn x={12} y={26} w={290} h={138} t="Listed in hundredths of a mm" />
      {['', 'hour', 'min', 'sec'].map((h, j) => (
        <T key={h} x={110 + j * 56 - (j ? 0 : 0)} y={60} a={j ? 'middle' : 'start'} s={10} c={C.faint}>
          {h}
        </T>
      ))}
      {rows.map((r, i) => (
        <g key={r[0]}>
          <T x={24} y={84 + i * 24} s={11} c={C.text} w={600}>
            {r[0]}
          </T>
          {r.slice(1).map((v, j) => (
            <T key={j} x={166 + j * 56} y={84 + i * 24} a="middle" s={11.5} c={i === 0 ? C.brassHi : C.text} mono>
              {v}
            </T>
          ))}
        </g>
      ))}
      <rect x={24} y={68} width={268} height={22} rx="3" fill="none" stroke={C.brass} strokeWidth="0.8" />
      <T x={24} y={156} s={10.5} c={C.brassHi}>NH35 = 1.50, 0.90 and 0.21 mm</T>

      <Pn x={310} y={26} w={158} h={138} t="NH35 holes, to scale" />
      {[
        [1.5, 'hour 1.50'],
        [0.9, 'min 0.90'],
        [0.21, 'sec 0.21'],
      ].map(([d, l], i) => (
        <g key={l}>
          <circle cx={346} cy={70 + i * 34} r={(d * 26) / 2} fill={M.ink} stroke={C.brassHi} strokeWidth="1" />
          <T x={378} y={74 + i * 34} s={10.5} c={C.text} mono>
            {l}
          </T>
        </g>
      ))}

      <Pn x={12} y={174} w={456} h={110} t="Seiko (NH35) hands on another movement" />
      {['hour', 'minute', 'seconds'].map((h, j) => (
        <T key={h} x={196 + j * 80} y={210} a="middle" s={10} c={C.faint}>
          {h}
        </T>
      ))}
      <T x={24} y={236} s={11} c={C.text}>on ETA 2824</T>
      <T x={24} y={264} s={11} c={C.text}>on Miyota</T>
      {[true, true, false].map((ok, j) => <Verdict key={j} x={196 + j * 80} y={232} ok={ok} r={8} />)}
      {[false, false, false].map((ok, j) => <Verdict key={j} x={196 + j * 80} y={260} ok={ok} r={8} />)}
      <T x={420} y={236} a="middle" s={10} c={C.dim}>0.21 vs 0.25</T>
      <T x={14} y={304} s={10.5} c={C.dim}>Forum figures from one list: confirm with your supplier.</T>
      <T x={14} y={320} s={10.5} c={C.dim}>No hole sizes in the listing? Ask before you buy.</T>
    </F>
  )
}

function BbPartsList() {
  const items = ['Movement', 'Dial', 'Hands', 'Case', 'Crystal', 'Gaskets', 'Stem', 'Crown']
  const specs = ['calibre, date position', 'feet, diameter', 'hole sizes', 'movement size, lug width', 'size, type', 'case, back, crown', 'length, thread', 'thread, tube']
  return (
    <F h={330} view="Checklist · the build list" scale="schematic">
      <rect x={20} y={30} width={300} height={290} rx="4" fill="#e9e1c6" />
      <T x={36} y={52} s={12} c="#2a241c" w={700}>My build</T>
      <T x={186} y={52} s={10} c="#5d5446">checked against movement</T>
      {items.map((it, i) => (
        <g key={it}>
          <line x1={36} y1={64 + i * 32} x2={304} y2={64 + i * 32} stroke="#c9bfa5" />
          <rect x={36} y={74 + i * 32} width={12} height={12} rx="2" fill="none" stroke="#5d5446" />
          <path d={`M38 ${80 + i * 32} l3 3 l6 -7`} fill="none" stroke="#3f7a4a" strokeWidth="1.8" />
          <T x={56} y={85 + i * 32} s={11.5} c="#2a241c" w={600}>
            {it}
          </T>
          <T x={140} y={85 + i * 32} s={10.5} c="#5d5446">
            {specs[i]}
          </T>
        </g>
      ))}
      <Note x={336} y={70} lines={['Write every', 'part out.', '', 'Confirm each', 'spec against the', 'movement', 'before ordering.']} c={C.text} s={11} lh={16} />
      <T x={336} y={250} s={10} c={C.faint}>the movement is</T>
      <T x={336} y={263} s={10} c={C.faint}>the reference for</T>
      <T x={336} y={276} s={10} c={C.faint}>every other part</T>
    </F>
  )
}

/* ================================================================== */
/* build-first-kit · choosing a beginner kit                              */
/* ================================================================== */

function BbWhyKit() {
  const Part = ({ x, y, t }) => <Bx x={x} y={y} w={76} h={24} l={[t]} s={10.5} />
  return (
    <F h={300} view="Comparison · kit or loose parts" scale="schematic">
      <Pn x={12} y={26} w={226} h={230} t="Curated kit" tc={C.emerald} ok />
      <rect x={34} y={56} width={182} height={120} rx="8" fill="rgba(123,165,131,0.08)" stroke={C.emerald} />
      <Part x={44} y={68} t="movement" />
      <Part x={130} y={68} t="case" />
      <Part x={44} y={104} t="dial" />
      <Part x={130} y={104} t="hands" />
      <Part x={87} y={140} t="all matched" />
      <Fl a={[125, 180]} b={[125, 204]} c="emerald" />
      <T x={125} y={222} a="middle" s={10.5} c={C.text}>your effort goes into</T>
      <T x={125} y={236} a="middle" s={10.5} c={C.text}>the assembly skills</T>

      <Pn x={248} y={26} w={220} h={230} t="Loose parts" tc={C.ruby} />
      <Part x={262} y={60} t="movement" />
      <Part x={378} y={74} t="case" />
      <Part x={270} y={140} t="dial" />
      <Part x={378} y={150} t="hands" />
      {[[338, 72, 378, 84], [310, 84, 304, 140], [338, 76, 384, 150], [346, 152, 378, 160], [416, 98, 416, 150]].map(([a, b, c, d], i) => (
        <g key={i}>
          <line x1={a} y1={b} x2={c} y2={d} stroke={C.ruby} strokeDasharray="3 3" />
          <T x={(a + c) / 2 + 4} y={(b + d) / 2} s={11} c={C.ruby} w={700}>?</T>
        </g>
      ))}
      <T x={358} y={208} a="middle" s={10.5} c={C.text}>every pair a</T>
      <T x={358} y={222} a="middle" s={10.5} c={C.text}>millimetre-matching puzzle</T>
      <T x={14} y={282} s={11} c={C.text}>For a first build, learn to assemble before you learn to match.</T>
    </F>
  )
}

function BbKitContents() {
  return (
    <F h={316} view="Plan · what a good kit includes" scale="schematic">
      <rect x={20} y={30} width={440} height={220} rx="10" fill="#2a2622" stroke={C.struct} />
      {[[40, 46, 128, 110], [182, 46, 128, 110], [324, 46, 120, 110], [40, 170, 128, 66], [182, 170, 128, 66], [324, 170, 120, 66]].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} rx="6" fill="#1d1a17" stroke="#3b352e" />
      ))}
      <MovPlan cx={104} cy={100} r={38} />
      <circle cx={246} cy={100} r={42} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={246} cy={100} r={32} fill="url(#bb-acr)" stroke={M.glass} />
      <circle cx={246} cy={100} r={36} fill="none" stroke={M.gasket} strokeWidth="2" />
      <circle cx={384} cy={100} r={38} fill={M.dialDark} stroke={C.struct} />
      {Array.from({ length: 12 }, (_, i) => {
        const [a, b] = clk(384, 100, 33, i * 30)
        const [c2, d2] = clk(384, 100, 26, i * 30)
        return <line key={i} x1={a} y1={b} x2={c2} y2={d2} stroke={C.dim} strokeWidth="1.4" />
      })}
      <path d="M60 204 L130 200 L60 196 Z" fill={C.brassHi} />
      <path d="M60 222 L150 219 L60 216 Z" fill={C.brassHi} />
      <line x1={190} y1={204} x2={290} y2={204} stroke="#e3e8eb" strokeWidth="2" />
      <rect x={286} y={196} width={14} height={16} rx="3" fill="url(#bb-knurl)" />
      <rect x={340} y={190} width={90} height={30} rx="3" fill="#e9e1c6" />
      <T x={385} y={210} a="middle" s={10.5} c="#2a241c" w={600} mono>NH35</T>
      <T x={104} y={150} a="middle" s={10.5} c={C.text}>movement</T>
      <T x={246} y={150} a="middle" s={10.5} c={C.text}>case, crystal, gaskets</T>
      <T x={384} y={150} a="middle" s={10.5} c={C.text}>dial, sized to it</T>
      <T x={104} y={232} a="middle" s={10.5} c={C.text}>hands, sized to it</T>
      <T x={246} y={232} a="middle" s={10.5} c={C.text}>stem and crown</T>
      <T x={384} y={232} a="middle" s={10.5} c={C.brassHi}>bonus: exact calibre</T>
      <T x={14} y={276} s={11} c={C.text}>Missing a gasket, the stem or the calibre name? Ask before you buy.</T>
      <T x={14} y={294} s={10} c={C.faint}>Label shown as an example of a named calibre.</T>
    </F>
  )
}

function BbSeikoMod() {
  const spokes = [
    ['dials', 0],
    ['hands', 90],
    ['bezels', 180],
    ['cases', 270],
  ]
  return (
    <F h={300} view="Chart · the Seiko mod ecosystem" scale="schematic">
      <circle cx={240} cy={150} r={56} fill="rgba(208,168,79,0.1)" stroke={C.brass} strokeWidth="1.6" />
      <MovPlan cx={240} cy={150} r={40} stem={false} />
      <T x={300} y={208} s={11} c={C.brassHi} w={600}>NH35 / NH36</T>
      {[
        ['dials', 240, 52, 240, 94, 240, 67],
        ['hands', 392, 150, 296, 150, 336, 150],
        ['bezels', 240, 256, 240, 206, 240, 241],
        ['cases', 88, 150, 184, 150, 144, 150],
      ].map(([t, x, y, x1, y1, x2, y2]) => (
        <g key={t}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.struct} strokeWidth="1.4" />
          <Bx x={x - 56} y={y - 15} w={112} h={30} l={[`aftermarket ${t}`]} s={10.5} />
        </g>
      ))}
      <Note x={14} y={60} lines={['Enormous', 'parts', 'ecosystem']} c={C.text} s={11} lh={15} />
      <Note x={340} y={232} lines={['community guides', 'for almost every', 'combination']} c={C.dim} s={10.5} lh={14} />
      <T x={14} y={288} s={10.5} c={C.dim}>Mix parts designed for the NH35/NH36: they fit each other by design.</T>
    </F>
  )
}

function BbKitTools() {
  return (
    <F h={316} view="Tools · still needed with a kit" scale="schematic">
      {[
        ['spring-bar tool', 0],
        ['hand levers', 1],
        ['hand pusher', 2],
        ['movement holder', 3],
        ['case press', 4],
      ].map(([t, i]) => {
        const x = 12 + i * 92
        return (
          <g key={t}>
            <Pn x={x} y={26} w={86} h={220} />
            <T x={x + 43} y={232} a="middle" s={10.5} c={C.text}>
              {t}
            </T>
          </g>
        )
      })}
      <G x={55} y={190} ang={0}>
        <SBTool len={130} />
      </G>
      <G x={140} y={196} ang={-6}>
        <HandLever len={120} />
      </G>
      <G x={156} y={196} ang={6}>
        <HandLever len={120} />
      </G>
      <G x={241} y={200}>
        <Pusher len={130} />
      </G>
      <rect x={292} y={112} width={78} height={60} rx="6" fill="url(#bb-cut)" stroke="#4e5f6a" />
      <circle cx={331} cy={142} r={22} fill={M.plate} stroke={C.brass} />
      {[-1, 1].map((d) => <rect key={d} x={331 + d * 26 - 4} y={136} width={8} height={12} fill="url(#sk-steelH)" />)}
      <rect x={384} y={190} width={72} height={14} rx="2" fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={440} y={74} width={12} height={118} fill="url(#sk-steelH)" stroke={M.steelD} />
      <rect x={390} y={74} width={62} height={14} rx="2" fill="url(#sk-steel)" stroke={M.steelD} />
      <rect x={406} y={88} width={10} height={40} fill="url(#sk-steelH)" />
      <rect x={398} y={128} width={26} height={10} rx="2" fill="#cfd6db" stroke={M.steelD} />
      <rect x={398} y={176} width={26} height={14} rx="2" fill="#cfd6db" stroke={M.steelD} />
      <rect x={402} y={164} width={18} height={12} rx="4" fill="url(#sk-steel)" />
      <rect x={444} y={56} width={4} height={18} fill={C.struct} />
      <T x={410} y={60} a="middle" s={10} c={C.brassHi}>ideally</T>
      <rect x={12} y={256} width={456} height={48} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={276} s={11} c={C.text}>The full starter bench is in the Workshop track.</T>
      <T x={24} y={292} s={10.5} c={C.dim}>A kit replaces matching parts, not tools.</T>
    </F>
  )
}

function BbKitInspect() {
  const checks = [
    ['Wind it', 'it must run'],
    ['Crown through', 'each position'],
    ['Hands set,', 'date changes'],
    ['Dial feet drop in', 'don’t lock them'],
    ['Offer each hand', 'don’t press'],
    ['Crown on the', 'stem thread'],
    ['Count the', 'gaskets'],
  ]
  return (
    <F h={330} view="Checklist · the day the kit arrives" scale="schematic">
      {checks.map(([a, b], i) => {
        const col = i % 4
        const row = Math.floor(i / 4)
        const x = 12 + col * 116
        const y = 26 + row * 106
        return (
          <g key={a}>
            <Pn x={x} y={y} w={110} h={98} />
            <Num x={x + 16} y={y + 16} n={i + 1} r={8} />
            <T x={x + 55} y={y + 72} a="middle" s={10.5} c={C.text}>
              {a}
            </T>
            <T x={x + 55} y={y + 86} a="middle" s={10} c={C.dim}>
              {b}
            </T>
          </g>
        )
      })}
      {/* small glyphs */}
      <MovPlan cx={67} cy={62} r={18} stem={false} dateRing={false} />
      <Turn cx={67} cy={62} r={24} from={30} to={110} />
      <CrownSide x={196} y={64} pos={2} k={0.8} />
      <Face cx={299} cy={60} r={20} lugs={false} date="1" />
      <MovPlan cx={415} cy={60} r={20} feet={[60, 240]} stem={false} />
      <HandStack cx={67} y={174} k={0.32} sec={false} />
      <line x1={140} y1={174} x2={200} y2={174} stroke="#e3e8eb" strokeWidth="2" />
      {Array.from({ length: 6 }, (_, i) => <line key={i} x1={186 + i * 3} y1={170} x2={188 + i * 3} y2={178} stroke={M.steelD} />)}
      <rect x={200} y={166} width={14} height={16} rx="3" fill="url(#bb-knurl)" />
      {[0, 1, 2].map((i) => <circle key={i} cx={278 + i * 22} cy={168} r={8} fill="none" stroke={M.gasket} strokeWidth="2.4" />)}
      <rect x={360} y={132} width={108} height={98} rx="8" fill="rgba(194,88,99,0.06)" stroke={C.ruby} />
      <Note x={372} y={156} lines={['Anything fails?', 'Return it now,', 'while it’s', 'untouched.']} c={C.text} s={10.5} lh={14} />
      <T x={14} y={260} s={10.5} c={C.text}>Do it the day it arrives, not on build day.</T>
      <T x={14} y={280} s={10.5} c={C.dim}>Cheap clones deserve extra care: some Sea-Gull ST2130 units</T>
      <T x={14} y={294} s={10.5} c={C.dim}>have been reported as unoiled or dirty.</T>
    </F>
  )
}

/* ================================================================== */
/* build-dial-hands · fit the dial and hands                              */
/* ================================================================== */

function BbCleanSetup() {
  return (
    <F h={316} view="Bench · clean setup before the dial" scale="schematic">
      <rect x={20} y={200} width={300} height={10} fill="url(#sk-wood)" />
      {/* movement in holder */}
      <rect x={60} y={176} width={110} height={24} rx="4" fill="url(#bb-cut)" stroke="#4e5f6a" />
      <rect x={76} y={168} width={78} height={10} fill={M.plate} stroke={C.brass} />
      <G x={140} y={160} ang={50}>
        <Blower />
      </G>
      <Arrow a={[130, 158]} b={[114, 168]} c="steel" w={1.4} />
      {/* dial face-down on a clean cloth */}
      <rect x={200} y={194} width={100} height={6} rx="2" fill={M.cloth} />
      <rect x={214} y={186} width={72} height={8} fill={M.dial} />
      <rect x={228} y={194} width={3} height={4} fill={C.brassHi} />
      <rect x={270} y={194} width={3} height={4} fill={C.brassHi} />
      {/* finger cot */}
      <path d="M220 120 Q226 96 238 100 Q248 104 244 130 L232 150 Z" fill="#d8b49a" />
      <path d="M222 118 Q228 98 238 102 Q246 106 242 126 Z" fill="rgba(240,230,200,0.6)" stroke="#d9cfb2" />
      <Lab p={[90, 172]} x={60} y={110} text="blow down the movement" up a="start" />
      <Lab p={[250, 188]} x={300} y={240} text="dial face-down until you fit it" a="end" />
      <Lab p={[234, 110]} x={284} y={80} text="finger cots" up />
      <Pn x={334} y={26} w={134} h={200} t="Dust under glass" tc={C.ruby} />
      <Face cx={401} cy={110} r={40} lugs={false} />
      {[[380, 92], [418, 124], [396, 136], [424, 96]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.6} fill="#f2ede0" />)}
      <Note x={346} y={176} lines={['the most common', 'build disappointment']} c={C.text} s={10.5} lh={14} />
      <T x={14} y={270} s={11} c={C.text}>Blow everything down, wear finger cots, keep the dial face-down</T>
      <T x={14} y={286} s={11} c={C.text}>until the moment it goes on.</T>
    </F>
  )
}

function BbDialFit() {
  return (
    <F h={326} view="Section · dial foot locked in the movement" scale="schematic, magnified">
      <Pn x={12} y={26} w={250} h={200} t="Seat and lock" />
      <rect x={36} y={66} width={200} height={10} fill={M.dial} />
      <rect x={30} y={76} width={210} height={82} fill="url(#bb-mov)" />
      <rect x={74} y={76} width={10} height={50} fill={M.ink} />
      <rect x={76} y={76} width={6} height={46} fill={C.brassHi} />
      <rect x={84} y={96} width={60} height={10} fill="url(#sk-steelH)" />
      <path d="M84 96 L80 101 L84 106 Z" fill="#e3e8eb" />
      <rect x={140} y={92} width={12} height={18} rx="2" fill="url(#bb-knurl)" />
      <Lab p={[150, 70]} x={180} y={48} text="dial, flat on the plate" up />
      <Lab p={[79, 116]} x={60} y={190} text="dial foot in its hole" />
      <Lab p={[120, 101]} x={176} y={190} text="side-screw clamps it" />

      <Pn x={272} y={26} w={196} h={200} t="Date window lined up" />
      <Face cx={370} cy={124} r={62} h={300} m={60} lugs={false} date="12" />
      <rect x={399} y={111.6} width={24.8} height={24.8} fill="none" stroke={C.emerald} strokeWidth="1.4" />
      <Verdict x={444} y={104} ok r={7} />
      <T x={370} y={214} a="middle" s={10.5} c={C.text}>numeral centred in the cut-out</T>

      <Sep x1={12} y1={236} x2={468} y2={236} />
      <Num x={24} y={258} n={1} r={8} />
      <T x={38} y={262} s={10.5} c={C.text}>Feet into their holes</T>
      <Num x={186} y={258} n={2} r={8} />
      <T x={200} y={262} s={10.5} c={C.text}>Lock: side-screws or clamps</T>
      <Num x={24} y={290} n={3} r={8} />
      <T x={38} y={294} s={10.5} c={C.text}>Flat? Date window lined up?</T>
      <T x={14} y={318} s={10} c={C.faint}>Clamp style varies by movement; the locking idea is the same.</T>
    </F>
  )
}

function BbDialCheck() {
  return (
    <F h={330} view="Inspection · the dial before any hand" scale="schematic">
      <Pn x={12} y={26} w={220} h={130} t="Flat, no gap" />
      <rect x={30} y={98} width={180} height={18} fill="url(#bb-mov)" />
      <rect x={30} y={92} width={180} height={6} fill={M.dial} />
      <path d="M140 84 Q150 74 166 78" stroke={C.brass} fill="none" />
      <Ring x={176} y={66} r={14} />
      <T x={30} y={136} s={10.5} c={C.text}>loupe across the dial edge</T>

      <Pn x={240} y={26} w={228} h={130} t="NH35 dial thickness" />
      {[
        [0.4, 'ideal', C.emerald],
        [0.6, 'practical limit', C.brassHi],
      ].map(([t, l, c], i) => (
        <g key={l}>
          <rect x={262} y={70 + i * 40} width={80} height={t * 30} fill={M.dial} stroke={c} />
          <T x={352} y={70 + i * 40 + 10} s={11} c={c} mono>
            {t} mm
          </T>
          <T x={352} y={70 + i * 40 + 24} s={10} c={C.dim}>
            {l}
          </T>
        </g>
      ))}
      <T x={252} y={150} s={10} c={C.faint}>thicker uses up the room for the hands</T>

      <Pn x={12} y={164} w={220} h={154} t="Quick-set" />
      <CrownSide x={60} y={220} pos={1} k={1} />
      <Note x={30} y={262} lines={['date moves freely and', 'sits in the window', 'gone stiff? dial off, look;', 'don’t force it']} c={C.text} s={10.5} lh={14} />
      <T x={140} y={210} s={10} c={C.faint}>NH34: dial washer</T>
      <T x={140} y={222} s={10} c={C.faint}>or tight centre hole</T>

      <Pn x={240} y={164} w={228} h={154} t="Find the hands’ 12:00" />
      <Face cx={300} cy={236} r={40} lugs={false} date="15" nh />
      <Note x={350} y={210} lines={['Turn the crown', 'until the date', 'flips. That', 'moment, not', 'noon, is 12:00.']} c={C.text} s={10.5} lh={14} />
      <T x={300} y={300} a="middle" s={10} c={C.dim}>no hands yet: the</T>
      <T x={300} y={312} a="middle" s={10} c={C.dim}>date tells the time</T>
    </F>
  )
}

function BbSecondHand() {
  return (
    <F h={316} view="Side view · seconds hand last" scale="height exaggerated">
      <HandStack cx={170} y={200} k={1.4} />
      <G x={170} y={126}>
        <Pusher d={9} len={84} />
      </G>
      <Arrow a={[196, 60]} b={[196, 100]} c="brass" w={1.6} />
      <T x={204} y={74} s={10.5} c={C.brassHi}>gentlest touch</T>
      <Dim a={[340, 130]} b={[340, 155]} off={-8} text="" />
      <SL p={[300, 130]} x={360} y={118} text="clear of the minute hand" />
      <SL p={[172, 136]} x={110} y={110} text="finest central arbor" />
      <SL p={[300, 155]} x={360} y={182} text="minute hand" />
      <Pn x={12} y={232} w={456} h={72} t="Then check" />
      <Turn cx={50} cy={274} r={18} from={20} to={320} />
      <T x={80} y={272} s={10.5} c={C.text}>it spins freely all the way round</T>
      <T x={80} y={288} s={10.5} c={C.text}>and never fouls the minute hand</T>
      <T x={456} y={288} a="end" s={10} c={C.faint}>watch from the side</T>
    </F>
  )
}

/* ================================================================== */
/* build-case · case the movement and fit the stem                        */
/* ================================================================== */

function BbSeatMovement() {
  return (
    <F h={316} view="Plan · movement into the case, dial-up" scale="schematic">
      <circle cx={170} cy={156} r={110} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={170} cy={156} r={96} fill="#1f1c19" />
      <circle cx={170} cy={156} r={92} fill="none" stroke={M.nylon} strokeWidth="10" opacity="0.6" />
      <circle cx={170} cy={156} r={80} fill={M.dialDark} stroke={C.struct} />
      {Array.from({ length: 12 }, (_, i) => {
        const [a, b] = clk(170, 156, 74, i * 30)
        const [c2, d2] = clk(170, 156, 64, i * 30)
        return <line key={i} x1={a} y1={b} x2={c2} y2={d2} stroke={C.dim} strokeWidth="1.6" />
      })}
      <rect x={266} y={152} width={26} height={8} fill="url(#sk-steelH)" />
      <rect x={280} y={146} width={10} height={20} fill="none" stroke={C.steel} strokeDasharray="2 2" />
      <line x1={180} y1={156} x2={300} y2={156} stroke={C.emerald} strokeDasharray="5 3" strokeWidth="1.2" />
      <SL p={[248, 156]} x={320} y={120} text="stem hole" />
      <SL p={[284, 156]} x={320} y={160} text="case tube, on the same line" />
      <SL p={[256, 110]} x={320} y={80} text="movement ring, if needed" />
      <T x={170} y={196} a="middle" s={10.5} c={C.text}>dial up</T>
      <Turn cx={170} cy={156} r={52} from={60} to={100} c="steel" />
      <T x={320} y={210} s={10.5} c={C.dim}>rotate till the</T>
      <T x={320} y={224} s={10.5} c={C.dim}>holes line up</T>
      <T x={14} y={300} s={10.5} c={C.dim}>Drawn without the hands for clarity.</T>
    </F>
  )
}

function BbCrownThread() {
  return (
    <F h={316} view="Side view · crown onto the trimmed stem" scale="schematic, magnified">
      <rect x={40} y={80} width={190} height={10} fill="#e3e8eb" />
      {Array.from({ length: 10 }, (_, i) => <line key={i} x1={200 + i * 3} y1={80} x2={202 + i * 3} y2={90} stroke={M.steelD} />)}
      <circle cx={214} cy={76} r={3} fill="#7fc4a8" />
      <path d="M244 60 L300 60 Q308 60 308 68 L308 102 Q308 110 300 110 L244 110 Z" fill="url(#bb-knurl)" stroke={M.steelD} />
      <rect x={244} y={78} width={30} height={14} fill={M.ink} />
      <Turn cx={276} cy={85} r={36} from={30} to={150} />
      <Arrow a={[262, 130]} b={[240, 130]} c="brass" w={1.6} />
      <Lab p={[214, 76]} x={170} y={44} text="tiny drop of thread-lock" sub="Loctite 603" up />
      <Lab p={[120, 85]} x={120} y={120} text="trimmed stem" />
      <Pn x={12} y={156} w={456} h={150} t="Then insert and test every position" />
      {[0, 1, 2].map((p, i) => (
        <g key={p}>
          <CrownSide x={70 + i * 150} y={220} pos={p} k={1} />
          <T x={60 + i * 150} y={268} a="middle" s={10.5} c={C.text}>
            {['pushed in: winds', 'one out: sets the date', 'two out: sets the time'][i]}
          </T>
          <Verdict x={120 + i * 150} y={196} ok r={7} />
        </g>
      ))}
      <T x={24} y={292} s={10} c={C.faint}>On a date movement. A no-date movement has two positions.</T>
    </F>
  )
}

function BbSecureMovement() {
  return (
    <F h={316} view="Plan · from the back, casing clamps" scale="schematic">
      <circle cx={160} cy={160} r={112} fill="url(#sk-steel)" stroke={M.steelD} />
      <circle cx={160} cy={160} r={98} fill="#1f1c19" />
      <MovPlan cx={160} cy={160} r={90} dateRing={false} stem={false} />
      {[40, 200].map((a) => {
        const [x, y] = clk(160, 160, 92, a)
        return (
          <g key={a}>
            <rect x={x - 14} y={y - 6} width={28} height={12} rx="3" fill="url(#sk-steelH)" stroke={M.steelD} transform={`rotate(${a} ${x} ${y})`} />
            <Screw x={x} y={y} r={5} ang={a} />
            <Turn cx={x} cy={y} r={11} from={20} to={140} w={1.4} />
          </g>
        )
      })}
      <rect x={250} y={156} width={30} height={8} fill="url(#sk-steelH)" />
      <rect x={278} y={150} width={14} height={20} rx="3" fill="url(#bb-knurl)" />
      <SL p={clk(160, 160, 92, 40)} x={300} y={60} text="clamp under its screw" />
      <SL p={[160, 160]} x={300} y={110} text="movement can’t shift" />
      <Pn x={300} y={176} w={168} h={128} t="Turn it over: check" />
      <circle cx={340} cy={250} r={30} fill={M.dialDark} stroke={C.struct} />
      <circle cx={340} cy={250} r={34} fill="none" stroke={C.steel} />
      <line x1={340} y1={250} x2={340} y2={226} stroke={C.brassHi} strokeWidth="2" />
      <line x1={340} y1={250} x2={358} y2={240} stroke={C.brassHi} strokeWidth="2.6" />
      <Note x={380} y={234} lines={['dial centred', 'in the case,', 'hands clear']} c={C.text} s={10.5} lh={14} />
    </F>
  )
}

function BbFunctionTest() {
  const items = [
    ['Wind: smooth clicks', ''],
    ['Crown through each position', ''],
    ['Hands past midnight', 'date flips'],
    ['Quick-set the date', ''],
    ['Press gently on the crown', 'movement mustn’t turn or shift'],
    ['Automatic: tilt the case', 'rotor turns, touches nothing'],
  ]
  return (
    <F h={330} view="Checklist · function test with the back off" scale="schematic">
      {items.map(([a, b], i) => (
        <g key={a}>
          <Num x={24} y={44 + i * 32} n={i + 1} r={8} />
          <T x={38} y={48 + i * 32} s={11} c={C.text}>
            {a}
          </T>
          {b && (
            <T x={38} y={61 + i * 32} s={10} c={C.faint}>
              {b}
            </T>
          )}
        </g>
      ))}
      <Pn x={252} y={26} w={216} h={130} t="Press on the crown" />
      <circle cx={318} cy={98} r={44} fill="url(#sk-steel)" />
      <circle cx={318} cy={98} r={36} fill={M.plate} stroke={C.brass} />
      <rect x={362} y={94} width={22} height={8} fill="url(#sk-steelH)" />
      <rect x={382} y={88} width={12} height={20} rx="3" fill="url(#bb-knurl)" />
      <Arrow a={[420, 98]} b={[398, 98]} c="brass" w={1.8} />
      <Turn cx={318} cy={98} r={26} from={-30} to={30} c="ruby" w={1.4} />
      <T x={420} y={128} a="middle" s={10} c={C.ruby}>turns? fix ring</T>
      <T x={420} y={141} a="middle" s={10} c={C.ruby}>or clamps first</T>
      <Pn x={252} y={164} w={216} h={84} t="Binds in one position" />
      <Note x={264} y={202} lines={['suspect the stem height', 'or its length']} c={C.text} s={10.5} lh={14} />
      <Pn x={252} y={256} w={216} h={62} t="Rotor" />
      <path d="M318 304 A26 26 0 0 1 370 304 Z" fill="url(#bb-bcut)" />
      <Turn cx={344} cy={304} r={32} from={-50} to={40} w={1.4} />
      <T x={388} y={300} s={10} c={C.text}>free, no rubbing</T>
      <T x={14} y={248} s={10.5} c={C.dim}>Before you seal anything.</T>
      <T x={14} y={264} s={10.5} c={C.dim}>Anything wrong now is cheap to fix;</T>
      <T x={14} y={278} s={10.5} c={C.dim}>after the back is on, it isn’t.</T>
    </F>
  )
}

/* ================================================================== */
/* build-seal · seal and pressure-test                                    */
/* ================================================================== */

function BbCrystalPress() {
  return (
    <F h={316} view="Section · crystal into the case with a press" scale="schematic">
      <Pn x={12} y={26} w={290} h={278} t="Squarely" tc={C.emerald} ok />
      <rect x={140} y={46} width={14} height={16} fill="url(#sk-steelH)" />
      <rect x={90} y={62} width={114} height={18} rx="3" fill="#cfd6db" stroke={M.steelD} />
      <Arrow a={[110, 88]} b={[110, 104]} c="brass" w={1.6} />
      <Arrow a={[184, 88]} b={[184, 104]} c="brass" w={1.6} />
      <rect x={92} y={108} width={110} height={10} fill="url(#bb-acr)" stroke={M.glass} />
      <path d="M44 116 L84 116 L84 108 L92 108 L92 160 L44 160 Z M250 116 L210 116 L210 108 L202 108 L202 160 L250 160 Z" fill="url(#bb-cut)" stroke="#4e5f6a" />
      <rect x={84} y={108} width={8} height={18} fill={M.gasket} />
      <rect x={202} y={108} width={8} height={18} fill={M.gasket} />
      <rect x={40} y={168} width={214} height={22} fill="#cfd6db" stroke={M.steelD} />
      <SL p={[204, 70]} x={214} y={60} text="correct die" />
      <SL p={[206, 118]} x={214} y={92} text="gasket seated" />
      <SL p={[150, 113]} x={150} y={146} text="crystal" />
      <Num x={30} y={222} n={1} r={8} />
      <T x={44} y={226} s={10.5} c={C.text}>seat the crystal gasket</T>
      <Num x={30} y={246} n={2} r={8} />
      <T x={44} y={250} s={10.5} c={C.text}>place the crystal</T>
      <Num x={30} y={270} n={3} r={8} />
      <T x={44} y={274} s={10.5} c={C.text}>press home, even pressure</T>

      <Pn x={310} y={26} w={158} h={278} t="Tilted" tc={C.ruby} ok={false} />
      <rect x={336} y={74} width={106} height={14} rx="3" fill="#cfd6db" stroke={M.steelD} transform="rotate(-8 389 81)" />
      <rect x={340} y={104} width={98} height={9} fill="url(#bb-acr)" stroke={M.glass} transform="rotate(-8 389 108)" />
      <path d="M380 104 l6 6 l-4 4 l6 6" stroke={C.ruby} strokeWidth="1.4" fill="none" />
      <path d="M322 120 L338 120 L338 160 L322 160 Z M456 120 L440 120 L440 160 L456 160 Z" fill="url(#bb-cut)" stroke="#4e5f6a" />
      <Note x={389} y={200} a="middle" lines={['uneven pressure:', 'cracks or a', 'crooked seat']} c={C.text} s={10.5} lh={14} />
    </F>
  )
}

function BbCloseBack() {
  return (
    <F h={316} view="Section · starting a screw-in back" scale="schematic, magnified">
      <Pn x={12} y={26} w={226} h={196} t="Threads start square" tc={C.emerald} ok />
      <rect x={40} y={70} width={170} height={36} fill="url(#bb-cut)" stroke="#4e5f6a" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${48 + i * 18} 106 l9 10 l9 -10`} fill="url(#bb-cut)" stroke="#4e5f6a" />)}
      <rect x={40} y={128} width={170} height={30} fill="url(#bb-cut)" stroke="#4e5f6a" opacity="0.7" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${57 + i * 18} 128 l9 -10 l9 10`} fill="url(#bb-cut)" stroke="#4e5f6a" opacity="0.7" />)}
      <T x={125} y={60} a="middle" s={10} c={C.dim}>back</T>
      <T x={125} y={176} a="middle" s={10} c={C.dim}>case</T>
      <T x={125} y={206} a="middle" s={10.5} c={C.text}>flat, parallel, turns freely</T>

      <Pn x={248} y={26} w={220} h={196} t="Cross-threaded" tc={C.ruby} ok={false} />
      <g transform="rotate(-6 358 92)">
        <rect x={276} y={70} width={164} height={36} fill="url(#bb-cut)" stroke="#4e5f6a" />
        {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${282 + i * 18} 106 l9 10 l9 -10`} fill="url(#bb-cut)" stroke="#4e5f6a" />)}
      </g>
      <rect x={276} y={128} width={164} height={30} fill="url(#bb-cut)" stroke="#4e5f6a" opacity="0.7" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${291 + i * 18} 128 l9 -10 l9 10`} fill="url(#bb-cut)" stroke="#4e5f6a" opacity="0.7" />)}
      <T x={358} y={206} a="middle" s={10.5} c={C.text}>tilted, binds early</T>

      <Sep x1={12} y1={234} x2={468} y2={234} />
      <Note x={14} y={256} lines={['Screw-in back: start by hand, square, and stop at any early resistance.', 'Press-on back: press it evenly down, rim all round.', 'Cross-threading can ruin the case; a restart costs nothing.']} c={C.text} s={10.5} lh={16} />
    </F>
  )
}

function BbPressureBuild() {
  return (
    <F h={300} view="Sequence · prove the seal before the rating counts" scale="schematic">
      <Bx x={12} y={40} w={130} h={66} l={['Build sealed', 'crystal, back, crown']} />
      <Fl a={[142, 73]} b={[166, 73]} />
      <Pn x={168} y={30} w={140} h={150} t="Dry test" />
      <rect x={186} y={60} width={104} height={64} rx="8" fill="rgba(255,255,255,0.04)" stroke={C.struct} />
      <Face cx={238} cy={92} r={20} lugs={false} />
      <circle cx={276} cy={150} r={16} fill="#1b1916" stroke={C.dim} />
      <line x1={276} y1={150} x2={286} y2={142} stroke={C.brassHi} strokeWidth="1.6" />
      <T x={196} y={154} s={10} c={C.dim}>air pressure</T>
      <Fl a={[308, 105]} b={[332, 105]} />
      <Pn x={334} y={30} w={134} h={150} t="Wet test" />
      <rect x={350} y={60} width={102} height={64} rx="6" fill="rgba(127,182,214,0.25)" stroke={M.water} />
      <Face cx={400} cy={94} r={18} lugs={false} />
      <T x={400} y={150} a="middle" s={10} c={C.dim}>if you have the kit</T>
      <Bx x={12} y={196} w={456} h={44} l={['Only then is the stated water resistance real.']} c={C.emerald} f="rgba(123,165,131,0.08)" />
      <T x={14} y={268} s={10.5} c={C.dim}>A fail means a gasket is pinched, missing or the back isn’t home: re-open, re-seat, re-test.</T>
      <T x={14} y={284} s={10.5} c={C.dim}>Until it passes, treat the watch as splash-only.</T>
    </F>
  )
}

function BbDayTest() {
  return (
    <F h={330} view="Chart · a day before you call it done" scale="schematic">
      <rect x={30} y={66} width={210} height={28} fill="rgba(80,90,150,0.3)" />
      <rect x={240} y={66} width={210} height={28} fill="rgba(208,168,79,0.15)" />
      <T x={150} y={84} a="middle" s={10.5} c={C.text}>night: dial down</T>
      <T x={345} y={84} a="middle" s={10.5} c={C.text}>day: dial up</T>
      <line x1={100} y1={60} x2={100} y2={100} stroke={C.emerald} strokeWidth="2" />
      <T x={100} y={114} a="middle" s={10} c={C.emerald}>date flips near midnight?</T>
      <Pn x={12} y={128} w={226} h={150} t="Dial down shows it" />
      {/* side section: crystal below, hand sagging to touch */}
      <rect x={40} y={226} width={170} height={8} fill="url(#bb-acr)" stroke={M.glass} />
      <rect x={40} y={180} width={170} height={4} fill={M.dial} />
      <path d="M125 184 L125 196 L200 224" stroke={C.brassHi} strokeWidth="2" fill="none" />
      <circle cx={200} cy={225} r={6} fill="none" stroke={C.ruby} strokeWidth="1.4" />
      <T x={125} y={256} a="middle" s={10.5} c={C.text}>a hand touching the glass</T>
      <T x={125} y={270} a="middle" s={10} c={C.dim}>open it, reset the hand height</T>
      <Pn x={248} y={128} w={220} h={150} t="Rate" />
      <Note x={260} y={164} lines={['compare with the calibre’s', 'own specification,', 'not with zero']} c={C.text} s={10.5} lh={14} />
      <Note x={260} y={222} lines={['stops or gains wildly?', 'work through “Common', 'build problems” first']} c={C.ruby} s={10.5} lh={14} />
      <rect x={12} y={288} width={456} height={32} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={24} y={308} s={10.5} c={C.text}>Log the result: the next build starts from a known-good record.</T>
    </F>
  )
}

/* ================================================================== */
/* build-troubleshoot · common build problems                              */
/* ================================================================== */

function BbDust() {
  return (
    <F h={316} view="Fix and prevention · dust under the crystal" scale="schematic">
      <Pn x={12} y={26} w={290} h={196} t="Fix" />
      {[
        ['Re-open', 'back off, then', 'crystal side'],
        ['Blow down', 'dial, hands, glass', 'in a clean space'],
        ['Reseat', 'the crystal', ''],
      ].map(([a, b, c], i) => (
        <g key={a}>
          <Num x={36 + i * 92} y={60} n={i + 1} r={8} />
          <T x={60 + i * 92} y={176} a="middle" s={10.5} c={C.text}>
            {a}
          </T>
          <T x={60 + i * 92} y={190} a="middle" s={10} c={C.dim}>
            {b}
          </T>
          <T x={60 + i * 92} y={203} a="middle" s={10} c={C.dim}>
            {c}
          </T>
        </g>
      ))}
      <Face cx={60} cy={110} r={34} lugs={false} />
      {[[46, 96], [74, 120], [62, 128]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.8} fill="#f2ede0" />)}
      <G x={136} y={118} ang={40}>
        <Blower k={0.8} />
      </G>
      <rect x={140} y={124} width={50} height={6} fill={M.dial} />
      {[0, 1, 2].map((i) => <Arrow key={i} a={[146 + i * 14, 122]} b={[150 + i * 16, 104]} c="steel" w={1} />)}
      <rect x={210} y={104} width={84} height={10} fill="url(#bb-acr)" stroke={M.glass} />
      <path d="M210 112 L216 112 L216 140 L210 140 Z M294 112 L288 112 L288 140 L294 140 Z" fill="url(#bb-cut)" />
      <Arrow a={[252, 84]} b={[252, 100]} c="brass" w={1.6} />

      <Pn x={310} y={26} w={158} h={196} t="Prevention" tc={C.emerald} />
      <rect x={334} y={120} width={110} height={10} fill={M.dial} />
      <path d="M326 118 Q389 64 452 118" fill="rgba(169,208,222,0.12)" stroke={M.glass} strokeDasharray="3 2" />
      <T x={389} y={150} a="middle" s={10.5} c={C.text}>work fast and covered</T>
      <T x={389} y={164} a="middle" s={10.5} c={C.text}>once the dial is exposed</T>
      <T x={389} y={190} a="middle" s={10} c={C.faint}>a cover between steps</T>

      <T x={14} y={250} s={11} c={C.text}>The classic build fault. Check under a lamp from the side before</T>
      <T x={14} y={266} s={11} c={C.text}>you close it: dust shows as bright specks.</T>
    </F>
  )
}

function BbHandsFoul() {
  return (
    <F h={326} view="Side view · fouling hands" scale="height exaggerated">
      <Pn x={12} y={26} w={226} h={170} t="Clearance all round" tc={C.emerald} ok />
      <HandStack cx={70} y={150} k={0.9} />
      <Pn x={244} y={26} w={224} h={170} t="Fouling" tc={C.ruby} ok={false} />
      <g>
        <rect x={262} y={150} width={196} height={5} fill={M.dial} />
        <rect x={296} y={137} width={16} height={18} fill={M.brassP} />
        <rect x={299} y={121} width={10} height={34} fill="url(#sk-steelH)" />
        <rect x={302.5} y={105} width={3} height={50} fill="#e3e8eb" />
        <path d="M280 137 L400 140 L440 150" stroke={C.brassHi} strokeWidth="3" fill="none" />
        <circle cx={440} cy={150} r={7} fill="none" stroke={C.ruby} strokeWidth="1.4" />
        <path d="M276 121 L420 130" stroke={C.brassHi} strokeWidth="2.4" />
        <path d="M272 108 L380 126" stroke={C.ruby} strokeWidth="1.4" />
        <circle cx={380} cy={126} r={7} fill="none" stroke={C.ruby} strokeWidth="1.4" />
        <T x={440} y={176} a="end" s={10} c={C.ruby}>hour hand on the dial</T>
        <T x={380} y={100} a="middle" s={10} c={C.ruby}>seconds on minute</T>
      </g>
      <Sep x1={12} y1={208} x2={468} y2={208} />
      <Tag x={12} y={228}>Check through a full 12 hours</Tag>
      {Array.from({ length: 4 }, (_, i) => (
        <Face key={i} cx={52 + i * 70} cy={270} r={26} h={i * 90} m={0} lugs={false} crown={false} />
      ))}
      <Note x={300} y={252} lines={['Stops at a certain', 'time? Re-seat the hands', 'at the correct heights.']} c={C.text} s={10.5} lh={14} />
    </F>
  )
}

// Stem/crown section at the case: stem length state
function StemState({ x, y, st }) {
  const crownX = st === 'long' ? x + 92 : st === 'short' ? x + 70 : x + 78
  return (
    <g>
      <rect x={x - 70} y={y - 26} width={60} height={52} fill="url(#bb-mov)" stroke={C.brass} strokeWidth="0.8" />
      <rect x={x - 10} y={y - 30} width={66} height={60} fill="url(#bb-cut)" stroke="#4e5f6a" />
      <rect x={x + 56} y={y - 7} width={20} height={14} fill="url(#sk-steelH)" />
      <rect x={x - 40} y={y - 2} width={crownX - x + 40 + (st === 'short' ? -4 : 0)} height={4} fill="#e3e8eb" />
      <rect x={crownX} y={y - 14} width={24} height={28} rx="4" fill="url(#bb-knurl)" stroke={M.steelD} />
    </g>
  )
}

function BbCrownFlush() {
  return (
    <F h={320} view="Section · crown against the case tube" scale="schematic">
      {[
        ['too long', 'long', false, 'crown stands proud of the tube'],
        ['right', 'ok', true, 'crown sits flush, winds'],
        ['too short', 'short', false, 'not fully engaged, won’t wind'],
      ].map(([t, st, ok, d], i) => {
        const y = 66 + i * 76
        return (
          <g key={t}>
            <Pn x={12} y={y - 36} w={456} h={70} ok={ok} />
            <T x={26} y={y - 14} s={11} c={ok ? C.emerald : C.ruby} w={600}>
              {t}
            </T>
            <StemState x={160} y={y} st={st} />
            <T x={290} y={y + 4} s={10.5} c={C.text}>
              {d}
            </T>
          </g>
        )
      })}
      <line x1={238} y1={26} x2={238} y2={256} stroke={C.emerald} strokeDasharray="3 3" />
      <T x={14} y={286} s={10.5} c={C.text}>Almost always a stem cut slightly wrong, or not pushed fully home.</T>
      <T x={14} y={302} s={10.5} c={C.dim}>Re-measure and re-trim carefully: too short means a new stem.</T>
    </F>
  )
}

function BbSecondsMarkers() {
  return (
    <F h={316} view="Plan · seconds hand off its markers" scale="schematic">
      <Pn x={12} y={26} w={226} h={190} t="Wrong" tc={C.ruby} ok={false} />
      <Face cx={125} cy={124} r={66} h={0} m={0} s={6} ticks={60} lugs={false} />
      <circle cx={125} cy={124} r={66} fill="none" />
      <T x={125} y={206} a="middle" s={10.5} c={C.ruby}>off-centre, between markers</T>
      <Pn x={244} y={26} w={224} h={190} t="Refit" tc={C.emerald} ok />
      <Face cx={356} cy={124} r={66} h={0} m={0} s={0} ticks={60} lugs={false} />
      <T x={356} y={206} a="middle" s={10.5} c={C.text}>lands on 12, then on each mark</T>
      <Sep x1={12} y1={226} x2={468} y2={226} />
      <Num x={24} y={248} n={1} r={8} />
      <T x={38} y={252} s={10.5} c={C.text}>Lift the seconds hand</T>
      <Num x={190} y={248} n={2} r={8} />
      <T x={204} y={252} s={10.5} c={C.text}>Hack the movement at zero</T>
      <Num x={24} y={278} n={3} r={8} />
      <T x={38} y={282} s={10.5} c={C.text}>Press it on centred, pointing at 12</T>
      <T x={14} y={306} s={10} c={C.faint}>Pull the crown to stop the seconds as it reaches 12, then fit the hand.</T>
    </F>
  )
}

function BbDateWrong() {
  return (
    <F h={330} view="Decision · date changes at the wrong time" scale="schematic">
      <Bx x={150} y={30} w={180} h={34} l={['When does it change?']} c={C.brass} />
      <Fl a={[180, 64]} b={[86, 92]} />
      <Fl a={[240, 64]} b={[240, 92]} />
      <Fl a={[300, 64]} b={[394, 92]} />
      <Bx x={12} y={94} w={148} h={44} l={['around noon']} />
      <Bx x={166} y={94} w={148} h={44} l={['well away', 'from either 12']} />
      <Bx x={320} y={94} w={148} h={44} l={['hangs half-way,', 'or quick-set stiff']} />
      <Fl a={[86, 138]} b={[86, 156]} />
      <Fl a={[240, 138]} b={[240, 156]} />
      <Fl a={[394, 138]} b={[394, 156]} />
      <Bx x={12} y={158} w={148} h={80} l={['12 hours out', 'run the hands on', 'through 12 hours,', 'set it again']} c={C.emerald} />
      <Bx x={166} y={158} w={148} h={80} l={['Hour hand at the', 'wrong point', 'lift it, refit at the', 'moment the date flips']} c={C.emerald} />
      <Bx x={320} y={158} w={148} h={80} l={['Rubbing under', 'the dial', 'dial dots can jam', 'the date ring: look first']} c={C.emerald} />
      <Face cx={86} cy={286} r={28} h={0} m={0} lugs={false} date="15" />
      <Face cx={240} cy={286} r={28} h={90} m={0} lugs={false} date="15" />
      <circle cx={240} cy={286} r={34} fill="none" stroke={C.ruby} strokeDasharray="3 3" />
      <g>
        <circle cx={394} cy={286} r={30} fill={M.dial} stroke={C.struct} />
        <circle cx={380} cy={276} r={6} fill="#e7d79e" stroke="#a8955a" />
        <rect x={402} y={278} width={18} height={16} fill="#f2ede0" stroke={C.ruby} />
        <T x={411} y={290} a="middle" s={10} c="#222">1</T>
      </g>
    </F>
  )
}

function BbStopDate() {
  return (
    <F h={330} view="Decision · stops or loses time at the date change" scale="schematic">
      <Bx x={140} y={30} w={200} h={40} l={['Note exactly when it happens']} c={C.brass} />
      <Fl a={[200, 70]} b={[100, 96]} />
      <Fl a={[280, 70]} b={[380, 96]} />
      <Bx x={12} y={98} w={220} h={44} l={['Stops near the', 'date change']} />
      <Bx x={248} y={98} w={220} h={44} l={['Runs, but hands', 'lose time at the change']} />
      <Fl a={[122, 142]} b={[122, 160]} />
      <Fl a={[358, 142]} b={[358, 160]} />
      <Bx x={12} y={162} w={220} h={70} l={['Calendar load or friction', 'date wheel against the dial', 'dial off: check the date', 'wheel turns freely']} c={C.emerald} />
      <Bx x={248} y={162} w={220} h={70} l={['Cannon pinion slipping', 'under that load', 'work through “Hands slip', 'or set stiffly”']} c={C.emerald} />
      <Fl a={[240, 236]} b={[240, 254]} />
      <Bx x={120} y={256} w={240} h={40} l={['Neither fits?', 'weak spring or heavy train next']} c={C.ruby} />
      <T x={14} y={318} s={10} c={C.faint}>The causes in the first branch come from forum reports.</T>
    </F>
  )
}

function BbSecondsSpin() {
  const k = 260 // px per mm
  return (
    <F h={316} view="Detail · seconds hand hole vs pinion" scale="diameters to scale, ×260">
      <Pn x={12} y={26} w={290} h={206} t="ETA hand on an NH35" tc={C.ruby} ok={false} />
      <circle cx={100} cy={128} r={(0.25 * k) / 2} fill={C.ruby} opacity="0.25" stroke={C.ruby} strokeWidth="1.4" />
      <circle cx={100} cy={128} r={(0.21 * k) / 2} fill="#e3e8eb" stroke={M.steelD} />
      <Dim a={[100 - (0.25 * k) / 2, 186]} b={[100 + (0.25 * k) / 2, 186]} off={0} text="hole 0.25" c={C.ruby} tOff={6} />
      <Dim a={[100 - (0.21 * k) / 2, 70]} b={[100 + (0.21 * k) / 2, 70]} off={0} text="pinion 0.21" tOff={6} />
      <Note x={190} y={110} lines={['The hole is', 'bigger than', 'the pinion:', 'no grip']} c={C.text} s={10.5} lh={14} />
      <T x={22} y={222} s={10} c={C.faint}>spins, or falls off</T>
      <Pn x={310} y={26} w={158} h={206} t="Fix" tc={C.emerald} />
      <Note x={322} y={66} lines={['Check the size', 'with your supplier', 'and fit the right', 'hand for the', 'movement.']} c={C.text} s={10.5} lh={15} />
      <T x={322} y={168} s={10.5} c={C.ruby}>Glue?</T>
      <Note x={322} y={184} lines={['most forum posters', 'advise against it:', 'hard to remove later']} c={C.dim} s={10} lh={13} />
      <T x={14} y={260} s={10.5} c={C.text}>The hole may be for another movement.</T>
      <T x={14} y={278} s={10.5} c={C.dim}>One forum list: NH35 0.21 mm, ETA 2824 0.25 mm.</T>
    </F>
  )
}

function BbRattleRotor() {
  return (
    <F h={336} view="Decision · rattle or scrape" scale="schematic">
      <Pn x={12} y={26} w={226} h={110} t="Rattle when tilted" />
      <Note x={24} y={62} lines={['movement isn’t held:', 'check the ring or spacer', 'and the casing clamps']} c={C.text} s={10.5} lh={14} />
      <Pn x={244} y={26} w={224} h={110} t="Spin the rotor, back off" />
      <circle cx={300} cy={92} r={26} fill={M.plate} stroke={C.brass} />
      <path d="M274 92 A26 26 0 0 1 326 92 Z" fill="url(#bb-bcut)" />
      <circle cx={300} cy={92} r={4} fill="url(#sk-steel)" />
      <Turn cx={300} cy={92} r={34} from={-80} to={20} w={1.4} />
      <Note x={344} y={74} lines={['turns without', 'wobble?']} c={C.text} s={10.5} lh={14} />
      <Bx x={12} y={148} w={226} h={74} l={['Wobbles', 'loose rotor screw,', 'worn bearing, or', 'bent rotor']} c={C.ruby} />
      <Bx x={244} y={148} w={224} h={74} l={['Scrapes only with', 'the back on', 'stack too tall: recheck', 'height sums']} c={C.ruby} />
      {/* stack too tall: rotor touching back */}
      <path d="M260 272 L452 272 L446 284 Q356 292 266 284 Z" fill="url(#bb-cut)" stroke="#4e5f6a" />
      <rect x={276} y={286} width={160} height={8} fill="url(#bb-bcut)" />
      <rect x={270} y={294} width={172} height={22} fill="url(#bb-mov)" />
      <circle cx={356} cy={288} r={8} fill="none" stroke={C.ruby} strokeWidth="1.4" />
      <T x={356} y={262} a="middle" s={10} c={C.faint}>caseback on: rotor rubs</T>
      <Pn x={12} y={232} w={226} h={90} t="Don’t chase every sound" />
      <Note x={24} y={268} lines={['Miyota rotor noise is', 'described as normal, and', 'a service won’t silence it.']} c={C.text} s={10.5} lh={14} />
    </F>
  )
}

/* ================================================================== */
/* build-movement-fit · match a movement to a case                         */
/* ================================================================== */

function BbLigne() {
  const k = 6.6 // px per mm
  const x0 = 40
  return (
    <F h={326} view="Chart · lignes to millimetres" scale="true proportion, 6.6 px = 1 mm">
      <T x={14} y={44} s={11.5} c={C.text}>1 ligne ≈ 2.256 mm</T>
      {Array.from({ length: 11 }, (_, i) => (
        <rect key={i} x={x0 + i * 2.256 * k} y={58} width={2.256 * k - 1} height={12} fill={i % 2 ? 'rgba(208,168,79,0.35)' : 'rgba(208,168,79,0.6)'} />
      ))}
      <rect x={x0 + 11 * 2.256 * k} y={58} width={0.5 * 2.256 * k} height={12} fill="rgba(208,168,79,0.6)" />
      <Dim a={[x0, 80]} b={[x0 + 11.5 * 2.256 * k, 80]} off={-10} text="11½‴ ≈ 26 mm" tOff={6} />
      <Dim a={[x0, 108]} b={[x0 + 25.6 * k, 108]} off={-10} text="ETA 2824: 25.6 mm, measured" c={C.brassHi} tOff={6} />
      <T x={x0 + 26 * k + 8} y={98} s={10} c={C.faint}>check the actual figure</T>

      <Pn x={12} y={140} w={148} h={176} t="Fits" tc={C.emerald} ok />
      <circle cx={86} cy={236} r={56} fill="url(#sk-steel)" />
      <circle cx={86} cy={236} r={46} fill="#1f1c19" />
      <circle cx={86} cy={236} r={44} fill={M.plate} stroke={C.brass} />
      <T x={86} y={240} a="middle" s={10} c={C.text}>same diameter</T>
      <Pn x={166} y={140} w={148} h={176} t="Smaller: ring" tc={C.emerald} ok />
      <circle cx={240} cy={236} r={56} fill="url(#sk-steel)" />
      <circle cx={240} cy={236} r={46} fill={M.nylon} opacity="0.7" />
      <circle cx={240} cy={236} r={36} fill={M.plate} stroke={C.brass} />
      <T x={240} y={232} a="middle" s={10} c={C.text}>ring or</T>
      <T x={240} y={245} a="middle" s={10} c={C.text}>spacer</T>
      <Pn x={320} y={140} w={148} h={176} t="Larger" tc={C.ruby} ok={false} />
      <circle cx={394} cy={236} r={56} fill="url(#sk-steel)" />
      <circle cx={394} cy={236} r={46} fill="#1f1c19" />
      <circle cx={394} cy={236} r={52} fill={M.plate} stroke={C.ruby} strokeDasharray="4 3" opacity="0.8" />
      <T x={394} y={240} a="middle" s={10} c={C.text}>won’t go in</T>
    </F>
  )
}

function BbHeightStack() {
  const x = 110
  const parts = [
    ['spacer', 13, M.nylon],
    ['movement', 64, '#5b5339'],
    ['dial', 6, M.dial],
    ['hands', 22, 'rgba(233,200,119,0.35)'],
  ]
  let y = 280
  return (
    <F h={326} view="Side view · the height stack" scale="schematic">
      {/* case internal depth */}
      <rect x={x - 30} y={70} width={14} height={214} fill="url(#bb-cut)" />
      <rect x={x + 136} y={70} width={14} height={214} fill="url(#bb-cut)" />
      <rect x={x - 30} y={60} width={180} height={10} fill="url(#bb-acr)" stroke={M.glass} />
      <rect x={x - 30} y={284} width={180} height={8} fill="url(#bb-cut)" />
      {parts.map(([t, h, c]) => {
        y -= h
        return (
          <g key={t}>
            <rect x={x - 14} y={y} width={148} height={h} fill={c} stroke={C.struct} strokeWidth="0.6" />
            <T x={x + 60} y={y + h / 2 + 4} a="middle" s={10} c={t === 'movement' ? C.text : C.ground}>
              {t === 'dial' ? '' : t === 'spacer' ? 'spacer, if any' : t}
            </T>
          </g>
        )
      })}
      <Lab p={[x + 100, 208]} x={x + 100} y={150} text="dial" up />
      <Dim a={[x - 50, 70]} b={[x - 50, 284]} off={0} text="internal depth" />
      <T x={x - 72} y={300} s={10} c={C.faint}>back seat to crystal</T>
      <Dim a={[x + 160, 284]} b={[x + 160, 186]} off={0} text="sum of the stack" c={C.brassHi} flip />
      <Pn x={314} y={40} w={154} h={110} t="Too tall" tc={C.ruby} />
      <Note x={326} y={76} lines={['caseback bulges,', 'or hands kiss', 'the glass']} c={C.text} s={10.5} lh={14} />
      <Pn x={314} y={160} w={154} h={86} t="Too short" tc={C.ruby} />
      <Note x={326} y={196} lines={['rattles, unless a', 'ring takes the slack']} c={C.text} s={10.5} lh={14} />
    </F>
  )
}

function BbStemHeight() {
  const Row = ({ y, dy, ok, t }) => (
    <g>
      <Pn x={12} y={y} w={456} h={88} ok={ok} />
      <T x={24} y={y + 20} s={10.5} c={ok ? C.emerald : C.ruby} w={600}>
        {t}
      </T>
      <rect x={40} y={y + 30} width={150} height={50} fill="url(#bb-mov)" stroke={C.brass} strokeWidth="0.8" />
      <rect x={200} y={y + 26} width={110} height={58} fill="url(#bb-cut)" stroke="#4e5f6a" />
      <rect x={200} y={y + 49} width={110} height={12} fill="#1f1c19" />
      <rect x={302} y={y + 47} width={24} height={16} fill="url(#sk-steelH)" />
      <line x1={190} y1={y + 55 + dy} x2={350} y2={y + 55 + dy} stroke="#e3e8eb" strokeWidth="4" />
      <line x1={36} y1={y + 55} x2={370} y2={y + 55} stroke={C.emerald} strokeDasharray="3 3" strokeWidth="0.8" />
      <rect x={350} y={y + 44 + dy} width={20} height={22} rx="3" fill="url(#bb-knurl)" />
      {dy !== 0 && <circle cx={300} cy={y + 55 + dy} r={7} fill="none" stroke={C.ruby} strokeWidth="1.4" />}
    </g>
  )
  return (
    <F h={330} view="Section · stem height against the case tube" scale="offsets exaggerated">
      <Row y={26} dy={0} ok t="Stem exits at the tube’s height" />
      <Row y={122} dy={-9} ok={false} t="A few tenths off" />
      <T x={390} y={176} s={10.5} c={C.text}>crown binds</T>
      <T x={390} y={190} s={10.5} c={C.text}>on the case,</T>
      <T x={390} y={204} s={10.5} c={C.text}>or misses</T>
      <T x={390} y={80} s={10.5} c={C.text}>turns freely</T>
      <Lab p={[115, 81]} x={115} y={232} text="height fixed by the movement" c={C.dim} />
      <T x={14} y={266} s={11} c={C.text}>The make-or-break number. The case must match the movement,</T>
      <T x={14} y={282} s={11} c={C.text}>or the movement the case.</T>
      <T x={14} y={302} s={10} c={C.faint}>Green dashes: the tube axis.</T>
    </F>
  )
}

function BbDialFeet() {
  return (
    <F h={316} view="Plan · dial feet" scale="positions illustrative">
      <Pn x={12} y={26} w={226} h={200} t="Same calibre family" tc={C.emerald} ok />
      <MovPlan cx={125} cy={128} r={70} feet={[48, 228]} stem />
      {[48, 228].map((d) => {
        const [x, y] = clk(125, 128, 63, d)
        return <circle key={d} cx={x} cy={y} r={5.5} fill="none" stroke={C.emerald} strokeWidth="1.6" />
      })}
      <T x={125} y={216} a="middle" s={10.5} c={C.text}>feet drop into the holes</T>
      <Pn x={244} y={26} w={224} h={200} t="Dial for another calibre" tc={C.ruby} ok={false} />
      <MovPlan cx={356} cy={128} r={70} feet={[48, 228]} stem />
      {[100, 280].map((d) => {
        const [x, y] = clk(356, 128, 63, d)
        return <circle key={d} cx={x} cy={y} r={5.5} fill="none" stroke={C.ruby} strokeWidth="1.6" />
      })}
      <T x={356} y={216} a="middle" s={10.5} c={C.text}>feet land on bare plate</T>
      <Sep x1={12} y1={236} x2={468} y2={236} />
      <rect x={24} y={262} width={70} height={6} fill={M.dial} />
      <rect x={36} y={268} width={4} height={18} fill={C.brassHi} />
      <rect x={78} y={268} width={4} height={18} fill={C.brassHi} />
      <Arrow a={[100, 272]} b={[124, 272]} c="steel" w={1.4} />
      <rect x={132} y={262} width={70} height={6} fill={M.dial} />
      {[146, 186].map((x) => <ellipse key={x} cx={x} cy={271} rx={6} ry={3} fill="#e7d79e" />)}
      <Note x={216} y={260} lines={['Plan B: remove the feet and seat', 'the dial on dial dots or adhesive.']} c={C.text} s={10.5} lh={14} />
      <T x={24} y={304} s={10} c={C.faint}>A dial made for an ETA 2824 won’t have feet where an NH35 expects them.</T>
    </F>
  )
}

function BbDateWindow() {
  const D = ({ x, ang, t, ok }) => {
    const [dx, dy] = clk(x, 124, 46, ang)
    return (
      <g>
        <circle cx={x} cy={124} r={64} fill={M.dialDark} stroke={C.struct} />
        <circle cx={x} cy={124} r={52} fill="none" stroke={M.dial} strokeWidth="10" opacity="0.3" />
        <rect x={dx - 9} y={dy - 9} width={18} height={18} fill="#f2ede0" stroke={ok ? C.emerald : C.ruby} strokeWidth="1.4" />
        <T x={x} y={212} a="middle" s={10.5} c={C.text}>
          {t}
        </T>
      </g>
    )
  }
  return (
    <F h={316} view="Plan · where the date window can sit" scale="schematic">
      <D x={88} ang={90} t="3:00, the usual" ok />
      <D x={240} ang={180} t="6:00" ok />
      <D x={392} ang={135} t="4:30" ok />
      <T x={240} y={42} a="middle" s={10.5} c={C.dim}>faint ring: the date wheel under the dial</T>
      <Sep x1={12} y1={228} x2={468} y2={228} />
      <Note x={14} y={252} lines={['Date position belongs to the movement, not the dial.', 'Confirm the calibre’s date wheel sits under the dial’s cut-out.']} c={C.text} s={11} lh={16} />
    </F>
  )
}

function BbNh35Example() {
  const cx = 104
  const cy = 150
  const r = 76
  return (
    <F h={340} view="Spec card · NH35" scale="one supplier’s guide">
      <circle cx={cx} cy={cy} r={r + 8} fill="none" stroke={M.nylon} strokeWidth="8" opacity="0.6" />
      <MovPlan cx={cx} cy={cy} r={r} feet={[48, 228]} />
      {Array.from({ length: 60 }, (_, i) => {
        const [a, b] = clk(cx, cy, r + 14, i * 6)
        const [c2, d2] = clk(cx, cy, r + (i % 5 ? 18 : 22), i * 6)
        return <line key={i} x1={a} y1={b} x2={c2} y2={d2} stroke={C.faint} strokeWidth={i % 5 ? 0.6 : 1.2} />
      })}
      <line x1={cx} y1={cy} x2={clk(cx, cy, r + 26, 0)[0]} y2={clk(cx, cy, r + 26, 0)[1]} stroke={C.struct} strokeDasharray="2 3" />
      <line x1={cx} y1={cy} x2={clk(cx, cy, r + 26, 48)[0]} y2={clk(cx, cy, r + 26, 48)[1]} stroke={C.brassHi} strokeDasharray="2 3" />
      <Turn cx={cx} cy={cy} r={34} from={2} to={46} w={1.4} />
      <T x={cx + 22} y={cy - 40} s={10.5} c={C.brassHi}>48°</T>
      <Lab p={clk(cx, cy, r * 0.9, 48)} x={cx + 60} y={42} text="8-min mark" up />
      <Lab p={clk(cx, cy, r * 0.9, 228)} x={cx - 50} y={270} text="38-min mark" />
      <T x={14} y={300} s={10} c={C.faint}>feet shown for a 3 o’clock crown</T>
      <T x={14} y={316} s={10} c={C.faint}>outer ring: the spacer · measure your own parts</T>

      {[
        ['Diameter', '27.4 mm', '29.36 mm with spacer'],
        ['Height', '7.59 mm installed', ''],
        ['Dial', '0.4 mm ideal', 'about 0.6 mm at most'],
        ['Stem height', 'no reliable figure', 'buy an NH35-family case'],
        ['Dial feet', '8 and 38 min', '3 o’clock crown'],
        ['', '12 and 42 min', '4 o’clock crown'],
        ['Date', '3H, 4H standard', '6H: special order'],
      ].map(([a, b, c], i) => {
        const y = 46 + i * 34
        return (
          <g key={i}>
            <T x={238} y={y} s={10.5} c={C.faint}>
              {a}
            </T>
            <T x={318} y={y} s={11} c={i === 3 ? C.ruby : C.text} mono>
              {b}
            </T>
            {c && (
              <T x={318} y={y + 13} s={10} c={C.dim}>
                {c}
              </T>
            )}
          </g>
        )
      })}
      <rect x={232} y={282} width={236} height={46} rx="6" fill="rgba(208,168,79,0.08)" stroke={C.brass} />
      <T x={242} y={300} s={10.5} c={C.brassHi} mono>angle = hour × 30° + min × 6°</T>
      <T x={242} y={318} s={10.5} c={C.text} mono>8-min mark = 8 × 6° = 48°</T>
    </F>
  )
}

function BbShortlist() {
  const rows = ['Diameter', 'Maximum height', 'Stem height', 'Dial-foot family', 'Date position']
  return (
    <F h={326} view="Checklist · the five numbers for your case" scale="schematic">
      <rect x={20} y={30} width={280} height={228} rx="4" fill="#e9e1c6" />
      <T x={34} y={52} s={12} c="#2a241c" w={700}>My case needs</T>
      {rows.map((r, i) => (
        <g key={r}>
          <line x1={34} y1={66 + i * 38} x2={286} y2={66 + i * 38} stroke="#c9bfa5" />
          <Num x={46} y={86 + i * 38} n={i + 1} r={8} c="#7d5f22" />
          <T x={62} y={90 + i * 38} s={11.5} c="#2a241c" w={600}>
            {r}
          </T>
          <T x={196} y={90 + i * 38} s={11} c="#8a7f6c" mono>
            ________
          </T>
        </g>
      ))}
      <Arrow a={[304, 144]} b={[336, 144]} c="brass" w={1.8} />
      <Bx x={340} y={110} w={128} h={68} l={['Pick a movement', 'that meets', 'all five']} c={C.brass} />
      <Tag x={20} y={282}>Popular because cases and dials are made for them</Tag>
      <Bx x={20} y={290} w={200} h={28} l={['NH35 / NH36']} s={11} />
      <Bx x={230} y={290} w={238} h={28} l={['ETA 2824 / Sellita SW200']} s={11} />
    </F>
  )
}

/* ================================================================== */
/* build-lume · relume a dial and hands                                    */
/* ================================================================== */

function BbLumeGrade() {
  const Dial = ({ cx, mix }) => (
    <g>
      <circle cx={cx} cy={120} r={62} fill="#0c0d10" stroke={C.struct} />
      {Array.from({ length: 12 }, (_, i) => {
        const [x, y] = clk(cx, 120, 50, i * 30)
        const blue = mix && i % 3 === 1
        return <circle key={i} cx={x} cy={y} r={7} fill={blue ? 'url(#bb-glowB)' : 'url(#bb-glow)'} />
      })}
      {[[0, 30], [60, 44]].map(([d, len], i) => {
        const [x, y] = clk(cx, 120, len, d)
        return <line key={i} x1={cx} y1={120} x2={x} y2={y} stroke={mix && i === 1 ? M.lumeB : M.lume} strokeWidth={i ? 3 : 4} strokeLinecap="round" opacity="0.85" />
      })}
    </g>
  )
  return (
    <F h={316} view="Comparison · one grade for the whole watch" scale="in the dark">
      <Pn x={12} y={26} w={226} h={200} t="One grade" tc={C.emerald} ok />
      <Dial cx={125} />
      <T x={125} y={210} a="middle" s={10.5} c={C.text}>same colour, fades together</T>
      <Pn x={244} y={26} w={224} h={200} t="Mixed grades" tc={C.ruby} ok={false} />
      <Dial cx={356} mix />
      <T x={356} y={210} a="middle" s={10.5} c={C.text}>reads as a mismatch</T>
      <Sep x1={12} y1={236} x2={468} y2={236} />
      <circle cx={34} cy={262} r={9} fill="url(#bb-glow)" />
      <T x={50} y={266} s={11} c={C.text}>C3: the brightest green</T>
      <circle cx={260} cy={262} r={9} fill="url(#bb-glowB)" />
      <T x={276} y={266} s={11} c={C.text}>BGW9: blue-white</T>
      <T x={14} y={300} s={10.5} c={C.dim}>Super-LumiNova grades differ in colour and in how long they glow.</T>
    </F>
  )
}

function BbRadiumDecide() {
  return (
    <F h={336} view="Decision · may this dial be stripped?" scale="schematic">
      <Bx x={150} y={30} w={180} h={40} l={['Old dial', 'even if it no longer glows']} c={C.brass} />
      <Fl a={[240, 70]} b={[240, 88]} />
      <Bx x={150} y={90} w={180} h={34} l={['Geiger counter reading']} />
      <Fl a={[190, 124]} b={[96, 150]} />
      <Fl a={[290, 124]} b={[384, 150]} />
      <Bx x={12} y={152} w={200} h={64} l={['Above background', 'radium likely: leave it alone', 'don’t remove it yourself']} c={C.ruby} />
      <Bx x={268} y={152} w={200} h={64} l={['Quiet', 'doesn’t clear it: tritium’s', 'weak beta may not register']} c={C.brass} />
      <Fl a={[368, 216]} b={[368, 236]} />
      <Bx x={268} y={238} w={200} h={46} l={['Can’t prove it’s modern?', 'don’t strip it']} c={C.ruby} />
      <rect x={12} y={238} width={232} height={86} rx="6" fill="rgba(123,165,131,0.08)" stroke={C.emerald} />
      <Tag x={22} y={256} c={C.emerald}>Practise instead</Tag>
      <Note x={22} y={278} lines={['on a scrap dial you know', 'is modern.']} c={C.text} s={10.5} lh={14} />
      <T x={268} y={304} s={10} c={C.faint}>The paint dies long before</T>
      <T x={268} y={318} s={10} c={C.faint}>the radium decays.</T>
    </F>
  )
}

function BbStripLume() {
  return (
    <F h={326} view="Section · lifting old lume from a marker" scale="schematic, magnified">
      <Pn x={12} y={26} w={290} h={196} t="Dial recess" />
      <path d="M30 120 L110 120 L110 148 L200 148 L200 120 L284 120 L284 170 L30 170 Z" fill={M.dial} stroke="#a89c82" />
      <rect x={112} y={132} width={86} height={16} fill="#c8c09c" />
      <path d="M112 132 l12 -6 l14 4 l10 -2" stroke="#c8c09c" strokeWidth="4" fill="none" />
      <G x={140} y={130} ang={28}>
        <Peg len={92} />
      </G>
      <Arrow d="M150 112 Q170 92 196 96" c="brass" w={1.6} />
      <Lab p={[180, 140]} x={240} y={196} text="old lume, lifted" />
      <Lab p={[60, 150]} x={60} y={196} text="dial surface" />
      <T x={196} y={60} s={10.5} c={C.brassHi}>pegwood</T>
      <Pn x={310} y={26} w={158} h={196} t="Never" tc={C.ruby} ok={false} />
      <Note x={322} y={66} lines={['solvents: none is', 'safe on every dial,', 'and some dials are', 'paint beneath', 'the lume', '', 'scraping bare metal:', 'it marks the dial']} c={C.text} s={10.5} lh={14} />
      <Pn x={12} y={230} w={456} h={84} t="Hands: clear the channel completely" />
      <path d="M40 286 L320 276 L352 272 L320 268 L40 260 Z" fill="url(#sk-steel)" stroke={M.steelD} />
      <path d="M70 280 L300 272 L310 272 L300 268 L70 264 Z" fill="#1a1612" />
      <T x={364} y={276} s={10.5} c={C.text}>bare channel:</T>
      <T x={364} y={290} s={10.5} c={C.text}>new lume keys in</T>
    </F>
  )
}

function BbMixLume() {
  const Blob = ({ x, kind }) => (
    <g>
      <rect x={x - 40} y={134} width={80} height={8} rx="2" fill="#2a2622" />
      {kind === 'thin' && <path d={`M${x - 36} 134 Q${x} 128 ${x + 36} 134 Z`} fill={M.lume} opacity="0.75" />}
      {kind === 'ok' && <path d={`M${x - 20} 134 Q${x - 18} 108 ${x} 108 Q${x + 18} 108 ${x + 20} 134 Z`} fill={M.lume} opacity="0.85" />}
      {kind === 'thick' && <path d={`M${x - 16} 134 L${x - 14} 104 L${x - 4} 98 L${x + 8} 104 L${x + 14} 96 L${x + 16} 134 Z`} fill={M.lume} opacity="0.85" />}
    </g>
  )
  return (
    <F h={316} view="Comparison · lume paste consistency" scale="schematic">
      <Pn x={12} y={26} w={148} h={170} t="Too thin" tc={C.ruby} ok={false} />
      <Blob x={86} kind="thin" />
      <T x={86} y={170} a="middle" s={10.5} c={C.text}>runs, won’t dome</T>
      <Pn x={166} y={26} w={148} h={170} t="Toothpaste" tc={C.emerald} ok />
      <Blob x={240} kind="ok" />
      <T x={240} y={164} a="middle" s={10.5} c={C.text}>holds a dome,</T>
      <T x={240} y={178} a="middle" s={10.5} c={C.text}>flows off the tool</T>
      <Pn x={320} y={26} w={148} h={170} t="Too thick" tc={C.ruby} ok={false} />
      <Blob x={394} kind="thick" />
      <T x={394} y={170} a="middle" s={10.5} c={C.text}>won’t leave the tool</T>
      <Sep x1={12} y1={206} x2={468} y2={206} />
      <circle cx={60} cy={252} r={14} fill="#e9f2ea" />
      <T x={84} y={246} s={10.5} c={C.text}>powder</T>
      <T x={84} y={262} s={10.5} c={C.dim}>+ its binder</T>
      <Arrow a={[160, 252]} b={[190, 252]} c="steel" w={1.4} />
      <Note x={200} y={246} lines={['Mix a tiny amount at a time:', 'it skins over within minutes.']} c={C.text} s={10.5} lh={15} />
    </F>
  )
}

function BbChargeLume() {
  return (
    <F h={326} view="Section · filling a marker" scale="schematic, magnified">
      {[
        ['Touch the recess', 0],
        ['Surface tension pulls it in', 1],
        ['Dried: settles flatter', 2],
      ].map(([t, i]) => {
        const x = 12 + i * 154
        const cx = x + 74
        return (
          <g key={t}>
            <Pn x={x} y={26} w={148} h={190} />
            <Num x={x + 16} y={44} n={i + 1} r={8} />
            <path d={`M${x + 14} 140 L${cx - 34} 140 L${cx - 34} 160 L${cx + 34} 160 L${cx + 34} 140 L${x + 134} 140 L${x + 134} 176 L${x + 14} 176 Z`} fill={M.dial} stroke="#a89c82" />
            {i === 0 && (
              <g>
                <line x1={cx + 10} y1={60} x2={cx} y2={136} stroke={C.steel} strokeWidth="1.6" />
                <circle cx={cx} cy={136} r={5} fill={M.lume} />
              </g>
            )}
            {i === 1 && <path d={`M${cx - 34} 160 L${cx - 34} 142 Q${cx} 128 ${cx + 34} 142 L${cx + 34} 160 Z`} fill={M.lume} opacity="0.85" />}
            {i === 2 && <path d={`M${cx - 34} 160 L${cx - 34} 141 Q${cx} 136 ${cx + 34} 141 L${cx + 34} 160 Z`} fill={M.lume} opacity="0.75" />}
            <T x={cx} y={192} a="middle" s={10.5} c={C.text}>
              {['Touch the recess', 'Surface tension', 'Dried: settles'][i]}
            </T>
            <T x={cx} y={206} a="middle" s={10} c={C.dim}>
              {['a very small amount', 'pulls it in', 'flatter than it went in'][i]}
            </T>
          </g>
        )
      })}
      <T x={240} y={124} a="middle" s={10} c={C.faint}>slight dome</T>
      <Pn x={12} y={226} w={456} h={88} t="Every marker the same height" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M${40 + i * 50} 290 L${40 + i * 50} 280 Q${56 + i * 50} ${i === 3 ? 268 : 275} ${72 + i * 50} 280 L${72 + i * 50} 290 Z`} fill={M.lume} opacity="0.85" />
      ))}
      <circle cx={206} cy={278} r={14} fill="none" stroke={C.ruby} strokeWidth="1.2" />
      <line x1={36} y1={275} x2={340} y2={275} stroke={C.emerald} strokeDasharray="3 3" />
      <Note x={350} y={268} lines={['even height,', 'even glow']} c={C.text} s={10.5} lh={14} />
    </F>
  )
}

function BbCureUv() {
  return (
    <F h={326} view="Inspection · cure, charge, check" scale="schematic">
      <Pn x={12} y={26} w={150} h={176} t="1 · Cure fully" />
      <circle cx={87} cy={108} r={40} fill="none" stroke={C.struct} strokeWidth="2" />
      <line x1={87} y1={108} x2={87} y2={80} stroke={C.text} strokeWidth="2" />
      <line x1={87} y1={108} x2={106} y2={116} stroke={C.text} strokeWidth="2" />
      <T x={87} y={170} a="middle" s={10.5} c={C.text}>hours, per the binder</T>
      <Pn x={170} y={26} w={298} h={176} t="2 · UV torch in the dark" />
      <path d="M210 60 L240 46 L248 62 L218 76 Z" fill="#2b2f33" stroke={C.struct} />
      <path d="M244 56 L380 90 L340 170 Z" fill="url(#bb-uv)" />
      <circle cx={360} cy={126} r={50} fill="#0c0d10" stroke={C.struct} />
      {Array.from({ length: 12 }, (_, i) => {
        const [x, y] = clk(360, 126, 40, i * 30)
        const weak = i === 4
        return <circle key={i} cx={x} cy={y} r={6} fill="url(#bb-glow)" opacity={weak ? 0.25 : 1} />
      })}
      <circle cx={clk(360, 126, 40, 120)[0]} cy={clk(360, 126, 40, 120)[1]} r={10} fill="none" stroke={C.ruby} strokeWidth="1.4" />
      <Lab p={[clk(360, 126, 40, 120)[0] + 8, clk(360, 126, 40, 120)[1] + 6]} x={440} y={194} text="weak marker" a="end" c={C.ruby} />
      <T x={196} y={130} s={10.5} c={C.text}>even brightness?</T>
      <T x={196} y={146} s={10.5} c={C.text}>any gaps?</T>
      <Pn x={12} y={212} w={226} h={102} t="Fix" tc={C.emerald} ok />
      <Note x={24} y={248} lines={['add a touch to that', 'one marker']} c={C.text} s={10.5} lh={14} />
      <Pn x={244} y={212} w={224} h={102} t="Not this" tc={C.ruby} ok={false} />
      <Note x={256} y={248} lines={['flooding the whole dial', 'to hide one gap']} c={C.text} s={10.5} lh={14} />
    </F>
  )
}

function BbProtectLume() {
  return (
    <F h={280} view="Handling · until the watch is cased" scale="schematic">
      <Pn x={12} y={26} w={150} h={200} t="By the edge" />
      <circle cx={87} cy={122} r={44} fill={M.dial} stroke="#a89c82" />
      {Array.from({ length: 12 }, (_, i) => {
        const [x, y] = clk(87, 122, 36, i * 30)
        return <circle key={i} cx={x} cy={y} r={3.4} fill={M.lume} />
      })}
      <path d="M36 112 Q30 122 36 132 L46 130 L44 114 Z" fill="#d8b49a" />
      <path d="M138 112 Q144 122 138 132 L128 130 L130 114 Z" fill="#d8b49a" />
      <T x={87} y={196} a="middle" s={10.5} c={C.text}>fingers on the rim,</T>
      <T x={87} y={210} a="middle" s={10.5} c={C.text}>never on the face</T>
      <Pn x={170} y={26} w={150} h={200} t="Hands on" />
      <circle cx={245} cy={130} r={46} fill={M.dial} stroke="#a89c82" />
      <circle cx={245} cy={130} r={38} fill="none" stroke="#e9e1c6" strokeWidth="14" opacity="0.6" />
      <line x1={245} y1={130} x2={245} y2={98} stroke={C.brassHi} strokeWidth="3" />
      <line x1={245} y1={130} x2={270} y2={142} stroke={C.brassHi} strokeWidth="3.4" />
      <circle cx={245} cy={104} r={2.4} fill={M.lume} />
      <T x={245} y={168} a="middle" s={10} c="#5d5446">protector</T>
      <G x={245} y={124}>
        <Pusher d={8} len={74} />
      </G>
      <T x={245} y={196} a="middle" s={10.5} c={C.text}>dial protector down</T>
      <T x={245} y={210} a="middle" s={10} c={C.dim}>before any hand tool</T>
      <Pn x={328} y={26} w={140} h={200} t="No solvents" tc={C.ruby} ok={false} />
      <rect x={378} y={70} width={40} height={70} rx="4" fill="#4a6e7f" />
      <rect x={388} y={56} width={20} height={16} fill="#2b2f33" />
      <line x1={366} y1={60} x2={430} y2={150} stroke={C.ruby} strokeWidth="2.4" />
      <T x={398} y={196} a="middle" s={10.5} c={C.text}>keep them away</T>
      <T x={398} y={210} a="middle" s={10.5} c={C.text}>from fresh lume</T>
      <T x={14} y={256} s={11} c={C.text}>Fresh lume is fragile until the watch is cased.</T>
    </F>
  )
}

export const FIGS = {
  'bb-face-down': BbFaceDown,
  'bb-compress': BbCompress,
  'bb-fit-strap': BbFitStrap,
  'bb-bar-check': BbBarCheck,
  'bb-leather': BbLeather,
  'bb-rubber': BbRubber,
  'bb-nato': BbNato,
  'bb-bracelet-care': BbBraceletCare,
  'bb-measure': BbMeasure,
  'bb-strap-inspect': BbStrapInspect,
  'bb-pin-push': BbPinPush,
  'bb-rejoin': BbRejoin,
  'bb-pin-seat': BbPinSeat,
  'bb-snap-pry': BbSnapPry,
  'bb-screw-tools': BbScrewTools,
  'bb-wont-open': BbWontOpen,
  'bb-wont-close': BbWontClose,
  'bb-hands-clear': BbHandsClear,
  'bb-date-then-time': BbDateThenTime,
  'bb-noon-flip': BbNoonFlip,
  'bb-wind-manual': BbWindManual,
  'bb-hack-second': BbHackSecond,
  'bb-wipe': BbWipe,
  'bb-rinse': BbRinse,
  'bb-magnets': BbMagnets,
  'bb-rate-home': BbRateHome,
  'bb-safety-check': BbSafetyCheck,
  'bb-service': BbService,
  'bb-glass-types': BbGlassTypes,
  'bb-glass-measure': BbGlassMeasure,
  'bb-acrylic-fit': BbAcrylicFit,
  'bb-mineral-fit': BbMineralFit,
  'bb-wr-rating': BbWrRating,
  'bb-crown-home': BbCrownHome,
  'bb-gaskets-heat': BbGasketsHeat,
  'bb-reseal': BbReseal,
  'bb-pressure-test': BbPressureTest,
  'bb-case-match': BbCaseMatch,
  'bb-dial-hands-match': BbDialHandsMatch,
  'bb-hand-holes': BbHandHoles,
  'bb-parts-list': BbPartsList,
  'bb-why-kit': BbWhyKit,
  'bb-kit-contents': BbKitContents,
  'bb-seiko-mod': BbSeikoMod,
  'bb-kit-tools': BbKitTools,
  'bb-kit-inspect': BbKitInspect,
  'bb-clean-setup': BbCleanSetup,
  'bb-dial-fit': BbDialFit,
  'bb-dial-check': BbDialCheck,
  'bb-second-hand': BbSecondHand,
  'bb-seat-movement': BbSeatMovement,
  'bb-crown-thread': BbCrownThread,
  'bb-secure-movement': BbSecureMovement,
  'bb-function-test': BbFunctionTest,
  'bb-crystal-press': BbCrystalPress,
  'bb-close-back': BbCloseBack,
  'bb-pressure-build': BbPressureBuild,
  'bb-day-test': BbDayTest,
  'bb-dust': BbDust,
  'bb-hands-foul': BbHandsFoul,
  'bb-crown-flush': BbCrownFlush,
  'bb-seconds-markers': BbSecondsMarkers,
  'bb-date-wrong': BbDateWrong,
  'bb-stop-date': BbStopDate,
  'bb-seconds-spin': BbSecondsSpin,
  'bb-rattle-rotor': BbRattleRotor,
  'bb-ligne': BbLigne,
  'bb-height-stack': BbHeightStack,
  'bb-stem-height': BbStemHeight,
  'bb-dial-feet': BbDialFeet,
  'bb-date-window': BbDateWindow,
  'bb-nh35-example': BbNh35Example,
  'bb-shortlist': BbShortlist,
  'bb-lume-grade': BbLumeGrade,
  'bb-radium-decide': BbRadiumDecide,
  'bb-strip-lume': BbStripLume,
  'bb-mix-lume': BbMixLume,
  'bb-charge-lume': BbChargeLume,
  'bb-cure-uv': BbCureUv,
  'bb-protect-lume': BbProtectLume,
}
