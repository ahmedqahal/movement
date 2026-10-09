// Strap diagrams — prep: sharpening (T2), cutting (T3), skiving (T4),
// reinforcement (T5) and gluing (T6). See AUTHORING.md.
import { useId } from 'react'
import { C, Fig, T, Note, Lead, Dim, Arrow, Num, Verdict, Tag, Sep, Legend } from './kit.jsx'
import { StrapPlan, Ply, Wrap, BarEnd, GlueLine, XSec } from './parts.jsx'
import { StrapSection } from './sections.jsx'
import { LONG, SHORT, outline, offset, pathOf, px, widthAt } from './geom.js'
import { Knife, Rule, Awl, Stone, Strop, Slab, Brush, Roller, Hammer, Calipers, Sander, Weight, Bottle } from './tools.jsx'

/* ------------------------------------------------------------------ */
/* Local helpers                                                        */
/* ------------------------------------------------------------------ */
const rad = (d) => (d * Math.PI) / 180
const P = (pts) => pts.map((p) => p.map((v) => +v.toFixed(2)).join(',')).join(' ')
const add = (p, v, k = 1) => [p[0] + v[0] * k, p[1] + v[1] * k]
const uid = () => useId().replace(/[^a-zA-Z0-9]/g, '')
// deterministic jitter
const jit = (i, a = 1) => (((i * 9301 + 49297) % 233280) / 233280 - 0.5) * 2 * a

// Local defs (fixed ids, identical wherever they are included).
function PrepDefs() {
  return (
    <defs>
      {/* top leather in section, flesh side UP (as it lies when skiving) */}
      <linearGradient id="pp-topF" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d3ae7b" />
        <stop offset="0.82" stopColor="#b2804a" />
        <stop offset="1" stopColor="#7d5228" />
      </linearGradient>
      <linearGradient id="pp-hide" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b48249" />
        <stop offset="1" stopColor="#8a5c2e" />
      </linearGradient>
      <linearGradient id="pp-wet" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4b2f17" stopOpacity="0.85" />
        <stop offset="1" stopColor="#4b2f17" stopOpacity="0.15" />
      </linearGradient>
      <linearGradient id="pp-stone" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6f8273" />
        <stop offset="1" stopColor="#3f4d42" />
      </linearGradient>
      {/* non-woven polyester (Velodon) */}
      <pattern id="pp-velo" width="14" height="10" patternUnits="userSpaceOnUse">
        <rect width="14" height="10" fill="#9dbbd0" />
        <path d="M0 3 q4 -3 8 1 t6 0 M2 9 q3 -4 7 -2 t5 -3 M-1 6 q5 2 9 -1" fill="none" stroke="#e3eef5" strokeWidth="0.7" opacity="0.8" />
      </pattern>
      {/* Texon (cellulose board) */}
      <pattern id="pp-texon" width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill="#8e9aa1" />
        <circle cx="1.5" cy="1.5" r="0.6" fill="#b9c3c8" />
        <circle cx="4.5" cy="4" r="0.5" fill="#6f7b82" />
      </pattern>
      {/* scuffed flesh */}
      <pattern id="pp-scuff" width="9" height="7" patternUnits="userSpaceOnUse">
        <path d="M0 1.5 l4 1 M5 5 l3.5 -1.2 M2 6 l2.5 0.4 M6 1 l2 1.4" stroke="#7c5631" strokeWidth="0.7" opacity="0.8" />
      </pattern>
      {/* scratched lining grain */}
      <pattern id="pp-scratch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
        <line x1="0" y1="0" x2="0" y2="6" stroke="#9c8661" strokeWidth="0.6" />
        <line x1="0" y1="3" x2="6" y2="3" stroke="#9c8661" strokeWidth="0.4" opacity="0.7" />
      </pattern>
      {/* belly / loose grain wrinkles */}
      <pattern id="pp-loose" width="16" height="7" patternUnits="userSpaceOnUse">
        <path d="M0 3.5 q4 -3 8 0 t8 0" fill="none" stroke="#5c3a1b" strokeWidth="0.8" opacity="0.7" />
      </pattern>
      {/* stone surface */}
      <pattern id="pp-grit" width="7" height="5" patternUnits="userSpaceOnUse">
        <circle cx="1.5" cy="1.5" r="0.5" fill="#a6b6a9" opacity="0.6" />
        <circle cx="5" cy="3.5" r="0.4" fill="#2c3a2f" opacity="0.7" />
      </pattern>
      <pattern id="pp-crepe" width="8" height="6" patternUnits="userSpaceOnUse">
        <rect width="8" height="6" fill="#d9bd80" />
        <path d="M0 2 q2 -1.5 4 0 t4 0 M0 5 q2 1.5 4 0 t4 0" fill="none" stroke="#a88a4e" strokeWidth="0.7" />
      </pattern>
      <pattern id="pp-sponge" width="7" height="6" patternUnits="userSpaceOnUse">
        <rect width="7" height="6" fill="#d9c27a" />
        <ellipse cx="2" cy="2" rx="1.1" ry="0.8" fill="#a98e45" />
        <ellipse cx="5.3" cy="4.4" rx="0.9" ry="0.7" fill="#a98e45" />
      </pattern>
    </defs>
  )
}

// Single-bevel blade seen edge-on (a section across the blade).
// (x, y) = cutting edge. ang = angle of the back face to the horizontal
// (deg), dir = -1 body runs up-left, +1 up-right. face 'bevelDown' = the
// bevel lies on the surface (honing); 'backDown' = flat back underneath,
// bevel on top (skiving, stropping the back).
function Blade({ x, y, ang = 20, dir = -1, len = 120, t = 7, bevel = 20, handle = 60, face = 'bevelDown', op, hOff = 0, round }) {
  const c = Math.cos(rad(ang))
  const s = Math.sin(rad(ang))
  const d = [dir * c, -s]
  let n = [-d[1], d[0]]
  if ((face === 'bevelDown') !== n[1] > 0) n = [-n[0], -n[1]]
  if (Math.abs(n[1]) < 1e-6) n = face === 'bevelDown' ? [0, 1] : [0, -1]
  const E = [x, y]
  const A = add(E, d, len)
  const B = add(A, n, t)
  const bl = t / Math.tan(rad(bevel))
  const H = add(add(E, d, bl), n, t)
  const th = t * 2.3
  const m0 = add(add(A, n, t / 2 + hOff), d, -4)
  const m1 = add(m0, d, handle)
  const hp = [add(m0, n, -th / 2), add(m0, n, th / 2), add(m1, n, th / 2), add(m1, n, -th / 2)]
  let body
  if (round) {
    // a rocked, rounded bevel: convex instead of flat
    const M = [(E[0] + H[0]) / 2 + n[0] * -t * 0.35, (E[1] + H[1]) / 2 + n[1] * -t * 0.35]
    body = (
      <path
        d={`M${E[0]} ${E[1]} L${A[0]} ${A[1]} L${B[0]} ${B[1]} L${H[0]} ${H[1]} Q${M[0]} ${M[1]} ${E[0]} ${E[1]} Z`}
        fill="url(#sk-steel)"
        stroke="#3b4850"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    )
  } else {
    body = <polygon points={P([E, A, B, H])} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" strokeLinejoin="round" />
  }
  return (
    <g opacity={op}>
      {handle > 0 && <polygon points={P(hp)} fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.8" strokeLinejoin="round" />}
      {body}
      {!round && <line x1={E[0]} y1={E[1]} x2={H[0]} y2={H[1]} stroke="#f6fbff" strokeWidth="1" opacity="0.75" />}
    </g>
  )
}
// Edge-on geometry of a Blade, for annotation.
function bladeGeom({ x, y, ang = 20, dir = -1, t = 7, bevel = 20, face = 'bevelDown' }) {
  const d = [dir * Math.cos(rad(ang)), -Math.sin(rad(ang))]
  let n = [-d[1], d[0]]
  if ((face === 'bevelDown') !== n[1] > 0) n = [-n[0], -n[1]]
  const E = [x, y]
  const H = add(add(E, d, t / Math.tan(rad(bevel))), n, t)
  return { d, n, E, H, at: (k, off = 0) => add(add(E, d, k), n, off) }
}

// Angle arc at (cx, cy) from a0 to a1 degrees (SVG convention: 0 = +x, 90 = down).
function Arc({ cx, cy, r, a0, a1, c = C.brass, w = 1.1, dash }) {
  const p0 = [cx + r * Math.cos(rad(a0)), cy + r * Math.sin(rad(a0))]
  const p1 = [cx + r * Math.cos(rad(a1)), cy + r * Math.sin(rad(a1))]
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0
  const sweep = a1 > a0 ? 1 : 0
  return <path d={`M${p0[0]} ${p0[1]} A${r} ${r} 0 ${large} ${sweep} ${p1[0]} ${p1[1]}`} fill="none" stroke={c} strokeWidth={w} strokeDasharray={dash} />
}
function Sector({ cx, cy, r, a0, a1, fill, stroke, op }) {
  const p0 = [cx + r * Math.cos(rad(a0)), cy + r * Math.sin(rad(a0))]
  const p1 = [cx + r * Math.cos(rad(a1)), cy + r * Math.sin(rad(a1))]
  return <path d={`M${cx} ${cy} L${p0[0]} ${p0[1]} A${r} ${r} 0 0 ${a1 > a0 ? 1 : 0} ${p1[0]} ${p1[1]} Z`} fill={fill} stroke={stroke} strokeWidth="0.8" opacity={op} />
}

// Magnified inset: a dashed ring on the source spot, a tie line and a
// clipped circle in which `children` are drawn (in figure coordinates).
function Callout({ cx, cy, r, sx, sy, sr = 8, children, label, lc, ly }) {
  const id = uid()
  const dx = cx - sx
  const dy = cy - sy
  const L = Math.hypot(dx, dy) || 1
  const ux = dx / L
  const uy = dy / L
  return (
    <g>
      <circle cx={sx} cy={sy} r={sr} fill="none" stroke={C.brass} strokeWidth="1" strokeDasharray="3 2" />
      <line x1={sx + ux * sr} y1={sy + uy * sr} x2={cx - ux * r} y2={cy - uy * r} stroke={C.brass} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.8" />
      <clipPath id={`co${id}`}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <circle cx={cx} cy={cy} r={r} fill="#221c17" />
      <g clipPath={`url(#co${id})`}>{children}</g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.brass} strokeWidth="1.2" />
      {label && (
        <T x={cx} y={ly ?? cy + r + 13} a="middle" s={10} c={lc || C.faint}>
          {label}
        </T>
      )}
    </g>
  )
}

// A rectangular panel frame (for before/after and comparison cells).
const Panel = ({ x, y, w, h, c = C.line }) => <rect x={x} y={y} width={w} height={h} rx="7" fill="rgba(255,255,255,0.025)" stroke={c} strokeWidth="1" />

// Leather profile polygon (section). k: 'top' grain-up, 'topF' flesh-up, 'lining'.
function Prof({ pts, d, k = 'top', op, dash }) {
  const fill = { top: 'url(#sk-topS)', topF: 'url(#pp-topF)', lining: 'url(#sk-linS)', dark: 'url(#sk-dark)' }[k] || k
  const stroke = k === 'lining' ? '#8f7b5a' : '#4a3018'
  if (d) return <path d={d} fill={fill} stroke={stroke} strokeWidth="0.8" strokeLinejoin="round" opacity={op} strokeDasharray={dash} />
  return <polygon points={P(pts)} fill={fill} stroke={stroke} strokeWidth="0.8" strokeLinejoin="round" opacity={op} strokeDasharray={dash} />
}

// Card template in plan.
function Template({ T: Tr, o, op = 0.92, label, lc = '#5a4630' }) {
  const pts = outline(o)
  return (
    <g opacity={op}>
      <path d={pathOf(pts, Tr)} fill="#e8dec8" stroke="#8f7b5a" strokeWidth="1" />
      {label && (
        <T x={px(Tr, (o.x0 + o.x1) / 2, 0)[0]} y={Tr.y + 4} a="middle" s={10.5} c={lc}>
          {label}
        </T>
      )}
    </g>
  )
}

// Clip children to a rectangle.
function ClipBox({ x, y, w, h, children }) {
  const id = uid()
  return (
    <g>
      <clipPath id={`cb${id}`}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#cb${id})`}>{children}</g>
    </g>
  )
}

// Break line across a piece (plan or section).
const Break = ({ x, y1, y2, c = C.dim }) => {
  const h = y2 - y1
  return <path d={`M${x} ${y1 - 4} l3 ${h * 0.3 + 4} l-6 ${h * 0.4} l3 ${h * 0.3 + 4}`} fill="none" stroke={c} strokeWidth="1" />
}

