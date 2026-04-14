/**
 * Full velo-brain ingestion — all Notion + Slack data.
 * Run: VELO_BRAIN_DATABASE_URL=... bun run scripts/ingest-full.ts
 */
import { sql, putPage, addTag, addLink, addTimelineEntry, logIngest } from './db.ts';

const TODAY = new Date().toISOString().split('T')[0];
const stats = { created: 0, updated: 0, tags: 0, links: 0, timeline: 0 };

async function upsert(slug: string, type: string, title: string, compiled_truth: string, frontmatter: Record<string, any>, tags: string[]) {
  const r = await putPage({ slug, type, title, compiled_truth, frontmatter: { ...frontmatter, type, last_enriched: TODAY } });
  if (r.action === 'created') stats.created++; else stats.updated++;
  for (const t of tags) { await addTag(slug, t); stats.tags++; }
  return r;
}

async function link(from: string, to: string, type: string, ctx = '') {
  await addLink(from, to, type, ctx); stats.links++;
}

async function tl(slug: string, date: string, summary: string, source: string) {
  await addTimelineEntry(slug, date, summary, source); stats.timeline++;
}

// ============================================================
// TEAM (6 people)
// ============================================================
async function ingestTeam() {
  console.log('\n=== TEAM ===');
  const team = [
    { slug: 'persons/kristoffer-kristensen', title: 'Kristoffer Kristensen', stilling: 'Co-founder', email: 'kristoffer@velolabs.no', phone: '95742866', notion_id: '1ec98afc-abf5-8021-8881-c8d4082f0420', tags: ['team', 'founder'], ct: `# Kristoffer Kristensen\n\n> Co-founder, Velo Labs. Teknisk leder. Kreativ, god på å bruke KI smart.\n\n## State\n- Stilling: Co-founder\n- Epost: kristoffer@velolabs.no\n- Telefon: 95742866\n- Adresse: Søndre vei 117, 1397 Nesøya\n- Tone: Folkelig, analytisk med humoristisk tone\n\n## Focus\n- Arkitektur og tech-strategi\n- AI-produkter (zbrain, velo-brain, Velox)\n- Kundekontakt (NKI, Baneservice, Z Event)\n\n[Source: Notion Ansatte, ${TODAY}]` },
    { slug: 'persons/william-kristensen', title: 'William Kristensen', stilling: 'Co-founder', email: 'william@velolabs.no', phone: '98899588', notion_id: '1ec98afc-abf5-8086-8f07-cc826563e594', tags: ['team', 'founder'], ct: `# William Kristensen\n\n> Co-founder, Velo Labs. Smart, nytenkende og bunnsolid.\n\n## State\n- Stilling: Co-founder\n- Epost: william@velolabs.no\n- Telefon: 98899588\n- Adresse: Frederik Stangs Gate 35, 0264 Oslo\n- Tone: Personlig, folkelig, tydelig\n\n## Focus\n- NorgesGruppen/Trumf (direkteavtale fra 2026)\n- Salg og kundeansvar (Neo, NKI, Prochect)\n\n[Source: Notion Ansatte, ${TODAY}]` },
    { slug: 'persons/andreas-harto', title: 'Andreas Aarvold Harto', stilling: 'Co-founder', email: 'andreas@velolabs.no', phone: '97962163', notion_id: '1ec98afc-abf5-8006-82a2-ff657c58f3ad', tags: ['team', 'founder'], ct: `# Andreas Aarvold Harto\n\n> Co-founder, Velo Labs. Allsidig doer, faglig sterk og stødig.\n\n## State\n- Stilling: Co-founder\n- Epost: andreas@velolabs.no\n- Telefon: 97962163\n- Adresse: Carl Jeppesens gate 24, 0481 Oslo\n- Tone: Folkelig og forståelig\n\n## Focus\n- OBOS Mitt Bygg (innleid, timepris NOK 1 750/t)\n- Baneservice (prosjektleder)\n- Salg og brokers (Witted, Tobias Flood)\n\n[Source: Notion Ansatte, ${TODAY}]` },
    { slug: 'persons/eirik-kjernli', title: 'Eirik Fagtun Kjærnli', stilling: 'Co-founder', email: 'eirik@velolabs.no', phone: '93041914', notion_id: '28398afc-abf5-80ba-943d-cf58961cfd5d', tags: ['team', 'founder'], ct: `# Eirik Fagtun Kjærnli\n\n> Co-founder, Velo Labs.\n\n## State\n- Stilling: Co-founder\n- Epost: eirik@velolabs.no\n- Telefon: 93041914\n- Adresse: Frichs gate 2A, 0360 Oslo\n\n## Focus\n- Baneservice: feedback/MLFlow, devcontainer\n- Cisco-prosjekt (fra jan 2026, ~1575 kr/t)\n- Avinor-lead (erfaringsdeling)\n\n[Source: Notion Ansatte, ${TODAY}]` },
    { slug: 'persons/magnus-aarvold', title: 'Magnus Aarvold', stilling: 'AI-utvikler', email: 'magnus@velolabs.no', phone: '90716660', notion_id: '28898afc-abf5-8057-905a-c146754930fd', tags: ['team', 'utvikler'], ct: `# Magnus Aarvold\n\n> AI-utvikler, Velo Labs.\n\n## State\n- Stilling: AI-utvikler\n- Epost: magnus@velolabs.no\n- Telefon: 90716660\n- Adresse: Marcus Thranes gate 4D, 0473 Oslo\n\n## Focus\n- Baneservice: endringslogg, feedback dialog, Next-oppgradering\n- Kombit (extended til 31. mai 2026, 1050 DKK / 1650 kr/t)\n- Velo Portalen: PDF parser-feature\n\n[Source: Notion Ansatte, ${TODAY}]` },
    { slug: 'persons/simen-waitz', title: 'Simen Myhre Waitz', stilling: 'AI-utvikler', email: 'simen@velolabs.no', phone: '+47 472 64 030', notion_id: '28898afc-abf5-8085-b6ab-fc9c31bc7e1a', tags: ['team', 'utvikler'], ct: `# Simen Myhre Waitz\n\n> AI-utvikler, Velo Labs.\n\n## State\n- Stilling: AI-utvikler\n- Epost: simen@velolabs.no\n- Telefon: +47 472 64 030\n- Adresse: Colletts gate 39D, 0456 Oslo\n\n## Focus\n- Aidn: Ambient Listening, STT i prod (PydanticAI, 11labs Scribe2)\n- Baneservice: speech-to-text (Whisper)\n- Velox startup-kit\n\n[Source: Notion Ansatte, ${TODAY}]` },
  ];
  for (const p of team) { await upsert(p.slug, 'person', p.title, p.ct, { notion_id: p.notion_id, email: p.email, phone: p.phone, stilling: p.stilling }, p.tags); console.log(`  ✓ ${p.slug}`); }
}

