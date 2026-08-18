import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const KEY = 'movement.progress.v1'
const QKEY = 'movement.quiz.v1'
const ProgressContext = createContext(null)

function load(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function ProgressProvider({ children }) {
  const [done, setDone] = useState(() => load(KEY))
  const [quizzed, setQuizzed] = useState(() => load(QKEY))

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(done))
    } catch {
      /* storage may be unavailable (private mode) — non-fatal */
    }
  }, [done])

  useEffect(() => {
    try {
      localStorage.setItem(QKEY, JSON.stringify(quizzed))
    } catch {
      /* non-fatal */
    }
  }, [quizzed])

  const toggle = useCallback((lessonId) => {
    setDone((prev) => {
      const next = { ...prev }
      if (next[lessonId]) delete next[lessonId]
      else next[lessonId] = Date.now()
      return next
    })
  }, [])

  const isDone = useCallback((lessonId) => Boolean(done[lessonId]), [done])

  // record a quiz result, keeping the best score for that lesson
  const recordQuiz = useCallback((lessonId, score, total) => {
    setQuizzed((prev) => {
      const best = prev[lessonId]
      if (best && best.score >= score) return prev
      return { ...prev, [lessonId]: { score, total, at: Date.now() } }
    })
  }, [])

  const quizResult = useCallback((lessonId) => quizzed[lessonId] || null, [quizzed])

  const reset = useCallback(() => {
    setDone({})
    setQuizzed({})
  }, [])

  const value = {
    done,
    toggle,
    isDone,
    reset,
    completedCount: Object.keys(done).length,
    recordQuiz,
    quizResult,
  }
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
