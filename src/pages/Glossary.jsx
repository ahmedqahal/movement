import { useState, useMemo } from 'react'
import { GLOSSARY } from '../data/glossary.js'
import { slug } from '../lib/search.js'
import useFocusScroll from '../lib/useFocusScroll.js'

export default function Glossary() {
  const [q, setQ] = useState('')
  useFocusScroll('g-')

  const items = useMemo(() => {
    const s = q.trim().toLowerCase()
    const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term))
    if (!s) return sorted
    return sorted.filter((g) => g.term.toLowerCase().includes(s) || g.def.toLowerCase().includes(s))
  }, [q])

  return (
    <main className="content">
      <div className="page-head">
        <div className="page-head__eyebrow">Glossary</div>
        <h1>Horology terms</h1>
        <p>The vocabulary of watchmaking, in plain language. Search a term or browse the list.</p>
      </div>

      <input
        className="glossary-search"
        placeholder="Search terms…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {items.length === 0 ? (
        <p style={{ color: 'var(--text-faint)' }}>No terms match “{q}”.</p>
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
