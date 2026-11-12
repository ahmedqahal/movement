// Diagrams for the quartz service lessons and the Casework & Water Resistance
// track. All drawings are original schematics built on the strap kit. Helpers
// sit at the top so the figures below stay short.
import { C, Fig, T, Note, Lead, Dim, Arrow, Num, Verdict, Tag, Sep } from '../strap/kit.jsx'

// materials not in the strap palette
const M = {
  gasket: '#e08a55', // elastic seal
  gasketEdge: '#f2b68f',
  rigid: '#e8dfbd', // hard nylon gasket
  plate: '#5b5339',
  board: '#2f4a5a',
  copper: '#c07f45',
  move: '#4b4438',
  dial: '#cfc6b2',
  glass: '#a9d0de',
  magnet: '#b5545f',
  grease: '#8fd0c9',
  oil: '#e8c25a',
  ink: '#120f0d',
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
      {hatch('qk-cut', '#6f808b', '#a3b3bd')}
      {hatch('qk-bcut', '#7f6a33', '#c6a65c')}
      {hatch('qk-mov', '#433c31', '#5e5546')}
      <pattern id="qk-thread" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#8fa0ab" />
        <line x1="0" y1="0" x2="4" y2="4" stroke="#3f4d56" strokeWidth="1" />
      </pattern>
      <pattern id="qk-knurl" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#a7b6bf" />
        <line x1="2" y1="0" x2="2" y2="4" stroke="#55646e" strokeWidth="1" />
      </pattern>
      <linearGradient id="qk-acr" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(190,225,235,0.55)" />
        <stop offset="1" stopColor="rgba(120,170,190,0.28)" />
      </linearGradient>
      <radialGradient id="qk-cell" cx="0.4" cy="0.35" r="0.8">
        <stop offset="0" stopColor="#eef3f6" />
        <stop offset="0.6" stopColor="#aebcc5" />
        <stop offset="1" stopColor="#66767f" />
      </radialGradient>
    </defs>
  )
}

// Fig with this file's extra defs
const F = ({ children, ...p }) => (
  <Fig {...p}>
    <QDefs />
    {children}
  </Fig>
)

