export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'client' | 'hotelier' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  region: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  rating: number;
  amenities: string[];
  images: string[];
  priceRange: {
    min: number;
    max: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  description: string;
  type: string;
  capacity: number;
  price: number;
  amenities: string[];
  images: string[];
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reservation {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}