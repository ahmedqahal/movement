// Geometry helpers + realistic SVG parts for the watch diagrams.
// Wheels mesh (shared module = matching tooth size), have curved
// crossings, a specular rim glint, and metallic gradients. Bridges
// carry Geneva stripes and blued screws; jewels sit in gold chatons.
// Drop <Defs/> once inside each <svg> to make gradients/filters available.
import { useId, memo } from 'react'

export function polar(cx, cy, r, a) {
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}
const P = (cx, cy, r, a) => {
  const p = polar(cx, cy, r, a)
  return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
}
function circlePath(cx, cy, r) {
  return `M${(cx - r).toFixed(2)},${cy.toFixed(2)} A${r},${r} 0 1 0 ${(cx + r).toFixed(2)},${cy.toFixed(2)} A${r},${r} 0 1 0 ${(cx - r).toFixed(2)},${cy.toFixed(2)} Z`
}
export function arcPath(cx, cy, r, a0, a1) {
  const s = polar(cx, cy, r, a0)
  const e = polar(cx, cy, r, a1)
  const large = a1 - a0 > Math.PI ? 1 : 0
  return `M${s.x.toFixed(2)},${s.y.toFixed(2)} A${r},${r} 0 ${large} 1 ${e.x.toFixed(2)},${e.y.toFixed(2)}`
}

// Gear teeth with slightly rounded tips (curved flanks) as a closed path.
export function gearPath(cx, cy, rTip, rRoot, teeth, phase = 0) {
  const step = (Math.PI * 2) / teeth
  const topHalf = step * 0.2
  const botHalf = step * 0.34
  let d = ''
  for (let i = 0; i < teeth; i++) {
    const a = phase + i * step
    const rootL = polar(cx, cy, rRoot, a - botHalf)
    const tipL = polar(cx, cy, rTip, a - topHalf)
    const tipR = polar(cx, cy, rTip, a + topHalf)
    const rootR = polar(cx, cy, rRoot, a + botHalf)
    const mid = polar(cx, cy, rRoot, a + step / 2)
    if (i === 0) d += `M${rootL.x.toFixed(2)},${rootL.y.toFixed(2)}`
    else d += `L${rootL.x.toFixed(2)},${rootL.y.toFixed(2)}`
    d += `L${tipL.x.toFixed(2)},${tipL.y.toFixed(2)}`
    d += `L${tipR.x.toFixed(2)},${tipR.y.toFixed(2)}`
    d += `L${rootR.x.toFixed(2)},${rootR.y.toFixed(2)}`
    d += `L${mid.x.toFixed(2)},${mid.y.toFixed(2)}`
  }
  return d + 'Z'
}

// Watch-wheel teeth (cycloidal look): radial flanks up to the pitch circle,
// then a rounded ogival addendum, with rounded valleys. Meshes by `module`.
export function wheelTeethPath(cx, cy, module, teeth, phase = 0) {
  const rp = (module * teeth) / 2
  const ra = rp + module * 0.95
  const rd = rp - module * 1.35
  const p = (Math.PI * 2) / teeth
  const tp = p * 0.24 // half tooth thickness at the pitch line (radial flanks)
  const tt = p * 0.075 // half tip width
  let d = ''
  for (let i = 0; i < teeth; i++) {
    const a = phase + i * p
    d += i === 0 ? `M${P(cx, cy, rd, a - tp)}` : ''
    d +=
      `L${P(cx, cy, rp, a - tp)}` + // radial flank up to pitch
      `Q${P(cx, cy, ra, a - tp * 0.55)} ${P(cx, cy, ra, a - tt)}` + // ogival addendum
      `Q${P(cx, cy, ra + module * 0.06, a)} ${P(cx, cy, ra, a + tt)}` + // rounded crown
      `Q${P(cx, cy, ra, a + tp * 0.55)} ${P(cx, cy, rp, a + tp)}` + // addendum down
      `L${P(cx, cy, rd, a + tp)}` + // radial flank down
      `Q${P(cx, cy, rd, a + p / 2)} ${P(cx, cy, rd, a + p - tp)}` // rounded valley to next root
  }
  return d + 'Z'
}

