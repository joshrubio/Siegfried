---
title: Siren (visor de clasificación acústica submarina) — spec
type: project
project: lura-acoustic-viewer
tags: [ml-interpretation, audio, classifier, honest-framing]
status: active
created: 2026-10-08
updated: 2026-10-08
---

Proyecto satélite #3 de la [[project-pool]]. Repo propio: `github.com/joshrubio/Siren`, carpeta hermana `D:\Coding\Siren`.

## Por qué el nombre

Las sirenas de la mitología griega, conocidas por su canto — encaje directo con firmas *acústicas*. Identidad propia frente a Janus y Siegfried, mismo criterio documentado en [[2026-10-07-satellite-identities]].

## Qué es

Una capa de interpretación/UX sobre la salida de un clasificador de audio real — **no** un proyecto de ingeniería de ML. Responde al ángulo de vigilancia acústica submarina sin pretender ser una competencia que Josh no tiene: el valor demostrado es tomar la predicción + confianza de un modelo y convertirla en algo que un analista pueda leer e interpretar rápido, con sus límites expuestos en vez de ocultos.

## Datos: DeepShip, no ShipsEar

Se evaluaron dos datasets reales de ruido de buques. ShipsEar (Universidad de Vigo) exige pedir acceso completo por email — solo ofrece una muestra genérica pública. **DeepShip** (Jalkanen et al., citado en papers 2024-2026) tiene una porción sustancial directamente en GitHub sin gate: 24 grabaciones reales usadas (6 por clase — Cargo, Tanker, Passenger, Tug), descargadas en dos rondas con confirmación explícita del usuario cada vez.

## Pipeline (offline, Python — `scripts/preprocess.py`)

1. Trocea cada grabación en ventanas de 6s (con solape 3s solo en archivos de entrenamiento, para más datos sin tocar el test).
2. Por ventana: espectrograma mel (colormap magma, estándar del dominio) → PNG; MFCC + delta-MFCC + forma espectral (centroide, ancho de banda, rolloff, zero-crossing, contraste) → vector de features; clip de audio a 11025Hz/16-bit para reproducción en el navegador (la clasificación usa 22050Hz completo — el downsample es solo para no commitear 220MB de wav).
3. Split train/test **a nivel de archivo**, no de ventana — ningún archivo aporta ventanas a ambos lados. Evita el leakage que infla la accuracy artificialmente (ver el paper "UniqueShip" citado en la UI de `/model`).
4. Compara Random Forest vs. SVM (RBF) en el test real; se queda con el mejor (SVM, 56.6%).
5. Escribe `lib/clips-index.json` (una fila por ventana: clase real, predicha, confianza por clase, rutas a espectrograma/audio) y `lib/metrics.json` (accuracy, precision/recall/F1 por clase, matriz de confusión) — todo estático, sin base de datos ni inferencia en vivo.

## La app

- `/` — Explorer master-detail: lista filtrable (por clase, solo test, solo mal clasificadas) + panel de detalle con espectrograma, reproductor, barras de confianza por clase y desglose de energía por banda de frecuencia.
- `/model` — números honestos: accuracy real, tabla por clase, matriz de confusión como heatmap, y una sección explicando por qué Tanker da 0% de recall (poca variación de buques en entrenamiento, no un bug).

## Identidad visual

Benchmark contra herramientas de análisis de audio reales — editor espectral de iZotope RX, displays de sonar tipo waterfall — en vez de reskinnear Janus o Siegfried. Fondo casi negro puro, acento cian restringido a señales funcionales, IBM Plex Sans/Mono, radio de esquina más cerrado (look de panel de instrumento). Detalle del proceso: [[2026-10-07-satellite-identities]].

## Honestidad del alcance

El modelo es genuinamente mediocre en una clase (Tanker) y la UI lo dice explícitamente en vez de maquillarlo — es parte de la propuesta de valor, no un defecto a esconder. Ver [[satellite-engineering-patterns]] para el patrón general de honestidad en datos/modelos simulados o reales entre satélites.

## Progreso

Ver la card de este proyecto en el dashboard de Siegfried (`/projects/lura-acoustic-viewer`) para el estado operativo vivo. Esta nota es la spec de contenido; el dashboard es la fuente de verdad del estado.
