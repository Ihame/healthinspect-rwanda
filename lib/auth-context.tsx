"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "./types"

interface AuthContextType {
  user: any
  userProfile: User | null
  loading: boolean
  signOut: () => void
  hasPermission: (resource: string, action: string, targetResource?: any) => boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signOut: () => {},
  hasPermission: () => false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check localStorage for demo user
    const demoUser = localStorage.getItem("demo-user")
    if (demoUser) {
      try {
        const userData = JSON.parse(demoUser)
        setUser(userData.user)
        setUserProfile(userData.profile)
      } catch (error) {
        console.error("Error parsing demo user:", error)
        localStorage.removeItem("demo-user")
      }
    }
    setLoading(false)
  }, [])

  const signOut = () => {
    localStorage.removeItem("demo-user")
    setUser(null)
    setUserProfile(null)
    // Force page reload to clear all state
    window.location.href = "/login"
  }

  /**
   * Check if current user has permission for a specific action on a resource
   * @param resource - The resource type (e.g., 'pharmacy', 'hospital', 'inspection')
   * @param action - The action type ('create', 'read', 'update', 'delete')
   * @param targetResource - Optional target resource object for condition checking
   */
  const hasPermission = (resource: string, action: string, targetResource?: any): boolean => {
    if (!userProfile) return false

    // Super admin has all permissions
    if (userProfile.role === "super_admin") return true

    // Role-based permission checking
    switch (userProfile.role) {
      case "pharmacy_supervisor":
        if (resource === "pharmacy" || resource === "pharmacy_inspector") return true
        if (resource === "inspection" && targetResource?.facility?.type === "pharmacy") return true
        if (resource === "report" && targetResource?.facility?.type === "pharmacy") return true
        break

      case "hospital_supervisor":
        if (resource === "hospital" || resource === "hospital_inspector") return true
        if (resource === "inspection" && targetResource?.facility?.type === "hospital") return true
        if (resource === "report" && targetResource?.facility?.type === "hospital") return true
        break

      case "pharmacy_inspector":
        if (resource === "pharmacy" && action === "read") return true
        if (resource === "inspection" && targetResource?.facility?.type === "pharmacy") {
          return action === "create" || targetResource?.inspector_id === userProfile.id
        }
        break

      case "hospital_inspector":
        if (resource === "hospital" && action === "read") return true
        if (resource === "inspection" && targetResource?.facility?.type === "hospital") {
          return action === "create" || targetResource?.inspector_id === userProfile.id
        }
        break
    }

    return false
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, signOut, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
