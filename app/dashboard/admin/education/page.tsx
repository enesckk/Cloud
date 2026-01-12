"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Edit, Trash2, Loader2, Eye, BookOpen, Video, FileText, Briefcase, Search, X } from "lucide-react"
import {
  getAdminEducation,
  deleteAdminEducation,
  type Education,
} from "@/lib/api-client"
import { toast } from "sonner"

export default function AdminEducationPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [education, setEducation] = useState<Education[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterLevel, setFilterLevel] = useState<string>("all")
  const [filterProvider, setFilterProvider] = useState<string>("all")

  useEffect(() => {
    if (user?.id) {
      loadEducation()
    }
  }, [user])

  const loadEducation = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const response = await getAdminEducation(user.id)
      setEducation(response.education)
    } catch (err: any) {
      toast.error(err.message || "Failed to load education content")
    } finally {
      setLoading(false)
    }
  }


  const handleDeleteEducation = async (educationId: string) => {
    if (!user?.id) return
    if (!confirm("Are you sure you want to delete this education content?")) return
    try {
      await deleteAdminEducation(user.id, educationId)
      const deletedTitle = education.find((e) => e.id === id)?.title
      const description = deletedTitle ? `"${deletedTitle}" has been removed.` : "The education module has been deleted."
      toast.success("Education module deleted successfully", {
        description,
      })
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cloudguide:notification", {
          detail: { type: "success", title: "Education module deleted successfully", description, target: "admin" },
        }))
      }
      loadEducation()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete education content")
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "article":
        return FileText
      case "video":
        return Video
      case "guide":
        return BookOpen
      case "case-study":
        return Briefcase
      default:
        return BookOpen
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      basics: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      migration: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      providers: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      security: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      "cost-optimization": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      "best-practices": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    }
    return colors[category] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      beginner: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      intermediate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      advanced: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    }
    return colors[level] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }

  // Filter and search education
  const filteredEducation = useMemo(() => {
    return education.filter((edu) => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        edu.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        edu.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (edu.full_content && edu.full_content.toLowerCase().includes(searchQuery.toLowerCase()))

      // Type filter
      const matchesType = filterType === "all" || edu.type === filterType

      // Category filter
      const matchesCategory = filterCategory === "all" || edu.category === filterCategory

      // Level filter
      const matchesLevel = filterLevel === "all" || edu.level === filterLevel

      // Provider filter
      const matchesProvider = filterProvider === "all" || 
        (filterProvider === "general" && (!edu.provider || edu.provider === "general")) ||
        edu.provider === filterProvider

      return matchesSearch && matchesType && matchesCategory && matchesLevel && matchesProvider
    })
  }, [education, searchQuery, filterType, filterCategory, filterLevel, filterProvider])

  const hasActiveFilters = filterType !== "all" || filterCategory !== "all" || filterLevel !== "all" || filterProvider !== "all" || searchQuery !== ""

  const clearFilters = () => {
    setSearchQuery("")
    setFilterType("all")
    setFilterCategory("all")
    setFilterLevel("all")
    setFilterProvider("all")
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Education Content</CardTitle>
              <CardDescription>
                Showing {filteredEducation.length} of {education.length} items
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/dashboard/admin/education/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Content
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="mb-6 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title, description, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-1.5">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="article">Article</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="guide">Guide</SelectItem>
                  <SelectItem value="case-study">Case Study</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="basics">Basics</SelectItem>
                  <SelectItem value="migration">Migration</SelectItem>
                  <SelectItem value="providers">Providers</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="cost-optimization">Cost Optimization</SelectItem>
                  <SelectItem value="best-practices">Best Practices</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterLevel} onValueChange={setFilterLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterProvider} onValueChange={setFilterProvider}>
                <SelectTrigger>
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="aws">AWS</SelectItem>
                  <SelectItem value="azure">Azure</SelectItem>
                  <SelectItem value="gcp">GCP</SelectItem>
                  <SelectItem value="huawei">Huawei</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="w-full md:w-auto"
              >
                <X className="h-4 w-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredEducation.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {education.length === 0 
                ? "No education content found"
                : "No education content matches your filters"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEducation.map((edu) => {
                const TypeIcon = getTypeIcon(edu.type)
                return (
                  <Card key={edu.id} className="flex flex-col hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <TypeIcon className="h-4 w-4 text-primary" />
                          </div>
                          <Badge className={getLevelColor(edu.level)} variant="secondary">
                            {edu.level}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {edu.is_active ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight line-clamp-2">{edu.title}</CardTitle>
                      <CardDescription className="mt-2 line-clamp-3">{edu.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getCategoryColor(edu.category)} variant="outline">
                            {edu.category}
                          </Badge>
                          {edu.provider && edu.provider !== "general" && (
                            <Badge variant="outline">{edu.provider.toUpperCase()}</Badge>
                          )}
                          {edu.duration && (
                            <Badge variant="outline">{edu.duration}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => router.push(`/dashboard/admin/education/${edu.id}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/admin/education/${edu.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteEducation(edu.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

