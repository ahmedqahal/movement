// Quartz service lessons and the Casework & Water Resistance track.
// Facts come from reports/Watch repair knowledge base expansion.md, its notes,
// and the ETA, Seiko, Witschi and Bergeon documents those notes cite. Anything on
// the report's "What must not ship yet" register stays out, so there are no
// abrasive grades, tube thread pitches or compression percentages here.

/* ------------------------------------------------------------------ */
/* Quartz Repair track: placed into the existing track by enrich.js    */
/* ------------------------------------------------------------------ */
const QUARTZ_SERVICE = {
  id: 'quartz-full-service',
  title: 'Service a quartz movement: strip, clean, oil, rebuild',
  summary: 'A full service on a practice calibre, with the numbers to prove it worked.',
  level: 'Advanced',
  time: '3–4 hrs',
  tools: ['Movement holder', 'Screwdrivers', 'Plastic tweezers', 'Brass tweezers', 'Watch tester or low-voltage meter', 'Rodico', 'Pegwood', 'Blower', 'Oilers', 'Covered parts tray'],
  intro:
    'Schools examine this job, while most bench work only swaps modules. A good quartz movement comes apart much like a mechanical one, and a few measurements show whether your work helped. The worked example is the ETA 955, because its sheet is public and AWCI names that family as a sample service task. Read “Swap a quartz movement (module)” and “Test a quartz movement with a multimeter” first.',
  steps: [
    {
      title: 'Pick a movement you can actually strip',
      body: 'Look for a metal plate and bridges held by screws. The British Horological Institute says good quartz movements can be serviced much like mechanical ones, while some low-cost ones can’t and many are now sealed units. If you can’t find screws holding the train bridge and the circuit, choose another movement. The ETA 955 is the safest worked example, because ETA publishes its parts, build order and limits. The Ronda 715 is the forum favourite and AWCI’s reference quartz, but its sheet hasn’t been checked here, so don’t apply these numbers to it. Check before you start: you can name the calibre and you hold its sheet. With no sheet you can still practise the strip, but you can’t judge the result against a limit.',
      figure: 'bench:qs-pick',
      caption: 'Screws and bridges mean you can service it. Rivets and a one-piece plastic body mean you swap it.',
    },
    {
      title: 'Measure before you touch anything',
      body: 'Record a baseline so you can prove the service helped. Note the voltage of a fresh cell. Then take the cell out, note the coil resistance, and read the current on a 1.55 V supply with the stem in and pulled out. An ETA 955.112 allows 1.30 to 1.80 kΩ on the coil, no more than 1.20 µA at 1.55 V, and no more than 0.5 µA in stem position 3. “Electrical testing: limits, meters and the 0.40 V rule” shows how to take each reading. With no tester, record what you can and whether the seconds hand steps cleanly. If the coil reads open, or the stem-out current is far over its limit, stop. Cleaning won’t cure either, and the module is the likely fault.',
      figure: 'bench:qs-baseline',
      caption: 'One card, filled in twice. The second column is your proof.',
    },
    {
      title: 'Take out the cell with the right tweezers',
      body: 'Note the cell’s number and which way up it sits, then lift it out with plastic tweezers. ETA’s F06.111 sheet says tweezers for battery removal must not be conductive, and BHI warns that steel and brass both conduct. Keep metal tweezers for screws and wheels. Take care near the clamp: on a Ronda 515 the coil sits beside it, so a slipped tool can kill the movement. Then remove the hands and dial as in “Swap a quartz movement (module)”. Check that the seconds arbor has stopped and the cell is out of the way in its own dish. If a clamp resists, look for a screw. Never force it.',
      figure: 'bench:qs-tweezers',
      caption: 'Plastic for anything that touches the cell. Metal only once the power is out.',
      caution: 'ETA makes eye protection compulsory for all work on the movement. Small springs fly, so wear it.',
    },
    {
      title: 'Strip the dial side in reverse of the build order',
      body: 'Set the movement dial side up in the holder. ETA’s build order ends with the hour wheel, so that comes off first. Then lift the date jumper bridge and its two screws, the date jumper, the intermediate date wheel, the calendar driving wheel and the date indicator. Next come the minute train bridge and its screw, the yoke, the date corrector, the setting wheel, the minute wheel and the cannon pinion with its driving wheel. Lay each part out in order and photograph every layer. Keep a finger or pegwood over the jumper as its bridge comes off, because it’s a spring. If a part won’t lift, don’t lever it. Look for a screw or bridge you missed.',
      figure: 'bench:qs-strip-dial',
      caption: 'Top of the stack comes off first. Numbers show the removal order.',
    },
    {
      title: 'Strip the circuit side, and treat the coil as glass',
      body: 'Turn the movement over. Undo the screw and lift the plus bridle, then the screw and the magnetic screen. Four screws hold the electronic module on a 955: three plain and one shouldered, so note which hole the shouldered one came from. Lift the module straight up by its edges, then lift out the distance piece and the battery insulator. Seiko’s guides warn against pushing tweezer tips near the coil and against touching the end of a coil lead terminal, which can break the wire. Check the winding under your loupe for a break or a scorch. If the module won’t lift, you’ve missed a screw. Never lever under the coil.',
      figure: 'bench:qs-strip-module',
      caption: 'Note the shouldered screw. It only belongs in one hole.',
    },
    {
      title: 'Lift the train, and keep the rotor away from steel',
      body: 'Take off the centre second stop lever, the train bridge screw and the train bridge. Lift out the intermediate wheel, the second wheel, the third wheel and last of all the rotor. The rotor is a permanent magnet on a pinion, so it pulls in steel dust and small steel parts. Put it straight into a covered dish, away from your screws. Then strip the keyless: spring clip, setting lever, corrector lever, jumper, stem and sliding pinion. To free the stem on a 955, put it in position 1 and press gently on the marked point of the setting lever. If a wheel binds as it lifts, the bridge isn’t coming up level. Lower it and lift again.',
      figure: 'bench:qs-train',
      caption: 'The train in section. The rotor comes out last and goes under a cover.',
    },
    {
      title: 'Sort what gets washed and what never does',
      body: 'ETA marks the 955 rotor “do not wash”: if it needs attention, you exchange it for a pre-lubricated part. Keep the electronic module out of any fluid too. Forum practice on the 955 also keeps the date ring out of the cleaner, and warns that magnetic parts pick up metal particles from the fluid. Plates, bridges, metal wheels, levers and screws go through your routine from “Cleaning the parts”. Plastic needs care. No checked source says which fluids are safe on watch plastics, so keep plastic parts out of fluid unless the fluid’s maker says it’s safe, and clean them by hand. Check your three piles against the sheet before anything gets wet.',
      figure: 'bench:qs-sort',
      caption: 'Three piles, decided before any fluid is opened.',
    },
    {
      title: 'Clean, then inspect the rotor and wheels',
      body: 'Run the metal parts through your cleaning routine and dry them. Peg the jewels with sharpened pegwood. Clean the rotor and plastic parts by hand with Rodico, and don’t scrape: Seiko warns about damaging the teeth of plastic parts during cleaning. Now look at the rotor magnet under magnification. ETA wants no metal filings or dirt on it before assembly, and Witschi names steel particles at the rotor as a cause of stuttering. Dab each particle away with Rodico. Check by turning the rotor under the loupe, looking all the way round. If particles won’t lift, or the pinion is marked, fit a new rotor.',
      figure: 'bench:qs-rotor',
      caption: 'A filing on the magnet can stop a step. Find it now, not after the rebuild.',
    },
    {
      title: 'Rebuild the train and oil it sparingly',
      body: 'Refit the rotor, third wheel, second wheel and intermediate wheel, then the train bridge. See every pivot enter its jewel before you tighten the screw. Test freedom with a soft puff from the blower or a light touch of pegwood on a wheel. The train should move without a catch. That check comes from mechanical practice, not ETA’s sheet. The 955 sheet puts fine oil (Moebius 9014) on the train jewels, with a very small quantity on the marked pivot, and thick oil (HP-1300) on the keyless. Quantity matters most: Seiko lists excess oil as a cause of high current, because it makes parts cling together. With no sheet, use a thin watch oil very sparingly. Moebius lists 9000 for analogue quartz and 9034 for plastic parts in quartz, and practice varies. If the train drags, take it down and find out why before you add anything.',
      figure: 'bench:qs-oil',
      caption: 'Follow your calibre’s own chart. This map shows the idea, not the 955’s exact points.',
    },
    {
      title: 'Refit the keyless and the module',
      body: 'Build the keyless in ETA’s order: sliding pinion, stem, jumper, corrector lever, setting lever and spring clip. Whenever you slide the stem into a built movement, turn it slightly so it doesn’t damage the setting wheel teeth. ETA marks those keyless parts for epilame after washing. If you have none, carry on: practice varies. Then lay in the insulator, distance piece and module, and fit each screw in its own hole with the shouldered one where it came from. Refit the magnetic screen and plus bridle. Seiko’s 7T62 guide lists a badly hooked circuit cover as a cause of poor contact, so check the module sits flat. Touch in a cell for a moment. The seconds arbor should step once a second. If it doesn’t, check the cell’s polarity, then the bridle.',
      figure: 'bench:qs-module-back',
      caption: 'Turn the stem as it enters. Seat the module flat before any screw goes tight.',
    },
    {
      title: 'Rebuild the date work and oil the jumper twice',
      body: 'Turn the movement dial side up and build in ETA’s order: cannon pinion, minute wheel, setting wheel, corrector, yoke, minute train bridge, date indicator, calendar driving wheel, intermediate date wheel, date jumper, jumper bridge and hour wheel. ETA oils the date jumper in two passes. Lubricate it, turn the date about 10 teeth with the quick corrector, lubricate again, then turn about 10 teeth more. Check in stem position 2: each click should move the date one clean step. If it skips or drags, lift the jumper bridge and look at how the jumper sits.',
      figure: 'bench:qs-date',
      caption: 'Oil, turn about 10 teeth, oil again, turn about 10 more.',
    },
    {
      title: 'Measure again and read the result',
      body: 'Repeat your baseline the same way, at 20 to 25 °C, the range ETA specifies. If the current is now inside the limit, the service worked. If whole-movement current stays high but the stem-out reading is normal, the load is mechanical: look for a pivot out of its jewel, too much oil, a hand touching, or particles at the rotor. Seiko’s guides make the same call, and say to clean and re-test. If the stem-out reading is high, the electronics are at fault. Witschi’s advice for an out-of-tolerance coil, current or minimum voltage is to change the movement.',
      figure: 'bench:qs-verdict',
      caption: 'Stem-out current splits the electronics from the mechanics.',
    },
    {
      title: 'Refit the hands, case and seal',
      body: 'Support the movement when you press hands on. Ronda gives a maximum of 40 N for hour and minute hands and 30 N for seconds on the 509, and 25 N on the slim 1062, so don’t lean on the press. Check hand clearance all round, because Witschi names a lightly touching hand as a cause of raised current. Wind the hands through 12 and through a date change. Case up, renew the gasket as in “Gaskets: types, measuring, sizing and grease”, then test as in “Test water resistance and find the leak”. Log your before and after numbers.',
      tip: 'Witschi recommends measuring current at every battery change. It’s how you catch a train that’s going sticky before it flattens the next cell.',
    },
  ],
  quiz: [
    { q: 'You’ve stripped an ETA 955. Which part does ETA mark “do not wash”?', options: ['The third wheel', 'The train bridge', 'The rotor', 'The minute wheel'], answer: 2, explain: 'The rotor is pre-lubricated. If it needs attention, ETA says to exchange it for an original pre-lubricated part.' },
    { q: 'After a service an ETA 955.112 draws 2.1 µA at 1.55 V, but only 0.4 µA in stem position 3. What do you check first?', options: ['Replace the module straight away', 'Look for mechanical load', 'Fit a cell with a higher voltage', 'Demagnetise the whole movement'], answer: 1, explain: 'The stem-out figure is inside its 0.5 µA limit, so the electronics look fine. High current with the motor running points to a pivot, excess oil, a touching hand or particles at the rotor.' },
    { q: 'You reach a plastic wheel at the cleaning stage. No sheet names a safe fluid. What do you do?', options: ['Give it a short ultrasonic cycle', 'Soak it in alcohol for a minute', 'Run it with the plates and bridges', 'Clean it by hand, out of fluid'], answer: 3, explain: 'No checked source says which fluids are safe on watch plastics, so stay out of fluid unless the fluid’s maker says otherwise.' },
    { q: 'How does ETA oil the date jumper on the 955?', options: ['Two passes, turning the date between', 'One large drop on the jumper tip', 'Grease it once, then fit the date indicator', 'Oil it only if the date skips'], answer: 0, explain: 'The sheet uses two small passes with the date turned in between.' },
    { q: 'A puff of air won’t move the train after you tighten the bridge screw. What’s your next step?', options: ['Add a little more oil', 'Tighten the screw further', 'Take the bridge off and find out why', 'Fit the module and let the motor free it'], answer: 2, explain: 'A train that drags at this stage has a pivot out of its jewel or a particle in it. Oil won’t cure either.' },
  ],
}

