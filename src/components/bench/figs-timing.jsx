// Reading the Machine: timegrapher reading, the trace atlas, beat, positions,
// targets, regulators and fault isolation. Every trace here is generated from a
// formula at one scale (see SEC/MS below), so slopes match the rates printed on
// them. None is copied from any maker's drawing.
import { C, Fig, T, Note, Lead, Dim, Arrow, Num, Verdict, Tag, Sep } from '../strap/kit.jsx'

/* ------------------------------------------------------------------ */
/* Text helpers                                                         */
/* ------------------------------------------------------------------ */
const FW = 0.5 // average glyph width as a share of font size, for wrapping

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

// A wrapped paragraph with an optional small heading.
function Para({ x, y, w, text, s = 11, lh = 14, c = C.dim, head, hc = C.brass, a }) {
  const lines = wrap(text, w, s)
  const y0 = head ? y + 14 : y
  return (
    <g>
      {head && <Tag x={x} y={y} c={hc}>{head}</Tag>}
      {lines.map((l, i) => (
        <T key={i} x={x} y={y0 + i * lh} s={s} c={c} a={a}>{l}</T>
      ))}
    </g>
  )
}

// A rounded panel with a small heading.
function Panel({ x, y, w, h, title, c, fill = 'rgba(255,255,255,0.025)' }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="7" fill={fill} stroke={c || C.line} />
      {title && <Tag x={x + 8} y={y + 14} c={c || C.faint}>{title}</Tag>}
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* The trace display                                                    */
/* ------------------------------------------------------------------ */
// One scale for every trace in the track: 20 s across, 10 ms top to bottom.
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

// Small readout box on a machine display.
function Readout({ x, y, w = 72, label, value, unit, c = C.text }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={34} rx="3" fill={LCD} stroke="#3c4c46" />
      <T x={x + 6} y={y + 12} s={10} c={C.faint}>{label}</T>
      <T x={x + 6} y={y + 28} s={13.5} c={c} mono w="600">{value}</T>
      {unit && <T x={x + w - 5} y={y + 28} s={10} c={C.faint} a="end">{unit}</T>}
    </g>
  )
}

// Atlas card: trace above, inset to the right, three columns beneath.
function Card({ view = 'Trace · atlas', scale = '20 s across · 10 ms tall', h = 256, looks, means, act, inset, insetTitle, children, cols = 166 }) {
  return (
    <Fig h={h} view={view} scale={scale}>
      {children}
      {inset && (
        <g>
          <Panel x={326} y={28} w={142} h={128} title={insetTitle} />
          {inset}
        </g>
      )}
      <Para x={14} y={cols + 8} w={142} head="Looks like" text={looks} />
      <Para x={170} y={cols + 8} w={142} head="Means" text={means} />
      <Para x={326} y={cols + 8} w={142} head="Do" hc={C.emerald} text={act} />
    </Fig>
  )
}

/* ------------------------------------------------------------------ */
/* Mechanical parts                                                     */
/* ------------------------------------------------------------------ */
const pol = (cx, cy, r, deg) => {
  const a = (deg * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)]
}
const fx = (p) => `${p[0].toFixed(2)} ${p[1].toFixed(2)}`

// Arc from a0 to a1 (degrees, 0 = east, clockwise on screen).
function arcD(cx, cy, r, a0, a1) {
  const sweep = a1 > a0 ? 1 : 0
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0
  return `M${fx(pol(cx, cy, r, a0))} A${r} ${r} 0 ${large} ${sweep} ${fx(pol(cx, cy, r, a1))}`
}

function spiralD(cx, cy, r0, r1, turns, a0 = 0, n = 220) {
  let d = ''
  for (let i = 0; i <= n; i++) {
    const u = i / n
    const p = pol(cx, cy, r0 + (r1 - r0) * u, a0 + u * turns * 360)
    d += `${i ? 'L' : 'M'}${fx(p)}`
  }
  return d
}

// Balance wheel, plan view. `mark` draws a dot on the rim at that angle.
function Balance({ cx, cy, r, rot = 0, arms = 3, mark }) {
  const ri = r * 0.84
  const ring = `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z M${cx - ri} ${cy} a${ri} ${ri} 0 1 1 ${2 * ri} 0 a${ri} ${ri} 0 1 1 ${-2 * ri} 0 Z`
  return (
    <g>
      <g transform={`rotate(${rot} ${cx} ${cy})`}>
        <path d={ring} fill="url(#sk-brassG)" fillRule="evenodd" stroke="#7d5f22" strokeWidth="0.8" />
        {Array.from({ length: arms }, (_, i) => {
          const p = pol(cx, cy, ri + 1, 90 + (i * 360) / arms)
          return <line key={i} x1={cx} y1={cy} x2={p[0]} y2={p[1]} stroke="#b08a3c" strokeWidth={Math.max(2, r * 0.09)} strokeLinecap="round" />
        })}
        <circle cx={cx} cy={cy} r={r * 0.16} fill="url(#sk-brassG)" stroke="#7d5f22" strokeWidth="0.8" />
      </g>
      <circle cx={cx} cy={cy} r={Math.max(1.6, r * 0.05)} fill={C.ruby} />
      {mark !== undefined && <circle cx={pol(cx, cy, (r + ri) / 2, mark)[0]} cy={pol(cx, cy, (r + ri) / 2, mark)[1]} r={Math.max(2.6, r * 0.05)} fill={C.ground} stroke={C.text} strokeWidth="1.3" />}
    </g>
  )
}

function Spring({ cx, cy, r0, r1, turns = 6, a0 = 0, c = C.steel, w = 0.9 }) {
  return <path d={spiralD(cx, cy, r0, r1, turns, a0)} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" />
}

// Escape wheel with slanted club teeth, plan view.
function EscWheel({ cx, cy, r, n = 15, rot = 0, fill = 'url(#sk-steel)' }) {
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
function Gear({ cx, cy, r, n = 28, fill = 'url(#sk-brassG)', stroke = '#7d5f22', rot = 0 }) {
  const rb = r * 0.91
  const pitch = 360 / n
  let d = ''
  for (let i = 0; i < n; i++) {
    const a = rot + i * pitch
    d += `${i ? 'L' : 'M'}${fx(pol(cx, cy, rb, a))}L${fx(pol(cx, cy, r, a + pitch * 0.2))}L${fx(pol(cx, cy, r, a + pitch * 0.5))}L${fx(pol(cx, cy, rb, a + pitch * 0.7))}`
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

// Watch from the front. rot turns the whole head; 0 = 12 up, crown to the right.
function Face({ cx, cy, r, rot = 0, h = -58, m = 58, label, crownHi }) {
  const t = `rotate(${rot} ${cx} ${cy})`
  return (
    <g transform={t}>
      {[-1, 1].map((sy) =>
        [-1, 1].map((sx) => (
          <rect key={`${sx}${sy}`} x={cx + sx * r * 0.52 - r * 0.13} y={cy + sy * r * 0.98 - r * 0.2} width={r * 0.26} height={r * 0.42} rx={r * 0.05} fill="#7b8a94" />
        ))
      )}
      <rect x={cx + r * 0.97} y={cy - r * 0.15} width={r * 0.2} height={r * 0.3} rx={r * 0.04} fill={crownHi ? C.brass : '#9fb0ba'} stroke="#4e5f6a" strokeWidth="0.6" />
      <circle cx={cx} cy={cy} r={r} fill="url(#sk-steel)" stroke="#4e5f6a" strokeWidth="0.7" />
      <circle cx={cx} cy={cy} r={r * 0.85} fill="#26211b" stroke="#55503f" strokeWidth="0.6" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = i * 30 - 90
        const p0 = pol(cx, cy, r * 0.8, a)
        const p1 = pol(cx, cy, r * (i % 3 === 0 ? 0.62 : 0.7), a)
        return <line key={i} x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke={i === 0 ? C.brassHi : '#a59a86'} strokeWidth={i % 3 === 0 ? 1.5 : 0.8} />
      })}
      <line x1={cx} y1={cy} x2={pol(cx, cy, r * 0.42, h - 90)[0]} y2={pol(cx, cy, r * 0.42, h - 90)[1]} stroke={C.text} strokeWidth="1.8" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={pol(cx, cy, r * 0.62, m - 90)[0]} y2={pol(cx, cy, r * 0.62, m - 90)[1]} stroke={C.text} strokeWidth="1.2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={Math.max(1.5, r * 0.06)} fill={C.brass} />
      {label}
    </g>
  )
}

// Watch from the side. up = dial facing up.
function Side({ cx, cy, w = 70, up = true, flip }) {
  const h = w * 0.2
  const dome = up ? -1 : 1
  return (
    <g>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={h * 0.25} fill="url(#sk-steel)" stroke="#4e5f6a" strokeWidth="0.7" />
      <path d={`M${cx - w * 0.42} ${cy + (dome * h) / 2} Q${cx} ${cy + dome * (h / 2 + w * 0.11)} ${cx + w * 0.42} ${cy + (dome * h) / 2} Z`} fill="url(#sk-glass)" stroke="#7fa0b0" strokeWidth="0.8" />
      <rect x={flip ? cx - w / 2 - w * 0.09 : cx + w / 2} y={cy - h * 0.3} width={w * 0.09} height={h * 0.6} rx="1" fill="#9fb0ba" stroke="#4e5f6a" strokeWidth="0.6" />
    </g>
  )
}

// Timing machine body with its display. Returns display geometry via children.
function Machine({ x, y, w, h, children }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill="#2c2722" stroke="#55503f" />
      <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx="5" fill="none" stroke="#3a342c" />
      {children}
    </g>
  )
}

// Microphone clamp holding a watch from the side, on a stand.
function Clamp({ x, y, w = 58 }) {
  return (
    <g>
      <rect x={x - 28} y={y + 34} width={56} height={8} rx="2" fill="#3a342c" stroke="#55503f" />
      <rect x={x - 4} y={y + 12} width={8} height={24} fill="#6c6456" />
      <rect x={x - w / 2 - 6} y={y + 6} width={w + 12} height={9} rx="2" fill="url(#sk-steel)" stroke="#5f717d" strokeWidth="0.7" />
      <Side cx={x} cy={y - 3} w={w} up />
      <rect x={x - w / 2 - 6} y={y - 26} width={9} height={32} rx="2" fill="#7b8a94" />
      <rect x={x + w / 2 - 3} y={y - 26} width={9} height={32} rx="2" fill="#7b8a94" />
      <path d={`M${x + w / 2 + 6} ${y - 18} l-7 0`} stroke={C.ruby} strokeWidth="1.2" />
    </g>
  )
}

// Hand-built sound burst, used for the beat-noise figure.
function Burst({ x, y, a, len = 34, seed = 3, c = C.text }) {
  const r = rng(seed)
  let d = `M${x} ${y}`
  const n = Math.round(len / 1.6)
  for (let i = 0; i < n; i++) {
    const env = a * Math.exp((-3.2 * i) / n) * (0.72 + 0.28 * r())
    d += `L${(x + i * 1.6).toFixed(1)} ${(y + (i % 2 ? env : -env)).toFixed(1)}`
  }
  return <path d={d} fill="none" stroke={c} strokeWidth="1" strokeLinejoin="round" />
}

/* ------------------------------------------------------------------ */
/* Lesson 1: Take a reading you can trust                               */
/* ------------------------------------------------------------------ */

// A tooth and pallet stone, or impulse pin and fork, for the noise panels.
function ContactPin({ x, y }) {
  return (
    <g>
      <Roller cx={x + 40} cy={y - 8} r={18} pin={180} />
      <path d={`M${x - 42} ${y - 16} L${x + 2} ${y - 18} L${x + 14} ${y - 24} L${x + 17} ${y - 19} L${x + 8} ${y - 13} L${x + 8} ${y - 3} L${x + 17} ${y + 3} L${x + 14} ${y + 8} L${x + 2} ${y + 2} L${x - 42} ${y} Z`} fill="url(#sk-steel)" stroke="#5f717d" strokeWidth="0.8" />
      <circle cx={x + 16} cy={y - 8} r={9} fill="none" stroke={C.brass} strokeWidth="1.2" strokeDasharray="2 2" />
    </g>
  )
}
function ContactTooth({ x, y, lock }) {
  // pallet stone hanging down; tooth comes up from below
  return (
    <g>
      <rect x={x - 11} y={y - 30} width={22} height={34} rx="1.5" fill={C.ruby} stroke="#8a3943" strokeWidth="0.8" transform={`rotate(-16 ${x} ${y - 12})`} />
      <path d={lock ? `M${x + 28} ${y + 22} L${x + 13} ${y - 6} L${x + 21} ${y - 4} L${x + 40} ${y + 22} Z` : `M${x + 12} ${y + 24} L${x + 3} ${y + 4.5} L${x + 11} ${y + 3} L${x + 24} ${y + 24} Z`} fill="url(#sk-steel)" stroke="#5f717d" strokeWidth="0.8" />
      <circle cx={lock ? x + 13 : x + 5} cy={lock ? y - 6 : y + 4.5} r={9} fill="none" stroke={C.brass} strokeWidth="1.2" strokeDasharray="2 2" />
      {lock && (
        <g>
          <rect x={x - 52} y={y - 26} width={32} height={6} rx="1.5" fill="url(#sk-steel)" stroke="#5f717d" strokeWidth="0.7" />
          <circle cx={x - 48} cy={y - 13} r={4} fill="url(#sk-brassG)" stroke="#7d5f22" strokeWidth="0.7" />
          <T x={x - 48} y={y + 6} a="middle" s={10} c={C.faint}>banking</T>
        </g>
      )}
    </g>
  )
}

function Noises() {
  const b = 96
  return (
    <Fig h={306} view="Chart · one beat, as the machine hears it" scale="schematic">
      <line x1={22} y1={b} x2={458} y2={b} stroke={C.line} />
      <Burst x={62} y={b} a={22} len={44} seed={5} />
      <Burst x={162} y={b} a={11} len={52} seed={11} c={C.faint} />
      <Burst x={290} y={b} a={38} len={64} seed={9} />
      <Num x={62} y={42} n={1} />
      <Num x={170} y={42} n={2} c={C.faint} />
      <Num x={290} y={42} n={3} />
      <T x={76} y={46} s={11} c={C.text}>sharp, precise</T>
      <T x={184} y={46} s={11} c={C.faint}>irregular</T>
      <T x={304} y={46} s={11} c={C.text}>strongest</T>
      <line x1={62} y1={b + 26} x2={62} y2={b + 44} stroke={C.brass} strokeDasharray="2 2" />
      <line x1={290} y1={b + 42} x2={290} y2={b + 26} stroke={C.brass} strokeDasharray="2 2" />
      <Dim a={[62, b + 40]} b={[290, b + 40]} text="the time that gives amplitude" c={C.brass} flip />
      <Arrow a={[360, b + 40]} b={[440, b + 40]} c="steel" w={1.2} />
      <T x={400} y={b + 34} a="middle" s={10.5} c={C.steel}>time</T>

      <Panel x={14} y={156} w={146} h={142} title="1 · Pin hits fork" c={C.brass} />
      <Panel x={167} y={156} w={146} h={142} title="2 · Impulse face" />
      <Panel x={320} y={156} w={146} h={142} title="3 · Tooth locks" c={C.brass} />
      <ContactPin x={78} y={212} />
      <ContactTooth x={240} y={212} />
      <ContactTooth x={402} y={212} lock />
      <Para x={22} y={246} w={132} s={10.5} lh={13} c={C.text} text="Timed very exactly." />
      <Para x={22} y={262} w={132} s={10.5} lh={13} c={C.emerald} text="Used for rate and beat error." />
      <Para x={175} y={246} w={132} s={10.5} lh={13} c={C.text} text="Too uneven to time." />
      <Para x={175} y={262} w={132} s={10.5} lh={13} c={C.ruby} text="Not used." />
      <Para x={328} y={246} w={132} s={10.5} lh={13} c={C.text} text="Lever reaches the banking too." />
      <Para x={328} y={275} w={132} s={10.5} lh={13} c={C.emerald} text="Used for amplitude." />
    </Fig>
  )
}

function Rate() {
  const y0 = 66
  const xs = [46, 96, 146, 196, 246]
  const early = [0, 4, 8, 12, 16]
  const rows = [
    ['18,000', '2.5 Hz', '200 ms'],
    ['21,600', '3 Hz', '166.7 ms'],
    ['28,800', '4 Hz', '125 ms'],
    ['36,000', '5 Hz', '100 ms'],
  ]
  return (
    <Fig h={286} view="Chart · how rate is built" scale="schematic, early beats exaggerated">
      <Tag x={22} y={40}>Beats arrive a little early each time</Tag>
      <line x1={30} y1={y0} x2={280} y2={y0} stroke={C.line} />
      {xs.map((x, i) => (
        <g key={x}>
          <line x1={x} y1={y0 - 11} x2={x} y2={y0 + 11} stroke={C.steel} strokeWidth="1.2" />
          <circle cx={x - early[i]} cy={y0} r="3.6" fill={TICK} />
        </g>
      ))}
      <T x={286} y={y0 - 10} s={10.5} c={C.steel}>nominal beat</T>
      <T x={286} y={y0 + 8} s={10.5} c={TICK}>measured beat</T>

      <Tag x={22} y={104}>Each offset moves the next dot</Tag>
      <Trace x={22} y={112} w={258} h={96} series={[{ pts: sample(line(40), { n: 40 }), c: TICK, r: 1.8 }]} />
      <Lead p={[230, 146]} t={[300, 128]} text="early: dots climb" sub="watch gains (+)" c={C.emerald} />
      <T x={22} y={226} s={10.5} c={C.dim}>Early beats climb. Late beats fall. Level means on rate.</T>
      <Para x={22} y={246} w={262} s={10.5} lh={13} text="Rate is the average of those offsets over the measuring time, converted to seconds a day." />

      <Sep x1={298} y1={158} x2={466} y2={158} />
      <Tag x={302} y={176}>beats/hour ÷ 7,200 = Hz</Tag>
      <T x={302} y={194} s={10} c={C.faint}>beats/h</T>
      <T x={364} y={194} s={10} c={C.faint}>freq.</T>
      <T x={412} y={194} s={10} c={C.faint}>one beat</T>
      {rows.map((r, i) => (
        <g key={r[0]}>
          <T x={302} y={211 + i * 16} s={11} mono c={i === 2 ? C.brassHi : C.dim}>{r[0]}</T>
          <T x={364} y={211 + i * 16} s={11} mono c={i === 2 ? C.brassHi : C.dim}>{r[1]}</T>
          <T x={412} y={211 + i * 16} s={11} mono c={i === 2 ? C.brassHi : C.dim}>{r[2]}</T>
        </g>
      ))}
    </Fig>
  )
}

function BeatDef() {
  const row = (y, title, a, b, ok, da = a, db = b) => {
    const x0 = 30
    const px = 1.1 // px per ms; da, db are the drawn gaps
    const t1 = da * px
    const t2 = db * px
    return (
      <g>
        <Tag x={22} y={y - 44}>{title}</Tag>
        <line x1={x0 - 8} y1={y} x2={x0 + t1 + t2 + 18} y2={y} stroke={C.line} />
        {[0, t1, t1 + t2].map((d, i) => (
          <g key={i}>
            <line x1={x0 + d} y1={y - 12} x2={x0 + d} y2={y + 12} stroke={i === 1 ? TOCK : TICK} strokeWidth="2.2" />
            <T x={x0 + d} y={y + 25} a="middle" s={10} c={i === 1 ? TOCK : TICK}>{i === 1 ? 'tock' : 'tick'}</T>
          </g>
        ))}
        <Dim a={[x0, y - 2]} b={[x0 + t1, y - 2]} off={-16} text={`t1 = ${a} ms`} flip />
        <Dim a={[x0 + t1, y - 2]} b={[x0 + t1 + t2, y - 2]} off={-16} text={`t2 = ${b} ms`} flip />
        <Verdict x={x0 + t1 + t2 + 34} y={y} ok={ok} />
      </g>
    )
  }
  const bx = 412
  return (
    <Fig h={306} view="Chart · the two gaps in one swing" scale="out-of-beat gap exaggerated">
      {row(84, 'In beat', 125, 125, true)}
      {row(186, 'Out of beat', 126, 124, false, 135, 115)}
      <T x={22} y={230} s={11} c={C.text}>Beat error is half the difference between the two gaps.</T>
      <T x={22} y={249} s={11.5} mono c={C.brassHi}>(t1 − t2) ÷ 2</T>
      <T x={22} y={270} s={11} c={C.dim}>At 28,800 beats/h: (126 − 124) ÷ 2 = 1 ms of beat error.</T>
      <T x={22} y={288} s={11} c={C.emerald}>Aim for 0.5 ms or less. Up to about 1 ms is common.</T>

      <Sep x1={352} y1={34} x2={352} y2={210} />
      <Tag x={bx} y={40} a="middle">Why it happens</Tag>
      <Balance cx={bx} cy={104} r={30} mark={-90} />
      <path d={arcD(bx, 104, 42, -90, 10)} fill="none" stroke={C.brass} strokeWidth="1.8" markerEnd="url(#sk-a-brass)" />
      <path d={arcD(bx, 104, 42, -90, -150)} fill="none" stroke={C.ruby} strokeWidth="1.8" markerEnd="url(#sk-a-ruby)" />
      <line x1={bx} y1={104 - 48} x2={bx} y2={104 - 26} stroke={C.text} strokeDasharray="2 2" />
      <T x={bx} y={166} a="middle" s={10.5} c={C.dim}>Swing goes further</T>
      <T x={bx} y={180} a="middle" s={10.5} c={C.dim}>one way than the</T>
      <T x={bx} y={194} a="middle" s={10.5} c={C.dim}>other past the line</T>
      <T x={bx} y={208} a="middle" s={10.5} c={C.dim}>of centres.</T>
    </Fig>
  )
}

function AmpDef() {
  const cx = 128
  const cy = 156
  const r = 64
  return (
    <Fig h={306} view="Plan · balance and its swing" scale="schematic">
      <Balance cx={cx} cy={cy} r={r} mark={-90} />
      <Spring cx={cx} cy={cy} r0={10} r1={r * 0.55} turns={5} a0={30} w={0.8} />
      <line x1={cx} y1={cy - r - 26} x2={cx} y2={cy - r + 4} stroke={C.text} strokeDasharray="3 2" />
      <T x={cx} y={cy - r - 30} a="middle" s={11} c={C.text}>rest (zero)</T>
      <path d={arcD(cx, cy, r + 12, -90, 190)} fill="none" stroke={C.brass} strokeWidth="2" markerEnd="url(#sk-a-brass)" />
      <path d={arcD(cx, cy, r + 20, -90, -370)} fill="none" stroke={C.steel} strokeWidth="2" markerEnd="url(#sk-a-steel)" />
      <Lead p={pol(cx, cy, r + 12, 40)} t={[196, 264]} text="amplitude" sub="rest to one turning point" c={C.brass} />
      <Lead p={pol(cx, cy, r + 20, 148)} t={[22, 262]} text="same swing back" a="start" c={C.steel} />
      <T x={22} y={299} s={10.5} c={C.faint}>Drawn at 280°, so the arcs pass the far side of the wheel.</T>

      <T x={300} y={44} s={11.5} c={C.text} w="600">How the machine gets it</T>
      <Num x={308} y={66} n={1} r={8} />
      <Para x={322} y={62} w={146} s={11} text="Times noise 1 to noise 3." c={C.text} />
      <Num x={308} y={96} n={2} r={8} />
      <Para x={322} y={92} w={146} s={11} text="Reads the beat rate." c={C.text} />
      <Num x={308} y={126} n={3} r={8} />
      <Para x={322} y={122} w={146} s={11} text="Uses the lift angle you typed in." c={C.ruby} />
      <Arrow a={[384, 150]} b={[384, 172]} c="brass" />
      <rect x={338} y={178} width={92} height={34} rx="4" fill={LCD} stroke="#3c4c46" />
      <T x={384} y={201} a="middle" s={16} mono c={TICK} w="600">280°</T>
      <Para x={300} y={226} w={168} s={10.5} lh={13} text="Short time means a big swing. Long time means a small one. Today’s wristwatches sit at about 260° to 310°." />
    </Fig>
  )
}

