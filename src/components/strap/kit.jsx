// Drawing kit for the strap-making diagrams: palette, shared <defs>,
// the figure frame, and the annotation vocabulary (labels, leaders,
// dimensions, arrows, notes). Every strap figure is built from these so the
// whole course reads as one consistent set of technical drawings.
//
// Colour language (also the legend):
//   top leather   tan          lining   cream        filler  dark brown, cross-hatched
//   reinforcement steel blue   glue     emerald dots no-glue ruby hatch
//   skive         brass fade   thread   ivory        action  brass arrows
//   caution       ruby         dimensions dim mono

export const C = {
  brass: '#d0a84f',
  brassHi: '#e9c877',
  steel: '#86a7bd',
  ruby: '#c25863',
  emerald: '#7ba583',
  text: '#efe8dc',
  dim: '#b3a898',
  faint: '#7d7264',
  line: '#4a4034',
  struct: '#9a8f7d',
  ground: '#181411',
  // materials
  top: '#a8763f',
  topEdge: '#e0b277',
  topDark: '#6f4b27',
  flesh: '#d2b386',
  lining: '#e2d2b3',
  liningEdge: '#b9a684',
  filler: '#6d5035',
  velodon: '#8fb2c9',
  glue: '#8cc095',
  thread: '#f3ead8',
  hole: '#22180f',
  paint: '#3b2a1d',
}

export const FONT = 'var(--font-body)'
export const MONO = 'var(--font-mono)'

