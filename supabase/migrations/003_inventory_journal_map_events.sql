-- ── Players: novos campos ────────────────────────────────────────────────────
alter table public.players
  add column if not exists has_completed_onboarding boolean not null default false,
  add column if not exists map_state               jsonb,
  add column if not exists event_state             jsonb;

-- ── Inventory Items ───────────────────────────────────────────────────────────
create table if not exists public.inventory_items (
  id           uuid primary key,
  player_id    uuid references public.players(id) on delete cascade not null,
  name         text not null,
  description  text not null default '',
  domain       text not null,
  rarity       text not null,
  icon         text not null default '',
  obtained_at  timestamptz not null,
  from_mission text not null default '',
  created_at   timestamptz not null default now()
);

alter table public.inventory_items enable row level security;

create policy "Inventory: own player"
  on public.inventory_items for all
  using  (player_id in (select id from public.players where user_id = auth.uid()))
  with check (player_id in (select id from public.players where user_id = auth.uid()));

-- ── Journal Entries ───────────────────────────────────────────────────────────
create table if not exists public.journal_entries (
  id            uuid primary key,
  player_id     uuid references public.players(id) on delete cascade not null,
  mission_id    text not null,
  mission_title text not null,
  domain        text not null,
  type          text not null,
  xp_general    integer not null,
  xp_domain     integer not null,
  completed_at  timestamptz not null,
  item_ids      jsonb not null default '[]',
  note          text not null default '',
  created_at    timestamptz not null default now()
);

alter table public.journal_entries enable row level security;

create policy "Journal: own player"
  on public.journal_entries for all
  using  (player_id in (select id from public.players where user_id = auth.uid()))
  with check (player_id in (select id from public.players where user_id = auth.uid()));
