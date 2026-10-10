// Registry of every strap-making diagram, referenced from lessons as
// `figure: 'strap:<id>'`. Loaded lazily by StepFigures so the watch lessons
// never pay for it. Authoring guide: AUTHORING.md.
import { FIGS as overview } from './figs-overview.jsx'
import { FIGS as materials } from './figs-materials.jsx'
import { FIGS as prep } from './figs-prep.jsx'
import { FIGS as stitch } from './figs-stitch.jsx'
import { FIGS as finish } from './figs-finish.jsx'
import { FIGS as classic } from './figs-classic.jsx'
import { FIGS as unlinedRemborde } from './figs-unlined-remborde.jsx'
import { FIGS as paddedRally } from './figs-padded-rally.jsx'
import { FIGS as bundSpNosew } from './figs-bund-sp-nosew.jsx'
import { FIGS as qrExoticFit } from './figs-qr-exotic-fit.jsx'
import { FIGS as grained } from './figs-grained.jsx'
import { FIGS as atelier } from './figs-atelier.jsx'
import { FIGS as pilotSw } from './figs-pilot-sw.jsx'
import { FIGS as minimalRally } from './figs-minimal-rally.jsx'
import { FIGS as extras } from './figs-extras.jsx'

export const FIGS = {
  ...overview,
  ...materials,
  ...prep,
  ...stitch,
  ...finish,
  ...classic,
  ...unlinedRemborde,
  ...paddedRally,
  ...bundSpNosew,
  ...qrExoticFit,
  ...grained,
  ...atelier,
  ...pilotSw,
  ...minimalRally,
  ...extras,
}

export default function StrapFigure({ id }) {
  const Cmp = FIGS[id]
  if (!Cmp) return null
  return <Cmp />
}
