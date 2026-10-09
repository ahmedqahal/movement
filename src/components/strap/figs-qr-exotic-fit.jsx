// Strap diagrams — quick-release variants, exotic leathers, and fit / wear /
// care & faults. See AUTHORING.md.
import { useId } from 'react'
import { C, Fig, T, Note, Lead, Dim, Arrow, Num, Verdict, Tag, Sep } from './kit.jsx'
import { StrapPlan, Ply, BarEnd, GlueLine, XSec, CaseSide, Wrist } from './parts.jsx'
import { StrapSection } from './sections.jsx'
import { LONG, px, widthAt } from './geom.js'
import { Knife, Rule, Awl, NotchPlier, Applicator, BarTool, Dauber, Bottle, Slab } from './tools.jsx'

/* ------------------------------------------------------------------ */
/* Local helpers                                                        */
/* ------------------------------------------------------------------ */
const uid = () => useId().replace(/[^a-zA-Z0-9]/g, '')
const rnd = (i) => {
  const v = Math.sin(i * 127.1 + 311.7) * 43758.5453
  return v - Math.floor(v)
}
const pts = (a) => a.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
const LEDGE = '#4a3018' // top-leather section edge
const STEEL_EDGE = '#3b4850'

// Break mark across a piece that continues.
const Brk = ({ x, y, h }) => (
  <path d={`M${x - 3} ${y - 3} l6 ${(h + 6) * 0.3} l-6 ${(h + 6) * 0.4} l6 ${(h + 6) * 0.3}`} fill="none" stroke={C.dim} strokeWidth="1" />
)

// Magnified callout: a ring round the spot `at` (radius r0), a connector, and
// a circular window at `c` (radius R) whose contents the caller draws in
// absolute coordinates as children.
function Inset({ at, r0 = 9, c, R, children, label, la = 'middle', lx, ly }) {
  const id = uid()
  const dx = c[0] - at[0]
  const dy = c[1] - at[1]
  const L = Math.hypot(dx, dy) || 1
  const ux = dx / L
  const uy = dy / L
  return (
    <g>
      <circle cx={at[0]} cy={at[1]} r={r0} fill="none" stroke={C.brass} strokeWidth="1" strokeDasharray="3 2" />
      <line x1={at[0] + ux * r0} y1={at[1] + uy * r0} x2={c[0] - ux * R} y2={c[1] - uy * R} stroke={C.brass} strokeWidth="0.8" strokeDasharray="3 2" />
      <clipPath id={`in${id}`}>
        <circle cx={c[0]} cy={c[1]} r={R} />
      </clipPath>
      <circle cx={c[0]} cy={c[1]} r={R} fill="#120f0c" />
      <g clipPath={`url(#in${id})`}>{children}</g>
      <circle cx={c[0]} cy={c[1]} r={R} fill="none" stroke={C.brass} strokeWidth="1.2" />
      {label && (
        <T x={lx ?? c[0]} y={ly ?? c[1] + R + 13} a={la} s={10} c={C.brass}>
          {label}
        </T>
      )}
    </g>
  )
}

/* ---- quick-release hardware ---- */
// QR spring bar, side view, drawn along +x from (x, y) on the tube axis:
// tube length L px, radius r px. The knob (lever) stands off the tube at kx
// (px from the start) on side kdir (1 = local +y); `retract` pulls the far
// pin in (px). ghost = seen through leather.
function QRBar({ x = 0, y = 0, ang = 0, L, r, kx, kdir = 1, retract = 0, ghost, knob = true, slot = true, op }) {
  const pl = r * 1.25
  const pr = r * 0.5
  const kw = r * 0.85
  const kh = r * 1.5
  const st = ghost ? { strokeDasharray: '3 2', fillOpacity: 0.3 } : {}
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang})`} opacity={op}>
      <rect x={-pl} y={-pr} width={pl + 2} height={pr * 2} rx={pr * 0.7} fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.6" {...st} />
      <rect x={L - 2} y={-pr} width={Math.max(2, pl + 2 - retract)} height={pr * 2} rx={pr * 0.7} fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.6" {...st} />
      <rect x={0} y={-r} width={L} height={r * 2} rx={r * 0.5} fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.7" {...st} />
      {!ghost &&
        [r * 0.9, L - r * 0.9].map((v) => <line key={v} x1={v} y1={-r} x2={v} y2={r} stroke={STEEL_EDGE} strokeWidth="0.8" />)}
      {slot && !ghost && <rect x={kx - r * 2.4} y={-r * 0.22} width={r * 2.4 + kw / 2} height={r * 0.44} rx={r * 0.22} fill="#2d3940" />}
      {knob && (
        <rect
          x={kx - kw / 2}
          y={kdir > 0 ? 0 : -(r + kh)}
          width={kw}
          height={r + kh}
          rx={kw / 2}
          fill="url(#sk-steelH)"
          stroke={STEEL_EDGE}
          strokeWidth="0.7"
          {...st}
        />
      )}
    </g>
  )
}

// QR bar end-on in section, knob standing off downward (kdir 1) by kh px.
function QREnd({ cx, cy, r, kh, kdir = 1 }) {
  const kw = r * 0.95
  return (
    <g>
      <rect x={cx - kw / 2} y={kdir > 0 ? cy : cy - r - kh} width={kw} height={r + kh} rx={kw / 2} fill="url(#sk-steelH)" stroke={STEEL_EDGE} strokeWidth="0.7" />
      <BarEnd cx={cx} cy={cy} r={r} />
    </g>
  )
}

// Lug loop in longitudinal section: the top ply round a channel of radius r
// at (cx, cy), body to xR, lining under the body. tb = thickness of the
// loop's underside (back layer) — thinner than t where it has been skived.
// notch = width (px) of a notch through the back layer under the bar.
function QRLoop({ cx, cy, r, t, tb = t, xR, tl, notch = 0, seal, raw, open }) {
  const y1 = cy - r
  const cv = r * 2.6
  const tail = r * 3.6
  const ts = t * 0.45
  const B = cy + r + tb
  const R = (2 * r + t + tb) / 2
  const outer =
    `M${cx} ${y1 - t} A${R} ${R} 0 0 0 ${cx} ${B} ` +
    `C${cx + cv * 0.55} ${B} ${cx + cv * 0.62} ${y1 + ts} ${cx + cv} ${y1 + ts} L${cx + cv + tail} ${y1}`
  const hole = `M${cx} ${y1} A${r} ${r} 0 0 0 ${cx} ${cy + r} C${cx + cv * 0.55} ${cy + r} ${cx + cv * 0.62} ${y1} ${cx + cv} ${y1} Z`
  const n2 = notch / 2
  return (
    <g>
      <path d={`${outer} L${cx} ${y1} Z ${hole}`} fill="url(#sk-topS)" fillRule="evenodd" />
      <path d={outer} fill="none" stroke={LEDGE} strokeWidth="0.8" strokeLinejoin="round" />
      <path d={hole} fill="none" stroke={LEDGE} strokeWidth="0.8" />
      <Ply x1={cx} x2={xR} y={y1 - t} t={t} open={open ? 'lr' : 'l'} />
      {tl ? <Ply x1={cx + cv + 2} x2={xR} y={y1 + 2} t={tl} k="lining" skL={[r * 2.4, tl * 0.25]} cut="top" open={open ? 'r' : ''} /> : null}
      {notch > 0 && <rect x={cx - n2} y={cy + r - 0.8} width={notch} height={tb + 1.6} fill={C.ground} />}
      {notch > 0 && seal && (
        <g stroke={C.paint} strokeWidth="2.4" strokeLinecap="round">
          <line x1={cx - n2 + 0.6} y1={cy + r + 0.4} x2={cx - n2 + 0.6} y2={B - 0.4} />
          <line x1={cx + n2 - 0.6} y1={cy + r + 0.4} x2={cx + n2 - 0.6} y2={B - 0.4} />
        </g>
      )}
      {notch > 0 && raw && (
        <g stroke="#e9cf9f" strokeWidth="0.8" fill="none">
          {[-1, 1].map((sd) => (
            <path
              key={sd}
              d={Array.from({ length: Math.ceil(tb / 2) + 1 }, (_, j) => `${j ? 'L' : 'M'}${cx + sd * (n2 - (j % 2 ? 1.4 : 0))} ${cy + r + Math.min(tb, j * 2)}`).join(' ')}
            />
          ))}
        </g>
      )}
    </g>
  )
}

// Underside (lining-side) plan of the lug end, bar centre at x = 0, the fold
// edge 2.2 mm beyond it. Continues (break) at x = len.
function LugEndPlan({ T, len = 34, w = 20, children, zones, stitch, face = 'lining' }) {
  const o = { x0: -2.2, x1: len, w0: w, w1: w, taper: [0, len], tip: 'square' }
  const [bx, by] = px(T, len, -w / 2)
  return (
    <g>
      <StrapPlan T={T} o={o} face={face} zones={zones} stitch={stitch} />
      <Brk x={bx} y={by} h={w * T.s} />
      {children}
    </g>
  )
}

/* ================================================================== */
/* Quick-release variants                                               */
/* ================================================================== */

/* 1 · Size the channel for a 1.5 or 1.8 mm QR bar */
function QrChannel() {
  const s = 12
  const bx = 44
  const by = 92
  const br = 0.9 * s
  const L = 20 * s
  const pl = br * 1.25
  const kx = L - 4 * s
  const loop = (cx, d, name) => {
    const rb = (d / 2) * s
    const r = rb + 0.15 * s
    const t = 1.0 * s
    const cy = 262
    const B = cy + r + t
    const xR = cx + 140
    return (
      <g>
        <QRLoop cx={cx} cy={cy} r={r} t={t} xR={xR} tl={0.6 * s} />
        <BarEnd cx={cx} cy={cy} r={rb} />
        <line x1={cx - rb} y1={cy + 3} x2={cx - rb} y2={B + 14} stroke={C.dim} strokeWidth="0.5" opacity="0.6" />
        <line x1={cx + rb} y1={cy + 3} x2={cx + rb} y2={B + 14} stroke={C.dim} strokeWidth="0.5" opacity="0.6" />
        <Dim a={[cx - rb, B + 10]} b={[cx + rb, B + 10]} />
        <T x={cx + rb + 6} y={B + 14} s={10.5} mono c={C.text}>
          bar Ø {d}
        </T>
        <T x={cx + 40} y={cy - r - t - 12} s={11.5} c={C.text} w="600">
          {name}
        </T>
        <Dim a={[xR, cy - r - t]} b={[xR, cy - r]} off={-6} />
        <T x={xR + 12} y={cy - r - t / 2 + 4} s={10} mono>
          top 1.0
        </T>
        <Lead p={[cx + r + 1, cy + 4]} t={[cx + 80, cy + 22]} text="channel: a sliding fit" s={10.5} />
      </g>
    )
  }
  return (
    <Fig h={320} view="Detail · QR bar and the loop it needs" scale="true scale ×12">
      <Tag x={14} y={40}>QR spring bar · side view</Tag>
      <QRBar x={bx} y={by} L={L} r={br} kx={kx} />
      <Dim a={[bx, by - br]} b={[bx + L, by - br]} off={-12} text="tube = lug width (20)" flip />
      <Dim a={[bx + L, by - br]} b={[bx + L, by + br]} off={-26} />
      <T x={bx + L + pl + 20} y={by - 2} s={10.5} mono c={C.text}>
        Ø 1.5 or 1.8
      </T>
      <T x={bx + L + pl + 20} y={by + 11} s={10} c={C.faint}>
        tube diameter
      </T>
      <Lead p={[bx - pl * 0.6, by + 3]} t={[bx - pl * 0.6, 130]} text="plain end" a="middle" sub="fixed pin" />
      <Lead p={[bx + kx - br * 1.6, by]} t={[bx + 116, 130]} text="slot" a="middle" sub="the knob's travel" />
      <Lead p={[bx + kx, by + br + 1.5 * br - 2]} t={[bx + kx, 152]} text="knob (lever)" a="middle" sub="stands proud of the tube" />
      <Lead p={[bx + L + pl * 0.6, by + 3]} t={[bx + L + 40, 130]} text="retracting pin" sub="the knob pulls it in" />
      <Sep x1={14} y1={184} x2={466} y2={184} />
      <Tag x={14} y={204}>Lug loop · section through the bar</Tag>
      {loop(52, 1.5, '1.5 mm bar')}
      {loop(274, 1.8, '1.8 mm bar')}
      <Note
        x={466}
        y={40}
        a="end"
        s={10.5}
        lh={14}
        lines={['Form the channel on a rod', 'a touch over the bar Ø —', 'the bar must slide, not jam.']}
      />
    </Fig>
  )
}

/* 2 · Plan the fold seam clear of the notch */
function QrSeam() {
  const s = 8
  const cx = 70
  const cy = 92
  const rb = 0.9 * s
  const r = rb + 0.15 * s
  const t = 1.1 * s
  const tl = 0.6 * s
  const y1 = cy - r
  const first = cx + 6.5 * s
  const TP = { x: 72, y: 252, s: 4 }
  const TX = { x: 312, y: 252, s: 4 }
  const notchRect = (T) => (
    <rect x={px(T, -0.5, -8)[0]} y={px(T, -0.5, -8)[1]} width={4} height={20} rx={2} fill={C.ground} stroke={C.ruby} strokeWidth="1" strokeDasharray="2 1.5" />
  )
  return (
    <Fig h={340} view="Section + underside plan · lug end" scale="section ×8 · plan ×4">
      <Tag x={14} y={40}>Section · long piece at the lug</Tag>
      <QRLoop cx={cx} cy={cy} r={r} t={t} xR={462} tl={tl} open />
      <Brk x={462} y={y1 - t} h={t + tl + 3} />
      <BarEnd cx={cx} cy={cy} r={rb} />
      <rect x={cx - 0.5 * s} y={cy + r - 1.5} width={s} height={t + 3} fill="rgba(194,88,99,0.3)" stroke={C.ruby} strokeWidth="0.9" strokeDasharray="2 2" />
      <SectionStitchLite x1={first} x2={456} y1={y1 - t} y2={y1 + 2 + tl} p={3 * s} />
      <Dim a={[cx, y1 - t]} b={[first, y1 - t]} off={-14} text="clear" flip />
      <Lead p={[cx, cy + r + t + 2]} t={[cx + 40, 140]} text="notch site under the knob" c={C.ruby} sub="≈ 1 × 5 mm, cut in step 4" />
      <Lead p={[first + 3 * s, y1 - t - 1]} t={[first + 60, 48]} text="first stitch of the seam" sub="through top, turned tail and lining" />
      <Lead p={[cx, cy]} t={[cx - 40, 140]} text="bar" a="middle" s={10.5} c={C.steel} />
      <T x={300} y={144} s={10} c={C.faint}>
        stitch or rivet: both stay clear
      </T>
      <Sep x1={14} y1={162} x2={466} y2={162} />

      <Tag x={14} y={182}>Underside · planned</Tag>
      <Verdict x={226} y={178} ok />
      <LugEndPlan T={TP} len={40} zones={[{ from: -2.2, to: 3.5, k: 'ruby' }]} stitch={{ m: 3, p: 3, from: 6.5, to: 37, mode: 'holes' }}>
        {notchRect(TP)}
        <line x1={TP.x} y1={TP.y - 46} x2={TP.x} y2={TP.y + 46} stroke={C.steel} strokeWidth="0.8" strokeDasharray="6 2 2 2" />
      </LugEndPlan>
      <Tag x={262} y={182}>Seam tight to the bar</Tag>
      <Verdict x={452} y={178} ok={false} />
      <LugEndPlan T={TX} len={36} zones={[{ from: -2.2, to: 3.5, k: 'ruby' }]} stitch={{ m: 3, p: 3, from: 1.8, to: 33, mode: 'holes' }}>
        {notchRect(TX)}
        {[-4.5, -1.5, 1.5, 4.5].map((yy) => {
          const [hx, hy] = px(TX, 1.8, yy)
          return <line key={yy} x1={hx - 2} y1={hy - 2} x2={hx + 2} y2={hy + 2} stroke={C.hole} strokeWidth="1.3" strokeLinecap="round" />
        })}
        <circle cx={px(TX, 1, -5.5)[0]} cy={px(TX, 1, -5.5)[1]} r={9} fill="none" stroke={C.ruby} strokeWidth="1.4" />
      </LugEndPlan>
      <Lead p={[TP.x + 2, TP.y - 32]} t={[TP.x + 26, 200]} text="notch 1 × 5, across the strap" c={C.ruby} s={10.5} />
      <Lead p={[TP.x + 4, TP.y + 36]} t={[24, 308]} text="no stitch, no rivet here" c={C.ruby} sub="bar centre ±3.5 mm (house)" a="start" />
      <Lead p={[px(TP, 7, 7)[0], px(TP, 7, 7)[1]]} t={[170, 308]} text="seam starts clear" sub="first hole ~6.5 mm (house)" />
      <Lead p={[px(TX, 1, -5.5)[0] + 6, px(TX, 1, -5.5)[1] + 7]} t={[330, 308]} text="seam inside the notch zone" c={C.ruby} sub="the cut or its skive reaches it" a="start" />
    </Fig>
  )
}

// Section stitch with the stitch passes only (no surface runs) — reads
// cleanly over a loop drawing.
function SectionStitchLite({ x1, x2, y1, y2, p }) {
  const n = Math.max(1, Math.floor((x2 - x1) / p))
  return (
    <g stroke={C.thread} strokeLinecap="round">
      {Array.from({ length: n + 1 }, (_, i) => {
        const x = x1 + i * p
        return (
          <g key={i}>
            <line x1={x} y1={y1 - 1.5} x2={x} y2={y2 + 1.5} strokeWidth="1.4" />
            {i < n && <line x1={x} y1={y1 - 1.5} x2={x + p} y2={y1 - 1.5} strokeWidth="1.8" opacity="0.55" />}
            {i < n && <line x1={x} y1={y2 + 1.5} x2={x + p} y2={y2 + 1.5} strokeWidth="1.8" opacity="0.55" />}
          </g>
        )
      })}
    </g>
  )
}

/* 3 · Locate the knob */
function QrLocate() {
  const s = 6
  const TP = { x: 170, y: 144, s }
  const top = TP.y - 10 * s
  const bot = TP.y + 10 * s
  const L = 20 * s
  const br = 0.9 * s
  const kmm = 4 // knob, mm from its end of the bar
  const ky = bot - kmm * s
  return (
    <Fig h={320} view="Underside · bar seated in the loop" scale="true scale ×6 · inset ×12">
      <Tag x={22} y={44}>QR bar</Tag>
      <QRBar x={60} y={top} ang={90} L={L} r={br} kx={L - kmm * s} kdir={-1} />
      <Dim a={[60, bot]} b={[60, ky]} off={-22} text="a" />
      <line x1={60 + br + 8} y1={ky} x2={TP.x} y2={ky} stroke={C.brass} strokeWidth="0.9" strokeDasharray="4 3" />
      <T x={116} y={ky - 5} a="middle" s={10} c={C.brass}>
        transfer
      </T>
      <Lead p={[60, top + 40]} t={[24, 238]} text="measure the bar:" a="start" sub="a = end → knob" />

      <Tag x={TP.x - 14} y={44}>Strap · lining side up</Tag>
      <LugEndPlan T={TP} len={26} />
      <QRBar x={TP.x} y={top} ang={90} L={L} r={br} kx={L - kmm * s} ghost knob={false} />
      <circle cx={TP.x} cy={ky} r={5.5} fill="rgba(208,168,79,0.18)" stroke={C.brass} strokeWidth="0.8" strokeDasharray="2 1.5" />
      <path d={`M${TP.x - 7} ${ky} h14 M${TP.x} ${ky - 7} v14`} stroke={C.ruby} strokeWidth="1.3" />
      <Awl kind="scratch" x={TP.x + 1} y={ky - 1} ang={-32} />
      <Dim a={[TP.x - 2.2 * s, bot]} b={[TP.x - 2.2 * s, ky]} off={-10} text="a" />

      <Lead p={[TP.x + 1, top + 24]} t={[190, 60]} text="bar in the channel, seen through" sub="ends flush with both edges" />
      <Lead p={[TP.x + 6, ky + 3]} t={[196, 236]} text="mark the knob's centre" sub="on the bar line, scratch awl or silver pen" />

      <Inset at={[TP.x, ky]} r0={9} c={[406, 140]} R={56} label="section at the knob" ly={212}>
        {(() => {
          const cx = 398
          const cy = 124
          const k = 12
          const rr = 0.9 * k + 1
          const t = 1.0 * k
          const B = cy + rr + t
          return (
            <g>
              <QRLoop cx={cx} cy={cy} r={rr} t={t} xR={cx + 90} tl={0.6 * k} />
              <path d={`M${cx - 10} ${B - 0.5} Q${cx} ${B + 10} ${cx + 10} ${B - 0.5}`} fill="url(#sk-topS)" stroke={LEDGE} strokeWidth="0.8" />
              <g opacity="0.55">
                <QREnd cx={cx} cy={cy} r={0.9 * k} kh={1.0 * k} />
              </g>
              <rect x={cx - 0.45 * k} y={cy + 0.9 * k} width={0.9 * k} height={1.0 * k} fill="none" stroke={C.steel} strokeWidth="0.8" strokeDasharray="2 1.5" />
              <path d={`M${cx - 7} ${B + 14} h14`} stroke={C.ruby} strokeWidth="1.6" />
              <T x={cx + 14} y={B + 8} s={10} c={C.text}>
                bump
              </T>
            </g>
          )
        })()}
      </Inset>
      <T x={406} y={226} a="middle" s={10} c={C.faint}>
        the knob presses the back layer
      </T>
      <Note
        x={196}
        y={274}
        s={10.5}
        lh={14}
        head="Before final edge finishing"
        hc={C.text}
        lines={['Insert the bar ends flush, feel for the bump, mark it —', 'then check “a” against the bar so it is not a guess.']}
      />
    </Fig>
  )
}

/* 4 · Cut the notch — back layer only */
function QrNotch() {
  const TP = { x: 60, y: 130, s: 5.2 }
  const nx = TP.x
  const ny0 = px(TP, 0, -8)[1]
  // section
  const k = 12
  const cx = 290
  const cy = 98
  const r = 0.9 * k + 1.5
  const t = 1.0 * k
  const tb = 0.55 * k
  return (
    <Fig h={340} view="Plan + section · cutting the notch" scale="plan ×5.2 · section ×12">
      <Tag x={14} y={40}>Underside · cutting</Tag>
      <LugEndPlan T={TP} len={26} />
      <rect x={nx - 2.6} y={ny0} width={5.2} height={26} rx={2.6} fill={C.ground} />
      <NotchPlier x={nx} y={ny0 + 11} ang={90} k={0.85} />
      <Lead p={[nx + 6, ny0 + 8]} t={[132, 54]} text="notch plier at the mark" sub="Bergeon 31227 or similar" />
      <Lead p={[nx - 11, ny0 + 11]} t={[22, 214]} text="counter screw" sub="locked" a="start" />

      <Tag x={238} y={40}>Section · bar removed</Tag>
      <QRLoop cx={cx} cy={cy} r={r} t={t} tb={tb} xR={462} tl={0.6 * k} notch={1.0 * k} open />
      <Brk x={462} y={cy - r - t} h={t + 0.6 * k + 3} />
      <circle cx={cx} cy={cy} r={0.9 * k} fill="none" stroke={C.steel} strokeWidth="0.8" strokeDasharray="3 2" />
      <Dim a={[cx - 0.5 * k, cy + r + tb + 4]} b={[cx + 0.5 * k, cy + r + tb + 4]} off={10} />
      <T x={cx + 10} y={cy + r + tb + 18} s={10.5} mono c={C.text}>
        1
      </T>
      <Lead p={[cx + 2, cy - r - t + 3]} t={[330, 54]} text="top face — never cut" c={C.emerald} s={10.5} />
      <Lead p={[cx - 0.5 * k - 1, cy + r + tb / 2]} t={[300, 196]} text="through the back layer only" a="middle" />
      <Lead p={[cx + r * 1.2, cy + r + tb * 0.5]} t={[350, 160]} text="back layer skived thin" sub="the knob reaches through" />
      <Lead p={[cx + 0.4 * k, cy - 0.4 * k]} t={[376, 120]} text="bar out first" s={10.5} c={C.steel} />

      <Sep x1={226} y1={222} x2={466} y2={222} />
      <Tag x={238} y={242}>The notch · plan</Tag>
      {(() => {
        const z = 12
        const x0 = 262
        const y0 = 278
        return (
          <g>
            <rect x={x0 - 10} y={y0 - 9} width={5 * z + 20} height={z + 18} rx={3} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="0.6" />
            <rect x={x0} y={y0} width={5 * z} height={1 * z} rx={z / 2} fill={C.ground} stroke={C.paint} strokeWidth="0.8" />
            <Dim a={[x0, y0 + z]} b={[x0 + 5 * z, y0 + z]} off={14} text="5" flip />
            <Dim a={[x0 + 5 * z, y0]} b={[x0 + 5 * z, y0 + z]} off={-16} />
            <T x={x0 + 5 * z + 22} y={y0 + 10} s={10.5} mono c={C.text}>
              1
            </T>
            <T x={x0 + 30} y={y0 - 14} a="middle" s={10} c={C.faint}>
              long axis along the bar
            </T>
            <T x={406} y={y0 - 14} a="middle" s={10} c={C.faint}>
              or: two holes + a cut
            </T>
            <rect x={368} y={y0 - 9} width={4 * z + 20} height={z + 18} rx={3} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="0.6" />
            <circle cx={378} cy={y0 + z / 2} r={z / 2} fill={C.ground} stroke="#e7c48f" strokeWidth="0.8" />
            <circle cx={378 + 4 * z} cy={y0 + z / 2} r={z / 2} fill={C.ground} stroke="#e7c48f" strokeWidth="0.8" />
            <path d={`M378 ${y0} H${378 + 4 * z} M378 ${y0 + z} H${378 + 4 * z}`} stroke={C.ruby} strokeWidth="1" strokeDasharray="3 2" />
            <T x={406} y={y0 + z + 26} a="middle" s={10} c={C.dim}>
              knife between the holes
            </T>
          </g>
        )
      })()}
      <Note
        x={22}
        y={252}
        s={10.5}
        lh={14}
        head="≈ 1 × 5 mm, under the knob"
        hc={C.text}
        lines={['Long axis across the strap, along', 'the bar: the knob slides in it.', 'Skive the back layer thin around it.']}
      />
    </Fig>
  )
}

/* 5 · Seal the cut edges */
function QrSeal() {
  const z = 12
  const nx = 92
  const ny = 96
  const wall = (x, y, ok) => {
    const th = 14
    const gap = z
    const w = 70
    return (
      <g>
        <Ply x1={x} x2={x + w} y={y} t={th} k="top" />
        <Ply x1={x + w + gap} x2={x + 2 * w + gap} y={y} t={th} k="top" />
        {ok ? (
          <g stroke={C.paint} strokeWidth="3" strokeLinecap="round" fill="none">
            <path d={`M${x + w - 4} ${y - 1} L${x + w + 0.5} ${y - 1} L${x + w + 0.5} ${y + th + 1} L${x + w - 4} ${y + th + 1}`} />
            <path d={`M${x + w + gap + 4} ${y - 1} L${x + w + gap - 0.5} ${y - 1} L${x + w + gap - 0.5} ${y + th + 1} L${x + w + gap + 4} ${y + th + 1}`} />
          </g>
        ) : (
          <g stroke="#e9cf9f" strokeWidth="0.9" fill="none">
            {[x + w, x + w + gap].map((ex, i) => (
              <path key={i} d={Array.from({ length: 8 }, (_, j) => `${j ? 'L' : 'M'}${ex + (i ? 1 : -1) * (j % 2 ? -2.2 : 0)} ${y + j * 2}`).join(' ')} />
            ))}
          </g>
        )}
        <T x={x + w + gap / 2} y={y - 6} a="middle" s={10} c={C.faint}>
          channel
        </T>
        <T x={x + w + gap / 2} y={y + th + 14} a="middle" s={10} c={C.faint}>
          wrist side
        </T>
      </g>
    )
  }
  return (
    <Fig h={290} view="Detail · the notch, sealed" scale="×12">
      <Tag x={14} y={40}>Underside · painting the walls</Tag>
      <rect x={36} y={56} width={110} height={150} rx={3} fill="url(#sk-lin)" stroke={C.liningEdge} />
      <Brk x={146} y={56} h={150} />
      <line x1={30} y1={ny + 30} x2={152} y2={ny + 30} stroke={C.steel} strokeWidth="0.8" strokeDasharray="6 2 2 2" />
      <T x={158} y={ny + 34} s={10} c={C.steel}>
        bar line
      </T>
      <rect x={nx - z / 2} y={ny} width={z} height={5 * z} rx={z / 2} fill={C.ground} />
      <rect x={nx - z / 2} y={ny} width={z} height={5 * z} rx={z / 2} fill="none" stroke={C.paint} strokeWidth="3.2" />
      <rect x={nx - z / 2 - 1.6} y={ny - 1.6} width={z + 3.2} height={5 * z + 3.2} rx={z / 2 + 1.6} fill="none" stroke="#7a5638" strokeWidth="0.6" />
      <Applicator x={nx + z / 2 + 2} y={ny + 20} ang={55} />
      <Lead p={[nx - z / 2 - 1, ny + 46]} t={[36, 236]} text="edge paint on the cut walls" a="start" sub="a thin coat, carried a hair onto the face" />
      <Lead p={[nx + z / 2 + 40, ny - 14]} t={[164, 170]} text="applicator" sub="or a fine brush" />

      <Tag x={238} y={40}>Section across the notch</Tag>
      <Verdict x={452} y={70} ok={false} />
      {wall(240, 82, false)}
      <T x={240} y={136} s={10.5} c={C.ruby}>
        raw cut: fibres fuzz, wick sweat, swell
      </T>
      <Sep x1={238} y1={150} x2={466} y2={150} />
      <Verdict x={452} y={180} ok />
      {wall(240, 192, true)}
      <T x={240} y={246} s={10.5} c={C.emerald}>
        sealed: crisp walls, the knob slides clean
      </T>
      <T x={240} y={262} s={10} c={C.faint}>
        dry fully before the bar goes back in
      </T>
    </Fig>
  )
}

/* 6 · Reinsert — knob out through the notch */
function QrReinsert() {
  const s = 5
  const TP = { x: 84, y: 168, s }
  const top = TP.y - 10 * s
  const bot = TP.y + 10 * s
  const L = 20 * s
  const br = 0.9 * s
  const kmm = 4
  const proud = 1.2 * s
  const y0 = bot + 0 - proud // plain end (leading) — bar 1.2 mm proud at the top
  const ky = y0 - L + kmm * s
  const id = uid()
  return (
    <Fig h={320} view="Underside + section · refitting the bar" scale="plan ×5 · inset ×12">
      <Tag x={14} y={40}>Underside · feeding the bar in</Tag>
      <LugEndPlan T={TP} len={30} />
      <rect x={TP.x - 2.5} y={px(TP, 0, -7)[1]} width={5} height={25} rx={2.5} fill={C.ground} stroke={C.paint} strokeWidth="1.2" />
      <QRBar x={TP.x} y={y0} ang={-90} L={L} r={br} kx={L - kmm * s} ghost knob={false} />
      <clipPath id={`cl${id}`}>
        <rect x={TP.x - 20} y={0} width={40} height={top} />
      </clipPath>
      <g clipPath={`url(#cl${id})`}>
        <QRBar x={TP.x} y={y0} ang={-90} L={L} r={br} kx={L - kmm * s} knob={false} />
      </g>
      <circle cx={TP.x} cy={ky} r={2.6} fill="url(#sk-barEnd)" stroke={STEEL_EDGE} strokeWidth="0.6" />
      <Arrow a={[TP.x + 14, top - 40]} b={[TP.x + 14, top - 6]} />
      <Lead p={[TP.x + 15, top - 30]} t={[130, 50]} text="push the bar home" sub="ends flush with both edges" />
      <Lead p={[TP.x + 3, ky + 1]} t={[130, 88]} text="knob pops out through the notch" sub="a slight stretch helps on stiff leather" />
      <Lead p={[TP.x + 2, bot - 14]} t={[110, 248]} text="plain end leads" sub="enter from the knob-side edge, so the" />
      <T x={114} y={276} s={10} c={C.faint}>
        knob travels only ~4 mm inside the channel
      </T>

      <Inset at={[TP.x, ky]} r0={8} c={[392, 158]} R={60} label="section through the knob" ly={234}>
        {(() => {
          const k = 12
          const cx = 380
          const cy = 140
          const rr = 0.9 * k + 1.5
          const t = 1.0 * k
          const tb = 0.55 * k
          return (
            <g>
              <QRLoop cx={cx} cy={cy} r={rr} t={t} tb={tb} xR={cx + 90} tl={0.6 * k} notch={1.0 * k} seal />
              <QREnd cx={cx} cy={cy} r={0.9 * k} kh={1.4 * k} />
            </g>
          )
        })()}
      </Inset>
      <T x={392} y={248} a="middle" s={10} c={C.faint}>
        knob proud of the underside:
      </T>
      <T x={392} y={261} a="middle" s={10} c={C.faint}>
        a fingernail reaches it
      </T>
    </Fig>
  )
}

