// Learning tracks. Each lesson has ordered steps; steps may carry a
// `figure` key (rendered by StepFigures.jsx), a `caution`, and a `tip`.

export const TRACKS = [
  /* ============================================================ */
  {
    id: 'first-project',
    name: 'Your First Project',
    icon: 'build',
    accent: 'brass',
    blurb:
      'A hand-held path from your very first strap change to a full mechanical service. Follow these five projects in order and every other track slots into place around them.',
    lessons: [
      {
        id: 'fp-start',
        title: 'Start here — the bench and a strap',
        summary: 'Set up a safe space and get your hands on a watch.',
        level: 'Beginner',
        time: '30 min',
        tools: ['Spring-bar tool', 'Loupe'],
        intro:
          'Everyone’s first watch job is a strap change, and it teaches the two habits the rest of this hobby runs on: a clean, contained workspace and a gentle, deliberate touch. Do this once and you’re ready for real repairs.',
        steps: [
          { title: 'Make a safe workspace', body: 'A well-lit table, a light-coloured tray or mat to catch parts, and no carpet under you (springs and screws love carpet). Read the “Set up your workspace” lesson in the Workshop track for the full setup.' },
          { title: 'Change a strap', body: 'Fit and remove a strap with a spring-bar tool — the “Change a watch strap” lesson in the Basics track walks it through. It’s the gentlest possible introduction to handling a watch.' },
          { title: 'Learn to look', body: 'Get a loupe and just study a movement or dial up close. Training your eye is half of watchmaking. When you’re comfortable, move on to Project 1.', tip: 'Log this first watch in your Practice Log — it’s satisfying to watch the list grow.' },
        ],
      },
      {
        id: 'fp-battery',
        title: 'Project 1 — change a quartz battery',
        summary: 'Your first time opening a case and touching a movement.',
        level: 'Beginner',
        time: '30 min',
        tools: ['Caseback opener', 'Anti-magnetic tweezers', 'Silicone grease'],
        intro:
          'A battery change is the safest real repair there is, and it’s the most common job in the world. It gets you opening a case, working near a movement, and re-sealing it properly.',
        steps: [
          { title: 'Do the full lesson', body: 'Follow “Change a quartz battery” in the Quartz track step by step — correct cell, no fingerprints, fresh seal. This is your first proper repair.' },
          { title: 'Understand what you touched', body: 'Read “Inside a quartz movement” to see what the little cell actually powers — crystal, IC, coil, and stepper. Knowing the why makes every future fix make sense.' },
          { title: 'Re-seal like it matters', body: 'Grease the gasket and seat the back squarely. A battery change breaks water resistance until it’s re-sealed and tested — treat every case you close as if it’ll get wet.', tip: 'If it doesn’t start, don’t panic — work the “Quartz — testing the electronics” diagnostic before assuming the worst.' },
        ],
      },
      {
        id: 'fp-inspect',
        title: 'Project 2 — open, inspect & identify',
        summary: 'Get the movement out and work out exactly what it is.',
        level: 'Beginner',
        time: '45 min',
        tools: ['Movement holder', 'Screwdrivers', 'Finger cots', 'Loupe'],
        intro:
          'Before you ever strip a watch, get confident removing a movement from its case and identifying the calibre. This is the bridge between swapping parts and real servicing.',
        steps: [
          { title: 'Remove the movement', body: 'Follow “Remove the movement from the case” — release the stem correctly, decide whether it’s a front- or back-loader, and lift the movement into a holder without touching the dial.' },
          { title: 'Identify the calibre', body: 'Use “Identify a quartz calibre” (and the Movement Guides section) to name what you have. Knowing the calibre unlocks every data sheet, part, and oiling chart you’ll ever need.' },
          { title: 'Read the machine', body: 'With the movement in a holder, find the parts you met in the Anatomy Explorer — barrel, train, escapement, balance. Naming them by sight is the skill Project 4 depends on.', tip: 'Save the calibre and battery/stem details in your Practice Log so you never have to look them up twice.' },
        ],
      },
      {
        id: 'fp-module',
        title: 'Project 3 — swap a quartz module & refit hands',
        summary: 'The delicate part: hands and dial without damage.',
        level: 'Intermediate',
        time: '1 hr',
        tools: ['Hand-removal levers', 'Dial protectors', 'Hand-setting tools'],
        intro:
          'Replacing a dead quartz module is cheap and low-risk, but it teaches the highest-stakes skill in the hobby: removing and refitting hands without marking the dial. Nail this and mechanical work stops being scary.',
        steps: [
          { title: 'Do the module swap', body: 'Follow “Swap a quartz movement (module)” — the real skill isn’t the electronics, it’s protecting the dial and pressing the hands back on dead flat and correctly indexed.' },
          { title: 'Practise hands until it’s boring', body: 'Work through “Remove & refit hands and dial” a few times. Hands are friction-fit and unforgiving; the confidence you build here carries straight into servicing.' },
          { title: 'Check your work', body: 'Run the hands past 12:00 and confirm they never touch and align perfectly. If not, lift and re-index — never force. When this feels routine, you’re ready for a full service.', tip: 'Dial protectors are not optional. One slip leaves a permanent scratch.' },
        ],
      },
      {
        id: 'fp-service',
        title: 'Project 4 — your first full service',
        summary: 'Strip, clean, oil and rebuild a real movement.',
        level: 'Advanced',
        time: '3–4 hrs',
        tools: ['Movement holder', 'Screwdrivers', 'Watch oils & oilers', 'Timegrapher'],
        intro:
          'This is the milestone: a complete strip-clean-oil-rebuild. Do it on the movement built for learning — the big, forgiving ETA/Unitas 6497 (or its Seagull ST36 clone) — and every principle from the earlier projects comes together.',
        steps: [
          { title: 'Read the whole Servicing track first', body: 'Skim let-down, teardown, cleaning, oiling, shock protection and reassembly before you start. Knowing the shape of the job stops you improvising at the bench.' },
          { title: 'Follow the 6497 flagship service', body: 'Work “Flagship service: the ETA/Unitas 6497” end to end — real part names, the left-hand crown-wheel screw, the free-train air test, and the exact oiling map. Take your time; there’s no prize for speed.' },
          { title: 'Prove it and log it', body: 'Regulate on the timegrapher, run it a day or two, and record the rate, amplitude and beat error in your Practice Log. That baseline is proof you did it right — and the reference for your next service.', tip: 'When the 6497 feels comfortable, step up to the Seiko NH35 or ETA 2824 walkthroughs.' },
        ],
      },
      {
        id: 'fp-next',
        title: 'What to build next',
        summary: 'Turn skills into a watch of your own.',
        level: 'Intermediate',
        time: '15 min',
        tools: [],
        intro:
          'You can now open, diagnose, repair, and service a watch. From here the hobby opens up in three directions — pick whichever excites you.',
        steps: [
          { title: 'Mod a watch', body: 'The Seiko NH35 is a drop-in for a huge range of aftermarket cases. Service one (its walkthrough is in Servicing), then build it into a case, dial and hands of your choosing.' },
          { title: 'Build from a kit', body: 'Work the Build track — plan a build, source a case and 6497/NH35, fit the movement and stem, and case it up. A watch you assembled yourself is a different kind of satisfying.' },
          { title: 'Go deeper into movements', body: 'Take on a Swiss automatic (the ETA 2824), then a chronograph (the 7750) via the Chronographs track. Use the Movement Guides to choose what to tackle next.', tip: 'Keep logging every watch. Your Practice Log is the record of how far you’ve come.' },
        ],
      },
    ],
  },

  /* ============================================================ */
  {
    id: 'fundamentals',
    name: 'How a Watch Works',
    icon: 'anatomy',
    accent: 'brass',
    blurb:
      'The theory first. Understand what’s inside a watch and how it keeps time, and every repair afterwards makes sense instead of feeling like guesswork.',
    lessons: [
      {
        id: 'fund-overview',
        quiz: [
          { q: 'What is the “movement” of a watch?', options: ['The strap and case', 'The mechanism that keeps time', 'The glass over the dial', 'The battery'], answer: 1, explain: 'The movement (or calibre) is the timekeeping engine; everything else protects or displays it.' },
          { q: 'The two main families of movement are:', options: ['Analog and digital', 'Swiss and Japanese', 'Mechanical and quartz', 'Manual and solar'], answer: 2, explain: 'Mechanical run on a wound spring and balance; quartz on a battery and a vibrating crystal.' },
          { q: 'Accuracy in any watch comes from:', options: ['A heavier case', 'Something that repeats at a perfectly steady rate', 'More jewels', 'A bigger mainspring'], answer: 1, explain: 'A steady oscillator — a balance wheel or a quartz crystal — is the timekeeping reference.' },
        ],
        title: 'What’s inside a watch',
        summary: 'The big picture: movements, and the parts common to all.',
        level: 'Beginner',
        time: '10 min',
        tools: [],
        intro:
          'Every watch, however fancy, is built around one job: divide time into equal pieces and count them. There are two families that do this very differently.',
        steps: [
          { title: 'The movement is the engine', body: 'The “movement” (or calibre) is the mechanism that keeps time. Everything else — case, dial, hands, strap — exists to protect it, display it, or wear it.', figure: 'illus:mechanical', caption: 'A complete mechanical movement — click any number to meet the part.' },
          { title: 'Two families: mechanical and quartz', body: 'Mechanical watches run on a wound spring and a swinging balance wheel. Quartz watches run on a battery and a vibrating crystal. The rest of this app teaches both.', figure: 'exploded', caption: 'A watch is a stack: case, movement, dial, hands, crystal, back.' },
          { title: 'What they share', body: 'Both drive a gear train that turns the hands, both live in a sealed case with gaskets, and both are set through a crown and stem. Learn those shared parts once and they apply everywhere.' },
          { title: 'Why time-keeping needs an oscillator', body: 'Accuracy comes from something that repeats at a perfectly steady rate — a balance wheel (mechanical) or a quartz crystal (electronic). The whole craft is really about protecting and tuning that oscillator.', tip: 'Open the Anatomy Explorer alongside these lessons — seeing the parts move makes the words stick.' },
        ],
      },
      {
        id: 'fund-mechanical',
        quiz: [
          { q: 'The mainspring’s job is to:', options: ['Keep time', 'Store energy', 'Regulate the beat', 'Set the hands'], answer: 1, explain: 'The mainspring is the fuel tank — it stores wound energy that drives the whole movement.' },
          { q: 'What meters that energy out in tiny steps?', options: ['The barrel', 'The going train', 'The escapement', 'The crown'], answer: 2, explain: 'The escapement (escape wheel + pallet fork) releases energy one beat at a time — the tick.' },
          { q: 'Each beat has three actions:', options: ['Wind, set, release', 'Lock, draw, impulse', 'Push, pull, twist', 'Start, stop, reset'], answer: 1, explain: 'Lock, draw (holds the fork safe against its banking pin), then impulse to the balance.' },
          { q: 'The steady rhythm is set by:', options: ['The mainspring', 'The balance wheel & hairspring', 'The rotor', 'The keyless works'], answer: 1, explain: 'The balance and hairspring oscillate at a fixed rate (e.g. 28,800/hr) — the reference.' },
        ],
        title: 'How a mechanical watch keeps time',
        summary: 'Follow the energy from spring to ticking hands.',
        level: 'Beginner',
        time: '12 min',
        tools: [],
        intro:
          'A mechanical watch is a controlled release of spring energy. Trace the path once and the whole movement stops being mysterious.',
        steps: [
          { title: 'Store energy — the mainspring', body: 'Winding coils a flat spring inside the barrel. This is the fuel tank; a full wind holds roughly 40–70 hours of running.' },
          { title: 'Transmit it — the going train', body: 'The barrel drives a chain of wheels (centre → third → fourth) that both carries the power onward and gears it down so the hands turn at the right speed.', figure: 'plate:depthing', caption: 'A wheel drives the next pinion; their pitch circles just touch.' },
          { title: 'Meter it — the escapement', body: 'If the train ran free, the spring would dump all its energy in seconds. The escapement — an escape wheel and a pallet fork, the lever design perfected from Thomas Mudge’s of 1750 — releases it one step at a time. Each beat has three actions: lock (a tooth rests on a pallet), draw (an angled face pulls the fork tight against its banking pin for safety), and impulse (the tooth pushes the fork over). That release is the ticking you hear.', figure: 'plate:lock-draw-impulse', caption: 'Lock · draw · impulse — the three actions of every beat.' },
          { title: 'Time it — the balance', body: 'The balance wheel and hairspring swing back and forth at a fixed rate (commonly 8 per second). That steady beat is the reference the whole watch is measured against.', figure: 'plate:hairspring-forms', caption: 'The hairspring: flat, or a Breguet overcoil for better isochronism.' },
          { title: 'Put it together', body: 'Spring pushes train → train pushes escapement → escapement feeds the balance a nudge each swing → balance’s steady rhythm lets the escapement release exactly one step per beat. A self-sustaining loop.', tip: 'This is the single most important idea in watchmaking. If it clicks, everything else follows.' },
        ],
      },
      {
        id: 'fund-automatic',
        title: 'How automatic winding works',
        summary: 'Why a watch can wind itself on your wrist.',
        level: 'Beginner',
        time: '8 min',
        tools: [],
        intro:
          'An automatic watch is just a mechanical watch with an extra module on top that winds the mainspring from your movement.',
        steps: [
          { title: 'The rotor is a weight', body: 'A semicircular weight pivots freely at the centre. As your wrist moves, gravity keeps it swinging — that motion is the energy source.', figure: 'illus:automatic', caption: 'The rotor sweeping over the winding train it drives.' },
          { title: 'The reverser makes it one-way', body: 'The rotor turns both clockwise and anticlockwise, but the mainspring can only be wound one way. A reversing-wheel cluster converts both directions into one-way winding.' },
          { title: 'It can’t be over-wound', body: 'An automatic mainspring has a slipping bridle — once fully wound it simply slips inside the barrel, so you never need to worry about winding it too far while wearing it.', tip: 'A watch worn only occasionally still benefits from a few manual winds before putting it on, to top up the reserve.' },
          { title: 'See it move', body: 'Open the “Automatic winding” diagram in the Anatomy Explorer to watch the rotor drive the reduction and reversing wheels into the ratchet.', figure: null },
        ],
      },
      {
        id: 'fund-quartz',
        quiz: [
          { q: 'A quartz crystal vibrates at exactly:', options: ['60 Hz', '32,768 times per second', '28,800 per hour', 'Once per second'], answer: 1, explain: 'The tuning-fork crystal vibrates at 32,768 Hz — the reason quartz is so accurate.' },
          { q: 'The circuit divides that down to:', options: ['One pulse per minute', 'One pulse per second', '100 pulses per second', 'Nothing'], answer: 1, explain: 'The IC counts 32,768 vibrations and outputs exactly one pulse per second to the motor.' },
          { q: 'The most common quartz “fault” is:', options: ['A cracked crystal', 'A flat battery', 'A bent hand', 'A worn rotor'], answer: 1, explain: 'A dead cell stops most quartz watches — the easiest real repair to learn.' },
        ],
        title: 'How a quartz watch works',
        summary: 'Battery + crystal + motor, and why it’s so accurate.',
        level: 'Beginner',
        time: '8 min',
        tools: [],
        intro:
          'Quartz replaced the spring and balance with electronics. Fewer moving parts, far better accuracy, and much simpler repairs.',
        steps: [
          { title: 'The crystal is the oscillator', body: 'A tiny quartz tuning fork vibrates at exactly 32,768 times a second when powered. That frequency is astonishingly stable — the reason quartz watches keep time so well.' },
          { title: 'The circuit counts and divides', body: 'An integrated circuit counts those 32,768 vibrations and outputs exactly one electrical pulse per second.' },
          { title: 'The motor turns the pulse into motion', body: 'Each pulse energises a coil that kicks a stepper motor one step — that’s the once-per-second jump of a quartz seconds hand — which then drives a small gear train to the hands.', figure: 'battery', caption: 'A single cell powers the whole chain for 1–3 years.' },
          { title: 'Why repairs are simple', body: 'With no mainspring or balance, most quartz faults are a flat battery or a failed module — both quick, low-cost fixes covered in the Quartz Repair track.' },
        ],
      },
      {
        id: 'fund-keyless',
        quiz: [
          { q: 'Pushed in, turning the crown:', options: ['Sets the time', 'Winds the mainspring', 'Changes the date', 'Does nothing'], answer: 1, explain: 'Pushed in it winds; pulled out it sets — the keyless works switch between the two jobs.' },
          { q: 'The clutch between winding and setting is the:', options: ['Cannon pinion', 'Sliding pinion', 'Ratchet wheel', 'Balance staff'], answer: 1, explain: 'The sliding pinion shifts along the stem to drive either the winding or the setting gears.' },
          { q: 'A “won’t wind / won’t set” fault usually lives in the:', options: ['Mainspring', 'Keyless works', 'Hairspring', 'Escape wheel'], answer: 1, explain: 'The keyless clutch and its levers are the usual culprits.' },
        ],
        title: 'Winding vs setting: the keyless works',
        summary: 'How one crown does two completely different jobs.',
        level: 'Intermediate',
        time: '10 min',
        tools: [],
        intro:
          'Pushing and pulling the crown feels trivial, but underneath, a clever clutch is switching the crown between winding the spring and setting the hands.',
        steps: [
          { title: 'One input, two jobs', body: 'Pushed in, turning the crown winds the mainspring. Pulled out, turning the same crown sets the time. The keyless works decide which.', figure: 'illus:keyless', caption: 'The keyless works: crown, stem, clutch pinion, levers and setting wheels.' },
          { title: 'The sliding pinion is the clutch', body: 'A pinion slides along the stem between two positions. In one it drives the winding gears; in the other it drives the setting gears.' },
          { title: 'Levers do the switching', body: 'Pulling the crown moves the setting lever, which shifts the yoke, which slides the pinion into setting mode. Push the crown home and a spring returns everything to winding.', figure: 'stem', caption: 'The setting lever detent is also how the stem is released.' },
          { title: 'Why it matters for repair', body: 'This is the mechanism you disturb when removing a stem, and a common source of “crown won’t wind / won’t set” faults. Watches evolved from key-wound to pin-set (press a pin on the case to set) to today’s keyless work — you’ll still meet all three. See the “Keyless works” diagram to trace both paths.' },
        ],
      },
      {
        id: 'fund-complications',
        title: 'Complications explained',
        summary: 'Date, chronograph, GMT, moonphase and more.',
        level: 'Beginner',
        time: '10 min',
        tools: [],
        intro:
          'A “complication” is any function beyond plain hours-minutes-seconds. Knowing what each is helps you set it correctly and service it safely.',
        steps: [
          { title: 'Date, day-date & pointer date', body: 'A date wheel under the dial advances once per day via the motion works. Day-date adds a day wheel; pointer date uses a hand instead of a window.' },
          { title: 'Chronograph (stopwatch)', body: 'Adds start/stop/reset timing with pushers, a sweep seconds hand, and sub-counters. It’s a whole mechanism layered on the base movement — see the Chronograph track.' },
          { title: 'GMT / dual time', body: 'An extra hour hand (and often a 24-hour bezel or scale) tracks a second time zone — invaluable for travellers.' },
          { title: 'Moonphase, power reserve & more', body: 'Moonphase shows the lunar cycle; a power-reserve indicator shows remaining wind. Each is beautiful but adds parts, cost, and service complexity.', tip: 'More complications = more to set correctly and more that can go wrong. Master a simple three-hander first.' },
        ],
      },
      {
        id: 'fund-escapements',
        title: 'Other escapements',
        summary: 'The lever’s ancestors and cousins — verge, cylinder, pin-pallet, co-axial.',
        level: 'Intermediate',
        time: '10 min',
        tools: [],
        intro:
          'The Swiss lever won out, but you’ll meet other escapements in vintage and specialist watches. Recognising them helps you avoid mis-servicing what’s on the bench.',
        steps: [
          { title: 'English lever', body: 'The Swiss lever’s immediate predecessor: pointed, wedge-shaped escape teeth (rather than the Swiss club tooth), the escape wheel and balance usually set at right angles, and often a single roller. The action is the same in principle; because the pointed teeth have a tiny impulse plane, the pallet impulse faces are made longer to compensate.', figure: 'plate:escapement-geometry', caption: 'The Swiss lever escapement the others are measured against.' },
          { title: 'Pin-pallet (Roskopf)', body: 'A cheap, robust simplification: pressed-brass parts and steel pins in place of jewelled pallet stones, with the escape-tooth root used for banking. Common in inexpensive and alarm watches — reliable, but not fine.' },
          { title: 'Cylinder', body: 'An older design where the escape teeth sit up on stalks and give impulse to the lips of a hollow steel cylinder that forms the balance staff. It improved on the verge but is delicate and long obsolete — you’ll see it in antique watches.' },
          { title: 'Verge & the modern co-axial', body: 'The verge is the oldest: a crown-shaped escape wheel and two pallet “paddles” on a vertical staff (needing an odd tooth count). At the other end of history, George Daniels’ co-axial escapement (used by Omega) swaps sliding friction for radial pushing, for longer service intervals.' },
        ],
      },
      {
        id: 'fund-fusee',
        title: 'Fusee & constant force',
        summary: 'How old watches kept even power as the spring ran down.',
        level: 'Intermediate',
        time: '8 min',
        tools: [],
        intro:
          'A mainspring pushes hard when fully wound and weakly when nearly run down. Before flat, stable springs, the fusee evened that out.',
        steps: [
          { title: 'The problem', body: 'Timekeeping suffers if the force reaching the escapement changes as the spring unwinds. Early watches needed a way to deliver roughly constant torque.' },
          { title: 'The fusee cone & chain', body: 'A cone with a spiral groove is linked to the mainspring barrel by a tiny chain, like a miniature bicycle chain. Fully wound, the chain pulls from the cone’s small diameter; as the spring weakens, it pulls from an ever-larger radius — evening out the torque.' },
          { title: 'Maintaining power', body: 'Because winding briefly reverses the drive, a fusee carries a “maintaining power” spring that keeps the train running while you wind, so the watch never stops.' },
          { title: 'Working on them', body: 'Fusee watches are fragile and fiddly — the chain especially. Admire the ingenuity, but practise only on cheap, un-cased scrap movements until you’re very experienced.', caution: 'Never work on a fusee still under power or still cased — release the movement and let the power down first.' },
        ],
      },
      {
        id: 'fund-sweep',
        title: 'Centre (sweep) seconds',
        summary: 'Why a central seconds hand needs extra gearing.',
        level: 'Intermediate',
        time: '8 min',
        tools: [],
        intro:
          'Older watches put the seconds in a small sub-dial at 6 o’clock. Moving that hand to the centre — a “sweep” seconds — means rerouting the gear train.',
        steps: [
          { title: 'Subsidiary vs centre', body: 'The seconds hand is driven by the fourth wheel, which turns once a minute. A subsidiary seconds simply rides on the fourth wheel at 6 o’clock; a centre seconds must carry that motion to the middle of the dial.' },
          { title: 'Direct drive', body: 'The tidiest solution redesigns the train so the fourth wheel sits in the centre and drives the seconds hand directly — smooth, but it needs a purpose-built movement.' },
          { title: 'Indirect (non-direct) drive', body: 'To add sweep seconds to an existing movement, makers ran an extra “seconds pinion” through the hollow centre. Because it drives nothing, gear backlash makes it tremble — so a fine dampening leaf-spring is fitted to steady the hand.', tip: 'That faint flutter you sometimes see in a vintage centre-seconds hand is indirect-drive backlash, not a fault.' },
          { title: 'Which you have', body: 'A crisp, dead-steady sweep is usually direct drive; a slight tremble points to an indirect-drive movement with a tension spring.' },
        ],
      },
      {
        id: 'fund-temperature',
        title: 'Temperature & the balance',
        summary: 'How watches fight the timing error from heat and cold.',
        level: 'Intermediate',
        time: '9 min',
        tools: [],
        intro:
          'Temperature changes a balance spring’s strength far more than it changes the metal’s size — historically the single biggest source of error. Two clever answers largely solved it.',
        steps: [
          { title: 'Why heat changes the rate', body: 'Warmth expands the balance a little, but above all it weakens the elasticity of the hairspring — by far the largest effect. So a watch tends to run slow when warm and fast when cold.' },
          { title: 'The compensating (bimetallic) balance', body: 'The classic cure: a split rim brazed from brass on the outside and steel on the inside. Heat expands the brass more, curling the rim’s free ends inward to shrink the balance and cancel the spring’s weakening.', figure: 'plate:compensating-balance', caption: 'Heat curls the free ends of the bimetallic rim inward.' },
          { title: 'Middle-temperature error', body: 'A bimetallic balance can’t compensate perfectly at every temperature, leaving a small residual “middle-temperature error.” Minimising it is one of the branches of fine adjusting.' },
          { title: 'The modern answer', body: 'Today the problem is largely designed away: temperature-stable alloys — Invar, and especially Elinvar/Nivarox hairsprings paired with a solid Glucydur balance — hold their elasticity across temperature (and resist magnetism), so a plain monometallic balance is enough.' },
        ],
      },
    ],
  },

  /* ============================================================ */
  {
    id: 'basics',
    name: 'Straps, Case & Everyday Care',
    icon: 'strap',
    accent: 'emerald',
    blurb:
      'The safest place to start. Every job here is reversible and needs only a few cheap tools — build confidence before you open a movement.',
    lessons: [
      {
        id: 'basics-strap',
        quiz: [
          { q: 'A strap is held to the case by:', options: ['Glue', 'Spring bars', 'Screws through the dial', 'Magnets'], answer: 1, explain: 'Spring bars are sprung pins that compress into holes drilled in the lugs.' },
          { q: 'You should swap a strap working:', options: ['On a bare table', 'Face-down on a soft mat', 'Holding it in the air', 'Over a sink'], answer: 1, explain: 'A soft mat protects the crystal and case from scratches (and catches a flung bar).' },
          { q: 'After fitting, you should:', options: ['Tug the strap to check the bar seated', 'Oil the spring bar', 'Heat the lug', 'Leave it loose'], answer: 0, explain: 'If it moves, the bar didn’t seat — re-compress until it holds firmly.' },
        ],
        title: 'Swap a strap with a spring-bar tool',
        summary: 'Remove and fit a strap or bracelet in a couple of minutes.',
        level: 'Beginner',
        time: '5 min',
        tools: ['Spring-bar tool', 'Soft mat / tray'],
        intro:
          'Straps are held on by spring bars — tiny sprung pins tucked into the lugs. Compress one end and the strap lifts out. This is the single best first skill.',
        steps: [
          { title: 'Lay the watch face-down on a soft surface', body: 'Work on a cloth or watchmaker’s mat so the crystal and case can’t get scratched. Point the lugs toward you.' },
          { title: 'Find the spring bar between the lugs', body: 'Look into the gap between the strap and the case. You’ll see the spring bar with a small shoulder (the “tip”) seated in a hole drilled into each lug.', figure: 'springbar', caption: 'The forked end of the tool sits on the spring-bar shoulder.' },
          { title: 'Compress the bar with the forked end', body: 'Slide the tool’s fork against the spring bar’s shoulder and push toward the centre to compress it. The strap end will pop free of the lug.', caution: 'Keep the fork square to the bar. Slipping can gouge the lug or fling the bar across the room — work slowly and keep a hand cupped nearby.', tip: 'If the lugs have holes drilled all the way through, it’s even easier: push the bar out from the outside with the tool’s pin end.' },
          { title: 'Fit the new strap', body: 'Insert one tip of the spring bar into its lug hole, seat the strap, compress the other end, and let it click into the opposite hole.', tip: 'Gently tug the strap after fitting. If it moves, the bar didn’t seat — compress and re-seat until it holds firmly.' },
        ],
      },
      {
        id: 'basics-strap-types',
        title: 'Choosing & caring for straps',
        summary: 'Leather, rubber, NATO, bracelet — pros, cons, and care.',
        level: 'Beginner',
        time: '8 min',
        tools: ['Spring-bar tool'],
        intro:
          'The strap changes how a watch wears and lasts. Matching material to use — and caring for it — is easy once you know the trade-offs.',
        steps: [
          { title: 'Leather: classic, not for water', body: 'Comfortable and smart, but sweat and water ruin it. Keep it dry, let it breathe between wears, and it will last years.' },
          { title: 'Rubber / silicone: sport & water', body: 'Durable and waterproof — ideal for swimming and sport. Wipe clean; some cheaper rubber attracts dust.' },
          { title: 'NATO / fabric: safe and cheap', body: 'A single-piece pass-through strap; even if one spring bar fails the watch stays on your wrist. Great for beaters and easy to wash.' },
          { title: 'Metal bracelet: durable, resizable', body: 'Tough and timeless but needs sizing (next lesson). Rinse after sweat or salt water to protect the finish and clasp.', tip: 'Match spring-bar and lug width (in mm) when buying — 18/20/22 mm are the most common.' },
        ],
      },
      {
        id: 'basics-bracelet',
        title: 'Resize a metal bracelet',
        summary: 'Remove links to get a comfortable fit.',
        level: 'Beginner',
        time: '15 min',
        tools: ['Bracelet pin pusher', 'Small hammer & block', 'Tweezers'],
        intro:
          'Most bracelets are held together by friction pins or pin-and-collar links. Arrows on the inside of the links show the direction to push the pins out.',
        steps: [
          { title: 'Find the removable links & arrows', body: 'Turn the bracelet over. Removable links have small arrows stamped inside pointing the way each pin must be driven out. Remove links evenly from both sides of the clasp so the clasp stays centred.', figure: 'braclink', caption: 'Push the pin in the direction of the arrow.' },
          { title: 'Push out the pin', body: 'Set the bracelet in the pin-pusher tool (or a link-holding block), align the pusher with the pin, and turn the screw or tap gently to drive the pin out.', caution: 'Pin-and-collar bracelets have a tiny split collar that can fall out and vanish. Work over a tray and account for every collar.' },
          { title: 'Remove the link and rejoin', body: 'Separate the freed link, bring the two ends together, and push the pin back in against the arrow direction until it’s flush on both sides.' },
          { title: 'Check the fit and pin seating', body: 'Flex the bracelet — no pin should protrude and no link should gap. Re-seat any proud pin flush before wearing.', tip: 'Aim for one finger of slack with the clasp closed. Wrists swell later in the day, so size in the afternoon.' },
        ],
      },
      {
        id: 'basics-caseback',
        title: 'Open the caseback',
        summary: 'Identify and open snap-on, screw-off, and screwed-back cases.',
        level: 'Beginner',
        time: '10 min',
        tools: ['Case knife', 'Caseback wrench', 'Ball-style opener', 'Rodico'],
        intro:
          'Opening the back is the gateway to a battery change or movement work. First identify which type you have — the wrong tool will scratch or slip.',
        steps: [
          { title: 'Identify the caseback type', body: 'Four common kinds. Snap-on: a smooth edge with a small pry notch. Screw-off: notches or a milled edge for a wrench (e.g. Rolex). Held by screws: four or more small screws around the rim (common on shaped/fashion cases). Smooth screw-off: fine knurling gripped by a friction ball tool.', figure: 'casebackTypes', caption: 'Snap-on · screw-off · screw-in.' },
          { title: 'Snap-on: pry at the notch', body: 'Find the notch (usually at 9 o’clock on a wristwatch), seat a case knife with the flat of the blade against the case body, and twist the blade away from your hand — anticlockwise — so it pops the back without flying into the movement. For a stubborn one, rest the watch on a casing cushion and tap the blade in with a brass hammer.', caution: 'Never lever on a thin lug, and never pry toward your fingers — a slipping case knife is the most common way beginners cut themselves (and mark the case).' },
          { title: 'Screw-off & screws: the right tool', body: 'A screw-off back needs a caseback wrench or socket set into its notches — press down firmly so it can’t jump out, and turn anticlockwise. A back held by screws just needs the four-plus screws removed. A smooth screw-off is turned with a sticky rubber ball, which grips without marking it.' },
          { title: 'Refit correctly', body: 'Snap-on backs have a small notch that must line up with the crown, and press straight back on. Screw backs must start square to avoid cross-threading, and torque down evenly against a fresh, greased gasket for water resistance.', figure: 'illus:case', caption: 'In cross-section: the caseback threads and the gaskets that actually keep water out.', tip: 'A screw back can be gripped hard between your palms and twisted if a tool won’t bite — but a wrench is safer for the case.' },
        ],
      },
      {
        id: 'basics-settime',
        title: 'Set the time & date safely',
        summary: 'Avoid the date “danger zone” that breaks movements.',
        level: 'Beginner',
        time: '8 min',
        tools: [],
        intro:
          'Setting a watch wrong is a surprisingly common way to damage the date mechanism. A couple of simple rules keep it safe forever.',
        steps: [
          { title: 'Understand the danger zone', body: 'For a few hours around midnight (roughly 9 pm–3 am) the date change is engaging under the dial. Quick-setting the date in this window can bend or break the teeth.', figure: 'datezone', caption: 'Avoid quick-setting the date between ~9 pm and 3 am.' },
          { title: 'Move the hands clear first', body: 'Before quick-setting the date, turn the hands to about 6 o’clock so the date works are fully disengaged.' },
          { title: 'Set date first, then time', body: 'Quick-set the date to the day before, then advance the hour hand past midnight to flip it to today — that way you also know AM from PM.' },
          { title: 'Wind before setting on a manual', body: 'On a hand-wound watch, give it a gentle wind first so it’s running, then set. Push the crown fully home (and screw it down if applicable) when done.', caution: 'Never force the crown. If setting feels gritty or stuck, stop — forcing it can shear the tiny setting parts.' },
        ],
      },
      {
        id: 'basics-care',
        title: 'Everyday care & cleaning',
        summary: 'Keep a watch running well without opening it.',
        level: 'Beginner',
        time: '10 min',
        tools: ['Microfibre cloth', 'Soft brush', 'Blower'],
        intro:
          'Most “repairs” are avoidable. Simple habits keep gaskets, movement, and finish healthy for years.',
        steps: [
          { title: 'Wipe down regularly', body: 'A daily wipe with a dry microfibre cloth removes skin oils and grit before they work into the case and bracelet.' },
          { title: 'Rinse a water-resistant watch', body: 'After sweat or salt water, rinse a screw-down watch under fresh water with the crown fully closed, then dry it. Salt is corrosive to seals and steel.', caution: 'Never operate the crown or pushers underwater or while wet, and never near hot water or steam — heat expands seals and lets moisture in.' },
          { title: 'Keep magnets away', body: 'Phones, speakers, laptop closures, and magnetic clasps can magnetise a mechanical watch and make it run fast. Store it away from them.', tip: 'If a mechanical watch suddenly gains minutes a day, suspect magnetism first — a demagnetiser fixes it in seconds.' },
          { title: 'Service on schedule', body: 'Mechanical watches want a full service roughly every 4–6 years; the oils dry out and dry pivots wear. Quartz just needs timely battery changes to avoid leaks.' },
        ],
      },
      {
        id: 'basics-glass',
        title: 'Fit a new watch glass',
        summary: 'Replace a cracked crystal with the right glass and a press.',
        level: 'Intermediate',
        time: '20 min',
        tools: ['Glass press (Robur)', 'Dies', 'Crystal gasket', 'Blower'],
        intro:
          'A scratched or cracked crystal is one of the most satisfying repairs. The trick is matching the glass type and pressing it in square.',
        steps: [
          { title: 'Identify the glass type', body: 'Acrylic (UB/“Plexi”): a soft plastic dome, often with a brass compression ring, that polishes but scratches easily. Mineral glass: harder and flat, usually sealed with a nylon i-gasket. Sapphire: hardest and scratch-resistant. Replace like for like.' },
          { title: 'Measure it', body: 'Measure the bezel-groove diameter. An acrylic UB runs about 0.2 mm larger than the groove; a mineral glass with an i-gasket about 0.1 mm larger. That interference is exactly what makes the seal.' },
          { title: 'Fit acrylic (compression)', body: 'Low/high-dome acrylics are squeezed in a domed die under the glass press, then the case is brought up to meet the compressed dome and the pressure released slowly. A UB with a compression ring is pressed straight up into the bezel groove until it clicks home.' },
          { title: 'Fit mineral with an i-gasket', body: 'Seat the nylon i-gasket first (leading edge toward the glass), rest the case on a flat or cupped die, then press the glass straight down into the groove with a flat die and firm, even force.', caution: 'Press square and fully support the case — a tilted press cracks the glass or seats it crooked. Renew the gasket and pressure-test if the watch is meant to be water-resistant.' },
        ],
      },
    ],
  },

  /* ============================================================ */
  {
    id: 'quartz',
    name: 'Quartz Repair',
    icon: 'chip',
    accent: 'steel',
    blurb:
      'Battery and module work — the most common real-world repairs. Few moving parts, quick wins, and the safest way to practise handling a movement.',
    lessons: [
      {
        id: 'quartz-how',
        quiz: [
          { q: 'A watch quartz crystal is cut to vibrate at:', options: ['50 Hz', '1 Hz', '32,768 Hz', '28,800 Hz'], answer: 2, explain: '2¹⁵ = 32,768 Hz — chosen because it halves neatly, fifteen times, down to a 1 Hz pulse.' },
          { q: 'What actually turns the hands in an analog quartz watch?', options: ['A balance wheel', 'A Lavet stepper motor', 'The crystal directly', 'The battery'], answer: 1, explain: 'A one-pulse-per-second signal flips a Lavet-type stepper motor that drives the train.' },
          { q: 'The IC keeps time by:', options: ['Counting balance swings', 'Dividing the crystal frequency down to 1 Hz', 'Measuring the battery voltage', 'Warming the coil'], answer: 1, explain: 'A CMOS divider halves 32,768 Hz fifteen times to exactly one pulse per second.' },
        ],
        title: 'Inside a quartz movement',
        summary: 'Crystal, IC, coil, and stepper — how a battery keeps time.',
        level: 'Beginner',
        time: '12 min',
        tools: [],
        intro:
          'A quartz watch swaps the mainspring-and-balance for electronics, but the job is identical: make a perfectly steady beat and count it. Four parts do the work.',
        steps: [
          { title: 'The crystal sets the beat', body: 'A tiny tuning-fork of quartz vibrates 32,768 times a second when a voltage is applied — the piezoelectric effect. That figure is 2¹⁵, chosen because it can be halved cleanly down to one pulse per second. The crystal is the quartz watch’s “balance wheel”: an extraordinarily stable oscillator.', figure: 'illus:quartz', caption: 'A quartz module: cell, IC, crystal, coil, stepper and train — click each in turn.' },
          { title: 'The IC divides it down', body: 'A low-power CMOS integrated circuit counts the crystal’s vibrations and divides the frequency in half fifteen times, turning 32,768 Hz into exactly one pulse per second. The same chip runs the low-battery warning and, on many calibres, trims the rate in software (called inhibition).' },
          { title: 'The coil and stepper motor', body: 'Each second the IC sends a brief pulse — alternating in polarity — through a coil of hair-fine wire wound on a soft-iron stator. That magnetises the stator and flips a small permanent-magnet rotor exactly 180°. This is a Lavet-type stepper motor: one precise half-turn per pulse.' },
          { title: 'The train turns the hands', body: 'The rotor’s pinion drives a reduction gear train, exactly as in a mechanical watch, geared so the seconds hand advances one step per second and the minute and hour hands follow. That visible one-second “tick” of the seconds hand is the stepper firing.' },
          { title: 'Why quartz is so accurate', body: 'The crystal’s frequency barely changes with position or power state, so even a cheap quartz watch keeps time to a few seconds a month — far better than most mechanicals. Temperature is its main enemy, which is why the most accurate quartz watches are thermocompensated.', tip: 'Open the Anatomy Explorer’s Quartz diagram to watch the signal flow: crystal → IC → coil → stepper → train.' },
        ],
      },
      {
        id: 'quartz-battery',
        quiz: [
          { q: 'Before removing the old cell you should:', options: ['Note its code (e.g. SR626SW)', 'Bend the clamp', 'Touch both contacts', 'Wet it'], answer: 0, explain: 'Replace like-for-like — the stamped code gives the size and chemistry.' },
          { q: 'Handle a new cell by:', options: ['Its flat faces', 'Its edge', 'Bare fingers', 'Steel tweezers across the contacts'], answer: 1, explain: 'Fingerprints cause discharge and corrosion; bridging the contacts can short the circuit.' },
          { q: 'After a battery change, water resistance is:', options: ['Unchanged', 'Improved', 'Void until re-sealed and tested', 'Doubled'], answer: 2, explain: 'Opening the case breaks the seal — re-grease/replace the gasket and pressure-test.' },
        ],
        title: 'Change a quartz battery',
        summary: 'The most common watch repair, done right.',
        level: 'Beginner',
        time: '15 min',
        tools: ['Caseback opener', 'Plastic/anti-static tweezers', 'Rodico', 'Silicone grease'],
        intro:
          'A stopped quartz watch is usually just a dead cell. Doing it cleanly — right cell, no fingerprints, fresh seal — is what separates a lasting fix from a leak.',
        steps: [
          { title: 'Open the caseback', body: 'Use the correct opener for your back type (see “Open the caseback”). Work on a clean tray so a springy clamp or the cell can’t escape.' },
          { title: 'Read the battery number', body: 'The cell is stamped with a code such as SR626SW or 377. Note it before removing — you must replace like-for-like (voltage and size).', figure: 'battery', caption: 'A clamp or tab holds the cell; note its code before lifting it out.', tip: 'Silver-oxide (SR / “SW”) cells hold voltage steadily — better for watches than cheaper alkaline (LR) equivalents.' },
          { title: 'Release the clamp and lift the cell', body: 'Gently unclip or unscrew the retaining clamp with tweezers, then lift the old cell out. Notice which face (usually +) points up.', caution: 'Use plastic or anti-static tweezers and don’t bridge the cell’s contacts with metal — a short can damage the circuit. Never force a clamp.' },
          { title: 'Fit the new cell', body: 'Handle the new cell by its edge (fingerprints cause discharge and corrosion), seat it the same way up, and refit the clamp so it sits flat and firm.' },
          { title: 'Test before closing', body: 'The second hand should start ticking. If it doesn’t, reseat the cell and check the clamp contact before assuming a fault.' },
          { title: 'Renew the seal and close up', body: 'Wipe the gasket seat, lightly grease the caseback O-ring with silicone (or replace it), and refit the back. Clean the crystal with Rodico or a cloth.', caution: 'A battery change breaks the water seal. Unless the gasket is cleaned/greased and the watch pressure-tested, treat it as no longer water-resistant.' },
        ],
      },
      {
        id: 'quartz-diagnose',
        title: 'Diagnose a stopped quartz watch',
        summary: 'Work out whether it’s the battery, contacts, or module.',
        level: 'Intermediate',
        time: '20 min',
        tools: ['Multimeter (optional)', 'Rodico', 'Tweezers'],
        intro:
          'Before swapping parts, reason it out. Most “dead” quartz watches fall into three buckets: flat cell, dirty contacts, or a failed movement.',
        steps: [
          { title: 'Start with the obvious: the cell', body: 'Fit a known-good battery first. A fresh silver-oxide cell should read about 1.55 V. This alone fixes the large majority of stopped quartz watches.' },
          { title: 'Watch the seconds hand behaviour', body: 'Ticking once every 4 seconds (a “4-second jump”) is the classic low-battery warning, not a broken movement — the cell is nearly flat. A totally still hand points to no power or a jammed train.', tip: 'If a brand-new cell also does the 4-second jump, the problem is upstream — contacts or module, not the battery.' },
          { title: 'Check the contacts', body: 'Inspect the battery clamp and the two contact points for corrosion, green crust, or a bent tab. Clean gently with Rodico or a fibreglass pen and make sure the clamp presses firmly.', caution: 'Corrosion from an old leaking cell can eat through contacts and traces. If you see green fuzz, clean thoroughly — leaked electrolyte spreads.' },
          { title: 'Try the reset (AC) pad', body: 'Many modules have a marked reset pad. Briefly bridging it to the battery + with tweezers resets the IC and can restart a sulking movement. Check the module’s markings first.' },
          { title: 'Decide: repair vs replace module', body: 'If a good cell, clean contacts, and reset all fail, the movement itself has failed. For most quartz calibres the fix is a fresh module, not component-level repair.' },
        ],
      },
      {
        id: 'quartz-test',
        quiz: [
          { q: 'A healthy analog-quartz motor coil typically reads about:', options: ['0 Ω', '1.5–3 kΩ', '1–2 MΩ', 'Open circuit'], answer: 1, explain: 'Roughly 1.5–3 kΩ. An open circuit means the hair-fine coil wire has broken.' },
          { q: 'On the µA range, a healthy analog movement draws:', options: ['Tens of µA, steadily', 'Well under 1 µA on average', 'Nothing, ever', 'About 100 mA'], answer: 1, explain: 'It sips well under a microamp, with tiny once-a-second spikes as the motor fires.' },
          { q: 'Good coil, good cell, but no current pulses means:', options: ['A flat battery', 'A dirty contact', 'A dead IC or crystal → replace the module', 'A magnetised balance'], answer: 2, explain: 'No pulses with a healthy coil points to the IC or crystal — replace the module.' },
        ],
        title: 'Test a quartz movement with a multimeter',
        summary: 'Coil resistance, current draw, and where the fault really is.',
        level: 'Advanced',
        time: '25 min',
        tools: ['Multimeter', 'Fine probes', 'Fresh cell'],
        intro:
          'When a fresh cell and clean contacts don’t revive a quartz watch, a multimeter tells you whether the coil, the drive, or the whole module is at fault — before you spend on a replacement.',
        steps: [
          { title: 'Confirm the cell under load', body: 'Set the meter to DC volts and measure the fitted cell in circuit. A healthy silver-oxide cell reads about 1.55 V; much below 1.5 V and it’s tired. A cell that reads fine out of the watch but sags in it points to a short downstream.' },
          { title: 'Measure the coil resistance', body: 'Set the meter to resistance (kΩ) and touch the two ends of the motor coil. A good analog-quartz coil reads roughly 1.5–3 kΩ (some up to ~5 kΩ). An open circuit (OL / infinite) means the hair-fine winding has broken or corroded through — the commonest hard fault.', caution: 'The coil wire is finer than a hair. Touch only the coil terminals or pads, gently — never drag a probe across the winding.' },
          { title: 'Check the current draw', body: 'Set the meter to microamps (µA) and put it in series between the battery + and its contact. A healthy analog movement averages well under a microamp, with tiny once-a-second spikes as the motor fires. A steady, high draw (tens of µA or more) means a short or a failed IC.', tip: 'The AC (reset) pad on many modules briefly shorted to battery + resets the IC — worth trying before condemning a module that’s pulsing oddly.' },
          { title: 'Read the verdict', body: 'Good cell + good coil + normal current but no motion → a mechanical jam in the train, rotor, or hands (free it, don’t replace). Good cell but open coil → coil/module failed. Good coil but no current pulses → IC or crystal failed. Every “electronics dead” path ends in a fresh module.' },
          { title: 'Know when not to bother', body: 'Most quartz modules cost less than an hour of your time, so component-level repair rarely pays. Test to (a) prove it isn’t just the battery or contacts, and (b) learn what failed — then swap the module.', tip: 'Analog quartz is largely immune to magnetism (there’s no balance wheel); a very strong field can stall the stepper, but demagnetising rarely helps — look to the coil and IC instead.' },
        ],
      },
      {
        id: 'quartz-corrosion',
        title: 'Clean up battery corrosion',
        summary: 'Rescue a movement after a battery has leaked.',
        level: 'Intermediate',
        time: '25 min',
        tools: ['Fibreglass pen', 'Rodico', 'Isopropyl alcohol', 'Blower', 'Tweezers'],
        intro:
          'A cell left in too long can leak, leaving crusty green or white deposits that stop the watch. Caught early, the movement is often saveable.',
        steps: [
          { title: 'Remove the old cell immediately', body: 'The longer a leaking cell sits, the further the corrosion spreads. Take it out and dispose of it properly.' },
          { title: 'Assess the damage', body: 'Light surface crust on the contacts is usually fixable. Corrosion that has eaten into circuit traces or under the coil often means the module is beyond saving.' },
          { title: 'Clean the contacts', body: 'Gently work a fibreglass scratch pen over the corroded contacts until bright metal shows, then lift residue with Rodico. A cotton swab with a little isopropyl alcohol helps on flat areas.', caution: 'Keep alcohol and abrasive dust away from the coil and IC. Blow debris away rather than pushing it into the movement.' },
          { title: 'Test with a fresh cell', body: 'Fit a new battery and check the watch runs and keeps time. If it stutters or stays dead despite clean contacts, replace the module.', tip: 'Prevention beats cure: change quartz batteries promptly when they die, and don’t leave a dead cell in a stored watch.' },
        ],
      },
      {
        id: 'quartz-module',
        title: 'Swap a quartz movement (module)',
        summary: 'Replace a failed movement with a fresh one.',
        level: 'Intermediate',
        time: '40 min',
        tools: ['Movement holder', 'Hand-removal levers', 'Hand-setting tools', 'Dial protectors', 'Blower'],
        intro:
          'When the electronics fail, you replace the whole inexpensive module. The delicate part isn’t the module — it’s removing and refitting the hands without marking the dial.',
        steps: [
          { title: 'Match the replacement movement', body: 'Identify the calibre (e.g. Ronda 763, Miyota 2035) and buy the same one. Confirm the stem type and hand-hole sizes match, or you’ll need new hands.' },
          { title: 'Release the stem and lift the movement', body: 'With the back open, find the stem release (a dimple or lever), press it, and withdraw the crown/stem. The movement then lifts out of the case.', figure: 'stem', caption: 'Press the setting-lever detent, then pull the stem free.' },
          { title: 'Protect the dial and remove the hands', body: 'Slide thin plastic dial protectors under the hands, then lift all three hands straight up with hand-removal levers, pulling evenly so nothing bends.', caution: 'Never lever against the bare dial. One slip leaves a permanent crescent scratch — the protectors are not optional.' },
          { title: 'Transfer the dial to the new module', body: 'Free the dial feet (small clamps or screws on the movement side), lift the dial, and fit it to the new module the same way.' },
          { title: 'Refit the hands in order', body: 'Press on the hour, then minute, then second hand with pushers sized just under each hole, leaving a paper’s thickness of clearance above the dial and checking each hand sits dead flat. Set all hands to 12 first so alignment is easy to verify.', figure: 'handremove', caption: 'Press straight down onto each arbor.', tip: 'Wind the time through 12:00 — hour and minute hands should meet exactly. If not, lift and re-index the offending hand.' },
          { title: 'Re-case, fit the stem, and test', body: 'Drop the movement back in, refit the stem, check timekeeping and hand clearance, then seal and close as in the battery lesson.' },
        ],
      },
      {
        id: 'quartz-identify',
        title: 'Identify a quartz calibre',
        summary: 'Find out exactly which movement you have.',
        level: 'Beginner',
        time: '10 min',
        tools: ['Loupe', 'Caseback opener'],
        intro:
          'You can’t order the right parts or module until you know the calibre. It’s usually printed right on the movement.',
        steps: [
          { title: 'Look for markings on the movement', body: 'With the back open, read the plastic module or plate — makers like Ronda, ISA, Miyota, and Seiko print the calibre number (e.g. “RONDA 763”) directly on it.' },
          { title: 'Note the maker’s style', body: 'Even without a number, the layout, battery position, and reset-pad markings often identify the family. Photograph it for reference.' },
          { title: 'Cross-check specs', body: 'Search the calibre for its data sheet: battery type, stem reference, hand sizes, and number of jewels. This tells you exactly what to buy.', tip: 'Save the calibre and battery code in this app’s Practice Log so you never have to open the watch again to remember it.' },
        ],
      },
      {
        id: 'quartz-solar',
        quiz: [
          { q: 'A Citizen Eco-Drive or Seiko Solar is powered by:', options: ['A silver-oxide battery', 'A rechargeable secondary cell charged by light', 'A mainspring', 'Mains power'], answer: 1, explain: 'A solar cell under the dial charges a rechargeable secondary cell — not a disposable battery.' },
          { q: 'Fitting an ordinary silver-oxide battery to an Eco-Drive is:', options: ['Fine, it’s the same size', 'A serious mistake — the watch tries to charge a non-rechargeable cell', 'Recommended for longer life', 'Only a problem in winter'], answer: 1, explain: 'The circuit will try to charge a primary cell, which can leak or vent and damage the movement.' },
          { q: 'A Seiko Kinetic generates power from:', options: ['Light', 'A rotor driving a tiny generator', 'Body heat', 'The crown only'], answer: 1, explain: 'Wrist motion spins a rotor that drives a generator, charging the storage unit.' },
          { q: 'An Eco-Drive whose seconds hand jumps in 2-second steps is telling you:', options: ['The module has failed', 'It needs recharging', 'The hands are loose', 'It is magnetised'], answer: 1, explain: 'That’s the insufficient-charge warning — put it in light before assuming a fault.' },
        ],
        title: 'Solar, Eco-Drive & Kinetic watches',
        summary: 'Rechargeable-cell watches — and the battery mistake that destroys them.',
        level: 'Intermediate',
        time: '25 min',
        tools: ['Caseback opener', 'Plastic tweezers', 'Correct secondary cell', 'Silicone grease'],
        intro:
          'Light-powered and motion-powered watches look like ordinary quartz, but they store their power in a rechargeable cell instead of a disposable battery. Treating one like a normal quartz watch is the fastest way to ruin it — so this lesson is as much about what not to do as what to do.',
        steps: [
          { title: 'Know the three families', body: 'Light-powered (Citizen Eco-Drive, Seiko Solar): a solar cell under a translucent dial charges a rechargeable cell. Motion-powered (Seiko Kinetic, and Autoquartz designs): a rotor spins a tiny generator that charges a storage unit. Both then run as ordinary analog quartz — same IC, coil, stepper and train you already know.', figure: 'solarcell', caption: 'The solar cell beneath a translucent dial, and the rechargeable cell it charges.' },
          { title: 'The one mistake that matters', body: 'The power source is a RECHARGEABLE secondary cell (or on older Kinetics, a capacitor) — never a silver-oxide primary battery. They can be the same physical size, which is exactly the trap. Fit a primary cell and the circuit will try to charge something that cannot be charged: it may leak, vent or corrode, and you can lose the movement.', caution: 'Never fit a standard SR/silver-oxide battery to an Eco-Drive, Solar or Kinetic watch. Order the correct rechargeable cell for that calibre — examples you will meet are Seiko/Citizen types such as MT920 and MT621, and older Kinetic capacitors — but always confirm against the specific calibre.' },
          { title: 'Read the symptoms before opening', body: 'A solar watch that runs in bright light but stops overnight, or an Eco-Drive whose seconds hand moves in 2-second steps, is telling you it is low on charge — that is a warning, not a fault. Leave it in daylight for a day or two first. A Kinetic that will not hold a reserve after plenty of wear points at a tired storage cell.', tip: 'Charge in bright indirect daylight rather than on a hot sunny windowsill — heat is harder on a movement than lack of light.' },
          { title: 'Replace the cell properly', body: 'Identify the calibre, order the matching secondary cell, and swap it exactly as you would a battery — clean contacts, handle by the edge, correct orientation, insulator in place. Many calibres then need the AC/reset pad briefly bridged so the IC restarts cleanly.' },
          { title: 'Reset and re-charge', body: 'After a power interruption some watches need an all-reset and the hands re-positioned to their zero references before they will run correctly — check the calibre’s procedure. Then give it a proper charge before judging whether the repair worked.' },
          { title: 'Care advice worth passing on', body: 'The real killer of these watches is a drawer. A solar watch left in the dark for years deep-discharges its cell and may never recover; a Kinetic left unworn does the same. Tell owners to wear them, or park a solar watch in daylight now and then.' },
          { title: 'Dispose of cells correctly', body: 'Rechargeable lithium cells and capacitors do not belong in general waste — recycle them like any lithium battery. And treat a swollen or leaking cell as damaged: bag it, do not puncture it.', caution: 'A cell that looks swollen has already failed. Handle it by the edges, bag it, and recycle it — never try to “test” it in another watch.' },
        ],
      },
    ],
  },

  /* ============================================================ */
  {
    id: 'mechanical',
    name: 'Mechanical Movement Skills',
    icon: 'gear',
    accent: 'brass',
    blurb:
      'The craft of traditional watchmaking. These skills are more demanding and more rewarding — take them slowly, and respect the stored energy in the mainspring.',
    lessons: [
      {
        id: 'mech-letdown',
        title: 'Safely let down the mainspring',
        summary: 'Discharge stored power before you touch anything.',
        level: 'Intermediate',
        time: '10 min',
        tools: ['Movement holder', 'Fine tweezers', 'Peg wood'],
        intro:
          'A fully wound mainspring is a coiled spring under real tension. Disassembling a movement with power in it can wreck the train and fling parts. Always let it down first.',
        steps: [
          { title: 'Understand why this matters', body: 'Stored torque wants to spin the whole train at once. Remove a bridge with power still in the barrel and wheels can jump, teeth can bend, and the escapement can be damaged in an instant.', caution: 'This is the number-one safety step in mechanical work. Never remove the balance or train bridge with the mainspring wound.' },
          { title: 'Secure the movement', body: 'Mount the movement firmly in a holder so both hands are free and nothing can shift while you control the release.' },
          { title: 'Find the click', body: 'The click is the small pawl that locks the ratchet wheel and stops the mainspring unwinding. Letting down means easing this off under control.', figure: 'letdown', caption: 'Hold the crown, lift the click, and let the spring unwind slowly.' },
          { title: 'Let it down under control', body: 'Wind the crown slowly until the click is just about to ride over a ratchet-wheel tooth, and hold it there. Lift the click clear with pegwood or tweezers, then let the crown slip slowly back through your fingers as the spring unwinds — you’ll see the ratchet and crown wheels turn backwards.', caution: 'Do not just release the click — let the power out gradually. A sudden release sends the train spinning and can break pivots or teeth.', tip: 'Afterwards, remove the ratchet wheel to be doubly sure no power is left before you strip the movement.' },
          { title: 'Confirm it’s discharged', body: 'When the crown no longer pulls back and the balance won’t restart, the power is out. Now the movement is safe to disassemble.' },
        ],
      },
      {
        id: 'mech-uncase',
        title: 'Remove the movement from the case',
        summary: 'Get the movement out safely for work.',
        level: 'Intermediate',
        time: '15 min',
        tools: ['Movement holder', 'Screwdrivers', 'Blower', 'Finger cots'],
        intro:
          'Before any movement work, you must free it from the case — and that hinges on working out how it’s held and releasing the stem without forcing anything.',
        steps: [
          { title: 'Back-loader or front-loader?', body: 'First decide how the movement comes out. Most watches are back-loaders — the movement drops out the back once the stem is released. Some are front-loaders: you remove the bezel and crystal and lift the movement out from the dial side. A plain gasketed caseback with a movement that won’t drop free is the tell-tale of a front-loader.' },
          { title: 'Open the back and let down the power', body: 'Open the caseback and, for anything beyond a quick look, let down the mainspring first (previous lesson). Work dial-up over a clean tray so nothing that springs loose escapes.' },
          { title: 'Find the stem release', body: 'Beside the stem, find the setting-lever screw or the push-detent. A screw type loosens one to two turns; a push type is pressed while you gently pull the crown. Leaving the crown pushed fully in (winding position) usually releases most cleanly.', figure: 'stem', caption: 'Setting-lever screw (turn) vs push detent (press).', caution: 'Loosen the setting-lever screw only a turn or two. Undo it fully and the tiny screw and lever drop out and vanish into the carpet.' },
          { title: 'Withdraw the stem and crown', body: 'With the release actuated, pull the crown straight out; the stem comes with it. Keep the stem-and-crown together somewhere safe — they’re small, easily lost, and you’ll need them to refit.' },
          { title: 'Free the clamps or ring, and lift out', body: 'Some movements are held by casing clamps or screws; others sit in a plastic movement ring (spacer). Loosen the clamps or note how the ring seats, then ease the movement out — dial-up, into a holder. For a front-loader, remove the bezel and crystal first and lift the movement out from the dial side.', tip: 'Handle the movement by its edges with finger cots. Skin oils corrode plating and are surprisingly hard to remove later.' },
        ],
      },
      {
        id: 'mech-hands-dial',
        title: 'Remove & refit hands and dial',
        summary: 'The delicate art of hands without dial damage.',
        level: 'Advanced',
        time: '30 min',
        tools: ['Hand-removal levers', 'Dial protectors', 'Hand-setting tools', 'Tweezers', 'Loupe'],
        intro:
          'Hands are friction-fit onto tiny arbors and the dial sits on fragile feet. This is where patience pays — one slip shows forever.',
        steps: [
          { title: 'Protect the dial', body: 'Set the hands to a position you can reference (12:00) and slide thin dial protectors beneath them to shield the dial surface.', figure: 'illus:hands', caption: 'Hands, their concentric arbors, the hollow pushers, and the protector sheet.' },
          { title: 'Lift the hands straight up', body: 'Place hand-removal levers under the hands and press down on the protector, not the dial. The hands pop up evenly. Keep them in order — hour, minute, second — for refitting.', figure: 'handremove', caption: 'Levers pull the hands straight up off their arbors.', caution: 'Pull perfectly vertical. Any sideways force bends a hand or scores the dial. Never pry against the dial itself.' },
          { title: 'Release and lift the dial', body: 'Free the dial feet — either side-screws in the mainplate or press-clamps — then lift the dial straight off so the feet don’t bend.' },
          { title: 'Refit the dial', body: 'Line the dial feet into their holes, seat it flat, and re-lock the clamps or screws. Check it sits level with no gap.' },
          { title: 'Press the hands back on', body: 'For a centre-seconds watch fit hour, then minute, then the sweep second; for a sub-seconds dial fit the small seconds hand first. Use hollow hand pushers sized just under each hand’s hole, leaving a paper’s thickness of clearance above the dial, and check each hand is dead flat after fitting.', tip: 'Set the hour to 12 to judge hour/minute clearance, sight across the dial with a loupe so hands sit parallel, and run past 12:00 to confirm they never touch.' },
        ],
      },
      {
        id: 'mech-diagnose',
        title: 'Diagnose a mechanical watch',
        summary: 'Read the symptoms before you open anything.',
        level: 'Intermediate',
        time: '15 min',
        tools: ['Loupe', 'Timegrapher (optional)', 'Demagnetiser'],
        intro:
          'A mechanical watch tells you a lot before you pick up a screwdriver. Learn to read the symptoms and you’ll fix faster and open fewer watches unnecessarily.',
        steps: [
          { title: 'Won’t run at all', body: 'Fully wound but dead usually means a stopped train — dried oil, dirt, a knock that damaged a pivot, or a stuck balance. If it won’t wind either, suspect the mainspring or keyless works.' },
          { title: 'Runs then stops', body: 'A watch that runs when shaken but stops when still usually has low amplitude from old oil or wear — a service is due. If it stops only in certain positions (say dial-down but not dial-up), suspect a bent pivot, a dry or cracked jewel, or a hairspring fouling in that orientation.' },
          { title: 'Runs fast — check magnetism first', body: 'Gaining many minutes a day is classically magnetism: coils of the hairspring cling together and shorten it. Pass the watch over a compass — a twitching needle confirms it — then demagnetise before assuming anything is broken.', figure: 'demag', caption: 'Demagnetise first — it’s free and fixes many “fast” watches.' },
          { title: 'Runs slow or erratic', body: 'Losing time or a wildly variable rate points to dirt, dry pivots, worn parts, or a damaged hairspring. On a timegrapher, low amplitude (below ~250° fully wound) means the escapement isn’t getting enough power; a fat, fuzzy trace means an escapement or hairspring fault.' },
          { title: 'Seconds sweep but the hands don’t advance', body: 'If the balance runs and the seconds hand moves but the hour and minute hands stay put, the cannon pinion has lost its grip — a friction fit that needs tightening, not a train fault. (See “Cannon-pinion & hand friction”.)' },
          { title: 'Knocking, grinding, or rattling', body: 'A scraping automatic usually has a worn rotor bearing rubbing the caseback; a loose rattle can be a stray screw or a broken part adrift inside. Open and inspect before running it further.', tip: 'Note the exact symptom in the Practice Log before you start — it helps confirm you actually fixed the right thing.' },
        ],
      },
      {
        id: 'mech-mainspring',
        title: 'Barrel & mainspring service',
        summary: 'Inspect, replace, and grease the power source.',
        level: 'Advanced',
        time: '40 min',
        tools: ['Mainspring winder', 'Tweezers', 'Braking grease', 'Movement holder'],
        intro:
          'The barrel is the watch’s fuel tank. A tired or dry mainspring robs amplitude; servicing it restores the power reserve and a healthy beat.',
        steps: [
          { title: 'Open the barrel', body: 'With power let down and the barrel removed, prise off the barrel lid at its notch. Note the direction the mainspring is coiled before removing it.', figure: 'illus:mainspring', caption: 'The opened barrel: spring coiled around the arbor, with the lid lifted off beside it.', caution: 'Even a removed mainspring holds energy. Control it as it comes out — let it expand slowly, don’t let it whip.' },
          { title: 'Inspect the spring', body: 'Look for a “set” (permanently coiled) spring, kinks, or a broken bridle. A set spring gives weak amplitude and is worth replacing during a service. Modern springs are a rust-resistant alloy and rarely break — the old “don’t over-wind or you’ll snap the mainspring” warning dates from the carbon-steel era.' },
          { title: 'Choose the right replacement', body: 'Match the new spring’s height, thickness, length, and barrel diameter to the original. The wrong dimensions give the wrong power or won’t fit.' },
          { title: 'Grease and install', body: 'For automatics, apply braking grease to the barrel wall so the bridle can slip; wind the new spring in with a mainspring winder rather than by hand.', tip: 'Winding a mainspring in by hand risks kinking it and getting fingerprints (and rust) on the steel — a winder pays for itself.', figure: 'mainspringwinder', caption: 'A winder coils the spring under control before it goes into the barrel.' },
          { title: 'Reassemble the barrel', body: 'Lightly lubricate the arbor, refit it, and press the lid on squarely until it clicks. Spin-check that the arbor turns freely.' },
        ],
      },
      {
        id: 'mech-regulate',
        quiz: [
          { q: 'Before regulating, you should always:', options: ['Oil it', 'Demagnetise it', 'Replace the mainspring', 'Remove the balance'], answer: 1, explain: 'Magnetism makes a watch run fast and throws every reading off — rule it out first.' },
          { q: 'Healthy amplitude (dial-up, fully wound) is roughly:', options: ['90–120°', '270–310°', '360–400°', '45–60°'], answer: 1, explain: 'About 270–310° indicates a clean, well-oiled movement.' },
          { q: 'To make a watch run faster, move the index:', options: ['Toward “−”/R', 'Toward “+”/A (advance)', 'Toward the stud', 'It has no effect'], answer: 1, explain: 'Advance = faster; a tiny move (~0.25 mm) shifts the rate 20–30 s/day.' },
        ],
        title: 'Regulate the timekeeping',
        summary: 'Read a timegrapher and dial in the rate.',
        level: 'Advanced',
        time: '30 min',
        tools: ['Timegrapher', 'Movement holder', 'Fine screwdriver', 'Demagnetiser'],
        intro:
          'Regulating tunes how fast the watch runs. A timegrapher “listens” to the ticks and shows three numbers: rate, amplitude, and beat error.',
        steps: [
          { title: 'Understand the three readings', body: 'Rate (s/day): fast or slow — set with the index. Amplitude (°): how far the balance swings, a health indicator (~270–310° dial-up, fully wound); the timer needs the movement’s pallet lift angle to compute it (≈52° if unknown). Beat error (ms): symmetry of the swing, corrected at the moveable stud holder; lower is better.', figure: 'timegrapher', caption: 'Rate, amplitude, and beat error on the timegrapher.' },
          { title: 'Demagnetise first', body: 'A magnetised hairspring throws every reading off, often running very fast. Pass the movement through a demagnetiser before measuring so you’re not chasing a false fault.', caution: 'Skipping this wastes time: you can spend an hour “regulating” a watch whose only problem is magnetism.' },
          { title: 'Measure in a stable position', body: 'Fully wind the watch, place it dial-up on the timegrapher, and let the reading settle. Note the rate.' },
          { title: 'Adjust the regulator', body: 'Move the index a hair toward “+”/“A” (advance = faster, away from the stud) or “−”/“R” (retard = slower, toward the stud). Movements are astonishingly sensitive — shifting the index just 0.25 mm can change the rate by 20–30 s/day, so nudge a fraction and re-measure.', figure: 'illus:balance', caption: 'What you’re adjusting: the balance, its hairspring, and the stud and regulator on the cock.', tip: 'Aim for a small daily gain (0 to +8 s/day). A watch running slightly fast is easy to live with; a slow watch is always “wrong”.' },
          { title: 'Check multiple positions', body: 'A good result holds up dial-up, dial-down, and crown-down. Full “adjusting” has three branches — position, isochronism (steady rate as the mainspring winds down), and temperature — and large swings between positions point to poise or escapement faults beyond simple regulation.' },
        ],
      },
      {
        id: 'mech-oiling',
        title: 'Introduction to oiling',
        summary: 'The right oil, in the right place, in the right amount.',
        level: 'Advanced',
        time: '20 min',
        tools: ['Watch oils', 'Oilers', 'Loupe', 'Rodico'],
        intro:
          'Lubrication is what makes a serviced watch run smoothly for years. Too little wears parts; too much migrates and gums up the works. Precision is everything.',
        steps: [
          { title: 'Different jobs, different oils', body: 'Fast-moving pivots take a thin oil (e.g. Moebius 9010); slower, higher-load wheels take a heavier oil (HP-1300/D5); the mainspring barrel and sliding keyless parts take grease. Using one lubricant everywhere is a classic mistake — the full chart is in the Reference oiling guide.' },
          { title: 'Aim for the oil sink', body: 'Jewels have a tiny cup (the oil sink) that holds a drop by surface tension. Place one small, consistent drop there — the goal is a clean bead, roughly a third to half of the sink.', figure: 'oiling', caption: 'One clean drop in the oil sink — never a flood.' },
          { title: 'Less is more', body: 'Excess oil spreads across the plate, attracts dirt, and starves the pivot it was meant to lubricate. If it looks generous, it’s too much.', caution: 'The escapement is oiled only on the pallet stones and escape-wheel teeth — never the roller (impulse) jewel or the hairspring. Wrong oiling here ruins timekeeping.' },
          { title: 'Work clean', body: 'Oil only fully cleaned parts, keep oilers scrupulously clean, and clean up any spill with Rodico or peg wood immediately.', tip: 'Follow a lubrication chart for your calibre. The Reference section has a general oiling guide to get you started.' },
        ],
      },
      {
        id: 'mech-crown-stem',
        title: 'Replace a crown & winding stem',
        summary: 'Fit a new crown and cut the stem to length.',
        level: 'Intermediate',
        time: '30 min',
        tools: ['Side cutters', 'Diamond file / oilstone', 'Pin vice', 'Thread-lock (Loctite 603)'],
        intro:
          'A lost crown or a stripped stem is a common repair. The fiddly part is choosing a matching crown and cutting the stem so the crown sits flush.',
        steps: [
          { title: 'Know the crown type', body: 'Four kinds: water-resistant (an O-ring inside the crown hugs a pendant tube), dust-proof (a sprung diaphragm presses the case), plain pocket-watch (neither), and screw-down (two or three seals, for divers). Replace like for like so the sealing still works.' },
          { title: 'Match crown & stem thread', body: 'Pick a crown of the right diameter and material, and match the stem thread — most movements of the last thirty years are “Tap 9” (some chronographs Tap 10/12). A crown gauge, or a set of known-tap crowns, lets you check.' },
          { title: 'Separate the old crown & stem', body: 'Hold the stem in a pin vice by its thickest, threaded part and unscrew the crown. If it resists it may be thread-locked — a little heat from a lighter breaks the bond.', caution: 'Grip only the strong threaded section in the pin vice; the thin squared end shears off easily.' },
          { title: 'Cut & fit the stem', body: 'Fit the new crown and stem loosely, offer it to the movement, and cut the stem 1–2 mm long, then file to final length — aim for a paper’s thickness of clearance between crown and case. Chamfer the cut end to remove the burr, add a tiny drop of Loctite 603, and screw the crown up tight.', tip: 'Cut long and test repeatedly — you can always take more off, but a short stem means starting over with a new one.' },
        ],
      },
      {
        id: 'mech-truing',
        title: 'True the balance wheel',
        summary: 'Bend a distorted balance rim back to flat and round.',
        level: 'Advanced',
        time: '25 min',
        tools: ['Truing calipers', 'Fine tweezers', 'Loupe'],
        intro:
          'A balance knocked out of shape wobbles and won’t keep time across positions. Truing bends the rim back until it runs flat and round on its staff — a classic, delicate hand skill.',
        steps: [
          { title: 'What “true” means', body: 'A true balance meets three conditions: the whole rim lies in a single plane, that plane is exactly perpendicular to the staff axis, and the rim is perfectly concentric with the staff. The first two are corrected “in the flat”, the third “in the round.”', figure: 'plate:balance-truing', caption: 'True in the flat (perpendicular to the staff) and true in the round (concentric).' },
          { title: 'Mount it in truing calipers', body: 'Set the balance in truing calipers so the conical part of the pivots supports the staff and the wheel turns on its own axis. Work under a loupe against good light.' },
          { title: 'True in the flat', body: 'Set the caliper’s index just over the rim and slowly rotate the balance, watching the slit of light between index and rim. Since the index is a fixed reference, a widening slit means the rim dips down there, a narrowing slit means it rises up. Even the two arms until the light stays constant all the way round.' },
          { title: 'True in the round', body: 'Now bring the index alongside the edge of the rim and rotate again. Where the gap opens the rim is flat/in; where it closes the rim bulges out. Coax the high and low spots until the rim runs perfectly concentric.' },
          { title: 'Bend gently', body: 'Grasp the rim between thumb and forefinger and ease it up, down, or sideways in tiny amounts, re-checking after every nudge.', caution: 'This is delicate advanced work — over-bending, or catching the hairspring, ruins the balance. Never touch the hairspring, and practise on scrap balances first.' },
        ],
      },
      {
        id: 'mech-threads',
        quiz: [
          { q: 'A steel screw snapped off in a brass plate can often be removed by:', options: ['Drilling it out with any bit', 'Soaking in hot alum solution', 'Heating it red hot', 'Magnetising it'], answer: 1, explain: 'Alum dissolves steel but leaves brass alone — the classic non-destructive rescue.' },
          { q: 'The commonest cause of chewed screw slots is:', options: ['Cheap screws', 'A driver blade that doesn’t fit the slot', 'Too much oil', 'Cold weather'], answer: 1, explain: 'Match the blade width and thickness to the slot, and dress the tip flat — that prevents most damage.' },
          { q: 'A stripped thread in a case or plate is best fixed by:', options: ['Using a bigger screw at random', 'Tapping to the next size or fitting a plug and re-cutting', 'Gluing the screw in', 'Ignoring it'], answer: 1, explain: 'Either re-cut a clean larger thread or plug the hole and drill and tap it fresh.' },
        ],
        title: 'Broken screws & damaged threads',
        summary: 'Extract a sheared screw and rescue a stripped hole.',
        level: 'Advanced',
        time: '1 hr',
        tools: ['Alum', 'Pin vice', 'Taps & dies (horological)', 'Screw extractor', 'Penetrating oil'],
        intro:
          'Sooner or later you will shear a screw or strip a thread — usually a corroded caseback screw or an over-torqued case screw. Neither is a disaster if you know the rescues.',
        steps: [
          { title: 'Prevention, first', body: 'Almost all of this is caused by a driver that doesn’t fit. Match the blade width and thickness to the slot, dress the tip flat and square, and never force a corroded screw — a drop of penetrating oil and an hour’s patience beats a broken stub every time.', caution: 'Do not lean on a stuck screw. The moment it shears you have turned a five-minute job into an hour’s work, or a scrapped plate.' },
          { title: 'Free a stuck screw before it breaks', body: 'Apply penetrating oil around the head and leave it. Gentle warmth helps corroded case screws. Seat the largest driver the slot will take, press firmly straight down so the blade cannot ride out, and turn slowly. If the slot starts to deform, stop and reconsider.' },
          { title: 'The alum trick for a sheared steel screw', body: 'The classic rescue for a steel screw snapped off in a brass plate: make a hot, saturated solution of alum (potassium aluminium sulphate) and stand the part in it. Alum dissolves steel but leaves brass untouched, so the stub gradually disappears without touching the thread. It takes hours to days — check periodically.', tip: 'Warm the solution to speed it up, and remove the part as soon as the steel is gone. Rinse and dry thoroughly afterwards.', figure: 'screwextraction', caption: 'A sheared stub in a brass plate, and the alum bath that dissolves the steel and leaves the brass.' },
          { title: 'Mechanical extraction', body: 'If the stub stands proud, grip it in a pin vice or with fine pliers and back it out. If it is flush, a tiny centre punch and left-hand drill or a screw extractor can work — but drilling a hardened screw in a soft plate risks wandering into the thread, so alum is usually the safer first choice.' },
          { title: 'Rescue a stripped thread', body: 'Three options, in increasing order of effort: re-tap the hole to the next size up and fit a matching screw; fit a threaded insert; or plug the hole with a turned pin, then drill and tap it fresh at the original size. Watch threads are fine metric — the tap-size table on the Cheat-sheets page lists the common ones.' },
          { title: 'Broken stem in a crown', body: 'A stem snapped inside a crown is usually released by softening the thread-lock with gentle heat or a solvent, then unscrewing the stub with a pin vice. If the crown is worth saving and that fails, drill the stub out on a lathe; otherwise fit a new crown and stem.' },
          { title: 'Know when to stop', body: 'A plate with a wandering drilled hole is worth less than a donor movement. If extraction is going wrong, weigh the cost of a replacement part or donor against the risk of ruining a good plate — that judgement is part of the craft.' },
        ],
      },
    ],
  },

  /* ============================================================ */
  {
    id: 'service',
    name: 'Servicing a Movement',
    icon: 'tools',
    accent: 'brass',
    blurb:
      'The full walkthrough: strip a movement, clean it, oil it, and rebuild it to run like new. The summit of the mechanical craft — pairs with the Service Sequence diagram.',
    lessons: [
      {
        id: 'svc-overview',
        title: 'What a full service involves',
        summary: 'The whole job, start to finish, before you begin.',
        level: 'Advanced',
        time: '12 min',
        tools: ['Workbench', 'Good light', 'Parts trays'],
        intro:
          'A service means completely disassembling the movement, cleaning every part, replacing what’s worn, then reassembling with fresh lubrication. Here’s the shape of it.',
        steps: [
          { title: 'Why watches need servicing', body: 'Over years the oils dry and thicken, dirt accumulates, and dry pivots wear. Amplitude falls and timekeeping drifts. A service resets all of that.' },
          { title: 'The five phases', body: 'Assess → disassemble in order → clean → inspect & replace worn parts → reassemble with correct oils → test and regulate. The Service Sequence diagram maps the order.', figure: 'illus:service', caption: 'The five phases in one picture — the order a movement comes apart, and reverses to go back together.' },
          { title: 'Set realistic expectations', body: 'A first full service is a weekend project, not an evening. Start on a cheap, common movement you can buy spares for — never a valuable or sentimental piece.', caution: 'Servicing needs specific tools, cleaning fluids, and oils. Attempting it without them tends to make a running watch worse, not better.' },
          { title: 'Document as you go', body: 'Photograph each stage before removing parts. Those photos are your reassembly map when a bridge has three pivots to line up at once.', tip: 'Log the calibre and service date in the Practice Log so you know when the next one is due.' },
        ],
      },
      {
        id: 'svc-teardown',
        title: 'Disassembly in order',
        summary: 'Strip the movement following the correct sequence.',
        level: 'Advanced',
        time: '45 min',
        tools: ['Screwdrivers', 'Tweezers', 'Movement holder', 'Parts trays'],
        embed: 'assembly-reverse',
        intro:
          'A movement comes apart in a specific order so nothing is stressed and stored power is never trapped. Follow the sequence and lay parts out in order.',
        steps: [
          { title: 'Power down and remove dial-side parts', body: 'Let down the mainspring and remove the ratchet wheel to confirm no power is left. From the dial side, remove the hands, dial, motion works and keyless work — taking the keyless out now keeps the winding pinion and clutch captive so they can’t drop out later. See the Service Sequence diagram for the full order.', caution: 'The upper crown-wheel screw is usually a left-hand thread — turn it clockwise to undo, or you’ll shear it.' },
          { title: 'Remove the automatic works', body: 'On an automatic, lift the rotor and winding module off first — it’s the top layer over the movement proper.' },
          { title: 'Remove balance, then pallet fork', body: 'Take the balance and cock out first among the movement parts — it’s the most delicate, so get it safely out of harm’s way (turn it over to protect the pivots). Then remove the pallet fork, and the train can spin freely.', caution: 'Handle the balance by its cock, never the wheel or hairspring. Set it somewhere it can’t be knocked.', figure: 'illus:service', caption: 'The whole teardown as one stack — click each layer for what comes off and why.' },
          { title: 'Remove the train and barrel', body: 'Lift the pallet bridge, then the train and barrel bridges, then lift the wheels out in order: barrel, centre, fourth, third, escape. Keep every wheel with a note of where it came from.', figure: 'exploded', caption: 'Each layer lifts off in turn — keep them ordered.' },
          { title: 'Strip the keyless works', body: 'Finally remove the cannon pinion, motion and keyless works from the mainplate, leaving it bare and ready to clean.' },
        ],
      },
      {
        id: 'svc-clean',
        title: 'Cleaning the parts',
        summary: 'Get every part surgically clean before oiling.',
        level: 'Advanced',
        time: '30 min',
        tools: ['Cleaning machine / ultrasonic', 'Cleaning fluids', 'Baskets', 'Rodico', 'Pegwood'],
        intro:
          'Clean parts are the foundation of a good service. Fresh oil on a dirty pivot is worse than useless — it turns to grinding paste.',
        steps: [
          { title: 'Sort before cleaning', body: 'Keep the balance and any shock-jewel springs separate, and never put the mainspring or pallet/balance jewels through harsh cycles unnecessarily. Group screws so none are lost.' },
          { title: 'Run the cleaning cycle', body: 'Parts go into mesh baskets through cleaning fluid then rinses, usually in an ultrasonic or dedicated cleaning machine, and are dried thoroughly. No machine? Hand-clean in a jar of proper horological degreaser with a camel-hair brush — but avoid lighter fuel, which leaves an oily film that makes fresh oil spread and creep.', figure: 'cleaning', caption: 'Baskets keep parts contained through fluid and rinse.', caution: 'Some cleaning fluids attack shellac (which holds pallet/roller jewels) and certain balance materials. Check compatibility before immersing those parts.' },
          { title: 'Peg the jewels', body: 'Clean each jewel hole with sharpened pegwood to remove dried oil the machine missed — about a half turn is enough. A jewel must be spotless to hold fresh oil properly.', caution: 'Don’t overwork the pegwood in a hole; a broken shard is easy to snap off inside, and prising it out can crack the jewel.' },
          { title: 'Clean the balance separately', body: 'Dip the balance-and-cock assembly in degreaser by its cock hole, then gently puff it dry — never too hard, or the coils tangle.', caution: 'Never lift the balance more than about 1 cm away from its cock — any further stretches the hairspring and ruins it.' },
          { title: 'Handle dried parts cleanly', body: 'Once clean, handle only with clean tweezers and finger cots — a single fingerprint reintroduces oils and moisture you just removed.' },
        ],
      },
      {
        id: 'svc-oil',
        quiz: [
          { q: 'Which two parts are famously left DRY?', options: ['The barrel and mainspring', 'The roller (impulse) jewel and the hairspring', 'The train pivots', 'The keyless works'], answer: 1, explain: 'A trace of oil on the roller jewel or the hairspring wrecks timekeeping.' },
          { q: 'The mainspring barrel wall gets:', options: ['Light oil', 'No lubricant', 'Grease (braking grease on automatics)', 'Pallet oil'], answer: 2, explain: 'Grease lets an automatic mainspring’s bridle slip so it can’t be over-wound.' },
          { q: 'A correctly oiled jewel shows:', options: ['A full puddle', 'A clear ring about a third of the oil sink', 'A dry pivot', 'Oil on the flat around the sink'], answer: 1, explain: 'Aim for a distinct ring, roughly a third of the sink — never a flood.' },
        ],
        title: 'Oiling chart & technique',
        summary: 'Lubricate each point with the correct oil.',
        level: 'Advanced',
        time: '35 min',
        tools: ['Watch oils & greases', 'Oilers', 'Loupe', 'Oiling chart'],
        intro:
          'Reassembly and lubrication go hand in hand: each part is oiled as it goes back. The principle is the right lubricant, at the right point, in the right tiny amount.',
        steps: [
          { title: 'Match oil to job', body: 'Three oils and two greases cover most work: light oil (e.g. Moebius 9010) for the escape/third/fourth wheel and balance pivots; heavier oil (HP-1300/D5) for the centre wheel, barrel arbor and motion work; pallet oil/grease (9415) for the escapement stones; grease (8301) for the keyless works; and mainspring grease (8200) for the barrel. The roller jewel and hairspring get nothing. See the Reference oiling chart for the full table.', tip: 'Decant a little oil into a cup — never oil straight from the bottle — and use a separate oiler for each grade to avoid cross-contamination.' },
          { title: 'Oil the train pivots', body: 'A small drop in each jewel’s oil sink — enough to form a clean bead, no more. Oil both the top and bottom jewels of each wheel.', figure: 'oiling', caption: 'A clean bead in the sink; wipe any overflow.' },
          { title: 'Lubricate the escapement correctly', body: 'The escapement is special: a trace of oil goes on the pallet stones (impulse faces) and the escape-wheel teeth — but the roller (impulse) jewel is never oiled. Getting this right is central to good timekeeping.', figure: 'illus:escapement', caption: 'Oil the pallet stones (3, 4) and escape teeth (1) — never the roller jewel (5).', caution: 'Over-oiling the escapement or getting oil on the hairspring will wreck amplitude and rate. This is the most precise oiling on the watch.' },
          { title: 'Grease the barrel & keyless', body: 'Braking grease on the barrel wall (automatics), a little grease on the mainspring, and grease on the sliding pinion, yoke, and setting parts for smooth winding and setting.' },
        ],
      },
      {
        id: 'svc-shock',
        title: 'Service the shock protection',
        summary: 'Clean and oil an Incabloc or Kif setting without losing the spring.',
        level: 'Advanced',
        time: '20 min',
        tools: ['Fine brass tweezers', 'Rodico', 'Degreaser', 'Automatic oiler', 'Pegwood'],
        intro:
          'The balance pivots run in spring-mounted cap jewels — Incabloc, Kif and similar — that let the balance survive knocks. They must be opened to clean and oil, carefully, because the springs love to escape.',
        steps: [
          { title: 'Know the setting', body: 'A shock setting holds a chaton (with the hole jewel) and a capped end-stone on a tiny spring. Incabloc uses a hinged lyre-shaped spring; Kif uses a three-leaf “clover” spring. Both let the jewel shift under impact and spring back, sparing the fragile balance-staff pivots.', figure: 'illus:shock', caption: 'The setting exploded: spring, cap jewel, hole jewel in its chaton, and the pivot they protect.' },
          { title: 'Release the Incabloc spring', body: 'With fine brass tweezers, gently tease each prong of the lyre spring toward the other, one at a time, and hinge it back — no more than about 80°. Park a small blob of Rodico behind it so it can’t fall out of the setting.', caution: 'Press only at the very end of the spring, and open it just enough. These springs bend or snap easily and are miserable to refit.' },
          { title: 'Release a Kif spring', body: 'For a Kif clover spring, use a Kif tool (or a pegwood tool bored to the spring’s size with a screwdriver): press down lightly and twist so the wings escape through the cut-outs in the setting.' },
          { title: 'Lift & clean the jewels', body: 'Lift the chaton out with a tapered point of Rodico (tweezers risk pinging it away), then drop the chaton and end-stone into degreaser for a few minutes — they usually separate into two parts.', tip: 'Keep the chaton, end-stone and spring apart from the rest of the watch — they stick to other parts and vanish.' },
          { title: 'Oil the cap jewel & refit', body: 'Put a small drop of light oil (9010) on the end-stone so it forms a ring where the pivot sits, refit the chaton, then hinge or clip the spring home. Check the balance has a little end-shake and runs freely.' },
        ],
      },
      {
        id: 'svc-auto',
        quiz: [
          { q: 'Reverser wheels should be lubricated with:', options: ['Heavy grease', 'A specific dip lubricant (e.g. Lubeta V105)', 'Braking grease', 'Nothing at all'], answer: 1, explain: 'Reversers take a purpose-made dip lubricant; grease stops them freewheeling.' },
          { q: 'A scraping noise as an automatic is moved usually means:', options: ['Low amplitude', 'A worn rotor bearing letting the weight touch the caseback', 'A flat battery', 'A loose hairspring'], answer: 1, explain: 'Rock the rotor to check for play — a worn bearing lets it foul the back.' },
          { q: 'Seiko’s Magic Lever differs from a Swiss reverser because it:', options: ['Uses light', 'Uses a two-clawed pawl on an eccentric', 'Cannot wind both ways', 'Has no lubrication points'], answer: 1, explain: 'The pawl pushes and pulls the winding wheel, achieving the same one-way output differently.' },
        ],
        title: 'Service the automatic module',
        summary: 'Reversers, rotor bearings, and why an automatic winds poorly.',
        level: 'Advanced',
        time: '45 min',
        tools: ['Dip lubricant (reversers)', 'Cleaning machine', 'Loupe', 'Screwdrivers'],
        intro:
          'The automatic works sit on top of the movement and get blamed for a lot: poor winding, a short reserve, and that scraping noise owners notice first. Most of it comes down to two components — the reversers and the rotor bearing.',
        steps: [
          { title: 'Diagnose winding efficiency', body: 'A healthy automatic gains reserve from ordinary wear. If a serviced watch still runs down overnight, the fault is usually sticky reversers, a slipping mainspring bridle, or a rotor that isn’t turning freely — not the going train.' },
          { title: 'Check the rotor and its bearing', body: 'Rock the rotor gently: it should spin freely with no perceptible up-and-down play. Play, roughness or a scraping sound as the watch moves means a worn ball bearing or jewelled bushing — the rotor is touching the caseback. Check the rotor screw is tight while you’re there.', tip: 'That faint “sand in a tin” noise owners describe is almost always a worn rotor bearing, not a broken movement.' },
          { title: 'Replace a worn rotor bearing', body: 'Many modern automatics use a replaceable ball-bearing unit; on others the bearing is part of the rotor assembly and the whole rotor is replaced. Fit the correct part for the calibre, seat it square, and re-check that the rotor spins freely and clears the caseback.' },
          { title: 'Clean the reversers — but don’t strip them', body: 'Reverser wheels are tiny one-way clutches with pawls inside. They are normally cleaned as complete units rather than dismantled — taking one apart usually ends with parts on the floor. Run them through the cleaning cycle and inspect that each still locks one way and freewheels the other.' },
          { title: 'Lubricate reversers correctly', body: 'Reversers take a specific dip lubricant (Lubeta V105 is the standard) — you dip the clean wheel, let the carrier evaporate, and the lubricant stays where it’s needed. Never use ordinary oil or grease: it gums the pawls and kills winding efficiency, which is the single commonest automatic complaint after a service.', caution: 'Grease on a reverser is the classic post-service fault — the watch winds worse than before you touched it.' },
          { title: 'Seiko’s Magic Lever is different', body: 'Seiko achieves the same one-way output with a two-clawed pawl lever on an eccentric rather than reverser wheels. It’s simpler and more forgiving: clean it, and lubricate the pawl tips, eccentric and reduction wheels with HP-1300 rather than a dip lubricant.', figure: 'illus:nh35', caption: 'The Magic Lever pawl (1) — Seiko’s alternative to reverser wheels.' },
          { title: 'Prove it before casing', body: 'Refit the module and give the rotor a few spins by hand: you should feel the ratchet advancing and see the barrel take up power. Better still, leave the watch on a winder or wear it a day and confirm the reserve actually builds.' },
        ],
      },
      {
        id: 'svc-reassemble',
        title: 'Reassembly in order',
        summary: 'Rebuild the movement — the sequence in reverse.',
        level: 'Advanced',
        time: '60 min',
        tools: ['Screwdrivers', 'Tweezers', 'Movement holder', 'Pegwood'],
        embed: 'assembly',
        intro:
          'Reassembly runs the teardown backwards, oiling as you go. The fiddly art is getting every pivot to drop into its jewel before you tighten a bridge.',
        steps: [
          { title: 'Rebuild the mainplate up', body: 'Refit keyless and motion works, then the barrel and barrel bridge, oiling and greasing each point as it goes in.' },
          { title: 'Fit the train under its bridge', body: 'Set the wheels in place (a wheel drives a pinion, and the wheels get smaller from the barrel outward), then lower the train bridge and gently coax each pivot into its jewel before seating the screws. Tighten lightly, then puff air at the escape wheel — a free train spins for a few seconds and coasts to a gradual stop.', figure: 'illus:train', caption: 'The train laid out in order — barrel, centre, third, fourth, escape — each wheel driving the next one’s pinion.', caution: 'Forcing a bridge with a pivot out of its jewel snaps the pivot instantly — the most common self-inflicted service disaster. Patience here.' },
          { title: 'Fit the pallet fork, then power-check', body: 'Install the pallet fork and bridge. With a little power on the barrel, the fork should snap crisply side to side — proof the train is free.', tip: 'If the fork won’t snap over, the train is binding somewhere. Fix it now, before the balance goes in.' },
          { title: 'Install the balance last', body: 'Fit the balance and cock carefully, letting the hairspring settle flat and the impulse jewel engage the fork. The watch should spring to life.' },
          { title: 'Refit dial and hands', body: 'Once the movement runs, refit the dial and hands as in the hands-and-dial lesson, checking alignment through 12:00.' },
        ],
      },
      {
        id: 'svc-test',
        title: 'Final testing & regulation',
        summary: 'Prove the service worked before it goes back in the case.',
        level: 'Advanced',
        time: '30 min',
        tools: ['Timegrapher', 'Demagnetiser', 'Pressure tester'],
        intro:
          'A service isn’t finished when it runs — it’s finished when it runs well, in every position, and holds up over a day or two on test.',
        steps: [
          { title: 'Demagnetise and measure', body: 'Demagnetise, then check rate, amplitude, and beat error on the timegrapher. Healthy amplitude (fully wound, dial-up) is roughly 270–310°.' },
          { title: 'Check all positions', body: 'Measure dial-up, dial-down, and the crown positions. Consistent rate and amplitude across positions means a clean, well-oiled movement.' },
          { title: 'Time it in six positions', body: 'The full method: dial up, dial down, crown down, crown left, crown up, crown right (wristwatch work often uses five, dropping crown right). The spread between the best and worst position is the delta — the number that really describes a movement’s quality. A chronometer-grade result keeps the mean daily rate within roughly −4/+6 s/day; on a good serviced wristwatch, a delta of ten seconds or so is a fine outcome.', tip: 'A large delta between vertical positions points at poise, a bent pivot, or a hairspring fault — not at the regulator.' },
          { title: 'Check isochronism', body: 'Measure fully wound, then again after 24 hours. A movement that keeps its rate as the mainspring runs down is isochronous; a big change points to a tired mainspring, a barrel problem, or a hairspring that isn’t breathing evenly. That is a mainspring or hairspring conversation, not something the regulator can fix.' },
          { title: 'Regulate the rate', body: 'Adjust the regulator to a small daily gain (0 to +8 s/day) and, if fitted, correct beat error with the hairspring stud/adjuster.' },
          { title: 'Run it on test, then case & seal', body: 'Let it run 24–48 hours and re-check it holds. Then case the movement, fit fresh gaskets, close, and pressure-test before declaring it done.', tip: 'Log the final rate and amplitude in the Practice Log — it’s your baseline to compare against next time.' },
        ],
      },
      {
        id: 'svc-6497',
        embed: 'assembly',
        quiz: [
          { q: 'Why is the ETA/Unitas 6497 the classic movement to learn on?', options: ['It’s automatic', 'It’s big, simple, hand-wound and forgiving', 'It’s the cheapest quartz', 'It has no jewels'], answer: 1, explain: 'A large 16½-ligne pocket-watch calibre with widely-spaced parts — easy to handle and see.' },
          { q: 'The upper crown wheel screw is:', options: ['Left-hand thread', 'Glued', 'Right-hand thread', 'A rivet'], answer: 0, explain: 'It’s left-hand threaded — turn it clockwise to loosen, or you’ll cam it in and shear the slot.' },
          { q: 'Which surface is NEVER oiled?', options: ['Escape-wheel teeth', 'Barrel arbor', 'The hairspring and roller jewel', 'Centre-wheel pivot'], answer: 2, explain: 'Oil on the hairspring or roller jewel wrecks timekeeping — keep both bone dry.' },
          { q: 'A healthy 6497 runs at:', options: ['28,800 bph', '21,600 bph', '18,000 bph', '36,000 bph'], answer: 2, explain: '18,000 A/h — 2.5 Hz, a slow, visible five beats per second.' },
        ],
        title: 'Flagship service: the ETA/Unitas 6497',
        summary: 'A full, specific service of the classic learner movement — part names, oiling points, and specs.',
        level: 'Advanced',
        time: '3–4 hrs',
        tools: ['Movement holder', 'Screwdrivers', 'Tweezers', 'Cleaning machine or jars', 'Watch oils & oilers', 'Timegrapher'],
        intro:
          'The ETA/Unitas 6497 is the movement watchmaking schools hand you first, and for good reason: a big 16½-ligne (36.6 mm) hand-wound pocket-watch calibre, 18,000 A/h, 17 jewels, ~50-hour reserve, with large, widely-spaced parts you can actually see. The Chinese Seagull ST36/ST3600 is the common, affordable clone. This is a full service, mapped to real 6497 parts and specs — a worked example of everything in this track.',
        steps: [
          { title: 'Know the calibre', body: 'ETA/Unitas 6497-1: 36.6 mm × 4.5 mm, 18,000 A/h (2.5 Hz), 17 jewels, lift angle 53°, Incabloc shock, ~46–53 h power reserve, small seconds at 9 o’clock (the 6498 puts them at 6). Hand-wound — no rotor or reverser to complicate things.', figure: 'illus:eta6497', caption: 'The 6497 top plate — click each number to find the part you’ll be working on.' },
          { title: 'Let the power down first', body: 'Never strip a wound movement. Hold the click back with a fine screwdriver or pegwood and ease the crown to release the mainspring under control. Wait for it to run fully down before touching anything else.', figure: 'plate:depthing', caption: 'Power flows barrel → centre → third → fourth → escape.', caution: 'Let a barrel spring go free and it can launch parts across the room — control the let-down every time.' },
          { title: 'Balance and pallet fork out first', body: 'Remove the balance-and-cock as one unit, then the pallet fork and its cock. Getting the escapement out early protects the most fragile parts — the balance staff and hairspring — for the rest of the strip.', figure: 'plate:escapement-geometry', caption: 'The lever escapement: pallet fork, escape wheel, and roller.', caution: 'Lift the balance no more than a centimetre off its cock, or the hairspring stretches.' },
          { title: 'Ratchet, crown wheels and barrel bridge', body: 'Undo the ratchet-wheel and crown-wheel screws, then the barrel bridge, and lift the barrel out. Remember the upper crown-wheel screw is LEFT-hand threaded — clockwise to loosen.', caution: 'Left-hand thread: forcing it the “normal” way cams the driver out and shears the slot.' },
          { title: 'Train and keyless works', body: 'Remove the train bridge and lift the wheels in order — barrel, centre, third, fourth, escape. Then flip to the dial side to strip the keyless works (sliding pinion, yoke, setting lever, setting wheels), which stays captive from that side.' },
          { title: 'Clean everything', body: 'Run the parts through a proper watch degreaser (cleaning machine or jars), not lighter fuel. Peg out every jewel hole with pegwood given a half-turn, and blow parts dry. Inspect pivots and jewels under the loupe for wear or cracks before rebuilding.' },
          { title: 'Rebuild in order, then air-test the train', body: 'Mainplate → keyless works → barrel → train wheels → train bridge. Before fitting the pallet fork, blow on the escape wheel: a clean, free train should spin and gently rock back. Only then fit the pallet and, last, the balance.', tip: 'Watch the reassembly play out below, then map each generic step onto the 6497 parts you’re holding.' },
          { title: 'Oil to the chart', body: '9010 (light) on the balance and escape-wheel jewels and the fast train pivots; HP-1300 on the centre wheel, barrel arbor and keyless works; 9415 on the pallet stones and escape-wheel teeth; 8200 grease on the mainspring. A tiny touch of grease on the cannon pinion. The hairspring and roller jewel are never oiled.', figure: 'plate:lock-draw-impulse', caption: 'Only the pallet stones and escape teeth are oiled in the escapement.', caution: 'Over-oiling is as bad as none — oil spreads, attracts dirt, and floods pivots. One correct dot per point.' },
          { title: 'Regulate and case up', body: 'Demagnetise, then on the timegrapher aim for a small daily gain, amplitude 270–310° dial-up fully wound, and beat error under ~0.5 ms (correct it at the hairspring stud). Run it 24–48 hours, re-check, then case it. Because the 6497 is a display-back favourite, dress your bridges and blue your screws if you want it to look the part.', tip: 'Record the calibre, final rate, amplitude and beat error in the Practice Log as your 6497 baseline.' },
        ],
      },
      {
        id: 'svc-nh35',
        embed: 'assembly',
        quiz: [
          { q: 'The NH35 winds using Seiko’s:', options: ['Column wheel', 'Magic Lever pawl system', 'Fusee and chain', 'Rotor-less manual works'], answer: 1, explain: 'The Magic Lever — a two-clawed pawl driven by an eccentric — winds the barrel in both rotor directions.' },
          { q: 'Compared with the 7S26 it replaced, the NH35 adds:', options: ['A chronograph', 'Hacking and hand-winding', 'A tourbillon', 'A second barrel'], answer: 1, explain: 'The NH35 hacks (stop-seconds) and hand-winds — the two things the 7S26 famously lacked.' },
          { q: 'The barrel wall of an automatic like the NH35 gets:', options: ['9010 light oil', 'No lubricant', 'Braking grease so the bridle can slip', '9415 pallet grease'], answer: 2, explain: 'Braking grease lets the mainspring bridle slip at full wind so the auto can’t over-wind.' },
          { q: 'The NH35’s shock protection is:', options: ['Incabloc', 'Kif', 'Diashock', 'None'], answer: 2, explain: 'Seiko’s Diashock — remove and refit its lyre-shaped spring with the standard technique.' },
        ],
        title: 'Flagship service: the Seiko NH35',
        summary: 'A full service of the modder’s favourite automatic — Magic Lever, hacking, and its oiling map.',
        level: 'Advanced',
        time: '2–3 hrs',
        tools: ['Movement holder', 'Screwdrivers', 'Tweezers', 'Cleaning machine or jars', 'Watch oils & oilers', 'Timegrapher'],
        intro:
          'The Seiko NH35 (Time Module) is the automatic most people learn to service and mod on: cheap, tough, and a drop-in for a huge range of aftermarket cases. It winds with Seiko’s clever Magic Lever, hacks, and hand-winds — everything its 7S26 ancestor couldn’t. 24 jewels, 21,600 A/h, ~41 h reserve, date only (the NH36 adds a day). Because they’re inexpensive, buy two — one to learn on, one to keep.',
        steps: [
          { title: 'Know the calibre', body: 'Seiko/TMI NH35A: 27.4 mm × 5.32 mm, 21,600 A/h (3 Hz), 24 jewels, ~41 h reserve, hacking + hand-winding, Diashock shock protection, Magic Lever automatic winding, date only. Robust, forgiving, and cheap enough to practise on freely.', figure: 'illus:nh35', caption: 'The NH35 with its rotor off — note the Magic Lever pawl (1), the heart of Seiko’s winding.' },
          { title: 'Let down, then lift the automatic works', body: 'Let the power down first, then remove the oscillating-weight (rotor) and the automatic bridge that carries the Magic Lever and reduction wheels. Getting the winding module off first clears the top of the movement.', figure: 'plate:depthing', caption: 'Under the auto works sits an ordinary going train.', caution: 'Control the let-down — an automatic mainspring still holds real energy.' },
          { title: 'Balance and pallet fork out', body: 'Remove the balance-and-cock, handling the Diashock spring with the classic lyre-spring technique, then the pallet fork and its cock. Escapement out early keeps the most fragile parts safe.', figure: 'plate:escapement-geometry', caption: 'Lever escapement: pallet fork, escape wheel, roller.', caution: 'Lift the balance no more than a centimetre off its cock or the hairspring stretches.' },
          { title: 'Barrel, train and keyless works', body: 'Take off the barrel bridge and barrel, then the train bridge and wheels in order. Flip to the dial side to strip the keyless works and the date (calendar) mechanism, which stays captive from that side.' },
          { title: 'Clean everything', body: 'Degrease in a cleaning machine or jars — not lighter fuel — peg every jewel hole, blow dry, and inspect pivots and jewels under the loupe before rebuilding.' },
          { title: 'Rebuild and air-test the train', body: 'Mainplate → keyless → barrel → train → train bridge. Before the pallet, blow on the escape wheel: a clean, free train spins and rocks back. Then fit the pallet, the balance, and finally the automatic works.' },
          { title: 'Oil to the NH35 map', body: '9010 (light) on the balance and escape jewels and fast train pivots; HP-1300 on the barrel arbor, the Magic Lever and reduction wheels, and the keyless works; 9415 on the pallet stones and escape teeth; automatic braking grease on the barrel wall; a trace of grease on the date jumper. The hairspring and roller jewel stay dry.', figure: 'plate:lock-draw-impulse', caption: 'Only the pallet stones and escape teeth are oiled in the escapement.', caution: 'Braking grease goes on the barrel WALL, not the arbor — swap them and the auto either over-winds or won’t wind.' },
          { title: 'Regulate and case up', body: 'Demagnetise, then aim for a small daily gain, amplitude ~250–300° dial-up fully wound (3 Hz movements sit a touch lower than 4 Hz), and beat error under ~0.5 ms. Run it a day or two, re-check, then case it — often straight into a mod case.', tip: 'Log the amplitude and rate; it’s your baseline for the next NH35 you build.' },
        ],
      },
      {
        id: 'svc-2824',
        embed: 'assembly',
        quiz: [
          { q: 'The ETA 2824-2 regulates using an:', options: ['Etachron system', 'Swan-neck only', 'Free-sprung balance', 'Trimmer capacitor'], answer: 0, explain: 'The Etachron regulator and stud carrier make setting rate and beat quick once you learn them.' },
          { q: 'Its automatic winding is:', options: ['Unidirectional', 'Bidirectional via a reverser', 'Manual only', 'By Magic Lever'], answer: 1, explain: 'Reverser wheels rectify both rotor directions into one-way winding.' },
          { q: 'The 2824 is sold in grades that differ mainly in:', options: ['Size', 'Beat rate', 'Finishing and adjustment', 'Battery type'], answer: 2, explain: 'Standard, Elaboré, Top and Chronomètre differ in finishing, hairspring and how finely they’re adjusted.' },
          { q: 'The Sellita SW200-1 is best described as:', options: ['A quartz movement', 'A near-drop-in 2824 equivalent', 'A chronograph', 'A manual pocket calibre'], answer: 1, explain: 'The SW200 shares the 2824’s layout and much of its parts (with one extra jewel).' },
        ],
        title: 'Flagship service: the ETA 2824-2',
        summary: 'The Swiss standard automatic — reverser winding, the Etachron regulator, and a full service.',
        level: 'Advanced',
        time: '2–3 hrs',
        tools: ['Movement holder', 'Screwdrivers', 'Tweezers', 'Cleaning machine or jars', 'Watch oils & oilers', 'Timegrapher'],
        intro:
          'The ETA 2824-2 is the Swiss industry’s workhorse automatic — three-hand + date, hacking, hand-winding, bidirectional winding through a reverser, and an Etachron regulator that makes it a pleasure to time. Master this and most Swiss three-handers (and the near-identical Sellita SW200) follow. 25 jewels, 28,800 A/h, ~38–42 h reserve.',
        steps: [
          { title: 'Know the calibre', body: 'ETA 2824-2: 25.6 mm × 4.6 mm, 28,800 A/h (4 Hz), 25 jewels, ~38–42 h reserve, hacking + hand-winding, Incabloc shock, Etachron regulator. Sold in grades (Standard, Elaboré, Top, Chronomètre) that differ in finishing and adjustment, not in architecture.' },
          { title: 'Let down, then remove the automatic device', body: 'Let the power down, then lift the rotor and the automatic device — the reduction and reverser wheels that rectify rotor motion into one-way winding. The reverser is the clever heart of the auto works.', figure: 'plate:depthing', caption: 'Below the auto device is a standard going train.', caution: 'Control the let-down; a full 2824 barrel holds plenty of energy.' },
          { title: 'Balance and pallet fork out', body: 'Remove the balance-and-cock (note the Etachron stud carrier and regulator positions before you disturb them), then the pallet fork and cock. Handle the Incabloc spring with the usual technique.', figure: 'plate:hairspring-forms', caption: 'The hairspring runs between the Etachron regulator pins.', caution: 'Don’t nudge the Etachron studs while handling the balance — you’ll knock it out of beat.' },
          { title: 'Barrel, train and keyless works', body: 'Off with the barrel bridge and barrel, then the train bridge and wheels in order. Flip to the dial side for the keyless works and the calendar (date) mechanism.' },
          { title: 'Clean and inspect the reverser', body: 'Degrease everything properly. Pay special attention to the reverser wheels — sticky or gummed reversers are the classic 2824 winding complaint. Peg jewels, blow dry, and inspect under the loupe.', caution: 'Reverser wheels take a very light, specific oil (or a dip lubricant) — never a heavy grease, which stops them freewheeling.' },
          { title: 'Rebuild and air-test the train', body: 'Mainplate → keyless → barrel → train → train bridge. Air-test the free train on the escape wheel, then fit the pallet, the balance, and finally the automatic device.' },
          { title: 'Oil to the 2824 map', body: '9010 (light) on the balance and escape jewels and fast pivots; HP-1300 on the barrel arbor, keyless and slower wheels; 9415 on the pallet stones and escape teeth; braking grease on the barrel wall; a light, specific oil on the reverser wheels. Hairspring and roller jewel stay dry.', figure: 'plate:lock-draw-impulse', caption: 'Escapement oiling: pallet stones and escape teeth only.', caution: 'Over-oiling the reverser or barrel wall is a common 2824 mistake — it kills winding efficiency.' },
          { title: 'Regulate with the Etachron, then case up', body: 'Demagnetise, then use the Etachron regulator for rate and the stud carrier for beat, aiming for a small daily gain, amplitude 270–310° dial-up fully wound, and beat error under ~0.5 ms. Run it a day or two, re-check, then case, seal and pressure-test.', tip: 'Learning the Etachron feel here is the transferable skill — it’s on countless Swiss movements.' },
        ],
      },
    ],
  },

  /* ============================================================ */
  {
    id: 'restoration',
    name: 'Restoration & Bench Skills',
    icon: 'level',
    accent: 'violet',
    blurb:
      'The tier above servicing: correcting and replacing parts rather than just cleaning them. Staff replacement, poising, hairspring work, jewelling, pivot burnishing, escapement adjustment and case finishing. These need real tools — a staking set, a jewelling tool, a poising tool, a Jacot tool or lathe — so treat this as the map of where the craft goes next.',
    lessons: [
      {
        id: 'rest-staff',
        quiz: [
          { q: 'The safest way to remove an old balance staff is:', options: ['Punch it out from the top', 'Turn the rivet away on a lathe first', 'Lever it with tweezers', 'Heat the wheel'], answer: 1, explain: 'Turning the rivet away removes the grip without distorting the wheel; punching it out can dish the arms.' },
          { q: 'Before the staff can come out you must first remove:', options: ['The balance cock only', 'The roller and the hairspring', 'The pallet fork', 'The mainspring'], answer: 1, explain: 'Roller table off with a roller remover, hairspring collet off — the wheel must be bare.' },
          { q: 'After riveting a new staff you must always:', options: ['Oil the staff', 'Re-true and re-poise the balance', 'Demagnetise the staff', 'Shellac the rim'], answer: 1, explain: 'Riveting can distort the wheel; truing and poising afterwards is not optional.' },
        ],
        title: 'Replace a balance staff (staking work)',
        summary: 'The classic repair for a dropped watch — and your introduction to the staking set.',
        level: 'Advanced',
        time: '2 hrs',
        tools: ['Staking set', 'Roller remover', 'Collet remover', 'Lathe (ideal)', 'Loupe'],
        intro:
          'A dropped watch usually breaks a balance-staff pivot — the finest part in the movement. Replacing the staff is the classic bench repair, and the job that teaches you the staking set.',
        steps: [
          { title: 'Confirm the diagnosis', body: 'A balance that flops loosely, sits at the wrong height, or won’t run despite a clean movement points at the staff. Under the loupe, look for a snapped or bent pivot at either end. Check both ends — the one that looks fine is often the broken one.' },
          { title: 'Get the right staff', body: 'Staffs are calibre-specific and often come in variants. Identify the movement, then match the reference — or measure the old staff (overall length, pivot diameters, hub and rivet dimensions) with a micrometer against the replacement.', tip: 'Buy two. The first one you rivet is rarely the one that ends up in the watch.' },
          { title: 'Strip the balance', body: 'Remove the hairspring by lifting its collet with a collet remover (never by pulling the spring), then remove the roller table with a roller remover. The wheel must be completely bare before the staff comes out.', caution: 'Levering a collet or roller off with tweezers bends the hairspring or cracks the roller. Use the proper removers — they push against the staff, not the part.' },
          { title: 'Remove the old staff', body: 'Two methods. On a lathe: mount the staff and turn away the rivet until the wheel lifts off — safest, because nothing stresses the arms. With a staking set: support the wheel on a flat stump with a hole just clearing the hub, and drive the staff out with a flat punch. Quick, but it can dish the wheel.', caution: 'Never punch a staff out with the wheel unsupported or resting on its rim — you will bend the arms and spend longer truing than the whole job took.' },
          { title: 'Fit and rivet the new staff', body: 'Seat the wheel squarely on the new staff’s shoulder, support the staff in a stump that clears the lower pivot, and spread the rivet with a round-faced riveting punch — light taps, rotating the work, spreading the metal evenly outward. Finish with a flat punch to settle it. The wheel should be dead tight with no rocking.', figure: 'staking', caption: 'The staking set: wheel supported on a stump, riveting punch above.' },
          { title: 'Refit roller and hairspring', body: 'Press the roller on with the impulse jewel correctly oriented relative to the balance arms, then refit the hairspring collet. Both are friction fits — square and firm, not forced.' },
          { title: 'True, poise, and set the beat', body: 'Riveting almost always disturbs the wheel, so true it in the flat and round, then poise it (next lesson), then set the beat by rotating the collet so the impulse jewel lines up with the line of centres.', tip: 'Work in this order every time: true → poise → beat. Doing them out of order means doing them twice.' },
        ],
      },
      {
        id: 'rest-poise',
        quiz: [
          { q: 'Poising corrects errors that appear:', options: ['Only dial-up', 'Between the vertical positions', 'Only when fully wound', 'In the date change'], answer: 1, explain: 'An out-of-poise balance shows different rates in different vertical positions.' },
          { q: 'Before poising, the balance must already be:', options: ['Oiled', 'True in the flat and round', 'Magnetised', 'Shellacked'], answer: 1, explain: 'A wheel that isn’t true can’t be meaningfully poised — true first, always.' },
          { q: 'On a modern screwless Glucydur balance you should:', options: ['File the rim', 'Undercut a screw', 'Leave poising alone — it’s factory-set', 'Add washers'], answer: 2, explain: 'There is nothing designed to be adjusted; poising is done at manufacture.' },
        ],
        title: 'Poise the balance (static & dynamic)',
        summary: 'Kill positional error by balancing the wheel about its axis.',
        level: 'Advanced',
        time: '1–2 hrs',
        tools: ['Poising tool', 'Screw undercutter', 'Timegrapher', 'Fine tweezers'],
        intro:
          'If one part of the balance rim is heavier than the rest, gravity pulls on it differently depending on how the watch is held — so the rate changes between vertical positions. Poising removes that heavy spot.',
        steps: [
          { title: 'True first, always', body: 'Poising a wheel that isn’t true is wasted work. Confirm the balance is true in the flat and in the round (see “True the balance wheel”) before you start, and that it’s clean and completely dry — a fingerprint is a weight.' },
          { title: 'Static poising', body: 'Remove the hairspring and roller, then rest the bare balance on the parallel jaws of a poising tool. Let it settle: the heavy point rolls to the bottom every time. Rotate it a quarter turn and let it settle again to confirm the same point comes down.', figure: 'poising', caption: 'A bare balance rolling on the poising tool’s parallel jaws — the heavy point settles to the bottom.' },
          { title: 'Take weight off the heavy side', body: 'On a screwed balance, undercut the head of the screw at the heavy point with a screw undercutter, or swap in a lighter timing washer. Remove a very little, retest, repeat. On a modern screwless Glucydur balance there is nothing to adjust — poising is set at manufacture, so leave it alone.', caution: 'Never file the rim to poise a wheel. You destroy the balance’s truth, its finish and its value in one stroke.' },
          { title: 'Dynamic poising on the timegrapher', body: 'The refined method, done with the balance in the running watch. Fully wind it and read the rate in four vertical positions — crown up, down, left and right — at equal amplitude. The comparison is only valid if amplitude matches, so re-wind between readings.' },
          { title: 'Read the result and correct', body: 'The two extreme positions define the axis the heavy point lies on: it sits at the bottom in the slowest vertical position. Correct on that side, then re-measure — one small correction immediately confirms whether you had the direction right, and it’s far better to verify empirically than to trust the rule blindly.', tip: 'Chasing perfection here has diminishing returns. Getting the spread between vertical positions down to a few seconds a day is an excellent result on a wristwatch.' },
          { title: 'Know when it isn’t poise', body: 'Positional variation also comes from a bent pivot, a dirty or worn jewel, a hairspring rubbing, or an escapement fault. Rule those out first — poising a healthy wheel to fix someone else’s problem just wastes an afternoon.' },
        ],
      },
      {
        id: 'rest-hairspring',
        quiz: [
          { q: 'Coils that stick together most often mean:', options: ['The spring is stretched', 'The watch is magnetised', 'The collet is loose', 'The staff is broken'], answer: 1, explain: 'Always demagnetise before diagnosing a “sticky” hairspring — it’s free and fixes most cases.' },
          { q: 'Beat error is corrected by:', options: ['Bending the terminal curve', 'Rotating the collet (or moving the stud carrier)', 'Undercutting a screw', 'Re-riveting the staff'], answer: 1, explain: 'Beat is where the impulse jewel sits relative to the line of centres — set by the collet or stud carrier.' },
          { q: 'Vibrating a hairspring means:', options: ['Cleaning it ultrasonically', 'Matching its length to a balance so it beats at the right rate', 'Demagnetising it', 'Coiling it flat'], answer: 1, explain: 'You shorten the spring until the balance oscillates at the calibre’s designed frequency.' },
        ],
        title: 'Hairspring work: truing, centring & vibrating',
        summary: 'The most delicate skill on the bench — correcting, centring and matching a balance spring.',
        level: 'Advanced',
        time: '2–3 hrs',
        tools: ['Fine hairspring tweezers', 'Loupe or microscope', 'Vibrating tool', 'Demagnetiser'],
        intro:
          'The hairspring governs the rate, and it is the easiest part in the watch to ruin. This is the skill that separates a servicer from a watchmaker — approach it slowly, on scrap springs first.',
        steps: [
          { title: 'Rule out magnetism first', body: 'Coils clinging together look exactly like a distorted spring but are usually just magnetism, which makes the watch gain wildly. Demagnetise before you touch anything — you will fix a good number of “bent hairsprings” in ten seconds and without tweezers.' },
          { title: 'Learn what correct looks like', body: 'A good spring is flat (its coils lie in one plane, parallel to the balance and perpendicular to the staff), round (evenly spaced concentric coils), and centred (the collet dead central so the spring “breathes” symmetrically about the staff). Study a good one under magnification before you try to correct a bad one.', figure: 'plate:hairspring-forms', caption: 'Flat spring versus the Breguet overcoil.' },
          { title: 'Handle only at the ends', body: 'Touch the spring only at the collet or the stud, and support the work. Never grip a coil, never pull the spring, and never lift the balance more than about a centimetre off the cock — that alone stretches springs and is the commonest self-inflicted damage.', caution: 'Every correction is permanent. Bend a fraction, look, bend again — you cannot un-crease a hairspring.' },
          { title: 'True it in the round and flat', body: 'Work close to the fault with fine tweezers, correcting a little at a time and re-checking under the loupe. In the round: even coil spacing, no coil crowding its neighbour. In the flat: no dish or cone — the coils sit in one plane. Check that the outer coil clears the balance cock and the arms through the whole swing.' },
          { title: 'Centre the collet and set the beat', body: 'If the collet is off-centre the spring breathes unevenly and the rate changes with amplitude. Adjust so the collet is concentric with the staff, then set the beat by rotating the collet (or moving the stud carrier on a modern movement) until the impulse jewel sits on the line of centres at rest.' },
          { title: 'Vibrating a new spring', body: 'When a spring must be replaced, it has to be matched — “vibrated” — to its balance. Mount the balance and candidate spring in a vibrating tool alongside a master beating at the target rate, then shorten the spring progressively until the two swing together. Pin it at the stud at that length. An 18,000 A/h movement is five beats a second; 28,800 is eight.', tip: 'Vibrating is a proper skill and hard to rush. Many modern repairs sensibly fit a complete balance-and-spring assembly instead.' },
          { title: 'Know when to give up on a spring', body: 'Rust, a sharp kink, a coil that has been stretched, or a spring that has been repeatedly “corrected” is scrap. Fitting a fresh spring, or a complete balance assembly, gives a better watch than heroics on a ruined one.' },
        ],
      },
      {
        id: 'rest-jewel',
        quiz: [
          { q: 'What sets the end-shake when fitting a jewel?', options: ['The jewel diameter', 'The depth you press it to', 'The oil used', 'The stump size'], answer: 1, explain: 'Pressing depth positions the jewel — that’s what controls end-shake, so it’s set on the tool’s micrometer.' },
          { q: 'A cracked jewel usually shows as:', options: ['Better amplitude', 'A dark line under the loupe and oil that won’t hold', 'A fast rate only', 'A stiff crown'], answer: 1, explain: 'Look for the crack under magnification; a cracked jewel won’t retain its oil ring.' },
          { q: 'Vintage “rubbed-in” jewels differ because:', options: ['They are plastic', 'The metal bezel is burnished over the jewel', 'They need no oil', 'They are magnetic'], answer: 1, explain: 'The setting’s metal edge is burnished over the jewel, rather than the jewel being pressed in by friction.' },
        ],
        title: 'Jewelling: replace and re-set jewels',
        summary: 'Cracked, worn or missing jewels — and the tool that fits them.',
        level: 'Advanced',
        time: '1–2 hrs',
        tools: ['Seitz or Horia jewelling tool', 'Loupe/microscope', 'Assorted jewels', 'Micrometer'],
        intro:
          'Jewels are bearings, and bearings wear, crack and go oval. Replacing one properly is a matter of pressing the right jewel to exactly the right depth — depth is what sets end-shake.',
        steps: [
          { title: 'Diagnose the jewel', body: 'Under magnification look for a chip or a fine crack across the jewel, an oil ring that won’t stay put, a hole worn oval (the pivot has a sloppy side-shake), or a jewel that has shifted in its setting. Excessive side-shake with good pivots means the jewel, not the staff.' },
          { title: 'Understand the types', body: 'Modern movements use friction-set jewels pressed straight into the plate. Older and higher-grade work uses jewels in chatons held by screws, and vintage watches often have rubbed-in jewels where the metal bezel of the setting is burnished over the stone. Cap jewels (end-stones) sit above hole jewels in shock settings.' },
          { title: 'Set up the jewelling tool', body: 'Fit a pusher whose diameter matches the jewel’s outside diameter, and support the plate on a stump that clears the jewel hole without touching the jewel. Everything must be dead square — a tilted press cracks the stone or scores the plate.', caution: 'Never press on the jewel with an oversized pusher, and never support the plate on a stump that fouls the jewel. Both crack it instantly.' },
          { title: 'Push out, then press in', body: 'Push the old jewel straight out. Only ream the hole if you are deliberately fitting a larger-diameter jewel — otherwise the original hole is your reference. Press the new jewel in gently, stopping short of final depth.' },
          { title: 'Set the depth for end-shake', body: 'Refit the wheel and check end-shake — the tiny amount of vertical play in the arbor. Too little and it binds; too much and the rate suffers and the pivot can jump its jewel. Use the tool’s micrometer to advance the jewel a fraction at a time until the shake is just perceptible and free.', tip: 'End-shake you can just see under a loupe as the wheel is nudged, with no binding when the bridge is fully tightened, is about right.' },
          { title: 'Worn holes and bushing', body: 'If the hole in a plate or bridge itself is worn oval (common on old, unjewelled or brass-bushed pivots), it can be broached out and a bushing fitted, then jewelled — lathe and jewelling-tool work. Done well it’s invisible; done badly it moves the wheel out of depth.' },
          { title: 'Check the depthing after', body: 'A jewel fitted even slightly off-centre changes where the wheel sits, so re-check that the wheel meshes correctly with its neighbours and the train still runs free on the air test before you go further.', figure: 'plate:depthing', caption: 'Wheel and pinion must still just touch at the line of centres.' },
          { title: 'Correcting depth with a depthing tool', body: 'If a wheel and pinion mesh too deep or too shallow, a depthing tool lets you find the correct distance between their centres outside the watch: mount both on adjustable runners, roll them together, and set the spacing where they turn sweetly. That measurement is then transferred to the plate — by moving a jewel, re-bushing, or fitting a jewel with a different eccentric setting. It is a repair for a wrong-depth train, not something a healthy movement needs.' },
        ],
      },
      {
        id: 'rest-pivots',
        quiz: [
          { q: 'A Jacot tool is used to:', options: ['Press jewels', 'Support and burnish pivots', 'Wind mainsprings', 'Demagnetise'], answer: 1, explain: 'The arbor runs in a sized bed while the burnisher polishes and work-hardens the pivot.' },
          { q: 'Burnishing a pivot works by:', options: ['Cutting metal away like a file', 'Compressing and polishing the surface', 'Heating it', 'Coating it'], answer: 1, explain: 'A burnisher smooths and work-hardens the surface rather than cutting it — that’s why it isn’t a file.' },
          { q: 'A deeply scored or undersized pivot should be:', options: ['Burnished harder', 'Left alone', 'Replaced (new staff or arbor)', 'Oiled more'], answer: 2, explain: 'Burnishing can’t restore lost diameter; the part needs replacing.' },
        ],
        title: 'Pivot work: burnishing & the Jacot tool',
        summary: 'Restore worn pivots to a polished, free-running finish.',
        level: 'Advanced',
        time: '2 hrs',
        tools: ['Jacot tool', 'Pivot burnisher', 'Watchmaker’s lathe (ideal)', 'Microscope'],
        intro:
          'Pivots are the tiny polished ends of every arbor, running in the jewels. Rough, scored or rusty pivots drag, cost amplitude, and chew out jewels — burnishing brings them back.',
        steps: [
          { title: 'Inspect properly', body: 'Under high magnification a good pivot is straight, cylindrical, mirror-polished, with a correctly shaped (usually slightly domed) end. Look for scoring, rust pitting, a taper, or a bend. Roll the arbor on a flat surface to spot bends.' },
          { title: 'Set up the Jacot tool', body: 'The Jacot tool is a runner with a series of half-round beds, each sized for a pivot diameter. Choose the bed that just accepts the pivot, seat the arbor so its shoulder is supported, and drive it with a bow or hand wheel so it turns steadily under the burnisher.', figure: 'jacot', caption: 'The arbor lies in a bed sized to its pivot; the burnisher strokes along the top.' },
          { title: 'Burnish, don’t cut', body: 'A burnisher is a hardened, flat-faced tool that compresses and polishes rather than cutting. Stroke it along the pivot with light, even pressure while the arbor turns. The surface brightens and work-hardens; you are smoothing, not removing material.', caution: 'A file is not a burnisher. Filing a pivot undersizes it, and an undersized pivot is scrap — the part then needs replacing.' },
          { title: 'Know the limit', body: 'Burnishing fixes surface damage. It cannot restore lost diameter, straighten a badly bent pivot, or save a rust-pitted one. If the pivot is undersized, deeply scored or bent, replace the staff or arbor — or turn a new pivot on the lathe, which is proper lathe work.' },
          { title: 'Turning on the lathe', body: 'A watchmaker’s lathe with gravers lets you make what you can’t buy: a new pivot, a staff, a stem, a bushing. It’s a craft in its own right — sharp gravers, light cuts, constant measurement — and the natural next step once burnishing feels comfortable.', figure: 'lathe', caption: 'Headstock, collet, T-rest and graver — the tool that makes what you can’t buy.' },
          { title: 'Finish and re-check', body: 'Clean the pivot, re-fit the wheel, and check both side-shake and end-shake in its jewels. Then air-test the train: a well-burnished train spins freely and coasts to a gradual stop rather than stalling.', tip: 'Amplitude is the proof. If a clean, correctly oiled movement still runs low, suspect pivots and jewels before anything exotic.' },
        ],
      },
      {
        id: 'rest-shellac',
        quiz: [
          { q: 'Pallet stones and roller jewels are held with:', options: ['Epoxy', 'Shellac', 'Solder', 'Friction only'], answer: 1, explain: 'Shellac softens with gentle heat, letting stones be adjusted and re-set.' },
          { q: 'Why must shellacked parts avoid long soaks in alcohol-based cleaner?', options: ['They rust', 'Alcohol dissolves shellac and the stones fall out', 'They magnetise', 'They discolour'], answer: 1, explain: 'Shellac dissolves in alcohol — a long rinse can loosen pallet stones and roller jewels.' },
          { q: 'Too little lock on a pallet stone causes:', options: ['Better amplitude', 'The escapement to unlock unsafely', 'A slow rate only', 'Nothing'], answer: 1, explain: 'Insufficient lock means the escapement can trip and the watch stops or races.' },
        ],
        title: 'Escapement adjustment & shellac work',
        summary: 'Move pallet stones, set a roller jewel, and dial in lock and drop.',
        level: 'Advanced',
        time: '2 hrs',
        tools: ['Alcohol lamp or shellac warmer', 'Shellac flakes', 'Pallet stone pusher', 'Microscope'],
        intro:
          'Pallet stones and the roller jewel are set in shellac — a natural resin that softens with gentle heat. That is what makes the escapement adjustable, and what makes careless cleaning dangerous.',
        steps: [
          { title: 'Know what you’re adjusting', body: 'Lock is how far a tooth rests on the pallet stone before impulse; drop is the free travel between one tooth releasing and the next landing. Too little lock and the escapement can unlock unsafely; too much and you lose amplitude. Both are set by how far each stone stands out of the fork.', figure: 'plate:lock-draw-impulse', caption: 'Lock, draw and impulse — the three actions you are tuning.' },
          { title: 'Warm, move, cool', body: 'Hold the pallet fork in a warming holder over a gentle heat source until the shellac just goes glossy and soft — no more. Nudge the stone in or out a fraction with a stone pusher, then take the heat away and let it set. Work in tiny increments and re-check lock each time.', caution: 'Overheating burns shellac (it goes dark and brittle) and can crack the stone. Gentle warmth, brief contact — you want it tacky, not running.' },
          { title: 'Re-shellac a loose stone', body: 'If a stone has come out, clean the old shellac off both the stone and the slot, position the stone at the correct depth and angle, then touch a small flake of shellac to the joint while warm so it wicks in. Keep it out of the fork slot and off the impulse faces.' },
          { title: 'Set a roller jewel', body: 'A replacement impulse jewel is set the same way: warm the roller table, seat the jewel upright and correctly oriented, and secure it with a minimum of shellac. Check it passes cleanly through the fork slot and that the guard pin and crescent still give proper safety action.', tip: 'The roller jewel is never oiled — and stray shellac around it behaves exactly like a smear of dirt.' },
          { title: 'Banking pins and total travel', body: 'On older movements the banking pins limit how far the fork can swing. Moving them changes slide and total lock. Modern movements have fixed banking, so all your adjustment happens at the stones.' },
          { title: 'The cleaning trap', body: 'Shellac dissolves in alcohol. A long soak or rinse in alcohol-based cleaning fluid can loosen pallet stones and roller jewels — you reassemble a beautifully clean movement and find a stone rattling loose. Keep shellacked parts to short cycles in appropriate fluids, and inspect them after cleaning, every time.', caution: 'This catches people out constantly: the escapement was fine before the clean, and afterwards it isn’t. Always check stones after cleaning.' },
          { title: 'Verify on the timegrapher', body: 'Correct escapement adjustment shows up as a clean trace, equal lock on both stones, and better amplitude. If the trace is fat or the beat won’t settle, go back to lock, drop and safety action before blaming the balance.' },
        ],
      },
      {
        id: 'rest-case',
        quiz: [
          { q: 'The cardinal sin of case polishing is:', options: ['Using too little compound', 'Rounding off sharp edges and bevels', 'Working too slowly', 'Masking the case'], answer: 1, explain: 'Over-polishing softens the case’s original geometry — irreversible, and it destroys value.' },
          { q: 'A PVD or DLC coated case:', options: ['Polishes like steel', 'Cannot be polished — you remove the coating', 'Should be bead-blasted', 'Needs no care'], answer: 1, explain: 'Coatings are a surface layer; refinishing means stripping and re-coating.' },
          { q: 'A vintage dial should be cleaned with:', options: ['Soapy water', 'Alcohol on a swab', 'Nothing wet — a blower or soft brush only', 'Polish'], answer: 2, explain: 'Liquids destroy vintage dial finishes instantly and irreversibly.' },
        ],
        title: 'Case refinishing & dial ethics',
        summary: 'Restore a case without destroying it — and know when to leave things alone.',
        level: 'Intermediate',
        time: '1–2 hrs',
        tools: ['Abrasive papers', 'Abrasive pads', 'Masking tape', 'Polishing compound', 'Blower'],
        intro:
          'Refinishing is the easiest way to add value to a modern watch and the easiest way to destroy a vintage one. The technique matters, but knowing when not to do it matters more.',
        steps: [
          { title: 'Read the finishes first', body: 'Most cases combine brushed (satin) surfaces, polished (mirror) surfaces and bead-blasted areas, separated by crisp bevels. Map which is which before you touch anything, and photograph it. The goal is to restore each finish inside its original boundaries.' },
          { title: 'Preserve geometry above all', body: 'The mark of a badly polished case is soft, rounded lugs and vanished bevels. Work flat surfaces against a flat backing, mask adjacent facets, and use the least aggressive abrasive that will do the job — you cannot put metal back.', caution: 'Over-polishing is irreversible and obvious to any collector. A scratched but sharp case is worth more than a shiny, melted-looking one.' },
          { title: 'Brushing and polishing technique', body: 'For a brushed finish, work in a single consistent direction with an abrasive pad or paper, running the grain the way the factory did. For polished areas, work up through grits and finish with compound on a wheel — briefly, with light pressure, keeping the piece moving to avoid heat and dishing.', figure: 'refinishing', caption: 'Masked case, one surface brushed, the bevel polished — note the crisp line between finishes.' },
          { title: 'Know what you must not refinish', body: 'PVD, DLC and plated cases cannot be polished — you simply remove the coating, and the fix is stripping and re-coating. Titanium behaves differently from steel and marks easily. Gold-filled and gold-plated vintage cases have a thin layer that polishing goes straight through.' },
          { title: 'Vintage dials: hands off', body: 'Never put liquid on a vintage dial. Water, alcohol and cleaning solutions lift printing and destroy patina in seconds, irreversibly. Dust with a blower or a very soft brush and stop there. If a dial is genuinely damaged, that’s a specialist’s job, not a bench experiment.', caution: 'More vintage watches are ruined by a well-meant dial clean than by any mechanical fault.' },
          { title: 'Refinishing and bluing hands', body: 'Steel hands can be refinished: stone or lap the surfaces flat and polished, then heat-blue them. Bluing is done by heating clean, polished steel evenly — typically in a brass pan of sand or on a bluing tray — and watching the oxide colours run from straw through purple to the deep cornflower blue, then quenching at exactly the right moment. It takes practice and a spare set of hands to learn on, and the same technique blues screws for a display-back movement.', caution: 'Steel must be spotlessly clean and grease-free before bluing, and heated evenly — a fingerprint or a hot spot shows as a permanent patch of the wrong colour.' },
          { title: 'The ethics: patina, redials and disclosure', body: 'Collectors value originality over perfection: an honest, aged dial usually beats a refinished one, and a redialled watch loses most of its collector value. If you do refinish or relume, say so when you sell. Keep every original part with the watch — even the ones you replaced.', tip: 'Rule of thumb: reversible work (crystal polish, service, new gaskets) is always safe. Irreversible work (case polish, redial, relume) needs a good reason and disclosure.' },
        ],
      },
    ],
  },

  /* ============================================================ */
  {
    id: 'diagnostics',
    name: 'Diagnostics & Troubleshooting',
    icon: 'alert',
    accent: 'steel',
    blurb:
      'Symptom-first guides. Start from what the watch is doing wrong and follow the logic to the likely cause — before you ever pick up a screwdriver.',
    lessons: [
      {
        id: 'diag-stopped',
        quiz: [
          { q: 'For a dead quartz watch, check first:', options: ['The crystal', 'The battery and contacts', 'The coil', 'The motor'], answer: 1, explain: 'A fresh cell and clean contacts fix most stopped quartz watches.' },
          { q: 'A mechanical watch that won’t wind at all points to:', options: ['The balance', 'The mainspring or keyless works', 'The dial', 'The hands'], answer: 1, explain: 'No winding at all means the power path — spring or keyless works — is at fault.' },
          { q: 'To test a mechanical balance you should:', options: ['Poke it with tweezers', 'Puff air at it', 'Wind it hard', 'Shake the watch'], answer: 1, explain: 'Never touch the balance or hairspring — a puff of air shows if it swings freely.' },
        ],
        title: 'A watch that won’t run',
        summary: 'Work from power source outward to find the block.',
        level: 'Intermediate',
        time: '15 min',
        tools: ['Loupe', 'Tweezers'],
        intro:
          '“Dead” watches have a short list of causes. Check them in order — from energy source to oscillator — and you’ll isolate it quickly.',
        steps: [
          { title: 'Quartz: battery and contacts first', body: 'Fit a fresh cell and clean the contacts. That fixes most stopped quartz watches. If a good cell still won’t run, suspect the module.' },
          { title: 'Mechanical: is there power?', body: 'Wind it. If it won’t wind at all, the fault is in the mainspring or keyless works. If it winds but won’t run, the train or balance is stuck.' },
          { title: 'Look for an obvious jam', body: 'Under a loupe, look for a bent hand touching the dial or crystal, a loose part, or debris in the train. Hands fouling each other is a common, easy fix.' },
          { title: 'Give the balance a nudge', body: 'On a mechanical, gently puff air at the balance. If it swings and keeps going, the escapement is fine and the fault was elsewhere; if it won’t stay running, suspect dirt, dry oil, or damage.', caution: 'Never poke the balance or hairspring with tweezers to “start” it — use only a puff of air from a blower.' },
        ],
      },
      {
        id: 'diag-timekeeping',
        title: 'Runs but keeps bad time',
        summary: 'Fast, slow, or erratic — narrow it down.',
        level: 'Intermediate',
        time: '15 min',
        tools: ['Timegrapher', 'Demagnetiser'],
        intro:
          'A running watch with poor accuracy is usually one of a few classic problems. The pattern of the error is the clue.',
        steps: [
          { title: 'Consistently fast: magnetism', body: 'Gaining many minutes a day is magnetism until proven otherwise — the hairspring coils stick together and shorten it. Test by waving the watch over a compass: if the needle twitches, it’s magnetised. Demagnetise first — it’s free and instant.', figure: 'demag', caption: 'Rule out magnetism before anything else.' },
          { title: 'Slow, or dies when still', body: 'Losing time and low amplitude point to old, thick oil or worn pivots. The watch is asking for a service.' },
          { title: 'Erratic / position-dependent', body: 'Big swings between positions suggest a poise problem, a damaged hairspring, or escapement issues. A timegrapher trace reveals the pattern.' },
          { title: 'Small steady error: regulate', body: 'If amplitude is healthy and it’s just a little fast or slow, it simply needs regulating — see the mechanical regulation lesson.' },
        ],
      },
      {
        id: 'diag-water',
        title: 'Water got in — emergency steps',
        summary: 'Act fast to prevent rust and a ruined movement.',
        level: 'Beginner',
        time: '10 min',
        tools: ['Caseback opener', 'Blower', 'Silica gel'],
        intro:
          'Moisture inside a watch causes rust and corrosion within hours. Fast action can be the difference between a cheap fix and a dead movement.',
        steps: [
          { title: 'Recognise the signs', body: 'Fogging under the crystal, droplets, or a dial that looks damp all mean water has breached a seal.' },
          { title: 'Get it open and drying immediately', body: 'Open the caseback as soon as possible to let moisture escape and to stop rust forming on the steel movement parts.', caution: 'Every hour counts. Trapped water rusts pivots and springs quickly — don’t “wait and see”.' },
          { title: 'Dry gently', body: 'Sit the opened watch in a sealed tub with silica gel, or in gentle warmth (never high heat). Don’t bake it — heat damages seals, lubricants, and some dials.' },
          { title: 'Assess and service', body: 'Even after drying, water leaves the oils contaminated. A watch that got properly wet needs a service, and the gaskets must be replaced and re-tested.', tip: 'Afterwards, find out why it leaked — a tired gasket, an unscrewed crown — and fix the cause before trusting it near water again.' },
        ],
      },
      {
        id: 'diag-winding',
        title: 'Winding & setting problems',
        summary: 'Crown that won’t wind, won’t set, or feels wrong.',
        level: 'Intermediate',
        time: '12 min',
        tools: ['Loupe', 'Screwdrivers'],
        intro:
          'Crown faults almost always live in the keyless works — the small clutch and levers that switch between winding and setting.',
        steps: [
          { title: 'Winds but won’t set (or vice-versa)', body: 'The sliding pinion isn’t reaching one of its positions. Often the yoke or setting lever spring is worn, dislodged, or gummed up.' },
          { title: 'Crown spins freely, nothing happens', body: 'The clutch isn’t engaging, or on a manual the mainspring/ratchet is slipping or broken. Listen and feel for where the connection is lost.' },
          { title: 'Gritty or stiff action', body: 'Dried grease in the keyless works, or dirt. It needs cleaning and fresh grease on the sliding parts.', caution: 'Don’t power through a stiff crown. Forcing it can shear the tiny setting-lever parts or strip a stem.' },
          { title: 'Crown pulls all the way out', body: 'Usually the setting-lever screw has loosened. Often it’s a matter of re-seating the stem and re-tightening the setting lever a turn or two.', tip: 'If a stem won’t refit at all, the clutch is misaligned — rotate the crown slowly anticlockwise as you push it in and the gears will line up.' },
        ],
      },
      {
        id: 'diag-noise',
        title: 'Rattles, scraping & odd sounds',
        summary: 'What a noisy watch is trying to tell you.',
        level: 'Beginner',
        time: '8 min',
        tools: ['Loupe'],
        intro:
          'Sounds are diagnostic. A faint rotor whir is normal; a scrape or rattle is not. Learn to tell them apart.',
        steps: [
          { title: 'Rotor swish (normal)', body: 'A soft whirring as you move an automatic is just the rotor spinning — completely normal and nothing to fix.' },
          { title: 'Scraping on rotation', body: 'A gritty scrape as the rotor turns often means a worn rotor bearing letting the weight touch the caseback. It needs attention before it scores the movement.' },
          { title: 'Rattle when shaken', body: 'A loose rattle can be a detached rotor, a loose screw, or a broken part adrift inside — stop wearing it and open it to find the loose piece before it causes damage.', caution: 'A loose part rolling around the movement can jam the train or damage the balance. Don’t keep wearing a rattling watch.' },
          { title: 'Buzzing quartz', body: 'A faint buzz from a quartz watch can be a failing motor or loose coil — usually a sign the module is near the end of its life.' },
        ],
      },
      {
        id: 'diag-handfriction',
        title: 'Hands slip or set stiffly',
        summary: 'Diagnose and fix a loose or tight cannon pinion.',
        level: 'Intermediate',
        time: '15 min',
        tools: ['Cannon-pinion tool', 'Smoothing broach', 'Loupe'],
        intro:
          'The cannon pinion grips the centre arbor by friction — that grip is what lets you set the hands without stopping the train. Too loose and the hands slip; too tight and setting is stiff.',
        steps: [
          { title: 'Spot loose friction', body: 'A loose cannon pinion lets the hands jump with a knock, makes the watch seem to suddenly gain, lose, or stop, and gives almost no resistance when setting. It’s the more common of the two faults.' },
          { title: 'Spot tight friction', body: 'A tight cannon pinion makes setting stiff. On a watch with no hacking, turn the hands slowly backward: if the seconds hand stops instantly the friction is too tight; if it isn’t affected at all, it’s too loose.' },
          { title: 'Tighten a loose one', body: 'Support the bore with a smoothing broach so it can’t collapse, then squeeze a small dent into the cannon pinion’s waisted section with a cannon-pinion tool (a V-block and punch). Re-test — a little at a time.', caution: 'Always support the bore before denting, or you’ll crush the pinion. Over-tightening risks snapping the centre arbor off inside it.' },
          { title: 'Ease a tight one', body: 'A too-tight pinion is often just dry — clean and lightly lubricate it. If it’s worn or distorted, replace it rather than fight it.' },
        ],
      },
    ],
  },

  /* ============================================================ */
  {
    id: 'chrono',
    name: 'Chronographs & Complications',
    icon: 'clock',
    accent: 'violet',
    blurb:
      'The stopwatch and its cousins. How added functions work, how to use and set them correctly, and what to watch for when they go wrong.',
    lessons: [
      {
        id: 'chrono-how',
        quiz: [
          { q: 'The “brain” that sequences start/stop/reset is the:', options: ['Balance', 'Column wheel', 'Barrel', 'Rotor'], answer: 1, explain: 'Each push steps the column wheel; its columns route the operating levers.' },
          { q: 'Reset returns the counters to zero using:', options: ['Magnets', 'Heart-shaped cams', 'A spring only', 'The crown'], answer: 1, explain: 'Hammers drop onto heart cams, which rotate to their lowest point — exactly zero.' },
          { q: 'On most (non-flyback) chronographs, reset only when:', options: ['Running', 'Stopped', 'Winding', 'Fully wound'], answer: 1, explain: 'Resetting while running slams the hammers into moving parts and can break them.' },
        ],
        title: 'How a chronograph works',
        summary: 'Column wheel, clutch, and counters explained.',
        level: 'Intermediate',
        time: '12 min',
        tools: [],
        intro:
          'A chronograph is a stopwatch built on top of a normal movement. Three ideas — command, coupling, and counting — make the whole thing tick.',
        steps: [
          { title: 'Command: the column wheel', body: 'Each press advances the column wheel one step: the operating lever’s pawl gathers up one tooth and a jumper spring holds it there. The wheel’s raised columns (castellations) then lift and drop the operating levers, sequencing start → stop → reset. Cheaper two-push chronographs replace the column wheel with a flat cam.', figure: 'illus:chronograph', caption: 'The chronograph works — the red column wheel (1) commands every lever around it.' },
          { title: 'Coupling: the clutch', body: 'A driving wheel sits friction-tight on the fourth-wheel pivot and turns constantly. To start, the operating lever’s nose drops between two columns and swings an intermediate (coupling) wheel into mesh with the chronograph wheel, so the sweep hand runs. To stop, the column lifts the lever and pulls that wheel out of mesh. (Vertical-clutch designs instead clamp a disc, for a jitter-free start.)' },
          { title: 'Counting: runner & minute counter', body: 'The chronograph runner carries the big sweep-seconds hand. A finger on the runner steps the minute-counter wheel one tooth per revolution, and a jumper spring keeps the counter from drifting. Many chronographs add a brake that presses the runner at the stop position so it can’t creep before you read it.', figure: null },
          { title: 'Reset: hammers & heart pieces', body: 'Pressing reset drops spring-loaded hammers onto heart-shaped cams fixed to the runner and the minute counter; each cam spins to its lowest point — exactly zero — snapping the hands back instantly. Explore the Chronograph diagram to see it laid out.' },
        ],
      },
      {
        id: 'chrono-use',
        title: 'Using a chronograph correctly',
        summary: 'Operate the pushers without causing damage.',
        level: 'Beginner',
        time: '8 min',
        tools: [],
        intro:
          'Chronographs are robust if used as designed and easily damaged if not. A few habits keep yours healthy.',
        steps: [
          { title: 'The normal cycle', body: 'Top pusher starts, top pusher stops, bottom pusher resets to zero. Always reset only after stopping.' },
          { title: 'Don’t reset while running', body: 'On most chronographs, pressing reset while the chrono is running slams the hammers into moving parts and can bend or break them (a flyback chrono is the exception, by design).', caution: 'Stop the chronograph before resetting unless you know it’s a flyback. This single habit prevents the most common chrono damage.' },
          { title: 'Return hands to zero', body: 'Store the chronograph reset to zero, not left running. Leaving it running all the time adds wear and drains an automatic’s reserve faster.' },
          { title: 'If a hand doesn’t hit zero', body: 'A chrono hand that resets to just off-zero usually needs the hand re-fitted at the true zero position — a job for after servicing, done with the counter held at zero.' },
        ],
      },
      {
        id: 'comp-date',
        title: 'Setting date, day & GMT safely',
        summary: 'Quick-set complications without breaking them.',
        level: 'Beginner',
        time: '8 min',
        tools: [],
        intro:
          'Calendar and GMT complications are convenient but have their own setting rules. Break them and you’re into a movement repair.',
        steps: [
          { title: 'Respect the date danger zone', body: 'Never quick-set the date while the change is engaging (roughly 9 pm–3 am). Move the hands to 6 o’clock first.', figure: 'datezone', caption: 'Move hands clear of the danger zone before quick-setting.' },
          { title: 'Day-date order', body: 'Set both the day and date to yesterday with the quick-set, then advance the hands through midnight so both roll over naturally to today.' },
          { title: 'GMT hands', body: 'On a “true GMT”, the local hour hand jumps independently for travel; on an “office GMT”, the 24-hour hand is set via the date position. Know which you have before setting.' },
          { title: 'When in doubt, advance the hands', body: 'If a complication has no quick-set, simply run the hands forward through the days until it reads correctly — slow, but always safe.', tip: 'Perpetual and annual calendars have strict procedures — check the maker’s instructions before adjusting them.' },
        ],
      },
      {
        id: 'comp-calendar',
        title: 'Calendars, moonphase & perpetuals',
        summary: 'How date mechanisms work — and how to set them safely.',
        level: 'Intermediate',
        time: '12 min',
        tools: [],
        intro:
          'A calendar is a counting mechanism under the dial. The simplest kind must be corrected after short months; a perpetual “knows” month lengths and even leap years.',
        steps: [
          { title: 'Counting calendars', body: 'The hour wheel drives a wheel whose long tooth advances a 31-tooth date ring once a day, and a jumper spring snaps each date into place. Because it only counts to 31, it must be corrected after any month shorter than 31 days.', figure: 'illus:calendar', caption: 'The date works: numbered ring, driving wheel and finger, jumper, and quick-set.' },
          { title: 'Set it the safe way', body: 'Turn the hands until the date flips — that is midnight — then set the time. To reach a date, quick-set to the day before, then run the hands past midnight so it changes over naturally (which also fixes AM vs PM).', figure: 'datezone', caption: 'The date flipping tells you where midnight is.' },
          { title: 'Moonphase & day', body: 'A moon disc (often 59 teeth) is nudged one step a day; a sprung finger lets the hands run backwards without dragging the moon back. Handle calendar dials with extreme care — they usually can’t be restored if marked.' },
          { title: 'Perpetual calendars', body: 'A perpetual reads month length from a cam that turns once a year, with a Maltese-cross-style wheel tracking the four-year leap cycle — so it shows the 1st correctly, untouched, until 2100. Always follow the maker’s exact setting procedure and never force a jammed calendar.', caution: 'No oil on the date ring itself — oil only the jumper and lever bearings, very sparingly.' },
        ],
      },
      {
        id: 'comp-repeater',
        title: 'Repeaters — chiming the time',
        summary: 'How a watch strikes the hours, quarters, and minutes on demand.',
        level: 'Advanced',
        time: '10 min',
        tools: [],
        intro:
          'A repeater sounds the time on gongs when you operate a slide — the pinnacle of complication, and, as de Carle put it, “cool, calm, collected” work to service.',
        steps: [
          { title: 'The types', body: 'A quarter repeater strikes hours + quarters; a minute repeater adds the minutes. In between sit half-quarter and five-minute repeaters. A clock watch also strikes automatically in passing, like a striking clock.' },
          { title: 'How it sounds the time', body: 'Racks fall onto stepped snails whose heights encode the current hour and quarter; as each rack returns, its teeth lift hammers that strike tuned gongs — hours on a deep gong, quarters as a two-note “ting-tang”.' },
          { title: 'Its own power', body: 'Most repeaters generate the strike’s energy as you push the slide (a clock watch uses a separate barrel wound daily), so the chime has power independent of the going train.' },
          { title: 'Expert-level service', body: 'Dozens of tensioned levers and springs must be timed together, and an “all-or-nothing” piece prevents a half-wound, wrong chime. Study the action fully before dismantling.', caution: 'This is among the most demanding work in horology — build up through simple watches, automatics, and chronographs first, and leave fine repeaters to experienced hands.' },
        ],
      },
      {
        id: 'chrono-service',
        title: 'Servicing a chronograph',
        summary: 'The approach, cleaning, and assembly of the added mechanism.',
        level: 'Advanced',
        time: '20 min',
        tools: ['Movement holder', 'Screwdrivers', 'Tweezers', 'Glass brush', 'Pegwood'],
        intro:
          'Chronographs reward method and patience. The classic advice from de Carle still holds: first understand exactly what every part does — then the rest follows.',
        steps: [
          { title: 'Study the action first', body: 'Before touching a screwdriver, run the chronograph and watch it for a few minutes — start, stop, reset — until you know what each lever does. A craftsman who understands the action can rebuild a chronograph from a box of loose parts; that understanding is the whole secret.' },
          { title: 'Column wheel vs cam', body: 'Identify the switching system. A column wheel (a castellated wheel turned by a pawl) is the classic; two-push cam-switched chronographs are simpler and common. Valjoux and Venus are common column-wheel families, Landeron a common cam one — knowing yours tells you what to expect inside.' },
          { title: 'Dismantle systematically', body: 'Remove top parts first, never blindly. Relieve each lever spring by unscrewing a turn and easing it out of action before fully removing it, and keep every screw with its part.', caution: 'Do not touch the slotted eccentric studs — they look like screws but are precise depth adjustments; turning one throws the chronograph out of adjustment.' },
          { title: 'Clean the fine chrono wheel', body: 'The centre chronograph wheel has very fine teeth that trap dirt. After normal cleaning, brighten each tooth with a glass brush and peg every lever hole clean.', figure: 'cleaning', caption: 'Fine chronograph-wheel teeth need extra cleaning.' },
          { title: 'Reassemble & set the depth', body: 'Rebuild in reverse, oiling as you go with the correct chronograph greases. Set the chronograph-wheel depth on its eccentric so engagement is smooth with no stutter, then run start/stop/reset repeatedly to test.', tip: 'Attempt your first chronograph only once you’re comfortable with a simple service — and never on a valuable piece.' },
        ],
      },
    ],
  },

  /* ============================================================ */
  {
    id: 'build',
    name: 'Build Your Own Watch',
    icon: 'build',
    accent: 'brass',
    blurb:
      'Assemble a watch from parts — a movement, dial, hands, and case. The satisfying payoff that ties every other skill together.',
    lessons: [
      {
        id: 'build-plan',
        quiz: [
          { q: 'When planning a build, choose which part first?', options: ['The strap', 'The movement', 'The dial', 'The crystal'], answer: 1, explain: 'The movement is the hub — case, dial and hands must all fit it.' },
          { q: 'The classic build compatibility trap is:', options: ['Strap colour', 'Hand-hole sizes', 'Crystal tint', 'Case weight'], answer: 1, explain: 'Hands too big won’t grip, too small won’t fit — confirm exact sizes for your calibre.' },
          { q: 'A good beginner movement is the:', options: ['A minute repeater', 'ETA/Unitas 6497 (or Seiko NH35)', 'A tourbillon', 'A perpetual calendar'], answer: 1, explain: 'Big, cheap, forgiving and well-documented — ideal to learn on.' },
        ],
        title: 'Plan your build & choose parts',
        summary: 'Pick a movement and matching components.',
        level: 'Beginner',
        time: '30 min',
        tools: ['Digital calliper', 'Notepad'],
        intro:
          'A watch build is really a compatibility puzzle. Choose the movement first — everything else must fit it and the case.',
        steps: [
          { title: 'Choose the movement', body: 'For a first build pick a common, well-documented calibre — a Seiko NH35 automatic or a Ronda quartz, or the big hand-wound ETA/Unitas 6497 (or the cheaper Chinese Seagull ST25), the classic learner’s movement with large, forgiving parts. Availability of parts and tutorials matters more than prestige. Movements are identified by a maker’s letter or logo and a calibre number near the balance or under the dial (e.g. “UT 6497”, “ETA”, “FHF”).', figure: 'exploded', caption: 'A build is a stack: case, movement, dial, hands, crystal, back.' },
          { title: 'Match the case to the movement', body: 'The case must be made for your movement family, or you’ll fight movement rings and stem lengths. Note the case’s movement size and lug width.' },
          { title: 'Match dial and hands', body: 'The dial’s foot positions and diameter must suit the movement; the hands must match the movement’s hour/minute/second arbor sizes. These are quoted in millimetres — measure and cross-check.', caution: 'Hand-hole sizes are the classic build trap. Hands that are even slightly too big won’t grip; too small won’t fit. Confirm exact sizes for your calibre.' },
          { title: 'List everything and check it off', body: 'Write out movement, dial, hands, case, crystal, gaskets, stem, and crown. Confirm each part’s spec against the movement before ordering.', tip: 'Buy a spare set of hands and an extra gasket. Hands are easy to bend on a first build, and gaskets are cheap insurance.' },
        ],
      },
      {
        id: 'build-first-kit',
        title: 'Choosing a beginner kit',
        summary: 'Skip the sourcing headache with a matched kit.',
        level: 'Beginner',
        time: '10 min',
        tools: [],
        intro:
          'For a first build, a kit where the parts are already guaranteed to fit removes the biggest source of frustration — compatibility.',
        steps: [
          { title: 'Why a kit for the first build', body: 'A curated kit (movement, case, dial, hands, all matched) lets you focus on the assembly skills instead of the millimetre-matching puzzle.' },
          { title: 'What a good kit includes', body: 'Movement, case with correct crystal and gaskets, a dial and hands sized to the movement, and a stem/crown. Bonus if it names the exact calibre.' },
          { title: 'The Seiko “mod” route', body: 'A hugely popular path: start with a Seiko NH35/NH36 movement and mix aftermarket dials, hands, bezels, and cases designed for it. Enormous parts ecosystem and community guides.' },
          { title: 'Tools you’ll still need', body: 'Even with a kit you need a spring-bar tool, hand tools, a movement holder, and ideally a case press. See the Workshop track for the starter bench.', tip: 'Order a spare dial-side gasket and hands set — first builds often sacrifice a hand to the learning curve.' },
        ],
      },
      {
        id: 'build-dial-hands',
        title: 'Fit the dial & hands',
        summary: 'Mount the dial and install the hands aligned.',
        level: 'Intermediate',
        time: '45 min',
        tools: ['Movement holder', 'Dial protectors', 'Hand-setting tools', 'Tweezers', 'Blower'],
        intro:
          'This is the make-or-break stage cosmetically. Cleanliness and alignment are everything — every speck of dust will show under the crystal.',
        steps: [
          { title: 'Set up clean', body: 'Blow down the movement and dial, work with finger cots, and keep the dial face-down until the moment you fit it. Dust under the crystal is the most common build disappointment.', caution: 'Avoid getting anywhere near the hairspring or balance with tweezers. A snagged hairspring means starting over with a new balance.' },
          { title: 'Fit the dial to the movement', body: 'Seat the dial feet into their holes and lock them (side-screws or clamps). Confirm the dial sits flat and the date window, if any, lines up.' },
          { title: 'Fit the hour and minute hands at 12', body: 'With the movement set to exactly 12:00, press on the hour hand, then the minute hand, both pointing to 12. Use setting tools sized to each hub.', figure: 'handremove', caption: 'Press straight down onto the arbor.' },
          { title: 'Fit the second hand', body: 'The second hand presses onto the finest central arbor. It needs the gentlest touch — check it spins freely and doesn’t foul the minute hand.', tip: 'Advance the time through several hours and past midnight. Hands must never touch each other or the dial through the full range.' },
        ],
      },
      {
        id: 'build-case',
        title: 'Case the movement & fit the stem',
        summary: 'Install the movement and size the stem to the crown.',
        level: 'Intermediate',
        time: '30 min',
        tools: ['Movement holder', 'Side cutters / stem file', 'Screwdrivers', 'Blower'],
        intro:
          'Now the movement goes home. The one fiddly part is cutting the stem to the exact length so the crown sits flush.',
        steps: [
          { title: 'Seat the movement in the case', body: 'Fit the movement (in its ring if needed) into the case dial-up, aligned so the stem hole lines up with the case tube.' },
          { title: 'Measure and trim the stem', body: 'Fit the crown onto the stem, offer it up, and mark where to cut so the crown sits flush (about a paper’s thickness of clearance) when pushed in. Trim a little at a time — you can’t add length back. Chamfer the cut end to remove the burr, then secure the crown with a tiny drop of thread-lock (Loctite 603).', figure: 'stem', caption: 'Trim the stem so the crown seats flush — measure twice.', caution: 'Cut long and test repeatedly. A stem cut too short means buying a new one and starting the fit over.' },
          { title: 'Thread the crown and fit the stem', body: 'Thread the crown onto the trimmed stem (a dab of thread-lock helps), insert the stem into the movement, and confirm winding and setting work in every position.' },
          { title: 'Secure the movement', body: 'Tighten any casing clamps or screws so the movement can’t shift. Check the dial is centred and the hands still clear.' },
        ],
      },
      {
        id: 'build-seal',
        title: 'Seal & pressure-test',
        summary: 'Fit the crystal and back, then verify water resistance.',
        level: 'Advanced',
        time: '30 min',
        tools: ['Crystal/caseback press', 'Silicone grease', 'Gaskets', 'Pressure tester'],
        intro:
          'The final stage makes it a real, wearable watch — and confirms it will survive contact with water. Gaskets and testing are the difference between “assembled” and “finished”.',
        steps: [
          { title: 'Fit the crystal with its gasket', body: 'Seat the crystal gasket, place the crystal, and press it home squarely with a crystal press and the correct die. Even pressure prevents cracks and crooked seating.' },
          { title: 'Grease and fit the caseback gasket', body: 'Lightly coat the caseback O-ring with silicone grease and seat it in its groove. The film keeps the rubber supple and helps it seal without pinching.', figure: 'watertest', caption: 'A pressure tester confirms the seals before the watch meets water.' },
          { title: 'Close the caseback', body: 'Press or screw the back down evenly. For screw-in backs, make sure the threads start square so you don’t cross-thread the case.', caution: 'Never trust a water rating you haven’t tested. A new gasket that’s pinched or a hair of dust on the seat will still let water in.' },
          { title: 'Pressure-test', body: 'Run a dry (air-pressure) test, and a wet test if you have the kit, to confirm the seals hold. Only then treat the stated water resistance as real.', tip: 'No tester? Then treat the watch as splash-resistant only — keep it away from swimming and showers until it’s been properly tested.' },
        ],
      },
      {
        id: 'build-troubleshoot',
        title: 'Common build problems',
        summary: 'Fixes for the issues every first build hits.',
        level: 'Intermediate',
        time: '12 min',
        tools: ['Loupe', 'Blower', 'Hand tools'],
        intro:
          'Almost every first build hits one of these. Here’s how to recognise and fix them without starting over.',
        steps: [
          { title: 'Dust under the crystal', body: 'The classic. Re-open, blow everything down in a clean space, and reseat the crystal. Prevention: work fast and covered once the dial is exposed.' },
          { title: 'Hands touching or stopping', body: 'If the watch stops at a certain time, hands are fouling each other or the dial. Re-seat them at the correct heights, checking clearance through a full 12 hours.', caution: 'Hands that touch will stop the watch and can bend. Always test the full range before casing up.' },
          { title: 'Crown won’t sit flush / won’t wind', body: 'Almost always a stem cut slightly too long or too short, or not fully engaged. Re-measure and re-trim carefully.' },
          { title: 'Second hand not hitting markers', body: 'The seconds hand was pressed on off-centre or at the wrong second. Lift it and re-fit with the movement hacked at zero.', tip: 'Keep the Practice Log open as you build — noting each snag and its fix makes your next build far smoother.' },
        ],
      },
    ],
  },

  /* ============================================================ */
  {
    id: 'workshop',
    name: 'Workshop & Safety',
    icon: 'level',
    accent: 'emerald',
    blurb:
      'Set yourself up to succeed. A tidy bench, clean habits, and a few safety rules prevent most beginner disasters before they happen.',
    lessons: [
      {
        id: 'shop-setup',
        title: 'Setting up your bench',
        summary: 'The space and lighting that make fine work possible.',
        level: 'Beginner',
        time: '10 min',
        tools: ['Good light', 'Mat', 'Trays'],
        intro:
          'You don’t need a professional bench, but a few basics turn frustrating, error-prone work into calm, precise work.',
        steps: [
          { title: 'Light and magnification', body: 'Bright, glare-free light and a loupe or visor are non-negotiable — most beginner damage comes from simply not seeing clearly.', figure: 'illus:tools', caption: 'The bench kit — click each tool to see what it’s for and when you’ll reach for it.' },
          { title: 'A contained, light surface', body: 'Work on a light-coloured mat with a lip or a tray so dropped parts (which will happen) don’t roll away. Avoid carpet — parts vanish into the fibres; a dropped part is usually within a two-metre radius, and a stocking taped over a vacuum nozzle recovers it safely.' },
          { title: 'Sit at the right height', body: 'Set the bench high enough that you can almost rest your chin on it without hunching. That puts your eye level with the watch so you view it horizontally rather than from above, with your outstretched arms forming a rough “T”. Support your elbows and wrists — steady hands come from support, not tension.' },
          { title: 'Keep it clean', body: 'Dust is the enemy. Keep food, pets, and drafts away, and blow down your work area before opening a movement.', tip: 'A cheap silicone baking mat with a raised edge makes an excellent, catch-everything work surface.' },
        ],
      },
      {
        id: 'shop-handling',
        title: 'Handling parts & staying clean',
        summary: 'Habits that protect delicate components.',
        level: 'Beginner',
        time: '8 min',
        tools: ['Finger cots', 'Tweezers', 'Rodico'],
        intro:
          'How you touch, hold, and set down parts determines whether they survive. These habits become second nature fast.',
        steps: [
          { title: 'Never bare fingers on parts', body: 'Skin oils cause fingerprints and long-term corrosion. Use finger cots for handling components, cases, and dials.' },
          { title: 'Tweezers technique', body: 'Grip lightly and over as much of the part’s surface as you can — practise rotating the tweezers around a held screw without dropping it. Pick up a screw by its thread, close to the head, so you can balance it into its hole. Dress (smooth) your tweezer tips so they don’t mar or slip off parts.', caution: 'Springs and small levers fly. Keep a cupped hand or a clear box around the work, and expect to search the floor occasionally.' },
          { title: 'Dress your screwdrivers', body: 'A blade must fit the slot snugly — as wide as the screw and touching the slot bottom — or it chews the (mirror-polished) screw head and slips. Sharpen the tip on a stone to a rectangular profile: the taper about twice the blade width, the tip about a tenth of it. Rest your index finger’s middle joint on the swivel and steady your hand on the bench.' },
          { title: 'One part, one place', body: 'Put every screw and part in a tray in the order removed. Never let loose parts pile together — matching screws afterwards is a nightmare.' },
          { title: 'Clean tools, clean hands', body: 'Wipe tweezers and drivers before touching cleaned parts, and keep Rodico handy to lift dust and stray oil off surfaces as you go.' },
        ],
      },
      {
        id: 'shop-safety',
        quiz: [
          { q: 'The biggest physical hazard on the bench is:', options: ['The loupe', 'A wound mainspring', 'The tweezers', 'The mat'], answer: 1, explain: 'A mainspring stores real energy — let it down before disassembly and control it out of the barrel.' },
          { q: 'Sharp tools cause most cuts when you:', options: ['Cut away from yourself', 'Pry toward yourself', 'Use a cushion', 'Wear finger cots'], answer: 1, explain: 'Always cut and pry away from your hands.' },
          { q: 'Cleaning fluids and solvents need:', options: ['A sealed room', 'Ventilation and care', 'To be warmed', 'No precautions'], answer: 1, explain: 'Read labels, ventilate, avoid skin contact, and keep them away from heat and flames.' },
        ],
        title: 'Safety on the bench',
        summary: 'Protect yourself, and the watch, from harm.',
        level: 'Beginner',
        time: '8 min',
        tools: ['Safety glasses'],
        intro:
          'Watchmaking is low-risk, but a few hazards deserve respect — mainly stored spring energy, flying parts, and chemicals.',
        steps: [
          { title: 'Respect the mainspring', body: 'A wound mainspring stores serious energy. Always let it down before disassembly, and control mainsprings whenever they’re out of the barrel.', caution: 'A mainspring released carelessly can whip out, cut fingers, and destroy the part. This is the biggest physical hazard on the bench.' },
          { title: 'Protect your eyes', body: 'Tensioned springs and spring bars can launch toward your face. Safety glasses are cheap insurance, especially with chronographs and spring bars.' },
          { title: 'Handle chemicals sensibly', body: 'Cleaning fluids and solvents need ventilation and care — read the labels, avoid skin contact, and keep them away from heat and flames.' },
          { title: 'Sharp tools, careful cuts', body: 'Case knives and sharp tweezers cause most cuts, always when prying toward yourself. Cut and pry away from your hands, every time.' },
          { title: 'Vintage lume can be radioactive', body: 'Any watch made before roughly 1960 may carry radium lume, which stays radioactive essentially forever. It is safe behind glass, but dangerous as loose dust. Read the dedicated lesson below before you open a vintage watch.' },
        ],
      },
      {
        id: 'shop-radium',
        quiz: [
          { q: 'Radium lume is dangerous mainly when:', options: ['You look at the dial', 'Its dust is inhaled or swallowed', 'The watch is running', 'It gets cold'], answer: 1, explain: 'Intact lume behind a crystal is low risk; loose, flaking dust taken into the body is the real hazard.' },
          { q: 'A dial marked “T SWISS T” or “T<25” uses:', options: ['Radium', 'Tritium', 'Super-LumiNova', 'No lume'], answer: 1, explain: 'The T markings denote tritium — far weaker than radium, but still handled with the same care once flaking.' },
          { q: 'The one thing you must never do to a flaking radium dial is:', options: ['Photograph it', 'Dry-brush, blow or sand it', 'Store it in a bag', 'Leave it alone'], answer: 1, explain: 'Anything that makes airborne dust is exactly the hazard — never dry-brush, blow or abrade it.' },
        ],
        title: 'Radium & vintage lume safety',
        summary: 'How to handle radioactive dials and hands without taking a risk.',
        level: 'Beginner',
        time: '12 min',
        tools: ['Nitrile gloves', 'Disposable work surface', 'Sealable bags', 'Geiger counter (optional)'],
        intro:
          'Luminous dials made before about 1960 were painted with radium, and it is still radioactive today — radium-226 has a half-life of about 1,600 years. The risk is manageable and the precautions are simple, but you need to know them before you open your first vintage watch, not after.',
        steps: [
          { title: 'Know which lume you’re facing', body: 'Roughly: pre-1960s watches use radium. From the 1960s to the 1990s, tritium — dials marked “T SWISS T”, “T<25” or simply “T”. From about 1998 onward, Super-LumiNova and similar, which are not radioactive at all. If a vintage dial glows dimly under UV but never charges properly in light, treat it as radium until proven otherwise.' },
          { title: 'Understand the actual risk', body: 'Radium emits alpha particles, which cannot penetrate skin or a watch crystal — an intact dial in a closed case is a low risk to wear or handle. The danger is internal: if flaking lume becomes dust and you inhale it or transfer it to your mouth, that alpha source is now inside you, where it does real damage. Old radium also produces radon gas, which is why you never open a case in a sealed, unventilated room and put your face over it.' },
          { title: 'Never make dust', body: 'This is the whole discipline in one rule. Do not dry-brush, blow, scrape, sand or ultrasonically clean radium lume. Do not pick at flaking material “to tidy it up”. If lume has already shed onto the dial or inside the case, leave it undisturbed and decide whether the job is one for a specialist.', caution: 'Never use a dust blower on a radium dial and never put a radium dial or hands in a cleaning machine. Both do exactly the thing you are trying to avoid — make the material airborne.' },
          { title: 'Contain the work', body: 'Work over a disposable surface (a sheet of paper or a plastic mat you can bin), in a ventilated space, with nitrile gloves. Keep the dial and hands in a small, defined area. When you are done, fold the sheet inward, bag it, wipe the bench, and dispose of the gloves and covering.', figure: 'radium', caption: 'Disposable sheet, gloves, sealed bag and a survey meter — note the flaking lume on the dial.' },
          { title: 'No eating, drinking or smoking at the bench', body: 'The realistic route into your body is hand-to-mouth. Do not eat, drink, smoke or vape at the bench, do not touch your face, and wash your hands thoroughly afterwards even though you wore gloves. That single habit removes most of the risk.' },
          { title: 'Store and dispose of it sensibly', body: 'Keep loose radium dials and hands sealed in a bag or small container, and store them away from where you sleep or spend hours — a garage or workshop cupboard, not a bedside drawer. Do not casually bin radioactive parts; check your local regulations, as many places have specific disposal routes for radium-bearing items.', tip: 'A cheap Geiger counter settles the question in seconds and is a sensible buy if you work on vintage watches regularly.' },
          { title: 'Relume decisions', body: 'Never relume with radioactive material — modern Super-LumiNova is brighter, safer and standard. If you remove original radium lume, that is a job to do wet, contained, with proper protection, and many watchmakers reasonably decline it. Removing original lume also destroys originality, so weigh that before deciding (see “Case refinishing & dial ethics”).' },
          { title: 'Keep it in proportion', body: 'None of this means vintage watches are unsafe to own or wear. Millions of people wore radium watches daily; the people who were genuinely harmed were the factory dial painters who ingested it in quantity, day after day. Handle it with the precautions above and the risk to you is very small — but the precautions are not optional.' },
        ],
      },
      {
        id: 'shop-storage',
        title: 'Organising parts & screws',
        summary: 'Keep track of everything through a teardown.',
        level: 'Beginner',
        time: '8 min',
        tools: ['Parts trays', 'Small containers', 'Labels'],
        intro:
          'A movement has dozens of tiny, near-identical parts. Organisation is what lets you put it all back together — and find that one dropped screw.',
        steps: [
          { title: 'Compartment trays in order', body: 'Use a tray with sections and place parts in the order you remove them. Reassembly then simply runs backward through the tray.' },
          { title: 'Group and cover screws', body: 'Screws vary by fractions of a millimetre. Keep each group with its bridge, and cover trays (a clear lid) so a sneeze or a knock can’t scatter them.' },
          { title: 'Photograph before removing', body: 'A quick photo of each stage records exactly where every part and screw sat — your best reassembly reference.' },
          { title: 'Store projects safely', body: 'If a job spans days, store the covered tray somewhere dust-free and undisturbed, and note where you stopped.', tip: 'Log part numbers and where you sourced them in the Practice Log so re-ordering later is trivial.' },
        ],
      },
      {
        id: 'shop-sourcing',
        quiz: [
          { q: 'The first thing you need before ordering any part is:', options: ['The case size', 'The exact calibre', 'The strap width', 'The retail price'], answer: 1, explain: 'Parts are specified per calibre — without it you are guessing.' },
          { q: 'In the Swiss part-numbering system, 401 is:', options: ['The mainplate', 'The winding stem', 'The balance', 'The dial'], answer: 1, explain: '401 is the winding stem across Swiss calibres — the numbers are consistent between movements.' },
          { q: 'For an obsolete vintage calibre, the most practical source is often:', options: ['A modern replacement', 'A donor movement', 'A 3D print', 'The manufacturer'], answer: 1, explain: 'When new old stock has dried up, a scrap donor of the same calibre is usually cheapest and fastest.' },
        ],
        title: 'Sourcing parts & reading part numbers',
        summary: 'Find the right part, from the right supplier, at a sane price.',
        level: 'Intermediate',
        time: '15 min',
        tools: ['Micrometer', 'Loupe', 'Digital calliper'],
        intro:
          'Half of repair is knowing exactly what to order. Get the calibre and the part number right and the job is simple; guess, and you will buy the wrong thing twice.',
        steps: [
          { title: 'Start from the calibre, always', body: 'Every part is specified per calibre, so identify the movement first (see the Movement Guides and the calibre-identification lessons). Note the full designation — an ETA 2824-2 and a 2824 differ, and Seiko’s 7S26A, 7S26B and 7S26C are not identical.' },
          { title: 'Learn the Swiss numbering system', body: 'Swiss makers use a shared part-numbering scheme that stays consistent across calibres, so the number tells you the part regardless of movement. The one everyone learns first is 401 — the winding stem. Once you know a few, ordering becomes much faster and far less error-prone.' },
          { title: 'Japanese and in-house schemes', body: 'Seiko uses its own codes, usually tied to the calibre (a 4R36 part is listed under that calibre), and the same physical part often serves a whole family — NH35, NH36 and 4R36 share a great deal. Check compatibility lists before assuming a part is unique.' },
          { title: 'Genuine, generic, NOS or donor', body: 'Four routes. Genuine current parts: best, if available to you. Generic aftermarket: fine for many mechanical parts, variable for springs and jewels. New old stock (NOS): original, but ageing gaskets and lubricants. Donor movements: often the cheapest and only option for obsolete calibres, and you get a whole box of spares.', tip: 'For a discontinued vintage calibre, buying a scrap donor of the same movement is usually cheaper than chasing the single part you need.' },
          { title: 'Know the material houses', body: 'Established suppliers carry parts, tools and consumables — Cousins UK is the best-known in Britain, and there are equivalents in the US and elsewhere; some require a trade account, many do not. Beyond them: manufacturer service centres, specialist dealers, and the secondhand market for donors.' },
          { title: 'Measure when the number is unknown', body: 'For unmarked or generic parts, measure: a calliper for crystal diameter, case and lug widths; a micrometer for staff, stem and mainspring dimensions (height × thickness × length × barrel diameter). Record the numbers before you order.', caution: 'Never eyeball a mainspring or crystal size. A spring that is the wrong height or thickness gives the wrong power and can wreck the amplitude you just spent a service restoring.', figure: 'partsbench', caption: 'Measure before you order — calliper and loupe alongside the parts.' },
          { title: 'Buy a spare of the fragile things', body: 'Stems, balance staffs, mainsprings and crystals all have a habit of needing a second attempt. If shipping costs more than the part — which it usually does — order two the first time.' },
        ],
      },
    ],
  },
]

export function allLessons() {
  return TRACKS.flatMap((t) => t.lessons.map((l) => ({ ...l, trackId: t.id, trackName: t.name, accent: t.accent })))
}

export function getTrack(id) {
  return TRACKS.find((t) => t.id === id)
}

export function getLesson(lessonId) {
  for (const t of TRACKS) {
    const l = t.lessons.find((x) => x.id === lessonId)
    if (l) return { ...l, track: t }
  }
  return null
}
