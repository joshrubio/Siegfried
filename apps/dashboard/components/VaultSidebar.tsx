"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  BookOpen,
  Lock,
  FolderKanban,
  GitCommitVertical,
  FileText,
  X,
  type LucideIcon,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SearchBox from "@/components/SearchBox";
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
  const router = useRouter();

  return (
    <>
      <p className="text-xs text-muted-foreground px-2 leading-relaxed">
        Research, decisions and specs — the working memory behind every satellite
        project, indexed for semantic search.
      </p>

      <div className="mt-3 px-2">
        <SearchBox
          onResult={(slug) => {
            router.push(`/vault/${slug}`);
            onNavigate?.();
          }}
        />
      </div>

      <Tabs value={folder} onValueChange={setFolder} orientation="vertical" className="mt-3">
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
  const [hovered, setHovered] = useState(false);

  const notes = grouped[folder] ?? [];

  return (
    <>
      {/* Desktop: narrow rail that expands into an overlay panel on hover */}
      <div
        className="hidden md:block relative z-20 w-12 shrink-0 h-[calc(100vh-56px)] sticky top-14"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <aside
          className={`absolute inset-y-0 left-0 bg-background border-r overflow-y-auto transition-[width] duration-150 ease-out z-20 ${
            hovered ? "w-72 shadow-xl" : "w-12"
          }`}
        >
          {hovered ? (
            <div className="p-3">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground pl-2">
                Vault
              </span>
              <div className="mt-2">
                <SidebarContent
                  folders={folders}
                  folder={folder}
                  setFolder={setFolder}
                  grouped={grouped}
                  notes={notes}
                  activeSlug={activeSlug}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-3 gap-1">
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
                    onClick={() => setFolder(f)}
                  >
                    <Icon className="size-4" />
                  </Button>
                );
              })}
            </div>
          )}
        </aside>
      </div>

      {/* Mobile: off-canvas drawer, triggered from the header hamburger */}
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
          <div className="flex items-center justify-between mb-2 h-8">
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
