# schema.md — velo-brain Page Conventions & Templates

## Two-Layer Pattern

Every page has two layers, separated by `---`:

**Above the line — Compiled Truth.** Always current, always rewritten when new info arrives.
**Below the line — Timeline.** Append-only, never rewritten. Reverse-chronological evidence log.

---

## Entity Types

| Type | Directory | Source |
|------|-----------|--------|
| person | `persons/` | Notion Ansatte + Kontaktpersoner, Slack |
| client | `clients/` | Notion Kunder-db |
| project | `projects/` | Notion Prosjekter-db, Slack #project-* |
| meeting | `meetings/` | Notion Møter-db, Outlook Calendar |
| deal | `deals/` | Notion Prosjekter (Salgsfase=Lead/Tilbud) |
| concept | `concepts/` | Notion strategi-sider, Slack #tech-talk |
| process | `processes/` | Notion Håndbok, onboarding, rutiner |
| objective | `objectives/` | Notion Objectives + Key Results |
| convention | `conventions/` | Team learnings, /boot cortex |
| correction | `corrections/` | Structural fixes for recurring mistakes |

---

## Person Template (team + contacts)

```markdown
---
type: person
title: Full Name
tags: [role]
role: Current Role
company: Company Name
email: email@example.com
phone: "+47..."
stilling: Job Title
notion_id: "notion-page-id"
last_enriched: YYYY-MM-DD
---

# Full Name

> Role, company, key context.

## State
Role, responsibilities, skills, current focus.

## Contact
- Email, phone, preferred channel.

## Projects
Links to active project pages.

---

## Timeline
- **YYYY-MM-DD** | Source — What happened.
```

## Client Template

```markdown
---
type: client
title: Company Name
tags: [industry]
org_number: "..."
industry: Industry
website: https://
contact_name: Primary Contact
contact_email: email@example.com
contact_phone: "+47..."
eier: Velo person responsible
notion_id: "notion-page-id"
last_enriched: YYYY-MM-DD
---

# Company Name

> What they do, relationship, typical project needs.

## Key Contacts
| Name | Role | Email | Phone |
|------|------|-------|-------|

## Projects
Links to past and active projects.

## Preferences
- Communication style
- Tech preferences
- Decision-making process

---

## Timeline
- **YYYY-MM-DD** | Source — What happened.
```

## Project Template

```markdown
---
type: project
title: Project Name
tags: [client, tech]
client: clients/slug
ansvarlig: persons/slug
salgsfase: Lead | Tilbud | On-hold | Vunnet | Tapt | Ikke aktuell
leveringsstatus: Ikke startet | Pågår | Fullført
faktureringstype: Timepris | Fastpris | Sweat equity
pris: 0
timeomfang: 0
prosjektstart: YYYY-MM-DD
prosjektslutt: YYYY-MM-DD
kontrakt_url: https://
slack_channel: "#project-name"
notion_id: "notion-page-id"
last_enriched: YYYY-MM-DD
---

# Project Name

> Client, type, status, key people.

## Scope
What we're building/delivering.

## Team
- **Ansvarlig:** Name
- **Kontaktperson (kunde):** Name

## Key Dates
- Prosjektstart:
- Prosjektslutt:
- Milestones:

## Siste oppdatering
Latest status update.

---

## Timeline
- **YYYY-MM-DD** | Source — What happened.
```

## Meeting Template

```markdown
---
type: meeting
title: Meeting Title
tags: [category]
date: YYYY-MM-DD
category: All-hands | Workshop | Salg
attendees: [person1, person2]
notion_id: "notion-page-id"
last_enriched: YYYY-MM-DD
---

# Meeting Title

## Key Points
- Main takeaways

## Action Items
- [ ] Person: task

## Decisions
- What was decided and why

---

## Timeline
- **YYYY-MM-DD** | Source — Notes and updates.
```

## Deal Template

```markdown
---
type: deal
title: Deal Name
tags: [client]
client: clients/slug
ansvarlig: persons/slug
salgsfase: Lead | Tilbud | On-hold | Vunnet | Tapt
verdi: 0
kontaktperson: persons/slug
notion_id: "notion-page-id"
last_enriched: YYYY-MM-DD
---

# Deal Name

> Client, value, status, next step.

## Context
How we got the lead, what they need, timeline.

## Next Steps
- What needs to happen to move forward

---

## Timeline
- **YYYY-MM-DD** | Source — What happened.
```

## Concept Template

