"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Edit, Loader2, BookOpen, Video, FileText, Briefcase, ExternalLink } from "lucide-react"
import { getAdminEducation, updateAdminEducation, type Education } from "@/lib/api-client"
import { toast } from "sonner"

export default function EducationDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const educationId = params.id as string
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [education, setEducation] = useState<Education | null>(null)
  const [formData, setFormData] = useState<Partial<Education>>({
    title: "",
    description: "",
    type: "article",
    category: "basics",
    level: "beginner",
    full_content: "",
    duration: "",
    provider: "general",
    tags: [],
    url: "",
    is_active: true,
  })

  useEffect(() => {
    const loadEducation = async () => {
      if (!user?.id || !educationId) return
      setLoadingData(true)
      try {
        const response = await getAdminEducation(user.id)
        const edu = response.education.find((e) => e.id === educationId)
        if (edu) {
          setEducation(edu)
          setFormData(edu)
        } else {
          toast.error("Education content not found")
          router.push("/dashboard/admin/education")
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to load education content")
        router.push("/dashboard/admin/education")
      } finally {
        setLoadingData(false)
      }
    }
    loadEducation()
  }, [user, educationId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !educationId) return

    if (!formData.title || !formData.description) {
      toast.error("Title and description are required")
      return
    }

    setLoading(true)
    try {
      await updateAdminEducation(user.id, educationId, formData)
      toast.success("Education content updated successfully")
      setIsEditing(false)
      // Reload education data
      const response = await getAdminEducation(user.id)
      const updatedEdu = response.education.find((e) => e.id === educationId)
      if (updatedEdu) {
        setEducation(updatedEdu)
        setFormData(updatedEdu)
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update education content")
    } finally {
      setLoading(false)
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

  if (loadingData) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!education) {
    return null
  }

  const TypeIcon = getTypeIcon(education.type)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/admin/education")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Education
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{education.title}</h1>
            <p className="text-muted-foreground mt-2">{education.description}</p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Content
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Education Content</CardTitle>
            <CardDescription>Update the information for this education content</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">Article</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="guide">Guide</SelectItem>
                      <SelectItem value="case-study">Case Study</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Description *</Label>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                />
              </div>

              <div>
                <Label>Full Content</Label>
                <RichTextEditor
                  value={formData.full_content || ""}
                  onChange={(value) => setFormData({ ...formData, full_content: value })}
                  placeholder="Enter the full content..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basics">Basics</SelectItem>
                      <SelectItem value="migration">Migration</SelectItem>
                      <SelectItem value="providers">Providers</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="cost-optimization">Cost Optimization</SelectItem>
                      <SelectItem value="best-practices">Best Practices</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Level *</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData({ ...formData, level: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Provider</Label>
                  <Select
                    value={formData.provider || "general"}
                    onValueChange={(value) => setFormData({ ...formData, provider: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="aws">AWS</SelectItem>
                      <SelectItem value="azure">Azure</SelectItem>
                      <SelectItem value="gcp">GCP</SelectItem>
                      <SelectItem value="huawei">Huawei</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Duration</Label>
                  <Input
                    value={formData.duration || ""}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g: 15 min"
                  />
                </div>
                <div>
                  <Label>URL</Label>
                  <Input
                    type="url"
                    value={formData.url || ""}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: !!checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setFormData(education)
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Content"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <TypeIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{education.title}</CardTitle>
                    <CardDescription className="mt-1">{education.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {education.is_active ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge className={getCategoryColor(education.category)} variant="outline">
                  {education.category}
                </Badge>
                <Badge className={getLevelColor(education.level)} variant="outline">
                  {education.level}
                </Badge>
                {education.provider && education.provider !== "general" && (
                  <Badge variant="outline">{education.provider.toUpperCase()}</Badge>
                )}
                {education.duration && (
                  <Badge variant="outline">{education.duration}</Badge>
                )}
                {education.type && (
                  <Badge variant="outline">{education.type}</Badge>
                )}
              </div>
              {education.url && (
                <div className="mt-4">
                  <Button variant="outline" asChild>
                    <a href={education.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open External Link
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Full Content Card */}
          <Card>
            <CardHeader>
              <CardTitle>Full Content</CardTitle>
              <CardDescription>Complete content of this education module</CardDescription>
            </CardHeader>
            <CardContent>
              {education.full_content ? (
                <div 
                  className="prose prose-slate dark:prose-invert max-w-none text-foreground leading-relaxed [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:mt-6 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_p]:mb-4 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_li]:mb-2 [&_strong]:font-bold [&_em]:italic [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80 [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4"
                  dangerouslySetInnerHTML={{ __html: education.full_content }}
                />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No full content available. Click "Edit Content" to add content.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