// Pinion leaves: few, tall, with rounded (near-semicircular) tips.
export function pinionPath(cx, cy, module, leaves, phase = 0) {
  const rp = (module * leaves) / 2
  const ra = rp + module * 0.9
  const rd = Math.max(module * 0.5, rp - module * 1.5)
  const p = (Math.PI * 2) / leaves
  const tp = p * 0.3
  let d = ''
  for (let i = 0; i < leaves; i++) {
    const a = phase + i * p
    d += i === 0 ? `M${P(cx, cy, rd, a - tp)}` : ''
    d +=
      `L${P(cx, cy, rp, a - tp)}` +
      `Q${P(cx, cy, ra, a - tp * 0.85)} ${P(cx, cy, ra + module * 0.05, a)}` + // rounded leaf top
      `Q${P(cx, cy, ra, a + tp * 0.85)} ${P(cx, cy, rp, a + tp)}` +
      `L${P(cx, cy, rd, a + tp)}` +
      `Q${P(cx, cy, rd, a + p / 2)} ${P(cx, cy, rd, a + p - tp)}`
  }
  return d + 'Z'
}

// Escape-wheel teeth: proper "club" teeth — a curved heel rising to a
// flat impulse face, then a steep locking corner back to the root.
export function escapeWheelPath(cx, cy, rTip, rRoot, teeth, phase = 0) {
  const step = (Math.PI * 2) / teeth
  let d = ''
  for (let i = 0; i < teeth; i++) {
    const a = phase + i * step
    const seq = [
      P(cx, cy, rRoot, a - step * 0.5), // valley
      P(cx, cy, rRoot + (rTip - rRoot) * 0.35, a - step * 0.32), // heel
      P(cx, cy, rTip, a - step * 0.08), // up to tip
      P(cx, cy, rTip, a + step * 0.16), // flat impulse face
      P(cx, cy, rTip - (rTip - rRoot) * 0.15, a + step * 0.22), // locking corner
      P(cx, cy, rRoot, a + step * 0.26), // steep drop
    ]
    d += (i === 0 ? 'M' : 'L') + seq.join('L')
  }
  return d + 'Z'
}

// Archimedean spiral (mainspring / hairspring).
export function spiralPath(cx, cy, startR, endR, turns, ppt = 80) {
  const total = Math.max(2, Math.round(turns * ppt))
  let d = ''
  for (let i = 0; i <= total; i++) {
    const t = i / total
    const ang = t * turns * Math.PI * 2
    const r = startR + (endR - startR) * t
    d += (i === 0 ? 'M' : 'L') + P(cx, cy, r, ang)
  }
  return d
}