function MachineSetup() {
  const mx = 16
  const my = 32
  const key = [
    ['Beat rate', 'auto, or the calibre’s value'],
    ['Lift angle', 'your calibre, not the default'],
    ['Clamp firm', 'loose gives a snowy trace'],
    ['Gain', 'if the trace looks disturbed'],
  ]
  return (
    <Fig h={306} view="Elevation · machine and clamp" scale="schematic">
      <Machine x={mx} y={my} w={276} h={204}>
        <rect x={mx + 12} y={my + 12} width={252} height={26} rx="3" fill={LCD} stroke="#3c4c46" />
        <T x={mx + 20} y={my + 30} s={12} mono c={C.text}>28800</T>
        <T x={mx + 66} y={my + 30} s={10} c={C.faint}>beats/h</T>
        <T x={mx + 158} y={my + 30} s={12} mono c={C.ruby}>LA 50°</T>
        <Num x={mx + 122} y={my + 25} n={1} r={8} />
        <Num x={mx + 222} y={my + 25} n={2} r={8} c={C.ruby} />
        <Readout x={mx + 12} y={my + 44} w={80} label="Rate" value="+6" unit="s/d" />
        <Readout x={mx + 98} y={my + 44} w={80} label="Amplitude" value="284" unit="°" />
        <Readout x={mx + 184} y={my + 44} w={80} label="Beat error" value="0.2" unit="ms" />
        <Trace x={mx + 12} y={my + 84} w={252} h={80} series={[{ pts: sample(line(6, 0.1)), c: TICK }, { pts: sample(line(6, -0.1), { seed: 2 }), c: TOCK }]} />
        <circle cx={mx + 244} cy={my + 184} r={10} fill="url(#sk-steel)" stroke="#5f717d" />
        <line x1={mx + 244} y1={my + 184} x2={mx + 244} y2={my + 177} stroke={C.ground} strokeWidth="2" />
        <Num x={mx + 220} y={my + 184} n={4} r={8} />
        <circle cx={mx + 20} cy={my + 184} r={3.4} fill={C.emerald} />
        <T x={mx + 28} y={my + 188} s={10} c={C.faint}>signal</T>
      </Machine>
      <path d={`M${mx + 276} ${my + 180} C330 232 350 262 380 268`} fill="none" stroke="#5a5247" strokeWidth="2.4" />
      <Clamp x={410} y={236} />
      <Num x={452} y={216} n={3} r={8} />
      {key.map((k, i) => (
        <g key={k[0]}>
          <Num x={314} y={44 + i * 37} n={i + 1} r={8} c={i === 1 ? C.ruby : C.brass} />
          <T x={328} y={48 + i * 37} s={11.5} c={i === 1 ? C.ruby : C.text}>{k[0]}</T>
          <T x={328} y={61 + i * 37} s={10} c={C.faint}>{k[1]}</T>
        </g>
      ))}
      <T x={18} y={256} s={11} c={C.text}>Set these before you read anything.</T>
      <T x={18} y={274} s={10.5} c={C.dim}>Co-axial or other special escapement: use the machine’s</T>
      <T x={18} y={288} s={10.5} c={C.dim}>special mode. Without one, the amplitude can’t be trusted.</T>
    </Fig>
  )
}

function Prep() {
  const w = 146
  const col = (i) => 14 + i * 153
  const y1 = 30
  const y2 = 176
  return (
    <Fig h={322} view="Sequence · before the first reading" scale="schematic">
      {/* 1 wind */}
      <Panel x={col(0)} y={y1} w={w} h={138} title="Wind" />
      <Num x={col(0) + w - 14} y={y1 + 13} n={1} />
      <Face cx={col(0) + 56} cy={y1 + 72} r={30} />
      <path d={arcD(col(0) + 92, y1 + 72, 13, -120, 120)} fill="none" stroke={C.brass} strokeWidth="1.8" markerEnd="url(#sk-a-brass)" />
      <T x={col(0) + 73} y={y1 + 125} a="middle" s={11.5} mono c={C.brassHi}>10–15 crown turns</T>

      {/* 2 run */}
      <Panel x={col(1)} y={y1} w={w} h={138} title="Run in" />
      <Num x={col(1) + w - 14} y={y1 + 13} n={2} />
      <circle cx={col(1) + 73} cy={y1 + 62} r={32} fill="none" stroke={C.line} strokeWidth="5" />
      <path d={arcD(col(1) + 73, y1 + 62, 32, -90, 30)} fill="none" stroke={C.brass} strokeWidth="5" />
      <T x={col(1) + 73} y={y1 + 60} a="middle" s={15} mono c={C.text}>20</T>
      <T x={col(1) + 73} y={y1 + 75} a="middle" s={10.5} c={C.faint}>minutes</T>
      <T x={col(1) + 73} y={y1 + 118} a="middle" s={10.5} c={C.dim}>Rate settles.</T>
      <T x={col(1) + 73} y={y1 + 131} a="middle" s={10.5} c={C.dim}>Trace goes regular.</T>

      {/* 3 hands */}
      <Panel x={col(2)} y={y1} w={w} h={138} title="Hands" />
      <Num x={col(2) + w - 14} y={y1 + 13} n={3} />
      <Face cx={col(2) + 42} cy={y1 + 54} r={23} h={-20} m={-40} />
      <Verdict x={col(2) + 42} y={y1 + 94} ok={false} r={7} />
      <Face cx={col(2) + 104} cy={y1 + 54} r={23} h={130} m={40} />
      <Verdict x={col(2) + 104} y={y1 + 94} ok r={7} />
      <T x={col(2) + 73} y={y1 + 118} a="middle" s={10.5} c={C.dim}>Stay away from the</T>
      <T x={col(2) + 73} y={y1 + 131} a="middle" s={10.5} c={C.dim}>date change.</T>

      {/* 4 crown */}
      <Panel x={col(0)} y={y2} w={w + 73} h={136} title="Crown in" />
      <Num x={col(0) + w + 59} y={y2 + 13} n={4} />
      <rect x={col(0) + 34} y={y2 + 56} width={80} height={22} rx="3" fill="url(#sk-steel)" stroke="#4e5f6a" />
      <rect x={col(0) + 114} y={y2 + 64} width={22} height={5} fill="#c5ced4" stroke="#6d7f8a" strokeWidth="0.6" />
      <rect x={col(0) + 136} y={y2 + 56} width={16} height={22} rx="2" fill="#9fb0ba" stroke="#4e5f6a" />
      <Arrow a={[col(0) + 190, y2 + 67]} b={[col(0) + 158, y2 + 67]} c="brass" />
      <T x={col(0) + 110} y={y2 + 104} a="middle" s={10.5} c={C.dim}>Pushed fully home. A movement may</T>
      <T x={col(0) + 110} y={y2 + 118} a="middle" s={10.5} c={C.dim}>stop with the crown pulled out.</T>

      {/* 5 demag */}
      <Panel x={col(0) + w + 80} y={y2} w={w + 73} h={136} title="Demagnetise" />
      <Num x={452} y={y2 + 13} n={5} />
      <rect x={258} y={y2 + 84} width={64} height={26} rx="3" fill="#3a342c" stroke="#55503f" />
      <ellipse cx={290} cy={y2 + 84} rx={24} ry={5} fill="none" stroke={C.steel} strokeWidth="1.6" />
      <circle cx={311} cy={y2 + 99} r={4.5} fill={C.ruby} />
      <T x={268} y={y2 + 103} s={10} c={C.dim}>hold</T>
      <Side cx={290} cy={y2 + 60} w={40} />
      <Arrow a={[290, y2 + 46]} b={[290, y2 + 24]} c="brass" />
      <Para x={338} y={y2 + 36} w={120} s={10.5} lh={13} text="Hold the button first. Withdraw slowly to about 30 cm, then release." />
      <T x={338} y={y2 + 100} s={10.5} c={C.ruby}>Never tap it over</T>
      <T x={338} y={y2 + 113} s={10.5} c={C.ruby}>the coil.</T>
    </Fig>
  )
}

function PosIcon({ x, y, k, r = 19 }) {
  if (k === 'du') return <Side cx={x} cy={y + 2} w={r * 2.2} up />
  if (k === 'dd') return <Side cx={x} cy={y - 2} w={r * 2.2} up={false} flip />
  const rot = { cu: -90, cd: 90, t: 0, s: 180 }[k]
  return <Face cx={x} cy={y} r={r} rot={rot} h={40} m={140} crownHi />
}

function Sequence() {
  const xs = [52, 124, 196, 268, 350, 422]
  const ks = ['cu', 't', 'cd', 's', 'du', 'dd']
  const ns = ['crown up', '12 up', 'crown down', '6 up', 'dial up', 'dial down']
  return (
    <Fig h={296} view="Sequence · one run through the positions" scale="not to scale">
      <Tag x={16} y={36}>Verticals first</Tag>
      <Tag x={318} y={36}>Then flat</Tag>
      {xs.map((x, i) => (
        <g key={x}>
          <PosIcon x={x} y={72} k={ks[i]} r={18} />
          <T x={x} y={112} a="middle" s={10.5} c={C.text}>{ns[i]}</T>
          <rect x={x - 30} y={122} width={22} height={14} rx="2" fill="rgba(208,168,79,0.22)" stroke={C.brass} strokeWidth="0.7" />
          <rect x={x - 8} y={122} width={38} height={14} rx="2" fill="rgba(123,165,131,0.25)" stroke={C.emerald} strokeWidth="0.7" />
        </g>
      ))}
      <path d="M300 86 q8 -38 18 0" fill="none" stroke={C.ruby} strokeWidth="1.3" strokeDasharray="3 2" />
      <T x={309} y={158} a="middle" s={10.5} c={C.ruby}>longer settle here</T>
      <line x1={309} y1={148} x2={309} y2={88} stroke={C.ruby} strokeWidth="0.7" strokeDasharray="2 2" />

      <rect x={18} y={176} width={26} height={14} rx="2" fill="rgba(208,168,79,0.22)" stroke={C.brass} strokeWidth="0.7" />
      <T x={52} y={187} s={11} c={C.text}>settle about 15 s</T>
      <rect x={18} y={198} width={38} height={14} rx="2" fill="rgba(123,165,131,0.25)" stroke={C.emerald} strokeWidth="0.7" />
      <T x={64} y={209} s={11} c={C.text}>measure at least 20 s</T>
      <T x={18} y={231} s={10.5} c={C.dim}>For certification, METAS uses at least 20 s and 30 s.</T>

      <Sep x1={14} y1={244} x2={466} y2={244} />
      <T x={18} y={264} s={11} c={C.text}>Then leave it. Do not rewind.</T>
      <Arrow a={[196, 260]} b={[300, 260]} c="brass" />
      <T x={248} y={254} a="middle" s={10} mono c={C.brass}>24 h</T>
      <T x={308} y={264} s={11} c={C.text}>Read the same positions again.</T>
      <T x={18} y={283} s={10.5} c={C.faint}>Automatic that can’t be hand-wound: read it after a day’s wear.</T>
    </Fig>
  )
}

function PhoneOrMachine() {
  const rows = [
    ['Rate', 'Usable on a quiet desk', true, 'Yes', true],
    ['Beat error', 'Marginal', null, 'Yes', true],
    ['Amplitude', 'Not reliable', false, 'Yes, if lift angle is right', true],
  ]
  return (
    <Fig h={292} view="Comparison · phone against machine" scale="schematic">
      <T x={136} y={42} s={11} c={C.text} w="600">Phone microphone</T>
      <T x={296} y={42} s={11} c={C.text} w="600">Timing machine</T>
      {rows.map((r, i) => {
        const y = 66 + i * 34
        return (
          <g key={r[0]}>
            <line x1={18} y1={y - 15} x2={462} y2={y - 15} stroke={C.line} />
            <T x={22} y={y + 4} s={11.5} c={C.brass}>{r[0]}</T>
            {r[2] === null ? (
              <circle cx={146} cy={y} r={8} fill="rgba(208,168,79,0.15)" stroke={C.brass} strokeWidth="1.5" />
            ) : (
              <Verdict x={146} y={y} ok={r[2]} r={8} />
            )}
            <Para x={160} y={y + 4} w={126} s={10.5} lh={12} text={r[1]} />
            <Verdict x={306} y={y} ok r={8} />
            <Para x={320} y={y + 4} w={146} s={10.5} lh={12} text={r[3]} />
          </g>
        )
      })}
      <line x1={18} y1={153} x2={462} y2={153} stroke={C.line} />

      {/* the phone */}
      <rect x={22} y={164} width={62} height={116} rx="9" fill="#26211b" stroke="#6c6456" strokeWidth="1.4" />
      <rect x={27} y={174} width={52} height={92} rx="3" fill={LCD} stroke="#3c4c46" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
        <g key={i}>
          <circle cx={42} cy={180 + i * 8} r={1.5} fill={TICK} />
          <circle cx={64} cy={180 + i * 8} r={1.5} fill={TOCK} />
        </g>
      ))}
      <circle cx={53} cy={273} r={1.8} fill={C.ruby} />
      <Lead p={[53, 273]} t={[100, 272]} text="microphone at the base" s={10.5} />
      <Lead p={[64, 210]} t={[100, 200]} text="Timegrapher page" sub="time runs down the screen" s={10.5} />
      <Para x={104} y={232} w={160} s={10.5} lh={13} text="Healthy: two straight, even columns. Slant: fast or slow." />

      <Tag x={286} y={176}>Then use</Tag>
      <Para x={286} y={194} w={180} s={10.5} lh={13} c={C.text} text="Calculators: Daily rate, Beat rate, Amplitude & beat error." />
      <Para x={286} y={232} w={180} s={10.5} lh={13} c={C.text} text="Practice Log: rate, amplitude and beat error at every service." />
    </Fig>
  )
}

