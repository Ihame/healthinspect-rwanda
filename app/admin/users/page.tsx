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
import { Users, Plus, Edit, Trash2, Search, Shield } from "lucide-react"

interface User {
  id: string
  name: string
  email?: string
  phone: string
  role: "super_admin" | "pharmacy_supervisor" | "hospital_supervisor" | "pharmacy_inspector" | "hospital_inspector"
  district?: string
  is_active: boolean
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

export default function AdminUsersPage() {
  const { userProfile } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "pharmacy_inspector" as User["role"],
    district: "",
  })

  // Check if user has permission
  useEffect(() => {
    if (userProfile && !["super_admin", "pharmacy_supervisor", "hospital_supervisor"].includes(userProfile.role)) {
      router.push("/dashboard")
    }
  }, [userProfile, router])

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [users, searchTerm, filterRole])

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*").order("name")

      if (error) throw error
      setUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...users]

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm),
      )
    }

    if (filterRole) {
      filtered = filtered.filter((user) => user.role === filterRole)
    }

    setFilteredUsers(filtered)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "pharmacy_inspector",
      district: "",
    })
  }

  const handleAdd = async () => {
    try {
      const { error } = await supabase.from("users").insert([
        {
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone,
          role: formData.role,
          district: formData.district || null,
          created_by: userProfile?.id,
          is_active: true,
        },
      ])

      if (error) throw error

      setIsAddDialogOpen(false)
      resetForm()
      fetchUsers()
      alert("User added successfully!")
    } catch (error) {
      console.error("Error adding user:", error)
      alert("Error adding user. Please try again.")
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email || "",
      phone: user.phone,
      role: user.role,
      district: user.district || "",
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingUser) return

    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone,
          role: formData.role,
          district: formData.district || null,
        })
        .eq("id", editingUser.id)

      if (error) throw error

      setIsEditDialogOpen(false)
      setEditingUser(null)
      resetForm()
      fetchUsers()
      alert("User updated successfully!")
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Error updating user. Please try again.")
    }
  }

  const handleDelete = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return

    try {
      const { error } = await supabase.from("users").delete().eq("id", user.id)

      if (error) throw error

      fetchUsers()
      alert("User deleted successfully!")
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("Error deleting user. Please try again.")
    }
  }

  const toggleUserStatus = async (user: User) => {
    try {
      const { error } = await supabase.from("users").update({ is_active: !user.is_active }).eq("id", user.id)

      if (error) throw error

      fetchUsers()
    } catch (error) {
      console.error("Error updating user status:", error)
      alert("Error updating user status. Please try again.")
    }
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-100 text-purple-800"
      case "pharmacy_supervisor":
        return "bg-blue-100 text-blue-800"
      case "hospital_supervisor":
        return "bg-green-100 text-green-800"
      case "pharmacy_inspector":
        return "bg-orange-100 text-orange-800"
      case "hospital_inspector":
        return "bg-teal-100 text-teal-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!userProfile || !["super_admin", "pharmacy_supervisor", "hospital_supervisor"].includes(userProfile.role)) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">You don't have permission to access this page.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600">Manage system users and their permissions</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#4CAF50] hover:bg-[#45a049]">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account for the system.</DialogDescription>
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
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: User["role"]) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pharmacy_inspector">Pharmacy Inspector</SelectItem>
                      <SelectItem value="hospital_inspector">Hospital Inspector</SelectItem>
                      {userProfile?.role === "super_admin" && (
                        <>
                          <SelectItem value="pharmacy_supervisor">Pharmacy Supervisor</SelectItem>
                          <SelectItem value="hospital_supervisor">Hospital Supervisor</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
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
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAdd} className="bg-[#4CAF50] hover:bg-[#45a049]">
                  Add User
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="super_admin">Super Administrator</SelectItem>
                  <SelectItem value="pharmacy_supervisor">Pharmacy Supervisor</SelectItem>
                  <SelectItem value="hospital_supervisor">Hospital Supervisor</SelectItem>
                  <SelectItem value="pharmacy_inspector">Pharmacy Inspector</SelectItem>
                  <SelectItem value="hospital_inspector">Hospital Inspector</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({users.length})</CardTitle>
            <CardDescription>All system users and their roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email || "N/A"}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(user.role)}>{getRoleDisplayName(user.role)}</Badge>
                      </TableCell>
                      <TableCell>{user.district || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={user.is_active ? "default" : "secondary"}>
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => toggleUserStatus(user)}>
                            {user.is_active ? "Deactivate" : "Activate"}
                          </Button>
                          {userProfile?.role === "super_admin" && (
                            <Button variant="outline" size="sm" onClick={() => handleDelete(user)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
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
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Update user information and permissions.</DialogDescription>
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
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role" className="text-right">
                  Role
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: User["role"]) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pharmacy_inspector">Pharmacy Inspector</SelectItem>
                    <SelectItem value="hospital_inspector">Hospital Inspector</SelectItem>
                    {userProfile?.role === "super_admin" && (
                      <>
                        <SelectItem value="pharmacy_supervisor">Pharmacy Supervisor</SelectItem>
                        <SelectItem value="hospital_supervisor">Hospital Supervisor</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
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
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate} className="bg-[#4CAF50] hover:bg-[#45a049]">
                Update User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
