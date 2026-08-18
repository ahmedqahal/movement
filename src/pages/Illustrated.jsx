import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ILLUSTRATIONS } from '../data/illustrations.js'
import IllustratedPlate from '../components/IllustratedPlate.jsx'

export default function Illustrated() {
  const [params] = useSearchParams()
  const focus = params.get('focus')
  const [activeId, setActiveId] = useState(
    () => (ILLUSTRATIONS.some((p) => p.id === focus) ? focus : ILLUSTRATIONS[0].id)
  )

  useEffect(() => {
    if (focus && ILLUSTRATIONS.some((p) => p.id === focus)) setActiveId(focus)
  }, [focus])

  const plate = ILLUSTRATIONS.find((p) => p.id === activeId)

  return (
    <main className="content">
      <div className="page-head">
        <div className="page-head__eyebrow">Illustrated Plates</div>
        <h1>Painterly, and clickable</h1>
        <p>
          Rendered illustrations with accurate, interactive labels layered on top — the image
          carries the finish, the app carries the facts. Add your own artwork with the prompts
          provided and the labels light up.
        </p>
      </div>

      <div className="seg">
        {ILLUSTRATIONS.map((p) => (
          <button key={p.id} className={p.id === activeId ? 'active' : ''} onClick={() => setActiveId(p.id)}>
            {p.title}
          </button>
        ))}
      </div>

      <IllustratedPlate key={plate.id} plate={plate} />
    </main>
  )
}
