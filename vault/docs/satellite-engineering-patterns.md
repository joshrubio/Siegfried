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

## El patrón de sidebar plegable sin salto (usado tres veces ya)

Tanto el `VaultSidebar` de Siegfried como el `AssistantSidebar` de Janus son rails que se expanden revelando contenido que no existe en estado plegado (buscador, título, descripción, o el chat completo). Si ese contenido extra simplemente aparece encima de la lista de iconos, la lista salta de posición al expandir — se ve roto aunque cada estado por separado esté bien.

Solución aplicada primero en Siegfried (commit "Fix vault sidebar collapse/expand jump"), luego reusada tal cual en el rediseño del `AssistantSidebar` de Janus:

- La cabecera (buscador, o el label "Assistant") ocupa una **zona de altura fija** en ambos estados — icono solo vs. contenido completo.
- La fila de navegación/contenido debajo arranca al **mismo offset fijo** en los dos casos, no centrado dinámicamente con flexbox puro — el contenido que sigue (lista de notas, historial de chat) tiene altura variable y rompe cualquier centrado "perfecto"; un offset fijo e idéntico en ambos estados es más robusto.
- Nota de iteración: en Siegfried se probó primero centrar verticalmente los iconos del estado plegado (en vez de justificados arriba) — se veía mejor en teoría, pero al verlo en vivo el usuario pidió revertirlo a justificado arriba. La lección no es "arriba es mejor que centrado", es que **el offset fijo compartido es lo que importa**, no si ese offset es pequeño o grande — así que el revert fue un cambio de una línea (el valor del `padding-top`), no una reestructuración.
- El panel expandido se posiciona **absolute**, superpuesto sobre el contenido (con `shadow-xl`), en vez de empujar el layout de la página — el rail colapsado (48px) sí ocupa espacio real en el flujo, pero el panel expandido no. Evita un segundo tipo de salto: que el contenido principal se reacomode cada vez que el sidebar se abre.
- Janus además eliminó el botón de cerrar explícito que tenía antes (abría con click, cerraba con un icono `PanelLeftClose`) a favor de hover puro, igual que Siegfried — mover el mouse fuera repliega, no hace falta un control dedicado. Los triggers externos que ya existían (comando "Open Assistant" en Cmd+K, el tile del dashboard) se mantienen: simplemente fuerzan el mismo estado `hovered` a `true` en vez de un estado `open` aparte.

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

- Janus se benefició comparándose contra Linear real (tokens, radio, tipografía) para su dashboard, y de nuevo contra una captura de un dashboard CRM de referencia para la home nueva — en ambos casos la pauta fue copiar la **gramática estructural** (tarjetas de stat con badge de delta, chart de área con tooltip, tabs con barra segmentada) y no el contenido ni la paleta.
- Siren se benchmarkeó contra herramientas de análisis de audio reales (editor espectral de iZotope RX, displays de sonar tipo waterfall) — de ahí el fondo casi negro puro, el colormap magma en los espectrogramas (estándar del dominio, no decoración), y la tipografía mono/técnica.

Cada satélite terminó con: una base monocromática disciplinada, un único acento funcional (nunca relleno de superficie), tipografía propia, y un radio de esquina distinto — la diferenciación vive ahí, nunca en "cambiar el color primario y ya".

## Dashboard escaneable de un vistazo: dos columnas, sin huecos

El dashboard de Janus se reorganizó a pedido explícito del usuario para que todo quepa en una pantalla sin scroll: en vez de secciones apiladas a ancho completo (4 stat cards → chart → Services/Reliability lado a lado), se agrupó en dos contenedores — columna izquierda ancha (stat cards 2×2 + el chart de runs, uno encima del otro) y columna derecha angosta (Services + Pipeline reliability, uno encima del otro) — vía `grid-cols-[2fr_1fr]`.

Trampa al hacer esto: si una columna tiene más contenido que la otra, CSS Grid estira el contenedor más corto para igualar la altura de la fila (`align-items: stretch` por defecto), pero el contenido *adentro* de ese contenedor no se estira solo — queda un hueco en blanco debajo del último elemento. Arreglo: la columna corta pasa de `space-y-4` (apilado simple) a `flex flex-col gap-4`, y el último card de esa columna recibe `flex-1` para crecer y llenar el espacio sobrante — y si ese card tiene un gráfico con altura fija (`h-32`), esa altura también pasa a `flex-1 min-h-32` para que el propio gráfico (no solo el padding del card) use el espacio extra en vez de dejarlo vacío.

## Honestidad en el output de modelos/datos simulados

Patrón de redacción que se repite y conviene mantener: cuando un número es sintético (deltas del dashboard de Janus, confianza baja de Siren en Tanker), **decirlo explícitamente en la UI**, no solo en un comentario de código. Janus rotula sus deltas como "demo series, same spirit as the seeded pipeline runs". Siren dedica una sección entera de `/model` a explicar por qué Tanker da 0% de recall, con la causa real (poca variación de buques en entrenamiento) en vez de ocultar el número o inflarlo.
