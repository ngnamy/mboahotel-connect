create policy "Admins can view all hotels"
  on public.hotels for select to authenticated
  using (public.is_current_user_admin());

create function public.review_hotel_publication(
  p_hotel_id uuid,
  p_approve boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null or not public.is_current_user_admin() then
    raise exception 'Administrator access required';
  end if;

  update public.hotels
  set status = case when p_approve then 'approved' else 'rejected' end,
      updated_at = now()
  where id = p_hotel_id;

  if not found then
    raise exception 'Hotel not found';
  end if;
end;
$$;

revoke all on function public.review_hotel_publication(uuid, boolean) from public, anon;
grant execute on function public.review_hotel_publication(uuid, boolean) to authenticated;
