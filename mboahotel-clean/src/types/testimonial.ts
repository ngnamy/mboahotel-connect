// Types pour le système de témoignages

export interface Testimonial {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  title: string;
  content: string;
  rating: number; // Note sur 5
  location: string; // Ville de l'utilisateur
  hotelName?: string; // Hôtel concerné (optionnel)
  createdAt: Date;
  updatedAt: Date;
  isApproved: boolean; // Modération
  isPublic: boolean;
  likes: number;
  category: TestimonialCategory;
}

export enum TestimonialCategory {
  GENERAL = 'general',
  HOTEL_EXPERIENCE = 'hotel_experience',
  APP_USAGE = 'app_usage',
  CUSTOMER_SERVICE = 'customer_service',
  BOOKING_PROCESS = 'booking_process'
}

export interface TestimonialFormData {
  title: string;
  content: string;
  rating: number;
  location: string;
  hotelName?: string;
  category: TestimonialCategory;
  isPublic: boolean;
}

export interface TestimonialFilters {
  category?: TestimonialCategory;
  rating?: number;
  location?: string;
  sortBy: 'recent' | 'rating' | 'likes';
}