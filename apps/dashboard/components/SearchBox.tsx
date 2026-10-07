"use client";

import { useState } from "react";
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

export default function SearchBox({ onResult }: { onResult?: (slug: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setLoading(false);
    }
  }

  function clear() {
    setQuery("");
    setResults(null);
    setError(null);
  }

  return (
    <div>
      <form onSubmit={runSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask the vault…"
            className="pl-8 h-9 pr-7"
          />
          {query && (
            <button
              type="button"
              onClick={clear}
              aria-label="Clear search"
              className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <Button type="submit" disabled={loading} size="sm">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Go"}
        </Button>
      </form>

      {(error || results) && (
        <div className="mt-3 grid gap-2">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {results?.map((r, i) => (
            <button
              key={`${r.note_path}-${i}`}
              type="button"
              onClick={() => onResult?.(r.note_path)}
              className="text-left rounded-md p-2 hover:bg-muted"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium line-clamp-1">{r.title}</span>
                <Badge variant="secondary" className="shrink-0 tabular-nums">
                  {(r.similarity * 100).toFixed(0)}%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{r.content}</p>
            </button>
          ))}
          {results?.length === 0 && (
            <p className="text-sm text-muted-foreground">No results.</p>
          )}
        </div>
      )}
    </div>
  );
}