const QUARTZ_METER = {
  id: 'quartz-meter-limits',
  title: 'Electrical testing: limits, meters and the 0.40 V rule',
  summary: 'What your meter can and can’t resolve, and each calibre’s own limits.',
  level: 'Advanced',
  time: '45 min',
  tools: ['Multimeter', 'Second meter', 'Variable DC supply or watch tester', 'Fine probes', 'Plastic tweezers', 'Black cloth'],
  intro:
    '“Test a quartz movement with a multimeter” shows how to read the cell, coil and current. This lesson shows how far you can trust those readings. A watch draws around a millionth of an amp, so your instrument decides what you can honestly say. Every limit here belongs to one calibre, so never carry a number from one sheet to another.',
  steps: [
    {
      title: 'Match each reading to the right instrument',
      body: 'Four readings matter: cell voltage, coil resistance, current and lowest working voltage. A general multimeter reads voltage well, and reads a coil if its test voltage is low enough. Current is the hard one. ETA’s 1.20 µA limit is read on a 10 µA scale, which is below what most general multimeters resolve. BHI’s quartz timing machine spec covers 5 nA to 20 mA. A watch tester also averages the current over a measuring period, while a plain meter jumps with each motor pulse. To check your own meter, find its lowest current range in the manual and see what the last digit is worth. As a rule of thumb of our own, not a maker’s figure, if that’s more than about 0.1 µA it can show “far too high” but it can’t judge “just inside”.',
      figure: 'bench:qm-instruments',
      caption: 'A multimeter is fine for two of these jobs. The rest need more.',
    },
    {
      title: 'Know which voltage you’re reading',
      body: 'Read the cell on a 2 V range with a meter of at least 10 kΩ/V, as ETA specifies. Nominal is 1.55 V. Witschi rates a silver-oxide cell good at 1.45 to 1.6 V and discharged under 1.40 V with no load, and good above 1.25 V on a high-drain load. Lithium is good at 2.9 to 3.2 V. The 1.30 V in ETA’s sheets is a different measurement: it’s the supply voltage that triggers the end-of-life warning. Witschi says that warning typically starts about 1.25 V and movements stop about 1.2 V. No maker’s sheet defines a loaded cell test with a stated resistor, so don’t quote one. A cell that reads 1.42 V unloaded is no longer “good”, so replace it.',
      figure: 'bench:qm-voltage',
      caption: 'Cell readings on the left, movement thresholds on the right. They answer different questions.',
    },
    {
      title: 'Check your meter against the 0.40 V rule',
      body: 'ETA calls any ohmmeter with a test voltage above 0.40 V unsuitable for its coils, and recommends 0.20 V. Witschi’s instruments measure at very low voltage so the watch is safe and the IC’s protective diodes don’t affect the reading. Your meter’s manual may state its test voltage. If not, set it to the ohms range you’d use, set a second meter to DC volts and touch the two sets of probes together. The second meter shows the test voltage. That check is plain bench logic, not something from ETA’s sheet. At or below 0.40 V, carry on. Above it, try another ohms range. If every range is too high, don’t use that meter on the coil. Use a watch tester instead.',
      figure: 'bench:qm-testvolt',
      caption: 'Meter against meter, with no watch connected.',
      caution: 'Do this with no movement attached. The point is to find out before the probes touch a coil.',
    },
    {
      title: 'Put the probes in the right place',
      body: 'Take the cell out for any coil test. Polarity doesn’t matter on a coil. Touch the two coil pads your calibre’s sheet shows, at 20 to 25 °C. Seiko warns that touching the end of a coil lead terminal can break the wire, so land on the printed pad and press lightly. A very high or open reading means a broken coil. A reading well below the band means shorted turns. For insulation, touch one coil pad and the circuit board: Witschi wants more than 1 MΩ. If you can’t identify the pads, stop and find the sheet. A guess can do real damage on wire this fine.',
      figure: 'bench:qm-probes',
      caption: 'A generic layout. Real pad positions differ on every calibre, so use your sheet.',
    },
    {
      title: 'Compare with that calibre’s coil band',
      body: 'Witschi says a coil is normally 1 to 3 kΩ, and the sheets show why “normally” matters. An ETA 955 is 1.30 to 1.80 kΩ, an ETA 980.163 is 1.45 to 1.75 kΩ, a Ronda 509 is 1.90 to 2.10 kΩ, a Ronda 1062 is 2.70 to under 2.90 kΩ, and a Seiko 8F is 3.6 to 4.0 kΩ. So 2.0 kΩ passes on a 509 and fails on a 955. If a reading falls outside the band, re-seat the probes, check the room temperature and read it again. If it’s still out, the module or coil block has failed.',
      figure: 'bench:qm-coil',
      caption: 'Published coil bands. Check the revision of your own sheet.',
    },
    {
      title: 'Read current as an average',
      body: 'Current has two parts: the IC’s small steady draw, and a brief spike at each motor pulse. A tester averages them. Witschi’s typical totals are 0.7 to 1.2 µA with a seconds hand and 0.5 to 0.7 µA without. Sheets vary: an ETA 955 allows up to 1.20 µA at 1.55 V, a Ronda 509 reads 1.10 to 1.85 µA, a Ronda 1062 reads 0.32 to under 0.45 µA, and a Seiko 5M62 stays under 0.80 µA at 1.55 V. Seiko’s method is: cell out, connect the tester, short AC briefly, wait 10 to 20 seconds, then read. Shade the circuit block with a black cloth, because light raises the reading. If the figure wanders, wait until it settles before you write it down.',
      figure: 'bench:qm-current',
      caption: 'The spikes are real, but the limit applies to the average.',
    },
    {
      title: 'Work out where high current comes from',
      body: 'Many movements stop the motor when you pull the stem, while the IC keeps running. That splits the two parts for you. On an ETA 955 the stem-out limit is 0.5 µA. Ronda says pulling the stem cuts consumption by roughly 70% on the powertech family. If the running figure is high and the stem-out figure is normal, the load is mechanical. Witschi’s list is a sticky train or hands that touch lightly, and Seiko’s advice is to clean and re-test. If the stem-out figure is high too, suspect the electronics. Witschi adds a coil with damaged insulation as a cause of high current. A date change, vibration or falling voltage also raises the draw for a while, so after a fault wait several minutes and read again.',
      figure: 'bench:qm-high',
      caption: 'Two readings, one decision.',
    },
    {
      title: 'Find the lowest working voltage',
      body: 'This needs a variable supply, not a cell. With the cell out, feed the movement 1.55 V and lower the voltage until the motor stops, as ETA describes. Witschi then raises it slowly until the hands restart, and records that figure. Expect about 1.2 V on a silver-oxide movement. Go slowly. Most movements check the voltage only once a minute, so the warning can lag by up to 60 seconds, and ETA allows about 2 minutes on a test supply. The ETA 251.264 chronograph warns at 1.38 V after a 60 minute delay, so a marginal cell can seem fine for an hour. For a fast check on a 955, bridge test point T to the negative track: the motor runs 8 steps a second at 1.55 V and 32 a second at or below 1.30 V.',
      figure: 'bench:qm-lower',
      caption: 'Step down, wait, watch. Then step up to find the restart point.',
    },
    {
      title: 'Tell a 4-second warning from a 2-second one',
      body: 'The seconds hand tells you what kind of watch you’re reading. ETA 955 and F06 jump 4 steps every 4 seconds below 1.30 V, and ISA 8171/204 and 8174 do the same on the small seconds. Ronda 1063, 1064 and 1069 stop for 4 seconds, then run 4 quick steps. The Ronda 1062 isn’t on that list. A 2-second step is the usual warning on rechargeable watches: Epson VS75B with about a week left, Citizen E168, H500 and E21x with about 4, 5 and 7 days left, and Seiko 5M62. So a 4-second jump usually means change the cell, and a 2-second step usually means charge it. If a fresh cell still shows the jump, wait a few minutes, because Witschi says most movements re-check the voltage only about once a minute. If it carries on, check the contacts and the clamp, then look for mechanical load before you blame the module. Witschi’s checks are sluggish gears, hands that touch and particles at the rotor.',
      figure: 'bench:qm-ticks',
      caption: 'Twelve seconds of hand movement in each pattern.',
    },
    {
      title: 'Set the gate before you read the rate',
      body: 'Many quartz watches trim their rate by skipping counts at fixed intervals, called inhibition. A measurement shorter than that cycle gives a false figure. Witschi lists typical periods of 60 s or 10 s, and up to 960 s on precision watches. If repeated 60-second readings swing between plus and minus, inhibition is at work, so lengthen the measurement. Miyota’s Digital Frequency Control needs a 10-second gate or a whole multiple, on the complete watch. Seiko specifies a 10-second gate on the VK63 family, and the ETA 251.264 has a 60-second period. Keep the watch at about 23 °C. Witschi expects roughly −0.1 to +0.3 s/d from a medium-quality quartz watch, but the maker’s limit always wins.',
      figure: 'bench:qm-gate',
      caption: 'A short gate catches only part of the cycle. A full gate reads the true average.',
    },
    {
      title: 'Follow one sequence and write it down',
      body: 'Witschi’s order for an open watch is: look first, test the coil and insulation with the cell out, measure current and rate, then check minimum voltage. Look at the crown seam, check the hands move freely, check the date and look at the train for dirt. Any value out of tolerance at a stage means change the movement, and you don’t need to carry on. Note the calibre, the sheet’s revision, the room temperature and which instrument you used next to each reading. A number with no instrument beside it can’t be compared later.',
      figure: 'bench:qm-sequence',
      caption: 'Each stage must pass before you go on to the next.',
    },
  ],
  quiz: [
    { q: 'A second meter shows 0.6 V across your first meter’s probes on its ohms range. You want to test an ETA 955 coil. What do you do?', options: ['Use it, but only touch the coil for a moment', 'Reverse the probes and test', 'Try another range, or use a tester', 'Test at a lower room temperature'], answer: 2, explain: 'ETA calls anything above 0.40 V unsuitable. Look for a range under that limit, or use an instrument made for the job.' },
    { q: 'A coil reads 2.0 kΩ. What can you say?', options: ['It’s good, since coils are 1 to 3 kΩ', 'It passes on a Ronda 509 and fails on an ETA 955', 'It’s shorted on any calibre', 'It fails on a Ronda 509 and passes on an ETA 955'], answer: 1, explain: 'The Ronda 509 band is 1.90 to 2.10 kΩ and the ETA 955 band is 1.30 to 1.80 kΩ. The general range can’t pass or fail a coil.' },
    { q: 'Your multimeter hops between 0 and 3 µA on a running ETA 955. What can you honestly conclude?', options: ['The IC is failing', 'It draws 3 µA, so it’s over the limit', 'It draws 1.5 µA, the midpoint', 'Not enough to judge a 1.20 µA limit'], answer: 3, explain: 'A plain meter jumps with the motor pulses. The limit applies to an average, which needs a tester.' },
    { q: 'A cell reads 1.42 V with no load. What do you do?', options: ['Replace it, since it’s below the good band', 'Keep it, since it’s still above the 1.30 V warning level', 'Keep it, since it’s above 1.25 V', 'Measure the coil instead'], answer: 0, explain: 'Witschi’s good band is 1.45 to 1.6 V unloaded. The 1.30 V and 1.25 V figures are movement thresholds, which are a different measurement.' },
    { q: 'Repeated 60-second rate readings swing between +2 s/d and −1 s/d. What do you try first?', options: ['Replace the crystal', 'Lengthen the measurement', 'Warm the watch to 23 °C and read it again', 'Reset the IC'], answer: 1, explain: 'Readings that alternate like that are a strong sign of inhibition. The gate must span the full cycle.' },
  ],
}

