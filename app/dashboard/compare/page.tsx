"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { getProviders, type Provider as ApiProvider } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle2,
  X,
  Minus,
  Download,
  Filter,
  Search,
  BarChart3,
  Server,
  Shield,
  Globe,
  HeadphonesIcon,
  Star,
  Award,
  TrendingUp,
  Info,
  Sparkles,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Default provider info (fallback)
const defaultProviderInfo: Record<string, {
  name: string
  shortName: string
  logo: string
  logoPath: string
  color: string
  bgColor: string
  borderColor: string
}> = {
  aws: {
    name: "Amazon Web Services",
    shortName: "AWS",
    logo: "AWS",
    logoPath: "/providers/aws.png",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-900",
  },
  azure: {
    name: "Microsoft Azure",
    shortName: "Azure",
    logo: "Azure",
    logoPath: "/providers/azure.png",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-900",
  },
  gcp: {
    name: "Google Cloud Platform",
    shortName: "GCP",
    logo: "GCP",
    logoPath: "/providers/google.png",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-900",
  },
  huawei: {
    name: "Huawei Cloud",
    shortName: "Huawei",
    logo: "Huawei",
    logoPath: "/providers/huawei.png",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-900",
  },
}

// Helper function to get provider logo path
const getProviderLogoPath = (providerName: string, dbProvider?: ApiProvider): string => {
  if (dbProvider?.logo) {
    // If logo is a full URL, return it
    if (dbProvider.logo.startsWith("http")) {
      return dbProvider.logo
    }
    // If logo is a path, check if it exists, otherwise use default
    if (dbProvider.logo.startsWith("/")) {
      return dbProvider.logo
    }
    // Normalize logo name: GCP/gcp -> google, others stay the same
    const logoLower = dbProvider.logo.toLowerCase()
    const normalizedLogo = (logoLower === "gcp") ? "google" : logoLower
    return `/providers/${normalizedLogo}.png`
  }
  // Fallback to static providerInfo
  const logoPath = defaultProviderInfo[providerName]?.logoPath
  if (logoPath) {
    return logoPath
  }
  // Final fallback - normalize provider name (gcp -> google)
  const normalizedName = providerName.toLowerCase() === "gcp" ? "google" : providerName.toLowerCase()
  return `/providers/${normalizedName}.png`
}

type Provider = string

interface FeatureComparison {
  category: string
  icon: React.ReactNode
  features: Array<{
    name: string
    description?: string
    providers: Record<Provider, "yes" | "no" | "partial" | string>
  }>
}