/* 7 · Fit — plain end in, knob retracted, align, release */
function QrFit() {
  const sc = 4.6
  const gap = 20 * sc
  const panel = (c, step) => {
    const yb = 110
    const lx = c - gap / 2
    const rx = c + gap / 2
    const r = 0.9 * sc
    const pl = r * 1.25
    const kRest = gap - 4 * sc
    const kx = step === 2 ? kRest - 2.5 * sc : kRest
    const rot = step === 1 ? 13 : 0
    const ret = step === 2 ? pl + 1 : 0
    const knobX = lx + kx
    return (
      <g>
        {/* case back & lugs */}
        <rect x={c - 70} y={46} width={140} height={22} rx={8} fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.8" />
        <rect x={lx - 14} y={60} width={14} height={68} rx={5} fill="url(#sk-steelH)" stroke={STEEL_EDGE} strokeWidth="0.8" />
        <rect x={rx} y={60} width={14} height={68} rx={5} fill="url(#sk-steelH)" stroke={STEEL_EDGE} strokeWidth="0.8" />
        <circle cx={lx - 4} cy={yb} r={2.6} fill={C.ground} stroke="#9fb4c2" strokeWidth="0.7" strokeDasharray="1.5 1" />
        <circle cx={rx + 4} cy={yb} r={2.6} fill={C.ground} stroke="#9fb4c2" strokeWidth="0.7" strokeDasharray="1.5 1" />
        <g transform={`rotate(${rot} ${lx - pl} ${yb})`}>
          <rect x={lx + 1.5} y={yb - 10} width={gap - 3} height={84} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="0.8" />
          <rect x={lx + gap - 7 * sc} y={yb - 2.3} width={5 * sc} height={4.6} rx={2.3} fill={C.ground} stroke={C.paint} strokeWidth="1" />
          <QRBar x={lx} y={yb} L={gap} r={r} kx={kx} ghost knob={false} retract={ret} />
          <QRBar x={lx} y={yb} L={gap} r={r} kx={kx} knob={false} slot={false} retract={ret} op={0} />
          {/* pins drawn solid where they show between strap and lug */}
          <rect x={lx - pl} y={yb - r * 0.5} width={pl + 1.5} height={r} rx={1} fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.5" />
          {ret < pl && <rect x={rx - 1.5} y={yb - r * 0.5} width={pl + 1.5 - ret} height={r} rx={1} fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.5" />}
          <circle cx={knobX} cy={yb} r={2.4} fill="url(#sk-barEnd)" stroke={STEEL_EDGE} strokeWidth="0.6" />
        </g>
        {step === 2 && <Arrow a={[knobX + 14, yb + 14]} b={[knobX - 4, yb + 14]} w={1.8} />}
        {step === 3 && <Arrow a={[knobX - 6, yb + 14]} b={[knobX + 12, yb + 14]} c="emerald" w={1.8} />}
        {step === 1 && <Arrow d={`M${rx + 22} ${yb + 52} q4 -26 -6 -40`} w={1.6} />}
      </g>
    )
  }
  const cs = [86, 240, 394]
  const cap = [
    ['Plain end in', 'seat its pin in the lug hole', 'knob side swung clear'],
    ['Pull the knob back', 'the far pin retracts', 'swing the strap into line'],
    ['Align and release', 'the pin springs into its hole', 'tug the strap to check'],
  ]
  return (
    <Fig h={280} view="Sequence · underside of the case" scale="true scale ×4.6">
      {cs.map((c, i) => (
        <g key={i}>
          {panel(c, i + 1)}
          <Num x={c - 64} y={36} n={i + 1} />
          <T x={c} y={236} a="middle" s={11.5} c={C.text} w="600">
            {cap[i][0]}
          </T>
          <T x={c} y={251} a="middle" s={10}>
            {cap[i][1]}
          </T>
          <T x={c} y={265} a="middle" s={10} c={C.faint}>
            {cap[i][2]}
          </T>
        </g>
      ))}
      <Sep x1={163} y1={30} x2={163} y2={270} />
      <Sep x1={317} y1={30} x2={317} y2={270} />
      <Lead p={[cs[0] - gap / 2 - 4, 110]} t={[cs[0] - 46, 206]} text="lug hole" s={10} a="middle" />
      <Lead p={[cs[0] + 6, 150]} t={[cs[0] + 30, 206]} text="lining side" s={10} a="middle" />
      <Lead p={[cs[1] + gap / 2 - 4 * 4.6 - 11.5, 110]} t={[cs[1] - 6, 206]} text="knob" s={10} a="middle" />
      <Lead p={[cs[1] + gap / 2 + 2, 110]} t={[cs[1] + 46, 206]} text="pin in" s={10} a="middle" />
      <Lead p={[cs[2] + gap / 2 + 4, 110]} t={[cs[2] + 40, 206]} text="pin seated" s={10} a="middle" />
      <Lead p={[cs[2] - 18, 110]} t={[cs[2] - 26, 206]} text="bar (hidden)" s={10} a="middle" />
    </Fig>
  )
}

/* ================================================================== */
/* Exotic leathers                                                      */
/* ================================================================== */
const CR = { base: '#241a12', tile: '#4d3b2b', hi: '#6e573f', edge: '#140e08', scale: '#46352a' }

// Local gradients (ids prefixed qx- so they never clash with the kit).
function QXDefs() {
  return (
    <defs>
      <linearGradient id="qx-crocS" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2c2119" />
        <stop offset="0.3" stopColor="#5a4330" />
        <stop offset="1" stopColor="#7d5d3e" />
      </linearGradient>
      <linearGradient id="qx-shell" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6a2f2a" />
        <stop offset="1" stopColor="#3f1916" />
      </linearGradient>
      <linearGradient id="qx-shellS" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4a1d19" />
        <stop offset="0.25" stopColor="#7a3a31" />
        <stop offset="1" stopColor="#8f4c3f" />
      </linearGradient>
      <linearGradient id="qx-ost" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#9a7651" />
        <stop offset="1" stopColor="#7c5c3d" />
      </linearGradient>
      <pattern id="qx-dense" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="4" height="4" fill="#5e2823" />
        <line x1="0" y1="2" x2="4" y2="2" stroke="#7d3a32" strokeWidth="0.8" />
      </pattern>
    </defs>
  )
}

// One belly tile, inset g from its cell, with a sheen along the top edge.
function Tile({ x, y, w, h, g = 1.1, rr = 2.2 }) {
  if (w - 2 * g < 1.5 || h - 2 * g < 1.5) return null
  const r = Math.min(rr, (w - 2 * g) / 2, (h - 2 * g) / 2)
  return (
    <g>
      <rect x={x + g} y={y + g} width={w - 2 * g} height={h - 2 * g} rx={r} fill={CR.tile} stroke={CR.edge} strokeWidth="0.6" />
      <path d={`M${x + g + r} ${y + g + 1} H${x + w - g - r}`} stroke={CR.hi} strokeWidth="0.9" opacity="0.75" />
    </g>
  )
}

// Transverse-seam x positions from x0 to x1, rows ~L long with variation.
function rowsFrom(x0, x1, L, seed = 0, v = 0.22) {
  const xs = [x0]
  let x = x0
  let i = 0
  while (x < x1) {
    x += L * (1 - v / 2 + v * rnd(seed + i * 3.7))
    xs.push(x)
    i++
  }
  return xs
}

// Belly tile grid: xs = transverse seams, ys = lengthwise seams. Each tile's
// transverse seams wander a little column to column, as on a real belly.
function TileGrid({ xs, ys, seed = 0, jit = 2, g }) {
  const J = (i, j) => (i === 0 || i === xs.length - 1 ? 0 : (rnd(seed + i * 13.1 + j * 7.7) - 0.5) * jit)
  const out = []
  for (let i = 0; i < xs.length - 1; i++)
    for (let j = 0; j < ys.length - 1; j++) {
      const a = xs[i] + J(i, j)
      const b = xs[i + 1] + J(i + 1, j)
      out.push(<Tile key={`${i}-${j}`} x={a} y={ys[j]} w={b - a} h={ys[j + 1] - ys[j]} g={g} />)
    }
  return <g>{out}</g>
}

// Section of a croc skin with domed tiles on top: seams = groove x's.
function crocTopPath(x1, x2, y, t, seams, gd = 3, gw = 6) {
  let d = `M${x1} ${y + t} L${x1} ${y + gd * 0.3}`
  let cur = x1
  const all = [...seams, x2]
  all.forEach((sx, i) => {
    const last = i === seams.length
    const end = last ? x2 : sx - gw / 2
    d += ` Q${(cur + end) / 2} ${y - gd * 0.45} ${end} ${y + gd * 0.3}`
    if (!last) {
      d += ` Q${sx} ${y + gd * 1.5} ${sx + gw / 2} ${y + gd * 0.3}`
      cur = sx + gw / 2
    }
  })
  return `${d} L${x2} ${y + t} Z`
}

// Across-width section of an exotic stack: croc on top (domed tiles), then
// the plies below. layers: [{ k: 'croc'|'top'|'lining'|'shell', t }].
function ExoStack({ cx, y, w, layers, seams = [-0.36, 0.36], gd = 3, gw = 6 }) {
  const x1 = cx - w / 2
  const x2 = cx + w / 2
  let yy = y
  return (
    <g>
      {layers.map((l, i) => {
        const py = yy
        yy += l.t
        if (l.k === 'croc')
          return (
            <path
              key={i}
              d={crocTopPath(x1, x2, py, l.t, seams.map((f) => cx + f * w), gd, gw)}
              fill="url(#qx-crocS)"
              stroke={CR.edge}
              strokeWidth="0.8"
              strokeLinejoin="round"
            />
          )
        const fill = { top: 'url(#sk-topS)', lining: 'url(#sk-linS)', shell: 'url(#qx-shellS)', vel: C.velodon }[l.k]
        const stroke = { top: LEDGE, lining: '#8f7b5a', shell: '#3a1512', vel: '#4e6f84' }[l.k]
        return <rect key={i} x={x1} y={py} width={w} height={l.t} fill={fill} stroke={stroke} strokeWidth="0.8" />
      })}
    </g>
  )
}

// Flank scales: a staggered field of round scales.
function Scales({ x0, x1, y0, y1, d = 11, seed = 0 }) {
  const out = []
  let row = 0
  for (let y = y0; y < y1; y += d * 0.86, row++) {
    for (let x = x0 + (row % 2 ? d / 2 : 0); x < x1; x += d) {
      const k = 0.85 + 0.25 * rnd(seed + x * 0.37 + y * 0.71)
      out.push(
        <g key={`${row}-${x.toFixed(0)}`}>
          <ellipse cx={x} cy={y} rx={d * 0.42 * k} ry={d * 0.36 * k} fill={CR.scale} stroke={CR.edge} strokeWidth="0.6" />
          <ellipse cx={x - d * 0.08} cy={y - d * 0.1} rx={d * 0.16 * k} ry={d * 0.1 * k} fill={CR.hi} opacity="0.5" />
        </g>
      )
    }
  }
  return <g>{out}</g>
}

const cosInterp = (P, u) => {
  for (let i = 0; i < P.length - 1; i++) {
    const [a, va] = P[i]
    const [b, vb] = P[i + 1]
    if (u >= a && u <= b) {
      const f = (1 - Math.cos(((u - a) / (b - a)) * Math.PI)) / 2
      return va + (vb - va) * f
    }
  }
  return P[P.length - 1][1]
}

/* 1 · Choose the section — a belly-cut skin */
function ExSection() {
  const id = uid()
  const X0 = 36
  const X1 = 452
  const Lx = X1 - X0
  const cy = 150
  const H = 86
  const prof = [[0, 0.3], [0.07, 0.52], [0.18, 0.78], [0.32, 0.95], [0.45, 1], [0.56, 0.93], [0.64, 0.72], [0.74, 0.45], [0.86, 0.24], [1, 0.07]]
  const h = (x) => H * cosInterp(prof, (x - X0) / Lx)
  const body = []
  for (let i = 0; i <= 80; i++) {
    const x = X0 + (Lx * i) / 80
    body.push([x, cy - h(x)])
  }
  for (let i = 80; i >= 0; i--) {
    const x = X0 + (Lx * i) / 80
    body.push([x, cy + h(x)])
  }
  const leg = (xa, dir) => {
    const e = (x) => cy + dir * (h(x) - 4)
    return [[xa, e(xa)], [xa - 3, e(xa) + dir * 22], [xa + 7, e(xa) + dir * 36], [xa + 24, e(xa) + dir * 38], [xa + 31, e(xa) + dir * 24], [xa + 28, e(xa + 28)]]
  }
  const legs = [leg(116, -1), leg(116, 1), leg(282, -1), leg(282, 1)]
  // belly tiles row by row, the band following the skin's width
  const tiles = []
  const xs = rowsFrom(X0 + 8, X1 - 30, 9, 3)
  const wts = [1.25, 1.12, 1.0, 0.88, 0.78]
  const sumW = wts.reduce((a, b) => a + b, 0)
  for (let i = 0; i < xs.length - 1; i++) {
    const a = xs[i]
    const b = Math.min(xs[i + 1], X1 - 24)
    if (b - a < 3) continue
    const bw = 0.5 * h((a + b) / 2)
    let yUp = cy
    let yDn = cy
    wts.forEach((wt, j) => {
      const step = (bw * wt) / sumW
      tiles.push(<Tile key={`u${i}-${j}`} x={a} y={yUp - step} w={b - a} h={step} g={0.8} rr={1.5} />)
      tiles.push(<Tile key={`d${i}-${j}`} x={a} y={yDn} w={b - a} h={step} g={0.8} rr={1.5} />)
      yUp -= step
      yDn += step
    })
  }
  const band = []
  for (let i = 0; i <= 60; i++) {
    const x = X0 + 8 + ((X1 - 32 - X0) * i) / 60
    band.push([x, cy - 0.5 * h(x)])
  }
  for (let i = 60; i >= 0; i--) {
    const x = X0 + 8 + ((X1 - 32 - X0) * i) / 60
    band.push([x, cy + 0.5 * h(x)])
  }
  const xd = X0 + 0.45 * Lx
  const bwd = 0.5 * h(xd)
  const sc = (2 * bwd) / 250 // px per mm: belly ≈ 25 cm here
  const tx = 300
  return (
    <Fig h={320} view="Plan · a belly-cut skin, grain up" scale="schematic">
      <QXDefs />
      <clipPath id={`sk${id}`}>
        <polygon points={pts(body)} />
        {legs.map((l, i) => (
          <polygon key={i} points={pts(l)} />
        ))}
      </clipPath>
      <polygon points={pts(body)} fill="none" stroke="#0b0805" strokeWidth="3" />
      {legs.map((l, i) => (
        <polygon key={i} points={pts(l)} fill="none" stroke="#0b0805" strokeWidth="3" />
      ))}
      <g clipPath={`url(#sk${id})`}>
        <rect x={X0 - 10} y={20} width={Lx + 20} height={270} fill={CR.base} />
        <Scales x0={X0 - 6} x1={X1 + 6} y0={cy - H - 40} y1={cy + H + 40} d={11} seed={5} />
        <polygon points={pts(band)} fill={CR.base} />
        {tiles}
      </g>
      <line x1={X0 - 6} y1={cy} x2={X1 + 6} y2={cy} stroke={C.steel} strokeWidth="0.8" strokeDasharray="10 3 2 3" opacity="0.8" />
      {/* belly width */}
      <line x1={xd} y1={cy - bwd} x2={xd} y2={cy + bwd} stroke="#f1e6d2" strokeWidth="0.9" markerStart="url(#sk-a-text)" markerEnd="url(#sk-a-text)" />
      <rect x={xd + 6} y={cy - 26} width={62} height={20} rx={4} fill="rgba(20,15,11,0.85)" stroke={C.line} />
      <T x={xd + 37} y={cy - 12} a="middle" s={11} mono c={C.text}>
        20–30 cm
      </T>
      {/* a 20 mm strap pair, to scale */}
      <rect x={tx} y={cy - 10 * sc} width={120 * sc} height={20 * sc} fill="none" stroke={C.brassHi} strokeWidth="1.2" />
      <rect x={tx + 124 * sc} y={cy - 10 * sc} width={80 * sc} height={20 * sc} fill="none" stroke={C.brassHi} strokeWidth="1.2" />

      <Lead p={[tx + 30 * sc, cy - 10 * sc]} t={[336, 40]} text="20 mm strap pair, to scale" c={C.brass} sub="on the centre row, lengthwise" />
      <Lead p={[190, cy + 22]} t={[24, 276]} text="centre belly · rectangular tiles" a="start" sub="prized, but stretches — back it" />
      <Lead p={[330, cy + 62]} t={[262, 276]} text="flank · round scales" a="start" sub="may hide calcium that dulls blades" />
      <T x={266} y={308} s={10} c={C.ruby}>
        caiman flank has the most — avoid
      </T>
      <Lead p={[xd, cy - bwd]} t={[xd - 26, 40]} text="belly width" a="end" />
      <T x={X0 + 4} y={cy - h(X0) - 8} s={10} c={C.faint}>
        head
      </T>
      <T x={X1} y={cy + 22} a="end" s={10} c={C.faint}>
        tail
      </T>
      <T x={X1 - 2} y={cy - 6} a="end" s={10} c={C.steel}>
        centre
      </T>
    </Fig>
  )
}

/* 2 · Lay out — centreline on a balanced tile row */
function ExLayout() {
  const s = 4
  const cy = 150
  const cols = [-17, -11.5, -4.5, 4.5, 11.5, 17]
  const panel = (x0, off, ok) => {
    const id = uid()
    const xs = rowsFrom(x0 - 10, x0 + 220, 6 * s, 11)
    const ys = cols.map((c) => cy + (c + off) * s)
    const tl = x0 + 8
    const tr = x0 + 208
    const seamY = cy + (4.5 + off) * s
    return (
      <g>
        <clipPath id={`lp${id}`}>
          <rect x={x0} y={cy - 14 * s} width={212} height={28 * s} rx={6} />
        </clipPath>
        <g clipPath={`url(#lp${id})`}>
          <rect x={x0} y={cy - 18 * s} width={212} height={36 * s} fill={CR.base} />
          <TileGrid xs={xs} ys={[cy - 30 * s, ...ys, cy + 30 * s]} seed={x0} jit={3} />
          <path
            d={`M${x0} ${cy - 18 * s} h212 v${36 * s} h-212 Z M${tl} ${cy - 10 * s} V${cy + 10 * s} H${tr} V${cy - 10 * s} Z`}
            fill="rgba(10,8,6,0.5)"
            fillRule="evenodd"
          />
        </g>
        <rect x={tl} y={cy - 10 * s} width={tr - tl} height={20 * s} fill="none" stroke={C.brassHi} strokeWidth="1.3" strokeDasharray="6 3" />
        <line x1={tl - 6} y1={cy} x2={tr + 6} y2={cy} stroke={C.steel} strokeWidth="1" strokeDasharray="10 3 2 3" />
        {[-7, 7].map((m) => {
          const bad = !ok && Math.abs(cy + m * s - seamY) < 3
          return (
            <line
              key={m}
              x1={tl + 6 * s}
              y1={cy + m * s}
              x2={tr - 2}
              y2={cy + m * s}
              stroke={bad ? C.ruby : C.emerald}
              strokeWidth={bad ? 2 : 1.5}
              strokeDasharray="2 2.5"
            />
          )
        })}
        {!ok && <line x1={x0} y1={seamY} x2={x0 + 212} y2={seamY} stroke={C.ruby} strokeWidth="0.8" opacity="0.6" />}
        <Verdict x={x0 + 200} y={44} ok={ok} />
      </g>
    )
  }
  return (
    <Fig h={320} view="Plan · template on the belly" scale="true scale ×4">
      <QXDefs />
      <Tag x={18} y={48}>Centred on a tile row</Tag>
      {panel(18, 0, true)}
      <Tag x={250} y={48}>2.5 mm off the row</Tag>
      {panel(250, 2.5, false)}
      <Dim a={[26, cy - 10 * s]} b={[26, cy + 10 * s]} off={14} text="20" />
      <Lead p={[110, cy]} t={[96, 72]} text="centreline mid-row" a="middle" c={C.steel} />
      <Lead p={[120, cy + 28]} t={[80, 256]} text="stitch line 3 mm in" a="middle" c={C.emerald} sub="runs inside the tiles" />
      <Lead p={[200, cy - 34]} t={[226, 72]} text="part-tiles" a="end" sub="equal both sides" />
      <Lead p={[330, cy + 28]} t={[322, 258]} text="stitch on a soft seam" a="middle" c={C.ruby} sub="the seam opens under load" />
      <Lead p={[420, cy - 34]} t={[454, 70]} text="unbalanced" a="end" c={C.ruby} />
      <Lead p={[176, cy + 18]} t={[192, 256]} text="soft seam" a="start" sub="between tiles" />
      <Note
        x={18}
        y={290}
        s={10.5}
        lh={14}
        lines={['Mark the centreline on the flesh, aligned to the chosen row. Pattern lengthwise', '(head → tail): rows cross the strap, the lengthwise seams stay off the stitch line.']}
      />
    </Fig>
  )
}

/* 3 · Cut — one pass per edge */
function ExCut() {
  const id = uid()
  const yc = 128
  const xs = rowsFrom(16, 470, 26, 21)
  const ys = [54, 76, 102, 128, 154, 180]
  const edge = (x0, ok) => {
    const cid = uid()
    const y = 282
    const xs2 = rowsFrom(x0 - 4, x0 + 210, 34, 31 + x0)
    let path
    if (ok) path = `M${x0} ${y} H${x0 + 200}`
    else {
      const m = x0 + 96
      path = `M${x0} ${y} H${m} L${m + 2} ${y + 5} L${m + 9} ${y + 3} L${m + 12} ${y + 6} H${x0 + 200}`
    }
    return (
      <g>
        <clipPath id={`ec${cid}`}>
          <rect x={x0} y={y - 50} width={200} height={50} />
        </clipPath>
        <rect x={x0} y={y - 50} width={200} height={50} fill={CR.base} />
        <g clipPath={`url(#ec${cid})`}>
          <TileGrid xs={xs2} ys={[y - 64, y - 34, y - 6, y + 22]} seed={x0} jit={3} />
        </g>
        {!ok && <path d={`M${x0 + 96} ${y} L${x0 + 98} ${y + 5} L${x0 + 105} ${y + 3} L${x0 + 108} ${y + 6} L${x0 + 108} ${y - 1} Z`} fill={CR.tile} />}
        <path d={path} fill="none" stroke={ok ? '#e7c48f' : C.ruby} strokeWidth="1.2" />
        {!ok &&
          [0, 1, 2, 3].map((i) => (
            <line key={i} x1={x0 + 99 + i * 3} y1={y + 2} x2={x0 + 98 + i * 3} y2={y + 7} stroke="#e9cf9f" strokeWidth="0.8" />
          ))}
        <rect x={x0} y={y - 50} width={200} height={70} rx={4} fill="none" stroke={C.line} />
      </g>
    )
  }
  return (
    <Fig h={340} view="Plan · cutting the croc" scale="schematic">
      <QXDefs />
      <clipPath id={`cc${id}`}>
        <rect x={16} y={54} width={448} height={126} rx={6} />
      </clipPath>
      <g clipPath={`url(#cc${id})`}>
        <rect x={16} y={54} width={448} height={126} fill={CR.base} />
        <TileGrid xs={xs} ys={ys} seed={4} jit={4} />
        <rect x={16} y={yc} width={448} height={60} fill="rgba(10,8,6,0.55)" />
      </g>
      <line x1={30} y1={yc} x2={360} y2={yc} stroke={C.hole} strokeWidth="2" />
      <line x1={30} y1={yc} x2={360} y2={yc} stroke="#e7c48f" strokeWidth="0.6" />
      <line x1={360} y1={yc} x2={462} y2={yc} stroke={C.brassHi} strokeWidth="1.2" strokeDasharray="5 3" />
      <Rule x={28} y={yc} len={330} s={4} w={14} />
      <Knife kind="utility" x={360} y={yc} ang={-28} />
      <Arrow a={[44, yc + 22]} b={[330, yc + 22]} w={2.2} />
      <T x={190} y={yc + 40} a="middle" s={11.5} c={C.brass} w="600">
        one continuous pass, start to end
      </T>
      <Lead p={[200, yc - 7]} t={[200, 196]} text="rule on the keep side" a="middle" s={10} />
      <Lead p={[90, yc - 30]} t={[60, 30]} text="strap (keep)" a="start" s={10} />
      <Lead p={[420, yc]} t={[454, 196]} text="template line" a="end" s={10} c={C.brass} />
      <Lead p={[372, yc - 60]} t={[466, 30]} text="fresh blade" a="end" sub="calcium deposits dull it" />

      <Tag x={20} y={222}>Edge · one pass</Tag>
      <Verdict x={210} y={218} ok />
      {edge(20, true)}
      <Tag x={256} y={222}>Edge · stopped, restarted</Tag>
      <Verdict x={452} y={218} ok={false} />
      {edge(256, false)}
      <T x={20} y={318} s={10.5} c={C.emerald}>
        a straight wall, ready to paint
      </T>
      <T x={256} y={318} s={10.5} c={C.ruby}>
        a step and torn fibre at the restart:
      </T>
      <T x={256} y={332} s={10.5} c={C.ruby}>
        it shows through every coat
      </T>
    </Fig>
  )
}

/* 4 · Thin — skiving under the tiles */
function ExThin() {
  const SY = 248
  const T0 = 26
  const x1 = 40
  const x2 = 440
  const xs0 = 230
  const yF = SY - T0
  const plane = (x) => (x < xs0 ? yF : yF + ((x - xs0) / (x2 - xs0)) * 22)
  const grooves = [70, 115, 160, 205, 250, 295, 340, 385, 430]
  const bot = (x) => {
    let y = SY
    grooves.forEach((g) => {
      if (Math.abs(x - g) < 4.5) y = Math.min(y, SY - 8 * Math.cos((Math.PI * (x - g)) / 9))
    })
    return y
  }
  const topP = []
  const botP = []
  for (let x = x1; x <= x2; x += 1) {
    const b = bot(x)
    topP.push([x, Math.min(plane(x), b)])
    botP.push([x, b])
  }
  const TS = { x: 70, y: 78, s: 2.4 }
  const o = LONG({ x0: -20 })
  return (
    <Fig h={340} view="Plan + section · thinning the skin" scale="section: thickness ×22">
      <QXDefs />
      <Tag x={14} y={40}>Where to skive · long piece, flesh up</Tag>
      <StrapPlan T={TS} o={o} face="croc" zones={[{ from: -20, to: 6, k: 'skiveL' }, { from: 106, to: 121, k: 'skiveR' }]} folds={[{ x: 0 }]} />
      {[-1, 1].map((sg) => {
        const run = []
        for (let x = 6; x <= 104; x += 2) run.push(px(TS, x, sg * (widthAt(x, o) / 2 - 1.1)))
        return <polyline key={sg} points={pts(run)} fill="none" stroke="rgba(208,168,79,0.55)" strokeWidth={2.2 * TS.s} />
      })}
      <Lead p={[TS.x - 14 * TS.s, TS.y]} t={[40, 124]} text="fold flap: thinnest" a="start" s={10} c={C.brass} />
      <Lead p={[TS.x + 60 * TS.s, TS.y - 8.5 * TS.s]} t={[300, 52]} text="edges: lightly" a="start" s={10} c={C.brass} />
      <Lead p={[TS.x + 112 * TS.s, TS.y + 4]} t={[404, 124]} text="end: thinner" a="end" s={10} c={C.brass} />
      <Lead p={[TS.x + 40 * TS.s, TS.y + 2]} t={[230, 124]} text="body: leave full" a="middle" s={10} />
      <Sep x1={14} y1={138} x2={466} y2={138} />
      <Tag x={14} y={158}>Section at the end · grain down on the slab</Tag>

      <Slab x={30} y={SY} w={420} h={12} />
      <polygon points={pts([[xs0, yF], [x2, yF], [x2, plane(x2)]])} fill="url(#sk-fadeR)" />
      <line x1={xs0} y1={yF} x2={x2} y2={yF} stroke={C.brass} strokeWidth="0.8" strokeDasharray="4 3" />
      <polygon points={pts([...topP, ...botP.reverse()])} fill="url(#qx-crocS)" stroke={CR.edge} strokeWidth="0.8" strokeLinejoin="round" />
      <line x1={xs0} y1={yF} x2={x2} y2={plane(x2)} stroke="#e7c48f" strokeWidth="0.7" opacity="0.8" />
      <Knife kind="skive" x={300} y={plane(300) - 0.5} ang={-77} />
      <Arrow a={[318, plane(318) - 9]} b={[372, plane(372) - 9]} w={1.8} />
      <circle cx={430} cy={SY - 7} r={9} fill="none" stroke={C.ruby} strokeWidth="1.5" />
      <circle cx={385} cy={SY - 7} r={8} fill="none" stroke={C.brass} strokeWidth="1.2" strokeDasharray="2 2" />

      <Lead p={[150, yF]} t={[120, 182]} text="flesh — skived from this side" a="start" s={10} />
      <Lead p={[350, (yF + plane(350)) / 2]} t={[390, 182]} text="skived away" a="start" s={10} c={C.brass} />
      <Lead p={[92, SY - 1]} t={[40, 284]} text="tile (grain down)" a="start" s={10} />
      <Lead p={[160, SY - 6]} t={[150, 284]} text="low spot between tiles" a="start" s={10} />
      <Lead p={[385, SY - 15]} t={[360, 304]} text="paper-thin" a="end" s={10} c={C.brass} />
      <Lead p={[436, SY - 4]} t={[454, 284]} text="cut through!" a="end" c={C.ruby} />
      <Note x={14} y={330} s={10.5} lh={14} lines={['Skive in light passes and stop short of the grooves — or order the skin pre-thinned.']} />
    </Fig>
  )
}

/* 5 · Back — skin, backing and lining in section */
function ExBack() {
  const k = 16
  const w = 180
  const cx = 250
  const row = (y, layers, labels, dims, tag, note) => {
    let yy = y
    const mids = layers.map((l) => {
      const m = yy + l.t / 2
      yy += l.t
      return m
    })
    const total = yy - y
    const ly = labels.map((_, i) => y + total / 2 + (i - (labels.length - 1) / 2) * 16)
    const dy = dims.map((_, i) => y + total / 2 + (i - (dims.length - 1) / 2) * 16)
    return (
      <g>
        <Tag x={14} y={y - 18}>{tag}</Tag>
        <T x={466} y={y - 18} a="end" s={10} c={C.faint}>
          {note}
        </T>
        <ExoStack cx={cx} y={y} w={w} layers={layers} gd={3.2} />
        {labels.map((lb, i) => (
          <g key={i}>
            <polyline points={`${150},${ly[i]} ${cx - w / 2 - 14},${ly[i]} ${cx - w / 2 - 3},${mids[i]}`} fill="none" stroke={C.struct} strokeWidth="0.7" />
            <circle cx={cx - w / 2 - 3} cy={mids[i]} r={1.6} fill={C.text} />
            <T x={146} y={ly[i] + 4} a="end" s={11} c={C.text}>
              {lb}
            </T>
          </g>
        ))}
        {dims.map(([i, txt], j) => {
          const ya = mids[i] - layers[i].t / 2
          const xd = cx + w / 2 + 8 + j * 12
          return (
            <g key={i}>
              <line x1={cx + w / 2 + 2} y1={ya} x2={xd + 4} y2={ya} stroke={C.dim} strokeWidth="0.5" opacity="0.7" />
              <line x1={cx + w / 2 + 2} y1={ya + layers[i].t} x2={xd + 4} y2={ya + layers[i].t} stroke={C.dim} strokeWidth="0.5" opacity="0.7" />
              <Dim a={[xd, ya]} b={[xd, ya + layers[i].t]} />
              <polyline points={`${xd + 3},${mids[i]} ${cx + w / 2 + 34},${dy[j]}`} fill="none" stroke={C.struct} strokeWidth="0.6" />
              <T x={cx + w / 2 + 38} y={dy[j] + 4} s={10.5} mono c={C.text}>
                {txt}
              </T>
            </g>
          )
        })}
      </g>
    )
  }
  return (
    <Fig h={310} view="Section · across the strap" scale="thickness ×16 · width ×9">
      <QXDefs />
      {row(
        70,
        [
          { k: 'croc', t: 0.8 * k },
          { k: 'top', t: 1.1 * k },
          { k: 'lining', t: 0.6 * k },
        ],
        ['croc / alligator', 'veg-tan backing', 'calf lining'],
        [[1, '1–1.2 mm']],
        'Option 1 · veg-tan backing',
        'non-stretch: holds the belly to its shape'
      )}
      <Sep x1={14} y1={140} x2={466} y2={140} />
      {row(
        176,
        [
          { k: 'croc', t: 0.7 * k },
          { k: 'top', t: 0.5 * k },
          { k: 'lining', t: 0.6 * k },
        ],
        ['croc skived thin', 'thin backing', 'calf lining'],
        [[0, '≈ 0.7 mm'], [1, '0.5 mm']],
        'Option 2 · one maker, thin over thin',
        'a slimmer stack for a dress strap'
      )}
      <Sep x1={14} y1={234} x2={466} y2={234} />
      {row(
        268,
        [
          { k: 'croc', t: 0.8 * k },
          { k: 'vel', t: 3 },
          { k: 'lining', t: 0.6 * k },
        ],
        ['skin', 'non-stretch film', 'calf lining'],
        [],
        'Option 3 · a non-stretch interlayer',
        'what makes a stretchy belly usable'
      )}
    </Fig>
  )
}

/* 6 · Line — calf lining, bonded in the curve */
function ExLine() {
  const cx = 240
  const cy = 330
  const P = (r, a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)]
  const band = (r1, r2, a0, a1, fill, stroke) => {
    const [x1, y1] = P(r1, a0)
    const [x2, y2] = P(r1, a1)
    const [x3, y3] = P(r2, a1)
    const [x4, y4] = P(r2, a0)
    return <path d={`M${x1} ${y1} A${r1} ${r1} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${r2} ${r2} 0 0 0 ${x4} ${y4} Z`} fill={fill} stroke={stroke} strokeWidth="0.8" />
  }
  const R0 = 150
  const rl = [R0, R0 + 7] // lining
  const rb = [R0 + 7.5, R0 + 19] // backing
  const rc = [R0 + 19, R0 + 29] // croc
  const a0 = -122
  const a1 = -58
  const flap = (a, side, r1, r2, fill, stroke) => {
    const rad = (a * Math.PI) / 180
    const d = side < 0 ? [Math.sin(rad), -Math.cos(rad)] : [-Math.sin(rad), Math.cos(rad)]
    const n = [Math.cos(rad), Math.sin(rad)]
    const c = Math.cos((14 * Math.PI) / 180)
    const s = Math.sin((14 * Math.PI) / 180)
    const dd = [d[0] * c + n[0] * s, d[1] * c + n[1] * s]
    const L = 70
    const p1 = P(r1, a)
    const p2 = P(r2, a)
    return <polygon points={pts([p1, p2, [p2[0] + dd[0] * L, p2[1] + dd[1] * L], [p1[0] + dd[0] * L, p1[1] + dd[1] * L]])} fill={fill} stroke={stroke} strokeWidth="0.8" />
  }
  const seamsA = []
  for (let a = a0 + 4; a < a1; a += 6.5) seamsA.push(a)
  return (
    <Fig h={330} view="Section · lining the backed skin" scale="schematic">
      <QXDefs />
      <Bottle cx={cx} cy={cy} r={R0 - 1} />
      {band(rl[1], rl[0], -150, -30, 'url(#sk-linS)', '#8f7b5a')}
      <path d={`M${P(rl[1] + 0.5, -150).join(' ')} A${rl[1] + 0.5} ${rl[1] + 0.5} 0 0 1 ${P(rl[1] + 0.5, -30).join(' ')}`} fill="none" stroke={C.glue} strokeWidth="2.2" strokeDasharray="1.2 2.6" strokeLinecap="round" />
      {band(rb[1], rb[0], a0, a1, 'url(#sk-topS)', LEDGE)}
      {band(rc[1], rc[0], a0, a1, '#3d2e22', CR.edge)}
      {seamsA.map((a) => (
        <line key={a} x1={P(rc[0] + 2, a)[0]} y1={P(rc[0] + 2, a)[1]} x2={P(rc[1], a)[0]} y2={P(rc[1], a)[1]} stroke={CR.edge} strokeWidth="1.4" />
      ))}
      {flap(a0, -1, rb[0], rb[1], 'url(#sk-topS)', LEDGE)}
      {flap(a0, -1, rc[0], rc[1], '#3d2e22', CR.edge)}
      {flap(a1, 1, rb[0], rb[1], 'url(#sk-topS)', LEDGE)}
      {flap(a1, 1, rc[0], rc[1], '#3d2e22', CR.edge)}
      <Arrow a={P(R0 + 60, a0 - 4)} b={P(R0 + 36, a0 - 6)} w={1.8} />
      <Arrow a={P(R0 + 60, a1 + 4)} b={P(R0 + 36, a1 + 6)} w={1.8} />
      <Arrow d={`M${P(R0 + 40, -94).join(' ')} A${R0 + 40} ${R0 + 40} 0 0 0 ${P(R0 + 40, -112).join(' ')}`} c="emerald" w={1.5} />
      <Arrow d={`M${P(R0 + 40, -86).join(' ')} A${R0 + 40} ${R0 + 40} 0 0 1 ${P(R0 + 40, -68).join(' ')}`} c="emerald" w={1.5} />
      <T x={cx} y={cy - R0 - 46} a="middle" s={10.5} c={C.emerald}>
        bond from the centre out
      </T>

      <Lead p={P(rc[1] - 3, -104)} t={[150, 58]} text="croc, grain out" a="end" />
      <Lead p={P((rb[0] + rb[1]) / 2, -112)} t={[150, 90]} text="veg-tan backing" a="end" />
      <Lead p={P((rl[0] + rl[1]) / 2, -40)} t={[420, 196]} text="calf lining" sub="or kangaroo" />
      <Lead p={P(rl[1] + 0.5, -142)} t={[24, 256]} text="glue on the lining" a="start" s={10} c={C.emerald} />
      <Lead p={P(R0 + 50, a0 - 8)} t={[40, 140]} text="ends still free" a="start" s={10} c={C.brass} />
      <T x={cx} y={cy - 70} a="middle" s={10.5} c="#8fbcae">
        former / bottle
      </T>
      <T x={cx} y={cy - 54} a="middle" s={10} c={C.faint}>
        the stack is born curved (Rule 2)
      </T>

      <Tag x={286} y={40}>Result · across the strap</Tag>
      <ExoStack cx={400} y={52} w={120} layers={[{ k: 'croc', t: 9 }, { k: 'top', t: 11 }, { k: 'lining', t: 7 }]} gd={2.6} gw={5} />
      <T x={392} y={96} a="middle" s={10} c={C.faint}>
        factories: anti-allergenic calf
      </T>
    </Fig>
  )
}

