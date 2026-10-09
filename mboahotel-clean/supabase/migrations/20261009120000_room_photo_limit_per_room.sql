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

    perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(target_hotel_id::text, 0));
    allowed_count := 3;
    select count(*)::integer into used_count
    from public.hotel_room_photos photo
    where photo.room_id = new.room_id;
  else
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
    end if;
  end if;

  if used_count >= allowed_count then
    if tg_table_name = 'hotel_room_photos' then
      raise exception 'Room photo limit reached (maximum % photos per room)', allowed_count;
    elsif tg_table_name = 'hotel_photos' then
      raise exception 'Hotel photo limit reached for the current subscription (maximum %)', allowed_count;
    else
      raise exception 'Room limit reached for the current subscription (maximum %)', allowed_count;
    end if;
  end if;
  return new;
end;
$$;

create or replace function public.enforce_hotelier_photo_statement_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target record;
  allowed_count integer;
  used_count integer;
begin
  if tg_table_name = 'hotel_photos' then
    for target in select distinct batch.hotel_id from new_rows batch loop
      select coalesce((
        select plan.max_photos
        from public.hotel_subscriptions subscription
        join public.hotel_subscription_plans plan on plan.id = subscription.plan_id
        where subscription.hotel_id = target.hotel_id
          and subscription.status = 'active'
          and subscription.current_period_end > now()
      ), 3) into allowed_count;
      select count(*)::integer into used_count
      from public.hotel_photos photo
      where photo.hotel_id = target.hotel_id;
      if used_count > allowed_count then
        raise exception 'Hotel photo limit reached for the current subscription (maximum %)', allowed_count;
      end if;
    end loop;
  else
    for target in
      select room.hotel_id, batch.room_id
      from new_rows batch
      join public.hotel_rooms room on room.id = batch.room_id
      group by room.hotel_id, batch.room_id
    loop
      select count(*)::integer into used_count
      from public.hotel_room_photos photo
      where photo.room_id = target.room_id;
      if used_count > 3 then
        raise exception 'Room photo limit reached (maximum 3 photos per room)';
      end if;
    end loop;
  end if;
  return null;
end;
$$;
