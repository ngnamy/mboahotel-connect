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
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
