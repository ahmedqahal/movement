// Bench diagrams, referenced from lessons as `figure: 'bench:<id>'`. Each figs-*.jsx
// file loads on its own the first time one of its diagrams is shown, so a lesson
// never pays for the whole set. manifest.js (generated) maps id → file.
// Drawn with the strap kit (../strap/kit.jsx); authoring guide: ../strap/AUTHORING.md.
import { lazy } from 'react'
import { FILE_OF } from './manifest.js'

const files = import.meta.glob('./figs-*.jsx')
const byFile = {}

function fileFigure(file) {
  if (!byFile[file]) {
    byFile[file] = lazy(() =>
      files[`./figs-${file}.jsx`]().then((m) => ({
        default: function Figure({ id }) {
          const Cmp = m.FIGS[id]
          return Cmp ? <Cmp /> : null
        },
      }))
    )
  }
  return byFile[file]
}

export default function BenchFigure({ id }) {
  const file = FILE_OF[id]
  if (!file) return null
  const Figure = fileFigure(file)
  return <Figure id={id} />
}