```markdown
---
type: concept
title: Concept Name
tags: [category]
source_url: https://
notion_id: "notion-page-id"
last_enriched: YYYY-MM-DD
---

# Concept Name

> What this is, why it matters to Velo.

## Key Points
- Core ideas and principles

## How We Use It
- How this applies to our work

## Related
Links to related concepts, projects, people.

---

## Timeline
- **YYYY-MM-DD** | Source — Updates and references.
```

## Process Template

```markdown
---
type: process
title: Process Name
tags: [category]
notion_id: "notion-page-id"
last_enriched: YYYY-MM-DD
---

# Process Name

> What this process covers and who it's for.

## Steps
1. Step one
2. Step two

## Notes
- Important caveats or variations

---

## Timeline
- **YYYY-MM-DD** | Source — Changes to this process.
```

## Objective Template

```markdown
---
type: objective
title: Objective Name
tags: [periode]
periode: "YYYY - QX"
ansvarlig: persons/slug
notion_id: "notion-page-id"
last_enriched: YYYY-MM-DD
---

# Objective Name

> What we're trying to achieve.

## Key Results
| KR | Target | Current | Progress |
|----|--------|---------|----------|

## Status
Current assessment of progress.

---

## Timeline
- **YYYY-MM-DD** | Source — Progress updates.
```

## Convention Template

```markdown
---
type: convention
title: Convention Name
tags: [category]
severity: must | should | prefer
activates: []
created: YYYY-MM-DD
---

# Convention Name

> One-line rule.

## Regel
Hva som skal gjøres, presist og testbart.

## Hvorfor
Bakgrunn — hva som gikk galt eller hva vi lærte som førte til denne konvensjonen.

## Når den gjelder
Kontekst og triggers — når skal denne regelen aktiveres?

## Eksempel
Konkret eksempel på riktig vs. feil bruk.
```

## Correction Template

```markdown
---
type: correction
title: Correction Name
tags: [category]
severity: critical | important | minor
corrects: "slug of page/pattern that caused the issue"
created: YYYY-MM-DD
---

# Correction Name

> One-line: hva som gikk galt og den strukturelle fiksen.

## Problemet
Hva som skjedde — konkret feil, ikke bare "det funket ikke".

## Rotårsak
Hvorfor det skjedde — strukturell årsak, ikke bare symptom.

## Korreksjon
Den permanente regelen/endringen som forhindrer gjentakelse.

## Verifisering
Hvordan sjekke at korrekturen virker — hva ser du etter?
```

## Confidence Scoring (alle entity types)

Alle sider kan ha disse feltene i frontmatter:

```yaml
confidence: high | medium | low    # Hvor sikre vi er på innholdet
last_verified: YYYY-MM-DD          # Sist noen sjekket at dette stemmer
```

- **high** — Nylig verifisert mot primærkilde, aktivt i bruk
- **medium** — Synket fra kilde men ikke manuelt verifisert, eller >30 dager gammel
- **low** — Utledet, antatt, eller >90 dager siden siste verifisering

assumption-check oppdaterer disse feltene. `/boot` flagger low-confidence sider.

## Context Activation (activates-feltet)

Sider kan definere `activates: [slug1, slug2]` i frontmatter.
Når en side leses, bør relatert kontekst fra activates-listen også lastes.

Eksempel: en klient-page kan ha `activates: [conventions/klient-kommunikasjon, persons/ansvarlig]`
slik at relevante regler og kontekst alltid følger med.

## Filing Rules

1. **Person** (team or contact) → `persons/`
2. **Client/customer** → `clients/`
3. **Project** (active or past) → `projects/`
4. **Meeting** → `meetings/YYYY/`
5. **Deal/lead** (pre-sale) → `deals/`
6. **Reusable knowledge** → `concepts/`
7. **Internal process** → `processes/`
8. **Objective/OKR** → `objectives/`
9. **Convention** (team rule) → `conventions/`
10. **Correction** (structural fix) → `corrections/`
11. **Raw imports** → `sources/`
12. **Unsorted** → `inbox/`

## Slug Convention

- Lowercase, hyphens: `kristoffer-kristensen`, `norgesgruppen`, `project-aidn`
- Persons: `firstname-lastname`
- Clients: `company-name`
- Projects: `project-name` (match Slack channel name where possible)

## Commit Convention

```
ingest: notion sync — 5 projects, 3 clients updated
ingest: slack extraction — #tech-talk decisions
update: clients/norgesgruppen — new contact info
feat: add process/deploy-checklist
meeting: 2026-04-10 weekly all-hands
```

## Source IDs (deduplication)

Every page synced from an external source carries `notion_id`, `slack_thread_ts`,
or `outlook_event_id` in frontmatter. Ingestion pipelines check these before
writing to avoid duplicates.
