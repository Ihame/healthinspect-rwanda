"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { RiskBadge } from "@/components/ui/risk-badge"
import { ArrowLeft, Download, FileText, Calendar, User, Building2, Clock } from "lucide-react"
import jsPDF from "jspdf"

interface InspectionDetail {
  id: string
  date: string
  start_time: string | null
  end_time: string | null
  score: number
  max_score: number
  percentage: number
  status: string
  inspection_type: string
  risk_level: string
  inspector_notes: string | null
  facility_response: string | null
  follow_up_required: boolean
  follow_up_date: string | null
  created_at: string
  facility: {
    id: string
    name: string
    type: string
    district: string
    sector: string | null
    address: string | null
    phone: string | null
    license_number: string | null
    owner_name: string | null
    manager_name: string | null
  }
  inspector: {
    id: string
    name: string
    phone: string
  }
  inspection_items: Array<{
    id: string
    category_id: string | null
    question: string
    answer: string
    score: number
    max_score: number
    comment: string | null
    priority: string
  }>
}

export default function ViewInspectionPage() {
  const params = useParams()
  const router = useRouter()
  const { userProfile } = useAuth()
  const [inspection, setInspection] = useState<InspectionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchInspection(params.id as string)
    }
  }, [params.id])

  const fetchInspection = async (inspectionId: string) => {
    try {
      const { data, error } = await supabase
        .from("inspections")
        .select(`
          id,
          date,
          start_time,
          end_time,
          score,
          max_score,
          percentage,
          status,
          inspection_type,
          risk_level,
          inspector_notes,
          facility_response,
          follow_up_required,
          follow_up_date,
          created_at,
          facility:facilities(*),
          inspector:users!inspections_inspector_id_fkey(*),
          inspection_items(*)
        `)
        .eq("id", inspectionId)
        .single()

      if (error) throw error

      setInspection(data as InspectionDetail)
    } catch (error) {
      console.error("Error fetching inspection:", error)
      setError("Failed to load inspection details")
    } finally {
      setLoading(false)
    }
  }

  const generatePDF = () => {
    if (!inspection) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const margin = 20
    let yPosition = 30

    // Header
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("HEALTH FACILITY INSPECTION REPORT", pageWidth / 2, yPosition, { align: "center" })

    yPosition += 20
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text("Republic of Rwanda - Ministry of Health", pageWidth / 2, yPosition, { align: "center" })

    yPosition += 30

    // Facility Information
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("FACILITY INFORMATION", margin, yPosition)
    yPosition += 15

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Facility Name: ${inspection.facility.name}`, margin, yPosition)
    yPosition += 8
    doc.text(`Type: ${inspection.facility.type.toUpperCase()}`, margin, yPosition)
    yPosition += 8
    doc.text(`District: ${inspection.facility.district}`, margin, yPosition)
    yPosition += 8
    doc.text(`License Number: ${inspection.facility.license_number || "N/A"}`, margin, yPosition)
    yPosition += 8
    doc.text(`Manager: ${inspection.facility.manager_name || "N/A"}`, margin, yPosition)
    yPosition += 15

    // Inspection Information
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("INSPECTION DETAILS", margin, yPosition)
    yPosition += 15

    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Date: ${new Date(inspection.date).toLocaleDateString()}`, margin, yPosition)
    yPosition += 8
    doc.text(`Inspector: ${inspection.inspector.name}`, margin, yPosition)
    yPosition += 8
    doc.text(`Type: ${inspection.inspection_type.toUpperCase()}`, margin, yPosition)
    yPosition += 8
    doc.text(`Status: ${inspection.status.toUpperCase()}`, margin, yPosition)
    yPosition += 15

    // Score Summary
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("SCORE SUMMARY", margin, yPosition)
    yPosition += 15

    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Total Score: ${inspection.score}/${inspection.max_score} (${inspection.percentage}%)`, margin, yPosition)
    yPosition += 8
    doc.text(`Risk Level: ${inspection.risk_level.toUpperCase()}`, margin, yPosition)
    yPosition += 20

    // Inspection Items
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("INSPECTION ITEMS", margin, yPosition)
    yPosition += 15

    inspection.inspection_items.forEach((item, index) => {
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 30
      }

      doc.setFontSize(10)
      doc.setFont("helvetica", "bold")
      doc.text(`${index + 1}. ${item.question}`, margin, yPosition)
      yPosition += 8

      doc.setFont("helvetica", "normal")
      doc.text(`Answer: ${item.answer.toUpperCase()}`, margin + 10, yPosition)
      yPosition += 6
      doc.text(`Score: ${item.score}/${item.max_score}`, margin + 10, yPosition)
      yPosition += 6

      if (item.comment) {
        doc.text(`Comment: ${item.comment}`, margin + 10, yPosition)
        yPosition += 6
      }
      yPosition += 5
    })

    // Inspector Notes
    if (inspection.inspector_notes) {
      if (yPosition > 220) {
        doc.addPage()
        yPosition = 30
      }

      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("INSPECTOR NOTES", margin, yPosition)
      yPosition += 15

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const notes = doc.splitTextToSize(inspection.inspector_notes, pageWidth - 2 * margin)
      doc.text(notes, margin, yPosition)
    }

    // Save the PDF
    const fileName = `inspection-${inspection.facility.name.replace(/\s+/g, "-")}-${inspection.date}.pdf`
    doc.save(fileName)
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

  if (error || !inspection) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Inspection Not Found</h3>
          <p className="text-gray-600 mb-4">{error || "The requested inspection could not be found."}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inspection Details</h1>
              <p className="text-gray-600">View complete inspection report</p>
            </div>
          </div>
          <Button onClick={generatePDF} className="bg-[#4CAF50] hover:bg-[#45a049]">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>

        {/* Inspection Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Inspection Overview</span>
              <Badge
                variant={
                  inspection.status === "completed"
                    ? "default"
                    : inspection.status === "reviewed"
                      ? "secondary"
                      : "outline"
                }
              >
                {inspection.status.toUpperCase()}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Facility</p>
                  <p className="font-medium">{inspection.facility.name}</p>
                  <p className="text-sm text-gray-500">{inspection.facility.district}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{new Date(inspection.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">{inspection.inspection_type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Inspector</p>
                  <p className="font-medium">{inspection.inspector.name}</p>
                  <p className="text-sm text-gray-500">{inspection.inspector.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium">
                    {inspection.start_time && inspection.end_time
                      ? `${inspection.start_time} - ${inspection.end_time}`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Score Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  {inspection.score}/{inspection.max_score}
                </p>
                <p className="text-lg text-gray-600">{inspection.percentage}% Compliance</p>
              </div>
              <RiskBadge score={inspection.percentage} />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${
                  inspection.percentage >= 80
                    ? "bg-green-500"
                    : inspection.percentage >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${inspection.percentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Facility Details */}
        <Card>
          <CardHeader>
            <CardTitle>Facility Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Name</p>
                  <p className="text-gray-900">{inspection.facility.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Type</p>
                  <Badge variant={inspection.facility.type === "hospital" ? "default" : "secondary"}>
                    {inspection.facility.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">District</p>
                  <p className="text-gray-900">{inspection.facility.district}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Sector</p>
                  <p className="text-gray-900">{inspection.facility.sector || "N/A"}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">License Number</p>
                  <p className="text-gray-900">{inspection.facility.license_number || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Owner</p>
                  <p className="text-gray-900">{inspection.facility.owner_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Manager</p>
                  <p className="text-gray-900">{inspection.facility.manager_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Phone</p>
                  <p className="text-gray-900">{inspection.facility.phone || "N/A"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inspection Items */}
        <Card>
          <CardHeader>
            <CardTitle>Inspection Items ({inspection.inspection_items.length})</CardTitle>
            <CardDescription>Detailed assessment results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inspection.inspection_items.map((item, index) => (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">
                      {index + 1}. {item.question}
                    </h4>
                    <Badge
                      variant={
                        item.answer === "compliant" || item.answer === "yes"
                          ? "default"
                          : item.answer === "not_applicable" || item.answer === "na"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {item.answer.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">
                      Score: {item.score}/{item.max_score}
                    </span>
                    <Badge
                      variant={
                        item.priority === "critical"
                          ? "destructive"
                          : item.priority === "high"
                            ? "destructive"
                            : item.priority === "medium"
                              ? "secondary"
                              : "outline"
                      }
                    >
                      {item.priority} priority
                    </Badge>
                  </div>
                  {item.comment && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <strong>Comment:</strong> {item.comment}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Notes and Follow-up */}
        {(inspection.inspector_notes || inspection.facility_response || inspection.follow_up_required) && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {inspection.inspector_notes && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Inspector Notes</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{inspection.inspector_notes}</p>
                </div>
              )}

              {inspection.facility_response && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Facility Response</h4>
                  <p className="text-gray-700 bg-blue-50 p-3 rounded">{inspection.facility_response}</p>
                </div>
              )}

              {inspection.follow_up_required && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Follow-up Required</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Follow-up Required</Badge>
                    {inspection.follow_up_date && (
                      <span className="text-sm text-gray-600">
                        Due: {new Date(inspection.follow_up_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
