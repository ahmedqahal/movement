// Small schematic illustrations shown inside lesson steps.
// Reference them by key from lessons.js (`figure: 'springbar'`).
import { Gear } from './diagrams/primitives'
import { PLATES } from './plates/index.jsx'
import LessonIllustration from './LessonIllustration.jsx'

const C = {
  brass: '#d0a84f',
  steel: '#86a7bd',
  ruby: '#c25863',
  emerald: '#7ba583',
  text: '#efe8dc',
  dim: '#b3a898',
  faint: '#7d7264',
  line: '#4a4034',
  struct: '#9a8f7d',
}

const Label = ({ x, y, children, anchor = 'middle', color = C.dim }) => (
  <text x={x} y={y} textAnchor={anchor} fontSize="12.5" fill={color} fontFamily="var(--font-body)">
    {children}
  </text>
)

const Frame = ({ children, vb = '0 0 440 210' }) => (
  <svg viewBox={vb} role="img">
    {children}
  </svg>
)

/* ---- spring bar & tool ---- */
function SpringBar() {
  return (
    <Frame>
      {/* lugs */}
      <path d="M60 60 L60 150 L92 150 L92 60" fill="none" stroke={C.struct} strokeWidth="10" strokeLinecap="round" />
      <path d="M380 60 L380 150 L348 150 L348 60" fill="none" stroke={C.struct} strokeWidth="10" strokeLinecap="round" />
      {/* strap */}
      <rect x="150" y="118" width="140" height="60" rx="8" fill="rgba(123,165,131,0.12)" stroke={C.emerald} strokeWidth="2" />
      <Label x={220} y={200} color={C.emerald}>strap end</Label>
      {/* spring bar */}
      <line x1="92" y1="105" x2="348" y2="105" stroke={C.text} strokeWidth="5" strokeLinecap="round" />
      <circle cx="100" cy="105" r="7" fill={C.text} />
      <circle cx="340" cy="105" r="7" fill={C.text} />
      <Label x={220} y={96} color={C.text}>spring bar</Label>
      {/* tool fork */}
      <g stroke={C.brass} strokeWidth="3" fill="none">
        <path d="M108 40 L108 96 M96 96 L120 96" />
        <path d="M108 20 L108 40" strokeWidth="6" />
      </g>
      <Label x={108} y={16} color={C.brass}>tool fork ↓</Label>
    </Frame>
  )
}

/* ---- bracelet link & pin ---- */
function BracLink() {
  return (
    <Frame>
      {[70, 150, 230, 310].map((x, i) => (
        <rect key={i} x={x} y="80" width="70" height="50" rx="6" fill="rgba(154,143,125,0.14)" stroke={C.struct} strokeWidth="2" />
      ))}
      {/* pin through middle link */}
      <line x1="150" y1="105" x2="240" y2="105" stroke={C.text} strokeWidth="4" />
      <circle cx="240" cy="105" r="6" fill={C.text} />
      {/* arrow */}
      <g stroke={C.brass} strokeWidth="2.5" fill="none">
        <path d="M190 150 L245 150" markerEnd="url(#fbArrow)" />
      </g>
      <defs>
        <marker id="fbArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={C.brass} />
        </marker>
      </defs>
      <Label x={200} y={172} color={C.brass}>push pin this way</Label>
      {/* pusher */}
      <line x1="120" y1="105" x2="150" y2="105" stroke={C.brass} strokeWidth="6" strokeLinecap="round" />
      <Label x={95} y={109} anchor="end" color={C.brass}>pusher</Label>
    </Frame>
  )
}

