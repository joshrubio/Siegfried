"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Checklist, SatelliteProject, Stage } from "@/lib/projects";
import { CHECKLIST_LABELS, STAGE_LABELS } from "@/lib/projects";

const STAGES: Stage[] = ["ideation", "production", "launched"];
const CHECKLIST_KEYS = Object.keys(CHECKLIST_LABELS) as (keyof Checklist)[];

export default function ProjectOperations({ project }: { project: SatelliteProject }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function patch(body: Partial<SatelliteProject>) {
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${project.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-500 mb-2">
          Etapa
        </h3>
        <div className="flex gap-2">
          {STAGES.map((stage) => (
            <button
              key={stage}
              disabled={saving}
              onClick={() => patch({ stage })}
              className={`rounded-md px-3 py-1.5 text-xs border transition-colors ${
                project.stage === stage
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent"
                  : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              {STAGE_LABELS[stage]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-500 mb-2">
          Checklist de producción
        </h3>
        <ul className="grid gap-1.5">
          {CHECKLIST_KEYS.map((key) => (
            <li key={key}>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={project.checklist[key]}
                  disabled={saving}
                  onChange={(e) =>
                    patch({ checklist: { ...project.checklist, [key]: e.target.checked } })
                  }
                />
                {CHECKLIST_LABELS[key]}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
