// Diagrams for the flagship service lessons: the ETA/Unitas 6497, the Seiko
// NH35, the ETA 2824-2, the Valjoux/ETA 7750, the Miyota 8215/9015 and the
// Seiko 7S/4R/6R family. Every movement layout here is a schematic: parts are
// placed to show what the step does, never as an exact map of a calibre.
// Original drawings on the strap kit. Nothing is traced from an ETA, Seiko,
// Witschi or other published figure, and every number matches the step text.
import { C, Fig, T, Note, Dim, Arrow, Num, Verdict, Tag, Sep } from '../strap/kit.jsx'

/* ------------------------------------------------------------------ */
/* Palette and defs for this file                                       */
/* ------------------------------------------------------------------ */
const M = {
  plate: '#5b5339',
  plateHi: '#6d6447',
  bridge: '#8b8574',
  ink: '#120f0d',
  ruby: '#c9495e',
  brassP: '#b89548',
  brassD: '#7d6430',
  steelD: '#55646e',
  dial: '#d8d0bd',
  dialDark: '#25221f',
  screen: '#1d2a24',
  lcd: '#b7c9b5',
  wood: '#c79a62',
  // lubricants
  o9010: '#7fc4e8',
  hp1300: '#e3a94a',
  o9415: '#c48ad8',
  brake: '#8fd19e',
  g8200: '#d9e07a',
  g9504: '#ea8c6c',
  g9501: '#f0a3bf',
  sc: '#f3d98a',
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
      {hatch('sb-cut', '#6f808b', '#a3b3bd')}
      {hatch('sb-bcut', '#7f6a33', '#c6a65c')}
      {hatch('sb-pcut', '#4a4331', '#6a604a')}
      {hatch('sb-jcut', '#8e2c3e', '#d0687a')}
      <pattern id="sb-knurl" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#a7b6bf" />
        <line x1="2" y1="0" x2="2" y2="4" stroke="#55646e" strokeWidth="1" />
      </pattern>
      <radialGradient id="sb-rotor" cx="0.5" cy="0.2" r="0.9">
        <stop offset="0" stopColor="#9aa9b2" />
        <stop offset="1" stopColor="#4f5d66" />
      </radialGradient>
      <linearGradient id="sb-peg" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#a87b47" />
        <stop offset="0.5" stopColor="#dcb27a" />
        <stop offset="1" stopColor="#a87b47" />
      </linearGradient>
      <linearGradient id="sb-solv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(150,200,220,0.35)" />
        <stop offset="1" stopColor="rgba(90,140,170,0.22)" />
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

// Horizontal flow of boxes joined by arrows. items: [title, sub?]
function Flow({ x, y, w, h = 40, items, gap = 12, c = C.brass, s = 10.5, nums }) {
  const bw = (w - gap * (items.length - 1)) / items.length
  return (
    <g>
      {items.map((it, i) => {
        const [a, b] = Array.isArray(it) ? it : [it]
        const bx = x + i * (bw + gap)
        return (
          <g key={i}>
            <rect x={bx} y={y} width={bw} height={h} rx="6" fill="rgba(255,255,255,0.03)" stroke={c} strokeOpacity="0.6" />
            {nums && <Num x={bx + 11} y={y + 11} n={i + 1} r={7} />}
            <T x={bx + bw / 2 + (nums ? 5 : 0)} y={b ? y + h / 2 - 2 : y + h / 2 + 4} a="middle" s={s} c={C.text} w={600}>
              {a}
            </T>
            {b && (
              <T x={bx + bw / 2 + (nums ? 5 : 0)} y={y + h / 2 + 12} a="middle" s={10} c={C.dim}>
                {b}
              </T>
            )}
            {i < items.length - 1 && <Arrow a={[bx + bw + 1, y + h / 2]} b={[bx + bw + gap - 1, y + h / 2]} c="brass" w={1.3} />}
          </g>
        )
      })}
    </g>
  )
}

// Caution / note band
function Band({ x, y, w, h, head, lines, c = C.ruby, f = 'rgba(194,88,99,0.10)', s = 10.5 }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={f} stroke={c} />
      {head && (
        <T x={x + 10} y={y + 17} s={11} c={c} w={700}>
          {head}
        </T>
      )}
      {lines.map((l, i) => (
        <T key={i} x={x + 10} y={y + (head ? 32 : 17) + i * 14} s={s} c={C.text}>
          {l}
        </T>
      ))}
    </g>
  )
}

// Timegrapher readout. rows: [label, value, colour?]
function TG({ x, y, w = 150, rows, title = 'timegrapher' }) {
  const h = 26 + rows.length * 26
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill="#141a17" stroke={C.steel} />
      <T x={x + 10} y={y + 16} s={10} c={C.faint} mono>
        {title}
      </T>
      {rows.map(([l, v, col], i) => (
        <g key={i}>
          <rect x={x + 8} y={y + 22 + i * 26} width={w - 16} height={22} rx="3" fill={M.screen} />
          <T x={x + 14} y={y + 37 + i * 26} s={10.5} c={C.dim}>
            {l}
          </T>
          <T x={x + w - 14} y={y + 38 + i * 26} a="end" s={12} c={col || M.lcd} mono w={700}>
            {v}
          </T>
        </g>
      ))}
    </g>
  )
}

// Lift-angle error bar: a true amplitude and what a wrong setting shows
function LiftBar({ x, y, w, lo, hi, step, truth, shows, lab }) {
  const X = (d) => x + ((d - lo) / (hi - lo)) * w
  const ticks = []
  for (let d = lo; d <= hi; d += step) ticks.push(d)
  return (
    <g>
      <line x1={x} y1={y} x2={x + w} y2={y} stroke={C.struct} />
      {ticks.map((d) => (
        <g key={d}>
          <line x1={X(d)} y1={y - 4} x2={X(d)} y2={y + 4} stroke={C.faint} />
          <T x={X(d)} y={y + 18} a="middle" s={10} c={C.faint} mono>
            {d}°
          </T>
        </g>
      ))}
      <circle cx={X(truth)} cy={y} r={6} fill={C.emerald} />
      <T x={X(truth)} y={y - 12} a="middle" s={10.5} c={C.emerald}>
        true {truth}°
      </T>
      <circle cx={X(shows)} cy={y} r={6} fill={C.ruby} />
      <T x={X(shows)} y={y - 12} a="middle" s={10.5} c={C.ruby}>
        {lab || `shows ≈ ${shows}°`}
      </T>
      <Arrow a={[X(truth) + 8, y]} b={[X(shows) - 9, y]} c="ruby" w={1.4} />
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

// Oil / grease dot with optional ring
const Dot = ({ x, y, c, r = 4 }) => <circle cx={x} cy={y} r={r} fill={c} stroke={C.ground} strokeWidth="1" />

// Legend of lubricant dots in a column or row
function OilKey({ x, y, items, row, gap = 16, s = 10.5 }) {
  let cx = x
  return (
    <g>
      {items.map(([c, l], i) => {
        const px = row ? cx : x
        const py = row ? y : y + i * gap
        if (row) cx += 22 + l.length * s * 0.55
        return (
          <g key={i}>
            <Dot x={px + 4} y={py - 4} c={c} />
            <T x={px + 13} y={py} s={s} c={C.text}>
              {l}
            </T>
          </g>
        )
      })}
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* Watch parts                                                          */
/* ------------------------------------------------------------------ */
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
      {jewel && <circle cx={cx} cy={cy} r={Math.max(2, r * 0.14)} fill={M.ruby} stroke={C.ground} strokeWidth="0.6" />}
    </g>
  )
}

// Ratchet-toothed wheel (saw teeth) in plan
function Ratchet({ cx, cy, r, n = 24, c = '#b9c6ce', fill = 'rgba(134,167,189,0.14)' }) {
  const pts = []
  for (let i = 0; i < n; i++) {
    const a = (i * 360) / n
    pts.push(pol(cx, cy, r, a), pol(cx, cy, r * 0.86, a + 360 / n - 0.5))
  }
  return <polygon points={pts.map((p) => p.join(',')).join(' ')} fill={fill} stroke={c} strokeWidth="1" />
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

// Barrel in plan with the mainspring coils visible (lid off)
function BarrelPlan({ cx, cy, r, coils = 5, lid }) {
  const sp = []
  for (let a = 0; a <= 360 * coils; a += 10) {
    const rr = r * 0.22 + (a / (360 * coils)) * r * 0.7
    sp.push(pol(cx, cy, rr, a))
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="rgba(201,162,76,0.10)" stroke={M.brassP} strokeWidth="3" strokeDasharray="4 3" />
      <circle cx={cx} cy={cy} r={r * 0.92} fill="none" stroke={M.brassP} strokeWidth="1.2" />
      {lid ? (
        <circle cx={cx} cy={cy} r={r * 0.9} fill="rgba(201,162,76,0.22)" stroke={M.brassD} />
      ) : (
        <polyline points={sp.map((p) => p.join(',')).join(' ')} fill="none" stroke={C.steel} strokeWidth="1" />
      )}
      <circle cx={cx} cy={cy} r={r * 0.2} fill="#8d9aa2" stroke={M.steelD} />
      <rect x={cx - r * 0.07} y={cy - r * 0.07} width={r * 0.14} height={r * 0.14} fill={M.steelD} />
    </g>
  )
}

// Schematic movement plan. Returns positions via mvP for annotation.
const MV = {
  barrel: [-0.4, -0.22, 0.4],
  centre: [0.02, 0.02, 0.22],
  third: [0.34, -0.36, 0.18],
  fourth: [0.5, 0.04, 0.15],
  escape: [0.4, 0.4, 0.13],
  pallet: [0.22, 0.52, 0.05],
  balance: [-0.08, 0.56, 0.28],
  keyless: [0.8, -0.02, 0.1],
}
const mvP = (cx, cy, r, k, dx = 0, dy = 0) => [cx + (MV[k][0] + dx) * r, cy + (MV[k][1] + dy) * r]
function Mvt({ cx, cy, r, label, bridges = false, rotor = false }) {
  const P = (k) => mvP(cx, cy, r, k)
  const R = (k) => MV[k][2] * r
  const [ex, ey] = P('escape')
  const [px, py] = P('pallet')
  const [bx, by] = P('balance')
  return (
    <g>
      <rect x={cx + r - 4} y={cy - 0.03 * r} width={0.26 * r} height={0.06 * r + 1} rx="1" fill="url(#sk-steel)" />
      <circle cx={cx} cy={cy} r={r} fill={M.plate} stroke={C.brass} strokeWidth="1.4" />
      <BarrelPlan cx={P('barrel')[0]} cy={P('barrel')[1]} r={R('barrel')} lid />
      <Wheel cx={P('centre')[0]} cy={P('centre')[1]} r={R('centre')} />
      <Wheel cx={P('third')[0]} cy={P('third')[1]} r={R('third')} />
      <Wheel cx={P('fourth')[0]} cy={P('fourth')[1]} r={R('fourth')} />
      <EscW cx={ex} cy={ey} r={R('escape')} />
      <g stroke={C.emerald} strokeWidth="2.2" strokeLinecap="round">
        <line x1={ex - R('escape') * 0.6} y1={ey + R('escape') * 0.8} x2={px + r * 0.08} y2={py - r * 0.02} />
        <line x1={px} y1={py} x2={bx + R('balance') * 0.55} y2={by + R('balance') * 0.05} />
      </g>
      <circle cx={px} cy={py} r={2.4} fill={M.ruby} />
      <Balance cx={bx} cy={by} r={R('balance')} />
      <Wheel cx={P('keyless')[0]} cy={P('keyless')[1]} r={R('keyless')} spokes={0} c="#b9c6ce" jewel={false} />
      {bridges && (
        <g opacity="0.5">
          <path d={`M${cx - 0.9 * r} ${cy - 0.1 * r} Q${cx - 0.6 * r} ${cy - 0.8 * r} ${cx + 0.1 * r} ${cy - 0.62 * r} L${cx - 0.05 * r} ${cy + 0.1 * r} Z`} fill={M.bridge} stroke={C.struct} />
          <path d={`M${cx + 0.1 * r} ${cy - 0.6 * r} Q${cx + 0.7 * r} ${cy - 0.5 * r} ${cx + 0.62 * r} ${cy + 0.2 * r} L${cx + 0.2 * r} ${cy + 0.3 * r} Z`} fill={M.bridge} stroke={C.struct} />
        </g>
      )}
      {rotor && <path d={`M${cx - r * 0.95} ${cy} A${r * 0.95} ${r * 0.95} 0 0 1 ${cx + r * 0.95} ${cy} Z`} fill="url(#sb-rotor)" opacity="0.85" stroke={C.steel} />}
      {label && (
        <T x={cx} y={cy + r + 16} a="middle" s={10.5} c={C.dim}>
          {label}
        </T>
      )}
    </g>
  )
}

// Oscillating weight (rotor) in plan, centred on the movement axis.
function Rotor({ cx, cy, r, ang = 0 }) {
  return (
    <g transform={`rotate(${ang} ${cx} ${cy})`}>
      <path d={`M${cx - r} ${cy} A${r} ${r} 0 0 0 ${cx + r} ${cy} L${cx + r * 0.3} ${cy} A${r * 0.3} ${r * 0.3} 0 0 1 ${cx - r * 0.3} ${cy} Z`} fill="url(#sb-rotor)" stroke={C.steel} />
      <circle cx={cx} cy={cy} r={r * 0.16} fill="#8d9aa2" stroke={M.steelD} />
      <circle cx={cx} cy={cy} r={r * 0.07} fill={M.steelD} />
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
      <rect x="-6" y={-len} width="12" height={Math.max(0, len - 30)} rx="2" fill="url(#sb-knurl)" stroke="#55646e" strokeWidth="0.6" />
    </g>
  )
}
function Oiler({ len = 70, drop = 3, c = M.o9010 }) {
  return (
    <g>
      <line x1="0" y1="0" x2="0" y2="-26" stroke={C.steel} strokeWidth="1.3" />
      <rect x="-2.6" y={-len} width="5.2" height={Math.max(0, len - 26)} rx="2" fill="#7c8d97" />
      {drop > 0 && <circle cx="0" cy="1" r={drop} fill={c} />}
    </g>
  )
}
// Pegwood, sharpened point at (0,0)
function Peg({ len = 90, w = 7 }) {
  return <path d={`M0 0 L${w / 2} -18 L${w / 2} ${-len} L${-w / 2} ${-len} L${-w / 2} -18 Z`} fill="url(#sb-peg)" stroke="#7a5532" strokeWidth="0.6" />
}
// Air blower bulb, nozzle at (0,0)
function Blower({ k = 1 }) {
  return (
    <g transform={`scale(${k})`}>
      <path d="M-2 0 L2 0 L3 -22 L-3 -22 Z" fill="#3b3b3b" />
      <ellipse cx="0" cy="-44" rx="16" ry="22" fill="#a3423c" stroke="#5e2420" />
    </g>
  )
}
// Loupe seen side-on, lens centre at (0,0)
function LoupeGlyph({ r = 14 }) {
  return (
    <g>
      <rect x={-r} y={-r * 0.7} width={r * 2} height={r * 1.4} rx="4" fill="#2d2a27" stroke={C.struct} />
      <ellipse cx="0" cy={r * 0.7} rx={r * 0.85} ry="3" fill="url(#sk-glass)" stroke={C.steel} />
    </g>
  )
}

/* ================================================================== */
/* svc-6497 · ETA/Unitas 6497                                          */
/* ================================================================== */

function Sb6497Reading() {
  return (
    <F h={330} view="Test · the baseline before the strip" scale="schematic">
      <Flow
        x={12}
        y={28}
        w={456}
        h={44}
        nums
        items={[
          ['Wind', '10 to 15 turns'],
          ['Run', 'about 20 min'],
          ['Set 44°', 'lift angle first'],
          ['Record', 'rate, amp, beat'],
        ]}
      />
      <TG
        x={12}
        y={88}
        w={168}
        title="6497 baseline"
        rows={[
          ['lift angle', '44°', C.brassHi],
          ['rate', '… s/d'],
          ['amplitude', '… °'],
          ['beat error', '… ms'],
        ]}
      />
      <T x={96} y={234} a="middle" s={10} c={C.faint}>fill in your own readings</T>

      <Pn x={192} y={88} w={276} h={124} t="Machine left at 53°" tc={C.ruby} c={C.ruby} />
      <LiftBar x={210} y={160} w={240} lo={220} hi={320} step={20} truth={250} shows={301} />
      <T x={330} y={200} a="middle" s={10.5} c={C.text}>a tired watch looks healthy</T>

      <Pn x={12} y={246} w={456} h={74} t="Also note, by hand" />
      {[
        ['winding feel', 'smooth, gritty, slipping?'],
        ['setting feel', 'hands turn evenly?'],
      ].map(([a, b], i) => (
        <g key={a}>
          <Verdict x={30 + i * 228} y={286} ok r={7} />
          <T x={44 + i * 228} y={284} s={11} c={C.text} w={600}>{a}</T>
          <T x={44 + i * 228} y={299} s={10} c={C.dim}>{b}</T>
        </g>
      ))}
      <T x={460} y={314} a="end" s={10} c={C.faint}>this record proves the service later</T>
    </F>
  )
}

function Sb6497Ratchet() {
  // barrel bridge in plan, schematic
  const rx = 128
  const ry = 176
  const cwx = 204
  const cwy = 104
  return (
    <F h={330} view="Plan · barrel bridge, 6497 type" scale="schematic">
      <path d="M44 290 L44 160 Q44 92 112 86 L214 74 Q250 74 252 108 L252 290 Z" fill={M.bridge} opacity="0.45" stroke={C.struct} />
      <Ratchet cx={rx} cy={ry} r={60} n={36} />
      <Screw x={rx} y={ry} r={10} ang={20} />
      <Ratchet cx={cwx} cy={cwy} r={26} n={20} c={M.brassP} fill="rgba(201,162,76,0.15)" />
      <Screw x={cwx} y={cwy} r={7} ang={-30} />
      {/* click */}
      <path d="M186 214 L170 226 L166 220 Z" fill="#b9c6ce" stroke={M.steelD} />
      <Screw x={192} y={218} r={4} ang={60} />
      <T x={204} y={236} s={10} c={C.dim}>click</T>
      {/* bridge screws */}
      {[[64, 270], [236, 270], [236, 150]].map(([x, y], i) => (
        <g key={i}>
          <Screw x={x} y={y} r={6} ang={i * 50} />
          <Num x={x + 14} y={y - 12} n={3} r={7} />
        </g>
      ))}
      <rect x={252} y={100} width={34} height={7} fill="url(#sk-steel)" />
      <T x={268} y={94} a="middle" s={10} c={C.dim}>stem</T>
      {/* turns */}
      <Turn cx={rx} cy={ry} r={22} from={60} to={-200} c="brass" />
      <Num x={rx - 40} y={ry - 38} n={1} />
      <Turn cx={cwx} cy={cwy} r={15} from={-60} to={200} c="ruby" />
      <Num x={cwx - 30} y={cwy - 28} n={2} />
      <Lab p={[rx, ry + 10]} x={150} y={312} text="ratchet-wheel screw: usual thread" s={10.5} />

      {/* right column */}
      <Band x={300} y={28} w={168} h={102} head="2 · Left-hand thread" lines={['upper crown-wheel screw:', 'CLOCKWISE to loosen', '(brass arrow = usual,', 'ruby = this screw)']} />
      <Tag x={300} y={150}>Forced the usual way</Tag>
      {/* cam-out inset */}
      <Ring x={350} y={210} r={40} c={C.ruby} />
      <rect x={322} y={222} width={56} height={14} fill="url(#sb-cut)" />
      <path d="M342 222 L342 212 L358 212 L358 222" fill={C.ground} stroke={C.struct} />
      <G x={354} y={208} ang={14}>
        <Screwdriver len={50} blade={12} />
      </G>
      <path d="M342 212 l3 -4 M356 212 l2 -3" stroke={C.ruby} strokeWidth="1.6" />
      <T x={400} y={202} s={10.5} c={C.ruby} w={600}>cams out,</T>
      <T x={400} y={216} s={10.5} c={C.ruby} w={600}>shears slot</T>
      <Verdict x={420} y={236} ok={false} r={8} />
      <T x={300} y={276} s={10.5} c={C.text}>Then the bridge screws (3)</T>
      <T x={300} y={290} s={10.5} c={C.text}>and lift the barrel out.</T>
      <T x={300} y={312} s={10} c={C.faint}>numbers show the order</T>
    </F>
  )
}

function Sb6497Train() {
  const wheels = [
    ['barrel', 30, M.brassP],
    ['centre', 22, M.brassP],
    ['third', 17, M.brassP],
    ['fourth', 14, M.brassP],
    ['escape', 12, C.steel],
  ]
  return (
    <F h={330} view="Sequence · train out, then the dial side" scale="schematic">
      <Tag x={12} y={42}>1 · Train bridge off, wheels out in this order</Tag>
      {wheels.map(([n, r, c], i) => {
        const x = 46 + i * 92
        return (
          <g key={n}>
            {n === 'escape' ? <EscW cx={x} cy={96} r={r + 4} /> : n === 'barrel' ? <BarrelPlan cx={x} cy={96} r={r} lid /> : <Wheel cx={x} cy={96} r={r} c={c} />}
            <Num x={x} y={146} n={i + 1} r={8} />
            <T x={x} y={170} a="middle" s={11} c={C.text}>{n}</T>
            <G x={x} y={96 - r - 6}>
              <Arrow a={[0, 0]} b={[0, -14]} c="brass" w={1.4} />
            </G>
            {i < 4 && <Arrow a={[x + 22, 146]} b={[x + 68, 146]} c="brass" w={1} o={0.6} />}
          </g>
        )
      })}
      <Sep x1={12} y1={186} x2={468} y2={186} />
      <Tag x={12} y={206}>2 · Flip: keyless works, captive from the dial side</Tag>
      {/* dial side keyless schematic */}
      <path d="M12 326 L12 214 L292 214 A140 140 0 0 1 306 326 Z" fill={M.plate} opacity="0.75" stroke={C.brass} strokeWidth="1.2" />
      <rect x={150} y={258} width={196} height={8} rx="1" fill="url(#sk-steel)" />
      <rect x={168} y={252} width={16} height={20} rx="2" fill="#b9c6ce" stroke={M.steelD} />
      <rect x={196} y={250} width={20} height={24} rx="2" fill="#9fb0ba" stroke={M.steelD} />
      <line x1={206} y1={250} x2={206} y2={274} stroke={M.steelD} />
      <path d="M96 226 L238 252 L236 260 L94 236 Z" fill="#94a5ae" stroke={M.steelD} />
      <circle cx={100} cy={231} r={4} fill={M.ruby} />
      <path d="M92 304 L204 276 L208 284 L96 312 Z" fill="#7e8f99" stroke={M.steelD} />
      <circle cx={98} cy={308} r={4} fill={M.ruby} />
      <Wheel cx={240} cy={296} r={13} spokes={0} c="#b9c6ce" jewel={false} />
      <Wheel cx={270} cy={312} r={9} spokes={0} c="#b9c6ce" jewel={false} />
      <Lab p={[176, 252]} x={356} y={230} text="winding pinion" a="start" />
      <Lab p={[150, 238]} x={30} y={262} text="setting lever" a="start" />
      <Lab p={[150, 292]} x={30} y={292} text="yoke" a="start" />
      <Lab p={[208, 250]} x={356} y={252} text="sliding pinion" a="start" />
      <Lab p={[330, 262]} x={356} y={276} text="stem" a="start" />
      <Lab p={[252, 296]} x={356} y={304} text="setting wheels" a="start" />
      <line x1={278} y1={312} x2={352} y2={304} stroke={C.struct} strokeWidth="0.8" opacity="0.85" />
      <circle cx={278} cy={312} r="2.2" fill={C.text} />
    </F>
  )
}

function Sb6497Barrel() {
  return (
    <F h={330} view="Section and plan · open the barrel" scale="schematic">
      <Tag x={12} y={40}>1 · Lid off at its notch</Tag>
      {/* barrel section */}
      <rect x={40} y={92} width={150} height={40} fill="url(#sb-bcut)" />
      <rect x={48} y={98} width={134} height={30} fill={C.ground} />
      <rect x={38} y={78} width={154} height={8} fill="url(#sb-bcut)" transform="rotate(-6 60 82)" />
      <rect x={109} y={66} width={12} height={86} fill="url(#sb-cut)" />
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <rect x={124 + i * 7} y={100} width={3} height={26} fill={C.steel} />
          <rect x={103 - i * 7} y={100} width={3} height={26} fill={C.steel} />
        </g>
      ))}
      <G x={46} y={82} ang={-60}>
        <Screwdriver len={50} blade={6} />
      </G>
      <T x={200} y={78} s={10.5} c={C.text}>lid</T>
      <T x={200} y={112} s={10.5} c={C.text}>drum</T>
      <T x={200} y={140} s={10.5} c={C.text}>arbor</T>
      <line x1={196} y1={137} x2={121} y2={146} stroke={C.struct} strokeWidth="0.8" />
      <T x={20} y={168} s={10.5} c={C.dim}>prise at the notch, not across the teeth</T>

      <Tag x={12} y={196}>2 · Coil direction, spring out</Tag>
      <BarrelPlan cx={72} cy={262} r={52} coils={5} />
      <Turn cx={72} cy={262} r={60} from={210} to={300} c="steel" w={1.4} />
      <T x={140} y={232} s={10.5} c={C.text}>sketch which</T>
      <T x={140} y={246} s={10.5} c={C.text}>way it winds</T>
      <T x={140} y={274} s={10.5} c={C.dim}>compare the spring</T>
      <T x={140} y={288} s={10.5} c={C.dim}>with the barrel: a</T>
      <T x={140} y={302} s={10.5} c={C.dim}>secondhand watch may</T>
      <T x={140} y={316} s={10.5} c={C.dim}>hold the wrong one</T>

      <Pn x={262} y={28} w={206} h={170} t="3 · Look for" />
      {[
        ['set spring', 'stays tightly coiled'],
        ['kinks', 'sharp bends in a coil'],
        ['scoring on the wall', 'drum bore'],
        ['worn arbor pivots', 'under the loupe'],
      ].map(([a, b], i) => (
        <g key={a}>
          <Verdict x={280} y={60 + i * 34} ok={false} r={7} />
          <T x={294} y={58 + i * 34} s={11} c={C.text} w={600}>{a}</T>
          <T x={294} y={72 + i * 34} s={10} c={C.dim}>{b}</T>
        </g>
      ))}
      <Pn x={262} y={210} w={206} h={110} t="4 · Lubricant" />
      <Dot x={282} y={244} c={M.g8200} r={6} />
      <T x={296} y={248} s={11} c={C.text} w={600}>8200 mainspring grease</T>
      <Verdict x={448} y={244} ok r={7} />
      <Dot x={282} y={276} c={M.brake} r={6} />
      <T x={296} y={280} s={11} c={C.text} w={600}>braking grease</T>
      <Verdict x={448} y={276} ok={false} r={7} />
      <T x={272} y={306} s={10} c={C.faint}>braking grease is for automatics</T>
    </F>
  )
}