/* 7 · Stitch — holes in the tiles, not the seams */
function ExStitch() {
  const s = 7
  const x0 = 30
  const x1 = 450
  const xs = rowsFrom(x0 - 8, x1 + 10, 6 * s, 41, 0.3)
  const seams = xs.slice(1, -1)
  const strip = (ye, ok) => {
    const id = uid()
    const sl = ye + 3 * s
    const lw = ye + 5.5 * s
    let holes = []
    if (!ok) {
      for (let x = x0 + 8; x < x1 - 4; x += 3 * s) holes.push(x)
    } else {
      for (let i = 0; i < xs.length - 1; i++) {
        const a = Math.max(xs[i], x0) + 0.9 * s
        const b = Math.min(xs[i + 1], x1) - 0.9 * s
        if (b - a < 0.5 * s) continue
        const n = Math.max(1, Math.round((b - a) / (3 * s)) + 1)
        for (let j = 0; j < n; j++) holes.push(n === 1 ? (a + b) / 2 : a + ((b - a) * j) / (n - 1))
      }
    }
    const bad = (x) => seams.some((g) => Math.abs(g - x) < 0.8 * s)
    return (
      <g>
        <clipPath id={`st${id}`}>
          <rect x={x0} y={ye} width={x1 - x0} height={9 * s} />
        </clipPath>
        <g clipPath={`url(#st${id})`}>
          <rect x={x0} y={ye} width={x1 - x0} height={9 * s} fill={CR.base} />
          <TileGrid xs={xs} ys={[ye - 2, lw, ye + 12.5 * s]} seed={7} jit={0} />
        </g>
        <line x1={x0} y1={ye} x2={x1} y2={ye} stroke={C.paint} strokeWidth="3" />
        <line x1={x0} y1={ye - 1.5} x2={x1} y2={ye - 1.5} stroke="#7a5638" strokeWidth="0.6" />
        <line x1={x0} y1={sl} x2={x1} y2={sl} stroke={ok ? C.emerald : C.dim} strokeWidth="0.6" strokeDasharray="2 3" opacity="0.7" />
        {ok &&
          holes.slice(0, -1).map((x, i) => (
            <line key={'t' + i} x1={x + 2} y1={sl + 1.6} x2={holes[i + 1] - 2} y2={sl - 1.6} stroke={C.thread} strokeWidth="1.6" strokeLinecap="round" />
          ))}
        {holes.map((x, i) => (
          <g key={i}>
            <line x1={x - 2} y1={sl + 2} x2={x + 2} y2={sl - 2} stroke={C.hole} strokeWidth="1.8" strokeLinecap="round" />
            {!ok && bad(x) && <circle cx={x} cy={sl} r={6} fill="none" stroke={C.ruby} strokeWidth="1.3" />}
          </g>
        ))}
      </g>
    )
  }
  const yA = 62
  const yB = 206
  const badX = (() => {
    for (let x = x0 + 8; x < x1 - 4; x += 3 * s) if (seams.some((g) => Math.abs(g - x) < 0.8 * s) && x > 200) return x
    return 240
  })()
  return (
    <Fig h={340} view="Plan · stitch line along the edge" scale="true scale ×7">
      <QXDefs />
      <Tag x={30} y={50}>Even 3 mm pitch, tiles ignored</Tag>
      <Verdict x={442} y={46} ok={false} />
      {strip(yA, false)}
      <Dim a={[x0, yA]} b={[x0, yA + 3 * s]} off={10} />
      <T x={16} y={yA + 14} a="middle" s={10} mono>
        3
      </T>
      <Lead p={[badX + 4, yA + 3 * s + 5]} t={[badX + 30, 150]} text="hole in a soft seam" c={C.ruby} sub="tears out under load" />
      <Lead p={[120, yA + 5.5 * s]} t={[100, 150]} text="lengthwise seam" a="end" s={10} />
      <Sep x1={14} y1={184} x2={466} y2={184} />
      <Tag x={30} y={200}>Holes placed in the tiles</Tag>
      <Verdict x={442} y={196} ok />
      {strip(yB, true)}
      <Lead p={[xs[3], yB + 7.5 * s]} t={[150, 296]} text="seam: no hole" a="end" s={10} />
      <Lead p={[xs[5] - 20, yB + 3 * s]} t={[190, 296]} text="hard tile: awl firmly, the hole holds" a="start" s={10} c={C.emerald} />
      <Note
        x={30}
        y={326}
        s={10.5}
        lh={14}
        lines={['Ease the pitch a little at each transverse seam so every hole lands in a tile (house practice).']}
      />
    </Fig>
  )
}

