export interface BookingDetails {
  hotelId: number;
  roomType: string;
  checkIn: string;
  checkOut: string;
  numberOfRooms: number;
  totalPrice: number;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
}