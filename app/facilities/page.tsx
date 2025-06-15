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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { Building2, Plus, Edit, Trash2, Search, Eye, MapPin, Phone, User } from "lucide-react"
import { useRouter } from "next/navigation"

interface Facility {
  id: string
  name: string
  type: "hospital" | "pharmacy"
  district: string
  sector: string | null
  cell: string | null
  village: string | null
  address: string | null
  phone: string | null
  email: string | null
  license_number: string | null
  owner_name: string | null
  manager_name: string | null
  is_active: boolean
  last_inspection_date: string | null
  last_inspection_score: number | null
  risk_level: "low" | "medium" | "high" | null
  created_at: string
}

const RWANDA_DISTRICTS = [
  "BUGESERA",
  "BURERA",
  "GAKENKE",
  "GASABO",
  "GATSIBO",
  "GICUMBI",
  "GISAGARA",
  "HUYE",
  "KAMONYI",
  "KARONGI",
  "KAYONZA",
  "KICUKIRO",
  "KIREHE",
  "MUHANGA",
  "MUSANZE",
  "NGORORERO",
  "NYABIHU",
  "NYAGATARE",
  "NYAMAGABE",
  "NYAMASHEKE",
  "NYANZA",
  "NYARUGENGE",
  "RULINDO",
  "RUHANGO",
  "RUBAVU",
  "RUSIZI",
  "RWAMAGANA",
]

