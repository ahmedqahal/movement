import { useEffect, useRef, useState } from 'react'
import { createTimegrapher, COMMON_BPH } from '../lib/timegrapher.js'
import { logPut } from '../lib/db.js'
import { IconPulse, IconCheck } from '../components/Icons.jsx'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function rateVerdict(r) {
  const a = Math.abs(r)
  if (a <= 8) return { label: 'Excellent', tone: 'emerald' }
  if (a <= 15) return { label: 'Good', tone: 'emerald' }
  if (a <= 30) return { label: 'Acceptable', tone: 'brass' }
  return { label: 'Needs regulating', tone: 'ruby' }
}

export default function Timegrapher() {
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')
  const [stat, setStat] = useState(null)
  const [bphMode, setBphMode] = useState('auto') // 'auto' | number(string)
  const [saved, setSaved] = useState(false)

  const engineRef = useRef(null)
  const rafRef = useRef(0)
  const canvasRef = useRef(null)
  const traceRef = useRef([]) // recent beat times for the visual

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current)
      engineRef.current && engineRef.current.stop()
    }
  }, [])

  const chosenBph = () => (bphMode === 'auto' ? undefined : Number(bphMode))

  const start = async () => {
    setError('')
    setSaved(false)
    const eng = createTimegrapher()
    engineRef.current = eng
    eng.onBeat = (t) => {
      const arr = traceRef.current
      arr.push(t)
      if (arr.length > 400) arr.shift()
    }
    try {
      await eng.start()
    } catch (err) {
      setError(
        err && err.name === 'NotAllowedError'
          ? 'Microphone access was blocked. Allow the microphone for this app, then tap Start again.'
          : 'Could not open the microphone on this device.'
      )
      engineRef.current = null
      return
    }
    setRunning(true)
    const loop = () => {
      const s = eng.stats(chosenBph())
      setStat(s)
      draw(s)
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
  }

  const stop = async () => {
    cancelAnimationFrame(rafRef.current)
    const eng = engineRef.current
    engineRef.current = null
    setRunning(false)
    if (eng) await eng.stop()
  }

  // Redraw the beat trace: x = phase within a two-beat window (tick vs tock),
  // newest beats at the bottom — the classic paper-tape look. Straight vertical
  // columns = on rate; slanting columns = fast/slow; two separated columns that
  // aren't evenly split = beat error.
  const draw = (s) => {
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    const w = cv.width
    const h = cv.height
    const css = getComputedStyle(document.documentElement)
    const ink = css.getPropertyValue('--text') || '#222'
    const faint = css.getPropertyValue('--line') || '#ccc'
    const brass = css.getPropertyValue('--brass') || '#b8860b'
    ctx.clearRect(0, 0, w, h)

    // centre guide + tick/tock guide lines
    ctx.strokeStyle = faint
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(w / 2, 0)
    ctx.lineTo(w / 2, h)
    ctx.stroke()

    const arr = traceRef.current
    if (!s || !s.ready || arr.length < 6) return
    const T = 3600 / s.bph
    const win = 2 * T
    const t0 = arr[0]
    const show = arr.slice(-Math.floor(h / 3))
    for (let i = 0; i < show.length; i++) {
      const t = show[i]
      let phase = ((t - t0) % win) / win // 0..1 across two beats
      const x = phase * w
      const y = h - (show.length - i) * 3
      if (y < 0) continue
      const parity = Math.round((t - t0) / T) % 2
      ctx.fillStyle = parity ? brass.trim() : ink.trim()
      ctx.beginPath()
      ctx.arc(x, y, 1.7, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const logReading = async () => {
    if (!stat || !stat.ready) return
    const entry = {
      id: uid(),
      title: `Timing check — ${new Date().toLocaleDateString()}`,
      brand: '',
      movementType: 'Other',
      calibre: '',
      workType: 'Timing / regulation',
      status: 'Completed',
      date: new Date().toISOString().slice(0, 10),
      rate: Math.round(stat.rate),
      beatError: Math.round(stat.beatError * 10) / 10,
      bph: stat.bph,
      notes: `Timegrapher (mic): ${Math.round(stat.rate) >= 0 ? '+' : ''}${Math.round(stat.rate)} s/day, beat error ${stat.beatError.toFixed(1)} ms, ${stat.bph} bph.`,
      tags: ['timing'],
      history: [],
      photos: [],
      updatedAt: Date.now(),
    }
    try {
      await logPut(entry)
      setSaved(true)
    } catch {
      /* ignore */
    }
  }

  const v = stat && stat.ready ? rateVerdict(stat.rate) : null

  return (
    <main className="content">
      <div className="page-head">
        <div className="page-head__eyebrow">Timegrapher</div>
        <h1>Time a watch by ear</h1>
        <p>
          Hold the watch against the phone’s microphone in a quiet room and Movement listens to the
          ticking to measure its <b>rate</b> and <b>beat error</b> — the two numbers you regulate by.
          Everything is analysed live on your device; no audio is recorded or sent.
        </p>
      </div>

      <div className="tg-controls">
        {!running ? (
          <button className="btn btn--solid" onClick={start}>
            <IconPulse size={18} /> Start listening
          </button>
        ) : (
          <button className="btn btn--solid tg-stop" onClick={stop}>
            Stop
          </button>
        )}
        <label className="tg-bph">
          Beat rate
          <select value={bphMode} onChange={(e) => setBphMode(e.target.value)}>
            <option value="auto">Auto-detect</option>
            {COMMON_BPH.map((b) => (
              <option key={b} value={b}>
                {b.toLocaleString()} bph
              </option>
            ))}
          </select>
        </label>
      </div>

      {error && <div className="card tg-error">{error}</div>}

      <div className="tg-layout">
        <div className="tg-readouts">
          <div className={`card tg-readout ${v ? 'tg-readout--' + v.tone : ''}`}>
            <span className="tg-readout__label">Rate</span>
            <b className="tg-readout__value">
              {stat && stat.ready ? `${stat.rate >= 0 ? '+' : ''}${Math.round(stat.rate)}` : '—'}
              <small>s/day</small>
            </b>
            {v && <span className={`pill ${v.tone}`}>{v.label}</span>}
          </div>

          <div className="card tg-readout">
            <span className="tg-readout__label">Beat error</span>
            <b className="tg-readout__value">
              {stat && stat.ready ? stat.beatError.toFixed(1) : '—'}
              <small>ms</small>
            </b>
            <span className="tg-readout__hint">Aim under 0.5 ms</span>
          </div>

          <div className="card tg-readout">
            <span className="tg-readout__label">Beat rate {stat && stat.ready && stat.snapped ? '' : '(raw)'}</span>
            <b className="tg-readout__value tg-readout__value--sm">
              {stat && stat.ready ? Math.round(stat.rawBph).toLocaleString() : '—'}
              <small>bph</small>
            </b>
            <span className="tg-readout__hint">
              {stat && stat.ready ? `reading as ${stat.bph.toLocaleString()}` : 'detecting…'}
            </span>
          </div>
        </div>

        <div className="card tg-trace">
          <div className="tg-trace__head">
            <span>Beat trace</span>
            <span className="tg-trace__legend">
              <i className="tg-dot tg-dot--tick" /> tick <i className="tg-dot tg-dot--tock" /> tock
            </span>
          </div>
          <canvas ref={canvasRef} width={300} height={260} className="tg-canvas" />
          {running && (!stat || !stat.ready) && (
            <div className="tg-trace__status">
              Listening… {stat ? stat.beats : 0} beats — hold the watch closer to the mic.
            </div>
          )}
        </div>
      </div>

      {stat && stat.ready && (
        <div className="tg-signal">
          <span>Signal</span>
          <div className="tg-signal__bar">
            <div style={{ width: `${Math.round(stat.stability * 100)}%` }} />
          </div>
          <button className="btn btn--ghost" onClick={logReading} disabled={saved}>
            {saved ? (
              <>
                <IconCheck size={15} /> Logged
              </>
            ) : (
              'Log this reading'
            )}
          </button>
        </div>
      )}

      <div className="card tg-tips">
        <h3>Getting a clean reading</h3>
        <ul>
          <li>Work in a <b>quiet room</b> — the mic hears everything, including you.</li>
          <li>Rest the watch <b>caseback- or crystal-down directly on the microphone</b> (usually the bottom edge of the phone). A little pressure couples the sound better.</li>
          <li>Give it <b>10–20 seconds</b> to settle; the longer it listens, the steadier the numbers.</li>
          <li>If the beat rate reads wildly wrong, pick the calibre’s real <b>bph</b> from the menu instead of Auto.</li>
        </ul>
        <p className="tg-honest">
          <b>What this can and can’t do.</b> Rate and beat error from a phone mic are genuinely useful
          for regulating. <b>Amplitude</b> isn’t shown: measuring it reliably needs the escapement’s
          three sub-sounds cleanly separated and the movement’s lift angle, which a phone mic in a
          normal room can’t deliver — a wrong amplitude is worse than none. For amplitude and a full
          trace, a dedicated timegrapher or a contact-mic setup is still the tool. To interpret any
          trace, see the <b>Amplitude &amp; beat-error</b> calculator.
        </p>
      </div>
    </main>
  )
}
