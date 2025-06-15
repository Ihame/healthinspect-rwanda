"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import {
  ClipboardCheck,
  Building2,
  TrendingUp,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Users,
  BarChart3,
  Calendar,
  FileText,
} from "lucide-react"
import { RiskBadge } from "@/components/ui/risk-badge"
import Link from "next/link"
import type { DashboardStats } from "@/lib/types"

export default function DashboardPage() {
  const { userProfile, hasPermission } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalFacilities: 0,
    totalPharmacies: 0,
    totalHospitals: 0,
    totalInspections: 0,
    completedInspections: 0,
    pendingInspections: 0,
    highRiskFacilities: 0,
    averageScore: 0,
    inspectionsThisMonth: 0,
    inspectionsLastMonth: 0,
    complianceRate: 0,
    recentInspections: [],
    topPerformingFacilities: [],
    facilitiesNeedingAttention: [],
    districtStats: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [userProfile])

  const fetchDashboardData = async () => {
    if (!userProfile) return

    try {
      // Fetch facilities based on user role
      let facilitiesQuery = supabase.from("facilities").select("*")

      // Apply role-based filtering
      if (userProfile.role === "pharmacy_supervisor" || userProfile.role === "pharmacy_inspector") {
        facilitiesQuery = facilitiesQuery.eq("type", "pharmacy")
      } else if (userProfile.role === "hospital_supervisor" || userProfile.role === "hospital_inspector") {
        facilitiesQuery = facilitiesQuery.eq("type", "hospital")
      }

      const { data: facilities } = await facilitiesQuery

      // Fetch inspections based on user role with explicit relationship names
      let inspectionsQuery = supabase.from("inspections").select(`
      id,
      facility_id,
      inspector_id,
      inspection_type,
      date,
      score,
      percentage,
      status,
      risk_level,
      created_at,
      facility:facilities(*),
      inspector:users!inspections_inspector_id_fkey(*)
    `)

      // Apply role-based filtering for inspections
      if (userProfile.role === "pharmacy_inspector" || userProfile.role === "hospital_inspector") {
        inspectionsQuery = inspectionsQuery.eq("inspector_id", userProfile.id)
      }
      // For supervisors, we'll filter after getting the data since we need to check facility type

      const { data: inspections } = await inspectionsQuery.order("created_at", { ascending: false })

      // Filter inspections by facility type for supervisors
      let filteredInspections = inspections || []
      if (userProfile.role === "pharmacy_supervisor") {
        filteredInspections = inspections?.filter((i) => i.facility?.type === "pharmacy") || []
      } else if (userProfile.role === "hospital_supervisor") {
        filteredInspections = inspections?.filter((i) => i.facility?.type === "hospital") || []
      }

      // Calculate statistics using filteredInspections
      const totalFacilities = facilities?.length || 0
      const totalPharmacies = facilities?.filter((f) => f.type === "pharmacy").length || 0
      const totalHospitals = facilities?.filter((f) => f.type === "hospital").length || 0
      const totalInspections = filteredInspections.length
      const completedInspections = filteredInspections.filter((i) => i.status === "completed").length
      const pendingInspections = filteredInspections.filter((i) => i.status === "in_progress").length
      const highRiskFacilities = facilities?.filter((f) => f.risk_level === "high").length || 0

      // Calculate average score
      const completedInspectionsWithScores = filteredInspections.filter((i) => i.status === "completed" && i.score > 0)
      const averageScore =
        completedInspectionsWithScores.length > 0
          ? Math.round(
              completedInspectionsWithScores.reduce((sum, i) => sum + i.percentage, 0) /
                completedInspectionsWithScores.length,
            )
          : 0

      // Calculate monthly statistics
      const now = new Date()
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

      const inspectionsThisMonth = filteredInspections.filter((i) => new Date(i.created_at) >= thisMonth).length

      const inspectionsLastMonth = filteredInspections.filter((i) => {
        const inspectionDate = new Date(i.created_at)
        return inspectionDate >= lastMonth && inspectionDate < thisMonth
      }).length

      // Calculate compliance rate (facilities with score >= 80%)
      const complianceRate =
        completedInspectionsWithScores.length > 0
          ? Math.round(
              (completedInspectionsWithScores.filter((i) => i.percentage >= 80).length /
                completedInspectionsWithScores.length) *
                100,
            )
          : 0

      // Get recent inspections (last 5)
      const recentInspections = filteredInspections.slice(0, 5)

      // Get top performing facilities (highest scores)
      const topPerformingFacilities =
        facilities
          ?.filter((f) => f.last_inspection_score && f.last_inspection_score >= 90)
          .sort((a, b) => (b.last_inspection_score || 0) - (a.last_inspection_score || 0))
          .slice(0, 5) || []

      // Get facilities needing attention (low scores or overdue inspections)
      const facilitiesNeedingAttention =
        facilities
          ?.filter((f) => {
            const lowScore = f.last_inspection_score && f.last_inspection_score < 70
            const overdue =
              f.last_inspection_date &&
              new Date(f.last_inspection_date) < new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
            return lowScore || overdue || f.risk_level === "high"
          })
          .slice(0, 5) || []

      // Calculate district statistics
      const districtMap = new Map()
      facilities?.forEach((facility) => {
        if (!districtMap.has(facility.district)) {
          districtMap.set(facility.district, {
            facilityCount: 0,
            inspectionCount: 0,
            totalScore: 0,
            scoreCount: 0,
          })
        }
        const districtData = districtMap.get(facility.district)
        districtData.facilityCount++

        if (facility.last_inspection_score) {
          districtData.totalScore += facility.last_inspection_score
          districtData.scoreCount++
        }
      })

      filteredInspections.forEach((inspection) => {
        const district = inspection.facility?.district
        if (district && districtMap.has(district)) {
          districtMap.get(district).inspectionCount++
        }
      })

      const districtStats = Array.from(districtMap.entries())
        .map(([district, data]) => ({
          district,
          facilityCount: data.facilityCount,
          inspectionCount: data.inspectionCount,
          averageScore: data.scoreCount > 0 ? Math.round(data.totalScore / data.scoreCount) : 0,
          riskLevel:
            data.scoreCount > 0
              ? data.totalScore / data.scoreCount >= 80
                ? "low"
                : data.totalScore / data.scoreCount >= 60
                  ? "medium"
                  : "high"
              : ("medium" as "low" | "medium" | "high"),
        }))
        .sort((a, b) => b.averageScore - a.averageScore)

      setStats({
        totalFacilities,
        totalPharmacies,
        totalHospitals,
        totalInspections,
        completedInspections,
        pendingInspections,
        highRiskFacilities,
        averageScore,
        inspectionsThisMonth,
        inspectionsLastMonth,
        complianceRate,
        recentInspections,
        topPerformingFacilities,
        facilitiesNeedingAttention,
        districtStats,
      })
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getWelcomeMessage = () => {
    const hour = new Date().getHours()
    const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
    return `${greeting}, ${userProfile?.name}`
  }

  const getMonthlyTrend = () => {
    if (stats.inspectionsLastMonth === 0) return { trend: "neutral", percentage: 0 }
    const change = ((stats.inspectionsThisMonth - stats.inspectionsLastMonth) / stats.inspectionsLastMonth) * 100
    return {
      trend: change > 0 ? "up" : change < 0 ? "down" : "neutral",
      percentage: Math.abs(Math.round(change)),
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </MainLayout>
    )
  }

  const monthlyTrend = getMonthlyTrend()

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-[#4CAF50] to-[#45a049] rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold">{getWelcomeMessage()}</h1>
          <p className="text-green-100 mt-1">Welcome to the Rwanda Health Facility Inspection System</p>
          <div className="mt-4 flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {userProfile?.role === "super_admin"
                ? "System Administrator"
                : userProfile?.role === "pharmacy_supervisor"
                  ? "Pharmacy Supervisor"
                  : userProfile?.role === "hospital_supervisor"
                    ? "Hospital Supervisor"
                    : userProfile?.role === "pharmacy_inspector"
                      ? "Pharmacy Inspector"
                      : "Hospital Inspector"}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalFacilities}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalPharmacies} pharmacies, {stats.totalHospitals} hospitals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Inspections</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalInspections}</div>
              <p className="text-xs text-muted-foreground">
                {stats.completedInspections} completed, {stats.pendingInspections} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
              <div className="flex items-center space-x-2">
                <RiskBadge score={stats.averageScore} />
                <span className="text-xs text-muted-foreground">{stats.complianceRate}% compliance rate</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inspectionsThisMonth}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {monthlyTrend.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500 mr-1" />}
                {monthlyTrend.trend === "down" && <TrendingUp className="h-3 w-3 text-red-500 mr-1 rotate-180" />}
                {monthlyTrend.percentage > 0 && `${monthlyTrend.percentage}% from last month`}
                {monthlyTrend.percentage === 0 && "No change from last month"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Alert Cards for High Priority Items */}
        {stats.highRiskFacilities > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                High Risk Facilities Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-700">
                {stats.highRiskFacilities} facilities are marked as high risk and require immediate attention.
              </p>
              <Button asChild className="mt-2 bg-red-600 hover:bg-red-700">
                <Link href="/facilities?risk=high">View High Risk Facilities</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Inspections */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Inspections</CardTitle>
              <CardDescription>Latest inspection activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentInspections.map((inspection) => (
                  <div key={inspection.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{inspection.facility?.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(inspection.date).toLocaleDateString()} • {inspection.inspector?.name}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={inspection.facility?.type === "hospital" ? "default" : "secondary"}>
                          {inspection.facility?.type}
                        </Badge>
                        <Badge
                          variant={
                            inspection.status === "completed"
                              ? "default"
                              : inspection.status === "in_progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {inspection.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{inspection.percentage}%</p>
                      <RiskBadge score={inspection.percentage} />
                    </div>
                  </div>
                ))}
                {stats.recentInspections.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No recent inspections</p>
                )}
              </div>
              {stats.recentInspections.length > 0 && (
                <div className="mt-4">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/inspections">View All Inspections</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Performing Facilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Top Performing Facilities
              </CardTitle>
              <CardDescription>Facilities with excellent compliance scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topPerformingFacilities.map((facility) => (
                  <div key={facility.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium">{facility.name}</p>
                      <p className="text-sm text-gray-500">{facility.district}</p>
                      <Badge variant={facility.type === "hospital" ? "default" : "secondary"} className="mt-1">
                        {facility.type}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{facility.last_inspection_score}%</p>
                      <p className="text-xs text-gray-500">
                        {facility.last_inspection_date && new Date(facility.last_inspection_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {stats.topPerformingFacilities.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No high-performing facilities yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Facilities Needing Attention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
                Facilities Needing Attention
              </CardTitle>
              <CardDescription>Facilities with low scores or overdue inspections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.facilitiesNeedingAttention.map((facility) => (
                  <div key={facility.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium">{facility.name}</p>
                      <p className="text-sm text-gray-500">{facility.district}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={facility.type === "hospital" ? "default" : "secondary"}>{facility.type}</Badge>
                        <RiskBadge score={facility.last_inspection_score || 0} />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-600">
                        {facility.last_inspection_score || "N/A"}
                        {facility.last_inspection_score && "%"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {facility.last_inspection_date
                          ? new Date(facility.last_inspection_date).toLocaleDateString()
                          : "Never inspected"}
                      </p>
                    </div>
                  </div>
                ))}
                {stats.facilitiesNeedingAttention.length === 0 && (
                  <p className="text-gray-500 text-center py-8">All facilities are performing well</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* District Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                District Performance
              </CardTitle>
              <CardDescription>Performance overview by district</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.districtStats.slice(0, 5).map((district) => (
                  <div key={district.district} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{district.district}</p>
                      <p className="text-sm text-gray-500">
                        {district.facilityCount} facilities • {district.inspectionCount} inspections
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{district.averageScore}%</p>
                      <RiskBadge score={district.averageScore} />
                    </div>
                  </div>
                ))}
                {stats.districtStats.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No district data available</p>
                )}
              </div>
              {stats.districtStats.length > 5 && (
                <div className="mt-4">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/reports">View Full District Report</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {hasPermission("inspection", "create") && (
                <Button asChild className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Link href="/inspection/new">
                    <ClipboardCheck className="h-6 w-6" />
                    <span>New Inspection</span>
                  </Link>
                </Button>
              )}

              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link href="/facilities">
                  <Building2 className="h-6 w-6" />
                  <span>View Facilities</span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link href="/reports">
                  <FileText className="h-6 w-6" />
                  <span>Generate Report</span>
                </Link>
              </Button>

              {hasPermission("user", "create") && (
                <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Link href="/admin/users">
                    <Users className="h-6 w-6" />
                    <span>Manage Users</span>
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
