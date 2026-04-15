---
type: convention
title: Siter kilder på alle fakta
tags: [ingestion, data-quality]
severity: must
activates: []
created: 2026-04-15
---

# Siter kilder på alle fakta

> Alle fakta i brain SKAL ha en inline `[Source: ...]` sitering.

## Regel
Bruk formatene:
- `[Source: Notion, "{side}", YYYY-MM-DD]`
- `[Source: Slack #kanal, @bruker, YYYY-MM-DD]`
- `[Source: Outlook Calendar, YYYY-MM-DD]`
- `[Source: Meeting "{tittel}", YYYY-MM-DD]`
- `[Source: GitHub, repo/path, YYYY-MM-DD]`

## Hvorfor
Uten kilde vet vi ikke om en fakta er verifisert, utdatert, eller oppdiktet.
Kildehenvisning gjør det mulig å gå tilbake til primærkilden ved tvil.

## Når den gjelder
Alltid — ved ingestion, manuell oppdatering, og /learn.

## Eksempel
Riktig: "Prosjektet startet 2026-01-15 [Source: Notion, "Baneservice AI Chat", 2026-04-10]"
Feil: "Prosjektet startet i januar" (ingen kilde, vagt tidspunkt)
