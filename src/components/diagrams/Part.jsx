import { ROLES } from '../../data/anatomy.js'

/* Wraps a group of shapes into a clickable, highlightable part with a
   numbered badge. The role colour is exposed as --hl for the glow. */
export function Part({ id, num, name, color, selected, onSelect, badge, children }) {
  return (
    <g
      className={`part ${selected === id ? 'selected' : ''}`}
      style={{ '--hl': color }}
      onClick={() => onSelect(id)}
      tabIndex={0}
      role="button"
      aria-label={name ? `${num}. ${name}` : `Part ${num}`}
      aria-pressed={selected === id}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(id)
        }
      }}
    >
      {children}
      {badge && (
        <g style={{ pointerEvents: 'none' }}>
          <circle cx={badge[0]} cy={badge[1]} r="12.5" fill="#14110f" stroke={color} strokeWidth="1.6" />
          <text
            x={badge[0]}
            y={badge[1] + 4.5}
            textAnchor="middle"
            fontSize="13"
            fontWeight="700"
            fill={color}
            fontFamily="var(--font-body)"
          >
            {num}
          </text>
        </g>
      )}
    </g>
  )
}

export const roleColor = (role) => ROLES[role].color

// Returns a helper that maps a part id -> its 1-based index for the diagram.
export const numberer = (parts) => (id) => parts.findIndex((p) => p.id === id) + 1

// Convenience: build the props a diagram passes to every <Part>.
export function partProps(parts, selected, onSelect) {
  const n = numberer(parts)
  const byId = Object.fromEntries(parts.map((p) => [p.id, p]))
  return (id, badge) => ({
    id,
    num: n(id),
    name: byId[id].name,
    color: roleColor(byId[id].role),
    badge,
    selected,
    onSelect,
  })
}
