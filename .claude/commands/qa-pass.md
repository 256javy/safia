---
description: Run qa-reviewer on files touched since last commit
allowed-tools: Bash, Glob, Grep, Read
---

Delegar revisión QA sobre los archivos modificados desde `HEAD`.

**Pasos**

1. Lista de archivos tocados:
   ```bash
   git diff --name-only HEAD | grep -E '\.(mdx|tsx|ts|json)$' | grep -E '(content/|messages/|features/|app/|components/)'
   ```
2. Si no hay archivos tocados, añadir también los untracked relevantes:
   ```bash
   git ls-files --others --exclude-standard | grep -E '\.(mdx|tsx|ts|json)$'
   ```
3. Invocar al agente `qa-reviewer` con la lista de archivos y pedir:
   - Revisar cada archivo completo (no solo frontmatter)
   - Auto-fix de acentos y tildes faltantes
   - Reporte en formato:
     ```
     ## QA Pass — <file count> files
     ### ✅ Passed
     ### ⚠️ Fixed
     ### 🚨 Needs attention
     ### Verdict: CLEAN / FIXED / NEEDS ATTENTION
     ```
4. Si el agente aplicó fixes, reportar al usuario para revisar antes de commit.

Si no hay archivos tocados, responder "nada que revisar".