// Schematic fingertips of the holding hand (plan view); tips at (x, y)
// pointing along ang.
function Fingers({ x, y, ang = 0, k = 1 }) {
  const f = [[-21, 34], [-7, 46], [7, 44], [21, 34]]
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${k})`}>
      <rect x="-96" y="-32" width="56" height="64" rx="18" fill="rgba(214,170,140,0.10)" stroke="#a57e66" strokeWidth="0.9" strokeDasharray="3 2" />
      {f.map(([yy, len], i) => (
        <rect key={i} x={-len - (46 - len) * 0.2} y={yy - 6} width={len} height="12" rx="6" fill="rgba(214,170,140,0.30)" stroke="#a57e66" strokeWidth="1" />
      ))}
    </g>
  )
}

/* ================================================================== */
/* T2 — Sharpen & strop                                                 */
/* ================================================================== */

/* t2-hone — bevel flat on the 1000 stone until a burr forms */
function Hone() {
  const E = [212, 160]
  const g = bladeGeom({ x: E[0], y: E[1], ang: 20, t: 9 })
  const bk = g.at(78) // a point on the back face
  return (
    <Fig h={306} view="Side view · honing" scale="angle true">
      <PrepDefs />
      {/* plate + stone */}
      <Slab x={18} y={186} w={262} h={11} kind="granite" />
      <Stone x={34} y={160} w={236} h={26} grit="1000 grit" tone="#5d6f62" />
      <rect x={34} y={160} width={236} height={26} rx="3" fill="url(#pp-grit)" />
      {/* knife on its bevel */}
      <Blade x={E[0]} y={E[1]} ang={20} t={9} len={130} handle={62} />
      {/* angle */}
      <Arc cx={E[0]} cy={E[1]} r={78} a0={180} a1={200} />
      <T x={E[0] - 96} y={E[1] - 5} a="middle" s={11} c={C.brass} mono>≈20°</T>
      <line x1={E[0] - 104} y1={E[1]} x2={E[0] - 6} y2={E[1]} stroke={C.brass} strokeWidth="0.6" strokeDasharray="2 2" opacity="0.7" />
      {/* stroke */}
      <Arrow a={[96, 212]} b={[246, 212]} both />
      <T x={171} y={230} a="middle" s={11} c={C.text}>work the whole edge — angle constant</T>
      <T x={171} y={244} a="middle" s={10} c={C.faint}>stone, or wet-and-dry on glass / granite</T>

      {/* labels */}
      <Lead p={bk} t={[150, 66]} text="back face" sub="kept dead flat" />
      <Lead p={[62, 112]} t={[40, 56]} text="skiving knife" a="start" />

      {/* detail: the burr */}
      <Callout cx={394} cy={104} r={72} sx={E[0]} sy={E[1] - 2} sr={10} label="edge ×12 — burr on the back" ly={192}>
        <rect x={310} y={132} width={170} height={60} fill="url(#pp-stone)" />
        <rect x={310} y={132} width={170} height={60} fill="url(#pp-grit)" />
        <Blade x={440} y={132} ang={20} t={30} len={190} handle={0} />
        <path d="M440 132 q4 -1.5 5.5 -9 q0.8 -4.5 -1.6 -6" fill="none" stroke={C.brassHi} strokeWidth="2.2" strokeLinecap="round" />
        <T x={344} y={150} s={10} c="#e8f0ea">bevel on the stone</T>
        <T x={352} y={96} s={10} c={C.text}>back</T>
      </Callout>
      <Lead p={[446, 120]} t={[470, 40]} text="burr" a="end" c={C.brassHi} />

      {/* the house standard */}
      <Note x={302} y={222} head="House standard" hc={C.text} lines={['one bevel ≈20°, back kept flat —', 'no strap source gives an angle']} s={10.5} lh={14} />

      {/* rocking = rounded bevel */}
      <Sep x1={14} y1={262} x2={466} y2={262} />
      <Blade x={120} y={294} ang={20} t={10} len={70} handle={0} round />
      <line x1={30} y1={294} x2={140} y2={294} stroke="#5d6f62" strokeWidth="3" />
      <Verdict x={162} y={282} ok={false} />
      <T x={178} y={280} s={11} c={C.ruby} w="600">A rocking hand rounds the bevel</T>
      <T x={178} y={294} s={10.5}>the edge never meets the stone — hold the angle still</T>
    </Fig>
  )
}

/* t2-refine — same angle through finer grits; back flat to remove the burr */
function Refine() {
  const panels = [
    { x: 16, grit: '1000', tone: '#5d6f62', sp: 6.5, sw: 1.4, cap: 'coarse, deep scratches' },
    { x: 172, grit: 'mid grit', tone: '#6a7b70', sp: 3.6, sw: 0.9, cap: 'finer, shallower' },
    { x: 328, grit: '≈5000', tone: '#878672', sp: 1.9, sw: 0.55, cap: 'fine and even' },
  ]
  return (
    <Fig h={320} view="Sequence · refining the edge" scale="angle true">
      <PrepDefs />
      {panels.map((p, i) => {
        const E = [p.x + 118, 168]
        const sx = p.x + 22
        const lines = []
        for (let k = 0, xx = sx + 2; xx < sx + 96; k++, xx += p.sp) {
          lines.push(<line key={k} x1={xx} y1={50 + Math.abs(jit(k + i * 7, 3))} x2={xx + 7} y2={82 - Math.abs(jit(k * 3 + i, 3))} stroke="#53636d" strokeWidth={p.sw} opacity="0.85" />)
        }
        return (
          <g key={p.grit}>
            <Num x={p.x + 10} y={44} n={i + 1} />
            {/* magnified bevel face */}
            <rect x={sx} y={48} width={100} height={36} rx="3" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.8" />
            <ClipBox x={sx + 1} y={49} w={98} h={34}>{lines}</ClipBox>
            <T x={sx + 50} y={100} a="middle" s={10.5}>{p.cap}</T>
            <line x1={sx + 80} y1={85} x2={E[0] - 10} y2={E[1] - 4} stroke={C.struct} strokeWidth="0.7" strokeDasharray="2 2" />
            <Stone x={p.x} y={168} w={140} h={24} grit={p.grit} tone={p.tone} />
            <Blade x={E[0]} y={E[1]} ang={20} t={7} len={86} handle={30} />
            <Arc cx={E[0]} cy={E[1]} r={50} a0={180} a1={200} />
            <T x={E[0] - 64} y={E[1] - 3} a="middle" s={10} c={C.brass} mono>20°</T>
            {i < 2 && <Arrow a={[p.x + 132, 66]} b={[p.x + 166, 66]} w={1.6} />}
          </g>
        )
      })}
      <T x={240} y={214} a="middle" s={11} c={C.text}>Same angle on every stone — only the scratch pattern changes</T>

      {/* back flat to take off the burr */}
      <Sep x1={14} y1={228} x2={466} y2={228} />
      <Num x={26} y={250} n={4} />
      <T x={40} y={254} s={11.5} c={C.text} w="600">Back flat on the finest grit</T>
      <Note x={40} y={270} lines={['a few light strokes with the back', 'dead flat lift the burr off — never', 'tilt it, or you put a bevel on the back']} s={10.5} lh={14} />
      <Stone x={262} y={278} w={196} h={22} grit="≈5000" tone="#878672" />
      <Blade x={428} y={278} ang={0} t={7} len={180} handle={40} face="backDown" hOff={5} />
      <path d="M428 278 q3 -1 4 -7" fill="none" stroke={C.ruby} strokeWidth="1.6" strokeDasharray="2 1.5" />
      <Lead p={[431, 272]} t={[452, 244]} text="burr off" a="end" c={C.ruby} />
      <Arrow a={[300, 312]} b={[420, 312]} both w={1.6} />
      <Lead p={[330, 274]} t={[300, 246]} text="back on the stone" a="end" />
    </Fig>
  )
}

/* t2-strop — edge trailing, spine leading, alternate sides */
function StropFig() {
  return (
    <Fig h={324} view="Side view · stropping" scale="schematic">
      <PrepDefs />
      <Strop x={22} y={176} w={280} h={24} />
      <T x={40} y={191} s={10} c="#efe2c8">leather strop, charged with compound</T>

      {/* stroke 1: bevel side */}
      <Num x={30} y={44} n={1} />
      <T x={44} y={48} s={11.5} c={C.text} w="600">bevel side</T>
      <Blade x={160} y={176} ang={20} t={8} len={100} handle={44} />
      <Arc cx={160} cy={176} r={58} a0={180} a1={200} />
      <T x={92} y={173} a="middle" s={10} c={C.brass} mono>20°</T>
      <Arrow a={[150, 84]} b={[70, 84]} />
      <T x={110} y={76} a="middle" s={10.5} c={C.brass}>draw — spine first</T>
      <Lead p={[160, 175]} t={[186, 112]} text="edge trailing" c={C.emerald} />

      {/* stroke 2: back side */}
      <Num x={206} y={44} n={2} />
      <T x={220} y={48} s={11.5} c={C.text} w="600">back side, flat</T>
      <Blade x={300} y={176} ang={0} t={8} len={104} handle={34} face="backDown" hOff={6} />
      <Arrow a={[296, 150]} b={[216, 150]} />
      <T x={256} y={142} a="middle" s={10.5} c={C.brass}>draw</T>

      <T x={166} y={226} a="middle" s={11} c={C.text}>alternate sides · ≈20 passes refresh a safety-skiver blade</T>
      <T x={166} y={240} a="middle" s={10} c={C.faint}>the edge moves away from itself — never driven into the leather</T>

      {/* never edge-first */}
      <Panel x={350} y={30} w={118} h={218} c={C.ruby} />
      <Verdict x={452} y={46} ok={false} />
      <T x={360} y={50} s={11.5} c={C.ruby} w="600">Edge-first</T>
      <T x={360} y={66} s={10.5}>pushed into</T>
      <T x={360} y={80} s={10.5}>the strop</T>
      <rect x={356} y={198} width={106} height={9} rx="2" fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.8" />
      <rect x={360} y={176} width={98} height={22} rx="2" fill="#8a5a31" stroke="#3e2614" strokeWidth="0.8" />
      <rect x={360} y={176} width={98} height={22} rx="2" fill="rgba(120,160,90,0.18)" />
      <path d="M416 176 L432 184 L446 176 L440 170 Z" fill="#9c6a3a" stroke={C.ruby} strokeWidth="0.9" />
      <Blade x={432} y={184} ang={30} t={7} len={78} handle={0} face="backDown" />
      <Arrow a={[378, 118]} b={[432, 118]} c="ruby" w={1.8} />
      <T x={409} y={226} a="middle" s={10.5} c={C.ruby}>cuts the strop,</T>
      <T x={409} y={240} a="middle" s={10.5} c={C.ruby}>rounds the edge</T>

      {/* what it does to the edge */}
      <Sep x1={14} y1={256} x2={466} y2={256} />
      <Tag x={16} y={274}>What it does · edge ×12</Tag>
      <Blade x={170} y={312} ang={20} t={16} len={96} handle={0} />
      <path d="M170 312 q4 -1.4 5.5 -9 q0.6 -4 -1.6 -5" fill="none" stroke={C.ruby} strokeWidth="2" strokeLinecap="round" />
      <T x={182} y={300} s={10.5} c={C.ruby}>wire-edge</T>
      <T x={182} y={313} s={10} c={C.faint}>left by the stones</T>
      <Arrow a={[276, 304]} b={[308, 304]} w={1.6} />
      <Blade x={400} y={312} ang={20} t={16} len={96} handle={0} />
      <T x={410} y={300} s={10.5} c={C.emerald}>polished</T>
      <T x={410} y={313} s={10} c={C.faint}>burr gone</T>
    </Fig>
  )
}

/* t2-test — test on scrap of the same hide */
function TestCut() {
  const col = (ox, ok) => {
    const c = ok ? C.emerald : C.ruby
    const y0 = 84
    const edge = []
    for (let i = 0; i <= 24; i++) edge.push([ox + 96 + (ok ? 0 : jit(i * 5 + 3, 2.6)), y0 + (i * 52) / 24])
    const left = [[ox + 16, y0], ...edge, [ox + 16, y0 + 52]]
    const right = [[ox + 206, y0], ...edge.map(([x, y]) => [x + 10, y]).reverse(), [ox + 206, y0 + 52]]
    const sy = 246
    return (
      <g>
        <Panel x={ox} y={30} w={222} h={282} c={c} />
        <Verdict x={ox + 204} y={48} ok={ok} />
        <T x={ox + 12} y={52} s={12} c={c} w="600">{ok ? 'Sharp — ready' : 'Dull — back a grit'}</T>
        <Tag x={ox + 12} y={76}>slice test · plan</Tag>
        <polygon points={P(left)} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
        <polygon points={P([right[0], ...right.slice(1, -1).reverse(), right[right.length - 1]])} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
        {!ok &&
          edge.filter((_, i) => i % 2).map(([x, y], i) => (
            <path key={i} d={`M${x} ${y} l${-3 - (i % 3)} ${1.5} M${x + 10} ${y} l${3 + (i % 2) * 2} ${-1}`} stroke="#e3c08a" strokeWidth="0.8" />
          ))}
        <Lead p={[ox + 101, y0 + 40]} t={[ox + 111, y0 + 70]} text={ok ? 'clean, square slice — no drag' : 'torn, fuzzy fibres — it drags'} c={c} a="middle" />
        <Tag x={ox + 12} y={184}>skive test · section</Tag>
        <Slab x={ox + 10} y={sy + 16} w={202} h={8} kind="glass" />
        {ok ? (
          <g>
            <Prof pts={[[ox + 14, sy - 6], [ox + 104, sy - 6], [ox + 200, sy + 14], [ox + 200, sy + 16], [ox + 14, sy + 16]]} k="topF" />
            <path d={`M${ox + 104} ${sy - 6} q-16 -6 -22 -22 q-6 -16 8 -20 q14 -2 12 12`} fill="none" stroke="#d9b98a" strokeWidth="3" strokeLinecap="round" />
            <Blade x={ox + 106} y={sy - 6} ang={12} dir={1} t={6} len={50} handle={22} face="backDown" />
          </g>
        ) : (
          <g>
            <path
              d={`M${ox + 14} ${sy - 6} L${ox + 96} ${sy - 6} l4 3 l4 -4 l5 5 l3 -3 l5 6 l4 -2 l6 6 l5 -1 L${ox + 200} ${sy + 14} L${ox + 200} ${sy + 16} L${ox + 14} ${sy + 16} Z`}
              fill="url(#pp-topF)"
              stroke="#4a3018"
              strokeWidth="0.8"
            />
            {[[74, -26], [86, -34], [64, -16], [96, -20], [58, -30]].map(([dx, dy], i) => (
              <path key={i} d={`M${ox + dx} ${sy + dy} l5 -2 l2 3 l-5 2 Z`} fill="#d9b98a" stroke="#8a6a3e" strokeWidth="0.5" />
            ))}
            <Blade x={ox + 132} y={sy + 1} ang={12} dir={1} t={6} len={46} handle={20} face="backDown" round />
          </g>
        )}
        <Lead p={ok ? [ox + 87, sy - 36] : [ox + 90, sy - 32]} t={[ox + 126, 198]} text={ok ? 'one continuous,' : 'chatters into'} sub={ok ? 'thin, even shaving' : 'chips, or skates'} c={c} />
        <T x={ox + 111} y={sy + 42} a="middle" s={10.5}>{ok ? 'no chatter, no tearing' : 'if it tears or skates'}</T>
        <T x={ox + 111} y={sy + 56} a="middle" s={10} c={C.faint}>{ok ? 'go and cut the strap' : 'go back a grit, then strop'}</T>
      </g>
    )
  }
  return (
    <Fig h={320} view="Comparison · test on scrap" scale="same hide as the strap">
      <PrepDefs />
      {col(14, true)}
      {col(244, false)}
    </Fig>
  )
}

/* t2-maintain — strop at the start and every 5–10 cuts; cut away from the hand */
function Maintain() {
  const x0 = 40
  const step = 15.5
  const cuts = 24
  const strops = [0, 8, 15, 22]
  const X = (i) => x0 + 20 + i * step
  return (
    <Fig h={330} view="Chart · keeping the edge" scale="one session">
      <PrepDefs />
      <Tag x={16} y={40}>The rhythm</Tag>
      <line x1={x0} y1={92} x2={460} y2={92} stroke={C.struct} strokeWidth="1" />
      {Array.from({ length: cuts }, (_, i) => {
        const x = X(i) + 8
        const push = i === 13
        return <line key={i} x1={x} y1={84} x2={x} y2={100} stroke={push ? C.ruby : C.dim} strokeWidth={push ? 2 : 1.4} />
      })}
      {strops.map((i, k) => {
        const x = X(i) + (i ? 1 : -6)
        return (
          <g key={k}>
            <rect x={x - 5} y={74} width={10} height={36} rx="2" fill={k === 2 ? 'rgba(194,88,99,0.25)' : 'rgba(208,168,79,0.28)'} stroke={k === 2 ? C.ruby : C.brass} />
            <T x={x} y={124} a="middle" s={10} c={k === 2 ? C.ruby : C.brass} mono>S</T>
          </g>
        )
      })}
      <T x={X(0) - 6} y={66} a="middle" s={10.5} c={C.brass}>start</T>
      <Dim a={[X(0) + 2, 140]} b={[X(8) + 1, 140]} text="5–10 cuts" />
      <T x={X(13) + 8} y={66} a="middle" s={10.5} c={C.ruby}>pushing?</T>
      <Lead p={[X(15) + 1, 110]} t={[X(15) + 20, 148]} text="stop and strop now" c={C.ruby} />
      <Legend x={300} y={44} items={[[C.dim, 'a skiving cut'], [C.brass, 'strop']]} />

      {/* safety, plan view */}
      <Sep x1={14} y1={164} x2={466} y2={164} />
      <Tag x={16} y={184}>Cut away from the holding hand · plan</Tag>
      <Slab x={30} y={194} w={420} h={128} kind="glass" />
      <rect x={60} y={216} width={360} height={80} rx="3" fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="0.8" />
      <rect x={60} y={216} width={360} height={80} rx="3" fill="url(#sk-fibre)" />
      <rect x={250} y={240} width={170} height={30} fill="url(#sk-noglue)" stroke={C.ruby} strokeWidth="0.8" strokeDasharray="3 2" />
      <Fingers x={206} y={255} k={0.95} />
      <Knife kind="skive" x={246} y={255} ang={-145} k={0.6} />
      <Arrow a={[262, 255]} b={[408, 255]} w={2.2} />
      <T x={335} y={233} a="middle" s={10.5} c="#5a3a1a">cut travels away from the hand</T>
      <T x={335} y={312} a="middle" s={10.5} c={C.ruby}>blade path — no fingers ahead</T>
      <Lead p={[150, 236]} t={[60, 206]} text="holding hand, behind the blade" a="start" />
    </Fig>
  )
}

/* ================================================================== */
/* T3 — Cutting                                                         */
/* ================================================================== */

/* t3-layout — templates nested along the backbone, clear of flaws */
function Layout() {
  const TLo = { x: 70, y: 100, s: 1.7 }
  const TSh = { x: 70, y: 148, s: 1.7 }
  const hide = 'M14 50 L334 50 L334 246 Q300 262 262 270 Q214 282 160 284 Q90 288 14 300 Z'
  return (
    <Fig h={322} view="Plan · on the hide" scale="grain side up">
      <PrepDefs />
      <path d={hide} fill="url(#pp-hide)" stroke="#5c3c1d" strokeWidth="1" />
      {/* belly: loose grain */}
      <path d="M14 236 Q120 226 220 232 Q290 236 334 226 L334 246 Q300 262 262 270 Q214 282 160 284 Q90 288 14 300 Z" fill="url(#pp-loose)" />
      <path d="M14 236 Q120 226 220 232 Q290 236 334 226" fill="none" stroke={C.dim} strokeWidth="0.8" strokeDasharray="4 3" />
      <Break x={334} y1={52} y2={244} />
      {/* backbone */}
      <line x1={14} y1={50} x2={334} y2={50} stroke={C.steel} strokeWidth="1.6" strokeDasharray="12 3 2 3" />
      <T x={330} y={44} a="end" s={10.5} c={C.steel}>backbone line</T>
      <Arrow a={[40, 68]} b={[270, 68]} both w={1.4} />
      <T x={155} y={64} a="middle" s={10.5} c={C.brass}>strap length along the backbone</T>

      {/* templates */}
      <rect x={24} y={76} width={272} height={96} rx="8" fill="none" stroke={C.emerald} strokeWidth="1" strokeDasharray="4 3" />
      <Template T={TLo} o={LONG({ x0: -20 })} label="long piece" />
      <Template T={TSh} o={SHORT({ x0: -20, x1: 105 })} label="short piece" />
      <T x={30} y={188} s={10.5} c={C.emerald}>same area: colour and firmness match</T>

      {/* flaws */}
      <path d="M304 84 l6 8 l-4 6 l7 9 l-3 8 l6 10 l-2 9 l5 7" fill="none" stroke={C.ruby} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <T x={314} y={166} a="middle" s={10.5} c="#f3b6bc">scar</T>
      {[[274, 204], [282, 210], [267, 214], [288, 202], [278, 218], [295, 212]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill="#2a1a0c" stroke="#e3c08a" strokeWidth="0.5" />
      ))}
      <Lead p={[268, 212]} t={[256, 212]} text="bites" a="end" c="#f3b6bc" dot={false} />
      <T x={30} y={262} s={10.5} c="#f0dcc0">belly: loose grain, stretches — avoid</T>

      {/* raking light panel */}
      <Panel x={344} y={50} w={124} h={262} />
      <Tag x={354} y={68}>raking light</Tag>
      <Note x={354} y={86} lines={['a low lamp from', 'the side shows', 'what flat light hides']} s={10.5} lh={13} />
      <g>
        <path d="M352 178 L380 178 q4 -8 8 0 L404 178 q3 4 6 0 l4 -3 l4 3 L460 178 L460 196 L352 196 Z" fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
        {[[384, 172], [404, 175], [428, 173]].map(([x, y], i) => (
          <line key={i} x1={362} y1={150} x2={x} y2={y} stroke={C.brassHi} strokeWidth="1" strokeDasharray="3 2" opacity="0.85" />
        ))}
        <path d="M388 178 L402 178 L396 175 Z" fill="#1b120a" opacity="0.9" />
        <path d="M418 175 L436 178 L422 178 Z" fill="#1b120a" opacity="0.9" />
        <circle cx={358} cy={148} r="5" fill="rgba(233,200,119,0.4)" stroke={C.brassHi} />
        <T x={368} y={138} s={10} c={C.brassHi}>low lamp</T>
        <T x={406} y={214} a="middle" s={10} c={C.faint}>bumps throw shadows</T>
      </g>
      <Tag x={354} y={240}>avoid</Tag>
      <path d="M356 254 l4 5 l-3 4 l4 5" fill="none" stroke={C.ruby} strokeWidth="1.8" />
      <T x={372} y={264} s={10.5}>scars</T>
      {[[358, 280], [363, 284], [356, 286]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.6" fill="#2a1a0c" stroke="#e3c08a" strokeWidth="0.5" />
      ))}
      <T x={372} y={286} s={10.5}>insect bites</T>
      <rect x={354} y={296} width={12} height={8} fill="url(#pp-loose)" stroke={C.faint} strokeWidth="0.5" />
      <T x={372} y={304} s={10.5}>loose grain</T>
    </Fig>
  )
}

/* t3-scribe — awl upright, tight to the template edge */
function Scribe() {
  const sec = (ox, ok) => {
    const ex = ox + 80 // template edge
    const ys = 214 // leather surface
    const th = 14 // template (card) thickness, exaggerated
    const lean = ok ? 0 : -24
    const off = ok ? 1 : th * Math.tan(rad(24)) + 1
    const c = ok ? C.emerald : C.ruby
    return (
      <g>
        <Panel x={ox} y={30} w={150} h={268} c={c} />
        <Verdict x={ox + 134} y={46} ok={ok} />
        <T x={ox + 10} y={50} s={11.5} c={c} w="600">{ok ? 'Upright' : 'Leaning in'}</T>
        <Slab x={ox + 8} y={ys + 16} w={134} h={10} kind="board" />
        <Prof pts={[[ox + 8, ys], [ox + 142, ys], [ox + 142, ys + 16], [ox + 8, ys + 16]]} k="top" />
        <rect x={ox + 8} y={ys - th} width={ex - ox - 8} height={th} fill="#e8dec8" stroke="#8f7b5a" strokeWidth="0.8" />
        <path d={`M${ex + off - 2.5} ${ys} L${ex + off} ${ys + 3} L${ex + off + 2.5} ${ys} Z`} fill={C.hole} />
        <Awl kind="round" x={ex + off} y={ys} ang={lean} k={0.95} />
        <Callout cx={ok ? ox + 40 : ox + 110} cy={ok ? 104 : 98} r={ok ? 32 : 30} sx={ex + off / 2} sy={ys - 2} sr={7} label="corner ×6" ly={ok ? 150 : 142}>
          {(() => {
            const cx = ok ? ox + 40 : ox + 110
            const cy = ok ? 104 : 98
            const k = 6
            const g = ok ? 0 : off * k * 0.5
            const tipx = cx + g
            const L = 60
            const a = rad(lean)
            const top = [tipx + Math.sin(a) * L, cy + 8 - Math.cos(a) * L]
            const nx = Math.cos(a) * 5
            const ny = Math.sin(a) * 5
            return (
              <g>
                <rect x={cx - 60} y={cy + 8} width={120} height={40} fill="url(#sk-topS)" />
                <rect x={cx - 60} y={cy - 16} width={58 + (ok ? 0 : 0)} height={24} fill="#e8dec8" stroke="#8f7b5a" />
                <path d={`M${tipx - 5} ${cy + 8} L${tipx} ${cy + 15} L${tipx + 5} ${cy + 8} Z`} fill={C.hole} />
                <polygon points={P([[tipx, cy + 9], [top[0] - nx, top[1] - ny], [top[0] + nx, top[1] + ny]])} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.7" />
                {!ok && <line x1={cx - 2} y1={cy + 22} x2={tipx} y2={cy + 22} stroke={C.ruby} strokeWidth="1.4" />}
              </g>
            )
          })()}
        </Callout>
        <T x={ox + 75} y={ys + 46} a="middle" s={10.5} c={c}>{ok ? 'line sits on the edge' : 'point stands off the edge'}</T>
        <T x={ox + 75} y={ys + 60} a="middle" s={10} c={C.faint}>{ok ? 'blank is true to the card' : 'every piece grows'}</T>
        <T x={ox + 14} y={ys - 4} s={10} c="#5a4630">template</T>
      </g>
    )
  }
  return (
    <Fig h={306} view="Detail · section at the template edge" scale="card thickness ×6">
      <PrepDefs />
      {sec(14, true)}
      {sec(172, false)}
      {/* plan: tracing round the tip */}
      <Panel x={330} y={30} w={138} h={268} />
      <Tag x={340} y={50}>plan · tracing</Tag>
      <ClipBox x={331} y={60} w={136} h={200}>
        <rect x={331} y={60} width={136} height={200} fill="url(#pp-hide)" />
        <StrapPlan T={{ x: 330 - 88 * 3.2, y: 150, s: 3.2 }} o={LONG()} face="card" />
        <path d={pathOf(outline(LONG()), { x: 330 - 88 * 3.2, y: 150, s: 3.2 })} fill="#e8dec8" stroke="#8f7b5a" strokeWidth="1" />
      </ClipBox>
      {(() => {
        const Tt = { x: 330 - 88 * 3.2, y: 150, s: 3.2 }
        const pts = offset(outline(LONG()), -0.35).filter((p) => p[0] >= 88)
        const upper = pts.filter((p) => p[1] <= 0).sort((a, b) => a[0] - b[0])
        const lower = pts.filter((p) => p[1] > 0).sort((a, b) => b[0] - a[0]).slice(0, 8)
        const run = [...upper, ...lower]
        return (
          <g>
            <path d={pathOf(run, Tt, false)} fill="none" stroke="#fbe7c2" strokeWidth="1.3" />
            {(() => {
              const q = px(Tt, lower[lower.length - 1][0], lower[lower.length - 1][1])
              return (
                <g>
                  <circle cx={q[0]} cy={q[1]} r="6.5" fill="url(#sk-wood)" stroke="#3e2614" />
                  <circle cx={q[0]} cy={q[1]} r="1.6" fill={C.text} />
                  <Arrow d={`M${q[0] - 6} ${q[1] + 14} q-20 4 -40 0`} w={1.6} />
                </g>
              )
            })()}
          </g>
        )
      })()}
      <T x={399} y={274} a="middle" s={10.5} c={C.text}>upright awl, from above</T>
      <T x={399} y={288} a="middle" s={10} c={C.faint}>trace all the way round</T>
      <Lead p={px({ x: 330 - 88 * 3.2, y: 150, s: 3.2 }, 108, -widthAt(108, LONG()) / 2 - 0.4)} t={[456, 84]} text="scribed line" a="end" c="#fbe7c2" />
    </Fig>
  )
}

/* t3-rough — blank ~10 mm oversize: ~5 mm outside the scribed outline all round */
function Rough() {
  const Tr = { x: 104, y: 120, s: 2.6 }
  const o = LONG({ x0: -20 })
  const blank = offset(outline(o), -5)
  const yTop = px(Tr, 0, -15)[1]
  const yScr = (x) => Tr.y + (widthAt(x, o) / 2) * Tr.s
  return (
    <Fig h={330} view="Plan · rough cut" scale="to scale">
      <PrepDefs />
      <rect x={14} y={36} width={452} height={164} fill="url(#pp-hide)" opacity="0.55" />
      <path d={pathOf(blank, Tr)} fill="url(#sk-top)" stroke={C.ground} strokeWidth="3" />
      <path d={pathOf(blank, Tr)} fill="none" stroke="#5c3c1d" strokeWidth="0.8" />
      <path d={pathOf(outline(o), Tr)} fill="none" stroke="#fbe7c2" strokeWidth="1" strokeDasharray="2 1.6" />
      {/* rule on the keep side, knife on the line */}
      <Rule x={48} y={yTop} len={252} side="below" w={8} />
      <Knife kind="utility" x={232} y={yTop} ang={-40} k={0.62} />
      <Num x={256} y={48} n={1} />
      <T x={268} y={52} s={11} c={C.text}>straights first,</T>
      <T x={268} y={66} s={11} c={C.text}>against the rule</T>
      <Num x={372} y={48} n={2} />
      <T x={384} y={52} s={11} c={C.text}>then curves,</T>
      <T x={384} y={66} s={11} c={C.text}>freehand</T>
      <Arrow d={`M${px(Tr, 112, -15)[0]} ${px(Tr, 112, -15)[1] - 6} q30 6 36 40`} w={1.6} />
      <T x={24} y={50} s={10.5} c={C.text}>blank ≈10 mm oversize</T>
      {/* dims: 5 mm all round, 10 mm overall */}
      <Dim a={[200, yScr(37)]} b={[200, yScr(37) + 5 * Tr.s]} text="" />
      <T x={206} y={yScr(37) + 11} s={10.5} mono>≈5</T>
      <Dim a={[px(Tr, 120, 0)[0], 142]} b={[px(Tr, 125, 0)[0] + 1, 142]} text="" />
      <line x1={px(Tr, 120, 0)[0]} y1={122} x2={px(Tr, 120, 0)[0]} y2={146} stroke={C.dim} strokeWidth="0.6" opacity="0.7" />
      <T x={px(Tr, 122.5, 0)[0]} y={158} a="middle" s={10.5} mono>≈5</T>
      <Dim a={[28, Tr.y + 15 * Tr.s]} b={[28, Tr.y - 15 * Tr.s]} text="20 + 10" />
      <line x1={22} y1={Tr.y - 15 * Tr.s} x2={36} y2={Tr.y - 15 * Tr.s} stroke={C.dim} strokeWidth="0.6" opacity="0.7" />
      <line x1={22} y1={Tr.y + 15 * Tr.s} x2={36} y2={Tr.y + 15 * Tr.s} stroke={C.dim} strokeWidth="0.6" opacity="0.7" />
      <Lead p={[150, yScr(18)]} t={[170, 188]} text="scribed outline" a="start" c="#fbe7c2" />
      <Lead p={[100, 152]} t={[80, 188]} text="blank" a="end" />
      <T x={466} y={196} a="end" s={10} c={C.faint}>hide (waste)</T>

      {/* passes */}
      <Sep x1={14} y1={210} x2={466} y2={210} />
      <Tag x={16} y={226}>Section · blade vertical, several light passes</Tag>
      {[0, 1, 2].map((i) => {
        const x = 40 + i * 92
        const depth = [6, 12, 18][i]
        const y = 270
        return (
          <g key={i}>
            <Slab x={x - 26} y={y + 18} w={80} h={8} kind="board" />
            <Prof pts={[[x - 26, y], [x - 1.2, y], [x - 1.2, y + depth], [x + 1.2, y + depth], [x + 1.2, y], [x + 54, y], [x + 54, y + 18], [x - 26, y + 18]]} k="top" />
            <path d={`M${x - 1.5} ${y} L${x} ${y + depth} L${x + 1.5} ${y} L${x + 1.5} ${y - 18} L${x - 1.5} ${y - 18} Z`} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" />
            <rect x={x - 5} y={y - 32} width={10} height={16} rx="2" fill="#3d4a39" />
            <Num x={x + 28} y={y - 16} n={i + 1} r={7} />
            <T x={x + 14} y={y + 42} a="middle" s={10}>{['score', 'deeper', 'through'][i]}</T>
          </g>
        )
      })}
      <Note x={300} y={248} head="This blank is what you" hc={C.text} lines={['skive and glue. The true', 'outline is cut later,', 'through the laminate.']} s={10.5} lh={14} />
      <T x={300} y={318} s={10} c={C.faint}>light passes — never force it</T>
    </Fig>
  )
}

/* t3-transfer — fold, trim and slot points pricked through to the flesh */
function Transfer() {
  const o = SHORT({ x0: -20, x1: 105 })
  const Tr = { x: 250, y: 160, s: 1.82 }
  const blank = offset(outline(o), -5)
  const mark = (x, y) => {
    const [cx, cy] = px(Tr, x, y)
    return (
      <g key={`${x},${y}`}>
        <circle cx={cx} cy={cy} r="3.4" fill="none" stroke="#fbe7c2" strokeWidth="0.8" />
        <circle cx={cx} cy={cy} r="1.6" fill={C.hole} />
      </g>
    )
  }
  const X = (x) => px(Tr, x, 0)[0]
  const Y = (y) => Tr.y + y * Tr.s
  return (
    <Fig h={300} view="Section + plan · transfer the marks" scale="short piece">
      <PrepDefs />
      {/* 1: prick through */}
      <Num x={24} y={44} n={1} />
      <T x={38} y={48} s={11.5} c={C.text} w="600">Prick through</T>
      <Slab x={18} y={232} w={156} h={14} kind="pad" />
      <Prof pts={[[24, 212], [168, 212], [168, 230], [24, 230]]} k="top" />
      <rect x={24} y={204} width={144} height={8} fill="#e8dec8" stroke="#8f7b5a" strokeWidth="0.8" />
      <rect x={93} y={203} width={4} height={10} fill={C.ground} />
      <Awl kind="round" x={95} y={234} k={1.05} />
      <Lead p={[56, 207]} t={[30, 182]} text="template" a="start" />
      <Lead p={[40, 220]} t={[40, 262]} text="blank, grain up" a="start" />
      <Lead p={[95, 231]} t={[118, 278]} text="the point shows on the flesh" a="start" c={C.brassHi} />
      <Lead p={[96, 150]} t={[122, 146]} text="awl through" sub="the template" a="start" />
      <Arrow d="M172 120 q20 -26 50 -14" w={1.8} />
      <T x={192} y={96} a="middle" s={10.5} c={C.brass}>turn over</T>

      {/* 2: flesh side up */}
      <Num x={244} y={44} n={2} />
      <T x={258} y={48} s={11.5} c={C.text} w="600">Flesh side up: the marks</T>
      <path d={pathOf(blank, Tr)} fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="0.9" />
      <path d={pathOf(blank, Tr)} fill="url(#sk-fibre)" />
      {/* light pencil joins */}
      <g stroke="#6b4b2a" strokeWidth="0.9" strokeDasharray="3 2">
        <line x1={X(0)} y1={Y(-10)} x2={X(0)} y2={Y(10)} />
        <line x1={X(80)} y1={Y(-9)} x2={X(80)} y2={Y(9)} />
        <line x1={X(75)} y1={Y(0)} x2={X(85)} y2={Y(0)} />
      </g>
      {[[0, -10], [0, 10], [80, -9], [80, 9], [75, 0], [85, 0], [-20, -10], [-20, 10], [105, -9], [105, 9]].map(([x, y]) => mark(x, y))}
      <Lead p={[X(0), Y(-10)]} t={[X(0), 92]} text="lug fold" a="middle" />
      <Lead p={[X(80), Y(-9)]} t={[X(80) - 10, 92]} text="buckle fold" a="middle" />
      <Lead p={[X(85), Y(0)]} t={[X(92) + 8, 226]} text="slot ends" a="middle" />
      <Lead p={[X(-20), Y(10)]} t={[X(-20) + 6, 226]} text="flap end" sub="trim mark" a="middle" />
      <Lead p={[X(105), Y(9)]} t={[452, 112]} text="flap end" a="end" />
      <T x={360} y={262} a="middle" s={10.5}>join the pricks with a light line — this is</T>
      <T x={360} y={276} a="middle" s={10.5}>the side you skive and glue</T>
    </Fig>
  )
}

/* t3-lining — lining blank ≥20 mm wider than the template */
function LiningWide() {
  const Tr = { x: 54, y: 118, s: 2.1 }
  const L0 = -6
  const L1 = 128
  const hw = 20.5 // half width of the lining blank, mm: 10 each side, and a little
  const [lx1, ly1] = px(Tr, L0, -hw)
  const [lx2, ly2] = px(Tr, L1, hw)
  return (
    <Fig h={330} view="Plan + section · the lining blank" scale="plan to scale">
      <PrepDefs />
      <rect x={lx1} y={ly1} width={lx2 - lx1} height={ly2 - ly1} rx="2" fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="1" />
      <path d={pathOf(offset(outline(LONG()), -5), Tr)} fill="none" stroke="#a8763f" strokeWidth="1.4" strokeDasharray="7 3" />
      <path d={pathOf(outline(LONG()), Tr)} fill="rgba(232,222,200,0.35)" stroke="#6b5636" strokeWidth="1.1" strokeDasharray="5 3" />
      <T x={px(Tr, 60, 0)[0]} y={Tr.y + 4} a="middle" s={10.5} c="#5a4630">template (outline)</T>
      <Dim a={[lx1, ly2]} b={[lx1, ly1]} off={-12} flip text="≥ 40" />
      <Dim a={[px(Tr, 104, 0)[0], Tr.y + 9.2 * Tr.s]} b={[px(Tr, 104, 0)[0], Tr.y - 9.2 * Tr.s]} off={0} text="" c="#5a4630" />
      <T x={px(Tr, 104, 0)[0] + 6} y={Tr.y + 18} s={10.5} c="#5a4630" mono>18</T>
      <Dim a={[px(Tr, 8, 0)[0], Tr.y + 10 * Tr.s]} b={[px(Tr, 8, 0)[0], Tr.y - 10 * Tr.s]} off={0} text="" c="#5a4630" />
      <T x={px(Tr, 8, 0)[0] + 6} y={Tr.y + 18} s={10.5} c="#5a4630" mono>20</T>
      <Lead p={[150, ly1 + 3]} t={[150, 44]} text="lining blank — at least 20 mm wider than the template" sub="about 10 mm each side: wider than the top blank" a="start" />
      <g>
        <rect x={40} y={174} width={16} height={9} rx="1.5" fill="url(#sk-lin)" stroke={C.liningEdge} />
        <T x={62} y={182} s={10.5}>lining blank, 10 mm each side</T>
        <line x1={224} y1={178} x2={244} y2={178} stroke="#a8763f" strokeWidth="1.4" strokeDasharray="7 3" />
        <T x={250} y={182} s={10.5}>top blank, 5 mm</T>
        <line x1={346} y1={178} x2={366} y2={178} stroke="#6b5636" strokeWidth="1.1" strokeDasharray="5 3" />
        <T x={372} y={182} s={10.5}>template</T>
      </g>

      {/* section across the width */}
      <Sep x1={14} y1={196} x2={466} y2={196} />
      <Tag x={16} y={214}>Section across the width · thickness ×3</Tag>
      {(() => {
        const s = 3.2
        const cx = 196
        const yT = 262
        const tT = 11
        const tL = 7
        const top = 30 * s
        const lin = 40 * s
        const tpl = 20 * s
        return (
          <g>
            <Prof pts={[[cx - top / 2, yT], [cx + top / 2, yT], [cx + top / 2, yT + tT], [cx - top / 2, yT + tT]]} k="top" />
            <Prof pts={[[cx - lin / 2, yT + tT], [cx + lin / 2, yT + tT], [cx + lin / 2, yT + tT + tL], [cx - lin / 2, yT + tT + tL]]} k="lining" />
            <GlueLine x1={cx - top / 2 + 2} x2={cx + top / 2 - 2} y={yT + tT} />
            {[cx - tpl / 2, cx + tpl / 2].map((x, i) => (
              <line key={i} x1={x} y1={yT - 18} x2={x} y2={yT + tT + tL + 12} stroke={C.ruby} strokeWidth="1.2" strokeDasharray="4 3" />
            ))}
            <Dim a={[cx - tpl / 2, yT - 12]} b={[cx + tpl / 2, yT - 12]} text="20" />
            <Dim a={[cx - top / 2, yT - 30]} b={[cx + top / 2, yT - 30]} text="20 + 10" />
            <line x1={cx - top / 2} y1={yT - 34} x2={cx - top / 2} y2={yT - 2} stroke={C.dim} strokeWidth="0.6" opacity="0.6" />
            <line x1={cx + top / 2} y1={yT - 34} x2={cx + top / 2} y2={yT - 2} stroke={C.dim} strokeWidth="0.6" opacity="0.6" />
            <Dim a={[cx - lin / 2, yT + tT + tL + 12]} b={[cx + lin / 2, yT + tT + tL + 12]} text="≥ 20 + 20" flip />
            <line x1={cx - lin / 2} y1={yT + tT + tL + 2} x2={cx - lin / 2} y2={yT + tT + tL + 16} stroke={C.dim} strokeWidth="0.6" opacity="0.6" />
            <line x1={cx + lin / 2} y1={yT + tT + tL + 2} x2={cx + lin / 2} y2={yT + tT + tL + 16} stroke={C.dim} strokeWidth="0.6" opacity="0.6" />
            <Lead p={[cx - top / 2 + 8, yT + 5]} t={[cx - lin / 2 - 14, yT - 2]} text="top blank" sub="5 mm each side" a="end" />
            <Lead p={[cx - lin / 2 + 6, yT + tT + 4]} t={[cx - lin / 2 - 14, yT + tT + 24]} text="lining" sub="10 mm each side" a="end" />
            <Lead p={[cx + tpl / 2, yT - 4]} t={[cx + top / 2 + 12, yT - 10]} text="final cut" a="start" c={C.ruby} s={10.5} />
          </g>
        )
      })()}
      <Note x={340} y={240} head="Wider than the top" hc={C.text} lines={['so it can never fall short;', 'the final cut trims lining', 'and top together, exactly']} s={10.5} lh={14} />
    </Fig>
  )
}

/* t3-final — card template cemented on; one vertical cut through all layers */
function FinalCut() {
  const s = 5
  const y0 = 226
  const tT = 17
  const tR = 2
  const tL = 11
  const yR = y0 + tT
  const yL = yR + tR
  const yB = yL + tL
  const cl = 136
  const cr = cl + 20 * s
  const oT = 5 * s // top blank: 5 mm over each side
  const oL = 10 * s // lining blank: 10 mm over each side
  const L = cl - oL
  const dx = -10 // the left offcut, already cut free
  // a stack from x1 to x2; `lo`/`ro` = extra lining beyond the top on each side
  const stack = (x1, x2, lo = 0, ro = 0) => (
    <g>
      <Prof pts={[[x1, y0], [x2, y0], [x2, yR], [x1, yR]]} k="top" />
      <rect x={x1} y={yR} width={x2 - x1} height={tR} fill={C.velodon} />
      <Prof pts={[[x1 - lo, yL], [x2 + ro, yL], [x2 + ro, yB], [x1 - lo, yB]]} k="lining" />
      <GlueLine x1={x1 + 2} x2={x2 - 2} y={yL} />
    </g>
  )
  const tip = yL + 5
  return (
    <Fig h={340} view="Section across the width · final cut" scale="thickness ×3">
      <PrepDefs />
      <Tag x={16} y={40}>after gluing and curing</Tag>
      <T x={16} y={56} s={10} c={C.faint}>top blank 5 mm over each side, lining 10 mm</T>
      <Slab x={70} y={yB} w={234} h={12} kind="board" />
      {stack(cl - oT + dx, cl + dx, oL - oT, 0)}
      {stack(cl, cr + oT, 0, oL - oT)}
      {/* card template + rubber cement */}
      <rect x={cl} y={y0 - 6} width={cr - cl} height={6} fill="#e8dec8" stroke="#8f7b5a" strokeWidth="0.8" />
      {[cl + 20, cl + 50, cl + 80].map((x) => (
        <ellipse key={x} cx={x} cy={y0 - 1} rx="7" ry="1.6" fill="rgba(140,192,149,0.7)" stroke={C.emerald} strokeWidth="0.6" />
      ))}
      {/* kerf + blade (edge-on) */}
      <rect x={cr - 0.8} y={y0 - 6} width={1.6} height={tip - y0 + 6} fill={C.ground} />
      <line x1={cr} y1={tip} x2={cr} y2={yB} stroke={C.brass} strokeWidth="1" strokeDasharray="2 2" />
      <path d={`M${cr} ${tip} L${cr - 1.8} ${tip - 22} L${cr - 1.8} ${y0 - 46} L${cr + 1.8} ${y0 - 46} L${cr + 1.8} ${tip - 22} Z`} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.6" />
      <rect x={cr - 6} y={y0 - 106} width={12} height={62} rx="3" fill="#3d4a39" stroke="#1d241b" strokeWidth="0.8" />
      <path d={`M${cr} ${y0 - 9} h9 v9`} fill="none" stroke={C.brass} strokeWidth="1" />
      <T x={cr + 13} y={y0 - 12} s={10.5} c={C.brass} mono>90°</T>
      <Arrow a={[cr + 22, y0 - 96]} b={[cr + 22, y0 - 60]} w={1.6} />
      <T x={cr + 30} y={y0 - 80} s={10.5} c={C.brass}>light passes</T>

      {/* labels */}
      <Lead p={[cl + 22, y0 - 4]} t={[148, 186]} text="card template" sub="cemented on" a="start" />
      <Lead p={[cl - oT + dx + 6, y0 + 8]} t={[64, y0 + 2]} text="top" a="end" />
      <Lead p={[cl - oT + dx + 6, yR + 1]} t={[64, y0 + 20]} text="reinf." a="end" />
      <Lead p={[L + dx + 8, yL + 6]} t={[64, y0 + 38]} text="lining" a="end" />
      {/* overhang beyond the final line, each side */}
      <line x1={cr + oT} y1={yR + 2} x2={cr + oT} y2={yB + 36} stroke={C.dim} strokeWidth="0.6" strokeDasharray="2 2" />
      <line x1={cr + oL} y1={yB + 2} x2={cr + oL} y2={yB + 24} stroke={C.dim} strokeWidth="0.6" strokeDasharray="2 2" />
      <Dim a={[cr, yB + 20]} b={[cr + oL, yB + 20]} text="" />
      <T x={cr + oL + 4} y={yB + 24} s={10} mono>10</T>
      <Dim a={[cr, yB + 32]} b={[cr + oT, yB + 32]} text="" />
      <T x={cr + oT + 4} y={yB + 36} s={10} mono>5</T>
      <Lead p={[cr - 1, tip]} t={[170, yB + 52]} text="pass 2 of 3 — never force it" a="middle" />
      <T x={cl + dx - 22} y={yB + 24} a="middle" s={10} c={C.faint}>offcut</T>

      <Callout cx={70} cy={112} r={42} sx={cl} sy={y0 + 15} sr={9} label="one shared edge" lc={C.emerald} ly={170}>
        <Prof pts={[[70, 74], [130, 74], [130, 110], [70, 110]]} k="top" />
        <rect x={70} y={110} width={60} height={4} fill={C.velodon} />
        <Prof pts={[[70, 114], [130, 114], [130, 140], [70, 140]]} k="lining" />
        <line x1={70} y1={66} x2={70} y2={156} stroke={C.emerald} strokeWidth="1.2" strokeDasharray="4 3" />
      </Callout>

      {/* if the blade leans */}
      <Panel x={318} y={30} w={150} h={146} c={C.ruby} />
      <Verdict x={452} y={46} ok={false} />
      <T x={328} y={50} s={11.5} c={C.ruby} w="600">Blade leaning</T>
      <T x={328} y={64} s={10} c={C.faint}>even a few degrees</T>
      <Prof pts={[[330, 104], [414, 104], [418, 120], [330, 120]]} k="top" />
      <rect x={330} y={120} width={88} height={2} fill={C.velodon} />
      <Prof pts={[[330, 122], [418.5, 122], [421, 133], [330, 133]]} k="lining" />
      <line x1={408} y1={78} x2={423} y2={140} stroke="url(#sk-steelH)" strokeWidth="2.4" />
      <line x1={414} y1={104} x2={414} y2={148} stroke={C.ruby} strokeWidth="0.8" strokeDasharray="2 2" />
      <Lead p={[420, 130]} t={[452, 152]} text="lining proud" a="end" c={C.ruby} />
      <T x={330} y={168} s={10} c={C.faint}>(top proud on the far side)</T>

      <Panel x={318} y={186} w={150} h={140} c={C.emerald} />
      <Verdict x={452} y={202} ok />
      <T x={328} y={206} s={11.5} c={C.emerald} w="600">Dead vertical</T>
      <T x={328} y={220} s={10} c={C.faint}>sight down the blade</T>
      <T x={328} y={232} s={10} c={C.faint}>before each pass</T>
      <Prof pts={[[330, 262], [416, 262], [416, 278], [330, 278]]} k="top" />
      <rect x={330} y={278} width={86} height={2} fill={C.velodon} />
      <Prof pts={[[330, 280], [416, 280], [416, 291], [330, 291]]} k="lining" />
      <line x1={416} y1={244} x2={416} y2={300} stroke="url(#sk-steelH)" strokeWidth="2.4" />
      <T x={392} y={316} a="middle" s={10.5} c={C.emerald}>top and lining flush</T>
    </Fig>
  )
}

/* t3-check — calipers at the lug and buckle ends; tip symmetry */
function CheckCut() {
  const unit = (y, wmm, reading, n, title, note) => {
    const x1 = 46
    const x2 = x1 + wmm * 4
    return (
      <g>
        <Num x={24} y={y - 54} n={n} r={7} />
        <T x={36} y={y - 50} s={11} c={C.text} w="600">{title}</T>
        <XSec cx={(x1 + x2) / 2} y={y} w={x2 - x1} layers={[{ k: 'top', t: 8 }, { k: 'lining', t: 5 }]} />
        <Calipers x1={x1} x2={x2} y={y + 6} reading={reading} />
        <T x={(x1 + x2) / 2} y={y + 30} a="middle" s={10.5} c={C.emerald}>{note}</T>
      </g>
    )
  }
  const Tt = { x: 300 - 88 * 4.2, y: 128, s: 4.2 }
  const o = LONG({ x0: 88 })
  const pts = outline(o)
  const upper = pts.filter((p) => p[1] <= 0)
  const mirror = upper.map(([x, y]) => [x, -y])
  // a lopsided tip for the fail case
  const Tb = { x: 300 - 96 * 3.4, y: 266, s: 3.4 }
  const oa = LONG({ x0: 96 })
  const ob = LONG({ x0: 96, tipLen: 21 })
  const up = outline(oa).filter((p) => p[1] <= 0)
  const lo = outline(ob).filter((p) => p[1] > 0)
  return (
    <Fig h={330} view="Check · width and symmetry" scale="calipers read to 0.1 mm">
      <PrepDefs />
      {unit(100, 20, '20.0', 1, 'Lug end', '= lug gap, ≤ 0.2 under')}
      {unit(210, 18, '18.0', 2, 'Buckle end', '= the buckle’s inside width')}
      {/* where */}
      <Sep x1={14} y1={254} x2={276} y2={254} />
      <StrapPlan T={{ x: 60, y: 292, s: 1.7 }} o={SHORT()} />
      {[[0, '1'], [80, '2']].map(([x, n]) => (
        <g key={n}>
          <line x1={60 + x * 1.7} y1={270} x2={60 + x * 1.7} y2={314} stroke={C.brass} strokeWidth="1.2" strokeDasharray="3 2" />
          <Num x={60 + x * 1.7 + (x ? 12 : -12)} y={318} n={n} r={6.5} />
        </g>
      ))}
      <T x={128} y={268} a="middle" s={10} c={C.faint}>short piece: where to measure</T>

      {/* tip symmetry */}
      <Sep x1={286} y1={30} x2={286} y2={320} />
      <Tag x={296} y={44}>Tip symmetry</Tag>
      <path d={pathOf(pts, Tt)} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.9" />
      <path d={pathOf([...mirror, [88, 0]], Tt)} fill="rgba(245,240,226,0.22)" stroke="none" />
      <path d={pathOf(mirror, Tt, false)} fill="none" stroke={C.brassHi} strokeWidth="1.3" strokeDasharray="4 2.5" />
      <Break x={300} y1={Tt.y - 38} y2={Tt.y + 38} />
      <line x1={296} y1={Tt.y} x2={460} y2={Tt.y} stroke={C.steel} strokeWidth="1" strokeDasharray="10 3 2 3" />
      <Arrow d={`M${px(Tt, 106, 0)[0]} ${Tt.y - 30} q26 30 0 60`} w={1.6} />
      <Lead p={[452, Tt.y]} t={[462, Tt.y + 30]} text="centreline" a="end" c={C.steel} s={10.5} />
      <T x={330} y={Tt.y + 26} s={10} c="#5a3a1a">paper copy</T>
      <Note x={296} y={194} lines={['fold a paper copy on the', 'centreline: the halves', 'must coincide']} s={10.5} lh={14} />
      <Verdict x={452} y={60} ok />
      <path d={pathOf([...up, ...lo.reverse().reverse()], Tb)} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.9" />
      <path d={pathOf(up.map(([x, y]) => [x, -y]), Tb, false)} fill="none" stroke={C.ruby} strokeWidth="1.2" strokeDasharray="4 2.5" />
      <line x1={296} y1={Tb.y} x2={420} y2={Tb.y} stroke={C.steel} strokeWidth="0.8" strokeDasharray="10 3 2 3" />
      <Break x={300} y1={Tb.y - 32} y2={Tb.y + 32} />
      <Verdict x={452} y={252} ok={false} />
      <T x={296} y={318} s={10.5} c={C.ruby}>lopsided — halves miss: re-cut</T>
    </Fig>
  )
}

/* t3-trimafter — stitched oversize, then trimmed */
function TrimAfter() {
  const yc = 122
  const k = 4
  const fin = 10 * k
  const blk = 12 * k
  const st = 7 * k
  const xa = 30
  const xm = 236
  const xb = 452
  const stitches = (y) =>
    Array.from({ length: 34 }, (_, i) => {
      const x = xa + 6 + i * 12
      return <line key={i} x1={x} y1={y + 2} x2={x + 8} y2={y - 2} stroke={C.thread} strokeWidth="1.5" strokeLinecap="round" />
    })
  return (
    <Fig h={340} view="Variant · trim after stitching" scale="plan ×4 · schematic">
      <PrepDefs />
      <Tag x={16} y={40}>Plan · 2 mm oversize</Tag>
      {/* untrimmed right part, trimmed left part */}
      <rect x={xm} y={yc - blk} width={xb - xm} height={blk * 2} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <rect x={xa} y={yc - fin} width={xm - xa} height={fin * 2} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <line x1={xa} y1={yc - fin} x2={xm} y2={yc - fin} stroke="#e0b277" strokeWidth="1.2" />
      <line x1={xa} y1={yc + fin} x2={xm} y2={yc + fin} stroke="#e0b277" strokeWidth="1.2" />
      {/* offcuts peeling away */}
      <path d={`M${xa + 20} ${yc - blk - 12} L${xm} ${yc - blk - 4} L${xm} ${yc - fin - 4} L${xa + 20} ${yc - fin - 12} Q${xa} ${yc - fin - 14} ${xa + 4} ${yc - blk - 18} Z`} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.7" opacity="0.85" />
      <path d={`M${xa + 20} ${yc + blk + 12} L${xm} ${yc + blk + 4} L${xm} ${yc + fin + 4} L${xa + 20} ${yc + fin + 12} Q${xa} ${yc + fin + 14} ${xa + 4} ${yc + blk + 18} Z`} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.7" opacity="0.85" />
      {[yc - fin, yc + fin].map((y) => (
        <line key={y} x1={xm} y1={y} x2={xb} y2={y} stroke={C.brassHi} strokeWidth="1.2" strokeDasharray="5 3" />
      ))}
      {stitches(yc - fin + 12)}
      {stitches(yc + fin - 12)}
      <Break x={xa} y1={yc - fin} y2={yc + fin} />
      <Break x={xb} y1={yc - blk} y2={yc + blk} />
      <Knife kind="utility" x={xm + 6} y={yc - fin} ang={-42} k={0.6} />
      <Dim a={[418, yc + fin]} b={[418, yc + blk]} text="" />
      <T x={424} y={yc + fin + 7} s={10.5} mono>2</T>
      <Dim a={[388, yc + fin - 12]} b={[388, yc + fin]} text="" />
      <T x={394} y={yc + fin - 3} s={10.5} mono>3</T>
      <Lead p={[330, yc - fin]} t={[352, 52]} text="final line" a="start" c={C.brassHi} />
      <Lead p={[120, yc - blk - 10]} t={[100, 58]} text="offcut" a="end" />
      <Lead p={[150, yc + fin - 12]} t={[150, yc + blk + 34]} text="already stitched" a="middle" />
      <T x={340} y={yc + blk + 26} a="middle" s={10.5}>trim along the line, after sewing</T>

      {/* variant: wide blank */}
      <Sep x1={14} y1={210} x2={466} y2={210} />
      <Tag x={16} y={228}>or · wide blank, stitch 6–7 mm in</Tag>
      <rect x={30} y={240} width={196} height={66} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <line x1={30} y1={240 + 3.5 * 4} x2={226} y2={240 + 3.5 * 4} stroke={C.brassHi} strokeWidth="1.2" strokeDasharray="5 3" />
      {Array.from({ length: 15 }, (_, i) => (
        <line key={i} x1={36 + i * 12} y1={240 + 26 + 2} x2={44 + i * 12} y2={240 + 26 - 2} stroke={C.thread} strokeWidth="1.5" strokeLinecap="round" />
      ))}
      <Break x={226} y1={240} y2={306} />
      <Dim a={[218, 240]} b={[218, 266]} text="" />
      <T x={236} y={258} s={10.5} mono>6–7</T>
      <T x={128} y={292} a="middle" s={10} c="#f0dcc0">blank edge at top · final line dashed</T>

      {/* why: padded */}
      <Panel x={268} y={214} w={200} h={108} />
      <Tag x={278} y={232}>suits padded straps</Tag>
      <path d="M290 282 q4 -8 14 -10 L322 270 Q368 238 414 270 L432 272 q10 2 14 10 L446 284 L290 284 Z" fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <path d="M326 272 Q368 246 410 272 Z" fill="url(#sk-fill)" />
      <rect x={290} y={284} width={156} height={6} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.6" />
      {[300, 436].map((x) => (
        <line key={x} x1={x} y1={258} x2={x} y2={298} stroke={C.ruby} strokeWidth="1.1" strokeDasharray="3 2" />
      ))}
      <T x={368} y={312} a="middle" s={10} c={C.faint}>flanges won’t lie flat to pre-cut</T>
      <T x={240} y={332} a="middle" s={10.5} c={C.text}>Course default: trim after gluing, before stitching.</T>
    </Fig>
  )
}

/* t3-laser — laser-cut blank: lift the char or keep it dark */
function Laser() {
  return (
    <Fig h={340} view="Variant · laser-cut blanks" scale="schematic">
      <PrepDefs />
      {/* the cut */}
      <Tag x={16} y={40}>the cut · section</Tag>
      <rect x={24} y={140} width={232} height={10} fill="#3a3530" stroke="#1d1a17" />
      {Array.from({ length: 23 }, (_, i) => (
        <line key={i} x1={28 + i * 10} y1={140} x2={28 + i * 10} y2={150} stroke="#6b645c" strokeWidth="0.8" />
      ))}
      <Prof pts={[[30, 122], [136, 122], [136, 140], [30, 140]]} k="top" />
      <Prof pts={[[142, 122], [250, 122], [250, 140], [142, 140]]} k="top" />
      <rect x={133.5} y={122} width={3} height={18} fill="#1d120a" />
      <rect x={142} y={122} width={3} height={18} fill="#1d120a" />
      <rect x={124} y={56} width={34} height={26} rx="3" fill="url(#sk-steel)" stroke="#3b4850" />
      <path d="M132 82 L150 82 L144 96 L138 96 Z" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.7" />
      <line x1={141} y1={96} x2={139.5} y2={138} stroke="rgba(255,140,80,0.35)" strokeWidth="6" />
      <line x1={141} y1={96} x2={139.5} y2={138} stroke="#ff9a5c" strokeWidth="1.6" />
      <Lead p={[126, 66]} t={[110, 56]} text="laser head" a="end" />
      <Lead p={[134, 132]} t={[100, 172]} text="charred cut faces" a="end" c={C.ruby} />
      <T x={140} y={186} a="middle" s={10} c={C.faint}>honeycomb bed</T>
      {/* fumes */}
      <path d="M140 118 q-8 -10 4 -18 q12 -8 2 -20 M146 116 q10 -6 14 -18 q4 -12 18 -16" fill="none" stroke="#9a9086" strokeWidth="1.4" strokeDasharray="3 2" />
      <path d="M196 58 L246 58 L238 76 L204 76 Z" fill="#3a3f44" stroke="#22262a" />
      <rect x={212} y={34} width={18} height={24} fill="#3a3f44" stroke="#22262a" />
      <Arrow d="M180 82 q16 -4 24 -2" c="ruby" w={1.4} />
      <T x={228} y={94} a="middle" s={10.5} c={C.ruby}>fume extraction</T>
      <T x={228} y={107} a="middle" s={10} c={C.ruby}>— required</T>

      {/* magnified edge */}
      <Callout cx={380} cy={120} r={58} sx={136} sy={128} sr={9} label="cut edge ×15" ly={192}>
        <rect x={302} y={90} width={78} height={60} fill="url(#sk-topS)" />
        <rect x={372} y={90} width={8} height={60} fill="#1d120a" />
        <rect x={366} y={90} width={6} height={60} fill="#4a2c14" opacity="0.8" />
        <rect x={346} y={88} width={34} height={4} fill="#2a1a0c" opacity="0.7" />
      </Callout>
      <Lead p={[377, 128]} t={[444, 120]} text="char" sub="layer" a="start" c={C.ruby} />
      <Lead p={[354, 90]} t={[296, 62]} text="soot on the grain" a="middle" />

      {/* two options */}
      <Sep x1={14} y1={208} x2={466} y2={208} />
      <Panel x={14} y={216} w={290} h={104} c={C.emerald} />
      <T x={24} y={234} s={11.5} c={C.emerald} w="600">Lift the char</T>
      <Num x={34} y={256} n={1} r={7} />
      <T x={46} y={260} s={10.5}>dampen the edge</T>
      <Num x={34} y={276} n={2} r={7} />
      <T x={46} y={280} s={10.5}>rub it on paper</T>
      <rect x={140} y={292} width={150} height={8} fill="#f3eee2" stroke="#b9b09c" strokeWidth="0.6" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${158 + i * 30} ${296} q8 -1.5 18 0`} stroke="rgba(60,35,15,0.55)" strokeWidth="2" fill="none" />
      ))}
      <rect x={176} y={252} width={80} height={40} rx="2" fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="0.8" />
      <rect x={176} y={288} width={80} height={4} fill="#c7a271" />
      <Arrow a={[170, 244]} b={[262, 244]} both w={1.5} />
      <T x={216} y={314} a="middle" s={10} c={C.faint}>char comes off on the paper</T>
      <T x={46} y={304} s={10} c={C.faint}>→ a clean, tan edge</T>
      <rect x={136} y={250} width={26} height={16} rx="4" fill="url(#pp-sponge)" stroke="#8a7438" strokeWidth="0.7" />
      <path d="M142 270 q1 3 0 5 M152 270 q1 3 0 5" stroke="#8fb2c9" strokeWidth="1.4" fill="none" />

      <Panel x={312} y={216} w={156} h={104} />
      <T x={322} y={234} s={11.5} c={C.text} w="600">Or keep it dark</T>
      <XSec cx={390} y={256} w={110} layers={[{ k: 'top', t: 11 }, { k: 'lining', t: 7 }]} />
      <rect x={335} y={256} width={4} height={18} fill="#1d120a" />
      <rect x={441} y={256} width={4} height={18} fill="#1d120a" />
      <T x={390} y={292} a="middle" s={10.5}>a deliberate dark edge</T>
      <T x={390} y={306} a="middle" s={10} c={C.faint}>skive, glue, final cut as normal</T>
      <T x={240} y={334} a="middle" s={10} c={C.faint}>the burnt smell fades in a couple of days</T>
    </Fig>
  )
}