/* ------------------------------------------------------------------ */
/* Shared defs — fixed ids (identical in every figure, so duplicates   */
/* resolve to the same thing).                                          */
/* ------------------------------------------------------------------ */
export function StrapDefs() {
  const arrow = (id, fill, size = 7) => (
    <marker id={id} viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth={size} markerHeight={size} orient="auto-start-reverse">
      <path d="M0 0.8 L10 5 L0 9.2 L2.6 5 Z" fill={fill} />
    </marker>
  )
  return (
    <defs>
      {arrow('sk-a-brass', C.brass)}
      {arrow('sk-a-ruby', C.ruby)}
      {arrow('sk-a-steel', C.steel)}
      {arrow('sk-a-emerald', C.emerald)}
      {arrow('sk-a-text', C.text)}
      <marker id="sk-a-dim" viewBox="0 0 10 10" refX="9.6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0 1.5 L10 5 L0 8.5 Z" fill={C.dim} />
      </marker>

      {/* leather, plan view */}
      <linearGradient id="sk-top" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#bf8c52" />
        <stop offset="0.5" stopColor="#a8763f" />
        <stop offset="1" stopColor="#8c5f30" />
      </linearGradient>
      <linearGradient id="sk-flesh" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#dcc093" />
        <stop offset="1" stopColor="#c6a575" />
      </linearGradient>
      <linearGradient id="sk-lin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ece0c7" />
        <stop offset="1" stopColor="#d5c3a1" />
      </linearGradient>
      <linearGradient id="sk-dark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6e4a2a" />
        <stop offset="1" stopColor="#4d331d" />
      </linearGradient>
      <linearGradient id="sk-croc" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4a3a2c" />
        <stop offset="1" stopColor="#2c221a" />
      </linearGradient>
      {/* leather, section view (cut face) */}
      <linearGradient id="sk-topS" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7d5228" />
        <stop offset="0.18" stopColor="#b2804a" />
        <stop offset="1" stopColor="#d3ae7b" />
      </linearGradient>
      <linearGradient id="sk-linS" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d9c7a4" />
        <stop offset="0.8" stopColor="#ebdec4" />
        <stop offset="1" stopColor="#c9b48d" />
      </linearGradient>
      <pattern id="sk-fill" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="6" height="6" fill={C.filler} />
        <line x1="0" y1="0" x2="0" y2="6" stroke="#8d6c4b" strokeWidth="1" />
      </pattern>
      <pattern id="sk-noglue" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
        <rect width="7" height="7" fill="rgba(194,88,99,0.10)" />
        <line x1="0" y1="0" x2="0" y2="7" stroke={C.ruby} strokeWidth="1.3" opacity="0.75" />
      </pattern>
      <pattern id="sk-glue" width="5" height="5" patternUnits="userSpaceOnUse">
        <rect width="5" height="5" fill="rgba(123,165,131,0.16)" />
        <circle cx="2.5" cy="2.5" r="0.95" fill={C.glue} />
      </pattern>
      <pattern id="sk-hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="5" stroke={C.faint} strokeWidth="0.8" />
      </pattern>
      <pattern id="sk-scale" width="14" height="11" patternUnits="userSpaceOnUse">
        <rect width="14" height="11" fill="#3a2d22" />
        <rect x="0.8" y="0.8" width="12.4" height="9.4" rx="2.4" fill="#4b3a2b" stroke="#21180f" strokeWidth="1" />
      </pattern>
      <pattern id="sk-fibre" width="8" height="5" patternUnits="userSpaceOnUse">
        <rect width="8" height="5" fill="none" />
        <path d="M0 2.5 q2 -1.4 4 0 t4 0" fill="none" stroke="rgba(90,60,30,0.28)" strokeWidth="0.7" />
      </pattern>
      {/* skive fades — opaque at the named end */}
      <linearGradient id="sk-fadeL" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={C.brass} stopOpacity="0.85" />
        <stop offset="1" stopColor={C.brass} stopOpacity="0.05" />
      </linearGradient>
      <linearGradient id="sk-fadeR" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={C.brass} stopOpacity="0.05" />
        <stop offset="1" stopColor={C.brass} stopOpacity="0.85" />
      </linearGradient>
      {/* tools & hardware */}
      <linearGradient id="sk-steel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#eef3f6" />
        <stop offset="0.45" stopColor="#b3c2cc" />
        <stop offset="1" stopColor="#5f717d" />
      </linearGradient>
      <linearGradient id="sk-steelH" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#5f717d" />
        <stop offset="0.5" stopColor="#e6edf1" />
        <stop offset="1" stopColor="#6d7f8a" />
      </linearGradient>
      <linearGradient id="sk-wood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b48455" />
        <stop offset="1" stopColor="#6f4a2b" />
      </linearGradient>
      <linearGradient id="sk-ebony" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#58514b" />
        <stop offset="1" stopColor="#1f1c1a" />
      </linearGradient>
      <linearGradient id="sk-brassG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f6dc98" />
        <stop offset="0.5" stopColor="#cfa24a" />
        <stop offset="1" stopColor="#7d5f22" />
      </linearGradient>
      <radialGradient id="sk-barEnd" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.45" stopColor="#b9c7d0" />
        <stop offset="1" stopColor="#4e5f6a" />
      </radialGradient>
      <linearGradient id="sk-glass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="rgba(160,200,215,0.28)" />
        <stop offset="1" stopColor="rgba(90,130,150,0.12)" />
      </linearGradient>
      <linearGradient id="sk-bench" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3a332c" />
        <stop offset="1" stopColor="#25201b" />
      </linearGradient>
    </defs>
  )
}

/* ------------------------------------------------------------------ */
/* Frame                                                               */
/* ------------------------------------------------------------------ */
// `view` names the drawing type (PLAN / SECTION / DETAIL / TOOL …),
// `scale` is an honest note about exaggeration, e.g. "thickness ×6".
export function Fig({ w = 480, h = 260, view, scale, children, label }) {
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label || view} style={{ fontFamily: FONT }}>
      <StrapDefs />
      {view && (
        <text x="12" y="17" fontSize="9.5" letterSpacing="1.4" fill={C.faint} fontFamily={MONO}>
          {view.toUpperCase()}
        </text>
      )}
      {scale && (
        <text x={w - 12} y="17" fontSize="9.5" letterSpacing="1" fill={C.faint} fontFamily={MONO} textAnchor="end">
          {scale}
        </text>
      )}
      {children}
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Text & annotation                                                    */
/* ------------------------------------------------------------------ */
export function T({ x, y, children, a = 'start', c = C.dim, s = 12, w, mono, it, ls, o }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={a}
      fontSize={s}
      fill={c}
      fontWeight={w}
      fontStyle={it ? 'italic' : undefined}
      fontFamily={mono ? MONO : FONT}
      letterSpacing={ls}
      opacity={o}
    >
      {children}
    </text>
  )
}

