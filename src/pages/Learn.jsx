import { Link } from 'react-router-dom'
import { TRACKS } from '../data/lessons.js'
import { useProgress } from '../context/ProgressContext.jsx'
import {
  IconStrap,
  IconChip,
  IconGear,
  IconBuild,
  IconCheck,
  IconAnatomy,
  IconTools,
  IconAlert,
  IconClock,
  IconLevel,
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

export default function Learn() {
  const { isDone, quizResult } = useProgress()

  return (
    <main className="content">
      <div className="page-head">
        <div className="page-head__eyebrow">Learn</div>
        <h1>Lessons &amp; tracks</h1>
        <p>
          Nine tracks, from watch theory and everyday care to full servicing, chronographs, and
          building from parts. Work top to bottom, or jump to whatever you need. Tick lessons off as
          you go.
        </p>
      </div>

      {TRACKS.map((t) => {
        const Icon = TRACK_ICON[t.icon] || IconGear
        const doneCount = t.lessons.filter((l) => isDone(l.id)).length
        const quizLessons = t.lessons.filter((l) => l.quiz)
        const taken = quizLessons.filter((l) => quizResult(l.id))
        const gotScore = taken.reduce((s, l) => s + quizResult(l.id).score, 0)
        const gotTotal = taken.reduce((s, l) => s + quizResult(l.id).total, 0)
        return (
          <section key={t.id} style={{ marginBottom: 44 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
              <div className={`pathcard__icon ${t.accent}`} style={{ marginBottom: 0 }}>
                <Icon size={22} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{t.name}</h2>
              </div>
              <div className="track-stats">
                <span className="track-stat">
                  {doneCount}/{t.lessons.length} done
                </span>
                {taken.length > 0 && (
                  <span className="track-stat track-stat--quiz">
                    ★ {gotScore}/{gotTotal} on {taken.length} quiz{taken.length === 1 ? '' : 'zes'}
                  </span>
                )}
              </div>
            </div>
            <p style={{ color: 'var(--text-dim)', maxWidth: '68ch', margin: '4px 0 18px' }}>{t.blurb}</p>

            <div className="lesson-list">
              {t.lessons.map((l, i) => {
                const done = isDone(l.id)
                const qr = l.quiz && quizResult(l.id)
                return (
                  <Link key={l.id} to={`/learn/${l.id}`} className="card lesson-row">
                    <div className="lesson-row__index">{i + 1}</div>
                    <div className="lesson-row__body">
                      <h3>{l.title}</h3>
                      <p>{l.summary}</p>
                      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span className={`pill ${l.level === 'Beginner' ? 'emerald' : l.level === 'Advanced' ? 'ruby' : 'brass'}`}>
                          {l.level}
                        </span>
                        <span className="pill">{l.time}</span>
                        {qr && <span className="lesson-row__quiz">★ Quiz {qr.score}/{qr.total}</span>}
                        {l.quiz && !qr && <span className="lesson-row__quiz" style={{ color: 'var(--text-faint)' }}>Quiz</span>}
                      </div>
                    </div>
                    <div className={`lesson-row__check ${done ? 'done' : ''}`}>
                      {done && <IconCheck size={16} />}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}
    </main>
  )
}