function Sb6497Clean() {
  return (
    <F h={330} view="Comparison and detail · clean, peg, inspect" scale="schematic">
      <Pn x={12} y={28} w={222} h={110} t="Watch degreaser" ok tc={C.emerald} c={C.emerald} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={30 + i * 46} y={66} width={34} height={46} rx="4" fill="url(#sb-solv)" stroke={C.steel} />
          <rect x={28 + i * 46} y={60} width={38} height={7} rx="2" fill="#6d7a82" />
        </g>
      ))}
      <T x={176} y={84} s={10.5} c={C.text}>machine</T>
      <T x={176} y={98} s={10.5} c={C.text}>or jars</T>
      <T x={24} y={130} s={10} c={C.faint}>proper watch cleaning fluids</T>
      <Pn x={246} y={28} w={222} h={110} t="Not lighter fuel" ok={false} tc={C.ruby} c={C.ruby} />
      <rect x={270} y={58} width={40} height={60} rx="5" fill="#5f6a4a" stroke={C.struct} />
      <rect x={282} y={50} width={16} height={9} fill="#9aa2a6" />
      <path d="M262 92 L250 78" stroke={C.ruby} strokeWidth="2" />
      <T x={324} y={84} s={10.5} c={C.text}>no substitute for</T>
      <T x={324} y={98} s={10.5} c={C.text}>a degreaser</T>

      <Tag x={12} y={162}>Peg every jewel hole</Tag>
      {/* jewel section */}
      <rect x={30} y={226} width={70} height={30} fill="url(#sb-pcut)" />
      <rect x={130} y={226} width={70} height={30} fill="url(#sb-pcut)" />
      <path d="M100 226 L130 226 L126 236 L122 256 L108 256 L104 236 Z" fill="url(#sb-jcut)" />
      <G x={115} y={238}>
        <Peg len={60} w={10} />
      </G>
      <Turn cx={115} cy={196} r={16} from={240} to={420} c="brass" w={1.5} />
      <T x={150} y={190} s={10.5} c={C.text}>half a turn</T>
      <T x={150} y={204} s={10.5} c={C.dim}>fresh point each time</T>
      <T x={115} y={276} a="middle" s={10.5} c={C.dim}>jewel in plate, section</T>
      <T x={20} y={300} s={10.5} c={C.text}>then blow parts dry</T>

      <Tag x={262} y={162}>Under the loupe before rebuild</Tag>
      <Ring x={300} y={236} r={36} />
      <rect x={276} y={230} width={48} height={12} rx="2" fill={C.steel} />
      <rect x={300} y={232} width={22} height={8} fill="#c9d4da" />
      <T x={300} y={290} a="middle" s={10.5} c={C.text}>pivots: wear</T>
      <Ring x={410} y={236} r={36} />
      <circle cx={410} cy={236} r={22} fill="rgba(201,73,94,0.55)" stroke={M.ruby} />
      <circle cx={410} cy={236} r={5} fill={C.ground} />
      <path d="M398 220 L406 232 L402 244" stroke="#f3e2e6" strokeWidth="1.2" fill="none" />
      <T x={410} y={290} a="middle" s={10.5} c={C.text}>jewels: cracks</T>
      <T x={355} y={316} a="middle" s={10} c={C.faint}>find it now, not on the timegrapher</T>
    </F>
  )
}

function Sb6497Rebuild() {
  return (
    <F h={330} view="Sequence · rebuild, then the free-train test" scale="schematic">
      <Flow
        x={12}
        y={28}
        w={456}
        h={44}
        nums
        s={10.5}
        items={[['Mainplate'], ['Keyless'], ['Barrel'], ['Train', 'wheels'], ['Train', 'bridge']]}
      />
      <Arrow d="M440 76 Q440 96 420 100" c="brass" w={1.3} />
      <T x={410} y={104} a="end" s={10.5} c={C.brassHi}>air test here, before any pallet</T>

      {/* air test */}
      <Pn x={12} y={118} w={300} h={160} t="Blow on the escape wheel" />
      <Wheel cx={70} cy={204} r={30} />
      <Wheel cx={128} cy={176} r={20} />
      <EscW cx={182} cy={212} r={26} />
      <G x={250} y={224} ang={-62}>
        <Blower k={0.8} />
      </G>
      <path d="M216 214 q8 -4 16 0 M216 222 q8 -4 16 0" stroke={C.steel} strokeWidth="1" fill="none" />
      <Turn cx={182} cy={212} r={36} from={-40} to={60} c="emerald" />
      <Turn cx={182} cy={212} r={44} from={120} to={90} c="emerald" w={1.3} />
      <T x={22} y={262} s={10.5} c={C.text}>spins, then gently rocks back</T>

      <Pn x={322} y={118} w={146} h={74} t="Free" ok tc={C.emerald} c={C.emerald} />
      <T x={332} y={160} s={10.5} c={C.text}>spins and rocks</T>
      <T x={332} y={174} s={10.5} c={C.text}>back: go on</T>
      <Pn x={322} y={204} w={146} h={74} t="Stops dead" ok={false} tc={C.ruby} c={C.ruby} />
      <T x={332} y={246} s={10.5} c={C.text}>dirt, a bent pivot</T>
      <T x={332} y={260} s={10.5} c={C.text}>or a bridge not home</T>

      <Flow x={12} y={290} w={300} h={30} items={[['Pallet fork'], ['Balance, last']]} c={C.emerald} />
      <T x={322} y={310} s={10} c={C.faint}>only after the train passes</T>
    </F>
  )
}

function Sb6497Endshake() {
  const y0 = 96
  return (
    <F h={330} view="Section · endshake and side-shake" scale="play exaggerated, schematic">
      {/* bridge and plate */}
      <rect x={20} y={56} width={200} height={20} fill="url(#sb-pcut)" />
      <rect x={20} y={196} width={200} height={20} fill="url(#sb-pcut)" />
      <T x={228} y={70} s={10.5} c={C.text}>bridge</T>
      <T x={228} y={210} s={10.5} c={C.text}>mainplate</T>
      {/* jewels */}
      <path d="M110 56 L130 56 L128 76 L112 76 Z" fill="url(#sb-jcut)" />
      <path d="M110 196 L130 196 L128 216 L112 216 Z" fill="url(#sb-jcut)" />
      {/* arbor lifted */}
      <rect x={117} y={66} width={6} height={24} fill="#c9d4da" />
      <rect x={114} y={y0 - 6} width={12} height={110} fill="#a9b7bf" />
      <rect x={117} y={y0 + 100} width={6} height={10} fill="#c9d4da" />
      <rect x={60} y={y0 + 40} width={120} height={8} fill={M.brassP} />
      <G x={60} y={y0 + 60} ang={-30}>
        <Peg len={70} w={8} />
      </G>
      <Arrow a={[90, 150]} b={[90, 132]} c="brass" w={1.6} />
      <T x={20} y={174} s={10.5} c={C.brassHi}>lift gently</T>
      {/* endshake inset */}
      <Ring x={160} y={268} r={44} />
      <rect x={130} y={240} width={60} height={14} fill="url(#sb-pcut)" />
      <path d="M150 240 L170 240 L168 254 L152 254 Z" fill="url(#sb-jcut)" />
      <rect x={156} y={256} width={8} height={30} fill="#c9d4da" />
      <rect x={144} y={286} width={32} height={6} fill="#a9b7bf" />
      <line x1={186} y1={254} x2={196} y2={254} stroke={C.dim} />
      <line x1={186} y1={258} x2={196} y2={258} stroke={C.dim} />
      <T x={20} y={250} s={10.5} c={C.text}>rises and drops</T>
      <T x={20} y={264} s={10.5} c={C.text}>“a hair”</T>
      <Arrow a={[200, 252]} b={[200, 262]} c="emerald" w={1.3} both />

      {/* right column */}
      <Tag x={290} y={42}>Order on the 6497</Tag>
      {['barrel', 'centre', 'third', 'fourth', 'escape'].map((w, i) => (
        <g key={w}>
          <Num x={300} y={62 + i * 22} n={i + 1} r={7} />
          <T x={314} y={66 + i * 22} s={11} c={C.text}>{w}</T>
        </g>
      ))}
      <T x={378} y={110} s={10.5} c={C.dim}>then pallet</T>
      <T x={378} y={124} s={10.5} c={C.dim}>fork, balance</T>
      <Pn x={290} y={180} w={178} h={58} t="Up and down" />
      <T x={300} y={226} s={10.5} c={C.text}>endshake: a hair of rise</T>
      <Pn x={290} y={244} w={178} h={34} />
      <T x={300} y={265} s={10.5} c={C.text}>sideways nudge: side-shake</T>
      <Band x={290} y={284} w={178} h={38} lines={['None? bridge not seated or', 'pivot not home: loosen, look']} />
    </F>
  )
}