/* ================================================================== */
/* T4 — Skiving                                                         */
/* ================================================================== */

// A flesh-up flap skive in section: body full thickness from x0 to xs,
// tapering to `end` px at x1. Returns a polygon (top = flesh surface).
function skivePts(x0, xs, x1, yb, t, end = 1, fold) {
  // yb = bottom (grain on the plate); profile half thick at `fold`
  const top = []
  const N = 30
  for (let i = 0; i <= N; i++) {
    const x = xs + ((x1 - xs) * i) / N
    let r
    if (fold != null && x <= fold) r = t - (t / 2) * ((x - xs) / (fold - xs)) ** 0.9
    else if (fold != null) {
      const u = (x - fold) / (x1 - fold)
      r = t / 2 - (t / 2 - end) * (u < 0.7 ? u * 0.25 : 0.175 + ((u - 0.7) / 0.3) ** 1.4 * 0.825)
    } else r = t - (t - end) * ((x - xs) / (x1 - xs))
    top.push([x, yb - r])
  }
  return [[x0, yb - t], ...top, [x1, yb], [x0, yb]]
}

/* t4-scribe — the skive boundary on the flesh side */
function SkiveScribe() {
  const A = { x: 118, y: 108, s: 4.2 }
  const o = LONG({ x0: -20 })
  const X = (x) => A.x + x * A.s
  const sl = 6 // skive line, mm behind the fold (illustrative)
  return (
    <Fig h={340} view="Plan · flesh side up" scale="plan ×4">
      <PrepDefs />
      <Tag x={16} y={36}>Lined strap · lug flap</Tag>
      <ClipBox x={20} y={60} w={270} h={100}>
        <StrapPlan T={A} o={o} face="flesh" zones={[{ from: -20, to: sl, k: 'skiveL' }]} folds={[{ x: 0 }]} />
      </ClipBox>
      <Break x={290} y1={A.y - 42} y2={A.y + 42} />
      <line x1={X(sl)} y1={A.y - 44} x2={X(sl)} y2={A.y + 44} stroke="#fbe7c2" strokeWidth="1.4" />
      <Rule x={X(sl)} y={A.y - 58} len={118} ang={90} side="above" w={12} s={4.2} />
      <Awl kind="round" x={X(sl)} y={A.y + 30} ang={30} k={0.55} />
      <Lead p={[X(0), A.y - 44]} t={[X(0) - 20, 46]} text="fold line" a="end" />
      <Lead p={[X(sl) + 14, A.y - 46]} t={[X(sl) + 34, 44]} text="skive line" sub="a little behind the fold" a="start" c="#fbe7c2" />
      <T x={X(-10)} y={A.y + 4} a="middle" s={10.5} c="#5a3a1a">flap</T>
      <T x={X(24)} y={A.y + 4} a="middle" s={10.5} c="#5a3a1a">body</T>
      {/* the same line in section */}
      <Panel x={300} y={80} w={168} h={72} />
      <Tag x={308} y={96}>in section</Tag>
      <Prof pts={skivePts(310, 404, 460, 138, 18, 1, 420)} k="topF" />
      <line x1={404} y1={108} x2={404} y2={144} stroke="#fbe7c2" strokeWidth="1" strokeDasharray="3 2" />
      <line x1={420} y1={112} x2={420} y2={144} stroke={C.text} strokeWidth="0.8" strokeDasharray="4 3" />
      <T x={400} y={112} a="end" s={10} c="#fbe7c2">starts</T>
      <T x={424} y={112} s={10} c={C.text}>fold</T>

      <Sep x1={14} y1={164} x2={466} y2={164} />
      {/* unlined end */}
      <Tag x={16} y={182}>Unlined strap · end</Tag>
      {(() => {
        const B = { x: 70, y: 250, s: 4 }
        const xs = 12 // stitching ends (mm, local)
        const xl = xs + 4.8
        const pts = [[0, -10], [44, -10], [44, 10], [0, 10]]
        return (
          <g>
            <path d={pathOf(pts, B)} fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="0.9" />
            <path d={pathOf(pts, B)} fill="url(#sk-fibre)" />
            <rect x={B.x + xl * B.s} y={B.y - 40} width={(44 - xl) * B.s} height={80} fill="url(#sk-fadeR)" />
            {[-7, 7].map((yy) =>
              Array.from({ length: 4 }, (_, i) => (
                <line key={`${yy}${i}`} x1={B.x + (1 + i * 3.6) * B.s - 2} y1={B.y + yy * B.s + 2} x2={B.x + (1 + i * 3.6) * B.s + 2} y2={B.y + yy * B.s - 2} stroke={C.hole} strokeWidth="1.4" strokeLinecap="round" />
              ))
            )}
            <line x1={B.x + xl * B.s} y1={B.y - 44} x2={B.x + xl * B.s} y2={B.y + 44} stroke="#fbe7c2" strokeWidth="1.4" />
            <line x1={B.x + xs * B.s} y1={B.y - 44} x2={B.x + xs * B.s} y2={B.y - 26} stroke={C.dim} strokeWidth="0.7" />
            <Dim a={[B.x + xs * B.s, B.y - 36]} b={[B.x + xl * B.s, B.y - 36]} text="" />
            <T x={B.x + (xs + 2.4) * B.s} y={B.y - 46} a="middle" s={10.5} mono>4.8</T>
            <Break x={B.x} y1={B.y - 40} y2={B.y + 40} />
            <T x={B.x + 4} y={B.y + 56} s={10} c={C.faint}>last stitch holes</T>
            <T x={B.x + 44 * B.s} y={B.y + 56} a="end" s={10} c="#e9c877">skive to the end</T>
          </g>
        )
      })()}
      {/* option: between holes 1 and 2 */}
      <Sep x1={248} y1={172} x2={248} y2={332} />
      <Tag x={258} y={182}>Option · lock the taper</Tag>
      {(() => {
        const Cx = { x: 300, y: 250, s: 4 }
        const pitch = 3
        const h1 = 3
        const h2 = h1 + pitch
        const skl = (h1 + h2) / 2
        const pts = [[-10, -10], [38, -10], [38, 10], [-10, 10]]
        return (
          <g>
            <path d={pathOf(pts, Cx)} fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="0.9" />
            <path d={pathOf(pts, Cx)} fill="url(#sk-fibre)" />
            <rect x={Cx.x - 10 * Cx.s} y={Cx.y - 40} width={(10 + skl) * Cx.s} height={80} fill="url(#sk-fadeL)" />
            <line x1={Cx.x} y1={Cx.y - 44} x2={Cx.x} y2={Cx.y + 44} stroke={C.text} strokeWidth="1" strokeDasharray="4 3" />
            {[-7, 7].map((yy) =>
              Array.from({ length: 9 }, (_, i) => {
                const x = Cx.x + (h1 + i * pitch) * Cx.s
                return <line key={`${yy}${i}`} x1={x - 2} y1={Cx.y + yy * Cx.s + 2} x2={x + 2} y2={Cx.y + yy * Cx.s - 2} stroke={C.hole} strokeWidth="1.4" strokeLinecap="round" />
              })
            )}
            <line x1={Cx.x + skl * Cx.s} y1={Cx.y - 44} x2={Cx.x + skl * Cx.s} y2={Cx.y + 44} stroke="#fbe7c2" strokeWidth="1.4" />
            <Num x={Cx.x + h1 * Cx.s} y={Cx.y - 52} n={1} r={6.5} />
            <Num x={Cx.x + h2 * Cx.s} y={Cx.y - 52} n={2} r={6.5} />
            <T x={Cx.x - 4} y={Cx.y - 46} a="end" s={10} c={C.text}>fold</T>
            <T x={258} y={Cx.y + 58} s={10.5} c="#fbe7c2">skive starts between holes 1 and 2:</T>
            <T x={258} y={Cx.y + 72} s={10} c={C.faint}>the seam locks the start of the taper</T>
            <Break x={Cx.x + 38 * Cx.s} y1={Cx.y - 40} y2={Cx.y + 40} />
          </g>
        )
      })()}
    </Fig>
  )
}

