import { useState } from 'react'
import { Defs, Gear, polar, arcPath, Screw, Jewel, Perlage, Lighting } from './primitives'
import { Part, partProps } from './Part'

function crescent(cx, cy, R, r) {
  const pts = []
  const N = 60
  for (let i = 0; i <= N; i++) pts.push(polar(cx, cy, R, Math.PI + (i / N) * Math.PI))
  for (let i = N; i >= 0; i--) pts.push(polar(cx, cy, r, Math.PI + (i / N) * Math.PI))
  return 'M' + pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join('L') + 'Z'
}

export default function Automatic({ parts, selected, onSelect }) {
  const pp = partProps(parts, selected, onSelect)
  const pivot = [360, 258]
  const barrel = [244, 402]
  const [dir, setDir] = useState('cw')
  const cw = dir === 'cw'

  return (
    <>
      <div className="diagram-controls">
        <span className="diagram-controls__label">Rotor swing</span>
        <button className={cw ? 'active' : ''} onClick={() => setDir('cw')}>
          ↻ Clockwise
        </button>
        <button className={!cw ? 'active' : ''} onClick={() => setDir('ccw')}>
          ↺ Anticlockwise
        </button>
        <span className="diagram-controls__note">
          Swing it either way — the reverser still winds the barrel in one direction.
        </span>
      </div>

      <svg viewBox="0 0 720 470" role="img" aria-label="Automatic winding diagram">
        <Defs />
        <marker id="arrowG" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="#d0a84f" />
        </marker>

        {/* faint movement plate */}
        <circle cx="360" cy="258" r="210" fill="url(#gPlate)" stroke="#3a3128" strokeWidth="2" filter="url(#grain)" opacity="0.7" />
        <Perlage cx={360} cy={258} r={208} opacity={0.7} />

        {/* Reduction gears — turn with the rotor (direction follows the swing) */}
        <Part {...pp('auto-reduction', [452, 320])}>
          <Gear cx={410} cy={318} r={40} teeth={38} module={2.1} metal="brass" crossings={4} spin={!cw} spinRev={cw} />
        </Part>

        {/* Reversing wheels — the rectifier: their output turns one way whichever way the rotor swings */}
        <Part {...pp('auto-reverser', [360, 442])}>
          <Gear cx={352} cy={378} r={28} teeth={26} module={2.1} metal="steel" crossings={3} spin />
          <Gear cx={308} cy={356} r={22} teeth={20} module={2.1} metal="steel" crossings={3} spinRev />
        </Part>

        {/* Barrel */}
        <Part {...pp('auto-barrel', [150, 408])}>
          <Gear cx={barrel[0]} cy={barrel[1]} r={72} teeth={60} module={2.4} metal="brass" crossings={0} hub={false} />
          <circle cx={barrel[0]} cy={barrel[1]} r="58" fill="url(#gDark)" stroke="#6e551d" strokeWidth="1.2" />
          <path d={arcPath(barrel[0], barrel[1], 200, Math.PI * 0.62, Math.PI * 0.82)} fill="none" stroke="#dcb35a" strokeWidth="1.4" opacity="0.7" />
        </Part>

        {/* Ratchet wheel (concentric on barrel) + click — always winds one way */}
        <Part {...pp('auto-ratchet', [250, 402])}>
          <Gear cx={barrel[0]} cy={barrel[1]} r={44} teeth={40} module={2.1} metal="brass" crossings={4} jewel spinRev />
          <path d="M300 374 L324 360 L320 374 L303 384 Z" fill="url(#gSteel)" stroke="#48606d" strokeWidth="1.2" />
          <Screw cx={311} cy={368} r={4} />
        </Part>

        {/* one-way output indicator on the ratchet (fixed — never flips) */}
        <g style={{ pointerEvents: 'none' }}>
          <path d={arcPath(barrel[0], barrel[1], 96, Math.PI * 1.14, Math.PI * 1.52)} fill="none" stroke="#d0a84f" strokeWidth="2.6" markerEnd="url(#arrowG)" />
          <text x={barrel[0]} y={300} textAnchor="middle" fontSize="11.5" fill="#e0c074">always winds one way</text>
        </g>

        {/* Rotor (oscillating weight) — spins in the selected direction */}
        <Part {...pp('auto-rotor', [360, 66])}>
          <g className={cw ? 'spin' : 'spin-rev'} style={{ transformBox: 'view-box', transformOrigin: `${pivot[0]}px ${pivot[1]}px` }}>
            <path d={crescent(pivot[0], pivot[1], 198, 150)} fill="url(#gBrass)" stroke="#6e551d" strokeWidth="1.4" filter="url(#deepShadow)" />
            <path d={arcPath(pivot[0], pivot[1], 190, Math.PI * 1.08, Math.PI * 1.55)} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" strokeLinecap="round" />
            {/* engraving groove + perlage dots */}
            <path d={arcPath(pivot[0], pivot[1], 172, Math.PI, Math.PI * 2)} fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="1.4" />
            {Array.from({ length: 15 }).map((_, i) => {
              const a = Math.PI + ((i + 0.5) / 15) * Math.PI
              const p = polar(pivot[0], pivot[1], 162, a)
              return <circle key={i} cx={p.x} cy={p.y} r="3.4" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
            })}
            {/* skeleton arms */}
            {[-0.62, 0.62].map((off, i) => {
              const a = Math.PI * 1.5 + off
              const p = polar(pivot[0], pivot[1], 150, a)
              return <line key={i} x1={pivot[0]} y1={pivot[1]} x2={p.x} y2={p.y} stroke="#a9832f" strokeWidth="9" strokeLinecap="round" />
            })}
            <line x1={pivot[0]} y1={pivot[1]} x2={pivot[0]} y2={pivot[1] - 150} stroke="#a9832f" strokeWidth="9" strokeLinecap="round" />
          </g>
        </Part>

        {/* rotor swing-direction arrow (flips with the toggle) */}
        <g style={{ pointerEvents: 'none' }} transform={cw ? undefined : `translate(${pivot[0] * 2}, 0) scale(-1, 1)`}>
          <path d={arcPath(pivot[0], pivot[1], 116, Math.PI * 1.24, Math.PI * 1.72)} fill="none" stroke="#d0a84f" strokeWidth="2.6" markerEnd="url(#arrowG)" opacity="0.9" />
        </g>

        {/* Rotor bearing (ball bearing) */}
        <Part {...pp('auto-bearing', [438, 258])}>
          <circle cx={pivot[0]} cy={pivot[1]} r="28" fill="url(#gSteel)" stroke="#48606d" strokeWidth="1.8" filter="url(#softShadow)" />
          <circle cx={pivot[0]} cy={pivot[1]} r="21" fill="url(#gDark)" stroke="#48606d" strokeWidth="1" />
          {Array.from({ length: 10 }).map((_, i) => {
            const a = (i / 10) * Math.PI * 2
            const p = polar(pivot[0], pivot[1], 24, a)
            return <circle key={i} cx={p.x} cy={p.y} r="3.2" fill="url(#gSteel)" stroke="#2a3b45" strokeWidth="0.5" />
          })}
          <Jewel cx={pivot[0]} cy={pivot[1]} r={5} chaton />
        </Part>

        <Lighting w={720} h={470} />
      </svg>
    </>
  )
}
