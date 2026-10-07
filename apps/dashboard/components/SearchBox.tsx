"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      setError(err instanceof Error ? err.message : "Error de búsqueda");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={runSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pregunta algo sobre el vault…"
            className="pl-8"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="size-4 animate-spin" />}
          Buscar
        </Button>
      </form>

      {error && <p className="text-sm text-destructive mt-3">{error}</p>}

      {results && (
        <div className="mt-4 grid gap-2">
          {results.map((r, i) => (
            <Card key={`${r.note_path}-${i}`}>
              <CardContent>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{r.title}</span>
                  <Badge variant="secondary" className="shrink-0 tabular-nums">
                    {(r.similarity * 100).toFixed(0)}%
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{r.content}</p>
                <p className="text-xs text-muted-foreground/70 mt-2 font-mono">{r.note_path}</p>
              </CardContent>
            </Card>
          ))}
          {results.length === 0 && (
            <p className="text-sm text-muted-foreground">Sin resultados.</p>
          )}
        </div>
      )}
    </div>
  );
}
