create table public.hotel_room_photos (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.hotel_rooms(id) on delete cascade,
  storage_path text not null unique,
  alt_text text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index hotel_room_photos_room_sort_idx
  on public.hotel_room_photos (room_id, sort_order, created_at);

alter table public.hotel_room_photos enable row level security;

create policy "Published room photos and owners can read photos"
  on public.hotel_room_photos for select to anon, authenticated
  using (
    exists (
      select 1
      from public.hotel_rooms room
      join public.hotels hotel on hotel.id = room.hotel_id
      where room.id = hotel_room_photos.room_id
        and room.is_active
        and hotel.status = 'approved'
        and public.has_active_hotel_subscription(hotel.id)
    )
    or exists (
      select 1
      from public.hotel_rooms room
      join public.hotels hotel on hotel.id = room.hotel_id
      where room.id = hotel_room_photos.room_id and hotel.owner_id = auth.uid()
    )
    or public.is_current_user_admin()
  );

create policy "Hoteliers manage photos for their own rooms"
  on public.hotel_room_photos for all to authenticated
  using (
    exists (
      select 1
      from public.hotel_rooms room
      join public.hotels hotel on hotel.id = room.hotel_id
      where room.id = hotel_room_photos.room_id and hotel.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.hotel_rooms room
      join public.hotels hotel on hotel.id = room.hotel_id
      where room.id = hotel_room_photos.room_id and hotel.owner_id = auth.uid()
    )
  );

revoke insert, update, delete on public.hotel_room_photos from anon, authenticated;
grant select on public.hotel_room_photos to anon, authenticated;
grant insert (room_id, storage_path, alt_text, sort_order) on public.hotel_room_photos to authenticated;
grant update (alt_text, sort_order) on public.hotel_room_photos to authenticated;
grant delete on public.hotel_room_photos to authenticated;

create or replace function public.enforce_hotelier_catalog_limits()
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
  if tg_table_name = 'hotel_room_photos' then
    select room.hotel_id into target_hotel_id
    from public.hotel_rooms room
    where room.id = new.room_id;
  else
    target_hotel_id := new.hotel_id;
  end if;

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
    select
      (select count(*) from public.hotel_photos photo where photo.hotel_id = target_hotel_id)
      + (select count(*)
         from public.hotel_room_photos photo
         join public.hotel_rooms room on room.id = photo.room_id
         where room.hotel_id = target_hotel_id)
      into used_count;
    if used_count >= allowed_count then
      raise exception 'Photo limit reached for the current subscription (maximum %)', allowed_count;
    end if;
  end if;
  return new;
end;
$$;

create trigger hotel_room_photos_plan_limit
  before insert on public.hotel_room_photos
  for each row execute function public.enforce_hotelier_catalog_limits();

create function public.enforce_hotelier_photo_statement_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  inserted_hotel record;
  allowed_count integer;
  used_count integer;
begin
  if tg_table_name = 'hotel_photos' then
    for inserted_hotel in select distinct batch.hotel_id from new_rows batch loop
      select coalesce((
        select plan.max_photos
        from public.hotel_subscriptions subscription
        join public.hotel_subscription_plans plan on plan.id = subscription.plan_id
        where subscription.hotel_id = inserted_hotel.hotel_id
          and subscription.status = 'active'
          and subscription.current_period_end > now()
      ), 3) into allowed_count;
      select
        (select count(*) from public.hotel_photos photo where photo.hotel_id = inserted_hotel.hotel_id)
        + (select count(*)
           from public.hotel_room_photos photo
           join public.hotel_rooms room on room.id = photo.room_id
           where room.hotel_id = inserted_hotel.hotel_id)
        into used_count;
      if used_count > allowed_count then
        raise exception 'Photo limit reached for the current subscription (maximum %)', allowed_count;
      end if;
    end loop;
  else
    for inserted_hotel in
      select distinct room.hotel_id
      from new_rows batch
      join public.hotel_rooms room on room.id = batch.room_id
    loop
      select coalesce((
        select plan.max_photos
        from public.hotel_subscriptions subscription
        join public.hotel_subscription_plans plan on plan.id = subscription.plan_id
        where subscription.hotel_id = inserted_hotel.hotel_id
          and subscription.status = 'active'
          and subscription.current_period_end > now()
      ), 3) into allowed_count;
      select
        (select count(*) from public.hotel_photos photo where photo.hotel_id = inserted_hotel.hotel_id)
        + (select count(*)
           from public.hotel_room_photos photo
           join public.hotel_rooms room on room.id = photo.room_id
           where room.hotel_id = inserted_hotel.hotel_id)
        into used_count;
      if used_count > allowed_count then
        raise exception 'Photo limit reached for the current subscription (maximum %)', allowed_count;
      end if;
    end loop;
  end if;
  return null;
end;
$$;

create trigger hotel_photos_statement_plan_limit
  after insert on public.hotel_photos
  referencing new table as new_rows
  for each statement execute function public.enforce_hotelier_photo_statement_limit();

create trigger hotel_room_photos_statement_plan_limit
  after insert on public.hotel_room_photos
  referencing new table as new_rows
  for each statement execute function public.enforce_hotelier_photo_statement_limit();

drop policy if exists "Hotel gallery images are publicly readable" on storage.objects;
create policy "Hotel gallery and room images are publicly readable"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'hotel-gallery'
    and (
      exists (
        select 1 from public.hotel_photos photo
        join public.hotels hotel on hotel.id = photo.hotel_id
        where photo.storage_path = storage.objects.name
          and hotel.status = 'approved'
          and public.has_active_hotel_subscription(hotel.id)
      )
      or exists (
        select 1 from public.hotel_room_photos photo
        join public.hotel_rooms room on room.id = photo.room_id
        join public.hotels hotel on hotel.id = room.hotel_id
        where photo.storage_path = storage.objects.name
          and room.is_active
          and hotel.status = 'approved'
          and public.has_active_hotel_subscription(hotel.id)
      )
    )
  );
