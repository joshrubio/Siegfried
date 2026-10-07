"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Lock,
  FolderKanban,
  GitCommitVertical,
  FileText,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Note } from "@/lib/vault";

const FOLDER_META: Record<string, { label: string; icon: LucideIcon }> = {
  research: { label: "Investigación", icon: BookOpen },
  private: { label: "Privado", icon: Lock },
  projects: { label: "Proyectos", icon: FolderKanban },
  decisions: { label: "Decisiones", icon: GitCommitVertical },
  docs: { label: "Docs", icon: FileText },
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  "in-progress": "secondary",
  final: "outline",
};

const COLLAPSE_KEY = "siegfried:vault-sidebar-collapsed";

export default function VaultSidebar({ grouped }: { grouped: Record<string, Note[]> }) {
  const pathname = usePathname();
  const activeSlug = pathname.startsWith("/vault/") ? pathname.replace("/vault/", "") : null;

  const folders = useMemo(() => Object.keys(grouped), [grouped]);
  const defaultFolder = (activeSlug?.split("/")[0]) ?? folders[0];
  const [folder, setFolder] = useState(defaultFolder);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {}
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  }

  const notes = grouped[folder] ?? [];

  if (collapsed) {
    return (
      <aside className="w-12 shrink-0 border-r h-[calc(100vh-56px)] sticky top-14 overflow-y-auto flex flex-col items-center py-3 gap-1">
        <Button variant="ghost" size="icon" aria-label="Expandir vault" onClick={toggleCollapsed}>
          <PanelLeftOpen className="size-4" />
        </Button>
        {folders.map((f) => {
          const meta = FOLDER_META[f] ?? { label: f, icon: FileText };
          const Icon = meta.icon;
          return (
            <Button
              key={f}
              variant="ghost"
              size="icon"
              aria-label={meta.label}
              title={meta.label}
              className={folder === f ? "bg-muted" : undefined}
              onClick={() => {
                setFolder(f);
                toggleCollapsed();
              }}
            >
              <Icon className="size-4" />
            </Button>
          );
        })}
      </aside>
    );
  }

  return (
    <aside className="w-64 shrink-0 border-r h-[calc(100vh-56px)] sticky top-14 overflow-y-auto">
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground pl-2">
            Vault
          </span>
          <Button variant="ghost" size="icon" aria-label="Colapsar vault" onClick={toggleCollapsed}>
            <PanelLeftClose className="size-4" />
          </Button>
        </div>
        <Tabs value={folder} onValueChange={setFolder} orientation="vertical">
          <TabsList variant="line" className="w-full items-stretch gap-0.5 p-0">
            {folders.map((f) => {
              const meta = FOLDER_META[f] ?? { label: f, icon: FileText };
              const Icon = meta.icon;
              return (
                <TabsTrigger key={f} value={f} className="gap-2">
                  <Icon className="size-4" />
                  {meta.label}
                  <span className="ml-auto text-xs text-muted-foreground">
                    {grouped[f].length}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      <div className="px-2 pb-4">
        {notes.map((note) => {
          const isActive = note.slug === activeSlug;
          return (
            <Link
              key={note.slug}
              href={`/vault/${note.slug}`}
              className={`flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive ? "bg-foreground text-background" : "hover:bg-muted"
              }`}
            >
              <span className="line-clamp-1">{note.frontmatter.title}</span>
              {note.frontmatter.status && !isActive && (
                <Badge
                  variant={STATUS_VARIANT[note.frontmatter.status] ?? "outline"}
                  className="shrink-0 text-[10px] px-1.5"
                >
                  {note.frontmatter.status}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
