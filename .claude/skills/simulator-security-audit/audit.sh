#!/usr/bin/env bash
# Safia simulator security audit — single source of truth.
# Exit 0 on PASS, 1 if any blocker.

set -u

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$PROJECT_ROOT"

pass() { echo "✅ $1"; }
fail() { echo "🚨 $1"; FAILED=1; }

FAILED=0

# 1. No network APIs in simulator
if grep -rnE 'fetch\(|\baxios\b|XMLHttpRequest|node-fetch|navigator\.sendBeacon|new[[:space:]]+WebSocket\(|new[[:space:]]+EventSource\(' features/simulator/ >/dev/null 2>&1; then
  fail "network-calls — forbidden API used in features/simulator/:"
  grep -rnE 'fetch\(|\baxios\b|XMLHttpRequest|node-fetch|navigator\.sendBeacon|new[[:space:]]+WebSocket\(|new[[:space:]]+EventSource\(' features/simulator/ || true
else
  pass "network-calls        no matches in features/simulator/"
fi

# 2. preventDefault on form handlers
SUBMIT_COUNT=$(grep -rn 'onSubmit\|handleSubmit\|handleNext' features/simulator/ | wc -l)
PD_COUNT=$(grep -rn 'preventDefault' features/simulator/ | wc -l)
if [ "$PD_COUNT" -gt 0 ]; then
  pass "preventDefault       $PD_COUNT occurrences across $SUBMIT_COUNT submit handlers"
else
  fail "preventDefault       no preventDefault() found in features/simulator/"
fi

# 3. TrainingBanner usage
if grep -rq 'TrainingBanner' features/simulator/; then
  pass "training-banner      TrainingBanner present"
else
  fail "training-banner      missing in features/simulator/"
fi

# 4. noindex on simulator pages
NOINDEX_COUNT=$(grep -rn 'robots' 'app/[locale]/simulator/' 2>/dev/null | grep -ci 'index.*false\|noindex' || true)
if [ "$NOINDEX_COUNT" -gt 0 ]; then
  pass "noindex              $NOINDEX_COUNT simulator pages have robots.index=false"
else
  fail "noindex              no robots metadata blocking indexing on simulator pages"
fi

# 5. CSP frame-ancestors none
if grep -q "frame-ancestors 'none'" next.config.ts; then
  pass "csp-frame-ancestors  frame-ancestors 'none' set"
else
  fail "csp-frame-ancestors  missing from next.config.ts"
fi

# 6. Service role key isolation
LEAKS=$(grep -rln 'SUPABASE_SERVICE_ROLE_KEY' --include='*.ts' --include='*.tsx' app/ features/ components/ stores/ 2>/dev/null || true)
if [ -z "$LEAKS" ]; then
  pass "service-role-key     isolated (only in lib/supabase/server.ts)"
else
  fail "service-role-key     LEAKED in:"
  echo "$LEAKS"
fi

# 7. JWT payload discipline
if grep -qE 'session\.user\s*=\s*\{[[:space:]]*id:' lib/auth/auth.ts; then
  pass "jwt-payload          session.user = { id: ... } (no PII)"
else
  fail "jwt-payload          lib/auth/auth.ts session callback may expose PII"
fi

echo ""
if [ $FAILED -eq 0 ]; then
  echo "### Verdict: APPROVED"
  exit 0
else
  echo "### Verdict: BLOCKED"
  exit 1
fi
