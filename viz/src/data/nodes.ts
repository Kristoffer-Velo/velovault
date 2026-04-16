export type LayerId = 'sources' | 'agents' | 'brain' | 'improve' | 'skills'

export interface NodeData {
  id: string
  label: string
  layer: LayerId
  description: string
  schedule?: string
  icon?: string
}

export const layers: Record<LayerId, { title: string; subtitle: string; color: string; z: number }> = {
  sources:  { title: 'SOURCES',         subtitle: 'External data',       color: '#1D5FE8', z: -20 },
  agents:   { title: 'AGENTS',          subtitle: 'Scheduled sync',      color: '#ECBD6A', z: -10 },
  brain:    { title: 'BRAIN',           subtitle: 'Postgres + pgvector', color: '#F97316', z: 30 },
  improve:  { title: 'SELF-IMPROVE',    subtitle: 'Learning loop',       color: '#A78BFA', z: 0 },
  skills:   { title: 'SKILLS',          subtitle: 'Retrieval',           color: '#10B981', z: -10 },
}

export const nodes: NodeData[] = [
  // Layer 1 — Sources
  { id: 'notion',   label: 'Notion',          layer: 'sources', description: '6 databases: Prosjekter, Kunder, Kontaktpersoner, Ansatte, Moter, Objectives', icon: 'notion' },
  { id: 'slack',    label: 'Slack',           layer: 'sources', description: '14 channels: 9 project channels + #salg, #tech-talk, #brainstorming, #wins, #friday-wins', icon: 'slack' },
  { id: 'outlook',  label: 'Outlook',         layer: 'sources', description: 'Calendar events, attendees, meeting agendas', icon: 'calendar' },
  { id: 'velodb',   label: 'VeloDB',          layer: 'sources', description: 'CV data, project history, time entries, customer records', icon: 'database' },
  { id: 'github',   label: 'GitHub',          layer: 'sources', description: 'Repo activity from Velo-Labs org', icon: 'github' },
  { id: 'repo',     label: 'Repo',            layer: 'sources', description: 'Version-controlled conventions and corrections in content/', icon: 'git' },
  { id: 'web',      label: 'Web',             layer: 'sources', description: 'Research on unknown contacts and companies', icon: 'globe' },

  // Layer 2 — Agents (14 scheduled tasks)
  // --- Ingestion ---
  { id: 'notion-sync',    label: 'notion-sync',    layer: 'agents', description: 'Sync 6 Notion databases to brain pages', schedule: 'Weekdays 07:11', icon: 'sync' },
  { id: 'slack-sync',     label: 'slack-sync',     layer: 'agents', description: 'Extract decisions, status, shipped from 14 Slack channels. Routes #project-velox to sub-projects (willy, velo-brain).', schedule: 'Weekdays 08:26, 14:26, 20:26', icon: 'sync' },
  { id: 'calendar-sync',  label: 'calendar-sync',  layer: 'agents', description: 'Sync calendar events + research unknown attendees via web, email brief to Kristoffer', schedule: 'Weekdays 07:34', icon: 'sync' },
  { id: 'github-sync',    label: 'github-sync',    layer: 'agents', description: 'Sync GitHub activity from Velo-Labs repos to project pages', schedule: 'Weekdays 08:27', icon: 'github' },
  { id: 'velodb-sync',    label: 'velodb-sync',    layer: 'agents', description: 'Sync VeloDB data (CV, projects, customers, time entries) to brain', schedule: 'Weekdays 07:43', icon: 'database' },
  { id: 'cortex-sync',    label: 'cortex-sync',    layer: 'agents', description: 'Sync repo conventions & corrections to brain. Repo is source of truth.', schedule: 'Daily 06:47', icon: 'brain' },
  // --- Compression ---
  { id: 'hot-cache',      label: 'hot-cache',      layer: 'agents', description: 'Build compressed 500-word operational snapshot for session priming', schedule: 'Daily 06:53', icon: 'zap' },
  // --- Maintenance ---
  { id: 'dream-cycle',    label: 'dream-cycle',    layer: 'agents', description: 'Nightly maintenance: entity sweep, citation audit, embed stale chunks', schedule: 'Daily 02:15', icon: 'moon' },
  { id: 'confidence-decay', label: 'confidence-decay', layer: 'agents', description: 'Downgrade stale pages: high→medium after 30d, →low after 90d', schedule: 'Mondays 06:23', icon: 'trending-down' },
  { id: 'brain-health',   label: 'brain-health',   layer: 'agents', description: 'Weekly stats, orphan detection, stale page report', schedule: 'Mondays 06:16', icon: 'heart' },
  // --- Quality (NEW) ---
  { id: 'graph-reconciler', label: 'graph-reconciler', layer: 'agents', description: 'Weekly graph integrity: verify links, compiled truth references, orphans. Escalates ambiguities to #brain-ops.', schedule: 'Sundays 05:21', icon: 'link' },
  { id: 'dedup-auditor',  label: 'dedup-auditor',  layer: 'agents', description: 'Monthly duplicate detection: fuzzy-match entities across sync jobs. Escalates merge suggestions to #brain-ops.', schedule: 'Monthly 04:23', icon: 'shield' },
  { id: 'assumption-check', label: 'assumption-check', layer: 'agents', description: 'Weekly intellectual integrity: compare brain vs Slack/calendar for conflicts, outdated assessments, stale data', schedule: 'Sundays 21:01', icon: 'gauge' },
  // --- Learning (NEW) ---
  { id: 'reflection-sync', label: 'reflection-sync', layer: 'agents', description: 'Weekly reflection on sync jobs. Reads last week logs, writes learning notes per skill, flags repeated patterns for promotion to conventions.', schedule: 'Fridays 16:47', icon: 'lightbulb' },
  // --- Autonomous (NEW) ---
  { id: 'homepage-hypothesis', label: 'homepage-hypothesis', layer: 'agents', description: 'Autonomous homepage improvement: generates hypotheses, implements on branches, learns from Slack feedback', schedule: 'Every 2 days 10:17', icon: 'target' },
  // --- Blog pipeline (was missing) ---
  { id: 'blog-tech-talk', label: 'blog-tech-talk', layer: 'agents', description: 'Monitor #tech-talk for new posts, generate blog article drafts', schedule: 'Weekdays 11:37', icon: 'newspaper' },
  { id: 'blog-feedback-monitor', label: 'blog-feedback-monitor', layer: 'agents', description: 'Monitor Slack threads on blog drafts, update article-writer rules and tone of voice', schedule: 'Weekdays 14:30', icon: 'mic' },

  // Layer 3 — Brain (entity types shown inside BrainCore)
  { id: 'person',     label: 'Person',     layer: 'brain', description: 'Team members + external contacts', icon: 'user' },
  { id: 'client',     label: 'Client',     layer: 'brain', description: 'Customer organizations', icon: 'building' },
  { id: 'project',    label: 'Project',    layer: 'brain', description: 'Active and past projects', icon: 'folder' },
  { id: 'meeting',    label: 'Meeting',    layer: 'brain', description: 'Calendar events with notes and decisions', icon: 'calendar' },
  { id: 'deal',       label: 'Deal',       layer: 'brain', description: 'Pre-sale leads and pipeline', icon: 'handshake' },
  { id: 'concept',    label: 'Concept',    layer: 'brain', description: 'Reusable knowledge: tools, frameworks, patterns', icon: 'lightbulb' },
  { id: 'process',    label: 'Process',    layer: 'brain', description: 'Internal SOPs and handbooks', icon: 'list' },
  { id: 'objective',  label: 'Objective',  layer: 'brain', description: 'OKR entries with key results', icon: 'target' },
  { id: 'convention', label: 'Convention', layer: 'brain', description: 'Active team rules loaded at boot', icon: 'scroll' },
  { id: 'correction', label: 'Correction', layer: 'brain', description: 'Structural fixes preventing error recurrence', icon: 'shield' },

  // Layer 4 — Self-Improvement
  { id: 'conventions-loop', label: 'Conventions',       layer: 'improve', description: 'Team rules accumulated over time. Loaded at /boot. Override defaults.', icon: 'scroll' },
  { id: 'corrections-loop', label: 'Corrections',       layer: 'improve', description: 'Permanent structural fixes. Problem → root cause → rule → verify.', icon: 'shield' },
  { id: 'confidence-loop',  label: 'Confidence',        layer: 'improve', description: 'Every page scored high/medium/low. Decays weekly if unverified.', icon: 'gauge' },
  { id: 'activation-loop',  label: 'Context Activation', layer: 'improve', description: 'Pages auto-load related context via activates: field.', icon: 'link' },
  { id: 'hot-cache-loop',   label: 'Hot Cache',         layer: 'improve', description: 'Daily 500-word compressed operational state. Always in context.', icon: 'zap' },

  // Layer 5 — Skills
  { id: 'boot',          label: '/boot',          layer: 'skills', description: 'Session bootstrap: load conventions, corrections, hot-cache', icon: 'power' },
  { id: 'recall',        label: '/recall',        layer: 'skills', description: 'Multi-hop graph search: anchor → 1-2 hops → compile answer', icon: 'search' },
  { id: 'ingest',        label: '/ingest',        layer: 'skills', description: 'Manual data entry from any source into brain', icon: 'download' },
  { id: 'client-brief',  label: '/client-brief',  layer: 'skills', description: 'Brain-first research before client meetings', icon: 'briefcase' },
  { id: 'weekly-digest', label: '/weekly-digest', layer: 'skills', description: 'Weekly intelligence summary: projects, deals, shipped', icon: 'newspaper' },
  { id: 'tone-of-voice', label: '/tone-of-voice', layer: 'skills', description: 'Write as team members using Slack-sourced voice profiles', icon: 'mic' },
]

export const nodesByLayer = (layer: LayerId) => nodes.filter(n => n.layer === layer)