/* ---- three caseback types ---- */
function CasebackTypes() {
  const back = (cx, label, draw) => (
    <g>
      <circle cx={cx} cy="95" r="52" fill="rgba(154,143,125,0.08)" stroke={C.struct} strokeWidth="2" />
      {draw(cx)}
      <Label x={cx} y="180">{label}</Label>
    </g>
  )
  return (
    <Frame vb="0 0 460 200">
      {back(90, 'snap-on', (cx) => (
        <>
          <circle cx={cx} cy="95" r="40" fill="none" stroke={C.faint} strokeWidth="1.5" />
          <path d={`M${cx - 52} 95 l-10 -6 l0 12 z`} fill={C.brass} />
          <Label x={cx - 60} y="60" color={C.brass}>notch</Label>
        </>
      ))}
      {back(230, 'screw-down', (cx) => (
        <>
          {Array.from({ length: 6 }).map((_, i) => {
            const a = (i / 6) * Math.PI * 2
            const x1 = cx + 44 * Math.cos(a)
            const y1 = 95 + 44 * Math.sin(a)
            const x2 = cx + 52 * Math.cos(a)
            const y2 = 95 + 52 * Math.sin(a)
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.steel} strokeWidth="4" />
          })}
        </>
      ))}
      {back(400, 'screw-in', (cx) => (
        <>
          {Array.from({ length: 40 }).map((_, i) => {
            const a = (i / 40) * Math.PI * 2
            const x1 = cx + 48 * Math.cos(a)
            const y1 = 95 + 48 * Math.sin(a)
            const x2 = cx + 52 * Math.cos(a)
            const y2 = 95 + 52 * Math.sin(a)
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.faint} strokeWidth="1.5" />
          })}
        </>
      ))}
    </Frame>
  )
}

/* ---- battery in movement ---- */
function Battery() {
  return (
    <Frame>
      <circle cx="180" cy="105" r="88" fill="rgba(255,255,255,0.02)" stroke={C.line} strokeWidth="2" />
      {/* battery cell */}
      <circle cx="180" cy="105" r="46" fill="rgba(208,168,79,0.1)" stroke={C.brass} strokeWidth="2.5" />
      <text x="180" y="100" textAnchor="middle" fontSize="24" fontWeight="700" fill={C.brass}>+</text>
      <text x="180" y="122" textAnchor="middle" fontSize="11" fill={C.dim}>SR626SW</text>
      {/* clamp */}
      <path d="M240 55 Q280 105 240 155" fill="none" stroke={C.steel} strokeWidth="5" strokeLinecap="round" />
      <circle cx="258" cy="105" r="6" fill={C.steel} />
      <Label x={330} y={80} anchor="start" color={C.steel}>retaining</Label>
      <Label x={330} y={98} anchor="start" color={C.steel}>clamp</Label>
      <Label x={330} y={135} anchor="start" color={C.brass}>note the code</Label>
      <Label x={330} y={153} anchor="start" color={C.brass}>before removing</Label>
    </Frame>
  )
}

/* ---- stem & setting lever ---- */
function Stem() {
  return (
    <Frame>
      <rect x="130" y="40" width="220" height="130" rx="10" fill="rgba(255,255,255,0.02)" stroke={C.line} strokeWidth="2" />
      {/* crown */}
      <g>
        <rect x="30" y="88" width="34" height="34" rx="6" fill="#2a241e" stroke={C.emerald} strokeWidth="2" />
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={i} x1={35 + i * 5} y1="88" x2={35 + i * 5} y2="122" stroke={C.emerald} strokeWidth="1.2" />
        ))}
      </g>
      {/* stem */}
      <line x1="64" y1="105" x2="230" y2="105" stroke={C.emerald} strokeWidth="6" strokeLinecap="round" />
      <Label x={120} y={96} color={C.emerald}>stem</Label>
      {/* setting lever detent */}
      <circle cx="250" cy="105" r="12" fill="#2a241e" stroke={C.brass} strokeWidth="2" />
      <circle cx="250" cy="105" r="3.5" fill={C.brass} />
      <Label x={250} y={150} color={C.brass}>press / unscrew</Label>
      <Label x={250} y={167} color={C.brass}>the setting lever</Label>
    </Frame>
  )
}

/* ---- let down mainspring ---- */
function LetDown() {
  return (
    <Frame>
      {/* ratchet wheel */}
      <g transform="translate(150,105)">
        <Gear cx={0} cy={0} r={70} teeth={24} color={C.brass} spokes={0} fill="rgba(208,168,79,0.07)" />
        <circle cx="0" cy="0" r="10" fill="#1b1714" stroke={C.brass} strokeWidth="2" />
      </g>
      <Label x={150} y={200} color={C.brass}>ratchet wheel</Label>
      {/* click */}
      <path d="M240 70 L285 95 L278 110 L233 92 Z" fill="#2a241e" stroke={C.ruby} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="285" cy="95" r="6" fill="#1b1714" stroke={C.ruby} strokeWidth="2" />
      <Label x={330} y={80} anchor="start" color={C.ruby}>the click</Label>
      <Label x={330} y={110} anchor="start" color={C.dim}>lift it slowly</Label>
      <Label x={330} y={128} anchor="start" color={C.dim}>while holding</Label>
      <Label x={330} y={146} anchor="start" color={C.dim}>the crown</Label>
    </Frame>
  )
}

