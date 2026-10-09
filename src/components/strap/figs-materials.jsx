// Strap diagrams — materials, the bench, and sizing & drafting the pattern
// (lessons sm-leather, sm-tools, sm-design). See AUTHORING.md.
import { useId } from 'react'
import { C, MONO, Fig, T, Note, Lead, Arrow, Num, Verdict, Tag, Sep } from './kit.jsx'
import { StrapPlan, Ply, Wrap, BarEnd, XSec, Buckle, SpringBar, CaseSide, Wrist } from './parts.jsx'
import { StrapSection } from './sections.jsx'
import { LONG, SHORT, outline, pathOf, px, holeXs } from './geom.js'
import { Knife, Rule, Iron, Mallet, Hammer, Awl, Punch, Beveller, Sander, Dividers, Calipers, BoneFolder, Roller, Pliers, Pony, Creaser, Burner, Slab, NotchPlier, Needle } from './tools.jsx'

const uid = () => useId().replace(/[^a-zA-Z0-9]/g, '')
const LIGHT = '#f6ead6' // text on leather

/* ------------------------------------------------------------------ */
/* Local helpers                                                        */
/* ------------------------------------------------------------------ */

// Vertical dimension with the figure written level (kit Dim turns it 90°).
// `from` draws extension lines back to a feature at that x.
function VDim({ x, y1, y2, text, side = 'r', c = C.dim, s = 10.5, from }) {
  const short = Math.abs(y2 - y1) < 18
  const d = side === 'r' ? 1 : -1
  const g = from == null ? 0 : Math.sign(x - from)
  return (
    <g>
      {from != null && (
        <g stroke={c} strokeWidth="0.6" opacity="0.6">
          <line x1={from + g * 2} y1={y1} x2={x + g * 3} y2={y1} />
          <line x1={from + g * 2} y1={y2} x2={x + g * 3} y2={y2} />
        </g>
      )}
      <line
        x1={x}
        y1={y1}
        x2={x}
        y2={y2}
        stroke={c}
        strokeWidth="0.85"
        markerStart={short ? undefined : 'url(#sk-a-dim)'}
        markerEnd={short ? undefined : 'url(#sk-a-dim)'}
      />
      {short && (
        <g stroke={c} strokeWidth="1.1">
          <line x1={x - 3} y1={y1} x2={x + 3} y2={y1} />
          <line x1={x - 3} y1={y2} x2={x + 3} y2={y2} />
        </g>
      )}
      {text && (
        <text x={x + d * 5} y={(y1 + y2) / 2 + s * 0.36} fontSize={s} fill={c} fontFamily={MONO} textAnchor={d > 0 ? 'start' : 'end'}>
          {text}
        </text>
      )}
    </g>
  )
}

// Horizontal dimension line with the figure centred above (or below) it.
function HDim({ x1, x2, y, text, below, c = C.dim, s = 10.5, ext }) {
  const short = Math.abs(x2 - x1) < 22
  return (
    <g>
      {ext != null && (
        <g stroke={c} strokeWidth="0.6" opacity="0.6">
          <line x1={x1} y1={ext} x2={x1} y2={y + Math.sign(y - ext) * 3} />
          <line x1={x2} y1={ext} x2={x2} y2={y + Math.sign(y - ext) * 3} />
        </g>
      )}
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke={c}
        strokeWidth="0.85"
        markerStart={short ? undefined : 'url(#sk-a-dim)'}
        markerEnd={short ? undefined : 'url(#sk-a-dim)'}
      />
      {short && (
        <g stroke={c} strokeWidth="1.1">
          <line x1={x1} y1={y - 3} x2={x1} y2={y + 3} />
          <line x1={x2} y1={y - 3} x2={x2} y2={y + 3} />
        </g>
      )}
      {text && (
        <text x={(x1 + x2) / 2} y={below ? y + s + 2 : y - 4} fontSize={s} fill={c} fontFamily={MONO} textAnchor="middle">
          {text}
        </text>
      )}
    </g>
  )
}

const Panel = ({ x, y, w, h, c = C.line, dash }) => (
  <rect x={x} y={y} width={w} height={h} rx="8" fill="rgba(255,255,255,0.025)" stroke={c} strokeDasharray={dash} />
)

// Break mark on a cut-off section end.
const Brk = ({ x, y1, y2 }) => {
  const h = y2 - y1 + 8
  return <path d={`M${x - 3} ${y1 - 4} l6 ${h * 0.3} l-6 ${h * 0.4} l6 ${h * 0.3}`} fill="none" stroke={C.dim} strokeWidth="1" />
}

// A plain rect ply in section.
const LAYER = {
  top: ['url(#sk-topS)', '#4a3018'],
  lining: ['url(#sk-linS)', '#8f7b5a'],
  chrome: ['#cfc8ba', '#7d7668'],
  vel: [C.velodon, '#4e6f84'],
  filler: ['url(#sk-fill)', '#3a2716'],
  grain: ['url(#sk-top)', '#5c3c1d'],
  flesh: ['url(#sk-flesh)', '#9c7c52'],
}
const Layer = ({ x, y, w, h, k = 'top', rx }) => {
  const f = LAYER[k]
  return <rect x={x} y={y} width={w} height={h} rx={rx} fill={f[0]} stroke={f[1]} strokeWidth="0.8" />
}

// Magnified detail: a dashed ring on the feature at (fx, fy) and a circle at
// (cx, cy) showing the same drawing (children) enlarged k times.
function Magnifier({ cx, cy, r, fx, fy, k = 3, children, lc = C.brass, label, ly }) {
  const id = uid()
  const rr = r / k
  const dx = cx - fx
  const dy = cy - fy
  const L = Math.hypot(dx, dy) || 1
  const ux = dx / L
  const uy = dy / L
  return (
    <g>
      <circle cx={fx} cy={fy} r={rr} fill="none" stroke={lc} strokeWidth="1" strokeDasharray="2 2" />
      <line x1={fx + ux * rr} y1={fy + uy * rr} x2={cx - ux * r} y2={cy - uy * r} stroke={lc} strokeWidth="0.8" strokeDasharray="2 2" />
      <clipPath id={`mg${id}`}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <circle cx={cx} cy={cy} r={r} fill={C.ground} />
      <g clipPath={`url(#mg${id})`}>
        <g transform={`translate(${cx} ${cy}) scale(${k}) translate(${-fx} ${-fy})`}>{children}</g>
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={lc} strokeWidth="1.3" />
      <text x={cx + r * 0.72} y={cy - r * 0.78} fontSize="9.5" fill={lc} fontFamily={MONO}>
        ×{k}
      </text>
      {label && (
        <text x={cx} y={ly ?? cy + r + 14} fontSize="10.5" fill={C.dim} textAnchor="middle" fontFamily="var(--font-body)">
          {label}
        </text>
      )}
    </g>
  )
}

// Knife in side view for skiving: edge at (x, y), flat face underneath,
// blade rising to the right at `ang` degrees.
function SideKnife({ x, y, ang, L = 110, hl = 66, k = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${-ang}) scale(${k})`}>
      <path d={`M0 0 L16 -4.5 L${L} -4.5 L${L} 0 Z`} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
      <line x1="0.5" y1="-0.2" x2="16" y2="-4.4" stroke="#f6fbff" strokeWidth="1.1" />
      <rect x={L} y={-9} width={hl} height={13} rx="3" fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.8" />
      {[L + 10, L + hl - 12].map((xx) => (
        <rect key={xx} x={xx} y={-9.5} width="3" height="14" fill="#2a2018" />
      ))}
    </g>
  )
}

// A schematic hand seen from above, fingers pointing +x from (x, y).
function Hand({ x, y, k = 1, glove }) {
  const fill = glove ? 'rgba(134,167,189,0.35)' : 'rgba(214,170,140,0.28)'
  const stroke = glove ? C.steel : '#b98f74'
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x="-40" y="-20" width="42" height="40" rx="12" fill={fill} stroke={stroke} strokeWidth="1.1" />
      {[-15, -5, 5, 15].map((fy, i) => (
        <rect key={fy} x="-2" y={fy - 4} width={[20, 24, 23, 18][i]} height="8" rx="4" fill={fill} stroke={stroke} strokeWidth="1" />
      ))}
      <rect x="-22" y="-30" width="9" height="20" rx="4.5" transform="rotate(-35 -18 -20)" fill={fill} stroke={stroke} strokeWidth="1" />
      {glove &&
        [-12, -4, 4, 12].map((gy) => <line key={gy} x1="-36" y1={gy} x2="-4" y2={gy} stroke={C.steel} strokeWidth="0.5" opacity="0.7" />)}
    </g>
  )
}

/* ================================================================== */
/* Lesson: Leather & materials (sm-leather)                             */
/* ================================================================== */

/* Where on the hide */
const HIDE =
  'M58 50 L300 47 Q402 45 432 54 Q456 72 453 122 Q450 168 440 190 L462 238 L428 234 Q406 212 380 210 Q300 216 232 212 Q172 208 140 216 L118 246 L96 240 Q92 216 70 202 Q34 182 30 132 Q28 80 58 50 Z'

function Fibres({ cx, cy, r, dense }) {
  const id = uid()
  const n = dense ? 64 : 15
  const L = dense ? 10 : 26
  const els = []
  for (let i = 0; i < n; i++) {
    const a = (i * 2.39996) % (Math.PI * 2)
    const rr = r * Math.sqrt((i + 0.5) / n)
    const x = cx + Math.cos(a) * rr
    const y = cy + Math.sin(a) * rr
    const t = ((i * 47) % 180) * (Math.PI / 180)
    const dx = Math.cos(t) * L * 0.5
    const dy = Math.sin(t) * L * 0.5
    els.push(
      <path
        key={i}
        d={`M${x - dx} ${y - dy} Q${x + dy * 0.3} ${y - dx * 0.3} ${x + dx} ${y + dy}`}
        fill="none"
        stroke={dense ? '#5a3818' : '#6d4824'}
        strokeWidth={dense ? 2.1 : 1.1}
        strokeLinecap="round"
        opacity="0.85"
      />
    )
  }
  return (
    <g>
      <clipPath id={`fb${id}`}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <circle cx={cx} cy={cy} r={r} fill={dense ? '#b98a52' : '#c9a273'} />
      <g clipPath={`url(#fb${id})`}>{els}</g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.brass} strokeWidth="1.3" />
    </g>
  )
}

