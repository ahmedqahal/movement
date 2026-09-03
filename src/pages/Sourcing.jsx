import { useState } from 'react'
import { KITS, SUPPLIERS, PARTS_GUIDE, CONSUMABLES } from '../data/sourcing.js'
import { IconCart, IconPrint, IconArrow } from '../components/Icons.jsx'

export default function Sourcing() {
  const [tier, setTier] = useState(KITS[0].id)
  const kit = KITS.find((k) => k.id === tier) || KITS[0]

  return (
    <main className="content">
      <div className="page-head">
        <div className="page-head__eyebrow">Sourcing &amp; Parts</div>
        <h1>What to buy, and where</h1>
        <p>
          Tool kits by skill level, the material houses that stock them, and how to read a part
          number so you order the right thing the first time. Prices and stock change — always
          confirm on the supplier’s own site.
        </p>
      </div>

      {/* Tool kits */}
      <section className="src-section">
        <div className="src-section__head">
          <h2>Tool kits by level</h2>
          <button className="btn btn--ghost no-print" onClick={() => window.print()}>
            <IconPrint size={16} /> Print this kit
          </button>
        </div>

        <div className="src-tiers no-print">
          {KITS.map((k) => (
            <button
              key={k.id}
              className={`chip ${tier === k.id ? 'active' : ''}`}
              onClick={() => setTier(k.id)}
            >
              {k.tier}
            </button>
          ))}
        </div>

        <div className="card src-kit" id="printable-kit">
          <h3>{kit.tier} kit</h3>
          <p className="src-kit__blurb">{kit.blurb}</p>
          <ul className="src-kit__list">
            {kit.items.map((it) => (
              <li key={it.name}>
                <span className="src-kit__box" aria-hidden="true" />
                <div>
                  <b>{it.name}</b>
                  <span>{it.why}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Suppliers */}
      <section className="src-section no-print">
        <h2>Where to buy</h2>
        {SUPPLIERS.map((group) => (
          <div key={group.region} className="src-suppliers">
            <h3>{group.region}</h3>
            <div className="src-supplier-grid">
              {group.houses.map((h) => (
                <div key={h.name} className="card src-supplier">
                  <div className="src-supplier__top">
                    {h.url ? (
                      <a href={h.url} target="_blank" rel="noopener noreferrer" className="src-supplier__name">
                        {h.name} <IconArrow size={13} />
                      </a>
                    ) : (
                      <span className="src-supplier__name">{h.name}</span>
                    )}
                    <span className="src-supplier__carries">{h.carries}</span>
                  </div>
                  <p>{h.note}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Reading part numbers */}
      <section className="src-section no-print">
        <h2>Ordering parts</h2>
        <div className="src-guide">
          {PARTS_GUIDE.map((g) => (
            <div key={g.heading} className="card src-guide__item">
              <h3>{g.heading}</h3>
              <p>{g.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Consumables */}
      <section className="src-section no-print">
        <h2>Oils &amp; greases — quick reference</h2>
        <div className="card src-consumables">
          <table>
            <thead>
              <tr>
                <th>Lubricant</th>
                <th>Where it goes</th>
              </tr>
            </thead>
            <tbody>
              {CONSUMABLES.map((c) => (
                <tr key={c.name}>
                  <td><b>{c.name}</b></td>
                  <td>{c.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="src-note">
            Lubrication is calibre- and jewel-specific — treat this as a memory aid, not a substitute
            for the manufacturer’s oiling chart. See the oiling lessons for exactly which surface gets
            which oil.
          </p>
        </div>
      </section>

      <p className="src-disclaimer no-print">
        Movement isn’t affiliated with any supplier and earns nothing from these links — they’re here
        because they’re the houses hobbyists actually use. Do your own price and stock check.
      </p>
    </main>
  )
}
