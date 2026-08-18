# Movement — Build Roadmap

The build plan for the app. Current state: **83 lessons / 11 tracks** (incl. a guided *Your First
Project* arc and full **6497 / NH35 / ETA 2824** service walkthroughs), a **Movement Guides** library
of 15 key calibres, 9 interactive anatomy diagrams (escapement, keyless, automatic, chronograph, the
quartz stepper and the **calendar date-works** are animated), 6 technical plates, the assembly/teardown
walkthroughs, per-lesson quizzes **plus a "Test Yourself" mode** (shuffled options + a *review weak
spots* mode) with per-track scores, 5 clickable diagnostic flowcharts, global **⌘K search**, 6 bench
**calculators**, printable **cheat-sheets**, a light/dark theme, keyboard-accessible diagrams,
reference guides (incl. quartz electronics + a 6497 reference), toolkit, glossary, an IndexedDB
practice log with search/tags/stats/import, and an installable offline PWA.

> **All four phases are complete.** Phase 1 (Interactive Trainer): A1 Quizzes, A2 Diagnostic
> flowcharts, A3 Animated mechanisms. Phase 2 (Bench Tool): B1 Global search (⌘K),
> B2 Calculators, B3 Practice-log upgrades. Phase 3 (Depth): C1 Quartz section, C2 Diagram
> upgrades, C3 6497 flagship service. Phase 4 (Polish): D1 Light theme + a11y, D2 Cheat-sheets,
> D3 mech lesson sweeps. C1 and C3 were built from general/standard knowledge rather than the
> gated inputs (a quartz service manual and 6497 macro photos), which would still deepen them.

**How to read this.** Work is grouped into four tracks. Each item is an *epic* with concrete
tasks, the files to touch, the approach, an effort tag, dependencies, and acceptance criteria.
Effort: **S** ≈ half-day · **M** ≈ 1–2 days · **L** ≈ 3–5 days.

Recommended order is at the bottom. Quick wins (S) can be slotted in anytime.

---

## Track A — Interactive Trainer

### A1 · Quizzes / knowledge checks — **M** — ✅ SHIPPED
**Goal:** let learners test understanding per lesson and feed it into progress.
- [x] Add an optional `quiz: [{ q, options[], answer, explain }]` to lessons in `src/data/lessons.js` (11 lessons, one+ per track).
- [x] `src/components/Quiz.jsx` — renders questions, gives immediate right/wrong feedback + explanation, tallies a score.
- [x] Render the quiz in `src/pages/LessonPage.jsx` after the steps (before the complete button) when `lesson.quiz` exists.
- [x] Extend `src/context/ProgressContext.jsx` to store `quizzed[lessonId] = { score, total }` (keeps best); badge in `src/pages/Learn.jsx`.
- [x] **(Optional, now done)** a "Test yourself" page (`/test`, `TestYourself.jsx`) — pick any track or "All tracks", get a shuffled 10-question set with immediate feedback and the source lesson tagged on each answer.

**Approach:** fully data-driven; reuse the existing progress/localStorage pattern.
**Dependencies:** none.
**Done when:** a lesson shows a 3–5 question quiz with feedback + explanations, the score persists, and Learn shows quiz status.

### A2 · Interactive diagnostic flowcharts — **M** — ✅ SHIPPED
**Goal:** replace the prose Diagnostics with clickable decision trees that end in a diagnosis + a link to the fix.
- [x] `src/data/flowcharts.js` — 4 trees: *Won’t run*, *Bad timekeeping*, *Winding/setting fault*, *Water ingress*.
- [x] `src/components/Flowchart.jsx` — current node, option buttons, breadcrumb of the path, Back/Restart, tone-coded leaves (good/warn/bad).
- [x] `src/pages/Diagnose.jsx` — lists the flowcharts; leaf nodes deep-link to the matching lesson.
- [x] Wired nav + route in `src/App.jsx` (new "Diagnose" item).

