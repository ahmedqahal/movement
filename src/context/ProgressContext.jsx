import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const KEY = 'movement.progress.v1'
const QKEY = 'movement.quiz.v1'
const SKEY = 'movement.srs.v1'
const ProgressContext = createContext(null)

// Leitner boxes → days until the next review. A pass promotes a lesson to the
// next box (a longer interval); a miss drops it back to box 1 (see it soon).
const SRS_DAYS = [0, 1, 3, 7, 16, 35]
const DAY = 86400000

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
  const [srs, setSrs] = useState(() => load(SKEY))

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

  useEffect(() => {
    try {
      localStorage.setItem(SKEY, JSON.stringify(srs))
    } catch {
      /* non-fatal */
    }
  }, [srs])

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

  // Spaced repetition: schedule the next review for a lesson after a quiz.
  // `passed` promotes to the next Leitner box; a miss drops back to box 1.
  const scheduleReview = useCallback((lessonId, passed) => {
    setSrs((prev) => {
      const cur = prev[lessonId]
      const base = cur && cur.box > 0 ? cur.box : 1
      const box = passed ? Math.min(base + 1, SRS_DAYS.length - 1) : 1
      const now = Date.now()
      return { ...prev, [lessonId]: { box, due: now + SRS_DAYS[box] * DAY, last: now } }
    })
  }, [])

  const dueLessonIds = useCallback(() => {
    const now = Date.now()
    return Object.keys(srs).filter((id) => srs[id] && srs[id].due <= now)
  }, [srs])

  const reviewStats = useCallback(() => {
    const now = Date.now()
    const ids = Object.keys(srs)
    return {
      scheduled: ids.length,
      due: ids.filter((id) => srs[id] && srs[id].due <= now).length,
    }
  }, [srs])

  const reset = useCallback(() => {
    setDone({})
    setQuizzed({})
    setSrs({})
  }, [])

  const value = {
    done,
    toggle,
    isDone,
    reset,
    completedCount: Object.keys(done).length,
    recordQuiz,
    quizResult,
    srs,
    scheduleReview,
    dueLessonIds,
    reviewStats,
  }
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
