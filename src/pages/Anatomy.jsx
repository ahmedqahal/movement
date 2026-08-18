import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DIAGRAMS, ROLES } from '../data/anatomy.js'
import AnatomyDiagram from '../components/diagrams/index.jsx'

export default function Anatomy() {
  const [params] = useSearchParams()
  const focus = params.get('focus')
  const [diagramId, setDiagramId] = useState(
    () => (DIAGRAMS.some((d) => d.id === focus) ? focus : DIAGRAMS[0].id)
  )
  const [partId, setPartId] = useState(null)

  useEffect(() => {
    if (focus && DIAGRAMS.some((d) => d.id === focus)) {
      setDiagramId(focus)
      setPartId(null)
    }
  }, [focus])

  const diagram = DIAGRAMS.find((d) => d.id === diagramId)
  const part = diagram.parts.find((p) => p.id === partId)
  const partNum = part ? diagram.parts.findIndex((p) => p.id === partId) + 1 : null

  const switchDiagram = (id) => {
    setDiagramId(id)
    setPartId(null)
  }

  return (
    <main className="content">
      <div className="page-head">
        <div className="page-head__eyebrow">Anatomy Explorer</div>
        <h1>See how a watch works</h1>
        <p>
          Pick a diagram, then click any labelled part to learn what it does. Hover to highlight,
          click to read more.
        </p>
      </div>

      <div className="seg">
        {DIAGRAMS.map((d) => (
          <button key={d.id} className={d.id === diagramId ? 'active' : ''} onClick={() => switchDiagram(d.id)}>
            {d.name}
          </button>
        ))}
      </div>

      <p style={{ color: 'var(--text-dim)', maxWidth: '70ch', marginTop: -4 }}>{diagram.note}</p>

      <div className="anatomy">
        <div className="diagram-wrap">
          <AnatomyDiagram diagram={diagram} selected={partId} onSelect={setPartId} />
        </div>

        <aside className="card info-panel" aria-live="polite">
          {part ? (
            <>
              <div className="info-panel__num">PART {String(partNum).padStart(2, '0')}</div>
              <h3>{part.name}</h3>
              <div className="role" style={{ color: ROLES[part.role].color }}>
                {ROLES[part.role].label}
              </div>
              <p>{part.detail}</p>
            </>
          ) : (
            <>
              <div className="info-panel__num">{diagram.name.toUpperCase()}</div>
              <h3>{diagram.tagline}</h3>
              <p className="empty">Click a numbered part in the diagram — or a chip below — to explore it.</p>
            </>
          )}

          <div className="chip-row">
            {diagram.parts.map((p, i) => (
              <button
                key={p.id}
                className={`chip ${p.id === partId ? 'active' : ''}`}
                onClick={() => setPartId(p.id)}
              >
                <span className="dot" style={{ background: ROLES[p.role].color }} />
                {i + 1}. {p.name}
              </button>
            ))}
          </div>
        </aside>
      </div>

      {/* legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 22 }}>
        {Object.entries(ROLES).map(([key, r]) => (
          <span key={key} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', color: 'var(--text-dim)' }}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: r.color }} />
            {r.label}
          </span>
        ))}
      </div>
    </main>
  )
}
