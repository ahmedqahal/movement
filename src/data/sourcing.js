// Sourcing & parts hub — where to buy tools, parts and consumables, and how to
// read part numbers. Data-driven so the page stays a thin renderer. Supplier
// links are homepages only; always confirm current stock and price yourself.

// Tool kits by skill level. `items` reference tools that also live in the
// Toolkit catalogue (src/data/tools.js) — kept here as plain strings so this
// file is self-contained and printable as a shopping list.
export const KITS = [
  {
    id: 'kit-starter',
    tier: 'Starter',
    blurb: 'Everything for straps, cases and battery changes — the reversible jobs. Under most budgets, and enough to build real confidence before you open a movement.',
    items: [
      { name: 'Spring-bar tool (fork + pin)', why: 'Fit and remove straps and bracelets without scratching lugs.' },
      { name: 'Watchmaker’s screwdriver set (0.6–2.0 mm)', why: 'The single most-used tool. Buy replaceable blades.' },
      { name: 'Case knife + caseback ball', why: 'Open snap and screw casebacks.' },
      { name: '10× loupe', why: 'You cannot judge a scratch or an oil dot you cannot see.' },
      { name: 'Rodico', why: 'Lift dust, fingerprints and stray oil off parts and dials.' },
      { name: 'Dust blower', why: 'Clear the dial and movement before you close the case.' },
      { name: 'Anti-magnetic tweezers (No. 2 or 3)', why: 'Handle small parts; brass tweezers for polished surfaces.' },
      { name: 'Movement holder', why: 'Hold the movement steady instead of your fingers.' },
      { name: 'Silver-oxide cells + assortment', why: 'The commonest repair of all is a fresh battery.' },
    ],
  },
  {
    id: 'kit-intermediate',
    tier: 'Intermediate',
    blurb: 'For opening a movement, regulating, and swapping hands and dials — servicing a quartz module or a simple mechanical.',
    items: [
      { name: 'Hand-removal levers / presto tool', why: 'Lift hands without bending them or marking the dial.' },
      { name: 'Hand-setting tools (hollow pushers)', why: 'Press hands back to the right heights, dead flat.' },
      { name: 'Dial protectors', why: 'Thin sheets that guard the dial while you lever hands.' },
      { name: 'Crystal / caseback press with dies', why: 'Seat crystals and press-fit casebacks squarely.' },
      { name: 'Timegrapher (or this app’s)', why: 'Read rate, beat error and amplitude to regulate properly.' },
      { name: 'Demagnetiser', why: 'A magnetised hairspring makes a watch gain wildly — this fixes it in a second.' },
      { name: 'Watch oils (e.g. 9010, HP-1300) + oilers', why: 'Right oil, right jewel, right amount — the heart of a service.' },
      { name: 'Silicone grease', why: 'For gaskets, keyless works and the mainspring barrel wall.' },
      { name: 'Digital calliper', why: 'Measure lug width, crystal and movement diameters to order parts.' },
      { name: 'Pegwood', why: 'Clean pivots and jewel holes without scratching.' },
    ],
  },
  {
    id: 'kit-pro',
    tier: 'Advanced / restoration',
    blurb: 'For a full strip-clean-oil service and bench restoration. Big-ticket items — buy as the work demands, not all at once.',
    items: [
      { name: 'Cleaning machine or ultrasonic + jars', why: 'Clean every part properly; hand-cleaning does not reach pivots.' },
      { name: 'Mainspring winder set', why: 'Fit a new mainspring into the barrel without kinking it.' },
      { name: 'Staking set', why: 'Fit balance staffs, rivet parts, close holes.' },
      { name: 'Jewelling tool (Seitz / Horia)', why: 'Replace jewels and set end-shake precisely.' },
      { name: 'Poising tool', why: 'Balance a wheel statically so it keeps time in every position.' },
      { name: 'Jacot tool + lathe', why: 'Burnish pivots and turn parts. The classic restorer’s pair.' },
      { name: 'Pressure / vacuum tester', why: 'Prove water resistance after you reseal — do not trust a gasket blind.' },
      { name: 'Geiger counter', why: 'Only if you handle vintage radium dials and hands — a real safety tool.' },
    ],
  },
]

