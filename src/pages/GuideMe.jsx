import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { allLessons } from '../data/lessons.js'
import { GUIDE_GOALS, LEVELS, PATHS, MOVEMENT_FLAGSHIP, MOVEMENT_CHIPS } from '../data/paths.js'
import { useProgress } from '../context/ProgressContext.jsx'
import {
  IconStrap,
  IconAnatomy,
  IconGear,
  IconBuild,
  IconTools,
  IconAlert,
  IconArrow,
  IconClock,
  IconStethoscope,
  IconCheck,
} from '../components/Icons.jsx'

const GOAL_ICON = { strap: IconStrap, anatomy: IconAnatomy, gear: IconGear, build: IconBuild, tools: IconTools, alert: IconAlert }

// Rough reading-time estimate from a lesson's step count (real data).
const lessonMins = (l) => Math.max(4, Math.round((l?.steps?.length || 4) * 2.2))

export default function GuideMe() {
  const navigate = useNavigate()
  const { isDone, dueLessonIds } = useProgress()
  const lessonMap = useMemo(() => {
    const m = {}
    for (const l of allLessons()) m[l.id] = l
    return m
  }, [])

  const [goalId, setGoalId] = useState(null)
  const [level, setLevel] = useState(null)
  const [move, setMove] = useState(null)
  const [built, setBuilt] = useState(false)

  const goal = GUIDE_GOALS.find((g) => g.id === goalId) || null
  const hasFlagship = goalId && PATHS[goalId] && PATHS[goalId].flagship

  // Resolve the ordered, level-tuned, calibre-swapped step list.
  const steps = useMemo(() => {
    if (!goal || goal.diagnose) return []
    const p = PATHS[goalId]
    if (!p) return []
    const start = p.starts[level] ?? 0
    let list = p.steps.slice(start)
    if (p.flagship && move && MOVEMENT_FLAGSHIP[move]) {
      list = list.map((s) => (s.id === p.flagship ? { ...s, id: MOVEMENT_FLAGSHIP[move] } : s))
    }
    return list.map((s) => ({ ...s, lesson: lessonMap[s.id] })).filter((s) => s.lesson)
  }, [goal, goalId, level, move, lessonMap])

  const doneCount = steps.filter((s) => isDone(s.id)).length
  const nextIdx = steps.findIndex((s) => !isDone(s.id))
  const nextStep = nextIdx >= 0 ? steps[nextIdx] : null
  const dueInPath = useMemo(() => {
    const due = new Set(dueLessonIds())
    return steps.filter((s) => due.has(s.id)).map((s) => s.lesson)
  }, [steps, dueLessonIds])

  const reset = () => {
    setGoalId(null)
    setLevel(null)
    setMove(null)
    setBuilt(false)
    window.scrollTo(0, 0)
  }

  // ---- goal picker ----
  if (!goal) {
    return (
      <main className="content">
        <div className="page-head">
          <div className="page-head__eyebrow">Guide me</div>
          <h1>What do you want to do?</h1>
          <p>
            Tell me your goal and I’ll lay out the exact lessons to get there — in order, with the
            reason for each, and skipping what you’ve already done.
          </p>
        </div>
        <div className="guide-goals">
          {GUIDE_GOALS.map((g) => {
            const Icon = GOAL_ICON[g.icon] || IconGear
            return (
              <button
                key={g.id}
                className={`card guide-goal ${g.accent}`}
                onClick={() => {
                  setGoalId(g.id)
                  window.scrollTo(0, 0)
                }}
              >
                <span className="guide-goal__ico">
                  <Icon size={20} />
                </span>
                <h3>{g.title}</h3>
                <p>{g.blurb}</p>
                <span className="guide-goal__go">
                  {g.diagnose ? 'Diagnose' : 'Build my path'} <IconArrow size={14} />
                </span>
              </button>
            )
          })}
        </div>
      </main>
    )
  }

  // ---- fix → hand off to Diagnose ----
  if (goal.diagnose) {
    return (
      <main className="content">
        <button className="back-link" onClick={reset}>
          <IconArrow size={14} style={{ transform: 'rotate(180deg)' }} /> All goals
        </button>
        <div className="page-head">
          <div className="page-head__eyebrow">Fix a specific problem</div>
          <h1>Let’s find the fault first</h1>
        </div>
        <div className="card guide-diag">
          <IconStethoscope size={26} />
          <div>
            <h3>This one hands you to the diagnostic trees</h3>
            <p>
              Answer a few plain questions — won’t run, keeps bad time, water got in — and reach the
              likely cause and the exact lesson that fixes it. No point prescribing a path until we
              know what’s wrong.
            </p>
            <Link to="/diagnose" className="btn btn--solid">
              Open Diagnose <IconArrow size={15} />
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // ---- experience question ----
  if (!built) {
    return (
      <main className="content">
        <button className="back-link" onClick={reset}>
          <IconArrow size={14} style={{ transform: 'rotate(180deg)' }} /> All goals
        </button>
        <div className="page-head">
          <div className="page-head__eyebrow">{goal.title}</div>
          <h1>How much have you done before?</h1>
          <p>This just tunes where your path starts — you can always go earlier.</p>
        </div>
        <div className="guide-opts">
          {LEVELS.map((l) => (
            <button
              key={l.id}
              className={`guide-opt ${level === l.id ? 'sel' : ''}`}
              onClick={() => setLevel(l.id)}
            >
              <b>{l.label}</b>
              <span className="guide-opt__note">{l.note}</span>
              {level === l.id ? <IconCheck size={16} /> : <IconArrow size={16} />}
            </button>
          ))}
        </div>
        {hasFlagship && (
          <>
            <p className="guide-qlabel">
              Which movement? <span className="guide-qlabel__opt">(optional — swaps the final walkthrough)</span>
            </p>
            <div className="guide-chips">
              {MOVEMENT_CHIPS.map((m) => (
                <button
                  key={m}
                  className={`chip ${move === m ? 'active' : ''}`}
                  onClick={() => setMove(move === m ? null : m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </>
        )}
        <div className="guide-cta">
          <button
            className="btn btn--solid"
            disabled={!level}
            onClick={() => {
              setBuilt(true)
              window.scrollTo(0, 0)
            }}
          >
            Build my path <IconArrow size={16} />
          </button>
        </div>
      </main>
    )
  }

  // ---- the plan ----
  const lvl = LEVELS.find((l) => l.id === level)
  const totalMins = steps.reduce((n, s) => n + lessonMins(s.lesson), 0)
  const est = totalMins >= 90 ? `about ${Math.round(totalMins / 60)} hours of reading` : `about ${totalMins} min of reading`

  return (
    <main className="content">
      <button className="back-link" onClick={reset}>
        <IconArrow size={14} style={{ transform: 'rotate(180deg)' }} /> All goals
      </button>
      <div className="page-head">
        <div className="page-head__eyebrow">Your path</div>
        <h1>{goal.title}</h1>
      </div>

      <div className="guide-meta">
        <span>
          <b>{steps.length}</b> lessons
        </span>
        <span>{est}</span>
        <span>
          tuned for: <b>{lvl.label.toLowerCase()}</b>
          {move && move !== 'Not sure yet' ? (
            <>
              {' '}
              · <b>{move}</b>
            </>
          ) : null}
        </span>
      </div>

      {doneCount > 0 && (
        <div className="guide-prog">
          <div className="guide-prog__bar">
            <i style={{ width: `${Math.round((doneCount / steps.length) * 100)}%` }} />
          </div>
          <div className="guide-prog__label">
            {doneCount} of {steps.length} done — your plan picks up where you left off
          </div>
        </div>
      )}

      {dueInPath.length > 0 && (
        <Link to="/test" className="card guide-review">
          <IconClock size={18} />
          <span>
            <b>
              {dueInPath.length} lesson{dueInPath.length === 1 ? '' : 's'} due for review
            </b>{' '}
            — {dueInPath[0].title}
            {dueInPath.length > 1 ? ' and more' : ''}. Spaced repetition scheduled it.
          </span>
          <span className="guide-review__go">Review →</span>
        </Link>
      )}

      <ol className="guide-steps">
        {steps.map((s, i) => {
          const done = isDone(s.id)
          const isNext = s === nextStep
          return (
            <li key={s.id} className={`guide-step ${done ? 'done' : ''} ${isNext ? 'next' : ''}`}>
              <Link to={`/learn/${s.id}`} className="guide-step__link">
                <span className="guide-step__n">{done ? <IconCheck size={15} /> : i + 1}</span>
                <span className="guide-step__body">
                  <span className="guide-step__title">{s.lesson.title}</span>
                  <span className="guide-step__why">{s.why}</span>
                </span>
                <span className="guide-step__side">
                  {isNext && <span className="pill brass">Next</span>}
                  {done && <span className="pill emerald">Done</span>}
                  <span className="guide-step__mins">{lessonMins(s.lesson)} min</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ol>

      <div className="guide-foot">
        {nextStep ? (
          <button className="btn btn--solid" onClick={() => navigate(`/learn/${nextStep.id}`)}>
            {doneCount > 0 ? 'Continue' : 'Start first lesson'} <IconArrow size={16} />
          </button>
        ) : (
          <span className="pill emerald">Path complete — nicely done</span>
        )}
        <small>Your path updates as you finish lessons.</small>
      </div>
    </main>
  )
}
