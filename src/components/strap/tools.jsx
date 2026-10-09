// Tool glyphs for the strap diagrams. Each is drawn in local coordinates with
// (0,0) at the WORKING POINT (blade edge, prong tips, punch mouth…) and the
// tool extending upward (−y). Place with x, y, rotate with ang (degrees,
// clockwise), scale with k.
import { C } from './kit.jsx'

const G = ({ x = 0, y = 0, ang = 0, k = 1, op, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${k})`} opacity={op}>
    {children}
  </g>
)
const steel = { fill: 'url(#sk-steel)', stroke: '#3b4850', strokeWidth: 0.8 }
const steelH = { fill: 'url(#sk-steelH)', stroke: '#3b4850', strokeWidth: 0.8 }
const wood = { fill: 'url(#sk-wood)', stroke: '#3e2614', strokeWidth: 0.8 }
const ebony = { fill: 'url(#sk-ebony)', stroke: '#0d0b0a', strokeWidth: 0.8 }

/* ---- knives ---- */
// kind: 'round' (head knife), 'skive' (Japanese / Kyoshin-style skiving
// knife, edge across the tip), 'utility' (snap blade), 'paring'
export function Knife({ kind = 'skive', ...p }) {
  if (kind === 'round')
    return (
      <G {...p}>
        <path d="M-40 -7 Q0 8 40 -7 L36 -26 L6 -28 L5 -42 L-5 -42 L-6 -28 L-36 -26 Z" {...steel} />
        <path d="M-37 -8 Q0 5 37 -8" fill="none" stroke="#f6fbff" strokeWidth="1" opacity="0.8" />
        <rect x="-7" y="-102" width="14" height="62" rx="5" {...ebony} />
        <rect x="-8" y="-46" width="16" height="7" rx="2" {...steelH} />
      </G>
    )
  if (kind === 'utility')
    return (
      <G {...p}>
        <path d="M-4 0 L5 -6 L5 -34 L-4 -34 Z" {...steel} />
        {[-12, -20, -28].map((y) => (
          <line key={y} x1="-4" y1={y + 4} x2="5" y2={y - 2} stroke="#5f717d" strokeWidth="0.6" />
        ))}
        <rect x="-7" y="-104" width="15" height="72" rx="4" fill="#3d4a39" stroke="#1d241b" strokeWidth="0.8" />
        <rect x="-3" y="-90" width="7" height="22" rx="2" fill="#6c7f63" />
      </G>
    )
  // skive / paring
  return (
    <G {...p}>
      <path d="M-7 0 L7 -11 L7 -70 L-7 -70 Z" {...steel} />
      <path d="M-7 -3.5 L7 -14.5" stroke="#ffffff" strokeWidth="0.9" opacity="0.75" />
      <path d="M-7 0 L7 -11" stroke="#f6fbff" strokeWidth="1.4" />
      <rect x="-8.5" y="-130" width="17" height="62" rx="3" {...wood} />
      {[-118, -82].map((y) => (
        <rect key={y} x="-9" y={y} width="18" height="4" rx="1" fill="#2a2018" />
      ))}
    </G>
  )
}

/* ---- straightedge, plan view. (x,y) = start of the working edge; the
   body lies above the edge (side 'above') or below it ---- */
export function Rule({ x, y, len = 300, ang = 0, s = 3, w = 14, side = 'above' }) {
  const y0 = side === 'above' ? -w : 0
  const edgeY = side === 'above' ? 0 : 0
  const dir = side === 'above' ? -1 : 1
  const ticks = []
  for (let mm = 0; mm * s <= len; mm += 5) {
    const l = mm % 10 === 0 ? 5 : 3
    ticks.push(<line key={mm} x1={mm * s} y1={edgeY} x2={mm * s} y2={edgeY + dir * l} stroke="#3b4850" strokeWidth="0.6" />)
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang})`}>
      <rect x="0" y={y0} width={len} height={w} {...steel} opacity="0.95" />
      {ticks}
    </g>
  )
}

