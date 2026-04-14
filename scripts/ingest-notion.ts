/**
 * First Notion ingestion — test batch.
 * Writes projects, clients, and key pages from Notion into velo-brain.
 */
import { sql, putPage, addTag, addLink, addTimelineEntry, logIngest } from './db.ts';

const TODAY = new Date().toISOString().split('T')[0];
const pagesWritten: string[] = [];

// ============================================================
// CLIENTS
// ============================================================

async function ingestClients() {
  console.log('\n--- Ingesting Clients ---');

  const clients = [
    {
      slug: 'clients/baneservice',
      title: 'Baneservice',
      frontmatter: {
        type: 'client',
        notion_id: '2a798afcabf5803393dbcf526cf8cf40',
        last_enriched: TODAY,
        tags: ['infrastruktur', 'innovasjon'],
      },
      compiled_truth: `# Baneservice

> Infrastrukturselskap. Innovasjonsavdelingen vil teste AI-løsninger raskt uten å måtte godkjenne budsjett per prosjekt.

## State
- Eksisterende kunde med pågående samarbeid
- Ca 600 ansatte, startet med 50-60 brukere for chatbot
- Slack: #project-baneservice

## Projects
- Chatbot-prosjekt (2025): Enkel chat med dokumentopplasting
- Kapasitetsavtale 2026: 20% kapasitet, 300 timer, NOK 1 600/t

## Key Contacts
- Kontaktperson i innovasjonsavdelingen

[Source: Notion, "Baneservice", ${TODAY}]`,
    },
    {
      slug: 'clients/aidn',
      title: 'Aidn',
      frontmatter: {
        type: 'client',
        notion_id: '2c198afcabf580cd9b4ac03b5f285310',
        website: 'https://www.aidn.no/',
        last_enriched: TODAY,
        tags: ['helse', 'ai'],
      },
      compiled_truth: `# Aidn

> Helsetech-selskap. Trenger utviklerkapasitet for AI-løsninger i produktet for effektive helsearbeidere.

## State
- Kontakt via Adrian Fiorito (studiekompis av Andreas)
- EHF-adresse: 927 384 302
- Referanse: "John Dugan / Skattefunn 90000994"
- Slack: #project-aidn

## Key Contacts
| Name | Role | Note |
|------|------|------|
| Adrian Fiorito | Kontaktperson | Studiekompis av Andreas |
| John Dugan | Referanse | Skattefunn |

[Source: Notion, "Aidn", ${TODAY}]`,
    },
    {
      slug: 'clients/norgesgruppen',
      title: 'NorgesGruppen',
      frontmatter: {
        type: 'client',
        notion_id: '2a298afcabf5803ea8faea2e98fe84f6',
        last_enriched: TODAY,
        tags: ['dagligvare', 'enterprise'],
      },
      compiled_truth: `# NorgesGruppen

> Norges største dagligvarekonsern. Velo jobber med Trumf-relatert AI.

## State
- Eier: William
- Slack: #project-norgesgruppen
- Viktig kundereferanse for branding

## Key Contacts
- Kontaktperson registrert i Notion

[Source: Notion, "NorgesGruppen", ${TODAY}]`,
    },
    {
      slug: 'clients/obos',
      title: 'OBOS',
      frontmatter: {
        type: 'client',
        notion_id: '1f198afcabf580e1bea7d265d8a23fff',
        last_enriched: TODAY,
        tags: ['bolig', 'enterprise'],
      },
      compiled_truth: `# OBOS

> Boligbyggelag. Interessert i AI-løsning. Lead via PO i KIWI Digital.

## State
- Eier: William
- Slack: #project-obos
- Kundereferanse for branding

[Source: Notion, "OBOS", ${TODAY}]`,
    },
  ];

  for (const c of clients) {
    const result = await putPage({
      slug: c.slug,
      type: 'client',
      title: c.title,
      compiled_truth: c.compiled_truth,
      frontmatter: c.frontmatter,
    });
    for (const tag of (c.frontmatter.tags || [])) {
      await addTag(c.slug, tag);
    }
    pagesWritten.push(c.slug);
    console.log(`  ${result.action}: ${c.slug}`);
  }
}

