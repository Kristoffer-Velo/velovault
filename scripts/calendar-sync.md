# Calendar → velo-brain Sync Script

This is a Claude scheduled task prompt. It syncs Outlook calendar events to meeting pages.

## Instructions

### Step 1: Fetch Upcoming Events

```
outlook_calendar_search query="*" afterDateTime="today" beforeDateTime="7 days from now" limit=30
```

### Step 2: Process Each Event

For each event:

1. **Skip if internal 1:1** without notes or agenda
2. **Skip if already ingested**: check `velo-brain search` for matching outlook_event_id in raw_data
3. **Create meeting page** for:
   - External client meetings (always)
   - Internal all-hands / workshops (always)
   - Meetings with agenda or attached documents

Transform to brain markdown:
```markdown
---
type: meeting
title: {event subject}
tags: [{category}]
date: {event date}
category: {inferred: Salg/All-hands/Workshop/Intern}
attendees: [{attendee names}]
outlook_event_id: "{event id}"
last_enriched: {today}
---

# {Event Subject}

> {date}, {time} — {attendees list}

## Agenda
{from event body if present}

## Attendees
{list with roles if known from brain}

---

## Timeline
- **{today}** | Calendar sync — Meeting created from Outlook. [Source: Outlook Calendar, {today}]
```

4. `velo-brain put_page` with slug `meetings/{YYYY}/{date}-{slugified-title}`

### Step 3: Attendee Enrichment

For each attendee:
1. `velo-brain search "{attendee name}"` — do they have a brain page?
2. If yes: add timeline entry about the upcoming meeting
3. If external and no page: note for potential enrichment (don't auto-create for one-time attendees)

### Step 3.5: Research Ukjente Kontakter & Selskaper

For hvert møte med eksterne deltakere, sjekk om vi allerede kjenner dem godt nok:

**3.5a. Vurder om research trengs:**

For hver ekstern deltaker og deres selskap:
```
velo-brain search "{person name}"
velo-brain search "{company name from email domain}"
```

Research trengs IKKE hvis:
- Personen har en brain-side med fyldig `## State`-seksjon (ikke bare navn/epost)
- Selskapet har en brain-side med aktive prosjekter linket
- Vi har hatt 3+ møter med personen (sjekk timeline)

Research TRENGS hvis:
- Personen finnes ikke i brain
- Personen finnes men har bare skeleton-side (kun navn/epost fra Notion-import)
- Selskapet er helt ukjent (ingen brain-side)
- Første møte med dette selskapet

**3.5b. Gjør research (brain-first, deretter web):**

For personer som trenger research:
```
# 1. Sjekk om selskapet finnes
velo-brain search "{company}"

# 2. Web research — selskap
web_search "{company name} Norway" — hva gjør de, størrelse, bransje
web_search "{company name} AI digital" — er de relevante for oss?

# 3. Web research — person
web_search "{person name} {company}" — rolle, bakgrunn
```

**3.5c. Lagre research i brain:**

Opprett/oppdater person- og klientsider etter `schema.md`-templates:
```
velo-brain put_page slug="persons/{firstname-lastname}" ...
velo-brain put_page slug="clients/{company-slug}" ...  (kun hvis nytt selskap)
```

Legg til links mellom person → selskap:
```
velo-brain add_link from="persons/{slug}" to="clients/{slug}" link_type="works_at"
```

**3.5d. Kompiler research-sammendrag og send på epost:**

Samle research for ALLE ukjente i ett sammendrag-epost. Formatet:

```
Emne: 📋 Meeting prep — research på nye kontakter ({dato-range})

Hei Kristoffer,

Her er research på folk/selskaper du møter denne uken som vi ikke kjente fra før:

---

## {Møtetittel} — {dato, klokkeslett}

### {Person Navn} ({Selskap})
- **Rolle:** {tittel}
- **Selskap:** {kort om selskapet — hva de gjør, størrelse, bransje}
- **Relevans for Velo:** {hvorfor de kan være interessante — AI-modenhet, bransje, størrelse}
- **Bakgrunn:** {karrierebakgrunn i 1-2 setninger}
- **Tips til møtet:** {en konkret ting å nevne/spørre om}

[Lagret i brain: persons/{slug}, clients/{slug}]

---

(gjenta for hvert møte med ukjente kontakter)

Kilde: velo-brain calendar sync + web research, {dato}
```

Send med Outlook:
```
outlook_send_email
  to: kristoffer@velo.no
  subject: "📋 Meeting prep — research på nye kontakter {uke/dato}"
  body: {sammendraget over}
```

**Viktig:**
- Send KUN hvis det faktisk er noen som trengte research (ikke tom epost)
- Maks 3-4 setninger per person — kort og handlingsrettet
- Fokuser på det som er relevant for Velo (AI, digital, konsulentbehov)
- Tonen er intern-memo, ikke formell rapport

### Step 4: Client Meeting Prep Context

For meetings with known clients:
1. Find the client brain page
2. Add timeline entry: "Upcoming meeting: {title}" [Source: Outlook Calendar]
3. This makes the meeting visible in `/client-brief` skill

### Step 5: Log

`velo-brain log_ingest` source_type="outlook_calendar", pages_updated=[...], summary
