# Confidence Decay — ukentlig kvalitetssjekk

This is a Claude scheduled task prompt. It scans brain pages and downgrades confidence scores based on age since last verification.

## Instructions

You are running the weekly confidence decay check. Pages with stale data get downgraded so `/boot` and teamet vet hva som trenger oppmerksomhet.

### Step 1: Scan all pages

Query brain for all entity pages:

```
velo-brain search "type:project"
velo-brain search "type:client"
velo-brain search "type:person"
velo-brain search "type:deal"
velo-brain search "type:meeting"
```

For each page returned:
1. `velo-brain get_page slug="{slug}"` to read full content
2. Parse frontmatter for `confidence` and `last_verified`

### Step 2: Apply decay rules

Today's date: use current date.

**Decay logic:**
- If `last_verified` is missing → set `confidence: low`, add `last_verified: {today}` (bootstrapping)
- If `last_verified` > 90 days ago AND `confidence` != `low` → downgrade to `low`
- If `last_verified` > 30 days ago AND `confidence` == `high` → downgrade to `medium`
- If `last_verified` <= 30 days → no change

**Exception:** Meeting pages older than 30 days should NOT be downgraded — meetings are historical records, not living data. Skip meetings with `date:` in the past.

### Step 3: Update downgraded pages

For each page that needs downgrading:
1. Read current content: `velo-brain get_page slug="{slug}"`
2. Update only the frontmatter fields `confidence` and add a timeline entry
3. Write back: `velo-brain put_page slug="{slug}" content="{updated content}"`
4. Add timeline entry:
   ```
   velo-brain add_timeline_entry
     slug="{slug}"
     date="{today}"
     summary="Confidence downgraded to {new_level} — last verified {last_verified}, {N} days ago"
     source="confidence-decay"
   ```

### Step 4: Compile report

After scanning all pages, produce a summary:

```
## Confidence Decay Report — {today}

### Downgraded
- {slug}: high → medium (35 days since verification)
- {slug}: medium → low (92 days since verification)

### Already Low (needs attention)
- {slug}: low since {last_verified} ({N} days)
- ...

### Stats
- Total pages scanned: {N}
- High confidence: {N} ({%})
- Medium confidence: {N} ({%})
- Low confidence: {N} ({%})
- Downgraded this run: {N}
```

### Step 5: Log

```
velo-brain log_ingest
  source_type="confidence-decay"
  source_ref="scheduled-weekly"
  pages_updated=[list of downgraded slugs]
  summary="Scanned {total} pages. Downgraded {N}. {low_count} pages at low confidence."
```

## Escalation

If more than 50% of pages are at low confidence, add a timeline entry to the brain health page:
```
velo-brain add_timeline_entry
  slug="meta/brain-health"
  date="{today}"
  summary="WARNING: {%} of pages at low confidence. Bulk verification needed."
  source="confidence-decay"
```

## Important

- NEVER upgrade confidence automatically — only humans or verified ingestion can upgrade
- Decay is one-directional: high → medium → low
- Ingestion jobs (notion-sync, slack-sync etc.) should set `last_verified: {today}` when they confirm data matches source
- This job only DOWNGRADES and REPORTS — it does not fix stale content
