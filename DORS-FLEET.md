# DORS Paperclip Agent Fleet

> 14 agents. 3 milestones. 90 days to ship.
> All agent names in ALL CAPS. Always. Non-negotiable.

## Org Chart

```
                    Joseph Moon (Board)
                         │
                       HARI
                    CEO / Architect
                    (Opus, $50/mo)
                         │
          ┌──────────────┼──────────────┬──────────────┐
          │              │              │              │
       SELDON          BALEY        DEMERZEL        BLISS
        CTO          Product          QA           Growth
    (Opus, $80)    (Sonnet, $30)  (Sonnet, $40)  (Sonnet, $20)
          │              │              │              │
    ┌─────┼─────┐    ┌───┴───┐    ┌────┴────┐    ┌───┴───┐
    │     │     │    │       │    │         │    │       │
 DANEEL GISKARD FASTOLFE GLADIA PELORAT TREVIZE WANDA  NOVI  ARKADY
  Core   Voice   Ext    UX     Docs    Test    Sec   Comm  Content
 (Opus) (Son)   (Son)  (Son)  (Son)   (Son)  (Son) (Haiku) (Son)
  $80    $30    $40    $20    $15     $30    $20    $10    $15
```

## Budget Summary

### Phase 1 (Days 1-30) — 6 agents active
| Agent | Model | Budget/mo |
|-------|-------|-----------|
| HARI | Opus | $50 |
| SELDON | Opus | $80 |
| DANEEL | Opus | $80 |
| DEMERZEL | Sonnet | $40 |
| TREVIZE | Sonnet | $30 |
| WANDA | Sonnet | $20 |
| **Phase 1 Total** | | **$300/mo** |

### Phase 2 (Days 31-60) — add 4 agents
| Agent | Model | Budget/mo |
|-------|-------|-----------|
| GISKARD | Sonnet | $30 |
| FASTOLFE | Sonnet | $40 |
| BALEY | Sonnet | $30 |
| GLADIA | Sonnet | $20 |
| **Phase 2 Additional** | | **$120/mo** |
| **Cumulative Total** | | **$420/mo** |

### Phase 3 (Days 61-90) — add 4 agents
| Agent | Model | Budget/mo |
|-------|-------|-----------|
| BLISS | Sonnet | $20 |
| PELORAT | Sonnet | $15 |
| NOVI | Haiku | $10 |
| ARKADY | Sonnet | $15 |
| **Phase 3 Additional** | | **$60/mo** |
| **Full Fleet Total** | | **$480/mo** |

## Agent Registry

| # | Agent | Role | Model | Reports To | Phase | Heartbeat |
|---|-------|------|-------|------------|-------|-----------|
| 1 | HARI | CEO / Chief Architect | Opus | Board | 1 | 4h |
| 2 | SELDON | CTO | Opus | HARI | 1 | 2h |
| 3 | DANEEL | Core Engineer | Opus | SELDON | 1 | 1h |
| 4 | GISKARD | Voice Engineer | Sonnet | SELDON | 2 | 4h |
| 5 | FASTOLFE | Extension Engineer | Sonnet | SELDON | 2 | 4h |
| 6 | BALEY | Head of Product | Sonnet | HARI | 2 | 6h |
| 7 | GLADIA | UX/Design | Sonnet | BALEY | 2 | 8h |
| 8 | PELORAT | Documentation Writer | Sonnet | BALEY | 3 | 12h |
| 9 | DEMERZEL | Head of QA | Sonnet | HARI | 1 | 3h |
| 10 | TREVIZE | Test Engineer | Sonnet | DEMERZEL | 1 | 2h |
| 11 | WANDA | Security Auditor | Sonnet | DEMERZEL | 1 | 8h |
| 12 | BLISS | Head of Growth | Sonnet | HARI | 3 | 12h |
| 13 | NOVI | Community Manager | Haiku | BLISS | 3 | 24h |
| 14 | ARKADY | Content Creator | Sonnet | BLISS | 3 | 24h |

## Asimov Character Map

Every agent is named after an Isaac Asimov character. This is deliberate.