/* 8 · Edges — paint, bind or turn; never burnish */
function ExEdges() {
  const k = 15
  const layers = [{ k: 'croc', t: 0.8 * k }, { k: 'top', t: 1.0 * k }, { k: 'lining', t: 0.6 * k }]
  const total = layers.reduce((a, l) => a + l.t, 0)
  const y = 100
  const cx = 132
  const w = 180
  const coat = (ex, sd) => {
    const d = `M${ex - sd * 5} ${y - 1.5} Q${ex + sd * 2.5} ${y - 1} ${ex + sd * 2.5} ${y + 5} L${ex + sd * 2.5} ${y + total - 5} Q${ex + sd * 2.5} ${y + total + 1} ${ex - sd * 5} ${y + total + 1.5}`
    return (
      <g>
        <path d={d} fill="none" stroke={C.paint} strokeWidth="4.2" strokeLinecap="round" />
        <path d={d} fill="none" stroke="#7a5638" strokeWidth="0.6" transform={`translate(${sd * 1.6} 0)`} />
      </g>
    )
  }
  const mini = (yy, kind, ok, title, sub1, sub2) => {
    const x1 = 372
    const x2 = 426
    const t1 = 0.8 * 11
    const t2 = 1.0 * 11
    const t3 = 0.6 * 11
    const tt = t1 + t2 + t3
    return (
      <g>
        <path d={crocTopPath(x1, x2, yy, t1, [394], 2.2, 4.5)} fill="url(#qx-crocS)" stroke={CR.edge} strokeWidth="0.7" />
        <rect x={x1} y={yy + t1} width={x2 - x1 - (kind === 'turn' ? 3 : 0)} height={t2} fill="url(#sk-topS)" stroke={LEDGE} strokeWidth="0.7" />
        <rect x={x1} y={yy + t1 + t2} width={x2 - x1} height={t3} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
        {kind === 'bind' && (
          <path
            d={`M${x2 - 12} ${yy - 3} H${x2 - 1} Q${x2 + 5} ${yy - 3} ${x2 + 5} ${yy + 3} V${yy + tt - 3} Q${x2 + 5} ${yy + tt + 3} ${x2 - 1} ${yy + tt + 3} H${x2 - 12}`}
            fill="none"
            stroke="#7a4a2a"
            strokeWidth="3.5"
          />
        )}
        {kind === 'turn' && (
          <path d={`M${x2 - 2} ${yy + 1} Q${x2 + 6} ${yy + 2} ${x2 + 6} ${yy + t1 + t2 / 2} Q${x2 + 6} ${yy + t1 + t2 + 1} ${x2 - 10} ${yy + t1 + t2 - 1}`} fill="none" stroke="#3d2e22" strokeWidth={t1 * 0.6} />
        )}
        {kind === 'burnish' && (
          <g>
            <path d={Array.from({ length: Math.ceil(tt / 2) + 1 }, (_, j) => `${j ? 'L' : 'M'}${x2 + (j % 2 ? 1.8 : 0)} ${yy + Math.min(tt, j * 2)}`).join(' ')} fill="none" stroke="#e9cf9f" strokeWidth="0.9" />
            <rect x={x2 + 6} y={yy - 4} width={9} height={tt + 8} rx={4.5} fill="url(#sk-wood)" stroke="#3e2614" strokeWidth="0.7" />
          </g>
        )}
        <Verdict x={454} y={yy + tt / 2} ok={ok} r={8} />
        <T x={264} y={yy + 6} s={11.5} c={C.text} w="600">
          {title}
        </T>
        <T x={264} y={yy + 20} s={10} c={C.faint}>
          {sub1}
        </T>
        <T x={264} y={yy + 33} s={10} c={C.faint}>
          {sub2}
        </T>
      </g>
    )
  }
  return (
    <Fig h={310} view="Section · edge of a reptile stack" scale="thickness ×15">
      <QXDefs />
      <Tag x={14} y={40}>Painted edge</Tag>
      <ExoStack cx={cx} y={y} w={w} layers={layers} gd={3} />
      {coat(cx - w / 2, -1)}
      {coat(cx + w / 2, 1)}
      <Lead p={[cx - 20, y + 2]} t={[cx - 30, 66]} text="croc · chrome-tanned" a="middle" />
      <Lead p={[cx + 40, y + 0.8 * k + 6]} t={[cx + 50, 172]} text="veg-tan backing" a="middle" s={10} />
      <Lead p={[cx - 10, y + total - 4]} t={[cx - 26, 172]} text="calf lining" a="middle" s={10} />
      <Lead p={[cx + w / 2 + 4, y + 8]} t={[cx + w / 2 + 6, 66]} text="paint" a="middle" s={10} />
      <Inset at={[cx - w / 2 - 2, y + total / 2]} r0={11} c={[78, 242]} R={42}>
        {(() => {
          const ex = 58
          const yy = 218
          return (
            <g>
              <rect x={ex} y={yy} width={90} height={14} fill="url(#qx-crocS)" />
              <rect x={ex} y={yy + 14} width={90} height={16} fill="url(#sk-topS)" />
              <rect x={ex} y={yy + 30} width={90} height={10} fill="url(#sk-linS)" />
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={ex - 3.2 - i * 3.2} y={yy - 2 + i * 0.6} width={3} height={44 - i * 1.2} fill={i % 2 ? '#4a3626' : C.paint} stroke="#7a5638" strokeWidth="0.4" />
              ))}
            </g>
          )
        })()}
      </Inset>
      <T x={130} y={222} s={11} c={C.text} w="600">
        3–4 thin coats
      </T>
      <T x={130} y={237} s={10.5}>
        sanded between,
      </T>
      <T x={130} y={251} s={10.5}>
        edge held upright
      </T>
      <T x={130} y={268} s={10.5} c={C.ruby}>
        expect uneven
      </T>
      <T x={130} y={282} s={10.5} c={C.ruby}>
        drying on reptile
      </T>
      <Sep x1={250} y1={30} x2={250} y2={296} />
      <Tag x={262} y={40}>The other routes</Tag>
      {mini(70, 'bind', true, 'Bind', 'a leather strip', 'wraps the edge')}
      {mini(150, 'turn', true, 'Turn', 'the skin is turned', 'round the backing')}
      {mini(230, 'burnish', false, 'Never burnish', 'chrome-tanned skin', 'will not take it')}
    </Fig>
  )
}

