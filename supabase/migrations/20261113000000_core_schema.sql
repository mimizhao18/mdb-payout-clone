-- ModeMobile core schema.
-- Tables: settlements (public catalogue), profiles, claims, forms, subscriptions.
-- Every table has Row Level Security (RLS) on, so the app's public key can only
-- reach what the policies below explicitly allow.

-- ---------------------------------------------------------------------------
-- settlements: the catalogue everyone can read. Only you (via the dashboard or
-- service key) can add or change rows.
-- ---------------------------------------------------------------------------
create table public.settlements (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  company text not null,
  -- Matches the brand ids used in onboarding (apple, spotify, ...). Used to
  -- match settlements to the brands a user says they have bought from.
  brand text,
  title text not null,
  amount_label text not null,
  headline text not null,
  estimated_payout numeric(10, 2) not null default 0,
  due_date date not null,
  tag text check (tag in ('no_proof', 'uncapped')),
  category text not null check (category in ('Upcoming', 'Privacy', 'False Ads', 'Overbilling')),
  summary text not null default '',
  description text not null default '',
  -- Official claim website. The app sends users there; it never files for them.
  claim_url text,
  is_featured boolean not null default false,
  claims_filed integer not null default 0,
  claims_total integer not null default 0,
  created_at timestamptz not null default now()
);

create index settlements_brand_idx on public.settlements (brand);
create index settlements_featured_idx on public.settlements (is_featured) where is_featured;

alter table public.settlements enable row level security;

create policy "Anyone can read settlements"
  on public.settlements for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- profiles: one row per user, created automatically when they first sign in.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  payout_method text check (payout_method in ('Credit Card', 'Debit Card', 'Prepaid Card', 'Zelle', 'Venmo')),
  brands text[] not null default '{}',
  referral_code text not null unique default upper(substr(md5(gen_random_uuid()::text), 1, 8)),
  onboarded_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Create the profile row automatically whenever a new auth user appears.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- claims: a user's relationship with a settlement.
--   notified    = we matched it to the user's brands, they have not filed yet
--   in_progress = the user filed it
--   finished    = it has paid out or closed
-- ---------------------------------------------------------------------------
create table public.claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  settlement_id uuid not null references public.settlements (id) on delete cascade,
  status text not null default 'notified' check (status in ('notified', 'in_progress', 'finished')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, settlement_id)
);

create index claims_settlement_idx on public.claims (settlement_id);

alter table public.claims enable row level security;

create policy "Users can read their own claims"
  on public.claims for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own claims"
  on public.claims for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own claims"
  on public.claims for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger claims_set_updated_at
  before update on public.claims
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- forms: the saved record of each claim a user filed (the Forms tab).
-- ---------------------------------------------------------------------------
create table public.forms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  settlement_id uuid not null references public.settlements (id) on delete cascade,
  title text not null,
  submitted_on date not null default current_date,
  status text not null default 'pending' check (status in ('pending', 'payment_sent', 'case_closed')),
  created_at timestamptz not null default now(),
  unique (user_id, settlement_id)
);

create index forms_settlement_idx on public.forms (settlement_id);

alter table public.forms enable row level security;

create policy "Users can read their own forms"
  on public.forms for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their own forms"
  on public.forms for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own forms"
  on public.forms for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- subscriptions: Premium status. Users can READ their own row but cannot write
-- it, so nobody can upgrade themselves from the app. Rows are written by a
-- trusted server (for example an App Store purchase webhook).
-- ---------------------------------------------------------------------------
create table public.subscriptions (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  plan text not null check (plan in ('weekly', 'yearly')),
  status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can read their own subscription"
  on public.subscriptions for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------------
-- wallet_summary: the numbers on the Wallet card, computed per user.
-- security_invoker makes the view obey the caller's RLS, so users only ever
-- aggregate their own claims.
-- ---------------------------------------------------------------------------
create view public.wallet_summary
with (security_invoker = true)
as
select
  c.user_id,
  coalesce(sum(s.estimated_payout) filter (where c.status in ('in_progress', 'finished')), 0) as estimated_payout,
  count(*) filter (where c.status in ('in_progress', 'finished')) as claimed,
  count(*) filter (where c.status = 'notified') as notified
from public.claims c
join public.settlements s on s.id = c.settlement_id
group by c.user_id;

revoke all on public.wallet_summary from anon;

-- ---------------------------------------------------------------------------
-- sync_my_matches(): after onboarding, link the signed-in user to every
-- settlement for a brand they picked, as "notified" claims. Returns how many
-- new matches were added. Safe to call repeatedly.
-- ---------------------------------------------------------------------------
create function public.sync_my_matches()
returns integer
language sql
security invoker
set search_path = ''
as $$
  with added as (
    insert into public.claims (user_id, settlement_id, status)
    select p.id, s.id, 'notified'
    from public.profiles p
    join public.settlements s on s.brand = any (p.brands)
    where p.id = (select auth.uid())
    on conflict (user_id, settlement_id) do nothing
    returning 1
  )
  select count(*)::integer from added;
$$;

revoke execute on function public.sync_my_matches() from public, anon;
grant execute on function public.sync_my_matches() to authenticated;
