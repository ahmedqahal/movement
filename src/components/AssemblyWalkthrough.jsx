import { useEffect, useState, useCallback } from 'react'
import {
  Defs,
  Gear,
  Pinion,
  Jewel,
  Screw,
  Bridge,
  Perlage,
  Lighting,
  spiralPath,
  escapeWheelPath,
  polar,
} from './diagrams/primitives'
import { IconArrow } from './Icons.jsx'

// reassembly order (movement / bridge side)
const STEPS = [
  {
    title: 'The mainplate',
    desc: 'Start with the bare mainplate — the chassis every part mounts to. Its jewelled holes are the bearings the wheels will run in.',
  },
  {
    title: 'Mainspring barrel',
    desc: 'Fit the mainspring barrel, the power source. Grease the arbor, drop it into its jewel, and its teeth will drive the going train.',
  },
  {
    title: 'The going train',
    desc: 'Lay in the going train — centre, third and fourth wheels. A wheel always drives the next wheel’s pinion, and the wheels get smaller from the barrel outward.',
  },
  {
    title: 'Escape wheel',
    desc: 'Add the escape wheel, the last wheel of the train. Its angled club teeth will be metered out one at a time by the pallet fork.',
  },
  {
    title: 'Train bridge',
    desc: 'Lower the train bridge over the wheels and coax every pivot into its jewel before tightening the screws. Puff air at the escape wheel — a free train spins and coasts to a gentle stop.',
  },
  {
    title: 'Pallet fork',
    desc: 'Fit the pallet fork. With a little power on the barrel it should snap crisply from bank to bank — proof the train is free.',
  },
  {
    title: 'Balance & cock — it runs!',
    desc: 'Install the balance and cock last. As the impulse jewel engages the fork, the movement springs to life and begins to tick.',
  },
]
// teardown order (indexed by teardown progress: 0 = full/running … 6 = bare)
const TEARDOWN = [
  {
    title: 'Let down power & remove the balance',
    desc: 'The movement is running. Let down the mainspring, then take the balance and cock out first — it’s the most delicate part, so it comes off before anything else.',
  },
  {
    title: 'Remove the pallet fork',
    desc: 'Free the pallet bridge and lift out the fork. With it gone, the train is free to spin.',
  },
  {
    title: 'Remove the train bridge',
    desc: 'Unscrew and lift the train bridge, noting exactly how the pivots sit — refitting it is the fiddliest part of reassembly.',
  },
  {
    title: 'Lift out the escape wheel',
    desc: 'Take out the escape wheel, the last wheel of the train.',
  },
  {
    title: 'Lift out the going train',
    desc: 'Remove the fourth, third and centre wheels, keeping them in order — each pivot must return to its own jewel later.',
  },
  {
    title: 'Remove the barrel',
    desc: 'Take off the barrel bridge and lift out the barrel; the mainspring can now be inspected or replaced.',
  },
  {
    title: 'Bare mainplate',
    desc: 'Only the mainplate remains — stripped and ready to clean.',
  },
]
const LAST = STEPS.length - 1

// layout
const plate = [330, 232]
const barrel = [232, 172]
const centre = [330, 232]
const third = [418, 190]
const fourth = [420, 288]
const escape = [356, 334]
const forkPivot = [404, 344]
const bal = [452, 352]
const balR = 54

