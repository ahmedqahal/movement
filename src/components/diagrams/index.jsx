import Mechanical from './Mechanical'
import Escapement from './Escapement'
import Automatic from './Automatic'
import Keyless from './Keyless'
import Chronograph from './Chronograph'
import Quartz from './Quartz'
import Case from './Case'
import Service from './Service'
import Calendar from './Calendar'

const MAP = {
  mechanical: Mechanical,
  escapement: Escapement,
  automatic: Automatic,
  keyless: Keyless,
  chronograph: Chronograph,
  quartz: Quartz,
  case: Case,
  service: Service,
  calendar: Calendar,
}

export default function AnatomyDiagram({ diagram, selected, onSelect }) {
  const Cmp = MAP[diagram.id] || Mechanical
  return <Cmp parts={diagram.parts} selected={selected} onSelect={onSelect} />
}