function HideMap() {
  const id = uid()
  const blank = (x, y) => <StrapPlan key={`${x}-${y}`} T={{ x, y, s: 0.34 }} o={LONG()} face="card" edge="#f3e6cc" />
  const rows = [64, 78, 92]
  return (
    <Fig h={340} view="Plan · a side of leather" scale="blanks enlarged">
      <defs>
        <clipPath id={`hd${id}`}>
          <path d={HIDE} />
        </clipPath>
        <pattern id={`av${id}`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <rect width="7" height="7" fill="rgba(194,88,99,0.18)" />
          <line x1="0" y1="0" x2="0" y2="7" stroke={C.ruby} strokeWidth="1.2" opacity="0.65" />
        </pattern>
      </defs>
      <path d={HIDE} fill="url(#sk-top)" stroke="#5c3c1d" strokeWidth="1.2" />
      <g clipPath={`url(#hd${id})`}>
        <rect x="20" y="40" width="450" height="74" fill="rgba(123,165,131,0.3)" />
        <rect x="20" y="170" width="450" height="90" fill={`url(#av${id})`} />
      </g>
      <path d="M62 50 L300 47 Q402 45 430 54" fill="none" stroke={C.steel} strokeWidth="1.5" strokeDasharray="9 3 2 3" />
      <T x={245} y={39} a="middle" s={11} c={C.steel}>
        backbone (spine line)
      </T>
      <T x={26} y={40} s={10} c={C.faint}>
        neck
      </T>
      <T x={466} y={40} a="end" s={10} c={C.faint}>
        tail
      </T>

      {rows.map((y) => [66, 112, 298, 344, 390].map((x) => blank(x, y)))}
      <Arrow a={[170, 80]} b={[282, 80]} c="brass" w={1.6} both />
      <T x={226} y={73} a="middle" s={10.5} c={LIGHT}>
        length along the backbone
      </T>

      <T x={104} y={134} a="middle" s={11.5} c={LIGHT} w="600">
        SHOULDER
      </T>
      <T x={104} y={148} a="middle" s={10.5} c={LIGHT}>
        stretches least
      </T>
      <T x={372} y={134} a="middle" s={11.5} c={LIGHT} w="600">
        BUTT
      </T>
      <T x={372} y={148} a="middle" s={10.5} c={LIGHT}>
        tightest fibres
      </T>

      {/* a blank cut across the grain */}
      <g transform="rotate(90 166 142)">
        <StrapPlan T={{ x: 166, y: 142, s: 0.34 }} o={LONG()} face="card" edge="#f3e6cc" />
      </g>
      <Verdict x={186} y={150} ok={false} r={7.5} />
      <T x={198} y={154} s={10.5} c={LIGHT}>
        across: stretches in weeks
      </T>

      <T x={318} y={188} a="middle" s={11.5} c={LIGHT} w="600">
        BELLY &amp; FLANKS
      </T>
      <T x={318} y={202} a="middle" s={10.5} c={LIGHT}>
        loose, stretchy — avoid
      </T>

      {/* fibre insets */}
      <circle cx={404} cy={104} r={7} fill="none" stroke={C.brass} strokeWidth="1" strokeDasharray="2 2" />
      <Num x={420} y={116} n="a" r={6} />
      <circle cx={262} cy={220} r={7} fill="none" stroke={C.brass} strokeWidth="1" strokeDasharray="2 2" />
      <Num x={278} y={230} n="b" r={6} />
      <T x={240} y={262} a="middle" s={11}>
        Full grain only. Lay every blank’s length along the backbone.
      </T>
      <Fibres cx={46} cy={304} r={28} dense />
      <Num x={20} y={280} n="a" r={6} />
      <T x={84} y={292} s={11} c={C.text} w="600">
        Butt / shoulder
      </T>
      <T x={84} y={306} s={10.5}>
        tight, dense fibre weave:
      </T>
      <T x={84} y={319} s={10.5}>
        holds its length
      </T>
      <Fibres cx={276} cy={304} r={28} />
      <Num x={250} y={280} n="b" r={6} />
      <T x={314} y={292} s={11} c={C.text} w="600">
        Belly / flanks
      </T>
      <T x={314} y={306} s={10.5}>
        loose, open fibres:
      </T>
      <T x={314} y={319} s={10.5}>
        stretches under the buckle
      </T>
      <T x={464} y={336} a="end" s={9.5} c={C.faint}>
        fibre insets schematic
      </T>
    </Fig>
  )
}

/* The standard stack */
function StackStandard() {
  const x1 = 110
  const x2 = 300
  const yT = 62
  const yV = yT + 24
  const yL = yV + 4
  const yB = yL + 16
  const pb = 262
  return (
    <Fig h={292} view="Section · the standard stack" scale="thickness exaggerated">
      <Tag x={16} y={40}>
        Flat strap · thickness ×20
      </Tag>
      <Layer x={x1} y={yT} w={x2 - x1} h={24} k="top" />
      <Layer x={x1} y={yV} w={x2 - x1} h={4} k="vel" />
      <Layer x={x1} y={yL} w={x2 - x1} h={16} k="lining" />
      <line x1={x1 + 4} y1={yT + 1} x2={x2 - 4} y2={yT + 1} stroke="#6a4420" strokeWidth="1.4" opacity="0.7" />
      <Brk x={x1} y1={yT} y2={yB} />
      <Brk x={x2} y1={yT} y2={yB} />
      <VDim x={96} y1={yT} y2={yB} side="l" text="2.2–2.5" from={x1} />
      <T x={91} y={yB + 18} a="end" s={10} c={C.faint}>
        finished
      </T>
      <Lead p={[x2 - 22, yT + 10]} t={[318, 48]} text="top · firm veg-tan, grain up" sub="1.0–1.2 mm" subc={C.brass} />
      <Lead p={[x2 - 44, yV + 2]} t={[318, 86]} text="Velodon reinforcement" sub="0.2 mm, non-stretch" subc={C.brass} />
      <Lead p={[x2 - 22, yL + 9]} t={[318, 124]} text="lining · calf" sub="0.5–1.0 mm" subc={C.brass} />
      <T x={x1 + 4} y={yB + 18} s={10} c={C.faint}>
        each layer glued to the next
      </T>

      <Sep x1={14} y1={156} x2={466} y2={156} />

      <Tag x={16} y={176}>
        Padded · ×10, length schematic
      </Tag>
      <path d={`M76 ${pb - 10} L76 ${pb - 33} Q150 ${pb - 30} 214 ${pb - 10} Z`} fill="url(#sk-fill)" stroke="#d9b07a" strokeWidth="0.8" />
      <path
        d={`M76 ${pb - 45} Q150 ${pb - 42} 214 ${pb - 22} L256 ${pb - 22} L256 ${pb - 10} L214 ${pb - 10} Q150 ${pb - 30} 76 ${pb - 33} Z`}
        fill="url(#sk-topS)"
        stroke="#4a3018"
        strokeWidth="0.8"
      />
      <Layer x={76} y={pb - 10} w={180} h={2} k="vel" />
      <Layer x={76} y={pb - 8} w={180} h={8} k="lining" />
      <VDim x={64} y1={pb - 45} y2={pb} side="l" text="3.5–5" from={76} />
      <VDim x={266} y1={pb - 22} y2={pb} text="≈ 2.2" from={256} />
      <Lead p={[104, pb - 20]} t={[150, 198]} text="filler" sub="dome tapers out" />
      <T x={76} y={278} a="middle" s={10} c={C.faint}>
        at the lug
      </T>
      <T x={256} y={278} a="middle" s={10} c={C.faint}>
        tail = flat strap
      </T>

      <Tag x={330} y={176}>
        Lining follows the top
      </Tag>
      <Layer x={330} y={190} w={56} h={21} k="top" />
      <Layer x={330} y={211} w={56} h={6} k="lining" />
      <T x={394} y={204} s={10.5} c={C.text}>
        top 1.5–2
      </T>
      <T x={394} y={218} s={10.5} c={C.brass}>
        lining 0.5
      </T>
      <Layer x={330} y={236} w={56} h={13} k="top" />
      <Layer x={330} y={249} w={56} h={12} k="lining" />
      <T x={394} y={246} s={10.5} c={C.text}>
        top &lt; 1.5
      </T>
      <T x={394} y={260} s={10.5} c={C.brass}>
        lining 1.0
      </T>
      <T x={330} y={280} s={10} c={C.faint}>
        mm · drawn ×12
      </T>
    </Fig>
  )
}

/* Named top leathers — thickness chart and edge route */
function Leathers() {
  const X = (t) => 186 + t * 68
  const rows = [
    ['Haas Barenia', 'firm veg-tan, finished 2–2.5', [2.0, 2.5], 'burnish', '#8c5a2c'],
    ['Walpier Buttero', 'firm veg-tan, sold ≈1.2–1.4', [1.2, 1.4], 'burnish', '#a8763f'],
    ['Chromexcel', 'Horween pull-up, oily', null, 'paint', '#6b3f22'],
    ['Shell cordovan', 'dense, varies horse to horse', [1.0, 2.0], 'test', '#5e2f25'],
    ['Goat', 'e.g. Alran caviar · strong, thin', [1.15, 1.25], 'tannage', '#3e3a36'],
    ['Kangaroo', 'strong and thin', [0.9, 1.2], 'tannage', '#7d5a3c'],
    ['Unlined strap', 'veg-tan or Horween, heavier', [2.0, 2.4], 'burnish', '#94652f'],
  ]
  const edgeC = { burnish: C.emerald, paint: C.ruby, test: C.dim, tannage: C.dim }
  const edgeT = { burnish: 'burnish', paint: 'paint', test: 'test first', tannage: 'by tannage' }
  const icon = (edge, x, y) => {
    if (edge === 'burnish') return <XSec cx={x} y={y - 6} w={22} layers={[{ k: 'top', t: 8 }]} edge="round" />
    if (edge === 'paint') return <XSec cx={x} y={y - 6} w={20} layers={[{ k: 'top', t: 8 }]} edge="paint" b={2} coat={2} />
    return null
  }
  return (
    <Fig h={334} view="Chart · top leathers" scale="working thickness, mm">
      <rect x={X(1.0)} y={56} width={X(1.2) - X(1.0)} height={234} fill="rgba(208,168,79,0.12)" />
      {[0, 0.5, 1, 1.5, 2, 2.5].map((t) => (
        <g key={t}>
          <line x1={X(t)} y1={56} x2={X(t)} y2={290} stroke={C.line} strokeWidth="0.8" strokeDasharray="2 3" />
          <T x={X(t)} y={48} a="middle" s={10} mono>
            {t.toFixed(1)}
          </T>
        </g>
      ))}
      <Tag x={16} y={48}>
        Leather
      </Tag>
      <Tag x={392} y={48}>
        Edge
      </Tag>
      {rows.map(([name, sub, r, edge, sw], i) => {
        const y = 76 + i * 31
        const narrow = r && r[1] - r[0] < 0.15
        const leftLabel = r && r[1] > 2.1
        return (
          <g key={name}>
            <rect x={16} y={y - 9} width={9} height={22} rx="2" fill={sw} stroke="#e0b277" strokeWidth="0.6" />
            <T x={31} y={y} s={11.5} c={C.text} w="600">
              {name}
            </T>
            <T x={31} y={y + 13} s={10} c={C.faint}>
              {sub}
            </T>
            {r ? (
              <g>
                <rect x={X(r[0])} y={y - 6} width={Math.max(5, X(r[1]) - X(r[0]))} height={11} rx="2" fill="url(#sk-top)" stroke="#e0b277" strokeWidth="0.8" />
                <T x={leftLabel ? X(r[0]) - 6 : X(r[1]) + 6} y={y + 3.5} a={leftLabel ? 'end' : 'start'} s={10.5} mono c={C.text}>
                  {narrow ? '≈ 1.2' : `${r[0].toFixed(1)}–${r[1].toFixed(1)}`}
                </T>
              </g>
            ) : (
              <T x={X(0.1)} y={y + 3.5} s={10.5} c={C.ruby}>
                stretches · will not burnish
              </T>
            )}
            {name === 'Haas Barenia' && (
              <g>
                <Arrow a={[X(2.0) - 2, y + 11]} b={[X(1.25), y + 11]} c="brass" w={1.1} dash="3 2" />
                <T x={X(1.2) - 4} y={y + 15} a="end" s={10} c={C.brass}>
                  split for lined
                </T>
              </g>
            )}
            {icon(edge, 402, y)}
            <T x={edge === 'burnish' || edge === 'paint' ? 418 : 392} y={y + 3.5} s={11} c={edgeC[edge]} w={edge === 'burnish' || edge === 'paint' ? '600' : undefined}>
              {edgeT[edge]}
            </T>
          </g>
        )
      })}
      <T x={X(1.1)} y={304} a="middle" s={10} c={C.brass}>
        lined-strap top 1.0–1.2
      </T>
      <T x={16} y={324} s={10.5}>
        Firm veg-tan burnishes; chrome-tan and pull-up edges are painted.
      </T>
    </Fig>
  )
}

/* Two-layer strap section with an edge treatment at both ends. */
function EdgeStack({ cx, y, w = 104, t1 = 16, t2 = 10, lin = 'lining', edge }) {
  const id = uid()
  const x1 = cx - w / 2
  const x2 = cx + w / 2
  const tt = t1 + t2
  const body = (
    <g>
      <Layer x={x1} y={y} w={w} h={t1} k="top" />
      <Layer x={x1} y={y + t1} w={w} h={t2} k={lin} />
    </g>
  )
  if (edge === 'burnish')
    return (
      <g>
        <clipPath id={`eb${id}`}>
          <rect x={x1} y={y} width={w} height={tt} rx={tt / 2} />
        </clipPath>
        <g clipPath={`url(#eb${id})`}>
          {body}
          <rect x={x1} y={y} width={w} height={tt} rx={tt / 2} fill="none" stroke="#6a4420" strokeWidth="5" opacity="0.55" />
        </g>
        <rect x={x1} y={y} width={w} height={tt} rx={tt / 2} fill="none" stroke="#4a2c12" strokeWidth="1" />
        {[x1, x2].map((ex, i) => (
          <path
            key={i}
            d={`M${ex + (i ? -tt / 2 : tt / 2)} ${y + 2} A${tt / 2 - 2} ${tt / 2 - 2} 0 0 ${i ? 1 : 0} ${ex + (i ? -tt / 2 : tt / 2)} ${y + tt - 2}`}
            fill="none"
            stroke="#fbe9c6"
            strokeWidth="1.4"
            opacity="0.75"
          />
        ))}
      </g>
    )
  if (edge === 'fuzz') {
    const hairs = []
    ;[x1, x2].forEach((ex, i) => {
      const s = i ? 1 : -1
      for (let k = 0; k < 8; k++) {
        const yy = y + t1 + 1 + k * (t2 / 7.5)
        const len = 2.5 + ((k * 37) % 5) * 0.8
        const a = ((k * 53) % 80) - 40
        hairs.push(
          <line
            key={`${i}-${k}`}
            x1={ex}
            y1={yy}
            x2={ex + s * len * Math.cos((a * Math.PI) / 180)}
            y2={yy + len * Math.sin((a * Math.PI) / 180)}
            stroke="#ece3d2"
            strokeWidth="0.7"
          />
        )
      }
    })
    return (
      <g>
        <clipPath id={`ef${id}`}>
          <path d={`M${x1 + t1 / 2} ${y} H${x2 - t1 / 2} A${t1 / 2} ${t1 / 2} 0 0 1 ${x2} ${y + t1 / 2} V${y + tt} H${x1} V${y + t1 / 2} A${t1 / 2} ${t1 / 2} 0 0 1 ${x1 + t1 / 2} ${y} Z`} />
        </clipPath>
        <g clipPath={`url(#ef${id})`}>{body}</g>
        {hairs}
      </g>
    )
  }
  // paint: small bevel on the arrises, then a built-up coat round each end
  const b = 3
  const fT = LAYER.top
  const fL = LAYER[lin]
  return (
    <g>
      <path d={`M${x1 + b} ${y} H${x2 - b} L${x2} ${y + b} V${y + t1} H${x1} V${y + b} Z`} fill={fT[0]} stroke={fT[1]} strokeWidth="0.8" />
      <path d={`M${x1} ${y + t1} H${x2} V${y + tt - b} L${x2 - b} ${y + tt} H${x1 + b} L${x1} ${y + tt - b} Z`} fill={fL[0]} stroke={fL[1]} strokeWidth="0.8" />
      {[x1, x2].map((ex, i) => {
        const s = i ? 1 : -1
        const o = 1.7
        const d = `M${ex - s * (b + 1.5)} ${y - o * 0.6} L${ex + s * o * 0.4} ${y + b - o * 0.3} L${ex + s * o} ${y + b + 0.6} L${ex + s * o} ${y + tt - b - 0.6} L${ex + s * o * 0.4} ${y + tt - b + o * 0.3} L${ex - s * (b + 1.5)} ${y + tt + o * 0.6}`
        return <path key={i} d={d} fill="none" stroke={C.paint} strokeWidth="3.4" strokeLinejoin="round" strokeLinecap="round" />
      })}
    </g>
  )
}

/* Linings set the edge */
function LiningEdge() {
  const cols = [
    { cx: 86, title: 'Veg-tan lining', layers: 'veg-tan top · veg-tan lining', lin: 'lining', edge: 'burnish', ok: true, sub: ['both layers compress', 'and set: burnishes'] },
    { cx: 240, title: 'Chrome, burnished', layers: 'veg-tan top · chrome lining', lin: 'chrome', edge: 'fuzz', ok: false, sub: ['chrome fibres will', 'not set: they fuzz'] },
    { cx: 394, title: 'Chrome, painted', layers: 'veg-tan top · chrome lining', lin: 'chrome', edge: 'paint', ok: true, sub: ['the route for any', 'chrome lining'] },
  ]
  const ys = 82
  return (
    <Fig h={338} view="Comparison · same top, two linings" scale="cross-section, schematic">
      {cols.map((c) => (
        <g key={c.title}>
          <Panel x={c.cx - 72} y={30} w={144} h={222} c={c.ok ? C.line : 'rgba(194,88,99,0.5)'} />
          <T x={c.cx} y={50} a="middle" s={11.5} c={C.text} w="600">
            {c.title}
          </T>
          <T x={c.cx} y={64} a="middle" s={9.5} c={C.faint}>
            {c.layers}
          </T>
          <EdgeStack cx={c.cx} y={ys} lin={c.lin} edge={c.edge} />
          <Magnifier cx={c.cx} cy={158} r={34} fx={c.cx + 44} fy={ys + 13} k={3}>
            <EdgeStack cx={c.cx} y={ys} lin={c.lin} edge={c.edge} />
          </Magnifier>
          <T x={c.cx} y={210} a="middle" s={10.5}>
            {c.sub[0]}
          </T>
          <T x={c.cx} y={223} a="middle" s={10.5}>
            {c.sub[1]}
          </T>
          <Verdict x={c.cx} y={238} ok={c.ok} r={8} />
        </g>
      ))}
      <T x={120} y={150} s={10} c={C.faint}>
        glazed
      </T>
      <T x={274} y={150} s={10} c={C.faint}>
        fuzz
      </T>
      <T x={428} y={150} s={10} c={C.faint}>
        paint
      </T>

      <Tag x={16} y={274}>
        Lining leathers
      </Tag>
      {[
        [16, 292, 'Haas Zermatt', 'chrome calf, soft, water-resistant → paint'],
        [250, 292, 'Degermann Alsavel', 'a leather, despite the name → paint'],
        [16, 320, 'Goat', 'skives easily, resists scratching'],
        [250, 320, 'Veg-tan', 'leave undyed (dye allergies) → burnish'],
      ].map(([x, y, n, d]) => (
        <g key={n}>
          <T x={x} y={y} s={11} c={C.brass} w="600">
            {n}
          </T>
          <T x={x} y={y + 13} s={10} c={C.dim}>
            {d}
          </T>
        </g>
      ))}
    </Fig>
  )
}

/* Reinforcement placements */
function ReinfThumb({ cx, cy, kind }) {
  const w = 50
  const x1 = cx - w / 2
  if (kind === 'flat')
    return (
      <g>
        <Layer x={x1} y={cy - 8} w={w} h={9} k="top" />
        <Layer x={x1} y={cy + 1} w={w} h={2.4} k="vel" />
        <Layer x={x1} y={cy + 3.4} w={w} h={6} k="lining" />
      </g>
    )
  if (kind === 'padded')
    return (
      <g>
        <path d={`M${x1} ${cy + 3} L${x1 + 7} ${cy + 3} Q${cx} ${cy - 17} ${x1 + w - 7} ${cy + 3} L${x1 + w} ${cy + 3} L${x1 + w} ${cy - 1} L${x1 + w - 9} ${cy - 1} Q${cx} ${cy - 21} ${x1 + 9} ${cy - 1} L${x1} ${cy - 1} Z`} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.7" />
        <path d={`M${x1 + 8} ${cy + 3} Q${cx} ${cy - 15} ${x1 + w - 8} ${cy + 3} Z`} fill="url(#sk-fill)" />
        <Layer x={x1 + 4} y={cy + 3} w={w - 8} h={2.2} k="vel" />
        <Layer x={x1} y={cy + 5.2} w={w} h={6} k="lining" />
      </g>
    )
  return (
    <g>
      <Layer x={x1} y={cy - 8} w={w} h={9} k="top" />
      <Layer x={cx - 9} y={cy + 1} w={18} h={2.4} k="vel" />
      <Layer x={x1} y={cy + 3.4} w={w} h={6} k="lining" />
    </g>
  )
}

function Reinforce() {
  const s = 1.9
  const TX = 54
  const rows = [72, 152, 232]
  const o = LONG({ x0: -20 })
  const sheet = (Tr, inset, x0, x1) => {
    const so = LONG({ x0, x1, w0: 20 - 2 * inset, w1: 18 - 2 * inset, tipLen: 14 - inset })
    return <path d={pathOf(outline(so), Tr)} fill="rgba(143,178,201,0.45)" stroke={C.velodon} strokeWidth="1.1" />
  }
  const right = 360
  const text = [
    ['Flat strap', '0.2 mm Velodon', ['full length on the', 'top’s flesh side']],
    ['Padded strap', 'thinner sheet', ['on the lining, round', 'folds, short of edges']],
    ['Centre tape', '6–8 mm tape', ['down the centre,', 'never in the folds']],
  ]
  return (
    <Fig h={304} view="Plan · reinforcement placement" scale="flesh side up">
      <Tag x={315} y={40} a="middle">
        section
      </Tag>
      {rows.map((y, i) => {
        const Tr = { x: TX, y, s }
        return (
          <g key={y}>
            <StrapPlan
              T={Tr}
              o={o}
              face={i === 1 ? 'lining' : 'flesh'}
              folds={[{ x: 0, label: i === 0 ? 'lug fold' : undefined }]}
              zones={i === 2 ? [{ from: -20, to: 10, k: 'ruby' }] : []}
            />
            {i === 0 && sheet(Tr, 0.8, -19.2, 119)}
            {i === 1 && sheet(Tr, 2.5, -18, 116)}
            {i === 2 && (
              <rect x={px(Tr, 12, 0)[0]} y={y - 3.5 * s} width={(104 - 12) * s} height={7 * s} rx="2" fill="rgba(143,178,201,0.6)" stroke={C.velodon} strokeWidth="1.1" />
            )}
            <ReinfThumb cx={315} cy={y} kind={['flat', 'padded', 'tape'][i]} />
            <Tag x={right} y={y - 18}>
              {text[i][0]}
            </Tag>
            <T x={right} y={y - 2} s={11.5} c={C.velodon} w="600">
              {text[i][1]}
            </T>
            <T x={right} y={y + 12} s={10.5}>
              {text[i][2][0]}
            </T>
            <T x={right} y={y + 25} s={10.5}>
              {text[i][2][1]}
            </T>
          </g>
        )
      })}
      {/* dimension on the tape and the inset */}
      <VDim x={px({ x: TX, y: 0, s }, 60, 0)[0]} y1={rows[2] - 3.5 * s} y2={rows[2] + 3.5 * s} text="6–8" c={C.text} />
      <T x={16} y={rows[2] + 34} s={10} c={C.ruby}>
        no tape in the fold
      </T>
      <T x={16} y={284} s={10.5}>
        Thin flexible fabric round the pins stops tearing at the bar;
      </T>
      <T x={16} y={298} s={10.5}>
        a stiff tape — or Texon (~0.45 mm) — cracks in a fold.
      </T>
    </Fig>
  )
}

/* Fillers for padded straps */
function Fillers() {
  const cells = [
    { name: 'Veg-tan', sub: ['1.5–1.9 mm (or ~2)', 'crisp, carved dome'], kind: 'veg' },
    { name: 'Craft foam', sub: ['two 1 mm sheets', 'soft, round dome'], kind: 'foam' },
    { name: 'Cork', sub: ['over thin leather', ''], kind: 'cork' },
    { name: 'Cotton fleece', sub: ['soft, round dome', ''], kind: 'fleece' },
    { name: 'Salpa', sub: ['over reinforcement', ''], kind: 'salpa' },
    { name: 'Cardboard', sub: ['found in cheap straps', 'avoid'], kind: 'card' },
  ]
  const prof = {
    veg: [16, (u) => (u < 0.18 ? u / 0.18 : u > 0.82 ? (1 - u) / 0.18 : 1)],
    foam: [20, (u) => Math.pow(Math.sin(Math.PI * u), 0.55)],
    cork: [17, (u) => 1 - Math.pow(2 * u - 1, 6)],
    fleece: [17, (u) => Math.sin(Math.PI * u)],
    salpa: [15, (u) => 1 - Math.pow(2 * u - 1, 8)],
    card: [12, (u) => 1 - Math.pow(2 * u - 1, 24)],
  }
  const fills = { veg: 'url(#sk-fill)', foam: '#8d8a7a', cork: '#9b6b3e', fleece: '#e9e3d6', salpa: '#6e5d4c', card: '#8a8478' }
  const art = (cx, base, kind) => {
    const [h, f] = prof[kind]
    const W = 80
    const xa = cx - W / 2
    const pts = []
    for (let i = 0; i <= 30; i++) {
      const u = i / 30
      pts.push([xa + u * W, base - h * f(u)])
    }
    const fillerD = 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L') + ' Z'
    const topPts = [[cx - 62, base - 3], ...pts.map(([x, y]) => [x, y - 3]), [cx + 62, base - 3]]
    const topD = 'M' + topPts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L')
    const extra = []
    if (kind === 'foam') {
      const mid = pts.map(([x, y]) => [x, base - (base - y) * 0.5])
      extra.push(<path key="m" d={'M' + mid.map((p) => p.join(' ')).join(' L')} fill="none" stroke="#4d4b42" strokeWidth="0.8" />)
    }
    if (kind === 'cork') {
      extra.push(<rect key="l" x={xa} y={base - 5} width={W} height={5} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />)
      for (let i = 0; i < 18; i++) extra.push(<circle key={i} cx={xa + 8 + ((i * 29) % 64)} cy={base - 8 - ((i * 7) % 8)} r="0.9" fill="#5a3a1c" />)
    }
    if (kind === 'fleece')
      for (let i = 0; i < 4; i++)
        extra.push(<path key={i} d={`M${xa + 10} ${base - 3 - i * 3.4} q8 -2 16 0 t16 0 t16 0 t16 0`} fill="none" stroke="#b8ae9c" strokeWidth="0.7" />)
    if (kind === 'salpa') extra.push(<rect key="v" x={xa - 2} y={base - 2} width={W + 4} height={2} fill={C.velodon} />)
    if (kind === 'card') extra.push(<path key="c" d={`M${xa + 2} ${base - 4} H${xa + W - 2} M${xa + 2} ${base - 8} H${xa + W - 2}`} stroke="#5d5950" strokeWidth="0.8" />)
    return (
      <g>
        <rect x={cx - 62} y={base} width={124} height={6} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
        <path d={fillerD} fill={fills[kind]} stroke={kind === 'veg' ? '#d9b07a' : '#3a3128'} strokeWidth="0.8" />
        {extra}
        <path d={topD} fill="none" stroke="#4a3018" strokeWidth="7.6" strokeLinejoin="round" strokeLinecap="butt" />
        <path d={topD} fill="none" stroke="#b2804a" strokeWidth="6" strokeLinejoin="round" strokeLinecap="butt" />
      </g>
    )
  }
  return (
    <Fig h={300} view="Cross-sections · filler options" scale="thickness ×10">
      {cells.map((c, i) => {
        const cx = 86 + (i % 3) * 154
        const top = 30 + Math.floor(i / 3) * 122
        const bad = c.kind === 'card'
        return (
          <g key={c.name}>
            <Panel x={cx - 73} y={top} w={146} h={114} c={bad ? 'rgba(194,88,99,0.5)' : C.line} />
            {art(cx, top + 56, c.kind)}
            {c.kind === 'veg' && <VDim x={cx - 6} y1={top + 40} y2={top + 56} c={C.brassHi} text="1.6" />}
            {c.kind === 'foam' && <VDim x={cx - 10} y1={top + 36} y2={top + 56} c={C.brassHi} text="2 × 1" />}
            <T x={cx} y={top + 82} a="middle" s={11.5} c={C.text} w="600">
              {c.name}
            </T>
            <T x={cx} y={top + 96} a="middle" s={10.5}>
              {c.sub[0]}
            </T>
            {c.sub[1] && (
              <T x={cx} y={top + 109} a="middle" s={10.5} c={bad ? C.ruby : C.dim}>
                {c.sub[1]}
              </T>
            )}
            {bad && <Verdict x={cx + 56} y={top + 14} ok={false} r={7} />}
          </g>
        )
      })}
      {[
        ['url(#sk-topS)', '#4a3018', 'top leather'],
        ['url(#sk-fill)', '#d9b07a', 'filler (dome)'],
        ['url(#sk-linS)', '#8f7b5a', 'lining'],
      ].map(([f, st, l], i) => (
        <g key={l}>
          <rect x={16 + i * 120} y={282} width={14} height={9} fill={f} stroke={st} strokeWidth="0.7" />
          <T x={36 + i * 120} y={290} s={10.5}>
            {l}
          </T>
        </g>
      ))}
      <T x={464} y={290} a="end" s={10} c={C.faint}>
        flanges stay flat for the stitch
      </T>
    </Fig>
  )
}

/* Thread diameters at a common enlargement */
function ThreadGauge() {
  const K = 60 // px per mm
  const list = [
    ['Vinymo #8', 0.4, 'polyester', 'poly'],
    ['FAC 832', 0.43, 'waxed linen', 'linen'],
    ['FAC 632', 0.51, 'waxed linen', 'linen'],
    ['FAC 532', 0.57, 'waxed linen', 'linen'],
    ['Ritza Tiger', 0.6, 'polyester, oval', 'oval'],
    ['FAC 432', 0.63, 'waxed linen', 'linen'],
  ]
  const cy = 98
  const thread = (cx, d, kind) => {
    const r = (d * K) / 2
    const els = []
    if (kind === 'linen')
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2 + 0.2
        const l = 2.5 + ((i * 7) % 3)
        els.push(
          <line key={i} x1={cx + Math.cos(a) * r} y1={cy + Math.sin(a) * r} x2={cx + Math.cos(a + 0.25) * (r + l)} y2={cy + Math.sin(a + 0.25) * (r + l)} stroke="#e8dcc2" strokeWidth="0.7" />
        )
      }
    const shape =
      kind === 'oval' ? (
        <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.68} fill={C.thread} stroke="#a89d86" strokeWidth="1" />
      ) : (
        <circle cx={cx} cy={cy} r={r} fill={C.thread} stroke="#a89d86" strokeWidth="1" />
      )
    return (
      <g>
        {els}
        {shape}
        <path d={`M${cx - r * 0.55} ${cy - r * 0.35} A${r * 0.7} ${r * 0.7} 0 0 1 ${cx + r * 0.2} ${cy - r * 0.62}`} fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.6" />
      </g>
    )
  }
  const hx = [76, 256]
  const sy = 258
  return (
    <Fig h={336} view="Detail · thread diameters, end-on" scale="all drawn ×60">
      <T x={240} y={44} a="middle" s={10.5}>
        strap range 0.35–0.65 mm · course default 0.45–0.55 mm
      </T>
      {list.map(([name, d, mat, kind], i) => {
        const cx = 52 + i * 75
        return (
          <g key={name}>
            {name === 'FAC 632' && (
              <g>
                <circle cx={cx} cy={cy} r={(d * K) / 2 + 9} fill="none" stroke={C.emerald} strokeWidth="1.2" strokeDasharray="3 2" />
                <T x={cx} y={66} a="middle" s={10} c={C.emerald}>
                  default
                </T>
              </g>
            )}
            {thread(cx, d, kind)}
            {kind === 'oval' && <HDim x1={cx - 18} x2={cx + 18} y={122} text="" />}
            <T x={cx} y={146} a="middle" s={11} c={C.text} w="600">
              {name}
            </T>
            <T x={cx} y={160} a="middle" s={10.5} mono c={C.brass}>
              {kind === 'oval' ? '0.6 oval' : d.toFixed(2)}
            </T>
            <T x={cx} y={173} a="middle" s={10} c={C.faint}>
              {mat}
            </T>
          </g>
        )
      })}

      <Sep x1={14} y1={186} x2={466} y2={186} />
      <Tag x={16} y={204}>
        A 3 mm stitch, same ×60 (plan)
      </Tag>
      <rect x={16} y={216} width={300} height={84} rx="3" fill="url(#sk-top)" stroke="#5c3c1d" />
      {hx.map((x) => (
        <ellipse key={x} cx={x} cy={sy} rx="22" ry="7" transform={`rotate(-40 ${x} ${sy})`} fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />
      ))}
      <line x1={hx[0]} y1={sy + 8} x2={hx[1]} y2={sy - 8} stroke="#a89d86" strokeWidth={0.51 * K + 2} strokeLinecap="round" />
      <line x1={hx[0]} y1={sy + 8} x2={hx[1]} y2={sy - 8} stroke={C.thread} strokeWidth={0.51 * K} strokeLinecap="round" />
      {Array.from({ length: 11 }, (_, i) => {
        const x = 92 + i * 15
        const y = sy + 8 - ((x - hx[0]) / 180) * 16
        return <line key={i} x1={x - 6} y1={y + 12} x2={x + 6} y2={y - 12} stroke="#d6c9ae" strokeWidth="1" />
      })}
      <HDim x1={hx[0]} x2={hx[1]} y={314} text="3.0 mm pitch, hole to hole" below ext={300} />
      <VDim x={300} y1={sy - 8 - 15.3} y2={sy - 8 + 15.3} c={C.text} />
      <Lead p={[304, sy - 8]} t={[336, 226]} text="0.51 mm thread" sub="FAC 632, one stitch" dot={false} s={10.5} />
      <Note x={336} y={268} head="Linen" hc={C.text} lines={['finer, traditional; fuzzes']} s={10.5} lh={13} />
      <Note x={336} y={300} head="Polyester" hc={C.text} lines={['stronger: first strap']} s={10.5} lh={13} />
    </Fig>
  )
}

