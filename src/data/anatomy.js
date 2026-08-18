// Part data for the interactive anatomy diagrams.
// Each part: id, name, role, short (one line), detail (2-3 sentences).
// `role` drives the colour accent used by the diagram + info panel.

export const ROLES = {
  energy: { label: 'Power source', color: '#d0a84f' },
  transmission: { label: 'Transmission', color: '#c7b48f' },
  regulator: { label: 'Regulator', color: '#c25863' },
  electronic: { label: 'Electronics', color: '#86a7bd' },
  interface: { label: 'Interface', color: '#7ba583' },
  complication: { label: 'Complication', color: '#b892d6' },
  sealing: { label: 'Sealing', color: '#86a7bd' },
  structure: { label: 'Structure', color: '#9a8f7d' },
}

export const DIAGRAMS = [
  /* ---------------------------------------------------------------- */
  {
    id: 'mechanical',
    name: 'Mechanical movement',
    tagline: 'How energy flows from a wound spring to the hands',
    note: 'Follow the power: the mainspring drives the going train (centre → third → fourth wheels), the escapement doles that energy out in tiny beats, and the balance sets the rhythm.',
    parts: [
      { id: 'crown', name: 'Crown', role: 'interface', detail: 'Turning the crown winds the mainspring; pulling it out lets you set the time (and often the date). On dive watches the crown screws down against a gasket to keep water out.' },
      { id: 'stem', name: 'Stem (winding stem)', role: 'interface', detail: 'The stem carries your input into the keyless works. To remove the movement from the case you release the stem, usually by pressing a small setting-lever detent.' },
      { id: 'barrel', name: 'Mainspring & barrel', role: 'energy', detail: 'Winding tightens a flat spring inside the barrel. As it slowly unwinds it drives the whole movement — a full wind typically stores 38–70 hours of running (the “power reserve”). Always let this power down before disassembly.' },
      { id: 'geartrain', name: 'Going (gear) train', role: 'transmission', detail: 'A chain of meshing wheels and pinions — centre, third and fourth wheels — transmits the barrel’s torque toward the escapement while gearing it so the hands turn at the right rate. The centre wheel carries the minute hand; the fourth wheel usually carries the seconds.' },
      { id: 'escwheel', name: 'Escape wheel', role: 'regulator', detail: 'The last wheel in the train. Its angled teeth are alternately locked and freed by the pallet fork, so power “escapes” in tiny equal packets — this is what makes a watch tick.' },
      { id: 'pallet', name: 'Pallet fork', role: 'regulator', detail: 'A tiny lever with two jewelled pallets. It alternately blocks the escape wheel and, each time it flips, gives the balance wheel a small push to keep it swinging. The ticking sound is this fork snapping side to side.' },
      { id: 'balance', name: 'Balance wheel', role: 'regulator', detail: 'A weighted wheel that swings back and forth, typically 4–5 times per second (28,800 beats/hour). Its steady oscillation is the timekeeping reference — regulating a watch means fine-tuning this.' },
      { id: 'hairspring', name: 'Hairspring (balance spring)', role: 'regulator', detail: 'An extremely delicate spiral spring that pulls the balance back after each swing, governing its rate. It comes flat, or as a Breguet “overcoil” (raised outer coil) for better isochronism; modern springs use alloys such as Nivarox/Elinvar that resist temperature and magnetism. It is the most fragile part of the movement — never touch it directly.' },
      { id: 'jewels', name: 'Jewels', role: 'structure', detail: 'Hard, smooth synthetic ruby bearings sit at the pivots of fast-moving wheels to cut friction and wear. A typical movement has 17–25 jewels; more isn’t always better, just more pivots supported. The delicate balance pivots run in spring-mounted shock settings (Incabloc, Kif) so they survive knocks.' },
      { id: 'mainplate', name: 'Mainplate & bridges', role: 'structure', detail: 'The mainplate is the base of the movement; bridges are the partial plates screwed over it to hold the wheels in place. Together they form the skeleton that positions every other part.' },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'escapement',
    name: 'Escapement',
    tagline: 'The tick: how a Swiss lever escapement works',
    note: 'The escapement is the referee between stored power and timekeeping — a lever escapement, perfected from Thomas Mudge’s design of 1750. Every beat has three actions: a tooth locks on a pallet, “draw” holds the fork tight against its banking pin for safety, then the tooth’s impulse face drives the fork, which nudges the balance onward.',
    parts: [
      { id: 'esc-wheel', name: 'Escape wheel', role: 'regulator', detail: 'Powered from the mainspring through the train, it constantly tries to turn. Most have 15 teeth in the modern “club-tooth” form — a flat impulse face plus a locking face (older English wheels used pointed ratchet teeth). The pallet fork releases it one tooth at a time, turning continuous drive into discrete beats.' },
      { id: 'esc-fork', name: 'Pallet fork', role: 'regulator', detail: 'A lever tipped with two pallet stones. Each beat it performs lock (a tooth rests on a pallet), draw (the angled locking face pulls the fork firmly against a banking pin so it can’t unlock accidentally), and impulse (the tooth’s lifting face drives the fork across). Total lever travel is only about 10°.' },
      { id: 'esc-entry', name: 'Entry & exit pallet jewels', role: 'regulator', detail: 'The receiving (entry) and discharging (exit) pallet stones — ruby jewels set at precise angles that actually lock and unlock the escape wheel. These stones and the escape teeth are the only escapement surfaces that are oiled; their geometry and lubrication strongly affect timekeeping.' },
      { id: 'esc-impulse', name: 'Impulse (roller) jewel', role: 'regulator', detail: 'A single ruby pin on the balance’s roller. As the balance swings through centre it enters the fork slot, the fork gives it a nudge, then the balance coasts on its own momentum. A guard pin and the roller’s crescent notch form the “safety” that blocks accidental unlocking. The roller jewel itself is never oiled.' },
      { id: 'esc-balance', name: 'Balance staff & roller', role: 'regulator', detail: 'The balance wheel and roller ride on this staff between two jewels. For best timing the impulse should arrive just as the balance passes its point of rest. A dropped movement most often snaps the fine balance-staff pivots — a classic repair.' },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'automatic',
    name: 'Automatic winding',
    tagline: 'How wrist motion winds the mainspring',
    note: 'An automatic module sits on top of the movement. The rotor swings both ways as you move; a reverser turns that two-way motion into one-way winding that tightens the mainspring.',
    parts: [
      { id: 'auto-rotor', name: 'Rotor (oscillating weight)', role: 'energy', detail: 'A semicircular weight that swings freely on a central bearing as your wrist moves. Its momentum is the energy source that winds the watch — no manual winding needed while worn.' },
      { id: 'auto-bearing', name: 'Rotor bearing', role: 'structure', detail: 'The rotor spins on either a ball bearing or a jewelled bushing at the centre. A worn rotor bearing lets the weight rub the caseback — a common cause of a scraping automatic.' },
      { id: 'auto-reverser', name: 'Reversing wheels (reverser)', role: 'transmission', detail: 'A clever gear cluster that accepts rotor motion in both directions but always outputs one-way rotation. This is what lets the watch wind whether the rotor turns clockwise or anticlockwise.' },
      { id: 'auto-reduction', name: 'Reduction gears', role: 'transmission', detail: 'Step down the rotor’s fast, low-torque spin into the slower, higher-torque turns needed to actually wind the mainspring.' },
      { id: 'auto-ratchet', name: 'Ratchet wheel', role: 'transmission', detail: 'Sits on the barrel arbor and winds the mainspring as it turns. A click (pawl) stops it running backwards, holding the wound power in the barrel.' },
      { id: 'auto-barrel', name: 'Mainspring barrel', role: 'energy', detail: 'The destination of all that winding. An automatic mainspring has a slipping bridle so it can’t be over-wound — it simply slips inside the barrel once fully tensioned.' },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'keyless',
    name: 'Keyless works (winding & setting)',
    tagline: 'How one crown both winds and sets the time',
    note: 'The keyless works switch the crown between two jobs. Pushed in, it winds; pulled out, the clutch shifts so the same crown sets the hands. Watch which pinion the clutch engages.',
    parts: [
      { id: 'kw-crown', name: 'Crown', role: 'interface', detail: 'Your single input. Its position (pushed in vs pulled out) tells the keyless works whether you want to wind or to set the time.' },
      { id: 'kw-stem', name: 'Stem', role: 'interface', detail: 'The shaft from the crown into the movement. It carries the sliding pinion and is gripped by the setting lever so pulling the crown moves parts inside.' },
      { id: 'kw-winding-pinion', name: 'Winding pinion', role: 'transmission', detail: 'Engaged when the crown is pushed in. Turning it drives the crown wheel and ratchet wheel to wind the mainspring.' },
      { id: 'kw-sliding-pinion', name: 'Sliding (clutch) pinion', role: 'transmission', detail: 'Slides along the stem between two positions. It is the clutch that decides whether crown rotation winds the spring or sets the hands.' },
      { id: 'kw-yoke', name: 'Yoke (clutch lever)', role: 'transmission', detail: 'A sprung lever that pushes the sliding pinion back into the winding position when you push the crown home.' },
      { id: 'kw-setting-lever', name: 'Setting lever', role: 'transmission', detail: 'Detects the crown being pulled out and shifts the yoke, throwing the clutch into setting mode. Its small screw or detent is also what you press to release the stem.' },
      { id: 'kw-setting-wheels', name: 'Setting wheels', role: 'transmission', detail: 'When in setting mode, these wheels pass crown rotation to the motion works so you can move the hands.' },
      { id: 'kw-cannon', name: 'Cannon pinion & motion works', role: 'transmission', detail: 'The gearing under the dial that drives the hour and minute hands. The cannon pinion has a friction fit so the hands can be set without disturbing the running train.' },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'chronograph',
    name: 'Chronograph',
    tagline: 'The stopwatch: start, stop, and reset to zero',
    note: 'A chronograph adds a stopwatch on top of the base movement. The column wheel is the brain — each push rotates it, and its columns route the levers to start, stop, or zero the counters.',
    parts: [
      { id: 'ch-pusher-start', name: 'Start / stop pusher', role: 'interface', detail: 'The top pusher (usually at 2 o’clock). Each press advances the column wheel one step, alternately starting and stopping the timing.' },
      { id: 'ch-pusher-reset', name: 'Reset pusher', role: 'interface', detail: 'The lower pusher (usually at 4 o’clock). Pressed while stopped, it drops the hammers to fly the counters back to zero.' },
      { id: 'ch-column', name: 'Column wheel', role: 'complication', detail: 'A tiny castellated wheel that acts as the command centre. Its rotating columns raise and lower the operating levers, sequencing start, stop and reset. (Cheaper chronographs use a flat cam instead.)' },
      { id: 'ch-clutch', name: 'Coupling clutch', role: 'complication', detail: 'Engages and disengages the chronograph from the constantly-running going train. Horizontal clutches swing a wheel into mesh; vertical clutches clamp like a disc — the reason a vertical-clutch chrono seconds hand starts without a stutter.' },
      { id: 'ch-runner', name: 'Chronograph runner', role: 'complication', detail: 'The centre wheel that carries the large sweeping chronograph seconds hand while timing is running.' },
      { id: 'ch-minute', name: 'Minute counter', role: 'complication', detail: 'A sub-dial that advances one step for every full revolution of the chronograph seconds hand, counting elapsed minutes.' },
      { id: 'ch-hammer', name: 'Reset hammers', role: 'complication', detail: 'Spring-loaded arms held clear while timing. On reset they fall against the heart cams and snap the counters instantly to zero.' },
      { id: 'ch-heart', name: 'Heart cam', role: 'complication', detail: 'A heart-shaped cam on each counter wheel. When a hammer strikes it, the cam rotates to its lowest point — which is exactly the zero position — guaranteeing an instant, precise reset.' },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'quartz',
    name: 'Quartz movement',
    tagline: 'How a battery and a crystal keep time',
    note: 'A quartz movement replaces the spring-and-balance with a battery, a vibrating crystal, and a tiny motor. Far fewer moving parts — most repairs are a battery or whole-module swap.',
    parts: [
      { id: 'q-battery', name: 'Battery cell', role: 'energy', detail: 'Usually a 1.55 V silver-oxide cell (e.g. SR626SW / 377) lasting 1–3 years. A dead battery is the single most common quartz “fault.” Swapping it is the easiest real repair to learn.' },
      { id: 'q-ic', name: 'Integrated circuit (IC)', role: 'electronic', detail: 'The chip counts the crystal’s 32,768 vibrations per second and divides them down to exactly one electrical pulse per second, which it sends to the motor.' },
      { id: 'q-crystal', name: 'Quartz crystal', role: 'regulator', detail: 'A tiny quartz tuning fork, sealed in a metal can, vibrates at exactly 32,768 Hz when powered. That rock-steady frequency is why quartz watches are so accurate — this replaces the mechanical balance.' },
      { id: 'q-coil', name: 'Coil', role: 'electronic', detail: 'A fine copper coil around a core. Each pulse from the IC magnetises it, and that magnetic kick drives the stepper motor’s rotor around one step.' },
      { id: 'q-motor', name: 'Stepper motor', role: 'electronic', detail: 'A tiny magnetic rotor advances exactly one step for each pulse — this is the “tick” of a quartz seconds hand. Its motion feeds the gear train.' },
      { id: 'q-train', name: 'Gear train', role: 'transmission', detail: 'A short train of plastic or metal wheels reduces the motor’s once-per-second step into the correct speeds for the second, minute, and hour hands.' },
      { id: 'q-board', name: 'Circuit board & module', role: 'structure', detail: 'Most quartz movements are a self-contained plastic module. When electronics fail, watchmakers usually replace the entire inexpensive module rather than repair the circuitry.' },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'case',
    name: 'Case & water resistance',
    tagline: 'Cross-section: what keeps the movement safe & dry',
    note: 'The case is a sealed sandwich. Three gaskets — crystal, caseback, and crown — do the waterproofing. Disturbing any of them means the seal must be renewed and tested.',
    parts: [
      { id: 'c-crystal', name: 'Crystal', role: 'structure', detail: 'The clear window — acrylic (soft, polishable), mineral glass (harder), or sapphire (hardest, scratch-resistant). It presses or glues into the case against a gasket.' },
      { id: 'c-crystal-gasket', name: 'Crystal gasket', role: 'sealing', detail: 'A ring (often nylon or rubber) compressed between the crystal and case to block water at the front. Replace it whenever the crystal is removed.' },
      { id: 'c-bezel', name: 'Bezel', role: 'structure', detail: 'Holds the crystal and can be fixed or rotating (dive timing). Rotating bezels sit on a click spring and can be pried off for cleaning.' },
      { id: 'c-middle', name: 'Case middle (body)', role: 'structure', detail: 'The central block machined from steel, titanium, or gold. It carries the lugs, the crown tube, and the seats for crystal and caseback.' },
      { id: 'c-movement', name: 'Movement, dial & hands', role: 'structure', detail: 'The movement sits in a movement ring/spacer, with the dial fixed to its front and the hands pressed onto the centre arbors. This whole assembly lifts out once the stem is released.' },
      { id: 'c-caseback', name: 'Caseback', role: 'structure', detail: 'Snap-on (pry with a case knife), screw-down (unscrew with a wrench), or screw-in (uses a bezel-style tool). It’s your access point to the battery and movement.' },
      { id: 'c-back-gasket', name: 'Caseback gasket', role: 'sealing', detail: 'A rubber O-ring seated in a groove around the caseback. Clean its seat, lightly grease with silicone, and replace if flattened or cracked — this is the seal most often disturbed during a battery change.' },
      { id: 'c-crown-tube', name: 'Crown, tube & gasket', role: 'sealing', detail: 'The crown seals against gaskets inside a tube threaded into the case. This is a common leak point; screw-down crowns add a second seal that must be tightened after setting the time.' },
      { id: 'c-lugs', name: 'Lugs & spring bars', role: 'structure', detail: 'The horns of the case hold spring-loaded bars that retain the strap or bracelet. A spring-bar tool compresses these bars to swap straps — the easiest job in watchmaking.' },
    ],
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'service',
    name: 'Service sequence',
    tagline: 'The order a movement comes apart — and goes back together',
    note: 'A full service follows a strict order (and reverses it to rebuild). Click each stage to see what happens and why the sequence matters. Reassembly runs from bottom to top.',
    parts: [
      { id: 'ts-power', name: '1 · Let down the power', role: 'regulator', detail: 'Before anything, discharge the mainspring by controlling the crown while lifting the click. Disassembling a wound movement can wreck the train and fling parts.' },
      { id: 'ts-hands-dial', name: '2 · Remove hands & dial', role: 'structure', detail: 'Protect the dial, lift the hands straight up, then release the dial feet and lift the dial. This exposes the motion works beneath.' },
      { id: 'ts-auto', name: '3 · Remove automatic works', role: 'energy', detail: 'On an automatic, lift off the rotor and the winding-module bridge first — it’s the top layer and must come off to reach the movement proper.' },
      { id: 'ts-balance', name: '4 · Remove balance & cock', role: 'regulator', detail: 'Unscrew the balance cock and lift the balance and hairspring out as a unit. It comes out early and goes back in near-last, to keep the most delicate part safe.' },
      { id: 'ts-pallet', name: '5 · Remove pallet fork', role: 'regulator', detail: 'Free the pallet bridge and lift the fork. With the fork out, the train can spin freely for the next steps.' },
      { id: 'ts-train-bridge', name: '6 · Remove the train bridge', role: 'structure', detail: 'Unscrew the bridge that holds the wheel train. Note how the pivots line up — refitting the bridge so every pivot drops into its jewel is the fiddliest part of reassembly.' },
      { id: 'ts-wheels', name: '7 · Lift out the wheel train', role: 'transmission', detail: 'Remove the escape, fourth, third and centre wheels. Keep them in order; each pivot must return to its own jewel.' },
      { id: 'ts-barrel', name: '8 · Remove barrel bridge & barrel', role: 'energy', detail: 'Take off the barrel bridge and lift out the barrel. The barrel is opened, the mainspring inspected or replaced, and the barrel walls greased.' },
      { id: 'ts-keyless', name: '9 · Strip motion & keyless works', role: 'transmission', detail: 'Remove the cannon pinion, motion works and keyless works from the mainplate, leaving it bare. In practice these dial-side parts often come off early, right after the dial — which also keeps the winding pinion and clutch captive so they can’t drop out.' },
      { id: 'ts-clean', name: '10 · Clean, oil & rebuild', role: 'complication', detail: 'Everything is cleaned (usually ultrasonically), inspected, then reassembled in reverse order with the correct oils and greases at each jewel and contact point — the heart of a proper service.' },
    ],
  },
  /* ---------------------------------------------------------------- */
  {
    id: 'calendar',
    name: 'Calendar (date works)',
    tagline: 'How the date advances once a day — and snaps over at midnight',
    note: 'The most common complication. The hour wheel drives a wheel geared down to one turn a day; its finger flicks the toothed date ring one step, and a sprung jumper snaps the ring home and holds it. Watch the ring step past the window.',
    parts: [
      { id: 'cal-hourwheel', name: 'Hour wheel (drive)', role: 'transmission', detail: 'The date works tap off the hour wheel, which turns once every 12 hours. A date intermediate wheel gears that down to one turn every 24 hours to drive the calendar.' },
      { id: 'cal-driver', name: 'Date driving wheel', role: 'complication', detail: 'Turns once every 24 hours and carries a finger (beak). Once a day that finger engages the teeth of the date ring and pushes it on by one tooth — one date. The rest of the day it runs clear of the ring.' },
      { id: 'cal-ring', name: 'Date indicator ring', role: 'complication', detail: 'A large internally-toothed ring numbered 1–31 that sits under the dial. Each push from the driving wheel advances it one number, shown through the dial window. Non-31-day months need a manual correction.' },
      { id: 'cal-jumper', name: 'Date jumper (spring)', role: 'transmission', detail: 'A sprung lever that drops between the ring’s teeth to hold each date precisely under the window, and gives the crisp “snap” as the date changes. It’s also what you feel resisting during a quick-set.' },
      { id: 'cal-quickset', name: 'Quick-set corrector', role: 'interface', detail: 'A wheel brought into mesh with the date ring at an intermediate crown position, letting you advance the date without running the hands around. Never quick-set in the “danger zone” near midnight while the driving finger is engaged.' },
      { id: 'cal-window', name: 'Date window (aperture)', role: 'sealing', detail: 'The dial aperture that reveals one number of the ring. Its position and the ring’s alignment must be set so the date sits centred and changes cleanly at midnight, not early or late.' },
    ],
  },
]

export function getDiagram(id) {
  return DIAGRAMS.find((d) => d.id === id) || DIAGRAMS[0]
}
