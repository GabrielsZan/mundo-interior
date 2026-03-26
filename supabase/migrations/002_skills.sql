-- ── Player Skills (junction table for unlocked skills) ──────────────────────
create table if not exists public.player_skills (
  player_id   uuid references public.players(id) on delete cascade not null,
  skill_id    text not null,
  unlocked_at timestamptz not null default now(),
  primary key (player_id, skill_id)
);

alter table public.player_skills enable row level security;

create policy "Player skills: own player"
  on public.player_skills for all
  using (
    player_id in (select id from public.players where user_id = auth.uid())
  )
  with check (
    player_id in (select id from public.players where user_id = auth.uid())
  );
