# /maintain — Brain Health Sweep

Kjører en full kvalitetssjekk av brain og foreslår (eller utfører) fiks.
User-facing skill — kjøres manuelt når du vil ha en grundig gjennomgang.

> Ikke en erstatning for confidence-decay-jobben (som kjører ukentlig automatisk).
> Maintain er dypere og bredere: orphans, dead links, filing violations, missing back-links.

## Workflow

### 1. Hent brain-stats

```
velo-brain get_stats
velo-brain get_health
```

Dette gir deg baseline: antall sider, chunks, embed-dekning, stale pages, orphans.

### 2. Kjør seks health-sjekker

#### A. Orphans (ingen linker inn eller ut)
```
velo-brain list_pages limit=200
```
For hver page:
```
velo-brain get_links slug="{slug}"
velo-brain get_backlinks slug="{slug}"
```
Hvis begge er tomme OG page er av type `person|client|project|deal` → orphan.

Orphans er mistenkelige: enten burde de linkes til noe, eller er de feilaktig opprettet.

#### B. Dead links (linker til ikke-eksisterende sider)

For hver link i `get_links`:
- Sjekk om `to_slug` returnerer en side via `get_page`
- Hvis ikke → dead link

#### C. Missing back-links

For hver page, les compiled_truth. Finn nevnelser av andre entiteter (navn, slugs).
For hver nevnelse, sjekk om det eksisterer en `add_link`. Hvis ikke → missing back-link.

Dette er den vanskeligste sjekken. Bruk LLM-resonnering, ikke regex.

#### D. Filing violations

For hver page:
- Sjekk om `slug` matcher `type` og filing rules fra `schema.md`
- Eksempler:
  - `type: person` men slug starter ikke med `persons/` → violation
  - `type: project` men ingen `client:` i frontmatter → violation
  - `type: meeting` men ingen `date:` → violation

#### E. Stale truth (compiled_truth motsier timeline)

For hver aktiv page:
- Les compiled_truth (toppen)
- Les siste 3 timeline-entries
- Hvis timeline motsier compiled_truth (f.eks. timeline sier "tapt" men compiled_truth sier "åpen deal") → stale truth

#### F. Missing confidence

For hver page:
- Sjekk om `confidence:` og `last_verified:` finnes i frontmatter
- Hvis ikke → add missing metadata

### 3. Kompiler rapport

```markdown
# Brain Health Report — {dato}

## Stats
- Total pages: {N}
- With embeddings: {M} ({%})
- Stale (>30d): {K}
- Low confidence: {L}

## Issues found: {total}

### Orphans ({N})
- persons/xxx — ingen linker, opprettet {dato}, aldri berørt
- ...

### Dead links ({N})
- projects/yyy → clients/zzz (target eksisterer ikke)
- ...

### Missing back-links ({N})
- meetings/2026/march-standup nevner "Andreas" men linker ikke til persons/andreas
- ...

### Filing violations ({N})
- slug "andreas" burde være "persons/andreas" (type: person)
- ...

### Stale truth ({N})
- deals/norgesgruppen-rfp — compiled_truth sier "åpen" men timeline 2026-03-14 sier "vunnet"
- ...

### Missing confidence metadata ({N})
- {list of slugs}

## Anbefalte handlinger
{prioritert liste — kritiske først}
```

### 4. Foreslå eller utfør fiks

**Standard: foreslå, ikke utfør.** Vis rapporten og spør bruker hva som skal fikses.

Hvis bruker svarer `/maintain fix` eller `/maintain fix {issue-type}`:
- Opprett manglende back-links
- Fjern dead links
- Oppdater frontmatter med manglende confidence
- Flytt sider til riktig slug hvis filing-violation

Ting som ALDRI fikses automatisk:
- Stale truth (krever menneskelig vurdering)
- Orphans (kan være gyldige placeholders)
- Større schema-endringer

### 5. Opprett korrekturer for mønstre

Hvis samme type feil skjer mange ganger (f.eks. 15 meetings uten date), opprett en `correction`:
```
velo-brain put_page slug="corrections/meeting-date-required" content="..."
```

Dette forhindrer gjentakelse fordi `/boot` vil laste korreksjonen neste gang.

### 6. Logg

```
velo-brain log_ingest
  source_type="maintain"
  source_ref="manual-{date}"
  pages_updated=[list of pages touched]
  summary="Maintain sweep: {issues_found} issues, {issues_fixed} fixed, {corrections_created} new corrections"
```

## Forhold til eksisterende jobs

| Job | Kjører når | Hva |
|-----|-----------|-----|
| `confidence-decay` (automatic) | Mandager 06:23 | Nedgraderer stale data, oppdaterer confidence |
| `/maintain` (manuell) | Ved behov | Full sweep: orphans, dead links, filing, back-links, stale truth |
| `assumption-check` (del av ingestion) | Ved ingestion | Verifiserer at ingested data matcher kilde |

Maintain er den bredeste, dypeste, og mest manuelle. Kjør den f.eks. månedlig eller før viktige presentasjoner/demos.

## Viktige regler

1. **Rapport først, fiks etterpå.** Ikke kjør fixes i samme sveip — del opp i lese-fase og skrive-fase.
2. **Ingenting som krever vurdering kan fikses automatisk.** Hvis du er i tvil, spør.
3. **Logg alt.** Hver maintain-run skal produsere et ingest-log entry.
4. **Lær av funnene.** Gjentatte mønstre → opprett correction page. Systemet skal bli bedre over tid.
