---
description: Run full simulator security audit (preventDefault, network calls, banner, noindex)
allowed-tools: Bash, Grep, Read
---

Ejecuta la auditoría de seguridad del simulador definida en el agente `security-reviewer`. No delegues al agente — ejecuta tú los greps directamente y reporta.

**Checks obligatorios**

1. **Zero network calls en simulator**
   ```bash
   grep -rnE 'fetch\(|axios|XMLHttpRequest|node-fetch|navigator\.sendBeacon|new\s+WebSocket\(|new\s+EventSource\(' features/simulator/ || echo "OK: no network calls"
   ```

2. **preventDefault en todos los form handlers**
   ```bash
   grep -rn "onSubmit\|handleSubmit\|handleNext" features/simulator/
   grep -rn "preventDefault" features/simulator/
   ```
   Cada handler debe tener al menos un `e.preventDefault()`.

3. **TrainingBanner triple-redundante**
   ```bash
   grep -rn "TrainingBanner\|practice-banner\|setInterval" features/simulator/
   ```
   Deben existir: componente React + clase CSS + setInterval 2s.

4. **noindex en simulator pages**
   ```bash
   grep -rn "robots\|noindex" 'app/[locale]/simulator/'
   ```
   Debe aparecer `robots: { index: false }` en cada `page.tsx`.

5. **CSP frame-ancestors none**
   ```bash
   grep -A5 "Content-Security-Policy" next.config.ts | grep "frame-ancestors"
   ```

6. **SUPABASE_SERVICE_ROLE_KEY no en client**
   ```bash
   grep -rn "SUPABASE_SERVICE_ROLE_KEY" --include='*.tsx' --include='*.ts' app/ features/ components/ stores/
   ```
   Output debe ser vacío.

**Reporte**

Formato:
```
## Simulator Security Audit — $(date +%Y-%m-%d)

### ✅ Passed
- ...

### 🚨 Blockers
- ...

### Verdict: APPROVED / BLOCKED
```

Si hay cualquier blocker, termina con exit-style `BLOCKED` y enumera qué corregir.
