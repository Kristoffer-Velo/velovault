# Hot Cache — daglig session primer

This is a Claude scheduled task prompt. It generates a compressed context block that `/boot` loads at session start.

Inspirert av Letta's "core memory" og Karpathy's LLM Wiki hot cache.
Målet: ~500 ord med det viktigste agenten trenger å vite akkurat nå.

## Instructions

You are building today's hot cache — a compressed snapshot of Velo Labs' operational state.
This gets stored as a brain page and loaded by `/boot` at every session start.

### Step 1: Gather active projects

```
velo-brain query "prosjekter leveringsstatus pågår aktive" limit=20
```

For hvert aktivt prosjekt, hent:
- Prosjektnavn, klient, ansvarlig
- Leveringsstatus og salgsfase
- Siste timeline-entry (nyeste oppdatering)

Komprimér til én linje per prosjekt:
```
- **{prosjekt}** ({klient}) — {status}. Ansvarlig: {person}. Sist: {dato} {kort oppdatering}
```

### Step 2: Gather open deals

```
velo-brain query "deals lead tilbud pipeline salg" limit=10
```

For hver åpen deal:
- Deal-navn, klient, verdi, salgsfase
- Neste steg (fra compiled truth)

Komprimér:
```
- **{deal}** ({klient}) — {fase}, {verdi}kr. Neste: {handling}
```

### Step 3: This week's meetings

```
velo-brain query "møter denne uken" limit=10
```

Filtrer til møter med dato innenfor denne uken (mandag–fredag).
```
- **{dato}** {tittel} — {deltakere}. {key takeaway om tilgjengelig}
```

### Step 4: Team focus

```
velo-brain query "team ansatte fokus kapasitet" limit=6
```

For hvert teammedlem, hvis info er tilgjengelig:
```
- **{navn}** — Jobber med: {prosjekter}. 
```

### Step 5: Alerts (fra confidence-decay og brain-health)

```
velo-brain get_page slug="meta/brain-health"
```

Hent siste alerts:
- Sider med low confidence som er kritiske (klienter, aktive prosjekter)
- Deals uten aktivitet >14 dager
- Prosjekter med utløpende kontrakt innen 30 dager

### Step 6: Write hot cache

Kompiler alt til én page og skriv til brain:

```
velo-brain put_page slug="meta/hot-cache" content="{se format under}"
```

**Format:**

```markdown
---
type: process
title: Hot Cache
tags: [meta, boot]
generated: {YYYY-MM-DD HH:MM}
confidence: high
last_verified: {today}
---

# Hot Cache — {today}

> Auto-generert daglig kontekst for session bootstrap. Ikke rediger manuelt.

## Aktive prosjekter
{komprimert liste}

## Pipeline
{åpne deals}

## Denne uken
{møter}

## Team
{fokus per person}

## Alerts
{stale data, inaktive deals, utløpende kontrakter}
```

### Step 7: Log

```
velo-brain log_ingest
  source_type="hot-cache"
  source_ref="scheduled-daily"
  pages_updated=["meta/hot-cache"]
  summary="Hot cache rebuilt. {N} active projects, {M} open deals, {K} meetings this week."
```

## Important

- Hot cache er ALLTID auto-generert. Aldri rediger manuelt — den overskrives daglig.
- Maks ~500 ord. Vær brutal med komprimering. Detaljer finnes i de individuelle sidene.
- Confidence er alltid `high` fordi den bygges fra live brain-data.
- Hvis brain er tom eller har lite data, generer det du kan og noter gaps.
- `/boot` leser `meta/hot-cache` som siste steg — den gir agenten umiddelbar situasjonsbevissthet.