const QUARTZ_ZERO = {
  id: 'quartz-chrono-zero',
  title: 'Zero a quartz chronograph and reset its module',
  summary: 'Clearing the IC and re-indexing the hands are two jobs. The reset point varies by calibre.',
  level: 'Advanced',
  time: '30 min',
  tools: ['Calibre sheet', 'Conductive tweezers', 'Plastic tweezers', 'Caseback opener', 'Fresh cell'],
  intro:
    'Two different faults get called “it needs a reset”. One is an IC holding scrambled data after a cell change. The other is a chronograph hand that stops a little off zero. They have different cures, and the reset point varies by calibre. This lesson covers only calibres with a maker’s procedure that has been checked, so if yours isn’t here, find its guide before you touch anything.',
  steps: [
    {
      title: 'Separate the two jobs',
      body: 'If functions misbehave after a cell change, suspect the IC. Seiko calls the cure system reset or all clear: it restores the IC, whose stored data is disordered after a cell change. If the chronograph works but a hand stops off zero, that’s re-indexing, usually done with the crown and pushers. That split is a reasoned rule of thumb, not a maker’s statement. Before you do anything, start, stop and reset the chronograph and write down what each hand does. You’ll need that note to prove the fix worked.',
      figure: 'bench:qz-jobs',
      caption: 'The symptom picks the job.',
    },
    {
      title: 'Find the reset point for your calibre',
      body: 'There’s no universal AC contact. Seiko’s bulletin SNO.16 sends the AC terminal to the circuit block cover on the 7T22, 7T24, 7T27, 7T32, 7T34, 7T36 and 7T42, and on the 5T and 6M families it lists. It goes to the battery clamp, twice, on the 8M family. On duo-display H601, H801 and V011 types it goes to the switch spring. Some calibres use buttons instead: hold all three over 3 seconds on the 8A20 group. The 8F family uses the plus face of the cell. Not every quartz movement has an AC feature, and no Ronda sheet checked here shows one. Check the calibre number on the movement, then read its row. If you can’t find a row, stop.',
      figure: 'bench:qz-points',
      caption: 'Same job, four different places. Your calibre’s guide names the right one.',
    },
    {
      title: 'Use the right tweezers for each job',
      body: 'This is the one place metal tweezers are correct. Seiko’s AC step needs conductive tweezers, because you’re joining two contacts. ETA’s F06.111 sheet says tweezers used to remove the battery must not be conductive. So use plastic for the cell and metal for AC, and swap on purpose. Touch only the two named points, and hold for the time the sheet gives: over 2 seconds on the Epson VS75B, over 3 seconds on the Seiko 8F. Keep the tips well away from the coil. Check that the hands respond as the sheet describes. If nothing happens, re-check the two points, then the cell. Don’t try other points to see what happens.',
      figure: 'bench:qz-short',
      caption: 'Metal tips join AC to the named point. Keep clear of the coil.',
      caution: 'On a Seiko 8F, finish a battery change within three minutes or the calendar data is erased. Have the new cell ready, and don’t short the battery (–) connection to the cover.',
    },
    {
      title: 'Zero a Seiko VK or VD module',
      body: 'On the VK63, VK67 and VK83, short the AC of the circuit block to the switch spring after any cell fitting. The VD53B does the same. To zero a VD53B, pull the crown to the second click and hold A and B together for over 2 seconds. The stopwatch second hand moves and comes back to where it was, which shows you’re in the mode. Then press A or B to set the hands to zero, set the time and push the crown in. The guide’s pages disagree on which button turns one hand which way, so press once and watch it.',
      figure: 'bench:qz-vd53',
      caption: 'Crown at the second click. A and B together first, then one at a time.',
    },
    {
      title: 'Zero a Ronda 5040.D',
      body: 'Pull the crown to position III. Hold A and B together for at least 2 seconds until the seconds counter turns 360°. A separate manual copy says at least 3 seconds, so allow the longer press. Now a short press of A moves the hand one step, and a long press runs it. Press B to move to the next hand, in the order second counter, 1/10 s counter at 6, minute counter at 9. Push the crown back to position I. Check by starting, stopping and resetting. If the counter never turned 360°, you’re not in the mode, so check the crown position and try again.',
      figure: 'bench:qz-5040',
      caption: 'B moves you to the next hand. A moves the hand you’re on.',
    },
    {
      title: 'ETA, Miyota, Citizen and Epson',
      body: 'Each maker does this differently. ETA 251.264: stem position 2, A selects the hand, B moves it, with a short press for a step and a long press for fast. Miyota 0S20: crown to the second position and press A to bring the chrono hand to zero. Don’t push the crown in while the hand is travelling, or the stopped position is read as zero. Citizen H50x: crown at the time position, hold B for 3 seconds or more, press B to reach 12, reset the time, push in, then press A to confirm the minute hand. It can’t run during 2-second warning mode, so charge it first. Citizen E21x All Reset needs at least Level 2 charge, the chrono reset, and the crown at the second click at the zero seconds position, then B and C together. Epson VS75B: second click, hold 2H for 2 seconds so the minute chrono turns a full round, set with 4H, press 2H for 2 seconds again and set the 1/5 s hand with 4H, then push the crown in.',
      figure: 'bench:qz-table',
      caption: 'Crown position first, then buttons. One row per calibre.',
    },
    {
      title: 'Stop where the checked steps stop',
      body: 'Zero procedures for the Seiko 7T32 and 7T62 weren’t in the documents opened for this app, and sources disagree on which click and button apply. Reset steps for the VD57, VD78, VK64, FS00, 6P00 and ISA 8171 are unverified too, so don’t guess from a similar number. Casio goes by module number. Service notes seen only in summary say AC touches a stated terminal for about 2 seconds, and that terminal varies, so no general list exists. Find the module number on the back of the movement and look up that guide. Pressing buttons at random on an unknown module can leave it worse than you found it.',
    },
    {
      title: 'Prove it worked',
      body: 'Push the crown fully in first. Seiko’s 7T62 guide notes that the stopwatch won’t run with the crown out. Run start, stop and reset three times, leaving the chronograph running longer each time, and watch every hand return. Compare with your note from the start. If a hand is still off, repeat the zero routine once. If it stops in a different place each time, the fault isn’t the setting: look at cell voltage first, then dirt or a disengaged wheel. Seiko’s list for the 7T62 covers a depleted cell, a disengaged hour wheel or minute pinion, an unhooked circuit block cover, a broken coil, and dirt or spoiled oil.',
      figure: 'bench:qz-verify',
      caption: 'Same miss every time is a setting. A different miss each time is a fault.',
    },
  ],
  quiz: [
    { q: 'You’ve fitted a cell to a Seiko VK63. Where does the AC terminal go?', options: ['The circuit block cover', 'The switch spring', 'The cell’s plus face', 'The battery clamp, twice'], answer: 1, explain: 'SII’s VK63 guide says to short AC of the circuit block to the switch spring after any cell fitting.' },
    { q: 'Which job takes conductive tweezers?', options: ['Shorting AC on a Seiko module', 'Lifting out an ETA F06.111 cell', 'Holding a new cell by its edge', 'Refitting the cell insulator'], answer: 0, explain: 'AC joins two contacts, so the tweezers must conduct. Anything handling the cell should be plastic.' },
    { q: 'On a Ronda 5040.D you hold A and B at position III. What tells you it’s entered zero mode?', options: ['The date jumps forward', 'The minute counter hand moves to its zero position', 'The hour hand stops', 'The seconds counter turns 360°'], answer: 3, explain: 'The manual says to hold until the seconds counter makes a full turn, for at least 2 seconds. One copy says 3, so allow the longer press.' },
    { q: 'On a Miyota 0S20 you push the crown in while the chrono hand is still moving. What happens?', options: ['The hand finishes its travel normally', 'The IC resets itself', 'The stopped position is read as zero', 'The chronograph locks until the next cell'], answer: 2, explain: 'Wait until the hand has arrived at zero, then push in.' },
    { q: 'A Citizen H500’s second hand moves every 2 seconds, and it won’t enter zero mode. What do you do first?', options: ['Short the AC contact', 'Charge the watch', 'Replace the module', 'Hold B for a full minute'], answer: 1, explain: 'That’s the low-charge warning, and the H50x can’t run its zero routine in 2-second mode.' },
  ],
}

const QUARTZ_CELL = {
  id: 'quartz-cell-replace',
  title: 'Replace a solar or Kinetic storage cell',
  summary: 'Tell a dead cell from a dead movement, and never swap a cell type.',
  level: 'Advanced',
  time: '1 hr + charging',
  tools: ['Rechargeable cell for that calibre', 'Multimeter', 'Plastic tweezers', 'Conductive tweezers', 'Bench lamp', 'Calibre guide'],
  intro:
    'A stopped solar or Kinetic watch is usually just flat, so charging comes first. When it won’t hold a charge, you have to tell a dead cell from a dead movement before you spend money. This is the bench version of “Solar, Eco-Drive & Kinetic watches”. Its Kinetic steps come from Seiko’s 5M62 guide, and its solar logic is reasoned from other makers’ methods, as marked below.',
  steps: [
    {
      title: 'Never swap a cell type',
      body: 'Rechargeable cells, capacitors and ordinary batteries can look identical, and they aren’t interchangeable. Citizen says a conventional battery in place of the rechargeable cell can overcharge and damage the watch. Seiko warns that the 5M6 rechargeable unit and the 5M4 capacitor unit are completely different types with a close resemblance, and you tell them apart by the shape of the minus lead terminal. Check the old part against the calibre’s guide before you order anything. If the guide and the part disagree, someone has been here before you, so trust the guide.',
      figure: 'bench:qc-types',
      caption: 'Same size, different job. Match the calibre, not the outline.',
      caution: 'Never fit a silver-oxide cell to a solar or Kinetic watch to “see if it runs”. The circuit will try to charge it.',
    },
    {
      title: 'Charge it fully before you judge it',
      body: 'A flat cell tells you nothing until it’s had a fair charge. Citizen’s E168 sheet gives about 2 minutes in full sun for one day’s running, 17 minutes to run normally, and 11 hours to fill. Under a 3,000 lx lamp at 20 cm, those become 40 minutes, 7 hours and 120 hours. Indoors at 500 to 700 lx it takes about 50 hours just to run normally. So a day on a desk proves nothing. Keep the watch below about 60 °C, and keep an incandescent lamp at least 50 cm away. Check for the seconds hand moving from 2-second steps to 1-second steps. If it’s still dead after the full time, go on to the tests.',
      figure: 'bench:qc-charge',
      caption: 'Citizen E168 charging times from its sheet. Other calibres differ.',
    },
    {
      title: 'Give a Kinetic a fair charge by hand',
      body: 'Seiko’s swing is specific. Hold the watch and swing it side to side at 2 to 3 swings a second through about a 20 cm arc. From fully stopped, about 250 swings restores one-second motion and about a day of power. Once it’s running, 200 to 250 more swings add up to about a day. On models with a power-reserve button, wait 10 to 15 minutes after charging before you trust it, or it reads high. The second hand sweeps 5, 10, 20 or 30 seconds for 1 to 7 days, 7 days to a month, about a month, and 4 to 6 months. After more than a year fully stopped, a 5M may not restart at all (one source), so a failure here is less conclusive.',
      figure: 'bench:qc-swing',
      caption: 'About 20 cm of arc, 2 to 3 swings a second, about 250 swings.',
    },
    {
      title: 'Run Seiko’s generator test',
      body: 'Open the back and measure the cell voltage. Close the back temporarily, swing the watch 200 times, then measure again within 3 minutes. Starting from 0.5 to 1.0 V, a rise of more than 0.06 V means the generator works. So 0.62 V rising to 0.71 V is a pass, because that’s a 0.09 V rise. Take care with the minus probe: if it shorts the cell lead to the clamp, leave the watch for 10 minutes before you read again. If the first reading is outside 0.5 to 1.0 V, this test wasn’t written for that state, so charge it and repeat.',
      figure: 'bench:qc-gen',
      caption: 'Read, swing 200 times, read again within 3 minutes.',
    },
    {
      title: 'Read the Kinetic result',
      body: 'Voltage rises, then collapses quickly: the cell is tired, so replace it. No rise after 200 swings: suspect the generator. Normal voltage but no hand motion: suspect the circuit or motor. Seiko’s guide supports the first two links directly, and the third is reasoned from them. Check the current on a supply if you can: remove the cell unit, feed 1.55 V, short “A” to input (–) for over 3 seconds to leave quick start, then read. A 5M62 should stay under 0.80 µA with the block alone under 0.20 µA, with the circuit shaded. If those pass and the watch still won’t hold a charge, the cell is the likely fault.',
      figure: 'bench:qc-verdict',
      caption: 'Three results, three different parts.',
    },
    {
      title: 'Test a solar watch on a supply',
      body: 'No Citizen document states this test, so treat it as reasoned practice, built from ETA’s external-supply method and Seiko’s current test. Charge to specification first. Then take the cell out and run the movement from a bench supply at the voltage its sheet gives. If it runs on the supply but not on its own cell, the cell is suspect. If it fails on the supply too, suspect the module. Citizen tells owners not to remove the cell and to send the watch in, and its secondary cell numbers aren’t confirmed here. On a Citizen, the honest result of this test may be “send it in”.',
      figure: 'bench:qc-solar',
      caption: 'The supply takes the cell out of the question.',
    },
    {
      title: 'Order by calibre, not by a marketplace title',
      body: 'Seiko’s own guide gives 3023 44Z for the 5M62 and 5M63, a titanium lithium ion rechargeable unit. Retailer data lists 3023 24T as replacing it, and 3023 5MY replacing 5MZ for the 5M22 to 5M54 group and YT57 and YT58. Marketplace titles disagree with both, so trust the guide. The Epson VS75B uses 3023 34T, Ø 9.5 × 2.05 mm, 5.5 mAh. A Panasonic MT920 is 1.5 V, Ø 9.5 × 2.0 mm, and an MT621 is 1.5 V, Ø 6.8 × 2.1 mm, so diameter alone doesn’t pick the part. Check the new cell’s number against the guide when it arrives, before you open the watch.',
      figure: 'bench:qc-parts',
      caption: 'The maker’s guide outranks a retailer, and a retailer outranks a listing title.',
    },
    {
      title: 'Fit the cell the right way round',
      body: 'Work in the order the guide gives. The VS75B sheet has you remove the three clamp screws first to protect the parts, fit the plus side towards the inside of the watch, and check that the lead plate meets the minus pattern. That’s the opposite of what your hands expect from a normal battery, which is why you check. On a 5M6, seat the unit and its minus lead terminal as the guide shows. Use plastic tweezers and handle the cell by its edge. Check orientation against your photo before the clamp goes back. If the clamp won’t sit flat, the cell or lead isn’t seated, so lift it and look.',
      figure: 'bench:qc-fit',
      caption: 'On the VS75B the plus side faces into the watch.',
    },
    {
      title: 'Reset, charge and record',
      body: 'A new cell usually needs a reset. On the VS75B, short the AC pattern to the clamp for over 2 seconds, then short pattern B to the clamp for over 2 seconds at the second click to fix rotor polarity. Citizen’s E168 runs All Reset after charging from complete discharge. Then charge fully before you judge the work. Don’t put a loose cell on a bench supply to “top it up”. Panasonic’s guaranteed charge window for MT cells is 1.8 to 2.6 V, and it forbids trickle charging. Note the date and the cell number in your Practice Log, then re-check the reserve after a few days.',
      figure: 'bench:qc-reset',
      caption: 'Reset first, then a full charge, then judge the work.',
    },
    {
      title: 'Know what doesn’t belong on this bench',
      body: 'Spring Drive looks electronic but has no battery, motor or secondary cell. The mainspring drives the train and turns a glide wheel that generates current for the IC, so there’s no cell to replace. Older electrics need their own research. Touching the rim of an Accutron 214 index wheel can destroy it, so handle it by the pinion. Original Accutron cells were 1.35 V, and forum advice warns a 1.55 V silver cell can destroy a 214 coil set, though that’s field opinion, not Bulova guidance. Hamilton 500 contacts have no adjustment margin, and a 394 or 389 with a spacer stands in for the original 500 and 505 cells. If you meet one of these, stop and read up first.',
    },
  ],
  quiz: [
    { q: 'A 5M62 reads 0.62 V. After 200 swings it reads 0.71 V within 3 minutes. What does that tell you?', options: ['The generator works, so suspect the cell', 'The generator has failed', 'The cell is fully charged', 'The test must be repeated from a full charge at 1.55 V'], answer: 0, explain: 'That’s a 0.09 V rise, more than the 0.06 V Seiko asks for from a 0.5 to 1.0 V start. Suspicion moves to the cell.' },
    { q: 'An Eco-Drive runs from a bench supply but stops on its own cell, even after a full charge. Where does that point?', options: ['The module', 'The solar panel only', 'The cell', 'The hands'], answer: 2, explain: 'The supply proves the movement can run. That’s reasoned practice, since no Citizen document states it.' },
    { q: 'How do you tell a 5M6 rechargeable unit from a 5M4 capacitor unit?', options: ['By the diameter', 'By the shape of the minus lead terminal', 'By the colour of the insulator', 'By the voltage printed on the top of the unit'], answer: 1, explain: 'They look alike and are completely different types. Seiko says to check the shape of the minus lead terminal.' },
    { q: 'An E168 sat on a desk at about 500 lx for a day and still isn’t running normally. What’s the fair conclusion?', options: ['The cell has failed', 'The module has failed', 'It needs a silver-oxide cell to get it started', 'It hasn’t had enough light yet'], answer: 3, explain: 'At 500 to 700 lx Citizen gives about 50 hours just to run normally. One day proves nothing.' },
    { q: 'You’ve just finished charging a Kinetic by swinging it. When can you trust the power-reserve button?', options: ['Straight away', 'After 10 to 15 minutes', 'After a full day', 'Only after a full reset of the watch'], answer: 1, explain: 'Seiko says the reading runs high until 10 to 15 minutes after charging.' },
  ],
}