**Approach:** plain HTML buttons (accessible, simple) rather than SVG; source the logic from the existing diagnostics lesson content.
**Dependencies:** none (pairs naturally with A1).
**Done when:** answering a series of questions reaches a diagnosis with a link to the fix, and can be restarted.

### A3 · Animate keyless / automatic / chronograph — **L** — ✅ SHIPPED
**Goal:** bring the three static mechanism diagrams to the escapement/assembly standard — interaction-driven, since these represent user actions.
- [x] **Keyless** (`Keyless.jsx`): a Wind ⇄ Set toggle that slides the stem/clutch assembly, rocks the yoke + setting lever, dims the inactive power path, and spins the engaged gears (turning the hands in Set mode).
- [x] **Automatic** (`Automatic.jsx`): a rotor-direction toggle — the rotor + reduction reverse with the swing, but the reverser + ratchet keep their **one-way** output (with a fixed "always winds one way" arrow to make the point).
- [x] **Chronograph** (`Chronograph.jsx`): Start / Stop / Reset state machine → column wheel steps 30°/press, the coupling clutch rocks into mesh, the runner + minute counters sweep/freeze/zero, hammers drop to the heart cams on reset (Reset locked out while running).
- [x] Controls live inside each diagram component (returned as a `.diagram-controls` bar above the `<svg>`); CSS keyframes/transitions in `src/index.css` (`.spin-slow`, `.slide-anim`, `.chrono-sweep`, `.hammer-drop`, all under the reduced-motion guard).

**Approach:** interaction (toggles/pushers) + CSS transitions/keyframes, reusing the primitives. Largest of the three sub-items is the chronograph.
**Dependencies:** overlaps with B-nothing; overlaps with **C2** (chronograph geometry) — do the chrono geometry + animation together.
**Done when:** each diagram responds correctly and legibly to its control. ✅ All three verified via DOM-driven interaction tests; build clean (70 modules).

---

## Track B — Bench Tool

### B1 · Global search — **M** — ✅ SHIPPED
**Goal:** find any lesson, term, or reference instantly.
- [x] `src/lib/search.js` — one in-memory index built at load from lessons, glossary, reference, tools, **plates, anatomy diagrams and diagnostic flowcharts**; hand-rolled AND-token scorer (title/prefix/substring weighting), zero dependencies.
- [x] `src/components/SearchModal.jsx` — a ⌘/Ctrl-K modal; results grouped by type (Lessons / Diagnostics / Field guides / Plates / Diagrams / Glossary / Tools); ↑↓ + Enter + Esc, hover-to-select, click/Enter navigates; body-scroll lock + footer key hints.
- [x] Trigger + modal mount in `src/App.jsx` (sidebar “Search… ⌘K” button, mobile top-bar icon, global ⌘/Ctrl-K listener); styles in `src/index.css`.
- [x] **Deep-linking:** results carry a `?focus=` param — active-item pages (Reference/Anatomy/Diagnose) open the exact article/diagram/chart; list pages (Glossary/Tools/Plates) scroll to and briefly ring-highlight the item via `src/lib/useFocusScroll.js`.

**Approach:** all data is local — build the index client-side. Hand-rolled substring ranking (kept dependency-light for the offline PWA).
**Dependencies:** none.
**Done when:** ⌘/Ctrl-K opens search; typing shows ranked cross-content results; selection navigates. ✅ All result types + keyboard nav + deep-links verified via DOM interaction; build clean (73 modules).

### B2 · Small calculators — **M** — ✅ SHIPPED
**Goal:** turn it into a bench companion, not just reading.
- [x] `src/pages/Calculators.jsx` + nav/route (`/calculators`, `IconCalc`). **Five** widgets:
  - [x] **Daily rate** — drift over hours/days → s/day, with a colour-coded quality band (COSC / excellent / good / regulate).
  - [x] **Beat rate** — bph → beats/sec + Hz + calibre family.
  - [x] **(Optional, now done) Amplitude & beat error** — read a timegrapher trace → health verdict + lift-angle caveat.
  - [x] **Power-reserve estimate** — working turns × (barrel teeth ÷ centre-pinion leaves) → rough hours.
  - [x] **Strap & lug sizing** — lug width → strap width, taper, spring-bar length, typical lengths.
  - [x] **Battery cross-reference lookup** — searchable by code / cross-code / size, from a new shared `src/data/batteries.js` (26 cells) that also now feeds the Reference battery table (single source of truth).
