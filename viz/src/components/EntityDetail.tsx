import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { entitySamples } from '../data/entity-samples'

interface Props {
  entityId: string | null
  onClose: () => void
}

export default function EntityDetail({ entityId, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const sample = entityId ? entitySamples[entityId] : null

  return (
    <AnimatePresence>
      {sample && (
        <>
          <motion.div
            className="entity-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="entity-panel"
            initial={{ x: 380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="entity-header">
              <div className="entity-kicker">BRAIN ENTITY</div>
              <div className="entity-title">{sample.label}</div>
              <button className="entity-close" onClick={onClose} aria-label="Close">×</button>
            </div>

            <p className="entity-eli10">{sample.eli10}</p>

            <div className="entity-section-label">FRONTMATTER</div>
            <div className="entity-frontmatter">
              {sample.frontmatter.map(([k, v]) => (
                <div className="entity-fm-row" key={k}>
                  <span className="entity-fm-key">{k}:</span>
                  <span className="entity-fm-val">{v}</span>
                </div>
              ))}
            </div>

            <div className="entity-section-label">COMPILED TRUTH</div>
            <p className="entity-compiled">{sample.compiled}</p>

            <div className="entity-hint">{sample.hint}</div>
            <div className="entity-footnote">Sample shape — real pages live in the brain with richer timelines.</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
