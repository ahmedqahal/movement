import { useEffect, useMemo, useRef, useState } from 'react'
import { logGetAll, logPut, logDelete, logBulkPut, fileToResizedDataURL } from '../lib/db.js'
import {
  IconPlus,
  IconTrash,
  IconCamera,
  IconClose,
  IconLog,
  IconDownload,
  IconPrint,
  IconClock,
} from '../components/Icons.jsx'

const MOVEMENTS = ['Automatic', 'Manual mechanical', 'Quartz', 'Chronograph', 'Other']
const STATUSES = ['Completed', 'In progress', 'Needs parts', 'Wishlist']
const STATUS_PILL = { Completed: 'emerald', 'In progress': 'brass', 'Needs parts': 'ruby', Wishlist: 'steel' }
const DUE_WINDOW = 45 // days: a service counts as "due soon" inside this window

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}
const num = (v) => (v === '' || v === null || v === undefined || isNaN(Number(v)) ? undefined : Number(v))
const daysUntil = (d) => (d ? Math.round((new Date(d + 'T00:00') - new Date().setHours(0, 0, 0, 0)) / 86400000) : null)

// Group entries into "watches" so repeat services on one watch read as a history.
const watchKey = (e) =>
  (e.serial && e.serial.trim()) || [e.brand, e.calibre].filter(Boolean).join(' ').trim() || e.title

