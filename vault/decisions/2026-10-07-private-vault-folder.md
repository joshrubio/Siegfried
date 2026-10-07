---
title: Decisión — vault/private/ gitignored para investigación de empleadores
type: decision
project: siegfried
tags: [privacy, gitignore, vault]
status: final
created: 2026-10-07
updated: 2026-10-07
---

## Decisión

Toda investigación sobre un empleador específico (Helsing, y cualquier futuro) vive en `vault/private/`, que está en `.gitignore`. Permanece en disco para seguir navegándola localmente y que el dashboard la siga mostrando, pero nunca se sube al repo de Siegfried.

## Por qué

No es información clasificada ni sensible en sentido legal — es investigación de búsqueda de empleo personal (estrategia de entrevista, lectura de vacantes, notas sobre un reclutador). No pertenece al historial de un repo de portafolio, ni siquiera privado: si el repo algún día se comparte, se hace público, o simplemente se quiere mostrar el código a alguien, esa carpeta no debe aparecer.

## Nota sobre el historial de git

Los 3 archivos (`helsing-company-background.md`, `helsing-products.md`, `helsing-dc-job-requirements.md`) ya estaban commiteados y pusheados a GitHub antes de esta decisión — moverlos y gitignorarlos detiene el tracking futuro, pero **el contenido sigue existiendo en el historial de commits anteriores** en `github.com/joshrubio/Siegfried`. Si se quiere purgar también del historial, hace falta reescribirlo (`git filter-repo` o similar) + force-push — no se hizo automáticamente porque es una operación destructiva que requiere confirmación explícita.
