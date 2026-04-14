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

person, client, project, meeting, deal, concept, process, objective

## Key Files

- `schema.md` — Entity templates, filing rules, slug conventions
- `skills/ingest/SKILL.md` — Master ingestion skill with all source mappings
- `scripts/notion-sync.md` — Notion → brain scheduled task prompt
- `scripts/slack-sync.md` — Slack → brain scheduled task prompt
- `scripts/calendar-sync.md` — Calendar → brain scheduled task prompt
- `content/` — Brain content organized by entity type

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

## Conventions

- Norwegian content, Norwegian tsvector for full-text search
- Slugs: lowercase, hyphens (`kristoffer-kristensen`, `norgesgruppen`)
- Always store source IDs: `notion_id`, `slack_thread_ts`, `outlook_event_id`
- Iron Law: every entity mention → back-link
- Citation on every fact: `[Source: ...]`