/* ---- pricking iron, side view: prong tips on y = 0 from x = 0 ---- */
// kind: 'french' (slanted narrow) | 'diamond' (Japanese) | 'chisel'
export function Iron({ n = 6, pitch = 10, kind = 'french', ...p }) {
  const span = (n - 1) * pitch
  return (
    <G {...p}>
      {Array.from({ length: n }, (_, i) => (
        <path
          key={i}
          d={`M${i * pitch - 2.6} -12 L${i * pitch} ${kind === 'chisel' ? -1 : 0} L${i * pitch + 2.6} -12 Z`}
          {...steel}
          strokeWidth="0.6"
        />
      ))}
      <rect x={-6} y={-22} width={span + 12} height={11} rx="1.5" {...steel} />
      <path d={`M${span / 2 - 9} -22 L${span / 2 - 6} -62 L${span / 2 + 6} -62 L${span / 2 + 9} -22 Z`} {...steelH} />
      <rect x={span / 2 - 10} y={-72} width="20" height="11" rx="2" {...steel} />
    </G>
  )
}

/* ---- poly mallet: striking face at (0,0) facing down ---- */
export function Mallet(p) {
  return (
    <G {...p}>
      <rect x="-17" y="-44" width="34" height="44" rx="7" fill="#e7e0d0" stroke="#8d8576" strokeWidth="0.9" />
      <line x1="-17" y1="-8" x2="17" y2="-8" stroke="#b9b1a1" strokeWidth="0.8" />
      <path d="M17 -26 L92 -36 L93 -26 L17 -18 Z" {...wood} />
    </G>
  )
}

/* ---- cobbler's hammer: polished face at (0,0) facing down ---- */
export function Hammer(p) {
  return (
    <G {...p}>
      <path d="M-11 0 Q-12 -6 -9 -10 L-6 -34 L6 -34 L9 -10 Q12 -6 11 0 Z" {...steel} />
      <path d="M-11 0 L11 0" stroke="#f6fbff" strokeWidth="1.2" />
      <path d="M6 -26 L86 -32 L87 -24 L6 -19 Z" {...wood} />
    </G>
  )
}

/* ---- awls: point at (0,0). kind 'round' | 'diamond' | 'scratch' ---- */
export function Awl({ kind = 'diamond', ...p }) {
  return (
    <G {...p}>
      <path d={kind === 'diamond' ? 'M0 0 L-2.6 -10 L-1.6 -40 L1.6 -40 L2.6 -10 Z' : 'M0 0 L-1.6 -40 L1.6 -40 Z'} {...steelH} />
      <rect x="-4" y="-48" width="8" height="9" rx="1.5" fill="url(#sk-brassG)" stroke="#5c461a" strokeWidth="0.6" />
      <path d="M-5 -48 Q-11 -70 -7 -98 Q0 -106 7 -98 Q11 -70 5 -48 Z" {...wood} />
    </G>
  )
}

/* ---- harness needle between two points, eye at (x2, y2) ---- */
export function Needle({ x1, y1, x2, y2, thread, tc = C.thread }) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const ex = x2 - Math.cos(a) * 4
  const ey = y2 - Math.sin(a) * 4
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#cfdbe3" strokeWidth="1.9" strokeLinecap="round" />
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5f717d" strokeWidth="0.5" strokeLinecap="round" />
      <ellipse cx={ex} cy={ey} rx="2.6" ry="0.9" transform={`rotate(${(a * 180) / Math.PI} ${ex} ${ey})`} fill={C.ground} />
      {thread && <path d={thread} fill="none" stroke={tc} strokeWidth="1.4" strokeLinecap="round" />}
    </g>
  )
}

/* ---- punches: mouth at (0,0). kind 'round' | 'oblong' | 'notch' ---- */
export function Punch({ kind = 'round', d = 6, ...p }) {
  const w = kind === 'oblong' ? d * 2.6 : d
  return (
    <G {...p}>
      <path d={`M${-w / 2} 0 L${-w / 2 - 2} -14 L${-w / 2 - 2} -40 L${w / 2 + 2} -40 L${w / 2 + 2} -14 L${w / 2} 0 Z`} {...steelH} />
      <rect x={-w / 2 - 6} y={-58} width={w + 12} height={20} rx="3" {...steel} />
      <rect x={-w / 2 - 8} y={-64} width={w + 16} height={7} rx="2" {...steelH} />
      <line x1={-w / 2} y1="-1" x2={w / 2} y2="-1" stroke="#f6fbff" strokeWidth="1" />
    </G>
  )
}