export const LESSONS = [
  { track: 'quartz', after: 'quartz-test', lesson: QUARTZ_METER },
  { track: 'quartz', after: 'quartz-module', lesson: QUARTZ_SERVICE },
  { track: 'quartz', after: 'quartz-full-service', lesson: QUARTZ_ZERO },
  { track: 'quartz', after: 'quartz-solar', lesson: QUARTZ_CELL },
]

/* ------------------------------------------------------------------ */
/* Casework & Water Resistance track                                   */
/* ------------------------------------------------------------------ */
const CASE_OPEN = {
  id: 'case-read-open',
  title: 'Read a case and open it without damage',
  summary: 'Work out how a case is built before any tool touches it.',
  level: 'Intermediate',
  time: '40 min',
  tools: ['Case holder', 'Case knife', 'Case wrench', 'Friction ball', 'Screwdrivers', 'Loupe'],
  intro:
    'Most case damage happens in the first ten seconds, when someone picks the wrong tool. Every case tells you how it opens if you read it first. This lesson goes further than “Open the caseback”: it covers what the marks mean, the case types that catch people out, and how to close up again.',
  steps: [
    {
      title: 'Learn the parts, then ask if it needs opening',
      body: 'A case is a stack: bezel and crystal on top, the case middle in the centre, the back underneath, and the tube and crown at the side. Each joint has a seal. Opening disturbs at least one of them, and Witschi says quartz watches shouldn’t be opened unless necessary, because of the risk of dust and moisture. Rate, pulse and power level can all be tested on a closed quartz watch with the right equipment. So be clear about why you’re going in. If you can’t name the reason, leave it shut.',
      figure: 'bench:co-anatomy',
      caption: 'One case in section. Every joint here is a place water can enter.',
    },
    {
      title: 'Read the back',
      body: 'Look at the seam and the edge under a loupe. A snap-on back has a smooth edge and a small lip to lift. A screw-in back has notches, flats or fine knurling, and threads into the case middle. A back held by screws shows four or more screw heads. A bayonet back locks with a short twist. If there’s no seam at all on the back, you may have a one-piece case. Check by looking for the tool’s purchase: a lip for a knife, notches for a wrench, slots for a driver. If you can’t find any, stop. Don’t make a purchase point with a blade.',
      figure: 'bench:co-backs',
      caption: 'Five backs and what each one gives your tool to grip.',
    },
    {
      title: 'Read the marks before they’re hidden',
      body: 'Write down everything stamped on the back, inside and out. A water rating tells you what to test to later, and 1 bar equals 10 m. ISO 3160-1 marks tell you the gold covering: GP is gold-plated, GR is rolled gold and GC is gold capping, with a number in micrometres. So GP 20 means a nominal 20 µm, or 0.02 mm. “10K RGP” on a US-market back means a gold layer on base metal, not solid gold. “Fond acier” means a steel back, usually on a plated case. Reference and serial numbers are clues, not proof, because backs can be swapped. Photograph the marks before you start.',
      figure: 'bench:co-marks',
      caption: 'What a typical caseback stamp tells you. This one is made up for the lesson.',
    },
    {
      title: 'Hold the case, and clear the working area',
      body: 'Take the strap or bracelet off first, so it can’t get in the way or foul the tool. Clamp the case in a case holder or rest it on a case cushion, crystal side down, so the crystal is protected and the case can’t spin. Wipe the seam: dirt in the seam ends up in the movement. Make sure the crown is pushed in. Check that the case can’t shift when you push on it. If the holder’s jaws touch a polished surface, pad them. A slipping tool is the cause of nearly all bench scratches, and a firm hold stops most of them.',
      figure: 'bench:co-hold',
      caption: 'Crystal down, jaws on the case flanks, seam clean and facing you.',
    },
    {
      title: 'Lift a snap-on back',
      body: 'Find the lip. Set the case knife blade flat into it, with the edge against the case middle, and twist the blade gently so it wedges the back up. Work away from your hand. The back should release with a small click. Horopedia describes a snap back as held by tension between two fitting diameters, so you’re only overcoming that grip. Check the seam opens evenly. If it won’t move, reseat the blade rather than pushing harder, and tap it in lightly with a case cushion under the watch. Never lever on a thin lug.',
      figure: 'bench:co-snap',
      caption: 'Blade in the lip, then twist. Don’t push towards your fingers.',
      caution: 'A slipping case knife cuts hands as easily as it marks cases. Keep your other hand behind the blade.',
    },
    {
      title: 'Turn a screw-in back',
      body: 'Set the case wrench pins to the notch spacing, and check that all of them sit fully in the notches. Press straight down hard, then turn anticlockwise in one steady motion. Most slips happen because the downward pressure eased off, not because the back was tight. A smooth or finely knurled back takes a friction ball, which grips without marking. Check after the first few degrees that the back is turning and the pins haven’t ridden up. If it won’t start, stop and reset the tool. A wrench that jumps leaves a scratch across the back that can’t be undone.',
      figure: 'bench:co-wrench',
      caption: 'Pins fully seated, pressure down first, then turn.',
    },
    {
      title: 'Undo a back held by screws',
      body: 'Choose a blade that matches the slot in both length and width. BHI’s rule is that too wide scrapes the surface, too narrow marks the slot, and a steep blade rides out. Loosen each screw a little in turn, working across the back, so the back stays level. Then take them out and keep them in order, because lengths can differ. On some cases the screws pass through the case middle into the bezel, so the bezel and crystal come loose when the screws come out. Check for that before you lift. If a screw won’t turn, stop before the slot goes. A chewed slot on the outside of a case stays visible for good.',
      figure: 'bench:co-screws',
      caption: 'Through-screws clamp the case middle between back and bezel.',
    },
    {
      title: 'Recognise a one-piece case, then decide',
      body: 'A monocoque or monobloc case has no back to remove, so the movement comes out through the front. The bezel and crystal come off first, and then the movement lifts out. These cases usually have a two-part stem that separates when pulled, so the crown and stem come out before the movement can. Details vary by maker and some need a special tool, so find that model’s procedure first. Refitting needs a new crystal gasket and a proper crystal press, and some watchmakers decline these cases. For a beginner, the right result is often to leave it closed.',
      figure: 'bench:co-mono',
      caption: 'No back seam. The way in is through the front.',
    },
    {
      title: 'Close it as carefully as you opened it',
      body: 'Clean the seam and the gasket seat. Fit a new or inspected gasket, as in “Gaskets: types, measuring, sizing and grease”. Line up any cut-out in the back with the stem, and check the recess in a plastic movement holder too. Witschi notes that a holder sitting on the stem leaves a gap between back and case. A snap-on back goes on with a press and a die that clears the crystal, never with thumbs on a domed crystal. Horotec sells die sets for snap-on backs (MSA07.106). Start a screw-in back by hand, turning it backwards until you feel the thread drop, then forwards. It should turn easily for the first few turns. If it stiffens early, it’s cross-threaded, so back it off and start again. Check the gasket isn’t showing in the seam, then test as in “Test water resistance and find the leak”.',
      figure: 'bench:co-close',
      caption: 'Back it off until the thread drops, then go forward.',
    },
  ],
  quiz: [
    { q: 'A back has a smooth edge and no notches, but you can see fine knurling. Which tool is right?', options: ['Case knife', 'Friction ball', 'Screwdriver', 'Adjustable case wrench'], answer: 1, explain: 'Fine knurling on a round back means a smooth screw-in back. A friction ball grips it without marking.' },
    { q: 'You find no seam on the back and no notches anywhere. What do you do?', options: ['Cut a small lip in the seam with a sharp blade', 'Try the case wrench anyway', 'Stop: it may be a one-piece case', 'Heat the back and twist'], answer: 2, explain: 'A one-piece case opens from the front. Making your own purchase point only damages the case.' },
    { q: 'What does “GP 20” on a case tell you?', options: ['20 carat gold', '20 bar of water resistance, or 200 m', 'A 2.0 mm gold shell', 'A nominal 20 µm gold plate'], answer: 3, explain: 'ISO 3160-1 gives the covering thickness in micrometres. That’s 0.02 mm, so polishing can reach base metal.' },
    { q: 'Halfway through undoing the screws on a back, the bezel starts to lift. Why?', options: ['The screws run through into the bezel', 'The crystal has cracked and released the bezel ring', 'The gasket has swollen', 'The stem has come out'], answer: 0, explain: 'On this construction the screws pass through the case middle into the bezel, so it’s all one clamp.' },
    { q: 'A screw-in back stiffens after half a turn. What’s happened, and what do you do?', options: ['The gasket is seating, so keep turning', 'It’s cross-threaded, so back it off and restart', 'The thread needs more grease, so add some and turn harder', 'It’s tight enough, so stop there'], answer: 1, explain: 'A properly started back turns easily for the first few turns. Forcing a crossed thread ruins it.' },
  ],
}

