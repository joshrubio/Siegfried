"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Result = {
  note_path: string;
  title: string;
  content: string;
  similarity: number;
};

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setMobileExpanded(false);
      }
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setMobileExpanded(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  useEffect(() => {
    if (mobileExpanded) inputRef.current?.focus();
  }, [mobileExpanded]);

  async function runSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setResults(data.results);
      setOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Search the vault"
        className="sm:hidden mx-auto"
        onClick={() => setMobileExpanded(true)}
      >
        <Search className="size-4" />
      </Button>

      <form
        onSubmit={runSearch}
        className={`gap-2 ${
          mobileExpanded
            ? "fixed inset-x-0 top-14 z-40 flex bg-background border-b p-3"
            : "hidden"
        } sm:flex sm:static sm:border-0 sm:p-0 sm:bg-transparent`}
      >
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results && setOpen(true)}
            placeholder="Ask the vault anything…"
            className="pl-8 h-9"
          />
        </div>
        <Button type="submit" disabled={loading} size="sm">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Search"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="sm:hidden shrink-0"
          aria-label="Close search"
          onClick={() => setMobileExpanded(false)}
        >
          <X className="size-4" />
        </Button>
      </form>

      {open && (error || results) && (
        <div className="absolute right-0 top-full mt-2 w-[26rem] max-w-[90vw] max-h-[70vh] overflow-y-auto rounded-lg border bg-popover shadow-lg p-2 grid gap-2 z-50">
          {error && <p className="text-sm text-destructive p-2">{error}</p>}
          {results?.map((r, i) => (
            <div key={`${r.note_path}-${i}`} className="rounded-md p-2 hover:bg-muted">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{r.title}</span>
                <Badge variant="secondary" className="shrink-0 tabular-nums">
                  {(r.similarity * 100).toFixed(0)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.content}</p>
              <p className="text-xs text-muted-foreground/70 mt-1 font-mono">{r.note_path}</p>
            </div>
          ))}
          {results?.length === 0 && (
            <p className="text-sm text-muted-foreground p-2">No results.</p>
          )}
        </div>
      )}
    </div>
  );
}