/* ---- edge beveller: cutting tip at (0,0) ---- */
export function Beveller(p) {
  return (
    <G {...p}>
      <path d="M-3 0 L-4 -6 L-2 -34 L2 -34 L4 -6 L3 0 L1.2 -3 L-1.2 -3 Z" {...steelH} />
      <rect x="-4" y="-40" width="8" height="7" rx="1.5" fill="url(#sk-brassG)" stroke="#5c461a" strokeWidth="0.6" />
      <path d="M-5.5 -40 L-6.5 -100 Q0 -106 6.5 -100 L5.5 -40 Z" {...wood} />
    </G>
  )
}

/* ---- wood slicker: rubbing face at (0,0), lying along x ---- */
export function Slicker({ len = 90, ...p }) {
  return (
    <G {...p}>
      <rect x={-len / 2} y="-18" width={len} height="18" rx="9" {...wood} />
      {[-0.3, 0, 0.3].map((f) => (
        <ellipse key={f} cx={f * len} cy="-9" rx="3" ry="8" fill="none" stroke="#3e2614" strokeWidth="0.8" />
      ))}
    </G>
  )
}

/* ---- wing dividers, side view: points at (-sp/2,0) and (sp/2,0) ---- */
export function Dividers({ sp = 20, h = 90, ...p }) {
  return (
    <G {...p}>
      <path d={`M0 ${-h} L${-sp / 2} 0`} stroke="url(#sk-steelH)" strokeWidth="4" strokeLinecap="round" />
      <path d={`M0 ${-h} L${sp / 2} 0`} stroke="url(#sk-steelH)" strokeWidth="4" strokeLinecap="round" />
      <path d={`M0 ${-h} L${-sp / 2} 0 M0 ${-h} L${sp / 2} 0`} stroke="#3b4850" strokeWidth="0.6" fill="none" />
      <path d={`M${-sp * 0.34} ${-h * 0.34} Q0 ${-h * 0.5} ${sp * 0.34} ${-h * 0.34}`} fill="none" stroke="#9fb0bc" strokeWidth="2" />
      <circle cx="0" cy={-h} r="6" {...steel} />
      <circle cx={sp * 0.34} cy={-h * 0.34} r="3" fill="url(#sk-brassG)" />
    </G>
  )
}

/* ---- digital calipers measuring between x1 and x2 at y (jaw tips) ---- */
export function Calipers({ x1, x2, y, reading, up = true }) {
  const s = up ? -1 : 1
  const by = y + s * 34
  return (
    <g>
      <rect x={x1 - 26} y={Math.min(by, by + s * 12)} width={x2 - x1 + 150} height="12" rx="2" {...steel} />
      <path d={`M${x1} ${y} L${x1 - 4} ${by} L${x1 - 18} ${by} L${x1 - 8} ${y + s * 8} Z`} {...steel} />
      <path d={`M${x2} ${y} L${x2 + 4} ${by} L${x2 + 34} ${by} L${x2 + 34} ${by + s * 24} L${x2 + 2} ${by + s * 24} L${x2 + 8} ${y + s * 8} Z`} {...steel} />
      <rect x={x2 + 40} y={Math.min(by + s * 2, by + s * 26)} width="64" height="24" rx="3" fill="#1f2a24" stroke="#3b4850" />
      {reading && (
        <text x={x2 + 72} y={Math.min(by + s * 2, by + s * 26) + 16.5} fontSize="12" fill="#a5d6a7" textAnchor="middle" fontFamily="var(--font-mono)">
          {reading}
        </text>
      )}
    </g>
  )
}

/* ---- bone folder / plioir: tip at (0,0) ---- */
export function BoneFolder(p) {
  return (
    <G {...p}>
      <path d="M-5 0 Q0 3 5 0 L7 -96 Q0 -102 -7 -96 Z" fill="#ece3cf" stroke="#9c927e" strokeWidth="0.8" />
      <line x1="0" y1="-8" x2="0" y2="-90" stroke="#cdbfa3" strokeWidth="0.6" />
    </G>
  )
}

