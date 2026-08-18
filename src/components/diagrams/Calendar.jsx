import { Defs, Gear, polar, Lighting } from './primitives'
import { Part, partProps } from './Part'

const C = [360, 262]
const R_OUT = 172
const R_IN = 120
const R_NUM = 144
const TEETH = 31
const STEP = 360 / TEETH

export default function Calendar({ parts, selected, onSelect }) {
  const pp = partProps(parts, selected, onSelect)

  // inner ratchet teeth (triangles pointing inward)
  const teeth = []
  for (let i = 0; i < TEETH; i++) {
    const a = (i * STEP - 90) * (Math.PI / 180)
    const half = (STEP * 0.32) * (Math.PI / 180)
    const base1 = polar(C[0], C[1], R_IN, a - half)
    const base2 = polar(C[0], C[1], R_IN, a + half)
    const tip = polar(C[0], C[1], R_IN - 12, a)
    teeth.push(`M${base1.x.toFixed(1)},${base1.y.toFixed(1)} L${tip.x.toFixed(1)},${tip.y.toFixed(1)} L${base2.x.toFixed(1)},${base2.y.toFixed(1)}`)
  }

  return (
    <svg viewBox="0 0 720 470" role="img" aria-label="Calendar (date works) diagram">
      <Defs />

      {/* faint plate */}
      <circle cx={C[0]} cy={C[1]} r="196" fill="url(#gPlate)" stroke="#3a3128" strokeWidth="2" opacity="0.55" />

      {/* Date indicator ring — rotates one tooth per "day" */}
      <Part {...pp('cal-ring', [C[0], C[1] + R_OUT - 8])}>
        <g className="cal-ring-anim" style={{ transformBox: 'view-box', transformOrigin: `${C[0]}px ${C[1]}px` }}>
          <circle cx={C[0]} cy={C[1]} r={R_OUT} fill="none" stroke="#6a5c46" strokeWidth="2" />
          <circle cx={C[0]} cy={C[1]} r={R_IN} fill="none" stroke="#6a5c46" strokeWidth="1.4" />
          {/* ring band */}
          <path
            d={`M${C[0] - R_OUT},${C[1]} A${R_OUT},${R_OUT} 0 1 0 ${C[0] + R_OUT},${C[1]} A${R_OUT},${R_OUT} 0 1 0 ${C[0] - R_OUT},${C[1]} Z M${C[0] - R_IN},${C[1]} A${R_IN},${R_IN} 0 1 1 ${C[0] + R_IN},${C[1]} A${R_IN},${R_IN} 0 1 1 ${C[0] - R_IN},${C[1]} Z`}
            fill="url(#gBrass)"
            fillRule="evenodd"
            opacity="0.9"
            stroke="#6e551d"
            strokeWidth="0.6"
          />
          {teeth.map((d, i) => (
            <path key={i} d={d} fill="#2a2114" stroke="#4a3f2a" strokeWidth="0.6" />
          ))}
          {/* numbers 1–31, radial so the one at the window reads upright */}
          {Array.from({ length: TEETH }).map((_, k) => {
            const ang = k * STEP - 90
            const p = polar(C[0], C[1], R_NUM, ang * (Math.PI / 180))
            return (
              <text
                key={k}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="14"
                fontWeight="600"
                fill="#2a2114"
                fontFamily="var(--font-body)"
                transform={`rotate(${k * STEP} ${p.x} ${p.y})`}
              >
                {k + 1}
              </text>
            )
          })}
        </g>
      </Part>

      {/* Date window — fixed aperture at the top of the ring */}
      <Part {...pp('cal-window', [C[0] + 70, C[1] - R_NUM])}>
        <rect x={C[0] - 22} y={C[1] - R_NUM - 18} width="44" height="36" rx="4" fill="none" stroke="#efe8dc" strokeWidth="2.4" />
        <rect x={C[0] - 22} y={C[1] - R_NUM - 18} width="44" height="36" rx="4" fill="#100d0b" opacity="0.15" />
      </Part>

      {/* Date driving wheel — turns once a day; its finger flicks the ring */}
      <Part {...pp('cal-driver', [C[0] - 62, C[1] + 118])}>
        <g className="cal-driver-anim" style={{ transformBox: 'view-box', transformOrigin: `${C[0]}px ${C[1] + 86}px` }}>
          <Gear cx={C[0]} cy={C[1] + 86} r={26} teeth={22} metal="brass" color="#8a7c66" crossings={3} />
          {/* finger / beak reaching outward to flick the ring's inner teeth */}
          <path d={`M${C[0] - 5} ${C[1] + 72} L${C[0]} ${C[1] + 122} L${C[0] + 5} ${C[1] + 72} Z`} fill="url(#gSteel)" stroke="#48606d" strokeWidth="1" />
        </g>
      </Part>

      {/* Date jumper — sprung lever holding the ring, snaps at each change */}
      <Part {...pp('cal-jumper', [C[0] + 150, C[1] - 70])}>
        <path d={`M${C[0] + R_IN + 4} ${C[1]} L${C[0] + 96} ${C[1] - 40} Q${C[0] + 150} ${C[1] - 60} ${C[0] + 150} ${C[1] - 8}`} fill="none" stroke="#c7b48f" strokeWidth="4.5" strokeLinecap="round" />
        {/* V tip against a tooth */}
        <path d={`M${C[0] + R_IN + 12} ${C[1] - 7} L${C[0] + R_IN - 2} ${C[1]} L${C[0] + R_IN + 12} ${C[1] + 7} Z`} fill="url(#gSteel)" stroke="#48606d" strokeWidth="1" />
        <circle cx={C[0] + 150} cy={C[1] - 8} r="5" fill="url(#gDark)" stroke="#c7b48f" strokeWidth="1.4" />
      </Part>

      {/* Quick-set corrector — meshes the ring at an intermediate crown position */}
      <Part {...pp('cal-quickset', [C[0] - 150, C[1] + 40])}>
        <Gear cx={C[0] - R_IN - 4} cy={C[1]} r={20} teeth={16} metal="steel" color="#5a778a" crossings={3} />
        <line x1={C[0] - R_IN - 24} y1={C[1]} x2={C[0] - 150} y2={C[1] + 24} stroke="#86a7bd" strokeWidth="3" strokeDasharray="4 3" />
      </Part>

      {/* Hour wheel — the 24h drive input at the centre */}
      <Part {...pp('cal-hourwheel', [C[0] + 8, C[1] + 4])}>
        <Gear cx={C[0]} cy={C[1]} r={30} teeth={24} metal="brass" color="#8a7c66" crossings={4} />
        <circle cx={C[0]} cy={C[1]} r="8" fill="url(#gDark)" stroke="#8a7c66" strokeWidth="1.2" />
        <text x={C[0]} y={C[1] + 52} textAnchor="middle" fontSize="10.5" fill="#b3a898">hour wheel → 24 h</text>
      </Part>

      <Lighting w={720} h={470} strength={0.4} />
    </svg>
  )
}