const featureComparisons: FeatureComparison[] = [
  {
    category: "Compute & Infrastructure",
    icon: <Server className="h-4 w-4" />,
    features: [
      {
        name: "Virtual Machines",
        description: "On-demand compute instances",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "yes",
        },
      },
      {
        name: "Serverless Computing",
        description: "Function-as-a-Service",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "partial",
        },
      },
      {
        name: "Container Services",
        description: "Kubernetes, Docker support",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "yes",
        },
      },
      {
        name: "Auto Scaling",
        description: "Automatic resource scaling",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "yes",
        },
      },
      {
        name: "Spot/Preemptible Instances",
        description: "Cost-effective interruptible instances",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "partial",
        },
      },
      {
        name: "GPU Instances",
        description: "AI/ML optimized compute",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "yes",
        },
      },
    ],
  },
  {
    category: "Storage & Database",
    icon: <BarChart3 className="h-4 w-4" />,
    features: [
      {
        name: "Object Storage",
        description: "S3-compatible storage",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "yes",
        },
      },
      {
        name: "Block Storage",
        description: "Persistent disk volumes",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "yes",
        },
      },
      {
        name: "Managed Databases",
        description: "SQL, NoSQL managed services",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "yes",
        },
      },
      {
        name: "Backup & Recovery",
        description: "Automated backup solutions",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "yes",
        },
      },
      {
        name: "Data Archiving",
        description: "Long-term cold storage",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "partial",
        },
      },
      {
        name: "Data Lake Solutions",
        description: "Big data analytics storage",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "partial",
        },
      },
    ],
  },
  {
    category: "Security & Compliance",
    icon: <Shield className="h-4 w-4" />,
    features: [
      {
        name: "Identity & Access Management",
        description: "IAM, RBAC",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "yes",
        },
      },
      {
        name: "Encryption at Rest",
        description: "Data encryption",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "yes",
        },
      },
      {
        name: "Encryption in Transit",
        description: "TLS/SSL encryption",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "yes",
        },
      },
      {
        name: "DDoS Protection",
        description: "Distributed denial-of-service protection",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "yes",
        },
      },
      {
        name: "Compliance Certifications",
        description: "ISO, SOC, GDPR, HIPAA",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "partial",
        },
      },
      {
        name: "Security Monitoring",
        description: "Threat detection and monitoring",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "yes",
        },
      },
      {
        name: "Web Application Firewall",
        description: "WAF protection",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "partial",
        },
      },
    ],
  },
  {
    category: "Networking & CDN",
    icon: <Globe className="h-4 w-4" />,
    features: [
      {
        name: "Virtual Private Cloud",
        description: "Isolated network environment",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "yes",
        },
      },
      {
        name: "Load Balancing",
        description: "Traffic distribution",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "yes",
        },
      },
      {
        name: "Content Delivery Network",
        description: "Global CDN services",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "partial",
        },
      },
      {
        name: "VPN & Direct Connect",
        description: "Private network connections",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "yes",
        },
      },
      {
        name: "DNS Services",
        description: "Managed DNS",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "yes",
        },
      },
    ],
  },
  {
    category: "Support & Services",
    icon: <HeadphonesIcon className="h-4 w-4" />,
    features: [
      {
        name: "24/7 Support",
        description: "Round-the-clock support",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "yes",
        },
      },
      {
        name: "Enterprise Support",
        description: "Dedicated account manager",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "partial",
        },
      },
      {
        name: "Documentation",
        description: "Comprehensive documentation",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "partial",
        },
      },
      {
        name: "Training & Certification",
        description: "Educational resources",
        providers: {
          aws: "yes",
          azure: "yes",
          gcp: "yes",
          huawei: "partial",
        },
      },
      {
        name: "SLA Guarantee",
        description: "Service level agreements",
        providers: {
          aws: "99.95%",
          azure: "99.95%",
          gcp: "99.95%",
          huawei: "99.9%",
        },
      },
    ],
  },
]

// Static region comparison (fallback for providers not in database)
const staticRegionComparison: Record<string, string[]> = {
  aws: ["Europe", "Middle East", "Asia Pacific", "North America", "Latin America"],
  azure: ["Europe", "Middle East", "Asia Pacific", "North America", "Latin America"],
  gcp: ["Europe", "Middle East", "Asia Pacific", "North America", "Latin America", "Turkey"],
  huawei: [
    "Europe",
    "Middle East",
    "Asia Pacific",
    "North America",
    "Latin America",
    "Turkey (Istanbul)",
  ],
}

// Helper function to format region names
function formatRegionName(region: string): string {
  const regionMap: Record<string, string> = {
    "europe": "Europe",
    "middle-east": "Middle East",
    "asia-pacific": "Asia Pacific",
    "north-america": "North America",
    "latin-america": "Latin America",
    "turkey-local": "Turkey (Istanbul)",
  }
  return regionMap[region.toLowerCase()] || region.charAt(0).toUpperCase() + region.slice(1).replace(/-/g, " ")
}

const pricingComparison = {
  aws: { rating: 3, note: "Competitive, pay-as-you-go", strength: "Market leader" },
  azure: { rating: 3, note: "Enterprise discounts available", strength: "Microsoft ecosystem" },
  gcp: { rating: 4, note: "Sustained use discounts", strength: "AI/ML focus" },
  huawei: { rating: 5, note: "Cost-effective, especially in APAC", strength: "Best value" },
}

