-- Run once in Supabase's SQL editor (or via `supabase db push`)
create extension if not exists vector;

create table if not exists vault_chunks (
  id uuid primary key default gen_random_uuid(),
  note_path text not null,          -- relative path within vault/, e.g. "research/josh-profile.md"
  title text not null,
  type text not null,               -- research | project | decision | doc
  project text,
  tags text[],
  chunk_index int not null,
  content text not null,
  embedding vector(1024),           -- adjust the dimension to match the chosen embeddings model
  updated_at timestamptz not null default now()
);

-- RLS enabled, no policies: blocks any access via the anon/publishable key by default.
-- Our code only uses the secret key (lib/supabase.ts), which always bypasses RLS.
alter table vault_chunks enable row level security;

create index if not exists vault_chunks_embedding_idx
  on vault_chunks using hnsw (embedding vector_cosine_ops);

create index if not exists vault_chunks_note_path_idx on vault_chunks (note_path);
create index if not exists vault_chunks_project_idx on vault_chunks (project);

-- semantic search with an optional project/type filter
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

-- Operational record of the satellite projects (replaces projects.json as the
-- source of truth — local and a future cloud deploy share the same state).
create table if not exists satellite_projects (
  slug text primary key,
  name text not null,
  concept text not null,            -- short summary for the dashboard card
  vault_note text,                  -- vault note with the full spec
  stage text not null default 'ideation'
    check (stage in ('ideation', 'production', 'launched')),
  checklist jsonb not null default '{
    "scaffolded": false,
    "core_feature": false,
    "polish": false,
    "deployed": false,
    "documented": false
  }'::jsonb,
  repo_url text,
  local_path text,
  dev_url text,
  deploy_url text,
  position int not null default 0,  -- order within its kanban column
  updated_at timestamptz not null default now()
);

alter table satellite_projects enable row level security;

create index if not exists satellite_projects_stage_idx on satellite_projects (stage);
