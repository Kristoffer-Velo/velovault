import { motion, AnimatePresence } from 'framer-motion'
import type { NodeData } from '../data/nodes'
import { connections } from '../data/connections'

const degreeById: Record<string, number> = connections.reduce<Record<string, number>>((acc, c) => {
  acc[c.from] = (acc[c.from] || 0) + 1
  acc[c.to] = (acc[c.to] || 0) + 1
  return acc
}, {})

interface Props {
  node: NodeData | null
  position: { x: number; y: number } | null
  color: string
}

export default function Tooltip({ node, position, color }: Props) {
  const degree = node ? degreeById[node.id] || 0 : 0

  return (
    <AnimatePresence>
      {node && position && (
        <motion.div
          className="tooltip"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.15 }}
          style={{
            left: Math.min(position.x + 12, window.innerWidth - 300),
            top: Math.min(position.y - 10, window.innerHeight - 120),
          }}
        >
          <div className="tooltip-title" style={{ color }}>{node.label}</div>
          <div className="tooltip-desc">{node.description}</div>
          {degree > 0 && (
            <div className="tooltip-degree" style={{ color }}>
              <span className="tooltip-degree-glyph">↔</span>
              {degree} connection{degree === 1 ? '' : 's'}
            </div>
          )}
          {node.schedule && (
            <div className="tooltip-schedule" style={{ color }}>
              {node.schedule}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
