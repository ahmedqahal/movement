import { Link } from 'react-router-dom'
import { TRACKS, allLessons } from '../data/lessons.js'
import { DIAGRAMS } from '../data/anatomy.js'
import { useProgress } from '../context/ProgressContext.jsx'
import {
  IconStrap,
  IconChip,
  IconGear,
  IconBuild,
  IconArrow,
  IconAnatomy,
  IconClock,
  IconLevel,
  IconTools,
  IconAlert,
} from '../components/Icons.jsx'

const TRACK_ICON = {
  strap: IconStrap,
  chip: IconChip,
  gear: IconGear,
  build: IconBuild,
  anatomy: IconAnatomy,
  tools: IconTools,
  alert: IconAlert,
  clock: IconClock,
  level: IconLevel,
}

function HeroWatch() {
  return (
    <svg viewBox="0 0 260 260" width="240" height="240" aria-hidden="true">
      <defs>
        <radialGradient id="dialg" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#241f19" />
          <stop offset="100%" stopColor="#14110f" />
        </radialGradient>
      </defs>
      <circle cx="130" cy="130" r="120" fill="none" stroke="#3a3128" strokeWidth="10" />
      <circle cx="130" cy="130" r="112" fill="url(#dialg)" stroke="#d0a84f" strokeWidth="1.5" />
      {Array.from({ length: 60 }).map((_, i) => {
        const a = (i / 60) * Math.PI * 2
        const long = i % 5 === 0
        const r1 = long ? 92 : 98
        const x1 = 130 + r1 * Math.cos(a)
        const y1 = 130 + r1 * Math.sin(a)
        const x2 = 130 + 104 * Math.cos(a)
        const y2 = 130 + 104 * Math.sin(a)
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={long ? '#d0a84f' : '#6f6455'} strokeWidth={long ? 2.4 : 1} />
      })}
      {/* subdial with turning gear */}
      <g transform="translate(130,180)">
        <circle r="26" fill="none" stroke="#463c31" strokeWidth="1.5" />
        <g className="spin">
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2
            const x2 = 20 * Math.cos(a)
            const y2 = 20 * Math.sin(a)
            return <line key={i} x1={16 * Math.cos(a)} y1={16 * Math.sin(a)} x2={x2} y2={y2} stroke="#8a7c66" strokeWidth="2" />
          })}
          <circle r="6" fill="#1b1714" stroke="#8a7c66" strokeWidth="1.5" />
        </g>
      </g>
      {/* hands */}
      <g className="tick" style={{ transformOrigin: '130px 130px' }}>
        <line x1="130" y1="130" x2="130" y2="70" stroke="#efe8dc" strokeWidth="4" strokeLinecap="round" />
      </g>
      <line x1="130" y1="130" x2="176" y2="130" stroke="#efe8dc" strokeWidth="3" strokeLinecap="round" transform="rotate(-32 130 130)" />
      <circle cx="130" cy="130" r="6" fill="#d0a84f" />
    </svg>
  )
}

export default function Home() {
  const { isDone, completedCount } = useProgress()
  const lessons = allLessons()

  return (
    <main className="content">
      <section className="card hero">
        <div>
          <div className="page-head__eyebrow">Learn to build &amp; repair watches</div>
          <h1>Understand the machine on your wrist.</h1>
          <p>
            Interactive diagrams and hands-on, step-by-step guides take you from swapping a
            strap to servicing a mechanical movement — and building a watch of your own.
          </p>
          <div className="hero__cta">
            <Link to="/learn/basics-strap" className="btn btn--solid">
              Start with the basics <IconArrow size={17} />
            </Link>
            <Link to="/anatomy" className="btn btn--ghost">
              Explore a movement
            </Link>
          </div>
        </div>
        <div className="hero__art">
          <HeroWatch />
        </div>
      </section>

      <div className="stat-row">
        <div className="card stat">
          <b>{lessons.length}</b>
          <span>Lessons</span>
        </div>
        <div className="card stat">
          <b>{TRACKS.length}</b>
          <span>Tracks</span>
        </div>
        <div className="card stat">
          <b>{DIAGRAMS.length}</b>
          <span>Diagrams</span>
        </div>
        <div className="card stat">
          <b>{completedCount}</b>
          <span>Completed</span>
        </div>
      </div>

      <div className="section-title">
        <h2>Your learning paths</h2>
        <Link to="/learn">All lessons →</Link>
      </div>

      <div className="grid grid--2">
        {TRACKS.map((t) => {
          const Icon = TRACK_ICON[t.icon] || IconGear
          const total = t.lessons.length
          const done = t.lessons.filter((l) => isDone(l.id)).length
          const pct = Math.round((done / total) * 100)
          return (
            <Link key={t.id} to={`/learn/${t.lessons[0].id}`} className="card pathcard">
              <div className={`pathcard__icon ${t.accent}`}>
                <Icon size={24} />
              </div>
              <h3>{t.name}</h3>
              <p>{t.blurb}</p>
              <div className="bar" style={{ marginTop: 10 }}>
                <i style={{ width: `${pct}%` }} />
              </div>
              <div className="pathcard__meta">
                <span>{total} lessons</span>
                <span>·</span>
                <span>{done} done</span>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="section-title">
        <h2>Start anywhere</h2>
      </div>
      <div className="grid grid--3">
        <Link to="/anatomy" className="card pathcard">
          <div className="pathcard__icon steel">
            <IconAnatomy size={24} />
          </div>
          <h3>Anatomy Explorer</h3>
          <p>Click through the parts of mechanical, quartz, and cased watches to see what each does.</p>
        </Link>
        <Link to="/learn/quartz-battery" className="card pathcard">
          <div className="pathcard__icon">
            <IconClock size={24} />
          </div>
          <h3>Change a battery</h3>
          <p>The most common repair there is — a perfect 15-minute first project.</p>
        </Link>
        <Link to="/learn/build-plan" className="card pathcard">
          <div className="pathcard__icon emerald">
            <IconLevel size={24} />
          </div>
          <h3>Build your own</h3>
          <p>Plan a build and assemble a watch from a movement, dial, hands, and case.</p>
        </Link>
      </div>
    </main>
  )
}
