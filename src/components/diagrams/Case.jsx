import { Defs, Lighting } from './primitives'
import { Part, partProps } from './Part'

// small vertical sawtooth (screw thread profile) along x, from y0 to y1
function thread(x, y0, y1, dir = 1, teeth = 5) {
  const step = (y1 - y0) / teeth
  let d = `M${x} ${y0}`
  for (let i = 0; i < teeth; i++) {
    d += ` l${4 * dir} ${step / 2} l${-4 * dir} ${step / 2}`
  }
  return d
}

export default function Case({ parts, selected, onSelect }) {
  const pp = partProps(parts, selected, onSelect)
  return (
    <svg viewBox="0 0 720 470" role="img" aria-label="Watch case cross-section">
      <Defs />
      <linearGradient id="gCase" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#b9b1a1" />
        <stop offset="50%" stopColor="#8a8272" />
        <stop offset="100%" stopColor="#5c554a" />
      </linearGradient>

      {/* Case middle / body — the two band walls, with a movement seat and thread cut at the back */}
      <Part {...pp('c-middle', [120, 272])}>
        <path d="M178 188 L212 188 L212 262 L224 268 L224 330 L212 336 L212 358 L178 358 Z" fill="url(#gCase)" stroke="#4a453b" strokeWidth="2" strokeLinejoin="round" filter="url(#softShadow)" />
        <path d="M542 188 L508 188 L508 262 L496 268 L496 330 L508 336 L508 358 L542 358 Z" fill="url(#gCase)" stroke="#4a453b" strokeWidth="2" strokeLinejoin="round" filter="url(#softShadow)" />
        {/* screw threads where the caseback engages the band */}
        <path d={thread(212, 336, 356, 1)} fill="none" stroke="#3b352d" strokeWidth="1.3" />
        <path d={thread(508, 336, 356, -1)} fill="none" stroke="#3b352d" strokeWidth="1.3" />
      </Part>

      {/* Bezel — rings that trap the crystal */}
      <Part {...pp('c-bezel', [130, 150])}>
        <path d="M178 166 L218 166 L218 188 L178 188 Z" fill="url(#gCase)" stroke="#4a453b" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M542 166 L502 166 L502 188 L542 188 Z" fill="url(#gCase)" stroke="#4a453b" strokeWidth="1.6" strokeLinejoin="round" />
      </Part>

      {/* Crystal — domed, seated on the case ledge, with a tension ring */}
      <Part {...pp('c-crystal', [360, 92])}>
        <path d="M216 188 Q360 128 504 188 L504 194 Q360 138 216 194 Z" fill="url(#gSteel)" stroke="#a9c0cf" strokeWidth="1.6" opacity="0.9" />
        <rect x="214" y="184" width="10" height="10" rx="2" fill="url(#gSteel)" stroke="#4a6274" strokeWidth="1" opacity="0.9" />
        <rect x="496" y="184" width="10" height="10" rx="2" fill="url(#gSteel)" stroke="#4a6274" strokeWidth="1" opacity="0.9" />
      </Part>

      {/* Crystal gasket — O-ring cross-sections seated in the groove */}
      <Part {...pp('c-crystal-gasket', [150, 150])}>
        <circle cx="211" cy="189" r="5" fill="#2a3b45" stroke="#86a7bd" strokeWidth="1.6" />
        <circle cx="509" cy="189" r="5" fill="#2a3b45" stroke="#86a7bd" strokeWidth="1.6" />
      </Part>

      {/* Movement, dial & hands, resting on the movement seat */}
      <Part {...pp('c-movement', [360, 420])}>
        <rect x="224" y="262" width="272" height="70" rx="5" fill="url(#gPlate)" stroke="#8a7c66" strokeWidth="1.6" />
        <line x1="216" y1="256" x2="504" y2="256" stroke="#c7b48f" strokeWidth="3.5" />
        <line x1="360" y1="256" x2="360" y2="222" stroke="#efe8dc" strokeWidth="2.6" strokeLinecap="round" />
        <line x1="360" y1="256" x2="392" y2="238" stroke="#efe8dc" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="360" cy="256" r="4" fill="#d0a84f" />
        <text x="360" y="304" textAnchor="middle" fontSize="12" fill="#b3a898">movement</text>
      </Part>

      {/* Caseback — screws up into the band */}
      <Part {...pp('c-caseback', [360, 434])}>
        <path d="M206 358 L514 358 L514 380 Q514 388 506 388 L214 388 Q206 388 206 380 Z" fill="url(#gCase)" stroke="#4a453b" strokeWidth="2" strokeLinejoin="round" filter="url(#softShadow)" />
        <text x="360" y="376" textAnchor="middle" fontSize="10.5" fill="#3b352d">caseback</text>
      </Part>

      {/* Caseback gasket — O-ring cross-sections in the back groove */}
      <Part {...pp('c-back-gasket', [600, 388])}>
        <circle cx="209" cy="356" r="5" fill="#2a3b45" stroke="#86a7bd" strokeWidth="1.6" />
        <circle cx="511" cy="356" r="5" fill="#2a3b45" stroke="#86a7bd" strokeWidth="1.6" />
      </Part>

      {/* Crown, tube & gasket through the band wall */}
      <Part {...pp('c-crown-tube', [654, 250])}>
        {/* case tube */}
        <rect x="542" y="248" width="46" height="24" rx="3" fill="url(#gCase)" stroke="#4a453b" strokeWidth="1.6" />
        {/* crown gasket inside the tube */}
        <circle cx="574" cy="260" r="4.5" fill="#2a3b45" stroke="#86a7bd" strokeWidth="1.4" />
        {/* crown */}
        <rect x="588" y="240" width="30" height="40" rx="6" fill="url(#gSteel)" stroke="#4a6274" strokeWidth="2" />
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={i} x1={594 + i * 4} y1="240" x2={594 + i * 4} y2="280" stroke="#3f5666" strokeWidth="1.2" />
        ))}
        {/* stem into the movement */}
        <line x1="542" y1="260" x2="496" y2="260" stroke="#86a7bd" strokeWidth="3" />
      </Part>

      {/* Lugs & spring bars */}
      <Part {...pp('c-lugs', [120, 150])}>
        <path d="M178 190 L150 160 L163 150 L192 178 Z" fill="url(#gCase)" stroke="#4a453b" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M542 190 L570 160 L557 150 L528 178 Z" fill="url(#gCase)" stroke="#4a453b" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="160" cy="160" r="4.5" fill="none" stroke="#c7b48f" strokeWidth="2" />
        <circle cx="560" cy="160" r="4.5" fill="none" stroke="#c7b48f" strokeWidth="2" />
      </Part>

      <Lighting w={720} h={470} strength={0.4} />
    </svg>
  )
}
