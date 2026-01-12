"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useWizard } from "@/lib/wizard-context"
import { analyzeData, type AnalysisResult } from "@/lib/analysis-engine"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  Info,
  ArrowLeft,
  DollarSign,
  Clock,
  TrendingUp,
  BookOpen,
  RotateCcw,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

function CostIndicator({ level }: { level: "low" | "medium" | "high" }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-8 w-4 rounded-md transition-colors",
              (level === "low" && i <= 1) || (level === "medium" && i <= 2) || (level === "high" && i <= 3)
                ? "bg-primary"
                : "bg-muted",
            )}
          />
        ))}
      </div>
      <span className="text-sm font-semibold capitalize text-foreground">
        {level === "low" && "Lower Cost"}
        {level === "medium" && "Moderate Cost"}
        {level === "high" && "Higher Cost"}
      </span>
    </div>
  )
}

export default function ResultsPage() {
  const { data } = useWizard()

  const results: AnalysisResult = useMemo(() => analyzeData(data), [data])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-3xl px-6 py-12">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-success/10">
              <CheckCircle2 className="h-7 w-7 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">Your Estimate is Ready</h1>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              Based on your inputs, here is an estimated cost range for your cloud migration project.
            </p>
          </div>

          {/* Important Disclaimer */}
          <div className="mb-8 rounded-2xl border border-warning/30 bg-warning/10 p-5">
            <div className="flex items-start gap-3">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-warning" />
              <div>
                <h3 className="font-semibold text-foreground">Important Notice</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  This is an estimation based on the information you provided, not a final quote. Actual costs may vary
                  depending on specific requirements, cloud provider choices, and market conditions.
                </p>
              </div>
            </div>
          </div>

          {/* Cost Estimate Card */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-primary/5 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Estimated Cost Range</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-4xl font-bold text-primary">{results.costEstimate.range}</p>
              <div className="mt-4">
                <CostIndicator level={results.costEstimate.level} />
              </div>

              {results.costEstimate.factors.length > 0 && (
                <div className="mt-6 rounded-xl border border-border bg-muted/30 p-5">
                  <h3 className="text-sm font-semibold text-foreground">Key Cost Factors</h3>
                  <ul className="mt-3 space-y-2">
                    {results.costEstimate.factors.map((factor) => (
                      <li key={factor} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <TrendingUp className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Migration Strategy Card */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-primary/5 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Recommended Migration Strategy</h2>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground">{results.migrationStrategy}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{results.strategyDescription}</p>
            </div>
          </div>

          {/* Timeline Estimate Card */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Estimated Timeline</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-3xl font-bold text-foreground">{results.timelineEstimate.range}</p>
              {results.timelineEstimate.factors.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {results.timelineEstimate.factors.map((factor) => (
                    <li key={factor} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-muted-foreground" />
                      {factor}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Risk Factors */}
          {results.risks.length > 0 && (
            <div className="mb-6 overflow-hidden rounded-2xl border border-warning/30 bg-card shadow-sm">
              <div className="border-b border-warning/30 bg-warning/5 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Factors That May Increase Costs</h2>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-4">
                  {results.risks.map((risk) => (
                    <li key={risk.title} className="rounded-xl border border-border bg-muted/30 p-4">
                      <h4 className="font-semibold text-foreground">{risk.title}</h4>
                      <p className="mt-1 text-sm text-muted-foreground">{risk.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {results.recommendations.length > 0 && (
            <div className="mb-6 overflow-hidden rounded-2xl border border-success/30 bg-card shadow-sm">
              <div className="border-b border-success/30 bg-success/5 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Recommendations</h2>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {results.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Considerations */}
          {results.considerations.length > 0 && (
            <div className="mb-6 rounded-2xl border border-border bg-muted/30 p-6">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Important Considerations</h3>
              <ul className="space-y-2">
                {results.considerations.map((consideration, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{consideration}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Educational Notes */}
          <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground">Understanding Cloud Costs</h2>
            </div>
            <div className="mt-5 space-y-4 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-foreground">Compute costs</span> are based on the virtual machines
                and processing power your applications require. Larger infrastructure typically means higher compute
                costs.
              </p>
              <p>
                <span className="font-semibold text-foreground">Data transfer costs</span> (egress fees) can be
                significant when moving data out of the cloud. Consider this when planning data-intensive applications.
              </p>
              <p>
                <span className="font-semibold text-foreground">Migration labor costs</span> vary based on team
                experience, complexity, and timeline. Rushed migrations often cost more due to overtime and potential
                issues.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <Link href="/estimate/review">
              <Button variant="outline" className="h-11 w-full gap-2 rounded-xl bg-transparent sm:w-auto">
                <ArrowLeft className="h-4 w-4" />
                Back to Review
              </Button>
            </Link>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/learn">
                <Button variant="outline" className="h-11 w-full gap-2 rounded-xl bg-transparent sm:w-auto">
                  <BookOpen className="h-4 w-4" />
                  Learn More
                </Button>
              </Link>
              <Link href="/estimate">
                <Button className="h-11 w-full gap-2 rounded-xl sm:w-auto">
                  <RotateCcw className="h-4 w-4" />
                  Start Over
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
