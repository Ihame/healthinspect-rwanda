"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/lib/supabase"
import { RiskBadge } from "@/components/ui/risk-badge"
import { ClipboardList, Search, Eye, Download } from "lucide-react"

interface AllInspection {
  id: string
  date: string
  score: number
  percentage: number
  status: "in_progress" | "completed" | "reviewed"
  inspection_type: string
  facility: {
    name: string
    type: string
    district: string
  }
  inspector: {
    name: string
  }
}

export default function AllInspectionsPage() {
  const { userProfile } = useAuth()
  const router = useRouter()
  const [inspections, setInspections] = useState<AllInspection[]>([])
  const [filteredInspections, setFilteredInspections] = useState<AllInspection[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [filterDistrict, setFilterDistrict] = useState("")

  useEffect(() => {
    if (
      userProfile?.role === "super_admin" ||
      userProfile?.role === "pharmacy_supervisor" ||
      userProfile?.role === "hospital_supervisor"
    ) {
      fetchAllInspections()
    } else {
      router.push("/dashboard")
    }
  }, [userProfile, router])

  useEffect(() => {
    applyFilters()
  }, [inspections, searchTerm, filterStatus, filterDistrict])

  const fetchAllInspections = async () => {
    if (!userProfile) return

    try {
      let query = supabase.from("inspections").select(`
        id,
        date,
        score,
        percentage,
        status,
        inspection_type,
        facilities (
          name,
          type,
          district
        ),
        inspector:users!inspections_inspector_id_fkey (
          name
        )
      `)

      // Apply role-based filtering
      if (userProfile.role === "pharmacy_supervisor") {
        query = query.eq("facilities.type", "pharmacy")
      } else if (userProfile.role === "hospital_supervisor") {
        query = query.eq("facilities.type", "hospital")
      }

      const { data, error } = await query.order("date", { ascending: false })

      if (error) throw error

      const formattedInspections =
        data?.map((item) => ({
          id: item.id,
          date: item.date,
          score: item.score,
          percentage: item.percentage,
          status: item.status,
          inspection_type: item.inspection_type,
          facility: {
            name: item.facilities?.name || "Unknown",
            type: item.facilities?.type || "Unknown",
            district: item.facilities?.district || "Unknown",
          },
          inspector: {
            name: item.inspector?.name || "Unknown",
          },
        })) || []

      setInspections(formattedInspections)
    } catch (error) {
      console.error("Error fetching inspections:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...inspections]

    if (searchTerm) {
      filtered = filtered.filter(
        (inspection) =>
          inspection.facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inspection.inspector.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterStatus) {
      filtered = filtered.filter((inspection) => inspection.status === filterStatus)
    }

    if (filterDistrict) {
      filtered = filtered.filter((inspection) => inspection.facility.district === filterDistrict)
    }

    setFilteredInspections(filtered)
  }

  const exportInspections = () => {
    const csvHeaders = ["Date", "Facility", "Type", "District", "Inspector", "Score", "Status"]
    const csvData = filteredInspections.map((inspection) => [
      inspection.date,
      inspection.facility.name,
      inspection.facility.type,
      inspection.facility.district,
      inspection.inspector.name,
      inspection.score,
      inspection.status,
    ])

    const csvContent = [csvHeaders, ...csvData].map((row) => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `all-inspections-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const districts = [...new Set(inspections.map((i) => i.facility.district))].sort()

  if (loading) {
    return (
      <MainLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Inspections</h1>
            <p className="text-gray-600">Overview of all system inspections</p>
          </div>
          <Button onClick={exportInspections} className="bg-[#4CAF50] hover:bg-[#45a049]">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search facilities or inspectors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterDistrict} onValueChange={setFilterDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="All districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All districts</SelectItem>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredInspections.length} of {inspections.length} inspections
            </div>
          </CardContent>
        </Card>

        {/* Inspections Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Inspections</CardTitle>
            <CardDescription>Complete overview of system inspections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Facility</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Inspector</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInspections.map((inspection) => (
                    <TableRow key={inspection.id}>
                      <TableCell>{new Date(inspection.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{inspection.facility.name}</TableCell>
                      <TableCell>
                        <Badge variant={inspection.facility.type === "hospital" ? "default" : "secondary"}>
                          {inspection.facility.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{inspection.facility.district}</TableCell>
                      <TableCell>{inspection.inspector.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{inspection.score}%</span>
                          <RiskBadge score={inspection.score} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            inspection.status === "completed"
                              ? "default"
                              : inspection.status === "reviewed"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {inspection.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredInspections.length === 0 && (
                <div className="text-center py-12">
                  <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No inspections found</h3>
                  <p className="text-gray-600">
                    {inspections.length === 0
                      ? "No inspections have been conducted yet."
                      : "Try adjusting your search terms."}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