/* Glue windows on a log time axis */
function GlueTimes() {
  const X = (t) => 168 + 125 * Math.log10(t)
  const bar = (a, b, y, fill, h = 8) => <rect x={X(a)} y={y - h / 2} width={Math.max(3, X(b) - X(a))} height={h} rx="2" fill={fill} />
  const ticks = [
    [1, '1 min'],
    [2, '2'],
    [5, '5'],
    [10, '10'],
    [20, '20'],
    [30, '30'],
    [60, '1 h'],
    [120, '2 h'],
    [240, '4 h'],
  ]
  const name = (y, a, b) => (
    <g>
      <T x={14} y={y - 2} s={11.5} c={C.text} w="600">
        {a}
      </T>
      <T x={14} y={y + 11} s={10} c={C.faint}>
        {b}
      </T>
    </g>
  )
  const tack = 'rgba(208,168,79,0.85)'
  const open = 'rgba(123,165,131,0.85)'
  const sew = 'rgba(134,167,189,0.85)'
  // step-by-step cells
  const cell = (x, n, title, sub, art) => (
    <g key={n}>
      <Num x={x + 8} y={290} n={n} r={7} />
      <T x={x + 20} y={294} s={10.5} c={C.text} w="600">
        {title}
      </T>
      {art}
      <T x={x} y={338} s={10} c={C.faint}>
        {sub}
      </T>
    </g>
  )
  const ply = (x, y, w, k = 'top', rot = 0) => (
    <g transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}>
      <Layer x={x} y={y} w={w} h={6} k={k} />
    </g>
  )
  return (
    <Fig h={346} view="Chart · contact-cement windows" scale="time, log scale">
      {ticks.map(([t, l]) => (
        <g key={t}>
          <line x1={X(t)} y1={56} x2={X(t)} y2={214} stroke={C.line} strokeWidth="0.8" strokeDasharray="2 3" />
          <T x={X(t)} y={48} a="middle" s={10} mono>
            {l}
          </T>
        </g>
      ))}

      {name(84, 'Water-based', 'Renia Aquilim 315')}
      {bar(2, 3, 84, tack, 10)}
      <path d={`M${X(3) + 3} 96 l4 7 l-8 0 Z`} fill={C.text} />
      <T x={X(2.5)} y={72} a="middle" s={10} c={C.brass}>
        tack 2–3 min
      </T>
      <T x={X(3) + 10} y={106} s={10} c={C.text}>
        press ≥ 1 bar
      </T>
      {bar(30, 60, 84, sew, 10)}
      <T x={X(42)} y={72} a="middle" s={10} c={C.steel}>
        sew after 30–60 min
      </T>

      {name(132, 'Solvent', 'Renia Colle de Cologne')}
      {bar(5, 20, 128, tack)}
      {bar(5, 30, 138, open)}
      <T x={X(10)} y={120} a="middle" s={10} c={C.brass}>
        tack 5–20 min
      </T>
      <T x={X(30) + 6} y={142} s={10} c={C.emerald}>
        open ≈ 30 min
      </T>

      {name(178, 'Solvent', 'Barge TF')}
      {bar(10, 15, 174, tack)}
      {bar(15, 240, 184, open)}
      <T x={X(12.2)} y={166} a="middle" s={10} c={C.brass}>
        dry 10–15 min
      </T>
      <T x={X(60)} y={166} a="middle" s={10} c={C.emerald}>
        open up to 4 h
      </T>

      <T x={14} y={222} s={11.5} c={C.text} w="600">
        Superglue
      </T>
      <Verdict x={X(1) + 8} y={218} ok={false} r={7.5} />
      <T x={X(1) + 22} y={222} s={10.5} c={C.ruby}>
        never for lamination: it cracks in flex
      </T>

      {[
        [tack, 'wait for tack / dry', 16],
        [open, 'open: join now', 170],
        [sew, 'cure, then sew', 300],
      ].map(([f, l, x]) => (
        <g key={l}>
          <rect x={x} y={236} width={14} height={8} rx="2" fill={f} />
          <T x={x + 20} y={244} s={10.5}>
            {l}
          </T>
        </g>
      ))}
      <T x={14} y={264} s={10.5} c={C.ruby}>
        Solvents (acetone, heptane, IPA) are flammable and sink: ventilate, no flame.
      </T>
      <Sep x1={14} y1={274} x2={466} y2={274} />

      {/* water-based, step by step */}
      {cell(
        14,
        1,
        'coat both faces',
        'thin, even coat',
        <g>
          {ply(22, 302, 86)}
          <rect x={22} y={308} width={86} height={2.5} fill="url(#sk-glue)" />
          <rect x={22} y={317} width={86} height={2.5} fill="url(#sk-glue)" />
          {ply(22, 319.5, 86, 'lining')}
        </g>
      )}
      {cell(
        130,
        2,
        'wait for tack',
        'touch-dry: 2–3 min',
        <g>
          {ply(138, 302, 86)}
          <rect x={138} y={308} width={86} height={2} fill="rgba(140,192,149,0.5)" />
          <rect x={138} y={317.5} width={86} height={2} fill="rgba(140,192,149,0.5)" />
          {ply(138, 319.5, 86, 'lining')}
        </g>
      )}
      {cell(
        246,
        3,
        'join from one end',
        'it grabs on touch',
        <g>
          {ply(254, 318, 86, 'lining')}
          {ply(256, 312, 86, 'top', -9)}
          <Arrow a={[318, 300]} b={[318, 309]} c="brass" w={1.4} />
        </g>
      )}
      {cell(
        362,
        4,
        'press ≥ 1 bar',
        'roller, light hammer',
        <g>
          {ply(370, 312, 92)}
          {ply(370, 318, 92, 'lining')}
          {[388, 416, 444].map((x) => (
            <Arrow key={x} a={[x, 299]} b={[x, 309]} c="brass" w={1.4} />
          ))}
        </g>
      )}
    </Fig>
  )
}