/* t4-secure — low-tack tape holds soft calf flat on the plate */
function Secure() {
  return (
    <Fig h={330} view="Plan + section · securing soft leather" scale="schematic">
      <PrepDefs />
      <Tag x={16} y={40}>Taped to the plate · plan</Tag>
      <Slab x={20} y={52} w={270} h={120} kind="glass" />
      <rect x={44} y={84} width={226} height={56} rx="2" fill="#cdbfae" stroke="#8b7c69" strokeWidth="0.9" />
      <rect x={44} y={84} width={226} height={56} rx="2" fill="url(#sk-fibre)" />
      <rect x={44} y={84} width={70} height={56} fill="url(#sk-fadeL)" />
      {[186, 236].map((x) => (
        <g key={x}>
          <rect x={x} y={62} width={24} height={100} rx="1.5" fill="rgba(120,170,210,0.55)" stroke="#6f9cbf" strokeWidth="0.8" strokeDasharray="3 2" />
        </g>
      ))}
      <Lead p={[198, 160]} t={[140, 198]} text="low-tack tape onto the plate" a="start" c={C.steel} />
      <Lead p={[70, 112]} t={[34, 198]} text="flap end free" a="start" />
      <T x={52} y={76} s={10} c={C.dim}>soft chrome calf, flesh up</T>

      {/* or: on the grain */}
      <Panel x={304} y={30} w={164} h={164} />
      <Tag x={314} y={48}>or · tape on the grain</Tag>
      <Slab x={312} y={142} w={148} h={10} kind="glass" />
      <rect x={318} y={137} width={136} height={5} fill="rgba(120,170,210,0.75)" stroke="#6f9cbf" strokeWidth="0.6" />
      <Prof pts={skivePts(318, 380, 454, 137, 18, 1)} k="#bfae98" />
      <Blade x={410} y={137 - 18 + (30 / 74) * 17} ang={12} dir={-1} t={6} len={66} handle={30} face="backDown" />
      <Lead p={[330, 140]} t={[330, 168]} text="tape on the grain side" sub="(underneath) stops stretch" a="start" c={C.steel} />

      {/* creep vs flat */}
      <Sep x1={14} y1={210} x2={466} y2={210} />
      <Panel x={14} y={220} w={222} h={104} c={C.ruby} />
      <Verdict x={220} y={236} ok={false} />
      <T x={24} y={238} s={11.5} c={C.ruby} w="600">Untaped</T>
      <Slab x={24} y={290} w={204} h={9} kind="glass" />
      <path d="M30 290 L30 274 L120 274 Q136 274 142 262 Q148 252 156 262 Q162 274 176 276 L222 286 L222 290 Z" fill="#bfae98" stroke="#8b7c69" strokeWidth="0.8" />
      <Blade x={176} y={276} ang={12} dir={-1} t={6} len={60} handle={26} face="backDown" />
      <Arrow a={[90, 262]} b={[132, 262]} c="ruby" w={1.4} />
      <T x={125} y={314} a="middle" s={10.5} c={C.ruby}>creeps and stretches ahead of the blade</T>

      <Panel x={244} y={220} w={224} h={104} c={C.emerald} />
      <Verdict x={452} y={236} ok />
      <T x={254} y={238} s={11.5} c={C.emerald} w="600">Taped</T>
      <Slab x={254} y={290} w={206} h={9} kind="glass" />
      <rect x={258} y={286} width={198} height={4} fill="rgba(120,170,210,0.75)" />
      <Prof pts={skivePts(258, 360, 456, 286, 14, 1)} k="#bfae98" />
      <Blade x={392} y={286 - 14 + (32 / 96) * 13} ang={12} dir={-1} t={6} len={60} handle={26} face="backDown" />
      <T x={356} y={314} a="middle" s={10.5} c={C.emerald}>stays flat: an even taper</T>
    </Fig>
  )
}

