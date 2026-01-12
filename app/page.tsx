"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookOpen, Calculator, ArrowRight, CheckCircle2, Cloud, Shield, TrendingUp, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const { user, logout } = useAuth()

  useEffect(() => {
    // Logout when user navigates to home page
    if (user) {
      logout()
    }
  }, []) // Only run on mount
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section - More welcoming and visual */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
                <Cloud className="h-4 w-4" />
                Free Educational Resource
              </div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
                Your Guide to
                <span className="text-primary"> Cloud Migration</span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
                Learn about cloud computing concepts, understand migration strategies, and get a rough estimate of
                potential costs - all in one place.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link href="/learn">
                  <Button size="lg" className="gap-2 px-8">
                    <BookOpen className="h-5 w-5" />
                    Start Learning
                  </Button>
                </Link>
                <Link href="/estimate">
                  <Button size="lg" variant="outline" className="gap-2 px-8 bg-transparent">
                    <Calculator className="h-5 w-5" />
                    Get Cost Estimate
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid gap-8 md:grid-cols-4">
              {[
                {
                  icon: BookOpen,
                  title: "Easy to Understand",
                  description: "No technical jargon - written for business users",
                },
                {
                  icon: Shield,
                  title: "No Sign-up Required",
                  description: "Access all content immediately, completely free",
                },
                {
                  icon: TrendingUp,
                  title: "Practical Guidance",
                  description: "Real-world strategies and considerations",
                },
                {
                  icon: Users,
                  title: "For Everyone",
                  description: "From startups to established enterprises",
                },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Two Modules Section */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">Choose Your Path</h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Both modules work independently. Use one or both based on your needs.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {/* Learn Module Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <BookOpen className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-foreground">Learn Cloud Migration</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Build your understanding of cloud computing, migration strategies, and best practices before making any
                decisions.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "What is cloud computing?",
                  "Why do companies migrate?",
                  "Migration strategies explained",
                  "Common risks and how to avoid them",
                  "Step-by-step preparation guide",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary" />
                    {item}
                  </div>
                ))}
              </div>

              <Link
                href="/learn"
                className="mt-8 inline-flex items-center gap-2 font-medium text-primary transition-all hover:gap-3"
              >
                Start Learning
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Estimate Module Card */}
            <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Calculator className="h-7 w-7" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-foreground">Estimate Migration Cost</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Answer simple questions about your setup and receive an estimated cost range for your cloud migration
                project.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Step-by-step questionnaire",
                  "Non-technical questions",
                  "Cost range estimation",
                  "Timeline projections",
                  "Key factors explained",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-primary" />
                    {item}
                  </div>
                ))}
              </div>

              <Link
                href="/estimate"
                className="mt-8 inline-flex items-center gap-2 font-medium text-primary transition-all hover:gap-3"
              >
                Get Estimate
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-4xl px-6 py-20">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">How It Works</h2>
              <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">Get started in three simple steps</p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Choose a Module",
                  description: "Decide if you want to learn first or jump straight to cost estimation",
                },
                {
                  step: "2",
                  title: "Explore Content",
                  description: "Read educational material or answer questions about your infrastructure",
                },
                {
                  step: "3",
                  title: "Get Insights",
                  description: "Gain knowledge or receive your personalized cost estimate range",
                },
              ].map((item) => (
                <div key={item.step} className="relative text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-4xl px-6 py-20">
          <div className="rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
            <h2 className="text-2xl font-bold md:text-3xl">Ready to Get Started?</h2>
            <p className="mx-auto mt-4 max-w-xl opacity-90">
              Whether you are just beginning your cloud journey or need to estimate costs, we are here to help.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/learn">
                <Button size="lg" variant="secondary" className="gap-2 px-8">
                  <BookOpen className="h-5 w-5" />
                  Learn First
                </Button>
              </Link>
              <Link href="/estimate">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-primary-foreground/30 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Calculator className="h-5 w-5" />
                  Estimate Cost
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
