import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { search, GROUP_ORDER, GROUP_LABEL, TYPE_TAG } from '../lib/search.js'
import { IconSearch } from './Icons.jsx'

export default function SearchModal({ open, onClose }) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const navigate = useNavigate()

  const results = useMemo(() => search(q, 30), [q])

  const { groups, flat, indexOf } = useMemo(() => {
    const groups = GROUP_ORDER.map((type) => ({
      type,
      items: results.filter((r) => r.type === type),
    })).filter((g) => g.items.length)
    const flat = groups.flatMap((g) => g.items)
    const indexOf = new Map(flat.map((it, i) => [it, i]))
    return { groups, flat, indexOf }
  }, [results])

  // Reset selection as the query changes.
  useEffect(() => {
    setActive(0)
  }, [q])

  // Fresh state + focus each time the modal opens; lock background scroll.
  useEffect(() => {
    if (!open) return
    setQ('')
    setActive(0)
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(id)
      document.body.style.overflow = prev
    }
  }, [open])

  // Keep the active row scrolled into view.
  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`)
    el?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  const go = (item) => {
    if (!item) return
    const to = item.focus ? `${item.path}?focus=${encodeURIComponent(item.focus)}` : item.path
    onClose()
    navigate(to)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(flat.length - 1, a + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(0, a - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      go(flat[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  return (
    <div className="search-overlay" onMouseDown={onClose}>
      <div className="search-modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Search">
        <div className="search-box">
          <IconSearch size={20} />
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Search lessons, terms, guides, tools…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            spellCheck="false"
            aria-label="Search query"
          />
          <kbd className="search-kbd">Esc</kbd>
        </div>

        <div className="search-results" ref={listRef}>
          {q.trim() === '' ? (
            <div className="search-hint">
              Search across every lesson, diagram, guide, term and tool.
              <div className="search-hint__ex">Try “escapement”, “oiling”, “6497”, “beat error”.</div>
            </div>
          ) : flat.length === 0 ? (
            <div className="search-empty">
              No matches for “{q}”.
            </div>
          ) : (
            groups.map((g) => (
              <div className="search-group" key={g.type}>
                <div className="search-group__label">{GROUP_LABEL[g.type]}</div>
                {g.items.map((item) => {
                  const i = indexOf.get(item)
                  return (
                    <button
                      key={item.path + (item.focus || '') + item.title}
                      data-idx={i}
                      className={`search-result ${i === active ? 'active' : ''}`}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(item)}
                    >
                      <span className="search-result__main">
                        <span className="search-result__title">{item.title}</span>
                        {item.subtitle && <span className="search-result__sub">{item.subtitle}</span>}
                      </span>
                      <span className="search-result__tag">{TYPE_TAG[item.type]}</span>
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        <div className="search-foot">
          <span><kbd className="search-kbd">↑</kbd><kbd className="search-kbd">↓</kbd> to navigate</span>
          <span><kbd className="search-kbd">↵</kbd> to open</span>
          <span><kbd className="search-kbd">esc</kbd> to close</span>
        </div>
      </div>
    </div>
  )
}
