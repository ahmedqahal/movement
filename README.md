# Movement — Watch Building & Repair

An offline-first learning app for people who want to maintain and repair their own watches.
83 lessons across 11 tracks, from a first strap change to a full mechanical service, with
interactive diagrams, illustrated plates, diagnostics, bench calculators and a practice log.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # production build into dist/ (runs content checks first)
npm run preview  # serve the built app
npm test         # content integrity checks
```

## What's inside

| | |
| --- | --- |
| **Learn** | 83 lessons / 11 tracks, incl. a guided *First Project* arc and flagship services for the ETA 6497, Seiko NH35 and ETA 2824 |
| **Anatomy Explorer** | 9 interactive diagrams — the escapement, keyless works, chronograph, quartz stepper and calendar are animated |
| **Illustrated Plates** | 17 painterly plates with clickable, accurate hotspot labels |
| **Movement Guides** | 15 key calibres: specs, character, common faults, service notes |
| **Diagnose** | 5 clickable decision trees that end in a diagnosis and a link to the fix |
| **Test Yourself** | Per-lesson quizzes plus a shuffled random test and a *review weak spots* mode |
| **Bench tools** | 6 calculators, printable cheat-sheets, glossary, reference guides |
| **Practice Log** | Private IndexedDB journal with photos, tags, stats, and JSON import/export |

Everything is local: progress lives in `localStorage`, the practice log in IndexedDB, and the
whole app — including all 47 illustrations — is precached for offline use.

## Architecture

Vite + React (JavaScript, no TypeScript), `react-router-dom` with `HashRouter`, and
`vite-plugin-pwa`. There is no backend and no analytics.

Content is data-driven — `src/data/*.js` holds lessons, anatomy, movements, flowcharts,
illustrations, glossary, tools and reference articles. Adding a lesson means editing one array.

Figures resolve through `src/components/StepFigures.jsx`:

- `figure: 'oiling'` — a named figure (illustration, falling back to the original SVG)
- `figure: 'plate:depthing'` — a technical plate
- `figure: 'illus:nh35'` — an illustrated plate with interactive hotspots

Diagrams that animate or respond to input stay as hand-authored SVG; everything static is a
WebP illustration. Prompts used to generate the artwork are kept in `ILLUSTRATION-PROMPTS*.md`.

## Content checks

`npm test` runs `scripts/check-data.mjs`, which verifies that every figure reference resolves,
every flowchart links to a lesson that exists, every illustration file is present, quiz answer
indices are in range, and ids are unique. It runs automatically before every build, so broken
content can't ship.

## Deploying

The build output is a static site. Config is included for three hosts:

- **Netlify** — `netlify.toml`; `npx netlify-cli deploy --prod`
- **Vercel** — `vercel.json`; `npx vercel --prod`
- **GitHub Pages** — live at <https://ahmedqahal.github.io/movement/>, served from
  the `gh-pages` branch (Settings → Pages → Source: *Deploy from a branch*, branch
  `gh-pages`, folder `/`). Deployment is manual — build with the repo subpath, then
  publish `dist/`:

  ```bash
  VITE_BASE=/movement/ npm run build
  npx gh-pages -d dist
  ```

  `VITE_BASE` sets Vite's `base` at build time only, so `npm run dev` and the
  root-domain hosts above stay on `/`. Asset paths resolve through
  `src/lib/asset.js`, so nothing else needs changing.

## Sources & safety

Content is written original/paraphrased and cross-checked against the reference works credited
in the app's *Sources & further reading* article. See also the in-app *Safety notice &
disclaimer*: watch repair involves real hazards, and this app is not a substitute for training
or a manufacturer's service manual.

## Licence

MIT — see [LICENSE](LICENSE).
