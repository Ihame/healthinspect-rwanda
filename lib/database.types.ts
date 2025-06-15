// Database type definitions generated from Supabase schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string
          role:
            | "super_admin"
            | "pharmacy_supervisor"
            | "hospital_supervisor"
            | "pharmacy_inspector"
            | "hospital_inspector"
          district: string | null
          created_by: string | null
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone: string
          role:
            | "super_admin"
            | "pharmacy_supervisor"
            | "hospital_supervisor"
            | "pharmacy_inspector"
            | "hospital_inspector"
          district?: string | null
          created_by?: string | null
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string
          role?:
            | "super_admin"
            | "pharmacy_supervisor"
            | "hospital_supervisor"
            | "pharmacy_inspector"
            | "hospital_inspector"
          district?: string | null
          created_by?: string | null
          is_active?: boolean
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      facilities: {
        Row: {
          id: string
          name: string
          registration_number: string | null
          level: string
          type: "hospital" | "pharmacy"
          district: string
          sector: string | null
          cell: string | null
          village: string | null
          latitude: number | null
          longitude: number | null
          phone: string | null
          email: string | null
          owner_name: string | null
          license_number: string | null
          license_expiry: string | null
          is_active: boolean
          risk_level: "low" | "medium" | "high"
          last_inspection_date: string | null
          last_inspection_score: number | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          registration_number?: string | null
          level: string
          type: "hospital" | "pharmacy"
          district: string
          sector?: string | null
          cell?: string | null
          village?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          email?: string | null
          owner_name?: string | null
          license_number?: string | null
          license_expiry?: string | null
          is_active?: boolean
          risk_level?: "low" | "medium" | "high"
          last_inspection_date?: string | null
          last_inspection_score?: number | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          registration_number?: string | null
          level?: string
          type?: "hospital" | "pharmacy"
          district?: string
          sector?: string | null
          cell?: string | null
          village?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          email?: string | null
          owner_name?: string | null
          license_number?: string | null
          license_expiry?: string | null
          is_active?: boolean
          risk_level?: "low" | "medium" | "high"
          last_inspection_date?: string | null
          last_inspection_score?: number | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inspections: {
        Row: {
          id: string
          facility_id: string
          inspector_id: string
          inspection_type: "routine" | "follow_up" | "complaint" | "licensing"
          date: string
          start_time: string | null
          end_time: string | null
          score: number
          max_score: number
          percentage: number
          status: "in_progress" | "completed" | "reviewed" | "approved"
          risk_level: "low" | "medium" | "high"
          signature_url: string | null
          inspector_notes: string | null
          facility_response: string | null
          follow_up_required: boolean
          follow_up_date: string | null
          reviewed_by: string | null
          reviewed_at: string | null
          approved_by: string | null
          approved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          facility_id: string
          inspector_id: string
          inspection_type?: "routine" | "follow_up" | "complaint" | "licensing"
          date?: string
          start_time?: string | null
          end_time?: string | null
          score?: number
          max_score?: number
          percentage?: number
          status?: "in_progress" | "completed" | "reviewed" | "approved"
          risk_level?: "low" | "medium" | "high"
          signature_url?: string | null
          inspector_notes?: string | null
          facility_response?: string | null
          follow_up_required?: boolean
          follow_up_date?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          facility_id?: string
          inspector_id?: string
          inspection_type?: "routine" | "follow_up" | "complaint" | "licensing"
          date?: string
          start_time?: string | null
          end_time?: string | null
          score?: number
          max_score?: number
          percentage?: number
          status?: "in_progress" | "completed" | "reviewed" | "approved"
          risk_level?: "low" | "medium" | "high"
          signature_url?: string | null
          inspector_notes?: string | null
          facility_response?: string | null
          follow_up_required?: boolean
          follow_up_date?: string | null
          reviewed_by?: string | null
          reviewed_at?: string | null
          approved_by?: string | null
          approved_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inspection_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          facility_type: "hospital" | "pharmacy" | "both"
          weight: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          facility_type: "hospital" | "pharmacy" | "both"
          weight?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          facility_type?: "hospital" | "pharmacy" | "both"
          weight?: number
          is_active?: boolean
          created_at?: string
        }
      }
      inspection_items: {
        Row: {
          id: string
          inspection_id: string
          category_id: string | null
          question: string
          answer: "compliant" | "non_compliant" | "not_applicable" | "partial" | null
          score: number
          max_score: number
          comment: string | null
          photo_url: string | null
          evidence_url: string | null
          priority: "low" | "medium" | "high" | "critical"
          created_at: string
        }
        Insert: {
          id?: string
          inspection_id: string
          category_id?: string | null
          question: string
          answer?: "compliant" | "non_compliant" | "not_applicable" | "partial" | null
          score?: number
          max_score?: number
          comment?: string | null
          photo_url?: string | null
          evidence_url?: string | null
          priority?: "low" | "medium" | "high" | "critical"
          created_at?: string
        }
        Update: {
          id?: string
          inspection_id?: string
          category_id?: string | null
          question?: string
          answer?: "compliant" | "non_compliant" | "not_applicable" | "partial" | null
          score?: number
          max_score?: number
          comment?: string | null
          photo_url?: string | null
          evidence_url?: string | null
          priority?: "low" | "medium" | "high" | "critical"
          created_at?: string
        }
      }
      corrective_actions: {
        Row: {
          id: string
          inspection_id: string
          inspection_item_id: string | null
          finding: string
          action_required: string
          responsible_person: string | null
          deadline: string | null
          priority: "low" | "medium" | "high" | "critical"
          status: "pending" | "in_progress" | "completed" | "overdue"
          completion_date: string | null
          completion_notes: string | null
          verified_by: string | null
          verified_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          inspection_id: string
          inspection_item_id?: string | null
          finding: string
          action_required: string
          responsible_person?: string | null
          deadline?: string | null
          priority?: "low" | "medium" | "high" | "critical"
          status?: "pending" | "in_progress" | "completed" | "overdue"
          completion_date?: string | null
          completion_notes?: string | null
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          inspection_id?: string
          inspection_item_id?: string | null
          finding?: string
          action_required?: string
          responsible_person?: string | null
          deadline?: string | null
          priority?: "low" | "medium" | "high" | "critical"
          status?: "pending" | "in_progress" | "completed" | "overdue"
          completion_date?: string | null
          completion_notes?: string | null
          verified_by?: string | null
          verified_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          table_name: string
          record_id: string | null
          old_values: any | null
          new_values: any | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          table_name: string
          record_id?: string | null
          old_values?: any | null
          new_values?: any | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          table_name?: string
          record_id?: string | null
          old_values?: any | null
          new_values?: any | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: "info" | "warning" | "error" | "success"
          is_read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: "info" | "warning" | "error" | "success"
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: "info" | "warning" | "error" | "success"
          is_read?: boolean
          action_url?: string | null
          created_at?: string
        }
      }
    }
  }
}
