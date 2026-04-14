/**
 * First Slack ingestion — extract knowledge from #project-baneservice and #salg.
 */
import { sql, putPage, addTag, addLink, addTimelineEntry, logIngest } from './db.ts';

const TODAY = new Date().toISOString().split('T')[0];
const pagesWritten: string[] = [];

async function ingestBaneserviceUpdates() {
  console.log('\n--- #project-baneservice → projects/baneservice-chatbot timeline ---');

  const entries = [
    { date: '2026-02-25', summary: 'Diskusjon om tilleggsfunksjonalitet: se sist endringer i TRV. Planlegger å lage det som eget tool til agenten. Baneservice har styringsgruppemøte fredag.', source: 'Slack #project-baneservice, @Andreas' },
    { date: '2026-03-04', summary: 'Magnus: PR #56 klar for merge.', source: 'Slack #project-baneservice, @Magnus' },
    { date: '2026-03-07', summary: 'Eirik deler OpenAI skills cookbook. .env fil delt via 1Password.', source: 'Slack #project-baneservice' },
    { date: '2026-03-09', summary: 'Eirik: PR #73 — feedback-rapportering til MLFlow + komplett devcontainer setup.', source: 'Slack #project-baneservice, @Eirik' },
    { date: '2026-03-12', summary: 'Magnus: PR #76 — feedback som dialog. Diskusjon om fritekst-feedback vs MLFlow-lagring.', source: 'Slack #project-baneservice, @Magnus' },
    { date: '2026-03-14', summary: 'Andreas prøver omskriving av skill til tool/skill i applikasjonen. Kombinerer med vektorsøk for raskere respons.', source: 'Slack #project-baneservice, @Andreas' },
    { date: '2026-03-16', summary: 'Eirik: Feedback-form trenger forbedring — fritekst lagres ikke til MLFlow. Brukere dropper thumbs-up hvis de må skrive.', source: 'Slack #project-baneservice, @Eirik' },
    { date: '2026-03-18', summary: 'Andreas snakket med Alexander om Claude vs Banebot. Kunden fornøyd med tilnærmingen. Neste steg: demo av Claude, skills og cowork. Kunden trolig fortsetter med baneboten en stund.', source: 'Slack #project-baneservice, @Andreas' },
    { date: '2026-03-19', summary: 'Magnus: PR #83 — endringslogg-feature.', source: 'Slack #project-baneservice, @Magnus' },
    { date: '2026-03-24', summary: 'Magnus: Prøvde oppgradering til Next 16.2 — Serwist fungerer ikke med turbopack. Venter med oppgradering eller lager workaround.', source: 'Slack #project-baneservice, @Magnus' },
    { date: '2026-04-06', summary: 'Simen: Lagt til speech-to-text (OpenAI Whisper). Ikke helt fornøyd med resultatet, ikke overbevist av Whisper.', source: 'Slack #project-baneservice, @Simen' },
  ];

  for (const e of entries) {
    await addTimelineEntry('projects/baneservice-chatbot', e.date, e.summary, e.source);
    console.log(`  + ${e.date}: ${e.summary.slice(0, 60)}...`);
  }
  console.log(`  Added ${entries.length} timeline entries`);
}

