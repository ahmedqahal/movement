// Make a Leather Strap — Part 1: foundations.
// Every step carries a `figure: 'strap:<id>'` drawn in components/strap.
// Numbers come from the course research (makers' forums, Decocuir, tool
// makers); where no source gives a value the text says it is this course's
// house standard.

export const FOUNDATIONS = [
  {
    id: 'sm-overview',
    part: 'Foundations',
    title: 'Start here: anatomy of a strap & the three rules',
    summary: 'Name every part, learn the thickness budget, and the three rules that explain every step after this.',
    level: 'Beginner',
    time: '15 min',
    tools: [],
    intro:
      'A master-made strap is a thickness problem solved with a knife. Before any leather is cut, learn what the parts are called, how much room the watch actually gives you, and the three rules that every one of the ten constructions in this course obeys. Each later step is one of these rules applied.',
    quiz: [
      { q: 'After skiving, a correctly made lug fold should be about:', options: ['Twice the strap thickness', 'One layer thick', 'Half a layer thick', 'Exactly the bar diameter'], answer: 1, explain: 'The doubled leather at the fold is skived until it is no thicker than a single layer, so the fold fits between bar and case.' },
      { q: 'Why is the long lining glued while the strap is curved?', options: ['It dries faster', 'So the strap is born curved and the top never wrinkles', 'To hide the stitch holes', 'It stops the dye bleeding'], answer: 1, explain: 'Bonding flat then bending forces the top into compression, which wrinkles it. Curving first builds the wrist curve into the laminate.' },
      { q: 'Which of these belongs in a flex zone?', options: ['A rivet', 'A stiff Texon strip', 'Glue in the bar channel', 'Nothing rigid at all'], answer: 3, explain: 'Folds and the bar channel flex every time the strap is worn. Anything rigid there cracks, peels or tears.' },
      { q: 'A strap with a chrome-tanned lining should get:', options: ['A burnished edge', 'A painted (or turned) edge', 'No edge finish', 'A waxed raw edge'], answer: 1, explain: 'Only firm veg-tan compresses and burnishes. Chrome linings, pull-up leathers, exotics and padded stacks are painted or turned.' },
    ],
    steps: [
      {
        title: 'The parts of a strap',
        body: 'A two-piece strap is a long piece (it carries the holes and tip) and a short piece (it carries the buckle and keepers). Each has a lug end that folds round a spring bar. The short piece ends in a buckle fold with a slot for the tongue, a fixed keeper sewn just behind the fold and a floating keeper that slides. Learn the names; every later step uses them.',
        figure: 'strap:anatomy',
        caption: 'A finished 20 → 18 mm pair, 120 / 80 mm, with every part named in English and French.',
      },
      {
        title: 'The workshop vocabulary',
        body: 'Strap making grew up in French saddlery and maroquinerie, and the best references still use its words: brin long / brin court (long / short piece), pompe (lug fold), enchapure (buckle fold), passant fixe / mobile (fixed / floating keeper), parer (to skive), abat-carrer (to bevel), surcoupe (the final trim through glued layers). Tranche franche means a cut edge; rembordé means a turned edge.',
        figure: 'strap:vocabulary',
        caption: 'The short piece in section — top (dessus), lining (doublure), lug fold, buckle fold, fixed keeper — and the bench terms.',
      },
      {
        title: 'A strap is a thickness budget',
        body: 'The strap must wrap a spring bar of 1.0–1.8 mm diameter and still pass between that bar and the case. That is why a fine flat strap is only about 2.2–2.5 mm thick: a firm top of 1.0–1.2 mm, a lining of 0.5–1.0 mm and a 0.2 mm reinforcement. Experienced makers warn that many cases will not take 1.5 mm + 1.5 mm. Every thickness in this course is chosen against this budget.',
        figure: 'strap:clearance',
        caption: 'Side view at the lug, true scale ×12: the folded end has to fit the gap between bar and case flank.',
        tip: 'Before you commit to a leather, glue up a 30 mm test sample of the full stack and try it between the bar and the case of the actual watch.',
      },
      {
        title: 'Rule 1 — the doubled fold equals one layer',
        body: 'Wherever leather folds back on itself — round the spring bar, round the buckle, in a keeper — the doubled leather is skived until it is no thicker than a single layer. The fold itself is thinned to about half, and the returning flap is feathered to nothing. This one rule drives the fold skives, the filler stops on padded straps and every lug-clearance limit.',
        figure: 'strap:rule-fold',
        caption: 'Left: an unskived flap leaves a hard step and a bulge. Right: skived, the doubled fold is about one layer.',
      },
      {
        title: 'Rule 2 — build the curve in before the bond sets',
        body: 'A strap lives in a curve. If you glue the layers flat and then bend them, the top layer is forced into compression and wrinkles across its face. Instead, lay the long lining while the strap is bent round a former — makers call it “boating” — so the laminate is born curved. Makers who preload the lining this way report straps that never wrinkle.',
        figure: 'strap:rule-curve',
        caption: 'Glued flat then bent: wrinkles. Curved first, then bonded: a smooth, born-curved strap.',
      },
      {
        title: 'Rule 3 — nothing rigid in a flex zone',
        body: 'The lug fold, the buckle fold and the bar channel flex every time the strap goes on. Keep everything rigid out of them: no glue in the fold or channel, no stiff tape across a fold, no rivets near the lugs, no oversized bevel (paint cracks on it), and no finish on the fold spine. Thin, flexible non-woven reinforcement at the pins is the one exception — it prevents tearing without stiffening.',
        figure: 'strap:rule-flex',
        caption: 'The flex zones of a long piece, and the list of what never goes in them.',
      },
      {
        title: 'Ten straps, one build with switches',
        body: 'The ten constructions in this course look different but share one build: lined or unlined, cut or turned edge, flat or padded, sewn or riveted. Classic lined, unlined, rembordé, padded, rally, Bund, single-pass, no-sew, quick-release and exotic each change one or two switches. Learn the shared techniques once and every build becomes a sequence you already know.',
        figure: 'strap:family',
        caption: 'The ten constructions, each shown as a cross-section across the strap.',
      },
      {
        title: 'Your leather decides the edge — before you cut',
        body: 'A burnished edge needs both top and lining in firm vegetable-tanned leather, because only veg-tan fibres compress and set under friction. A chrome lining, a pull-up leather like Chromexcel, any exotic and any padded multi-layer stack gets a painted edge instead — or a turned edge. Decide the route now: it changes how oversize you cut and the order of later steps.',
        figure: 'strap:edge-route',
        caption: 'The decision that sets the edge route for the whole build.',
        tip: 'Burnished straps are cut a whisker oversize (the edge compresses); painted straps a whisker undersize (paint adds width).',
      },
    ],
  },

  {
    id: 'sm-leather',
    part: 'Foundations',
    title: 'Leather & materials',
    summary: 'Top leathers, linings, reinforcement, fillers, thread and glue — what to buy and the thickness of each.',
    level: 'Beginner',
    time: '18 min',
    tools: [],
    intro:
      'Every serious strap maker asks for the same thing on top — firm, full-grain, vegetable-tanned leather cut along the backbone — and then chooses lining, reinforcement, filler, thread and glue to fit the thickness budget. Here is each material with the numbers that matter.',
    steps: [
      {
        title: 'Where on the hide',
        body: 'Use full grain only, from the shoulder or butt along the backbone, where the fibres are tightest and stretch least. Lay the strap’s length along the backbone line — a strap cut across the grain stretches within weeks. Avoid the belly and flanks; they are loose and stretchy. Soft leather also stretches as you cut and skive it, so firmness matters more than tannage.',
        figure: 'strap:hide-map',
        caption: 'A side of leather: strap blanks laid along the backbone in the butt and shoulder, away from the belly.',
      },
      {
        title: 'The standard stack',
        body: 'The reference flat strap is a firm veg-tan top of 1.0–1.2 mm, a 0.2 mm non-stretch reinforcement, and a calf lining of 0.5–1.0 mm — about 2.2–2.5 mm finished. A useful rule links the two: a 0.5 mm lining under a 1.5–2 mm top, a 1 mm lining under a thinner top. Padded straps add a filler and finish at 3.5–5 mm at the lug, tapering back to flat-strap thickness at the tail.',
        figure: 'strap:stack-standard',
        caption: 'Section through the standard stack, with each layer’s thickness.',
      },
      {
        title: 'Named top leathers',
        body: 'Haas Barenia (finished at 2–2.5 mm, so split it down for a lined strap) and Walpier Buttero (sold around 1.2–1.4 mm) are the classic firm veg-tans. Horween Chromexcel is a pull-up leather: oily, beautiful, but it stretches and will not burnish. Shell cordovan is dense, only 1–2 mm thick and varies horse to horse. Goat (e.g. Alran caviar at ~1.2 mm) and kangaroo (0.9–1.2 mm) are strong and thin. Unlined straps go heavier: 2.0–2.4 mm veg-tan or Horween.',
        figure: 'strap:leathers',
        caption: 'The common strap leathers, their working thickness and which edge each takes.',
      },
      {
        title: 'Linings — and how they set the edge',
        body: 'Linings give comfort and sweat resistance. Makers use purpose-made calf: Haas Zermatt (chrome-tanned, soft, water-resistant) or Degermann’s Alsavel — which, despite the name, is leather. Goat skives easily and resists scratching. Leave a veg-tan lining undyed to avoid dye allergies. A chrome lining forces a painted edge; a burnished edge needs a veg-tan lining under a veg-tan top.',
        figure: 'strap:lining-edge',
        caption: 'Same top, two linings: veg-tan lining burnishes, chrome lining must be painted.',
      },
      {
        title: 'Reinforcement',
        body: 'Reinforcement stops stretch and tearing. The standard is Velodon (Viledon), a 0.2 mm non-woven polyester sheet; Texon (~0.45 mm) and 6–8 mm tear-resistant tape are alternatives. Placement differs: full length on the top’s flesh side of a flat strap; on the lining and around the folds of a padded strap; or a centre tape that stays out of the folds. Thin flexible fabric around the pins prevents tearing at the bar.',
        figure: 'strap:reinforce',
        caption: 'Three documented placements: full length, padded (lining and folds), and centre tape out of the folds.',
      },
      {
        title: 'Fillers for padded straps',
        body: 'The dome of a padded (bombé) strap comes from a filler: firm veg-tan at 1.5–1.9 mm (or ~2 mm), two 1 mm sheets of craft foam, cork over thin leather, cotton fleece, or Salpa over reinforcement. Veg-tan holds a crisp, carved dome; foam and fleece give a softer, rounder one. Cheap straps were found to use cardboard — avoid it.',
        figure: 'strap:fillers',
        caption: 'Cross-sections of the filler options and the dome each gives.',
      },
      {
        title: 'Thread',
        body: 'Watch-strap thread runs 0.35–0.65 mm. Fil au Chinois waxed linen: 832 = 0.43 mm, 632 = 0.51 mm, 532 = 0.57 mm, 432 = 0.63 mm. Vinymo polyester #8 = 0.4 mm. Ritza Tiger’s finest is 0.6 mm and oval, so it reads fatter than its number. This course’s default is 0.45–0.55 mm. Linen is finer and traditional but fuzzes; polyester is stronger and better for a first strap.',
        figure: 'strap:thread-gauge',
        caption: 'Thread diameters drawn at the same enlargement, against a 3 mm stitch.',
      },
      {
        title: 'Glue',
        body: 'Water-based contact cement (e.g. Renia Aquilim 315) is the choice for a strap that touches skin: thin coat on both faces, tacky in 2–3 minutes, pressed at 1 bar or more, ready to sew after 30–60 minutes. Solvent cements give longer windows — Renia Colle de Cologne tacks in 5–20 min with ~30 min open time; Barge dries 10–15 min with up to 4 h open. Never laminate with superglue: it cracks in flex.',
        figure: 'strap:glue-times',
        caption: 'Working windows for water-based and solvent contact cements.',
        caution: 'Contact and rubber cements carry solvents such as acetone, heptane and isopropyl alcohol — some even chlorinated solvents. They are flammable and the vapour is heavier than air: work with cross-ventilation or a properly fitted organic-vapour respirator, away from flame.',
      },
      {
        title: 'Edge and finish chemistry',
        body: 'Burnishing agents: water, gum tragacanth, Tokonole or saddle soap, sealed with beeswax or paraffin. Edge paints: Fenice, Uniters (with its EP Coat primer), Giardini, Stahl — chosen because they stay flexible in bending. Dye sealer: Resolene thinned 1:1. Conditioner: neatsfoot oil or cream; for reptile, Saphir Reptan or lanolin.',
        figure: 'strap:finish-chem',
        caption: 'What each finish does to the edge, in section: compressed and sealed fibres versus built-up paint.',
      },
    ],
  },

  {
    id: 'sm-tools',
    part: 'Foundations',
    title: 'The bench: tools that matter',
    summary: 'Every tool a strap needs, what it is for, and the sizes that suit watch-strap work.',
    level: 'Beginner',
    time: '18 min',
    tools: [],
    intro:
      'Strap work is small and precise, so the tools are small and precise too. None is exotic, most last a lifetime, and the most important one is a knife kept truly sharp. Here is the kit with the sizes that fit a watch strap.',
    steps: [
      {
        title: 'Cutting',
        body: 'A sharp knife — a utility knife with fresh blades, a round (head) knife or a Japanese skiving knife — against a steel straightedge on a cutting board. Hold the blade vertical and take several light passes. A rotary cutter tears fibres on firm leather; keep it for linings, if at all.',
        figure: 'strap:tool-cut',
        caption: 'Knife vertical against a steel rule, several light passes, straights before curves.',
      },
      {
        title: 'Skiving',
        body: 'Skiving thins leather locally. Makers use a Kyoshin Elle or similar Japanese skiving knife, an English paring knife (Osborne 469B), or a sharp ¼-inch wood chisel for narrow pieces. A safety skiver with replaceable blades suits small areas on soft calf. Always skive on a hard flat base — a granite plate or glass.',
        figure: 'strap:tool-skive',
        caption: 'Skiving knife on a glass plate, blade low to the work.',
      },
      {
        title: 'Measuring and marking',
        body: 'Calipers reading to 0.1 mm (the finished strap must be within 0.2 mm of the lug gap), wing dividers set 1.5–3 mm for stitch and skive lines, and a scratch awl for marking. A steel rule and fine silver pen complete it.',
        figure: 'strap:tool-measure',
        caption: 'Calipers on the lug gap, wing dividers set to the stitch margin, scratch awl.',
      },
      {
        title: 'Pricking irons',
        body: 'Irons set the stitch spacing. French irons leave narrow slanted slits; Japanese “diamond” irons leave wider lozenges that lie flatter. Vergez Blanchard #8 = 3.38 mm, #9 = 3.00 mm, #10 = 2.70 mm, #12 = 2.25 mm. You need a 2-prong iron for curves and the tip, and a 6–12-prong iron for straights. This course defaults to 3.0 mm.',
        figure: 'strap:tool-irons',
        caption: 'French and Japanese iron profiles and the holes each leaves.',
      },
      {
        title: 'Needles and awls',
        body: 'Blunt John James saddler’s harness needles follow pre-punched holes without cutting fibres: size 004 is 48 × 0.86 mm, 002 is 54 × 1.02 mm. A diamond awl opens slits; a polished round awl makes round holes at the tip.',
        figure: 'strap:tool-needles',
        caption: 'JJ 004 and 002 harness needles to scale, diamond and round awl points.',
      },
      {
        title: 'Edge tools',
        body: 'An edge beveller of 0.5–0.7 mm (Tandy #0 = 0.7 mm, Kevin Lee 0.5 mm, Kyoshin Elle size 0) — larger bevels crack paint at the folds. Sandpaper 220 to 1200 on a block, a wood or glass slicker and canvas for burnishing, and a creaser (heated over a spirit lamp, or electric) for a 1.5 mm decorative line.',
        figure: 'strap:tool-edge',
        caption: 'Beveller, sanding stick, slicker and heated creaser.',
      },
      {
        title: 'Punches',
        body: 'Round punches of 1.0, 1.2, 1.5, 1.8 and 2.0 mm for adjustment holes (Horotec-style pliers cover 1.0–2.0 mm; rotary punches start at 2.0 mm, too big for most straps), a 2–3 mm oblong punch for the tongue slot, and for quick-release bars a notch plier such as the Bergeon 31227 (about a 1 × 5 mm notch). An end punch the width of the strap tip cuts a perfect tip in one blow. Strike with a poly or rawhide mallet — rubber bounces and steel burrs the tool heads; keep the polished hammer for setting seams.',
        figure: 'strap:tool-punch',
        caption: 'Round, oblong and notch punches, with the holes each leaves.',
      },
      {
        title: 'Folding and pressing',
        body: 'A bone, agate or PTFE folder (plioir) to set folds, a polished hammer on marble, leather-tipped pliers to crease a fold, a rubber roller for lamination (never over folded reinforcement), and formers — a metal rod or a stick slightly larger than the spring bar — to hold the bar channel open while glue sets.',
        figure: 'strap:tool-fold',
        caption: 'Folder, hammer, roller, crease pliers and a former rod.',
      },
      {
        title: 'Holding the work',
        body: 'A stitching clam or pony holds the strap upright so both hands are free for the two needles. A poly punch pad or poundo board under every strike protects the tools — never punch on stone, or on a self-healing mat, which a punch goes straight through. A granite or marble slab gives a dead, flat surface for skiving and hammering.',
        figure: 'strap:tool-hold',
        caption: 'Stitching pony, punch pad and granite slab.',
      },
      {
        title: 'The matched set: pitch, thread, needle, iron',
        body: 'Thread, needle and iron must match. 2.7 mm pitch: 0.40–0.45 mm thread, JJ 004, VB #10 — fine dress. 3.0 mm: 0.45–0.55 mm, JJ 004, VB #9 — the default. 3.38 mm: 0.55–0.6 mm, JJ 004 or 002, VB #8 — bolder, 20–24 mm straps. 3.85–4.0 mm: 0.6 mm, JJ 002 — casual and rugged. Charts disagree on needles, so test on scrap.',
        figure: 'strap:tool-matched',
        caption: 'Four matched sets and the stitch each one makes, drawn at the same scale.',
      },
      {
        title: 'Bench safety',
        body: 'A dull knife is the greater hazard because it needs force, so keep it sharp and cut away from your hand; a cut-resistant glove on the hand that holds the work or the rule is cheap insurance. Wear safety glasses when punching, striking irons or setting rivets, and closed shoes and an apron at the bench. Inspect blades and punches before use, and strike on a pad, never on your knee. Heated tools — creaser, edge iron, thread burner — go back in their stand and are unplugged when you finish. Read the safety data sheet of every glue, dye and finish, choose the least toxic product that does the job, and work solvents with ventilation.',
        figure: 'strap:tool-safety',
        caption: 'Glove on the holding hand, glasses for striking, hot tools in their stand, solvents ventilated.',
        caution: 'Most leatherwork injuries come from forcing a blunt blade. If you have to push hard, stop and sharpen.',
      },
    ],
  },

  {
    id: 'sm-design',
    part: 'Foundations',
    title: 'Sizing & drafting the pattern',
    summary: 'Measure the watch and wrist, choose lengths and taper, and draft a template with every mark on it.',
    level: 'Beginner',
    time: '25 min',
    tools: ['Calipers', 'Wing dividers', 'Card, Texon or acrylic', 'Steel rule', 'Fine pen or awl'],
    intro:
      'There is no industry standard for strap dimensions, and two sizing systems coexist — by lug width and by wrist. This lesson settles both, then turns your numbers into a template that carries every mark: folds, taper, tip, stitch stops, holes, slot and keeper.',
    steps: [
      {
        title: 'Measure the lug width',
        body: 'Measure the gap between the lugs with calipers. The finished strap must be no wider than the gap and no more than 0.2 mm narrower: wider and it binds, narrower and it shuffles and looks cheap. Measure at the bar, not at the lug tips.',
        figure: 'strap:t1-lug',
        caption: 'Calipers across the lug gap at the spring bar: the strap is never wider, at most 0.2 mm narrower.',
      },
      {
        title: 'Measure the buckle',
        body: 'Measure the buckle’s inside width — normally the lug width minus 2 mm — and the tongue’s width, which sets the size of your holes and slot. Tongues run from 1.0 to 3.0 mm.',
        figure: 'strap:t1-buckle',
        caption: 'Buckle inner width and tongue width — the two numbers the buckle end is built round.',
      },
      {
        title: 'Check the clearance with a sample',
        body: 'Glue up a short test sample of the exact stack you plan — top, reinforcement, lining — and try it folded round the spring bar between the lugs. Experienced makers insist on test samples: it is the only reliable way to know the fold will fit this case.',
        figure: 'strap:t1-sample',
        caption: 'A 30 mm sample of the full stack, folded round the bar and tried in the lugs.',
      },
      {
        title: 'Measure the wearer',
        body: 'Measure the wrist, or better, the old strap at the hole the wearer actually uses — not its overall length, because old straps have stretched. Measure from the spring bar to that hole on the long piece and from the bar to the buckle fold on the short piece.',
        figure: 'strap:t1-wrist',
        caption: 'Measure an old strap from the bar to the hole in use, not end to end.',
      },
      {
        title: 'Choose the finished lengths',
        body: 'By lug width (long / short): 16 mm → 105/65, 18 mm → 115/75, 20 mm → 120/80, 22 mm → 130/90. By wrist: about 105/65 for 14.5–17 cm, 115/70–75 for 16.5–19 cm, 125/75–80 for 18.5–21 cm. Cross-check one against the other; this course’s regular size is 115/75. Lengths are measured from the bar centre to the tip, and from the bar centre to the buckle fold.',
        figure: 'strap:t1-lengths',
        caption: 'Lengths by lug width and by wrist, and the datum each is measured from.',
      },
      {
        title: 'Draw the centreline and taper',
        body: 'Draw a centreline, then the outline. Most straps taper 2 mm from lug to buckle (20 → 18, 22 → 20); a dressier taper is 4 mm (20 → 16). Keep the full lug width for the first 8 mm behind the fold, then taper in a straight line to the buckle fold on the short piece and to just before the tip on the long piece.',
        figure: 'strap:t1-taper',
        caption: 'Centreline and a straight 2 mm taper on both pieces.',
      },
      {
        title: 'Add the fold allowances',
        body: 'Beyond each fold line add the flap that wraps the hardware: about 20 mm at the lug end and at least 25 mm at the buckle end. The wrap itself is half the circumference round the bar, π × (bar Ø + leather thickness) ÷ 2 — about 4.4 mm for a 1.8 mm bar and 1 mm leather; allow 5–6 mm, because a real fold is a teardrop, not a circle. The rest is the tail that returns under the top.',
        figure: 'strap:t1-allow',
        caption: 'Unfolded pattern: 20 mm lug flap and ≥25 mm buckle flap beyond the fold lines.',
      },
      {
        title: 'Draw the tip',
        body: 'Choose the tip: ogive (pointed arch, the classic), round, trapezoid or ellipse. Draw it symmetrically on the centreline — an off-centre tip is obvious from across a room. Make half the tip, fold the card on the centreline and trace the other half. Square and pilot (trapezoid) tips are common too. An end punch the width of the tip cuts it in one strike: apex on the mark, punch upright, both corners on or just past the edges.',
        figure: 'strap:t1-tips',
        caption: 'Ogive, round, trapezoid and ellipse tips on the same 18 mm end.',
      },
      {
        title: 'Mark the stitch stops and holes',
        body: 'Mark where stitching starts and stops, a few millimetres behind each fold. Place the holes on the centreline: the last hole about 25 mm from the tip (20 mm on a tapered tip), at 6–7 mm centres, seven holes (nine or ten for a large men’s wrist). Put the middle hole at the wearer’s size.',
        figure: 'strap:t1-holes',
        caption: 'Holes on the centreline from 25 mm before the tip at 7 mm centres; stitch stops behind the fold.',
      },
      {
        title: 'Mark the slot and fixed keeper',
        body: 'On the short piece, mark the tongue slot about 10 mm long, centred on the buckle fold line, and the fixed keeper’s line about 10 mm behind the fold.',
        figure: 'strap:t1-slot',
        caption: 'Slot centred on the buckle fold; fixed-keeper line 10 mm behind it.',
      },
      {
        title: 'Choose leather, thread and lining colours',
        body: 'Design the colours as one decision. Match the leather to the dial. Match the thread to the hands or markers — or keep it tonal with the leather when the dial and markers already contrast strongly. For a quiet strap, let only the lining carry the accent colour. Glossy finishes read formal; matte reads casual.',
        figure: 'strap:t1-colours',
        caption: 'Leather to the dial, thread to the hands, an accent in the lining.',
      },
      {
        title: 'Make the template',
        body: 'Cut the final templates from Texon, stiff card or acrylic so they survive repeated tracing, with every mark pricked through. For a padded strap also draw the filler: inset 3–5 mm per side, stopping at the keeper seam on the short piece and 5 mm before the first hole on the long piece. If you print a pattern, print it at 100% and check one dimension with calipers before you trust it. Record the numbers in your log — the next strap is a quick, tuned repeat.',
        figure: 'strap:t1-template',
        caption: 'Finished templates for both pieces, with the filler drawn for a padded version.',
      },
    ],
  },
]