const providerStrengths: Record<Provider, string[]> = {
  aws: [
    "Largest service catalog",
    "Mature ecosystem",
    "Extensive global presence",
    "Strong enterprise support",
  ],
  azure: [
    "Seamless Microsoft integration",
    "Hybrid cloud solutions",
    "Enterprise-focused",
    "Strong compliance",
  ],
  gcp: [
    "Advanced AI/ML services",
    "Excellent data analytics",
    "Strong Kubernetes support",
    "Innovative technologies",
  ],
  huawei: [
    "Cost-effective pricing",
    "Strong APAC presence",
    "Turkey local region",
    "Growing service portfolio",
  ],
}

function getFeatureIcon(value: string | "yes" | "no" | "partial") {
  if (value === "yes") {
    return <CheckCircle2 className="h-5 w-5 text-green-600" />
  }
  if (value === "no") {
    return <X className="h-5 w-5 text-red-500" />
  }
  if (value === "partial") {
    return <Minus className="h-5 w-5 text-yellow-600" />
  }
  return <span className="text-sm font-medium">{value}</span>
}

function getFeatureCount(provider: Provider, featureComparisons: FeatureComparison[]) {
  let yesCount = 0
  let totalCount = 0
  featureComparisons.forEach((category) => {
    category.features.forEach((feature) => {
      totalCount++
      const providerKey = provider as keyof typeof feature.providers
      if (feature.providers[providerKey] === "yes") yesCount++
    })
  })
  return { yes: yesCount, total: totalCount, percentage: totalCount > 0 ? Math.round((yesCount / totalCount) * 100) : 0 }
}