/* ---- glue brush: bristle tip at (0,0) ---- */
export function Brush(p) {
  return (
    <G {...p}>
      <path d="M-6 0 Q0 3 6 0 L5 -16 L-5 -16 Z" fill="#c7a46d" stroke="#6f5a35" strokeWidth="0.6" />
      <rect x="-5.5" y="-26" width="11" height="11" rx="1" {...steelH} />
      <path d="M-4 -26 L-3 -92 Q0 -96 3 -92 L4 -26 Z" fill="#b5413f" stroke="#5a1d1c" strokeWidth="0.6" />
    </G>
  )
}

/* ---- rubber roller: contact at (0,0) ---- */
export function Roller(p) {
  return (
    <G {...p}>
      <circle cx="0" cy="-13" r="13" fill="#2b2826" stroke="#0e0d0c" strokeWidth="1" />
      <circle cx="0" cy="-13" r="3" {...steel} />
      <path d="M0 -13 L26 -52" stroke="url(#sk-steelH)" strokeWidth="4" strokeLinecap="round" />
      <path d="M24 -50 L50 -92" stroke="#2b2826" strokeWidth="11" strokeLinecap="round" />
    </G>
  )
}

/* ---- leather-tipped crease pliers: jaws at (0,0) ---- */
export function Pliers({ open = 6, ...p }) {
  return (
    <G {...p}>
      <rect x={-9} y={-open / 2 - 7} width="18" height="7" rx="2" fill="#7b5a3a" />
      <rect x={-9} y={open / 2} width="18" height="7" rx="2" fill="#7b5a3a" />
      <path d={`M9 ${-open / 2 - 7} L30 -6 L95 -18`} fill="none" stroke="url(#sk-steelH)" strokeWidth="6" strokeLinecap="round" />
      <path d={`M9 ${open / 2 + 7} L30 6 L95 18`} fill="none" stroke="url(#sk-steelH)" strokeWidth="6" strokeLinecap="round" />
      <circle cx="30" cy="0" r="5" {...steel} />
    </G>
  )
}

/* ---- sharpening stone & strop (plan/side, top-left at x,y) ---- */
export function Stone({ x, y, w = 150, h = 26, grit, tone = '#5d6f62' }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" fill={tone} stroke="#1b231d" strokeWidth="0.9" />
      <rect x={x} y={y} width={w} height={h * 0.3} rx="3" fill="rgba(255,255,255,0.08)" />
      {grit && (
        <text x={x + w / 2} y={y + h / 2 + 4} fontSize="11" fill="#e8f0ea" textAnchor="middle" fontFamily="var(--font-mono)">
          {grit}
        </text>
      )}
    </g>
  )
}
export function Strop({ x, y, w = 150, h = 22 }) {
  return (
    <g>
      <rect x={x - 6} y={y + h - 4} width={w + 50} height="10" rx="3" {...wood} />
      <rect x={x} y={y} width={w} height={h - 3} rx="2" fill="#8a5a31" stroke="#3e2614" strokeWidth="0.8" />
      <rect x={x} y={y} width={w} height={h - 3} rx="2" fill="rgba(120,160,90,0.18)" />
    </g>
  )
}

/* ---- stitching clam / pony: jaw tops at (0,0), strap rises above ---- */
export function Pony({ w = 60, h = 150, ...p }) {
  return (
    <G {...p}>
      <path d={`M${-w / 2} 0 Q${-w / 2 - 6} ${h * 0.5} ${-w / 2 - 14} ${h}`} fill="none" stroke="url(#sk-wood)" strokeWidth="16" />
      <path d={`M${w / 2} 0 Q${w / 2 + 6} ${h * 0.5} ${w / 2 + 14} ${h}`} fill="none" stroke="url(#sk-wood)" strokeWidth="16" />
      <rect x={-w / 2 - 8} y="-4" width="16" height="10" rx="3" fill="#7b5a3a" />
      <rect x={w / 2 - 8} y="-4" width="16" height="10" rx="3" fill="#7b5a3a" />
      <rect x={-w / 2 - 12} y={h * 0.55} width={w + 24} height="7" rx="3" {...steelH} />
    </G>
  )
}