- [x] Calculators are also indexed in global search (new `Calc` type / “Calculators” group).

**Approach:** controlled inputs + computed outputs; battery data extracted to `batteries.js` and reused by the Reference article.
**Dependencies:** none.
**Done when:** the Calculators page ships ≥3 working tools. ✅ Five tools shipped; all compute correctly (verified via DOM), search-integrated, build clean (76 modules).

### B3 · Practice Log upgrades — **M** — ✅ SHIPPED
**Goal:** filters/search/tags, stats, history, and import.
- [x] `src/pages/PracticeLog.jsx` — search box (title/calibre/notes/tags/history), status + movement-type filters, and a sort control (newest / oldest / recently-updated), with a “clear filters” empty state.
- [x] A **tags** field on entries (comma-separated in the editor) + a clickable tag bar and per-card tag chips that filter.
- [x] A **stats** card: total logged, worked-this-year, most-worked movement type, and counts-by-status pills.
- [x] A per-entry **service-history timeline** — dated notes editable in the modal, rendered as a dotted timeline on the card (first 3 + “more”).
- [x] **JSON import** — `logBulkPut` in `src/lib/db.js` (one transaction, `put` dedupes by id) + an Import file-input button beside Export.

**Approach:** extended the existing IndexedDB layer and page; additive `tags[]` / `history[]` fields, no migration.
**Dependencies:** none.
**Done when:** the log supports search + filters + sort + tags, shows a stats summary, and imports a previously-exported JSON. ✅ All verified end-to-end (import → filter → edit-history → persist → reload); build clean (76 modules).

---

## Track C — Depth & Correctness

### C1 · Quartz source & section — **M** — ✅ SHIPPED
**✅ Shipped:** two new lessons (`quartz-how` “Inside a quartz movement”, `quartz-test` “Test a quartz movement with a multimeter”), a `quartz-electronics` reference article (crystal/IC/coil/stepper + a multimeter test table + calibre families), and a dedicated `quartz-dead` diagnostic flowchart — all auto-indexed in global search. The article now also carries a quartz **calibre cross-reference table** (Miyota 2035, Ronda 763/715/5030.D, Seiko/Epson VX42 with their cells). An honest “A note on sources” section says this rests on general knowledge, not the (mechanical-only) books. *Still gated:* a real quartz service manual would deepen it further.

**Goal:** give quartz real depth (all six books are mechanical).
- [ ] **Provide a quartz source** — a quartz repair book / manufacturer tech sheets (Ronda, Miyota, ISA) or curated web references.
- [ ] Add a Quartz reference article in `reference.js` (IC/coil/stepper, multimeter testing, calibre families, module-vs-repair).
- [ ] Deepen the Quartz track lessons and add a quartz diagnostic flowchart (pairs with A2).

**Approach:** same as the mechanical books — read the source, write original/paraphrased, cite it on the Sources page.
**Dependencies:** **a quartz source from you** (like you supplied the mechanical books).
**Done when:** the quartz content no longer rests solely on general knowledge and cites a real source.

### C2 · Upgrade the remaining schematic diagrams — **L** — ✅ SHIPPED
**✅ Shipped:** **Case** redrawn as a truer cross-section (crystal seat + tension ring, gasket O-rings in their grooves, caseback screw threads, crown tube with gasket, movement ring, front/back-loader-friendly). **Quartz** module rebuilt (routed PCB traces/pads, a wound bobbin coil, a stator-and-rotor stepper) and **animated** — the rotor flips 180° once a second with the coil pulsing (`.quartz-rotor-anim` / `.quartz-pulse-anim`, reduced-motion guarded). **Chronograph** column wheel regeared to a saw-tooth ratchet base + raised pillars, keeping the A3 Start/Stop/Reset animation intact.

