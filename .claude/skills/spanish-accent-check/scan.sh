#!/usr/bin/env bash
# Scan for common missing-accent Spanish patterns.
# Usage: scan.sh [path ...]
# Exit 0 always — diagnostic only.

set -u

TARGETS=("$@")
if [ ${#TARGETS[@]} -eq 0 ]; then
  TARGETS=("content/" "messages/")
fi

PATTERN='\bcontrasena[s]?\b|\bAutenticacion\b|\bautenticacion\b|\binformacion\b|\bInformacion\b|\bconfiguracion\b|\bConfiguracion\b|\bpagina\b|\bPagina\b|\bmodulo[s]?\b|\bModulo[s]?\b|\bleccion\b|\bLeccion\b|\bproxima\b|\bProxima\b|\bultima\b|\bUltima\b|\brapido\b|\bRapido\b|\bfacil\b|\bFacil\b|\bdificil\b|\bDificil\b|\bpublico\b|\bPublico\b|\btecnico\b|\bTecnico\b|\bnumero[s]?\b|\bNumero[s]?\b|\belectronico\b|\bElectronico\b|\btambien\b|\bTambien\b|\bademas\b|\bAdemas\b|\bdespues\b|\bDespues\b|\baqui\b|\bAqui\b|\bahi\b'

echo "Spanish accent scan over: ${TARGETS[*]}"
echo "---"

HITS=0
for target in "${TARGETS[@]}"; do
  if [ ! -e "$target" ]; then
    echo "(skip: $target does not exist)"
    continue
  fi
  MATCHES=$(grep -rnE "$PATTERN" "$target" \
    --include='*.mdx' --include='*.json' --include='*.tsx' --include='*.ts' \
    2>/dev/null || true)
  if [ -n "$MATCHES" ]; then
    echo "$MATCHES"
    HITS=$((HITS + $(echo "$MATCHES" | wc -l)))
  fi
done

echo "---"
if [ $HITS -eq 0 ]; then
  echo "✅ No missing-accent patterns found."
else
  echo "⚠️  $HITS potential missing accents — verify in context (some may be intentional, e.g. proper names)."
fi
exit 0
