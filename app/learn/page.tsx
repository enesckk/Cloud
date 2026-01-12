import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Cloud,
  Server,
  Globe,
  TrendingUp,
  Shield,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Layers,
  Zap,
  RefreshCw,
  Trash2,
  Calculator,
} from "lucide-react"

export default function LearnPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-card">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-4xl px-6 py-16 md:py-20">
            <div className="flex items-center gap-2 text-sm text-primary">
              <BookOpen className="h-4 w-4" />
              <span>Education Module</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">Cloud Migration Education</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Everything you need to know about cloud computing and migration, explained in simple terms. No technical
              background required.
            </p>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="border-b border-border bg-muted/30">
          <div className="mx-auto max-w-4xl px-6 py-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">In This Guide</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                "What is Cloud Computing",
                "Why Companies Migrate",
                "Migration Strategies",
                "Common Risks",
                "Preparation Steps",
              ].map((item, index) => (
                <a
                  key={item}
                  href={`#section-${index + 1}`}
                  className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="space-y-16">
            {/* Section 1: What is Cloud Computing */}
            <section id="section-1" className="scroll-mt-24">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Cloud className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">What is Cloud Computing?</h2>
              </div>
              <div className="mt-6 rounded-xl border border-border bg-card p-6 md:p-8">
                <p className="text-muted-foreground leading-relaxed">
                  Cloud computing is the delivery of computing services over the internet. Instead of owning and
                  maintaining physical servers and data centers, organizations can rent access to these resources from
                  cloud providers like AWS, Microsoft Azure, or Google Cloud.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-border bg-muted/30 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Server className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">IaaS</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Infrastructure as a Service - rent virtual machines, storage, and networking
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Layers className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">PaaS</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Platform as a Service - development environments without managing infrastructure
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/30 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Globe className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-semibold text-foreground">SaaS</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Software as a Service - ready-to-use applications via web browser
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Why Companies Migrate */}
            <section id="section-2" className="scroll-mt-24">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Why Companies Migrate to the Cloud</h2>
              </div>
              <div className="mt-6 rounded-xl border border-border bg-card p-6 md:p-8">
                <p className="text-muted-foreground leading-relaxed">
                  Organizations choose cloud migration for various strategic and operational reasons. Understanding
                  these motivations helps align your migration goals with business objectives.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {[
                    {
                      icon: DollarSign,
                      title: "Cost Optimization",
                      description:
                        "Shift from capital expenditure to operational expenditure with pay-as-you-go pricing models",
                    },
                    {
                      icon: TrendingUp,
                      title: "Scalability",
                      description: "Scale resources up or down based on demand without purchasing additional hardware",
                    },
                    {
                      icon: Shield,
                      title: "Business Continuity",
                      description: "Built-in disaster recovery and backup capabilities improve system resilience",
                    },
                    {
                      icon: Zap,
                      title: "Innovation Speed",
                      description: "Access to modern tools and services accelerates development and deployment cycles",
                    },
                  ].map((item) => (
                    <div key={item.title} className="flex gap-4 rounded-lg border border-border bg-muted/30 p-5">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 3: Migration Strategies */}
            <section id="section-3" className="scroll-mt-24">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Cloud Migration Strategies</h2>
              </div>
              <div className="mt-6 rounded-xl border border-border bg-card p-6 md:p-8">
                <p className="text-muted-foreground leading-relaxed">
                  Different migration strategies suit different situations. The right approach depends on your
                  applications, timeline, budget, and technical requirements.
                </p>

                <Accordion type="single" collapsible className="mt-6">
                  <AccordionItem value="rehost" className="border-border">
                    <AccordionTrigger className="text-foreground hover:text-primary hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Server className="h-4 w-4 text-primary" />
                        Rehost (Lift and Shift)
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Move applications to the cloud without modifications. This is the fastest approach but may not
                      fully leverage cloud-native capabilities. Best for quick migrations with minimal risk tolerance.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="replatform" className="border-border">
                    <AccordionTrigger className="text-foreground hover:text-primary hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Layers className="h-4 w-4 text-primary" />
                        Replatform (Lift and Optimize)
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Make minor adjustments to optimize applications for the cloud environment without changing core
                      architecture. Balances speed with some cloud benefits.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="refactor" className="border-border">
                    <AccordionTrigger className="text-foreground hover:text-primary hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Zap className="h-4 w-4 text-primary" />
                        Refactor (Re-architect)
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Redesign applications to be cloud-native, taking full advantage of cloud services. Requires more
                      time and resources but provides the greatest long-term benefits.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="retire" className="border-border">
                    <AccordionTrigger className="text-foreground hover:text-primary hover:no-underline">
                      <div className="flex items-center gap-3">
                        <Trash2 className="h-4 w-4 text-primary" />
                        Retire or Replace
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      Decommission applications that are no longer needed or replace them with cloud-based alternatives.
                      This simplifies your portfolio and reduces migration complexity.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </section>

            {/* Section 4: Common Risks */}
            <section id="section-4" className="scroll-mt-24">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20 text-warning">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Common Migration Risks</h2>
              </div>
              <div className="mt-6 rounded-xl border border-border bg-card p-6 md:p-8">
                <p className="text-muted-foreground leading-relaxed">
                  Being aware of common pitfalls helps you prepare mitigation strategies and set realistic expectations
                  for your migration project.
                </p>

                <div className="mt-6 space-y-4">
                  {[
                    {
                      title: "Service Downtime",
                      description:
                        "Migration often requires periods where services are unavailable. Planning for maintenance windows and having rollback procedures minimizes business impact.",
                    },
                    {
                      title: "Data Loss or Corruption",
                      description:
                        "Data transfer errors can occur during migration. Implementing proper backup strategies and validation checks ensures data integrity.",
                    },
                    {
                      title: "Security Vulnerabilities",
                      description:
                        "Cloud environments have different security models. Understanding shared responsibility and configuring proper access controls is essential.",
                    },
                    {
                      title: "Unexpected Costs",
                      description:
                        "Without proper planning, cloud costs can exceed expectations. Data transfer fees and underutilized resources contribute to budget overruns.",
                    },
                    {
                      title: "Skills Gap",
                      description:
                        "Teams may lack cloud expertise, leading to configuration errors. Training and hiring before migration reduces this risk.",
                    },
                  ].map((risk) => (
                    <div key={risk.title} className="rounded-lg border border-warning/30 bg-warning/5 p-5">
                      <h3 className="flex items-center gap-2 font-semibold text-foreground">
                        <AlertTriangle className="h-4 w-4 text-warning" />
                        {risk.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">{risk.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 5: Preparation Steps */}
            <section id="section-5" className="scroll-mt-24">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Preparation Steps Before Migration</h2>
              </div>
              <div className="mt-6 rounded-xl border border-border bg-card p-6 md:p-8">
                <p className="text-muted-foreground leading-relaxed">
                  A successful cloud migration requires systematic preparation. Follow these steps to build a solid
                  foundation for your migration project.
                </p>

                <div className="mt-8 space-y-6">
                  {[
                    {
                      step: 1,
                      title: "Assess Current Infrastructure",
                      description:
                        "Document all applications, servers, databases, and dependencies. Understand resource usage patterns and identify candidates for migration.",
                    },
                    {
                      step: 2,
                      title: "Define Business Objectives",
                      description:
                        "Clarify what you want to achieve with migration. Common goals include cost reduction, improved scalability, or faster time to market.",
                    },
                    {
                      step: 3,
                      title: "Choose a Migration Strategy",
                      description:
                        "Select the appropriate approach for each application based on complexity, business criticality, and available resources.",
                    },
                    {
                      step: 4,
                      title: "Plan for Security and Compliance",
                      description:
                        "Identify regulatory requirements and design security controls that meet compliance standards in the cloud environment.",
                    },
                    {
                      step: 5,
                      title: "Prepare Your Team",
                      description:
                        "Ensure your team has the necessary cloud skills through training or by engaging external expertise for the migration project.",
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-5">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* CTA Section */}
        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <div className="rounded-2xl border border-border bg-card p-8 text-center md:p-12">
              <Calculator className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-6 text-xl font-bold text-foreground md:text-2xl">Ready to Estimate Costs?</h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Now that you understand cloud migration concepts, you can get a rough estimate of potential costs for
                your organization.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/estimate">
                  <Button size="lg" className="gap-2 px-8">
                    Get Cost Estimate
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="lg" variant="outline" className="px-8 bg-transparent">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
