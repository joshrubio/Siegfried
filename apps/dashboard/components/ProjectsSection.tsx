import { listProjects } from "@/lib/projects";
import ProjectGrid from "./ProjectGrid";

export default async function ProjectsSection() {
  const projects = await listProjects();
  return <ProjectGrid projects={projects} />;
}
