create or replace function public.is_current_user_hotel_owner(p_hotel_folder text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select auth.uid() is not null and exists (
    select 1
    from public.hotels hotel
    where hotel.id::text = p_hotel_folder
      and hotel.owner_id = auth.uid()
  );
$$;

revoke all on function public.is_current_user_hotel_owner(text) from public, anon;
grant execute on function public.is_current_user_hotel_owner(text) to authenticated;

drop policy if exists "Hoteliers upload images to their own hotel folders" on storage.objects;
create policy "Hoteliers upload images to their own hotel folders"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'hotel-gallery'
    and public.is_current_user_hotel_owner((storage.foldername(name))[1])
  );

drop policy if exists "Hoteliers update images in their own hotel folders" on storage.objects;
create policy "Hoteliers update images in their own hotel folders"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'hotel-gallery'
    and public.is_current_user_hotel_owner((storage.foldername(name))[1])
  )
  with check (
    bucket_id = 'hotel-gallery'
    and public.is_current_user_hotel_owner((storage.foldername(name))[1])
  );

drop policy if exists "Hoteliers delete images in their own hotel folders" on storage.objects;
create policy "Hoteliers delete images in their own hotel folders"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'hotel-gallery'
    and public.is_current_user_hotel_owner((storage.foldername(name))[1])
  );