/* ------------------------------------------------------------------ */
/* Small annotation helpers for the charts                              */
/* ------------------------------------------------------------------ */
function VGap({ x, y1, y2, text, c = C.text, side = 1, s = 10.5 }) {
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={c} strokeWidth="1" markerStart="url(#sk-a-dim)" markerEnd="url(#sk-a-dim)" />
      {text && (
        <T x={x + side * 6} y={(y1 + y2) / 2 + 4} a={side > 0 ? 'start' : 'end'} s={s} mono c={c}>{text}</T>
      )}
    </g>
  )
}
function HGap({ x1, x2, y, text, c = C.text, up = true, s = 10.5 }) {
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={c} strokeWidth="1" markerStart="url(#sk-a-dim)" markerEnd="url(#sk-a-dim)" />
      {text && (
        <T x={(x1 + x2) / 2} y={up ? y - 5 : y + 13} a="middle" s={s} mono c={c}>{text}</T>
      )}
    </g>
  )
}
// Label sitting on a dark chip, for use on top of a trace.
function Chip({ x, y, text, c = C.text, a = 'start', s = 10.5 }) {
  const w = text.length * s * 0.56 + 8
  const left = a === 'middle' ? x - w / 2 : a === 'end' ? x - w : x
  return (
    <g>
      <rect x={left} y={y - s - 1} width={w} height={s + 6} rx="2" fill={LCD} opacity="0.9" />
      <T x={left + 4} y={y} s={s} c={c}>{text}</T>
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* Lesson 2: Lift angle                                                 */
/* ------------------------------------------------------------------ */
function LiftWhat() {
  const sx = 247
  const sy = 132
  const R = 54
  const orbit = R * 0.82
  const half = 25
  return (
    <Fig h={286} view="Detail · fork and roller" scale="schematic, angle to scale">
      <path d={`M${sx} ${sy} L${fx(pol(sx, sy, R + 44, 180 - half))} A${R + 44} ${R + 44} 0 0 0 ${fx(pol(sx, sy, R + 44, 180 + half))} Z`} fill="rgba(208,168,79,0.13)" stroke={C.brass} strokeWidth="0.8" strokeDasharray="3 2" />
      <Fork x={78} y={sy} k={2.15} rot={90} />
      <Roller cx={sx} cy={sy} r={R} pin={180} />
      {[180 - half, 180 + half].map((a) => {
        const p = pol(sx, sy, orbit, a)
        return <circle key={a} cx={p[0]} cy={p[1]} r={8} fill="none" stroke={C.ruby} strokeWidth="1.1" strokeDasharray="2 2" />
      })}
      <path d={arcD(sx, sy, R + 34, 180 - half, 180 + half)} fill="none" stroke={C.brass} strokeWidth="1.8" markerStart="url(#sk-a-brass)" markerEnd="url(#sk-a-brass)" />
      <T x={sx - R - 50} y={46} a="middle" s={11.5} c={C.brass} w="600">lift angle</T>
      <line x1={sx - R - 48} y1={52} x2={pol(sx, sy, R + 34, 180 + 12)[0]} y2={pol(sx, sy, R + 34, 180 + 12)[1]} stroke={C.struct} strokeWidth="0.8" />
      <circle cx={sx} cy={sy} r={2.4} fill={C.text} />
      <Lead p={[sx, sy]} t={[346, 112]} text="balance staff" />
      <Lead p={[sx - orbit, sy]} t={[206, 234]} text="impulse pin" a="start" />
      <Lead p={[150, sy - 7]} t={[110, 214]} text="pallet fork" a="middle" />
      <Lead p={pol(sx, sy, orbit, 180 + half)} t={[346, 44]} text="contact starts" c={C.ruby} />
      <Lead p={pol(sx, sy, orbit, 180 - half)} t={[346, 176]} text="contact ends" c={C.ruby} />
      <Para x={346} y={206} w={124} s={10.5} lh={13} text="The design sets this angle. You can’t adjust it, only enter it." />
      <T x={14} y={262} s={11} c={C.text}>The turn of the balance while the pin stays in contact with the fork.</T>
      <T x={14} y={278} s={10.5} c={C.faint}>Machines also call it “LA”. It is a setting, not a reading.</T>
    </Fig>
  )
}

function LiftSine() {
  // left: whole swing. right: zoomed crossing, both from A sin(2 pi f t) at 4 Hz.
  const L = { x: 22, y: 44, w: 168, h: 150 }
  const yA = (a) => L.y + L.h / 2 - (a / 320) * (L.h / 2)
  const curve = (A, c, dash) => {
    let d = ''
    for (let i = 0; i <= 120; i++) {
      const u = i / 120
      d += `${i ? 'L' : 'M'}${(L.x + u * L.w).toFixed(1)} ${yA(-A * Math.sin(u * 2 * Math.PI)).toFixed(1)}`
    }
    return <path d={d} fill="none" stroke={c} strokeWidth="1.7" strokeDasharray={dash} />
  }
  const Z = { x: 248, y: 44, w: 218, h: 150 }
  const ms = 8.2 // half width of the zoom, in ms
  const deg = 40 // half height of the zoom, in degrees
  const zx = (t) => Z.x + Z.w / 2 + (t / ms) * (Z.w / 2)
  const zy = (a) => Z.y + Z.h / 2 - (a / deg) * (Z.h / 2)
  const lineZ = (rate, c, dash) => <line x1={zx(-deg / rate)} y1={zy(-deg)} x2={zx(deg / rate)} y2={zy(deg)} stroke={c} strokeWidth="1.8" strokeDasharray={dash} />
  const fast = 7.04 // degrees per ms at 280 deg, 4 Hz
  const slow = 5.03 // degrees per ms at 200 deg, 4 Hz
  return (
    <Fig h={296} view="Chart · balance angle against time" scale="4 Hz · lift 50° · calculated">
      <Tag x={L.x} y={36}>One full swing</Tag>
      <rect x={L.x} y={L.y} width={L.w} height={L.h} fill={LCD} stroke="#3c4c46" rx="3" />
      <line x1={L.x} y1={yA(0)} x2={L.x + L.w} y2={yA(0)} stroke={GRID2} />
      <rect x={L.x} y={yA(25)} width={L.w} height={yA(-25) - yA(25)} fill="rgba(208,168,79,0.18)" />
      {curve(280, TICK)}
      {curve(200, C.steel, '4 3')}
      <rect x={L.x + L.w / 2 - 15} y={yA(38)} width={30} height={yA(-38) - yA(38)} fill="none" stroke={C.text} strokeWidth="0.9" />
      <line x1={L.x + L.w / 2 + 15} y1={yA(38)} x2={Z.x} y2={Z.y} stroke={C.struct} strokeWidth="0.7" strokeDasharray="3 2" />
      <line x1={L.x + L.w / 2 + 15} y1={yA(-38)} x2={Z.x} y2={Z.y + Z.h} stroke={C.struct} strokeWidth="0.7" strokeDasharray="3 2" />
      <T x={L.x + L.w / 2} y={L.y + L.h + 14} a="middle" s={10.5} c={C.dim}>250 ms, one full swing at 4 Hz</T>

      <Tag x={Z.x} y={36}>Zoom on the lift angle</Tag>
      <rect x={Z.x} y={Z.y} width={Z.w} height={Z.h} fill={LCD} stroke="#3c4c46" rx="3" />
      <rect x={Z.x} y={zy(25)} width={Z.w} height={zy(-25) - zy(25)} fill="rgba(208,168,79,0.18)" />
      <line x1={Z.x} y1={zy(0)} x2={Z.x + Z.w} y2={zy(0)} stroke={GRID2} />
      {lineZ(fast, TICK)}
      {lineZ(slow, C.steel, '4 3')}
      <Chip x={Z.x + 6} y={zy(25) + 15} text="50° of lift" c={C.brass} />
      <line x1={zx(-25 / fast)} y1={zy(25)} x2={zx(-25 / fast)} y2={Z.y + Z.h + 6} stroke={TICK} strokeWidth="0.7" strokeDasharray="2 2" />
      <line x1={zx(25 / fast)} y1={zy(-25)} x2={zx(25 / fast)} y2={Z.y + Z.h + 6} stroke={TICK} strokeWidth="0.7" strokeDasharray="2 2" />
      <line x1={zx(-25 / slow)} y1={zy(25)} x2={zx(-25 / slow)} y2={Z.y + Z.h + 24} stroke={C.steel} strokeWidth="0.7" strokeDasharray="2 2" />
      <line x1={zx(25 / slow)} y1={zy(-25)} x2={zx(25 / slow)} y2={Z.y + Z.h + 24} stroke={C.steel} strokeWidth="0.7" strokeDasharray="2 2" />
      <HGap x1={zx(-25 / fast)} x2={zx(25 / fast)} y={Z.y + Z.h + 6} c={TICK} text="" />
      <T x={zx(-25 / slow) - 6} y={Z.y + Z.h + 10} s={10.5} mono c={TICK} a="end">280°: 7.1 ms</T>
      <HGap x1={zx(-25 / slow)} x2={zx(25 / slow)} y={Z.y + Z.h + 24} c={C.steel} text="" />
      <T x={zx(-25 / slow) - 6} y={Z.y + Z.h + 28} s={10.5} mono c={C.steel} a="end">200°: 10 ms</T>

      <T x={22} y={238} s={11.5} mono c={C.brassHi}>amplitude = lift angle ÷ (2 × sin(ωt ÷ 2))</T>
      <Para x={22} y={258} w={440} s={10.5} lh={13} text="The machine measures t. It takes the lift angle on trust. A bigger swing crosses the same angle in less time. Formula from the sine motion of the balance." />
    </Fig>
  )
}

function LiftRule() {
  const y0 = 66
  const rows = [
    ['48°', 268.8],
    ['50°', 280],
    ['52°', 291.2],
    ['53°', 296.8],
  ]
  const x0 = 84
  const sc = (a) => x0 + (a - 240) * 4.2
  return (
    <Fig h={280} view="Chart · one watch, four lift settings" scale="true lift 50°">
      <Tag x={18} y={38}>Lift set</Tag>
      <Tag x={x0} y={38}>Amplitude shown</Tag>
      {rows.map(([s, a], i) => {
        const y = y0 + i * 30
        const ok = s === '50°'
        return (
          <g key={s}>
            <T x={22} y={y + 12} s={12.5} mono c={ok ? C.emerald : C.text}>{s}</T>
            <rect x={x0} y={y} width={sc(a) - x0} height={17} rx="2" fill={ok ? 'rgba(123,165,131,0.55)' : a > 280 ? 'rgba(194,88,99,0.5)' : 'rgba(134,167,189,0.5)'} />
            <T x={sc(a) + 6} y={y + 13} s={12.5} mono c={C.text}>{Math.round(a)}°</T>
          </g>
        )
      })}
      <line x1={sc(280)} y1={y0 - 8} x2={sc(280)} y2={y0 + 118} stroke={C.emerald} strokeWidth="1.1" strokeDasharray="3 2" />
      <T x={sc(280)} y={y0 + 131} a="middle" s={10.5} c={C.emerald}>true 280°</T>
      <T x={x0} y={y0 + 131} s={10} c={C.faint}>bars start at 240°</T>
      <Sep x1={14} y1={210} x2={466} y2={210} />
      <T x={18} y={230} s={11} c={C.text}>2° too high on a true 50° reads 4% high. A true 280° shows about 291°.</T>
      <Readout x={18} y={238} w={84} label="Rate" value="+6" unit="s/d" />
      <Readout x={108} y={238} w={84} label="Beat error" value="0.2" unit="ms" />
      <T x={204} y={254} s={11} c={C.emerald}>These two don’t move. They come from noise 1,</T>
      <T x={204} y={268} s={11} c={C.emerald}>so a wrong lift angle only hurts amplitude.</T>
    </Fig>
  )
}

function LiftCorrect() {
  const rows = [
    ['ETA 2824-2', '52°', '50°', '291°', '291 × 50 ÷ 52', '280°', 'reads high', true],
    ['ETA 6497', '53°', '44°', '301°', '301 × 44 ÷ 53', '250°', 'reads far too high', true],
    ['Seiko NH35 (typical)', '52°', '53°', '265°', '265 × 53 ÷ 52', '270°', 'reads low', false],
  ]
  const cols = [18, 138, 180, 224, 268, 384]
  return (
    <Fig h={276} view="Worked examples · correcting a reading" scale="rounded to 1°">
      <rect x={14} y={30} width={452} height={40} rx="5" fill="rgba(208,168,79,0.08)" stroke={C.brass} strokeWidth="0.8" />
      <T x={240} y={56} a="middle" s={14} mono c={C.brassHi}>true = shown × true lift ÷ lift set</T>
      {['Calibre', 'Set', 'True', 'Shown', 'Sum', 'True swing'].map((h, i) => (
        <T key={h} x={cols[i]} y={92} s={10} c={C.faint}>{h}</T>
      ))}
      {rows.map((r, i) => {
        const y = 118 + i * 38
        return (
          <g key={r[0]}>
            <line x1={14} y1={y - 19} x2={466} y2={y - 19} stroke={C.line} />
            <Para x={cols[0]} y={y} w={114} s={11} lh={12} c={C.text} text={r[0]} />
            <T x={cols[1]} y={y} s={11.5} mono c={C.ruby}>{r[1]}</T>
            <T x={cols[2]} y={y} s={11.5} mono c={C.emerald}>{r[2]}</T>
            <T x={cols[3]} y={y} s={11.5} mono c={C.dim}>{r[3]}</T>
            <T x={cols[4]} y={y} s={11} mono c={C.dim}>{r[4]}</T>
            <T x={cols[5]} y={y} s={13} mono c={C.brassHi} w="600">{r[5]}</T>
            <T x={cols[5] + 40} y={y} s={10} c={r[7] ? C.ruby : C.steel}>{r[6].split(' ')[0]}</T>
            <T x={cols[5] + 40} y={y + 12} s={10} c={r[7] ? C.ruby : C.steel}>{r[6].split(' ').slice(1).join(' ')}</T>
          </g>
        )
      })}
      <line x1={14} y1={213} x2={466} y2={213} stroke={C.line} />
      <Num x={26} y={232} n={1} r={8} />
      <T x={40} y={236} s={11} c={C.text}>Do the sum on the reading you already have.</T>
      <Num x={26} y={256} n={2} r={8} />
      <T x={40} y={260} s={11} c={C.text}>Change the setting and read again. The two should agree.</T>
    </Fig>
  )
}

function LiftTable() {
  const x0 = 40
  const sc = (v) => x0 + (v - 42) * 31
  const y = 58
  const col = (x, head, c, items) => (
    <g>
      <Tag x={x} y={134} c={c}>{head}</Tag>
      {items.map((it, i) => (
        <g key={it[0]}>
          <T x={x} y={152 + i * 15} s={10.5} c={C.text}>{it[0]}</T>
          <T x={x + 122} y={152 + i * 15} s={10.5} mono c={c} a="end">{it[1]}</T>
        </g>
      ))}
    </g>
  )
  return (
    <Fig h={338} view="Reference · lift angles" scale="check your calibre’s sheet">
      <line x1={sc(42)} y1={y} x2={sc(55)} y2={y} stroke={C.struct} />
      {[44, 46, 48, 50, 52, 54].map((v) => (
        <g key={v}>
          <line x1={sc(v)} y1={y - 4} x2={sc(v)} y2={y + 4} stroke={C.struct} />
          <T x={sc(v)} y={y + 17} a="middle" s={10.5} mono c={C.dim}>{v}°</T>
        </g>
      ))}
      <rect x={sc(48)} y={y - 9} width={sc(54) - sc(48)} height={18} fill="rgba(208,168,79,0.13)" stroke={C.brass} strokeWidth="0.7" />
      <T x={sc(49.6)} y={y - 14} a="middle" s={10.5} c={C.brass}>most fall here</T>
      <circle cx={sc(52)} cy={y} r={4} fill={C.brass} />
      <T x={sc(52.6)} y={y - 14} a="middle" s={10.5} c={C.brass}>common default</T>
      <circle cx={sc(44)} cy={y} r={4} fill={C.emerald} />
      <T x={sc(44)} y={y - 12} a="middle" s={10} c={C.emerald}>6497</T>
      <circle cx={sc(49)} cy={y} r={4} fill={C.emerald} />
      <circle cx={sc(50)} cy={y} r={4} fill={C.emerald} />
      <T x={sc(49)} y={y + 31} a="middle" s={10} c={C.emerald}>7750</T>
      <T x={sc(50) + 16} y={y + 31} a="middle" s={10} c={C.emerald}>2824-2</T>
      <Sep x1={14} y1={112} x2={466} y2={112} />
      {col(16, 'Maker’s sheet', C.emerald, [['ETA 2824-2', '50°'], ['ETA 7750', '49°'], ['ETA 6497', '44°']])}
      {col(172, 'Typical · two lists', C.brass, [['ETA 2000-1', '50°'], ['ETA 2836-2', '50°'], ['Miyota 9100, 9122', '51°'], ['Seiko 6R15, 6R35', '53°'], ['Seiko 7009', '53°'], ['Seiko 6309', '54.5°'], ['Rolex 3135', '52°'], ['Rolex 3235', '53°']])}
      {col(328, 'Typical · one list', C.steel, [['Sellita SW200-1', '50°'], ['ETA 2892-A2', '52°'], ['Unitas 6498', '44°'], ['Miyota 8215', '49°'], ['Seiko 7S26, 4R36', '53°'], ['Seiko NH35, NH36', '53°']])}
      <Panel x={14} y={204} w={140} h={78} title="Don’t pick one" c={C.ruby} />
      <Para x={22} y={234} w={128} s={10.5} lh={13} text="ETA 2834-2: 50° in one list, “2834” 53° in another." />
      <Para x={16} y={300} w={450} s={10.5} lh={13} c={C.dim} text="Suffixes matter: one list gives the older 2824 as 53° and the 2824-2 as 50°. Lists can share one origin, so two lists is not proof." />
    </Fig>
  )
}

function LiftUnknown() {
  const w = 146
  const col = (i) => 14 + i * 153
  const y = 30
  const cy = y + 72
  const b = (i) => col(i) + 73
  return (
    <Fig h={262} view="Sequence · an unknown lift angle" scale="forum method">
      <Panel x={col(0)} y={y} w={w} h={168} title="Mark the balance" />
      <Num x={col(0) + w - 14} y={y + 13} n={1} />
      <Balance cx={b(0)} cy={cy} r={38} mark={-90} />
      <line x1={b(0)} y1={cy - 50} x2={b(0)} y2={cy - 40} stroke={C.text} strokeDasharray="2 2" />
      <Para x={col(0) + 8} y={y + 130} w={132} s={10.5} lh={13} text="Pick a spot on the rim. Note where it rests." />

      <Panel x={col(1)} y={y} w={w} h={168} title="Reach 180°" c={C.brass} />
      <Num x={col(1) + w - 14} y={y + 13} n={2} />
      <Balance cx={b(1)} cy={cy} r={38} mark={90} />
      <path d={arcD(b(1), cy, 46, -90, 88)} fill="none" stroke={C.brass} strokeWidth="1.6" markerEnd="url(#sk-a-brass)" />
      <path d={arcD(b(1), cy, 46, -90, -268)} fill="none" stroke={C.steel} strokeWidth="1.6" markerEnd="url(#sk-a-steel)" />
      <Para x={col(1) + 8} y={y + 130} w={132} s={10.5} lh={13} text="Wind a little at a time until the mark just meets itself opposite." />

      <Panel x={col(2)} y={y} w={w} h={168} title="Match it" />
      <Num x={col(2) + w - 14} y={y + 13} n={3} />
      <rect x={b(2) - 46} y={cy - 34} width={92} height={36} rx="4" fill={LCD} stroke="#3c4c46" />
      <T x={b(2)} y={cy - 9} a="middle" s={17} mono c={TICK} w="600">180°</T>
      <T x={b(2)} y={cy + 24} a="middle" s={12} mono c={C.ruby}>LA ▲ ▼</T>
      <Para x={col(2) + 8} y={y + 130} w={132} s={10.5} lh={13} text="Change lift angle until the machine says 180°." />

      <T x={16} y={218} s={11} c={C.text}>Slow-motion phone video makes step 2 far easier to judge.</T>
      <Para x={16} y={236} w={450} s={10.5} lh={13} c={C.dim} text="Treat the result as a working value for this watch only. Before and after readings at one setting still compare fairly." />
    </Fig>
  )
}

/* ------------------------------------------------------------------ */
/* The trace library: one definition per pattern                        */
/* ------------------------------------------------------------------ */
const two = (f, g, o = {}) => [
  { pts: sample(f, o), c: TICK },
  { pts: sample(g, { ...o, seed: (o.seed || 7) + 5 }), c: TOCK },
]
const steady = (rate, half = 0.12, o) => two(line(rate, half), line(rate, -half), o)
const PI2 = Math.PI * 2
const wobble = (t) => 1.5 * Math.sin(0.7 * t + 0.4) + 1.0 * Math.sin(1.9 * t + 1) + 0.6 * Math.sin(3.3 * t)
const stairs = (t) => -2.5 + 1.9 * (1 / (1 + Math.exp(-(t - 6.4) * 9))) + 1.9 * (1 / (1 + Math.exp(-(t - 13.4) * 9)))
const dip = (t) => -2.6 + 6.4 * Math.exp(-t / 7) // the rate settles, so the curve levels out

function snowPts(seed) {
  const r = rng(seed)
  const pts = []
  for (let i = 0; i < 230; i++) pts.push([r() * SEC, (r() + r() + r() - 1.5) * 3.4])
  return pts
}
function dotsBelow(seed) {
  const r = rng(seed)
  const pts = []
  for (let i = 0; i < 34; i++) pts.push([(i + 0.2 + r() * 0.6) * (SEC / 34), -0.4 - r() * 3.6])
  return pts
}
const TR = {
  healthy: () => steady(8),
  beat: () => steady(8, 1.5),
  wrapped: () => two(line(20, -2), line(20, 6), { wrapIt: true }),
  fast: () => steady(90, 0.12, { wrapIt: true, n: 130 }),
  slow: () => steady(-90, 0.12, { wrapIt: true, n: 130 }),
  magnet: () => steady(300, 0.1, { wrapIt: true, n: 240 }),
  cu: () => steady(30),
  cd: () => steady(-40),
  h: () => steady(10),
  v: () => steady(-10),
  snow: () => [{ pts: snowPts(3), c: TICK, r: 1.1 }, { pts: snowPts(19), c: TOCK, r: 1.1 }],
  wave: () => two((t) => 3 * Math.sin((PI2 * t) / 11 + 0.5) + 0.12, (t) => 3 * Math.sin((PI2 * t) / 11 + 0.5) - 0.12),
  sine: () => two((t) => 0.9 * Math.sin((PI2 * t) / 3.75) + 0.1, (t) => 0.9 * Math.sin((PI2 * t) / 3.75) - 0.1, { n: 150 }),
  irregular: () => two((t) => wobble(t) + 0.8, (t) => wobble(t) - 0.5 + 0.6 * Math.sin(1.3 * t + 2), { jitter: 0.22, n: 120 }),
  fuzzy: () => [
    { pts: sample(line(14, -0.7), { n: 110 }), c: TOCK },
    { pts: sample(line(14, 0.7), { n: 150, jitter: 0.55, seed: 4 }), c: TICK },
  ],
  dots: () => [{ pts: sample((t) => 2.6 + 0 * t, { n: 110 }), c: TICK }, { pts: dotsBelow(5), c: TOCK, r: 1.5 }],
  steps: () => two((t) => stairs(t) + 0.6, (t) => stairs(t) - 0.6, { n: 120 }),
  third: () => {
    const gaps = [[0.6, 3.6], [5.4, 7.4], [9.2, 10.1], [11.8, 14.6], [16.2, 19.2]]
    const top = sample((t) => 3.1 + 0.02 * t, { n: 130, jitter: 0.12, seed: 9 }).filter(([t]) => gaps.some(([a, b]) => t > a && t < b))
    return [...two((t) => -0.2 + 0.3 * Math.sin(t * 0.8), (t) => -1.5 + 0.3 * Math.sin(t * 0.8 + 0.4), { n: 120, jitter: 0.1 }), { pts: top, c: C.ruby }]
  },
  curve: () => steady(0, 0).map((s, i) => ({ ...s, pts: sample((t) => dip(t) + (i ? -0.08 : 0.08), { n: 110 }) })),
}

// Rates printed on a screen corner.
const RateTag = ({ x, y, text, c = C.text, a = 'end' }) => <Chip x={x} y={y} text={text} c={c} a={a} s={11} />

/* Insets --------------------------------------------------------------- */
const IC = { x: 397, y: 102 }

function InsetHealthy() {
  const rows = [['Rate', '+8 s/d'], ['Amplitude', '290°'], ['Beat error', '0.2 ms']]
  return (
    <g>
      {rows.map((r, i) => (
        <g key={r[0]}>
          <T x={336} y={66 + i * 20} s={11} c={C.dim}>{r[0]}</T>
          <T x={460} y={66 + i * 20} s={11.5} mono c={C.emerald} a="end">{r[1]}</T>
        </g>
      ))}
      <Verdict x={352} y={134} ok r={9} />
      <T x={368} y={138} s={10.5} c={C.dim}>example values</T>
    </g>
  )
}
function InsetUneven() {
  return (
    <g>
      <Balance cx={IC.x} cy={IC.y} r={30} mark={-90} />
      <path d={arcD(IC.x, IC.y, 38, -90, 20)} fill="none" stroke={C.brass} strokeWidth="1.7" markerEnd="url(#sk-a-brass)" />
      <path d={arcD(IC.x, IC.y, 38, -90, -170)} fill="none" stroke={C.ruby} strokeWidth="1.7" markerEnd="url(#sk-a-ruby)" />
    </g>
  )
}
function InsetWrap() {
  const x = 362
  const w = 70
  const y = 50
  const h = 66
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={LCD} stroke="#3c4c46" rx="2" />
      <line x1={x + 8} y1={y + 28} x2={x + 58} y2={y + 4} stroke={TOCK} strokeWidth="2" strokeDasharray="1 3" strokeLinecap="round" />
      <line x1={x + 12} y1={y + h - 4} x2={x + 62} y2={y + h - 28} stroke={TOCK} strokeWidth="2" strokeDasharray="1 3" strokeLinecap="round" />
      <path d={`M${x + w + 4} ${y + 4} C${x + w + 26} ${y + 10} ${x + w + 26} ${y + h - 10} ${x + w + 4} ${y + h - 4}`} fill="none" stroke={C.brass} strokeWidth="1.4" markerEnd="url(#sk-a-brass)" />
      <T x={IC.x} y={y + h + 16} a="middle" s={10.5} c={C.dim}>off the top, back in</T>
      <T x={IC.x} y={y + h + 29} a="middle" s={10.5} c={C.dim}>at the bottom</T>
    </g>
  )
}
function bunchD(cx, cy) {
  let d = ''
  const n = 300
  for (let i = 0; i <= n; i++) {
    const u = i / n
    const a = 40 + u * 6 * 360
    const near = Math.exp(-(((((a % 360) + 540) % 360) - 180 - 150) ** 2) / 2200)
    const r = 7 + 30 * u + near * (37 - (7 + 30 * u)) * 0.72
    d += `${i ? 'L' : 'M'}${fx(pol(cx, cy, r, a))}`
  }
  return d
}
function InsetMagnet() {
  return (
    <g>
      <path d={bunchD(380, 100)} fill="none" stroke={C.steel} strokeWidth="0.9" />
      <circle cx={380} cy={100} r={5} fill="url(#sk-brassG)" />
      <circle cx={pol(380, 100, 36, -30)[0]} cy={pol(380, 100, 36, -30)[1]} r={11} fill="none" stroke={C.ruby} strokeWidth="1" strokeDasharray="2 2" />
      <T x={370} y={150} a="middle" s={10.5} c={C.ruby}>coils cling</T>
      <circle cx={442} cy={126} r={15} fill="#26211b" stroke="#6c6456" strokeWidth="1.3" />
      <path d="M436 119 L448 133 L441 128 Z" fill={C.ruby} />
      <path d="M436 119 L448 133 L443 124 Z" fill={C.text} />
      <T x={442} y={106} a="middle" s={10} c={C.dim}>compass</T>
    </g>
  )
}
function InsetPins() {
  const coil = (x, y) => <path d={`M${x} ${y - 34} Q${x + 3} ${y} ${x} ${y + 34}`} fill="none" stroke={C.steel} strokeWidth="1.5" />
  const pin = (x, y) => <circle cx={x} cy={y} r={4.6} fill="url(#sk-brassG)" stroke="#7d5f22" strokeWidth="0.7" />
  return (
    <g>
      {coil(363, 90)}
      {pin(354.5, 90)}
      {pin(372, 90)}
      <Arrow a={[340, 90]} b={[348, 90]} c="brass" w={1.5} />
      <Arrow a={[386, 90]} b={[378, 90]} c="brass" w={1.5} />
      {coil(431, 90)}
      {pin(417, 90)}
      {pin(446, 90)}
      <Arrow a={[409, 90]} b={[400, 90]} c="brass" w={1.5} />
      <Arrow a={[453, 90]} b={[462, 90]} c="brass" w={1.5} />
      <T x={363} y={136} a="middle" s={10.5} c={C.text}>close</T>
      <T x={363} y={149} a="middle" s={10} c={C.dim}>vertical slow</T>
      <T x={431} y={136} a="middle" s={10.5} c={C.text}>open</T>
      <T x={431} y={149} a="middle" s={10} c={C.dim}>vertical fast</T>
    </g>
  )
}
function InsetTrain() {
  return (
    <g>
      <Gear cx={376} cy={96} r={32} n={30} />
      <Gear cx={428} cy={124} r={16} n={12} fill="url(#sk-steel)" stroke="#5f717d" />
      <circle cx={pol(376, 96, 31, -35)[0]} cy={pol(376, 96, 31, -35)[1]} r={8} fill="none" stroke={C.ruby} strokeWidth="1.1" strokeDasharray="2 2" />
      <T x={414} y={62} s={10} c={C.dim}>repeats</T>
      <T x={414} y={75} s={10} c={C.dim}>each turn</T>
    </g>
  )
}
function InsetEscape() {
  return (
    <g>
      <EscWheel cx={IC.x} cy={92} r={34} n={15} />
      <circle cx={IC.x + 5} cy={95} r={34} fill="none" stroke={C.ruby} strokeWidth="1" strokeDasharray="3 2" />
      <T x={IC.x} y={147} a="middle" s={10.5} c={C.ruby}>out of true</T>
    </g>
  )
}
function InsetDirty() {
  const cx = IC.x
  return (
    <g>
      <rect x={cx - 52} y={78} width={38} height={34} fill={C.ruby} stroke="#8a3943" strokeWidth="0.8" />
      <rect x={cx + 14} y={78} width={38} height={34} fill={C.ruby} stroke="#8a3943" strokeWidth="0.8" />
      <rect x={cx - 9} y={50} width={18} height={88} rx="4" fill="url(#sk-steelH)" stroke="#5f717d" strokeWidth="0.7" />
      <path d="M383 78 q3 12 -1 34 l-6 0 q-5 -18 2 -34 Z" fill="#6d4a23" />
      <path d="M411 78 q-3 12 1 34 l7 0 q3 -18 -3 -34 Z" fill="#6d4a23" />
      <circle cx={377} cy={92} r={2} fill="#8d6c4b" />
      <circle cx={418} cy={99} r={2} fill="#8d6c4b" />
      <T x={cx} y={150} a="middle" s={10.5} c={C.dim}>thick, dirty oil</T>
    </g>
  )
}
function InsetEntry() {
  return (
    <g>
      <clipPath id="tm-entry-clip">
        <rect x={327} y={100} width={140} height={55} />
      </clipPath>
      <g clipPath="url(#tm-entry-clip)">
        <EscWheel cx={397} cy={166} r={48} n={15} rot={8} />
      </g>
      <Fork x={397} y={96} k={0.62} />
      <circle cx={378} cy={111} r={11} fill="none" stroke={C.ruby} strokeWidth="1.2" strokeDasharray="2 2" />
      <T x={336} y={70} s={10.5} c={C.ruby}>entry</T>
      <T x={336} y={83} s={10.5} c={C.ruby}>pallet</T>
    </g>
  )
}
function InsetTouch() {
  const c = [517, 80]
  return (
    <g>
      {[122, 106, 90].map((r, i) => (
        <path key={r} d={arcD(c[0], c[1], r, 165, 195)} fill="none" stroke={C.steel} strokeWidth={i ? 1 : 1.3} opacity={i ? 0.65 : 1} />
      ))}
      <rect x={342} y={106} width={22} height={14} rx="2" fill="url(#sk-brassG)" stroke="#7d5f22" strokeWidth="0.7" />
      <circle cx={391} cy={80} r={4.6} fill="url(#sk-brassG)" stroke="#7d5f22" strokeWidth="0.7" />
      <circle cx={403} cy={80} r={4.6} fill="url(#sk-brassG)" stroke="#7d5f22" strokeWidth="0.7" />
      <circle cx={394} cy={80} r={10} fill="none" stroke={C.ruby} strokeWidth="1.1" strokeDasharray="2 2" />
      <T x={336} y={62} s={10.5} c={C.ruby}>coil touches</T>
      <T x={336} y={75} s={10.5} c={C.ruby}>the pin</T>
      <T x={336} y={134} s={10.5} c={C.dim}>stud</T>
      <T x={336} y={148} s={10} c={C.dim}>scratch on speaker</T>
    </g>
  )
}
function InsetKnock() {
  return (
    <g>
      <path d="M332 78 L372 76 L384 68 L388 74 L378 82 L378 94 L388 102 L384 108 L372 100 L332 98 Z" fill="url(#sk-steel)" stroke="#5f717d" strokeWidth="0.8" />
      <Roller cx={420} cy={112} r={28} pin={205} />
      <circle cx={392} cy={102} r={13} fill="none" stroke={C.ruby} strokeWidth="1.2" strokeDasharray="2 2" />
      <T x={397} y={58} a="middle" s={10.5} c={C.ruby}>pin hits the horn</T>
      <T x={338} y={124} s={10} c={C.dim}>swing</T>
      <T x={338} y={137} s={10} c={C.dim}>too far</T>
      <path d={arcD(420, 112, 34, 175, 225)} fill="none" stroke={C.brass} strokeWidth="1.5" markerEnd="url(#sk-a-brass)" />
    </g>
  )
}
function InsetGauge() {
  const x0 = 336
  const sc = (a) => x0 + (a - 270) * 1.75
  const y = 92
  return (
    <g>
      <rect x={sc(270)} y={y} width={sc(315) - sc(270)} height={12} fill="rgba(123,165,131,0.4)" />
      <rect x={sc(315)} y={y} width={sc(330) - sc(315)} height={12} fill="rgba(208,168,79,0.5)" />
      <rect x={sc(330)} y={y} width={sc(340) - sc(330)} height={12} fill="rgba(194,88,99,0.6)" />
      <line x1={sc(315)} y1={y - 14} x2={sc(315)} y2={y + 14} stroke={C.brass} />
      <line x1={sc(330)} y1={y} x2={sc(330)} y2={y + 26} stroke={C.ruby} />
      <T x={sc(315)} y={y - 18} a="middle" s={10.5} mono c={C.brass}>315°</T>
      <T x={sc(315)} y={y - 31} a="middle" s={10} c={C.dim}>one guide</T>
      <T x={sc(330)} y={y + 39} a="middle" s={10.5} mono c={C.ruby}>330°</T>
      <T x={sc(330)} y={y + 52} a="middle" s={10} c={C.dim}>Witschi</T>
      <T x={x0} y={y + 28} s={10} c={C.dim}>amplitude</T>
    </g>
  )
}
function InsetTurn() {
  return (
    <g>
      <Face cx={358} cy={84} r={19} rot={-90} h={40} m={140} />
      <Arrow d="M382 84 Q404 70 414 84" c="brass" w={1.6} />
      <Side cx={434} cy={92} w={44} />
      <T x={397} y={132} a="middle" s={10.5} c={C.dim}>position changed:</T>
      <T x={397} y={146} a="middle" s={10.5} c={C.dim}>slow to settle</T>
    </g>
  )
}

/* Atlas: clean lines ---------------------------------------------------- */
function TraceAxes() {
  const x = 40
  const y = 34
  const w = 280
  const h = 150
  const thumbs = [
    ['+8 s/d', steady(8, 0.1, { n: 60 })],
    ['+30 s/d', steady(30, 0.1, { n: 60 })],
    ['+90 s/d', steady(90, 0.1, { n: 80, wrapIt: true })],
    ['−40 s/d', steady(-40, 0.1, { n: 60 })],
  ]
  return (
    <Fig h={316} view="Chart · how a trace is built" scale="20 s across · 10 ms tall">
      <Trace x={x} y={y} w={w} h={h} series={TR.beat()} />
      <Arrow a={[x, y + h + 12]} b={[x + w, y + h + 12]} c="steel" w={1.3} />
      <T x={x + w / 2} y={y + h + 26} a="middle" s={10.5} c={C.steel}>time: 20 s across this screen</T>
      <line x1={x - 12} y1={y} x2={x - 12} y2={y + h} stroke={C.dim} strokeWidth="0.9" markerStart="url(#sk-a-dim)" markerEnd="url(#sk-a-dim)" />
      <T x={x - 22} y={y + 10} s={10} c={C.emerald} a="middle">early</T>
      <T x={x - 22} y={y + h} s={10} c={C.ruby} a="middle">late</T>
      <Lead p={[xOf(x, w, 13), yOf(y, h, 1.5 + msPerSec(8) * 3)]} t={[334, 58]} text="tick row" c={TICK} />
      <Lead p={[xOf(x, w, 15), yOf(y, h, -1.5 + msPerSec(8) * 5)]} t={[334, 126]} text="tock row" c={TOCK} />
      <T x={338} y={84} s={10.5} c={C.dim}>Each dot is</T>
      <T x={338} y={97} s={10.5} c={C.dim}>one beat.</T>
      <T x={338} y={150} s={10.5} c={C.dim}>Slope is rate.</T>
      <T x={338} y={163} s={10.5} c={C.dim}>Gap is beat error.</T>

      <Tag x={14} y={228}>Same scale, four rates</Tag>
      {thumbs.map(([label, ser], i) => {
        const tx = 14 + i * 115
        return (
          <g key={label}>
            <Trace x={tx} y={236} w={106} h={48} series={ser} grid={false} r={0.9} />
            <T x={tx + 53} y={300} a="middle" s={11} mono c={C.text}>{label}</T>
          </g>
        )
      })}
    </Fig>
  )
}
function TrHealthy() {
  const x = 14, y = 28, w = 300, h = 128
  return (
    <Card insetTitle="On the machine" inset={<InsetHealthy />}
      looks="One tight line, climbing gently."
      means="Healthy. Tick and tock land together and the watch gains a little."
      act="Nothing to fix. Confirm it in other positions before you call it done.">
      <Trace x={x} y={y} w={w} h={h} series={TR.healthy()} />
      <Chip x={x + 8} y={y + 18} text="one line" c={C.emerald} />
      <RateTag x={x + w - 8} y={y + 18} text="+8 s/d" />
    </Card>
  )
}
function TrBeat() {
  const x = 14, y = 28, w = 300, h = 128
  const t = 12
  const top = yOf(y, h, line(8, 1.5)(t))
  const bot = yOf(y, h, line(8, -1.5)(t))
  return (
    <Card insetTitle="Uneven swing" inset={<InsetUneven />}
      looks="Two clean parallel lines, here about 3 ms apart."
      means="Beat error. The rest of the watch may be perfectly healthy."
      act="Fix the beat first, then check the rate again.">
      <Trace x={x} y={y} w={w} h={h} series={TR.beat()} />
      <line x1={xOf(x, w, t)} y1={top + 3} x2={xOf(x, w, t)} y2={bot - 3} stroke={C.text} strokeWidth="1" markerStart="url(#sk-a-text)" markerEnd="url(#sk-a-text)" />
      <Chip x={xOf(x, w, t) + 8} y={(top + bot) / 2 + 4} text="about 3 ms" c={C.text} />
      <Chip x={x + 8} y={y + 18} text="two lines, same slope" c={C.brass} />
    </Card>
  )
}
function TrWrap() {
  const x = 14, y = 28, w = 300, h = 128
  return (
    <Card scale="20 s across · forum report" insetTitle="The window wraps" inset={<InsetWrap />}
      looks="Lines that seem to close up, or meet near the edge of the screen."
      means="A large beat error has wrapped round. Forum reports, not a maker’s chart."
      act="Trust the beat error number over the picture. Set the beat, and the lines open out.">
      <Trace x={x} y={y} w={w} h={h} series={TR.wrapped()} />
      <Chip x={x + w - 8} y={y + h - 8} text="looks close, is not" c={C.ruby} a="end" />
      <ellipse cx={xOf(x, w, 8)} cy={yOf(y, h, -3.1)} rx={34} ry={17} fill="none" stroke={C.ruby} strokeWidth="1" strokeDasharray="3 2" />
    </Card>
  )
}
function TrRate() {
  const y = 28, h = 128, w = 220
  return (
    <Card looks="Clean, straight and steep. Here +90 and −90 s/d."
      means="The movement is fine. It only runs fast or slow."
      act="Regulate. Confirm amplitude and beat are healthy first.">
      <Trace x={14} y={y} w={w} h={h} series={TR.fast()} />
      <Trace x={246} y={y} w={w} h={h} series={TR.slow()} />
      <RateTag x={14 + w - 8} y={y + 18} text="A: +90 s/d, too fast" c={C.text} />
      <RateTag x={246 + w - 8} y={y + 18} text="B: −90 s/d, too slow" c={C.text} />
    </Card>
  )
}
function TrMagnet() {
  const x = 14, y = 28, w = 300, h = 128
  return (
    <Card insetTitle="Magnetised spring" inset={<InsetMagnet />}
      looks="A sudden huge gain with clean, very steep lines. Here +300 s/d, which is 5 min a day."
      means="Suspect magnetism first. Typical gains are 2 to 10 min a day, and hours in bad cases."
      act="Compass test, demagnetise, read again. Still fast: suspect stuck or touching coils." h={276}>
      <Trace x={x} y={y} w={w} h={h} series={TR.magnet()} r={1.1} />
      <RateTag x={x + w - 8} y={y + 18} text="+300 s/d" />
    </Card>
  )
}
function TrVertical() {
  const y = 28, h = 128, w = 220
  return (
    <Card looks="Very different slopes in two upright positions. Here +30 and −40 s/d."
      means="Large vertical variation, 70 s/d apart. This is not a regulator job."
      act="Centre, poise or replace the regulating organ.">
      <Trace x={14} y={y} w={w} h={h} series={TR.cu()} />
      <Trace x={246} y={y} w={w} h={h} series={TR.cd()} />
      <Face cx={40} cy={y + 30} r={16} rot={-90} h={40} m={140} crownHi />
      <Face cx={272} cy={y + h - 30} r={16} rot={90} h={40} m={140} crownHi />
      <RateTag x={14 + w - 8} y={y + h - 8} text="crown up: +30 s/d" />
      <RateTag x={246 + w - 8} y={y + 18} text="crown down: −40 s/d" />
    </Card>
  )
}
function TrPins() {
  const y = 28, h = 128, w = 148
  return (
    <Card insetTitle="Regulator pins" inset={<InsetPins />}
      looks="A small change in slope from flat to upright. Here +10 and −10 s/d."
      means="The gap between the regulator pins."
      act="Vertical slow: close the pins. Vertical fast: open them. Make a small change, then read both again.">
      <Trace x={14} y={y} w={w} h={h} series={TR.h()} />
      <Trace x={170} y={y} w={w} h={h} series={TR.v()} />
      <Side cx={46} cy={y + 24} w={40} />
      <Face cx={194} cy={y + 26} r={15} rot={-90} h={40} m={140} crownHi />
      <RateTag x={14 + w - 6} y={y + h - 8} text="flat: +10 s/d" />
      <RateTag x={170 + w - 6} y={y + h - 8} text="upright: −10 s/d" />
    </Card>
  )
}

/* Atlas: broken and wavy lines ------------------------------------------ */
function TrSnow() {
  const x = 14, y = 28, w = 300, h = 128
  const checks = ['Clamp firm?', 'Room quiet?', 'Gain right?', 'Demagnetised?']
  return (
    <Card insetTitle="Retest first"
      inset={
        <g>
          {checks.map((c, i) => (
            <g key={c}>
              <Num x={344} y={58 + i * 24} n={i + 1} r={8} />
              <T x={356} y={62 + i * 24} s={11} c={C.text}>{c}</T>
            </g>
          ))}
        </g>
      }
      looks="Dots scattered everywhere with no clear line."
      means="Dirt, wear, damage or magnetism. But noise or a loose clamp does the same."
      act="Retest before you believe it. If it stays snowy after all four checks, it is real.">
      <Trace x={x} y={y} w={w} h={h} series={TR.snow()} />
      <Chip x={x + 8} y={y + 18} text="snow" c={C.text} />
    </Card>
  )
}
function TrWave() {
  const x = 14, y = 28, w = 300, h = 128
  const c0 = 11 * (0.25 - 0.5 / PI2)
  return (
    <Card insetTitle="Going train" inset={<InsetTrain />}
      looks="A large, regular wave that keeps repeating."
      means="A defect in the going train. Regular means something turning."
      act="Overhaul. Some train parts may need replacing.">
      <Trace x={x} y={y} w={w} h={h} series={TR.wave()} />
      <HGap x1={xOf(x, w, c0)} x2={xOf(x, w, c0 + 11)} y={y + 13} text="" c={C.text} />
      <Chip x={xOf(x, w, c0 + 5.5)} y={y + 30} text="one cycle" c={C.text} a="middle" />
    </Card>
  )
}
function TrSine() {
  const x = 14, y = 28, w = 300, h = 128
  return (
    <Card insetTitle="Escape wheel" inset={<InsetEscape />}
      looks="A small, regular ripple. One cycle every 15 to 21 teeth."
      means="The escape wheel runs untrue. One cycle is one turn of the wheel."
      act="Replace the escape wheel.">
      <Trace x={x} y={y} w={w} h={h} series={TR.sine()} />
      <HGap x1={xOf(x, w, 0.94)} x2={xOf(x, w, 4.69)} y={y + 36} text="" c={C.text} />
      <Chip x={xOf(x, w, 5.2)} y={y + 28} text="one turn: 15 to 21 teeth" c={C.text} />
    </Card>
  )
}
function TrIrregular() {
  const x = 14, y = 28, w = 300, h = 128
  return (
    <Card insetTitle="Worn or dirty" inset={<InsetDirty />}
      looks="Two wavy lines with no repeating pattern."
      means="Worn or dirty. Amplitude is usually low as well."
      act="Overhaul.">
      <Trace x={x} y={y} w={w} h={h} series={TR.irregular()} />
      <Chip x={x + 8} y={y + h - 8} text="no two waves alike" c={C.ruby} />
    </Card>
  )
}
function TrFuzzy() {
  const x = 14, y = 28, w = 300, h = 128
  return (
    <Card insetTitle="Escapement" inset={<InsetEntry />}
      looks="Two lines. One is fuzzy and the other stays clean."
      means="The entry pallet is poor or smeared."
      act="Clean the escapement. If that fails, replace the escape wheel.">
      <Trace x={x} y={y} w={w} h={h} series={TR.fuzzy()} />
      <Lead p={[xOf(x, w, 7), yOf(y, h, 0.75)]} t={[xOf(x, w, 5), y + 22]} text="fuzzy" a="middle" c={TICK} />
      <Lead p={[xOf(x, w, 13), yOf(y, h, -0.65)]} t={[xOf(x, w, 15), y + h - 22]} text="clean" a="middle" c={TOCK} />
    </Card>
  )
}
function TrDots() {
  const x = 14, y = 28, w = 300, h = 128
  return (
    <Card insetTitle="At the regulator" inset={<InsetTouch />}
      looks="Clean line with scattered dots below it, and a scratching sound."
      means="The hairspring touches the regulator pins or the stud."
      act="Centre the hairspring, then re-regulate.">
      <Trace x={x} y={y} w={w} h={h} series={TR.dots()} />
      <Chip x={x + 8} y={y + 18} text="clean line" c={TICK} />
      <Chip x={x + w - 8} y={y + h - 6} text="scattered dots below" c={TOCK} a="end" />
    </Card>
  )
}
function TrSteps() {
  const x = 14, y = 28, w = 300, h = 128
  return (
    <Card insetTitle="Knocking" inset={<InsetKnock />}
      looks="Both lines jump up in steps now and then. Doubled tick on the speaker."
      means="Occasional knocking. Amplitude is too high."
      act="Check lift angle first. If real, replace the mainspring, pallet stone or escape wheel." h={276}>
      <Trace x={x} y={y} w={w} h={h} series={TR.steps()} />
      <Lead p={[xOf(x, w, 6.4), yOf(y, h, -1.2)]} t={[xOf(x, w, 4.4), y + h - 16]} text="step" a="middle" c={C.ruby} />
      <Lead p={[xOf(x, w, 13.4), yOf(y, h, 0.7)]} t={[xOf(x, w, 15.5), y + h - 16]} text="step" a="middle" c={C.ruby} />
    </Card>
  )
}
function TrThird() {
  const x = 14, y = 28, w = 300, h = 128
  return (
    <Card insetTitle="Amplitude warning" inset={<InsetGauge />}
      looks="A third, broken line above the other two."
      means="Continuous knocking. Amplitude is too high."
      act="Check lift angle first. If real, replace the mainspring, pallet stone or escape wheel." h={276}>
      <Trace x={x} y={y} w={w} h={h} series={TR.third()} />
      <Chip x={x + 8} y={y + 18} text="third line, broken" c={C.ruby} />
    </Card>
  )
}
function TrCurve() {
  const x = 14, y = 28, w = 300, h = 128
  return (
    <Card insetTitle="Vertical to flat" inset={<InsetTurn />}
      looks="One long curve just after you change position. It takes a long time to level."
      means="Balance and train bearings are badly lubricated, or not at all."
      act="Clean and lubricate. Overhaul if needed.">
      <Trace x={x} y={y} w={w} h={h} series={TR.curve()} />
      <Chip x={x + 40} y={y + 18} text="position changed here" c={C.text} />
      <Arrow a={[x + 36, y + 14]} b={[x + 12, y + 20]} c="brass" w={1.3} />
    </Card>
  )
}

function Pair({ y, a, b, la, lb, text }) {
  const w = 104
  const h = 50
  return (
    <g>
      <Trace x={14} y={y} w={w} h={h} series={a} grid={false} r={0.95} />
      <Trace x={124} y={y} w={w} h={h} series={b} grid={false} r={0.95} />
      <T x={14 + w / 2} y={y + h + 13} a="middle" s={10.5} c={C.text}>{la}</T>
      <T x={124 + w / 2} y={y + h + 13} a="middle" s={10.5} c={C.text}>{lb}</T>
      <Para x={240} y={y + 12} w={228} s={10.5} lh={13} text={text} />
    </g>
  )
}
function TrPairs() {
  return (
    <Fig h={344} view="Comparison · traces people confuse" scale="thumbnails · one scale">
      <Pair y={28} a={TR.wave()} b={TR.sine()} la="large wave" lb="small ripple" text="Size and speed. A ripple that repeats every 15 to 21 teeth is the escape wheel. A big slow wave is the train." />
      <Pair y={106} a={TR.beat()} b={TR.fuzzy()} la="beat error" lb="one line fuzzy" text="Both have two lines. Look at the line edges. Both crisp: beat. One ragged: entry pallet." />
      <Pair y={184} a={TR.dots()} b={TR.snow()} la="dots below" lb="snow" text="A clean line that survives means something touching. No line left means retest first." />
      <Pair y={262} a={TR.magnet()} b={TR.fast()} la="magnetism" lb="just fast" text="Both clean and steep. Sudden, huge and minutes a day: magnetism first. A steady gain: regulate." />
    </Fig>
  )
}
function TrSheet() {
  const items = [
    ['healthy', 'healthy', 'none'],
    ['beat', 'beat error', 'beat, then rate'],
    ['wrapped', 'wrapped beat', 'set the beat'],
    ['fast', 'fast or slow', 'regulate'],
    ['magnet', 'magnetism', 'demagnetise'],
    ['cd', 'big vertical gap', 'centre, poise'],
    ['v', 'flat vs upright', 'pin gap'],
    ['snow', 'snow', 'retest first'],
    ['wave', 'large wave', 'train: overhaul'],
    ['sine', 'small ripple', 'escape wheel'],
    ['irregular', 'irregular double', 'overhaul'],
    ['fuzzy', 'one line fuzzy', 'clean escapement'],
    ['dots', 'dots below', 'centre hairspring'],
    ['steps', 'steps', 'knocking'],
    ['third', 'third line', 'knocking'],
    ['curve', 'long curve', 'clean, lubricate'],
  ]
  const w = 106
  const h = 40
  return (
    <Fig h={352} view="Reference · the atlas on one sheet" scale="one scale · schematic">
      {items.map(([k, a, b], i) => {
        const x = 14 + (i % 4) * 115
        const y = 28 + Math.floor(i / 4) * 80
        return (
          <g key={k}>
            <Trace x={x} y={y} w={w} h={h} series={TR[k]()} grid={false} r={0.8} />
            <T x={x + 1} y={y + h + 13} s={10.5} c={C.text}>{a}</T>
            <T x={x + 1} y={y + h + 26} s={10} c={C.emerald}>{b}</T>
          </g>
        )
      })}
    </Fig>
  )
}

/* ------------------------------------------------------------------ */
/* Balance cock, plan view, with an Etachron-style regulator            */
/* ------------------------------------------------------------------ */
// aPin and aStud are the angles of the pins and the stud round the balance.
function CockPlan({ cx, cy, R = 72, aPin = -6, aStud = 34, active, carrier = true, hiPin, hiStud }) {
  const turns = 6
  const pinP = pol(cx, cy, R - 1, aPin)
  const studP = pol(cx, cy, R, aStud)
  const head = 30
  const foot = [cx - 136, cy + 18]
  return (
    <g>
      <circle cx={cx} cy={cy} r={R + 10} fill="none" stroke="#7d5f22" strokeWidth="9" opacity="0.5" />
      <Spring cx={cx} cy={cy} r0={9} r1={R} turns={turns} a0={aStud} w={0.85} />
      {active && <path d={arcD(cx, cy, R, aPin, aStud)} fill="none" stroke={C.faint} strokeWidth="2.4" />}
      {active && <path d={arcD(cx, cy, R - 0.6, aPin - 120, aPin)} fill="none" stroke={C.brass} strokeWidth="2.2" />}
      {/* cock */}
      <path d={`M${cx - 6} ${cy - head} L${foot[0]} ${foot[1] - 26} a26 26 0 0 0 0 52 L${cx - 6} ${cy + head} a${head} ${head} 0 0 0 0 ${-2 * head} Z`} fill="url(#sk-steel)" stroke="#5f717d" strokeWidth="0.9" />
      <circle cx={foot[0] + 2} cy={foot[1]} r={8.5} fill="#74848e" stroke="#4e5f6a" />
      <line x1={foot[0] - 4} y1={foot[1] - 4} x2={foot[0] + 8} y2={foot[1] + 4} stroke={C.ground} strokeWidth="1.5" />
      {/* index tail and scale */}
      {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((i) => {
        const p0 = pol(cx, cy, 60, 180 + i * 4)
        const p1 = pol(cx, cy, i % 5 === 0 ? 70 : 66, 180 + i * 4)
        return <line key={i} x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke="#39454c" strokeWidth="1" />
      })}
      {/* pin block */}
      <line x1={cx} y1={cy} x2={pinP[0]} y2={pinP[1]} stroke={hiPin ? C.brassHi : '#b08a3c'} strokeWidth="7" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={pol(cx, cy, 58, 180 + aPin)[0]} y2={pol(cx, cy, 58, 180 + aPin)[1]} stroke={hiPin ? C.brassHi : '#b08a3c'} strokeWidth="3.4" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={21} fill="url(#sk-brassG)" stroke="#7d5f22" />
      <rect x={pinP[0] - 2} y={pinP[1] - 8} width={4} height={16} fill={C.ground} transform={`rotate(${aPin} ${pinP[0]} ${pinP[1]})`} opacity="0.75" />
      {/* stud carrier */}
      {carrier && (
        <g>
          <line x1={cx} y1={cy} x2={studP[0]} y2={studP[1]} stroke={hiStud ? '#eef3f6' : '#b3c2cc'} strokeWidth="7" strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={14} fill="url(#sk-steel)" stroke="#5f717d" />
        </g>
      )}
      <rect x={studP[0] - 5} y={studP[1] - 5} width={10} height={10} rx="1.5" fill="#3a342c" stroke={C.text} strokeWidth="0.9" transform={`rotate(${aStud} ${studP[0]} ${studP[1]})`} />
      <circle cx={cx} cy={cy} r={7} fill={C.ruby} stroke="#8a3943" />
      <circle cx={cx} cy={cy} r={2} fill="#f0b9bf" />
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* Lesson: Set the beat                                                 */
/* ------------------------------------------------------------------ */
function BeatRest() {
  const scene = (y, off, title, ok, text) => {
    const cy = y + 60
    return (
      <g>
        <Panel x={14} y={y} w={452} h={116} title={title} c={ok ? C.emerald : C.ruby} />
        <EscWheel cx={68} cy={cy + 2} r={32} n={15} rot={5} />
        <line x1={22} y1={cy} x2={292} y2={cy} stroke={C.text} strokeWidth="0.8" strokeDasharray="5 3" opacity="0.7" />
        <Fork x={146} y={cy} k={1} rot={90 + off * 0.32} />
        <Roller cx={233} cy={cy} r={28} pin={180 - off} />
        {[68, 146, 233].map((x) => <circle key={x} cx={x} cy={cy} r={2} fill={C.text} />)}
        <Verdict x={306} y={cy} ok={ok} r={10} />
        <Para x={324} y={y + 34} w={136} s={10.5} lh={13} c={C.text} text={text} />
      </g>
    )
  }
  return (
    <Fig h={286} view="Plan · balance at rest, power let down" scale="schematic">
      {scene(28, 0, 'In beat', true, 'The impulse pin rests on the line of centres. Each swing is even.')}
      {scene(150, 20, 'Out of beat', false, 'The pin rests off the line. The swing goes further one way than the other.')}
      <T x={22} y={282} s={10} c={C.faint}>dashed line: the line of centres, drawn for a straight-line lever</T>
    </Fig>
  )
}

function BeatDecide() {
  const x0 = 110
  const sc = (v) => x0 + v * 170
  const row = (y, name, sub, bands) => (
    <g>
      <T x={16} y={y + 12} s={11} c={C.text}>{name}</T>
      <T x={16} y={y + 25} s={10} c={C.faint}>{sub}</T>
      {bands.map(([a, b, fill, text, tc]) => (
        <g key={a}>
          <rect x={sc(a)} y={y} width={sc(b) - sc(a) - 2} height={32} rx="3" fill={fill} />
          <T x={(sc(a) + sc(b)) / 2 - 1} y={y + 20} a="middle" s={10.5} c={tc || C.text}>{text}</T>
        </g>
      ))}
    </g>
  )
  const green = 'rgba(123,165,131,0.32)'
  const amber = 'rgba(208,168,79,0.28)'
  const red = 'rgba(194,88,99,0.34)'
  return (
    <Fig h={258} view="Chart · should you touch the beat?" scale="beat error, ms">
      {[0, 0.5, 1, 2].map((v) => (
        <g key={v}>
          <T x={sc(v)} y={46} a="middle" s={10.5} mono c={C.dim}>{v === 0 ? '0' : v.toFixed(1)}</T>
          <line x1={sc(v)} y1={50} x2={sc(v)} y2={146} stroke={C.line} />
        </g>
      ))}
      {row(58, 'Stud carrier', 'adjuster fitted', [[0, 0.5, green, 'leave it'], [0.5, 1, amber, 'trim it'], [1, 2, red, 'set the beat']])}
      {row(102, 'Fixed stud', 'no adjuster', [[0, 0.5, green, 'leave it'], [0.5, 1, green, 'leave it'], [1, 2, amber, 'twist collet, or accept it']])}
      <T x={16} y={166} s={10.5} c={C.dim}>0.5 ms or less is the target. Up to about 1 ms is common.</T>
      <Sep x1={14} y1={178} x2={466} y2={178} />
      <Tag x={16} y={198}>The order never changes</Tag>
      <rect x={16} y={208} width={120} height={34} rx="5" fill="rgba(208,168,79,0.14)" stroke={C.brass} />
      <T x={76} y={230} a="middle" s={12} c={C.brassHi} w="600">1 · Beat</T>
      <Arrow a={[142, 225]} b={[184, 225]} c="brass" />
      <rect x={192} y={208} width={120} height={34} rx="5" fill="rgba(134,167,189,0.12)" stroke={C.steel} />
      <T x={252} y={230} a="middle" s={12} c={C.steel} w="600">2 · Rate</T>
      <Para x={326} y={220} w={140} s={10.5} lh={13} text="Beat moves the rate. Rate does not cure beat." />
    </Fig>
  )
}

function BeatCarrier() {
  const cx = 214
  const cy = 136
  const stud = pol(cx, cy, 72, 34)
  const pin = pol(cx, cy, 71, -6)
  return (
    <Fig h={296} view="Plan · balance cock with stud carrier" scale="schematic">
      <CockPlan cx={cx} cy={cy} hiStud />
      <path d={arcD(cx, cy, 92, 22, 46)} fill="none" stroke={C.brass} strokeWidth="2" markerStart="url(#sk-a-brass)" markerEnd="url(#sk-a-brass)" />
      <Lead p={stud} t={[350, 232]} text="stud" sub="holds the end of the spring" />
      <Lead p={pol(cx, cy, 46, 34)} t={[350, 186]} text="stud carrier" sub="moves the beat" c={C.brass} />
      <Lead p={pin} t={[350, 64]} text="regulator pins" sub="leave these alone here" />
      <Lead p={[cx, cy]} t={[250, 40]} text="cap jewel" a="middle" />
      <Lead p={[cx - 100, cy + 12]} t={[100, 48]} text="balance cock" a="middle" />
      <Lead p={pol(cx, cy, 66, 150)} t={[60, 246]} text="balance rim" a="middle" />
      <T x={16} y={272} s={10.5} c={C.dim}>Etachron: the stud carrier is the nickel-plated block, and the pin block is brass.</T>
      <T x={16} y={287} s={10.5} c={C.dim}>Tools: Bergeon 31081, or 31081-EX-7750 for 7750-based movements.</T>
    </Fig>
  )
}

function BeatNudge() {
  const x0 = 60
  const y0 = 42
  const w = 250
  const h = 150
  const sx = (v) => x0 + ((v + 3) / 6) * w
  const sy = (v) => y0 + h - (v / 2.4) * h
  const pts = [
    [-2.1, 1.6, '1', 'start'],
    [-2.7, 2.1, '2', 'wrong way'],
    [-1.3, 1.1, '3', 'go back'],
    [-0.5, 0.4, '4', 'closer'],
  ]
  return (
    <Fig h={276} view="Chart · finding the beat by trial" scale="example readings">
      <rect x={x0} y={y0} width={w} height={h} rx="3" fill="rgba(255,255,255,0.02)" stroke={C.line} />
      <rect x={x0} y={sy(0.5)} width={w} height={sy(0) - sy(0.5)} fill="rgba(123,165,131,0.2)" />
      <T x={x0 + w - 6} y={sy(0.5) + 13} s={10} c={C.emerald} a="end">0.5 ms target</T>
      <path d={`M${sx(-2.9)} ${sy(2.2)} L${sx(0)} ${sy(0)} L${sx(2.9)} ${sy(2.2)}`} fill="none" stroke={C.steel} strokeWidth="1.3" strokeDasharray="4 3" />
      <T x={x0 - 8} y={sy(2) + 4} a="end" s={10} mono c={C.dim}>2 ms</T>
      <T x={x0 - 8} y={sy(1) + 4} a="end" s={10} mono c={C.dim}>1 ms</T>
      <T x={x0 - 8} y={sy(0) + 4} a="end" s={10} mono c={C.dim}>0</T>
      <T x={x0 + w / 2} y={y0 + h + 16} a="middle" s={10.5} c={C.dim}>position of the stud carrier</T>
      {pts.map(([a, b, n], i) => (
        <g key={n}>
          {i > 0 && <line x1={sx(pts[i - 1][0])} y1={sy(pts[i - 1][1])} x2={sx(a)} y2={sy(b)} stroke={C.brass} strokeWidth="1" />}
          <Num x={sx(a)} y={sy(b)} n={n} r={8} c={i === 1 ? C.ruby : C.brass} />
        </g>
      ))}
      {[
        ['1', '1.6 ms', 'start reading', C.text],
        ['2', '2.1 ms', 'worse: wrong way', C.ruby],
        ['3', '1.1 ms', 'better: keep going', C.text],
        ['4', '0.4 ms', 'stop here', C.emerald],
      ].map((r, i) => (
        <g key={r[0]}>
          <Num x={334} y={58 + i * 34} n={r[0]} r={8} c={i === 1 ? C.ruby : C.brass} />
          <T x={348} y={56 + i * 34} s={12} mono c={r[3]}>{r[1]}</T>
          <T x={348} y={69 + i * 34} s={10} c={C.dim}>{r[2]}</T>
        </g>
      ))}
      <Para x={16} y={232} w={448} s={10.5} lh={13} text="You can’t tell the direction by looking. A tiny move and a fresh reading tells you. Let each reading settle before you touch it again." />
    </Fig>
  )
}

function BeatFixed() {
  const ax = 118
  const ay = 118
  return (
    <Fig h={282} view="Comparison · adjuster against fixed stud" scale="schematic">
      <Panel x={14} y={28} w={214} h={186} title="Stud carrier" c={C.emerald} />
      <g transform={`translate(${ax} ${ay}) scale(0.62) translate(${-ax} ${-ay})`}>
        <CockPlan cx={ax + 40} cy={ay} hiStud />
      </g>
      <path d={arcD(ax + 25, ay, 58, 22, 48)} fill="none" stroke={C.brass} strokeWidth="1.8" markerStart="url(#sk-a-brass)" markerEnd="url(#sk-a-brass)" />
      <T x={121} y={204} a="middle" s={10.5} c={C.emerald}>Move the carrier, watch the number.</T>

      <Panel x={236} y={28} w={230} h={186} title="Fixed stud" c={C.ruby} />
      <g transform={`translate(300 ${ay}) scale(0.5) translate(-322 ${-ay})`}>
        <CockPlan cx={362} cy={ay} carrier={false} />
      </g>
      <Lead p={[320, 138]} t={[352, 170]} text="stud fixed in the cock" a="middle" c={C.ruby} />
      <Verdict x={360} y={42} ok={false} r={8} />

      <rect x={380} y={36} width={78} height={96} rx="5" fill={C.ground} stroke={C.brass} />
      <Tag x={386} y={52} c={C.brass}>Collet</Tag>
      <circle cx={419} cy={100} r={22} fill="url(#sk-brassG)" stroke="#7d5f22" />
      <circle cx={419} cy={100} r={8} fill={C.ground} stroke="#7d5f22" />
      <path d="M441 100 L427 100" stroke={C.ground} strokeWidth="3.4" />
      <path d={arcD(419, 100, 29, -20, 30)} fill="none" stroke={C.ruby} strokeWidth="1.6" markerEnd="url(#sk-a-ruby)" />
      <T x={16} y={236} s={11} c={C.text}>No adjuster: the only way to shift the beat is to twist the collet on the staff.</T>
      <T x={16} y={252} s={10.5} c={C.dim}>Forum posters warn even about 5° makes a big difference, and it’s not a beginner job.</T>
      <T x={16} y={268} s={10.5} c={C.ruby}>Practise on a scrap balance before you touch a good one.</T>
    </Fig>
  )
}

function BeatCollet() {
  const w = 108
  const col = (i) => 14 + i * 115
  const y = 30
  const h = 170
  const b = (i) => col(i) + w / 2
  const cy = y + 72
  return (
    <Fig h={276} view="Sequence · twisting the collet" scale="forum practice, in outline">
      {['Let down', 'Mark', 'Lift out', 'Twist'].map((t, i) => (
        <g key={t}>
          <Panel x={col(i)} y={y} w={w} h={h} title={t} />
          <Num x={col(i) + w - 13} y={y + 13} n={i + 1} r={8} />
        </g>
      ))}
      {/* 1 */}
      <Gear cx={b(0)} cy={cy} r={26} n={24} />
      <Spring cx={b(0)} cy={cy} r0={5} r1={15} turns={3} c={C.steel} w={0.9} />
      <Arrow d={`M${b(0) + 30} ${cy - 26} q12 18 0 40`} c="brass" w={1.5} />
      <Para x={col(0) + 7} y={y + 122} w={w - 12} s={10.5} lh={13} text="Release the power, so the balance rests where the spring holds it." />
      {/* 2 */}
      <Balance cx={b(1)} cy={cy} r={30} mark={-60} />
      <line x1={b(1)} y1={cy - 40} x2={b(1)} y2={cy - 24} stroke={C.emerald} strokeWidth="1.6" />
      <path d={arcD(b(1), cy, 37, -90, -62)} fill="none" stroke={C.ruby} strokeWidth="1.4" />
      <Para x={col(1) + 7} y={y + 122} w={w - 12} s={10.5} lh={13} text="Note the rest point against where the pin should sit." />
      {/* 3 */}
      <Balance cx={b(2)} cy={cy + 4} r={28} />
      <rect x={b(2) - 34} y={cy - 40} width={68} height={8} rx="2" fill="url(#sk-steel)" stroke="#5f717d" strokeWidth="0.7" />
      <Arrow a={[b(2) + 40, cy + 10]} b={[b(2) + 40, cy - 28]} c="brass" w={1.6} />
      <Para x={col(2) + 7} y={y + 122} w={w - 12} s={10.5} lh={13} text="Take the balance out complete with its cock." />
      {/* 4 */}
      <circle cx={b(3)} cy={cy} r={22} fill="url(#sk-brassG)" stroke="#7d5f22" />
      <circle cx={b(3)} cy={cy} r={8} fill={C.ground} stroke="#7d5f22" />
      <path d={`M${b(3) + 22} ${cy} L${b(3) + 8} ${cy}`} stroke={C.ground} strokeWidth="3.4" />
      <path d={arcD(b(3), cy, 30, -40, 30)} fill="none" stroke={C.brass} strokeWidth="1.7" markerEnd="url(#sk-a-brass)" />
      <Para x={col(3) + 7} y={y + 122} w={w - 12} s={10.5} lh={13} text="Turn the collet a very little on the staff. Refit and read." />
      <T x={16} y={220} s={11} c={C.text}>Repeat with smaller moves. It takes several tries.</T>
      <T x={16} y={238} s={10.5} c={C.ruby}>Never pull the coils or lift the balance by the spring.</T>
      <T x={16} y={256} s={10.5} c={C.ruby}>Don’t unpin the spring to slide it through the stud. That changes rate.</T>
    </Fig>
  )
}

function BeatProve() {
  const y = 44
  const w = 136
  const h = 74
  return (
    <Fig h={262} view="Sequence · proving the beat" scale="20 s across · 10 ms tall">
      <Tag x={16} y={36}>Before</Tag>
      <Trace x={14} y={y} w={w} h={h} series={steady(26, 0.7, { n: 80 })} r={1} />
      <Arrow a={[156, y + h / 2]} b={[172, y + h / 2]} c="brass" />
      <Tag x={180} y={36}>Beat set</Tag>
      <Trace x={178} y={y} w={w} h={h} series={steady(22, 0.1, { n: 80 })} r={1} />
      <Arrow a={[320, y + h / 2]} b={[336, y + h / 2]} c="brass" />
      <Tag x={344} y={36}>Rate set</Tag>
      <Trace x={342} y={y} w={124} h={h} series={steady(6, 0.1, { n: 70 })} r={1} />
      <T x={82} y={y + h + 15} a="middle" s={10.5} mono c={C.ruby}>1.4 ms · +26 s/d</T>
      <T x={246} y={y + h + 15} a="middle" s={10.5} mono c={C.text}>0.2 ms · +22 s/d</T>
      <T x={404} y={y + h + 15} a="middle" s={10.5} mono c={C.emerald}>0.2 ms · +6 s/d</T>
      <Sep x1={14} y1={148} x2={466} y2={148} />
      <Tag x={16} y={168}>Check it held</Tag>
      {[['cu', 'crown up'], ['t', '12 up'], ['du', 'dial up']].map(([k, n], i) => (
        <g key={k}>
          <PosIcon x={46 + i * 74} y={200} k={k} r={15} />
          <T x={46 + i * 74} y={232} a="middle" s={10.5} c={C.text}>{n}</T>
        </g>
      ))}
      <Para x={250} y={178} w={216} s={10.5} lh={13} c={C.text} text="Read beat error in at least two positions. It should stay close. Then regulate, and log the final figures." />
      <T x={16} y={252} s={10} c={C.faint}>Example readings.</T>
    </Fig>
  )
}

/* ------------------------------------------------------------------ */
/* Lesson: Regulators                                                   */
/* ------------------------------------------------------------------ */
function RegTwo() {
  const cx = 214
  const cy = 126
  return (
    <Fig h={288} view="Plan · two jobs on one cock" scale="schematic">
      <CockPlan cx={cx} cy={cy} active hiPin />
      <Lead p={pol(cx, cy, 71, -6)} t={[340, 44]} text="pin block: rate" sub="where the spring is held" c={C.brass} />
      <Lead p={pol(cx, cy, 72, 34)} t={[340, 208]} text="stud carrier: beat" sub="turns the whole spring" c={C.steel} />
      <Lead p={pol(cx, cy, 71, -80)} t={[140, 40]} text="active spring" a="end" c={C.brass} />
      <Lead p={pol(cx, cy, 72, 14)} t={[340, 124]} text="past the pins" sub="does not count" c={C.dim} />
      <Sep x1={14} y1={230} x2={466} y2={230} />
      <T x={16} y={250} s={11} c={C.text}>Shorter active spring: faster. Longer: slower.</T>
      <T x={16} y={268} s={10.5} c={C.dim}>Moving the pins away from the stud shortens it. Toward the stud lengthens it.</T>
    </Fig>
  )
}

function RegEtachron() {
  const x0 = 34
  const y = 64
  return (
    <Fig h={272} view="Detail · Etachron scale and tool" scale="schematic">
      <Tag x={16} y={38}>About 5 s/d a line, varies</Tag>
      <line x1={x0} y1={y + 20} x2={x0 + 240} y2={y + 20} stroke={C.struct} />
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i}>
          <line x1={x0 + i * 30} y1={y + (i % 4 === 0 ? 4 : 10)} x2={x0 + i * 30} y2={y + 20} stroke={C.text} strokeWidth="1.2" />
          <T x={x0 + i * 30} y={y + 35} a="middle" s={10} mono c={C.dim}>{(i - 4) * 5 > 0 ? `+${(i - 4) * 5}` : (i - 4) * 5}</T>
        </g>
      ))}
      <path d={`M${x0 + 120} ${y + 18} l-6 -14 h12 Z`} fill={C.brass} />
      <Arrow a={[x0 + 120, y - 10]} b={[x0 + 178, y - 10]} c="brass" w={1.6} />
      <T x={x0 + 186} y={y - 6} s={10.5} mono c={C.brass}>faster</T>
      <T x={x0 + 120} y={y + 50} a="middle" s={10.5} c={C.dim}>rough s/d change from where you start</T>

      <rect x={310} y={40} width={156} height={92} rx="6" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <Tag x={318} y={54}>Bergeon tools</Tag>
      <T x={318} y={74} s={11} mono c={C.text}>31081</T>
      <T x={318} y={88} s={10.5} c={C.dim}>general use</T>
      <T x={318} y={108} s={11} mono c={C.text}>31081-EX-7750</T>
      <T x={318} y={122} s={10.5} c={C.dim}>7750-based movements</T>

      <Sep x1={14} y1={144} x2={466} y2={144} />
      <Tag x={16} y={164}>Two blocks, one centre</Tag>
      <circle cx={80} cy={214} r={36} fill="url(#sk-brassG)" stroke="#7d5f22" />
      <rect x={110} y={209} width={46} height={10} rx="2" fill="#b08a3c" stroke="#7d5f22" strokeWidth="0.7" />
      <circle cx={80} cy={214} r={22} fill="url(#sk-steel)" stroke="#5f717d" />
      <rect x={74} y={230} width={12} height={40} rx="2" fill="#b3c2cc" stroke="#5f717d" strokeWidth="0.7" transform="rotate(-24 80 240)" />
      <circle cx={80} cy={214} r={8} fill={C.ruby} stroke="#8a3943" />
      <Lead p={[140, 214]} t={[196, 184]} text="brass pin block" sub="rate" c={C.brass} />
      <Lead p={[98, 252]} t={[196, 240]} text="nickel-plated stud block" sub="beat" c={C.steel} />
      <Para x={340} y={176} w={126} s={10.5} lh={13} text="Some versions add a fine screw, said to give about ±15 to 20 s/d in all." />
    </Fig>
  )
}