const CASE_GASKETS = {
  id: 'case-gaskets',
  title: 'Gaskets: types, measuring, sizing and grease',
  summary: 'Pick the right seal, measure it properly and fit it so it actually seals.',
  level: 'Intermediate',
  time: '30 min',
  tools: ['Digital calipers', 'Plastic tweezers', 'Pegwood', 'Grease box', 'Silicone grease', 'Rodico'],
  intro:
    'A gasket costs almost nothing, and it’s the only thing keeping water out. Good gasket work is mostly measuring and patience. There’s no single published figure for how much a watch gasket should compress, so this lesson teaches the rule by function and leaves out the numbers nobody can source.',
  steps: [
    {
      title: 'Know the four shapes',
      body: 'Elastic gaskets suit casebacks and bezels. An O-ring has a round section and a flat gasket is stamped or laser cut. Rigid gaskets hold a crystal and seal by compression. An I gasket gives a straight, even seal and an L gasket adds a support lip. Rigid crystal gaskets are single use, because they deform permanently if pinched. Where space or shape rules out a gasket, adhesive replaces it. Before mid-century, gaskets were mainly cork, leather and lead, so a vintage case may have nothing you can buy today. Check the old gasket’s section under a loupe before you order.',
      figure: 'bench:cg-sections',
      caption: 'Cut through each gasket and these are the shapes you’d see.',
    },
    {
      title: 'Find every seal in the case',
      body: 'List the seals before you strip the watch, so nothing gets left out. Expect a back gasket, a crystal gasket, a seal in the crown or tube, and a bezel gasket if the bezel turns. Pushers have their own. Citizen’s advice is to replace packing every two or three years, the best maker’s anchor found. Any gasket disturbed on opening should be replaced too. The clearest warning sign is fogging after a temperature change. If you find a seal you can’t source, note it and tell the owner the watch can’t be trusted near water until it’s replaced.',
      figure: 'bench:cg-where',
      caption: 'Each coloured part is a seal to check. Your case may have more.',
    },
    {
      title: 'Remove and read the old gasket',
      body: 'Lift the old gasket out with plastic tweezers or pegwood, not a steel point, so you don’t scratch the groove. Look at how it has aged. A gasket that has gone flat, cracked or sticky has finished its life, and even a good-looking one has been disturbed. Keep it until the new one is in, because its shape is your best evidence, though an old gasket may have stretched or shrunk. Then clean the groove with pegwood and Rodico. Check by running a loupe all the way round: a hair or a crumb of old gasket will cause a leak. If the groove is corroded, a new gasket may not seal, so say so.',
      figure: 'bench:cg-condition',
      caption: 'Measure the groove as well as the gasket. An old gasket may no longer be its true size.',
    },
    {
      title: 'Measure the section with the right sum',
      body: 'Gaskets are listed by inner diameter and section. Cross-section is (OD − ID) ÷ 2. A gasket with an ID of 30.0 mm and an OD of 31.8 mm has a 0.9 mm section. Check the brackets in that sum, because forum posts often drop them and give the wrong answer. Suppliers sell ranges at 0.40, 0.70 and 0.90 mm, and one flat range is 0.50 mm thick. Forum advice is that most watch seals top out at about 1 mm section. Measure the groove width with calipers too. If you can’t measure a flattened old gasket, the groove gives you the better number.',
      figure: 'bench:cg-measure',
      caption: 'Two caliper readings and one sum.',
    },
    {
      title: 'Check the fit in the groove',
      body: 'The section should equal the groove width, and the seal should sit slightly proud, so closing the case compresses it. That advice comes from forum practice, but the logic is plain. Too low and nothing squeezes it, so it can’t seal. Too tall and the back won’t close, or the gasket pinches and is cut. Nobody publishes a reliable compression percentage for watch gaskets, so judge it by eye and by feel. Check by laying a straight edge across the groove: you should see the gasket just stand above the seat. If it sits flush or low, go up a section size.',
      figure: 'bench:cg-groove',
      caption: 'Proud before closing, flattened after. Flush or low won’t seal.',
    },
    {
      title: 'Size by what the gasket does',
      body: 'Ask how this gasket is held. One stretched over a lip goes slightly undersize, so it hugs the lip and stays put. A crystal pressed into a gasket goes slightly oversize, so the gasket is squeezed. That rule is reasoned from the two jobs rather than stated by a maker. For a back gasket, measure the diameter of the lip it sits on and the lip’s depth, compare with the old gasket, and pick the nearest listing just under the lip. Sources disagree on an exact figure for that, so don’t rely on one. If a new gasket falls off the lip, it’s too big. If it won’t go on without strain, it’s too small.',
      figure: 'bench:cg-size',
      caption: 'Over a lip, go under. Into a crystal fit, go over.',
    },
    {
      title: 'Grease lightly, or not at all',
      body: 'Sources disagree on products, so the default here is a thin, even film of silicone grease on elastic gaskets. Witschi says the same for the back seal, and to replace that seal each time the back is opened. Close the gasket in a grease box and twist, so it’s coated without a blob. Crystal gaskets usually need no lubrication. Keep it thin: Witschi warns that excess grease on the case tube can get inside when the stem goes in and cause faults. Check the gasket looks glossy, with no visible lumps. If you’ve overdone it, wipe it and start again. A manufacturer’s own product beats this default: Omega’s workflow, for example, is reported to use Fomblin grease.',
      figure: 'bench:cg-grease',
      caption: 'A sheen, not a coat.',
    },
    {
      title: 'Fit it, close it and test it',
      body: 'Hook one side of the gasket over the lip, stretch it gently and work it round until it’s seated. Don’t roll it, and don’t let it twist. Make sure the case is dry, then close it, tightening evenly so nothing warps. Look along the seam: a gasket showing outside the joint is pinched, and a pinched gasket has been cut, so replace it. Then test, because a fitted gasket proves nothing on its own. If you can’t test the watch, treat it as splash-only and say so.',
      figure: 'bench:cg-fit',
      caption: 'Work it round the lip. A twist here is a leak later.',
    },
  ],
  quiz: [
    { q: 'A gasket has an ID of 28.0 mm and an OD of 29.4 mm. What’s its section?', options: ['1.4 mm', '0.7 mm', '2.8 mm', '0.35 mm'], answer: 1, explain: '(29.4 − 28.0) ÷ 2 = 0.7 mm. Leave out the brackets or the halving and you’ll order the wrong part.' },
    { q: 'You’ve removed a mineral crystal, and its hard nylon gasket looks perfect. What do you do?', options: ['Refit it with grease', 'Refit it dry', 'Fit a new gasket', 'Warm it, then refit it'], answer: 2, explain: 'Rigid crystal gaskets are single use, because they deform permanently once pressed.' },
    { q: 'An O-ring sits exactly flush with its groove before you close the back. What’s wrong?', options: ['Nothing, flush is ideal', 'It needs more grease to fill the gap above the ring', 'The groove needs cleaning', 'It won’t be compressed, so go up a section'], answer: 3, explain: 'It must stand slightly proud so that closing the case compresses it.' },
    { q: 'Which gasket goes slightly undersize?', options: ['One stretched over a lip', 'One a crystal presses into', 'Any flat gasket', 'Any L-section gasket'], answer: 0, explain: 'A stretched gasket has to hug the lip. A crystal pressed into a gasket goes the other way, slightly oversize.' },
    { q: 'What’s the best maker’s anchor for how often to replace gaskets?', options: ['Every six months', 'Citizen’s two or three years', 'Only when it starts to leak or fog up', 'Every ten years'], answer: 1, explain: 'Citizen recommends two or three years. Anything disturbed on opening should be replaced as well.' },
  ],
}

const CASE_CRYSTALS = {
  id: 'case-crystals',
  title: 'Crystals: identify, measure, fit and polish',
  summary: 'The fit type decides the tool, the die and the way it fails.',
  level: 'Intermediate',
  time: '1 hr',
  tools: ['Digital calipers', 'Micrometer', 'Crystal press and dies', 'Crystal lift', 'UV lamp and adhesive', 'Polywatch', 'Eye protection'],
  intro:
    'Crystal work splits into separate jobs. The material tells you how it scratches, and the fit type tells you how it stays in. Match the method to the fit and the job is calm. Get it wrong and an acrylic splits, or a sapphire shatters. “Fit a new watch glass” is the short version. This is the full one. Most fitting steps here come from an experienced forum member’s how-to, and they’re labelled that way.',
  steps: [
    {
      title: 'Identify the material',
      body: 'Touch the crystal with the back of your finger. Plastic feels warmer and usually shows scratches. Glass feels cold. A domed crystal with soft-looking scuffs is usually acrylic. If a crystal has a reflective ring around its inner diameter, that’s a tension ring, and the crystal is plastic. Mineral and sapphire both feel cold, so this test can’t separate them, and you’ll need the maker’s data for that. If you still can’t tell, treat it as glass and don’t use force.',
      figure: 'bench:cx-material',
      caption: 'Three materials, and the first thing to check on each.',
    },
    {
      title: 'Identify the fit type',
      body: 'Fit type decides the method. Compressed acrylic is squeezed smaller, placed in the bezel, and released so it grips. A tension-ring (armoured) crystal has a metal ring inside the plastic that pushes it outward. Hard-gasket crystals press into a rigid plastic gasket. Glued crystals sit on a ledge in adhesive. The ring and the gasket are often visible at the edge, under a loupe. Look at the old crystal’s side, and at what’s left in the case. If you can’t see any of these, assume glue or an unusual design, and find out before you press anything.',
      figure: 'bench:cx-fits',
      caption: 'Four fits in section. Each one fails in its own way.',
    },
    {
      title: 'Measure it, then work out what to order',
      body: 'Lay the watch crystal up and measure 12 to 6, then 3 to 9. Both should agree. On a loose crystal, use a micrometer in two or three spots. If the crystal is missing, use the inside jaws on the wall above the ledge. If a good gasket is present, measure inside it the same way and order 0.1 mm larger: a 29.4 mm gasket takes a 29.5 mm crystal. On a fitted crystal, add 0.1 mm to the reading, since it may be worn or angled. Forum sizing is up 0.1 mm for tension-ring crystals and 0.2 mm for non-armoured. Most crystals come in 0.1 mm steps and some only in 0.5 mm steps. G-S codes help you search: ET, MT, AT and TT are plastic with a tension ring, and PHD, XHD, HC and PKH are round compression plastic. RMG and XMG are round flat glass.',
      figure: 'bench:cx-measure',
      caption: 'Two readings across, then add what the fit needs.',
    },
    {
      title: 'Fit a compressed acrylic',
      body: 'Clean the seat first. With a crystal lift, set the crystal in the lift’s base with the slide closed just enough that the crystal lifts out. Close the lift over the crystal so a small edge shows below the jaws, put it in the case and release. With a press, choose the matching die and plunger, sit the crystal upside down in the die, sit the case upside down on it, press the plunger to compress the crystal, lower the case onto it and release. That won’t work if the plunger can’t pass the case or bezel. Check the crystal sits level all round. If it pops out, it’s undersize. If it won’t enter, it’s oversize or the seat is dirty.',
      figure: 'bench:cx-lift',
      caption: 'Squeeze it smaller, place it, let it spring back.',
    },
    {
      title: 'Fit a tension-ring crystal',
      body: 'Choose a lower die that fits snugly inside the case and keeps it level. Choose an upper die with an internal chamfer close to the crystal’s diameter, for example a 34 mm die for a 34.13 mm crystal. Set the case on the lower die and the crystal on the case. Press in one smooth stroke, and you may hear a click or snap. Stakes are synthetic or aluminium so they don’t mark the crystal: concave for domed crystals, flat or convex for flat ones. Bergeon’s 5500-C tapered dies suit tension-ring crystals and aren’t recommended for mineral glass. Keep case and crystal on the press axis. If the crystal tilts, stop, because force off-centre splits acrylic and marks the bezel edge.',
      figure: 'bench:cx-tension',
      caption: 'Chamfered die, level case, one smooth stroke.',
    },
    {
      title: 'Fit sapphire or mineral in a hard gasket',
      body: 'Use a new gasket, because they’re single use. Buying three allows for a pinched one. Seat the gasket in the case with its chamfer towards the crystal. Press slowly, turning the case on the lower die to keep things even. Then rest it for about 20 minutes, as the gasket can push the crystal back up. Press again until it clicks home and check the seating all round. A tapered aluminium die set is an acrylic tool, so don’t assume one kit does both. Finish with a pressure test. If the gasket shows a pinch, start again with a new one.',
      figure: 'bench:cx-hard',
      caption: 'Press, rest about 20 minutes, press again until it clicks.',
      caution: 'An overpressed sapphire can shatter violently before the case deforms. Wear eye protection and go slowly.',
    },
    {
      title: 'Glue a crystal with UV adhesive',
      body: 'Take out the movement and the old crystal, then clean all old adhesive from the ledge. Test the applicator’s flow on paper. Run a small even bead around the ledge, lower the crystal so its edge sits in the glue, and press gently. Wipe any excess at once with light pressure, then cure under UV for 3 minutes. One adhesive specifies 365 nm and 2 minutes instead, so follow the bottle, and note that it warns of skin irritation. Gap matters: one repairer found 0.25 mm per side too wide, because the glue leaked under the crystal, while about 0.05 mm had worked before. Check the crystal stays centred, holding it with Rodico if it wanders. Glue isn’t a seal you can trust until it’s been tested.',
      figure: 'bench:cx-glue',
      caption: 'A small, even bead, on a clean ledge, with a narrow gap.',
    },
    {
      title: 'Polish acrylic, or replace it',
      body: 'Light marks come out with Polywatch, rubbed firmly across the scratches for a few minutes and wiped off. Deep marks mean lowering the whole surface to the bottom of the deepest scratch. The full chain runs Micro-Mesh 1800, 2400, 3200, 3600, 4000, 6000, 8000 and 12000, then Meguiar’s PlastX. Sand the whole crystal at each grade in small circles, turning the holder, and clean the pads often. Each grade must fully remove the last one’s marks. Check under a loupe before you move on. Forum methods differ on where to start, so begin as fine as the scratch allows. Too much removal changes the fit and the dome, so for a deep scratch or a crack, a new crystal is usually the better answer.',
      figure: 'bench:cx-polish',
      caption: 'Removing a scratch means lowering everything around it.',
    },
  ],
  quiz: [
    { q: 'A crystal’s gasket measures 29.4 mm and it’s in good condition. What size crystal do you order?', options: ['29.3 mm', '29.4 mm', '29.5 mm', '29.8 mm'], answer: 2, explain: 'Order 0.1 mm larger than a good gasket, so the gasket is squeezed.' },
    { q: 'You see a reflective ring around the inside of a plastic crystal. What does that tell you?', options: ['It’s a tension-ring crystal', 'It’s a mineral glass', 'It’s glued in', 'It’s been polished badly at the inner edge'], answer: 0, explain: 'The metal ring inside the plastic pushes the crystal outward. It takes a chamfered die and one smooth stroke.' },
    { q: 'You’ve pressed a sapphire into a new hard gasket, and it has crept up a little. What now?', options: ['Glue it', 'Press harder straight away, until it stays down for good', 'Fit an oversize crystal', 'Let it rest, then press again until it clicks'], answer: 3, explain: 'The gasket can push the crystal back up, so the method is to rest for about 20 minutes and press again. Overpressing can shatter sapphire.' },
    { q: 'You want to press in a mineral glass, and you have only Bergeon 5500-C tapered dies. What do you do?', options: ['Use them, since dies are universal', 'Use them, but press in one fast stroke', 'Get the right die first', 'Warm the glass, then use them'], answer: 2, explain: 'The 5500-C dies are for tension-ring crystals and aren’t recommended for mineral glass.' },
    { q: 'An acrylic has one deep gouge. What’s usually the better answer?', options: ['A new crystal', 'Polywatch for an hour', 'Sanding only the gouge', 'Filling it with UV glue'], answer: 0, explain: 'Removing a scratch means lowering the whole surface to its depth, and that changes the fit and dome. A new crystal is often cheaper in every way.' },
  ],
}

