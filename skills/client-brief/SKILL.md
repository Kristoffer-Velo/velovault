# Client Brief — Kompiler alt vi vet om en kunde før møte

Samle all intern kunnskap + ekstern research om en kunde til et handlingsrettet briefing-dokument.
Resultat: du går inn i møtet bedre forberedt enn kunden forventer.

> **Filing rule:** Read `schema.md` before creating any new page.

## Iron Law: Brain-First Lookup (MANDATORY)

ALLTID sjekk velo-brain FØR du søker eksternt. Brain har relasjonshistorikk,
møtenotater, interne vurderinger og kryssreferanser som ingen ekstern kilde kan gi.

## Philosophy

En client brief er ikke et LinkedIn-sammendrag. Det er et intelligence-dokument
som svarer: hva vet vi, hva mangler vi, og hva bør vi gjøre i dette møtet?

Texture > fakta. "De er fornøyde med oss" er ubrukelig.
"Alexander i innovasjonsavdelingen er solgt på Claude-demo, men har ikke
budsjettmyndighet — neste steg er å nå styringsgruppen" er handlingsrettet.

## Workflow

### Fase 1: Brain Research (obligatorisk, alltid først)

**1a. Finn klientsiden:**
```
velo-brain search "{kundenavn}"
velo-brain get_page "clients/{slug}"
```

**1b. Hent alle relaterte sider:**
```
velo-brain get_links "clients/{slug}"          → prosjekter, personer
velo-brain get_backlinks "clients/{slug}"      → hvem refererer til denne kunden?
velo-brain get_timeline "clients/{slug}"       → kronologisk historikk
```

**1c. Hent prosjektdetaljer:**
For hvert prosjekt linket til kunden:
```
velo-brain get_page "projects/{slug}"
velo-brain get_timeline "projects/{slug}"
```

**1d. Hent persondetaljer:**
For hver kontaktperson og teammedlem på prosjektet:
```
velo-brain search "{kontaktperson navn}"
velo-brain get_page "persons/{slug}"
```

**1e. Sjekk deals:**
```
velo-brain search "{kundenavn}" --type deal
```

**1f. Sjekk Slack-kontekst (live):**
```
slack_read_channel channel_id={prosjektkanal} limit=15
slack_search_public query="{kundenavn}" limit=5
```

**1g. Sjekk kalender:**
```
outlook_calendar_search query="{kundenavn}" limit=5
```

### Fase 2: Ekstern Research (kun hvis brain har hull)

Kun hvis brain mangler viktig kontekst:

**2a. Selskapsinfo:**
- Nettside, siste nyheter, ansatte-tall, bransjeposisjon
- Bruk web search kun for det brain IKKE har

**2b. Kontaktperson-research:**
- LinkedIn-profil, siste poster, karrierebevegelser
- Kun for Tier 1-kontakter (beslutningstakere)

**2c. Bransjekontext:**
- Hva skjer i kundens bransje som er relevant for AI?
- Konkurrenter som bruker AI?

### Fase 3: Syntese

Kompiler briefen med denne strukturen:

```
# Client Brief: {Kundenavn}
Dato: {dato} | Forberedt av: velo-brain

## TL;DR
3 setninger: hvem de er, hva vi gjør for dem, hva som er neste steg.

## Relasjonshistorikk
- Når startet samarbeidet
- Hva har vi levert (med verdier)
- Hvordan gikk det (feedback-sitater)
- Relasjonstemperatur: 🟢 varm / 🟡 lunken / 🔴 kald

## Aktive Prosjekter
For hvert prosjekt:
- Navn, status, verdi
- Hvem jobber der fra Velo
- Siste status-update
- Neste milepæl

## Pipeline / Leads
- Åpne deals med denne kunden
- Mulige utvidelser
- Ting vi har diskutert men ikke lukket

## Nøkkelpersoner
For hver person:
- Navn, rolle, kontaktinfo
- Beslutningmyndighet (ja/nei/ukjent)
- Vår relasjon til dem
- Hva de bryr seg om (fra møtenotater/Slack)

## Teamet vårt
- Hvem fra Velo som har jobbet med denne kunden
- Hvem kjenner kontaktpersonene

## Møteforberedelse
- Hva bør vi ta opp?
- Hva bør vi IKKE ta opp? (sensitive temaer, tapte deals)
- Hva vil kunden sannsynligvis spørre om?
- Hva er vårt mål med møtet?

## Kunnskapshull
- Hva vet vi IKKE som vi burde vite?
- Foreslåtte enrichment-tiltak

## Kilder
[Source: velo-brain, Notion, Slack — {dato}]
```

### Fase 4: Oppdater brain

Etter at briefen er kompilert:
1. Sjekk om klientsiden trenger oppdatering med ny info
2. Legg til timeline entry: "Client brief forberedt for møte {dato}"
3. Flagg kunnskapshull for fremtidig enrichment

## Tone of Voice

Briefen skal leses som en intern memo mellom kollegaer — direkte, uformell,
handlingsrettet. Ikke corporate-speak. Bruk Velo-teamets faktiske ordvalg
der det er tilgjengelig (sitater fra Slack, møtenotater).

Dårlig: "Baneservice er en ledende aktør innen jernbaneinfrastruktur..."
Bra: "Baneservice — 600 ansatte, innovasjonsavdelingen tester AI. Alexander
er solgt på Claude-demoen, men de er generelt trege. Neste: pilotbrukere."

## Quality Rules

- ALLE fakta har [Source: ...] citation
- Brain-resultater brukes FØRST, deretter eksterne kilder
- Kunnskapshull flagges eksplisitt (ikke gjettes)
- Briefen inkluderer handlingspunkter, ikke bare fakta
- Kontaktinfo (epost, telefon) inkluderes der tilgjengelig
- Relasjonstemperatur er vår ærlige vurdering, ikke hva kunden sier

## Tools Used

**Brain (obligatorisk):**
- search, query, get_page, get_links, get_backlinks, get_timeline, list_pages

**Slack (anbefalt):**
- slack_read_channel, slack_search_public, slack_read_thread

**Kalender (anbefalt):**
- outlook_calendar_search

**Web (kun ved hull):**
- web_search, web_fetch
