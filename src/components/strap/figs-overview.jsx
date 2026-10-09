// Lesson: Start here — anatomy of a strap & the three rules.
import { C, Fig, T, Note, Lead, Dim, Arrow, Verdict, Tag, Sep, Legend } from './kit.jsx'
import { StrapPlan, SpringBar, Buckle, Wrap, BarEnd, Ply, XSec, CaseSide, GlueLine, NoGlue } from './parts.jsx'
import { StrapSection } from './sections.jsx'
import { LONG, SHORT, holeXs } from './geom.js'
import { Rivet, Bottle } from './tools.jsx'

/* The parts of a two-piece strap, as a finished pair */
function Anatomy() {
  const TL = { x: 82, y: 82, s: 3 }
  const TS = { x: 82, y: 206, s: 3 }
  const h = holeXs(120)
  return (
    <Fig h={410} view="Plan · finished pair" scale="20 → 18 mm · 120 / 80">
      <StrapPlan T={TL} o={LONG()} stitch={{ m: 3, p: 3, from: 5 }} holes={{}} />
      <SpringBar x={82} y1={46} y2={118} r={2.6} />
      <StrapPlan T={TS} o={SHORT()} stitch={{ m: 3, p: 3, from: 5, to: 66 }} keepers={[{ x: 70 }, { x: 52, float: true }]} />
      <SpringBar x={82} y1={170} y2={242} r={2.6} />
      <Buckle x={82 + 80 * 3} y={206} w={54} L={44} />

      <Lead p={[84, 52]} t={[66, 30]} text="spring bar" a="end" />
      <Lead p={[96, 102]} t={[50, 140]} text="lug end" sub="pompe" a="middle" />
      <Lead p={[250, 70]} t={[236, 34]} text="long piece · brin long" a="middle" />
      <Lead p={[82 + h[3] * 3, 82]} t={[350, 34]} text="adjustment holes" />
      <Lead p={[441, 84]} t={[452, 128]} text="tip" a="end" />
      <Lead p={[320, 107]} t={[320, 140]} text="stitch line, 3 mm in" a="middle" />

      <Lead p={[200, 182]} t={[200, 160]} text="short piece · brin court" a="middle" />
      <Lead p={[82 + 52 * 3, 236]} t={[200, 258]} text="floating keeper" sub="passant mobile" a="end" />
      <Lead p={[82 + 70 * 3, 236]} t={[300, 258]} text="fixed keeper" sub="passant fixe" />
      <Lead p={[352, 190]} t={[398, 160]} text="buckle" sub="boucle" />
      <Lead p={[344, 206]} t={[398, 203]} text="tongue" sub="ardillon" />
      <Lead p={[322, 236]} t={[398, 246]} text="buckle fold" sub="enchapure" />
      <AnatomyInsets />
    </Fig>
  )
}

// Three magnified details along the bottom of the anatomy plate.
function AnatomyInsets() {
  const frame = (x, title) => (
    <g>
      <rect x={x} y={306} width={146} height={96} rx="8" fill="rgba(255,255,255,0.025)" stroke={C.line} />
      <Tag x={x + 8} y={321}>{title}</Tag>
    </g>
  )
  const holes = [30, 60, 90, 120]
  return (
    <g>
      {/* stitch detail */}
      {frame(10, 'Stitch · ×10')}
      <rect x={18} y={334} width={130} height={56} fill="url(#sk-top)" />
      <line x1={18} y1={334} x2={148} y2={334} stroke={C.topEdge} strokeWidth="1.4" />
      {holes.map((x) => (
        <g key={x}>
          <line x1={x - 3} y1={367} x2={x + 3} y2={361} stroke={C.hole} strokeWidth="2" strokeLinecap="round" />
          {x < 120 && <line x1={x + 5} y1={367} x2={x + 25} y2={361} stroke={C.thread} strokeWidth="2.6" strokeLinecap="round" />}
        </g>
      ))}
      <Dim a={[140, 334]} b={[140, 364]} text="" />
      <T x={134} y={352} a="end" s={10} mono>3</T>
      <Dim a={[60, 380]} b={[90, 380]} text="" />
      <T x={75} y={399} a="middle" s={10} mono>pitch 3</T>
      <T x={22} y={348} s={9.5} c="#f3e3c4">edge</T>

      {/* edge section */}
      {frame(166, 'Edge section · ×14')}
      <XSec cx={239} y={336} w={118} layers={[{ k: 'top', t: 15 }, { k: 'velodon', t: 3 }, { k: 'lining', t: 10 }]} edge="paint" b={4} coat={3} />
      <T x={239} y={380} a="middle" s={10} mono>1.1 + 0.2 + 0.7 ≈ 2.0 mm</T>
      <T x={239} y={394} a="middle" s={9.5} c={C.faint}>top · reinforcement · lining</T>

      {/* lug fold */}
      {frame(322, 'Lug fold · ×8')}
      <Wrap cx={350} cy={354} r={7} t={9} xR={350} conv={18} tail={26} ts={4} />
      <Ply x1={350} x2={462} y={338} t={9} open="l" />
      <Ply x1={370} x2={462} y={347} t={6} k="lining" skL={[18, 1.5]} cut="top" />
      <BarEnd cx={350} cy={354} r={6.4} />
      <Lead p={[352, 364]} t={[384, 382]} text="glue-free channel" s={10} />
      <T x={388} y={396} s={9.5} c={C.faint}>tail feathered</T>
    </g>
  )
}

