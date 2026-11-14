// Generated from the Supabase schema (see supabase/migrations). Regenerate it
// after changing tables so the app's types stay in sync with the database.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.18';
  };
  public: {
    Tables: {
      claims: {
        Row: {
          created_at: string;
          id: string;
          settlement_id: string;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          settlement_id: string;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          settlement_id?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'claims_settlement_id_fkey';
            columns: ['settlement_id'];
            isOneToOne: false;
            referencedRelation: 'settlements';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'claims_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      forms: {
        Row: {
          created_at: string;
          id: string;
          settlement_id: string;
          status: string;
          submitted_on: string;
          title: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          settlement_id: string;
          status?: string;
          submitted_on?: string;
          title: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          settlement_id?: string;
          status?: string;
          submitted_on?: string;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'forms_settlement_id_fkey';
            columns: ['settlement_id'];
            isOneToOne: false;
            referencedRelation: 'settlements';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'forms_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          brands: string[];
          created_at: string;
          id: string;
          onboarded_at: string | null;
          payout_method: string | null;
          referral_code: string;
        };
        Insert: {
          brands?: string[];
          created_at?: string;
          id: string;
          onboarded_at?: string | null;
          payout_method?: string | null;
          referral_code?: string;
        };
        Update: {
          brands?: string[];
          created_at?: string;
          id?: string;
          onboarded_at?: string | null;
          payout_method?: string | null;
          referral_code?: string;
        };
        Relationships: [];
      };
      settlements: {
        Row: {
          amount_label: string;
          brand: string | null;
          category: string;
          claim_url: string | null;
          claims_filed: number;
          claims_total: number;
          company: string;
          created_at: string;
          description: string;
          due_date: string;
          estimated_payout: number;
          headline: string;
          id: string;
          is_featured: boolean;
          slug: string;
          summary: string;
          tag: string | null;
          title: string;
        };
        Insert: {
          amount_label: string;
          brand?: string | null;
          category: string;
          claim_url?: string | null;
          claims_filed?: number;
          claims_total?: number;
          company: string;
          created_at?: string;
          description?: string;
          due_date: string;
          estimated_payout?: number;
          headline: string;
          id?: string;
          is_featured?: boolean;
          slug: string;
          summary?: string;
          tag?: string | null;
          title: string;
        };
        Update: {
          amount_label?: string;
          brand?: string | null;
          category?: string;
          claim_url?: string | null;
          claims_filed?: number;
          claims_total?: number;
          company?: string;
          created_at?: string;
          description?: string;
          due_date?: string;
          estimated_payout?: number;
          headline?: string;
          id?: string;
          is_featured?: boolean;
          slug?: string;
          summary?: string;
          tag?: string | null;
          title?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          created_at: string;
          expires_at: string | null;
          plan: string;
          status: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          expires_at?: string | null;
          plan: string;
          status?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          expires_at?: string | null;
          plan?: string;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscriptions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      wallet_summary: {
        Row: {
          claimed: number | null;
          estimated_payout: number | null;
          notified: number | null;
          user_id: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'claims_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Functions: {
      sync_my_matches: { Args: never; Returns: number };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
