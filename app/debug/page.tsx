"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

export default function DebugPage() {
  const { userProfile } = useAuth()
  const [facilities, setFacilities] = useState([])
  const [users, setUsers] = useState([])
  const [inspections, setInspections] = useState([])

  useEffect(() => {
    checkData()
  }, [])

  const checkData = async () => {
    try {
      // Check facilities
      const { data: facilitiesData, error: facilitiesError } = await supabase.from("facilities").select("*").limit(5)

      console.log("Facilities:", { facilitiesData, facilitiesError })
      setFacilities(facilitiesData || [])

      // Check users
      const { data: usersData, error: usersError } = await supabase.from("users").select("*").limit(5)

      console.log("Users:", { usersData, usersError })
      setUsers(usersData || [])

      // Check inspections
      const { data: inspectionsData, error: inspectionsError } = await supabase.from("inspections").select("*").limit(5)

      console.log("Inspections:", { inspectionsData, inspectionsError })
      setInspections(inspectionsData || [])
    } catch (error) {
      console.error("Debug error:", error)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Debug Information</h1>

        <Card>
          <CardHeader>
            <CardTitle>Current User</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded">{JSON.stringify(userProfile, null, 2)}</pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Facilities ({facilities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded max-h-64 overflow-auto">
              {JSON.stringify(facilities, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded max-h-64 overflow-auto">
              {JSON.stringify(users, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inspections ({inspections.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm bg-gray-100 p-4 rounded max-h-64 overflow-auto">
              {JSON.stringify(inspections, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