/* Section of the short piece with the French workshop vocabulary */
function Vocabulary() {
  const x1 = 64
  const x2 = 314
  const y = 70
  const rows = [
    ['parer', 'skive'],
    ['griffe à frapper', 'pricking iron'],
    ['compas à pointe sèche', 'wing dividers'],
    ['abat-carrer', 'edge beveller / bevel'],
    ['surcoupe', 'final trim through the glued layers'],
    ['tranche franche', 'cut (raw) edge, painted or burnished'],
    ['rembordé', 'turned edge — grain wraps the edge'],
  ]
  return (
    <Fig h={300} view="Section · short piece" scale="thickness ×3">
      <StrapSection x1={x1} x2={x2} y={y} s={3.1} k={9} left={{ kind: 'bar' }} right={{ kind: 'buckle' }} keeper={{ at: 10 }} />
      <Lead p={[x1 - 6, y + 22]} t={[24, 112]} text="pompe" sub="lug fold" a="start" />
      <Lead p={[130, y + 4]} t={[130, 36]} text="dessus" a="middle" />
      <T x={130} y={28} a="middle" s={10} c={C.faint}>top (grain)</T>
      <Lead p={[200, y + 13]} t={[214, 112]} text="doublure" sub="lining" />
      <Lead p={[x2 - 31, y - 22]} t={[250, 36]} text="passant fixe" a="end" />
      <T x={246} y={28} a="end" s={10} c={C.faint}>fixed keeper</T>
      <Lead p={[x2 + 10, y + 24]} t={[330, 112]} text="enchapure" sub="buckle fold" />
      <Lead p={[x2 + 44, y + 10]} t={[400, 40]} text="boucle" sub="buckle" />

      <Sep x1={14} y1={146} x2={466} y2={146} />
      <Tag x={14} y={166}>The bench vocabulary</Tag>
      {rows.map(([fr, en], i) => (
        <g key={fr}>
          <T x={24} y={190 + i * 15.5} c={C.brass} s={11.5} it>
            {fr}
          </T>
          <T x={186} y={190 + i * 15.5} s={11.5}>
            {en}
          </T>
        </g>
      ))}
    </Fig>
  )
}

