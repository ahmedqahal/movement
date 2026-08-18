// Illustrated plates: painterly raster images with an interactive hotspot
// overlay. The image supplies the finish; the app supplies accurate labels.
//
// Each plate expects an image at /illustrations/<id>.png (or .jpg — set
// `file`). Drop a generated image into public/illustrations/ and the plate
// lights up; until then the page shows the generation prompt to copy.
// Hotspot x/y are PERCENT coordinates of the image — use the page's
// "position mode" to click-read coordinates off your actual image.

const STYLE =
  'Educational technical illustration in a warm vintage-paper style: plain cream paper background, muted matte grey steel plates with slotted screws, polished brass gear wheels with cut-out spokes, tiny ruby-red jewel bearings, soft subtle drop shadows, a clean flat-shaded look halfway between a technical drawing and a painting, viewed straight from above, high detail. IMPORTANT: no text, no labels, no numbers, no arrows anywhere in the image. Landscape 4:3, at least 1600 pixels wide.'

export const ILLUSTRATIONS = [
  {
    id: 'mechanical',
    title: 'Mechanical movement',
    file: '/illustrations/mechanical.webp',
    prompt:
      'A full mechanical watch movement seen from directly above: a large mainspring barrel, a train of interlocking brass gears, an escapement with an anchor-shaped pallet fork, a large balance wheel with a fine spiral hairspring, a small white sub-seconds dial near the bottom, and a winding crown on a stem at the right edge. ' +
      STYLE,
    // Hotspots calibrated to the user's generated artwork.
    hotspots: [
      { x: 71, y: 36, label: 'Crown wheel & ratchet', detail: 'The winding pair: the crown wheel turns the ratchet wheel, which winds the mainspring arbor. A click stops it unwinding.' },
      { x: 60, y: 25, label: 'Mainspring barrel', detail: 'The fuel tank — a coiled flat spring inside a toothed drum. Its slow unwinding powers everything else.' },
      { x: 35, y: 45, label: 'Going train', detail: 'The geared-down chain of brass wheels (centre → third → fourth) that carries power toward the escapement and turns the hands at the right rates.' },
      { x: 56.5, y: 55, label: 'Escapement', detail: 'Escape wheel + pallet fork. It releases the train one tooth per beat — the tick — and gives the balance its push.' },
      { x: 68, y: 65, label: 'Balance wheel & hairspring', detail: 'The timekeeper: a weighted wheel swinging on a fine spiral spring at a fixed rate. Everything else exists to serve this.' },
      { x: 35.5, y: 24, label: 'Jewels', detail: 'Synthetic ruby bearings at the fast pivots — hard, smooth, low-friction. The red dots across the movement.' },
      { x: 94, y: 48.5, label: 'Crown & stem', detail: 'Your input: push in to wind, pull out to set. The stem carries it into the keyless works.' },
      { x: 44.5, y: 76, label: 'Sub-seconds dial', detail: 'A small seconds dial driven directly by the fourth wheel — the classic layout before centre seconds.' },
      { x: 19.5, y: 56, label: 'Bridges & plates', detail: 'The movement’s skeleton: the mainplate underneath and the bridges screwed over it that hold every wheel in place.' },
    ],
  },
  {
    id: 'escapement',
    title: 'Lever escapement close-up',
    file: '/illustrations/escapement.webp',
    prompt:
      'A close-up macro view of a Swiss lever watch escapement: a club-toothed steel escape wheel meshing with an anchor-shaped pallet fork tipped with two small red ruby pallet stones, and beside them the lower rim of a brass balance wheel with its red impulse roller jewel. ' +
      STYLE,
    // Hotspots calibrated to the user's generated artwork.
    hotspots: [
      { x: 51, y: 33, label: 'Escape wheel', detail: '15 club-shaped teeth, each with a flat impulse face. The train pushes it constantly; the fork releases it one tooth per beat.' },
      { x: 81, y: 33, label: 'Pallet fork', detail: 'The anchor-shaped lever. Each beat: lock, draw (safety), then impulse as a tooth slides across a pallet stone.' },
      { x: 78.5, y: 24, label: 'Entry pallet stone', detail: 'The receiving ruby. Angled so the tooth locks safely, then lifts the fork as it escapes.' },
      { x: 66, y: 47, label: 'Exit pallet stone', detail: 'The discharging ruby on the other arm — the only escapement surfaces that are ever oiled are these stones and the teeth.' },
      { x: 68, y: 71, label: 'Roller & impulse jewel', detail: 'The ruby pin on the balance that enters the fork slot each swing and takes the push. Never oiled.' },
      { x: 20, y: 52, label: 'Going train wheel', detail: 'The last brass wheel of the train, driving the escape wheel — power arriving from the barrel.' },
    ],
  },
  {
    id: 'balance',
    title: 'Balance & hairspring',
    file: '/illustrations/balance.webp',
    prompt:
      'A close-up macro view of a watch balance wheel assembly: a brass balance wheel rim with small timing screws around its edge, a very fine blued-steel spiral hairspring above it, mounted under a polished steel balance cock with a small red jewel in a gold setting at its centre. ' +
      STYLE,
    // Hotspots calibrated to the user's generated artwork.
    hotspots: [
      { x: 33, y: 20, label: 'Balance wheel', detail: 'The oscillator — swings back and forth several times a second. Its steady rhythm is the watch’s timekeeping reference.' },
      { x: 44, y: 30, label: 'Hairspring', detail: 'The fine blued spiral that returns the balance each swing. The most delicate part in the watch — never touched, never oiled.' },
      { x: 78, y: 39, label: 'Balance cock', detail: 'The bridge the balance hangs from, screwed down at each end. Carries the regulator and the shock setting.' },
      { x: 50, y: 43, label: 'Shock jewel (chaton)', detail: 'The sprung end-stone (Incabloc / Diashock) in its gold setting that lets the fragile balance pivots survive knocks.' },
      { x: 50, y: 12, label: 'Timing screws', detail: 'Small screws set around the rim, used to poise and time the balance on traditional designs.' },
      { x: 49, y: 63, label: 'Hairspring stud & regulator', detail: 'Where the outer end of the hairspring is anchored — moving the stud corrects beat error; the regulator pins alter the rate.' },
    ],
  },
  {
    id: 'automatic',
    title: 'Automatic winding',
    file: '/illustrations/automatic.webp',
    prompt:
      'An automatic watch self-winding mechanism seen from above: a large semicircular metal rotor weight sweeping over small reduction gear wheels and a mainspring barrel with a ratchet wheel, in brass and grey steel. ' +
      STYLE,
    // Hotspots calibrated to the user's generated artwork.
    hotspots: [
      { x: 50, y: 22, label: 'Rotor', detail: 'The half-moon weight that swings with your wrist. Its motion is the free energy that winds the watch.' },
      { x: 50, y: 42, label: 'Rotor bearing', detail: 'The ball bearing the rotor pivots on. A worn one lets the weight rub the caseback — the classic scraping automatic.' },
      { x: 44, y: 58, label: 'Reduction gears', detail: 'Gear the rotor’s fast, weak spin down to slow, strong turns of the ratchet wheel.' },
      { x: 70, y: 62, label: 'Barrel & ratchet', detail: 'The destination: the ratchet wheel winds the mainspring. An automatic spring has a slipping bridle so it can’t over-wind.' },
      { x: 29, y: 65, label: 'Balance wheel', detail: 'The timekeeper, sitting beside the winding works — the automatic module simply keeps its mainspring fed.' },
    ],
  },

  /* ---- awaiting artwork: generate with the prompt shown on each plate ---- */
  {
    id: 'keyless',
    title: 'Keyless works (wind & set)',
    file: '/illustrations/keyless.webp',
    prompt:
      'A close-up of a watch keyless works seen from the dial side: a winding stem entering from the right with a fluted crown, a sliding clutch pinion on the stem, a winding pinion, a yoke and a setting lever with their springs, and two small setting wheels, all in grey steel and brass on the mainplate. ' +
      STYLE,
    hotspots: [
      { x: 91, y: 46, label: 'Crown', detail: 'Your input. Pushed in it winds; pulled out it sets the hands.' },
      { x: 78, y: 46, label: 'Stem', detail: 'Carries crown rotation into the movement and shifts the clutch when pulled. Note the threaded section for the crown.' },
      { x: 57, y: 46, label: 'Sliding (clutch) pinion', detail: 'The clutch: slides along the stem to decide whether you wind the mainspring or set the hands.' },
      { x: 51, y: 45, label: 'Winding pinion', detail: 'Engaged when the crown is pushed in — drives the crown wheel and ratchet to wind the barrel.' },
      { x: 61, y: 30, label: 'Setting lever & yoke', detail: 'The sprung levers that detect the crown being pulled and throw the clutch across. Their detent is also what releases the stem.' },
      { x: 55, y: 74, label: 'Setting wheels', detail: 'In setting mode these pass crown rotation down to the motion works so the hands move.' },
      { x: 28, y: 32, label: 'Motion works', detail: 'The brass wheels under the dial that gear the hands — what the setting wheels ultimately drive.' },
    ],
  },
  {
    id: 'chronograph',
    title: 'Chronograph works',
    file: '/illustrations/chronograph.webp',
    prompt:
      'A close-up of a mechanical chronograph mechanism seen from above: a ruby-red column wheel with six upright columns at the centre-left, steel operating levers resting on it, a coupling clutch wheel, a large chronograph seconds runner wheel in brass, a minute-counter wheel, and two steel hammers resting on heart-shaped cams. ' +
      STYLE,
    hotspots: [
      { x: 37, y: 43, label: 'Column wheel', detail: 'The brain — the red wheel with six upright columns. Each press of the pusher steps it round; its columns route the levers to start, stop, or reset.' },
      { x: 55, y: 48, label: 'Operating levers', detail: 'Steel levers riding on the column wheel. Whether their tip sits on a column or drops into a gap decides what the chronograph does.' },
      { x: 73, y: 47, label: 'Chronograph runner', detail: 'The large brass wheel carrying the sweeping chronograph seconds hand. It only turns while the clutch is engaged.' },
      { x: 45, y: 70, label: 'Coupling clutch', detail: 'Swings the driving wheel into mesh with the runner to start timing, and out again to stop it.' },
      { x: 63, y: 65, label: 'Minute counter', detail: 'Advances one step per elapsed minute, driven off the runner.' },
      { x: 66, y: 80, label: 'Hammers & heart cams', detail: 'On reset the hammers drop onto the heart-shaped cams, snapping both counters instantly back to zero.' },
    ],
  },
  {
    id: 'calendar',
    title: 'Calendar (date works)',
    file: '/illustrations/calendar.webp',
    prompt:
      'A close-up of a watch date mechanism seen from the dial side: a large flat ring around the outside with numbers 1 to 31 printed on it and fine teeth on its inner edge, a date driving wheel with a small finger, a sprung date jumper lever pressing into the ring teeth, and a quick-set corrector wheel, in brass and grey steel. ' +
      STYLE,
    hotspots: [
      { x: 50, y: 11, label: 'Date ring', detail: 'The ring numbered 1–31 that shows through the dial window. Its inner edge is toothed — one tooth of advance = one date.' },
      { x: 39, y: 47, label: 'Date driving wheel', detail: 'The big brass wheel: turns once every 24 hours, and its finger flicks the ring on by one tooth each midnight.' },
      { x: 53, y: 45, label: 'Driving finger', detail: 'The small beak reaching out from the driving wheel. It engages the ring teeth once a day, then runs clear.' },
      { x: 60, y: 27, label: 'Date jumper', detail: 'The sprung lever that snaps each date precisely into place and holds it under the window — the crisp click at midnight.' },
      { x: 63, y: 40, label: 'Jumper spring', detail: 'The coiled spring that loads the jumper. It’s also what you feel resisting during a quick-set.' },
      { x: 66, y: 53, label: 'Quick-set corrector', detail: 'Meshes with the ring at an intermediate crown position so you can jump the date without running the hands round.' },
      { x: 45, y: 48, label: 'Inner ring teeth', detail: 'The fine teeth on the ring’s inner edge — 31 of them, one per date.' },
    ],
  },
  {
    id: 'quartz',
    title: 'Quartz movement',
    file: '/illustrations/quartz.webp',
    prompt:
      'A close-up of an analog quartz watch movement seen from above: a round silver battery cell on the left, a small black integrated-circuit chip, a tiny silver quartz crystal canister, a copper wire coil wound on a bobbin, a small stepper motor rotor, and a few small gear wheels, on a printed circuit board with fine copper traces. ' +
      STYLE,
    hotspots: [
      { x: 28, y: 38, label: 'Battery cell', detail: 'A 1.55 V silver-oxide cell under its clamp — the power source. A flat one stops the large majority of quartz watches.' },
      { x: 47, y: 18, label: 'Integrated circuit', detail: 'The black chip: counts the crystal’s 32,768 vibrations a second and divides them down to exactly one pulse per second.' },
      { x: 65, y: 21, label: 'Quartz crystal', detail: 'The small silver canister — a tuning-fork of quartz vibrating 32,768 times a second. The quartz watch’s “balance wheel”.' },
      { x: 76, y: 47, label: 'Coil', detail: 'Hair-fine copper wire wound on a bobbin. Each pulse magnetises its core and flips the rotor — an open coil is the commonest hard failure.' },
      { x: 62, y: 70, label: 'Stepper motor', detail: 'The magnetised rotor that flips 180° per pulse — the visible one-second tick of the seconds hand.' },
      { x: 42, y: 72, label: 'Gear train', detail: 'Brass wheels gearing the stepper’s steps down to the correct hand speeds, exactly as in a mechanical watch.' },
      { x: 55, y: 40, label: 'Circuit traces', detail: 'Printed copper paths carrying power and signal between cell, IC and coil. Corrosion here from a leaked cell kills the module.' },
    ],
  },
  {
    id: 'case',
    title: 'Case cross-section',
    file: '/illustrations/case.webp',
    prompt:
      'A cross-section cutaway diagram of a wristwatch case seen from the side: a domed sapphire crystal on top, a bezel ring, black rubber O-ring gaskets shown as small dark circles in their grooves, the steel case band, the movement and dial in the middle, a screw-down caseback at the bottom with visible threads, and a crown on a threaded tube at the right. ' +
      STYLE,
    hotspots: [
      { x: 46, y: 27, label: 'Crystal', detail: 'The domed cover — sapphire, mineral or acrylic. Seated on a ledge in the case and sealed by its own gasket.' },
      { x: 17, y: 33, label: 'Bezel', detail: 'The ring that traps the crystal against the case — fixed here, or rotating for timing on a diver.' },
      { x: 19, y: 34, label: 'Crystal gasket', detail: 'The black O-ring in its groove that keeps water out at the crystal seat.' },
      { x: 46, y: 42, label: 'Dial & hands', detail: 'The dial sits on the movement, with the hands stacked on their concentric arbors above it.' },
      { x: 46, y: 50, label: 'Movement', detail: 'Held in a seat or plastic ring, dial upward, secured by casing clamps or screws.' },
      { x: 46, y: 60, label: 'Caseback', detail: 'Screws down against its own gasket. Opening it breaks water resistance until re-sealed and pressure-tested.' },
      { x: 23, y: 62, label: 'Caseback threads', detail: 'The threads cut into the case band. Cross-thread these and the seal — and the case — are ruined.' },
      { x: 92, y: 48, label: 'Crown', detail: 'Fluted for grip. On a screw-down crown it threads onto the tube to seal.' },
      { x: 84, y: 49, label: 'Crown tube & gasket', detail: 'The crown runs on a threaded tube with a gasket inside — the hardest seal in the watch to keep watertight.' },
      { x: 9, y: 50, label: 'Lug', detail: 'The horn that holds the strap on a spring bar. Never lever a caseback against these.' },
    ],
  },
  {
    id: 'tools',
    title: 'The watchmaker’s bench',
    file: '/illustrations/tools.webp',
    prompt:
      'A neat flat-lay of watchmaking tools arranged on a plain cream paper background, seen from directly above: a set of small screwdrivers in a row, fine pointed tweezers, a jeweller’s loupe, a movement holder, a spring-bar tool, a dust blower, small oil pots with fine oilers, and a caseback opener. ' +
      STYLE,
    hotspots: [
      { x: 22, y: 25, label: 'Screwdrivers', detail: 'Precision drivers in graduated widths, colour-coded by size. Always match the blade to the slot exactly — and dress the tips flat.' },
      { x: 51, y: 25, label: 'Tweezers', detail: 'Anti-magnetic steel and brass, fine-tipped. Your real hands at this scale; keep the tips aligned and dressed.' },
      { x: 71, y: 15, label: 'Loupe', detail: 'Magnification (3×–10×) worn at the eye. Half of watchmaking is simply being able to see.' },
      { x: 87, y: 31, label: 'Movement holder', detail: 'Grips the movement so both hands are free, without stressing the mainplate.' },
      { x: 40, y: 51, label: 'Spring-bar tool', detail: 'Fork one end, pin the other — the first tool anyone should own, for straps and bracelets.' },
      { x: 8, y: 74, label: 'Dust blower', detail: 'A rubber bulb to puff dust off before you close a case. Never blow with your mouth — moisture.' },
      { x: 36, y: 66, label: 'Oil pots & tray', detail: 'Decant a little oil into a cup — never oil straight from the bottle. One pot per grade.' },
      { x: 65, y: 74, label: 'Oilers', detail: 'Fine-tipped applicators, one per oil grade. The tip size meters the dose.' },
      { x: 86, y: 66, label: 'Caseback opener', detail: 'The adjustable wrench-type opener for screw-down casebacks.' },
    ],
  },
  {
    id: 'mainspring',
    title: 'Mainspring & barrel',
    file: '/illustrations/mainspring.webp',
    prompt:
      'A watch mainspring barrel seen from above with its lid removed and resting beside it: the open toothed barrel drum showing a flat blue-steel mainspring coiled in a tight spiral inside, the central arbor with its hook standing in the middle, and the separate barrel lid lying next to the drum. ' +
      STYLE,
    hotspots: [
      { x: 40, y: 46, label: 'Mainspring', detail: 'The blue ribbon of spring steel coiled inside the drum. Winding tightens it; its slow release powers the entire watch.' },
      { x: 36, y: 40, label: 'Barrel arbor', detail: 'The central axle standing in the middle — the spring’s inner end hooks onto it, and the ratchet wheel sits on top to wind it.' },
      { x: 55, y: 17, label: 'Barrel teeth', detail: 'The toothed rim that drives the first wheel of the going train as the spring unwinds.' },
      { x: 26, y: 55, label: 'Barrel wall', detail: 'On an automatic this wall carries braking grease so the spring’s bridle can slip at full wind — that’s what prevents over-winding.' },
      { x: 77, y: 50, label: 'Barrel lid', detail: 'Snaps over the drum to hold the spring in. Prise it off at its notch to inspect or replace the mainspring.' },
      { x: 46, y: 70, label: 'Spring’s outer end', detail: 'Hooks (or on an automatic, slips via its bridle) against the barrel wall — the anchor the spring pulls against.' },
      { x: 10, y: 78, label: 'Balance & train', detail: 'The rest of the movement this barrel feeds — everything downstream lives on the power stored here.' },
    ],
  },
  {
    id: 'shock',
    title: 'Shock protection (Incabloc)',
    file: '/illustrations/shock.webp',
    prompt:
      'An exploded view of a watch shock protection setting, its parts floating apart in a vertical stack, clearly separated with visible gaps between each part: at the top a small lyre-shaped spring clip in steel, below it a flat round ruby cap jewel, below that a pierced ruby hole jewel in a polished brass chaton setting, and at the bottom the steel block of the mainplate with a conical seat, and a fine balance staff pivot pointing up into the hole jewel. ' +
      STYLE,
    hotspots: [
      { x: 48, y: 15, label: 'Lyre spring', detail: 'The sprung clip that holds the jewels down. It hinges open to release them for cleaning — the classic fiddly bit of a service.' },
      { x: 48, y: 32, label: 'Cap jewel (end-stone)', detail: 'The flat ruby disc the pivot’s end rests against. Oiled with 9010 on its flat face before assembly.' },
      { x: 48, y: 47, label: 'Hole jewel', detail: 'The pierced ruby the pivot passes through — you can see its hole at the centre of the setting.' },
      { x: 44, y: 54, label: 'Chaton', detail: 'The brass setting holding the hole jewel, so jewel and setting can move together when the watch is knocked.' },
      { x: 49, y: 66, label: 'Balance pivot', detail: 'The needle-fine point standing on the mainplate — thinner than a human hair, and the part all this exists to protect.' },
      { x: 49, y: 79, label: 'Conical seat', detail: 'The tapered seat the chaton drops into. On a knock the jewels slide aside up the cone and spring back centred.' },
      { x: 30, y: 85, label: 'Mainplate block', detail: 'The setting is housed in the mainplate (or balance cock) — this is where the whole assembly lives.' },
    ],
  },
  {
    id: 'train',
    title: 'Gear train, exploded',
    file: '/illustrations/train.webp',
    prompt:
      'Five watch wheels laid out in a neat row from left to right on plain paper, clearly separated with visible gaps between each wheel, seen from a slight angle so their arbors and pinions are visible: a large toothed mainspring barrel, then a large brass wheel with cut-out spokes, then a slightly smaller brass wheel, then a smaller brass wheel, and finally a small steel escape wheel with pointed club-shaped teeth. Each wheel stands on a fine steel arbor with a small toothed pinion beneath it, and their sizes step down evenly from left to right. ' +
      STYLE,
    hotspots: [
      { x: 14, y: 48, label: 'Barrel', detail: 'The power source — the mainspring lives inside this toothed drum. Its teeth drive the centre wheel.' },
      { x: 40, y: 47, label: 'Centre wheel', detail: 'Turns once an hour and usually carries the minute hand. The largest of the brass train wheels.' },
      { x: 59, y: 48, label: 'Third wheel', detail: 'A pure intermediate step, gearing the train up in speed and down in torque.' },
      { x: 76, y: 50, label: 'Fourth wheel', detail: 'Turns once a minute — this is what carries the seconds hand.' },
      { x: 92, y: 51, label: 'Escape wheel', detail: 'The last and fastest wheel, in steel with club-shaped teeth for the pallet fork to lock and release.' },
      { x: 40, y: 64, label: 'Pinion', detail: 'The small steel gear beneath each wheel. A wheel always drives the NEXT wheel’s pinion — that’s where the step-up ratio comes from.' },
      { x: 14, y: 34, label: 'Arbor', detail: 'The fine axle each wheel is mounted on. Its polished pivots run in the jewels — bend one and the watch stops.' },
    ],
  },
  {
    id: 'hands',
    title: 'Fitting the hands',
    file: '/illustrations/hands.webp',
    prompt:
      'A watch dial seen from directly above with its three hands lifted slightly above it: a short hour hand, a longer minute hand, and a fine seconds hand, each floating just above its own arbor at the centre of the dial. Above the hands hover two hollow-tipped brass hand-setting pushers, and a thin clear plastic dial protector sheet lies partly across the dial. The dial face is completely blank — plain cream with only small minute markers, no numerals and no writing of any kind. ' +
      STYLE,
    hotspots: [
      { x: 43, y: 12, label: 'Hand pushers', detail: 'Hollow brass tips sized just under each hand’s hole, so you press on the hub and never on the hand itself.' },
      { x: 47, y: 29, label: 'Hour hand', detail: 'The short one — fitted first, on the widest arbor. Set the movement to 12:00 before fitting so alignment is easy to check.' },
      { x: 52, y: 39, label: 'Minute hand', detail: 'Fitted second. It must sit level and clear the hour hand through a full sweep.' },
      { x: 45, y: 52, label: 'Seconds hand', detail: 'Fitted last, on the finest central arbor — the most delicate press of the three.' },
      { x: 52, y: 47, label: 'Centre arbors', detail: 'Three concentric arbors: hour, minute and seconds. The hands are friction-fit onto these — no screws.' },
      { x: 72, y: 62, label: 'Dial protector', detail: 'The thin clear sheet slid under the hands before levering. Not optional — one slip leaves a permanent scratch.' },
      { x: 30, y: 70, label: 'Dial', detail: 'Held to the movement by feet on its underside. Fingerprints here are permanent — handle by the edges only.' },
      { x: 35, y: 90, label: 'Dial feet', detail: 'The two small posts that locate the dial and are clamped or screwed from the movement side.' },
    ],
  },
  {
    id: 'eta6497',
    title: 'ETA 6497 top plate',
    file: '/illustrations/eta6497.webp',
    prompt:
      'A large hand-wound pocket-watch movement seen from directly above, in the style of an ETA Unitas 6497: a big round movement with wide flat bridges covering the left half, a large toothed ratchet wheel and a smaller crown wheel at the top left, a long narrow train bridge, a balance wheel with blued hairspring under a shaped balance cock at the lower right, a small sub-seconds dial opening at the left, and a winding stem with crown at the right edge. Generously spaced parts, few and large components. Realistic, plain and industrial — a real production movement, not steampunk or fantasy. ' +
      STYLE,
    hotspots: [
      { x: 33, y: 24, label: 'Ratchet wheel', detail: 'Sits on the barrel arbor and winds the mainspring. Big and accessible — part of why this calibre is so easy to learn on.' },
      { x: 48, y: 21, label: 'Crown wheel', detail: 'Drives the ratchet wheel from the winding pinion. Its upper screw is LEFT-hand threaded — turn it clockwise to loosen, or you’ll shear the slot.' },
      { x: 30, y: 45, label: 'Barrel bridge', detail: 'The wide plate over the mainspring barrel. Comes off after the balance and pallet in a strip.' },
      { x: 57, y: 40, label: 'Train bridge', detail: 'Holds the centre, third, fourth and escape wheel pivots. Refitting so every pivot drops into its jewel is the fiddliest step of the rebuild.' },
      { x: 58, y: 66, label: 'Balance wheel', detail: '18,000 A/h — a slow, visible 2.5 Hz beat, which is exactly what makes this movement good to learn escapement work on.' },
      { x: 55, y: 62, label: 'Hairspring', detail: 'The blued spiral. Lift the balance no more than a centimetre off its cock or you’ll stretch it.' },
      { x: 68, y: 60, label: 'Balance cock & regulator', detail: 'Carries the shock setting and the regulator arm you move to adjust rate.' },
      { x: 22, y: 59, label: 'Sub-seconds', detail: 'At 9 o’clock on the 6497 (the 6498 puts it at 6) — driven directly by the fourth wheel.' },
      { x: 88, y: 48, label: 'Stem & crown', detail: 'Hand-wound only — no rotor, no reverser. That simplicity is why it’s the school movement.' },
    ],
  },
  {
    id: 'nh35',
    title: 'Seiko NH35 top plate',
    file: '/illustrations/nh35.webp',
    prompt:
      'A modern Japanese automatic watch movement seen from directly above with its rotor removed, in the style of a Seiko NH35: a compact round movement, an automatic winding bridge across the upper half carrying two small wheels and a distinctive slim two-clawed pawl lever pivoting on an eccentric, a large toothed ratchet wheel, a balance wheel with hairspring at the lower right under a slim balance cock, and a winding stem with crown at the right edge. Plain matte grey plates, minimal decoration. Realistic, plain and industrial — a real mass-produced movement, not steampunk or fantasy. ' +
      STYLE,
    hotspots: [
      { x: 43, y: 33, label: 'Magic Lever', detail: 'Seiko’s two-clawed pawl on an eccentric — it pushes AND pulls the winding wheel, so the rotor winds efficiently in both swing directions. The signature Seiko mechanism.' },
      { x: 59, y: 30, label: 'Ratchet wheel', detail: 'The large wheel winding the mainspring barrel beneath it. The Magic Lever ratchets it round a tooth at a time.' },
      { x: 47, y: 22, label: 'Reduction wheel', detail: 'Gears the rotor’s fast, weak spin down to the slow, strong turns the ratchet needs.' },
      { x: 36, y: 43, label: 'Automatic bridge', detail: 'The plate carrying the winding works. First layer off in a service, after letting the power down.' },
      { x: 55, y: 68, label: 'Balance wheel', detail: '21,600 A/h (3 Hz) with Seiko’s Diashock protection — and unlike the old 7S26, this one hacks and hand-winds.' },
      { x: 65, y: 62, label: 'Balance cock', detail: 'Carries the Diashock setting and the regulator. Handle its lyre spring with the standard technique.' },
      { x: 34, y: 62, label: 'Train bridge', detail: 'Under the auto works sits an ordinary going train — service it exactly like any other automatic.' },
      { x: 88, y: 45, label: 'Stem & crown', detail: 'Hacking (stop-seconds) and hand-winding — the two upgrades that made the NH35 the modder’s default.' },
    ],
  },
  {
    id: 'service',
    title: 'Teardown order (exploded)',
    file: '/illustrations/service-sequence.webp',
    prompt:
      'A mechanical watch movement exploded into a vertical stack showing the order it comes apart, the layers floating one above the other and clearly separated with visible gaps. ' +
      STYLE,
    hotspots: [
      { x: 50, y: 9, label: '1 · Balance & cock', detail: 'Out first. The balance and its hairspring are the most fragile parts in the watch, so they leave early and return near-last.' },
      { x: 50, y: 22, label: '2 · Pallet fork & bridge', detail: 'With the fork out the train is free to spin — which is exactly what you want for the air test on the way back together.' },
      { x: 50, y: 31, label: '3 · Train bridge', detail: 'Note how the pivots line up before you lift it. Getting every pivot back into its jewel is the fiddliest moment of the rebuild.' },
      { x: 50, y: 40, label: '4 · The wheel train', detail: 'Escape, fourth, third and centre wheels — keep them in order, since each pivot must return to its own jewel.' },
      { x: 50, y: 49, label: '5 · Barrel bridge', detail: 'The wide plate over the mainspring barrel comes off once the train is clear.' },
      { x: 50, y: 58, label: '6 · Barrel & ratchet', detail: 'Lift out the barrel, open it, inspect or replace the mainspring, and grease the barrel wall.' },
      { x: 50, y: 80, label: '7 · Bare mainplate', detail: 'The skeleton everything is built on. Strip the keyless and motion works from the dial side, and the movement is ready for cleaning.' },
    ],
  },
]