/* 9 · Keepers — skived and turned */
function ExKeepers() {
  const id = uid()
  return (
    <Fig h={270} view="Sequence · a turned alligator keeper" scale="schematic">
      <QXDefs />
      <Num x={26} y={44} n={1} />
      <T x={40} y={48} s={11.5} c={C.text} w="600">
        Skive the margins
      </T>
      <clipPath id={`kb${id}`}>
        <rect x={24} y={80} width={124} height={66} rx={2} />
      </clipPath>
      <g clipPath={`url(#kb${id})`}>
        <rect x={24} y={80} width={124} height={66} fill={CR.base} />
        <TileGrid xs={rowsFrom(20, 150, 16, 51)} ys={[80, 96, 113, 130, 146]} seed={9} jit={2} />
      </g>
      <rect x={24} y={80} width={124} height={16} fill="rgba(208,168,79,0.45)" />
      <rect x={24} y={130} width={124} height={16} fill="rgba(208,168,79,0.45)" />
      <rect x={24} y={96} width={124} height={34} fill="none" stroke={C.brassHi} strokeWidth="1" strokeDasharray="4 3" />
      <rect x={24} y={80} width={124} height={66} rx={2} fill="none" stroke={C.line} />
      <Dim a={[148, 96]} b={[148, 130]} off={-12} />
      <T x={166} y={117} s={10.5} mono c={C.text}>
        5
      </T>
      <Lead p={[60, 86]} t={[40, 68]} text="margin skived thin" a="start" s={10} c={C.brass} />
      <T x={24} y={164} s={10} c={C.faint}>
        flesh side; finished width dashed
      </T>

      <Sep x1={186} y1={30} x2={186} y2={180} />
      <Num x={200} y={44} n={2} />
      <T x={214} y={48} s={11.5} c={C.text} w="600">
        Turn round a core
      </T>
      {(() => {
        const cx = 258
        const y = 108
        const w = 76
        const t = 9
        return (
          <g>
            <rect x={cx - w / 2} y={y} width={w} height={t} fill="url(#sk-topS)" stroke={LEDGE} strokeWidth="0.7" />
            <path
              d={`M${cx - w / 2 - 2} ${y - 6} H${cx + w / 2 + 2} Q${cx + w / 2 + 9} ${y - 6} ${cx + w / 2 + 9} ${y + t / 2} Q${cx + w / 2 + 9} ${y + t + 6} ${cx + w / 2 - 2} ${y + t + 6} H${cx + 6}
                 L${cx + 6} ${y + t + 2} H${cx + w / 2 - 2} Q${cx + w / 2 + 4} ${y + t + 2} ${cx + w / 2 + 4} ${y + t / 2} Q${cx + w / 2 + 4} ${y - 2} ${cx + w / 2} ${y - 2} H${cx - w / 2} Q${cx - w / 2 - 4} ${y - 2} ${cx - w / 2 - 4} ${y + t / 2} Q${cx - w / 2 - 4} ${y + t + 2} ${cx - w / 2 + 2} ${y + t + 2} H${cx - 6}
                 L${cx - 6} ${y + t + 6} H${cx - w / 2 + 2} Q${cx - w / 2 - 9} ${y + t + 6} ${cx - w / 2 - 9} ${y + t / 2} Q${cx - w / 2 - 9} ${y - 6} ${cx - w / 2 - 2} ${y - 6} Z`}
              fill="url(#qx-crocS)"
              stroke={CR.edge}
              strokeWidth="0.7"
            />
            {[-14, 14].map((dx) => (
              <path key={dx} d={`M${cx + dx * 2.6} ${y - 7} q0 -6 ${dx * 0.3} -9`} stroke={CR.edge} strokeWidth="0.8" fill="none" />
            ))}
            <Arrow d={`M${cx - w / 2 - 18} ${y - 14} q-8 16 6 30`} w={1.4} />
            <Arrow d={`M${cx + w / 2 + 18} ${y - 14} q8 16 -6 30`} w={1.4} />
            <Lead p={[cx, y + t / 2]} t={[cx + 10, 156]} text="thin firm core" a="middle" s={10} />
            <Lead p={[cx - 6, y + t + 4]} t={[cx - 40, 76]} text="margins meet at the back" a="middle" s={10} />
          </g>
        )
      })()}

      <Sep x1={330} y1={30} x2={330} y2={180} />
      <Num x={344} y={44} n={3} />
      <T x={358} y={48} s={11.5} c={C.text} w="600">
        Close the loop
      </T>
      {(() => {
        const x = 362
        const y = 92
        const w = 84
        return (
          <g>
            <rect x={x - 10} y={y + 8} width={w + 20} height={11} fill="url(#sk-topS)" stroke={LEDGE} strokeWidth="0.7" />
            <rect x={x - 10} y={y + 19} width={w + 20} height={6} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
            <rect x={x - 10} y={y + 26} width={w + 20} height={11} fill="url(#sk-topS)" stroke={LEDGE} strokeWidth="0.7" />
            <rect x={x - 10} y={y + 37} width={w + 20} height={6} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
            <rect x={x + 26} y={y + 1} width={32} height={49} rx={8} fill="none" stroke="#3d2e22" strokeWidth="7" />
            <rect x={x + 26} y={y + 1} width={32} height={49} rx={8} fill="none" stroke={CR.hi} strokeWidth="0.8" strokeDasharray="5 3" opacity="0.6" />
            <line x1={x + 38} y1={y + 46} x2={x + 46} y2={y + 54} stroke={C.thread} strokeWidth="1.4" />
            <Lead p={[x + 50, y + 54]} t={[x + 70, 166]} text="joint underneath" a="middle" s={10} />
            <Lead p={[x - 6, y + 14]} t={[x - 6, 168]} text="both pieces" a="middle" s={10} />
          </g>
        )
      })()}
      <Sep x1={14} y1={190} x2={466} y2={190} />
      <Note
        x={14}
        y={214}
        s={10.5}
        lh={15}
        head="Why turned"
        hc={C.text}
        lines={[
          'Alligator on its own is too soft to stand alone as a keeper. Skived margins turned',
          'round a thin firm core give a loop that holds its section and shows only grain.',
          'Keeper 5 mm wide, as on the calf strap.',
        ]}
      />
    </Fig>
  )
}

/* 10 · Condition — a reptile cream, buffed off after ~15 min */
function ExCondition() {
  const surf = (x1, x2, y, t = 10) => {
    const seams = []
    for (let x = x1 + 28; x < x2 - 10; x += 34) seams.push(x)
    return { d: crocTopPath(x1, x2, y, t, seams, 3.4, 7), seams }
  }
  const step = (n, x, title, sub, art) => (
    <g>
      <Num x={x + 10} y={46} n={n} />
      <T x={x + 24} y={50} s={11.5} c={C.text} w="600">
        {title}
      </T>
      <T x={x + 4} y={128} s={10} c={C.faint}>
        {sub}
      </T>
      {art}
    </g>
  )
  const S1 = surf(14, 114, 96)
  const S2 = surf(128, 228, 96)
  const S3 = surf(242, 342, 96)
  const S4 = surf(356, 456, 96)
  const film = (x1, x2, y, o = 0.9) => <path d={`M${x1} ${y - 1.5} H${x2}`} stroke="#e6cf8e" strokeWidth="2" opacity={o} />
  return (
    <Fig h={340} view="Sequence + faults · conditioning reptile" scale="section ×10">
      <QXDefs />
      {step(1, 10, 'Apply thinly', 'reptile cream or lanolin', (
        <g>
          <path d={S1.d} fill="url(#qx-crocS)" stroke={CR.edge} strokeWidth="0.7" />
          {film(14, 70, 96)}
          <Dauber x={76} y={94} ang={35} k={0.62} c="#e6cf8e" />
        </g>
      ))}
      {step(2, 124, 'Leave ~15 min', 'it soaks into the tiles', (
        <g>
          <path d={S2.d} fill="url(#qx-crocS)" stroke={CR.edge} strokeWidth="0.7" />
          {[150, 175, 200].map((x) => (
            <Arrow key={x} a={[x, 80]} b={[x, 93]} c="emerald" w={1.3} />
          ))}
          <circle cx={208} cy={66} r={9} fill="none" stroke={C.dim} strokeWidth="1" />
          <path d="M208 60 V66 L212 69" stroke={C.dim} strokeWidth="1" fill="none" />
        </g>
      ))}
      {step(3, 238, 'Buff', 'with a soft cloth', (
        <g>
          <path d={S3.d} fill="url(#qx-crocS)" stroke={CR.edge} strokeWidth="0.7" />
          <path d="M258 90 q14 -14 40 -10 q22 3 28 10 z" fill="#e8e0cf" stroke="#9c927e" strokeWidth="0.8" />
          <Arrow a={[262, 72]} b={[318, 72]} both w={1.4} />
        </g>
      ))}
      {step(4, 352, 'Dry flat', 'flat, away from heat', (
        <g>
          <path d={S4.d} fill="url(#qx-crocS)" stroke={CR.edge} strokeWidth="0.7" />
          <rect x={356} y={106} width={100} height={6} fill="#4b4a49" />
        </g>
      ))}
      <Sep x1={14} y1={146} x2={466} y2={146} />

      <Tag x={14} y={168}>An oil</Tag>
      <Verdict x={214} y={164} ok={false} />
      {(() => {
        const id = uid()
        return (
          <g>
            <clipPath id={`oc${id}`}>
              <rect x={20} y={180} width={200} height={82} rx={4} />
            </clipPath>
            <g clipPath={`url(#oc${id})`}>
              <rect x={20} y={180} width={200} height={82} fill={CR.base} />
              <TileGrid xs={rowsFrom(14, 230, 26, 61)} ys={[176, 196, 220, 244, 266]} seed={13} jit={3} />
              {[[56, 206, 7], [118, 232, 9], [170, 200, 6], [90, 250, 5], [196, 246, 7]].map(([x, y, r], i) => (
                <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.7} fill="rgba(236,232,222,0.55)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.6" />
              ))}
            </g>
          </g>
        )
      })()}
      <T x={20} y={282} s={11} c={C.ruby}>
        white water-stain spots
      </T>
      <T x={20} y={296} s={10} c={C.faint}>
        on alligator — and they stay
      </T>

      <Tag x={256} y={168}>A beeswax-heavy wax</Tag>
      <Verdict x={452} y={164} ok={false} />
      {(() => {
        const cx = 360
        const cy = 420
        const R = 200
        const P = (r, a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)]
        const a0 = -118
        const a1 = -62
        const seg = []
        for (let a = a0; a < a1; a += 9) seg.push(a)
        return (
          <g>
            <path d={`M${P(R - 14, a0).join(' ')} A${R - 14} ${R - 14} 0 0 1 ${P(R - 14, a1).join(' ')} L${P(R, a1).join(' ')} A${R} ${R} 0 0 0 ${P(R, a0).join(' ')} Z`} fill="url(#qx-crocS)" stroke={CR.edge} strokeWidth="0.7" />
            {seg.map((a, i) => {
              const b = a + 7.2
              return (
                <path
                  key={i}
                  d={`M${P(R + 1, a + 0.6).join(' ')} A${R + 1} ${R + 1} 0 0 1 ${P(R + 1, b).join(' ')} L${P(R + 5, b - 0.3).join(' ')} A${R + 5} ${R + 5} 0 0 0 ${P(R + 5, a + 0.9).join(' ')} Z`}
                  fill="#e2cf93"
                  stroke="#9c8a55"
                  strokeWidth="0.5"
                  transform={i === 2 ? `rotate(-6 ${P(R + 3, a).join(' ')}) translate(0 -4)` : undefined}
                />
              )
            })}
            {seg.slice(1).map((a, i) => (
              <path key={i} d={`M${P(R + 7, a - 0.6).join(' ')} l2 -4 l-2 -3`} stroke={C.ruby} strokeWidth="1" fill="none" />
            ))}
          </g>
        )
      })()}
      <T x={256} y={282} s={11} c={C.ruby}>
        sits on top, cracks off
      </T>
      <T x={256} y={296} s={10} c={C.faint}>
        at every flex between the tiles
      </T>
      <Note x={14} y={322} s={10.5} lh={14} lines={['Use a dedicated reptile cream (Saphir Reptan) or lanolin — lightly.']} />
    </Fig>
  )
}

