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
import { supabase } from "@/lib/supabase"
import { Building2, Plus, Edit, Trash2, Search } from "lucide-react"
import { useRouter } from "next/navigation"

interface Facility {
  id: string
  name: string
  level: string
  type: "hospital" | "pharmacy"
  district: string
  latitude: number | null
  longitude: number | null
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

export default function AdminFacilitiesPage() {
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
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    type: "pharmacy" as "hospital" | "pharmacy",
    district: "",
    latitude: "",
    longitude: "",
  })

  // Check if user is admin
  useEffect(() => {
    if (userProfile && userProfile.role !== "admin") {
      router.push("/dashboard")
    }
  }, [userProfile, router])

  useEffect(() => {
    fetchFacilities()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [facilities, searchTerm, filterDistrict, filterType])

  const fetchFacilities = async () => {
    try {
      const { data, error } = await supabase.from("facilities").select("*").order("name")

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
      filtered = filtered.filter((facility) => facility.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (filterDistrict) {
      filtered = filtered.filter((facility) => facility.district === filterDistrict)
    }

    if (filterType) {
      filtered = filtered.filter((facility) => facility.type === filterType)
    }

    setFilteredFacilities(filtered)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      level: "",
      type: "pharmacy",
      district: "",
      latitude: "",
      longitude: "",
    })
  }

  const handleAdd = async () => {
    try {
      const { error } = await supabase.from("facilities").insert([
        {
          name: formData.name,
          level: formData.level,
          type: formData.type,
          district: formData.district,
          latitude: formData.latitude ? Number.parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? Number.parseFloat(formData.longitude) : null,
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
      level: facility.level,
      type: facility.type,
      district: facility.district,
      latitude: facility.latitude?.toString() || "",
      longitude: facility.longitude?.toString() || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingFacility) return

    try {
      const { error } = await supabase
        .from("facilities")
        .update({
          name: formData.name,
          level: formData.level,
          type: formData.type,
          district: formData.district,
          latitude: formData.latitude ? Number.parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? Number.parseFloat(formData.longitude) : null,
        })
        .eq("id", editingFacility.id)

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

  if (userProfile?.role !== "admin") {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">Only administrators can access this page.</p>
        </div>
      </MainLayout>
    )
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
            <h1 className="text-2xl font-bold text-gray-900">Facility Management</h1>
            <p className="text-gray-600">Manage health facilities across Rwanda</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#4CAF50] hover:bg-[#45a049]">
                <Plus className="h-4 w-4 mr-2" />
                Add Facility
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Facility</DialogTitle>
                <DialogDescription>Enter the details for the new health facility.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Type
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "hospital" | "pharmacy") => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hospital">Hospital</SelectItem>
                      <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="level" className="text-right">
                    Level
                  </Label>
                  <Input
                    id="level"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    placeholder="e.g., Community, District, Referral"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="district" className="text-right">
                    District
                  </Label>
                  <Select
                    value={formData.district}
                    onValueChange={(value) => setFormData({ ...formData, district: value })}
                  >
                    <SelectTrigger className="col-span-3">
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="latitude" className="text-right">
                    Latitude
                  </Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="longitude" className="text-right">
                    Longitude
                  </Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="col-span-3"
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
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
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
            <CardDescription>All registered health facilities in Rwanda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Coordinates</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFacilities.map((facility) => (
                    <TableRow key={facility.id}>
                      <TableCell className="font-medium">{facility.name}</TableCell>
                      <TableCell>
                        <Badge variant={facility.type === "hospital" ? "default" : "secondary"}>{facility.type}</Badge>
                      </TableCell>
                      <TableCell>{facility.level}</TableCell>
                      <TableCell>{facility.district}</TableCell>
                      <TableCell>
                        {facility.latitude && facility.longitude
                          ? `${facility.latitude.toFixed(4)}, ${facility.longitude.toFixed(4)}`
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(facility)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(facility)}>
                            <Trash2 className="h-4 w-4" />
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

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Facility</DialogTitle>
              <DialogDescription>Update the facility information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">
                  Type
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "hospital" | "pharmacy") => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-level" className="text-right">
                  Level
                </Label>
                <Input
                  id="edit-level"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  placeholder="e.g., Community, District, Referral"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-district" className="text-right">
                  District
                </Label>
                <Select
                  value={formData.district}
                  onValueChange={(value) => setFormData({ ...formData, district: value })}
                >
                  <SelectTrigger className="col-span-3">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-latitude" className="text-right">
                  Latitude
                </Label>
                <Input
                  id="edit-latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-longitude" className="text-right">
                  Longitude
                </Label>
                <Input
                  id="edit-longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="col-span-3"
                />
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
