import { MORE_FLOWCHARTS } from './flowcharts-extra.js'

// Interactive diagnostic decision trees.
// A node is a QUESTION (has `text` + `options[{label,next}]`) or a
// LEAF (has `conclusion`, optional `lessonId`, and a `tone`).

const BASE_FLOWCHARTS = [
  {
    id: 'wont-run',
    title: 'My watch won’t run',
    summary: 'Dead or stopped — from power source to oscillator.',
    icon: 'alert',
    start: 'type',
    nodes: {
      type: {
        text: 'Is it a quartz (battery) or a mechanical (wound) watch?',
        options: [
          { label: 'Quartz — takes a battery', next: 'q-batt' },
          { label: 'Mechanical — you wind it', next: 'm-wind' },
        ],
      },
      'q-batt': {
        text: 'Have you fitted a fresh silver-oxide cell?',
        options: [
          { label: 'Not yet', next: 'leaf-batt' },
          { label: 'Yes, a new one', next: 'q-contacts' },
        ],
      },
      'leaf-batt': {
        conclusion: 'Start with a fresh cell — a flat battery stops the large majority of quartz watches. Fit the correct code and retest.',
        lessonId: 'quartz-battery',
        tone: 'good',
      },
      'q-contacts': {
        text: 'Are the battery contacts clean — no green crust or corrosion?',
        options: [
          { label: 'There’s corrosion', next: 'leaf-corrosion' },
          { label: 'Clean and bright', next: 'q-4sec' },
        ],
      },
      'leaf-corrosion': {
        conclusion: 'Clean the corroded contacts (fibreglass pen / Rodico) back to bright metal, then retest with a good cell.',
        lessonId: 'quartz-corrosion',
        tone: 'warn',
      },
      'q-4sec': {
        text: 'Does the seconds hand tick once every 4 seconds?',
        options: [
          { label: 'Yes — a 4-second jump', next: 'leaf-module1' },
          { label: 'No — totally still', next: 'leaf-module2' },
        ],
      },
      'leaf-module1': {
        conclusion: 'A 4-second jump straight after fitting a new cell can be normal, because many chips only re-check the voltage about once a minute and some wait longer. Give it a few minutes. If it persists, look for mechanical load first: sluggish gears, hands touching, or particles on the rotor. Try the reset (AC) contact if the calibre has one, and only then replace the module.',
        lessonId: 'quartz-module',
        tone: 'warn',
      },
      'leaf-module2': {
        conclusion: 'Good cell + clean contacts but dead still → the movement itself has failed. For most quartz calibres the fix is a fresh module, not a repair.',
        lessonId: 'quartz-module',
        tone: 'bad',
      },
      'm-wind': {
        text: 'Does it wind at all when you turn the crown?',
        options: [
          { label: 'No — the crown won’t wind', next: 'leaf-power' },
          { label: 'Yes — it winds', next: 'q-jam' },
        ],
      },
      'leaf-power': {
        conclusion: 'No winding at all points to the power path — a broken mainspring, or a fault in the keyless works.',
        lessonId: 'diag-winding',
        tone: 'bad',
      },
      'q-jam': {
        text: 'Under a loupe, is a hand or a loose part obviously fouling the works?',
        options: [
          { label: 'Yes — something’s catching', next: 'leaf-foul' },
          { label: 'Nothing obvious', next: 'q-balance' },
        ],
      },
      'leaf-foul': {
        conclusion: 'Free the fouling part — hands touching each other or the dial is a common, easy fix. Re-seat them at the correct heights.',
        lessonId: 'mech-hands-dial',
        tone: 'good',
      },
      'q-balance': {
        text: 'Puff air at the balance — does it swing and keep going?',
        options: [
          { label: 'Yes, it swings freely', next: 'leaf-service1' },
          { label: 'No, it won’t sustain', next: 'leaf-service2' },
        ],
      },
      'leaf-service1': {
        conclusion: 'The escapement is fine, so the stall is elsewhere — usually dirt or dried oil in the train. It’s due a full service.',
        lessonId: 'svc-overview',
        tone: 'warn',
      },
      'leaf-service2': {
        conclusion: 'The balance can’t sustain → dirt, dried oil, or damage (a knocked balance staff). It needs a service, and possibly balance work.',
        lessonId: 'svc-overview',
        tone: 'bad',
      },
    },
  },

  {
    id: 'bad-time',
    title: 'It runs but keeps bad time',
    summary: 'Fast, slow, or erratic — read the pattern.',
    icon: 'clock',
    start: 'pattern',
    nodes: {
      pattern: {
        text: 'What’s the pattern of the error?',
        options: [
          { label: 'Gaining — runs fast', next: 'leaf-mag' },
          { label: 'Losing, or stops when still', next: 'leaf-slow' },
          { label: 'Erratic — varies by position', next: 'leaf-erratic' },
          { label: 'Only a few seconds a day out', next: 'leaf-regulate' },
        ],
      },
      'leaf-mag': {
        conclusion: 'Gaining minutes a day is magnetism until proven otherwise. Wave it over a compass — if the needle twitches, demagnetise it (free and instant).',
        lessonId: 'diag-timekeeping',
        tone: 'good',
      },
      'leaf-slow': {
        conclusion: 'Losing time and low amplitude point to old, thick oil or worn pivots. The watch is asking for a service.',
        lessonId: 'svc-overview',
        tone: 'warn',
      },
      'leaf-erratic': {
        conclusion: 'Big swings between positions suggest a poise problem, a damaged hairspring, or an escapement fault — check the trace on a timegrapher.',
        lessonId: 'mech-regulate',
        tone: 'bad',
      },
      'leaf-regulate': {
        conclusion: 'Healthy but a touch off — it simply needs regulating. Aim for a small daily gain (0 to +10 s/day).',
        lessonId: 'mech-regulate',
        tone: 'good',
      },
    },
  },

  {
    id: 'winding',
    title: 'Crown / winding problem',
    summary: 'Won’t wind, won’t set, gritty, or falls out.',
    icon: 'alert',
    start: 'symptom',
    nodes: {
      symptom: {
        text: 'What exactly is the crown doing?',
        options: [
          { label: 'Winds but won’t set (or vice-versa)', next: 'leaf-clutch1' },
          { label: 'Spins freely — nothing happens', next: 'leaf-clutch2' },
          { label: 'Gritty or stiff to operate', next: 'leaf-gritty' },
          { label: 'Pulls all the way out', next: 'leaf-lever' },
        ],
      },
      'leaf-clutch1': {
        conclusion: 'The sliding pinion isn’t reaching one of its positions — usually the yoke or setting-lever spring is worn, dislodged, or gummed up.',
        lessonId: 'diag-winding',
        tone: 'warn',
      },
      'leaf-clutch2': {
        conclusion: 'The clutch isn’t engaging, or on a manual the mainspring/ratchet is slipping or broken. Feel for where the connection is lost.',
        lessonId: 'diag-winding',
        tone: 'bad',
      },
      'leaf-gritty': {
        conclusion: 'Dried grease or dirt in the keyless works. Clean it and apply fresh grease to the sliding parts. Don’t force a stiff crown.',
        lessonId: 'diag-winding',
        tone: 'warn',
      },
      'leaf-lever': {
        conclusion: 'Usually the setting-lever screw has loosened. Re-seat the stem and re-tighten the setting lever a turn or two (rotate the crown anticlockwise as it goes in to align the clutch).',
        lessonId: 'diag-winding',
        tone: 'good',
      },
    },
  },

  {
    id: 'water',
    title: 'Water got in',
    summary: 'Act fast — moisture rusts steel within hours.',
    icon: 'anatomy',
    start: 'fog',
    nodes: {
      fog: {
        text: 'Is there fogging or droplets under the crystal?',
        options: [
          { label: 'Yes — I can see moisture', next: 'open' },
          { label: 'No, but it was submerged', next: 'leaf-check' },
        ],
      },
      open: {
        text: 'Can you open the caseback right now?',
        options: [
          { label: 'Yes', next: 'leaf-open' },
          { label: 'No', next: 'leaf-takein' },
        ],
      },
      'leaf-open': {
        conclusion: 'Open it immediately to let moisture escape and stop rust, then dry gently (silica gel or gentle warmth — never high heat). It will still need a service, new gaskets, and a pressure test.',
        lessonId: 'diag-water',
        tone: 'bad',
      },
      'leaf-takein': {
        conclusion: 'Every hour of trapped water rusts pivots and springs. Get it opened as soon as possible — take it to a watchmaker if you can’t open it yourself.',
        lessonId: 'diag-water',
        tone: 'bad',
      },
      'leaf-check': {
        conclusion: 'No visible moisture, but after a real dunking the oils are contaminated and the seals suspect. Have it opened, dried, serviced, and pressure-tested before trusting it near water again.',
        lessonId: 'diag-water',
        tone: 'warn',
      },
    },
  },

  {
    id: 'quartz-dead',
    title: 'Quartz — testing the electronics',
    summary: 'Past the battery: coil, current, and module.',
    icon: 'chip',
    start: 'cell',
    nodes: {
      cell: {
        text: 'With a FRESH silver-oxide cell fitted and the contacts clean, what happens?',
        options: [
          { label: 'It runs fine now', next: 'leaf-fixed' },
          { label: 'Seconds hand jumps every 4 s', next: 'leaf-4sec' },
          { label: 'Still dead or erratic', next: 'coil' },
        ],
      },
      'leaf-fixed': {
        conclusion: 'It was the cell or the contacts — the usual culprits. Note the calibre and battery code, then reseal and pressure-test.',
        lessonId: 'quartz-battery',
        tone: 'good',
      },
      'leaf-4sec': {
        conclusion: 'A 4-second jump straight after fitting a new cell can be normal, because many chips only re-check the voltage about once a minute and some wait longer. Give it a few minutes. If it persists, check for a poor contact and mechanical load: sluggish gears, hands touching, or rotor particles. Try the reset (AC) contact if the calibre has one, and only then replace the module.',
        lessonId: 'quartz-diagnose',
        tone: 'warn',
      },
      coil: {
        text: 'Measure the motor coil with a multimeter (kΩ). What do you read?',
        options: [
          { label: 'About 1–3 kΩ, or in the calibre’s range', next: 'current' },
          { label: 'Open circuit (OL / infinite)', next: 'leaf-coil' },
          { label: 'Far below the range', next: 'leaf-coil-short' },
        ],
      },
      'leaf-coil': {
        conclusion: 'An open coil — the hair-fine winding has broken or corroded through. That’s a module replacement.',
        lessonId: 'quartz-test',
        tone: 'bad',
      },
      'leaf-coil-short': {
        conclusion: 'A reading far below the calibre’s range points to shorted turns in the coil, which is a module replacement. Check the sheet first if you have one: an ETA 955 coil is 1.30–1.80 kΩ, so low readings vary by calibre.',
        lessonId: 'quartz-test',
        tone: 'bad',
      },
      current: {
        text: 'Put the meter in series on the µA range. What’s the current draw?',
        options: [
          { label: 'Steady and high (tens of µA+)', next: 'leaf-short' },
          { label: 'None at all', next: 'leaf-ic' },
          { label: 'Tiny average, once-a-second spikes', next: 'leaf-jam' },
        ],
      },
      'leaf-short': {
        conclusion: 'A heavy, steady draw means a short or a failed IC draining the cell. Replace the module.',
        lessonId: 'quartz-test',
        tone: 'bad',
      },
      'leaf-ic': {
        conclusion: 'A good coil but no current pulses points to a dead IC or crystal. Replace the module.',
        lessonId: 'quartz-test',
        tone: 'bad',
      },
      'leaf-jam': {
        conclusion: 'The electronics are pulsing correctly but the hands don’t move → a mechanical jam in the train, rotor, or hands. Free the fouling or re-seat the hands rather than replacing the module.',
        lessonId: 'quartz-module',
        tone: 'warn',
      },
    },
  },
]

export const FLOWCHARTS = [...BASE_FLOWCHARTS, ...MORE_FLOWCHARTS]

export function getFlowchart(id) {
  return FLOWCHARTS.find((f) => f.id === id)
}
