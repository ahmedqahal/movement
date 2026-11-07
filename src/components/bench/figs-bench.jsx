// Bench-method diagrams: cleaning, oiling, mainsprings, hands, accident rescue,
// tool dressing, the Swiss lever, calendar works, documents and take-in.
// Original drawings built on the strap kit. Nothing here is traced from an ETA,
// Witschi or Soprod figure, and every number matches the lesson step it serves.
import { C, Fig, T, Note, Lead, Dim, Arrow, Num, Verdict, Tag, Sep, Legend } from '../strap/kit.jsx'

/* ------------------------------------------------------------------ */
/* Palette for this file                                                */
/* ------------------------------------------------------------------ */
const LUB = { fine: '#7fc4e8', thick: '#e0894a', pal: '#c79be8', grease: '#8fd19e', brake: '#c8b26a', epi: '#ece6a6' }
const FLUID = { wash: '#d9c35c', rinse: '#a9c9d8', ipa: '#cfe3ea', water: '#6f9fb5' }
const RUBY = '#c9495e'
const RUBYHI = '#e8899a'
const STEEL = '#c3d0d8'
const STEELD = '#7e909b'
const BRASS = '#c9a24c'
const BRASSD = '#8d6f2e'
const SHELLAC = '#b9722c'
const PLATE = '#3a332b'

/* ------------------------------------------------------------------ */
/* Layout helpers                                                       */
/* ------------------------------------------------------------------ */
const rad = (d) => (d * Math.PI) / 180
// polar point, degrees anticlockwise from +x, screen coordinates
const pol = (cx, cy, r, deg) => [cx + r * Math.cos(rad(deg)), cy - r * Math.sin(rad(deg))]
const pts = (a) => a.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ')

function Panel({ x, y, w, h, title, ok, tc }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="7" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      {title && <Tag x={x + 8} y={y + 14} c={tc}>{title}</Tag>}
      {ok !== undefined && <Verdict x={x + w - 14} y={y + 14} ok={ok} r={8} />}
    </g>
  )
}

// Label with a leader that stops at the text instead of running through it.
// Text sits above t when the leader rises to it, below when it falls.
function Lab({ p, t, text, sub, c = C.text, subc = C.faint, s = 11, a = 'middle', dot = true }) {
  const up = t[1] < p[1]
  const lines = sub ? 2 : 1
  const y0 = up ? t[1] - 4 - (lines - 1) * (s + 2) : t[1] + s + 1
  return (
    <g>
      <polyline points={`${p[0]},${p[1]} ${t[0]},${t[1]}`} fill="none" stroke={C.struct} strokeWidth="0.8" opacity="0.8" />
      {dot && <circle cx={p[0]} cy={p[1]} r="2.2" fill={c} />}
      {text && <T x={t[0]} y={y0} a={a} s={s} c={c}>{text}</T>}
      {sub && <T x={t[0]} y={y0 + s + 2} a={a} s={Math.max(10, s - 1)} c={subc}>{sub}</T>}
    </g>
  )
}

// One numbered stage box in a process chart.
function Stage({ x, y, w, h = 44, n, head, sub, c = C.brass }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="6" fill="rgba(255,255,255,0.03)" stroke={c} strokeOpacity="0.55" />
      {n !== undefined && <Num x={x + 15} y={y + h / 2} n={n} c={c} r={8} />}
      <T x={x + (n !== undefined ? 30 : 9)} y={y + (sub ? h / 2 - 3 : h / 2 + 4)} s={11.5} c={C.text} w="600">{head}</T>
      {sub && <T x={x + (n !== undefined ? 30 : 9)} y={y + h / 2 + 12} s={10.5} c={C.dim}>{sub}</T>}
    </g>
  )
}

// Simple table: cols = x offsets, rows = arrays of cell strings.
function Rows({ x, y, cols, rows, lh = 17, head, s = 11, first = C.text, c = C.dim }) {
  return (
    <g>
      {head && head.map((h, i) => <Tag key={i} x={x + cols[i]} y={y}>{h}</Tag>)}
      {rows.map((r, j) => (
        <g key={j}>
          {head && <line x1={x} y1={y + 6 + j * lh} x2={x + cols[cols.length - 1] + 120} y2={y + 6 + j * lh} stroke={C.line} strokeWidth="0.6" opacity="0.6" />}
          {r.map((cell, i) => (
            <T key={i} x={x + cols[i]} y={y + (head ? 18 : 0) + j * lh} s={s} c={i === 0 ? first : c}>{cell}</T>
          ))}
        </g>
      ))}
    </g>
  )
}

/* ------------------------------------------------------------------ */
/* Tool glyphs: (0,0) is the working point, the tool extends up (-y)    */
/* ------------------------------------------------------------------ */
const place = ({ x = 0, y = 0, ang = 0, k = 1 }) => `translate(${x} ${y}) rotate(${ang}) scale(${k})`

function Oiler(p) {
  return (
    <g transform={place(p)}>
      <path d="M0 0 L1.4 -7 L2 -44 L-2 -44 L-1.4 -7 Z" fill="url(#sk-steelH)" stroke={STEELD} strokeWidth="0.5" />
      <rect x="-5" y="-108" width="10" height="64" rx="3" fill="url(#sk-ebony)" stroke="#6a625a" strokeWidth="0.6" />
      <rect x="-5.6" y="-52" width="11.2" height="7" fill="url(#sk-brassG)" />
    </g>
  )
}
function Pegwood(p) {
  return (
    <g transform={place(p)}>
      <path d="M0 0 L3.6 -22 L3.6 -96 L-3.6 -96 L-3.6 -22 Z" fill="#c9a87a" stroke="#8a6c44" strokeWidth="0.7" />
      <line x1="-1" y1="-30" x2="-1" y2="-92" stroke="#a98a5e" strokeWidth="0.6" />
    </g>
  )
}
function Tweezers(p) {
  const o = p.open ?? 3
  return (
    <g transform={place(p)}>
      <path d={`M${-o} 0 L${-o - 1.6} -24 L-7 -100 L-3 -100 L${-o + 0.8} -22 Z`} fill="url(#sk-steelH)" stroke={STEELD} strokeWidth="0.6" />
      <path d={`M${o} 0 L${o + 1.6} -24 L7 -100 L3 -100 L${o - 0.8} -22 Z`} fill="url(#sk-steelH)" stroke={STEELD} strokeWidth="0.6" />
    </g>
  )
}
function Driver(p) {
  return (
    <g transform={place(p)}>
      <path d="M-2.4 0 L2.4 0 L3.2 -16 L3.2 -44 L-3.2 -44 L-3.2 -16 Z" fill="url(#sk-steelH)" stroke={STEELD} strokeWidth="0.6" />
      <rect x="-6.5" y="-112" width="13" height="68" rx="2" fill="url(#sk-steelH)" stroke={STEELD} strokeWidth="0.6" />
      {[-96, -88, -80, -72, -64, -56].map((y) => <line key={y} x1="-6.5" y1={y} x2="6.5" y2={y} stroke={STEELD} strokeWidth="0.7" />)}
      <rect x="-7" y="-120" width="14" height="8" rx="2" fill={p.cap || C.ruby} />
    </g>
  )
}

/* Liquids */
function Jar({ x, y, w = 56, h = 62, fill = FLUID.wash, level = 0.72, lid }) {
  const top = y + h * (1 - level)
  return (
    <g>
      <rect x={x + 2} y={top} width={w - 4} height={y + h - top - 2} rx="3" fill={fill} opacity="0.55" />
      <rect x={x} y={y} width={w} height={h} rx="5" fill="rgba(160,200,215,0.08)" stroke={C.struct} strokeWidth="1.2" />
      {lid && <rect x={x - 3} y={y - 7} width={w + 6} height={8} rx="2" fill={C.struct} />}
    </g>
  )
}
function Basket({ x, y, w = 30, h = 20 }) {
  const bars = []
  for (let i = 0; i <= w; i += 5) bars.push(<line key={i} x1={x + i} y1={y} x2={x + i} y2={y + h} stroke={C.text} strokeWidth="0.6" opacity="0.7" />)
  for (let j = 0; j <= h; j += 5) bars.push(<line key={'h' + j} x1={x} y1={y + j} x2={x + w} y2={y + j} stroke={C.text} strokeWidth="0.6" opacity="0.7" />)
  return <g>{bars}</g>
}
function Bottle({ x, y, c, top, sub, w = 34 }) {
  return (
    <g>
      <rect x={x + w * 0.3} y={y} width={w * 0.4} height={10} fill={C.struct} />
      <rect x={x} y={y + 10} width={w} height={44} rx="5" fill="rgba(255,255,255,0.05)" stroke={c} strokeWidth="1.3" />
      <rect x={x + 2} y={y + 24} width={w - 4} height={28} rx="3" fill={c} opacity="0.42" />
      {top && <T x={x + w / 2} y={y + 41} a="middle" s={10} w="700" c={C.text}>{top}</T>}
      {sub && <T x={x + w / 2} y={y + 68} a="middle" s={10} c={C.dim}>{sub}</T>}
    </g>
  )
}

/* ================================================================== */
/* Cleaning chemistry & a safe home process                             */
/* ================================================================== */

// fig: bm-clean-systems CleanSystems
function CleanSystems() {
  const col = (x, title, sub, jars, foot) => (
    <g>
      <Panel x={x} y={28} w={222} h={214} />
      <T x={x + 111} y={46} a="middle" s={12} w="700" c={C.text}>{title}</T>
      <T x={x + 111} y={61} a="middle" s={10.5} c={C.dim}>{sub}</T>
      {jars.map(([fill, n, a, b], i) => {
        const jx = x + 12 + i * 70
        return (
          <g key={i}>
            <Jar x={jx} y={78} w={58} h={66} fill={fill} />
            <Num x={jx + 29} y={92} n={n} r={8} />
            <T x={jx + 29} y={162} a="middle" s={10.5} c={C.text}>{a}</T>
            <T x={jx + 29} y={175} a="middle" s={10} c={C.dim}>{b}</T>
          </g>
        )
      })}
      <T x={x + 111} y={200} a="middle" s={10.5} c={C.dim}>{foot[0]}</T>
      <T x={x + 111} y={214} a="middle" s={10.5} c={C.dim}>{foot[1]}</T>
      <T x={x + 111} y={232} a="middle" s={10} c={C.faint}>{foot[2]}</T>
    </g>
  )
  return (
    <Fig h={290} view="Comparison · two complete systems" scale="schematic">
      {col(12, 'Water based', 'Elma, spin machine', [[FLUID.wash, 1, 'Concentrate', '1:9, tap water'], [FLUID.water, 2, 'Distilled', 'water'], [FLUID.rinse, 3, 'Suprol', 'Spezial']], ['Spin dry between jars,', 'then heated drying chamber', 'source: Elma manual'])}
      {col(246, 'Waterless', 'L&R “3-2-1”, ultrasonic', [[FLUID.wash, 1, '#111', 'ammoniated'], [FLUID.rinse, 2, '#3', 'rinse'], [FLUID.ipa, 3, '99% IPA', 'final rinse']], ['Fluids stay in beakers,', 'then a dehydrator at 45 °C', 'source: one repairer’s guide'])}
      <Verdict x={92} y={266} ok={false} r={10} />
      <T x={110} y={270} s={11.5} c={C.text}>Don’t carry a fluid from one column to the other.</T>
    </Fig>
  )
}

// fig: bm-clean-colour CleanColour
function CleanColour() {
  const chip = (x, y, fill, a, b, bad) => (
    <g>
      <rect x={x} y={y} width={78} height={34} rx="5" fill={fill} stroke={bad ? C.ruby : C.struct} strokeWidth={bad ? 2 : 1} />
      <T x={x + 39} y={y + 49} a="middle" s={10.5} c={bad ? C.ruby : C.text}>{a}</T>
      {b && <T x={x + 39} y={y + 62} a="middle" s={10} c={C.dim}>{b}</T>}
    </g>
  )
  return (
    <Fig h={290} view="Chart · when a fluid is finished" scale="colours are indicative">
      <T x={14} y={44} s={12} w="700" c={C.text}>L&amp;R #111 wash</T>
      {chip(120, 28, '#d9c35c', 'yellow', 'fresh')}
      {chip(210, 28, '#8fb65a', 'green', 'in use')}
      {chip(300, 28, '#5d9a86', 'green-blue', 'watch it')}
      {chip(390, 28, '#4a7fa8', 'more blue', 'replace', true)}
      <line x1={12} y1={104} x2={468} y2={104} stroke={C.line} strokeDasharray="2 4" />
      <T x={14} y={128} s={12} w="700" c={C.text}>L&amp;R #3 rinse</T>
      {chip(120, 112, 'rgba(210,230,238,0.16)', 'colourless', 'fresh')}
      {chip(210, 112, 'rgba(120,175,215,0.42)', 'first blue tint', 'replace', true)}
      <Note x={306} y={124} lines={['Don’t wait for full blue.', 'The first tint is the limit.']} s={11} />
      <line x1={12} y1={188} x2={468} y2={188} stroke={C.line} strokeDasharray="2 4" />
      <T x={14} y={212} s={12} w="700" c={C.text}>Elma solution</T>
      <T x={14} y={227} s={10.5} c={C.dim}>tally on the jar</T>
      {Array.from({ length: 12 }, (_, i) => (
        <g key={i}>
          <rect x={120 + i * 28} y={200} width={24} height={16} rx="2" fill={i >= 10 ? 'rgba(194,88,99,0.35)' : 'rgba(217,195,92,0.28)'} stroke={i >= 10 ? C.ruby : C.struct} strokeWidth="0.8" />
          <T x={132 + i * 28} y={212} a="middle" s={10} c={C.text} mono>{(i + 1) * 5}</T>
        </g>
      ))}
      <T x={120} y={234} s={10.5} c={C.dim}>cleanings</T>
      <T x={456} y={234} a="end" s={10.5} c={C.ruby}>replace after 50 to 60 at the latest</T>
      <T x={14} y={268} s={10.5} c={C.dim}>Check against white paper in daylight. If you can’t call the colour, change the fluid.</T>
    </Fig>
  )
}

// fig: bm-clean-elma CleanElma
function CleanElma() {
  const s = [
    ['Jar 1 · wash', '3 to 5 min', 'slow speed', FLUID.wash],
    ['Lift and spin', 'about 30 s', 'full speed', null],
    ['Jar 2 · distilled', '1 to 2 min', 'then spin 1 to 2 min', FLUID.water],
    ['Jar 3 · rinse', 'Suprol Spezial', 'then lift out', FLUID.rinse],
    ['Dry', '1 to 2 min', 'high speed, raised', null],
  ]
  return (
    <Fig h={296} view="Sequence · Elma Super Elite cycle" scale="schematic">
      {s.map(([a, b, c2, f], i) => {
        const x = 12 + i * 92
        return (
          <g key={i}>
            <rect x={x} y={34} width={84} height={86} rx="6" fill="rgba(255,255,255,0.03)" stroke={C.line} />
            {f && <rect x={x + 1} y={80} width={82} height={39} rx="5" fill={f} opacity="0.35" />}
            <Num x={x + 14} y={49} n={i + 1} r={8} />
            <Basket x={x + 30} y={i === 1 || i === 4 ? 46 : 88} w={25} h={20} />
            {(i === 1 || i === 4) && <Arrow d={`M${x + 22} 74 a22 8 0 1 0 42 0`} c="brass" w={1.4} />}
            <T x={x + 42} y={136} a="middle" s={10.5} c={C.text} w="600">{a}</T>
            <T x={x + 42} y={151} a="middle" s={10.5} c={C.brassHi} mono>{b}</T>
            {c2.startsWith('then spin') ? (
              <g>
                <T x={x + 42} y={165} a="middle" s={10} c={C.dim}>then spin</T>
                <T x={x + 42} y={178} a="middle" s={10} c={C.dim}>1 to 2 min</T>
              </g>
            ) : <T x={x + 42} y={165} a="middle" s={10} c={C.dim}>{c2}</T>}
          </g>
        )
      })}
      <Panel x={12} y={192} w={456} h={92} tc={C.ruby} title="Heat limit" />
      <rect x={30} y={226} width={120} height={34} rx="3" fill="rgba(255,255,255,0.03)" stroke={C.struct} />
      <rect x={30} y={254} width={120} height={8} fill={C.ruby} opacity="0.7" />
      <Basket x={76} y={226} w={25} h={15} />
      <Lead p={[90, 258]} t={[172, 254]} text="chamber floor can pass 90 °C" c={C.ruby} />
      <Lead p={[100, 234]} t={[172, 226]} text="basket stays raised, never parked on the floor" />
      <T x={176} y={274} s={10.5} c={C.dim}>Elma is a spin machine, not an ultrasonic.</T>
    </Fig>
  )
}

// fig: bm-clean-321 Clean321
function Clean321() {
  const blocks = [
    ['#111', 3, FLUID.wash],
    ['#3 rinse', 2, FLUID.rinse],
    ['99% IPA', 1, FLUID.ipa],
  ]
  let bx = 216
  return (
    <Fig h={310} view="Section and sequence · L&R 3-2-1" scale="schematic">
      <Tag x={14} y={40}>Beaker in the tank</Tag>
      <rect x={22} y={84} width={172} height={146} rx="4" fill="rgba(111,159,181,0.08)" stroke={C.struct} strokeWidth="1.5" />
      <rect x={24} y={132} width={168} height={96} fill={FLUID.water} opacity="0.3" />
      <path d="M66 58 L66 212 Q66 222 76 222 L140 222 Q150 222 150 212 L150 58" fill="rgba(200,225,235,0.06)" stroke={C.text} strokeWidth="1.3" />
      <rect x={68} y={128} width={80} height={92} fill={FLUID.wash} opacity="0.45" />
            <Basket x={92} y={170} w={32} h={30} />
      {[34, 48, 170, 184].map((x, i) => <path key={i} d={`M${x} 214 q5 -7 0 -14 q-5 -7 0 -14`} fill="none" stroke={C.steel} strokeWidth="0.9" opacity="0.7" />)}
      <T x={108} y={74} a="middle" s={10.5} c={C.dim}>600 ml</T>
      <T x={108} y={87} a="middle" s={10.5} c={C.dim}>Pyrex beaker</T>
      <T x={108} y={146} a="middle" s={10.5} c={C.text}>about 400 ml</T>
      <Lead p={[40, 206]} t={[30, 272]} text="water in the tank, heater off" a="start" />
      <Lead p={[108, 196]} t={[108, 248]} text="parts in a basket" a="start" />

      <Tag x={216} y={40}>Six 2-minute sessions</Tag>
      {blocks.map(([name, n, f], i) => {
        const row = []
        for (let k = 0; k < n; k++) {
          row.push(
            <g key={k}>
              <rect x={bx} y={70 + i * 44} width={54} height={26} rx="4" fill={f} fillOpacity="0.4" stroke={C.struct} />
              <T x={bx + 27} y={87 + i * 44} a="middle" s={11} c={C.text} mono>2 min</T>
            </g>
          )
          bx += 60
        }
        bx = 216
        return (
          <g key={i}>
            <T x={216} y={65 + i * 44} s={10.5} c={C.text} w="600">{name} · {n} × 2 min</T>
            {row}
          </g>
        )
      })}
      <rect x={216} y={206} width={234} height={30} rx="4" fill="rgba(208,168,79,0.15)" stroke={C.brass} />
      <T x={333} y={226} a="middle" s={11} c={C.text}>Dehydrator: 15+ min at 45 °C</T>
      <Note x={216} y={258} lines={['Stop after every 2 minutes and move the beaker:', 'hot spots can delaminate rhodium plating.', 'L&R #566 goes in a beaker only, never in the tank.']} s={10.5} lh={14} />
    </Fig>
  )
}

// fig: bm-clean-shellac CleanShellac
function CleanShellac() {
  return (
    <Fig h={334} view="Detail · why fork and balance stay out" scale="schematic">
      <Panel x={12} y={28} w={224} h={160} title="Pallet stone · magnified" />
      <path d="M30 60 L216 60 L216 112 L150 112 L150 150 L116 150 L116 112 L30 112 Z" fill={STEELD} stroke={STEEL} strokeWidth="1" />
      <rect x={120} y={84} width={26} height={94} rx="1" fill={RUBY} stroke={RUBYHI} strokeWidth="0.8" />
      <path d="M116 118 L120 118 L120 150 L116 150 Z M146 118 L150 118 L150 150 L146 150 Z" fill={SHELLAC} />
      <path d="M116 150 Q108 152 106 158 L120 158 L120 150 Z M150 150 Q158 152 160 158 L146 158 L146 150 Z" fill={SHELLAC} stroke="#e8a55c" strokeWidth="0.6" />
      <Lead p={[108, 155]} t={[78, 172]} text="shellac" c="#e8a55c" a="end" />
      <Lead p={[133, 170]} t={[176, 172]} text="stone" c={RUBYHI} />
      <Lead p={[60, 96]} t={[44, 132]} text="fork" a="start" />

      <Panel x={244} y={28} w={224} h={160} title="Impulse jewel on the roller" />
      <circle cx={356} cy={118} r={50} fill={STEELD} stroke={STEEL} />
      <circle cx={356} cy={118} r={12} fill={C.ground} stroke={STEEL} />
      <rect x={299} y={110} width={20} height={16} rx="2" fill={RUBY} stroke={RUBYHI} strokeWidth="0.8" />
      <path d="M319 110 Q327 118 319 126 Z" fill={SHELLAC} stroke="#e8a55c" strokeWidth="0.6" />
      <Lead p={[323, 118]} t={[388, 58]} text="shellac" c="#e8a55c" />
      <Lead p={[305, 112]} t={[268, 58]} text="impulse jewel" c={RUBYHI} a="start" />
      <Lead p={[372, 150]} t={[400, 176]} text="roller" />

      <Panel x={12} y={196} w={456} h={126} title="The rule for both parts" />
      {[
        [false, 'Ultrasonic', 'never', 24],
        [true, 'Bench solvent', 'short soak, timed', 136],
        [true, 'Final rinse', 'under 60 s', 248],
        [true, 'Dry', 'below 50 °C', 360],
      ].map(([ok, a, b, x], i) => (
        <g key={i}>
          <Verdict x={x + 12} y={234} ok={ok} r={10} />
          <T x={x + 28} y={232} s={11.5} c={C.text} w="600">{a}</T>
          <T x={x + 28} y={246} s={10.5} c={ok ? C.brassHi : C.ruby}>{b}</T>
        </g>
      ))}
      <Note x={26} y={270} lines={['IPA attacks shellac less than ethanol but still softens it. Evidence is forum level:', 'one poster ruined several forks in long alcohol rinses, and another limits fork', 'and balance to 30 to 60 s in IPA.']} s={10.5} lh={14} />
    </Fig>
  )
}

// fig: bm-clean-never CleanNever
function CleanNever() {
  const tile = (x, y, a, b, c2, glyph) => (
    <g>
      <Panel x={x} y={y} w={148} h={82} />
      <g transform={`translate(${x + 30} ${y + 41})`}>{glyph}</g>
      <Verdict x={x + 135} y={y + 13} ok={false} r={7} />
      <T x={x + 58} y={y + 30} s={11} c={C.text} w="600">{a}</T>
      <T x={x + 58} y={y + 45} s={10} c={C.dim}>{b}</T>
      {c2 && <T x={x + 58} y={y + 58} s={10} c={C.dim}>{c2}</T>}
    </g>
  )
  return (
    <Fig h={254} view="Chart · stays out of every fluid" scale="schematic">
      {tile(12, 28, 'Dials', 'no safe solvent', 'is sourced', <g><circle r="20" fill="#e9dfca" stroke={C.struct} />{[0, 90, 180, 270].map((a) => <rect key={a} x="-1" y="-18" width="2" height="5" fill="#3a332b" transform={`rotate(${a})`} />)}</g>)}
      {tile(166, 28, 'Hands', 'same reason:', 'lume, lacquer', <g><path d="M-1.6 18 L-1 -20 L1 -20 L1.6 18 Z" fill={STEEL} transform="rotate(28)" /><path d="M-2 12 L-1.4 -12 L1.4 -12 L2 12 Z" fill={STEEL} transform="rotate(-50)" /><circle r="3" fill={STEELD} /></g>)}
      {tile(320, 28, 'Plastic parts', 'no sourced data', 'on any fluid', <g><rect x="-18" y="-14" width="36" height="28" rx="6" fill="#5b6f84" stroke="#9fb4c8" /><circle r="6" fill={C.ground} stroke="#9fb4c8" /></g>)}
      {tile(12, 118, 'ETA 2824-2', 'both reversing', 'wheels', <g>{[-11, 11].map((x, i) => <g key={i}><circle cx={x} cy={0} r="11" fill="none" stroke={BRASS} strokeWidth="3" strokeDasharray="2 1.6" /><circle cx={x} cy={0} r="3" fill={BRASS} /></g>)}</g>)}
      {tile(166, 118, 'Sellita SW500', 'RDM+ barrel,', 'per oil chart', <g><circle r="19" fill={BRASSD} stroke={BRASS} strokeWidth="2" /><circle r="6" fill={STEEL} /></g>)}
      {tile(320, 118, 'Your calibre', 'read the sheet', 'for no-wash', <g><rect x="-15" y="-19" width="30" height="38" rx="2" fill="#e9dfca" /><line x1="-10" y1="-11" x2="10" y2="-11" stroke="#6b6155" /><line x1="-10" y1="-4" x2="10" y2="-4" stroke="#6b6155" /><line x1="-10" y1="3" x2="4" y2="3" stroke="#6b6155" /></g>)}
      <T x={240} y={226} a="middle" s={11.5} c={C.text} w="600">No source tells us which solvents attack lume, dial print, lacquer or plastics.</T>
      <T x={240} y={242} a="middle" s={10.5} c={C.dim}>So this app names no dial solvent. Already washed a no-wash part? Replace it.</T>
    </Fig>
  )
}

