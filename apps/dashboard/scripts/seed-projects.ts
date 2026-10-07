// Uso único: siembra satellite_projects con las 5 ideas de la pool.
// No toca Voyage (no hay embeddings aquí) — seguro de correr sin límite de tokens.
import dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });
import { getSupabaseServerClient } from "../lib/supabase";

const seed = [
  {
    slug: "altra-dashboard-concept",
    name: "Common Operational Picture",
    concept:
      "Dashboard tipo C2: fusiona feeds simulados (drones, sensores, amenazas) en un mapa en tiempo real con panel de IA que prioriza/recomienda acciones.",
    vault_note: "projects/project-pool",
    local_path: "../altra-dashboard-concept",
  },
  {
    slug: "dev-platform-portal",
    name: "Developer Platform Portal",
    concept:
      "Portal self-service con asistente agentic (RAG): catálogo de servicios, 'provisionar entorno', estado de pipelines, chatbot sobre docs internas.",
    vault_note: "projects/project-pool",
    local_path: "../dev-platform-portal",
  },
  {
    slug: "lura-acoustic-viewer",
    name: "Lura acoustic signature viewer",
    concept:
      "Clasificador/visor de firmas acústicas submarinas sobre datasets públicos reales (ShipsEar/DeepShip) — la capa de interpretación/UX de un modelo, no el modelo mismo.",
    vault_note: "projects/project-pool",
    local_path: "../lura-acoustic-viewer",
  },
  {
    slug: "compliance-assistant-demo",
    name: "CMMC/NIST compliance assistant",
    concept:
      "Escanea config/IaC de ejemplo y usa un LLM para señalar huecos de cumplimiento en lenguaje claro, con un dashboard de hallazgos.",
    vault_note: "projects/project-pool",
    local_path: "../compliance-assistant-demo",
  },
  {
    slug: "swarm-mission-planner",
    name: "Drone swarm mission planner",
    concept:
      "Planificador de misión para enjambres de drones: waypoints, cobertura y simulación de coordinación multi-dron sobre un mapa.",
    vault_note: "projects/project-pool",
    local_path: "../swarm-mission-planner",
  },
];

async function main() {
  const supabase = getSupabaseServerClient();
  for (const [i, project] of seed.entries()) {
    const { error } = await supabase
      .from("satellite_projects")
      .upsert({ ...project, position: i }, { onConflict: "slug" });
    if (error) {
      console.error(`✗ ${project.slug}:`, error.message);
    } else {
      console.log(`✓ ${project.slug}`);
    }
  }
}

main().then(() => process.exit(0));