/* Shared gradients + filters. */
export function Defs() {
  return (
    <defs>
      <radialGradient id="gBrass" cx="0.34" cy="0.28" r="0.9">
        <stop offset="0%" stopColor="#f8e3ab" />
        <stop offset="28%" stopColor="#e3bc63" />
        <stop offset="55%" stopColor="#cd9c3f" />
        <stop offset="80%" stopColor="#a87c28" />
        <stop offset="100%" stopColor="#6e551d" />
      </radialGradient>
      <radialGradient id="gSteel" cx="0.34" cy="0.28" r="0.95">
        <stop offset="0%" stopColor="#f4f8fb" />
        <stop offset="32%" stopColor="#ccdae3" />
        <stop offset="65%" stopColor="#9db3c1" />
        <stop offset="100%" stopColor="#566d7b" />
      </radialGradient>
      <radialGradient id="gBlue" cx="0.34" cy="0.28" r="0.95">
        <stop offset="0%" stopColor="#8fb4e6" />
        <stop offset="45%" stopColor="#3f68a8" />
        <stop offset="100%" stopColor="#1b3055" />
      </radialGradient>
      <radialGradient id="gGold" cx="0.34" cy="0.28" r="0.95">
        <stop offset="0%" stopColor="#ffe9b0" />
        <stop offset="38%" stopColor="#eac26c" />
        <stop offset="68%" stopColor="#d0a244" />
        <stop offset="100%" stopColor="#8a6a24" />
      </radialGradient>
      <radialGradient id="gJewel" cx="0.34" cy="0.28" r="0.95">
        <stop offset="0%" stopColor="#ffb3b8" />
        <stop offset="45%" stopColor="#d05561" />
        <stop offset="100%" stopColor="#7c2530" />
      </radialGradient>
      <radialGradient id="gRuby" cx="0.34" cy="0.28" r="0.95">
        <stop offset="0%" stopColor="#f4a0a7" />
        <stop offset="50%" stopColor="#c04b57" />
        <stop offset="100%" stopColor="#7a2029" />
      </radialGradient>
      <linearGradient id="gPlate" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#31291f" />
        <stop offset="55%" stopColor="#241d16" />
        <stop offset="100%" stopColor="#191510" />
      </linearGradient>
      <radialGradient id="gDark" cx="0.4" cy="0.32" r="0.95">
        <stop offset="0%" stopColor="#2f2820" />
        <stop offset="100%" stopColor="#100d0b" />
      </radialGradient>
      <linearGradient id="gGeneva" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
        <stop offset="50%" stopColor="rgba(255,255,255,0.02)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0.14)" />
      </linearGradient>
      {/* diagonal light rake (soft-light): white lightens top-left, dark shades bottom-right */}
      <linearGradient id="gRake" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="46%" stopColor="#808080" />
        <stop offset="100%" stopColor="#0a0a0a" />
      </linearGradient>
      <radialGradient id="gGlow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#fff6e2" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#fff6e2" stopOpacity="0" />
      </radialGradient>
      <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="2.2" stdDeviation="2.6" floodColor="#000" floodOpacity="0.5" />
      </filter>
      <filter id="deepShadow" x="-60%" y="-60%" width="220%" height="220%">
        <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#000" floodOpacity="0.55" />
      </filter>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.012 0.9" numOctaves="2" seed="4" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.05 0" result="na" />
        <feComposite in="na" in2="SourceGraphic" operator="over" />
      </filter>
    </defs>
  )
}

const GRAD = { brass: 'url(#gBrass)', steel: 'url(#gSteel)', blue: 'url(#gBlue)', gold: 'url(#gGold)' }
const RIM = { brass: '#6e551d', steel: '#48606d', blue: '#1b3055', gold: '#8a6a24' }

/* Realistic watch wheel: meshing teeth (shared `module`), curved crossings,
   hub, specular glint + shade arc. `crossings`/`spokes` = arm count (0 = solid). */
