// Extra steps for the core tracks: Your First Project, How a Watch Works,
// Straps, Case & Everyday Care, Chronographs, Build and Workshop.
// `at` is the index in the lesson's base steps to insert before (see enrich.js).
export const STEPS = {
  /* ---------------------------- Your First Project ---------------------------- */
  'fp-start': [
    {
      at: 0,
      steps: [
        { title: 'Pick a watch you can afford to mark', body: 'Use a cheap, working watch, never a valuable or sentimental one. A plain quartz on a strap is ideal. Before you touch it, photograph the case, the lugs and the crystal in good light. Those photos are your “before” record. Later, they let you tell an old scratch from one you made.' },
      ],
    },
    {
      at: 2,
      steps: [
        { title: 'Check your strap job', body: 'Tug the strap firmly at each lug, then inspect both lugs with a loupe and compare them with your photos. A fresh bright line beside a lug hole means the tool slipped. If you find one, slow down, keep the fork square to the bar and repeat the swap until it leaves no new mark. That is your first bench check, so pass it before you open a case.' },
        { title: 'Find your loupe’s working distance', body: 'A loupe focuses at one distance, and the stronger it is, the closer you must get. As a guide, a 10× works about 25 mm from the part, a 5× about 50 mm and a 3.3× about 75 mm. Hold the loupe near your eye, keep both eyes open, and bring the watch up until it snaps sharp. Test it by reading the smallest print on the caseback. If the print stays blurred, move the watch in or out, not the loupe. If the image shakes, rest your wrists on the bench.', tip: 'The British Horological Institute’s tool list has three eyeglasses, not one, so expect to add a second loupe later.' },
      ],
    },
  ],

  'fp-battery': [
    {
      at: 0,
      steps: [
        { title: 'Read the watch before you open it', body: 'Choose a plain three-hand quartz for this first job. Watch the seconds hand for a full minute and write down what it does. A hand that jumps four steps every 4 seconds is the low-battery warning on many Swiss calibres. A hand that moves once every 2 seconds is usually a low-charge warning on a solar or Kinetic watch. That kind needs light or movement, not a new cell, so stop here and pick another watch.', caution: 'Never fit an ordinary cell in place of a rechargeable one. Citizen warns that it can overcharge and damage the watch.' },
      ],
    },
    {
      at: 1,
      steps: [
        { title: 'Give the new cell a fair test', body: 'Before you close the back, watch the seconds hand for at least two full turns. It should step once a second, evenly. Many movements check the cell only about once a minute, so give it that long to settle. If it still stutters or jumps, work down this list: crown pushed fully in, cell the right way up, clamp pressing firmly, hands not touching each other or the dial. Repairers also report bad new cells, corrosion and missing plastic insulators, so try a second new cell before you blame the movement.', tip: 'A multimeter can show that a cell is flat, but Witschi warns against trusting one to judge a cell’s condition.' },
        { title: 'Deal with the old cell now', body: 'Don’t leave it on the bench. Tape over its terminals or bag it on its own, and keep it away from children and pets. Take it to a battery collection point, not the household bin, and check your local rules.', caution: 'A swallowed button cell can cause severe damage within 2 hours. Treat any suspected swallow as an emergency and get medical help at once. Don’t try to make the person sick.' },
      ],
    },
    {
      at: 3,
      steps: [
        { title: 'Prove the job the next day', body: 'Set the watch against an accurate clock, then check it a day later. It should still be ticking, and a day’s drift should be about a second or less, since many movements are rated at around ±15 to ±20 seconds a month. If it stopped, open it and recheck the clamp and the cell. If it runs open but stops once closed, something is touching, so lay it dial down and see whether a hand is catching the crystal. Log the cell code, the date and the result in your Practice Log. If the back won’t close, “Open the caseback” has a recovery step.' },
      ],
    },
  ],

  'fp-inspect': [
    {
      at: 0,
      steps: [
        { title: 'Test everything before you open it', body: 'Use a cheap hand-wound or automatic watch if you can, because a quartz module hides most of the parts you’ll look for later. Before you open the case, try everything the crown does: wind it, set the hands, change the date, and see whether the seconds hand stops when you pull the crown out. Write it all down. Now you know which faults were already there, so you can tell them from anything you cause.', tip: 'A seconds hand that keeps running isn’t always a fault. The Seiko 7S26 and the Miyota 8215 don’t hack, by design, and the 7S26 doesn’t hand-wind either.' },
      ],
    },
    {
      at: 1,
      steps: [
        { title: 'If the stem won’t come out', body: 'Stop pulling. Stem releases differ by calibre, so look up yours before you try again. The Seiko NH and 6R families are reported to release with the crown pushed fully in, pressing the lever as you pull. The Sellita SW260-1 and SW500 are reported to release in the time-setting position, using a 1 mm flat tool, since a pointed one can jam the setting lever. If a screw-type release won’t free the stem after two turns, tighten it back a turn and look again. A released stem slides out with almost no force.' },
      ],
    },
    {
      at: 2,
      steps: [
        { title: 'Identify a mechanical calibre', body: 'A mechanical movement is usually marked near the balance or under the dial, so read every mark you can reach. Then measure the diameter with a calliper and divide by 2.256 to get lignes. Compare what you have with the Movement Guides: the diameter, seconds position, date position and bridge shapes should all match. Write down the full designation, because a 2824-2 and a 2824 differ. If the layout doesn’t match the marking, suspect a clone or a swapped movement, and don’t order parts yet.', tip: 'Some Sea-Gull ST2130 movements have been found engraved as a 2824-2, so trust the layout over the engraving.' },
      ],
    },
    {
      at: 3,
      steps: [
        { title: 'Put it back and prove nothing changed', body: 'Refit the movement, then offer the stem to its hole and push gently. If it stops short, turn the crown slowly anticlockwise as you push so the gears line up. It should click home and stay put when you tug it lightly. Refit any clamps or ring, then repeat your opening test. Every function should match your notes. If the crown pulls straight out again, the release hasn’t re-engaged, so re-seat the stem and tighten the setting-lever screw a turn or two. If it feels gritty or blocked, take the stem out and look. Never force it.' },
      ],
    },
  ],

  'fp-module': [
    {
      at: 0,
      steps: [
        { title: 'Prove the new module first', body: 'Before you take the old one apart, lay the new module beside it and compare the calibre number, stem position and date position. Fit a cell and make sure the new one runs. A module that won’t run is a simple return while it’s still untouched. If the calibre number differs from the old one, check the stem height and hand-hole sizes on the data sheet before you go on, or the dial and hands may not fit.' },
      ],
    },
    {
      at: 2,
      steps: [
        { title: 'Run the ten-fit bench check', body: 'Use the dead module and its old hands as free scrap. Fit and remove the hands ten times over a dial or a spare card, and inspect it with a loupe after each fit. A mark on the dial, a bent hand or a hand that needed forcing ends the run, so start the count again. When you reach ten clean fits, log it in your Practice Log and repeat the check after about 30 days. A skill you can repeat after a gap is one you really have.', tip: 'A hand that feels loose or too tight is a fit problem, not a technique problem. The hand-fitting lesson covers both.' },
      ],
    },
    {
      at: 3,
      steps: [
        { title: 'Test it cased, the way it’s worn', body: 'Before you move on, case the watch and test it properly. Lay it dial down overnight, because a hand touching the crystal can stop it in that position only. On a date model, run the hands forward until the date flips. The hands should read close to 12. If they don’t, re-index the hour hand. A stuttering hand on a fresh cell points to hands touching or sluggish gears, not to the cell. If the watch won’t start at all, check first that the crown is pushed fully in.' },
      ],
    },
  ],

  'fp-service': [
    {
      at: 1,
      steps: [
        { title: 'Strip one you don’t need to run', body: 'Common forum advice is to strip and rebuild a scrap movement before you service one you care about. An old pocket movement or a cheap ST36 or 6497 is ideal, and it doesn’t matter if it never runs. You learn the order, the screws and how a bridge settles over its pivots with nothing at stake. Photograph each stage. You’ve passed when you can rebuild it from your tray and photos, and the train spins freely when you puff air at the escape wheel. If a part breaks or pings away, note how it happened and carry on.' },
        { title: 'Take a before reading', body: 'Measure the movement you’ll service before you strip it. Wind 10 to 15 crown turns, let it run about 20 minutes, demagnetise it, then read rate, amplitude and beat error dial up, and log them. On a 6497, set the lift angle to 44° and the beat rate to 18,000. Left at the common 52° setting, the machine reads about 18% high, so a true 250° shows as about 295°. If the lift angle isn’t published, as often happens with Seagull movements, use one setting for both readings and compare those.', tip: 'On a phone timegrapher, trust rate first. Beat error is marginal and amplitude isn’t reliable.' },
      ],
    },
    {
      at: 2,
      steps: [
        { title: 'Decide what a pass looks like', body: 'Set your targets before you read the machine, so you can’t talk yourself round. For a first service, fully wound and dial up, aim for 270–310°. Anything from 250° to 330° is still within tolerance, so 255° isn’t a failure. Beat error should be 0.5 ms or less, vertical positions within about 40° of dial up, and amplitude after 24 hours no more than 15% lower. These are hobby targets, not a maker’s specification. Compare them with your before reading too, because a clear improvement is a real result.' },
      ],
    },
    {
      at: 3,
      steps: [
        { title: 'If the numbers disappoint', body: 'Low amplitude after a service is the most visible complaint on the forums, so you’re in good company. Don’t strip it straight away. First rule out a bad reading: fully wound, 20 minutes’ running, correct lift angle. Then work through “Low amplitude: causes and cures”. Repairers often report an over-tightened train bridge or balance cock, dust under the balance, too much oil, or jewels that weren’t pegged clean. Change one thing at a time and log a reading after each change. When it passes, recheck it about 30 days later. A result that holds is your sign-off.' },
      ],
    },
  ],

  'fp-next': [
    {
      at: 0,
      steps: [
        { title: 'Pass a gate before you move up', body: 'Move on only when your last job passed its checks. A fair gate is a service that reached your target amplitude, held it after 24 hours and was still good at a later recheck. If yours didn’t, service the same calibre again. That teaches more than a harder movement will. Formal programmes work the same way, with a sign-off between modules.' },
      ],
    },
    {
      at: 3,
      steps: [
        { title: 'Climb in the order schools use', body: 'Formal courses start with a manual movement, go through timing, then take quartz, automatic, calendar and chronograph work, with casing and water resistance after that. Forum advice on practice pieces fits the start of that ladder: a scrap pocket movement, then a cheap running ST36 or 6497, with a Ronda 715 for quartz. This app’s flagship lessons carry on from there, to the NH35 or 2824 and then the 7750. The forum advice is mostly from 2015 to 2017, and views on pin-lever movements conflict, so treat it as a guide. If a rung feels too hard, drop back one and do it again.' },
        { title: 'Before you touch someone else’s watch', body: 'Sooner or later a friend will hand you a watch. Say no to anything valuable, sentimental or worn for swimming until you have a record of good results. If you say yes, photograph it, test what works, write down what doesn’t, and agree what you’re doing before you open it. Don’t promise water resistance unless you’ve pressure-tested it. If something goes wrong, your notes show what state it arrived in.' },
      ],
    },
  ],

  /* ----------------------------- How a Watch Works ---------------------------- */
  'fund-overview': [
    {
      at: 4,
      steps: [
        { title: 'Tell the family from the outside', body: 'You can sort most watches without opening them. Watch the seconds hand. One clean jump a second almost always means quartz. Small, quick steps mean mechanical: 5 a second at 18,000 beats an hour, 6 at 21,600 and 8 at 28,800. Film the hand in slow motion to count them. Judge from the running seconds, not a chronograph hand, because a quartz chronograph can have a fast sweep too. A hand that moves only every 2 or 4 seconds is a battery-powered or solar watch giving a low-power warning.' },
      ],
    },
  ],

  'fund-mechanical': [
    {
      at: 5,
      steps: [
        { title: 'Every link costs energy', body: 'The balance gets only what survives the trip. Friction anywhere along the chain takes energy first, so a dry pivot, an over-tight bridge or too much oil shows up as a smaller swing at the balance. That swing is called amplitude, and it’s why one reading can point at a fault far from the balance. See it for yourself: on a running movement, compare the swing just after a full wind with the swing near the end of the reserve. It shrinks as the spring’s push fades.' },
      ],
    },
  ],

  'fund-automatic': [
    {
      at: 2,
      steps: [
        { title: 'Not every automatic uses reversing wheels', body: 'Open a Seiko NH35 and you won’t find a reversing-wheel cluster. Seiko’s Magic Lever does the same job with a simple lever and two pawls. Other designs, such as the 7750, wind in one rotor direction only. Find out which your calibre uses before you strip it, because the service differs. On the ETA 2824-2, for example, ETA says the reversing wheels must never be washed, and should be replaced with pre-lubricated originals if needed.' },
      ],
    },
    {
      at: 3,
      steps: [
        { title: 'Not every automatic can be hand-wound', body: 'That tip assumes your crown winds the spring. Many automatics do, but the Seiko 7S26, 7009 and 6309 don’t, and none of them hacks. That’s the design, not a fault. To find out, turn the crown gently forward in its pushed-in position and feel for winding clicks. If nothing happens, check the calibre’s guide before you suspect a problem. A few turns is only a top-up: a full hand wind on a Miyota 9075 takes about 40 turns.' },
      ],
    },
    {
      at: 4,
      steps: [
        { title: 'Test the winding yourself', body: 'Wind the watch fully by hand if the calibre allows, or wear it for a full day. Then lay it still and note when it stops. Compare that with the calibre’s reserve, such as about 41 hours on an NH35. Much less on a watch you wear every day points at the winding system. Then narrow it down. If the click holds when you hand-wind, the fault is likely in the automatic gears. A rotor that spins freely with a stiff stem suggests seized reversers. A scraping rotor suggests a worn bearing or a bent rotor. These are forum tests, and reports on ETA, Rolex and Miyota calibres share one theme: the reverser or winding train wears first when lubrication is neglected.' },
      ],
    },
  ],

  'fund-quartz': [
    {
      at: 3,
      steps: [
        { title: 'Why a tiny cell lasts for years', body: 'A quartz movement sips power: published figures mostly sit between about 0.3 and 2 µA. You can estimate cell life with months ≈ mAh × 1000 ÷ µA ÷ 730. A 55 mAh cell at 1.35 µA gives about 56 months, close to the 57 months ISA quotes for that pairing. Try it with your own watch’s sheet. If a cell dies far sooner than the sum says, suspect a load, such as dirt in the gears or a chronograph left running, and not just a bad cell.' },
      ],
    },
    {
      at: 4,
      steps: [
        { title: 'But it still has gears', body: 'Simple doesn’t mean sealed for life. A quartz movement still has a gear train, pivots and oil, and they age like any other. Sluggish gears, hands touching or steel particles at the motor’s rotor can make a fresh cell stutter. To check accuracy, compare the watch with an accurate clock over a week or two. Many movements are rated at about ±15 to ±20 seconds a month, so a small drift is normal. Minutes gained or random stops are a fault, and the Quartz Repair track shows how to find it.' },
      ],
    },
  ],

  'fund-keyless': [
    {
      at: 3,
      steps: [
        { title: 'Count the clicks', body: 'Try this on any crown watch. Pushed fully in, it winds. On a date watch, the next click usually sets the date and the last click sets the hands. Each click should feel crisp, and the crown should stay where you put it. A vague click or a crown that drifts back points at the setting lever or its spring. A crown that pulls right out points at a loose setting-lever screw. An extra position that does nothing may be a phantom date position, from a date movement behind a no-date dial. That isn’t a fault.' },
      ],
    },
  ],

  'fund-escapements': [
    {
      at: 4,
      steps: [
        { title: 'Identify it before you touch it', body: 'Look at the escape wheel and fork under a loupe before you plan any work. Pointed teeth suggest an English lever and club-shaped teeth a Swiss lever. Steel pins in place of jewelled pallet stones mean a pin-pallet. Teeth on stalks and a hollow staff mean a cylinder. If it isn’t a plain Swiss lever, stop and read up first, because the routine you know may not apply. A co-axial also needs the right lift angle and a timing machine that can read it. Older Witschi units can’t, and newer ones use a mode called Spe1.' },
      ],
    },
  ],

  'fund-sweep': [
    {
      at: 4,
      steps: [
        { title: 'Mind the tension spring', body: 'On an indirect-drive movement, that thin spring is easy to damage during a service. It’s a reported trouble point on the Omega 550 series if mishandled. Photograph how it sits before you remove anything near it, and keep your tweezers clear of it. It should press lightly on the seconds pinion. If a hand that used to sit steady flutters after a service, check the spring first. That’s different from the faint, even tremble some vintage hands have always had.' },
      ],
    },
  ],

  'fund-temperature': [
    {
      at: 4,
      steps: [
        { title: 'Compare like with like', body: 'You can use this at the bench. A watch straight off your wrist and one from a cold windowsill aren’t at the same temperature, so their rates aren’t directly comparable. Let a watch settle at room temperature before you compare two readings, and note where it has been in your Practice Log. If a rate changes and nothing else has, ask what the temperature did before you touch the regulator. COSC tests at three temperatures for this reason.' },
      ],
    },
  ],

  /* ----------------------- Straps, Case & Everyday Care ----------------------- */
  'basics-strap': [
    {
      at: 4,
      steps: [
        { title: 'Check the bars before you reuse them', body: 'Look at each bar under a loupe and press each tip with a fingernail. It should slide in and spring back smoothly. Replace any bar that is bent, has a worn tip or feels weak, because a failed bar drops the watch. A replacement must match the lug width and the bar’s diameter. If a new bar rattles in the lug holes or won’t seat, it’s the wrong one, so swap it and don’t force it.' },
      ],
    },
  ],

  'basics-strap-types': [
    {
      at: 4,
      steps: [
        { title: 'Measure before you buy', body: 'Measure the gap between the lugs with a calliper, inside face to inside face, and read the width of the old strap at the lug end as a cross-check. If the two disagree, trust the gap between the lugs. For length, measure the old strap at the buckle hole you actually use, not overall, because old straps stretch. Write both numbers down before you shop.' },
        { title: 'Inspect a strap before it fails', body: 'Bend the strap gently at the lug ends and around the buckle holes. Look for cracks, loose or broken stitching, and a hole that has stretched into a slot. On rubber, look for splits near the lugs. Any of these means it’s time to replace it. A new strap costs far less than a dropped watch.' },
      ],
    },
  ],

  'basics-caseback': [
    {
      at: 3,
      steps: [
        { title: 'If it won’t open', body: 'Stop before the tool slips. Look at the edge again: a back with no notch may be a screw-off with fine knurling. For a stubborn screw-off, re-seat the wrench so its pins sit fully in the notches, press down harder and try one firm, steady turn. If it still won’t move, stop. A stuck back isn’t worth a gouged case, and a watchmaker can open it for you.' },
      ],
    },
    {
      at: 4,
      steps: [
        { title: 'If it won’t close', body: 'Don’t lean on it. First check that the notch in a snap-on back sits over the stem, and that the gasket is in its groove and not pinched. Then use a case press. Pick dies that push only on the outer rim of the back and, on the crystal side, on the case outside the crystal, never on the crystal, lugs or crown tube. Put a soft cloth on the crystal side and press slowly. If the centre of the back bows, the die is too small: a back pressed in the middle buckles and won’t seat. If it still won’t snap, stop and check for a bent rim or the wrong back.', caution: 'A misplaced stem notch can damage the movement when you press. Check it every time.' },
      ],
    },
  ],

  'basics-settime': [
    {
      at: 3,
      steps: [
        { title: 'If the date flips at noon', body: 'A date that changes around midday means the watch is 12 hours out. Run the hands forward through a full 12 hours, then set the time again. To check, advance the hands slowly past 12. The date should change at only one of the two 12s, and that one is midnight. If it doesn’t change at either, stop turning and treat it as a fault.' },
      ],
    },
    {
      at: 4,
      steps: [
        { title: 'Set it to the second', body: 'If your movement hacks, the seconds hand stops when you pull the crown. Pull it as the hand reaches 12, set the minutes to the next full minute, and push the crown in on a time signal. Bring the minute hand to its mark from one direction, so gear play doesn’t leave it slightly off. Seiko’s own manuals differ by calibre: some say to go 4 to 5 minutes past and turn back, others to come up from behind, so follow yours. If the seconds hand keeps running, your watch may not hack. On calibres such as the 7S26 and Miyota 8215 that’s the design, not a fault.' },
      ],
    },
  ],

  'basics-care': [
    {
      at: 3,
      steps: [
        { title: 'Measure your rate at home', body: 'You don’t need a machine. Set the watch against an accurate clock, note the difference at the same time each day, and average a few days. Judge the result against the calibre’s own specification, not against zero. +18 s/day is fine on a Seiko 7S26, rated −20 to +40, but a fail for a chronometer. A sudden change on a watch that used to be steady matters more than the number, so check for magnetism first.' },
        { title: 'Run a quick safety check', body: 'Every so often, look the watch over in good light. Tug the strap at each lug, open and close the clasp, and check that the crown closes fully and there’s no fog under the crystal. A loose bar or a worn clasp is far cheaper to replace than a dropped watch. If you find fog, work the “Water got in” diagnostic straight away.' },
      ],
    },
  ],

  /* ------------------------ Chronographs & Complications ---------------------- */
  'chrono-how': [
    {
      at: 4,
      steps: [
        { title: 'Work out which layout you have', body: 'Three questions place most chronographs. Is it switched by a column wheel or a cam? Look through a display back or at the calibre’s guide. Does it couple with a swinging wheel or a vertical clutch? Press start and watch the sweep hand closely: a small jump points to a coupling wheel, and a clean start points to a vertical clutch, as on the Seiko 6139. Is it built in or added on? A modular chronograph adds a separate module to a base movement, and a meca-quartz pairs a quartz movement with a mechanical chronograph module. Each strips differently, so settle this before you order parts or pick up a screwdriver.' },
      ],
    },
  ],

  'chrono-use': [
    {
      at: 3,
      steps: [
        { title: 'A running quartz chronograph drains its cell', body: 'On a quartz chronograph, the cost of leaving it running is easy to work out. ISA quotes its 8171/204 at 1.35 µA with the chronograph stopped and 12 µA with it running. On a 55 mAh cell, the rough sum (mAh × 1000 ÷ µA ÷ 730) falls from about 56 months to about 6. If a quartz chronograph keeps flattening cells, check that it isn’t being left to run.' },
      ],
    },
    {
      at: 4,
      steps: [
        { title: 'Is it the hand or the hammer?', body: 'Run start, stop and reset several times, stopping at different points, and note where the hand lands. If it always returns to the same wrong spot, the hand was probably fitted off zero, and refitting it cures that. If it lands in a different place each time, the hammer may be slipping off the heart cam, which is a job for the bench. These are forum tests, but they cost nothing. On a quartz chronograph, a hand off zero is usually a crown-and-pusher zeroing job, which the Quartz Repair track covers.' },
        { title: 'Read a tachymeter', body: 'A tachymeter scale turns the time over a known distance into speed. Start the chronograph at one marker and stop it at the next, one kilometre or one mile on, then read the scale under the sweep hand. That gives km/h or mph. Check it with the sum 3600 ÷ seconds: 30 seconds reads 120 and 45 seconds reads 80. The scale runs out at 60, because anything slower takes more than one turn of the hand, so use the sum instead. A pulsometer scale works the same way for a heart rate, and usually states how many beats to count.' },
      ],
    },
  ],

  'comp-date': [
    {
      at: 1,
      steps: [
        { title: 'Find your calibre’s window', body: 'The danger zone isn’t the same on every watch. It’s given as 9 pm to 3 am on the ETA 2836-2 and 2834-2, 9 pm to 1 am on the Seiko 6R35 and 6R54, and 8 pm to 2 am on the Seiko 8L35. If you don’t know your calibre, avoid the widest span, 8 pm to 3 am. First make sure you know AM from PM. If the date flips around noon, the watch is 12 hours out, so run the hands on through 12 hours before you set anything.' },
      ],
    },
    {
      at: 3,
      steps: [
        { title: 'Test which GMT you have', body: 'Move the hands well clear of the date change. Pull the crown to the first click and turn it slowly one way, then the other. If the local hour hand jumps in one-hour steps, you have a true GMT, like the Miyota 9075, where that hand also drives the date and there’s no separate quick-set. If the 24-hour hand moves instead, you have an office GMT. On the Seiko NH34, at the first click, turning clockwise moves the GMT hand and turning anticlockwise sets the date. Neither type is a fault. If nothing moves at the first click, try the next one and check the calibre’s guide.' },
      ],
    },
  ],

  'comp-calendar': [
    {
      at: 3,
      steps: [
        { title: 'Set a moonphase from a known full moon', body: 'Look up the date of the last full moon. With the hands well clear of the date change, advance the disc with its corrector until the full moon sits centred in the aperture, then add one step for each day since. Check the result against a lunar calendar for today. A common 59-tooth disc treats two lunar months as 59 days when they’re really about 59.06, so it drifts by about a day every two to three years (sources vary). Correct it by a step when it does, and start again from a full moon if the watch has stopped.' },
      ],
    },
  ],

  'chrono-service': [
    {
      at: 5,
      steps: [
        { title: 'Prove the reset', body: 'Before the dial goes on, run start, stop and reset many times, stopping at different points. Each heart should finish in the same position every time. Watch the hammer too: forum advice on a Valjoux 7736 is that it must seat fully on the seconds heart and leave a small gap at the minute counter. Your own calibre may differ, so check its sheet. If the finishing point changes from one reset to the next, suspect the hammer slipping off the cam and correct that first. Fit the chronograph hands only after this passes, so a hand can’t hide a hammer fault.' },
        { title: 'Measure the drag', body: 'Once the base movement has passed on its own, read the amplitude with the chronograph stopped, then again with it running. We found no published limit for the drop, so judge it by size. A small fall can be normal, but a collapse means the chronograph works are dragging. Check the coupling depth first, then look for misplaced grease or a lever that isn’t free. Change one thing at a time and re-read after each change.' },
      ],
    },
  ],

  /* ---------------------------- Build Your Own Watch -------------------------- */
  'build-plan': [
    {
      at: 3,
      steps: [
        { title: 'Read the hand-hole numbers', body: 'Hand holes are listed as hour, minute and seconds, often in hundredths of a millimetre. One forum list gives the NH35 as 150/90/21, the ETA 2824 as 150/90/25 and Miyota as 152/100/17, so an NH35 takes 1.50, 0.90 and 0.21 mm. The same post says Seiko hands fit ETA apart from the seconds hand, and don’t fit Miyota. Treat these as forum figures and confirm them with your supplier. If a listing gives no hole sizes, ask before you buy.' },
      ],
    },
  ],

  'build-first-kit': [
    {
      at: 4,
      steps: [
        { title: 'Inspect the kit the day it arrives', body: 'Don’t wait for build day. Wind the movement and confirm it runs, then pull the crown through each position. The hands should set and the date should change. Drop the dial feet into their holes without locking them. Offer each hand to its post without pressing, to check the hole looks right. Try the crown on the stem thread and count the gaskets. If anything fails, return it now, while it’s untouched. Cheap clones deserve extra care: some Sea-Gull ST2130 units have been reported as unoiled or dirty.', tip: 'Buying an NH36? Its day wheels are pre-aligned, so 3 o’clock and 4 o’clock crown versions aren’t interchangeable. Check yours matches the dial.' },
      ],
    },
  ],

  'build-dial-hands': [
    {
      at: 2,
      steps: [
        { title: 'Check the dial before any hand goes on', body: 'Look across the dial with a loupe. It must lie flat with no gap. Try the quick-set and confirm the date moves freely and sits in the window. On an NH35, a dial 0.4 mm thick is ideal and 0.6 mm is the practical limit, because a thicker dial uses up the room for the hands. If the quick-set has gone stiff since you fitted the dial, take it off and look, and don’t force it. On the NH34, field reports point at the dial washer or a tight dial centre hole. Then turn the crown until the date flips. That moment, not noon, is the 12:00 your hands go on at.' },
      ],
    },
  ],

  'build-case': [
    {
      at: 4,
      steps: [
        { title: 'Run a function test with the back off', body: 'Before you seal anything, test it all. Wind it and feel for smooth clicks. Pull the crown through each position, run the hands past midnight and quick-set the date. Press gently on the crown: the movement mustn’t turn or shift in the case. If it does, the ring or clamps aren’t holding, so fix that before you go on. If the crown binds in one position only, suspect the stem height or length. On an automatic, tilt the case and watch the rotor turn freely without touching anything.' },
      ],
    },
  ],

  'build-seal': [
    {
      at: 4,
      steps: [
        { title: 'Give it a day before you call it done', body: 'Wear it, or run it for a night dial down and a day dial up. A hand touching the glass may show only in the dial-down position, and then you must open it and reset the hand height. Check that the date flips near midnight, and compare the rate with the calibre’s own specification, not with zero. If it stops or gains wildly, work through “Common build problems” before you wear it. Log the result so your next build starts from a known-good record.' },
      ],
    },
  ],

  'build-troubleshoot': [
    {
      at: 4,
      steps: [
        { title: 'Date changes at the wrong time', body: 'If it flips around noon, the time is 12 hours out, so run the hands on through 12 hours and set it again. If it flips well away from either 12, the hour hand went on at the wrong point, so lift it and refit it at the moment the date flips. If the date hangs half-way or the quick-set has gone stiff, suspect rubbing under the dial. Dial dots can eventually jam the date ring, so look there first.' },
        { title: 'Stops or loses time at the date change', body: 'Note exactly when it happens. If it stops near the date change, forum reports point to the extra calendar load or date-wheel friction against the dial, so take the dial off and check the date wheel turns freely. If it keeps running but the hands lose time at the change, the cannon pinion may be slipping under that load, so work through “Hands slip or set stiffly”. If neither fits, a weak spring or a heavy train is next.' },
        { title: 'Seconds hand spins or falls off', body: 'The hole may be for another movement. One forum list puts the NH35 seconds hole at 0.21 mm and the ETA 2824 at 0.25 mm, so a hand made for the ETA won’t grip the Seiko. Check the size with your supplier and fit the right hand. Most forum posters advise against glue, and it makes the hand hard to remove later.' },
        { title: 'Movement rattles or the rotor scrapes', body: 'A rattle when you tilt the watch usually means the movement isn’t held, so check the ring or spacer and the casing clamps. A scrape needs the back off. Spin the rotor with a finger: it should turn without wobble. If it wobbles, suspect a loose rotor screw, a worn bearing or a bent rotor. If it scrapes only with the back on, the stack is too tall for the case, so recheck your height sums in “Match a movement to a case”. Don’t chase every sound, though: Miyota rotor noise is described as normal, and a service won’t silence it.' },
      ],
    },
  ],

  'build-movement-fit': [
    {
      at: 5,
      steps: [
        { title: 'Worked example: an NH35', body: 'Here are the numbers for the most popular build movement. Diameter: 27.4 mm, or 29.36 mm with its spacer. Height: listed at 7.59 mm installed, with a dial ideally 0.4 mm thick and at most about 0.6 mm. Stem height: we have no reliable figure, so buy a case made for the NH35 family. Dial feet: under the 8 and 38 minute marks for a 3 o’clock crown, or 12 and 42 for a 4 o’clock crown. Date: 3H and 4H windows work with a standard NH35, and 6H needs a special-order movement. These come from one supplier’s guide, not Seiko, so measure your own parts before you cut or glue. To check a foot position, use angle = hour × 30° + minute × 6°, so the 8-minute mark is 48°.' },
      ],
    },
  ],

  'build-lume': [
    {
      at: 1,
      steps: [
        { title: 'Decide whether this dial may be stripped', body: 'Stop before you touch old lume. A dial that no longer glows can still be radium, because the paint dies long before the radium decays. Check an old dial with a Geiger counter. A reading above background means leave it alone, since official advice is not to remove radium paint yourself. A quiet reading doesn’t clear it either, because a Geiger counter may not detect tritium’s weak beta. If you can’t prove the lume is modern, don’t strip it. Practise on a scrap dial you know is modern instead.' },
      ],
    },
  ],

  /* ----------------------------- Workshop & Safety ---------------------------- */
  'shop-setup': [
    {
      at: 4,
      steps: [
        { title: 'Add what beginners forget', body: 'The Tool buying guide in Reference sets out what to buy and when. Beyond the tools, the British Horological Institute’s list for its students includes things that are easy to skip: a bench and seat with arm rests, a proper bench light, a case cushion, a parts tray with a cover, and more than one eyeglass. They’re dull buys, but they keep parts safe and hands steady.' },
        { title: 'Test your setup', body: 'Before you open a watch, try the bench with a spare screw. Drop it from working height. It should land and stay on the mat, and if it bounces off, raise the edge or add a tray. Pick it up with tweezers, elbows supported. If your hand shakes, change the height, not your grip. Read the slot in the screw head through your loupe. If you have to lean in or squint, move the light. Fix these now, while nothing valuable is on the bench.' },
      ],
    },
  ],

  'shop-handling': [
    {
      at: 2,
      steps: [
        { title: 'Choose tweezers by material', body: 'Makers number tweezers differently, so the British Horological Institute lists them by description. It suggests starting with steel in medium, fine, very fine and super fine, brass in medium and fine, and one plastic pair with 3 mm spade tips for batteries. Steel marks surfaces and conducts electricity, so keep it away from cells. Brass suits soft parts and plates, but it conducts too. Plastic can cross and distort, so keep it for cells. Check your tips by closing them against the light. They should meet evenly. If they cross or gap, dress or replace them before they launch a part.' },
      ],
    },
    {
      at: 5,
      steps: [
        { title: 'Check your tools for magnetism', body: 'Steel tools can pick up magnetism, and then small parts cling to them and won’t let go. Test a tool by touching it to a small steel screw. It shouldn’t lift it. To cure it, hold the demagnetiser button down before you bring the tool near, draw it away slowly to about 30 cm, and only then release. Don’t tap it on the coil, which can leave it worse. Test again, and repeat if the screw still clings.' },
      ],
    },
  ],

  'shop-safety': [
    {
      at: 5,
      steps: [
        { title: 'Treat button cells as a hazard', body: 'Keep loose cells in a closed box, never on an open tray, and keep them away from children and pets. A swallowed cell can cause severe damage within 2 hours, so treat any suspected swallow as an emergency and go to hospital at once. Don’t induce vomiting. In the US, the National Battery Ingestion Hotline is 1-800-498-8666 and Poison Help is 1-800-222-1222. Elsewhere, call your local emergency number. Tape the terminals of used cells or bag each one, and check your local rules for disposal.' },
        { title: 'Dispose of fluids properly', body: 'Used cleaners and lubricants don’t go down the sink. ETA’s service sheets require legal disposal and say water-polluting substances must not reach soil or drains. Keep used fluid in a sealed, labelled container and take it to a hazardous-waste collection point. Rules differ by area, so check yours.', tip: 'ETA also requires eye protection for all work on a movement, so make glasses a habit, not a decision.' },
      ],
    },
  ],

  'shop-storage': [
    {
      at: 3,
      steps: [
        { title: 'Sort screws that got mixed', body: 'It happens. Don’t guess and don’t force. Lay the screws out under a loupe and sort them by length, thread and head. Compare each with your photos, then try it in its hole by hand. It should turn easily and seat fully. If a screw stops early or feels tight, it’s the wrong one, so back it out at once, because forcing a wrong screw is how threads get damaged. Check a long screw from the other side too: it mustn’t stick through and catch a wheel.' },
      ],
    },
    {
      at: 4,
      steps: [
        { title: 'Date your oils and greases', body: 'Lubricants age in the bottle, so write the date on each one when it arrives. Listed shelf lives are 6 years for Moebius 9010, 9020 and 9415, and 3 years for 8200, 8300 and 8217. Treat those as a maximum. Keep lids on: ETA warns that Fixodrop epilame is very volatile and must be kept airtight. When a bottle passes its date, replace it. A fresh bottle costs far less than servicing a movement twice.' },
      ],
    },
  ],

  'shop-sourcing': [
    {
      at: 5,
      steps: [
        { title: 'Check access before you start the job', body: 'Not every part can be bought by a hobbyist, so find out before the watch is in pieces. As a rough guide, not a stock list: the Seiko NH family has been the easiest to supply. The ETA 7750 and 2836-2 tend to need donors or old stock. For the Miyota 9075, the ETA C07 and most Chinese clones, the practical repair is usually a whole new movement. Search two suppliers for your calibre first. If neither lists the part, plan around a donor or a movement swap before you strip anything.' },
      ],
    },
    {
      at: 7,
      steps: [
        { title: 'Check the part when it arrives', body: 'Before you fit anything, lay the new part beside the old one and compare them under a loupe. Measure what you can, and check stems by their thread in millimetres. Keep the packaging until the part is fitted and working, so it can go back if it’s wrong. Be wary of bargains: some Sea-Gull ST2130 movements have turned up engraved as an ETA 2824-2, and not all their parts interchange. If a part is wrong, stop and return it. Don’t try to make it fit.' },
      ],
    },
  ],
}
