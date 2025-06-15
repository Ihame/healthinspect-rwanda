import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lkwdqpojtkgxotbjbueo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxrd2RxcG9qdGtneG90YmpidWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5Nzg2MDYsImV4cCI6MjA2NTU1NDYwNn0.z1JKWbnuc3u_KE1ObVDz3Nr4H8tQ3wy4IfcqHmVY_og"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper functions for common database operations

/**
 * Get facilities with optional filtering
 */
export async function getFacilities(filters?: {
  type?: "hospital" | "pharmacy"
  district?: string
  risk_level?: "low" | "medium" | "high"
  is_active?: boolean
}) {
  let query = supabase.from("facilities").select("*")

  if (filters?.type) {
    query = query.eq("type", filters.type)
  }
  if (filters?.district) {
    query = query.eq("district", filters.district)
  }
  if (filters?.risk_level) {
    query = query.eq("risk_level", filters.risk_level)
  }
  if (filters?.is_active !== undefined) {
    query = query.eq("is_active", filters.is_active)
  }

  return query.order("name")
}

/**
 * Get inspections with related data
 */
export async function getInspections(filters?: {
  facility_id?: string
  inspector_id?: string
  status?: string
  date_from?: string
  date_to?: string
}) {
  let query = supabase.from("inspections").select(`
    id,
    facility_id,
    inspector_id,
    inspection_type,
    date,
    start_time,
    end_time,
    score,
    max_score,
    percentage,
    status,
    risk_level,
    signature_url,
    inspector_notes,
    facility_response,
    follow_up_required,
    follow_up_date,
    reviewed_by,
    reviewed_at,
    approved_by,
    approved_at,
    created_at,
    updated_at,
    facility:facilities(*),
    inspector:users!inspections_inspector_id_fkey(*),
    reviewer:users!inspections_reviewed_by_fkey(*),
    approver:users!inspections_approved_by_fkey(*)
  `)

  if (filters?.facility_id) {
    query = query.eq("facility_id", filters.facility_id)
  }
  if (filters?.inspector_id) {
    query = query.eq("inspector_id", filters.inspector_id)
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }
  if (filters?.date_from) {
    query = query.gte("date", filters.date_from)
  }
  if (filters?.date_to) {
    query = query.lte("date", filters.date_to)
  }

  return query.order("date", { ascending: false })
}

/**
 * Get users with optional role filtering
 */
export async function getUsers(role?: string) {
  let query = supabase.from("users").select("*")

  if (role) {
    query = query.eq("role", role)
  }

  return query.order("name")
}

/**
 * Create audit log entry
 */
export async function createAuditLog(
  userId: string,
  action: string,
  tableName: string,
  recordId: string,
  oldValues?: any,
  newValues?: any,
) {
  return supabase.from("audit_logs").insert({
    user_id: userId,
    action,
    table_name: tableName,
    record_id: recordId,
    old_values: oldValues,
    new_values: newValues,
  })
}

/**
 * Create notification
 */
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: "info" | "warning" | "error" | "success" = "info",
  actionUrl?: string,
) {
  return supabase.from("notifications").insert({
    user_id: userId,
    title,
    message,
    type,
    action_url: actionUrl,
  })
}

export type { Database }