/* Shell cordovan — bought to thickness, folds skived lightly */
function ExShell() {
  const hx = 30
  const hw = 166
  return (
    <Fig h={340} view="Section · horse butt, then the strap" scale="schematic">
      <QXDefs />
      <Tag x={14} y={40}>Horse butt · section</Tag>
      <rect x={hx} y={58} width={hw} height={18} fill="url(#sk-topS)" stroke={LEDGE} strokeWidth="0.8" opacity="0.55" />
      <rect x={hx} y={78} width={hw} height={22} fill="url(#qx-dense)" stroke="#3a1512" strokeWidth="0.8" />
      <rect x={hx} y={102} width={hw} height={34} fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="0.8" opacity="0.55" />
      <rect x={hx} y={102} width={hw} height={34} fill="url(#sk-fibre)" opacity="0.55" />
      <line x1={hx - 8} y1={77} x2={hx + hw + 8} y2={77} stroke={C.ruby} strokeWidth="1" strokeDasharray="5 3" />
      <line x1={hx - 8} y1={101} x2={hx + hw + 8} y2={101} stroke={C.ruby} strokeWidth="1" strokeDasharray="5 3" />
      <Dim a={[hx + hw, 78]} b={[hx + hw, 100]} off={-12} />
      <T x={hx + hw + 20} y={86} s={10.5} mono c={C.text}>
        1–2 mm
      </T>
      <T x={hx + hw + 20} y={99} s={10} c={C.faint}>
        varies by horse
      </T>
      <T x={hx + 8} y={71} s={10.5} c={C.text}>
        grain — split away
      </T>
      <T x={hx + 8} y={93} s={11} c="#f2d6cf" w="600">
        shell: the dense layer
      </T>
      <T x={hx + 8} y={123} s={10.5} c={C.text}>
        corium — split away
      </T>

      <Tag x={300} y={40}>Horse butt · plan</Tag>
      <path d="M306 58 Q306 48 318 48 L440 52 Q462 54 462 80 Q462 106 440 108 L318 112 Q306 112 306 102 Z" fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="0.8" opacity="0.7" />
      <line x1={302} y1={80} x2={466} y2={80} stroke={C.steel} strokeWidth="0.8" strokeDasharray="8 3 2 3" />
      <ellipse cx={402} cy={65} rx={42} ry={11} fill="url(#qx-shell)" stroke="#3a1512" strokeWidth="0.8" />
      <ellipse cx={402} cy={95} rx={42} ry={11} fill="url(#qx-shell)" stroke="#3a1512" strokeWidth="0.8" />
      <T x={312} y={76} s={10} c={C.steel}>
        backbone
      </T>
      <T x={402} y={69} a="middle" s={10} c="#f2d6cf">
        shell
      </T>
      <T x={402} y={99} a="middle" s={10} c="#f2d6cf">
        shell
      </T>
      <Tag x={300} y={136}>Supplier split</Tag>
      {(() => {
        const x1 = 300
        const x2 = 448
        const y = 150
        const t = 18
        const d = []
        for (let x = x1; x <= x2; x += 4) d.push([x, y + t + Math.sin(x * 0.11) * 1.6])
        return (
          <g>
            <rect x={x1} y={y + t - 3} width={x2 - x1} height={6} fill="rgba(123,165,131,0.18)" stroke={C.emerald} strokeWidth="0.6" strokeDasharray="3 2" />
            <polygon points={pts([[x1, y], [x2, y], ...d.reverse()])} fill="url(#qx-shellS)" stroke="#3a1512" strokeWidth="0.8" />
            <Dim a={[x2, y + t - 3]} b={[x2, y + t + 3]} off={-8} />
            <T x={x1} y={y + t + 22} s={10.5} mono c={C.text}>
              ± 0.1–0.2 mm
            </T>
            <T x={x1} y={y + t + 36} s={10} c={C.faint}>
              delicate, at your risk —
            </T>
            <T x={x1} y={y + t + 49} s={10} c={C.faint}>
              buy at near-final thickness
            </T>
          </g>
        )
      })()}

      <Sep x1={14} y1={146} x2={286} y2={146} />
      <Tag x={14} y={166}>The strap · lined</Tag>
      <StrapSection x1={40} x2={250} y={190} s={3.2} k={9} tk="dark" left={{ kind: 'bar' }} right={{ kind: 'break' }} tailSkive={0.72} glue={{ stopL: 10 }} />
      <Lead p={[40 + 9 * 2.6 + 6, 190 + 9.9 + 3]} t={[150, 236]} text="fold skived lightly" a="start" s={10} c={C.brass} />
      <Tag x={14} y={262}>Or unlined · more supple</Tag>
      <StrapSection x1={40} x2={250} y={284} s={3.2} k={9} tk="dark" left={{ kind: 'bar' }} right={{ kind: 'break' }} tailSkive={0.72} noLining />
      <Sep x1={286} y1={232} x2={466} y2={232} />
      <Note
        x={300}
        y={256}
        s={10.5}
        lh={14}
        head="Finish: cordovan-safe only"
        hc={C.ruby}
        lines={['Solvent polishes swell', 'its fibres. Skive only', 'the folds, lightly — it is', 'already near thickness.']}
      />
    </Fig>
  )
}

/* Ostrich — place the template over the quill marks */
function ExOstrich() {
  const id = uid()
  const box = { x: 20, y: 40, w: 440, h: 196 }
  const crown = { x: 200, y: 112, ax: 175, ay: 52 }
  const d = 26
  const q = []
  let i = 0
  for (let y = box.y + 8; y < box.y + box.h; y += d * 0.86, i++) {
    for (let x = box.x + 8 + (i % 2 ? d / 2 : 0); x < box.x + box.w; x += d) {
      const jx = x + (rnd(x * 0.3 + y) - 0.5) * 7
      const jy = y + (rnd(x + y * 0.7) - 0.5) * 7
      const e = ((jx - crown.x) / crown.ax) ** 2 + ((jy - crown.y) / crown.ay) ** 2
      if (e < 1 || rnd(jx * 1.3 + jy * 0.17) < 0.13) q.push([jx, jy])
    }
  }
  const s = 2.2
  const A = { x: 74, y: 112 - 10 * s, w: 120 * s, h: 20 * s }
  const B = { x: 250, y: 214 - 10 * s, w: 80 * s, h: 20 * s }
  const inside = (r, p) => p[0] > r.x + 3 && p[0] < r.x + r.w - 3 && p[1] > r.y + 3 && p[1] < r.y + r.h - 3
  const nA = q.filter((p) => inside(A, p)).length
  const nB = q.filter((p) => inside(B, p)).length
  return (
    <Fig h={330} view="Plan · full-quill ostrich, grain up" scale="true scale ×2.2">
      <QXDefs />
      <clipPath id={`os${id}`}>
        <rect x={box.x} y={box.y} width={box.w} height={box.h} rx={10} />
      </clipPath>
      <g clipPath={`url(#os${id})`}>
        <rect x={box.x} y={box.y} width={box.w} height={box.h} fill="url(#qx-ost)" />
        <ellipse cx={crown.x} cy={crown.y} rx={crown.ax} ry={crown.ay} fill="rgba(255,240,210,0.06)" stroke="rgba(255,240,210,0.25)" strokeDasharray="5 4" />
        {q.map(([x, y], k) => (
          <g key={k}>
            <circle cx={x} cy={y} r={4.6} fill="#a8865f" stroke="#5a4029" strokeWidth="0.7" />
            <circle cx={x - 1} cy={y - 1} r={1.8} fill="#4a3524" />
          </g>
        ))}
      </g>
      <rect x={A.x} y={A.y} width={A.w} height={A.h} rx={3} fill="none" stroke={C.emerald} strokeWidth="1.6" strokeDasharray="6 3" />
      {q.filter((p) => inside(A, p)).map(([x, y], k) => (
        <circle key={k} cx={x} cy={y} r={7.5} fill="none" stroke={C.emerald} strokeWidth="1" />
      ))}
      <rect x={B.x} y={B.y} width={B.w} height={B.h} rx={3} fill="none" stroke={C.ruby} strokeWidth="1.6" strokeDasharray="6 3" />
      <Verdict x={A.x + A.w + 14} y={A.y - 2} ok r={8} />
      <Verdict x={B.x + B.w + 14} y={B.y - 2} ok={false} r={8} />
      <Lead p={[A.x + A.w / 2, A.y]} t={[240, 30]} text={`long piece on the crown: ${nA} marks`} a="middle" c={C.emerald} s={10.5} />
      <Lead p={[B.x + 40, B.y + B.h]} t={[300, 254]} text={`short piece off it: ${nB} marks`} a="start" c={C.ruby} s={10.5} />
      <Lead p={[crown.x + crown.ax - 12, crown.y - 18]} t={[460, 30]} text="crown · densest quills" a="end" s={10} c={C.dim} />
      <Lead p={[q[0][0], q[0][1]]} t={[36, 30]} text="quill mark" a="start" s={10} />
      <Dim a={[A.x, A.y]} b={[A.x + A.w, A.y]} off={-8} />
      <Sep x1={14} y1={268} x2={466} y2={268} />
      <Note
        x={14}
        y={288}
        s={10.5}
        lh={14}
        head="At least five quill marks per strap"
        hc={C.text}
        lines={['Line with soft, moisture-resistant leather; reinforce with a Velodon such as SH-220.']}
      />
    </Fig>
  )
}

/* ================================================================== */
/* Fit, wear, care & faults                                             */
/* ================================================================== */

// Strap edge seen side-on at the lug fold: the loop, body and lining as an
// edge face. paintFrom = x where the edge paint starts (null = paint all).
function FoldSide({ cx, cy, r, t, tl, xR, paintFrom, cracks }) {
  const id = uid()
  const y1 = cy - r
  const cv = r * 2.6
  const tail = r * 3.6
  const ts = t * 0.45
  const B = cy + r + t
  const R = r + t
  const outer =
    `M${cx} ${y1 - t} A${R} ${R} 0 0 0 ${cx} ${B} ` +
    `C${cx + cv * 0.55} ${B} ${cx + cv * 0.62} ${y1 + ts} ${cx + cv} ${y1 + ts} L${cx + cv + tail} ${y1} L${cx} ${y1} Z`
  const hole = `M${cx} ${y1} A${r} ${r} 0 0 0 ${cx} ${cy + r} C${cx + cv * 0.55} ${cy + r} ${cx + cv * 0.62} ${y1} ${cx + cv} ${y1} Z`
  const shape = [
    <path key="w" d={`${outer} ${hole}`} clipRule="evenodd" />,
    <rect key="b" x={cx} y={y1 - t} width={xR - cx} height={t} />,
    <rect key="l" x={cx + cv + 2} y={y1} width={xR - cx - cv - 2} height={tl + 2} />,
  ]
  const all = paintFrom == null
  return (
    <g>
      <clipPath id={`fs${id}`}>{shape}</clipPath>
      <g clipPath={`url(#fs${id})`}>
        <rect x={cx - R - 4} y={y1 - t - 4} width={xR - cx + R + 8} height={2 * R + 12} fill="url(#sk-flesh)" />
        <rect x={cx - R - 4} y={y1 + 2} width={xR - cx + R + 8} height={tl} fill="#e6d8bb" />
        <rect x={all ? cx - R - 4 : paintFrom} y={y1 - t - 4} width={xR - (all ? cx - R - 4 : paintFrom)} height={2 * R + 12} fill={C.paint} />
        <line x1={all ? cx - R : paintFrom} y1={y1 - t + 1.5} x2={xR} y2={y1 - t + 1.5} stroke="#7a5638" strokeWidth="0.8" />
        {cracks &&
          Array.from({ length: 9 }, (_, i) => {
            const a = ((100 + i * 20) * Math.PI) / 180
            const p = (rr) => [cx + rr * Math.cos(a), cy + rr * Math.sin(a)]
            const q = (rr, d) => [cx + rr * Math.cos(a + d), cy + rr * Math.sin(a + d)]
            const [x1, y1a] = p(r + 1)
            const [x2, y2] = q(r + t * 0.5, 0.05)
            const [x3, y3] = p(r + t + 1)
            return <polyline key={i} points={`${x1},${y1a} ${x2},${y2} ${x3},${y3}`} fill="none" stroke="#e6c999" strokeWidth="1.1" />
          })}
        {cracks &&
          [150, 215].map((deg) => {
            const a = (deg * Math.PI) / 180
            const P = (rr, d) => [cx + rr * Math.cos(a + d), cy + rr * Math.sin(a + d)]
            return <polygon key={deg} points={pts([P(r + 2, -0.08), P(r + t - 1, -0.12), P(r + t - 1, 0.1), P(r + 3, 0.07)])} fill="url(#sk-flesh)" />
          })}
      </g>
      <path d={`${outer} ${hole}`} fill="none" stroke={LEDGE} strokeWidth="0.8" />
      <rect x={cx} y={y1 - t} width={xR - cx} height={t} fill="none" stroke={LEDGE} strokeWidth="0.8" />
      <rect x={cx + cv + 2} y={y1 + 2} width={xR - cx - cv - 2} height={tl} fill="none" stroke="#8f7b5a" strokeWidth="0.7" />
    </g>
  )
}

/* Fit the bars — from the underside, then check the pivot */
function FitBars() {
  const s = 7
  const gap = 20 * s
  const lx = 62
  const rx = lx + gap
  const yb = 120
  const r = 0.9 * s
  const pl = r * 1.25
  return (
    <Fig h={330} view="Underside + side view · fitting the bars" scale="true scale ×7">
      <Tag x={14} y={36}>Underside · bar going in</Tag>
      <rect x={30} y={46} width={204} height={22} rx={10} fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.8" />
      <T x={132} y={61} a="middle" s={10} c="#2d3940">
        case back
      </T>
      <rect x={lx - 16} y={62} width={16} height={84} rx={6} fill="url(#sk-steelH)" stroke={STEEL_EDGE} strokeWidth="0.8" />
      <rect x={rx} y={62} width={16} height={84} rx={6} fill="url(#sk-steelH)" stroke={STEEL_EDGE} strokeWidth="0.8" />
      <rect x={lx + 2} y={yb - 10} width={gap - 4} height={76} fill="url(#sk-lin)" stroke={C.liningEdge} strokeWidth="0.8" />
      <path d={`M${lx + 2} ${yb + 66} l${(gap - 4) / 4} -5 l${(gap - 4) / 4} 5 l${(gap - 4) / 4} -5 l${(gap - 4) / 4} 5`} fill="none" stroke={C.dim} strokeWidth="1" />
      <QRBar x={lx} y={yb} L={gap} r={r} kx={0} ghost knob={false} slot={false} retract={pl - 1} />
      <rect x={lx - pl} y={yb - r * 0.5} width={pl + 2} height={r} rx={1.5} fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.6" />
      <rect x={rx - 3} y={yb - r * 0.5} width={3} height={r} rx={1} fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.6" />
      <circle cx={rx + 5} cy={yb} r={3.4} fill={C.ground} stroke="#9fb4c2" strokeWidth="0.8" strokeDasharray="1.5 1" />
      <BarTool x={rx - 6} y={yb + r - 1} ang={200} />
      <Arrow a={[rx - 4, yb - 14]} b={[rx - 24, yb - 14]} w={1.8} />
      <Dim a={[lx, 84]} b={[rx, 84]} text="lug width 20 = bar 20" />
      <Lead p={[lx - 4, yb]} t={[24, 214]} text="far pin home in its lug hole" a="start" s={10} />
      <Lead p={[rx - 9, yb + 10]} t={[244, 240]} text="fork on the shoulder" a="end" sub="compress, align with the hole, release" />
      <Lead p={[rx + 5, yb]} t={[244, 200]} text="lug hole" a="end" s={10} />
      <T x={24} y={286} s={10.5} c={C.text}>
        Work from the underside:
      </T>
      <T x={24} y={300} s={10} c={C.faint}>
        the tool never touches the polished lug tops.
      </T>
      <T x={24} y={314} s={10} c={C.faint}>
        Bar Ø to suit the lug holes.
      </T>

      <Sep x1={256} y1={30} x2={256} y2={316} />
      <Tag x={268} y={36}>Side view · pivot check</Tag>
      {(() => {
        const bx = 344
        const by = 150
        const k = 7
        const rr = 0.9 * k + 0.6
        const t = 1.1 * k
        return (
          <g>
            <CaseSide x={bx} y={by} s={k} gap={3} len={8} />
            <g opacity="0.35" transform={`rotate(38 ${bx} ${by})`}>
              <QRLoop cx={bx} cy={by} r={rr} t={t} xR={bx + 116} tl={0.6 * k} />
            </g>
            <QRLoop cx={bx} cy={by} r={rr} t={t} xR={466} tl={0.6 * k} open />
            <BarEnd cx={bx} cy={by} r={0.9 * k} />
            <Arrow d={`M${bx + 112} ${by - 14} A112 112 0 0 1 ${bx + 90} ${by + 62}`} c="emerald" w={1.8} both />
            <Lead p={[bx - 3 * k + 2, by + 4]} t={[268, 254]} text="no binding on the case" a="start" c={C.emerald} sub="the fold clears the flank" />
            <Lead p={[bx + 96, by + 40]} t={[452, 222]} text="swings freely" a="end" c={C.emerald} />
            <Lead p={[bx, by]} t={[330, 82]} text="bar in the loop" a="middle" s={10} c={C.steel} />
            <T x={268} y={300} s={10.5} c={C.dim}>
              Bars chosen for the lug width;
            </T>
            <T x={268} y={314} s={10.5} c={C.dim}>
              tug the strap to check both ends.
            </T>
          </g>
        )
      })()}
    </Fig>
  )
}

