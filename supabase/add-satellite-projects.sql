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
  position int not null default 0,
  updated_at timestamptz not null default now()
);

alter table satellite_projects enable row level security;

create index if not exists satellite_projects_stage_idx on satellite_projects (stage);
