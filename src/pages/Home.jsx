import { Link } from 'react-router-dom'
import { allLessons } from '../data/lessons.js'
import { DIAGRAMS } from '../data/anatomy.js'
import { ILLUSTRATIONS } from '../data/illustrations.js'
import { MOVEMENTS } from '../data/movements.js'
import { GLOSSARY } from '../data/glossary.js'
import { REFERENCE } from '../data/reference.js'
import { TOOLS } from '../data/tools.js'
import { useProgress } from '../context/ProgressContext.jsx'
import {
  IconArrow,
  IconClock,
  IconCompass,
  IconLearn,
  IconAnatomy,
  IconBuild,
  IconGear,
  IconPlate,
  IconLayers,
  IconPulse,
  IconStethoscope,
  IconCart,
  IconTools,
  IconCheck,
  IconLog,
  IconCalc,
  IconGlossary,
  IconBook,
} from '../components/Icons.jsx'

const LESSONS = allLessons().length

// The section launcher: a grid of blocks, one per section — a brass icon,
// a serif title, a one-line "what's inside". Counts come straight from the
// data so a block never advertises a number the app can't back up.
const PRIMARY = [
  { to: '/guide', Icon: IconCompass, title: 'Guide me', sub: 'Find your path' },
  { to: '/learn', Icon: IconLearn, title: 'Learn', sub: `${LESSONS} lessons · 11 tracks` },
  { to: '/anatomy', Icon: IconAnatomy, title: 'Anatomy Explorer', sub: `${DIAGRAMS.length} interactive diagrams` },
  { to: '/assembly', Icon: IconBuild, title: 'Assembly', sub: 'Take it apart, build it back' },
  { to: '/movements', Icon: IconGear, title: 'Movement Guides', sub: `${MOVEMENTS.length} calibres, mapped` },
  { to: '/illustrated', Icon: IconPlate, title: 'Illustrated Plates', sub: `${ILLUSTRATIONS.length} labeled plates` },
  { to: '/plates', Icon: IconLayers, title: 'Technical Plates', sub: 'The geometry, drawn' },
  { to: '/timegrapher', Icon: IconPulse, title: 'Timegrapher', sub: 'Measure rate & beat error' },
  { to: '/diagnose', Icon: IconStethoscope, title: 'Diagnose', sub: 'Trace a symptom to its fault' },
  { to: '/sourcing', Icon: IconCart, title: 'Parts & Supplies', sub: 'Kits, parts & suppliers' },
  { to: '/tools', Icon: IconTools, title: 'Toolkit', sub: `${TOOLS.length} tools, explained` },
  { to: '/test', Icon: IconCheck, title: 'Test Yourself', sub: 'Quiz & spaced review' },
]

const REFDESK = [
  { to: '/log', Icon: IconLog, title: 'Practice Log', sub: 'Your bench notebook' },
  { to: '/calculators', Icon: IconCalc, title: 'Calculators', sub: 'Rate, lift angle & more' },
  { to: '/cheatsheets', Icon: IconLayers, title: 'Cheat-sheets', sub: 'Quick reference cards' },
  { to: '/glossary', Icon: IconGlossary, title: 'Glossary', sub: `${GLOSSARY.length} terms` },
  { to: '/reference', Icon: IconBook, title: 'Reference', sub: `${REFERENCE.length} references` },
]

function Block({ to, Icon, title, sub }) {
  return (
    <Link to={to} className="lblock">
      <span className="lblock__icon">
        <Icon size={22} />
      </span>
      <span className="lblock__title">{title}</span>
      <span className="lblock__sub">{sub}</span>
    </Link>
  )
}

export default function Home() {
  const { completedCount, reviewStats } = useProgress()
  const rs = reviewStats()
  const pct = LESSONS ? Math.round((completedCount / LESSONS) * 100) : 0

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

      <header className="launch-head">
        <div className="launch-head__row">
          <div>
            <h1>Understand the machine on your wrist.</h1>
            <p className="launch-head__sub">{LESSONS} lessons · strap change to a full service</p>
          </div>
        </div>
        {completedCount > 0 && (
          <div className="launch-progress" aria-label={`${completedCount} of ${LESSONS} lessons complete`}>
            <div className="launch-progress__bar">
              <i style={{ width: `${pct}%` }} />
            </div>
            <span>
              {completedCount} of {LESSONS} lessons complete
            </span>
          </div>
        )}
        <div className="launch-rule" />
      </header>

      <div className="launch-grid">
        {PRIMARY.map((b) => (
          <Block key={b.to} {...b} />
        ))}
      </div>

      <div className="section-title">
        <h2>Reference desk</h2>
      </div>
      <div className="launch-grid">
        {REFDESK.map((b) => (
          <Block key={b.to} {...b} />
        ))}
      </div>

      <p className="launch-foot">Works offline · your progress is saved on this device.</p>
    </main>
  )
}