/* Check on the wrist — buckle at the side, holes spare both ways */
function FitWrist() {
  const cx = 138
  const cy = 182
  const rx = 84
  const ry = 58
  const R = [rx + 7, ry + 7]
  const E = (a, d = 0) => [cx + (R[0] + d) * Math.cos((a * Math.PI) / 180), cy + (R[1] + d) * Math.sin((a * Math.PI) / 180)]
  const arc = (a0, a1, d = 0) => {
    const p = []
    const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 3))
    for (let i = 0; i <= n; i++) p.push(E(a0 + ((a1 - a0) * i) / n, d))
    return 'M' + p.map((q) => q.map((v) => v.toFixed(1)).join(' ')).join(' L')
  }
  const piece = (a0, a1, d = 0) => (
    <g>
      <path d={arc(a0, a1, d)} fill="none" stroke="#3a2614" strokeWidth="7.4" strokeLinecap="butt" />
      <path d={arc(a0, a1, d)} fill="none" stroke="#a8763f" strokeWidth="5.6" strokeLinecap="butt" />
      <path d={arc(a0, a1, d - 2)} fill="none" stroke="#e2d2b3" strokeWidth="1.5" />
    </g>
  )
  const ab = 10 // buckle angle
  const keeper = (a, float) => {
    const [x, y] = E(a, 3)
    return <rect x={x - 5} y={y - 9} width={10} height={18} rx={3} fill="none" stroke={float ? '#c9a06a' : '#e0b277'} strokeWidth="2.2" transform={`rotate(${a} ${x} ${y})`} />
  }
  const [bxx, byy] = E(ab, 3)
  const TP = { x: 300 - 50 * 2.3, y: 150, s: 2.3 }
  const o = LONG({ x0: 50 })
  const hx = (x) => px(TP, x, 0)[0]
  return (
    <Fig h={320} view="Section through wrist + plan · the fit" scale="schematic · plan ×2.3">
      <Tag x={14} y={36}>Section across the wrist</Tag>
      <Wrist cx={cx} cy={cy} rx={rx} ry={ry} />
      {piece(-120, -352)}
      {piece(-60, ab)}
      {piece(ab, -38, 7)}
      <rect x={cx - 46} y={cy - ry - 30} width={92} height={20} rx={6} fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.8" />
      <path d={`M${cx - 40} ${cy - ry - 30} Q${cx} ${cy - ry - 44} ${cx + 40} ${cy - ry - 30} Z`} fill="url(#sk-glass)" stroke={C.steel} strokeWidth="0.8" />
      <rect x={bxx - 4} y={byy - 13} width={22} height={26} rx={5} fill="none" stroke="url(#sk-steelH)" strokeWidth="3.4" transform={`rotate(${ab} ${bxx} ${byy})`} />
      {keeper(-6, false)}
      {keeper(-22, true)}
      <Lead p={[cx - 30, cy - ry - 34]} t={[60, 58]} text="watch head on top" a="middle" s={10} />
      <Lead p={[bxx + 16, byy + 4]} t={[282, 252]} text="buckle at the side" a="end" c={C.emerald} sub="not under the wrist" />
      <Lead p={E(-14, 12)} t={[282, 104]} text="tail through" a="end" sub="both keepers" />
      <Lead p={E(150)} t={[24, 274]} text="long piece" a="start" s={10} />
      <Lead p={E(-50)} t={[200, 62]} text="short piece" a="start" s={10} />
      <T x={cx} y={cy + 4} a="middle" s={10} c={C.faint}>
        wrist
      </T>

      <Sep x1={290} y1={30} x2={290} y2={306} />
      <Tag x={300} y={36}>Long piece · the holes</Tag>
      <StrapPlan T={TP} o={o} holes={{}} />
      <Brk x={hx(50)} y={TP.y - 25} h={50} />
      <circle cx={hx(74)} cy={TP.y} r={6} fill="none" stroke={C.emerald} strokeWidth="1.6" />
      <Lead p={[hx(74), TP.y - 6]} t={[hx(74), 100]} text="in use" a="middle" c={C.emerald} />
      <Arrow a={[hx(70), TP.y + 34]} b={[hx(51), TP.y + 34]} w={1.4} />
      <Arrow a={[hx(78), TP.y + 34]} b={[hx(97), TP.y + 34]} w={1.4} />
      <T x={hx(60)} y={TP.y + 52} a="middle" s={10.5} c={C.brass}>
        3 spare
      </T>
      <T x={hx(88)} y={TP.y + 52} a="middle" s={10.5} c={C.brass}>
        3 spare
      </T>
      <T x={hx(60)} y={TP.y + 66} a="middle" s={10} c={C.faint}>
        tighter
      </T>
      <T x={hx(88)} y={TP.y + 66} a="middle" s={10} c={C.faint}>
        looser
      </T>
      <Note x={300} y={258} s={10.5} lh={14} lines={['Middle hole in use:', 'room to adjust for heat,', 'cold and a swollen wrist.']} />
    </Fig>
  )
}

/* Break it in — the strap takes the wrist's curve over days */
function FitBreakin() {
  const x0 = 120
  const y0 = 84
  const L = 236
  const curve = (k, d = 0) => {
    const p = []
    for (let i = 0; i <= 40; i++) {
      const sArc = (L * i) / 40
      let x
      let y
      if (k < 1e-6) {
        x = x0 + sArc
        y = y0
      } else {
        x = x0 + Math.sin(k * sArc) / k
        y = y0 + (1 - Math.cos(k * sArc)) / k
      }
      const th = k * sArc
      p.push([x - Math.sin(th) * d, y + Math.cos(th) * d])
    }
    return p
  }
  const strap = (k, o) => (
    <g opacity={o}>
      <polyline points={pts(curve(k))} fill="none" stroke="#3a2614" strokeWidth="8.4" />
      <polyline points={pts(curve(k))} fill="none" stroke="#a8763f" strokeWidth="6.6" />
      <polyline points={pts(curve(k, 2.6))} fill="none" stroke="#e2d2b3" strokeWidth="1.6" />
    </g>
  )
  const kw = 1 / 92
  const end = (k) => curve(k)[40]
  return (
    <Fig h={310} view="Side view · the long piece, off the wrist" scale="schematic">
      <ellipse cx={x0} cy={y0 + 92 + 4} rx={86} ry={88} fill="rgba(214,170,140,0.08)" stroke="#a57e66" strokeWidth="1" strokeDasharray="5 4" />
      <T x={x0} y={y0 + 100} a="middle" s={10} c={C.faint}>
        the wearer's wrist
      </T>
      {strap(0.0012, 0.4)}
      {strap(0.0052, 0.7)}
      {strap(kw, 1)}
      <rect x={x0 - 40} y={y0 - 12} width={36} height={14} rx={4} fill="url(#sk-steel)" stroke={STEEL_EDGE} strokeWidth="0.8" />
      <BarEnd cx={x0} cy={y0} r={4} />
      <T x={x0 - 22} y={y0 - 18} a="middle" s={10} c={C.faint}>
        lug end
      </T>
      <Lead p={end(0.0012)} t={[364, 52]} text="day 1" sub="firm, springs open" />
      <Lead p={end(0.0052)} t={[318, 150]} text="≈ 1 week" sub="softer, half-curved" />
      <Lead p={end(kw)} t={[204, 276]} text="≈ 2 weeks" c={C.emerald} sub="it has taken the wrist's curve" />
      <Sep x1={348} y1={180} x2={466} y2={180} />
      <T x={360} y={198} s={11.5} c={C.ruby} w="600">
        Don’t force it
      </T>
      <HeatGunMini x={372} y={220} />
      <T x={392} y={224} s={10.5}>
        no heat
      </T>
      <path d="M372 236 q-6 9 0 13 q6 -4 0 -13 Z" fill={C.steel} opacity="0.8" />
      <path d="M364 236 l16 14 M380 236 l-16 14" stroke={C.ruby} strokeWidth="1.4" />
      <T x={392} y={248} s={10.5}>
        no soaking
      </T>
      <T x={360} y={270} s={10} c={C.faint}>
        just wear it —
      </T>
      <T x={360} y={283} s={10} c={C.faint}>
        a week or two
      </T>
    </Fig>
  )
}

const HeatGunMini = ({ x, y }) => (
  <g>
    <rect x={x - 8} y={y - 10} width={14} height={9} rx={2} fill="#b5413f" />
    <rect x={x + 6} y={y - 8} width={6} height={5} fill="url(#sk-steelH)" />
    <rect x={x - 6} y={y - 1} width={5} height={8} rx={1.5} fill="#b5413f" />
    <path d={`M${x - 10} ${y - 12} l22 20 M${x + 12} ${y - 12} l-22 20`} stroke={C.ruby} strokeWidth="1.4" />
  </g>
)

/* Care — dry, aired, rotated; conditioned every 2–3 months */
function FitCare() {
  const W = 148
  const H = 132
  const tiles = [
    [14, 34],
    [166, 34],
    [318, 34],
    [14, 178],
    [166, 178],
    [318, 178],
  ]
  const frame = ([x, y], title, l1, l2) => (
    <g>
      <rect x={x} y={y} width={W} height={H} rx={8} fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <T x={x + 10} y={y + 18} s={11.5} c={C.text} w="600">
        {title}
      </T>
      <T x={x + 10} y={y + H - 22} s={10}>
        {l1}
      </T>
      <T x={x + 10} y={y + H - 9} s={10} c={C.faint}>
        {l2}
      </T>
    </g>
  )
  const drop = (x, y, c = C.steel) => <path d={`M${x} ${y - 7} q-5 7 0 10 q5 -3 0 -10 Z`} fill={c} opacity="0.85" />
  const strapPiece = (x, y, w, fill = 'url(#sk-topS)') => (
    <g>
      <rect x={x} y={y} width={w} height={8} fill={fill} stroke={LEDGE} strokeWidth="0.7" />
      <rect x={x} y={y + 8} width={w} height={5} fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.7" />
    </g>
  )
  const [t1, t2, t3, t4, t5, t6] = tiles
  return (
    <Fig h={322} view="Care · six habits" scale="schematic">
      {frame(t1, 'Keep it dry', 'swimming: a rubber strap', 'water swells and stains')}
      {strapPiece(t1[0] + 12, t1[1] + 54, 56)}
      {drop(t1[0] + 26, t1[1] + 42)}
      {drop(t1[0] + 44, t1[1] + 36)}
      {drop(t1[0] + 58, t1[1] + 46)}
      <Verdict x={t1[0] + 40} y={t1[1] + 88} ok={false} r={8} />
      <rect x={t1[0] + 84} y={t1[1] + 54} width={52} height={12} rx={5} fill="#2f3337" stroke="#111" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={t1[0] + 92 + i * 9} y1={t1[1] + 56} x2={t1[0] + 92 + i * 9} y2={t1[1] + 64} stroke="#4d5359" strokeWidth="1.2" />
      ))}
      {drop(t1[0] + 100, t1[1] + 42)}
      {drop(t1[0] + 120, t1[1] + 38)}
      <Verdict x={t1[0] + 110} y={t1[1] + 88} ok r={8} />

      {frame(t2, 'Air it', 'between wears, buckle open', 'so sweat can dry out')}
      <line x1={t2[0] + 30} y1={t2[1] + 36} x2={t2[0] + 118} y2={t2[1] + 36} stroke="url(#sk-steelH)" strokeWidth="3" />
      <rect x={t2[0] + 50} y={t2[1] + 37} width={11} height={56} fill="url(#sk-top)" stroke={LEDGE} strokeWidth="0.7" />
      <rect x={t2[0] + 82} y={t2[1] + 37} width={11} height={44} fill="url(#sk-top)" stroke={LEDGE} strokeWidth="0.7" />
      {[50, 66, 82].map((yy, i) => (
        <Arrow key={i} d={`M${t2[0] + 22} ${t2[1] + yy} q14 -6 28 0 t28 0 t28 0 t28 0`} c="steel" w={1.2} o={0.8} />
      ))}

      {frame(t3, 'Rotate', 'two or three straps', 'each gets days to dry out')}
      {(() => {
        const c = [t3[0] + 74, t3[1] + 62]
        const P = (a, r) => [c[0] + r * Math.cos((a * Math.PI) / 180), c[1] + r * Math.sin((a * Math.PI) / 180)]
        const fills = ['url(#sk-top)', 'url(#sk-dark)', 'url(#sk-scale)']
        return (
          <g>
            {[-90, 30, 150].map((a, i) => {
              const [x, y] = P(a, 26)
              return <rect key={i} x={x - 18} y={y - 5} width={36} height={10} rx={4} fill={fills[i]} stroke="#2a1a0c" strokeWidth="0.7" />
            })}
            {[-30, 90, 210].map((a, i) => (
              <Arrow key={i} d={`M${P(a - 30, 34).join(' ')} A34 34 0 0 1 ${P(a + 22, 34).join(' ')}`} w={1.3} />
            ))}
          </g>
        )
      })()}

      {frame(t4, 'Clean, then condition', 'damp cloth first, then a', 'thin coat — buff off the rest')}
      {strapPiece(t4[0] + 14, t4[1] + 62, 120)}
      <path d={`M${t4[0] + 22} ${t4[1] + 58} q10 -16 30 -12 q10 3 8 12 z`} fill="#dfe6ea" stroke="#9fb0bc" strokeWidth="0.7" />
      <Num x={t4[0] + 40} y={t4[1] + 36} n={1} r={7} />
      <path d={`M${t4[0] + 86} ${t4[1] + 61} H${t4[0] + 134}`} stroke="#e6cf8e" strokeWidth="2" />
      <Dauber x={t4[0] + 100} y={t4[1] + 60} ang={25} k={0.55} c="#e6cf8e" />
      <Num x={t4[0] + 126} y={t4[1] + 36} n={2} r={7} />

      {frame(t5, 'Only when it needs it', 'when dry or stiff: about', 'every 2–3 months, never daily')}
      {(() => {
        const x1 = t5[0] + 14
        const x2 = t5[0] + 134
        const y = t5[1] + 66
        const m = (mo) => x1 + ((x2 - x1) * mo) / 12
        return (
          <g>
            <line x1={x1} y1={y} x2={x2} y2={y} stroke={C.dim} strokeWidth="1" />
            {Array.from({ length: 13 }, (_, i) => (
              <line key={i} x1={m(i)} y1={y - (i % 3 === 0 ? 5 : 3)} x2={m(i)} y2={y + (i % 3 === 0 ? 5 : 3)} stroke={C.dim} strokeWidth="0.8" />
            ))}
            {[0, 2.5, 5, 7.5, 10].map((mo) => (
              <circle key={mo} cx={m(mo)} cy={y} r={4} fill="#e6cf8e" stroke="#8a7440" />
            ))}
            <T x={x1} y={y + 18} s={10} c={C.faint}>
              0
            </T>
            <T x={x2} y={y + 18} a="end" s={10} c={C.faint}>
              12 months
            </T>
            <path d={`M${x1} ${y - 22} h40`} stroke={C.ruby} strokeWidth="1.4" strokeDasharray="1 3" />
            <T x={x1 + 46} y={y - 18} s={10} c={C.ruby}>
              daily: too much
            </T>
          </g>
        )
      })()}

      {frame(t6, 'Wax or spray', 'adds water resistance —', 'but does not feed the leather')}
      {strapPiece(t6[0] + 14, t6[1] + 64, 120)}
      <line x1={t6[0] + 14} y1={t6[1] + 63} x2={t6[0] + 134} y2={t6[1] + 63} stroke="#cfe3ea" strokeWidth="2" opacity="0.7" />
      {[34, 60, 88, 112].map((dx, i) => (
        <ellipse key={i} cx={t6[0] + dx} cy={t6[1] + 57} rx={5.5} ry={4.5} fill="rgba(134,167,189,0.55)" stroke={C.steel} strokeWidth="0.7" />
      ))}
      <T x={t6[0] + 74} y={t6[1] + 44} a="middle" s={10} c={C.steel}>
        water beads, stays out
      </T>
    </Fig>
  )
}

/* Fault · wrinkles across the top */
function FaultWrinkle() {
  const TP = { x: 40, y: 98, s: 3.2 }
  const arcStack = (cx, cy, R, wrinkle, a0 = -140, a1 = -40) => {
    const P = (rr, a) => [cx + rr * Math.cos((a * Math.PI) / 180), cy + rr * Math.sin((a * Math.PI) / 180)]
    const band = (r1, r2, fill, stroke) => (
      <path d={`M${P(r1, a0).join(' ')} A${r1} ${r1} 0 0 1 ${P(r1, a1).join(' ')} L${P(r2, a1).join(' ')} A${r2} ${r2} 0 0 0 ${P(r2, a0).join(' ')} Z`} fill={fill} stroke={stroke} strokeWidth="0.8" />
    )
    let grain = null
    if (wrinkle) {
      const p = []
      for (let a = a0; a <= a1; a += 1.5) p.push(P(R + 11 + Math.sin((a - a0) * 0.9) * 1.8, a))
      grain = <polyline points={pts(p)} fill="none" stroke="#4a2f16" strokeWidth="1.8" />
    }
    return (
      <g>
        {band(R + 11, R, 'url(#sk-topS)', LEDGE)}
        {band(R, R - 6, 'url(#sk-linS)', '#8f7b5a')}
        {grain}
      </g>
    )
  }
  return (
    <Fig h={330} view="Plan + section · the fault and its cause" scale="schematic">
      <Tag x={14} y={36}>The symptom · top face</Tag>
      <StrapPlan T={TP} o={LONG()} stitch={{ m: 3, p: 3, from: 5 }} holes={{}} />
      {Array.from({ length: 12 }, (_, i) => {
        const x = TP.x + (10 + i * 4.2) * TP.s
        return <path key={i} d={`M${x} ${TP.y - 26} q3 13 0 26 q-3 13 0 26`} fill="none" stroke="#5a3a1c" strokeWidth={1.3 - i * 0.05} opacity={0.9 - i * 0.05} />
      })}
      <Lead p={[TP.x + 22 * TP.s, TP.y - 30]} t={[200, 40]} text="fine creases across the top face" c={C.ruby} sub="worst where the strap bends most" />
      <Sep x1={14} y1={146} x2={466} y2={146} />

      <Tag x={14} y={160}>Cause · glued flat, bent</Tag>
      <Verdict x={222} y={156} ok={false} />
      <Ply x1={34} x2={210} y={176} t={9} />
      <GlueLine x1={36} x2={208} y={185.5} />
      <Ply x1={34} x2={210} y={186} t={6} k="lining" />
      <T x={122} y={207} a="middle" s={10} c={C.faint}>
        bonded flat, then curled to the wrist
      </T>
      <Arrow a={[122, 210]} b={[122, 226]} w={1.6} />
      {arcStack(122, 360, 104, true, -130, -50)}
      <Arrow a={[60, 246]} b={[84, 238]} c="ruby" w={1.6} />
      <Arrow a={[184, 246]} b={[160, 238]} c="ruby" w={1.6} />
      <T x={122} y={300} a="middle" s={10.5} c={C.ruby}>
        the outer layer is squeezed: it buckles
      </T>

      <Sep x1={240} y1={150} x2={240} y2={326} />
      <Tag x={254} y={160}>Fix · boat the long lining</Tag>
      <Verdict x={452} y={156} ok />
      <Bottle cx={356} cy={344} r={96} />
      {arcStack(356, 344, 103, false)}
      <Arrow d="M282 244 q-10 8 -10 22" c="emerald" w={1.5} />
      <Arrow d="M430 244 q10 8 10 22" c="emerald" w={1.5} />
      <T x={356} y={196} a="middle" s={10} c={C.dim}>
        lining stretched round the former,
      </T>
      <T x={356} y={209} a="middle" s={10} c={C.dim}>
        top bonded over it in the curve
      </T>
      <T x={356} y={290} a="middle" s={10.5} c="#8fbcae">
        bonded round a former
      </T>
      <T x={356} y={304} a="middle" s={10} c={C.faint}>
        born curved — Rule 2
      </T>
    </Fig>
  )
}

