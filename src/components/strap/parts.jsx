// Strap parts: plan views of the pieces (with stitch lines, holes, slots,
// zones and keepers computed from real millimetre geometry), longitudinal
// and transverse sections, and the hardware (buckle, spring bar, case lug).
import { useId } from 'react'
import { C } from './kit.jsx'
import { outline, offset, runBetween, resample, holeXs, pathOf, px, widthAt } from './geom.js'

const uid = () => useId().replace(/[^a-zA-Z0-9]/g, '')

const FACE = {
  grain: ['url(#sk-top)', '#5c3c1d'],
  flesh: ['url(#sk-flesh)', '#9c7c52'],
  lining: ['url(#sk-lin)', C.liningEdge],
  dark: ['url(#sk-dark)', '#2e1e10'],
  croc: ['url(#sk-scale)', '#1b130c'],
  card: ['rgba(226,214,190,0.10)', C.struct],
  none: ['none', C.struct],
}

/* ------------------------------------------------------------------ */
/* Plan view of one piece                                              */
/* ------------------------------------------------------------------ */
// T = { x, y, s }  (px origin of the piece's (0,0) and px per mm)
// o = outline options (see geom.js LONG / SHORT)
export function StrapPlan({
  T,
  o,
  face = 'grain',
  dash,
  op,
  stitch,
  holes,
  slot,
  folds = [],
  centre,
  over,
  zones = [],
  filler,
  keepers = [],
  edge,
  glow,
  children,
}) {
  const id = uid()
  const pts = outline(o)
  const d = pathOf(pts, T)
  const [fill, stroke] = FACE[face] || FACE.grain
  const halfMax = Math.max(o.w0, o.w1) / 2 + 2
  return (
    <g opacity={op}>
      <clipPath id={`cp${id}`}>
        <path d={d} />
      </clipPath>
      {over && <path d={pathOf(offset(pts, -over), T)} fill="none" stroke={C.dim} strokeWidth="0.9" strokeDasharray="5 4" />}
      {glow && <path d={d} fill="none" stroke={glow} strokeWidth="6" opacity="0.28" />}
      <path d={d} fill={fill} stroke={edge || stroke} strokeWidth={edge ? 1.6 : 1} strokeDasharray={dash} />
      {face === 'flesh' && <path d={d} fill="url(#sk-fibre)" />}

      {/* zones: [{ from, to, k: 'skiveL'|'skiveR'|'glue'|'noglue'|'hl' }] */}
      <g clipPath={`url(#cp${id})`}>
        {zones.map((z, i) => {
          const [x1, y1] = px(T, z.from, -halfMax)
          const [x2] = px(T, z.to, 0)
          const fillZ = {
            skiveL: 'url(#sk-fadeL)',
            skiveR: 'url(#sk-fadeR)',
            glue: 'url(#sk-glue)',
            noglue: 'url(#sk-noglue)',
            hl: 'rgba(208,168,79,0.22)',
            ruby: 'rgba(194,88,99,0.25)',
            steel: 'rgba(134,167,189,0.35)',
          }[z.k]
          return <rect key={i} x={x1} y={y1} width={x2 - x1} height={halfMax * 2 * T.s} fill={fillZ} />
        })}
        {filler && <FillerOutline T={T} o={o} {...filler} />}
      </g>

      {centre && (
        <line
          x1={px(T, o.x0 - 3, 0)[0]}
          y1={T.y}
          x2={px(T, o.x1 + 3, 0)[0]}
          y2={T.y}
          stroke={C.steel}
          strokeWidth="0.8"
          strokeDasharray="10 3 2 3"
          opacity="0.85"
        />
      )}

      {folds.map((f, i) => {
        const h = widthAt(f.x, o) / 2
        const [x, ya] = px(T, f.x, -h - 2.5)
        const [, yb] = px(T, f.x, h + 2.5)
        return (
          <g key={i}>
            <line x1={x} y1={ya} x2={x} y2={yb} stroke={f.c || C.text} strokeWidth="1" strokeDasharray="4 3" />
            {f.label && (
              <text x={x} y={f.below ? yb + 12 : ya - 5} fontSize="10" fill={f.c || C.dim} textAnchor="middle" fontFamily="var(--font-body)">
                {f.label}
              </text>
            )}
          </g>
        )
      })}

      {stitch && <StitchRun T={T} pts={pts} {...stitch} />}

      {holes && <Holes T={T} o={o} {...holes} />}
      {slot && <Slot T={T} {...slot} />}
      {keepers.map((k, i) => (
        <KeeperBand key={i} T={T} o={o} {...k} />
      ))}
      {children}
    </g>
  )
}