/* Thickness budget: the strap must pass between the bar and the case */
function Clearance() {
  const s = 12 // px per mm, true scale detail
  const bx = 250
  const by = 118
  const r = 0.9 * s
  const t = 1.1 * s
  const tl = 0.7 * s
  const tail = r * 3.4
  const yTop = by - r - t
  return (
    <Fig h={270} view="Detail · side view at the lug" scale="true scale ×12">
      <CaseSide x={bx} y={by} s={s} gap={3.0} len={14} />
      <Wrap cx={bx} cy={by} r={r} t={t} xR={bx} conv={r * 2.6} tail={tail} ts={t * 0.45} />
      <Ply x1={bx} x2={470} y={yTop} t={t} open="l" />
      <Ply x1={bx + r * 2.6 + 2} x2={470} y={by - r + 2} t={tl} k="lining" skL={[34, tl * 0.25]} cut="top" />
      <BarEnd cx={bx} cy={by} r={r} />
      {/* bar diameter */}
      <Dim a={[bx - r, by + 50]} b={[bx + r, by + 50]} text="" />
      <line x1={bx - r} y1={by + 4} x2={bx - r} y2={by + 54} stroke={C.dim} strokeWidth="0.5" opacity="0.5" />
      <line x1={bx + r} y1={by + 4} x2={bx + r} y2={by + 54} stroke={C.dim} strokeWidth="0.5" opacity="0.5" />
      <T x={bx + r + 6} y={by + 54} s={10.5} mono>bar Ø 1.0–1.8</T>
      {/* clearance */}
      <Dim a={[bx - 3.0 * s, by - 2]} b={[bx - r, by - 2]} off={0} text="" />
      <Lead p={[bx - 2.0 * s, by - 2]} t={[bx - 2.0 * s, 222]} text="the fold must pass here" a="end" c={C.ruby} />
      <T x={bx - 2.0 * s - 4} y={240} a="end" s={10.5}>between bar and case flank</T>
      {/* stack */}
      <Dim a={[464, yTop]} b={[464, by - r + 2 + tl]} off={0} text="" />
      <T x={458} y={yTop - 8} a="end" s={10.5} mono>≈ 2.2</T>
      <Lead p={[330, yTop + 3]} t={[330, 50]} text="top 1.0–1.2" a="middle" />
      <Lead p={[400, by - r + 7]} t={[400, by + 22]} text="lining 0.5–1.0" a="middle" />
      <Note
        x={292}
        y={214}
        head="The thickness budget"
        hc={C.text}
        lines={['Top + lining + 0.2 mm reinforcement:', '≈ 2.2–2.5 mm for a flat strap.', 'Many cases won’t take 1.5 + 1.5 mm.']}
        s={10.5}
        lh={14}
      />
    </Fig>
  )
}

/* Rule 1 — the doubled fold equals one layer */
function RuleFold() {
  const r = 11
  const t = 14
  const panel = (ox, skived) => {
    const cx = ox + 40
    const yTop = 88
    const tl = skived ? t * 0.55 : t // ply thickness round the bar
    const cy = yTop + tl + r
    const body = skived ? (
      <Ply x1={cx} x2={ox + 200} y={yTop} t={t} skL={[34, tl]} open="l" />
    ) : (
      <Ply x1={cx} x2={ox + 200} y={yTop} t={t} open="l" />
    )
    const probe = cx + r * 3.6
    const tailBottom = skived ? yTop + t * 1.15 : yTop + t * 2
    return (
      <g>
        {body}
        <Wrap cx={cx} cy={cy} r={r} t={tl} xR={cx} conv={skived ? r * 2.8 : r * 1.6} tail={skived ? 66 : 2} ts={skived ? tl * 0.5 : t} />
        {!skived && <Ply x1={cx + r * 1.6} x2={cx + r * 1.6 + 54} y={yTop + t} t={t} />}
        <BarEnd cx={cx} cy={cy} r={r * 0.92} />
        <Dim a={[ox + 208, yTop]} b={[ox + 208, yTop + t]} text="" />
        <T x={ox + 214} y={yTop + t / 2 + 4} s={10} mono>1</T>
        <line x1={probe} y1={yTop - 14} x2={probe} y2={tailBottom + 14} stroke={skived ? C.emerald : C.ruby} strokeWidth="0.8" strokeDasharray="2 2" />
        <T x={probe} y={yTop - 18} a="middle" s={10.5} mono c={skived ? C.emerald : C.ruby}>
          {skived ? '≈ 1' : '2'}
        </T>
        <T x={ox + 104} y={168} a="middle" s={11.5} c={skived ? C.emerald : C.ruby} w="600">
          {skived ? 'Skived: doubled ≈ one layer' : 'Unskived: a hard step, a bulge'}
        </T>
        <T x={ox + 104} y={184} a="middle" s={10.5} c={C.dim}>
          {skived ? 'fold ~½ thick, flap feathered to nothing' : 'the fold jams between case and bar'}
        </T>
        <Verdict x={ox + 206} y={50} ok={skived} />
      </g>
    )
  }
  return (
    <Fig h={210} view="Rule 1 · section at the lug fold" scale="schematic">
      {panel(14, false)}
      <Sep x1={240} y1={30} x2={240} y2={196} />
      {panel(252, true)}
      <Note x={240} y={30} a="middle" lines={[]} />
    </Fig>
  )
}