// fig: bm-clean-order CleanOrder
function CleanOrder() {
  return (
    <Fig h={330} view="Sequence · a home order" scale="app’s own order, not a maker’s">
      <Stage x={12} y={30} w={456} h={36} n={1} head="Strip, pre-clean, peg every jewel with sharpened pegwood" />
      <Tag x={14} y={86}>Plates, bridges, wheels</Tag>
      <Tag x={250} y={86} c={C.brass}>Fork and balance</Tag>
      <Stage x={12} y={92} w={226} n={2} head="Main wash" sub="Cycle A or B, or lidded jar by hand" />
      <Stage x={246} y={92} w={222} n={2} head="Own short solvent soak" sub="Timed. Never the ultrasonic" c={SHELLAC} />
      <Stage x={12} y={144} w={226} n={3} head="Full rinse stages" sub="Fresh rinse, per your cycle" />
      <Stage x={246} y={144} w={222} n={3} head="Final rinse under 60 s" sub="By the clock" c={SHELLAC} />
      <Arrow a={[125, 136]} b={[125, 144]} c="brass" w={1.4} />
      <Arrow a={[357, 136]} b={[357, 144]} c="brass" w={1.4} />
      <Stage x={12} y={204} w={456} h={36} n={4} head="Dry below 50 °C (one repairer uses 45 °C for 15+ min)" />
      <Stage x={12} y={248} w={456} h={36} n={5} head="Inspect: stones tight, jewels clear, no film" />
      <Arrow a={[125, 196]} b={[125, 204]} c="brass" w={1.4} />
      <Arrow a={[357, 196]} b={[357, 204]} c="brass" w={1.4} />
      <T x={14} y={306} s={10.5} c={C.dim}>Dial, hands and any no-wash parts sit out of this whole sequence, set aside and covered.</T>
      <T x={14} y={320} s={10} c={C.faint}>Built from one repairer’s guide and forum reports. No maker publishes this order.</T>
    </Fig>
  )
}

// fig: bm-clean-fire CleanFire
function CleanFire() {
  return (
    <Fig h={330} view="Side view · a safe set-up" scale="schematic">
      {/* bench */}
      <rect x={20} y={196} width={300} height={12} fill="url(#sk-bench)" stroke={C.struct} />
      {/* window */}
      <rect x={24} y={36} width={78} height={92} fill="rgba(160,200,215,0.08)" stroke={C.struct} strokeWidth="1.4" />
      <line x1={63} y1={36} x2={63} y2={128} stroke={C.struct} />
      <Arrow a={[112, 76]} b={[174, 76]} c="steel" w={1.6} />
      <Arrow a={[174, 96]} b={[112, 96]} c="steel" w={1.6} />
      <T x={28} y={146} s={10.5} c={C.text}>window open</T>
      {/* jar with lid */}
      <Jar x={128} y={140} w={48} h={56} fill={FLUID.ipa} lid />
      <Lead p={[152, 136]} t={[196, 116]} text="lid back on" sub="after each basket" subc={C.dim} />
      {/* tank */}
      <rect x={214} y={150} width={92} height={46} rx="3" fill="rgba(111,159,181,0.1)" stroke={C.struct} strokeWidth="1.3" />
      <rect x={216} y={166} width={88} height={28} fill={FLUID.water} opacity="0.3" />
      <rect x={244} y={136} width={34} height={56} rx="2" fill="rgba(255,255,255,0.05)" stroke={C.text} />
      <rect x={246} y={158} width={30} height={32} fill={FLUID.wash} opacity="0.4" />
      <Lead p={[290, 176]} t={[336, 158]} text="solvent in a beaker," sub="tank heater off" subc={C.dim} />
      {/* rules right */}
      <Panel x={336} y={30} w={132} h={100} title="Keep away" tc={C.ruby} />
      <Note x={346} y={62} lines={['flames, pilot lights', 'heaters, hot lamps', 'anything that sparks', 'smoking']} s={10.5} lh={15} c={C.text} />
      {/* eye */}
      <g transform="translate(52 170)">
        <path d="M-22 0 q4 -12 18 -10 q4 2 4 6 q0 -4 4 -6 q14 -2 18 10 q-6 10 -18 6 q-4 -2 -4 -6 q0 4 -4 6 q-12 4 -18 -6 Z" fill="rgba(160,200,215,0.14)" stroke={C.text} strokeWidth="1.1" />
      </g>
      <T x={54} y={192} a="middle" s={10.5} c={C.text}>eye protection</T>
      {/* waste */}
      <rect x={20} y={226} width={40} height={50} rx="4" fill="rgba(194,88,99,0.14)" stroke={C.ruby} />
      <rect x={30} y={218} width={20} height={8} fill={C.ruby} />
      <T x={40} y={256} a="middle" s={10} c={C.text} w="700">WASTE</T>
      <Note x={70} y={238} lines={['Closed, labelled container. Take it to your local hazardous-waste', 'collection. Nothing goes down a drain or onto soil.']} s={10.5} lh={14} />
      <Panel x={12} y={284} w={456} h={36} />
      <T x={24} y={300} s={11} c={C.text} w="600">Treat every fluid as flammable unless its safety data sheet says otherwise.</T>
      <T x={24} y={314} s={10.5} c={C.ruby}>Small fire in a jar: lid or fire blanket on, leave it, never carry it. If in doubt, get out.</T>
    </Fig>
  )
}

// fig: bm-clean-check CleanCheck
function CleanCheck() {
  const jewel = (cx, dirty) => (
    <g>
      <circle cx={cx} cy={96} r={36} fill={RUBY} opacity="0.55" stroke={RUBYHI} />
      <circle cx={cx} cy={96} r={20} fill={RUBY} opacity="0.5" />
      <circle cx={cx} cy={96} r={5} fill={C.ground} stroke={RUBYHI} />
      {dirty && <circle cx={cx} cy={96} r={11} fill="none" stroke="#3b2c18" strokeWidth="6" opacity="0.8" />}
      {dirty && <path d={`M${cx + 16} ${82} q10 8 6 20`} fill="none" stroke="#3b2c18" strokeWidth="3" opacity="0.7" />}
    </g>
  )
  return (
    <Fig h={250} view="Detail · under the loupe" scale="×40, schematic">
      <Panel x={12} y={28} w={148} h={136} title="Jewel, not clean" ok={false} />
      {jewel(86, true)}
      <T x={86} y={152} a="middle" s={10.5} c={C.dim}>dark ring: peg it again</T>
      <Panel x={166} y={28} w={148} h={136} title="Jewel, clean" ok={true} />
      {jewel(240, false)}
      <T x={240} y={152} a="middle" s={10.5} c={C.dim}>clear hole, no ring</T>
      <Panel x={320} y={28} w={148} h={136} title="Stone test" />
      <path d="M332 70 L456 70 L456 92 L412 92 L412 110 L376 110 L376 92 L332 92 Z" fill={STEELD} stroke={STEEL} />
      <rect x={382} y={80} width={24} height={56} fill={RUBY} stroke={RUBYHI} strokeWidth="0.7" />
      <Pegwood x={381} y={124} ang={-72} k={0.5} />
      <Arrow a={[346, 136]} b={[374, 128]} c="brass" w={1.4} />
      <T x={394} y={156} a="middle" s={10.5} c={C.dim}>light press: no movement</T>
      <Note x={14} y={186} lines={['Clean parts go under the loupe before any oil. Handle them with clean tweezers only.', 'Any stone that moves: stop, and go to Escapement adjustment & shellac work.', 'A jewel with film on it pulls fresh oil off-centre, as the next lesson shows.']} s={10.5} lh={15} />
    </Fig>
  )
}

/* ------------------------------------------------------------------ */
/* Lever escapement geometry. Everything is computed, so the plan views  */
/* agree with each other. The wheel turns clockwise; the entry stone     */
/* sits at +30° on the wheel and the exit stone at -30°.                 */
/* ------------------------------------------------------------------ */
function wheelOutline(cx, cy, R, rot) {
  const rr = R * 0.84
  const out = []
  for (let i = 0; i < 15; i++) {
    const a = rot - i * 24
    out.push(pol(cx, cy, rr, a + 17), pol(cx, cy, R * 0.962, a + 6.2), pol(cx, cy, R, a), pol(cx, cy, rr, a + 5.5))
  }
  return pts(out)
}
function EscWheel({ cx, cy, R, rot = 0 }) {
  return (
    <g>
      <polygon points={wheelOutline(cx, cy, R, rot)} fill={STEEL} stroke={STEELD} strokeWidth="0.7" />
      <circle cx={cx} cy={cy} r={R * 0.68} fill={C.ground} stroke={STEELD} strokeWidth="0.7" />
      {[0, 90, 180, 270].map((a) => {
        const [x, y] = pol(cx, cy, R * 0.7, a + rot)
        return <line key={a} x1={cx} y1={cy} x2={x} y2={y} stroke={STEEL} strokeWidth={R * 0.11} />
      })}
      <circle cx={cx} cy={cy} r={R * 0.16} fill={STEEL} stroke={STEELD} />
      <circle cx={cx} cy={cy} r={R * 0.05} fill={C.ground} />
    </g>
  )
}
function stoneShape(W, R, th, { len = 0.46, wid = 0.13, lift = 0.1, draw = 12 } = {}) {
  const c = pol(W[0], W[1], R, th)
  const u = [-Math.cos(rad(th)), Math.sin(rad(th))]
  const t = [Math.sin(rad(th)), Math.cos(rad(th))]
  const cd = Math.cos(rad(draw))
  const sd = Math.sin(rad(draw))
  const f = [u[0] * cd - t[0] * sd, u[1] * cd - t[1] * sd]
  const n = [t[0] * cd + u[0] * sd, t[1] * cd + u[1] * sd]
  const add = (p, v, k) => [p[0] + v[0] * k, p[1] + v[1] * k]
  const I = c
  const O = add(c, f, -R * len)
  const I2 = add(add(I, n, R * wid), f, -R * lift)
  const O2 = add(O, n, R * wid)
  const m = 0.06 * R
  const E1 = add(add(O, n, -m), f, -m * 0.5)
  const E2 = add(add(O2, n, m), f, -m * 0.5)
  const M1 = add(add(c, f, -R * len * 0.55), n, -m)
  const M2 = add(add(c, f, -R * len * 0.55), n, R * wid + m)
  return { I, O, I2, O2, E1, E2, M1, M2, poly: [O, I, I2, O2] }
}
// The fork, drawn in its mid position and rotated by phi (+ = entry side locked).
function Fork({ W, R, P, Lf, phi = 0, dart = true }) {
  const e = stoneShape(W, R, 30)
  const x = stoneShape(W, R, -30)
  const hx = P[0] + Lf
  const y = P[1]
  const body = [[P[0] + 8, y - 11], e.E2, e.E1, e.M1, e.M2, [P[0] - 9, y - 4], [P[0] - 9, y + 4], x.M1, x.M2, x.E2, x.E1, [P[0] + 8, y + 11], [P[0] + 40, y + 5], [hx - 16, y + 4], [hx - 8, y + 9], [hx + 12, y + 8], [hx + 10, y + 3.9], [hx - 5, y + 3.9], [hx - 5, y - 3.9], [hx + 10, y - 3.9], [hx + 12, y - 8], [hx - 8, y - 9], [hx - 16, y - 4], [P[0] + 40, y - 5]]
  return (
    <g transform={`rotate(${-phi} ${P[0]} ${P[1]})`}>
      <polygon points={pts(body)} fill={STEELD} stroke={STEEL} strokeWidth="0.8" strokeLinejoin="round" />
      {dart && <line x1={hx - 7} y1={y} x2={hx + 15} y2={y} stroke={BRASS} strokeWidth="1.8" />}
      <polygon points={pts(e.poly)} fill={RUBY} stroke={RUBYHI} strokeWidth="0.6" />
      <polygon points={pts(x.poly)} fill={RUBY} stroke={RUBYHI} strokeWidth="0.6" />
      <circle cx={P[0]} cy={P[1]} r={4} fill={C.ground} stroke={STEEL} strokeWidth="1" />
    </g>
  )
}
function Roller({ c, pin = 180, r1 = 24, rs = 13, rp = 19 }) {
  const [px, py] = pol(c[0], c[1], rp, pin)
  const cr = pol(c[0], c[1], rs, pin)
  return (
    <g>
      <circle cx={c[0]} cy={c[1]} r={r1} fill="rgba(134,167,189,0.14)" stroke={STEELD} strokeWidth="1" />
      <circle cx={c[0]} cy={c[1]} r={rs} fill={STEELD} stroke={STEEL} strokeWidth="0.8" />
      <circle cx={cr[0]} cy={cr[1]} r={4.6} fill={C.ground} stroke={STEEL} strokeWidth="0.6" />
      <circle cx={c[0]} cy={c[1]} r={3} fill={C.ground} stroke={STEEL} />
      <circle cx={px} cy={py} r={3.2} fill={RUBY} stroke={RUBYHI} strokeWidth="0.7" />
    </g>
  )
}
// Whole escapement in plan.
function EscPlan({ x = 0, y = 0, k = 1, phi = 5, rot = 30.6, pin = 240, banks = true, spring }) {
  const W = [100, 120]
  const R = 62
  const P = [100 + R * 1.155, 120]
  const Lf = 92
  const Rc = [P[0] + Lf + 26, 120]
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <EscWheel cx={W[0]} cy={W[1]} R={R} rot={rot} />
      {spring && [30, 36, 42, 48].map((r) => <circle key={r} cx={Rc[0]} cy={Rc[1]} r={r} fill="none" stroke={C.steel} strokeWidth="0.8" opacity="0.65" />)}
      <Roller c={Rc} pin={pin} />
      <Fork W={W} R={R} P={P} Lf={Lf} phi={phi} />
      {banks && [-1, 1].map((sgn) => <circle key={sgn} cx={P[0] + 56} cy={P[1] + sgn * 13.6} r={3.4} fill={BRASS} stroke={BRASSD} />)}
    </g>
  )
}

/* ================================================================== */
/* Oiling method                                                        */
/* ================================================================== */
function Chip({ x, y, c, children }) {
  const w = String(children).length * 5.7 + 10
  return (
    <g>
      <rect x={x} y={y - 10} width={w} height={14} rx="7" fill={c} />
      <text x={x + w / 2} y={y + 1} textAnchor="middle" fontSize="10" fontWeight="700" fill="#1a1612" fontFamily="var(--font-body)">{children}</text>
    </g>
  )
}

// fig: bm-oil-kit OilKit
function OilKit() {
  const b = [
    [LUB.fine, '9010', 'fine oil', 'train, balance', '6 years'],
    [LUB.thick, '9104', 'HP-1300', 'heavier points', 'not found'],
    [LUB.pal, '9415', 'pallet stones', 'trace only', '6 years'],
    [LUB.grease, '9504', 'metal on metal', 'winding, setting', 'not found'],
    [LUB.brake, '8200', 'manual barrel', 'hand-wind only', '3 years'],
    [LUB.brake, '8217', 'braking grease', 'automatic wall', '3 years'],
  ]
  return (
    <Fig h={252} view="Chart · a starter set" scale="default, practice varies">
      <Tag x={14} y={40} c={C.brass}>ETA’s four main lubricants</Tag>
      <Tag x={318} y={40} c={C.brass}>Add for barrels</Tag>
      <Sep x1={309} y1={30} x2={309} y2={176} />
      {b.map(([c, n, a, d, life], i) => {
        const x = 14 + i * 76 + (i > 3 ? 4 : 0)
        return (
          <g key={n}>
            <Bottle x={x + 15} y={50} c={c} top={n} />
            <T x={x + 32} y={122} a="middle" s={10.5} c={C.text}>{a}</T>
            <T x={x + 32} y={136} a="middle" s={10} c={C.dim}>{d}</T>
            <T x={x + 32} y={154} a="middle" s={10} c={C.faint}>shelf life</T>
            <T x={x + 32} y={167} a="middle" s={10} c={life === 'not found' ? C.faint : C.brassHi} mono>{life}</T>
          </g>
        )
      })}
      <Panel x={12} y={182} w={456} h={60} />
      <Note x={24} y={200} lines={['Also used: D5 where HP-1300 would go. ETA moved to HP-1300 from January 2005.', 'Disputed: budget oils such as 8000. Optional later: epilame, in its own step below.', 'One US list showed a five-bottle kit at $289.96, undated, so check current prices.']} s={10.5} lh={14} />
    </Fig>
  )
}

// fig: bm-oil-map OilMap
function OilMap() {
  const cx = 104
  const cy = 176
  const rows = [
    ['Keyless works', [[LUB.thick, 'HP-1300'], [LUB.grease, '9504']], 'stem, sliding pinion, levers / winding pinion teeth'],
    ['Going train', [[LUB.fine, '9010'], [LUB.thick, 'HP-1300']], 'split by pivot: take each pivot from the sheet'],
    ['Barrel and bridge', [[LUB.thick, 'HP-1300']], 'barrel arbor, barrel bridge, crown wheel'],
    ['Pallets and balance', [[LUB.pal, '9415'], [LUB.fine, '9010']], 'stones / pallet and balance points'],
    ['Automatic works', [[LUB.thick, 'HP-1300'], [LUB.fine, '9010 very small']], 'framework / oscillating weight. Reversers: no wash'],
    ['Calendar and motion', [[LUB.thick, 'HP-1300'], [LUB.thick, 'HP-1300 SC'], [LUB.fine, '9010']], 'some points in very small quantities'],
  ]
  const mark = [[176, 182, 1], [122, 214, 2], [66, 150, 3], [122, 118, 4]]
  return (
    <Fig h={338} view="Map · ETA 2824-2, by stage" scale="schematic, redrawn in our words">
      <circle cx={cx} cy={cy} r={92} fill={PLATE} stroke={C.struct} strokeWidth="1.4" />
      <circle cx={66} cy={176} r={36} fill={BRASSD} stroke={BRASS} />
      <circle cx={66} cy={176} r={10} fill={STEEL} />
      <circle cx={122} cy={196} r={20} fill="none" stroke={BRASS} strokeWidth="3" strokeDasharray="2 1.5" />
      <circle cx={140} cy={156} r={15} fill="none" stroke={BRASS} strokeWidth="3" strokeDasharray="2 1.5" />
      <circle cx={112} cy={130} r={12} fill="none" stroke={STEEL} strokeWidth="2.4" strokeDasharray="2 1.5" />
      <circle cx={134} cy={110} r={18} fill="none" stroke={BRASS} strokeWidth="2" />
      <rect x={168} y={170} width={28} height={7} fill={STEEL} />
      {mark.map(([x, y, n]) => <Num key={n} x={x} y={y} n={n} r={8} />)}
      <T x={cx} y={62} a="middle" s={10.5} c={C.dim}>5 · automatic, on top</T>
      <T x={cx} y={286} a="middle" s={10.5} c={C.dim}>6 · calendar, under the dial</T>
      <T x={cx} y={300} a="middle" s={10} c={C.faint}>movement seen from the back</T>
      {rows.map(([h, chips, note], i) => {
        const y = 40 + i * 47
        let chipX = 228
        return (
          <g key={h}>
            <Num x={218} y={y - 3} n={i + 1} r={8} />
            <T x={232} y={y + 1} s={11.5} c={C.text} w="600">{h}</T>
            {chips.map(([c, label]) => {
              const el = <Chip key={label} x={chipX} y={y + 17} c={c}>{label}</Chip>
              chipX += String(label).length * 5.7 + 15
              return el
            })}
            <T x={228} y={y + 32} s={10} c={C.dim}>{note}</T>
          </g>
        )
      })}
      <T x={12} y={328} s={10} c={C.faint}>From CT 2824-2 rev. 25, 06.10.2022. Other calibres, or other revisions, differ.</T>
    </Fig>
  )
}

// fig: bm-oil-load OilLoad
function OilLoad() {
  return (
    <Fig h={280} view="Detail · loading the oiler" scale="tip ×12, schematic">
      <Tag x={14} y={40}>Oil cup, covered</Tag>
      <Oiler x={80} y={142} k={0.82} />
      <path d="M36 154 Q36 178 80 178 Q124 178 124 154 L124 146 L36 146 Z" fill="rgba(255,255,255,0.06)" stroke={C.struct} strokeWidth="1.3" />
      <path d="M40 152 Q42 172 80 172 Q118 172 120 152 Z" fill={LUB.fine} opacity="0.45" />
      <Arrow a={[106, 112]} b={[106, 138]} c="brass" w={1.4} both />
      <T x={114} y={122} s={10.5} c={C.dim}>touch,</T>
      <T x={114} y={135} s={10.5} c={C.dim}>lift</T>
      <T x={80} y={196} a="middle" s={10.5} c={C.dim}>one grade per cup,</T>
      <T x={80} y={209} a="middle" s={10.5} c={C.dim}>one oiler per grade</T>
      <Panel x={158} y={28} w={150} h={190} title="Tip, right" ok={true} />
      <path d="M233 58 L229 150 L237 150 Z" transform="rotate(180 233 104)" fill="url(#sk-steelH)" stroke={STEELD} strokeWidth="0.6" />
      <circle cx={233} cy={154} r={6} fill={LUB.fine} opacity="0.7" stroke={LUB.fine} />
      <T x={233} y={186} a="middle" s={10.5} c={C.text}>small bead at the tip,</T>
      <T x={233} y={200} a="middle" s={10.5} c={C.text}>shank dry</T>
      <Panel x={318} y={28} w={150} h={190} title="Tip, overloaded" ok={false} />
      <path d="M393 58 L389 150 L397 150 Z" transform="rotate(180 393 104)" fill="url(#sk-steelH)" stroke={STEELD} strokeWidth="0.6" />
      <path d="M385 96 L401 96 L399 156 Q393 166 387 156 Z" fill={LUB.fine} opacity="0.55" stroke={LUB.fine} strokeWidth="0.7" />
      <T x={393} y={186} a="middle" s={10.5} c={C.text}>oil up the shank:</T>
      <T x={393} y={200} a="middle" s={10.5} c={C.text}>wipe clean, reload</T>
      <Rows x={14} y={236} cols={[0, 124, 230]} s={10.5} lh={15} rows={[
        ['Bergeon 7718 No. 1', '1A, black', 'cap jewels, settings in place'],
        ['Bergeon 7718 No. 2', '2A, red', 'pallets, hard-to-reach spots'],
        ['Bergeon 7718 No. 5', 'green', 'train pivots. No drop volume is published'],
      ]} />
    </Fig>
  )
}

function SinkSection({ cx, y, mode }) {
  return (
    <g>
      <rect x={cx - 62} y={y + 2} width={124} height={34} fill={BRASSD} stroke={BRASS} strokeWidth="0.6" />
      <path d={`M${cx - 42} ${y} L${cx - 22} ${y} Q${cx - 10} ${y + 4} ${cx - 6} ${y + 15} L${cx - 6} ${y + 28} L${cx - 42} ${y + 28} Z`} fill={RUBY} stroke={RUBYHI} strokeWidth="0.6" />
      <path d={`M${cx + 42} ${y} L${cx + 22} ${y} Q${cx + 10} ${y + 4} ${cx + 6} ${y + 15} L${cx + 6} ${y + 28} L${cx + 42} ${y + 28} Z`} fill={RUBY} stroke={RUBYHI} strokeWidth="0.6" />
      {mode === 'right' && <path d={`M${cx - 15} ${y + 5} Q${cx - 8} ${y + 8} ${cx - 6} ${y + 15} L${cx + 6} ${y + 15} Q${cx + 8} ${y + 8} ${cx + 15} ${y + 5} Q${cx} ${y + 9} ${cx - 15} ${y + 5} Z`} fill={LUB.fine} opacity="0.85" />}
      {mode === 'flood' && <path d={`M${cx - 58} ${y + 2} Q${cx - 40} ${y - 7} ${cx} ${y - 7} Q${cx + 40} ${y - 7} ${cx + 58} ${y + 2} L${cx + 22} ${y} Q${cx + 10} ${y + 4} ${cx + 6} ${y + 15} L${cx - 6} ${y + 15} Q${cx - 10} ${y + 4} ${cx - 22} ${y} Z`} fill={LUB.fine} opacity="0.75" />}
      <rect x={cx - 4} y={y + 8} width={8} height={70} fill="url(#sk-steelH)" stroke={STEELD} strokeWidth="0.5" />
      <path d={`M${cx - 4} ${y + 52} L${cx - 13} ${y + 62} L${cx - 13} ${y + 90} L${cx + 13} ${y + 90} L${cx + 13} ${y + 62} L${cx + 4} ${y + 52} Z`} fill={STEEL} stroke={STEELD} strokeWidth="0.5" />
    </g>
  )
}

// fig: bm-oil-sink OilSink
function OilSink() {
  const p = [
    [12, 'Too dry', false, 'dry', 'pivot runs bare', 'wears the pivot and jewel'],
    [168, 'Right', true, 'right', 'bead inside the sink,', 'touching the pivot'],
    [324, 'Flooded', false, 'flood', 'oil on the flat creeps', 'away: strip and re-clean'],
  ]
  return (
    <Fig h={254} view="Section · open jewel, wheel fitted" scale="schematic">
      {p.map(([x, t, ok, m, a, b]) => (
        <g key={x}>
          <Panel x={x} y={28} w={144} h={186} title={t} ok={ok} />
          <SinkSection cx={x + 72} y={72} mode={m} />
          <T x={x + 72} y={190} a="middle" s={10.5} c={C.text}>{a}</T>
          <T x={x + 72} y={204} a="middle" s={10.5} c={C.text}>{b}</T>
        </g>
      ))}
      <Lead p={[240, 79]} t={[258, 56]} text="oil sink" s={10.5} />
      <Lead p={[204, 90]} t={[184, 56]} text="jewel" s={10.5} a="start" />
      <Lead p={[243, 112]} t={[268, 132]} text="pivot" s={10.5} />
      <T x={240} y={234} a="middle" s={10.5} c={C.dim}>No published drop size exists for open jewels. Judge by the bead.</T>
    </Fig>
  )
}