// Multi-line note. lines: string[]; first line may be emphasised.
export function Note({ x, y, lines, c = C.dim, a = 'start', s = 11.5, lh = 15, head, hc }) {
  return (
    <g>
      {head && (
        <text x={x} y={y} textAnchor={a} fontSize={s + 0.5} fontWeight="600" fill={hc || c} fontFamily={FONT}>
          {head}
        </text>
      )}
      {lines.map((l, i) => (
        <text key={i} x={x} y={y + (head ? lh : 0) + i * lh} textAnchor={a} fontSize={s} fill={c} fontFamily={FONT}>
          {l}
        </text>
      ))}
    </g>
  )
}

// Leader: dot on the feature p, elbow line to the text at t.
export function Lead({ p, t, text, c = C.text, a, s = 11.5, dot = true, sub, subc = C.faint }) {
  const anchor = a || (t[0] >= p[0] ? 'start' : 'end')
  const tx = t[0] + (anchor === 'start' ? 4 : anchor === 'end' ? -4 : 0)
  return (
    <g>
      <polyline points={`${p[0]},${p[1]} ${t[0]},${t[1]}`} fill="none" stroke={C.struct} strokeWidth="0.8" opacity="0.8" />
      {dot && <circle cx={p[0]} cy={p[1]} r="2.2" fill={c} />}
      <text x={tx} y={t[1] + 4} textAnchor={anchor} fontSize={s} fill={c} fontFamily={FONT}>
        {text}
      </text>
      {sub && (
        <text x={tx} y={t[1] + 4 + s + 2} textAnchor={anchor} fontSize={Math.max(10, s - 1.5)} fill={subc} fontFamily={FONT}>
          {sub}
        </text>
      )}
    </g>
  )
}

