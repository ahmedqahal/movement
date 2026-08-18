// Technical plates — clean, labelled SVG recreations of classic
// watchmaking figures (after Kelly, A Practical Course in Horology, 1944,
// and the Joseph Bulova School of Watch Making). Drawn from scratch as
// teaching diagrams, not reproductions of the original artwork.
import { Defs, Gear, escapeWheelPath, spiralPath, polar, arcPath, Jewel } from '../diagrams/primitives'

const T = {
  line: '#5a5142',
  text: '#c2b6a4',
  dim: '#8a8272',
  brass: '#d8ac52',
  steel: '#9fbccd',
  ruby: '#cf6e77',
  blue: '#7aa0d6',
  ink: '#efe8dc',
}

// leader-line label: dot at feature p, text at t
function PL({ p, t, text, anchor = 'start', color = T.text }) {
  return (
    <g style={{ pointerEvents: 'none' }}>
      <line x1={p[0]} y1={p[1]} x2={t[0]} y2={t[1]} stroke={T.line} strokeWidth="0.9" />
      <circle cx={p[0]} cy={p[1]} r="2.4" fill={color} />
      <text x={t[0]} y={t[1]} fontSize="12.5" fill={color} textAnchor={anchor} fontFamily="var(--font-body)">
        {text}
      </text>
    </g>
  )
}
const Cap = ({ x, y, children, anchor = 'middle' }) => (
  <text x={x} y={y} fontSize="13" fontWeight="600" fill={T.brass} textAnchor={anchor} fontFamily="var(--font-display)">
    {children}
  </text>
)