/* ---- hand removal ---- */
function HandRemove() {
  return (
    <Frame>
      {/* dial */}
      <circle cx="200" cy="105" r="86" fill="rgba(255,255,255,0.03)" stroke={C.line} strokeWidth="2" />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2
        const x1 = 200 + 74 * Math.cos(a)
        const y1 = 105 + 74 * Math.sin(a)
        const x2 = 200 + 82 * Math.cos(a)
        const y2 = 105 + 82 * Math.sin(a)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.faint} strokeWidth="2" />
      })}
      {/* hands pointing up */}
      <line x1="200" y1="105" x2="200" y2="55" stroke={C.text} strokeWidth="4" strokeLinecap="round" />
      <line x1="200" y1="105" x2="200" y2="40" stroke={C.text} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="200" cy="105" r="5" fill={C.text} />
      {/* levers */}
      <g stroke={C.brass} strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M150 95 L188 100" />
        <path d="M250 95 L212 100" />
      </g>
      <Label x={200} y={30} color={C.text}>hands ↑ (12:00)</Label>
      <Label x={110} y={95} anchor="end" color={C.brass}>levers</Label>
      {/* protector */}
      <rect x="150" y="108" width="100" height="8" rx="4" fill={C.steel} opacity="0.5" />
      <Label x={330} y={140} anchor="start" color={C.steel}>dial</Label>
      <Label x={330} y={157} anchor="start" color={C.steel}>protector</Label>
    </Frame>
  )
}

/* ---- timegrapher screen ---- */
function Timegrapher() {
  return (
    <Frame vb="0 0 440 220">
      <rect x="30" y="20" width="380" height="180" rx="10" fill="#0f1512" stroke={C.line} strokeWidth="2" />
      {/* readouts */}
      <text x="60" y="60" fontSize="14" fill={C.emerald} fontFamily="var(--font-mono)">+3 s/d</text>
      <Label x={60} y={78} anchor="start" color={C.faint}>rate</Label>
      <text x="200" y="60" fontSize="14" fill={C.brass} fontFamily="var(--font-mono)">285°</text>
      <Label x={200} y={78} anchor="start" color={C.faint}>amplitude</Label>
      <text x="330" y="60" fontSize="14" fill={C.steel} fontFamily="var(--font-mono)">0.2 ms</text>
      <Label x={330} y={78} anchor="start" color={C.faint}>beat error</Label>
      {/* trace lines (two near-parallel dotted diagonals = healthy) */}
      {Array.from({ length: 26 }).map((_, i) => (
        <circle key={i} cx={60 + i * 13} cy={150 - i * 1.4} r="2" fill={C.emerald} />
      ))}
      {Array.from({ length: 26 }).map((_, i) => (
        <circle key={i} cx={60 + i * 13} cy={172 - i * 1.4} r="2" fill={C.emerald} />
      ))}
      <line x1="30" y1="100" x2="410" y2="100" stroke={C.line} strokeWidth="1" strokeDasharray="3 4" />
    </Frame>
  )
}

/* ---- exploded build stack ---- */
function Exploded() {
  const layer = (y, label, color, draw) => (
    <g>
      {draw(y)}
      <Label x={330} y={y + 5} anchor="start" color={color}>{label}</Label>
      <line x1="235" y1={y} x2="315" y2={y} stroke={C.line} strokeWidth="1" strokeDasharray="2 3" />
    </g>
  )
  return (
    <Frame vb="0 0 440 260">
      {layer(35, 'crystal', C.steel, (y) => (
        <path d={`M100 ${y + 8} Q170 ${y - 12} 240 ${y + 8}`} fill="none" stroke={C.steel} strokeWidth="3" />
      ))}
      {layer(80, 'dial + hands', C.text, (y) => (
        <>
          <ellipse cx="170" cy={y} rx="70" ry="12" fill="rgba(255,255,255,0.05)" stroke={C.faint} strokeWidth="1.5" />
          <line x1="170" y1={y} x2="170" y2={y - 9} stroke={C.text} strokeWidth="2" />
        </>
      ))}
      {layer(130, 'movement', C.brass, (y) => (
        <ellipse cx="170" cy={y} rx="60" ry="16" fill="rgba(208,168,79,0.1)" stroke={C.brass} strokeWidth="2" />
      ))}
      {layer(185, 'case', C.struct, (y) => (
        <path d={`M110 ${y - 14} L230 ${y - 14} L222 ${y + 14} L118 ${y + 14} Z`} fill="rgba(154,143,125,0.1)" stroke={C.struct} strokeWidth="2" />
      ))}
      {layer(228, 'caseback', C.struct, (y) => (
        <ellipse cx="170" cy={y} rx="58" ry="12" fill="rgba(154,143,125,0.12)" stroke={C.struct} strokeWidth="2" />
      ))}
    </Frame>
  )
}

