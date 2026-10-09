// Not shown in the app: a sampler of every kit primitive, rendered with
//   node scripts/render-strap.mjs --file sampler.jsx
// so authors can see what each one looks like and how it is called.
import { C, Fig, T, Note, Lead, Dim, Arrow, Num, Verdict, Tag, Legend } from './kit.jsx'
import { StrapPlan, StitchRun, Slot, Ply, Wrap, BarEnd, GlueLine, NoGlue, Reinf, SectionStitch, XSec, Buckle, SpringBar, CaseSide, Wrist } from './parts.jsx'
import { StrapSection } from './sections.jsx'
import { LONG, SHORT } from './geom.js'
import * as Tl from './tools.jsx'

function Tools() {
  const list = [
    ['Knife skive', <Tl.Knife kind="skive" />],
    ['Knife round', <Tl.Knife kind="round" k={0.8} />],
    ['Knife utility', <Tl.Knife kind="utility" />],
    ['Iron french', <Tl.Iron n={4} pitch={9} x={-14} />],
    ['Mallet', <Tl.Mallet k={0.8} />],
    ['Hammer', <Tl.Hammer k={0.8} />],
    ['Awl diamond', <Tl.Awl />],
    ['Awl round', <Tl.Awl kind="round" />],
    ['Punch round', <Tl.Punch d={6} />],
    ['Punch oblong', <Tl.Punch kind="oblong" d={5} />],
    ['Beveller', <Tl.Beveller />],
    ['Slicker', <Tl.Slicker len={70} />],
    ['Dividers', <Tl.Dividers sp={26} h={80} />],
    ['BoneFolder', <Tl.BoneFolder />],
    ['Brush', <Tl.Brush />],
    ['Roller', <Tl.Roller />],
    ['Pliers', <Tl.Pliers k={0.7} />],
    ['Pony', <Tl.Pony k={0.5} />],
    ['Sander', <Tl.Sander len={70} grit="400" />],
    ['Creaser hot', <Tl.Creaser hot />],
    ['Burner', <Tl.Burner />],
    ['Applicator', <Tl.Applicator />],
    ['Dauber', <Tl.Dauber />],
    ['Rivet', <Tl.Rivet h={20} />],
    ['Chicago', <Tl.Rivet h={20} kind="chicago" />],
    ['BarTool', <Tl.BarTool />],
    ['HeatGun', <Tl.HeatGun k={0.8} />],
    ['NotchPlier', <Tl.NotchPlier k={0.6} />],
    ['Clip', <Tl.Clip />],
    ['Weight', <Tl.Weight w={60} />],
  ]
  return (
    <Fig w={600} h={640} view="Sampler · tools (anchor = dot)">
      {list.map(([name, el], i) => {
        const x = 50 + (i % 6) * 100
        const y = 130 + Math.floor(i / 6) * 120
        return (
          <g key={name}>
            <g transform={`translate(${x} ${y})`}>{el}</g>
            <circle cx={x} cy={y} r="2.5" fill={C.ruby} />
            <T x={x} y={y + 22} a="middle" s={10}>
              {name}
            </T>
          </g>
        )
      })}
    </Fig>
  )
}

function Plans() {
  return (
    <Fig w={600} h={420} view="Sampler · StrapPlan options">
      <StrapPlan T={{ x: 60, y: 70, s: 3 }} o={LONG({ x0: -20 })} centre over={8} folds={[{ x: 0, label: 'fold' }]} zones={[{ from: -20, to: 0, k: 'skiveL' }, { from: 10, to: 60, k: 'glue' }, { from: 0, to: 10, k: 'noglue' }]} stitch={{ mode: 'holes', from: 6 }} holes={{}} />
      <T x={60} y={118} s={10}>LONG x0:-20 · centre · over · folds · zones(skiveL, noglue, glue) · stitch holes · holes</T>
      <StrapPlan T={{ x: 60, y: 170, s: 3 }} o={SHORT({ x1: 105 })} face="flesh" folds={[{ x: 80, label: 'buckle fold' }]} slot={{ x: 80 }} zones={[{ from: 80, to: 105, k: 'skiveR' }]} keepers={[{ x: 70, stitched: true }]} stitch={{ mode: 'line', from: 6, to: 66 }} />
      <T x={60} y={214} s={10}>SHORT x1:105 · face flesh · slot · skiveR · keeper · stitch line</T>
      <StrapPlan T={{ x: 60, y: 266, s: 3 }} o={LONG()} filler={{ inset: 4, from: 8, to: 66 }} stitch={{ mode: 'stitch' }} />
      <T x={60} y={310} s={10}>LONG · filler · stitch (sewn)</T>
      <StrapPlan T={{ x: 60, y: 360, s: 3 }} o={LONG({ tip: 'round' })} face="lining" stitch={{ mode: 'diamond' }} />
      <StrapPlan T={{ x: 60, y: 360, s: 3 }} o={LONG({ tip: 'round', x1: 60, x0: 0 })} face="card" dash="4 3" />
      <T x={60} y={404} s={10}>face lining · diamond holes · card overlay (dash)</T>
    </Fig>
  )
}