const CASE_CROWNS = {
  id: 'case-crowns',
  title: 'Crowns, tubes and stems, in millimetres',
  summary: 'Two threads, four tube types, and why a tap number means nothing alone.',
  level: 'Advanced',
  time: '1 hr',
  tools: ['Digital calipers', 'Loupe', 'Pin vice', 'Case press and punches', 'New crown and tube', 'Retaining compound'],
  intro:
    'A crown is the only part of a case that moves through a seal every day, so it’s where many leaks begin. Parts are easy to order wrongly, because the trade’s tap numbers aren’t one system. This lesson works in millimetres throughout, then shows how tubes are held in the case. “Replace a crown & winding stem” covers cutting the stem to length.',
  steps: [
    {
      title: 'Think in two threads',
      body: 'Most modern crowns screw onto the stem end and slide on a tube fixed in the case middle. The tube guides the crown and limits side play. A push-in crown seals on a gasket inside the crown that rides on the tube. A screw-down crown also has a thread or bayonet on the tube, and tightening it compresses the gaskets between crown and tube. So there are two threads to think about: stem-to-crown, and on screw-downs, crown-to-tube. Check which one is giving you trouble before ordering. A crown that won’t wind has a stem problem. A crown that won’t screw down has a tube problem.',
      figure: 'bench:ct-sections',
      caption: 'Push-in and screw-down crowns in section. Note where each seal sits.',
    },
    {
      title: 'Record the stem thread in millimetres',
      body: 'Tap numbers aren’t one system. Tap 10 means 0.90 mm at Esslinger and Otto Frei, and 1.00 mm at H.S. Walsh. The two charts run in opposite directions, so a tap number on its own can buy the wrong part. Measure the stem thread diameter directly, write it in millimetres, and only then use a supplier’s chart. A Ronda 509 and a Ronda 1062 both use 0.90 mm, and a forum poster calls that the most common wristwatch thread. Calipers may not separate two similar stems, so look at the thread under magnification too, and test a known crown. If in doubt, ask the supplier which chart they use.',
      figure: 'bench:ct-tap',
      caption: 'The same tap number on two supplier charts. Millimetres don’t have this problem.',
    },
    {
      title: 'Match the crown to the tube',
      body: 'Measure the tube’s outside diameter and the stem’s thread, and write down the crown’s diameter. One aftermarket range shows how these fit together: double O-ring crowns with a 0.90 mm thread come for 2.0 mm tubes, with a 1.3 mm post and crowns of 4.0 to 6.5 mm, and for 2.5 mm tubes, with a 1.4 mm post and crowns of 4.5 to 7.0 mm. Those are one supplier’s sizes, not a standard. Tube thread pitches aren’t documented here, so a screw-down crown should come with its matching tube. Check the crown slides on the tube smoothly and seats without rocking. If it rocks, the tube or the gasket is the wrong size.',
      figure: 'bench:ct-sizes',
      caption: 'Three diameters to write down before you order. Figures are one supplier’s range.',
    },
    {
      title: 'Service a crown seal',
      body: 'No step-by-step for replacing a gasket inside a crown was found, so treat a crown with a failed seal as a whole part and replace it. A thin film of silicone grease is the default on the tube and on screw-down threads. Witschi lubricates the tube with silicone grease so the crown screws in and out easily, and says it can stop the crown seal twisting during assembly. Apply it precisely and sparingly, because excess can get inside as the stem goes in. Check a push-in crown by feel: it should slide with a slight even drag. Check a screw-down crown by counting the turns as it tightens: it should start freely and stop firmly, with no grit. If it binds part way, clean the tube threads and look for damage before you try again. Never force a screw-down crown.',
      figure: 'bench:ct-grease',
      caption: 'A thin film on the tube and thread. Excess only travels inwards.',
    },
    {
      title: 'Work out how the tube is held',
      body: 'Tube replacement depends on how the tube is held. Press-fit tubes are pressed in, often with retaining compound. Threaded tubes screw into the case, usually with thread-lock. Friction-fit tubes go into a blind hole. Soldered tubes are joined to the case. Look inside the case at the tube’s end, check for a cut-out or flats, and find the case’s service data if you can. If you can’t tell, don’t apply force. Treat any tube job as a full case strip, and replace crown and tube together. That last point is one experienced author’s advice, and it avoids re-using a seal that’s been heated.',
      figure: 'bench:ct-tubes',
      caption: 'Four ways a tube is held, and the risk with each.',
    },
    {
      title: 'Change a press-fit tube',
      body: 'This is the one tube job a careful amateur can attempt. Strip the case. Check the tube’s cut-out and which way round it sits. Press the old tube out with a punch that contacts the tube’s inside, then clean the case. Put retaining compound on the part that enters the case. Loctite 638 is Omega’s specification for one tube type, so check what your case calls for. Press in the new tube with its cut-out the same way round. If it won’t fully seat, put an old crown on it and tap gently with a plastic-faced hammer. Check the tube sits square and the new crown runs true on it. If the crown binds, the tube has gone in crooked.',
      figure: 'bench:ct-press',
      caption: 'The punch bears on the tube, never on the case.',
      caution: 'Orientation is the main risk. A cut-out facing the wrong way can stop the stem or the crown seating. Note it before the old tube moves.',
    },
    {
      title: 'Know when heat makes it a specialist job',
      body: 'Threaded and friction-fit tubes are held by thread-lock or retaining compound, and freeing them takes heat. For a threaded tube, the how-to has you strip the case and press the crystal out first, because heat can damage its seal. Then heat with a focused butane torch, unscrew with the correct tool, clean all old thread-lock off, fit any washer, thread-lock and refit. A friction-fit tube needs heat and a small easy-out, and it can snap, leaving a fragment to drill out. A soldered tube means a jig, drilling, tapping in two stages and fitting a threaded tube, which is specialist work. Heating is a whole-case decision: crystal out, gaskets out, nearby lume considered. If a case is worth more than your confidence, send it out.',
      figure: 'bench:ct-heat',
      caption: 'Everything that heat can hurt comes out first.',
    },
  ],
  quiz: [
    { q: 'A supplier sells a “Tap 10” crown. You’ve measured your stem thread at 0.90 mm. What do you do?', options: ['Order it, since Tap 10 is always 0.90 mm', 'Check that supplier’s chart first', 'Order Tap 9 to be safe', 'Re-cut the stem thread to suit'], answer: 1, explain: 'Tap 10 means 0.90 mm on some charts and 1.00 mm on others. The millimetre figure is what counts.' },
    { q: 'A screw-down crown winds the watch perfectly but won’t tighten down. Which thread do you look at?', options: ['The crown-to-tube thread', 'The stem-to-crown thread', 'The caseback thread', 'The setting lever screw'], answer: 0, explain: 'Winding proves the stem connection works. Screwing down depends on the thread on the tube.' },
    { q: 'You’re about to heat a threaded tube. What must come out first?', options: ['Only the movement', 'Only the crown', 'Nothing, since the heat is brief and local', 'The movement, crystal and gaskets'], answer: 3, explain: 'Treat it as a full case strip. Heat can damage the crystal’s seal, and the crown’s seal as well.' },
    { q: 'A new press-fit tube won’t quite seat by hand press. What’s the how-to’s method?', options: ['Heat the case gently', 'Tap it in through an old crown', 'File the tube end down', 'Leave it proud and fit a thinner gasket'], answer: 1, explain: 'The old crown protects the tube end, and it’s why you keep the old crown until the job is done.' },
  ],
}

