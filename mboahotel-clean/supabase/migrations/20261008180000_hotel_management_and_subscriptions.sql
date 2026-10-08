insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('hotel-gallery', 'hotel-gallery', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

alter table public.hotels
  add column amenities text[] not null default '{}',
  add column stars smallint not null default 0 check (stars between 0 and 5),
  add column check_in_time time,
  add column check_out_time time,
  add column cancellation_policy text not null default '';

create table public.hotel_photos (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels (id) on delete cascade,
  storage_path text not null unique,
  alt_text text not null default '' check (char_length(alt_text) <= 250),
  sort_order integer not null default 0 check (sort_order >= 0),
  created_at timestamptz not null default now()
);

create table public.hotel_subscription_plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text not null default '',
  monthly_price_xaf integer check (monthly_price_xaf is null or monthly_price_xaf >= 0),
  yearly_price_xaf integer check (yearly_price_xaf is null or yearly_price_xaf >= 0),
  max_rooms integer not null default 5 check (max_rooms > 0),
  max_photos integer not null default 3 check (max_photos > 0),
  priority_listing boolean not null default false,
  featured_listing boolean not null default false,
  is_active boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hotel_subscription_plans_active_price check (
    not is_active
    or coalesce(monthly_price_xaf > 0, false)
    or coalesce(yearly_price_xaf > 0, false)
  )
);

insert into public.hotel_subscription_plans
  (code, name, description, max_rooms, max_photos, priority_listing, featured_listing, sort_order)
values
  ('essentiel', 'Essentiel', 'Présentez votre établissement et gérez vos chambres.', 5, 5, false, false, 10),
  ('visibilite', 'Visibilité+', 'Plus de chambres et une meilleure mise en avant.', 15, 20, true, false, 20),
  ('premium', 'Premium', 'Capacité étendue, mise en avant et galerie complète.', 50, 60, true, true, 30)
on conflict (code) do nothing;

create table public.hotel_subscriptions (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null unique references public.hotels (id) on delete cascade,
  plan_id uuid not null references public.hotel_subscription_plans (id) on delete restrict,
  billing_cycle text not null check (billing_cycle in ('monthly', 'yearly')),
  status text not null check (status in ('active', 'expired', 'cancelled')),
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  updated_at timestamptz not null default now(),
  constraint hotel_subscriptions_valid_period check (current_period_end > current_period_start)
);

create table public.hotel_subscription_payments (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid not null references public.hotels (id) on delete cascade,
  plan_id uuid not null references public.hotel_subscription_plans (id) on delete restrict,
  billing_cycle text not null check (billing_cycle in ('monthly', 'yearly')),
  amount_xaf integer not null check (amount_xaf > 0),
  provider text not null check (provider in ('mtn_momo', 'orange_money')),
  payer_phone text not null check (char_length(payer_phone) <= 32),
  transaction_reference text not null check (char_length(transaction_reference) between 3 and 128),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles (id) on delete set null,
  review_notes text,
  constraint hotel_subscription_payment_reference_unique unique (provider, transaction_reference)
);

