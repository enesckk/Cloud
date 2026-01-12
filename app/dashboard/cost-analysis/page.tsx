"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  calculateProviderCosts,
  getRecommendedDiskType,
  providerRegions,
  type InfrastructureConfig,
  type UseCase,
  type OS,
  type DiskType,
  type Region,
  type ProviderEstimate,
} from "@/lib/cloud-pricing"
import { getProviders, type Provider as ApiProvider } from "@/lib/api-client"
import {
  getSavedAnalyses,
  saveAnalysis,
  deleteAnalysis,
  type SavedAnalysis,
} from "@/lib/reports-storage"
import { useAuth } from "@/lib/auth-context"
import { RefreshCw, Cloud, CheckCircle2, Info, Plus, Eye, Trash2, Calendar, Search, X } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const providerInfo = {
  aws: {
    name: "Amazon Web Services",
    shortName: "AWS",
    logo: "AWS",
    color: "text-orange-600",
  },
  azure: {
    name: "Microsoft Azure",
    shortName: "Azure",
    logo: "Azure",
    color: "text-blue-600",
  },
  gcp: {
    name: "Google Cloud Platform",
    shortName: "GCP",
    logo: "GCP",
    color: "text-blue-500",
  },
  huawei: {
    name: "Huawei Cloud",
    shortName: "Huawei",
    logo: "Huawei",
    color: "text-red-600",
  },
}

const useCaseOptions: Array<{ value: UseCase; label: string; description: string }> = [
  { value: "web-app", label: "Web Application", description: "General web servers, CMS, APIs" },
  { value: "database", label: "Database", description: "SQL, NoSQL databases" },
  { value: "erp", label: "ERP System", description: "Enterprise resource planning" },
  { value: "high-traffic", label: "High Traffic System", description: "E-commerce, streaming" },
  { value: "archive-backup", label: "Archive/Backup", description: "Data archival, backups" },
  { value: "general-server", label: "General Server", description: "Multi-purpose server" },
]

const osOptions: Array<{ value: OS; label: string; description: string }> = [
  { value: "ubuntu-lts", label: "Ubuntu LTS", description: "Most common, cloud-friendly" },
  { value: "centos", label: "CentOS / AlmaLinux", description: "Enterprise Linux alternative" },
  { value: "rhel", label: "Red Hat Enterprise Linux", description: "Enterprise, licensed" },
  { value: "debian", label: "Debian", description: "Stability focused" },
  { value: "windows-server-2019", label: "Windows Server 2019", description: "Still widely used" },
  { value: "windows-server-2022", label: "Windows Server 2022", description: "Latest, long support" },
]

const diskTypeOptions: Array<{ value: DiskType; label: string; description: string; suitableFor: string }> = [
  {
    value: "standard-hdd",
    label: "Standard HDD",
    description: "Low cost, low performance",
    suitableFor: "Archive, backup",
  },
  {
    value: "standard-ssd",
    label: "Standard SSD",
    description: "Balanced price & performance",
    suitableFor: "General server, web app",
  },
  {
    value: "premium-ssd",
    label: "Premium SSD",
    description: "High IOPS & low latency",
    suitableFor: "Database, ERP",
  },
  {
    value: "ultra-ssd",
    label: "Ultra / High Performance SSD",
    description: "Highest performance",
    suitableFor: "Critical, high traffic systems",
  },
]

const regionOptions: Array<{ value: Region; label: string; description: string }> = [
  {
    value: "europe",
    label: "Europe",
    description: "AWS, Azure, GCP intensive regions, close to Turkey",
  },
  {
    value: "middle-east",
    label: "Middle East",
    description: "Huawei Cloud and other providers' Middle East access",
  },
  {
    value: "asia-pacific",
    label: "Asia Pacific",
    description: "GCP and AWS APAC regions, especially for ASEAN countries",
  },
  {
    value: "north-america",
    label: "North America",
    description: "AWS / GCP intensive regions, global scale",
  },
  {
    value: "latin-america",
    label: "Latin America",
    description: "For businesses seeking global expansion",
  },
  {
    value: "turkey-local",
    label: "Turkey Local",
    description: "Especially for Huawei Cloud Turkey (Istanbul)",
  },
]