function RegTriovis() {
  const cx = 112
  const cy = 150
  const r = 62
  const marks = [
    ['¼ turn', '7.5 s/d', 0],
    ['½ turn', '15 s/d', 1],
    ['1 turn', '30 s/d', 2],
  ]
  return (
    <Fig h={280} view="Detail · Triovis screw" scale="schematic">
      <Tag x={16} y={38}>Screw head, seen from above</Tag>
      <circle cx={cx} cy={cy} r={r} fill="url(#sk-steel)" stroke="#5f717d" />
      <rect x={cx - r + 6} y={cy - 5} width={2 * r - 12} height={10} rx="2" fill={C.ground} />
      {[0, 90, 180, 270].map((a) => {
        const p0 = pol(cx, cy, r + 3, a)
        const p1 = pol(cx, cy, r + 11, a)
        return <line key={a} x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke={C.text} strokeWidth="1.4" />
      })}
      <path d={arcD(cx, cy, r + 18, -90, 0)} fill="none" stroke={C.brass} strokeWidth="2.2" markerEnd="url(#sk-a-brass)" />
      <T x={cx + r + 8} y={cy - r - 4} s={11} mono c={C.brassHi}>¼ turn</T>

      <T x={224} y={46} s={11.5} c={C.text} w="600">30 s/d per full turn</T>
      <T x={224} y={62} s={10.5} c={C.faint}>one published figure, not a maker’s sheet</T>
      {marks.map((m, i) => (
        <g key={m[0]}>
          <rect x={224} y={76 + i * 26} width={[60, 120, 240][i]} height={18} rx="2" fill="rgba(208,168,79,0.3)" />
          <T x={232} y={89 + i * 26} s={11} mono c={C.text}>{m[0]}</T>
          <T x={224 + [60, 120, 240][i] - 6} y={89 + i * 26} s={11} mono c={C.brassHi} a="end">{i === 0 ? '' : m[1]}</T>
        </g>
      ))}
      <T x={292} y={89} s={11} mono c={C.brassHi}>7.5 s/d</T>

      <Sep x1={214} y1={160} x2={466} y2={160} />
      <Tag x={224} y={180}>Worked example</Tag>
      <T x={224} y={200} s={11.5} mono c={C.text}>+27 s/d, target +12</T>
      <T x={224} y={218} s={11.5} mono c={C.text}>27 − 12 = 15 s/d to lose</T>
      <T x={224} y={236} s={11.5} mono c={C.brassHi}>15 ÷ 30 = ½ turn, slower</T>
      <Para x={16} y={246} w={200} s={10.5} lh={13} text="Portescap’s 1968 regulator. The screw sits square to the spring." />
    </Fig>
  )
}

