# Movement — Learn Watch Building & Repair

A visual, hands-on web app for learning to build and repair watches. Interactive
diagrams, a large library of step-by-step lessons and reference guides, and a
personal practice log — installable as an offline app on your phone or desktop.

## Running it

```bash
npm install     # first time only
npm run dev     # start the app, then open the printed http://localhost:5173 URL
```

Other commands:

```bash
npm run build        # production build into dist/ (also builds the PWA service worker)
npm run preview      # preview the production build (test install / offline here)
node scripts/gen-icons.mjs   # regenerate app icons from the built-in SVG
```

## What's inside

- **Home** — your learning paths and progress at a glance.
- **Anatomy Explorer** — **8 interactive diagrams** with realistic, metallic artwork.
  Click any numbered part to learn what it does:
  mechanical movement · escapement (animated) · automatic winding (animated) ·
  keyless works · chronograph · quartz module · case cross-section · service sequence.
- **Technical Plates** — clean, labelled recreations of classic book figures: the lever
  escapement geometry, the lock/draw/impulse sequence, balance truing, hairspring forms,
  the compensating balance, and wheel-and-pinion depthing (sourced from the reference texts).
- **Assembly** — a step-by-step animated walkthrough: the movement builds up part by part in
  reassembly order (Back / Play / Next, ← → keys), and the escapement runs on the last step.
- **Learn** — **~50 step-by-step lessons** across 9 tracks:
  How a Watch Works · Straps, Case & Everyday Care · Quartz Repair ·
  Mechanical Movement Skills · Servicing a Movement · Diagnostics & Troubleshooting ·
  Chronographs & Complications · Build Your Own Watch · Workshop & Safety.
  Each lesson has illustrated steps, the tools you'll need, tips, and safety cautions.
- **Reference** — in-depth field guides with tables: movement families, water
  resistance, oiling charts, tool buying, battery cross-reference, sizing,
  materials, and accuracy.
- **Toolkit** — the essential watchmaker's tools and what each is for.
- **Glossary** — searchable horology terms.
- **Practice Log** — record every watch you work on (movement, calibre, work done,
  status, notes, and **photos**), stored privately on your device. Export a JSON backup.

Lesson progress is saved in the browser; practice-log entries and photos are stored
in IndexedDB on your device.

## Install it as an app (PWA)

This is a Progressive Web App, so it can be installed and used offline:

1. Run `npm run build` then `npm run preview` (a service worker only runs on a real build, not the dev server).
2. Open the preview URL in a browser.
3. **Desktop (Chrome/Edge):** click the install icon in the address bar.
   **iPhone/iPad (Safari):** Share → *Add to Home Screen*.
   **Android (Chrome):** menu → *Install app*.

Once installed it launches full-screen with its own icon and works without a connection.
To host it online, deploy the contents of `dist/` to any static host.

## How it's built

- **Vite + React**, no backend — a fully static, offline-capable app.
- All artwork is **hand-drawn SVG** with metallic gradients, so every diagram stays
  crisp and is easy to edit.
- **vite-plugin-pwa** generates the service worker and manifest; app icons are
  generated from an SVG by `scripts/gen-icons.mjs`.

### Where to change things (no framework knowledge needed for content)

| You want to… | Edit this file |
| --- | --- |
| Add/edit a lesson or step | `src/data/lessons.js` |
| Add/edit anatomy part descriptions | `src/data/anatomy.js` |
| Add/edit a reference guide | `src/data/reference.js` |
| Add/edit a tool | `src/data/tools.js` |
| Add/edit a glossary term | `src/data/glossary.js` |
| Change the look (colours, fonts) | `src/index.css` (the `:root` variables at the top) |

Lesson steps can reference an illustration with `figure: '<name>'`; the available
figures live in `src/components/StepFigures.jsx`. The interactive anatomy diagrams
live in `src/components/diagrams/` — one file per diagram, sharing the primitives in
`primitives.jsx`.

## A note on real repairs

The lessons teach real technique, but a screen is no substitute for practice.
Start on cheap watches you can afford to learn on, respect the safety cautions
(especially **letting down the mainspring** before disassembly), and treat any
water-resistance rating as void until the watch has been pressure-tested.
