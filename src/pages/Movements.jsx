import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MOVEMENTS, MOVEMENT_TYPES } from '../data/movements.js'
import { IconArrow } from '../components/Icons.jsx'
import useFocusScroll from '../lib/useFocusScroll.js'

const TYPE_LABEL = {
  Automatic: 'Automatic mechanical',
  Manual: 'Manual mechanical',
  Quartz: 'Quartz',
  'Solar & kinetic': 'Solar & kinetic',
  'Other electronic': 'Other electronic',
}

function MovementCard({ m }) {
  return (
    <article id={`m-${m.id}`} className="card mv-card">
      <div className="mv-card__head">
        <div>
          <h3>{m.name}</h3>
          <div className="mv-card__maker">{m.maker}</div>
        </div>
        <div className="mv-card__tags">
          {m.tags.map((t) => (
            <span key={t} className="tag" style={{ cursor: 'default' }}>
              #{t}
            </span>
          ))}
        </div>
      </div>

      <div className="mv-specs">
        {Object.entries(m.specs).map(([k, v]) => (
          <div key={k}>
            <span>{k}</span>
            <b>{v}</b>
          </div>
        ))}
      </div>
      {m.source && (
        <p className="mv-source">
          {m.source === 'maker'
            ? 'Figures from the maker’s own sheet.'
            : 'Typical figures from reference listings, not a maker’s sheet. Check your calibre before relying on them.'}
        </p>
      )}

      <div className="mv-card__body">
        <p>
          <strong>Character.</strong> {m.character}
        </p>
        <p>
          <strong>Common faults.</strong> {m.faults}
        </p>
        <p>
          <strong>Service.</strong> {m.service}
        </p>
        <p className="mv-verdict">{m.verdict}</p>
      </div>

      {m.lessonId && (
        <Link className="mv-card__link" to={`/learn/${m.lessonId}`}>
          {m.lessonId.startsWith('svc-') ? 'Full service walkthrough' : 'Related lesson'} <IconArrow size={15} />
        </Link>
      )}
    </article>
  )
}

export default function Movements() {
  useFocusScroll('m-')
  const [type, setType] = useState('All')
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return MOVEMENTS.filter((m) => {
      if (type !== 'All' && m.type !== type) return false
      if (!s) return true
      return [m.name, m.maker, m.type, m.character, m.faults, m.tags.join(' ')].join(' ').toLowerCase().includes(s)
    })
  }, [type, q])

  const groups = MOVEMENT_TYPES.map((t) => ({ type: t, items: list.filter((m) => m.type === t) })).filter((g) => g.items.length)

  return (
    <main className="content">
      <div className="page-head">
        <div className="page-head__eyebrow">Movement Guides</div>
        <h1>The movements that matter</h1>
        <p>
          Field guides to the calibres you’re most likely to meet, mod, or learn on — what each one
          is, how it behaves, what goes wrong, and how to service it. Start a full walkthrough where
          one’s linked.
        </p>
      </div>

      <div className="mv-controls">
        <div className="seg">
          {['All', ...MOVEMENT_TYPES].map((t) => (
            <button key={t} className={t === type ? 'active' : ''} onClick={() => setType(t)}>
              {t === 'All' ? 'All' : TYPE_LABEL[t]}
            </button>
          ))}
        </div>
        <input className="log-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a calibre…" />
      </div>

      {groups.length === 0 ? (
        <p style={{ color: 'var(--text-faint)' }}>No movements match “{q}”.</p>
      ) : (
        groups.map((g) => (
          <section key={g.type} className="mv-group">
            <h2 className="mv-group__label">{TYPE_LABEL[g.type]}</h2>
            <div className="mv-grid">
              {g.items.map((m) => (
                <MovementCard key={m.id} m={m} />
              ))}
            </div>
          </section>
        ))
      )}
    </main>
  )
}