// ============================================================
// CLIENTS (27)
// ============================================================
async function ingestClients() {
  console.log('\n=== CLIENTS ===');
  const clients: Array<{slug:string;title:string;notion_id:string;tags:string[];ct:string;kontaktperson?:string;eier?:string}> = [
    { slug: 'clients/baneservice', title: 'Baneservice', notion_id: '2a798afcabf5803393dbcf526cf8cf40', tags: ['infrastruktur', 'aktiv'], eier: 'persons/andreas-harto', kontaktperson: 'Alexander Guy Grønli-Raastad', ct: `# Baneservice\n\n> Infrastrukturselskap. Innovasjonsavdelingen tester AI-løsninger. Ca 600 ansatte.\n\n## Projects\n- RAG på tekniske dokumenter (pågår, 262t, 1600 kr/t)\n- Chatbot (første fase fullført)\n- Claude Cowork demo (lead)\n- Kapasitetsavtale 2026 (ikke aktuell)\n- Private ChatGPT for Poweron (lead)\n\n## Key Contacts\n- Alexander Guy Grønli-Raastad — Prosjektleder, Alexander.GuyGronli-Raastad@baneservice.no\n\n[Source: Notion, ${TODAY}]` },
    { slug: 'clients/aidn', title: 'Aidn', notion_id: '2c198afcabf580cd9b4ac03b5f285310', tags: ['helse', 'aktiv'], eier: 'persons/andreas-harto', kontaktperson: 'Kent-Remi Gabrielsen', ct: `# Aidn\n\n> Helsetech. AI-løsninger for effektive helsearbeidere. EHF: 927 384 302.\n\n## Projects\n- Simen innleid (valgt etter intervju)\n- STT i produksjon\n- Ambient Listening under utvikling (PydanticAI, 11labs Scribe2)\n\n## Key Contacts\n- Kent-Remi Gabrielsen — Director of Engineering, kent-remi.gabrielsen@aidn.no, 90097671\n\n[Source: Notion + Slack, ${TODAY}]` },
    { slug: 'clients/norgesgruppen', title: 'NorgesGruppen', notion_id: '2a298afcabf5803ea8faea2e98fe84f6', tags: ['dagligvare', 'enterprise', 'aktiv'], eier: 'persons/william-kristensen', kontaktperson: 'Kristin Bigseth', ct: `# NorgesGruppen\n\n> Norges største dagligvarekonsern. William på direkteavtale med Trumf fra 2026.\n\n## Projects\n- William innleid hos Trumf (direkteavtale, ikke via Forte Hub)\n- Velox/Willy-demo planlegges\n- Mulig anbud med Bouvet (lead)\n- KIWI-presentasjon for toppledelse — adm.dir. gira på digital satsning\n\n## Key Contacts\n- Kristin Bigseth — Daglig leder Trumf, kristin.bigseth@trumf.no, +47 913 35 992\n\n## Notes\n- Forte Hub: 24 mnd ikke-kontaktklausul etter avslutning\n- William på heldagsopplegg hos Microsoft med NG-folk\n\n[Source: Notion + Slack, ${TODAY}]` },
    { slug: 'clients/obos', title: 'OBOS', notion_id: '2a798afcabf580009bcecda686eea14ee', tags: ['bolig', 'enterprise', 'aktiv'], eier: 'persons/andreas-harto', kontaktperson: 'Jarle Naustvik', ct: `# OBOS\n\n> Boligbyggelag. Andreas innleid som AI-utvikler på OBOS Mitt Bygg.\n\n## Projects\n- AI Utvikler OBOS Mitt Bygg (vunnet, pågår, 1750 kr/t, 1750 timer, ut 2026)\n\n## Key Contacts\n- Jarle Naustvik — Leder OBOS Mitt Bygg, jarle.naustvik@OBOS.no\n\n[Source: Notion, ${TODAY}]` },
    { slug: 'clients/nki', title: 'NKI', notion_id: '2f498afcabf580ecbfddf5e94e3d5da4', tags: ['utdanning', 'fullfort'], eier: 'persons/william-kristensen', kontaktperson: 'Jon Erik Andersen', ct: `# NKI\n\n> Utdanning. Prosjekt fullført, 100% fornøyd. Mulig Oslo kommune-pilot.\n\n## Projects\n- Kristoffer leverte prosjektet (80% allokering, 1600 kr/t)\n- Agent builder POC (OpenAI)\n- Potensiell videreføring: Oslo kommune AI-agent-pilot til august\n\n## Key Contacts\n- Jon Erik Andersen — CDO, jonerik@nki.no, 99492105 (tidl. Forte Digital)\n- Mykyta — Teknisk PO\n\n[Source: Notion + Slack, ${TODAY}]` },
    { slug: 'clients/neo', title: 'Neo', notion_id: '2c598afcabf580076b6f3c7e54db78a0c', tags: ['fintech', 'bank'], eier: 'persons/william-kristensen', kontaktperson: 'Amina Resch', ct: `# Neo\n\n> Ny bank for store investorer. Konfidensielt. Fastpris 40k levert.\n\n## Projects\n- Forprosjekt: AI-first arkitektur, AI-personalisering, kundeservice chatbot\n- Leveransen levert jan 2026, venter investorbeslutning\n- 10-12 IT-folk bygger bank fra 0 til pilot på 11 mnd — Velo som partner\n\n## Key Contacts\n- Merete — CEO/leder\n- Amina Resch — barndomsvenn William\n\n[Source: Notion + Slack, ${TODAY}]` },
    { slug: 'clients/prochect', title: 'Prochect', notion_id: '2c498afcabf5802983c1ffe3d9567110', tags: ['edtech', 'startup'], kontaktperson: 'Kjartan Høvik', ct: `# Prochect\n\n> EdTech startup. Fase 1 POC levert (100k). Vil ha Velo inn på eiersiden.\n\n## Key Contacts\n- Kjartan Høvik — Cofounder, kjartan@innigranskogen.no\n\n## Notes\n- Feedback: fornøyde, vil ha partnerskap, ønsker bedre prosjektledelse\n- Utvikling starter sommer 2026, planlegger investeringsrunde\n\n[Source: Notion + Slack, ${TODAY}]` },
    { slug: 'clients/z-event', title: 'Z Event', notion_id: '31b98afcabf580f48ab7c37ea6be8a7e', tags: ['event', 'aktiv'], kontaktperson: 'Thomas Strandskogen', ct: `# Z Event\n\n> Eventselskap. Deler kontor med Velo på Nesøya. AI-adopsjonssamarbeid.\n\n## Projects\n- zbrain: AI knowledge system (ferdig)\n- AI-adopsjonsprogram: workshops, hackaton, MCP-server\n- Thomas driver AI på alle mandagsmøter, betaler Velo timer løpende\n\n## Key Contacts\n- Thomas Strandskogen — AI-champion, supergira\n- Matias Ausland\n\n[Source: Notion + Slack, ${TODAY}]` },
    { slug: 'clients/norsk-byggtjeneste', title: 'Norsk Byggtjeneste', notion_id: '2e598afcabf580848190ff8e20bf8919', tags: ['bygg', 'fullfort'], kontaktperson: 'Mikkel Nielsen', ct: `# Norsk Byggtjeneste\n\n> Analyse av AI-effektpotensial. Fastpris 150k, fullført.\n\n## Projects\n- Analyse av effekt: nåsituasjon, kvantifisert effektestimat (~40-70% mer effektive), anbefalinger\n\n## Key Contacts\n- Mikkel Nielsen — CEO, mikkel.nielsen@byggtjeneste.no (tidl. Accenture)\n\n## Feedback\n\"åpenbart at det er riktigste valget... vil utvilsomt namedroppe Velo Labs\"\n\n[Source: Notion + Slack, ${TODAY}]` },
    { slug: 'clients/avinor', title: 'Avinor', notion_id: '31f98afcabf580076b928c0ddccf69417', tags: ['transport', 'lead'], ct: `# Avinor\n\n> Erfaringsdeling mellom byggprosjekter. AI-søk i PIMS (Omega365).\n\n## Lead\n- Konkurransevindu 12-18 mnd\n- Neste steg: dialog med Omega365, pilot med Avinor\n- Frist: Omega365-konferanse juni 2026\n\n[Source: Notion, ${TODAY}]` },
    { slug: 'clients/cisco', title: 'Cisco', notion_id: '29898afcabf58032b0b6f5c20844ad5d', tags: ['tech', 'aktiv'], eier: 'persons/andreas-harto', kontaktperson: 'Kjell Martin Rud', ct: `# Cisco\n\n> Eirik innleid fra jan 2026, ~1575 kr/t, min 3 mnd.\n\n## Key Contacts\n- Kjell Martin Rud — Lead MCP utviklingsteam, kjrud@cisco.com\n\n[Source: Notion + Slack, ${TODAY}]` },
    { slug: 'clients/af-gruppen', title: 'AF-gruppen', notion_id: '29898afcabf580b4943fd8f5f3907bd0', tags: ['bygg', 'enterprise'], eier: 'persons/andreas-harto', ct: `# AF-gruppen\n\n> Bygg/enterprise. Kontakter via Andreas.\n\n## Key Contacts\n- Vegard Bjoland — Prosjektdirektør, vegard.bjoland@afgruppen.no\n- Birger Kristiansen — Direktør AF Byggfornyelse\n- Jørgen Skovly — Direktør AF IT/Digital\n\n[Source: Notion, ${TODAY}]` },
    { slug: 'clients/pieces-insights', title: 'Pieces Insights', notion_id: '32698afcabf5804aad24eae8ea6f13ec', tags: ['marketing', 'sweat-equity'], kontaktperson: 'Christian Nordby Bø', ct: `# Pieces Insights\n\n> Self-service marketing analytics med AI. Modell: sweat equity.\n\n## Key Contacts\n- Christian Nordby Bø — konsulent, christian@piecesinsights.com, 93068685\n- Org.nr: 933489590\n- Web: https://piecesinsights.carrd.co/\n\n## Notes\n- Kunder: Volvo, Avinor, Rema, SAS, Ford\n\n[Source: Notion, ${TODAY}]` },
    { slug: 'clients/preppa', title: 'Preppa / Orangeriet', notion_id: '2f498afcabf580f796b8dff204f7d5be', tags: ['startup', 'aktiv'], kontaktperson: 'Kenneth Klev', ct: `# Preppa / Orangeriet\n\n> AI startup. Samarbeid rundt eierandeler.\n\n## Key Contacts\n- Kenneth Klev — Cofounder, kenneth@preppa.ai\n\n## Notes\n- Svea x Orangeri x Velo: diskuterer 33-50% eierandel\n- Aksjonæravtale må defineres\n\n[Source: Notion, ${TODAY}]` },
    { slug: 'clients/coop', title: 'Coop', notion_id: '32598afcabf580bd9885ea34843e668e', tags: ['dagligvare', 'lead'], ct: `# Coop\n\n> Via Y-Story. App-utvikling + kampanjeoversikt.\n\n## Leads\n- Y-Story pitcher 450k for app (må klar til mai)\n- Verktøy for kampanjeoversikt (MVP klar, venter på Oscar)\n\n[Source: Notion + Slack, ${TODAY}]` },
    { slug: 'clients/dips', title: 'DIPS', notion_id: '29998afcabf5800d9c00cf06636e543f', tags: ['helse'], eier: 'persons/andreas-harto', kontaktperson: 'Hanne Gunby', ct: `# DIPS\n\n> Helse-IT. Kontakt via Andreas.\n\n## Key Contacts\n- Hanne Gunby — Utviklingsleder AI, hagu@dips.no, 908 81 117\n\n[Source: Notion, ${TODAY}]` },
    { slug: 'clients/witted', title: 'Witted', notion_id: '2ae98afcabf580bea9e4f3415e75d356', tags: ['broker'], eier: 'persons/andreas-harto', kontaktperson: 'Patrick Høiby', ct: `# Witted\n\n> Broker / rekruttering. Brukes for å sende konsulenter.\n\n## Key Contacts\n- Patrick Høiby — Business Dev Director, patrick.hoiby@witted.com, +47 948 38 560\n\n[Source: Notion, ${TODAY}]` },
    { slug: 'clients/betonmast', title: 'Betonmast', notion_id: '30a98afcabf5805aa7b0f410b67976bc', tags: ['bygg'], kontaktperson: 'Kristian Gjestemoen', ct: `# Betonmast\n\n## Key Contacts\n- Kristian Gjestemoen — Daglig leder Betonmast Buskerud-Vestfold, kristian.gjestemoen@betonmast.no\n\n[Source: Notion, ${TODAY}]` },
    { slug: 'clients/entur', title: 'Entur', notion_id: '32698afcabf580b5ab93d147b3de7c0f', tags: ['transport', 'tapt'], eier: 'persons/andreas-harto', ct: `# Entur\n\n> AI-utvikler via Witted. Magnus vurdert. Tapt — stor konkurranse (70% kvalitet / 30% pris).\n\n[Source: Notion, ${TODAY}]` },
    { slug: 'clients/icp', title: 'ICP', notion_id: '32e98afcabf5806d8518fdbe1defd4e8', tags: ['finans', 'lead'], eier: 'persons/andreas-harto', ct: `# ICP\n\n> Investeringsarm til Aker. Yngve Slyngstad (tidl. CEO NBIM).\n\n## Notes\n- Lead fra Karim\n- Mulighet for Claude Cowork / Willy\n- Web: https://www.icp-am.com/people\n\n[Source: Notion + Slack, ${TODAY}]` },
    { slug: 'clients/frontline', title: 'Frontline', notion_id: '29998afcabf58055878ddff40246d622', tags: ['shipping'], ct: `# Frontline\n\n> Shipping. Web: https://www.frontlineplc.cy/\n\n[Source: Notion, ${TODAY}]` },
    { slug: 'clients/cepi', title: 'CEPI', notion_id: '2c598afcabf5806c826ac7a2867e931c', tags: ['pharma'], kontaktperson: 'Frederik Kristensen', ct: `# CEPI\n\n> Coalition for Epidemic Preparedness Innovations.\n\n## Key Contacts\n- Frederik Kristensen — far til Kristoffer og William\n\n[Source: Notion, ${TODAY}]` },
    { slug: 'clients/farris-bad', title: 'Farris Bad', notion_id: '31f98afcabf580a19b2fffd28e0993de', tags: ['hotell', 'lead'], kontaktperson: 'Karoline Beate D. Skøien', ct: `# Farris Bad\n\n## Key Contacts\n- Karoline Beate D. Skøien — Marketing & Brand Manager, beate.skoien@farrisbad.no, +47 95 22 41 19\n\n[Source: Notion, ${TODAY}]` },
  ];
  for (const c of clients) { await upsert(c.slug, 'client', c.title, c.ct, { notion_id: c.notion_id, kontaktperson: c.kontaktperson }, c.tags); console.log(`  ✓ ${c.slug}`); }
}

