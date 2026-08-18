// In-depth reference articles. Each article has sections; a section may
// carry a `table` { headers, rows } that renders as a data table.
import { BATTERIES } from './batteries.js'

export const REFERENCE = [
  {
    id: 'movement-families',
    title: 'Movement families & identification',
    icon: 'gear',
    summary: 'The common calibres you’ll meet, and how to tell what you have.',
    sections: [
      { heading: 'The big picture', body: 'Most watches use a movement from a handful of makers. Learning the common families means you can quickly find data sheets, parts, and service intervals for almost anything that lands on your bench.' },
      { heading: 'Mechanical workhorses', body: 'The ETA 2824-2 and 2892, the Sellita SW200 (an ETA clone), the Seiko NH35/NH36 and 7S26, and the Miyota 8215/9015 power a huge share of mechanical watches. They’re well documented, robust, and ideal to learn on.' },
      { heading: 'Quartz workhorses', body: 'Ronda (e.g. 763, 715), ISA, Miyota (2035 is everywhere), and Seiko/Epson quartz modules dominate. Many are inexpensive enough that a failed one is simply replaced rather than repaired.' },
      { heading: 'How to identify a movement', body: 'Open the caseback and read the plate or module — the calibre is usually printed on it. Note the maker’s logo, the layout, jewel count, and any reference numbers, then search the calibre for its technical sheet.' },
      {
        heading: 'Quick comparison',
        body: 'A rough guide to a few common calibres:',
        table: {
          headers: ['Calibre', 'Type', 'Notable for'],
          rows: [
            ['Seiko NH35', 'Automatic', 'Cheap, hackable, the modder’s favourite'],
            ['ETA 2824-2', 'Automatic', 'The industry standard workhorse'],
            ['Sellita SW200', 'Automatic', 'Widely-used ETA 2824 equivalent'],
            ['Miyota 9015', 'Automatic', 'Thin, smooth, popular in microbrands'],
            ['Ronda 763', 'Quartz', 'Reliable Swiss quartz, easy parts'],
            ['Miyota 2035', 'Quartz', 'The most common quartz movement made'],
          ],
        },
      },
    ],
  },
  {
    id: 'water-resistance',
    title: 'Water resistance explained',
    icon: 'anatomy',
    summary: 'What the ratings really mean — and what you can safely do.',
    sections: [
      { heading: 'Ratings measure pressure, not depth', body: 'A rating in metres or ATM comes from a static pressure test, not real-world diving. Movement, temperature changes, and ageing gaskets all reduce real-world resistance, so treat the numbers conservatively.' },
      {
        heading: 'What each rating allows',
        body: 'A practical guide (be conservative, especially on older watches):',
        table: {
          headers: ['Rating', 'Rain / splash', 'Shower', 'Swim', 'Dive'],
          rows: [
            ['30 m / 3 ATM', 'Yes', 'No', 'No', 'No'],
            ['50 m / 5 ATM', 'Yes', 'No', 'Light swim', 'No'],
            ['100 m / 10 ATM', 'Yes', 'Yes', 'Yes', 'Snorkel'],
            ['200 m / 20 ATM', 'Yes', 'Yes', 'Yes', 'Scuba'],
          ],
        },
      },
      { heading: 'The golden rules', body: 'Never operate the crown or pushers wet or underwater, always screw down a screw-down crown, and keep watches away from hot water, steam, and saunas — heat expands seals and draws moisture in.' },
      { heading: 'Resistance is not permanent', body: 'Gaskets harden and compress over time. Any water rating is only as good as its last pressure test — which is why opening a case (even for a battery) voids it until re-sealed and re-tested.' },
    ],
  },
  {
    id: 'oiling-guide',
    title: 'Oiling & lubrication guide',
    icon: 'tools',
    summary: 'Which lubricant goes where — the principle and a starter chart.',
    sections: [
      { heading: 'Why lubrication is everything', body: 'A serviced watch lives or dies by its oils. Too little and parts wear; too much and oil migrates, attracts dirt, and gums the works. The skill is the right lubricant, at the right point, in a tiny, consistent amount.' },
      { heading: 'Thin oils vs thick oils vs greases', body: 'Thin oils suit fast, light pivots (balance, escape, train). Thicker oils suit slower, higher-load wheels. Greases handle sliding, high-friction surfaces — the mainspring, barrel wall, and keyless works.' },
      {
        heading: 'A concrete oiling chart',
        body: 'A practical starting chart — three oils and two greases cover most work. Product codes are common examples (Moebius); always follow your calibre’s own lubrication sheet where one exists.',
        table: {
          headers: ['Part', 'Lubricant', 'Example'],
          rows: [
            ['Escape, third & fourth wheel + balance pivots', 'Light oil', '9010'],
            ['Centre wheel, barrel arbor & motion work', 'Heavier oil', 'HP-1300 / D5'],
            ['Pallet stones (escapement)', 'Pallet oil/grease', '9415 / 941'],
            ['Cap jewels & Incabloc end-stones', 'Light oil (automatic oiler)', '9010'],
            ['Keyless & sliding setting parts', 'Grease', '8301'],
            ['Mainspring & barrel wall', 'Mainspring / braking grease', '8200'],
            ['Roller (impulse) jewel & hairspring', 'None — never oiled', '—'],
          ],
        },
      },
      { heading: 'Technique', body: 'Charge the oiler by dipping its tip in a pool of oil (dip fast for more, slow for less), then approach the pivot and its oil sink at a near right angle. Aim for a clear, distinct ring of oil around the pivot — about a third of the sink — never a puddle, and none on the flat around the sink. Use a separate oiler per grade, and never oil straight from the bottle (decant a little into a cup).' },
      { heading: 'If you smear it', body: 'Don’t try to patch a smeared jewel with Rodico — the oil keeps creeping over the next couple of weeks. Degrease the part properly and re-oil it. Shortcuts here always come back to haunt the rate.' },
      { heading: 'What to oil — and what not to', body: 'Oil the mainspring and barrel wall, the keyless works, the train and escape-wheel pivots, the cap/hole jewels, and the escapement’s pallet stones and escape-wheel teeth. Two things are famously left dry: the roller (impulse) jewel and the hairspring — a trace of oil on either wrecks timekeeping.' },
    ],
  },
  {
    id: 'tool-buying',
    title: 'Tool buying guide',
    icon: 'tools',
    summary: 'What to buy first, and what to add as your skills grow.',
    sections: [
      { heading: 'Buy in stages', body: 'You don’t need a full bench on day one. Buy the starter set for straps and batteries, then add tools as you take on movement work — you’ll understand what you need by the time you need it.' },
      { heading: 'Stage 1 — straps & batteries', body: 'Spring-bar tool, a caseback opener set (knife, wrench, ball), fine tweezers, a loupe, Rodico, a blower, and silicone grease. This handles the most common everyday jobs.' },
      { heading: 'Stage 2 — movement handling', body: 'A watchmaker’s screwdriver set, a movement holder, dial protectors, hand-removal levers and hand-setting tools, and finger cots. Now you can open and work inside movements.' },
      { heading: 'Stage 3 — servicing & building', body: 'A timegrapher, a demagnetiser, watch oils and oilers, a mainspring winder, a crystal/caseback press, a pressure tester, and a digital calliper. This is the full servicing and building kit.' },
      { heading: 'A note on quality', body: 'Cheap screwdrivers and tweezers cause damage — soft blades slip and mar screws, rough tweezer tips launch parts. Buy decent tweezers and drivers first; they protect the watches you practise on.' },
    ],
  },
  {
    id: 'batteries',
    title: 'Battery cross-reference',
    icon: 'chip',
    summary: 'Common watch cell codes and their equivalents.',
    sections: [
      { heading: 'Read the code, match like-for-like', body: 'Watch cells are stamped with a code. Replace with the same size and chemistry — silver-oxide (SR / “SW”) is preferred for watches because it holds a steady 1.55 V until nearly flat.' },
      {
        heading: 'Common equivalents',
        body: 'Watch cells by code, size and cross-reference (silver-oxide unless noted). Match the size and chemistry exactly, and look these up quickly in the bench Calculators tab:',
        table: {
          headers: ['Code', 'IEC / SR', 'Size (mm)', 'V', 'Also called'],
          rows: BATTERIES.map((b) => [b.code, b.iec, b.size, b.v, b.alt]),
        },
      },
      { heading: 'Silver-oxide vs alkaline', body: 'Alkaline (LR) equivalents exist and are cheaper, but their voltage sags as they drain, which can affect timekeeping and the low-battery indicator. For watches, choose silver-oxide.' },
      { heading: 'Handling & disposal', body: 'Handle new cells by the edge (fingerprints cause self-discharge and corrosion) and recycle old ones — button cells shouldn’t go in general waste.' },
    ],
  },
  {
    id: 'sizing',
    title: 'Sizing: cases, lugs & straps',
    icon: 'strap',
    summary: 'The millimetre measurements that matter when buying.',
    sections: [
      { heading: 'Everything is in millimetres', body: 'Watch fit and part compatibility are all specified in mm. A digital calliper is the tool that removes all the guesswork.' },
      { heading: 'Case diameter & how it wears', body: 'Case diameter (excluding crown) is the headline size. 36–40 mm suits most wrists; 42 mm+ wears large. Lug-to-lug length matters as much as diameter for whether it sits well.' },
      {
        heading: 'Common lug widths',
        body: 'The strap width is set by the lug width. The most common sizes:',
        table: {
          headers: ['Lug width', 'Typical on'],
          rows: [
            ['18 mm', 'Smaller / dress watches'],
            ['20 mm', 'The most common all-rounder'],
            ['22 mm', 'Sports & diver watches'],
            ['24 mm', 'Large / heavy watches'],
          ],
        },
      },
      { heading: 'Movement & crystal sizes', body: 'When building, the case is made for a movement size (a “ligne” or mm figure) and takes a crystal of a specific diameter and height. Match these exactly, and confirm the stem/crown fit too.' },
    ],
  },
  {
    id: 'crystals-materials',
    title: 'Crystals & case materials',
    icon: 'anatomy',
    summary: 'What watches are made of, and the trade-offs.',
    sections: [
      { heading: 'Crystal types', body: 'Acrylic (plastic) is warm-looking, shatter-resistant, and polishes scratches out easily, but scratches readily. Mineral glass is harder and cheap. Sapphire is extremely scratch-resistant (and pricier) — the modern default on quality watches.' },
      { heading: 'Polishing vs replacing', body: 'Light acrylic scratches buff out with a plastic polish. Mineral and especially sapphire don’t polish — deep marks mean replacement. Match the new crystal’s diameter and profile (flat, domed) exactly.' },
      { heading: 'Case materials', body: '316L stainless steel is the workhorse — tough and corrosion-resistant. 904L is a more corrosion-resistant steel. Titanium is lighter and hypoallergenic but scratches more easily. Gold and coatings (PVD/DLC) add looks and, for DLC, hardness.' },
      { heading: 'Why it matters for repair', body: 'Material affects how you polish, which tools mark it, and how it corrodes. Titanium and coated cases especially need care — aggressive polishing removes coatings permanently.' },
    ],
  },
  {
    id: 'quartz-electronics',
    title: 'Quartz movements explained',
    icon: 'chip',
    summary: 'How the electronics work, and how to test them.',
    sections: [
      { heading: 'The four parts', body: 'An analog quartz movement is a crystal, an integrated circuit (IC), a coil, and a Lavet stepper motor driving an ordinary gear train. The crystal oscillates at 32,768 Hz; the IC divides that down to one pulse per second; each pulse flips the stepper’s magnetised rotor 180°; the train turns the hands.' },
      { heading: 'Why 32,768 Hz', body: '32,768 is 2¹⁵. A chain of fifteen digital “divide-by-two” stages turns it into exactly one pulse per second with simple, very low-power logic — which is why almost every watch crystal is cut to that frequency.' },
      {
        heading: 'Testing with a multimeter',
        body: 'Four quick measurements localise almost any quartz fault:',
        table: {
          headers: ['Test', 'Healthy', 'Fault'],
          rows: [
            ['Cell voltage (in circuit)', '≈ 1.55 V', '< 1.5 V → tired / flat'],
            ['Coil resistance', '≈ 1.5–3 kΩ', 'Open (OL) → broken coil'],
            ['Average current', '< ~1 µA', 'Tens of µA → short / IC fault'],
            ['Seconds hand', '1-second steps', '4-second jump → low battery'],
          ],
        },
      },
      {
        heading: 'Calibre families',
        body: 'A handful of makers dominate: Ronda (Swiss), ISA (Swiss), Miyota/Citizen (Japanese — the 2035 is among the most-produced movements ever made), and Seiko/Epson. Most are cheap enough that a failed movement is replaced whole as a “module” rather than repaired. Cells below are typical — always confirm against the calibre’s own sheet.',
        table: {
          headers: ['Calibre', 'Origin', 'Type', 'Cell'],
          rows: [
            ['Miyota 2035', 'Japan', '3-hand', '377 (SR626SW)'],
            ['Ronda 763', 'Switzerland', '3-hand + date', '371 (SR920SW)'],
            ['Ronda 715', 'Switzerland', '3-hand', '371 (SR920SW)'],
            ['Ronda 5030.D', 'Switzerland', 'Chronograph', '395 (SR927SW)'],
            ['Seiko/Epson VX42', 'Japan', '3-hand + date', '377 (SR626SW)'],
          ],
        },
      },
      { heading: 'Repair vs replace', body: 'Because modules are inexpensive and mass-produced, component-level quartz repair rarely pays. The skilled work is diagnosis (battery vs contacts vs module) and the hand-and-dial work when swapping a module — not soldering electronics.' },
      { heading: 'A note on sources', body: 'The six reference books behind this app are all about mechanical watches. This quartz material is written from general electronics and watch-repair knowledge and cross-checked for accuracy — not drawn from those books. A quartz-specific service manual (Ronda, ISA, or Miyota tech sheets) would deepen it further.' },
    ],
  },
  {
    id: 'cal-6497',
    title: 'ETA/Unitas 6497 — reference',
    icon: 'gear',
    summary: 'Specs and oiling points for the classic learner calibre.',
    sections: [
      { heading: 'Why this calibre', body: 'A big 16½-ligne hand-wound pocket-watch movement with large, widely-spaced parts — the movement watchmaking schools hand you first. The Chinese Seagull ST36/ST3600 is the common, affordable clone. Pair this with the “Flagship service: the ETA/Unitas 6497” lesson.' },
      {
        heading: 'Specifications',
        body: 'ETA/Unitas 6497-1 (the 6498 puts the sub-seconds at 6 o’clock instead of 9):',
        table: {
          headers: ['Spec', 'Value'],
          rows: [
            ['Diameter', '36.6 mm (16½ lignes)'],
            ['Height', '4.5 mm'],
            ['Frequency', '18,000 A/h (2.5 Hz)'],
            ['Jewels', '17'],
            ['Power reserve', '~46–53 h'],
            ['Lift angle', '53°'],
            ['Winding', 'Manual'],
            ['Sub-seconds', '9 o’clock (6498: 6 o’clock)'],
            ['Shock protection', 'Incabloc'],
            ['Common clone', 'Seagull ST36 / ST3600'],
          ],
        },
      },
      {
        heading: 'Oiling points',
        body: 'A practical 6497 oiling map (Moebius examples). Two surfaces are always left dry.',
        table: {
          headers: ['Point', 'Lubricant'],
          rows: [
            ['Balance & escape-wheel jewels, fast train pivots', '9010 (light)'],
            ['Centre wheel, barrel arbor, keyless works', 'HP-1300'],
            ['Pallet stones & escape-wheel teeth', '9415'],
            ['Mainspring & barrel wall', '8200 grease'],
            ['Cannon pinion', 'A trace of grease'],
            ['Hairspring & roller (impulse) jewel', 'Never oiled'],
          ],
        },
      },
      { heading: 'Regulation targets', body: 'Fully wound, dial-up: amplitude 270–310°, beat error under ~0.5 ms, and a small daily gain. Because the 6497 is a display-back favourite, it rewards dressing the bridges and bluing the screws.' },
    ],
  },
  {
    id: 'accuracy',
    title: 'Understanding accuracy',
    icon: 'clock',
    summary: 'Rate, positions, COSC, and what “good” looks like.',
    sections: [
      { heading: 'Seconds per day', body: 'Mechanical accuracy is measured in seconds per day (s/day). A healthy modern mechanical typically runs within about −10 to +20 s/day; a well-regulated one, within a few seconds.' },
      { heading: 'Why position matters', body: 'Gravity affects the balance differently depending on orientation, so rate varies by position (dial-up, dial-down, crown-down, etc.). Watchmakers check several positions and average the behaviour.' },
      {
        heading: 'Certification standards',
        body: 'Reference standards for mechanical accuracy:',
        table: {
          headers: ['Standard', 'Rough tolerance'],
          rows: [
            ['Standard mechanical', '−10 to +20 s/day (typical)'],
            ['COSC chronometer', '−4 to +6 s/day (avg)'],
            ['METAS Master Chronometer', '0 to +5 s/day'],
            ['Quartz (standard)', '±15–30 s/month'],
          ],
        },
      },
      { heading: 'Amplitude & beat error', body: 'Beyond rate, amplitude (how far the balance swings, ~270–310° healthy) and beat error (swing symmetry, lower is better) tell you the movement’s health — a timegrapher shows all three.' },
    ],
  },
  {
    id: 'sources',
    title: 'Sources & further reading',
    icon: 'book',
    summary: 'The classic horology texts this app’s content draws on.',
    sections: [
      { heading: 'How this app was written', body: 'Lessons and references here are written in plain language but checked against classic watchmaking texts for accuracy — especially the escapement, balance, adjusting, and cleaning/oiling material. The books below are worth seeking out as you go deeper.' },
      { heading: 'Harold C. Kelly — A Practical Course in Horology (1944)', body: 'A superb textbook on the lever escapement, the balance and balance spring, jeweling, staff-making, pivoting, and the three branches of adjusting (position, isochronism, temperature). The source for much of the escapement and adjusting detail here.' },
      { heading: 'Joseph Bulova School of Watch Making', body: 'The famous training course, strong on practical bench technique — balance truing, staffing, and hands-on repair — with excellent illustrations.' },
      { heading: 'Parts & movement references', body: 'The Waltham Watch Company parts catalogue (1911) and the Ébauches SA dictionary are period references for identifying vintage movements and parts.' },
      { heading: 'Interactive online reference', body: 'Bartosz Ciechanowski’s “Mechanical Watch” (ciechanow.ski/mechanical-watch) is an outstanding interactive explainer — its precise account of the lever escapement, the going train, keyless and automatic winding informed the to-scale escapement diagram here, including its synchronised beat.' },
      { heading: 'A note on accuracy', body: 'Where classic and modern practice differ (for example, old cleaning methods used cyanide, long since replaced by modern cleaning solutions), this app follows current safe practice while keeping the underlying principles the classics teach so well.' },
    ],
  },
  {
    id: 'disclaimer',
    title: 'Safety notice & disclaimer',
    icon: 'book',
    summary: 'What this app is, what it isn’t, and how to use it safely.',
    sections: [
      { heading: 'What this app is', body: 'Movement is an educational reference for people learning to maintain and repair their own watches. It explains principles and standard practice, written from general horological knowledge and cross-checked against the reference works credited in “Sources & further reading”.' },
      { heading: 'It is not a substitute for training or a service manual', body: 'Watchmaking is a skilled trade. Nothing here replaces hands-on instruction, nor the manufacturer’s own technical documentation for a specific calibre. Where a calibre has an official service sheet, that sheet wins over anything written here.' },
      { heading: 'You work at your own risk', body: 'You are responsible for your own safety and for whatever you work on. Watch repair involves genuine hazards — tensioned mainsprings and spring bars that can launch parts at your eyes, solvents and cleaning fluids that need ventilation, sharp case knives, lithium cells, and on vintage pieces, radioactive radium lume. Read the Workshop & Safety track before you start, wear eye protection, and stop when a job is beyond your tools or experience.' },
      { heading: 'Practise on something you can afford to lose', body: 'Learn on scrap movements and cheap watches, not on an heirloom. A £20 practice movement teaches the same lessons as a valuable one, and forgives the mistakes everybody makes early on.' },
      { heading: 'Value, warranty and irreversible work', body: 'Opening a watch can void its warranty and always voids its water resistance until it is resealed and pressure-tested. Refinishing a case, redialling or reluming is irreversible and usually reduces a collectable watch’s value — see “Case refinishing & dial ethics” before you commit.' },
      { heading: 'No liability', body: 'This app is provided as-is, without warranty of any kind. Its authors accept no liability for damage, injury or loss arising from its use. If you are in any doubt about a repair, take the watch to a qualified watchmaker — that is often the cheaper outcome anyway.' },
    ],
  },
]

export function getArticle(id) {
  return REFERENCE.find((a) => a.id === id)
}
