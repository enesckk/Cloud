"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { getAdminProviders, updateAdminProvider, type Provider } from "@/lib/api-client"
import { toast } from "sonner"

// All available features from compare page
const ALL_FEATURES = [
  // Compute & Infrastructure
  { name: "Virtual Machines", category: "Compute & Infrastructure" },
  { name: "Serverless Computing", category: "Compute & Infrastructure" },
  { name: "Container Services", category: "Compute & Infrastructure" },
  { name: "Auto Scaling", category: "Compute & Infrastructure" },
  { name: "Spot/Preemptible Instances", category: "Compute & Infrastructure" },
  { name: "GPU Instances", category: "Compute & Infrastructure" },
  // Storage & Database
  { name: "Object Storage", category: "Storage & Database" },
  { name: "Block Storage", category: "Storage & Database" },
  { name: "Managed Databases", category: "Storage & Database" },
  { name: "Backup & Recovery", category: "Storage & Database" },
  { name: "Data Archiving", category: "Storage & Database" },
  { name: "Data Lake Solutions", category: "Storage & Database" },
  // Security & Compliance
  { name: "Identity & Access Management", category: "Security & Compliance" },
  { name: "Encryption at Rest", category: "Security & Compliance" },
  { name: "Encryption in Transit", category: "Security & Compliance" },
  { name: "DDoS Protection", category: "Security & Compliance" },
  { name: "Compliance Certifications", category: "Security & Compliance" },
  { name: "Security Monitoring", category: "Security & Compliance" },
  { name: "Web Application Firewall", category: "Security & Compliance" },
  // Networking & CDN
  { name: "Virtual Private Cloud", category: "Networking & CDN" },
  { name: "Load Balancing", category: "Networking & CDN" },
  { name: "Content Delivery Network", category: "Networking & CDN" },
  { name: "VPN & Direct Connect", category: "Networking & CDN" },
  { name: "DNS Services", category: "Networking & CDN" },
  // Support & Services
  { name: "24/7 Support", category: "Support & Services" },
  { name: "Enterprise Support", category: "Support & Services" },
  { name: "Documentation", category: "Support & Services" },
  { name: "Training & Certification", category: "Support & Services" },
  { name: "SLA Guarantee", category: "Support & Services" },
]

const FEATURE_CATEGORIES = [
  "Compute & Infrastructure",
  "Storage & Database",
  "Security & Compliance",
  "Networking & CDN",
  "Support & Services",
]