/* ---------------------------------------------------------------- */
/* 1 · Lever escapement — full labelled geometry                     */
/* ---------------------------------------------------------------- */
function PlateEscapement() {
  // to-scale geometry: 15-tooth wheel, pallets ~2.5 teeth (60°) apart on the
  // wheel, a symmetric lever pivot on the line of centres, roller beyond.
  const ew = [232, 250]
  const Rw = 128 // tooth-tip radius
  const rad = (d) => (d * Math.PI) / 180
  const span = 28 // half the pallet span, in degrees (2×28 ≈ 2½ teeth)
  const _px = polar(ew[0], ew[1], Rw, rad(-span))
  const _pe = polar(ew[0], ew[1], Rw, rad(span))
  const Px = [_px.x, _px.y] // exit (upper)
  const Pe = [_pe.x, _pe.y] // entry (lower)
  const O = [430, 250] // fork (pallet-staff) pivot, on the line of centres
  const slot = [O[0] + 98, 250] // fork slot / horns
  const rt = [O[0] + 130, 250] // roller table centre
  const lever = `M${Px[0].toFixed(1)} ${Px[1].toFixed(1)} L${O[0]} ${O[1]} L${Pe[0].toFixed(1)} ${Pe[1].toFixed(1)} M${O[0]} ${O[1]} L${slot[0]} ${slot[1]}`
  return (
    <svg viewBox="0 0 760 470" role="img" aria-label="Lever escapement geometry (to scale)">
      <Defs />
      {/* line of centres */}
      <line x1={ew[0]} y1={ew[1]} x2={rt[0]} y2={rt[1]} stroke={T.line} strokeWidth="0.9" strokeDasharray="4 4" />

      {/* escape wheel — 15 club teeth */}
      <path d={escapeWheelPath(ew[0], ew[1], Rw, 92, 15)} fill="url(#gBrass)" stroke="#6e551d" strokeWidth="1" />
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + 0.5
        const p = polar(ew[0], ew[1], 72, a)
        return <line key={i} x1={ew[0]} y1={ew[1]} x2={p.x} y2={p.y} stroke="#8a7c66" strokeWidth="4" />
      })}
      <Jewel cx={ew[0]} cy={ew[1]} r={5} chaton />
      {/* span arc between the two pallets */}
      <path d={arcPath(ew[0], ew[1], Rw + 12, rad(-span), rad(span))} fill="none" stroke={T.dim} strokeWidth="1" strokeDasharray="3 3" />

      {/* pallet fork: two symmetric arms + fork end */}
      <path d={lever} fill="none" stroke="url(#gSteel)" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      <path d={lever} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" strokeLinecap="round" />
      {/* pallet stones on the wheel */}
      <rect x={Px[0] - 11} y={Px[1] - 7} width="22" height="14" rx="2" transform={`rotate(${-span + 90} ${Px[0]} ${Px[1]})`} fill="url(#gJewel)" stroke="#8f2f3a" strokeWidth="0.8" />
      <rect x={Pe[0] - 11} y={Pe[1] - 7} width="22" height="14" rx="2" transform={`rotate(${span - 90} ${Pe[0]} ${Pe[1]})`} fill="url(#gJewel)" stroke="#8f2f3a" strokeWidth="0.8" />
      {/* fork horns + slot */}
      <path d={`M${slot[0] - 4} 240 L${slot[0] + 14} 234 M${slot[0] - 4} 260 L${slot[0] + 14} 266`} stroke="#48606d" strokeWidth="3" strokeLinecap="round" />
      {/* banking pins flanking the lever */}
      <circle cx={O[0] + 52} cy="230" r="4" fill="url(#gBlue)" stroke="#16233d" strokeWidth="0.7" />
      <circle cx={O[0] + 52} cy="270" r="4" fill="url(#gBlue)" stroke="#16233d" strokeWidth="0.7" />
      <circle cx={O[0]} cy={O[1]} r="6" fill="url(#gDark)" stroke="#48606d" strokeWidth="1" />

      {/* roller table + impulse jewel + crescent + guard pin */}
      <circle cx={rt[0]} cy={rt[1]} r="32" fill="none" stroke="url(#gBrass)" strokeWidth="4" />
      <circle cx={rt[0]} cy={rt[1]} r="11" fill="url(#gSteel)" stroke="#48606d" strokeWidth="1" />
      <path d={`M${rt[0] - 24} ${rt[1] - 9} A32 32 0 0 1 ${rt[0] - 24} ${rt[1] + 9}`} fill="none" stroke="#14110f" strokeWidth="5" />
      <rect x={rt[0] - 30} y={rt[1] - 5} width="10" height="12" rx="2" fill="url(#gJewel)" stroke="#8f2f3a" strokeWidth="0.8" />

      {/* labels */}
      <PL p={[ew[0] - 74, ew[1] - 66]} t={[36, 108]} text="Escape wheel (15 club teeth)" />
      <PL p={[Px[0], Px[1]]} t={[150, 120]} text="Exit (discharging) pallet" />
      <PL p={[Pe[0], Pe[1]]} t={[120, 400]} text="Entry (receiving) pallet" />
      <PL p={[ew[0] + Rw + 12, ew[1]]} t={[300, 432]} text="pallets span ≈ 2½ teeth (60°)" anchor="middle" />
      <PL p={[O[0] - 24, O[1]]} t={[372, 356]} text="Lever (travel ≈ 10°)" anchor="middle" />
      <PL p={[O[0] + 52, 230]} t={[500, 116]} text="Banking pin" />
      <PL p={[slot[0], 250]} t={[600, 116]} text="Fork slot & horns" />
      <PL p={[rt[0] - 28, rt[1]]} t={[678, 176]} text="Roller jewel" />
      <PL p={[rt[0] - 22, rt[1] + 8]} t={[726, 372]} text="Guard pin + crescent" anchor="end" />
      <PL p={[rt[0], rt[1] + 32]} t={[726, 420]} text="Roller table" anchor="end" />
      <text x="60" y="452" fontSize="12" fill={T.dim}>lock ≈ 1.5° · lift ≈ 8.5° · draw ≈ 12°</text>
    </svg>
  )
}

