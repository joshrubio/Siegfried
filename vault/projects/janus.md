---
title: Janus (Developer Platform Portal) — spec
type: project
project: janus
tags: [idp, rag, agentic, platform-engineering]
status: active
created: 2026-10-07
updated: 2026-10-08
---

Proyecto satélite #2 de la [[project-pool]]. Repo propio: `github.com/joshrubio/Janus`, carpeta hermana `D:\Coding\Janus`.

## Por qué el nombre

Janus — dios romano de las puertas, los umbrales y las transiciones. Encaja literalmente: este proyecto es la puerta de entrada a entornos, servicios y pipelines. Cada proyecto satélite tiene su propio nombre mitológico para que cada uno tenga identidad visual y de marca propia, distinguible de Siegfried a simple vista (ver [[2026-10-07-satellite-identities]]).

## Qué es

Un Internal Developer Platform (IDP) en miniatura — self-service tooling simulado para un equipo de ingeniería. Responde línea por línea a la descripción real de la vacante de Platform Engineering investigada en `vault/private/`: *"designing and deploying agentic AI workflows to streamline developer activities, infrastructure operations, and platform compliance"*.

Siegfried mismo (ver [[project-siegfried]]) fue la primera iteración de este concepto, aplicado hacia adentro (vault + RAG + registro de proyectos). Janus es la versión aplicada hacia afuera: un portal que un equipo de ingeniería usaría de verdad.

## Identidad visual

Base grayscale neutra, igual disciplina que Siegfried — la diferenciación vive en el acento (ámbar, restringido a tab activo/botón primario/puntos de estado, nunca fondos), la tipografía (Fraunces serif itálica para el wordmark + Plus Jakarta Sans para la UI), el layout (tabs horizontales estilo Railway en vez de hero+grid), y el modo por defecto (oscuro, sin sincronizar con el sistema). Diseñado tras un benchmark real de Railway, Linear y Port — no inventado desde cero. Detalle completo y el proceso a repetir para los demás satélites: [[2026-10-07-satellite-identities]].

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

Ver la card de este proyecto en el dashboard de Siegfried (`/projects/janus`) para el estado operativo vivo (etapa, checklist, links). Esta nota es la spec de contenido; el dashboard es la fuente de verdad del estado.
