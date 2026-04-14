# Velo Brain — Ingest Skill

Ingest data from Notion, Slack, and Outlook into velo-brain.

> **Filing rule:** Read `schema.md` before creating any new page.

## Iron Law: Back-Linking (MANDATORY)

Every mention of a person or client with a brain page MUST create a back-link.
An unlinked mention is a broken brain.

## Citation Requirements (MANDATORY)

Every fact must carry an inline `[Source: ...]` citation.
- **Notion:** `[Source: Notion, "{page title}", YYYY-MM-DD]`
- **Slack:** `[Source: Slack #channel, @user, YYYY-MM-DD]`
- **Calendar:** `[Source: Outlook Calendar, YYYY-MM-DD]`
- **Meeting:** `[Source: Meeting "{title}", YYYY-MM-DD]`

## Notion Ingestion

### Databases (structured — batch sync)

Priority order:
1. **Prosjekter** (collection://cb752456-856e-42b0-bdad-277f4f54fe0d)
2. **Kunder** (collection://5dd9a5bc-7ff9-43c0-8cb6-712387a4506b)
3. **Kontaktpersoner** (collection://e71cc2f2-438d-4d09-ae32-d68b629f2d3f)
4. **Ansatte** (collection://1ec98afc-abf5-8081-977a-000ba33fbf48)
5. **Møter** (collection://2c698afc-abf5-81a6-a6ec-000b1fc75791)
6. **Objectives** (collection://31d98afc-abf5-80a4-bd56-000b43b6ecbb)

For each database row:
1. Fetch the page via `notion-fetch` with its page ID
2. Check if brain page exists: `search "{title}"` or match by `notion_id`
3. If exists: compare content hash, update if changed
4. If new: create brain page using appropriate template from schema.md
5. Store raw Notion data via `put_raw_data` for provenance
6. Create links between related entities (project→client, project→person, etc.)
7. Log the ingestion via `log_ingest`

### Pages (unstructured — selective sync)

High-value pages to sync:
- Håndbok (1ec98afcabf5804b912ae30c4f6a9759) → `processes/handbok`
- Ny i Velo (28c98afcabf58079940de3897d23475a) → `processes/ny-i-velo`
- Strategi og retning (31d98afcabf58050a6c5c95d77006b90) → `concepts/strategi`
- Velo Brand (27c98afcabf5805ea8f9c1447f125ec9) → `concepts/velo-brand`
- Ansattgoder (1ec98afcabf58174994ed0992d92e927) → `processes/ansattgoder`
- Utlegg (1ec98afcabf5812a9152e9a502744596) → `processes/utlegg`
- Kundesitater (31c98afcabf580798234e381a0a4ab50) → `concepts/kundesitater`
- Strategi samling Farris (31798afcabf5800aa655fe21ec1c734c) → `meetings/2026/strategisamling-farris`

For each page:
1. `notion-fetch` the page content
2. Transform Notion markdown to brain markdown (frontmatter + compiled_truth + timeline)
3. Store `notion_id` in frontmatter for dedup on next sync
4. Extract entity mentions → create links

### Deduplication

Use `notion_id` in frontmatter as the dedup key:
```
For each Notion page:
  existing = search brain for frontmatter.notion_id == page.id
  if existing AND content unchanged: skip
  if existing AND content changed: update compiled_truth
  if not existing: create new page
```

## Slack Ingestion

### Signal Detection — What's Worth Capturing

**Always capture:**
- Threads in `#project-*` channels with 3+ replies
- Threads in `#salg` with deal/client mentions
- Threads in `#tech-talk` with 5+ replies or link shares
- Any thread with star emoji reaction

**Capture selectively:**
- `#brainstorming` — ideas worth tracking
- `#general` — only if contains decisions or announcements

### Per-Channel Strategy

| Channel | Brain entity | What to extract |
|---------|-------------|-----------------|
| #project-* (9 channels) | `project` timeline | Status updates, decisions, blockers |
| #salg | `deal` timeline | New leads, pipeline updates |
| #tech-talk | `concept` pages | Tool recommendations, architecture decisions |
| #brainstorming | `concept` pages | Ideas, frameworks |
| #general | various | Announcements, decisions |
| #wins, #friday-wins | `project` timeline | Shipped features, milestones |

### Workflow

1. `slack_search_public` for threads with 3+ replies in target channels
2. For each qualifying thread: `slack_read_thread` to get full content
3. Determine brain entity type and slug
4. Check if already ingested (store `slack_thread_ts` in frontmatter)
5. Extract: decisions, action items, knowledge, entity mentions
6. Write to brain: either new page or timeline entry on existing page
7. Cross-link mentioned entities
8. `log_ingest` with source_type="slack"

### Slack Channel → Project Mapping

| Slack Channel | Brain Project Slug |
|---------------|-------------------|
| #project-baneservice | `projects/baneservice` |
| #project-zevent | `projects/zevent` |
| #project-aidn | `projects/aidn` |
| #project-velox | `projects/velox` |
| #project-nki | `projects/nki` |
| #project-norgesgruppen | `projects/norgesgruppen` |
| #project-neo | `projects/neo` |
| #project-obos | `projects/obos` |
| #project-velo-cdp | `projects/velo-cdp` |

## Calendar Ingestion (Outlook)

### Workflow

1. `outlook_calendar_search` for events in the next 7 days
2. For each event with external attendees:
   - Create/update `meeting` page
   - Link to client/person pages for attendees
   - Store `outlook_event_id` for dedup
3. For recurring internal meetings (weeklys, all-hands):
   - Create meeting page only if it has attached notes or agenda

### Meeting → Brain Mapping

| Calendar Category | Brain Type | Auto-create? |
|-------------------|-----------|-------------|
| External client meeting | `meeting` + `client` timeline | Yes |
| Internal all-hands | `meeting` | Yes |
| Internal 1:1 | Skip unless has notes | No |
| Workshop | `meeting` | Yes |

## Quality Rules

- Compiled truth is REWRITTEN, not appended. Current best understanding only.
- Timeline entries are reverse-chronological (newest first)
- Every entity mention creates a link (Iron Law)
- Source attribution on every timeline entry
- Dedup by source ID (`notion_id`, `slack_thread_ts`, `outlook_event_id`)
- Test on 3-5 items before bulk sync

## Tools Used

- Notion: `notion-search`, `notion-fetch`
- Slack: `slack_search_public`, `slack_read_thread`, `slack_read_channel`
- Outlook: `outlook_calendar_search`
- Brain: `put_page`, `add_timeline_entry`, `add_link`, `add_tag`, `put_raw_data`, `log_ingest`, `search`, `query`, `get_page`
