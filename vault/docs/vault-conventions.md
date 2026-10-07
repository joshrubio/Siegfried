---
title: Convenciones del vault
type: doc
project: siegfried
tags: [docs, conventions, frontmatter]
status: active
created: 2026-10-07
updated: 2026-10-07
---

## Estructura de carpetas

```
vault/
├── research/   # hallazgos de investigación (empresa, productos, vacantes, perfil)
├── projects/   # specs y estado de cada proyecto (pool + siegfried mismo)
├── decisions/  # bitácora de decisiones técnicas, una por archivo, fecha en el nombre
└── docs/       # esta carpeta — documentación de cómo funciona Siegfried mismo
```

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

Esta carpeta (`docs/`) se va completando a medida que Siegfried crece — el siguiente documento a escribir es cómo funciona el indexador RAG en cuanto exista (`apps/dashboard` + script de indexado).
