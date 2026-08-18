import { PLATES } from '../components/plates/index.jsx'
import useFocusScroll from '../lib/useFocusScroll.js'

export default function Plates() {
  useFocusScroll('p-')
  return (
    <main className="content">
      <div className="page-head">
        <div className="page-head__eyebrow">Technical Plates</div>
        <h1>The diagrams behind the craft</h1>
        <p>
          Clean, labelled recreations of classic watchmaking figures — the exact geometry that
          governs how a movement works, redrawn from the reference books in plain, readable form.
        </p>
      </div>

      <div className="plates">
        {PLATES.map(({ id, title, caption, source, Component }) => (
          <figure key={id} id={`p-${id}`} className="card plate">
            <h2 className="plate__title">{title}</h2>
            <div className="plate__art">
              <Component />
            </div>
            <figcaption className="plate__cap">{caption}</figcaption>
            <div className="plate__src">{source}</div>
          </figure>
        ))}
      </div>
    </main>
  )
}