// Group placed at the working point: tools extend up (−y) from (0,0)
const G = ({ x = 0, y = 0, ang = 0, k = 1, children, o }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${k})`} opacity={o}>
    {children}
  </g>
)

// Panel with an optional mono heading
function Pn({ x, y, w, h, t, c = C.line, tc }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill="rgba(255,255,255,0.025)" stroke={c} />
      {t && (
        <Tag x={x + 8} y={y + 15} c={tc}>
          {t}
        </Tag>
      )}
    </g>
  )
}

// Rounded box with centred lines of text
function Bx({ x, y, w, h, l, c = C.struct, f = 'rgba(255,255,255,0.03)', tc = C.text, s = 11, lh, b }) {
  const gap = lh || s + 3
  const y0 = y + h / 2 - ((l.length - 1) * gap) / 2 + s * 0.36
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill={f} stroke={c} />
      {l.map((t, i) => (
        <T key={i} x={x + w / 2} y={y0 + i * gap} a="middle" s={s} c={i === 0 ? tc : b || tc} w={i === 0 && l.length > 1 ? 600 : undefined}>
          {t}
        </T>
      ))}
    </g>
  )
}

// Simple table. cols: [{w, a}], rows: arrays of strings or {t, c, w}
function Tb({ x, y, cols, rows, rh = 18, s = 10.5, head = true }) {
  const W = cols.reduce((a, c) => a + c.w, 0)
  return (
    <g>
      {rows.map((r, i) => {
        let cx = x
        return (
          <g key={i}>
            {i > 0 && <line x1={x} y1={y + i * rh - rh + 5} x2={x + W} y2={y + i * rh - rh + 5} stroke={C.line} strokeWidth={head && i === 1 ? 1 : 0.6} />}
            {r.map((cell, j) => {
              const col = cols[j]
              const o = typeof cell === 'string' ? { t: cell } : cell
              const tx = col.a === 'middle' ? cx + col.w / 2 : cx + 2
              cx += col.w
              return (
                <T key={j} x={tx} y={y + i * rh} a={col.a || 'start'} s={s} c={o.c || (head && i === 0 ? C.faint : j === 0 ? C.text : C.dim)} w={o.w} mono={o.mono}>
                  {o.t}
                </T>
              )
            })}
          </g>
        )
      })}
    </g>
  )
}

// Horizontal range chart: rows [{n, a, b, t, c}]
function Ranges({ x, y, w, min, max, rows, rh = 21, ticks = [], lab = 96, unit, band, vx }) {
  const X = (v) => x + lab + ((v - min) / (max - min)) * (w - lab)
  const H = rows.length * rh
  return (
    <g>
      {band && <rect x={X(band[0])} y={y - 4} width={X(band[1]) - X(band[0])} height={H + 6} fill="rgba(208,168,79,0.09)" />}
      {ticks.map((t) => (
        <g key={t}>
          <line x1={X(t)} y1={y - 4} x2={X(t)} y2={y + H + 2} stroke={C.line} strokeWidth="0.8" />
          <T x={X(t)} y={y + H + 15} a="middle" s={10} mono>
            {t}
          </T>
        </g>
      ))}
      {unit && (
        <T x={x + w} y={y + H + 28} a="end" s={10} c={C.faint}>
          {unit}
        </T>
      )}
      {rows.map((r, i) => (
        <g key={r.n}>
          <T x={x} y={y + i * rh + 12} s={11} c={C.text}>
            {r.n}
          </T>
          <rect x={X(r.a)} y={y + i * rh + 3} width={Math.max(3, X(r.b) - X(r.a))} height={11} rx="2" fill={r.c || C.steel} />
          <T x={vx || X(r.b) + 5} y={y + i * rh + 12} s={10} mono c={C.dim} a={vx ? 'end' : 'start'}>
            {r.t}
          </T>
        </g>
      ))}
    </g>
  )
}

// A short horizontal or vertical part in an exploded stack with its removal number
function Stack({ x, y, gap = 22, items, lx = 250 }) {
  return (
    <g>
      <line x1={x} y1={y - 8} x2={x} y2={y + gap * items.length} stroke={C.faint} strokeWidth="0.8" strokeDasharray="4 3" />
      {items.map((p, i) => {
        const cy = y + i * gap
        const w = p.w
        const ox = p.ox || 0
        return (
          <g key={i}>
            {p.ring ? (
              <g>
                <rect x={x + ox - w / 2} y={cy - 3} width={w * 0.3} height={6} rx="1" fill={p.c || C.struct} />
                <rect x={x + ox + w / 2 - w * 0.3} y={cy - 3} width={w * 0.3} height={6} rx="1" fill={p.c || C.struct} />
              </g>
            ) : (
              <rect x={x + ox - w / 2} y={cy - 3.5} width={w} height={7} rx="1.5" fill={p.c || C.struct} stroke={p.e || 'none'} />
            )}
            {p.teeth && <rect x={x + ox - w / 2 - 1.5} y={cy - 2} width={w + 3} height={4} fill="url(#qk-knurl)" />}
            {p.arbor && <rect x={x + ox - 2} y={cy - 9} width={4} height={18} rx="1" fill={C.dim} />}
            <line x1={x + ox + w / 2 + 3} y1={cy} x2={lx - 13} y2={cy} stroke={C.line} strokeWidth="0.7" />
            {p.n != null && <Num x={lx} y={cy} n={p.n} r={8} c={p.nc || C.brass} />}
            <T x={lx + 13} y={cy + 4} s={11} c={C.text}>
              {p.t}
            </T>
            {p.sub && (
              <T x={lx + 13 + p.t.length * 5.7 + 6} y={cy + 4} s={10} c={C.faint}>
                {p.sub}
              </T>
            )}
          </g>
        )
      })}
    </g>
  )
}

/* tools: (0,0) is the working point, the tool runs up */
function Tweezers({ c = C.steel, gap = 5, len = 96, tip = 1 }) {
  return (
    <g fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
      <rect x="-6" y={-len} width="12" height={Math.max(0, len - 30)} rx="2" fill="url(#qk-knurl)" stroke="#55646e" strokeWidth="0.6" />
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
function CaseKnife({ len = 92 }) {
  return (
    <g>
      <path d="M-5 0 L5 0 L6 -40 L-6 -40 Z" fill="url(#sk-steelH)" stroke="#4e5f6a" strokeWidth="0.6" />
      <rect x="-8" y={-len} width="16" height={Math.max(0, len - 40)} rx="3" fill="url(#sk-wood)" />
    </g>
  )
}
function Pusher({ d = 3, len = 70, k = 'steel' }) {
  return (
    <g>
      <rect x={-d / 2} y="-28" width={d} height="28" fill={k === 'steel' ? 'url(#sk-steelH)' : C.brass} />
      <rect x="-5" y={-len} width="10" height={Math.max(0, len - 28)} rx="2" fill="url(#qk-knurl)" stroke="#55646e" strokeWidth="0.6" />
    </g>
  )
}
function Ram({ w = 60, h = 30, stem = 26, chamfer = 0, c = '#9db0bb' }) {
  const hw = w / 2
  return (
    <g>
      <rect x="-9" y={-h - stem} width="18" height={stem} fill="url(#sk-steelH)" />
      <path d={`M${-hw} 0 L${-hw} ${-h} L${hw} ${-h} L${hw} 0 L${hw - 6} 0 L${hw - 6 - chamfer} ${-chamfer} L${-hw + 6 + chamfer} ${-chamfer} L${-hw + 6} 0 Z`} fill={c} stroke="#4e5f6a" strokeWidth="0.8" />
    </g>
  )
}
// Head's long axis runs along y, so the striking faces point up and down
const Hammer = ({ k = 1, face = '#c9b58a' }) => (
  <g transform={`scale(${k})`}>
    <rect x="6" y="-3" width="50" height="6" rx="2" fill="url(#sk-wood)" />
    <rect x="-7" y="-13" width="14" height="26" rx="2" fill="url(#sk-steel)" stroke="#4e5f6a" strokeWidth="0.6" />
    <rect x="-7" y="-17" width="14" height="5" rx="1.5" fill={face} />
    <rect x="-7" y="12" width="14" height="5" rx="1.5" fill={face} />
  </g>
)

// Centred label whose leader stops clear of the text. up = text sits above the feature.
const Lab = ({ p, x, y, text, c = C.text, s = 10.5, up }) => (
  <g>
    <line x1={p[0]} y1={p[1]} x2={x} y2={up ? y + 4 : y - s} stroke={C.struct} strokeWidth="0.8" opacity="0.8" />
    <circle cx={p[0]} cy={p[1]} r="2.2" fill={c} />
    <T x={x} y={y} a="middle" s={s} c={c}>
      {text}
    </T>
  </g>
)
const Screw = ({ x, y, r = 5, ang = 30, c = '#c5ced4' }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={c} stroke="#3e4a52" strokeWidth="0.8" />
    <line x1={x - r * 0.75 * Math.cos((ang * Math.PI) / 180)} y1={y - r * 0.75 * Math.sin((ang * Math.PI) / 180)} x2={x + r * 0.75 * Math.cos((ang * Math.PI) / 180)} y2={y + r * 0.75 * Math.sin((ang * Math.PI) / 180)} stroke="#2c353b" strokeWidth={r > 4 ? 1.6 : 1.2} />
  </g>
)

// Loupe ring for a magnified inset
const Ring = ({ x, y, r, c = C.brass }) => <circle cx={x} cy={y} r={r} fill="rgba(0,0,0,0.18)" stroke={c} strokeWidth="1.6" />

// polar helper, 0° at 3 o'clock, clockwise on screen
const pol = (cx, cy, r, deg) => [cx + r * Math.cos((deg * Math.PI) / 180), cy + r * Math.sin((deg * Math.PI) / 180)]

// Generic quartz movement in plan, not any one calibre. Stem at 3 o'clock.
function QMove({ cx, cy, r, cell = true, screws = true, clamp = true, stem = true }) {
  const u = r / 70
  const c = (dx, dy) => [cx + dx * u, cy + dy * u]
  const [bx, by] = c(-58, -6)
  return (
    <g>
      {stem && <rect x={cx + r - 3} y={cy - 2.5 * u} width={26 * u} height={5 * u} rx="1" fill="url(#sk-steel)" />}
      <circle cx={cx} cy={cy} r={r} fill={M.plate} stroke={C.brass} strokeWidth="1.4" />
      {/* circuit board */}
      <path
        d={`M${c(-64, 22)[0]} ${c(-64, 22)[1]} A${64 * u} ${64 * u} 0 0 1 ${c(46, -44)[0]} ${c(46, -44)[1]} L${c(18, -14)[0]} ${c(18, -14)[1]} L${c(-8, 26)[0]} ${c(-8, 26)[1]} Z`}
        fill={M.board}
        stroke={C.steel}
        strokeWidth="1"
      />
      {/* coil */}
      <g transform={`translate(${c(-26, -40)[0]} ${c(-26, -40)[1]}) rotate(-28)`}>
        <rect x={-24 * u} y={-6.5 * u} width={48 * u} height={13 * u} rx={2 * u} fill={M.copper} stroke="#7d4d24" strokeWidth="0.8" />
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1={(-20 + i * 4) * u} y1={-6.5 * u} x2={(-20 + i * 4) * u} y2={6.5 * u} stroke="#7d4d24" strokeWidth="0.6" />
        ))}
      </g>
      {/* IC */}
      <rect x={c(-30, -8)[0]} y={c(-30, -8)[1]} width={18 * u} height={18 * u} fill="#1e1c1b" stroke={C.dim} strokeWidth="0.7" />
      {/* quartz can */}
      <rect x={bx} y={by} width={8 * u} height={22 * u} rx={3 * u} fill="url(#sk-steelH)" />
      {/* rotor */}
      <circle cx={c(10, -30)[0]} cy={c(10, -30)[1]} r={7 * u} fill={M.magnet} stroke={C.text} strokeWidth="0.6" />
      {cell && <circle cx={c(26, 26)[0]} cy={c(26, 26)[1]} r={31 * u} fill="url(#qk-cell)" stroke="#4e5f6a" />}
      {cell && (
        <T x={c(26, 26)[0]} y={c(26, 26)[1] + 5} a="middle" s={13} c="#2b343a" w={700}>
          +
        </T>
      )}
      {cell && clamp && <path d={`M${c(52, 2)[0]} ${c(52, 2)[1]} L${c(34, 18)[0]} ${c(34, 18)[1]}`} stroke={C.brassHi} strokeWidth={4 * u} strokeLinecap="round" />}
      {screws && [[-40, 44], [58, -22], [-8, -60], [-56, -30]].map(([dx, dy], i) => <Screw key={i} x={c(dx, dy)[0]} y={c(dx, dy)[1]} r={4.2 * u} ang={i * 40} />)}
    </g>
  )
}

// Bench multimeter glyph. (x, y) is the top-left corner. Probe jacks sit on the bottom edge.
function Meter({ x, y, w = 92, h = 120, read, mode, c = C.steel, rc = '#16302a' }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill="#2c2a27" stroke={c} strokeWidth="1.3" />
      <rect x={x + 8} y={y + 9} width={w - 16} height={34} rx="3" fill="#b7c9b5" />
      <T x={x + w / 2} y={y + 32} a="middle" s={16} mono c={rc} w={700}>
        {read}
      </T>
      <circle cx={x + w / 2} cy={y + 74} r={20} fill="#3b3833" stroke={C.struct} />
      <line x1={x + w / 2} y1={y + 74} x2={x + w / 2 + 13} y2={y + 62} stroke={C.text} strokeWidth="2.4" strokeLinecap="round" />
      <T x={x + w / 2} y={y + h - 8} a="middle" s={10.5} c={C.dim}>
        {mode}
      </T>
    </g>
  )
}
// A probe lead from (x1, y1) to a tip at (x2, y2)
function Probe({ x1, y1, x2, y2, c = C.ruby, sag = 30 }) {
  const mx = (x1 + x2) / 2
  const my = Math.max(y1, y2) + sag
  return (
    <g>
      <path d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} fill="none" stroke={c} strokeWidth="2" />
      <circle cx={x2} cy={y2} r={2.6} fill={C.text} stroke={c} strokeWidth="1" />
    </g>
  )
}
// Watch seen from the front, with optional pushers, sub-dials and hands
function Face({ cx, cy, r, push = false, subs = [], crown = 0, hand = 0, ticks = 12 }) {
  return (
    <g>
      {/* lugs */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => (
        <rect key={i} x={cx + a * r * 0.62 - 6} y={cy + b * r * 0.98 - (b < 0 ? 12 : 0)} width={12} height={14} rx="3" fill="#8c9aa3" />
      ))}
      {push && [-35, 35].map((d) => {
        const [x, y] = pol(cx, cy, r + 4, d)
        return <rect key={d} x={x - 2} y={y - 5} width={13} height={10} rx="2" fill="url(#sk-steel)" transform={`rotate(${d} ${x} ${y})`} />
      })}
      <rect x={cx + r + crown - 1} y={cy - 7} width={12} height={14} rx="2" fill="url(#qk-knurl)" stroke="#55646e" strokeWidth="0.6" />
      {crown > 0 && <rect x={cx + r - 2} y={cy - 2} width={crown + 2} height={4} fill={C.dim} />}
      <circle cx={cx} cy={cy} r={r} fill="url(#sk-steel)" stroke="#55646e" />
      <circle cx={cx} cy={cy} r={r * 0.9} fill="#25221f" stroke={C.struct} strokeWidth="0.6" />
      {Array.from({ length: ticks }, (_, i) => {
        const [a, b] = pol(cx, cy, r * 0.87, i * (360 / ticks))
        const [c2, d2] = pol(cx, cy, r * 0.78, i * (360 / ticks))
        return <line key={i} x1={a} y1={b} x2={c2} y2={d2} stroke={C.dim} strokeWidth="1.2" />
      })}
      {subs.map(([dx, dy, sr], i) => (
        <g key={i}>
          <circle cx={cx + dx} cy={cy + dy} r={sr} fill="#34302b" stroke={C.struct} strokeWidth="0.8" />
          <line x1={cx + dx} y1={cy + dy} x2={cx + dx} y2={cy + dy - sr * 0.8} stroke={C.brassHi} strokeWidth="1.4" />
        </g>
      ))}
      <line x1={cx} y1={cy} x2={pol(cx, cy, r * 0.76, hand - 90)[0]} y2={pol(cx, cy, r * 0.76, hand - 90)[1]} stroke={C.brassHi} strokeWidth="1.6" />
      <circle cx={cx} cy={cy} r={3} fill={C.brassHi} />
    </g>
  )
}

// A whole case in section. (cx, y) = centre line and top of the case middle.
// Seal positions: crystal gasket cx±(R-44.5), y-10 · back O-ring cx±(R-34), y+45 ·
// crown seal cx+R+8, y+14 and y+28.
function CaseSec({ cx, y, R = 150, domed, crown = true, seals = true, hands = true, sealC = M.gasket }) {
  const X = (sg, v) => cx + sg * v
  const side = (sg) => (
    <g key={sg}>
      <path
        d={`M${X(sg, R - 36)} ${y} L${X(sg, R - 6)} ${y} Q${X(sg, R + 2)} ${y + 22} ${X(sg, R - 6)} ${y + 46} L${X(sg, R - 42)} ${y + 46} L${X(sg, R - 42)} ${y + 36} L${X(sg, R - 36)} ${y + 36} Z`}
        fill="url(#qk-cut)"
        stroke="#4e5f6a"
      />
      <path d={`M${X(sg, R - 42)} ${y - 1} L${X(sg, R - 42)} ${y - 14} L${X(sg, R - 24)} ${y - 18} L${X(sg, R - 8)} ${y - 14} L${X(sg, R - 4)} ${y - 1} Z`} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={Math.min(X(sg, R - 47), X(sg, R - 42))} y={y - 16} width={5} height={12} fill={seals ? M.rigid : '#6b6b66'} />
      <rect x={Math.min(X(sg, R - 47), X(sg, R - 43))} y={y + 37} width={4} height={10} fill="url(#qk-thread)" />
    </g>
  )
  const w = R - 47
  return (
    <g>
      <rect x={cx - (R - 50)} y={y + 6} width={2 * (R - 50)} height={28} fill="url(#qk-mov)" stroke={C.struct} />
      <rect x={cx - (R - 48)} y={y + 2} width={2 * (R - 48)} height={3.4} fill={M.dial} />
      {hands && (
        <g>
          <rect x={cx - 2} y={y - 6} width={4} height={8} fill={C.dim} />
          <rect x={cx - 2} y={y - 4} width={46} height={1.6} fill={C.brassHi} />
          <rect x={cx - 34} y={y - 1.8} width={36} height={1.6} fill={C.brassHi} />
        </g>
      )}
      {side(1)}
      {side(-1)}
      {domed ? (
        <path d={`M${cx - w} ${y - 7} L${cx - w} ${y - 15} Q${cx} ${y - 42} ${cx + w} ${y - 15} L${cx + w} ${y - 7} Q${cx} ${y - 30} ${cx - w} ${y - 7} Z`} fill="url(#qk-acr)" stroke={M.glass} />
      ) : (
        <rect x={cx - w} y={y - 16} width={2 * w} height={9} fill="url(#qk-acr)" stroke={M.glass} />
      )}
      <rect x={cx - (R - 43)} y={y + 37} width={2 * (R - 43)} height={11} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={cx - (R - 20)} y={y + 47} width={2 * (R - 20)} height={7} rx="1.5" fill="url(#qk-cut)" stroke="#4e5f6a" />
      {seals && [1, -1].map((sg) => <circle key={sg} cx={X(sg, R - 34)} cy={y + 45} r={3.6} fill={sealC} stroke={M.gasketEdge} strokeWidth="0.6" />)}
      {crown && (
        <g>
          <rect x={cx + R - 16} y={y + 15} width={26} height={12} fill="url(#qk-bcut)" stroke="#6b5a2a" strokeWidth="0.6" />
          <rect x={cx + R - 50} y={y + 19.5} width={70} height={3} fill={C.dim} />
          <rect x={cx + R + 8} y={y + 7} width={20} height={28} rx="3" fill="url(#qk-knurl)" stroke="#55646e" strokeWidth="0.6" />
          {seals && [12, 27].map((d) => <rect key={d} x={cx + R + 6} y={y + d} width={6} height={3.2} fill={sealC} />)}
        </g>
      )}
    </g>
  )
}

// A caseback seen from behind
function BackPlan({ cx, cy, r, type }) {
  const lug = [[-1, -1], [1, -1], [-1, 1], [1, 1]]
  return (
    <g>
      {lug.map(([a, b], i) => (
        <rect key={i} x={cx + a * r * 0.62 - 5} y={cy + b * r * 0.98 - (b < 0 ? 9 : 0)} width={10} height={10} rx="2" fill="#7f8e97" />
      ))}
      <rect x={cx - r - 8} y={cy - 5} width={9} height={10} rx="2" fill="url(#qk-knurl)" />
      <circle cx={cx} cy={cy} r={r} fill="#a9b6be" stroke="#4e5f6a" />
      {type !== 'mono' && <circle cx={cx} cy={cy} r={r * 0.86} fill="#bcc7ce" stroke="#55646e" />}
      {type === 'snap' && <rect x={cx + r * 0.72} y={cy + r * 0.28} width={r * 0.2} height={r * 0.2} fill={M.ink} transform={`rotate(20 ${cx + r * 0.8} ${cy + r * 0.36})`} />}
      {type === 'notch' && [0, 60, 120, 180, 240, 300].map((d) => {
        const [x, y] = pol(cx, cy, r * 0.78, d + 15)
        return <rect key={d} x={x - 3.5} y={y - 2.2} width={7} height={4.4} fill={M.ink} transform={`rotate(${d + 15} ${x} ${y})`} />
      })}
      {type === 'knurl' && Array.from({ length: 48 }, (_, i) => {
        const [a, b] = pol(cx, cy, r * 0.86, i * 7.5)
        const [c2, d2] = pol(cx, cy, r * 0.78, i * 7.5)
        return <line key={i} x1={a} y1={b} x2={c2} y2={d2} stroke="#55646e" strokeWidth="0.8" />
      })}
      {type === 'screws' && [45, 135, 225, 315].map((d) => {
        const [x, y] = pol(cx, cy, r * 0.72, d)
        return <Screw key={d} x={x} y={y} r={r * 0.11} ang={d} />
      })}
      {type === 'bayonet' && [30, 150, 270].map((d) => {
        const [x, y] = pol(cx, cy, r * 0.86, d)
        return <rect key={d} x={x - 6} y={y - 3} width={12} height={6} rx="1" fill="#6f808b" transform={`rotate(${d + 90} ${x} ${y})`} />
      })}
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* Lesson: service a quartz movement                                    */
/* ------------------------------------------------------------------ */
function QsPick() {
  return (
    <F h={290} view="Comparison · what to look for" scale="schematic">
      <Pn x={12} y={28} w={222} h={176} t="Serviceable" tc={C.emerald} c={C.emerald} />
      <Verdict x={214} y={46} ok />
      <QMove cx={118} cy={122} r={62} />
      <Lead p={[169, 103]} t={[190, 76]} text="screws" a="start" s={10.5} />
      <Lead p={[100, 98]} t={[88, 62]} text="coil on view" s={10.5} />
      <T x={123} y={198} a="middle" s={10.5} c={C.dim}>metal plate, bridges, parts you can reach</T>

      <Pn x={246} y={28} w={222} h={176} t="Swap, don’t strip" tc={C.ruby} c={C.ruby} />
      <Verdict x={448} y={46} ok={false} />
      <circle cx={340} cy={122} r={62} fill="#39352f" stroke={C.struct} strokeWidth="1.4" />
      <rect x={399} y={119} width={20} height={5} rx="1" fill="url(#sk-steel)" />
      <circle cx={340} cy={122} r={46} fill="none" stroke={C.line} strokeDasharray="3 3" />
      {[0, 72, 144, 216, 288].map((d) => {
        const [x, y] = pol(340, 122, 52, d + 20)
        return <circle key={d} cx={x} cy={y} r={3.2} fill="#726a5d" stroke={C.ink} />
      })}
      <T x={340} y={118} a="middle" s={11} c={C.dim}>one-piece</T>
      <T x={340} y={132} a="middle" s={11} c={C.dim}>plastic body</T>
      <Lead p={[389, 102]} t={[424, 76]} text="rivets" a="start" s={10.5} />
      <T x={357} y={198} a="middle" s={10.5} c={C.dim}>no screws to the train: treat it as sealed</T>

      <Tb
        x={14}
        y={224}
        cols={[{ w: 110 }, { w: 180 }, { w: 170 }]}
        rows={[
          ['Calibre', 'Sheet for this lesson', 'Use it for'],
          ['ETA 955', { t: 'public, with limits', c: C.emerald }, 'the worked example'],
          ['Ronda 715', { t: 'not checked here', c: C.brass }, 'strip practice, not these limits'],
          ['No sheet', { t: 'nothing to judge against', c: C.ruby }, 'practice only'],
        ]}
      />
    </F>
  )
}

function QsBaseline() {
  return (
    <F h={236} view="Record card · ETA 955.112 example" scale="sample readings">
      <rect x={14} y={28} width={452} height={166} rx="6" fill="#e9e2d0" />
      <Tb
        x={24}
        y={48}
        rh={23}
        s={11}
        cols={[{ w: 150 }, { w: 118 }, { w: 84, a: 'middle' }, { w: 84, a: 'middle' }]}
        rows={[
          [{ t: 'Reading', c: '#5a5040', w: 700 }, { t: 'Sheet limit', c: '#5a5040', w: 700 }, { t: 'Before', c: '#5a5040', w: 700 }, { t: 'After', c: '#5a5040', w: 700 }],
          [{ t: 'Cell voltage', c: '#2a241c' }, { t: '1.55 V nominal', c: '#2a241c' }, { t: '1.56 V', c: '#2c4a78', mono: true }, { t: '…', c: '#8d8370' }],
          [{ t: 'Coil resistance', c: '#2a241c' }, { t: '1.30–1.80 kΩ', c: '#2a241c' }, { t: '1.52 kΩ', c: '#2c4a78', mono: true }, { t: '…', c: '#8d8370' }],
          [{ t: 'Current, stem in', c: '#2a241c' }, { t: '≤ 1.20 µA', c: '#2a241c' }, { t: '1.9 µA', c: '#a33', mono: true }, { t: '…', c: '#8d8370' }],
          [{ t: 'Current, position 3', c: '#2a241c' }, { t: '≤ 0.5 µA', c: '#2a241c' }, { t: '0.4 µA', c: '#2c4a78', mono: true }, { t: '…', c: '#8d8370' }],
          [{ t: 'Room temperature', c: '#2a241c' }, { t: '20–25 °C', c: '#2a241c' }, { t: '22 °C', c: '#2c4a78', mono: true }, { t: '…', c: '#8d8370' }],
          [{ t: 'Seconds hand', c: '#2a241c' }, { t: 'one clean step', c: '#2a241c' }, { t: 'stutters', c: '#a33', mono: true }, { t: '…', c: '#8d8370' }],
        ]}
      />
      <T x={14} y={212} s={11} c={C.dim}>Coil and stem-out current are in band, so cleaning has a chance.</T>
      <T x={14} y={227} s={11} c={C.dim}>Stem-in current is high: that’s the number the service should bring down.</T>
    </F>
  )
}

function QsTweezers() {
  return (
    <F h={268} view="Tool choice · tweezers" scale="schematic">
      {[
        [72, '#d8d2c3', 'Plastic', ['cell, clamp area,', 'insulators'], true],
        [196, C.brass, 'Brass', ['conducts: screws', 'and wheels only'], null],
        [320, C.steel, 'Steel', ['conducts: screws', 'and wheels only'], null],
      ].map(([x, c, n, l, ok]) => (
        <g key={n}>
          <G x={x} y={140} ang={0}>
            <Tweezers c={c} len={104} />
          </G>
          <T x={x} y={158} a="middle" s={12} c={C.text} w={600}>{n}</T>
          <Note x={x} y={173} a="middle" s={10.5} lh={13} lines={l} />
          {ok && <Verdict x={x + 34} y={60} ok />}
        </g>
      ))}
      <Ring x={420} y={110} r={50} c={C.ruby} />
      <circle cx={420} cy={112} r={32} fill="url(#qk-cell)" stroke="#4e5f6a" />
      <T x={420} y={118} a="middle" s={16} c="#2b343a" w={700}>+</T>
      <path d="M396 150 L420 150 L420 146" stroke={M.copper} strokeWidth="2" fill="none" />
      <path d="M385 82 L398 128" stroke={C.steel} strokeWidth="3" strokeLinecap="round" />
      <path d="M442 74 L436 108" stroke={C.steel} strokeWidth="3" strokeLinecap="round" />
      <T x={420} y={176} a="middle" s={10.5} c={C.ruby}>metal across the</T>
      <T x={420} y={189} a="middle" s={10.5} c={C.ruby}>cell shorts it</T>
      <Verdict x={456} y={68} ok={false} />
      <Sep x1={14} y1={204} x2={466} y2={204} />
      <T x={14} y={224} s={11.5} c={C.text}>Rule: if the cell is in, the metal stays out.</T>
      <T x={14} y={241} s={10.5} c={C.dim}>ETA says battery tweezers must not conduct.</T>
      <T x={14} y={255} s={10.5} c={C.dim}>Seiko’s AC step is the one exception, covered in the chronograph lesson.</T>
    </F>
  )
}

function QsStripDial() {
  const st = '#8c9aa3'
  const items = [
    { w: 74, c: C.brass, teeth: true, n: 1, t: 'Hour wheel' },
    { w: 56, c: st, n: 2, t: 'Date jumper bridge', sub: '+ 2 screws', ox: 44 },
    { w: 40, c: C.steel, n: 3, t: 'Date jumper', sub: 'spring: hold it', ox: 48, nc: C.ruby },
    { w: 26, c: C.brass, teeth: true, n: 4, t: 'Intermediate date wheel', ox: 36 },
    { w: 58, c: C.brass, teeth: true, n: 5, t: 'Calendar driving wheel', ox: 20 },
    { w: 190, c: M.dial, ring: true, n: 6, t: 'Date indicator' },
    { w: 96, c: st, n: 7, t: 'Minute train bridge', sub: '+ screw' },
    { w: 48, c: C.steel, n: 8, t: 'Yoke', ox: 34 },
    { w: 26, c: C.steel, teeth: true, n: 9, t: 'Date corrector', ox: -42 },
    { w: 24, c: C.brass, teeth: true, n: 10, t: 'Setting wheel', ox: 50 },
    { w: 44, c: C.brass, teeth: true, n: 11, t: 'Minute wheel', ox: -30 },
    { w: 34, c: C.brass, teeth: true, arbor: true, n: 12, t: 'Cannon pinion + wheel' },
  ]
  return (
    <F h={330} view="Exploded side view · dial side" scale="schematic, ETA 955 order">
      <Stack x={120} y={40} gap={22} items={items} lx={268} />
      <rect x={18} y={306} width={204} height={9} rx="2" fill={M.plate} stroke={C.brass} />
      <T x={120} y={326} a="middle" s={10.5} c={C.faint}>main plate, dial side up</T>
      <Arrow a={[28, 132]} b={[28, 56]} c="brass" />
      <T x={22} y={166} s={10.5} c={C.brass} a="start">lifts</T>
      <T x={22} y={179} s={10.5} c={C.brass} a="start">upward</T>
    </F>
  )
}

function QsStripModule() {
  const items = [
    { w: 34, c: C.brassHi, n: 1, t: 'Plus bridle', sub: '+ 1 screw', ox: 58 },
    { w: 140, c: '#b39a55', n: 2, t: 'Magnetic screen', sub: '+ 1 screw' },
    { w: 190, c: M.board, e: C.steel, n: 3, t: 'Electronic module', sub: '4 screws' },
    { w: 176, c: '#3f7f97', n: 4, t: 'Distance piece' },
    { w: 90, c: '#3a3836', e: C.struct, n: 5, t: 'Battery insulator', ox: 42 },
  ]
  return (
    <F h={290} view="Exploded side view · circuit side" scale="schematic, ETA 955 order">
      <Stack x={120} y={46} gap={28} items={items} lx={268} />
      <rect x={18} y={190} width={204} height={9} rx="2" fill={M.plate} stroke={C.brass} />
      <T x={120} y={212} a="middle" s={10.5} c={C.faint}>main plate, train in place</T>
      <Sep x1={14} y1={222} x2={466} y2={222} />
      <Tag x={14} y={240}>The screws</Tag>
      {/* plain */}
      <g transform="translate(60 268)">
        <rect x="-8" y="-20" width="16" height="6" rx="1" fill="#c5ced4" />
        <rect x="-3" y="-14" width="6" height="22" fill="url(#qk-thread)" />
      </g>
      <T x={80} y={258} s={11} c={C.text}>Plain × 3</T>
      <T x={80} y={272} s={10.5} c={C.dim}>thread runs to the head</T>
      <g transform="translate(244 268)">
        <rect x="-8" y="-20" width="16" height="6" rx="1" fill="#c5ced4" />
        <rect x="-5" y="-14" width="10" height="9" fill="#c5ced4" />
        <rect x="-3" y="-5" width="6" height="13" fill="url(#qk-thread)" />
      </g>
      <Lead p={[249, 258]} t={[276, 248]} text="shoulder" a="start" s={10.5} c={C.brass} />
      <T x={280} y={272} s={11} c={C.text}>Shouldered × 1: note its hole</T>
    </F>
  )
}

function QsTrain() {
  const bx = 34
  return (
    <F h={262} view="Section · the train" scale="schematic">
      <rect x={bx} y={190} width={290} height={14} fill="url(#qk-bcut)" />
      <rect x={bx + 30} y={56} width={230} height={12} fill="url(#qk-bcut)" />
      <T x={bx + 300} y={202} s={10.5} c={C.faint}>plate</T>
      <T x={bx + 145} y={48} a="middle" s={10.5} c={C.faint}>train bridge</T>
      {/* wheels */}
      {[
        [80, 22, 150, M.magnet, 'rotor', 4],
        [140, 54, 132, C.brass, 'third', 3],
        [200, 60, 112, C.brass, 'second', 2],
        [262, 44, 150, C.brass, 'intermediate', 1],
      ].map(([x, w, y, c, n, k]) => (
        <g key={n}>
          <rect x={x - 2} y={68} width={4} height={122} fill={C.dim} />
          <rect x={x - w / 2} y={y} width={w} height={n === 'rotor' ? 18 : 6} rx="1.5" fill={c} />
          <Num x={x} y={y + (n === 'rotor' ? 34 : 18)} n={k} r={8} />
        </g>
      ))}
      <T x={80} y={222} a="middle" s={11} c={C.text}>rotor</T>
      <T x={80} y={235} a="middle" s={10} c={C.ruby}>out last</T>
      <T x={140} y={222} a="middle" s={11} c={C.text}>third</T>
      <T x={200} y={222} a="middle" s={11} c={C.text}>second</T>
      <T x={262} y={222} a="middle" s={11} c={C.text}>intermediate</T>
      {/* field */}
      {[16, 26].map((r) => (
        <path key={r} d={`M${80 - r} 168 A${r} ${r} 0 0 0 ${80 + r} 168`} fill="none" stroke={M.magnet} strokeDasharray="2 3" strokeWidth="1" transform="rotate(180 80 168)" />
      ))}
      {[[46, 150], [40, 170], [50, 182], [113, 176]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={3} height={1.6} fill={C.text} transform={`rotate(${i * 50} ${x} ${y})`} />
      ))}
      <T x={20} y={126} s={10.5} c={C.dim}>steel dust</T>
      <path d="M44 131 L46 148" stroke={C.struct} strokeWidth="0.8" />
      {/* covered dish */}
      <Pn x={352} y={60} w={116} h={130} t="Covered dish" />
      <path d="M366 136 h88 l-8 26 h-72 Z" fill="#3a3530" stroke={C.struct} />
      <path d="M362 132 a48 26 0 0 1 96 0 Z" fill="rgba(160,200,215,0.2)" stroke={C.steel} />
      <rect x={401} y={130} width={18} height={12} rx="1.5" fill={M.magnet} />
      <T x={410} y={180} a="middle" s={10.5} c={C.dim}>rotor, alone</T>
      <Arrow d="M110 100 Q 230 20 366 110" c="brass" dash="4 4" />
    </F>
  )
}

function QsSort() {
  const col = (x, c, h, ok, rows, foot) => (
    <g>
      <Pn x={x} y={28} w={148} h={184} t={h} c={c} tc={c} />
      {rows.map((r, i) => (
        <T key={r} x={x + 10} y={60 + i * 18} s={11} c={C.text}>
          {r}
        </T>
      ))}
      <line x1={x + 8} y1={166} x2={x + 140} y2={166} stroke={C.line} />
      <Note x={x + 10} y={182} s={10.5} lh={13} lines={foot} />
    </g>
  )
  return (
    <F h={252} view="Sorting · before any fluid" scale="check against your sheet">
      {col(12, C.emerald, 'Wash', true, ['Main plate', 'Bridges', 'Metal wheels', 'Levers, springs', 'Screws'], ['your routine from', '“Cleaning the parts”'])}
      {col(166, C.brass, 'By hand only', null, ['Plastic wheels', 'Plastic spacers', 'Date ring', '(forum practice)'], ['Rodico, no scraping', 'unless maker says safe'])}
      {col(320, C.ruby, 'Never in fluid', false, ['Rotor', '(ETA: do not wash)', 'Electronic module', 'Coil', 'Cell'], ['exchange the rotor', 'if it needs more'])}
      <T x={14} y={232} s={11} c={C.dim}>No checked source lists fluids that are safe on watch plastics, so the middle pile</T>
      <T x={14} y={246} s={11} c={C.dim}>stays out of fluid by default.</T>
    </F>
  )
}

function QsRotor() {
  const rotor = (cx, cy, dirty) => (
    <g>
      <rect x={cx - 3} y={cy - 56} width={6} height={112} fill={C.dim} />
      <rect x={cx - 34} y={cy - 18} width={68} height={36} rx="3" fill={M.magnet} stroke={C.text} strokeWidth="0.6" />
      <line x1={cx} y1={cy - 18} x2={cx} y2={cy + 18} stroke={C.text} strokeDasharray="3 2" />
      <T x={cx - 17} y={cy + 4} a="middle" s={12} c="#f6e9e7" w={700}>N</T>
      <T x={cx + 17} y={cy + 4} a="middle" s={12} c="#f6e9e7" w={700}>S</T>
      <rect x={cx - 9} y={cy - 40} width={18} height={10} fill="url(#qk-knurl)" />
      {dirty && [[-30, -24], [-14, -22], [22, -23], [34, -10], [-38, 8], [28, 24]].map(([dx, dy], i) => <rect key={i} x={cx + dx} y={cy + dy} width={5} height={2} fill="#eef3f6" transform={`rotate(${i * 37} ${cx + dx} ${cy + dy})`} />)}
    </g>
  )
  return (
    <F h={260} view="Detail · rotor under the loupe" scale="schematic, magnified">
      <Ring x={122} y={116} r={84} c={C.ruby} />
      {rotor(122, 116, true)}
      <Verdict x={190} y={46} ok={false} />
      <Ring x={358} y={116} r={84} c={C.emerald} />
      {rotor(358, 116, false)}
      <Verdict x={426} y={46} ok />
      <Lead p={[92, 94]} t={[20, 36]} text="filings on the magnet" a="start" s={10.5} />
      <Lead p={[128, 80]} t={[160, 34]} text="pinion" a="start" s={10.5} c={C.dim} dot={false} />
      <path d="M222 118 L258 118" stroke={C.brass} strokeWidth="2" markerEnd="url(#sk-a-brass)" />
      <rect x={224} y={92} width={32} height={16} rx="7" fill="#b9a26b" />
      <T x={240} y={86} a="middle" s={10.5} c={C.brass}>Rodico</T>
      <Note x={240} y={222} a="middle" s={11} lh={15} lines={['Dab, don’t wipe. Turn the rotor under the loupe and look all the way round.', 'Particles that won’t lift, or a marked pinion, mean a new rotor.']} />
    </F>
  )
}

function QsOil() {
  const j = [[150, 76, 'f'], [120, 118, 'f'], [190, 112, 'v'], [176, 158, 'f'], [86, 176, 't'], [116, 186, 't'], [66, 148, 't']]
  return (
    <F h={268} view="Plan · oil map, illustrative" scale="not the 955’s exact points">
      <circle cx={134} cy={132} r={96} fill={M.plate} stroke={C.brass} strokeWidth="1.4" />
      <rect x={228} y={129} width={30} height={6} rx="1" fill="url(#sk-steel)" />
      {[[150, 76, 26], [120, 118, 22], [190, 112, 20], [176, 158, 16]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="none" stroke={C.brass} strokeWidth="1" strokeDasharray="4 2" />
      ))}
      {j.map(([x, y, k], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={5} fill="#7c2b3a" stroke={C.brassHi} strokeWidth="0.8" />
          {k === 'f' && <circle cx={x} cy={y} r={2.2} fill={M.oil} />}
          {k === 'v' && <circle cx={x} cy={y} r={1.2} fill={M.oil} />}
          {k === 't' && <circle cx={x} cy={y} r={3} fill={C.ruby} stroke={C.text} strokeWidth="0.6" />}
        </g>
      ))}
      <Tag x={254} y={38}>Key</Tag>
      <circle cx={262} cy={56} r={2.2} fill={M.oil} />
      <T x={276} y={60} s={11} c={C.text}>Fine oil on train jewels</T>
      <T x={276} y={74} s={10} c={C.dim}>Moebius 9014 on the 955</T>
      <circle cx={262} cy={92} r={1.2} fill={M.oil} />
      <T x={276} y={96} s={11} c={C.text}>Very small quantity</T>
      <T x={276} y={110} s={10} c={C.dim}>marked pivot only</T>
      <circle cx={262} cy={128} r={3} fill={C.ruby} stroke={C.text} strokeWidth="0.6" />
      <T x={276} y={132} s={11} c={C.text}>Thick oil on keyless</T>
      <T x={276} y={146} s={10} c={C.dim}>HP-1300 on the 955</T>
      <Pn x={252} y={160} w={214} h={96} t="Amount" />
      {[[296, true], [408, false]].map(([x, ok]) => (
        <g key={x}>
          <rect x={x - 34} y={224} width={68} height={7} fill="url(#qk-bcut)" />
          <circle cx={x} cy={222} r={9} fill="#7c2b3a" stroke={C.brassHi} strokeWidth="0.8" />
          {ok ? <circle cx={x} cy={222} r={3} fill={M.oil} /> : <ellipse cx={x} cy={221} rx={24} ry={7} fill={M.oil} opacity="0.85" />}
          <Verdict x={x + 40} y={200} ok={ok} r={8} />
        </g>
      ))}
      <T x={296} y={246} a="middle" s={10.5} c={C.dim}>stays in the oil sink</T>
      <T x={408} y={246} a="middle" s={10.5} c={C.dim}>floods, parts cling</T>
      <T x={134} y={250} a="middle" s={10.5} c={C.faint}>rotor gets none: it’s pre-lubricated</T>
    </F>
  )
}

function QsModuleBack() {
  return (
    <F h={250} view="Detail · stem entry and module seating" scale="schematic">
      <Pn x={12} y={28} w={220} h={208} t="Stem: turn as it enters" />
      {/* setting wheel */}
      {Array.from({ length: 14 }, (_, i) => {
        const [x, y] = pol(58, 130, 30, i * 25.7)
        return <circle key={i} cx={x} cy={y} r={3} fill={C.brass} />
      })}
      <circle cx={58} cy={130} r={28} fill={C.brass} />
      <circle cx={58} cy={130} r={5} fill={M.ink} />
      <T x={58} y={178} a="middle" s={10.5} c={C.dim}>setting wheel</T>
      <rect x={94} y={121} width={38} height={18} rx="2" fill="url(#qk-knurl)" stroke="#55646e" strokeWidth="0.6" />
      <T x={94} y={112} s={10.5} c={C.dim}>sliding pinion</T>
      <rect x={128} y={127} width={88} height={6} fill="url(#sk-steel)" />
      <Arrow a={[214, 158]} b={[150, 158]} c="brass" />
      <path d="M184 118 a14 8 0 1 1 18 0" fill="none" stroke={C.brass} strokeWidth="2" markerEnd="url(#sk-a-brass)" />
      <T x={190} y={92} a="middle" s={10.5} c={C.brass}>turn slightly</T>
      <Note x={24} y={204} s={10.5} lh={13} lines={['Pushed straight, the stem can', 'damage the setting wheel teeth.']} />

      <Pn x={244} y={28} w={224} h={100} t="Module sits flat" c={C.emerald} tc={C.emerald} />
      <Verdict x={448} y={46} ok r={8} />
      <rect x={262} y={92} width={190} height={8} fill={M.plate} stroke={C.brass} />
      <rect x={262} y={80} width={190} height={8} fill={M.board} stroke={C.steel} />
      {[290, 356, 424].map((x) => (
        <g key={x}>
          <rect x={x - 6} y={72} width={12} height={8} rx="1" fill="#c5ced4" />
          <rect x={x - 2} y={80} width={4} height={18} fill="url(#qk-thread)" />
        </g>
      ))}
      <T x={356} y={118} a="middle" s={10.5} c={C.dim}>every screw starts by hand</T>

      <Pn x={244} y={136} w={224} h={100} t="One corner high" c={C.ruby} tc={C.ruby} />
      <Verdict x={448} y={154} ok={false} r={8} />
      <rect x={262} y={200} width={190} height={8} fill={M.plate} stroke={C.brass} />
      <rect x={262} y={186} width={190} height={8} fill={M.board} stroke={C.steel} transform="rotate(-3 262 194)" />
      <circle cx={428} cy={190} r={3.5} fill={C.text} />
      <T x={356} y={226} a="middle" s={10.5} c={C.dim}>lift it: a screw or particle is under it</T>
    </F>
  )
}

function QsDate() {
  const cell = (x, n, title, sub, drop, spin) => (
    <g>
      <Pn x={x} y={28} w={108} h={172} />
      <Num x={x + 15} y={44} n={n} r={9} />
      <path d={`M${x + 12} 150 A78 78 0 0 1 ${x + 96} 150`} fill="none" stroke={M.dial} strokeWidth="14" />
      {Array.from({ length: 8 }, (_, i) => {
        const [px, py] = pol(x + 54, 190, 84, 238 + i * 9.1)
        const [qx, qy] = pol(x + 54, 190, 73, 238 + i * 9.1)
        return <line key={i} x1={px} y1={py} x2={qx} y2={qy} stroke="#776f5f" strokeWidth="1.6" />
      })}
      <path d={`M${x + 16} 164 L${x + 46} 164 L${x + 53} 124 L${x + 60} 164`} fill="none" stroke={C.steel} strokeWidth="3" strokeLinejoin="round" />
      {drop && <circle cx={x + 53} cy={126} r={3.5} fill={M.oil} />}
      {drop && (
        <G x={x + 53} y={120} ang={18} k={0.75}>
          <Oiler len={66} drop={0} />
        </G>
      )}
      {spin && <path d={`M${x + 28} 76 A44 44 0 0 1 ${x + 84} 76`} fill="none" stroke={C.brass} strokeWidth="2.2" markerEnd="url(#sk-a-brass)" />}
      <T x={x + 54} y={178} a="middle" s={11} c={C.text} w={600}>{title}</T>
      <T x={x + 54} y={192} a="middle" s={10} c={C.dim}>{sub}</T>
    </g>
  )
  return (
    <F h={240} view="Sequence · date jumper" scale="schematic">
      {cell(12, 1, 'Lubricate', 'the jumper', true, false)}
      {cell(126, 2, 'Turn', 'about 10 teeth', false, true)}
      {cell(240, 3, 'Lubricate', 'again', true, false)}
      {cell(354, 4, 'Turn', 'about 10 more', false, true)}
      <T x={240} y={222} a="middle" s={11} c={C.dim}>Turn with the quick corrector. Each click in position 2 should be one clean step.</T>
    </F>
  )
}

function QsVerdict() {
  const bar = (y, label, limit, val, max, ok) => {
    const X = (v) => 150 + (v / max) * 300
    return (
      <g>
        <T x={14} y={y + 11} s={11} c={C.text}>{label}</T>
        <rect x={150} y={y} width={300} height={14} rx="2" fill="#2c2722" stroke={C.line} />
        <rect x={150} y={y} width={X(limit) - 150} height={14} rx="2" fill="rgba(123,165,131,0.35)" />
        <rect x={X(val) - 2} y={y - 4} width={4} height={22} fill={ok ? C.emerald : C.ruby} />
        <T x={X(limit)} y={y + 28} a="middle" s={10} mono>limit {limit} µA</T>
        <T x={X(val)} y={y - 8} a="middle" s={10} mono c={ok ? C.emerald : C.ruby}>{val} µA</T>
      </g>
    )
  }
  return (
    <F h={276} view="Chart · the after column" scale="ETA 955.112, sample readings">
      {bar(48, 'Stem in, running', 1.2, 2.1, 3, false)}
      {bar(104, 'Position 3, motor off', 0.5, 0.4, 3, true)}
      <Sep x1={14} y1={146} x2={466} y2={146} />
      <Bx x={14} y={158} w={146} h={72} c={C.emerald} l={['Both in limit', 'the service worked', 'log the numbers']} b={C.dim} s={11} />
      <Bx x={167} y={158} w={146} h={72} c={C.brass} l={['Running high only', 'mechanical load', 'pivot, oil, hand, rotor']} b={C.dim} s={11} />
      <Bx x={320} y={158} w={146} h={72} c={C.ruby} l={['Position 3 high too', 'electronics at fault', 'change the module']} b={C.dim} s={11} />
      <T x={240} y={250} a="middle" s={11} c={C.dim}>The sample above matches the middle box: go back and find the load.</T>
      <T x={240} y={265} a="middle" s={10.5} c={C.faint}>Cleaning can’t bring a high position 3 reading down.</T>
    </F>
  )
}


/* ------------------------------------------------------------------ */
/* Lesson: electrical testing                                           */
/* ------------------------------------------------------------------ */
function QmInstruments() {
  const rows = [
    ['Cell voltage', 1, 1, '2 V range, at least 10 kΩ/V'],
    ['Coil resistance', 0, 1, 'test voltage 0.40 V or less'],
    ['Current, about 1 µA', -1, 1, 'needs an averaged reading'],
    ['Lowest working voltage', -1, 1, 'needs a variable supply'],
    ['Rate', -1, 1, 'needs the right gate'],
  ]
  const mark = (x, y, v) => (v === 0 ? <T x={x} y={y + 4} a="middle" s={11} c={C.brass} w={700}>if…</T> : <Verdict x={x} y={y} ok={v > 0} r={7.5} />)
  const X = (e) => 30 + ((e + 10) / 10) * 420 // e = log10(amps)
  return (
    <F h={300} view="Chart · which instrument for which reading" scale="schematic">
      <T x={182} y={42} a="middle" s={10.5} c={C.faint}>Multimeter</T>
      <T x={246} y={42} a="middle" s={10.5} c={C.faint}>Tester</T>
      <T x={286} y={42} s={10.5} c={C.faint}>What decides it</T>
      {rows.map(([n, a, b, why], i) => {
        const y = 62 + i * 26
        return (
          <g key={n}>
            {i > 0 && <line x1={14} y1={y - 13} x2={466} y2={y - 13} stroke={C.line} strokeWidth="0.6" />}
            <T x={14} y={y + 4} s={11} c={C.text}>{n}</T>
            {mark(182, y, a)}
            {mark(246, y, b)}
            <T x={286} y={y + 4} s={10.5} c={C.dim}>{why}</T>
          </g>
        )
      })}
      <Sep x1={14} y1={190} x2={466} y2={190} />
      <Tag x={14} y={208}>How small the current is</Tag>
      <line x1={30} y1={250} x2={450} y2={250} stroke={C.struct} strokeWidth="1.4" />
      {[[-9, '1 nA'], [-6, '1 µA'], [-3, '1 mA'], [0, '1 A']].map(([e, l]) => (
        <g key={l}>
          <line x1={X(e)} y1={245} x2={X(e)} y2={255} stroke={C.struct} strokeWidth="1.2" />
          <T x={X(e)} y={270} a="middle" s={10} mono>{l}</T>
        </g>
      ))}
      <rect x={X(-8.3)} y={234} width={X(-1.7) - X(-8.3)} height={9} rx="2" fill="rgba(134,167,189,0.45)" />
      <T x={X(-5)} y={228} a="middle" s={10.5} c={C.steel}>BHI timing machine spec: 5 nA to 20 mA</T>
      <circle cx={X(-5.92)} cy={250} r={5} fill={C.brass} />
      <T x={236} y={290} s={10.5} c={C.brass}>ETA 955 limit: 1.20 µA</T>
      <line x1={X(-5.92) + 2} y1={255} x2={232} y2={286} stroke={C.brass} strokeWidth="0.8" />
    </F>
  )
}

function QmVoltage() {
  const Y = (v) => 44 + ((1.65 - v) / 0.55) * 226
  const band = (x, w, a, b, c, l) => (
    <g>
      <rect x={x} y={Y(a)} width={w} height={Y(b) - Y(a)} fill={c} opacity="0.38" stroke={c} />
      <T x={x + w / 2} y={(Y(a) + Y(b)) / 2 + 4} a="middle" s={10.5} c={C.text}>{l}</T>
    </g>
  )
  const mark = (v, l, sub, c = C.brass) => (
    <g>
      <line x1={316} y1={Y(v)} x2={344} y2={Y(v)} stroke={c} strokeWidth="2" />
      <T x={350} y={Y(v) + 1} s={11} c={C.text}>{l}</T>
      <T x={350} y={Y(v) + 13} s={10} c={C.faint}>{sub}</T>
    </g>
  )
  return (
    <F h={296} view="Scale · volts, silver-oxide 1.55 V family" scale="not to one calibre">
      <T x={110} y={38} a="middle" s={10.5} c={C.faint}>Cell, no load</T>
      <T x={216} y={38} a="middle" s={10.5} c={C.faint}>Cell, high drain</T>
      <T x={392} y={38} a="middle" s={10.5} c={C.faint}>Movement on a supply</T>
      {[1.6, 1.5, 1.4, 1.3, 1.2].map((v) => (
        <g key={v}>
          <line x1={46} y1={Y(v)} x2={316} y2={Y(v)} stroke={C.line} strokeWidth="0.6" />
          <T x={40} y={Y(v) + 4} a="end" s={10} mono>{v.toFixed(2)}</T>
        </g>
      ))}
      {band(56, 108, 1.6, 1.45, C.emerald, 'good')}
      {band(56, 108, 1.45, 1.4, C.brass, 'replace')}
      {band(56, 108, 1.4, 1.1, C.ruby, 'discharged')}
      {band(172, 90, 1.6, 1.25, C.emerald, 'good')}
      {band(172, 90, 1.25, 1.2, C.brass, '')}
      {band(172, 90, 1.2, 1.1, C.ruby, 'discharged')}
      <line x1={330} y1={Y(1.6)} x2={330} y2={Y(1.12)} stroke={C.struct} strokeWidth="1.4" />
      {mark(1.55, '1.55 V', 'nominal, ETA test supply')}
      {mark(1.3, '1.30 V', 'ETA 955 warning level')}
      <line x1={316} y1={Y(1.25)} x2={344} y2={Y(1.25)} stroke={C.brass} strokeWidth="2" />
      <T x={350} y={Y(1.25) + 11} s={11} c={C.text}>about 1.25 V</T>
      <T x={350} y={Y(1.25) + 23} s={10} c={C.faint}>Witschi: warning, typical</T>
      <line x1={316} y1={Y(1.2)} x2={344} y2={Y(1.2)} stroke={C.ruby} strokeWidth="2" />
      <T x={350} y={Y(1.2) + 22} s={11} c={C.text}>about 1.2 V</T>
      <T x={350} y={Y(1.2) + 34} s={10} c={C.faint}>Witschi: movement stops</T>
      <path d={`M344 ${Y(1.2)} L348 ${Y(1.2) + 11}`} stroke={C.struct} strokeWidth="0.7" />
    </F>
  )
}

function QmTestvolt() {
  return (
    <F h={268} view="Bench check · meter against meter" scale="no watch connected">
      <T x={76} y={42} a="middle" s={11} c={C.text}>meter under test</T>
      <T x={236} y={42} a="middle" s={11} c={C.text}>second meter</T>
      <Meter x={30} y={50} read="OL" mode="Ω range" />
      <Meter x={190} y={50} read="0.31" mode="DC volts" c={C.brass} />
      <path d="M60 170 C 60 210, 206 210, 206 170" fill="none" stroke={C.ruby} strokeWidth="2" />
      <path d="M92 170 C 92 224, 268 224, 268 170" fill="none" stroke={M.ink} strokeWidth="3.4" />
      <path d="M92 170 C 92 224, 268 224, 268 170" fill="none" stroke={C.faint} strokeWidth="2" />
      <T x={176} y={234} a="middle" s={10.5} c={C.dim}>red to red, black to black, tips touching</T>
      <Pn x={312} y={32} w={156} h={92} t="0.40 V or less" c={C.emerald} tc={C.emerald} />
      <Verdict x={448} y={50} ok r={8} />
      <Note x={324} y={72} s={11} lh={15} lines={['Fine for an ETA coil.', 'ETA recommends 0.20 V.']} />
      <Pn x={312} y={132} w={156} h={92} t="Above 0.40 V" c={C.ruby} tc={C.ruby} />
      <Verdict x={448} y={150} ok={false} r={8} />
      <Note x={324} y={172} s={11} lh={15} lines={['Try another Ω range.', 'If all are too high, use', 'a watch tester.']} />
      <T x={14} y={256} s={11} c={C.dim}>The second meter shows what the ohms range would put across a coil.</T>
    </F>
  )
}

function QmProbes() {
  const cx = 128, cy = 136, r = 100
  const u = r / 70
  const p = (dx, dy) => [cx + dx * u, cy + dy * u]
  const a = p(-54, -14), b = p(14, -52), t = p(6, 34), n = p(40, 42)
  return (
    <F h={300} view="Plan · where the probes land" scale="generic, not one calibre">
      <QMove cx={cx} cy={cy} r={r} cell={false} />
      <circle cx={p(26, 26)[0]} cy={p(26, 26)[1]} r={31 * u} fill="#3b352a" stroke={C.struct} strokeDasharray="4 3" />
      <T x={p(30, 12)[0]} y={p(30, 12)[1]} a="middle" s={10} c={C.faint}>cell out</T>
      {[a, b].map(([x, y], i) => <rect key={i} x={x - 5} y={y - 5} width={10} height={10} rx="1.5" fill={C.brassHi} stroke={M.ink} />)}
      <rect x={t[0] - 4} y={t[1] - 4} width={8} height={8} fill={C.emerald} stroke={M.ink} />
      <path d={`M${n[0] - 18} ${n[1]} h36`} stroke={C.steel} strokeWidth="3" />
      <Lead p={a} t={[62, 42]} text="coil pad" s={10.5} c={C.brass} />
      <Lead p={b} t={[186, 34]} text="coil pad" a="start" s={10.5} c={C.brass} />
      <Lead p={t} t={[96, 262]} text="test point T" s={10.5} c={C.emerald} />
      <Lead p={[n[0] + 10, n[1]]} t={[190, 264]} text="negative track" a="start" s={10.5} c={C.steel} />

      <Tag x={268} y={38}>Which test goes where</Tag>
      <Tb
        x={268}
        y={58}
        rh={17}
        cols={[{ w: 92 }, { w: 108 }]}
        rows={[
          ['Coil', 'pad to pad'],
          ['Insulation', 'pad to board'],
          ['Fast test', 'T to negative'],
        ]}
        head={false}
      />
      <Note x={268} y={118} s={10.5} lh={13} c={C.faint} lines={['Cell out for coil and insulation.', 'Polarity doesn’t matter on a coil.']} />

      <Pn x={262} y={150} w={206} h={136} t="Lead terminal, magnified" />
      <rect x={278} y={208} width={104} height={24} rx="2" fill={C.brassHi} />
      <path d="M382 220 L448 220" stroke={M.copper} strokeWidth="1.2" />
      <T x={414} y={212} a="middle" s={10} c={M.copper}>coil wire</T>
      <circle cx={316} cy={220} r={5} fill="none" stroke={C.emerald} strokeWidth="2" />
      <Verdict x={316} y={186} ok r={8} />
      <line x1={316} y1={195} x2={316} y2={214} stroke={C.emerald} />
      <circle cx={385} cy={220} r={5} fill="none" stroke={C.ruby} strokeWidth="2" />
      <Verdict x={385} y={186} ok={false} r={8} />
      <line x1={385} y1={195} x2={385} y2={214} stroke={C.ruby} />
      <T x={316} y={250} a="middle" s={10.5} c={C.dim}>on the pad</T>
      <T x={392} y={250} a="middle" s={10.5} c={C.dim}>on the end:</T>
      <T x={392} y={263} a="middle" s={10.5} c={C.ruby}>can break the wire</T>
    </F>
  )
}

function QmCoil() {
  const rows = [
    { n: 'ETA 955', a: 1.3, b: 1.8, t: '1.30–1.80' },
    { n: 'ETA 980.163', a: 1.45, b: 1.75, t: '1.45–1.75' },
    { n: 'Seiko 5M62', a: 1.7, b: 2.1, t: '1.7–2.1' },
    { n: 'Seiko 7T62 A', a: 1.7, b: 2.6, t: '1.70–2.60' },
    { n: 'Ronda 509', a: 1.9, b: 2.1, t: '1.90–2.10' },
    { n: 'Ronda 1062', a: 2.7, b: 2.9, t: '2.70–<2.90' },
    { n: 'Seiko 8F', a: 3.6, b: 4.0, t: '3.6–4.0' },
  ]
  const lab = 96
  const X = (v) => 14 + lab + ((v - 1) / 3.2) * (390 - lab)
  return (
    <F h={262} view="Chart · published coil resistance" scale="manufacturers’ sheets">
      <T x={X(2)} y={36} a="middle" s={10.5} c={C.brass}>Witschi: normally 1 to 3 kΩ</T>
      <Ranges x={14} y={46} w={390} min={1} max={4.2} rows={rows} rh={22} ticks={[1, 2, 3, 4]} band={[1, 3]} lab={lab} unit="kΩ" vx={466} />
      <line x1={X(2)} y1={42} x2={X(2)} y2={202} stroke={C.ruby} strokeWidth="1.4" strokeDasharray="4 3" />
      <T x={X(2) + 5} y={248} s={10.5} c={C.ruby}>a 2.0 kΩ reading: inside the 509, outside the 955</T>
    </F>
  )
}

function QmCurrent() {
  const x0 = 54, base = 134, s = 118
  const pulses = [0, 1, 2, 3].map((i) => x0 + 20 + i * s)
  return (
    <F h={282} view="Chart · current against time" scale="schematic, not to scale">
      <line x1={x0} y1={40} x2={x0} y2={base + 16} stroke={C.struct} />
      <line x1={x0} y1={base + 16} x2={466} y2={base + 16} stroke={C.struct} />
      <T x={46} y={52} a="end" s={10.5} c={C.faint}>µA</T>
      <T x={466} y={base + 30} a="end" s={10.5} c={C.faint}>1 s between pulses</T>
      <path
        d={`M${x0} ${base} ${pulses.map((p) => `L${p} ${base} L${p + 2} 50 L${p + 9} 50 L${p + 11} ${base}`).join(' ')} L466 ${base}`}
        fill="none"
        stroke={C.steel}
        strokeWidth="1.8"
      />
      <line x1={x0} y1={112} x2={466} y2={112} stroke={C.brass} strokeWidth="1.6" strokeDasharray="6 4" />
      <T x={322} y={92} s={10.5} c={C.brass}>average:</T>
      <T x={322} y={105} s={10.5} c={C.brass}>what the limit means</T>
      <T x={96} y={base + 12} s={10.5} c={C.dim}>IC: small and steady</T>
      <Lead p={[pulses[1] + 9, 62]} t={[pulses[1] + 28, 50]} text="motor pulse" a="start" s={10.5} />
      <Sep x1={14} y1={174} x2={466} y2={174} />
      <Tag x={14} y={192}>Seiko’s method</Tag>
      {[
        ['Cell out', ''],
        ['Connect', 'the tester'],
        ['Short AC', 'briefly'],
        ['Wait', '10 to 20 s'],
        ['Read it', 'block shaded'],
      ].map(([a, b], i) => {
        const x = 14 + i * 91
        return (
          <g key={a}>
            <Bx x={x} y={202} w={84} h={46} l={b ? [a, b] : [a]} s={10.5} lh={14} b={C.dim} c={i === 4 ? C.emerald : C.struct} />
            {i < 4 && <path d={`M${x + 85} 225 h5`} stroke={C.brass} strokeWidth="1.6" />}
          </g>
        )
      })}
      <T x={14} y={268} s={10.5} c={C.dim}>Light raises the reading, so shade the circuit block with black cloth while you measure.</T>
    </F>
  )
}

function QmHigh() {
  return (
    <F h={244} view="Decision · high current" scale="Seiko and Witschi logic">
      <Bx x={158} y={30} w={164} h={40} c={C.brass} l={['Running current over limit']} s={11} />
      <path d="M240 70 V88" stroke={C.brass} strokeWidth="1.6" markerEnd="url(#sk-a-brass)" />
      <Bx x={158} y={90} w={164} h={40} l={['Pull the stem, motor stops', 'read the IC alone']} s={10.5} b={C.dim} />
      <path d="M198 130 L118 156" stroke={C.emerald} strokeWidth="1.6" markerEnd="url(#sk-a-emerald)" />
      <path d="M282 130 L362 156" stroke={C.ruby} strokeWidth="1.6" markerEnd="url(#sk-a-ruby)" />
      <T x={140} y={136} a="middle" s={10.5} c={C.emerald}>normal</T>
      <T x={340} y={136} a="middle" s={10.5} c={C.ruby}>high</T>
      <Bx x={14} y={158} w={216} h={56} c={C.emerald} l={['Mechanical load', 'sticky train, hands touching lightly', 'clean and re-test']} s={10.5} b={C.dim} lh={14} />
      <Bx x={250} y={158} w={216} h={56} c={C.ruby} l={['Electronics', 'IC or coil with damaged insulation', 'change the module']} s={10.5} b={C.dim} lh={14} />
      <T x={240} y={234} a="middle" s={10.5} c={C.faint}>A date change or vibration raises the draw for a while. Wait, then read again.</T>
    </F>
  )
}

function QmLower() {
  const x0 = 56, Y = (v) => 44 + ((1.6 - v) / 0.5) * 140
  const down = [1.55, 1.45, 1.35, 1.3, 1.25, 1.2]
  const w = 36
  let d = `M${x0} ${Y(1.55)}`
  down.forEach((v, i) => {
    d += ` L${x0 + (i + 1) * w} ${Y(v)}`
    if (i < down.length - 1) d += ` L${x0 + (i + 1) * w} ${Y(down[i + 1])}`
  })
  const end = x0 + down.length * w
  const up = `M${end} ${Y(1.2)} L${end + 26} ${Y(1.2)} L${end + 26} ${Y(1.22)} L${end + 52} ${Y(1.22)}`
  return (
    <F h={290} view="Chart · supply voltage" scale="schematic, wait at each step">
      <line x1={x0} y1={36} x2={x0} y2={194} stroke={C.struct} />
      <line x1={x0} y1={194} x2={340} y2={194} stroke={C.struct} />
      {[1.55, 1.3, 1.2].map((v) => (
        <g key={v}>
          <line x1={x0 - 4} y1={Y(v)} x2={340} y2={Y(v)} stroke={C.line} strokeWidth="0.6" />
          <T x={x0 - 8} y={Y(v) + 4} a="end" s={10} mono>{v.toFixed(2)} V</T>
        </g>
      ))}
      <path d={d} fill="none" stroke={C.steel} strokeWidth="2" />
      <path d={up} fill="none" stroke={C.brass} strokeWidth="2" />
      <Lead p={[x0 + 4 * w, Y(1.3)]} t={[190, 72]} text="warning starts" a="start" s={10.5} />
      <T x={194} y={90} s={10} c={C.faint}>can lag 60 s or more</T>
      <Lead p={[end, Y(1.2)]} t={[220, 182]} text="hands stop" a="end" s={10.5} c={C.ruby} />
      <Lead p={[end + 50, Y(1.22)]} t={[344, 122]} text="restart: record it" a="end" s={10.5} c={C.brass} />
      <T x={196} y={208} a="middle" s={10.5} c={C.faint}>time, about a minute or more per step</T>
      <Pn x={352} y={28} w={116} h={168} t="Fast test" c={C.emerald} tc={C.emerald} />
      <Note x={362} y={62} s={10.5} lh={14} lines={['ETA 955: bridge', 'T to negative.']} />
      <T x={362} y={110} s={16} c={C.text} mono w={700}>8</T>
      <T x={380} y={110} s={10.5} c={C.dim}>steps a sec</T>
      <T x={362} y={124} s={10} c={C.faint}>at 1.55 V</T>
      <T x={362} y={156} s={16} c={C.text} mono w={700}>32</T>
      <T x={390} y={156} s={10.5} c={C.dim}>steps a sec</T>
      <T x={362} y={170} s={10} c={C.faint}>at or below 1.30 V</T>
      <Sep x1={14} y1={224} x2={466} y2={224} />
      <T x={14} y={244} s={11} c={C.text}>ETA 251.264 chronograph: warns at 1.38 V, after a 60 minute delay.</T>
      <T x={14} y={260} s={10.5} c={C.dim}>A marginal cell can look fine for an hour, so don’t pass it after a quick look.</T>
      <T x={14} y={276} s={10.5} c={C.dim}>Witschi says to expect about 1.2 V for the stop on a silver-oxide movement.</T>
    </F>
  )
}

function QmTicks() {
  const x0 = 150, step = 26
  const rows = [
    ['Normal', 'one step a second', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], C.emerald],
    ['ETA 955, F06', '4 steps every 4 s', [0, 0.12, 0.24, 0.36, 4, 4.12, 4.24, 4.36, 8, 8.12, 8.24, 8.36], C.brass],
    ['Ronda 1063, 1064, 1069', 'stops 4 s, 4 quick steps', [3.4, 3.55, 3.7, 3.85, 7.4, 7.55, 7.7, 7.85, 11.4, 11.55, 11.7, 11.85], C.brass],
    ['Citizen, Epson, Seiko 5M', 'moves every 2 s', [0, 2, 4, 6, 8, 10], C.steel],
  ]
  return (
    <F h={254} view="Timeline · twelve seconds of the seconds hand" scale="schematic">
      {Array.from({ length: 13 }, (_, i) => (
        <g key={i}>
          <line x1={x0 + i * step} y1={34} x2={x0 + i * step} y2={200} stroke={C.line} strokeWidth="0.6" />
          {i % 2 === 0 && <T x={x0 + i * step} y={214} a="middle" s={10} mono>{i}s</T>}
        </g>
      ))}
      {rows.map(([n, sub, ts, c], i) => {
        const y = 46 + i * 40
        return (
          <g key={n}>
            <T x={14} y={y + 8} s={11} c={C.text}>{n}</T>
            <T x={14} y={y + 22} s={10} c={C.faint}>{sub}</T>
            {ts.map((t, j) => <rect key={j} x={x0 + t * step - 1} y={y} width={2.6} height={22} fill={c} />)}
          </g>
        )
      })}
      <T x={14} y={236} s={11} c={C.text}>4 seconds usually means change the cell. 2 seconds usually means charge it.</T>
    </F>
  )
}

function QmGate() {
  const x0 = 40, per = 130
  const y0 = 110
  let d = `M${x0} ${y0 + 30}`
  for (let i = 0; i < 3; i++) d += ` L${x0 + (i + 1) * per - 3} ${y0 - 34} L${x0 + (i + 1) * per} ${y0 + 30}`
  return (
    <F h={248} view="Chart · rate through an inhibition cycle" scale="schematic">
      <line x1={x0} y1={y0} x2={440} y2={y0} stroke={C.struct} />
      <T x={x0 - 6} y={y0 + 4} a="end" s={10} mono>0</T>
      <T x={x0 - 6} y={y0 - 34} a="end" s={10} mono>+</T>
      <T x={x0 - 6} y={y0 + 40} a="end" s={10} mono>−</T>
      <path d={d} fill="none" stroke={C.steel} strokeWidth="1.8" />
      <rect x={x0 + 60} y={60} width={50} height={100} fill="rgba(194,88,99,0.14)" stroke={C.ruby} />
      <T x={x0 + 85} y={54} a="middle" s={10.5} c={C.ruby}>short gate</T>
      <T x={x0 + 85} y={174} a="middle" s={10.5} c={C.ruby}>false plus</T>
      <rect x={x0 + per} y={60} width={per} height={100} fill="rgba(123,165,131,0.12)" stroke={C.emerald} />
      <T x={x0 + per * 1.5} y={54} a="middle" s={10.5} c={C.emerald}>full gate</T>
      <T x={x0 + per * 1.5} y={174} a="middle" s={10.5} c={C.emerald}>true average</T>
      <Lead p={[x0 + per * 3 - 2, y0 - 30]} t={[446, 52]} text="correction" a="end" s={10.5} />
      <Tb
        x={14}
        y={198}
        rh={16}
        cols={[{ w: 150 }, { w: 150 }, { w: 152 }]}
        head={false}
        rows={[
          [{ t: 'Typical periods', c: C.faint }, { t: 'Seiko VK63 family', c: C.faint }, { t: 'Miyota DFC', c: C.faint }],
          ['60 s or 10 s, up to 960 s', { t: '10-second gate', c: C.text }, { t: '10 s or a whole multiple', c: C.text }],
        ]}
      />
    </F>
  )
}

function QmSequence() {
  const st = [
    ['1 Look', ['crown seam,', 'hands, date, train']],
    ['2 Coil', ['resistance and', 'insulation, cell out']],
    ['3 Current', ['and rate,', 'on the supply']],
    ['4 Minimum', ['voltage,', 'step it down']],
  ]
  return (
    <F h={214} view="Sequence · testing an open watch" scale="Witschi’s order">
      {st.map(([h, l], i) => {
        const x = 14 + i * 116
        return (
          <g key={h}>
            <Bx x={x} y={34} w={102} h={72} l={[h, ...l]} s={10.5} lh={15} b={C.dim} c={C.brass} />
            {i < 3 && <path d={`M${x + 103} 70 h12`} stroke={C.brass} strokeWidth="1.8" markerEnd="url(#sk-a-brass)" />}
            {i > 0 && <path d={`M${x + 51} 106 V136`} stroke={C.ruby} strokeWidth="1.4" markerEnd="url(#sk-a-ruby)" />}
          </g>
        )
      })}
      <rect x={120} y={138} width={346} height={28} rx="6" fill="rgba(194,88,99,0.1)" stroke={C.ruby} />
      <T x={293} y={156} a="middle" s={11} c={C.text}>Out of tolerance at any stage: change the movement</T>
      <T x={14} y={190} s={11} c={C.dim}>Write beside each reading: calibre, sheet revision, room temperature, instrument.</T>
      <T x={14} y={205} s={10.5} c={C.faint}>All four pass: refit the cell and reassemble.</T>
    </F>
  )
}


/* ------------------------------------------------------------------ */
/* Lesson: zero a quartz chronograph                                    */
/* ------------------------------------------------------------------ */
function QzJobs() {
  const lane = (y, c, sym, job, how) => (
    <g>
      <Bx x={96} y={y} w={132} h={64} l={sym} s={10.5} lh={14} tc={C.text} />
      <path d={`M229 ${y + 32} h22`} stroke={c} strokeWidth="1.8" markerEnd={`url(#sk-a-${c === C.brass ? 'brass' : 'steel'})`} />
      <Bx x={254} y={y} w={102} h={64} l={job} c={c} s={10.5} lh={14} />
      <path d={`M357 ${y + 32} h12`} stroke={c} strokeWidth="1.8" />
      <Note x={374} y={y + 28} s={10.5} lh={14} lines={how} />
    </g>
  )
  return (
    <F h={214} view="Decision · which job is it?" scale="reasoned rule of thumb">
      <T x={162} y={38} a="middle" s={10.5} c={C.faint}>Symptom</T>
      <T x={305} y={38} a="middle" s={10.5} c={C.faint}>Job</T>
      <T x={374} y={38} s={10.5} c={C.faint}>Done with</T>
      {/* IC with scrambled data */}
      <rect x={28} y={60} width={44} height={44} fill="#1e1c1b" stroke={C.dim} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <line x1={22} y1={67 + i * 10} x2={28} y2={67 + i * 10} stroke={C.dim} />
          <line x1={72} y1={67 + i * 10} x2={78} y2={67 + i * 10} stroke={C.dim} />
        </g>
      ))}
      <T x={50} y={86} a="middle" s={12} mono c={C.ruby}>?#!</T>
      {lane(50, C.steel, ['Functions misbehave', 'after a cell change'], ['Clear the IC', 'system reset'], ['AC contact', 'or buttons'])}
      <Face cx={50} cy={160} r={26} hand={14} />
      {lane(128, C.brass, ['Chronograph runs,', 'but a hand stops', 'off zero'], ['Re-index', 'the hand'], ['crown and', 'pushers'])}
    </F>
  )
}

