# Notion → velo-brain Sync Script

This is a Claude scheduled task prompt. It syncs Notion databases to velo-brain.

## Instructions

You are syncing Notion data into velo-brain. Follow these steps precisely.

### Step 1: Sync Prosjekter (Projects)

Search Notion for all projects:
```
notion-search query="prosjekt" page_size=25
```

For each project in the Prosjekter database (collection://cb752456-856e-42b0-bdad-277f4f54fe0d):
1. `notion-fetch` the project page to get full content
2. `zbrain search` for existing page with matching notion_id
3. Transform to brain markdown:

```markdown
---
type: project
title: {Prosjektnavn}
tags: [{client-slug}, {salgsfase lowercase}]
client: clients/{client-slug}
ansvarlig: persons/{ansvarlig-slug}
salgsfase: {Salgsfase}
leveringsstatus: {Leveringsstatus}
faktureringstype: {Faktureringstype}
pris: {Pris}
timeomfang: {Timeomfang}
prosjektstart: {Prosjektstart}
prosjektslutt: {Prosjektslutt}
kontrakt_url: {Kontrakt-URL}
slack_channel: "#project-{slug}"
notion_id: "{notion-page-id}"
last_enriched: {today}
---

# {Prosjektnavn}

> {Siste oppdatering or scope summary}

## Scope
{Page body content from Notion}

## Team
- **Ansvarlig:** {Ansvarlig name}
- **Kontaktperson:** {Kontaktperson name}
- **Kunde:** {Kunde name}

## Key Dates
- Prosjektstart: {start}
- Prosjektslutt: {end}

---

## Timeline
- **{today}** | Notion sync — Page synced from Notion. [Source: Notion, "{title}", {today}]
```

4. `zbrain put_page` with slug `projects/{slugified-name}`
5. `zbrain add_link` from project to client and persons
6. `zbrain put_raw_data` with full Notion response

### Step 2: Sync Kunder (Clients)

For each client in Kunder database (collection://5dd9a5bc-7ff9-43c0-8cb6-712387a4506b):
1. `notion-fetch` the client page
2. Transform to brain markdown with type: client
3. `zbrain put_page` with slug `clients/{slugified-name}`
4. Link to related projects and contacts

### Step 3: Sync Ansatte (Team)

For each person in Ansatte database (collection://1ec98afc-abf5-8081-977a-000ba33fbf48):
1. `notion-fetch` the person page
2. Transform to person template
3. `zbrain put_page` with slug `persons/{firstname-lastname}`

### Step 4: Sync Møter (Meetings)

For recent meetings in Møter database (collection://2c698afc-abf5-81a6-a6ec-000b1fc75791):
1. Only sync meetings from last 30 days
2. `notion-fetch` each meeting page (contains notes)
3. Transform to meeting template
4. `zbrain put_page` with slug `meetings/{YYYY}/{date}-{slugified-title}`
5. Link to attendee person pages

### Step 5: Sync Key Pages

Sync these high-value pages:
- Håndbok → `processes/handbok`
- Ny i Velo → `processes/ny-i-velo`
- Strategi og retning → `concepts/strategi`
- Velo Brand → `concepts/velo-brand`
- Ansattgoder → `processes/ansattgoder`

For each:
1. `notion-fetch` by page ID
2. Transform content to brain markdown
3. `zbrain put_page`

### Step 6: Log & Report

After all syncs:
1. `zbrain log_ingest` with source_type="notion", summary of pages created/updated
2. Report: "Notion sync complete. Created X new pages, updated Y existing."

## Dedup Rules

- Always check `notion_id` in frontmatter before creating
- If page exists with same notion_id: only update if Notion page was modified since last_enriched
- Never create duplicate pages

## Error Handling

- If a Notion fetch fails: log warning, skip, continue with next item
- If a brain write fails: log error, continue
- Always complete the full sync even if individual items fail
