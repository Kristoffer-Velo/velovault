import { motion } from 'framer-motion'
import type { NodeData } from '../data/nodes'
import type { NodePositions } from '../hooks/useNodePositions'
import Node from './Node'

interface Props {
  title: string
  subtitle: string
  color: string
  z: number
  nodes: NodeData[]
  positions: NodePositions
  dimmedNodes: Set<string>
  onHover: (node: NodeData | null, rect: DOMRect | null) => void
  onClick: (node: NodeData | null) => void
}

export default function LayerColumn({
  title, subtitle, color, z, nodes, positions, dimmedNodes, onHover, onClick,
}: Props) {
  return (
    <motion.div
      className="layer-column"
      style={{ transform: `translateZ(${z}px)` }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
    >
      <div className="layer-label" style={{ color }}>{title}</div>
      <div className="layer-subtitle">{subtitle}</div>
      {nodes.map((n, i) => (
        <Node
          key={n.id}
          data={n}
          color={color}
          index={i}
          positions={positions}
          dimmed={dimmedNodes.size > 0 && dimmedNodes.has(n.id)}
          onHover={onHover}
          onClick={onClick}
        />
      ))}
    </motion.div>
  )
}
