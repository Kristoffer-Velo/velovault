import { motion } from 'framer-motion'
import { layers, type LayerId } from '../data/nodes'

const order: LayerId[] = ['sources', 'agents', 'brain', 'improve', 'skills']

export default function Legend() {
  return (
    <motion.div
      className="legend"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.5 }}
    >
      {order.map(id => (
        <div key={id} className="legend-item">
          <div className="legend-dot" style={{ background: layers[id].color }} />
          {layers[id].title}
        </div>
      ))}
    </motion.div>
  )
}