export default function EditProviderPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const providerId = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [provider, setProvider] = useState<Provider | null>(null)
  const [formData, setFormData] = useState<Partial<Provider>>({
    name: "",
    display_name: "",
    short_name: "",
    description: "",
    logo: "",
    is_active: true,
    compute_rates: { linux: 0, windows: 0 },
    storage_rates: {
      "standard-hdd": 0,
      "standard-ssd": 0,
      "premium-ssd": 0,
      "ultra-ssd": 0,
    },
    region_multipliers: {
      europe: 1.0,
      "middle-east": 1.0,
      "asia-pacific": 1.0,
      "north-america": 1.0,
      "latin-america": 1.0,
      "turkey-local": 1.0,
    },
    available_regions: [],
    features: {},
  })

  const [features, setFeatures] = useState<Record<string, "yes" | "no" | "partial">>({})

  useEffect(() => {
    const loadProvider = async () => {
      if (!user?.id || !providerId) return
      setLoading(true)
      try {
        const response = await getAdminProviders(user.id)
        const foundProvider = response.providers.find((p) => p.id === providerId)
        if (foundProvider) {
          setProvider(foundProvider)
          setFormData({
            name: foundProvider.name,
            display_name: foundProvider.display_name,
            short_name: foundProvider.short_name,
            description: foundProvider.description || "",
            logo: foundProvider.logo || "",
            is_active: foundProvider.is_active,
            compute_rates: foundProvider.compute_rates || { linux: 0, windows: 0 },
            storage_rates: foundProvider.storage_rates || {
              "standard-hdd": 0,
              "standard-ssd": 0,
              "premium-ssd": 0,
              "ultra-ssd": 0,
            },
            region_multipliers: foundProvider.region_multipliers || {
              europe: 1.0,
              "middle-east": 1.0,
              "asia-pacific": 1.0,
              "north-america": 1.0,
              "latin-america": 1.0,
              "turkey-local": 1.0,
            },
            available_regions: foundProvider.available_regions || [],
            features: foundProvider.features || {},
          })
          setFeatures(foundProvider.features || {})
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

  const toggleRegion = (region: string) => {
    setFormData((prev) => {
      const currentRegions = prev.available_regions || []
      if (currentRegions.includes(region)) {
        return { ...prev, available_regions: currentRegions.filter((r) => r !== region) }
      } else {
        return { ...prev, available_regions: [...currentRegions, region] }
      }
    })
  }

  const updateComputeRate = (os: "linux" | "windows", value: string) => {
    setFormData((prev) => ({
      ...prev,
      compute_rates: {
        ...prev.compute_rates,
        [os]: parseFloat(value) || 0,
      },
    }))
  }

  const updateStorageRate = (type: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      storage_rates: {
        ...prev.storage_rates,
        [type]: parseFloat(value) || 0,
      },
    }))
  }

  const updateRegionMultiplier = (region: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      region_multipliers: {
        ...prev.region_multipliers,
        [region]: parseFloat(value) || 1.0,
      },
    }))
  }

  const handleFeatureChange = (featureName: string, value: "yes" | "no" | "partial") => {
    setFeatures((prev) => {
      const newFeatures = { ...prev }
      if (value === "no") {
        delete newFeatures[featureName]
      } else {
        newFeatures[featureName] = value
      }
      return newFeatures
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id || !providerId) return

    if (!formData.name || !formData.display_name || !formData.short_name) {
      toast.error("Please fill in all required fields")
      return
    }

    if (!formData.available_regions || formData.available_regions.length === 0) {
      toast.error("At least one available region must be selected")
      return
    }

    setSaving(true)
    try {
      await updateAdminProvider(user.id, providerId, {
        ...formData,
        features: features,
      })
                  const description = `"${formData.display_name}" has been updated.`
                  toast.success("Provider updated successfully", {
                    description,
                  })
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("cloudguide:notification", {
                      detail: { type: "success", title: "Provider updated", description, target: "admin" },
                    }))
                  }
                  router.push("/dashboard/admin/providers")
    } catch (err: any) {
      toast.error(err.message || "Failed to update provider")
    } finally {
      setSaving(false)
    }
  }

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
        <h1 className="text-3xl font-bold">Edit Provider</h1>
        <p className="text-muted-foreground mt-2">Update provider information</p>
      </div>

      <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="compute">Compute Rates</TabsTrigger>
              <TabsTrigger value="storage">Storage Rates</TabsTrigger>
              <TabsTrigger value="regions">Regions</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Provider identification and metadata</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Provider Name (ID) *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., aws, azure, gcp"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">Unique identifier (lowercase, no spaces)</p>
                  </div>

                  <div>
                    <Label>Display Name *</Label>
                    <Input
                      value={formData.display_name}
                      onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                      placeholder="e.g., Amazon Web Services"
                      required
                    />
                  </div>

                  <div>
                    <Label>Short Name *</Label>
                    <Input
                      value={formData.short_name}
                      onChange={(e) => setFormData({ ...formData, short_name: e.target.value })}
                      placeholder="e.g., AWS"
                      required
                    />
                  </div>

                  <div>
                    <Label>Logo Identifier</Label>
                    <Input
                      value={formData.logo || ""}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      placeholder="e.g., AWS, Azure, GCP"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={formData.description || ""}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Provider description..."
                      rows={4}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_active"
                      checked={formData.is_active ?? true}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked === true })}
                    />
                    <Label htmlFor="is_active">Active</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compute" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Compute Rates</CardTitle>
                  <CardDescription>Pricing per vCPU-hour in USD</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Linux Rate (per vCPU-hour)</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      min="0"
                      value={formData.compute_rates?.linux || 0}
                      onChange={(e) => updateComputeRate("linux", e.target.value)}
                      placeholder="0.0415"
                    />
                  </div>
                  <div>
                    <Label>Windows Rate (per vCPU-hour)</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      min="0"
                      value={formData.compute_rates?.windows || 0}
                      onChange={(e) => updateComputeRate("windows", e.target.value)}
                      placeholder="0.083"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="storage" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Storage Rates</CardTitle>
                  <CardDescription>Pricing per GB-month in USD</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {["standard-hdd", "standard-ssd", "premium-ssd", "ultra-ssd"].map((type) => (
                    <div key={type}>
                      <Label className="capitalize">{type.replace("-", " ")}</Label>
                      <Input
                        type="number"
                        step="0.001"
                        min="0"
                        value={formData.storage_rates?.[type] || 0}
                        onChange={(e) => updateStorageRate(type, e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="regions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Regions</CardTitle>
                  <CardDescription>Configure available regions and pricing multipliers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Available Regions *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {[
                        { key: "europe", label: "Europe" },
                        { key: "middle-east", label: "Middle East" },
                        { key: "asia-pacific", label: "Asia Pacific" },
                        { key: "north-america", label: "North America" },
                        { key: "latin-america", label: "Latin America" },
                        { key: "turkey-local", label: "Turkey Local" },
                      ].map((region) => (
                        <div key={region.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={`region-${region.key}`}
                            checked={formData.available_regions?.includes(region.key) || false}
                            onCheckedChange={() => toggleRegion(region.key)}
                          />
                          <Label htmlFor={`region-${region.key}`}>{region.label}</Label>
                        </div>
                      ))}
                    </div>
                    {(!formData.available_regions || formData.available_regions.length === 0) && (
                      <p className="text-sm text-red-500 mt-2">At least one region must be selected.</p>
                    )}
                  </div>

                  <div>
                    <Label>Region Multipliers (relative to base pricing)</Label>
                    <div className="space-y-3 mt-2">
                      {[
                        { key: "europe", label: "Europe" },
                        { key: "middle-east", label: "Middle East" },
                        { key: "asia-pacific", label: "Asia Pacific" },
                        { key: "north-america", label: "North America" },
                        { key: "latin-america", label: "Latin America" },
                        { key: "turkey-local", label: "Turkey Local" },
                      ].map((region) => (
                        <div key={region.key}>
                          <Label className="text-sm">{region.label}</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.region_multipliers?.[region.key] || 1.0}
                            onChange={(e) => updateRegionMultiplier(region.key, e.target.value)}
                            placeholder="1.0"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Provider Features</CardTitle>
                  <CardDescription>Select which features this provider supports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {FEATURE_CATEGORIES.map((category) => {
                    const categoryFeatures = ALL_FEATURES.filter((f) => f.category === category)
                    return (
                      <div key={category} className="space-y-3">
                        <h3 className="font-semibold text-lg">{category}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {categoryFeatures.map((feature) => {
                            const currentValue = features[feature.name] || "no"
                            return (
                              <div key={feature.name} className="flex items-center justify-between p-3 border rounded-lg">
                                <Label htmlFor={`feature-${feature.name}`} className="flex-1 cursor-pointer">
                                  {feature.name}
                                </Label>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant={currentValue === "yes" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleFeatureChange(feature.name, "yes")}
                                  >
                                    Yes
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={currentValue === "partial" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleFeatureChange(feature.name, "partial")}
                                  >
                                    Partial
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={currentValue === "no" ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleFeatureChange(feature.name, "no")}
                                  >
                                    No
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/admin/providers")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
      </div>
      </form>
    </div>
  )
}
