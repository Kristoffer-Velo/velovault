import { useState, useCallback, useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { nodesByLayer, layers, type NodeData } from './data/nodes'
import { connections } from './data/connections'
import { useNodePositions } from './hooks/useNodePositions'
import { usePerspective } from './hooks/usePerspective'
import LayerColumn from './components/LayerColumn'
import BrainCore from './components/BrainCore'
import ConnectionLines from './components/ConnectionLines'
import Tooltip from './components/Tooltip'
import Legend from './components/Legend'
import EntityDetail from './components/EntityDetail'

type LayerKey = 'sources' | 'agents' | 'improve' | 'skills'
const sideLayerOrder: LayerKey[] = ['sources', 'agents', 'improve', 'skills']

export default function App() {
  const positions = useNodePositions()
  const { ref: stageRef, onMouseMove, onMouseLeave } = usePerspective(1.5)
  const sceneRef = useRef<HTMLDivElement>(null)

  const [hoveredNode, setHoveredNode] = useState<NodeData | null>(null)
  const [lockedNode, setLockedNode] = useState<NodeData | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null)
  const [openEntity, setOpenEntity] = useState<string | null>(null)

  const activeNode = lockedNode || hoveredNode

  // Compute connected node IDs for highlighting
  const { highlightedNodes, dimmedNodes } = useMemo(() => {
    if (!activeNode) return { highlightedNodes: new Set<string>(), dimmedNodes: new Set<string>() }

    const connected = new Set<string>()
    connected.add(activeNode.id)

    for (const c of connections) {
      if (c.from === activeNode.id) connected.add(c.to)
      if (c.to === activeNode.id) connected.add(c.from)
    }

    // All node IDs not in connected set
    const allIds = new Set<string>()
    for (const layer of Object.keys(layers)) {
      for (const n of nodesByLayer(layer as any)) {
        if (!connected.has(n.id)) allIds.add(n.id)
      }
    }

    return { highlightedNodes: connected, dimmedNodes: allIds }
  }, [activeNode])

  const handleHover = useCallback((node: NodeData | null, rect: DOMRect | null) => {
    if (lockedNode) return // don't override lock
    setHoveredNode(node)
    if (rect) {
      setTooltipPos({ x: rect.right, y: rect.top })
    } else {
      setTooltipPos(null)
    }
  }, [lockedNode])

  const handleClick = useCallback((node: NodeData | null) => {
    if (lockedNode?.id === node?.id) {
      setLockedNode(null)
      setHoveredNode(null)
      setTooltipPos(null)
    } else {
      setLockedNode(node)
      if (node) {
        // Keep tooltip visible
      }
    }
  }, [lockedNode])

  const handleSceneClick = useCallback(() => {
    setLockedNode(null)
    setHoveredNode(null)
    setTooltipPos(null)
  }, [])

  const activeColor = activeNode
    ? layers[activeNode.layer]?.color || '#fff'
    : '#fff'

  return (
    <div className="scene" ref={sceneRef} onClick={handleSceneClick}>
      {/* Title */}
      <motion.div
        className="page-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h1>velo-brain</h1>
        <p>AI Knowledge System Architecture</p>
      </motion.div>

      {/* Connection lines SVG */}
      <ConnectionLines
        positions={positions}
        highlightedNodes={highlightedNodes}
        containerRef={sceneRef}
      />

      {/* 5-column grid */}
      <div
        className="stage"
        ref={stageRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* Layer 1: Sources */}
        <LayerColumn
          {...layers.sources}
          nodes={nodesByLayer('sources')}
          positions={positions}
          dimmedNodes={dimmedNodes}
          onHover={handleHover}
          onClick={handleClick}
        />

        {/* Layer 2: Agents */}
        <LayerColumn
          {...layers.agents}
          nodes={nodesByLayer('agents')}
          positions={positions}
          dimmedNodes={dimmedNodes}
          onHover={handleHover}
          onClick={handleClick}
        />

        {/* Layer 3: Brain Core */}
        <BrainCore
          positions={positions}
          dimmedNodes={dimmedNodes}
          onHover={handleHover}
          onClick={handleClick}
          onEntityOpen={(id) => setOpenEntity(id)}
        />

        {/* Layer 4: Self-Improve */}
        <LayerColumn
          {...layers.improve}
          nodes={nodesByLayer('improve')}
          positions={positions}
          dimmedNodes={dimmedNodes}
          onHover={handleHover}
          onClick={handleClick}
        />

        {/* Layer 5: Skills */}
        <LayerColumn
          {...layers.skills}
          nodes={nodesByLayer('skills')}
          positions={positions}
          dimmedNodes={dimmedNodes}
          onHover={handleHover}
          onClick={handleClick}
        />
      </div>

      {/* Tooltip */}
      <Tooltip node={activeNode} position={tooltipPos} color={activeColor} />

      {/* Entity detail slide-in */}
      <EntityDetail entityId={openEntity} onClose={() => setOpenEntity(null)} />

      {/* Legend */}
      <Legend />
    </div>
  )
}