// Tiny inline sparkline of rate (s/day) across a watch's services. No library.
function RateSparkline({ points }) {
  if (!points || points.length < 2) return null
  const w = 148
  const h = 40
  const pad = 4
  const xs = points.map((p) => +new Date(p.date))
  const ys = points.map((p) => p.rate)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const bound = Math.max(10, ...ys.map((y) => Math.abs(y)))
  const sx = (x) => (maxX === minX ? w / 2 : pad + ((x - minX) / (maxX - minX)) * (w - 2 * pad))
  const sy = (y) => h / 2 - (y / bound) * (h / 2 - pad)
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${sx(+new Date(p.date)).toFixed(1)} ${sy(p.rate).toFixed(1)}`).join(' ')
  return (
    <svg className="rate-spark" viewBox={`0 0 ${w} ${h}`} width={w} height={h} aria-hidden="true">
      <line x1={pad} y1={h / 2} x2={w - pad} y2={h / 2} className="rate-spark__zero" />
      <path d={d} className="rate-spark__line" fill="none" />
      {points.map((p, i) => (
        <circle key={i} cx={sx(+new Date(p.date))} cy={sy(p.rate)} r="2.2" className="rate-spark__dot" />
      ))}
    </svg>
  )
}

function LogEditor({ entry, onSave, onCancel }) {
  const [form, setForm] = useState(
    entry || {
      id: uid(),
      title: '',
      brand: '',
      serial: '',
      movementType: 'Automatic',
      calibre: '',
      workType: '',
      status: 'In progress',
      date: new Date().toISOString().slice(0, 10),
      nextService: '',
      rate: '',
      amplitude: '',
      beatError: '',
      parts: [],
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
    setForm((f) => ({ ...f, history: [...(f.history || []), { date: new Date().toISOString().slice(0, 10), note: '' }] }))
  const setHist = (i, k, v) => setForm((f) => ({ ...f, history: f.history.map((h, idx) => (idx === i ? { ...h, [k]: v } : h)) }))
  const removeHist = (i) => setForm((f) => ({ ...f, history: f.history.filter((_, idx) => idx !== i) }))

  const addPart = () => setForm((f) => ({ ...f, parts: [...(f.parts || []), { name: '', cost: '' }] }))
  const setPart = (i, k, v) => setForm((f) => ({ ...f, parts: f.parts.map((p, idx) => (idx === i ? { ...p, [k]: v } : p)) }))
  const removePart = (i) => setForm((f) => ({ ...f, parts: f.parts.filter((_, idx) => idx !== i) }))

  const save = () => {
    if (!form.title.trim()) return
    const tags = [...new Set(tagsText.split(',').map((t) => t.trim()).filter(Boolean))]
    const history = (form.history || []).filter((h) => h.note.trim()).sort((a, b) => (a.date < b.date ? 1 : -1))
    const parts = (form.parts || []).filter((p) => (p.name || '').trim()).map((p) => ({ name: p.name.trim(), cost: num(p.cost) }))
    onSave({
      ...form,
      title: form.title.trim(),
      serial: (form.serial || '').trim(),
      rate: num(form.rate),
      amplitude: num(form.amplitude),
      beatError: num(form.beatError),
      tags,
      history,
      parts,
      updatedAt: Date.now(),
    })
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
            <label>Serial / ref <span className="field__opt">(groups repeat services)</span></label>
            <input value={form.serial} onChange={set('serial')} placeholder="optional" />
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

        <div className="field-row">
          <div className="field">
            <label>Date</label>
            <input type="date" value={form.date} onChange={set('date')} />
          </div>
          <div className="field">
            <label>Next service due <span className="field__opt">(reminder)</span></label>
            <input type="date" value={form.nextService || ''} onChange={set('nextService')} />
          </div>
        </div>

        <div className="field">
          <label>Timing <span className="field__opt">(from a timegrapher — plotted over time)</span></label>
          <div className="field-triple">
            <input type="number" inputMode="numeric" value={form.rate} onChange={set('rate')} placeholder="rate s/day" />
            <input type="number" inputMode="numeric" value={form.amplitude} onChange={set('amplitude')} placeholder="amplitude °" />
            <input type="number" inputMode="numeric" step="0.1" value={form.beatError} onChange={set('beatError')} placeholder="beat error ms" />
          </div>
        </div>

        <div className="field">
          <label>Tags</label>
          <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="comma-separated, e.g. diver, gift, vintage" />
        </div>

        <div className="field">
          <label>Notes</label>
          <textarea value={form.notes} onChange={set('notes')} placeholder="What you did, what went wrong, part numbers…" />
        </div>

        <div className="field">
          <label>Parts &amp; cost</label>
          {(form.parts || []).map((p, i) => (
            <div className="part-row" key={i}>
              <input value={p.name} onChange={(e) => setPart(i, 'name', e.target.value)} placeholder="e.g. Mainspring GR3428" />
              <input type="number" inputMode="decimal" value={p.cost} onChange={(e) => setPart(i, 'cost', e.target.value)} placeholder="cost" />
              <button className="icon-btn" onClick={() => removePart(i)} title="Remove part">
                <IconClose size={13} />
              </button>
            </div>
          ))}
          <button className="btn btn--ghost" onClick={addPart} style={{ marginTop: 6 }}>
            <IconPlus size={15} /> Add part
          </button>
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

// A printable, single-watch service report (shown only when printing).
function PrintReport({ group }) {
  if (!group) return null
  const total = group.entries.reduce((s, e) => s + (e.parts || []).reduce((t, p) => t + (p.cost || 0), 0), 0)
  return (
    <div className="print-report">
      <h1>{group.label}</h1>
      <p className="print-report__sub">
        {group.serial ? `Serial/ref: ${group.serial} · ` : ''}
        {group.entries.length} service{group.entries.length === 1 ? '' : 's'} · report generated {new Date().toLocaleDateString()}
      </p>
      {group.entries.map((e) => (
        <div key={e.id} className="print-report__entry">
          <h2>
            {e.date} — {e.workType || e.title} <span>({e.status})</span>
          </h2>
          {(e.rate !== undefined || e.amplitude !== undefined || e.beatError !== undefined) && (
            <p>
              Timing:{' '}
              {e.rate !== undefined ? `${e.rate >= 0 ? '+' : ''}${e.rate} s/day` : '—'}
              {e.amplitude !== undefined ? ` · ${e.amplitude}° amplitude` : ''}
              {e.beatError !== undefined ? ` · ${e.beatError} ms beat error` : ''}
            </p>
          )}
          {e.notes && <p>{e.notes}</p>}
          {(e.parts || []).length > 0 && (
            <ul>
              {e.parts.map((p, i) => (
                <li key={i}>
                  {p.name}
                  {p.cost !== undefined ? ` — ${p.cost}` : ''}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      {total > 0 && <p className="print-report__total">Total parts cost: {total.toFixed(2)}</p>}
    </div>
  )
}

export default function PracticeLog() {
  const [entries, setEntries] = useState([])
  const [editing, setEditing] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [query, setQuery] = useState('')
  const [statusF, setStatusF] = useState('All')
  const [moveF, setMoveF] = useState('All')
  const [tagF, setTagF] = useState(null)
  const [sort, setSort] = useState('newest')
  const [viewMode, setViewMode] = useState('entries') // 'entries' | 'watches' | 'due'
  const [printGroup, setPrintGroup] = useState(null)
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

  // Services coming due (or overdue) within the window.
  const dueList = useMemo(() => {
    return entries
      .filter((e) => e.nextService)
      .map((e) => ({ entry: e, days: daysUntil(e.nextService) }))
      .filter((d) => d.days !== null && d.days <= DUE_WINDOW)
      .sort((a, b) => a.days - b.days)
  }, [entries])

  // Fire a one-time browser notification (only while the app is open) if the
  // user has granted permission and something is due.
  useEffect(() => {
    if (!loaded || !dueList.length) return
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
    const key = 'movement.duenotified.' + new Date().toISOString().slice(0, 10)
    try {
      if (localStorage.getItem(key)) return
      const overdue = dueList.filter((d) => d.days < 0).length
      new Notification('Movement — service due', {
        body: `${dueList.length} watch${dueList.length === 1 ? '' : 'es'} due for service${overdue ? ` (${overdue} overdue)` : ''}.`,
      })
      localStorage.setItem(key, '1')
    } catch {
      /* ignore */
    }
  }, [loaded, dueList])

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
          e.title, e.brand, e.calibre, e.serial, e.workType, e.notes, e.status, e.movementType,
          (e.tags || []).join(' '),
          (e.history || []).map((h) => h.note).join(' '),
          (e.parts || []).map((p) => p.name).join(' '),
        ].join(' ').toLowerCase()
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

  // Group the currently-visible entries into watches.
  const watches = useMemo(() => {
    const map = new Map()
    for (const e of visible) {
      const k = watchKey(e)
      if (!map.has(k)) map.set(k, [])
      map.get(k).push(e)
    }
    return [...map.entries()].map(([k, list]) => {
      const sorted = [...list].sort((a, b) => (a.date < b.date ? 1 : -1))
      const first = sorted[0]
      const label = [first.brand, first.calibre].filter(Boolean).join(' ').trim() || first.title
      const ratePoints = sorted
        .filter((e) => typeof e.rate === 'number')
        .map((e) => ({ date: e.date, rate: e.rate }))
        .sort((a, b) => (a.date < b.date ? -1 : 1))
      const dueEntry = sorted.find((e) => e.nextService)
      return {
        key: k,
        label,
        serial: first.serial,
        entries: sorted,
        ratePoints,
        nextService: dueEntry ? dueEntry.nextService : null,
        dueDays: dueEntry ? daysUntil(dueEntry.nextService) : null,
      }
    }).sort((a, b) => b.entries[0].date.localeCompare(a.entries[0].date))
  }, [visible])

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
      setEntries(await logGetAll())
      alert(`Imported ${n} ${n === 1 ? 'entry' : 'entries'}.`)
    } catch {
      alert('Could not import — is this a Movement backup JSON file?')
    }
  }

  const printReport = (group) => {
    setPrintGroup(group)
    setTimeout(() => {
      window.print()
      setTimeout(() => setPrintGroup(null), 300)
    }, 60)
  }

  const enableReminders = async () => {
    if (typeof Notification === 'undefined') {
      alert('This device can’t show reminders. Due services are still flagged here in the app.')
      return
    }
    const p = await Notification.requestPermission()
    if (p === 'granted') new Notification('Movement', { body: 'Service reminders are on. You’ll be nudged when a watch is due.' })
  }

  return (
    <main className="content">
      <div className="page-head no-print">
        <div className="page-head__eyebrow">Practice Log</div>
        <h1>Your workbench journal</h1>
        <p>
          Record every watch you work on — movement, timing, parts and photos. Group repeat services
          into one watch, chart its rate over time, and get a nudge when the next service is due.
          Everything stays private on this device.
        </p>
      </div>

      {/* Due-soon banner */}
      {loaded && dueList.length > 0 && (
        <div className="card due-banner no-print">
          <IconClock size={20} />
          <div className="due-banner__text">
            <b>
              {dueList.length} watch{dueList.length === 1 ? '' : 'es'} due for service
              {dueList.some((d) => d.days < 0) ? ` — ${dueList.filter((d) => d.days < 0).length} overdue` : ''}
            </b>
            <span>
              {dueList.slice(0, 3).map((d) => `${d.entry.title} (${d.days < 0 ? `${-d.days}d overdue` : `in ${d.days}d`})`).join(' · ')}
            </span>
          </div>
          <button className="btn btn--ghost" onClick={() => setViewMode('due')}>
            View
          </button>
        </div>
      )}

      <div className="log-toolbar no-print">
        <button className="btn btn--solid" onClick={() => setEditing('new')}>
          <IconPlus size={17} /> Log a watch
        </button>
        <div className="log-toolbar__right">
          <button className="btn btn--ghost" onClick={enableReminders} title="Allow reminders">
            <IconClock size={16} /> Reminders
          </button>
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
        <div className="card log-stats no-print">
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
        <div className="log-viewtabs no-print">
          {[
            ['entries', 'All entries'],
            ['watches', 'By watch'],
            ['due', `Due soon${dueList.length ? ` (${dueList.length})` : ''}`],
          ].map(([id, label]) => (
            <button key={id} className={`chip ${viewMode === id ? 'active' : ''}`} onClick={() => setViewMode(id)}>
              {label}
            </button>
          ))}
        </div>
      )}

      {entries.length > 0 && viewMode !== 'due' && (
        <div className="log-filters no-print">
          <input className="log-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, calibre, notes, tags…" />
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

      {allTags.length > 0 && viewMode !== 'due' && (
        <div className="log-tagbar no-print">
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

      {entries.length > 0 && viewMode !== 'due' && visible.length === 0 && (
        <div className="card empty-state">
          <h3>Nothing matches</h3>
          <p>No entries fit the current search or filters.</p>
          {filtering && (
            <button className="btn btn--ghost" onClick={clearFilters} style={{ marginTop: 4 }}>
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* DUE view */}
      {viewMode === 'due' && (
        <div className="log-grid">
          {dueList.length === 0 && (
            <div className="card empty-state">
              <IconClock size={40} />
              <h3>Nothing due</h3>
              <p>Set a “next service due” date on an entry and it’ll show up here when it’s within {DUE_WINDOW} days.</p>
            </div>
          )}
          {dueList.map(({ entry: e, days }) => (
            <div key={e.id} className="card log-card log-card--due" onClick={() => setEditing(e)} style={{ cursor: 'pointer' }}>
              <div className="log-card__body">
                <div className={`due-flag ${days < 0 ? 'overdue' : ''}`}>
                  <IconClock size={14} /> {days < 0 ? `${-days} days overdue` : days === 0 ? 'Due today' : `Due in ${days} days`}
                </div>
                <h3>{e.title}</h3>
                <div className="log-card__meta">
                  <span className={`pill ${STATUS_PILL[e.status] || ''}`}>{e.status}</span>
                  {e.calibre && <span className="pill">{e.calibre}</span>}
                </div>
                <div className="log-card__foot">
                  <span>Next service: {e.nextService}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BY WATCH view */}
      {viewMode === 'watches' && (
        <div className="watch-list">
          {watches.map((g) => (
            <div key={g.key} className="card watch-card">
              <div className="watch-card__head">
                <div>
                  <h3>{g.label}</h3>
                  <span className="watch-card__meta">
                    {g.serial ? `${g.serial} · ` : ''}
                    {g.entries.length} service{g.entries.length === 1 ? '' : 's'}
                    {g.nextService ? ` · next ${g.nextService}` : ''}
                  </span>
                </div>
                <div className="watch-card__actions">
                  {g.dueDays !== null && g.dueDays <= DUE_WINDOW && (
                    <span className={`pill ${g.dueDays < 0 ? 'ruby' : 'brass'}`}>
                      {g.dueDays < 0 ? `${-g.dueDays}d overdue` : `due ${g.dueDays}d`}
                    </span>
                  )}
                  <button className="btn btn--ghost" onClick={() => printReport(g)} title="Print service report">
                    <IconPrint size={15} /> Report
                  </button>
                </div>
              </div>

              {g.ratePoints.length >= 2 && (
                <div className="watch-card__chart">
                  <RateSparkline points={g.ratePoints} />
                  <span className="watch-card__chart-label">
                    rate over {g.ratePoints.length} readings · latest {g.ratePoints[g.ratePoints.length - 1].rate >= 0 ? '+' : ''}
                    {g.ratePoints[g.ratePoints.length - 1].rate} s/day
                  </span>
                </div>
              )}

              <ul className="watch-timeline">
                {g.entries.map((e) => (
                  <li key={e.id} onClick={() => setEditing(e)}>
                    <span className="watch-timeline__date">{e.date}</span>
                    <span className="watch-timeline__work">
                      {e.workType || e.title}
                      {typeof e.rate === 'number' && <em> · {e.rate >= 0 ? '+' : ''}{e.rate} s/day</em>}
                    </span>
                    <span className={`pill ${STATUS_PILL[e.status] || ''}`}>{e.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* ALL ENTRIES view (original cards) */}
      {viewMode === 'entries' && (
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
                  {typeof e.rate === 'number' && <span className="pill steel">{e.rate >= 0 ? '+' : ''}{e.rate} s/d</span>}
                </div>
                {e.workType && <div style={{ fontSize: '0.86rem', color: 'var(--text)' }}>{e.workType}</div>}
                {e.notes && <p className="log-card__notes">{e.notes.length > 140 ? e.notes.slice(0, 140) + '…' : e.notes}</p>}

                {e.tags && e.tags.length > 0 && (
                  <div className="log-card__tags">
                    {e.tags.map((t) => (
                      <button key={t} className={`tag ${tagF === t ? 'active' : ''}`} onClick={(ev) => { ev.stopPropagation(); setTagF(tagF === t ? null : t) }}>
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
                  <button className="icon-btn" onClick={(ev) => { ev.stopPropagation(); handleDelete(e.id) }} title="Delete entry">
                    <IconTrash size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <LogEditor entry={editing === 'new' ? null : editing} onSave={handleSave} onCancel={() => setEditing(null)} />
      )}

      <PrintReport group={printGroup} />
    </main>
  )
}