function CapJewel({ cx, cy, r, oil, dx = 0, dy = 0, c = LUB.fine }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke={C.struct} strokeWidth="1.4" />
      <circle cx={cx} cy={cy} r={r} fill={RUBY} opacity="0.3" stroke={RUBYHI} strokeWidth="0.8" />
      <circle cx={cx + dx} cy={cy + dy} r={oil} fill={c} fillOpacity="0.5" stroke={c} strokeWidth="1" />
      <circle cx={cx} cy={cy} r={Math.max(2, r * 0.05)} fill={C.text} />
    </g>
  )
}

// fig: bm-oil-circle OilCircle
function OilCircle() {
  const cx = 116
  const cy = 142
  const r = 78
  const small = [
    [30, 'Too small', false, 8, 0, 0, 'less than 1/2 the diameter:', 'evaporates too early'],
    [120, 'Too big', false, 25, 0, 0, 'reaches the edge in a shock,', 'wicks away, leaves the pivot dry'],
    [210, 'Off-centre', false, 14, 8, -6, 'not parallel, or contaminated:', 'dismantle, clean, re-oil'],
  ]
  return (
    <Fig h={312} view="Plan · looking down through the hole jewel" scale="schematic">
      <Panel x={12} y={30} w={210} h={270} title="Right" ok={true} />
      <CapJewel cx={cx} cy={cy} r={r} oil={46} />
      <circle cx={cx} cy={cy} r={39} fill="none" stroke={C.text} strokeWidth="0.9" strokeDasharray="3 3" />
      <circle cx={cx} cy={cy} r={52} fill="none" stroke={C.text} strokeWidth="0.9" strokeDasharray="3 3" />
      <Dim a={[cx - r, 242]} b={[cx + r, 242]} text="" />
      <T x={cx} y={258} a="middle" s={10.5} c={C.dim} mono>D = cap jewel diameter</T>
      <Lead p={[cx - 28, cy - 28]} t={[30, 62]} text="1/2 D" s={10.5} a="start" />
      <Lead p={[cx + 37, cy + 37]} t={[186, 226]} text="2/3 D" s={10.5} />
      <T x={cx} y={276} a="middle" s={11} c={C.text}>Oil between the two rings,</T>
      <T x={cx} y={290} a="middle" s={11} c={C.text}>round and concentric</T>
      {small.map(([y, t, ok, oil, dx, dy, a, b]) => (
        <g key={t}>
          <Panel x={230} y={y} w={238} h={84} title={t} ok={ok} tc={C.ruby} />
          <CapJewel cx={266} cy={y + 50} r={28} oil={oil} dx={dx} dy={dy} />
          <T x={302} y={y + 42} s={10.5} c={C.text}>{a}</T>
          <T x={302} y={y + 56} s={10.5} c={C.text}>{b}</T>
        </g>
      ))}
    </Fig>
  )
}

// fig: bm-oil-cap OilCap
function OilCap() {
  const setting = (cx, tilt) => (
    <g>
      <path d={`M${cx - 72} 188 L${cx - 72} 96 L${cx - 54} 96 L${cx - 54} 170 L${cx + 54} 170 L${cx + 54} 96 L${cx + 72} 96 L${cx + 72} 188 Z`} fill={BRASSD} stroke={BRASS} strokeWidth="0.7" />
      <path d={`M${cx - 52} 168 L${cx - 52} 138 L${cx - 5} 138 L${cx - 5} 168 Z M${cx + 52} 168 L${cx + 52} 138 L${cx + 5} 138 L${cx + 5} 168 Z`} fill={RUBY} opacity="0.85" stroke={RUBYHI} strokeWidth="0.6" />
      <g transform={`rotate(${tilt} ${cx} 122)`}>
        <rect x={cx - 52} y={112} width={104} height={20} rx="1" fill={RUBY} opacity="0.5" stroke={RUBYHI} strokeWidth="0.7" />
      </g>
      {tilt === 0 ? <rect x={cx - 30} y={132} width={60} height={6} fill={LUB.fine} opacity="0.85" /> : <path d={`M${cx - 44} 137.5 L${cx + 2} 137.5 L${cx + 2} 131 L${cx - 44} 126 Z`} fill={LUB.fine} opacity="0.85" />}
      <rect x={cx - 3.5} y={134} width={7} height={70} fill="url(#sk-steelH)" stroke={STEELD} strokeWidth="0.5" />
    </g>
  )
  return (
    <Fig h={306} view="Section · cap jewel on hole jewel" scale="film exaggerated">
      <Panel x={12} y={28} w={226} h={214} title="Parallel" ok={true} />
      {setting(125, 0)}
      <Lab p={[160, 120]} t={[190, 62]} text="cap jewel" s={10.5} a="middle" />
      <Lab p={[92, 135]} t={[60, 62]} text="oil film" c={LUB.fine} s={10.5} a="middle" />
      <Lead p={[92, 152]} t={[28, 216]} text="hole jewel" s={10.5} a="start" />
      <Lead p={[126, 198]} t={[150, 216]} text="pivot" s={10.5} />
      <Panel x={246} y={28} w={222} h={214} title="Tilted cap jewel" ok={false} />
      {setting(357, 5)}
      <Note x={258} y={214} lines={['Oil runs to one side, so the circle', 'looks off-centre from above.']} s={10.5} lh={14} c={C.text} />
      <Note x={14} y={262} lines={['Oil the cap jewel only. Forum practice: extra oil in the hole jewel runs down the pivot.', 'Off-centre fix, from AWCI: dismantle, check, clean, reassemble, re-oil. Never add oil.']} s={10.5} lh={15} />
    </Fig>
  )
}

// fig: bm-oil-escape OilEscape
function OilEscape() {
  return (
    <Fig h={330} view="Plan · where oil goes, where it never goes" scale="schematic">
      <EscPlan x={14} y={44} k={1.14} phi={5} rot={30.6} pin={98} spring />
      {/* wet */}
      <Lab p={[190, 143]} t={[190, 56]} text="9415: a trace on each stone" c={LUB.pal} a="middle" />
      <Lab p={[195, 224]} t={[150, 292]} text="exit stone" c={LUB.pal} a="middle" />
      <Lab p={[92, 128]} t={[62, 56]} text="teeth carry it round" a="middle" s={11} />
      <Lab p={[210, 181]} t={[252, 292]} text="9010: pallet pivots" c={LUB.fine} a="middle" />
      {/* dry */}
      <Lab p={[341, 158]} t={[420, 112]} text="DRY: impulse jewel" c={C.ruby} a="middle" />
      <Lab p={[316, 172]} t={[318, 74]} text="DRY: fork slot, guard pin" c={C.ruby} a="middle" />
      <Lab p={[392, 158]} t={[440, 146]} text="DRY: hairspring" c={C.ruby} a="middle" />
      <T x={14} y={320} s={10.5} c={C.dim}>Move the fork bank to bank with pegwood, a few clicks of wind on, to spread the trace.</T>
    </Fig>
  )
}

function dropPath(cx, y, a, deg) {
  const Rr = a / Math.sin(rad(deg))
  return `M${cx - a} ${y} A${Rr.toFixed(1)} ${Rr.toFixed(1)} 0 0 1 ${cx + a} ${y} Z`
}

// fig: bm-oil-epilame OilEpilame
function OilEpilame() {
  return (
    <Fig h={312} view="Section and chart · epilame" scale="drop shape schematic">
      <Panel x={12} y={28} w={224} h={132} title="Bare clean surface" />
      <rect x={24} y={122} width={200} height={18} fill={STEELD} />
      <path d={dropPath(124, 122, 84, 18)} fill={LUB.fine} opacity="0.7" />
      <Arrow a={[42, 114]} b={[28, 114]} c="ruby" w={1.5} />
      <Arrow a={[206, 114]} b={[220, 114]} c="ruby" w={1.5} />
      <T x={124} y={152} a="middle" s={10.5} c={C.text}>oil flattens and spreads</T>
      <Panel x={244} y={28} w={224} h={132} title="Epilame coated" />
      <rect x={256} y={122} width={200} height={18} fill={STEELD} />
      <rect x={256} y={119.5} width={200} height={3} fill={LUB.epi} />
      <path d={dropPath(356, 120, 30, 70)} fill={LUB.fine} opacity="0.7" />
      <line x1={326} y1={120} x2={326 + 42 * Math.cos(rad(70)) * 0.9} y2={120 - 42 * Math.sin(rad(70)) * 0.9} stroke={C.text} strokeWidth="0.8" />
      <path d={`M${326 + 26} 120 A26 26 0 0 0 ${326 + 26 * Math.cos(rad(70))} ${120 - 26 * Math.sin(rad(70))}`} fill="none" stroke={C.brass} strokeWidth="1.2" />
      <T x={396} y={70} s={10.5} c={C.brassHi}>above 55°</T>
      <T x={396} y={83} s={10} c={C.dim}>counts as</T>
      <T x={396} y={96} s={10} c={C.dim}>effective</T>
      <T x={356} y={152} a="middle" s={10.5} c={C.text}>oil stands up as a bead</T>
      <Panel x={12} y={168} w={224} h={118} title="ETA’s chart, 2824-2" tc={C.brass} />
      <Note x={24} y={198} lines={['Keyless parts, setting wheel,', 'date jumper. After washing,', 'before reassembly.', 'Fixodrop: very volatile,', 'keep it airtight.']} s={10.5} lh={15} c={C.text} />
      <Panel x={244} y={168} w={224} h={118} title="Forum practice" tc={C.brass} />
      <Note x={256} y={198} lines={['Pallet stones and escape wheel.', 'Opinion is split on the need.', 'Treated pallets: oil only after', '1 to 2 min drying (Boley).', 'Episurf-Neo: dip 30 s, dry < 60 s.']} s={10.5} lh={15} c={C.text} />
      <T x={240} y={302} a="middle" s={10.5} c={C.dim}>Both main epilames are fluorinated, so neither can be called PFAS-free.</T>
    </Fig>
  )
}

// fig: bm-oil-proof OilProof
function OilProof() {
  return (
    <Fig h={272} view="Sequence · prove the oiling" scale="target is the app’s suggestion">
      <Stage x={12} y={30} w={148} n={1} head="Loupe" sub="every oiled point" />
      <Stage x={166} y={30} w={148} n={2} head="Wind fully" sub="set lift angle first" />
      <Stage x={320} y={30} w={148} n={3} head="Run 20 min" sub="then read dial up" />
      <Panel x={12} y={86} w={456} h={82} title="Hobby target, modern calibre, full wind, dial up" />
      <line x1={36} y1={140} x2={444} y2={140} stroke={C.struct} strokeWidth="2" />
      <rect x={241} y={132} width={103} height={16} rx="3" fill="rgba(123,165,131,0.3)" stroke={C.emerald} />
      {[[62, '200°'], [190, '250°'], [241, '270°'], [344, '310°'], [395, '330°']].map(([x, t]) => (
        <g key={t}>
          <line x1={x} y1={134} x2={x} y2={146} stroke={C.dim} />
          <T x={x} y={160} a="middle" s={10.5} c={C.dim} mono>{t}</T>
        </g>
      ))}
      <T x={292} y={124} a="middle" s={10.5} c={C.emerald}>270 to 310°, beat error ≤ 0.5 ms</T>
      <Verdict x={36} y={196} ok={true} r={9} />
      <T x={52} y={200} s={11} c={C.text}>In band: note it in your log, then move on to regulation.</T>
      <Verdict x={36} y={224} ok={false} r={9} />
      <T x={52} y={222} s={11} c={C.text}>Low: don’t add oil. Go to Low amplitude: causes and cures.</T>
      <T x={52} y={236} s={10.5} c={C.dim}>Reported causes include excess oil. A dry rebuild isolates lubrication.</T>
      <T x={14} y={262} s={10} c={C.faint}>Lift angle matters: 50° on a 2824-2. A wrong setting gives a confident, wrong amplitude.</T>
    </Fig>
  )
}

/* ================================================================== */
/* Choosing & sizing a mainspring                                       */
/* ================================================================== */
// Barrel in section. Dimensions are drawn at ×16 for an 11 mm barrel.
function BarrelSection({ x, y, w = 220, h = 62, lid = 13, flush = true, dome, proud }) {
  const wall = 12
  return (
    <g>
      {/* drum */}
      <path d={`M${x} ${y} L${x + wall} ${y} L${x + wall} ${y + h} L${x + w - wall} ${y + h} L${x + w - wall} ${y} L${x + w} ${y} L${x + w} ${y + h + 10} L${x} ${y + h + 10} Z`} fill={BRASSD} stroke={BRASS} strokeWidth="0.8" />
      {/* lid */}
      {dome ? (
        <path d={`M${x + wall - 2} ${y} Q${x + w / 2} ${y + 16} ${x + w - wall + 2} ${y} L${x + w - wall + 2} ${y + lid - 3} Q${x + w / 2} ${y + lid + 16} ${x + wall - 2} ${y + lid - 3} Z`} fill={BRASS} stroke={BRASSD} strokeWidth="0.7" />
      ) : (
        <rect x={x + wall - 2} y={y - (proud ? 7 : 0)} width={w - 2 * wall + 4} height={lid} fill={BRASS} stroke={BRASSD} strokeWidth="0.7" transform={proud ? `rotate(-2 ${x + w / 2} ${y})` : undefined} />
      )}
    </g>
  )
}

// fig: bm-ms-barrel MsBarrel
function MsBarrel() {
  const x = 40
  const y = 104
  return (
    <Fig h={300} view="Section · what to measure" scale="×16 on height, schematic">
      <BarrelSection x={x} y={y} w={232} h={72} lid={14} />
      {/* spring coils and arbor */}
      {[0, 1, 2, 3].map((i) => <rect key={i} x={x + 14 + i * 5} y={y + 18} width={3} height={52} fill="#7e8b92" />)}
      {[0, 1, 2, 3].map((i) => <rect key={i} x={x + 215 - i * 5} y={y + 18} width={3} height={52} fill="#7e8b92" />)}
      <rect x={x + 100} y={y - 20} width={32} height={116} fill={STEEL} stroke={STEELD} />
      <Dim a={[x + 12, y + 106]} b={[x + 220, y + 106]} text="" />
      <T x={x + 116} y={y + 124} a="middle" s={10.5} c={C.dim} mono>inside diameter (ID) 11.00</T>
      <Dim a={[x + 232, y]} b={[x + 232, y + 72]} off={-22} text="" />
      <T x={x + 262} y={y + 40} s={10.5} c={C.dim} mono>depth 1.64</T>
      <Dim a={[x - 2, y]} b={[x - 2, y + 14]} off={12} text="" />
      <Lab p={[x + 60, y + 7]} t={[x + 76, y - 44]} text="lid" sub="about 0.31, implied by the example" a="middle" />
      <Lead p={[x + 216, y + 54]} t={[x + 262, y + 74]} text="spring height" sub="1.23 for the 2824" a="start" />
      <Lead p={[x + 124, y - 12]} t={[x + 196, y - 34]} text="arbor" />
      <T x={14} y={258} s={10.5} c={C.text} w="600">Measure the barrel with the spring out and clean.</T>
      <T x={14} y={273} s={10.5} c={C.dim}>Take ID at two places at right angles, away from the hook. Figures: the ETA 2824 example.</T>
    </Fig>
  )
}

// fig: bm-ms-micrometer MsMicrometer
function MsMicrometer() {
  return (
    <Fig h={286} view="Tool · reading spring thickness" scale="schematic">
      {/* frame */}
      <path d="M78 56 L78 44 Q78 28 96 28 L128 28" fill="none" stroke="none" />
      <path d="M40 84 Q40 150 110 150 Q172 150 172 112 L172 96 L188 96 L188 120 Q188 170 110 170 Q22 170 22 84 Z" fill="url(#sk-steel)" stroke={STEELD} />
      <rect x={18} y={66} width={26} height={22} fill="#8996a0" stroke={STEELD} />
      <rect x={168} y={76} width={108} height={14} fill="url(#sk-steel)" stroke={STEELD} />
      <rect x={270} y={70} width={70} height={26} fill="url(#sk-steelH)" stroke={STEELD} transform="rotate(90 305 83)" opacity="0" />
      <rect x={210} y={70} width={92} height={26} rx="2" fill="#9aa8b1" stroke={STEELD} />
      {[220, 232, 244, 256, 268, 280, 292].map((x) => <line key={x} x1={x} y1={70} x2={x} y2={96} stroke={STEELD} strokeWidth="0.8" />)}
      <rect x={302} y={74} width={22} height={18} rx="3" fill="#7e8b92" stroke={STEELD} />
      <rect x={44} y={72} width={8} height={12} fill={STEEL} stroke={STEELD} />
      <rect x={58} y={72} width={110} height={12} fill={STEEL} stroke={STEELD} />
      <rect x={52.5} y={64} width={5} height={28} fill="#5c6b74" stroke={C.brass} strokeWidth="0.8" />
      <Lead p={[55, 66]} t={[86, 42]} text="spring between the faces" s={10.5} />
      <Lab p={[286, 72]} t={[318, 44]} text="micrometer 0–25 mm" s={10.5} a="middle" />
      <Lead p={[313, 88]} t={[346, 120]} text="close on the ratchet," sub="same light pressure" s={10.5} />
      <Panel x={204} y={150} w={264} h={124} title="Three readings along a flat length" />
      <path d="M216 214 L454 214" stroke={C.struct} strokeWidth="5" />
      {[[256, 'A'], [336, 'B'], [416, 'C']].map(([x, l], i) => (
        <g key={l}>
          <line x1={x} y1={200} x2={x} y2={228} stroke={C.brass} strokeWidth="1.2" />
          <T x={x} y={196} a="middle" s={10.5} c={C.brassHi} w="700">{l}</T>
          <T x={x} y={244} a="middle" s={10.5} c={C.dim} mono>0.125</T>
        </g>
      ))}
      <T x={216} y={264} s={10.5} c={C.dim}>Readings should agree closely. Skip kinks.</T>
      <Note x={14} y={190} lines={['Thickness matters most,', 'and a micrometer beats', 'a calliper for it.', 'Height: same tool.', 'Length: use the formula', 'if you can’t uncoil it safely.']} s={10.5} lh={15} />
    </Fig>
  )
}

// fig: bm-ms-formula MsFormula
function MsFormula() {
  const row = (y, name, f, calc, res, spec, ok) => (
    <g>
      <line x1={12} y1={y - 15} x2={468} y2={y - 15} stroke={C.line} strokeWidth="0.7" />
      <T x={14} y={y} s={11.5} c={C.text} w="600">{name}</T>
      <T x={14} y={y + 15} s={10.5} c={C.brassHi} mono>{f}</T>
      <T x={186} y={y} s={10.5} c={C.dim} mono>{calc}</T>
      <T x={350} y={y} s={12} c={C.text} w="700" mono>{res}</T>
      <T x={420} y={y} s={12} c={ok ? C.emerald : C.brass} w="700" mono>{spec}</T>
    </g>
  )
  return (
    <Fig h={252} view="Chart · quick method, worked for the ETA 2824" scale="dimensions in mm">
      <Tag x={14} y={42}>Dimension</Tag>
      <Tag x={186} y={42}>With ID 11, depth 1.64</Tag>
      <Tag x={350} y={42}>Result</Tag>
      <Tag x={420} y={42}>Spec</Tag>
      {row(64, 'Thickness', 'ID ÷ 87', '11 ÷ 87', '0.126', '0.125', true)}
      {row(112, 'Length', 'ID × 35 Swiss, × 30 US', '11 × 35', '385', '400', false)}
      {row(160, 'Height', 'depth − lid − 0.1', '1.64 − 0.31 − 0.10', '1.23', '1.23', true)}
      <line x1={12} y1={190} x2={468} y2={190} stroke={C.line} strokeWidth="0.7" />
      <Note x={14} y={208} lines={['Close, not exact. A listed spec for your calibre beats the formula every time.', 'Usual mistakes: the wrong length multiplier, and forgetting the 0.1 mm clearance.', 'The 0.31 mm lid is implied by the worked example, so measure yours.']} s={10.5} lh={14} />
    </Fig>
  )
}

// fig: bm-ms-torque MsTorque
function MsTorque() {
  const bars = [
    ['0.125 mm spring, as listed', 100, C.struct, ''],
    ['5% thicker', 116, C.ruby, '+16%, by the cube rule'],
    ['360 mm long', 100, C.struct, ''],
    ['380 mm long', 95, C.brass, 'about 5% weaker than 360'],
    ['400 mm long', 90, C.brass, 'about 10% weaker than 360'],
  ]
  return (
    <Fig h={256} view="Chart · what moves the force most" scale="relative force, 100 = start">
      {bars.map(([l, v, c, n], i) => {
        const y = 42 + i * 32 + (i > 1 ? 14 : 0)
        return (
          <g key={l}>
            <T x={14} y={y + 12} s={10.5} c={C.text}>{l}</T>
            <rect x={160} y={y} width={v * 1.5} height={16} rx="2" fill={c} opacity="0.75" />
            <T x={166 + v * 1.5} y={y + 12} s={10.5} c={C.text} mono>{v}</T>
            {n && <T x={198 + v * 1.5} y={y + 12} s={10} c={C.dim}>{i === 1 ? '+16%' : n.split(' ').slice(0, 3).join(' ')}</T>}
          </g>
        )
      })}
      <Tag x={14} y={36}>Thickness</Tag>
      <Tag x={14} y={118} >Length</Tag>
      <T x={14} y={224} s={10.5} c={C.dim}>Cube rule: torque goes roughly with thickness cubed. That is reasoning from beam</T>
      <T x={14} y={238} s={10.5} c={C.dim}>theory, not a measurement. Length figures: one published page. Never match on length.</T>
    </Fig>
  )
}

function spiral(cx, cy, r0, r1, turns, ph = 0) {
  const n = Math.round(turns * 40)
  const a = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const th = ph + t * turns * 360
    a.push(pol(cx, cy, r0 + (r1 - r0) * t, th))
  }
  return pts(a)
}

// fig: bm-ms-thirds MsThirds
function MsThirds() {
  const plan = (cx, ri, ro, label) => (
    <g>
      <circle cx={cx} cy={132} r={84} fill="rgba(201,162,76,0.08)" stroke={BRASS} strokeWidth="3" />
      <polyline points={spiral(cx, 132, ro, ri, 5, 40)} fill="none" stroke={C.steel} strokeWidth="1.3" />
      <circle cx={cx} cy={132} r={28} fill={STEEL} stroke={STEELD} />
      <rect x={cx - 6} y={126} width={12} height={12} fill={STEELD} />
      <T x={cx} y={240} a="middle" s={11} c={C.text} w="600">{label}</T>
    </g>
  )
  return (
    <Fig h={296} view="Plan · how full should it be?" scale="schematic, spring at rest">
      {plan(120, 56, 82, 'De Carle: thirds')}
      <Dim a={[36, 132]} b={[64, 132]} text="" />
      <Dim a={[64, 132]} b={[92, 132]} text="" />
      <Lab p={[176, 74]} t={[218, 44]} text="spring" s={10.5} a="middle" />
      <Lab p={[150, 132]} t={[218, 132]} text="space" s={10.5} a="middle" />
      <Lab p={[120, 120]} t={[60, 44]} text="arbor" s={10.5} a="middle" />
      {plan(360, 58, 82, 'Daniels: half')}
      <Lab p={[420, 80]} t={[448, 44]} text="spring" s={10.5} a="middle" />
      <Lab p={[392, 150]} t={[452, 216]} text="space" s={10.5} a="middle" />
      <T x={240} y={262} a="middle" s={10.5} c={C.text}>De Carle: arbor, spring and space, a third each. Daniels: the spring fills half the gap.</T>
      <T x={240} y={278} a="middle" s={10.5} c={C.dim}>Data for 11 mm barrels: fill 43 to 65%, mean about 55%, at about 0.13 × 360 mm.</T>
    </Fig>
  )
}

// fig: bm-ms-conflict MsConflict
function MsConflict() {
  return (
    <Fig h={262} view="Comparison · steel to alloy" scale="both shown, neither a rule">
      <Panel x={12} y={28} w={222} h={154} title="Published page" tc={C.steel} />
      <Note x={24} y={62} lines={['Alloy springs are made', 'interchangeable with carbon steel.', 'Don’t fit one thinner just', 'because it seems stiffer.']} s={11} lh={16} c={C.text} />
      <T x={24} y={140} s={10.5} c={C.dim}>Same thickness as the steel spring</T>
      <rect x={24} y={150} width={198} height={6} fill={C.steel} />
      <T x={24} y={174} s={10} c={C.faint} >Vintage Watch Straps</T>
      <Panel x={246} y={28} w={222} h={154} title="Forum posters" tc={C.brass} />
      <Note x={258} y={62} lines={['Drop half to one strength', 'when moving from blued steel', 'to alloy.', '']} s={11} lh={16} c={C.text} />
      <T x={258} y={140} s={10.5} c={C.dim}>Slightly thinner than the steel spring</T>
      <rect x={258} y={150.5} width={198} height={5} fill={C.brass} />
      <T x={258} y={174} s={10} c={C.faint}>WatchRepairTalk, via search summary</T>
      <Note x={14} y={204} lines={['No maker’s data settles this, so this app gives no rule. Let the watch decide.', 'Fit your choice, wind fully, read amplitude dial up, then check reserve and listen.', 'Knocking: one guide warns from about 315°, Witschi says 330°. Log what you fitted.']} s={11} lh={16} />
    </Fig>
  )
}

