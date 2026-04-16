---
description: Full pre-ship checklist — lint, manifest, build, security audit
allowed-tools: Bash, Read, Grep, Glob
---

Ejecutar la secuencia completa de verificación antes de commit/deploy.

**Pasos en orden (si uno falla, detener y reportar)**

1. **Manifest actualizado**
   ```bash
   pnpm generate-manifest
   ```
   Verificar que no quedaron diffs inesperados en `content/manifest.json`.

2. **Lint clean**
   ```bash
   pnpm lint
   ```

3. **TypeScript strict**
   ```bash
   pnpm build
   ```
   Debe pasar sin errores. Watch out for warnings inusuales.

4. **Simulator security audit** — correr el equivalente a `/sim-check`:
   - `grep -rnE 'fetch\(|axios|XMLHttpRequest|node-fetch' features/simulator/` debe dar vacío
   - `grep -rn "SUPABASE_SERVICE_ROLE_KEY" --include='*.tsx' --include='*.ts' app/ features/ components/ stores/` debe dar vacío

5. **Delegar al agente `security-reviewer`** para veredicto final.

**Reporte**

```
## Ship-Ready Check — <timestamp>

✅ / ❌ Manifest generated
✅ / ❌ Lint
✅ / ❌ Build
✅ / ❌ Simulator audit
✅ / ❌ Security reviewer verdict

## Verdict: SHIP IT / BLOCKED (reason)
```

Si el veredicto es BLOCKED, enumerar pasos concretos para desbloquear.