// ============================================================
// PROJECTS (from Prosjekter database + Slack)
// ============================================================
async function ingestProjects() {
  console.log('\n=== PROJECTS ===');
  const projects: Array<{slug:string;title:string;notion_id:string;tags:string[];client:string;salgsfase:string;leveringsstatus:string;ct:string;pris?:number}> = [
    { slug: 'projects/obos-mitt-bygg', title: 'AI Utvikler OBOS Mitt Bygg', notion_id: '2a798afcabf580ffae11c3dad9605d84', client: 'clients/obos', salgsfase: 'Vunnet', leveringsstatus: 'Pågår', pris: 1750, tags: ['obos', 'konsulent'], ct: `# AI Utvikler OBOS Mitt Bygg\n\n> Andreas innleid som AI-utvikler. 1750 timer, 1750 kr/t, ut 2026.\n\n## Scope\nAI-utviklerrolle hos OBOS Mitt Bygg.\n\n## Team\n- **Ansvarlig:** Andreas\n\n## Key Dates\n- Start: 2025-12-08\n- Slutt: 2026-12-31\n\n[Source: Notion, ${TODAY}]` },
    { slug: 'projects/baneservice-rag', title: 'RAG på tekniske dokumenter (Baneservice)', notion_id: '2c598afcabf58007885ae290d7ac7b88', client: 'clients/baneservice', salgsfase: 'Vunnet', leveringsstatus: 'Pågår', pris: 1600, tags: ['baneservice', 'rag', 'ai'], ct: `# RAG på tekniske dokumenter\n\n> AI-søk mot Baneservices tekniske regelverk (TekReg/baneboten). 262 timer, 1600 kr/t (~480k).\n\n## Scope\n8 uker, RAG-løsning med tale-til-tekst. Eirik og Magnus involvert.\n\n## Team\n- **Ansvarlig:** Andreas\n- Eirik: feedback/MLFlow, devcontainer\n- Magnus: endringslogg, feedback dialog, Next-oppgradering\n- Simen: speech-to-text\n\n## Status\nKunder invitert inn for testing. Siste oppdatering: ønsker oppstart desember.\n\n[Source: Notion + Slack, ${TODAY}]` },
    { slug: 'projects/byggtjeneste-analyse', title: 'Analyse av effekt (Norsk Byggtjeneste)', notion_id: '2e598afcabf58093a463d01b742e0ab8', client: 'clients/norsk-byggtjeneste', salgsfase: 'Vunnet', leveringsstatus: 'Fullført', pris: 150000, tags: ['byggtjeneste', 'analyse', 'fullfort'], ct: `# Analyse av effekt — Norsk Byggtjeneste\n\n> Fastpris 150k. Analyse av AI-effektpotensial. Fullført.\n\n## Leveranser\n- Nåsituasjonsanalyse\n- Kvantifisert effektestimat (~40-70% mer effektive)\n- Anbefalinger og implementeringsplan\n\n## Dates\n- Start: 2026-02-09\n- Slutt: 2026-03-13\n\n[Source: Notion, ${TODAY}]` },
    { slug: 'projects/preppa', title: 'Preppa samarbeid', notion_id: '2f498afcabf5808d8fe7ca5cd6f33da1', client: 'clients/preppa', salgsfase: 'Vunnet', leveringsstatus: 'Pågår', tags: ['preppa', 'startup'], ct: `# Preppa samarbeid\n\n> Samarbeid med Preppa (AI startup). Eierandeler som modell.\n\n## Key Contacts\n- Kenneth Klev — Cofounder, kenneth@preppa.ai\n\n## Status\nNytt prosjekt holdes atskilt fra Preppa-produktet. Mål: salg av selskapet.\n\n[Source: Notion, ${TODAY}]` },
    { slug: 'projects/avinor-erfaringsdeling', title: 'Erfaringsdeling Avinor', notion_id: '31f98afcabf5802ea21ce69036994b8b', client: 'clients/avinor', salgsfase: 'Lead', leveringsstatus: 'Ikke startet', tags: ['avinor', 'bygg', 'lead'], ct: `# Erfaringsdeling mellom byggprosjekter — Avinor\n\n> AI-søk i PIMS (Omega365) på tvers av byggprosjekter.\n\n## Markedsanalyse\n- Konkurransevindu 12-18 mnd\n- Omega365-konferanse juni 2026 er target\n\n## Next Steps\n- Dialog med Omega365 som partner\n- Pilot med Avinor\n\n[Source: Notion, ${TODAY}]` },
    { slug: 'projects/baneservice-cowork', title: 'Claude Cowork (Baneservice)', notion_id: '32d98afcabf580d187afe944de78c89a', client: 'clients/baneservice', salgsfase: 'Lead', leveringsstatus: 'Ikke startet', tags: ['baneservice', 'claude', 'lead'], ct: `# Claude Cowork — Baneservice\n\n> Hjelpe Baneservice i gang med Claude Code og skills.\n\n## Status\nHatt første demo-møte. Kunden \"rimelig solgt\". Neste: pilotbrukere.\nÅpent spørsmål: prismodell (timer vs. smartere prising).\n\n[Source: Notion + Slack, ${TODAY}]` },
    { slug: 'projects/poweron-chatgpt', title: 'Private ChatGPT (Poweron)', notion_id: '2e798afcabf5806d961ddbcd7249febb', client: 'clients/baneservice', salgsfase: 'Lead', leveringsstatus: 'Ikke startet', tags: ['poweron', 'chatgpt', 'lead'], ct: `# Private ChatGPT — Poweron\n\n> Datterselskap av Baneservice vil ha samme chat-app. ~16k/mnd.\n\n## Status\nBallen hos Poweron. Venter på at de er klare.\n\n[Source: Notion, ${TODAY}]` },
    { slug: 'projects/velox', title: 'Prosjekt Velox', notion_id: '31f98afcabf580c9b955fd2aa933025e', client: '', salgsfase: 'Intern', leveringsstatus: 'Pågår', tags: ['intern', 'produkt', 'ai'], ct: `# Prosjekt Velox\n\n> Internt produktinitiativ. Enterprise AI-agent. Navnet: \"Velox\" (Velo X + latinsk for rask).\n\n## Status\n- Startup-kit laget (Simen): github.com/Velo-Labs/willy-viagra-kit\n- Kartlegger UI/UX og kundebehov\n- Willy/Velox demo for NorgesGruppen planlegges\n\n## SkatteFUNN\nGodkjent. Søknadsnummer 3504. Total 1 MNOK over 2025-2026.\n- AP1 (kartlegging): ferdig\n- AP2 (MVP): pågår\n- AP3 (v1): planlagt\n\n[Source: Notion + Slack, ${TODAY}]` },
    { slug: 'projects/zevent-ai', title: 'Z Event AI-adopsjon', notion_id: '', client: 'clients/z-event', salgsfase: 'Vunnet', leveringsstatus: 'Pågår', tags: ['zevent', 'ai', 'adopsjon'], ct: `# Z Event AI-adopsjon\n\n> AI-adopsjonsprogram for Z Event. Timer faktureres løpende.\n\n## Approach\n- Ikke enkelt-workshops — atferdsendring via gjentatte sesjoner\n- 45 min annenhver dag i 2 uker\n- Starte med lederne, etablere \"AI-lab\"\n- Thomas driver AI på alle mandagsmøter\n\n## Deliverables\n- zbrain MCP-server (ferdig)\n- AI-generert innsalgs-PowerPoint\n- Skill-eksempler (attester med logo + Word-mal)\n\n## Business model\n- Test på Z Event, deretter pakketere og selge til andre bedrifter\n\n[Source: Slack #project-zevent, ${TODAY}]` },
    { slug: 'projects/aidn-ambient', title: 'Aidn Ambient Listening', notion_id: '', client: 'clients/aidn', salgsfase: 'Vunnet', leveringsstatus: 'Pågår', tags: ['aidn', 'stt', 'helse'], ct: `# Aidn Ambient Listening\n\n> STT + oppsummering for helsearbeidere. Simen ansvarlig.\n\n## Scenarios\n1. Lege-pasient transkribering med streaming + oppsummering\n2. Sykepleier diktering av journalnotater mellom hjemmebesøk\n\n## Tech\n- PydanticAI for orkestrering\n- 11labs Scribe2 (bedre enn gpt-4o-transcribe)\n- Vurderer DBOS + Logfire for observability\n- STT allerede i produksjon\n\n## Notes\n- Aidn ser Velo som full team — åpner for mersalg\n- Mange kommuner nå positive til STT (eks. Lillestrøm)\n\n[Source: Slack #project-aidn, ${TODAY}]` },
    { slug: 'projects/neo-bank', title: 'Neo Bank forprosjekt', notion_id: '', client: 'clients/neo', salgsfase: 'Vunnet', leveringsstatus: 'Fullført', pris: 40000, tags: ['neo', 'fintech', 'fullfort'], ct: `# Neo Bank forprosjekt\n\n> Konfidensielt. Ny bank for store investorer. Fastpris 40k.\n\n## Leveranser\n1. AI-first arkitekturskisse\n2. AI-personaliseringsplattform for kredittkort\n3. Kundeservice chatbot (tekst + voice)\n\n## Status\nLevert jan 2026. Venter investorbeslutning.\nMerete signaliserer ønske om 10-12 IT-folk som partner.\n\n[Source: Slack #project-neo, ${TODAY}]` },
  ];
  for (const p of projects) {
    await upsert(p.slug, 'project', p.title, p.ct, { notion_id: p.notion_id, client: p.client, salgsfase: p.salgsfase, leveringsstatus: p.leveringsstatus, pris: p.pris, slack_channel: `#project-${p.slug.split('/')[1]}` }, p.tags);
    if (p.client) await link(p.slug, p.client, 'project_for', p.title).catch(() => {});
    console.log(`  ✓ ${p.slug}`);
  }
}

