---
title: Pool de proyectos candidatos
type: project
project: siegfried
tags: [pool, ideas]
status: active
created: 2026-10-07
updated: 2026-10-07
---

Cinco ideas de proyecto, investigadas a partir de los productos reales y las vacantes publicadas de "Employer A" (alias — ver `vault/private/employer-alias-map.md` para la conexión completa). Cada una, al construirse, debe vivir en su propio repositorio bajo GitHub (joshrubio) y registrarse en `projects.json` en la raíz de Siegfried.

## 1. Common Operational Picture (clon conceptual de la interfaz de operador de su plataforma de C2) — prioridad alta
Dashboard tipo C2: fusiona feeds simulados (drones, sensores, amenazas) en un mapa en tiempo real con panel de IA que prioriza/recomienda acciones. Stack: Next.js + Mapbox/deck.gl + WebSockets + datos sintéticos (nunca reales). Repo sugerido: `altra-dashboard-concept`.

## 2. Developer Platform Portal con asistente agentic (RAG) — prioridad alta
Portal self-service: catálogo de servicios, "provisionar entorno", estado de pipelines, chatbot RAG sobre docs. Responde línea por línea a la descripción de su rol de Platform Engineering. Repo sugerido: `dev-platform-portal`. (Siegfried mismo es la primera iteración de este concepto — ver [[project-siegfried]]).

## 3. Clasificador/visor de firmas acústicas submarinas (inspirado en su sistema de vigilancia acústica submarina)
Usa dataset público real **ShipsEar** (grabaciones en costa atlántica de España) o **DeepShip**. Visor de espectrograma + confianza de clasificación. Honesto: no se pretende ser ingeniero de ML, se construye la capa de interpretación/UX del output del modelo. Repo sugerido: `lura-acoustic-viewer`.

## 4. Asistente de cumplimiento CMMC/NIST automatizado (inspirado en su rol de DevSecOps)
Escanea config/IaC de ejemplo, usa LLM para señalar huecos de cumplimiento en lenguaje claro + dashboard. Más débil (dominio no es fuerte de Josh). Repo sugerido: `compliance-assistant-demo`.

## 5. Planificador de misión para enjambre de drones (inspirado en su dron autónomo y su plataforma de C2)
Mapa para definir waypoints, cobertura y simular coordinación multi-dron. Visualmente atractivo, menos anclado a una vacante específica. Repo sugerido: `swarm-mission-planner`.

## Estado de construcción

Ver `projects.json` en la raíz para el registro vivo de repos/URLs/estado de cada uno.
