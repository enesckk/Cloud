"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Clock,
  Users,
  BookOpen,
  Video,
  FileText,
  CheckCircle2,
  PlayCircle,
  Download,
  ExternalLink,
  Cloud,
  TrendingUp,
  Shield,
  Zap,
  Server,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

const educationContent: Record<
  string,
  {
    id: string
    title: string
    description: string
    fullContent: string
    type: "article" | "video" | "guide" | "case-study"
    category: "basics" | "migration" | "providers" | "security" | "cost-optimization" | "best-practices"
    duration?: string
    level: "beginner" | "intermediate" | "advanced"
    provider?: "aws" | "azure" | "gcp" | "huawei" | "general"
    tags: string[]
    keyPoints?: string[]
    relatedTopics?: string[]
  }
> = {
  "1": {
    id: "1",
    title: "Introduction to Cloud Computing",
    description: "Learn the fundamentals of cloud computing, including IaaS, PaaS, and SaaS models, and understand how cloud services work.",
    fullContent: `
# Introduction to Cloud Computing

Cloud computing has revolutionized how businesses and individuals access and use computing resources. Instead of owning and maintaining physical servers and data centers, organizations can now rent access to these resources from cloud providers over the internet.

## What is Cloud Computing?

Cloud computing is the delivery of computing services—including servers, storage, databases, networking, software, analytics, and intelligence—over the Internet ("the cloud") to offer faster innovation, flexible resources, and economies of scale.

## Key Benefits

### 1. Cost Efficiency
- **Pay-as-you-go pricing**: You only pay for what you use
- **No upfront capital investment**: Eliminate the need to purchase hardware
- **Reduced operational costs**: No need for on-site data centers or IT staff to manage infrastructure

### 2. Scalability
- **Elastic resources**: Scale up or down based on demand
- **Global reach**: Deploy applications closer to users worldwide
- **Automatic scaling**: Resources adjust automatically to traffic patterns

### 3. Performance
- **Latest technology**: Access to cutting-edge hardware and software
- **High availability**: Built-in redundancy and failover capabilities
- **Fast deployment**: Launch new services in minutes, not months

### 4. Security
- **Enterprise-grade security**: Cloud providers invest heavily in security
- **Compliance**: Meet regulatory requirements with built-in compliance features
- **Data backup**: Automatic backups and disaster recovery

## Service Models

### Infrastructure as a Service (IaaS)
IaaS provides virtualized computing resources over the internet. You rent IT infrastructure—servers, virtual machines, storage, networks, and operating systems—from a cloud provider on a pay-as-you-go basis.

**Examples**: Amazon EC2, Microsoft Azure Virtual Machines, Google Compute Engine

**Use cases**:
- Development and testing environments
- Website hosting
- Data storage and backup
- High-performance computing

### Platform as a Service (PaaS)
PaaS provides a platform allowing customers to develop, run, and manage applications without dealing with the underlying infrastructure. The provider manages servers, storage, and networking.

**Examples**: AWS Elastic Beanstalk, Azure App Service, Google App Engine

**Use cases**:
- Application development
- API development and management
- Business analytics
- Database management

### Software as a Service (SaaS)
SaaS delivers software applications over the internet, on a subscription basis. Users access the software through a web browser, eliminating the need for installation and maintenance.

**Examples**: Microsoft 365, Google Workspace, Salesforce, Dropbox

**Use cases**:
- Email and collaboration tools
- Customer relationship management (CRM)
- Enterprise resource planning (ERP)
- Human resources management

## Deployment Models

### Public Cloud
Services are delivered over the public internet and shared across organizations. Examples include AWS, Azure, and Google Cloud.

### Private Cloud
Cloud infrastructure is dedicated to a single organization, providing greater control and security.

### Hybrid Cloud
Combines public and private clouds, allowing data and applications to be shared between them.

## Getting Started

To begin your cloud journey:

1. **Assess your needs**: Identify what you want to achieve with cloud computing
2. **Choose a provider**: Research and compare cloud providers
3. **Start small**: Begin with a pilot project
4. **Learn continuously**: Cloud technology evolves rapidly
5. **Monitor costs**: Keep track of your cloud spending

## Conclusion

Cloud computing offers unprecedented flexibility, scalability, and cost savings. Whether you're a small business or a large enterprise, understanding cloud computing fundamentals is essential in today's digital landscape.
    `,
    type: "article",
    category: "basics",
    duration: "15 min",
    level: "beginner",
    provider: "general",
    tags: ["cloud basics", "fundamentals", "iaas", "paas", "saas"],
    keyPoints: [
      "Cloud computing delivers services over the internet",
      "Three main service models: IaaS, PaaS, and SaaS",
      "Key benefits include cost efficiency, scalability, and performance",
      "Multiple deployment models available: public, private, and hybrid",
    ],
    relatedTopics: ["Cloud Service Models", "Cloud Deployment Strategies", "Cloud Security Basics"],
  },
  "2": {
    id: "2",
    title: "Cloud Computing Explained: A Manager's Guide",
    description: "A non-technical guide for business leaders to understand cloud computing benefits, risks, and strategic considerations.",
    fullContent: `
# Cloud Computing Explained: A Manager's Guide

As a business leader, understanding cloud computing is crucial for making informed decisions about your organization's technology strategy. This guide explains cloud computing in business terms, focusing on strategic benefits and considerations.

## Why Cloud Computing Matters for Business

### Strategic Advantages

**1. Competitive Advantage**
- Faster time to market for new products and services
- Ability to scale quickly in response to market opportunities
- Access to advanced technologies (AI, machine learning, analytics) without large upfront investments

**2. Financial Benefits**
- Convert capital expenditures (CapEx) to operational expenditures (OpEx)
- Predictable monthly costs instead of large one-time investments
- Reduced total cost of ownership (TCO) over time

**3. Business Agility**
- Respond quickly to changing business needs
- Test new ideas with minimal risk
- Scale resources up or down based on demand

## Key Business Considerations

### Cost Management
While cloud computing can reduce costs, it requires careful management:
- Monitor usage to avoid unexpected charges
- Use reserved instances for predictable workloads
- Implement cost allocation and budgeting tools

### Security and Compliance
- Understand shared responsibility model
- Ensure compliance with industry regulations (GDPR, HIPAA, etc.)
- Implement proper access controls and data encryption

### Vendor Lock-in
- Consider multi-cloud strategies
- Evaluate portability of applications and data
- Negotiate contracts with exit strategies

## ROI Calculation

When evaluating cloud migration, consider:
- **Direct savings**: Reduced hardware and maintenance costs
- **Indirect benefits**: Improved productivity, faster innovation
- **Risk reduction**: Better disaster recovery and business continuity
- **Opportunity costs**: What you could achieve with cloud that wasn't possible before

## Making the Decision

### When Cloud Makes Sense
- Your business is growing or has variable demand
- You need to modernize legacy systems
- You want to focus on core business, not IT infrastructure
- You need global reach or compliance capabilities

### When to Be Cautious
- Highly regulated industries with strict data residency requirements
- Legacy systems that are difficult to migrate
- Limited IT expertise or resources
- Very predictable, stable workloads

## Conclusion

Cloud computing is not just a technology trend—it's a strategic business decision. By understanding the business implications, you can make informed choices that align with your organization's goals and drive competitive advantage.
    `,
    type: "guide",
    category: "basics",
    duration: "20 min",
    level: "beginner",
    provider: "general",
    tags: ["business", "strategy", "management"],
    keyPoints: [
      "Cloud computing offers strategic competitive advantages",
      "Convert CapEx to OpEx for better financial flexibility",
      "Careful cost management is essential",
      "Consider security, compliance, and vendor lock-in",
    ],
  },
  // Add more content as needed - for now, I'll add a few key ones
  "4": {
    id: "4",
    title: "Cloud Migration Strategies: Lift and Shift vs. Replatforming",
    description: "Compare different migration approaches and learn when to use each strategy for optimal results.",
    fullContent: `
# Cloud Migration Strategies: Lift and Shift vs. Replatforming

Choosing the right migration strategy is critical for a successful cloud transition. This guide compares the most common approaches and helps you decide which is best for your organization.

## Migration Strategy Overview

### Lift and Shift (Rehost)
**What it is**: Moving applications to the cloud without making any changes to the application architecture.

**Pros**:
- Fastest migration approach
- Lowest risk of breaking changes
- Minimal application modification required
- Good for quick wins and proof of concepts

**Cons**:
- Doesn't leverage cloud-native features
- May not reduce costs significantly
- Misses opportunities for optimization
- Legacy issues remain

**Best for**:
- Time-sensitive migrations
- Applications that work well as-is
- Organizations with limited cloud expertise
- Temporary solutions before refactoring

### Replatforming (Lift and Optimize)
**What it is**: Making minor adjustments to optimize applications for the cloud without changing core architecture.

**Pros**:
- Better cloud optimization than lift and shift
- Some cost reduction possible
- Improved performance and scalability
- Moderate risk level

**Cons**:
- Takes longer than lift and shift
- Requires some cloud expertise
- May need application modifications
- Doesn't fully leverage cloud capabilities

**Best for**:
- Applications that need some optimization
- Organizations with moderate cloud skills
- When you want better cost efficiency
- Applications with clear optimization opportunities

## Comparison Table

| Factor | Lift and Shift | Replatforming |
|--------|---------------|---------------|
| Speed | Fastest | Moderate |
| Risk | Low | Medium |
| Cost Reduction | Minimal | Moderate |
| Cloud Benefits | Limited | Better |
| Complexity | Low | Medium |
| Expertise Required | Low | Medium |

## Decision Framework

### Choose Lift and Shift if:
- You need to migrate quickly
- Application works well in current form
- Limited budget for modifications
- Planning to refactor later

### Choose Replatforming if:
- You want better cloud optimization
- Some cost reduction is important
- You have cloud expertise available
- Application can benefit from cloud features

## Best Practices

1. **Assess thoroughly**: Understand your applications before choosing a strategy
2. **Start small**: Begin with non-critical applications
3. **Monitor closely**: Track performance and costs after migration
4. **Plan for optimization**: Even lift and shift can be optimized later
5. **Train your team**: Ensure your team understands the chosen approach

## Conclusion

Both strategies have their place in cloud migration. Lift and shift offers speed and low risk, while replatforming provides better optimization. Choose based on your specific needs, timeline, and capabilities.
    `,
    type: "article",
    category: "migration",
    duration: "18 min",
    level: "intermediate",
    provider: "general",
    tags: ["migration", "strategies", "lift-and-shift", "replatforming"],
    keyPoints: [
      "Lift and shift is fastest but offers limited cloud benefits",
      "Replatforming provides better optimization with moderate effort",
      "Choose based on timeline, risk tolerance, and expertise",
      "Both strategies can be part of a phased migration approach",
    ],
  },
  // Add placeholder content for other IDs - they will show the description as full content
}

