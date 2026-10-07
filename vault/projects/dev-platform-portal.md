---
title: Developer Platform Portal — spec
type: project
project: dev-platform-portal
tags: [idp, rag, agentic, platform-engineering]
status: in-progress
created: 2026-10-07
updated: 2026-10-07
---

Proyecto satélite #2 de la [[project-pool]]. Repo propio: `github.com/joshrubio/dev-platform-portal`, carpeta hermana `D:\Coding\dev-platform-portal`.

## Qué es

Un Internal Developer Platform (IDP) en miniatura — self-service tooling simulado para un equipo de ingeniería. Responde línea por línea a la descripción real de la vacante de Platform Engineering investigada en `vault/private/`: *"designing and deploying agentic AI workflows to streamline developer activities, infrastructure operations, and platform compliance"*.

Siegfried mismo (ver [[project-siegfried]]) fue la primera iteración de este concepto, aplicado hacia adentro (vault + RAG + registro de proyectos). Este proyecto satélite es la versión aplicada hacia afuera: un portal que un equipo de ingeniería usaría de verdad.

## Los 4 pilares

1. **Catálogo de servicios** — lista de "servicios internos" simulados (nombre, owner, stack, estado, docs). El feature núcleo más simple de demostrar primero.
2. **Provisionar entorno (self-service)** — formulario que simula aprovisionar infraestructura (elegir servicio + tipo de entorno → log de progreso simulado → URL/credenciales de salida). Nunca toca infraestructura real — es honesto sobre ser una simulación de UX, no un motor real de IaC.
3. **Estado de pipelines** — vista de CI/CD simulada (runs con estado success/failed/running).
4. **Chatbot agentic (RAG) sobre docs internas** — reutiliza el mismo patrón ya construido en Siegfried (Supabase + pgvector + Voyage embeddings), mismo stack dentro aplicado a la documentación de ESTE proyecto.

## Honestidad del alcance

Ningún pilar requiere fingir ser ingeniero de infraestructura real — todo es simulado/mockeado de forma transparente. El valor demostrado es: UX de self-service tooling + fullstack + aplicar IA (RAG) a un problema real de developer experience. Mismo ángulo que ya validamos para toda la pool en [[josh-profile]].

## Stack

Mismo que Siegfried: Next.js (App Router) + TypeScript + Tailwind + shadcn/ui, para mantener velocidad de desarrollo y consistencia de patrones ya resueltos (RAG, Supabase, deploy). Repo independiente, sin dependencia de código con Siegfried — solo comparte el patrón, no librerías compartidas.

## Progreso

Ver la card de este proyecto en el dashboard de Siegfried (`/projects/dev-platform-portal`) para el estado operativo vivo (etapa, checklist, links). Esta nota es la spec de contenido; el dashboard es la fuente de verdad del estado.
