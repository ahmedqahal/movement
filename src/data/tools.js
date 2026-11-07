// The essential watchmaker's toolkit. `essential: true` marks the
// starter set worth buying first.
//
// Part numbers are limited to ones confirmed in the research report. Don’t add
// other Bergeon or Horotec numbers until they’re checked against a catalogue.
// Wording overlaps the glossary and sourcing lists, so keep the three aligned.

export const TOOLS = [
  // Bench & workspace
  {
    name: 'Bench & seat',
    use: 'A solid bench and a seat with arm rests, so your forearms are supported and your hands stay steady. It heads BHI’s watch tool list.',
    group: 'Bench & workspace',
  },
  {
    name: 'Bench light',
    use: 'A 30 W or LED light aimed at the work. BHI lists one as standard, because you can’t judge what you can’t see.',
    group: 'Bench & workspace',
  },
  {
    name: 'Movement holder',
    essential: true,
    use: 'Grips the movement securely so both hands are free. Adjustable jaws fit different movement sizes without stressing the mainplate.',
    group: 'Bench & workspace',
  },
  {
    name: 'Parts tray & cover',
    use: 'Keeps stripped parts in order and covered, so dust stays off clean parts and nothing gets scattered. BHI lists both.',
    group: 'Bench & workspace',
  },

  // Hand tools
  {
    name: 'Watchmaker’s screwdriver set',
    essential: true,
    use: 'Precision drivers in graduated widths (0.50–3.00 mm; Bergeon 30081 is one such range). Match the blade to the slot’s length and width. Too wide scrapes the plate, too narrow marks the slot, and a steep blade rides out and bruises the screw.',
    group: 'Hand tools',
  },
  {
    name: 'Anti-magnetic tweezers',
    essential: true,
    use: 'Fine-tipped tweezers for handling tiny parts. Anti-magnetic steel stops parts jumping and magnetising. Makers number tweezers differently, so BHI describes them by tip: start with steel medium, fine, very fine and super fine, plus brass medium and fine. Steel marks surfaces, and brass suits soft parts and plates.',
    group: 'Hand tools',
  },
  {
    name: 'Battery tweezers',
    use: 'One plastic pair with 3 mm spade tips, as BHI suggests. Steel and brass both conduct, so they can short a cell. Keep metal tweezers for Seiko’s AC reset, which needs them.',
    group: 'Hand tools',
  },
  {
    name: 'Loupe',
    essential: true,
    use: 'A magnifier (typically 3×–10×) worn at the eye. Essential for inspecting wear, oiling, and hand alignment. BHI’s list gives eyeglasses at 1½ in, 2½ in and 15×.',
    group: 'Hand tools',
  },
  {
    name: 'Digital calliper',
    use: 'Measures case, lug, crystal, and movement dimensions to the tenth of a millimetre — indispensable when sourcing parts for a build.',
    group: 'Hand tools',
  },
  {
    name: 'Pliers',
    use: 'BHI lists brass-faced and snipe-nose pliers. Brass faces grip without marking, and snipe-nose jaws reach into tight spots.',
    group: 'Hand tools',
  },
  {
    name: 'Top cutters',
    use: 'End-cutting nippers for trimming wire and stems. They are on BHI’s list.',
    group: 'Hand tools',
  },
  {
    name: 'Pin vice',
    use: 'A small hand-held chuck used to grip fine parts. BHI’s workshop list calls for a set.',
    group: 'Hand tools',
  },
  {
    name: 'Broaches',
    use: 'Tapered five-sided cutters used to open a hole. A smoothing broach is the usual forum answer for a hand that is too tight, and it also supports the bore when you tighten a cannon pinion.',
    group: 'Hand tools',
  },
  {
    name: 'Files',
    use: 'BHI lists a pillar file and needle files for shaping and tool-making. A pivot file is a very fine file for working pivots.',
    group: 'Hand tools',
  },
  {
    name: 'Vice & hammer',
    use: 'A watchmaker’s vice and hammer, both on BHI’s list, for holding and shaping work and for making your own tools.',
    group: 'Hand tools',
  },

  // Case, strap & pressing
  {
    name: 'Spring-bar tool',
    essential: true,
    use: 'A double-ended tool (fork + pin) that compresses spring bars to remove and fit straps and bracelets. The first tool anyone should own. Bergeon 7767-F is one example.',
    group: 'Case, strap & pressing',
  },
  {
    name: 'Caseback opener',
    essential: true,
    use: 'Opens the back: a case knife for snap-on backs, a notched wrench for screw-down backs, and a friction-ball for smooth screw-in backs.',
    group: 'Case, strap & pressing',
  },
  {
    name: 'Case cushion',
    use: 'A soft cushion that holds a case or movement steady while you work, without marking it. It is on BHI’s list.',
    group: 'Case, strap & pressing',
  },
  {
    name: 'Bracelet pin pusher',
    use: 'A screw-driven or tap-style tool for driving link pins in and out when sizing a metal bracelet.',
    group: 'Case, strap & pressing',
  },
  {
    name: 'Crystal / caseback press',
    use: 'A press with interchangeable dies for seating crystals and snap casebacks with even pressure, avoiding cracks and crooked seating. Bergeon 5500-C tapered dies suit tension-ring crystals, not mineral glass. Horotec thread-on sets include MSA06.522 (tension-ring crystals), MSA06.526 (very domed crystals), MSA06.521 (bezels) and MSA07.106 (snap-on casebacks).',
    group: 'Case, strap & pressing',
  },
  {
    name: 'Crystal lift',
    use: 'A claw-like tool that squeezes an acrylic crystal so it can be removed or fitted. Close it just enough that the crystal lifts out of the base.',
    group: 'Case, strap & pressing',
  },

  // Hands & dial
  {
    name: 'Hand-removal levers',
    use: 'Twin levers (or a “presto” puller) that lift friction-fit hands straight up off their arbors without bending them.',
    group: 'Hands & dial',
  },
  {
    name: 'Hand-setting tools',
    use: 'Hollow-tipped pushers sized to each hand’s hub for pressing hands back on squarely.',
    group: 'Hands & dial',
  },
  {
    name: 'Dial protectors',
    essential: true,
    use: 'Thin plastic sheets slid under the hands to shield the dial while levering — cheap insurance against a permanent scratch.',
    group: 'Hands & dial',
  },
  {
    name: 'Cannon-pinion tool',
    use: 'A V-block and punch that puts a small dent in the waist of a cannon pinion to restore its grip. Support the bore with a smoothing broach first, and work a little at a time.',
    group: 'Hands & dial',
  },

  // Oilers & lubricants
  {
    name: 'Watch oils & oilers',
    use: 'Specific horological oils and greases applied in tiny amounts with fine oilers at jewels and contact points during a service. BHI lists oilers with a stand.',
    group: 'Oilers & lubricants',
  },
  {
    name: 'Automatic oiler',
    use: 'A pen-like tool that places a metered drop when pressed. Bergeon 7718 comes as 1A black for cap jewels, 2A red for pallets and 5 green for train pivots. Drop volumes are not published.',
    group: 'Oilers & lubricants',
  },
  {
    name: 'Silicone grease',
    essential: true,
    use: 'A thin film keeps caseback and crown gaskets sealing properly. Crystal gaskets usually need none, and it doesn’t belong in the movement.',
    group: 'Oilers & lubricants',
  },

  // Mainspring & barrel
  {
    name: 'Mainspring winder',
    use: 'A tool that coils a mainspring safely into its barrel without kinking it. BHI suggests buying winders individually as you need them.',
    group: 'Mainspring & barrel',
  },
  {
    name: 'Micrometer',
    use: 'A 0–25 mm micrometer reads finer than a calliper. Use it for mainspring thickness and loose crystals, where a small error matters.',
    group: 'Mainspring & barrel',
  },

  // Cleaning
  {
    name: 'Rodico',
    essential: true,
    use: 'A reusable cleaning putty that lifts dust, fibres, and excess oil from parts and dials without leaving residue.',
    group: 'Cleaning',
  },
  {
    name: 'Dust blower',
    essential: true,
    use: 'A rubber bulb that puffs away dust before you close a case — the enemy of a clean dial is lint trapped under the crystal.',
    group: 'Cleaning',
  },
  {
    name: 'Finger cots / gloves',
    use: 'Keep skin oils off dials, cases, and movements. Oils cause fingerprints and long-term corrosion that are hard to remove.',
    group: 'Cleaning',
  },
  {
    name: 'Pegwood',
    use: 'A pointed stick of hard wood used to clean jewel holes and pivot sinks. Sharpen it and peg out the jewels before the main wash.',
    group: 'Cleaning',
  },
  {
    name: 'Benzine jar',
    use: 'A small jar of bench solvent for rinsing parts by hand, on BHI’s list. Keep it closed and away from heat, and never use it as a final rinse.',
    group: 'Cleaning',
  },
  {
    name: 'Cleaning machine',
    use: 'A bench machine that spins parts through cleaning and rinsing solutions and dries them with heat. The Elma Super Elite is an entry-level example. Follow its manual, because the heated chamber floor can exceed 90 °C.',
    group: 'Cleaning',
  },
  {
    name: 'Ultrasonic cleaner',
    use: 'A tank that cleans with high-frequency vibrations in a solution. One repairer’s routine stands the fluid in beakers in water and keeps sessions to 2 minutes. Keep pallet forks and balances out, because shellac holds their jewels.',
    group: 'Cleaning',
  },

  // Timing & test
  {
    name: 'Timegrapher',
    use: 'An acoustic timing machine that reads a mechanical watch’s rate, amplitude, and beat error so you can regulate accurately.',
    group: 'Timing & test',
  },
  {
    name: 'Demagnetiser',
    essential: true,
    use: 'Removes magnetism from a movement in seconds. A magnetised watch runs fast — always demagnetise before diagnosing rate faults.',
    group: 'Timing & test',
  },
  {
    name: 'Etachron tool',
    use: 'A fine-timing tool for the Etachron regulator. Bergeon 31081 is the general tool, and 31081-EX-7750 is for 7750-based movements.',
    group: 'Timing & test',
  },
  {
    name: 'Quartz tester',
    use: 'A timing machine for quartz watches that reads rate and current. BHI’s spec is consumption from 5 nA to 20 mA at 1–3 V. Limits such as 1.20 µA are below what most multimeters resolve, so this is the tool for a current check.',
    group: 'Timing & test',
  },
  {
    name: 'Multimeter',
    use: 'Reads cell voltage and gives a rough coil check. ETA calls a test voltage above 0.40 V unsuitable for coils, so use a low-voltage ohmmeter. Witschi says an ordinary multimeter is unreliable for judging a battery.',
    group: 'Timing & test',
  },
  {
    name: 'Pressure tester',
    use: 'Verifies water resistance with air (dry) or water (wet) tests. The only way to truly trust a water-resistance rating after opening a case. Bergeon’s 7004 air tester and 5555/98 wet tester are two examples. A test proves the seals only up to the pressure used, so tell the owner what it was.',
    group: 'Timing & test',
  },

  // Restoration
  {
    name: 'Staking set',
    use: 'A stump-and-punch set for riveting a balance wheel to a new staff, driving out old staffs, and closing or fitting friction parts. The core tool for balance-staff replacement.',
    group: 'Restoration',
  },
  {
    name: 'Jewelling tool (Seitz / Horia)',
    use: 'Pushes jewels in and out and sets them to an exact depth via a micrometer — depth is what controls end-shake. Comes with graded pushers, stumps and reamers.',
    group: 'Restoration',
  },
  {
    name: 'Poising tool',
    use: 'Parallel ruby or steel jaws that let a bare balance roll freely on its pivots, so the heavy point settles to the bottom and can be corrected.',
    group: 'Restoration',
  },
  {
    name: 'Jacot tool',
    use: 'A runner with beds sized to individual pivots, used with a burnisher to polish and work-harden worn pivots back to a free-running finish.',
    group: 'Restoration',
  },
  {
    name: 'Watchmaker’s lathe',
    use: 'For turning what you cannot buy — staffs, pivots, stems and bushings — and for safely removing a balance staff’s rivet. The gateway to real restoration work.',
    group: 'Restoration',
  },
  {
    name: 'Roller & collet removers',
    use: 'Purpose-made levers that push against the staff to lift a roller table or hairspring collet without bending the hairspring or cracking the roller.',
    group: 'Restoration',
  },
  {
    name: 'Shellac & warming holder',
    use: 'Natural resin plus a gentle heat source for setting pallet stones and roller jewels. Softens to adjust lock and drop, then sets hard on cooling.',
    group: 'Restoration',
  },
  {
    name: 'Geiger counter',
    use: 'Detects radium lume on vintage dials and hands in seconds. A sensible buy if you work on vintage watches regularly. No date rules radium out, so treat any old unmarked luminous dial as possibly radium until tested. A quiet reading doesn’t prove a dial is safe to strip.',
    group: 'Restoration',
  },

  // Sharpening & maintenance
  {
    name: 'Screwdriver dresser',
    use: 'A holder that keeps a screwdriver blade at a fixed angle on a stone, so you can restore a flat, square tip. A dressed blade that fits the slot is the cure for chewed screws.',
    group: 'Sharpening & maintenance',
  },
  {
    name: 'Sharpening stones',
    use: 'BHI’s workshop list includes Arkansas and India stones, for dressing screwdrivers and sharpening tools.',
    group: 'Sharpening & maintenance',
  },
]

export const TOOL_GROUPS = ['Bench & workspace', 'Hand tools', 'Case, strap & pressing', 'Hands & dial', 'Oilers & lubricants', 'Mainspring & barrel', 'Cleaning', 'Timing & test', 'Restoration', 'Sharpening & maintenance']
