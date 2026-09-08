// Guided learning paths for the "Guide me" pathfinder. A goal + an experience
// level resolves to an ordered list of EXISTING lessons, each with a one-line
// reason. Step ids must match real lesson ids in lessons.js — check-data.mjs
// verifies this so a typo can't ship a dead link.

// Experience levels, coarsest → deepest. `start` on each path step is the
// index a level begins at (earlier steps are assumed known and skipped).
export const LEVELS = [
  { id: 'new', label: 'Never opened a watch', note: 'we start gentle' },
  { id: 'basic', label: 'Changed a strap or battery', note: 'skip the very basics' },
  { id: 'opened', label: 'Opened a movement before', note: 'straight to technique' },
  { id: 'serviced', label: 'Serviced one before', note: 'depth and edge-cases' },
]

// Goals shown on the picker. `diagnose` routes to the Diagnose trees instead
// of a lesson path. `movements` shows an optional calibre chooser.
export const GUIDE_GOALS = [
  {
    id: 'maintain',
    icon: 'strap',
    accent: '',
    title: 'Maintain my own watches',
    blurb: 'Straps, batteries and everyday care — every job here is reversible.',
  },
  {
    id: 'understand',
    icon: 'anatomy',
    accent: 'steel',
    title: 'Understand how a watch works',
    blurb: 'The theory, no tools needed — so every repair later makes sense.',
  },
  {
    id: 'service',
    icon: 'gear',
    accent: '',
    title: 'Service a mechanical movement',
    blurb: 'Strip, clean, oil and regulate a movement, properly.',
    movements: true,
  },
  {
    id: 'build',
    icon: 'build',
    accent: 'emerald',
    title: 'Build a watch from parts',
    blurb: 'From a movement, dial and hands to a running watch of your own.',
    movements: true,
  },
  {
    id: 'restore',
    icon: 'tools',
    accent: '',
    title: 'Restoration & bench skills',
    blurb: 'Balance staffs, poising, jewelling, the lathe — the deep end.',
  },
  {
    id: 'fix',
    icon: 'alert',
    accent: 'ruby',
    title: 'Fix a specific problem',
    blurb: 'Answer a few questions, reach the likely cause and the lesson that fixes it.',
    diagnose: true,
  },
]

// For the "service" and "build" goals, the calibre chip swaps the final
// flagship lesson.
export const MOVEMENT_FLAGSHIP = {
  'Seiko NH35': 'svc-nh35',
  'ETA 2824': 'svc-2824',
  'Unitas 6497': 'svc-6497',
}
export const MOVEMENT_CHIPS = ['Seiko NH35', 'ETA 2824', 'Unitas 6497', 'Not sure yet']

// Each path: ordered { id, why } steps, and `starts` giving the first step
// index per experience level. `flagship` marks the step the calibre chip
// replaces (service only).
export const PATHS = {
  maintain: {
    starts: { new: 0, basic: 2, opened: 2, serviced: 3 },
    steps: [
      { id: 'basics-strap', why: 'Straps come off first — the safest possible place to start.' },
      { id: 'basics-bracelet', why: 'Get a metal bracelet to actually fit your wrist.' },
      { id: 'basics-caseback', why: 'Every repair beyond a strap starts with getting the back off.' },
      { id: 'quartz-battery', why: 'The single commonest repair there is.' },
      { id: 'basics-settime', why: 'Set the time and date without stressing the movement.' },
      { id: 'basics-care', why: 'Keep it clean and running between services.' },
      { id: 'basics-glass', why: 'Swap a scratched crystal — a confident step up.' },
    ],
  },
  understand: {
    starts: { new: 0, basic: 0, opened: 1, serviced: 2 },
    steps: [
      { id: 'fund-overview', why: 'The map of the whole machine, part by part.' },
      { id: 'fund-mechanical', why: 'How a mechanical watch actually keeps time.' },
      { id: 'fund-automatic', why: 'How the rotor winds the watch for you.' },
      { id: 'fund-keyless', why: 'What changes inside when you wind versus set.' },
      { id: 'fund-quartz', why: 'The other half of the world — how quartz works.' },
      { id: 'fund-complications', why: 'What a date, chronograph or moonphase adds.' },
      { id: 'fund-escapements', why: 'Beyond the lever: how other escapements differ.' },
    ],
  },
  service: {
    starts: { new: 0, basic: 2, opened: 4, serviced: 5 },
    flagship: 'svc-6497',
    steps: [
      { id: 'fund-overview', why: 'Name every part before you take one out.' },
      { id: 'fund-mechanical', why: 'Understand where the timekeeping happens.' },
      { id: 'shop-setup', why: 'Set up the bench, light and holders.' },
      { id: 'shop-safety', why: 'Protect yourself and the movement first.' },
      { id: 'svc-overview', why: 'See the whole service before you begin.' },
      { id: 'mech-letdown', why: 'Let the mainspring down safely — never skip this.' },
      { id: 'mech-uncase', why: 'Get the movement out of its case cleanly.' },
      { id: 'mech-hands-dial', why: 'Lift hands and dial without marking them.' },
      { id: 'svc-teardown', why: 'Strip the movement in the correct order.' },
      { id: 'svc-clean', why: 'Get pivots and jewel holes genuinely clean.' },
      { id: 'svc-oil', why: 'The oiling chart — which oil on which jewel.' },
      { id: 'svc-reassemble', why: 'Rebuild it, lubricated correctly.' },
      { id: 'svc-test', why: 'Final test and regulation on the timegrapher.' },
      { id: 'svc-6497', why: 'Put it all together on a real calibre, start to finish.' },
    ],
  },
  build: {
    starts: { new: 0, basic: 0, opened: 2, serviced: 2 },
    flagship: null,
    steps: [
      { id: 'build-plan', why: 'Pick a movement, dial, hands and case that fit together.' },
      { id: 'build-first-kit', why: 'Start with a kit designed to go together.' },
      { id: 'fund-overview', why: 'Know the parts you’re assembling.' },
      { id: 'build-dial-hands', why: 'Fit the dial and hands at the right heights.' },
      { id: 'build-case', why: 'Case the movement and fit the stem squarely.' },
      { id: 'build-seal', why: 'Seal it and pressure-test before it gets wet.' },
      { id: 'build-troubleshoot', why: 'Fix the snags every first build hits.' },
    ],
  },
  restore: {
    starts: { new: 0, basic: 0, opened: 0, serviced: 0 },
    steps: [
      { id: 'rest-staff', why: 'Replace a broken balance staff on the staking set.' },
      { id: 'rest-poise', why: 'Poise the balance for accuracy in every position.' },
      { id: 'rest-hairspring', why: 'The most delicate skill on the bench.' },
      { id: 'rest-jewel', why: 'Replace jewels and set end-shake precisely.' },
      { id: 'rest-pivots', why: 'Save a worn pivot with the Jacot tool.' },
      { id: 'rest-shellac', why: 'Adjust the escapement and re-shellac the pallets.' },
      { id: 'rest-case', why: 'Refinish honestly — and know what not to touch.' },
    ],
  },
}