/* t4-dampen — damp sponge on the flesh of veg-tan only */
function Dampen() {
  const cell = (x, title, c, ok, kind) => (
    <g>
      <Panel x={x} y={204} w={146} h={122} c={c} />
      <Verdict x={x + 130} y={220} ok={ok} />
      <T x={x + 10} y={222} s={11} c={c} w="600">{title}</T>
      <Slab x={x + 10} y={286} w={126} h={8} kind="glass" />
      {kind === 'damp' && (
        <g>
          <Prof pts={[[x + 14, 266], [x + 132, 266], [x + 132, 286], [x + 14, 286]]} k="topF" />
          <rect x={x + 14} y={266} width={118} height={5} fill="url(#pp-wet)" opacity="0.7" />
        </g>
      )}
      {kind === 'wet' && (
        <g>
          <Prof pts={[[x + 14, 266], [x + 132, 266], [x + 132, 286], [x + 14, 286]]} k="topF" />
          <rect x={x + 14} y={266} width={118} height={20} fill="url(#pp-wet)" />
          {[30, 60, 92].map((d) => (
            <ellipse key={d} cx={x + d} cy={265} rx="9" ry="2.4" fill="rgba(143,178,201,0.6)" />
          ))}
        </g>
      )}
      {kind === 'chrome' && (
        <g>
          <rect x={x + 14} y={266} width={118} height={20} fill="#bfae98" stroke="#8b7c69" strokeWidth="0.8" />
          <rect x={x + 50} y={242} width={40} height={16} rx="4" fill="url(#pp-sponge)" stroke="#8a7438" strokeWidth="0.7" />
          <path d={`M${x + 46} ${238} L${x + 94} ${262} M${x + 94} ${238} L${x + 46} ${262}`} stroke={C.ruby} strokeWidth="2" />
        </g>
      )}
      <T x={x + 73} y={308} a="middle" s={10.5} c={c}>{{ damp: 'just the surface', wet: 'soaked through', chrome: 'never — chrome-tan' }[kind]}</T>
      <T x={x + 73} y={320} a="middle" s={10} c={C.faint}>{{ damp: 'cuts clean', wet: 'mushy, stretches', chrome: 'water marks, no gain' }[kind]}</T>
    </g>
  )
  return (
    <Fig h={334} view="Section · dampening veg-tan" scale="thickness ×10">
      <PrepDefs />
      <Slab x={20} y={162} w={300} h={10} kind="glass" />
      <Prof pts={[[24, 120], [316, 120], [316, 162], [24, 162]]} k="topF" />
      <rect x={24} y={120} width={150} height={8} fill="url(#pp-wet)" opacity="0.75" />
      {/* sponge */}
      <rect x={170} y={86} width={70} height={34} rx="7" fill="url(#pp-sponge)" stroke="#8a7438" strokeWidth="0.9" />
      <Arrow a={[170, 74]} b={[240, 74]} w={1.8} />
      <T x={205} y={66} a="middle" s={10.5} c={C.brass}>wipe lightly</T>
      <Lead p={[176, 98]} t={[150, 96]} text="sponge, wrung out" sub="damp — not wet" a="end" />
      <Lead p={[80, 124]} t={[60, 196]} text="damp band: only the surface fibres" a="start" c={C.steel} />
      <Lead p={[280, 140]} t={[290, 196]} text="still dry" a="start" />
      <T x={30} y={154} s={10} c="#5a3a1a">veg-tan, flesh side up</T>
      {/* callout: fibres */}
      <Callout cx={404} cy={130} r={56} sx={120} sy={124} sr={8} label="damp fibres ×40 — cut clean" ly={200}>
        <rect x={344} y={118} width={120} height={80} fill="url(#pp-topF)" />
        <rect x={344} y={118} width={120} height={14} fill="url(#pp-wet)" opacity="0.7" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d={`M${350 + i * 9} 130 q${jit(i, 3)} -6 ${2 + jit(i + 3, 2)} -10`} stroke="#8a5f33" strokeWidth="1" fill="none" />
        ))}
        <Blade x={404} y={130} ang={12} dir={-1} t={7} len={70} handle={0} face="backDown" />
        <path d="M404 130 q12 -10 30 -6" fill="none" stroke="#d9b98a" strokeWidth="2.4" />
      </Callout>
      {cell(14, 'Veg-tan, damp', C.emerald, true, 'damp')}
      {cell(167, 'Veg-tan, wet', C.ruby, false, 'wet')}
      {cell(320, 'Chrome-tan', C.ruby, false, 'chrome')}
    </Fig>
  )
}

/* t4-setup — hard, flat, smooth base: glass or granite */
function Setup() {
  return (
    <Fig h={330} view="Plan + section · the skiving base" scale="schematic">
      <PrepDefs />
      <Tag x={16} y={40}>Plan · on the plate</Tag>
      <rect x={30} y={52} width={250} height={120} rx="3" fill="#4b4a49" stroke="#232220" />
      {Array.from({ length: 26 }, (_, i) => (
        <circle key={i} cx={36 + ((i * 37) % 240)} cy={58 + ((i * 53) % 108)} r="0.9" fill="#8a8987" />
      ))}
      <rect x={72} y={86} width={196} height={52} rx="2" fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="0.9" />
      <rect x={72} y={86} width={196} height={52} rx="2" fill="url(#sk-fibre)" />
      <rect x={188} y={86} width={80} height={52} fill="url(#sk-fadeR)" />
      <line x1={230} y1={80} x2={230} y2={144} stroke={C.text} strokeWidth="1" strokeDasharray="4 3" />
      <Lead p={[272, 132]} t={[300, 158]} text="flap end just inside" sub="the plate’s edge" a="start" />
      <Lead p={[150, 112]} t={[150, 196]} text="flap flat, flesh side up" a="middle" />
      <T x={230} y={76} a="middle" s={10} c={C.text}>fold</T>
      <T x={44} y={164} s={10} c="#c9c6c2">granite (or plate glass)</T>

      <Note x={300} y={64} head="Hard, flat, smooth" hc={C.text} lines={['glass or granite gives the', 'blade a true surface to', 'ride on — the skive comes', 'out even, edge to edge.']} s={10.5} lh={14} />

      <Sep x1={14} y1={206} x2={466} y2={206} />
      <Panel x={14} y={214} w={222} h={110} c={C.emerald} />
      <Verdict x={220} y={230} ok />
      <T x={24} y={232} s={11.5} c={C.emerald} w="600">Glass / granite</T>
      <Slab x={22} y={288} w={196} h={12} kind="granite" />
      <Prof pts={skivePts(28, 120, 212, 288, 18, 1)} k="topF" />
      <Blade x={166} y={288 - 18 + (46 / 92) * 17} ang={12} dir={-1} t={6} len={64} handle={28} face="backDown" />
      <T x={125} y={316} a="middle" s={10.5} c={C.emerald}>blade rides true</T>

      <Panel x={244} y={214} w={224} h={110} c={C.ruby} />
      <Verdict x={452} y={230} ok={false} />
      <T x={254} y={232} s={11.5} c={C.ruby} w="600">Soft board</T>
      <path d="M252 288 L380 288 Q392 288 398 296 Q404 300 410 296 Q416 288 428 288 L460 288 L460 300 L252 300 Z" fill="#6d6a5a" stroke="#3e3c33" />
      <path d="M258 288 L258 270 L380 270 Q394 272 400 290 Q404 296 406 290 Q412 280 420 282 L454 286 L454 288 Z" fill="url(#pp-topF)" stroke="#4a3018" strokeWidth="0.8" />
      <Blade x={403} y={292} ang={22} dir={-1} t={6} len={64} handle={28} face="backDown" />
      <T x={356} y={316} a="middle" s={10.5} c={C.ruby}>the board gives — the blade digs in</T>
    </Fig>
  )
}

/* t4-angle — the 10–15° working window */
function Angle() {
  const P0 = [338, 241.4]
  const R = 214
  const zones = [
    [0, 5, 'rgba(134,167,189,0.30)'],
    [5, 10, 'rgba(255,255,255,0.05)'],
    [10, 15, 'rgba(123,165,131,0.45)'],
    [15, 20, 'rgba(255,255,255,0.05)'],
    [20, 32, 'rgba(194,88,99,0.30)'],
  ]
  const at = (deg, r) => [P0[0] - r * Math.cos(rad(deg)), P0[1] - r * Math.sin(rad(deg))]
  return (
    <Fig h={340} view="Detail · the blade angle" scale="angles true">
      <PrepDefs />
      {zones.map(([a, b, f]) => (
        <Sector key={a} cx={P0[0]} cy={P0[1]} r={R} a0={180 + a} a1={180 + b} fill={f} stroke="rgba(255,255,255,0.08)" />
      ))}
      {[5, 10, 15, 20].map((d) => {
        const q = at(d, R + 6)
        return (
          <T key={d} x={q[0] - 2} y={q[1] + 4} a="end" s={10.5} mono c={d === 10 || d === 15 ? C.emerald : C.dim}>
            {d}°
          </T>
        )
      })}
      {/* leather, flesh up, partly skived */}
      <Slab x={20} y={254} w={440} h={10} kind="glass" />
      <Prof pts={[[24, 230], [200, 230], [236, 232.3], [P0[0], P0[1]], [456, 252], [456, 254], [24, 254]]} k="topF" />
      <polygon points={P([[P0[0], 238.6], [456, 246], [456, 252], [P0[0], P0[1]]])} fill="#cfa775" stroke="#4a3018" strokeWidth="0.6" />
      <line x1={P0[0]} y1={P0[1]} x2={456} y2={252} stroke="#4a3018" strokeWidth="0.8" strokeDasharray="3 2" />
      <Blade x={P0[0]} y={P0[1]} ang={12.5} dir={-1} t={7} len={118} handle={52} face="backDown" />
      <path d={`M${P0[0] + 1} 239.5 Q330 222 306 214 Q288 208 290 196 Q294 186 304 192`} fill="none" stroke="#d9b98a" strokeWidth="2.6" strokeLinecap="round" />
      <Lead p={[296, 196]} t={[262, 176]} text="thin shaving" a="end" c="#e9cf9f" s={10.5} />
      <Lead p={[420, 247]} t={[440, 214]} text="this pass" a="end" c={C.dim} s={10.5} />
      <Arc cx={P0[0]} cy={P0[1]} r={92} a0={180} a1={192.5} c={C.emerald} w={1.4} />
      <T x={352} y={164} s={10.5} c={C.emerald}>blade drawn at 12°</T>
      <T x={30} y={248} s={10} c="#5a3a1a">flesh side up, on glass</T>
      <Arrow a={[360, 196]} b={[410, 196]} w={1.6} />
      <T x={385} y={188} a="middle" s={10} c={C.brass}>travel</T>

      {/* legend */}
      <g>
        <rect x={352} y={42} width={12} height={10} fill="rgba(194,88,99,0.45)" stroke={C.ruby} />
        <T x={370} y={51} s={11} c={C.ruby} w="600">&gt; 20°</T>
        <T x={370} y={65} s={10.5}>cuts straight through</T>
        <rect x={352} y={80} width={12} height={10} fill="rgba(123,165,131,0.6)" stroke={C.emerald} />
        <T x={370} y={89} s={11} c={C.emerald} w="600">10–15°</T>
        <T x={370} y={103} s={10.5}>the working window</T>
        <rect x={352} y={118} width={12} height={10} fill="rgba(134,167,189,0.45)" stroke={C.steel} />
        <T x={370} y={127} s={11} c={C.steel} w="600">&lt; 5°</T>
        <T x={370} y={141} s={10.5}>skates off, no cut</T>
      </g>

      {/* results */}
      <Sep x1={14} y1={272} x2={466} y2={272} />
      {[
        [14, 28, 'too steep: dives through', C.ruby],
        [168, 12.5, 'in the window: even shaving', C.emerald],
        [322, 3, 'too flat: skates', C.steel],
      ].map(([x, ang, cap, c]) => (
        <g key={x}>
          <Slab x={x + 6} y={308} w={134} h={6} kind="glass" />
          {ang > 20 ? (
            <path d={`M${x + 8} 296 L${x + 70} 296 L${x + 84} 308 L${x + 88} 308 L${x + 88} 296 L${x + 138} 296 L${x + 138} 308 L${x + 8} 308 Z`} fill="url(#pp-topF)" stroke="#4a3018" strokeWidth="0.7" />
          ) : (
            <Prof pts={[[x + 8, 296], [x + 76, 296], [x + 138, 306], [x + 138, 308], [x + 8, 308]]} k="topF" />
          )}
          <Blade x={ang > 20 ? x + 84 : ang > 5 ? x + 92 : x + 78} y={ang > 20 ? 307 : ang > 5 ? 298 : 296} ang={ang} dir={-1} t={4} len={44} handle={16} face="backDown" />
          {ang < 5 && <Arrow a={[x + 86, 290]} b={[x + 120, 290]} c="steel" w={1.2} />}
          <T x={x + 73} y={330} a="middle" s={10.5} c={c}>{cap}</T>
        </g>
      ))}
    </Fig>
  )
}