/* Fault · cracked edge paint at the fold */
function FaultCrack() {
  const k = 9
  const r = 0.9 * k + 0.5
  const t = 1.1 * k
  const tl = 0.6 * k
  return (
    <Fig h={330} view="Side view + section · paint on the fold" scale="side ×9 · section ×12">
      <Tag x={14} y={36}>Paint on the fold spine</Tag>
      <Verdict x={222} y={32} ok={false} />
      <FoldSide cx={60} cy={96} r={r} t={t} tl={tl} xR={226} cracks />
      <BarEnd cx={60} cy={96} r={0.9 * k} />
      <Lead p={[60 - r - t / 2, 96]} t={[24, 156]} text="paint cracked on the spine" a="start" c={C.ruby} sub="flexes at every wear" />
      <Lead p={[160, 96 - r - t / 2]} t={[160, 50]} text="painted edge" a="middle" s={10} />

      <Sep x1={240} y1={26} x2={240} y2={184} />
      <Tag x={254} y={36}>Paint stops at the fold</Tag>
      <Verdict x={452} y={32} ok />
      <FoldSide cx={290} cy={96} r={r} t={t} tl={tl} xR={460} paintFrom={290 + r * 2.6 + 6} />
      <BarEnd cx={290} cy={96} r={0.9 * k} />
      <Lead p={[290 - r - t / 2, 96]} t={[254, 156]} text="fold left bare" a="start" c={C.emerald} sub="gum or Tokonole only" />
      <Lead p={[290 + r * 2.6 + 6, 96 - r - t / 2]} t={[380, 50]} text="paint starts here" a="middle" s={10} />
      <Sep x1={14} y1={184} x2={466} y2={184} />

      <Tag x={14} y={204}>The edge itself · section</Tag>
      <Verdict x={222} y={200} ok={false} />
      <XSec cx={124} y={226} w={150} layers={[{ k: 'top', t: 13 }, { k: 'lining', t: 8 }]} edge="paint" b={8} coat={6} />
      <T x={124} y={276} a="middle" s={10.5} c={C.ruby}>
        big bevel, one thick coat
      </T>
      <T x={124} y={290} a="middle" s={10} c={C.faint}>
        the coat bridges a step and splits
      </T>
      <Sep x1={240} y1={194} x2={240} y2={316} />
      <Tag x={254} y={204}>Small bevel, thin coats</Tag>
      <Verdict x={452} y={200} ok />
      <XSec cx={360} y={226} w={150} layers={[{ k: 'top', t: 13 }, { k: 'lining', t: 8 }]} edge="paint" b={3.5} coat={2.4} />
      <T x={360} y={276} a="middle" s={10.5} c={C.emerald}>
        0.5–0.7 mm bevel, 3–4 thin coats
      </T>
      <T x={360} y={290} a="middle" s={10} c={C.faint}>
        sanded between, flexes with the leather
      </T>
      <Note x={14} y={316} s={10.5} lh={14} lines={['Rule 3: nothing rigid in a flex zone — the fold spine flexes every time the strap is worn.']} />
    </Fig>
  )
}

/* Fault · stretched holes */
function FaultStretch() {
  const TP = { x: -86, y: 98, s: 3.6 }
  const o = LONG({ x0: 40 })
  const hx = (x) => px(TP, x, 0)[0]
  const worn = 74
  const d = 1.8 * TP.s
  const hid = uid()
  return (
    <Fig h={340} view="Plan · the fault and its causes" scale="plan ×3.6">
      <Tag x={14} y={36}>The symptom · long piece</Tag>
      <StrapPlan T={TP} o={o} holes={{ xs: [95, 88, 81, 67, 60, 53] }} />
      <Brk x={hx(40)} y={TP.y - 36} h={72} />
      <rect x={hx(worn) - d / 2} y={TP.y - d / 2} width={d + 2.4 * TP.s} height={d} rx={d / 2} fill={C.hole} stroke={C.ruby} strokeWidth="1.2" />
      <line x1={hx(worn) + 0.6 * TP.s} y1={TP.y} x2={hx(worn) + 5 * TP.s} y2={TP.y} stroke="#d9e3e9" strokeWidth="2.6" strokeLinecap="round" />
      <T x={hx(worn) + 6 * TP.s} y={TP.y - 6} s={10} c="#d9e3e9">
        tongue
      </T>
      <Arrow a={[hx(worn) + 4, TP.y + 22]} b={[hx(worn) + 42, TP.y + 22]} w={1.8} />
      <Lead p={[hx(worn) + 2, TP.y - 4]} t={[250, 40]} text="the hole worn most" a="start" c={C.ruby} sub="elongated toward the buckle" />
      <Lead p={[hx(worn) + 30, TP.y + 22]} t={[hx(worn) + 72, 148]} text="the tongue drags it this way" a="start" s={10} c={C.brass} />
      <Inset at={[hx(worn) + 3, TP.y]} r0={12} c={[414, 98]} R={44}>
        <rect x={384} y={87} width={50} height={22} rx={11} fill={C.hole} stroke={C.ruby} strokeWidth="1.4" />
        <circle cx={395} cy={98} r={11} fill="none" stroke="#e7c48f" strokeWidth="1.2" strokeDasharray="3 2" />
        <T x={414} y={78} a="middle" s={10} c="#e7c48f">
          was round
        </T>
      </Inset>
      <Sep x1={14} y1={156} x2={466} y2={156} />

      <Tag x={14} y={176}>Along the backbone, off the belly</Tag>
      {(() => {
        const ox = 30
        const oy = 190
        const path = `M${ox + 6} ${oy + 30} Q${ox + 10} ${oy} ${ox + 50} ${oy + 4} L${ox + 170} ${oy + 2} Q${ox + 214} ${oy} ${ox + 218} ${oy + 30}
          L${ox + 214} ${oy + 92} Q${ox + 210} ${oy + 120} ${ox + 170} ${oy + 116} L${ox + 50} ${oy + 118} Q${ox + 8} ${oy + 120} ${ox + 6} ${oy + 92} Z`
        return (
          <g>
            <clipPath id={`hd${hid}`}>
              <path d={path} />
            </clipPath>
            <path d={path} fill="url(#sk-flesh)" stroke="#9c7c52" strokeWidth="0.9" />
            <g clipPath={`url(#hd${hid})`}>
              <rect x={ox} y={oy} width={224} height={26} fill="rgba(194,88,99,0.22)" />
              <rect x={ox} y={oy + 94} width={224} height={30} fill="rgba(194,88,99,0.22)" />
            </g>
            <line x1={ox} y1={oy + 60} x2={ox + 224} y2={oy + 60} stroke={C.steel} strokeWidth="1" strokeDasharray="10 3 2 3" />
            <rect x={ox + 40} y={oy + 44} width={110} height={11} fill="none" stroke={C.emerald} strokeWidth="1.4" />
            <rect x={ox + 40} y={oy + 66} width={74} height={11} fill="none" stroke={C.emerald} strokeWidth="1.4" />
            <rect x={ox + 176} y={oy + 30} width={11} height={80} fill="none" stroke={C.ruby} strokeWidth="1.4" />
            <T x={ox + 112} y={oy + 18} a="middle" s={10} c={C.ruby}>
              belly: stretches
            </T>
            <T x={ox + 112} y={oy + 110} a="middle" s={10} c={C.ruby}>
              belly
            </T>
            <T x={ox + 120} y={oy + 74} s={10} c={C.steel}>
              backbone
            </T>
          </g>
        )
      })()}
      <Lead p={[211, 300]} t={[250, 324]} text="across the grain" a="end" c={C.ruby} s={10} />
      <Lead p={[90, 236]} t={[24, 324]} text="along the backbone" a="start" c={C.emerald} s={10} />
      <Sep x1={262} y1={166} x2={262} y2={330} />
      <Tag x={274} y={176}>Reinforce the body</Tag>
      <Verdict x={452} y={172} ok />
      <StrapSection x1={300} x2={456} y={218} s={2.6} k={8} left={{ kind: 'break' }} right={{ kind: 'tip' }} vel holes={[25, 32, 39]} />
      <Lead p={[330, 218 + 8.8 + 1.1]} t={[300, 276]} text="0.2 mm reinforcement" a="start" s={10} c={C.steel} />
      <T x={274} y={300} s={10} c={C.faint}>
        non-stretch under the holes:
      </T>
      <T x={274} y={314} s={10} c={C.faint}>
        the tongue can’t drag them long
      </T>
    </Fig>
  )
}

/* Fault · sticky or spotted surface */
function FaultSticky() {
  const id = uid()
  return (
    <Fig h={320} view="Section + plan · too much, or the wrong product" scale="schematic">
      <QXDefs />
      <Tag x={14} y={36}>Sticky surface</Tag>
      <Verdict x={222} y={32} ok={false} />
      <Ply x1={30} x2={220} y={92} t={14} />
      <Ply x1={30} x2={220} y={106} t={8} k="lining" />
      <path d="M30 92 Q60 82 90 88 T150 86 T220 89 L220 92 L30 92 Z" fill="rgba(230,207,142,0.55)" stroke="#c9b06a" strokeWidth="0.8" />
      {[[52, 85], [84, 86], [118, 84], [160, 85], [196, 86]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={1.6} fill="#8a8580" />
      ))}
      <path d="M140 72 q6 -10 14 -4 q6 5 14 -2" fill="none" stroke={C.dim} strokeWidth="1" />
      <Lead p={[66, 86]} t={[40, 58]} text="over-conditioned: a film that never soaked in" a="start" s={10} c={C.ruby} />
      <Lead p={[118, 84]} t={[150, 140]} text="dust and lint stick to it" a="middle" s={10} />
      <T x={14} y={172} s={11} c={C.text} w="600">
        Fix
      </T>
      <path d="M40 196 q12 -14 34 -10 q12 3 10 12 z" fill="#e8e0cf" stroke="#9c927e" strokeWidth="0.8" />
      <Arrow a={[92, 192]} b={[140, 192]} w={1.4} />
      <T x={40} y={222} s={10.5}>
        wipe off the excess
      </T>
      {(() => {
        const x1 = 40
        const x2 = 210
        const y = 254
        const m = (mo) => x1 + ((x2 - x1) * mo) / 12
        return (
          <g>
            <line x1={x1} y1={y} x2={x2} y2={y} stroke={C.dim} strokeWidth="1" />
            {[0, 3, 6, 9, 12].map((mo) => (
              <line key={mo} x1={m(mo)} y1={y - 4} x2={m(mo)} y2={y + 4} stroke={C.dim} strokeWidth="0.8" />
            ))}
            {[0, 2.5, 5, 7.5, 10].map((mo) => (
              <circle key={mo} cx={m(mo)} cy={y} r={3.5} fill="#e6cf8e" stroke="#8a7440" />
            ))}
            <T x={x1} y={y + 20} s={10.5}>
              then longer between coats
            </T>
            <T x={x1} y={y + 34} s={10} c={C.faint}>
              about every 2–3 months
            </T>
          </g>
        )
      })()}

      <Sep x1={240} y1={26} x2={240} y2={306} />
      <Tag x={254} y={36}>White spots on alligator</Tag>
      <Verdict x={452} y={32} ok={false} />
      <clipPath id={`wt${id}`}>
        <rect x={256} y={50} width={204} height={100} rx={4} />
      </clipPath>
      <g clipPath={`url(#wt${id})`}>
        <rect x={256} y={50} width={204} height={100} fill={CR.base} />
        <TileGrid xs={rowsFrom(250, 466, 28, 71)} ys={[46, 70, 98, 126, 152]} seed={17} jit={3} />
        {[[284, 76, 8], [340, 112, 10], [396, 80, 7], [430, 132, 6], [312, 136, 5]].map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.7} fill="rgba(236,232,222,0.55)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.6" />
        ))}
      </g>
      <Lead p={[340, 112]} t={[300, 172]} text="water-stain spots" a="middle" s={10} c={C.ruby} />
      <T x={254} y={208} s={11} c={C.text} w="600">
        Fix
      </T>
      {(() => {
        const bottle = (x, y, oil) => (
          <g>
            <rect x={x - 9} y={y - 26} width={18} height={30} rx={3} fill={oil ? '#c9a64a' : '#e8e0cf'} stroke="#6a5a3a" strokeWidth="0.8" opacity="0.9" />
            <rect x={x - 4} y={y - 32} width={8} height={7} fill="#3b3b3b" />
            <T x={x} y={y + 18} a="middle" s={10} c={oil ? C.ruby : C.emerald}>
              {oil ? 'an oil' : 'reptile cream'}
            </T>
            <Verdict x={x + 22} y={y - 14} ok={!oil} r={7} />
          </g>
        )
        return (
          <g>
            {bottle(290, 254, true)}
            {bottle(384, 254, false)}
          </g>
        )
      })()}
      <T x={254} y={296} s={10.5}>
        use a dedicated reptile cream
      </T>
    </Fig>
  )
}

/* Fault · dye on the wrist */
function FaultBleed() {
  const sec = (cx, sealed) => {
    const w = 150
    const y = 110
    const x1 = cx - w / 2
    const x2 = cx + w / 2
    return (
      <g>
        <XSec cx={cx} y={y} w={w} layers={[{ k: 'top', t: 13 }, { k: 'lining', t: 8 }]} edge="bevel" b={3} />
        <path d={`M${x1 + 3} ${y + 0.6} H${x2 - 3}`} stroke="#5a3519" strokeWidth="1.6" />
        {[x1, x2].map((ex, i) => (
          <line key={i} x1={ex + (i ? -0.6 : 0.6)} y1={y + 3} x2={ex + (i ? -0.6 : 0.6)} y2={y + 18} stroke="#5a3519" strokeWidth="1.6" />
        ))}
        {sealed && (
          <path d={`M${x1 - 1.5} ${y + 20} V${y + 3} L${x1 + 3} ${y - 1.5} H${x2 - 3} L${x2 + 1.5} ${y + 3} V${y + 20}`} fill="none" stroke={C.emerald} strokeWidth="1.6" />
        )}
        <path d={`M${cx - 110} ${y + 34} Q${cx} ${y + 22} ${cx + 110} ${y + 34} L${cx + 110} ${y + 56} L${cx - 110} ${y + 56} Z`} fill="rgba(214,170,140,0.16)" stroke="#a57e66" strokeWidth="1" />
        <T x={cx + 104} y={y + 50} a="end" s={10} c={C.faint}>
          skin
        </T>
        {!sealed &&
          [x1, x2].map((ex, i) => (
            <g key={i}>
              <ellipse cx={ex} cy={y + 29} rx={11} ry={3} fill="rgba(90,53,25,0.7)" />
              <path d={`M${ex + (i ? 6 : -6)} ${y + 8} q-4 6 0 9 q4 -3 0 -9 Z`} fill={C.steel} opacity="0.85" />
              <Arrow a={[ex, y + 20]} b={[ex, y + 27]} c="ruby" w={1.2} />
            </g>
          ))}
      </g>
    )
  }
  return (
    <Fig h={330} view="Section across the strap · on the wrist" scale="schematic">
      <Tag x={14} y={36}>Unsealed</Tag>
      <Verdict x={222} y={32} ok={false} />
      {sec(122, false)}
      <Lead p={[122 - 75, 112]} t={[30, 74]} text="dye on top and edges" a="start" s={10} />
      <Lead p={[122 + 81, 118]} t={[214, 74]} text="sweat" a="end" s={10} c={C.steel} />
      <T x={30} y={192} s={10.5} c={C.ruby}>
        sweat pulls loose dye out where the
      </T>
      <T x={30} y={206} s={10.5} c={C.ruby}>
        edges touch the skin — and at the buckle
      </T>

      <Sep x1={242} y1={26} x2={242} y2={220} />
      <Tag x={256} y={36}>Buffed, then sealed</Tag>
      <Verdict x={452} y={32} ok />
      {sec(360, true)}
      <Lead p={[360 + 78, 112]} t={[440, 74]} text="sealer over top and edges" a="end" s={10} c={C.emerald} />
      <T x={256} y={192} s={10.5} c={C.emerald}>
        Resolene 1:1 with water,
      </T>
      <T x={256} y={206} s={10.5} c={C.emerald}>
        2–3 light coats — edges too
      </T>
      <Sep x1={14} y1={222} x2={466} y2={222} />
      <Tag x={14} y={244}>The test · before you seal and after</Tag>
      {[
        [24, false, 'dye on it: buff more'],
        [262, true, 'stays clean: seal it'],
      ].map(([x, ok, txt]) => (
        <g key={x}>
          <rect x={x} y={256} width={58} height={44} rx={3} fill="#f1ece2" stroke="#b9b1a1" />
          {!ok && <path d={`M${x + 10} ${282} q16 -10 38 -2`} stroke="rgba(110,70,35,0.75)" strokeWidth="6" strokeLinecap="round" fill="none" />}
          <Verdict x={x + 74} y={270} ok={ok} r={8} />
          <T x={x + 90} y={274} s={10.5} c={ok ? C.emerald : C.ruby}>
            {txt}
          </T>
          <T x={x + 90} y={288} s={10} c={C.faint}>
            damp white cloth
          </T>
        </g>
      ))}
      <Note x={14} y={322} s={10.5} lh={14} lines={['Buff off loose dye until a white cloth stays clean, then seal properly — edges included.']} />
    </Fig>
  )
}

export const FIGS = {
  'qr-channel': QrChannel,
  'qr-seam': QrSeam,
  'qr-locate': QrLocate,
  'qr-notch': QrNotch,
  'qr-seal': QrSeal,
  'qr-reinsert': QrReinsert,
  'qr-fit': QrFit,
  'ex-section': ExSection,
  'ex-layout': ExLayout,
  'ex-cut': ExCut,
  'ex-thin': ExThin,
  'ex-back': ExBack,
  'ex-line': ExLine,
  'ex-stitch': ExStitch,
  'ex-edges': ExEdges,
  'ex-keepers': ExKeepers,
  'ex-condition': ExCondition,
  'ex-shell': ExShell,
  'ex-ostrich': ExOstrich,
  'fit-bars': FitBars,
  'fit-wrist': FitWrist,
  'fit-breakin': FitBreakin,
  'fit-care': FitCare,
  'fault-wrinkle': FaultWrinkle,
  'fault-crack': FaultCrack,
  'fault-stretch': FaultStretch,
  'fault-sticky': FaultSticky,
  'fault-bleed': FaultBleed,
}
