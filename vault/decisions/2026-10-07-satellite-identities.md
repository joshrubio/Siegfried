---
title: Decisión — nombre mitológico + identidad visual propia por proyecto satélite
type: decision
project: siegfried
tags: [naming, design-system, satellite-projects, design-process]
status: final
created: 2026-10-07
updated: 2026-10-08
---

## Decisión

Cada proyecto satélite tiene (a) un nombre propio de mitología, siguiendo el patrón ya establecido por "Siegfried" (héroe de la mitología nórdica/germánica), y (b) una identidad visual deliberadamente distinta de Siegfried y del resto — construida sobre una **base monocromática compartida**, diferenciada vía acento/tipografía/forma/layout, nunca vía "repintar la paleta".

| Slug | Nombre | Proyecto | Mitología |
|---|---|---|---|
| `argus` | Argus | Common Operational Picture | Griega — el gigante de cien ojos, vigilancia total |
| `janus` | Janus | Developer Platform Portal | Romana — dios de las puertas y transiciones |
| `siren` | Siren | Visor de firmas acústicas submarinas | Griega — sirenas, conocidas por su canto |
| `themis` | Themis | Asistente de cumplimiento CMMC/NIST | Griega — diosa de la ley y la justicia |
| `athena` | Athena | Planificador de misión de enjambre de drones | Griega — diosa de la guerra estratégica |

## Por qué

1. **Naming**: "Developer Platform Portal" es un nombre genérico sin personalidad, inconsistente con "Siegfried". Un nombre propio por proyecto refuerza que cada uno es una pieza de producto con identidad, no una demo intercambiable.
2. **Identidad visual, intento 1 (incorrecto)**: la primera versión de Janus solo cambió la paleta de color (tema cálido crema/terracota en vez del neutro/violeta de Siegfried). El usuario corrigió esto: repintar el fondo/cards/bordes de un color a otro no es diseñar una identidad, es un reskin. Además rompe la coherencia de familia — si cada app tiene una base de color distinta, el portafolio deja de sentirse como obra de un mismo diseñador con criterio.
3. **Identidad visual, intento 2 (correcto) — el marco**:
   - **Base compartida**: grayscale neutro (mismos tokens de disciplina que Siegfried) en todas las apps. Esto es lo que las mantiene "de la misma familia".
   - **Diferenciación real** vía: (a) un acento usado solo en señales funcionales — botón primario, focus ring, estado activo, nunca como fondo de superficie; (b) tipografía propia; (c) lenguaje de forma específico (no "más redondeado" en general, sino una metáfora de forma concreta); (d) arquitectura de layout distinta (no el mismo patrón recoloreado); (e) personalidad de movimiento.

## El proceso: benchmark antes de diseñar

Para Janus, en vez de inventar el lenguaje de forma/layout desde cero, se investigaron 3 productos reales del dominio (self-service developer tooling) **con capturas de pantalla reales**, no de memoria:

- **Railway** (railway.com) — el más cercano funcionalmente. Patrón real: breadcrumb de proyecto/entorno + **tabs horizontales** por sección (Architecture/Observability/Logs/Settings), servicios como nodos en un canvas, un solo acento vivo (violeta) restringido al CTA primario y el estado activo, headline de marketing en serif contrastando con UI de producto en sans.
- **Linear** (linear.app) — la referencia de disciplina de interfaz. Sidebar simple, base casi negra, el color aparece *solo* en señales funcionales puntuales (una estrella de prioridad), filas densas en vez de cards.
- **Port** (port.io) — confirmó convenciones generales del dominio (catálogo basado en entidades/blueprints, botones tipo pill), aunque su marketing actual no expone capturas reales del dashboard.

Este es el proceso a repetir para Argus, Siren, Themis y Athena cuando les toque: **2-3 referencias reales del dominio específico de ESE proyecto, con capturas, antes de proponer una dirección de diseño** — no "inspirado en" genérico, sino patrones concretos citables.

## Janus — resultado final

- **Layout**: tabs horizontales (Catalog/Provisioning/Pipelines/Assistant) con breadcrumb-style header compacto, inspirado directamente en Railway — reemplaza el patrón hero+grid de Siegfried.
- **Acento**: ámbar, restringido a subrayado de tab activo, botón primario, y puntos de estado — disciplina de Linear.
- **Base**: grayscale neutro puro, igual que Siegfried — sin tinte de color en fondos/cards/bordes.
- **Tipografía**: Fraunces (serif, itálica) solo para el wordmark/título, Plus Jakarta Sans para el resto de la UI — combinación inspirada en el contraste serif/sans de Railway, poco común, memorable.
- **Modo**: oscuro por defecto (`defaultTheme="dark"`, sin sincronizar con el sistema) — identidad propia, distinta del light-first/system-synced de Siegfried.
- **Forma**: radio de esquina moderado (`0.75rem`), sin exagerar.

## Pendiente

Argus, Siren, Themis y Athena todavía no tienen identidad visual propia definida — se diseñará cada una con este mismo proceso (benchmark real primero) cuando se empiece a construir ese proyecto.
