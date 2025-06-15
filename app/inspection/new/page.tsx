"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { Save, FileText, AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Facility {
  id: string
  name: string
  type: "hospital" | "pharmacy"
  district: string
  sector?: string
}

// Rwanda Official Pharmacy Inspection Form (19 Categories)
const PHARMACY_QUESTIONS = [
  {
    id: 1,
    category: "Power Supply",
    questions: ["Presence of power generator", "System of installation done properly", "Generator ready for use"],
  },
  {
    id: 2,
    category: "Water & Hygiene",
    questions: [
      "Presence of water dispenser",
      "Clean drinking water for patients available",
      "Single use cups available",
      "Availability of drinking water at patient's disposal",
    ],
  },
  {
    id: 3,
    category: "Refrigeration",
    questions: [
      "Presence of Refrigerator connected on power supply",
      "Refrigerator in working condition with thermometer",
      "No non-medical items in refrigerator (no food)",
      "Updated daily temperature control sheet",
    ],
  },
  {
    id: 4,
    category: "Drug Storage",
    questions: [
      "Store is free from pests (cockroaches, rats, mice)",
      "Presence of sufficient aeration",
      "Drugs stored on pallets, shelves etc",
      "Absence of humidity",
      "Compliance to Narcotic drugs storage requirement",
      "Windows have curtains for protecting drugs from heat/light",
    ],
  },
  {
    id: 5,
    category: "Cleanliness & Sanitation",
    questions: [
      "Painted counter and shelves",
      "Availability of water supply and sink",
      "Clean toilet with required hygienic materials",
      "Cleaned floor, ceiling and walls",
      "Shelves, counter and drugs are free from dust",
      "Facility is well maintained—no cracks, holes or water damage",
    ],
  },
  {
    id: 6,
    category: "Pharmacist Qualification",
    questions: [
      "Physical presence of Pharmacist",
      "RFDA authorization license in his name",
      "NPC license to practice",
      "Letter informing RSSB/RFDA (if new responsible pharmacist)",
      "Appropriate patient counselling is done",
      "Patients are greeted and treated with respect",
      "Conformity to the dressing code with required attire",
    ],
  },
  {
    id: 7,
    category: "Nurse Qualification",
    questions: [
      "License from National Nursing and Midwives Council",
      "Patients are greeted and treated with respect",
      "Appropriate patient counselling is done",
      "Conformity to the dressing code with required attire",
    ],
  },
  {
    id: 8,
    category: "Business Registration",
    questions: ["Trade license from RDB", "Pharmacy shareholders documentation"],
  },
  {
    id: 9,
    category: "Computer System",
    questions: [
      "Dispensing process steps are followed",
      "Billing is done using software",
      "Expired drugs alarm in software",
    ],
  },
  {
    id: 10,
    category: "Stock Management",
    questions: ["Stock updating while delivering (physical and theoretical stock match)"],
  },
  {
    id: 11,
    category: "Stock Availability",
    questions: [
      "Sufficient stock for meeting patient diverse needs",
      "Accessibility and availability of medicines to RSSB affiliates",
    ],
  },
  {
    id: 12,
    category: "Location & Premises",
    questions: ["Accessibility of pharmacy premises", "Pharmacy premises recognized by RSSB"],
  },
  {
    id: 13,
    category: "Medicine Traceability",
    questions: [
      "Medicines are safe for patients (genuine and appropriate)",
      "Invoices from wholesalers for any specified product",
      "Prevention of counterfeit pharmaceutical products",
    ],
  },
  {
    id: 14,
    category: "Fraud Detection",
    questions: [
      "No presence of unauthentic prescriptions",
      "Prescription drugs dispensed as written",
      "No dispensing of expired, fake, diluted or illegal drugs",
      "No altering prescriptions to increase quantity",
      "No presence of prescriptions without owners",
    ],
  },
  {
    id: 15,
    category: "RSSB List Compliance",
    questions: [
      "Availability of the list and prices of reimbursable medicines",
      "Availability of bills and medical prescriptions",
      "Bills comply to the prices list of reimbursable medicines",
      "Obligation to serve medicines without denial",
    ],
  },
  {
    id: 16,
    category: "Expired Drugs Management",
    questions: [
      "Absence of expired medicines in dispensing shelves",
      "Presence of expiry indicator on medicines near to expiry",
      "Presence of separate stock for already expired medicines",
      "Presence of record for disposal of medicines",
    ],
  },
  {
    id: 17,
    category: "RSSB Eligibility Verification",
    questions: [
      "Awareness of staff to check eligibility status",
      "Checking RSSB affiliates eligibility before serving them",
      "Timely recording of patients in kwivuza system",
    ],
  },
  {
    id: 18,
    category: "Bill Validity",
    questions: ["Presence of patient names and contact on bills", "Presence of authentic patient signature on bills"],
  },
  {
    id: 19,
    category: "Price Feedback",
    questions: [
      "Prices appropriately set according to RSSB list",
      "Medicines not on RSSB list but commonly prescribed are noted",
    ],
  },
]

