import { useEffect, useMemo, useRef, useState } from 'react'
import { logGetAll, logPut, logDelete, logBulkPut, fileToResizedDataURL } from '../lib/db.js'
import { IconPlus, IconTrash, IconCamera, IconClose, IconLog, IconDownload } from '../components/Icons.jsx'

const MOVEMENTS = ['Automatic', 'Manual mechanical', 'Quartz', 'Chronograph', 'Other']
const STATUSES = ['Completed', 'In progress', 'Needs parts', 'Wishlist']
const STATUS_PILL = { Completed: 'emerald', 'In progress': 'brass', 'Needs parts': 'ruby', Wishlist: 'steel' }

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function LogEditor({ entry, onSave, onCancel }) {
  const [form, setForm] = useState(
    entry || {
      id: uid(),
      title: '',
      brand: '',
      movementType: 'Automatic',
      calibre: '',
      workType: '',
      status: 'In progress',
      date: new Date().toISOString().slice(0, 10),
      notes: '',
      tags: [],
      history: [],
      photos: [],
    }
  )
  const [tagsText, setTagsText] = useState((entry?.tags || []).join(', '))
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const addPhotos = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setBusy(true)
    try {
      const urls = await Promise.all(files.map((f) => fileToResizedDataURL(f)))
      setForm((f) => ({ ...f, photos: [...f.photos, ...urls] }))
    } catch {
      /* ignore unreadable files */
    }
    setBusy(false)
    e.target.value = ''
  }

  const removePhoto = (i) => setForm((f) => ({ ...f, photos: f.photos.filter((_, idx) => idx !== i) }))

  const addHist = () =>
    setForm((f) => ({
      ...f,
      history: [...(f.history || []), { date: new Date().toISOString().slice(0, 10), note: '' }],
    }))
  const setHist = (i, k, v) =>
    setForm((f) => ({ ...f, history: f.history.map((h, idx) => (idx === i ? { ...h, [k]: v } : h)) }))
  const removeHist = (i) => setForm((f) => ({ ...f, history: f.history.filter((_, idx) => idx !== i) }))

  const save = () => {
    if (!form.title.trim()) return
    const tags = [...new Set(tagsText.split(',').map((t) => t.trim()).filter(Boolean))]
    const history = (form.history || [])
      .filter((h) => h.note.trim())
      .sort((a, b) => (a.date < b.date ? 1 : -1))
    onSave({ ...form, title: form.title.trim(), tags, history, updatedAt: Date.now() })
  }

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="card modal" onClick={(e) => e.stopPropagation()}>
        <h2>{entry ? 'Edit entry' : 'Log a watch'}</h2>

        <div className="field">
          <label>Watch / project *</label>
          <input value={form.title} onChange={set('title')} placeholder="e.g. Seiko SKX007 service" autoFocus />
        </div>

        <div className="field-row">
          <div className="field">
            <label>Brand</label>
            <input value={form.brand} onChange={set('brand')} placeholder="Seiko" />
          </div>
          <div className="field">
            <label>Movement</label>
            <select value={form.movementType} onChange={set('movementType')}>
              {MOVEMENTS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Calibre</label>
            <input value={form.calibre} onChange={set('calibre')} placeholder="NH35 / SR626SW" />
          </div>
          <div className="field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={set('date')} />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label>Work done</label>
            <input value={form.workType} onChange={set('workType')} placeholder="Battery change, regulation…" />
          </div>
          <div className="field">
            <label>Status</label>
            <select value={form.status} onChange={set('status')}>
              {STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label>Tags</label>
          <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="comma-separated, e.g. diver, gift, vintage" />
        </div>

        <div className="field">
          <label>Notes</label>
          <textarea value={form.notes} onChange={set('notes')} placeholder="What you did, what went wrong, part numbers, timegrapher readings…" />
        </div>

        <div className="field">
          <label>Service history</label>
          {(form.history || []).map((h, i) => (
            <div className="hist-row" key={i}>
              <input type="date" value={h.date} onChange={(e) => setHist(i, 'date', e.target.value)} />
              <input value={h.note} onChange={(e) => setHist(i, 'note', e.target.value)} placeholder="e.g. Replaced mainspring, amplitude 280°" />
              <button className="icon-btn" onClick={() => removeHist(i)} title="Remove note">
                <IconClose size={13} />
              </button>
            </div>
          ))}
          <button className="btn btn--ghost" onClick={addHist} style={{ marginTop: 6 }}>
            <IconPlus size={15} /> Add dated note
          </button>
        </div>

        <div className="field">
          <label>Photos</label>
          <label className="btn btn--ghost" style={{ cursor: 'pointer' }}>
            <IconCamera size={17} /> {busy ? 'Adding…' : 'Add photos'}
            <input type="file" accept="image/*" multiple onChange={addPhotos} style={{ display: 'none' }} />
          </label>
          {form.photos.length > 0 && (
            <div className="photo-strip">
              {form.photos.map((src, i) => (
                <div key={i} className="photo-thumb" style={{ backgroundImage: `url(${src})` }}>
                  <button onClick={() => removePhoto(i)} title="Remove photo">
                    <IconClose size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal__actions">
          <button className="btn btn--ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn--solid" onClick={save} disabled={!form.title.trim()}>
            Save entry
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PracticeLog() {
  const [entries, setEntries] = useState([])
  const [editing, setEditing] = useState(null) // entry | 'new' | null
  const [loaded, setLoaded] = useState(false)
  const [query, setQuery] = useState('')
  const [statusF, setStatusF] = useState('All')
  const [moveF, setMoveF] = useState('All')
  const [tagF, setTagF] = useState(null)
  const [sort, setSort] = useState('newest')
  const importRef = useRef(null)

  useEffect(() => {
    logGetAll()
      .then((rows) => setEntries(rows))
      .catch(() => setEntries([]))
      .finally(() => setLoaded(true))
  }, [])

  const allTags = useMemo(
    () => [...new Set(entries.flatMap((e) => e.tags || []))].sort((a, b) => a.localeCompare(b)),
    [entries]
  )

  const stats = useMemo(() => {
    const year = String(new Date().getFullYear())
    const byStatus = STATUSES.map((s) => [s, entries.filter((e) => e.status === s).length]).filter(([, n]) => n > 0)
    const moveCounts = {}
    entries.forEach((e) => {
      moveCounts[e.movementType] = (moveCounts[e.movementType] || 0) + 1
    })
    const top = Object.entries(moveCounts).sort((a, b) => b[1] - a[1])[0]
    return {
      total: entries.length,
      thisYear: entries.filter((e) => (e.date || '').slice(0, 4) === year).length,
      byStatus,
      topMovement: top ? top[0] : '—',
    }
  }, [entries])

  const visible = useMemo(() => {
    const s = query.trim().toLowerCase()
    const list = entries.filter((e) => {
      if (statusF !== 'All' && e.status !== statusF) return false
      if (moveF !== 'All' && e.movementType !== moveF) return false
      if (tagF && !(e.tags || []).includes(tagF)) return false
      if (s) {
        const hay = [
          e.title,
          e.brand,
          e.calibre,
          e.workType,
          e.notes,
          e.status,
          e.movementType,
          (e.tags || []).join(' '),
          (e.history || []).map((h) => h.note).join(' '),
        ]
          .join(' ')
          .toLowerCase()
        if (!hay.includes(s)) return false
      }
      return true
    })
    list.sort((a, b) => {
      if (sort === 'oldest') return a.date < b.date ? -1 : a.date > b.date ? 1 : 0
      if (sort === 'updated') return (b.updatedAt || 0) - (a.updatedAt || 0)
      return a.date < b.date ? 1 : a.date > b.date ? -1 : (b.updatedAt || 0) - (a.updatedAt || 0)
    })
    return list
  }, [entries, query, statusF, moveF, tagF, sort])

  const filtering = query.trim() || statusF !== 'All' || moveF !== 'All' || tagF
  const clearFilters = () => {
    setQuery('')
    setStatusF('All')
    setMoveF('All')
    setTagF(null)
  }

  const handleSave = async (entry) => {
    await logPut(entry)
    setEntries((prev) => [...prev.filter((e) => e.id !== entry.id), entry])
    setEditing(null)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this log entry? This cannot be undone.')) return
    await logDelete(id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `watch-log-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJSON = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      const rows = (Array.isArray(data) ? data : [])
        .filter((r) => r && typeof r === 'object' && r.title)
        .map((r) => ({ ...r, id: r.id || uid() }))
      if (!rows.length) {
        alert('No log entries found in that file.')
        return
      }
      const n = await logBulkPut(rows)
      const all = await logGetAll()
      setEntries(all)
      alert(`Imported ${n} ${n === 1 ? 'entry' : 'entries'}.`)
    } catch {
      alert('Could not import — is this a Movement backup JSON file?')
    }
  }

  return (
    <main className="content">
      <div className="page-head">
        <div className="page-head__eyebrow">Practice Log</div>
        <h1>Your workbench journal</h1>
        <p>
          Record every watch you work on — the movement, what you did, part numbers, timegrapher
          readings, and photos. It’s stored privately on this device.
        </p>
      </div>

      <div className="log-toolbar">
        <button className="btn btn--solid" onClick={() => setEditing('new')}>
          <IconPlus size={17} /> Log a watch
        </button>
        <div className="log-toolbar__right">
          <button className="btn btn--ghost" onClick={() => importRef.current?.click()}>
            <IconDownload size={16} style={{ transform: 'rotate(180deg)' }} /> Import
          </button>
          <input ref={importRef} type="file" accept="application/json,.json" onChange={importJSON} style={{ display: 'none' }} />
          {entries.length > 0 && (
            <button className="btn btn--ghost" onClick={exportJSON}>
              <IconDownload size={16} /> Export backup
            </button>
          )}
        </div>
      </div>

      {entries.length > 0 && (
        <div className="card log-stats">
          <div className="log-stat">
            <b>{stats.total}</b>
            <span>watches logged</span>
          </div>
          <div className="log-stat">
            <b>{stats.thisYear}</b>
            <span>worked this year</span>
          </div>
          <div className="log-stat">
            <b>{stats.topMovement}</b>
            <span>most worked</span>
          </div>
          <div className="log-stat log-stat--status">
            {stats.byStatus.map(([s, n]) => (
              <span key={s} className={`pill ${STATUS_PILL[s] || ''}`}>
                {s} {n}
              </span>
            ))}
          </div>
        </div>
      )}

      {entries.length > 0 && (
        <div className="log-filters">
          <input
            className="log-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, calibre, notes, tags…"
          />
          <select value={statusF} onChange={(e) => setStatusF(e.target.value)}>
            <option>All</option>
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select value={moveF} onChange={(e) => setMoveF(e.target.value)}>
            <option>All</option>
            {MOVEMENTS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="updated">Recently updated</option>
          </select>
        </div>
      )}

      {allTags.length > 0 && (
        <div className="log-tagbar">
          {allTags.map((t) => (
            <button key={t} className={`tag ${tagF === t ? 'active' : ''}`} onClick={() => setTagF(tagF === t ? null : t)}>
              #{t}
            </button>
          ))}
        </div>
      )}

      {loaded && entries.length === 0 && (
        <div className="card empty-state">
          <IconLog size={44} />
          <h3>No entries yet</h3>
          <p>Log your first watch — even one you’re just planning to work on — and build your own repair history.</p>
        </div>
      )}

      {entries.length > 0 && visible.length === 0 && (
        <div className="card empty-state">
          <h3>Nothing matches</h3>
          <p>No entries fit the current search or filters.</p>
          <button className="btn btn--ghost" onClick={clearFilters} style={{ marginTop: 4 }}>
            Clear filters
          </button>
        </div>
      )}

      <div className="log-grid">
        {visible.map((e) => (
          <div key={e.id} className="card log-card" onClick={() => setEditing(e)} style={{ cursor: 'pointer' }}>
            <div
              className="log-card__photo"
              style={e.photos && e.photos[0] ? { backgroundImage: `url(${e.photos[0]})` } : undefined}
            >
              {(!e.photos || !e.photos.length) && <IconCamera size={30} />}
              {e.photos && e.photos.length > 1 && (
                <span style={{ position: 'absolute', bottom: 8, right: 10, fontSize: '0.72rem', color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '2px 7px', borderRadius: 10 }}>
                  +{e.photos.length - 1}
                </span>
              )}
            </div>
            <div className="log-card__body">
              <h3>{e.title}</h3>
              <div className="log-card__meta">
                <span className={`pill ${STATUS_PILL[e.status] || ''}`}>{e.status}</span>
                <span className="pill">{e.movementType}</span>
                {e.calibre && <span className="pill">{e.calibre}</span>}
              </div>
              {e.workType && <div style={{ fontSize: '0.86rem', color: 'var(--text)' }}>{e.workType}</div>}
              {e.notes && <p className="log-card__notes">{e.notes.length > 140 ? e.notes.slice(0, 140) + '…' : e.notes}</p>}

              {e.tags && e.tags.length > 0 && (
                <div className="log-card__tags">
                  {e.tags.map((t) => (
                    <button
                      key={t}
                      className={`tag ${tagF === t ? 'active' : ''}`}
                      onClick={(ev) => {
                        ev.stopPropagation()
                        setTagF(tagF === t ? null : t)
                      }}
                    >
                      #{t}
                    </button>
                  ))}
                </div>
              )}

              {e.history && e.history.length > 0 && (
                <ul className="log-timeline">
                  {e.history.slice(0, 3).map((h, i) => (
                    <li key={i}>
                      <span className="log-timeline__date">{h.date}</span>
                      <span className="log-timeline__note">{h.note}</span>
                    </li>
                  ))}
                  {e.history.length > 3 && <li className="log-timeline__more">+{e.history.length - 3} more…</li>}
                </ul>
              )}

              <div className="log-card__foot">
                <span>
                  {e.brand ? e.brand + ' · ' : ''}
                  {e.date}
                </span>
                <button
                  className="icon-btn"
                  onClick={(ev) => {
                    ev.stopPropagation()
                    handleDelete(e.id)
                  }}
                  title="Delete entry"
                >
                  <IconTrash size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <LogEditor
          entry={editing === 'new' ? null : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </main>
  )
}
