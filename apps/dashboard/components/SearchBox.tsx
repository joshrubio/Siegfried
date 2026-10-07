"use client";

import { useState } from "react";

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
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pregunta algo sobre el vault…"
          className="flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-4 py-2 text-sm disabled:opacity-50"
        >
          {loading ? "Buscando…" : "Buscar"}
        </button>
      </form>

      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

      {results && (
        <ul className="mt-4 grid gap-2">
          {results.map((r, i) => (
            <li
              key={`${r.note_path}-${i}`}
              className="rounded-md border border-neutral-200 dark:border-neutral-800 p-3"
            >
              <div className="text-sm font-medium">{r.title}</div>
              <p className="text-xs text-neutral-500 mt-1 line-clamp-3">
                {r.content}
              </p>
              <div className="text-xs text-neutral-400 mt-1">
                {r.note_path} · {(r.similarity * 100).toFixed(0)}% similar
              </div>
            </li>
          ))}
          {results.length === 0 && (
            <li className="text-sm text-neutral-500">Sin resultados.</li>
          )}
        </ul>
      )}
    </div>
  );
}
