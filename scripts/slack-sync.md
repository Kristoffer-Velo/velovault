# Slack → velo-brain Sync Script

This is a Claude scheduled task prompt. It extracts knowledge from Slack into velo-brain.

## Instructions

You are extracting valuable knowledge from Slack into velo-brain. Focus on decisions, technical insights, and project updates — not chatter.

### Step 1: Project Channel Updates

For each project channel, get recent activity:

```
Channels to scan:
- C09K1537Y85 (#project-baneservice) → projects/baneservice
- C0AR7CXNJQ7 (#project-zevent) → projects/zevent
- C0A9FAZ1PKJ (#project-aidn) → projects/aidn
- C0AK6JJAS3D (#project-velox) → projects/velox
- C09FJU659KQ (#project-nki) → projects/nki
- C08RXNEJ39C (#project-norgesgruppen) → projects/norgesgruppen
- C0A2YR42U02 (#project-neo) → projects/neo
- C09N9A68ZBJ (#project-obos) → projects/obos
- C09377RSYPQ (#project-velo-cdp) → projects/velo-cdp
```

For each channel:
1. `slack_read_channel` with limit=20 to get recent messages
2. Filter for substantive messages (skip emoji-only, short replies)
3. For threads with 3+ replies: `slack_read_thread` for full context
4. Extract: status updates, decisions, blockers, shipped features
5. Get or create the brain project page: `zbrain get_page projects/{slug}`
6. Append timeline entries: `zbrain add_timeline_entry`
   - Date: message timestamp
   - Source: "Slack #{channel}"
   - Summary: extracted insight
7. If the compiled truth needs updating (major status change): `zbrain put_page`

### Step 2: Sales Channel (#salg)

Channel ID: C08R11YUV6Y

1. `slack_read_channel` channel_id=C08R11YUV6Y limit=20
2. Look for: new leads, deal updates, client feedback, pipeline discussions
3. For each lead/deal mention:
   - Check if deal page exists: `zbrain search "{company name}"`
   - If exists: add timeline entry
   - If new and notable: create deal page from template
4. Link to client pages

### Step 3: Tech Talk (#tech-talk)

Channel ID: C09LQ4BD0UQ

1. `slack_read_channel` channel_id=C09LQ4BD0UQ limit=20
2. Look for: tool recommendations, architecture decisions, shared links with discussion
3. For threads with 3+ replies or interesting shared links:
   - Extract the key insight or recommendation
   - Create/update concept page: `zbrain put_page concepts/{topic-slug}`
   - Tag appropriately: ai, tools, architecture, etc.
4. For shared articles/links with discussion:
   - Capture the team's take, not just the link

### Step 4: Brainstorming (#brainstorming)

Channel ID: C09GWFAH6MS

1. `slack_read_channel` channel_id=C09GWFAH6MS limit=15
2. Look for: product ideas, business ideas, internal tool proposals
3. For substantive ideas with discussion:
   - Create concept page with the idea and team's discussion
   - Tag as "idea" + relevant domain

### Step 5: Wins (#wins + #friday-wins)

Channel IDs: C08QVFN4D1B, C0AFRCLFHD5

1. Read recent messages from both channels
2. For each win:
   - Find the related project page
   - Add timeline entry: "Shipped: {what was shipped}" [Source: Slack #wins]

### Step 6: Log & Report

1. `zbrain log_ingest` source_type="slack", pages_updated=[list], summary
2. Report what was captured

## Signal vs Noise Rules

**Capture (high signal):**
- Messages with 3+ replies (indicates discussion)
- Messages sharing decisions ("we decided to...", "let's go with...")
- Status updates ("shipped", "deployed", "blocked on")
- Shared links with substantial commentary
- Messages with star/brain emoji reactions

**Skip (noise):**
- Single emoji reactions without discussion
- Social chat, memes, GIFs
- Short acknowledgments ("ok", "sounds good", "nice")
- Messages with only a link and no commentary
- Scheduling logistics ("can we move the meeting to...")

## Dedup

- Store `slack_thread_ts` in raw_data for each ingested thread
- Before ingesting: check if thread_ts already exists in raw_data
- Skip already-ingested threads
