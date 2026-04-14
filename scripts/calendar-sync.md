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
2. **Skip if already ingested**: check `zbrain search` for matching outlook_event_id in raw_data
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

4. `zbrain put_page` with slug `meetings/{YYYY}/{date}-{slugified-title}`

### Step 3: Attendee Enrichment

For each attendee:
1. `zbrain search "{attendee name}"` — do they have a brain page?
2. If yes: add timeline entry about the upcoming meeting
3. If external and no page: note for potential enrichment (don't auto-create for one-time attendees)

### Step 4: Client Meeting Prep Context

For meetings with known clients:
1. Find the client brain page
2. Add timeline entry: "Upcoming meeting: {title}" [Source: Outlook Calendar]
3. This makes the meeting visible in `/client-brief` skill

### Step 5: Log

`zbrain log_ingest` source_type="outlook_calendar", pages_updated=[...], summary
