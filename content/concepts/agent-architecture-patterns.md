---
type: concept
title: Agent Architecture Patterns
tags: [architecture, agent, self-improvement, knowledge-system]
confidence: high
last_verified: 2026-04-15
activates: [conventions/structural-corrections, conventions/back-linking]
---

# Agent Architecture Patterns

> Konsepter og mønstre vi bruker på tvers av Velo-systemene (velo-brain, willy-viagra-kit).
> Bruk dette som kontekst-prompt når du bygger eller forbedrer agent-systemer.

---

## 1. Two-Layer Knowledge Pattern

**Brukes i:** velo-brain

Hver kunnskapsside har to lag, separert med `---`:

- **Compiled Truth** (over streken) — Alltid oppdatert. Overskrives når ny info kommer.
- **Timeline** (under streken) — Append-only. Reverse-kronologisk bevislogg. Aldri overskriv.

**Hvorfor:** Compiled truth gir rask tilgang til gjeldende sannhet. Timeline gir audit trail og mulighet til å forstå hvordan vi kom hit. Sammen løser de "hva er sant nå" og "hvorfor tror vi det".

**Når du bruker det:** Alle entiteter som endrer seg over tid (personer, prosjekter, klienter, deals).

---

## 2. Cortex Pattern (Boot-Loaded Identity)

**Brukes i:** willy (r7), velo-brain (/boot)

Et sett med regler og konvensjoner som lastes fra persistent lagring ved hver session-start. Cortex overstyrer default-oppførsel — den er "hvem agenten er", ikke bare "hva agenten vet".

**Komponenter:**
- **Konvensjoner** — Permanente regler teamet har lært (`conventions/*`)
- **Korrekturer** — Strukturelle fiks for feil som har skjedd (`corrections/*`)
- **Identitet** — Personlighet, kommunikasjonsstil, verdier (i willy: `cortex:*` noder)

**Hvorfor:** CLAUDE.md er statisk og krever commit for endring. Cortex lever i brain og kan oppdateres av agenten selv. Dette gjør systemet genuint selvforbedrende — ikke bare konfigurerbart.

**Kritisk regel:** Etter context compaction, last cortex på nytt fra brain. Compaction-sammendraget er IKKE en erstatning for live cortex-data.

---

## 3. Structural Correction Pattern

