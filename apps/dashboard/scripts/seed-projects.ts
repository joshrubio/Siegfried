// One-time use: seeds satellite_projects with the pool's 5 ideas.
// Doesn't touch Voyage (no embeddings here) — safe to run with no token limit concerns.
import dotenv from "dotenv";
import path from "node:path";
dotenv.config({ path: path.join(__dirname, "..", ".env.local") });
import { getSupabaseServerClient } from "../lib/supabase";

const seed = [
  {
    slug: "altra-dashboard-concept",
    name: "Common Operational Picture",
    concept:
      "A C2-style dashboard: fuses simulated feeds (drones, sensors, threats) on a real-time map with an AI panel that prioritizes/recommends actions.",
    vault_note: "projects/project-pool",
    local_path: "../altra-dashboard-concept",
  },
  {
    slug: "dev-platform-portal",
    name: "Developer Platform Portal",
    concept:
      "A self-service portal with an agentic (RAG) assistant: service catalog, 'provision an environment,' pipeline status, a chatbot over internal docs.",
    vault_note: "projects/project-pool",
    local_path: "../dev-platform-portal",
  },
  {
    slug: "lura-acoustic-viewer",
    name: "Lura acoustic signature viewer",
    concept:
      "A classifier/viewer for underwater acoustic signatures over real public datasets (ShipsEar/DeepShip) — the interpretation/UX layer over a model, not the model itself.",
    vault_note: "projects/project-pool",
    local_path: "../lura-acoustic-viewer",
  },
  {
    slug: "compliance-assistant-demo",
    name: "CMMC/NIST compliance assistant",
    concept:
      "Scans example config/IaC and uses an LLM to flag compliance gaps in plain language, with a findings dashboard.",
    vault_note: "projects/project-pool",
    local_path: "../compliance-assistant-demo",
  },
  {
    slug: "swarm-mission-planner",
    name: "Drone swarm mission planner",
    concept:
      "A mission planner for drone swarms: waypoints, coverage, and simulated multi-drone coordination on a map.",
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