export default function FacilitiesPage() {
  const { userProfile } = useAuth()
  const router = useRouter()
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [filteredFacilities, setFilteredFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDistrict, setFilterDistrict] = useState("")
  const [filterType, setFilterType] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null)
  const [viewingFacility, setViewingFacility] = useState<Facility | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "pharmacy" as "hospital" | "pharmacy",
    district: "",
    sector: "",
    cell: "",
    village: "",
    address: "",
    phone: "",
    email: "",
    license_number: "",
    owner_name: "",
    manager_name: "",
  })

  useEffect(() => {
    fetchFacilities()
  }, [userProfile])

  useEffect(() => {
    applyFilters()
  }, [facilities, searchTerm, filterDistrict, filterType])

  const fetchFacilities = async () => {
    try {
      let query = supabase.from("facilities").select("*")

      // Filter based on user role
      if (userProfile?.role === "pharmacy_inspector") {
        query = query.eq("type", "pharmacy")
      } else if (userProfile?.role === "hospital_inspector") {
        query = query.eq("type", "hospital")
      }

      const { data, error } = await query.order("name")

      if (error) throw error
      setFacilities(data || [])
    } catch (error) {
      console.error("Error fetching facilities:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...facilities]

    if (searchTerm) {
      filtered = filtered.filter(
        (facility) =>
          facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          facility.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
          facility.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          facility.manager_name?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (filterDistrict && filterDistrict !== "all") {
      filtered = filtered.filter((facility) => facility.district === filterDistrict)
    }

    if (filterType && filterType !== "all") {
      filtered = filtered.filter((facility) => facility.type === filterType)
    }

    setFilteredFacilities(filtered)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      type: "pharmacy",
      district: "",
      sector: "",
      cell: "",
      village: "",
      address: "",
      phone: "",
      email: "",
      license_number: "",
      owner_name: "",
      manager_name: "",
    })
  }

  const handleAdd = async () => {
    try {
      const { error } = await supabase.from("facilities").insert([
        {
          ...formData,
          is_active: true,
        },
      ])

      if (error) throw error

      setIsAddDialogOpen(false)
      resetForm()
      fetchFacilities()
    } catch (error) {
      console.error("Error adding facility:", error)
      alert("Error adding facility. Please try again.")
    }
  }

  const handleEdit = (facility: Facility) => {
    setEditingFacility(facility)
    setFormData({
      name: facility.name,
      type: facility.type,
      district: facility.district,
      sector: facility.sector || "",
      cell: facility.cell || "",
      village: facility.village || "",
      address: facility.address || "",
      phone: facility.phone || "",
      email: facility.email || "",
      license_number: facility.license_number || "",
      owner_name: facility.owner_name || "",
      manager_name: facility.manager_name || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingFacility) return

    try {
      const { error } = await supabase.from("facilities").update(formData).eq("id", editingFacility.id)

      if (error) throw error

      setIsEditDialogOpen(false)
      setEditingFacility(null)
      resetForm()
      fetchFacilities()
    } catch (error) {
      console.error("Error updating facility:", error)
      alert("Error updating facility. Please try again.")
    }
  }

  const handleDelete = async (facility: Facility) => {
    if (!confirm(`Are you sure you want to delete ${facility.name}?`)) return

    try {
      const { error } = await supabase.from("facilities").delete().eq("id", facility.id)

      if (error) throw error

      fetchFacilities()
    } catch (error) {
      console.error("Error deleting facility:", error)
      alert("Error deleting facility. Please try again.")
    }
  }

  const handleView = (facility: Facility) => {
    setViewingFacility(facility)
    setIsViewDialogOpen(true)
  }

  const startInspection = (facilityId: string) => {
    router.push(`/inspection/new?facility=${facilityId}`)
  }

  const canManageFacilities = userProfile?.role === "super_admin" || userProfile?.role === "admin"

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
            <h1 className="text-2xl font-bold text-gray-900">Health Facilities</h1>
            <p className="text-gray-600">Manage and inspect health facilities</p>
          </div>
          {canManageFacilities && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#4CAF50] hover:bg-[#45a049]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Facility
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Facility</DialogTitle>
                  <DialogDescription>Enter the details for the new health facility.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Facility Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter facility name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: "hospital" | "pharmacy") => setFormData({ ...formData, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hospital">Hospital</SelectItem>
                          <SelectItem value="pharmacy">Pharmacy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="district">District *</Label>
                      <Select
                        value={formData.district}
                        onValueChange={(value) => setFormData({ ...formData, district: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent>
                          {RWANDA_DISTRICTS.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="sector">Sector</Label>
                      <Input
                        id="sector"
                        value={formData.sector}
                        onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                        placeholder="Enter sector"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cell">Cell</Label>
                      <Input
                        id="cell"
                        value={formData.cell}
                        onChange={(e) => setFormData({ ...formData, cell: e.target.value })}
                        placeholder="Enter cell"
                      />
                    </div>
                    <div>
                      <Label htmlFor="village">Village</Label>
                      <Input
                        id="village"
                        value={formData.village}
                        onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                        placeholder="Enter village"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter full address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+250..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="facility@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="license_number">License Number</Label>
                      <Input
                        id="license_number"
                        value={formData.license_number}
                        onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                        placeholder="License number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="owner_name">Owner Name</Label>
                      <Input
                        id="owner_name"
                        value={formData.owner_name}
                        onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                        placeholder="Owner name"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="manager_name">Manager Name</Label>
                    <Input
                      id="manager_name"
                      value={formData.manager_name}
                      onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                      placeholder="Manager name"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAdd} className="bg-[#4CAF50] hover:bg-[#45a049]">
                    Add Facility
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
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
                  placeholder="Search facilities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterDistrict} onValueChange={setFilterDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="All districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All districts</SelectItem>
                  {RWANDA_DISTRICTS.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="hospital">Hospital</SelectItem>
                  <SelectItem value="pharmacy">Pharmacy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredFacilities.length} of {facilities.length} facilities
            </div>
          </CardContent>
        </Card>

        {/* Facilities Table */}
        <Card>
          <CardHeader>
            <CardTitle>Facilities ({facilities.length})</CardTitle>
            <CardDescription>Health facilities in Rwanda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Last Inspection</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFacilities.map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{facility.name}</p>
                          <p className="text-sm text-gray-500">{facility.license_number}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={facility.type === "hospital" ? "default" : "secondary"}>{facility.type}</Badge>
                      </TableCell>
                      <TableCell>{facility.district}</TableCell>
                      <TableCell>{facility.manager_name || "N/A"}</TableCell>
                      <TableCell>
                        {facility.last_inspection_date ? (
                          <div>
                            <p className="text-sm">{new Date(facility.last_inspection_date).toLocaleDateString()}</p>
                            {facility.last_inspection_score && (
                              <p className="text-xs text-gray-500">Score: {facility.last_inspection_score}%</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">Never</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleView(facility)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canManageFacilities && (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleEdit(facility)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDelete(facility)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            onClick={() => startInspection(facility.id)}
                            className="bg-[#4CAF50] hover:bg-[#45a049]"
                          >
                            Start Inspection
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredFacilities.length === 0 && (
                <div className="text-center py-12">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* View Facility Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Facility Details</DialogTitle>
              <DialogDescription>Complete information about the facility</DialogDescription>
            </DialogHeader>
            {viewingFacility && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Basic Information</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{viewingFacility.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={viewingFacility.type === "hospital" ? "default" : "secondary"}>
                          {viewingFacility.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{viewingFacility.district}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Contact Information</h4>
                    <div className="mt-2 space-y-2">
                      {viewingFacility.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{viewingFacility.phone}</span>
                        </div>
                      )}
                      {viewingFacility.email && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{viewingFacility.email}</span>
                        </div>
                      )}
                      {viewingFacility.address && (
                        <div className="text-sm text-gray-600">{viewingFacility.address}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Management</h4>
                    <div className="mt-2 space-y-2">
                      {viewingFacility.owner_name && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">Owner: {viewingFacility.owner_name}</span>
                        </div>
                      )}
                      {viewingFacility.manager_name && (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">Manager: {viewingFacility.manager_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">License & Status</h4>
                    <div className="mt-2 space-y-2">
                      {viewingFacility.license_number && (
                        <div className="text-sm">License: {viewingFacility.license_number}</div>
                      )}
                      <div className="flex items-center gap-2">
                        <Badge variant={viewingFacility.is_active ? "default" : "destructive"}>
                          {viewingFacility.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {viewingFacility.last_inspection_date && (
                  <div>
                    <h4 className="font-medium text-gray-900">Last Inspection</h4>
                    <div className="mt-2 text-sm text-gray-600">
                      Date: {new Date(viewingFacility.last_inspection_date).toLocaleDateString()}
                      {viewingFacility.last_inspection_score && (
                        <span className="ml-4">Score: {viewingFacility.last_inspection_score}%</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
              {viewingFacility && (
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false)
                    startInspection(viewingFacility.id)
                  }}
                  className="bg-[#4CAF50] hover:bg-[#45a049]"
                >
                  Start Inspection
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Facility Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Facility</DialogTitle>
              <DialogDescription>Update the facility information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Facility Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-type">Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "hospital" | "pharmacy") => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hospital">Hospital</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-district">District *</Label>
                  <Select
                    value={formData.district}
                    onValueChange={(value) => setFormData({ ...formData, district: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RWANDA_DISTRICTS.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-sector">Sector</Label>
                  <Input
                    id="edit-sector"
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-license">License Number</Label>
                  <Input
                    id="edit-license"
                    value={formData.license_number}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-owner">Owner Name</Label>
                  <Input
                    id="edit-owner"
                    value={formData.owner_name}
                    onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-manager">Manager Name</Label>
                  <Input
                    id="edit-manager"
                    value={formData.manager_name}
                    onChange={(e) => setFormData({ ...formData, manager_name: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} className="bg-[#4CAF50] hover:bg-[#45a049]">
                Update Facility
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