/* ---------------------------------------------------------------- */
/* 2 · Lock · Draw · Impulse                                         */
/* ---------------------------------------------------------------- */
function toothPallet(ox, state) {
  // pallet stone centred ~ (ox+128,150); club tooth engaging from lower-left
  const px = ox + 128
  const py = 150
  // pallet stone: a parallelogram; steep left = locking face, top-right sloped = impulse face
  const pallet = `M${px - 26} ${py - 8} L${px + 22} ${py - 20} L${px + 30} ${py + 2} L${px - 18} ${py + 14} Z`
  // tooth position by state
  let tooth, arrow, note
  if (state === 'lock') {
    tooth = `M${px - 60} ${py + 34} L${px - 30} ${py + 6} L${px - 24} ${py + 16} L${px - 46} ${py + 40} Z`
    note = 'Tooth tip rests on the locking face; the lever sits against its banking pin.'
  } else if (state === 'draw') {
    tooth = `M${px - 60} ${py + 34} L${px - 30} ${py + 6} L${px - 24} ${py + 16} L${px - 46} ${py + 40} Z`
    arrow = (
      <g>
        <path d={`M${px - 8} ${py + 34} q22 8 34 -2`} fill="none" stroke={T.ruby} strokeWidth="2" markerEnd={`url(#pa)`} />
        <text x={px + 34} y={py + 54} fontSize="11.5" fill={T.ruby}>draw ≈ 12°</text>
      </g>
    )
    note = '“Draw” — the angled locking face pulls the fork tight to the bank for safety.'
  } else {
    tooth = `M${px - 46} ${py + 6} L${px - 14} ${py - 14} L${px - 6} ${py - 3} L${px - 34} ${py + 18} Z`
    arrow = (
      <g>
        <path d={`M${px + 24} ${py - 16} l26 -14`} fill="none" stroke={T.brass} strokeWidth="2" markerEnd={`url(#pa)`} />
        <text x={px + 40} y={py - 36} fontSize="11.5" fill={T.brass}>impulse → balance</text>
      </g>
    )
    note = 'Impulse — the tooth’s lifting face drives the pallet, pushing the lever over (lift ≈ 8.5°).'
  }
  return (
    <g>
      <Cap x={ox + 120} y={54}>{state === 'lock' ? '1 · Lock' : state === 'draw' ? '2 · Draw' : '3 · Impulse'}</Cap>
      <path d={tooth} fill="url(#gBrass)" stroke="#6e551d" strokeWidth="0.9" />
      <path d={pallet} fill="url(#gJewel)" stroke="#8f2f3a" strokeWidth="0.9" />
      {arrow}
      {state === 'lock' && (
        <>
          <PL p={[px - 22, py + 2]} t={[ox + 40, py - 44]} text="locking face" />
          <PL p={[px + 4, py - 14]} t={[ox + 150, py - 44]} text="impulse face" />
        </>
      )}
      <text x={ox + 120} y={252} fontSize="11" fill={T.dim} textAnchor="middle">
        <tspan x={ox + 120} dy="0">{note.slice(0, 40)}</tspan>
        <tspan x={ox + 120} dy="15">{note.slice(40)}</tspan>
      </text>
    </g>
  )
}
function PlateLockDrawImpulse() {
  return (
    <svg viewBox="0 0 760 280" role="img" aria-label="Lock, draw and impulse">
      <Defs />
      <marker id="pa" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="#c7b48f" />
      </marker>
      {toothPallet(10, 'lock')}
      <line x1="255" y1="70" x2="255" y2="240" stroke={T.line} strokeWidth="0.8" />
      {toothPallet(255, 'draw')}
      <line x1="505" y1="70" x2="505" y2="240" stroke={T.line} strokeWidth="0.8" />
      {toothPallet(505, 'impulse')}
    </svg>
  )
}

/* ---------------------------------------------------------------- */
/* 3 · Balance truing — flat & round                                 */
/* ---------------------------------------------------------------- */
function PlateTruing() {
  return (
    <svg viewBox="0 0 760 320" role="img" aria-label="Balance truing">
      <Defs />
      {/* side view: true in the flat */}
      <Cap x={200} y={40}>True in the flat (side view)</Cap>
      <line x1="200" y1="70" x2="200" y2="270" stroke={T.steel} strokeWidth="3" />
      <line x1="90" y1="180" x2="310" y2="180" stroke="url(#gBrass)" strokeWidth="6" />
      {/* 90 degree mark */}
      <path d="M200 180 L200 150 M200 150 A30 30 0 0 0 230 180" fill="none" stroke={T.dim} strokeWidth="1" />
      <text x="236" y="162" fontSize="12" fill={T.dim}>90°</text>
      <PL p={[200, 80]} t={[250, 92]} text="staff axis" />
      <PL p={[110, 180]} t={[70, 232]} text="plane of the rim — flat & perpendicular to the staff" />

      {/* top view: true in the round */}
      <Cap x={560} y={40}>True in the round (top view)</Cap>
      <circle cx="560" cy="180" r="92" fill="none" stroke="url(#gBrass)" strokeWidth="6" />
      <circle cx="560" cy="180" r="6" fill="url(#gSteel)" stroke="#48606d" strokeWidth="1" />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const a = (deg * Math.PI) / 180
        const p = polar(560, 180, 92, a)
        return <line key={deg} x1="560" y1="180" x2={p.x} y2={p.y} stroke={T.line} strokeWidth="0.8" strokeDasharray="3 3" />
      })}
      <PL p={[560, 180]} t={[560, 300]} text="every radius equal → rim concentric with the staff" anchor="middle" />
    </svg>
  )
}