/* Rule 2 — curvature before the bond sets */
function RuleCurve() {
  const arcStack = (cx, cy, R, wrinkle) => {
    const a0 = -150
    const a1 = -30
    const P = (rr, a) => [cx + rr * Math.cos((a * Math.PI) / 180), cy + rr * Math.sin((a * Math.PI) / 180)]
    const band = (r1, r2, fill, stroke) => {
      const [x1, y1] = P(r1, a0)
      const [x2, y2] = P(r1, a1)
      const [x3, y3] = P(r2, a1)
      const [x4, y4] = P(r2, a0)
      return <path d={`M${x1} ${y1} A${r1} ${r1} 0 0 1 ${x2} ${y2} L${x3} ${y3} A${r2} ${r2} 0 0 0 ${x4} ${y4} Z`} fill={fill} stroke={stroke} strokeWidth="0.8" />
    }
    let grain = null
    if (wrinkle) {
      const pts = []
      for (let a = a0; a <= a1; a += 2) {
        const rr = R + 12 + Math.sin((a - a0) * 0.55) * 1.8
        pts.push(P(rr, a))
      }
      grain = <path d={'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L')} fill="none" stroke="#4a2f16" strokeWidth="1.6" />
    }
    return (
      <g>
        {band(R + 12, R, 'url(#sk-topS)', '#4a3018')}
        {band(R, R - 7, 'url(#sk-linS)', '#8f7b5a')}
        {grain}
      </g>
    )
  }
  return (
    <Fig h={250} view="Rule 2 · bond in the curve" scale="schematic">
      <Tag x={22} y={42}>Glued flat, then bent</Tag>
      <Note x={22} y={60} lines={['the top is forced into compression:', 'wrinkles across the face']} c={C.dim} s={10.5} lh={13} />
      {arcStack(120, 236, 98, true)}
      <Verdict x={214} y={44} ok={false} />
      <Sep x1={240} y1={30} x2={240} y2={240} />
      <Tag x={258} y={42}>Curved, then bonded</Tag>
      <Note x={258} y={60} lines={['lining stretched round a former', '(“boating”): born curved, no wrinkles']} c={C.dim} s={10.5} lh={13} />
      <Bottle cx={360} cy={236} r={90} />
      {arcStack(360, 236, 98, false)}
      <Arrow d="M280 178 q-8 10 -6 22" c="emerald" w={1.6} />
      <Arrow d="M440 178 q8 10 6 22" c="emerald" w={1.6} />
      <T x={360} y={222} a="middle" s={10} c="#8fbcae">former / bottle</T>
      <Verdict x={454} y={44} ok />
    </Fig>
  )
}

/* Rule 3 — nothing rigid in a flex zone */
function RuleFlex() {
  const TL = { x: 76, y: 70, s: 3 }
  const TS = { x: 76, y: 172, s: 3 }
  return (
    <Fig h={330} view="Rule 3 · plan · both pieces, unfolded" scale="flex zones">
      <Tag x={466} y={40} a="end">Long piece</Tag>
      <StrapPlan
        T={TL}
        o={LONG({ x0: -20 })}
        zones={[
          { from: -20, to: 10, k: 'ruby' },
          { from: 104, to: 121, k: 'steel' },
        ]}
        folds={[{ x: 0, label: 'lug fold', c: C.ruby }]}
        holes={{}}
      />
      <T x={76 - 5 * 3} y={116} a="middle" s={10.5} c={C.ruby}>flexes at every wear</T>
      <T x={76 + 112 * 3} y={116} a="middle" s={10.5} c={C.steel}>tip bends to tuck</T>

      <Tag x={466} y={142} a="end">Short piece</Tag>
      <StrapPlan
        T={TS}
        o={SHORT({ x0: -20, x1: 105 })}
        zones={[
          { from: -20, to: 10, k: 'ruby' },
          { from: 66, to: 105, k: 'ruby' },
        ]}
        folds={[
          { x: 0, label: 'lug fold', c: C.ruby },
          { x: 80, label: 'buckle fold', c: C.ruby },
        ]}
        slot={{ x: 80 }}
      />
      <T x={76 + 85 * 3} y={218} a="middle" s={10.5} c={C.ruby}>buckle fold and keeper zone</T>
      <T x={76 - 5 * 3} y={218} a="middle" s={10.5} c={C.ruby}>flexes</T>

      <Sep x1={14} y1={234} x2={466} y2={234} />
      <Tag x={14} y={254}>Never put in a flex zone</Tag>
      <Note x={14} y={274} lines={['× glue in the fold or bar channel', '× stiff tape or Texon across the fold', '× rivets near the lugs']} c={C.dim} s={11} />
      <Note x={250} y={274} lines={['× a big bevel — paint cracks on it', '× paint or finish on the fold spine', '✓ thin flexible non-woven at the pins']} c={C.dim} s={11} />
    </Fig>
  )
}

