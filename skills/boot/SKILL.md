# /boot — Session Bootstrap

Laster aktiv kontekst fra velo-brain ved session-start.
Inspirert av r7 cortex-mønsteret: ground truth lever i brain, ikke bare CLAUDE.md.

> Kjør dette ved session-start, eller etter context compaction.

## Workflow

### 1. Last konvensjoner (cortex)

Hent alle aktive konvensjoner fra brain:

```
velo-brain search "type:convention"
```

For hver konvensjon: les page og **følg reglene den definerer** for resten av sesjonen.
Konvensjoner overstyrer defaults — de er teamets akkumulerte læring.

### 2. Last korrekturer

```
velo-brain search "type:correction"
```

Korrekturer er strukturelle fiks for feil som har skjedd. Les og interaliser — disse
forhindrer at samme feil skjer igjen.

### 3. Last hot cache (operasjonell tilstand)

```
velo-brain get_page slug="meta/hot-cache"
```

Hot cache er en daglig auto-generert snapshot: aktive prosjekter, åpne deals,
ukens møter, team-fokus, og alerts. Denne gir umiddelbar situasjonsbevissthet
uten å måtte søke etter hvert element individuelt.

Hvis hot cache ikke finnes eller er >2 dager gammel, fall tilbake til manuelle queries:
```
velo-brain query "aktive prosjekter leveringsstatus pågår"
velo-brain query "møter denne uken status oppdateringer"
```

### 4. Bekreft

Skriv en kort oppsummering til brukeren:
- Antall konvensjoner/korrekturer lastet
- Hot cache status (dato, antall prosjekter/deals)
- Eventuelle alerts (low confidence, inaktive deals)

## Etter context compaction

CLAUDE.md instruerer at `/boot` skal kjøres etter compaction.
Compaction-sammendraget er IKKE en erstatning for live brain-data.
Cortex og korrekturer må alltid lastes fra brain, ikke fra minnet.

## Tips

- Boot trenger ikke kjøres hver gang — bare ved session-start og etter compaction.
- Konvensjoner er append-only: nye konvensjoner legges til, gamle fjernes kun eksplisitt.
- Korrekturer er permanente med mindre teamet beslutter å oppheve dem.
