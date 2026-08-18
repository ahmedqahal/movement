import { useEffect, useState } from 'react'
import asset from '../lib/asset.js'

// A painterly raster illustration with an interactive hotspot overlay.
// The image supplies the finish; the app supplies accurate labels.
// If the image file is missing, shows the generation prompt to copy.
export default function IllustratedPlate({ plate }) {
  const [status, setStatus] = useState('loading') // loading | ok | missing
  const [active, setActive] = useState(null)
  const [calib, setCalib] = useState(false)
  const [point, setPoint] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setStatus('loading')
    setActive(null)
    setPoint(null)
    setCalib(false)
  }, [plate.id])

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(plate.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable — the prompt is visible to select manually */
    }
  }

  const onStageClick = (e) => {
    if (!calib) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (((e.clientX - r.left) / r.width) * 100).toFixed(1)
    const y = (((e.clientY - r.top) / r.height) * 100).toFixed(1)
    setPoint({ x, y })
    try {
      navigator.clipboard.writeText(`{ x: ${x}, y: ${y}, label: '', detail: '' },`)
    } catch {
      /* shown in the UI regardless */
    }
  }

  const spot = active != null ? plate.hotspots[active] : null

  if (status === 'missing') {
    return (
      <div className="card illus-missing">
        <h3>This plate needs its artwork</h3>
        <p>
          Generate the image with any image tool (Midjourney, DALL·E, etc.), then save it to{' '}
          <code>public{plate.file}</code> and reload — the interactive labels are already wired.
        </p>
        <div className="illus-prompt">
          <div className="illus-prompt__label">Generation prompt</div>
          <p>{plate.prompt}</p>
          <button className="btn btn--ghost" onClick={copyPrompt}>
            {copied ? 'Copied ✓' : 'Copy prompt'}
          </button>
        </div>
        <p className="illus-missing__why">
          Why no text in the image? Image models mangle labels — the app overlays accurate,
          clickable ones instead.
        </p>
      </div>
    )
  }

  return (
    <div className="illus">
      <div className={`illus-stage ${calib ? 'illus-stage--calib' : ''}`} onClick={onStageClick}>
        <img
          src={asset(plate.file)}
          alt={plate.title}
          className="illus-img"
          onLoad={() => setStatus('ok')}
          onError={() => setStatus('missing')}
          style={status === 'ok' ? undefined : { visibility: 'hidden', minHeight: 240 }}
        />
        {status === 'ok' &&
          !calib &&
          plate.hotspots.map((h, i) => (
            <button
              key={i}
              className={`illus-dot ${active === i ? 'active' : ''}`}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              onClick={(e) => {
                e.stopPropagation()
                setActive(active === i ? null : i)
              }}
              aria-label={h.label}
            >
              {i + 1}
            </button>
          ))}
        {calib && point && (
          <div className="illus-crosshair" style={{ left: `${point.x}%`, top: `${point.y}%` }} />
        )}
      </div>

      {status === 'ok' && (
        <div className="illus-under">
          <div className="card illus-panel" aria-live="polite">
            {spot ? (
              <>
                <div className="illus-panel__num">HOTSPOT {String(active + 1).padStart(2, '0')}</div>
                <h3>{spot.label}</h3>
                <p>{spot.detail}</p>
              </>
            ) : calib ? (
              <>
                <h3>Position mode</h3>
                <p>
                  Click anywhere on the image to read its percent coordinates
                  {point ? (
                    <>
                      {' — last click: '}
                      <code>
                        x: {point.x}, y: {point.y}
                      </code>{' '}
                      (copied as a hotspot line).
                    </>
                  ) : (
                    '. Paste the copied line into src/data/illustrations.js.'
                  )}
                </p>
              </>
            ) : (
              <>
                <h3>{plate.title}</h3>
                <p className="empty">Click a numbered dot to identify that part.</p>
              </>
            )}
            <div className="chip-row">
              {plate.hotspots.map((h, i) => (
                <button
                  key={i}
                  className={`chip ${active === i ? 'active' : ''}`}
                  onClick={() => setActive(active === i ? null : i)}
                >
                  {i + 1}. {h.label}
                </button>
              ))}
            </div>
          </div>
          <button className={`btn btn--ghost illus-calib-toggle ${calib ? 'active' : ''}`} onClick={() => setCalib(!calib)}>
            {calib ? 'Exit position mode' : 'Position mode (adjust dots)'}
          </button>
        </div>
      )}
    </div>
  )
}