function Sb6497Regulate() {
  const X = (d) => 30 + (d - 240) * 2.6
  return (
    <F h={330} view="Chart · regulate, run, then case" scale="lesson targets">
      <Flow
        x={12}
        y={28}
        w={456}
        h={40}
        items={[['Demagnetise'], ['Timegrapher'], ['Run 24–48 h'], ['Re-check'], ['Case']]}
      />
      <Tag x={14} y={96}>Amplitude, dial up, fully wound</Tag>
      <rect x={X(270)} y={108} width={X(310) - X(270)} height={28} rx="3" fill="rgba(123,165,131,0.35)" stroke={C.emerald} />
      <T x={X(290)} y={127} a="middle" s={11} c={C.text} w={600}>270–310°</T>
      <line x1={X(240)} y1={144} x2={X(340)} y2={144} stroke={C.struct} />
      {[240, 270, 310, 340].map((d) => (
        <g key={d}>
          <line x1={X(d)} y1={140} x2={X(d)} y2={148} stroke={C.faint} />
          <T x={X(d)} y={162} a="middle" s={10} c={C.dim} mono>{d}°</T>
        </g>
      ))}
      <Pn x={340} y={84} w={128} h={84} t="Rate" />
      <T x={350} y={124} s={11} c={C.text} w={600}>a small daily</T>
      <T x={350} y={140} s={11} c={C.text} w={600}>gain</T>
      <T x={350} y={158} s={10} c={C.faint}>not dead on zero</T>

      <Pn x={12} y={180} w={270} h={140} t="Beat error under ~0.5 ms" />
      {/* hairspring stud on cock, schematic */}
      <Balance cx={90} cy={262} r={40} />
      <path d="M90 262 L170 230 L180 240 L96 270 Z" fill={M.bridge} opacity="0.6" stroke={C.struct} />
      <circle cx={160} cy={236} r={6} fill="#b9c6ce" stroke={M.steelD} />
      <Turn cx={90} cy={262} r={78} from={56} to={76} c="brass" w={1.5} />
      <Turn cx={90} cy={262} r={78} from={76} to={56} c="brass" w={1.5} />
      <Lab p={[160, 236]} x={200} y={286} text="hairspring stud" sub="correct beat here" />

      <Pn x={292} y={180} w={176} h={140} t="Display back" />
      <Screw x={316} y={226} r={8} c="#3f6fb0" />
      <T x={332} y={230} s={10.5} c={C.text}>blued screws</T>
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M304 ${256 + i * 6} q24 -6 48 0`} fill="none" stroke={C.dim} strokeWidth="1" />
        ))}
      </g>
      <T x={360} y={268} s={10.5} c={C.text}>dressed</T>
      <T x={360} y={282} s={10.5} c={C.text}>bridges</T>
      <T x={302} y={310} s={10} c={C.faint}>optional, if you want it</T>
    </F>
  )
}

function Sb6497Reserve() {
  const X = (h) => 50 + h * 6.2
  const Y = (a) => 240 - (a - 150) * 0.9
  return (
    <F h={330} view="Chart · prove the reserve" scale="schematic curve">
      <line x1={X(0)} y1={Y(150)} x2={X(60)} y2={Y(150)} stroke={C.struct} />
      <line x1={X(0)} y1={Y(150)} x2={X(0)} y2={Y(320)} stroke={C.struct} />
      {[0, 12, 24, 36, 48, 60].map((h) => (
        <g key={h}>
          <line x1={X(h)} y1={Y(150)} x2={X(h)} y2={Y(150) + 4} stroke={C.faint} />
          <T x={X(h)} y={Y(150) + 17} a="middle" s={10} c={C.dim} mono>{h} h</T>
        </g>
      ))}
      <T x={X(0) - 6} y={Y(300) + 4} a="end" s={10} c={C.dim}>amp</T>
      <rect x={X(46)} y={Y(320)} width={X(53) - X(46)} height={Y(150) - Y(320)} fill="rgba(123,165,131,0.18)" stroke={C.emerald} strokeDasharray="3 3" />
      <T x={X(49.5)} y={Y(320) - 6} a="middle" s={10.5} c={C.emerald}>46–53 h</T>
      <path d={`M${X(0)} ${Y(300)} C${X(10)} ${Y(290)} ${X(24)} ${Y(266)} ${X(36)} ${Y(240)} S${X(46)} ${Y(190)} ${X(50)} ${Y(150)}`} fill="none" stroke={C.brassHi} strokeWidth="2" />
      <circle cx={X(0)} cy={Y(300)} r={4} fill={C.brassHi} />
      <circle cx={X(24)} cy={Y(266)} r={4} fill={C.brassHi} />
      <line x1={X(24)} y1={Y(300)} x2={X(24)} y2={Y(266)} stroke={C.dim} strokeDasharray="2 2" />
      <line x1={X(0)} y1={Y(300)} x2={X(30)} y2={Y(300)} stroke={C.dim} strokeDasharray="2 2" />
      <T x={X(25)} y={Y(286)} s={10.5} c={C.text}>fall of about</T>
      <T x={X(25)} y={Y(286) + 14} s={10.5} c={C.text}>10 to 15%: accepted</T>
      <T x={X(1)} y={Y(300) - 10} s={10.5} c={C.text}>read at full wind</T>
      <T x={X(3)} y={Y(150) + 34} s={10} c={C.faint}>dial up, wound by hand to the stop. Never force past it.</T>

      <Pn x={12} y={284} w={456} h={38} />
      <T x={22} y={307} s={10.5} c={C.ruby} w={600}>Short?</T>
      <T x={70} y={307} s={10.5} c={C.text}>spring length</T>
      <Arrow a={[152, 303]} b={[168, 303]} c="brass" w={1.2} />
      <T x={174} y={307} s={10.5} c={C.text}>barrel endshake</T>
      <Arrow a={[272, 303]} b={[288, 303]} c="brass" w={1.2} />
      <T x={294} y={307} s={10.5} c={C.text}>the train</T>
      <T x={460} y={307} a="end" s={10} c={C.faint}>in that order</T>
    </F>
  )
}


/* ================================================================== */
/* svc-nh35 · Seiko NH35                                               */
/* ================================================================== */

// Crown and stem side view at a pull position (0, 1, 2)
function CrownPos({ x, y, pos, hi }) {
  const dx = pos * 12
  return (
    <g>
      <rect x={x} y={y - 3} width={60 + dx} height={6} fill="url(#sk-steel)" />
      <rect x={x + 60 + dx} y={y - 11} width={14} height={22} rx="3" fill="url(#sb-knurl)" stroke={hi ? C.brassHi : M.steelD} strokeWidth={hi ? 1.6 : 0.6} />
      <rect x={x - 8} y={y - 20} width={8} height={40} fill="url(#sb-pcut)" />
    </g>
  )
}

function SbNhStem() {
  return (
    <F h={330} view="Sequence · stem out at position 0" scale="schematic">
      <Flow
        x={12}
        y={28}
        w={456}
        h={44}
        nums
        items={[
          ['Baseline', '53°, typical'],
          ['Let down', 'by crown, now'],
          ['Crown at 0', 'pushed fully in'],
          ['Press + pull', 'together'],
        ]}
      />
      <Pn x={12} y={86} w={170} h={140} t="Crown positions" />
      {[0, 1, 2].map((p) => (
        <g key={p}>
          <CrownPos x={40} y={124 + p * 34} pos={p} hi={p === 0} />
          <T x={24} y={128 + p * 34} a="middle" s={11} c={p === 0 ? C.brassHi : C.dim} w={p === 0 ? 700 : undefined} mono>
            {p}
          </T>
        </g>
      ))}
      <T x={134} y={128} s={10.5} c={C.brassHi}>stem</T>
      <T x={134} y={142} s={10.5} c={C.brassHi}>comes out</T>

      <Pn x={192} y={86} w={276} h={140} t="Release and pull at once" />
      <path d="M200 216 L200 150 Q260 112 360 120 L360 216 Z" fill={M.plate} stroke={C.brass} />
      <rect x={300} y={174} width={110} height={7} fill="url(#sk-steel)" />
      <rect x={410} y={166} width={16} height={22} rx="3" fill="url(#sb-knurl)" stroke={M.steelD} />
      <path d="M262 168 L306 172 L306 180 L262 178 Z" fill="#94a5ae" stroke={M.steelD} />
      <circle cx={282} cy={160} r={6} fill="#c5ced4" stroke={C.brassHi} strokeWidth="1.4" />
      <G x={282} y={154} ang={-20}>
        <Peg len={48} w={7} />
      </G>
      <Arrow a={[300, 118]} b={[290, 140]} c="brass" w={1.6} />
      <Arrow a={[428, 196]} b={[454, 196]} c="brass" w={1.8} />
      <Num x={258} y={130} n={1} r={7} />
      <Num x={440} y={210} n={2} r={7} />
      <T x={366} y={146} s={10} c={C.dim}>release point</T>
      <T x={366} y={206} s={10} c={C.dim}>pull, gently</T>
      <T x={206} y={210} s={10} c={C.faint}>location: see your guide</T>

      <Band
        x={12}
        y={238}
        w={456}
        h={82}
        head="Stem won’t come?"
        lines={['Let go, check the crown really is at 0, and try again.', 'Hard pulling can damage the setting lever.', 'Caliber Corner’s reported method: a Seiko technical guide wins.']}
      />
    </F>
  )
}

function SbNhStrip() {
  return (
    <F h={330} view="Plan · two sides to strip" scale="schematic">
      <Pn x={12} y={28} w={222} h={292} t="Train side" />
      <Mvt cx={122} cy={160} r={84} />
      {['barrel bridge', 'barrel', 'train bridge', 'wheels in order'].map((t, i) => (
        <g key={t}>
          <Num x={30 + (i % 2) * 104} y={272 + Math.floor(i / 2) * 24} n={i + 1} r={7} />
          <T x={42 + (i % 2) * 104} y={276 + Math.floor(i / 2) * 24} s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
      <Num x={64} y={118} n={2} r={7} />
      <Num x={170} y={104} n={4} r={7} />

      <Pn x={246} y={28} w={222} h={292} t="Dial side: stays captive" />
      <circle cx={357} cy={168} r={92} fill={M.plate} stroke={C.brass} strokeWidth="1.2" />
      <circle cx={357} cy={168} r={84} fill="none" stroke="#c8c0a8" strokeWidth="7" opacity="0.8" />
      <circle cx={357} cy={168} r={80} fill="none" stroke="#8d8673" strokeWidth="1.2" strokeDasharray="2 2" />
      <Wheel cx={357} cy={168} r={20} spokes={0} c={M.brassP} />
      <Wheel cx={392} cy={210} r={16} spokes={3} c={M.brassP} />
      <path d="M318 216 L356 238 L352 244 L314 222 Z" fill="#94a5ae" stroke={M.steelD} />
      <circle cx={316} cy={219} r={3.4} fill={M.ruby} />
      <rect x={430} y={164} width={30} height={7} fill="url(#sk-steel)" />
      <path d="M404 150 L432 162 L430 172 L402 160 Z" fill="#7e8f99" stroke={M.steelD} />
      <Lab p={[357, 84]} x={300} y={72} text="date ring" up />
      <Lab p={[392, 210]} x={420} y={292} text="date driving wheel" a="end" />
      <Lab p={[336, 228]} x={300} y={292} text="date jumper" />
      <Lab p={[416, 160]} x={440} y={120} text="keyless works" a="end" up />
      <T x={357} y={312} a="middle" s={10} c={C.faint}>calendar and keyless come off here</T>
    </F>
  )
}

function SbNhClean() {
  const Ins = ({ x, y, ok, children, t }) => (
    <g>
      <Ring x={x} y={y} r={38} c={ok ? C.emerald : C.ruby} />
      {children}
      <Verdict x={x + 30} y={y - 30} ok={ok} r={8} />
      <T x={x} y={y + 54} a="middle" s={10.5} c={C.text}>{t}</T>
    </g>
  )
  return (
    <F h={330} view="Detail · what the loupe must clear" scale="magnified, schematic">
      <Flow
        x={12}
        y={28}
        w={456}
        h={44}
        items={[
          ['Degrease', 'machine or jars'],
          ['Peg', 'every jewel hole'],
          ['Blow dry', ''],
          ['Inspect', 'pivots and jewels'],
        ]}
      />
      <T x={14} y={92} s={10.5} c={C.ruby}>Not lighter fuel.</T>
      <Tag x={14} y={118}>Pivots</Tag>
      <Ins x={64} y={174} ok t="bright, straight">
        <rect x={34} y={166} width={36} height={16} fill={C.steel} />
        <rect x={70} y={169} width={24} height={10} rx="4" fill="#d4dde2" />
      </Ins>
      <Ins x={170} y={174} ok={false} t="worn, ridged">
        <rect x={140} y={166} width={36} height={16} fill={C.steel} />
        <path d="M176 169 L186 170 L188 173 L192 172 L198 174 L192 176 L188 175 L186 178 L176 179 Z" fill="#d4dde2" />
      </Ins>
      <Tag x={254} y={118}>Jewels</Tag>
      <Ins x={304} y={174} ok t="clean, whole">
        <circle cx={304} cy={174} r={24} fill="rgba(201,73,94,0.55)" stroke={M.ruby} />
        <circle cx={304} cy={174} r={5} fill={C.ground} />
      </Ins>
      <Ins x={412} y={174} ok={false} t="cracked or chipped">
        <circle cx={412} cy={174} r={24} fill="rgba(201,73,94,0.55)" stroke={M.ruby} />
        <circle cx={412} cy={174} r={5} fill={C.ground} />
        <path d="M398 156 L408 170 L402 190" stroke="#f3e2e6" strokeWidth="1.3" fill="none" />
        <path d="M430 162 l-6 4 l4 4" stroke="#f3e2e6" strokeWidth="1.3" fill="none" />
      </Ins>
      <Band
        x={12}
        y={252}
        w={456}
        h={68}
        c={C.brass}
        f="rgba(208,168,79,0.08)"
        head="Before the rebuild, not after"
        lines={['A worn pivot or cracked jewel found now is a part to order;', 'found on the timegrapher, it is a second strip.']}
      />
    </F>
  )
}

function SbNhRebuild() {
  const X = (t) => 60 + t * 34
  return (
    <F h={330} view="Sequence and chart · rebuild, then coast test" scale="schematic curve">
      <Flow x={12} y={28} w={456} h={36} items={[['Mainplate'], ['Keyless'], ['Barrel'], ['Train'], ['Train bridge']]} />
      <Pn x={12} y={78} w={456} h={170} t="Blow on the escape wheel, then watch it stop" />
      <line x1={X(0)} y1={226} x2={X(9)} y2={226} stroke={C.struct} />
      <line x1={X(0)} y1={226} x2={X(0)} y2={104} stroke={C.struct} />
      <T x={X(0) - 6} y={116} a="end" s={10} c={C.dim}>spin</T>
      <T x={X(9)} y={242} a="end" s={10} c={C.dim}>time after the puff</T>
      <path d={`M${X(0)} 112 C${X(2)} 114 ${X(4)} 140 ${X(5)} 170 C${X(6)} 200 ${X(7)} 224 ${X(8.4)} 226`} fill="none" stroke={C.emerald} strokeWidth="2.2" />
      <path d={`M${X(0)} 112 L${X(0.8)} 118 L${X(1.2)} 226`} fill="none" stroke={C.ruby} strokeWidth="2.2" />
      <T x={X(4.8)} y={128} s={11} c={C.emerald} w={600}>coasts to a gradual stop</T>
      <T x={X(4.8)} y={142} s={10.5} c={C.text}>clean and free: go on</T>
      <T x={X(1.4)} y={200} s={11} c={C.ruby} w={600}>stops abruptly</T>
      <T x={X(1.4)} y={214} s={10.5} c={C.text}>find the drag first</T>
      <Verdict x={X(8.6)} y={206} ok r={8} />
      <Verdict x={X(1.2) + 6} y={182} ok={false} r={8} />
      <Tag x={14} y={268}>Then, in this order</Tag>
      <Flow x={12} y={278} w={456} h={40} nums items={[['Pallet fork'], ['Balance'], ['Automatic works', 'last']]} c={C.emerald} />
    </F>
  )
}

function SbNhMagic() {
  const wx = 236
  const wy = 132
  return (
    <F h={330} view="Plan · the Magic Lever winds both ways" scale="schematic">
      {/* rotor wheel with eccentric */}
      <circle cx={84} cy={wy} r={34} fill="rgba(134,167,189,0.12)" stroke={C.steel} strokeWidth="1.2" />
      <circle cx={84} cy={wy} r={4} fill={M.ruby} />
      <circle cx={102} cy={wy} r={8} fill="#b9c6ce" stroke={M.steelD} />
      <Turn cx={84} cy={wy} r={44} from={-50} to={50} c="steel" w={1.5} />
      <Turn cx={84} cy={wy} r={44} from={230} to={130} c="steel" w={1.5} />
      <T x={84} y={wy + 62} a="middle" s={10.5} c={C.text}>rotor turns</T>
      <T x={84} y={wy + 76} a="middle" s={10.5} c={C.text}>either way</T>
      {/* lever */}
      <path d={`M98 ${wy - 6} L190 ${wy - 6} L214 ${wy - 30} L220 ${wy - 26} L198 ${wy - 2} L198 ${wy + 2} L220 ${wy + 26} L214 ${wy + 30} L190 ${wy + 6} L98 ${wy + 6} Z`} fill="#94a5ae" stroke={M.steelD} />
      <Arrow a={[140, wy + 24]} b={[176, wy + 24]} c="brass" w={1.6} both />
      <T x={158} y={wy + 44} a="middle" s={10.5} c={C.brassHi}>lever shuttles</T>
      {/* ratchet wheel */}
      <Ratchet cx={wx} cy={wy} r={34} n={22} c={M.brassP} fill="rgba(201,162,76,0.15)" />
      <circle cx={wx} cy={wy} r={5} fill={M.ruby} />
      <Turn cx={wx} cy={wy} r={46} from={-40} to={70} c="emerald" w={2} />
      <T x={wx + 6} y={wy + 60} s={10.5} c={C.emerald}>always one way</T>
      <Lab p={[214, wy - 28]} x={200} y={56} text="claw 1" up />
      <Lab p={[214, wy + 28]} x={200} y={226} text="claw 2" />
      <Lab p={[130, wy - 6]} x={110} y={74} text="Magic Lever" up />
      <Lab p={[wx + 30, wy - 16]} x={300} y={60} text="the wheel it drives" up a="start" />

      {/* checks */}
      <Pn x={334} y={78} w={134} h={132} t="Turn rotor slowly" />
      {['wheel advances', 'one way ✓', 'and the other ✓', 'no scrape'].map((t, i) => (
        <T key={i} x={346} y={116 + i * 20} s={10.5} c={i === 0 ? C.text : C.dim}>{t}</T>
      ))}
      <Band
        x={12}
        y={244}
        w={456}
        h={76}
        head="One direction does nothing?"
        lines={['Bridge off; under a loupe look at both claws: wear, dirt, a claw out of place.', 'Clean, refit, test again. A worn claw: fit a new lever.']}
      />
    </F>
  )
}

function SbNhDial() {
  const cx = 110
  const cy = 156
  const r = 92
  const [f1x, f1y] = clk(cx, cy, r * 0.94, 48)
  const [f2x, f2y] = clk(cx, cy, r * 0.94, 228)
  return (
    <F h={330} view="Plan and side · mod-case fit" scale="schematic · retailer’s figures">
      <circle cx={cx} cy={cy} r={r} fill={M.dial} stroke={C.struct} />
      {Array.from({ length: 60 }, (_, i) => {
        const [a, b] = clk(cx, cy, r - 3, i * 6)
        const [c2, d2] = clk(cx, cy, r - (i % 5 === 0 ? 13 : 7), i * 6)
        return <line key={i} x1={a} y1={b} x2={c2} y2={d2} stroke="#3a342c" strokeWidth={i % 5 === 0 ? 1.6 : 0.7} />
      })}
      <rect x={cx + 50} y={cy - 8} width={20} height={16} fill="#fff" stroke="#3a342c" />
      <T x={cx + 60} y={cy + 4} a="middle" s={10} c="#222" w={700}>15</T>
      <rect x={cx + r} y={cy - 7} width={18} height={14} rx="3" fill="url(#sb-knurl)" />
      {[[f1x, f1y], [f2x, f2y]].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={6} fill="none" stroke={C.ruby} strokeWidth="2" />
          <circle cx={x} cy={y} r={2.5} fill={C.ruby} />
        </g>
      ))}
      <line x1={f1x} y1={f1y} x2={f2x} y2={f2y} stroke={C.ruby} strokeDasharray="3 3" opacity="0.6" />
      <Lab p={[f1x, f1y]} x={232} y={50} text="foot at 8 min" a="start" up />
      <Lab p={[f2x, f2y]} x={18} y={276} text="foot at 38 min" a="start" />
      <T x={cx + r + 2} y={cy + 26} s={10} c={C.dim}>crown at 3</T>

      {/* side stack */}
      <Tag x={262} y={92}>Side · not to scale</Tag>
      <rect x={278} y={120} width={150} height={6} fill={M.dial} stroke={C.struct} strokeWidth="0.6" />
      <rect x={278} y={128} width={150} height={60} fill={M.plate} stroke={C.brass} />
      <T x={353} y={163} a="middle" s={10.5} c={C.text}>NH35</T>
      <Dim a={[278, 120]} b={[278, 188]} off={12} />
      <T x={262} y={206} s={11} c={C.text} mono>7.59 mm</T>
      <T x={330} y={206} s={10} c={C.dim}>installed height</T>
      <line x1={428} y1={123} x2={446} y2={110} stroke={C.struct} strokeWidth="0.8" />
      <T x={466} y={104} a="end" s={10.5} c={C.text}>dial, mm</T>
      <T x={436} y={136} s={10.5} c={C.emerald}>0.4 ideal</T>
      <T x={436} y={150} s={10.5} c={C.ruby}>0.6 limit</T>

      <Pn x={262} y={222} w={206} h={58} t="NH36 day wheel" />
      <T x={272} y={256} s={10.5} c={C.text}>3 o’clock ≠ 4 o’clock version:</T>
      <T x={272} y={270} s={10.5} c={C.text}>pre-aligned, not interchangeable</T>
      <Band x={12} y={290} w={456} h={32} lines={['Date off-centre in the window? Stop and check the dial before the hands go on.']} />
    </F>
  )
}

function SbNhRegulate() {
  const X = (d) => 40 + (d - 220) * 3.2
  return (
    <F h={330} view="Chart · regulate a 3 Hz movement" scale="lesson targets">
      <Flow x={12} y={28} w={456} h={40} items={[['Demagnetise'], ['Timegrapher'], ['Run', 'a day or two'], ['Re-check'], ['Case']]} />
      <Tag x={14} y={92}>Amplitude, dial up, fully wound</Tag>
      <rect x={X(250)} y={104} width={X(300) - X(250)} height={30} rx="3" fill="rgba(123,165,131,0.35)" stroke={C.emerald} />
      <T x={X(275)} y={124} a="middle" s={11} c={C.text} w={600}>~250–300°</T>
      <line x1={X(220)} y1={142} x2={X(340)} y2={142} stroke={C.struct} />
      {[220, 250, 300, 340].map((d) => (
        <g key={d}>
          <line x1={X(d)} y1={138} x2={X(d)} y2={146} stroke={C.faint} />
          <T x={X(d)} y={160} a="middle" s={10} c={C.dim} mono>{d}°</T>
        </g>
      ))}
      <Arrow a={[X(305), 119]} b={[X(330), 119]} c="steel" w={1.4} dash="3 3" />
      <T x={X(303)} y={106} s={10.5} c={C.steel}>4 Hz sits a touch higher</T>
      <TG
        x={12}
        y={196}
        w={200}
        title="NH35 · 21,600 A/h"
        rows={[
          ['rate', 'small gain'],
          ['amplitude', '~250–300°'],
          ['beat error', '< ~0.5 ms'],
        ]}
      />
      <Pn x={226} y={196} w={242} h={124} t="Then" />
      <T x={238} y={236} s={11} c={C.text} w={600}>Log amplitude and rate</T>
      <T x={238} y={252} s={10.5} c={C.dim}>your baseline for the next NH35</T>
      <T x={238} y={282} s={11} c={C.text} w={600}>Case it</T>
      <T x={238} y={298} s={10.5} c={C.dim}>often straight into a mod case</T>
    </F>
  )
}

function SbNhHack() {
  return (
    <F h={330} view="Test · what the NH35 adds over the 7S26" scale="schematic">
      <Pn x={12} y={28} w={148} h={190} t="1 · Hacking" />
      <CrownPos x={30} y={66} pos={2} hi />
      <T x={30} y={92} s={10.5} c={C.text}>pull to time-setting</T>
      <circle cx={86} cy={150} r={34} fill={M.dialDark} stroke={C.struct} />
      <line x1={86} y1={150} x2={86} y2={120} stroke={C.ruby} strokeWidth="1.4" />
      <rect x={78} y={108} width={16} height={8} fill="none" />
      <T x={86} y={202} a="middle" s={10.5} c={C.text}>seconds stop</T>
      <T x={86} y={214} a="middle" s={10} c={C.dim}>push home: restarts</T>

      <Pn x={166} y={28} w={148} h={190} t="2 · Hand-winding" />
      <CrownPos x={184} y={66} pos={0} hi />
      <Turn cx={262} cy={66} r={16} from={20} to={160} c="brass" />
      <T x={184} y={112} s={10.5} c={C.text}>wind by crown</T>
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${200 + i * 26} 150 l6 -10 l6 10`} fill="none" stroke={C.brassHi} strokeWidth="1.6" />
      ))}
      <T x={240} y={186} a="middle" s={10.5} c={C.text}>a steady click</T>

      <Pn x={320} y={28} w={148} h={190} t="3 · Reserve" />
      <rect x={340} y={72} width={108} height={20} rx="3" fill="none" stroke={C.struct} />
      <rect x={342} y={74} width={104} height={16} rx="2" fill="rgba(123,165,131,0.5)" />
      <T x={394} y={112} a="middle" s={10.5} c={C.text}>wind fully, note time</T>
      <T x={394} y={126} a="middle" s={10.5} c={C.text}>run down, dial up</T>
      <T x={394} y={170} a="middle" s={20} c={C.brassHi} w={700} mono>~41 h</T>
      <T x={394} y={190} a="middle" s={10} c={C.dim}>expect about this</T>

      <Tag x={14} y={244}>If it fails</Tag>
      <rect x={12} y={252} width={456} height={30} rx="5" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <Verdict x={28} y={267} ok={false} r={7} />
      <T x={44} y={271} s={10.5} c={C.text}>Won’t hack: check the keyless parts on the dial side went back right.</T>
      <rect x={12} y={288} width={456} height={30} rx="5" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <Verdict x={28} y={303} ok={false} r={7} />
      <T x={44} y={307} s={10.5} c={C.text}>Reserve well short: start with the barrel.</T>
    </F>
  )
}