// fig: bm-ms-faults MsFaults
function MsFaults() {
  const r = [
    ['Too strong', 'thicker than the barrel wants', 'knocking, possible damage', 'amplitude high, listen for the knock'],
    ['Too weak', 'thinner than needed', 'low amplitude', 'read dial up at full wind'],
    ['Too short', 'not enough turns', 'short reserve, rate affected', 'time a full run-down'],
    ['Too wide', 'height over the limit', 'rubs on lid or floor', 'check lid and endshake'],
    ['Too narrow', 'height well under', 'can twist in the barrel', 'look at the coils with lid off'],
  ]
  return (
    <Fig h={250} view="Chart · what a wrong spring does" scale="">
      <Rows x={14} y={38} cols={[0, 76, 228, 340]} head={['Spring', 'Why', 'Symptom', 'Test']} lh={32} s={10} rows={[]} />
      {r.map(([a, b, c2, d], i) => {
        const y = 62 + i * 33
        return (
          <g key={a}>
            <line x1={12} y1={y - 16} x2={468} y2={y - 16} stroke={C.line} strokeWidth="0.6" />
            <T x={14} y={y} s={11} c={C.text} w="600">{a}</T>
            <T x={90} y={y} s={10.5} c={C.dim}>{b.split(' ').slice(0, 3).join(' ')}</T>
            <T x={90} y={y + 12} s={10.5} c={C.dim}>{b.split(' ').slice(3).join(' ')}</T>
            <T x={242} y={y} s={10.5} c={C.ruby}>{c2.split(', ')[0]}</T>
            {c2.includes(', ') && <T x={242} y={y + 12} s={10.5} c={C.ruby}>{c2.split(', ')[1]}</T>}
            <T x={354} y={y} s={10.5} c={C.brassHi}>{d.split(' ').slice(0, 3).join(' ')}</T>
            <T x={354} y={y + 12} s={10.5} c={C.brassHi}>{d.split(' ').slice(3).join(' ')}</T>
          </g>
        )
      })}
    </Fig>
  )
}

// fig: bm-ms-endshake MsEndshake
function MsEndshake() {
  const arbor = (cx, y) => <rect x={cx - 7} y={y} width={14} height={92} fill={STEEL} stroke={STEELD} />
  return (
    <Fig h={306} view="Section · barrel endshake" scale="shake exaggerated">
      <Panel x={12} y={28} w={148} h={190} title="Right" ok={true} />
      <BarrelSection x={32} y={100} w={108} h={38} lid={7} />
      {arbor(86, 72)}
      <Arrow a={[86, 62]} b={[86, 70]} c="brass" w={1.4} />
      <Arrow a={[86, 174]} b={[86, 166]} c="brass" w={1.4} />
      <T x={86} y={190} a="middle" s={10.5} c={C.text}>lid flush, a small visible</T>
      <T x={86} y={204} a="middle" s={10.5} c={C.text}>shake on the arbor</T>
      <Panel x={166} y={28} w={148} h={190} title="Coil proud" ok={false} />
      <BarrelSection x={186} y={100} w={108} h={38} lid={7} proud />
      {arbor(240, 72)}
      <T x={240} y={190} a="middle" s={10.5} c={C.text}>lid won’t seat: open it,</T>
      <T x={240} y={204} a="middle" s={10.5} c={C.text}>re-seat the outer coil</T>
      <Panel x={320} y={28} w={148} h={190} title="Domed lid" ok={false} />
      <BarrelSection x={340} y={100} w={108} h={38} lid={7} dome />
      {arbor(394, 72)}
      <T x={394} y={190} a="middle" s={10.5} c={C.text}>dished when opened, eats</T>
      <T x={394} y={204} a="middle" s={10.5} c={C.text}>the shake: fix or replace</T>
      <Note x={14} y={238} lines={['Test: hold the arbor ends in the inside of your tweezers. Push one end, then the other.', 'In the movement: bridge down, lift the barrel with pegwood. It must rise a hair.', 'We hold no published figure. Use your sheet, or judge that the play is present and small.', 'If it still drags, replace the lid or the barrel. Evidence here is forum level.']} s={10.5} lh={15} />
    </Fig>
  )
}

// fig: bm-ms-wall MsWall
function MsWall() {
  const cx = 110
  const cy = 136
  return (
    <Fig h={286} view="Plan · automatic barrel wall" scale="schematic">
      <circle cx={cx} cy={cy} r={84} fill="none" stroke={LUB.brake} strokeWidth="8" opacity="0.45" />
      <circle cx={cx} cy={cy} r={90} fill="none" stroke={BRASS} strokeWidth="4" />
      <polyline points={spiral(cx, cy, 79, 40, 6, 20)} fill="none" stroke={C.steel} strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r={22} fill={STEEL} stroke={STEELD} />
      <Arrow d={`M${cx - 58} ${cy - 62} A85 85 0 0 1 ${cx + 8} ${cy - 88}`} c="brass" w={1.8} />
      <T x={cx - 6} y={40} a="middle" s={10.5} c={C.brassHi}>spring slips along the wall</T>
      <Lead p={[cx + 60, cy + 58]} t={[224, 232]} text="braking grease on the wall" s={10.5} c={LUB.brake} />
      <Panel x={226} y={30} w={242} h={106} title="Too little or too much" />
      <Rows x={238} y={66} cols={[0, 74]} lh={18} s={10.5} rows={[
        ['Too little', 'slips early'],
        ['Right', 'holds, slips near full wind'],
        ['Too much', 'can over-wind'],
      ]} />
      <T x={238} y={128} s={10} c={C.faint}>Our reasoning. No measured figures exist.</T>
      <Panel x={226} y={144} w={242} h={76} title="Which grease" />
      <Note x={238} y={174} lines={['Moebius: 8213 brass, 8212 aluminium, or 8217.', 'Forum standards: 8217 and Kluber P125.', 'Hand-wind grease 8200 is not for this wall.']} s={10} lh={14} c={C.text} />
      <T x={14} y={258} s={10.5} c={C.dim}>Forum view: P125 can brake too strongly, and 8217 tends to give lower amplitude.</T>
      <T x={14} y={273} s={10.5} c={C.dim}>Some barrels stay shut: Sellita’s chart says don’t clean the SW500 RDM+ barrel.</T>
    </Fig>
  )
}

/* ================================================================== */
/* Fitting hands                                                        */
/* ================================================================== */
function Dial({ cx, cy, r, date, hour = 0, min = 0, sec, marks = 12 }) {
  const ticks = []
  for (let i = 0; i < marks; i++) {
    const [a, b] = [pol(cx, cy, r - 2, 90 - i * (360 / marks)), pol(cx, cy, r - (i % 3 === 0 ? 10 : 6), 90 - i * (360 / marks))]
    ticks.push(<line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="#3a332b" strokeWidth={i % 3 === 0 ? 2 : 1} />)
  }
  const hand = (deg, len, w, c) => {
    const tip = pol(cx, cy, len, 90 - deg)
    return <line x1={cx} y1={cy} x2={tip[0]} y2={tip[1]} stroke={c} strokeWidth={w} strokeLinecap="round" />
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#e9dfca" stroke={C.struct} strokeWidth="1.2" />
      {ticks}
      {date !== undefined && (
        <g>
          <rect x={cx + r * 0.52} y={cy - 7} width={18} height={14} fill="#fff" stroke="#3a332b" strokeWidth="0.8" />
          <text x={cx + r * 0.52 + 9} y={cy + 4} textAnchor="middle" fontSize="10.5" fill="#1a1612" fontFamily="var(--font-mono)">{date}</text>
        </g>
      )}
      {hour !== null && hand(hour, r * 0.5, 3.4, '#2c2620')}
      {min !== null && hand(min, r * 0.76, 2.4, '#2c2620')}
      {sec !== undefined && hand(sec, r * 0.84, 1, C.ruby)}
      <circle cx={cx} cy={cy} r={3} fill="#2c2620" />
    </g>
  )
}

// fig: bm-hand-holes HandHoles
function HandHoles() {
  return (
    <Fig h={300} view="Section · the three posts" scale="schematic">
      <rect x={60} y={196} width={150} height={10} fill="#e9dfca" stroke={C.struct} />
      <rect x={118} y={176} width={34} height={20} fill={BRASS} stroke={BRASSD} />
      <rect x={124} y={132} width={22} height={64} fill={BRASSD} stroke={BRASS} />
      <rect x={131.5} y={84} width={7} height={112} fill={STEEL} stroke={STEELD} />
      <rect x={96} y={168} width={76} height={3} fill={STEEL} />
      <rect x={96} y={126} width={76} height={3} fill={STEEL} />
      <rect x={100} y={92} width={70} height={2} fill={C.ruby} />
      <Lead p={[120, 186]} t={[92, 168]} text="hour post" sub="hour wheel" s={10.5} a="end" />
      <Lead p={[126, 142]} t={[92, 126]} text="minute post" sub="cannon pinion" s={10.5} a="end" />
      <Lead p={[133, 104]} t={[92, 88]} text="seconds post" s={10.5} a="end" />
      <Lead p={[160, 169]} t={[196, 170]} text="hour" s={10.5} />
      <Lead p={[160, 127]} t={[196, 128]} text="minute" s={10.5} />
      <Lead p={[160, 93]} t={[196, 86]} text="seconds" s={10.5} c={C.ruby} />
      <T x={135} y={222} a="middle" s={10.5} c={C.dim}>dial</T>
      <Panel x={244} y={30} w={224} h={196} title="Hour / minute / seconds" />
      <Rows x={254} y={64} cols={[0, 94]} lh={16} s={10.5} rows={[
        ['Ronda 1062', '1.20 / 0.70 / 0.20 mm'],
      ]} />
      <T x={254} y={78} s={10} c={C.emerald}>maker’s sheet</T>
      <Rows x={254} y={100} cols={[0, 94]} lh={16} s={10.5} rows={[
        ['NH35', '1.50 / 0.90 / 0.21'],
        ['ETA 2824', '1.50 / 0.90 / 0.25'],
        ['Miyota', '1.52 / 1.00 / 0.17'],
      ]} />
      <T x={254} y={146} s={10} c={C.brass}>one forum post, read as mm: a guide only</T>
      <Rows x={254} y={168} cols={[0, 94]} lh={16} s={10.5} rows={[
        ['Stock pairs', '0.90 × 1.50 mm'],
        ['Stock seconds', '0.17 to 0.25 mm'],
      ]} />
      <T x={254} y={214} s={10} c={C.dim}>supplier listings</T>
      <Note x={14} y={248} lines={['Try each hand on its post first: it should start straight, then need pressure.', 'Drops on loose, or won’t start? Don’t force it. Fix the hole first (see below).', 'Per the same post, Seiko hands fit ETA except the seconds hand, and don’t fit Miyota.']} s={10.5} lh={15} />
    </Fig>
  )
}

// fig: bm-hand-press HandPress
function HandPress() {
  return (
    <Fig h={312} view="Section · pressing on a hand" scale="schematic">
      {/* holder */}
      <rect x={30} y={212} width={190} height={14} fill="url(#sk-bench)" stroke={C.struct} />
      <rect x={110} y={186} width={30} height={26} fill={STEELD} stroke={STEEL} />
      <rect x={52} y={168} width={146} height={18} fill={BRASSD} stroke={BRASS} />
      <rect x={52} y={160} width={146} height={8} fill="#e9dfca" stroke={C.struct} />
      <rect x={118} y={126} width={14} height={42} fill={STEEL} stroke={STEELD} />
      <rect x={70} y={130} width={110} height={3} fill={STEEL} />
      <rect x={116} y={126} width={18} height={9} fill={STEELD} stroke={STEEL} strokeWidth="0.7" />
      {/* pusher */}
      <path d="M108 124 L112 124 L112 54 L138 54 L138 124 L142 124 L142 120 L140 76 L140 50 L110 50 L110 76 L108 120 Z" fill="url(#sk-steelH)" stroke={STEELD} strokeWidth="0.6" />
      <rect x={106} y={46} width={38} height={8} rx="2" fill="#7e8b92" />
      <Arrow a={[125, 26]} b={[125, 44]} c="brass" w={2} />
      <Lead p={[140, 90]} t={[176, 72]} text="hollow pusher" sub="bears on the boss, not the blade" s={10.5} />
      <Lead p={[172, 131]} t={[214, 124]} text="hand" s={10.5} />
      <Lead p={[192, 164]} t={[232, 158]} text="dial" s={10.5} />
      <Lead p={[132, 198]} t={[232, 196]} text="support under the post" s={10.5} sub="so the load doesn’t reach the pivot" />
      <Panel x={244} y={224} w={224} h={78} title="Published press limits" />
      <Rows x={254} y={256} cols={[0, 100]} lh={14} s={10} rows={[
        ['Ronda 1062', '25 N'],
        ['Ronda 509', '40 N h, m · 30 N s'],
        ['Seiko VD53B', '< 5 kg · chrono < 3 kg'],
      ]} />
      <Note x={14} y={246} lines={['25 N is about the weight of', '2.5 kg. These limits are for', 'those quartz calibres only.', 'Press straight. Firm, never a shove.']} s={10.5} lh={14} />
    </Fig>
  )
}

// fig: bm-hand-index HandIndex
function HandIndex() {
  return (
    <Fig h={300} view="Sequence · index hands to the date" scale="schematic">
      {[
        [12, 1, 'Find midnight', ['Advance until the date', 'has just finished changing.'], <Dial key="a" cx={84} cy={118} r={50} date={15} hour={null} min={null} />],
        [168, 2, 'Fit the hour hand', ['Exactly on 12, without', 'moving the works.'], <Dial key="b" cx={240} cy={118} r={50} date={15} hour={0} min={null} />],
        [324, 3, 'Fit the minute hand', ['Exactly on 12, then', 'the seconds hand.'], <Dial key="c" cx={396} cy={118} r={50} date={15} hour={0} min={0} sec={0} />],
      ].map(([x, n, t, l, d]) => (
        <g key={n}>
          <Panel x={x} y={28} w={144} h={174} />
          <Num x={x + 15} y={46} n={n} r={8} />
          <T x={x + 30} y={50} s={11} c={C.text} w="600">{t}</T>
          {d}
          <T x={x + 72} y={182} a="middle" s={10} c={C.dim}>{l[0]}</T>
          <T x={x + 72} y={195} a="middle" s={10} c={C.dim}>{l[1]}</T>
        </g>
      ))}
      <Panel x={12} y={210} w={456} h={78} title="Test" />
      <Note x={24} y={242} lines={['Turn forward 24 hours: the date should finish changing at or close to 12.', 'Well before or after 12? Lift the hands and repeat. If the date creeps first,', 'as reported on the 2824-2, use the finished change.']} s={10.5} lh={14} />
    </Fig>
  )
}

// fig: bm-hand-sweep HandSweep
function HandSweep() {
  const side = (y, tilt, ok, label) => (
    <g>
      <rect x={250} y={y + 28} width={200} height={6} fill="#e9dfca" stroke={C.struct} />
      <rect x={342} y={y + 2} width={8} height={26} fill={STEELD} />
      <g transform={`rotate(${tilt} 346 ${y + 18})`}><rect x={276} y={y + 17} width={130} height={2.4} fill={STEEL} /></g>
      <g transform={`rotate(${-tilt * 0.3} 346 ${y + 10})`}><rect x={262} y={y + 9} width={170} height={2} fill={STEEL} /></g>
      <Verdict x={462} y={y + 16} ok={ok} r={7} />
      <T x={250} y={y + 48} s={10.5} c={C.dim}>{label}</T>
    </g>
  )
  return (
    <Fig h={262} view="Plan and side view · a full turn" scale="schematic">
      <Dial cx={110} cy={124} r={84} hour={30} min={0} sec={180} />
      {[[0, 12], [90, 3], [180, 6], [270, 9]].map(([deg, n]) => {
        const p = pol(110, 124, 62, 90 - deg)
        return <Num key={n} x={p[0]} y={p[1]} n={n} r={9} />
      })}
      <Arrow d="M192 62 A100 100 0 0 1 208 150" c="brass" w={1.6} />
      <T x={110} y={224} a="middle" s={10.5} c={C.text}>Stop and sight across at 12, 3, 6, 9</T>
      {side(34, 0, true, 'parallel to the dial and to each other')}
      {side(100, 3.2, false, 'tilted: not fully down, or the blade bent')}
      <Panel x={236} y={168} w={232} h={66} />
      <Note x={246} y={186} lines={['Watch every crossing through 12 hours.', 'Reseat a hand before you think of bending it.', 'ETA keeps hand heights on other drawings.']} s={10} lh={14} c={C.text} />
      <T x={14} y={252} s={10} c={C.faint}>We hold no hand-height figures, so check by eye, then again in the case.</T>
    </Fig>
  )
}

// fig: bm-hand-loose HandLoose
function HandLoose() {
  return (
    <Fig h={298} view="Detail · loose and tight holes" scale="forum methods, schematic">
      <Panel x={12} y={28} w={224} h={190} title="Too loose: peen on a stake" />
      <rect x={50} y={150} width={148} height={30} fill="url(#sk-steel)" stroke={STEELD} />
      <rect x={118} y={150} width={12} height={30} fill={C.ground} />
      <rect x={60} y={141} width={128} height={9} fill={STEEL} stroke={STEELD} />
      <rect x={120} y={141} width={8} height={9} fill={C.ground} />
      <path d="M116 138 L118 96 L130 96 L132 138 Z" fill="url(#sk-steelH)" stroke={STEELD} />
      <Arrow a={[124, 62]} b={[124, 90]} c="brass" w={1.8} />
      <Lab p={[158, 146]} t={[186, 112]} text="hand, face down" s={10.5} a="middle" />
      <Lab p={[160, 165]} t={[150, 198]} text="staking plate" s={10.5} a="middle" />
      <T x={30} y={78} s={10.5} c={C.dim}>rounded punch,</T>
      <T x={30} y={92} s={10.5} c={C.dim}>a light tap</T>
      <Panel x={244} y={28} w={224} h={190} title="Too tight: smoothing broach" />
      <path d="M356 54 L352 154 L360 154 Z" transform="rotate(180 356 104)" fill="url(#sk-steelH)" stroke={STEELD} />
      <rect x={272} y={128} width={68} height={7} fill={STEEL} stroke={STEELD} />
      <rect x={372} y={128} width={68} height={7} fill={STEEL} stroke={STEELD} />
      <Arrow d="M334 106 a22 7 0 1 0 44 0" c="brass" w={1.4} />
      <T x={356} y={176} a="middle" s={10.5} c={C.text}>a turn or two, then try it</T>
      <T x={356} y={190} a="middle" s={10.5} c={C.text}>on the post. Stop early.</T>
      <Verdict x={26} y={240} ok={false} r={9} />
      <T x={42} y={244} s={11} c={C.text}>Glue: most posters advise against it.</T>
      <Note x={14} y={268} lines={['Check: the hand needs pressure to seat, and holds when you set the time both ways.', 'A tube can be crimped instead, carefully. Wrong size? Order the right hand.']} s={10.5} lh={14} />
    </Fig>
  )
}

// fig: bm-hand-chrono HandChrono
function HandChrono() {
  const hc = [354, 126]
  return (
    <Fig h={308} view="Plan · fit at zero, reset held" scale="schematic">
      <Dial cx={110} cy={126} r={86} hour={null} min={null} sec={0} />
      <circle cx={110} cy={174} r={24} fill="rgba(0,0,0,0.05)" stroke="#6b6155" />
      <line x1={110} y1={174} x2={110} y2={156} stroke="#2c2620" strokeWidth="1.6" />
      <rect x={196} y={62} width={12} height={16} fill={C.struct} />
      <rect x={196} y={172} width={12} height={16} fill={C.brass} />
      <Lead p={[204, 188]} t={[246, 228]} text="reset, held down" s={10.5} c={C.brassHi} a="end" />
      <Arrow a={[226, 180]} b={[212, 180]} c="brass" w={2} />
      <Lead p={[110, 66]} t={[144, 28]} text="seconds hand on zero" s={10.5} a="start" />
      <Lab p={[110, 164]} t={[62, 214]} text="counter hand on zero" s={10.5} a="middle" />
      <Panel x={252} y={28} w={216} h={190} title="Under the dial" />
      <path transform={`rotate(180 ${hc[0]} ${hc[1]})`} d={`M${hc[0] - 22} ${hc[1] + 2} C${hc[0] - 30} ${hc[1] - 34} ${hc[0] - 4} ${hc[1] - 34} ${hc[0]} ${hc[1] - 18} C${hc[0] + 4} ${hc[1] - 34} ${hc[0] + 30} ${hc[1] - 34} ${hc[0] + 22} ${hc[1] + 2} C${hc[0] + 14} ${hc[1] + 24} ${hc[0] + 4} ${hc[1] + 32} ${hc[0]} ${hc[1] + 38} C${hc[0] - 4} ${hc[1] + 32} ${hc[0] - 14} ${hc[1] + 24} ${hc[0] - 22} ${hc[1] + 2} Z`} fill={STEEL} stroke={STEELD} />
      <circle cx={hc[0]} cy={hc[1]} r={3.6} fill={C.ground} />
      <rect x={hc[0] - 52} y={hc[1] + 32} width={104} height={24} rx="2" fill={BRASSD} stroke={BRASS} />
      <Arrow a={[hc[0] + 40, hc[1] + 80]} b={[hc[0] + 40, hc[1] + 59]} c="brass" w={1.8} />
      <Lab p={[hc[0] + 12, hc[1] - 18]} t={[hc[0] + 58, hc[1] - 56]} text="heart cam" s={10.5} a="middle" />
      <Lab p={[hc[0] - 30, hc[1] + 46]} t={[hc[0] - 72, hc[1] - 4]} text="hammer" s={10.5} a="middle" />
      <T x={hc[0] - 10} y={hc[1] + 76} a="middle" s={10} c={C.dim}>flat face turns the</T>
      <T x={hc[0] - 10} y={hc[1] + 88} a="middle" s={10} c={C.dim}>heart to its low side</T>
      <Rows x={14} y={246} cols={[0, 18, 216, 234]} s={10.5} lh={15} first={C.brass} c={C.text} rows={[
        ['1', 'Start the chronograph, then stop it', '3', 'Line the hand up with zero, press it on'],
        ['2', 'Press and hold reset', '4', 'Let go, then run, stop, reset several times'],
      ]} />
      <T x={14} y={290} s={10.5} c={C.dim}>Too much force can shift the lower jewel. Too little and the hand drifts at reset.</T>
    </Fig>
  )
}

// fig: bm-hand-chronofault HandChronoFault
function HandChronoFault() {
  return (
    <Fig h={262} view="Comparison · two reset faults" scale="forum diagnosis">
      <Panel x={12} y={28} w={222} h={172} title="Never reaches zero" tc={C.ruby} />
      <Dial cx={123} cy={104} r={44} hour={null} min={null} sec={14} />
      <T x={123} y={166} a="middle" s={10.5} c={C.text}>same wrong spot after every reset</T>
      <T x={123} y={182} a="middle" s={11} c={C.brassHi} w="600">Lift the hand and refit at zero</T>
      <Panel x={246} y={28} w={222} h={172} title="Moves off when you let go" tc={C.ruby} />
      <Dial cx={357} cy={104} r={44} hour={null} min={null} sec={0} />
      <Arrow d="M372 62 A44 44 0 0 1 388 76" c="ruby" w={1.6} />
      <T x={357} y={166} a="middle" s={10.5} c={C.text}>on zero only while reset is held</T>
      <T x={357} y={182} a="middle" s={11} c={C.brassHi} w="600">Not a hand fault: don’t just refit</T>
      <Note x={14} y={220} lines={['Second case: look at the hammer and heart in Servicing a chronograph.', 'Quartz chronographs differ: many have a correction mode, so read your module’s sheet.']} s={10.5} lh={15} />
    </Fig>
  )
}

// fig: bm-hand-drill HandDrill
function HandDrill() {
  const crit = ['No dial mark', 'Hands flat', 'Blades straight', 'No touch, 12 h', 'Date at 12']
  return (
    <Fig h={270} view="Score sheet · ten refits" scale="scrap movement and dial">
      <Tag x={14} y={42}>Round</Tag>
      {Array.from({ length: 10 }, (_, i) => <T key={i} x={134 + i * 33} y={42} a="middle" s={11} c={C.dim} mono>{i + 1}</T>)}
      {crit.map((c, j) => (
        <g key={c}>
          <T x={14} y={66 + j * 24} s={11} c={j === 0 ? C.brassHi : C.text}>{c}</T>
          {Array.from({ length: 10 }, (_, i) => {
            const miss = (j === 0 && i === 1) || (j === 2 && i === 3)
            const blank = i > 7
            return (
              <g key={i}>
                <rect x={122 + i * 33} y={54 + j * 24} width={24} height={18} rx="3" fill="rgba(255,255,255,0.03)" stroke={C.line} />
                {!blank && <T x={134 + i * 33} y={67 + j * 24} a="middle" s={12} c={miss ? C.ruby : C.emerald} w="700">{miss ? '✗' : '✓'}</T>}
              </g>
            )
          })}
        </g>
      ))}
      <Note x={14} y={198} lines={['One dial mark fails the round. It’s the mark an owner would see, so it weighs most.', 'Pass: ten rounds in a row, all ticked. Any miss: find the cause and start the count again.', 'Log the result in your Practice Log. Repeat it after about 30 days to see if the skill held.']} s={10.5} lh={15} />
      <T x={14} y={256} s={10} c={C.faint}>Example shown part-way through. The 30-day re-test is the app’s suggestion.</T>
    </Fig>
  )
}

/* ================================================================== */
/* Dressing a screwdriver & tool care                                   */
/* ================================================================== */
// Screw head in section, slot open at the top. (cx, y) = top centre of the slot.
function SlotSection({ cx, y, w = 24, d = 36 }) {
  return (
    <g>
      <path d={`M${cx - 44} ${y} L${cx - w / 2} ${y} L${cx - w / 2} ${y + d} L${cx + w / 2} ${y + d} L${cx + w / 2} ${y} L${cx + 44} ${y} L${cx + 44} ${y + d + 24} L${cx - 44} ${y + d + 24} Z`} fill={STEELD} stroke={STEEL} strokeWidth="0.8" />
    </g>
  )
}

