export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      councils: {
        Row: {
          code: string | null
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string | null
          established_date: string | null
          id: number
          name: string
          region: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          code?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          established_date?: string | null
          id?: number
          name: string
          region?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string | null
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string | null
          established_date?: string | null
          id?: number
          name?: string
          region?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      group_activities: {
        Row: {
          activity_date: string
          activity_name: string
          activity_type: string | null
          attendees_count: number | null
          budget_allocated: number | null
          budget_spent: number | null
          created_at: string | null
          description: string | null
          group_id: number | null
          id: number
          location: string | null
          outcomes: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          activity_date: string
          activity_name: string
          activity_type?: string | null
          attendees_count?: number | null
          budget_allocated?: number | null
          budget_spent?: number | null
          created_at?: string | null
          description?: string | null
          group_id?: number | null
          id?: number
          location?: string | null
          outcomes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          activity_date?: string
          activity_name?: string
          activity_type?: string | null
          attendees_count?: number | null
          budget_allocated?: number | null
          budget_spent?: number | null
          created_at?: string | null
          description?: string | null
          group_id?: number | null
          id?: number
          location?: string | null
          outcomes?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_activities_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_activities_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "v_group_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      group_documents: {
        Row: {
          created_at: string
          description: string | null
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          group_id: number
          id: string
          updated_at: string
          upload_date: string
          uploaded_by: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          group_id: number
          id?: string
          updated_at?: string
          upload_date?: string
          uploaded_by?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          group_id?: number
          id?: string
          updated_at?: string
          upload_date?: string
          uploaded_by?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "group_documents_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_documents_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "v_group_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string | null
          description: string | null
          dissolution_date: string | null
          dissolution_reason: string | null
          group_number: string | null
          id: number
          meeting_day: string | null
          meeting_location: string | null
          meeting_time: string | null
          name: string
          primary_contact_email: string | null
          primary_contact_name: string | null
          primary_contact_phone: string | null
          registration_date: string
          registration_number: string | null
          status: string | null
          updated_at: string | null
          ward_id: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          dissolution_date?: string | null
          dissolution_reason?: string | null
          group_number?: string | null
          id?: number
          meeting_day?: string | null
          meeting_location?: string | null
          meeting_time?: string | null
          name: string
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          registration_date?: string
          registration_number?: string | null
          status?: string | null
          updated_at?: string | null
          ward_id?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          dissolution_date?: string | null
          dissolution_reason?: string | null
          group_number?: string | null
          id?: number
          meeting_day?: string | null
          meeting_location?: string | null
          meeting_time?: string | null
          name?: string
          primary_contact_email?: string | null
          primary_contact_name?: string | null
          primary_contact_phone?: string | null
          registration_date?: string
          registration_number?: string | null
          status?: string | null
          updated_at?: string | null
          ward_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_ward_id_fkey"
            columns: ["ward_id"]
            isOneToOne: false
            referencedRelation: "wards"
            referencedColumns: ["id"]
          },
        ]
      }
      member_history: {
        Row: {
          action_date: string
          action_type: string
          approved_by: number | null
          changed_by: number | null
          created_at: string | null
          effective_date: string | null
          group_id: number | null
          id: number
          member_id: number | null
          new_role: string | null
          new_value: string | null
          notes: string | null
          previous_role: string | null
          previous_value: string | null
          reason: string | null
        }
        Insert: {
          action_date?: string
          action_type: string
          approved_by?: number | null
          changed_by?: number | null
          created_at?: string | null
          effective_date?: string | null
          group_id?: number | null
          id?: number
          member_id?: number | null
          new_role?: string | null
          new_value?: string | null
          notes?: string | null
          previous_role?: string | null
          previous_value?: string | null
          reason?: string | null
        }
        Update: {
          action_date?: string
          action_type?: string
          approved_by?: number | null
          changed_by?: number | null
          created_at?: string | null
          effective_date?: string | null
          group_id?: number | null
          id?: number
          member_id?: number | null
          new_role?: string | null
          new_value?: string | null
          notes?: string | null
          previous_role?: string | null
          previous_value?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_history_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_history_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "v_group_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_history_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_history_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "v_active_members"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          alternative_phone: string | null
          created_at: string | null
          created_by: number | null
          date_of_birth: string | null
          education_level: string | null
          email_address: string | null
          exit_date: string | null
          exit_reason: string | null
          first_name: string
          gender: string
          group_id: number | null
          id: number
          join_date: string
          last_name: string
          member_number: string | null
          member_role: string | null
          membership_status: string | null
          middle_name: string | null
          mobile_number: string
          monthly_income: number | null
          national_id: string | null
          occupation: string | null
          passport_number: string | null
          postal_address: string | null
          residential_address: string | null
          updated_at: string | null
        }
        Insert: {
          alternative_phone?: string | null
          created_at?: string | null
          created_by?: number | null
          date_of_birth?: string | null
          education_level?: string | null
          email_address?: string | null
          exit_date?: string | null
          exit_reason?: string | null
          first_name: string
          gender: string
          group_id?: number | null
          id?: number
          join_date?: string
          last_name: string
          member_number?: string | null
          member_role?: string | null
          membership_status?: string | null
          middle_name?: string | null
          mobile_number: string
          monthly_income?: number | null
          national_id?: string | null
          occupation?: string | null
          passport_number?: string | null
          postal_address?: string | null
          residential_address?: string | null
          updated_at?: string | null
        }
        Update: {
          alternative_phone?: string | null
          created_at?: string | null
          created_by?: number | null
          date_of_birth?: string | null
          education_level?: string | null
          email_address?: string | null
          exit_date?: string | null
          exit_reason?: string | null
          first_name?: string
          gender?: string
          group_id?: number | null
          id?: number
          join_date?: string
          last_name?: string
          member_number?: string | null
          member_role?: string | null
          membership_status?: string | null
          middle_name?: string | null
          mobile_number?: string
          monthly_income?: number | null
          national_id?: string | null
          occupation?: string | null
          passport_number?: string | null
          postal_address?: string | null
          residential_address?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "v_group_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      wards: {
        Row: {
          area_km2: number | null
          council_id: number | null
          created_at: string | null
          id: number
          name: string
          population: number | null
          status: string | null
          updated_at: string | null
          ward_code: string | null
        }
        Insert: {
          area_km2?: number | null
          council_id?: number | null
          created_at?: string | null
          id?: number
          name: string
          population?: number | null
          status?: string | null
          updated_at?: string | null
          ward_code?: string | null
        }
        Update: {
          area_km2?: number | null
          council_id?: number | null
          created_at?: string | null
          id?: number
          name?: string
          population?: number | null
          status?: string | null
          updated_at?: string | null
          ward_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wards_council_id_fkey"
            columns: ["council_id"]
            isOneToOne: false
            referencedRelation: "councils"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wards_council_id_fkey"
            columns: ["council_id"]
            isOneToOne: false
            referencedRelation: "v_active_members"
            referencedColumns: ["council_id"]
          },
          {
            foreignKeyName: "wards_council_id_fkey"
            columns: ["council_id"]
            isOneToOne: false
            referencedRelation: "v_group_stats"
            referencedColumns: ["council_id"]
          },
        ]
      }
    }
    Views: {
      v_active_members: {
        Row: {
          age: number | null
          council_id: number | null
          council_name: string | null
          date_of_birth: string | null
          full_name: string | null
          gender: string | null
          group_name: string | null
          group_number: string | null
          id: number | null
          join_date: string | null
          member_role: string | null
          mobile_number: string | null
          ward_name: string | null
        }
        Relationships: []
      }
      v_group_stats: {
        Row: {
          council_id: number | null
          council_name: string | null
          female_members: number | null
          first_member_joined: string | null
          group_name: string | null
          group_number: string | null
          id: number | null
          last_member_joined: string | null
          leadership_positions: number | null
          male_members: number | null
          registration_date: string | null
          total_members: number | null
          ward_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