function RegUnknown() {
  const rows = ['Swan-neck', 'Gyromax', 'Free-sprung timing screws', 'Microstella']
  const x = 268
  return (
    <Fig h={276} view="Chart · no trusted figure? measure your own" scale="example readings">
      <Tag x={16} y={38} c={C.ruby}>No reliable s/d per step</Tag>
      {rows.map((r, i) => (
        <g key={r}>
          <Verdict x={28} y={58 + i * 26} ok={false} r={7.5} />
          <T x={44} y={62 + i * 26} s={11.5} c={C.text}>{r}</T>
        </g>
      ))}
      <Para x={16} y={172} w={226} s={10.5} lh={13} text="The figures in circulation conflict or come from sellers. Don’t rely on them." />
      <Sep x1={250} y1={30} x2={250} y2={222} />
      <Tag x={x} y={38}>Calibrate one watch</Tag>
      {[
        ['Read, same position', '+20 s/d'],
        ['One small step', ''],
        ['Settle, read again', '+14 s/d'],
        ['Your figure', '6 s/d per step'],
      ].map((r, i) => (
        <g key={r[0]}>
          <Num x={x + 8} y={58 + i * 34} n={i + 1} r={8} />
          <T x={x + 22} y={55 + i * 34} s={11} c={C.text}>{r[0]}</T>
          {r[1] && <T x={x + 22} y={69 + i * 34} s={11} mono c={i === 3 ? C.brassHi : C.dim}>{r[1]}</T>}
        </g>
      ))}
      <Sep x1={14} y1={226} x2={466} y2={226} />
      <T x={16} y={246} s={11} c={C.text}>Your figure is for this watch only. Use it for the next move.</T>
      <T x={16} y={263} s={10.5} c={C.dim}>Keep every test step small, and stay in the same position.</T>
    </Fig>
  )
}

