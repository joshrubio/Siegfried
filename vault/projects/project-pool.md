---
title: Pool de proyectos candidatos
type: project
project: siegfried
tags: [pool, ideas]
status: active
created: 2026-10-07
updated: 2026-10-08
---

Cinco ideas de proyecto, investigadas a partir de los productos reales y las vacantes publicadas de "Employer A" (alias — ver `vault/private/employer-alias-map.md` para la conexión completa). Cada una, al construirse, vive en su propio repositorio bajo GitHub (joshrubio), con su propio nombre mitológico e identidad visual (ver [[2026-10-07-satellite-identities]]), y se registra en la tabla `satellite_projects` de Supabase.

## 1. Argus — Common Operational Picture
Dashboard tipo C2: fusiona feeds simulados (drones, sensores, amenazas) en un mapa en tiempo real con panel de IA que prioriza/recomienda acciones, inspirado en la interfaz de operador de su plataforma de C2. Stack: Next.js + Mapbox/deck.gl + WebSockets + datos sintéticos (nunca reales). Nombre: el gigante de cien ojos — vigilancia total.

## 2. Janus — Developer Platform Portal con asistente agentic (RAG) — ✅ CONSTRUIDO
Portal self-service: catálogo de servicios, "provisionar entorno", estado de pipelines, chatbot RAG sobre docs. Responde línea por línea a la descripción de su rol de Platform Engineering. Repo: [`Janus`](https://github.com/joshrubio/Janus). Identidad benchmarkeada contra Linear (tokens, radio) y contra un dashboard CRM de referencia para la home. Dashboard propio en `/` con stats, gráfico de runs/día y accesos a los 4 servicios; Catalog/Provisioning/Pipelines en el header, Assistant como sidebar plegable. (Siegfried mismo es la primera iteración de este concepto — ver [[project-siegfried]]). Spec completa: [[janus]]. Nombre: dios romano de las puertas y transiciones — el portal de entrada.

## 3. Siren — visor de firmas acústicas submarinas — ✅ CONSTRUIDO
Usa **DeepShip** (24 grabaciones reales, Cargo/Tanker/Passenger/Tug — ShipsEar exigía pedir acceso por email, DeepShip tiene una porción descargable directo de GitHub). Pipeline Python offline (`scripts/preprocess.py`): espectrogramas mel, features MFCC/spectral, SVM entrenado con split a nivel de archivo (no de ventana, para evitar leakage) — 56.6% de accuracy real sobre 4 clases. Visor master-detail con espectrograma, confianza por clase y desglose de bandas de frecuencia; página `/model` honesta sobre por qué Tanker da 0% de recall. Honesto: no se pretende ser ingeniero de ML, se construye la capa de interpretación/UX del output del modelo. Identidad benchmarkeada contra iZotope RX y displays de sonar — negro puro, acento cian, IBM Plex. Repo: [`Siren`](https://github.com/joshrubio/Siren). Spec completa: [[siren]]. Nombre: las sirenas, conocidas por su canto — encaja con firmas *acústicas*.

## 4. Themis — asistente de cumplimiento CMMC/NIST automatizado
Escanea config/IaC de ejemplo, usa LLM para señalar huecos de cumplimiento en lenguaje claro + dashboard, inspirado en su rol de DevSecOps. Más débil (dominio no es fuerte de Josh). Nombre: diosa griega de la ley divina y la justicia — la balanza, símbolo clásico de auditoría.

## 5. Athena — planificador de misión para enjambre de drones
Mapa para definir waypoints, cobertura y simular coordinación multi-dron, inspirado en su dron autónomo y su plataforma de C2. Visualmente atractivo, menos anclado a una vacante específica. Nombre: diosa de la guerra estratégica y la táctica — planificación, no combate bruto.

## Estado de construcción

Ver la tabla `satellite_projects` en Supabase (vía el dashboard de Siegfried, `/projects/<slug>`) para el registro vivo de repos/URLs/estado de cada uno.
