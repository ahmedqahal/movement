import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IconArrow, IconCheck, IconAlert, IconBulb } from './Icons.jsx'

const TONE_ICON = { good: IconCheck, warn: IconBulb, bad: IconAlert }

export default function Flowchart({ chart }) {
  const [nodeId, setNodeId] = useState(chart.start)
  const [path, setPath] = useState([]) // [{ nodeId, question, chosen }]
  const node = chart.nodes[nodeId]
  const isLeaf = !node.options

  const choose = (opt) => {
    setPath((p) => [...p, { nodeId, question: node.text, chosen: opt.label }])
    setNodeId(opt.next)
  }
  const back = () => {
    setPath((p) => {
      const prev = p[p.length - 1]
      if (prev) setNodeId(prev.nodeId)
      return p.slice(0, -1)
    })
  }
  const restart = () => {
    setPath([])
    setNodeId(chart.start)
  }

  const Tone = isLeaf ? TONE_ICON[node.tone] || IconBulb : null

  return (
    <div className="flow">
      {/* breadcrumb of answers so far */}
      {path.length > 0 && (
        <ol className="flow__trail">
          {path.map((e, i) => (
            <li key={i}>
              <span className="flow__trailq">{e.question}</span>
              <span className="flow__traila">{e.chosen}</span>
            </li>
          ))}
        </ol>
      )}

      {isLeaf ? (
        <div className={`flow__leaf ${node.tone}`}>
          <div className="flow__leafhead">
            <Tone size={20} />
            <span>Likely diagnosis</span>
          </div>
          <p>{node.conclusion}</p>
          <div className="flow__leafactions">
            {node.lessonId && (
              <Link className="btn btn--solid" to={`/learn/${node.lessonId}`}>
                Read the fix <IconArrow size={16} />
              </Link>
            )}
            <button className="btn btn--ghost" onClick={restart}>
              Start over
            </button>
            {path.length > 0 && (
              <button className="btn btn--ghost" onClick={back}>
                <IconArrow size={16} style={{ transform: 'rotate(180deg)' }} /> Back
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flow__q">
          <p className="flow__question">{node.text}</p>
          <div className="flow__opts">
            {node.options.map((opt, i) => (
              <button key={i} className="flow__opt" onClick={() => choose(opt)}>
                {opt.label}
                <IconArrow size={16} />
              </button>
            ))}
          </div>
          {path.length > 0 && (
            <button className="flow__back" onClick={back}>
              <IconArrow size={14} style={{ transform: 'rotate(180deg)' }} /> Back
            </button>
          )}
        </div>
      )}
    </div>
  )
}
