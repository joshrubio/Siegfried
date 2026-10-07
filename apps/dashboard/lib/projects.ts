import fs from "node:fs";
import path from "node:path";

export type SatelliteProject = {
  slug: string;
  name: string;
  vault_note: string;
  repo_url: string | null;
  local_path: string;
  dev_url: string | null;
  deploy_url: string | null;
  status: "planned" | "in-progress" | "done";
};

const PROJECTS_JSON = path.join(process.cwd(), "..", "..", "projects.json");

export function listProjects(): SatelliteProject[] {
  if (!fs.existsSync(PROJECTS_JSON)) return [];
  const raw = fs.readFileSync(PROJECTS_JSON, "utf-8");
  return (JSON.parse(raw).projects ?? []) as SatelliteProject[];
}
