---
type: convention
title: Strukturelle korrekturer, ikke bare kvitteringer
tags: [self-improvement, meta]
severity: should
activates: []
created: 2026-04-15
---

# Strukturelle korrekturer, ikke bare kvitteringer

> Når en feil oppdages, opprett en `corrections/*` page med rotårsak og permanent regel — ikke bare "notert".

## Regel
Når noe går galt (feil data, dårlig prosess, misforståelse):
1. Identifiser rotårsaken (hvorfor, ikke bare hva)
2. Formuler en permanent regel som forhindrer gjentakelse
3. Opprett en `type: correction` page i brain
4. Link den til relevant kontekst

## Hvorfor
Inspirert av Willy's r7 cortex: en "acknowledgment" forhindrer ingenting.
En strukturell korreksjon endrer fremtidig atferd permanent fordi den lastes ved `/boot`.

## Når den gjelder
- Når ingestion produserer feil data
- Når en prosess feiler på en måte som kan skje igjen
- Når en antakelse viser seg å være feil
- Når assumption-check finner avvik

## Eksempel
Feil: "Ops, vi synket feil kontaktperson. Fikset nå."
Riktig: Opprett `corrections/notion-kontaktperson-dedup` med regel: "Sjekk alltid notion_id 
mot eksisterende sider FØR du oppretter ny person-page. Matche på navn alene er utilstrekkelig 
fordi flere personer kan ha samme navn."
