# Cortex Sync — conventions & corrections → velo-brain

This is a Claude scheduled task prompt. It syncs conventions and corrections from the repo into velo-brain so `/boot` can find them.

## Instructions

You are syncing the cortex (conventions + corrections) into velo-brain. These are the rules and structural fixes that get loaded at every session start via `/boot`.

### Step 1: Read repo conventions

Read all files in `content/conventions/`:

```
Glob pattern: content/conventions/*.md
```

For each file:
1. Read the file content (frontmatter + body)
2. Extract the slug from filename: `conventions/{filename-without-extension}`
3. Check if page exists in brain: `velo-brain get_page slug="conventions/{slug}"`
4. Compare content — if changed or new, write to brain:
   ```
   velo-brain put_page slug="conventions/{slug}" content="{full file content}"
   ```
5. Create back-links if the convention references other entities

### Step 2: Read repo corrections

Read all files in `content/corrections/`:

```
Glob pattern: content/corrections/*.md
```

Same process as conventions:
1. Read file content
2. Slug: `corrections/{filename-without-extension}`
3. Check if exists, compare, write if changed
4. If the correction has a `corrects:` field in frontmatter, create a link:
   ```
   velo-brain add_link from="corrections/{slug}" to="{corrects-slug}" link_type="corrects"
   ```

### Step 3: Clean up removed entries

1. List all brain pages with type convention: `velo-brain search "type:convention"`
2. List all brain pages with type correction: `velo-brain search "type:correction"`
3. For each brain page, check if matching file exists in repo
4. If a brain page has no matching repo file, it was intentionally removed — delete it:
   ```
   velo-brain delete_page slug="{slug}"
   ```

### Step 4: Log ingestion

```
velo-brain log_ingest
  source_type="cortex-sync"
  source_ref="velovault/content/conventions + corrections"
  pages_updated=[list of updated slugs]
  summary="Synced {N} conventions, {M} corrections to brain"
```

## Important

- Repo (`content/`) is source of truth for cortex content
- Brain is the runtime store that `/boot` reads from
- If a convention exists only in brain (not in repo), it should be deleted — all cortex content must be version-controlled
- Always preserve frontmatter exactly as written — `type`, `severity`, `activates`, `created` fields are critical for `/boot`