**Goal:** bring Case, Quartz, and Chronograph up to the Mechanical/Escapement bar.
- [ ] **Case** (`Case.jsx`): truer cross-section proportions — gasket seats, crystal seat, caseback threads, crown tube — with consistent lighting.
- [ ] **Quartz** (`Quartz.jsx`): more realistic module (PCB traces, coil winding, stepper rotor); animate the stepper (with A3).
- [ ] **Chronograph** (`Chronograph.jsx`): accurate column-wheel + clutch geometry (do alongside the A3 animation).

**Approach:** reuse the primitives + lighting; the chronograph work is shared with A3.
**Dependencies:** chronograph overlaps A3.
**Done when:** the three diagrams match the quality of Mechanical/Escapement.

### C3 · Flagship real-caliber service (ETA/Unitas 6497) — **L** — ✅ SHIPPED
**✅ Shipped:** `svc-6497` “Flagship service: the ETA/Unitas 6497” — a full worked service with real specs (36.6 mm, 18,000 A/h, 17 jewels, lift angle 53°, ~50 h), the left-hand crown-wheel-screw gotcha, teardown order, a 6497-specific oiling map (9010 / HP-1300 / 9415 / 8200, hairspring & roller never oiled), the free-train air test, and regulation targets. Reuses the `AssemblyWalkthrough` (`embed: 'assembly'`) as its visual, and a companion `cal-6497` **reference article** adds a specs table (36.6 mm, 18,000 A/h, 17 j, lift 53°, ~50 h, Seagull ST36 clone) and a 6497 oiling-points table. *Still ideal:* real macro photos per step.

**Goal:** one end-to-end worked service of a real, documented movement.
- [ ] A multi-part 6497 walkthrough — either a photo step-gallery or the SVG movement tuned to 6497 tooth counts (reuse `AssemblyWalkthrough`).
- [ ] Specific 6497 part names, oiling points, and specs per step.
- [ ] Ideally **real macro photos** per step (your own, since the book photos are copyrighted; the 1911 Waltham catalogue is public domain but not a 6497).

**Approach:** reuse the assembly component and/or a photo gallery; specificity is the point.
**Dependencies:** photos (optional but ideal).
**Done when:** a start-to-finish 6497 service exists with real part names, specs, and step visuals.

---

## Track D — Polish

### D1 · Light theme + keyboard-operable diagrams — **M** — ✅ SHIPPED
**✅ Shipped:** a warm-paper **light theme** via `:root[data-theme="light"]` token overrides, an inline pre-paint script in `index.html` (no flash), a persisted toggle in the sidebar + mobile bar (respects `prefers-color-scheme` on first visit); diagram panels stay dark in both. **A11y:** `Part.jsx` parts are now `tabIndex`/`role="button"`/`aria-label`/`aria-pressed`, Enter/Space select, with a visible `:focus-visible` outline; the Anatomy info panel is an `aria-live` region.

**Goal:** a light mode and accessible diagrams.
- [ ] **Light theme:** define a light palette on bare `:root`, override dark under `[data-theme="dark"]` / `prefers-color-scheme`; a toggle persisted in localStorage. Keep the diagram panels dark in both themes (simplest, still looks right).
- [ ] **A11y:** make clickable SVG parts focusable in `src/components/diagrams/Part.jsx` (`tabIndex`, `role="button"`, Enter/Space to select) with visible focus outlines; add an `aria-live` region for the selected-part info.

**Approach:** the CSS is currently dark-hardcoded in `:root`; refactor to tokens with a theme override. Part.jsx gains keyboard handlers.
**Dependencies:** none.
**Done when:** a working light/dark toggle, and diagram parts operable by keyboard with visible focus.