function QzPoints() {
  const u = 46 / 70
  const panel = (x, y, title, sub, lines, tgt) => {
    const cx = x + 56, cy = y + 62
    const ac = [cx - 4 * u, cy + 22 * u]
    const t = [cx + tgt[0] * u, cy + tgt[1] * u]
    return (
      <g>
        <Pn x={x} y={y} w={224} h={124} />
        <QMove cx={cx} cy={cy} r={46} stem={false} screws={false} />
        <rect x={ac[0] - 4} y={ac[1] - 4} width={8} height={8} fill={C.brassHi} stroke={M.ink} />
        <circle cx={t[0]} cy={t[1]} r={4.4} fill="none" stroke={C.emerald} strokeWidth="2" />
        <line x1={ac[0]} y1={ac[1]} x2={t[0]} y2={t[1]} stroke={C.text} strokeWidth="1.8" strokeDasharray="4 2" />
        <T x={x + 114} y={y + 22} s={11} c={C.text} w={600}>{title}</T>
        <T x={x + 114} y={y + 37} s={10} c={C.brass}>{sub}</T>
        <Note x={x + 114} y={y + 56} s={10} lh={13} c={C.dim} lines={lines} />
      </g>
    )
  }
  return (
    <F h={316} view="Plan · four AC reset points" scale="generic module">
      {panel(12, 28, 'Circuit cover', 'AC to cover', ['7T22, 7T24, 7T27,', '7T32, 7T34, 7T36,', '7T42, 5T and 6M', 'families listed'], [20, -44])}
      {panel(244, 28, 'Battery clamp', 'AC to clamp, twice', ['8M family,', 'V691 to V694'], [46, 4])}
      {panel(12, 158, 'Switch spring', 'AC to spring', ['H601, H801, V011,', 'V041, V051,', 'VK63, VK67, VK83,', 'VD53B'], [-44, 30])}
      {panel(244, 158, 'Cell’s plus face', 'AC to (+), over 3 s', ['Seiko 8F family,', 'crown in'], [26, 30])}
      <rect x={14} y={292} width={8} height={8} fill={C.brassHi} stroke={M.ink} />
      <T x={27} y={300} s={10.5} c={C.dim}>AC terminal</T>
      <circle cx={112} cy={296} r={4.4} fill="none" stroke={C.emerald} strokeWidth="2" />
      <T x={122} y={300} s={10.5} c={C.dim}>named point. Positions are illustrative: use your guide.</T>
    </F>
  )
}

function QzShort() {
  return (
    <F h={262} view="Detail · shorting AC" scale="schematic, magnified">
      <Pn x={12} y={28} w={286} h={196} />
      <rect x={24} y={64} width={262} height={148} rx="4" fill={M.board} />
      <rect x={60} y={150} width={18} height={18} fill={C.brassHi} stroke={M.ink} />
      <T x={69} y={186} a="middle" s={11} c={C.text} w={600}>AC</T>
      <circle cx={190} cy={164} r={12} fill="#c5ced4" stroke={M.ink} />
      <T x={190} y={194} a="middle" s={10.5} c={C.text}>named point</T>
      {/* tweezers joining */}
      <path d="M69 158 L126 62" stroke={C.steel} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M190 162 L136 62" stroke={C.steel} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M126 62 Q131 42 136 62" fill="none" stroke={C.steel} strokeWidth="3.4" />
      {/* coil keep-out */}
      <rect x={196} y={82} width={78} height={22} rx="3" fill={M.copper} stroke="#7d4d24" />
      <rect x={186} y={72} width={98} height={42} rx="6" fill="rgba(194,88,99,0.12)" stroke={C.ruby} strokeDasharray="4 3" />
      <T x={235} y={128} a="middle" s={10.5} c={C.ruby}>coil: keep clear</T>
      <Tag x={20} y={43}>Metal tweezers join two points</Tag>
      <Tag x={312} y={42}>Hold time</Tag>
      <Tb
        x={312}
        y={62}
        rh={18}
        head={false}
        cols={[{ w: 90 }, { w: 66 }]}
        rows={[
          ['Epson VS75B', { t: 'over 2 s', c: C.brass }],
          ['Seiko 8F', { t: 'over 3 s', c: C.brass }],
          ['Others', 'see the sheet'],
        ]}
      />
      <Sep x1={312} y1={120} x2={468} y2={120} />
      <Tag x={312} y={138}>Tool for each job</Tag>
      <Note x={312} y={158} s={10.5} lh={15} lines={['Cell out or in: plastic', 'AC short: metal', 'Swap on purpose,', 'never out of habit.']} />
      <T x={14} y={244} s={11} c={C.dim}>If nothing happens, re-check the two points and the cell.</T>
      <T x={14} y={258} s={10.5} c={C.ruby}>Don’t try other points to see what happens.</T>
    </F>
  )
}

function QzVd53() {
  const st = [
    [42, 'Pull to the second click.', []],
    [74, 'Hold A and B over 2 s.', ['The stopwatch second hand moves', 'and comes back: you’re in the mode.']],
    [130, 'Press A or B to zero the hands.', ['The guide’s pages disagree on', 'direction, so press once and watch.']],
    [186, 'Set the time.', []],
    [216, 'Push the crown in.', []],
  ]
  return (
    <F h={246} view="Procedure · Seiko VD53B" scale="schematic">
      <Face cx={98} cy={126} r={72} push crown={16} hand={0} subs={[[0, 36, 14], [-36, 0, 14]]} />
      <T x={176} y={64} s={13} c={C.brass} w={700}>A</T>
      <T x={176} y={198} s={13} c={C.brass} w={700}>B</T>
      <Lead p={[188, 124]} t={[196, 158]} text="crown out" a="start" s={10.5} sub="second click" />
      {st.map(([y, a, sub], i) => (
        <g key={a}>
          <Num x={276} y={y} n={i + 1} r={8} />
          <T x={289} y={y + 4} s={11} c={C.text}>{a}</T>
          {sub.map((l, j) => (
            <T key={l} x={289} y={y + 18 + j * 13} s={10} c={C.faint}>{l}</T>
          ))}
        </g>
      ))}
    </F>
  )
}

function Qz5040() {
  return (
    <F h={264} view="Procedure · Ronda 5040.D" scale="schematic">
      <Face cx={100} cy={136} r={72} push crown={26} hand={0} subs={[[0, 38, 15], [-38, 0, 15]]} />
      <T x={178} y={74} s={13} c={C.brass} w={700}>A</T>
      <T x={178} y={208} s={13} c={C.brass} w={700}>B</T>
      <Num x={112} y={94} n={1} r={8} />
      <Num x={100} y={152} n={2} r={8} c={C.steel} />
      <Num x={62} y={118} n={3} r={8} c={C.steel} />
      <Lead p={[198, 134]} t={[204, 104]} text="position III" a="start" s={10.5} />
      <Tag x={276} y={38}>Enter the mode</Tag>
      <Note x={276} y={56} s={10.5} lh={14} lines={['Hold A and B for at least 2 s,', 'until the seconds counter turns', '360°. One manual copy says 3 s,', 'so allow the longer press.']} />
      <Tag x={276} y={126}>Hand order, B moves on</Tag>
      <Tb
        x={276}
        y={144}
        rh={16}
        head={false}
        cols={[{ w: 20 }, { w: 170 }]}
        rows={[
          [{ t: '1', c: C.brass }, 'Second counter'],
          [{ t: '2', c: C.steel }, '1/10 s counter at 6'],
          [{ t: '3', c: C.steel }, 'Minute counter at 9'],
        ]}
      />
      <Tag x={276} y={204}>Moving a hand</Tag>
      <Note x={276} y={222} s={10.5} lh={14} lines={['A short: one step. A long: runs.', 'Then crown back to position I.']} />
    </F>
  )
}

function QzTable() {
  return (
    <F h={214} view="Table · zero routines by calibre" scale="makers’ manuals">
      <Tb
        x={14}
        y={40}
        rh={21}
        s={10.5}
        cols={[{ w: 96 }, { w: 84 }, { w: 272 }]}
        rows={[
          ['Calibre', 'Crown', 'Buttons'],
          ['ETA 251.264', 'position 2', 'A selects the hand, B moves it'],
          ['Miyota 0S20', '2nd position', 'A to zero. Wait for the hand, then push in'],
          ['Citizen H50x', 'time position', 'Hold B 3 s or more, B to 12, then A confirms'],
          ['Citizen E21x', '2nd click', 'B and C together, at Level 2 charge or above'],
          ['Epson VS75B', '2nd click', '2H for 2 s, 4H sets. 2H again, 4H sets 1/5 s'],
          ['Seiko VD53B', '2nd click', 'A and B over 2 s, then A or B'],
          ['Ronda 5040.D', 'position III', 'A and B at least 2 s, A moves, B next hand'],
        ]}
      />
      <T x={14} y={206} s={10.5} c={C.faint}>Short press = one step, long press = run, wherever the sheet offers both.</T>
    </F>
  )
}

function QzVerify() {
  const row = (y, hands, ok, a, b) => (
    <g>
      {hands.map((h, i) => (
        <g key={i}>
          <Face cx={58 + i * 84} cy={y} r={32} hand={h} />
          <T x={58 + i * 84} y={y + 52} a="middle" s={10} c={C.faint}>run {i + 1}</T>
        </g>
      ))}
      <Verdict x={300} y={y - 18} ok={ok} r={8} />
      <T x={316} y={y - 14} s={11} c={C.text} w={600}>{a}</T>
      <Note x={290} y={y + 6} s={10.5} lh={14} lines={b} />
    </g>
  )
  return (
    <F h={262} view="Comparison · after three runs" scale="schematic">
      {row(72, [12, 12, 12], true, 'Same miss each time', ['It’s a setting. Repeat the', 'zero routine once.'])}
      <Sep x1={14} y1={136} x2={466} y2={136} />
      {row(188, [12, -18, 30], false, 'Different miss each time', ['It’s a fault. Check the cell,', 'then dirt or a loose wheel.'])}
    </F>
  )
}


/* ------------------------------------------------------------------ */
/* Lesson: replace a solar or Kinetic storage cell                      */
/* ------------------------------------------------------------------ */
function QcTypes() {
  const cell = (cx, tab, c) => (
    <g>
      <circle cx={cx} cy={92} r={36} fill="url(#qk-cell)" stroke="#4e5f6a" />
      {tab}
      <circle cx={cx} cy={92} r={46} fill="none" stroke={c} strokeDasharray="3 3" />
    </g>
  )
  return (
    <F h={252} view="Comparison · three look-alike parts" scale="tab shapes are illustrative">
      <Pn x={12} y={28} w={148} h={176} t="Silver-oxide" c={C.ruby} tc={C.ruby} />
      <Pn x={166} y={28} w={148} h={176} t="Rechargeable" c={C.emerald} tc={C.emerald} />
      <Pn x={320} y={28} w={148} h={176} t="Capacitor" c={C.brass} tc={C.brass} />
      {cell(86, null, C.ruby)}
      <T x={86} y={97} a="middle" s={12} c="#2b343a" w={700}>SR</T>
      {cell(240, <path d="M240 92 L286 92 L286 112 L298 112" fill="none" stroke={C.brassHi} strokeWidth="5" />, C.emerald)}
      {cell(394, <path d="M394 92 L440 92 L440 72 L452 72" fill="none" stroke={C.brassHi} strokeWidth="5" />, C.brass)}
      <Note x={86} y={156} a="middle" s={10.5} lh={14} lines={['primary cell,', 'can’t be recharged']} />
      <T x={86} y={194} a="middle" s={10.5} c={C.ruby}>never in these watches</T>
      <Note x={240} y={156} a="middle" s={10.5} lh={14} lines={['Seiko 5M6 unit,', 'titanium lithium ion']} />
      <T x={240} y={194} a="middle" s={10.5} c={C.emerald}>5M6 only</T>
      <Note x={394} y={156} a="middle" s={10.5} lh={14} lines={['Seiko 5M4 unit,', 'a different type']} />
      <T x={394} y={194} a="middle" s={10.5} c={C.brass}>5M4 only</T>
      <T x={14} y={224} s={11} c={C.text}>Seiko’s tell: the shape of the minus lead terminal. Compare yours with the guide.</T>
      <T x={14} y={241} s={10.5} c={C.dim}>Citizen: a conventional battery in place of the rechargeable cell can damage the watch.</T>
    </F>
  )
}

