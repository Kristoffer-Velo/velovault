// Hardcoded samples showing what each brain entity type looks like.
// Not real data — illustrative only. Enough structure for a newcomer
// to build a mental model of "a brain page has X fields + freeform truth."

export interface EntitySample {
  id: string
  label: string
  eli10: string
  frontmatter: Array<[string, string]>
  compiled: string
  hint: string
}

export const entitySamples: Record<string, EntitySample> = {
  person: {
    id: 'person',
    label: 'Person',
    eli10: 'A person. Someone we work with — team member or external contact.',
    frontmatter: [
      ['type', 'person'],
      ['role', 'Senior Engineer'],
      ['company', 'Baneservice'],
      ['email', 'ola@baneservice.no'],
      ['notion_id', '2c6d…abc12'],
      ['confidence', 'high'],
    ],
    compiled: 'Ola leads the auth migration at Baneservice. Engineering background from NSB. Prefers direct Slack over email.',
    hint: 'Stored in persons/ola-nordmann',
  },
  client: {
    id: 'client',
    label: 'Client',
    eli10: 'A customer. A company we sell to or work for.',
    frontmatter: [
      ['type', 'client'],
      ['org_number', '917 123 456'],
      ['industry', 'Rail infrastructure'],
      ['eier', 'kristoffer-kristensen'],
      ['confidence', 'high'],
    ],
    compiled: 'Norwegian rail maintenance company. Long-running relationship since 2024. Pilot on AI-assisted field reports, now expanding to internal tooling.',
    hint: 'Stored in clients/baneservice',
  },
  project: {
    id: 'project',
    label: 'Project',
    eli10: 'A specific piece of work — usually tied to a client.',
    frontmatter: [
      ['type', 'project'],
      ['client', 'baneservice'],
      ['ansvarlig', 'kristoffer-kristensen'],
      ['salgsfase', 'Vunnet'],
      ['leveringsstatus', 'pågår'],
      ['slack_channel', '#project-baneservice'],
    ],
    compiled: 'AI-assisted field report system. MVP shipped march 2026. Currently expanding coverage to maintenance dispatch.',
    hint: 'Stored in projects/baneservice',
  },
  meeting: {
    id: 'meeting',
    label: 'Meeting',
    eli10: 'A calendar event we had — with notes, decisions, action items.',
    frontmatter: [
      ['type', 'meeting'],
      ['date', '2026-04-14'],
      ['category', 'Workshop'],
      ['attendees', 'ola-nordmann, kristoffer-kristensen'],
      ['outlook_event_id', 'AAM…xyz'],
    ],
    compiled: 'Kickoff for phase 2. Decision: reuse existing vector index. Action: Ola sends sample data by Friday.',
    hint: 'Stored in meetings/2026/2026-04-14-baneservice-kickoff',
  },
  deal: {
    id: 'deal',
    label: 'Deal',
    eli10: 'A potential sale — something in our pipeline, not yet won.',
    frontmatter: [
      ['type', 'deal'],
      ['client', 'norgesgruppen'],
      ['verdi', '850000 NOK'],
      ['salgsfase', 'Tilbud'],
      ['ansvarlig', 'kristoffer-kristensen'],
    ],
    compiled: 'Proposal sent for retail analytics pilot. Waiting on legal review. Next touchpoint: 2026-04-22.',
    hint: 'Stored in deals/norgesgruppen-retail-analytics',
  },
  concept: {
    id: 'concept',
    label: 'Concept',
    eli10: 'A reusable idea — a tool, pattern, or framework we use across projects.',
    frontmatter: [
      ['type', 'concept'],
      ['source_url', 'https://letta.ai/blog/memory-blocks'],
      ['tags', 'memory, architecture, agents'],
    ],
    compiled: 'Letta memory blocks: core/archival/recall pattern. We use this model to structure velo-brain storage tiers.',
    hint: 'Stored in concepts/memory-blocks',
  },
  process: {
    id: 'process',
    label: 'Process',
    eli10: 'An internal how-to — SOP, handbook, the way we do something.',
    frontmatter: [
      ['type', 'process'],
      ['notion_id', '1ec9…8081'],
    ],
    compiled: 'Onboarding new Velo team member: 1) Notion invite, 2) Slack workspace, 3) 1:1 with Kristoffer, 4) first project shadow.',
    hint: 'Stored in processes/ny-i-velo',
  },
  objective: {
    id: 'objective',
    label: 'Objective',
    eli10: 'A goal we set — usually a quarterly OKR with measurable results.',
    frontmatter: [
      ['type', 'objective'],
      ['periode', '2026 - Q2'],
      ['ansvarlig', 'kristoffer-kristensen'],
    ],
    compiled: 'Ship 3 AI products this quarter. Key results: 2 new clients signed, 1 internal tool in prod, NPS > 8.',
    hint: 'Stored in objectives/2026-q2-ship-3-products',
  },
  convention: {
    id: 'convention',
    label: 'Convention',
    eli10: 'A team rule we learned — loaded at every session start so we never forget it.',
    frontmatter: [
      ['type', 'convention'],
      ['severity', 'must'],
      ['activates', 'all sessions'],
      ['created', '2026-02-10'],
    ],
    compiled: 'Always cite sources on every fact: [Source: Notion, "page title", YYYY-MM-DD]. Without a source, we cannot verify or correct.',
    hint: 'Stored in conventions/cite-sources',
  },
  correction: {
    id: 'correction',
    label: 'Correction',
    eli10: 'A fix for a past mistake — written as a permanent rule so the same mistake can\'t happen again.',
    frontmatter: [
      ['type', 'correction'],
      ['severity', 'important'],
      ['corrects', 'notion-kontaktperson-dedup-2026-03'],
      ['created', '2026-03-18'],
    ],
    compiled: 'Problem: duplicate person page created for name collision. Rootcause: matching on name alone. Fix: always dedup by notion_id BEFORE creating person pages.',
    hint: 'Stored in corrections/person-dedup-by-notion-id',
  },
}
