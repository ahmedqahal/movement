import { useMemo, useState } from 'react'
import { BATTERIES } from '../data/batteries.js'

/* ---- small building blocks ---- */
function Calc({ title, desc, wide, children }) {
  return (
    <section className={`card calc ${wide ? 'calc--wide' : ''}`}>
      <div className="calc__head">
        <h2>{title}</h2>
        <p className="calc__desc">{desc}</p>
      </div>
      {children}
    </section>
  )
}

function Field({ label, hint, children }) {
  return (
    <label className="calc-field">
      <span className="calc-field__label">{label}</span>
      {children}
      {hint && <span className="calc-field__hint">{hint}</span>}
    </label>
  )
}

function Out({ value, unit, tone }) {
  return (
    <div className={`calc__out ${tone || ''}`}>
      <span className="calc__out-num">{value}</span>
      {unit && <span className="calc__out-unit">{unit}</span>}
    </div>
  )
}

const num = (s) => {
  const n = parseFloat(s)
  return Number.isFinite(n) ? n : null
}

/* ---- 1 · Rate helper ---- */
function RateHelper() {
  const [dev, setDev] = useState('')
  const [elapsed, setElapsed] = useState('24')
  const [unit, setUnit] = useState('hours')

  const d = num(dev)
  const e = num(elapsed)
  const hours = e == null ? null : unit === 'days' ? e * 24 : e
  const perDay = d != null && hours ? (d / hours) * 24 : null

  const band = (r) => {
    const a = Math.abs(r)
    if (a <= 6) return { label: 'Chronometer-grade (within COSC ±6 s/day)', tone: 'good' }
    if (a <= 12) return { label: 'Excellent for a mechanical watch', tone: 'good' }
    if (a <= 20) return { label: 'Good — normal for a healthy movement', tone: 'ok' }
    if (a <= 40) return { label: 'Acceptable; a regulation would tighten it', tone: 'warn' }
    return { label: 'Off — regulate, demagnetise, or service', tone: 'bad' }
  }
  const b = perDay == null ? null : band(perDay)

  return (
    <Calc
      title="Daily rate"
      desc="Set the watch against a reference, wait, then read how far it has drifted. This converts that into seconds per day."
    >
      <div className="calc__row">
        <Field label="Drift (seconds)" hint="+ if fast, − if slow">
          <input type="number" inputMode="decimal" value={dev} onChange={(e) => setDev(e.target.value)} placeholder="e.g. +8 or -5" />
        </Field>
        <Field label="Measured over">
          <input type="number" inputMode="decimal" min="0" value={elapsed} onChange={(e) => setElapsed(e.target.value)} />
        </Field>
        <Field label="Units">
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="hours">hours</option>
            <option value="days">days</option>
          </select>
        </Field>
      </div>
      {perDay == null ? (
        <div className="calc__hintline">Enter a drift and a time to see the rate.</div>
      ) : (
        <>
          <Out
            value={`${perDay > 0 ? '+' : ''}${perDay.toFixed(1)}`}
            unit={`s/day ${perDay > 0 ? '(gaining)' : perDay < 0 ? '(losing)' : ''}`}
            tone={b.tone}
          />
          <div className={`calc__band ${b.tone}`}>{b.label}</div>
        </>
      )}
    </Calc>
  )
}

/* ---- 2 · Beat rate ---- */
const BPH_PRESETS = [18000, 19800, 21600, 25200, 28800, 36000]
const bphNote = (bph) => {
  if (bph >= 36000) return 'High-beat (5 Hz) — very smooth sweep, e.g. Zenith El Primero, Grand Seiko VFA.'
  if (bph >= 28800) return 'The modern standard (4 Hz) — ETA 2824, Sellita SW200, Seiko NH35.'
  if (bph >= 25200) return '3.5 Hz — some Seiko/older calibres.'
  if (bph >= 21600) return '3 Hz — common in vintage and many Seiko movements.'
  if (bph >= 19800) return '2.75 Hz — older/vintage.'
  return 'Slow-beat (2.5 Hz) — vintage pocket & early wristwatches.'
}
function BeatRate() {
  const [bph, setBph] = useState('28800')
  const b = num(bph)
  const perSec = b ? b / 3600 : null
  const hz = b ? b / 7200 : null

  return (
    <Calc title="Beat rate" desc="Turn a movement’s beats-per-hour into beats per second and hertz — and see what family it belongs to.">
      <div className="calc__chips">
        {BPH_PRESETS.map((p) => (
          <button key={p} className={`calc-chip ${b === p ? 'active' : ''}`} onClick={() => setBph(String(p))}>
            {p.toLocaleString()}
          </button>
        ))}
      </div>
      <div className="calc__row">
        <Field label="Beats per hour (bph / A/h)">
          <input type="number" inputMode="numeric" min="0" value={bph} onChange={(e) => setBph(e.target.value)} />
        </Field>
      </div>
      {perSec == null ? (
        <div className="calc__hintline">Enter a beat rate.</div>
      ) : (
        <>
          <div className="calc__outrow">
            <Out value={perSec.toFixed(1)} unit="beats/sec" />
            <Out value={hz.toFixed(2)} unit="Hz" />
          </div>
          <div className="calc__note">{bphNote(b)}</div>
        </>
      )}
    </Calc>
  )
}