async function ingestSalgDeals() {
  console.log('\n--- #salg → deals + timelines ---');

  // Deal: Novo Nordisk
  const novoResult = await putPage({
    slug: 'deals/novo-nordisk-ai-engineer',
    type: 'deal',
    title: 'Novo Nordisk — AI Engineer',
    compiled_truth: `# Novo Nordisk — AI Engineer

> 100% allokering AI engineer-rolle via Twoday Freelance. Søborg, 12 mnd. Frontier agentic AI i klinisk data.

## Context
Kristian Kvalsvik i dialog med Twoday Freelance som har direkte inngang hos Novo Nordisk. Henvendelse om "Hands-on AI engineer" — agentic AI-arkitektur med Microsoft AI Acceleration Studio.

## Key Details
- **Varighet:** 20. apr 2026 – 19. apr 2027
- **Location:** Søborg (København)
- **Allokering:** 100%
- **Kilde:** Kristian Kvalsvik via Twoday Freelance

## Rolle
- Co-own AI agent-arkitektur med Microsoft
- Design agentic tooling (skills, tool definitions, sandboxed runtime)
- Lede self-learning loop post-MVP
- Evaluation framework (LLM-as-Judge, SME scoring)

## Status
Må si fra raskt om vi er interesserte. Kristian er opptatt selv.

[Source: Slack #salg, @William, 2026-04-13]`,
    frontmatter: { type: 'deal', salgsfase: 'Lead', slack_thread_ts: '1744555798', last_enriched: TODAY, tags: ['novo-nordisk', 'ai', 'enterprise'] },
  });
  await addTag('deals/novo-nordisk-ai-engineer', 'novo-nordisk');
  await addTag('deals/novo-nordisk-ai-engineer', 'ai');
  await addTag('deals/novo-nordisk-ai-engineer', 'enterprise');
  pagesWritten.push('deals/novo-nordisk-ai-engineer');
  console.log(`  ${novoResult.action}: deals/novo-nordisk-ai-engineer`);

  // Deal: Stor transportkunde
  const transportResult = await putPage({
    slug: 'deals/transportkunde-oslo-ai',
    type: 'deal',
    title: 'Stor transportkunde Oslo — AI-plan',
    compiled_truth: `# Stor transportkunde Oslo — AI-plan

> ASAP-behov: 1-3 personer, 50% i april-mai. Legge plan for AI-satsning. Ingen konkurranse.

## Context
Lead fra Tobias Flood. Stor transportkunde i Oslo som trenger hjelp med AI-plan. Har fått penger til dette i Q2, derfor haster. Ikke konkurranse — de har spurt nettverket sitt om flinke folk.

## Next Steps
- Finne ut om vi vil og hvem som kan
- Sende CV-er til Tobias før helgen
- Møte med kunden til uka

## Status
Akutt. Trenger svar raskt.

[Source: Slack #salg, @Andreas, 2026-04-08]`,
    frontmatter: { type: 'deal', salgsfase: 'Lead', slack_thread_ts: '1744119229', last_enriched: TODAY, tags: ['transport', 'ai', 'konsulent'] },
  });
  await addTag('deals/transportkunde-oslo-ai', 'transport');
  await addTag('deals/transportkunde-oslo-ai', 'ai');
  pagesWritten.push('deals/transportkunde-oslo-ai');
  console.log(`  ${transportResult.action}: deals/transportkunde-oslo-ai`);

  // Deal: Coop/Ystory
  const coopResult = await putPage({
    slug: 'deals/coop-ystory',
    type: 'deal',
    title: 'Coop/Ystory — App-utvikling',
    compiled_truth: `# Coop/Ystory — App-utvikling

> Y Story pitcher 450k pakke for app klar til start av mai. Pluss 50%+ dynamisk prising i mai.

## Context
Y Story pitcher en pakke på NOK 450 000 for Coop. App må være klar til starten av mai. William ikke involvert pga NorgesGruppen.

## Status
Venter på resultat fra Y Storys pitch.

[Source: Slack #salg, @Kristoffer, 2026-04-08]`,
    frontmatter: { type: 'deal', salgsfase: 'Tilbud', slack_thread_ts: '1744119415', last_enriched: TODAY, tags: ['coop', 'ystory', 'app'] },
  });
  await addTag('deals/coop-ystory', 'coop');
  await addTag('deals/coop-ystory', 'app');
  pagesWritten.push('deals/coop-ystory');
  console.log(`  ${coopResult.action}: deals/coop-ystory`);

  // Timeline on Baneservice project from #salg
  await addTimelineEntry(
    'projects/baneservice-chatbot',
    '2026-04-10',
    'Demo-møte med Baneservice om Claude/Cowork. Kunden "rimelig solgt". Neste steg: Alexander tar kontakt for pilotbrukere. Åpent spørsmål om prismodell — konsulent vs smartere prising.',
    'Slack #salg, @Andreas'
  );
  console.log('  + Baneservice Claude/Cowork demo timeline entry');

  // Timeline on NorgesGruppen from Proceht feedback
  await addTimelineEntry(
    'clients/baneservice',
    '2026-04-10',
    'Baneservice demo av Claude/Cowork. Kunden fornøyd og vil ha pilotbrukere. Diskusjon om prismodell.',
    'Slack #salg, @Andreas'
  );
}

async function ingestTomLead() {
  console.log('\n--- Tom lead from #salg ---');

  const result = await putPage({
    slug: 'deals/tom-bio-midler',
    type: 'deal',
    title: 'Tom — BiO-midler / Flere oppdrag',
    compiled_truth: `# Tom — BiO-midler / Flere oppdrag

> Lead via Felix. Tom jobber med flere bedrifter som vil bli bedre på AI. Interessert i oppdrag.

## Context
Mail fra Tom: Fikk kontakt via Felix i forbindelse med BiO-midler. Jobber med flere bedrifter som trenger AI-hjelp.

## Next Steps
- Kort møte med Tom (begrenset til 14-16 norsk tid, er på ferie)

[Source: Slack #salg, @Kristoffer, 2026-04-09]`,
    frontmatter: { type: 'deal', salgsfase: 'Lead', slack_thread_ts: '1744228710', last_enriched: TODAY, tags: ['bio', 'lead'] },
  });
  pagesWritten.push('deals/tom-bio-midler');
  console.log(`  ${result.action}: deals/tom-bio-midler`);
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log('=== velo-brain Slack Ingestion ===');
  console.log(`Date: ${TODAY}\n`);

  try {
    const [{ count }] = await sql`SELECT count(*) FROM pages`;
    console.log(`Current pages in brain: ${count}`);

    await ingestBaneserviceUpdates();
    await ingestSalgDeals();
    await ingestTomLead();

    await logIngest('slack', 'initial-slack-sync', pagesWritten,
      `Slack sync: ${pagesWritten.length} new deal pages, 11 timeline entries on baneservice`);

    // Stats
    const [stats] = await sql`SELECT count(*) as pages FROM pages`;
    const [tlStats] = await sql`SELECT count(*) as entries FROM timeline_entries`;
    console.log(`\n=== Slack Ingestion Complete ===`);
    console.log(`Total pages: ${stats.pages}`);
    console.log(`Total timeline entries: ${tlStats.entries}`);
    console.log(`New pages: ${pagesWritten.join(', ')}`);

    // Test search
    console.log('\n--- Testing search ---');
    const results = await sql`
      SELECT slug, title, ts_rank(search_vector, plainto_tsquery('norwegian', 'novo nordisk AI')) as rank
      FROM pages WHERE search_vector @@ plainto_tsquery('norwegian', 'novo nordisk AI')
      ORDER BY rank DESC LIMIT 3
    `;
    console.log('Search "novo nordisk AI":');
    for (const r of results) console.log(`  ${r.slug} — ${r.title} (${Number(r.rank).toFixed(4)})`);

  } catch (e: any) {
    console.error('Error:', e.message);
    throw e;
  } finally {
    await sql.end();
  }
}

main();
