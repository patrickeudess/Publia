-- Publia MVP — schéma complet à exécuter dans l’éditeur SQL Supabase.
-- Toutes les tables exposées utilisent RLS. Aucune clé secrète n’est nécessaire côté client.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 100),
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 2 and 80),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  source_url text not null check (source_url ~* '^https?://'),
  short_description text not null check (char_length(short_description) between 20 and 180),
  long_description text,
  logo_url text,
  cover_url text,
  category text not null,
  creator_name text not null,
  contact_email text,
  linkedin_url text,
  github_url text,
  primary_color text not null default '#0f766e' check (primary_color ~ '^#[0-9A-Fa-f]{6}$'),
  is_public boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_views (
  id bigint generated always as identity primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  referrer text check (char_length(referrer) <= 500)
);

create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists projects_public_slug_idx on public.projects(slug) where is_public and is_active;
create index if not exists project_views_project_id_idx on public.project_views(project_id);
create index if not exists project_views_viewed_at_idx on public.project_views(viewed_at desc);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_views enable row level security;

-- Accès Data API explicites ; RLS reste l’autorité pour chaque ligne.
grant select on public.projects to anon;
grant select, insert, update, delete on public.profiles, public.projects to authenticated;
grant select on public.project_views to authenticated;

create policy "profiles_select_own" on public.profiles for select to authenticated
using ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles for update to authenticated
using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "projects_select_public" on public.projects for select to anon, authenticated
using ((is_public and is_active) or (select auth.uid()) = user_id);
create policy "projects_insert_own" on public.projects for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy "projects_update_own" on public.projects for update to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "projects_delete_own" on public.projects for delete to authenticated
using ((select auth.uid()) = user_id);

create policy "views_select_project_owner" on public.project_views for select to authenticated
using (project_id in (select id from public.projects where user_id = (select auth.uid())));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)));
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
revoke all on function public.set_updated_at() from public, anon, authenticated;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects
for each row execute procedure public.set_updated_at();

-- Cette fonction SECURITY DEFINER est volontairement exposée aux rôles clients :
-- elle n’accepte qu’un identifiant et un referrer borné, vérifie que le projet est
-- réellement public et actif, puis insère une seule visite. Aucun autre accès n’est accordé.
create or replace function public.record_project_view(target_project_id uuid, page_referrer text default null)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.projects
    where id = target_project_id and is_public = true and is_active = true
  ) then
    raise exception 'Project not available';
  end if;

  insert into public.project_views (project_id, referrer)
  values (target_project_id, left(nullif(page_referrer, ''), 500));
end;
$$;
revoke all on function public.record_project_view(uuid, text) from public;
grant execute on function public.record_project_view(uuid, text) to anon, authenticated;

-- Retourne uniquement un agrégat. Les projets non publics restent accessibles
-- exclusivement à leur propriétaire authentifié.
create or replace function public.get_project_view_count(target_project_id uuid)
returns bigint
language sql
stable
security definer set search_path = ''
as $$
  select count(*)
  from public.project_views as views
  where views.project_id = target_project_id
    and exists (
      select 1 from public.projects as projects
      where projects.id = target_project_id
        and ((projects.is_public and projects.is_active) or projects.user_id = (select auth.uid()))
    );
$$;
revoke all on function public.get_project_view_count(uuid) from public;
grant execute on function public.get_project_view_count(uuid) to anon, authenticated;

-- Vérifie la disponibilité sans exposer le projet qui réserve éventuellement le slug.
create or replace function public.is_project_slug_available(candidate_slug text, exclude_project_id uuid default null)
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select candidate_slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    and not exists (
      select 1 from public.projects
      where slug = candidate_slug
        and (
          exclude_project_id is null
          or id <> exclude_project_id
          or user_id <> (select auth.uid())
        )
    );
$$;
revoke all on function public.is_project_slug_available(text, uuid) from public;
grant execute on function public.is_project_slug_available(text, uuid) to authenticated;

-- Vérifications rapides après exécution :
-- select tablename, rowsecurity from pg_tables where schemaname = 'public';
-- select policyname, tablename, roles from pg_policies where schemaname = 'public';