export function Gear({
  cx,
  cy,
  r,
  teeth = 30,
  module,
  metal = 'brass',
  color,
  fill,
  spokes,
  crossings,
  hub = true,
  jewel = false,
  spin,
  spinRev,
}) {
  const M = module || r / (teeth / 2 + 0.95)
  const rp = (M * teeth) / 2
  const rTip = rp + M * 0.95
  const rRoot = rp - M * 1.35
  const depth = rTip - rRoot
  const rRim = rRoot - Math.max(2.2, rTip * 0.08)
  const hubR = Math.max(4.5, rTip * 0.2)
  const holeR = hubR * 0.5
  const arms = crossings ?? spokes ?? 4
  const face = fill || GRAD[metal] || 'rgba(255,255,255,0.05)'
  const stroke = color || RIM[metal] || '#6e551d'
  const cls = spin ? 'spin' : spinRev ? 'spin-rev' : undefined

  const ring = wheelTeethPath(cx, cy, M, Math.max(7, Math.round(teeth))) + ' ' + circlePath(cx, cy, rRim)

  const armEls = []
  if (arms > 0) {
    const wHub = 0.42
    const wRim = 0.12
    for (let i = 0; i < arms; i++) {
      const a = (i / arms) * Math.PI * 2 + Math.PI / arms
      // curved, tapered crossing (hub -> rim) with a slight waist
      const h1 = polar(cx, cy, hubR - 0.5, a - wHub)
      const h2 = polar(cx, cy, hubR - 0.5, a + wHub)
      const r1 = polar(cx, cy, rRim + 1, a - wRim)
      const r2 = polar(cx, cy, rRim + 1, a + wRim)
      const c1 = polar(cx, cy, (hubR + rRim) / 2, a - wRim * 2.4)
      const c2 = polar(cx, cy, (hubR + rRim) / 2, a + wRim * 2.4)
      armEls.push(
        <path
          key={i}
          d={`M${h1.x.toFixed(1)},${h1.y.toFixed(1)} Q${c1.x.toFixed(1)},${c1.y.toFixed(1)} ${r1.x.toFixed(1)},${r1.y.toFixed(1)} L${r2.x.toFixed(1)},${r2.y.toFixed(1)} Q${c2.x.toFixed(1)},${c2.y.toFixed(1)} ${h2.x.toFixed(1)},${h2.y.toFixed(1)} Z`}
          fill={face}
          stroke={stroke}
          strokeWidth="0.5"
        />
      )
    }
  }

  return (
    <g className={cls} style={{ transformBox: 'fill-box', transformOrigin: 'center' }} filter="url(#softShadow)">
      {arms === 0 ? (
        <circle cx={cx} cy={cy} r={rRoot} fill={face} stroke={stroke} strokeWidth="0.7" />
      ) : (
        <circle cx={cx} cy={cy} r={rRim + 1.5} fill="none" stroke={stroke} strokeWidth="0.7" opacity="0.55" />
      )}
      <path d={ring} fillRule="evenodd" fill={face} stroke={stroke} strokeWidth="0.7" />
      {armEls}
      {/* specular glint + shade arcs on the rim */}
      <path d={arcPath(cx, cy, rTip - depth * 0.5, Math.PI * 1.15, Math.PI * 1.75)} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={Math.max(1, r * 0.05)} strokeLinecap="round" />
      <path d={arcPath(cx, cy, rTip - depth * 0.5, Math.PI * 0.15, Math.PI * 0.6)} fill="none" stroke="rgba(0,0,0,0.28)" strokeWidth={Math.max(1, r * 0.05)} strokeLinecap="round" />
      {hub && <circle cx={cx} cy={cy} r={hubR} fill="url(#gDark)" stroke={stroke} strokeWidth="0.9" />}
      {jewel ? <Jewel cx={cx} cy={cy} r={holeR + 1.5} chaton /> : hub && <circle cx={cx} cy={cy} r={holeR} fill="#0e0c0a" />}
    </g>
  )
}

// A pinion (small polished-steel gear) with few, rounded leaves.
// Pass `module` to mesh with a wheel of the same module; else derived from r.
export function Pinion({ cx, cy, r, leaves = 8, module, phase = 0 }) {
  const M = module || r / (leaves / 2 + 0.9)
  return (
    <g filter="url(#softShadow)">
      <path d={pinionPath(cx, cy, M, leaves, phase)} fill="url(#gSteel)" stroke="#48606d" strokeWidth="0.6" />
      <circle cx={cx} cy={cy} r={(M * leaves) / 2 - M * 1.5 > 3 ? M * 1.1 : 2.4} fill="#0e0c0a" />
    </g>
  )
}

// Ruby jewel, optionally in a gold chaton with setting screws.
export function Jewel({ cx, cy, r = 4.5, chaton = false, screws = false }) {
  return (
    <g>
      {chaton && <circle cx={cx} cy={cy} r={r + 3} fill="url(#gGold)" stroke="#7d6220" strokeWidth="0.7" />}
      <circle cx={cx} cy={cy} r={r} fill="url(#gJewel)" />
      <circle cx={cx} cy={cy} r={r * 0.36} fill="#2a0d10" />
      <circle cx={cx - r * 0.3} cy={cy - r * 0.3} r={r * 0.22} fill="rgba(255,255,255,0.5)" />
      {chaton && screws &&
        [0, 1, 2].map((i) => {
          const a = (i / 3) * Math.PI * 2 - Math.PI / 2
          const p = polar(cx, cy, r + 3, a)
          return <Screw key={i} cx={p.x} cy={p.y} r={1.8} />
        })}
    </g>
  )
}