function FillerOutline({ T, o, inset = 4, from = 8, to, solid }) {
  const end = to ?? o.x1 - 30
  const top = []
  const bot = []
  for (let i = 0; i <= 20; i++) {
    const x = from + ((end - from) * i) / 20
    const h = widthAt(x, o) / 2 - inset
    top.push([x, -h])
    bot.push([x, h])
  }
  const pts = [...top, ...bot.reverse()]
  return (
    <path
      d={pathOf(pts, T)}
      fill={solid ? 'url(#sk-fill)' : 'rgba(109,80,53,0.35)'}
      stroke="#d9b07a"
      strokeWidth="1"
      strokeDasharray={solid ? undefined : '4 3'}
    />
  )
}

// Stitch line: m = margin from the edge (mm), p = pitch (mm),
// from/to = x limits (mm), mode = 'line' | 'holes' | 'stitch' | 'diamond'
export function StitchRun({ T, pts, m = 3, p = 3, from = 6, to, mode = 'stitch', c, w = 1.5 }) {
  const inner = offset(pts, m)
  const runs = runBetween(inner, from, to)
  return (
    <g>
      {runs.map((run, ri) => {
        if (mode === 'line')
          return <path key={ri} d={pathOf(run, T, false)} fill="none" stroke={c || C.text} strokeWidth="0.9" strokeDasharray="1.5 2.5" opacity="0.9" />
        const st = resample(run, p)
        return (
          <g key={ri}>
            {st.map(({ p: q, tan }, i) => {
              const [x, y] = px(T, q[0], q[1])
              if (mode === 'holes' || mode === 'diamond') {
                // slanted slits at ~45° to the line (French iron look)
                const a = Math.atan2(tan[1], tan[0]) + (mode === 'diamond' ? 0.55 : 0.8)
                const l = (mode === 'diamond' ? 0.75 : 0.65) * T.s
                return (
                  <line
                    key={i}
                    x1={x - Math.cos(a) * l}
                    y1={y - Math.sin(a) * l}
                    x2={x + Math.cos(a) * l}
                    y2={y + Math.sin(a) * l}
                    stroke={c || C.hole}
                    strokeWidth={mode === 'diamond' ? 1.6 : 1.3}
                    strokeLinecap="round"
                  />
                )
              }
              const nxt = st[i + 1]
              if (!nxt) return null
              const [x2, y2] = px(T, nxt.p[0], nxt.p[1])
              // a saddle stitch lies slanted between holes
              const nx = -tan[1] * 0.42 * T.s
              const ny = tan[0] * 0.42 * T.s
              const ax = x + (x2 - x) * 0.14
              const ay = y + (y2 - y) * 0.14
              const bx = x + (x2 - x) * 0.86
              const by = y + (y2 - y) * 0.86
              return (
                <line key={i} x1={ax - nx} y1={ay - ny} x2={bx + nx} y2={by + ny} stroke={c || C.thread} strokeWidth={w} strokeLinecap="round" />
              )
            })}
          </g>
        )
      })}
    </g>
  )
}