// fig: bm-drv-profile DrvProfile
function DrvProfile() {
  const blades = [
    ['A', 'steep', false, 'M-28 -96 L28 -96 L12 2 L-12 2 Z', 2, ['rides up out of the slot,', 'bruises the slot edges']],
    ['B', 'sharp', false, 'M-21 -96 L21 -96 L1.5 30 L-1.5 30 Z', 0, ['right angle, weak point:', 'corners break or twist']],
    ['C', 'good', true, 'M-21 -96 L21 -96 L11 31 L-11 31 Z', 0, ['suitable angle, nearly', 'touches the slot bottom']],
    ['D', 'hollow', true, 'M-21 -96 Q-12 -30 -11.5 0 L-11.5 33 L11.5 33 L11.5 0 Q12 -30 21 -96 Z', 0, ['fills the slot: needs', 'very little pressure']],
  ]
  return (
    <Fig h={306} view="Section · blade in a slot" scale="after the BHI’s description">
      {blades.map(([l, t, ok, d, up, n], i) => {
        const x = 12 + i * 115
        const cx = x + 55
        return (
          <g key={l}>
            <Panel x={x} y={28} w={110} h={226} title={`${l} · ${t}`} ok={ok} />
            <SlotSection cx={cx} y={150} />
            <g transform={`translate(${cx} 150)`}><path d={d} fill="url(#sk-steelH)" stroke={STEEL} strokeWidth="0.7" /></g>
            {l === 'A' && (
              <g>
                <circle cx={cx - 12} cy={150} r={3.4} fill="none" stroke={C.ruby} strokeWidth="1.4" />
                <circle cx={cx + 12} cy={150} r={3.4} fill="none" stroke={C.ruby} strokeWidth="1.4" />
                <Arrow a={[cx + 34, 142]} b={[cx + 34, 118]} c="ruby" w={1.6} />
              </g>
            )}
            {l === 'B' && <circle cx={cx} cy={180} r={7} fill="none" stroke={C.ruby} strokeWidth="1.4" />}
            <T x={cx} y={228} a="middle" s={10} c={C.text}>{n[0]}</T>
            <T x={cx} y={241} a="middle" s={10} c={C.text}>{n[1]}</T>
          </g>
        )
      })}
      <T x={14} y={272} s={10.5} c={C.dim}>Hollow grinding needs a curved stone or a special tool. Blade C is a fine start.</T>
      <T x={14} y={288} s={10.5} c={C.dim}>No single angle is published, so match the blade to your slot, not to a number.</T>
    </Fig>
  )
}

// fig: bm-drv-fit DrvFit
function DrvFit() {
  const head = (cx, cy, bw, bt, ok, title, a, b) => {
    const x = cx - 74
    return (
      <g>
        <Panel x={x} y={28} w={148} h={164} title={title} ok={ok} />
        <rect x={x + 8} y={50} width={132} height={90} fill={BRASSD} opacity="0.45" />
        <circle cx={cx} cy={cy} r={32} fill={STEELD} stroke={STEEL} />
        <rect x={cx - 32} y={cy - 6} width={64} height={12} fill={C.ground} />
        <rect x={cx - bw / 2} y={cy - bt / 2} width={bw} height={bt} rx="0.5" fill={C.brass} stroke={C.brassHi} strokeWidth="0.6" />
        <T x={cx} y={162} a="middle" s={10.5} c={C.text}>{a}</T>
        <T x={cx} y={176} a="middle" s={10.5} c={C.text}>{b}</T>
      </g>
    )
  }
  return (
    <Fig h={258} view="Plan · blade seen in the slot" scale="schematic">
      {head(86, 95, 90, 11, false, 'Too wide', 'blade passes the head', 'and scrapes the plate')}
      {head(240, 95, 28, 11, false, 'Too narrow', 'pressure on a small area', 'marks the slot')}
      {head(394, 95, 62, 11, true, 'Right', 'fills the slot, ends', 'stop short of the plate')}
      <path d="M130 88 l10 12 M126 92 l8 11" stroke={C.ruby} strokeWidth="1.4" />
      <Legend x={14} y={208} items={[[C.brass, 'blade tip'], [STEELD, 'screw head'], [BRASSD, 'plate']]} />
      <T x={14} y={230} s={10.5} c={C.dim}>Check: no rocking. Bergeon’s blades run from 0.50 to 3.00 mm, so a size usually fits.</T>
      <T x={14} y={245} s={10.5} c={C.dim}>Many watchmakers keep more than one set for different slot widths.</T>
    </Fig>
  )
}

// fig: bm-drv-worn DrvWorn
function DrvWorn() {
  const tips = [
    ['Rounded', 'M-18 -60 L18 -60 L18 -12 Q18 0 8 0 L-8 0 Q-18 0 -18 -12 Z', 'square it', C.brassHi],
    ['Chipped', 'M-18 -60 L18 -60 L18 0 L6 0 L2 -9 L-6 -5 L-10 0 L-18 0 Z', 'grind past the chip', C.brassHi],
    ['Twisted', 'M-18 -60 L18 -60 L22 -2 L-14 4 Z', 'fit a new blade', C.ruby],
    ['Sound', 'M-18 -60 L18 -60 L18 0 L-18 0 Z', 'leave it alone', C.emerald],
  ]
  return (
    <Fig h={204} view="Detail · reading a tip at 10×" scale="front view, schematic">
      {tips.map(([t, d, a, c], i) => {
        const x = 12 + i * 115
        const cx = x + 55
        return (
          <g key={t}>
            <Panel x={x} y={28} w={110} h={134} title={t} />
            <g transform={`translate(${cx} 124)`}><path d={d} fill="url(#sk-steelH)" stroke={STEEL} strokeWidth="0.8" /></g>
            <T x={cx} y={150} a="middle" s={10.5} c={c}>{a}</T>
          </g>
        )
      })}
      <T x={14} y={182} s={10.5} c={C.dim}>Worn tips ride out of screw heads and skid across the work, so catch them early.</T>
      <T x={14} y={196} s={10.5} c={C.dim}>Spare blades are sold for most good screwdrivers.</T>
    </Fig>
  )
}

function StoneBlock({ x, y, w = 200, h = 26, c = '#6d6a5e', label }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="2" fill={c} stroke="#958f7c" />
      <rect x={x - 8} y={y + h} width={w + 16} height={8} fill="url(#sk-wood)" />
      {label && <T x={x + w / 2} y={y + h / 2 + 4} a="middle" s={10.5} c={C.text}>{label}</T>}
    </g>
  )
}

// fig: bm-drv-square DrvSquare
function DrvSquare() {
  return (
    <Fig h={272} view="Side view · squaring the end" scale="schematic">
      <StoneBlock x={24} y={184} w={230} label="medium India stone" />
      <Driver x={140} y={184} k={1.1} />
      <Arrow a={[172, 164]} b={[226, 164]} c="brass" w={1.6} both />
      <T x={200} y={154} a="middle" s={10.5} c={C.dim}>light strokes</T>
      <Lab p={[136, 70]} t={[72, 58]} text="driver upright" s={10.5} />
      <Panel x={274} y={28} w={194} h={106} title="Before and after" />
      <g transform="translate(322 118)"><path d="M-14 -56 L14 -56 L14 -10 Q14 0 6 0 L-6 0 Q-14 0 -14 -10 Z" fill="url(#sk-steelH)" stroke={STEEL} /></g>
      <Arrow a={[350, 90]} b={[382, 90]} c="brass" w={1.4} />
      <g transform="translate(416 118)"><path d="M-14 -56 L14 -56 L14 0 L-14 0 Z" fill="url(#sk-steelH)" stroke={STEEL} /></g>
      <Panel x={274} y={142} w={194} h={76} title="Check at 10×" />
      <Verdict x={290} y={176} ok={true} r={7} />
      <T x={304} y={180} s={10.5} c={C.text}>straight, square to the sides</T>
      <Verdict x={290} y={200} ok={false} r={7} />
      <T x={304} y={204} s={10.5} c={C.text}>skewed: you tilted the driver</T>
      <T x={14} y={240} s={10.5} c={C.dim}>India reshapes. Arkansas is slow to remove metal, so keep it for finishing.</T>
      <T x={14} y={255} s={10.5} c={C.ruby}>A holder makes this easier. No bench grinder: the heat tends to soften the metal.</T>
    </Fig>
  )
}

// fig: bm-drv-faces DrvFaces
function DrvFaces() {
  return (
    <Fig h={286} view="Side view and end view · forming the faces" scale="schematic">
      <StoneBlock x={24} y={196} w={220} label="India stone" />
      <g transform="translate(120 196) rotate(-68)">
        <rect x="-2" y="-5" width="104" height="9" fill="url(#sk-steelH)" stroke={STEELD} />
      </g>
      <rect x={152} y={66} width={34} height={30} rx="3" fill={BRASSD} stroke={BRASS} transform="rotate(22 169 81)" />
      <circle cx={214} cy={182} r={12} fill="none" stroke={C.struct} strokeWidth="2" />
      <line x1={178} y1={92} x2={214} y2={182} stroke={C.struct} strokeWidth="3" />
      <Lead p={[166, 76]} t={[214, 52]} text="holder" s={10.5} />
      <Lead p={[219, 174]} t={[252, 150]} text="wheel" s={10.5} a="end" />
      <Lab p={[132, 160]} t={[72, 128]} text="face flat on the stone" s={10.5} />
      <Arrow a={[60, 172]} b={[108, 172]} c="brass" w={1.5} both />
      <Panel x={276} y={28} w={192} h={120} title="End view of the tip" />
      <path d="M340 62 L396 62 L374 128 L362 128 Z" fill="url(#sk-steelH)" stroke={STEEL} />
      <line x1={368} y1={52} x2={368} y2={140} stroke={C.brass} strokeDasharray="4 3" />
      <Lab p={[368, 128]} t={[462, 124]} text="narrow flat" s={10.5} a="end" />
      <T x={336} y={92} a="end" s={10.5} c={C.brassHi}>10</T>
      <T x={402} y={92} s={10.5} c={C.brassHi}>10</T>
      <T x={284} y={116} s={10} c={C.dim}>equal</T>
      <T x={284} y={128} s={10} c={C.dim}>strokes</T>
      <Panel x={276} y={156} w={192} h={64} title="Faster option" />
      <Note x={286} y={186} lines={['6-inch No. 6 cut pillar file, then', 'a fine oilstone to clear the marks.']} s={10.5} lh={14} c={C.text} />
      <T x={14} y={248} s={10.5} c={C.dim}>Stroke one face, give the driver half a turn, stroke the other the same number of times.</T>
      <T x={14} y={263} s={10.5} c={C.dim}>The count of 10 is only an example. Tip off the centre line? Square the end and try again.</T>
    </Fig>
  )
}

// fig: bm-drv-burr DrvBurr
function DrvBurr() {
  return (
    <Fig h={232} view="Detail · the last step" scale="×30, schematic">
      <Panel x={12} y={28} w={148} h={148} title="Burr left on" ok={false} />
      <path d="M58 52 L114 52 L100 150 L72 150 Z" fill="url(#sk-steelH)" stroke={STEEL} />
      <path d="M72 150 l-5 7 l6 -3 l4 6 l4 -7 l5 5 l3 -6 l5 6 l3 -8" fill="none" stroke={C.ruby} strokeWidth="1.4" />
      <Panel x={166} y={28} w={148} h={148} title="Burr off" ok={true} />
      <path d="M212 52 L268 52 L254 150 L226 150 Z" fill="url(#sk-steelH)" stroke={STEEL} />
      <Panel x={320} y={28} w={148} h={148} title="Draw it off" />
      <g transform="translate(394 128) rotate(90)"><path d="M0 -60 L7 -60 L7 60 L0 60 Z" fill="#c9a87a" stroke="#8a6c44" /></g>
      <Driver x={394} y={122} ang={18} k={0.62} cap={C.steel} />
      <Arrow a={[368, 146]} b={[420, 146]} c="brass" w={1.5} />
      <T x={394} y={166} a="middle" s={10.5} c={C.text}>light pass on pegwood</T>
      <Note x={14} y={196} lines={['Take the faces over an Arkansas or fine oilstone to clear the marks, then remove the burr.', 'One watchmaker calls this the most important step. An unseen burr still marks a screw.']} s={10.5} lh={15} />
    </Fig>
  )
}

// fig: bm-drv-tweezers DrvTweezers
function DrvTweezers() {
  return (
    <Fig h={282} view="Detail · tweezer tips" scale="schematic">
      <Panel x={12} y={28} w={148} h={176} title="Tips meet" ok={true} />
      <path d="M72 48 L84 176 L86 176 L83 48 Z" fill="url(#sk-steelH)" stroke={STEELD} />
      <path d="M100 48 L88 176 L86 176 L89 48 Z" fill="url(#sk-steelH)" stroke={STEELD} />
      <circle cx={86} cy={180} r={3} fill={BRASS} />
      <Lab p={[87, 150]} t={[126, 118]} text="faces meet" sub="behind the tip" subc={C.dim} s={10.5} a="middle" />
      <Panel x={166} y={28} w={148} h={176} title="Tips curl out" ok={false} />
      <path d="M226 48 L236 150 Q238 170 228 180 L232 180 Q242 166 240 150 L237 48 Z" fill="url(#sk-steelH)" stroke={STEELD} />
      <path d="M254 48 L244 150 Q242 170 252 180 L248 180 Q238 166 240 150 L243 48 Z" fill="url(#sk-steelH)" stroke={STEELD} />
      <circle cx={240} cy={176} r={3} fill={BRASS} />
      <Arrow a={[240, 186]} b={[240, 199]} c="ruby" w={1.5} />
      <T x={270} y={118} a="middle" s={10.5} c={C.ruby}>ejects</T>
      <T x={270} y={131} a="middle" s={10.5} c={C.ruby}>the part</T>
      <Panel x={320} y={28} w={148} h={176} title="Dress them" />
      <Num x={338} y={62} n={1} r={8} />
      <T x={352} y={66} s={10.5} c={C.text}>bend tips into line</T>
      <Num x={338} y={90} n={2} r={8} />
      <T x={352} y={94} s={10.5} c={C.text}>Arkansas slip</T>
      <T x={352} y={107} s={10.5} c={C.text}>to dress the tips</T>
      <Num x={338} y={130} n={3} r={8} />
      <T x={352} y={134} s={10.5} c={C.text}>leave the inner</T>
      <T x={352} y={147} s={10.5} c={C.text}>faces unpolished</T>
      <Num x={338} y={174} n={4} r={8} />
      <T x={352} y={178} s={10.5} c={C.text}>test on a small pin</T>
      <Note x={14} y={224} lines={['Also: one oiler per grade, tips clean. Demagnetise steel tools when small parts cling.', 'Brass tweezers bend easily, so look for a bent tip before you reach for the slip.']} s={10.5} lh={15} />
    </Fig>
  )
}

// fig: bm-drv-exercise DrvExercise
function DrvExercise() {
  const crit = ['No plate scratch', 'No bright slot marks', 'Blade stayed in']
  return (
    <Fig h={278} view="Score sheet · ten screws" scale="scrap plate, 10× loupe">
      <Panel x={12} y={28} w={456} h={54} title="Blade width: a record, not a pass mark" />
      <T x={24} y={68} s={11} c={C.text}>Before dressing: ______ mm</T>
      <T x={186} y={68} s={11} c={C.text}>After: ______ mm</T>
      <T x={316} y={68} s={11} c={C.text}>Removed: ______ mm</T>
      <Tag x={14} y={104}>Screw</Tag>
      {Array.from({ length: 10 }, (_, i) => <T key={i} x={162 + i * 30} y={104} a="middle" s={11} c={C.dim} mono>{i + 1}</T>)}
      {crit.map((c, j) => (
        <g key={c}>
          <T x={14} y={128 + j * 24} s={11} c={j === 0 ? C.brassHi : C.text}>{c}</T>
          {Array.from({ length: 10 }, (_, i) => <rect key={i} x={151 + i * 30} y={116 + j * 24} width={22} height={18} rx="3" fill="rgba(255,255,255,0.03)" stroke={C.line} />)}
        </g>
      ))}
      <Note x={14} y={206} lines={['A scratch on the plate ends the test. It’s the worst fault, so it comes first.', 'Pass: ten out of ten. Any miss: find the cause, re-dress, start again on fresh screws.', 'Log it in your Practice Log and repeat after about 30 days.']} s={10.5} lh={15} />
      <T x={14} y={264} s={10} c={C.faint}>Weighting idea from AWCI’s scoring sheet. The pass mark is this app’s.</T>
    </Fig>
  )
}

/* ================================================================== */
/* The Swiss lever: theory & inspection                                 */
/* ================================================================== */
// Close-up frame: the wheel's teeth travel left to right, wheel centre far below.
// (x, y) is the tooth's locking corner.
function CloseTooth({ x, y, k = 1, rim = 92, c = STEEL }) {
  const p = [[x, y], [x - 48 * k, y + 16 * k], [x - 76 * k, y + rim * k], [x - 24 * k, y + rim * k]]
  return <polygon points={pts(p)} fill={c} stroke={STEELD} strokeWidth="0.9" strokeLinejoin="round" />
}
// A stone hanging from above. Its locking face passes through (x, y) on the tip
// circle and leans back by `draw`. lk = how far the locking corner sits below the circle.
function CloseStone({ x, y, lk = 22, draw = 12, H = 74, w = 44, rise = 15, k = 1 }) {
  const t = Math.tan(rad(draw))
  const I = [x - lk * k * t, y + lk * k]
  const top = [x + H * k * t, y - H * k]
  const I2 = [I[0] + w * k, I[1] - rise * k]
  const top2 = [I2[0] + (I2[1] - (y - H * k)) * t, y - H * k]
  return { I, I2, top, top2, poly: pts([top, I, I2, top2]) }
}
function Stone(props) {
  const s = CloseStone(props)
  return <polygon points={s.poly} fill={RUBY} stroke={RUBYHI} strokeWidth="0.9" strokeLinejoin="round" />
}

// fig: bm-lev-plan LevPlan
function LevPlan() {
  return (
    <Fig h={330} view="Plan · Swiss lever escapement" scale="schematic, angles exaggerated">
      <EscPlan x={8} y={46} k={1.16} phi={5} rot={30.6} pin={98} />
      <Arrow d="M56 118 A84 84 0 0 1 116 92" c="brass" w={1.6} />
      <Lab p={[80, 164]} t={[40, 62]} text="club teeth" a="middle" s={11} />
      <Lab p={[126, 186]} t={[62, 300]} text="escape wheel" a="middle" s={11} />
      <Lab p={[186, 146]} t={[172, 44]} text="entry stone" a="middle" s={11} c={RUBYHI} />
      <Lab p={[191, 228]} t={[176, 300]} text="exit stone" a="middle" s={11} c={RUBYHI} />
      <Lab p={[207, 185]} t={[262, 86]} text="pallet staff" a="middle" s={11} />
      <Lab p={[273, 170]} t={[284, 56]} text="banking stops" a="middle" s={11} c={C.brassHi} />
      <Lead p={[273, 201]} t={[284, 56]} dot text="" s={11} c={C.brassHi} />
      <Lab p={[312, 170]} t={[372, 56]} text="horns and slot" a="middle" s={11} />
      <Lab p={[326, 175]} t={[440, 160]} text="guard pin" a="middle" s={11} c={C.brassHi} />
      <Lab p={[343, 161]} t={[432, 104]} text="impulse pin" a="middle" s={11} c={RUBYHI} />
      <Lab p={[352, 192]} t={[430, 300]} text="safety roller" sub="with crescent" a="middle" s={11} />
      <Lab p={[366, 198]} t={[444, 228]} text="roller" a="middle" s={11} />
    </Fig>
  )
}

// fig: bm-lev-cycle LevCycle
function LevCycle() {
  const st = [
    [12, 28, 1, 'Unlock', 'pin enters the slot, frees the tooth', 5, 30.6, 156],
    [246, 28, 2, 'Impulse', 'tooth pushes stone, fork pushes pin', 0, 25, 180],
    [12, 182, 3, 'Drop and lock', 'wheel falls free, next tooth lands', -5, 18.6, 204],
    [246, 182, 4, 'Free swing', 'draw holds the fork, balance runs on', -5, 18.6, 262],
  ]
  return (
    <Fig h={338} view="Sequence · one beat" scale="schematic">
      {st.map(([x, y, n, t, sub, phi, rot, pin]) => (
        <g key={n}>
          <Panel x={x} y={y} w={222} h={148} />
          <Num x={x + 15} y={y + 15} n={n} r={8} />
          <T x={x + 30} y={y + 19} s={11.5} c={C.text} w="600">{t}</T>
          <EscPlan x={x - 12} y={y + 10} k={0.64} phi={phi} rot={rot} pin={pin} />
          <T x={x + 111} y={y + 140} a="middle" s={10.5} c={C.dim}>{sub}</T>
        </g>
      ))}
    </Fig>
  )
}

// fig: bm-lev-lock LevLock
function LevLock() {
  const X = 138
  const Y = 124
  const st = CloseStone({ x: X, y: Y, lk: 24 })
  return (
    <Fig h={306} view="Detail · tooth locked on a stone" scale="lock exaggerated">
      <Panel x={12} y={28} w={268} h={222} title="Locked" />
      <line x1={22} y1={Y} x2={270} y2={Y} stroke={C.dim} strokeDasharray="5 4" />
      <T x={268} y={Y - 5} a="end" s={10} c={C.dim}>tip circle</T>
      <rect x={13} y={216} width={266} height={33} fill={STEEL} stroke={STEELD} />
      <CloseTooth x={X} y={Y} />
      <Stone x={X} y={Y} lk={24} />
      <Arrow a={[20, 204]} b={[56, 204]} c="brass" w={1.6} />
      <T x={22} y={196} s={10.5} c={C.brassHi}>wheel</T>
      {/* lock dimension */}
      <line x1={st.I[0]} y1={st.I[1]} x2={st.I[0] + 92} y2={st.I[1]} stroke={C.text} strokeWidth="0.6" strokeDasharray="2 2" />
      <Dim a={[st.I[0] + 86, Y]} b={[st.I[0] + 86, st.I[1]]} text="" c={C.brassHi} />
      <T x={st.I[0] + 96} y={Y + 18} s={11} c={C.brassHi} w="700">lock</T>
      <Lab p={[X + 2, Y - 34]} t={[60, 62]} text="locking face" a="middle" s={10.5} />
      <Lab p={[st.I[0] + 22, st.I[1] - 7]} t={[236, 86]} text="impulse face" a="middle" s={10.5} />
      <Lab p={[X - 1, Y + 1]} t={[66, 112]} text="tooth corner" a="middle" s={10.5} />
      <Panel x={290} y={28} w={178} h={107} title="Too little" ok={false} />
      <g transform="translate(378 92) scale(0.56)">
        <line x1={-140} y1={0} x2={150} y2={0} stroke={C.dim} strokeDasharray="5 4" />
        <CloseTooth x={0} y={0} rim={44} /><Stone x={0} y={0} lk={7} H={50} />
      </g>
      <T x={460} y={128} a="end" s={10.5} c={C.text}>a jolt can unlock it</T>
      <Panel x={290} y={143} w={178} h={107} title="Too much" ok={false} />
      <g transform="translate(378 200) scale(0.56)">
        <line x1={-140} y1={0} x2={150} y2={0} stroke={C.dim} strokeDasharray="5 4" />
        <CloseTooth x={0} y={0} rim={44} /><Stone x={0} y={0} lk={50} H={50} />
      </g>
      <T x={460} y={243} a="end" s={10.5} c={C.text}>wastes energy</T>
      <T x={14} y={270} s={10.5} c={C.dim}>Playtner, 1910: about 1½° of fork travel at drop. A design figure, not a tolerance.</T>
      <T x={14} y={285} s={10.5} c={C.dim}>Test: balance out, a few clicks on. Ease the fork until the tooth releases. Compare stones.</T>
    </Fig>
  )
}

// fig: bm-lev-draw LevDraw
function LevDraw() {
  const X = 124
  const Y = 128
  const d = 12
  return (
    <Fig h={326} view="Detail and test · draw" scale="angle shown at 12°">
      <Panel x={12} y={28} w={250} h={232} title="Why the fork stays banked" />
      <line x1={22} y1={Y} x2={252} y2={Y} stroke={C.dim} strokeDasharray="5 4" />
      <rect x={13} y={224} width={248} height={35} fill={STEEL} stroke={STEELD} />
      <CloseTooth x={X} y={Y} rim={96} />
      <Stone x={X} y={Y} lk={24} draw={d} H={80} />
      {/* radial reference and face angle */}
      <line x1={X} y1={Y} x2={X} y2={Y - 84} stroke={C.text} strokeWidth="0.8" strokeDasharray="3 3" />
      <path d={`M${X} ${Y - 62} A62 62 0 0 1 ${X + 62 * Math.sin(rad(d))} ${Y - 62 * Math.cos(rad(d))}`} fill="none" stroke={C.brass} strokeWidth="1.4" />
      <Lab p={[X + 6, Y - 60]} t={[62, 84]} text="draw angle" sub="12° in Playtner" a="middle" s={10.5} c={C.brassHi} subc={C.dim} />
      {/* forces */}
      <Arrow a={[X + 2, Y + 1]} b={[X + 72, Y + 16]} c="ruby" w={2.2} />
      <Lab p={[X + 58, Y + 13]} t={[204, 176]} text="tooth pressure" a="middle" s={10.5} c={C.ruby} />
      <Arrow a={[X + 112, Y - 30]} b={[X + 112, Y + 16]} c="emerald" w={2.2} />
      <T x={254} y={Y - 40} a="end" s={10.5} c={C.emerald}>pulls it in</T>
      <Panel x={270} y={28} w={198} h={232} title="The snap-back test" />
      <rect x={298} y={131} width={150} height={14} rx="3" fill="none" stroke={C.dim} strokeDasharray="3 3" />
      <rect x={298} y={132} width={150} height={14} rx="3" fill={STEELD} stroke={STEEL} transform="rotate(-9 298 139)" />
      <circle cx={298} cy={139} r={5} fill={C.ground} stroke={STEEL} />
      <circle cx={396} cy={106} r={5} fill={BRASS} stroke={BRASSD} />
      <circle cx={396} cy={150} r={5} fill={BRASS} stroke={BRASSD} />
      <Lab p={[396, 152]} t={[430, 170]} text="banking" a="middle" s={10.5} c={C.brassHi} />
      <Pegwood x={372} y={135} ang={180} k={0.5} />
      <Arrow a={[428, 124]} b={[428, 141]} c="emerald" w={1.8} />
      <T x={282} y={176} s={10} c={C.dim}>dashed: at rest</T>
      <T x={282} y={72} s={10.5} c={C.text}>1 push off the banking,</T>
      <T x={282} y={86} s={10.5} c={C.text}>not far enough to unlock</T>
      <T x={282} y={210} s={10.5} c={C.text}>2 let go</T>
      <Verdict x={290} y={226} ok={true} r={7} />
      <T x={304} y={230} s={10.5} c={C.text}>snaps back: draw is working</T>
      <Verdict x={290} y={246} ok={false} r={7} />
      <T x={304} y={250} s={10.5} c={C.text}>stays: check pivots, then stone</T>
      <T x={14} y={280} s={10.5} c={C.dim}>Playtner: 12° on each stone. Some writers: 15° entry, 12° exit. Another source: 11 to 15°.</T>
      <T x={14} y={295} s={10.5} c={C.dim}>You can’t measure this angle at the bench. You test what it does, on both sides.</T>
      <T x={14} y={310} s={10.5} c={C.dim}>Balance out, a few clicks of wind on.</T>
    </Fig>
  )
}

