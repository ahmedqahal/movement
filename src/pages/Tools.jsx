import { TOOLS, TOOL_GROUPS } from '../data/tools.js'
import { IconTools } from '../components/Icons.jsx'
import { slug } from '../lib/search.js'
import useFocusScroll from '../lib/useFocusScroll.js'

export default function Tools() {
  useFocusScroll('t-')
  return (
    <main className="content">
      <div className="page-head">
        <div className="page-head__eyebrow">Toolkit</div>
        <h1>The watchmaker’s tools</h1>
        <p>
          You don’t need everything at once. Tools marked <span className="pill brass" style={{ verticalAlign: 'middle' }}>Essential</span>{' '}
          make up a sensible starter kit for straps, batteries, and basic case work.
        </p>
      </div>

      {TOOL_GROUPS.map((group) => {
        const items = TOOLS.filter((t) => t.group === group)
        if (!items.length) return null
        return (
          <section key={group} style={{ marginBottom: 34 }}>
            <div className="section-title" style={{ margin: '0 0 14px' }}>
              <h2 style={{ fontSize: '1.25rem' }}>{group}</h2>
            </div>
            <div className="grid grid--2">
              {items.map((t) => (
                <div key={t.name} id={`t-${slug(t.name)}`} className="card tool-card">
                  <div className="tool-card__icon">
                    <IconTools size={24} />
                  </div>
                  <div>
                    <h3>{t.name}</h3>
                    <p>{t.use}</p>
                    {t.essential && <div className="tool-card__ess">★ Essential starter kit</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </main>
  )
}