const CASE_BEZELS = {
  id: 'case-bezels',
  title: 'Rotating bezels: take one off and align it',
  summary: 'Snap bezels, click springs and inserts, using Seiko as the worked example.',
  level: 'Intermediate',
  time: '45 min',
  tools: ['Padded vice', 'Plastic die', 'Case opener', 'Crystal press', 'Pegwood', 'Silicone grease', 'Double-sided adhesive ring'],
  intro:
    'Most serviceable dive bezels snap over the case on a thin spring. The evidence here comes from Seiko-based guides. Rolex, Omega and Tudor designs differ, and their internals aren’t documented here, so don’t apply these steps to them. Find that maker’s method, or leave it to someone who has the right tool.',
  steps: [
    {
      title: 'Understand how it’s built',
      body: 'A snap bezel has a row of teeth on its underside and a thin click spring or wire on the case. The spring drops into the teeth to give the clicks, and on one design it has two feet seated in case holes. A dive bezel turns anticlockwise only, so a knock can only overstate elapsed time. A gasket under the bezel gives the turning feel and keeps dirt out. On rotating bezels the crystal is usually fixed to the case middle, so the bezel comes off without disturbing it. Check by turning the bezel: it should click evenly and resist clockwise movement.',
      figure: 'bench:cb-build',
      caption: 'A snap bezel in section, with its teeth seen from below.',
    },
    {
      title: 'Know the ball type before you lift',
      body: 'Some older bezels use a ball instead. A hole in the case holds a spring and ball, with the top peened to retain the ball. Forum reports say a perished O-ring is a common cause of faults here, and that a ballpoint pen ball is a poor substitute because it can cut a groove. Seiko didn’t always supply these parts separately. All of that comes from forum summaries, so check it for your model. Look at the underside edge with a loupe if you can see in, and find a guide for your reference. If you find a ball, go gently: it can jump out as the bezel lifts.',
      figure: 'bench:cb-ball',
      caption: 'The ball detent. Lift slowly, and work over a tray.',
    },
    {
      title: 'Lift a snap bezel off',
      body: 'Clamp the watch in a padded vice with a plastic die protecting the crystal. Find the teeth on the underside. Lift slightly and slide a case opener below the teeth, not into them. Twist between the lugs to free the bezel. Going in between the lugs means any slip lands where it won’t show. Work a little at a time, rather than prising hard at one point. Check the gap is opening evenly. If it won’t move, stop. Causes of a stuck bezel include poor refitting, a forced undersize bezel, a misangled spring and packed dirt, and force bends the bezel.',
      figure: 'bench:cb-lift',
      caption: 'The blade goes under the teeth, and between the lugs.',
    },
    {
      title: 'Save the spring and note its position',
      body: 'Lift out the click spring, store it safely and record exactly where it sat and which way round. Take a photo before you touch it. A small turn of the bezel with light upward pressure can help free things. Clean the channel with pegwood and Rodico, since packed dirt is a named cause of stiff bezels. Check the spring isn’t bent, and that its feet are intact. If the spring is kinked, replace it: a bent one is a likely cause of uneven clicks.',
      figure: 'bench:cb-spring',
      caption: 'Plan view with the bezel off. Photograph this before anything moves.',
    },
    {
      title: 'Choose and fit the bezel gasket',
      body: 'A bezel gasket of 0.8 mm is the most common and OEM size on these Seiko designs. A 0.7 or 0.6 mm gasket gives smoother rotation. Too thin and the bezel may pop off, too thick and it sticks. Those are retail figures, so compare with what came out of your watch. Hold the gasket in its groove with a little silicone grease and pegwood. Check it lies flat and unstretched all the way round. If it’s twisted, it will make the bezel stiff in one spot.',
      figure: 'bench:cb-gasket',
      caption: 'The gasket thickness sets how the bezel feels.',
    },
    {
      title: 'Press the bezel back on',
      body: 'Confirm the spring is seated. Set the bezel on the case, then press it on with a plastic die on a crystal press, pressing squarely. Snap bezels click when seated. Protect the crystal, and keep the press on the case’s axis. Check by turning it through a full circle: the clicks should be even and it should resist clockwise movement. If it won’t turn or feels gritty, take it off and re-check the spring position and gasket. An ill-fitting bezel forced on is a cause of a stuck one next time.',
      figure: 'bench:cb-press',
      caption: 'Square and even, until it clicks.',
    },
    {
      title: 'Change an insert',
      body: 'Inserts are held by double-sided adhesive. Slide a sharp blade between insert and bezel from the inside edge, then work round to break the bond. Steel and aluminium bend, and ceramic can shatter, so wear eye protection and don’t expect to re-use it. Clean the track with ethanol or a citrus-based remover and scrape off the residue. Fit the bezel bare first, then lay a double-sided ring in the track. It should sit flat and not overhang. Inserts are case-specific: an SKX007 insert doesn’t fit an SKX013, but does fit the SKX009 and SKX011. Check the size against your case before you peel any backing.',
      figure: 'bench:cb-insert',
      caption: 'Blade from the inside edge. The outside edge is the one people see.',
    },
    {
      title: 'Align it on the click',
      body: 'Turn the fitted bare bezel gently anticlockwise, then clockwise, until it rests against its click. Then set the insert so its 12 marker lines up with the dial and chapter ring, and press down evenly. Fitting the insert after the bezel is on the case lets the click position define true 12 o’clock. Check by rotating one full turn and coming back to 12. A bezel that’s off by half a click can’t be cured by turning it. Lift the insert and reset it, or index the bezel to a different tooth when you refit it.',
      figure: 'bench:cb-align',
      caption: 'The click decides where 12 is. The insert follows it.',
    },
  ],
  quiz: [
    { q: 'You’re lifting a Seiko snap bezel. Where does the opener go?', options: ['Under the teeth, between the lugs', 'Into the teeth, at 12 o’clock', 'Between the crystal and the insert, at 6 o’clock', 'At the crown, for leverage'], answer: 0, explain: 'Below the teeth so they aren’t damaged, and between the lugs so any slip won’t show.' },
    { q: 'A fitted bezel sits half a click off 12 no matter how you turn it. What’s the cure?', options: ['Bend the click spring', 'Fit a thinner gasket', 'Lift the insert and reset it on the click', 'Turn the bezel harder, until it settles past the click'], answer: 2, explain: 'The click positions are fixed, so the insert must be reset, or the bezel indexed to another tooth when refitting.' },
    { q: 'A bezel pops off too easily after you fitted a 0.6 mm gasket. The original was 0.8 mm. What’s the likely cause?', options: ['The spring is upside down', 'The insert is too heavy', 'The crystal is loose', 'The gasket is too thin'], answer: 3, explain: 'Too thin and the bezel may pop off. Too thick and it sticks.' },
    { q: 'You want to use these steps on a Rolex bezel. What’s the right call?', options: ['Go ahead, since they’re all similar', 'Find that maker’s method first', 'Use more force, since Rolex fits tighter', 'Remove the crystal first, then carry on'], answer: 1, explain: 'The evidence here is Seiko only. Other makers’ internals aren’t documented, so don’t assume they match.' },
  ],
}

const CASE_BRACELETS = {
  id: 'case-bracelets',
  title: 'Bracelets: pins, sizing and stretch',
  summary: 'Identify the retention first, and be honest about what fixes a stretched bracelet.',
  level: 'Intermediate',
  time: '40 min',
  tools: ['Pin pushers', 'Bracelet holder or block', 'Small flat hammer', 'Screwdrivers', 'Calipers', 'Masking tape', 'Tray'],
  intro:
    'Most bracelet damage comes from treating every bracelet the same. There are several ways links are held, and each comes apart differently. “Resize a metal bracelet” covers the simple case. This lesson covers all of them, plus what can and can’t be done for a stretched bracelet.',
  steps: [
    {
      title: 'Identify the retention before you touch it',
      body: 'Look at both sides of the link under a loupe. A single-sided screw has a slotted head one side and a smooth tip the other. A double-sided screw has slots on both sides. A split pin has small, messy-looking heads, often with arrows stamped inside the link. Pin and collar shows round pins, with a small metal collar hidden in the central link. A friction pin is a smooth cylinder held by friction alone, and is the least secure. Check which you have before you pick up a tool. If nothing moves with light pressure, you may have the wrong type, so stop.',
      figure: 'bench:cr-types',
      caption: 'What you can see from outside, and what’s hidden in the link.',
    },
    {
      title: 'Plan the removal on the wrist',
      body: 'Fold the links out on the wrist to count how many must go. Set any micro-adjust to its centre first, so you keep movement both ways. Then decide where links come from. Esslinger divides them evenly so the clasp stays centred, while Fratello takes more from the 6 o’clock side so the clasp sits slightly towards 6. It’s a matter of wrist preference, so centred is the default and a shift towards 6 is a comfort option. Work on a solid surface, with tape on the bracelet against hammer marks. Check your count twice before pushing a pin. Refitting a link is slower than leaving it in.',
      figure: 'bench:cr-plan',
      caption: 'Count first. Default to a centred clasp.',
    },
    {
      title: 'Undo screws without ruining the slot',
      body: 'Choose a driver that fully seats in the slot. Typical slotted screws take 1.2 or 1.4 mm, with drivers from 1.0 to 1.6 mm (one source, so measure yours). Press down as you turn. For a double-sided screw, take the bracelet off the watch, clamp one driver upright, seat the screw on it, and unscrew from the top with a second driver. If a single-sided screw is glued, dip only the bracelet in boiling water, then let it cool before you try again. Check the slot stays crisp. If the driver starts to lift, stop and go up a size. On refitting, Loctite 222 is an optional extra on screws that work loose.',
      figure: 'bench:cr-screws',
      caption: 'A double-sided screw needs one driver held still and one turning.',
    },
    {
      title: 'Drive split pins in the arrow’s direction',
      body: 'This is the most common beginner mistake, because split pins are one-way. Hold the link over a hole with the arrow pointing down into the holder, so the pin leaves in the arrow’s direction. Choose the largest pusher that passes smoothly. Typical pushers run 0.7 to 1.0 mm (one source). Keep it upright and tap with a flat hammer face. To refit, turn the link over and push the pin back against the arrow, the same way round as it came out. Check it’s flush on both sides. If a sleeve stays in the link after the pin comes out, push it out separately. If a pin won’t move, turn the bracelet over and read the arrow again before you hit it harder.',
      figure: 'bench:cr-split',
      caption: 'Out with the arrow, back in against it.',
    },
    {
      title: 'Catch the collar',
      body: 'Pin and collar bracelets hide a tiny collar in the central link. Punch the pin out over a tray, and catch the collar. To rebuild, fit the collar in the central link first, then tap the pin in through it. Test that the pin stays put by pushing it lightly with your finger. If it slides, the collar has gone in the wrong way round, so reverse it. Count your collars before and after: losing one means ordering a part, and the bracelet can’t be closed until it arrives. Work in a tray with a raised edge, because a collar that drops on a hard floor is gone.',
      figure: 'bench:cr-collar',
      caption: 'Collar first, pin second. If it slides, turn the collar round.',
    },
    {
      title: 'Test a pin at both ends',
      body: 'A removed pin that’s tapered, with a different diameter at each end, is a cotter pin and needs another method. Check with a gauge or calipers at both ends, before you decide on a direction. A tapered pin is wedged in, so pushing harder from the wrong side only tightens it. Esslinger doesn’t give the method, so look up your bracelet before you hit it again. When you fit new oversize-length pins, cut them flush, push them out slightly and file the end. Don’t file with the pin in the band, or the file marks the link.',
      figure: 'bench:cr-taper',
      caption: 'Measure both ends. Different readings mean a tapered pin.',
    },
    {
      title: 'Check the fit and the spring bars',
      body: 'Close the clasp on the wrist. One finger under the bracelet is correct, and two is too loose. Flex every link and run a fingernail over each pin end: nothing should catch. Then check the spring bars, which hold the whole bracelet on. Their diameter and length must suit the lug width, and the wrong one risks losing the watch. Replace any that’s bent or weak, and push the bracelet in both directions after fitting, to prove both ends have engaged. Don’t size a spring bar by eye, and if the old one has gone, measure the lug width and the hole.',
      figure: 'bench:cr-fit',
      caption: 'One finger, and both bar ends fully home.',
    },
    {
      title: 'Be honest about stretch',
      body: 'A stretched bracelet has two causes: worn pins, and metal lost from link edges where adjoining links grind together. Hang the bracelet to judge it. Then separate the links, keep side links in their original positions, and inspect the pins. New pins improve the play, but they can’t rebuild lost metal, so a home re-pin only goes part way. Laser welding rebuilds the link edges and is specialist work: the metal is filled, filed flat and refinished. Links can kink during strip-down, too. If several links are badly worn, replacing the bracelet may make more sense. Tell the owner which of those you’ve done.',
      figure: 'bench:cr-stretch',
      caption: 'Two kinds of wear. New pins fix only one of them.',
    },
  ],
  quiz: [
    { q: 'You’ve tapped a split pin twice with no movement. What do you check first?', options: ['The arrow’s direction', 'That the hammer is heavy enough', 'Whether the link needs heating', 'That the clasp is shut'], answer: 0, explain: 'Split pins are one-way. Read the arrow again before you hit it any harder.' },
    { q: 'A pin-and-collar pin slides straight out again after you’ve rebuilt the link. What’s wrong?', options: ['The pin is too short', 'The link is stretched', 'The hammer face wasn’t flat', 'The collar needs reversing'], answer: 3, explain: 'Refit the collar first and test the pin. If it slides, reverse the collar.' },
    { q: 'A removed pin measures 0.9 mm at one end and 1.0 mm at the other. What is it?', options: ['Worn at one end, so replace it with the same size of pin', 'A tapered pin, which needs another method', 'A split pin opened by removal', 'Fine, the caliper is out'], answer: 1, explain: 'A different diameter at each end means a tapered pin. Esslinger calls it a cotter pin, and it needs another method.' },
    { q: 'An owner asks you to “fix the stretch” with new pins. What’s the honest answer?', options: ['It will be as good as new once every pin is replaced', 'Pins will do nothing at all', 'It helps the play but can’t replace lost metal', 'Only polishing can fix stretch'], answer: 2, explain: 'New pins cure pin wear only. Metal lost from link edges needs laser welding, or the bracelet needs replacing.' },
  ],
}

