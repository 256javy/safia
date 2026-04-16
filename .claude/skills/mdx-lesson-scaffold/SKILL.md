---
name: mdx-lesson-scaffold
description: Provides the canonical template and schema for creating a new MDX lesson in Safia. Use when creating or reviewing a lesson under content/modules/<module>/lessons/ — covers frontmatter (title, description, xp_reward, order, quiz with 3 questions), body structure (opening analogy, explanation, practical steps, TipBox, PromptButton), tone rules (plain language, no jargon, 400-600 words), and locale file naming (lesson-N.es.mdx).
allowed-tools: Read, Write, Bash
---

# MDX Lesson Scaffold

Canonical structure for every Safia lesson. The target reader is a non-technical 60-year-old office worker who uses a phone and computer daily but has never heard "phishing".

## Frontmatter schema

```yaml
---
title: "Título de la lección"        # Spanish, correctly accented
description: "1 línea, con acento."   # Used in catalog
xp_reward: 100                         # 50-150 typical
order: 1                               # 1-based, unique per module
quiz:
  - question: "¿Pregunta con cierre?"
    options:
      - "Opción A"
      - "Opción B"
      - "Opción C"
    correct: 0                         # 0-based index
    explanation: "Por qué es correcta, en tono amable."
  - question: "..."
    options: ["...", "...", "..."]
    correct: 1
    explanation: "..."
  - question: "..."
    options: ["...", "...", "..."]
    correct: 2
    explanation: "..."
---
```

## Body structure

1. **Apertura (1 párrafo, analogía o escenario real).** "Imagina que recibes una carta que parece ser del banco…"
2. **Explicación (2-3 párrafos).** Lenguaje plano, frases cortas, verbo activo.
3. **Pasos prácticos o señales (lista con viñetas).** Acciones que el lector puede hacer ahora mismo.
4. **`<TipBox type="consejo">`** con un consejo accionable.
5. **(Opcional)** `<TipBox type="analogia">` o `<TipBox type="mito-vs-realidad">`.
6. **`<PromptButton prompt="..." />`** invitando a profundizar con IA.
7. **Cierre corto** que conecta con la siguiente lección.

**Longitud:** 400-600 palabras. Si supera 700, fragmentar en dos lecciones.

## File naming

```
content/modules/<module-slug>/lessons/lesson-<order>.<locale>.mdx
```

- `<module-slug>`: `passwords | phishing | mfa | simulators | wifi | social-media | pass-manager | device-security`
- `<order>`: entero 1..N dentro del módulo
- `<locale>`: `es` (primario) → luego `en` → luego `pt`

## Canonical example

Ver `${CLAUDE_SKILL_DIR}/example.mdx` (plantilla rellenable).

## After writing

1. `pnpm generate-manifest` (lo hace el hook automáticamente, pero validar que no haya error)
2. Invocar `qa-reviewer` sobre el archivo creado
3. Si hay versiones `.en.mdx` o `.pt.mdx`, mantenerlas en paridad estructural