/* ---- 3 · Power reserve ---- */
function PowerReserve() {
  const [turns, setTurns] = useState('6.5')
  const [barrel, setBarrel] = useState('80')
  const [pinion, setPinion] = useState('12')

  const t = num(turns)
  const bt = num(barrel)
  const cp = num(pinion)
  const hours = t != null && bt != null && cp ? (t * bt) / cp : null

  return (
    <Calc
      title="Power-reserve estimate"
      desc="A rough running time from the mainspring’s working turns and the barrel-to-centre gearing. The centre wheel turns once per hour, so hours ≈ working turns × (barrel teeth ÷ centre-pinion leaves)."
    >
      <div className="calc__row">
        <Field label="Mainspring working turns" hint="usually ~6–7">
          <input type="number" inputMode="decimal" min="0" step="0.5" value={turns} onChange={(e) => setTurns(e.target.value)} />
        </Field>
        <Field label="Barrel teeth">
          <input type="number" inputMode="numeric" min="0" value={barrel} onChange={(e) => setBarrel(e.target.value)} />
        </Field>
        <Field label="Centre-pinion leaves">
          <input type="number" inputMode="numeric" min="0" value={pinion} onChange={(e) => setPinion(e.target.value)} />
        </Field>
      </div>
      {hours == null ? (
        <div className="calc__hintline">Fill in all three values.</div>
      ) : (
        <>
          <Out value={`≈ ${Math.round(hours)}`} unit="hours" />
          <div className="calc__note">
            About {Math.floor(hours / 24) > 0 ? `${Math.floor(hours / 24)} day${Math.floor(hours / 24) > 1 ? 's' : ''} ` : ''}
            {Math.round(hours % 24)} h. A ballpark only — real reserve falls as amplitude drops near the end of the wind.
          </div>
        </>
      )}
    </Calc>
  )
}

/* ---- 4 · Strap & lug sizing ---- */
const LUG_PRESETS = [16, 18, 19, 20, 21, 22, 24]
function StrapLug() {
  const [lug, setLug] = useState('20')
  const L = num(lug)

  return (
    <Calc title="Strap & lug sizing" desc="From the lug width (the gap between the lugs), the strap and hardware sizes that fit.">
      <div className="calc__chips">
        {LUG_PRESETS.map((p) => (
          <button key={p} className={`calc-chip ${L === p ? 'active' : ''}`} onClick={() => setLug(String(p))}>
            {p} mm
          </button>
        ))}
      </div>
      <div className="calc__row">
        <Field label="Lug width (mm)">
          <input type="number" inputMode="decimal" min="0" value={lug} onChange={(e) => setLug(e.target.value)} />
        </Field>
      </div>
      {L == null || L <= 0 ? (
        <div className="calc__hintline">Enter the lug width.</div>
      ) : (
        <div className="calc__spec">
          <div><span>Strap width</span><b>{L} mm</b></div>
          <div><span>Taper to buckle</span><b>{L - 2} or {L - 4} mm</b></div>
          <div><span>Spring bar length</span><b>≈ {L} mm</b></div>
          <div><span>Typical strap halves</span><b>75 mm + 115 mm</b></div>
          <div className="calc__spec-note">
            Even widths are near-universal; odd widths (19, 21 mm) are common on Seiko and some Swiss cases. “Long/XL” straps add ~20 mm on the buckle side.
          </div>
        </div>
      )}
    </Calc>
  )
}

