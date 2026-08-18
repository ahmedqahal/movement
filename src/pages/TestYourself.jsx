import { useMemo, useState } from 'react'
import { TRACKS } from '../data/lessons.js'
import { useProgress } from '../context/ProgressContext.jsx'
import { IconCheck, IconClose, IconBulb } from '../components/Icons.jsx'

const QUIZ_COUNT = 10

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Randomise the answer options and remap which index is correct.
function shuffleOptions(q) {
  const order = shuffle(q.options.map((_, i) => i))
  return { ...q, options: order.map((i) => q.options[i]), answer: order.indexOf(q.answer) }
}

function buildPools() {
  return TRACKS.map((t) => ({
    id: t.id,
    name: t.name,
    questions: t.lessons.flatMap((l) => (l.quiz || []).map((q) => ({ ...q, lesson: l.title }))),
  })).filter((p) => p.questions.length > 0)
}

function Runner({ questions, onRestart, onBack }) {
  const [answers, setAnswers] = useState({})
  const total = questions.length
  const answered = Object.keys(answers).length
  const score = questions.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0)
  const finished = answered === total

  const choose = (qi, oi) => {
    if (answers[qi] !== undefined) return
    setAnswers((a) => ({ ...a, [qi]: oi }))
  }

  return (
    <section className="quiz">
      <div className="quiz__head">
        <h3>{total}-question test</h3>
        <button className="crumb" onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          Change track
        </button>
      </div>

      {questions.map((q, qi) => {
        const chosen = answers[qi]
        const done = chosen !== undefined
        return (
          <div key={qi} className="quiz__q">
            <p className="quiz__prompt">
              <span className="quiz__n">{qi + 1}</span>
              {q.q}
            </p>
            <div className="quiz__opts">
              {q.options.map((opt, oi) => {
                const isAnswer = oi === q.answer
                const isChosen = oi === chosen
                let cls = 'quiz__opt'
                if (done && isAnswer) cls += ' correct'
                else if (done && isChosen && !isAnswer) cls += ' wrong'
                else if (done) cls += ' muted'
                return (
                  <button key={oi} className={cls} onClick={() => choose(qi, oi)} disabled={done}>
                    <span className="quiz__mark">
                      {done && isAnswer && <IconCheck size={15} />}
                      {done && isChosen && !isAnswer && <IconClose size={15} />}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
            {done && (
              <div className={`quiz__explain ${chosen === q.answer ? 'ok' : 'no'}`}>
                <IconBulb size={16} />
                <span>
                  {q.explain} <em className="quiz__from">— {q.lesson}</em>
                </span>
              </div>
            )}
          </div>
        )
      })}

      <div className="quiz__foot">
        {finished ? (
          <>
            <div className="quiz__score">
              You scored <strong>{score}</strong> / {total}
              {score === total && ' — perfect!'}
            </div>
            <button className="btn btn--ghost" onClick={onRestart}>
              New questions
            </button>
          </>
        ) : (
          <div className="quiz__progress">
            {answered} of {total} answered
          </div>
        )}
      </div>
    </section>
  )
}

export default function TestYourself() {
  const { quizResult } = useProgress()
  const pools = useMemo(buildPools, [])
  const allPool = useMemo(
    () => ({ id: 'all', name: 'All tracks', questions: pools.flatMap((p) => p.questions) }),
    [pools]
  )
  const [trackId, setTrackId] = useState(null)
  const [round, setRound] = useState(0)

  // Weak spots: questions from lessons whose best quiz score was less than full.
  const weak = []
  for (const t of TRACKS) {
    for (const l of t.lessons) {
      if (!l.quiz) continue
      const r = quizResult(l.id)
      if (r && r.score < r.total) weak.push(...l.quiz.map((q) => ({ ...q, lesson: l.title })))
    }
  }

  const pool =
    trackId === 'all'
      ? allPool
      : trackId === 'weak'
        ? { id: 'weak', name: 'Weak spots', questions: weak }
        : pools.find((p) => p.id === trackId)

  const questions = useMemo(
    () =>
      pool
        ? shuffle(pool.questions)
            .slice(0, Math.min(QUIZ_COUNT, pool.questions.length))
            .map(shuffleOptions)
        : [],
    [pool, round]
  )

  return (
    <main className="content">
      <div className="page-head">
        <div className="page-head__eyebrow">Test Yourself</div>
        <h1>Quiz yourself</h1>
        <p>
          Pull a random set of questions from any track — or everything at once — and see how much
          has stuck. Immediate feedback, with the lesson each question came from.
        </p>
      </div>

      {!pool ? (
        <div className="test-picker">
          {weak.length > 0 && (
            <button className="card test-pick test-pick--weak" onClick={() => setTrackId('weak')}>
              <h3>Review weak spots</h3>
              <p>{weak.length} question{weak.length === 1 ? '' : 's'} from lessons you’ve missed</p>
              <span className="test-pick__go">Review →</span>
            </button>
          )}
          <button className="card test-pick test-pick--all" onClick={() => setTrackId('all')}>
            <h3>All tracks</h3>
            <p>{allPool.questions.length} questions across the whole app</p>
            <span className="test-pick__go">Start →</span>
          </button>
          {pools.map((p) => (
            <button key={p.id} className="card test-pick" onClick={() => setTrackId(p.id)}>
              <h3>{p.name}</h3>
              <p>{p.questions.length} question{p.questions.length === 1 ? '' : 's'}</p>
              <span className="test-pick__go">Start →</span>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="test-runhead">
            <span className="pill brass">{pool.name}</span>
            <span className="test-runhead__count">{questions.length} random questions</span>
          </div>
          <Runner
            key={round}
            questions={questions}
            onRestart={() => setRound((r) => r + 1)}
            onBack={() => setTrackId(null)}
          />
        </>
      )}
    </main>
  )
}