export default function CostAnalysisPage() {
  const { user } = useAuth()
  const [showNewAnalysis, setShowNewAnalysis] = useState(false)
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([])
  const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null)
  const [analysisTitle, setAnalysisTitle] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterUseCase, setFilterUseCase] = useState<string>("all")
  const [filterRegion, setFilterRegion] = useState<string>("all")
  const [filterProvider, setFilterProvider] = useState<string>("all")
  
  const [vcpu, setVcpu] = useState([4])
  const [ram, setRam] = useState([16])
  const [storage, setStorage] = useState([256])
  const [useCase, setUseCase] = useState<UseCase>("web-app")
  const [os, setOs] = useState<OS>("ubuntu-lts")
  const [diskType, setDiskType] = useState<DiskType>("standard-ssd")
  const [region, setRegion] = useState<Region>("europe")
  const [selectedProviders, setSelectedProviders] = useState<string[]>(["aws", "azure", "gcp"])
  const [availableProviders, setAvailableProviders] = useState<ApiProvider[]>([])

  // Load providers from database
  useEffect(() => {
    const loadProviders = async () => {
      try {
        // Load providers using public endpoint (works for all users)
        try {
          const response = await getProviders(true) // activeOnly = true
          const activeProviders = response.providers.filter((p) => p.is_active)
          setAvailableProviders(activeProviders)
          // Set initial selected providers to all active providers
          if (activeProviders.length > 0) {
            setSelectedProviders(activeProviders.map((p) => p.name))
          }
        } catch (error) {
          console.error("Failed to load providers:", error)
          // Fallback to default providers
          setAvailableProviders([])
        }
      } catch (error) {
        console.error("Failed to load providers:", error)
        setAvailableProviders([])
      }
    }
    loadProviders()
  }, [user])

  // Load saved analyses on mount
  useEffect(() => {
    const loadAnalyses = async () => {
      if (user?.id) {
        try {
          const analyses = await getSavedAnalyses(user.id)
          setSavedAnalyses(analyses)
        } catch (error) {
          console.error("Failed to load analyses:", error)
          setSavedAnalyses([])
        }
      } else {
        const localAnalyses = await getSavedAnalyses()
        setSavedAnalyses(localAnalyses)
      }
    }
    loadAnalyses()
  }, [user])

  // Auto-recommend disk type based on use case
  useEffect(() => {
    if (showNewAnalysis) {
      const recommended = getRecommendedDiskType(useCase)
      setDiskType(recommended)
    }
  }, [useCase, showNewAnalysis])

  // Filter out unavailable providers when region changes
  useEffect(() => {
    if (showNewAnalysis) {
      // Use database providers if available, otherwise fallback to static providerRegions
      if (availableProviders.length > 0) {
        const providersForRegion = availableProviders.filter((p) => {
          if (p.available_regions && p.available_regions.length > 0) {
            return p.available_regions.includes(region)
          }
          // If no available_regions in DB, check static providerRegions
          const staticRegions = providerRegions[p.name as keyof typeof providerRegions]
          return staticRegions?.some((r) => r.value === region && r.available) ?? false
        }).map((p) => p.name)
        
        // Only filter if there are providers for this region, otherwise keep all selected
        if (providersForRegion.length > 0) {
          setSelectedProviders((prev) =>
            prev.filter((p) => providersForRegion.includes(p)),
          )
        }
      } else {
        // Fallback to static providerRegions
        const staticProviders = Object.entries(providerRegions)
          .filter(([provider, regions]) =>
            regions.some((r) => r.value === region && r.available),
          )
          .map(([provider]) => provider)

        if (staticProviders.length > 0) {
          setSelectedProviders((prev) =>
            prev.filter((p) => staticProviders.includes(p)),
          )
        }
      }
    }
  }, [region, showNewAnalysis, availableProviders])

  const config: InfrastructureConfig = useMemo(
    () => ({
      vcpu: vcpu[0],
      ram: ram[0],
      storage: storage[0],
      os,
      diskType,
      useCase,
      region,
    }),
    [vcpu, ram, storage, os, diskType, useCase, region],
  )

  // Calculate costs using database providers
  const calculateProviderCostsFromDB = (
    config: InfrastructureConfig,
    providers: ApiProvider[],
    selectedProviderNames: string[]
  ): ProviderEstimate[] => {
    const { vcpu, ram, storage, os, diskType, useCase, region } = config
    
    // Determine OS type for pricing
    const isWindows = os.startsWith("windows")
    const osType = isWindows ? "windows" : "linux"
    
    // Use case multipliers
    const useCaseMultipliers: Record<UseCase, number> = {
      "web-app": 1.0,
      "general-server": 1.0,
      database: 1.15,
      erp: 1.2,
      "high-traffic": 1.25,
      "archive-backup": 0.9,
    }
    
    // RAM multiplier
    const baseRamPerVcpu = 4
    const ramRatio = ram / vcpu
    const ramMultiplier = 1 + ((ramRatio - baseRamPerVcpu) / baseRamPerVcpu) * 0.25
    
    // Get instance type helper
    const getInstanceType = (providerName: string, vcpu: number, ram: number) => {
      if (providerName === "aws") {
        if (vcpu === 2 && ram === 8) return "t3.medium"
        if (vcpu === 4 && ram === 16) return "t3.large"
        if (vcpu === 8 && ram === 32) return "t3.xlarge"
        return `t3.${vcpu >= 8 ? "xlarge" : vcpu >= 4 ? "large" : "medium"}`
      }
      if (providerName === "azure") {
        if (vcpu === 2 && ram === 4) return "Standard_B2s"
        if (vcpu === 4 && ram === 8) return "Standard_B2s"
        if (vcpu === 4 && ram === 16) return "Standard_B4ms"
        return `Standard_B${vcpu}s`
      }
      if (providerName === "gcp") {
        if (vcpu === 2 && ram === 8) return "e2-standard-2"
        if (vcpu === 4 && ram === 16) return "e2-standard-2"
        if (vcpu === 8 && ram === 32) return "e2-standard-4"
        return `e2-standard-${vcpu}`
      }
      if (providerName === "huawei") {
        if (vcpu === 2 && ram === 8) return "s6.large.2"
        if (vcpu === 4 && ram === 16) return "s6.xlarge.2"
        if (vcpu === 8 && ram === 32) return "s6.2xlarge.2"
        return `s6.${vcpu >= 8 ? "2xlarge" : vcpu >= 4 ? "xlarge" : "large"}.2`
      }
      return "custom"
    }
    
    // Calculate monthly cost for a provider
    const calculateMonthly = (provider: ApiProvider) => {
      const computeRate = provider.compute_rates?.[osType] || 0
      const storageRate = provider.storage_rates?.[diskType] || 0
      const regionMultiplier = provider.region_multipliers?.[region] || 1.0
      
      // Compute cost
      const adjustedMultiplier = Math.max(0.85, Math.min(1.4, ramMultiplier))
      const useCaseMultiplier = useCaseMultipliers[useCase]
      const computeCost = vcpu * computeRate * 730 * adjustedMultiplier * useCaseMultiplier * regionMultiplier
      
      // Storage cost
      const storageCost = storage * storageRate * regionMultiplier
      
      // Network cost
      const networkMultiplier = useCase === "high-traffic" ? 0.08 : useCase === "archive-backup" ? 0.02 : 0.04
      const networkRegionMultiplier = region === "turkey-local" && provider.name === "huawei" ? 0.7 : 1.0
      const networkCost = computeCost * networkMultiplier * networkRegionMultiplier
      
      return Math.round((computeCost + storageCost + networkCost) * 100) / 100
    }
    
    // Calculate estimates for selected providers
    const estimates: ProviderEstimate[] = providers
      .filter((p) => p.is_active && selectedProviderNames.includes(p.name))
      .map((provider) => {
        const monthlyCost = calculateMonthly(provider)
        return {
          provider: provider.name as "aws" | "azure" | "gcp" | "huawei" | string,
          instanceType: getInstanceType(provider.name, vcpu, ram),
          monthlyCost,
          yearlyCost: Math.round(monthlyCost * 12 * 0.95 * 100) / 100,
          isMostEconomical: false,
        } as ProviderEstimate
      })
    
    // Find most economical option
    if (estimates.length > 0) {
      const mostEconomical = estimates.reduce((min, current) =>
        current.monthlyCost < min.monthlyCost ? current : min,
      )
      mostEconomical.isMostEconomical = true
    }
    
    return estimates
  }

  const estimates = useMemo(() => {
    if (!showNewAnalysis) return []
    
    // Use database providers if available, otherwise use static calculation
    if (availableProviders.length > 0) {
      return calculateProviderCostsFromDB(config, availableProviders, selectedProviders)
    } else {
      return calculateProviderCosts(config).filter((est) =>
        selectedProviders.includes(est.provider),
      )
    }
  }, [config, selectedProviders, showNewAnalysis, availableProviders])

  // Helper function to add notification to header (user panel)
  const addNotification = (title: string, description?: string, type: "success" | "info" | "error" | "warning" = "info") => {
    if (typeof window !== "undefined") {
      const event = new CustomEvent("cloudguide:notification", {
        detail: { type, title, description, target: "user" },
      })
      window.dispatchEvent(event)
    }
  }

  const handleProviderToggle = (provider: string) => {
    setSelectedProviders((prev) =>
      prev.includes(provider) ? prev.filter((p) => p !== provider) : [...prev, provider],
    )
  }

  const handleReset = () => {
    setVcpu([4])
    setRam([16])
    setStorage([256])
    setUseCase("web-app")
    setOs("ubuntu-lts")
    setDiskType("standard-ssd")
    setRegion("europe")
    setSelectedProviders(["aws", "azure", "gcp"])
    setAnalysisTitle("")
  }

  const handleSave = async () => {
    if (!analysisTitle.trim()) {
      toast.error("Please enter a title for this analysis")
      return
    }

    try {
      // Generate trend data (simulated monthly trends)
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      const avgMonthlyCost = estimates.reduce((sum, e) => sum + e.monthlyCost, 0) / estimates.length
      const variation = avgMonthlyCost * 0.1 // 10% variation
      
      const trends = months.map((month, idx) => ({
        month,
        cost: Math.round(avgMonthlyCost + (Math.random() - 0.5) * variation * 2),
      }))

      const newAnalysis: SavedAnalysis = {
        id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: analysisTitle,
        config: {
          vcpu: vcpu[0],
          ram: ram[0],
          storage: storage[0],
          os,
          diskType,
          useCase,
          region,
          providers: selectedProviders,
        },
        estimates: estimates.map((est) => ({
          provider: est.provider,
          instanceType: est.instanceType,
          monthlyCost: est.monthlyCost,
          yearlyCost: est.yearlyCost,
          isMostEconomical: est.isMostEconomical,
        })),
        createdAt: new Date().toISOString(),
        trends,
      }

      await saveAnalysis(newAnalysis, user?.id)
      if (user?.id) {
        const analyses = await getSavedAnalyses(user.id)
        setSavedAnalyses(analyses)
      } else {
        const localAnalyses = await getSavedAnalyses()
        setSavedAnalyses(localAnalyses)
      }
      
      const bestProvider = estimates.find((e) => e.isMostEconomical)
      const description = `Analysis "${analysisTitle}" has been saved. Best option: ${bestProvider?.provider.toUpperCase()} - $${(bestProvider?.yearlyCost || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}/year`
      toast.success("Report created successfully", {
        description,
        duration: 5000,
      })
      addNotification("Report created successfully", description, "success")
      
      setShowNewAnalysis(false)
      handleReset()
      setAnalysisTitle("")
    } catch (error) {
      toast.error("Failed to save report", {
        description: "An error occurred while saving your analysis. Please try again.",
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this analysis?")) {
      await deleteAnalysis(id, user?.id)
      if (user?.id) {
        const analyses = await getSavedAnalyses(user.id)
        setSavedAnalyses(analyses)
      } else {
        const localAnalyses = await getSavedAnalyses()
        setSavedAnalyses(localAnalyses)
      }
    }
  }

  const handleLoadAnalysis = (analysis: SavedAnalysis) => {
    setVcpu([analysis.config.vcpu])
    setRam([analysis.config.ram])
    setStorage([analysis.config.storage])
    setUseCase(analysis.config.useCase as UseCase)
    setOs(analysis.config.os as OS)
    setDiskType(analysis.config.diskType as DiskType)
    setRegion(analysis.config.region as Region)
    setSelectedProviders(analysis.config.providers)
    setAnalysisTitle(analysis.title)
    setShowNewAnalysis(true)
  }

  const updateDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  const selectedDiskInfo = diskTypeOptions.find((d) => d.value === diskType)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  // Filter and search saved analyses
  const filteredAnalyses = useMemo(() => {
    let filtered = savedAnalyses

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (analysis) =>
          analysis.title.toLowerCase().includes(query) ||
          analysis.config.useCase.toLowerCase().includes(query) ||
          analysis.config.region.toLowerCase().includes(query) ||
          analysis.config.providers.some((p) => p.toLowerCase().includes(query))
      )
    }

    // Use case filter
    if (filterUseCase !== "all") {
      filtered = filtered.filter((analysis) => analysis.config.useCase === filterUseCase)
    }

    // Region filter
    if (filterRegion !== "all") {
      filtered = filtered.filter((analysis) => analysis.config.region === filterRegion)
    }

    // Provider filter
    if (filterProvider !== "all") {
      filtered = filtered.filter((analysis) => analysis.config.providers.includes(filterProvider))
    }

    return filtered
  }, [savedAnalyses, searchQuery, filterUseCase, filterRegion, filterProvider])

  const hasActiveFilters = searchQuery.trim() || filterUseCase !== "all" || filterRegion !== "all" || filterProvider !== "all"

  const clearFilters = () => {
    setSearchQuery("")
    setFilterUseCase("all")
    setFilterRegion("all")
    setFilterProvider("all")
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="text-muted-foreground">
          Configure your cloud infrastructure requirements and compare costs across leading cloud providers. 
          Get instant estimates to make informed decisions for your migration journey.
        </p>
      </div>

      {/* Action Bar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-sm font-medium px-3 py-1">
            Total: {savedAnalyses.length}
          </Badge>
          {savedAnalyses.length > 0 && (
            <Badge variant="secondary" className="text-sm font-medium px-3 py-1">
              Showing: {filteredAnalyses.length}
            </Badge>
          )}
        </div>
        <Button onClick={() => setShowNewAnalysis(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Analysis
        </Button>
      </div>

      {/* Saved Analyses List */}
      {savedAnalyses.length > 0 && !showNewAnalysis ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Saved Analyses</CardTitle>
            <CardDescription>Your previously created cost analyses</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="mb-6 space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by title, use case, region, or provider..."
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

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Select value={filterUseCase} onValueChange={setFilterUseCase}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by use case" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Use Cases</SelectItem>
                    {useCaseOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterRegion} onValueChange={setFilterRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {regionOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterProvider} onValueChange={setFilterProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Providers</SelectItem>
                    {Object.entries(providerInfo).map(([key, info]) => (
                      <SelectItem key={key} value={key}>
                        {info.shortName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="w-full md:w-auto">
                  Clear All Filters
                </Button>
              )}
            </div>

            {/* Analyses List */}
            {filteredAnalyses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No analyses match your filters</p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters} className="mt-4">
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAnalyses.map((analysis) => {
                const bestProvider = analysis.estimates.find((e) => e.isMostEconomical)
                return (
                  <div
                    key={analysis.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{analysis.title}</h3>
                        <Badge variant="outline">{analysis.config.useCase}</Badge>
                        <Badge variant="secondary">{analysis.config.region}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(analysis.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Cloud className="h-4 w-4" />
                          {analysis.config.providers.join(", ")}
                        </div>
                        {bestProvider && (
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            Best: {bestProvider.provider} ({formatCurrency(bestProvider.yearlyCost)}/yr)
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLoadAnalysis(analysis)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(analysis.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      ) : !showNewAnalysis ? (
        <Card className="mb-6">
          <CardContent className="py-12">
            <div className="text-center">
              <Cloud className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No saved analyses yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first cost analysis to compare cloud provider costs and make informed decisions
              </p>
              <Button onClick={() => setShowNewAnalysis(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* New Analysis Form */}
      {showNewAnalysis && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Create New Cost Analysis</CardTitle>
                  <CardDescription>Configure your infrastructure and compare costs</CardDescription>
                </div>
                <Button variant="ghost" onClick={() => setShowNewAnalysis(false)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Label htmlFor="title">Analysis Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Web App Migration - Q1 2024"
                  value={analysisTitle}
                  onChange={(e) => setAnalysisTitle(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-5">
                {/* Left Panel - Configuration */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configure Your Infrastructure</CardTitle>
                      <CardDescription>Set your requirements to see cost estimates</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Use Case */}
                      <div className="space-y-2">
                        <Label>Use Case / Workload Type</Label>
                        <Select value={useCase} onValueChange={(value: UseCase) => setUseCase(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {useCaseOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {useCaseOptions.find((u) => u.value === useCase) && (
                          <p className="text-xs text-muted-foreground">
                            {useCaseOptions.find((u) => u.value === useCase)?.description}
                          </p>
                        )}
                      </div>

                      {/* vCPU */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Virtual CPU (vCPU)</Label>
                          <span className="text-sm font-semibold text-foreground">{vcpu[0]}</span>
                        </div>
                        <Slider
                          value={vcpu}
                          onValueChange={setVcpu}
                          min={1}
                          max={16}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>1</span>
                          <span>16</span>
                        </div>
                      </div>

                      {/* RAM */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Memory (RAM GB)</Label>
                          <span className="text-sm font-semibold text-foreground">{ram[0]} GB</span>
                        </div>
                        <Slider
                          value={ram}
                          onValueChange={setRam}
                          min={2}
                          max={64}
                          step={2}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>2 GB</span>
                          <span>64 GB</span>
                        </div>
                      </div>

                      {/* Storage */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Storage (GB)</Label>
                          <span className="text-sm font-semibold text-foreground">{storage[0]} GB</span>
                        </div>
                        <Slider
                          value={storage}
                          onValueChange={setStorage}
                          min={20}
                          max={1000}
                          step={10}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>20 GB</span>
                          <span>1000 GB</span>
                        </div>
                      </div>

                      {/* OS */}
                      <div className="space-y-2">
                        <Label>Operating System</Label>
                        <Select value={os} onValueChange={(value: OS) => setOs(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {osOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {osOptions.find((o) => o.value === os) && (
                          <p className="text-xs text-muted-foreground">
                            {osOptions.find((o) => o.value === os)?.description}
                          </p>
                        )}
                      </div>

                      {/* Disk Type */}
                      <div className="space-y-2">
                        <Label>Disk Type</Label>
                        <Select value={diskType} onValueChange={(value: DiskType) => setDiskType(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {diskTypeOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedDiskInfo && (
                          <Alert className="mt-2">
                            <Info className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              <strong>{selectedDiskInfo.label}:</strong> {selectedDiskInfo.description}. Best
                              for: {selectedDiskInfo.suitableFor}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      {/* Region */}
                      <div className="space-y-2">
                        <Label>Region</Label>
                        <Select value={region} onValueChange={(value: Region) => setRegion(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {regionOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {regionOptions.find((r) => r.value === region) && (
                          <p className="text-xs text-muted-foreground">
                            {regionOptions.find((r) => r.value === region)?.description}
                          </p>
                        )}
                        {region === "turkey-local" && (
                          <Alert className="mt-2">
                            <Info className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              <strong>Note:</strong> Huawei Cloud and Google Cloud Platform have local Turkey
                              regions (Istanbul). AWS and Azure route through Europe with additional latency.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>

                      {/* Provider Selection */}
                      <div className="space-y-3">
                        <Label>Select Providers</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {(availableProviders.length > 0 ? availableProviders : Object.keys(providerInfo).map(name => ({ 
                            name, 
                            display_name: providerInfo[name as keyof typeof providerInfo].name, 
                            short_name: providerInfo[name as keyof typeof providerInfo].shortName, 
                            available_regions: providerRegions[name as keyof typeof providerRegions]?.filter(r => r.available).map(r => r.value) || [],
                            is_active: true
                          } as ApiProvider))).map((provider) => {
                            const providerName = provider.name
                            const info = { name: provider.display_name, shortName: provider.short_name }
                            // Check availability: use database available_regions if available, otherwise fallback to static providerRegions
                            let isAvailable = false
                            if (provider.available_regions && provider.available_regions.length > 0) {
                              isAvailable = provider.available_regions.includes(region)
                            } else {
                              // Fallback to static providerRegions
                              const staticRegions = providerRegions[providerName as keyof typeof providerRegions]
                              isAvailable = staticRegions?.some((r) => r.value === region && r.available) ?? false
                            }
                            // Also check if provider is active
                            isAvailable = isAvailable && (provider.is_active ?? true)
                            
                            return (
                              <div
                                key={providerName}
                                className={`flex items-center space-x-2 rounded-lg border p-3 transition-colors ${
                                  isAvailable
                                    ? "border-border hover:bg-muted/50"
                                    : "border-dashed border-muted-foreground/30 opacity-50 cursor-not-allowed"
                                }`}
                              >
                                <Checkbox
                                  id={providerName}
                                  checked={selectedProviders.includes(providerName)}
                                  onCheckedChange={() => handleProviderToggle(providerName)}
                                  disabled={!isAvailable}
                                />
                                <Label
                                  htmlFor={providerName}
                                  className={`flex-1 cursor-pointer text-sm font-medium ${
                                    !isAvailable ? "cursor-not-allowed" : ""
                                  }`}
                                >
                                  {info.shortName}
                                  {!isAvailable && (
                                    <span className="ml-1 text-xs text-muted-foreground">(N/A)</span>
                                  )}
                                </Label>
                              </div>
                            )
                          })}
                        </div>
                        {region === "turkey-local" && (
                          <p className="text-xs text-muted-foreground">
                            Huawei Cloud and Google Cloud Platform support Turkey Local region. AWS and Azure
                            will be unavailable.
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-2">
                        <Button onClick={handleSave} className="flex-1" disabled={!analysisTitle.trim()}>
                          Save Analysis
                        </Button>
                        <Button variant="outline" onClick={handleReset}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Panel - Cost Estimates */}
                {estimates.length > 0 && (
                  <div className="lg:col-span-3">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Estimated Costs</CardTitle>
                            <CardDescription>Prices updated on {updateDate}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {estimates
                            .sort((a, b) => a.monthlyCost - b.monthlyCost)
                            .map((estimate) => {
                              const dbProvider = availableProviders.find((p) => p.name === estimate.provider)
                              const info = dbProvider 
                                ? { name: dbProvider.display_name, shortName: dbProvider.short_name, logo: dbProvider.logo || dbProvider.short_name, color: providerInfo[estimate.provider as keyof typeof providerInfo]?.color || "text-gray-600" }
                                : providerInfo[estimate.provider as keyof typeof providerInfo] || { name: estimate.provider, shortName: estimate.provider.toUpperCase(), logo: estimate.provider.toUpperCase(), color: "text-gray-600" }
                              return (
                                <div
                                  key={estimate.provider}
                                  className={`relative rounded-xl border-2 p-6 transition-all shadow-sm ${
                                    estimate.isMostEconomical
                                      ? "border-green-500 bg-green-50/50 dark:bg-green-950/30 shadow-green-500/10"
                                      : "border-border bg-card hover:shadow-md"
                                  }`}
                                >
                                  {estimate.isMostEconomical && (
                                    <Badge
                                      className="absolute right-4 top-4 bg-green-600 hover:bg-green-700 text-white border-0"
                                      variant="default"
                                    >
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Most Economical
                                    </Badge>
                                  )}

                                  <div className="flex items-start gap-4 pr-20">
                                    <div
                                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-background border-2 ${
                                        estimate.isMostEconomical ? "border-green-500" : "border-border"
                                      } text-xl font-bold ${info.color}`}
                                    >
                                      {info.logo}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold text-lg mb-1">{info.name}</h3>
                                      <p className="text-sm text-muted-foreground mb-5">
                                        Recommended:{" "}
                                        <span className="font-medium text-foreground">
                                          {estimate.instanceType}
                                        </span>
                                      </p>

                                      <div className="grid grid-cols-2 gap-6">
                                        <div>
                                          <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wide">
                                            Monthly Estimate
                                          </p>
                                          <p
                                            className={`text-3xl font-bold ${
                                              estimate.isMostEconomical
                                                ? "text-green-600 dark:text-green-500"
                                                : "text-foreground"
                                            }`}
                                          >
                                            ${estimate.monthlyCost.toFixed(2)}
                                          </p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wide">
                                            Yearly Estimate
                                          </p>
                                          <p className="text-2xl font-bold text-foreground">
                                            ${estimate.yearlyCost.toFixed(2)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  )
}