export default function AssemblyWalkthrough({ mode = 'assemble' }) {
  const teardown = mode === 'disassemble'
  const [level, setLevel] = useState(teardown ? LAST : 0)
  const [playing, setPlaying] = useState(false)
  const running = level >= LAST
  const progress = teardown ? LAST - level : level
  const atStart = level === (teardown ? LAST : 0)
  const atEnd = level === (teardown ? 0 : LAST)
  const steps = teardown ? TEARDOWN : STEPS

  const advance = useCallback(
    () => setLevel((l) => (teardown ? Math.max(0, l - 1) : Math.min(LAST, l + 1))),
    [teardown]
  )
  const back = useCallback(() => {
    setPlaying(false)
    setLevel((l) => (teardown ? Math.min(LAST, l + 1) : Math.max(0, l - 1)))
  }, [teardown])
  const reset = useCallback(() => {
    setPlaying(false)
    setLevel(teardown ? LAST : 0)
  }, [teardown])

  useEffect(() => {
    if (!playing) return
    if (atEnd) {
      setPlaying(false)
      return
    }
    const t = setTimeout(advance, 1900)
    return () => clearTimeout(t)
  }, [playing, level, atEnd, advance])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') advance()
      else if (e.key === 'ArrowLeft') back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [advance, back])

  const show = (n) => level >= n

  return (
    <div>
      <div className="diagram-wrap">
        <svg viewBox="0 0 660 470" role="img" aria-label="Watch assembly walkthrough">
          <Defs />

          {show(0) && (
            <g className="assemble-in">
              <circle cx={plate[0]} cy={plate[1]} r="200" fill="url(#gPlate)" stroke="#4a3f33" strokeWidth="2.5" filter="url(#grain)" />
              <circle cx={plate[0]} cy={plate[1]} r="200" fill="none" stroke="rgba(255,240,210,0.12)" strokeWidth="1" />
              <Perlage cx={plate[0]} cy={plate[1]} r={198} />
              {[centre, third, fourth, escape, bal].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="6" fill="#0e0c0a" stroke="#5a4f40" strokeWidth="1" />
              ))}
              <g filter="url(#softShadow)">
                <line x1="530" y1="232" x2="628" y2="232" stroke="#8fa9b8" strokeWidth="6" strokeLinecap="round" />
                <circle cx="642" cy="232" r="18" fill="url(#gSteel)" stroke="#48606d" strokeWidth="1.4" />
                {Array.from({ length: 12 }).map((_, i) => {
                  const a = (i / 12) * Math.PI * 2
                  const p1 = polar(642, 232, 13, a)
                  const p2 = polar(642, 232, 18, a)
                  return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#3f5666" strokeWidth="1.3" />
                })}
                <circle cx="642" cy="232" r="6" fill="url(#gDark)" stroke="#48606d" strokeWidth="1" />
              </g>
            </g>
          )}

          {show(1) && (
            <g className="assemble-in" filter="url(#softShadow)">
              <Gear cx={barrel[0]} cy={barrel[1]} r={78} teeth={58} metal="brass" crossings={0} hub={false} />
              <circle cx={barrel[0]} cy={barrel[1]} r="64" fill="url(#gDark)" stroke="#6e551d" strokeWidth="1.2" />
              <path d={spiralPath(barrel[0], barrel[1], 8, 56, 7)} fill="none" stroke="#dcb35a" strokeWidth="1.5" opacity="0.85" />
              <rect x={barrel[0] - 6} y={barrel[1] - 6} width="12" height="12" fill="#c7b48f" transform={`rotate(45 ${barrel[0]} ${barrel[1]})`} />
            </g>
          )}

          {show(2) && (
            <g className="assemble-in">
              <Gear cx={centre[0]} cy={centre[1]} r={48} teeth={38} metal="brass" color="#8a7c66" crossings={4} />
              <Pinion cx={centre[0]} cy={centre[1]} leaves={10} r={12} />
              <Gear cx={third[0]} cy={third[1]} r={33} teeth={24} metal="brass" color="#8a7c66" crossings={3} />
              <Pinion cx={third[0]} cy={third[1]} leaves={8} r={10} />
              <Gear cx={fourth[0]} cy={fourth[1]} r={30} teeth={22} metal="brass" color="#8a7c66" crossings={3} />
              <Pinion cx={fourth[0]} cy={fourth[1]} leaves={8} r={10} />
            </g>
          )}

          {show(3) && (
            <g className="assemble-in">
              <g className={running ? 'esc-wheel-anim' : undefined} style={{ transformBox: 'view-box', transformOrigin: `${escape[0]}px ${escape[1]}px` }}>
                <path d={escapeWheelPath(escape[0], escape[1], 24, 15, 15)} fill="url(#gSteel)" stroke="#48606d" strokeWidth="1" filter="url(#softShadow)" />
                {[0, 1, 2].map((i) => {
                  const a = (i / 3) * Math.PI * 2 + 0.5
                  const p = polar(escape[0], escape[1], 13, a)
                  return <line key={i} x1={escape[0]} y1={escape[1]} x2={p.x} y2={p.y} stroke="#48606d" strokeWidth="2.2" />
                })}
                <circle cx={escape[0]} cy={escape[1]} r="5" fill="url(#gDark)" stroke="#48606d" strokeWidth="1" />
              </g>
              <Pinion cx={escape[0]} cy={escape[1]} leaves={7} r={8} />
            </g>
          )}

          {show(4) && (
            <g className="assemble-in" opacity="0.82">
              <g opacity="0.72">
                <Bridge d="M356 150 Q470 158 486 250 Q492 320 430 320 Q404 260 382 226 Q360 196 356 150 Z" angle={-16} />
              </g>
              <Jewel cx={third[0]} cy={third[1]} r={4} chaton screws />
              <Jewel cx={fourth[0]} cy={fourth[1]} r={4} chaton screws />
              <Jewel cx={escape[0]} cy={escape[1]} r={3.4} chaton />
              {[[372, 176], [470, 250], [426, 300]].map(([x, y], i) => (
                <Screw key={i} cx={x} cy={y} r={5} angle={i * 40} />
              ))}
            </g>
          )}

          {show(5) && (
            <g className="assemble-in">
              <g className={running ? 'esc-fork-anim' : undefined} style={{ transformBox: 'view-box', transformOrigin: `${forkPivot[0]}px ${forkPivot[1]}px` }}>
                <path
                  d={`M${escape[0] + 8} ${escape[1] + 10} L${forkPivot[0]} ${forkPivot[1]} L${bal[0] - 34} ${bal[1] - 30}`}
                  fill="none"
                  stroke="url(#gSteel)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#softShadow)"
                />
                <path d={`M${escape[0] + 8} ${escape[1] + 10} L${forkPivot[0]} ${forkPivot[1]} L${bal[0] - 34} ${bal[1] - 30}`} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" strokeLinecap="round" />
                <rect x={escape[0] + 2} y={escape[1] + 4} width="12" height="9" rx="1.5" transform={`rotate(-30 ${escape[0] + 8} ${escape[1] + 10})`} fill="url(#gJewel)" stroke="#8f2f3a" strokeWidth="0.6" />
              </g>
              <circle cx={forkPivot[0]} cy={forkPivot[1]} r="4.5" fill="url(#gDark)" stroke="#48606d" strokeWidth="1" />
            </g>
          )}

          {show(6) && (
            <g className="assemble-in">
              <g opacity="0.7">
                <Bridge d="M406 300 Q520 312 512 384 Q470 410 424 380 Q408 340 406 300 Z" angle={28} />
              </g>
              <g className={running ? 'esc-balance-anim' : undefined} style={{ transformBox: 'view-box', transformOrigin: `${bal[0]}px ${bal[1]}px` }}>
                <circle cx={bal[0]} cy={bal[1]} r={balR} fill="none" stroke="url(#gBrass)" strokeWidth="6.5" filter="url(#softShadow)" />
                <circle cx={bal[0]} cy={bal[1]} r={balR} fill="none" stroke="#6e551d" strokeWidth="0.8" />
                {[0, 1, 2].map((i) => {
                  const a = (i / 3) * Math.PI * 2 + 0.5
                  const p = polar(bal[0], bal[1], balR - 4, a)
                  return <line key={i} x1={bal[0]} y1={bal[1]} x2={p.x} y2={p.y} stroke="#b6892f" strokeWidth="4" />
                })}
                {Array.from({ length: 8 }).map((_, i) => {
                  const a = (i / 8) * Math.PI * 2
                  const p = polar(bal[0], bal[1], balR, a)
                  return <circle key={i} cx={p.x} cy={p.y} r="3.4" fill="url(#gBlue)" stroke="#16233d" strokeWidth="0.6" />
                })}
                <path d={spiralPath(bal[0], bal[1], 4, 32, 5)} fill="none" stroke="#cfd9df" strokeWidth="1" opacity="0.9" />
                <rect x={bal[0] - 24} y={bal[1] - 5} width="9" height="12" rx="2" fill="url(#gJewel)" stroke="#8f2f3a" strokeWidth="0.8" />
              </g>
              <Jewel cx={bal[0]} cy={bal[1]} r={3.4} chaton />
            </g>
          )}

          <Lighting w={660} h={470} />
        </svg>
      </div>

      <div className="asm-controls">
        <button className="btn btn--ghost" onClick={back} disabled={atStart}>
          <IconArrow size={16} style={{ transform: 'rotate(180deg)' }} /> Back
        </button>
        <button className="btn btn--solid" onClick={() => (atEnd ? reset() : setPlaying((p) => !p))}>
          {atEnd ? 'Replay' : playing ? 'Pause' : 'Play'}
        </button>
        <button className="btn btn--ghost" onClick={advance} disabled={atEnd}>
          Next <IconArrow size={16} />
        </button>
        <div className="asm-dots">
          {steps.map((_, i) => (
            <button
              key={i}
              className={`asm-dot ${i === progress ? 'active' : ''} ${i < progress ? 'done' : ''}`}
              onClick={() => {
                setPlaying(false)
                setLevel(teardown ? LAST - i : i)
              }}
              aria-label={`Step ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="card asm-step">
        <div className="asm-step__num">
          Step {progress + 1} of {steps.length}
        </div>
        <h2>{steps[progress].title}</h2>
        <p>{steps[progress].desc}</p>
      </div>
    </div>
  )
}
