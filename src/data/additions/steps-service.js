// Extra steps for the Quartz, Mechanical, Service and Diagnostics tracks.
// Shape: { lessonId: [{ at, steps }] }. `at` is an index into that lesson's
// original steps array in lessons.js, and enrich.js inserts before it.
// Use one entry per `at`: two entries with the same `at` come out reversed.
export const STEPS = {
  /* ------------------------------ Diagnostics ----------------------------- */
  'diag-stopped': [
    {
      at: 1,
      steps: [
        {
          title: 'Quartz: runs on the bench, stops in the case',
          body: 'If a quartz movement runs out of its case but stops once it’s cased, the seconds hand is often touching the crystal, or its counterweight is touching the minute hand. Witschi’s fault guide lists both. Take the movement back out and check each gap in turn: dial to hour hand, hour hand to minute hand, seconds hand to crystal, and seconds counterweight to minute hand. Reseat the hand that’s out, case it again, and watch the seconds hand for a full turn.',
          tip: 'To prove contact with the glass, Witschi suggests a tiny drop of oil on the tip of the seconds hand during assembly. Clean the hand and crystal afterwards.',
        },
      ],
    },
    {
      at: 2,
      steps: [
        {
          title: 'Mechanical: test one system at a time',
          body: 'Good fault-finding tests the power source, train, escapement, keyless and motion works separately, so each test clears one system. Start with power. With the back open, turn the crown slowly and watch the ratchet wheel, taking the rotor off first if it hides the view. The wheel should step round, and the click should hold it when you pause. If it slides back, check the click and click spring. If it never moves, the fault lies between crown and ratchet. If it turns but the winding never firms up, suspect the mainspring.',
        },
      ],
    },
    {
      at: 3,
      steps: [
        {
          title: 'Run it with the hands off',
          body: 'If nothing obvious shows, take the load off. Let the power down, remove the movement from the case, then take off the hands and dial. Wind it again. If it now runs, the stop came from the hands, the dial or the calendar, so check hand clearance and that the date wheel turns freely before you go deeper. If it still won’t run, the fault is in the movement itself, and the next two steps narrow it down.',
        },
      ],
    },
    {
      at: 4,
      steps: [
        {
          title: 'Balance out: read the fork',
          body: 'If the balance still won’t keep going, let the power down fully and remove the balance. Wind a few clicks, then nudge the pallet fork with pegwood. It should snap across and stay against its banking. A crisp snap both ways proves power is reaching the escapement, so look at the balance: a broken pivot, a fouled hairspring or a dirty jewel. If the fork moves lazily or won’t stay over, power isn’t getting through. Let the power down again, lift out the fork and puff air at the escape wheel. A free train spins for a few seconds and coasts to a stop. One that stops dead has dirt, a bad pivot or debris in it. If the train is free, the fault is between the fork and the escape wheel.',
          caution: 'Let the power down before you take off the balance cock or the pallet bridge, every time. Add those few clicks only once the balance is out and the fork is still in place.',
        },
        {
          title: 'Stops at the same time every day',
          body: 'A watch that stops at about the same hour each day is often telling you about the calendar. This comes from forum reports rather than a maker’s guide, so treat it as a lead. If it stops near the date change, calendar load or date-wheel friction against the dial is the leading suspect. If the hands lose time at the change instead of stopping, the cannon pinion may be slipping under that load. If neither fits, think of a weak mainspring or a heavy train. To test it, set the hands a little before the change and watch the amplitude as the date work takes up. A sharp sag there confirms the load. The calendar service lesson covers the strip.',
          tip: 'Don’t take rate readings with the hands near midnight. Witschi warns that the date change can falsify them.',
        },
      ],
    },
  ],

  'diag-timekeeping': [
    {
      at: 0,
      steps: [
        {
          title: 'Check that it’s really a fault',
          body: 'Judge the rate against that movement’s own figures, not against zero. Witschi’s service table allows −5 to +15 s/day on a gent’s watch, while a Seiko 7S26 is rated at −20 to +40 s/day. So +18 s/day is healthy on a 7S26 and a fail on a chronometer. Note what the owner sees over a few days, then confirm on a timegrapher with the crown pushed in and the hands away from the date change. If the number sits inside the movement’s figures, there’s nothing to fix.',
        },
      ],
    },
    {
      at: 1,
      steps: [
        {
          title: 'Still fast after demagnetising',
          body: 'First confirm the cure: the compass needle should stay still with the watch 1 to 2 cm away. If the gain continues, look at the hairspring under a loupe while the watch runs. Coils that stick together shorten the spring just as magnetism does. Oil or dirt is the usual cause, so the cure is a clean. That’s forum consensus, backed by one magazine article. If it still gains after cleaning, look for a bent spring or coils touching. A clean trace with dots scattered below it, and a scratching sound from the speaker, means the spring is touching the regulator pins or stud. Witschi’s remedy is to centre the spring, then re-regulate.',
        },
      ],
    },
    {
      at: 3,
      steps: [
        {
          title: 'Compare fully wound with 24 hours later',
          body: 'Some watches only misbehave late in the wind. Take a reading fully wound, then again after 24 hours without rewinding. Witschi accepts amplitude falling by about 10 to 15% in that time, so 300° can drop to between 255° and 270°. A much bigger fall, or a rate that shifts sharply with it, points at the mainspring or barrel. No regulator setting will cure that.',
        },
      ],
    },
  ],

  'diag-water': [
    {
      at: 2,
      steps: [
        {
          title: 'Take the movement out if you can',
          body: 'If you have the tools, release the stem and lift the movement out of the case, so it isn’t sitting in damp air. Photograph the dial and anything that looks wet. Look for rust on screws, the click and the keyless parts. Rust that has already started means a full strip, not just drying.',
        },
        {
          title: 'Quartz: take the cell out',
          body: 'On a quartz watch, lift the cell out as soon as the back is open. Check the cell seat and contacts for salt crystals or green crust. Witschi warns that salt crystals and leaked cell contents can destroy the contacts, so clean them before a new cell goes in. If you find any, follow the battery corrosion lesson.',
        },
      ],
    },
    {
      at: 4,
      steps: [
        {
          title: 'Find the way in',
          body: 'Before you close the watch, work out how the water got in. Inspect the crystal, crown, pushers and gaskets for damage and dirt. Check that the crown was fully home. On a watch with a plastic movement ring, check the ring’s recess lines up with the stem. If it doesn’t, the ring sits on the stem and leaves a gap between back and case. Looking won’t prove a seal, so test it next. The water testing lesson gives the method.',
          caution: 'Don’t pressure-test a watch with a cracked crystal. The glass can break up and damage the hands and dial.',
        },
      ],
    },
  ],

  'diag-winding': [
    {
      at: 0,
      steps: [
        {
          title: 'Find where the drive stops',
          body: 'Before you strip anything, follow the power by eye. With the back open, turn the crown slowly and watch the crown wheel, then the ratchet wheel. On many automatics you’ll need the rotor off to see them. If neither moves, the fault is at the stem, sliding pinion or winding pinion. If the crown wheel turns but the ratchet doesn’t, look at the teeth between them. If the ratchet turns and the click holds but the crown never gets firmer, suspect the mainspring or its hook. An automatic has no hard stop at full wind, so don’t keep winding to find one.',
        },
      ],
    },
    {
      at: 4,
      steps: [
        {
          title: 'Hands move with the crown pushed in',
          body: 'If the hands turn while the crown is in the running position, the stem isn’t sitting where it should. Witschi often sees this after a stem has been cut too short, or when crown adhesive has reached the square. Pull the stem and inspect it. The square must be clean and intact, and the stem must reach its full depth. A short stem can’t be lengthened, so fit a new one. Then check each crown position clicks cleanly.',
        },
        {
          title: 'Automatic: winds by crown, not by rotor',
          body: 'Wind by hand first. If the click holds and the watch winds by crown, the barrel is fine and the fault is in the automatic gears. That’s forum consensus, and the next two checks are forum reports too. If the rotor spins freely but the stem feels stiff, suspect seized reversers. If the rotor is noisy or scrapes, suspect a worn bearing or a bent rotor. On a 2824-2, ETA’s answer to bad reversers is new prelubricated originals, not a wash. After the repair, prove it on a winder or simulator, as Witschi recommends, rather than by feel.',
        },
      ],
    },
  ],

  'diag-noise': [
    {
      at: 1,
      steps: [
        {
          title: 'A loud rotor or a real fault?',
          body: 'Some rotors are simply loud. One brand that fits Miyota 82xx movements calls the noise a characteristic that a service won’t silence. Noise matters when it changes, or when it comes with grit, poor winding or rotor play. Rock the rotor gently to feel for play. Then look inside the caseback and at the rotor’s edge. A bright rub mark means the rotor has been touching.',
        },
      ],
    },
    {
      at: 4,
      steps: [
        {
          title: 'Listen through a timegrapher',
          body: 'A timegrapher’s speaker picks up what your ear can’t. A doubled “tic-tac” means knocking: amplitude is too high, above about 330°, and the fork horn is touching the impulse pin. Check the machine’s lift angle first, because a wrong setting can show a false high figure. If the knocking is real, Witschi’s remedy is to replace the mainspring, pallet stone or escape wheel. A secondhand watch may already hold a spring that’s too strong, so check that first. A scratching sound usually means the hairspring is touching the regulator pins or stud.',
          caution: 'Don’t keep running a watch that’s knocking. Let it down and find the cause.',
        },
      ],
    },
  ],

  'diag-handfriction': [
    {
      at: 2,
      steps: [
        {
          title: 'Check across the date change',
          body: 'A cannon pinion can feel fine when you set the time and still slip under load. Forum repairers report hands losing minutes at the date change, because the date work is pushing back. To test it, note the time on the watch a few hours before the change, then again after it. If it drops minutes across the change but the timegrapher shows a normal rate, treat the friction as too loose, even if setting feels normal. Check the date work for stiffness as well, since a stiff calendar adds to the load.',
        },
      ],
    },
    {
      at: 4,
      steps: [
        {
          title: 'Prove the fix',
          body: 'After any friction work, refit the motion work and repeat the tests. Setting should be smooth, with a light, even drag. On a non-hacking watch, keep the hands well clear of the date change and turn them slowly backwards. The seconds hand should falter a little, neither stopping dead nor ignoring you. Then let the watch run through a date change and compare the time before and after. If it still slips, don’t keep nipping it. Forum advice is to use a light touch, and a pinion that won’t hold should be replaced.',
        },
      ],
    },
  ],

  'diag-magnetism': [
    {
      at: 5,
      steps: [
        {
          title: 'If the compass still moves',
          body: 'Repeat the pass, more slowly. This time hold the button before the watch reaches the coil, lift it away slowly to about 30 cm, and only then let go. Tapping the button with the watch on the coil can leave it worse than before. Test again with the compass 1 to 2 cm from the watch. Keep the size of the fault in mind too. One guide puts a typical magnetised gain at 2 to 10 minutes a day, and hours in a bad case, so an error of a few seconds probably isn’t magnetism.',
        },
      ],
    },
  ],

  'diag-lowamp': [
    {
      at: 1,
      steps: [
        {
          title: 'Rule out a false reading',
          body: 'A wrong setting gives a confident, wrong number. Give the watch 10 to 15 crown turns and let it run about 20 minutes, as Witschi advises. Then check the lift angle on the machine, because amplitude scales directly with it. Enter 52° on a true 50° movement and a real 280° shows as about 291°. The error runs both ways, so a low reading can be the machine’s fault too. Then use the right yardstick. 270–310° is the goal, but Witschi’s service band runs from 250° to 330°, so 255° dial up isn’t a failed watch.',
        },
      ],
    },
    {
      at: 5,
      steps: [
        {
          title: 'Low straight after a service',
          body: 'If you’ve just serviced the watch, check your own work before you buy parts. Forum posters report these causes: a train bridge or balance cock screwed down too hard, fluff under the balance, a contaminated cleaning jar, and fork jewels that were never pegged. One poster gained about 30° from checks like these. Change one thing at a time and re-read after each. First confirm the train coasts freely. A stubborn case can be reassembled dry to show whether lubrication is the problem. Worn barrel arbor pivots, too much lock, excess oil and excess endshake are further reported causes, and posters rarely find the mainspring to blame.',
          caution: 'A dry reassembly is a short test only. Don’t leave a watch running without oil.',
          tip: 'On an automatic, the wall grease can show in the reading. One forum poster finds 8217 tends to read lower, while P125 can brake too strongly. Neither is wrong, so log which you used.',
        },
      ],
    },
  ],

  /* -------------------------------- Quartz -------------------------------- */
  'quartz-battery': [
    {
      at: 2,
      steps: [
        {
          title: 'See what sits beside the cell',
          body: 'Look around the cell before a tool goes near it. On some calibres the coil sits right beside the clamp. On a Ronda 515 it does, so a slipped tool can break the winding and kill the movement. Brace your hand on the movement holder so any slip stays small. Check for a plastic isolator too, and note how it sits. Field reports on that family blame dead-after-a-battery-change watches on a missing isolator, a reversed cell, corrosion or a bad new cell.',
        },
      ],
    },
    {
      at: 5,
      steps: [
        {
          title: 'Give it a minute, then check the functions',
          body: 'Most movements check their voltage only about once a minute, so a 4-second jump can carry on for a while after a fresh cell goes in. Wait before you judge it. Some calibres take longer: ETA’s 251.264 sheet gives a 60-minute delay on its warning. A multi-function watch may also come back with odd hands or displays, because the IC needs a restart after a cell change. If so, find the reset on the calibre’s sheet. The contact varies by maker, and not every movement has one.',
          tip: 'If you own a watch tester, Witschi recommends measuring current at every battery change. It shows up faults that cut the last cell’s life short.',
        },
      ],
    },
  ],

  'quartz-diagnose': [
    {
      at: 1,
      steps: [
        {
          title: 'Check the crown and the hands',
          body: 'Two free checks come before any meter. First, is the crown pushed fully in? With the stem pulled, the motor pulses stop on purpose, so a healthy watch looks dead. Dirt between crown and case can hold it out, so clean that gap if the crown won’t seat. Second, look at the hands. A hand touching the dial, the crystal or another hand can stall the motor. Turn the watch dial down as well, because a hand can touch the glass in that position.',
        },
      ],
    },
    {
      at: 2,
      steps: [
        {
          title: 'New cell, still jumping',
          body: 'Give a fresh cell a minute first, because voltage is usually checked only once a minute. If the hand still jumps or stutters, don’t condemn the module yet. Witschi’s guide points to mechanical load: sluggish gears, hands that touch, or particles at the rotor. Some movements raise motor power when they miss a step, so a stiff train shows up as stutter and high current. Check hand clearance, then inspect the train and rotor under a loupe. Steel particles at the rotor need cleaning out. Only when those are clear does the module become the suspect.',
        },
      ],
    },
    {
      at: 5,
      steps: [
        {
          title: 'New cells die early',
          body: 'A cell that dies far too soon points to a fault in the watch, not a bad cell. Work in Witschi’s order. Measure current against the maker’s figure. If it’s high, measure the coil: open means broken, and far below the range means shorted turns. If the coil is fine, check that the negative contact tongue isn’t touching the circuit board, because that makes a short. Then look for a stiff train or hands that touch. The electrical testing lesson shows how to take these readings. Without a watch tester, a fresh module may be the cheaper test.',
        },
      ],
    },
  ],

  'quartz-corrosion': [
    {
      at: 3,
      steps: [
        {
          title: 'Clean the negative contact and the seat',
          body: 'Don’t stop at the clamp. Witschi’s checklist singles out the negative contact and the cell seat, because leaked cell contents and salt crystals sit there and go on attacking the metal. Clean the seat the same way and inspect it under a loupe. You’re looking for bright metal with no green or white left. Then check the contact tongue still presses on the cell, and that it hasn’t been bent onto the circuit board, where it would cause a short.',
        },
      ],
    },
    {
      at: 4,
      steps: [
        {
          title: 'Prove it held',
          body: 'A clean-up can look fine and still fail later. Note the date, and check the rate and the seconds hand again after a few days. If you own a watch tester, compare current with the maker’s figure. High current after a leak suggests damage or residue you haven’t reached. If the new cell drains fast or the crust comes back, fit a new module rather than cleaning again.',
        },
      ],
    },
  ],

  'quartz-module': [
    {
      at: 4,
      steps: [
        {
          title: 'Find the date change before the hands go on',
          body: 'On a watch with a date or day, turn the stem until the date changes before any hand goes on. Witschi’s guide makes this the rule, so that the change falls at the right time. Witschi also says to check the hour wheel lines up with the minute wheel pivot before the dial goes on, so if the hands feel stiff now, lift the dial and look. In some designs an expansion spring holds the hour wheel in place, and a damaged or doubled spring can jam it. Too much force when pressing hands can damage the hour wheel too. The hand fitting lesson gives the force limits.',
        },
      ],
    },
    {
      at: 6,
      steps: [
        {
          title: 'Seat the ring, then check the gap',
          body: 'If the movement sits in a plastic ring, line the ring’s recess up with the stem before the back goes on. Witschi warns that a ring out of line sits on the stem and leaves a gap between back and case, which spoils the seal. Look along the joint: the back should sit down evenly all the way round. Keep any grease on the stem tube sparing, because excess can be carried inside and cause faults. Then run the finished watch dial down as well as dial up. A hand that clears on the bench can still touch the crystal in the case.',
        },
      ],
    },
  ],

  'quartz-identify': [
    {
      at: 3,
      steps: [
        {
          title: 'Read the whole number',
          body: 'Copy every digit and letter, not just the family name, because the ending can change the movement. ETA’s 955.112 is 11½ lignes, 25.60 mm across, and its 955.412 is 10½ lignes, 23.30 mm across, so one won’t fit where the other came from. Save the sheet’s electrical limits with the number too, because a good reading on one calibre can be a fault on another. The electrical testing lesson shows how to use them.',
        },
      ],
    },
  ],

  /* ------------------------------ Mechanical ------------------------------ */
  'mech-letdown': [
    {
      at: 4,
      steps: [
        {
          title: 'No crown to hold?',
          body: 'If the stem is out, or the calibre doesn’t wind by crown, use the ratchet wheel instead. Seat a well-fitting screwdriver firmly in the ratchet-wheel screw and turn it slightly in the winding direction to take the load off the click. Lift the click clear, then let the screwdriver turn back slowly under your grip. Release the power in short, controlled moves. A blade that slips chews the slot and lets the wheel go, so press straight down. If you can’t reach the click at all, leave the watch to run down. It’s slow, but it’s safe.',
        },
      ],
    },
    {
      at: 5,
      steps: [
        {
          title: 'If it gets away from you',
          body: 'If the crown or driver slips and the spring unwinds with a whirr, keep your fingers clear and let it finish. Then check for damage before you go on. Look at the click and the ratchet teeth under a loupe for bent or chipped teeth, and confirm the click spring still snaps the click home. Replace anything damaged, because a chipped ratchet tooth can let go again under full power.',
        },
      ],
    },
  ],

  'mech-uncase': [
    {
      at: 3,
      steps: [
        {
          title: 'Check your calibre’s stem position',
          body: 'Stem release isn’t the same on every calibre, so check before you press anything. Caliber Corner’s pages give these examples. Seiko NH and 6R movements release at position 0, the crown pushed in, with the lever pressed while you pull. Sellita’s SW260-1 and SW500 release in the time-setting position, two clicks out on the SW500, using a 1 mm flat tool. A pointed tool can jam the setting lever. If the stem won’t come, stop and try the other position rather than pulling harder.',
        },
      ],
    },
  ],

  'mech-hands-dial': [
    {
      at: 3,
      steps: [
        {
          title: 'If a dial foot is loose or broken',
          body: 'Check both feet before the dial goes back. A bent foot should be eased straight before you try to seat it, and a loose one will let the dial shift. Forum repairers use three routes for a broken foot. Dial dots are quick, but they suit day-date movements poorly and can eventually jam the date ring. Glue varies in strength and can’t be released with heat. Soldering is the cleanest result but risks the dial paint, so leave it to an experienced hand on any dial that matters. None of these is a maker’s method.',
        },
      ],
    },
  ],

  'mech-diagnose': [
    {
      at: 2,
      steps: [
        {
          title: 'Short power reserve',
          body: 'If it runs well but stops too soon, time it. Wind it fully, note the time, leave it dial up and note when it stops. Compare with the maker’s figure: ETA gives the 2824-2 as 38 h minimum and 42 h typical. A short reserve with good amplitude points at the barrel: a mainspring that’s too short, or an automatic spring slipping early. If amplitude is poor from the start, treat it as a low-amplitude fault instead. An automatic that only falls short on the wrist may just not be getting wound, so test it by crown first.',
        },
      ],
    },
  ],

  'mech-mainspring': [
    {
      at: 2,
      steps: [
        {
          title: 'Check the barrel as well as the spring',
          body: 'While it’s open, inspect the barrel itself. Look for scoring on the wall and lid. Check the barrel teeth for bends or chips, because they drive the whole train. Look at the arbor’s pivots under a loupe, since worn arbor pivots are a reported cause of low amplitude. If the wall or teeth are damaged, a new spring won’t cure it, so replace the barrel. ETA sells the 2824-2’s as one complete part.',
        },
      ],
    },
    {
      at: 5,
      steps: [
        {
          title: 'Check the hook and the endshake',
          body: 'Prove the barrel works before it goes back. Hold the arbor’s square in a pin vice and turn it a little in the winding direction. You should feel the spring take up. If it turns freely, the arbor hook hasn’t caught the inner coil, so open the barrel and seat it. Then lift the arbor gently: it should rise and drop a hair between lid and barrel floor. If it’s pinched, the lid may not be fully home. Check again once the barrel is under its bridge. A barrel with no endshake drags on the whole train.',
        },
      ],
    },
  ],

  'mech-regulate': [
    {
      at: 3,
      steps: [
        {
          title: 'Set the beat before the rate',
          body: 'Witschi’s order is beat error first, then rate, because the rate needs rechecking once the stud has moved. Beat error is corrected at the stud carrier, not the regulator. Move it a hair, let the reading settle, and aim for 0.5 ms or under. A fixed-stud watch has no carrier. Forum practice there is to twist the hairspring collet on the balance staff, which is hairspring work, not a quick adjustment. A very large beat error can wrap the trace so the two lines seem to meet, so go by the number as well as the picture.',
        },
      ],
    },
    {
      at: 4,
      steps: [
        {
          title: 'Know how far your regulator moves',
          body: 'Regulators don’t all move the same amount. On an Etachron, one line is about 5 s/day, though the marking varies by movement. On a Triovis, one full rotation is about 30 s/day. Both figures come from secondary sources, so treat them as starting points. A free-sprung balance has no index at all: you move mass on the balance instead of changing the spring’s length. Whatever you have, adjust, let the reading settle, and measure again. If the rate won’t reach your target within the regulator’s range, stop. The balance or hairspring needs attention, not more regulator.',
        },
      ],
    },
  ],

  'mech-crown-stem': [
    {
      at: 4,
      steps: [
        {
          title: 'Prove the stem before you close up',
          body: 'Test the new stem in every position before the back goes on. Pull through each click and feel for a crisp detent, then wind a few turns. With the crown pushed in, the hands must stay still. If they move, the stem is too short or adhesive has reached the square, which Witschi lists as a common result of cutting and gluing. Keep the stem straight while the adhesive cures, and keep adhesive off the square. A stem that’s been cut too short can’t be saved, so start again with a new one.',
        },
      ],
    },
  ],

  'mech-truing': [
    {
      at: 2,
      steps: [
        {
          title: 'Look at the pivots first',
          body: 'Before you judge the rim, watch both pivots under a loupe as the balance turns. A bent pivot or staff can make a good rim look as if it wobbles, and bending the rim to hide it leaves you with two faults. If a pivot runs out of true, stop. That’s a staff or pivot job, not a truing job.',
        },
      ],
    },
    {
      at: 5,
      steps: [
        {
          title: 'Prove the result',
          body: 'Turn the balance slowly in the calipers one last time, in the flat and in the round. The gap to the index should stay even all the way. Bending moves weight, and a true rim isn’t necessarily a poised one, so poise the balance next. Back in the watch, compare the rates between vertical positions. Witschi’s chart treats large differences there as a job for centring, poising or replacing the regulating parts. If they’re no better, check the hairspring before you bend the rim again.',
        },
      ],
    },
  ],

  /* ------------------------------- Servicing ------------------------------ */
  'svc-overview': [
    {
      at: 3,
      steps: [
        {
          title: 'Protect your eyes and your drains',
          body: 'ETA makes eye protection compulsory for all work on a movement, so wear it for anything with springs or cleaning fluid. Its sheet also says lubricants and cleaning products must be disposed of legally. Keep used fluids in closed containers, and never pour them down a drain or onto the ground. Check your local rules for where to take them.',
        },
      ],
    },
    {
      at: 4,
      steps: [
        {
          title: 'Record the watch before you touch it',
          body: 'Start with a baseline, so you can prove what you changed. Write down how the watch came to you: case condition, crown feel, winding, setting, the date change, and what the owner says is wrong. If it runs, record rate, amplitude and beat error. AWCI’s standards make this intake record part of the job, and they expect findings to be documented as you go. Add what you find during the strip, such as worn parts, odd screws and old repairs. At the end, the same readings show whether your service worked.',
        },
      ],
    },
  ],

  'svc-teardown': [
    {
      at: 3,
      steps: [
        {
          title: 'Test the train before it comes apart',
          body: 'With the balance and fork out and the power down, you get a free check. Puff air at the escape wheel. A free train spins for a few seconds and coasts to a stop, and a train that stops dead already has a fault. Lift each wheel gently with pegwood to feel its endshake, then nudge it sideways for side-shake. Too much sideways play means a worn hole, and no endshake at all means something is binding. Write down anything odd, because you can’t feel it once the bridge is off.',
        },
      ],
    },
    {
      at: 4,
      steps: [
        {
          title: 'If a bridge won’t lift',
          body: 'A bridge that resists usually still has a screw in it, or a pivot caught. Check every screw is out, then ease the bridge up evenly with a screwdriver tip at the slots made for it. Never lever near a jewel or pivot. Keep each bridge’s screws with that bridge. Screws that look alike can differ in length, and a long one in the wrong hole can foul a wheel or damage the plate.',
        },
      ],
    },
  ],

  'svc-clean': [
    {
      at: 1,
      steps: [
        {
          title: 'Look for parts that must not be washed',
          body: 'Before anything goes in a basket, check the calibre’s sheet for do-not-wash parts. ETA’s 2824-2 sheet marks both reversing wheels this way and says to exchange them for prelubricated originals if needed. Sellita’s oil charts, as reported by Caliber Corner, say the SW500’s RDM+ barrel isn’t cleaned at service. Put those parts aside in a covered dish. If you wash one by mistake, assume its factory lubricant has gone and replace the part.',
        },
      ],
    },
  ],

  'svc-shock': [
    {
      at: 5,
      steps: [
        {
          title: 'Check the setting before you move on',
          body: 'Look at the jewel under a loupe before the balance goes back. The oil should sit in a round, centred ring, spreading to between a half and two-thirds of the cap jewel’s width. An off-centre ring means the jewel isn’t sitting parallel or isn’t clean, so lift it out and start again. The oiling lesson shows how to judge this. Check the spring is fully home and can’t swing out. Then, with the balance back in, lift it gently with pegwood to check it has a little endshake. If it has none, a jewel isn’t seated. If it has too much, look at the setting first.',
        },
      ],
    },
  ],

  'svc-auto': [
    {
      at: 3,
      steps: [
        {
          title: 'Read the sheet before you wash a reverser',
          body: 'Reverser practice isn’t universal. ETA’s 2824-2 sheet is stricter than the routine below: it marks both reversing wheels “do not wash” and says to exchange them for prelubricated originals if needed. Follow the maker wherever you can get the part. Treat the clean-and-dip routine as the fallback for calibres without that rule, or when originals can’t be had. Either way, test each wheel by hand. It must lock one way and run free the other. If it won’t do both, replace it.',
        },
      ],
    },
  ],

  'svc-reassemble': [
    {
      at: 2,
      steps: [
        {
          title: 'Check endshake before the fork goes in',
          body: 'With the train bridge screwed down, check every wheel, and the barrel too. Lift each one gently with pegwood: the pivot should rise and drop a hair. Nudge it sideways to judge side-shake. If a wheel has no endshake, a bridge may not be seated or a pivot may be caught, so back the screws off and look again. Repeat the air test once the screws are fully tight. If the train was free with light screws and isn’t now, the bridge is going down crooked. Forum posters report over-tightened bridges as a hidden cause of low amplitude, so tighten firmly, not hard.',
        },
      ],
    },
    {
      at: 4,
      steps: [
        {
          title: 'If the balance won’t start',
          body: 'Puff air at the balance. If it sits dead or won’t keep going, work down this list, which comes from forum fault reports. The commonest slip is the impulse jewel landing outside the fork horns instead of between them. Ease the cock screw, lift the balance slightly so the jewel can drop in, and tighten again. With power on, it should start straight away. Next, check the hairspring isn’t caught on the regulator pins or rubbing the arms or the cock, and look for fluff under the balance. Then check balance endshake. Still stuck? Let the power down, lift out the balance and the fork, then refit the balance alone. If it swings freely on its own, the fault is in how the jewel meets the fork.',
          caution: 'Keep the power low for this, with a few clicks at most. Lift the cock only enough to clear the fork, and keep the balance within about 1 cm of its cock so the hairspring isn’t stretched.',
        },
      ],
    },
  ],

  'svc-test': [
    {
      at: 4,
      steps: [
        {
          title: 'Check the power reserve',
          body: 'A service should give back the full reserve, and the only proof is to run it out. Wind it fully, note the time, leave it dial up and note when it stops. Compare with the maker’s figure: ETA gives the 2824-2 as 38 h minimum and 42 h typical, and the 7750 as 48 h minimum and 54 h typical. An automatic has no hard stop, so wind well past the 10 to 15 turns you’d use for a timing check. A Miyota 9075, for example, is reported to take about 40 turns from empty. If it falls short, check the mainspring first, then the wall grease on an automatic, then drag in the train.',
          tip: 'Read amplitude at 24 hours while you wait. Witschi accepts a fall of about 10 to 15% from the fully wound figure.',
        },
      ],
    },
    {
      at: 5,
      steps: [
        {
          title: 'Test every function',
          body: 'A good trace doesn’t prove the whole watch works. Witschi’s checklist adds the date mechanism, power reserve and self-winding as separate tests. Click through each crown position and feel for crisp detents. If it hacks, the balance should stop with the crown out and restart when you push it in. Run the hands through the date change. If the date changes around noon, the hands are 12 hours out, so advance through the change and reset them. Test self-winding on a winder or simulator. Fix anything you find now, because a fault found after casing means doing the dial and hands twice.',
        },
      ],
    },
  ],

  'svc-6497': [
    {
      at: 1,
      steps: [
        {
          title: 'Take a reading before you strip it',
          body: 'Wind it 10 to 15 turns, let it run about 20 minutes, and record rate, amplitude and beat error. First set the timegrapher to the 6497’s lift angle of 44°. This movement is where a wrong setting hurts most: a machine left at 53° makes a true 250° read about 301°, so a tired watch looks healthy. Note how the crown feels through winding and setting too. That record tells you later whether your service helped.',
        },
      ],
    },
    {
      at: 5,
      steps: [
        {
          title: 'Open and check the barrel',
          body: 'The 6497’s barrel is big enough to see everything, so learn the check here. Prise off the lid at its notch, note which way the coils run, and take the spring out under control. Look for a set spring, kinks, scoring on the wall and worn arbor pivots. This is a manual-wind barrel, so it takes mainspring grease (8200), not the braking grease an automatic needs. A secondhand watch may already hold the wrong spring, so compare it with the barrel before you reuse it. The mainspring sizing lesson shows how.',
        },
      ],
    },
    {
      at: 7,
      steps: [
        {
          title: 'Feel the endshake on every wheel',
          body: 'The 6497 is the best movement to learn this on, because the parts are large and the play is easy to see. With the bridges screwed down, lift each wheel gently with pegwood, working from the barrel out to the escape wheel. Each pivot should rise and drop a hair. Nudge each one sideways to judge side-shake. No endshake means a bridge isn’t seated or a pivot isn’t home, so loosen it and look again. Repeat for the pallet fork and balance as they go in. If you find too much play, stop and work through the endshake lesson.',
        },
      ],
    },
    {
      at: 9,
      steps: [
        {
          title: 'Prove the reserve',
          body: 'Wind it fully, note the time and let it run down dial up. This lesson’s figures put the reserve at about 46–53 h, so expect it to reach that range. It’s hand-wound, so you’ll feel the stop at full wind. Never force past it. Read amplitude at full wind and again at 24 hours, when Witschi accepts a fall of about 10 to 15%. If the reserve comes up short, check the spring’s length first, then barrel endshake, then the train.',
        },
      ],
    },
  ],

  'svc-nh35': [
    {
      at: 1,
      steps: [
        {
          title: 'Take the stem out at position 0',
          body: 'Take a baseline reading first, while the crown can still wind it. One listing gives the NH35’s lift angle as 53°, so use that as a typical value. If you plan to let the power down by crown, do that before the stem comes out too. On NH and 6R movements the stem comes out with the crown pushed fully in, at position 0. Press the setting-lever release and pull the stem at the same time. That’s Caliber Corner’s reported method, so follow a Seiko technical guide if you have one. If the stem won’t come, let go, check the crown really is at 0, and try again. Hard pulling can damage the lever.',
        },
      ],
    },
    {
      at: 6,
      steps: [
        {
          title: 'Prove the Magic Lever',
          body: 'Once the automatic works are back on, check them before you go further. Turn the rotor slowly by hand one way, then the other. The Magic Lever winds in both directions, so the wheel it drives should advance each way, and the rotor should spin freely with no scrape. If one direction does nothing, take the bridge off and look at the two claws of the pawl lever under a loupe for wear, dirt or a claw out of place. Clean it, refit it and test again. If a claw is worn, fit a new lever.',
        },
      ],
    },
    {
      at: 7,
      steps: [
        {
          title: 'Check the dial for a mod case',
          body: 'If this NH35 is going into a mod case, check the parts fit before you commit. With a 3 o’clock crown, the dial feet sit at the 8 and 38 minute marks. Dials are ideally 0.4 mm thick, 0.6 mm is the practical limit, and the installed height is 7.59 mm. An NH36 day wheel is pre-aligned, so 3 o’clock and 4 o’clock versions aren’t interchangeable. These figures come from a retailer’s guide, not Seiko, so measure your own parts. If the date sits off-centre in the window, stop and check the dial before you press the hands on.',
        },
      ],
    },
    {
      at: 8,
      steps: [
        {
          title: 'Prove hacking, hand-winding and the reserve',
          body: 'These are what the NH35 adds over the 7S26, so test each one. Pull the crown to the time-setting position: the seconds hand should stop, and it should restart when you push the crown home. Wind by crown and listen for a steady click. Then wind fully, note the time and let it run down dial up. Expect about 41 h. If it won’t hack, check the keyless parts on the dial side went back correctly. If the reserve falls well short, start with the barrel.',
        },
      ],
    },
  ],

  'svc-2824': [
    {
      at: 1,
      steps: [
        {
          title: 'Work from ETA’s sheet',
          body: 'ETA’s technical sheet is the best worked example you’ll get. The issue used here is CT 2824-2 revision 25, dated 6 October 2022. It gives a 38 h minimum and 42 h typical reserve, and a typical lift angle of 50°. Set 50° on your timegrapher, because 52° would read 4% high and turn a true 280° into about 291°. Take your baseline reading now. Check your sheet’s date too. ETA changed this calibre’s lubrication at least nine times between 2009 and 2016, which is why charts on forums disagree.',
          caution: 'ETA makes eye protection compulsory for all work on this movement.',
        },
      ],
    },
    {
      at: 5,
      steps: [
        {
          title: 'ETA’s rule for the reversing wheels',
          body: 'ETA’s sheet is firmer than the general advice in “Service the automatic module”. It marks the reversing wheel and the auxiliary reversing wheel (positions 28 and 27) “do not wash”, and says to exchange them for prelubricated originals if needed. So keep them out of the wash and test each by hand: it should lock one way and run free the other. Replace a sticky or gritty wheel rather than oiling it. One repair site reports that this calibre’s automatic parts wear faster than the rest, so try to have new wheels ready before you start. If originals can’t be had, you’re outside ETA’s instructions, and the clean-and-dip routine is the fallback.',
        },
        {
          title: 'Epilame before you rebuild',
          body: 'ETA specifies epilame after washing and before reassembly, on the keyless parts (positions 2 to 8), the setting wheel (32) and the date jumper (40). Its product is Moebius Fixodrop ES/BS 8981. Epilame stops oil spreading, so the lubricant stays where you put it. The parts must be clean and dry. Apply it as Moebius’s instructions say and let the parts dry. If it has taken, a drop of oil stays beaded instead of creeping. That’s the default for this calibre. Practice varies on other parts, and opinion on pallet stones and escape wheels is split.',
          caution: 'ETA calls Fixodrop very volatile, so close the container airtight straight after use.',
        },
      ],
    },
    {
      at: 7,
      steps: [
        {
          title: 'Follow ETA’s stages',
          body: 'ETA’s sheet builds the movement in stages, each with its own lubricants. Where it differs from the general map above, the sheet wins. Keyless: HP-1300 on the stem, sliding pinion and lever contact points, and 9504 on the winding pinion teeth. Going train (escape, intermediate, third and second wheels, then the train bridge): a split between 9010 and HP-1300, so read the sheet’s drawing for each point. Barrel stage (barrel, stop lever, barrel bridge, click, click spring, crown wheel, ratchet wheel): HP-1300 on the barrel arbor, barrel bridge and crown wheel. Pallet and balance: 9415 on the pallet stones, and 9010 at the pallet and balance points. Automatic device: HP-1300 in the framework, and a very small quantity of 9010 at the oscillating weight. Calendar and motion works: HP-1300, HP-1300 SC, and very small quantities of HP-1300 SC and 9010.',
          caution: 'ETA’s sheet marks the crown-wheel screw as left-hand thread. Turn it clockwise to undo it.',
          tip: 'The date jumper (position 40) has its own routine: oil it, advance the date about 10 teeth with rapid correction, and repeat until it has had three oilings.',
        },
      ],
    },
    {
      at: 8,
      steps: [
        {
          title: 'Prove the reserve, hacking and date',
          body: 'Test what ETA gives you numbers for. Wind fully, note the time and run it down dial up. Anything under 38 h is short of ETA’s minimum, and 42 h is typical. Pull the crown: the balance should stop. If it doesn’t, look at the stop lever (position 15), which goes in under the barrel bridge. Advance the date by rapid correction and check it snaps over cleanly. A date that sticks or feels weak takes you back to the jumper routine. Log the results against your baseline.',
        },
      ],
    },
  ],

  'svc-7750': [
    {
      at: 1,
      steps: [
        {
          title: 'Time it before you strip it',
          body: 'A chronograph gives you two baselines. Set the timegrapher to 49°, the 7750’s lift angle, and read amplitude dial up, fully wound, with the chronograph stopped. Start the chronograph and read again. Note whether each counter returns to zero, and whether start, stop and reset feel crisp. Those figures tell you later whether a problem was already there or came from your rebuild.',
        },
      ],
    },
    {
      at: 7,
      steps: [
        {
          title: 'Compare chrono off and on',
          body: 'With the watch finished, repeat your two baseline readings. Some loss with the chronograph running is normal, but a collapse in amplitude means the chrono works are dragging. Find it before you case the watch: check that each lever moves freely, and look for grease in the wrong place. Witschi’s rate target for a chronograph matches a gent’s watch, −5 to +15 s/day. Then prove the reserve, which ETA gives as 48 h minimum and 54 h typical. Run that test with the chronograph stopped, because leaving it running drains the reserve faster.',
        },
        {
          title: 'Read a bad reset',
          body: 'Reset faults have patterns. These come from forum reports, so treat them as leads. If the hand always stops at the same wrong place, it was probably fitted wrongly, so refit it at true zero. If it lands in different places, the hammer may be slipping off the heart. Check the hammer seats fully on the seconds heart, with a small gap left at the minute counter. One 7750 thread adds that a misseated lower bridge can cause chrono faults, and suggests pressing reset before tightening its screws.',
        },
        {
          title: 'If it’s a Sellita SW500',
          body: 'The SW500 is a 7750 clone, so treat this lesson as your guide, with two warnings reported by Caliber Corner. Sellita’s oil charts say the RDM+ barrel isn’t cleaned at service, so identify the barrel before anything goes in the wash. The stem comes out with the crown two clicks out, using a 1 mm flat tool, because a pointed one can jam the setting lever.',
        },
      ],
    },
  ],

  'svc-miyota': [
    {
      at: 2,
      steps: [
        {
          title: 'A loud rotor isn’t a fault',
          body: 'Miyota’s 82xx rotors are audible. One brand that fits them calls the noise a characteristic that a service won’t silence, so don’t promise a quiet watch. It matters when the noise comes with grit, poor winding or rotor play. One forum thread ties that kind of noise to wear in the automatic parts, and warns that oiling without cleaning just makes a gritty paste. Rock the rotor to feel for play before you strip it, and write down what you find.',
        },
      ],
    },
    {
      at: 5,
      steps: [
        {
          title: 'Test the one-way winding',
          body: 'These winders work in one direction only, so a rotor that freewheels one way is normal. With the winding works back on, turn the rotor slowly by hand each way. In one direction you should see the winding wheels advance. In the other it should run free with no drag. If neither direction winds, the pawl parts are dirty or out of place, so take them off, clean them and refit them. If the rotor drags both ways, check its bearing and that nothing is touching it.',
        },
      ],
    },
    {
      at: 6,
      steps: [
        {
          title: 'Set honest targets',
          body: 'One listing gives the 8215’s lift angle as 49° and the 9015’s as 51°. Neither is confirmed by a maker’s sheet, so treat amplitude on both as approximate. No confirmed rate tolerance was found for either calibre, so use a general target. Witschi’s −5 to +15 s/day for a gent’s watch is a fair pass. Both are listed at about 42 h, so wind fully by crown, note the time, and run it down dial up. A reserve well short of that sends you back to the barrel and winding parts.',
        },
      ],
    },
  ],

  'svc-seiko': [
    {
      at: 3,
      steps: [
        {
          title: 'Working without crown winding',
          body: 'A 7S26 can’t be wound by crown, and that changes two routines. You can’t let it down with the crown, so leave it to run down until it stops, or use the ratchet-wheel method if you can reach the click. After the rebuild you can’t give it a quick 10 to 15 turns either. Build up power with the rotor, on a winder or on the wrist, before you take readings. A barely wound 7S26 reads low, and that’s not a fault.',
        },
      ],
    },
    {
      at: 5,
      steps: [
        {
          title: 'Check which variant you have',
          body: 'The family likeness stops at the variant. Caliber Corner reports that 6R15 parts aren’t fully interchangeable between the A to D variants. Read the full calibre code off the movement and use the parts list for that variant. If a part nearly fits, don’t force it. Stop and check the code, because you probably have the wrong version.',
        },
      ],
    },
    {
      at: 6,
      steps: [
        {
          title: 'Judge it by Seiko’s figures',
          body: 'Don’t regulate these to chronometer standards out of habit. A 7S26 is rated at −20 to +40 s/day, and one source lists the 6R15 and 6R35 at −15 to +25 s/day, so a small gain is plenty. Listings give 53° as the lift angle for the 7S26, 4R36, 6R15 and 6R35, so treat that as typical. When you test the date on a 6R35, Caliber Corner gives 9 pm to 1 am as the time to avoid quick-setting. Move the hands clear first.',
        },
      ],
    },
  ],
}
