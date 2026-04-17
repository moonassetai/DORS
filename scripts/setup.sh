#!/bin/bash
# =============================================================================
# DORS Paperclip Fleet Setup Script
# Run on MacBook Pro M5 — Joseph Moon's build machine
# Created: 2026-04-04
# =============================================================================

set -e

DORS_DIR="/Users/multivac/Documents/DORS/DORS-os"
MULTIVAC_DIR="/Users/multivac/Documents/MULTIVAC"
FLEET_SOURCE="$(cd "$(dirname "$0")" && pwd)"

echo "╔══════════════════════════════════════════════════╗"
echo "║  DORS Paperclip Fleet Setup                      ║"
echo "║  14 agents • 3 milestones • 60 issues            ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# ---------------------------------------------------------------------------
# Step 0: Preflight checks
# ---------------------------------------------------------------------------
echo "▸ Preflight checks..."

if [ ! -d "$DORS_DIR" ]; then
  echo "  ✗ DORS repo not found at $DORS_DIR"
  echo "    Create it: mkdir -p $DORS_DIR && cd $DORS_DIR && git init"
  exit 1
fi

if ! command -v node &> /dev/null; then
  echo "  ✗ Node.js not found. Install via: brew install node"
  exit 1
fi

if ! command -v pnpm &> /dev/null; then
  echo "  ⚠ pnpm not found. Installing..."
  npm install -g pnpm
fi

echo "  ✓ DORS repo exists"
echo "  ✓ Node.js $(node --version)"
echo "  ✓ pnpm $(pnpm --version 2>/dev/null || echo 'just installed')"
echo ""

# ---------------------------------------------------------------------------
# Step 1: Install Paperclip CLI (if not present)
# ---------------------------------------------------------------------------
echo "▸ Checking Paperclip CLI..."

if ! command -v paperclip &> /dev/null; then
  echo "  ⚠ Paperclip CLI not found."
  echo "  Attempting install: npm install -g @paperclip-ai/cli"
  npm install -g @paperclip-ai/cli || {
    echo "  ✗ Paperclip install failed."
    echo "  Will copy agent YAMLs manually instead."
    echo "  You can install Paperclip later and run: paperclip sync"
    PAPERCLIP_AVAILABLE=false
  }
else
  echo "  ✓ Paperclip $(paperclip --version 2>/dev/null)"
  PAPERCLIP_AVAILABLE=true
fi
echo ""

# ---------------------------------------------------------------------------
# Step 2: Copy agent configs to DORS repo
# ---------------------------------------------------------------------------
echo "▸ Copying agent configs to $DORS_DIR/.agents/"

mkdir -p "$DORS_DIR/.agents"
cp "$FLEET_SOURCE/.agents/"*.yml "$DORS_DIR/.agents/"

AGENT_COUNT=$(ls "$DORS_DIR/.agents/"*.yml 2>/dev/null | wc -l | tr -d ' ')
echo "  ✓ $AGENT_COUNT agent configs copied"
echo ""

# ---------------------------------------------------------------------------
# Step 3: Initialize Paperclip companies (if CLI available)
# ---------------------------------------------------------------------------
if [ "$PAPERCLIP_AVAILABLE" = true ]; then
  echo "▸ Initializing Paperclip companies..."

  # DORS company
  cd "$DORS_DIR"
  if [ ! -f ".paperclip/config.yml" ]; then
    echo "  Initializing DORS company..."
    paperclip init \
      --name "DORS" \
      --goal "Build and ship the DORS open-source AGI framework v0.1.0 MVP in 90 days" \
      --adapter "claude_local" \
      2>/dev/null || echo "  ⚠ paperclip init failed — may need interactive setup"
  else
    echo "  ✓ DORS company already initialized"
  fi

  # MULTIVAC company
  if [ -d "$MULTIVAC_DIR" ]; then
    cd "$MULTIVAC_DIR"
    if [ ! -f ".paperclip/config.yml" ]; then
      echo "  Initializing MULTIVAC company..."
      paperclip init \
        --name "MULTIVAC" \
        --goal "Build and maintain multivac.studio, the premium intelligence layer and public face of MULTIVAC" \
        --adapter "claude_local" \
        2>/dev/null || echo "  ⚠ paperclip init failed — may need interactive setup"
    else
      echo "  ✓ MULTIVAC company already initialized"
    fi
  fi
  echo ""

  # ---------------------------------------------------------------------------
  # Step 4: Activate Phase 1 agents only
  # ---------------------------------------------------------------------------
  echo "▸ Activating Phase 1 agents (budget: ~$280/mo)..."
  cd "$DORS_DIR"

  PHASE1_AGENTS=("HARI" "SELDON" "DANEEL" "DEMERZEL" "TREVIZE" "WANDA")
  for agent in "${PHASE1_AGENTS[@]}"; do
    echo "  Activating $agent..."
    paperclip activate "$agent" 2>/dev/null || echo "  ⚠ Could not activate $agent"
  done
  echo ""

  # ---------------------------------------------------------------------------
  # Step 5: Check status
  # ---------------------------------------------------------------------------
  echo "▸ Fleet status:"
  paperclip status 2>/dev/null || echo "  ⚠ Could not get status"
  echo ""