/* ---- sanding stick: abrasive face at (0,0), lying along x ---- */
export function Sander({ len = 100, grit, ...p }) {
  return (
    <G {...p}>
      <rect x={-len / 2} y="-14" width={len} height="14" rx="2" {...wood} />
      <rect x={-len / 2 + 4} y="-4" width={len - 8} height="4" fill="#9d9483" />
      {grit && (
        <text x="0" y="-4" fontSize="10" fill="#f1e6d2" textAnchor="middle" fontFamily="var(--font-mono)">
          {grit}
        </text>
      )}
    </G>
  )
}

/* ---- heated creaser: tip at (0,0) ---- */
export function Creaser({ hot, ...p }) {
  return (
    <G {...p}>
      {hot && <circle cx="0" cy="-3" r="9" fill="rgba(230,120,60,0.22)" />}
      <path d="M-3 0 L-1.2 -3 L1.2 -3 L3 0 L4 -26 L-4 -26 Z" fill="url(#sk-brassG)" stroke="#5c461a" strokeWidth="0.6" />
      <rect x="-3" y="-44" width="6" height="19" {...steelH} />
      <path d="M-6 -44 L-7 -104 Q0 -110 7 -104 L6 -44 Z" {...wood} />
    </G>
  )
}

/* ---- thread burner: tip at (0,0) ---- */
export function Burner({ on = true, ...p }) {
  return (
    <G {...p}>
      {on && <circle cx="0" cy="-2" r="6" fill="rgba(255,150,70,0.3)" />}
      <path d="M-1 0 L1 0 L1.5 -12 L-1.5 -12 Z" fill="#e36d3d" />
      <rect x="-6" y="-26" width="12" height="14" rx="2" {...steelH} />
      <rect x="-7" y="-92" width="14" height="66" rx="6" fill="#323a42" stroke="#111" strokeWidth="0.8" />
      <rect x="-2" y="-70" width="4" height="10" rx="1" fill={C.ruby} />
    </G>
  )
}

/* ---- edge-paint applicator (roller pen): tip at (0,0) ---- */
export function Applicator({ c = C.paint, ...p }) {
  return (
    <G {...p}>
      <circle cx="0" cy="-6" r="6" fill={c} stroke="#000" strokeWidth="0.6" />
      <path d="M-3 -10 L-4 -86 Q0 -92 4 -86 L3 -10 Z" fill="#2f3439" stroke="#111" strokeWidth="0.6" />
    </G>
  )
}

/* ---- dauber / sponge: contact at (0,0) ---- */
export function Dauber({ c = '#7c4a26', ...p }) {
  return (
    <G {...p}>
      <ellipse cx="0" cy="-7" rx="9" ry="7" fill={c} stroke="#2a180b" strokeWidth="0.6" />
      <path d="M-1.5 -13 L-1.5 -62 L1.5 -62 L1.5 -13 Z" fill="#9aa4ab" />
    </G>
  )
}

/* ---- slab (granite / glass / board), side view top-left at x,y ---- */
export function Slab({ x, y, w, h = 14, kind = 'granite' }) {
  const fill = { granite: '#4b4a49', glass: 'url(#sk-glass)', board: '#e7e0cf', pad: '#5a4a3a', wood: 'url(#sk-wood)' }[kind]
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill={fill} stroke={kind === 'glass' ? C.steel : '#232220'} strokeWidth="0.9" />
      {kind === 'granite' &&
        Array.from({ length: Math.floor(w / 9) }, (_, i) => (
          <circle key={i} cx={x + 5 + i * 9 + ((i * 37) % 5)} cy={y + 4 + ((i * 53) % (h - 6))} r="0.9" fill="#8a8987" />
        ))}
      {kind === 'glass' && <line x1={x + 6} y1={y + 3} x2={x + w * 0.4} y2={y + 3} stroke="#e8f6fb" strokeWidth="1" opacity="0.6" />}
    </g>
  )
}