/* Edge and finish chemistry, in section */
function FinishChem() {
  const id = uid()
  const y = 70
  const t1 = 36
  const t2 = 22
  const tt = t1 + t2
  const fibres = (x1, x2) =>
    Array.from({ length: 7 }, (_, i) => (
      <path key={i} d={`M${x1} ${y + 6 + i * 7.6} q10 -3 20 0 t20 0 t20 0 t20 0 t20 0 t20 0`} fill="none" stroke="rgba(80,50,22,0.35)" strokeWidth="0.8" />
    ))
  const bx1 = 22
  const bx2 = 150
  const px1 = 256
  const px2 = 380
  const bv = 6
  const coat = (o) =>
    `M${px2 - bv - 6} ${y - o * 0.4} L${px2 - bv + o * 0.4} ${y - o * 0.4} L${px2 + o} ${y + bv} L${px2 + o} ${y + tt - bv} L${px2 - bv + o * 0.4} ${y + tt + o * 0.4} L${px2 - bv - 6} ${y + tt + o * 0.4}`
  return (
    <Fig h={316} view="Section · what the finish does to the edge" scale="edge ×15, schematic">
      <Tag x={16} y={40}>
        Burnished
      </Tag>
      <clipPath id={`fb${id}`}>
        <path d={`M${bx1} ${y} H${bx2 - tt / 2} A${tt / 2} ${tt / 2} 0 0 1 ${bx2 - tt / 2} ${y + tt} H${bx1} Z`} />
      </clipPath>
      <g clipPath={`url(#fb${id})`}>
        <Layer x={bx1} y={y} w={bx2 - bx1} h={t1} k="top" />
        <Layer x={bx1} y={y + t1} w={bx2 - bx1} h={t2} k="lining" />
        {fibres(bx1, bx2)}
        <path d={`M${bx2 - tt / 2} ${y} A${tt / 2} ${tt / 2} 0 0 1 ${bx2 - tt / 2} ${y + tt}`} fill="none" stroke="#5b3a1c" strokeWidth="14" opacity="0.75" />
      </g>
      <path d={`M${bx2 - tt / 2} ${y - 1.5} A${tt / 2 + 1.5} ${tt / 2 + 1.5} 0 0 1 ${bx2 - tt / 2} ${y + tt + 1.5}`} fill="none" stroke={C.brassHi} strokeWidth="2.2" />
      <path d={`M${bx2 - tt / 2 + 4} ${y + 8} A${tt / 2 - 8} ${tt / 2 - 8} 0 0 1 ${bx2 - 10} ${y + tt / 2}`} fill="none" stroke="#ffffff" strokeWidth="1.6" opacity="0.5" />
      <line x1={bx1} y1={y - 1.2} x2={bx2 - tt / 2} y2={y - 1.2} stroke="#f2dcae" strokeWidth="2" />
      <Brk x={bx1} y1={y} y2={y + tt} />
      <Arrow d={`M${bx2 + 18} ${y + 8} A32 32 0 0 1 ${bx2 + 18} ${y + tt - 8}`} c="brass" w={1.6} both />
      <T x={bx2 + 26} y={y + tt / 2 + 4} s={10.5} c={C.brass}>
        slicker
      </T>
      <Lead p={[70, y - 1.5]} t={[96, 50]} text="Resolene 1:1 seals the dye" s={10.5} a="start" />
      <Lead p={[bx2 - 1, y + tt - 8]} t={[226, 156]} text="beeswax / paraffin seal" a="end" s={10.5} />
      <Lead p={[134, y + tt - 6]} t={[24, 176]} text="fibres compressed and set" a="start" sub="water + agent, then friction" />
      <Note x={16} y={222} head="Burnishing agent" hc={C.text} lines={['water · gum tragacanth', 'Tokonole · saddle soap', 'then beeswax or paraffin']} s={10.5} lh={14} />

      <Sep x1={240} y1={30} x2={240} y2={282} />

      <Tag x={256} y={40}>
        Painted
      </Tag>
      <path d={`M${px1} ${y} H${px2 - bv} L${px2} ${y + bv} V${y + t1} H${px1} Z`} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <path d={`M${px1} ${y + t1} H${px2} V${y + tt - bv} L${px2 - bv} ${y + tt} H${px1} Z`} fill="#cfc8ba" stroke="#7d7668" strokeWidth="0.8" />
      {fibres(px1, px2 - 20)}
      <path d={coat(1.5)} fill="none" stroke="#8a7461" strokeWidth="2.4" strokeLinejoin="round" />
      {[4.5, 7.5, 10.5].map((o) => (
        <path key={o} d={coat(o)} fill="none" stroke={C.paint} strokeWidth="3" strokeLinejoin="round" />
      ))}
      <path d={coat(12)} fill="none" stroke="#7a5638" strokeWidth="0.6" strokeLinejoin="round" />
      {[5.5, 8.5].map((o) => (
        <path key={o} d={`M${px2 + o + 0.5} ${y + bv + 4} V${y + tt - bv - 4}`} stroke="#6b5240" strokeWidth="0.5" />
      ))}
      <Brk x={px1} y1={y} y2={y + tt} />
      <Lead p={[px2 + 10.5, y + 22]} t={[466, 50]} text="3–4 thin coats" a="end" s={10.5} />
      <Lead p={[px2 + 1.5, y + tt - 16]} t={[466, 156]} text="primer: Uniters EP Coat" a="end" s={10.5} />
      <HDim x1={px2} x2={px2 + 12} y={y + tt + 16} />
      <T x={px2 - 4} y={y + tt + 20} a="end" s={10.5}>
        paint adds width
      </T>
      <Lead p={[px2 - 3, y + 3]} t={[366, 50]} text="sanded, small bevel" s={10.5} a="end" />
      <Note x={256} y={192} head="Edge paints" hc={C.text} lines={['Fenice · Uniters · Giardini · Stahl', 'chosen because the film stays', 'flexible: it bends without', 'cracking at the folds']} s={10.5} lh={14} />

      <T x={16} y={302} s={10.5} c={C.faint}>
        Condition: neatsfoot oil or cream · reptile: Saphir Reptan or lanolin.
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* Lesson: The bench — tools that matter (sm-tools)                     */
/* ================================================================== */

/* Cutting: blade vertical against a steel rule */
function ToolCut() {
  const lx = 20
  const rx = 228
  const yS = 168
  const t = 24
  const cut = 118
  const kerf = (x, y, depth) => (
    <g>
      <Layer x={x} y={y} w={58} h={12} k="grain" />
      <line x1={x + 29} y1={y} x2={x + 29} y2={y + depth} stroke={C.hole} strokeWidth="2" />
      {depth < 12 && <line x1={x + 29} y1={y + depth} x2={x + 29} y2={y + 12} stroke={C.dim} strokeWidth="0.8" strokeDasharray="2 2" />}
    </g>
  )
  return (
    <Fig h={340} view="End view & plan · cutting" scale="schematic · leather ×20">
      <Tag x={16} y={40}>
        End view
      </Tag>
      <Slab x={lx} y={yS + t} w={rx - lx} h={16} kind="board" />
      <Layer x={lx} y={yS} w={rx - lx} h={t} k="grain" />
      <rect x={28} y={yS - 18} width={cut - 28} height={18} rx="1.5" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
      <line x1={cut} y1={yS} x2={cut} y2={yS + 16} stroke={C.hole} strokeWidth="2.2" />
      <line x1={cut} y1={yS + 16} x2={cut} y2={yS + t} stroke={C.dim} strokeWidth="0.9" strokeDasharray="2 2" />
      <Knife kind="utility" x={cut + 4} y={yS + 15} />
      <path d={`M${cut + 9} ${yS} v-9 h9`} fill="none" stroke={C.emerald} strokeWidth="1" />
      <T x={cut + 22} y={yS - 6} s={10.5} c={C.emerald}>
        90°
      </T>
      {[60, 92].map((x) => (
        <Arrow key={x} a={[x, yS - 42]} b={[x, yS - 22]} c="brass" w={1.6} />
      ))}
      <Lead p={[44, yS - 9]} t={[24, 100]} text="steel rule" a="start" sub="held down hard" />
      <Lead p={[cut + 6, yS - 46]} t={[146, 84]} text="utility knife" a="start" sub="fresh blade" />
      <T x={70} y={yS + 16} a="middle" s={10.5} c={LIGHT}>
        keep
      </T>
      <T x={176} y={yS + 16} a="middle" s={10.5} c={LIGHT}>
        waste
      </T>
      <Lead p={[150, yS + t + 10]} t={[150, 226]} text="cutting board" a="middle" s={10.5} />
      <T x={130} y={254} a="middle" s={10.5}>
        several light passes, not one heavy one:
      </T>
      {kerf(24, 266, 4)}
      {kerf(96, 266, 8)}
      {kerf(168, 266, 12)}
      {[1, 2, 3].map((n, i) => (
        <g key={n}>
          <Num x={53 + i * 72} y={296} n={n} r={7} />
        </g>
      ))}
      <T x={130} y={320} a="middle" s={10} c={C.faint}>
        pass 3 cuts through, clean and square
      </T>

      <Sep x1={240} y1={30} x2={240} y2={330} />

      <Tag x={254} y={40}>
        Plan: straights before curves
      </Tag>
      <rect x={252} y={52} width={214} height={130} rx="4" fill="rgba(231,224,207,0.10)" stroke={C.line} />
      <rect x={260} y={92} width={198} height={78} rx="2" fill="url(#sk-top)" stroke="#5c3c1d" />
      <StrapPlan T={{ x: 270, y: 131, s: 1.45 }} o={LONG()} face="none" edge="#f3e6cc" dash="3 2" />
      <Rule x={262} y={131 - 10 * 1.45} len={186} s={3} w={12} />
      <Num x={300} y={72} n={1} r={7} />
      <T x={312} y={76} s={10.5} c={C.text}>
        straights, against the rule
      </T>
      <Num x={428} y={154} n={2} r={7} />
      <T x={416} y={158} a="end" s={10.5} c={LIGHT}>
        then the tip, freehand
      </T>
      <Arrow a={[280, 112]} b={[400, 112]} c="brass" w={1.4} />

      <Tag x={254} y={204}>
        The edge it leaves
      </Tag>
      <XSec cx={300} y={216} w={70} layers={[{ k: 'top', t: 14 }]} edge="square" />
      <Verdict x={352} y={223} ok r={7.5} />
      <T x={300} y={248} a="middle" s={10.5}>
        knife: clean 90°
      </T>
      <XSec cx={412} y={216} w={70} layers={[{ k: 'top', t: 14 }]} edge="rough" />
      <Verdict x={464} y={223} ok={false} r={7.5} />
      <T x={412} y={248} a="middle" s={10.5}>
        rotary cutter: torn
      </T>
      <Note
        x={254}
        y={276}
        head="Knives that work"
        hc={C.text}
        lines={['utility knife (fresh blades) · round', 'head knife · Japanese skiving knife', 'rotary: linings only, if at all']}
        s={10.5}
        lh={14}
      />
    </Fig>
  )
}

/* Skiving: blade low on glass */
function ToolSkive() {
  const E = [95, 182.5]
  const ang = 10.8
  return (
    <Fig h={336} view="Side view · skiving" scale="leather ×20, angle true">
      <Slab x={16} y={196} w={290} h={14} kind="glass" />
      <path d={`M40 196 L40 172 L93 172 L${E[0]} ${E[1]} L150 172 L306 172 L306 196 Z`} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <line x1={E[0]} y1={E[1]} x2={40} y2={193} stroke={C.dim} strokeWidth="0.9" strokeDasharray="3 2" />
      <SideKnife x={E[0]} y={E[1]} ang={ang} L={118} hl={64} />
      {/* shaving curling over the blade */}
      <path d="M93 173 C104 170 118 166 130 162 C144 157 152 146 146 136 C142 130 134 132 136 139" fill="none" stroke="#4a3018" strokeWidth="6.4" strokeLinecap="round" />
      <path d="M93 173 C104 170 118 166 130 162 C144 157 152 146 146 136 C142 130 134 132 136 139" fill="none" stroke="#d3ae7b" strokeWidth="4.8" strokeLinecap="round" />
      {/* angle to the work */}
      <line x1={24} y1={196} x2={40} y2={193} stroke={C.brass} strokeWidth="0.9" strokeDasharray="3 2" />
      <path d={`M${24 + 46} 196 A46 46 0 0 0 ${24 + 46 * Math.cos((ang * Math.PI) / 180)} ${196 - 46 * Math.sin((ang * Math.PI) / 180)}`} fill="none" stroke={C.brass} strokeWidth="1.2" />
      <Lead p={[68, 194]} t={[36, 232]} text="blade 10–15° to the work" a="start" c={C.brass} />
      <Lead p={[150, 172]} t={[176, 232]} text="skive line, on the flesh" a="start" s={10.5} />
      <Lead p={[146, 140]} t={[176, 96]} text="shaving" a="start" s={10.5} sub="lifts over the blade" />
      <Lead p={[62, 189]} t={[24, 118]} text="line of cut, feathers out" a="start" s={10.5} />
      <T x={250} y={189} a="middle" s={10.5} c={LIGHT}>
        flesh side up
      </T>
      <Lead p={[290, 205]} t={[290, 252]} text="glass plate" a="middle" s={10.5} />
      <Arrow a={[262, 128]} b={[206, 139]} c="brass" w={1.6} />

      <Tag x={322} y={44}>
        Skiving tools
      </Tag>
      {[
        ['Japanese skiving knife', 'Kyoshin Elle or similar'],
        ['English paring knife', 'Osborne 469B'],
        ['¼-inch wood chisel', 'for narrow pieces'],
        ['Safety skiver', 'small areas, soft calf'],
        ['Hard flat base', 'granite plate or glass'],
      ].map(([a, b], i) => (
        <g key={a}>
          <T x={322} y={66 + i * 32} s={11} c={C.text} w="600">
            {a}
          </T>
          <T x={322} y={79 + i * 32} s={10} c={C.faint}>
            {b}
          </T>
        </g>
      ))}

      <Sep x1={14} y1={262} x2={466} y2={262} />
      {[
        { x: 16, ang: 28, ok: false, t: '> 20°', sub: 'gouges, cuts through' },
        { x: 170, ang: 12, ok: true, t: '10–15°', sub: 'an even taper' },
        { x: 324, ang: 3, ok: false, t: '< 5°', sub: 'skates off the surface' },
      ].map((c) => {
        const cx = c.x + 76
        const y0 = 304
        const r = (c.ang * Math.PI) / 180
        return (
          <g key={c.t}>
            <T x={c.x + 4} y={280} s={11.5} c={c.ok ? C.emerald : C.ruby} w="600" mono>
              {c.t}
            </T>
            <Verdict x={c.x + 136} y={276} ok={c.ok} r={7} />
            {c.ok ? (
              <path d={`M${c.x + 6} ${y0 + 12} L${c.x + 6} ${y0 + 10} L${cx} ${y0} L${c.x + 142} ${y0} L${c.x + 142} ${y0 + 12} Z`} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.7" />
            ) : (
              <rect x={c.x + 6} y={y0} width={136} height={12} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.7" />
            )}
            {c.ang > 20 && <path d={`M${cx} ${y0} L${cx - 12 / Math.tan(r)} ${y0 + 12} L${cx - 12 / Math.tan(r) + 4} ${y0 + 12} Z`} fill={C.hole} />}
            {c.ang < 5 && <Arrow a={[cx - 6, y0 - 3]} b={[cx - 50, y0 - 3]} c="ruby" w={1.2} />}
            <line x1={cx} y1={y0 - (c.ang < 5 ? 1 : 0)} x2={cx + 62 * Math.cos(r)} y2={y0 - 62 * Math.sin(r) - (c.ang < 5 ? 1 : 0)} stroke="url(#sk-steelH)" strokeWidth="4" strokeLinecap="round" />
            <T x={cx} y={330} a="middle" s={10.5}>
              {c.sub}
            </T>
          </g>
        )
      })}
    </Fig>
  )
}

/* Measuring and marking */
function ToolMeasure() {
  // calipers on a lug gap, 5 px/mm
  const L1 = 84
  const L2 = 184
  const by = 114
  return (
    <Fig h={336} view="Tools · measuring & marking" scale="schematic">
      <Tag x={16} y={40}>
        Calipers, reading to 0.1 mm
      </Tag>
      <path d={`M36 48 L232 48 L232 66 Q134 88 36 66 Z`} fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.9" />
      {[
        [L1 - 22, L1],
        [L2, L2 + 22],
      ].map(([a, b]) => (
        <path key={a} d={`M${a} 62 L${b} 66 L${b} 120 Q${(a + b) / 2} 130 ${a} 120 Z`} fill="rgba(180,196,206,0.16)" stroke="#9fb4c2" strokeWidth="1" strokeDasharray="4 3" />
      ))}
      <circle cx={L1 - 4} cy={by - 8} r={2.4} fill={C.hole} stroke="#9fb4c2" strokeWidth="0.6" />
      <circle cx={L2 + 4} cy={by - 8} r={2.4} fill={C.hole} stroke="#9fb4c2" strokeWidth="0.6" />
      <line x1={L1} y1={by - 8} x2={L2} y2={by - 8} stroke={C.steel} strokeWidth="0.8" strokeDasharray="6 3 2 3" />
      <Calipers x1={L1} x2={L2} y={by} reading="20.0" up={false} />
      <T x={134} y={84} a="middle" s={10} c={C.dim}>
        case
      </T>
      <T x={134} y={by - 12} a="middle" s={10} c={C.steel}>
        bar axis
      </T>
      <T x={30} y={180} s={10.5} c={C.text}>
        measure at the bar
      </T>
      <Note x={346} y={86} head="Lug gap: 20.0" hc={C.text} lines={['strap must finish', 'within 0.2 mm of it', '(19.8–20.0 here)']} s={10.5} lh={14} />

      <Sep x1={14} y1={186} x2={466} y2={186} />

      {/* wing dividers scribing the stitch line */}
      <Tag x={16} y={204}>
        Wing dividers, set 1.5–3 mm
      </Tag>
      <rect x={60} y={232} width={186} height={66} rx="2" fill="url(#sk-top)" stroke="#5c3c1d" />
      <line x1={150} y1={256} x2={246} y2={256} stroke={LIGHT} strokeWidth="1" strokeDasharray="3 2" />
      <Dividers sp={24} h={62} x={150} y={244} ang={90} />
      <VDim x={50} y1={232} y2={256} side="l" text="3" from={60} />
      <Arrow a={[138, 282]} b={[88, 282]} c="brass" w={1.6} />
      <Lead p={[150, 232]} t={[176, 216]} text="one point rides the edge" a="start" s={10.5} />
      <T x={152} y={292} s={10.5} c={LIGHT}>
        stitch or skive line
      </T>

      <Sep x1={256} y1={196} x2={256} y2={326} />

      {/* scratch awl, rule, silver pen */}
      <Tag x={268} y={204}>
        Awl, rule, silver pen
      </Tag>
      <rect x={268} y={226} width={196} height={78} rx="2" fill="url(#sk-flesh)" stroke="#9c7c52" />
      <rect x={268} y={226} width={196} height={78} rx="2" fill="url(#sk-fibre)" />
      <Rule x={272} y={248} len={120} s={3} w={12} />
      <line x1={274} y1={249.5} x2={392} y2={249.5} stroke="#dfe5e8" strokeWidth="1.4" />
      <g transform="rotate(-38 392 249)">
        <rect x={392} y={246} width={40} height={6} rx="3" fill="#7d8890" stroke="#2f383e" strokeWidth="0.6" />
        <path d="M392 246 L384 249 L392 252 Z" fill="#dfe5e8" />
      </g>
      {[398, 414, 430].map((x) => (
        <circle key={x} cx={x} cy={282} r={1.4} fill={C.hole} />
      ))}
      <Awl kind="scratch" x={446} y={282} ang={18} k={0.62} />
      <T x={276} y={274} s={10.5} c={C.text}>
        steel rule
      </T>
      <T x={276} y={296} s={10.5} c={C.text}>
        silver pen line
      </T>
      <T x={466} y={322} a="end" s={10.5}>
        scratch awl pricks the marks
      </T>
    </Fig>
  )
}

/* Pricking irons */
function Slits({ x0, y, n, pitch, kind = 'french', c = C.hole, len = 9 }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + i * pitch
        if (kind === 'diamond')
          return <path key={i} d={`M${x - len * 0.62} ${y + 2.2} L${x} ${y - 3.2} L${x + len * 0.62} ${y - 2.2} L${x} ${y + 3.2} Z`} fill={c} stroke="#e7c48f" strokeWidth="0.5" />
        return <line key={i} x1={x - len * 0.32} y1={y + len * 0.38} x2={x + len * 0.32} y2={y - len * 0.38} stroke={c} strokeWidth="2.2" strokeLinecap="round" />
      })}
    </g>
  )
}
function Stitches({ x0, y, n, pitch, w = 2.4, slant = 3 }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + i * pitch
        return (
          <line key={i} x1={x + pitch * 0.12} y1={y + slant} x2={x + pitch * 0.88} y2={y - slant} stroke={C.thread} strokeWidth={w} strokeLinecap="round" />
        )
      })}
    </g>
  )
}

function ToolIrons() {
  const col = (x0, kind, title, sub1, sub2) => (
    <g>
      <Tag x={x0} y={40}>
        {title}
      </Tag>
      <Iron n={4} pitch={18} kind={kind === 'diamond' ? 'diamond' : 'french'} x={x0 + 104} y={122} />
      {/* prong tip, end-on */}
      <g>
        <rect x={x0 + 4} y={58} width={52} height={46} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
        {kind === 'diamond' ? (
          <path d={`M${x0 + 16} 88 L${x0 + 30} 70 L${x0 + 44} 74 L${x0 + 30} 92 Z`} fill="url(#sk-steel)" stroke="#3b4850" />
        ) : (
          <path d={`M${x0 + 20} 94 L${x0 + 38} 66 L${x0 + 42} 68 L${x0 + 24} 96 Z`} fill="url(#sk-steel)" stroke="#3b4850" />
        )}
        <T x={x0 + 30} y={118} a="middle" s={10} c={C.faint}>
          prong, end-on
        </T>
      </g>
      <rect x={x0} y={132} width={218} height={28} rx="2" fill="url(#sk-top)" stroke="#5c3c1d" />
      <line x1={x0 + 4} y1={146} x2={x0 + 214} y2={146} stroke={LIGHT} strokeWidth="0.6" strokeDasharray="2 3" opacity="0.6" />
      <Slits x0={x0 + 14} y={146} n={11} pitch={19} kind={kind} len={kind === 'diamond' ? 12 : 10} />
      <Stitches x0={x0 + 14 + 19 * 5} y={146} n={5} pitch={19} w={3} slant={kind === 'diamond' ? 2 : 4} />
      <T x={x0 + 60} y={174} a="middle" s={10} c={C.faint}>
        holes
      </T>
      <T x={x0 + 160} y={174} a="middle" s={10} c={C.faint}>
        stitched
      </T>
      <T x={x0} y={192} s={11} c={C.text} w="600">
        {sub1}
      </T>
      <T x={x0} y={205} s={10.5}>
        {sub2}
      </T>
    </g>
  )
  const rows = [
    ['#8', 3.38],
    ['#9', 3.0],
    ['#10', 2.7],
    ['#12', 2.25],
  ]
  return (
    <Fig h={344} view="Tool · pricking irons" scale="sizes drawn ×10">
      {col(16, 'french', 'French iron', 'narrow, slanted slits', 'angled stitch, crisp line')}
      <Sep x1={240} y1={30} x2={240} y2={208} />
      {col(250, 'diamond', 'Japanese “diamond” iron', 'wider lozenges', 'the stitch lies flatter')}

      <Sep x1={14} y1={216} x2={466} y2={216} />
      <Tag x={16} y={234}>
        Vergez Blanchard spacing
      </Tag>
      <line x1={206} y1={230} x2={306} y2={230} stroke={C.dim} strokeWidth="1.2" />
      {[206, 256, 306].map((x) => (
        <line key={x} x1={x} y1={226} x2={x} y2={234} stroke={C.dim} strokeWidth="1" />
      ))}
      <T x={312} y={234} s={10} mono>
        10 mm
      </T>
      {rows.map(([n, p], i) => {
        const y = 256 + i * 23
        const def = n === '#9'
        return (
          <g key={n}>
            {def && <rect x={10} y={y - 11} width={348} height={22} rx="4" fill="rgba(123,165,131,0.10)" stroke={C.emerald} strokeDasharray="3 2" />}
            <T x={16} y={y + 4} s={11.5} c={C.text} w="600">
              {n}
            </T>
            <T x={46} y={y + 4} s={11} mono c={def ? C.emerald : C.brass}>
              {p.toFixed(2)} mm
            </T>
            <rect x={118} y={y - 8} width={190} height={16} rx="2" fill="url(#sk-top)" stroke="#5c3c1d" />
            <Slits x0={130} y={y} n={6} pitch={p * 10} len={8} />
            {def && (
              <T x={314} y={y + 4} s={10.5} c={C.emerald} w="600">
                default
              </T>
            )}
          </g>
        )
      })}

      <Tag x={370} y={234}>
        Prongs
      </Tag>
      <Iron n={2} pitch={12} x={378} y={306} k={0.75} />
      <Iron n={6} pitch={9} x={422} y={306} k={0.75} />
      <T x={384} y={322} a="middle" s={10.5} c={C.text}>
        2-prong
      </T>
      <T x={384} y={335} a="middle" s={10}>
        curves, tip
      </T>
      <T x={440} y={322} a="middle" s={10.5} c={C.text}>
        6–12-prong
      </T>
      <T x={440} y={335} a="middle" s={10}>
        straights
      </T>
    </Fig>
  )
}