// fig: bm-lev-drop LevDrop
function LevDrop() {
  return (
    <Fig h={302} view="Detail · drop, then a full turn of the wheel" scale="schematic">
      <Panel x={12} y={28} w={222} h={148} title="Tooth leaves one stone" />
      <g transform="translate(150 96)">
        <Stone x={-62} y={0} lk={20} H={44} w={46} />
        <CloseTooth x={60} y={18} rim={46} />
      </g>
      <Lab p={[130, 101]} t={[176, 60]} text="let-off corner clear" a="middle" s={10.5} />
      <Panel x={246} y={28} w={222} h={148} title="Next tooth lands on the other" />
      <g transform="translate(350 96)">
        <Stone x={36} y={0} lk={20} H={44} w={46} />
        <CloseTooth x={0} y={0} rim={60} />
      </g>
      <Dim a={[350, 86]} b={[386, 86]} text="" c={C.brassHi} />
      <T x={368} y={78} a="middle" s={11} c={C.brassHi} w="700">drop</T>
      <Arrow a={[276, 167]} b={[316, 167]} c="brass" w={1.5} />
      <Panel x={12} y={184} w={456} h={84} title="Go round all 15 teeth, on both stones" />
      {Array.from({ length: 15 }, (_, i) => {
        const bad = i === 9
        return (
          <g key={i}>
            <rect x={28 + i * 29} y={208} width={23} height={18} rx="2" fill={bad ? 'rgba(194,88,99,0.3)' : 'rgba(123,165,131,0.15)'} stroke={bad ? C.ruby : C.struct} strokeWidth="0.8" />
            <T x={39.5 + i * 29} y={221} a="middle" s={10} c={C.dim} mono>{i + 1}</T>
          </g>
        )
      })}
      <T x={24} y={244} s={10.5} c={C.text}>Wrong at one tooth: that tooth is bent.</T>
      <T x={262} y={244} s={10.5} c={C.text}>Wrong all round: stone position.</T>
      <T x={24} y={259} s={10} c={C.faint}>Tooth 10 is only an example.</T>
      <T x={14} y={288} s={10.5} c={C.dim}>Playtner allows about 1½° for a club tooth, and says excess drop wastes force.</T>
    </Fig>
  )
}

function DegBar({ x, y, deg, c, text, sc = 120, h = 16 }) {
  return (
    <g>
      <rect x={x} y={y} width={deg * sc} height={h} rx="2" fill={c} opacity="0.65" stroke={c} />
      {text && <T x={x + (deg * sc) / 2} y={y + h - 4} a="middle" s={10.5} c={C.text}>{text}</T>}
    </g>
  )
}

// fig: bm-lev-run LevRun
function LevRun() {
  const x = 150
  return (
    <Fig h={268} view="Chart · the small angles" scale="Playtner’s 1910 design figures">
      <Tag x={14} y={40}>All drawn to one scale</Tag>
      <T x={14} y={68} s={11} c={C.text}>Lock + run</T>
      <DegBar x={x} y={55} deg={1.5} c={C.steel} text="lock 1½°" />
      <DegBar x={x + 180} y={55} deg={0.25} c={C.brass} />
      <T x={x + 195} y={50} a="middle" s={10.5} c={C.brassHi}>run ¼°</T>
      <line x1={x} y1={82} x2={x} y2={214} stroke={C.line} />
      <line x1={x + 210} y1={48} x2={x + 210} y2={214} stroke={C.ruby} strokeDasharray="4 3" />
      <T x={x + 216} y={70} s={10.5} c={C.ruby}>total lock</T>
      <T x={x + 216} y={83} s={10.5} c={C.ruby} mono>1¾°</T>
      <T x={14} y={108} s={11} c={C.text}>Corner freedom</T>
      <DegBar x={x} y={95} deg={1.25} c={C.emerald} text="1¼°" />
      <T x={14} y={140} s={11} c={C.text}>Horn clearance</T>
      <DegBar x={x} y={127} deg={1.5} c={C.emerald} text="1½°" />
      <T x={14} y={172} s={11} c={C.text}>Guard freedom</T>
      <DegBar x={x} y={159} deg={1.25} c={C.emerald} text="1¼°" />
      <T x={x + 4} y={204} s={10.5} c={C.dim}>Every freedom must stop short of the red line.</T>
      <Note x={14} y={230} lines={['Run is the small travel after lock, to the banking: ¼ to ½° is enough, says Playtner.', 'Opening the bankings adds run, and with it poor motion and poor timekeeping.']} s={10.5} lh={15} />
    </Fig>
  )
}

// fig: bm-lev-heights LevHeights
function LevHeights() {
  return (
    <Fig h={312} view="Side view · parts must line up in height" scale="schematic">
      <rect x={20} y={200} width={440} height={10} fill={PLATE} stroke={C.struct} />
      <T x={26} y={224} s={10} c={C.faint}>mainplate</T>
      {/* escape wheel */}
      <rect x={36} y={118} width={120} height={8} fill={STEEL} stroke={STEELD} />
      <rect x={92} y={86} width={7} height={114} fill={STEELD} />
      {/* stone */}
      <rect x={154} y={98} width={18} height={48} fill={RUBY} stroke={RUBYHI} />
      <line x1={148} y1={122} x2={178} y2={122} stroke={C.emerald} strokeDasharray="3 2" />
      {/* fork */}
      <rect x={168} y={108} width={190} height={10} fill={STEELD} stroke={STEEL} />
      <rect x={232} y={84} width={7} height={116} fill={STEELD} />
      {/* roller */}
      <rect x={398} y={70} width={8} height={130} fill={STEELD} />
      <rect x={362} y={92} width={80} height={8} fill={STEEL} stroke={STEELD} />
      <rect x={378} y={109} width={48} height={8} fill={STEELD} stroke={STEEL} />
      <rect x={364} y={100} width={7} height={26} fill={RUBY} stroke={RUBYHI} />
      <line x1={356} y1={113} x2={378} y2={113} stroke={C.brass} strokeWidth="2.2" />
      <T x={408} y={86} s={10} c={C.faint}>roller</T>
      <T x={430} y={117} s={10} c={C.faint}>safety</T>
      <Lab p={[160, 104]} t={[150, 52]} text="tooth crosses the stone’s centre" a="middle" s={10.5} c={C.emerald} />
      <Lab p={[367, 106]} t={[330, 72]} text="slot meets pin at its centre" a="middle" s={10.5} c={RUBYHI} />
      <Lab p={[372, 113]} t={[392, 170]} text="guard pin centred" sub="on the safety roller" a="end" s={10.5} c={C.brassHi} />
      <T x={248} y={146} s={10.5} c={C.dim}>endshake 0.01 to 0.05 mm</T>
      <T x={248} y={160} s={10} c={C.faint}>balance and pallet staff</T>
      <Note x={14} y={246} lines={['Look dial up, then dial down. A tooth riding off a stone sends you to the endshake lesson.', 'Escape wheel: a little more shake is allowed. Your maker’s figure beats this one.', 'Figures and checks from AWCI.']} s={10.5} lh={15} />
    </Fig>
  )
}

// fig: bm-lev-corner LevCorner
function LevCorner() {
  // Fork against its upper banking. The pin has just left the slot and sits inside the
  // near horn, so the only way the fork can move is off the banking, towards the pin.
  const fork = 'M18 162 L168 162 Q190 140 211 127 Q222 122 234.5 120.6 L235.2 133.8 Q215.9 139 205 163 L188 163 L188 177 L205 177 Q215.9 201 235.2 206.2 L234.5 219.4 Q222 218 211 213 Q190 200 168 178 L18 178 Z'
  return (
    <Fig h={306} view="Detail · pin beside the fork corner" scale="gaps exaggerated">
      <Panel x={12} y={28} w={286} h={222} title="Pin just outside the slot" />
      <path d="M203.2 144.3 A60 60 0 0 1 272.9 112" fill="none" stroke={C.struct} strokeDasharray="4 4" />
      <T x={262} y={136} a="middle" s={10} c={C.faint}>pin’s path</T>
      <g transform="rotate(-8 20 170)">
        <path d={fork} fill={STEELD} stroke={STEEL} strokeLinejoin="round" />
      </g>
      <circle cx={110} cy={143} r={6} fill={BRASS} stroke={BRASSD} />
      <circle cx={110} cy={197} r={6} fill={BRASS} stroke={BRASSD} />
      <circle cx={212.8} cy={129.9} r={6.5} fill={RUBY} stroke={RUBYHI} />
      <Lab p={[217, 127]} t={[268, 100]} text="impulse pin" a="middle" s={10.5} c={RUBYHI} />
      <Lab p={[213, 106]} t={[150, 62]} text="horn" a="middle" s={10.5} />
      <Lab p={[202, 137]} t={[128, 224]} text="acting edge and corner" a="middle" s={10.5} />
      <Lab p={[66, 164]} t={[50, 205]} text="fork" a="middle" s={10.5} />
      <Lab p={[108, 138]} t={[84, 96]} text="banking" a="middle" s={10.5} c={C.brassHi} />
      <Lab p={[205.3, 135.2]} t={[232, 148]} text="freedom" a="start" s={10.5} c={C.brassHi} />
      <Arrow a={[150, 112]} b={[150, 139]} c="brass" w={1.8} />
      <T x={144} y={124} a="end" s={10.5} c={C.brassHi}>nudge</T>
      <Panel x={306} y={28} w={162} h={222} title="Result" />
      <Verdict x={322} y={64} ok={true} r={8} />
      <Note x={336} y={60} lines={['moves a hair,', 'touches, stays', 'locked, returns']} s={10.5} lh={14} c={C.text} />
      <Verdict x={322} y={126} ok={false} r={8} />
      <Note x={336} y={122} lines={['no movement:', 'the pin rubs', 'the corner']} s={10.5} lh={14} c={C.text} />
      <Verdict x={322} y={188} ok={false} r={8} />
      <Note x={336} y={184} lines={['tooth unlocks:', 'too much', 'freedom']} s={10.5} lh={14} c={C.text} />
      <T x={14} y={270} s={10.5} c={C.dim}>Playtner: 1 to 1¼° as the pin enters the fork, 1½ to 1¾° between horn and pin.</T>
      <T x={14} y={285} s={10.5} c={C.dim}>Both must be less than total lock, so a bumped fork stays locked. Test both sides.</T>
    </Fig>
  )
}

// fig: bm-lev-guard LevGuard
function LevGuard() {
  // The fork swings sideways, so the guard pin closes on the roller's curved edge.
  const scene = (cx, tipY, x0) => {
    const nc = pol(cx, 106, 44, 232)
    return (
      <g>
        <circle cx={cx} cy={106} r={44} fill={STEELD} stroke={STEEL} />
        <circle cx={nc[0]} cy={nc[1]} r={12} fill={C.ground} stroke={STEEL} strokeWidth="0.8" />
        <circle cx={cx} cy={106} r={6} fill={C.ground} stroke={STEEL} />
        <polygon points={pts([[x0, tipY + 13], [cx - 58, tipY - 6], [cx - 58, tipY + 6], [x0, tipY + 25]])} fill={STEELD} stroke={STEEL} strokeLinejoin="round" />
        <line x1={cx - 58} y1={tipY} x2={cx - 43} y2={tipY} stroke={BRASS} strokeWidth="3" strokeLinecap="round" />
      </g>
    )
  }
  return (
    <Fig h={306} view="Detail · guard pin and safety roller" scale="gaps exaggerated">
      <Panel x={12} y={28} w={222} h={158} title="At rest on the banking" />
      {scene(176, 128, 22)}
      <line x1={126} y1={116} x2={142} y2={116} stroke={C.brassHi} strokeWidth="0.7" />
      <Dim a={[128, 116]} b={[128, 127]} text="" c={C.brassHi} />
      <Lab p={[128, 121]} t={[74, 78]} text="guard freedom" s={10.5} c={C.brassHi} dot={false} />
      <Lab p={[196, 74]} t={[196, 58]} text="safety roller" s={10.5} />
      <Lab p={[150, 142]} t={[176, 164]} text="crescent" s={10.5} />
      <Lab p={[108, 128]} t={[72, 164]} text="guard pin" s={10.5} c={C.brassHi} />
      <Panel x={246} y={28} w={222} h={158} title="Nudged: pin touches" />
      {scene(410, 118, 256)}
      <Arrow a={[346, 150]} b={[346, 128]} c="brass" w={1.8} />
      <T x={338} y={146} a="end" s={10.5} c={C.brassHi}>nudge</T>
      <T x={356} y={166} s={10.5} c={C.text}>stays locked, then</T>
      <T x={356} y={179} s={10.5} c={C.text}>draw returns it</T>
      <Panel x={12} y={194} w={456} h={70} title="Playtner’s worked example" />
      <DegBar x={26} y={214} deg={1.25} c={C.emerald} text="guard freedom 1¼°" sc={150} />
      <DegBar x={26 + 187.5} y={214} deg={0.75} c={C.steel} text="still locked ¾°" sc={150} />
      <line x1={26} y1={236} x2={326} y2={236} stroke={C.ruby} />
      <T x={332} y={227} s={11} c={C.ruby} mono>total lock 2°</T>
      <T x={26} y={252} s={10} c={C.dim}>Guard freedom must always be less than total lock.</T>
      <T x={14} y={280} s={10.5} c={C.dim}>Test: turn the balance well clear of the fork. Nudge, release, and test both sides.</T>
      <T x={14} y={295} s={10.5} c={C.ruby}>If the fork unlocks, the safety has failed. Stop, and don’t run the watch.</T>
    </Fig>
  )
}

// fig: bm-lev-overbank LevOverbank
function LevOverbank() {
  return (
    <Fig h={306} view="Plan and chart · two faults, two cures" scale="schematic">
      <Panel x={12} y={28} w={288} h={176} title="Overbanked: watch stopped" tc={C.ruby} />
      <EscPlan x={-2} y={36} k={0.8} phi={-5} rot={18.6} pin={156} />
      <Lab p={[216, 128]} t={[214, 186]} text="pin blocked by the horn" a="middle" s={10.5} c={C.ruby} />
      <Lab p={[182, 121]} t={[80, 190]} text="fork on the wrong side" a="middle" s={10.5} c={C.ruby} />
      <Panel x={308} y={28} w={160} h={176} title="Recover" />
      <Num x={324} y={62} n={1} r={8} />
      <T x={338} y={66} s={10.5} c={C.text}>let the power down</T>
      <Num x={324} y={92} n={2} r={8} />
      <T x={338} y={90} s={10.5} c={C.text}>ease the fork across</T>
      <T x={338} y={103} s={10.5} c={C.text}>with pegwood</T>
      <Num x={324} y={128} n={3} r={8} />
      <T x={338} y={126} s={10.5} c={C.text}>balance swings</T>
      <T x={338} y={139} s={10.5} c={C.text}>freely again</T>
      <Num x={324} y={166} n={4} r={8} />
      <T x={338} y={164} s={10.5} c={C.text}>repeat the guard</T>
      <T x={338} y={177} s={10.5} c={C.text}>pin test</T>
      <Panel x={12} y={212} w={456} h={82} title="Rebanking: a different fault" />
      <Note x={24} y={244} lines={['The balance swings so far that the impulse pin knocks the outside of the fork, usually', 'making the watch gain. Knocking at high amplitude points at too strong a spring, so', 'check that first. One guide warns from about 315°, and Witschi places it at about 330°.']} s={10.5} lh={14} c={C.text} />
    </Fig>
  )
}

// fig: bm-lev-order LevOrder
function LevOrder() {
  const r = ['Lock', 'Draw', 'Drop', 'Run to the banking', 'Heights, dial up and down', 'Corner and horn', 'Guard pin']
  return (
    <Fig h={276} view="Record sheet · inspect first" scale="write a result for each">
      <Tag x={46} y={42}>Check</Tag>
      <Tag x={262} y={42}>Entry</Tag>
      <Tag x={332} y={42}>Exit</Tag>
      <Tag x={398} y={42}>Note</Tag>
      {r.map((t, i) => {
        const y = 50 + i * 26
        return (
          <g key={t}>
            <Num x={24} y={y + 10} n={i + 1} r={8} />
            <T x={46} y={y + 14} s={11} c={C.text}>{t}</T>
            <rect x={258} y={y} width={52} height={20} rx="3" fill="rgba(255,255,255,0.03)" stroke={C.line} />
            <rect x={328} y={y} width={52} height={20} rx="3" fill="rgba(255,255,255,0.03)" stroke={C.line} />
            <rect x={394} y={y} width={74} height={20} rx="3" fill="rgba(255,255,255,0.03)" stroke={C.line} />
          </g>
        )
      })}
      <T x={14} y={250} s={10.5} c={C.dim}>Forum order: drop lock, run, horn clearance, guard pin. Draw and heights are added here.</T>
      <T x={14} y={265} s={10.5} c={C.text}>Don’t move a stone until every line has a result.</T>
    </Fig>
  )
}

/* ================================================================== */
/* Calendar works: service & faults                                     */
/* ================================================================== */
function DateRing({ cx, cy, ro, ri, rot = 0 }) {
  const teeth = []
  for (let i = 0; i < 31; i++) {
    const a = rot + (i * 360) / 31
    teeth.push(<polygon key={i} points={pts([pol(cx, cy, ri, a - 4.4), pol(cx, cy, ri - 8, a), pol(cx, cy, ri, a + 4.4)])} fill={STEEL} stroke={STEELD} strokeWidth="0.4" />)
  }
  return (
    <g>
      <circle cx={cx} cy={cy} r={(ro + ri) / 2} fill="none" stroke="#d9d0bc" strokeWidth={ro - ri} opacity="0.9" />
      {teeth}
    </g>
  )
}

// fig: bm-cal-map CalMap
function CalMap() {
  const cx = 240
  const cy = 188
  const dw = [186, 226]
  const tip = pol(dw[0], dw[1], 46, 214)
  const jp = [326, 268]
  return (
    <Fig h={338} view="Plan · date works, dial side" scale="schematic, ETA’s part names">
      <DateRing cx={cx} cy={cy} ro={136} ri={116} rot={3} />
      {[[-8, '14'], [4, '15'], [16, '16']].map(([a, t]) => {
        const p = pol(cx, cy, 126, -a)
        return <text key={t} x={p[0]} y={p[1] + 3.5} textAnchor="middle" fontSize="10" fontWeight="700" fill="#1a1612" fontFamily="var(--font-mono)">{t}</text>
      })}
      <circle cx={cx} cy={cy} r={35} fill="none" stroke={BRASS} strokeWidth="4" strokeDasharray="2.4 1.8" />
      <circle cx={cx} cy={cy} r={31} fill="rgba(201,162,76,0.18)" stroke={BRASSD} />
      <circle cx={cx} cy={cy} r={7} fill={STEEL} />
      <circle cx={dw[0]} cy={dw[1]} r={30} fill="rgba(201,162,76,0.18)" stroke={BRASS} strokeWidth="3.4" strokeDasharray="2.4 1.8" />
      <circle cx={dw[0]} cy={dw[1]} r={4} fill={STEEL} />
      <line x1={dw[0]} y1={dw[1]} x2={tip[0]} y2={tip[1]} stroke={STEEL} strokeWidth="4" strokeLinecap="round" />
      {/* jumper */}
      <path d={`M${jp[0]} ${jp[1]} Q${jp[0] - 6} ${jp[1] - 26} ${jp[0] + 13} ${jp[1] - 42}`} fill="none" stroke={C.steel} strokeWidth="4" strokeLinecap="round" />
      <polygon points={pts([[jp[0] + 8, jp[1] - 46], [jp[0] + 26, jp[1] - 53], [jp[0] + 17, jp[1] - 36]])} fill={C.steel} />
      <circle cx={jp[0]} cy={jp[1]} r={5} fill={C.ground} stroke={STEEL} />
      {/* corrector */}
      <circle cx={168} cy={112} r={14} fill="rgba(134,167,189,0.2)" stroke={C.steel} strokeWidth="2.4" strokeDasharray="4 3" />
      <circle cx={168} cy={112} r={3} fill={C.steel} />
      <Lab p={[140, 104]} t={[56, 70]} text="date indicator" sub="31 teeth" s={10.5} />
      <Lab p={[155, 112]} t={[58, 126]} text="date corrector" sub="from the crown" s={10.5} />
      <Lab p={[240, 158]} t={[300, 46]} text="hour wheel" s={10.5} c={C.brassHi} />
      <Lab p={[176, 248]} t={[62, 300]} text="date indicator" sub="driving wheel" s={10.5} c={C.brassHi} />
      <Lab p={[tip[0], tip[1]]} t={[52, 214]} text="finger" sub="once in 24 h" s={10.5} />
      <Lab p={[338, 242]} t={[430, 300]} text="date jumper" sub="sprung arm" s={10.5} />
      <Lab p={[326, 268]} t={[340, 314]} text="pivot" s={10.5} />
      <Lab p={[372, 152]} t={[430, 120]} text="window side" sub="3 o’clock" s={10.5} />
      <Arrow d="M340 138 A116 116 0 0 0 288 86" c="brass" w={1.5} />
    </Fig>
  )
}

// fig: bm-cal-window CalWindow
function CalWindow() {
  const X = (h) => 150 + (h - 18) * 25
  const rows = [
    ['ETA 2836-2, 2834-2', 21, 27, '9 pm to 3 am'],
    ['Seiko 6R35, 6R54', 21, 25, '9 pm to 1 am'],
    ['Seiko 8L35', 20, 26, '8 pm to 2 am'],
  ]
  const ticks = [[18, '6 pm'], [21, '9 pm'], [24, 'midnight'], [27, '3 am'], [30, '6 am']]
  return (
    <Fig h={250} view="Chart · corrector danger windows" scale="published per calibre">
      {ticks.map(([h, l]) => (
        <g key={h}>
          <line x1={X(h)} y1={46} x2={X(h)} y2={170} stroke={h === 24 ? C.brass : C.line} strokeDasharray={h === 24 ? undefined : '2 4'} />
          <T x={X(h)} y={40} a="middle" s={10.5} c={h === 24 ? C.brassHi : C.dim}>{l}</T>
        </g>
      ))}
      {rows.map(([n, a, b, t], i) => {
        const y = 56 + i * 38
        return (
          <g key={n}>
            <T x={14} y={y + 15} s={10.5} c={C.text}>{n}</T>
            <rect x={X(a)} y={y} width={X(b) - X(a)} height={22} rx="3" fill="rgba(194,88,99,0.35)" stroke={C.ruby} />
            <T x={(X(a) + X(b)) / 2} y={y + 15} a="middle" s={10.5} c={C.text}>{t}</T>
          </g>
        )
      })}
      <rect x={X(18)} y={178} width={X(20) - X(18)} height={14} rx="3" fill="rgba(123,165,131,0.3)" stroke={C.emerald} />
      <rect x={X(27)} y={178} width={X(30) - X(27)} height={14} rx="3" fill="rgba(123,165,131,0.3)" stroke={C.emerald} />
      <T x={14} y={189} s={10.5} c={C.emerald}>Clear of all three</T>
      <T x={14} y={214} s={10.5} c={C.dim}>Inside a window the finger is in mesh, so the corrector can do damage.</T>
      <T x={14} y={229} s={10.5} c={C.dim}>Safest habit: find the date change, then work with the hands around 6 o’clock.</T>
    </Fig>
  )
}

