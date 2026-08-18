import { Defs, Gear, polar, Lighting } from './primitives'
import { Part, partProps } from './Part'

export default function Quartz({ parts, selected, onSelect }) {
  const pp = partProps(parts, selected, onSelect)
  const motor = [492, 248]
  return (
    <svg viewBox="0 0 720 430" role="img" aria-label="Quartz movement diagram">
      <Defs />
      <marker id="arrowQ" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0 0 L10 5 L0 10 z" fill="#8a7c66" />
      </marker>

      {/* Board / module */}
      <Part {...pp('q-board', [636, 388])}>
        <rect x="44" y="42" width="632" height="346" rx="20" fill="url(#gPlate)" stroke="#4a3f33" strokeWidth="2.5" filter="url(#softShadow)" />
        <rect x="44" y="42" width="632" height="346" rx="20" className="hit" />
        {/* routed copper traces with pads/vias */}
        <g stroke="#7a6a44" strokeWidth="1.6" opacity="0.55" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M132 250 L132 330 L250 330 L250 300" />
          <path d="M300 196 L300 226 L360 226" />
          <path d="M378 150 L410 150 L410 128" />
          <path d="M462 150 L462 190" />
          <path d="M486 214 L486 196 L540 196 L540 120 L470 120" />
          <path d="M110 120 L200 120 L200 150" />
        </g>
        {[[132, 330], [250, 300], [360, 226], [410, 128], [200, 150], [470, 120]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="none" stroke="#8a7856" strokeWidth="1.4" opacity="0.6" />
        ))}
      </Part>

      {/* signal-flow arrows: crystal → IC → coil → motor → train */}
      <g style={{ pointerEvents: 'none' }} stroke="#8a7c66" strokeWidth="2.2" fill="none" markerEnd="url(#arrowQ)">
        <path d="M320 244 L320 192" />
        <path d="M382 150 L430 150" />
        <path d="M486 178 L490 214" />
        <path d="M522 250 L556 266" />
      </g>

      {/* Battery */}
      <Part {...pp('q-battery', [130, 300])}>
        <g filter="url(#softShadow)">
          <circle cx="132" cy="172" r="76" fill="url(#gBrass)" stroke="#7d6220" strokeWidth="2" />
          <circle cx="132" cy="172" r="56" fill="none" stroke="#7d6220" strokeWidth="1" opacity="0.5" />
          <text x="132" y="164" textAnchor="middle" fontSize="34" fontWeight="700" fill="#3a2e12">+</text>
          <text x="132" y="196" textAnchor="middle" fontSize="13" fill="#4a3c18">1.55 V</text>
        </g>
      </Part>

      {/* IC */}
      <Part {...pp('q-ic', [320, 92])}>
        <g filter="url(#softShadow)">
          <rect x="278" y="118" width="100" height="68" rx="5" fill="#15130f" stroke="#86a7bd" strokeWidth="2" />
          {Array.from({ length: 5 }).map((_, i) => (
            <g key={i} stroke="#86a7bd" strokeWidth="2">
              <line x1={292 + i * 18} y1="118" x2={292 + i * 18} y2="108" />
              <line x1={292 + i * 18} y1="186" x2={292 + i * 18} y2="196" />
            </g>
          ))}
          <circle cx="292" cy="132" r="3" fill="#86a7bd" />
          <text x="330" y="150" textAnchor="middle" fontSize="12" fill="#a9c0cf" fontFamily="var(--font-mono)">IC</text>
          <text x="330" y="168" textAnchor="middle" fontSize="8.5" fill="#6f8b9c" fontFamily="var(--font-mono)">÷ 2¹⁵</text>
        </g>
      </Part>

      {/* Quartz crystal — a small metal can */}
      <Part {...pp('q-crystal', [320, 330])}>
        <g filter="url(#softShadow)">
          <rect x="266" y="246" width="108" height="40" rx="20" fill="url(#gSteel)" stroke="#4a6274" strokeWidth="2" />
          <ellipse cx="286" cy="266" rx="8" ry="15" fill="none" stroke="#3f5666" strokeWidth="1.4" opacity="0.7" />
          <text x="326" y="271" textAnchor="middle" fontSize="12" fill="#183038" fontFamily="var(--font-mono)">32,768 Hz</text>
        </g>
      </Part>

      {/* Coil — bobbin with fine winding, and a pulse glow */}
      <Part {...pp('q-coil', [452, 100])}>
        <g filter="url(#softShadow)">
          <rect className="quartz-pulse-anim" x="428" y="122" width="66" height="56" rx="5" fill="#e8c675" opacity="0.12" />
          {/* bobbin flanges */}
          <rect x="430" y="120" width="62" height="6" rx="2" fill="#5a778a" />
          <rect x="430" y="174" width="62" height="6" rx="2" fill="#5a778a" />
          {/* fine winding */}
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={i} x1="432" y1={128 + i * 3.7} x2="490" y2={128 + i * 3.7} stroke="#c9a24a" strokeWidth="1.5" opacity="0.85" />
          ))}
          {/* soft-iron core through the middle */}
          <rect x="455" y="118" width="12" height="64" rx="2" fill="url(#gSteel)" stroke="#4a6274" strokeWidth="1" opacity="0.9" />
        </g>
      </Part>

      {/* Stepper motor — stator poles + a rotor magnet that steps 180°/sec */}
      <Part {...pp('q-motor', [492, 312])}>
        <g filter="url(#softShadow)">
          {/* soft-iron stator embracing the rotor with two pole gaps */}
          <circle cx={motor[0]} cy={motor[1]} r="32" fill="none" stroke="#5a778a" strokeWidth="9" />
          <circle cx={motor[0]} cy={motor[1]} r="32" fill="none" stroke="#7f9dae" strokeWidth="2" opacity="0.6" />
          {/* pole notches (top-left / bottom-right) */}
          <line x1={polar(motor[0], motor[1], 24, -Math.PI * 0.75).x} y1={polar(motor[0], motor[1], 24, -Math.PI * 0.75).y} x2={polar(motor[0], motor[1], 40, -Math.PI * 0.75).x} y2={polar(motor[0], motor[1], 40, -Math.PI * 0.75).y} stroke="#141110" strokeWidth="4" />
          <line x1={polar(motor[0], motor[1], 24, Math.PI * 0.25).x} y1={polar(motor[0], motor[1], 24, Math.PI * 0.25).y} x2={polar(motor[0], motor[1], 40, Math.PI * 0.25).x} y2={polar(motor[0], motor[1], 40, Math.PI * 0.25).y} stroke="#141110" strokeWidth="4" />
          {/* rotor magnet (N/S), steps 180° each second */}
          <g className="quartz-rotor-anim" style={{ transformBox: 'view-box', transformOrigin: `${motor[0]}px ${motor[1]}px` }}>
            <circle cx={motor[0]} cy={motor[1]} r="15" fill="url(#gDark)" stroke="#4a6274" strokeWidth="1.5" />
            <path d={`M${motor[0]} ${motor[1] - 13} A13 13 0 0 1 ${motor[0]} ${motor[1] + 13} Z`} fill="#c25863" opacity="0.85" />
            <path d={`M${motor[0]} ${motor[1] - 13} A13 13 0 0 0 ${motor[0]} ${motor[1] + 13} Z`} fill="#5a778a" opacity="0.85" />
            <circle cx={motor[0]} cy={motor[1]} r="3.4" fill="#0e0c0a" />
          </g>
        </g>
      </Part>

      {/* Gear train */}
      <Part {...pp('q-train', [606, 330])}>
        <Gear cx={578} cy={296} r={30} teeth={24} metal="steel" color="#5a778a" crossings={4} />
        <Gear cx={624} cy={240} r={22} teeth={18} metal="steel" color="#5a778a" crossings={4} />
      </Part>

      <Lighting w={720} h={430} strength={0.4} />
    </svg>
  )
}