/* ---- water / pressure test ---- */
function WaterTest() {
  return (
    <Frame>
      {/* chamber */}
      <rect x="90" y="35" width="150" height="140" rx="10" fill="rgba(134,167,189,0.06)" stroke={C.steel} strokeWidth="2" />
      {/* watch inside */}
      <circle cx="165" cy="110" r="34" fill="rgba(255,255,255,0.03)" stroke={C.text} strokeWidth="2" />
      <circle cx="165" cy="110" r="4" fill={C.text} />
      <line x1="165" y1="110" x2="165" y2="88" stroke={C.text} strokeWidth="2" />
      {/* gauge */}
      <circle cx="330" cy="85" r="42" fill="#0f1512" stroke={C.line} strokeWidth="2" />
      {Array.from({ length: 9 }).map((_, i) => {
        const a = Math.PI * (0.9 + (i / 8) * 1.2)
        const x1 = 330 + 30 * Math.cos(a)
        const y1 = 85 + 30 * Math.sin(a)
        const x2 = 330 + 38 * Math.cos(a)
        const y2 = 85 + 38 * Math.sin(a)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.faint} strokeWidth="1.5" />
      })}
      <line x1="330" y1="85" x2="352" y2="66" stroke={C.ruby} strokeWidth="2.5" />
      <circle cx="330" cy="85" r="4" fill={C.ruby} />
      <Label x={330} y={150} color={C.steel}>pressure test</Label>
    </Frame>
  )
}

/* ---- oiling a jewel ---- */
function Oiling() {
  return (
    <Frame>
      {/* mainplate slice */}
      <rect x="60" y="130" width="320" height="40" rx="6" fill="rgba(208,168,79,0.08)" stroke={C.line} strokeWidth="1.5" />
      {/* jewel setting */}
      <circle cx="180" cy="130" r="16" fill="none" stroke={C.brass} strokeWidth="2" />
      <circle cx="180" cy="130" r="10" fill={C.ruby} />
      <circle cx="180" cy="130" r="3.5" fill="#2a0d10" />
      {/* pivot */}
      <line x1="180" y1="130" x2="180" y2="92" stroke={C.text} strokeWidth="3" />
      {/* oiler with drop */}
      <line x1="230" y1="40" x2="196" y2="118" stroke={C.steel} strokeWidth="4" strokeLinecap="round" />
      <circle cx="190" cy="126" r="4" fill={C.brass} />
      <Label x={250} y={60} anchor="start" color={C.brass}>one small drop —</Label>
      <Label x={250} y={78} anchor="start" color={C.dim}>fill the oil sink,</Label>
      <Label x={250} y={96} anchor="start" color={C.dim}>never flood it</Label>
      <Label x={180} y={196} color={C.ruby}>jewel bearing</Label>
    </Frame>
  )
}

