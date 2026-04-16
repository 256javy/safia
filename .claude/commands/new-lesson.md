---
description: Scaffold a new MDX lesson under content/modules/<module>/lessons/
argument-hint: <module-slug> <order> <locale>
allowed-tools: Read, Write, Bash, Glob, Grep, TaskCreate, TaskUpdate, SendMessage
---

Crear una nueva lección de Safia siguiendo el schema del content-writer.

**Argumentos**
- Módulo: `$1` (ej. `passwords`, `phishing`, `mfa`, `simulators`, `wifi`, `social-media`, `pass-manager`, `device-security`)
- Orden: `$2` (número entero, secuencial dentro del módulo)
- Locale: `$3` (`es`, `en`, o `pt` — default es `es`)

**Pasos**
1. Verificar que el módulo existe en `content/modules/$1/`. Si no existe, abortar.
2. Leer lecciones existentes para entender el estilo y no duplicar temas.
3. Delegar la creación al agente `content-writer` con instrucciones claras:
   - Target: `content/modules/$1/lessons/lesson-$2.$3.mdx`
   - Tono: cercano, analogías, cero jerga
   - Incluir: frontmatter (title, description, xp_reward, order: $2, quiz con 3 preguntas), al menos 1 `<TipBox>`, al menos 1 `<PromptButton>`, 400-600 palabras
4. Tras la escritura, correr `pnpm generate-manifest` (el hook lo hace automático, pero lanzar sincrónico para verificar).
5. Invocar `qa-reviewer` sobre el archivo creado.
6. Reportar al usuario: path del archivo, recuento de palabras, y link a la lección en el manifest.

Si falta algún argumento, pedirlo antes de proceder.