### D2 · Printable cheat-sheets — **S** — ✅ SHIPPED
**✅ Shipped:** a `Cheatsheets.jsx` page (nav `/cheatsheets`, `IconPrint`) gathering five tables — oiling chart, water resistance, the 26-cell battery cross-reference, lug/strap sizing, and common calibres — reusing the reference/`batteries.js` data. A “Print these” button and an `@media print` stylesheet drop the nav/chrome, force clean B/W tables, and keep each sheet from breaking across pages.

**Goal:** clean bench-printable one-pagers.
- [ ] A print stylesheet (`@media print`) that formats the key tables (oiling chart, water-resistance, tap sizes, battery cross-ref) cleanly in B/W.
- [ ] A `src/pages/Cheatsheets.jsx` aggregating those tables + a "Print" button (and/or print buttons on reference articles).

**Approach:** print CSS + a dedicated print-friendly page.
**Dependencies:** none.
**Done when:** printing the cheatsheets page yields a clean one-pager.

### D3 · Micro-accuracy: `mech-uncase` + `mech-diagnose` — **S** — ✅ SHIPPED
**✅ Shipped:** `mech-uncase` now distinguishes back-loaders from front-loaders, covers movement rings/spacers, and keeps the stem-and-crown safe; `mech-diagnose` adds positional stopping, the cannon-pinion “seconds sweep but hands don’t move” symptom, amplitude/trace interpretation, and the knocking-rotor case — all standard practice consistent with the Maintaining book’s fault-finding and uncasing chapters.

**Goal:** deep-sweep the two lessons only lightly checked.
- [ ] Cross-check `mech-uncase` against the Maintaining book ch.10 (removing the movement from its case).
- [ ] Cross-check `mech-diagnose` against the book's fault-finding notes; correct in `src/data/lessons.js`.

**Dependencies:** none.
**Done when:** both lessons are cross-checked and corrected against the book.

---

## Recommended sequence

| Phase | Items | Why |
| --- | --- | --- |
| **1 — Interactive Trainer** ✅ | A1 Quizzes → A2 Flowcharts → A3 Animate mechanisms | **Done.** Highest learning value; turns the "book" into a trainer. A1/A2 are quick and reinforce each other. |
| **2 — Bench Tool** ✅ | B1 Search → B2 Calculators → B3 Log upgrades | **Done.** Makes it a daily utility; search first (it helps everything). |
| **3 — Depth** ✅ | C1 Quartz → C2 Diagram upgrades → C3 6497 flagship | **Done.** C1/C3 built from general/standard knowledge; a quartz manual + 6497 photos would still deepen them. |
| **4 — Polish** ✅ | D1 Theme + a11y → D2 Cheat-sheets → D3 mech micro-touches | **Done.** |
| **5 — Expansion** ✅ | Movement Guides → NH35 + 2824 walkthroughs → First Project track → Calendar animation → Test Yourself polish | **Done** (the "future work" from the last plan). |

---

## Phase 5 — Expansion (shipped)

Net-new work beyond the original A–D roadmap:

- **E1 · Movement Guides library** ✅ — `src/data/movements.js` (15 key calibres: NH35/36, 7S26, 4R36, Miyota 8215/9015, ETA 2824/2892, Sellita SW200, Valjoux 7750, 6497, plus Ronda/Miyota/Epson quartz) + `src/pages/Movements.jsx` (`/movements`, grouped by type, filter + search, links to full walkthroughs). Indexed in ⌘K search as a new "Movement" type.
- **E2 · Real-caliber walkthroughs** ✅ — full service lessons `svc-nh35` (Magic Lever, Diashock, braking grease, hacking) and `svc-2824` (reverser winding, the Etachron regulator), same treatment as the 6497, both embedding the assembly walkthrough. *(Provided resource had no NH35 content, so these are accurate general-knowledge, not sourced from it.)*
- **E3 · Guided "Your First Project" track** ✅ — a new opening track of 5 projects (strap → battery → open & identify → module swap → full 6497 service → what next) that ties the existing lessons into one hand-held arc.
- **E4 · Complications deep-dive** ✅ — a new **animated Calendar (date works)** anatomy diagram: the driving wheel spins, the 31-tooth date ring steps once per "day", numbers cycle past the window, with jumper and quick-set parts labelled.
- **E5 · Test Yourself polish** ✅ — answer **options now shuffle** (with correct-index remap), a **"Review weak spots"** mode pulls questions from lessons you scored below full, and the Learn page shows **per-track done counts + quiz scores**.
- **E10 · Complete illustration pass** ✅ — every static drawing in the app is now a painterly illustration. Set 3 replaced the **6 technical plates** and **14 in-lesson step figures** (remapped at the resolver, so no lesson data changed) plus a **service-sequence** exploded teardown stack as the 17th interactive plate. Set 4 added **10 restoration-bench subjects** that previously had no artwork at all — staking set, poising tool, Jacot tool, lathe, case refinishing, radium safety setup, alum screw extraction, solar/rechargeable cells, mainspring winder, and parts/measuring. **48 illustrations total.** The 8 animated anatomy diagrams and the assembly walkthrough stay SVG by design — they move.
- **E9 · Second coverage audit — practical gaps** ✅ — a follow-up audit found what the restoration track didn't cover. Added: **Solar, Eco-Drive & Kinetic watches** (rechargeable-cell watches and the destructive mistake of fitting a silver-oxide primary cell), **Broken screws & damaged threads** (the alum trick, extraction, re-tapping, broken stems), **Service the automatic module** (reverser dip-lubrication, rotor bearings, Seiko's Magic Lever), and **Sourcing parts & reading part numbers** (Swiss numbering, donors, material houses, measuring). Folded in six-position timing + isochronism (`svc-test`), the depthing tool (`rest-jewel`), and hand bluing (`rest-case`). *Deliberately out of scope:* digital-display watches, LCD modules and smartwatches. App now **83 lessons / 11 tracks**.
- **E8 · Restoration & Bench Skills + radium safety** ✅ — closed the eight gaps a coverage audit found. New **Restoration & Bench Skills** track (7 lessons): balance-staff replacement & staking, static/dynamic poising, hairspring truing/centring/vibrating, jewelling (Seitz/Horia, end-shake by depth, bushing), pivot burnishing & the Jacot tool, escapement adjustment & shellac (incl. the alcohol-dissolves-shellac cleaning trap), and case refinishing & dial ethics. Plus **`shop-radium` — Radium & vintage lume safety** in Workshop & Safety, the one gap that was a genuine health issue rather than a scope choice. Toolkit gained a **Restoration** group (staking set, jewelling tool, poising tool, Jacot tool, lathe, roller/collet removers, shellac & warmer, Geiger counter). App now **79 lessons / 11 tracks**.
- **E7 · Illustrated plates embedded in lessons** ✅ — a new `illus:<id>` figure convention (`StepFigures.jsx` → `LessonIllustration.jsx`) renders any illustrated plate *inline inside a lesson step*, with its numbered hotspots clickable and a caption that swaps to the selected part, plus an "Open full plate →" link. All **16 plates are now embedded in their matching lessons** — e.g. the 6497 plate in its flagship service (click 2 for the left-hand crown-wheel-screw warning), the exploded shock setting in `svc-shock`, the escapement in the oiling lesson (showing exactly which surfaces get oil), the exploded train in `svc-reassemble`, and the tool flat-lay in `shop-setup`.
- **E6 · Illustrated Plates (hybrid raster + interactive)** ✅ — a new `/illustrated` section where painterly artwork gets an accurate, clickable hotspot overlay: 4 planned plates (full movement, escapement, balance, automatic) with in-app **generation prompts to copy** (images must contain no text — the app supplies the labels), a missing-art state, and a **position mode** that click-reads percent coordinates for calibrating dots to your image. Drop art into `public/illustrations/` and it lights up. Plus a subtle materials pass (smoother brass/steel/gold gradients) across all vector diagrams. *Gated on you: generating the artwork with an image tool — code can't paint raster art.*

**Still the only input-gated items:** a real quartz service manual (to source the quartz section) and real 6497/NH35 macro photos. Everything buildable is built.
