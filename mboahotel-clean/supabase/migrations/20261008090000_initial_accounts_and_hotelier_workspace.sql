create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  first_name text not null default '',
  last_name text not null default '',
  phone text,
  role text not null default 'client' check (role in ('client', 'hotelier', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.partner_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  business_name text not null,
  city text not null,
  phone text not null,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  review_notes text
);

create table public.hotels (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete restrict,
  name text not null,
  description text not null default '',
  address text not null,
  city text not null,
  region text not null,
  phone text not null,
  email text not null,
  website text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.hotel_rooms (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels (id) on delete cascade,
  name text not null,
  description text not null default '',
  capacity integer not null check (capacity > 0),
  price_xaf integer not null check (price_xaf > 0),
  total_units integer not null check (total_units > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete restrict,
  hotel_id uuid not null references public.hotels (id) on delete restrict,
  room_id uuid not null references public.hotel_rooms (id) on delete restrict,
  check_in date not null,
  check_out date not null,
  guest_count integer not null check (guest_count > 0),
  room_count integer not null default 1 check (room_count > 0),
  total_price_xaf integer not null check (total_price_xaf >= 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reservations_valid_dates check (check_out > check_in)
);

create index hotels_owner_id_idx on public.hotels (owner_id);
create index hotel_rooms_hotel_id_idx on public.hotel_rooms (hotel_id);
create index reservations_user_id_idx on public.reservations (user_id);
create index reservations_hotel_id_idx on public.reservations (hotel_id);

create function public.create_profile_for_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (id, email, first_name, last_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(metadata ->> 'first_name', ''),
    coalesce(metadata ->> 'last_name', ''),
    nullif(metadata ->> 'phone', ''),
    'client'
  );

  if metadata ->> 'requested_role' = 'hotelier'
    and nullif(trim(metadata ->> 'business_name'), '') is not null
    and nullif(trim(metadata ->> 'business_city'), '') is not null
    and nullif(trim(metadata ->> 'phone'), '') is not null
  then
    insert into public.partner_applications (user_id, business_name, city, phone)
    values (
      new.id,
      trim(metadata ->> 'business_name'),
      trim(metadata ->> 'business_city'),
      trim(metadata ->> 'phone')
    );
  end if;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_profile_for_new_user();

create function public.is_current_user_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create function public.submit_hotelier_application(
  p_business_name text,
  p_city text,
  p_phone text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  applicant_id uuid := auth.uid();
  application_id uuid;
begin
  if applicant_id is null then
    raise exception 'Authentication required';
  end if;

  if not exists (
    select 1 from public.profiles
    where id = applicant_id and role = 'client'
  ) then
    raise exception 'Only client accounts can apply to become a hotelier';
  end if;

  if nullif(trim(p_business_name), '') is null
    or nullif(trim(p_city), '') is null
    or nullif(trim(p_phone), '') is null
  then
    raise exception 'Business name, city and phone are required';
  end if;

  insert into public.partner_applications (user_id, business_name, city, phone, status, submitted_at, reviewed_at, review_notes)
  values (applicant_id, trim(p_business_name), trim(p_city), trim(p_phone), 'pending', now(), null, null)
  on conflict (user_id) do update
    set business_name = excluded.business_name,
        city = excluded.city,
        phone = excluded.phone,
        status = 'pending',
        submitted_at = now(),
        reviewed_at = null,
        review_notes = null
  returning id into application_id;

  return application_id;
end;
$$;

create function public.review_hotelier_application(
  p_application_id uuid,
  p_approve boolean,
  p_notes text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  reviewer_id uuid := auth.uid();
  applicant_id uuid;
begin
  if reviewer_id is null or not exists (
    select 1 from public.profiles
    where id = reviewer_id and role = 'admin'
  ) then
    raise exception 'Administrator access required';
  end if;

  update public.partner_applications
  set status = case when p_approve then 'approved' else 'rejected' end,
      reviewed_at = now(),
      review_notes = p_notes
  where id = p_application_id
  returning user_id into applicant_id;

  if applicant_id is null then
    raise exception 'Partner application not found';
  end if;

  if p_approve then
    update public.profiles set role = 'hotelier', updated_at = now()
    where id = applicant_id;
  end if;
end;
$$;

alter table public.profiles enable row level security;
alter table public.partner_applications enable row level security;
alter table public.hotels enable row level security;
alter table public.hotel_rooms enable row level security;
alter table public.reservations enable row level security;

create policy "Profiles are visible to their owner and admins"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_current_user_admin());

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

revoke insert, update, delete on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (first_name, last_name, phone, updated_at) on public.profiles to authenticated;

create policy "Applicants and admins can view partner applications"
  on public.partner_applications for select to authenticated
  using (user_id = auth.uid() or public.is_current_user_admin());

revoke insert, update, delete on public.partner_applications from anon, authenticated;
grant select on public.partner_applications to authenticated;

create policy "Approved hotels and their owners can view hotel records"
  on public.hotels for select to anon, authenticated
  using (
    status = 'approved'
    or (owner_id = auth.uid() and exists (
      select 1 from public.profiles owner_profile
      where owner_profile.id = auth.uid() and owner_profile.role = 'hotelier'
    ))
  );

create policy "Approved hoteliers can create hotel records"
  on public.hotels for insert to authenticated
  with check (
    owner_id = auth.uid()
    and status = 'pending'
    and exists (
      select 1 from public.profiles owner_profile
      where owner_profile.id = auth.uid() and owner_profile.role = 'hotelier'
    )
  );

create policy "Approved hoteliers can update their hotel records"
  on public.hotels for update to authenticated
  using (
    owner_id = auth.uid()
    and exists (
      select 1 from public.profiles owner_profile
      where owner_profile.id = auth.uid() and owner_profile.role = 'hotelier'
    )
  )
  with check (
    owner_id = auth.uid()
    and exists (
      select 1 from public.profiles owner_profile
      where owner_profile.id = auth.uid() and owner_profile.role = 'hotelier'
    )
  );

revoke insert, update, delete on public.hotels from anon, authenticated;
grant select on public.hotels to anon, authenticated;
grant insert (owner_id, name, description, address, city, region, phone, email, website) on public.hotels to authenticated;
grant update (name, description, address, city, region, phone, email, website, updated_at) on public.hotels to authenticated;

create policy "Visible rooms belong to approved hotels or the owning hotelier"
  on public.hotel_rooms for select to anon, authenticated
  using (
    is_active and exists (
      select 1 from public.hotels h
      where h.id = hotel_id and h.status = 'approved'
    )
    or exists (
      select 1 from public.hotels h
      join public.profiles owner_profile on owner_profile.id = h.owner_id
      where h.id = hotel_id and h.owner_id = auth.uid() and owner_profile.role = 'hotelier'
    )
  );

create policy "Hoteliers can create rooms for their own hotels"
  on public.hotel_rooms for insert to authenticated
  with check (exists (
    select 1 from public.hotels h
    join public.profiles owner_profile on owner_profile.id = h.owner_id
    where h.id = hotel_id and h.owner_id = auth.uid() and owner_profile.role = 'hotelier'
  ));

create policy "Hoteliers can update rooms for their own hotels"
  on public.hotel_rooms for update to authenticated
  using (exists (
    select 1 from public.hotels h
    join public.profiles owner_profile on owner_profile.id = h.owner_id
    where h.id = hotel_id and h.owner_id = auth.uid() and owner_profile.role = 'hotelier'
  ))
  with check (exists (
    select 1 from public.hotels h
    join public.profiles owner_profile on owner_profile.id = h.owner_id
    where h.id = hotel_id and h.owner_id = auth.uid() and owner_profile.role = 'hotelier'
  ));

create policy "Hoteliers can delete rooms for their own hotels"
  on public.hotel_rooms for delete to authenticated
  using (exists (
    select 1 from public.hotels h
    join public.profiles owner_profile on owner_profile.id = h.owner_id
    where h.id = hotel_id and h.owner_id = auth.uid() and owner_profile.role = 'hotelier'
  ));

revoke insert, update, delete on public.hotel_rooms from anon, authenticated;
grant select on public.hotel_rooms to anon, authenticated;
grant insert (hotel_id, name, description, capacity, price_xaf, total_units, is_active) on public.hotel_rooms to authenticated;
grant update (name, description, capacity, price_xaf, total_units, is_active, updated_at) on public.hotel_rooms to authenticated;
grant delete on public.hotel_rooms to authenticated;

create policy "Customers and owning hoteliers can read reservations"
  on public.reservations for select to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from public.hotels h
      join public.profiles owner_profile on owner_profile.id = h.owner_id
      where h.id = hotel_id and h.owner_id = auth.uid() and owner_profile.role = 'hotelier'
    )
  );

revoke insert, update, delete on public.reservations from anon, authenticated;
grant select on public.reservations to authenticated;

revoke all on function public.submit_hotelier_application(text, text, text) from public;
grant execute on function public.submit_hotelier_application(text, text, text) to authenticated;

revoke all on function public.review_hotelier_application(uuid, boolean, text) from public;
grant execute on function public.review_hotelier_application(uuid, boolean, text) to authenticated;

revoke all on function public.create_profile_for_new_user() from public, anon, authenticated;
revoke all on function public.is_current_user_admin() from public, anon;
grant execute on function public.is_current_user_admin() to authenticated;