function QcCharge() {
  const x0 = 124, W = 330
  const X = (m) => x0 + (Math.log10(m) / Math.log10(7200)) * W
  const rows = [
    ['Sun', '100,000 lx', 2, 17, 660],
    ['Cloudy', '10,000 lx', 11, 120, 2100],
    ['Lamp at 20 cm', '3,000 lx', 40, 420, 7200],
    ['Indoors', '500–700 lx', 240, 3000, null],
  ]
  return (
    <F h={262} view="Chart · Citizen E168 charging times" scale="log time scale">
      {[[1, '1 min'], [10, '10 min'], [60, '1 h'], [600, '10 h'], [6000, '100 h']].map(([m, l]) => (
        <g key={l}>
          <line x1={X(m)} y1={34} x2={X(m)} y2={194} stroke={C.line} strokeWidth="0.7" />
          <T x={X(m)} y={208} a="middle" s={10} mono>{l}</T>
        </g>
      ))}
      {rows.map(([n, lx, a, b, c], i) => {
        const y = 52 + i * 38
        return (
          <g key={n}>
            <T x={14} y={y} s={11} c={C.text}>{n}</T>
            <T x={14} y={y + 13} s={10} c={C.faint}>{lx}</T>
            <line x1={X(a)} y1={y - 2} x2={X(c || b)} y2={y - 2} stroke={C.struct} strokeWidth="1.4" />
            <circle cx={X(a)} cy={y - 2} r={5} fill={C.steel} />
            <rect x={X(b) - 5} y={y - 7} width={10} height={10} fill={C.brass} />
            {c && <path d={`M${X(c)} ${y - 9} l6.5 12 h-13 Z`} fill={C.emerald} />}
          </g>
        )
      })}
      <circle cx={24} cy={230} r={5} fill={C.steel} />
      <T x={34} y={234} s={10.5} c={C.dim}>one day’s running</T>
      <rect x={150} y={225} width={10} height={10} fill={C.brass} />
      <T x={165} y={234} s={10.5} c={C.dim}>starts normally</T>
      <path d="M284 224 l6.5 12 h-13 Z" fill={C.emerald} />
      <T x={297} y={234} s={10.5} c={C.dim}>full charge</T>
      <T x={14} y={254} s={10.5} c={C.ruby}>Keep below about 60 °C, and an incandescent lamp at least 50 cm away.</T>
    </F>
  )
}

function QcSwing() {
  return (
    <F h={236} view="Method · Seiko’s swing charge" scale="schematic">
      <path d="M60 86 A130 130 0 0 0 300 86" fill="none" stroke={C.brass} strokeWidth="2" strokeDasharray="6 4" markerEnd="url(#sk-a-brass)" markerStart="url(#sk-a-brass)" />
      <Face cx={60} cy={82} r={22} hand={40} />
      <G o={0.35}><Face cx={180} cy={138} r={22} hand={40} /></G>
      <Face cx={300} cy={82} r={22} hand={40} />
      <Dim a={[60, 46]} b={[300, 46]} text="about 20 cm" off={0} />
      <T x={180} y={194} a="middle" s={11} c={C.text}>side to side, 2 to 3 swings a second</T>
      <Pn x={344} y={28} w={124} h={160} t="Count" />
      <T x={356} y={66} s={18} mono c={C.brass} w={700}>250</T>
      <Note x={356} y={82} s={10.5} lh={13} lines={['from stopped: one-', 'second motion, about', 'a day of power']} />
      <T x={356} y={144} s={14} mono c={C.steel} w={700}>200–250</T>
      <Note x={356} y={160} s={10.5} lh={13} lines={['once running: up to', 'about a day more']} />
      <T x={14} y={212} s={11} c={C.dim}>Wait 10 to 15 minutes before trusting the power-reserve button, or it reads high.</T>
      <T x={14} y={227} s={10.5} c={C.faint}>Sweep: 5 s, 1–7 days. 10 s, up to a month. 20 s, about a month. 30 s, 4–6 months.</T>
    </F>
  )
}

function QcGen() {
  const chip = (x, y, v, c) => (
    <g>
      <rect x={x} y={y} width={62} height={28} rx="4" fill="#b7c9b5" stroke={c || C.struct} />
      <T x={x + 31} y={y + 19} a="middle" s={14} mono c="#16302a" w={700}>{v}</T>
    </g>
  )
  const row = (y, a, b, rise, ok) => (
    <g>
      {chip(18, y, a)}
      <path d={`M84 ${y + 14} h20`} stroke={C.brass} strokeWidth="1.8" markerEnd="url(#sk-a-brass)" />
      <Bx x={108} y={y - 3} w={96} h={34} l={['close the back', 'swing × 200']} s={10} lh={12.5} b={C.text} tc={C.text} />
      <path d={`M206 ${y + 14} h20`} stroke={C.brass} strokeWidth="1.8" markerEnd="url(#sk-a-brass)" />
      {chip(230, y, b)}
      <T x={302} y={y + 12} s={11} c={ok ? C.emerald : C.ruby} mono w={700}>{rise}</T>
      <T x={302} y={y + 26} s={10.5} c={C.dim}>{ok ? 'over 0.06 V: generator works' : 'under 0.06 V: suspect generator'}</T>
    </g>
  )
  return (
    <F h={206} view="Sequence · generator test" scale="Seiko 5M62, sample readings">
      <T x={49} y={40} a="middle" s={10.5} c={C.faint}>first read</T>
      <T x={261} y={40} a="middle" s={10.5} c={C.faint}>within 3 min</T>
      {row(50, '0.62', '0.71', '+ 0.09 V', true)}
      {row(100, '0.62', '0.64', '+ 0.02 V', false)}
      <Sep x1={14} y1={144} x2={466} y2={144} />
      <Note x={14} y={164} s={11} lh={16} lines={['This test assumes a start of 0.5 to 1.0 V. Outside that, charge first and repeat.', 'If the probe shorts the lead to the clamp, wait 10 minutes, then read again.']} />
    </F>
  )
}

function QcVerdict() {
  const plot = (x, title, c, d, a, b, note) => (
    <g>
      <Pn x={x} y={28} w={148} h={188} t={title} c={c} tc={c} />
      <line x1={x + 16} y1={50} x2={x + 16} y2={124} stroke={C.struct} />
      <line x1={x + 16} y1={124} x2={x + 138} y2={124} stroke={C.struct} />
      <T x={x + 20} y={56} s={10} c={C.faint}>V</T>
      <T x={x + 138} y={136} a="end" s={10} c={C.faint}>time</T>
      <path d={d} fill="none" stroke={c} strokeWidth="2.2" />
      <T x={x + 74} y={156} a="middle" s={11} c={C.text} w={600}>{a}</T>
      <Note x={x + 74} y={172} a="middle" s={10.5} lh={13} lines={b} />
      {note && <T x={x + 74} y={208} a="middle" s={10} c={C.faint}>{note}</T>}
    </g>
  )
  return (
    <F h={248} view="Chart · three Kinetic results" scale="schematic curves">
      {plot(12, 'Tired cell', C.ruby, 'M28 112 Q46 64 66 62 Q78 62 88 104 Q100 118 148 118', 'Replace the cell', ['rises, then', 'collapses fast'], 'Seiko’s guide')}
      {plot(166, 'Generator', C.brass, 'M182 104 L304 102', 'Suspect the generator', ['no rise after', '200 swings'], 'Seiko’s guide')}
      {plot(320, 'Circuit or motor', C.steel, 'M336 70 L458 72', 'Suspect circuit or motor', ['voltage normal,', 'hands don’t move'], 'reasoned')}
      <T x={14} y={236} s={10.5} c={C.dim}>On a supply, a 5M62 stays under 0.80 µA, and the block alone under 0.20 µA.</T>
    </F>
  )
}

function QcSolar() {
  return (
    <F h={232} view="Logic · solar cell or module?" scale="reasoned, not a Citizen method">
      <Bx x={14} y={38} w={100} h={46} c={C.brass} l={['Bench supply', 'sheet’s voltage']} s={10.5} lh={14} b={C.dim} />
      <path d="M116 54 H156" stroke={C.ruby} strokeWidth="2" />
      <path d="M116 72 H156" stroke={C.faint} strokeWidth="2" />
      <QMove cx={192} cy={66} r={36} cell={false} screws={false} stem={false} />
      <T x={192} y={118} a="middle" s={10.5} c={C.dim}>cell out, charged first</T>
      <path d="M232 62 H284" stroke={C.brass} strokeWidth="1.8" markerEnd="url(#sk-a-brass)" />
      <Bx x={288} y={40} w={178} h={44} l={['Does it run on the supply?']} s={11} c={C.brass} />
      <path d="M340 86 L252 144" stroke={C.emerald} strokeWidth="1.6" markerEnd="url(#sk-a-emerald)" />
      <path d="M410 86 L410 144" stroke={C.ruby} strokeWidth="1.6" markerEnd="url(#sk-a-ruby)" />
      <T x={306} y={118} s={10.5} c={C.emerald}>yes</T>
      <T x={416} y={118} s={10.5} c={C.ruby}>no</T>
      <Bx x={120} y={146} w={170} h={44} c={C.emerald} l={['Cell is suspect', 'runs on supply, not on its cell']} s={10.5} lh={14} b={C.dim} />
      <Bx x={330} y={146} w={136} h={44} c={C.ruby} l={['Module is suspect', 'change the module']} s={10.5} lh={14} b={C.dim} />
      <T x={14} y={214} s={10.5} c={C.dim}>Citizen tells owners not to remove the cell, and its cell numbers aren’t confirmed here.</T>
    </F>
  )
}

function QcParts() {
  return (
    <F h={264} view="Ranking · whose part number to trust" scale="report’s evidence order">
      {[
        [C.emerald, 'Maker’s guide', 'Seiko: 3023 44Z for 5M62, 5M63', 1],
        [C.brass, 'Retailer data', '3023 24T, 3023 5MY', 2],
        [C.ruby, 'Marketplace title', 'disagrees with both: ignore', 3],
      ].map(([c, a, b, n]) => (
        <g key={a}>
          <rect x={14} y={30 + (n - 1) * 34} width={30 + (4 - n) * 56} height={28} rx="4" fill={c} opacity="0.26" stroke={c} />
          <T x={24} y={49 + (n - 1) * 34} s={11} c={C.text} w={600}>{n}. {a}</T>
          <T x={228} y={49 + (n - 1) * 34} s={10.5} c={C.dim}>{b}</T>
        </g>
      ))}
      <Sep x1={14} y1={138} x2={466} y2={138} />
      <Tb
        x={14}
        y={158}
        rh={18}
        cols={[{ w: 124 }, { w: 90 }, { w: 120 }, { w: 118 }]}
        rows={[
          ['Part', 'Voltage', 'Size', 'Source'],
          ['Epson 3023 34T', '1.5 V', 'Ø 9.5 × 2.05 mm', 'Epson spec'],
          ['Panasonic MT920', '1.5 V', 'Ø 9.5 × 2.0 mm', 'Panasonic'],
          ['Panasonic MT621', '1.5 V', 'Ø 6.8 × 2.1 mm', 'Panasonic'],
        ]}
      />
      <T x={14} y={246} s={10.5} c={C.dim}>Similar diameters don’t make two parts the same. Check the number against the guide.</T>
    </F>
  )
}

function QcFit() {
  return (
    <F h={246} view="Section · Epson VS75B cell" scale="schematic">
      <rect x={40} y={140} width={300} height={34} fill="url(#qk-mov)" stroke={C.struct} />
      <T x={190} y={162} a="middle" s={10.5} c={C.text}>movement</T>
      <rect x={120} y={122} width={140} height={14} rx="2" fill="url(#qk-cell)" stroke="#4e5f6a" />
      <T x={190} y={133} a="middle" s={10} c="#2b343a" w={600}>– out, + in</T>
      <path d="M120 118 L268 118 L290 138" fill="none" stroke={C.brassHi} strokeWidth="3" />
      <rect x={282} y={134} width={32} height={6} fill={C.emerald} />
      <rect x={110} y={100} width={160} height={8} rx="1.5" fill="#c5ced4" stroke="#55646e" />
      {[136, 190, 244].map((x) => (
        <g key={x}>
          <rect x={x - 5} y={84} width={10} height={6} fill="#c5ced4" stroke="#55646e" strokeWidth="0.5" />
          <Arrow a={[x, 80]} b={[x, 56]} c="brass" w={1.6} />
        </g>
      ))}
      <T x={190} y={46} a="middle" s={10.5} c={C.brass}>three clamp screws out first</T>
      <Lead p={[150, 104]} t={[60, 88]} text="clamp" a="end" s={10.5} />
      <Lead p={[298, 137]} t={[352, 116]} text="minus pattern" a="start" s={10.5} c={C.emerald} />
      <Lead p={[270, 120]} t={[352, 88]} text="lead plate" a="start" s={10.5} c={C.brassHi} />
      <Lead p={[190, 136]} t={[352, 150]} text="plus side faces in" a="start" s={10.5} c={C.brass} />
      <Arrow a={[20, 118]} b={[20, 170]} c="steel" />
      <T x={14} y={190} s={10.5} c={C.steel}>inside of the watch</T>
      <Sep x1={14} y1={204} x2={466} y2={204} />
      <T x={14} y={224} s={11} c={C.text}>That’s the opposite of what a normal battery trains your hands to do.</T>
      <T x={14} y={239} s={10.5} c={C.dim}>Check against your photo. If the clamp won’t sit flat, the cell isn’t seated.</T>
    </F>
  )
}

function QcReset() {
  const st = [
    ['AC to clamp', ['over 2 s']],
    ['Pattern B to clamp', ['over 2 s, at the', 'second click']],
    ['Charge fully', ['before judging', 'the work']],
    ['Log it', ['date, cell number,', 'reserve check']],
  ]
  return (
    <F h={238} view="Sequence · after a new cell" scale="Epson VS75B example">
      {st.map(([h, l], i) => {
        const x = 14 + i * 116
        return (
          <g key={h}>
            <Bx x={x} y={34} w={102} h={72} l={[h, ...l]} s={10.5} lh={15} b={C.dim} c={i < 2 ? C.brass : C.struct} />
            {i < 3 && <path d={`M${x + 103} 70 h12`} stroke={C.brass} strokeWidth="1.8" markerEnd="url(#sk-a-brass)" />}
          </g>
        )
      })}
      <T x={72} y={122} a="middle" s={10} c={C.faint}>clears the IC</T>
      <T x={188} y={122} a="middle" s={10} c={C.faint}>fixes rotor polarity</T>
      <Pn x={14} y={134} w={452} h={90} t="Don’t top up a loose cell on a bench supply" c={C.ruby} tc={C.ruby} />
      <Note x={26} y={168} s={10.5} lh={15} lines={['Panasonic’s guaranteed charge window for MT cells is 1.8 to 2.6 V.', 'It also forbids trickle charging.', 'Citizen E168: All Reset follows charging from complete discharge.']} />
    </F>
  )
}


/* ------------------------------------------------------------------ */
/* Lesson: read a case and open it                                      */
/* ------------------------------------------------------------------ */
function CoAnatomy() {
  const cx = 226, y = 96, R = 170
  return (
    <F h={236} view="Section · a typical case" scale="schematic">
      <CaseSec cx={cx} y={y} R={R} />
      <Lead p={[cx - 40, y - 12]} t={[172, 40]} text="crystal" />
      <Lead p={[cx - R + 24, y - 12]} t={[52, 64]} text="bezel" />
      <Lead p={[cx - R + 44, y - 10]} t={[98, 40]} text="crystal gasket" c={C.brassHi} />
      <Lead p={[cx + 4, y + 3]} t={[290, 40]} text="dial" />
      <Lead p={[cx + 60, y + 20]} t={[350, 58]} text="movement" />
      <Lead p={[cx - R + 16, y + 26]} t={[86, 196]} text="case middle" />
      <Lead p={[cx - 20, y + 51]} t={[216, 196]} text="caseback" />
      <Lead p={[cx + R - 34, y + 45]} t={[346, 196]} text="back gasket" c={M.gasket} />
      <Lead p={[cx + R - 6, y + 21]} t={[398, 196]} text="tube" c={C.brass} />
      <Lead p={[cx + R + 18, y + 8]} t={[430, 62]} text="crown" />
      <T x={14} y={226} s={11} c={C.dim}>Every joint is a possible leak. Opening the watch disturbs at least one of them.</T>
    </F>
  )
}

function CoBacks() {
  const cell = (x, y, type, name, tool) => (
    <g>
      <Pn x={x} y={y} w={148} h={118} />
      <BackPlan cx={x + 74} cy={y + 46} r={30} type={type} />
      <T x={x + 74} y={y + 97} a="middle" s={11} c={C.text} w={600}>{name}</T>
      <T x={x + 74} y={y + 110} a="middle" s={10} c={C.dim}>{tool}</T>
    </g>
  )
  return (
    <F h={282} view="Plan · five backs and a one-piece" scale="schematic">
      {cell(12, 28, 'snap', 'Snap-on', 'lip: case knife')}
      {cell(166, 28, 'notch', 'Screw-in, notched', 'notches: case wrench')}
      {cell(320, 28, 'knurl', 'Screw-in, knurled', 'knurl: friction ball')}
      {cell(12, 152, 'screws', 'Held by screws', 'slots: fitted driver')}
      {cell(166, 152, 'bayonet', 'Bayonet', 'short twist to unlock')}
      {cell(320, 152, 'mono', 'No seam', 'stop: maybe one-piece')}
    </F>
  )
}

function CoMarks() {
  const cx = 120, cy = 128, r = 96
  return (
    <F h={252} view="Plan · reading a caseback" scale="made-up example">
      <circle cx={cx} cy={cy} r={r} fill="#a9b6be" stroke="#4e5f6a" />
      <circle cx={cx} cy={cy} r={r * 0.9} fill="none" stroke="#6f808b" />
      {[['GP 20', 78, 15], ['WATER RESISTANT', 104, 11], ['5 BAR', 122, 15], ['FOND ACIER', 146, 11], ['REF 1234', 166, 11]].map(([t, y, s]) => (
        <T key={t} x={cx} y={y} a="middle" s={s} c="#2b343a" w={700} mono>{t}</T>
      ))}
      <Lead p={[150, 74]} t={[238, 44]} text="GP 20: gold plate, nominal 20 µm" a="start" s={11} sub="that’s 0.02 mm, so clean it, don’t polish it" subc={C.dim} />
      <Lead p={[160, 118]} t={[238, 86]} text="5 bar: test at 5 bar, about 50 m" a="start" s={11} sub="1 bar equals 10 m" subc={C.dim} />
      <Lead p={[166, 142]} t={[238, 128]} text="Fond acier: steel back" a="start" s={11} sub="usually on a plated case" subc={C.dim} />
      <Lead p={[152, 162]} t={[238, 170]} text="Reference: a clue, not proof" a="start" s={11} sub="backs can be swapped" subc={C.dim} />
      <T x={238} y={214} s={10.5} c={C.dim}>GR = rolled gold. GC = gold capping.</T>
      <T x={238} y={229} s={10.5} c={C.dim}>“10K RGP” = a gold layer, not solid gold.</T>
    </F>
  )
}

function CoHold() {
  return (
    <F h={226} view="Section · case in its holder" scale="schematic">
      <rect x={60} y={150} width={300} height={22} rx="3" fill="#3a352e" stroke={C.struct} />
      <T x={210} y={166} a="middle" s={10.5} c={C.dim}>case holder base</T>
      <path d="M130 150 Q210 118 290 150 Z" fill="#6a5a45" stroke={C.struct} />
      <T x={210} y={143} a="middle" s={10} c={C.text}>cushion</T>
      {/* watch upside down */}
      <rect x={118} y={84} width={184} height={36} rx="3" fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={126} y={120} width={168} height={8} fill="url(#qk-acr)" stroke={M.glass} />
      <rect x={126} y={72} width={168} height={12} rx="1.5" fill="#b7c3ca" stroke="#55646e" />
      <line x1={118} y1={84} x2={302} y2={84} stroke={M.ink} strokeWidth="1.4" />
      {/* jaws */}
      <path d="M70 150 L70 96 L116 96 L116 112 L88 112 L88 150 Z" fill="url(#sk-steel)" stroke="#55646e" />
      <path d="M350 150 L350 96 L304 96 L304 112 L332 112 L332 150 Z" fill="url(#sk-steel)" stroke="#55646e" />
      <Arrow a={[50, 104]} b={[66, 104]} c="brass" />
      <Arrow a={[370, 104]} b={[354, 104]} c="brass" />
      <Lab p={[210, 79]} x={210} y={44} text="back faces you" s={11} up />
      <Lead p={[120, 84]} t={[88, 58]} text="seam: wipe it" s={10.5} c={C.brass} />
      <Lead p={[230, 124]} t={[392, 134]} text="crystal down" a="start" s={10.5} />
      <Lead p={[338, 104]} t={[392, 76]} text="jaws on flanks," a="start" s={10.5} sub="pad if polished" />
      <T x={14} y={198} s={11} c={C.text}>Strap off, crown in, seam clean. Push on the case: it mustn’t shift.</T>
      <T x={14} y={214} s={10.5} c={C.dim}>A slipping tool causes nearly all bench scratches. A firm hold stops most of them.</T>
    </F>
  )
}

function CoSnap() {
  return (
    <F h={258} view="Detail · lifting a snap-on back" scale="schematic, magnified">
      <path d="M40 60 L250 60 L250 134 L176 134 L176 120 L40 120 Z" fill="url(#qk-cut)" stroke="#4e5f6a" />
      <T x={110} y={94} a="middle" s={11} c={C.text}>case middle</T>
      <path d="M40 142 L150 142 L168 124 L172 134 L176 150 L40 150 Z" fill="#c1cbd1" stroke="#55646e" />
      <T x={90} y={168} a="middle" s={11} c={C.text}>snap-on back</T>
      <G x={186} y={138} ang={108} k={1}>
        <CaseKnife />
      </G>
      <path d="M290 212 a44 44 0 0 0 26 -46" fill="none" stroke={C.brass} strokeWidth="2.2" markerEnd="url(#sk-a-brass)" />
      <T x={334} y={208} s={11} c={C.brass}>twist, don’t push</T>
      <line x1={176} y1={132} x2={176} y2={46} stroke={C.brass} strokeWidth="0.9" />
      <T x={176} y={41} a="middle" s={11.5} c={C.brass}>lip</T>
      <Pn x={330} y={30} w={138} h={118} t="If it won’t move" />
      <Note x={342} y={66} s={10.5} lh={15} lines={['Reseat the blade.', 'Tap it in lightly, with', 'a cushion underneath.', 'Never lever on a lug.']} />
      <T x={14} y={228} s={11} c={C.ruby}>Work away from your hand, and keep your other hand behind the blade.</T>
      <T x={14} y={245} s={10.5} c={C.dim}>Check the seam opens evenly all round before you lift the back off.</T>
    </F>
  )
}

function CoWrench() {
  const sec = (x, ok) => (
    <g>
      <rect x={x} y={ok ? 150 : 150} width={110} height={26} fill="#bcc7ce" stroke="#55646e" />
      <rect x={x + 42} y={150} width={26} height={12} fill={M.ink} />
      <rect x={x + 48} y={ok ? 118 : 110} width={14} height={ok ? 42 : 40} rx="1" fill="url(#sk-steelH)" stroke="#4e5f6a" strokeWidth="0.6" transform={ok ? undefined : `rotate(16 ${x + 55} 150)`} />
      <Verdict x={x + 96} y={126} ok={ok} r={8} />
      <T x={x + 55} y={194} a="middle" s={10.5} c={C.dim}>{ok ? 'fully in the notch' : 'riding up: it will jump'}</T>
    </g>
  )
  return (
    <F h={254} view="Plan and detail · case wrench" scale="schematic">
      <BackPlan cx={130} cy={124} r={78} type="notch" />
      {[15, 135, 255].map((d) => {
        const [x, y] = pol(130, 124, 60, d)
        return <circle key={d} cx={x} cy={y} r={5} fill={C.brassHi} stroke={M.ink} />
      })}
      <path d="M130 124 L188 139 M130 124 L100 72 M130 124 L100 176" stroke={C.brass} strokeWidth="3" opacity="0.55" />
      <path d="M48 76 A100 100 0 0 0 40 164" fill="none" stroke={C.brass} strokeWidth="2.2" markerEnd="url(#sk-a-brass)" />
      <T x={14} y={62} s={10.5} c={C.brass}>anticlockwise</T>
      <Tag x={236} y={40}>Press down first, then turn</Tag>
      <Note x={236} y={58} s={10.5} lh={14} lines={['Most slips come from pressure easing off,', 'not from a tight back.']} />
      {sec(226, true)}
      {sec(350, false)}
      <T x={14} y={226} s={11} c={C.dim}>A smooth or knurled back takes a friction ball, which grips without marking.</T>
      <T x={14} y={243} s={10.5} c={C.faint}>If it won’t start, stop and reset the tool. A jumped wrench leaves a permanent scratch.</T>
    </F>
  )
}

function CoScrews() {
  const col = (x, title, thru) => (
    <g>
      <Pn x={x} y={28} w={222} h={170} t={title} />
      <rect x={x + 26} y={60} width={170} height={14} fill={thru ? 'url(#qk-bcut)' : 'url(#qk-cut)'} stroke="#4e5f6a" />
      <rect x={x + 26} y={75} width={170} height={52} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={x + 26} y={128} width={170} height={12} fill="#bcc7ce" stroke="#55646e" />
      <T x={x + 111} y={106} a="middle" s={10.5} c={C.text}>case middle</T>
      <T x={x + 111} y={156} a="middle" s={10.5} c={C.dim}>back</T>
      {thru && <T x={x + 111} y={54} a="middle" s={10.5} c={C.brass}>bezel</T>}
      {[52, 170].map((d) => (
        <g key={d}>
          <rect x={x + d - 7} y={140} width={14} height={5} rx="1" fill="#e4e9ec" stroke="#55646e" strokeWidth="0.6" />
          <rect x={x + d - 2} y={thru ? 66 : 112} width={4} height={thru ? 74 : 28} fill="url(#qk-thread)" />
        </g>
      ))}
      <T x={x + 111} y={176} a="middle" s={10.5} c={C.text}>{thru ? 'bezel and crystal come loose' : 'only the back comes off'}</T>
      <T x={x + 111} y={189} a="middle" s={10} c={C.faint}>{thru ? 'lift as one, carefully' : 'keep the screws in order'}</T>
    </g>
  )
  const bl = (x, c, w, l, ok) => (
    <g>
      <rect x={x} y={224} width={44} height={10} rx="1" fill="#c5ced4" stroke="#55646e" />
      <rect x={x + 8} y={224} width={28} height={4} fill={M.ink} />
      <rect x={x + 22 - w / 2} y={204} width={w} height={22} fill="url(#sk-steelH)" />
      <Verdict x={x + 60} y={214} ok={ok} r={7} />
      <T x={x + 22} y={250} a="middle" s={10} c={C.dim}>{l}</T>
    </g>
  )
  return (
    <F h={262} view="Section · two kinds of screwed back" scale="schematic">
      {col(12, 'Screws into the middle', false)}
      {col(246, 'Screws through to the bezel', true)}
      {bl(40, C.emerald, 27, 'fills the slot', true)}
      {bl(196, C.ruby, 46, 'too wide: scrapes', false)}
      {bl(352, C.ruby, 12, 'too narrow: marks', false)}
    </F>
  )
}

function CoMono() {
  return (
    <F h={290} view="Exploded section · one-piece case" scale="schematic">
      {/* one piece body */}
      <path d="M60 196 L60 150 L88 150 L88 214 L372 214 L372 150 L400 150 L400 196 Q398 226 366 226 L94 226 Q62 226 60 196 Z" fill="url(#qk-cut)" stroke="#4e5f6a" />
      <T x={230} y={243} a="middle" s={11} c={C.text}>one-piece case: no back seam</T>
      {/* movement lifted */}
      <rect x={120} y={114} width={220} height={26} fill="url(#qk-mov)" stroke={C.struct} />
      <rect x={116} y={108} width={228} height={4} fill={M.dial} />
      <Arrow a={[230, 206]} b={[230, 146]} c="brass" />
      {/* crystal and bezel */}
      <path d="M86 70 L86 54 L116 48 L344 48 L374 54 L374 70 L352 70 L352 60 L108 60 L108 70 Z" fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={108} y={58} width={244} height={8} fill="url(#qk-acr)" stroke={M.glass} />
      <Arrow a={[76, 118]} b={[76, 74]} c="brass" />
      <Num x={42} y={60} n={2} r={9} />
      <T x={42} y={84} a="middle" s={10.5} c={C.text}>bezel</T>
      <T x={42} y={97} a="middle" s={10.5} c={C.text}>+ crystal</T>
      <Num x={380} y={120} n={3} r={9} />
      <T x={394} y={124} s={10.5} c={C.text}>movement</T>
      {/* split stem */}
      <rect x={340} y={124} width={22} height={3} fill={C.dim} />
      <rect x={414} y={172} width={36} height={3} fill={C.dim} />
      <rect x={448} y={160} width={18} height={26} rx="3" fill="url(#qk-knurl)" stroke="#55646e" strokeWidth="0.6" />
      <Arrow a={[420, 190]} b={[454, 190]} c="brass" />
      <Num x={438} y={146} n={1} r={9} />
      <T x={468} y={210} a="end" s={10.5} c={C.text}>crown + half stem</T>
      <T x={14} y={262} s={11} c={C.text}>Refitting needs a new crystal gasket and a proper crystal press.</T>
      <T x={14} y={278} s={10.5} c={C.dim}>Details vary by maker, and some need a special tool. Find the model’s procedure first.</T>
    </F>
  )
}

