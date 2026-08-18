import { useState } from 'react'
import { Defs, Gear, polar, Lighting } from './primitives'
import { Part, partProps } from './Part'

export default function Keyless({ parts, selected, onSelect }) {
  const pp = partProps(parts, selected, onSelect)
  const [mode, setMode] = useState('wind')
  const setting = mode === 'set'

  // Pulling the crown out slides the whole stem assembly outward (toward the crown).
  const pull = setting ? -15 : 0
  const windOp = setting ? 0.14 : 1
  const setOp = setting ? 1 : 0.14

  return (
    <>
      <div className="diagram-controls">
        <span className="diagram-controls__label">Crown position</span>
        <button className={!setting ? 'active' : ''} onClick={() => setMode('wind')}>
          Pushed in · Wind
        </button>
        <button className={setting ? 'active' : ''} onClick={() => setMode('set')}>
          Pulled out · Set
        </button>
      </div>

      <svg viewBox="0 0 720 470" role="img" aria-label="Keyless works diagram">
        <Defs />
        <marker id="arrowW" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#7ba583" />
        </marker>
        <marker id="arrowS" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#b892d6" />
        </marker>

        <rect x="40" y="40" width="640" height="390" rx="18" fill="url(#gPlate)" stroke="#3a3128" strokeWidth="2" opacity="0.6" />

        {/* winding path (green) — active when pushed in */}
        <g style={{ pointerEvents: 'none', transition: 'opacity 0.4s' }} fill="none" strokeWidth="2.4" opacity={windOp}>
          <path d="M330 210 Q380 190 400 175" stroke="#7ba583" markerEnd="url(#arrowW)" />
          <path d="M432 158 Q460 135 470 120" stroke="#7ba583" markerEnd="url(#arrowW)" />
          <text x="470" y="96" textAnchor="middle" fontSize="12" fill="#7ba583">crown → ratchet → barrel</text>
        </g>
        {/* setting path (violet) — active when pulled out */}
        <g style={{ pointerEvents: 'none', transition: 'opacity 0.4s' }} fill="none" strokeWidth="2.4" opacity={setOp}>
          <path d="M330 258 Q345 300 360 315" stroke="#b892d6" markerEnd="url(#arrowS)" />
          <path d="M382 340 Q420 358 445 360" stroke="#b892d6" markerEnd="url(#arrowS)" />
          <text x="512" y="392" textAnchor="middle" fontSize="12" fill="#b892d6">clutch → setting wheels → hands</text>
        </g>

        {/* Crown wheel -> ratchet (winding output) — turns while winding */}
        <g style={{ pointerEvents: 'none', transition: 'opacity 0.4s' }} opacity={windOp}>
          <Gear cx={420} cy={158} r={28} teeth={24} metal="brass" color="#8a7c66" crossings={4} spin={!setting} />
          <Gear cx={478} cy={104} r={34} teeth={30} metal="brass" color="#8a7c66" crossings={4} spinRev={!setting} />
          <text x="478" y="150" textAnchor="middle" fontSize="10.5" fill="#b3a898">to barrel</text>
        </g>

        {/* Winding pinion — engaged & turning only while winding */}
        <Part {...pp('kw-winding-pinion', [352, 250])}>
          <g style={{ transition: 'opacity 0.4s' }} opacity={setting ? 0.4 : 1}>
            <Gear cx={344} cy={210} r={22} teeth={18} metal="brass" color="#8a7c66" crossings={3} spinRev={!setting} />
          </g>
        </Part>

        {/* Setting wheels — engaged & turning only while setting */}
        <Part {...pp('kw-setting-wheels', [352, 350])}>
          <g style={{ transition: 'opacity 0.4s' }} opacity={setting ? 1 : 0.4}>
            <Gear cx={356} cy={330} r={24} teeth={20} metal="brass" color="#8a7c66" crossings={3} spinRev={setting} />
          </g>
        </Part>

        {/* Yoke (clutch lever) — rocks over when the crown is pulled out */}
        <Part {...pp('kw-yoke', [230, 300])}>
          <g className="slide-anim" style={{ transformBox: 'view-box', transformOrigin: '232px 302px', transform: setting ? 'rotate(-7deg)' : 'rotate(0deg)' }}>
            <path d="M232 300 Q262 250 300 250" fill="none" stroke="#c7b48f" strokeWidth="5" strokeLinecap="round" />
            <circle cx="232" cy="302" r="6" fill="url(#gDark)" stroke="#c7b48f" strokeWidth="1.4" />
          </g>
        </Part>

        {/* Setting lever — rocks on its detent when the crown is pulled out */}
        <Part {...pp('kw-setting-lever', [300, 140])}>
          <g className="slide-anim" style={{ transformBox: 'view-box', transformOrigin: '296px 150px', transform: setting ? 'rotate(6deg)' : 'rotate(0deg)' }}>
            <path d="M318 236 L306 170 L296 150" fill="none" stroke="#c7b48f" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="296" cy="150" r="7" fill="url(#gDark)" stroke="#c7b48f" strokeWidth="1.6" />
            <line x1="292" y1="150" x2="300" y2="150" stroke="#c7b48f" strokeWidth="1.4" />
          </g>
        </Part>

        {/* Cannon pinion / motion works — the hands turn while setting */}
        <Part {...pp('kw-cannon', [560, 360])}>
          <Gear cx={470} cy={360} r={34} teeth={28} metal="brass" color="#8a7c66" crossings={4} spin={setting} />
          <Gear cx={524} cy={372} r={22} teeth={18} metal="brass" color="#8a7c66" crossings={4} spinRev={setting} />
          <g className={setting ? 'spin-slow' : ''} style={{ transformBox: 'view-box', transformOrigin: '470px 360px' }}>
            <line x1="470" y1="360" x2="470" y2="330" stroke="#efe8dc" strokeWidth="2.4" strokeLinecap="round" />
            <line x1="470" y1="360" x2="492" y2="360" stroke="#efe8dc" strokeWidth="2.2" strokeLinecap="round" />
          </g>
          <circle cx="470" cy="360" r="3.5" fill="#d0a84f" />
        </Part>

        {/* Pull-out assembly: crown + stem + sliding pinion move together */}
        <g className="slide-anim" style={{ transform: `translateX(${pull}px)` }}>
          {/* Crown — the input; turns in either mode */}
          <Part {...pp('kw-crown', [66, 195])}>
            <g filter="url(#softShadow)" className="spin-slow" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              <circle cx="72" cy="236" r="24" fill="url(#gSteel)" stroke="#4a6274" strokeWidth="1.6" />
              {Array.from({ length: 14 }).map((_, i) => {
                const a = (i / 14) * Math.PI * 2
                const p1 = polar(72, 236, 18, a)
                const p2 = polar(72, 236, 24, a)
                return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#3f5666" strokeWidth="1.4" />
              })}
              <circle cx="72" cy="236" r="8" fill="url(#gDark)" stroke="#4a6274" strokeWidth="1.2" />
            </g>
          </Part>

          {/* Stem */}
          <Part {...pp('kw-stem', [170, 210])}>
            <line x1="96" y1="236" x2="300" y2="236" stroke="#8fa9b8" strokeWidth="8" strokeLinecap="round" />
            <line x1="96" y1="236" x2="300" y2="236" stroke="#c6d6df" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            <rect x="96" y="224" width="200" height="24" className="hit" />
          </Part>

          {/* Sliding (clutch) pinion — rides the stem, always turns with the crown */}
          <Part {...pp('kw-sliding-pinion', [270, 292])}>
            <Gear cx={278} cy={236} r={28} teeth={16} metal="brass" color="#8a7c66" crossings={0} spin />
            <circle cx={278} cy={236} r="14" fill="none" stroke="#5a4f40" strokeWidth="3" />
          </Part>
        </g>

        <Lighting w={720} h={470} strength={0.4} />
      </svg>
    </>
  )
}
