import { useState, useEffect } from 'react'
import { useProgress } from '../context/ProgressContext.jsx'
import { IconCheck, IconClose, IconBulb } from './Icons.jsx'

// quiz = [{ q, options: [...], answer: <index>, explain }]
export default function Quiz({ quiz, lessonId }) {
  const { recordQuiz, quizResult } = useProgress()
  const [answers, setAnswers] = useState({}) // qIndex -> chosen index
  const total = quiz.length
  const answeredCount = Object.keys(answers).length
  const score = quiz.reduce((n, q, i) => n + (answers[i] === q.answer ? 1 : 0), 0)
  const finished = answeredCount === total
  const best = quizResult(lessonId)

  useEffect(() => {
    if (finished) recordQuiz(lessonId, score, total)
  }, [finished, score, total, lessonId, recordQuiz])

  const choose = (qi, oi) => {
    if (answers[qi] !== undefined) return // lock once answered
    setAnswers((a) => ({ ...a, [qi]: oi }))
  }
  const retake = () => setAnswers({})

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

      {quiz.map((q, qi) => {
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