export default function ComparePage() {
  const { user } = useAuth()
  const [providers, setProviders] = useState<ApiProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProviders, setSelectedProviders] = useState<Provider[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const response = await getProviders(true) // activeOnly = true
        const activeProviders = response.providers.filter((p) => p.is_active)
        setProviders(activeProviders)
        // Set initial selected providers to all active providers
        setSelectedProviders(activeProviders.map((p) => p.name))
      } catch (error) {
        console.error("Failed to load providers:", error)
        // Fallback to default providers
        setSelectedProviders(["aws", "azure", "gcp", "huawei"])
      } finally {
        setLoading(false)
      }
    }
    loadProviders()
  }, [user])

  // Get provider info from database or fallback to default
  const getProviderInfo = (providerName: string) => {
    const dbProvider = providers.find((p) => p.name === providerName)
    if (dbProvider) {
      return {
        name: dbProvider.display_name,
        shortName: dbProvider.short_name,
        logo: dbProvider.logo || dbProvider.short_name,
        logoPath: getProviderLogoPath(providerName, dbProvider),
        color: defaultProviderInfo[providerName]?.color || "text-gray-600",
        bgColor: defaultProviderInfo[providerName]?.bgColor || "bg-gray-50",
        borderColor: defaultProviderInfo[providerName]?.borderColor || "border-gray-200",
      }
    }
    const defaultInfo = defaultProviderInfo[providerName] || {
      name: providerName,
      shortName: providerName.toUpperCase(),
      logo: providerName.toUpperCase(),
      logoPath: `/providers/${providerName.toLowerCase() === "gcp" ? "google" : providerName.toLowerCase()}.png`,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    }
    return defaultInfo
  }

  // Get all available providers (from DB or default)
  const availableProviders = providers.length > 0 
    ? providers.filter((p) => p.is_active).map((p) => p.name)
    : Object.keys(defaultProviderInfo)

  const handleProviderToggle = (provider: Provider) => {
    setSelectedProviders((prev) =>
      prev.includes(provider) ? prev.filter((p) => p !== provider) : [...prev, provider],
    )
  }

  // Build featureComparisons from database providers
  const dynamicFeatureComparisons = useMemo(() => {
    // Get all unique features from all providers
    const allFeatures = new Set<string>()
    providers.forEach((provider) => {
      if (provider.features) {
        Object.keys(provider.features).forEach((feature) => allFeatures.add(feature))
      }
    })

    // If no features in DB, use static featureComparisons
    if (allFeatures.size === 0) {
      return featureComparisons
    }

    // Map features to categories (using static featureComparisons as template)
    const categoryMap: Record<string, { icon: React.ReactNode; features: string[] }> = {
      "Compute & Infrastructure": { icon: <Server className="h-4 w-4" />, features: [] },
      "Storage & Database": { icon: <BarChart3 className="h-4 w-4" />, features: [] },
      "Security & Compliance": { icon: <Shield className="h-4 w-4" />, features: [] },
      "Networking & CDN": { icon: <Globe className="h-4 w-4" />, features: [] },
      "Support & Services": { icon: <HeadphonesIcon className="h-4 w-4" />, features: [] },
    }

    // Categorize features based on static featureComparisons
    featureComparisons.forEach((cat) => {
      cat.features.forEach((feature) => {
        if (allFeatures.has(feature.name)) {
          categoryMap[cat.category].features.push(feature.name)
        }
      })
    })

    // Build dynamic featureComparisons
    return Object.entries(categoryMap)
      .filter(([_, data]) => data.features.length > 0)
      .map(([category, data]) => ({
        category,
        icon: data.icon,
        features: data.features.map((featureName) => {
          // Get feature value for each provider
          const providerFeatures: Record<string, "yes" | "no" | "partial" | string> = {}
          providers.forEach((p) => {
            const featureValue = p.features?.[featureName]
            providerFeatures[p.name] = (featureValue as "yes" | "no" | "partial" | string) || "no"
          })

          // Get description from static featureComparisons if available
          const staticFeature = featureComparisons
            .find((cat) => cat.category === category)
            ?.features.find((f) => f.name === featureName)

          return {
            name: featureName,
            description: staticFeature?.description,
            providers: providerFeatures,
          }
        }),
      }))
  }, [providers])

  const filteredCategories = useMemo(() => {
    const comparisons = dynamicFeatureComparisons.length > 0 ? dynamicFeatureComparisons : featureComparisons
    let filtered = selectedCategory === "all" ? comparisons : comparisons.filter((cat) => cat.category === selectedCategory)

    if (searchQuery) {
      filtered = filtered.map((category) => ({
        ...category,
        features: category.features.filter(
          (feature) =>
            feature.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            feature.description?.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      })).filter((category) => category.features.length > 0)
    }

    return filtered
  }, [selectedCategory, searchQuery, dynamicFeatureComparisons])

  const categories = useMemo(() => {
    const comparisons = dynamicFeatureComparisons.length > 0 ? dynamicFeatureComparisons : featureComparisons
    return ["all", ...comparisons.map((cat) => cat.category)]
  }, [dynamicFeatureComparisons])

  // Dynamic region comparison from database
  const regionComparison = useMemo(() => {
    const dynamic: Record<string, string[]> = {}
    
    // Build from database providers
    providers.forEach((provider) => {
      if (provider.available_regions && provider.available_regions.length > 0) {
        dynamic[provider.name] = provider.available_regions.map(formatRegionName)
      }
    })
    
    // Merge with static data for providers not in database
    Object.keys(staticRegionComparison).forEach((providerName) => {
      if (!dynamic[providerName]) {
        dynamic[providerName] = staticRegionComparison[providerName]
      }
    })
    
    return dynamic
  }, [providers])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <p className="text-muted-foreground">
          Compare features, capabilities, and services across leading cloud providers to make informed
          decisions.
        </p>
      </div>

      {/* Provider Selection with Stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Select Providers to Compare
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading providers...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availableProviders.map((providerName) => {
                const provider = providerName as Provider
                const info = getProviderInfo(providerName)
                const isSelected = selectedProviders.includes(provider)
                const comparisons = dynamicFeatureComparisons.length > 0 ? dynamicFeatureComparisons : featureComparisons
                const stats = getFeatureCount(provider, comparisons)
                return (
                <div
                  key={providerName}
                  onClick={() => handleProviderToggle(provider)}
                  className={`relative rounded-xl border-2 p-5 cursor-pointer transition-all hover:shadow-lg ${
                    isSelected
                      ? `border-primary ${info.bgColor} shadow-md`
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleProviderToggle(provider)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={info.logoPath}
                          alt={info.shortName}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            const parent = target.parentElement
                            if (parent && !parent.querySelector(".fallback-text")) {
                              target.style.display = "none"
                              const fallback = document.createElement("span")
                              fallback.className = "fallback-text text-sm font-bold text-foreground"
                              fallback.textContent = info.shortName
                              parent.appendChild(fallback)
                            }
                          }}
                        />
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">{info.name}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <Badge variant="outline" className="bg-primary/10">
                        <Star className="h-3 w-3 mr-1" />
                        Selected
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Feature Coverage</span>
                      <span className="font-semibold">{stats.percentage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isSelected ? "bg-primary" : "bg-muted-foreground/30"
                        }`}
                        style={{ width: `${stats.percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {stats.yes} of {stats.total} features
                    </div>
                  </div>
                </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Summary */}
      {selectedProviders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Providers Selected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{selectedProviders.length}</div>
              <p className="text-xs text-muted-foreground mt-1">out of 4 providers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Features Compared
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {featureComparisons.reduce((acc, cat) => acc + cat.features.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">across all categories</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{featureComparisons.length}</div>
              <p className="text-xs text-muted-foreground mt-1">feature categories</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="space-y-2">
          <Label>Search Features</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Filter by Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Comparison Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>Feature Comparison Matrix</CardTitle>
              <CardDescription>
                Detailed comparison of services and capabilities across selected providers
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {selectedProviders.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Select at least one provider to compare</p>
            </div>
          ) : (
            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="regions">Regions</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
              </TabsList>

              <TabsContent value="features" className="mt-6">
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-12">
                    <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No features found matching your search</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px] sticky left-0 bg-background z-10">
                            Feature
                          </TableHead>
                          {selectedProviders.map((provider) => {
                            const info = getProviderInfo(provider)
                            return (
                              <TableHead key={provider} className="text-center min-w-[140px]">
                                <div className="flex flex-col items-center gap-2">
                                  <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
                                    <img
                                      src={info.logoPath}
                                      alt={info.shortName}
                                      className="w-full h-full object-contain"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        const parent = target.parentElement
                                        if (parent && !parent.querySelector(".fallback-text")) {
                                          target.style.display = "none"
                                          const fallback = document.createElement("span")
                                          fallback.className = "fallback-text text-sm font-bold text-foreground"
                                          fallback.textContent = info.shortName
                                          parent.appendChild(fallback)
                                        }
                                      }}
                                    />
                                  </div>
                                  <div className="text-xs text-muted-foreground font-normal">
                                    {info.name}
                                  </div>
                                </div>
                              </TableHead>
                            )
                          })}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCategories.map((category) => (
                          <React.Fragment key={category.category}>
                            <TableRow className="bg-muted/50 hover:bg-muted/70">
                              <TableCell
                                colSpan={selectedProviders.length + 1}
                                className="font-semibold py-4"
                              >
                                <div className="flex items-center gap-2">
                                  {category.icon}
                                  <span className="text-base">{category.category}</span>
                                </div>
                              </TableCell>
                            </TableRow>
                            {category.features.map((feature) => (
                              <TableRow key={feature.name} className="hover:bg-muted/30">
                                <TableCell className="sticky left-0 bg-background z-10">
                                  <div>
                                    <div className="font-medium">{feature.name}</div>
                                    {feature.description && (
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {feature.description}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                {selectedProviders.map((provider) => (
                                  <TableCell key={provider} className="text-center">
                                    <div className="flex justify-center">
                                      {getFeatureIcon(feature.providers[provider])}
                                    </div>
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="regions" className="mt-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {selectedProviders.map((provider) => {
                    const info = getProviderInfo(provider)
                    return (
                    <Card
                      key={provider}
                      className={`${info.bgColor} border-2 ${info.borderColor}`}
                    >
                      <CardHeader>
                        <CardTitle className={`text-lg ${info.color}`}>
                          {info.name}
                        </CardTitle>
                        <CardDescription>Available Regions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2.5">
                          {(regionComparison[provider] || []).length > 0 ? (
                            (regionComparison[provider] || []).map((region: string) => (
                              <li key={region} className="flex items-center gap-2.5 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                                <span>{region}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-muted-foreground">No regions available</li>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                    )
                  })}
                </div>
              </TabsContent>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  {/* Pricing Comparison */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Pricing & Cost Efficiency
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {selectedProviders.map((provider) => {
                        const pricing = pricingComparison[provider as keyof typeof pricingComparison] || { rating: 3, note: "Competitive pricing", strength: "Cloud provider" }
                        const info = getProviderInfo(provider)
                        return (
                          <Card key={provider} className="relative overflow-hidden">
                            <div
                              className={`absolute top-0 right-0 w-20 h-20 ${info.bgColor} rounded-bl-full opacity-50`}
                            />
                            <CardHeader>
                              <div className="flex items-center gap-3 relative z-10">
                                <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
                                  <img
                                    src={info.logoPath}
                                    alt={info.shortName}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement
                                      const parent = target.parentElement
                                      if (parent && !parent.querySelector(".fallback-text")) {
                                        target.style.display = "none"
                                        const fallback = document.createElement("span")
                                        fallback.className = "fallback-text text-sm font-normal text-foreground"
                                        fallback.textContent = info.shortName
                                        parent.appendChild(fallback)
                                      }
                                    }}
                                  />
                                </div>
                                <CardTitle className="text-sm text-muted-foreground font-normal">
                                  {info.name}
                                </CardTitle>
                              </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                              <div className="space-y-4">
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Cost Efficiency</span>
                                    <Badge variant="outline" className="font-semibold">
                                      {pricing.rating}/5
                                    </Badge>
                                  </div>
                                  <div className="flex gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                      <div
                                        key={i}
                                        className={`h-2.5 flex-1 rounded ${
                                          i < pricing.rating
                                            ? "bg-green-500"
                                            : "bg-muted"
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <div className="pt-2 border-t">
                                  <p className="text-xs text-muted-foreground mb-1">
                                    {pricing.note}
                                  </p>
                                  <Badge variant="secondary" className="text-xs">
                                    {pricing.strength}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </div>

                  {/* Provider Strengths */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Key Strengths
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {selectedProviders.map((provider) => {
                        const info = getProviderInfo(provider)
                        return (
                        <Card key={provider} className={info.bgColor}>
                          <CardHeader>
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
                                <img
                                  src={info.logoPath}
                                  alt={info.shortName}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement
                                    const parent = target.parentElement
                                    if (parent && !parent.querySelector(".fallback-text")) {
                                      target.style.display = "none"
                                      const fallback = document.createElement("span")
                                      fallback.className = "fallback-text text-sm font-normal text-foreground"
                                      fallback.textContent = info.shortName
                                      parent.appendChild(fallback)
                                    }
                                  }}
                                />
                              </div>
                              <CardTitle className="text-sm text-muted-foreground font-normal">
                                {info.name}
                              </CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {(providerStrengths[provider as keyof typeof providerStrengths] || ["Cloud services", "Scalable infrastructure", "Global presence"]).map((strength, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm">
                                  <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                  <span>{strength}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                        )
                      })}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Recommendation:</strong> Consider your specific use case, budget, and
                      geographic requirements when choosing a provider. Use the Cost Analysis tool to
                      get detailed pricing estimates for your infrastructure needs.
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