function CoClose() {
  const thr = (x, ok) => (
    <g>
      <rect x={x} y={60} width={150} height={44} fill="url(#qk-cut)" stroke="#4e5f6a" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${x + 8 + i * 17} 104 l6 10 l6 -10`} fill="url(#qk-cut)" stroke="#4e5f6a" />
      ))}
      <g transform={ok ? undefined : `rotate(-5 ${x + 75} 120)`}>
        <rect x={x + 10} y={126} width={130} height={22} fill="#bcc7ce" stroke="#55646e" />
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={`M${x + 22 + i * 17} 126 l6 -10 l6 10`} fill="#bcc7ce" stroke="#55646e" />
        ))}
      </g>
      <Verdict x={x + 136} y={46} ok={ok} r={8} />
    </g>
  )
  return (
    <F h={250} view="Section · starting the thread" scale="schematic, thread enlarged">
      <T x={20} y={46} s={11} c={C.text}>Teeth sit in the gaps</T>
      {thr(14, true)}
      <T x={182} y={46} s={11} c={C.text}>Cross-threaded</T>
      {thr(180, false)}
      <Pn x={346} y={30} w={122} h={134} t="Start it" />
      {[['Turn back', 'until it drops'], ['Then forward', 'by hand'], ['Easy for', 'several turns']].map(([a, b], i) => (
        <g key={a}>
          <Num x={364} y={60 + i * 36} n={i + 1} r={8} />
          <T x={378} y={58 + i * 36} s={10.5} c={C.text}>{a}</T>
          <T x={378} y={71 + i * 36} s={10} c={C.dim}>{b}</T>
        </g>
      ))}
      <T x={14} y={186} s={11} c={C.text}>If it stiffens early, back it off and start again.</T>
      <T x={14} y={204} s={10.5} c={C.dim}>Snap-on back: a press and a die that clears the crystal, never thumbs on a dome.</T>
      <T x={14} y={220} s={10.5} c={C.dim}>Line up any cut-out with the stem. A plastic holder on the stem leaves a gap.</T>
      <T x={14} y={236} s={10.5} c={C.dim}>Check that no gasket shows in the seam, then test it.</T>
    </F>
  )
}


/* ------------------------------------------------------------------ */
/* Lesson: gaskets                                                      */
/* ------------------------------------------------------------------ */
function CgSections() {
  const cell = (x, name, kind, job, use) => (
    <g>
      <Pn x={x} y={28} w={110} h={172} t={name} />
      <ellipse cx={x + 55} cy={72} rx={38} ry={13} fill="none" stroke={kind === 'hard' ? M.rigid : M.gasket} strokeWidth={kind === 'flat' ? 6 : 4} />
      <T x={x + 55} y={100} a="middle" s={10} c={C.faint}>cut here</T>
      <g transform={`translate(${x + 55} 134)`}>
        {name === 'O-ring' && <circle r={15} fill={M.gasket} stroke={M.gasketEdge} />}
        {name === 'Flat' && <rect x={-24} y={-6} width={48} height={12} rx="1" fill={M.gasket} stroke={M.gasketEdge} />}
        {name === 'I gasket' && <rect x={-7} y={-20} width={14} height={40} rx="1" fill={M.rigid} stroke="#fff5d8" />}
        {name === 'L gasket' && <path d="M-7 -20 L7 -20 L7 8 L22 8 L22 20 L-7 20 Z" fill={M.rigid} stroke="#fff5d8" />}
      </g>
      <T x={x + 55} y={175} a="middle" s={10.5} c={C.text}>{job}</T>
      <T x={x + 55} y={189} a="middle" s={10} c={C.dim}>{use}</T>
    </g>
  )
  return (
    <F h={246} view="Section · four gasket shapes" scale="schematic">
      {cell(12, 'O-ring', 'soft', 'elastic', 'backs, bezels')}
      {cell(127, 'Flat', 'flat', 'elastic', 'backs, bezels')}
      {cell(242, 'I gasket', 'hard', 'rigid, single use', 'crystals')}
      {cell(357, 'L gasket', 'hard', 'rigid, single use', 'adds a support lip')}
      <T x={14} y={220} s={11} c={C.dim}>Elastic seals spring back. Rigid gaskets deform for good, so never re-use one.</T>
      <T x={14} y={236} s={10.5} c={C.faint}>Before mid-century, gaskets were mainly cork, leather and lead.</T>
    </F>
  )
}

function CgWhere() {
  const cx = 226, y = 98, R = 170
  return (
    <F h={232} view="Section · where the seals sit" scale="schematic">
      <CaseSec cx={cx} y={y} R={R} />
      <Lead p={[cx + R - 44, y - 12]} t={[300, 42]} text="crystal gasket" a="start" c={C.brassHi} sub="rigid, single use" />
      <Lead p={[cx + R + 9, y + 13]} t={[402, 66]} text="crown seals" a="start" c={M.gasket} />
      <Lead p={[cx - R + 34, y + 45]} t={[110, 196]} text="back gasket" c={M.gasket} sub="replace whenever opened" />
      <Lead p={[cx - R + 24, y - 16]} t={[122, 50]} text="bezel gasket, if it turns" c={C.dim} />
      <T x={250} y={200} s={10.5} c={C.dim}>Pushers have seals of their own.</T>
      <T x={250} y={215} s={10.5} c={C.dim}>Citizen: replace every 2 or 3 years.</T>
    </F>
  )
}

function CgCondition() {
  const c = (x, t, ok, d) => (
    <g>
      <Pn x={x} y={28} w={148} h={118} t={t} c={ok ? C.emerald : C.ruby} tc={ok ? C.emerald : C.ruby} />
      <Verdict x={x + 130} y={46} ok={ok} r={8} />
      <g transform={`translate(${x + 74} 94)`}>{d}</g>
    </g>
  )
  return (
    <F h={240} view="Section · reading an old gasket" scale="schematic, magnified">
      {c(12, 'Sound', true, <circle r={24} fill={M.gasket} stroke={M.gasketEdge} />)}
      {c(166, 'Taken a set', false, <ellipse rx={38} ry={14} fill={M.gasket} stroke={M.gasketEdge} />)}
      {c(320, 'Cracked', false, <g><circle r={24} fill={M.gasket} stroke={M.gasketEdge} /><path d="M-6 -24 L2 -10 L-4 0 L4 12 L0 24" fill="none" stroke={M.ink} strokeWidth="2" /></g>)}
      <rect x={60} y={176} width={110} height={8} fill="url(#qk-cut)" />
      <rect x={60} y={158} width={24} height={18} fill="url(#qk-cut)" />
      <rect x={146} y={158} width={24} height={18} fill="url(#qk-cut)" />
      <Dim a={[84, 164]} b={[146, 164]} text="groove" off={0} />
      <T x={190} y={166} s={11} c={C.text}>Measure the groove as well.</T>
      <T x={190} y={181} s={10.5} c={C.dim}>An old gasket may have stretched or shrunk.</T>
      <T x={14} y={208} s={10.5} c={C.dim}>Lift with plastic tweezers or pegwood, not steel, so the groove stays unscratched.</T>
      <T x={14} y={224} s={10.5} c={C.dim}>Clean the groove, then go round it with a loupe: a hair or crumb will leak.</T>
    </F>
  )
}

function CgMeasure() {
  const cx = 110, cy = 128
  return (
    <F h={250} view="Plan · measuring an O-ring" scale="worked example">
      <circle cx={cx} cy={cy} r={82} fill="none" stroke={M.gasket} strokeWidth="16" />
      <Dim a={[cx - 90, cy + 112]} b={[cx + 90, cy + 112]} text="" off={0} />
      <line x1={cx - 90} y1={cy} x2={cx - 90} y2={cy + 116} stroke={C.dim} strokeWidth="0.6" />
      <line x1={cx + 90} y1={cy} x2={cx + 90} y2={cy + 116} stroke={C.dim} strokeWidth="0.6" />
      <T x={cx} y={cy + 106} a="middle" s={10.5} mono>OD 31.8 mm</T>
      <Dim a={[cx - 74, cy]} b={[cx + 74, cy]} text="ID 30.0 mm" off={0} />
      <Tag x={232} y={44}>The sum</Tag>
      <T x={232} y={72} s={15} c={C.text} mono>(OD − ID) ÷ 2</T>
      <T x={232} y={98} s={13} c={C.brass} mono>(31.8 − 30.0) ÷ 2</T>
      <T x={232} y={120} s={15} c={C.brass} mono w={700}>= 0.9 mm section</T>
      <Sep x1={232} y1={134} x2={466} y2={134} />
      <Note x={232} y={154} s={10.5} lh={15} lines={['Listed by inner diameter and section.', 'Ranges sold at 0.40, 0.70 and 0.90 mm.', 'One flat range is 0.50 mm thick.', 'Forum: most top out near 1 mm.']} />
      <T x={232} y={226} s={10.5} c={C.ruby}>Keep the brackets, or the answer is wrong.</T>
    </F>
  )
}

function CgGroove() {
  const seat = (x, top, c, ok, a, b) => (
    <g>
      <Pn x={x} y={28} w={148} h={136} t={a} c={ok ? C.emerald : C.ruby} tc={ok ? C.emerald : C.ruby} />
      <Verdict x={x + 130} y={46} ok={ok} r={8} />
      <path d={`M${x + 16} 92 L${x + 52} 92 L${x + 52} 124 L${x + 96} 124 L${x + 96} 92 L${x + 132} 92 L${x + 132} 136 L${x + 16} 136 Z`} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <line x1={x + 12} y1={92} x2={x + 136} y2={92} stroke={C.brass} strokeDasharray="4 3" />
      <circle cx={x + 74} cy={124 - c} r={c} fill={M.gasket} stroke={M.gasketEdge} />
      <T x={x + 74} y={154} a="middle" s={10.5} c={C.dim}>{b}</T>
    </g>
  )
  return (
    <F h={252} view="Section · gasket in its groove" scale="schematic, magnified">
      {seat(12, 0, 19.5, true, 'Slightly proud', 'closing squeezes it')}
      {seat(166, 0, 16, false, 'Flush or low', 'nothing squeezes it')}
      {seat(320, 0, 26, false, 'Far too tall', 'pinches and cuts')}
      <rect x={60} y={196} width={150} height={14} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={60} y={174} width={150} height={8} fill="#bcc7ce" stroke="#55646e" />
      <ellipse cx={135} cy={188} rx={24} ry={7} fill={M.gasket} stroke={M.gasketEdge} />
      <T x={224} y={186} s={11} c={C.text}>Closed: round becomes flattened.</T>
      <T x={224} y={201} s={10.5} c={C.dim}>That squeeze is the seal.</T>
      <T x={14} y={238} s={10.5} c={C.faint}>No reliable compression figure exists, so judge by eye. A straight edge helps.</T>
    </F>
  )
}

function CgSize() {
  return (
    <F h={228} view="Comparison · sizing by function" scale="reasoned rule">
      <Pn x={12} y={28} w={222} h={156} t="Stretched over a lip" />
      <path d="M48 150 L48 92 L198 92 L198 150 Z" fill="url(#qk-cut)" stroke="#4e5f6a" />
      <ellipse cx={123} cy={92} rx={80} ry={10} fill="none" stroke={M.gasket} strokeWidth="6" />
      <Arrow a={[28, 92]} b={[40, 92]} c="brass" />
      <Arrow a={[218, 92]} b={[206, 92]} c="brass" />
      <T x={123} y={126} a="middle" s={11} c={C.text}>back’s lip</T>
      <T x={123} y={170} a="middle" s={11} c={C.brass}>go slightly undersize, so it hugs</T>

      <Pn x={246} y={28} w={222} h={156} t="Crystal pressed into it" />
      <rect x={270} y={100} width={32} height={46} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={412} y={100} width={32} height={46} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={302} y={96} width={7} height={34} fill={M.rigid} />
      <rect x={405} y={96} width={7} height={34} fill={M.rigid} />
      <rect x={309} y={98} width={96} height={18} fill="url(#qk-acr)" stroke={M.glass} />
      <Arrow a={[357, 62]} b={[357, 92]} c="brass" />
      <T x={357} y={170} a="middle" s={11} c={C.brass}>go slightly oversize, so it squeezes</T>
      <T x={14} y={204} s={11} c={C.dim}>Too big falls off the lip. Too small won’t go on without strain.</T>
      <T x={14} y={220} s={10.5} c={C.faint}>Sources disagree on an exact figure for backs, so compare with the old gasket.</T>
    </F>
  )
}

function CgGrease() {
  return (
    <F h={230} view="Method · grease box" scale="schematic">
      <rect x={30} y={70} width={160} height={70} rx="8" fill="#3a352e" stroke={C.struct} />
      <rect x={42} y={82} width={136} height={46} rx="4" fill={M.grease} opacity="0.3" />
      <ellipse cx={110} cy={105} rx={46} ry={15} fill="none" stroke={M.gasket} strokeWidth="5" />
      <path d="M30 70 L60 34 L220 34 L190 70" fill="#4a443b" stroke={C.struct} />
      <path d="M124 54 a22 10 0 1 1 22 4" fill="none" stroke={C.brass} strokeWidth="2.2" markerEnd="url(#sk-a-brass)" />
      <T x={110} y={160} a="middle" s={11} c={C.text}>close it and twist</T>
      <Pn x={236} y={28} w={110} h={124} t="A sheen" c={C.emerald} tc={C.emerald} />
      <circle cx={291} cy={98} r={26} fill={M.gasket} stroke={M.grease} strokeWidth="3" />
      <Verdict x={330} y={46} ok r={8} />
      <Pn x={358} y={28} w={110} h={124} t="A coat" c={C.ruby} tc={C.ruby} />
      <circle cx={413} cy={98} r={26} fill={M.gasket} />
      <path d="M389 86 q-8 18 6 30 q16 12 34 -2 q-4 18 -24 18 q-30 -6 -16 -46 Z M430 76 q14 8 8 24 q-8 -8 -14 -16 Z" fill={M.grease} />
      <Verdict x={452} y={46} ok={false} r={8} />
      <Tb
        x={14}
        y={186}
        rh={17}
        head={false}
        cols={[{ w: 172 }, { w: 280 }]}
        rows={[
          ['Elastic back gasket', 'thin film of silicone grease (Witschi agrees)'],
          ['Crystal gasket', 'usually none'],
          ['Tube and screw threads', 'sparingly: excess can get inside with the stem'],
        ]}
      />
    </F>
  )
}

function CgFit() {
  const lip = (x, a) => (
    <g>
      <Pn x={x} y={28} w={148} h={126} />
      <circle cx={x + 74} cy={92} r={40} fill="#bcc7ce" stroke="#55646e" />
      {a}
    </g>
  )
  return (
    <F h={246} view="Sequence · fitting an O-ring" scale="schematic">
      {lip(12, <g><path d="M100 54 A40 40 0 0 1 126 92" fill="none" stroke={M.gasket} strokeWidth="5" /><path d="M126 92 Q150 130 100 150" fill="none" stroke={M.gasket} strokeWidth="5" strokeDasharray="5 3" /><path d="M100 150 Q40 130 48 92 Q52 62 100 54" fill="none" stroke={M.gasket} strokeWidth="5" strokeDasharray="5 3" /><Num x={28} y={44} n={1} r={8} /></g>)}
      {lip(166, <g><path d="M200 92 A40 40 0 1 1 280 92" fill="none" stroke={M.gasket} strokeWidth="5" /><path d="M200 92 Q212 146 240 146 Q268 146 280 92" fill="none" stroke={M.gasket} strokeWidth="5" strokeDasharray="5 3" /><Arrow a={[240, 150]} b={[240, 136]} c="brass" /><Num x={182} y={44} n={2} r={8} /></g>)}
      {lip(320, <g><circle cx={394} cy={92} r={40} fill="none" stroke={M.gasket} strokeWidth="5" /><Verdict x={450} y={44} ok r={8} /><Num x={336} y={44} n={3} r={8} /></g>)}
      <T x={86} y={170} a="middle" s={10.5} c={C.text}>hook one side</T>
      <T x={240} y={170} a="middle" s={10.5} c={C.text}>stretch gently, work round</T>
      <T x={394} y={170} a="middle" s={10.5} c={C.text}>seated, not twisted</T>
      <Sep x1={14} y1={182} x2={466} y2={182} />
      <rect x={30} y={200} width={120} height={7} fill="url(#qk-cut)" />
      <rect x={30} y={213} width={120} height={7} fill="#bcc7ce" />
      <rect x={150} y={204} width={12} height={12} rx="2" fill={M.gasket} />
      <Verdict x={178} y={210} ok={false} r={8} />
      <T x={196} y={207} s={11} c={C.text}>Gasket showing in the seam: it’s pinched and cut.</T>
      <T x={196} y={222} s={10.5} c={C.dim}>Replace it. Then close evenly, and test.</T>
    </F>
  )
}


/* ------------------------------------------------------------------ */
/* Lesson: crystals                                                     */
/* ------------------------------------------------------------------ */
function CxMaterial() {
  const col = (x, t, c, dome, feel, l) => (
    <g>
      <Pn x={x} y={28} w={148} h={158} t={t} />
      {dome ? (
        <path d={`M${x + 18} 106 L${x + 18} 94 Q${x + 74} 56 ${x + 130} 94 L${x + 130} 106 Q${x + 74} 78 ${x + 18} 106 Z`} fill="url(#qk-acr)" stroke={M.glass} />
      ) : (
        <rect x={x + 18} y={84} width={112} height={c} fill="url(#qk-acr)" stroke={M.glass} />
      )}
      <T x={x + 74} y={130} a="middle" s={11} c={feel === 'warmer' ? C.brass : C.steel} w={600}>feels {feel}</T>
      <Note x={x + 74} y={146} a="middle" s={10.5} lh={13} lines={l} />
    </g>
  )
  return (
    <F h={234} view="Section · three crystal materials" scale="schematic">
      {col(12, 'Acrylic', 0, true, 'warmer', ['usually domed,', 'scuffs all over'])}
      {[[100, 72], [76, 92], [60, 66], [112, 90]].map(([x, y], i) => <line key={i} x1={x} y1={y} x2={x + 10} y2={y + 3} stroke={C.text} strokeWidth="0.7" />)}
      {col(166, 'Mineral', 12, false, 'cold', ['glass, harder', 'than acrylic'])}
      {col(320, 'Sapphire', 12, false, 'cold', ['hardest,', 'brittle under a press'])}
      <path d="M176 196 L176 204 L458 204 L458 196" fill="none" stroke={C.struct} />
      <T x={317} y={219} a="middle" s={10.5} c={C.dim}>touch can’t separate these two: use the maker’s data</T>
      <T x={14} y={208} s={10.5} c={C.faint}>A reflective inner ring</T>
      <T x={14} y={222} s={10.5} c={C.faint}>means tension ring.</T>
    </F>
  )
}

function CxFits() {
  const rim = (x, y) => <path d={`M${x + 156} ${y + 104} L${x + 156} ${y + 68} L${x + 138} ${y + 68} L${x + 138} ${y + 58} L${x + 156} ${y + 58} L${x + 156} ${y + 28} L${x + 210} ${y + 28} L${x + 210} ${y + 104} Z`} fill="url(#qk-cut)" stroke="#4e5f6a" />
  const lab = (x, y, a, b, c) => (
    <g>
      <T x={x + 12} y={y + 78} s={10.5} c={C.text}>{a}</T>
      <T x={x + 12} y={y + 92} s={10} c={C.dim}>{b}</T>
      <T x={x + 12} y={y + 106} s={10} c={C.ruby}>{c}</T>
    </g>
  )
  const P = [[12, 28], [246, 28], [12, 150], [246, 150]]
  return (
    <F h={276} view="Section · four crystal fits" scale="schematic, half a case">
      {P.map(([x, y], i) => <Pn key={i} x={x} y={y} w={222} h={116} t={['Compressed acrylic', 'Tension ring', 'Hard gasket', 'Glued'][i]} />)}
      {/* compressed */}
      {rim(12, 28)}
      <path d="M24 86 L24 72 Q120 50 168 56 L168 84 Z" fill="url(#qk-acr)" stroke={M.glass} />
      <Arrow a={[136, 72]} b={[160, 72]} c="brass" w={1.6} />
      {lab(12, 28, 'Squeezed, then released', 'lift, or die and plunger', 'too small falls out')}
      {/* tension ring */}
      {rim(246, 28)}
      <path d="M258 86 L258 72 Q354 50 402 56 L402 84 Z" fill="url(#qk-acr)" stroke={M.glass} />
      <rect x={390} y={60} width={5} height={24} fill={C.brass} />
      <Lead p={[392, 62]} t={[372, 50]} text="metal ring" s={10} c={C.brass} />
      {lab(246, 28, 'Ring pushes outward', 'chamfered die, one stroke', 'off-centre splits acrylic')}
      {/* hard gasket */}
      {rim(12, 150)}
      <rect x={24} y={186} width={134} height={18} fill="url(#qk-acr)" stroke={M.glass} />
      <path d="M158 180 L168 180 L168 208 L150 208 L150 204 L158 204 Z" fill={M.rigid} />
      <Lead p={[163, 184]} t={[136, 172]} text="rigid gasket" s={10} c={M.rigid} />
      {lab(12, 150, 'Pressed into a gasket', 'press, rest, press again', 'overpressed sapphire shatters')}
      {/* glued */}
      {rim(246, 150)}
      <rect x={258} y={190} width={140} height={15} fill="url(#qk-acr)" stroke={M.glass} />
      <rect x={380} y={205} width={22} height={3.4} fill={C.emerald} />
      <rect x={398} y={190} width={4} height={18} fill={C.emerald} />
      <Lead p={[399, 192]} t={[376, 174]} text="UV adhesive" s={10} c={C.emerald} />
      {lab(246, 150, 'Sits in adhesive on a ledge', 'small even bead, UV cure', 'wide gap: glue runs under')}
    </F>
  )
}

function CxMeasure() {
  const cx = 104, cy = 128
  return (
    <F h={276} view="Plan · measuring, then ordering" scale="sizes from Esslinger, forum">
      <circle cx={cx} cy={cy} r={84} fill="url(#sk-steel)" stroke="#55646e" />
      <circle cx={cx} cy={cy} r={72} fill="url(#qk-acr)" stroke={M.glass} />
      <Dim a={[cx, cy - 72]} b={[cx, cy + 72]} text="" off={0} />
      <Dim a={[cx - 72, cy]} b={[cx + 72, cy]} text="" off={0} />
      <T x={cx + 6} y={cy - 48} s={10.5} mono c="#16191b" w={600}>12 to 6</T>
      <T x={cx + 22} y={cy + 16} s={10.5} mono c="#16191b" w={600}>3 to 9</T>
      <T x={cx} y={234} a="middle" s={10.5} c={C.dim}>both readings should agree</T>
      <Tag x={214} y={40}>Then add what the fit needs</Tag>
      <Tb
        x={214}
        y={60}
        rh={21}
        cols={[{ w: 150 }, { w: 104 }]}
        rows={[
          ['What you measured', 'Order'],
          ['Good gasket, 29.4 mm', { t: '29.5 mm', c: C.brass, w: 600 }],
          ['Fitted crystal', { t: 'reading + 0.1', c: C.brass, w: 600 }],
          ['Tension ring (forum)', { t: 'up 0.1 mm', c: C.brass }],
          ['Non-armoured (forum)', { t: 'up 0.2 mm', c: C.brass }],
        ]}
      />
      <Sep x1={214} y1={158} x2={466} y2={158} />
      <Note x={214} y={176} s={10.5} lh={14} lines={['Loose crystal: micrometer, two or three spots.', 'Crystal missing: inside jaws on the wall above', 'the ledge, two or three readings.', 'Most come in 0.1 mm steps, some in 0.5 mm.']} />
      <T x={14} y={262} s={10.5} c={C.faint}>G-S codes: ET, MT, AT, TT tension · PHD, XHD, HC, PKH compression · RMG, XMG glass</T>
    </F>
  )
}

function CxLift() {
  const panel = (x, n, t, a, draw) => (
    <g>
      <Pn x={x} y={28} w={148} h={150} />
      <Num x={x + 16} y={44} n={n} r={8} />
      <T x={x + 74} y={150} a="middle" s={11} c={C.text} w={600}>{t}</T>
      <T x={x + 74} y={165} a="middle" s={10} c={C.dim}>{a}</T>
      {draw}
    </g>
  )
  const jaw = (x, y, sg) => <path d={`M${x} ${y} L${x + sg * 10} ${y} L${x + sg * 10} ${y - 34} L${x + sg * 24} ${y - 40}`} fill="none" stroke={C.steel} strokeWidth="3.6" />
  return (
    <F h={250} view="Sequence · crystal lift" scale="schematic">
      {panel(12, 1, 'Squeeze', 'just enough to lift it', (
        <g>
          <path d="M46 112 L46 98 Q86 74 126 98 L126 112 Q86 92 46 112 Z" fill="url(#qk-acr)" stroke={M.glass} />
          {jaw(46, 108, -1)}
          {jaw(126, 108, 1)}
          <Arrow a={[18, 90]} b={[30, 90]} c="brass" w={1.6} />
          <Arrow a={[154, 90]} b={[142, 90]} c="brass" w={1.6} />
        </g>
      ))}
      {panel(166, 2, 'Place', 'small edge below the jaws', (
        <g>
          <path d="M200 106 L200 92 Q240 68 280 92 L280 106 Q240 86 200 106 Z" fill="url(#qk-acr)" stroke={M.glass} />
          {jaw(200, 102, -1)}
          {jaw(280, 102, 1)}
          <path d="M178 136 L178 110 L198 110 L198 124 L282 124 L282 110 L302 110 L302 136 Z" fill="url(#qk-cut)" stroke="#4e5f6a" />
          <Arrow a={[240, 54]} b={[240, 74]} c="brass" w={1.6} />
        </g>
      ))}
      {panel(320, 3, 'Release', 'it springs out and grips', (
        <g>
          <path d="M348 116 L348 102 Q394 76 440 102 L440 116 Q394 96 348 116 Z" fill="url(#qk-acr)" stroke={M.glass} />
          <path d="M332 136 L332 104 L346 104 L346 124 L442 124 L442 104 L456 104 L456 136 Z" fill="url(#qk-cut)" stroke="#4e5f6a" />
          <Arrow a={[372, 108]} b={[352, 108]} c="brass" w={1.6} />
          <Arrow a={[416, 108]} b={[436, 108]} c="brass" w={1.6} />
          <Verdict x={448} y={46} ok r={8} />
        </g>
      ))}
      <T x={14} y={198} s={11} c={C.text}>Press method: crystal upside down in the die, case on it, press, lower, release.</T>
      <T x={14} y={214} s={10.5} c={C.dim}>That won’t work if the plunger can’t pass the case or bezel.</T>
      <T x={14} y={230} s={10.5} c={C.dim}>Pops out: undersize. Won’t enter: oversize, or a dirty seat.</T>
    </F>
  )
}

function CxTension() {
  const cx = 168
  return (
    <F h={312} view="Section · pressing a tension ring" scale="schematic">
      {/* lower die */}
      <rect x={cx - 110} y={214} width={220} height={18} fill="#6d7f8a" stroke="#4e5f6a" />
      <rect x={cx - 74} y={172} width={148} height={42} fill="#8fa1ad" stroke="#4e5f6a" />
      <T x={cx} y={198} a="middle" s={10.5} c="#16191b">lower die</T>
      {/* case */}
      <path d={`M${cx - 106} 212 L${cx - 106} 142 L${cx - 76} 142 L${cx - 76} 212 Z`} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <path d={`M${cx + 106} 212 L${cx + 106} 142 L${cx + 76} 142 L${cx + 76} 212 Z`} fill="url(#qk-cut)" stroke="#4e5f6a" />
      {/* crystal */}
      <path d={`M${cx - 84} 150 L${cx - 84} 134 Q${cx} 106 ${cx + 84} 134 L${cx + 84} 150 Q${cx} 130 ${cx - 84} 150 Z`} fill="url(#qk-acr)" stroke={M.glass} />
      <rect x={cx - 82} y={134} width={4} height={15} fill={C.brass} />
      <rect x={cx + 78} y={134} width={4} height={15} fill={C.brass} />
      {/* upper die */}
      <path d={`M${cx - 100} 124 L${cx - 92} 124 L${cx - 80} 108 Q${cx} 90 ${cx + 80} 108 L${cx + 92} 124 L${cx + 100} 124 L${cx + 100} 74 L${cx - 100} 74 Z`} fill="#9db0bb" stroke="#4e5f6a" />
      <rect x={cx - 12} y={38} width={24} height={36} fill="url(#sk-steelH)" />
      <Arrow a={[cx + 40, 40]} b={[cx + 40, 68]} c="brass" />
      <T x={cx + 50} y={54} s={10.5} c={C.brass}>one smooth stroke</T>
      <T x={cx} y={88} a="middle" s={10.5} c="#16191b">upper die</T>
      <Lead p={[cx + 86, 116]} t={[300, 92]} text="internal chamfer" s={10.5} sub="close to crystal diameter" />
      <Lead p={[cx + 80, 142]} t={[300, 136]} text="tension ring" s={10.5} c={C.brass} />
      <Lead p={[cx + 92, 176]} t={[300, 170]} text="case middle" s={10.5} />
      <Lead p={[cx + 74, 196]} t={[300, 204]} text="fits snugly, keeps" s={10.5} sub="the case level" />
      <Dim a={[cx - 84, 252]} b={[cx + 84, 252]} text="crystal 34.13 mm, die 34 mm (example)" off={0} tOff={2} s={10} />
      <line x1={cx} y1={32} x2={cx} y2={246} stroke={C.ruby} strokeWidth="0.7" strokeDasharray="6 3 1 3" />
      <T x={14} y={274} s={10.5} c={C.dim}>Stakes: concave for domed crystals, flat or convex for flat ones.</T>
      <T x={14} y={288} s={10.5} c={C.dim}>Bergeon 5500-C tapered dies aren’t recommended for mineral glass.</T>
      <T x={14} y={303} s={10.5} c={C.ruby}>Keep everything on the press axis. If the crystal tilts, stop.</T>
    </F>
  )
}

function CxHard() {
  const sec = (x, gap) => (
    <g>
      <rect x={x + 14} y={110} width={26} height={36} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={x + 108} y={110} width={26} height={36} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={x + 40} y={108} width={7} height={30} fill={M.rigid} />
      <rect x={x + 101} y={108} width={7} height={30} fill={M.rigid} />
      <rect x={x + 47} y={108 - gap} width={54} height={13} fill="url(#qk-acr)" stroke={M.glass} />
    </g>
  )
  const panel = (x, n, a, b, gap, extra) => (
    <g>
      <Pn x={x} y={28} w={148} h={154} />
      <Num x={x + 16} y={44} n={n} r={8} />
      {sec(x, gap)}
      {extra}
      <T x={x + 74} y={162} a="middle" s={11} c={C.text} w={600}>{a}</T>
      <T x={x + 74} y={175} a="middle" s={10} c={C.dim}>{b}</T>
    </g>
  )
  return (
    <F h={258} view="Sequence · sapphire or mineral" scale="schematic">
      {panel(12, 1, 'Press slowly', 'turn the case as you go', 8, (
        <g>
          <Arrow a={[86, 50]} b={[86, 88]} c="brass" />
          <path d="M112 66 a14 8 0 1 1 18 3" fill="none" stroke={C.brass} strokeWidth="1.8" markerEnd="url(#sk-a-brass)" />
        </g>
      ))}
      {panel(166, 2, 'Rest it', 'about 20 minutes', 14, (
        <g>
          <circle cx={218} cy={68} r={18} fill="none" stroke={C.steel} strokeWidth="1.6" />
          <path d="M218 56 V68 L228 74" fill="none" stroke={C.steel} strokeWidth="1.8" />
          <Arrow a={[292, 104]} b={[292, 88]} c="ruby" w={1.6} />
          <T x={300} y={76} a="end" s={10} c={C.ruby}>creeps up</T>
        </g>
      ))}
      {panel(320, 3, 'Press again', 'until it clicks home', 0, (
        <g>
          <Arrow a={[394, 54]} b={[394, 96]} c="brass" />
          <Verdict x={448} y={46} ok r={8} />
        </g>
      ))}
      <T x={14} y={202} s={11} c={C.text}>New gasket every time, chamfer towards the crystal. Buying three allows for a pinch.</T>
      <T x={14} y={219} s={10.5} c={C.ruby}>Overpressed sapphire can shatter violently before the case deforms: eye protection on.</T>
      <T x={14} y={235} s={10.5} c={C.dim}>Pressure test when it’s done.</T>
    </F>
  )
}

function CxGlue() {
  const gap = (x, g, ok, t, b) => (
    <g>
      <Pn x={x} y={128} w={222} h={100} t={t} c={ok ? C.emerald : C.ruby} tc={ok ? C.emerald : C.ruby} />
      <Verdict x={x + 204} y={146} ok={ok} r={8} />
      <path d={`M${x + 130} 212 L${x + 130} 192 L${x + 106} 192 L${x + 106} 184 L${x + 130} 184 L${x + 130} 158 L${x + 196} 158 L${x + 196} 212 Z`} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={x + 14} y={168} width={116 - g} height={15} fill="url(#qk-acr)" stroke={M.glass} />
      <rect x={x + 130 - g} y={168} width={g} height={16} fill={C.emerald} opacity="0.75" />
      {!ok && <path d={`M${x + 106} 186 q-6 8 -16 8 q-8 0 -10 -6 l26 -3 Z`} fill={C.emerald} opacity="0.85" />}
      <T x={x + 14} y={208} s={10.5} c={C.dim}>{b}</T>
    </g>
  )
  return (
    <F h={240} view="Section · UV-glued crystal" scale="schematic, gap exaggerated">
      {[['Clean', 'the ledge'], ['Test', 'flow on paper'], ['Bead', 'small, even'], ['Lower', 'press gently'], ['Wipe', 'at once'], ['Cure', '3 min under UV']].map(([a, b], i) => {
        const x = 12 + i * 77
        return (
          <g key={a}>
            <Bx x={x} y={34} w={72} h={46} l={[a, b]} s={10} lh={14} b={C.dim} c={i === 5 ? C.emerald : C.struct} />
            {i < 5 && <path d={`M${x + 72.5} 57 h4`} stroke={C.brass} strokeWidth="1.6" />}
          </g>
        )
      })}
      <T x={14} y={102} s={10.5} c={C.dim}>Retail method. One adhesive says 365 nm and 2 minutes, so follow your bottle.</T>
      <T x={14} y={117} s={10.5} c={C.ruby}>Some adhesives warn of skin irritation.</T>
      {gap(12, 5, true, 'About 0.05 mm per side', 'worked on one job')}
      {gap(246, 18, false, '0.25 mm per side', 'too wide: glue ran under')}
    </F>
  )
}

function CxPolish() {
  const grades = ['1800', '2400', '3200', '3600', '4000', '6000', '8000', '12000']
  return (
    <F h={262} view="Section · polishing acrylic" scale="scratch depth exaggerated">
      <path d="M30 150 L30 64 L150 64 L156 104 L162 64 L290 64 L290 150 Z" fill="url(#qk-acr)" stroke={M.glass} />
      <rect x={30} y={64} width={120} height={40} fill="rgba(194,88,99,0.18)" />
      <rect x={162} y={64} width={128} height={40} fill="rgba(194,88,99,0.18)" />
      <path d="M150 64 L156 104 L162 64 Z" fill="none" stroke={C.ruby} />
      <line x1={22} y1={104} x2={298} y2={104} stroke={C.brass} strokeDasharray="5 3" />
      <T x={92} y={88} a="middle" s={10.5} c={C.text}>all this goes</T>
      <T x={230} y={88} a="middle" s={10.5} c={C.text}>too</T>
      <Lab p={[156, 98]} x={156} y={44} text="deepest scratch" c={C.ruby} up />
      <T x={92} y={128} a="middle" s={10.5} c={C.dim}>what’s left</T>
      <Pn x={312} y={32} w={156} h={120} t="Which job?" />
      <T x={324} y={66} s={11} c={C.text} w={600}>Light marks</T>
      <T x={324} y={80} s={10.5} c={C.dim}>Polywatch, firmly,</T>
      <T x={324} y={93} s={10.5} c={C.dim}>a few minutes</T>
      <T x={324} y={116} s={11} c={C.text} w={600}>Deep scratch, crack</T>
      <T x={324} y={130} s={10.5} c={C.brass}>usually a new crystal</T>
      <Tag x={14} y={176}>Full chain, for marks in between</Tag>
      {grades.map((g, i) => {
        const x = 14 + i * 47
        return (
          <g key={g}>
            <rect x={x} y={186} width={42} height={24} rx="3" fill={`rgba(208,168,79,${0.36 - i * 0.035})`} stroke={C.struct} />
            <T x={x + 21} y={202} a="middle" s={10.5} mono c={C.text}>{g}</T>
          </g>
        )
      })}
      <rect x={390} y={186} width={76} height={24} rx="3" fill="rgba(123,165,131,0.3)" stroke={C.emerald} />
      <T x={428} y={202} a="middle" s={10} c={C.text}>then PlastX</T>
      <T x={14} y={230} s={10.5} c={C.dim}>Micro-Mesh grades. Sand the whole crystal in small circles and clean the pads.</T>
      <T x={14} y={246} s={10.5} c={C.dim}>Each grade must remove the last one’s marks. Start as fine as the scratch allows.</T>
    </F>
  )
}


/* ------------------------------------------------------------------ */
/* Lesson: crowns, tubes and stems                                      */
/* ------------------------------------------------------------------ */
// Crown and tube in section, running left to right from the case wall
function CrownSec({ x, y, screw }) {
  const h = 26 // half height of the crown
  return (
    <g>
      <rect x={x} y={y - 44} width={46} height={88} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={x + 14} y={y - 12} width={76} height={6} fill="url(#qk-bcut)" />
      <rect x={x + 14} y={y + 6} width={76} height={6} fill="url(#qk-bcut)" />
      {screw && <rect x={x + 58} y={y - 15} width={30} height={3.4} fill="url(#qk-thread)" />}
      {screw && <rect x={x + 58} y={y + 11.6} width={30} height={3.4} fill="url(#qk-thread)" />}
      <rect x={x - 26} y={y - 2.5} width={140} height={5} fill={C.dim} />
      <rect x={x + 92} y={y - 4} width={30} height={8} fill="url(#qk-thread)" />
      <path d={`M${x + 60} ${y - h} L${x + 130} ${y - h} Q${x + 136} ${y - h} ${x + 136} ${y - h + 6} L${x + 136} ${y + h - 6} Q${x + 136} ${y + h} ${x + 130} ${y + h} L${x + 60} ${y + h} L${x + 60} ${y + h - 8} L${x + 106} ${y + h - 8} L${x + 106} ${y - h + 8} L${x + 60} ${y - h + 8} Z`} fill="url(#qk-cut)" stroke="#4e5f6a" />
      {[-1, 1].map((sg) => (
        <rect key={sg} x={screw ? x + 92 : x + 76} y={y + sg * 15 - 2.6} width={10} height={5.2} rx="1.4" fill={M.gasket} stroke={M.gasketEdge} strokeWidth="0.5" />
      ))}
      {screw && [-1, 1].map((sg) => <rect key={sg} x={x + 60} y={y + sg * 16.4 - 1.8} width={28} height={3.6} fill="url(#qk-thread)" />)}
    </g>
  )
}

function CtSections() {
  return (
    <F h={250} view="Section · two kinds of crown" scale="schematic">
      <Pn x={12} y={28} w={222} h={172} t="Push-in" />
      <CrownSec x={56} y={116} />
      <Lab p={[80, 104]} x={40} y={188} text="tube" c={C.brass} />
      <Lead p={[136, 101]} t={[120, 50]} text="seal rides on tube" a="start" s={10.5} c={M.gasket} />
      <Lab p={[164, 116]} x={176} y={188} text="stem thread" />
      <Pn x={246} y={28} w={222} h={172} t="Screw-down" />
      <CrownSec x={290} y={116} screw />
      <Lab p={[364, 100]} x={300} y={188} text="tube thread" c={C.steel} />
      <Lead p={[386, 101]} t={[368, 50]} text="seal, compressed" a="start" s={10.5} c={M.gasket} />
      <Lab p={[398, 116]} x={414} y={188} text="stem thread" />
      <T x={14} y={220} s={11} c={C.text}>Won’t wind: stem problem. Won’t screw down: tube problem.</T>
      <T x={14} y={237} s={10.5} c={C.dim}>Two threads, so write down two sizes.</T>
    </F>
  )
}

function CtTap() {
  const x0 = 62, y0 = 188
  const X = (t) => x0 + (t - 6) * 44
  const Y = (v) => y0 - ((v - 0.6) / 0.6) * 146
  const walsh = [[6, 0.6], [7, 0.7], [8, 0.8], [9, 0.9], [10, 1.0], [11, 1.1], [12, 1.2]]
  const frei = [[6, 1.2], [8, 1.1], [9, 1.0], [10, 0.9], [11, 0.8], [12, 0.7]]
  const line = (p) => p.map(([t, v], i) => `${i ? 'L' : 'M'}${X(t)} ${Y(v)}`).join(' ')
  return (
    <F h={262} view="Chart · one tap number, two sizes" scale="suppliers’ charts">
      {[0.6, 0.8, 1.0, 1.2].map((v) => (
        <g key={v}>
          <line x1={x0} y1={Y(v)} x2={X(12)} y2={Y(v)} stroke={C.line} strokeWidth="0.6" />
          <T x={x0 - 6} y={Y(v) + 4} a="end" s={10} mono>{v.toFixed(2)}</T>
        </g>
      ))}
      {[6, 7, 8, 9, 10, 11, 12].map((t) => <T key={t} x={X(t)} y={y0 + 16} a="middle" s={10} mono>{t}</T>)}
      <T x={X(9)} y={y0 + 31} a="middle" s={10.5} c={C.faint}>tap number</T>
      <T x={16} y={36} s={10} c={C.faint}>mm</T>
      <rect x={X(10) - 11} y={Y(1.2) - 4} width={22} height={Y(0.6) - Y(1.2) + 8} fill="rgba(208,168,79,0.1)" />
      <path d={line(walsh)} fill="none" stroke={C.steel} strokeWidth="2" />
      <path d={line(frei)} fill="none" stroke={C.brass} strokeWidth="2" />
      {walsh.map(([t, v]) => <circle key={t} cx={X(t)} cy={Y(v)} r={3.2} fill={C.steel} />)}
      {frei.map(([t, v]) => <circle key={t} cx={X(t)} cy={Y(v)} r={3.2} fill={C.brass} />)}
      <T x={350} y={46} s={11} c={C.steel} w={600}>H.S. Walsh (UK)</T>
      <T x={350} y={62} s={11} c={C.brass} w={600}>Otto Frei (US)</T>
      <T x={350} y={76} s={10} c={C.faint}>chart states no units</T>
      <T x={350} y={104} s={11} c={C.text} w={600}>Tap 10 is</T>
      <T x={350} y={120} s={11} mono c={C.steel}>1.00 mm</T>
      <T x={350} y={135} s={10.5} c={C.dim}>or</T>
      <T x={350} y={150} s={11} mono c={C.brass}>0.90 mm</T>
      <T x={350} y={174} s={10.5} c={C.dim}>depending on</T>
      <T x={350} y={188} s={10.5} c={C.dim}>whose chart</T>
      <T x={14} y={248} s={11} c={C.text}>Write the thread in millimetres, and treat the tap number as a supplier’s code.</T>
    </F>
  )
}

function CtSizes() {
  return (
    <F h={240} view="Section · three sizes to record" scale="one supplier’s range">
      <rect x={20} y={70} width={40} height={84} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={40} y={94} width={130} height={36} fill="url(#qk-bcut)" stroke="#6b5a2a" strokeWidth="0.6" />
      <rect x={30} y={106} width={176} height={12} fill={C.dim} />
      <rect x={130} y={58} width={104} height={108} rx="8" fill="url(#qk-knurl)" stroke="#55646e" opacity="0.92" />
      <rect x={120} y={94} width={70} height={36} fill="url(#qk-bcut)" stroke="#6b5a2a" strokeWidth="0.6" opacity="0.9" />
      <rect x={120} y={106} width={86} height={12} fill={C.dim} />
      <line x1={252} y1={58} x2={286} y2={58} stroke={C.dim} strokeWidth="0.6" />
      <line x1={252} y1={166} x2={286} y2={166} stroke={C.dim} strokeWidth="0.6" />
      <Dim a={[278, 58]} b={[278, 166]} text="" off={0} />
      <T x={286} y={116} s={10.5} mono c={C.text}>crown Ø</T>
      <Dim a={[94, 94]} b={[94, 130]} text="" off={0} />
      <T x={86} y={86} a="middle" s={10.5} mono c={C.brassHi}>tube Ø</T>
      <Lab p={[196, 112]} x={196} y={44} text="post" up />
      <Tb
        x={14}
        y={190}
        rh={18}
        cols={[{ w: 110 }, { w: 90 }, { w: 90 }, { w: 162 }]}
        rows={[
          ['Tube opening', 'Post', 'Stem thread', 'Crown diameters'],
          ['2.0 mm', '1.3 mm', '0.90 mm', '4.0 to 6.5 mm'],
          ['2.5 mm', '1.4 mm', '0.90 mm', '4.5 to 7.0 mm'],
        ]}
      />
    </F>
  )
}

function CtGrease() {
  const tube = (x, ok) => (
    <g>
      <rect x={x} y={70} width={44} height={78} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={x + 20} y={92} width={126} height={32} fill="url(#qk-bcut)" stroke="#6b5a2a" strokeWidth="0.6" />
      <rect x={x + 6} y={104} width={160} height={7} fill={C.dim} />
      {ok ? (
        <g>
          <rect x={x + 46} y={89} width={100} height={3} fill={M.grease} />
          <rect x={x + 46} y={124} width={100} height={3} fill={M.grease} />
        </g>
      ) : (
        <g>
          <path d={`M${x + 46} 92 q20 -14 50 -6 q30 8 50 -1 l0 9 l-100 0 Z`} fill={M.grease} />
          <path d={`M${x + 20} 100 q-14 4 -22 18 q-6 12 6 12 q12 -4 16 -20 Z`} fill={M.grease} />
          <Arrow a={[x + 62, 108]} b={[x + 8, 108]} c="ruby" w={1.8} />
        </g>
      )}
    </g>
  )
  return (
    <F h={228} view="Section · grease on the tube" scale="schematic">
      <Pn x={12} y={28} w={222} h={138} t="Thin film" c={C.emerald} tc={C.emerald} />
      <Verdict x={214} y={46} ok r={8} />
      {tube(40, true)}
      <Pn x={246} y={28} w={222} h={138} t="Too much" c={C.ruby} tc={C.ruby} />
      <Verdict x={448} y={46} ok={false} r={8} />
      {tube(280, false)}
      <T x={123} y={160} a="middle" s={10.5} c={C.dim}>crown slides and seats easily</T>
      <T x={357} y={160} a="middle" s={10.5} c={C.dim}>goes in with the stem, causes faults</T>
      <T x={14} y={188} s={11} c={C.text}>A push-in crown slides with a slight, even drag.</T>
      <T x={14} y={204} s={10.5} c={C.dim}>A screw-down starts freely, stops firmly. If it binds, clean and check the threads.</T>
      <T x={14} y={219} s={10.5} c={C.faint}>A failed crown seal: replace the crown. No method for re-gasketing one was found.</T>
    </F>
  )
}

function CtTubes() {
  const P = [[12, 28], [246, 28], [12, 150], [246, 150]]
  const wall = (x, y, blind) => (
    <g>
      <rect x={x + 16} y={y + 26} width={70} height={74} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={x + (blind ? 44 : 16)} y={y + 50} width={blind ? 42 : 70} height={26} fill={M.ink} />
    </g>
  )
  const tube = (x, y, x1) => <rect x={x + x1} y={y + 53} width={112 - x1} height={20} fill="url(#qk-bcut)" stroke="#6b5a2a" strokeWidth="0.6" />
  const lab = (x, y, a, b, c) => (
    <g>
      <T x={x + 122} y={y + 46} s={10} c={C.text}>{a}</T>
      <T x={x + 122} y={y + 60} s={10} c={C.text}>{b}</T>
      <T x={x + 122} y={y + 84} s={10} c={C.ruby}>{c}</T>
    </g>
  )
  return (
    <F h={276} view="Section · how a tube is held" scale="schematic">
      {P.map(([x, y], i) => <Pn key={i} x={x} y={y} w={222} h={114} t={['Press-fit', 'Threaded', 'Friction, blind hole', 'Soldered'][i]} />)}
      {wall(12, 28)}
      {tube(12, 28, 20)}
      <rect x={32} y={78} width={66} height={3} fill={C.emerald} />
      <rect x={32} y={99} width={66} height={3} fill={C.emerald} />
      {lab(12, 28, 'Press out,', 'compound, press in', 'risk: orientation')}
      {wall(246, 28)}
      {tube(246, 28, 20)}
      <rect x={266} y={78} width={66} height={3.6} fill="url(#qk-thread)" />
      <rect x={266} y={98.4} width={66} height={3.6} fill="url(#qk-thread)" />
      {lab(246, 28, 'Heat, unscrew,', 'thread-lock', 'risk: crystal seal')}
      {wall(12, 150, true)}
      {tube(12, 150, 48)}
      {lab(12, 150, 'Heat, small easy-out,', 'compound, tap in', 'risk: tube snaps')}
      {wall(246, 150)}
      {tube(246, 150, 20)}
      <path d="M332 196 l14 6 l-14 6 Z M332 226 l14 -6 l-14 -6 Z" fill="#dfe3e6" />
      {lab(246, 150, 'Jig, drill, tap,', 'fit threaded tube', 'specialist work')}
    </F>
  )
}

function CtPress() {
  return (
    <F h={250} view="Section · changing a press-fit tube" scale="schematic">
      <Pn x={12} y={28} w={222} h={168} t="Out: punch on the tube" />
      <rect x={96} y={62} width={66} height={118} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={106} y={104} width={102} height={32} fill="url(#qk-bcut)" stroke="#6b5a2a" strokeWidth="0.6" />
      <rect x={106} y={113} width={102} height={14} fill={M.ink} />
      <rect x={34} y={113} width={78} height={14} fill="url(#sk-steelH)" stroke="#55646e" strokeWidth="0.6" />
      <rect x={26} y={106} width={14} height={28} rx="2" fill="#7c8d97" />
      <Arrow a={[176, 92]} b={[214, 92]} c="brass" />
      <T x={46} y={96} s={10.5} c={C.text}>punch</T>
      <T x={123} y={190} a="middle" s={10.5} c={C.dim}>bears on the tube, never the case</T>
      <Pn x={246} y={28} w={222} h={168} t="In: an old crown takes the tap" />
      <rect x={258} y={62} width={56} height={118} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={272} y={104} width={92} height={32} fill="url(#qk-bcut)" stroke="#6b5a2a" strokeWidth="0.6" />
      <rect x={340} y={92} width={34} height={56} rx="4" fill="url(#qk-knurl)" stroke="#55646e" />
      <T x={357} y={84} a="middle" s={10} c={C.dim}>old crown</T>
      <G x={398} y={120} ang={90} k={1}><Hammer /></G>
      <Arrow a={[444, 112]} b={[420, 112]} c="brass" w={1.6} />
      <T x={358} y={190} a="middle" s={10.5} c={C.dim}>plastic-faced hammer, light taps</T>
      <T x={14} y={216} s={11} c={C.text}>Note the cut-out’s direction before the old tube moves, and match it.</T>
      <T x={14} y={233} s={10.5} c={C.dim}>Loctite 638 is Omega’s specification for one tube type. Check what your case calls for.</T>
    </F>
  )
}

function CtHeat() {
  const out = [['Movement', 'out'], ['Crystal', 'out: heat damages its seal'], ['Gaskets', 'out'], ['Lume nearby', 'considered'], ['Crown', 'replaced with the tube']]
  return (
    <F h={240} view="Checklist · before any heat" scale="schematic">
      <rect x={30} y={70} width={150} height={88} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={120} y={100} width={92} height={28} fill="url(#qk-bcut)" stroke="#6b5a2a" strokeWidth="0.6" />
      <T x={84} y={118} a="middle" s={10.5} c={C.text}>bare case</T>
      <path d="M254 146 q-10 -18 -28 -26 q-12 -6 -18 -6 q10 -2 20 -12 q14 -14 26 -2 q-6 12 0 46 Z" fill="#e79a4a" opacity="0.9" />
      <path d="M248 132 q-8 -12 -22 -16 q12 -4 20 -10 q4 8 2 26 Z" fill="#f4d58a" />
      <rect x={250} y={126} width={12} height={46} rx="2" fill="url(#sk-steel)" stroke="#55646e" />
      <rect x={244} y={170} width={24} height={30} rx="3" fill="#7c8d97" stroke="#55646e" />
      <T x={218} y={82} s={10.5} c={C.brass}>focused butane torch</T>
      <T x={32} y={176} s={10.5} c={C.ruby}>A friction tube can snap, and leave a</T>
      <T x={32} y={190} s={10.5} c={C.ruby}>fragment to drill out.</T>
      <Tag x={296} y={38}>Out first</Tag>
      {out.map(([a, b], i) => (
        <g key={a}>
          <Verdict x={306} y={60 + i * 34} ok r={7} />
          <T x={320} y={58 + i * 34} s={11} c={C.text}>{a}</T>
          <T x={320} y={71 + i * 34} s={10} c={C.dim}>{b}</T>
        </g>
      ))}
      <T x={14} y={226} s={11} c={C.dim}>If a case is worth more than your confidence, send it out.</T>
    </F>
  )
}


/* ------------------------------------------------------------------ */
/* Lesson: rotating bezels                                              */
/* ------------------------------------------------------------------ */
// A bezel edge in section: case step below, teeth underneath, insert on top
function BezelSec({ x = 0, y = 0, lift = 0, teeth = true, spring = true, gasket = true, insert = true }) {
  const ty = y - lift
  return (
    <g>
      <path d={`M${x + 30} ${y + 210} L${x + 30} ${y + 112} L${x + 118} ${y + 112} L${x + 118} ${y + 136} L${x + 236} ${y + 136} L${x + 236} ${y + 210} Z`} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={x + 14} y={y + 100} width={96} height={12} fill="url(#qk-acr)" stroke={M.glass} />
      <path d={`M${x + 124} ${ty + 96} L${x + 240} ${ty + 96} L${x + 250} ${ty + 118} L${x + 250} ${ty + 156} L${x + 238} ${ty + 156} L${x + 238} ${ty + 120} L${x + 124} ${ty + 120} Z`} fill="url(#qk-cut)" stroke="#4e5f6a" />
      {insert && <rect x={x + 134} y={ty + 88} width={98} height={8} fill="#31464f" stroke={C.steel} strokeWidth="0.6" />}
      {teeth && Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${x + 156 + i * 9} ${ty + 120} l4.5 7 l4.5 -7 Z`} fill="#b7c3ca" stroke="#55646e" strokeWidth="0.4" />)}
      {spring && <rect x={x + 164} y={y + 130} width={56} height={3} fill={C.brassHi} />}
      {gasket && <circle cx={x + 136} cy={y + 128} r={7.4} fill={M.gasket} stroke={M.gasketEdge} strokeWidth="0.6" />}
    </g>
  )
}

