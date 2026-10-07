"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Checklist, SatelliteProject, Stage } from "@/lib/projects";
import { CHECKLIST_LABELS, STAGE_LABELS } from "@/lib/projects";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const STAGES: Stage[] = ["ideation", "production", "launched"];
const CHECKLIST_KEYS = Object.keys(CHECKLIST_LABELS) as (keyof Checklist)[];

export default function ProjectOperations({ project }: { project: SatelliteProject }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function patch(body: Partial<SatelliteProject>, successMessage: string) {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${project.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(successMessage);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
          Etapa
        </h3>
        <div className="flex gap-2">
          {STAGES.map((stage) => (
            <Button
              key={stage}
              size="sm"
              disabled={saving}
              variant={project.stage === stage ? "default" : "outline"}
              onClick={() => patch({ stage }, `Etapa actualizada a ${STAGE_LABELS[stage]}`)}
            >
              {STAGE_LABELS[stage]}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
          Checklist de producción
        </h3>
        <ul className="grid gap-2">
          {CHECKLIST_KEYS.map((key) => (
            <li key={key} className="flex items-center gap-2">
              <Checkbox
                id={key}
                checked={project.checklist[key]}
                disabled={saving}
                onCheckedChange={(checked) =>
                  patch(
                    { checklist: { ...project.checklist, [key]: checked === true } },
                    `${CHECKLIST_LABELS[key]} ${checked ? "marcado" : "desmarcado"}`
                  )
                }
              />
              <Label htmlFor={key} className="text-sm font-normal cursor-pointer">
                {CHECKLIST_LABELS[key]}
              </Label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
