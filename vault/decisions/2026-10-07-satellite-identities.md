---
title: Decisión — nombre mitológico + identidad visual propia por proyecto satélite
type: decision
project: siegfried
tags: [naming, design-system, satellite-projects]
status: final
created: 2026-10-07
updated: 2026-10-07
---

## Decisión

Cada proyecto satélite tiene (a) un nombre propio de mitología, siguiendo el patrón ya establecido por "Siegfried" (héroe de la mitología nórdica/germánica), y (b) una identidad visual deliberadamente distinta de Siegfried y del resto — paleta, tipografía y lenguaje de forma propios, no un reskin del mismo sistema de diseño.

| Slug | Nombre | Proyecto | Mitología |
|---|---|---|---|
| `argus` | Argus | Common Operational Picture | Griega — el gigante de cien ojos, vigilancia total |
| `janus` | Janus | Developer Platform Portal | Romana — dios de las puertas y transiciones |
| `siren` | Siren | Visor de firmas acústicas submarinas | Griega — sirenas, conocidas por su canto |
| `themis` | Themis | Asistente de cumplimiento CMMC/NIST | Griega — diosa de la ley y la justicia |
| `athena` | Athena | Planificador de misión de enjambre de drones | Griega — diosa de la guerra estratégica |

## Por qué

1. **Naming**: el usuario señaló que "Developer Platform Portal" es un nombre genérico sin personalidad, inconsistente con "Siegfried". Un nombre propio por proyecto refuerza que cada uno es una pieza de producto con identidad, no una demo intercambiable.
2. **Identidad visual**: el usuario notó que Janus era "indistinguible de Siegfried" — ambos usaban el tema neutro/violeta por defecto de shadcn sin ninguna intervención. Para un portafolio que debe demostrar criterio de UX, que los 5 proyectos se vean idénticos entre sí es contraproducente: sugiere reskin de plantilla, no diseño con intención.

## Janus — primera aplicación de esta decisión

Identidad "self-service amigable" (opción B de 3 propuestas, elegida por el usuario): paleta cálida crema/terracota (oklch, light + dark), tipografía Plus Jakarta Sans en vez de Geist, radio de esquina mucho mayor (`1.1rem` vs `0.625rem` de Siegfried). Contraste deliberado frente al tono frío/táctico de Siegfried.

## Pendiente

Argus, Siren, Themis y Athena todavía no tienen identidad visual propia definida — se diseñará cada una cuando se empiece a construir ese proyecto, buscando el mismo nivel de contraste deliberado (no solo cambiar el color de acento).
