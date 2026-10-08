---
title: Convenciones del vault
type: doc
project: siegfried
tags: [docs, conventions, frontmatter]
status: active
created: 2026-10-07
updated: 2026-10-08
---

## Estructura de carpetas

```
vault/
├── research/   # hallazgos de investigación generales (perfil, arquitectura)
├── private/    # investigación sobre empleadores específicos (alias "Employer A", "B"... — ver vault/private/employer-alias-map.md) — GITIGNORED,
│               # vive solo en disco local, nunca se sube al repo (ver vault/decisions/2026-10-07-private-vault-folder.md)
├── projects/   # specs y estado de cada proyecto (pool + siegfried mismo)
├── decisions/  # bitácora de decisiones técnicas, una por archivo, fecha en el nombre
└── docs/       # esta carpeta — documentación de cómo funciona Siegfried mismo
```

## Qué va en `private/`

Cualquier nota que investigue a un empleador específico (su stack, sus vacantes, estrategia de entrevista) — no porque sea secreto, sino porque es información de búsqueda de empleo personal que no pertenece en el historial de un repo, ni siquiera privado. Todo lo demás (arquitectura, perfil propio, decisiones técnicas) sigue en el resto del vault y sí se versiona.

## Frontmatter obligatorio

```yaml
---
title: <nombre legible>
type: research | project | decision | doc
project: <slug del proyecto al que pertenece, o "siegfried">
tags: [lista, de, tags]
status: active | in-progress | final | archived
created: YYYY-MM-DD
updated: YYYY-MM-DD
source_urls:          # opcional, solo si type: research
  - https://...
---
```

`type` y `project` son los dos campos que el indexador RAG usa para filtrar búsquedas (p. ej. "solo notas de type:research sobre project:lura-acoustic-viewer").

## Enlaces entre notas

`[[nombre-de-archivo-sin-extension]]` — igual que el sistema de memoria. El indexador los resuelve a links reales en el dashboard; una nota enlazada que todavía no existe no es un error, es una nota pendiente de escribir.

## Cuándo añadir una nota aquí vs. en el repo de un proyecto satélite

- Vault de Siegfried: todo lo que es investigación, decisión o contexto *compartido* entre proyectos, o sobre Siegfried mismo.
- Repo del proyecto satélite: todo lo que es específico de ESE proyecto una vez empieza a construirse (su propio README, su propia carpeta `docs/` si la necesita, su código).

Esta carpeta (`docs/`) se va completando a medida que Siegfried crece. Ver [[rag-indexing]] para cómo funciona el indexador RAG, y [[satellite-engineering-patterns]] para los patrones técnicos y de diseño que se repiten entre proyectos satélite (Cache Components, sidebars plegables, datos precalculados, trampas de lint, benchmark de identidad visual).
