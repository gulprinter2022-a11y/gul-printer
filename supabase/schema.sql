-- Gul Printer Admin CMS — Supabase foundation
-- Phase 1: database, RLS security and media storage

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
$$;

create table if not exists public.portfolio (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_ur text,
  category text not null,
  description_en text,
  description_ur text,
  image_url text not null,
  featured boolean not null default false,
  is_visible boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  description_en text,
  description_ur text,
  is_visible boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  organization text,
  review_en text,
  review_ur text,
  verified boolean not null default true,
  is_visible boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.founder (
  id smallint primary key default 1 check (id = 1),
  photo_url text,
  name text not null default 'Gulraiz Khan Usmani',
  designation_en text,
  designation_ur text,
  bio_en text,
  bio_ur text,
  qualifications_en text,
  qualifications_ur text,
  updated_at timestamptz not null default now()
);

create table if not exists public.business_info (
  id smallint primary key default 1 check (id = 1),
  phone text,
  whatsapp text,
  email text,
  address_en text,
  address_ur text,
  google_maps_url text,
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  weekly_holiday_en text,
  weekly_holiday_ur text,
  whatsapp_default_message_en text,
  whatsapp_default_message_ur text,
  updated_at timestamptz not null default now()
);

create table if not exists public.homepage_content (
  id smallint primary key default 1 check (id = 1),
  tagline_en text,
  tagline_ur text,
  intro_en text,
  intro_ur text,
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists portfolio_updated_at on public.portfolio;
create trigger portfolio_updated_at before update on public.portfolio
for each row execute function public.set_updated_at();

drop trigger if exists clients_updated_at on public.clients;
create trigger clients_updated_at before update on public.clients
for each row execute function public.set_updated_at();

drop trigger if exists testimonials_updated_at on public.testimonials;
create trigger testimonials_updated_at before update on public.testimonials
for each row execute function public.set_updated_at();

drop trigger if exists founder_updated_at on public.founder;
create trigger founder_updated_at before update on public.founder
for each row execute function public.set_updated_at();

drop trigger if exists business_info_updated_at on public.business_info;
create trigger business_info_updated_at before update on public.business_info
for each row execute function public.set_updated_at();

drop trigger if exists homepage_content_updated_at on public.homepage_content;
create trigger homepage_content_updated_at before update on public.homepage_content
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.portfolio enable row level security;
alter table public.clients enable row level security;
alter table public.testimonials enable row level security;
alter table public.founder enable row level security;
alter table public.business_info enable row level security;
alter table public.homepage_content enable row level security;

-- Public visitors can read only content intended for display.
create policy "portfolio public read"
on public.portfolio for select
using (is_visible = true);

create policy "clients public read"
on public.clients for select
using (is_visible = true);

create policy "testimonials public read"
on public.testimonials for select
using (is_visible = true and verified = true);

create policy "founder public read"
on public.founder for select
using (true);

create policy "business public read"
on public.business_info for select
using (true);

create policy "homepage public read"
on public.homepage_content for select
using (true);

-- Only authenticated users listed in admin_users can write CMS content.
create policy "portfolio admin all"
on public.portfolio for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "clients admin all"
on public.clients for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "testimonials admin all"
on public.testimonials for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "founder admin all"
on public.founder for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "business admin all"
on public.business_info for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "homepage admin all"
on public.homepage_content for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Admin users cannot be enumerated by normal visitors.
create policy "admin can read own admin record"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());

-- Seed singleton rows; values can be completed from the admin panel later.
insert into public.founder (id) values (1)
on conflict (id) do nothing;

insert into public.business_info (
  id, phone, whatsapp, email, address_en, google_maps_url,
  facebook_url, instagram_url, tiktok_url, weekly_holiday_en
) values (
  1,
  '+92 316 9827450',
  '+92 316 9827450',
  'gulprinter2022@gmail.com',
  'Shop #08, Ground Floor, S.A Plaza, Babu Haider Road, Mohalla Jangi, Qissa Khwani Bazaar, Peshawar',
  'https://maps.app.goo.gl/ULaPmTkF6dTAzpLx9?g_st=ac',
  'https://www.facebook.com/p/Gul-Printer-100076121053741/',
  'https://www.instagram.com/gul_printer/',
  'https://www.tiktok.com/@gulprinter',
  'Sunday'
)
on conflict (id) do nothing;

insert into public.homepage_content (id, tagline_en)
values (1, 'From Vision to Print')
on conflict (id) do nothing;

-- Public media bucket used for portfolio, client logos and founder photo.
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update set public = excluded.public;

create policy "site media public read"
on storage.objects for select
using (bucket_id = 'site-media');

create policy "site media admin insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'site-media' and public.is_admin());

create policy "site media admin update"
on storage.objects for update
to authenticated
using (bucket_id = 'site-media' and public.is_admin())
with check (bucket_id = 'site-media' and public.is_admin());

create policy "site media admin delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'site-media' and public.is_admin());