// ============================================================
// PROJECTS
// ============================================================

async function ingestProjects() {
  console.log('\n--- Ingesting Projects ---');

  const projects = [
    {
      slug: 'projects/baneservice-chatbot',
      title: 'Baneservice Chatbot',
      frontmatter: {
        type: 'project',
        notion_id: '20098afcabf5801ab640ff20c5ea0a27',
        client: 'clients/baneservice',
        salgsfase: 'Vunnet',
        leveringsstatus: 'Pågår',
        pris: 80000,
        prosjektstart: '2025-06-29',
        prosjektslutt: '2025-08-15',
        slack_channel: '#project-baneservice',
        last_enriched: TODAY,
        tags: ['baneservice', 'chatbot', 'ai'],
      },
      compiled_truth: `# Baneservice Chatbot

> AI chatbot for Baneservice. 50-60 brukere initialt, 600 ansatte totalt.

## Scope
Enkel chat med mulighet for å laste opp dokumenter. Første fase er grunnleggende chatbot-funksjonalitet.

## Team
- **Ansvarlig:** Kristoffer

## Key Dates
- Prosjektstart: 2025-06-29
- Prosjektslutt: 2025-08-15

## Status
Pågår. Budsjett NOK 80 000.

[Source: Notion, "Baneservice", ${TODAY}]`,
    },
    {
      slug: 'projects/baneservice-kapasitetsavtale-2026',
      title: 'Baneservice Kapasitetsavtale 2026',
      frontmatter: {
        type: 'project',
        notion_id: '2a798afcabf580a2a08af910de79272c',
        client: 'clients/baneservice',
        salgsfase: 'Ikke aktuell',
        leveringsstatus: 'Ikke startet',
        pris: 1600,
        timeomfang: 300,
        slack_channel: '#project-baneservice',
        last_enriched: TODAY,
        tags: ['baneservice', 'kapasitetsavtale'],
      },
      compiled_truth: `# Baneservice Kapasitetsavtale 2026

> 20% kapasitetsavtale med Baneservice innovasjonsavdelingen for 2026.

## Scope
Innovasjonsavdelingen ønsker kontinuitet og progresjon. De vil kunne teste nye ting raskt uten å måtte godkjenne budsjett per prosjekt. 300 timer, NOK 1 600/t.

## Team
- **Ansvarlig:** Kristoffer

## Status
Ikke aktuell. Venter på oppdatering fra Baneservice.

[Source: Notion, "Kapasitetsavtale 2026", ${TODAY}]`,
    },
    {
      slug: 'projects/aidn',
      title: 'Aidn AI-utvikling',
      frontmatter: {
        type: 'project',
        notion_id: '1f198afcabf58089acfecce60f00d2a7',
        client: 'clients/aidn',
        salgsfase: 'On-hold',
        leveringsstatus: 'Ikke startet',
        pris: 1000000,
        slack_channel: '#project-aidn',
        last_enriched: TODAY,
        tags: ['aidn', 'helse', 'ai'],
      },
      compiled_truth: `# Aidn AI-utvikling

> Utviklerkapasitet for AI-løsninger i Aidns helseprodukt. Verdi NOK 1 000 000.

## Scope
Hjelpe Aidn med å lage AI-løsninger i produktet for mer effektive helsearbeidere.

## Team
- **Ansvarlig:** Kristoffer
- **Kontakt:** Adrian Fiorito (studiekompis av Andreas)

## Status
På hold. Kvartalsvis oppfølging.

[Source: Notion, "Aidn", ${TODAY}]`,
    },
  ];

  for (const p of projects) {
    const result = await putPage({
      slug: p.slug,
      type: 'project',
      title: p.title,
      compiled_truth: p.compiled_truth,
      frontmatter: p.frontmatter,
    });
    for (const tag of (p.frontmatter.tags || [])) {
      await addTag(p.slug, tag);
    }
    pagesWritten.push(p.slug);
    console.log(`  ${result.action}: ${p.slug}`);
  }

  // Links: project → client
  console.log('  Creating links...');
  await addLink('projects/baneservice-chatbot', 'clients/baneservice', 'project_for', 'Chatbot-prosjekt');
  await addLink('projects/baneservice-kapasitetsavtale-2026', 'clients/baneservice', 'project_for', 'Kapasitetsavtale');
  await addLink('projects/aidn', 'clients/aidn', 'project_for', 'AI-utvikling');
}