else
  echo "▸ Paperclip not available — manual setup mode"
  echo "  Agent YAMLs are in: $DORS_DIR/.agents/"
  echo "  When Paperclip is installed, run:"
  echo "    cd $DORS_DIR"
  echo "    paperclip init"
  echo "    paperclip activate HARI SELDON DANEEL DEMERZEL TREVIZE WANDA"
  echo ""
fi

# ---------------------------------------------------------------------------
# Step 6: Create GitHub labels (if gh CLI available)
# ---------------------------------------------------------------------------
echo "▸ Creating GitHub issue labels..."

if command -v gh &> /dev/null; then
  cd "$DORS_DIR"
  REPO=$(gh repo view --json nameWithOwner -q '.nameWithOwner' 2>/dev/null || echo "")

  if [ -n "$REPO" ]; then
    LABELS=(
      "phase-1:#0E8A16:Milestone 1 — Foundation"
      "phase-2:#1D76DB:Milestone 2 — Voice + Extensions"
      "phase-3:#D93F0B:Milestone 3 — Launch"
      "core:#5319E7:@dors/core package"
      "ext:#BFD4F2:@dors/ext package"
      "tui:#C5DEF5:@dors/tui package"
      "agent:#D4C5F9:@dors/agent package"
      "voice:#FBCA04:Voice pipeline"
      "cli:#E4E669:CLI commands"
      "infra:#0075CA:Infrastructure"
      "ci:#006B75:CI/CD"
      "test:#B60205:Testing"
      "security:#B60205:Security"
      "docs:#0075CA:Documentation"
      "design:#C2E0C6:Design/UX"
      "product:#D876E3:Product specs"
      "growth:#F9D0C4:Growth & marketing"
      "content:#FEF2C0:Content creation"
      "community:#C5DEF5:Community"
      "qa:#EDEDED:Quality assurance"
      "architecture:#5319E7:Architecture decisions"
      "P0:#B60205:Critical priority"
      "P1:#FBCA04:High priority"
    )

    for label_info in "${LABELS[@]}"; do
      IFS=':' read -r name color desc <<< "$label_info"
      gh label create "$name" --color "${color#\#}" --description "$desc" --force 2>/dev/null \
        && echo "  ✓ $name" \
        || echo "  ⚠ $name (may already exist)"
    done
  else
    echo "  ⚠ No GitHub remote found. Labels will need manual creation."
  fi
else
  echo "  ⚠ gh CLI not found. Install: brew install gh"
fi
echo ""

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
echo "╔══════════════════════════════════════════════════╗"
echo "║  Setup Complete                                  ║"
echo "╠══════════════════════════════════════════════════╣"
echo "║                                                  ║"
echo "║  Agents:  14 configs in .agents/                 ║"
echo "║  Issues:  60 total (see ISSUES.md)               ║"
echo "║  Phase 1: 6 agents active                        ║"
echo "║  Budget:  ~\$280/mo (Phase 1 only)               ║"
echo "║                                                  ║"
echo "║  Phase 1 agents:                                 ║"
echo "║    HARI (CEO) → SELDON (CTO) → DANEEL (Core)    ║"
echo "║    DEMERZEL (QA) → TREVIZE (Test) + WANDA (Sec)  ║"
echo "║                                                  ║"
echo "║  Next steps:                                     ║"
echo "║    1. Review .agents/*.yml configs               ║"
echo "║    2. Verify Paperclip is installed               ║"
echo "║    3. Run: paperclip status                      ║"
echo "║    4. Create GitHub issues from ISSUES.md        ║"
echo "║                                                  ║"
echo "╚══════════════════════════════════════════════════╝"
