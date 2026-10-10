# Authoring strap-making diagrams

Every step of the **Make a Leather Strap** track (`src/data/strapmaking/*.js`)
has `figure: 'strap:<id>'`. Each id is a React component that returns one SVG
technical drawing, registered in a `figs-*.jsx` file and merged in `index.jsx`.
`npm test` (scripts/check-data.mjs) fails if any step's id is not registered.

## The bar

These are the drawings of a master-craft course. Each one must show **the
specific operation of its step** — the tool in action, the leather in the state
it is in at that moment, and the step's key number(s) dimensioned — so a reader
could do the step from the drawing alone. Neighbouring steps must look visibly
different (the work progresses). No generic re-use, no clip-art, no emoji.

More detail is better: label every relevant part, dimension every number the
step mentions, and add a magnified inset or a before/after panel wherever the
critical spot is small. Figures open full screen on tap, so canvases may run
up to h ≈ 340 — dense is fine, cluttered is not.

## Read first

- `kit.jsx` — palette `C`, `<Fig>` frame, `T`, `Note`, `Lead`, `Dim`, `Arrow`,
  `Num`, `Verdict`, `Tag`, `Sep`, `Legend`/`Swatch`, and the shared `<defs>` ids
  (`url(#sk-top)`, `#sk-topS`, `#sk-lin`, `#sk-linS`, `#sk-fill`, `#sk-glue`,
  `#sk-noglue`, `#sk-fadeL/R`, `#sk-steel`, `#sk-wood`, `#sk-scale`, …).
- `geom.js` — millimetre geometry: `LONG()`, `SHORT()`, `outline`, `offset`,
  `widthAt`, `holeXs`, `px`, `pathOf`. Piece coords: x along the strap
  (0 = lug fold / bar centre), y across (0 = centreline); `T = {x, y, s}` maps mm → px.
- `parts.jsx` — `StrapPlan` (plan view with stitch, holes, slot, folds, zones,
  filler, keepers), `Ply`, `Wrap` (a ply round a bar), `BarEnd`, `GlueLine`,
  `NoGlue`, `Reinf`, `SectionStitch`, `XSec` (across-width section with edge
  profiles square/bevel/round/paint/rough), `Buckle`, `SpringBar`, `CaseSide`, `Wrist`.
- `sections.jsx` — `StrapSection` (a whole piece in longitudinal section with
  ends `bar | buckle | tip | flap | break`, lining, glue stops, reinforcement,
  stitches, holes, fixed keeper) and `secGeom` for annotation coordinates.
- `tools.jsx` — tool glyphs, each drawn with (0,0) at the WORKING POINT and the
  tool extending up (−y); place with `x, y`, rotate with `ang`, scale with `k`.
  (`Rivet` and `Pony` extend downward from their anchor.)
- `figs-overview.jsx` — finished exemplars. `sampler.jsx` — every primitive;
  render it with `node scripts/render-strap.mjs --file sampler.jsx --out <dir>`.

## Conventions

- `<Fig w={480} h={200–300} view="PLAN · LONG PIECE" scale="thickness ×3">`.
  `view` names the drawing type (PLAN, SECTION, DETAIL, SIDE VIEW, TOOL,
  COMPARISON, SEQUENCE, CHART). `scale` is honest: `true scale ×12`,
  `thickness ×3`, `schematic`.
- Colour language: top leather tan, lining cream, filler dark cross-hatched,
  reinforcement steel blue, glue emerald dots, no-glue ruby hatch, skive brass
  fade, thread ivory, motion/action brass arrows, caution ruby, good emerald,
  dimensions dim mono.
- Text ≥ 10 px (11–12 for labels): a 480-wide figure renders ~340 px wide on a
  phone. Keep ≥ 10 px inside the frame; nothing may overlap or clip; leaders
  must not cross text. Use `sub` on `Lead` for a second line instead of long labels.
- Numbered discs (`Num`) only where order is real. `Verdict` for do / don't.
- Numbers on drawings must match the step text and the research report
  (`reports/Leather watch strap making.md`). Where the report has no source,
  label it as a house standard or leave the number off.
- Helpers you need go in **your own file**. Do not edit shared files
  (`kit`, `parts`, `sections`, `tools`, `geom`, `index`, `sampler`, other
  `figs-*`). If a shared primitive misbehaves, work round it locally and say so.
- Never name a local variable `T`: it shadows the kit's `<T>` text component and
  crashes rendering ("type is invalid … got: number").
- Lessons that need new primitives have built them locally in earlier files —
  e.g. `Magnifier`/`Inset` (figs-materials, figs-qr-exotic-fit), `VDim`/`HDim`,
  `domeG`/`DomeX`/`PadLong` (figs-padded-rally), `TurnSec` (figs-unlined-remborde),
  stitch-path helpers (figs-stitch), `Edge`/`Loupe` (figs-finish). Read them and
  copy what you need into your own file rather than importing across files.
- Registry, at the end of the file, one entry per line, exactly:

  ```js
  export const FIGS = {
    't4-scribe': SkiveScribe,
  }
  ```

## Verify

```
node scripts/render-strap.mjs --file figs-yours.jsx --out <scratch dir> --per 4
```

Read every PNG (or the `_sheet-*` contact sheets) and fix overlaps, clipping,
illegible text and anything that misstates the craft. Then `node scripts/check-data.mjs`
must report none of your ids as unknown.
