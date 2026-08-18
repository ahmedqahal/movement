import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { REFERENCE } from '../data/reference.js'
import { IconGear, IconAnatomy, IconTools, IconChip, IconStrap, IconClock, IconBook } from '../components/Icons.jsx'

const ICON = { gear: IconGear, anatomy: IconAnatomy, tools: IconTools, chip: IconChip, strap: IconStrap, clock: IconClock, book: IconBook }

export default function Reference() {
  const [params] = useSearchParams()
  const focus = params.get('focus')
  const [activeId, setActiveId] = useState(
    () => (REFERENCE.some((a) => a.id === focus) ? focus : REFERENCE[0].id)
  )

  useEffect(() => {
    if (focus && REFERENCE.some((a) => a.id === focus)) setActiveId(focus)
  }, [focus])

  const article = REFERENCE.find((a) => a.id === activeId)

  return (
    <main className="content">
      <div className="page-head">
        <div className="page-head__eyebrow">Reference</div>
        <h1>Field guides</h1>
        <p>
          In-depth references you’ll come back to: movement families, water resistance, oiling,
          tools, battery codes, sizing, materials, and accuracy.
        </p>
      </div>

      <div className="reference">
        <nav className="reference__nav">
          {REFERENCE.map((a) => {
            const Icon = ICON[a.icon] || IconGear
            return (
              <button
                key={a.id}
                className={`reference__link ${a.id === activeId ? 'active' : ''}`}
                onClick={() => setActiveId(a.id)}
              >
                <Icon size={18} />
                <span>{a.title}</span>
              </button>
            )
          })}
        </nav>

        <article className="reference__body card">
          <h2>{article.title}</h2>
          <p className="reference__summary">{article.summary}</p>

          {article.sections.map((s, i) => (
            <section key={i} className="reference__section">
              <h3>{s.heading}</h3>
              <p>{s.body}</p>
              {s.table && (
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        {s.table.headers.map((h) => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {s.table.rows.map((row, r) => (
                        <tr key={r}>
                          {row.map((cell, c) => (
                            <td key={c}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </article>
      </div>
    </main>
  )
}