function CbBuild() {
  const cx = 386, cy = 128, r = 66
  const teeth = Array.from({ length: 40 }, (_, i) => {
    const [a, b] = pol(cx, cy, r, i * 9)
    const [c2, d2] = pol(cx, cy, r - 9, i * 9 + 5)
    const [e, f] = pol(cx, cy, r, i * 9 + 9)
    return `L${a} ${b} L${c2} ${d2} L${e} ${f}`
  }).join(' ')
  return (
    <F h={262} view="Section and underside · snap bezel" scale="Seiko-type, schematic">
      <BezelSec />
      <Lead p={[182, 92]} t={[150, 46]} text="insert" s={10.5} a="start" />
      <Lead p={[240, 110]} t={[256, 72]} text="bezel" s={10.5} />
      <Lead p={[60, 106]} t={[52, 62]} text="crystal" s={10.5} />
      <Lab p={[136, 128]} x={96} y={232} text="gasket" c={M.gasket} />
      <Lab p={[190, 123]} x={170} y={232} text="teeth" c={C.dim} />
      <Lab p={[206, 131]} x={250} y={232} text="click spring" c={C.brassHi} />
      <T x={88} y={172} a="middle" s={10.5} c={C.text}>case middle</T>
      <path d={`M${cx + r} ${cy} ${teeth} Z`} fill="#bcc7ce" stroke="#55646e" strokeWidth="0.6" />
      <circle cx={cx} cy={cy} r={r - 14} fill="#1c1916" stroke={C.line} />
      <T x={cx} y={cy - 6} a="middle" s={10.5} c={C.dim}>seen from</T>
      <T x={cx} y={cy + 8} a="middle" s={10.5} c={C.dim}>below</T>
      <T x={cx} y={214} a="middle" s={10.5} c={C.brass}>From the dial side it turns</T>
      <T x={cx} y={228} a="middle" s={10.5} c={C.brass}>anticlockwise only</T>
      <T x={14} y={253} s={10.5} c={C.faint}>A knock can only overstate elapsed time. On these bezels the crystal stays on the case.</T>
    </F>
  )
}

