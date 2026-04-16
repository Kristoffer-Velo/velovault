import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { nodesByLayer, layers } from '../data/nodes'
import type { NodeData } from '../data/nodes'
import type { NodePositions } from '../hooks/useNodePositions'

interface Props {
  positions: NodePositions
  dimmedNodes: Set<string>
  onHover: (node: NodeData | null, rect: DOMRect | null) => void
  onClick: (node: NodeData | null) => void
  onEntityOpen: (entityId: string) => void
}

const brainEntities = nodesByLayer('brain')

export default function BrainCore({ positions, dimmedNodes, onHover, onClick, onEntityOpen }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const entityRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const reportPositions = () => {
    entityRefs.current.forEach((el, id) => {
      const rect = el.getBoundingClientRect()
      positions.update(id, {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      })
    })
  }

  useEffect(() => {
    reportPositions()
    window.addEventListener('resize', reportPositions)
    return () => window.removeEventListener('resize', reportPositions)
  }, [])

  const color = layers.brain.color

  return (
    <motion.div
      className="brain-column"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ transform: `translateZ(${layers.brain.z}px)` }}
    >
      <div className="layer-label" style={{ color, textAlign: 'center', marginBottom: 8 }}>
        {layers.brain.title}
      </div>
      <div className="brain-core" ref={containerRef}>
        <div className="brain-glow" />
        <div className="brain-ring" style={{ inset: '10%' }} />
        <div className="brain-ring" style={{ inset: '25%' }} />
        <div className="brain-ring" style={{ inset: '40%' }} />
        <div className="brain-title">velo-brain</div>
        <div className="brain-subtitle">Postgres + pgvector</div>
        <div className="brain-inspect-hint">Click a type to inspect →</div>
        <div className="brain-entities">
          {brainEntities.map((entity, i) => (
            <motion.div
              key={entity.id}
              ref={(el) => { if (el) entityRefs.current.set(entity.id, el) }}
              className={`brain-entity${dimmedNodes.size > 0 && dimmedNodes.has(entity.id) ? ' dimmed' : ''}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: dimmedNodes.size > 0 && dimmedNodes.has(entity.id) ? 0.15 : 1,
                scale: 1,
              }}
              transition={{ delay: 0.6 + i * 0.05, duration: 0.3 }}
              onMouseEnter={(e) => {
                const rect = (e.target as HTMLElement).getBoundingClientRect()
                onHover(entity, rect)
              }}
              onMouseLeave={() => onHover(null, null)}
              onClick={(e) => {
                e.stopPropagation()
                onClick(entity)
                onEntityOpen(entity.id)
              }}
              style={{ cursor: 'pointer' }}
              title="Click to inspect"
            >
              {entity.label}
              <span className="brain-entity-chev">›</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
