import { Defs, Gear, Pinion, Jewel, Screw, Bridge, Perlage, Lighting, spiralPath, escapeWheelPath, gearPath, polar, arcPath } from './primitives'
import { Part, partProps } from './Part'

// Shared module so every wheel meshes the next pinion (matching tooth size).
const M = 2.5
const rpW = (Z) => (M * Z) / 2 + M * 0.95 // wheel tip radius for Gear's `r`

// tooth counts (6497-style going train: barrel → centre → third → fourth → escape)
const COUNTS = {
  barrel: { Zw: 56 },
  centre: { Zp: 10, Zw: 40 },
  third: { Zp: 8, Zw: 32 },
  fourth: { Zp: 8, Zw: 30 },
  escape: { Zp: 7, Zw: 15 },
}
// pitch radii (for mesh distances)
const pr = (Z) => (M * Z) / 2
const D = (deg) => (deg * Math.PI) / 180
// step from point `f` by distance at angle
const step = (f, dist, deg) => [f[0] + dist * Math.cos(D(deg)), f[1] + dist * Math.sin(D(deg))]

// smooth ring (annulus) for the balance rim
function ring(cx, cy, ro, ri) {
  const c = (r, dir) => `M${cx - r},${cy} A${r},${r} 0 1 ${dir} ${cx + r},${cy} A${r},${r} 0 1 ${dir} ${cx - r},${cy} Z`
  return c(ro, 0) + ' ' + c(ri, 1)
}

