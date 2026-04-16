import { motion, AnimatePresence } from 'framer-motion'
import type { NodeData } from '../data/nodes'

interface Props {
  node: NodeData | null
  position: { x: number; y: number } | null
  color: string
}

export default function Tooltip({ node, position, color }: Props) {
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
