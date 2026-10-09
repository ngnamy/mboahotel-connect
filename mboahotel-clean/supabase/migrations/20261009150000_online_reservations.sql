alter table public.reservations
  add column guest_name text,
  add column guest_email text,
  add column guest_phone text,
  add column special_requests text not null default '';

drop function public.get_public_room_availability(uuid[], date, date);

create function public.get_public_room_availability(
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
    and reservation.status = 'confirmed'
    and reservation.check_in < p_check_out
    and reservation.check_out > p_check_in
  where room.id = any(coalesce(p_room_ids, array[]::uuid[]))
    and room.is_active
    and hotel.status = 'approved'
    and (
      public.has_active_hotel_subscription(hotel.id)
      or hotel.owner_id = auth.uid()
    )
  group by room.id, room.total_units;
end;
$$;

revoke all on function public.get_public_room_availability(uuid[], date, date) from public;
grant execute on function public.get_public_room_availability(uuid[], date, date) to anon, authenticated;

create or replace function public.create_online_reservations(
  p_hotel_id uuid,
  p_room_selections jsonb,
  p_check_in date,
  p_check_out date,
  p_guest_count integer,
  p_special_requests text default ''
)
returns uuid[]
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  profile_row public.profiles%rowtype;
  selection record;
  room_row record;
  reservation_ids uuid[] := array[]::uuid[];
  reservation_id uuid;
  hotel_id_for_booking uuid;
  reserved_units integer;
  selected_capacity numeric := 0;
  nights integer;
  reservation_total numeric;
begin
  if current_user_id is null then
    raise exception 'Connectez-vous pour envoyer une demande de réservation.';
  end if;

  select profile.*
  into profile_row
  from public.profiles profile
  where profile.id = current_user_id
    and profile.role = 'client';

  if not found then
    raise exception 'Un compte client est nécessaire pour réserver.';
  end if;

  if nullif(trim(profile_row.first_name || ' ' || profile_row.last_name), '') is null
    or nullif(trim(profile_row.email), '') is null
    or nullif(trim(profile_row.phone), '') is null
  then
    raise exception 'Complétez votre nom et votre téléphone dans votre profil avant de réserver.';
  end if;

  if p_check_in is null or p_check_out is null or p_check_in < current_date or p_check_out <= p_check_in then
    raise exception 'Choisissez des dates de séjour valides.';
  end if;

  if p_guest_count is null or p_guest_count < 1 then
    raise exception 'Le nombre de voyageurs doit être supérieur à zéro.';
  end if;

  if jsonb_typeof(p_room_selections) is distinct from 'array' then
    raise exception 'La sélection des chambres est invalide.';
  end if;

  if jsonb_array_length(p_room_selections) = 0 then
    raise exception 'Sélectionnez au moins une chambre.';
  end if;

  if exists (
    select 1
    from jsonb_to_recordset(p_room_selections) as item(room_id uuid, room_count integer)
    where item.room_id is null or item.room_count is null or item.room_count < 1
  ) then
    raise exception 'La sélection des chambres est invalide.';
  end if;

  if p_special_requests is not null and char_length(p_special_requests) > 1000 then
    raise exception 'Les demandes spéciales ne peuvent pas dépasser 1 000 caractères.';
  end if;

  nights := p_check_out - p_check_in;

  for selection in
    select item.room_id, sum(item.room_count)::integer as room_count
    from jsonb_to_recordset(p_room_selections) as item(room_id uuid, room_count integer)
    group by item.room_id
    order by item.room_id
  loop
    select room.id, room.hotel_id, room.capacity, room.price_xaf, room.total_units, room.is_active,
           hotel.status as hotel_status
    into room_row
    from public.hotel_rooms room
    join public.hotels hotel on hotel.id = room.hotel_id
    where room.id = selection.room_id
    for update of room;

    if not found then
      raise exception 'Une chambre sélectionnée n’est plus réservable.';
    end if;

    if room_row.hotel_id <> p_hotel_id
      or not room_row.is_active
      or room_row.hotel_status <> 'approved'
      or not public.has_active_hotel_subscription(p_hotel_id)
    then
      raise exception 'Une chambre sélectionnée n’est plus réservable.';
    end if;

    if hotel_id_for_booking is null then
      hotel_id_for_booking := room_row.hotel_id;
    elsif hotel_id_for_booking <> room_row.hotel_id then
      raise exception 'Toutes les chambres doivent appartenir au même établissement.';
    end if;

    select coalesce(sum(reservation.room_count), 0)::integer
    into reserved_units
    from public.reservations reservation
    where reservation.room_id = room_row.id
      and reservation.status = 'confirmed'
      and reservation.check_in < p_check_out
      and reservation.check_out > p_check_in;

    if selection.room_count > greatest(room_row.total_units - reserved_units, 0) then
      raise exception 'Le nombre d’unités disponibles a changé. Actualisez la fiche et réessayez.';
    end if;

    selected_capacity := selected_capacity + room_row.capacity * selection.room_count;
    reservation_total := room_row.price_xaf::numeric * nights * selection.room_count;
    if reservation_total > 2147483647 then
      raise exception 'Le montant total de la réservation dépasse la limite autorisée.';
    end if;

    insert into public.reservations (
      user_id, hotel_id, room_id, check_in, check_out, guest_count, room_count,
      total_price_xaf, status, guest_name, guest_email, guest_phone, special_requests
    )
    values (
      current_user_id, room_row.hotel_id, room_row.id, p_check_in, p_check_out,
      p_guest_count, selection.room_count, reservation_total::integer, 'pending',
      trim(profile_row.first_name || ' ' || profile_row.last_name),
      profile_row.email,
      profile_row.phone,
      coalesce(trim(p_special_requests), '')
    )
    returning id into reservation_id;

    reservation_ids := array_append(reservation_ids, reservation_id);
  end loop;

  if p_guest_count > selected_capacity then
    raise exception 'Le nombre de voyageurs dépasse la capacité des chambres sélectionnées.';
  end if;

  return reservation_ids;
end;
$$;

create or replace function public.review_hotel_reservation(
  p_reservation_id uuid,
  p_action text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  reservation_row public.reservations%rowtype;
  room_row public.hotel_rooms%rowtype;
  hotel_owner_id uuid;
  hotel_status text;
  reserved_units integer;
begin
  if current_user_id is null then
    raise exception 'Connectez-vous pour gérer les réservations.';
  end if;

  if p_action is null or p_action not in ('confirm', 'reject') then
    raise exception 'Action de réservation invalide.';
  end if;

  select reservation.*
  into reservation_row
  from public.reservations reservation
  where reservation.id = p_reservation_id
  for update;

  if not found then
    raise exception 'Demande de réservation introuvable.';
  end if;

  select hotel.owner_id, hotel.status
  into hotel_owner_id, hotel_status
  from public.hotels hotel
  where hotel.id = reservation_row.hotel_id;

  if hotel_owner_id is distinct from current_user_id
    or not exists (
      select 1 from public.profiles profile
      where profile.id = current_user_id and profile.role = 'hotelier'
    )
  then
    raise exception 'Seul le propriétaire de l’établissement peut traiter cette demande.';
  end if;

  if reservation_row.status <> 'pending' then
    raise exception 'Cette demande a déjà été traitée.';
  end if;

  if p_action = 'confirm' then
    if reservation_row.check_in < current_date or hotel_status <> 'approved' then
      raise exception 'Les dates ou le statut de l’établissement ne permettent plus de confirmer cette demande.';
    end if;

    select room.*
    into room_row
    from public.hotel_rooms room
    where room.id = reservation_row.room_id
    for update;

    if not found then
      raise exception 'Cette chambre ou l’abonnement de l’établissement n’est plus actif.';
    end if;

    if not room_row.is_active or not public.has_active_hotel_subscription(reservation_row.hotel_id) then
      raise exception 'Cette chambre ou l’abonnement de l’établissement n’est plus actif.';
    end if;

    select coalesce(sum(reservation.room_count), 0)::integer
    into reserved_units
    from public.reservations reservation
    where reservation.room_id = reservation_row.room_id
      and reservation.status = 'confirmed'
      and reservation.id <> reservation_row.id
      and reservation.check_in < reservation_row.check_out
      and reservation.check_out > reservation_row.check_in;

    if reservation_row.room_count > greatest(room_row.total_units - reserved_units, 0) then
      raise exception 'La disponibilité a changé. La demande ne peut plus être confirmée.';
    end if;
  end if;

  update public.reservations
  set status = case when p_action = 'confirm' then 'confirmed' else 'cancelled' end,
      updated_at = now()
  where id = reservation_row.id;
end;
$$;

revoke all on function public.create_online_reservations(uuid, jsonb, date, date, integer, text) from public, anon;
grant execute on function public.create_online_reservations(uuid, jsonb, date, date, integer, text) to authenticated;

revoke all on function public.review_hotel_reservation(uuid, text) from public, anon;
grant execute on function public.review_hotel_reservation(uuid, text) to authenticated;
