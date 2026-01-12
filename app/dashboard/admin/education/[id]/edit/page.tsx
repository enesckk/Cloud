"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2 } from "lucide-react"
import { getAdminEducation, updateAdminEducation, type Education } from "@/lib/api-client"
import { toast } from "sonner"

export default function EditEducationPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const educationId = params.id as string
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
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
        const education = response.education.find((e) => e.id === educationId)
        if (education) {
          setFormData(education)
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
      const description = `"${formData.title}" has been updated.`
      toast.success("Education content updated successfully", {
        description,
      })
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cloudguide:notification", {
          detail: { type: "success", title: "Education module updated", description, target: "admin" },
        }))
      }
      router.push("/dashboard/admin/education")
    } catch (err: any) {
      toast.error(err.message || "Failed to update education content")
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

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
        <h1 className="text-3xl font-bold">Edit Education Content</h1>
        <p className="text-muted-foreground mt-2">Update education content information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Content Details</CardTitle>
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
                onClick={() => router.push("/dashboard/admin/education")}
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
    </div>
  )
}
