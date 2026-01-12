"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  Search,
  Video,
  FileText,
  ExternalLink,
  Clock,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Server,
  Globe,
  Layers,
  CheckCircle2,
  PlayCircle,
  Download,
  Filter,
  X,
  Cloud,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ContentType = "article" | "video" | "guide" | "case-study"
type Category = "basics" | "migration" | "providers" | "security" | "cost-optimization" | "best-practices"

interface EducationContent {
  id: string
  title: string
  description: string
  type: ContentType
  category: Category
  duration?: string
  level: "beginner" | "intermediate" | "advanced"
  provider?: "aws" | "azure" | "gcp" | "huawei" | "general"
  tags: string[]
  url?: string
  completed?: boolean
}

const educationContent: EducationContent[] = [
  // Cloud Basics
  {
    id: "1",
    title: "Introduction to Cloud Computing",
    description: "Learn the fundamentals of cloud computing, including IaaS, PaaS, and SaaS models, and understand how cloud services work.",
    type: "article",
    category: "basics",
    duration: "15 min",
    level: "beginner",
    provider: "general",
    tags: ["cloud basics", "fundamentals", "iaas", "paas", "saas"],
  },
  {
    id: "2",
    title: "Cloud Computing Explained: A Manager's Guide",
    description: "A non-technical guide for business leaders to understand cloud computing benefits, risks, and strategic considerations.",
    type: "guide",
    category: "basics",
    duration: "20 min",
    level: "beginner",
    provider: "general",
    tags: ["business", "strategy", "management"],
  },
  {
    id: "3",
    title: "Understanding Cloud Service Models",
    description: "Deep dive into Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS).",
    type: "video",
    category: "basics",
    duration: "12 min",
    level: "beginner",
    provider: "general",
    tags: ["service models", "iaas", "paas", "saas"],
  },
  // Migration Strategies
  {
    id: "4",
    title: "Cloud Migration Strategies: Lift and Shift vs. Replatforming",
    description: "Compare different migration approaches and learn when to use each strategy for optimal results.",
    type: "article",
    category: "migration",
    duration: "18 min",
    level: "intermediate",
    provider: "general",
    tags: ["migration", "strategies", "lift-and-shift", "replatforming"],
  },
  {
    id: "5",
    title: "Step-by-Step Migration Planning Guide",
    description: "A comprehensive guide to planning your cloud migration, including assessment, preparation, and execution phases.",
    type: "guide",
    category: "migration",
    duration: "30 min",
    level: "intermediate",
    provider: "general",
    tags: ["planning", "migration", "checklist"],
  },
  {
    id: "6",
    title: "Common Migration Challenges and Solutions",
    description: "Learn about typical migration pitfalls and how to avoid them, with real-world examples and solutions.",
    type: "case-study",
    category: "migration",
    duration: "25 min",
    level: "intermediate",
    provider: "general",
    tags: ["challenges", "solutions", "case study"],
  },
  // Provider Guides
  {
    id: "7",
    title: "AWS Cloud Services Overview",
    description: "Introduction to Amazon Web Services, including EC2, S3, RDS, and other core services for enterprise workloads.",
    type: "guide",
    category: "providers",
    duration: "22 min",
    level: "intermediate",
    provider: "aws",
    tags: ["aws", "ec2", "s3", "services"],
  },
  {
    id: "8",
    title: "Microsoft Azure Fundamentals",
    description: "Get started with Microsoft Azure, including virtual machines, storage, and networking services.",
    type: "video",
    category: "providers",
    duration: "20 min",
    level: "intermediate",
    provider: "azure",
    tags: ["azure", "microsoft", "fundamentals"],
  },
  {
    id: "9",
    title: "Google Cloud Platform Essentials",
    description: "Learn about GCP's core services, including Compute Engine, Cloud Storage, and BigQuery.",
    type: "article",
    category: "providers",
    duration: "18 min",
    level: "intermediate",
    provider: "gcp",
    tags: ["gcp", "google cloud", "compute engine"],
  },
  {
    id: "10",
    title: "Huawei Cloud Services Guide",
    description: "Explore Huawei Cloud offerings, including ECS, OBS, and region-specific services for Turkey and APAC markets.",
    type: "guide",
    category: "providers",
    duration: "16 min",
    level: "intermediate",
    provider: "huawei",
    tags: ["huawei", "ecs", "turkey", "apac"],
  },
  // Security
  {
    id: "11",
    title: "Cloud Security Best Practices",
    description: "Essential security practices for cloud environments, including identity management, encryption, and compliance.",
    type: "article",
    category: "security",
    duration: "20 min",
    level: "intermediate",
    provider: "general",
    tags: ["security", "compliance", "encryption"],
  },
  {
    id: "12",
    title: "Shared Responsibility Model Explained",
    description: "Understand what security responsibilities belong to you versus your cloud provider.",
    type: "video",
    category: "security",
    duration: "10 min",
    level: "beginner",
    provider: "general",
    tags: ["security", "responsibility", "compliance"],
  },
  // Cost Optimization
  {
    id: "13",
    title: "Cloud Cost Optimization Strategies",
    description: "Learn how to reduce cloud costs through right-sizing, reserved instances, and cost monitoring best practices.",
    type: "article",
    category: "cost-optimization",
    duration: "25 min",
    level: "intermediate",
    provider: "general",
    tags: ["cost", "optimization", "savings"],
  },
  {
    id: "14",
    title: "Understanding Cloud Pricing Models",
    description: "Compare pay-as-you-go, reserved instances, and spot instances to choose the best pricing model for your needs.",
    type: "guide",
    category: "cost-optimization",
    duration: "15 min",
    level: "beginner",
    provider: "general",
    tags: ["pricing", "cost", "models"],
  },
  // Best Practices
  {
    id: "15",
    title: "Cloud Architecture Best Practices",
    description: "Design scalable, resilient, and cost-effective cloud architectures following industry best practices.",
    type: "article",
    category: "best-practices",
    duration: "30 min",
    level: "advanced",
    provider: "general",
    tags: ["architecture", "design", "scalability"],
  },
  {
    id: "16",
    title: "Disaster Recovery in the Cloud",
    description: "Implement robust disaster recovery strategies using cloud-native backup and recovery services.",
    type: "guide",
    category: "best-practices",
    duration: "22 min",
    level: "intermediate",
    provider: "general",
    tags: ["disaster recovery", "backup", "resilience"],
  },
]

