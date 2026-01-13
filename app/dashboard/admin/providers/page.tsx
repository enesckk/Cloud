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
import { Plus, Edit, Trash2, Loader2, Cloud, Search, X, Eye, ChevronRight } from "lucide-react"
import {
  getAdminProviders,
  deleteAdminProvider,
  type Provider,
} from "@/lib/api-client"
import { toast } from "sonner"

// Helper function to get provider logo path
const getProviderLogoPath = (provider: Provider): string => {
  if (provider.logo) {
    // If logo is a full URL, return it
    if (provider.logo.startsWith("http")) {
      return provider.logo
    }
    // If logo is a path, check if it exists, otherwise use default
    if (provider.logo.startsWith("/")) {
      return provider.logo
    }
    // Normalize logo name: GCP -> google, others stay the same
    const normalizedLogo = provider.logo.toLowerCase() === "gcp" ? "google" : provider.logo.toLowerCase()
    return `/providers/${normalizedLogo}.png`
  }
  // Fallback based on provider name
  const normalizedName = provider.name.toLowerCase() === "gcp" ? "google" : provider.name.toLowerCase()
  return `/providers/${normalizedName}.png`
}

export default function AdminProvidersPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterActive, setFilterActive] = useState<string>("all")

  useEffect(() => {
    if (user?.id) {
      loadProviders()
    }
  }, [user])

  const loadProviders = async () => {
    if (!user?.id) return
    setLoading(true)
    try {
      const response = await getAdminProviders(user.id)
      setProviders(response.providers)
    } catch (err: any) {
      toast.error(err.message || "Failed to load providers")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProvider = async (providerId: string) => {
    if (!user?.id) return
    if (!confirm("Are you sure you want to delete this provider?")) return
    try {
      await deleteAdminProvider(user.id, providerId)
      const deletedProvider = providers.find((p) => p.id === providerId)
      const description = deletedProvider ? `"${deletedProvider.display_name}" has been removed.` : "The provider has been deleted."
      toast.success("Provider deleted successfully", {
        description,
      })
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("cloudguide:notification", {
          detail: { type: "success", title: "Provider deleted", description, target: "admin" },
        }))
      }
      loadProviders()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete provider")
    }
  }

  // Filter and search providers
  const filteredProviders = useMemo(() => {
    return providers.filter((provider) => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.short_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (provider.description && provider.description.toLowerCase().includes(searchQuery.toLowerCase()))

      // Active filter
      const matchesActive = filterActive === "all" || 
        (filterActive === "active" && provider.is_active) ||
        (filterActive === "inactive" && !provider.is_active)

      return matchesSearch && matchesActive
    })
  }, [providers, searchQuery, filterActive])

  const hasActiveFilters = filterActive !== "all" || searchQuery !== ""

  const clearFilters = () => {
    setSearchQuery("")
    setFilterActive("all")
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cloud Providers</CardTitle>
              <CardDescription>
                Showing {filteredProviders.length} of {providers.length} providers
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/dashboard/admin/providers/new")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Provider
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
                placeholder="Search by name, display name, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Select value={filterActive} onValueChange={setFilterActive}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredProviders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {providers.length === 0 
                ? "No providers found"
                : "No providers match your filters"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProviders.map((provider) => (
                <Card 
                  key={provider.id} 
                  className="flex flex-col hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/dashboard/admin/providers/${provider.id}`)}
                >
                  <CardContent className="pt-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-background border border-border overflow-hidden">
                            <img
                              src={getProviderLogoPath(provider)}
                              alt={provider.short_name}
                              className="w-full h-full object-contain p-2"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                const parent = target.parentElement
                                if (parent && !parent.querySelector(".fallback-icon")) {
                                  target.style.display = "none"
                                  const fallback = document.createElement("div")
                                  fallback.className = "fallback-icon flex items-center justify-center w-full h-full"
                                  const icon = document.createElement("div")
                                  icon.className = "p-2 rounded-lg bg-primary/10"
                                  const cloudIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg")
                                  cloudIcon.setAttribute("class", "h-5 w-5 text-primary")
                                  cloudIcon.setAttribute("fill", "none")
                                  cloudIcon.setAttribute("viewBox", "0 0 24 24")
                                  cloudIcon.setAttribute("stroke", "currentColor")
                                  cloudIcon.setAttribute("stroke-width", "2")
                                  const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
                                  path.setAttribute("d", "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z")
                                  cloudIcon.appendChild(path)
                                  icon.appendChild(cloudIcon)
                                  fallback.appendChild(icon)
                                  parent.appendChild(fallback)
                                }
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{provider.display_name}</h3>
                            <Badge variant="outline" className="mt-1">{provider.short_name}</Badge>
                          </div>
                        </div>
                        {provider.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{provider.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t">
                      <div className="flex items-center gap-2">
                        {provider.is_active ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                        {provider.available_regions && provider.available_regions.length > 0 && (
                          <Badge variant="outline">{provider.available_regions.length} Regions</Badge>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => router.push(`/dashboard/admin/providers/${provider.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/admin/providers/${provider.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProvider(provider.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