function Sections() {
  return (
    <Fig w={600} h={520} view="Sampler · StrapSection & XSec" scale="thickness ×3">
      <StrapSection x1={50} x2={330} y={60} left={{ kind: 'bar' }} right={{ kind: 'tip' }} glue={{ stopL: 10 }} vel holes={[25, 32, 39]} />
      <T x={360} y={70} s={10}>bar → tip · glue · vel · holes</T>
      <StrapSection x1={50} x2={300} y={150} left={{ kind: 'bar' }} right={{ kind: 'buckle' }} keeper={{ at: 10 }} glue={{}} />
      <T x={400} y={160} s={10}>bar → buckle · keeper · glue</T>
      <StrapSection x1={110} x2={300} y={250} left={{ kind: 'flap', len: 20 }} right={{ kind: 'flap', len: 25 }} />
      <T x={400} y={260} s={10}>flap ↔ flap (pre-fold)</T>
      <StrapSection x1={50} x2={330} y={320} left={{ kind: 'bar' }} right={{ kind: 'tip' }} stitch={{}} />
      <T x={360} y={330} s={10}>stitch (section along seam)</T>
      {['square', 'bevel', 'round', 'paint', 'rough'].map((e, i) => (
        <g key={e}>
          <XSec cx={70 + i * 110} y={420} w={80} layers={[{ k: 'top', t: 11 }, { k: 'lining', t: 7 }]} edge={e} b={4} />
          <T x={70 + i * 110} y={460} a="middle" s={10}>
            XSec {e}
          </T>
        </g>
      ))}
      <Legend x={30} y={500} items={[['top', 'top'], ['lining', 'lining'], ['filler', 'filler'], ['velodon', 'reinf.'], ['glue', 'glue'], ['noglue', 'no glue'], ['skive', 'skive'], ['thread', 'thread'], ['paint', 'paint']]} />
    </Fig>
  )
}

function Bits() {
  return (
    <Fig w={600} h={400} view="Sampler · annotation, hardware, case">
      <Dim a={[40, 60]} b={[200, 60]} off={-14} text="120" />
      <Dim a={[230, 40]} b={[230, 100]} off={14} text="20" />
      <Dim a={[260, 70]} b={[278, 70]} text="3" />
      <Lead p={[320, 70]} t={[360, 50]} text="leader" sub="with sub-label" />
      <Arrow a={[420, 60]} b={[500, 60]} />
      <Arrow d="M420 90 q40 -30 80 0" c="ruby" />
      <Arrow a={[520, 40]} b={[580, 40]} c="emerald" both />
      <Num x={40} y={130} n={1} />
      <Num x={70} y={130} n={2} />
      <Verdict x={110} y={130} ok />
      <Verdict x={140} y={130} ok={false} />
      <Tag x={170} y={134}>panel tag</Tag>
      <Note x={300} y={124} head="Note head" lines={['line one', 'line two']} />
      <Buckle x={60} y={230} w={54} L={44} />
      <Buckle x={160} y={230} w={54} L={44} metal="brass" />
      <SpringBar x={280} y1={196} y2={264} r={3} />
      <SpringBar x={320} y1={196} y2={264} r={3} qr />
      <CaseSide x={480} y={240} s={10} />
      <Wrist cx={100} cy={340} rx={70} ry={44} />
      <Tl.Bottle cx={260} cy={340} r={40} />
      <BarEnd cx={360} cy={340} r={10} />
      <GlueLine x1={400} x2={560} y={320} />
      <NoGlue x1={400} x2={560} y={340} />
      <Reinf x1={400} x2={560} y={360} />
      <SectionStitch x1={400} x2={560} y1={374} y2={390} p={12} />
    </Fig>
  )
}

export const FIGS = {
  'kit-tools': Tools,
  'kit-plans': Plans,
  'kit-sections': Sections,
  'kit-bits': Bits,
}