/* ---- rivet / Chicago screw in section: centre top at (0,0) ---- */
export function Rivet({ h = 20, kind = 'rivet', ...p }) {
  return (
    <G {...p}>
      <rect x="-2" y="0" width="4" height={h} {...steelH} />
      <ellipse cx="0" cy="0" rx="7" ry="3.2" fill="url(#sk-brassG)" stroke="#5c461a" strokeWidth="0.6" />
      <ellipse cx="0" cy={h} rx={kind === 'chicago' ? 7 : 5} ry="3" fill="url(#sk-brassG)" stroke="#5c461a" strokeWidth="0.6" />
      {kind === 'chicago' && <line x1="-4" y1={h} x2="4" y2={h} stroke="#5c461a" strokeWidth="1" />}
    </G>
  )
}

/* ---- spring-bar tool: fork at (0,0) ---- */
export function BarTool(p) {
  return (
    <G {...p}>
      <path d="M-3 0 L-3 -6 L-1 -8 L1 -8 L3 -6 L3 0" fill="none" stroke="url(#sk-steelH)" strokeWidth="2" />
      <rect x="-1.5" y="-36" width="3" height="28" fill="url(#sk-steelH)" />
      <rect x="-5" y="-96" width="10" height="62" rx="4" fill="#2f4c6f" stroke="#111" strokeWidth="0.7" />
    </G>
  )
}

/* ---- bottle / former seen end-on: centre at (cx, cy) ---- */
export function Bottle({ cx, cy, r }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="rgba(120,170,150,0.07)" stroke="#6e9c8c" strokeWidth="1.2" />
      <path d={`M${cx - r * 0.62} ${cy - r * 0.5} A${r * 0.8} ${r * 0.8} 0 0 1 ${cx - r * 0.1} ${cy - r * 0.78}`} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="3" strokeLinecap="round" />
    </g>
  )
}

/* ---- heat gun nozzle: outlet at (0,0) ---- */
export function HeatGun(p) {
  return (
    <G {...p}>
      <path d="M-7 0 L-9 -30 L9 -30 L7 0 Z" {...steelH} />
      <rect x="-14" y="-74" width="28" height="44" rx="6" fill="#b5413f" stroke="#5a1d1c" strokeWidth="0.8" />
      <path d="M-4 4 q4 6 0 12 M4 4 q4 6 0 12" stroke="rgba(255,150,70,0.6)" strokeWidth="1.4" fill="none" />
    </G>
  )
}

/* ---- notch plier (Bergeon 31227-style), oval punch at (0,0) ---- */
export function NotchPlier(p) {
  return (
    <G {...p}>
      <rect x="-9" y="-5" width="18" height="10" rx="5" {...steel} />
      <ellipse cx="0" cy="0" rx="6" ry="2" fill={C.ground} />
      <path d="M9 -5 L32 -10 L100 -22" fill="none" stroke="url(#sk-steelH)" strokeWidth="7" strokeLinecap="round" />
      <path d="M9 5 L32 10 L100 22" fill="none" stroke="url(#sk-steelH)" strokeWidth="7" strokeLinecap="round" />
      <circle cx="32" cy="0" r="5" {...steel} />
      <rect x="-4" y="7" width="8" height="10" rx="2" fill="url(#sk-brassG)" />
    </G>
  )
}

/* ---- binder clip, side view: jaws at (0,0) ---- */
export function Clip({ ...p }) {
  return (
    <G {...p}>
      <path d="M-9 0 L-9 -14 L9 -14 L9 0" fill="none" stroke="#2c2c2c" strokeWidth="4" />
      <path d="M-6 -14 L-10 -30 M6 -14 L10 -30" stroke="#c9d1d6" strokeWidth="1.6" fill="none" />
    </G>
  )
}

/* ---- weight block (for no-sew cures): bottom face at (0,0) ---- */
export function Weight({ w = 70, ...p }) {
  return (
    <G {...p}>
      <rect x={-w / 2} y="-34" width={w} height="34" rx="3" fill="#545b61" stroke="#25292c" strokeWidth="0.9" />
      <rect x={-w / 2} y="-34" width={w} height="8" rx="3" fill="rgba(255,255,255,0.08)" />
    </G>
  )
}