create table public.platform_payment_settings (
  id boolean primary key default true check (id),
  mtn_momo_number text not null default '',
  mtn_momo_name text not null default '',
  orange_money_number text not null default '',
  orange_money_name text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.platform_payment_settings (id) values (true)
on conflict (id) do nothing;

create index hotel_photos_hotel_sort_idx on public.hotel_photos (hotel_id, sort_order, created_at);
create index hotel_subscription_payments_review_idx on public.hotel_subscription_payments (status, submitted_at);

create function public.has_active_hotel_subscription(p_hotel_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.hotel_subscriptions subscription
    where subscription.hotel_id = p_hotel_id
      and subscription.status = 'active'
      and subscription.current_period_end > now()
  );
$$;

create function public.get_public_hotel_entitlements(p_hotel_ids uuid[])
returns table (hotel_id uuid, priority_listing boolean, featured_listing boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select hotel.id, plan.priority_listing, plan.featured_listing
  from public.hotels hotel
  join public.hotel_subscriptions subscription on subscription.hotel_id = hotel.id
  join public.hotel_subscription_plans plan on plan.id = subscription.plan_id
  where hotel.id = any(p_hotel_ids)
    and hotel.status = 'approved'
    and subscription.status = 'active'
    and subscription.current_period_end > now();
$$;

create function public.invalidate_hotel_review_on_profile_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if row(new.name, new.description, new.address, new.city, new.region, new.phone, new.email,
         new.website, new.amenities, new.stars, new.check_in_time, new.check_out_time, new.cancellation_policy)
     is distinct from
     row(old.name, old.description, old.address, old.city, old.region, old.phone, old.email,
         old.website, old.amenities, old.stars, old.check_in_time, old.check_out_time, old.cancellation_policy)
  then
    new.status := 'pending';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger hotels_profile_changes_require_review
  before update on public.hotels
  for each row execute function public.invalidate_hotel_review_on_profile_change();

create function public.enforce_hotelier_catalog_limits()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_hotel_id uuid;
  allowed_count integer;
  used_count integer;
begin
  target_hotel_id := new.hotel_id;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(target_hotel_id::text, 0));
  if tg_table_name = 'hotel_rooms' then
    select coalesce((
      select plan.max_rooms
      from public.hotel_subscriptions subscription
      join public.hotel_subscription_plans plan on plan.id = subscription.plan_id
      where subscription.hotel_id = target_hotel_id
        and subscription.status = 'active'
        and subscription.current_period_end > now()
    ), 5) into allowed_count;
    select count(*)::integer into used_count
    from public.hotel_rooms room where room.hotel_id = target_hotel_id;
    if used_count >= allowed_count then
      raise exception 'Room limit reached for the current subscription (maximum %)', allowed_count;
    end if;
  else
    select coalesce((
      select plan.max_photos
      from public.hotel_subscriptions subscription
      join public.hotel_subscription_plans plan on plan.id = subscription.plan_id
      where subscription.hotel_id = target_hotel_id
        and subscription.status = 'active'
        and subscription.current_period_end > now()
    ), 3) into allowed_count;
    select count(*)::integer into used_count
    from public.hotel_photos photo where photo.hotel_id = target_hotel_id;
    if used_count >= allowed_count then
      raise exception 'Photo limit reached for the current subscription (maximum %)', allowed_count;
    end if;
  end if;
  return new;
end;
$$;

create trigger hotel_rooms_plan_limit
  before insert on public.hotel_rooms
  for each row execute function public.enforce_hotelier_catalog_limits();

create trigger hotel_photos_plan_limit
  before insert on public.hotel_photos
  for each row execute function public.enforce_hotelier_catalog_limits();

create function public.submit_hotel_subscription_payment(
  p_hotel_id uuid,
  p_plan_id uuid,
  p_billing_cycle text,
  p_provider text,
  p_payer_phone text,
  p_transaction_reference text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  payment_id uuid;
  payment_amount integer;
begin
  if current_user_id is null or not exists (
    select 1 from public.profiles
    where id = current_user_id and role = 'hotelier'
  ) then
    raise exception 'Hotelier access required';
  end if;
  if p_billing_cycle is null
    or p_billing_cycle not in ('monthly', 'yearly')
    or p_provider is null
    or p_provider not in ('mtn_momo', 'orange_money')
    or nullif(trim(p_payer_phone), '') is null
    or nullif(trim(p_transaction_reference), '') is null
    or char_length(trim(p_payer_phone)) > 32
    or char_length(trim(p_transaction_reference)) not between 3 and 128
  then
    raise exception 'Valid payment details are required';
  end if;
  if not exists (
    select 1 from public.hotels
    where id = p_hotel_id and owner_id = current_user_id
  ) then
    raise exception 'Hotel not found or not owned by the current user';
  end if;

  select case when p_billing_cycle = 'monthly' then plan.monthly_price_xaf else plan.yearly_price_xaf end
  into payment_amount
  from public.hotel_subscription_plans plan
  where plan.id = p_plan_id and plan.is_active;
  if payment_amount is null or payment_amount <= 0 then
    raise exception 'This plan is not available for the selected billing cycle';
  end if;

  insert into public.hotel_subscription_payments
    (hotel_id, plan_id, billing_cycle, amount_xaf, provider, payer_phone, transaction_reference)
  values (
    p_hotel_id, p_plan_id, p_billing_cycle, payment_amount, p_provider,
    trim(p_payer_phone), trim(p_transaction_reference)
  )
  returning id into payment_id;
  return payment_id;
end;
$$;

create function public.review_hotel_subscription_payment(
  p_payment_id uuid,
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
  payment_row public.hotel_subscription_payments%rowtype;
  period_start timestamptz;
begin
  if reviewer_id is null or not public.is_current_user_admin() then
    raise exception 'Administrator access required';
  end if;

  select * into payment_row
  from public.hotel_subscription_payments
  where id = p_payment_id
  for update;
  if not found or payment_row.status <> 'pending' then
    raise exception 'Pending subscription payment not found';
  end if;

  update public.hotel_subscription_payments
  set status = case when p_approve then 'approved' else 'rejected' end,
      reviewed_at = now(),
      reviewed_by = reviewer_id,
      review_notes = p_notes
  where id = p_payment_id;

  if not p_approve then
    return;
  end if;

  perform 1 from public.hotels where id = payment_row.hotel_id for update;
  select greatest(now(), coalesce(subscription.current_period_end, now()))
  into period_start
  from (select 1) seed
  left join public.hotel_subscriptions subscription on subscription.hotel_id = payment_row.hotel_id;

  insert into public.hotel_subscriptions
    (hotel_id, plan_id, billing_cycle, status, current_period_start, current_period_end, updated_at)
  values (
    payment_row.hotel_id,
    payment_row.plan_id,
    payment_row.billing_cycle,
    'active',
    period_start,
    case when payment_row.billing_cycle = 'monthly'
      then period_start + interval '1 month'
      else period_start + interval '1 year'
    end,
    now()
  )
  on conflict (hotel_id) do update
  set plan_id = excluded.plan_id,
      billing_cycle = excluded.billing_cycle,
      status = 'active',
      current_period_start = excluded.current_period_start,
      current_period_end = excluded.current_period_end,
      updated_at = now();
end;
$$;

alter table public.hotel_photos enable row level security;
alter table public.hotel_subscription_plans enable row level security;
alter table public.hotel_subscriptions enable row level security;
alter table public.hotel_subscription_payments enable row level security;

drop policy "Approved hotels and their owners can view hotel records" on public.hotels;
create policy "Approved subscribed hotels and their owners can view hotel records"
  on public.hotels for select to anon, authenticated
  using (
    (status = 'approved' and public.has_active_hotel_subscription(id))
    or (owner_id = auth.uid() and exists (
      select 1 from public.profiles owner_profile
      where owner_profile.id = auth.uid() and owner_profile.role = 'hotelier'
    ))
    or public.is_current_user_admin()
  );

drop policy "Visible rooms belong to approved hotels or the owning hotelier" on public.hotel_rooms;
create policy "Visible rooms belong to approved subscribed hotels or their owners"
  on public.hotel_rooms for select to anon, authenticated
  using (
    (is_active and exists (
      select 1 from public.hotels hotel
      where hotel.id = hotel_id
        and hotel.status = 'approved'
        and public.has_active_hotel_subscription(hotel.id)
    ))
    or exists (
      select 1 from public.hotels hotel
      join public.profiles owner_profile on owner_profile.id = hotel.owner_id
      where hotel.id = hotel_id and hotel.owner_id = auth.uid() and owner_profile.role = 'hotelier'
    )
    or public.is_current_user_admin()
  );

create policy "Approved hotel photos and owners can read photos"
  on public.hotel_photos for select to anon, authenticated
  using (
    exists (
      select 1 from public.hotels hotel
      where hotel.id = hotel_id
        and hotel.status = 'approved'
        and public.has_active_hotel_subscription(hotel.id)
    )
    or exists (
      select 1 from public.hotels hotel
      where hotel.id = hotel_id and hotel.owner_id = auth.uid()
    )
    or public.is_current_user_admin()
  );

create policy "Hoteliers manage photos for their own hotels"
  on public.hotel_photos for all to authenticated
  using (exists (
    select 1 from public.hotels hotel
    join public.profiles owner_profile on owner_profile.id = hotel.owner_id
    where hotel.id = hotel_id and hotel.owner_id = auth.uid() and owner_profile.role = 'hotelier'
  ))
  with check (exists (
    select 1 from public.hotels hotel
    join public.profiles owner_profile on owner_profile.id = hotel.owner_id
    where hotel.id = hotel_id and hotel.owner_id = auth.uid() and owner_profile.role = 'hotelier'
  ));

create policy "Hoteliers and admins can read subscription plans"
  on public.hotel_subscription_plans for select to authenticated
  using (
    is_active
    or public.is_current_user_admin()
    or exists (
      select 1 from public.hotel_subscriptions subscription
      join public.hotels hotel on hotel.id = subscription.hotel_id
      where subscription.plan_id = hotel_subscription_plans.id
        and hotel.owner_id = auth.uid()
    )
  );
create policy "Admins manage subscription plans"
  on public.hotel_subscription_plans for all to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

create policy "Hoteliers and admins can read hotel subscriptions"
  on public.hotel_subscriptions for select to authenticated
  using (
    public.is_current_user_admin()
    or exists (
      select 1 from public.hotels hotel
      where hotel.id = hotel_id and hotel.owner_id = auth.uid()
    )
  );

create policy "Hoteliers and admins can read subscription payment requests"
  on public.hotel_subscription_payments for select to authenticated
  using (
    public.is_current_user_admin()
    or exists (
      select 1 from public.hotels hotel
      where hotel.id = hotel_id and hotel.owner_id = auth.uid()
    )
  );

create policy "Hoteliers and admins can read payment instructions"
  on public.platform_payment_settings for select to authenticated
  using (
    public.is_current_user_admin()
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'hotelier'
    )
  );
create policy "Admins manage payment instructions"
  on public.platform_payment_settings for update to authenticated
  using (public.is_current_user_admin())
  with check (public.is_current_user_admin());

revoke insert, update, delete on public.hotel_photos from anon, authenticated;
grant select on public.hotel_photos to anon, authenticated;
grant insert (hotel_id, storage_path, alt_text, sort_order) on public.hotel_photos to authenticated;
grant update (alt_text, sort_order) on public.hotel_photos to authenticated;
grant delete on public.hotel_photos to authenticated;

revoke insert, update, delete on public.hotel_subscription_plans from anon, authenticated;
grant select on public.hotel_subscription_plans to authenticated;
grant update (name, description, monthly_price_xaf, yearly_price_xaf, max_rooms, max_photos, priority_listing, featured_listing, is_active, sort_order, updated_at)
  on public.hotel_subscription_plans to authenticated;

revoke insert, update, delete on public.hotel_subscriptions from anon, authenticated;
grant select on public.hotel_subscriptions to authenticated;
revoke insert, update, delete on public.hotel_subscription_payments from anon, authenticated;
grant select on public.hotel_subscription_payments to authenticated;
alter table public.platform_payment_settings enable row level security;
revoke insert, update, delete on public.platform_payment_settings from anon, authenticated;
grant select on public.platform_payment_settings to authenticated;
grant update (mtn_momo_number, mtn_momo_name, orange_money_number, orange_money_name, updated_at)
  on public.platform_payment_settings to authenticated;

grant update (name, description, address, city, region, phone, email, website, amenities, stars, check_in_time, check_out_time, cancellation_policy, updated_at)
  on public.hotels to authenticated;

create policy "Hotel gallery images are publicly readable"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'hotel-gallery' and exists (
    select 1 from public.hotel_photos photo
    join public.hotels hotel on hotel.id = photo.hotel_id
    where photo.storage_path = name
      and hotel.status = 'approved'
      and public.has_active_hotel_subscription(hotel.id)
  ));

create policy "Hoteliers upload images to their own hotel folders"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'hotel-gallery'
    and exists (
      select 1 from public.hotels hotel
      join public.profiles owner_profile on owner_profile.id = hotel.owner_id
      where hotel.id::text = (storage.foldername(name))[1]
        and hotel.owner_id = auth.uid()
        and owner_profile.role = 'hotelier'
    )
  );

