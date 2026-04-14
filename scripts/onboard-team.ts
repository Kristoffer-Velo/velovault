#!/usr/bin/env bun
/**
 * velo-brain onboarding — create tokens for the whole team.
 */
import postgres from 'postgres';
import { createHash, randomBytes } from 'crypto';

const DATABASE_URL = process.env.VELO_BRAIN_DATABASE_URL!;
if (!DATABASE_URL) { console.error('Set VELO_BRAIN_DATABASE_URL'); process.exit(1); }
const SERVER_URL = 'https://skillful-reflection-production-688c.up.railway.app/mcp';

const sql = postgres(DATABASE_URL);

const team = [
  'kristoffer',
  'william',
  'andreas',
  'eirik',
  'magnus',
  'simen',
];

console.log('=== velo-brain Team Onboarding ===\n');

for (const name of team) {
  const token = 'vbrain_' + randomBytes(32).toString('hex');
  const hash = createHash('sha256').update(token).digest('hex');

  try {
    await sql`INSERT INTO access_tokens (name, token_hash) VALUES (${name}, ${hash})`;

    console.log(`--- ${name} ---`);
    console.log(`Token: ${token}`);
    console.log(`Install (Claude Code):`);
    console.log(`  claude mcp add velo-brain -- npx -y mcp-remote "${SERVER_URL}" --header "Authorization: Bearer ${token}"`);
    console.log('');
  } catch (e: any) {
    if (e.code === '23505') {
      console.log(`--- ${name} --- (already exists, skipping)`);
      console.log('');
    } else {
      throw e;
    }
  }
}

console.log('=== Test query ===');
console.log(`curl -sf ${SERVER_URL.replace('/mcp', '/health')}`);
console.log('');
console.log('=== All tokens created! ===');

await sql.end();