function RegFree() {
  const cx = 112
  const cy = 132
  const r = 74
  const nut = (a, c) => {
    const p = pol(cx, cy, r * 0.9, a)
    return <rect x={p[0] - 7} y={p[1] - 5} width={14} height={10} rx="2" fill={c} stroke="#4e5f6a" strokeWidth="0.7" transform={`rotate(${a} ${p[0]} ${p[1]})`} />
  }
  return (
    <Fig h={284} view="Plan · free-sprung balance" scale="schematic">
      <Balance cx={cx} cy={cy} r={r} arms={2} />
      {nut(0, C.brassHi)}
      {nut(180, C.brassHi)}
      {nut(90, '#b3c2cc')}
      {nut(270, '#b3c2cc')}
      <Arrow a={[cx + r + 18, cy]} b={[cx + r - 2, cy]} c="brass" w={1.8} />
      <Arrow a={[cx - r - 18, cy]} b={[cx - r + 2, cy]} c="brass" w={1.8} />
      <T x={cx} y={cy - r - 14} a="middle" s={10.5} c={C.dim}>opposite screws work as a pair</T>
      <T x={cx} y={cy + r + 22} a="middle" s={11} c={C.text}>Move mass inward: faster.</T>
      <T x={cx} y={cy + r + 37} a="middle" s={11} c={C.text}>Outward: slower.</T>
      <T x={cx} y={cy + r + 52} a="middle" s={10} c={C.faint}>hobbyist source</T>

      <Panel x={232} y={30} w={234} h={92} title="Both screws of a pair" c={C.emerald} />
      <Verdict x={250} y={76} ok />
      <Para x={268} y={68} w={190} s={10.5} lh={13} c={C.text} text="Same move on the opposite screw. Balance stays in poise." />
      <Panel x={232} y={130} w={234} h={92} title="One screw only" c={C.ruby} />
      <Verdict x={250} y={176} ok={false} />
      <Para x={268} y={168} w={190} s={10.5} lh={13} c={C.text} text="One side is now heavy. The balance is out of poise and the verticals suffer." />
      <Para x={232} y={236} w={234} s={10.5} lh={13} text="No pins and no index: the spring keeps its full length. You change where the mass sits, not how long the spring is." />
    </Fig>
  )
}

function RegTarget() {
  const x0 = 40
  const sc = (v) => x0 + (v + 10) * 10
  const y = 76
  return (
    <Fig h={266} view="Worked example · regulating an Etachron" scale="example readings">
      <line x1={sc(-10)} y1={y} x2={sc(30)} y2={y} stroke={C.struct} />
      <rect x={sc(0)} y={y - 9} width={sc(10) - sc(0)} height={18} fill="rgba(123,165,131,0.25)" stroke={C.emerald} strokeWidth="0.7" />
      {[-10, 0, 10, 20, 30].map((v) => (
        <g key={v}>
          <line x1={sc(v)} y1={y - 4} x2={sc(v)} y2={y + 4} stroke={C.struct} />
          <T x={sc(v)} y={y + 20} a="middle" s={10.5} mono c={C.dim}>{v > 0 ? `+${v}` : v}</T>
        </g>
      ))}
      <T x={sc(5)} y={y - 15} a="middle" s={10.5} c={C.emerald}>dial-up target</T>
      <circle cx={sc(24)} cy={y} r={5.5} fill={C.ruby} />
      <T x={sc(24)} y={y - 15} a="middle" s={11} mono c={C.ruby}>+24</T>
      <circle cx={sc(5)} cy={y} r={5.5} fill={C.emerald} />
      <Arrow a={[sc(24) - 8, y + 34]} b={[sc(5) + 2, y + 34]} c="brass" w={1.8} />
      <T x={sc(14.5)} y={y + 50} a="middle" s={11} mono c={C.brassHi}>lose 19 s/d</T>
      <T x={350} y={y + 50} s={10.5} c={C.dim}>s/d, dial up</T>

      <Sep x1={14} y1={140} x2={466} y2={140} />
      {[
        ['19 ÷ about 5 s/d per line', 'about 4 lines, toward slow'],
        ['Move about half first', 'then read: lines are only a guide'],
        ['Let it settle, finish the move', 'aim inside the target'],
        ['Check other positions, then 24 h', 'log the final numbers'],
      ].map((r, i) => (
        <g key={r[0]}>
          <Num x={26} y={160 + i * 26} n={i + 1} r={8} />
          <T x={40} y={164 + i * 26} s={11} c={C.text}>{r[0]}</T>
          <T x={250} y={164 + i * 26} s={10.5} c={C.dim}>{r[1]}</T>
        </g>
      ))}
    </Fig>
  )
}

/* ------------------------------------------------------------------ */
/* Lesson: Six positions, delta and isochronism                         */
/* ------------------------------------------------------------------ */
const SHEET = [
  ['cu', 'Crown up', -3, 268, 0.3],
  ['t', '12 up', 1, 272, 0.3],
  ['cd', 'Crown down', -9, 258, 0.3],
  ['s', '6 up', -4, 266, 0.4],
  ['du', 'Dial up', 6, 296, 0.2],
  ['dd', 'Dial down', 4, 292, 0.2],
]
const signed = (v) => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : '0')

function Positions() {
  const items = [
    ['du', 'Dial up', 'flat'],
    ['dd', 'Dial down', 'flat'],
    ['cu', 'Crown up', '3 at the top'],
    ['cd', 'Crown down', '9 at the top'],
    ['t', '12 up', 'crown to the right'],
    ['s', '6 up', 'crown to the left'],
  ]
  return (
    <Fig h={302} view="Elevation · the six positions" scale="schematic">
      {items.map(([k, a, b], i) => {
        const x = 54 + (i % 3) * 94
        const y = 66 + Math.floor(i / 3) * 106
        return (
          <g key={k}>
            <PosIcon x={x} y={y} k={k} r={22} />
            <T x={x} y={y + 44} a="middle" s={11} c={C.text}>{a}</T>
            <T x={x} y={y + 58} a="middle" s={10} c={C.faint}>{b}</T>
          </g>
        )
      })}
      <Sep x1={306} y1={32} x2={306} y2={252} />
      <Tag x={318} y={40}>Why upright differs</Tag>
      <T x={318} y={60} s={10.5} c={C.text}>Flat: on the pivot’s end</T>
      <rect x={380} y={70} width={12} height={40} rx="3" fill="url(#sk-steelH)" stroke="#5f717d" strokeWidth="0.7" />
      <rect x={358} y={110} width={56} height={8} fill={C.ruby} stroke="#8a3943" strokeWidth="0.7" />
      <circle cx={386} cy={110} r={5} fill="none" stroke={C.brass} strokeDasharray="2 2" />
      <T x={318} y={146} s={10.5} c={C.text}>Upright: on its side</T>
      <rect x={346} y={160} width={80} height={12} rx="3" fill="url(#sk-steelH)" stroke="#5f717d" strokeWidth="0.7" transform="rotate(0 386 166)" />
      <rect x={366} y={172} width={40} height={8} fill={C.ruby} stroke="#8a3943" strokeWidth="0.7" />
      <ellipse cx={386} cy={172} rx={22} ry={4} fill="none" stroke={C.brass} strokeDasharray="2 2" />
      <Arrow a={[446, 150]} b={[446, 186]} c="steel" w={1.3} />
      <T x={452} y={208} a="end" s={10.5} c={C.steel}>gravity</T>
      <Para x={318} y={226} w={150} s={10.5} lh={13} text="More friction upright, so amplitude falls." />
      <T x={16} y={292} s={10.5} c={C.dim}>COSC tests five positions. METAS uses six.</T>
    </Fig>
  )
}

function PosSheet() {
  const cols = [28, 110, 240, 320, 400]
  return (
    <Fig h={298} view="Record · a six-position sheet" scale="example readings">
      {['', 'Position', 'Rate s/d', 'Amp °', 'Beat ms'].map((h, i) => (
        <T key={i} x={cols[i]} y={40} s={10.5} c={C.faint}>{h}</T>
      ))}
      {SHEET.map(([k, n, r, a, b], i) => {
        const y = 62 + i * 30
        const hi = i === 2
        const top = i === 4
        return (
          <g key={k}>
            <line x1={14} y1={y - 18} x2={466} y2={y - 18} stroke={C.line} />
            {i === 4 && <line x1={14} y1={y - 18} x2={466} y2={y - 18} stroke={C.brass} strokeDasharray="3 2" />}
            <PosIcon x={46} y={y - 3} k={k} r={10} />
            <T x={cols[1]} y={y + 1} s={11.5} c={C.text}>{n}</T>
            <T x={cols[2]} y={y + 1} s={12.5} mono c={hi ? C.ruby : top ? C.emerald : C.text}>{signed(r)}</T>
            <T x={cols[3]} y={y + 1} s={12.5} mono c={hi ? C.ruby : C.text}>{a}</T>
            <T x={cols[4]} y={y + 1} s={12.5} mono c={C.text}>{b.toFixed(1)}</T>
          </g>
        )
      })}
      <line x1={14} y1={224} x2={466} y2={224} stroke={C.line} />
      <T x={16} y={244} s={11} c={C.text}>Measured top to bottom: verticals first, then flat.</T>
      <T x={16} y={262} s={10.5} c={C.dim}>Fastest in green, slowest in red. ETA 2824-2 at 28,800, lift set to 50°, full wind.</T>
      <T x={16} y={280} s={10.5} c={C.dim}>Write the lift angle on the sheet, or the amplitudes mean nothing later.</T>
    </Fig>
  )
}

function PosDelta() {
  const rows = [...SHEET].sort((a, b) => b[2] - a[2])
  const x0 = 230
  const sc = (v) => x0 + v * 13
  return (
    <Fig h={286} view="Chart · rate in each position" scale="example readings">
      <line x1={x0} y1={34} x2={x0} y2={218} stroke={C.struct} />
      <T x={x0} y={30} a="middle" s={10.5} mono c={C.dim}>0</T>
      {rows.map(([k, n, r], i) => {
        const y = 42 + i * 29
        return (
          <g key={k}>
            <T x={18} y={y + 13} s={11} c={C.text}>{n}</T>
            <rect x={Math.min(sc(0), sc(r))} y={y} width={Math.abs(sc(r) - sc(0))} height={18} rx="2" fill={r >= 0 ? 'rgba(123,165,131,0.55)' : 'rgba(194,88,99,0.5)'} />
            <T x={r >= 0 ? sc(r) + 6 : sc(r) - 6} y={y + 14} s={12} mono c={C.text} a={r >= 0 ? 'start' : 'end'}>{signed(r)}</T>
          </g>
        )
      })}
      <line x1={sc(6)} y1={60} x2={sc(6)} y2={232} stroke={C.emerald} strokeDasharray="2 2" />
      <line x1={sc(-9)} y1={207} x2={sc(-9)} y2={232} stroke={C.ruby} strokeDasharray="2 2" />
      <HGap x1={sc(-9)} x2={sc(6)} y={228} text="" c={C.brassHi} />
      <T x={sc(-1.5)} y={246} a="middle" s={12} mono c={C.brassHi}>delta = +6 − (−9) = 15 s/d</T>
      <T x={16} y={268} s={10.5} c={C.dim}>Delta is the fastest position minus the slowest.</T>
      <T x={16} y={282} s={10.5} c={C.dim}>Against a hobby target of about 20 to 30: fine. Against METAS at 12: not yet.</T>
    </Fig>
  )
}

function PosDrop() {
  const x0 = 96
  const sc = (a) => x0 + (a - 220) * 3.9
  const rows = [...SHEET].sort((a, b) => b[3] - a[3])
  return (
    <Fig h={280} view="Chart · amplitude by position" scale="example readings">
      <rect x={sc(256)} y={30} width={sc(276) - sc(256)} height={186} fill="rgba(123,165,131,0.14)" />
      <T x={(sc(256) + sc(276)) / 2} y={44} a="middle" s={10.5} c={C.emerald}>20 to 40° down</T>
      {rows.map(([k, n, , a], i) => {
        const y = 54 + i * 27
        return (
          <g key={k}>
            <T x={18} y={y + 13} s={11} c={C.text}>{n}</T>
            <rect x={x0} y={y} width={sc(a) - x0} height={17} rx="2" fill={k === 'cd' ? 'rgba(194,88,99,0.55)' : 'rgba(134,167,189,0.5)'} />
            <T x={sc(a) - 6} y={y + 13} s={12} mono c={C.text} a="end">{a}°</T>
          </g>
        )
      })}
      <line x1={sc(296)} y1={30} x2={sc(296)} y2={216} stroke={C.brass} strokeDasharray="3 2" />
      <T x={sc(296) + 4} y={44} s={10.5} c={C.brass}>dial up</T>
      <T x={x0} y={232} s={10} c={C.faint}>bars start at 220°</T>
      <Para x={16} y={250} w={448} s={10.5} lh={13} text="296 − 258 = 38° at worst, inside the usual 20 to 40°. Forum posters often find crown down the lowest. More than that: suspect pivot or jewel friction, or an off-centre hairspring." />
    </Fig>
  )
}

function PosPattern() {
  const mini = (x, rates, title, sub, act, c) => {
    const y = 88
    return (
      <g>
        <Panel x={x} y={28} w={146} h={236} title={title} c={c} />
        <line x1={x + 12} y1={y} x2={x + 134} y2={y} stroke={C.struct} />
        {rates.map((r, i) => (
          <rect key={i} x={x + 16 + i * 20} y={Math.min(y, y - r * 2.4)} width={14} height={Math.max(1.5, Math.abs(r) * 2.4)} fill={i < 4 ? 'rgba(134,167,189,0.7)' : 'rgba(208,168,79,0.75)'} />
        ))}
        <T x={x + 16} y={y + 44} s={10} c={C.steel}>upright</T>
        <T x={x + 96} y={y + 44} s={10} c={C.brass}>flat</T>
        <Para x={x + 8} y={y + 62} w={132} s={10.5} lh={13} c={C.text} text={sub} />
        <Para x={x + 8} y={y + 118} w={132} s={10.5} lh={13} c={C.emerald} text={act} />
      </g>
    )
  }
  return (
    <Fig h={272} view="Comparison · three position patterns" scale="schematic bars">
      {mini(14, [3, 4, 2, 3, 6, 5], 'Even', 'All within a few seconds. Small gap, flat to upright.', 'Regulate only.', C.emerald)}
      {mini(167, [-8, -9, -7, -8, 9, 8], 'Flat vs upright', 'Uprights agree with each other, but differ from flat.', 'Pin gap: upright slow, close. Upright fast, open.', C.brass)}
      {mini(320, [12, -13, 8, -10, 3, 4], 'Uprights scatter', 'Uprights disagree with each other.', 'Centre, poise or replace the regulating organ.', C.ruby)}
    </Fig>
  )
}

function PosIso() {
  const x0 = 48
  const y0 = 40
  const w = 268
  const h = 150
  const sx = (t) => x0 + (t / 42) * w
  const sy = (a) => y0 + h - ((a - 200) / 120) * h
  const amp = (t) => 300 - 40 * (t / 24) ** 1.25
  let d = ''
  for (let i = 0; i <= 40; i++) d += `${i ? 'L' : 'M'}${sx(i).toFixed(1)} ${sy(amp(i)).toFixed(1)}`
  return (
    <Fig h={298} view="Chart · one wind, from full to low" scale="example, 42 h reserve">
      <rect x={x0} y={y0} width={w} height={h} rx="3" fill="rgba(255,255,255,0.02)" stroke={C.line} />
      <rect x={x0} y={sy(270)} width={w} height={sy(255) - sy(270)} fill="rgba(123,165,131,0.2)" />
      <T x={x0 + w - 6} y={sy(255) - 4} a="end" s={10} c={C.emerald}>10 to 15% down: fine</T>
      <path d={d} fill="none" stroke={TICK} strokeWidth="2" />
      {[220, 260, 300].map((a) => (
        <T key={a} x={x0 - 6} y={sy(a) + 4} a="end" s={10.5} mono c={C.dim}>{a}°</T>
      ))}
      {[0, 24, 28, 42].map((t) => (
        <g key={t}>
          <line x1={sx(t)} y1={y0 + h} x2={sx(t)} y2={y0 + h + 5} stroke={C.struct} />
          <T x={sx(t)} y={y0 + h + 17} a={t === 24 ? 'end' : t === 28 ? 'start' : 'middle'} s={10.5} mono c={C.dim}>{t} h</T>
        </g>
      ))}
      <line x1={sx(24)} y1={sy(260)} x2={sx(24)} y2={y0 + h} stroke={C.brass} strokeDasharray="3 2" />
      <line x1={sx(28)} y1={sy(amp(28))} x2={sx(28)} y2={y0 + h} stroke={C.steel} strokeDasharray="3 2" />
      <circle cx={sx(0)} cy={sy(300)} r={4} fill={TICK} />
      <circle cx={sx(24)} cy={sy(260)} r={4} fill={C.brass} />
      <circle cx={sx(28)} cy={sy(amp(28))} r={4} fill={C.steel} />
      <Chip x={sx(2)} y={sy(300) - 6} text="full wind 300°" c={TICK} />
      <Chip x={sx(24) + 6} y={sy(260) - 12} text="24 h" c={C.brass} />

      <Tag x={330} y={46}>Rate check</Tag>
      <T x={330} y={66} s={11} c={C.text}>Full wind</T>
      <T x={462} y={66} s={12} mono c={C.text} a="end">+6</T>
      <T x={330} y={84} s={11} c={C.text}>At 28 h</T>
      <T x={462} y={84} s={12} mono c={C.text} a="end">+13</T>
      <line x1={330} y1={92} x2={462} y2={92} stroke={C.line} />
      <T x={330} y={108} s={11} c={C.brassHi}>Change</T>
      <T x={462} y={108} s={12} mono c={C.brassHi} a="end">7 s/d</T>
      <Tag x={330} y={136}>METAS limit</Tag>
      <T x={330} y={154} s={10.5} c={C.dim}>over 26 mm</T>
      <T x={462} y={154} s={11} mono c={C.text} a="end">8 s/d</T>
      <T x={330} y={169} s={10.5} c={C.dim}>over 20 to 26 mm</T>
      <T x={462} y={169} s={11} mono c={C.text} a="end">10</T>
      <T x={330} y={184} s={10.5} c={C.dim}>20 mm or less</T>
      <T x={462} y={184} s={11} mono c={C.text} a="end">12</T>
      <Sep x1={14} y1={224} x2={466} y2={224} />
      <T x={16} y={244} s={11} c={C.text}>A change of 10 to 15% from 300° means 255° to 270° after 24 h.</T>
      <T x={16} y={262} s={10.5} c={C.dim}>METAS compares full wind with one third of reserve left. On 42 h, that is about 28 h.</T>
      <T x={16} y={280} s={10.5} c={C.dim}>The only sourced number for rate against wind. Anything else here is an example.</T>
    </Fig>
  )
}