const categoryInfo = {
  basics: { label: "Cloud Basics", icon: Cloud, color: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  migration: { label: "Migration", icon: TrendingUp, color: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300" },
  providers: { label: "Providers", icon: Server, color: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300" },
  security: { label: "Security", icon: Shield, color: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300" },
  "cost-optimization": { label: "Cost Optimization", icon: Zap, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300" },
  "best-practices": { label: "Best Practices", icon: CheckCircle2, color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300" },
}

const typeIcons = {
  article: FileText,
  video: Video,
  guide: BookOpen,
  "case-study": Users,
}

const levelColors = {
  beginner: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  intermediate: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  advanced: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
}

const providerColors = {
  aws: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300",
  azure: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  gcp: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
  huawei: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  general: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
}

export default function EducationPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all")
  const [selectedType, setSelectedType] = useState<ContentType | "all">("all")
  const [selectedLevel, setSelectedLevel] = useState<"all" | "beginner" | "intermediate" | "advanced">("all")
  const [selectedProvider, setSelectedProvider] = useState<"all" | "aws" | "azure" | "gcp" | "huawei" | "general">("all")

  const filteredContent = useMemo(() => {
    return educationContent.filter((content) => {
      const matchesSearch =
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || content.category === selectedCategory
      const matchesType = selectedType === "all" || content.type === selectedType
      const matchesLevel = selectedLevel === "all" || content.level === selectedLevel
      const matchesProvider = selectedProvider === "all" || content.provider === selectedProvider

      return matchesSearch && matchesCategory && matchesType && matchesLevel && matchesProvider
    })
  }, [searchQuery, selectedCategory, selectedType, selectedLevel, selectedProvider])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedType("all")
    setSelectedLevel("all")
    setSelectedProvider("all")
  }

  const hasActiveFilters = selectedCategory !== "all" || selectedType !== "all" || selectedLevel !== "all" || selectedProvider !== "all" || searchQuery !== ""

  return (
    <div className="p-6 max-w-7xl mx-auto">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{educationContent.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(categoryInfo).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Videos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {educationContent.filter((c) => c.type === "video").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Guides & Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {educationContent.filter((c) => c.type === "article" || c.type === "guide").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, description, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as Category | "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(categoryInfo).map(([key, info]) => (
                    <SelectItem key={key} value={key}>
                      {info.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={(value) => setSelectedType(value as ContentType | "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="article">Articles</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="guide">Guides</SelectItem>
                  <SelectItem value="case-study">Case Studies</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={(value) => setSelectedLevel(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedProvider} onValueChange={(value) => setSelectedProvider(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="aws">AWS</SelectItem>
                  <SelectItem value="azure">Azure</SelectItem>
                  <SelectItem value="gcp">GCP</SelectItem>
                  <SelectItem value="huawei">Huawei</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
                <span className="text-sm text-muted-foreground">
                  {filteredContent.length} result{filteredContent.length !== 1 ? "s" : ""} found
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      {filteredContent.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No content found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((content) => {
            const TypeIcon = typeIcons[content.type]
            const CategoryInfo = categoryInfo[content.category]
            const CategoryIcon = CategoryInfo.icon

            return (
              <Card key={content.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${CategoryInfo.color}`}>
                        <CategoryIcon className="h-4 w-4" />
                      </div>
                      <Badge className={levelColors[content.level]} variant="secondary">
                        {content.level}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <TypeIcon className="h-4 w-4 text-muted-foreground" />
                      {content.provider && content.provider !== "general" && (
                        <Badge className={`${providerColors[content.provider]} text-xs`} variant="outline">
                          {content.provider.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{content.title}</CardTitle>
                  <CardDescription className="mt-2 line-clamp-3">{content.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {content.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Duration */}
                    {content.duration && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{content.duration}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => router.push(`/dashboard/education/${content.id}`)}
                    >
                      {content.type === "video" ? (
                        <>
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Watch
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Read More
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