| Agent | Character | Source | Why This Role |
|-------|-----------|--------|---------------|
| HARI | Hari Seldon | Foundation | The architect who sees the future |
| SELDON | (same lineage) | Foundation | Psychohistory = system design |
| DANEEL | R. Daneel Olivaw | Robot series | The greatest robot ever built |
| GISKARD | R. Giskard Reventlov | Robot series | The telepathic robot (voice = telepathy) |
| FASTOLFE | Dr. Han Fastolfe | Robot series | The greatest roboticist (extensions = creation) |
| BALEY | Elijah Baley | Robot series | The detective who sees what others miss |
| GLADIA | Gladia Delmarre | Robot series | Beautiful, bold, boundary-pushing |
| PELORAT | Janov Pelorat | Foundation | The quiet scholar who knew everything |
| DEMERZEL | Eto Demerzel | Foundation | The hidden hand ensuring everything runs |
| TREVIZE | Golan Trevize | Foundation | Always makes the right decision |
| WANDA | Wanda Seldon | Foundation | The mentalic who senses danger |
| BLISS | Bliss | Foundation | Voice of Gaia, connected to everything |
| NOVI | Sura Novi | Foundation | Humble, hardworking, connects people |
| ARKADY | Arkady Darrell | Foundation | Young revolutionary who changed history |

## Package Ownership

```
@dors/ai     → DANEEL (build) + SELDON (review)
@dors/core   → DANEEL (build) + SELDON (review) + WANDA (security)
@dors/tui    → DANEEL (build) + GLADIA (design) + BALEY (spec)
@dors/agent  → DANEEL (build) + SELDON (review)
@dors/ext    → FASTOLFE (build) + SELDON (review) + WANDA (security)
dors-ext-voice → GISKARD (build) + TREVIZE (test)
apps/cli     → DANEEL (build) + BALEY (spec) + GLADIA (UX)
docs/        → PELORAT (write) + BALEY (review)
.github/     → TREVIZE (CI) + DEMERZEL (oversight)
```

## Milestones

### Milestone 1: Foundation (Days 1-30)
**Goal:** Working CLI that chats with Ollama locally.
**Active agents:** HARI, SELDON, DANEEL, DEMERZEL, TREVIZE, WANDA
**Issues:** 21 (14 P0, 7 P1)
**Success criteria:** `npx dors chat` works with Ollama on Mac

### Milestone 2: Voice + Extensions (Days 31-60)
**Goal:** Extension system works, voice extension demos.
**Active agents:** + GISKARD, FASTOLFE, BALEY, GLADIA
**Issues:** 16 (9 P0, 7 P1)
**Success criteria:** `dors-ext-voice` extension loads and handles STT/TTS

### Milestone 3: Launch (Days 61-90)
**Goal:** Ship v0.1.0 publicly. README, docs, launch copy ready.
**Active agents:** + BLISS, PELORAT, NOVI, ARKADY (full fleet)
**Issues:** 15 (10 P0, 5 P1)
**Success criteria:** Published on npm, Product Hunt submitted, 100+ GitHub stars

## File Structure

```
dors-fleet/
├── .agents/
│   ├── hari.yml          # CEO / Chief Architect
│   ├── seldon.yml        # CTO
│   ├── daneel.yml        # Core Engineer
│   ├── giskard.yml       # Voice Engineer
│   ├── fastolfe.yml      # Extension Engineer
│   ├── baley.yml         # Head of Product
│   ├── gladia.yml        # UX/Design
│   ├── pelorat.yml       # Documentation Writer
│   ├── demerzel.yml      # Head of QA
│   ├── trevize.yml       # Test Engineer
│   ├── wanda.yml         # Security Auditor
│   ├── bliss.yml         # Head of Growth
│   ├── novi.yml          # Community Manager
│   └── arkady.yml        # Content Creator
├── DORS-FLEET.md         # This file
├── ISSUES.md             # All 60 issues across milestones
└── setup.sh              # One-command Mac setup script
```

## How to Deploy

```bash
# On your MacBook Pro M5:
cd /Users/multivac/Documents/MULTIVAC/dors-fleet
chmod +x setup.sh
./setup.sh
```

The script will:
1. Verify DORS repo and dependencies exist
2. Install Paperclip CLI (if not present)
3. Copy all 14 agent YAMLs to DORS/.agents/
4. Initialize Paperclip companies (DORS + MULTIVAC)
5. Activate Phase 1 agents only ($300/mo)
6. Create GitHub issue labels

## Rules

- ALL AI names in ALL CAPS. Humans in normal case.
- DORS = open source, MIT license, free forever
- MULTIVAC = closed source, premium layer
- Three Laws govern everything. NEVER military use.
- Phase 1 agents first. Scale up at milestones.
- Joseph reviews everything. No auto-commits.