/* ------------------------------------------------------------------ */
/* Lesson: What a good result looks like                                */
/* ------------------------------------------------------------------ */
function GoodBands() {
  const x0 = 124
  const sc = (v) => x0 + (v + 30) * 4.5
  const rows = [
    ['Seiko 7S26', -20, 40],
    ['ETA Standard', -12, 12, -30, 30],
    ['ETA Elaboré', -7, 7, -20, 20],
    ['ETA Top', -4, 4, -15, 15],
    ['Witschi gent’s', -5, 15],
    ['COSC, 20 mm up', -4, 6],
    ['METAS 1a', 0, 5],
    ['Rolex Superlative', -2, 2],
  ]
  const yTop = 50
  return (
    <Fig h={326} view="Chart · published rate bands" scale="s/d · sources vary">
      {[-30, -15, 0, 15, 30, 45].map((v) => (
        <g key={v}>
          <line x1={sc(v)} y1={yTop - 6} x2={sc(v)} y2={yTop + 8 * 25} stroke={v === 0 ? C.struct : C.line} strokeDasharray={v === 0 ? undefined : '2 3'} />
          <T x={sc(v)} y={yTop - 11} a="middle" s={10.5} mono c={C.dim}>{v > 0 ? `+${v}` : v < 0 ? `−${-v}` : '0'}</T>
        </g>
      ))}
      {rows.map(([n, a, b, a2, b2], i) => {
        const y = yTop + i * 25
        const hit = 18 >= a && 18 <= b
        const near = a2 !== undefined && 18 <= b2
        return (
          <g key={n}>
            <T x={16} y={y + 13} s={10.5} c={C.text}>{n}</T>
            {a2 !== undefined && <rect x={sc(a2)} y={y + 3} width={sc(b2) - sc(a2)} height={11} rx="2" fill="rgba(134,167,189,0.2)" />}
            <rect x={sc(a)} y={y + 1} width={sc(b) - sc(a)} height={15} rx="2" fill={hit ? 'rgba(123,165,131,0.6)' : near ? 'rgba(134,167,189,0.55)' : 'rgba(194,88,99,0.5)'} />
          </g>
        )
      })}
      <line x1={sc(18)} y1={yTop - 6} x2={sc(18)} y2={yTop + 8 * 25 + 4} stroke={C.brassHi} strokeWidth="1.6" />
      <T x={sc(18)} y={yTop + 8 * 25 + 17} a="middle" s={11.5} mono c={C.brassHi}>+18 s/d</T>
      <T x={16} y={284} s={10.5} c={C.dim}>Green holds +18. Red doesn’t. Blue holds it only inside its wider, paler figure.</T>
      <T x={16} y={300} s={10.5} c={C.faint}>ETA grades from a reference site, not ETA. 7S26 and Rolex from secondary sources.</T>
      <T x={16} y={315} s={10.5} c={C.faint}>COSC and METAS from their own documents.</T>
    </Fig>
  )
}

function GoodWitschi() {
  const x0 = 110
  const sc = (v) => x0 + (v + 10) * 4.6
  const rows = [
    ['Gent’s watch', -5, 15],
    ['Lady’s watch', -5, 25],
    ['Chronograph', -5, 15],
    ['Chronometer', -2, 6],
  ]
  return (
    <Fig h={288} view="Chart · Witschi’s service figures" scale="charted for Movement">
      <Tag x={16} y={38}>Rate, s/d</Tag>
      {[-10, 0, 10, 20, 30].map((v) => (
        <g key={v}>
          <line x1={sc(v)} y1={48} x2={sc(v)} y2={146} stroke={v === 0 ? C.struct : C.line} strokeDasharray={v === 0 ? undefined : '2 3'} />
          <T x={sc(v)} y={160} a="middle" s={10.5} mono c={C.dim}>{v > 0 ? `+${v}` : v < 0 ? `−${-v}` : '0'}</T>
        </g>
      ))}
      {rows.map(([n, a, b], i) => {
        const y = 52 + i * 24
        return (
          <g key={n}>
            <T x={16} y={y + 13} s={11} c={C.text}>{n}</T>
            <rect x={sc(a)} y={y} width={sc(b) - sc(a)} height={17} rx="2" fill={i === 3 ? 'rgba(208,168,79,0.55)' : 'rgba(123,165,131,0.55)'} />
            <T x={sc(b) + 6} y={y + 13} s={11} mono c={C.text}>{`${a > 0 ? '+' : '−'}${Math.abs(a)} to +${b}`}</T>
          </g>
        )
      })}
      <T x={16} y={180} s={10.5} c={C.brass}>Chronometer here is a service target, not the COSC limit.</T>
      <Sep x1={14} y1={190} x2={466} y2={190} />
      <Panel x={14} y={198} w={146} h={60} title="Amplitude, flat" />
      <T x={22} y={244} s={14} mono c={C.text}>250–330°</T>
      <Panel x={167} y={198} w={146} h={60} title="Beat error" />
      <T x={175} y={244} s={14} mono c={C.text}>0–0.5 ms</T>
      <Panel x={320} y={198} w={146} h={60} title="24 h amplitude" />
      <T x={328} y={244} s={14} mono c={C.text}>−10 to −15%</T>
      <T x={16} y={278} s={10.5} c={C.faint}>Its own pages differ on the lowest rate and on vertical amplitude, so use it as a guide.</T>
    </Fig>
  )
}

function GoodHobby() {
  const x0 = 40
  const sc = (a) => x0 + (a - 230) * 3.6
  const y = 66
  const rows = [
    ['Rate, dial up', '0 to +10 s/d'],
    ['Beat error', '0.5 ms or less'],
    ['Verticals', 'within 40° of dial up'],
    ['After 24 h', 'amplitude no more than 15% down'],
    ['Six-position spread', 'under about 20 to 30 s/d'],
  ]
  return (
    <Fig h={296} view="Chart · a suggested hobby target" scale="not a standard">
      <Tag x={16} y={38}>Amplitude, dial up, full wind</Tag>
      <rect x={sc(250)} y={y - 8} width={sc(330) - sc(250)} height={26} rx="3" fill="rgba(134,167,189,0.15)" stroke={C.steel} strokeWidth="0.8" strokeDasharray="3 2" />
      <rect x={sc(270)} y={y - 3} width={sc(310) - sc(270)} height={16} rx="2" fill="rgba(123,165,131,0.6)" />
      {[250, 270, 310, 330].map((a) => (
        <T key={a} x={sc(a)} y={y + 33} a="middle" s={10.5} mono c={a === 270 || a === 310 ? C.emerald : C.steel}>{a}°</T>
      ))}
      <T x={sc(290)} y={y + 9} a="middle" s={10.5} c={C.text}>modern calibres</T>
      <T x={sc(290)} y={y + 48} a="middle" s={10.5} c={C.dim}>dashed: Witschi’s wider band. 255° is not a failure.</T>
      <Sep x1={14} y1={126} x2={466} y2={126} />
      {rows.map((r, i) => {
        const yy = 146 + i * 23
        return (
          <g key={r[0]}>
            <Verdict x={26} y={yy - 4} ok r={7} />
            <T x={42} y={yy} s={11} c={C.text}>{r[0]}</T>
            <T x={190} y={yy} s={11.5} mono c={C.emerald}>{r[1]}</T>
          </g>
        )
      })}
      <T x={16} y={276} s={10.5} c={C.dim}>Calibre lessons put 3 Hz movements a little lower, at about 250° to 300°.</T>
    </Fig>
  )
}

function GoodCosc() {
  const days = 15
  const x0 = 22
  const w = 240
  return (
    <Fig h={304} view="Reference · the COSC test" scale="mechanical movements">
      <Tag x={16} y={38}>15 days</Tag>
      {Array.from({ length: days }, (_, i) => (
        <rect key={i} x={x0 + i * (w / days)} y={46} width={w / days - 2} height={16} rx="1.5" fill="rgba(208,168,79,0.3)" stroke={C.brass} strokeWidth="0.5" />
      ))}
      <T x={x0} y={78} s={10.5} c={C.dim}>Uncased. Some sources give other lengths.</T>
      <Tag x={16} y={102}>Three temperatures</Tag>
      {[[8, C.steel], [23, C.emerald], [38, C.ruby]].map(([t, c], i) => (
        <g key={t}>
          <rect x={30 + i * 82} y={112} width={8} height={46} rx="4" fill="#26211b" stroke={C.struct} strokeWidth="0.8" />
          <rect x={32 + i * 82} y={154 - (i + 1) * 12} width={4} height={(i + 1) * 12} fill={c} />
          <circle cx={34 + i * 82} cy={160} r={7} fill={c} />
          <T x={50 + i * 82} y={146} s={12.5} mono c={C.text}>{t} °C</T>
        </g>
      ))}
      <Tag x={16} y={190}>Five positions</Tag>
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={30 + i * 26} cy={207} r={9} fill="none" stroke={C.brass} strokeWidth="1.3" />)}
      <T x={22} y={236} s={11} c={C.text}>A bench reading tests none of this.</T>

      <Sep x1={278} y1={30} x2={278} y2={244} />
      <Tag x={290} y={38}>Rate limit, s/d</Tag>
      <T x={290} y={58} s={10.5} c={C.dim}>20 mm and over</T>
      <T x={290} y={76} s={15} mono c={C.brassHi}>−4 to +6</T>
      <T x={290} y={98} s={10.5} c={C.dim}>up to 20 mm (one source)</T>
      <T x={290} y={116} s={15} mono c={C.brassHi}>−5 to +8</T>
      <Tag x={290} y={142}>Also tested, 20 mm up</Tag>
      {[['Mean variation', '2'], ['Greatest variation', '5'], ['Flat vs upright', '−6/+8'], ['Largest variation', '10'], ['Thermal, per °C', '±0.60'], ['Resumption', '±5']].map((r, i) => (
        <g key={r[0]}>
          <T x={290} y={160 + i * 15} s={10.5} c={C.text}>{r[0]}</T>
          <T x={466} y={160 + i * 15} s={10.5} mono c={C.dim} a="end">{r[1]}</T>
        </g>
      ))}
      <T x={16} y={272} s={10.5} c={C.faint}>The 15 days, positions, temperatures and −4/+6 are from COSC’s own pages.</T>
      <T x={16} y={287} s={10.5} c={C.faint}>The other criteria are from a secondary source.</T>
    </Fig>
  )
}

function GoodMetas() {
  const cols = [190, 276, 362]
  const heads = [['1a', 'over 26 mm'], ['1b', 'over 20 to 26 mm'], ['2', '20 mm or less']]
  const rows = [
    ['Average daily rate', 'precision, s/d', ['0 to +5', '0 to +6', '0 to +7']],
    ['Spread, six positions', 'delta, s/d', ['≤ 12', '≤ 14', '≤ 16']],
    ['Full wind to ⅓ reserve', 'isochronism, s/d', ['≤ 8', '≤ 10', '≤ 12']],
    ['After 1.5 tesla', 'change in s/d', ['≤ 5', '≤ 5', '≤ 5']],
  ]
  return (
    <Fig h={268} view="Reference · METAS limits by size" scale="fitting diameter">
      {heads.map(([a, b], i) => (
        <g key={a}>
          <T x={cols[i]} y={42} s={14} mono c={C.brassHi} w="600">{a}</T>
          <T x={cols[i]} y={57} s={10} c={C.dim}>{b}</T>
        </g>
      ))}
      {rows.map(([n, sub, v], i) => {
        const y = 86 + i * 38
        return (
          <g key={n}>
            <line x1={14} y1={y - 18} x2={466} y2={y - 18} stroke={C.line} />
            <T x={16} y={y} s={11} c={C.text}>{n}</T>
            <T x={16} y={y + 13} s={10} c={C.faint}>{sub}</T>
            {v.map((x, j) => (
              <T key={j} x={cols[j]} y={y + 4} s={12.5} mono c={i === 1 ? C.emerald : C.text}>{x}</T>
            ))}
          </g>
        )
      })}
      <line x1={14} y1={220} x2={466} y2={220} stroke={C.line} />
      <T x={16} y={240} s={10.5} c={C.emerald}>The six-position spread is the one to compare your own work with.</T>
      <T x={16} y={256} s={10.5} c={C.dim}>Hard to meet at the bench. Missing it is not a failed service.</T>
    </Fig>
  )
}

function GoodVerdict() {
  const cards = [
    { t: 'ETA 2824-2', ok: true, r: [['Amplitude', '288°'], ['Rate', '+6 s/d'], ['Beat error', '0.3 ms'], ['Spread', '18 s/d']], v: 'Meets the target. Log it and case it.' },
    { t: 'Seiko 7S26', ok: true, r: [['Amplitude', '262°'], ['Rate', '+18 s/d'], ['Beat error', '0.4 ms'], ['Spec', '−20 to +40']], v: 'Inside its own spec. Looks poor against zero only.' },
    { t: 'ETA 6497', ok: null, r: [['Shown', '335°'], ['Lift set', '52°'], ['True lift', '44°'], ['True swing', 'about 283°']], v: '335 × 44 ÷ 52. Set 44° and read again.' },
  ]
  return (
    <Fig h={248} view="Worked examples · three sign-offs" scale="example readings">
      {cards.map((c, i) => {
        const x = 14 + i * 153
        return (
          <g key={c.t}>
            <Panel x={x} y={30} w={146} h={206} title={c.t} c={c.ok ? C.emerald : C.brass} />
            {c.r.map(([a, b], j) => (
              <g key={a}>
                <T x={x + 8} y={62 + j * 24} s={10.5} c={C.dim}>{a}</T>
                <T x={x + 138} y={62 + j * 24} s={11.5} mono c={C.text} a="end">{b}</T>
              </g>
            ))}
            <line x1={x + 8} y1={150} x2={x + 138} y2={150} stroke={C.line} />
            {c.ok ? <Verdict x={x + 20} y={170} ok r={9} /> : <circle cx={x + 20} cy={170} r={9} fill="rgba(208,168,79,0.15)" stroke={C.brass} strokeWidth="1.5" />}
            <Para x={x + 8} y={194} w={132} s={10.5} lh={13} c={C.text} text={c.v} />
          </g>
        )
      })}
    </Fig>
  )
}

/* ------------------------------------------------------------------ */
/* Lesson: Test power, train and escapement apart                       */
/* ------------------------------------------------------------------ */
function IsoSplit() {
  const y = 110
  return (
    <Fig h={286} view="Schematic · the chain of power" scale="not to scale">
      <Gear cx={62} cy={y} r={36} n={36} />
      <Spring cx={62} cy={y} r0={5} r1={20} turns={4} c={C.steel} w={1} />
      <Gear cx={134} cy={y - 12} r={25} n={26} />
      <Gear cx={186} cy={y + 10} r={20} n={22} />
      <Gear cx={228} cy={y - 8} r={16} n={18} />
      <EscWheel cx={304} cy={y + 2} r={21} n={15} />
      <Fork x={360} y={y + 2} k={0.62} rot={90} />
      <Balance cx={412} cy={y + 2} r={34} />
      <Roller cx={412} cy={y + 2} r={13} pin={180} />
      <Arrow a={[30, 164]} b={[450, 164]} c="brass" w={1.8} />
      <T x={240} y={180} a="middle" s={10.5} c={C.brass}>energy flows this way, so test in this order</T>
      {[
        [26, 72, '1', 'Power', 'wind, reserve'],
        [106, 148, '2', 'Train', 'spins, coasts'],
        [262, 110, '3', 'Fork', 'crisp snap'],
        [378, 88, '4', 'Balance', 'free swing'],
      ].map(([x, w, n, a, b]) => (
        <g key={n}>
          <path d={`M${x} 60 v-6 h${w} v6`} fill="none" stroke={C.struct} />
          <Num x={x + 11} y={40} n={n} r={8} />
          <T x={x + 22} y={44} s={11.5} c={C.text}>{a}</T>
          <T x={x + w / 2} y={200} a="middle" s={10.5} c={C.dim}>{b}</T>
        </g>
      ))}
      <Sep x1={14} y1={214} x2={466} y2={214} />
      <T x={16} y={234} s={11} c={C.text}>One change, then read again with the same routine.</T>
      <T x={16} y={252} s={10.5} c={C.dim}>Keyless and motion works hang off the side of this chain. Check them if it all tests clean.</T>
      <T x={16} y={268} s={10.5} c={C.faint}>Tests are workshop and forum practice unless a lesson step names a maker.</T>
    </Fig>
  )
}

function IsoPower() {
  const cx = 104
  const cy = 118
  return (
    <Fig h={272} view="Plan · barrel, with three power checks" scale="schematic">
      <Gear cx={cx} cy={cy} r={76} n={60} />
      <circle cx={cx} cy={cy} r={62} fill="#26211b" stroke="#7d5f22" />
      <Spring cx={cx} cy={cy} r0={15} r1={58} turns={8} a0={80} c={C.steel} w={1.1} />
      <circle cx={cx} cy={cy} r={12} fill="url(#sk-steel)" stroke="#5f717d" />
      <circle cx={cx} cy={cy} r={4} fill={C.ground} />
      <circle cx={cx} cy={cy} r={16} fill="none" stroke={C.ruby} strokeWidth="1.1" strokeDasharray="2 2" />
      <Lead p={[cx + 8, cy + 14]} t={[104, 222]} text="arbor pivots" sub="worn ones are a reported cause" a="middle" c={C.ruby} />
      <Lead p={pol(cx, cy, 44, -50)} t={[206, 38]} text="mainspring" sub="rarely the culprit" />
      {[
        ['Wind it', 'Smooth and even, click holds.', ''],
        ['Compare wind states', 'Full wind against 24 h later.', 'a 10 to 15% fall is fine'],
        ['Run it down', 'Against the declared reserve.', 'ETA 7750: at least 48 h'],
      ].map((r, i) => {
        const y = 84 + i * 56
        return (
          <g key={r[0]}>
            <Num x={222} y={y} n={i + 1} r={8} />
            <T x={238} y={y + 4} s={11.5} c={C.text}>{r[0]}</T>
            <T x={238} y={y + 19} s={10.5} c={C.dim}>{r[1]}</T>
            {r[2] && <T x={238} y={y + 33} s={10.5} mono c={C.brassHi}>{r[2]}</T>}
          </g>
        )
      })}
      <T x={206} y={256} s={10.5} c={C.ruby}>Finish the other tests before you open the barrel.</T>
    </Fig>
  )
}

function IsoTrain() {
  const y = 86
  return (
    <Fig h={274} view="Plan · train with fork and balance out" scale="schematic">
      <Gear cx={66} cy={y} r={34} n={32} />
      <Gear cx={132} cy={y - 8} r={26} n={26} />
      <Gear cx={184} cy={y + 8} r={21} n={22} />
      <Gear cx={226} cy={y - 8} r={17} n={18} />
      <EscWheel cx={272} cy={y} r={22} n={15} />
      {[[132, y - 8, 33], [184, y + 8, 28], [272, y, 30]].map(([cx, cy, r], i) => (
        <path key={i} d={arcD(cx, cy, r, 200, 320)} fill="none" stroke={C.brass} strokeWidth="1.5" markerEnd="url(#sk-a-brass)" />
      ))}
      <circle cx={338} cy={y} r={22} fill="none" stroke={C.faint} strokeDasharray="3 3" />
      <T x={338} y={y + 4} a="middle" s={10} c={C.faint}>fork out</T>
      <circle cx={414} cy={y} r={38} fill="none" stroke={C.faint} strokeDasharray="3 3" />
      <T x={414} y={y + 4} a="middle" s={10} c={C.faint}>balance out</T>
      <Lead p={[66, y]} t={[66, 138]} text="a few clicks of wind" a="middle" c={C.brass} />

      <Panel x={14} y={158} w={224} h={106} title="Spins, then coasts" c={C.emerald} />
      <Verdict x={32} y={194} ok />
      <Para x={50} y={190} w={182} s={10.5} lh={13} c={C.text} text="Train is free. A slight reverse at the end is common, but not every watch shows it." />
      <T x={22} y={252} s={10.5} c={C.emerald}>Go on to the fork.</T>
      <Panel x={246} y={158} w={220} h={106} title="Stiff or stops dead" c={C.ruby} />
      <Verdict x={264} y={194} ok={false} />
      <Para x={282} y={190} w={178} s={10.5} lh={13} c={C.text} text="Look for an over-tight bridge, dirt, a bent or broken tooth, a damaged pivot." />
      <T x={254} y={252} s={10.5} c={C.ruby}>Stop here until it runs free.</T>
    </Fig>
  )
}

function IsoFork() {
  const px = 170
  const py = 152
  return (
    <Fig h={276} view="Plan · fork between the bankings" scale="schematic">
      <g opacity="0.3">
        <Fork x={px} y={py} k={1.45} rot={-9} />
      </g>
      <Fork x={px} y={py} k={1.45} rot={9} />
      <circle cx={px - 23} cy={py - 62} r={7} fill="url(#sk-brassG)" stroke="#7d5f22" />
      <circle cx={px + 23} cy={py - 62} r={7} fill="url(#sk-brassG)" stroke="#7d5f22" />
      <path d={arcD(px, py, 112, -100, -80)} fill="none" stroke={C.brass} strokeWidth="1.8" markerStart="url(#sk-a-brass)" markerEnd="url(#sk-a-brass)" />
      <rect x={px - 78} y={py - 104} width={52} height={7} rx="3" fill="url(#sk-wood)" transform={`rotate(14 ${px - 26} ${py - 100})`} />
      <Lead p={[px - 23, py - 62]} t={[92, 112]} text="banking pin" a="end" />
      <Lead p={[px - 62, py - 106]} t={[72, 34]} text="pegwood" a="end" c={C.brass} />
      <T x={px} y={30} a="middle" s={10.5} c={C.brass}>snaps across</T>
      <Lead p={[px + 30, py + 36]} t={[150, 250]} text="" />
      <T x={136} y={266} a="middle" s={11.5} c={C.text}>a couple of turns on the spring, no balance</T>

      <Panel x={300} y={30} w={166} h={100} title="Crisp snap" c={C.emerald} />
      <Verdict x={318} y={66} ok />
      <Para x={334} y={62} w={126} s={10.5} lh={13} c={C.text} text="Fork and escape wheel work together." />
      <Panel x={300} y={138} w={166} h={118} title="Sluggish" c={C.ruby} />
      <Verdict x={318} y={174} ok={false} />
      <Para x={334} y={170} w={126} s={10.5} lh={13} c={C.text} text="Look for excess oil, too much lock or unpegged pallet jewels." />
    </Fig>
  )
}

function IsoBalance() {
  const cx = 112
  const cy = 128
  return (
    <Fig h={276} view="Plan · balance alone, fork out" scale="schematic">
      <Balance cx={cx} cy={cy} r={68} mark={90} />
      <Spring cx={cx} cy={cy} r0={9} r1={38} turns={5} a0={20} w={0.8} />
      <path d={arcD(cx, cy, 82, -90, 88)} fill="none" stroke={C.brass} strokeWidth="2" markerEnd="url(#sk-a-brass)" />
      <line x1={cx} y1={cy - 90} x2={cx} y2={cy - 62} stroke={C.text} strokeDasharray="3 2" />
      <T x={cx} y={cy - 94} a="middle" s={10.5} c={C.text}>rest</T>
      <T x={cx + 88} y={cy + 4} s={11} mono c={C.brassHi}>180°</T>
      <T x={cx} y={258} a="middle" s={11} c={C.text}>Turn it, release, count the swings.</T>

      <Tag x={258} y={38}>Do it both ways</Tag>
      <Side cx={296} cy={68} w={62} />
      <T x={296} y={96} a="middle" s={10.5} c={C.text}>dial up</T>
      <Side cx={396} cy={66} w={62} up={false} flip />
      <T x={396} y={96} a="middle" s={10.5} c={C.text}>dial down</T>
      <T x={258} y={122} s={10.5} c={C.dim}>The two should be similar.</T>
      <Sep x1={250} y1={134} x2={466} y2={134} />
      <Tag x={258} y={152}>No published standard</Tag>
      <Para x={258} y={170} w={208} s={10.5} lh={13} c={C.text} text="One poster’s yardstick is 100 full swings. Better still: compare with a good movement of the same calibre." />
      <Tag x={258} y={226} c={C.ruby}>Stops in a few swings</Tag>
      <Para x={258} y={244} w={208} s={10.5} lh={13} text="Pivots, endshake, cap jewels, fluff under the balance." />
    </Fig>
  )
}

