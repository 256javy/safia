---
description: Print current Safia sprint progress (lessons per module vs target)
allowed-tools: Bash, Read
---

Mostrar el estado actual del sprint de contenido.

**Pasos**

1. Ejecutar el hook de contexto para obtener la tabla:
   ```bash
   echo '{}' | python3 .claude/hooks/sprint-context.py | python3 -c "import json,sys; print(json.load(sys.stdin)['hookSpecificOutput']['additionalContext'])"
   ```
2. Adicionalmente, listar los módulos que tienen lecciones faltantes y sugerir con cuál continuar (el módulo con menos lecciones por hacer pero mayor prioridad según CLAUDE.md §Sprint Backlog).
3. Si todos están completos, sugerir pasar a la siguiente fase (legal pages, settings, CI badges).

Reportar la tabla y la sugerencia en formato compacto.
