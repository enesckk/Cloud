"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
  type AdminUser,
} from "@/lib/api-client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { toast } from "sonner"

const TITLE_OPTIONS = [
  "CEO",
  "CTO",
  "IT Manager",
  "Project Manager",
  "Developer",
  "Business Analyst",
  "Consultant",
  "Other",
]

export default function AdminUsersPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(false)
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [titleFilter, setTitleFilter] = useState<string>("all")

  useEffect(() => {
    if (user?.id) {
      loadUsers()
    }
  }, [user])

  // Filter users based on search query and title filter
  useEffect(() => {
    let filtered = users

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          (u.title && u.title.toLowerCase().includes(query))
      )
    }

    // Apply title filter
    if (titleFilter !== "all") {
      filtered = filtered.filter((u) => u.title === titleFilter)
    }

    setFilteredUsers(filtered)
  }, [users, searchQuery, titleFilter])

  const loadUsers = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const response = await getAdminUsers(user.id)
      // Filter out admin users - only show regular users
      // Backend returns boolean, so we can use simple negation
      const regularUsers = response.users.filter((u) => !u.is_admin)
      setUsers(regularUsers)
      setFilteredUsers(regularUsers)
    } catch (err: any) {
      toast.error(err.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (data: any) => {
    if (!user?.id) return
    try {
      await createAdminUser(user.id, data)
      const description = `"${data.email}" has been added to the system.`
      toast.success("User created successfully", {
        description,
      })
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cloudguide:notification", {
          detail: { type: "success", title: "New user registered", description, target: "admin" },
        }))
      }
      setUserDialogOpen(false)
      loadUsers()
    } catch (err: any) {
      toast.error(err.message || "Failed to create user")
    }
  }

  const handleUpdateUser = async (userId: string, updates: Partial<AdminUser>) => {
    if (!user?.id) return
    try {
      await updateAdminUser(user.id, userId, updates)
      toast.success("User updated successfully")
      setUserDialogOpen(false)
      setEditingUser(null)
      loadUsers()
    } catch (err: any) {
      toast.error(err.message || "Failed to update user")
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!user?.id) return
    if (!confirm("Are you sure you want to delete this user?")) return
    try {
      await deleteAdminUser(user.id, userId)
      toast.success("User deleted successfully")
      loadUsers()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user")
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Showing {filteredUsers.length} of {users.length} users
              </CardDescription>
            </div>
            <Button onClick={() => { setEditingUser(null); setUserDialogOpen(true) }}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Select value={titleFilter} onValueChange={setTitleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by title" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Titles</SelectItem>
                {TITLE_OPTIONS.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {users.length === 0 ? "No users found" : "No users match your filters"}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.title || "-"}</TableCell>
                    <TableCell>
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => { setEditingUser(u); setUserDialogOpen(true) }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(u.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <UserDialog
        open={userDialogOpen}
        onClose={() => { setUserDialogOpen(false); setEditingUser(null) }}
        user={editingUser}
        onSave={editingUser ? (updates) => handleUpdateUser(editingUser.id, updates) : handleCreateUser}
      />
    </div>
  )
}

function UserDialog({ open, onClose, user, onSave }: {
  open: boolean
  onClose: () => void
  user: AdminUser | null
  onSave: (data: any) => void
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    title: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        password: "",
        name: user.name || "",
        title: user.title || "none",
      })
    } else {
      setFormData({ email: "", password: "", name: "", title: "none" })
    }
  }, [user, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user && !formData.password) {
      alert("Password is required for new users")
      return
    }
    const submitData = {
      ...formData,
      title: formData.title === "none" ? undefined : formData.title,
      password: user ? (formData.password || undefined) : formData.password,
    }
    await onSave(submitData)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "New User"}</DialogTitle>
          <DialogDescription>
            {user ? "Update user information" : "Add a new user to the system"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Password {user && "(leave empty to keep unchanged)"}</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!user}
            />
          </div>
          <div>
            <Label>Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Title (Optional)</Label>
            <Select
              value={!formData.title || formData.title === "" ? "none" : formData.title}
              onValueChange={(value) => setFormData({ ...formData, title: value === "none" ? "" : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select title" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {TITLE_OPTIONS.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
