drop policy if exists "Hoteliers manage photos for their own hotels" on public.hotel_photos;
create policy "Hoteliers manage photos for their own hotels"
  on public.hotel_photos for all to authenticated
  using (exists (
    select 1 from public.hotels hotel
    where hotel.id = hotel_id and hotel.owner_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.hotels hotel
    where hotel.id = hotel_id and hotel.owner_id = auth.uid()
  ));

drop policy if exists "Hoteliers upload images to their own hotel folders" on storage.objects;
create policy "Hoteliers upload images to their own hotel folders"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'hotel-gallery'
    and exists (
      select 1 from public.hotels hotel
      where hotel.id::text = (storage.foldername(name))[1]
        and hotel.owner_id = auth.uid()
    )
  );