function FlowBox({ x, y, w, h, text, c = C.line, tc = C.text, fill = 'rgba(255,255,255,0.03)' }) {
  const lines = wrap(text, w - 12, 10.5)
  const y0 = y + h / 2 - ((lines.length - 1) * 13) / 2 + 4
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="5" fill={fill} stroke={c} />
      {lines.map((l, i) => (
        <T key={i} x={x + w / 2} y={y0 + i * 13} a="middle" s={10.5} c={tc}>{l}</T>
      ))}
    </g>
  )
}

function IsoDry() {
  return (
    <Fig h={262} view="Flow · the dry test" scale="forum practice">
      <FlowBox x={14} y={40} w={100} h={46} text="Note the oiled reading" />
      <Arrow a={[118, 63]} b={[138, 63]} c="brass" w={1.5} />
      <FlowBox x={142} y={40} w={100} h={46} text="Clean, then assemble dry" />
      <Arrow a={[246, 63]} b={[266, 63]} c="brass" w={1.5} />
      <FlowBox x={270} y={40} w={100} h={46} text="Short run, one reading" />
      <Arrow a={[374, 63]} b={[394, 63]} c="brass" w={1.5} />
      <FlowBox x={398} y={40} w={68} h={46} text="Compare" c={C.brass} tc={C.brassHi} />
      <Tag x={16} y={32}>Same wind, position and lift angle</Tag>
      <path d="M432 90 V118 H120 V136" fill="none" stroke={C.struct} strokeWidth="1.2" markerEnd="url(#sk-a-dim)" />
      <path d="M432 118 V136" fill="none" stroke={C.struct} strokeWidth="1.2" markerEnd="url(#sk-a-dim)" />
      <path d="M276 118 V136" fill="none" stroke={C.struct} strokeWidth="1.2" markerEnd="url(#sk-a-dim)" />
      <Panel x={14} y={140} w={146} h={82} title="Better dry" c={C.brass} />
      <Para x={22} y={172} w={132} s={10.5} lh={13} c={C.text} text="Look at your oiling, starting with excess oil." />
      <Panel x={167} y={140} w={146} h={82} title="Just as low" c={C.ruby} />
      <Para x={175} y={172} w={132} s={10.5} lh={13} c={C.text} text="Not lubrication. The fault is mechanical." />
      <Panel x={320} y={140} w={146} h={82} title="Worse dry" />
      <Para x={328} y={172} w={132} s={10.5} lh={13} c={C.text} text="Expected. Your oil was helping, so look elsewhere." />
      <T x={16} y={244} s={10.5} c={C.ruby}>A test, not a repair. Keep the run short, then oil it properly.</T>
    </Fig>
  )
}

function IsoMatrix() {
  const cols = [30, 90, 150]
  const rows = [
    [false, null, null, 'The train', 'bridge tightness, dirt, teeth, pivots'],
    [true, false, null, 'Fork and escape wheel', 'excess oil, lock, pallet jewels'],
    [true, true, false, 'The balance', 'pivots, endshake, cap jewels, fluff'],
    [true, true, true, 'The power side', 'then the dry test for oil'],
  ]
  return (
    <Fig h={252} view="Table · reading the results together" scale="test by test">
      {['Train', 'Fork', 'Balance'].map((h, i) => (
        <T key={h} x={cols[i]} y={40} a="middle" s={10.5} c={C.faint}>{h}</T>
      ))}
      <T x={196} y={40} s={10.5} c={C.faint}>Look at</T>
      {rows.map((r, i) => {
        const y = 66 + i * 42
        return (
          <g key={r[3]}>
            <line x1={14} y1={y - 20} x2={466} y2={y - 20} stroke={C.line} />
            {[0, 1, 2].map((j) =>
              r[j] === null ? (
                <T key={j} x={cols[j]} y={y + 5} a="middle" s={13} c={C.faint}>–</T>
              ) : (
                <Verdict key={j} x={cols[j]} y={y} ok={r[j]} r={8} />
              )
            )}
            <T x={196} y={y - 2} s={11.5} c={C.brassHi}>{r[3]}</T>
            <T x={196} y={y + 13} s={10.5} c={C.dim}>{r[4]}</T>
          </g>
        )
      })}
      <line x1={14} y1={214} x2={466} y2={214} stroke={C.line} />
      <T x={16} y={234} s={10.5} c={C.dim}>– means don’t run that test yet. Fix the first failure, then carry on along the chain.</T>
    </Fig>
  )
}

/* ------------------------------------------------------------------ */
/* Lesson: Worked case, low amplitude                                   */
/* ------------------------------------------------------------------ */
function LoCase() {
  const gates = ['Wound and run in?', 'Lift angle right?', 'What does the trace say?', 'Quick assembly checks', 'Isolation tests', 'What’s left']
  return (
    <Fig h={268} view="Case file · ETA 2824-2 after service" scale="example readings">
      <Machine x={14} y={30} w={226} h={158}>
        <rect x={24} y={40} width={206} height={24} rx="3" fill={LCD} stroke="#3c4c46" />
        <T x={32} y={57} s={11.5} mono c={C.text}>28800</T>
        <T x={140} y={57} s={11.5} mono c={C.ruby}>LA 52°</T>
        <Readout x={24} y={70} w={66} label="Rate" value="+12" />
        <Readout x={94} y={70} w={66} label="Amp." value="205" unit="°" c={C.ruby} />
        <Readout x={164} y={70} w={66} label="Beat" value="0.4" unit="ms" />
        <Trace x={24} y={110} w={206} h={68} series={steady(12, 0.2, { n: 70 })} r={1} />
      </Machine>
      <T x={16} y={208} s={11} c={C.text}>Dial up, straight after the service.</T>
      <T x={16} y={226} s={10.5} c={C.dim}>Tempting to reach for the oil. Don’t yet.</T>
      <Tag x={258} y={40}>Gates, in order</Tag>
      {gates.map((g, i) => (
        <g key={g}>
          <Num x={268} y={60 + i * 28} n={i + 1} r={8} />
          <T x={284} y={64 + i * 28} s={11} c={C.text}>{g}</T>
        </g>
      ))}
      <Arrow a={[250, 52]} b={[250, 200]} c="brass" w={1.5} />
      <T x={258} y={240} s={10.5} c={C.brass}>Cheapest first. Stop when one explains it.</T>
    </Fig>
  )
}

function LoWind() {
  const card = (x, title, turns, run, amp, c) => (
    <g>
      <Panel x={x} y={30} w={200} h={150} title={title} c={c} />
      <T x={x + 12} y={66} s={10.5} c={C.dim}>Crown turns</T>
      <T x={x + 188} y={66} s={12} mono c={C.text} a="end">{turns}</T>
      <T x={x + 12} y={88} s={10.5} c={C.dim}>Run-in</T>
      <T x={x + 188} y={88} s={12} mono c={C.text} a="end">{run}</T>
      <rect x={x + 44} y={108} width={112} height={54} rx="4" fill={LCD} stroke="#3c4c46" />
      <T x={x + 100} y={145} a="middle" s={25} mono c={TICK} w="600">{amp}</T>
    </g>
  )
  return (
    <Fig h={252} view="Gate 1 · the same watch, read properly" scale="example readings">
      {card(14, 'As first read', '4', 'none', '205°', C.ruby)}
      <Arrow a={[220, 105]} b={[258, 105]} c="brass" />
      {card(266, 'Routine followed', '10–15', '20 min', '218°', C.emerald)}
      <T x={16} y={204} s={11} c={C.text}>Better, but still low. Keep going.</T>
      <T x={16} y={222} s={10.5} c={C.dim}>Had this brought it into range, you’d stop here and save a strip-down.</T>
      <T x={16} y={240} s={10.5} c={C.dim}>Crown in, hands away from the date change, as in the routine.</T>
    </Fig>
  )
}

function LoLift() {
  const x0 = 40
  const sc = (a) => x0 + (a - 180) * 7
  return (
    <Fig h={254} view="Gate 2 · correcting the lift angle" scale="example readings">
      <rect x={14} y={30} width={452} height={44} rx="5" fill="rgba(208,168,79,0.08)" stroke={C.brass} strokeWidth="0.8" />
      <T x={240} y={58} a="middle" s={15} mono c={C.brassHi}>218 × 50 ÷ 52 ≈ 210°</T>
      {[['shown at 52°', 218, 'rgba(194,88,99,0.5)'], ['true at 50°', 210, 'rgba(123,165,131,0.6)']].map(([n, a, f], i) => {
        const y = 92 + i * 30
        return (
          <g key={n}>
            <rect x={x0} y={y} width={sc(a) - x0} height={20} rx="2" fill={f} />
            <T x={x0 + 8} y={y + 14} s={11} c={C.text}>{n}</T>
            <T x={sc(a) + 6} y={y + 15} s={13} mono c={C.text}>{a}°</T>
          </g>
        )
      })}
      <T x={x0} y={166} s={10} c={C.faint}>bars start at 180°</T>
      <Readout x={16} y={178} w={84} label="Rate" value="+12" unit="s/d" />
      <Readout x={106} y={178} w={84} label="Beat error" value="0.4" unit="ms" />
      <T x={202} y={194} s={11} c={C.emerald}>Unchanged, as they should be.</T>
      <T x={202} y={210} s={10.5} c={C.dim}>Maker’s value: ETA gives the 2824-2 as 50°.</T>
      <T x={16} y={236} s={10.5} c={C.ruby}>The true figure is lower than it looked. Set 50° and read again to confirm.</T>
    </Fig>
  )
}

function LoTrace() {
  const items = [
    ['curve', 'Long curve', 'Clean and lubricate.', C.ruby],
    ['irregular', 'Irregular double', 'Overhaul.', C.ruby],
    ['healthy', 'Clean line', 'This case: keep going.', C.emerald],
  ]
  return (
    <Fig h={224} view="Gate 3 · three possible answers" scale="20 s across · 10 ms tall">
      {items.map(([k, a, b, c], i) => {
        const x = 14 + i * 153
        return (
          <g key={k}>
            <Trace x={x} y={30} w={146} h={92} series={TR[k]()} r={1} />
            <rect x={x - 2} y={28} width={150} height={96} rx="5" fill="none" stroke={i === 2 ? C.emerald : 'none'} strokeWidth="1.6" />
            <T x={x + 73} y={142} a="middle" s={11.5} c={C.text}>{a}</T>
            <T x={x + 73} y={158} a="middle" s={10.5} c={c}>{b}</T>
          </g>
        )
      })}
      <Sep x1={14} y1={170} x2={466} y2={170} />
      <T x={16} y={190} s={11} c={C.text}>Turn the watch from vertical to dial up, then watch how it settles.</T>
      <T x={16} y={208} s={10.5} c={C.dim}>Low amplitude with a clean line: the energy is going somewhere the trace doesn’t show.</T>
    </Fig>
  )
}

function LoAssembly() {
  const w = 108
  const col = (i) => 14 + i * 115
  const y = 30
  const h = 186
  const b = (i) => col(i) + w / 2
  return (
    <Fig h={256} view="Gate 4 · four quick checks" scale="forum reports">
      {['Over-tight', 'Fluff', 'Dirty jar', 'Unpegged'].map((t, i) => (
        <g key={t}>
          <Panel x={col(i)} y={y} w={w} h={h} title={t} />
          <Num x={col(i) + w - 13} y={y + 13} n={i + 1} r={8} />
        </g>
      ))}
      {/* 1 bridge screw */}
      <rect x={col(0) + 10} y={y + 62} width={w - 20} height={16} rx="2" fill="url(#sk-steel)" stroke="#5f717d" strokeWidth="0.7" />
      <rect x={b(0) - 12} y={y + 50} width={24} height={12} rx="2" fill="#74848e" stroke="#4e5f6a" />
      <rect x={b(0) - 5} y={y + 62} width={10} height={32} fill="#8fa2ae" stroke="#4e5f6a" strokeWidth="0.6" />
      <rect x={col(0) + 10} y={y + 94} width={w - 20} height={10} fill="#3a342c" stroke="#55503f" />
      <path d={arcD(b(0), y + 44, 15, 200, 340)} fill="none" stroke={C.brass} strokeWidth="1.6" markerStart="url(#sk-a-brass)" />
      <Para x={col(0) + 7} y={y + 126} w={w - 12} s={10.5} lh={13} text="Train bridge or balance cock. Back off a touch and read." />
      {/* 2 fluff */}
      <Balance cx={b(1)} cy={y + 72} r={36} />
      <path d={`M${b(1) - 22} ${y + 84} q8 -12 14 -2 q6 10 12 -4 q6 -8 10 2`} fill="none" stroke={C.text} strokeWidth="1.2" />
      <path d={`M${b(1) - 18} ${y + 92} q10 -8 16 2 q6 6 12 -2`} fill="none" stroke={C.dim} strokeWidth="1" />
      <Para x={col(1) + 7} y={y + 126} w={w - 12} s={10.5} lh={13} text="Under the balance. Loupe it, then blow it clear." />
      {/* 3 jar */}
      <path d={`M${b(2) - 22} ${y + 42} h44 v8 h-4 v50 q0 6 -6 6 h-24 q-6 0 -6 -6 v-50 h-4 Z`} fill="url(#sk-glass)" stroke="#7fa0b0" />
      <rect x={b(2) - 17} y={y + 68} width={34} height={33} fill="rgba(109,74,35,0.55)" />
      <circle cx={b(2) - 6} cy={y + 82} r={2} fill="#8d6c4b" />
      <circle cx={b(2) + 8} cy={y + 90} r={2} fill="#8d6c4b" />
      <Para x={col(2) + 7} y={y + 126} w={w - 12} s={10.5} lh={13} text="Same low reading on every watch? Suspect the jar." />
      {/* 4 fork stone */}
      <Fork x={b(3)} y={y + 72} k={0.66} />
      <circle cx={b(3) - 20} cy={y + 87} r={12} fill="none" stroke={C.ruby} strokeWidth="1.1" strokeDasharray="2 2" />
      <Para x={col(3) + 7} y={y + 126} w={w - 12} s={10.5} lh={13} text="Fork jewels. One poster regained about 30°." />
      <T x={16} y={238} s={11} c={C.text}>Change one thing, then read again.</T>
    </Fig>
  )
}

function LoIsolate() {
  const rows = [
    ['Train', 'Spins and coasts', true],
    ['Fork', 'Moves slowly', false],
    ['Balance', 'Not run yet', null],
  ]
  return (
    <Fig h={246} view="Gate 5 · isolation tests on this watch" scale="example result">
      {rows.map(([a, b, ok], i) => {
        const y = 52 + i * 42
        return (
          <g key={a}>
            <rect x={14} y={y - 20} width={268} height={36} rx="5" fill="rgba(255,255,255,0.025)" stroke={ok === false ? C.ruby : C.line} />
            <T x={28} y={y + 3} s={12} c={C.text}>{a}</T>
            <T x={96} y={y + 3} s={11} c={C.dim}>{b}</T>
            {ok === null ? <T x={260} y={y + 5} a="middle" s={13} c={C.faint}>–</T> : <Verdict x={260} y={y - 2} ok={ok} r={9} />}
          </g>
        )
      })}
      <Arrow a={[290, 92]} b={[318, 92]} c="ruby" w={1.8} />
      <Panel x={326} y={32} w={140} h={122} title="Points to" c={C.ruby} />
      <Fork x={396} y={92} k={0.5} />
      <Para x={334} y={126} w={126} s={10.5} lh={13} c={C.text} text="Between fork and escape wheel." />
      <Sep x1={14} y1={170} x2={466} y2={170} />
      <T x={16} y={190} s={11} c={C.text}>Next: excess oil on the pallets, and too much lock.</T>
      <T x={16} y={208} s={10.5} c={C.dim}>Had all three passed, you’d reassemble dry and compare.</T>
      <T x={16} y={226} s={10.5} c={C.dim}>Let the power down before you take the fork out.</T>
    </Fig>
  )
}

function LoSpring() {
  const left = [
    ['Excess oil', 'on the pallets or pivots'],
    ['Too much lock', 'wastes energy at the escapement'],
    ['Added friction', 'shows on a scope display'],
    ['Excess endshake', 'reported to vary the amplitude'],
    ['Rough pivot', 'shows on a scope display'],
  ]
  const right = [
    ['Spring correct?', 'a weak one gives low amplitude'],
    ['Arbor pivots', 'reported wear'],
    ['Barrel wall grease', 'automatics only'],
  ]
  const list = (x, items) =>
    items.map(([a, b], i) => (
      <g key={a}>
        <T x={x} y={54 + i * 36} s={11.5} c={C.text}>{a}</T>
        <T x={x} y={68 + i * 36} s={10.5} c={C.dim}>{b}</T>
      </g>
    ))
  return (
    <Fig h={262} view="Gate 6 · the late causes" scale="reports, not measurements">
      <Tag x={16} y={36} c={C.brass}>Escapement and pivots</Tag>
      {list(16, left)}
      <Sep x1={236} y1={30} x2={236} y2={232} />
      <Tag x={250} y={36} c={C.brass}>Spring and barrel</Tag>
      {list(250, right)}
      <Gear cx={306} cy={196} r={36} n={36} />
      <circle cx={306} cy={196} r={28} fill="#26211b" stroke="#7d5f22" />
      <Spring cx={306} cy={196} r0={7} r1={25} turns={5} c={C.steel} w={0.9} />
      <Para x={350} y={176} w={118} s={10.5} lh={13} text="Forum report: 8217 can read lower than P125." />
      <T x={16} y={252} s={10.5} c={C.ruby}>The mainspring itself is rarely to blame, so keep it near the end.</T>
    </Fig>
  )
}

function LoTree() {
  const rows = [
    ['Wound, run 20 min?', 'No', 'Wind 10 to 15 turns, retest'],
    ['Lift angle correct?', 'No', 'Fix it, the figure scales directly'],
    ['Curve after a position change?', 'Yes', 'Clean and lubricate'],
    ['Irregular doubled trace?', 'Yes', 'Overhaul'],
    ['Over-tight, fluff, jar, jewels?', 'Yes', 'Fix it, read again'],
    ['Train, fork or balance fails?', 'Yes', 'Fix that link'],
    ['Friction, endshake, rough pivot?', 'Yes', 'Fix that fault'],
    ['Spring or barrel wrong?', 'Yes', 'Correct spring, grease, arbor'],
  ]
  const h = 30
  const gap = 8
  return (
    <Fig h={348} view="Flow · low amplitude after a service" scale="numbers are the gates">
      {rows.map(([q, a, r], i) => {
        const y = 28 + i * (h + gap)
        return (
          <g key={q}>
            <rect x={14} y={y} width={212} height={h} rx="5" fill="rgba(255,255,255,0.03)" stroke={C.brass} strokeWidth="0.8" />
            <Num x={28} y={y + h / 2} n={[1, 2, 3, 3, 4, 5, 6, 6][i]} r={8} />
            <T x={42} y={y + h / 2 + 4} s={10.5} c={C.text}>{q}</T>
            <line x1={226} y1={y + h / 2} x2={270} y2={y + h / 2} stroke={C.ruby} strokeWidth="1.2" markerEnd="url(#sk-a-ruby)" />
            <T x={246} y={y + h / 2 - 4} a="middle" s={10} c={C.ruby}>{a}</T>
            <rect x={274} y={y} width={192} height={h} rx="5" fill="rgba(123,165,131,0.1)" stroke={C.emerald} strokeWidth="0.8" />
            <T x={282} y={y + h / 2 + 4} s={10.5} c={C.text}>{r}</T>
            {i < rows.length - 1 && <line x1={120} y1={y + h} x2={120} y2={y + h + gap - 1} stroke={C.struct} strokeWidth="1.2" markerEnd="url(#sk-a-dim)" />}
          </g>
        )
      })}
    </Fig>
  )
}

export const FIGS = {
  'tm-noises': Noises,
  'tm-rate': Rate,
  'tm-beat-def': BeatDef,
  'tm-amp-def': AmpDef,
  'tm-machine': MachineSetup,
  'tm-prep': Prep,
  'tm-sequence': Sequence,
  'tm-phone': PhoneOrMachine,
  'tm-la-what': LiftWhat,
  'tm-la-sine': LiftSine,
  'tm-la-rule': LiftRule,
  'tm-la-correct': LiftCorrect,
  'tm-la-table': LiftTable,
  'tm-la-unknown': LiftUnknown,
  'tm-tr-axes': TraceAxes,
  'tm-tr-healthy': TrHealthy,
  'tm-tr-beat': TrBeat,
  'tm-tr-wrap': TrWrap,
  'tm-tr-rate': TrRate,
  'tm-tr-magnet': TrMagnet,
  'tm-tr-vertical': TrVertical,
  'tm-tr-pins': TrPins,
  'tm-tr-snow': TrSnow,
  'tm-tr-wave': TrWave,
  'tm-tr-sine': TrSine,
  'tm-tr-irregular': TrIrregular,
  'tm-tr-fuzzy': TrFuzzy,
  'tm-tr-dots': TrDots,
  'tm-tr-steps': TrSteps,
  'tm-tr-third': TrThird,
  'tm-tr-curve': TrCurve,
  'tm-tr-pairs': TrPairs,
  'tm-tr-sheet': TrSheet,
  'tm-bt-rest': BeatRest,
  'tm-bt-decide': BeatDecide,
  'tm-bt-carrier': BeatCarrier,
  'tm-bt-nudge': BeatNudge,
  'tm-bt-fixed': BeatFixed,
  'tm-bt-collet': BeatCollet,
  'tm-bt-prove': BeatProve,
  'tm-rg-two': RegTwo,
  'tm-rg-etachron': RegEtachron,
  'tm-rg-triovis': RegTriovis,
  'tm-rg-unknown': RegUnknown,
  'tm-rg-free': RegFree,
  'tm-rg-target': RegTarget,
  'tm-ps-six': Positions,
  'tm-ps-sheet': PosSheet,
  'tm-ps-delta': PosDelta,
  'tm-ps-drop': PosDrop,
  'tm-ps-pattern': PosPattern,
  'tm-ps-iso': PosIso,
  'tm-gd-zero': GoodBands,
  'tm-gd-witschi': GoodWitschi,
  'tm-gd-hobby': GoodHobby,
  'tm-gd-cosc': GoodCosc,
  'tm-gd-metas': GoodMetas,
  'tm-gd-verdict': GoodVerdict,
  'tm-is-split': IsoSplit,
  'tm-is-power': IsoPower,
  'tm-is-train': IsoTrain,
  'tm-is-fork': IsoFork,
  'tm-is-balance': IsoBalance,
  'tm-is-dry': IsoDry,
  'tm-is-matrix': IsoMatrix,
  'tm-lo-case': LoCase,
  'tm-lo-wind': LoWind,
  'tm-lo-lift': LoLift,
  'tm-lo-trace': LoTrace,
  'tm-lo-assembly': LoAssembly,
  'tm-lo-isolate': LoIsolate,
  'tm-lo-spring': LoSpring,
  'tm-lo-tree': LoTree,
}
