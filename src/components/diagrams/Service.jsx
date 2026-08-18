import { Defs, Lighting } from './primitives'
import { Part, partProps } from './Part'

export default function Service({ parts, selected, onSelect }) {
  const pp = partProps(parts, selected, onSelect)
  const top = 66
  const gap = 46
  const cx = 330

  return (
    <svg viewBox="0 0 720 560" role="img" aria-label="Service sequence diagram">
      <Defs />

      {/* connector spine */}
      <line x1={cx} y1={top} x2={cx} y2={top + (parts.length - 1) * gap} stroke="#4a3f33" strokeWidth="2" strokeDasharray="3 5" />

      {/* direction hints */}
      <g fontSize="11.5" fontFamily="var(--font-body)">
        <text x="70" y={top - 30} fill="#c25863">Disassemble ↓</text>
        <text x="650" y={top - 30} textAnchor="end" fill="#7ba583">Reassemble ↑</text>
      </g>
      <path d="M92 90 L92 470" stroke="#c25863" strokeWidth="1.4" markerEnd="url(#svcDown)" opacity="0.5" fill="none" />
      <path d="M628 470 L628 90" stroke="#7ba583" strokeWidth="1.4" markerEnd="url(#svcUp)" opacity="0.5" fill="none" />
      <marker id="svcDown" viewBox="0 0 10 10" refX="5" refY="8" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0 0 L5 9 L10 0 z" fill="#c25863" />
      </marker>
      <marker id="svcUp" viewBox="0 0 10 10" refX="5" refY="2" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0 10 L5 1 L10 10 z" fill="#7ba583" />
      </marker>

      {parts.map((p, i) => {
        const y = top + i * gap
        const props = pp(p.id, [150, y])
        const isSel = selected === p.id
        return (
          <Part key={p.id} {...props}>
            <g filter="url(#softShadow)">
              <ellipse cx={cx} cy={y + 7} rx="146" ry="22" fill="#0f0c0a" opacity="0.5" />
              <ellipse
                cx={cx}
                cy={y}
                rx="146"
                ry="22"
                fill={props.color}
                fillOpacity={isSel ? 0.32 : 0.15}
                stroke={props.color}
                strokeWidth={isSel ? 2.4 : 1.6}
              />
            </g>
            <text
              x={cx}
              y={y + 4.5}
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="600"
              fill="#efe8dc"
              style={{ pointerEvents: 'none' }}
            >
              {p.name.replace(/^\d+\s·\s/, '')}
            </text>
          </Part>
        )
      })}

      <Lighting w={720} h={560} strength={0.35} />
    </svg>
  )
}