// Hospital Inspection Questions (Suggested)
const HOSPITAL_QUESTIONS = [
  {
    id: 1,
    category: "Infrastructure",
    questions: [
      "Hospital building is structurally sound",
      "Adequate lighting in all areas",
      "Proper ventilation systems",
      "Emergency exits clearly marked",
    ],
  },
  {
    id: 2,
    category: "Medical Equipment",
    questions: [
      "Essential medical equipment is functional",
      "Equipment maintenance records are up to date",
      "Backup power systems are operational",
      "Medical gas systems are properly maintained",
    ],
  },
  {
    id: 3,
    category: "Infection Control",
    questions: [
      "Hand hygiene facilities are available",
      "Isolation rooms are properly equipped",
      "Waste segregation is properly implemented",
      "Sterilization equipment is functional",
    ],
  },
  {
    id: 4,
    category: "Staff Qualifications",
    questions: [
      "Medical staff have valid licenses",
      "Nursing staff are properly certified",
      "Staff training records are maintained",
      "Adequate staffing levels maintained",
    ],
  },
  {
    id: 5,
    category: "Patient Safety",
    questions: [
      "Patient identification systems in place",
      "Medication administration protocols followed",
      "Emergency response procedures established",
      "Patient complaint system operational",
    ],
  },
  {
    id: 6,
    category: "Laboratory Services",
    questions: [
      "Laboratory equipment is calibrated",
      "Quality control measures in place",
      "Proper specimen handling procedures",
      "Timely reporting of results",
    ],
  },
  {
    id: 7,
    category: "Pharmacy Services",
    questions: [
      "Hospital pharmacy is properly licensed",
      "Drug storage conditions are appropriate",
      "Prescription verification processes in place",
      "Controlled substances properly secured",
    ],
  },
  {
    id: 8,
    category: "Documentation",
    questions: [
      "Patient records are properly maintained",
      "Medical documentation is complete",
      "Consent forms are properly obtained",
      "Incident reporting system in place",
    ],
  },
]

