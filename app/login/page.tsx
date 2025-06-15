"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, User } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Demo users for easy testing
const DEMO_USERS = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    name: "Urubuto Fedine",
    email: "urubuto.fedine@rssb.rw",
    phone: "+250788000001",
    role: "super_admin" as const,
    district: "National",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    name: "Dr. Jean Baptiste Uwimana",
    email: "j.uwimana@rssb.rw",
    phone: "+250788000002",
    role: "pharmacy_supervisor" as const,
    district: "National",
  },
  {
    id: "00000000-0000-0000-0000-000000000003",
    name: "Dr. Marie Claire Mukamana",
    email: "m.mukamana@rssb.rw",
    phone: "+250788000003",
    role: "hospital_supervisor" as const,
    district: "National",
  },
  {
    id: "00000000-0000-0000-0000-000000000004",
    name: "Paul Nkurunziza",
    email: "p.nkurunziza@rssb.rw",
    phone: "+250788000004",
    role: "pharmacy_inspector" as const,
    district: "Kigali",
  },
  {
    id: "00000000-0000-0000-0000-000000000006",
    name: "David Habimana",
    email: "d.habimana@rssb.rw",
    phone: "+250788000006",
    role: "hospital_inspector" as const,
    district: "Kigali",
  },
]

export default function LoginPage() {
  const [selectedUser, setSelectedUser] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  const handleLogin = async () => {
    if (!selectedUser) {
      alert("Please select a user to login as")
      return
    }

    setLoading(true)

    const demoUser = DEMO_USERS.find((u) => u.id === selectedUser)
    if (!demoUser) {
      alert("Invalid user selection")
      setLoading(false)
      return
    }

    // Create demo auth objects
    const authUser = {
      uid: demoUser.id,
      phoneNumber: demoUser.phone,
      email: demoUser.email,
    }

    const userProfile = {
      id: demoUser.id,
      name: demoUser.name,
      email: demoUser.email,
      phone: demoUser.phone,
      role: demoUser.role,
      district: demoUser.district,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Store in localStorage for demo
    localStorage.setItem(
      "demo-user",
      JSON.stringify({
        user: authUser,
        profile: userProfile,
      }),
    )

    // Redirect to dashboard
    window.location.href = "/dashboard"
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Super Administrator"
      case "pharmacy_supervisor":
        return "Pharmacy Supervisor"
      case "hospital_supervisor":
        return "Hospital Supervisor"
      case "pharmacy_inspector":
        return "Pharmacy Inspector"
      case "hospital_inspector":
        return "Hospital Inspector"
      default:
        return role
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Full system access - can manage all users and facilities"
      case "pharmacy_supervisor":
        return "Manages pharmacy inspections and pharmacy inspectors"
      case "hospital_supervisor":
        return "Manages hospital inspections and hospital inspectors"
      case "pharmacy_inspector":
        return "Conducts pharmacy inspections"
      case "hospital_inspector":
        return "Conducts hospital inspections"
      default:
        return "System user"
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-16 w-16 text-[#4CAF50]" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">HealthInspect Rwanda</h2>
          <p className="mt-2 text-sm text-gray-600">Professional Health Facility Inspection System</p>
          <p className="mt-1 text-xs text-gray-500">Rwanda Social Security Board (RSSB)</p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center">
              <User className="mr-2 h-5 w-5" />
              System Access
            </CardTitle>
            <CardDescription className="text-center">
              Select your user profile to access the inspection system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="user" className="text-sm font-medium text-gray-700">
                Select User Profile
              </label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your user profile" />
                </SelectTrigger>
                <SelectContent>
                  {DEMO_USERS.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className="text-xs text-gray-500">{getRoleDisplayName(user.role)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedUser && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Selected Profile:</h4>
                {(() => {
                  const user = DEMO_USERS.find((u) => u.id === selectedUser)
                  return user ? (
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Name:</span> {user.name}
                      </p>
                      <p>
                        <span className="font-medium">Role:</span> {getRoleDisplayName(user.role)}
                      </p>
                      <p>
                        <span className="font-medium">District:</span> {user.district}
                      </p>
                      <p className="text-xs text-gray-600 mt-2">{getRoleDescription(user.role)}</p>
                    </div>
                  ) : null
                })()}
              </div>
            )}

            <Button
              onClick={handleLogin}
              disabled={loading || !selectedUser}
              className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                "Access System"
              )}
            </Button>

            <div className="text-xs text-gray-500 text-center space-y-1">
              <p>
                <strong>Demo Environment</strong>
              </p>
              <p>This is a demonstration system for testing purposes.</p>
              <p>All data is simulated and for evaluation only.</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-xs text-gray-400">© 2024 Rwanda Social Security Board. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