// ============================================================
// CONCEPTS (from Slack #brainstorming + key Notion pages)
// ============================================================
async function ingestConcepts() {
  console.log('\n=== CONCEPTS ===');
  const concepts = [
    { slug: 'concepts/velox-product', title: 'Velox — Enterprise AI Agent', tags: ['produkt', 'ai'], ct: `# Velox — Enterprise AI Agent\n\n> Internt Velo-produkt. Enterprise AI-agent som Willy/Claude for bedrifter.\n\n## Naming\n- Velox: kombinasjon av \"Velo X\" og latinsk for rask/hurtig\n- Foreslått av William som kommersielt navn\n\n## Strategy\n- Ikke ferdig plattform — leveransemodell\n- Target: større virksomheter\n- SkatteFUNN-støtte godkjent (1 MNOK)\n\n[Source: Slack + Notion, ${TODAY}]` },
    { slug: 'concepts/ai-adopsjonsprogram', title: 'AI-adopsjonsprogram', tags: ['produkt', 'ai', 'workshop'], ct: `# AI-adopsjonsprogram\n\n> Velos modell for å få bedrifter til å faktisk bruke AI.\n\n## Approach\n- IKKE enkelt-workshops\n- Atferdsendring via gjentatte sesjoner: 45 min annenhver dag i 2 uker\n- AI-ambassadører i hver avdeling\n- Starte med lederne\n- Etablere \"AI-lab\" i organisasjonen\n\n## Business Model\n- Test på Z Event → pakketere → selge til andre\n- Én Velo-person kan kjøre for flere bedrifter\n- LinkedIn-drevet kundestrategi\n\n[Source: Slack #project-zevent + #brainstorming, ${TODAY}]` },
    { slug: 'concepts/expat-skatt', title: 'Expat-skatt produkt', tags: ['ide', 'saas'], ct: `# Expat-skatt produkt\n\n> ~10.000 amerikanere i Norge som må rapportere skatt til USA.\n\n## Idé\n- Eksisterende løsninger: 15-30k\n- Kristoffer brukte Claude på 1 time\n- Konsept: AI-utfylling + skatteadvokat QA\n- Sannsynlig SaaS-modell\n\n[Source: Slack #brainstorming, Kristoffer, 2026-03-23]` },
    { slug: 'concepts/onboarding-agent', title: 'Personalisert onboarding-verktøy', tags: ['ide', 'saas'], ct: `# Personalisert onboarding-verktøy\n\n> Conversational agent som kartlegger rolle/behov og bygger personalisert kurs.\n\n## Idé (Simen)\n- RAG på selskapets dokumentasjon\n- Oppsettgebyr + pris per sluttbruker\n\n[Source: Slack #brainstorming, Simen, 2026-01-21]` },
    { slug: 'concepts/velo-cdp', title: 'Velo CDP — Customer Data Platform', tags: ['intern', 'produkt', 'skattefunn'], ct: `# Velo CDP\n\n> Internt FoU-prosjekt med SkatteFUNN-støtte.\n\n## SkatteFUNN\n- Godkjent, søknadsnummer 3504\n- \"Økt effektivitet i norsk næringsliv ved bruk av sikre KI-løsninger\"\n- Total: 1 MNOK (200k 2025 + 800k 2026)\n\n## FoU-utfordringer\n- Kombinere tradisjonell ML med LLM-semantikk\n- Konsistens fra ikke-deterministiske LLM-er\n- GDPR-tilpasning for norske kundemønstre\n\n## Arbeidspakker\n- AP1 (kartlegging, 09-12/2025): ferdig\n- AP2 (MVP, 01-05/2026): pågår\n- AP3 (v1, 05-12/2026): planlagt\n\n[Source: Slack #project-velo-cdp, ${TODAY}]` },
  ];
  for (const c of concepts) { await upsert(c.slug, 'concept', c.title, c.ct, {}, c.tags); console.log(`  ✓ ${c.slug}`); }
}