// Where to buy. Grouped by region; `carries` is a short tag list.
export const SUPPLIERS = [
  {
    region: 'UK & Europe',
    houses: [
      { name: 'Cousins UK', url: 'https://www.cousinsuk.com', carries: 'Tools · parts · consumables · straps', note: 'The default material house for hobbyists in the UK/EU. Huge catalogue, part-number search.' },
      { name: 'H.S. Walsh', url: 'https://www.hswalsh.com', carries: 'Tools · consumables', note: 'Long-established jewellery & watch tool supplier.' },
      { name: 'Watch-Tools (DE)', url: 'https://www.watch-tools.de', carries: 'Tools · movements', note: 'German supplier; Bergeon and generic tools.' },
    ],
  },
  {
    region: 'United States',
    houses: [
      { name: 'Otto Frei', url: 'https://www.ofrei.com', carries: 'Tools · movements · parts', note: 'Deep catalogue; good for NH/Miyota movements and Bergeon tools.' },
      { name: 'Esslinger', url: 'https://www.esslinger.com', carries: 'Tools · movements · batteries · straps', note: 'Beginner-friendly; kits, crystals, batteries.' },
      { name: 'Jules Borel', url: 'https://www.julesborel.com', carries: 'Parts · material', note: 'Material house with the “BestFit” style parts cross-reference.' },
      { name: 'Cas-Ker', url: 'https://www.casker.com', carries: 'Tools · parts · consumables', note: 'Full-line material house.' },
    ],
  },
  {
    region: 'Movements & donor parts',
    houses: [
      { name: 'Seiko / Epson (NH, 4R, 7S)', url: '', carries: 'Movements · genuine parts', note: 'NH35/NH36 and Miyota movements are sold loose by most houses above — ideal for building and practice.' },
      { name: 'Donor movements (eBay etc.)', url: '', carries: 'Vintage parts', note: 'For discontinued calibres, a scrap “donor” of the same calibre is often the only parts source. Buy two if it is cheap.' },
      { name: 'Swiss genuine (ETA/Sellita)', url: '', carries: 'Restricted', note: 'Swatch Group restricts genuine ETA parts to certified accounts. Expect generic parts or donors for ETA work as a hobbyist.' },
    ],
  },
]

// Reading part numbers + genuine-vs-generic reality.
export const PARTS_GUIDE = [
  {
    heading: 'Identify the calibre first',
    body: 'Every part is ordered against a calibre, not a watch model. The calibre is stamped on the movement (e.g. NH35A, ETA 2824-2, Miyota 8215) — open the caseback and read it under the loupe. The Movement Guides in this app list the common ones.',
  },
  {
    heading: 'How part numbers work',
    body: 'Most systems number a part by calibre + a standard part code. The code is consistent across calibres — e.g. part 721 is the balance complete, 401 the winding stem, 5100 series the automatic parts. Material houses let you search “<calibre> <part name>” or browse an exploded parts list; BestFit-style books map a code to the physical part.',
  },
  {
    heading: 'Genuine · generic · donor',
    body: 'Genuine = the manufacturer’s own part (best fit, sometimes restricted or pricey). Generic = a third-party equivalent (fine for many parts — stems, crowns, gaskets, crystals — riskier for the escapement). Donor = a scrap movement of the same calibre you rob for parts (often the only route for vintage). Match the escapement and balance parts to genuine or a good donor; be relaxed about stems, gaskets and crystals.',
  },
  {
    heading: 'Measure before you order',
    body: 'For crystals, movements and straps, order by measurement, not by guesswork: crystal diameter and height, movement diameter and height (lignes or mm), lug width in mm. A digital calliper pays for itself on the first wrong-size return you avoid.',
  },
]

// Consumables cheat-list — the specific oils/greases people ask about.
export const CONSUMABLES = [
  { name: 'Moebius 9010', use: 'Fast-rotating, lightly-loaded pivots — escape wheel, train wheels, balance jewels.' },
  { name: 'Moebius HP-1300 (or 9104)', use: 'Slower, more heavily-loaded pivots — barrel arbor, centre wheel, keyless.' },
  { name: 'Moebius 9415', use: 'Grease for the pallet stones / escape-wheel teeth (the impulse surfaces).' },
  { name: 'Moebius 8200 / Kluber P125', use: 'Mainspring lubrication (8200 for manual barrels; braking grease for automatic barrel walls).' },
  { name: 'Silicone grease', use: 'Case, caseback and crown gaskets; keyless works.' },
  { name: 'Epilame (e.g. Fixodrop)', use: 'Surface treatment that stops oil spreading off jewels — advanced, optional.' },
]
