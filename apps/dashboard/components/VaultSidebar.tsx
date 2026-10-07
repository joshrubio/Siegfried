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
  X,
  type LucideIcon,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Note } from "@/lib/vault";

const FOLDER_META: Record<string, { label: string; icon: LucideIcon }> = {
  research: { label: "Research", icon: BookOpen },
  private: { label: "Private", icon: Lock },
  projects: { label: "Projects", icon: FolderKanban },
  decisions: { label: "Decisions", icon: GitCommitVertical },
  docs: { label: "Docs", icon: FileText },
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  "in-progress": "secondary",
  final: "outline",
};

const COLLAPSE_KEY = "siegfried:vault-sidebar-collapsed";

function SidebarContent({
  folders,
  folder,
  setFolder,
  grouped,
  notes,
  activeSlug,
  onNavigate,
}: {
  folders: string[];
  folder: string;
  setFolder: (f: string) => void;
  grouped: Record<string, Note[]>;
  notes: Note[];
  activeSlug: string | null;
  onNavigate?: () => void;
}) {
  return (
    <>
      <Tabs value={folder} onValueChange={setFolder} orientation="vertical">
        <TabsList variant="line" className="w-full items-stretch gap-0.5 p-0">
          {folders.map((f) => {
            const meta = FOLDER_META[f] ?? { label: f, icon: FileText };
            const Icon = meta.icon;
            return (
              <TabsTrigger key={f} value={f} className="gap-2">
                <Icon className="size-4" />
                {meta.label}
                <span className="ml-auto text-xs text-muted-foreground">{grouped[f].length}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <div className="px-2 pb-4 mt-1">
        {notes.map((note) => {
          const isActive = note.slug === activeSlug;
          return (
            <Link
              key={note.slug}
              href={`/vault/${note.slug}`}
              onClick={onNavigate}
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
    </>
  );
}

export default function VaultSidebar({
  grouped,
  mobileOpen = false,
  onCloseMobile,
}: {
  grouped: Record<string, Note[]>;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}) {
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

  return (
    <>
      {/* Desktop: collapsible rail or full sidebar, always visible at md+ */}
      {collapsed ? (
        <aside className="hidden md:flex w-12 shrink-0 border-r h-[calc(100vh-56px)] sticky top-14 overflow-y-auto flex-col items-center py-3 gap-1">
          <Button variant="ghost" size="icon" aria-label="Expand vault" onClick={toggleCollapsed}>
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
      ) : (
        <aside className="hidden md:block w-64 shrink-0 border-r h-[calc(100vh-56px)] sticky top-14 overflow-y-auto">
          <div className="p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground pl-2">
                Vault
              </span>
              <Button variant="ghost" size="icon" aria-label="Collapse vault" onClick={toggleCollapsed}>
                <PanelLeftClose className="size-4" />
              </Button>
            </div>
            <SidebarContent
              folders={folders}
              folder={folder}
              setFolder={setFolder}
              grouped={grouped}
              notes={notes}
              activeSlug={activeSlug}
            />
          </div>
        </aside>
      )}

      {/* Mobile: off-canvas drawer, independent of the desktop collapse preference */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={onCloseMobile}
          aria-hidden
        />
      )}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-40 w-72 bg-background border-r overflow-y-auto transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-3">
          <div className="flex items-center justify-between mb-1 h-8">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground pl-2">
              Vault
            </span>
            <Button variant="ghost" size="icon" aria-label="Close vault" onClick={onCloseMobile}>
              <X className="size-4" />
            </Button>
          </div>
          <SidebarContent
            folders={folders}
            folder={folder}
            setFolder={setFolder}
            grouped={grouped}
            notes={notes}
            activeSlug={activeSlug}
            onNavigate={onCloseMobile}
          />
        </div>
      </aside>
    </>
  );
}