// Blued-steel slotted screw.
export function Screw({ cx, cy, r = 5, angle = 40 }) {
  return (
    <g filter="url(#softShadow)">
      <circle cx={cx} cy={cy} r={r} fill="url(#gBlue)" stroke="#16233d" strokeWidth="0.7" />
      <rect
        x={cx - r}
        y={cy - r * 0.15}
        width={r * 2}
        height={r * 0.3}
        rx={r * 0.1}
        fill="#101c33"
        transform={`rotate(${angle} ${cx} ${cy})`}
      />
      <circle cx={cx - r * 0.32} cy={cy - r * 0.32} r={r * 0.22} fill="rgba(255,255,255,0.55)" />
    </g>
  )
}

// Perlage (circular graining) — a field of faint overlapping swirls,
// clipped to a circle. Memoised so it renders once (never on re-select).
export const Perlage = memo(function Perlage({ cx, cy, r, spacing = 15, rr = 9, opacity = 1 }) {
  const raw = useId()
  const id = 'pl' + raw.replace(/[:]/g, '')
  const R = r - 3
  const dots = []
  const vstep = spacing * 0.86
  for (let row = 0; ; row++) {
    const y = cy - R + row * vstep
    if (y > cy + R) break
    const off = row % 2 ? spacing / 2 : 0
    for (let x = cx - R + off; x <= cx + R; x += spacing) {
      const dx = x - cx
      const dy = y - cy
      if (dx * dx + dy * dy > R * R) continue
      dots.push([x.toFixed(1), y.toFixed(1)])
    }
  }
  return (
    <g style={{ pointerEvents: 'none' }} opacity={opacity}>
      <clipPath id={id}>
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        {dots.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={rr} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7" />
            <path d={arcPath(+x, +y, rr, Math.PI * 1.15, Math.PI * 1.6)} fill="none" stroke="rgba(255,248,232,0.14)" strokeWidth="0.7" />
          </g>
        ))}
      </g>
    </g>
  )
})

// Global light rake + soft top-left glow. Drop in last (pointer-events none).
export function Lighting({ w = 720, h = 470, strength = 0.5 }) {
  return (
    <g style={{ pointerEvents: 'none' }}>
      <rect x="0" y="0" width={w} height={h} fill="url(#gRake)" opacity={strength} style={{ mixBlendMode: 'soft-light' }} />
      <ellipse cx={w * 0.33} cy={h * 0.22} rx={w * 0.5} ry={h * 0.42} fill="url(#gGlow)" opacity="0.28" style={{ mixBlendMode: 'screen' }} />
    </g>
  )
}

// A finished bridge: base plate + Geneva stripes + polished bevel edge.
export function Bridge({ d, stripes = true, angle = 24, color = '#6a5c46', center = [360, 235] }) {
  const raw = useId()
  const id = 'br' + raw.replace(/[:]/g, '')
  return (
    <g filter="url(#deepShadow)">
      <path d={d} fill="url(#gPlate)" stroke={color} strokeWidth="1.4" />
      {stripes && (
        <>
          <clipPath id={id}>
            <path d={d} />
          </clipPath>
          <g clipPath={`url(#${id})`}>
            <g transform={`rotate(${angle} ${center[0]} ${center[1]})`}>
              {Array.from({ length: 80 }).map((_, i) => (
                <rect key={i} x="-260" y={-260 + i * 11} width="1000" height="6" fill="url(#gGeneva)" />
              ))}
            </g>
          </g>
        </>
      )}
      {/* polished anglage: bright inner + dark outer edge */}
      <path d={d} fill="none" stroke="rgba(255,240,210,0.22)" strokeWidth="0.9" />
    </g>
  )
}