/* Needles and awls */
function NeedleBody({ x, y, L, d }) {
  const r = d / 2
  const tl = L * 0.07
  const eye = [x + L * 0.025, L * 0.05]
  return (
    <g>
      <path
        d={`M${x + r} ${y - r} H${x + L - tl} Q${x + L - tl * 0.3} ${y - r * 0.9} ${x + L - 1.2} ${y - r * 0.4} Q${x + L} ${y} ${x + L - 1.2} ${y + r * 0.4} Q${x + L - tl * 0.3} ${y + r * 0.9} ${x + L - tl} ${y + r} H${x + r} A${r} ${r} 0 0 1 ${x + r} ${y - r} Z`}
        fill="url(#sk-steel)"
        stroke="#3b4850"
        strokeWidth="0.6"
      />
      <rect x={eye[0]} y={y - r * 0.32} width={eye[1]} height={r * 0.64} rx={r * 0.3} fill={C.ground} />
    </g>
  )
}

function ToolNeedles() {
  const K = 6
  const n4 = { x: 24, y: 72, L: 48 * K, d: 0.86 * K }
  const n2 = { x: 24, y: 126, L: 54 * K, d: 1.02 * K }
  const awlRow = (y, kind, title, sub) => (
    <g>
      <Awl kind={kind === 'diamond' ? 'diamond' : 'round'} x={156} y={y} ang={-90} />
      <rect x={176} y={y - 20} width={40} height={40} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
      {kind === 'diamond' ? (
        <path d={`M184 ${y} L196 ${y - 8} L208 ${y} L196 ${y + 8} Z`} fill="url(#sk-steel)" stroke="#3b4850" />
      ) : (
        <circle cx={196} cy={y} r={7} fill="url(#sk-steel)" stroke="#3b4850" />
      )}
      <T x={196} y={y + 32} a="middle" s={10} c={C.faint}>
        end-on
      </T>
      <Arrow a={[222, y]} b={[240, y]} c="brass" w={1.4} />
      <rect x={246} y={y - 20} width={62} height={40} rx="2" fill="url(#sk-top)" stroke="#5c3c1d" />
      {kind === 'diamond' ? (
        <path d={`M266 ${y + 6} L277 ${y - 5} L288 ${y - 6} L277 ${y + 5} Z`} fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />
      ) : (
        <circle cx={277} cy={y} r={5} fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />
      )}
      <T x={277} y={y + 32} a="middle" s={10} c={C.faint}>
        the hole
      </T>
      <T x={322} y={y - 4} s={11.5} c={C.text} w="600">
        {title}
      </T>
      <T x={322} y={y + 10} s={10.5}>
        {sub}
      </T>
    </g>
  )
  return (
    <Fig h={340} view="Tool · harness needles & awls" scale="needles true ×6">
      <T x={24} y={50} s={11.5} c={C.text} w="600">
        John James 004
      </T>
      <T x={136} y={50} s={11} mono c={C.brass}>
        48 × 0.86 mm
      </T>
      <NeedleBody {...n4} />
      <HDim x1={n4.x} x2={n4.x + n4.L} y={88} text="" />
      <T x={24} y={110} s={11.5} c={C.text} w="600">
        John James 002
      </T>
      <T x={136} y={110} s={11} mono c={C.brass}>
        54 × 1.02 mm
      </T>
      <NeedleBody {...n2} />
      <HDim x1={n2.x} x2={n2.x + n2.L} y={144} text="" />
      <Lead p={[34, n2.y]} t={[44, 164]} text="eye" a="start" s={10.5} />
      <Magnifier cx={418} cy={92} r={40} fx={n2.x + n2.L - 6} fy={n2.y} k={4}>
        <NeedleBody {...n2} />
      </Magnifier>
      <T x={418} y={148} a="middle" s={11} c={C.text} w="600">
        blunt, rounded tip
      </T>
      <T x={418} y={162} a="middle" s={10.5}>
        follows the punched hole,
      </T>
      <T x={418} y={175} a="middle" s={10.5}>
        never cuts the fibres
      </T>

      <Sep x1={14} y1={190} x2={466} y2={190} />
      <Tag x={16} y={208}>
        Awls
      </Tag>
      {awlRow(240, 'diamond', 'Diamond awl', 'opens slits')}
      {awlRow(302, 'round', 'Polished round awl', 'round holes at the tip')}
    </Fig>
  )
}

/* Edge tools: beveller, sanding stick, slicker, creaser */
function ToolEdge() {
  const cells = [
    { x: 14, y: 30, k: 'bevel' },
    { x: 246, y: 30, k: 'sand' },
    { x: 14, y: 184, k: 'slick' },
    { x: 246, y: 184, k: 'crease' },
  ]
  const text = {
    bevel: ['Edge beveller', [['0.5–0.7 mm bevel', C.brass], ['Tandy #0 = 0.7', C.dim], ['Kevin Lee = 0.5', C.dim], ['Kyoshin Elle size 0', C.dim], ['bigger bevels crack', C.ruby], ['paint at the folds', C.ruby]]],
    sand: ['Sanding stick', [['220 → 1200 grit', C.brass], ['paper on a block', C.dim], ['levels the layers', C.dim], ['flush, lengthwise', C.dim]]],
    slick: ['Slicker + canvas', [['wood or glass', C.brass], ['friction compresses', C.dim], ['and glazes the', C.dim], ['dampened edge', C.dim]]],
    crease: ['Creaser', [['1.5 mm line', C.brass], ['heated over a spirit', C.dim], ['lamp, or electric', C.dim], ['decorative line that', C.dim], ['also seals the edge', C.dim]]],
  }
  return (
    <Fig h={340} view="Tools · edge" scale="sections ×4, schematic">
      {cells.map(({ x, y, k }) => {
        const cx = x + 50
        const sy = y + 84
        const right = cx + 36
        const [title, lines] = text[k]
        return (
          <g key={k}>
            <Panel x={x} y={y} w={220} h={146} />
            {k === 'bevel' && (
              <g>
                <XSec cx={cx} y={sy} w={72} layers={[{ k: 'top', t: 12 }, { k: 'lining', t: 8 }]} edge="bevel" b={3.5} />
                <path d={`M${right - 3.5} ${sy - 1} l5 -5 l3 3 Z`} fill={C.brass} />
                <Beveller x={right - 1} y={sy + 1} ang={28} k={0.5} />
                <Magnifier cx={cx - 8} cy={y + 36} r={22} fx={right - 2} fy={sy + 2} k={3} lc={C.brass}>
                  <XSec cx={cx} y={sy} w={72} layers={[{ k: 'top', t: 12 }, { k: 'lining', t: 8 }]} edge="bevel" b={3.5} />
                </Magnifier>
              </g>
            )}
            {k === 'sand' && (
              <g>
                <XSec cx={cx} y={sy} w={72} layers={[{ k: 'top', t: 12 }, { k: 'lining', t: 8 }]} edge="bevel" b={3.5} />
                <Sander x={right + 1} y={sy + 10} ang={90} len={74} />
                <Arrow a={[right + 26, sy - 18]} b={[right + 26, sy + 38]} c="brass" w={1.5} both />
              </g>
            )}
            {k === 'slick' && (
              <g>
                <circle cx={right + 16} cy={sy + 10} r={20} fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.8" />
                <XSec cx={cx} y={sy} w={72} layers={[{ k: 'top', t: 12 }, { k: 'lining', t: 8 }]} edge="round" />
                <path d={`M${right - 6} ${sy - 2} A12 12 0 0 1 ${right - 6} ${sy + 22}`} fill="none" stroke="#3e2614" strokeWidth="1.4" />
                <Arrow d={`M${right + 2} ${sy - 18} A22 22 0 0 1 ${right + 32} ${sy - 18}`} c="brass" w={1.4} both />
                <Lead p={[right + 2, sy + 21]} t={[right - 6, sy + 46]} text="groove fits the edge" a="middle" s={10} />
              </g>
            )}
            {k === 'crease' && (
              <g>
                <XSec cx={cx} y={sy} w={72} layers={[{ k: 'top', t: 12 }, { k: 'lining', t: 8 }]} edge="round" />
                <path d={`M${right - 7.4} ${sy} l1.6 3 l1.6 -3 Z`} fill={C.hole} />
                <Creaser x={right - 5.8} y={sy - 0.5} hot k={0.62} />
                <HDim x1={right - 5.4} x2={right} y={sy + 30} />
                <line x1={right - 5.4} y1={sy + 4} x2={right - 5.4} y2={sy + 33} stroke={C.dim} strokeWidth="0.5" opacity="0.6" />
                <T x={right + 4} y={sy + 34} s={10} mono>
                  1.5
                </T>
              </g>
            )}
            <T x={x + 122} y={y + 22} s={11.5} c={C.text} w="600">
              {title}
            </T>
            {lines.map(([l, c], i) => (
              <T key={l} x={x + 122} y={y + 40 + i * 14} s={10.5} c={c}>
                {l}
              </T>
            ))}
          </g>
        )
      })}
    </Fig>
  )
}

/* Punches */
function ToolPunch() {
  const K = 8
  const holes = [1.0, 1.2, 1.5, 1.8, 2.0]
  return (
    <Fig h={340} view="Tools · punches & the holes they leave" scale="holes true ×8">
      {/* round punches */}
      <Tag x={16} y={40}>
        Round punches
      </Tag>
      <Slab x={20} y={136} w={170} h={10} kind="board" />
      <Layer x={20} y={128} w={170} h={8} k="top" />
      <rect x={124} y={128} width={12} height={8} fill={C.ground} />
      <Punch d={12} x={130} y={128} />
      <Mallet x={130} y={64} k={0.62} />
      <Lead p={[180, 141]} t={[184, 160]} text="poly pad" a="end" s={10} />
      <rect x={20} y={168} width={170} height={36} rx="2" fill="url(#sk-top)" stroke="#5c3c1d" />
      {holes.map((d, i) => {
        const x = 38 + i * 32
        return (
          <g key={d}>
            <circle cx={x} cy={186} r={(d * K) / 2} fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />
            <T x={x} y={218} a="middle" s={10.5} mono c={C.brass}>
              {d.toFixed(1)}
            </T>
          </g>
        )
      })}
      <T x={20} y={238} s={10.5}>
        Horotec-style pliers: 1.0–2.0
      </T>
      <T x={20} y={252} s={10.5} c={C.ruby}>
        rotary punch starts at 2.0:
      </T>
      <T x={20} y={265} s={10.5} c={C.ruby}>
        too big for most straps
      </T>

      <Sep x1={200} y1={30} x2={200} y2={270} />
      {/* oblong punch */}
      <Tag x={210} y={40}>
        Oblong punch
      </Tag>
      <Slab x={210} y={136} w={110} h={10} kind="board" />
      <Layer x={210} y={128} w={110} h={8} k="top" />
      <Punch kind="oblong" d={7.7} x={264} y={128} />
      <rect x={224} y={170} width={80} height={20} rx="10" fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />
      <HDim x1={224} x2={304} y={164} text="≈ 10" />
      <VDim x={310} y1={170} y2={190} text="2–3" c={C.text} />
      <T x={210} y={210} s={10.5} c={C.text}>
        tongue slot
      </T>
      <T x={210} y={224} s={10}>
        or a round hole at each
      </T>
      <T x={210} y={237} s={10}>
        end, knife cut between:
      </T>
      <circle cx={232} cy={254} r={8} fill={C.hole} />
      <circle cx={288} cy={254} r={8} fill={C.hole} />
      <line x1={232} y1={254} x2={288} y2={254} stroke={C.hole} strokeWidth="2" />
      <line x1={232} y1={246} x2={288} y2={246} stroke={C.dim} strokeWidth="0.6" strokeDasharray="2 2" />
      <line x1={232} y1={262} x2={288} y2={262} stroke={C.dim} strokeWidth="0.6" strokeDasharray="2 2" />

      <Sep x1={330} y1={30} x2={330} y2={270} />
      {/* QR notch plier */}
      <Tag x={340} y={40}>
        QR notch plier
      </Tag>
      <NotchPlier x={360} y={84} k={0.62} />
      <T x={340} y={118} s={10.5} c={C.text}>
        e.g. Bergeon 31227
      </T>
      <rect x={340} y={136} width={126} height={84} fill="url(#sk-linS)" stroke="#8f7b5a" />
      <line x1={340} y1={150} x2={466} y2={150} stroke={C.text} strokeWidth="0.9" strokeDasharray="4 3" />
      <ellipse cx={372} cy={150} rx={20} ry={4} fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />
      <HDim x1={352} x2={392} y={170} text="≈ 5" below c="#5a4630" ext={155} />
      <VDim x={404} y1={146} y2={154} text="≈ 1" c="#5a4630" from={392} />
      <T x={462} y={212} a="end" s={10} c="#7a6446">
        bar line dashed
      </T>
      <T x={340} y={238} s={10.5}>
        notch for the
      </T>
      <T x={340} y={251} s={10.5}>
        quick-release knob
      </T>
      <T x={340} y={265} s={10} c={C.faint}>
        lining side, drawn ×8
      </T>

      <Sep x1={14} y1={280} x2={466} y2={280} />
      {/* end punch and mallet */}
      <Tag x={16} y={298}>
        End punch · mallet
      </Tag>
      <StrapPlan T={{ x: 24 - 98 * 1.8, y: 318, s: 1.8 }} o={LONG({ x0: 98 })} face="grain" />
      <path
        d={pathOf(
          outline(LONG({ x0: 104, w0: 20.6, w1: 18.6, tipLen: 14.3, x1: 120.3 })).filter(([x]) => x > 104.5),
          { x: 24 - 98 * 1.8, y: 318, s: 1.8 },
          false
        )}
        fill="none"
        stroke="url(#sk-steelH)"
        strokeWidth="3.2"
      />
      <T x={96} y={314} s={10.5} c={C.text}>
        end punch = tip width
      </T>
      <T x={96} y={328} s={10.5}>
        one blow cuts the tip
      </T>
      <g>
        <rect x={242} y={304} width={28} height={24} rx="5" fill="#e7e0d0" stroke="#8d8576" />
        <path d="M270 312 L306 308 L306 316 L270 318 Z" fill="url(#sk-wood)" />
        <Verdict x={320} y={312} ok r={7} />
        <T x={332} y={308} s={10.5} c={C.text}>
          poly or rawhide mallet
        </T>
        <T x={332} y={322} s={10} c={C.ruby}>
          rubber bounces; steel
        </T>
        <T x={332} y={335} s={10} c={C.ruby}>
          burrs the tool heads
        </T>
      </g>
    </Fig>
  )
}

/* Folding and pressing */
function ToolFold() {
  const cx = 74
  const cy = 156
  const r = 11
  const t = 12
  const y1 = cy - r
  return (
    <Fig h={336} view="Tools · folding & pressing" scale="schematic">
      <Tag x={16} y={40}>
        Setting a fold round a former
      </Tag>
      <Ply x1={cx} x2={250} y={y1 - t} t={t} open="l" />
      <Wrap cx={cx} cy={cy} r={r} t={t} xR={cx} conv={30} tail={64} ts={6} />
      <BarEnd cx={cx} cy={cy} r={r * 0.95} c="#7f8f99" />
      <circle cx={cx} cy={cy} r={7.5} fill="none" stroke={C.text} strokeWidth="0.9" strokeDasharray="2 2" />
      <BoneFolder x={cx - 18} y={y1 - 7} ang={-42} k={0.62} />
      <Arrow d={`M${cx - 44} ${y1 - 18} q-6 18 4 34`} c="brass" w={1.5} />
      <Pliers x={cx + 50} y={y1 - t / 2 + 3} open={t + 6} k={0.9} />
      <Lead p={[cx + 6, cy + 4]} t={[30, 222]} text="former rod" a="start" sub="a little larger than the bar" />
      <Lead p={[cx + 3, cy - 6]} t={[132, 214]} text="bar Ø (dashed)" a="start" s={10.5} />
      <Lead p={[cx - 30, y1 - 32]} t={[120, 62]} text="bone, agate or PTFE folder" a="start" sub="(plioir) sets the fold" />
      <Lead p={[cx + 50, y1 - 18]} t={[160, 104]} text="leather-tipped pliers" a="start" sub="crease it tight" />
      <T x={30} y={262} s={10.5}>
        The rod holds the bar channel
      </T>
      <T x={30} y={276} s={10.5}>
        open while the glue sets.
      </T>

      <Sep x1={264} y1={30} x2={264} y2={326} />

      <Tag x={276} y={40}>
        Rubber roller
      </Tag>
      <Ply x1={282} x2={462} y={120} t={10} />
      <Ply x1={282} x2={462} y={130} t={6} k="lining" />
      <Roller x={330} y={120} k={0.8} />
      <Arrow a={[360, 110]} b={[440, 110]} c="brass" w={1.5} />
      <Verdict x={452} y={58} ok r={7.5} />
      <T x={282} y={156} s={10.5} c={C.text}>
        laminating flat layers
      </T>
      <Verdict x={290} y={172} ok={false} r={7} />
      <T x={302} y={176} s={10.5} c={C.ruby}>
        never over a fold with
      </T>
      <T x={302} y={189} s={10.5} c={C.ruby}>
        reinforcement in it
      </T>

      <Sep x1={272} y1={202} x2={466} y2={202} />
      <Tag x={276} y={220}>
        Polished hammer
      </Tag>
      <Slab x={282} y={302} w={180} h={16} kind="granite" />
      <Ply x1={330} x2={458} y={276} t={8} open="l" />
      <Wrap cx={330} cy={289} r={5} t={8} xR={330} conv={14} tail={36} ts={4} />
      <Hammer x={392} y={276} k={0.8} />
      <Arrow a={[372, 246]} b={[372, 268]} c="brass" w={1.4} />
      <T x={466} y={330} a="end" s={10.5}>
        on marble: flattens and sets
      </T>
    </Fig>
  )
}

