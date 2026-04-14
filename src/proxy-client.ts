#!/usr/bin/env bun
/**
 * velo-brain MCP proxy — compiled standalone binary.
 * Bridges stdio (Claude Desktop / Claude Code) ↔ HTTP (velo-brain Railway server).
 *
 * Reads VELO_BRAIN_TOKEN from env or ~/.velo-brain/token file.
 * Server URL defaults to production Railway.
 *
 * Build:
 *   bun build --compile --target=bun-darwin-arm64 --outfile dist/velo-brain-mcp-darwin-arm64 src/proxy-client.ts
 *   bun build --compile --target=bun-darwin-x64 --outfile dist/velo-brain-mcp-darwin-x64 src/proxy-client.ts
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const DEFAULT_URL = 'https://skillful-reflection-production-688c.up.railway.app/mcp';

function loadToken(): string {
  if (process.env.VELO_BRAIN_TOKEN) return process.env.VELO_BRAIN_TOKEN;
  try {
    return readFileSync(join(homedir(), '.velo-brain', 'token'), 'utf-8').trim();
  } catch {
    process.stderr.write('Error: No token found. Set VELO_BRAIN_TOKEN env var or create ~/.velo-brain/token\n');
    process.exit(1);
  }
}

const TOKEN = loadToken();
const URL = process.env.VELO_BRAIN_URL || DEFAULT_URL;

let sessionId: string | null = null;

let buffer = '';
process.stdin.setEncoding('utf-8');
process.stdin.on('data', (data: string) => {
  buffer += data;
  let idx: number;
  while ((idx = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (line) handleMessage(line);
  }
});
process.stdin.resume();

async function handleMessage(line: string) {
  let msg: any;
  try {
    msg = JSON.parse(line);
  } catch {
    return;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`,
    'Accept': 'application/json, text/event-stream',
  };
  if (sessionId) {
    headers['Mcp-Session-Id'] = sessionId;
  }

  try {
    const res = await fetch(URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(msg),
    });

    const sid = res.headers.get('mcp-session-id');
    if (sid) sessionId = sid;

    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('text/event-stream')) {
      const text = await res.text();
      const lines = text.split('\n');
      for (const l of lines) {
        if (l.startsWith('data:')) {
          const jsonStr = l.slice(5).trim();
          if (jsonStr) {
            process.stdout.write(jsonStr + '\n');
          }
        }
      }
    } else {
      const text = await res.text();
      if (text.trim()) {
        process.stdout.write(text.trim() + '\n');
      }
    }
  } catch (e: any) {
    const err = JSON.stringify({
      jsonrpc: '2.0',
      error: { code: -32000, message: `Connection error: ${e.message}` },
      id: msg.id ?? null,
    });
    process.stdout.write(err + '\n');
  }
}