/* ================================================================== */
/* svc-2824 · ETA 2824-2                                               */
/* ================================================================== */

function Sb2824Calibre() {
  return (
    <F h={330} view="Plan and side · the ETA 2824-2" scale="schematic layout">
      <Mvt cx={112} cy={130} r={78} />
      <Dim a={[34, 222]} b={[190, 222]} off={0} text="25.6 mm" />
      <rect x={34} y={244} width={156} height={20} rx="2" fill={M.plate} stroke={C.brass} />
      <Dim a={[200, 244]} b={[200, 264]} off={0} />
      <T x={208} y={258} s={10.5} c={C.dim} mono>4.6 mm</T>
      <T x={112} y={284} a="middle" s={10} c={C.faint}>side, height</T>

      <Pn x={252} y={28} w={216} h={196} t="Data" />
      {[
        ['beat', '28,800 A/h (4 Hz)'],
        ['jewels', '25'],
        ['reserve', '~38–42 h'],
        ['crown', 'hacking + hand-winding'],
        ['shock', 'Incabloc'],
        ['regulator', 'Etachron'],
        ['winding', 'both ways, via reverser'],
      ].map(([a, b], i) => (
        <g key={a}>
          <T x={262} y={62 + i * 23} s={10.5} c={C.dim}>{a}</T>
          <T x={330} y={62 + i * 23} s={10.5} c={C.text} w={600}>{b}</T>
        </g>
      ))}
      <Tag x={14} y={306}>Grades</Tag>
      {['Standard', 'Elaboré', 'Top', 'Chronomètre'].map((g, i) => (
        <g key={g}>
          <rect x={70 + i * 100} y={292} width={92} height={22} rx="4" fill={`rgba(208,168,79,${0.06 + i * 0.07})`} stroke={C.brass} strokeOpacity="0.6" />
          <T x={116 + i * 100} y={307} a="middle" s={10.5} c={C.text}>{g}</T>
        </g>
      ))}
      <T x={252} y={246} s={10.5} c={C.text}>Grades differ in finishing and</T>
      <T x={252} y={260} s={10.5} c={C.text}>adjustment, not in architecture.</T>
      <T x={252} y={276} s={10} c={C.faint}>The Sellita SW200 is near-identical.</T>
    </F>
  )
}

function Sb2824Sheet() {
  return (
    <F h={330} view="Reference · work from ETA’s sheet" scale="schematic">
      {/* sheet */}
      <path d="M14 30 L176 30 L196 50 L196 228 L14 228 Z" fill="#e9e3d4" stroke={C.struct} />
      <path d="M176 30 L176 50 L196 50" fill="#cfc7b4" stroke={C.struct} />
      <text x={26} y={52} fontSize="12" fontWeight="700" fill="#2a241d">CT 2824-2</text>
      <text x={26} y={68} fontSize="10.5" fill="#4a4034">revision 25</text>
      <text x={26} y={82} fontSize="10.5" fill="#4a4034">6 October 2022</text>
      <line x1={26} y1={92} x2={184} y2={92} stroke="#b9ad96" />
      {[
        ['reserve, minimum', '38 h'],
        ['reserve, typical', '42 h'],
        ['lift angle, typical', '50°'],
      ].map(([a, b], i) => (
        <g key={a}>
          <text x={26} y={114 + i * 22} fontSize="10.5" fill="#4a4034">{a}</text>
          <text x={184} y={114 + i * 22} fontSize="12" fontWeight="700" fill="#2a241d" textAnchor="end">{b}</text>
        </g>
      ))}
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1={26} y1={186 + i * 10} x2={150 - i * 20} y2={186 + i * 10} stroke="#c9bfa9" strokeWidth="3" />
      ))}
      <T x={105} y={246} a="middle" s={10} c={C.faint}>check your sheet’s date</T>

      <Pn x={210} y={28} w={258} h={110} t="Set 50°, not 52°" tc={C.brass} />
      <LiftBar x={228} y={98} w={222} lo={270} hi={300} step={10} truth={280} shows={291} lab="52° shows ≈ 291°" />
      <T x={339} y={132} a="middle" s={10.5} c={C.text}>reads 4% high</T>

      <Pn x={210} y={148} w={258} h={80} t="Why forum charts disagree" />
      <line x1={226} y1={196} x2={452} y2={196} stroke={C.struct} strokeWidth="2" />
      <T x={226} y={214} s={10} c={C.dim} mono>2009</T>
      <T x={452} y={214} a="end" s={10} c={C.dim} mono>2016</T>
      <T x={339} y={188} a="middle" s={10.5} c={C.text}>lubrication changed ≥ 9 times</T>

      <Pn x={12} y={256} w={220} h={64} t="Now" />
      <T x={24} y={296} s={11} c={C.text} w={600}>Take your baseline reading</T>
      <T x={24} y={310} s={10} c={C.dim}>at 50°, before you strip it</T>
      <Band x={244} y={256} w={224} h={64} head="ETA’s caution" lines={['Eye protection is compulsory', 'for all work on this movement.']} />
    </F>
  )
}

function Layer({ x, y, w, h = 14, fill, label, n, c = C.text }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill={fill} stroke={C.struct} strokeWidth="0.7" />
      {n && <Num x={x - 14} y={y + h / 2} n={n} r={7} />}
      <T x={x + w + 8} y={y + h / 2 + 4} s={10.5} c={c}>{label}</T>
    </g>
  )
}

function Sb2824Strip() {
  return (
    <F h={330} view="Exploded side view · strip order" scale="schematic, not to scale">
      <Tag x={14} y={42}>Train side, top down</Tag>
      <Layer x={40} y={58} w={110} fill={M.bridge} label="barrel bridge" n={1} />
      <g>
        <rect x={50} y={88} width={60} height={20} rx="2" fill="url(#sb-bcut)" />
        <Num x={26} y={98} n={2} r={7} />
        <T x={118} y={102} s={10.5} c={C.text}>barrel</T>
      </g>
      <Layer x={70} y={124} w={140} fill={M.bridge} label="train bridge" n={3} />
      {[
        [60, 'centre'],
        [104, 'third'],
        [140, 'fourth'],
        [176, 'escape'],
      ].map(([x, l]) => (
        <g key={l}>
          <rect x={x} y={154} width={4} height={26} fill="#c9d4da" />
          <rect x={x - 12} y={162} width={28} height={4} fill={l === 'escape' ? C.steel : M.brassP} />
        </g>
      ))}
      <Num x={26} y={168} n={4} r={7} />
      <T x={210} y={170} s={10.5} c={C.text}>wheels, in order</T>
      <rect x={30} y={200} width={200} height={20} rx="2" fill={M.plate} stroke={C.brass} />
      <T x={130} y={214} a="middle" s={10.5} c={C.text}>mainplate</T>

      <Arrow d="M238 210 C272 210 282 170 300 150" c="brass" w={1.6} />
      <T x={270} y={232} a="middle" s={11} c={C.brassHi} w={600}>flip</T>

      <Tag x={300} y={42}>Dial side, top down</Tag>
      <Layer x={320} y={64} w={100} fill="#c8c0a8" label="" n={6} />
      <T x={320} y={98} s={10.5} c={C.text}>calendar (date)</T>
      <Layer x={330} y={108} w={80} fill="#94a5ae" label="" n={5} />
      <T x={330} y={140} s={10.5} c={C.text}>keyless works</T>
      <rect x={306} y={150} width={150} height={20} rx="2" fill={M.plate} stroke={C.brass} />
      <T x={381} y={164} a="middle" s={10.5} c={C.text}>mainplate</T>

      <Band
        x={12}
        y={250}
        w={456}
        h={70}
        c={C.brass}
        f="rgba(208,168,79,0.08)"
        head="Lay the parts out in the order they came off"
        lines={['The reversing wheels come off with the automatic device earlier:', 'keep them apart, they are not washed (next step).']}
      />
    </F>
  )
}

// Reversing wheel in plan: outer toothed wheel with inner pinion
function RevWheel({ cx, cy, r, hi }) {
  return (
    <g>
      <Wheel cx={cx} cy={cy} r={r} spokes={0} c={hi ? C.brassHi : M.brassP} jewel={false} />
      <circle cx={cx} cy={cy} r={r * 0.5} fill="rgba(134,167,189,0.2)" stroke={C.steel} />
      {[0, 120, 240].map((a) => {
        const [x1, y1] = pol(cx, cy, r * 0.5, a)
        const [x2, y2] = pol(cx, cy, r * 0.3, a + 40)
        return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.steel} strokeWidth="1.4" />
      })}
      <circle cx={cx} cy={cy} r={r * 0.2} fill="#8d9aa2" />
    </g>
  )
}

function Sb2824ReverserClean() {
  return (
    <F h={330} view="Comparison · what goes in the wash" scale="schematic">
      <Pn x={12} y={28} w={262} h={160} t="Into the degreaser" ok tc={C.emerald} c={C.emerald} />
      <rect x={34} y={70} width={140} height={96} rx="10" fill="url(#sb-solv)" stroke={C.steel} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          <line x1={34} y1={86 + i * 14} x2={174} y2={86 + i * 14} stroke={C.steel} strokeWidth="0.5" opacity="0.6" />
        </g>
      ))}
      <Wheel cx={70} cy={104} r={16} />
      <Wheel cx={118} cy={132} r={12} />
      <Wheel cx={148} cy={98} r={10} />
      <rect x={52} y={140} width={34} height={8} rx="2" fill="#94a5ae" />
      <T x={186} y={104} s={10.5} c={C.text}>everything</T>
      <T x={186} y={118} s={10.5} c={C.text}>else</T>
      <T x={186} y={146} s={10} c={C.dim}>peg jewels,</T>
      <T x={186} y={160} s={10} c={C.dim}>blow dry, loupe</T>

      <Pn x={286} y={28} w={182} h={160} t="Kept out" ok={false} tc={C.ruby} c={C.ruby} />
      <ellipse cx={376} cy={112} rx={66} ry={34} fill="#2b2620" stroke={C.dim} />
      <RevWheel cx={346} cy={110} r={18} />
      <RevWheel cx={404} cy={110} r={18} />
      <T x={377} y={164} a="middle" s={11} c={C.text} w={600}>reversing wheels</T>
      <T x={377} y={178} a="middle" s={10.5} c={C.ruby}>“do not wash”</T>

      <Pn x={12} y={198} w={456} h={52} />
      <T x={24} y={220} s={11} c={C.text} w={600}>Sticky? The classic 2824 winding complaint.</T>
      <T x={24} y={237} s={10.5} c={C.emerald}>Fit new pre-lubricated wheels.</T>
      <Band
        x={12}
        y={258}
        w={456}
        h={64}
        head="Older practice"
        lines={['Wash the reversers and treat with a dip lubricant: not ETA’s current method.', 'A heavy grease stops them freewheeling either way.']}
      />
    </F>
  )
}

function Sb2824ReverserRule() {
  return (
    <F h={330} view="Test by hand · lock one way, free the other" scale="schematic">
      <Pn x={12} y={28} w={222} h={150} t="Turn one way: locks" ok tc={C.emerald} c={C.emerald} />
      <RevWheel cx={80} cy={110} r={36} hi />
      <Turn cx={80} cy={110} r={46} from={20} to={110} c="emerald" />
      <T x={140} y={98} s={10.5} c={C.text}>wheel and</T>
      <T x={140} y={112} s={10.5} c={C.text}>pinion turn</T>
      <T x={140} y={126} s={10.5} c={C.text}>together</T>
      <Pn x={246} y={28} w={222} h={150} t="Other way: runs free" ok tc={C.emerald} c={C.emerald} />
      <RevWheel cx={314} cy={110} r={36} hi />
      <Turn cx={314} cy={110} r={46} from={110} to={20} c="steel" />
      <T x={374} y={98} s={10.5} c={C.text}>wheel spins,</T>
      <T x={374} y={112} s={10.5} c={C.text}>pinion stays,</T>
      <T x={374} y={126} s={10.5} c={C.text}>no grit, no drag</T>
      <T x={240} y={196} a="middle" s={10.5} c={C.dim}>ETA positions: 28 reversing wheel · 27 auxiliary reversing wheel</T>

      <Bx x={12} y={210} w={140} h={46} l={['Sticky or gritty?', 'replace, don’t oil']} c={C.ruby} />
      <Arrow a={[154, 233]} b={[170, 233]} c="brass" w={1.3} />
      <Bx x={172} y={210} w={140} h={46} l={['Prelubricated', 'original: ETA’s rule']} c={C.emerald} />
      <Arrow a={[314, 233]} b={[330, 233]} c="brass" w={1.3} />
      <Bx x={332} y={210} w={136} h={46} l={['None to be had?', 'clean-and-dip fallback']} c={C.brass} />
      <T x={400} y={272} a="middle" s={10} c={C.faint}>outside ETA’s instructions</T>
      <rect x={12} y={282} width={456} height={40} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={22} y={299} s={10.5} c={C.text}>Have new wheels ready before you start.</T>
      <T x={22} y={314} s={10} c={C.dim}>One repair site reports this calibre’s automatic parts wear faster than the rest.</T>
    </F>
  )
}

function Sb2824Epilame() {
  return (
    <F h={330} view="Process and detail · epilame before rebuild" scale="schematic">
      <Tag x={14} y={42}>ETA’s parts for epilame</Tag>
      {[
        ['2 to 8', 'keyless parts'],
        ['32', 'setting wheel'],
        ['40', 'date jumper'],
      ].map(([a, b], i) => (
        <g key={a}>
          <rect x={12 + i * 154} y={52} width={146} height={40} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.steel} />
          <T x={24 + i * 154} y={77} s={13} c={C.brassHi} w={700} mono>{a}</T>
          <T x={150 + i * 154} y={77} a="end" s={10.5} c={C.text}>{b}</T>
        </g>
      ))}
      <Flow
        x={12}
        y={106}
        w={456}
        h={42}
        nums
        items={[
          ['Clean, dry', 'after washing'],
          ['Apply', 'per Moebius'],
          ['Let dry', ''],
          ['Drop test', 'beads?'],
        ]}
      />
      <T x={14} y={168} s={10.5} c={C.dim}>Moebius Fixodrop ES/BS 8981 stops oil spreading, so it stays where you put it.</T>

      <Pn x={12} y={180} w={222} h={86} t="It has taken" ok tc={C.emerald} c={C.emerald} />
      <rect x={30} y={240} width={186} height={10} fill="url(#sb-cut)" />
      <path d="M100 240 Q100 214 123 214 Q146 214 146 240 Z" fill={M.o9010} opacity="0.85" />
      <T x={160} y={226} s={10.5} c={C.text}>beaded</T>
      <Pn x={246} y={180} w={222} h={86} t="Not taken" ok={false} tc={C.ruby} c={C.ruby} />
      <rect x={264} y={240} width={186} height={10} fill="url(#sb-cut)" />
      <path d="M286 240 Q300 232 357 232 Q414 232 428 240 Z" fill={M.o9010} opacity="0.85" />
      <T x={357} y={224} a="middle" s={10.5} c={C.text}>creeps away</T>

      <Band x={12} y={274} w={300} h={48} lines={['ETA: Fixodrop is very volatile. Close the', 'container airtight straight after use.']} />
      <T x={324} y={292} s={10} c={C.faint}>Other parts: practice</T>
      <T x={324} y={305} s={10} c={C.faint}>varies; pallet stones and</T>
      <T x={324} y={318} s={10} c={C.faint}>escape wheel: split</T>
    </F>
  )
}

function Sb2824Rebuild() {
  return (
    <F h={330} view="Comparison · ETA’s rebuild order" scale="sequence">
      <Tag x={14} y={42}>General order, as on the 6497</Tag>
      <Flow x={12} y={50} w={456} h={36} items={[['Mainplate'], ['Keyless'], ['Barrel'], ['Train'], ['Train bridge']]} c={C.struct} />
      <Tag x={14} y={114} c={C.brassHi}>ETA 2824-2: follow the sheet</Tag>
      <Flow
        x={12}
        y={122}
        w={456}
        h={44}
        nums
        items={[['Mainplate'], ['Keyless'], ['Train wheels', '+ train bridge'], ['Barrel', '+ barrel bridge']]}
      />
      <rect x={240} y={118} width={230} height={52} rx="8" fill="none" stroke={C.brassHi} strokeDasharray="4 3" />
      <T x={355} y={186} a="middle" s={10.5} c={C.brassHi}>train before barrel</T>

      <Tag x={14} y={214}>Then</Tag>
      <Flow
        x={12}
        y={222}
        w={456}
        h={44}
        nums
        c={C.emerald}
        items={[
          ['Air test', 'free train'],
          ['Pallet', ''],
          ['Balance', ''],
          ['Auto device', 'last'],
        ]}
      />
      <T x={14} y={292} s={10.5} c={C.dim}>Air test on the escape wheel: a clean, free train spins freely.</T>
      <T x={14} y={308} s={10.5} c={C.dim}>Where the sheet and a general order differ, the sheet wins.</T>
    </F>
  )
}