**Brukes i:** willy (r7 correction nodes), velo-brain (corrections/*)

Når en feil oppdages, lagre ikke bare "vi lærte X" — opprett en permanent, navngitt korreksjon med:
1. **Problemet** — Konkret hva som gikk galt
2. **Rotårsak** — Hvorfor det skjedde (strukturelt, ikke symptom)
3. **Korreksjon** — Den permanente regelen
4. **Verifisering** — Hvordan sjekke at fiksen virker

**Hvorfor:** En acknowledgment forhindrer ingenting. En strukturell korreksjon endrer fremtidig atferd permanent fordi den lastes ved boot. Over tid akkumulerer systemet et immunforsvar mot kjente feilmønstre.

**Anti-pattern:** "Ops, fikset." → Ingen læring lagret. Samme feil skjer igjen.

---

## 4. Context Activation Chains

**Brukes i:** willy (ACTIVATES-kanter), velo-brain (activates-felt i frontmatter)

Noder/sider definerer `activates: [slug1, slug2]` — når en side leses, skal relatert kontekst automatisk lastes med.

**Eksempler:**
- Klient-page → aktiverer relevante konvensjoner + ansvarlig person
- Prosjekt-page → aktiverer klient, team, tekniske konvensjoner
- Innenfor-runde-kontekst → aktiverer query-allokering, submission-safety, terrain-patterns

**Hvorfor:** Eliminerer "du glemte å sjekke X" ved å gjøre kontekst-lasting deklarativ. Relevans er kodet i grafen, ikke i agentens arbeidsminne.

---

## 5. Confidence Scoring & Decay

**Brukes i:** velo-brain

Alle sider har `confidence: high|medium|low` og `last_verified: YYYY-MM-DD`.

**Decay-regler:**
- **high** — Nylig verifisert mot primærkilde, aktivt i bruk
- **medium** — Synket men ikke manuelt verifisert, eller >30 dager gammel
- **low** — Utledet/antatt, eller >90 dager siden siste verifisering

**Hvorfor:** Kunnskap uten confidence-signal behandles som sannhet. Men data foreldes. Confidence scoring gjør foreldelse eksplisitt og handlingsbar.

---

## 6. Calibration Loop (Prediction Tracking)

**Brukes i:** willy (proxy_score vs actual_score per runde)

Lagre forventet utfall og faktisk utfall side om side. Gapet mellom de to avslører systematisk over- eller underestimering.

**Velo-brain bruk:**
- Deals: lagre forventet sannsynlighet vs. faktisk utfall (vunnet/tapt)
- Estimater: lagre timeanslag vs. faktisk tidsbruk
- Pipeline: forventet inntekt vs. realisert

**Hvorfor:** Uten kalibrering vet du ikke om dine vurderinger er systematisk skjeve. Over tid bygger dette en feedback-loop som forbedrer fremtidige estimater.

---

## 7. Rolling Task Queue (Anti-Stopping)

**Brukes i:** willy (convention:rolling-task-queue)

En oppgavekø som aldri er tom. Tre plasser: current, next, decide-next. Når current fullføres, promoteres next. "Decide next" fyller alltid tredjeplassen.

**Hvorfor:** Etter fullført arbeid trigger tom kø en stoppimpuls. Men å bestemme neste oppgave ER en oppgave. Ved å gjøre dette eksplisitt, holder agenten momentum uten å stoppe opp.

**Når du bruker det:** Autonome agenter som skal jobbe over lengre perioder uten bruker-input.

---

## 8. Namespace Prefixing

**Brukes i:** willy (r7 node-prefixer), velo-brain (directory-baserte slugs)

Alt navngis med type-prefix: `cortex:social`, `convention:back-linking`, `projects/baneservice`.

**Willy-varianter:**
- `cortex:*` — identitet (alltid aktiv)
- `convention:*` — atferdsregler
- `correction:*` — feilrettinger
- `hypothesis:*` — ting å teste
- `learning:*` — verifiserte innsikter
- `round:*` — historiske resultater

**Velo-brain-varianter:**
- `persons/*`, `clients/*`, `projects/*` — entiteter
- `conventions/*`, `corrections/*` — cortex
- `learnings/*` — innsikter

**Hvorfor:** Gjør søk presist (`search "type:convention"`), unngår navnekollisjon, og gjør grafen navigerbar uten å lese innhold.

---

## 9. Iron Law: Back-Link Everything

**Brukes i:** velo-brain

Hver gang en entitet nevnes i en brain-page, SKAL det opprettes en eksplisitt link. En ulinket nevnelse er en ødelagt brain.

**Hvorfor:** Uten back-links er brain en samling isolerte dokumenter. Hele verdien av et kunnskapssystem er at relasjonene mellom entiteter er eksplisitte, traverserbare, og søkbare.

---

## 10. Citation on Every Fact

**Brukes i:** velo-brain

Alle fakta har inline `[Source: ...]` med format, kilde, og dato.

**Hvorfor:** Uten kilde vet vi ikke om en fakta er verifisert, utdatert, eller hallusinert. Kildehenvisning gjør det mulig å gå tilbake til primærkilden ved tvil — og gjør assumption-check mulig.

---

## 11. Hypothesis Versioning

**Brukes i:** willy (hypothesis-noder med CORRECTS-kanter)

Hver ny tilnærming lagres som en navngitt hypotese. Hvis den feiler, peker neste hypotese tilbake med `CORRECTS → hypothesis:forrige`. Dette skaper en lineage av forsøkte tilnærminger.

**Hvorfor:** Forhindrer at agenten prøver samme mislykkede tilnærming igjen. Gjør det mulig å se hele utviklingen av en strategi over tid.

**Velo-brain bruk:** Kan brukes for salgstilnærminger, tekniske arkitektur-valg, eller leveransemetoder som itereres over tid.

---

## 12. Sandbox / Safe Experimentation

**Brukes i:** willy (r7_sandbox_start/rollback)

Før du gjør potensielt destruktive endringer i kunnskapsgrafen, start en sandbox. Hvis resultatet er dårlig, rollback. Hvis det er bra, commit.

**Hvorfor:** Kunnskap er vanskelig å reparere etter korrupsjon. Sandbox-mønsteret gir trygghet til å eksperimentere uten risiko.

---

## 13. Multi-Source Ingestion with Dedup

**Brukes i:** velo-brain

Hver page synket fra ekstern kilde bærer source IDs (`notion_id`, `slack_thread_ts`, `outlook_event_id`, `github_repo`, `velodb_id`). Ingestion sjekker disse FØR skriving for å unngå duplikater.

**Hvorfor:** Samme informasjon finnes i flere kilder (et møte nevnes i Notion, Outlook, og Slack). Uten dedup-IDs ender vi med tre separate sider for samme hendelse.

---

## 14. Compaction Awareness

**Brukes i:** willy (r7_boot etter compaction), velo-brain (/boot etter compaction)

LLM-kontekstvinduer komprimeres. Etter compaction er instruksjoner og regler potensielt tapt. Løsningen: eksplisitt re-lasting av cortex fra persistent lagring etter compaction.

**Kritisk:** Compaction-sammendraget inneholder IKKE nødvendigvis alle konvensjoner og regler. Stol aldri på det som erstatning for live data.

---

## 15. Multi-Hop Retrieval

**Brukes i:** velo-brain (/recall)

Single-hop search (query → pages) mister kontekst. Multi-hop følger graph-links 1-2 hopp ut fra treffene: prosjekt → klient + ansvarlig + siste møter + deals.

**Workflow:** Søk → finn ankerpunkter → `traverse_graph` depth=2 → filtrer relevante noder → dyp lesing → kompiler samlet svar.

**Hvorfor:** Når noen spør "hva er status på X?" trenger de ikke bare X-pagen, men hele konteksten rundt X. Multi-hop gir dette automatisk.

Inspirert av HopRAG (retrieve-reason-prune) og Graphiti's temporal graph traversal.

---

## 16. Hot Cache / Session Primer

**Brukes i:** velo-brain (meta/hot-cache), Letta (core memory), Karpathy's LLM Wiki

En daglig auto-generert komprimert snapshot (~500 ord) av operasjonell tilstand: aktive prosjekter, åpne deals, ukens møter, team-fokus, alerts. Lastes av `/boot` ved session-start.

**Hvorfor:** Uten hot cache må agenten gjøre 5-10 brain-queries for å bygge situasjonsbevissthet. Hot cache gir dette umiddelbart — som å lese dagens avis før du starter arbeidsdagen.

**Tre-lags memory-modell (Letta-inspirert):**
- **Core** (hot cache) — Alltid i kontekst, ~500 ord, daglig oppdatert
- **Archival** (brain pages) — Full kunnskap, søkbar via query/search
- **Recall** (conversation history) — Hva som ble diskutert denne sesjonen

---

## Bruksveiledning

Når du bygger et nytt agent-system eller forbedrer et eksisterende:

1. **Start med Two-Layer** — Separér gjeldende sannhet fra historisk bevis
2. **Legg til Cortex** — Boot-loaded regler som styrer atferd
3. **Bygg inn Structural Corrections** — Systemet lærer av feil permanent
4. **Koble med Context Activation** — Relevant kontekst lastes automatisk
5. **Mål med Confidence Scoring** — Gjør data-kvalitet eksplisitt
6. **Kalibrer med Prediction Tracking** — Forbedre estimater over tid
7. **Navngi alt med prefixer** — Gjør navigering og søk presist
8. **Link alt** — Isolerte noder er verdiløse
9. **Siter alt** — Fakta uten kilde er upålitelig
