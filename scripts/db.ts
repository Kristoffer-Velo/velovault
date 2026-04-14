/**
 * velo-brain database client.
 * Direct Postgres access for ingestion scripts.
 */
import postgres from 'postgres';

const DATABASE_URL = process.env.VELO_BRAIN_DATABASE_URL || 'postgresql://postgres.ctqanjywpxsoyqwtneht@aws-1-eu-central-2.pooler.supabase.com:5432/postgres';

export const sql = postgres(DATABASE_URL, { max: 5 });

export interface PutPageInput {
  slug: string;
  type: string;
  title: string;
  compiled_truth: string;
  timeline?: string;
  frontmatter?: Record<string, unknown>;
}

export async function putPage(input: PutPageInput): Promise<{ action: 'created' | 'updated'; slug: string }> {
  const { slug, type, title, compiled_truth, timeline = '', frontmatter = {} } = input;
  const content_hash = Bun.hash(compiled_truth).toString(16);

  const existing = await sql`SELECT id, content_hash FROM pages WHERE slug = ${slug}`;

  if (existing.length > 0) {
    if (existing[0].content_hash === content_hash) {
      return { action: 'updated', slug }; // no change
    }
    // Save version before updating
    await sql`
      INSERT INTO page_versions (page_id, compiled_truth, frontmatter)
      SELECT id, compiled_truth, frontmatter FROM pages WHERE slug = ${slug}
    `;
    await sql`
      UPDATE pages SET
        title = ${title},
        type = ${type},
        compiled_truth = ${compiled_truth},
        timeline = ${timeline},
        frontmatter = ${JSON.stringify(frontmatter)},
        content_hash = ${content_hash},
        updated_at = now()
      WHERE slug = ${slug}
    `;
    return { action: 'updated', slug };
  }

  await sql`
    INSERT INTO pages (slug, type, title, compiled_truth, timeline, frontmatter, content_hash)
    VALUES (${slug}, ${type}, ${title}, ${compiled_truth}, ${timeline}, ${JSON.stringify(frontmatter)}, ${content_hash})
  `;
  return { action: 'created', slug };
}

export async function addTimelineEntry(slug: string, date: string, summary: string, source: string, detail = '') {
  const [page] = await sql`SELECT id FROM pages WHERE slug = ${slug}`;
  if (!page) throw new Error(`Page not found: ${slug}`);
  await sql`
    INSERT INTO timeline_entries (page_id, date, summary, source, detail)
    VALUES (${page.id}, ${date}, ${summary}, ${source}, ${detail})
  `;
}

export async function addLink(fromSlug: string, toSlug: string, linkType: string, context = '') {
  const [from] = await sql`SELECT id FROM pages WHERE slug = ${fromSlug}`;
  const [to] = await sql`SELECT id FROM pages WHERE slug = ${toSlug}`;
  if (!from || !to) return; // skip if either page missing
  await sql`
    INSERT INTO links (from_page_id, to_page_id, link_type, context)
    VALUES (${from.id}, ${to.id}, ${linkType}, ${context})
    ON CONFLICT (from_page_id, to_page_id) DO NOTHING
  `;
}

export async function addTag(slug: string, tag: string) {
  const [page] = await sql`SELECT id FROM pages WHERE slug = ${slug}`;
  if (!page) return;
  await sql`
    INSERT INTO tags (page_id, tag) VALUES (${page.id}, ${tag})
    ON CONFLICT (page_id, tag) DO NOTHING
  `;
}

export async function logIngest(sourceType: string, sourceRef: string, pagesUpdated: string[], summary: string) {
  await sql`
    INSERT INTO ingest_log (source_type, source_ref, pages_updated, summary)
    VALUES (${sourceType}, ${sourceRef}, ${JSON.stringify(pagesUpdated)}, ${summary})
  `;
}