function Sb2824Stages() {
  const rows = [
    ['Keyless', [[M.hp1300, 'HP-1300: stem, sliding pinion, lever contacts'], [M.g9504, '9504: winding pinion teeth']]],
    ['Going train', [[M.o9010, '9010'], [M.hp1300, 'HP-1300: split, read the sheet’s drawing']]],
    ['Barrel stage', [[M.hp1300, 'HP-1300: barrel arbor, barrel bridge, crown wheel']]],
    ['Pallet, balance', [[M.o9415, '9415: pallet stones'], [M.o9010, '9010: pallet and balance points']]],
    ['Automatic', [[M.hp1300, 'HP-1300: framework'], [M.o9010, '9010, very small: oscillating weight']]],
    ['Calendar, motion', [[M.hp1300, 'HP-1300'], [M.sc, 'HP-1300 SC'], [M.o9010, 'very small: SC and 9010']]],
  ]
  return (
    <F h={340} view="Table · ETA’s lubrication stages" scale="from the sheet, schematic">
      {rows.map(([st, items], i) => {
        const y = 30 + i * 34 + (i > 0 ? 14 : 0)
        const two = i === 0
        return (
          <g key={st}>
            <rect x={12} y={y} width={456} height={two ? 44 : 30} rx="5" fill="rgba(255,255,255,0.025)" stroke={C.line} />
            <T x={22} y={y + 19} s={11} c={C.text} w={600}>{st}</T>
            {(() => {
              let cx = 128
              return items.map(([c, l], j) => {
                const px = two ? 128 : cx
                const py = two ? y + 15 + j * 16 : y + 15
                cx += 26 + l.length * 5.6
                return (
                  <g key={j}>
                    <Dot x={px + 4} y={py} c={c} />
                    <T x={px + 13} y={py + 4} s={10.5} c={C.dim}>{l}</T>
                  </g>
                )
              })
            })()}
          </g>
        )
      })}
      <Band x={12} y={250} w={196} h={82} head="Left-hand thread" lines={['crown-wheel screw:', 'turn CLOCKWISE', 'to undo it']} />
      <Pn x={218} y={250} w={250} h={82} t="Date jumper, position 40" />
      {[
        [['oil it'], 228],
        [['advance', '~10 teeth'], 312],
        [['repeat'], 396],
      ].map(([l, x], i) => (
        <g key={x}>
          <Bx x={x} y={274} w={64} h={32} l={l} c={C.brass} s={10.5} lh={12} />
          {i < 2 && <Arrow a={[x + 65, 290]} b={[x + 83, 290]} c="brass" w={1.2} />}
        </g>
      ))}
      <T x={343} y={320} a="middle" s={10.5} c={C.brassHi}>until it has had three oilings</T>
    </F>
  )
}

