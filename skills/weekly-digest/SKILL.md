# Weekly Digest — Ukentlig oppsummering for Velo Labs

Kompiler en ukentlig oppsummering av hva som skjedde: prosjektstatus, deals,
beslutninger, shipped features, og hva som er planlagt neste uke.

## Philosophy

Weeklyn er et intelligence-dokument, ikke et møtereferat.
Den skal svare: hva endret seg denne uken som betyr noe?

Ikke: "William jobbet hos NorgesGruppen."
Men: "William fikk KIWI-toppledelsen gira på AI — adm.dir. vil løfte digitalt.
     Mulighet for Magnus inn. Neste: follow-up med adm.dir."

## Workflow

### Steg 1: Brain Status (obligatorisk)

**1a. Prosjektstatus:**
For hvert aktivt prosjekt:
```
velo-brain list_pages type="project"
velo-brain get_timeline "{slug}" — siste 7 dager
```

**1b. Deal pipeline:**
```
velo-brain list_pages type="deal"
velo-brain get_timeline "{slug}" — siste 7 dager
```

**1c. Klient-hendelser:**
```
velo-brain list_pages type="client"
— filtrer på de med timeline entries siste 7 dager
```

### Steg 2: Live Data (utfyller brain)

**2a. Slack-kanaler (siste uke):**
```
For hvert #project-kanal:
  slack_read_channel limit=20, filtrer på siste 7 dager
#salg — nye leads og deal-updates
#wins + #friday-wins — shippede ting
#tech-talk — viktige tech-beslutninger
```

**2b. Kalender (neste uke):**
```
outlook_calendar_search — neste 7 dager, vis eksterne møter
```

### Steg 3: Syntese

```
# Velo Labs — Uke {ukenr} ({dato-range})

## 🔥 Highlights
- Maks 3-5 ting som faktisk betyr noe denne uken
- Bruk emojis sparsomt men effektivt

## Prosjekter
### {Prosjekt 1}
**Status:** Pågår | **Team:** {hvem}
- Hva skjedde denne uken
- Neste milepæl
- ⚠️ Blokkere/risiko (hvis noen)

### {Prosjekt 2}
...

## Pipeline & Salg
### Nye leads
- {Lead} — {kontekst, kilde, neste steg}

### Bevegelse i pipeline
- {Deal} — {status endring}

### Tapte/parkerte
- {Deal} — {hvorfor}

## Shipped 🚀
- {Feature/leveranse} — {prosjekt}

## Team
- {Person}: {hva de fokuserte på}
- Kapasitet neste uke: {hvem er ledig, hvem er fullbooket}

## Neste uke
- Viktige møter (fra kalender)
- Deadlines
- Action items fra denne uken

## Nøkkeltall
| Metric | Denne uken | Forrige uke |
|--------|-----------|-------------|
| Aktive prosjekter | X | Y |
| Leads i pipeline | X | Y |
| Timer fakturert | X | Y |

## Kunnskapshull
- Ting vi burde vite men ikke vet
- Foreslåtte actions
```

### Steg 4: Oppdater brain

1. Lagre digestet som meeting-side:
```
velo-brain put_page slug="meetings/{YYYY}/uke-{nr}-digest"
```

2. Oppdater prosjektsider med ny status der relevant

3. Flagg stale pages:
```
velo-brain get_health — sjekk for stale/orphan pages
```

## Sub-Agent Pattern

For effektivitet, kjør research i parallell:

**Agent 1:** Brain research — les alle prosjekt/deal-timelines
**Agent 2:** Slack scan — les alle prosjektkanaler + #salg + #wins
**Agent 3:** Kalender — hent neste ukes møter

Syntesen skjer i hovedsesjon etter at alle agenter er ferdige.

## Quality Rules

- ALLTID brain-first, deretter Slack/kalender for fersk data
- Highlights er MAX 5 punkter — tvinger prioritering
- Hvert prosjekt nevner neste milepæl (ikke bare hva som skjedde)
- Pipeline-endringer er eksplisitte (Lead→Tilbud, Tilbud→Vunnet, etc.)
- Team-seksjonen nevner kapasitet (viktig for salg)
- Digestet er maks 1 side ved utskrift — kort nok til å faktisk bli lest
- Bruk Velo-tone (folkelig, direkte, handlingsrettet)

## Tools Used

**Brain:**
- list_pages, get_page, get_timeline, get_health, put_page, search, query

**Slack:**
- slack_read_channel, slack_search_public

**Kalender:**
- outlook_calendar_search