// ============================================================
// TIMELINE ENTRIES (from Slack wins + channels)
// ============================================================
async function ingestTimeline() {
  console.log('\n=== TIMELINE ENTRIES ===');
  const entries: Array<{slug:string;date:string;summary:string;source:string}> = [
    // wins
    { slug: 'clients/aidn', date: '2025-12-18', summary: 'Aidn vunnet: Kent-Remi valgte Simen etter intervjurunde — "åpenbart at det er Simen vi vil ha." Direkteavtale.', source: 'Slack #wins, @Andreas' },
    { slug: 'clients/norgesgruppen', date: '2025-12-16', summary: 'Direkteavtale med Trumf bekreftet. Forte Hub informert.', source: 'Slack #wins, @William' },
    { slug: 'clients/neo', date: '2025-12-11', summary: 'Prosjekt Neo i boks. Fastpris 40k.', source: 'Slack #wins, @William' },
    { slug: 'clients/cisco', date: '2025-10-28', summary: 'Eirik fått tommel opp fra Cisco. ~1575 kr/t, min 3 mnd fra januar.', source: 'Slack #wins, @Andreas' },
    { slug: 'clients/obos', date: '2025-10-09', summary: 'Tommel opp fra Jarle i OBOS, 3 mnd fra desember.', source: 'Slack #wins, @Andreas' },
    { slug: 'clients/prochect', date: '2025-10-17', summary: 'Prochect fase 1 POC, 100k på timer. Vil ha Velo på eiersiden.', source: 'Slack #wins, @William' },
    { slug: 'clients/norsk-byggtjeneste', date: '2026-03-24', summary: 'Glimrende feedback: "åpenbart riktigste valget... vil namedroppe Velo Labs."', source: 'Slack #wins, @Andreas' },
    { slug: 'clients/z-event', date: '2026-04-08', summary: 'Thomas bekreftet: Z Event vil bli AI-drevet organisasjon. Velo fakturerer timer løpende.', source: 'Slack #wins, @Kristoffer' },
    { slug: 'clients/nki', date: '2026-03-20', summary: 'Prosjekt fullført, 100% fornøyd. "Hvis vi trenger folk ringer vi dere."', source: 'Slack #friday-wins, @Andreas' },
    { slug: 'projects/aidn-ambient', date: '2026-02-20', summary: 'STT i produksjon hos Aidn.', source: 'Slack #friday-wins, @Simen' },
    // new hire
    { slug: 'concepts/strategi', date: '2026-02-20', summary: 'Mio Waitz ansatt som første person til Velo Crew.', source: 'Slack #friday-wins, @Simen' },
    // Baneservice Claude demo from #salg
    { slug: 'projects/baneservice-cowork', date: '2026-04-10', summary: 'Demo-møte med Baneservice om Claude/Cowork. Kunden "rimelig solgt". Neste: Alexander tar kontakt for pilotbrukere.', source: 'Slack #salg, @Andreas' },
    // NKI timeline
    { slug: 'clients/nki', date: '2026-01-26', summary: 'App åpnet for NKI-ansatte, folk positive. Sjef til Jon Erik lurte på kapasitet — Oslo kommune AI-agent-pilot (august).', source: 'Slack #project-nki, @Kristoffer' },
  ];
  for (const e of entries) {
    try { await tl(e.slug, e.date, e.summary, e.source); console.log(`  + ${e.slug}: ${e.date}`); }
    catch (err: any) { console.log(`  ⚠ ${e.slug}: ${err.message?.slice(0,50)}`); }
  }
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log('=== FULL VELO-BRAIN INGESTION ===');
  console.log(`Date: ${TODAY}\n`);

  const [{ count: before }] = await sql`SELECT count(*) FROM pages`;
  console.log(`Pages before: ${before}`);

  await ingestTeam();
  await ingestClients();
  await ingestProjects();
  await ingestConcepts();
  await ingestTimeline();

  // Log
  const allPages = await sql`SELECT slug FROM pages`;
  await logIngest('full-sync', 'notion+slack', allPages.map(p => p.slug), `Full sync: ${stats.created} created, ${stats.updated} updated, ${stats.tags} tags, ${stats.links} links, ${stats.timeline} timeline`);

  const [{ count: after }] = await sql`SELECT count(*) FROM pages`;
  console.log(`\n=== COMPLETE ===`);
  console.log(`Pages: ${before} → ${after} (${stats.created} new, ${stats.updated} updated)`);
  console.log(`Tags: ${stats.tags}, Links: ${stats.links}, Timeline: ${stats.timeline}`);

  // Test search
  console.log('\n--- Search test ---');
  for (const q of ['AI-utvikler OBOS', 'Kristoffer founder', 'Aidn helse', 'SkatteFUNN']) {
    const r = await sql`SELECT slug, title, ts_rank(search_vector, plainto_tsquery('norwegian', ${q})) as rank FROM pages WHERE search_vector @@ plainto_tsquery('norwegian', ${q}) ORDER BY rank DESC LIMIT 2`;
    console.log(`"${q}": ${r.map(x => `${x.slug} (${Number(x.rank).toFixed(2)})`).join(', ') || 'no results'}`);
  }

  await sql.end();
}

main().catch(e => { console.error(e); process.exit(1); });
