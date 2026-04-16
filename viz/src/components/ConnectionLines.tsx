import { useEffect, useState, useRef } from 'react'
import { connections } from '../data/connections'
import { nodes, layers } from '../data/nodes'
import type { NodePositions, Position } from '../hooks/useNodePositions'

interface Props {
  positions: NodePositions
  highlightedNodes: Set<string>
  containerRef: React.RefObject<HTMLDivElement | null>
}

const nodeMap = new Map(nodes.map(n => [n.id, n]))

function getLayerColor(nodeId: string): string {
  const node = nodeMap.get(nodeId)
  if (!node) return '#555'
  return layers[node.layer]?.color || '#555'
}

interface PathData {
  key: string
  d: string
  color: string
  highlighted: boolean
  from: string
  to: string
}

export default function ConnectionLines({ positions, highlightedNodes, containerRef }: Props) {
  const [paths, setPaths] = useState<PathData[]>([])
  const svgRef = useRef<SVGSVGElement>(null)

  const computePaths = () => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const newPaths: PathData[] = []

    for (const conn of connections) {
      const from = positions.get(conn.from)
      const to = positions.get(conn.to)
      if (!from || !to) continue

      const x1 = from.x - rect.left
      const y1 = from.y - rect.top
      const x2 = to.x - rect.left
      const y2 = to.y - rect.top

      const dx = Math.abs(x2 - x1) * 0.4
      const d = `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`
      const highlighted = highlightedNodes.size === 0 ||
        (highlightedNodes.has(conn.from) && highlightedNodes.has(conn.to))

      newPaths.push({
        key: `${conn.from}-${conn.to}`,
        d,
        color: getLayerColor(conn.from),
        highlighted,
        from: conn.from,
        to: conn.to,
      })
    }
    setPaths(newPaths)
  }

  useEffect(() => {
    computePaths()
    const unsub = positions.subscribe(computePaths)
    window.addEventListener('resize', computePaths)
    return () => {
      unsub()
      window.removeEventListener('resize', computePaths)
    }
  }, [highlightedNodes])

  // Recompute once after initial layout settles
  useEffect(() => {
    const t = setTimeout(computePaths, 800)
    return () => clearTimeout(t)
  }, [])

  return (
    <svg ref={svgRef} className="connections-svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        {paths.map(p => (
          <linearGradient key={`g-${p.key}`} id={`grad-${p.key}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getLayerColor(p.from)} stopOpacity={p.highlighted ? 0.5 : 0.08} />
            <stop offset="100%" stopColor={getLayerColor(p.to)} stopOpacity={p.highlighted ? 0.5 : 0.08} />
          </linearGradient>
        ))}
      </defs>

      {paths.map((p, i) => (
        <g key={p.key}>
          <path
            d={p.d}
            fill="none"
            stroke={`url(#grad-${p.key})`}
            strokeWidth={p.highlighted && highlightedNodes.size > 0 ? 2 : 1}
            strokeDasharray={p.highlighted || highlightedNodes.size === 0 ? 'none' : '4 4'}
            style={{
              transition: 'stroke-width 0.2s, opacity 0.2s',
              opacity: highlightedNodes.size > 0 && !p.highlighted ? 0.15 : 1,
            }}
          />
          {/* Flowing particle */}
          {(p.highlighted || highlightedNodes.size === 0) && (
            <circle r="2" fill="white" opacity={p.highlighted && highlightedNodes.size > 0 ? 0.8 : 0.25}>
              <animateMotion
                dur={`${4 + (i % 5)}s`}
                repeatCount="indefinite"
                path={p.d}
              />
            </circle>
          )}
        </g>
      ))}
    </svg>
  )
}