/* ---- 5 · Amplitude & beat error ---- */
function AmplitudeBeat() {
  const [amp, setAmp] = useState('')
  const [be, setBe] = useState('')
  const [lift, setLift] = useState('52')
  const a = num(amp)
  const b = num(be)

  const ampBand = (v) => {
    if (v >= 270 && v <= 320) return { label: 'Healthy (270–320° dial-up, fully wound)', tone: 'good' }
    if (v >= 250 && v < 270) return { label: 'A little low — keep an eye on it', tone: 'ok' }
    if (v > 320) return { label: 'Too high — risk of rebanking/knocking; check the mainspring & escapement', tone: 'warn' }
    return { label: 'Low — dried oil, wear, or a fault; it’s due a service', tone: 'bad' }
  }
  const beBand = (v) => {
    if (v <= 0.5) return { label: 'Excellent', tone: 'good' }
    if (v <= 1.0) return { label: 'Good — acceptable', tone: 'ok' }
    return { label: 'High — correct it at the hairspring stud/collet', tone: 'warn' }
  }
  const ab = a == null ? null : ampBand(a)
  const bb = b == null ? null : beBand(b)

  return (
    <Calc
      title="Amplitude & beat error"
      desc="Read a timegrapher trace. Enter what it shows and get a plain-language verdict — set the lift angle to your calibre first, or the amplitude figure is meaningless."
    >
      <div className="calc__row">
        <Field label="Amplitude (°)">
          <input type="number" inputMode="decimal" min="0" value={amp} onChange={(e) => setAmp(e.target.value)} placeholder="e.g. 285" />
        </Field>
        <Field label="Beat error (ms)">
          <input type="number" inputMode="decimal" min="0" step="0.1" value={be} onChange={(e) => setBe(e.target.value)} placeholder="e.g. 0.3" />
        </Field>
        <Field label="Lift angle (°)" hint="usually 52; check your calibre">
          <input type="number" inputMode="decimal" min="0" value={lift} onChange={(e) => setLift(e.target.value)} />
        </Field>
      </div>
      {a == null && b == null ? (
        <div className="calc__hintline">Enter an amplitude and/or beat error.</div>
      ) : (
        <div className="calc__spec">
          {ab && (
            <div>
              <span>Amplitude {a}°</span>
              <b className={`calc-verdict ${ab.tone}`}>{ab.label}</b>
            </div>
          )}
          {bb && (
            <div>
              <span>Beat error {b} ms</span>
              <b className={`calc-verdict ${bb.tone}`}>{bb.label}</b>
            </div>
          )}
          <div className="calc__spec-note">
            The timegrapher derives amplitude from the lift angle, so it must match the movement (often 52°, but 6497 is 53°, some are 42–58°). A wrong lift angle gives a wrong amplitude.
          </div>
        </div>
      )}
    </Calc>
  )
}

/* ---- 6 · Battery cross-reference ---- */
function BatteryLookup() {
  const [q, setQ] = useState('')
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return BATTERIES
    return BATTERIES.filter((b) =>
      [b.code, b.iec, b.size, b.alt, b.chem].join(' ').toLowerCase().includes(s)
    )
  }, [q])

  return (
    <Calc wide title="Battery cross-reference" desc="Look up a watch cell by any code, cross-code, or size. Silver-oxide (SR, 1.55 V) unless the chemistry says lithium.">
      <div className="calc__row">
        <Field label="Search a cell">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. 377, SR626, LR44, 9.5 × 2.1…" />
        </Field>
      </div>
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>IEC / SR</th>
              <th>Size (mm)</th>
              <th>V</th>
              <th>Also called</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ color: 'var(--text-faint)' }}>No cell matches “{q}”.</td>
              </tr>
            ) : (
              rows.map((b) => (
                <tr key={b.code + b.iec}>
                  <td><b>{b.code}</b></td>
                  <td>{b.iec}</td>
                  <td>{b.size}</td>
                  <td>{b.v}</td>
                  <td>{b.alt}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Calc>
  )
}

export default function Calculators() {
  return (
    <main className="content">
      <div className="page-head">
        <div className="page-head__eyebrow">Bench Calculators</div>
        <h1>Quick reckoners</h1>
        <p>
          Small tools for the bench — work out a watch’s daily rate, decode its beat, estimate a
          power reserve, size a strap, and cross-reference a battery.
        </p>
      </div>

      <div className="calc-list">
        <RateHelper />
        <BeatRate />
        <PowerReserve />
        <StrapLug />
        <AmplitudeBeat />
        <BatteryLookup />
      </div>
    </main>
  )
}