function Sb2824Etachron() {
  const cx = 120
  const cy = 170
  return (
    <F h={330} view="Plan · the Etachron regulator" scale="schematic">
      <Balance cx={cx} cy={cy} r={70} />
      <path d={`M${cx - 20} ${cy - 16} L${cx + 112} ${cy - 92} L${cx + 124} ${cy - 72} L${cx + 14} ${cy + 18} Z`} fill={M.bridge} opacity="0.55" stroke={C.struct} />
      <circle cx={cx} cy={cy} r={16} fill="#c5ced4" stroke={M.steelD} />
      {/* regulator arm */}
      <path d={`M${cx} ${cy} L${cx - 70} ${cy - 66} L${cx - 62} ${cy - 74} Z`} fill="#94a5ae" stroke={M.steelD} />
      <Turn cx={cx} cy={cy} r={104} from={-58} to={-36} c="brass" />
      <Turn cx={cx} cy={cy} r={104} from={-36} to={-58} c="brass" />
      <T x={14} y={cy - 92} s={11} c={C.text}>− / +</T>
      {/* stud carrier */}
      <path d={`M${cx} ${cy} L${cx - 58} ${cy + 60} L${cx - 48} ${cy + 66} Z`} fill="#7e8f99" stroke={M.steelD} />
      <circle cx={cx - 54} cy={cy + 62} r={6} fill="#c5ced4" stroke={C.brassHi} strokeWidth="1.4" />
      <Turn cx={cx} cy={cy} r={96} from={216} to={232} c="steel" />
      <Turn cx={cx} cy={cy} r={96} from={232} to={216} c="steel" />
      <Lab p={[cx - 54, cy - 58]} x={150} y={52} text="regulator: rate" a="start" up />
      <Lab p={[cx - 54, cy + 62]} x={120} y={300} text="stud carrier: beat" a="start" />

      <TG
        x={268}
        y={30}
        w={200}
        title="targets"
        rows={[
          ['rate', 'small gain'],
          ['amplitude', '270–310°'],
          ['beat error', '< ~0.5 ms'],
        ]}
      />
      <T x={268} y={150} s={10} c={C.faint}>dial up, fully wound</T>
      {['Demagnetise', 'Rate and beat', 'Run a day or two', 'Re-check', 'Case, seal, pressure-test'].map((t, i) => (
        <g key={t}>
          <Num x={278} y={176 + i * 24} n={i + 1} r={7} />
          <T x={292} y={180 + i * 24} s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
    </F>
  )
}

function Sb2824Prove() {
  const X = (h) => 30 + h * 8.4
  return (
    <F h={330} view="Test · prove what ETA gives numbers for" scale="schematic">
      <Tag x={14} y={42}>1 · Reserve, dial up, from full wind</Tag>
      <rect x={X(0)} y={58} width={X(38) - X(0)} height={26} fill="rgba(194,88,99,0.22)" stroke={C.ruby} />
      <rect x={X(38)} y={58} width={X(50) - X(38)} height={26} fill="rgba(123,165,131,0.25)" stroke={C.emerald} />
      <T x={X(19)} y={76} a="middle" s={10.5} c={C.text}>stops before 38 h: short of ETA’s minimum</T>
      {[0, 10, 20, 30, 38, 42, 50].map((h) => (
        <g key={h}>
          <line x1={X(h)} y1={84} x2={X(h)} y2={90} stroke={C.faint} />
          <T x={X(h)} y={102} a="middle" s={10} c={h === 38 || h === 42 ? C.text : C.dim} mono>{h === 50 ? '50 h' : h}</T>
        </g>
      ))}
      <line x1={X(42)} y1={54} x2={X(42)} y2={88} stroke={C.brassHi} strokeWidth="2" />
      <T x={X(42)} y={50} a="middle" s={10.5} c={C.brassHi}>42 h typical</T>

      <Pn x={12} y={116} w={222} h={150} t="2 · Hacking" />
      <CrownPos x={64} y={160} pos={2} hi />
      <Balance cx={74} cy={212} r={28} />
      <T x={112} y={206} s={10.5} c={C.text}>balance</T>
      <T x={112} y={220} s={10.5} c={C.text}>should stop</T>
      <T x={22} y={256} s={10} c={C.dim}>No? stop lever (15), under the barrel bridge</T>

      <Pn x={246} y={116} w={222} h={150} t="3 · Date" />
      <rect x={300} y={148} width={44} height={30} rx="2" fill="#f2ede0" stroke={C.struct} />
      <T x={322} y={169} a="middle" s={15} c="#222" w={700}>14</T>
      <Arrow a={[350, 163]} b={[372, 163]} c="brass" w={1.6} />
      <rect x={378} y={148} width={44} height={30} rx="2" fill="#f2ede0" stroke={C.struct} />
      <T x={400} y={169} a="middle" s={15} c="#222" w={700}>15</T>
      <T x={258} y={204} s={10.5} c={C.text}>rapid correction:</T>
      <T x={258} y={218} s={10.5} c={C.text}>snaps over cleanly</T>
      <T x={258} y={242} s={10} c={C.dim}>Sticks or weak? back to the</T>
      <T x={258} y={256} s={10} c={C.dim}>jumper routine</T>
      <rect x={12} y={278} width={456} height={42} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={22} y={304} s={10.5} c={C.text}>Log the results against your baseline from ETA’s sheet step.</T>
    </F>
  )
}

/* ================================================================== */
/* svc-7750 · Valjoux/ETA 7750                                         */
/* ================================================================== */

// Heart cam: radius grows linearly from rmin (ang) to rmax (ang + 180)
function Heart({ cx, cy, r, ang = 0, c = '#c5ced4' }) {
  const pts = []
  for (let t = 0; t < 360; t += 6) {
    const rad = r * 0.35 + r * 0.65 * (Math.min(t, 360 - t) / 180)
    pts.push(pol(cx, cy, rad, t + ang))
  }
  return (
    <g>
      <polygon points={pts.map((p) => p.join(',')).join(' ')} fill="rgba(134,167,189,0.22)" stroke={c} strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r={2.4} fill={M.ruby} />
    </g>
  )
}

function SubDial({ cx, cy, r, label, deg = 0, c = '#3a342c' }) {
  const [x, y] = clk(cx, cy, r * 0.8, deg)
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="rgba(0,0,0,0.08)" stroke={c} />
      {Array.from({ length: 12 }, (_, i) => {
        const [a, b] = clk(cx, cy, r - 1, i * 30)
        const [c2, d2] = clk(cx, cy, r - 4, i * 30)
        return <line key={i} x1={a} y1={b} x2={c2} y2={d2} stroke={c} strokeWidth="0.8" />
      })}
      <line x1={cx} y1={cy} x2={x} y2={y} stroke={C.ruby} strokeWidth="1.4" />
      {label && (
        <T x={cx} y={cy + r + 12} a="middle" s={10} c="#3a342c">
          {label}
        </T>
      )}
    </g>
  )
}

function Sb7750Layout() {
  const cx = 116
  const cy = 166
  const r = 104
  return (
    <F h={330} view="Dial plan · the tri-compax 7750" scale="schematic">
      {[-1, 1].map((d) => {
        const [x, y] = clk(cx, cy, r + 4, 90 + d * 50)
        return <rect key={d} x={x - 4} y={y - 6} width={16} height={12} rx="2" fill="url(#sk-steel)" transform={`rotate(${d * 50} ${x} ${y})`} />
      })}
      <rect x={cx + r} y={cy - 8} width={16} height={16} rx="3" fill="url(#sb-knurl)" />
      <circle cx={cx} cy={cy} r={r} fill={M.dial} stroke={C.struct} strokeWidth="2" />
      <SubDial cx={cx} cy={cy - 50} r={24} deg={60} />
      <SubDial cx={cx} cy={cy + 50} r={24} deg={300} />
      <SubDial cx={cx - 50} cy={cy} r={24} deg={200} />
      <rect x={cx + 46} y={cy - 9} width={46} height={18} fill="#fff" stroke="#3a342c" />
      <text x={cx + 69} y={cy + 4} fontSize="10" fill="#222" fontWeight="700" textAnchor="middle">MON 15</text>
      <Lab p={[cx + 20, cy - 66]} x={250} y={44} text="12: 30-minute counter" a="start" up />
      <Lab p={[cx + 20, cy + 66]} x={250} y={300} text="6: 12-hour counter" a="start" />
      <Lab p={[cx - 72, cy + 14]} x={14} y={300} text="9: running seconds" a="start" />
      <Lab p={[cx + 90, cy - 6]} x={250} y={92} text="3: day and date" a="start" up />
      <T x={196} y={96} s={10} c={C.dim}>pushers</T>

      <Pn x={252} y={112} w={216} h={170} t="Data" />
      {[
        ['size', '30 × 7.9 mm'],
        ['beat', '28,800 A/h (4 Hz)'],
        ['jewels', '25'],
        ['reserve', '48 h min, 54 h typical'],
        ['crown', 'hacking + hand-winding'],
        ['rotor', 'one-way, ball bearing'],
        ['switching', 'cam, not column wheel'],
      ].map(([a, b], i) => (
        <g key={a}>
          <T x={262} y={146 + i * 19} s={10.5} c={C.dim}>{a}</T>
          <T x={330} y={146 + i * 19} s={10.5} c={C.text} w={600}>{b}</T>
        </g>
      ))}
    </F>
  )
}

function Sb7750Baselines() {
  return (
    <F h={330} view="Test · two baselines before the strip" scale="schematic">
      <TG
        x={12}
        y={28}
        w={220}
        title="1 · chronograph stopped"
        rows={[
          ['lift angle', '49°', C.brassHi],
          ['amplitude', '… °'],
          ['rate', '… s/d'],
        ]}
      />
      <TG
        x={248}
        y={28}
        w={220}
        title="2 · chronograph running"
        rows={[
          ['lift angle', '49°', C.brassHi],
          ['amplitude', '… °'],
          ['rate', '… s/d'],
        ]}
      />
      <T x={240} y={146} a="middle" s={10.5} c={C.dim}>both dial up, fully wound</T>
      <Pn x={12} y={160} w={456} h={110} t="Then try the chronograph by hand" />
      {[
        ['each counter', 'returns to zero?'],
        ['start', 'crisp?'],
        ['stop', 'crisp?'],
        ['reset', 'crisp?'],
      ].map(([a, b], i) => (
        <g key={a}>
          <rect x={24 + i * 110} y={186} width={16} height={16} rx="3" fill="none" stroke={C.brass} />
          <T x={46 + i * 110} y={198} s={11} c={C.text} w={600}>{a}</T>
          <T x={46 + i * 110} y={214} s={10} c={C.dim}>{b}</T>
        </g>
      ))}
      <SubDial cx={60} cy={248} r={14} deg={0} c={C.dim} />
      <T x={84} y={252} s={10.5} c={C.dim}>hand back at 12 after reset</T>
      <rect x={12} y={280} width={456} height={40} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={22} y={297} s={10.5} c={C.text}>These figures tell you later whether a problem was</T>
      <T x={22} y={312} s={10.5} c={C.text}>already there or came from your rebuild.</T>
    </F>
  )
}

// Schematic chronograph layer in plan: hammer, cam, levers and springs
function ChronoLayer({ cx, cy, r }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={M.plate} stroke={C.brass} strokeWidth="1.4" />
      <Wheel cx={cx} cy={cy} r={r * 0.22} spokes={0} />
      <Heart cx={cx} cy={cy} r={r * 0.12} ang={30} />
      <path d={`M${cx - r * 0.7} ${cy + r * 0.3} L${cx - r * 0.1} ${cy + r * 0.12} L${cx - r * 0.08} ${cy + r * 0.24} L${cx - r * 0.66} ${cy + r * 0.42} Z`} fill="#94a5ae" stroke={M.steelD} />
      <path d={`M${cx + r * 0.2} ${cy - r * 0.6} L${cx + r * 0.6} ${cy - r * 0.2} L${cx + r * 0.52} ${cy - r * 0.12} L${cx + r * 0.12} ${cy - r * 0.52} Z`} fill="#7e8f99" stroke={M.steelD} />
      <circle cx={cx + r * 0.4} cy={cy + r * 0.4} r={r * 0.16} fill="#b9c6ce" stroke={M.steelD} />
      <path d={`M${cx - r * 0.5} ${cy - r * 0.5} q${r * 0.2} ${-r * 0.2} ${r * 0.4} 0 q${r * 0.2} ${r * 0.2} ${r * 0.3} ${r * 0.1}`} fill="none" stroke={C.brassHi} strokeWidth="1.2" />
      <path d={`M${cx + r * 0.6} ${cy + r * 0.1} q${r * 0.1} ${r * 0.2} 0 ${r * 0.35}`} fill="none" stroke={C.brassHi} strokeWidth="1.2" />
    </g>
  )
}

function Camera({ x, y, ang = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      <rect x={-16} y={-11} width={32} height={22} rx="3" fill="#2d2a27" stroke={C.dim} />
      <circle cx={0} cy={0} r={7} fill="url(#sk-glass)" stroke={C.steel} />
      <rect x={-12} y={-15} width={9} height={4} fill={C.dim} />
    </g>
  )
}

function Sb7750Photo() {
  const cx = 130
  const cy = 180
  return (
    <F h={330} view="Plan · photograph the chrono works first" scale="schematic">
      <ChronoLayer cx={cx} cy={cy} r={86} />
      <Camera x={cx} y={56} />
      <Camera x={34} y={98} ang={-40} />
      <Camera x={232} y={98} ang={40} />
      {[[cx, 70], [46, 110], [218, 110]].map(([x, y], i) => (
        <line key={i} x1={x} y1={y} x2={cx + (x - cx) * 0.3} y2={cy - 40} stroke={C.brass} strokeDasharray="3 3" opacity="0.6" />
      ))}
      <T x={cx} y={36} a="middle" s={10.5} c={C.text}>square, from above</T>
      <T x={14} y={300} s={10.5} c={C.text}>and from several angles</T>

      <Pn x={262} y={28} w={206} h={126} t="Goes back one way only" />
      {['hammer', 'cam', 'levers', 'their springs'].map((t, i) => (
        <g key={t}>
          <Verdict x={280} y={60 + i * 22} ok r={7} />
          <T x={294} y={64 + i * 22} s={11} c={C.text}>{t}</T>
        </g>
      ))}
      <T x={272} y={148} s={10} c={C.faint}>pictures beat memory</T>
      <Band
        x={262}
        y={164}
        w={206}
        h={156}
        head="Tiny, highly sprung"
        lines={['Several chrono springs', 'can fly. Work in a', 'covered tray and keep a', 'finger over each spring', 'as it comes free.']}
      />
    </F>
  )
}

function Sb7750ChronoStrip() {
  const items = [
    ['let down', 'the power'],
    ['rotor +', 'auto works'],
    ['minute', 'counter', '+ jumper'],
    ['hammer', '+ cam'],
    ['oscillating', 'pinion'],
    ['runner +', 'hour', 'counter'],
  ]
  return (
    <F h={330} view="Sequence · strip the chronograph layer" scale="schematic">
      <Tag x={14} y={42}>Lay them out in sequence, left to right</Tag>
      <rect x={12} y={54} width={456} height={190} rx="10" fill="#e4dccb" opacity="0.12" stroke={C.dim} />
      {items.map(([a, b, c3], i) => {
        const x = 20 + i * 75
        return (
          <g key={i}>
            <rect x={x} y={62} width={68} height={174} rx="6" fill="rgba(0,0,0,0.25)" stroke={C.line} />
            <Num x={x + 34} y={80} n={i + 1} r={8} />
            <g transform={`translate(${x + 34} 140)`}>
              {i === 0 && <BarrelPlan cx={0} cy={0} r={22} lid />}
              {i === 1 && <Rotor cx={0} cy={-10} r={26} ang={180} />}
              {i === 2 && (
                <g>
                  <Wheel cx={0} cy={-6} r={16} spokes={0} c="#b9c6ce" />
                  <path d="M-20 18 L14 12 L16 18 L-18 24 Z" fill="#94a5ae" stroke={M.steelD} />
                </g>
              )}
              {i === 3 && (
                <g>
                  <path d="M-24 -18 L18 -4 L14 4 L-26 -10 Z" fill="#94a5ae" stroke={M.steelD} />
                  <path d="M-10 16 a12 12 0 1 1 20 0 l-10 8 Z" fill="#7e8f99" stroke={M.steelD} />
                </g>
              )}
              {i === 4 && (
                <g>
                  <rect x={-3} y={-24} width={6} height={44} fill="#c9d4da" />
                  <rect x={-9} y={-6} width={18} height={10} fill="#9fb0ba" stroke={M.steelD} />
                </g>
              )}
              {i === 5 && (
                <g>
                  <Wheel cx={0} cy={-10} r={18} spokes={0} c={M.brassP} />
                  <Wheel cx={0} cy={22} r={10} spokes={0} c="#b9c6ce" />
                </g>
              )}
            </g>
            <T x={x + 34} y={202} a="middle" s={10} c={C.text}>{a}</T>
            {b && <T x={x + 34} y={217} a="middle" s={10} c={C.dim}>{b}</T>}
            {c3 && <T x={x + 34} y={230} a="middle" s={10} c={C.dim}>{c3}</T>}
          </g>
        )
      })}
      <Band
        x={12}
        y={256}
        w={456}
        h={64}
        c={C.brass}
        f="rgba(208,168,79,0.08)"
        head="Why a tray in order"
        lines={['The chrono goes back to your photos, in reverse: last off is first on.']}
      />
    </F>
  )
}

function Sb7750BaseStrip() {
  const tiers = [
    ['Automatic works', 'off already', true],
    ['Chronograph layer', 'off already', true],
    ['Base movement, train side', 'balance, pallet, barrel, train', false],
    ['Dial side', 'keyless works, day/date calendar', false],
  ]
  return (
    <F h={330} view="Layers · under the chrono, an ordinary train" scale="schematic">
      {tiers.map(([a, b, off], i) => {
        const y = 32 + i * 60
        return (
          <g key={a} opacity={off ? 0.55 : 1}>
            <rect x={60 + i * 6} y={y} width={240 - i * 12} height={40} rx="5" fill={off ? 'none' : i === 2 ? M.plate : 'rgba(200,192,168,0.25)'} stroke={off ? C.dim : C.brass} strokeDasharray={off ? '4 3' : undefined} />
            <T x={180} y={y + 18} a="middle" s={11} c={C.text} w={600}>{a}</T>
            <T x={180} y={y + 32} a="middle" s={10} c={C.dim}>{b}</T>
            {off ? <Verdict x={40} y={y + 20} ok r={8} /> : <Num x={40} y={y + 20} n={i - 1} r={8} />}
          </g>
        )
      })}
      <Arrow d="M310 172 C340 190 340 230 310 250" c="brass" w={1.6} />
      <T x={346} y={214} s={11} c={C.brassHi} w={600}>turn over</T>

      <Pn x={330} y={32} w={138} h={130} t="Train side order" />
      {['balance', 'pallet', 'barrel', 'train'].map((t, i) => (
        <g key={t}>
          <Num x={346} y={64 + i * 24} n={i + 1} r={7} />
          <T x={360} y={68 + i * 24} s={11} c={C.text}>{t}</T>
        </g>
      ))}
      <T x={14} y={290} s={10.5} c={C.dim}>Same as on any automatic, only larger.</T>
      <T x={14} y={306} s={10.5} c={C.dim}>Keep the day/date parts apart from the keyless parts.</T>
    </F>
  )
}

function Sb7750Inspect() {
  const Ins = ({ x, y, t, sub, children }) => (
    <g>
      <Ring x={x} y={y} r={42} />
      {children}
      <T x={x} y={y + 60} a="middle" s={10.5} c={C.text}>{t}</T>
      <T x={x} y={y + 74} a="middle" s={10} c={C.dim}>{sub}</T>
    </g>
  )
  return (
    <F h={330} view="Detail · what to inspect after degreasing" scale="magnified, schematic">
      <Ins x={66} y={90} t="oscillating pinion" sub="teeth: worn or chipped?">
        <rect x={60} y={56} width={12} height={68} fill="#c9d4da" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M72 ${68 + i * 10} l8 3 l-8 3 Z M60 ${68 + i * 10} l-8 3 l8 3 Z`} fill="#c9d4da" stroke={M.steelD} strokeWidth="0.5" />
        ))}
        <path d="M80 99 l-4 2" stroke={C.ruby} strokeWidth="2" />
      </Ins>
      <Ins x={182} y={90} t="cam and lever faces" sub="bruised contact?">
        <path d="M150 104 a32 32 0 0 1 56 -24 l-12 10 a18 18 0 0 0 -30 14 Z" fill="#7e8f99" stroke={M.steelD} />
        <path d="M168 68 L214 102 L208 110 L162 76 Z" fill="#94a5ae" stroke={M.steelD} />
        <circle cx={193} cy={86} r={4} fill="none" stroke={C.ruby} strokeWidth="1.6" />
      </Ins>
      <Ins x={298} y={90} t="reset-hammer hearts" sub="worn or bruised?">
        <Heart cx={298} cy={96} r={22} ang={-90} />
        <path d="M264 62 L332 62 L332 70 L264 70 Z" fill="#94a5ae" stroke={M.steelD} />
        <circle cx={298} cy={72} r={3} fill="none" stroke={C.ruby} strokeWidth="1.4" />
      </Ins>
      <Ins x={414} y={90} t="pivoted levers" sub="clean and free?">
        <path d="M384 100 L440 70 L444 78 L388 108 Z" fill="#94a5ae" stroke={M.steelD} />
        <circle cx={392} cy={102} r={5} fill={M.ruby} />
        <Turn cx={392} cy={102} r={40} from={40} to={70} c="emerald" />
      </Ins>
      <Pn x={12} y={196} w={222} h={124} t="Lever moves freely" ok tc={C.emerald} c={C.emerald} />
      <T x={24} y={238} s={10.5} c={C.text}>snaps back under its spring</T>
      <T x={24} y={254} s={10.5} c={C.text}>at once</T>
      <T x={24} y={282} s={10.5} c={C.emerald}>reset will be crisp</T>
      <Pn x={246} y={196} w={222} h={124} t="Lever drags" ok={false} tc={C.ruby} c={C.ruby} />
      <T x={258} y={238} s={10.5} c={C.text}>slow, sticky, or stops short</T>
      <T x={258} y={282} s={10.5} c={C.ruby}>a chrono that won’t reset</T>
      <T x={258} y={296} s={10.5} c={C.ruby}>crisply</T>
    </F>
  )
}

function Sb7750Oil() {
  return (
    <F h={330} view="Comparison · base first, then the chrono layer" scale="schematic">
      <Flow x={12} y={28} w={456} h={40} nums items={[['Rebuild base'], ['Air-test'], ['Run well'], ['Refit chrono', 'to photos']]} />
      <T x={14} y={88} s={10.5} c={C.ruby}>Never try to time a 7750 through the chrono works.</T>
      <Pn x={12} y={100} w={222} h={118} t="Going train" />
      <OilKey x={24} y={140} items={[[M.o9010, '9010'], [M.hp1300, 'HP-1300'], [M.o9415, '9415']]} gap={20} />
      <T x={120} y={140} s={10.5} c={C.dim}>as normal:</T>
      <T x={120} y={156} s={10.5} c={C.dim}>same map as</T>
      <T x={120} y={172} s={10.5} c={C.dim}>any automatic</T>
      <Pn x={246} y={100} w={222} h={118} t="Chrono contacts, sparingly" />
      <OilKey x={258} y={140} items={[[M.g9501, '9501'], [M.g9504, '9504']]} gap={20} />
      <T x={330} y={140} s={10.5} c={C.dim}>cams, levers,</T>
      <T x={330} y={156} s={10.5} c={C.dim}>sliding faces:</T>
      <T x={330} y={172} s={10.5} c={C.dim}>contact points only</T>
      <path d="M262 200 L330 190 L332 196 L264 206 Z" fill="#94a5ae" stroke={M.steelD} />
      <Dot x={326} y={194} c={M.g9504} r={3} />

      <Band
        x={12}
        y={228}
        w={456}
        h={92}
        head="Grease never goes on"
        lines={['× the oscillating-pinion teeth', '× the runner pivots', 'Misplaced grease is the usual cause of a stuttering or non-resetting chrono.']}
      />
    </F>
  )
}

function Sb7750Hammer() {
  return (
    <F h={330} view="Plan · hammer on the hearts" scale="schematic">
      <Pn x={12} y={28} w={222} h={170} t="Before reset" />
      <Heart cx={70} cy={124} r={30} ang={40} />
      <Heart cx={170} cy={124} r={24} ang={150} />
      <path d="M40 72 L200 72 L200 82 L40 82 Z" fill="#94a5ae" stroke={M.steelD} />
      <Arrow a={[120, 64]} b={[120, 82]} c="brass" w={1.6} />
      <T x={70} y={182} a="middle" s={10.5} c={C.text}>seconds heart</T>
      <T x={170} y={182} a="middle" s={10.5} c={C.text}>minute heart</T>
      <Pn x={246} y={28} w={222} h={170} t="After reset" ok tc={C.emerald} c={C.emerald} />
      <Heart cx={304} cy={124} r={30} ang={-90} />
      <Heart cx={404} cy={124} r={24} ang={-90} />
      <path d="M274 105 L434 105 L434 115 L274 115 Z" fill="#94a5ae" stroke={M.steelD} />
      <T x={356} y={170} a="middle" s={10.5} c={C.text}>both low points on the hammer:</T>
      <T x={356} y={186} a="middle" s={10.5} c={C.emerald}>hands at zero</T>
      <Pn x={12} y={208} w={222} h={112} t="Check" />
      {['hammer resets both counters', 'cleanly to zero', 'start / stop is positive', 'then regulate the base'].map((t, i) => (
        <T key={i} x={24} y={244 + i * 18} s={10.5} c={i === 1 ? C.dim : C.text}>{t}</T>
      ))}
      <Band
        x={246}
        y={208}
        w={222}
        h={112}
        c={C.brass}
        f="rgba(208,168,79,0.08)"
        head="Not quite at zero?"
        lines={['hammer / heart depth, or a', 'bent hand: not regulation.', 'Fix it before the dial', 'goes back on.']}
      />
    </F>
  )
}

function Sb7750Compare() {
  const B = (x, h, c, l, sub) => (
    <g>
      <rect x={x} y={160 - h} width={50} height={h} rx="3" fill={c} opacity="0.75" />
      <T x={x + 25} y={176} a="middle" s={10.5} c={C.text}>{l}</T>
      <T x={x + 25} y={190} a="middle" s={10} c={C.dim}>{sub}</T>
    </g>
  )
  const X = (v) => 262 + (v + 10) * 6.2
  return (
    <F h={330} view="Chart · chrono off against chrono on" scale="schematic bars">
      <Tag x={14} y={42}>Amplitude, finished watch</Tag>
      <line x1={20} y1={160} x2={240} y2={160} stroke={C.struct} />
      {B(28, 100, C.emerald, 'off', 'baseline')}
      {B(96, 86, C.emerald, 'on', 'some loss')}
      {B(164, 40, C.ruby, 'on', 'collapse')}
      <Verdict x={121} y={60} ok r={8} />
      <Verdict x={189} y={106} ok={false} r={8} />
      <T x={14} y={214} s={10.5} c={C.text}>Collapse: chrono works dragging. Find it</T>
      <T x={14} y={228} s={10.5} c={C.text}>before casing: free levers, misplaced grease.</T>

      <Tag x={262} y={42}>Witschi rate, chronograph</Tag>
      <line x1={X(-10)} y1={120} x2={X(20)} y2={120} stroke={C.struct} />
      <rect x={X(-5)} y={84} width={X(15) - X(-5)} height={32} rx="3" fill="rgba(123,165,131,0.3)" stroke={C.emerald} />
      <T x={X(5)} y={104} a="middle" s={11} c={C.text} w={600}>−5 to +15 s/day</T>
      {[-5, 0, 15].map((v) => (
        <g key={v}>
          <line x1={X(v)} y1={116} x2={X(v)} y2={122} stroke={C.faint} />
          <T x={X(v)} y={136} a="middle" s={10} c={C.dim} mono>{v > 0 ? `+${v}` : v}</T>
        </g>
      ))}
      <T x={262} y={160} s={10.5} c={C.dim}>same target as a gent’s watch</T>

      <Pn x={252} y={176} w={216} h={84} t="Reserve" />
      <T x={264} y={214} s={11} c={C.text} w={600}>48 h minimum</T>
      <T x={264} y={232} s={11} c={C.text} w={600}>54 h typical</T>
      <T x={264} y={250} s={10} c={C.dim}>ETA’s figures</T>
      <Band x={12} y={270} w={456} h={50} lines={['Run the reserve test with the chronograph stopped:', 'left running, it drains the reserve faster.']} c={C.brass} f="rgba(208,168,79,0.08)" />
    </F>
  )
}

function Sb7750Reset() {
  return (
    <F h={330} view="Decision · read a bad reset" scale="forum reports: leads, not rules">
      <Bx x={150} y={28} w={180} h={34} l={['After reset, the hand lands…']} c={C.brass} />
      <Arrow d="M200 64 L120 86" c="brass" w={1.4} />
      <Arrow d="M280 64 L360 86" c="brass" w={1.4} />
      <Pn x={12} y={88} w={222} h={124} t="Same wrong place" />
      <SubDial cx={52} cy={150} r={22} deg={20} c={C.dim} />
      <SubDial cx={112} cy={150} r={22} deg={20} c={C.dim} />
      <T x={150} y={146} s={10.5} c={C.text}>every</T>
      <T x={150} y={160} s={10.5} c={C.text}>time</T>
      <T x={24} y={190} s={10.5} c={C.text}>fitted wrongly:</T>
      <T x={24} y={204} s={10.5} c={C.emerald}>refit at true zero</T>
      <Pn x={246} y={88} w={222} h={124} t="Different places" />
      <SubDial cx={286} cy={150} r={22} deg={20} c={C.dim} />
      <SubDial cx={346} cy={150} r={22} deg={330} c={C.dim} />
      <T x={384} y={146} s={10.5} c={C.text}>varies</T>
      <T x={258} y={190} s={10.5} c={C.text}>hammer may be slipping</T>
      <T x={258} y={204} s={10.5} c={C.ruby}>off the heart</T>

      <Pn x={12} y={222} w={300} h={98} t="Hammer seating" />
      <Heart cx={70} cy={273} r={20} ang={-90} />
      <Heart cx={200} cy={276} r={16} ang={-90} />
      <path d="M40 258 L230 258 L230 266 L40 266 Z" fill="#94a5ae" stroke={M.steelD} />
      <T x={70} y={316} a="middle" s={10} c={C.text}>seconds: fully seated</T>
      <T x={244} y={286} s={10} c={C.text}>minute:</T>
      <T x={244} y={300} s={10} c={C.text}>small gap</T>
      <Band x={322} y={222} w={146} h={98} c={C.brass} f="rgba(208,168,79,0.08)" head="One thread adds" lines={['misseated lower', 'bridge: press reset', 'before tightening', 'its screws']} />
    </F>
  )
}

function Sb7750Sw500() {
  return (
    <F h={330} view="Comparison · two SW500 warnings" scale="schematic">
      <T x={14} y={42} s={10.5} c={C.dim}>A 7750 clone: this lesson is your guide. Both warnings reported by Caliber Corner.</T>
      <Pn x={12} y={54} w={222} h={196} t="1 · RDM+ barrel" />
      <BarrelPlan cx={70} cy={130} r={36} lid />
      <T x={70} y={182} a="middle" s={10} c={C.dim}>identify it first</T>
      <rect x={130} y={100} width={84} height={56} rx="8" fill="url(#sb-solv)" stroke={C.steel} />
      <path d="M126 96 L218 160 M218 96 L126 160" stroke={C.ruby} strokeWidth="2" />
      <T x={24} y={210} s={10.5} c={C.text}>Sellita’s oil charts: the RDM+</T>
      <T x={24} y={224} s={10.5} c={C.text}>barrel isn’t cleaned at service.</T>
      <T x={24} y={240} s={10} c={C.ruby}>check before anything is washed</T>

      <Pn x={246} y={54} w={222} h={196} t="2 · Stem release" />
      <CrownPos x={282} y={100} pos={2} hi />
      <T x={276} y={132} s={10.5} c={C.text}>crown two clicks out</T>
      <rect x={270} y={170} width={60} height={14} fill="url(#sb-pcut)" />
      <G x={292} y={170}>
        <path d="M-5 0 L5 0 L5 -26 L-5 -26 Z" fill="url(#sk-steelH)" />
      </G>
      <T x={302} y={162} s={10.5} c={C.dim} mono>1 mm</T>
      <Verdict x={292} y={204} ok r={8} />
      <T x={292} y={226} a="middle" s={10.5} c={C.emerald}>flat tool</T>
      <rect x={360} y={170} width={60} height={14} fill="url(#sb-pcut)" />
      <G x={390} y={172}>
        <path d="M0 0 L5 -12 L5 -28 L-5 -28 L-5 -12 Z" fill="url(#sk-steelH)" />
      </G>
      <Verdict x={390} y={204} ok={false} r={8} />
      <T x={390} y={226} a="middle" s={10.5} c={C.ruby}>pointed tool</T>
      <T x={390} y={240} a="middle" s={10} c={C.dim}>can jam the lever</T>
      <rect x={12} y={262} width={456} height={58} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={22} y={295} s={10.5} c={C.text}>Everything else: follow the 7750 steps in this lesson.</T>
    </F>
  )
}

/* ================================================================== */
/* Shared: oil map on the schematic movement                            */
/* ================================================================== */
function OilMvt({ cx, cy, r, magic }) {
  const P = (k, dx, dy) => mvP(cx, cy, r, k, dx, dy)
  const dots = [
    [P('balance'), M.o9010],
    [P('escape'), M.o9010],
    [P('fourth'), M.o9010],
    [P('third'), M.o9010],
    [P('barrel'), M.hp1300],
    [P('centre'), M.hp1300],
    [P('keyless'), M.hp1300],
    [P('pallet', 0.12, -0.04), M.o9415],
    [P('escape', -0.08, 0.1), M.o9415],
    [P('barrel', -0.38, 0.06), M.brake],
    [P('barrel', 0.2, -0.33), M.brake],
  ]
  return (
    <g>
      <Mvt cx={cx} cy={cy} r={r} />
      {dots.map(([[x, y], c], i) => (
        <Dot key={i} x={x} y={y} c={c} r={4.5} />
      ))}
      {magic && <Dot x={P('centre', 0.12, -0.34)[0]} y={P('centre', 0.12, -0.34)[1]} c={M.hp1300} r={4.5} />}
    </g>
  )
}

/* ================================================================== */
/* svc-miyota · Miyota 8215 / 9015                                     */
/* ================================================================== */

function SbMiyTwo() {
  const k = 5.4 // px per mm
  const rows = [
    ['beat', '21,600 A/h (3 Hz)', '28,800 A/h (4 Hz)'],
    ['jewels', '21', '24'],
    ['reserve', '~42 h', '~42 h'],
    ['hand-winding', 'yes', 'yes'],
    ['hacking', 'NO, by design', 'yes'],
    ['low power', 'seconds stutter: normal', 'much smoother'],
  ]
  return (
    <F h={330} view="Comparison · the two calibres" scale="side profiles true scale ×5.4">
      {[
        ['8215', 5.7, 40],
        ['9015', 3.9, 262],
      ].map(([n, hmm, x]) => (
        <g key={n}>
          <T x={x} y={44} s={13} c={C.brassHi} w={700}>{n}</T>
          <rect x={x} y={90 - hmm * k} width={26 * k} height={hmm * k} rx="2" fill={M.plate} stroke={C.brass} />
          <Dim a={[x, 98]} b={[x + 26 * k, 98]} off={0} text="26 mm" flip />
          <Dim a={[x + 26 * k + 10, 90 - hmm * k]} b={[x + 26 * k + 10, 90]} off={0} />
          <T x={x + 26 * k + 16} y={94 - (hmm * k) / 2} s={10.5} c={C.dim} mono>{hmm} mm</T>
        </g>
      ))}
      {rows.map(([a, b, c], i) => (
        <g key={a}>
          <line x1={12} y1={128 + i * 26} x2={468} y2={128 + i * 26} stroke={C.line} strokeWidth="0.6" />
          <T x={14} y={145 + i * 26} s={10.5} c={C.dim}>{a}</T>
          <T x={110} y={145 + i * 26} s={10.5} c={a === 'hacking' ? C.ruby : C.text} w={600}>{b}</T>
          <T x={300} y={145 + i * 26} s={10.5} c={C.text} w={600}>{c}</T>
        </g>
      ))}
      <T x={14} y={300} s={10.5} c={C.dim}>Both: three hands and date; date at 3, or 4:30 on some variants.</T>
      <T x={14} y={316} s={10.5} c={C.dim}>Both wind one way only, through a pawl (claw) mechanism.</T>
    </F>
  )
}

function SbMiyFeature() {
  return (
    <F h={330} view="Decision · feature, not fault" scale="schematic">
      <Pn x={12} y={28} w={456} h={142} t="Crown pulled, seconds keep running" />
      <circle cx={70} cy={104} r={36} fill={M.dialDark} stroke={C.struct} />
      <line x1={70} y1={104} x2={92} y2={78} stroke={C.ruby} strokeWidth="1.4" />
      <Turn cx={70} cy={104} r={44} from={20} to={80} c="ruby" w={1.4} />
      <rect x={106} y={100} width={18} height={6} fill="url(#sk-steel)" transform="translate(6 0)" />
      <rect x={130} y={94} width={12} height={18} rx="2" fill="url(#sb-knurl)" />
      <Bx x={170} y={56} w={140} h={46} l={['8215', 'non-hacking by design']} c={C.emerald} />
      <Verdict x={322} y={79} ok r={8} />
      <T x={338} y={76} s={10.5} c={C.text}>normal: don’t hunt</T>
      <T x={338} y={90} s={10.5} c={C.text}>in the keyless works</T>
      <Bx x={170} y={112} w={140} h={46} l={['9015', 'should hack']} c={C.brass} />
      <T x={322} y={132} s={10.5} c={C.text}>seconds should stop:</T>
      <T x={322} y={146} s={10.5} c={C.text}>if not, look further</T>

      <Pn x={12} y={180} w={456} h={140} t="Seconds hand stutters (8215)" />
      {(() => {
        const pts = []
        const ys = [0, 0, 1, 0, 2, 0, 0, 1, 3, 0, 1, 0]
        for (let i = 0; i < 12; i++) pts.push(`${30 + i * 16},${250 - ys[i] * 6}`)
        return <polyline points={pts.join(' ')} fill="none" stroke={C.ruby} strokeWidth="1.6" />
      })()}
      <line x1={30} y1={290} x2={206} y2={290} stroke={C.emerald} strokeWidth="1.6" />
      <T x={30} y={274} s={10} c={C.dim}>low power</T>
      <T x={30} y={306} s={10} c={C.dim}>wound</T>
      <Arrow a={[222, 270]} b={[260, 270]} c="brass" w={1.6} />
      <T x={272} y={250} s={11} c={C.text} w={600}>It just means low power.</T>
      <T x={272} y={268} s={10.5} c={C.text}>Wind it and it steadies.</T>
      <T x={272} y={292} s={10.5} c={C.emerald}>No repair needed.</T>
    </F>
  )
}

function SbMiyRotor() {
  return (
    <F h={330} view="Side view and decision · rotor noise" scale="schematic">
      <rect x={30} y={104} width={180} height={30} rx="2" fill={M.plate} stroke={C.brass} />
      <rect x={114} y={84} width={12} height={20} fill="#8d9aa2" />
      <path d="M40 84 L200 84 L200 72 L40 72 Z" fill="url(#sb-rotor)" stroke={C.steel} />
      <Arrow a={[60, 60]} b={[60, 46]} c="brass" w={1.4} both />
      <Arrow a={[188, 46]} b={[188, 60]} c="brass" w={1.4} both />
      <T x={120} y={44} a="middle" s={10.5} c={C.brassHi}>rock the rotor:</T>
      <T x={120} y={58} a="middle" s={10.5} c={C.brassHi}>feel for play</T>
      <T x={120} y={124} a="middle" s={10.5} c={C.text}>movement</T>
      <T x={120} y={156} a="middle" s={10.5} c={C.dim}>before you strip it, and</T>
      <T x={120} y={170} a="middle" s={10.5} c={C.dim}>write down what you find</T>

      <Pn x={244} y={28} w={224} h={70} t="Noise alone" ok tc={C.emerald} c={C.emerald} />
      <T x={256} y={66} s={10.5} c={C.text}>82xx rotors are audible: a</T>
      <T x={256} y={80} s={10.5} c={C.text}>service won’t silence it</T>
      <Pn x={244} y={106} w={224} h={84} t="Noise plus…" ok={false} tc={C.ruby} c={C.ruby} />
      <T x={256} y={144} s={10.5} c={C.text}>grit, poor winding, rotor play:</T>
      <T x={256} y={160} s={10.5} c={C.text}>wear in the automatic parts</T>
      <T x={256} y={176} s={10} c={C.faint}>one forum thread’s report</T>

      <Pn x={12} y={200} w={456} h={120} t="Never oil without cleaning" />
      <circle cx={70} cy={264} r={26} fill="rgba(127,196,232,0.25)" stroke={M.o9010} />
      {[[-10, -6], [6, 4], [-4, 10], [10, -10], [0, 0]].map(([dx, dy], i) => (
        <circle key={i} cx={70 + dx} cy={264 + dy} r={2.2} fill="#5c4a35" />
      ))}
      <T x={110} y={256} s={11} c={C.text} w={600}>oil + old dirt = a gritty paste</T>
      <T x={110} y={274} s={10.5} c={C.dim}>Clean first, then oil. And don’t promise a quiet watch.</T>
      <T x={110} y={302} s={10} c={C.faint}>One brand that fits them calls the noise a characteristic.</T>
    </F>
  )
}

function SbMiyStrip() {
  return (
    <F h={330} view="Sequence · let down and strip" scale="schematic">
      <Tag x={14} y={42}>Train side</Tag>
      <Flow
        x={12}
        y={50}
        w={456}
        h={42}
        s={10}
        items={[['Let down'], ['Rotor'], ['Pawl', 'winding'], ['Balance'], ['Pallet'], ['Barrel', '+ train']]}
        gap={8}
      />
      <Tag x={14} y={118}>Then the dial side</Tag>
      <circle cx={110} cy={226} r={92} fill={M.plate} stroke={C.brass} strokeWidth="1.2" />
      <circle cx={110} cy={226} r={84} fill="none" stroke="#c8c0a8" strokeWidth="7" opacity="0.8" />
      <rect x={196} y={222} width={40} height={7} fill="url(#sk-steel)" />
      <path d="M140 210 L190 220 L188 230 L138 220 Z" fill="#94a5ae" stroke={M.steelD} />
      <circle cx={140} cy={215} r={3.4} fill={M.ruby} />
      <path d="M70 272 L108 292 L104 298 L66 278 Z" fill="#7e8f99" stroke={M.steelD} />
      <circle cx={68} cy={275} r={3.4} fill={M.ruby} />
      <Wheel cx={150} cy={258} r={14} spokes={3} c={M.brassP} />
      <Lab p={[166, 218]} x={260} y={180} text="setting lever" a="start" up />
      <Lab p={[90, 284]} x={260} y={310} text="date jumper" a="start" />
      <Lab p={[150, 258]} x={260} y={258} text="quick-set date works" a="start" />
      <Band
        x={260}
        y={126}
        w={208}
        h={42}
        c={C.brass}
        f="rgba(208,168,79,0.08)"
        lines={['Photograph this layout first:', 'quick-set runs from a crown position']}
      />
      <G x={208} y={152}>
        <rect x={-14} y={-10} width={28} height={20} rx="3" fill="#2d2a27" stroke={C.dim} />
        <circle cx={0} cy={0} r={6} fill="url(#sk-glass)" stroke={C.steel} />
      </G>
    </F>
  )
}

function SbMiyClean() {
  return (
    <F h={330} view="Detail · inspect the pawl winding parts" scale="magnified, schematic">
      <Pn x={12} y={28} w={222} h={180} t="Pawl on its wheel: good" ok tc={C.emerald} c={C.emerald} />
      <Ratchet cx={122} cy={132} r={40} n={20} c={M.brassP} fill="rgba(201,162,76,0.15)" />
      <circle cx={122} cy={132} r={5} fill={M.ruby} />
      <path d="M40 74 L112 102 L108 108 L38 82 Z" fill="#94a5ae" stroke={M.steelD} />
      <path d="M112 102 L120 106 L110 110 Z" fill="#c5ced4" stroke={M.steelD} />
      <T x={30} y={198} s={10.5} c={C.text}>sharp claw, clean teeth</T>
      <Pn x={246} y={28} w={222} h={180} t="Worn or dirty" ok={false} tc={C.ruby} c={C.ruby} />
      <Ratchet cx={356} cy={132} r={40} n={20} c={M.brassP} fill="rgba(201,162,76,0.15)" />
      <circle cx={356} cy={132} r={5} fill={M.ruby} />
      <path d="M274 74 L346 102 L342 108 L272 82 Z" fill="#94a5ae" stroke={M.steelD} />
      <path d="M346 102 Q352 106 344 108 Z" fill="#c5ced4" stroke={M.steelD} />
      {[[334, 112], [372, 104], [384, 134], [346, 164]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.6} fill="#5c4a35" />
      ))}
      <T x={264} y={198} s={10.5} c={C.text}>rounded claw, grit in teeth</T>
      <Flow x={12} y={222} w={456} h={36} items={[['Degrease all'], ['Peg jewels'], ['Blow dry']]} />
      <Tag x={14} y={282}>And as on any automatic</Tag>
      {['pivots', 'jewels', 'pallet stones'].map((t, i) => (
        <g key={t}>
          <Verdict x={30 + i * 130} y={302} ok r={7} />
          <T x={44 + i * 130} y={306} s={11} c={C.text}>{t}</T>
        </g>
      ))}
    </F>
  )
}

function SbMiyRebuild() {
  return (
    <F h={330} view="Sequence · rebuild, air-test, spin the rotor" scale="schematic">
      <Flow x={12} y={28} w={456} h={36} items={[['Mainplate'], ['Keyless'], ['Barrel'], ['Train'], ['Bridge']]} />
      <Flow x={12} y={80} w={456} h={36} items={[['Air-test train'], ['Pallet'], ['Balance'], ['Winding works']]} c={C.emerald} />
      <Pn x={12} y={130} w={456} h={190} t="Last: the rotor spins freely on its bearing" />
      <Rotor cx={130} cy={196} r={64} ang={20} />
      <Turn cx={130} cy={196} r={76} from={100} to={200} c="emerald" />
      <T x={130} y={316} a="middle" s={10} c={C.dim}>flick it gently</T>
      <Verdict x={250} y={182} ok r={8} />
      <T x={266} y={186} s={10.5} c={C.text}>coasts round smoothly, no scrape</T>
      <Verdict x={250} y={222} ok={false} r={8} />
      <T x={266} y={226} s={10.5} c={C.text}>stops short or rubs: check the</T>
      <T x={266} y={240} s={10.5} c={C.text}>bearing and what it touches</T>
      <T x={250} y={280} s={10.5} c={C.dim}>Free train first, winding works last,</T>
      <T x={250} y={294} s={10.5} c={C.dim}>so each layer is proven before the next.</T>
    </F>
  )
}

function SbMiyOneway() {
  return (
    <F h={330} view="Test · one-way winding" scale="schematic">
      <Pn x={12} y={28} w={222} h={168} t="One way: winds" ok tc={C.emerald} c={C.emerald} />
      <Rotor cx={86} cy={120} r={48} ang={0} />
      <Turn cx={86} cy={120} r={58} from={60} to={150} c="brass" />
      <Wheel cx={180} cy={110} r={22} spokes={3} />
      <Turn cx={180} cy={110} r={30} from={-30} to={60} c="emerald" w={1.4} />
      <T x={24} y={186} s={10.5} c={C.text}>winding wheels advance</T>
      <Pn x={246} y={28} w={222} h={168} t="Other way: free" ok tc={C.emerald} c={C.emerald} />
      <Rotor cx={320} cy={120} r={48} ang={0} />
      <Turn cx={320} cy={120} r={58} from={150} to={60} c="steel" />
      <Wheel cx={414} cy={110} r={22} spokes={3} />
      <T x={414} y={150} a="middle" s={10} c={C.dim}>still</T>
      <T x={258} y={186} s={10.5} c={C.text}>runs free, no drag: normal</T>
      <Tag x={14} y={218}>If not</Tag>
      {[
        ['Neither way winds', 'pawl parts dirty or out of place: off, clean, refit'],
        ['Drags both ways', 'check the bearing, and that nothing touches it'],
      ].map(([a, b], i) => (
        <g key={a}>
          <rect x={12} y={228 + i * 46} width={456} height={40} rx="5" fill="rgba(255,255,255,0.025)" stroke={C.line} />
          <Verdict x={28} y={248 + i * 46} ok={false} r={7} />
          <T x={44} y={245 + i * 46} s={11} c={C.text} w={600}>{a}</T>
          <T x={44} y={260 + i * 46} s={10.5} c={C.dim}>{b}</T>
        </g>
      ))}
    </F>
  )
}

function SbMiyOil() {
  return (
    <F h={330} view="Plan · oil map and the lever regulator" scale="schematic">
      <OilMvt cx={112} cy={150} r={94} />
      <OilKey
        x={14}
        y={276}
        items={[
          [M.o9010, '9010: balance, escape, fast pivots'],
          [M.hp1300, 'HP-1300: barrel arbor, keyless, slow wheels'],
          [M.o9415, '9415: pallet stones, escape teeth'],
        ]}
      />
      <OilKey x={262} y={276} items={[[M.brake, 'braking grease: barrel wall']]} />
      <Pn x={232} y={28} w={236} h={180} t="8215 regulator: a simple lever" />
      <Balance cx={300} cy={130} r={42} />
      <path d="M300 130 L408 88 L412 96 L304 136 Z" fill="#94a5ae" stroke={M.steelD} />
      <circle cx={300} cy={130} r={8} fill="#c5ced4" stroke={M.steelD} />
      <Turn cx={300} cy={130} r={120} from={56} to={74} c="brass" />
      <Turn cx={300} cy={130} r={120} from={74} to={56} c="brass" />
      <T x={420} y={74} s={11} c={C.text}>+</T>
      <T x={430} y={120} s={11} c={C.text}>−</T>
      <T x={244} y={196} s={10} c={C.faint}>then run it, case, seal, test</T>
      <Pn x={262} y={218} w={206} h={36} />
      <T x={272} y={240} s={10} c={C.dim}>Worn 8215? Often cheaper to swap.</T>
    </F>
  )
}

function SbMiyTargets() {
  return (
    <F h={330} view="Table · honest targets" scale="listed values, unconfirmed">
      <Tag x={14} y={44}>Lift angle, from one listing</Tag>
      {[
        ['8215', '49°'],
        ['9015', '51°'],
      ].map(([a, b], i) => (
        <g key={a}>
          <rect x={12 + i * 152} y={54} width={140} height={44} rx="6" fill={M.screen} stroke={C.steel} />
          <T x={24 + i * 152} y={81} s={12} c={C.text} w={700}>{a}</T>
          <T x={140 + i * 152} y={82} a="end" s={15} c={M.lcd} w={700} mono>{b}</T>
        </g>
      ))}
      <T x={320} y={70} s={10.5} c={C.ruby}>no maker’s sheet:</T>
      <T x={320} y={86} s={10.5} c={C.text}>amplitude is approximate</T>

      <Tag x={14} y={130}>Rate: Witschi, gent’s watch</Tag>
      {(() => {
        const X = (v) => 60 + (v + 10) * 9
        return (
          <g>
            <line x1={X(-10)} y1={184} x2={X(18)} y2={184} stroke={C.struct} />
            <rect x={X(-5)} y={146} width={X(15) - X(-5)} height={34} rx="3" fill="rgba(123,165,131,0.3)" stroke={C.emerald} />
            <T x={X(5)} y={168} a="middle" s={11} c={C.text} w={600}>−5 to +15 s/day</T>
            {[-5, 0, 15].map((v) => (
              <T key={v} x={X(v)} y={200} a="middle" s={10} c={C.dim} mono>{v > 0 ? `+${v}` : v}</T>
            ))}
            <T x={X(20)} y={160} s={10.5} c={C.dim}>a fair pass;</T>
            <T x={X(20)} y={174} s={10.5} c={C.dim}>no confirmed figure</T>
            <T x={X(20)} y={188} s={10.5} c={C.dim}>for either calibre</T>
          </g>
        )
      })()}
      <Pn x={12} y={214} w={456} h={106} t="Reserve: both listed at about 42 h" />
      <Flow x={24} y={238} w={432} h={34} items={[['Wind fully', 'by crown'], ['Note the time'], ['Run down', 'dial up']]} />
      <T x={24} y={300} s={10.5} c={C.text}>Well short?</T>
      <T x={104} y={300} s={10.5} c={C.dim}>back to the barrel and the winding parts.</T>
    </F>
  )
}

/* ================================================================== */
/* svc-seiko · Seiko 7S / 4R / 6R                                      */
/* ================================================================== */

function SbSkFamily() {
  return (
    <F h={330} view="Timeline · one family, three generations" scale="schematic">
      <line x1={30} y1={110} x2={450} y2={110} stroke={C.struct} strokeWidth="2" />
      {[
        [70, '7S26 / 7S36', '1996–', 'non-hacking, no crown wind'],
        [240, '4R35 / 4R36', '2011–', 'hacking + hand-winding'],
        [400, '6R15 / 6R35', '', 'upgraded, higher grade'],
      ].map(([x, a, b, c]) => (
        <g key={a}>
          <circle cx={x} cy={110} r={8} fill={C.ground} stroke={C.brass} strokeWidth="2" />
          <T x={x} y={60} a="middle" s={13} c={C.brassHi} w={700}>{a}</T>
          <T x={x} y={80} a="middle" s={10.5} c={C.dim} mono>{b}</T>
          <T x={x} y={136} a="middle" s={10.5} c={C.text}>{c}</T>
        </g>
      ))}
      <Arrow a={[86, 110]} b={[224, 110]} c="brass" w={1.6} />
      <Arrow a={[256, 110]} b={[384, 110]} c="brass" w={1.6} />
      <Pn x={150} y={152} w={180} h={60} />
      <T x={240} y={176} a="middle" s={11} c={C.text} w={600}>4R35 = NH35</T>
      <T x={240} y={194} a="middle" s={11} c={C.text} w={600}>4R36 = NH36</T>
      <line x1={240} y1={140} x2={240} y2={152} stroke={C.brass} />
      <T x={340} y={176} s={10.5} c={C.dim}>Seiko vs TMI/export</T>
      <T x={340} y={190} s={10.5} c={C.dim}>branding only</T>
      <Tag x={14} y={240}>Shared by all of them</Tag>
      {['mount', 'train layout', 'Magic Lever winding', 'Diashock'].map((t, i) => (
        <g key={t}>
          <rect x={12 + i * 116} y={250} width={108} height={30} rx="5" fill="rgba(123,165,131,0.12)" stroke={C.emerald} />
          <T x={66 + i * 116} y={269} a="middle" s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
      <T x={14} y={306} s={10.5} c={C.dim}>So parts and skills carry across; this lesson is the differences.</T>
    </F>
  )
}

function SbSk4r() {
  const steps = ['let down', 'lift the Magic Lever automatic works', 'balance and pallet out', 'barrel and train', 'keyless and calendar, dial side', 'clean, rebuild', 'oil to the NH map', 'regulate']
  return (
    <F h={330} view="Equivalence · a 4R is an NH" scale="schematic">
      <Bx x={12} y={30} w={130} h={56} l={['4R35 / 4R36', 'Seiko-branded']} c={C.brass} s={12} />
      <T x={170} y={66} a="middle" s={24} c={C.brassHi} w={700}>=</T>
      <Bx x={198} y={30} w={130} h={56} l={['NH35 / NH36', 'TMI / export']} c={C.brass} s={12} />
      <T x={344} y={54} s={10.5} c={C.text}>the same</T>
      <T x={344} y={68} s={10.5} c={C.text}>movement</T>
      <Pn x={12} y={100} w={456} h={220} t="Follow “Flagship service: the Seiko NH35”, step for step" />
      {steps.map((t, i) => (
        <g key={t}>
          <Num x={34 + (i >= 4 ? 228 : 0)} y={142 + (i % 4) * 40} n={i + 1} r={8} />
          <T x={50 + (i >= 4 ? 228 : 0)} y={146 + (i % 4) * 40} s={10.5} c={C.text}>{t}</T>
        </g>
      ))}
      <T x={24} y={308} s={10.5} c={C.emerald}>Nothing new to learn here.</T>
    </F>
  )
}

function SbSk7s() {
  const Keyless = ({ x, hack }) => (
    <g>
      <path d={`M${x} 236 L${x} 76 L${x + 160} 76 A100 100 0 0 1 ${x + 196} 236 Z`} fill={M.plate} opacity="0.75" stroke={C.brass} />
      <rect x={x + 90} y={140} width={120} height={7} fill="url(#sk-steel)" />
      <rect x={x + 120} y={133} width={18} height={20} rx="2" fill="#9fb0ba" stroke={M.steelD} />
      <path d={`M${x + 40} 108 L${x + 132} 136 L${x + 130} 142 L${x + 38} 114 Z`} fill="#94a5ae" stroke={M.steelD} />
      <Wheel cx={x + 150} cy={180} r={13} spokes={0} c="#b9c6ce" jewel={false} />
      {hack ? (
        <g>
          <rect x={x + 100} y={133} width={14} height={20} rx="2" fill="#b9c6ce" stroke={C.brassHi} strokeWidth="1.4" />
          <path d={`M${x + 30} 200 L${x + 90} 170 L${x + 94} 176 L${x + 34} 206 Z`} fill="#7e8f99" stroke={C.brassHi} strokeWidth="1.4" />
        </g>
      ) : (
        <g>
          <rect x={x + 100} y={133} width={14} height={20} rx="2" fill="none" stroke={C.ruby} strokeDasharray="3 2" />
          <path d={`M${x + 30} 200 L${x + 90} 170 L${x + 94} 176 L${x + 34} 206 Z`} fill="none" stroke={C.ruby} strokeDasharray="3 2" />
        </g>
      )}
    </g>
  )
  return (
    <F h={330} view="Comparison · keyless works, dial side" scale="schematic">
      <Tag x={14} y={44}>4R / NH: hacks, hand-winds</Tag>
      <Keyless x={12} hack />
      <Lab p={[118, 136]} x={60} y={60} text="winding path" up />
      <Lab p={[60, 190]} x={30} y={260} text="stop-seconds lever" a="start" />
      <Tag x={250} y={44}>7S26 / 7S36: neither</Tag>
      <Keyless x={250} />
      <T x={356} y={66} a="middle" s={10.5} c={C.ruby}>no winding path</T>
      <T x={260} y={260} s={10.5} c={C.ruby}>no stop-seconds lever</T>
      <rect x={12} y={276} width={456} height={44} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      <T x={22} y={294} s={10.5} c={C.text}>Simpler dial side: don’t hunt for a hacking lever that was never there.</T>
      <T x={22} y={310} s={10.5} c={C.dim}>Going train and auto works service identically.</T>
    </F>
  )
}

function SbSkNoCrown() {
  return (
    <F h={330} view="Routines · a movement the crown can’t wind" scale="schematic">
      <Pn x={12} y={28} w={222} h={150} t="1 · Letting down" />
      <rect x={30} y={60} width={52} height={20} rx="3" fill="none" stroke={C.ruby} />
      <T x={56} y={74} a="middle" s={10.5} c={C.ruby}>crown</T>
      <path d="M30 60 L82 80" stroke={C.ruby} strokeWidth="1.6" />
      <T x={92} y={74} s={10.5} c={C.text}>can’t let it down</T>
      <T x={24} y={106} s={11} c={C.emerald} w={600}>either: let it run until it stops</T>
      <T x={24} y={130} s={11} c={C.emerald} w={600}>or: the ratchet-wheel method</T>
      <T x={24} y={146} s={10.5} c={C.dim}>if you can reach the click</T>

      <Pn x={246} y={28} w={222} h={150} t="2 · Winding for readings" />
      <Rotor cx={300} cy={106} r={34} ang={10} />
      <Turn cx={300} cy={106} r={42} from={60} to={160} c="brass" />
      <T x={350} y={88} s={10.5} c={C.text}>rotor, winder</T>
      <T x={350} y={102} s={10.5} c={C.text}>or wrist</T>
      <T x={258} y={166} s={10.5} c={C.ruby}>not 10 to 15 crown turns</T>

      <Pn x={12} y={188} w={456} h={132} t="A barely wound 7S26 reads low" />
      {(() => {
        const X = (v) => 60 + v * 3.4
        return (
          <g>
            <line x1={X(0)} y1={290} x2={X(100)} y2={290} stroke={C.struct} />
            <line x1={X(0)} y1={290} x2={X(0)} y2={214} stroke={C.struct} />
            <path d={`M${X(4)} 280 C${X(30)} 250 ${X(60)} 232 ${X(100)} 226`} fill="none" stroke={C.brassHi} strokeWidth="2" />
            <T x={X(0) - 6} y={222} a="end" s={10} c={C.dim}>amp</T>
            <T x={X(100)} y={306} a="end" s={10} c={C.dim}>state of wind →</T>
            <T x={X(6)} y={306} s={10} c={C.ruby}>barely wound: low, not a fault</T>
            <circle cx={X(100)} cy={226} r={4} fill={C.emerald} />
          </g>
        )
      })()}
      <T x={420} y={260} a="end" s={10.5} c={C.emerald}>build power first,</T>
      <T x={420} y={274} a="end" s={10.5} c={C.emerald}>then read</T>
    </F>
  )
}

function SbSk6r() {
  return (
    <F h={330} view="Comparison · what the 6R adds" scale="schematic, not to scale">
      <Pn x={12} y={28} w={150} h={170} t="4R barrel" />
      <BarrelPlan cx={87} cy={120} r={44} coils={4} />
      <Pn x={174} y={28} w={186} h={170} t="6R: larger barrel" tc={C.brassHi} c={C.brass} />
      <BarrelPlan cx={267} cy={120} r={58} coils={7} />
      <T x={267} y={192} a="middle" s={10.5} c={C.text}>longer mainspring</T>
      <Pn x={372} y={28} w={96} h={170} t="Reserve" />
      <T x={384} y={78} s={11} c={C.text} w={600}>6R15</T>
      <T x={384} y={96} s={13} c={C.brassHi} w={700} mono>~50 h</T>
      <T x={384} y={136} s={11} c={C.text} w={600}>6R35</T>
      <T x={384} y={154} s={13} c={C.brassHi} w={700} mono>~70 h</T>

      <Pn x={12} y={208} w={222} h={112} t="MEMS-made escapement" />
      <EscW cx={60} cy={268} r={26} />
      <path d="M84 260 L100 270 M84 286 L100 276 M100 273 L132 296" stroke={C.emerald} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <circle cx={112} cy={281} r={2.4} fill={M.ruby} />
      <T x={140} y={256} s={10.5} c={C.text}>escape wheel and</T>
      <T x={140} y={270} s={10.5} c={C.text}>pallet fork, tighter</T>
      <T x={140} y={284} s={10.5} c={C.text}>tolerances</T>
      <T x={24} y={312} s={10} c={C.dim}>clean oiling, careful regulation</T>
      <Band x={246} y={208} w={222} h={112} head="Fuller barrel" lines={['Stores noticeably more power.', 'Control the let-down', 'accordingly. Handle and', 'oil as any other.']} />
    </F>
  )
}

function SbSkInterchange() {
  const cols = ['7S', '4R / NH', '6R']
  const rows = [
    ['going-train parts', ['many', 'many', '?']],
    ['escapement', ['many', 'many', 'own (MEMS)']],
    ['mainspring', ['', '4R only', 'own']],
    ['barrel', ['', '', 'own']],
    ['balance', ['7S', '', 'not a 7S one']],
  ]
  return (
    <F h={330} view="Matrix · where interchange stops" scale="schematic">
      {cols.map((c, j) => (
        <T key={c} x={210 + j * 92} y={44} a="middle" s={11.5} c={C.brassHi} w={700}>{c}</T>
      ))}
      <rect x={164} y={54} width={184} height={176} rx="6" fill="rgba(123,165,131,0.10)" stroke={C.emerald} strokeDasharray="4 3" />
      <T x={256} y={248} a="middle" s={10.5} c={C.emerald}>many parts cross 4R/NH and even 7S</T>
      <rect x={350} y={54} width={86} height={176} rx="6" fill="rgba(194,88,99,0.10)" stroke={C.ruby} strokeDasharray="4 3" />
      <T x={393} y={248} a="middle" s={10.5} c={C.ruby}>its own</T>
      {rows.map(([r], i) => (
        <g key={r}>
          <T x={14} y={84 + i * 34} s={10.5} c={C.text}>{r}</T>
          <line x1={12} y1={94 + i * 34} x2={468} y2={94 + i * 34} stroke={C.line} strokeWidth="0.5" />
        </g>
      ))}
      <Verdict x={210} y={80} ok r={7} />
      <Verdict x={302} y={80} ok r={7} />
      <Verdict x={210} y={114} ok r={7} />
      <Verdict x={302} y={114} ok r={7} />
      <Verdict x={393} y={114} ok={false} r={7} />
      <Verdict x={393} y={148} ok={false} r={7} />
      <Verdict x={393} y={182} ok={false} r={7} />
      <Verdict x={393} y={216} ok={false} r={7} />
      <Arrow a={[352, 148]} b={[316, 148]} c="ruby" w={1.2} />
      <T x={302} y={152} a="end" s={10} c={C.ruby}>6R spring ✗ 4R barrel</T>
      <Arrow a={[230, 216]} b={[372, 216]} c="ruby" w={1.2} />
      <T x={210} y={220} a="middle" s={10} c={C.ruby}>7S</T>
      <Pn x={12} y={264} w={456} h={56} />
      <T x={24} y={286} s={11} c={C.text} w={600}>When in doubt, match the exact calibre.</T>
      <T x={24} y={304} s={10.5} c={C.dim}>Cheap donor movements make the crossing parts easy to find.</T>
    </F>
  )
}

function SbSkVariant() {
  return (
    <F h={330} view="Identify · read the full calibre code" scale="schematic">
      <circle cx={100} cy={150} r={88} fill={M.plate} stroke={C.brass} strokeWidth="1.4" />
      <Rotor cx={100} cy={150} r={80} ang={200} />
      <rect x={52} y={176} width={96} height={20} rx="3" fill="rgba(0,0,0,0.45)" />
      <T x={100} y={190} a="middle" s={11} c={C.text} mono>6R15 ?</T>
      <circle cx={100} cy={186} r={30} fill="none" stroke={C.brass} strokeWidth="1.4" />
      <line x1={128} y1={176} x2={214} y2={96} stroke={C.brass} strokeWidth="0.8" opacity="0.7" />
      <rect x={214} y={60} width={254} height={70} rx="8" fill="rgba(0,0,0,0.3)" stroke={C.brass} strokeWidth="1.4" />
      <T x={300} y={104} a="middle" s={20} c={C.text} mono w={700}>6R15</T>
      <T x={364} y={104} s={20} c={C.brassHi} mono w={700}>A–D</T>
      <T x={341} y={146} a="middle" s={10.5} c={C.dim}>the variant letter matters</T>
      <T x={14} y={262} s={10} c={C.faint}>read the code off the movement itself</T>
      <Flow x={214} y={164} w={254} h={42} items={[['Full code'], ['Parts list', 'for that variant']]} />
      <Band
        x={12}
        y={272}
        w={456}
        h={50}
        lines={['Part nearly fits? Don’t force it: stop and check the code. You probably have', 'the wrong version. 6R15 parts aren’t fully interchangeable across A to D.']}
      />
      <T x={466} y={232} a="end" s={10} c={C.faint}>as reported by Caliber Corner</T>
    </F>
  )
}

function SbSkOil() {
  const X = (h) => 262 + h * 2.7
  return (
    <F h={330} view="Plan and chart · oil, regulate, prove" scale="schematic">
      <OilMvt cx={112} cy={130} r={90} magic />
      <OilKey
        x={14}
        y={246}
        items={[
          [M.o9010, '9010: balance, escape, fast pivots'],
          [M.hp1300, 'HP-1300: arbor, Magic Lever, keyless'],
          [M.o9415, '9415: pallet stones, escape teeth'],
          [M.brake, 'braking grease: barrel wall'],
        ]}
      />
      <TG
        x={262}
        y={28}
        w={206}
        title="targets · 3 Hz"
        rows={[
          ['rate', 'small gain'],
          ['amplitude', '~250–300°'],
          ['beat error', '< ~0.5 ms'],
        ]}
      />
      <T x={262} y={146} s={10} c={C.faint}>dial up, fully wound</T>
      <Tag x={262} y={172}>6R: check near the end too</Tag>
      <line x1={X(0)} y1={240} x2={X(70)} y2={240} stroke={C.struct} />
      <line x1={X(0)} y1={210} x2={X(70)} y2={210} stroke={C.line} strokeDasharray="3 3" />
      <path d={`M${X(0)} 206 L${X(40)} 208 L${X(60)} 212 L${X(70)} 216`} fill="none" stroke={C.emerald} strokeWidth="2" />
      <circle cx={X(4)} cy={206} r={4} fill={C.brassHi} />
      <circle cx={X(62)} cy={212} r={4} fill={C.brassHi} />
      <T x={X(4)} y={196} s={10} c={C.dim}>full</T>
      <T x={X(62)} y={232} a="middle" s={10} c={C.dim}>near the end</T>
      <T x={X(0)} y={256} s={10} c={C.dim}>rate held across a long reserve →</T>
      <Pn x={262} y={278} w={206} h={44} />
      <T x={272} y={296} s={10} c={C.text}>Keep a cheap runner as a donor:</T>
      <T x={272} y={310} s={10} c={C.dim}>many “needs a part” jobs, a swap</T>
    </F>
  )
}

function SbSkFigures() {
  const X = (v) => 110 + (v + 25) * 3.4
  const cx = 384
  const cy = 236
  const r = 62
  const arc = (a1, a2) => {
    const [x1, y1] = clk(cx, cy, r, a1)
    const [x2, y2] = clk(cx, cy, r, a2)
    return `M${cx} ${cy} L${x1} ${y1} A${r} ${r} 0 0 1 ${x2} ${y2} Z`
  }
  return (
    <F h={330} view="Chart · Seiko’s figures, not chronometer habit" scale="schematic">
      <Tag x={14} y={42}>Rate tolerance, s/day</Tag>
      <line x1={X(-25)} y1={110} x2={X(45)} y2={110} stroke={C.struct} />
      {[
        ['7S26', -20, 40, 62],
        ['6R15, 6R35', -15, 25, 90],
      ].map(([n, a, b, y]) => (
        <g key={n}>
          <rect x={X(a)} y={y - 12} width={X(b) - X(a)} height={16} rx="3" fill="rgba(123,165,131,0.35)" stroke={C.emerald} />
          <T x={X(a) - 6} y={y + 1} a="end" s={10.5} c={C.text}>{n}</T>
          <T x={X(b) + 6} y={y + 1} s={10} c={C.dim} mono>{a} to +{b}</T>
        </g>
      ))}
      {[-20, 0, 25, 40].map((v) => (
        <g key={v}>
          <line x1={X(v)} y1={106} x2={X(v)} y2={114} stroke={C.faint} />
          <T x={X(v)} y={128} a="middle" s={10} c={C.dim} mono>{v > 0 ? `+${v}` : v}</T>
        </g>
      ))}
      <T x={14} y={150} s={10.5} c={C.emerald}>A small gain is plenty.</T>
      <T x={14} y={166} s={10} c={C.faint}>6R figures from one source.</T>

      <Pn x={12} y={184} w={268} h={136} t="Lift angle, typical" />
      {['7S26', '4R36', '6R15', '6R35'].map((n, i) => (
        <g key={n}>
          <rect x={24 + (i % 2) * 124} y={206 + Math.floor(i / 2) * 40} width={116} height={32} rx="4" fill={M.screen} stroke={C.steel} />
          <T x={34 + (i % 2) * 124} y={227 + Math.floor(i / 2) * 40} s={11} c={C.text}>{n}</T>
          <T x={130 + (i % 2) * 124} y={228 + Math.floor(i / 2) * 40} a="end" s={13} c={M.lcd} mono w={700}>53°</T>
        </g>
      ))}
      <T x={24} y={308} s={10} c={C.faint}>from listings</T>

      <Tag x={300} y={160}>6R35: don’t quick-set</Tag>
      <circle cx={cx} cy={cy} r={r} fill={M.dialDark} stroke={C.struct} />
      <path d={arc(270, 360)} fill="rgba(194,88,99,0.45)" />
      <path d={arc(0, 30)} fill="rgba(194,88,99,0.45)" />
      {Array.from({ length: 12 }, (_, i) => {
        const [a, b] = clk(cx, cy, r - 2, i * 30)
        const [c2, d2] = clk(cx, cy, r - 8, i * 30)
        return <line key={i} x1={a} y1={b} x2={c2} y2={d2} stroke={C.dim} strokeWidth="1.2" />
      })}
      <T x={cx} y={cy - r + 20} a="middle" s={10} c={C.text}>12</T>
      <T x={cx - r + 16} y={cy + 4} a="middle" s={10} c={C.text}>9</T>
      <T x={cx} y={cy + 20} a="middle" s={10.5} c={C.ruby} w={600}>9 pm–1 am</T>
      <T x={cx} y={cy + 34} a="middle" s={10} c={C.dim}>move hands clear</T>
    </F>
  )
}

export const FIGS = {
  'sb-6497-reading': Sb6497Reading,
  'sb-6497-ratchet': Sb6497Ratchet,
  'sb-6497-train': Sb6497Train,
  'sb-6497-barrel': Sb6497Barrel,
  'sb-6497-clean': Sb6497Clean,
  'sb-6497-rebuild': Sb6497Rebuild,
  'sb-6497-endshake': Sb6497Endshake,
  'sb-6497-regulate': Sb6497Regulate,
  'sb-6497-reserve': Sb6497Reserve,
  'sb-nh35-stem': SbNhStem,
  'sb-nh35-strip': SbNhStrip,
  'sb-nh35-clean': SbNhClean,
  'sb-nh35-rebuild': SbNhRebuild,
  'sb-nh35-magic': SbNhMagic,
  'sb-nh35-dial': SbNhDial,
  'sb-nh35-regulate': SbNhRegulate,
  'sb-nh35-hack': SbNhHack,
  'sb-2824-calibre': Sb2824Calibre,
  'sb-2824-sheet': Sb2824Sheet,
  'sb-2824-strip': Sb2824Strip,
  'sb-2824-reverser-clean': Sb2824ReverserClean,
  'sb-2824-reverser-rule': Sb2824ReverserRule,
  'sb-2824-epilame': Sb2824Epilame,
  'sb-2824-rebuild': Sb2824Rebuild,
  'sb-2824-stages': Sb2824Stages,
  'sb-2824-etachron': Sb2824Etachron,
  'sb-2824-prove': Sb2824Prove,
  'sb-7750-layout': Sb7750Layout,
  'sb-7750-baselines': Sb7750Baselines,
  'sb-7750-photo': Sb7750Photo,
  'sb-7750-chrono-strip': Sb7750ChronoStrip,
  'sb-7750-base-strip': Sb7750BaseStrip,
  'sb-7750-inspect': Sb7750Inspect,
  'sb-7750-oil': Sb7750Oil,
  'sb-7750-hammer': Sb7750Hammer,
  'sb-7750-compare': Sb7750Compare,
  'sb-7750-reset': Sb7750Reset,
  'sb-7750-sw500': Sb7750Sw500,
  'sb-miy-two': SbMiyTwo,
  'sb-miy-feature': SbMiyFeature,
  'sb-miy-rotor': SbMiyRotor,
  'sb-miy-strip': SbMiyStrip,
  'sb-miy-clean': SbMiyClean,
  'sb-miy-rebuild': SbMiyRebuild,
  'sb-miy-oneway': SbMiyOneway,
  'sb-miy-oil': SbMiyOil,
  'sb-miy-targets': SbMiyTargets,
  'sb-sk-family': SbSkFamily,
  'sb-sk-4r': SbSk4r,
  'sb-sk-7s': SbSk7s,
  'sb-sk-no-crown': SbSkNoCrown,
  'sb-sk-6r': SbSk6r,
  'sb-sk-interchange': SbSkInterchange,
  'sb-sk-variant': SbSkVariant,
  'sb-sk-oil': SbSkOil,
  'sb-sk-figures': SbSkFigures,
}
