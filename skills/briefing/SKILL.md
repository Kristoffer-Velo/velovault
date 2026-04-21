# /briefing — Daglig forberedelse

En personlig morgenbriefing: hva må du vite i dag for å møte dagen forberedt?

> Kjør `/briefing` om morgenen, eller `/briefing for {dag/uke}` for et annet tidsrom.

## Philosophy

Hot-cache gir deg operasjonell tilstand (hva som er aktivt). Briefing legger på dagens
spesifikke kontekst: hvem du skal møte, hva de har snakket om sist, hvilke deals som
trenger oppmerksomhet, hvilke tråder som henger.

## Workflow

### 1. Start med hot-cache

```
velo-brain get_page slug="meta/hot-cache"
```

Dette gir deg grunnlinjen: aktive prosjekter, åpne deals, ukens møter, team-fokus.
Hvis hot-cache er fraværende eller eldre enn 2 dager, flagg det og bygg kontekst manuelt.

### 2. Finn dagens møter

```
outlook_calendar_search query="*" afterDateTime="today" beforeDateTime="tomorrow" limit=10
```

For hvert møte:
- Tittel, tidspunkt, deltakere
- Hvis møte har notion_id eller outlook_event_id som finnes i brain, hent historikk

### 3. Forbered per møte

For hvert møte med ekstern deltaker:

a) **Identifiser deltakere i brain:**
```
velo-brain query "{deltakernavn}" limit=3
velo-brain get_backlinks slug="persons/{slug}" # hvor er denne personen nevnt?
```

b) **Hent klient-kontekst hvis relevant:**
```
velo-brain get_page slug="clients/{client-slug}"
velo-brain traverse_graph slug="clients/{client-slug}" depth=1
```

c) **Siste aktivitet:**
- Åpne prosjekter med klienten
- Åpne deals
- Siste 2-3 møter
- Siste Slack-aktivitet i relevant kanal

### 4. Finn åpne tråder

**Follow-ups som henger:**
```
velo-brain query "action items ubehandlet follow-up" limit=10
```

**Deals uten nylig aktivitet:**
```
velo-brain query "deals åpne salgsfase"
```
For hver deal: sjekk `last_enriched` og timeline. Flagg hvis >14 dager siden aktivitet.

**Prosjekter som trenger oppmerksomhet:**
- Kontrakt utløper <30 dager
- `leveringsstatus: ikke startet` men `prosjektstart` er i fortiden
- `confidence: low` på aktive klient-prosjekter

### 5. Kompiler briefing

Format:

```markdown
# Briefing — {dag, dato}

## Dagens agenda
- **09:00** — {møtetittel} med {deltakere}
  - Klient: {klient} ({prosjekt-kontekst})
  - Sist snakket: {dato} om {tema}
  - Åpne punkter: {follow-ups fra sist}
  - Deal-status: {hvis relevant}
- **11:00** — {neste møte}
  ...

## Trenger oppmerksomhet i dag
- {Deal X} — 18 dager uten aktivitet, siste steg: "{handling}"
- {Prosjekt Y} — kontrakt utløper 30. april
- {Person Z} — lovet svar forrige uke, ikke sendt

## Kontekst fra hot-cache
{kort sammendrag av aktive prosjekter/pipeline}

## Gaps
- {Person X møter deg kl 10 men har ingen brain-page — vurder å lage en}
- {Klient Y har ikke vært oppdatert på 60 dager — confidence low}
```

### 6. Logg

```
velo-brain log_ingest
  source_type="briefing"
  source_ref="manual-{date}"
  pages_updated=[]
  summary="Briefing for {dato} — {N} møter forberedt, {M} åpne tråder flagget"
```

## Viktige regler

1. **Respekter confidence** — hvis data er low confidence, si det eksplisitt. Ikke lat som om gamle data er ferske.
2. **Flagg gaps** — personer uten brain-page, klienter uten oppdatert info. Dette er signal til å kjøre /learn eller /maintain.
3. **Aksjonerbar output** — ikke bare "status", men "hva bør du gjøre". Follow-ups, sendte-men-ikke-hørt, utløpende deadlines.
4. **Kort er bedre** — maks 1 skjermside. Dybde ligger i brain; briefing er toppen av isfjellet.
5. **Ikke rediger brain** — briefing er read-only på brain. Læring/oppdatering er andre skills sin jobb.

## Varianter

- `/briefing for denne uken` — utvid scope til alle møter mandag-fredag
- `/briefing for {klient}` — dyp-brief før spesifikt klientmøte (men bruk heller `/client-brief` som allerede finnes)
- `/briefing slack` — focus på åpne Slack-tråder som trenger svar

## Når bruker du hva?

| Situasjon | Skill |
|-----------|-------|
| Start av dagen, generell forberedelse | `/briefing` |
| Før spesifikt klientmøte (dyp research) | `/client-brief` |
| Slutt av uke, strategisk oversikt | `/weekly-digest` |
| Full kontekst om en entitet | `/recall` |
