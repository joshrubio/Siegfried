"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { STAGE_LABELS, type SatelliteProject, type Stage } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

const FILTERS: ("all" | Stage)[] = ["all", "ideation", "production", "launched"];

export default function ProjectGrid({ projects }: { projects: SatelliteProject[] }) {
  const [filter, setFilter] = useState<"all" | Stage>("all");
  const visible = filter === "all" ? projects : projects.filter((p) => p.stage === filter);

  return (
    <div>
      <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | Stage)}>
        <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <TabsList className="w-max">
            {FILTERS.map((f) => (
              <TabsTrigger key={f} value={f}>
                {f === "all" ? "All" : STAGE_LABELS[f]}
                <span className="ml-1.5 text-muted-foreground">
                  {f === "all" ? projects.length : projects.filter((p) => p.stage === f).length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
      </Tabs>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
        {visible.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-full">Nothing here yet.</p>
        )}
      </div>
    </div>
  );
}