const CASE_WATER = {
  id: 'case-water-test',
  title: 'Test water resistance and find the leak',
  summary: 'Choose the pressure, run dry and wet tests, and read what pass and fail look like.',
  level: 'Advanced',
  time: '1 hr',
  tools: ['Dry or wet water tester', 'Hot plate at 40 to 45 °C', 'Distilled water', 'Lint-free cloth', 'Loupe'],
  intro:
    'A fresh gasket proves nothing until the case has been tested. The commonest public error is to apply a 125% test factor to ordinary watches. That rule belongs to divers’ watches only. If you don’t own a tester, you can still run the condensation test, and you should treat the watch as splash-only until a shop has tested it.',
  steps: [
    {
      title: 'Choose the pressure from the standard',
      body: 'Read the rating on the watch, and check whether it’s a diver’s watch. ISO 22810 covers ordinary water-resistant watches, tested at their rated pressure from a 2 bar minimum. So 3 bar (30 m) tests at 3 bar, 5 bar (50 m) at 5 bar, and 10 bar (100 m) at 10 bar. Only ISO 6425 divers’ watches test at 125%: a 100 m diver tests at 12.5 bar, a 200 m at 25 bar and a 300 m at 37.5 bar. 1 bar equals 10 m. No authoritative figure exists for vintage watches or a loosely fitted acrylic, so the cautious course is to test those low, if at all, and tell the owner.',
      figure: 'bench:cw-pressure',
      caption: 'The 125% column is for divers’ watches only. Figures are calculated from the two standards.',
    },
    {
      title: 'Know what your tester can honestly claim',
      body: 'A test only proves the pressure it reached. A 10 bar bench tester can’t reach the full rating of a 200 m or 300 m watch. A shop test at 10 bar confirms the seals at 10 bar only, and the owner should be told so. The Witschi ProofMaster runs from −0.7 to 10 bar. The Bergeon 5555/98 wet tester works to 3 atm, which its sheet calls the Swiss industry criterion. Treat 1 atm as about 1 bar. Check your gauge’s unit too: 1 kg/cm² is about 0.98 bar and 1 MPa is 10 bar. Write the pressure you actually used on the job record.',
      figure: 'bench:cw-limit',
      caption: 'Where your tester stops, and what that leaves unproven.',
    },
    {
      title: 'Prepare the watch',
      body: 'Push the crown fully in, and tighten any screw-down crown. Operate the crown and pushers first, then return them to their normal position, as ISO 22810 does. Run the test at room temperature, 18 to 25 °C. Check the case is dry and the gaskets have had time to settle. Take the strap off if it gets in the way of the tester’s clamp or chamber. If the watch has already taken in water, don’t test it. Open it and dry it, as in “Water got in — emergency steps”.',
      figure: 'bench:cw-prep',
      caption: 'Crown home, screw-downs tight, everything else at rest.',
    },
    {
      title: 'Test dry first',
      body: 'A dry tester never wets the watch, so run it first. It analyses how the case deforms under vacuum and pressure. A sealed case flexes under load and stays flexed, while a leaking case relaxes as the pressure equalises. That reading of the principle is an inference, since Witschi doesn’t spell it out. Results appear as pass or fail, with a deformation figure, and the ProofMaster’s tightness tests use a fixed 50 µg/min limit. No published number says how much deformation is a pass, so use the instrument’s own verdict. Simple vacuum testers read how far the crystal bends as air is drawn out, and show whether a leak exists, not a pressure limit. If it fails, find the leak before it sees water.',
      figure: 'bench:cw-dry',
      caption: 'Sealed cases hold their flex. Leaking cases relax.',
    },
    {
      title: 'Use a wet test to locate a known leak',
      body: 'A wet tester pressurises air around the dry watch, then drops it into water and releases the pressure, so air that got in escapes as bubbles. On the Bergeon 5555/98: raise the rod, take off the lid, fill to the mark with distilled water if you can, hang the watch, and refit the lid. Pump to 3 atm, or to the watch’s rating if that’s lower, and wait 3 minutes so air can enter any leak. Lower the watch into the water and immediately release the air. Watch as the pressure falls. One retailer adds a safety pass: pressurise above the water for about a minute, release to zero, repressurise, and only then lower the watch, so a big leak shows before water is involved.',
      figure: 'bench:cw-wet',
      caption: 'Air in while dry, then under water, then release. Bubbles appear on the way down.',
      caution: 'If bubbles appear, lift the watch out of the water at once. Then open it and dry it. Don’t wait to see how bad the leak is.',
    },
    {
      title: 'Read the bubbles',
      body: 'One or two small bubbles are usually air from case gaps. A steady stream is a leak, and where it comes from shows you the seal. Bubbles appear as pressure falls, not during pressurising, because the air that entered during the hold is coming back out. Keep your eye on the crown, the pushers, the back seam and the crystal edge. Note the spot before you lift the watch out. If no bubbles appear, let the air out fully, open the lid and take the watch out. Then dry it and check for fog or water.',
      figure: 'bench:cw-bubbles',
      caption: 'A stream from one spot names the seal to fix.',
    },
    {
      title: 'Run the condensation test last',
      body: 'This is the ISO referee, and it needs no tester. Heat the watch on a 40 to 45 °C plate until the glass reaches plate temperature. Put a drop of water at 18 to 25 °C on the crystal and wipe it dry after about 1 minute. For glass over 2 mm thick, use a wet cloth or pad instead, because a drop isn’t reliable. Any mist on the inside of the glass is a concern, though mist that clears within 1 minute isn’t a defect. A watch closed in humid air can false-fail, so if it mists, dry it and retest before you blame a seal.',
      figure: 'bench:cw-condense',
      caption: 'Warm glass, cool drop. Moisture inside shows on the cold spot.',
    },
    {
      title: 'Find and fix the leak, cheapest first',
      body: 'Work from the simplest cause to the hardest. Check the crown is home and that the tube and threads are clean. Next, reseat the back with a new gasket. Then look at the crown and tube, then pushers, and leave the crystal until last, because it’s the most work. This order is reasoned, not taken from a standard. Change one thing at a time and retest after each, or you won’t know what cured it. If it still fails with new seals, suspect the tube’s fit in the case or a damaged seat. Tell the owner what was tested, at what pressure, and what passed.',
      figure: 'bench:cw-fix',
      caption: 'One change, one retest. Cheapest fix first.',
    },
  ],
  quiz: [
    { q: 'A 100 m everyday sports watch, not a diver’s, has been resealed. What pressure do you test it at?', options: ['10 bar', '12.5 bar', '2 bar only', '25 bar'], answer: 0, explain: 'ISO 22810 tests at the rated pressure. The 125% factor belongs only to ISO 6425 divers’ watches.' },
    { q: 'A 200 m ISO 6425 diver’s watch needs testing, and your tester stops at 10 bar. What can you tell the owner?', options: ['It’s proven to 200 m, since 10 bar is the usual test', 'It’s proven to 25 bar', 'It’s useless to test it', 'The seals are confirmed at 10 bar only'], answer: 3, explain: 'A test proves only the pressure it reached. The full test for that watch would be 25 bar.' },
    { q: 'During a wet test you see one small bubble, then nothing. What does that usually mean?', options: ['A failed crown seal', 'Air from a case gap', 'A cracked crystal', 'The water needs changing'], answer: 1, explain: 'One or two small bubbles are usually air from case gaps. A steady stream is a leak.' },
    { q: 'In the condensation test, mist forms and clears within 40 seconds. What’s the verdict?', options: ['Fail, any mist fails', 'Not a defect', 'Fail, but only for divers', 'Repeat at a higher temperature'], answer: 1, explain: 'Mist that clears within 1 minute isn’t a defect under the ISO 22810 method.' },
    { q: 'Steady bubbles stream from the crown during a wet test. What’s your first action?', options: ['Finish the test to see how bad it is', 'Tighten the crown under water', 'Lift the watch out at once', 'Raise the pressure to confirm'], answer: 2, explain: 'A stream means water could follow, so lift it out at once, then open and dry it.' },
  ],
}

const CASE_REFINISH = {
  id: 'case-refinish',
  title: 'Refinishing: why thickness makes the risk real',
  summary: 'Every polish removes metal for good. Decide first, then protect what’s there.',
  level: 'Intermediate',
  time: '30 min',
  tools: ['Loupe', 'Camera', 'Micrometer', 'Lint-free cloth', 'Masking tape'],
  intro:
    'This lesson is about judgement, and it doesn’t teach a polishing recipe on purpose. No abrasive grades, compound colours or brushing steps have been verified for this app, so none appear here. What the sources do agree on is what gets destroyed and why. Read it before “Case refinishing & dial ethics”, and before you pick up anything abrasive.',
  steps: [
    {
      title: 'Start from what polishing actually does',
      body: 'Every polish removes metal permanently, because removing a scratch means taking the surface down to its deepest point. Buffing compound contains abrasive too, so “just a buff” is still removing metal. The original lines can’t be put back without adding material. One UK workshop no longer polishes cases at all, and forum watchmakers report that home refinishing almost always makes a case worse. A case that’s worn normally is easier to refinish well than one already reworked at home. So the first decision is whether to touch it. A scratch on a sharp case is worth keeping, and “no” is a good answer.',
      figure: 'bench:cf-removal',
      caption: 'The whole surface comes down to the bottom of the scratch.',
    },
    {
      title: 'Read how much metal you have',
      body: 'Plated cases have almost nothing to spare. ISO 3160-1 marks GP (gold-plated) and GR (rolled gold) at a nominal 5, 10, 20, 40 or 80 µm, and GC (gold capping) at 200, 250 or 300 µm, with a tolerance of −20%. A 20 µm plate is 0.02 mm, and it may be as thin as 16 µm. Even a Dennison filled layer at 0.072 mm is thin compared with what a wheel removes. So plated cases should be cleaned, not polished. Read the mark, then look at the edges under a loupe, where wear shows first. If you can see a different colour at a corner, the plating has already gone there.',
      figure: 'bench:cf-thickness',
      caption: 'Covering thickness to scale. Small numbers are real distances.',
    },
    {
      title: 'Map every finish before you start',
      body: 'Draw the case and mark each surface brushed or polished, then photograph it from every side. One forum example of a steel sports case shows brushed case sides, polished lug tops and chamfers, and brushed lug insides. Yours will differ. The boundaries are what make the case look right, and they’re the first thing lost. Tiny chamfers between polished and brushed surfaces are a practical compromise in forum practice. Check your map against the other side of the case, which may be less worn. If you can’t tell what the factory finish was, find a reference photo of an untouched example.',
      figure: 'bench:cf-map',
      caption: 'A finish map for one example case. Draw your own.',
    },
    {
      title: 'Know what you can lose',
      body: 'Over-polishing destroys bevels and chamfers, lug thickness and shape, crisp lug holes, engraving depth and the contrast between brushed and polished areas. Gold and platinum lose material faster than steel. Sharpening edges takes metal as well, leaving lugs slightly smaller. To spot past polishing, look for rounded lug tops, uneven thickness, missing bevels, and spring-bar holes close to the edge. A rough trade rule from one retailer says a steel case can be meaningfully refinished about five times. That’s not a measured figure, but the point is that it’s a budget, and earlier owners may already have spent it.',
      figure: 'bench:cf-lost',
      caption: 'The same lug before and after heavy polishing.',
    },
    {
      title: 'Know your material',
      body: 'Better corrosion resistance doesn’t mean fewer scratches. 904L beats 316L on corrosion, with a pitting score (PREN) of 32.2 to 39.9 against 23.1 to 28.5, but their hardness overlaps at 70 to 90 HRB against 70 to 95 HRB. Those are retail figures. Titanium Grade 2 is commercially pure, while Grade 5 is the alloy Ti-6Al-4V. Watch ceramics are zirconia, and claims like “four times harder than steel” are advertising figures. Sourced titanium refinishing advice wasn’t found, so don’t assume steel habits carry over. Check what your case is made of before you do anything.',
      figure: 'bench:cf-materials',
      caption: 'Corrosion score and hardness are different questions.',
    },
    {
      title: 'If you go ahead, work in this order',
      body: 'Decide whether to touch it. Map every finish. Protect the neighbouring surfaces. Start with the least aggressive method. Stop before any edge moves. Horopedia warns that high speed and soft wheels round off sharp edges, and that overheating is a risk at speed. So check under a loupe after every short pass, against your photographs. If an edge has started to soften, stop at once, because you can’t put it back. Grades and compounds aren’t given here because none could be verified. Don’t fill that gap with a forum post on a case you care about. Practise on a scrap case first.',
      figure: 'bench:cf-order',
      caption: 'Five decisions, in order. Most of them come before you touch the case.',
    },
    {
      title: 'Add metal first, not last',
      body: 'Polishing can’t fix a deep ding, because the metal around it has to come down to its depth. Laser welding adds metal back: the damaged area is over-filled, then refinished to the original lines. Weld before polishing, so the filled and surrounding areas come down together. Spot repairs rarely blend without refinishing the whole surface, so ask about that before you agree the job. Dents or scratches on a one-piece case can also mean refinishing the whole case. This is specialist work. If a case is worth saving, this is the route that keeps its shape.',
      figure: 'bench:cf-weld',
      caption: 'Weld, then refinish. The other way round wastes the case.',
    },
  ],
  quiz: [
    { q: 'A case is marked GP 20. An owner wants a light buff to remove scuffs. What do you do?', options: ['Clean it, and explain why you won’t polish it', 'Polish lightly with a soft wheel, keeping the pressure low', 'Polish only the lug tops', 'Polish, then re-plate at home'], answer: 0, explain: 'That’s a nominal 0.02 mm of gold. Any abrasive can go through it, so plated cases should be cleaned, not polished.' },
    { q: 'Why does removing one deep scratch take so much metal?', options: ['Scratches spread with heat', 'Compound fills the scratch', 'The surface drops to the scratch’s depth', 'Steel hardens around a scratch, so it takes longer to cut'], answer: 2, explain: 'You’re lowering everything around the scratch to the bottom of it, which is why the geometry changes.' },
    { q: 'A 904L case is said to be “better steel”, so it should scratch less than 316L. What’s your answer?', options: ['Yes, it’s far harder', 'Yes, because its added copper hardens the surface layer', 'No, 904L is much softer', 'Not proven: the hardness ranges overlap'], answer: 3, explain: 'The sourced hardness ranges overlap. The clear gain is corrosion resistance.' },
    { q: 'A case has a deep ding and needs a laser weld. When do you polish?', options: ['Before the weld, to clean and prepare the whole surface', 'After the weld, so both areas come down together', 'Never, welds can’t be polished', 'Only on the welded spot'], answer: 1, explain: 'Weld first. Polishing first takes metal you then have to match.' },
  ],
}

export const CASE_TRACK = {
  id: 'casework',
  name: 'Casework & Water Resistance',
  icon: 'layers',
  accent: 'emerald',
  blurb: 'The outside of the watch: crystals, gaskets, crowns, bezels and bracelets, and how to prove the case still seals.',
  lessons: [CASE_OPEN, CASE_GASKETS, CASE_CRYSTALS, CASE_CROWNS, CASE_BEZELS, CASE_BRACELETS, CASE_WATER, CASE_REFINISH],
}