/* t4-passes — light pull-slicing passes build the taper */
function Passes() {
  const yb = 150
  const t = 34
  const x0 = 40
  const x1 = 330
  // pass k: cut line from (start_k, surface) to (x1, yb - rest_k)
  const passes = [
    [250, t * 0.62],
    [206, t * 0.34],
    [168, t * 0.12],
    [140, 1.2],
  ]
  const bands = passes.map(([sx, rest], k) => {
    const prev = k ? passes[k - 1] : [x1, t]
    const top = k ? [[prev[0], yb - t], [x1, yb - prev[1]]] : [[sx, yb - t], [x1, yb - t]]
    const pts = k ? [[sx, yb - t], ...top, [x1, yb - rest]] : [[sx, yb - t], [x1, yb - t], [x1, yb - rest]]
    return pts
  })
  const fills = ['rgba(208,168,79,0.55)', 'rgba(208,168,79,0.40)', 'rgba(208,168,79,0.28)', 'rgba(208,168,79,0.18)']
  return (
    <Fig h={340} view="Section · building the taper" scale="thickness ×12">
      <PrepDefs />
      <Tag x={16} y={40}>four light passes, flesh up on glass</Tag>
      <Slab x={x0 - 8} y={yb} w={x1 - x0 + 16} h={10} kind="glass" />
      <Prof pts={[[x0, yb - t], [passes[3][0], yb - t], [x1, yb - passes[3][1]], [x1, yb], [x0, yb]]} k="topF" />
      {bands.map((pts, k) => (
        <polygon key={k} points={P(pts)} fill={fills[k]} stroke={C.brass} strokeWidth="0.8" strokeDasharray={k === 3 ? undefined : '3 2'} />
      ))}
      {passes.map(([sx], k) => {
        const cx = k ? (sx + passes[k - 1][0]) / 2 + 22 : sx + 46
        return <Num key={k} x={cx} y={yb - t - 14} n={k + 1} r={7} />
      })}
      <Blade x={x1 - 2} y={yb - passes[3][1] - 0.5} ang={12} dir={-1} t={6} len={90} handle={40} face="backDown" />
      <Lead p={[x0 + 40, yb - t / 2]} t={[x0 + 20, 186]} text="full thickness" a="start" />
      <Lead p={[290, yb - 16]} t={[300, 186]} text="smooth taper — no ridge" a="middle" c={C.emerald} />
      <Note x={350} y={60} head="Each pass" hc={C.text} lines={['one thin, even shaving,', 'a little further back', 'than the last']} s={10.5} lh={14} />
      {/* shavings */}
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M${360 + k * 34} ${132} q-8 -10 2 -16 q10 -4 10 6 q-2 6 -8 4`} fill="none" stroke="#d9b98a" strokeWidth="2.2" strokeLinecap="round" />
      ))}
      <T x={404} y={150} a="middle" s={10} c={C.faint}>thin, even shavings</T>

      <Sep x1={14} y1={200} x2={466} y2={200} />
      {/* one heavy push */}
      <Panel x={14} y={208} w={150} h={126} c={C.ruby} />
      <Verdict x={148} y={224} ok={false} />
      <T x={24} y={226} s={11} c={C.ruby} w="600">One heavy push</T>
      <Slab x={20} y={290} w={138} h={8} kind="glass" />
      <Prof pts={[[24, 268], [86, 268], [92, 282], [154, 287], [154, 290], [24, 290]]} k="topF" />
      <Lead p={[90, 276]} t={[100, 248]} text="ridge" a="start" c={C.ruby} />
      <T x={89} y={316} a="middle" s={10.5} c={C.ruby}>a step, not a taper</T>

      {/* pull-slice, plan */}
      <Panel x={172} y={208} w={140} h={126} />
      <Tag x={182} y={226}>pull-slice · plan</Tag>
      <rect x={186} y={248} width={112} height={44} fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="0.8" />
      <rect x={244} y={248} width={54} height={44} fill="url(#sk-fadeR)" />
      <Knife kind="skive" x={250} y={262} ang={-120} k={0.42} />
      <Arrow d="M256 266 q14 6 26 22" w={1.6} />
      <T x={242} y={312} a="middle" s={10} c={C.faint}>draw the blade along</T>
      <T x={242} y={324} a="middle" s={10} c={C.faint}>its edge as it advances</T>

      {/* fan cuts on a curve */}
      <Panel x={320} y={208} w={148} h={126} />
      <Tag x={330} y={226}>curves · fan cuts</Tag>
      <T x={330} y={242} s={10} c={C.text}>short, overlapping cuts</T>
      {(() => {
        const cx = 380
        const cy = 288
        const R = 60
        const items = []
        for (let i = 0; i <= 7; i++) {
          const a = rad(-80 + i * 22)
          const ox = cx + Math.cos(a) * R
          const oy = cy + Math.sin(a) * R * 0.62
          const ix = cx + Math.cos(a) * (R - 22)
          const iy = cy + Math.sin(a) * (R - 22) * 0.62
          const nx = -Math.sin(a) * 5
          const ny = Math.cos(a) * 5
          items.push(<polygon key={i} points={P([[ix, iy], [ox + nx, oy + ny * 0.62], [ox - nx, oy - ny * 0.62]])} fill="rgba(208,168,79,0.45)" stroke={C.brass} strokeWidth="0.6" />)
        }
        return (
          <ClipBox x={321} y={248} w={146} h={84}>
            <path d={`M${cx - 40} ${cy - 60} L${cx} ${cy - R * 0.62} A${R} ${R * 0.62} 0 0 1 ${cx} ${cy + R * 0.62} L${cx - 40} ${cy + 60} Z`} fill="url(#sk-flesh)" stroke="#9c7c52" />
            {items}
          </ClipBox>
        )
      })()}
    </Fig>
  )
}

/* t4-feather — half thick at the fold, feathered to the end */
function Feather() {
  const yb = 134
  const t = 36 // 1.2 mm at 30 px/mm
  const x0 = 30
  const xs = 196
  const xf = 236
  const x1 = 420
  const pts = skivePts(x0, xs, x1, yb, t, 0.6, xf)
  const rAt = (x) => {
    const p = pts.slice(1, -2).reduce((best, q) => (Math.abs(q[0] - x) < Math.abs(best[0] - x) ? q : best))
    return yb - p[1]
  }
  return (
    <Fig h={340} view="Section · the finished flap skive" scale="thickness ×30 · length ×8">
      <PrepDefs />
      <Slab x={22} y={yb} w={408} h={9} kind="glass" />
      <Prof pts={pts} k="topF" />
      <Break x={x0} y1={yb - t} y2={yb} />
      <line x1={xf} y1={yb - t - 26} x2={xf} y2={yb + 22} stroke={C.text} strokeWidth="1" strokeDasharray="4 3" />
      <T x={xf} y={yb - t - 32} a="middle" s={10.5} c={C.text}>fold line</T>
      <line x1={xs} y1={yb - t - 12} x2={xs} y2={yb + 22} stroke="#fbe7c2" strokeWidth="0.8" strokeDasharray="3 2" />
      <T x={xs - 4} y={yb + 34} a="end" s={10} c="#fbe7c2">skive starts</T>
      {/* dims */}
      <Dim a={[90, yb]} b={[90, yb - t]} text="" />
      <T x={96} y={yb - t / 2 + 4} s={11} mono c="#5a3a1a">t</T>
      <Dim a={[xf + 8, yb]} b={[xf + 8, yb - rAt(xf)]} text="" />
      <T x={xf + 14} y={yb - rAt(xf) - 8} s={10.5} mono c={C.brassHi}>≈ ½ t at the fold</T>
      <Dim a={[340, yb + 22]} b={[x1, yb + 22]} off={0} text="" />
      <T x={380} y={yb + 36} a="middle" s={10.5} c={C.brassHi}>last few mm → nearly 0</T>
      <Lead p={[x1 - 4, yb - 1]} t={[452, 112]} text="feathered" a="end" c={C.brassHi} />
      <T x={40} y={yb - t - 12} s={10.5}>body: full thickness t (1.0–1.2 mm)</T>
      <T x={340} y={yb - 50} a="middle" s={10.5}>flap</T>

      {/* why: doubled = one */}
      <Panel x={14} y={204} w={140} h={128} c={C.emerald} />
      <Tag x={24} y={222}>why half</Tag>
      <Ply x1={62} x2={148} y={258} t={16} open="l" />
      <Wrap cx={62} cy={258 + 8 + 9} r={9} t={8} xR={62} conv={26} tail={40} ts={3} />
      <BarEnd cx={62} cy={275} r={8.2} />
      <Dim a={[146, 258]} b={[146, 274]} text="" />
      <T x={84} y={306} a="middle" s={10.5} c={C.emerald}>½ + ½ ≈ one layer</T>
      <T x={84} y={320} a="middle" s={10} c={C.faint}>round the bar</T>

      {/* variants */}
      <Panel x={162} y={204} w={306} h={128} />
      <Tag x={172} y={222}>what makers aim for at the fold</Tag>
      {[
        [0.3, 'lug flap, Japanese DIY', '~0.3 mm', 'flat'],
        [0.5, 'turned-edge fold', '≤ 0.5 mm', 'flat'],
        [0.7, 'lug wrap, last 9.5 mm', '0.6–0.8 mm', 'step'],
      ].map(([mm, cap, val, kind], i) => {
        const y = 250 + i * 28
        const k = 16 // px per mm (thickness)
        const full = 1.2 * k
        const x = 176
        const pts2 =
          kind === 'step'
            ? [[x, y - full], [x + 36, y - full], [x + 42, y - mm * k], [x + 80, y - mm * k], [x + 80, y], [x, y]]
            : [[x, y - full], [x + 14, y - full], [x + 28, y - mm * k], [x + 80, y - mm * k], [x + 80, y], [x, y]]
        return (
          <g key={i}>
            <Prof pts={pts2} k="topF" />
            <T x={x + 88} y={y - 6} s={10.5} c={C.brassHi} mono>{val}</T>
            <T x={x + 166} y={y - 6} s={10}>{cap}</T>
          </g>
        )
      })}
      <T x={176} y={326} s={10} c={C.faint}>the last: full thickness kept where it bears on the case</T>
    </Fig>
  )
}

/* t4-linings — short lining both ends, long lining lug end only */
function Linings() {
  const S = { x: 40, y: 82, s: 2.6 }
  const Lg = { x: 40, y: 250, s: 2.6 }
  const os = { x0: 0, x1: 76, w0: 20, w1: 18, taper: [8, 76], tip: 'square' }
  const ol = { x0: 0, x1: 116, w0: 20, w1: 18, taper: [8, 100], tip: 'ogive', tipLen: 14 }
  return (
    <Fig h={348} view="Plan + section · the linings" scale="plan ×2.6">
      <PrepDefs />
      <Tag x={16} y={40}>Short lining</Tag>
      <StrapPlan T={S} o={os} face="lining" zones={[{ from: 0, to: 10, k: 'skiveL' }, { from: 66, to: 76, k: 'skiveR' }]} />
      <T x={S.x + 38 * S.s} y={S.y + 4} a="middle" s={10.5} c="#5a4630">lightly skived, both ends</T>
      <Ply x1={S.x} x2={S.x + 76 * S.s} y={128} t={8} k="lining" skL={[26, 2]} skR={[26, 2]} cut="top" />
      <T x={S.x} y={150} s={10} c={C.faint}>lug end</T>
      <T x={S.x + 76 * S.s} y={150} a="end" s={10} c={C.faint}>buckle end</T>

      {/* inset: disappears into the fold */}
      <Panel x={262} y={30} w={206} h={164} />
      <Tag x={272} y={48}>where it meets the fold</Tag>
      <Ply x1={300} x2={462} y={86} t={14} open="l" />
      <Wrap cx={300} cy={86 + 14 + 10} r={10} t={14} xR={300} conv={28} tail={52} ts={5} />
      <BarEnd cx={300} cy={110} r={9.2} />
      <polygon points={P([[330, 106], [462, 106], [462, 114], [372, 114]])} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.8" />
      <Lead p={[356, 108]} t={[462, 160]} text="feathered lining end" sub="vanishes into the fold" a="end" c={C.brassHi} />
      <Lead p={[330, 103]} t={[296, 134]} text="tail" a="end" />

      <Sep x1={14} y1={202} x2={466} y2={202} />
      <Tag x={16} y={218}>Long lining</Tag>
      <StrapPlan T={Lg} o={ol} face="lining" zones={[{ from: 0, to: 10, k: 'skiveL' }]} />
      <T x={Lg.x + 58 * Lg.s} y={Lg.y + 4} a="middle" s={10.5} c="#5a4630">skived at the lug end only</T>
      <Ply x1={Lg.x} x2={Lg.x + 116 * Lg.s} y={294} t={8} k="lining" skL={[26, 2]} cut="top" />
      <T x={Lg.x} y={316} s={10} c={C.faint}>lug end</T>
      <T x={Lg.x + 116 * Lg.s} y={316} a="end" s={10} c={C.emerald}>tip end stays full</T>
      <Legend x={340} y={340} items={[['skive', 'skived'], ['lining', 'lining']]} />
    </Fig>
  )
}

/* t4-keepers — ends skived on opposite faces, scarfed to one thickness */
function Keepers() {
  const t = 24
  const lap = 54
  const y = 76
  return (
    <Fig h={330} view="Section · keeper strip" scale="thickness ×20 · schematic">
      <PrepDefs />
      <Tag x={16} y={40}>the strip, before forming</Tag>
      {/* strip: left end skived on the grain (top), right end on the flesh (bottom) */}
      <Prof pts={[[30, y + t / 2], [30 + lap, y + t / 2], [30 + lap + 12, y], [450, y], [450, y + t / 2], [450 - lap, y + t / 2], [450 - lap - 12, y + t], [30, y + t]]} k="top" />
      <Lead p={[56, y + t / 2]} t={[40, y - 18]} text="grain side skived to ½" a="start" c={C.brassHi} />
      <Lead p={[424, y + t / 2]} t={[450, y + t + 26]} text="flesh side skived to ½" a="end" c={C.brassHi} />
      <Dim a={[240, y + t]} b={[240, y]} text="" />
      <T x={246} y={y - 8} s={10.5} mono>t ≈ 1.2 mm</T>
      <T x={150} y={y + t + 30} a="middle" s={10} c={C.faint}>grain up · strip 5 mm wide</T>

      {/* lapped */}
      <Sep x1={14} y1={150} x2={466} y2={150} />
      <Tag x={16} y={168}>lapped: one even thickness</Tag>
      {(() => {
        const yy = 222
        return (
          <g>
            <Prof pts={[[30, yy], [150, yy], [162, yy + t / 2], [226, yy + t / 2], [238, yy + t], [30, yy + t]]} k="top" />
            <Prof pts={[[150, yy], [278, yy], [278, yy + t], [238, yy + t], [226, yy + t / 2], [162, yy + t / 2]]} k="dark" />
            <line x1={20} y1={yy} x2={290} y2={yy} stroke={C.emerald} strokeWidth="0.8" strokeDasharray="4 3" />
            <line x1={20} y1={yy + t} x2={290} y2={yy + t} stroke={C.emerald} strokeWidth="0.8" strokeDasharray="4 3" />
            <Dim a={[284, yy + t]} b={[284, yy]} text="" />
            <T x={262} y={yy + t + 18} a="middle" s={10.5} c={C.emerald}>= t</T>
            <Lead p={[180, yy + t / 2]} t={[180, yy - 30]} text="the scarf joint" a="middle" />
            <T x={70} y={yy + t + 18} a="middle" s={10} c={C.faint}>inner end</T>
            <T x={240} y={yy - 10} a="middle" s={10} c={C.faint}>outer end</T>
          </g>
        )
      })()}
      {/* loop */}
      <Panel x={312} y={160} w={156} h={164} />
      <Tag x={322} y={178}>formed keeper</Tag>
      <rect x={340} y={212} width={100} height={64} rx="12" fill="none" stroke="#b98c57" strokeWidth="10" />
      <rect x={340} y={212} width={100} height={64} rx="12" fill="none" stroke="#5c3c1d" strokeWidth="0.8" />
      <rect x={350} y={222} width={80} height={22} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />
      <rect x={350} y={244} width={80} height={22} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" opacity="0.8" />
      <rect x={372} y={270} width={36} height={12} fill="#7a5233" stroke={C.brassHi} strokeWidth="1" />
      <Lead p={[390, 282]} t={[390, 304]} text="scarf at the back" a="middle" c={C.brassHi} />
      <T x={390} y={318} a="middle" s={10} c={C.faint}>hidden against the strap</T>
    </Fig>
  )
}

/* t4-check — dry test-fold */
function SkiveCheck() {
  const cell = (ox, kind) => {
    const ok = kind === 'ok'
    const c = ok ? C.emerald : C.ruby
    const y0 = 110
    const t = 30
    const tf = { ok: t / 2, fat: t * 0.78, hole: t * 0.16 }[kind]
    const x0 = ox + 10
    const xs = ox + 60
    const xf = ox + 120
    const d = `M${x0} ${y0} L${xf} ${y0} A${tf} ${tf} 0 0 1 ${xf} ${y0 + 2 * tf} L${xs} ${y0 + t} L${x0} ${y0 + t} Z`
    return (
      <g>
        <Panel x={ox} y={30} w={150} h={222} c={c} />
        <Verdict x={ox + 134} y={46} ok={ok} />
        <T x={ox + 10} y={50} s={11.5} c={c} w="600">{{ ok: 'Level', fat: 'Fatter', hole: 'A hole' }[kind]}</T>
        <path d={d} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
        <line x1={xs} y1={y0 + t} x2={xf} y2={y0 + tf} stroke="#4a3018" strokeWidth="0.9" />
        {[y0, y0 + t].map((y) => (
          <line key={y} x1={ox + 6} y1={y} x2={ox + 146} y2={y} stroke={C.emerald} strokeWidth="0.8" strokeDasharray="4 3" />
        ))}
        {kind === 'fat' && <path d={`M${xs + 4} ${y0 + t} L${xf} ${y0 + t} L${xf} ${y0 + 2 * tf} Z`} fill="rgba(194,88,99,0.45)" />}
        {kind === 'hole' && (
          <g>
            <ellipse cx={xf + 2} cy={y0 + tf} rx="4" ry="5" fill={C.ground} stroke={C.ruby} strokeWidth="1.2" />
            <path d={`M${xf} ${y0 + 2 * tf} L${xs} ${y0 + t}`} stroke={C.ruby} strokeWidth="0" />
          </g>
        )}
        <Dim a={[ox + 138, y0 + t]} b={[ox + 138, y0]} text="" />
        <T x={ox + 75} y={y0 - 12} a="middle" s={10} c={C.faint}>body</T>
        <T x={ox + 75} y={176} a="middle" s={10.5} c={c}>{{ ok: 'the doubled fold sits', fat: 'doubled fold proud', hole: 'thinned too far' }[kind]}</T>
        <T x={ox + 75} y={190} a="middle" s={10.5} c={c}>{{ ok: 'level with the body', fat: 'of the body line', hole: 'and torn' }[kind]}</T>
        <T x={ox + 75} y={214} a="middle" s={10.5} c={C.text}>{{ ok: 'done', fat: 'take another pass', hole: 'cut a new flap' }[kind]}</T>
        <T x={ox + 75} y={228} a="middle" s={10} c={C.faint}>{{ ok: 'move on to gluing', fat: 'then fold again', hole: 'no repair' }[kind]}</T>
      </g>
    )
  }
  return (
    <Fig h={290} view="Section · dry test-fold" scale="schematic">
      <PrepDefs />
      {cell(14, 'ok')}
      {cell(170, 'fat')}
      {cell(326, 'hole')}
      <T x={240} y={274} a="middle" s={10.5}>Fold the skived flap back on itself, dry — dashed lines: the body’s faces</T>
    </Fig>
  )
}

/* t4-errors — gouge, ridge, tear, through-cut, under- and over-skived */
function SkiveErrors() {
  const ideal = (x, y) => [[x + 6, y - 20], [x + 50, y - 20], [x + 140, y - 1]]
  const cells = [
    ['Gouge', 'blade too steep', (x, y) => `M${x + 6} ${y - 20} L${x + 50} ${y - 20} L${x + 70} ${y - 15} Q${x + 80} ${y - 4} ${x + 90} ${y - 12} L${x + 140} ${y - 1} L${x + 140} ${y} L${x + 6} ${y} Z`],
    ['Ridge', 'one heavy pass', (x, y) => `M${x + 6} ${y - 20} L${x + 74} ${y - 20} L${x + 80} ${y - 9} L${x + 140} ${y - 5} L${x + 140} ${y} L${x + 6} ${y} Z`],
    ['Tear', 'dull blade', (x, y) => `M${x + 6} ${y - 20} L${x + 50} ${y - 20} ${Array.from({ length: 16 }, (_, i) => `L${x + 52 + i * 5.5} ${y - 19 + i * 1.15 + (i % 2 ? 3 : -1)}`).join(' ')} L${x + 140} ${y - 1} L${x + 140} ${y} L${x + 6} ${y} Z`],
    ['Through-cut', 'blade too steep', (x, y) => `M${x + 6} ${y - 20} L${x + 50} ${y - 20} L${x + 78} ${y - 12} L${x + 88} ${y} L${x + 6} ${y} Z M${x + 96} ${y} L${x + 100} ${y - 5} L${x + 140} ${y - 1} L${x + 140} ${y} Z`],
    ['Under-skived', 'bulge at the fold', (x, y) => `M${x + 6} ${y - 20} L${x + 70} ${y - 20} L${x + 140} ${y - 9} L${x + 140} ${y} L${x + 6} ${y} Z`],
    ['Over-skived', 'a weak fold', (x, y) => `M${x + 6} ${y - 20} L${x + 36} ${y - 20} L${x + 56} ${y - 3} L${x + 140} ${y - 1} L${x + 140} ${y} L${x + 6} ${y} Z`],
  ]
  return (
    <Fig h={344} view="Comparison · what each error looks like" scale="sections, flesh up">
      <PrepDefs />
      {cells.map(([name, cause, d], i) => {
        const col = i % 3
        const row = Math.floor(i / 3)
        const x = 14 + col * 152
        const y = 30 + row * 150
        const base = y + 92
        return (
          <g key={name}>
            <Panel x={x} y={y} w={146} h={142} c={C.ruby} />
            <T x={x + 10} y={y + 20} s={11.5} c={C.ruby} w="600">{name}</T>
            <T x={x + 10} y={y + 34} s={10}>{cause}</T>
            <Slab x={x + 4} y={base} w={138} h={7} kind="glass" />
            <path d={d(x, base)} fill="url(#pp-topF)" stroke="#4a3018" strokeWidth="0.8" fillRule="evenodd" />
            <polyline points={P(ideal(x, base))} fill="none" stroke={C.emerald} strokeWidth="1" strokeDasharray="3 2" />
            {i >= 4 && <line x1={x + 112} y1={base - 26} x2={x + 112} y2={base + 10} stroke={C.text} strokeWidth="0.8" strokeDasharray="3 2" />}
            {i >= 4 && <T x={x + 112} y={base - 30} a="middle" s={10} c={C.text}>fold</T>}
            <T x={x + 73} y={y + 122} a="middle" s={10} c={C.faint}>
              {['a dip cut into the taper', 'a step where it went in', 'ragged, torn fibres', 'skived right through', 'fold > one layer', 'fold far below half'][i]}
            </T>
            <T x={x + 73} y={y + 135} a="middle" s={10} c={C.dim}>
              {['flatten the angle', 'several light passes', 'strop, then re-skive', 'cut a new flap', 'take another pass', 'cut a new flap'][i]}
            </T>
          </g>
        )
      })}
      <g>
        <line x1={16} y1={332} x2={36} y2={332} stroke={C.emerald} strokeWidth="1" strokeDasharray="3 2" />
        <T x={40} y={336} s={10} c={C.emerald}>the target profile</T>
      </g>
    </Fig>
  )
}

/* ================================================================== */
/* T5 — Reinforcement                                                   */
/* ================================================================== */

/* t5-material — Velodon, Texon and centre tape, to scale */
function Material() {
  const k = 10 // px per mm, true proportion
  const rows = [
    { y: 64, name: 'Velodon (Viledon)', val: '0.2 mm', sub: ['non-woven polyester', 'the standard'], c: C.emerald, t: 0.2, fill: 'url(#pp-velo)', w: 20 },
    { y: 160, name: 'Texon', val: '~0.45 mm', sub: ['cellulose board', 'stiffer'], c: C.brassHi, t: 0.45, fill: 'url(#pp-texon)', w: 20 },
    { y: 256, name: 'Tear-resistant tape', val: '6–8 mm wide', sub: ['down the centre only', 'just the middle'], c: C.steel, t: 0.2, fill: C.velodon, w: 7 },
  ]
  return (
    <Fig h={330} view="Section across the width · to scale" scale="true scale ×10">
      <PrepDefs />
      {rows.map((r, i) => {
        const x0 = 30
        const W = 20 * k
        const tt = 1.1 * k
        const rt = Math.max(2, r.t * k)
        const rx = x0 + (W - r.w * k) / 2
        return (
          <g key={i}>
            <Num x={22} y={r.y - 24} n={i + 1} r={7} />
            <T x={34} y={r.y - 20} s={11.5} c={C.text} w="600">{r.name}</T>
            <rect x={x0} y={r.y} width={W} height={tt} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.7" />
            <rect x={rx} y={r.y + tt} width={r.w * k} height={rt} fill={r.fill} stroke="#4e6f84" strokeWidth="0.5" />
            <line x1={x0 + W + 6} y1={r.y} x2={x0 + W + 16} y2={r.y} stroke={C.dim} strokeWidth="0.6" />
            <line x1={x0 + W + 6} y1={r.y + tt} x2={x0 + W + 16} y2={r.y + tt} stroke={C.dim} strokeWidth="0.6" />
            <line x1={x0 + W + 12} y1={r.y} x2={x0 + W + 12} y2={r.y + tt} stroke={C.dim} strokeWidth="0.8" />
            <T x={x0 + W + 20} y={r.y + 9} s={10.5} mono>1.1 top</T>
            <Lead p={[rx + r.w * k - 8, r.y + tt + rt / 2]} t={[x0 + W + 16, r.y + tt + 22]} text={r.val} c={r.c} s={11} />
            {r.w < 20 && <Dim a={[rx, r.y + tt + 12]} b={[rx + r.w * k, r.y + tt + 12]} off={0} text="" />}
            {/* plan swatch */}
            <rect x={318} y={r.y - 14} width={44} height={36} rx="2" fill={r.fill} stroke="#4e6f84" strokeWidth="0.7" />
            {r.w < 20 && <rect x={318} y={r.y - 14} width={44} height={36} rx="2" fill="url(#sk-top)" />}
            {r.w < 20 && <rect x={333} y={r.y - 14} width={14} height={36} fill={C.velodon} stroke="#4e6f84" strokeWidth="0.5" />}
            <T x={372} y={r.y - 2} s={11} c={r.c} w="600">{r.val}</T>
            <T x={372} y={r.y + 12} s={10.5}>{r.sub[0]}</T>
            <T x={372} y={r.y + 25} s={10} c={C.faint}>{r.sub[1]}</T>
          </g>
        )
      })}
      <T x={130} y={316} a="middle" s={10} c={C.faint}>sections across a 20 mm strap</T>
      <T x={340} y={316} a="middle" s={10} c={C.faint}>plan swatches</T>
    </Fig>
  )
}

// Reinforcement overlay on a plan piece: inset (mm) from the outline,
// x range from..to; tape = half-width (mm) for a centre strip.
function ReinfZone({ T: Tr, o, from, to, inset = 0, tape, fill = 'rgba(134,167,189,0.55)' }) {
  const id = uid()
  const pts = inset ? offset(outline(o), inset) : outline(o)
  const [x1, y1] = px(Tr, from, -tape || -20)
  const [x2, y2] = px(Tr, to, tape || 20)
  return (
    <g>
      <clipPath id={`rz${id}`}>
        <path d={pathOf(pts, Tr)} />
      </clipPath>
      <g clipPath={`url(#rz${id})`}>
        <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} fill={fill} stroke={C.steel} strokeWidth="1.2" strokeDasharray="4 2" />
      </g>
    </g>
  )
}

/* t5-placement — where each maker puts it, long piece in plan */
function Placement() {
  const o = LONG({ x0: -20 })
  const rowT = (y) => ({ x: 78, y, s: 2.35 })
  const rows = [
    { y: 86, n: 1, title: 'Flat strap', sub: 'full length on the top’s flesh side', face: 'flesh', z: { from: -20, to: 121 } },
    { y: 174, n: 2, title: 'Padded strap', sub: 'on the lining, round the folds, short of the edges', face: 'lining', z: { from: -20, to: 121, inset: 2.2 } },
    { y: 262, n: 3, title: 'Tape', sub: '6–8 mm down the centre — never into the folds', face: 'flesh', z: { from: 14, to: 104, tape: 3.5 } },
  ]
  return (
    <Fig h={346} view="Plan · long piece · three placements" scale="plan ×2.35">
      <PrepDefs />
      {rows.map((r) => {
        const Tr = rowT(r.y)
        return (
          <g key={r.n}>
            <Num x={22} y={r.y - 42} n={r.n} r={7} />
            <T x={34} y={r.y - 38} s={11.5} c={C.text} w="600">{r.title}</T>
            <T x={34 + r.title.length * 7 + 10} y={r.y - 38} s={10.5}>{r.sub}</T>
            <StrapPlan T={Tr} o={o} face={r.face} folds={[{ x: 0 }]} zones={r.n === 3 ? [{ from: -20, to: 10, k: 'noglue' }] : []} />
            <ReinfZone T={Tr} o={o} {...r.z} />
          </g>
        )
      })}
      {/* layer stacks */}
      {[
        [86, [{ k: 'top', t: 9 }, { k: 'velodon', t: 2 }, { k: 'lining', t: 6 }]],
        [174, [{ k: 'top', t: 9 }, { k: 'filler', t: 9, inset: 6 }, { k: 'velodon', t: 2, inset: 4 }, { k: 'lining', t: 6 }]],
        [262, [{ k: 'top', t: 9 }, { k: 'velodon', t: 2, inset: 26 }, { k: 'lining', t: 6 }]],
      ].map(([y, layers], i) => (
        <g key={i}>
          <XSec cx={426} y={y - 10} w={70} layers={layers} />
        </g>
      ))}
      <T x={426} y={36} a="middle" s={10} c={C.faint}>across the width</T>
      <T x={78} y={306} a="middle" s={10} c={C.text}>lug fold</T>
      <T x={120} y={306} s={10} c={C.ruby}>hatched: the fold zone — no tape</T>
      <Note x={16} y={324} lines={['Stiff tape cracks in a fold; thin, flexible non-woven at the pins prevents tearing.', 'Both camps are right — about different materials.']} s={10} lh={13} c={C.text} />
    </Fig>
  )
}

