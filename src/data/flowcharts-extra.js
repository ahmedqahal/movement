// Decision trees added by the knowledge-base expansion. Same shape as
// flowcharts.js: a node is a QUESTION (`text` + `options[{label,next}]`) or a
// LEAF (`conclusion`, optional `lessonId`, and a `tone`).
//
// Leaves that rest on forum posts open with “Forum experience”, so a learner
// can tell them from a maker’s instruction. `lessonId` must be an existing
// lesson. Six further trees are held back until each branch has a source:
// stops dial down, chronograph won’t start or jumps, hand slips, stem pulls
// out, crown won’t screw down, and condensation.

export const MORE_FLOWCHARTS = [
  {
    id: 'low-amp',
    title: 'Low amplitude after a service',
    summary: 'Rule out a bad reading first, then test escapement, train and power in turn.',
    icon: 'clock',
    start: 'wound',
    nodes: {
      wound: {
        text: 'Is the watch fully wound, and has it run for about 20 minutes?',
        options: [
          { label: 'No, or not sure', next: 'leaf-wind' },
          { label: 'Yes', next: 'lift' },
        ],
      },
      'leaf-wind': {
        conclusion: 'Wind at least 10 to 15 crown turns, and more if it had run down, because a full wind can take far more: about 40 on a Miyota 9075. On a calibre that doesn’t hand-wind, wear it for a full day. Let it run about 20 minutes, then measure again. A half-wound watch reads low because the spring is depleted, so this may be a reading problem and not a fault. If it still reads low, come back and answer yes.',
        lessonId: 'tm-low-amp',
        tone: 'good',
      },
      lift: {
        text: 'Is the lift angle on the machine set for this calibre?',
        options: [
          { label: 'No, or it’s on the default', next: 'leaf-lift' },
          { label: 'Yes, it’s correct', next: 'band' },
        ],
      },
      'leaf-lift': {
        conclusion: 'Set it first, because the amplitude on the screen scales directly with the lift angle. Multiply the reading by the true lift angle and divide by the one you entered to see the real figure. The “Timegrapher targets & lift angles” reference lists values by confidence. If it still reads low, come back and answer yes.',
        lessonId: 'tm-lift-angle',
        tone: 'good',
      },
      band: {
        text: 'Dial up at full wind, what does it read?',
        options: [
          { label: '250° or more', next: 'leaf-inband' },
          { label: 'Below 250°', next: 'curve' },
        ],
      },
      'leaf-inband': {
        conclusion: 'This is not a failed service. 270–310° is the goal, and 250–330° flat is Witschi’s service tolerance. Check two more things: verticals should sit within about 40° of dial up, and amplitude after 24 h should be no more than 15% down. If both hold, stop chasing it. If not, continue as if it read below 250°.',
        lessonId: 'svc-test',
        tone: 'good',
      },
      curve: {
        text: 'When you change position, does the trace take a long curve before it settles?',
        options: [
          { label: 'Yes, a long curve', next: 'leaf-bearings' },
          { label: 'No, it settles quickly', next: 'doubled' },
        ],
      },
      'leaf-bearings': {
        conclusion: 'The bearings are dry or badly lubricated. Clean and lubricate them again, then repeat the same position change. The trace should now settle quickly.',
        lessonId: 'svc-oil',
        tone: 'warn',
      },
      doubled: {
        text: 'Is the trace an irregular, doubled, wavy line?',
        options: [
          { label: 'Yes', next: 'leaf-overhaul' },
          { label: 'No, the lines are clean', next: 'scope' },
        ],
      },
      'leaf-overhaul': {
        conclusion: 'That pattern points to a worn or dirty movement, usually with low amplitude. Retest first, because a loose clamp or noise can look similar. If it repeats, the movement needs another overhaul, with close inspection of pivots and jewels.',
        lessonId: 'svc-overview',
        tone: 'bad',
      },
      scope: {
        text: 'If your machine has a scope mode, does it show friction, excess endshake or a rough pivot?',
        options: [
          { label: 'Yes', next: 'leaf-scope' },
          { label: 'No, or I have no scope mode', next: 'train' },
        ],
      },
      'leaf-scope': {
        conclusion: 'Deal with the fault the scope shows. Check endshake and sideshake on the balance and train, and inspect the pivots under magnification. Then remeasure before you touch the oil.',
        lessonId: 'rest-endshake',
        tone: 'warn',
      },
      train: {
        text: 'Let down the power and take out the balance and pallet fork. Under a little power, does the train run freely?',
        options: [
          { label: 'No, it drags', next: 'leaf-train' },
          { label: 'Yes, it runs freely', next: 'spring' },
        ],
      },
      'leaf-train': {
        conclusion: 'Forum experience: find the drag before you re-oil anything. Check for an over-tightened train bridge, worn barrel arbor pivots and excess endshake. Free one wheel at a time until you find which one drags. Fix that, then retest the train.',
        lessonId: 'tm-isolate',
        tone: 'warn',
      },
      spring: {
        text: 'Do you know the mainspring is the right one for this calibre?',
        options: [
          { label: 'No, or it’s a second-hand watch', next: 'leaf-spring' },
          { label: 'Yes, it’s correct', next: 'auto' },
        ],
      },
      'leaf-spring': {
        conclusion: 'A weak spring gives low amplitude, and a second-hand watch may already hold the wrong one. Measure it against the calibre’s listed size. Forum experience is that the mainspring is rarely to blame, so if it is correct, come back and carry on.',
        lessonId: 'mech-mainspring',
        tone: 'warn',
      },
      auto: {
        text: 'Is it an automatic?',
        options: [
          { label: 'Yes', next: 'leaf-grease' },
          { label: 'No, manual wind', next: 'leaf-dry' },
        ],
      },
      'leaf-grease': {
        conclusion: 'Forum experience: barrel wall grease changes the reading, and 8217 may read lower than P125. Note which grease you used before you change anything. If the grease is not the answer, work through the isolation checks for a manual watch: fluff under the balance, an over-tightened balance cock, too much lock, and excess oil.',
        lessonId: 'tm-isolate',
        tone: 'warn',
      },
      'leaf-dry': {
        conclusion: 'Forum experience: reassemble the watch dry to see whether the lubrication is the cause. Run it dry only long enough for a reading, because dry pivots wear. Then check for an over-tightened balance cock, fluff under the balance, a contaminated cleaning jar, fork jewels left unpegged, too much lock, and excess oil. One poster regained about 30° from checks like these. If none helps, take it to a watchmaker.',
        lessonId: 'tm-isolate',
        tone: 'warn',
      },
    },
  },

  {
    id: 'runs-fast',
    title: 'Runs fast or gains hours',
    summary: 'Magnetism first, then stuck coils, then a bent or touching hairspring.',
    icon: 'clock',
    start: 'trace',
    nodes: {
      trace: {
        text: 'What does the timegrapher show?',
        options: [
          { label: 'A sudden big gain with clean, steep lines', next: 'compass' },
          { label: 'Scattered dots below the line, with a scratching sound', next: 'leaf-touching' },
          { label: 'I don’t have a timegrapher', next: 'compass' },
        ],
      },
      'leaf-touching': {
        conclusion: 'The hairspring is touching the pins or stud. Centre the hairspring, then re-regulate. The dots and the scratching sound should both go.',
        lessonId: 'rest-hairspring',
        tone: 'warn',
      },
      compass: {
        text: 'Hold a compass near the watch. Does the needle move when the watch is 1 to 2 cm away?',
        options: [
          { label: 'Yes, it moves', next: 'demag' },
          { label: 'No', next: 'coils' },
        ],
      },
      demag: {
        text: 'Demagnetise it. Hold the button before you approach, lift slowly to about 30 cm, then release. Is the rate back to normal?',
        options: [
          { label: 'Yes', next: 'leaf-fixed' },
          { label: 'No, it’s still fast', next: 'coils' },
        ],
      },
      'leaf-fixed': {
        conclusion: 'It was magnetism. A typical magnetised gain is +2 to +10 minutes a day, and hours in severe cases. Don’t tap the button over the watch, because that can leave it worse. Find what magnetised it, and recheck the rate tomorrow.',
        lessonId: 'diag-magnetism',
        tone: 'good',
      },
      coils: {
        text: 'Under the loupe, are the hairspring coils stuck together by oil or dirt?',
        options: [
          { label: 'Yes, or they look oily', next: 'leaf-stuck' },
          { label: 'No, the coils are clear', next: 'bent' },
        ],
      },
      'leaf-stuck': {
        conclusion: 'Forum experience, backed by one article: coils stuck by oil or dirt make a watch gain. Clean the balance and hairspring, and keep the shellac rule in mind. Retest. The rate should fall back. If it is still fast, look for a bent spring.',
        lessonId: 'svc-clean',
        tone: 'warn',
      },
      bent: {
        text: 'Watch the hairspring as it breathes. Is it bent, or do any coils touch?',
        options: [
          { label: 'Yes', next: 'leaf-bent' },
          { label: 'No, it looks true', next: 'leaf-unknown' },
        ],
      },
      'leaf-bent': {
        conclusion: 'Forum experience: a bent spring or touching coils can cause a large gain. Truing a hairspring is delicate work, so practise on a scrap balance first, or take it to a watchmaker.',
        lessonId: 'rest-hairspring',
        tone: 'bad',
      },
      'leaf-unknown': {
        conclusion: 'None of the usual causes shows up. Time it in several positions and compare the trace with the “Trace atlas quick reference”. If it gains only a few seconds a day it just needs regulating. If it still gains badly, take it to a watchmaker.',
        lessonId: 'mech-regulate',
        tone: 'warn',
      },
    },
  },

  {
    id: 'stops-daily',
    title: 'Stops at the same time each day',
    summary: 'Usually calendar load. Based on forum experience, not a maker’s rule.',
    icon: 'clock',
    start: 'type',
    nodes: {
      type: {
        text: 'Is it a mechanical or a quartz watch?',
        options: [
          { label: 'Mechanical', next: 'when' },
          { label: 'Quartz', next: 'leaf-quartz' },
        ],
      },
      'leaf-quartz': {
        conclusion: 'Date changes raise motor demand on a quartz watch, so a tired cell or a stiff calendar can stall it at the change. Fit a fresh cell, then look for mechanical load: sluggish gears or hands touching.',
        lessonId: 'quartz-diagnose',
        tone: 'warn',
      },
      when: {
        text: 'What happens around the date change?',
        options: [
          { label: 'It stops at or near the change', next: 'leaf-calendar' },
          { label: 'It keeps running, but the hands lose time', next: 'leaf-cannon' },
          { label: 'It stops at some other time', next: 'leaf-spring' },
        ],
      },
      'leaf-calendar': {
        conclusion: 'Forum experience: calendar load, or date wheel friction with the dial, is the leading suspect. Turn the hands slowly through midnight and feel for a stiff spot. Under the dial, look for damage and for the date wheel rubbing. Keep the hands away from midnight when you take timing readings, because the date change distorts them.',
        lessonId: 'comp-date',
        tone: 'warn',
      },
      'leaf-cannon': {
        conclusion: 'Forum experience: the cannon pinion may be slipping under the date load. Check its friction when you set the hands. A pinion with almost no resistance needs tightening, a little at a time.',
        lessonId: 'diag-handfriction',
        tone: 'warn',
      },
      'leaf-spring': {
        conclusion: 'Forum experience: if the date is not involved, suspect a weak spring or a heavy train. Measure amplitude at full wind and again after 24 h. A large fall points to the mainspring or to the train.',
        lessonId: 'diag-lowamp',
        tone: 'warn',
      },
    },
  },

  {
    id: 'auto-no-wind',
    title: 'Automatic doesn’t wind',
    summary: 'Hand-wind it first, then separate reversers, rotor bearing and gears.',
    icon: 'alert',
    start: 'crown',
    nodes: {
      crown: {
        text: 'Wind it with the crown. How does it feel?',
        options: [
          { label: 'Normal, and the click holds', next: 'rotor' },
          { label: 'This calibre doesn’t hand-wind (7S26, 7009, 6309)', next: 'rotor' },
          { label: 'Stiff, while the rotor spins freely', next: 'eta' },
          { label: 'It slips, or won’t wind at all', next: 'leaf-keyless' },
        ],
      },
      'leaf-keyless': {
        conclusion: 'This isn’t an automatic fault yet. If hand-winding fails too, start with the keyless works and the mainspring, using the crown and winding chart.',
        lessonId: 'diag-winding',
        tone: 'bad',
      },
      eta: {
        text: 'A stiff stem with a free rotor points to seized reversers. Is it an ETA 2824-2?',
        options: [
          { label: 'Yes', next: 'leaf-2824' },
          { label: 'No, another calibre', next: 'leaf-reversers' },
        ],
      },
      'leaf-2824': {
        conclusion: 'Replace the reversing wheels (positions 27 and 28) with original pre-lubricated parts. ETA marks them do-not-wash, so don’t clean and re-oil them. Check by winding: the crown should turn freely and the rotor should now wind the watch.',
        lessonId: 'svc-2824',
        tone: 'warn',
      },
      'leaf-reversers': {
        conclusion: 'Forum experience: stiff winding with a free rotor means seized reversers. Check your calibre’s sheet before you wash them, because ETA forbids it on the 2824-2 and others may too. Then free or replace them, and retest on a winder or by hand.',
        lessonId: 'svc-auto',
        tone: 'warn',
      },
      rotor: {
        text: 'With the back off, how does the rotor move?',
        options: [
          { label: 'Noisy or scraping', next: 'leaf-bearing' },
          { label: 'Smooth and quiet', next: 'leaf-gears' },
        ],
      },
      'leaf-bearing': {
        conclusion: 'Forum experience: a worn bearing or a bent rotor. Look for rub marks on the case or bridge, and rock the rotor gently to feel for play. Some rotor noise is normal on some calibres, such as Miyota, so a noise alone is not proof of a fault.',
        lessonId: 'svc-auto',
        tone: 'warn',
      },
      'leaf-gears': {
        conclusion: 'Forum experience: if the click holds when you hand-wind, the fault lies in the automatic gears. Remove the automatic works and check that each wheel turns and that the reversers work one way only. Witschi recommends testing self-winding on a simulator after the repair.',
        lessonId: 'svc-auto',
        tone: 'warn',
      },
    },
  },

  {
    id: 'date-wrong',
    title: 'Date wrong or weak',
    summary: 'Changes at noon, sticks, or jammed while being set.',
    icon: 'clock',
    start: 'symptom',
    nodes: {
      symptom: {
        text: 'What is the date doing?',
        options: [
          { label: 'It changes around noon', next: 'leaf-noon' },
          { label: 'It sticks, or changes weakly', next: 'eta' },
          { label: 'It jammed while I was setting it', next: 'leaf-window' },
        ],
      },
      'leaf-noon': {
        conclusion: 'The time is set 12 hours out. Pull the crown to the time-setting position and run the hands forward through a full 12 hours, then reset the date if it moved. Stopping at the first correct reading after the date flips can leave it 12 hours out. Check it the next day: the date should change around midnight.',
        lessonId: 'comp-date',
        tone: 'good',
      },
      eta: {
        text: 'Is it an ETA 2824-2?',
        options: [
          { label: 'Yes', next: 'leaf-jumper' },
          { label: 'No, another calibre', next: 'leaf-other' },
        ],
      },
      'leaf-jumper': {
        conclusion: 'Check the date jumper’s lubrication. ETA’s routine: lubricate position 40, advance the date indicator about 10 teeth with rapid correction, and repeat, for three oilings. Then run it through several date changes.',
        lessonId: 'svc-2824',
        tone: 'warn',
      },
      'leaf-other': {
        conclusion: 'The date jumper is the first place to look. Follow your calibre’s own sheet, because the ETA 2824-2 routine does not automatically apply elsewhere. Run it through several date changes to check.',
        lessonId: 'comp-calendar',
        tone: 'warn',
      },
      'leaf-window': {
        conclusion: 'Stop, and don’t force it. Move the hands well away from midnight, to about 6 o’clock, before you set the date again. One reference site gives the windows to avoid as 9 pm to 3 am on the ETA 2836-2 and 2834-2, 9 pm to 1 am on the Seiko 6R35 and 6R54, and 8 pm to 2 am on the 8L35. If it still will not move, the date work needs opening up.',
        lessonId: 'comp-date',
        tone: 'bad',
      },
    },
  },

  {
    id: 'chrono-reset',
    title: 'Chronograph doesn’t reset',
    summary: 'Same wrong place or different places. Based on forum experience.',
    icon: 'alert',
    start: 'where',
    nodes: {
      where: {
        text: 'Run and reset it several times. Where does the hand land?',
        options: [
          { label: 'The same wrong place every time', next: 'leaf-refit' },
          { label: 'A different place each time', next: 'hammer' },
        ],
      },
      'leaf-refit': {
        conclusion: 'Forum experience: the hand was probably set wrongly, so refit it at zero. Reset the chronograph first, lift the hand, and press it back at the zero mark. Then run and reset it several times to check.',
        lessonId: 'chrono-service',
        tone: 'good',
      },
      hammer: {
        text: 'With the movement open, does the hammer seat fully on the seconds heart, leaving a small gap at the minute counter?',
        options: [
          { label: 'No', next: 'leaf-hammer' },
          { label: 'Yes, it seats and leaves the gap', next: 'leaf-seats' },
        ],
      },
      'leaf-hammer': {
        conclusion: 'Forum experience: the hammer may be slipping off the heart cam. It needs to seat fully on the seconds heart and still leave a small gap at the minute counter. How you adjust it depends on the calibre, so read the sheet before you change anything.',
        lessonId: 'chrono-service',
        tone: 'warn',
      },
      'leaf-seats': {
        conclusion: 'The hammer geometry looks right, and the forum evidence stops here. This app has no sourced next step, so check the calibre’s sheet or take it to a watchmaker.',
        lessonId: 'chrono-service',
        tone: 'bad',
      },
    },
  },

  {
    id: 'quartz-stutter',
    title: 'Quartz skips or stutters',
    summary: 'Battery warning or mechanical load? A new cell tells them apart.',
    icon: 'chip',
    start: 'pattern',
    nodes: {
      pattern: {
        text: 'What is the seconds hand doing?',
        options: [
          { label: 'Jumping in 4-second steps', next: 'cell' },
          { label: 'Moving every 2 seconds', next: 'leaf-two' },
          { label: 'Stuttering or missing steps', next: 'load' },
        ],
      },
      'leaf-two': {
        conclusion: 'On a solar or Kinetic watch this is a charge warning, not a battery fault. Use the “Ticks in 2-second steps” chart.',
        lessonId: 'quartz-solar',
        tone: 'good',
      },
      cell: {
        text: 'Have you fitted a new cell?',
        options: [
          { label: 'Not yet', next: 'leaf-cell' },
          { label: 'Yes, a new one', next: 'wait' },
        ],
      },
      'leaf-cell': {
        conclusion: 'This is the usual end-of-life signal. Witschi says it typically starts about 1.25 V, and ETA triggers it below 1.30 V. Replace the cell with the correct code, and handle it with plastic tweezers.',
        lessonId: 'quartz-battery',
        tone: 'good',
      },
      wait: {
        text: 'Voltage is usually checked only once a minute, and some calibres wait longer (ETA’s 251.264 waits 60 minutes). Wait, then look again. Has it cleared?',
        options: [
          { label: 'Yes, back to 1-second steps', next: 'leaf-cleared' },
          { label: 'No, it still jumps', next: 'load' },
        ],
      },
      'leaf-cleared': {
        conclusion: 'It was only the delay. If the calibre has an AC contact, check its sheet to see whether a reset is needed after a cell change. Reseal the case and pressure-test it.',
        lessonId: 'quartz-battery',
        tone: 'good',
      },
      load: {
        text: 'Fit a fresh cell if you haven’t already. The chip raises motor power when it detects missed steps, so look for mechanical load. What do you find?',
        options: [
          { label: 'Hands touching each other or the glass', next: 'leaf-hands' },
          { label: 'Steel particles at the rotor', next: 'leaf-rotor' },
          { label: 'A sluggish train', next: 'leaf-train' },
          { label: 'Nothing I can see', next: 'leaf-module' },
        ],
      },
      'leaf-hands': {
        conclusion: 'Re-seat the hands so they clear each other and the glass at every position. Check all the way round the dial, then watch a full minute of steps.',
        lessonId: 'mech-hands-dial',
        tone: 'good',
      },
      'leaf-rotor': {
        conclusion: 'Clean the step rotor, because steel particles at the rotor make it miss steps. Keep tweezers and tools away from the coil, then retest with a fresh cell.',
        lessonId: 'quartz-diagnose',
        tone: 'warn',
      },
      'leaf-train': {
        conclusion: 'Sluggish gears raise the load on the motor. A quartz train needs cleaning like any other, and plastic parts need a compatible oil. If the movement is not worth servicing, replace the module.',
        lessonId: 'quartz-module',
        tone: 'warn',
      },
      'leaf-module': {
        conclusion: 'With a good cell and no mechanical load, measure the coil and current against the calibre’s limits. If they are out of range, the fix for most quartz calibres is a new module.',
        lessonId: 'quartz-test',
        tone: 'bad',
      },
    },
  },

  {
    id: 'quartz-drain',
    title: 'Quartz drains batteries',
    summary: 'Measure current against the maker’s limit, then coil, contacts and load.',
    icon: 'chip',
    start: 'measure',
    nodes: {
      measure: {
        text: 'Measure current on a watch tester and compare it with the maker’s limit. What do you find?',
        options: [
          { label: 'Within the limit', next: 'leaf-normal' },
          { label: 'Too high', next: 'coil' },
          { label: 'I only have a multimeter', next: 'leaf-meter' },
        ],
      },
      'leaf-normal': {
        conclusion: 'The movement isn’t draining the cell. Check you fitted the right code and drain type, and estimate the expected life: months ≈ mAh × 1000 ÷ µA ÷ 730. If that matches what you see, the watch is behaving normally.',
        lessonId: 'quartz-battery',
        tone: 'good',
      },
      'leaf-meter': {
        conclusion: 'Most general meters can’t resolve limits such as ETA’s 1.20 µA, so a consumption check needs a watch tester. Typical totals are 0.7–1.2 µA with a seconds hand and 0.5–0.7 µA without, though the maker’s limit governs. You can still check the coil, contacts and load: come back and answer “Too high” to walk through them, or ask a watchmaker to measure it.',
        lessonId: 'quartz-test',
        tone: 'warn',
      },
      coil: {
        text: 'Measure the coil with a low-voltage ohmmeter. What do you read?',
        options: [
          { label: 'In the calibre’s range, normally 1–3 kΩ', next: 'tongue' },
          { label: 'Open circuit', next: 'leaf-open' },
          { label: 'Much lower than the range', next: 'leaf-shorted' },
        ],
      },
      'leaf-open': {
        conclusion: 'An open reading means a broken coil. For most quartz calibres that is a module replacement.',
        lessonId: 'quartz-module',
        tone: 'bad',
      },
      'leaf-shorted': {
        conclusion: 'A reading much lower than the range means shorted turns. Check the sheet first, because ranges vary by calibre: an ETA 955 is 1.30–1.80 kΩ. If it is truly low, replace the module.',
        lessonId: 'quartz-module',
        tone: 'bad',
      },
      tongue: {
        text: 'Is the negative contact tongue touching the circuit board?',
        options: [
          { label: 'Yes', next: 'leaf-tongue' },
          { label: 'No', next: 'load' },
        ],
      },
      'leaf-tongue': {
        conclusion: 'That contact drains the cell. Ease the tongue clear of the board, then measure the current again. It should fall inside the limit.',
        lessonId: 'quartz-test',
        tone: 'warn',
      },
      load: {
        text: 'Is the train stiff, or do the hands touch?',
        options: [
          { label: 'Yes', next: 'leaf-load' },
          { label: 'No', next: 'leaf-module' },
        ],
      },
      'leaf-load': {
        conclusion: 'Mechanical load makes the motor work harder. Free the hands, or clean the train, then retest. On Seiko calibres, high whole-movement current with a normal block figure points the same way.',
        lessonId: 'quartz-diagnose',
        tone: 'warn',
      },
      'leaf-module': {
        conclusion: 'Current is high with a good coil, clear contacts and no mechanical load, so suspect the circuit. For most quartz calibres the fix is a new module.',
        lessonId: 'quartz-module',
        tone: 'bad',
      },
    },
  },

  {
    id: 'two-second',
    title: 'Ticks in 2-second steps',
    summary: 'A charge warning on solar and Kinetic watches, not the 4-second battery signal.',
    icon: 'chip',
    start: 'type',
    nodes: {
      type: {
        text: 'What kind of watch is it?',
        options: [
          { label: 'Solar', next: 'solar' },
          { label: 'Kinetic', next: 'kinetic' },
          { label: 'Ordinary battery quartz', next: 'steps' },
        ],
      },
      solar: {
        text: 'This is the low-charge warning. Expose it to light as the manual says, but not above about 60 °C, and keep any incandescent lamp at least 50 cm away. Is it back to 1-second steps?',
        options: [
          { label: 'Yes', next: 'leaf-solar-ok' },
          { label: 'No, not after a full charge', next: 'leaf-solar-cell' },
        ],
      },
      'leaf-solar-ok': {
        conclusion: 'It only needed charging. Time left in this mode varies: about 4 days on a Citizen E168, 5 on an H500, 7 on an E21x, and about a week on an Epson VS75B. After a complete discharge, some calibres need an All Reset.',
        lessonId: 'quartz-solar',
        tone: 'good',
      },
      'leaf-solar-cell': {
        conclusion: 'Our reasoning, not a Citizen instruction: run a consumption check on an external supply. If it runs on the supply but not on the cell, suspect the cell. If it fails on the supply too, suspect the module. Fit only the rechargeable part the sheet names. Citizen warns a conventional battery can overcharge and damage the watch.',
        lessonId: 'quartz-solar',
        tone: 'warn',
      },
      kinetic: {
        text: 'Swing it side to side at 2 to 3 swings a second through about a 20 cm arc. About 250 swings restores 1-second motion from a stop. Is it back to 1-second steps?',
        options: [
          { label: 'Yes', next: 'leaf-kinetic-ok' },
          { label: 'No, or it soon drops back', next: 'leaf-kinetic-cell' },
        ],
      },
      'leaf-kinetic-ok': {
        conclusion: 'It only needed charging. About 250 swings gives about a day of power, so wear it or keep swinging it. Wait 10 to 15 minutes after charging before you trust the power-reserve button.',
        lessonId: 'quartz-solar',
        tone: 'good',
      },
      'leaf-kinetic-cell': {
        conclusion: 'Test the generator as Seiko’s 5M62 guide does. Measure cell voltage, close the back, swing 200 times, and re-measure within 3 minutes. A rise of more than 0.06 V from an initial 0.5 to 1.0 V means the generator works. Rising voltage that then collapses suggests a tired cell, and no rise suggests generator trouble. Fit only the exact unit, because the 5M6 and 5M4 parts look alike.',
        lessonId: 'quartz-solar',
        tone: 'warn',
      },
      steps: {
        text: 'Look again. Does it move once every 2 seconds, or jump 4 steps every 4 seconds?',
        options: [
          { label: 'A jump every 4 seconds', next: 'leaf-eol' },
          { label: 'Once every 2 seconds', next: 'leaf-sheet' },
        ],
      },
      'leaf-eol': {
        conclusion: 'That is the standard battery end-of-life signal. Replace the cell. If it still jumps after a few minutes, use the “Quartz skips or stutters” chart.',
        lessonId: 'quartz-battery',
        tone: 'good',
      },
      'leaf-sheet': {
        conclusion: 'Our sources cover 2-second motion on solar and Kinetic watches only. Check whether it really has a primary cell, and read the calibre’s sheet. Never fit a primary cell in place of a rechargeable one.',
        lessonId: 'quartz-identify',
        tone: 'warn',
      },
    },
  },
]