/* ---- date danger zone ---- */
function DateZone() {
  return (
    <Frame vb="0 0 440 220">
      <circle cx="130" cy="110" r="92" fill="rgba(255,255,255,0.02)" stroke={C.line} strokeWidth="2" />
      {/* danger arc 9pm-3am (approx top) */}
      <path d="M130 110 L130 18 A92 92 0 0 1 210 66 Z" fill="rgba(194,88,99,0.18)" stroke="none" />
      <path d="M130 110 L210 66 A92 92 0 0 1 210 154 Z" fill="rgba(194,88,99,0.10)" stroke="none" />
      {[12, 3, 6, 9].map((h, i) => {
        const a = (i / 4) * Math.PI * 2 - Math.PI / 2
        const x = 130 + 78 * Math.cos(a)
        const y = 110 + 78 * Math.sin(a)
        return <text key={h} x={x} y={y + 4} textAnchor="middle" fontSize="12" fill={C.dim}>{h}</text>
      })}
      <line x1="130" y1="110" x2="130" y2="40" stroke={C.text} strokeWidth="3" strokeLinecap="round" />
      <line x1="130" y1="110" x2="180" y2="110" stroke={C.text} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="130" cy="110" r="4" fill={C.brass} />
      <Label x={300} y={80} anchor="start" color={C.ruby}>Danger zone</Label>
      <Label x={300} y={100} anchor="start" color={C.dim}>~9 pm – 3 am:</Label>
      <Label x={300} y={118} anchor="start" color={C.dim}>the date is engaging.</Label>
      <Label x={300} y={140} anchor="start" color={C.dim}>Don’t quick-set here.</Label>
    </Frame>
  )
}