// fig: bm-cal-jumper CalJumper
function CalJumper() {
  const panel = (x, n, t, off, lift, finger, a, b) => {
    const base = 190
    const teeth = []
    for (let i = -1; i < 7; i++) {
      const tx = x + 6 + i * 32 + off
      teeth.push(<polygon key={i} points={pts([[tx, base], [tx + 16, base - 22], [tx + 32, base]])} fill={STEEL} stroke={STEELD} strokeWidth="0.6" />)
    }
    const tipX = x + 70
    const tipY = base - 6 - lift
    return (
      <g>
        <Panel x={x} y={28} w={148} h={214} />
        <Num x={x + 15} y={45} n={n} r={8} />
        <T x={x + 30} y={49} s={11} c={C.text} w="600">{t}</T>
        <clipPath id={`bm-cj-${n}`}><rect x={x + 2} y={60} width={144} height={150} /></clipPath>
        <g clipPath={`url(#bm-cj-${n})`}>
          {teeth}
          <rect x={x} y={base} width={150} height={14} fill={STEEL} stroke={STEELD} strokeWidth="0.6" />
        </g>
        <path d={`M${x + 126} 66 Q${x + 112} ${90 - lift * 0.3} ${tipX + 4} ${tipY - 22}`} fill="none" stroke={C.steel} strokeWidth="4" strokeLinecap="round" />
        <polygon points={pts([[tipX - 12, tipY - 24], [tipX + 13, tipY - 24], [tipX, tipY]])} fill={C.steel} stroke={STEELD} strokeWidth="0.6" />
        <circle cx={x + 126} cy={66} r={4.5} fill={C.ground} stroke={STEEL} />
        {finger && <line x1={x + 10} y1={116} x2={x + finger} y2={base - 15} stroke={BRASS} strokeWidth="5" strokeLinecap="round" />}
        <T x={x + 74} y={224} a="middle" s={10} c={C.text}>{a}</T>
        <T x={x + 74} y={236} a="middle" s={10} c={C.dim}>{b}</T>
      </g>
    )
  }
  return (
    <Fig h={318} view="Detail · jumper, unrolled" scale="date ring drawn straight">
      {panel(12, 1, 'At rest', 0, 0, 0, 'tip seated between teeth:', 'the date is held')}
      {panel(166, 2, 'Pushed', 16, 16, 28, 'finger lifts the tooth under', 'the tip, the spring loads')}
      {panel(320, 3, 'Snapped', 32, 0, 0, 'past the crest, the jumper', 'throws the date on')}
      <Note x={14} y={262} lines={['That stored load is why the jumper flies. Keep pegwood on the plate as the screw comes', 'out, and work over a covered tray. On the 2824-2 a plate and screw hold it down.']} s={10.5} lh={15} />
      <T x={14} y={304} s={10} c={C.faint}>A slow change isn’t always a fault: one repairer describes the 2824-2 date as creeping first.</T>
    </Fig>
  )
}

// fig: bm-cal-inspect CalInspect
function CalInspect() {
  const tile = (x, t, a, b, g) => (
    <g>
      <Panel x={x} y={28} w={110} h={150} title={t} />
      <g transform={`translate(${x + 55} 92)`}>{g}</g>
      <T x={x + 55} y={152} a="middle" s={10} c={C.text}>{a}</T>
      <T x={x + 55} y={165} a="middle" s={10} c={C.text}>{b}</T>
    </g>
  )
  return (
    <Fig h={224} view="Detail · four things to look at" scale="under the loupe">
      {tile(12, 'Every tooth', 'bends, chips', 'and burrs', <g><polygon points="-42,26 -28,-8 -14,26" fill={STEEL} /><polygon points="-14,26 2,-2 -2,-14 12,26" fill={STEEL} stroke={C.ruby} strokeWidth="1.3" /><polygon points="14,26 28,-8 42,26" fill={STEEL} /><rect x="-46" y="26" width="92" height="9" fill={STEEL} /></g>)}
      {tile(127, 'Finger', 'tip worn', 'or bent', <g><circle cx="-24" cy="16" r="14" fill="none" stroke={BRASS} strokeWidth="3" strokeDasharray="2.4 1.6" /><path d="M-24 16 L14 -18 Q22 -24 26 -32" fill="none" stroke={STEEL} strokeWidth="5" strokeLinecap="round" /><circle cx="24" cy="-30" r="9" fill="none" stroke={C.ruby} strokeWidth="1.3" /></g>)}
      {tile(242, 'Jumper arm', 'cracked or', 'broken arm', <g><path d="M-34 26 Q-30 -6 -4 -14" fill="none" stroke={C.steel} strokeWidth="5" strokeLinecap="round" /><path d="M6 -18 L26 -24" stroke={C.steel} strokeWidth="5" strokeLinecap="round" /><path d="M-3 -24 L5 -8" stroke={C.ruby} strokeWidth="1.8" /></g>)}
      {tile(357, 'Seat', 'old dial dots', 'or residue', <g><rect x="-44" y="10" width="88" height="16" fill={STEEL} /><path d="M-30 10 q10 -12 20 0 Z M10 10 q8 -9 18 0 Z" fill="#b9a77c" /></g>)}
      <T x={14} y={198} s={10.5} c={C.text}>Check: the indicator turns freely by hand on its seat, with no rub anywhere.</T>
      <T x={14} y={213} s={10.5} c={C.dim}>If it rubs at one place, find what it touches before you lubricate anything.</T>
    </Fig>
  )
}

// fig: bm-cal-routine CalRoutine
function CalRoutine() {
  return (
    <Fig h={214} view="Sequence · ETA’s date jumper routine" scale="ETA 2824-2, in our words">
      {[1, 2, 3].map((n, i) => {
        const x = 12 + i * 156
        return (
          <g key={n}>
            <Panel x={x} y={28} w={144} h={118} title={`Oiling ${n}`} />
            <path d={`M${x + 36} 56 q-11 15 0 22 q11 -7 0 -22 Z`} fill={LUB.thick} opacity="0.85" />
            <T x={x + 36} y={96} a="middle" s={10} c={C.text}>lubricate</T>
            <T x={x + 36} y={109} a="middle" s={10} c={C.text}>the jumper</T>
            <Arrow a={[x + 60, 68]} b={[x + 78, 68]} c="brass" w={1.5} />
            <T x={x + 110} y={72} a="middle" s={14} c={C.brassHi} w="700" mono>~10</T>
            <T x={x + 110} y={96} a="middle" s={10} c={C.text}>teeth, rapid</T>
            <T x={x + 110} y={109} a="middle" s={10} c={C.text}>correction</T>
            <T x={x + 72} y={134} a="middle" s={10} c={C.faint}>{n < 3 ? 'then repeat' : 'then stop and inspect'}</T>
          </g>
        )
      })}
      <T x={14} y={166} s={10.5} c={C.text}>Hands well out of the danger window. Take the lubricant for this point from the sheet.</T>
      <T x={14} y={181} s={10.5} c={C.dim}>Epilame goes on the jumper and setting wheel first: after washing, before reassembly.</T>
      <T x={14} y={196} s={10.5} c={C.ruby}>Keep oil off the print. No safe dial solvent is sourced, and date rings are printed too.</T>
    </Fig>
  )
}

// fig: bm-cal-test CalTest
function CalTest() {
  return (
    <Fig h={244} view="Chart · two tests" scale="one sticking date = one bad tooth">
      <Tag x={14} y={40}>1 · Corrector, hands around 6</Tag>
      {Array.from({ length: 31 }, (_, i) => {
        const r = Math.floor(i / 16)
        const c = i % 16
        const bad = i === 20
        return (
          <g key={i}>
            <rect x={14 + c * 28} y={48 + r * 26} width={24} height={21} rx="3" fill={bad ? 'rgba(194,88,99,0.3)' : 'rgba(123,165,131,0.14)'} stroke={bad ? C.ruby : C.line} />
            <T x={26 + c * 28} y={63 + r * 26} a="middle" s={10.5} c={bad ? C.text : C.dim} mono>{i + 1}</T>
          </g>
        )
      })}
      <T x={14} y={116} s={10.5} c={C.dim}>Each date snaps to rest and holds. The 21 is only an example of a sticking date.</T>
      <Tag x={14} y={142}>2 · Natural change, turn the hands forward</Tag>
      <line x1={30} y1={176} x2={450} y2={176} stroke={C.struct} strokeWidth="2" />
      {[[30, '6 am'], [135, 'midnight'], [240, '6 am'], [345, 'midnight'], [450, '6 am']].map(([x, l], i) => (
        <g key={i}>
          <line x1={x} y1={170} x2={x} y2={182} stroke={C.dim} />
          <T x={x} y={196} a="middle" s={10.5} c={l === 'midnight' ? C.brassHi : C.dim}>{l}</T>
          {l === 'midnight' && <Verdict x={x} y={158} ok={true} r={8} />}
        </g>
      ))}
      <T x={14} y={220} s={10.5} c={C.text}>One change every 24 hours, around midnight, twice over.</T>
      <T x={14} y={235} s={10.5} c={C.dim}>Don’t take a rate reading with the hands near midnight: the date change distorts it.</T>
    </Fig>
  )
}

// fig: bm-cal-faults CalFaults
function CalFaults() {
  const r = [
    ['No change at all', 'broken finger, jumper out', 'trace the drive, hour wheel on'],
    ['Stops halfway', 'jumper weak, trapped or', 'lift the dial, check the ring', 'broken, ring rubbing the dial'],
    ['Quick-set dead', 'jumper trapped under the', 'open up, return the jumper', 'ring (one forum repair)'],
    ['One date sticks', 'a single bad tooth', 'corrector through all 31'],
    ['Hands lose time', 'cannon pinion slips under', 'watch the minute hand at', 'date load', 'the change'],
    ['Date jams later', 'old dial dots on the ring', 'remove the dial, clean the seat'],
    ['Slow creep first', 'may be normal for the calibre', 'read the sheet before you fix it'],
  ]
  return (
    <Fig h={324} view="Chart · date faults" scale="forum evidence, a starting point">
      <Tag x={14} y={40}>Symptom</Tag>
      <Tag x={136} y={40}>Likely cause</Tag>
      <Tag x={306} y={40}>Test</Tag>
      {r.map(([s, c1, t, c2, t2], i) => {
        const y = 62 + i * 37
        return (
          <g key={s}>
            <line x1={12} y1={y - 15} x2={468} y2={y - 15} stroke={C.line} strokeWidth="0.6" />
            <T x={14} y={y} s={11} c={C.text} w="600">{s}</T>
            <T x={136} y={y} s={10.5} c={C.ruby}>{c1}</T>
            {c2 && <T x={136} y={y + 13} s={10.5} c={C.ruby}>{c2}</T>}
            <T x={306} y={y} s={10.5} c={C.brassHi}>{t}</T>
            {t2 && <T x={306} y={y + 13} s={10.5} c={C.brassHi}>{t2}</T>}
          </g>
        )
      })}
    </Fig>
  )
}

// fig: bm-cal-cannon CalCannon
function CalCannon() {
  return (
    <Fig h={268} view="Section and chart · slipping cannon pinion" scale="schematic">
      <Panel x={12} y={28} w={196} h={186} title="Date load path" />
      <rect x={102} y={46} width={10} height={156} fill={STEELD} stroke={STEEL} />
      <path d="M90 66 L96 66 L96 140 L118 140 L118 66 L124 66 L124 150 L90 150 Z" fill={BRASSD} stroke={BRASS} />
      <rect x={70} y={150} width={74} height={9} fill={BRASS} stroke={BRASSD} />
      <Lab p={[120, 100]} t={[160, 76]} text="cannon pinion" s={10.5} c={C.brassHi} />
      <Lab p={[107, 180]} t={[54, 186]} text="centre arbor" s={10.5} />
      <Lab p={[100, 108]} t={[50, 112]} text="friction fit" sub="slips under load" s={10.5} c={C.ruby} />
      <Arrow a={[172, 186]} b={[132, 160]} c="ruby" w={1.8} />
      <T x={172} y={200} a="middle" s={10.5} c={C.ruby}>date load</T>
      <Panel x={216} y={28} w={252} h={186} title="Minute hand against true time" />
      <line x1={238} y1={190} x2={454} y2={190} stroke={C.struct} />
      <line x1={238} y1={190} x2={238} y2={56} stroke={C.struct} />
      <polyline points="238,184 420,62" fill="none" stroke={C.dim} strokeDasharray="4 3" />
      <polyline points="238,184 330,122 374,122 450,71" fill="none" stroke={C.ruby} strokeWidth="2" />
      <T x={352} y={142} a="middle" s={10.5} c={C.ruby}>stalls at the change</T>
      <T x={346} y={204} a="middle" s={10.5} c={C.dim}>true time</T>
      <T x={262} y={66} s={10.5} c={C.dim}>shown time</T>
      <Note x={14} y={234} lines={['At its worst the watch runs and the hands don’t move. Nipping needs a light touch,', 'and on some calibres the friction is elsewhere, so read the sheet first.']} s={10.5} lh={15} />
    </Fig>
  )
}

/* ================================================================== */
/* When something pings, tangles or breaks                              */
/* ================================================================== */

// fig: bm-res-search ResSearch
function ResSearch() {
  return (
    <Fig h={312} view="Plan and side view · a search in order" scale="schematic">
      <Panel x={12} y={28} w={224} h={196} title="Floor, from above" />
      <rect x={26} y={50} width={196} height={30} rx="2" fill="url(#sk-bench)" stroke={C.struct} />
      <T x={124} y={69} a="middle" s={10.5} c={C.dim}>bench</T>
      <circle cx={124} cy={104} r={13} fill={C.struct} opacity="0.5" stroke={C.dim} />
      <T x={124} y={108} a="middle" s={10} c={C.text}>you</T>
      <path d="M104 126 L144 126 L144 112 L168 112 L168 146 L80 146 L80 112 L58 112 L58 166 L190 166 L190 112 L212 112 L212 190 L36 190 L36 112" fill="none" stroke={C.brass} strokeWidth="1.5" strokeDasharray="5 3" />
      <T x={124} y={212} a="middle" s={10.5} c={C.text}>slow strips, working outwards</T>
      <Panel x={244} y={28} w={224} h={196} title="Torch flat to the floor" />
      <line x1={254} y1={176} x2={458} y2={176} stroke={C.struct} strokeWidth="2" />
      <rect x={254} y={160} width={34} height={13} rx="3" fill={C.steel} />
      <path d="M288 161 L376 169 L376 175 L288 172 Z" fill={C.brassHi} opacity="0.3" />
      <rect x={366} y={167} width={8} height={8} fill={STEEL} stroke={STEELD} />
      <path d="M374 175 L452 175 L452 177 L374 177 Z" fill="#000" stroke={C.ruby} strokeWidth="0.5" />
      <Lab p={[370, 168]} t={[370, 126]} text="small part" s={10.5} />
      <Lab p={[416, 176]} t={[430, 150]} text="long shadow" s={10.5} c={C.ruby} a="end" />
      <T x={356} y={200} a="middle" s={10.5} c={C.text}>dim the room first</T>
      {[
        [1, 'Freeze', 'feet still, listen'],
        [2, 'Check you', 'lap, sleeves, tray'],
        [3, 'Torch', 'strips, under furniture'],
        [4, 'Magnet', 'steel parts, then demagnetise'],
      ].map(([n, a, b], i) => {
        const x = i % 2 ? 244 : 14
        const y = 232 + Math.floor(i / 2) * 36
        return (
          <g key={n}>
            <Num x={x + 9} y={y + 14} n={n} r={8} />
            <T x={x + 24} y={y + 11} s={11} c={C.text} w="600">{a}</T>
            <T x={x + 24} y={y + 25} s={10.5} c={C.dim}>{b}</T>
          </g>
        )
      })}
    </Fig>
  )
}

// fig: bm-res-bag ResBag
function ResBag() {
  return (
    <Fig h={252} view="Side view · working inside a clear bag" scale="schematic">
      <path d="M40 56 Q240 34 440 56 L452 194 Q240 214 28 194 Z" fill="rgba(160,200,215,0.07)" stroke={C.text} strokeWidth="1.2" strokeDasharray="6 3" />
      <rect x={160} y={160} width={160} height={16} rx="3" fill={BRASSD} stroke={BRASS} />
      <rect x={196} y={148} width={88} height={12} rx="2" fill={PLATE} stroke={C.struct} />
      <Tweezers x={236} y={146} ang={24} k={0.8} />
      <path d="M238 142 Q300 60 400 78 Q432 92 418 146" fill="none" stroke={C.brass} strokeWidth="1.5" strokeDasharray="4 3" />
      <circle cx={416} cy={150} r={3.6} fill={C.steel} stroke={STEEL} />
      <Lab p={[416, 148]} t={[388, 120]} text="spring stops here" s={10.5} c={C.brassHi} a="end" />
      <Lab p={[240, 152]} t={[110, 120]} text="movement" s={10.5} />
      <Lab p={[58, 120]} t={[64, 96]} text="clear bag" s={10.5} a="start" />
      <T x={240} y={232} a="middle" s={10.5} c={C.text}>Movement, tweezers and your hands all go in.</T>
      <T x={240} y={246} a="middle" s={10.5} c={C.dim}>Afterwards, turn the bag over a white tray. Don’t shake it out.</T>
    </Fig>
  )
}

function Lyre({ cx, cy, r }) {
  return (
    <g>
      <path d={`M${cx - 6} ${cy - r - 4} C${cx - r - 22} ${cy - r} ${cx - r - 16} ${cy + r * 0.6} ${cx - r * 0.5} ${cy + r + 2}`} fill="none" stroke={C.steel} strokeWidth="3.4" strokeLinecap="round" />
      <path d={`M${cx + 6} ${cy - r - 4} C${cx + r + 22} ${cy - r} ${cx + r + 16} ${cy + r * 0.6} ${cx + r * 0.5} ${cy + r + 2}`} fill="none" stroke={C.steel} strokeWidth="3.4" strokeLinecap="round" />
    </g>
  )
}

// fig: bm-res-lyre ResLyre
function ResLyre() {
  return (
    <Fig h={296} view="Section and plan · hinged spring" scale="shapes vary by maker">
      <Panel x={12} y={28} w={222} h={198} title="Swing it closed" />
      <path d="M36 176 L36 134 L60 134 L60 158 L168 158 L168 134 L208 134 L208 176 Z" fill={BRASSD} stroke={BRASS} />
      <rect x={72} y={140} width={84} height={16} rx="1" fill={RUBY} opacity="0.6" stroke={RUBYHI} strokeWidth="0.6" />
      <line x1={66} y1={132} x2={150} y2={70} stroke={C.steel} strokeWidth="3.4" strokeLinecap="round" />
      <Arrow d="M160 82 A100 100 0 0 1 176 126" c="brass" w={1.6} />
      <circle cx={64} cy={134} r={3} fill={C.steel} />
      <Pegwood x={56} y={130} ang={-28} k={0.72} />
      <Lab p={[50, 104]} t={[84, 74]} text="pegwood" sub="behind hinge" s={10.5} a="start" />
      <Lab p={[128, 86]} t={[176, 56]} text="spring" s={10.5} />
      <Lab p={[114, 150]} t={[114, 200]} text="jewels already seated" s={10.5} />
      <Panel x={246} y={28} w={222} h={198} title="Ease each end home" />
      <circle cx={357} cy={126} r={62} fill={BRASSD} opacity="0.5" stroke={BRASS} />
      <circle cx={357} cy={126} r={30} fill={RUBY} opacity="0.4" stroke={RUBYHI} />
      <Lyre cx={357} cy={126} r={34} />
      <rect x={320} y={156} width={20} height={9} rx="1" fill={BRASS} stroke={BRASSD} />
      <rect x={374} y={156} width={20} height={9} rx="1" fill={BRASS} stroke={BRASSD} />
      <Num x={318} y={182} n={1} r={8} />
      <Num x={396} y={182} n={2} r={8} />
      <Lab p={[330, 160]} t={[286, 208]} text="lug" s={10.5} />
      <Lab p={[357, 88]} t={[440, 52]} text="hinge" s={10.5} a="end" />
      <T x={14} y={246} s={10.5} c={C.text}>Press only at the very end of the spring, one end at a time.</T>
      <T x={14} y={261} s={10.5} c={C.dim}>Check: both ends under their lugs, spring level, jewel lifts from the pivot side and returns.</T>
      <T x={14} y={276} s={10.5} c={C.ruby}>An end won’t go? Open up and start again. Never force it.</T>
    </Fig>
  )
}

// fig: bm-res-clone ResClone
function ResClone() {
  return (
    <Fig h={240} view="Plan · know your spring before you touch it" scale="generic shapes">
      <Panel x={12} y={28} w={148} h={146} title="Hinged lyre" />
      <circle cx={86} cy={100} r={24} fill={RUBY} opacity="0.35" stroke={RUBYHI} />
      <Lyre cx={86} cy={100} r={27} />
      <T x={86} y={152} a="middle" s={10.5} c={C.text}>Incabloc type</T>
      <T x={86} y={165} a="middle" s={10} c={C.dim}>swings on a hinge</T>
      <Panel x={166} y={28} w={148} h={146} title="Three-leaf" />
      <circle cx={240} cy={100} r={22} fill={RUBY} opacity="0.35" stroke={RUBYHI} />
      {[90, 210, 330].map((a) => {
        const p = pol(240, 100, 30, a)
        return <ellipse key={a} cx={p[0]} cy={p[1]} rx={13} ry={7.5} fill="none" stroke={C.steel} strokeWidth="3" transform={`rotate(${90 - a} ${p[0]} ${p[1]})`} />
      })}
      <T x={240} y={152} a="middle" s={10.5} c={C.text}>Kif type</T>
      <T x={240} y={165} a="middle" s={10} c={C.dim}>twist to release</T>
      <Panel x={320} y={28} w={148} h={146} title="Removable" />
      <circle cx={394} cy={100} r={22} fill={RUBY} opacity="0.35" stroke={RUBYHI} />
      <path d="M362 84 Q394 66 426 84 M362 116 Q394 134 426 116" fill="none" stroke={C.steel} strokeWidth="3" strokeLinecap="round" strokeDasharray="10 4" />
      <T x={394} y={152} a="middle" s={10.5} c={C.text}>Diashock type</T>
      <T x={394} y={165} a="middle" s={10} c={C.dim}>comes right out</T>
      <T x={14} y={196} s={10.5} c={C.text}>Look-alike clones are a repeated complaint. Photograph the setting first.</T>
      <T x={14} y={211} s={10.5} c={C.dim}>A replacement must match the setting: use the old spring, the parts list or a donor.</T>
      <T x={14} y={226} s={10.5} c={C.dim}>Bent or broken? Replace it. A spring that nearly fits can come out in use.</T>
    </Fig>
  )
}

