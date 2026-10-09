alter table public.hotels
  add column if not exists latitude double precision,
  add column if not exists longitude double precision;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'hotels_coordinates_pair_check'
      and conrelid = 'public.hotels'::regclass
  ) then
    alter table public.hotels
      add constraint hotels_coordinates_pair_check
      check ((latitude is null and longitude is null) or (latitude is not null and longitude is not null));
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'hotels_latitude_range_check'
      and conrelid = 'public.hotels'::regclass
  ) then
    alter table public.hotels
      add constraint hotels_latitude_range_check
      check (latitude is null or latitude between -90 and 90);
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'hotels_longitude_range_check'
      and conrelid = 'public.hotels'::regclass
  ) then
    alter table public.hotels
      add constraint hotels_longitude_range_check
      check (longitude is null or longitude between -180 and 180);
  end if;
end;
$$;

create or replace function public.invalidate_hotel_review_on_profile_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if row(new.name, new.description, new.address, new.city, new.region, new.phone, new.email,
         new.website, new.latitude, new.longitude, new.amenities, new.stars,
         new.check_in_time, new.check_out_time, new.cancellation_policy)
     is distinct from
     row(old.name, old.description, old.address, old.city, old.region, old.phone, old.email,
         old.website, old.latitude, old.longitude, old.amenities, old.stars,
         old.check_in_time, old.check_out_time, old.cancellation_policy)
  then
    new.status := 'pending';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

grant update (latitude, longitude) on public.hotels to authenticated;

create or replace function public.get_public_room_availability(
  p_room_ids uuid[],
  p_check_in date,
  p_check_out date
)
returns table (
  room_id uuid,
  total_units integer,
  reserved_units integer,
  available_units integer
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if p_check_in is null or p_check_out is null or p_check_out <= p_check_in then
    raise exception 'Check-out date must be after check-in date';
  end if;

  return query
  select
    room.id,
    room.total_units::integer,
    coalesce(sum(reservation.room_count), 0)::integer,
    greatest(room.total_units - coalesce(sum(reservation.room_count), 0)::integer, 0)
  from public.hotel_rooms room
  join public.hotels hotel on hotel.id = room.hotel_id
  left join public.reservations reservation
    on reservation.room_id = room.id
    -- Pending requests do not reserve inventory until an administrator confirms them.
    and reservation.status = 'confirmed'
    and reservation.check_in < p_check_out
    and reservation.check_out > p_check_in
  where room.id = any(coalesce(p_room_ids, array[]::uuid[]))
    and room.is_active
    and hotel.status = 'approved'
    and public.has_active_hotel_subscription(hotel.id)
  group by room.id, room.total_units;
end;
$$;

revoke all on function public.get_public_room_availability(uuid[], date, date) from public;
grant execute on function public.get_public_room_availability(uuid[], date, date) to anon, authenticated;