export default function Mechanical({ parts, selected, onSelect }) {
  const pp = partProps(parts, selected, onSelect)

  // --- lay out the going train so each big wheel meshes the next pinion ---
  const barrel = [292, 168]
  // barrel wheel meshes centre pinion
  const centre = step(barrel, pr(COUNTS.barrel.Zw) + pr(COUNTS.centre.Zp), 46)
  // centre wheel meshes third pinion
  const third = step(centre, pr(COUNTS.centre.Zw) + pr(COUNTS.third.Zp), 118)
  // third wheel meshes fourth pinion
  const fourth = step(third, pr(COUNTS.third.Zw) + pr(COUNTS.fourth.Zp), 178)
  // fourth wheel meshes escape pinion
  const escape = step(fourth, pr(COUNTS.fourth.Zw) + pr(COUNTS.escape.Zp), 58)
  // balance sits beside the escapement (short pallet fork between)
  const bal = [388, 360]
  const R = 60

  return (
    <svg viewBox="0 0 720 470" role="img" aria-label="Mechanical movement diagram">
      <Defs />

      {/* Mainplate + finished bridges */}
      <Part {...pp('mainplate', [360, 40])}>
        <circle cx="360" cy="235" r="212" fill="url(#gPlate)" stroke="#4a3f33" strokeWidth="2.5" filter="url(#grain)" />
        <circle cx="360" cy="235" r="212" fill="none" stroke="rgba(255,240,210,0.12)" strokeWidth="1" />
        <circle cx="360" cy="235" r="212" className="hit" />
        <Perlage cx={360} cy={235} r={210} />
        <Bridge d="M150 150 Q250 108 330 150 Q362 205 318 252 Q236 232 176 252 Q134 208 150 150 Z" angle={22} />
        <Bridge d="M406 150 Q520 150 548 244 Q556 302 500 300 Q476 250 436 224 Q408 192 406 150 Z" angle={-18} />
        <Bridge d="M320 306 Q452 312 456 388 Q414 416 362 386 Q342 344 320 306 Z" angle={30} />
        {[[176, 158], [320, 168], [520, 176], [452, 316], [176, 246], [326, 392]].map(([x, y], i) => (
          <Screw key={i} cx={x} cy={y} r={5.5} angle={i * 35} />
        ))}
      </Part>

      {/* Crown (6497: at 3 o'clock) */}
      <Part {...pp('crown', [672, 210])}>
        <g filter="url(#softShadow)">
          <circle cx="676" cy="235" r="21" fill="url(#gSteel)" stroke="#48606d" strokeWidth="1.4" />
          {Array.from({ length: 14 }).map((_, i) => {
            const a = (i / 14) * Math.PI * 2
            const p1 = polar(676, 235, 16, a)
            const p2 = polar(676, 235, 21, a)
            return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#3f5666" strokeWidth="1.4" />
          })}
          <path d={arcPath(676, 235, 17, Math.PI * 1.15, Math.PI * 1.7)} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="676" cy="235" r="7" fill="url(#gDark)" stroke="#48606d" strokeWidth="1.2" />
        </g>
      </Part>

      {/* Stem */}
      <Part {...pp('stem', [600, 210])}>
        <line x1="654" y1="235" x2="556" y2="235" stroke="#8fa9b8" strokeWidth="7" strokeLinecap="round" />
        <line x1="654" y1="235" x2="556" y2="235" stroke="#d3e0e8" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <rect x="556" y="223" width="100" height="24" className="hit" />
      </Part>

      {/* Mainspring & barrel */}
      <Part {...pp('barrel', barrel)}>
        <g filter="url(#softShadow)">
          <Gear cx={barrel[0]} cy={barrel[1]} r={rpW(COUNTS.barrel.Zw)} teeth={COUNTS.barrel.Zw} module={M} metal="brass" crossings={0} hub={false} />
          <circle cx={barrel[0]} cy={barrel[1]} r={pr(COUNTS.barrel.Zw) - 6} fill="url(#gDark)" stroke="#6e551d" strokeWidth="1.2" />
          <path d={spiralPath(barrel[0], barrel[1], 8, pr(COUNTS.barrel.Zw) - 10, 8)} fill="none" stroke="#dcb35a" strokeWidth="1.5" opacity="0.85" />
          <rect x={barrel[0] - 6} y={barrel[1] - 6} width="12" height="12" fill="#c7b48f" transform={`rotate(45 ${barrel[0]} ${barrel[1]})`} />
        </g>
      </Part>

      {/* Going train — each wheel with a coaxial pinion, meshing the next */}
      <Part {...pp('geartrain', [third[0] - 4, third[1] + 60])}>
        <Gear cx={centre[0]} cy={centre[1]} r={rpW(COUNTS.centre.Zw)} teeth={COUNTS.centre.Zw} module={M} metal="brass" color="#8a7c66" crossings={4} />
        <Pinion cx={centre[0]} cy={centre[1]} leaves={COUNTS.centre.Zp} module={M} />
        <Gear cx={third[0]} cy={third[1]} r={rpW(COUNTS.third.Zw)} teeth={COUNTS.third.Zw} module={M} metal="brass" color="#8a7c66" crossings={3} />
        <Pinion cx={third[0]} cy={third[1]} leaves={COUNTS.third.Zp} module={M} />
        <Gear cx={fourth[0]} cy={fourth[1]} r={rpW(COUNTS.fourth.Zw)} teeth={COUNTS.fourth.Zw} module={M} metal="brass" color="#8a7c66" crossings={3} />
        <Pinion cx={fourth[0]} cy={fourth[1]} leaves={COUNTS.fourth.Zp} module={M} />
      </Part>

      {/* Escape wheel (with its pinion, driven by the fourth wheel) */}
      <Part {...pp('escwheel', [escape[0] + 28, escape[1] - 16])}>
        <g filter="url(#softShadow)">
          <path d={escapeWheelPath(escape[0], escape[1], rpW(COUNTS.escape.Zw), pr(COUNTS.escape.Zw) - M, 15)} fill="url(#gSteel)" stroke="#48606d" strokeWidth="1" />
          {[0, 1, 2].map((i) => {
            const a = (i / 3) * Math.PI * 2 + 0.5
            const p = polar(escape[0], escape[1], pr(COUNTS.escape.Zw) - 6, a)
            return <line key={i} x1={escape[0]} y1={escape[1]} x2={p.x} y2={p.y} stroke="#48606d" strokeWidth="2.2" />
          })}
          <circle cx={escape[0]} cy={escape[1]} r="5" fill="url(#gDark)" stroke="#48606d" strokeWidth="1" />
        </g>
        <Pinion cx={escape[0]} cy={escape[1]} leaves={COUNTS.escape.Zp} module={M} />
      </Part>

      {/* Pallet fork (between escape wheel and balance) */}
      <Part {...pp('pallet', [escape[0] + 40, (escape[1] + bal[1]) / 2 + 20])}>
        {(() => {
          const px = (escape[0] + bal[0]) / 2 + 6
          const py = (escape[1] + bal[1]) / 2 + 6
          return (
            <>
              <path
                d={`M${escape[0] + 8} ${escape[1] + 10} L${px} ${py} L${bal[0] - 40} ${bal[1] - 40}`}
                fill="none"
                stroke="url(#gSteel)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#softShadow)"
              />
              <path d={`M${escape[0] + 8} ${escape[1] + 10} L${px} ${py} L${bal[0] - 40} ${bal[1] - 40}`} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeLinecap="round" />
              <rect x={escape[0] + 2} y={escape[1] + 4} width="12" height="9" rx="1.5" transform={`rotate(-30 ${escape[0] + 8} ${escape[1] + 10})`} fill="url(#gJewel)" stroke="#8f2f3a" strokeWidth="0.6" />
              <circle cx={px} cy={py} r="4.5" fill="url(#gDark)" stroke="#48606d" strokeWidth="1" />
            </>
          )
        })()}
      </Part>

      {/* Balance wheel */}
      <Part {...pp('balance', [bal[0] + 74, bal[1] + 6])}>
        <g filter="url(#softShadow)">
          <path d={ring(bal[0], bal[1], R, R - 8)} fillRule="evenodd" fill="url(#gBrass)" stroke="#6e551d" strokeWidth="0.8" />
          <path d={arcPath(bal[0], bal[1], R - 4, Math.PI * 1.15, Math.PI * 1.75)} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.4" strokeLinecap="round" />
          {[0, 1, 2].map((i) => {
            const a = (i / 3) * Math.PI * 2 + 0.5
            const p = polar(bal[0], bal[1], R - 6, a)
            return <line key={i} x1={bal[0]} y1={bal[1]} x2={p.x} y2={p.y} stroke="#b6892f" strokeWidth="4.5" />
          })}
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i / 8) * Math.PI * 2
            const p = polar(bal[0], bal[1], R, a)
            return <circle key={i} cx={p.x} cy={p.y} r="3.6" fill="url(#gBlue)" stroke="#16233d" strokeWidth="0.6" />
          })}
        </g>
        <path d={arcPath(bal[0], bal[1], R + 8, Math.PI * 1.7, Math.PI * 1.95)} fill="none" stroke="#8fa9b8" strokeWidth="2" />
      </Part>

      {/* Hairspring */}
      <Part {...pp('hairspring', [bal[0], bal[1]])}>
        <path d={spiralPath(bal[0], bal[1], 4, 36, 6)} fill="none" stroke="#cfd9df" strokeWidth="1" opacity="0.95" />
        <circle cx={bal[0]} cy={bal[1]} r="40" className="hit" />
      </Part>

      {/* Jewels in gold chatons */}
      <Part {...pp('jewels', [third[0] + 2, third[1] - 40])}>
        <Jewel cx={third[0]} cy={third[1]} r={4} chaton screws />
        <Jewel cx={fourth[0]} cy={fourth[1]} r={4} chaton screws />
        <Jewel cx={escape[0]} cy={escape[1]} r={3.4} chaton />
        <Jewel cx={bal[0]} cy={bal[1]} r={3.4} chaton />
      </Part>

      <Lighting w={720} h={470} />
    </svg>
  )
}
