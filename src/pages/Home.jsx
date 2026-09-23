import { Link } from 'react-router-dom'
import { allLessons } from '../data/lessons.js'
import { DIAGRAMS } from '../data/anatomy.js'
import { ILLUSTRATIONS } from '../data/illustrations.js'
import { MOVEMENTS } from '../data/movements.js'
import { GLOSSARY } from '../data/glossary.js'
import { REFERENCE } from '../data/reference.js'
import { TOOLS } from '../data/tools.js'
import { useProgress } from '../context/ProgressContext.jsx'
import asset from '../lib/asset.js'
import {
  IconArrow,
  IconClock,
  IconCompass,
  IconCheck,
  IconLog,
  IconCalc,
  IconLayers,
  IconGlossary,
  IconBook,
} from '../components/Icons.jsx'

// Image-led doorways — a gallery you navigate the app through, the way a
// photography app opens onto its albums. `span` widens a tile to two columns
// so the grid breathes; the four rows below stay gapless on a 3-up grid.
const BLOCKS = [
  {
    to: '/learn',
    img: 'service-sequence',
    kicker: `${allLessons().length} lessons`,
    title: 'Learn',
    blurb: `Eleven guided tracks, strap change to full service.`,
    span: 2,
  },
  {
    to: '/anatomy',
    img: 'train',
    kicker: `${DIAGRAMS.length} diagrams`,
    title: 'Anatomy Explorer',
    blurb: 'Click through every part and see what it does.',
  },
  {
    to: '/movements',
    img: 'nh35',
    kicker: `${MOVEMENTS.length} calibres`,
    title: 'Movement Guides',
    blurb: 'Real movements, mapped part by part.',
  },
  {
    to: '/illustrated',
    img: 'balance',
    kicker: `${ILLUSTRATIONS.length} plates`,
    title: 'Illustrated Plates',
    blurb: 'Rendered art with interactive labels.',
  },
  {
    to: '/plates',
    img: 'plate-escapement-geometry',
    kicker: '6 plates',
    title: 'Technical Plates',
    blurb: 'The geometry behind the beat, drawn.',
  },
  {
    to: '/assembly',
    img: 'fig-exploded',
    kicker: 'Walkthrough',
    title: 'Assembly',
    blurb: 'Take a movement apart and build it back up.',
    span: 2,
  },
  {
    to: '/timegrapher',
    img: 'fig-timegrapher',
    kicker: 'Bench tool',
    title: 'Timegrapher',
    blurb: 'Measure rate and beat error by ear.',
  },
  {
    to: '/diagnose',
    img: 'fig-watertest',
    kicker: 'Troubleshoot',
    title: 'Diagnose',
    blurb: 'Walk a symptom back to its fault.',
  },
  {
    to: '/sourcing',
    img: 'fig-parts',
    kicker: 'Sourcing',
    title: 'Parts & Supplies',
    blurb: 'Kits, consumables and where to buy them.',
  },
  {
    to: '/tools',
    img: 'tools',
    kicker: `${TOOLS.length} tools`,
    title: 'Toolkit',
    blurb: 'Your bench, itemised and explained.',
  },
]

// Quick-lookup corners — text tiles, a deliberate contrast to the image
// gallery, the way a photo app tucks utilities behind a plainer row.
const REF = [
  { to: '/test', Icon: IconCheck, title: 'Test Yourself', sub: 'Quiz & spaced review' },
  { to: '/log', Icon: IconLog, title: 'Practice Log', sub: 'Your bench notebook' },
  { to: '/calculators', Icon: IconCalc, title: 'Calculators', sub: 'Rate, lift angle & more' },
  { to: '/cheatsheets', Icon: IconLayers, title: 'Cheat-sheets', sub: 'Quick reference cards' },
  { to: '/glossary', Icon: IconGlossary, title: 'Glossary', sub: `${GLOSSARY.length} terms` },
  { to: '/reference', Icon: IconBook, title: 'Reference', sub: `${REFERENCE.length} references` },
]

export default function Home() {
  const { completedCount, reviewStats } = useProgress()
  const total = allLessons().length
  const rs = reviewStats()
  const pct = total ? Math.round((completedCount / total) * 100) : 0

  return (
    <main className="content home">
      {rs.due > 0 && (
        <Link to="/test" className="card review-nudge">
          <div className="review-nudge__icon">
            <IconClock size={22} />
          </div>
          <div className="review-nudge__text">
            <b>
              {rs.due} lesson{rs.due === 1 ? '' : 's'} due for review
            </b>
            <span>Spaced repetition schedules these when you’re about to forget them. A few minutes keeps them sharp.</span>
          </div>
          <span className="review-nudge__go">
            Review <IconArrow size={16} />
          </span>
        </Link>
      )}

      {/* Featured cover — the shelf you open the workshop from */}
      <section className="cover">
        <img className="cover__img" src={asset('/illustrations/mechanical.webp')} alt="" loading="eager" />
        <div className="cover__scrim" />
        <div className="cover__body">
          <div className="cover__eyebrow">Movement · Watch craft</div>
          <h1>Understand the machine on your wrist.</h1>
          <p>
            From swapping a strap to servicing a mechanical movement — and building a
            watch of your own.
          </p>
          <div className="cover__cta">
            <Link to="/guide" className="btn cover-btn cover-btn--solid">
              <IconCompass size={17} /> Guide me
            </Link>
            <Link to="/learn/basics-strap" className="btn cover-btn cover-btn--ghost">
              Start with the basics
            </Link>
          </div>
          {completedCount > 0 && (
            <div className="cover__progress" aria-label={`${completedCount} of ${total} lessons complete`}>
              <div className="cover__bar">
                <i style={{ width: `${pct}%` }} />
              </div>
              <span>
                {completedCount} of {total} lessons complete
              </span>
            </div>
          )}
        </div>
      </section>

      {/* The gallery — image doorways into every part of the app */}
      <div className="gallery">
        {BLOCKS.map((b) => (
          <Link key={b.to} to={b.to} className={`tile${b.span === 2 ? ' tile--wide' : ''}`}>
            <img className="tile__img" src={asset(`/illustrations/${b.img}.webp`)} alt="" loading="lazy" />
            <div className="tile__scrim" />
            <div className="tile__body">
              <span className="tile__kicker">{b.kicker}</span>
              <h3>{b.title}</h3>
              <p>{b.blurb}</p>
            </div>
            <span className="tile__go" aria-hidden="true">
              <IconArrow size={16} />
            </span>
          </Link>
        ))}
      </div>

      <div className="section-title">
        <h2>Reference desk</h2>
      </div>
      <div className="refdesk">
        {REF.map(({ to, Icon, title, sub }) => (
          <Link key={to} to={to} className="card refchip">
            <div className="refchip__icon">
              <Icon size={20} />
            </div>
            <div className="refchip__text">
              <b>{title}</b>
              <span>{sub}</span>
            </div>
            <IconArrow size={15} className="refchip__go" />
          </Link>
        ))}
      </div>
    </main>
  )
}
