-- Ejecutar una vez en el SQL editor de Supabase (o vía `supabase db push`)
create extension if not exists vector;

create table if not exists vault_chunks (
  id uuid primary key default gen_random_uuid(),
  note_path text not null,          -- ruta relativa dentro de vault/, p.ej. "research/helsing-products.md"
  title text not null,
  type text not null,               -- research | project | decision | doc
  project text,
  tags text[],
  chunk_index int not null,
  content text not null,
  embedding vector(1024),           -- ajustar dimensión según el modelo de embeddings elegido
  updated_at timestamptz not null default now()
);

-- RLS activado, sin policies: bloquea por defecto cualquier acceso vía anon/publishable key.
-- Nuestro código solo usa la secret key (lib/supabase.ts), que siempre se salta RLS.
alter table vault_chunks enable row level security;

create index if not exists vault_chunks_embedding_idx
  on vault_chunks using hnsw (embedding vector_cosine_ops);

create index if not exists vault_chunks_note_path_idx on vault_chunks (note_path);
create index if not exists vault_chunks_project_idx on vault_chunks (project);

-- búsqueda semántica con filtro opcional por proyecto/tipo
create or replace function match_vault_chunks(
  query_embedding vector(1024),
  match_count int default 8,
  filter_project text default null,
  filter_type text default null
)
returns table (
  id uuid,
  note_path text,
  title text,
  chunk_index int,
  content text,
  similarity float
)
language sql stable
as $$
  select
    vault_chunks.id,
    vault_chunks.note_path,
    vault_chunks.title,
    vault_chunks.chunk_index,
    vault_chunks.content,
    1 - (vault_chunks.embedding <=> query_embedding) as similarity
  from vault_chunks
  where (filter_project is null or vault_chunks.project = filter_project)
    and (filter_type is null or vault_chunks.type = filter_type)
  order by vault_chunks.embedding <=> query_embedding
  limit match_count;
$$;
