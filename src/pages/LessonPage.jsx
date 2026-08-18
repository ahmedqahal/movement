import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getLesson } from '../data/lessons.js'
import { useProgress } from '../context/ProgressContext.jsx'
import StepFigure from '../components/StepFigures.jsx'
import AssemblyWalkthrough from '../components/AssemblyWalkthrough.jsx'
import Quiz from '../components/Quiz.jsx'
import { IconArrow, IconCheck, IconAlert, IconBulb, IconClock, IconLevel, IconTools } from '../components/Icons.jsx'

export default function LessonPage() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const { isDone, toggle } = useProgress()
  const lesson = getLesson(lessonId)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [lessonId])

  if (!lesson) {
    return (
      <main className="content">
        <h1>Lesson not found</h1>
        <Link to="/learn" className="btn btn--ghost">Back to lessons</Link>
      </main>
    )
  }

  const track = lesson.track
  const idx = track.lessons.findIndex((l) => l.id === lesson.id)
  const prev = track.lessons[idx - 1]
  const next = track.lessons[idx + 1]
  const done = isDone(lesson.id)

  return (
    <main className="content">
      <article className="lesson-detail">
        <div className="crumb">
          <Link to="/learn">Learn</Link>
          <span>/</span>
          <span style={{ color: 'var(--text)' }}>{track.name}</span>
        </div>

        <div className="page-head__eyebrow">Lesson {idx + 1} of {track.lessons.length}</div>
        <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>{lesson.title}</h1>
        <p style={{ color: 'var(--text-dim)', fontSize: '1.08rem' }}>{lesson.summary}</p>

        <div className="card metabox">
          <div className="m">
            <span><IconLevel size={13} style={{ verticalAlign: -2, marginRight: 4 }} />Level</span>
            <strong>{lesson.level}</strong>
          </div>
          <div className="m">
            <span><IconClock size={13} style={{ verticalAlign: -2, marginRight: 4 }} />Time</span>
            <strong>{lesson.time}</strong>
          </div>
          <div className="m" style={{ flex: 1, minWidth: 220 }}>
            <span><IconTools size={13} style={{ verticalAlign: -2, marginRight: 4 }} />Tools you’ll need</span>
            {lesson.tools.length > 0 ? (
              <div className="tools-inline">
                {lesson.tools.map((t) => (
                  <span key={t} className="pill">{t}</span>
                ))}
              </div>
            ) : (
              <div className="tools-inline">
                <span className="pill emerald">None — reading &amp; watching only</span>
              </div>
            )}
          </div>
        </div>

        {lesson.intro && <p style={{ fontSize: '1.05rem' }}>{lesson.intro}</p>}

        {lesson.embed && lesson.embed.startsWith('assembly') && (
          <section style={{ margin: '24px 0 30px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: 12 }}>
              {lesson.embed === 'assembly-reverse' ? 'Watch it come apart' : 'Watch it come together'}
            </h3>
            <AssemblyWalkthrough key={lesson.id} mode={lesson.embed === 'assembly-reverse' ? 'disassemble' : 'assemble'} />
          </section>
        )}

        <div style={{ marginTop: 22 }}>
          {lesson.steps.map((s, i) => (
            <div className="step" key={i}>
              <div className="step__num">{i + 1}</div>
              <div className="step__body">
                <h3>{s.title}</h3>
                <p>{s.body}</p>

                {s.figure && (
                  <figure className="step__figure" style={{ margin: '14px 0' }}>
                    <StepFigure name={s.figure} />
                    {s.caption && <figcaption className="step__figcaption">{s.caption}</figcaption>}
                  </figure>
                )}

                {s.caution && (
                  <div className="callout caution">
                    <IconAlert size={20} />
                    <div className="callout__body">
                      <strong>Caution</strong>
                      {s.caution}
                    </div>
                  </div>
                )}

                {s.tip && (
                  <div className="callout tip">
                    <IconBulb size={20} />
                    <div className="callout__body">
                      <strong>Tip</strong>
                      {s.tip}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {lesson.quiz && lesson.quiz.length > 0 && <Quiz key={lesson.id} quiz={lesson.quiz} lessonId={lesson.id} />}

        <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '10px 0 34px', flexWrap: 'wrap' }}>
          <button className={done ? 'btn btn--ghost' : 'btn btn--solid'} onClick={() => toggle(lesson.id)}>
            <IconCheck size={17} />
            {done ? 'Completed — mark undone' : 'Mark lesson complete'}
          </button>
          {next && (
            <button
              className="btn"
              onClick={() => {
                if (!done) toggle(lesson.id)
                navigate(`/learn/${next.id}`)
              }}
            >
              Next lesson <IconArrow size={16} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 20, gap: 12 }}>
          {prev ? (
            <Link to={`/learn/${prev.id}`} className="btn btn--ghost" style={{ textAlign: 'left' }}>
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/learn/${next.id}`} className="btn btn--ghost" style={{ textAlign: 'right' }}>
              {next.title} →
            </Link>
          ) : (
            <Link to="/learn" className="btn btn--ghost">All lessons</Link>
          )}
        </div>
      </article>
    </main>
  )
}
