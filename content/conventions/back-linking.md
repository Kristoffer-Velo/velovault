---
type: convention
title: Back-linking er obligatorisk
tags: [ingestion, data-quality]
severity: must
activates: []
created: 2026-04-15
---

# Back-linking er obligatorisk

> Hver gang en person, klient, eller prosjekt nevnes i en brain-page, SKAL det opprettes en back-link.

## Regel
Når du skriver eller oppdaterer en brain-page og nevner en entitet som har sin egen page,
bruk `add_link` for å opprette en relasjon. En ulinket nevnelse er en ødelagt brain.

## Hvorfor
Uten back-links blir brain en samling isolerte dokumenter. Hele verdien av et kunnskapssystem
er at relasjonene mellom entiteter er eksplisitte og traverserbare.

## Når den gjelder
- Ved all ingestion (Notion, Slack, Calendar, GitHub)
- Ved manuell oppdatering av sider
- Ved `/learn` capture

## Eksempel
Riktig: Skriver om prosjekt Baneservice → `add_link(from: "projects/baneservice", to: "clients/baneservice")`
Feil: Skriver "Baneservice-prosjektet" i fritekst uten å opprette link.
