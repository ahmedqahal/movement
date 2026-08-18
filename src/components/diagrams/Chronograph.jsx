import { useState } from 'react'
import { Defs, Gear, polar, Perlage, Lighting } from './primitives'
import { Part, partProps } from './Part'

function heart(cx, cy, s) {
  return `M${cx},${cy + s * 0.85}
    C${cx - s},${cy + s * 0.1} ${cx - s},${cy - s * 0.7} ${cx},${cy - s * 0.15}
    C${cx + s},${cy - s * 0.7} ${cx + s},${cy + s * 0.1} ${cx},${cy + s * 0.85} Z`
}

// Directional saw-tooth ratchet (the toothed base the operating lever advances).
function ratchetPath(cx, cy, rTip, rRoot, teeth) {
  const step = (Math.PI * 2) / teeth
  let d = ''
  for (let i = 0; i < teeth; i++) {
    const a = i * step
    const root = polar(cx, cy, rRoot, a)
    const tip = polar(cx, cy, rTip, a + step * 0.68)
    d += (i === 0 ? 'M' : 'L') + `${root.x.toFixed(1)},${root.y.toFixed(1)} L${tip.x.toFixed(1)},${tip.y.toFixed(1)}`
  }
  return d + 'Z'
}

const STATUS = {
  idle: 'At rest — press Start',
  running: 'Running — clutch engaged, the seconds runner sweeps',
  stopped: 'Stopped — clutch released, the hand is frozen',
  zeroed: 'Reset — hammers dropped onto the heart cams, hands snap to zero',
}

