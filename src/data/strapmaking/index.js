// The "Make a Leather Strap" track: foundations, the fifteen bench
// techniques, ten complete constructions, and wear & care.
import { FOUNDATIONS } from './foundations.js'
import { TECHNIQUES } from './techniques.js'
import { BUILDS } from './builds.js'

export const STRAP_TRACK = {
  id: 'strapmaking',
  name: 'Make a Leather Strap',
  icon: 'strap',
  accent: 'ruby',
  blurb:
    'A master course in hand-making leather watch straps. The three rules every strap obeys, fifteen bench techniques, and ten complete constructions — classic lined, unlined, rembordé, padded, rally, Bund, single-pass, no-sew, quick-release and exotic — with a technical diagram for every step.',
  lessons: [...FOUNDATIONS, ...TECHNIQUES, ...BUILDS],
}
