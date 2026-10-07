import { getSupabaseServerClient } from "./supabase";

export type Checklist = {
  scaffolded: boolean;
  core_feature: boolean;
  polish: boolean;
  deployed: boolean;
  documented: boolean;
};

export type Stage = "ideation" | "production" | "launched";

export type SatelliteProject = {
  slug: string;
  name: string;
  concept: string;
  vault_note: string | null;
  stage: Stage;
  checklist: Checklist;
  repo_url: string | null;
  local_path: string | null;
  dev_url: string | null;
  deploy_url: string | null;
  position: number;
  updated_at: string;
};

export async function listProjects(): Promise<SatelliteProject[]> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("satellite_projects")
    .select("*")
    .order("stage", { ascending: true })
    .order("position", { ascending: true });

  if (error) throw new Error(`listProjects: ${error.message}`);
  return data as SatelliteProject[];
}

export async function getProject(slug: string): Promise<SatelliteProject | null> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("satellite_projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`getProject: ${error.message}`);
  return data as SatelliteProject | null;
}

export async function updateProject(
  slug: string,
  patch: Partial<Pick<SatelliteProject, "stage" | "checklist" | "repo_url" | "dev_url" | "deploy_url">>
): Promise<SatelliteProject> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("satellite_projects")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("slug", slug)
    .select()
    .single();

  if (error) throw new Error(`updateProject: ${error.message}`);
  return data as SatelliteProject;
}

export const STAGE_LABELS: Record<Stage, string> = {
  ideation: "Ideation",
  production: "In production",
  launched: "Launched",
};

export const CHECKLIST_LABELS: Record<keyof Checklist, string> = {
  scaffolded: "Scaffolded",
  core_feature: "Core feature",
  polish: "Polish/UX",
  deployed: "Deployed",
  documented: "Documented",
};
