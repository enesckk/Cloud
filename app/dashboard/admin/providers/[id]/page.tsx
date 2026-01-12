"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Edit, Cloud, Server, HardDrive, Globe, Loader2 } from "lucide-react"
import { getAdminProviders, type Provider } from "@/lib/api-client"
import { toast } from "sonner"

export default function ProviderDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const providerId = params.id as string
  const [loading, setLoading] = useState(true)
  const [provider, setProvider] = useState<Provider | null>(null)

  useEffect(() => {
    const loadProvider = async () => {
      if (!user?.id || !providerId) return
      setLoading(true)
      try {
        const response = await getAdminProviders(user.id)
        const foundProvider = response.providers.find((p) => p.id === providerId)
        if (foundProvider) {
          setProvider(foundProvider)
        } else {
          toast.error("Provider not found")
          router.push("/dashboard/admin/providers")
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to load provider")
        router.push("/dashboard/admin/providers")
      } finally {
        setLoading(false)
      }
    }
    loadProvider()
  }, [user, providerId, router])

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!provider) {
    return null
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/admin/providers")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Providers
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-lg bg-primary/10">
                <Cloud className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{provider.display_name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{provider.short_name}</Badge>
                  {provider.is_active ? (
                    <Badge variant="default">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
              </div>
            </div>
            {provider.description && (
              <p className="text-muted-foreground mt-2">{provider.description}</p>
            )}
          </div>
          <Button onClick={() => router.push(`/dashboard/admin/providers/${provider.id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Provider
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compute Rates */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              <CardTitle>Compute Rates</CardTitle>
            </div>
            <CardDescription>Pricing per vCPU-hour in USD</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="font-medium">Linux</span>
                <span className="text-lg font-semibold">
                  ${provider.compute_rates?.linux?.toFixed(4) || "0.0000"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="font-medium">Windows</span>
                <span className="text-lg font-semibold">
                  ${provider.compute_rates?.windows?.toFixed(4) || "0.0000"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storage Rates */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-primary" />
              <CardTitle>Storage Rates</CardTitle>
            </div>
            <CardDescription>Pricing per GB-month in USD</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="font-medium">Standard HDD</span>
                <span className="text-lg font-semibold">
                  ${provider.storage_rates?.["standard-hdd"]?.toFixed(3) || "0.000"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="font-medium">Standard SSD</span>
                <span className="text-lg font-semibold">
                  ${provider.storage_rates?.["standard-ssd"]?.toFixed(3) || "0.000"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="font-medium">Premium SSD</span>
                <span className="text-lg font-semibold">
                  ${provider.storage_rates?.["premium-ssd"]?.toFixed(3) || "0.000"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="font-medium">Ultra SSD</span>
                <span className="text-lg font-semibold">
                  ${provider.storage_rates?.["ultra-ssd"]?.toFixed(3) || "0.000"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Region Multipliers */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle>Region Multipliers</CardTitle>
            </div>
            <CardDescription>Pricing multipliers relative to base pricing (1.0 = base)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { key: "europe", label: "Europe" },
                { key: "middle-east", label: "Middle East" },
                { key: "asia-pacific", label: "Asia Pacific" },
                { key: "north-america", label: "North America" },
                { key: "latin-america", label: "Latin America" },
                { key: "turkey-local", label: "Turkey Local" },
              ].map((region) => {
                const multiplier = provider.region_multipliers?.[region.key] || 1.0
                return (
                  <div key={region.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="font-medium">{region.label}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={multiplier === 1.0 ? "default" : multiplier > 1.0 ? "destructive" : "secondary"}>
                        {multiplier.toFixed(2)}x
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Available Regions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle>Available Regions</CardTitle>
            </div>
            <CardDescription>Regions where this provider is available</CardDescription>
          </CardHeader>
          <CardContent>
            {provider.available_regions && provider.available_regions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {provider.available_regions.map((region) => (
                  <Badge key={region} variant="outline" className="text-sm">
                    {region}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No regions configured</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Metadata */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Provider ID</Label>
              <p className="font-medium">{provider.name}</p>
            </div>
            {provider.logo && (
              <div>
                <Label className="text-sm text-muted-foreground">Logo Identifier</Label>
                <p className="font-medium">{provider.logo}</p>
              </div>
            )}
            {provider.created_at && (
              <div>
                <Label className="text-sm text-muted-foreground">Created At</Label>
                <p className="font-medium">{new Date(provider.created_at).toLocaleDateString()}</p>
              </div>
            )}
            {provider.updated_at && (
              <div>
                <Label className="text-sm text-muted-foreground">Last Updated</Label>
                <p className="font-medium">{new Date(provider.updated_at).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
