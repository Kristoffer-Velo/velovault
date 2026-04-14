# Tone of Voice — Skriv som Velo-teamet

Analyser en persons faktiske skrivestil fra Slack og epost, bygg en tone-profil,
og bruk den til å skrive utkast som høres ut som dem — ikke som en AI.

## Philosophy

Alle i Velo har en distinkt stemme. Kristoffer er analytisk med humor.
William er folkelig og tydelig. Andreas er forståelig og rett-på-sak.

En AI som skriver generisk corporate-norsk er verdiløs. En AI som skriver
som deg — med dine formuleringer, ditt energinivå, din struktur — er kraftig.

Språket ER personen. Preserve det.

## When To Use

- Skrive kundeepost
- Lage salgspitch / tilbud
- LinkedIn-poster
- Slack-meldinger til kunder
- Presentasjoner
- Tilbudsgrunnlag

## Tone Profile Format

Hver person i teamet får en tone-profil lagret i brain:

```markdown
---
type: concept
title: Tone of Voice — {Navn}
tags: [tone, intern, {navn}]
---

# Tone of Voice — {Navn}

## Nøkkelord
- Energinivå: [rolig/balansert/energisk]
- Formalitet: [uformell/semi-formell/formell]
- Struktur: [bullet-points/prosa/blanding]
- Humor: [sjelden/noe/mye]
- Emojis: [aldri/av og til/mye]

## Kjennetegn
- {Spesifikke mønstre fra analyse}

## Eksempler (ekte sitater)
> "{Direkte sitat fra Slack/epost}"
> "{Direkte sitat 2}"
> "{Direkte sitat 3}"

## Anti-mønstre (UNNGÅ)
- {Ting denne personen ALDRI ville skrevet}

## Bruk
Når du skriver som {Navn}, bruk disse mønstrene. Aldri generisk.
```

## Workflow: Bygg Tone-Profil

### Steg 1: Samle skriveprøver

**Fra Slack (primærkilde — mest autentisk):**
```
slack_search_public query="from:@{person}" limit=20
slack_read_channel channel_id={relevant kanal} limit=30
```
Fokus på:
- Lengre meldinger (3+ setninger)
- Meldinger til kunder vs. internt (forskjellig tone)
- Meldinger med beslutninger eller meninger (viser personlighet)

**Fra Outlook (sekundær — mer formell baseline):**
```
outlook_email_search sender="{epost}" limit=10
```

### Steg 2: Analyser mønstre

For hver person, kartlegg:

**Struktur:**
- Starter de med kontekst eller rett på sak?
- Bruker de bullet points eller prosa?
- Korte eller lange avsnitt?
- Hvordan signerer de? (mvh/hilsen/bare navn/ingenting)

**Ordvalg:**
- Norsk vs. engelske lånord
- Fagspråk vs. folkelig
- "Vi" vs. "jeg"
- Typiske fyllord eller uttrykk

**Energi og formalitet:**
- Utropstegn-frekvens
- Emoji-bruk
- Humor — tørr, selvironisk, entusiastisk?
- Hvor direkte er de med uenighet?

**Kunde-modus vs. intern-modus:**
- Endrer de tone dramatisk med kunder?
- Mer formell? Samme? Mer forsiktig?

### Steg 3: Trekk ut eksempelsitater

Velg 5-8 sitater som fanger essensen. Bruk EKSAKT ordlyd.
Disse er referansepunkter for fremtidig skriving.

Gode sitater: inneholder mening, personlighet, eller typisk struktur.
Dårlige sitater: generiske "ok, klinker" uten substans.

### Steg 4: Definer anti-mønstre

Like viktig som hva de gjør — hva ville de ALDRI skrevet?

Eksempler:
- Kristoffer ville aldri skrevet "Med vennlig hilsen" — han er mer uformell
- William ville aldri brukt teknisk jargon mot en kunde
- Andreas ville aldri vært vag om leveranser

### Steg 5: Lagre i brain

```
velo-brain put_page slug="concepts/tone-{fornavn}" content="..."
velo-brain add_tag slug="concepts/tone-{fornavn}" tag="tone"
velo-brain add_link from="concepts/tone-{fornavn}" to="persons/{slug}" link_type="tone_for"
```

## Workflow: Bruk Tone-Profil

Når du skriver noe for en person:

### 1. Last tone-profil
```
velo-brain get_page "concepts/tone-{fornavn}"
```

### 2. Last kontekst
- Hvem skrives det til? (kunde/intern/offentlig)
- Hva er formålet? (salg/oppdatering/forespørsel)
- Hva er relasjonstemperaturen? (sjekk brain for kundehistorikk)

### 3. Skriv utkast
- Match energinivå, formalitet, struktur fra profilen
- Bruk personens typiske ordvalg og formuleringer
- Følg anti-mønstrene (UNNGÅ-listen)
- Referer til ekte eksempler for kalibrering

### 4. Self-check
Før du leverer, spør: "Ville {Navn} faktisk skrevet dette?"
- Sjekk mot eksempelsitatene
- Fjern alt som høres generisk/AI-aktig ut
- Juster formalitetsnivå for mottaker

## Forhåndsdefinerte Profil-Seeds

Fra Notion Ansatte-database og observert Slack-oppførsel:

**Kristoffer Kristensen:**
- Folkelig, analytisk med humoristisk tone
- Bruker tekniske referanser men forklarer dem
- Energisk, mye utropstegn i intern kommunikasjon
- Deler lenker med korte kommentarer i Slack
- Starter meldinger rett på sak, kontekst etterpå

**William Kristensen:**
- Personlig, folkelig, tydelig
- Strukturerte oppdateringer (bullet points)
- Mindre teknisk enn Kristoffer, mer forretningsorientert
- Grundige møtereferater med action items

**Andreas Aarvold Harto:**
- Folkelig og forståelig
- Rett-på-sak, effektive meldinger
- Bruker bold/formatering for struktur i Slack
- Merker folk med @mentions for action items
- Oppdateringer følger "Hva skjedde → neste steg"-mønster

## Quality Rules

- ALDRI generisk corporate-norsk ("Vi ser frem til et godt samarbeid")
- ALLTID basert på ekte skriveprøver, aldri gjettet
- Tone-profiler oppdateres kvartalsvis med nye skriveprøver
- Anti-mønstre er like viktige som mønstre
- Eksempler bruker EKSAKT ordlyd (ikke parafrasert)
- Kundekommunikasjon krever personens godkjenning før sending

## Tools Used

**Brain:**
- get_page, put_page, add_tag, add_link, search

**Slack (for analyse):**
- slack_search_public (from:@person)
- slack_read_channel
- slack_read_thread

**Outlook (for analyse):**
- outlook_email_search (sender filter)