/* ---------------------------------------------------------------- */
/* 4 · Balance-spring forms — flat vs Breguet overcoil               */
/* ---------------------------------------------------------------- */
function PlateHairspring() {
  return (
    <svg viewBox="0 0 760 320" role="img" aria-label="Balance spring forms">
      <Defs />
      {/* flat */}
      <Cap x={200} y={40}>Flat balance spring</Cap>
      <path d={spiralPath(200, 175, 8, 78, 5)} fill="none" stroke={T.steel} strokeWidth="1.6" />
      <circle cx="200" cy="175" r="9" fill="url(#gGold)" stroke="#7d6220" strokeWidth="0.8" />
      <circle cx={polar(200, 175, 78, 0).x} cy={polar(200, 175, 78, 0).y} r="4" fill="url(#gBlue)" />
      <PL p={[200, 175]} t={[120, 285]} text="collet (fixes to staff)" />
      <PL p={[278, 175]} t={[250, 285]} text="stud — in the same plane" />

      {/* Breguet overcoil */}
      <Cap x={560} y={40}>Breguet overcoil</Cap>
      <path d={spiralPath(560, 182, 8, 70, 4.25)} fill="none" stroke={T.steel} strokeWidth="1.6" />
      <circle cx="560" cy="182" r="9" fill="url(#gGold)" stroke="#7d6220" strokeWidth="0.8" />
      {/* raised outer coil rising over the body */}
      <path d="M600 130 C640 110 660 150 620 168 C596 178 566 172 560 150" fill="none" stroke={T.brass} strokeWidth="1.8" />
      <circle cx="562" cy="150" r="4" fill="url(#gBlue)" />
      <PL p={[628, 138]} t={[600, 96]} text="outer coil raised over the body" />
      <PL p={[560, 150]} t={[470, 250]} text="better centred elasticity → improved isochronism" />
    </svg>
  )
}

/* ---------------------------------------------------------------- */
/* 5 · Compensating (bimetallic) balance                             */
/* ---------------------------------------------------------------- */
function PlateCompensating() {
  const cx = 250
  const cy = 190
  const R = 120
  return (
    <svg viewBox="0 0 760 380" role="img" aria-label="Compensating balance">
      <Defs />
      <Cap x={250} y={40}>Compensating (bimetallic) balance</Cap>
      {/* bimetallic rim: two arcs, cut near each arm */}
      {[0, 1].map((k) => {
        const a0 = k * Math.PI + 0.14
        const a1 = k * Math.PI + Math.PI - 0.14
        return (
          <g key={k}>
            <path d={arcPath(cx, cy, R, a0, a1)} fill="none" stroke="url(#gBrass)" strokeWidth="9" />
            <path d={arcPath(cx, cy, R - 7, a0, a1)} fill="none" stroke={T.steel} strokeWidth="4" />
          </g>
        )
      })}
      {/* arms + hub */}
      <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="#b6892f" strokeWidth="6" />
      <circle cx={cx} cy={cy} r="10" fill="url(#gDark)" stroke="#6e551d" strokeWidth="1.2" />
      {/* timing screws */}
      {[40, 80, 140, 220, 260, 320].map((deg) => {
        const p = polar(cx, cy, R, (deg * Math.PI) / 180)
        return <circle key={deg} cx={p.x} cy={p.y} r="4" fill="url(#gBlue)" stroke="#16233d" strokeWidth="0.6" />
      })}
      {/* heat: free ends curl inward (dashed) */}
      <path d={arcPath(cx, cy, R - 18, 0.5, 1.35)} fill="none" stroke={T.ruby} strokeWidth="2" strokeDasharray="4 3" />
      <path d="M300 250 q-14 14 -34 16" fill="none" stroke={T.ruby} strokeWidth="1.6" markerEnd="url(#ca)" />
      <marker id="ca" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill={T.ruby} />
      </marker>

      <PL p={[cx, cy - R]} t={[cx + 150, 90]} text="brass (outer)" />
      <PL p={[cx, cy - R + 7]} t={[cx + 150, 118]} text="steel (inner)" />
      <PL p={[cx + R * 0.72, cy - R * 0.72]} t={[cx + 210, 170]} text="timing screws" />
      <PL p={[cx - R + 6, cy - 2]} t={[cx - 40, cy + R + 46]} text="cut near the arm — ends are free to flex" />
      <text x={cx + 150} y={250} fontSize="11.5" fill={T.ruby}>heat → free ends curl inward</text>
      <text x={40} y={362} fontSize="11.5" fill={T.dim}>Corrects temperature error; modern watches instead use Nivarox/Elinvar springs and monometallic balances.</text>
    </svg>
  )
}