create policy "Hoteliers update images in their own hotel folders"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'hotel-gallery'
    and exists (
      select 1 from public.hotels hotel
      where hotel.id::text = (storage.foldername(name))[1] and hotel.owner_id = auth.uid()
    )
  )
  with check (
    bucket_id = 'hotel-gallery'
    and exists (
      select 1 from public.hotels hotel
      where hotel.id::text = (storage.foldername(name))[1] and hotel.owner_id = auth.uid()
    )
  );

create policy "Hoteliers delete images in their own hotel folders"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'hotel-gallery'
    and exists (
      select 1 from public.hotels hotel
      where hotel.id::text = (storage.foldername(name))[1] and hotel.owner_id = auth.uid()
    )
  );

revoke all on function public.has_active_hotel_subscription(uuid) from public, anon;
grant execute on function public.has_active_hotel_subscription(uuid) to anon, authenticated;
revoke all on function public.get_public_hotel_entitlements(uuid[]) from public;
grant execute on function public.get_public_hotel_entitlements(uuid[]) to anon, authenticated;
grant execute on function public.is_current_user_admin() to anon;
revoke all on function public.invalidate_hotel_review_on_profile_change() from public, anon, authenticated;
revoke all on function public.enforce_hotelier_catalog_limits() from public, anon, authenticated;
revoke all on function public.submit_hotel_subscription_payment(uuid, uuid, text, text, text, text) from public, anon;
grant execute on function public.submit_hotel_subscription_payment(uuid, uuid, text, text, text, text) to authenticated;
revoke all on function public.review_hotel_subscription_payment(uuid, boolean, text) from public, anon;
grant execute on function public.review_hotel_subscription_payment(uuid, boolean, text) to authenticated;