// ============================================================
// KEY PAGES (concepts + processes)
// ============================================================

async function ingestKeyPages() {
  console.log('\n--- Ingesting Key Pages ---');

  const pages = [
    {
      slug: 'concepts/strategi',
      type: 'concept',
      title: 'Strategi og retning',
      frontmatter: {
        type: 'concept',
        notion_id: '31d98afcabf58050a6c5c95d77006b90',
        last_enriched: TODAY,
        tags: ['strategi', 'intern'],
      },
      compiled_truth: `# Strategi og retning

> Velo Labs' strategiske retning mot sommeren 2026.

## Fokusområder
- Bygge Velo merkevare som tiltrekker de beste folkene
- Tydelig prosess for validering og testing av ideer til produksjon
- Prioritering av velo-tid og felles kontortid

[Source: Notion, "Strategi og retning", ${TODAY}]`,
    },
    {
      slug: 'concepts/kundesitater',
      type: 'concept',
      title: 'Kundesitater',
      frontmatter: {
        type: 'concept',
        notion_id: '31c98afcabf580798234e381a0a4ab50',
        last_enriched: TODAY,
        tags: ['salg', 'branding'],
      },
      compiled_truth: `# Kundesitater

> Samling av kundesitater for branding og salg. Mål: skriftlig feedback fra 100% av kunder.

## Bruk
- Branding-materiell
- Salgspresentasjoner
- Nettside

[Source: Notion, "Kundesitater", ${TODAY}]`,
    },
  ];

  for (const p of pages) {
    const result = await putPage({
      slug: p.slug,
      type: p.type,
      title: p.title,
      compiled_truth: p.compiled_truth,
      frontmatter: p.frontmatter,
    });
    for (const tag of ((p.frontmatter as any).tags || [])) {
      await addTag(p.slug, tag);
    }
    pagesWritten.push(p.slug);
    console.log(`  ${result.action}: ${p.slug}`);
  }
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log('=== velo-brain Notion Ingestion ===');
  console.log(`Date: ${TODAY}\n`);

  try {
    // Verify connection
    const [{ count }] = await sql`SELECT count(*) FROM pages`;
    console.log(`Current pages in brain: ${count}`);

    await ingestClients();
    await ingestProjects();
    await ingestKeyPages();

    // Log the ingestion
    await logIngest('notion', 'initial-sync', pagesWritten, `Initial Notion sync: ${pagesWritten.length} pages (4 clients, 3 projects, 2 concepts)`);

    // Final stats
    const [stats] = await sql`SELECT count(*) as pages FROM pages`;
    const [tagStats] = await sql`SELECT count(*) as tags FROM tags`;
    const [linkStats] = await sql`SELECT count(*) as links FROM links`;

    console.log(`\n=== Ingestion Complete ===`);
    console.log(`Pages: ${stats.pages}`);
    console.log(`Tags: ${tagStats.tags}`);
    console.log(`Links: ${linkStats.links}`);
    console.log(`Pages written: ${pagesWritten.join(', ')}`);

    // Test search
    console.log('\n--- Testing Norwegian search ---');
    const searchResult = await sql`
      SELECT slug, title, ts_rank(search_vector, plainto_tsquery('norwegian', 'chatbot innovasjon')) as rank
      FROM pages
      WHERE search_vector @@ plainto_tsquery('norwegian', 'chatbot innovasjon')
      ORDER BY rank DESC
      LIMIT 3
    `;
    console.log('Search "chatbot innovasjon":');
    for (const r of searchResult) {
      console.log(`  ${r.slug} — ${r.title} (rank: ${Number(r.rank).toFixed(4)})`);
    }
  } catch (e: any) {
    console.error('Error:', e.message);
    throw e;
  } finally {
    await sql.end();
  }
}

main();