export default function Chronograph({ parts, selected, onSelect }) {
  const pp = partProps(parts, selected, onSelect)
  const runner = [352, 250]
  const minute = [520, 330]
  const column = [268, 168]
  const clutchPivot = [column[0] + 24, column[1] + 8] // 292, 176

  const [phase, setPhase] = useState('idle')
  const [columnStep, setColumnStep] = useState(0)
  const [resetCount, setResetCount] = useState(0)
  const running = phase === 'running'
  const play = running ? 'running' : 'paused'

  const toggle = () => {
    setPhase(running ? 'stopped' : 'running')
    setColumnStep((s) => s + 1)
  }
  const reset = () => {
    if (running) return
    setPhase('zeroed')
    setResetCount((c) => c + 1)
  }

  return (
    <>
      <div className="diagram-controls">
        <button className={running ? 'stop' : 'run'} onClick={toggle}>
          {running ? '❚❚ Stop' : '▶ Start'}
        </button>
        <button onClick={reset} disabled={running}>
          ↺ Reset
        </button>
        <span className="diagram-controls__note">{STATUS[phase]}</span>
      </div>

      <svg viewBox="0 0 720 470" role="img" aria-label="Chronograph diagram">
        <Defs />

        {/* base plate */}
        <circle cx="360" cy="248" r="214" fill="url(#gPlate)" stroke="#3a3128" strokeWidth="2" opacity="0.55" />
        <Perlage cx={360} cy={248} r={212} opacity={0.6} />

        {/* Heart cams (static; the hammers strike these to zero the hands) */}
        <Part {...pp('ch-heart', [runner[0], runner[1] + 74])}>
          <path d={heart(runner[0], runner[1], 15)} fill="url(#gSteel)" stroke="#4a6274" strokeWidth="1.2" />
          <path d={heart(minute[0], minute[1], 12)} fill="url(#gSteel)" stroke="#4a6274" strokeWidth="1.2" />
          <circle cx={runner[0]} cy={runner[1]} r="18" className="hit" />
        </Part>

        {/* Chronograph runner (centre seconds) — sweeps while running, freezes on stop, zeroes on reset */}
        <Part {...pp('ch-runner', [runner[0] - 60, runner[1] + 20])}>
          <g
            key={`run-${resetCount}`}
            className="chrono-sweep"
            style={{ transformBox: 'view-box', transformOrigin: `${runner[0]}px ${runner[1]}px`, animationPlayState: play }}
          >
            <Gear cx={runner[0]} cy={runner[1]} r={46} teeth={40} metal="brass" color="#8a7c66" crossings={4} />
            <line x1={runner[0]} y1={runner[1]} x2={runner[0]} y2={runner[1] - 150} stroke="#b892d6" strokeWidth="3" strokeLinecap="round" />
            <circle cx={runner[0]} cy={runner[1] - 150} r="4" fill="#b892d6" />
          </g>
        </Part>

        {/* Column wheel — steps round on each Start/Stop press */}
        <Part {...pp('ch-column', [column[0] - 46, column[1]])}>
          <g
            className="slide-anim"
            style={{ transformBox: 'view-box', transformOrigin: `${column[0]}px ${column[1]}px`, transform: `rotate(${columnStep * 30}deg)` }}
          >
            <g filter="url(#softShadow)">
              {/* saw-tooth ratchet base the operating lever clicks round */}
              <path d={ratchetPath(column[0], column[1], 30, 23, 12)} fill="url(#gSteel)" stroke="#4a6274" strokeWidth="1" />
              {/* ruby column cap */}
              <circle cx={column[0]} cy={column[1]} r="21" fill="url(#gRuby)" stroke="#8f2f3a" strokeWidth="1.3" />
              {/* six raised columns (pillars) with routing gaps between them */}
              {Array.from({ length: 6 }).map((_, i) => {
                const a = (i / 6) * Math.PI * 2 - Math.PI / 2
                const p = polar(column[0], column[1], 13, a)
                return (
                  <g key={i}>
                    <circle cx={p.x} cy={p.y} r="5.5" fill="#7a2530" stroke="#3a0f14" strokeWidth="1" />
                    <circle cx={p.x - 1.4} cy={p.y - 1.4} r="1.7" fill="rgba(255,182,190,0.5)" />
                  </g>
                )
              })}
              <circle cx={column[0]} cy={column[1]} r="5.5" fill="url(#gDark)" stroke="#8f2f3a" strokeWidth="1.1" />
            </g>
          </g>
        </Part>

        {/* Coupling clutch — rocks the coupling wheel into mesh with the runner while running */}
        <Part {...pp('ch-clutch', [430, 190])}>
          <g
            className="slide-anim"
            style={{ transformBox: 'view-box', transformOrigin: `${clutchPivot[0]}px ${clutchPivot[1]}px`, transform: running ? 'rotate(6deg)' : 'rotate(0deg)' }}
          >
            <path d={`M${clutchPivot[0]} ${clutchPivot[1]} Q380 200 ${runner[0] + 44} ${runner[1] - 20}`} fill="none" stroke="#b892d6" strokeWidth="4.5" strokeLinecap="round" />
            <Gear cx={412} cy={214} r={22} teeth={20} metal="brass" color="#8a7c66" crossings={3} spin={running} />
            <circle cx={clutchPivot[0]} cy={clutchPivot[1]} r="5" fill="url(#gDark)" stroke="#b892d6" strokeWidth="1.4" />
          </g>
        </Part>

        {/* Minute counter — advances slowly while running, zeroes on reset */}
        <Part {...pp('ch-minute', [minute[0] + 60, minute[1] + 20])}>
          <circle cx={minute[0]} cy={minute[1]} r="48" fill="none" stroke="#b892d6" strokeWidth="2" opacity="0.5" />
          <g
            key={`min-${resetCount}`}
            className="chrono-sweep-min"
            style={{ transformBox: 'view-box', transformOrigin: `${minute[0]}px ${minute[1]}px`, animationPlayState: play }}
          >
            <Gear cx={minute[0]} cy={minute[1]} r={40} teeth={34} metal="brass" color="#8a7c66" crossings={4} />
            <line x1={minute[0]} y1={minute[1]} x2={minute[0]} y2={minute[1] - 34} stroke="#efe8dc" strokeWidth="2.4" strokeLinecap="round" />
          </g>
        </Part>

        {/* Reset hammers — drop onto the heart cams on each reset */}
        <Part {...pp('ch-hammer', [440, 420])}>
          <g
            key={`ham-${resetCount}`}
            className={resetCount > 0 ? 'hammer-drop' : ''}
            style={{ transformBox: 'view-box', transformOrigin: '440px 408px' }}
          >
            <path
              d={`M440 408 L${runner[0]} ${runner[1] + 16} M440 408 L${minute[0]} ${minute[1] + 20} M440 408 L440 440`}
              fill="none"
              stroke="#c7b48f"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="440" cy="408" r="6" fill="url(#gDark)" stroke="#c7b48f" strokeWidth="1.5" />
          </g>
        </Part>

        {/* Pushers */}
        <Part {...pp('ch-pusher-start', [566, 96])}>
          <rect
            className="slide-anim"
            x="556"
            y="80"
            width="34"
            height="18"
            rx="4"
            fill={running ? 'url(#gGold)' : 'url(#gSteel)'}
            stroke="#4a6274"
            strokeWidth="1.6"
            style={{ transform: running ? 'translateX(-5px)' : 'translateX(0)' }}
          />
          <line x1="556" y1="89" x2={column[0] + 20} y2={column[1] - 18} stroke="#7ba583" strokeWidth="2" strokeDasharray="4 3" />
          <text x="573" y="70" textAnchor="middle" fontSize="10.5" fill="#7ba583">start / stop</text>
        </Part>
        <Part {...pp('ch-pusher-reset', [612, 336])}>
          <rect x="600" y="320" width="34" height="18" rx="4" fill="url(#gSteel)" stroke="#4a6274" strokeWidth="1.6" />
          <line x1="600" y1="329" x2="452" y2="404" stroke="#c25863" strokeWidth="2" strokeDasharray="4 3" />
          <text x="617" y="356" textAnchor="middle" fontSize="10.5" fill="#c25863">reset</text>
        </Part>

        <Lighting w={720} h={470} />
      </svg>
    </>
  )
}
