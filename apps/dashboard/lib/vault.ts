import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const VAULT_ROOT = path.join(process.cwd(), "..", "..", "vault");

export type NoteFrontmatter = {
  title: string;
  type: "research" | "project" | "decision" | "doc";
  project?: string;
  tags?: string[];
  status?: string;
  created?: string;
  updated?: string;
  source_urls?: string[];
};

export type Note = {
  slug: string; // e.g. "research/helsing-products"
  frontmatter: NoteFrontmatter;
  content: string;
};

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    if (entry.name.endsWith(".md")) return [full];
    return [];
  });
}

export function listNotes(): Note[] {
  if (!fs.existsSync(VAULT_ROOT)) return [];
  return walk(VAULT_ROOT).map((filePath) => fileToNote(filePath));
}

export function getNote(slug: string): Note | null {
  const filePath = path.join(VAULT_ROOT, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fileToNote(filePath);
}

function fileToNote(filePath: string): Note {
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const slug = path
    .relative(VAULT_ROOT, filePath)
    .replace(/\.md$/, "")
    .split(path.sep)
    .join("/");
  return { slug, frontmatter: data as NoteFrontmatter, content };
}

export function groupByFolder(notes: Note[]): Record<string, Note[]> {
  return notes.reduce<Record<string, Note[]>>((acc, note) => {
    const folder = note.slug.split("/")[0];
    acc[folder] = acc[folder] ?? [];
    acc[folder].push(note);
    return acc;
  }, {});
}