/* Holding the work */
function ToolHold() {
  return (
    <Fig h={330} view="Holding the work" scale="schematic">
      {/* pony */}
      <Tag x={16} y={40}>
        Stitching pony
      </Tag>
      <rect x={88} y={96} width={9} height={92} rx="1.5" fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <Pony x={92} y={188} k={0.62} w={16} />
      {[112, 124, 136, 148, 160].map((yy) => (
        <line key={yy} x1={88} y1={yy} x2={97} y2={yy - 3} stroke={C.thread} strokeWidth="1.4" />
      ))}
      <Needle x1={97} y1={134} x2={150} y2={118} thread="M150 118 q14 -4 22 6" />
      <Needle x1={88} y1={138} x2={34} y2={154} thread="M34 154 q-12 4 -16 -6" />
      <T x={16} y={62} s={10.5}>
        holds the strap upright:
      </T>
      <T x={16} y={76} s={10.5}>
        a needle in each hand
      </T>
      <T x={92} y={316} a="middle" s={10} c={C.faint}>
        clamp or pony
      </T>

      <Sep x1={170} y1={30} x2={170} y2={320} />
      {/* punch pad */}
      <Tag x={182} y={40}>
        Punch pad
      </Tag>
      <Slab x={186} y={196} w={128} h={18} kind="board" />
      <Layer x={186} y={188} w={128} h={8} k="top" />
      <Punch d={9} x={250} y={188} />
      <Mallet x={250} y={124} k={0.62} />
      <Verdict x={300} y={58} ok r={7.5} />
      <T x={186} y={232} s={10.5} c={C.text}>
        poly pad or poundo board
      </T>
      <T x={186} y={246} s={10.5}>
        under every strike
      </T>
      <Verdict x={192} y={270} ok={false} r={7} />
      <T x={204} y={274} s={10.5} c={C.ruby}>
        stone: dulls the punch
      </T>
      <Verdict x={192} y={296} ok={false} r={7} />
      <T x={204} y={300} s={10.5} c={C.ruby}>
        self-healing mat:
      </T>
      <T x={204} y={313} s={10.5} c={C.ruby}>
        the punch goes through
      </T>

      <Sep x1={326} y1={30} x2={326} y2={320} />
      {/* granite slab */}
      <Tag x={338} y={40}>
        Granite slab
      </Tag>
      <Slab x={340} y={196} w={124} h={22} kind="granite" />
      <path d="M352 196 L352 192 L392 186 L456 186 L456 196 Z" fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.8" />
      <SideKnife x={378} y={188} ang={9} L={62} hl={36} />
      <T x={340} y={240} s={10.5} c={C.text}>
        dead, flat, hard:
      </T>
      <T x={340} y={254} s={10.5}>
        skiving and
      </T>
      <T x={340} y={268} s={10.5}>
        hammering
      </T>
      <T x={340} y={290} s={10} c={C.faint}>
        granite or marble
      </T>
    </Fig>
  )
}

/* Matched sets */
function ToolMatched() {
  const rows = [
    { p: '2.7', pv: 2.7, look: ['fine dress', ''], thread: '0.40–0.45 mm', d: 0.43, needle: 'JJ 004', iron: 'VB #10' },
    { p: '3.0', pv: 3.0, look: ['the default', ''], thread: '0.45–0.55 mm', d: 0.5, needle: 'JJ 004', iron: 'VB #9', def: true },
    { p: '3.38', pv: 3.38, look: ['bolder', '20–24 mm straps'], thread: '0.55–0.6 mm', d: 0.58, needle: 'JJ 004 or 002', iron: 'VB #8' },
    { p: '3.85–4.0', pv: 3.85, look: ['casual,', 'rugged'], thread: '0.6 mm', d: 0.6, needle: 'JJ 002', iron: 'Crimson 3.85, KS 4.0' },
  ]
  const K = 10
  return (
    <Fig h={330} view="Chart · matched sets" scale="stitches drawn ×10">
      <Tag x={16} y={42}>
        Pitch
      </Tag>
      <Tag x={110} y={42}>
        Thread · needle · iron
      </Tag>
      <Tag x={290} y={42}>
        The stitch
      </Tag>
      {rows.map((r, i) => {
        const y0 = 60 + i * 64
        const sy = y0 + 22
        const n = Math.floor(170 / (r.pv * K))
        return (
          <g key={r.p}>
            {r.def && <rect x={8} y={y0 - 6} width={464} height={56} rx="6" fill="rgba(123,165,131,0.08)" stroke={C.emerald} strokeDasharray="3 2" />}
            <T x={16} y={y0 + 14} s={14} mono c={C.text} w="600">
              {r.p}
            </T>
            <T x={16} y={y0 + 30} s={10.5} c={r.def ? C.emerald : C.brass}>
              {r.look[0]}
            </T>
            {r.look[1] && (
              <T x={16} y={y0 + 43} s={10.5} c={C.brass}>
                {r.look[1]}
              </T>
            )}
            {[
              ['thread', r.thread],
              ['needle', r.needle],
              ['iron', r.iron],
            ].map(([k, v], j) => (
              <g key={k}>
                <T x={110} y={y0 + 10 + j * 14} s={10} c={C.faint}>
                  {k}
                </T>
                <T x={152} y={y0 + 10 + j * 14} s={10.5} c={C.text}>
                  {v}
                </T>
              </g>
            ))}
            <rect x={290} y={y0} width={176} height={44} rx="2" fill="url(#sk-top)" stroke="#5c3c1d" />
            <Slits x0={300} y={sy} n={n + 1} pitch={r.pv * K} len={8} />
            <Stitches x0={300} y={sy} n={n} pitch={r.pv * K} w={r.d * K} slant={4} />
            <HDim x1={300} x2={300 + r.pv * K} y={y0 + 38} c={LIGHT} />
          </g>
        )
      })}
      <T x={16} y={322} s={10.5}>
        Charts disagree on needles: treat these as a start and test on scrap.
      </T>
    </Fig>
  )
}

