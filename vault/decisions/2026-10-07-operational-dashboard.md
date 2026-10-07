---
title: Decisión — Siegfried como dashboard operativo (kanban + estado en Supabase)
type: decision
project: siegfried
tags: [architecture, kanban, supabase, projects]
status: final
created: 2026-10-07
updated: 2026-10-07
---

## Decisión

Siegfried deja de ser solo un buscador sobre el vault y pasa a ser un dashboard operativo, inspirado en el patrón de `D:\Conquest` (dashboard que dirige el trabajo por etapas) pero simplificado:

- **3 etapas** por proyecto satélite: `ideation → production → launched` (kanban de 3 columnas en el home).
- Dentro de "production", un **checklist universal de 5 pasos** (scaffold, feature núcleo, pulido/UX, desplegado, documentado) — no etapas separadas con gates, porque los 5 proyectos son homogéneos (apps web pequeñas) a diferencia de los episodios de Conquest.
- Cada proyecto tiene su propia **página de detalle** (`/projects/[slug]`, estilo tarjeta de proyecto de Vercel): concepto, links (repo/local/dev/deploy), checklist editable, selector de etapa.
- El estado (`satellite_projects` en Supabase) **reemplaza** `projects.json` — mismo principio que ya aplicamos al vault: local y un futuro deploy en la nube comparten el mismo dato en vivo, en vez de un archivo plano que no persiste en un filesystem efímero.

## Deploy — decisión en dos fases

- **Fase 1 (implementada ahora)**: el botón de deploy en la página de detalle enlaza al `deploy_url` si existe, o indica "aún no desplegado". No dispara nada.
- **Fase 2 (pendiente, deliberadamente pospuesta)**: integración real con la API de Vercel para desplegar con un clic desde el dashboard — se construye cuando haya al menos un proyecto satélite real listo para salir a producción, no antes.

## Por qué

El usuario señaló que el resultado hasta ahora (un buscador pasivo) no capturaba la intención original: un dashboard que ayude a *seguir y dirigir* el desarrollo de cada proyecto, no solo a consultar notas. El modelo de 3 etapas + checklist universal da ese seguimiento sin la complejidad de un pipeline de 12 etapas con gates, que no encaja con proyectos de software homogéneos.