/* t5-glue — thin solvent cement on both faces */
function ReinfGlue() {
  return (
    <Fig h={330} view="Section · gluing the reinforcement" scale="thickness exaggerated">
      <PrepDefs />
      <Panel x={14} y={30} w={222} h={132} />
      <Num x={28} y={46} n={1} r={7} />
      <T x={40} y={50} s={11.5} c={C.text} w="600">Top leather, flesh up</T>
      <Slab x={22} y={130} w={206} h={8} kind="board" />
      <Prof pts={[[28, 114], [222, 114], [222, 130], [28, 130]]} k="topF" />
      <rect x={28} y={110} width={140} height={4} fill="url(#sk-glue)" stroke={C.emerald} strokeWidth="0.5" />
      <Brush x={172} y={110} ang={40} k={0.8} />
      <Arrow a={[120, 94]} b={[60, 94]} w={1.4} />
      <T x={30} y={154} s={10.5} c={C.emerald}>thin coat on the flesh</T>

      <Panel x={244} y={30} w={224} h={132} />
      <Num x={258} y={46} n={2} r={7} />
      <T x={270} y={50} s={11.5} c={C.text} w="600">Reinforcement sheet</T>
      <Slab x={252} y={130} w={208} h={8} kind="board" />
      <rect x={258} y={126} width={196} height={4} fill="url(#pp-velo)" stroke="#4e6f84" strokeWidth="0.5" />
      <rect x={258} y={122} width={140} height={4} fill="url(#sk-glue)" stroke={C.emerald} strokeWidth="0.5" />
      <Brush x={402} y={122} ang={40} k={0.8} />
      <Arrow a={[350, 104]} b={[290, 104]} w={1.4} />
      <T x={260} y={154} s={10.5} c={C.emerald}>and on the sheet</T>

      {/* why solvent */}
      <Sep x1={14} y1={174} x2={466} y2={174} />
      <Tag x={16} y={192}>on a synthetic sheet · ×30</Tag>
      <Panel x={14} y={200} w={222} h={108} c={C.emerald} />
      <Verdict x={220} y={216} ok />
      <T x={24} y={218} s={11} c={C.emerald} w="600">Solvent contact cement</T>
      <rect x={28} y={258} width={194} height={22} fill="url(#pp-velo)" stroke="#4e6f84" />
      <path d="M28 258 L222 258 L222 250 Q170 247 120 250 Q70 252 28 249 Z" fill="rgba(140,192,149,0.75)" stroke={C.emerald} strokeWidth="0.8" />
      <T x={125} y={298} a="middle" s={10.5}>wets the fibres: an even film</T>

      <Panel x={244} y={200} w={224} h={108} c={C.ruby} />
      <Verdict x={452} y={216} ok={false} />
      <T x={254} y={218} s={11} c={C.ruby} w="600">Water-based</T>
      <rect x={258} y={258} width={196} height={22} fill="url(#pp-velo)" stroke="#4e6f84" />
      {[276, 312, 346, 384, 420].map((x, i) => (
        <path key={x} d={`M${x - 10} 258 Q${x - 9} ${246 - (i % 2) * 2} ${x} ${245 - (i % 2) * 2} Q${x + 9} ${246 - (i % 2) * 2} ${x + 10} 258 Z`} fill="rgba(140,192,149,0.75)" stroke={C.emerald} strokeWidth="0.8" />
      ))}
      <T x={356} y={298} a="middle" s={10.5}>beads up — grips poorly</T>
      <T x={240} y={324} a="middle" s={10} c={C.faint}>thin on both faces, then wait for tack · solvent cement: ventilate</T>
    </Fig>
  )
}

/* t5-press — block over paper; never a roller over folded reinforcement */
function ReinfPress() {
  const grid = (x, y, w, h, skew) => {
    const ls = []
    for (let i = 0; i <= 6; i++) {
      const xx = x + (w * i) / 6
      ls.push(<line key={`v${i}`} x1={xx} y1={y} x2={xx + skew * (i / 6) * 0 + (skew ? (i / 6) * skew : 0)} y2={y + h} stroke="#6b4b2a" strokeWidth="0.7" />)
    }
    for (let j = 0; j <= 4; j++) {
      const yy = y + (h * j) / 4
      ls.push(<line key={`h${j}`} x1={x} y1={yy} x2={x + w + (skew ? skew * (j / 4) * 0.4 : 0)} y2={yy} stroke="#6b4b2a" strokeWidth="0.7" />)
    }
    return ls
  }
  return (
    <Fig h={330} view="Section · pressing the reinforcement" scale="schematic">
      <PrepDefs />
      <Panel x={14} y={30} w={222} h={180} c={C.emerald} />
      <Verdict x={220} y={46} ok />
      <T x={24} y={50} s={11.5} c={C.emerald} w="600">Block over paper</T>
      <Slab x={24} y={176} w={202} h={9} kind="board" />
      <Prof pts={[[30, 162], [220, 162], [220, 176], [30, 176]]} k="topF" />
      <rect x={30} y={159} width={190} height={3} fill={C.velodon} />
      <rect x={26} y={154} width={198} height={5} fill="#f3eee2" stroke="#b9b09c" strokeWidth="0.6" />
      <rect x={60} y={116} width={130} height={38} rx="3" fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.9" />
      {[80, 125, 170].map((x) => (
        <Arrow key={x} a={[x, 74]} b={[x, 110]} w={1.8} />
      ))}
      <T x={125} y={68} a="middle" s={10.5} c={C.brass}>straight down, even</T>
      <T x={125} y={139} a="middle" s={10.5} c="#f3e2c6">wood block</T>
      <Lead p={[208, 156]} t={[228, 136]} text="paper" a="end" s={10.5} />
      <T x={30} y={200} s={10} c={C.faint}>reinforcement on the top’s flesh</T>

      <Panel x={244} y={30} w={224} h={180} c={C.ruby} />
      <Verdict x={452} y={46} ok={false} />
      <T x={254} y={50} s={11.5} c={C.ruby} w="600">Roller over a fold</T>
      {(() => {
        const cx = 300
        const cy = 150
        const r = 12
        return (
          <g>
            <Ply x1={cx} x2={460} y={cy - r - 14} t={14} open="l" />
            <Wrap cx={cx} cy={cy} r={r} t={14} xR={cx} conv={30} tail={50} ts={5} />
            <path d={`M${cx + 40} ${cy - r} L${cx} ${cy - r} A${r} ${r} 0 0 0 ${cx} ${cy + r}`} fill="none" stroke={C.velodon} strokeWidth="2.2" />
            <BarEnd cx={cx} cy={cy} r={r * 0.9} />
            <Roller x={322} y={cy - r - 14} k={0.9} />
            <Arrow a={[302, 100]} b={[262, 100]} c="ruby" w={1.4} />
            <path d={`M${cx - 18} ${cy - 6} l-6 -3 M${cx - 18} ${cy + 6} l-6 3`} stroke={C.ruby} strokeWidth="1.4" />
          </g>
        )
      })()}
      <T x={356} y={196} a="middle" s={10.5} c={C.ruby}>stretches and creases it</T>

      {/* distortion check */}
      <Sep x1={14} y1={222} x2={466} y2={222} />
      <Tag x={16} y={240}>the leather afterwards · plan</Tag>
      <rect x={40} y={252} width={150} height={60} fill="url(#sk-flesh)" stroke="#9c7c52" />
      {grid(40, 252, 150, 60, 0)}
      <Verdict x={208} y={268} ok />
      <T x={200} y={292} s={10.5} c={C.emerald}>undistorted</T>
      <path d="M270 252 L436 256 L440 316 L270 312 Z" fill="url(#sk-flesh)" stroke="#9c7c52" />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={270 + i * 25 + i * i * 0.6} y1={252 + i * 0.7} x2={270 + i * 25 + i * i * 0.9} y2={312 + i * 0.7} stroke="#6b4b2a" strokeWidth="0.7" />
      ))}
      {Array.from({ length: 5 }, (_, j) => (
        <line key={j} x1={270} y1={252 + j * 15} x2={436 + j} y2={256 + j * 15} stroke="#6b4b2a" strokeWidth="0.7" />
      ))}
      <Verdict x={456} y={268} ok={false} />
      <T x={354} y={326} a="middle" s={10.5} c={C.ruby}>rolled: stretched along the pass</T>
    </Fig>
  )
}

/* t5-pins — fabric round a stick slightly larger than the bar */
function Pins() {
  const fabric = (cx, cy, r, w = 3) => (
    <g>
      <circle cx={cx} cy={cy} r={r + w / 2} fill="none" stroke="#c9d4cf" strokeWidth={w} />
      <circle cx={cx} cy={cy} r={r + w / 2} fill="none" stroke="#8fa39b" strokeWidth={w} strokeDasharray="1.5 1.5" opacity="0.7" />
    </g>
  )
  const stick = (cx, cy, r) => <circle cx={cx} cy={cy} r={r} fill="#efe9dc" stroke="#b9b09c" strokeWidth="0.8" />
  const R = 13
  return (
    <Fig h={330} view="Section at the lug fold · lining the channel" scale="schematic">
      <PrepDefs />
      {/* 1 */}
      <Panel x={14} y={30} w={146} h={186} />
      <Num x={28} y={46} n={1} r={7} />
      <T x={40} y={50} s={11} c={C.text} w="600">Fabric round</T>
      <T x={40} y={64} s={11} c={C.text} w="600">a stick</T>
      {stick(86, 128, R)}
      {fabric(86, 128, R)}
      <path d={`M${86 + R + 1.5} 128 q6 14 -4 26`} fill="none" stroke="#c9d4cf" strokeWidth="3" />
      <circle cx={86} cy={128} r={9} fill="none" stroke={C.steel} strokeWidth="1" strokeDasharray="3 2" />
      <Lead p={[86 + R + 2, 120]} t={[150, 92]} text="thin fabric" a="end" s={10.5} />
      <Lead p={[78, 136]} t={[40, 186]} text="cotton-bud stick" a="start" s={10.5} />
      <T x={40} y={200} s={10} c={C.steel}>dashed: the bar</T>
      {/* 2 */}
      <Panel x={168} y={30} w={146} h={186} />
      <Num x={182} y={46} n={2} r={7} />
      <T x={194} y={50} s={11} c={C.text} w="600">Glue, fold the</T>
      <T x={194} y={64} s={11} c={C.text} w="600">strap round it</T>
      <Wrap cx={206} cy={128} r={R + 3} t={12} xR={206} conv={34} tail={60} ts={4} />
      <Ply x1={206} x2={312} y={128 - R - 3 - 12} t={12} open="l" />
      {stick(206, 128, R)}
      {fabric(206, 128, R)}
      <Lead p={[230, 108]} t={[244, 174]} text="fabric glued" sub="to the channel" a="middle" s={10.5} />
      {/* 3 */}
      <Panel x={322} y={30} w={146} h={186} />
      <Num x={336} y={46} n={3} r={7} />
      <T x={348} y={50} s={11} c={C.text} w="600">Stick out,</T>
      <T x={348} y={64} s={11} c={C.text} w="600">bar in</T>
      <Wrap cx={360} cy={128} r={R + 3} t={12} xR={360} conv={34} tail={60} ts={4} />
      <Ply x1={360} x2={466} y={128 - R - 3 - 12} t={12} open="l" />
      {fabric(360, 128, R)}
      <circle cx={360} cy={128} r={R - 0.5} fill={C.ground} />
      <BarEnd cx={360} cy={128} r={9} />
      <Lead p={[360 + R + 1, 132]} t={[398, 176]} text="lined channel" sub="bar can’t tear through" a="middle" s={10.5} c={C.emerald} />

      {/* plan */}
      <Sep x1={14} y1={228} x2={466} y2={228} />
      <Tag x={16} y={246}>plan · lug end</Tag>
      <StrapPlan T={{ x: 120, y: 284, s: 3 }} o={LONG({ x1: 60, tip: 'square' })} folds={[{ x: 0 }]} />
      <rect x={112} y={250} width={14} height={68} rx="2" fill="#c9d4cf" opacity="0.7" stroke="#8fa39b" strokeDasharray="2 2" />
      <rect x={114} y={240} width={10} height={88} rx="5" fill="#efe9dc" stroke="#b9b09c" />
      <Break x={300} y1={254} y2={314} />
      <Lead p={[124, 246]} t={[150, 244]} text="stick, ends proud" a="start" s={10.5} />
      <Lead p={[126, 300]} t={[160, 324]} text="fabric strip under the fold" a="start" s={10.5} />
      <Note x={320} y={262} lines={['stick slightly larger', 'than the spring bar,', 'so the bar slides in']} s={10.5} lh={14} />
    </Fig>
  )
}

/* ================================================================== */
/* T6 — Gluing & laminating                                             */
/* ================================================================== */

/* t6-roughen — scuff the flesh; scratch a smooth lining grain */
function Roughen() {
  return (
    <Fig h={330} view="Plan + detail · preparing both faces" scale="schematic">
      <PrepDefs />
      <Panel x={14} y={30} w={222} h={160} />
      <Num x={28} y={46} n={1} r={7} />
      <T x={40} y={50} s={11.5} c={C.text} w="600">Top: flesh side</T>
      <rect x={28} y={86} width={194} height={58} rx="2" fill="url(#sk-flesh)" stroke="#9c7c52" />
      <rect x={28} y={86} width={194} height={58} rx="2" fill="url(#sk-fibre)" />
      <rect x={28} y={86} width={120} height={58} fill="url(#pp-scuff)" />
      <Sander x={150} y={110} ang={-90} len={84} grit="" k={0.8} />
      <Arrow a={[150, 72]} b={[150, 150]} both w={1.3} />
      <T x={30} y={168} s={10.5}>scuff lightly — sanding stick</T>
      <T x={30} y={182} s={10} c={C.faint}>just break the surface</T>

      <Panel x={244} y={30} w={224} h={160} />
      <Num x={258} y={46} n={2} r={7} />
      <T x={270} y={50} s={11.5} c={C.text} w="600">Lining: smooth grain</T>
      <rect x={258} y={86} width={196} height={58} rx="2" fill="url(#sk-lin)" stroke={C.liningEdge} />
      <rect x={258} y={86} width={124} height={58} fill="url(#pp-scratch)" />
      <Awl kind="round" x={382} y={112} ang={40} k={0.6} />
      <T x={260} y={168} s={10.5}>scratch it with an awl</T>
      <T x={260} y={182} s={10} c={C.faint}>a fine cross-hatch</T>

      <Sep x1={14} y1={202} x2={466} y2={202} />
      <Tag x={16} y={220}>why · the bond line in section ×50</Tag>
      <Panel x={14} y={228} w={222} h={96} c={C.ruby} />
      <Verdict x={220} y={244} ok={false} />
      <T x={24} y={246} s={11} c={C.ruby} w="600">Smooth</T>
      <rect x={28} y={278} width={194} height={22} fill="url(#sk-linS)" stroke="#8f7b5a" />
      <rect x={28} y={272} width={194} height={6} fill="rgba(140,192,149,0.7)" stroke={C.emerald} strokeWidth="0.6" />
      <path d="M150 272 q10 -8 30 -6" fill="none" stroke={C.ruby} strokeWidth="1.4" />
      <T x={125} y={316} a="middle" s={10.5}>cement sits on top — peels</T>

      <Panel x={244} y={228} w={224} h={96} c={C.emerald} />
      <Verdict x={452} y={244} ok />
      <T x={254} y={246} s={11} c={C.emerald} w="600">Roughened</T>
      <path d={`M258 278 ${Array.from({ length: 24 }, (_, i) => `L${262 + i * 8} ${i % 2 ? 278 : 284}`).join(' ')} L454 278 L454 300 L258 300 Z`} fill="url(#sk-linS)" stroke="#8f7b5a" />
      <path d={`M258 272 L454 272 L454 278 ${Array.from({ length: 24 }, (_, i) => `L${454 - 4 - i * 8} ${i % 2 ? 284 : 278}`).join(' ')} L258 278 Z`} fill="rgba(140,192,149,0.7)" stroke={C.emerald} strokeWidth="0.6" />
      <T x={356} y={316} a="middle" s={10.5}>cement keys into the scratches</T>
    </Fig>
  )
}

/* t6-stops — no glue within 10 mm of the lug fold or 14 mm of the buckle fold */
function Stops() {
  const Tr = { x: 100, y: 96, s: 3 }
  const o = SHORT({ x0: -20, x1: 105 })
  const X = (x) => Tr.x + x * Tr.s
  return (
    <Fig h={330} view="Plan + section · glue stops" scale="short piece · plan ×3">
      <PrepDefs />
      <Tag x={16} y={40}>flesh side up</Tag>
      <StrapPlan
        T={Tr}
        o={o}
        face="flesh"
        folds={[{ x: 0 }, { x: 80 }]}
        zones={[
          { from: -20, to: 10, k: 'noglue' },
          { from: 10, to: 66, k: 'glue' },
          { from: 66, to: 105, k: 'noglue' },
        ]}
      />
      {[10, 66].map((x) => (
        <line key={x} x1={X(x)} y1={Tr.y - 36} x2={X(x)} y2={226} stroke={C.brassHi} strokeWidth="1.3" strokeDasharray={x ? '6 3' : undefined} />
      ))}
      <Dim a={[X(0), 50]} b={[X(10), 50]} text="10" />
      <Dim a={[X(66), 50]} b={[X(80), 50]} text="14" />
      <line x1={X(0)} y1={46} x2={X(0)} y2={62} stroke={C.dim} strokeWidth="0.6" />
      <line x1={X(80)} y1={46} x2={X(80)} y2={62} stroke={C.dim} strokeWidth="0.6" />
      <T x={X(0)} y={142} a="middle" s={10} c={C.text}>lug fold</T>
      <T x={X(80)} y={142} a="middle" s={10} c={C.text}>buckle fold</T>
      <T x={X(38)} y={Tr.y + 4} a="middle" s={10.5} c="#2f4a33" w="600">glue</T>
      <T x={X(10) + 4} y={156} s={10} c={C.brassHi}>stop</T>
      <T x={X(66) - 4} y={156} a="end" s={10} c={C.brassHi}>stop</T>

      {/* the same in section */}
      <StrapSection x1={X(0)} x2={X(80)} y={196} s={3} k={9} left={{ kind: 'bar' }} right={{ kind: 'buckle' }} glue={{}} />
      <Lead p={[X(0) - 6, 226]} t={[40, 258]} text="lug fold free to roll" sub="bar channel clear" a="start" c={C.ruby} />
      <Lead p={[X(80) + 4, 228]} t={[430, 270]} text="buckle fold free" a="end" c={C.ruby} />
      <Lead p={[X(38), 206]} t={[X(38), 270]} text="glued: lining to top" a="middle" c={C.emerald} />
      <Legend x={150} y={312} items={[['glue', 'glue'], ['noglue', 'no glue']]} />
      <T x={466} y={316} a="end" s={10} c={C.faint}>long piece: the same 10 mm at its lug fold</T>
    </Fig>
  )
}

/* t6-coat — one thin even coat on each face, up to the stops */
function Coat() {
  return (
    <Fig h={340} view="Plan + section · coating" scale="schematic">
      <PrepDefs />
      <Tag x={16} y={40}>both faces, up to the stop lines</Tag>
      {/* top piece */}
      <rect x={40} y={58} width={300} height={44} rx="2" fill="url(#sk-flesh)" stroke="#9c7c52" />
      <rect x={40} y={58} width={300} height={44} rx="2" fill="url(#sk-fibre)" />
      <rect x={84} y={58} width={150} height={44} fill="rgba(140,192,149,0.45)" />
      <rect x={234} y={58} width={56} height={44} fill="rgba(140,192,149,0.18)" />
      {/* lining */}
      <rect x={30} y={120} width={320} height={60} rx="2" fill="url(#sk-lin)" stroke={C.liningEdge} />
      <rect x={84} y={128} width={206} height={44} fill="rgba(140,192,149,0.45)" />
      {[84, 290].map((x) => (
        <line key={x} x1={x} y1={50} x2={x} y2={188} stroke={C.brassHi} strokeWidth="1.2" strokeDasharray="6 3" />
      ))}
      <Brush x={240} y={80} ang={60} k={0.7} />
      <Arrow a={[200, 112]} b={[262, 112]} w={1.4} />
      <T x={348} y={84} s={10.5} c={C.text}>top, flesh</T>
      <T x={358} y={154} s={10.5} c={C.text}>lining</T>
      <T x={84} y={200} a="middle" s={10} c={C.brassHi}>stop</T>
      <T x={290} y={200} a="middle" s={10} c={C.brassHi}>stop</T>
      <T x={187} y={200} a="middle" s={10.5} c={C.emerald}>thin, even, full coat</T>

      <Sep x1={14} y1={212} x2={466} y2={212} />
      <Panel x={14} y={220} w={222} h={74} c={C.emerald} />
      <Verdict x={220} y={236} ok />
      <T x={24} y={238} s={11} c={C.emerald} w="600">Thin full coat</T>
      <rect x={28} y={262} width={194} height={14} fill="url(#pp-topF)" stroke="#4a3018" strokeWidth="0.6" />
      <rect x={28} y={258} width={194} height={4} fill="rgba(140,192,149,0.8)" stroke={C.emerald} strokeWidth="0.5" />
      <T x={125} y={288} a="middle" s={10}>does not stiffen the strap</T>

      <Panel x={244} y={220} w={224} h={74} c={C.ruby} />
      <Verdict x={452} y={236} ok={false} />
      <T x={254} y={238} s={11} c={C.ruby} w="600">Puddles</T>
      <rect x={258} y={262} width={196} height={14} fill="url(#pp-topF)" stroke="#4a3018" strokeWidth="0.6" />
      <path d="M258 262 L280 262 Q296 248 316 262 L360 262 Q368 255 378 262 L400 262 Q418 244 438 262 L454 262 Z" fill="rgba(140,192,149,0.8)" stroke={C.emerald} strokeWidth="0.6" />
      <T x={356} y={288} a="middle" s={10}>hard lumps — these stiffen it</T>

      {/* caution */}
      <rect x={14} y={302} width={454} height={32} rx="6" fill="rgba(194,88,99,0.10)" stroke={C.ruby} />
      <circle cx={32} cy={318} r={8} fill="none" stroke={C.ruby} strokeWidth="1.4" />
      <T x={32} y={322} a="middle" s={11} c={C.ruby} w="700">!</T>
      <T x={48} y={315} s={10.5} c={C.text}>Solvent cement: cross-ventilation or a fitted organic-vapour respirator.</T>
      <T x={48} y={328} s={10} c={C.dim}>Water-based cement is the lower-hazard choice.</T>
    </Fig>
  )
}

