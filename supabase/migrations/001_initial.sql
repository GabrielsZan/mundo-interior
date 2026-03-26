-- ── Players ─────────────────────────────────────────────────────────────────
create table if not exists public.players (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete cascade not null unique,
  name             text not null,
  level            integer not null default 1,
  xp_general       integer not null default 0,
  xp_to_next_level integer not null default 115,
  domain_xp        jsonb not null default '{"mind":0,"body":0,"soul":0,"creation":0}'::jsonb,
  created_at       timestamptz not null default now()
);

-- ── Missions ─────────────────────────────────────────────────────────────────
create table if not exists public.missions (
  id           uuid primary key default gen_random_uuid(),
  player_id    uuid references public.players(id) on delete cascade not null,
  title        text not null,
  description  text not null default '',
  domain       text not null,
  type         text not null,
  xp_general   integer not null,
  xp_domain    integer not null,
  is_completed boolean not null default false,
  completed_at timestamptz,
  streak       integer not null default 0,
  created_at   timestamptz not null default now()
);

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table public.players enable row level security;
alter table public.missions enable row level security;

create policy "Players: own row"
  on public.players for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Missions: own player"
  on public.missions for all
  using (
    player_id in (select id from public.players where user_id = auth.uid())
  )
  with check (
    player_id in (select id from public.players where user_id = auth.uid())
  );