export default function NewInspectionPage() {
  const { userProfile } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const facilityId = searchParams.get("facility")

  const [facility, setFacility] = useState<Facility | null>(null)
  const [answers, setAnswers] = useState<{ [key: string]: "compliant" | "non_compliant" | "not_applicable" }>({})
  const [comments, setComments] = useState<{ [key: string]: string }>({})
  const [inspectorNotes, setInspectorNotes] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!userProfile) {
      router.push("/login")
      return
    }

    if (!["pharmacy_inspector", "hospital_inspector", "super_admin"].includes(userProfile.role)) {
      setError("You don't have permission to create inspections")
      setLoading(false)
      return
    }

    if (!facilityId) {
      setError("No facility selected for inspection. Please go back and select a facility.")
      setLoading(false)
      return
    }

    fetchFacility()
  }, [facilityId, userProfile, router])

  const fetchFacility = async () => {
    if (!facilityId) return

    try {
      const { data, error } = await supabase
        .from("facilities")
        .select("id, name, type, district, sector")
        .eq("id", facilityId)
        .single()

      if (error) throw new Error(`Database error: ${error.message}`)
      if (!data) throw new Error("Facility not found")

      // Check if user can inspect this facility type
      if (userProfile?.role === "pharmacy_inspector" && data.type !== "pharmacy") {
        throw new Error("You can only inspect pharmacies")
      }

      if (userProfile?.role === "hospital_inspector" && data.type !== "hospital") {
        throw new Error("You can only inspect hospitals")
      }

      setFacility(data)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getQuestions = () => {
    return facility?.type === "pharmacy" ? PHARMACY_QUESTIONS : HOSPITAL_QUESTIONS
  }

  const calculateScore = () => {
    const questions = getQuestions()
    const totalQuestions = questions.reduce((sum, category) => sum + category.questions.length, 0)
    const compliantAnswers = Object.values(answers).filter((answer) => answer === "compliant").length
    const applicableQuestions = Object.values(answers).filter((answer) => answer !== "not_applicable").length

    if (applicableQuestions === 0) return 0
    return Math.round((compliantAnswers / applicableQuestions) * 100)
  }

  const getRiskLevel = (score: number): "low" | "medium" | "high" => {
    if (score >= 80) return "low"
    if (score >= 60) return "medium"
    return "high"
  }

  const saveInspection = async () => {
    if (!facility || !userProfile) {
      setError("Missing facility or user information")
      return
    }

    const answeredQuestions = Object.keys(answers).length
    if (answeredQuestions === 0) {
      setError("Please answer at least one question before saving")
      return
    }

    setSaving(true)
    setError(null)

    try {
      const score = calculateScore()
      const riskLevel = getRiskLevel(score)

      // Use the fixed UUID from our database setup
      const inspectorId =
        userProfile.role === "pharmacy_inspector"
          ? "22222222-2222-2222-2222-222222222222"
          : "33333333-3333-3333-3333-333333333333"

      const inspectionData = {
        facility_id: facility.id,
        inspector_id: inspectorId,
        inspection_type: "routine",
        date: new Date().toISOString().split("T")[0],
        score: score,
        max_score: 100,
        percentage: score,
        status: "completed",
        risk_level: riskLevel,
        inspector_notes: inspectorNotes || null,
        follow_up_required: score < 70,
      }

      const { data: inspectionResult, error: inspectionError } = await supabase
        .from("inspections")
        .insert(inspectionData)
        .select()
        .single()

      if (inspectionError) {
        throw new Error(`Failed to save inspection: ${inspectionError.message}`)
      }

      // Save individual question responses
      const questions = getQuestions()
      const inspectionItems = []

      questions.forEach((category, categoryIndex) => {
        category.questions.forEach((question, questionIndex) => {
          const key = `${categoryIndex}-${questionIndex}`
          if (answers[key]) {
            inspectionItems.push({
              inspection_id: inspectionResult.id,
              question: question,
              answer: answers[key],
              score: answers[key] === "compliant" ? 1 : 0,
              max_score: 1,
              comment: comments[key] || null,
              priority: "medium",
            })
          }
        })
      })

      if (inspectionItems.length > 0) {
        const { error: itemsError } = await supabase.from("inspection_items").insert(inspectionItems)

        if (itemsError) {
          console.error("Warning: Could not save inspection items:", itemsError)
        }
      }

      // Update facility
      await supabase
        .from("facilities")
        .update({
          last_inspection_date: new Date().toISOString().split("T")[0],
          last_inspection_score: score,
          risk_level: riskLevel,
        })
        .eq("id", facility.id)

      setSuccess(true)
      setTimeout(() => {
        router.push("/inspections")
      }, 2000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading facility information...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (success) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="text-center p-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">Inspection Completed!</h2>
              <p className="text-gray-600 mb-4">
                Score: {calculateScore()}% | Risk Level: {getRiskLevel(calculateScore()).toUpperCase()}
              </p>
              <p className="text-sm text-gray-500">Redirecting to inspections page...</p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex space-x-4">
            <Button onClick={() => router.push("/facilities")}>Back to Facilities</Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!facility) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Facility not found</h3>
          <Button onClick={() => router.push("/facilities")}>Back to Facilities</Button>
        </div>
      </MainLayout>
    )
  }

  const questions = getQuestions()
  const score = calculateScore()
  const totalQuestions = questions.reduce((sum, category) => sum + category.questions.length, 0)
  const answeredQuestions = Object.keys(answers).length
  const riskLevel = getRiskLevel(score)

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-6 w-6 mr-2 text-[#4CAF50]" />
              {facility.type === "pharmacy" ? "Pharmacy" : "Hospital"} Inspection
            </CardTitle>
            <CardDescription>
              Inspector: {userProfile?.name} | Date: {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Facility Name</Label>
              <Input value={facility.name} disabled className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Type</Label>
              <Input value={facility.type.charAt(0).toUpperCase() + facility.type.slice(1)} disabled className="mt-1" />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">District</Label>
              <Input value={facility.district} disabled className="mt-1" />
            </div>
          </CardContent>
        </Card>

        {/* Score Display */}
        <Card>
          <CardHeader>
            <CardTitle>Current Score</CardTitle>
            <CardDescription>Based on answered questions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <div>
                <div className="text-4xl font-bold text-[#4CAF50]">{score}%</div>
                <div className="text-sm text-gray-600">
                  {answeredQuestions} of {totalQuestions} questions answered
                </div>
              </div>
              <div>
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    riskLevel === "low"
                      ? "bg-green-100 text-green-800"
                      : riskLevel === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  Risk Level: {riskLevel.toUpperCase()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions by Category */}
        {questions.map((category, categoryIndex) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="text-lg">{category.category}</CardTitle>
              <CardDescription>{category.questions.length} questions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {category.questions.map((question, questionIndex) => {
                const key = `${categoryIndex}-${questionIndex}`
                return (
                  <div key={questionIndex} className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <div>
                      <Label className="text-base font-medium">{question}</Label>
                    </div>

                    <RadioGroup
                      value={answers[key] || ""}
                      onValueChange={(value) =>
                        setAnswers({ ...answers, [key]: value as "compliant" | "non_compliant" | "not_applicable" })
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="compliant" id={`compliant-${key}`} />
                        <Label htmlFor={`compliant-${key}`} className="text-green-700 font-medium">
                          ✅ Compliant
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="non_compliant" id={`non_compliant-${key}`} />
                        <Label htmlFor={`non_compliant-${key}`} className="text-red-700 font-medium">
                          ❌ Non-Compliant
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="not_applicable" id={`not_applicable-${key}`} />
                        <Label htmlFor={`not_applicable-${key}`} className="text-gray-600 font-medium">
                          ➖ Not Applicable
                        </Label>
                      </div>
                    </RadioGroup>

                    {answers[key] && (
                      <div>
                        <Label htmlFor={`comment-${key}`} className="text-sm font-medium">
                          Observations (optional)
                        </Label>
                        <Textarea
                          id={`comment-${key}`}
                          placeholder="Add specific observations or notes..."
                          value={comments[key] || ""}
                          onChange={(e) => setComments({ ...comments, [key]: e.target.value })}
                          rows={2}
                          className="mt-1"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        ))}

        {/* Inspector Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Inspector Notes</CardTitle>
            <CardDescription>Overall observations and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add overall observations, recommendations, or additional comments..."
              value={inspectorNotes}
              onChange={(e) => setInspectorNotes(e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pb-8">
          <Button variant="outline" onClick={() => router.push("/facilities")}>
            Cancel
          </Button>
          <Button
            onClick={saveInspection}
            disabled={saving || answeredQuestions === 0}
            className="bg-[#4CAF50] hover:bg-[#45a049] text-white px-8 py-2"
            size="lg"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving Inspection...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Complete Inspection ({score}%)
              </>
            )}
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}