function CbBall() {
  return (
    <F h={240} view="Section · ball detent" scale="forum summaries, check your model">
      <rect x={44} y={106} width={252} height={94} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={156} y={106} width={28} height={64} fill={M.ink} />
      <path d="M170 164 l-10 -7 l20 -7 l-20 -7 l20 -7 l-10 -7" fill="none" stroke={C.brassHi} strokeWidth="2.2" />
      <circle cx={170} cy={114} r={13} fill="url(#qk-cell)" stroke="#4e5f6a" />
      <path d="M156 106 l7 5 M184 106 l-7 5" stroke="#a3b3bd" strokeWidth="3.2" />
      <rect x={44} y={58} width={252} height={18} fill="url(#qk-cut)" stroke="#4e5f6a" />
      {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${56 + i * 18} 76 l9 12 l9 -12 Z`} fill="#b7c3ca" stroke="#55646e" strokeWidth="0.4" />)}
      <T x={170} y={52} a="middle" s={10.5} c={C.text}>bezel, with teeth underneath</T>
      <Lead p={[182, 114]} t={[314, 100]} text="ball" s={10.5} />
      <Lead p={[160, 108]} t={[314, 122]} text="peened top keeps it in" s={10.5} c={C.dim} />
      <Lead p={[176, 148]} t={[314, 146]} text="spring" s={10.5} c={C.brassHi} />
      <Lead p={[260, 150]} t={[314, 170]} text="case" s={10.5} />
      <T x={14} y={220} s={11} c={C.ruby}>Lift slowly over a tray: the ball can jump out as the bezel comes up.</T>
      <T x={14} y={235} s={10.5} c={C.dim}>A perished O-ring is a reported fault. A pen ball can cut a groove, so don’t use one.</T>
    </F>
  )
}

function CbLift() {
  return (
    <F h={262} view="Side view and plan · lifting a bezel" scale="schematic">
      <rect x={28} y={156} width={196} height={34} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <T x={126} y={178} a="middle" s={10.5} c={C.text}>case</T>
      <rect x={22} y={138} width={208} height={16} rx="2" fill="#b7c3ca" stroke="#55646e" />
      <T x={126} y={150} a="middle" s={10} c="#16191b">bezel</T>
      <rect x={60} y={112} width={132} height={22} rx="2" fill="#6e6158" stroke={C.struct} />
      <T x={126} y={127} a="middle" s={10} c={C.text}>plastic die on the crystal</T>
      <path d="M18 196 h216 v24 h-216 Z" fill="#3a352e" stroke={C.struct} />
      <T x={126} y={213} a="middle" s={10.5} c={C.dim}>padded vice</T>
      <G x={226} y={155} ang={-100} k={0.9}><CaseKnife len={80} /></G>
      <Lab p={[232, 155]} x={272} y={120} text="under the teeth" c={C.brass} up />
      <circle cx={392} cy={120} r={56} fill="#b7c3ca" stroke="#55646e" />
      <circle cx={392} cy={120} r={42} fill="url(#qk-acr)" stroke={M.glass} />
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => <rect key={i} x={392 + a * 36 - 8} y={120 + b * 56 - (b < 0 ? 16 : -2)} width={16} height={16} rx="3" fill="#7f8e97" />)}
      <rect x={385} y={52} width={14} height={18} fill={C.emerald} />
      <rect x={385} y={170} width={14} height={18} fill={C.emerald} />
      <T x={392} y={44} a="middle" s={10.5} c={C.emerald}>between the lugs</T>
      <T x={392} y={206} a="middle" s={10.5} c={C.dim}>a slip here won’t show</T>
      <T x={14} y={240} s={11} c={C.text}>A little at a time, all round. If it won’t move, stop: force bends a bezel.</T>
      <T x={14} y={255} s={10.5} c={C.dim}>Stuck causes: poor refitting, a forced bezel, a misangled spring, packed dirt.</T>
    </F>
  )
}

function CbSpring() {
  const cx = 130, cy = 134, r = 92
  const [s1x, s1y] = pol(cx, cy, r - 12, 200)
  const [s2x, s2y] = pol(cx, cy, r - 12, 250)
  return (
    <F h={258} view="Plan · bezel off" scale="one Seiko design, schematic">
      <circle cx={cx} cy={cy} r={r} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <circle cx={cx} cy={cy} r={r - 24} fill="url(#qk-acr)" stroke={M.glass} />
      <circle cx={cx} cy={cy} r={r - 12} fill="none" stroke={M.ink} strokeWidth="10" opacity="0.5" />
      <path d={`M${s1x} ${s1y} A${r - 12} ${r - 12} 0 0 1 ${s2x} ${s2y}`} fill="none" stroke={C.brassHi} strokeWidth="3" />
      <circle cx={s1x} cy={s1y} r={4} fill={M.ink} stroke={C.brassHi} />
      <circle cx={s2x} cy={s2y} r={4} fill={M.ink} stroke={C.brassHi} />
      <line x1={s1x} y1={s1y} x2={24} y2={240} stroke={C.struct} strokeWidth="0.8" opacity="0.8" />
      <T x={14} y={252} s={10.5} c={C.brassHi}>foot in a case hole</T>
      <Lead p={[s2x, s2y]} t={[56, 40]} text="foot" s={10.5} c={C.brassHi} />
      <Lead p={pol(cx, cy, r - 12, 226)} t={[46, 84]} text="spring" s={10.5} c={C.brassHi} dot={false} />
      <Tag x={254} y={40}>Before anything moves</Tag>
      {[['Photograph it', 'position and which way round'], ['Lift it out', 'store it where you’ll find it'], ['Clean the channel', 'pegwood and Rodico'], ['Check the spring', 'feet intact, no kink']].map(([a, b], i) => (
        <g key={a}>
          <Num x={264} y={60 + i * 34} n={i + 1} r={8} />
          <T x={278} y={58 + i * 34} s={11} c={C.text}>{a}</T>
          <T x={278} y={71 + i * 34} s={10} c={C.dim}>{b}</T>
        </g>
      ))}
      <Pn x={254} y={196} w={214} h={52} />
      <path d="M270 228 q14 -14 30 -4 l10 -10 l12 16 q16 -8 28 2" fill="none" stroke={C.brassHi} strokeWidth="2.6" />
      <Verdict x={372} y={222} ok={false} r={8} />
      <T x={388} y={226} s={10.5} c={C.text}>kinked: replace</T>
    </F>
  )
}

function CbGasket() {
  const row = (x, mm, c, a, b) => (
    <g>
      <rect x={x + 22} y={132} width={100} height={12} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={x + 22} y={132 - mm * 56 - 10} width={100} height={10} fill="#b7c3ca" stroke="#55646e" />
      <circle cx={x + 72} cy={132 - mm * 28} r={mm * 28} fill={M.gasket} stroke={M.gasketEdge} strokeWidth="0.6" />
      <Dim a={[x + 134, 132]} b={[x + 134, 132 - mm * 56]} text="" off={0} />
      <T x={x + 72} y={164} a="middle" s={13} mono c={c} w={700}>{mm.toFixed(1)} mm</T>
      <T x={x + 72} y={180} a="middle" s={10.5} c={C.text}>{a}</T>
      <T x={x + 72} y={194} a="middle" s={10} c={C.dim}>{b}</T>
    </g>
  )
  return (
    <F h={250} view="Section · bezel gasket sizes" scale="retail figures, Seiko types">
      <Pn x={12} y={28} w={148} h={174} />
      <Pn x={166} y={28} w={148} h={174} />
      <Pn x={320} y={28} w={148} h={174} />
      {row(12, 0.6, C.steel, 'smoother rotation', 'too thin: may pop off')}
      {row(166, 0.7, C.steel, 'smoother rotation', 'between the two')}
      {row(320, 0.8, C.brass, 'most common, OEM', 'any thicker: it sticks')}
      <T x={14} y={222} s={11} c={C.dim}>Compare with what came out of your watch. Hold it in the groove with a little</T>
      <T x={14} y={238} s={11} c={C.dim}>silicone grease and pegwood, flat and unstretched all the way round.</T>
    </F>
  )
}

function CbPress() {
  return (
    <F h={252} view="Section · pressing a bezel on" scale="schematic">
      <G x={190} y={100} k={1}><Ram w={230} h={30} stem={36} c="#6e6158" /></G>
      <T x={190} y={88} a="middle" s={10.5} c={C.text}>plastic die, clear of the crystal</T>
      <path d="M72 124 L72 106 L92 100 L288 100 L308 106 L308 124 Z" fill="#b7c3ca" stroke="#55646e" />
      <rect x={96} y={104} width={188} height={8} fill="url(#qk-acr)" stroke={M.glass} />
      <rect x={84} y={126} width={212} height={40} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <T x={190} y={150} a="middle" s={10.5} c={C.text}>case</T>
      <rect x={58} y={168} width={264} height={18} fill="#6d7f8a" stroke="#4e5f6a" />
      <T x={190} y={181} a="middle" s={10} c="#16191b">lower die</T>
      <Arrow a={[316, 40]} b={[316, 74]} c="brass" />
      <T x={324} y={56} s={10.5} c={C.brass}>square, even</T>
      <line x1={190} y1={30} x2={190} y2={196} stroke={C.ruby} strokeWidth="0.7" strokeDasharray="6 3 1 3" />
      <Pn x={342} y={84} w={126} h={108} t="Then check" />
      <Note x={352} y={118} s={10.5} lh={15} lines={['Heard the click?', 'Full circle turn:', 'clicks even, no grit,', 'firm clockwise stop.']} />
      <T x={14} y={216} s={11} c={C.text}>Confirm the spring is seated before the press comes down.</T>
      <T x={14} y={233} s={10.5} c={C.dim}>If it’s stiff or gritty, take it off and re-check the spring position and gasket.</T>
    </F>
  )
}

function CbInsert() {
  return (
    <F h={250} view="Section · lifting an insert" scale="schematic, magnified">
      <path d="M60 170 L60 116 L330 116 L352 138 L352 170 Z" fill="url(#qk-cut)" stroke="#4e5f6a" />
      <T x={200} y={150} a="middle" s={10.5} c={C.text}>bezel</T>
      <rect x={76} y={108} width={250} height={3} fill={C.emerald} />
      <path d="M76 108 L76 88 L326 88 L326 108 Z" fill="#31464f" stroke={C.steel} />
      <T x={200} y={102} a="middle" s={10.5} c={C.text}>insert</T>
      <G x={100} y={110} ang={-82} k={0.9}><CaseKnife len={86} /></G>
      <T x={22} y={60} s={10.5} c={C.brass}>blade in from the</T>
      <T x={22} y={74} s={10.5} c={C.brass}>inside edge</T>
      <Lead p={[320, 110]} t={[350, 100]} text="double-sided adhesive" s={10.5} c={C.emerald} sub="flat, no overhang" />
      <Lead p={[326, 92]} t={[350, 56]} text="outside edge shows" s={10.5} sub="so keep tools off it" />
      <Tb
        x={14}
        y={194}
        rh={17}
        head={false}
        cols={[{ w: 130 }, { w: 322 }]}
        rows={[
          ['Steel, aluminium', 'bends: don’t expect to re-use it'],
          [{ t: 'Ceramic', c: C.ruby }, { t: 'can shatter: wear eye protection', c: C.ruby }],
          ['Track', 'clean with ethanol or citrus remover, and scrape the residue'],
        ]}
      />
    </F>
  )
}

function CbAlign() {
  const strip = (y, off, ok, a, b) => {
    const x0 = 40, p = 26
    return (
      <g>
        <rect x={x0 - 14} y={y} width={p * 10 + 28} height={22} fill="#31464f" stroke={C.steel} />
        {Array.from({ length: 11 }, (_, i) => <line key={i} x1={x0 + i * p} y1={y + 2} x2={x0 + i * p} y2={y + 10} stroke={C.text} strokeWidth="1" />)}
        <path d={`M${x0 + 5 * p + off} ${y + 20} l-6 -9 h12 Z`} fill={C.brassHi} />
        <rect x={x0 + 5 * p - 1.5} y={y + 30} width={3} height={18} fill={M.dial} />
        <T x={x0 + 5 * p} y={y + 62} a="middle" s={10} c={C.faint}>dial 12</T>
        <Verdict x={330} y={y + 18} ok={ok} r={8} />
        <T x={346} y={y + 16} s={11} c={C.text} w={600}>{a}</T>
        <T x={346} y={y + 30} s={10.5} c={C.dim}>{b}</T>
      </g>
    )
  }
  return (
    <F h={244} view="Strip view · insert against the dial" scale="schematic">
      {strip(40, 0, true, 'On the click', 'markers line up')}
      {strip(126, 13, false, 'Half a click out', 'turning won’t cure it')}
      <T x={14} y={224} s={11} c={C.dim}>Rest the bare bezel on its click, then fit the insert. If out, lift and reset.</T>
    </F>
  )
}


/* ------------------------------------------------------------------ */
/* Lesson: bracelets                                                    */
/* ------------------------------------------------------------------ */
// Three-piece link cut along its pin. Children draw the pin.
function LinkSec({ x, y, w = 124, h = 26, children }) {
  const a = w * 0.26
  return (
    <g>
      <rect x={x} y={y} width={a} height={h} rx="2" fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={x + a + 1.5} y={y} width={w - 2 * a - 3} height={h} rx="2" fill="#8fa1ad" stroke="#4e5f6a" />
      <rect x={x + w - a} y={y} width={a} height={h} rx="2" fill="url(#qk-cut)" stroke="#4e5f6a" />
      {children}
    </g>
  )
}

function CrTypes() {
  const cell = (x, y, name, l, children) => (
    <g>
      <Pn x={x} y={y} w={148} h={116} t={name} />
      <LinkSec x={x + 12} y={y + 34}>{children(x + 12, y + 34)}</LinkSec>
      <Note x={x + 74} y={y + 82} a="middle" s={10} lh={13} lines={l} />
    </g>
  )
  const pin = (x, y, x1, x2, c = 'url(#sk-steel)') => <rect x={x + x1} y={y + 10} width={x2 - x1} height={6} fill={c} stroke="#3e4a52" strokeWidth="0.4" />
  return (
    <F h={286} view="Section · six kinds of pin" scale="schematic">
      {cell(12, 28, 'Single screw', ['slot on one side,', 'smooth tip on the other'], (x, y) => (
        <g>
          {pin(x, y, 0, 124)}
          <rect x={x + 64} y={y + 10} width={60} height={6} fill="url(#qk-thread)" />
          <rect x={x - 5} y={y + 6} width={6} height={14} rx="1" fill="#e4e9ec" stroke="#3e4a52" strokeWidth="0.5" />
        </g>
      ))}
      {cell(166, 28, 'Double screw', ['slots on both sides:', 'the hardest type'], (x, y) => (
        <g>
          {pin(x, y, 0, 124)}
          <rect x={x + 44} y={y + 10} width={36} height={6} fill="url(#qk-thread)" />
          <rect x={x - 5} y={y + 6} width={6} height={14} rx="1" fill="#e4e9ec" stroke="#3e4a52" strokeWidth="0.5" />
          <rect x={x + 123} y={y + 6} width={6} height={14} rx="1" fill="#e4e9ec" stroke="#3e4a52" strokeWidth="0.5" />
        </g>
      ))}
      {cell(320, 28, 'Split pin', ['messy heads, arrows', 'stamped inside the link'], (x, y) => (
        <g>
          {pin(x, y, 0, 96)}
          <path d={`M${x + 96} ${y + 10} L${x + 124} ${y + 8} L${x + 124} ${y + 12} L${x + 100} ${y + 13} L${x + 124} ${y + 14} L${x + 124} ${y + 18} L${x + 96} ${y + 16} Z`} fill="url(#sk-steel)" stroke="#3e4a52" strokeWidth="0.4" />
          <Arrow a={[x + 44, y - 6]} b={[x + 84, y - 6]} c="brass" w={1.6} />
        </g>
      ))}
      {cell(12, 152, 'Pin and collar', ['round pin, tiny collar', 'hidden in the centre link'], (x, y) => (
        <g>
          {pin(x, y, 0, 124)}
          <rect x={x + 54} y={y + 7} width={16} height={12} rx="1" fill={C.brass} stroke={M.ink} strokeWidth="0.5" />
        </g>
      ))}
      {cell(166, 152, 'Friction pin', ['smooth cylinder held', 'by friction: least secure'], (x, y) => pin(x, y, 0, 124))}
      {cell(320, 152, 'Tapered pin', ['different at each end:', 'a cotter pin, see step 6'], (x, y) => (
        <path d={`M${x} ${y + 11} L${x + 124} ${y + 9} L${x + 124} ${y + 17} L${x} ${y + 15} Z`} fill="url(#sk-steel)" stroke="#3e4a52" strokeWidth="0.4" />
      ))}
    </F>
  )
}

function CrPlan() {
  const chain = (y, left, right, hl, hr) => {
    const w = 15, x = 240
    return (
      <g>
        <rect x={x - 22} y={y - 16} width={44} height={32} rx="6" fill="#d8dee2" stroke="#55646e" />
        <circle cx={x} cy={y} r={11} fill="#25221f" />
        {Array.from({ length: left }, (_, i) => (
          <rect key={i} x={x - 26 - (i + 1) * (w + 1)} y={y - 11} width={w} height={22} rx="2" fill={i >= left - hl ? 'url(#sk-noglue)' : 'url(#sk-steel)'} stroke={i >= left - hl ? C.ruby : '#55646e'} strokeWidth="0.7" />
        ))}
        {Array.from({ length: right }, (_, i) => (
          <rect key={i} x={x + 26 + i * (w + 1)} y={y - 11} width={w} height={22} rx="2" fill={i >= right - hr ? 'url(#sk-noglue)' : 'url(#sk-steel)'} stroke={i >= right - hr ? C.ruby : '#55646e'} strokeWidth="0.7" />
        ))}
      </g>
    )
  }
  return (
    <F h={228} view="Plan · taking out four links" scale="schematic, bracelet laid flat">
      <T x={14} y={42} s={11} c={C.text} w={600}>Centred clasp, the default</T>
      <T x={466} y={42} a="end" s={10.5} c={C.faint}>2 from each side (Esslinger)</T>
      {chain(72, 11, 11, 2, 2)}
      <T x={14} y={118} s={11} c={C.text} w={600}>Clasp towards 6, for comfort</T>
      <T x={466} y={118} a="end" s={10.5} c={C.faint}>more from the 6 o’clock side (Fratello)</T>
      {chain(148, 11, 11, 1, 3)}
      <T x={150} y={182} a="middle" s={10} c={C.faint}>12 o’clock side</T>
      <T x={330} y={182} a="middle" s={10} c={C.faint}>6 o’clock side</T>
      <T x={14} y={204} s={10.5} c={C.dim}>Hatched links come out. The clasp sits at the far ends, under the wrist.</T>
      <T x={14} y={219} s={10.5} c={C.dim}>Fold the links out on the wrist to count. Set any micro-adjust to its centre first.</T>
    </F>
  )
}

function CrScrews() {
  return (
    <F h={262} view="Side view · double-sided screw" scale="schematic">
      <rect x={40} y={210} width={190} height={14} rx="2" fill="#3a352e" stroke={C.struct} />
      <rect x={110} y={190} width={50} height={20} fill="#6d7f8a" stroke="#4e5f6a" />
      <T x={70} y={204} a="middle" s={10} c={C.dim}>clamped</T>
      <G x={135} y={140} ang={180} k={0.62}><Screwdriver len={80} blade={12} /></G>
      <rect x={118} y={100} width={34} height={38} rx="2" fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={132} y={96} width={6} height={46} fill="url(#qk-thread)" />
      <G x={135} y={96} k={0.75}><Screwdriver len={78} blade={12} /></G>
      <path d="M110 58 a28 10 0 1 0 50 0" fill="none" stroke={C.brass} strokeWidth="2" markerEnd="url(#sk-a-brass)" />
      <Lead p={[150, 118]} t={[184, 112]} text="link, bracelet off the watch" s={10.5} />
      <T x={168} y={58} s={10.5} c={C.brass}>top driver turns</T>
      <T x={168} y={168} s={10.5} c={C.dim}>bottom driver held still</T>
      <Pn x={322} y={28} w={146} h={172} t="Driver fit" />
      {[[60, true, 'fills the slot'], [116, false, 'too small: lifts out']].map(([y, ok, t], i) => (
        <g key={t}>
          <rect x={344} y={y + 14} width={66} height={12} rx="1" fill="#c5ced4" stroke="#55646e" />
          <rect x={352} y={y + 14} width={50} height={5} fill={M.ink} />
          <rect x={ok ? 353 : 368} y={y - 6} width={ok ? 48 : 18} height={24} fill="url(#sk-steelH)" />
          <Verdict x={438} y={y + 10} ok={ok} r={8} />
          <T x={395} y={y + 40} a="middle" s={10} c={C.dim}>{t}</T>
        </g>
      ))}
      <T x={14} y={240} s={10.5} c={C.dim}>Screws are typically 1.2 or 1.4 mm, drivers 1.0 to 1.6 mm (one source: measure yours).</T>
      <T x={14} y={255} s={10.5} c={C.dim}>Glued screw: dip only the bracelet in boiling water, then let it cool and try again.</T>
    </F>
  )
}

function CrSplit() {
  const link = (x, up) => (
    <g>
      <rect x={x + 10} y={132} width={150} height={34} fill="#3a352e" stroke={C.struct} />
      <rect x={x + 76} y={132} width={18} height={34} fill={M.ink} />
      <rect x={x + 42} y={74} width={86} height={58} rx="3" fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={x + 82} y={up ? 64 : 88} width={6} height={up ? 66 : 62} fill="url(#sk-steel)" stroke="#3e4a52" strokeWidth="0.4" />
      <path d={`M${x + 58} 92 v22 m-5 -7 l5 7 l5 -7`} fill="none" stroke={C.text} strokeWidth="1.6" />
    </g>
  )
  return (
    <F h={258} view="Section · split pin, out and back" scale="schematic">
      <Pn x={12} y={28} w={222} h={160} t="Out, with the arrow" c={C.emerald} tc={C.emerald} />
      {link(38, false)}
      <G x={123} y={88} k={0.55}><Pusher d={7} len={60} /></G>
      <Arrow a={[160, 50]} b={[160, 92]} c="brass" />
      <T x={123} y={182} a="middle" s={10.5} c={C.dim}>arrow points down, into the holder</T>
      <Pn x={246} y={28} w={222} h={160} t="Back, against the arrow" c={C.brass} tc={C.brass} />
      {link(272, true)}
      <Arrow a={[394, 92]} b={[394, 50]} c="brass" />
      <T x={357} y={182} a="middle" s={10.5} c={C.dim}>same way round, then flush both sides</T>
      <T x={14} y={208} s={11} c={C.text}>Use the largest pusher that passes smoothly, kept upright, and a flat hammer face.</T>
      <T x={14} y={225} s={10.5} c={C.dim}>Pushers: typically 0.7 to 1.0 mm (one source). Push a stuck sleeve out separately.</T>
      <T x={14} y={241} s={10.5} c={C.ruby}>Pin won’t move? Read the arrow again before you hit it harder.</T>
    </F>
  )
}

function CrCollar() {
  const panel = (x, n, a, b, d) => (
    <g>
      <Pn x={x} y={28} w={148} h={128} />
      <Num x={x + 16} y={44} n={n} r={8} />
      {d}
      <T x={x + 74} y={134} a="middle" s={11} c={C.text} w={600}>{a}</T>
      <T x={x + 74} y={148} a="middle" s={10} c={C.dim}>{b}</T>
    </g>
  )
  const collar = (x, y, rev) => <path d={rev ? `M${x} ${y} h16 v12 h-16 l6 -6 Z` : `M${x} ${y} h16 l-6 6 l6 6 h-16 Z`} fill={C.brass} stroke={M.ink} strokeWidth="0.5" />
  return (
    <F h={236} view="Sequence · pin and collar" scale="schematic">
      {panel(12, 1, 'Catch the collar', 'punch out over a tray', (
        <g>
          <LinkSec x={24} y={68} />
          {collar(78, 112)}
          <path d="M18 122 H154" stroke={C.struct} strokeWidth="2" />
          <Arrow a={[86, 96]} b={[86, 108]} c="brass" w={1.4} />
        </g>
      ))}
      {panel(166, 2, 'Collar first', 'into the centre link', (
        <LinkSec x={178} y={68}>{collar(232, 75)}<Arrow a={[240, 54]} b={[240, 70]} c="brass" w={1.4} /></LinkSec>
      ))}
      {panel(320, 3, 'Then the pin', 'tap it through', (
        <LinkSec x={332} y={68}>
          <rect x={332} y={78} width={100} height={6} fill="url(#sk-steel)" stroke="#3e4a52" strokeWidth="0.4" />
          {collar(386, 75)}
          <Arrow a={[456, 81]} b={[436, 81]} c="brass" w={1.4} />
        </LinkSec>
      ))}
      <Sep x1={14} y1={168} x2={466} y2={168} />
      <T x={14} y={188} s={11} c={C.text}>Push the pin lightly with a finger. If it slides, reverse the collar.</T>
      <T x={14} y={205} s={10.5} c={C.dim}>Count collars before and after. A lost one means waiting for a part.</T>
      <T x={14} y={221} s={10.5} c={C.dim}>Use a tray with a raised edge. A collar dropped on a hard floor is gone.</T>
    </F>
  )
}

function CrTaper() {
  return (
    <F h={214} view="Detail · checking a pin" scale="taper exaggerated, sample readings">
      <path d="M70 92 L400 80 L400 112 L70 100 Z" fill="url(#sk-steel)" stroke="#3e4a52" />
      {[[80, '0.9 mm'], [390, '1.0 mm']].map(([x, t]) => (
        <g key={x}>
          <path d={`M${x - 16} 44 L${x + 16} 44 L${x + 16} 52 L${x + 4} 52 L${x + 4} ${x < 200 ? 90 : 78} L${x - 4} ${x < 200 ? 90 : 78} L${x - 4} 52 L${x - 16} 52 Z`} fill="#b7c3ca" stroke="#55646e" />
          <path d={`M${x - 4} ${x < 200 ? 102 : 114} L${x + 4} ${x < 200 ? 102 : 114} L${x + 4} 140 L${x - 4} 140 Z`} fill="#b7c3ca" stroke="#55646e" />
          <rect x={x - 30} y={140} width={60} height={22} rx="3" fill="#b7c9b5" stroke={C.struct} />
          <T x={x} y={155} a="middle" s={11} mono c="#16302a" w={700}>{t}</T>
        </g>
      ))}
      <T x={236} y={70} a="middle" s={11} c={C.ruby} w={600}>different at each end: tapered</T>
      <T x={236} y={146} a="middle" s={10.5} c={C.dim}>same at both ends:</T>
      <T x={236} y={160} a="middle" s={10.5} c={C.dim}>an ordinary pin</T>
      <T x={14} y={186} s={11} c={C.text}>A tapered pin is a cotter pin and needs another method, so look it up first.</T>
      <T x={14} y={203} s={10.5} c={C.dim}>Cut new long pins flush, and file the end outside the band, not in it.</T>
    </F>
  )
}

function CrFit() {
  return (
    <F h={246} view="Section and detail · the final check" scale="schematic">
      <Pn x={12} y={28} w={222} h={160} t="On the wrist" />
      <ellipse cx={123} cy={112} rx={78} ry={46} fill="#7a5a44" stroke="#4d382a" />
      <path d="M42 112 A82 58 0 0 1 204 112 A82 58 0 0 1 42 112 Z" fill="none" stroke={C.steel} strokeWidth="4" strokeDasharray="10 2" />
      <ellipse cx={123} cy={160} rx={12} ry={7} fill="#c99d7c" stroke="#7a5a44" />
      <Lab p={[123, 160]} x={123} y={182} text="one finger: correct. Two: too loose" c={C.text} />
      <Pn x={246} y={28} w={222} h={160} t="Spring bar, both ends home" />
      <rect x={262} y={72} width={24} height={72} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={430} y={72} width={24} height={72} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={272} y={101} width={14} height={14} fill={M.ink} />
      <rect x={430} y={101} width={14} height={14} fill={M.ink} />
      <rect x={290} y={103} width={136} height={10} rx="3" fill="url(#sk-steel)" stroke="#55646e" />
      <rect x={272} y={105} width={18} height={6} rx="1" fill="url(#sk-steelH)" />
      <rect x={426} y={105} width={18} height={6} rx="1" fill="url(#sk-steelH)" />
      <T x={358} y={92} a="middle" s={10.5} c={C.text}>spring bar</T>
      <T x={274} y={160} a="middle" s={10} c={C.dim}>lug</T>
      <T x={442} y={160} a="middle" s={10} c={C.dim}>lug</T>
      <T x={358} y={176} a="middle" s={10.5} c={C.dim}>wrong diameter or length risks the watch</T>
      <T x={14} y={208} s={11} c={C.text}>Flex every link and run a fingernail over each pin end: nothing should catch.</T>
      <T x={14} y={225} s={10.5} c={C.dim}>Then push the bracelet both ways, to prove both bar ends have engaged.</T>
    </F>
  )
}

function CrStretch() {
  const pair = (x, worn) => (
    <g>
      {worn ? (
        <path d={`M${x + 4} 70 L${x + 74} 70 Q${x + 86} 74 ${x + 88} 96 Q${x + 86} 118 ${x + 74} 122 L${x + 4} 122 Z`} fill="url(#qk-cut)" stroke="#4e5f6a" />
      ) : (
        <rect x={x + 4} y={70} width={84} height={52} rx="2" fill="url(#qk-cut)" stroke="#4e5f6a" />
      )}
      {worn ? (
        <path d={`M${x + 186} 70 L${x + 114} 70 Q${x + 102} 74 ${x + 100} 96 Q${x + 102} 118 ${x + 114} 122 L${x + 186} 122 Z`} fill="#8fa1ad" stroke="#4e5f6a" />
      ) : (
        <rect x={x + 92} y={70} width={94} height={52} rx="2" fill="#8fa1ad" stroke="#4e5f6a" />
      )}
      {worn ? <ellipse cx={x + 56} cy={96} rx={11} ry={7} fill={M.ink} /> : <circle cx={x + 56} cy={96} r={7} fill={M.ink} />}
      <circle cx={x + (worn ? 50 : 56)} cy={96} r={worn ? 5 : 6.4} fill="url(#sk-barEnd)" />
    </g>
  )
  return (
    <F h={254} view="Section · where stretch comes from" scale="schematic, wear exaggerated">
      <Pn x={12} y={28} w={222} h={112} t="As new" c={C.emerald} tc={C.emerald} />
      {pair(26, false)}
      <Pn x={246} y={28} w={222} h={112} t="Stretched" c={C.ruby} tc={C.ruby} />
      {pair(262, true)}
      <Lab p={[312, 100]} x={330} y={134} text="worn pin, ovalled hole" s={10} />
      <Lead p={[356, 80]} t={[376, 50]} text="edge metal lost" s={10} c={C.text} />
      <Tb
        x={14}
        y={162}
        rh={19}
        s={10.5}
        cols={[{ w: 122 }, { w: 160 }, { w: 170 }]}
        rows={[
          ['Cause', 'What helps', 'Limit'],
          ['Pin wear', 'new pins, at home', 'improves the play only'],
          ['Lost edge metal', 'laser weld, file, refinish', 'specialist work'],
          ['Several links bad', 'a new bracelet', 'may make more sense'],
        ]}
      />
      <T x={14} y={246} s={10.5} c={C.faint}>Hang the bracelet to judge it, and keep side links in their original positions.</T>
    </F>
  )
}


/* ------------------------------------------------------------------ */
/* Lesson: water testing                                                */
/* ------------------------------------------------------------------ */
function CwPressure() {
  const x0 = 120, W = 300
  const X = (b) => x0 + (b / 40) * W
  const rows = [['3 bar', '30 m', 3, null], ['5 bar', '50 m', 5, null], ['10 bar', '100 m', 10, 12.5], ['20 bar', '200 m', 20, 25], ['30 bar', '300 m', 30, 37.5]]
  return (
    <F h={286} view="Chart · test pressure by rating" scale="calculated from ISO 22810, 6425">
      <rect x={18} y={34} width={11} height={9} fill={C.steel} />
      <T x={34} y={43} s={10.5} c={C.dim}>ISO 22810, ordinary watch: tests at its rating</T>
      <rect x={274} y={34} width={11} height={9} fill={C.brass} />
      <T x={290} y={43} s={10.5} c={C.dim}>ISO 6425, divers only: 125%</T>
      {[0, 10, 20, 30, 40].map((b) => (
        <g key={b}>
          <line x1={X(b)} y1={56} x2={X(b)} y2={236} stroke={C.line} strokeWidth="0.7" />
          <T x={X(b)} y={250} a="middle" s={10} mono>{b}</T>
        </g>
      ))}
      <T x={X(40) + 8} y={250} s={10} c={C.faint}>bar</T>
      {rows.map(([n, m, a, d], i) => {
        const y = 62 + i * 35
        return (
          <g key={n}>
            <T x={14} y={y + 11} s={11} c={C.text} w={600}>{n}</T>
            <T x={14} y={y + 24} s={10} c={C.faint}>{m}</T>
            <rect x={x0} y={y} width={X(a) - x0} height={12} rx="2" fill={C.steel} />
            <T x={X(a) + 5} y={y + 10} s={10} mono c={C.text}>{a}</T>
            {d ? (
              <g>
                <rect x={x0} y={y + 14} width={X(d) - x0} height={12} rx="2" fill={C.brass} />
                <T x={X(d) + 5} y={y + 24} s={10} mono c={C.brass}>{d}</T>
              </g>
            ) : (
              <T x={x0 + 2} y={y + 24} s={10} c={C.faint}>no diver’s test at this rating</T>
            )}
          </g>
        )
      })}
      <T x={14} y={272} s={11} c={C.text}>A 100 m sports watch that isn’t a diver’s watch tests at 10 bar, not 12.5.</T>
    </F>
  )
}

function CwLimit() {
  const x0 = 26, W = 428
  const X = (b) => x0 + (b / 40) * W
  return (
    <F h={246} view="Scale · what a test can prove" scale="pressure in bar">
      <rect x={X(10)} y={70} width={X(40) - X(10)} height={26} fill="url(#sk-noglue)" stroke={C.ruby} />
      <T x={X(25)} y={88} a="middle" s={11} c={C.text}>not proven by a 10 bar tester</T>
      <rect x={x0} y={70} width={X(10) - x0} height={26} fill="rgba(123,165,131,0.3)" stroke={C.emerald} />
      <T x={X(5)} y={88} a="middle" s={10.5} c={C.text}>ProofMaster</T>
      <rect x={x0} y={44} width={X(3) - x0} height={20} fill="rgba(134,167,189,0.45)" stroke={C.steel} />
      <T x={X(3) + 6} y={58} s={10.5} c={C.text}>Bergeon 5555/98: 3 atm</T>
      <line x1={x0} y1={108} x2={X(40)} y2={108} stroke={C.struct} strokeWidth="1.4" />
      {[0, 10, 20, 30, 40].map((b) => (
        <g key={b}>
          <line x1={X(b)} y1={103} x2={X(b)} y2={113} stroke={C.struct} strokeWidth="1.2" />
          <T x={X(b)} y={126} a="middle" s={10} mono>{b}</T>
        </g>
      ))}
      {[[20, '200 m', C.steel, 142], [25, '200 m diver', C.brass, 158], [30, '300 m', C.steel, 142], [37.5, '300 m diver', C.brass, 158]].map(([b, t, c, y]) => (
        <g key={t}>
          <line x1={X(b)} y1={b % 10 ? 110 : 130} x2={X(b)} y2={y - 10} stroke={c} strokeWidth="1" />
          <T x={X(b)} y={y} a="middle" s={10} c={c}>{t}</T>
        </g>
      ))}
      <Sep x1={14} y1={172} x2={466} y2={172} />
      <T x={14} y={192} s={11} c={C.text}>Tell the owner the pressure you actually reached, and write it on the job.</T>
      <Tb
        x={14}
        y={212}
        rh={15}
        head={false}
        cols={[{ w: 150 }, { w: 150 }, { w: 152 }]}
        rows={[['1 atm: about 1 bar', '1 kg/cm²: about 0.98 bar', '1 MPa: 10 bar'], ['1 bar: 10 m', '', '']]}
      />
    </F>
  )
}

function CwPrep() {
  const panel = (x, t, ok, d, a, b) => (
    <g>
      <Pn x={x} y={28} w={148} h={132} t={t} c={ok ? C.emerald : C.ruby} tc={ok ? C.emerald : C.ruby} />
      <Verdict x={x + 130} y={46} ok={ok} r={8} />
      {d}
      <T x={x + 74} y={136} a="middle" s={10.5} c={C.text}>{a}</T>
      <T x={x + 74} y={150} a="middle" s={10} c={C.dim}>{b}</T>
    </g>
  )
  const wall = (x) => (
    <g>
      <rect x={x} y={62} width={34} height={56} fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={x + 16} y={82} width={44} height={16} fill="url(#qk-bcut)" stroke="#6b5a2a" strokeWidth="0.6" />
    </g>
  )
  return (
    <F h={226} view="Section · before any test" scale="schematic">
      {panel(12, 'Crown home', true, <g>{wall(36)}<rect x={72} y={70} width={32} height={40} rx="4" fill="url(#qk-knurl)" stroke="#55646e" /></g>, 'pushed fully in', 'or screwed down tight')}
      {panel(166, 'Crown out', false, <g>{wall(190)}<rect x={264} y={70} width={32} height={40} rx="4" fill="url(#qk-knurl)" stroke="#55646e" /><rect x={240} y={88} width={26} height={4} fill={C.dim} /></g>, 'an open door', 'the test proves nothing')}
      <Pn x={320} y={28} w={148} h={132} t="Then" />
      <Note x={332} y={62} s={10.5} lh={15} lines={['Work crown and pushers,', 'then back to normal.', 'Room at 18 to 25 °C.', 'Case dry.', 'Wet inside? Don’t test:', 'open it and dry it.']} />
      <T x={14} y={182} s={11} c={C.text}>The ISO test operates the crown and pushers first, then returns them to normal.</T>
      <T x={14} y={199} s={10.5} c={C.dim}>Take the strap off if it fouls the tester’s clamp or chamber.</T>
      <T x={14} y={214} s={10.5} c={C.faint}>Give new gaskets time to settle first.</T>
    </F>
  )
}

function CwDry() {
  const x0 = 262, y0 = 170
  return (
    <F h={252} view="Schematic · how a dry tester reads" scale="principle is an inference">
      <rect x={24} y={46} width={196} height={136} rx="10" fill="#26221e" stroke={C.steel} strokeWidth="1.4" />
      <T x={122} y={40} a="middle" s={10.5} c={C.dim}>sealed test chamber</T>
      <rect x={60} y={124} width={124} height={34} rx="3" fill="url(#qk-cut)" stroke="#4e5f6a" />
      <path d="M60 124 Q122 106 184 124 Z" fill="url(#qk-acr)" stroke={M.glass} />
      <path d="M60 124 Q122 122 184 124" fill="none" stroke={M.glass} strokeDasharray="3 3" />
      <rect x={118} y={62} width={8} height={36} fill="url(#sk-steelH)" />
      <path d="M122 98 l-5 -7 h10 Z" fill={C.brass} />
      <T x={134} y={80} s={10} c={C.brass}>sensor on</T>
      <T x={134} y={92} s={10} c={C.brass}>the crystal</T>
      {[[38, 96], [204, 96], [38, 148], [204, 148]].map(([x, y], i) => <Arrow key={i} a={[x + (x < 100 ? -8 : 8), y]} b={[x + (x < 100 ? 8 : -8), y]} c="steel" w={1.4} />)}
      <T x={122} y={174} a="middle" s={10} c={C.dim}>pressure or vacuum, no water</T>
      <line x1={x0} y1={50} x2={x0} y2={y0} stroke={C.struct} />
      <line x1={x0} y1={y0} x2={466} y2={y0} stroke={C.struct} />
      <T x={x0 + 4} y={46} s={10} c={C.faint}>flex of the case</T>
      <T x={466} y={y0 + 14} a="end" s={10} c={C.faint}>time under load</T>
      <path d={`M${x0} ${y0} L${x0 + 26} 74 L466 74`} fill="none" stroke={C.emerald} strokeWidth="2.2" />
      <path d={`M${x0} ${y0} L${x0 + 26} 74 Q${x0 + 80} 76 ${x0 + 120} 136 Q${x0 + 140} 158 466 160`} fill="none" stroke={C.ruby} strokeWidth="2.2" />
      <T x={466} y={68} a="end" s={10.5} c={C.emerald}>sealed: holds its flex</T>
      <T x={296} y={152} s={10.5} c={C.ruby}>leak: relaxes</T>
      <T x={14} y={206} s={11} c={C.text}>Use the instrument’s own pass or fail: no deformation limit is published.</T>
      <T x={14} y={223} s={10.5} c={C.dim}>ProofMaster: −0.7 to 10 bar, with a fixed 50 µg/min tightness limit.</T>
      <T x={14} y={239} s={10.5} c={C.dim}>A failed dry test means find the leak before the watch sees water.</T>
    </F>
  )
}

function CwWet() {
  const tank = (x, n, a, b, low, bubbles, gauge) => (
    <g>
      <Pn x={x} y={28} w={110} h={184} />
      <Num x={x + 15} y={44} n={n} r={8} />
      <T x={x + 92} y={48} a="end" s={10.5} mono c={C.brass}>{gauge}</T>
      <rect x={x + 16} y={58} width={78} height={100} rx="4" fill="#26221e" stroke={C.steel} strokeWidth="1.2" />
      <rect x={x + 17} y={108} width={76} height={49} fill="rgba(120,175,205,0.28)" />
      <line x1={x + 55} y1={58} x2={x + 55} y2={low ? 124 : 76} stroke={C.dim} strokeWidth="1.2" />
      <rect x={x + 37} y={low ? 124 : 76} width={36} height={13} rx="2" fill="url(#sk-steel)" stroke="#55646e" />
      {bubbles && [[8, 110], [18, 100], [13, 88], [21, 76], [-4, 112]].map(([dx, y], i) => <circle key={i} cx={x + 76 + dx * 0.5} cy={y + 6} r={2 + (i % 2)} fill="none" stroke={M.glass} strokeWidth="1" />)}
      <T x={x + 55} y={176} a="middle" s={10.5} c={C.text} w={600}>{a}</T>
      <T x={x + 55} y={190} a="middle" s={10} c={C.dim}>{b}</T>
    </g>
  )
  return (
    <F h={262} view="Sequence · wet test" scale="Bergeon 5555/98 sheet">
      {tank(12, 1, 'Pump up, dry', 'hold 3 minutes', false, false, '3 atm')}
      {tank(128, 2, 'Lower it', 'into the water', true, false, '3 atm')}
      {tank(244, 3, 'Release', 'immediately', true, false, '↓ falling')}
      {tank(360, 4, 'Watch', 'as pressure falls', true, true, '↓ falling')}
      <T x={14} y={232} s={11} c={C.ruby}>Bubbles: lift the watch out at once, then open it and dry it.</T>
      <T x={14} y={249} s={10.5} c={C.dim}>Air got in during the hold, so it comes back out as the outside pressure falls.</T>
    </F>
  )
}

function CwBubbles() {
  const cx = 200, y = 110, R = 160
  const stream = (x, y0, dx) => [0, 1, 2, 3, 4].map((i) => <circle key={i} cx={x + Math.sin(i * 1.6) * 3 + dx * i} cy={y0 - i * 9} r={1.8 + i * 0.4} fill="rgba(170,215,235,0.25)" stroke={M.glass} strokeWidth="0.9" />)
  return (
    <F h={268} view="Section · reading the bubbles" scale="schematic">
      <rect x={14} y={28} width={452} height={180} rx="6" fill="rgba(120,175,205,0.1)" />
      <CaseSec cx={cx} y={y} R={R} />
      {stream(cx + R + 6, y - 2, 3)}
      {stream(cx - R + 44, y - 26, -1)}
      {stream(cx + R - 2, y + 60, 5)}
      <Lead p={[cx + R + 20, y - 34]} t={[392, 48]} text="crown or tube" s={10.5} c={M.glass} dot={false} />
      <Lead p={[cx - R + 46, y - 62]} t={[106, 42]} text="crystal edge" s={10.5} c={M.glass} dot={false} />
      <Lead p={[cx + R + 6, y + 62]} t={[392, 186]} text="back seam" s={10.5} c={M.glass} dot={false} />
      <Tb
        x={14}
        y={224}
        rh={17}
        head={false}
        cols={[{ w: 190 }, { w: 262 }]}
        rows={[
          [{ t: 'One or two small bubbles', c: C.emerald }, 'usually air from case gaps'],
          [{ t: 'A steady stream', c: C.ruby }, 'a leak, and its position names the seal'],
        ]}
      />
    </F>
  )
}

function CwCondense() {
  const pan = (x, n, a, b, d) => (
    <g>
      <Pn x={x} y={28} w={110} h={150} />
      <Num x={x + 15} y={44} n={n} r={8} />
      {d}
      <T x={x + 55} y={154} a="middle" s={10.5} c={C.text} w={600}>{a}</T>
      <T x={x + 55} y={168} a="middle" s={10} c={C.dim}>{b}</T>
    </g>
  )
  const watch = (x) => (
    <g>
      <rect x={x + 18} y={122} width={74} height={8} fill="#7c2b3a" stroke={C.ruby} />
      <rect x={x + 24} y={100} width={62} height={22} rx="2" fill="url(#qk-cut)" stroke="#4e5f6a" />
      <rect x={x + 28} y={94} width={54} height={7} fill="url(#qk-acr)" stroke={M.glass} />
    </g>
  )
  return (
    <F h={256} view="Sequence · condensation test" scale="ISO 22810 method">
      {pan(12, 1, 'Warm it', '40 to 45 °C plate', <g>{watch(12)}{[0, 1, 2].map((i) => <path key={i} d={`M${44 + i * 16} 84 q5 -7 0 -14 q-5 -7 0 -14`} fill="none" stroke={C.ruby} strokeWidth="1.2" />)}</g>)}
      {pan(128, 2, 'Add a drop', 'water at 18 to 25 °C', <g>{watch(128)}<path d="M183 72 q9 12 0 18 q-9 -6 0 -18 Z" fill={M.glass} /></g>)}
      {pan(244, 3, 'Wipe it dry', 'after about 1 minute', <g>{watch(244)}<rect x={276} y={78} width={46} height={12} rx="4" fill="#d9d2c1" /></g>)}
      {pan(360, 4, 'Look inside', 'for mist on the glass', <g>{watch(360)}{[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={395 + i * 8} cy={102} r={1.3} fill="#eef3f6" />)}</g>)}
      <Tb
        x={14}
        y={198}
        rh={17}
        head={false}
        cols={[{ w: 200 }, { w: 252 }]}
        rows={[
          [{ t: 'Clears within 1 minute', c: C.emerald }, 'not a defect'],
          [{ t: 'Stays', c: C.ruby }, 'dry it, retest: humid air can false-fail'],
          ['Glass over 2 mm', 'use a wet cloth or pad, not a drop'],
        ]}
      />
    </F>
  )
}

function CwFix() {
  const st = [
    ['Crown', 'home, tube and threads clean'],
    ['Back', 'reseat with a new gasket'],
    ['Crown and tube', 'seal, then fit in the case'],
    ['Pushers', 'their own seals'],
    ['Crystal', 'most work, so last'],
  ]
  return (
    <F h={262} view="Ladder · cheapest fix first" scale="reasoned order">
      {st.map(([a, b], i) => {
        const y = 32 + i * 37
        const w = 196 + i * 30
        return (
          <g key={a}>
            <rect x={14} y={y} width={w} height={30} rx="5" fill={`rgba(208,168,79,${0.08 + i * 0.05})`} stroke={C.struct} />
            <Num x={32} y={y + 15} n={i + 1} r={8} />
            <T x={48} y={y + 13} s={11} c={C.text} w={600}>{a}</T>
            <T x={48} y={y + 25} s={10} c={C.dim}>{b}</T>
          </g>
        )
      })}
      <path d="M392 196 C 444 196, 444 44, 392 44" fill="none" stroke={C.emerald} strokeWidth="1.8" strokeDasharray="5 4" markerEnd="url(#sk-a-emerald)" />
      <T x={452} y={112} a="middle" s={10.5} c={C.emerald}>retest</T>
      <T x={452} y={126} a="middle" s={10.5} c={C.emerald}>after</T>
      <T x={452} y={140} a="middle" s={10.5} c={C.emerald}>each</T>
      <T x={14} y={232} s={11} c={C.text}>One change, one retest, or you won’t know what cured it.</T>
      <T x={14} y={249} s={10.5} c={C.dim}>Still failing with new seals? Suspect the tube’s fit in the case, or a damaged seat.</T>
    </F>
  )
}


/* ------------------------------------------------------------------ */
/* Lesson: refinishing                                                  */
/* ------------------------------------------------------------------ */
function CfRemoval() {
  return (
    <F h={236} view="Section · removing one scratch" scale="depth exaggerated">
      <path d="M30 160 L30 62 L212 62 L222 118 L232 62 L450 62 L450 160 Z" fill="url(#qk-cut)" stroke="#4e5f6a" />
      <path d="M30 62 L212 62 L222 118 L232 62 L450 62 L450 118 L30 118 Z" fill="url(#sk-noglue)" stroke="none" />
      <line x1={22} y1={118} x2={458} y2={118} stroke={C.brass} strokeWidth="1.6" strokeDasharray="6 4" />
      <Lab p={[222, 100]} x={222} y={44} text="the scratch" c={C.ruby} up />
      <T x={120} y={94} a="middle" s={11} c={C.text}>metal that goes</T>
      <T x={340} y={94} a="middle" s={11} c={C.text}>metal that goes</T>
      <T x={240} y={142} a="middle" s={11} c={C.text}>what’s left</T>
      <Dim a={[462, 62]} b={[462, 118]} text="" off={0} />
      <T x={240} y={184} a="middle" s={11} c={C.text}>The whole surface comes down to the bottom of the scratch.</T>
      <T x={240} y={201} a="middle" s={10.5} c={C.dim}>Buffing compound contains abrasive too, so “just a buff” still removes metal.</T>
      <T x={240} y={218} a="middle" s={10.5} c={C.emerald}>“No” is a good answer: a scratch on a sharp case is worth keeping.</T>
    </F>
  )
}

function CfThickness() {
  const k = 1, x0 = 112
  const rows = [
    ['GP / GR 5', 5, 'gold'],
    ['GP / GR 10', 10, 'gold'],
    ['GP / GR 20', 20, 'gold'],
    ['GP / GR 40', 40, 'gold'],
    ['GP / GR 80', 80, 'gold'],
    ['Dennison filled', 72, 'filled'],
    ['GC 200', 200, 'cap'],
    ['GC 250', 250, 'cap'],
    ['GC 300', 300, 'cap'],
  ]
  return (
    <F h={290} view="Chart · gold covering thickness" scale="to scale, ISO 3160-1 marks">
      {rows.map(([n, v, kind], i) => {
        const y = 34 + i * 22
        return (
          <g key={n}>
            <T x={14} y={y + 11} s={10.5} c={C.text}>{n}</T>
            <rect x={x0} y={y + 1} width={v * k} height={13} rx="1" fill={kind === 'filled' ? C.steel : C.brass} opacity={kind === 'cap' ? 0.65 : 1} />
            <T x={x0 + v * k + 6} y={y + 12} s={10} mono c={C.dim}>{v} µm</T>
          </g>
        )
      })}
      <T x={14} y={244} s={11} c={C.text}>20 µm is 0.02 mm. With the −20% tolerance it can be 16 µm.</T>
      <T x={14} y={261} s={10.5} c={C.dim}>Plated cases should be cleaned, not polished.</T>
      <T x={14} y={277} s={10.5} c={C.dim}>A different colour at a corner means the plating has already gone there.</T>
    </F>
  )
}

function CfMap() {
  const brush = (x, y, w, h) => (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#8fa1ad" />
      {Array.from({ length: Math.floor(w / 3) }, (_, i) => <line key={i} x1={x + i * 3 + 1} y1={y} x2={x + i * 3 + 1} y2={y + h} stroke="#6b7c87" strokeWidth="0.6" />)}
    </g>
  )
  return (
    <F h={258} view="Plan and side · a finish map" scale="one forum example">
      <Tag x={14} y={40}>From above</Tag>
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => (
        <path key={i} d={`M${112 + a * 46 - 11} ${130 + b * 66 - 18} h22 v36 h-22 Z`} fill="url(#sk-steelH)" stroke={C.brassHi} strokeWidth="1.2" />
      ))}
      <circle cx={112} cy={130} r={72} fill="#8fa1ad" stroke="#55646e" />
      {Array.from({ length: 24 }, (_, i) => {
        const [a, b] = pol(112, 130, 72, i * 15)
        const [c2, d2] = pol(112, 130, 60, i * 15)
        return <line key={i} x1={a} y1={b} x2={c2} y2={d2} stroke="#6b7c87" strokeWidth="0.8" />
      })}
      <circle cx={112} cy={130} r={60} fill="url(#sk-steelH)" stroke={C.brassHi} />
      <circle cx={112} cy={130} r={48} fill="#25221f" stroke={C.struct} />
      <Lead p={[150, 58]} t={[214, 46]} text="lug top: polished" s={10.5} c={C.brassHi} />
      <Lead p={[168, 96]} t={[214, 76]} text="case edge: brushed" s={10.5} c={C.steel} />
      <Tag x={234} y={118}>From the side</Tag>
      {brush(236, 130, 190, 26)}
      <path d="M226 130 L436 130 L428 122 L234 122 Z" fill="url(#sk-steelH)" stroke={C.brassHi} strokeWidth="0.8" />
      <rect x={224} y={156} width={214} height={3} fill="url(#sk-steelH)" />
      <Lead p={[330, 126]} t={[352, 102]} text="chamfer: polished" s={10.5} c={C.brassHi} />
      <Lead p={[330, 144]} t={[352, 178]} text="case side: brushed" s={10.5} c={C.steel} />
      <T x={14} y={226} s={11} c={C.text}>The boundaries make the case look right, and they’re the first thing lost.</T>
      <T x={14} y={243} s={10.5} c={C.dim}>Mark up your own case, and photograph every side before you start.</T>
    </F>
  )
}

function CfLost() {
  const lug = (x, worn) => (
    <g>
      {worn ? (
        <path d={`M${x + 12} 150 L${x + 12} 72 Q${x + 12} 58 ${x + 40} 58 L${x + 122} 56 Q${x + 196} 60 ${x + 200} 104 Q${x + 200} 146 ${x + 168} 150 Z`} fill="url(#qk-cut)" stroke="#4e5f6a" />
      ) : (
        <path d={`M${x + 12} 150 L${x + 12} 54 L${x + 20} 46 L${x + 176} 46 L${x + 206} 80 L${x + 206} 150 Z`} fill="url(#qk-cut)" stroke="#4e5f6a" />
      )}
      <circle cx={x + 150} cy={worn ? 88 : 104} r={9} fill={M.ink} stroke="#a3b3bd" />
    </g>
  )
  return (
    <F h={274} view="Section · one lug, two histories" scale="schematic">
      <Pn x={12} y={28} w={222} h={136} t="As made" c={C.emerald} tc={C.emerald} />
      {lug(14, false)}
      <Pn x={246} y={28} w={222} h={136} t="Over-polished" c={C.ruby} tc={C.ruby} />
      {lug(248, true)}
      <path d="M262 150 L262 54 L270 46 L426 46 L456 80 L456 150" fill="none" stroke={C.emerald} strokeDasharray="3 3" />
      <Lead p={[416, 66]} t={[430, 40]} text="lost shape" s={10} c={C.ruby} dot={false} a="end" />
      <Lead p={[398, 88]} t={[352, 112]} text="hole near edge" s={10} c={C.text} />
      <Tb
        x={14}
        y={184}
        rh={17}
        head={false}
        cols={[{ w: 226 }, { w: 226 }]}
        rows={[
          ['Bevels and chamfers', 'Lug thickness and shape'],
          ['Crisp lug holes', 'Engraving depth'],
          ['Brushed against polished contrast', { t: 'Gold, platinum: lost faster', c: C.brass }],
        ]}
      />
      <T x={14} y={250} s={10.5} c={C.faint}>Rough trade rule, one retailer: about five refinishes in a steel case.</T>
      <T x={14} y={265} s={10.5} c={C.faint}>Earlier owners may already have spent them.</T>
    </F>
  )
}

function CfMaterials() {
  return (
    <F h={258} view="Chart · 316L against 904L" scale="retail figures">
      <Tag x={14} y={40}>Pitting resistance (PREN): higher is better</Tag>
      <Ranges x={14} y={48} w={392} min={20} max={42} lab={60} ticks={[20, 30, 40]} vx={466} rows={[{ n: '316L', a: 23.1, b: 28.5, t: '23.1–28.5', c: C.steel }, { n: '904L', a: 32.2, b: 39.9, t: '32.2–39.9', c: C.emerald }]} />
      <T x={14} y={118} s={10.5} c={C.emerald}>Clear gap: 904L resists corrosion better.</T>
      <Sep x1={14} y1={128} x2={466} y2={128} />
      <Tag x={14} y={146}>Hardness (HRB)</Tag>
      <Ranges x={14} y={154} w={392} min={60} max={100} lab={60} ticks={[60, 80, 100]} vx={466} rows={[{ n: '316L', a: 70, b: 95, t: '70–95', c: C.steel }, { n: '904L', a: 70, b: 90, t: '70–90', c: C.brass }]} />
      <T x={14} y={224} s={10.5} c={C.brass}>Ranges overlap: don’t expect fewer scratches.</T>
      <T x={14} y={243} s={10.5} c={C.faint}>Titanium Grade 2 is pure, Grade 5 is Ti-6Al-4V. Watch ceramics are zirconia.</T>
    </F>
  )
}

function CfOrder() {
  const st = [
    ['Decide', 'whether to touch it at all', C.brass],
    ['Map', 'every finish, photograph it', C.brass],
    ['Protect', 'the neighbouring surfaces', C.brass],
    ['Start least aggressive', 'short passes, loupe after each', C.steel],
    ['Stop', 'before any edge moves', C.ruby],
  ]
  return (
    <F h={260} view="Sequence · if you go ahead" scale="no grades given">
      {st.map(([a, b, c], i) => {
        const y = 30 + i * 36
        return (
          <g key={a}>
            <rect x={14} y={y} width={280} height={30} rx="5" fill="rgba(255,255,255,0.03)" stroke={c} />
            <Num x={32} y={y + 15} n={i + 1} r={8} c={c} />
            <T x={48} y={y + 13} s={11} c={C.text} w={600}>{a}</T>
            <T x={48} y={y + 25} s={10} c={C.dim}>{b}</T>
            {i < 4 && <path d={`M154 ${y + 30} v6`} stroke={C.struct} strokeWidth="1.6" />}
          </g>
        )
      })}
      <path d="M310 30 V126" stroke={C.brass} strokeWidth="2" />
      <T x={320} y={72} s={10.5} c={C.brass}>before anything</T>
      <T x={320} y={86} s={10.5} c={C.brass}>touches the case</T>
      <Pn x={312} y={140} w={156} h={68} t="Why wheels are risky" c={C.ruby} tc={C.ruby} />
      <Note x={322} y={174} s={10.5} lh={14} lines={['High speed and soft', 'wheels round off edges.']} />
      <T x={14} y={228} s={11} c={C.text}>No abrasive grades appear here, because none could be verified.</T>
      <T x={14} y={245} s={10.5} c={C.dim}>Practise on a scrap case first, not on one you care about.</T>
    </F>
  )
}

function CfWeld() {
  const base = (x, top) => <path d={`M${x + 12} 120 L${x + 12} 72 ${top} L${x + 136} 72 L${x + 136} 120 Z`} fill="url(#qk-cut)" stroke="#4e5f6a" />
  const pan = (x, n, a, b, d) => (
    <g>
      <Pn x={x} y={28} w={148} h={132} />
      <Num x={x + 16} y={44} n={n} r={8} />
      {d}
      <T x={x + 74} y={138} a="middle" s={11} c={C.text} w={600}>{a}</T>
      <T x={x + 74} y={152} a="middle" s={10} c={C.dim}>{b}</T>
    </g>
  )
  return (
    <F h={240} view="Sequence · adding metal back" scale="schematic">
      {pan(12, 1, 'A deep ding', 'polishing can’t reach it', base(12, 'L66 72 L86 104 L106 72'))}
      {pan(166, 2, 'Over-fill it', 'laser weld, proud of the line', (
        <g>
          {base(166, 'L220 72 L240 104 L260 72')}
          <path d="M214 72 Q240 54 266 72 L260 72 L240 104 L220 72 Z" fill={C.brass} stroke={C.brassHi} />
        </g>
      ))}
      {pan(320, 3, 'Refinish', 'both areas come down together', (
        <g>
          {base(320, 'L456 72')}
          <path d="M374 72 L394 104 L414 72 Z" fill={C.brass} opacity="0.5" />
          <Verdict x={448} y={46} ok r={8} />
        </g>
      ))}
      <T x={14} y={182} s={11} c={C.text}>Weld before polishing, never after.</T>
      <T x={14} y={199} s={10.5} c={C.dim}>Spot repairs rarely blend, so ask about refinishing the whole surface first.</T>
      <T x={14} y={215} s={10.5} c={C.dim}>Specialist work. If a case is worth saving, this is the route that keeps its shape.</T>
    </F>
  )
}

export const FIGS = {
  'qs-pick': QsPick,
  'qs-baseline': QsBaseline,
  'qs-tweezers': QsTweezers,
  'qs-strip-dial': QsStripDial,
  'qs-strip-module': QsStripModule,
  'qs-train': QsTrain,
  'qs-sort': QsSort,
  'qs-rotor': QsRotor,
  'qs-oil': QsOil,
  'qs-module-back': QsModuleBack,
  'qs-date': QsDate,
  'qs-verdict': QsVerdict,
  'qm-instruments': QmInstruments,
  'qm-voltage': QmVoltage,
  'qm-testvolt': QmTestvolt,
  'qm-probes': QmProbes,
  'qm-coil': QmCoil,
  'qm-current': QmCurrent,
  'qm-high': QmHigh,
  'qm-lower': QmLower,
  'qm-ticks': QmTicks,
  'qm-gate': QmGate,
  'qm-sequence': QmSequence,
  'qz-jobs': QzJobs,
  'qz-points': QzPoints,
  'qz-short': QzShort,
  'qz-vd53': QzVd53,
  'qz-5040': Qz5040,
  'qz-table': QzTable,
  'qz-verify': QzVerify,
  'qc-types': QcTypes,
  'qc-charge': QcCharge,
  'qc-swing': QcSwing,
  'qc-gen': QcGen,
  'qc-verdict': QcVerdict,
  'qc-solar': QcSolar,
  'qc-parts': QcParts,
  'qc-fit': QcFit,
  'qc-reset': QcReset,
  'co-anatomy': CoAnatomy,
  'co-backs': CoBacks,
  'co-marks': CoMarks,
  'co-hold': CoHold,
  'co-snap': CoSnap,
  'co-wrench': CoWrench,
  'co-screws': CoScrews,
  'co-mono': CoMono,
  'co-close': CoClose,
  'cg-sections': CgSections,
  'cg-where': CgWhere,
  'cg-condition': CgCondition,
  'cg-measure': CgMeasure,
  'cg-groove': CgGroove,
  'cg-size': CgSize,
  'cg-grease': CgGrease,
  'cg-fit': CgFit,
  'cx-material': CxMaterial,
  'cx-fits': CxFits,
  'cx-measure': CxMeasure,
  'cx-lift': CxLift,
  'cx-tension': CxTension,
  'cx-hard': CxHard,
  'cx-glue': CxGlue,
  'cx-polish': CxPolish,
  'ct-sections': CtSections,
  'ct-tap': CtTap,
  'ct-sizes': CtSizes,
  'ct-grease': CtGrease,
  'ct-tubes': CtTubes,
  'ct-press': CtPress,
  'ct-heat': CtHeat,
  'cb-build': CbBuild,
  'cb-ball': CbBall,
  'cb-lift': CbLift,
  'cb-spring': CbSpring,
  'cb-gasket': CbGasket,
  'cb-press': CbPress,
  'cb-insert': CbInsert,
  'cb-align': CbAlign,
  'cr-types': CrTypes,
  'cr-plan': CrPlan,
  'cr-screws': CrScrews,
  'cr-split': CrSplit,
  'cr-collar': CrCollar,
  'cr-taper': CrTaper,
  'cr-fit': CrFit,
  'cr-stretch': CrStretch,
  'cw-pressure': CwPressure,
  'cw-limit': CwLimit,
  'cw-prep': CwPrep,
  'cw-dry': CwDry,
  'cw-wet': CwWet,
  'cw-bubbles': CwBubbles,
  'cw-condense': CwCondense,
  'cw-fix': CwFix,
  'cf-removal': CfRemoval,
  'cf-thickness': CfThickness,
  'cf-map': CfMap,
  'cf-lost': CfLost,
  'cf-materials': CfMaterials,
  'cf-order': CfOrder,
  'cf-weld': CfWeld,
}
