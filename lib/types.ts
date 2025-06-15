// Type definitions for the health inspection system

export interface User {
  id: string
  name: string
  email?: string
  phone: string
  role: "super_admin" | "pharmacy_supervisor" | "hospital_supervisor" | "pharmacy_inspector" | "hospital_inspector"
  district?: string
  created_by?: string
  is_active: boolean
  last_login?: string
  created_at: string
  updated_at: string
}

export interface Facility {
  id: string
  name: string
  registration_number?: string
  level: string
  type: "hospital" | "pharmacy"
  district: string
  sector?: string
  cell?: string
  village?: string
  latitude?: number
  longitude?: number
  phone?: string
  email?: string
  owner_name?: string
  license_number?: string
  license_expiry?: string
  is_active: boolean
  risk_level: "low" | "medium" | "high"
  last_inspection_date?: string
  last_inspection_score?: number
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Inspection {
  id: string
  facility_id: string
  inspector_id: string
  inspection_type: "routine" | "follow_up" | "complaint" | "licensing"
  date: string
  start_time?: string
  end_time?: string
  score: number
  max_score: number
  percentage: number
  status: "in_progress" | "completed" | "reviewed" | "approved"
  risk_level: "low" | "medium" | "high"
  signature_url?: string
  inspector_notes?: string
  facility_response?: string
  follow_up_required: boolean
  follow_up_date?: string
  reviewed_by?: string
  reviewed_at?: string
  approved_by?: string
  approved_at?: string
  created_at: string
  updated_at: string
  // Relations
  facility?: Facility
  inspector?: User
  reviewer?: User
  approver?: User
}

export interface InspectionCategory {
  id: string
  name: string
  description?: string
  facility_type: "hospital" | "pharmacy" | "both"
  weight: number
  is_active: boolean
  created_at: string
}

export interface InspectionItem {
  id: string
  inspection_id: string
  category_id: string
  question: string
  answer?: "compliant" | "non_compliant" | "not_applicable" | "partial"
  score: number
  max_score: number
  comment?: string
  photo_url?: string
  evidence_url?: string
  priority: "low" | "medium" | "high" | "critical"
  created_at: string
  // Relations
  category?: InspectionCategory
}

export interface CorrectiveAction {
  id: string
  inspection_id: string
  inspection_item_id?: string
  finding: string
  action_required: string
  responsible_person?: string
  deadline?: string
  priority: "low" | "medium" | "high" | "critical"
  status: "pending" | "in_progress" | "completed" | "overdue"
  completion_date?: string
  completion_notes?: string
  verified_by?: string
  verified_at?: string
  created_at: string
  updated_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  is_read: boolean
  action_url?: string
  created_at: string
}

export interface DashboardStats {
  totalFacilities: number
  totalPharmacies: number
  totalHospitals: number
  totalInspections: number
  completedInspections: number
  pendingInspections: number
  highRiskFacilities: number
  averageScore: number
  inspectionsThisMonth: number
  inspectionsLastMonth: number
  complianceRate: number
  recentInspections: Inspection[]
  topPerformingFacilities: Facility[]
  facilitiesNeedingAttention: Facility[]
  districtStats: {
    district: string
    facilityCount: number
    inspectionCount: number
    averageScore: number
    riskLevel: "low" | "medium" | "high"
  }[]
}

// Permission system
export interface Permission {
  resource: string
  action: "create" | "read" | "update" | "delete"
  condition?: (user: User, resource?: any) => boolean
}

export const ROLE_PERMISSIONS: Record<User["role"], Permission[]> = {
  super_admin: [
    { resource: "*", action: "create" },
    { resource: "*", action: "read" },
    { resource: "*", action: "update" },
    { resource: "*", action: "delete" },
  ],
  pharmacy_supervisor: [
    { resource: "pharmacy", action: "create" },
    { resource: "pharmacy", action: "read" },
    { resource: "pharmacy", action: "update" },
    { resource: "pharmacy", action: "delete" },
    { resource: "pharmacy_inspector", action: "create" },
    { resource: "pharmacy_inspector", action: "read" },
    { resource: "pharmacy_inspector", action: "update" },
    {
      resource: "inspection",
      action: "read",
      condition: (user, inspection) => inspection?.facility?.type === "pharmacy",
    },
    { resource: "report", action: "read", condition: (user, report) => report?.facility?.type === "pharmacy" },
  ],
  hospital_supervisor: [
    { resource: "hospital", action: "create" },
    { resource: "hospital", action: "read" },
    { resource: "hospital", action: "update" },
    { resource: "hospital", action: "delete" },
    { resource: "hospital_inspector", action: "create" },
    { resource: "hospital_inspector", action: "read" },
    { resource: "hospital_inspector", action: "update" },
    {
      resource: "inspection",
      action: "read",
      condition: (user, inspection) => inspection?.facility?.type === "hospital",
    },
    { resource: "report", action: "read", condition: (user, report) => report?.facility?.type === "hospital" },
  ],
  pharmacy_inspector: [
    { resource: "pharmacy", action: "read" },
    {
      resource: "inspection",
      action: "create",
      condition: (user, inspection) => inspection?.facility?.type === "pharmacy",
    },
    { resource: "inspection", action: "read", condition: (user, inspection) => inspection?.inspector_id === user.id },
    { resource: "inspection", action: "update", condition: (user, inspection) => inspection?.inspector_id === user.id },
  ],
  hospital_inspector: [
    { resource: "hospital", action: "read" },
    {
      resource: "inspection",
      action: "create",
      condition: (user, inspection) => inspection?.facility?.type === "hospital",
    },
    { resource: "inspection", action: "read", condition: (user, inspection) => inspection?.inspector_id === user.id },
    { resource: "inspection", action: "update", condition: (user, inspection) => inspection?.inspector_id === user.id },
  ],
}
