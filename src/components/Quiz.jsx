import { useState, useEffect, useMemo } from 'react'
import { useProgress } from '../context/ProgressContext.jsx'
import { IconCheck, IconClose, IconBulb } from './Icons.jsx'
import { shuffleOptions } from '../lib/quiz.js'

// quiz = [{ q, options: [...], answer: <index>, explain }]
export default function Quiz({ quiz, lessonId }) {
  const { recordQuiz, quizResult, scheduleReview } = useProgress()
  const [answers, setAnswers] = useState({}) // qIndex -> chosen index
  const [attempt, setAttempt] = useState(0)
  // Fresh option order each attempt, so a retake tests recall rather than position.
  const questions = useMemo(() => quiz.map(shuffleOptions), [quiz, attempt])
  const total = questions.length
  const answeredCount = Object.keys(answers).length
  const score = questions.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0)
  const finished = answeredCount === total
  const best = quizResult(lessonId)

  useEffect(() => {
    if (finished) {
      recordQuiz(lessonId, score, total)
      // Pass = 80%+ correct → schedule the next spaced-repetition review.
      scheduleReview(lessonId, score >= Math.ceil(total * 0.8))
    }
  }, [finished, score, total, lessonId, recordQuiz, scheduleReview])

  const choose = (qi, oi) => {
    if (answers[qi] !== undefined) return // lock once answered
    setAnswers((a) => ({ ...a, [qi]: oi }))
  }
  const retake = () => {
    setAnswers({})
    setAttempt((a) => a + 1)
  }

  return (
    <section className="quiz">
      <div className="quiz__head">
        <h3>Check your understanding</h3>
        {best && (
          <span className="quiz__best">
            Best: {best.score}/{best.total}
          </span>
        )}
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
                <span>{q.explain}</span>
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
            <button className="btn btn--ghost" onClick={retake}>
              Retake
            </button>
          </>
        ) : (
          <div className="quiz__progress">
            {answeredCount} of {total} answered
          </div>
        )}
      </div>
    </section>
  )
}
