import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FLOWCHARTS } from '../data/flowcharts.js'
import Flowchart from '../components/Flowchart.jsx'
import { IconAlert, IconClock, IconAnatomy, IconArrow, IconChip } from '../components/Icons.jsx'

const ICON = { alert: IconAlert, clock: IconClock, anatomy: IconAnatomy, chip: IconChip }

export default function Diagnose() {
  const [params] = useSearchParams()
  const focus = params.get('focus')
  const [activeId, setActiveId] = useState(() => (FLOWCHARTS.some((f) => f.id === focus) ? focus : null))
  const active = FLOWCHARTS.find((f) => f.id === activeId)

  useEffect(() => {
    if (focus && FLOWCHARTS.some((f) => f.id === focus)) setActiveId(focus)
  }, [focus])

  return (
    <main className="content">
      <div className="page-head">
        <div className="page-head__eyebrow">Diagnose</div>
        <h1>What’s wrong with it?</h1>
        <p>
          Answer a few questions and these decision trees walk you to the likely cause — then link
          you straight to the lesson that fixes it.
        </p>
      </div>

      {!active ? (
        <div className="grid grid--2">
          {FLOWCHARTS.map((f) => {
            const Icon = ICON[f.icon] || IconAlert
            return (
              <button key={f.id} className="card pathcard" onClick={() => setActiveId(f.id)} style={{ textAlign: 'left', cursor: 'pointer' }}>
                <div className="pathcard__icon steel">
                  <Icon size={24} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.summary}</p>
                <div className="pathcard__meta">
                  <span>Start →</span>
                </div>
              </button>
            )
          })}
        </div>
      ) : (
        <div>
          <button className="crumb" onClick={() => setActiveId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <IconArrow size={15} style={{ transform: 'rotate(180deg)' }} /> All diagnostics
          </button>
          <h2 style={{ fontSize: '1.6rem', margin: '4px 0 18px' }}>{active.title}</h2>
          <Flowchart key={active.id} chart={active} />
        </div>
      )}
    </main>
  )
}
