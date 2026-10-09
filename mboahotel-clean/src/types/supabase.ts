type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Tables: {
      profiles: Table<
        {
          id: string;
          email: string;
          first_name: string;
          last_name: string;
          phone: string | null;
          role: 'client' | 'hotelier' | 'admin';
          created_at: string;
          updated_at: string;
        },
        {
          id: string;
          email: string;
          first_name?: string;
          last_name?: string;
          phone?: string | null;
          role?: 'client' | 'hotelier' | 'admin';
        },
        { first_name?: string; last_name?: string; phone?: string | null; updated_at?: string }
      >;
      partner_applications: Table<
        {
          id: string;
          user_id: string;
          business_name: string;
          city: string;
          phone: string;
          status: 'pending' | 'approved' | 'rejected';
          submitted_at: string;
          reviewed_at: string | null;
          review_notes: string | null;
        },
        {
          user_id: string;
          business_name: string;
          city: string;
          phone: string;
          status?: 'pending' | 'approved' | 'rejected';
        }
      >;
      hotels: Table<
        {
          id: string;
          owner_id: string;
          name: string;
          description: string;
          address: string;
          city: string;
          region: string;
          phone: string;
          email: string;
          website: string | null;
          latitude: number | null;
          longitude: number | null;
          amenities: string[];
          stars: number;
          check_in_time: string | null;
          check_out_time: string | null;
          cancellation_policy: string;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        },
        {
          owner_id: string;
          name: string;
          description?: string;
          address: string;
          city: string;
          region: string;
          phone: string;
          email: string;
          website?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          amenities?: string[];
          stars?: number;
          check_in_time?: string | null;
          check_out_time?: string | null;
          cancellation_policy?: string;
        },
        {
          name?: string;
          description?: string;
          address?: string;
          city?: string;
          region?: string;
          phone?: string;
          email?: string;
          website?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          amenities?: string[];
          stars?: number;
          check_in_time?: string | null;
          check_out_time?: string | null;
          cancellation_policy?: string;
          updated_at?: string;
        }
      >;
      hotel_rooms: Table<
        {
          id: string;
          hotel_id: string;
          name: string;
          description: string;
          capacity: number;
          price_xaf: number;
          total_units: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        },
        {
          hotel_id: string;
          name: string;
          description?: string;
          capacity: number;
          price_xaf: number;
          total_units: number;
          is_active?: boolean;
        },
        {
          name?: string;
          description?: string;
          capacity?: number;
          price_xaf?: number;
          total_units?: number;
          is_active?: boolean;
          updated_at?: string;
        }
      >;
      hotel_photos: Table<
        {
          id: string;
          hotel_id: string;
          storage_path: string;
          alt_text: string;
          sort_order: number;
          created_at: string;
        },
        {
          hotel_id: string;
          storage_path: string;
          alt_text?: string;
          sort_order?: number;
        },
        { alt_text?: string; sort_order?: number }
      >;
      hotel_room_photos: Table<
        {
          id: string;
          room_id: string;
          storage_path: string;
          alt_text: string;
          sort_order: number;
          created_at: string;
        },
        {
          room_id: string;
          storage_path: string;
          alt_text?: string;
          sort_order?: number;
        },
        { alt_text?: string; sort_order?: number }
      >;
      hotel_subscription_plans: Table<
        {
          id: string;
          code: string;
          name: string;
          description: string;
          monthly_price_xaf: number | null;
          yearly_price_xaf: number | null;
          max_rooms: number;
          max_photos: number;
          priority_listing: boolean;
          featured_listing: boolean;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        },
        {
          code: string;
          name: string;
          description?: string;
          monthly_price_xaf?: number | null;
          yearly_price_xaf?: number | null;
          max_rooms?: number;
          max_photos?: number;
          priority_listing?: boolean;
          featured_listing?: boolean;
          is_active?: boolean;
          sort_order?: number;
        }
      >;
      hotel_subscriptions: Table<
        {
          id: string;
          hotel_id: string;
          plan_id: string;
          billing_cycle: 'monthly' | 'yearly';
          status: 'active' | 'expired' | 'cancelled';
          current_period_start: string;
          current_period_end: string;
          updated_at: string;
        },
        never
      >;
      hotel_subscription_payments: Table<
        {
          id: string;
          hotel_id: string;
          plan_id: string;
          billing_cycle: 'monthly' | 'yearly';
          amount_xaf: number;
          provider: 'mtn_momo' | 'orange_money';
          payer_phone: string;
          transaction_reference: string;
          status: 'pending' | 'approved' | 'rejected';
          submitted_at: string;
          reviewed_at: string | null;
          reviewed_by: string | null;
          review_notes: string | null;
        },
        never
      >;
      platform_payment_settings: Table<
        {
          id: boolean;
          mtn_momo_number: string;
          mtn_momo_name: string;
          orange_money_number: string;
          orange_money_name: string;
          updated_at: string;
        },
        never,
        {
          mtn_momo_number?: string;
          mtn_momo_name?: string;
          orange_money_number?: string;
          orange_money_name?: string;
          updated_at?: string;
        }
      >;
      reservations: Table<
        {
          id: string;
          user_id: string;
          hotel_id: string;
          room_id: string;
          check_in: string;
          check_out: string;
          guest_count: number;
          room_count: number;
          total_price_xaf: number;
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
          created_at: string;
          updated_at: string;
        },
        {
          user_id: string;
          hotel_id: string;
          room_id: string;
          check_in: string;
          check_out: string;
          guest_count: number;
          room_count: number;
          total_price_xaf: number;
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
        }
      >;
    };
    Views: Record<string, never>;
    Functions: {
      submit_hotelier_application: {
        Args: { p_business_name: string; p_city: string; p_phone: string };
        Returns: string;
      };
      review_hotelier_application: {
        Args: { p_application_id: string; p_approve: boolean; p_notes?: string | null };
        Returns: undefined;
      };
      review_hotel_publication: {
        Args: { p_hotel_id: string; p_approve: boolean };
        Returns: undefined;
      };
      submit_hotel_subscription_payment: {
        Args: {
          p_hotel_id: string;
          p_plan_id: string;
          p_billing_cycle: string;
          p_provider: string;
          p_payer_phone: string;
          p_transaction_reference: string;
        };
        Returns: string;
      };
      review_hotel_subscription_payment: {
        Args: { p_payment_id: string; p_approve: boolean; p_notes?: string | null };
        Returns: undefined;
      };
      has_active_hotel_subscription: {
        Args: { p_hotel_id: string };
        Returns: boolean;
      };
      get_public_hotel_entitlements: {
        Args: { p_hotel_ids: string[] };
        Returns: { hotel_id: string; priority_listing: boolean; featured_listing: boolean }[];
      };
      get_public_room_availability: {
        Args: { p_room_ids: string[]; p_check_in: string; p_check_out: string };
        Returns: { room_id: string; total_units: number; reserved_units: number; available_units: number }[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
