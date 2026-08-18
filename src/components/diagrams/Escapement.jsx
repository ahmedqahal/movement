import { Defs, escapeWheelPath, polar, arcPath, Jewel, Screw } from './primitives'
import { Part, partProps } from './Part'

// To-scale lever escapement with a synchronised beat:
// balance swings smoothly; the fork flips as the balance crosses centre;
// the escape wheel steps one tooth (24° of a 15-tooth wheel) per flip.
export default function Escapement({ parts, selected, onSelect }) {
  const pp = partProps(parts, selected, onSelect)
  const rad = (d) => (d * Math.PI) / 180
  const ew = [206, 236] // escape-wheel centre
  const Rw = 120 // tooth-tip radius
  const O = [402, 236] // pallet-fork pivot (on the line of centres)
  const slot = [514, 236] // fork slot / horns
  const bal = [536, 236] // balance centre (roller here)
  const balR = 60
  const rollerR = 17
  const span = 28 // half pallet span (° on the wheel)
  const px = polar(ew[0], ew[1], Rw, rad(-span)) // exit (upper) pallet
  const pe = polar(ew[0], ew[1], Rw, rad(span)) // entry (lower) pallet

  const R = '#c25863'
  const numBadge = (num, x, y) => (
    <g style={{ pointerEvents: 'none' }}>
      <circle cx={x} cy={y} r="12.5" fill="#14110f" stroke={R} strokeWidth="1.6" />
      <text x={x} y={y + 4.5} textAnchor="middle" fontSize="13" fontWeight="700" fill={R} fontFamily="var(--font-body)">
        {num}
      </text>
    </g>
  )

  return (
    <svg viewBox="0 0 720 470" role="img" aria-label="Animated lever escapement (to scale)">
      <Defs />
      {/* line of centres */}
      <line x1={ew[0]} y1={ew[1]} x2={bal[0]} y2={bal[1]} stroke="#4a3f33" strokeWidth="0.9" strokeDasharray="4 4" />

      {/* Escape wheel — steps one tooth per beat */}
      <g className="esc-wheel-anim" style={{ transformBox: 'view-box', transformOrigin: `${ew[0]}px ${ew[1]}px` }}>
        <Part {...pp('esc-wheel', null)}>
          <path d={escapeWheelPath(ew[0], ew[1], Rw, 86, 15)} fill="url(#gSteel)" stroke="#48606d" strokeWidth="1.3" filter="url(#softShadow)" />
          <path d={arcPath(ew[0], ew[1], Rw - 14, Math.PI * 1.15, Math.PI * 1.7)} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
          {[0, 1, 2, 3].map((i) => {
            const a = (i / 4) * Math.PI * 2 + 0.4
            const p = polar(ew[0], ew[1], 78, a)
            return <line key={i} x1={ew[0]} y1={ew[1]} x2={p.x} y2={p.y} stroke="#48606d" strokeWidth="5" />
          })}
          <circle cx={ew[0]} cy={ew[1]} r="16" fill="url(#gDark)" stroke="#48606d" strokeWidth="1.6" />
        </Part>
      </g>

      {/* Pallet fork — rocks between banking pins, in sync with the balance */}
      <g className="esc-fork-anim" style={{ transformBox: 'view-box', transformOrigin: `${O[0]}px ${O[1]}px` }}>
        <Part {...pp('esc-fork', null)}>
          <path
            d={`M${px.x.toFixed(1)} ${px.y.toFixed(1)} L${O[0]} ${O[1]} L${pe.x.toFixed(1)} ${pe.y.toFixed(1)} M${O[0]} ${O[1]} L${slot[0]} ${slot[1]}`}
            fill="none"
            stroke="url(#gSteel)"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#softShadow)"
          />
          <path
            d={`M${px.x.toFixed(1)} ${px.y.toFixed(1)} L${O[0]} ${O[1]} L${pe.x.toFixed(1)} ${pe.y.toFixed(1)} M${O[0]} ${O[1]} L${slot[0]} ${slot[1]}`}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* fork horns / slot */}
          <path d={`M${slot[0] - 2} 224 L${slot[0] + 14} 218 M${slot[0] - 2} 248 L${slot[0] + 14} 254`} stroke="#48606d" strokeWidth="3" strokeLinecap="round" />
        </Part>
        <Part {...pp('esc-entry', null)}>
          <rect x={px.x - 11} y={px.y - 7} width="22" height="14" rx="2" transform={`rotate(${-span + 90} ${px.x} ${px.y})`} fill="url(#gJewel)" stroke="#8f2f3a" strokeWidth="0.8" />
          <rect x={pe.x - 11} y={pe.y - 7} width="22" height="14" rx="2" transform={`rotate(${span - 90} ${pe.x} ${pe.y})`} fill="url(#gJewel)" stroke="#8f2f3a" strokeWidth="0.8" />
        </Part>
      </g>

      {/* Banking pins (fixed to the plate) */}
      <circle cx={O[0] + 40} cy="216" r="4" fill="url(#gBlue)" stroke="#16233d" strokeWidth="0.7" />
      <circle cx={O[0] + 40} cy="256" r="4" fill="url(#gBlue)" stroke="#16233d" strokeWidth="0.7" />
      <circle cx={O[0]} cy={O[1]} r="6" fill="url(#gDark)" stroke="#48606d" strokeWidth="1" />

      {/* Balance — swings ±38°, carrying the roller + impulse jewel */}
      <g className="esc-balance-anim" style={{ transformBox: 'view-box', transformOrigin: `${bal[0]}px ${bal[1]}px` }}>
        <Part {...pp('esc-balance', null)}>
          <circle cx={bal[0]} cy={bal[1]} r={balR} fill="none" stroke="url(#gBrass)" strokeWidth="7" filter="url(#softShadow)" />
          <circle cx={bal[0]} cy={bal[1]} r={balR} fill="none" stroke="#6e551d" strokeWidth="0.8" />
          {[0, 1, 2].map((i) => {
            const a = (i / 3) * Math.PI * 2 + rad(90)
            const p = polar(bal[0], bal[1], balR - 4, a)
            return <line key={i} x1={bal[0]} y1={bal[1]} x2={p.x} y2={p.y} stroke="#b6892f" strokeWidth="4" />
          })}
          <circle cx={bal[0]} cy={bal[1]} r={rollerR} fill="url(#gSteel)" stroke="#48606d" strokeWidth="1.2" />
        </Part>
        <Part {...pp('esc-impulse', null)}>
          <rect x={bal[0] - rollerR - 6} y={bal[1] - 5} width="10" height="12" rx="2" fill="url(#gJewel)" stroke="#8f2f3a" strokeWidth="0.8" />
        </Part>
      </g>
      {/* balance staff bearing (fixed) */}
      <Jewel cx={bal[0]} cy={bal[1]} r={5} chaton />
      <Jewel cx={ew[0]} cy={ew[1]} r={5} chaton />

      {/* static numbered badges (don't rotate with the parts) */}
      {numBadge(1, ew[0], ew[1] + Rw + 24)}
      {numBadge(2, O[0], O[1] + 92)}
      {numBadge(3, pe.x - 30, pe.y + 34)}
      {numBadge(4, bal[0] - rollerR - 26, bal[1] - 40)}
      {numBadge(5, bal[0] + balR + 22, bal[1])}

      <text x="360" y="446" textAnchor="middle" fontSize="13" fill="#7d7264" fontStyle="italic">
        One beat: the balance unlocks the fork at centre, the wheel steps one tooth and impulses the balance, then locks again.
      </text>
    </svg>
  )
}
