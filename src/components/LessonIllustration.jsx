import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ILLUSTRATIONS } from '../data/illustrations.js'

// An illustrated plate embedded inside a lesson step: the artwork with its
// numbered hotspots, a caption line for the selected part, and a link through
// to the full plate. Silently renders nothing if the artwork is missing.
export default function LessonIllustration({ id }) {
  const plate = ILLUSTRATIONS.find((p) => p.id === id)
  const [active, setActive] = useState(null)
  const [ok, setOk] = useState(true)

  if (!plate || !ok) return null
  const spot = active != null ? plate.hotspots[active] : null

  return (
    <div className="lesson-illus">
      <div className="lesson-illus__stage">
        <img src={plate.file} alt={plate.title} onError={() => setOk(false)} />
        {plate.hotspots.map((h, i) => (
          <button
            key={i}
            className={`illus-dot illus-dot--sm ${active === i ? 'active' : ''}`}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            onClick={() => setActive(active === i ? null : i)}
            aria-label={h.label}
            title={h.label}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <div className="lesson-illus__cap">
        {spot ? (
          <p>
            <strong>{spot.label}.</strong> {spot.detail}
          </p>
        ) : (
          <p className="lesson-illus__hint">Click a number to identify each part.</p>
        )}
        <Link className="lesson-illus__link" to={`/illustrated?focus=${plate.id}`}>
          Open full plate →
        </Link>
      </div>
    </div>
  )
}
