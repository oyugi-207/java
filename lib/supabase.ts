import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'demo-key';
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

if (!isDemoMode && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('Supabase URL not found. Running in demo mode.');
}

if (!isDemoMode && !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Supabase anon key not found. Running in demo mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'manager' | 'worker';
          farm_id: string;
          avatar_url: string | null;
          farm_name: string | null;
          preferences: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role?: 'admin' | 'manager' | 'worker';
          farm_id: string;
          avatar_url?: string | null;
          farm_name?: string | null;
          preferences?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'manager' | 'worker';
          farm_id?: string;
          avatar_url?: string | null;
          farm_name?: string | null;
          preferences?: any | null;
          updated_at?: string;
        };
      };
      animals: {
        Row: {
          id: string;
          farm_id: string;
          name: string;
          species: string;
          breed: string;
          birth_date: string;
          gender: 'male' | 'female';
          mother_id: string | null;
          father_id: string | null;
          health_score: number;
          location: string;
          weight: number | null;
          status: 'active' | 'sold' | 'deceased';
          qr_code: string | null;
          rfid_tag: string | null;
          created_at: string;
          updated_at: string;
          animal_id: string | null;
          purchase_date: string | null;
          sale_date: string | null;
          purchase_price: number | null;
          sale_price: number | null;
        };
        Insert: {
          id?: string;
          farm_id: string;
          name: string;
          species: string;
          breed: string;
          birth_date: string;
          gender: 'male' | 'female';
          mother_id?: string | null;
          father_id?: string | null;
          health_score?: number;
          location: string;
          weight?: number | null;
          status?: 'active' | 'sold' | 'deceased';
          qr_code?: string | null;
          rfid_tag?: string | null;
          created_at?: string;
          updated_at?: string;
          animal_id?: string | null;
          purchase_date?: string | null;
          sale_date?: string | null;
          purchase_price?: number | null;
          sale_price?: number | null;
        };
        Update: {
          id?: string;
          farm_id?: string;
          name?: string;
          species?: string;
          breed?: string;
          birth_date?: string;
          gender?: 'male' | 'female';
          mother_id?: string | null;
          father_id?: string | null;
          health_score?: number;
          location?: string;
          weight?: number | null;
          status?: 'active' | 'sold' | 'deceased';
          qr_code?: string | null;
          rfid_tag?: string | null;
          updated_at?: string;
          animal_id?: string | null;
          purchase_date?: string | null;
          sale_date?: string | null;
          purchase_price?: number | null;
          sale_price?: number | null;
        };
      };
      health_records: {
        Row: {
          id: string;
          animal_id: string;
          farm_id: string;
          type: 'vaccination' | 'treatment' | 'checkup' | 'illness';
          title: string;
          description: string;
          veterinarian: string | null;
          medications: string | null;
          next_due_date: string | null;
          cost: number | null;
          status: 'scheduled' | 'completed' | 'overdue';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          animal_id: string;
          farm_id: string;
          type: 'vaccination' | 'treatment' | 'checkup' | 'illness';
          title: string;
          description: string;
          veterinarian?: string | null;
          medications?: string | null;
          next_due_date?: string | null;
          cost?: number | null;
          status?: 'scheduled' | 'completed' | 'overdue';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          animal_id?: string;
          farm_id?: string;
          type?: 'vaccination' | 'treatment' | 'checkup' | 'illness';
          title?: string;
          description?: string;
          veterinarian?: string | null;
          medications?: string | null;
          next_due_date?: string | null;
          cost?: number | null;
          status?: 'scheduled' | 'completed' | 'overdue';
          updated_at?: string;
        };
      };
      feeding_records: {
        Row: {
          id: string;
          animal_id: string;
          farm_id: string;
          feed_type: string;
          amount: number;
          unit: string;
          cost: number | null;
          fed_by: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          animal_id: string;
          farm_id: string;
          feed_type: string;
          amount: number;
          unit: string;
          cost?: number | null;
          fed_by: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          animal_id?: string;
          farm_id?: string;
          feed_type?: string;
          amount?: number;
          unit?: string;
          cost?: number | null;
          fed_by?: string;
          notes?: string | null;
        };
      };
      breeding_records: {
        Row: {
          id: string;
          mother_id: string;
          father_id: string;
          farm_id: string;
          breeding_date: string;
          expected_birth_date: string | null;
          actual_birth_date: string | null;
          offspring_count: number | null;
          success: boolean | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          mother_id: string;
          father_id: string;
          farm_id: string;
          breeding_date: string;
          expected_birth_date?: string | null;
          actual_birth_date?: string | null;
          offspring_count?: number | null;
          success?: boolean | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          mother_id?: string;
          father_id?: string;
          farm_id?: string;
          breeding_date?: string;
          expected_birth_date?: string | null;
          actual_birth_date?: string | null;
          offspring_count?: number | null;
          success?: boolean | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      production_records: {
        Row: {
          id: string;
          animal_id: string;
          farm_id: string;
          type: 'milk' | 'eggs' | 'wool' | 'meat' | 'other';
          quantity: number;
          unit: string;
          quality_grade: string | null;
          price_per_unit: number | null;
          total_value: number | null;
          recorded_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          animal_id: string;
          farm_id: string;
          type: 'milk' | 'eggs' | 'wool' | 'meat' | 'other';
          quantity: number;
          unit: string;
          quality_grade?: string | null;
          price_per_unit?: number | null;
          total_value?: number | null;
          recorded_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          animal_id?: string;
          farm_id?: string;
          type?: 'milk' | 'eggs' | 'wool' | 'meat' | 'other';
          quantity?: number;
          unit?: string;
          quality_grade?: string | null;
          price_per_unit?: number | null;
          total_value?: number | null;
          recorded_by?: string;
        };
      };
      financial_records: {
        Row: {
          id: string;
          farm_id: string;
          type: 'income' | 'expense';
          category: string;
          amount: number;
          currency: string;
          description: string;
          date: string;
          payment_method: string | null;
          invoice_number: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          type: 'income' | 'expense';
          category: string;
          amount: number;
          currency: string;
          description: string;
          date: string;
          payment_method?: string | null;
          invoice_number?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          farm_id?: string;
          type?: 'income' | 'expense';
          category?: string;
          amount?: number;
          currency?: string;
          description?: string;
          date?: string;
          payment_method?: string | null;
          invoice_number?: string | null;
          created_by?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          farm_id: string;
          title: string;
          description: string;
          type: 'feeding' | 'health' | 'maintenance' | 'breeding' | 'other';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          status: 'pending' | 'in_progress' | 'completed' | 'overdue';
          assigned_to: string | null;
          due_date: string;
          animal_id: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          title: string;
          description: string;
          type: 'feeding' | 'health' | 'maintenance' | 'breeding' | 'other';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          status?: 'pending' | 'in_progress' | 'completed' | 'overdue';
          assigned_to?: string | null;
          due_date: string;
          animal_id?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farm_id?: string;
          title?: string;
          description?: string;
          type?: 'feeding' | 'health' | 'maintenance' | 'breeding' | 'other';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          status?: 'pending' | 'in_progress' | 'completed' | 'overdue';
          assigned_to?: string | null;
          due_date?: string;
          animal_id?: string | null;
          created_by?: string;
          updated_at?: string;
        };
      };
      staff: {
        Row: {
          id: string;
          farm_id: string;
          user_id: string;
          name: string;
          role: 'admin' | 'manager' | 'worker';
          permissions: string[];
          salary: number | null;
          hire_date: string;
          status: 'active' | 'inactive';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          user_id: string;
          name: string;
          role: 'admin' | 'manager' | 'worker';
          permissions?: string[];
          salary?: number | null;
          hire_date: string;
          status?: 'active' | 'inactive';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          farm_id?: string;
          user_id?: string;
          name?: string;
          role?: 'admin' | 'manager' | 'worker';
          permissions?: string[];
          salary?: number | null;
          hire_date?: string;
          status?: 'active' | 'inactive';
          updated_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Animal = Database['public']['Tables']['animals']['Row'];
export type HealthRecord = Database['public']['Tables']['health_records']['Row'];
export type FeedingRecord = Database['public']['Tables']['feeding_records']['Row'];
export type BreedingRecord = Database['public']['Tables']['breeding_records']['Row'];
export type ProductionRecord = Database['public']['Tables']['production_records']['Row'];
export type FinancialRecord = Database['public']['Tables']['financial_records']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];
export type Staff = Database['public']['Tables']['staff']['Row'];
```