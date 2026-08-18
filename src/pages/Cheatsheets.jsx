import { REFERENCE } from '../data/reference.js'
import { BATTERIES } from '../data/batteries.js'
import { IconPrint } from '../components/Icons.jsx'

// Pull the first data table out of a reference article by id.
const tableFrom = (id) => {
  const art = REFERENCE.find((a) => a.id === id)
  return art?.sections.find((s) => s.table)?.table
}

function Sheet({ title, note, table }) {
  if (!table) return null
  return (
    <section className="sheet">
      <h2>{title}</h2>
      {note && <p className="sheet__note">{note}</p>}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {table.headers.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default function Cheatsheets() {
  const batteryTable = {
    headers: ['Code', 'IEC / SR', 'Size (mm)', 'V', 'Also called'],
    rows: BATTERIES.map((b) => [b.code, b.iec, b.size, b.v, b.alt]),
  }

  return (
    <main className="content cheatsheets">
      <div className="page-head">
        <div className="page-head__eyebrow">Cheat-sheets</div>
        <h1>Bench cheat-sheets</h1>
        <p>
          The tables you reach for most, gathered on one page and formatted to print cleanly in
          black and white. Pin them above the bench.
        </p>
        <button className="btn btn--solid no-print" onClick={() => window.print()} style={{ marginTop: 4 }}>
          <IconPrint size={17} /> Print these
        </button>
      </div>

      <div className="print-title">Movement — Bench Cheat-sheets</div>

      <div className="sheets">
        <Sheet
          title="Oiling chart"
          note="Three oils and two greases cover most work. Codes are Moebius examples — follow your calibre’s own sheet where one exists."
          table={tableFrom('oiling-guide')}
        />
        <Sheet
          title="Water resistance"
          note="Ratings measure static pressure, not depth. Be conservative, especially on older watches."
          table={tableFrom('water-resistance')}
        />
        <Sheet title="Battery cross-reference" note="Silver-oxide (SR, 1.55 V) unless the row says lithium." table={batteryTable} />
        <Sheet title="Lug & strap sizing" note="The strap width is set by the lug width." table={tableFrom('sizing')} />
        <Sheet title="Common calibres" note="A rough guide to the movements you’ll meet most." table={tableFrom('movement-families')} />
      </div>
    </main>
  )
}
