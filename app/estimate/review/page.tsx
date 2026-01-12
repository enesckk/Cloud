"use client"

import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useWizard } from "@/lib/wizard-context"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Pencil, ClipboardCheck, Info } from "lucide-react"

const labelMappings: Record<string, Record<string, string>> = {
  infrastructureSize: {
    small: "Small (up to 10 servers)",
    medium: "Medium (11-50 servers)",
    large: "Large (50+ servers)",
  },
  applicationComplexity: {
    simple: "Simple architecture",
    moderate: "Moderate complexity",
    complex: "Complex (microservices/integrated)",
  },
  legacyDependencies: {
    none: "No legacy dependencies",
    some: "Some legacy systems",
    significant: "Significant legacy dependencies",
  },
  databaseType: {
    relational: "Relational (MySQL, PostgreSQL, etc.)",
    nosql: "NoSQL",
    mixed: "Mixed database types",
    "data-warehouse": "Data Warehouse",
    none: "No databases",
  },
  downTimeTolerrance: {
    zero: "Zero downtime required",
    minimal: "Minimal downtime acceptable",
    flexible: "Flexible maintenance window",
  },
  budgetRange: {
    "under-50k": "Under $50,000",
    "50k-200k": "$50,000 - $200,000",
    "200k-500k": "$200,000 - $500,000",
    "over-500k": "Over $500,000",
    "not-defined": "Not yet defined",
  },
  cloudExperience: {
    none: "No cloud experience",
    some: "Some cloud experience",
    experienced: "Experienced with cloud",
  },
  dedicatedTeam: {
    yes: "Yes, dedicated team",
    partial: "Partially dedicated",
    no: "No dedicated team",
  },
  timelineExpectation: {
    "1-3months": "1-3 months",
    "3-6months": "3-6 months",
    "6-12months": "6-12 months",
    "over-12months": "Over 12 months",
    flexible: "Flexible / No deadline",
  },
  complianceRequirements: {
    hipaa: "HIPAA (Healthcare)",
    gdpr: "GDPR (European Data)",
    pci: "PCI DSS (Payment Data)",
    sox: "SOX (Financial)",
    none: "No specific requirements",
  },
  numberOfServers: {
    "1-5": "1-5 servers",
    "6-20": "6-20 servers",
    "21-50": "21-50 servers",
    "51-100": "51-100 servers",
    "100+": "100+ servers",
  },
  dataVolume: {
    "under-100gb": "Under 100 GB",
    "100gb-1tb": "100 GB - 1 TB",
    "1tb-10tb": "1 TB - 10 TB",
    "10tb-100tb": "10 TB - 100 TB",
    "over-100tb": "Over 100 TB",
  },
}

function getDisplayValue(key: string, value: string | string[]): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return "None selected"
    return value.map((v) => labelMappings.complianceRequirements?.[v] || v).join(", ")
  }
  return labelMappings[key]?.[value] || value || "Not provided"
}

export default function ReviewPage() {
  const router = useRouter()
  const { data, setCurrentStep } = useWizard()

  const handleEdit = (step: number) => {
    setCurrentStep(step)
    router.push("/estimate")
  }

  const handleRunAnalysis = () => {
    router.push("/estimate/results")
  }

  const sections = [
    {
      title: "Infrastructure",
      step: 1,
      items: [
        { label: "Infrastructure Size", value: getDisplayValue("infrastructureSize", data.infrastructureSize) },
        { label: "Number of Servers", value: getDisplayValue("numberOfServers", data.numberOfServers) },
        { label: "Data Volume", value: getDisplayValue("dataVolume", data.dataVolume) },
      ],
    },
    {
      title: "Applications",
      step: 2,
      items: [
        {
          label: "Architecture Complexity",
          value: getDisplayValue("applicationComplexity", data.applicationComplexity),
        },
        { label: "Legacy Dependencies", value: getDisplayValue("legacyDependencies", data.legacyDependencies) },
        { label: "Database Type", value: getDisplayValue("databaseType", data.databaseType) },
      ],
    },
    {
      title: "Requirements",
      step: 3,
      items: [
        {
          label: "Compliance Requirements",
          value: getDisplayValue("complianceRequirements", data.complianceRequirements),
        },
        { label: "Downtime Tolerance", value: getDisplayValue("downTimeTolerrance", data.downTimeTolerrance) },
        { label: "Budget Range", value: getDisplayValue("budgetRange", data.budgetRange) },
      ],
    },
    {
      title: "Team & Timeline",
      step: 4,
      items: [
        { label: "Cloud Experience", value: getDisplayValue("cloudExperience", data.cloudExperience) },
        { label: "Dedicated Team", value: getDisplayValue("dedicatedTeam", data.dedicatedTeam) },
        { label: "Expected Timeline", value: getDisplayValue("timelineExpectation", data.timelineExpectation) },
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-3xl px-6 py-12">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <ClipboardCheck className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Review Your Answers</h1>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Please verify the information below. We will use these inputs to calculate your estimated cost range.
            </p>
          </div>

          {/* Assumptions Box */}
          <div className="mb-8 rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Assumptions for Estimation</h3>
                <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  <li>Cost estimates are based on typical cloud provider pricing models</li>
                  <li>Migration timeline affects labor costs proportionally</li>
                  <li>Compliance requirements add overhead to both cost and timeline</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Review Sections */}
          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.title} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
                  <h2 className="font-semibold text-foreground">{section.title}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(section.step)}
                    className="h-9 gap-2 rounded-lg text-muted-foreground hover:text-primary"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </div>
                <div className="divide-y divide-border">
                  {section.items.map((item) => (
                    <div key={item.label} className="flex items-start justify-between px-6 py-4">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="max-w-[55%] text-right text-sm font-medium text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-10 flex items-center justify-between border-t border-border pt-8">
            <Button
              variant="outline"
              onClick={() => handleEdit(4)}
              className="h-11 gap-2 rounded-xl bg-transparent px-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Questions
            </Button>
            <Button onClick={handleRunAnalysis} className="h-11 gap-2 rounded-xl px-8">
              Get Cost Estimate
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
