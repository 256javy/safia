---
name: spanish-accent-check
description: Scans Spanish content (MDX, JSON, TSX) for common missing-accent patterns and Spanish orthography errors. Use after any content-writer change, before marking a lesson complete, or when reviewing messages/es.json. Surfaces contraseña, información, autenticación, configuración, módulo, lección, página, próxima, última, rápido, fácil, técnico, número, electrónico, también, además, después, aquí, está, cómo, qué, cuándo, dónde, quién, etc.
allowed-tools: Bash, Grep, Read
---

# Spanish Accent Check

Zero missing-accents policy for anything user-visible. A missing "ñ" or lost tilde erodes professional trust with the non-technical audience.

## Run the scan

```bash
bash ${CLAUDE_SKILL_DIR}/scan.sh
```

Output is grouped by file with line-level matches. Exit 0 always (this is diagnostic).

## Word list covered

Nouns: contrasena(s), autenticacion, informacion, configuracion, pagina, modulo, leccion, numero, electronico, tecnico, publico.

Adjectives / adverbs: proxima, ultima, rapido, facil, dificil, tambien, ademas, despues, aqui, ahi.

Verbs & question words (context-dependent): esta → está; mas → más; como/que/cuando/donde/quien → add accent when used as interrogative or exclamative.

## Limitations

- Does not distinguish `como` (as) from `cómo` (how) — flags all, user decides.
- Does not check `solo` / `sólo` (modern RAE accepts both).
- Does not verify ¿/¡ opening punctuation — that's a separate rule.

## Recommended usage

```bash
# After editing a lesson
bash ${CLAUDE_SKILL_DIR}/scan.sh content/modules/passwords/lessons/
# Before merge
bash ${CLAUDE_SKILL_DIR}/scan.sh content/ messages/
```