/* Ten constructions as one build with switches */
function Family() {
  const items = [
    ['Classic lined', 'cut edge', [{ k: 'top', t: 9 }, { k: 'lining', t: 6 }], 'paint'],
    ['Unlined', 'one heavy layer', [{ k: 'top', t: 16 }], 'round'],
    ['Rembordé', 'turned edge', 'remborde'],
    ['Padded', 'domed filler', 'padded'],
    ['Rally', 'openings in top', 'rally'],
    ['Bund', 'pad under case', 'bund'],
    ['Single-pass', 'one strip', [{ k: 'top', t: 12 }], 'round'],
    ['No-sew', 'glued + riveted', 'rivet'],
    ['Quick-release', 'notch for the knob', 'qr'],
    ['Exotic', 'skin over backing', 'exotic'],
  ]
  const cell = (it, i) => {
    const col = i % 5
    const row = Math.floor(i / 5)
    const cx = 54 + col * 93
    const cy = 70 + row * 110
    const [name, sub, spec, edge] = it
    let art
    if (Array.isArray(spec)) art = <XSec cx={cx} y={cy - 8} w={66} layers={spec} edge={edge} b={3} />
    else if (spec === 'remborde')
      art = (
        <g>
          <rect x={cx - 30} y={cy - 4} width="60" height="8" fill="url(#sk-fill)" />
          <path d={`M${cx - 30} ${cy + 8} L${cx - 33} ${cy + 8} Q${cx - 40} ${cy + 8} ${cx - 40} ${cy} Q${cx - 40} ${cy - 10} ${cx - 30} ${cy - 10} L${cx + 30} ${cy - 10} Q${cx + 40} ${cy - 10} ${cx + 40} ${cy} Q${cx + 40} ${cy + 8} ${cx + 33} ${cy + 8} L${cx + 30} ${cy + 8} L${cx + 30} ${cy + 4} L${cx + 34} ${cy + 4} Q${cx + 36} ${cy + 4} ${cx + 36} ${cy} Q${cx + 36} ${cy - 6} ${cx + 30} ${cy - 6} L${cx - 30} ${cy - 6} Q${cx - 36} ${cy - 6} ${cx - 36} ${cy} Q${cx - 36} ${cy + 4} ${cx - 34} ${cy + 4} L${cx - 30} ${cy + 4} Z`} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.7" />
          <rect x={cx - 36} y={cy + 8} width="72" height="5" fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.6" />
        </g>
      )
    else if (spec === 'padded')
      art = (
        <g>
          <path d={`M${cx - 38} ${cy + 6} L${cx - 26} ${cy + 6} Q${cx} ${cy - 22} ${cx + 26} ${cy + 6} L${cx + 38} ${cy + 6} L${cx + 38} ${cy} L${cx + 26} ${cy} Q${cx} ${cy - 30} ${cx - 26} ${cy} L${cx - 38} ${cy} Z`} fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.7" />
          <path d={`M${cx - 24} ${cy + 6} Q${cx} ${cy - 18} ${cx + 24} ${cy + 6} Z`} fill="url(#sk-fill)" />
          <rect x={cx - 38} y={cy + 6} width="76" height="5" fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.6" />
        </g>
      )
    else if (spec === 'rally')
      art = (
        <g>
          <XSec cx={cx} y={cy - 6} w={70} layers={[{ k: 'top', t: 8 }, { k: 'lining', t: 6 }]} edge="paint" b={3} />
          <rect x={cx - 11} y={cy - 7} width="22" height="9" fill={C.ground} />
          <path d={`M${cx - 11} ${cy - 6} v8 M${cx + 11} ${cy - 6} v8`} stroke="#4a3018" strokeWidth="0.8" />
        </g>
      )
    else if (spec === 'bund')
      art = (
        <g>
          <rect x={cx - 22} y={cy - 18} width="44" height="9" rx="3" fill="url(#sk-steel)" opacity="0.85" />
          <rect x={cx - 40} y={cy - 8} width="80" height="7" fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />
          <rect x={cx - 34} y={cy - 1} width="68" height="10" rx="3" fill="url(#sk-dark)" stroke="#e0b277" strokeWidth="0.6" />
        </g>
      )
    else if (spec === 'rivet')
      art = (
        <g>
          <XSec cx={cx} y={cy - 8} w={66} layers={[{ k: 'top', t: 8 }, { k: 'top', t: 8 }]} edge="round" />
          <Rivet x={cx} y={cy - 9} h={18} k={0.9} />
        </g>
      )
    else if (spec === 'qr')
      art = (
        <g>
          <circle cx={cx - 4} cy={cy} r={9} fill="url(#sk-barEnd)" />
          <path d={`M${cx - 4} ${cy - 15} A15 15 0 1 0 ${cx + 11} ${cy}`} fill="none" stroke="url(#sk-topS)" strokeWidth="7" />
          <rect x={cx + 6} y={cy + 6} width="14" height="6" rx="2" fill="url(#sk-steel)" />
          <path d={`M${cx + 4} ${cy + 15} l14 -4`} stroke={C.ruby} strokeWidth="1.5" />
        </g>
      )
    else if (spec === 'exotic')
      art = (
        <g>
          <rect x={cx - 36} y={cy - 12} width="72" height="8" fill="url(#sk-scale)" stroke="#120c07" strokeWidth="0.6" />
          <rect x={cx - 36} y={cy - 4} width="72" height="7" fill="url(#sk-topS)" stroke="#4a3018" strokeWidth="0.6" />
          <rect x={cx - 36} y={cy + 3} width="72" height="5" fill="url(#sk-linS)" stroke="#8f7b5a" strokeWidth="0.6" />
          <rect x={cx - 39} y={cy - 12} width="3" height="20" fill={C.paint} />
          <rect x={cx + 36} y={cy - 12} width="3" height="20" fill={C.paint} />
        </g>
      )
    return (
      <g key={name}>
        <rect x={cx - 44} y={cy - 40} width="88" height="96" rx="8" fill="rgba(255,255,255,0.025)" stroke={C.line} />
        {art}
        <T x={cx} y={cy + 32} a="middle" s={11} c={C.text} w="600">
          {name}
        </T>
        <T x={cx} y={cy + 45} a="middle" s={9.5} c={C.faint}>
          {sub}
        </T>
      </g>
    )
  }
  return (
    <Fig h={250} view="Ten constructions · cross-sections" scale="one build, switched">
      {items.map(cell)}
    </Fig>
  )
}

