"use client"

import { useEffect, useState } from "react"
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
import { FileText, Download, Filter } from "lucide-react"

interface InspectionReport {
  id: string
  date: string
  score: number
  percentage: number
  status: "pending" | "completed" | "reviewed"
  inspection_type: string
  risk_level: string
  facility: {
    id: string
    name: string
    type: string
    district: string
  }
  inspector: {
    id: string
    name: string
  }
}

export default function ReportsPage() {
  const { userProfile } = useAuth()
  const [reports, setReports] = useState<InspectionReport[]>([])
  const [filteredReports, setFilteredReports] = useState<InspectionReport[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    district: "",
    status: "",
    dateFrom: "",
    dateTo: "",
  })

  useEffect(() => {
    fetchReports()
  }, [userProfile])

  useEffect(() => {
    applyFilters()
  }, [reports, filters])

  const fetchReports = async () => {
    if (!userProfile) return

    try {
      let query = supabase.from("inspections").select(`
        id,
        date,
        score,
        percentage,
        status,
        inspection_type,
        risk_level,
        facilities (
          id,
          name,
          type,
          district
        ),
        inspector:users!inspections_inspector_id_fkey (
          id,
          name
        )
      `)

      // Filter by role - only show inspections user has permission to see
      if (userProfile.role === "pharmacy_inspector") {
        query = query.eq("inspector_id", userProfile.id)
      } else if (userProfile.role === "hospital_inspector") {
        query = query.eq("inspector_id", userProfile.id)
      } else if (userProfile.role === "pharmacy_supervisor") {
        // For pharmacy supervisor, we need to join with facilities to filter by type
        query = query.eq("facilities.type", "pharmacy")
      } else if (userProfile.role === "hospital_supervisor") {
        // For hospital supervisor, we need to join with facilities to filter by type
        query = query.eq("facilities.type", "hospital")
      }
      // super_admin sees all inspections (no additional filter)

      const { data, error } = await query.order("date", { ascending: false })

      if (error) throw error

      const formattedReports =
        data?.map((item) => ({
          id: item.id,
          date: item.date,
          score: item.score,
          percentage: item.percentage,
          status: item.status,
          inspection_type: item.inspection_type,
          risk_level: item.risk_level,
          facility: {
            id: item.facilities?.id || "",
            name: item.facilities?.name || "Unknown",
            type: item.facilities?.type || "Unknown",
            district: item.facilities?.district || "Unknown",
          },
          inspector: {
            id: item.inspector?.id || "",
            name: item.inspector?.name || "Unknown",
          },
        })) || []

      setReports(formattedReports)
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...reports]

    if (filters.district) {
      filtered = filtered.filter((report) =>
        report.facility.district.toLowerCase().includes(filters.district.toLowerCase()),
      )
    }

    if (filters.status) {
      filtered = filtered.filter((report) => report.status === filters.status)
    }

    if (filters.dateFrom) {
      filtered = filtered.filter((report) => new Date(report.date) >= new Date(filters.dateFrom))
    }

    if (filters.dateTo) {
      filtered = filtered.filter((report) => new Date(report.date) <= new Date(filters.dateTo))
    }

    setFilteredReports(filtered)
  }

  const generatePDFReport = async (reportId: string) => {
    try {
      // In a real application, this would generate and download a PDF
      // For demo purposes, we'll show an alert
      alert(`PDF report generation for inspection ${reportId} would be implemented here. This would include:
      
• Inspection details and scores
• Facility information
• Inspector notes and comments
• Photos (if any)
• Corrective actions required
• Signature verification`)
    } catch (error) {
      console.error("Error generating PDF:", error)
    }
  }

  const exportAllReports = () => {
    // Convert reports to CSV format
    const csvHeaders = ["Date", "Facility", "Type", "District", "Inspector", "Score", "Status"]
    const csvData = filteredReports.map((report) => [
      report.date,
      report.facility.name,
      report.facility.type,
      report.facility.district,
      report.inspector.name,
      report.score,
      report.status,
    ])

    const csvContent = [csvHeaders, ...csvData].map((row) => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `inspection-reports-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const clearFilters = () => {
    setFilters({
      district: "",
      status: "",
      dateFrom: "",
      dateTo: "",
    })
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Inspection Reports</h1>
            <p className="text-gray-600">View and manage inspection reports</p>
          </div>
          <Button onClick={exportAllReports} className="bg-[#4CAF50] hover:bg-[#45a049]">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">District</label>
                <Input
                  placeholder="Filter by district"
                  value={filters.district}
                  onChange={(e) => setFilters((prev) => ({ ...prev, district: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">From Date</label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">To Date</label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              <div className="text-sm text-gray-600 flex items-center">
                Showing {filteredReports.length} of {reports.length} reports
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
            <CardDescription>All inspection reports with filtering and export options</CardDescription>
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
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">{report.facility.name}</TableCell>
                      <TableCell>
                        <Badge variant={report.facility.type === "hospital" ? "default" : "secondary"}>
                          {report.facility.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.facility.district}</TableCell>
                      <TableCell>{report.inspector.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{report.score}%</span>
                          <RiskBadge score={report.score} />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            report.status === "completed"
                              ? "default"
                              : report.status === "reviewed"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => generatePDFReport(report.id)}>
                          <FileText className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredReports.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
                  <p className="text-gray-600">
                    {reports.length === 0
                      ? "No inspection reports available yet."
                      : "Try adjusting your filters to see more results."}
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
