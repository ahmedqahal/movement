import { useState, useMemo } from 'react'
import { GLOSSARY, GLOSSARY_GROUPS } from '../data/glossary.js'
import { slug } from '../lib/search.js'
import useFocusScroll from '../lib/useFocusScroll.js'

export default function Glossary() {
  const [q, setQ] = useState('')
  const [group, setGroup] = useState(null)
  useFocusScroll('g-')

  const items = useMemo(() => {
    const s = q.trim().toLowerCase()
    const sorted = GLOSSARY.filter((g) => !group || g.group === group).sort((a, b) => a.term.localeCompare(b.term))
    if (!s) return sorted
    return sorted.filter((g) => g.term.toLowerCase().includes(s) || g.def.toLowerCase().includes(s))
  }, [q, group])

  return (
    <main className="content">
      <div className="page-head">
        <div className="page-head__eyebrow">Glossary</div>
        <h1>Horology terms</h1>
        <p>{GLOSSARY.length} watchmaking terms in plain language, including the French and German words stamped on old parts. Search, or browse by subject.</p>
      </div>

      <input
        className="glossary-search"
        placeholder="Search terms…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <nav className="track-index" aria-label="Filter by subject">
        <button className={`track-chip${group ? '' : ' on'}`} onClick={() => setGroup(null)}>
          All
        </button>
        {GLOSSARY_GROUPS.map((g) => (
          <button key={g} className={`track-chip${group === g ? ' on' : ''}`} onClick={() => setGroup(g)}>
            {g}
          </button>
        ))}
      </nav>

      {items.length === 0 ? (
        <p style={{ color: 'var(--text-faint)' }}>No terms match “{q}”{group ? ` in ${group}` : ''}.</p>
      ) : (
        <dl className="grid grid--2" style={{ margin: 0 }}>
          {items.map((g) => (
            <div key={g.term} id={`g-${slug(g.term)}`} className="card term">
              <dt>{g.term}</dt>
              <dd>{g.def}</dd>
            </div>
          ))}
        </dl>
      )}
    </main>
  )
}