function Holes({ T, o, n = 7, pitch = 7, fromTip = 25, d = 1.8, xs, c, ring }) {
  const list = xs || holeXs(o.x1, { n, pitch, fromTip })
  return (
    <g>
      {list.map((x, i) => {
        const [cx, cy] = px(T, x, 0)
        return (
          <g key={i}>
            {ring && <circle cx={cx} cy={cy} r={(d / 2) * T.s + 3} fill="none" stroke={ring} strokeWidth="1.2" />}
            <circle cx={cx} cy={cy} r={(d / 2) * T.s} fill={c || C.hole} stroke="#e7c48f" strokeWidth="0.6" opacity="0.95" />
          </g>
        )
      })}
    </g>
  )
}

export function Slot({ T, x, len = 10, w = 2.2, c }) {
  const [cx, cy] = px(T, x, 0)
  const L = len * T.s
  const W = w * T.s
  return <rect x={cx - L / 2} y={cy - W / 2} width={L} height={W} rx={W / 2} fill={c || C.hole} stroke="#e7c48f" strokeWidth="0.6" />
}

function KeeperBand({ T, o, x, w = 5, float, face = 'grain', stitched }) {
  const h = widthAt(x, o) / 2 + 1
  const [x1, y1] = px(T, x - w / 2, -h)
  const W = w * T.s
  const H = h * 2 * T.s
  return (
    <g>
      <rect x={x1} y={y1} width={W} height={H} rx="2" fill={face === 'grain' ? 'url(#sk-dark)' : 'url(#sk-lin)'} stroke="#e0b277" strokeWidth="0.9" opacity={float ? 0.92 : 1} />
      {stitched && (
        <g stroke={C.thread} strokeWidth="1">
          {[0.3, 0.7].map((f) => (
            <line key={f} x1={x1 + 2} y1={y1 + H * f} x2={x1 + W - 2} y2={y1 + H * f} strokeDasharray="2 2" />
          ))}
        </g>
      )}
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */
const PLY = {
  top: ['url(#sk-topS)', '#4a3018'],
  lining: ['url(#sk-linS)', '#8f7b5a'],
  filler: ['url(#sk-fill)', '#3a2716'],
  velodon: [C.velodon, '#4e6f84'],
  croc: ['url(#sk-scale)', '#120c07'],
  dark: ['url(#sk-dark)', '#26180c'],
  card: ['rgba(226,214,190,0.25)', C.struct],
  foam: ['#8d8a7a', '#4d4b42'],
}

// A ply in longitudinal section. x1..x2, upper surface y, thickness t (px).
// skL / skR = [length px, end thickness px] skive ramps, cut from the
// `cut` side ('bottom' for a top layer, 'top' for a lining).
// `open` = 'l' | 'r' | 'lr' leaves that end unstroked (to join another shape).
export function Ply({ x1, x2, y, t, k = 'top', skL, skR, cut = 'bottom', op, dash, stroke, open = '' }) {
  const [fill, edge] = PLY[k] || PLY.top
  const tl = skL ? skL[1] : t
  const tr = skR ? skR[1] : t
  const xl = skL ? x1 + skL[0] : x1
  const xr = skR ? x2 - skR[0] : x2
  let pts
  if (cut === 'bottom') {
    pts = [[x1, y], [x2, y], [x2, y + tr], [xr, y + t], [xl, y + t], [x1, y + tl]]
  } else {
    const b = y + t
    pts = [[x1, b - tl], [xl, y], [xr, y], [x2, b - tr], [x2, b], [x1, b]]
  }
  const P = (a) => a.map((p) => p.join(',')).join(' ')
  if (!open)
    return (
      <polygon points={P(pts)} fill={fill} stroke={stroke || edge} strokeWidth="0.8" opacity={op} strokeDasharray={dash} strokeLinejoin="round" />
    )
  // stroke everything except the open end(s)
  const [a, b, c, d, e, f] = pts
  const L = open.includes('l')
  const R = open.includes('r')
  const strokes =
    cut === 'bottom'
      ? [[a, b], ...(R ? [] : [[b, c]]), [c, d, e, f], ...(L ? [] : [[f, a]])]
      : [[a, b, c, d], ...(R ? [] : [[d, e]]), [e, f], ...(L ? [] : [[f, a]])]
  return (
    <g opacity={op}>
      <polygon points={P(pts)} fill={fill} />
      {strokes.map((s, i) => (
        <polyline key={i} points={P(s)} fill="none" stroke={stroke || edge} strokeWidth="0.8" strokeDasharray={dash} strokeLinejoin="round" />
      ))}
    </g>
  )
}

// A ply that wraps a spring bar (centre cx,cy radius r) — body to the right
// (or to the left with dir = -1). t = thickness, xR = body end, conv = run
// over which the tail rises back under the body, tail = skived tail length
// beyond that, ts = tail thickness where it meets the body.
// xR is the body's open end (no edge stroke drawn there, so two wraps can
// share one continuous body).
export function Wrap({ cx, cy, r, t, xR, conv, tail, ts, k = 'top', dir = 1, op, seam = true, flesh = false }) {
  const [fill, edge] = PLY[k] || PLY.top
  const cv = conv ?? r * 2.6
  const tl = tail ?? r * 4
  const tss = ts ?? t * 0.55
  const y1 = cy - r
  const X = (x) => cx + (x - cx) * dir
  const sw = dir === 1 ? 0 : 1
  const end = X(cx + cv + tl)
  const outer =
    `M${xR} ${y1 - t} L${cx} ${y1 - t} ` +
    `A${r + t} ${r + t} 0 0 ${sw} ${cx} ${cy + r + t} ` +
    `C${X(cx + cv * 0.55)} ${cy + r + t} ${X(cx + cv * 0.62)} ${y1 + tss} ${X(cx + cv)} ${y1 + tss} ` +
    `L${end} ${y1}`
  const hole =
    `M${cx} ${y1} A${r} ${r} 0 0 ${sw} ${cx} ${cy + r} ` +
    `C${X(cx + cv * 0.55)} ${cy + r} ${X(cx + cv * 0.62)} ${y1} ${X(cx + cv)} ${y1} Z`
  return (
    <g opacity={op}>
      <path d={`${outer} L${xR} ${y1} Z ${hole}`} fill={fill} fillRule="evenodd" />
      <path d={`${outer} ${flesh ? `L${xR} ${y1}` : ''}`} fill="none" stroke={edge} strokeWidth="0.8" strokeLinejoin="round" />
      <path d={hole} fill="none" stroke={edge} strokeWidth="0.8" strokeLinejoin="round" />
      {seam && <line x1={X(cx + cv)} y1={y1} x2={end} y2={y1} stroke="#4a3018" strokeWidth="0.8" />}
    </g>
  )
}

// End-on spring bar (or any rod) in section.
export function BarEnd({ cx, cy, r, c, label }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={c || 'url(#sk-barEnd)'} stroke="#2d3940" strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r={r * 0.45} fill="none" stroke="#3b4a54" strokeWidth="0.7" />
    </g>
  )
}

export const GlueLine = ({ x1, x2, y, c = C.glue }) => (
  <line x1={x1} y1={y} x2={x2} y2={y} stroke={c} strokeWidth="2.2" strokeDasharray="1.2 2.6" strokeLinecap="round" />
)
export const NoGlue = ({ x1, x2, y, h = 8 }) => (
  <rect x={Math.min(x1, x2)} y={y - h / 2} width={Math.abs(x2 - x1)} height={h} fill="url(#sk-noglue)" stroke={C.ruby} strokeWidth="0.7" strokeDasharray="2 2" />
)
// Velodon / reinforcement as a thin line in section
export const Reinf = ({ x1, x2, y, w = 2.2 }) => <line x1={x1} y1={y} x2={x2} y2={y} stroke={C.velodon} strokeWidth={w} />

// Stitch through a section: vertical thread passes at pitch p (px).
export function SectionStitch({ x1, x2, y1, y2, p = 14, c = C.thread }) {
  const n = Math.max(1, Math.floor((x2 - x1) / p))
  return (
    <g stroke={c} strokeWidth="1.4" strokeLinecap="round">
      {Array.from({ length: n + 1 }, (_, i) => {
        const x = x1 + i * p
        return (
          <g key={i}>
            <line x1={x} y1={y1 - 1.5} x2={x} y2={y2 + 1.5} opacity="0.95" />
            {i < n && <line x1={x} y1={y1 - 1.5} x2={x + p} y2={y1 - 1.5} strokeWidth="1.8" opacity="0.6" />}
            {i < n && <line x1={x} y1={y2 + 1.5} x2={x + p} y2={y2 + 1.5} strokeWidth="1.8" opacity="0.6" />}
          </g>
        )
      })}
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* Transverse section (across the width) and edge profiles             */
/* ------------------------------------------------------------------ */
// layers top→bottom: [{ k, t }] (t in px), w = width px, centred on cx.
// edge: 'square' | 'bevel' | 'round' | 'paint' | 'turned' | 'rough'
export function XSec({ cx, y, w, layers, edge = 'square', b = 4, coat = 3 }) {
  const cid = uid()
  const total = layers.reduce((s, l) => s + l.t, 0)
  const x1 = cx - w / 2
  const x2 = cx + w / 2
  let yy = y
  const plies = layers.map((l, i) => {
    const py = yy
    yy += l.t
    const first = i === 0
    const last = i === layers.length - 1
    const [fill, stroke] = PLY[l.k] || PLY.top
    const inset = l.inset || 0
    const lx1 = x1 + inset
    const lx2 = x2 - inset
    const domeH = l.dome || 0
    let d
    if (domeH) {
      d = `M${lx1} ${py + l.t} Q${cx} ${py + l.t - domeH * 2} ${lx2} ${py + l.t} Z`
    } else if (edge === 'bevel' || edge === 'paint') {
      const bt = first ? b : 0
      const bb = last ? b : 0
      d = `M${lx1 + bt} ${py} L${lx2 - bt} ${py} L${lx2} ${py + bt} L${lx2} ${py + l.t - bb} L${lx2 - bb} ${py + l.t} L${lx1 + bb} ${py + l.t} L${lx1} ${py + l.t - bb} L${lx1} ${py + bt} Z`
    } else {
      d = `M${lx1} ${py} H${lx2} V${py + l.t} H${lx1} Z`
    }
    return <path key={i} d={d} fill={fill} stroke={stroke} strokeWidth="0.8" strokeLinejoin="round" />
  })
  const round = edge === 'round'
  return (
    <g>
      {round ? (
        <g>
          <clipPath id={`xr${cid}`}>
            <rect x={x1} y={y} width={w} height={total} rx={total / 2} />
          </clipPath>
          <g clipPath={`url(#xr${cid})`}>{plies}</g>
          {[x1, x2].map((ex, i) => (
            <path
              key={i}
              d={`M${ex + (i ? -total / 2 : total / 2)} ${y + 1} A${total / 2} ${total / 2 - 1} 0 0 ${i ? 1 : 0} ${ex + (i ? -total / 2 : total / 2)} ${y + total - 1}`}
              fill="none"
              stroke="#f6e2bd"
              strokeWidth="1.6"
              opacity="0.7"
            />
          ))}
        </g>
      ) : (
        plies
      )}
      {edge === 'paint' &&
        [x1, x2].map((ex, i) => {
          const s = i ? 1 : -1
          const o = coat * 0.5
          const d = `M${ex - s * (b + 0.5)} ${y - o * 0.7} L${ex + s * o * 0.4} ${y + b - o * 0.3} L${ex + s * o} ${y + b + 0.6} L${ex + s * o} ${y + total - b - 0.6} L${ex + s * o * 0.4} ${y + total - b + o * 0.3} L${ex - s * (b + 0.5)} ${y + total + o * 0.7}`
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={C.paint} strokeWidth={coat} strokeLinejoin="round" strokeLinecap="round" />
              <path d={d} fill="none" stroke="#7a5638" strokeWidth="0.6" strokeLinejoin="round" opacity="0.8" transform={`translate(${s * o * 0.6} 0)`} />
            </g>
          )
        })}
      {edge === 'rough' &&
        [x1, x2].map((ex, i) => (
          <path
            key={i}
            d={Array.from({ length: Math.ceil(total / 2) + 1 }, (_, j) => `${j ? 'L' : 'M'}${ex + (i ? 1 : -1) * (j % 2 ? 1.8 : 0)} ${y + Math.min(total, j * 2)}`).join(' ')}
            fill="none"
            stroke="#e9cf9f"
            strokeWidth="0.9"
          />
        ))}
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* Hardware                                                            */
/* ------------------------------------------------------------------ */
// Tang buckle in plan. (x, y) = centre of the buckle bar; w = inner width px;
// L = frame depth px (along the strap, pointing +x). metal: 'steel'|'brass'
export function Buckle({ x, y, w, L, metal = 'steel', tongue = true, ang = 0, op }) {
  const fill = metal === 'brass' ? 'url(#sk-brassG)' : 'url(#sk-steel)'
  const th = Math.max(2.4, w * 0.09)
  const h = w / 2 + th
  return (
    <g transform={`rotate(${ang} ${x} ${y})`} opacity={op}>
      <path
        d={`M${x} ${y - h} L${x + L - h * 0.55} ${y - h} Q${x + L} ${y - h} ${x + L} ${y - h * 0.45} L${x + L} ${y + h * 0.45} Q${x + L} ${y + h} ${x + L - h * 0.55} ${y + h} L${x} ${y + h}
           L${x} ${y + h - th} L${x + L - h * 0.55 - th * 0.3} ${y + h - th} Q${x + L - th} ${y + h - th} ${x + L - th} ${y + h * 0.45 - th * 0.2} L${x + L - th} ${y - h * 0.45 + th * 0.2} Q${x + L - th} ${y - h + th} ${x + L - h * 0.55 - th * 0.3} ${y - h + th} L${x} ${y - h + th} Z`}
        fill={fill}
        stroke="#3b4850"
        strokeWidth="0.8"
      />
      {/* bar */}
      <rect x={x - th * 0.5} y={y - h} width={th} height={h * 2} rx={th / 2} fill={fill} stroke="#3b4850" strokeWidth="0.8" />
      {tongue && <path d={`M${x} ${y} L${x + L - th * 0.4} ${y}`} stroke="#d9e3e9" strokeWidth={th * 0.75} strokeLinecap="round" />}
      {tongue && <path d={`M${x} ${y} L${x + L - th * 0.4} ${y}`} stroke="#53636d" strokeWidth="0.6" strokeLinecap="round" opacity="0.7" />}
    </g>
  )
}

// Spring bar in plan: from (x, y1) to (x, y2) (vertical across a strap).
export function SpringBar({ x, y1, y2, r = 3, qr }) {
  const top = Math.min(y1, y2)
  const len = Math.abs(y2 - y1)
  return (
    <g>
      <rect x={x - r} y={top} width={r * 2} height={len} rx={r} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.7" />
      <rect x={x - r * 0.55} y={top - r * 1.6} width={r * 1.1} height={r * 1.8} rx={r * 0.4} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" />
      <rect x={x - r * 0.55} y={top + len - r * 0.2} width={r * 1.1} height={r * 1.8} rx={r * 0.4} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" />
      {[0.12, 0.88].map((f) => (
        <line key={f} x1={x - r} y1={top + len * f} x2={x + r} y2={top + len * f} stroke="#3b4850" strokeWidth="0.9" />
      ))}
      {qr && <rect x={x + r * 0.6} y={top + len * 0.22 - 3} width={r * 2.4} height={6} rx="2" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.6" />}
    </g>
  )
}

// Watch case in side view with one lug and its spring bar: for clearance and
// fitting drawings. (x, y) = bar centre; s = px per mm. dir = 1 means the
// case body lies to the left of the lug.
// The near lug is drawn as a ghost (outline + light tint) so the strap end
// behind it stays visible. gap = bar centre → case flank, in mm.
export function CaseSide({ x, y, s, gap = 3.2, len = 26, lugOnly, ghost = true }) {
  const fx = x - gap * s
  const top = y - 5.4 * s
  const bot = y + 3.6 * s
  const left = fx - len * s
  return (
    <g>
      {!lugOnly && (
        <g>
          <path
            d={`M${left} ${top + 0.6 * s} L${fx - 1.4 * s} ${top + 0.6 * s} Q${fx} ${top + 0.7 * s} ${fx} ${top + 2.2 * s} L${fx} ${bot - 1.6 * s} Q${fx} ${bot} ${fx - 1.6 * s} ${bot} L${left} ${bot} Z`}
            fill="url(#sk-steel)"
            stroke="#3b4850"
            strokeWidth="0.9"
          />
          <rect x={left} y={bot} width={fx - 2.6 * s - left} height={1.1 * s} rx={0.4 * s} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.7" opacity="0.9" />
          <rect x={left} y={top - 0.6 * s} width={fx - 0.8 * s - left} height={1.3 * s} rx={0.4 * s} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.7" />
          <path d={`M${left} ${top - 0.6 * s} Q${left + (fx - left) * 0.5} ${top - 2.2 * s} ${fx - 1.4 * s} ${top - 0.6 * s} Z`} fill="url(#sk-glass)" stroke={C.steel} strokeWidth="0.8" />
        </g>
      )}
      {/* lug horn */}
      <path
        d={`M${fx - 0.6 * s} ${top + 0.7 * s} L${x + 0.6 * s} ${top + 1.5 * s} Q${x + 2.3 * s} ${top + 2.1 * s} ${x + 2.3 * s} ${y - 0.6 * s}
            Q${x + 2.3 * s} ${y + 2.2 * s} ${x} ${y + 2.2 * s} Q${x - 1.8 * s} ${y + 2.2 * s} ${fx + 0.6 * s} ${y + 0.7 * s} L${fx - 0.6 * s} ${y + 0.4 * s} Z`}
        fill={ghost ? 'rgba(180,196,206,0.16)' : 'url(#sk-steel)'}
        stroke="#9fb4c2"
        strokeWidth="1"
        strokeDasharray={ghost ? '4 3' : undefined}
      />
      <circle cx={x} cy={y} r={1.05 * s} fill="none" stroke="#9fb4c2" strokeWidth="0.8" strokeDasharray="2 2" />
    </g>
  )
}

// Cut-away wrist (ellipse) with a strap around it — for sizing figures.
export function Wrist({ cx, cy, rx, ry }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="rgba(214,170,140,0.14)" stroke="#a57e66" strokeWidth="1.2" />
      <ellipse cx={cx - rx * 0.32} cy={cy + ry * 0.05} rx={rx * 0.2} ry={ry * 0.32} fill="rgba(240,230,215,0.08)" stroke="#8b7462" strokeWidth="0.8" />
      <ellipse cx={cx + rx * 0.36} cy={cy} rx={rx * 0.16} ry={ry * 0.28} fill="rgba(240,230,215,0.08)" stroke="#8b7462" strokeWidth="0.8" />
    </g>
  )
}

export { px, outline, widthAt }