/* ---- demagnetiser ---- */
function Demag() {
  return (
    <Frame>
      <rect x="120" y="120" width="130" height="60" rx="8" fill="rgba(134,167,189,0.08)" stroke={C.steel} strokeWidth="2" />
      <circle cx="150" cy="150" r="6" fill={C.ruby} />
      <text x="230" y="205" textAnchor="middle" fontSize="11" fill={C.dim}>demagnetiser</text>
      {/* watch above */}
      <circle cx="185" cy="80" r="30" fill="rgba(255,255,255,0.03)" stroke={C.text} strokeWidth="2" />
      <circle cx="185" cy="80" r="3" fill={C.text} />
      {/* field waves */}
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${150 + i * 30} 118 q10 -14 0 -28`} fill="none" stroke={C.steel} strokeWidth="1.6" opacity={0.7 - i * 0.15} />
      ))}
      <Label x={320} y={70} anchor="start" color={C.steel}>pass through</Label>
      <Label x={320} y={88} anchor="start" color={C.dim}>slowly, then</Label>
      <Label x={320} y={106} anchor="start" color={C.dim}>withdraw far</Label>
      <Label x={320} y={124} anchor="start" color={C.dim}>before releasing</Label>
    </Frame>
  )
}

/* ---- cleaning basket ---- */
function Cleaning() {
  return (
    <Frame>
      {/* jar */}
      <path d="M120 60 L120 180 Q120 190 130 190 L250 190 Q260 190 260 180 L260 60" fill="rgba(134,167,189,0.06)" stroke={C.steel} strokeWidth="2" />
      <ellipse cx="190" cy="60" rx="70" ry="12" fill="none" stroke={C.steel} strokeWidth="2" />
      {/* fluid */}
      <path d="M124 100 L124 180 Q124 186 130 186 L250 186 Q256 186 256 180 L256 100 Z" fill="rgba(134,167,189,0.12)" />
      {/* basket */}
      <rect x="150" y="90" width="80" height="70" rx="6" fill="none" stroke={C.brass} strokeWidth="2" />
      {Array.from({ length: 4 }).map((_, i) => (
        <line key={i} x1={150 + i * 20 + 10} y1="90" x2={150 + i * 20 + 10} y2="160" stroke={C.brass} strokeWidth="1" opacity="0.6" />
      ))}
      {/* bubbles */}
      {[[160, 175], [200, 178], [230, 172], [180, 168]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2 + (i % 2)} fill={C.steel} opacity="0.7" />
      ))}
      <Label x={340} y={100} anchor="start" color={C.brass}>parts in a</Label>
      <Label x={340} y={118} anchor="start" color={C.brass}>mesh basket</Label>
      <Label x={340} y={140} anchor="start" color={C.dim}>ultrasonic /</Label>
      <Label x={340} y={158} anchor="start" color={C.dim}>cleaning fluid</Label>
    </Frame>
  )
}

/* ---- workbench layout ---- */
function Workbench() {
  return (
    <Frame vb="0 0 440 220">
      <rect x="30" y="150" width="380" height="14" rx="3" fill="rgba(154,143,125,0.2)" stroke={C.struct} strokeWidth="1.5" />
      {/* movement holder */}
      <circle cx="120" cy="120" r="26" fill="none" stroke={C.brass} strokeWidth="2" />
      <circle cx="120" cy="120" r="14" fill="rgba(208,168,79,0.1)" stroke={C.brass} strokeWidth="1" />
      <Label x={120} y={190} color={C.dim}>holder</Label>
      {/* tray */}
      <rect x="180" y="104" width="70" height="40" rx="6" fill="rgba(134,167,189,0.06)" stroke={C.steel} strokeWidth="1.6" />
      {[0, 1, 2].map((i) => <circle key={i} cx={196 + i * 20} cy={124} r="6" fill="none" stroke={C.steel} strokeWidth="1.2" />)}
      <Label x={215} y={190} color={C.dim}>parts tray</Label>
      {/* tools */}
      <line x1="290" y1="140" x2="330" y2="96" stroke={C.brass} strokeWidth="4" strokeLinecap="round" />
      <line x1="305" y1="142" x2="352" y2="104" stroke={C.steel} strokeWidth="4" strokeLinecap="round" />
      <Label x={330} y={190} color={C.dim}>tools</Label>
      {/* light */}
      <path d="M60 40 L60 100" stroke={C.faint} strokeWidth="3" />
      <ellipse cx="70" cy="40" rx="22" ry="8" fill="rgba(240,232,220,0.15)" stroke={C.faint} strokeWidth="1.5" />
      <Label x={70} y={26} color={C.dim}>good light</Label>
    </Frame>
  )
}

const FIGURES = {
  springbar: SpringBar,
  braclink: BracLink,
  casebackTypes: CasebackTypes,
  battery: Battery,
  stem: Stem,
  letdown: LetDown,
  handremove: HandRemove,
  timegrapher: Timegrapher,
  exploded: Exploded,
  watertest: WaterTest,
  oiling: Oiling,
  datezone: DateZone,
  demag: Demag,
  cleaning: Cleaning,
  workbench: Workbench,
}

// Illustrated replacements for the original hand-drawn step figures. Keyed by
// the same names lessons already use, so no lesson data needed changing.
const FIG_IMAGES = {
  springbar: '/illustrations/fig-springbar.webp',
  braclink: '/illustrations/fig-braclink.webp',
  casebackTypes: '/illustrations/fig-caseback-types.webp',
  battery: '/illustrations/fig-battery.webp',
  stem: '/illustrations/fig-stem.webp',
  letdown: '/illustrations/fig-letdown.webp',
  handremove: '/illustrations/fig-handremove.webp',
  timegrapher: '/illustrations/fig-timegrapher.webp',
  exploded: '/illustrations/fig-exploded.webp',
  watertest: '/illustrations/fig-watertest.webp',
  oiling: '/illustrations/fig-oiling.webp',
  datezone: '/illustrations/fig-datezone.webp',
  demag: '/illustrations/fig-demag.webp',
  cleaning: '/illustrations/fig-cleaning.webp',
  staking: '/illustrations/fig-staking.webp',
  poising: '/illustrations/fig-poising.webp',
  jacot: '/illustrations/fig-jacot.webp',
  lathe: '/illustrations/fig-lathe.webp',
  refinishing: '/illustrations/fig-refinishing.webp',
  radium: '/illustrations/fig-radium.webp',
  screwextraction: '/illustrations/fig-screw-extraction.webp',
  solarcell: '/illustrations/fig-solar-cell.webp',
  mainspringwinder: '/illustrations/fig-mainspring-winder.webp',
  partsbench: '/illustrations/fig-parts.webp',
}

export default function StepFigure({ name }) {
  // `plate:<id>` references a technical plate from components/plates
  if (name && name.startsWith('plate:')) {
    const plate = PLATES.find((p) => p.id === name.slice(6))
    if (!plate) return null
    const Plate = plate.Component
    return <Plate />
  }
  // `illus:<id>` references an illustrated (raster) plate, rendered with its
  // clickable hotspot labels and a link through to the full plate.
  if (name && name.startsWith('illus:')) {
    return <LessonIllustration id={name.slice(6)} />
  }
  // An illustrated version supersedes the original SVG figure where one exists.
  const img = FIG_IMAGES[name]
  if (img) return <img className="fig-img" src={img} alt="" loading="lazy" />
  const Cmp = FIGURES[name]
  if (!Cmp) return null
  return <Cmp />
}
