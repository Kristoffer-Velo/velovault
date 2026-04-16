export interface Connection {
  from: string
  to: string
}

export const connections: Connection[] = [
  // Sources → Agents
  { from: 'notion',  to: 'notion-sync' },
  { from: 'slack',   to: 'slack-sync' },
  { from: 'outlook', to: 'calendar-sync' },
  { from: 'velodb',  to: 'velodb-sync' },
  { from: 'github',  to: 'github-sync' },
  { from: 'repo',    to: 'cortex-sync' },
  { from: 'web',     to: 'calendar-sync' },

  // Agents → Brain entity types
  { from: 'notion-sync',   to: 'project' },
  { from: 'notion-sync',   to: 'client' },
  { from: 'notion-sync',   to: 'person' },
  { from: 'notion-sync',   to: 'meeting' },
  { from: 'notion-sync',   to: 'objective' },
  { from: 'slack-sync',    to: 'project' },
  { from: 'slack-sync',    to: 'concept' },
  { from: 'slack-sync',    to: 'deal' },
  { from: 'calendar-sync', to: 'meeting' },
  { from: 'calendar-sync', to: 'person' },
  { from: 'cortex-sync',   to: 'convention' },
  { from: 'cortex-sync',   to: 'correction' },
  { from: 'hot-cache',     to: 'process' },
  { from: 'github-sync',   to: 'project' },
  { from: 'velodb-sync',   to: 'person' },
  { from: 'velodb-sync',   to: 'project' },
  { from: 'velodb-sync',   to: 'client' },
  { from: 'dream-cycle',   to: 'person' },
  { from: 'dream-cycle',   to: 'project' },
  { from: 'confidence-decay', to: 'person' },
  { from: 'confidence-decay', to: 'project' },
  { from: 'confidence-decay', to: 'client' },
  { from: 'brain-health',  to: 'process' },

  // Quality agents → brain
  { from: 'graph-reconciler', to: 'concept' },
  { from: 'graph-reconciler', to: 'project' },
  { from: 'dedup-auditor',    to: 'person' },
  { from: 'dedup-auditor',    to: 'client' },
  { from: 'assumption-check', to: 'project' },
  { from: 'assumption-check', to: 'deal' },

  // Learning → feeds self-improvement
  { from: 'reflection-sync',  to: 'convention' },
  { from: 'reflection-sync',  to: 'correction' },

  // Autonomous agent
  { from: 'homepage-hypothesis', to: 'concept' },

  // Blog pipeline
  { from: 'blog-tech-talk',        to: 'concept' },
  { from: 'blog-feedback-monitor', to: 'convention' },

  // Brain → Self-Improvement
  { from: 'convention', to: 'conventions-loop' },
  { from: 'correction', to: 'corrections-loop' },
  { from: 'person',     to: 'confidence-loop' },
  { from: 'project',    to: 'confidence-loop' },
  { from: 'client',     to: 'activation-loop' },
  { from: 'project',    to: 'activation-loop' },
  { from: 'process',    to: 'hot-cache-loop' },

  // Self-Improvement → Skills
  { from: 'conventions-loop', to: 'boot' },
  { from: 'corrections-loop', to: 'boot' },
  { from: 'hot-cache-loop',   to: 'boot' },
  { from: 'confidence-loop',  to: 'recall' },
  { from: 'activation-loop',  to: 'recall' },
  { from: 'activation-loop',  to: 'client-brief' },
  { from: 'hot-cache-loop',   to: 'weekly-digest' },
  { from: 'conventions-loop', to: 'tone-of-voice' },
  { from: 'confidence-loop',  to: 'ingest' },
]