// fig: bm-res-tangle ResTangle
function ResTangle() {
  const cx = 128
  const cy = 164
  return (
    <Fig h={306} view="Plan · find the coil that jumped" scale="inset ×6, schematic">
      <polyline points={spiral(cx, cy, 18, 92, 7, 30)} fill="none" stroke={C.steel} strokeWidth="1.3" />
      <path d={`M${cx + 58} ${cy - 62} Q${cx + 86} ${cy - 44} ${cx + 64} ${cy - 22}`} fill="none" stroke={C.ruby} strokeWidth="1.8" />
      <circle cx={cx} cy={cy} r={14} fill={STEELD} stroke={STEEL} />
      <circle cx={cx} cy={cy} r={3.4} fill={C.ground} />
      <rect x={cx + 76} y={cy + 44} width={12} height={10} fill={BRASS} stroke={BRASSD} />
      <circle cx={cx + 74} cy={cy - 44} r={25} fill="none" stroke={C.brass} strokeWidth="1.2" />
      <line x1={cx + 97} y1={cy - 54} x2={282} y2={84} stroke={C.brass} strokeWidth="0.8" />
      <line x1={cx + 94} y1={cy - 30} x2={282} y2={196} stroke={C.brass} strokeWidth="0.8" />
      <Lab p={[cx + 82, cy + 49]} t={[240, 260]} text="stud" s={10.5} c={C.brassHi} />
      <Lab p={[cx, cy + 10]} t={[66, 290]} text="collet" s={10.5} />
      <Panel x={282} y={28} w={186} h={176} title="Inset" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M298 ${84 + i * 26} Q374 ${70 + i * 26} 452 ${84 + i * 26}`} fill="none" stroke={C.steel} strokeWidth="2.4" />)}
      <path d="M298 110 Q338 96 362 84 Q392 72 452 110" fill="none" stroke={C.ruby} strokeWidth="2.6" />
      <Lab p={[362, 86]} t={[372, 60]} text="this coil has jumped" s={10.5} c={C.ruby} />
      <T x={374} y={192} a="middle" s={10.5} c={C.text}>one coil over its neighbour</T>
      <Note x={282} y={224} lines={['Keep the balance on its cock, and', 'never lift it over about 1 cm away.', 'Look for a path back that doesn’t', 'stretch any other coil. No path, or', 'a sharp bend? Stop here.']} s={10.5} lh={14} />
    </Fig>
  )
}

// fig: bm-res-walk ResWalk
function ResWalk() {
  const row = (x, y, jumped, gap = 15) => {
    const c = []
    for (let i = 0; i < 7; i++) {
      const hop = i === jumped
      c.push(<rect key={i} x={x + 12 + i * gap + (hop ? gap * 0.5 : 0)} y={y - (hop ? 12 : 0)} width={4} height={12} fill={hop ? C.ruby : C.steel} />)
    }
    return <g>{c}</g>
  }
  return (
    <Fig h={262} view="Section across the coils · walking it out" scale="schematic">
      {[
        [12, 1, 'Slip under', 'tip under the jumped coil,', 'nothing else moves', 3, 66, 138, null],
        [168, 2, 'Lift and guide', 'lift just enough to clear,', 'guide it over', 3, 80, 124, [86, 120, 86, 96]],
        [324, 3, 'Move along', 'coils back in line, tip', 'moves a little further on', -1, 0, 0, null],
      ].map(([x, n, t, a, b, j, ox, oy, arrow]) => (
        <g key={n}>
          <Panel x={x} y={28} w={144} h={174} />
          <Num x={x + 15} y={45} n={n} r={8} />
          <T x={x + 30} y={49} s={11} c={C.text} w="600">{t}</T>
          {row(x + 8, 136, j)}
          {ox > 0 && <Oiler x={x + ox} y={oy} ang={32} k={0.6} />}
          <T x={x + 72} y={172} a="middle" s={10} c={C.text}>{a}</T>
          <T x={x + 72} y={185} a="middle" s={10} c={C.text}>{b}</T>
        </g>
      ))}
      <T x={14} y={222} s={10.5} c={C.text}>Check: coils evenly spaced from above, and flat from the side.</T>
      <T x={14} y={237} s={10.5} c={C.dim}>Use a clean oiler, and never lever against the other coils. Method from forum practice.</T>
      <T x={14} y={252} s={10.5} c={C.ruby}>Coil stays out of line? Don’t bend it here. Go to Know when to stop.</T>
    </Fig>
  )
}

// fig: bm-res-sticky ResSticky
function ResSticky() {
  return (
    <Fig h={250} view="Sequence · coils that stick" scale="forum order">
      <Stage x={12} y={30} w={148} n={1} head="Magnetism" sub="demagnetise first" />
      <Stage x={166} y={30} w={148} n={2} head="Oil" sub="clean the spring" />
      <Stage x={320} y={30} w={148} n={3} head="Shape" sub="is it flat?" />
      <Panel x={12} y={82} w={148} h={76} />
      <path d="M30 118 Q80 100 142 118 M30 124 Q80 106 142 124" fill="none" stroke={C.steel} strokeWidth="2" />
      <T x={86} y={148} a="middle" s={10} c={C.dim}>steel tweezers too</T>
      <Panel x={166} y={82} w={148} h={76} />
      <path d="M184 118 Q234 100 296 118 M184 126 Q234 108 296 126" fill="none" stroke={C.steel} strokeWidth="2" />
      <ellipse cx={240} cy={112} rx={18} ry={5} fill={LUB.fine} opacity="0.75" />
      <T x={240} y={148} a="middle" s={10} c={C.dim}>oil can glue coils</T>
      <Panel x={320} y={82} w={148} h={76} />
      <line x1={336} y1={128} x2={452} y2={128} stroke={C.struct} />
      <path d="M338 122 Q394 96 450 122" fill="none" stroke={C.ruby} strokeWidth="2" />
      <T x={394} y={148} a="middle" s={10} c={C.dim}>not flat: it can stick</T>
      <Note x={14} y={178} lines={['Dips such as One-Dip and B-Dip are sold. We hold no verified procedure, so follow the label.', 'Horosolv’s listing says to cover the part in a shallow tray for 1 minute, and that it won’t', 'dissolve shellac. That is a seller’s claim.', 'Check: let the balance swing, and watch the coils breathe without touching.']} s={10} lh={15} />
    </Fig>
  )
}

// fig: bm-res-stop ResStop
function ResStop() {
  return (
    <Fig h={224} view="Chart · what to attempt, where to stop" scale="at this level">
      <Panel x={12} y={28} w={222} h={126} title="Worth trying" tc={C.emerald} />
      <Note x={24} y={60} lines={['One coil jumped over its neighbour', 'Coil caught on the stud or pins', 'Coils that stick together', 'A shock spring that won’t seat']} s={11} lh={22} c={C.text} />
      <Panel x={246} y={28} w={222} h={126} title="Stop" tc={C.ruby} />
      <Note x={258} y={60} lines={['A sharp kink in a coil', 'A stretched coil', 'A bent overcoil', 'Coils that won’t lie flat']} s={11} lh={22} c={C.text} />
      <T x={14} y={176} s={11} c={C.text} w="600">When you stop: a complete balance, a donor, or a professional.</T>
      <T x={14} y={193} s={10.5} c={C.dim}>Keep every piece and write down what happened.</T>
      <T x={14} y={208} s={10.5} c={C.dim}>Each extra attempt makes the next person’s job harder.</T>
    </Fig>
  )
}

// fig: bm-res-feet-clock ResFeetClock
function ResFeetClock() {
  const cx = 130
  const cy = 162
  const r = 112
  const f1 = pol(cx, cy, 86, 90 - 48)
  const f2 = pol(cx, cy, 86, 90 - 228)
  const ticks = []
  for (let i = 0; i < 60; i++) {
    const a = pol(cx, cy, r - 2, 90 - i * 6)
    const b = pol(cx, cy, r - (i % 5 ? 6 : 12), 90 - i * 6)
    ticks.push(<line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.dim} strokeWidth={i % 5 ? 0.6 : 1.3} />)
  }
  return (
    <Fig h={306} view="Plan · the clock method" scale="positions as read on the dial">
      <circle cx={cx} cy={cy} r={r} fill="rgba(233,223,202,0.09)" stroke={C.struct} strokeWidth="1.4" />
      {ticks}
      <T x={cx} y={cy - 80} a="middle" s={11} c={C.text}>12</T>
      <T x={cx + 88} y={cy + 4} a="middle" s={11} c={C.text}>3</T>
      <T x={cx} y={cy + 90} a="middle" s={11} c={C.text}>6</T>
      <T x={cx - 88} y={cy + 4} a="middle" s={11} c={C.text}>9</T>
      <line x1={cx} y1={cy} x2={cx} y2={cy - 70} stroke={C.dim} strokeDasharray="3 3" />
      <line x1={cx} y1={cy} x2={f1[0]} y2={f1[1]} stroke={C.brass} />
      <line x1={cx} y1={cy} x2={f2[0]} y2={f2[1]} stroke={C.brass} />
      <path d={`M${cx} ${cy - 34} A34 34 0 0 1 ${pol(cx, cy, 34, 42)[0]} ${pol(cx, cy, 34, 42)[1]}`} fill="none" stroke={C.brassHi} strokeWidth="1.3" />
      <T x={cx + 18} y={cy - 42} s={10.5} c={C.brassHi} mono>48°</T>
      <circle cx={f1[0]} cy={f1[1]} r={6} fill={BRASS} stroke={C.brassHi} />
      <circle cx={f2[0]} cy={f2[1]} r={6} fill={BRASS} stroke={C.brassHi} />
      <circle cx={cx} cy={cy} r={4} fill={C.ground} stroke={C.dim} />
      <Panel x={262} y={30} w={206} h={118} title="Formula" />
      <T x={272} y={72} s={12} c={C.text} mono>hour × 30°</T>
      <T x={272} y={90} s={12} c={C.text} mono>+ minute × 6°</T>
      <T x={272} y={114} s={10.5} c={C.dim}>8 minute mark: 8 × 6 = 48°</T>
      <T x={272} y={130} s={10.5} c={C.dim}>38 minute mark: 38 × 6 = 228°</T>
      <Panel x={262} y={156} w={206} h={138} title="Before you commit" />
      <Note x={272} y={186} lines={['One supplier gives 48° and 228°', 'for an NH35, 3 o’clock crown.', 'Don’t take a foot radius from a', 'table: sources conflict. Measure', 'your own movement, then offer', 'the dial up to check.']} s={10.5} lh={15} c={C.text} />
    </Fig>
  )
}

// fig: bm-res-feet-routes ResFeetRoutes
function ResFeetRoutes() {
  const col = (x, title, glyph, good, bad, verdict, vc) => (
    <g>
      <Panel x={x} y={28} w={148} h={228} title={title} />
      <rect x={x + 12} y={62} width={124} height={7} fill="#e9dfca" stroke={C.struct} />
      <rect x={x + 12} y={94} width={124} height={16} fill={BRASSD} stroke={BRASS} />
      {glyph}
      <T x={x + 10} y={132} s={10} c={C.emerald}>{good[0]}</T>
      {good[1] && <T x={x + 10} y={145} s={10} c={C.emerald}>{good[1]}</T>}
      <T x={x + 10} y={166} s={10} c={C.ruby}>{bad[0]}</T>
      {bad[1] && <T x={x + 10} y={179} s={10} c={C.ruby}>{bad[1]}</T>}
      {bad[2] && <T x={x + 10} y={192} s={10} c={C.ruby}>{bad[2]}</T>}
      <line x1={x + 10} y1={204} x2={x + 138} y2={204} stroke={C.line} />
      <T x={x + 10} y={222} s={10} c={vc}>{verdict[0]}</T>
      <T x={x + 10} y={236} s={10} c={vc}>{verdict[1]}</T>
    </g>
  )
  return (
    <Fig h={306} view="Comparison · a broken dial foot" scale="forum routes">
      {col(12, 'Dial dots', <rect x={52} y={69} width={68} height={25} fill="#b9a77c" stroke="#8a7a54" />, ['quick to do'], ['poor on day-date', 'movements, can jam', 'the date ring'], ['Fine on a plain', 'watch. Check the date.'], C.text)}
      {col(166, 'Glue', <g><rect x={228} y={69} width={8} height={25} fill={BRASS} /><ellipse cx={232} cy={70} rx={12} ry={3.4} fill={LUB.grease} opacity="0.8" /></g>, ['no heat near', 'the dial'], ['strength varies, heat', 'can’t release it'], ['Think before you', 'commit: it stays.'], C.text)}
      {col(320, 'Solder', <g><rect x={382} y={69} width={8} height={25} fill={BRASS} /><ellipse cx={386} cy={70} rx={10} ry={3} fill={C.steel} /></g>, ['the cleanest', 'result'], ['heat risks the', 'dial paint'], ['No procedure here:', 'none is confirmed.'], C.ruby)}
      <T x={14} y={276} s={10.5} c={C.dim}>NH35 and NH36 dials: ideally 0.4 mm thick, with 0.6 mm the practical limit.</T>
      <T x={14} y={291} s={10.5} c={C.text}>Anything under it costs clearance. Check: flat, level, date through all 31, no drag.</T>
    </Fig>
  )
}

/* ================================================================== */
/* Reading technical documents                                          */
/* ================================================================== */
function Sheet({ x, y, w, h }) {
  return <rect x={x} y={y} width={w} height={h} rx="3" fill="#e9dfca" stroke={C.struct} />
}

// fig: bm-doc-cover DocCover
function DocCover() {
  const rows = [['Diameter', '25.60 mm'], ['Height', '4.60 mm'], ['Jewels', '25'], ['Frequency', '28,800 A/h'], ['Lift angle', '50°'], ['Reserve', '38 h min, 42 h typical']]
  return (
    <Fig h={290} view="Layout · first page of a sheet" scale="generic, values for the 2824-2">
      <Sheet x={24} y={34} w={196} h={242} />
      <rect x={38} y={46} width={120} height={9} fill="#6b6155" />
      <rect x={38} y={60} width={80} height={6} fill="#a3988a" />
      <circle cx={122} cy={120} r={40} fill="none" stroke="#6b6155" strokeWidth="1.4" />
      <circle cx={122} cy={120} r={3} fill="#6b6155" />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={38} y={176 + i * 12} width={i % 2 ? 150 : 130} height={5} fill="#a3988a" />)}
      <rect x={38} y={262} width={90} height={6} fill={C.ruby} opacity="0.8" />
      <Lab p={[100, 50]} t={[250, 44]} text="calibre, with its suffix" s={11} a="start" />
      <Lab p={[120, 264]} t={[250, 262]} text="revision and date" sub="CT 2824-2, rev. 25, 06.10.2022" s={11} a="start" c={RUBYHI} />
      <Panel x={246} y={60} w={222} h={158} title="Copy these into your notes" />
      {rows.map(([a, b], i) => (
        <g key={a}>
          <T x={256} y={94 + i * 20} s={11} c={C.dim}>{a}</T>
          <T x={310} y={94 + i * 20} s={11} c={C.text} mono>{b}</T>
        </g>
      ))}
    </Fig>
  )
}

// fig: bm-doc-positions DocPositions
function DocPositions() {
  const parts = [[120, 56, 150, 16, 27], [120, 96, 110, 16, 28], [120, 136, 170, 16, 32], [120, 176, 130, 16, 40]]
  return (
    <Fig h={276} view="Layout · an exploded drawing" scale="generic, not ETA’s drawing">
      <line x1={120} y1={40} x2={120} y2={210} stroke={C.dim} strokeDasharray="4 3" />
      {parts.map(([cx, y, w, h, n]) => (
        <g key={n}>
          <ellipse cx={cx} cy={y + h / 2} rx={w / 2} ry={h / 2} fill={BRASSD} stroke={BRASS} />
          <line x1={cx + w / 2} y1={y + h / 2} x2={226} y2={y + h / 2} stroke={C.struct} strokeWidth="0.8" />
          <circle cx={238} cy={y + h / 2} r={12} fill={C.ground} stroke={C.brass} />
          <T x={238} y={y + h / 2 + 4} a="middle" s={11} c={C.brassHi} mono>{n}</T>
        </g>
      ))}
      <Panel x={268} y={34} w={200} h={166} title="On the 2824-2 sheet" />
      <Rows x={278} y={68} cols={[0, 36]} s={10.5} lh={20} first={C.brassHi} c={C.text} rows={[
        ['27', 'auxiliary reversing wheel'],
        ['28', 'reversing wheel'],
        ['32', 'setting wheel'],
        ['40', 'date jumper'],
      ]} />
      <T x={278} y={160} s={10} c={C.dim}>Numbers run in assembly order.</T>
      <T x={278} y={174} s={10} c={C.dim}>Other sheets number differently.</T>
      <Verdict x={24} y={232} ok={true} r={8} />
      <T x={40} y={236} s={10.5} c={C.text}>Position number: where the part goes, on this sheet only.</T>
      <Verdict x={24} y={256} ok={false} r={8} />
      <T x={40} y={260} s={10.5} c={C.text}>Not an order code. That’s the Swiss part number, such as 401 for a stem.</T>
    </Fig>
  )
}

// fig: bm-doc-symbols DocSymbols
function DocSymbols() {
  const t = [
    ['Lubricant', 'one mark per oil', <path key="a" d="M0 -16 q-13 17 0 26 q13 -9 0 -26 Z" fill={LUB.fine} />],
    ['Very small', 'quantity mark', <path key="b" d="M0 -14 L3.6 -4 L14 -4 L5.6 2.4 L8.8 13 L0 6.6 L-8.8 13 L-5.6 2.4 L-14 -4 L-3.6 -4 Z" fill={C.brass} />],
    ['Do not wash', 'replace if needed', <g key="c"><path d="M-16 -8 L16 -8 L12 12 L-12 12 Z" fill="none" stroke={C.steel} strokeWidth="2" /><path d="M-18 -14 L18 16 M18 -14 L-18 16" stroke={C.ruby} strokeWidth="2.4" /></g>],
    ['Epilame', 'treat these parts', <g key="d"><rect x="-16" y="3" width="32" height="7" fill={STEELD} /><rect x="-16" y="0" width="32" height="3" fill={LUB.epi} /><path d="M-7 0 A9 9 0 0 1 7 0 Z" fill={LUB.fine} /></g>],
    ['Eye protection', 'for all work', <path key="e" d="M-20 0 q4 -11 16 -9 q4 2 4 5 q0 -3 4 -5 q12 -2 16 9 q-5 9 -16 5 q-4 -2 -4 -5 q0 3 -4 5 q-11 4 -16 -5 Z" fill="none" stroke={C.text} strokeWidth="1.3" />],
  ]
  return (
    <Fig h={196} view="Key · the kinds of mark to look for" scale="generic, real marks vary">
      {t.map(([a, b, g], i) => {
        const x = 12 + i * 92
        return (
          <g key={a}>
            <Panel x={x} y={28} w={87} h={112} />
            <g transform={`translate(${x + 43} 70)`}>{g}</g>
            <T x={x + 43} y={112} a="middle" s={10.5} c={C.text}>{a}</T>
            <T x={x + 43} y={127} a="middle" s={10} c={C.dim}>{b}</T>
          </g>
        )
      })}
      <T x={14} y={162} s={10.5} c={C.dim}>Read the sheet’s own key first. These are drawn for this app and aren’t ETA’s symbols.</T>
      <T x={14} y={178} s={10.5} c={C.text}>A mark that isn’t in the key? Don’t guess. Leave that step until you know.</T>
    </Fig>
  )
}

// fig: bm-doc-rev DocRev
function DocRev() {
  const X = (y) => 44 + (y - 2009) * 56
  const ch = [[2009, 1], [2011, 1], [2012, 1], [2013, 2], [2014, 1], [2015, 1], [2016, 2]]
  return (
    <Fig h={206} view="Timeline · lubrication changes" scale="from ETA’s revision log">
      <line x1={30} y1={126} x2={456} y2={126} stroke={C.struct} strokeWidth="2" />
      {Array.from({ length: 8 }, (_, i) => 2009 + i).map((y) => (
        <g key={y}>
          <line x1={X(y)} y1={120} x2={X(y)} y2={132} stroke={C.dim} />
          <T x={X(y)} y={148} a="middle" s={10.5} c={C.dim} mono>{y}</T>
        </g>
      ))}
      {ch.map(([y, n]) => Array.from({ length: n }, (_, i) => <circle key={`${y}-${i}`} cx={X(y)} cy={106 - i * 20} r={7} fill={C.brass} stroke={C.brassHi} />))}
      <T x={240} y={46} a="middle" s={12} c={C.text} w="700">Nine changes in eight years</T>
      <T x={14} y={174} s={10.5} c={C.dim}>Compare dates first when two charts disagree. No date? Treat the chart as old.</T>
      <T x={14} y={190} s={10.5} c={C.text}>Used in this app: CT 2824-2, revision 25, 06.10.2022.</T>
    </Fig>
  )
}

// fig: bm-doc-ladder DocLadder
function DocLadder() {
  const r = [
    ['Maker’s sheet', 'ETA, Ronda, Seiko', 'publish, after checking the date', C.emerald],
    ['A standard’s own text', 'ISO, METAS', 'facts only, never copied text', C.emerald],
    ['Reference page you read', 'calibre sites, magazines', 'usable, with attribution', C.steel],
    ['Supplier page', 'retail listings', 'fine for products, weak on technique', C.brass],
    ['Forum post', 'watchmakers, hobbyists', 'opinion: label it as opinion', C.ruby],
  ]
  return (
    <Fig h={236} view="Ladder · how much to trust a source" scale="strongest at the top">
      {r.map(([a, b, c2, col], i) => {
        const y = 32 + i * 37
        return (
          <g key={a}>
            <rect x={12 + i * 10} y={y} width={456 - i * 20} height={31} rx="4" fill="rgba(255,255,255,0.03)" stroke={col} strokeOpacity="0.7" />
            <T x={22 + i * 10} y={y + 14} s={11} c={C.text} w="600">{a}</T>
            <T x={22 + i * 10} y={y + 27} s={10} c={C.dim}>{b}</T>
            <T x={458 - i * 10} y={y + 20} a="end" s={10.5} c={col}>{c2}</T>
          </g>
        )
      })}
      <T x={14} y={228} s={10.5} c={C.dim}>Can’t say where a number came from? Test it or leave it out.</T>
    </Fig>
  )
}

/* ================================================================== */
/* Take-in, estimates & records                                         */
/* ================================================================== */

// fig: bm-take-sheet TakeSheet
function TakeSheet() {
  const f = [['Owner', 'and contact'], ['Watch', 'make, model, visible numbers'], ['Fault', 'in the owner’s own words'], ['Marks', 'case, crystal, dial, strap'], ['With it', 'links, box, papers']]
  return (
    <Fig h={272} view="Form · one sheet per watch" scale="filled in before you open it">
      <Panel x={12} y={28} w={286} h={232} title="Take-in sheet" />
      {f.map(([a, b], i) => (
        <g key={a}>
          <T x={24} y={66 + i * 36} s={11} c={C.text} w="600">{a}</T>
          <T x={88} y={66 + i * 36} s={10.5} c={C.dim}>{b}</T>
          <line x1={24} y1={78 + i * 36} x2={286} y2={78 + i * 36} stroke={C.line} />
        </g>
      ))}
      <Panel x={306} y={28} w={162} h={232} title="Four photos" />
      <circle cx={354} cy={82} r={22} fill="rgba(233,223,202,0.2)" stroke={C.struct} />
      <T x={354} y={120} a="middle" s={10} c={C.dim}>front</T>
      <circle cx={422} cy={82} r={22} fill="rgba(134,167,189,0.2)" stroke={C.struct} />
      <T x={422} y={120} a="middle" s={10} c={C.dim}>back</T>
      <rect x={330} y={146} width={48} height={22} rx="8" fill="rgba(134,167,189,0.2)" stroke={C.struct} />
      <rect x={376} y={152} width={6} height={10} fill={C.struct} />
      <T x={354} y={186} a="middle" s={10} c={C.dim}>crown side</T>
      <rect x={398} y={146} width={48} height={22} rx="8" fill="rgba(134,167,189,0.2)" stroke={C.struct} />
      <T x={422} y={186} a="middle" s={10} c={C.dim}>far side</T>
      <T x={387} y={222} a="middle" s={10.5} c={C.text}>Show the owner,</T>
      <T x={387} y={236} a="middle" s={10.5} c={C.text}>and agree the list</T>
    </Fig>
  )
}

// fig: bm-take-baseline TakeBaseline
function TakeBaseline() {
  const r = ['Winds', 'Sets', 'Date', 'Pushers', 'Runs']
  return (
    <Fig h={222} view="Form · before and after" scale="example layout">
      <Tag x={14} y={42}>Function</Tag>
      <Tag x={120} y={42}>Before</Tag>
      <Tag x={214} y={42}>After</Tag>
      {r.map((t, i) => (
        <g key={t}>
          <T x={14} y={66 + i * 24} s={11} c={C.text}>{t}</T>
          <rect x={116} y={53 + i * 24} width={78} height={18} rx="3" fill="rgba(255,255,255,0.03)" stroke={C.line} />
          <rect x={210} y={53 + i * 24} width={78} height={18} rx="3" fill="rgba(255,255,255,0.03)" stroke={C.line} />
        </g>
      ))}
      <Panel x={304} y={30} w={164} h={146} title="Timegrapher, dial up" />
      <Note x={316} y={64} lines={['Amplitude: ____°', 'Rate: ____ s/d', 'Beat error: ____ ms', 'Lift angle set: ____°']} s={10.5} lh={21} c={C.text} />
      <T x={14} y={196} s={10.5} c={C.dim}>Won’t run? Write that down too. That’s your baseline.</T>
      <T x={14} y={211} s={10.5} c={C.ruby}>Don’t assume water resistance, however good the case looks.</T>
    </Fig>
  )
}

// fig: bm-take-estimate TakeEstimate
function TakeEstimate() {
  return (
    <Fig h={232} view="Sequence · estimate in two stages" scale="no fixed prices here">
      <Stage x={12} y={32} w={148} h={56} n={1} head="First view" sub="what you can see" />
      <Stage x={166} y={32} w={148} h={56} n={2} head="Open and inspect" sub="what you find" />
      <Stage x={320} y={32} w={148} h={56} n={3} head="Firm answer" sub="before ordering parts" />
      <Panel x={12} y={98} w={456} h={82} title="Put in writing, even if only a text" />
      <Note x={24} y={130} lines={['What you know, what you don’t, and what could change the price or the time.', 'That you’ll stop and ask before going past the amount you agreed.', 'No promise on water resistance unless you’ve tested it.']} s={10.5} lh={15} c={C.text} />
      <T x={14} y={202} s={10.5} c={C.text}>Found something new? Stop and ask before going on.</T>
      <T x={14} y={218} s={10} c={C.faint}>Common-sense practice for a hobbyist. Not legal or business advice.</T>
    </Fig>
  )
}

export const FIGS = {
  'bm-clean-systems': CleanSystems,
  'bm-clean-colour': CleanColour,
  'bm-clean-elma': CleanElma,
  'bm-clean-321': Clean321,
  'bm-clean-shellac': CleanShellac,
  'bm-clean-never': CleanNever,
  'bm-clean-order': CleanOrder,
  'bm-clean-fire': CleanFire,
  'bm-clean-check': CleanCheck,
  'bm-oil-kit': OilKit,
  'bm-oil-map': OilMap,
  'bm-oil-load': OilLoad,
  'bm-oil-sink': OilSink,
  'bm-oil-circle': OilCircle,
  'bm-oil-cap': OilCap,
  'bm-oil-escape': OilEscape,
  'bm-oil-epilame': OilEpilame,
  'bm-oil-proof': OilProof,
  'bm-ms-barrel': MsBarrel,
  'bm-ms-micrometer': MsMicrometer,
  'bm-ms-formula': MsFormula,
  'bm-ms-torque': MsTorque,
  'bm-ms-thirds': MsThirds,
  'bm-ms-conflict': MsConflict,
  'bm-ms-faults': MsFaults,
  'bm-ms-endshake': MsEndshake,
  'bm-ms-wall': MsWall,
  'bm-hand-holes': HandHoles,
  'bm-hand-press': HandPress,
  'bm-hand-index': HandIndex,
  'bm-hand-sweep': HandSweep,
  'bm-hand-loose': HandLoose,
  'bm-hand-chrono': HandChrono,
  'bm-hand-chronofault': HandChronoFault,
  'bm-hand-drill': HandDrill,
  'bm-drv-profile': DrvProfile,
  'bm-drv-fit': DrvFit,
  'bm-drv-worn': DrvWorn,
  'bm-drv-square': DrvSquare,
  'bm-drv-faces': DrvFaces,
  'bm-drv-burr': DrvBurr,
  'bm-drv-tweezers': DrvTweezers,
  'bm-drv-exercise': DrvExercise,
  'bm-lev-plan': LevPlan,
  'bm-lev-cycle': LevCycle,
  'bm-lev-lock': LevLock,
  'bm-lev-draw': LevDraw,
  'bm-lev-drop': LevDrop,
  'bm-lev-run': LevRun,
  'bm-lev-heights': LevHeights,
  'bm-lev-corner': LevCorner,
  'bm-lev-guard': LevGuard,
  'bm-lev-overbank': LevOverbank,
  'bm-lev-order': LevOrder,
  'bm-cal-map': CalMap,
  'bm-cal-window': CalWindow,
  'bm-cal-jumper': CalJumper,
  'bm-cal-inspect': CalInspect,
  'bm-cal-routine': CalRoutine,
  'bm-cal-test': CalTest,
  'bm-cal-faults': CalFaults,
  'bm-cal-cannon': CalCannon,
  'bm-res-search': ResSearch,
  'bm-res-bag': ResBag,
  'bm-res-lyre': ResLyre,
  'bm-res-clone': ResClone,
  'bm-res-tangle': ResTangle,
  'bm-res-walk': ResWalk,
  'bm-res-sticky': ResSticky,
  'bm-res-stop': ResStop,
  'bm-res-feet-clock': ResFeetClock,
  'bm-res-feet-routes': ResFeetRoutes,
  'bm-doc-cover': DocCover,
  'bm-doc-positions': DocPositions,
  'bm-doc-symbols': DocSymbols,
  'bm-doc-rev': DocRev,
  'bm-doc-ladder': DocLadder,
  'bm-take-sheet': TakeSheet,
  'bm-take-baseline': TakeBaseline,
  'bm-take-estimate': TakeEstimate,
}
