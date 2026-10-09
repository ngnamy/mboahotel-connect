alter table public.reservations
  alter column user_id drop not null;

create policy "Admins can read all reservations"
  on public.reservations for select to authenticated
  using (public.is_current_user_admin());

create or replace function public.create_staff_reservation(
  p_hotel_id uuid,
  p_room_id uuid,
  p_guest_name text,
  p_guest_email text,
  p_guest_phone text,
  p_check_in date,
  p_check_out date,
  p_guest_count integer,
  p_room_count integer,
  p_special_requests text default ''
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  current_user_role text;
  hotel_owner_id uuid;
  hotel_status text;
  room_row public.hotel_rooms%rowtype;
  reserved_units integer;
  nights integer;
  reservation_total numeric;
  reservation_id uuid;
begin
  if current_user_id is null then
    raise exception 'Connectez-vous pour enregistrer une réservation.';
  end if;

  select profile.role
  into current_user_role
  from public.profiles profile
  where profile.id = current_user_id;

  if current_user_role is null or current_user_role not in ('admin', 'hotelier') then
    raise exception 'Seuls un administrateur ou un hôtelier peuvent enregistrer une réservation.';
  end if;

  if nullif(trim(p_guest_name), '') is null or nullif(trim(p_guest_phone), '') is null then
    raise exception 'Le nom et le téléphone du client sont obligatoires.';
  end if;

  if char_length(trim(p_guest_name)) > 160
    or char_length(trim(p_guest_phone)) > 40
    or char_length(coalesce(trim(p_guest_email), '')) > 254
    or char_length(coalesce(trim(p_special_requests), '')) > 2000
  then
    raise exception 'Une des informations saisies dépasse la longueur autorisée.';
  end if;

  if p_hotel_id is null or p_room_id is null then
    raise exception 'Choisissez un établissement et une chambre.';
  end if;

  select hotel.owner_id, hotel.status
  into hotel_owner_id, hotel_status
  from public.hotels hotel
  where hotel.id = p_hotel_id
  for update;

  if not found then
    raise exception 'Établissement introuvable.';
  end if;

  if current_user_role = 'hotelier' and hotel_owner_id <> current_user_id then
    raise exception 'Vous ne pouvez enregistrer des réservations que pour vos établissements.';
  end if;

  if hotel_status <> 'approved' then
    raise exception 'L’établissement doit être approuvé avant d’enregistrer une réservation.';
  end if;

  select room.*
  into room_row
  from public.hotel_rooms room
  where room.id = p_room_id
    and room.hotel_id = p_hotel_id
    and room.is_active
  for update;

  if not found then
    raise exception 'La chambre sélectionnée est inactive ou ne dépend pas de cet établissement.';
  end if;

  if p_check_in is null or p_check_out is null
    or p_check_in < current_date
    or p_check_out <= p_check_in
  then
    raise exception 'Choisissez des dates de séjour valides.';
  end if;

  if p_guest_count is null or p_guest_count < 1
    or p_room_count is null or p_room_count < 1
  then
    raise exception 'Le nombre de voyageurs et de chambres doit être supérieur à zéro.';
  end if;

  if p_guest_count > room_row.capacity::bigint * p_room_count then
    raise exception 'Le nombre de voyageurs dépasse la capacité des chambres sélectionnées.';
  end if;

  if p_special_requests is not null and char_length(p_special_requests) > 2000 then
    raise exception 'Les demandes particulières ne peuvent pas dépasser 2 000 caractères.';
  end if;

  select coalesce(sum(reservation.room_count), 0)::integer
  into reserved_units
  from public.reservations reservation
  where reservation.room_id = p_room_id
    and reservation.status = 'confirmed'
    and reservation.check_in < p_check_out
    and reservation.check_out > p_check_in;

  if p_room_count > greatest(room_row.total_units - reserved_units, 0) then
    raise exception 'La disponibilité a changé. Le nombre de chambres demandé n’est plus disponible.';
  end if;

  nights := p_check_out - p_check_in;
  reservation_total := room_row.price_xaf::numeric * nights * p_room_count;
  if reservation_total > 2147483647 then
    raise exception 'Le montant total de la réservation dépasse la limite autorisée.';
  end if;

  insert into public.reservations (
    user_id, hotel_id, room_id, check_in, check_out, guest_count, room_count,
    total_price_xaf, status, guest_name, guest_email, guest_phone, special_requests
  )
  values (
    null, p_hotel_id, p_room_id, p_check_in, p_check_out, p_guest_count, p_room_count,
    reservation_total::integer, 'confirmed', trim(p_guest_name),
    nullif(trim(coalesce(p_guest_email, '')), ''),
    trim(p_guest_phone),
    coalesce(trim(p_special_requests), '')
  )
  returning id into reservation_id;

  return reservation_id;
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
  current_user_role text;
  reservation_row public.reservations%rowtype;
  room_row public.hotel_rooms%rowtype;
  hotel_owner_id uuid;
  hotel_status text;
  reserved_units integer;
begin
  if current_user_id is null then
    raise exception 'Connectez-vous pour gérer les réservations.';
  end if;

  select profile.role
  into current_user_role
  from public.profiles profile
  where profile.id = current_user_id;

  if current_user_role is null or current_user_role not in ('admin', 'hotelier') then
    raise exception 'Seuls un administrateur ou un hôtelier peuvent gérer les réservations.';
  end if;

  if p_action is null or p_action not in ('confirm', 'reject', 'cancel') then
    raise exception 'Action de réservation invalide.';
  end if;

  select reservation.*
  into reservation_row
  from public.reservations reservation
  where reservation.id = p_reservation_id
  for update;

  if not found then
    raise exception 'Réservation introuvable.';
  end if;

  select hotel.owner_id, hotel.status
  into hotel_owner_id, hotel_status
  from public.hotels hotel
  where hotel.id = reservation_row.hotel_id;

  if current_user_role = 'hotelier' and hotel_owner_id is distinct from current_user_id then
    raise exception 'Vous ne pouvez gérer que les réservations de vos établissements.';
  end if;

  if p_action in ('confirm', 'reject') and reservation_row.status <> 'pending' then
    raise exception 'Seules les demandes en attente peuvent être confirmées ou refusées.';
  end if;

  if p_action = 'cancel' and reservation_row.status <> 'pending' and reservation_row.status <> 'confirmed' then
    raise exception 'Seules les réservations en attente ou confirmées peuvent être annulées.';
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

    if not found or not room_row.is_active
      or not public.has_active_hotel_subscription(reservation_row.hotel_id)
    then
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
  set status = case
        when p_action = 'confirm' then 'confirmed'
        else 'cancelled'
      end,
      updated_at = now()
  where id = reservation_row.id;
end;
$$;

revoke all on function public.create_staff_reservation(uuid, uuid, text, text, text, date, date, integer, integer, text) from public, anon;
grant execute on function public.create_staff_reservation(uuid, uuid, text, text, text, date, date, integer, integer, text) to authenticated;

revoke all on function public.review_hotel_reservation(uuid, text) from public, anon;
grant execute on function public.review_hotel_reservation(uuid, text) to authenticated;

notify pgrst, 'reload schema';
