// Strap geometry, in millimetres. Pure functions — no React.
//
// Piece coordinates: x runs along the strap (0 = the lug fold / spring-bar
// centre, increasing toward the tip or buckle), y runs across it (0 = the
// centreline, +y downward). A transform T = { x, y, s } maps mm → px:
//   px = T.x + x * T.s,  py = T.y + y * T.s

export const px = (T, x, y) => [T.x + x * T.s, T.y + y * T.s]
export const pathOf = (pts, T, close = true) =>
  pts
    .map(([x, y], i) => {
      const [a, b] = T ? px(T, x, y) : [x, y]
      return `${i ? 'L' : 'M'}${a.toFixed(2)} ${b.toFixed(2)}`
    })
    .join(' ') + (close ? ' Z' : '')

// Width of a tapered piece at x: full w0 until taper[0], linear to w1 at taper[1].
export function widthAt(x, o) {
  const [a, b] = o.taper || [0, o.x1]
  if (x <= a) return o.w0
  if (x >= b) return o.w1
  return o.w0 + ((x - a) / (b - a)) * (o.w1 - o.w0)
}

const cubic = (p0, p1, p2, p3, t) => {
  const u = 1 - t
  return [
    u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0],
    u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1],
  ]
}

// Upper half of a tip, from (x1 - tipLen, -h) to the apex on the centreline.
function tipHalf(o) {
  const tip = o.tip || 'square'
  const end = o.x1
  const L = o.tipLen ?? (tip === 'square' ? 0 : o.w1 * 0.75)
  const h = widthAt(end - L, o) / 2
  const n = 22
  const pts = []
  const s0 = [end - L, -h]
  if (tip === 'square') return [[end, -h]]
  if (tip === 'round' || tip === 'ellipse') {
    for (let i = 0; i <= n; i++) {
      const a = (-Math.PI / 2) * (1 - i / n)
      pts.push([end - L + L * Math.cos(a), h * Math.sin(a)])
    }
    return pts
  }
  if (tip === 'ogive') {
    for (let i = 0; i <= n; i++) pts.push(cubic(s0, [end - L * 0.42, -h], [end - L * 0.06, -h * 0.42], [end, 0], i / n))
    return pts
  }
  if (tip === 'trapezoid') return [s0, [end, -h * 0.42], [end, 0]]
  if (tip === 'point') return [s0, [end, 0]]
  return [[end, -h]]
}

// Closed outline of a piece. o = { x0, x1, w0, w1, taper:[a,b], tip, tipLen }
// x0 < 0 when an unfolded lug flap is included.
export function outline(o) {
  const half = tipHalf(o)
  const top = []
  const steps = 24
  const tipStart = half[0][0]
  for (let i = 0; i <= steps; i++) {
    const x = o.x0 + ((tipStart - o.x0) * i) / steps
    top.push([x, -widthAt(x, o) / 2])
  }
  const upper = [...top, ...half.slice(1)]
  const apexOnLine = Math.abs(upper[upper.length - 1][1]) < 1e-6
  const lower = upper
    .slice(0, apexOnLine ? -1 : undefined)
    .reverse()
    .map(([x, y]) => [x, -y])
  return [...upper, ...lower]
}

// Polygon offset by d (positive = inward) using vertex normals. Good for the
// gentle convex shapes of strap outlines.
export function offset(pts, d) {
  const n = pts.length
  // signed area → orientation
  let area = 0
  for (let i = 0; i < n; i++) {
    const [x1, y1] = pts[i]
    const [x2, y2] = pts[(i + 1) % n]
    area += x1 * y2 - x2 * y1
  }
  const sgn = area > 0 ? 1 : -1
  return pts.map((p, i) => {
    const a = pts[(i - 1 + n) % n]
    const b = pts[(i + 1) % n]
    const e1 = norm([p[0] - a[0], p[1] - a[1]])
    const e2 = norm([b[0] - p[0], b[1] - p[1]])
    // inward normals (for the polygon's orientation)
    const n1 = [-e1[1] * sgn, e1[0] * sgn]
    const n2 = [-e2[1] * sgn, e2[0] * sgn]
    let m = norm([n1[0] + n2[0], n1[1] + n2[1]])
    const cos = m[0] * n1[0] + m[1] * n1[1]
    const k = d / Math.max(cos, 0.35)
    return [p[0] + m[0] * k, p[1] + m[1] * k]
  })
}
const norm = ([x, y]) => {
  const l = Math.hypot(x, y) || 1
  return [x / l, y / l]
}

// The open run of a closed polygon between x >= from (and <= to, if given),
// taken in polygon order. Used to turn an offset outline into a stitch line
// that stops short of the folds.
export function runBetween(pts, from, to = Infinity) {
  const inside = (p) => p[0] >= from && p[0] <= to
  const n = pts.length
  // rotate so we start just after an outside point
  let start = pts.findIndex((p, i) => !inside(pts[(i - 1 + n) % n]) && inside(p))
  // no boundary crossing: the whole outline is inside (one closed run) or none of it is
  if (start < 0) return inside(pts[0]) ? [pts.slice()] : []
  const runs = []
  let cur = []
  for (let k = 0; k < n; k++) {
    const i = (start + k) % n
    const p = pts[i]
    const prev = pts[(i - 1 + n) % n]
    if (inside(p)) {
      if (!cur.length && !inside(prev)) cur.push(cross(prev, p, from, to))
      cur.push(p)
    } else if (cur.length) {
      cur.push(cross(cur[cur.length - 1], p, from, to))
      runs.push(cur)
      cur = []
    }
  }
  if (cur.length) runs.push(cur)
  return runs
}
function cross(a, b, from, to) {
  const xb = b[0] < from || a[0] < from ? from : to
  const t = (xb - a[0]) / (b[0] - a[0] || 1e-9)
  return [xb, a[1] + (b[1] - a[1]) * Math.max(0, Math.min(1, t))]
}

// Points every `pitch` mm along an open polyline (arc length), plus tangent.
export function resample(run, pitch, startPad = 0) {
  const seg = []
  let total = 0
  for (let i = 1; i < run.length; i++) {
    const l = Math.hypot(run[i][0] - run[i - 1][0], run[i][1] - run[i - 1][1])
    seg.push(l)
    total += l
  }
  const count = Math.max(1, Math.floor((total - 2 * startPad) / pitch))
  const step = (total - 2 * startPad) / count // spread error evenly
  const out = []
  for (let k = 0; k <= count; k++) {
    let d = startPad + k * step
    let i = 0
    while (i < seg.length - 1 && d > seg[i]) {
      d -= seg[i]
      i++
    }
    const a = run[i]
    const b = run[i + 1] || a
    const t = seg[i] ? Math.min(1, d / seg[i]) : 0
    const tan = norm([b[0] - a[0], b[1] - a[1]])
    out.push({ p: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], tan })
  }
  return out
}

// Adjustment-hole x positions, counted back from the tip.
export function holeXs(x1, { n = 7, pitch = 7, fromTip = 25 } = {}) {
  return Array.from({ length: n }, (_, i) => x1 - fromTip - i * pitch)
}

// Standard pieces (Decocuir-style 20 mm → 18 mm, 120 / 80, house defaults).
export const LONG = (x = {}) => ({
  x0: 0, x1: 120, w0: 20, w1: 18, taper: [8, 100], tip: 'ogive', tipLen: 14, ...x,
})
export const SHORT = (x = {}) => ({
  x0: 0, x1: 80, w0: 20, w1: 18, taper: [8, 80], tip: 'square', ...x,
})
