# velo-brain — AI Knowledge System for Velo Labs

## What This Is

velo-brain is the knowledge backbone for Velo Labs (6-person AI consultancy).
Built on gbrain/zbrain architecture: Postgres + pgvector, markdown pages, MCP server.

## Architecture

- **Engine:** zbrain fork (shared codebase with Z Event brain)
- **Database:** Supabase Postgres + pgvector (separate from Z Event)
- **Content:** This repo (`velovault/`) — entity templates, ingestion scripts, skills
- **MCP tools:** Notion, Slack, Outlook MCP for ingestion; zbrain MCP for brain read/write

## Entity Types

person, client, project, meeting, deal, concept, process, objective, convention, correction

## Key Files

- `schema.md` — Entity templates, filing rules, slug conventions
- `skills/ingest/SKILL.md` — Master ingestion skill with all source mappings
- `scripts/notion-sync.md` — Notion → brain scheduled task prompt
- `scripts/slack-sync.md` — Slack → brain scheduled task prompt
- `scripts/calendar-sync.md` — Calendar → brain scheduled task prompt
- `scripts/cortex-sync.md` — Conventions & corrections → brain scheduled task prompt
- `scripts/confidence-decay.md` — Weekly confidence decay check
- `content/` — Brain content organized by entity type
- `content/conventions/` — Active team conventions (synced to brain by cortex-sync)
- `content/corrections/` — Structural fixes (synced to brain by cortex-sync)
- `content/concepts/agent-architecture-patterns.md` — Pattern catalogue across Velo systems
- `scripts/hot-cache.md` — Daily session primer builder
- `skills/recall/SKILL.md` — Multi-hop retrieval skill
- `skills/boot/SKILL.md` — Session bootstrap skill

## Notion Data Sources

| Database | Collection ID | Brain Entity |
|----------|--------------|-------------|
| Prosjekter | cb752456-856e-42b0-bdad-277f4f54fe0d | project |
| Kunder | 5dd9a5bc-7ff9-43c0-8cb6-712387a4506b | client |
| Kontaktpersoner | e71cc2f2-438d-4d09-ae32-d68b629f2d3f | person |
| Ansatte | 1ec98afc-abf5-8081-977a-000ba33fbf48 | person |
| Møter | 2c698afc-abf5-81a6-a6ec-000b1fc75791 | meeting |
| Objectives | 31d98afc-abf5-80a4-bd56-000b43b6ecbb | objective |

## Slack Channel Mapping

| Channel | ID | Brain Slug |
|---------|----|-----------|
| #project-baneservice | C09K1537Y85 | projects/baneservice |
| #project-zevent | C0AR7CXNJQ7 | projects/zevent |
| #project-aidn | C0A9FAZ1PKJ | projects/aidn |
| #project-velox | C0AK6JJAS3D | projects/velox |
| #project-nki | C09FJU659KQ | projects/nki |
| #project-norgesgruppen | C08RXNEJ39C | projects/norgesgruppen |
| #project-neo | C0A2YR42U02 | projects/neo |
| #project-obos | C09N9A68ZBJ | projects/obos |
| #project-velo-cdp | C09377RSYPQ | projects/velo-cdp |
| #salg | C08R11YUV6Y | deals/* |
| #tech-talk | C09LQ4BD0UQ | concepts/* |
| #brainstorming | C09GWFAH6MS | concepts/* |

## Sync Jobs (Scheduled Tasks)

| Task | Schedule | Source |
|------|----------|--------|
| notion-sync | Weekdays 07:11 | Notion databases → brain |
| slack-sync | Weekdays 08:17, 14:17, 20:17 | Slack channels → brain |
| calendar-sync | Weekdays 07:33 | Outlook calendar → brain |
| cortex-sync | Daily 06:47 | Repo conventions/corrections → brain |
| hot-cache | Daily 06:53 | Build compressed session primer → meta/hot-cache |
| confidence-decay | Mondays 06:23 | Brain pages → downgrade stale confidence |

## Conventions

- Norwegian content, Norwegian tsvector for full-text search
- Slugs: lowercase, hyphens (`kristoffer-kristensen`, `norgesgruppen`)
- Always store source IDs: `notion_id`, `slack_thread_ts`, `outlook_event_id`
- Iron Law: every entity mention → back-link
- Citation on every fact: `[Source: ...]`

## Self-Improvement System

velo-brain lærer og forbedrer seg over tid via tre mekanismer:

### Conventions (`conventions/`)
Aktive regler teamet har lært. Leses ved session-start via `/boot`.
Konvensjoner overstyrer defaults — de er akkumulert teamlæring.
Opprett nye via `put_page` med `type: convention` når teamet lærer noe som bør gjelde permanent.

### Corrections (`corrections/`)
Strukturelle fiks for feil som har skjedd. Ikke bare "vi lærte X" — men en permanent regel
som forhindrer gjentakelse. Opprett via `put_page` med `type: correction` når en feil fanges.
Korrekturer refererer alltid til rotårsak, ikke bare symptom.

### Confidence Scoring
Alle sider kan ha `confidence: high|medium|low` og `last_verified: YYYY-MM-DD` i frontmatter.
assumption-check og ingestion-pipelines oppdaterer disse. `/boot` flagger low-confidence data.

### Context Activation
Sider kan definere `activates: [slug1, slug2]` i frontmatter for automatisk kontekst-lasting.
Klienter aktiverer relevante konvensjoner og personer. Prosjekter aktiverer klient og team.

## Session Bootstrap

**Ved session-start:** Kjør `/boot` for å laste konvensjoner, korrekturer, og aktiv kontekst fra brain.

**Etter context compaction:** Compaction-sammendraget er IKKE en erstatning for brain-data.
Kjør `/boot` umiddelbart etter compaction for å re-laste cortex (konvensjoner + korrekturer).
Stol aldri på compaction-minnet for regler og konvensjoner — last alltid fra brain.