// Dimension between a and b, drawn offset by `off` px (perpendicular, to the
// left of a→b). Extension lines run back to the feature.
export function Dim({ a, b, off = 0, text, c = C.dim, s = 10.5, ext = true, flip, tOff = 0 }) {
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const L = Math.hypot(dx, dy) || 1
  const nx = -dy / L
  const ny = dx / L
  const A = [a[0] + nx * off, a[1] + ny * off]
  const B = [b[0] + nx * off, b[1] + ny * off]
  const mid = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]
  let ang = (Math.atan2(dy, dx) * 180) / Math.PI
  if (ang > 90 || ang < -90) ang += 180
  const side = flip ? 1 : -1
  const tx = mid[0] + nx * side * (6 + tOff) * (off < 0 ? -1 : 1)
  const ty = mid[1] + ny * side * (6 + tOff) * (off < 0 ? -1 : 1)
  const short = L < 26
  return (
    <g>
      {ext && off !== 0 && (
        <g stroke={c} strokeWidth="0.6" opacity="0.6">
          <line x1={a[0] + nx * Math.sign(off) * 2} y1={a[1] + ny * Math.sign(off) * 2} x2={A[0] + nx * Math.sign(off) * 3} y2={A[1] + ny * Math.sign(off) * 3} />
          <line x1={b[0] + nx * Math.sign(off) * 2} y1={b[1] + ny * Math.sign(off) * 2} x2={B[0] + nx * Math.sign(off) * 3} y2={B[1] + ny * Math.sign(off) * 3} />
        </g>
      )}
      <line
        x1={A[0]}
        y1={A[1]}
        x2={B[0]}
        y2={B[1]}
        stroke={c}
        strokeWidth="0.85"
        markerStart={short ? undefined : 'url(#sk-a-dim)'}
        markerEnd={short ? undefined : 'url(#sk-a-dim)'}
      />
      {short && (
        <g stroke={c} strokeWidth="1.1">
          <line x1={A[0] - nx * 3 - (dx / L) * 2} y1={A[1] - ny * 3 - (dy / L) * 2} x2={A[0] + nx * 3 + (dx / L) * 2} y2={A[1] + ny * 3 + (dy / L) * 2} />
          <line x1={B[0] - nx * 3 - (dx / L) * 2} y1={B[1] - ny * 3 - (dy / L) * 2} x2={B[0] + nx * 3 + (dx / L) * 2} y2={B[1] + ny * 3 + (dy / L) * 2} />
        </g>
      )}
      {text && (
        <text
          x={tx}
          y={ty}
          fontSize={s}
          fill={c}
          fontFamily={MONO}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(${ang} ${tx} ${ty})`}
        >
          {text}
        </text>
      )}
    </g>
  )
}

// Motion / action arrow along a path `d` (or straight from a to b).
export function Arrow({ d, a, b, c = 'brass', w = 2, dash, both, o }) {
  const col = { brass: C.brass, ruby: C.ruby, steel: C.steel, emerald: C.emerald, text: C.text }[c] || c
  const path = d || `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`
  return (
    <path
      d={path}
      fill="none"
      stroke={col}
      strokeWidth={w}
      strokeLinecap="round"
      strokeDasharray={dash}
      opacity={o}
      markerEnd={`url(#sk-a-${c in { brass: 1, ruby: 1, steel: 1, emerald: 1, text: 1 } ? c : 'brass'})`}
      markerStart={both ? `url(#sk-a-${c})` : undefined}
    />
  )
}

// Numbered disc for an in-figure sequence (only where order is real).
export function Num({ x, y, n, c = C.brass, r = 8 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={C.ground} stroke={c} strokeWidth="1.4" />
      <text x={x} y={y + 0.5} fontSize={r + 2} fontWeight="700" fill={c} textAnchor="middle" dominantBaseline="middle" fontFamily={FONT}>
        {n}
      </text>
    </g>
  )
}

// ✓ / ✗ verdict mark.
export function Verdict({ x, y, ok, r = 9 }) {
  const c = ok ? C.emerald : C.ruby
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={ok ? 'rgba(123,165,131,0.15)' : 'rgba(194,88,99,0.15)'} stroke={c} strokeWidth="1.5" />
      {ok ? (
        <path d={`M${x - r * 0.45} ${y} l${r * 0.32} ${r * 0.34} l${r * 0.6} ${-r * 0.7}`} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d={`M${x - r * 0.38} ${y - r * 0.38} l${r * 0.76} ${r * 0.76} M${x + r * 0.38} ${y - r * 0.38} l${-r * 0.76} ${r * 0.76}`} stroke={c} strokeWidth="2" strokeLinecap="round" />
      )}
    </g>
  )
}

// Small mono tag, e.g. a panel heading inside a multi-panel figure.
export function Tag({ x, y, children, a = 'start', c = C.faint }) {
  return (
    <text x={x} y={y} fontSize="9.5" letterSpacing="1.2" fill={c} fontFamily={MONO} textAnchor={a}>
      {String(children).toUpperCase()}
    </text>
  )
}

// Thin rule separating panels.
export const Sep = ({ x1, y1, x2, y2 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.line} strokeWidth="1" strokeDasharray="2 4" />
)

// Legend row: items = [[swatchKind, label], …]
export function Legend({ x, y, items, gap = 14, s = 10.5 }) {
  let cx = x
  return (
    <g>
      {items.map(([k, label], i) => {
        const g = (
          <g key={i} transform={`translate(${cx} ${y})`}>
            <Swatch k={k} />
            <text x="15" y="4" fontSize={s} fill={C.dim} fontFamily={FONT}>
              {label}
            </text>
          </g>
        )
        cx += 22 + label.length * s * 0.52 + gap
        return g
      })}
    </g>
  )
}
export function Swatch({ k, x = 0, y = 0 }) {
  const box = (fill, stroke) => <rect x={x} y={y - 5} width="11" height="9" rx="1.5" fill={fill} stroke={stroke || 'none'} strokeWidth="0.8" />
  switch (k) {
    case 'top': return box('url(#sk-topS)')
    case 'lining': return box('url(#sk-linS)')
    case 'filler': return box('url(#sk-fill)')
    case 'velodon': return <rect x={x} y={y - 1.5} width="11" height="3" fill={C.velodon} />
    case 'glue': return box('url(#sk-glue)', C.emerald)
    case 'noglue': return box('url(#sk-noglue)', C.ruby)
    case 'skive': return box('url(#sk-fadeR)')
    case 'thread': return <line x1={x} y1={y} x2={x + 11} y2={y} stroke={C.thread} strokeWidth="2" strokeDasharray="3 1.5" />
    case 'paint': return box(C.paint, C.brass)
    default: return box(k)
  }
}