/* ---------------------------------------------------------------- */
/* 6 · Wheel & pinion depthing                                       */
/* ---------------------------------------------------------------- */
function PlateDepthing() {
  const w = [250, 200]
  const p = [470, 200]
  const M = 4
  const wTip = 120
  const pTip = 40
  return (
    <svg viewBox="0 0 760 350" role="img" aria-label="Wheel and pinion depthing">
      <Defs />
      <Cap x={380} y={40}>Wheel &amp; pinion — correct depthing</Cap>
      <Gear cx={w[0]} cy={w[1]} r={wTip} teeth={Math.round((2 * (wTip - M)) / M)} module={M} metal="brass" crossings={5} />
      <Gear cx={p[0]} cy={p[1]} r={pTip} teeth={Math.round((2 * (pTip - M)) / M)} module={M} metal="steel" crossings={0} />
      {/* pitch circles (dashed) — tangent at the line of centres */}
      <circle cx={w[0]} cy={w[1]} r={wTip - M} fill="none" stroke={T.dim} strokeWidth="1" strokeDasharray="5 4" />
      <circle cx={p[0]} cy={p[1]} r={pTip - M} fill="none" stroke={T.dim} strokeWidth="1" strokeDasharray="5 4" />
      <line x1={w[0]} y1={w[1]} x2={p[0]} y2={p[1]} stroke={T.line} strokeWidth="0.9" />
      <circle cx={(w[0] + wTip - M + (p[0] - (pTip - M))) / 2} cy={200} r="3" fill={T.ruby} />

      <PL p={[w[0] - 60, w[1] - 60]} t={[70, 110]} text="Wheel (driving)" />
      <PL p={[p[0] + 20, p[1] - 26]} t={[560, 110]} text="Pinion (leaves)" />
      <PL p={[w[0] + wTip - M - 6, w[1] + 40]} t={[300, 300]} text="pitch circles just touch (tangent)" />
      <PL p={[(w[0] + p[0]) / 2, 200]} t={[430, 300]} text="line of centres" anchor="middle" />
    </svg>
  )
}


// Illustrated replacements for the original hand-drawn plates. Each plate keeps
// its id, title, caption and source; only the artwork changed.
const PlateImage = (file) =>
  function PlateArt() {
    return <img className="plate-img" src={file} alt="" loading="lazy" />
  }

export const PLATES = [
  {
    id: 'escapement-geometry',
    title: 'The lever escapement',
    caption:
      'The complete escapement: a 15-tooth club-tooth escape wheel, the pallet fork with its entry (receiving) and exit (discharging) pallet stones, banking pins, and the roller with its safety crescent and guard pin.',
    source: 'after Kelly, A Practical Course in Horology (1944), ch. 3',
    Component: PlateImage('/illustrations/plate-escapement-geometry.webp'),
  },
  {
    id: 'lock-draw-impulse',
    title: 'Lock · Draw · Impulse',
    caption:
      'The three actions of every beat. The tooth locks on the pallet; “draw” holds the fork safely against its banking pin; then the tooth’s impulse face drives the pallet, sending impulse to the balance.',
    source: 'after Kelly, A Practical Course in Horology (1944), ch. 3',
    Component: PlateImage('/illustrations/plate-lock-draw-impulse.webp'),
  },
  {
    id: 'balance-truing',
    title: 'Balance truing — flat & round',
    caption:
      'A true balance sits flat (its rim in one plane, perpendicular to the staff axis) and round (every point of the rim the same distance from the staff). Truing bends the rim until both hold.',
    source: 'after the Joseph Bulova School of Watch Making, Unit 2',
    Component: PlateImage('/illustrations/plate-balance-truing.webp'),
  },
  {
    id: 'hairspring-forms',
    title: 'Balance-spring forms',
    caption:
      'A flat spring has its stud in the plane of the coils, so the centre of gravity wanders. The Breguet “overcoil” raises the outer coil over the body, re-centring the action for better isochronism.',
    source: 'after Kelly, A Practical Course in Horology (1944), ch. 4',
    Component: PlateImage('/illustrations/plate-hairspring-forms.webp'),
  },
  {
    id: 'compensating-balance',
    title: 'The compensating balance',
    caption:
      'A bimetallic rim (brass outside, steel inside) cut near each arm. Heat makes the brass expand more, curling the free ends inward to keep timing steady — the classic cure for temperature error.',
    source: 'after Kelly, A Practical Course in Horology (1944), ch. 4',
    Component: PlateImage('/illustrations/plate-compensating-balance.webp'),
  },
  {
    id: 'depthing',
    title: 'Wheel & pinion depthing',
    caption:
      'Power passes from a wheel to the next pinion. For a smooth, low-friction transfer their pitch circles must just touch at the line of centres — too shallow or too deep and the watch loses amplitude.',
    source: 'after Kelly, A Practical Course in Horology (1944), ch. 1–2',
    Component: PlateImage('/illustrations/plate-depthing.webp'),
  },
]
