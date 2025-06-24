export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          city: string
          created_at: string
          description: string
          duration: string | null
          featured_image: string | null
          id: string
          is_featured: boolean
          name: string
          price: number | null
          updated_at: string
        }
        Insert: {
          city: string
          created_at?: string
          description: string
          duration?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean
          name: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          description?: string
          duration?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean
          name?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          author_url: string | null
          canonical_url: string | null
          category_id: string | null
          content: string | null
          created_at: string | null
          date_modified: string | null
          excerpt: string | null
          faq_schema: Json | null
          featured: boolean | null
          featured_image: string | null
          featured_image_alt: string | null
          howto_schema: Json | null
          id: string
          image_gallery: string[] | null
          local_business_schema: Json | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          news_keywords: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          og_type: string | null
          og_url: string | null
          publish_date: string | null
          related_searches: string[] | null
          review_rating: number | null
          schema_markup: Json | null
          slug: string
          speakable_schema: Json | null
          status: Database["public"]["Enums"]["blog_status"] | null
          title: string
          twitter_card_type: string | null
          twitter_description: string | null
          twitter_image: string | null
          twitter_title: string | null
          updated_at: string | null
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          author_url?: string | null
          canonical_url?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          date_modified?: string | null
          excerpt?: string | null
          faq_schema?: Json | null
          featured?: boolean | null
          featured_image?: string | null
          featured_image_alt?: string | null
          howto_schema?: Json | null
          id?: string
          image_gallery?: string[] | null
          local_business_schema?: Json | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          news_keywords?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          og_type?: string | null
          og_url?: string | null
          publish_date?: string | null
          related_searches?: string[] | null
          review_rating?: number | null
          schema_markup?: Json | null
          slug: string
          speakable_schema?: Json | null
          status?: Database["public"]["Enums"]["blog_status"] | null
          title: string
          twitter_card_type?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          author_url?: string | null
          canonical_url?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          date_modified?: string | null
          excerpt?: string | null
          faq_schema?: Json | null
          featured?: boolean | null
          featured_image?: string | null
          featured_image_alt?: string | null
          howto_schema?: Json | null
          id?: string
          image_gallery?: string[] | null
          local_business_schema?: Json | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          news_keywords?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          og_type?: string | null
          og_url?: string | null
          publish_date?: string | null
          related_searches?: string[] | null
          review_rating?: number | null
          schema_markup?: Json | null
          slug?: string
          speakable_schema?: Json | null
          status?: Database["public"]["Enums"]["blog_status"] | null
          title?: string
          twitter_card_type?: string | null
          twitter_description?: string | null
          twitter_image?: string | null
          twitter_title?: string | null
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_services: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          price: number
          quantity: number | null
          service_date: string | null
          service_id: string | null
          service_type: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          price: number
          quantity?: number | null
          service_date?: string | null
          service_id?: string | null
          service_type: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          price?: number
          quantity?: number | null
          service_date?: string | null
          service_id?: string | null
          service_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_services_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string | null
          booking_reference: string
          cancellation_date: string | null
          cancellation_reason: string | null
          created_at: string | null
          id: string
          lead_id: string | null
          number_of_travelers: number
          package_id: string | null
          paid_amount: number | null
          payment_details: Json | null
          return_date: string | null
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          travel_date: string | null
          traveler_details: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          booking_date?: string | null
          booking_reference: string
          cancellation_date?: string | null
          cancellation_reason?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          number_of_travelers: number
          package_id?: string | null
          paid_amount?: number | null
          payment_details?: Json | null
          return_date?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          travel_date?: string | null
          traveler_details?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          booking_date?: string | null
          booking_reference?: string
          cancellation_date?: string | null
          cancellation_reason?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          number_of_travelers?: number
          package_id?: string | null
          paid_amount?: number | null
          payment_details?: Json | null
          return_date?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number
          travel_date?: string | null
          traveler_details?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "umrah_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_inquiries: {
        Row: {
          created_at: string | null
          email: string
          id: string
          inquiry_type: string | null
          message: string
          name: string
          phone: string | null
          responded_at: string | null
          responded_by: string | null
          response: string | null
          status: string | null
          subject: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          inquiry_type?: string | null
          message: string
          name: string
          phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          response?: string | null
          status?: string | null
          subject?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          inquiry_type?: string | null
          message?: string
          name?: string
          phone?: string | null
          responded_at?: string | null
          responded_by?: string | null
          response?: string | null
          status?: string | null
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_inquiries_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      database_backups: {
        Row: {
          backup_data: Json
          backup_name: string
          backup_type: string
          created_at: string | null
          id: string
          size_bytes: number
          status: string
          table_count: number
          updated_at: string | null
        }
        Insert: {
          backup_data: Json
          backup_name: string
          backup_type: string
          created_at?: string | null
          id?: string
          size_bytes?: number
          status?: string
          table_count?: number
          updated_at?: string | null
        }
        Update: {
          backup_data?: Json
          backup_name?: string
          backup_type?: string
          created_at?: string | null
          id?: string
          size_bytes?: number
          status?: string
          table_count?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          question: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          answer: string
          category_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          question: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          question?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "faqs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      group_flights: {
        Row: {
          airline: string
          arrival_time: string
          available_seats: number | null
          created_at: string | null
          departure_date: string | null
          departure_time: string
          duration: string
          flight_number: string
          flight_type: Database["public"]["Enums"]["flight_type"] | null
          id: string
          layover_duration: string | null
          luggage_limit: string | null
          max_capacity: number | null
          price: number
          return_date: string | null
          sector: string
          status: string | null
        }
        Insert: {
          airline: string
          arrival_time: string
          available_seats?: number | null
          created_at?: string | null
          departure_date?: string | null
          departure_time: string
          duration: string
          flight_number: string
          flight_type?: Database["public"]["Enums"]["flight_type"] | null
          id?: string
          layover_duration?: string | null
          luggage_limit?: string | null
          max_capacity?: number | null
          price: number
          return_date?: string | null
          sector: string
          status?: string | null
        }
        Update: {
          airline?: string
          arrival_time?: string
          available_seats?: number | null
          created_at?: string | null
          departure_date?: string | null
          departure_time?: string
          duration?: string
          flight_number?: string
          flight_type?: Database["public"]["Enums"]["flight_type"] | null
          id?: string
          layover_duration?: string | null
          luggage_limit?: string | null
          max_capacity?: number | null
          price?: number
          return_date?: string | null
          sector?: string
          status?: string | null
        }
        Relationships: []
      }
      guide_services: {
        Row: {
          availability_schedule: Json | null
          created_at: string | null
          description: string | null
          experience: string | null
          guide_city: string
          guide_contact: string | null
          guide_name: string
          guide_photo: string | null
          id: string
          languages: string[] | null
          qualifications: string[] | null
          rating: number | null
          service_prices: Json | null
          service_type: Database["public"]["Enums"]["guide_service_type"]
          specializations: string[] | null
          status: string | null
        }
        Insert: {
          availability_schedule?: Json | null
          created_at?: string | null
          description?: string | null
          experience?: string | null
          guide_city: string
          guide_contact?: string | null
          guide_name: string
          guide_photo?: string | null
          id?: string
          languages?: string[] | null
          qualifications?: string[] | null
          rating?: number | null
          service_prices?: Json | null
          service_type: Database["public"]["Enums"]["guide_service_type"]
          specializations?: string[] | null
          status?: string | null
        }
        Update: {
          availability_schedule?: Json | null
          created_at?: string | null
          description?: string | null
          experience?: string | null
          guide_city?: string
          guide_contact?: string | null
          guide_name?: string
          guide_photo?: string | null
          id?: string
          languages?: string[] | null
          qualifications?: string[] | null
          rating?: number | null
          service_prices?: Json | null
          service_type?: Database["public"]["Enums"]["guide_service_type"]
          specializations?: string[] | null
          status?: string | null
        }
        Relationships: []
      }
      hotel_bookings: {
        Row: {
          booking_reference: string
          check_in_date: string
          check_out_date: string
          created_at: string | null
          guest_details: Json | null
          hotel_id: string | null
          id: string
          number_of_guests: number
          number_of_rooms: number | null
          room_id: string | null
          special_requests: string | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          user_id: string | null
        }
        Insert: {
          booking_reference: string
          check_in_date: string
          check_out_date: string
          created_at?: string | null
          guest_details?: Json | null
          hotel_id?: string | null
          id?: string
          number_of_guests: number
          number_of_rooms?: number | null
          room_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          user_id?: string | null
        }
        Update: {
          booking_reference?: string
          check_in_date?: string
          check_out_date?: string
          created_at?: string | null
          guest_details?: Json | null
          hotel_id?: string | null
          id?: string
          number_of_guests?: number
          number_of_rooms?: number | null
          room_id?: string | null
          special_requests?: string | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hotel_bookings_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "hotel_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotel_bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_enquiries: {
        Row: {
          check_in: string | null
          check_out: string | null
          country_code: string | null
          email: string | null
          hotel_id: string | null
          hotel_name: string
          id: string
          message: string | null
          name: string
          phone: string | null
          rooms: Json | null
          status: Database["public"]["Enums"]["enquiry_status"] | null
          submitted_at: string | null
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          country_code?: string | null
          email?: string | null
          hotel_id?: string | null
          hotel_name: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          rooms?: Json | null
          status?: Database["public"]["Enums"]["enquiry_status"] | null
          submitted_at?: string | null
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          country_code?: string | null
          email?: string | null
          hotel_id?: string | null
          hotel_name?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          rooms?: Json | null
          status?: Database["public"]["Enums"]["enquiry_status"] | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hotel_enquiries_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_rooms: {
        Row: {
          amenities: string[] | null
          available_rooms: number | null
          capacity: number
          created_at: string | null
          description: string | null
          hotel_id: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          price_per_night: number
          room_type: Database["public"]["Enums"]["room_type"]
        }
        Insert: {
          amenities?: string[] | null
          available_rooms?: number | null
          capacity: number
          created_at?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          price_per_night: number
          room_type: Database["public"]["Enums"]["room_type"]
        }
        Update: {
          amenities?: string[] | null
          available_rooms?: number | null
          capacity?: number
          created_at?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          price_per_night?: number
          room_type?: Database["public"]["Enums"]["room_type"]
        }
        Relationships: [
          {
            foreignKeyName: "hotel_rooms_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels: {
        Row: {
          address: string | null
          amenities: string[] | null
          city: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          distance_from_haram: string | null
          distance_from_masjid_e_nabawi: number | null
          featured: boolean | null
          google_maps_url: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          is_shuttle: boolean | null
          is_walkable: boolean | null
          latitude: string | null
          location: string
          longitude: string | null
          name: string
          price_per_night: number
          rating: number
          status: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          city: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          distance_from_haram?: string | null
          distance_from_masjid_e_nabawi?: number | null
          featured?: boolean | null
          google_maps_url?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_shuttle?: boolean | null
          is_walkable?: boolean | null
          latitude?: string | null
          location: string
          longitude?: string | null
          name: string
          price_per_night: number
          rating: number
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          city?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          distance_from_haram?: string | null
          distance_from_masjid_e_nabawi?: number | null
          featured?: boolean | null
          google_maps_url?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          is_shuttle?: boolean | null
          is_walkable?: boolean | null
          latitude?: string | null
          location?: string
          longitude?: string | null
          name?: string
          price_per_night?: number
          rating?: number
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          assigned_to: string | null
          budget_range: string | null
          city: string | null
          converted_at: string | null
          country: string | null
          created_at: string | null
          email: string | null
          first_name: string
          follow_up_date: string | null
          id: string
          last_name: string | null
          lead_source: string | null
          notes: string | null
          number_of_travelers: number | null
          package_interest: string | null
          phone: string
          service_interest: string | null
          special_requirements: string | null
          status: Database["public"]["Enums"]["lead_status"] | null
          travel_dates: Json | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          budget_range?: string | null
          city?: string | null
          converted_at?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          follow_up_date?: string | null
          id?: string
          last_name?: string | null
          lead_source?: string | null
          notes?: string | null
          number_of_travelers?: number | null
          package_interest?: string | null
          phone: string
          service_interest?: string | null
          special_requirements?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          travel_dates?: Json | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          budget_range?: string | null
          city?: string | null
          converted_at?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          follow_up_date?: string | null
          id?: string
          last_name?: string | null
          lead_source?: string | null
          notes?: string | null
          number_of_travelers?: number | null
          package_interest?: string | null
          phone?: string
          service_interest?: string | null
          special_requirements?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          travel_dates?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_package_interest_fkey"
            columns: ["package_interest"]
            isOneToOne: false
            referencedRelation: "umrah_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string | null
          id: string
          last_name: string | null
          passport_number: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          passport_number?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          passport_number?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          rating: number | null
          reviewable_id: string
          reviewable_type: string
          status: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          rating?: number | null
          reviewable_id: string
          reviewable_type: string
          status?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          rating?: number | null
          reviewable_id?: string
          reviewable_type?: string
          status?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          description: string | null
          id: string
          route_name: string
          trip_distance: string | null
          trip_duration: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          route_name: string
          trip_distance?: string | null
          trip_duration?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          route_name?: string
          trip_distance?: string | null
          trip_duration?: string | null
        }
        Relationships: []
      }
      saudi_visas: {
        Row: {
          application_process: Json | null
          created_at: string | null
          description: string | null
          id: string
          number_of_entries: string
          price: number
          processing_time: string
          required_documents: Json | null
          requirements: string[] | null
          status: Database["public"]["Enums"]["visa_status"] | null
          stay_validity: string
          visa_category: string
          visa_type: string
          visa_validity: string
        }
        Insert: {
          application_process?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          number_of_entries: string
          price: number
          processing_time: string
          required_documents?: Json | null
          requirements?: string[] | null
          status?: Database["public"]["Enums"]["visa_status"] | null
          stay_validity: string
          visa_category: string
          visa_type: string
          visa_validity: string
        }
        Update: {
          application_process?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          number_of_entries?: string
          price?: number
          processing_time?: string
          required_documents?: Json | null
          requirements?: string[] | null
          status?: Database["public"]["Enums"]["visa_status"] | null
          stay_validity?: string
          visa_category?: string
          visa_type?: string
          visa_validity?: string
        }
        Relationships: []
      }
      seo_pages: {
        Row: {
          canonical_url: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          meta_description: string | null
          meta_keywords: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_title: string | null
          page_url: string
          robots_meta: string | null
          schema_markup: Json | null
          twitter_description: string | null
          twitter_title: string | null
          updated_at: string | null
        }
        Insert: {
          canonical_url?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_title?: string | null
          page_url: string
          robots_meta?: string | null
          schema_markup?: Json | null
          twitter_description?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Update: {
          canonical_url?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_keywords?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_title?: string | null
          page_url?: string
          robots_meta?: string | null
          schema_markup?: Json | null
          twitter_description?: string | null
          twitter_title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          setting_key: string
          setting_type: string | null
          setting_value: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key: string
          setting_type?: string | null
          setting_value?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key?: string
          setting_type?: string | null
          setting_value?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          content: string
          created_at: string | null
          customer_location: string | null
          customer_name: string
          customer_photo: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          rating: number | null
          service_type: string | null
          sort_order: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          customer_location?: string | null
          customer_name: string
          customer_photo?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          rating?: number | null
          service_type?: string | null
          sort_order?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          customer_location?: string | null
          customer_name?: string
          customer_photo?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          rating?: number | null
          service_type?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      transport_services: {
        Row: {
          capacity: number
          created_at: string | null
          description: string | null
          driver_contact: string | null
          driver_name: string | null
          features: string[] | null
          id: string
          is_ac: boolean | null
          is_active: boolean | null
          luggage_capacity: string | null
          price: number
          route: string
          trip_distance: string | null
          trip_duration: string | null
          vehicle_details: Json | null
          vehicle_image: string | null
          vehicle_name: string | null
          vehicle_type: Database["public"]["Enums"]["transport_type"]
        }
        Insert: {
          capacity: number
          created_at?: string | null
          description?: string | null
          driver_contact?: string | null
          driver_name?: string | null
          features?: string[] | null
          id?: string
          is_ac?: boolean | null
          is_active?: boolean | null
          luggage_capacity?: string | null
          price: number
          route: string
          trip_distance?: string | null
          trip_duration?: string | null
          vehicle_details?: Json | null
          vehicle_image?: string | null
          vehicle_name?: string | null
          vehicle_type: Database["public"]["Enums"]["transport_type"]
        }
        Update: {
          capacity?: number
          created_at?: string | null
          description?: string | null
          driver_contact?: string | null
          driver_name?: string | null
          features?: string[] | null
          id?: string
          is_ac?: boolean | null
          is_active?: boolean | null
          luggage_capacity?: string | null
          price?: number
          route?: string
          trip_distance?: string | null
          trip_duration?: string | null
          vehicle_details?: Json | null
          vehicle_image?: string | null
          vehicle_name?: string | null
          vehicle_type?: Database["public"]["Enums"]["transport_type"]
        }
        Relationships: []
      }
      umrah_packages: {
        Row: {
          activities: string[] | null
          available_spots: number | null
          booking_deadline: string | null
          category: string | null
          category_id: string | null
          cities_covered: string[] | null
          created_at: string | null
          departure_date: string | null
          description: string | null
          duration: string
          duration_category: string | null
          exclusions: string[] | null
          featured_image: string | null
          flight_details: Json | null
          flight_included: boolean | null
          id: string
          images: string[] | null
          includes: string[] | null
          inclusions: string[] | null
          is_group_package: boolean | null
          itinerary: Json | null
          madinah_hotel: Json | null
          madinah_hotel_id: string | null
          makkah_hotel: Json | null
          makkah_hotel_id: string | null
          max_capacity: number | null
          meal_plan: string | null
          mealPlan: string | null
          min_participants: number | null
          name: string
          package_category: string | null
          package_type: string | null
          packageCategory: string | null
          packageType: string | null
          price: number
          pricing: Json | null
          return_date: string | null
          room_type_pricing: Json | null
          status: Database["public"]["Enums"]["package_status"] | null
          terms_conditions: string | null
          updated_at: string | null
        }
        Insert: {
          activities?: string[] | null
          available_spots?: number | null
          booking_deadline?: string | null
          category?: string | null
          category_id?: string | null
          cities_covered?: string[] | null
          created_at?: string | null
          departure_date?: string | null
          description?: string | null
          duration: string
          duration_category?: string | null
          exclusions?: string[] | null
          featured_image?: string | null
          flight_details?: Json | null
          flight_included?: boolean | null
          id?: string
          images?: string[] | null
          includes?: string[] | null
          inclusions?: string[] | null
          is_group_package?: boolean | null
          itinerary?: Json | null
          madinah_hotel?: Json | null
          madinah_hotel_id?: string | null
          makkah_hotel?: Json | null
          makkah_hotel_id?: string | null
          max_capacity?: number | null
          meal_plan?: string | null
          mealPlan?: string | null
          min_participants?: number | null
          name: string
          package_category?: string | null
          package_type?: string | null
          packageCategory?: string | null
          packageType?: string | null
          price: number
          pricing?: Json | null
          return_date?: string | null
          room_type_pricing?: Json | null
          status?: Database["public"]["Enums"]["package_status"] | null
          terms_conditions?: string | null
          updated_at?: string | null
        }
        Update: {
          activities?: string[] | null
          available_spots?: number | null
          booking_deadline?: string | null
          category?: string | null
          category_id?: string | null
          cities_covered?: string[] | null
          created_at?: string | null
          departure_date?: string | null
          description?: string | null
          duration?: string
          duration_category?: string | null
          exclusions?: string[] | null
          featured_image?: string | null
          flight_details?: Json | null
          flight_included?: boolean | null
          id?: string
          images?: string[] | null
          includes?: string[] | null
          inclusions?: string[] | null
          is_group_package?: boolean | null
          itinerary?: Json | null
          madinah_hotel?: Json | null
          madinah_hotel_id?: string | null
          makkah_hotel?: Json | null
          makkah_hotel_id?: string | null
          max_capacity?: number | null
          meal_plan?: string | null
          mealPlan?: string | null
          min_participants?: number | null
          name?: string
          package_category?: string | null
          package_type?: string | null
          packageCategory?: string | null
          packageType?: string | null
          price?: number
          pricing?: Json | null
          return_date?: string | null
          room_type_pricing?: Json | null
          status?: Database["public"]["Enums"]["package_status"] | null
          terms_conditions?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "umrah_packages_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "umrah_packages_madinah_hotel_id_fkey"
            columns: ["madinah_hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "umrah_packages_makkah_hotel_id_fkey"
            columns: ["makkah_hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          capacity: number
          description: string | null
          features: string[] | null
          id: string
          luggage_capacity: string | null
          vehicle_image: string | null
          vehicle_name: string
          vehicle_type: string
        }
        Insert: {
          capacity: number
          description?: string | null
          features?: string[] | null
          id?: string
          luggage_capacity?: string | null
          vehicle_image?: string | null
          vehicle_name: string
          vehicle_type: string
        }
        Update: {
          capacity?: number
          description?: string | null
          features?: string[] | null
          id?: string
          luggage_capacity?: string | null
          vehicle_image?: string | null
          vehicle_name?: string
          vehicle_type?: string
        }
        Relationships: []
      }
      ziarath_services: {
        Row: {
          best_time: string | null
          created_at: string | null
          description: string | null
          duration: string
          guide_id: string | null
          historical_importance: string | null
          id: string
          images: string[] | null
          inclusions: string[] | null
          location: string
          max_participants: number | null
          price: number
          significance: string | null
          status: string | null
          title: string
          ziarath_type: Database["public"]["Enums"]["ziarath_type"]
        }
        Insert: {
          best_time?: string | null
          created_at?: string | null
          description?: string | null
          duration: string
          guide_id?: string | null
          historical_importance?: string | null
          id?: string
          images?: string[] | null
          inclusions?: string[] | null
          location: string
          max_participants?: number | null
          price: number
          significance?: string | null
          status?: string | null
          title: string
          ziarath_type: Database["public"]["Enums"]["ziarath_type"]
        }
        Update: {
          best_time?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string
          guide_id?: string | null
          historical_importance?: string | null
          id?: string
          images?: string[] | null
          inclusions?: string[] | null
          location?: string
          max_participants?: number | null
          price?: number
          significance?: string | null
          status?: string | null
          title?: string
          ziarath_type?: Database["public"]["Enums"]["ziarath_type"]
        }
        Relationships: [
          {
            foreignKeyName: "ziarath_services_guide_id_fkey"
            columns: ["guide_id"]
            isOneToOne: false
            referencedRelation: "guide_services"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      blog_status: "draft" | "published" | "archived"
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      enquiry_status: "new" | "contacted" | "closed"
      flight_type: "direct" | "connecting"
      guide_service_type:
        | "personal_guide"
        | "group_guide"
        | "ziarath_guide"
        | "translation_service"
      hotel_rating: "3_star" | "4_star" | "5_star" | "luxury"
      lead_status: "new" | "contacted" | "qualified" | "converted" | "lost"
      package_status: "active" | "inactive" | "draft"
      room_type: "single" | "double" | "triple" | "quad" | "family"
      transport_type:
        | "bus"
        | "car"
        | "van"
        | "luxury_car"
        | "Sedan"
        | "Mini Van"
        | "GMC"
        | "Van"
        | "Mini Bus"
        | "Bus"
      visa_status: "active" | "suspended" | "discontinued"
      ziarath_type:
        | "makkah_ziarath"
        | "madinah_ziarath"
        | "taif_ziarath"
        | "badr_ziarath"
        | "jeddah_ziarath"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      blog_status: ["draft", "published", "archived"],
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      enquiry_status: ["new", "contacted", "closed"],
      flight_type: ["direct", "connecting"],
      guide_service_type: [
        "personal_guide",
        "group_guide",
        "ziarath_guide",
        "translation_service",
      ],
      hotel_rating: ["3_star", "4_star", "5_star", "luxury"],
      lead_status: ["new", "contacted", "qualified", "converted", "lost"],
      package_status: ["active", "inactive", "draft"],
      room_type: ["single", "double", "triple", "quad", "family"],
      transport_type: [
        "bus",
        "car",
        "van",
        "luxury_car",
        "Sedan",
        "Mini Van",
        "GMC",
        "Van",
        "Mini Bus",
        "Bus",
      ],
      visa_status: ["active", "suspended", "discontinued"],
      ziarath_type: [
        "makkah_ziarath",
        "madinah_ziarath",
        "taif_ziarath",
        "badr_ziarath",
        "jeddah_ziarath",
      ],
    },
  },
} as const
