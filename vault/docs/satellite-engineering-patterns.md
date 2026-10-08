---
title: Patrones de ingeniería recurrentes entre satélites
type: doc
project: siegfried
tags: [docs, patterns, nextjs, gotchas, design]
status: active
created: 2026-10-08
updated: 2026-10-08
---

Cosas que se repitieron construyendo Janus y Siren y que vale la pena arrancar sabiendo la próxima vez (Argus, Themis, Athena) en vez de redescubrirlas.

## Next.js 16 + Cache Components

Todos los satélites usan `cacheComponents: true` en `next.config.ts` (prerender agresivo por defecto). Reglas que cuestan un rato encontrar la primera vez:

- Cualquier componente que use `usePathname()`, `params`, o `redirect()` necesita un `<Suspense>` alrededor — si no, el build falla con errores de prerendering. Patrón usado en los tres proyectos: envolver el componente específico (`<Suspense fallback={...}><HeaderNav /></Suspense>`), no la página entera.
- `export const runtime = "nodejs"` en una route handler es **incompatible** con `cacheComponents: true` — ni hace falta, nodejs es el runtime por defecto.
- Tras editar muchos archivos seguidos, Turbopack a veces sirve caché obsoleta (tipos de ruta, CSS). Si algo no refleja el cambio: matar el proceso del puerto, `rm -rf .next`, reiniciar `npm run dev`. Pasó varias veces en los tres proyectos, siempre se resolvió así.
- Después de borrar `.next`, un `npx tsc --noEmit` suelto puede fallar con `Cannot find name 'LayoutProps'` — es el tipo global que Next regenera en `.next/types`. No es un error real; corre `npm run build` (o `next dev` un momento) y vuelve a chequear.

## El patrón de sidebar plegable sin salto

Tanto el `VaultSidebar` de Siegfried como el `AssistantSidebar` de Janus son rails que se expanden (hover o click) revelando contenido que no existe en estado plegado (buscador, título, descripción). Si ese contenido extra simplemente aparece encima de la lista de iconos, la lista salta de posición al expandir — se ve roto aunque cada estado por separado esté bien.

Solución aplicada en Siegfried (ver commit "Fix vault sidebar collapse/expand jump"): la cabecera (buscador) ocupa una **zona de altura fija** en ambos estados — icono solo vs. input completo — y la fila de navegación debajo arranca al mismo offset fijo en los dos casos. No se intenta centrar dinámicamente con flexbox puro, porque el contenido que sigue (lista de notas) tiene altura variable y rompe el centrado; un offset fijo e idéntico en ambos estados es más robusto que "centrado perfecto" cuando hay contenido variable debajo.

## Precomputar y servir estático en vez de levantar infraestructura nueva

Patrón repetido dos veces ya, vale la pena tratarlo como default: si el corpus es pequeño (decenas de documentos, un puñado de audios), **no** levantar una base de datos nueva por proyecto satélite.

- Janus: RAG sobre `docs/*.md` — embeddings de Voyage precalculados a `lib/docs-index.json`, similitud de coseno en memoria en cada request. Cero base de datos.
- Siren: clasificador de audio — espectrogramas, confianza y métricas precalculados por `scripts/preprocess.py` a JSON/PNG/wav estáticos en `public/`. Cero inferencia en vivo.

Mismo razonamiento documentado en ambos: el costo de pgvector/una base de datos propia no se justifica para unas pocas decenas de items, y "no necesitó base de datos" es en sí mismo una decisión de ingeniería defendible, no una carencia.

## Trampas de lint recurrentes (`eslint-config-next` + `react-hooks` estrictas)

Dos errores de lint aparecieron **en los tres proyectos** (Siegfried, Janus, Siren), siempre el mismo patrón:

1. **`react-hooks/set-state-in-effect`** — el guard de hidratación `useEffect(() => setMounted(true), [])` (usado en todo toggle de tema para evitar mismatch de hidratación) se marca como error. Es un patrón intencional y seguro (no es una suscripción, es un flag de montaje de una sola vez) — se resuelve con un comentario `// eslint-disable-next-line react-hooks/set-state-in-effect` explicando por qué, no reescribiendo la lógica.
2. **`react-hooks/static-components`** — un componente de render custom (p. ej. el `tick` de un gráfico de Recharts) declarado *dentro* de otra función componente, para poder cerrar sobre variables locales. Se arregla sacándolo a scope de módulo y pasando esas variables como props explícitas en vez de por closure.

Si un satélite nuevo usa el mismo patrón de toggle de tema o gráficos con Recharts, correr `npx eslint .` completo (no solo `tsc`) antes de dar por terminada una fase — el build y el typecheck pasan limpios con estos dos errores presentes; solo lint los atrapa.

## Fuentes de datos reales para dominios que no son el tuyo

Para Siren (acústica submarina, no es el dominio de Josh) el criterio que funcionó: buscar un dataset académico real, citado en papers recientes, con una porción **descargable sin pedir acceso** (ShipsEar exige email; DeepShip tiene una porción directamente en GitHub). Preferir eso sobre generar datos sintéticos — "datos reales, capa de interpretación honesta sobre un modelo real" es la propuesta de valor completa del proyecto, no un detalle.

Nota de proceso: descargar cualquier archivo requiere confirmación explícita del usuario (nombre, origen, tamaño) antes de bajarlo — pasó dos veces en Siren (12 archivos iniciales, luego 12 más al afinar el clasificador) y en ambas se pidió primero.

## Identidad visual: benchmark real antes de diseñar, y no solo cambiar paleta

Proceso ya documentado en [[2026-10-07-satellite-identities]], reforzado dos veces más:

- Janus se beneficiócomparándose contra Linear real (tokens, radio, tipografía) para su dashboard, y de nuevo contra una captura de un dashboard CRM de referencia para la home nueva — en ambos casos la pauta fue copiar la **gramática estructural** (tarjetas de stat con badge de delta, chart de área con tooltip, tabs con barra segmentada) y no el contenido ni la paleta.
- Siren se benchmarkeó contra herramientas de análisis de audio reales (editor espectral de iZotope RX, displays de sonar tipo waterfall) — de ahí el fondo casi negro puro, el colormap magma en los espectrogramas (estándar del dominio, no decoración), y la tipografía mono/técnica.

Cada satélite terminó con: una base monocromática disciplinada, un único acento funcional (nunca relleno de superficie), tipografía propia, y un radio de esquina distinto — la diferenciación vive ahí, nunca en "cambiar el color primario y ya".

## Honestidad en el output de modelos/datos simulados

Patrón de redacción que se repite y conviene mantener: cuando un número es sintético (deltas del dashboard de Janus, confianza baja de Siren en Tanker), **decirlo explícitamente en la UI**, no solo en un comentario de código. Janus rotula sus deltas como "demo series, same spirit as the seeded pipeline runs". Siren dedica una sección entera de `/model` a explicar por qué Tanker da 0% de recall, con la causa real (poca variación de buques en entrenamiento) en vez de ocultar el número o inflarlo.
