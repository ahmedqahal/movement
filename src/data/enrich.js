// Layers newer content onto the base tracks in lessons.js. Each file in
// additions/ is owned by one topic, so lessons.js stays the base curriculum.
//   LESSONS: [{ track, after, lesson }]   a new lesson placed after lesson id `after`
//   STEPS:   { lessonId: [{ at, steps }] } extra steps inserted before index `at`
//   QUIZZES: { lessonId: [question] }      extra questions for a lesson
import { TIMING_TRACK } from './additions/timing.js'
import { LESSONS as BENCH } from './additions/bench.js'
import { LESSONS as QUARTZ_CASE, CASE_TRACK } from './additions/quartz-case.js'
import { STEPS as STEPS_CORE } from './additions/steps-core.js'
import { STEPS as STEPS_SERVICE } from './additions/steps-service.js'
import { QUIZZES as QUIZZES_WATCH } from './additions/quizzes-watch.js'
import { QUIZZES as QUIZZES_STRAP } from './additions/quizzes-strap.js'

function placeLesson(tracks, { track, after, lesson }) {
  const t = tracks.find((x) => x.id === track)
  if (!t) throw new Error(`enrich: no track "${track}" for lesson "${lesson.id}"`)
  const i = t.lessons.findIndex((l) => l.id === after)
  if (i < 0) throw new Error(`enrich: no lesson "${after}" to place "${lesson.id}" after`)
  t.lessons.splice(i + 1, 0, lesson)
}

function addSteps(lesson, inserts) {
  // Highest index first, so earlier insert points stay valid.
  const steps = [...lesson.steps]
  for (const { at, steps: extra } of [...inserts].sort((a, b) => b.at - a.at)) steps.splice(at, 0, ...extra)
  return { ...lesson, steps }
}

export function enrich(base) {
  const tracks = base.map((t) => ({ ...t, lessons: [...t.lessons] }))
  const service = tracks.findIndex((t) => t.id === 'service')
  tracks.splice(service + 1, 0, { ...TIMING_TRACK, lessons: [...TIMING_TRACK.lessons] }, { ...CASE_TRACK, lessons: [...CASE_TRACK.lessons] })
  for (const entry of [...BENCH, ...QUARTZ_CASE]) placeLesson(tracks, entry)

  const stepInserts = { ...STEPS_CORE, ...STEPS_SERVICE }
  const quizzes = { ...QUIZZES_WATCH, ...QUIZZES_STRAP }
  return tracks.map((t) => ({
    ...t,
    lessons: t.lessons.map((l) => {
      const withSteps = stepInserts[l.id] ? addSteps(l, stepInserts[l.id]) : l
      const extra = quizzes[l.id]
      return extra ? { ...withSteps, quiz: [...(withSteps.quiz || []), ...extra] } : withSteps
    }),
  }))
}
