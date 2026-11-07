// Registry of the bench diagrams, referenced from lessons as `figure: 'bench:<id>'`.
// Drawn with the strap kit (../strap/kit.jsx) and loaded lazily by StepFigures.
import { FIGS as timing } from './figs-timing.jsx'
import { FIGS as bench } from './figs-bench.jsx'
import { FIGS as quartzCase } from './figs-quartz-case.jsx'

export const FIGS = {
  ...timing,
  ...bench,
  ...quartzCase,
}

export default function BenchFigure({ id }) {
  const Cmp = FIGS[id]
  if (!Cmp) return null
  return <Cmp />
}
