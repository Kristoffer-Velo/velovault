# /recall — Multi-Hop Retrieval

Henter dypt kontekstualisert svar fra brain ved å følge relasjoner 1-2 hopp ut fra treffene.
Løser det største problemet med single-hop search: du får prosjektet, men ikke klienten, teamet, siste møter, eller relevante deals.

> Bruk når du trenger komplett bilde — ikke bare en enkelt page.

## Trigger

```
/recall {spørsmål}
```

Eksempler:
- `/recall hva er status på Baneservice?`
- `/recall hvem jobber med NKI og hva er konteksten?`
- `/recall gi meg alt vi vet om Norgesgruppen`

## Workflow

### Fase 1: Bred søk (finn ankerpunkter)

Kjør parallelle søk for å finne relevante sider:

```
velo-brain query "{spørsmålet}" limit=5
velo-brain search "{nøkkelord fra spørsmålet}" limit=5
```

Dedupliser resultater. Disse er **ankerpunktene** — startpunktene for graph-traversering.

### Fase 2: Graph-ekspansjon (1-2 hopp)

For hvert ankerpunkt (maks 3 mest relevante):

```
velo-brain traverse_graph slug="{slug}" depth=2
```

Dette gir alle noder innenfor 2 hopp: klienter, personer, prosjekter, deals, møter.

**Filtrering:** Ikke alt er relevant. Prioriter basert på spørsmålet:
- Spørsmål om status → prosjekt + siste møter + ansvarlig person
- Spørsmål om person → person + prosjekter de jobber med + klient-kontekst
- Spørsmål om klient → klient + alle prosjekter + kontaktpersoner + deals
- Spørsmål om deal → deal + klient + ansvarlig + relaterte prosjekter

### Fase 3: Dyp lesing (hent innhold)

For de mest relevante nodene fra fase 2 (maks 6-8 sider):

```
velo-brain get_page slug="{slug}"
```

Les compiled truth-seksjonen (over `---`). Hopp over timeline med mindre spørsmålet spesifikt handler om historikk.

### Fase 4: Context activation

Sjekk om noen av de leste sidene har `activates:` i frontmatter.
Last også disse sidene — de inneholder konvensjoner eller kontekst som er relevant.

### Fase 5: Confidence check

For hver side som bidrar til svaret, noter confidence-nivå:
- **high** → bruk direkte
- **medium** → bruk, men marker som "sist verifisert {dato}"
- **low** → flagg eksplisitt: "OBS: denne infoen er utdatert (sist verifisert {dato})"

### Fase 6: Kompiler svar

Bygg et samlet svar som fletter sammen kontekst fra alle hopp:

```markdown
## {Svar på spørsmålet}

{Kompilert svar som syntetiserer info fra alle kilder}

### Kontekst
- **Klient:** {navn} — {kort oppsummering}
- **Prosjekt:** {navn} — {status, neste steg}
- **Team:** {personer involvert}
- **Siste aktivitet:** {dato, hva}
- **Åpne deals:** {om relevant}

### Kilder
- {slug} (confidence: {level})
- {slug} (confidence: {level})
- ...

### Gaps
{Hva vi IKKE fant — entiteter som ble nevnt men mangler brain-page, 
eller spørsmål vi ikke kan svare på basert på brain-innhold}
```

## Viktige regler

1. **Alltid rapporter gaps** — Manglende info er like viktig som funnet info. Hvis en person nevnes men ikke har brain-page, si det.
2. **Siter alt** — Hver fakta skal ha slug-referanse.
3. **Confidence er synlig** — Brukeren skal se om de stoler på dataen.
4. **Maks 8 sider dyp lesing** — Mer enn det er støy. Vær selektiv.
5. **Temporal awareness** — Nyere info trumfer eldre. Sjekk `last_enriched` og `last_verified`.
6. **Følg activates** — Context activation chains er ikke valgfritt.

## Eksempel: `/recall hva er status på Baneservice?`

Fase 1: Søk finner `projects/baneservice`
Fase 2: Traverse → `clients/baneservice`, `persons/kristoffer-kristensen` (ansvarlig), `meetings/2026/...` (siste møte), `deals/baneservice-fase-2`
Fase 3: Les 5 sider
Fase 4: `projects/baneservice` har `activates: [conventions/klient-kommunikasjon]` → les den også
Fase 5: Prosjekt = high, deal = medium (23 dager gammel)
Fase 6: Kompiler samlet statusbilde med alle dimensjoner