// Helper function to get content with fallback
function getContent(id: string) {
  if (educationContent[id]) {
    return educationContent[id]
  }
  
  // Fallback: create content from the list page data
  // This would ideally come from a shared data source
  return null
}

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

export default function EducationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const contentId = params.id as string
  let content = educationContent[contentId]

  // If content not found in detail data, create a basic version
  if (!content) {
    // This is a fallback - in a real app, you'd fetch from a shared data source
    content = {
      id: contentId,
      title: "Education Material",
      description: "This content is being prepared. Please check back later.",
      fullContent: "This content is currently being developed. We're working to provide you with comprehensive educational materials.",
      type: "article",
      category: "basics",
      level: "beginner",
      provider: "general",
      tags: [],
    }
  }

  const CategoryInfo = categoryInfo[content.category]
  const CategoryIcon = CategoryInfo.icon
  const TypeIcon = typeIcons[content.type]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.push("/dashboard/education")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Education
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg ${CategoryInfo.color}`}>
            <CategoryIcon className="h-5 w-5" />
          </div>
          <Badge className={levelColors[content.level]} variant="secondary">
            {content.level}
          </Badge>
          {content.provider && content.provider !== "general" && (
            <Badge className={`${providerColors[content.provider]} text-xs`} variant="outline">
              {content.provider.toUpperCase()}
            </Badge>
          )}
          <Badge variant="outline" className="flex items-center gap-1">
            <TypeIcon className="h-3 w-3" />
            {content.type}
          </Badge>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-3">{content.title}</h1>
        <p className="text-lg text-muted-foreground mb-4">{content.description}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {content.duration && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{content.duration}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <CategoryIcon className="h-4 w-4" />
            <span>{CategoryInfo.label}</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {content.tags.map((tag) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      {/* Key Points */}
      {content.keyPoints && content.keyPoints.length > 0 && (
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Key Takeaways</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {content.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Separator className="mb-8" />

      {/* Full Content */}
      <Card>
        <CardContent className="pt-6">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {content.fullContent}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Topics */}
      {content.relatedTopics && content.relatedTopics.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Related Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {content.relatedTopics.map((topic) => (
                <Badge key={topic} variant="secondary" className="cursor-pointer hover:bg-primary/10">
                  {topic}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <Button onClick={() => router.push("/dashboard/education")} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Education
        </Button>
        {content.type === "video" ? (
          <Button>
            <PlayCircle className="h-4 w-4 mr-2" />
            Watch Video
          </Button>
        ) : (
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        )}
      </div>
    </div>
  )
}