/* t6-tack — wet → tacky → too dry */
function Tack() {
  const state = (x, title, c, ok, kind) => (
    <g>
      <Panel x={x} y={30} w={146} h={128} c={c} />
      <Verdict x={x + 130} y={46} ok={ok} />
      <T x={x + 10} y={50} s={11.5} c={c} w="600">{title}</T>
      <rect x={x + 12} y={118} width={122} height={12} fill="url(#pp-topF)" stroke="#4a3018" strokeWidth="0.6" />
      <rect x={x + 12} y={113} width={122} height={5} fill={kind === 'wet' ? 'rgba(160,220,175,0.95)' : kind === 'tacky' ? 'rgba(140,192,149,0.75)' : 'rgba(150,160,140,0.6)'} stroke={C.emerald} strokeWidth="0.5" />
      {kind === 'wet' && <line x1={x + 20} y1={114} x2={x + 60} y2={114} stroke="#ffffff" strokeWidth="1" opacity="0.8" />}
      {kind === 'dry' && <path d={`M${x + 30} 114 l6 3 M${x + 70} 114 l-5 3 M${x + 100} 114 l4 3`} stroke="#5c5a52" strokeWidth="0.8" />}
      {/* knuckle */}
      <path d={`M${x + 50} 66 L${x + 50} 92 Q${x + 50} ${kind === 'wet' ? 108 : 104} ${x + 73} ${kind === 'wet' ? 108 : 104} Q${x + 96} ${kind === 'wet' ? 108 : 104} ${x + 96} 92 L${x + 96} 66`} fill="rgba(214,170,140,0.28)" stroke="#a57e66" strokeWidth="1" />
      {kind === 'wet' && <path d={`M${x + 62} 108 L${x + 62} 113 M${x + 73} 108.5 L${x + 73} 113 M${x + 84} 108 L${x + 84} 113`} stroke="rgba(160,220,175,0.95)" strokeWidth="2" />}
      <T x={x + 73} y={146} a="middle" s={10.5} c={c}>{{ wet: 'glossy — transfers', tacky: 'grips, nothing transfers', dry: 'dull — no grab' }[kind]}</T>
    </g>
  )
  const x0 = 150
  const k = 12.4 // px per minute
  const X = (m) => x0 + m * k
  const rows = [
    ['Water-based, thin', [2, 3], '2–3 min'],
    ['Water-based, heavy', [10, 20], '10–20 min'],
    ['Solvent cement', [5, 10], '5–10 min'],
  ]
  return (
    <Fig h={352} view="Chart · the tack window" scale="knuckle test">
      <PrepDefs />
      <defs>
        <linearGradient id="pp-dryfade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgb(123,165,131)" stopOpacity="0.75" />
          <stop offset="1" stopColor="rgb(140,140,130)" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      {state(14, 'Wet', C.ruby, false, 'wet')}
      {state(167, 'Tacky', C.emerald, true, 'tacky')}
      {state(320, 'Too dry', C.ruby, false, 'dry')}
      <Arrow a={[160, 94]} b={[168, 94]} w={1.4} />
      <Arrow a={[313, 94]} b={[321, 94]} w={1.4} />

      <Sep x1={14} y1={170} x2={466} y2={170} />
      <Tag x={16} y={188}>when it turns tacky · minutes</Tag>
      {[0, 5, 10, 15, 20, 25].map((m) => (
        <g key={m}>
          <line x1={X(m)} y1={198} x2={X(m)} y2={298} stroke={C.line} strokeWidth="0.8" />
          <T x={X(m)} y={312} a="middle" s={10} mono>{m}</T>
        </g>
      ))}
      {rows.map(([name, [a, b], lab], i) => {
        const y = 206 + i * 32
        const tk = Math.min(X(25), X(b + 6))
        const fd = Math.min(X(25), X(b + 11))
        return (
          <g key={name}>
            <T x={x0 - 8} y={y + 12} a="end" s={10.5} c={C.text}>{name}</T>
            <rect x={X(0)} y={y} width={X(a) - X(0)} height={16} fill="rgba(134,167,189,0.55)" />
            <rect x={X(a)} y={y} width={X(b) - X(a)} height={16} fill="rgba(123,165,131,0.30)" stroke={C.emerald} strokeWidth="0.6" strokeDasharray="2 2" />
            <rect x={X(b)} y={y} width={tk - X(b)} height={16} fill="rgba(123,165,131,0.75)" />
            {fd > tk && <rect x={tk} y={y} width={fd - tk} height={16} fill="url(#pp-dryfade)" />}
            <T x={X(b) + 4} y={y + 12} s={10} c="#16241a" w="600">tacky</T>
            <T x={(X(a) + X(b)) / 2} y={y - 3} a="middle" s={10} c={C.brassHi} mono>{lab}</T>
          </g>
        )
      })}
      <Legend x={60} y={330} items={[['rgba(134,167,189,0.55)', 'wet'], ['rgba(123,165,131,0.30)', 'turning'], ['rgba(123,165,131,0.75)', 'tacky: bond now'], ['rgba(140,140,130,0.6)', 'too dry']]} />
      <T x={240} y={346} a="middle" s={10} c={C.faint}>how long it stays tacky varies by glue — test on scrap</T>
    </Fig>
  )
}

/* t6-align — register at one end on the centreline, then lay forward */
function Align() {
  return (
    <Fig h={342} view="Side view + plan · laying the lining" scale="schematic">
      <PrepDefs />
      <Tag x={16} y={40}>side view</Tag>
      <Slab x={20} y={138} w={430} h={10} kind="board" />
      <Prof pts={[[40, 126], [420, 126], [420, 138], [40, 138]]} k="topF" />
      <rect x={40} y={123} width={380} height={3} fill="url(#sk-glue)" />
      {/* lining: laid at the left, lifting to the right */}
      <path d="M40 117 L150 117 Q230 117 300 82 Q340 62 400 56 L401 64 Q344 70 304 90 Q234 124 150 123 L40 123 Z" fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.8" />
      <line x1={40} y1={123} x2={150} y2={123} stroke={C.emerald} strokeWidth="2.4" />
      <circle cx={42} cy={120} r={5} fill="none" stroke={C.brassHi} strokeWidth="1.4" />
      <Arrow d="M190 98 Q240 90 268 70" w={1.8} />
      <T x={252} y={60} a="end" s={10.5} c={C.brass}>lay forward</T>
      <Lead p={[42, 115]} t={[60, 70]} text="register here first" sub="one end, on the centreline" a="start" c={C.brassHi} />
      <Lead p={[110, 124]} t={[130, 168]} text="contact = grab" sub="no sliding it now" a="start" c={C.emerald} />
      <Lead p={[380, 60]} t={[440, 98]} text="lining" sub="glue side down" a="end" />
      <T x={300} y={164} s={10} c={C.faint}>top, flesh up, tacky</T>

      <Sep x1={14} y1={190} x2={466} y2={190} />
      <Tag x={16} y={208}>plan · registration</Tag>
      <rect x={40} y={246} width={300} height={48} rx="2" fill="url(#sk-flesh)" stroke="#9c7c52" />
      <rect x={170} y={226} width={230} height={88} rx="2" fill="rgba(226,210,179,0.16)" stroke={C.liningEdge} strokeDasharray="4 3" />
      <rect x={34} y={226} width={136} height={88} rx="2" fill="url(#sk-lin)" stroke={C.liningEdge} />
      <line x1={24} y1={270} x2={410} y2={270} stroke={C.steel} strokeWidth="1" strokeDasharray="10 3 2 3" />
      <g>
        <circle cx={40} cy={270} r={7} fill="none" stroke={C.brassHi} strokeWidth="1.4" />
        <line x1={32} y1={270} x2={48} y2={270} stroke={C.brassHi} strokeWidth="1.4" />
        <line x1={40} y1={262} x2={40} y2={278} stroke={C.brassHi} strokeWidth="1.4" />
      </g>
      <T x={102} y={244} a="middle" s={10.5} c="#5a4630">laid so far</T>
      <T x={285} y={242} a="middle" s={10.5} c={C.dim}>lining still lifted</T>
      <T x={255} y={290} a="middle" s={10} c="#5a3a1a">top, tacky</T>
      <T x={466} y={286} a="end" s={10.5} c={C.steel}>centreline</T>
      <Lead p={[40, 278]} t={[60, 300]} text="centrelines matched" a="start" s={10} c="#5a4630" />
      <Arrow a={[190, 330]} b={[320, 330]} w={1.6} />
      <T x={330} y={334} s={10.5} c={C.brass}>lay forward, smoothing</T>
    </Fig>
  )
}

/* t6-boat — the long lining laid over a former */
function Boat() {
  const cx = 232
  const cy = 226
  const R = 88
  const P_ = (r, a) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))]
  const band = (r1, r2, a0, a1, fill, stroke) => {
    const [x1, y1] = P_(r1, a0)
    const [x2, y2] = P_(r1, a1)
    const [x3, y3] = P_(r2, a1)
    const [x4, y4] = P_(r2, a0)
    return <path d={`M${x1} ${y1} A${r1} ${r1} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${r2} ${r2} 0 0 0 ${x4} ${y4} Z`} fill={fill} stroke={stroke} strokeWidth="0.8" />
  }
  const tLin = 7
  const tTop = 12
  const [ex, ey] = P_(R + tLin + tTop / 2, -70)
  const L1 = P_(R + 3, -165)
  const L2 = P_(R + 3, -15)
  const pl = P_(R + 3.5, -150)
  const pt = P_(R + tLin + tTop / 2, -160)
  return (
    <Fig h={340} view="Side view · boating the long lining" scale="schematic">
      <PrepDefs />
      <Bottle cx={cx} cy={cy} r={R} />
      {band(R + tLin, R, -165, -15, 'url(#sk-linS)', '#8f7b5a')}
      {band(R + tLin + tTop, R + tLin, -165, -70, 'url(#sk-topS)', '#4a3018')}
      <path d={`M${P_(R + tLin + tTop, -70).join(' ')} Q${ex + 50} ${ey - 30} ${ex + 120} ${ey - 30} L${ex + 122} ${ey - 18} Q${ex + 56} ${ey - 18} ${P_(R + tLin, -70).join(' ')} Z`} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <path d={`M${P_(R + tLin, -70).join(' ')} A${R + tLin} ${R + tLin} 0 0 1 ${P_(R + tLin, -15).join(' ')}`} fill="none" stroke={C.glue} strokeWidth="2.2" strokeDasharray="1.2 2.6" />
      <Arrow d={`M${L1[0]} ${L1[1] + 4} q-6 14 -2 30`} c="emerald" w={1.6} />
      <Arrow d={`M${L2[0]} ${L2[1] + 4} q6 14 2 30`} c="emerald" w={1.6} />
      <T x={L1[0] - 10} y={L1[1] + 34} a="end" s={10.5} c={C.emerald}>pull</T>
      <T x={L2[0] + 10} y={L2[1] + 34} s={10.5} c={C.emerald}>pull</T>
      <Arrow d={`M${ex + 66} ${ey - 50} q-26 4 -46 22`} w={1.6} />
      <T x={ex + 72} y={ey - 50} s={10.5} c={C.brass}>lay the top over it</T>
      <Lead p={[ex + 10, ey + 14]} t={[ex + 64, ey + 30]} text="glue still open" a="start" s={10} c={C.emerald} />
      <Note x={16} y={98} lines={['long lining,', 'glue side out,', 'stretched slightly']} s={10.5} lh={13} />
      <line x1={112} y1={108} x2={pl[0]} y2={pl[1]} stroke={C.struct} strokeWidth="0.8" />
      <circle cx={pl[0]} cy={pl[1]} r="2.2" fill={C.text} />
      <Note x={16} y={232} lines={['top: bonds in', 'its wearing', 'curve']} s={10.5} lh={13} />
      <line x1={88} y1={234} x2={pt[0]} y2={pt[1]} stroke={C.struct} strokeWidth="0.8" />
      <circle cx={pt[0]} cy={pt[1]} r="2.2" fill={C.text} />
      <T x={cx} y={cy + 6} a="middle" s={10.5} c="#8fbcae">former: a bottle,</T>
      <T x={cx} y={cy + 20} a="middle" s={10.5} c="#8fbcae">a rod or your thigh</T>

      <Panel x={350} y={190} w={118} h={142} c={C.emerald} />
      <Tag x={360} y={208}>short lining</Tag>
      <Slab x={358} y={272} w={102} h={8} kind="board" />
      <rect x={364} y={254} width={90} height={11} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />
      <rect x={364} y={265} width={90} height={7} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.6" />
      <T x={409} y={300} a="middle" s={10.5} c={C.emerald}>laid flat</T>
      <T x={409} y={314} a="middle" s={10} c={C.faint}>barely curves</T>
      <T x={409} y={326} a="middle" s={10} c={C.faint}>on the wrist</T>
    </Fig>
  )
}

/* t6-press — roll, then tap; crepe rubber for squeeze-out */
function GluePress() {
  const lam = (x, w, y) => (
    <g>
      <rect x={x} y={y} width={w} height={12} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />
      <rect x={x} y={y + 12} width={w} height={8} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.6" />
      <GlueLine x1={x + 2} x2={x + w - 2} y={y + 12} />
    </g>
  )
  return (
    <Fig h={330} view="Section · pressing the bond" scale="schematic">
      <PrepDefs />
      {[
        [14, 1, 'Roll firmly'],
        [170, 2, 'Tap lightly'],
        [326, 3, 'Lift squeeze-out'],
      ].map(([x, n, t]) => (
        <g key={n}>
          <Panel x={x} y={30} w={142} h={220} />
          <Num x={x + 14} y={46} n={n} r={7} />
          <T x={x + 26} y={50} s={11.5} c={C.text} w="600">{t}</T>
          <Slab x={x + 8} y={212} w={126} h={10} kind="board" />
          {lam(x + 14, 114, 192)}
        </g>
      ))}
      <Roller x={70} y={192} k={1} />
      <Arrow a={[40, 236]} b={[124, 236]} both w={1.4} />
      <Hammer x={232} y={178} k={0.72} />
      {[218, 246].map((x) => (
        <path key={x} d={`M${x} 186 q-4 -4 0 -8`} fill="none" stroke={C.brass} strokeWidth="1.2" />
      ))}
      <Arrow a={[200, 118]} b={[200, 172]} w={1.4} dash="3 3" />
      <T x={241} y={240} a="middle" s={10.5} c={C.text}>polished face, light taps</T>
      {/* crepe */}
      {[[443, 203, 3.2], [436, 191, 2.4], [420, 191, 2]].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.8} fill="rgba(140,192,149,0.95)" stroke={C.emerald} strokeWidth="0.5" />
      ))}
      <rect x={398} y={148} width={44} height={32} rx="4" fill="url(#pp-crepe)" stroke="#8a6c34" strokeWidth="0.8" />
      <Arrow a={[392, 138]} b={[448, 138]} both w={1.3} />
      <T x={420} y={126} a="middle" s={10.5} c={C.text}>crepe rubber</T>
      <T x={397} y={88} a="middle" s={10} c={C.faint}>rub: it rolls the</T>
      <T x={397} y={101} a="middle" s={10} c={C.faint}>excess glue up</T>
      <Lead p={[444, 205]} t={[397, 240]} text="squeeze-out" a="middle" c={C.emerald} s={10.5} />

      <Sep x1={14} y1={262} x2={466} y2={262} />
      <rect x={14} y={272} width={454} height={50} rx="6" fill="rgba(208,168,79,0.08)" stroke={C.brass} />
      <T x={28} y={292} s={12} c={C.brassHi} w="600" mono>≥ 1 bar</T>
      <T x={100} y={292} s={10.5} c={C.text}>the bond needs about 1 bar of pressure or more</T>
      <T x={100} y={308} s={10} c={C.faint}>≈ 1 kg on every square centimetre — firm roller, then the hammer</T>
    </Fig>
  )
}

/* t6-channel — a former rod holds the lug channel open while the glue sets */
function Channel() {
  const fold = (cx, cy, r, ok) => (
    <g>
      <Ply x1={cx} x2={cx + 170} y={cy - r - 14} t={14} open="l" />
      {ok ? (
        <g>
          <Wrap cx={cx} cy={cy} r={r} t={14} xR={cx} conv={r * 2.6} tail={60} ts={6} />
          <circle cx={cx} cy={cy} r={r * 0.96} fill="url(#sk-barEnd)" stroke="#2d3940" strokeWidth="0.8" />
        </g>
      ) : (
        <g>
          <Wrap cx={cx} cy={cy - r + 4} r={4} t={14} xR={cx} conv={14} tail={58} ts={6} />
          <circle cx={cx} cy={cy - r + 4} r={3.6} fill="rgba(140,192,149,0.95)" />
        </g>
      )}
      <polygon points={P([[cx + r * 2.8, cy - r], [cx + 170, cy - r], [cx + 170, cy - r + 8], [cx + r * 4, cy - r + 8]])} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.8" />
    </g>
  )
  return (
    <Fig h={330} view="Section + plan · keeping the channel open" scale="schematic">
      <PrepDefs />
      <Panel x={14} y={30} w={222} h={150} c={C.emerald} />
      <Verdict x={220} y={46} ok />
      <T x={24} y={50} s={11.5} c={C.emerald} w="600">Rod in the fold</T>
      {fold(62, 112, 14, true)}
      <Lead p={[62, 104]} t={[44, 148]} text="former rod" a="start" s={10.5} />
      <T x={125} y={172} a="middle" s={10} c={C.faint}>round and open as it sets</T>

      <Panel x={244} y={30} w={224} h={150} c={C.ruby} />
      <Verdict x={452} y={46} ok={false} />
      <T x={254} y={50} s={11.5} c={C.ruby} w="600">No rod</T>
      {fold(292, 112, 14, false)}
      <Lead p={[292, 102]} t={[270, 150]} text="channel collapsed, glued shut" sub="no room left for the bar" a="start" c={C.ruby} s={10.5} />

      <Sep x1={14} y1={192} x2={466} y2={192} />
      <Tag x={16} y={210}>plan · lug end while it sets</Tag>
      <StrapPlan T={{ x: 120, y: 262, s: 3 }} o={LONG({ x1: 70, tip: 'square' })} folds={[{ x: 0 }]} />
      <Break x={330} y1={230} y2={294} />
      <rect x={114} y={214} width={12} height={96} rx="6" fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.8" />
      <Lead p={[120, 218]} t={[150, 222]} text="rod through the fold, ends proud" a="start" s={10.5} />
      <Note x={340} y={244} lines={['any fold being glued', 'gets a rod while', 'the glue sets']} s={10.5} lh={14} />
    </Fig>
  )
}

/* t6-cure — 30–60 min before stitching; 24 h under weight for no-sew */
function Cure() {
  return (
    <Fig h={320} view="Chart · curing time" scale="two time scales">
      <PrepDefs />
      {/* stitched build */}
      <Num x={24} y={44} n={1} r={7} />
      <T x={36} y={48} s={11.5} c={C.text} w="600">Laminate to be cut and stitched</T>
      <Slab x={20} y={98} w={150} h={8} kind="board" />
      <rect x={28} y={78} width={134} height={12} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />
      <rect x={28} y={90} width={134} height={8} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.6" />
      <T x={95} y={124} a="middle" s={10} c={C.faint}>rests flat, untouched</T>
      {(() => {
        const x0 = 196
        const k = 4.2
        const X = (m) => x0 + m * k
        return (
          <g>
            <rect x={X(0)} y={76} width={X(30) - X(0)} height={18} fill="rgba(134,167,189,0.35)" />
            <rect x={X(30)} y={76} width={X(60) - X(30)} height={18} fill="rgba(123,165,131,0.65)" stroke={C.emerald} />
            {[0, 15, 30, 45, 60].map((m) => (
              <g key={m}>
                <line x1={X(m)} y1={72} x2={X(m)} y2={98} stroke={C.line} />
                <T x={X(m)} y={112} a="middle" s={10} mono>{m}</T>
              </g>
            ))}
            <T x={X(15)} y={89} a="middle" s={10} c={C.text}>wait</T>
            <T x={X(45)} y={89} a="middle" s={10} c="#16241a" w="600">ready</T>
            <T x={X(60) + 16} y={112} s={10} c={C.faint}>min</T>
            <Arrow a={[X(60) + 4, 85]} b={[X(60) + 24, 85]} w={1.4} />
            <T x={X(30)} y={134} a="middle" s={10.5} c={C.emerald}>30–60 min, then the final cut and stitching</T>
          </g>
        )
      })()}

      <Sep x1={14} y1={150} x2={466} y2={150} />
      {/* no-sew */}
      <Num x={24} y={172} n={2} r={7} />
      <T x={36} y={176} s={11.5} c={C.text} w="600">No-sew strap</T>
      <Slab x={20} y={276} w={150} h={8} kind="board" />
      <rect x={28} y={256} width={134} height={10} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />
      <rect x={28} y={266} width={134} height={10} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />
      <rect x={34} y={250} width={122} height={6} fill="#f3eee2" stroke="#b9b09c" strokeWidth="0.6" />
      <Weight x={95} y={250} w={110} />
      {[56, 95, 134].map((x) => (
        <Arrow key={x} a={[x, 196]} b={[x, 212]} w={1.4} />
      ))}
      <T x={95} y={300} a="middle" s={10} c={C.faint}>under weight, on a flat board</T>
      {(() => {
        const x0 = 196
        const k = 10.5
        const X = (h) => x0 + h * k
        return (
          <g>
            <rect x={X(0)} y={236} width={X(24) - X(0)} height={18} fill="rgba(134,167,189,0.35)" />
            <rect x={X(24) - 1} y={236} width={8} height={18} fill="rgba(123,165,131,0.85)" />
            {[0, 6, 12, 18, 24].map((h) => (
              <g key={h}>
                <line x1={X(h)} y1={232} x2={X(h)} y2={258} stroke={C.line} />
                <T x={X(h)} y={272} a="middle" s={10} mono>{h}</T>
              </g>
            ))}
            <T x={X(12)} y={249} a="middle" s={10} c={C.text}>under weight</T>
            <T x={X(24) + 12} y={272} s={10} c={C.faint}>h</T>
            <T x={X(12)} y={294} a="middle" s={10.5} c={C.emerald}>24 h before it is handled</T>
          </g>
        )
      })()}
      <T x={240} y={314} a="middle" s={10} c={C.faint}>scales differ: minutes above, hours below</T>
    </Fig>
  )
}

export const FIGS = {
  't2-hone': Hone,
  't2-refine': Refine,
  't2-strop': StropFig,
  't2-test': TestCut,
  't2-maintain': Maintain,
  't3-layout': Layout,
  't3-scribe': Scribe,
  't3-rough': Rough,
  't3-transfer': Transfer,
  't3-lining': LiningWide,
  't3-final': FinalCut,
  't3-check': CheckCut,
  't3-trimafter': TrimAfter,
  't3-laser': Laser,
  't4-scribe': SkiveScribe,
  't4-secure': Secure,
  't4-dampen': Dampen,
  't4-setup': Setup,
  't4-angle': Angle,
  't4-passes': Passes,
  't4-feather': Feather,
  't4-linings': Linings,
  't4-keepers': Keepers,
  't4-check': SkiveCheck,
  't4-errors': SkiveErrors,
  't5-material': Material,
  't5-placement': Placement,
  't5-glue': ReinfGlue,
  't5-press': ReinfPress,
  't5-pins': Pins,
  't6-roughen': Roughen,
  't6-stops': Stops,
  't6-coat': Coat,
  't6-tack': Tack,
  't6-align': Align,
  't6-boat': Boat,
  't6-press': GluePress,
  't6-channel': Channel,
  't6-cure': Cure,
}
