-- Supabase schema for ALX Polly - Polling App
-- Run this in the Supabase SQL editor (or via Supabase CLI migrations)

-- Enable required extensions (Supabase generally has pgcrypto available)
-- create extension if not exists pgcrypto;

-- SCHEMA: core tables

create table if not exists public.polls (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  description text,
  is_active boolean not null default true,
  creator_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_polls_creator_id on public.polls(creator_id);

create table if not exists public.poll_options (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  text text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_poll_options_poll_id on public.poll_options(poll_id);
create index if not exists idx_poll_options_poll_position on public.poll_options(poll_id, position);

create table if not exists public.votes (
  id uuid primary key default gen_random_uuid(),
  poll_id uuid not null references public.polls(id) on delete cascade,
  option_id uuid not null references public.poll_options(id) on delete cascade,
  voter_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint fk_vote_option_matches_poll
    foreign key (poll_id, option_id)
    references public.poll_options(poll_id, id) on delete cascade
);

-- Prevent multiple votes per user per poll (for authenticated voters)
create unique index if not exists uq_votes_poll_voter on public.votes(poll_id, voter_id)
  where voter_id is not null;

create index if not exists idx_votes_poll_id on public.votes(poll_id);
create index if not exists idx_votes_option_id on public.votes(option_id);
create index if not exists idx_votes_voter_id on public.votes(voter_id);

-- Helper view: results with counts per option
create or replace view public.poll_results as
select
  po.poll_id,
  po.id as option_id,
  po.text as option_text,
  count(v.id) as votes_count
from public.poll_options po
left join public.votes v on v.option_id = po.id
group by po.poll_id, po.id, po.text
order by po.poll_id, po.position;

-- RLS (Row Level Security)
alter table public.polls enable row level security;
alter table public.poll_options enable row level security;
alter table public.votes enable row level security;

-- Policies for polls
do $$
begin
  -- Read: anyone can read polls
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'polls' and policyname = 'Allow read polls for everyone'
  ) then
    create policy "Allow read polls for everyone" on public.polls
      for select
      using (true);
  end if;

  -- Insert: only authenticated users can create their own polls
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'polls' and policyname = 'Allow insert polls for owner'
  ) then
    create policy "Allow insert polls for owner" on public.polls
      for insert
      with check (auth.uid() = creator_id);
  end if;

  -- Update/Delete: only the poll owner
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'polls' and policyname = 'Allow modify polls for owner'
  ) then
    create policy "Allow modify polls for owner" on public.polls
      for all
      using (auth.uid() = creator_id)
      with check (auth.uid() = creator_id);
  end if;
end $$;

-- Policies for poll_options
do $$
begin
  -- Read: anyone can read options
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'poll_options' and policyname = 'Allow read options for everyone'
  ) then
    create policy "Allow read options for everyone" on public.poll_options
      for select
      using (true);
  end if;

  -- Insert/Update/Delete: only owner of the parent poll
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'poll_options' and policyname = 'Allow manage options for poll owner'
  ) then
    create policy "Allow manage options for poll owner" on public.poll_options
      for all
      using (exists (
        select 1 from public.polls p
        where p.id = poll_options.poll_id and p.creator_id = auth.uid()
      ))
      with check (exists (
        select 1 from public.polls p
        where p.id = poll_options.poll_id and p.creator_id = auth.uid()
      ));
  end if;
end $$;

-- Policies for votes
do $$
begin
  -- Read: anyone can read votes
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'votes' and policyname = 'Allow read votes for everyone'
  ) then
    create policy "Allow read votes for everyone" on public.votes
      for select
      using (true);
  end if;

  -- Insert: authenticated users can vote once per poll (enforced by unique index and with check)
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'votes' and policyname = 'Allow insert vote once per poll for user'
  ) then
    create policy "Allow insert vote once per poll for user" on public.votes
      for insert
      with check (
        auth.uid() is not null
        and voter_id = auth.uid()
        and not exists (
          select 1 from public.votes v2
          where v2.poll_id = votes.poll_id and v2.voter_id = auth.uid()
        )
      );
  end if;

  -- Delete: allow voter to delete their own vote or poll owner to moderate votes
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'votes' and policyname = 'Allow delete vote by voter or poll owner'
  ) then
    create policy "Allow delete vote by voter or poll owner" on public.votes
      for delete
      using (
        voter_id = auth.uid()
        or exists (
          select 1 from public.polls p where p.id = votes.poll_id and p.creator_id = auth.uid()
        )
      );
  end if;
end $$;

-- Triggers
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_polls_updated_at on public.polls;
create trigger set_polls_updated_at
before update on public.polls
for each row execute function public.set_updated_at();

-- Composite FK to ensure vote.option_id belongs to vote.poll_id
-- Already enforced via constraint fk_vote_option_matches_poll above that references (poll_id, id)

-- Optional: composite key on poll_options to support the composite FK
alter table public.poll_options
  drop constraint if exists poll_options_poll_id_id_unique;

-- Ensure (poll_id, id) combination exists for the composite reference
create unique index if not exists uq_poll_options_poll_id_id on public.poll_options(poll_id, id);


