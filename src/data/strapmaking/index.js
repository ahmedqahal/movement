// The "Make a Leather Strap" track: foundations, the bench techniques, the
// constructions, and wear & care. The premium-maker lessons (premium.js) are
// slotted in after the lessons they build on.
import { FOUNDATIONS } from './foundations.js'
import { TECHNIQUES } from './techniques.js'
import { BUILDS } from './builds.js'
import { GRAINED, ATELIER, PILOT, MINIMAL, SMARTWATCH } from './premium.js'

const after = (list, id, ...lessons) => {
  const i = list.findIndex((l) => l.id === id)
  if (i < 0) throw new Error(`strapmaking: no lesson "${id}" to insert after`)
  return [...list.slice(0, i + 1), ...lessons, ...list.slice(i + 1)]
}

let builds = after(BUILDS, 'sm-rally', PILOT)
builds = after(builds, 'sm-nosew', MINIMAL)
builds = after(builds, 'sm-qr', SMARTWATCH)

export const STRAP_TRACK = {
  id: 'strapmaking',
  name: 'Make a Leather Strap',
  icon: 'strap',
  accent: 'ruby',
  blurb:
    'A master course in hand-making leather watch straps. The three rules every strap obeys, the bench techniques up to atelier grade, grained and napped leathers, and thirteen complete constructions — classic lined, unlined, rembordé, padded, rally, pilot, Bund, single-pass, no-sew, minimal-stitch, quick-release, smartwatch and exotic — with a technical diagram for every step.',
  lessons: [
    ...after(FOUNDATIONS, 'sm-leather', GRAINED),
    ...after(TECHNIQUES, 'sm-stitch', ATELIER),
    ...builds,
  ],
}
