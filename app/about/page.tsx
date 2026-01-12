import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Info,
  Shield,
  Eye,
  BookOpen,
  Target,
  AlertTriangle,
  Lightbulb,
  Calculator,
  CheckCircle2,
} from "lucide-react"

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border bg-card">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-4xl px-6 py-16 md:py-20">
            <div className="flex items-center gap-2 text-sm text-primary">
              <Info className="h-4 w-4" />
              <span>About CloudGuide</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold text-foreground md:text-4xl">About & Methodology</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              CloudGuide is an educational decision-support system designed to help organizations understand and plan
              their cloud migration journey. Learn how our system works and the principles behind it.
            </p>
          </div>
        </section>

        {/* Key Principles */}
        <section className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-2xl font-bold text-foreground">Our Approach</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Unlike automated migration tools or cloud provider recommendations, this system takes an educational
            approach. Our goal is not to make decisions for you, but to provide structured guidance that helps you make
            informed decisions based on your specific context.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Vendor Neutral",
                description: "We do not recommend specific cloud providers or products. Our focus is on methodology.",
              },
              {
                icon: Eye,
                title: "Transparent",
                description:
                  "All recommendations are explained with clear reasoning so you understand our suggestions.",
              },
              {
                icon: BookOpen,
                title: "Education First",
                description: "We prioritize helping you understand cloud migration concepts over quick answers.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <h2 className="text-2xl font-bold text-foreground">Rule-Based Analysis Logic</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              The analysis engine uses a rule-based approach to generate recommendations. Based on the information you
              provide, the system applies predefined rules derived from cloud migration best practices and industry
              standards.
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">Input Factors</h3>
                </div>
                <ul className="mt-4 space-y-2">
                  {[
                    "Infrastructure scale and complexity",
                    "Application architecture patterns",
                    "Legacy system dependencies",
                    "Compliance and regulatory needs",
                    "Team experience and resources",
                    "Timeline and budget constraints",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Lightbulb className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground">Output Analysis</h3>
                </div>
                <ul className="mt-4 space-y-2">
                  {[
                    "Recommended migration strategy",
                    "Cost range estimates",
                    "Timeline projections",
                    "Risk identification",
                    "Action recommendations",
                    "Considerations and caveats",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Scope and Limitations */}
        <section className="mx-auto max-w-4xl px-6 py-16">
          <h2 className="text-2xl font-bold text-foreground">Scope and Limitations</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            It is important to understand what this system can and cannot do. This transparency helps you use the tool
            appropriately as part of a broader decision-making process.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                </div>
                <h3 className="font-bold text-foreground">What We Do</h3>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>Provides structured guidance for migration planning</li>
                <li>Identifies potential risks based on common patterns</li>
                <li>Offers rough cost and timeline estimates</li>
                <li>Educates on cloud migration concepts</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-warning/30 bg-warning/5 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <h3 className="font-bold text-foreground">What We Do Not Do</h3>
              </div>
              <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                <li>Replace professional cloud consulting</li>
                <li>Provide exact cost calculations</li>
                <li>Account for all unique circumstances</li>
                <li>Guarantee migration outcomes</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Future Improvements */}
        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-4xl px-6 py-16">
            <h2 className="text-2xl font-bold text-foreground">Future Improvements</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              This system is designed to evolve. Here are areas we are exploring for future development.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                {
                  title: "Industry-Specific Guidance",
                  description: "Tailored recommendations for healthcare, finance, retail, and other industries.",
                },
                {
                  title: "Enhanced Cost Modeling",
                  description: "More granular inputs and regional pricing considerations.",
                },
                {
                  title: "Migration Checklists",
                  description: "Exportable checklists based on your specific migration scenario.",
                },
                {
                  title: "Case Study Library",
                  description: "Real-world migration examples illustrating different approaches.",
                },
              ].map((item, index) => (
                <div key={item.title} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-6 py-16">
          <div className="rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
            <Calculator className="mx-auto h-12 w-12" />
            <h2 className="mt-6 text-2xl font-bold">Ready to Get Started?</h2>
            <p className="mx-auto mt-4 max-w-xl opacity-90">
              Put this methodology into practice with your own migration scenario.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/estimate">
                <Button size="lg" variant="secondary" className="gap-2 px-8">
                  Get Cost Estimate
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/learn">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-primary-foreground/30 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Learn First
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