/* Which edge route the leather decides */
function EdgeRoute() {
  const box = (x, y, w, h, title, lines, c = C.line) => (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="8" fill="rgba(255,255,255,0.03)" stroke={c} strokeWidth="1.2" />
      <T x={x + 12} y={y + 20} s={12} c={C.text} w="600">
        {title}
      </T>
      {lines.map((l, i) => (
        <T key={i} x={x + 12} y={y + 37 + i * 14} s={10.5}>
          {l}
        </T>
      ))}
    </g>
  )
  return (
    <Fig h={250} view="Decision · the edge route" scale="set before you cut">
      {box(150, 30, 180, 58, 'Top AND lining firm veg-tan?', ['both layers must compress', 'to burnish to a glass edge'], C.brass)}
      <Arrow a={[200, 90]} b={[118, 128]} c="emerald" />
      <Arrow a={[280, 90]} b={[362, 128]} c="ruby" />
      <T x={140} y={104} a="end" s={11} c={C.emerald}>yes</T>
      <T x={340} y={104} s={11} c={C.ruby}>no</T>
      {box(22, 130, 200, 100, 'Burnish', ['bevel 0.5–0.7 mm, sand 220 → 1200', 'gum tragacanth or Tokonole', 'slicker, then canvas, then wax'], C.emerald)}
      {box(258, 130, 200, 100, 'Paint — or turn the edge', ['chrome lining, pull-up, exotic,', 'padded multi-layer stacks', '3–4 thin coats, sanded between'], C.ruby)}
      <XSec cx={182} y={202} w={46} layers={[{ k: 'top', t: 8 }, { k: 'top', t: 6 }]} edge="round" />
      <XSec cx={418} y={202} w={46} layers={[{ k: 'top', t: 8 }, { k: 'lining', t: 6 }]} edge="paint" b={3} coat={2.5} />
    </Fig>
  )
}

export const FIGS = {
  'anatomy': Anatomy,
  'vocabulary': Vocabulary,
  'clearance': Clearance,
  'rule-fold': RuleFold,
  'rule-curve': RuleCurve,
  'rule-flex': RuleFlex,
  'family': Family,
  'edge-route': EdgeRoute,
}