/* Bench safety */
function ToolSafety() {
  return (
    <Fig h={340} view="Bench safety" scale="schematic">
      {/* 1 glove + blade */}
      <Tag x={16} y={40}>
        Blade &amp; glove
      </Tag>
      <rect x={20} y={52} width={134} height={160} rx="2" fill="url(#sk-top)" stroke="#5c3c1d" />
      <rect x={74} y={50} width={14} height={164} rx="1.5" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.8" />
      <Hand x={68} y={92} k={0.9} glove />
      <Knife kind="utility" x={89} y={170} ang={18} k={0.75} />
      <Arrow a={[96, 180]} b={[96, 206]} c="emerald" w={1.8} />
      <T x={16} y={232} s={10.5} c={C.text}>
        cut-resistant glove on
      </T>
      <T x={16} y={245} s={10.5} c={C.text}>
        the holding hand
      </T>
      <T x={16} y={259} s={10.5}>
        cut away from the hand
      </T>

      <Sep x1={164} y1={30} x2={164} y2={270} />
      {/* 2 glasses + pad */}
      <Tag x={176} y={40}>
        Striking
      </Tag>
      <Slab x={180} y={176} w={110} h={14} kind="board" />
      <Layer x={180} y={168} w={110} h={8} k="top" />
      <Punch d={9} x={236} y={168} />
      <Mallet x={236} y={104} k={0.6} />
      <path d="M262 62 q6 -4 12 0 h8 q6 -4 12 0" fill="none" stroke={C.steel} strokeWidth="1.6" />
      <ellipse cx={268} cy={66} rx={7} ry={5} fill="rgba(160,200,215,0.25)" stroke={C.steel} strokeWidth="1.2" />
      <ellipse cx={288} cy={66} rx={7} ry={5} fill="rgba(160,200,215,0.25)" stroke={C.steel} strokeWidth="1.2" />
      <T x={176} y={208} s={10.5} c={C.text}>
        safety glasses to punch,
      </T>
      <T x={176} y={221} s={10.5} c={C.text}>
        strike irons, set rivets
      </T>
      <T x={176} y={236} s={10.5}>
        strike on a pad —
      </T>
      <T x={176} y={249} s={10.5} c={C.ruby}>
        never on your knee
      </T>
      <T x={176} y={263} s={10.5}>
        inspect heads first
      </T>

      <Sep x1={308} y1={30} x2={308} y2={270} />
      {/* 3 solvents + hot tools */}
      <Tag x={318} y={40}>
        Solvents · hot tools
      </Tag>
      <rect x={330} y={92} width={30} height={34} rx="3" fill="#6d7a3e" stroke="#2c3218" />
      <rect x={328} y={86} width={34} height={7} rx="2" fill="#9aa4ab" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${340 + i * 6} 84 q-8 -10 2 -18 q10 -8 2 -16`} fill="none" stroke="rgba(160,200,170,0.6)" strokeWidth="1.2" />
      ))}
      <path d="M362 112 q20 8 22 26 q2 16 16 22" fill="none" stroke="rgba(160,200,170,0.6)" strokeWidth="1.4" strokeDasharray="3 2" />
      <T x={404} y={160} s={10} c={C.faint}>
        vapour sinks
      </T>
      <Arrow a={[320, 176]} b={[460, 176]} c="steel" w={1.6} />
      <T x={390} y={192} a="middle" s={10} c={C.steel}>
        cross-ventilation
      </T>
      <rect x={414} y={120} width={36} height={14} rx="3" fill="#3a332c" stroke="#5a5048" />
      <Burner x={430} y={124} ang={-28} k={0.55} on={false} />
      <T x={432} y={148} a="middle" s={10} c={C.faint}>
        in its stand
      </T>
      <T x={318} y={214} s={10.5} c={C.text}>
        read the SDS; choose
      </T>
      <T x={318} y={227} s={10.5} c={C.text}>
        the least toxic product
      </T>
      <T x={318} y={241} s={10.5}>
        hot tools back in their
      </T>
      <T x={318} y={254} s={10.5}>
        stand, then unplugged
      </T>

      <Sep x1={14} y1={278} x2={466} y2={278} />
      <T x={16} y={298} s={10.5}>
        Closed shoes and an apron at the bench. Keep the thread burner
      </T>
      <T x={16} y={312} s={10.5}>
        away from glue and solvent.
      </T>
      <T x={16} y={332} s={11} c={C.ruby} w="600">
        A blunt blade needs force: if you push hard, stop and sharpen.
      </T>
    </Fig>
  )
}

/* ================================================================== */
/* Lesson: Sizing & drafting the pattern (sm-design)                    */
/* ================================================================== */

/* Measure the lug width at the bar */
function T1Lug() {
  const L1 = 100
  const L2 = 220
  const by = 124
  const lug = (outer, inner, dir) =>
    `M${outer} 54 L${inner} 60 L${inner} 140 L${inner - dir * 4} 150 Q${(outer + inner) / 2} 157 ${outer + dir * 4} 150 L${outer} 140 Z`
  const lugs = (
    <g>
      <path d="M40 30 L280 30 L280 58 Q160 84 40 58 Z" fill="url(#sk-steel)" stroke="#3b4850" strokeWidth="0.9" />
      <path d={lug(70, L1, 1)} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.9" />
      <path d={lug(250, L2, -1)} fill="url(#sk-steelH)" stroke="#3b4850" strokeWidth="0.9" />
    </g>
  )
  const X = (v) => 40 + (v - 19.5) * 500
  return (
    <Fig h={322} view="Plan · case end, from below" scale="×6">
      {lugs}
      <rect x={L1} y={by - 4} width={L2 - L1} height={8} rx="4" fill="none" stroke={C.steel} strokeWidth="0.9" strokeDasharray="4 3" />
      <T x={160} y={48} a="middle" s={10.5} c="#3b4850">
        case
      </T>
      <HDim x1={L1} x2={L2} y={100} text="lug gap" />
      <Calipers x1={L1} x2={L2} y={by} reading="20.0" up={false} />
      <T x={160} y={by + 17} a="middle" s={10} c={C.steel}>
        bar (removed)
      </T>
      <Lead p={[85, 96]} t={[34, 92]} text="lug" a="end" s={10.5} />
      <Verdict x={34} y={182} ok r={7} />
      <T x={46} y={186} s={10.5} c={C.emerald}>
        jaws at the bar
      </T>
      <Magnifier cx={410} cy={90} r={40} fx={L2 + 2} fy={146} k={3}>
        {lugs}
      </Magnifier>
      <Verdict x={354} y={150} ok={false} r={7} />
      <T x={366} y={154} s={10.5} c={C.ruby}>
        not at the tips:
      </T>
      <T x={366} y={167} s={10.5} c={C.ruby}>
        they are chamfered
      </T>

      <Sep x1={14} y1={196} x2={466} y2={196} />
      <Tag x={16} y={214}>
        Strap width for a 20.0 mm gap
      </Tag>
      {[
        [19.5, 19.8, 'rgba(194,88,99,0.35)', 'shuffles, looks cheap'],
        [19.8, 20.0, 'rgba(123,165,131,0.45)', 'within 0.2 ✓'],
        [20.0, 20.3, 'rgba(194,88,99,0.35)', 'binds in the lugs'],
      ].map(([a, b, f, l]) => (
        <g key={a}>
          <rect x={X(a)} y={230} width={X(b) - X(a)} height={20} fill={f} />
          <T x={(X(a) + X(b)) / 2} y={244} a="middle" s={10.5} c={LIGHT}>
            {l}
          </T>
        </g>
      ))}
      {Array.from({ length: 9 }, (_, i) => {
        const v = 19.5 + i * 0.1
        return (
          <g key={i}>
            <line x1={X(v)} y1={250} x2={X(v)} y2={256} stroke={C.dim} strokeWidth="0.8" />
            <T x={X(v)} y={268} a="middle" s={10} mono c={Math.abs(v - 20) < 0.01 || Math.abs(v - 19.8) < 0.01 ? C.text : C.dim}>
              {v.toFixed(1)}
            </T>
          </g>
        )
      })}
      <T x={16} y={292} s={10.5}>
        Wider than the gap, the strap binds; more than 0.2 mm under, it shuffles.
      </T>
      <T x={16} y={308} s={10.5} c={C.faint}>
        Read the calipers to 0.1 mm and measure where the bar sits.
      </T>
    </Fig>
  )
}

/* Measure the buckle */
function T1Buckle() {
  const bx = 92
  const by = 150
  const W = 126 // 18 mm × 7
  const L = 100
  const buckle = <Buckle x={bx} y={by} w={W} L={L} />
  return (
    <Fig h={322} view="Plan · tang buckle" scale="×7">
      <rect x={22} y={by - W / 2} width={bx - 22} height={W} fill="rgba(168,118,63,0.18)" stroke="#e0b277" strokeWidth="1" strokeDasharray="4 3" />
      <T x={30} y={by + 4} s={10} c={C.dim}>
        strap end
      </T>
      {buckle}
      <VDim x={212} y1={by - W / 2} y2={by + W / 2} from={150} />
      <T x={220} y={by - 2} s={12} mono c={C.text} w="600">
        18 inside
      </T>
      <T x={220} y={by + 13} s={10.5} c={C.brass}>
        = lug 20 − 2
      </T>
      <Lead p={[bx, by + 66]} t={[70, 254]} text="buckle bar" a="middle" s={10.5} />
      <Lead p={[bx + L - 6, by + 52]} t={[188, 254]} text="frame" a="middle" s={10.5} />
      <Lead p={[bx + 40, by]} t={[132, 118]} text="tongue" a="middle" s={10.5} />
      <Magnifier cx={404} cy={84} r={42} fx={bx + 74} fy={by} k={3}>
        {buckle}
        <VDim x={bx + 80} y1={by - 4.25} y2={by + 4.25} c={C.brassHi} s={4} />
      </Magnifier>
      <T x={404} y={146} a="middle" s={11} c={C.text} w="600">
        tongue width
      </T>
      <T x={404} y={160} a="middle" s={10.5} c={C.brass}>
        runs 1.0–3.0 mm
      </T>

      <Sep x1={250} y1={176} x2={466} y2={176} />
      <Tag x={256} y={194}>
        Tongue sizes holes and slot
      </Tag>
      <rect x={262} y={210} width={14.4} height={9} rx="2" fill="url(#sk-steel)" stroke="#3b4850" />
      <T x={290} y={218} s={10.5} c={C.text}>
        tongue width t
      </T>
      <circle cx={269} cy={244} r={8} fill={C.hole} stroke="#e7c48f" strokeWidth="0.7" />
      <T x={290} y={248} s={10.5} c={C.text}>
        hole Ø ≥ t
      </T>
      <rect x={258} y={270} width={80} height={15} rx="7.5" fill={C.hole} stroke="#e7c48f" strokeWidth="0.7" />
      <T x={346} y={282} s={10.5} c={C.text}>
        slot ≈ 10 × t
      </T>
      <T x={256} y={306} s={10} c={C.faint}>
        drawn ×8
      </T>
      <T x={16} y={296} s={10.5}>
        Measure inside the frame, not over it.
      </T>
    </Fig>
  )
}

/* A sample of the full stack, tried in the lugs */
function T1Sample() {
  const k = 4.4
  const x0 = 40
  const y0 = 70
  const W = 30 * k
  const H = 20 * k
  // folded sample in the lug
  const s = 7
  const bx = 340
  const byy = 150
  const r = 0.9 * s
  const t = 1.1 * s
  const tl = 0.7 * s
  return (
    <Fig h={330} view="Test sample · plan & side view" scale="plan ×4.4 · side ×7">
      <Tag x={16} y={40}>
        A 30 mm sample
      </Tag>
      <rect x={x0 + 4} y={y0 + 4} width={W} height={H} fill="url(#sk-lin)" stroke={C.liningEdge} />
      <rect x={x0 + 2} y={y0 + 2} width={W} height={H} fill="rgba(143,178,201,0.8)" stroke="#4e6f84" />
      <path d={`M${x0} ${y0} H${x0 + W} V${y0 + H - 34} L${x0 + W - 34} ${y0 + H} H${x0} Z`} fill="url(#sk-top)" stroke="#5c3c1d" />
      <path d={`M${x0 + W} ${y0 + H - 34} L${x0 + W - 34} ${y0 + H} L${x0 + W - 46} ${y0 + H - 46} Z`} fill="url(#sk-flesh)" stroke="#9c7c52" />
      <line x1={x0 + 10 * k} y1={y0 - 4} x2={x0 + 10 * k} y2={y0 + H + 4} stroke={C.text} strokeWidth="1" strokeDasharray="4 3" />
      <HDim x1={x0} x2={x0 + W} y={56} text="30" />
      <VDim x={28} y1={y0} y2={y0 + H} side="l" text="20" from={x0} />
      <T x={x0 + W} y={y0 + H + 34} a="end" s={10} c={C.faint}>
        corner peeled back to show the layers
      </T>
      <T x={x0 + 10 * k} y={y0 + H + 18} a="middle" s={10.5} c={C.text}>
        fold here
      </T>
      <T x={16} y={214} s={10.5}>
        the exact stack you plan:
      </T>
      {[
        ['top', 'top 1.0–1.2'],
        ['vel', 'Velodon 0.2'],
        ['lining', 'lining 0.5–1.0'],
      ].map(([kk, l], i) => (
        <g key={kk}>
          <Layer x={16} y={224 + i * 16} w={14} h={9} k={kk} />
          <T x={36} y={232 + i * 16} s={10.5} c={C.text}>
            {l}
          </T>
        </g>
      ))}
      <T x={16} y={286} s={10.5}>
        glued as the strap will be
      </T>

      <Sep x1={226} y1={30} x2={226} y2={300} />
      <Tag x={238} y={40}>
        Folded round the bar, in the lugs
      </Tag>
      <CaseSide x={bx} y={byy} s={s} gap={3.0} len={11} />
      <Ply x1={bx} x2={466} y={byy - r - t} t={t} open="l" />
      <Wrap cx={bx} cy={byy} r={r} t={t} xR={bx} conv={r * 2.6} tail={r * 3.4} ts={t * 0.45} />
      <line x1={bx + r * 2.6 + 2} y1={byy - r + 0.8} x2={466} y2={byy - r + 0.8} stroke={C.velodon} strokeWidth="1.6" />
      <Ply x1={bx + r * 2.6 + 2} x2={466} y={byy - r + 1.6} t={tl} k="lining" skL={[24, tl * 0.3]} cut="top" />
      <BarEnd cx={bx} cy={byy} r={r * 0.92} />
      <line x1={466} y1={byy - r - t - 3} x2={466} y2={byy - r + tl + 5} stroke={C.dim} strokeWidth="0.8" />
      <T x={462} y={byy - r - t - 8} a="end" s={10} c={C.faint}>
        cut end
      </T>
      <HDim x1={bx - 3.0 * s} x2={bx - r - t} y={byy + 34} />
      <line x1={bx - 3.0 * s} y1={byy + 6} x2={bx - 3.0 * s} y2={byy + 37} stroke={C.dim} strokeWidth="0.5" />
      <line x1={bx - r - t} y1={byy + 6} x2={bx - r - t} y2={byy + 37} stroke={C.dim} strokeWidth="0.5" />
      <Lead p={[bx - 3.0 * s + 4, byy + 34]} t={[300, 214]} text="clearance to the case" a="end" s={10.5} c={C.emerald} />
      <Verdict x={246} y={240} ok r={7.5} />
      <T x={260} y={244} s={10.5} c={C.text}>
        slides in, bar seats: build
      </T>
      <T x={260} y={257} s={10.5} c={C.text}>
        this stack
      </T>
      <Verdict x={246} y={276} ok={false} r={7.5} />
      <T x={260} y={280} s={10.5} c={C.ruby}>
        jams or bulges: thinner
      </T>
      <T x={260} y={293} s={10.5} c={C.ruby}>
        lining or more skive, re-test
      </T>
      <T x={16} y={322} s={10.5} c={C.faint}>
        Makers insist on the sample: the only reliable test that the fold fits this case.
      </T>
    </Fig>
  )
}

/* Measure the old strap at the hole in use */
function T1Wrist() {
  const TL = { x: 50, y: 92, s: 2.4 }
  const TS = { x: 50, y: 222, s: 2.4 }
  const xs = holeXs(124).filter((x) => x !== 85)
  const [wx, wy] = px(TL, 85.6, 0)
  const longPiece = (
    <g>
      <StrapPlan T={TL} o={LONG({ x1: 124 })} holes={{ xs }} stitch={{ m: 3, p: 3, from: 5 }} />
      <line x1={wx} y1={wy - 22} x2={wx} y2={wy + 22} stroke="#5c3c1d" strokeWidth="1.6" opacity="0.7" />
      <ellipse cx={wx} cy={wy} rx={4.2} ry={2.3} fill={C.hole} stroke="#e7c48f" strokeWidth="0.7" />
    </g>
  )
  return (
    <Fig h={330} view="Plan · the wearer’s old strap" scale="×2.4">
      <Tag x={16} y={40}>
        Long piece
      </Tag>
      {longPiece}
      <SpringBar x={50} y1={64} y2={120} r={2.4} />
      <HDim x1={50} x2={px(TL, 124, 0)[0]} y={56} text="end to end: stretched" c={C.ruby} />
      <Verdict x={px(TL, 124, 0)[0] + 16} y={54} ok={false} r={7} />
      <HDim x1={50} x2={wx} y={134} text="bar → hole in use" below c={C.emerald} ext={TL.y} />
      <Verdict x={wx + 16} y={134} ok r={7} />
      <Magnifier cx={420} cy={112} r={34} fx={wx} fy={wy} k={3}>
        {longPiece}
      </Magnifier>
      <T x={420} y={160} a="middle" s={10.5} c={C.text}>
        the hole in use:
      </T>
      <T x={420} y={173} a="middle" s={10.5}>
        stretched, creased
      </T>

      <Tag x={16} y={178}>
        Short piece
      </Tag>
      <StrapPlan T={TS} o={SHORT()} stitch={{ m: 3, p: 3, from: 5, to: 66 }} keepers={[{ x: 70 }]} />
      <SpringBar x={50} y1={194} y2={250} r={2.4} />
      <Buckle x={50 + 80 * 2.4} y={TS.y} w={43} L={36} />
      <HDim x1={50} x2={50 + 80 * 2.4} y={268} text="bar → buckle fold" below c={C.emerald} ext={TS.y} />
      <Verdict x={50 + 80 * 2.4 + 16} y={268} ok r={7} />

      <Wrist cx={410} cy={258} rx={44} ry={28} />
      <ellipse cx={410} cy={258} rx={48} ry={32} fill="none" stroke={C.brassHi} strokeWidth="2.6" strokeDasharray="1.5 3" />
      <T x={410} y={306} a="middle" s={10.5} c={C.text}>
        or the wrist itself
      </T>
      <T x={410} y={320} a="middle" s={10} c={C.faint}>
        tape snug, at the wrist bone
      </T>
    </Fig>
  )
}

/* Finished lengths by lug width and by wrist */
function T1Lengths() {
  const TL = { x: 40, y: 72, s: 1.25 }
  const TS = { x: 262, y: 72, s: 1.25 }
  const lug = [
    ['16 mm', 105, 65],
    ['18 mm', 115, 75],
    ['20 mm', 120, 80],
    ['22 mm', 130, 90],
  ]
  const X = (c) => 338 + (c - 14) * 17.5
  const wrist = [
    ['105 / 65', 14.5, 17],
    ['115 / 70–75', 16.5, 19],
    ['125 / 75–80', 18.5, 21],
  ]
  return (
    <Fig h={336} view="Chart · finished lengths" scale="mm">
      <Tag x={16} y={40}>
        The datum: bar centre
      </Tag>
      <StrapPlan T={TL} o={LONG()} />
      <SpringBar x={40} y1={56} y2={88} r={2} />
      <HDim x1={40} x2={190} y={98} text="long: bar centre → tip" below ext={72} />
      <StrapPlan T={TS} o={SHORT()} />
      <SpringBar x={262} y1={56} y2={88} r={2} />
      <Buckle x={362} y={72} w={22.5} L={18} />
      <HDim x1={262} x2={362} y={98} text="short: bar centre → buckle fold" below ext={72} />

      <Sep x1={14} y1={126} x2={466} y2={126} />
      <Tag x={16} y={146}>
        By lug width
      </Tag>
      <rect x={110} y={138} width={14} height={6} fill="url(#sk-top)" />
      <T x={128} y={144} s={10}>
        long
      </T>
      <rect x={160} y={138} width={14} height={6} fill="#6f4b27" />
      <T x={178} y={144} s={10}>
        short
      </T>
      {lug.map(([w, l, sh], i) => {
        const y = 170 + i * 28
        const reg = w === '18 mm'
        return (
          <g key={w}>
            {reg && <rect x={10} y={y - 14} width={226} height={26} rx="5" fill="rgba(208,168,79,0.08)" stroke={C.brass} strokeDasharray="3 2" />}
            <T x={16} y={y + 3} s={11} mono c={C.text}>
              {w}
            </T>
            <rect x={64} y={y - 8} width={l * 0.85} height={7} rx="1.5" fill="url(#sk-top)" />
            <rect x={64} y={y + 1} width={sh * 0.85} height={7} rx="1.5" fill="#6f4b27" />
            <T x={180} y={y + 4} s={10.5} mono c={reg ? C.brass : C.dim}>
              {l} / {sh}
            </T>
          </g>
        )
      })}

      <Sep x1={244} y1={136} x2={244} y2={276} />
      <Tag x={254} y={146}>
        By wrist, cm
      </Tag>
      {[14, 15, 16, 17, 18, 19, 20, 21].map((c) => (
        <g key={c}>
          <line x1={X(c)} y1={164} x2={X(c)} y2={270} stroke={C.line} strokeWidth="0.8" strokeDasharray="2 3" />
          <T x={X(c)} y={160} a="middle" s={10} mono>
            {c}
          </T>
        </g>
      ))}
      {wrist.map(([l, a, b], i) => {
        const y = 192 + i * 30
        return (
          <g key={l}>
            <T x={254} y={y + 4} s={10.5} mono c={C.text}>
              {l}
            </T>
            <rect x={X(a)} y={y - 5} width={X(b) - X(a)} height={10} rx="3" fill="rgba(123,165,131,0.55)" stroke={C.emerald} />
            <T x={(X(a) + X(b)) / 2} y={y - 9} a="middle" s={10} c={C.emerald}>
              {a}–{b}
            </T>
          </g>
        )
      })}
      <Sep x1={14} y1={284} x2={466} y2={284} />
      <T x={16} y={304} s={11} c={C.brass} w="600">
        Course regular: 115 / 75. Cross-check one system against the other.
      </T>
      <T x={16} y={322} s={10.5} c={C.faint}>
        No industry standard exists; these are finished lengths from the datum above.
      </T>
    </Fig>
  )
}

/* Centreline and a straight taper */
function T1Taper() {
  const s = 3.2
  const TL = { x: 40, y: 84, s }
  const TS = { x: 40, y: 236, s }
  const constr = (Tr, x1) => (
    <g stroke={C.brass} strokeWidth="0.9" strokeDasharray="5 3" opacity="0.9">
      <line x1={Tr.x} y1={Tr.y - 10 * s} x2={px(Tr, x1, 0)[0]} y2={Tr.y - 10 * s} />
      <line x1={Tr.x} y1={Tr.y + 10 * s} x2={px(Tr, x1, 0)[0]} y2={Tr.y + 10 * s} />
    </g>
  )
  const longPiece = (
    <g>
      <StrapPlan T={TL} o={LONG()} centre />
      {constr(TL, 120)}
    </g>
  )
  return (
    <Fig h={336} view="Plan · centreline & taper" scale="×3.2">
      {longPiece}
      <HDim x1={40} x2={px(TL, 8, 0)[0]} y={38} text="8" ext={TL.y - 10 * s} />
      <HDim x1={px(TL, 8, 0)[0]} x2={px(TL, 100, 0)[0]} y={38} text="straight taper to just before the tip" ext={TL.y - 10 * s} />
      <VDim x={28} y1={TL.y - 10 * s} y2={TL.y + 10 * s} side="l" text="20" />
      <Lead p={[px(TL, 100, 0)[0], TL.y + 9 * s]} t={[372, 140]} text="18 here" a="end" s={10.5} />
      <Lead p={[px(TL, 60, 0)[0], TL.y]} t={[230, 140]} text="centreline first" a="middle" s={10.5} c={C.steel} />
      <Magnifier cx={420} cy={176} r={34} fx={px(TL, 100, 0)[0]} fy={TL.y - 9.5 * s} k={4}>
        {longPiece}
      </Magnifier>
      <T x={420} y={224} a="middle" s={10.5} c={C.text}>
        1 mm each side
      </T>

      <StrapPlan T={TS} o={SHORT()} centre />
      {constr(TS, 80)}
      <HDim x1={40} x2={px(TS, 8, 0)[0]} y={190} text="8" ext={TS.y - 10 * s} />
      <HDim x1={px(TS, 8, 0)[0]} x2={px(TS, 80, 0)[0]} y={190} text="straight to the buckle fold" ext={TS.y - 10 * s} />
      <VDim x={28} y1={TS.y - 10 * s} y2={TS.y + 10 * s} side="l" text="20" />
      <VDim x={306} y1={TS.y - 9 * s} y2={TS.y + 9 * s} text="18" from={px(TS, 80, 0)[0]} />
      <T x={px(TS, 80, 0)[0]} y={TS.y + 10 * s + 16} a="middle" s={10} c={C.faint}>
        buckle fold
      </T>
      <T x={40} y={TS.y + 10 * s + 16} a="middle" s={10} c={C.faint}>
        lug fold
      </T>
      <Note x={344} y={242} head="Taper" hc={C.text} lines={['most: 2 mm', '20 → 18 · 22 → 20', 'dress: 4 mm, 20 → 16']} s={10.5} lh={14} />
      <StrapPlan T={{ x: 344, y: 305, s: 0.9 }} o={SHORT()} />
      <T x={424} y={309} s={10.5} c={C.text}>
        2 mm
      </T>
      <StrapPlan T={{ x: 344, y: 326, s: 0.9 }} o={SHORT({ w1: 16 })} />
      <T x={424} y={330} s={10.5} c={C.text}>
        4 mm
      </T>
    </Fig>
  )
}

/* Fold allowances on the unfolded pattern */
function T1Allow() {
  const Tr = { x: 80, y: 96, s: 3 }
  const X = (v) => px(Tr, v, 0)[0]
  const cx = 104
  const cy = 262
  const r = 10.8
  const t = 12
  const cv = 30
  const ts = 6
  return (
    <Fig h={336} view="Plan · unfolded short piece" scale="×3 · section ×12">
      <StrapPlan
        T={Tr}
        o={SHORT({ x0: -20, x1: 105 })}
        face="flesh"
        zones={[
          { from: -20, to: 0, k: 'hl' },
          { from: 80, to: 105, k: 'hl' },
        ]}
        folds={[{ x: 0 }, { x: 80 }]}
      />
      <T x={X(0) + 4} y={Tr.y + 48} s={10} c={C.dim}>
        lug fold
      </T>
      <T x={X(80) - 4} y={Tr.y + 48} a="end" s={10} c={C.dim}>
        buckle fold
      </T>
      {[-5.5, 85.5].map((v) => (
        <line key={v} x1={X(v)} y1={Tr.y - 30} x2={X(v)} y2={Tr.y + 30} stroke={LIGHT} strokeWidth="0.8" strokeDasharray="2 3" opacity="0.8" />
      ))}
      <HDim x1={X(-20)} x2={X(0)} y={44} text="20" ext={Tr.y - 30} />
      <HDim x1={X(0)} x2={X(80)} y={44} text="80 finished, fold to fold" ext={Tr.y - 30} />
      <HDim x1={X(80)} x2={X(105)} y={44} text="≥ 25" ext={Tr.y - 30} />
      <T x={X(-12.7)} y={Tr.y + 4} a="middle" s={10} c={C.paint}>
        tail
      </T>
      <T x={X(95)} y={Tr.y + 4} a="middle" s={10} c={C.paint}>
        tail
      </T>
      <HDim x1={X(-5.5)} x2={X(0)} y={Tr.y + 60} c={C.brass} ext={Tr.y + 30} />
      <T x={X(-7.5)} y={Tr.y + 64} a="end" s={10.5} c={C.brass}>
        wrap 5–6
      </T>
      <HDim x1={X(80)} x2={X(85.5)} y={Tr.y + 60} c={C.brass} ext={Tr.y + 30} />
      <T x={X(86)} y={Tr.y + 64} a="start" s={10.5} c={C.brass}>
        wrap
      </T>
      <T x={200} y={Tr.y + 72} a="middle" s={10.5}>
        each flap = wrap + tail
      </T>

      <Sep x1={14} y1={184} x2={466} y2={184} />
      <Tag x={16} y={204}>
        Lug end, folded
      </Tag>
      <Ply x1={cx} x2={420} y={cy - r - t} t={t} open="l" />
      <Wrap cx={cx} cy={cy} r={r} t={t} xR={cx} conv={cv} tail={138} ts={ts} />
      <BarEnd cx={cx} cy={cy} r={r * 0.92} />
      <circle cx={cx} cy={cy} r={r + t / 2} fill="none" stroke={C.steel} strokeWidth="0.9" strokeDasharray="2 2" opacity="0.8" />
      <path d={`M${cx} ${cy - r - t / 2} A${r + t / 2} ${r + t / 2} 0 0 0 ${cx} ${cy + r + t / 2}`} fill="none" stroke={C.steel} strokeWidth="3" />
      <path d={`M${cx} ${cy + r + t / 2} C${cx + cv * 0.55} ${cy + r + t / 2} ${cx + cv * 0.62} ${cy - r + ts / 2 + 1} ${cx + cv} ${cy - r + ts / 2}`} fill="none" stroke={C.brassHi} strokeWidth="3" strokeDasharray="5 2" />
      <Brk x={420} y1={cy - r - t} y2={cy - r} />
      <Lead p={[cx - r - t / 2, cy + 6]} t={[24, 304]} text="π × (1.8 + 1.0) ÷ 2 ≈ 4.4 mm" a="start" sub="half circle at mid-thickness" c={C.steel} />
      <Lead p={[cx + cv * 0.5, cy + r - 2]} t={[250, 304]} text="allow 5–6 mm" a="start" c={C.brassHi} sub="a real fold is a teardrop, not a circle" subc={C.dim} />
      <Lead p={[200, cy - r + 2]} t={[230, 214]} text="tail returns under the top" a="start" s={10.5} sub="skived thin" />
      <Lead p={[cx - 3, cy - 3]} t={[40, 222]} text="bar Ø 1.8 · leather 1.0" a="start" s={10.5} />
    </Fig>
  )
}

/* Tip shapes on the same 18 mm end */
function TipV({ cx, base, s, x0, tip, tipLen, w = 18, face = 'grain', ...rest }) {
  const o = { x0, x1: 120, w0: w, w1: w, taper: [0, 120], tip, tipLen }
  return (
    <g transform={`translate(${cx} ${base}) rotate(-90)`}>
      <StrapPlan T={{ x: -x0 * s, y: 0, s }} o={o} face={face} {...rest} />
    </g>
  )
}

function T1Tips() {
  const s = 3.6
  const base = 196
  const tips = [
    ['ogive', 14, 'Ogive', 'pointed arch, classic'],
    ['round', 9, 'Round', ''],
    ['trapezoid', 10, 'Trapezoid', 'the “pilot” tip'],
    ['ellipse', 16, 'Ellipse', ''],
    ['square', 0, 'Square', ''],
  ]
  // half template, in local piece coords
  const oH = { x0: 96, x1: 120, w0: 18, w1: 18, taper: [0, 120], tip: 'ogive', tipLen: 14 }
  const lower = outline(oH).filter(([, y]) => y > 1e-6)
  const half = [[120, 0], ...lower, [96, 0]]
  const mirror = half.map(([x, y]) => [x, -y])
  const sH = 2.2
  const TH = { x: -96 * sH, y: 0, s: sH }
  // end punch outline, a whisker past the edges
  const oP = { x0: 104, x1: 120.4, w0: 18.6, w1: 18.6, taper: [0, 120], tip: 'ogive', tipLen: 14.4 }
  const punch = outline(oP).filter(([x]) => x > 104.5)
  return (
    <Fig h={340} view="Plan · tips on an 18 mm end" scale="×3.6">
      {tips.map(([tip, tl, name, sub], i) => {
        const cx = 56 + i * 92
        return (
          <g key={tip}>
            <TipV cx={cx} base={base} s={s} x0={90} tip={tip} tipLen={tl} centre />
            <path d={`M${cx - 34} ${base + 2} l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4 l4 -4`} fill="none" stroke={C.dim} strokeWidth="0.8" />
            <T x={cx} y={base + 26} a="middle" s={11.5} c={C.text} w="600">
              {name}
            </T>
            {sub && (
              <T x={cx} y={base + 40} a="middle" s={10} c={C.faint}>
                {sub}
              </T>
            )}
          </g>
        )
      })}
      <HDim x1={56 - 9 * s} x2={56 + 9 * s} y={150} c={LIGHT} />
      <T x={70} y={146} s={10.5} mono c={LIGHT}>
        18
      </T>
      <T x={240} y={44} a="middle" s={10.5} c={C.steel}>
        every tip symmetric on the centreline
      </T>

      <Sep x1={14} y1={250} x2={466} y2={250} />
      <Tag x={16} y={268}>
        Half, fold, trace
      </Tag>
      <g transform={`translate(${64} ${334}) rotate(-90)`}>
        <path d={pathOf(half, TH)} fill="rgba(226,214,190,0.18)" stroke={C.text} strokeWidth="1.2" />
        <path d={pathOf(mirror, TH)} fill="none" stroke={C.text} strokeWidth="1" strokeDasharray="3 3" />
        <line x1={0} y1={0} x2={(120 - 96) * sH + 4} y2={0} stroke={C.steel} strokeWidth="1" strokeDasharray="6 3 2 3" />
      </g>
      <Arrow d="M84 300 q-20 -10 -40 0" c="brass" w={1.4} />
      <T x={104} y={290} s={10.5} c={C.text}>
        cut half in card,
      </T>
      <T x={104} y={304} s={10.5}>
        fold on the centreline,
      </T>
      <T x={104} y={318} s={10.5}>
        trace the other half
      </T>

      <Sep x1={238} y1={258} x2={238} y2={334} />
      <Tag x={250} y={268}>
        End punch, one strike
      </Tag>
      <TipV cx={288} base={334} s={sH} x0={96} tip="ogive" tipLen={14} centre />
      <g transform={`translate(${288} ${334}) rotate(-90)`}>
        <path d={pathOf(punch, { x: -96 * sH, y: 0, s: sH }, false)} fill="none" stroke="url(#sk-steelH)" strokeWidth="3.2" />
      </g>
      <line x1={282} y1={334 - 24 * sH - 4} x2={294} y2={334 - 24 * sH - 4} stroke={C.ruby} strokeWidth="1.4" />
      <T x={324} y={290} s={10.5} c={C.text}>
        apex on the mark,
      </T>
      <T x={324} y={304} s={10.5}>
        punch upright, corners
      </T>
      <T x={324} y={318} s={10.5}>
        on or just past the edges
      </T>
    </Fig>
  )
}

/* Stitch stops and holes */
function T1Holes() {
  const Tr = { x: 36, y: 112, s: 3.4 }
  const X = (v) => px(Tr, v, 0)[0]
  const top = Tr.y - 10 * Tr.s
  const mini1 = { x: 24 - 30 * 2.1, y: 266, s: 2.1 }
  const mini2 = { x: 252 - 60 * 2.6, y: 266, s: 2.6 }
  return (
    <Fig h={336} view="Plan · long piece, holes & stitch stops" scale="×3.4">
      <StrapPlan T={Tr} o={LONG()} centre holes={{}} stitch={{ mode: 'line', m: 3, from: 5 }} folds={[{ x: 0, label: 'lug fold' }]} />
      <circle cx={X(74)} cy={Tr.y} r={0.9 * Tr.s + 4} fill="none" stroke={C.emerald} strokeWidth="1.5" />
      {[-1, 1].map((sg) => (
        <line key={sg} x1={X(5)} y1={Tr.y + sg * 5.5 * Tr.s} x2={X(5)} y2={Tr.y + sg * 8.5 * Tr.s} stroke={C.ruby} strokeWidth="1.8" />
      ))}
      <HDim x1={X(53)} x2={X(95)} y={52} text="7 holes at 7 mm centres" ext={top} />
      <HDim x1={X(88)} x2={X(95)} y={72} text="7" ext={top} />
      <HDim x1={X(95)} x2={X(120)} y={72} text="25 to the tip" ext={top} />
      <Lead p={[X(5), Tr.y + 7 * Tr.s]} t={[70, 166]} text="stitch stop, a few mm behind the fold" a="start" s={10.5} c={C.ruby} />
      <HDim x1={X(0)} x2={X(74)} y={190} text="bar centre → middle hole = the wearer’s size" below c={C.emerald} ext={Tr.y} />

      <Sep x1={14} y1={216} x2={466} y2={216} />
      <Tag x={16} y={234}>
        Large men’s wrist: 9–10
      </Tag>
      <StrapPlan T={mini1} o={LONG({ x0: 30 })} holes={{ n: 9 }} />
      <Brk x={24} y1={266 - 21} y2={266 + 21} />
      <T x={16} y={308} s={10.5}>
        same 6–7 mm centres, more holes
      </T>
      <Sep x1={238} y1={224} x2={238} y2={326} />
      <Tag x={250} y={234}>
        Tapered (pointed) tip
      </Tag>
      <StrapPlan T={mini2} o={LONG({ x0: 60, tip: 'point', tipLen: 22 })} holes={{ n: 4, fromTip: 20 }} />
      <Brk x={252} y1={266 - 25} y2={266 + 25} />
      <HDim x1={px(mini2, 100, 0)[0]} x2={px(mini2, 120, 0)[0]} y={300} text="20" below ext={266} />
      <T x={250} y={328} s={10.5}>
        last hole 20 mm from the tip
      </T>
      <T x={16} y={328} s={10} c={C.faint}>
        all holes on the centreline
      </T>
    </Fig>
  )
}

/* Slot and fixed keeper on the short piece */
function T1Slot() {
  const Tr = { x: 40 - 44 * 4, y: 100, s: 4 }
  const X = (v) => px(Tr, v, 0)[0]
  return (
    <Fig h={336} view="Plan · short piece, buckle end" scale="×4 · section ×3.2">
      <StrapPlan
        T={Tr}
        o={SHORT({ x0: 44, x1: 105 })}
        face="flesh"
        slot={{ x: 80, len: 10, w: 2.5 }}
        folds={[
          { x: 80, label: 'buckle fold', below: true },
          { x: 70, c: C.brass },
        ]}
      />
      <Brk x={40} y1={Tr.y - 40} y2={Tr.y + 40} />
      <T x={X(70) - 4} y={Tr.y - 48} a="end" s={10.5} c={C.brass}>
        fixed-keeper line
      </T>
      <HDim x1={X(75)} x2={X(85)} y={Tr.y - 12} text="10" c="#4a3018" />
      <VDim x={X(85) + 8} y1={Tr.y - 5} y2={Tr.y + 5} text="2–3" c="#4a3018" />
      <HDim x1={X(80)} x2={X(105)} y={46} text="≥ 25 flap" ext={Tr.y - 36} />
      <HDim x1={X(70)} x2={X(80)} y={170} text="10" below ext={Tr.y + 36} />
      <Note x={300} y={40} head="Slot" hc={C.text} lines={['≈ 10 mm long, centred', 'on the fold: 5 each side', 'width = the tongue', '(2–3 mm oblong punch)']} s={10.5} lh={14} />
      <Note x={300} y={124} head="Fixed keeper" hc={C.text} lines={['line ≈ 10 mm behind', 'the buckle fold']} s={10.5} lh={14} />

      <Sep x1={14} y1={196} x2={466} y2={196} />
      <Tag x={16} y={214}>
        After folding
      </Tag>
      <StrapSection x1={90} x2={330} y={262} s={3.2} k={9} left={{ kind: 'break' }} right={{ kind: 'buckle' }} keeper={{ at: 10 }} />
      <Lead p={[344, 260]} t={[420, 222]} text="tongue exits through the slot" a="end" s={10.5} />
      <Lead p={[298, 230]} t={[240, 222]} text="fixed keeper" a="end" s={10.5} />
      <HDim x1={298} x2={330} y={312} text="10" below ext={276} />
      <T x={348} y={322} s={10} c={C.faint}>
        fold
      </T>
    </Fig>
  )
}

/* Colours: leather, thread, lining */
function T1Colours() {
  const dial = '#6b4a2e'
  const leather = 'url(#sk-dark)'
  const accent = '#9c3b45'
  const cx = 116
  const cy = 176
  const markers = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2
    const r1 = 38
    const r2 = i % 3 === 0 ? 30 : 33
    return <line key={i} x1={cx + Math.sin(a) * r1} y1={cy - Math.cos(a) * r1} x2={cx + Math.sin(a) * r2} y2={cy - Math.cos(a) * r2} stroke="#efe6d0" strokeWidth={i % 3 === 0 ? 3 : 1.6} strokeLinecap="round" />
  })
  const strapV = (y1, y2, tip) => (
    <g>
      <rect x={cx - 23} y={y1} width={46} height={y2 - y1} rx={tip ? 0 : 0} fill={leather} stroke="#2e1e10" />
      {[-1, 1].map((sg) => (
        <line key={sg} x1={cx + sg * 16} y1={y1 + 4} x2={cx + sg * 16} y2={y2 - 4} stroke="#efe6d0" strokeWidth="1.5" strokeDasharray="3 2.4" />
      ))}
    </g>
  )
  const row = (y, title, lines, art) => (
    <g key={title}>
      {art}
      <T x={306} y={y} s={11.5} c={C.text} w="600">
        {title}
      </T>
      {lines.map((l, i) => (
        <T key={l} x={306} y={y + 14 + i * 13} s={10.5}>
          {l}
        </T>
      ))}
    </g>
  )
  return (
    <Fig h={340} view="Design · colour" scale="schematic">
      {strapV(28, 112)}
      {strapV(240, 300)}
      {/* bottom piece: tip turned back to show the lining */}
      <path d={`M${cx - 23} 300 L${cx + 23} 300 L${cx + 23} 312 Q${cx} 334 ${cx - 23} 312 Z`} fill={accent} stroke="#4a1a20" />

      <path d={`M${cx - 70} ${cy - 40} L${cx - 54} ${cy - 66} L${cx + 54} ${cy - 66} L${cx + 70} ${cy - 40} Z M${cx - 70} ${cy + 40} L${cx - 54} ${cy + 66} L${cx + 54} ${cy + 66} L${cx + 70} ${cy + 40} Z`} fill="url(#sk-steel)" stroke="#3b4850" />
      <circle cx={cx} cy={cy} r={58} fill="url(#sk-steel)" stroke="#3b4850" />
      <circle cx={cx} cy={cy} r={46} fill={dial} stroke="#2b1c10" />
      {markers}
      <line x1={cx} y1={cy} x2={cx + 18} y2={cy - 22} stroke="#efe6d0" strokeWidth="3.4" strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={cx - 30} y2={cy - 18} stroke="#efe6d0" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={3} fill="#efe6d0" />
      <Lead p={[cx - 10, 70]} t={[40, 52]} text="leather" a="end" s={10.5} sub="= dial" />
      <Lead p={[cx + 16, 90]} t={[206, 70]} text="thread" a="start" s={10.5} sub="= hands, markers" />
      <Lead p={[cx - 14, 318]} t={[66, 300]} text="accent" a="end" s={10.5} sub="lining only" />

      <Sep x1={240} y1={30} x2={240} y2={330} />
      {row(
        52,
        'Leather to the dial',
        ['the strap reads as part', 'of the watch'],
        <g>
          <circle cx={262} cy={56} r={11} fill={dial} stroke="#2b1c10" />
          <rect x={278} y={46} width={20} height={22} rx="2" fill={leather} stroke="#2e1e10" />
        </g>
      )}
      {row(
        112,
        'Thread to hands / markers',
        ['picks up the dial detail'],
        <g>
          <line x1={252} y1={122} x2={270} y2={102} stroke="#efe6d0" strokeWidth="3" strokeLinecap="round" />
          <rect x={278} y={104} width={20} height={22} rx="2" fill={leather} stroke="#2e1e10" />
          <line x1={288} y1={106} x2={288} y2={124} stroke="#efe6d0" strokeWidth="1.5" strokeDasharray="3 2.4" />
        </g>
      )}
      {row(
        160,
        'Tonal thread',
        ['when dial and markers', 'already contrast strongly'],
        <g>
          <circle cx={262} cy={170} r={11} fill="#1c1c1e" stroke="#000" />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={262 + Math.sin(i * 1.5708) * 9} y1={170 - Math.cos(i * 1.5708) * 9} x2={262 + Math.sin(i * 1.5708) * 5} y2={170 - Math.cos(i * 1.5708) * 5} stroke="#fff" strokeWidth="2" />
          ))}
          <rect x={278} y={159} width={20} height={22} rx="2" fill="#26221f" stroke="#000" />
          <line x1={288} y1={161} x2={288} y2={179} stroke="#4a443e" strokeWidth="1.5" strokeDasharray="3 2.4" />
        </g>
      )}
      {row(
        220,
        'Accent in the lining',
        ['for a quiet strap: the', 'colour shows only inside'],
        <g>
          <rect x={252} y={214} width={46} height={9} fill={leather} stroke="#2e1e10" />
          <rect x={252} y={223} width={46} height={6} fill={accent} stroke="#4a1a20" />
        </g>
      )}
      {row(
        280,
        'Gloss formal · matte casual',
        ['the finish sets the tone'],
        <g>
          <rect x={252} y={272} width={20} height={24} rx="2" fill={leather} stroke="#2e1e10" />
          <path d="M255 292 L269 276" stroke="#ffffff" strokeWidth="2.2" opacity="0.55" strokeLinecap="round" />
          <rect x={282} y={272} width={20} height={24} rx="2" fill="#5a4a3c" stroke="#2e1e10" />
          <T x={260} y={312} a="middle" s={10} c={C.faint}>
            gloss
          </T>
          <T x={294} y={312} a="middle" s={10} c={C.faint}>
            matte
          </T>
        </g>
      )}
    </Fig>
  )
}

/* The finished templates */
function T1Template() {
  const TL = { x: 66, y: 80, s: 2.5 }
  const TS = { x: 66, y: 186, s: 2.5 }
  const XL = (v) => px(TL, v, 0)[0]
  const XS = (v) => px(TS, v, 0)[0]
  const prick = (x, y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={1.8} fill="none" stroke={C.brassHi} strokeWidth="1" />
  const legend = [
    ['fold line', (x, y) => <line x1={x} y1={y} x2={x + 18} y2={y} stroke={C.text} strokeDasharray="4 3" />],
    ['centreline', (x, y) => <line x1={x} y1={y} x2={x + 18} y2={y} stroke={C.steel} strokeDasharray="6 2 2 2" />],
    ['stitch line', (x, y) => <line x1={x} y1={y} x2={x + 18} y2={y} stroke={C.text} strokeDasharray="1.5 2.5" />],
    ['holes', (x, y) => <circle cx={x + 9} cy={y} r={2.4} fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />],
    ['slot', (x, y) => <rect x={x + 2} y={y - 3} width={14} height={6} rx="3" fill={C.hole} stroke="#e7c48f" strokeWidth="0.6" />],
    ['keeper line', (x, y) => <line x1={x} y1={y} x2={x + 18} y2={y} stroke={C.brass} strokeDasharray="4 3" />],
    ['filler (padded)', (x, y) => <rect x={x} y={y - 4} width={18} height={8} fill="rgba(109,80,53,0.35)" stroke="#d9b07a" strokeDasharray="4 3" />],
    ['pricked mark', (x, y) => prick(x + 9, y)],
  ]
  return (
    <Fig h={340} view="Plan · finished templates" scale="×2.5">
      <Tag x={16} y={40}>
        Card, Texon or acrylic
      </Tag>
      <StrapPlan
        T={TL}
        o={LONG({ x0: -20 })}
        face="card"
        centre
        folds={[{ x: 0 }]}
        holes={{}}
        stitch={{ mode: 'line', m: 3, from: 5 }}
        filler={{ inset: 4, from: 8, to: 48 }}
      />
      {[-1, 1].map((sg) => prick(XL(0), TL.y + sg * 12.5 * TL.s))}
      <HDim x1={XL(48)} x2={XL(53)} y={TL.y + 34} text="5" below />
      <VDim x={XL(30)} y1={TL.y - 10 * TL.s} y2={TL.y - 6 * TL.s} text="3–5" c={C.text} />
      <T x={XL(-10)} y={TL.y + 4} a="middle" s={10} c={C.faint}>
        flap
      </T>

      <StrapPlan
        T={TS}
        o={SHORT({ x0: -20, x1: 105 })}
        face="card"
        centre
        folds={[{ x: 0 }, { x: 80 }, { x: 70, c: C.brass }]}
        slot={{ x: 80 }}
        stitch={{ mode: 'line', m: 3, from: 5, to: 66 }}
        filler={{ inset: 4, from: 8, to: 70 }}
      />
      {[0, 80].map((v) => [-1, 1].map((sg) => prick(XS(v), TS.y + sg * 12.5 * TS.s)))}
      <T x={XS(-10)} y={TS.y + 4} a="middle" s={10} c={C.faint}>
        flap
      </T>
      <T x={XS(92)} y={TS.y + 4} a="middle" s={10} c={C.faint}>
        flap
      </T>
      <Lead p={[XS(60), TS.y - 4 * TS.s]} t={[200, 140]} text="filler stops at the keeper seam" a="start" s={10.5} />
      <Lead p={[XL(46), TL.y + 3 * TL.s]} t={[150, 128]} text="5 mm before the first hole" a="end" s={10.5} />

      <Tag x={378} y={40}>
        Marks
      </Tag>
      {legend.map(([l, sym], i) => {
        const y = 60 + i * 19
        return (
          <g key={l}>
            {sym(378, y)}
            <T x={402} y={y + 4} s={10.5}>
              {l}
            </T>
          </g>
        )
      })}

      <Sep x1={14} y1={232} x2={466} y2={232} />
      <rect x={16} y={242} width={228} height={90} rx="4" fill="rgba(226,214,190,0.08)" stroke={C.line} />
      <Tag x={26} y={258}>
        Log · strap no. 1
      </Tag>
      {['lug 20.0 · buckle 18 · tongue 2.0', 'lengths 120 / 80 · taper 20 → 18', 'stack 1.1 + 0.2 + 0.6 · pitch 3.0', 'thread 0.5 · needle JJ 004'].map((l, i) => (
        <T key={l} x={26} y={276 + i * 14} s={10} mono c={C.dim}>
          {l}
        </T>
      ))}
      <rect x={262} y={244} width={60} height={80} rx="2" fill="#e9e3d6" stroke="#9c927e" />
      <path d="M274 256 h36 M274 264 h30 M274 272 h34" stroke="#9c927e" strokeWidth="1" />
      <rect x={272} y={286} width={40} height={14} fill="none" stroke="#5a4630" strokeWidth="1" />
      <T x={292} y={318} a="middle" s={10} mono c="#5a4630">
        100%
      </T>
      <T x={334} y={262} s={10.5} c={C.text}>
        printed pattern?
      </T>
      <T x={334} y={276} s={10.5}>
        print at 100% and
      </T>
      <T x={334} y={290} s={10.5}>
        check one dimension
      </T>
      <T x={334} y={304} s={10.5}>
        with calipers first
      </T>
      <T x={334} y={326} s={10} c={C.faint}>
        then log the numbers
      </T>
    </Fig>
  )
}

export const FIGS = {
  'hide-map': HideMap,
  'stack-standard': StackStandard,
  'leathers': Leathers,
  'lining-edge': LiningEdge,
  'reinforce': Reinforce,
  'fillers': Fillers,
  'thread-gauge': ThreadGauge,
  'glue-times': GlueTimes,
  'finish-chem': FinishChem,
  'tool-cut': ToolCut,
  'tool-skive': ToolSkive,
  'tool-measure': ToolMeasure,
  'tool-irons': ToolIrons,
  'tool-needles': ToolNeedles,
  'tool-edge': ToolEdge,
  'tool-punch': ToolPunch,
  'tool-fold': ToolFold,
  'tool-hold': ToolHold,
  'tool-matched': ToolMatched,
  'tool-safety': ToolSafety,
  't1-lug': T1Lug,
  't1-buckle': T1Buckle,
  't1-sample': T1Sample,
  't1-wrist': T1Wrist,
  't1-lengths': T1Lengths,
  't1-taper': T1Taper,
  't1-allow': T1Allow,
  't1-tips': T1Tips,
  't1-holes': T1Holes,
  't1-slot': T1Slot,
  't1-colours': T1Colours,
  't1-template': T1Template,
}
