import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { NodeData } from '../data/nodes'
import type { NodePositions } from '../hooks/useNodePositions'
import NodeIcon from './NodeIcon'

interface Props {
  data: NodeData
  color: string
  index: number
  positions: NodePositions
  dimmed: boolean
  onHover: (node: NodeData | null, rect: DOMRect | null) => void
  onClick: (node: NodeData | null) => void
}

type Cadence = 'daily' | 'weekly' | 'monthly'

// Derive a coarse cadence bucket from the schedule string. Daily covers
// daily/weekday/every-2-days runs; weekly covers single-day-of-week runs;
// monthly is its own bucket. Time-of-day is ignored — purely frequency.
function cadenceOf(schedule: string | undefined): Cadence | null {
  if (!schedule) return null
  const s = schedule.toLowerCase()
  if (s.startsWith('monthly')) return 'monthly'
  if (s.startsWith('daily') || s.startsWith('weekdays') || s.startsWith('every')) return 'daily'
  if (s.startsWith('mondays') || s.startsWith('tuesdays') || s.startsWith('wednesdays') || s.startsWith('thursdays') || s.startsWith('fridays') || s.startsWith('saturdays') || s.startsWith('sundays')) return 'weekly'
  return null
}

const cadenceColor: Record<Cadence, string> = {
  daily: '#10B981',
  weekly: '#ECBD6A',
  monthly: '#F97316',
}

export default function Node({ data, color, index, positions, dimmed, onHover, onClick }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const reportPosition = () => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    positions.update(data.id, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    })
  }

  useEffect(() => {
    reportPosition()
    window.addEventListener('resize', reportPosition)
    return () => window.removeEventListener('resize', reportPosition)
  }, [])

  return (
    <motion.div
      ref={ref}
      className={`node${dimmed ? ' dimmed' : ''}`}
      drag
      dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
      dragElastic={0.6}
      onDrag={reportPosition}
      onDragEnd={reportPosition}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: dimmed ? 0.15 : 1, y: 0 }}
      transition={{
        delay: 0.3 + index * 0.04,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => {
        if (ref.current) onHover(data, ref.current.getBoundingClientRect())
      }}
      onMouseLeave={() => onHover(null, null)}
      onClick={(e) => {
        e.stopPropagation()
        onClick(data)
      }}
    >
      <NodeIcon name={data.icon} color={color} />
      <span className="node-label">{data.label}</span>
      {data.schedule && (() => {
        const cadence = cadenceOf(data.schedule)
        return (
          <span className="node-schedule">
            {cadence && (
              <span
                className="node-cadence-pip"
                style={{ background: cadenceColor[cadence] }}
                aria-label={`Runs ${cadence}`}
                title={`Runs ${cadence}`}
              />
            )}
            {data.schedule.split(' ')[1] || data.schedule.split(' ')[0]}
          </span>
        )
      })()}
    </motion.div>
  )
}
